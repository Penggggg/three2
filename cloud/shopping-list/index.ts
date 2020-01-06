import * as cloud from 'wx-server-sdk';
import * as TcbRouter from 'tcb-router';
import { find$ } from './find';

cloud.init({
    env: process.env.cloud
});

const db: DB.Database = cloud.database( );
const _ = db.command;

/** 
 * 转换格林尼治时区 +8时区
 * Date().now() / new Date().getTime() 是时不时正常的+8
 * Date.toLocalString( ) 好像是一直是+0的
 * 先拿到 +0，然后+8
 */
const getNow = ( ts = false ): any => {
    if ( ts ) {
        return Date.now( );
    }
    const time_0 = new Date( new Date( ).toLocaleString( ));
    return new Date( time_0.getTime( ) + 8 * 60 * 60 * 1000 )
}

/**
 * @description 行程清单模块
 * --------- 字段 ----------
 * tid
 * pid
 * sid ( 可为空 )
 * oids Array
 * uids Array
 * buy_status 0,1,2 未购买、已购买、买不全
 * base_status: 0,1 未调整，已调整
 * createTime
 * updateTime
 * ! acid 活动id
 * lastAllocated 剩余分配量
 * purchase 采购数量
 * adjustPrice 分配的数清单售价
 * adjustGroupPrice 分配的数清单团购价
 */
export const main = async ( event, context ) => {

    const app = new TcbRouter({ event });

    /**
     * @description
     * 判断请求的sid + tid + pid + count数组，返回不能购买的商品列表（清单里面买不到、买不全）、货全不足的商品（返回最新货存）
     * -------- 请求 ----------
     * {
     *!    from?: 'cart' | 'buy' | 'custom' | 'agents' | 'system'
     *     tid: string
     *!    openid?: string,
     *    list: { 
     *      tid
     *!     cid?: string
            sid
            pid
            price
            groupPrice
            count
     *!     desc?: string
            name,
            standername
            img
            type
            address: {
               name,
               phone,
               detail,
               postalcode
            }
     *     }[ ]
     * }
     * -------- 返回 ----------
     * {
     *      * 已购买( 风险单 )
     *      hasBeenBuy: {
     *          tid, 
     *          pid,
     *          sid
     *      }[ ]
     *      * 买不到
     *      cannotBuy: { 
     *          tid, 
     *          pid,
     *          sid
     *      }[ ]
     *      * 货存不足
     *       lowStock: { 
     *          tid, 
     *          pid,
     *          sid,
     *          count,
     *          stock
     *      }[ ]
     *      * 型号已被删除 / 商品已下架
     *      hasBeenDelete: {
     *          tid, 
     *          pid,
     *          sid
     *      }[ ],
     *      * 订单号列表
     *      orders
     * }
     */
    app.router('findCannotBuy', async( ctx, next ) => {
        try {

            const { tid, list } = event.data;
            const openId = event.data.openId || event.userInfo.openId;

            const getErr = message => ({
                message, 
                status: 500
            });

            if ( !tid ) {
                return ctx.body = getErr('无效行程');
            }

            // 查询行程是否还有效
            const trip$ = await db.collection('trip')
                .doc( String( tid ))
                .get( );

            if ( trip$.data.isClosed || getNow( true ) > trip$.data.end_date ) {
                return ctx.body = getErr('暂无购物行程～');
            }

            // 查询商品详情、或者型号详情
            const goodDetails$: any = await Promise.all( event.data.list.map( i => {

                if ( !!i.sid ) {
                    return db.collection('standards')
                        .where({
                            _id: i.sid
                        })
                        .get( )
                } else {
                    return db.collection('goods')
                        .where({
                            _id: i.pid
                        })
                        .get( )
                }
            }));

            /** 型号所属商品 */
            const belongGoodIds = Array.from( 
                new Set(
                    event.data.list
                        // .filter( i => !!i.sid )
                        .map( o => o.pid )
                )
            );

            const belongGoods$ = await Promise.all( belongGoodIds.map( pid => {
                return db.collection('goods')
                    .doc( String( pid ))
                    .get( );
            }));
           
            const goods = goodDetails$.map( x => x.data[ 0 ]).filter( y => !!y ).filter( z => !z.pid );
            const standards = goodDetails$.map( x => x.data[ 0 ]).filter( y => !!y ).filter( z => !!z.pid );
            const belongGoods = belongGoods$.map( x => x.data );

            // 限购
            let hasLimitGood: any = [ ];

            // 库存不足
            let lowStock: any = [ ];

            // 被删除
            let hasBeenDelete: any = [ ];

            // 买不到
            const cannotBuy = [ ];

            // 已经被购买了（风险单）
            const hasBeenBuy = [ ];

            event.data.list.map( i => {
                // 型号 - 计算已被删除、库存不足、主体本身被下架/删除
                if ( !!i.sid ) {
                    const belongGood = belongGoods.find( x => x._id === i.pid );
                    const standard = standards.find( x => x._id === i.sid && x.pid === i.pid );

                    // 型号本身被删除、主体本身被下架/删除
                    if ( !standard || ( !!standard && standard.isDelete ) || ( !!belongGood && !belongGood.visiable ) || ( !!belongGood && belongGood.isDelete )) {
                        hasBeenDelete.push( i );
                    } else if ( standard.stock !== undefined && standard.stock !== null &&  standard.stock < i.count ) {
                        lowStock.push( Object.assign({ }, i, {
                            stock: standard.stock,
                            goodName: i.name,
                            standerName: i.standername
                        }));
                    }
                // 主体商品 - 计算已被删除、库存不足
                } else {
                    const good = goods.find( x => x._id === i.pid );
                    if ( !good || ( !!good && !good.visiable ) || ( !!good && good.isDelete )) {
                        hasBeenDelete.push( i )
                    } else if ( good.stock !== undefined && good.stock !== null && good.stock < i.count ) {
                        lowStock.push( Object.assign({ }, i, {
                            stock: good.stock,
                            goodName: i.name
                        }));
                    }
                }
            });


            // 查询限购
            const limitGoods = belongGoods.filter( x => !!x.limit );

            await Promise.all( limitGoods.map( async good => {

                const orders = await db.collection('order')
                    .where({
                        tid,
                        pid: good._id,
                        openid: openId,
                        pay_status: _.or( _.eq('1'), _.eq('2'))
                    })
                    .get( );

                const hasBeenBuyCount = orders.data.reduce(( x, y ) => {
                    return x + y.count
                }, 0 );

                const thisTripBuyCount = event.data.list
                    .filter( x => x.pid === good._id )
                    .reduce(( x, y ) => {
                        return x + y.count
                    }, 0 );
                    
                if ( thisTripBuyCount + hasBeenBuyCount > good.limit ) {
                    hasLimitGood.push( good );
                }
            }));
            

            let orders = [ ];
            /**
             * 如果可以购买
             * ! 批量创建预付订单
             */
            if ( hasLimitGood.length === 0 && lowStock.length === 0 && cannotBuy.length === 0 && hasBeenDelete.length === 0 ) {

                const reqData = {
                    tid,
                    openId,
                    from: event.data.from || 'system',
                    orders: event.data.list
                }

                const createOrder$ = await cloud.callFunction({
                    data: {
                        data: reqData,
                        $url: 'create'
                    },
                    name: 'order'
                });

                if ( createOrder$.result.status !== 200 ) {
                    return ctx.body = {
                        status: 500,
                        message: '创建预付订单失败！'
                    };
                }
                orders = createOrder$.result.data;
            }

            return ctx.body = {
                data: {
                    orders,
                    lowStock,
                    cannotBuy,
                    hasLimitGood,
                    hasBeenBuy,
                    hasBeenDelete,
                },
                status: 200
            }

        } catch ( e ) {
     
            return ctx.body = {
                status: 500,
                message: e
            };
        }
    });

    /**
     * @description
     * 由订单创建购物清单
     * openId
     * list: {
     *    tid,
     *    pid,
     *    sid,
     *    oid,
     *    price,
     *    groupPrice,
     *!   acid
     * }[ ]
     * 
     * 并返回购买推送通知的数据结构
     * {
     *      当前的买家
     *      buyer: {
     *          delta,
     *          openid,
     *          type: 'buy' | 'buyPin' | 'waitPin' ( 权重越来越高 )
     *      }
     *      拼团成功的其他买家
     *      others: [
     *            openid
     *            acid
     *            sid
     *            pid
     *            tid
     *            delta
     *      ]
     * }
     */
    app.router('create', async( ctx, next ) => {
        try {

            let others: any = [ ];
            let buyer: any = null;
            let buyerBuyPinDelta = 0;
            let buyerWaitPinDelta = 0;

            const { list, openId } = event.data;
 
            await Promise.all( list.map( async orderMeta => {
                const { tid, pid, sid, oid, price, groupPrice, acid } = orderMeta;
                let query = {
                    tid,
                    pid
                };
                
                if ( !!sid ) {
                    query['sid'] = sid;
                }

                // 插入活动的查询条件
                if ( !!acid ) {
                    query = Object.assign({ }, query, {
                        acid
                    });
                }

                const find$ = await db.collection('shopping-list')
                    .where( query )
                    .get( );

                // 创建采购单
                if ( find$.data.length === 0 ) {

                    // 处理推送：buyer
                    if ( !buyer && !groupPrice ) {
                        buyer = {
                            openid: openId,
                            type: 'buy',
                            delta: 0
                        };
                    } else {
                        buyerWaitPinDelta += Number(( price - groupPrice ).toFixed( 0 ));
                        buyer = {
                            openid: openId,
                            type: 'waitPin',
                            delta: buyerWaitPinDelta
                        };
                    }

                    const meta = Object.assign({ }, query, {
                        acid: acid || undefined
                    }, {
                        oids: [ oid ],
                        uids: [ openId ],
                        purchase: 0,
                        buy_status: '0',
                        base_status: '0',
                        adjustPrice: price,
                        adjustGroupPrice: groupPrice,
                        createTime: getNow( true )
                    });
     
                    const create$ = await db.collection('shopping-list')
                        .add({
                            data: meta
                        });

                    return;

                // 更新插入
                } else {
                    let metaShoppingList = find$.data[ 0 ];
                    if ( !metaShoppingList.oids.find( x => x === oid )) {
                        const lastOids = metaShoppingList.oids;
                        const lastUids = metaShoppingList.uids;
                        const lastAdjustPrice = metaShoppingList.adjustPrice;
                        const lastAdjustGroupPrice = metaShoppingList.adjustGroupPrice;

                        // 处理推送：buyer、others
                        if ( !!lastAdjustGroupPrice ) {

                            const currentDelta = Number(( lastAdjustPrice - lastAdjustGroupPrice ).toFixed( 0 ));
                            

                            // buyer拼团成功
                            if ( lastUids.filter( x => x !== openId ).length > 0 ) {

                                buyerBuyPinDelta += currentDelta;
                                if ( !buyer || ( !!buyer && buyer.type === 'buy' )) {
                                    buyer = {
                                        openid: openId,
                                        type: 'buyPin',
                                        delta: buyerBuyPinDelta
                                    }
                                }
                            // buyer待拼
                            } else {
                                buyerWaitPinDelta += currentDelta;
                                buyer = {
                                    openid: openId,
                                    type: 'waitPin',
                                    delta: buyerWaitPinDelta
                                }

                            }

                            // 处理 other
                            if ( !lastUids.find( x => x === openId ) && lastUids.length === 1 ) {
                                others.push({
                                    pid,
                                    tid,
                                    sid: sid || undefined,
                                    acid: acid || undefined,
                                    openid: lastUids[ 0 ],
                                    delta: currentDelta,
                                })
                            }
                        } else {
                            if ( !buyer ) {
                                buyer = {
                                    openid: openId,
                                    type: 'buy',
                                    delta: 0
                                };
                            }
                        }

                        // 插入到头部，最新的已支付订单就在上面
                        lastOids.unshift( oid );

                        if ( !lastUids.find( x => x === openId )) {
                            lastUids.unshift( openId );
                        }

                        const update$ = await db.collection('shopping-list').doc( String( find$.data[ 0 ]._id ))
                            .update({
                                data: {
                                    oids: lastOids,
                                    uids: lastUids,
                                    updateTime: getNow( true )
                                }
                            })
                    }
                    return;
                }

            }));

            return ctx.body = {
                status: 200,
                data: {
                    buyer,
                    others
                }
            }

        } catch ( e ) { return ctx.body = { status: 500 }}
    });

    /**
     * @description 
     * {
     *     tid, 
     *     needOrders 是否需要返回订单
     * }
     * 行程的购物清单，用于调整商品价格、购买数量
     */
    app.router('list', async( ctx, next ) => {
        try {

            let orders$: any = [ ];

            const { tid, needOrders,  } = event.data;
            const openid = event.data.openId || event.userInfo.openId;
            
            
            // 拿到行程下所有的购物清单
            const lists$ = await db.collection('shopping-list')
                .where({
                    tid
                })
                .get( );
           
            // 查询每条清单底下的每个order详情，这里的每个order都是已付订金的
            if ( needOrders !== false ) {
                orders$ = await Promise.all( lists$.data.map( list => {
                    return Promise.all( list.oids.map( async oid => {
    
                        const order$ = await db.collection('order').doc( oid )
                            .get( );
    
                        const user$ = await db.collection('user')
                            .where({
                                openid: order$.data.openid
                            })
                            .get( );
    
                        return Object.assign({ }, order$.data, {
                            user: user$.data[ 0 ]
                        });
                    }));
                }));
            }

            // 查询每条清单底下每个商品的详情
            const goods$: any = await Promise.all( lists$.data.map( async list => {

                const { pid, sid } = list;
                const collectionName = !!sid ? 'standards' : 'goods';

                // 型号
                let standar$: any = null;

                // 商品
                const good$ = await db.collection('goods')
                    .doc( pid )
                    .get( );

                if ( !!sid ) {
                    standar$ = await db.collection('standards')
                        .doc( sid )
                        .get( );
                }

                return {
                    tag: good$.data.tag,
                    title: good$.data.title,
                    name: standar$ ? standar$.data.name : '',
                    price: standar$ ? standar$.data.price : good$.data.price,
                    img: standar$ ? standar$.data.img : good$.data.img[ 0 ],
                    groupPrice: standar$ ? standar$.data.groupPrice : good$.data.groupPrice,
                }
            }));

            // 查询清单对应的活动详情
            const activities$: any = await Promise.all( lists$.data.map( async list => {
                const { acid } = list;
                if ( !acid ) {
                    return {
                        ac_price: null,
                        ac_groupPrice: null
                    }
                } else {
                    const meta = await db.collection('activity')
                        .doc( String( acid ))
                        .get( );
                    return {
                        ac_price: meta.data.ac_price,
                        ac_groupPrice: meta.data.ac_groupPrice,
                    }
                }
            }));

            const list = lists$.data.map(( l, k ) => {
                const { ac_groupPrice, ac_price } = activities$[ k ];
                const { img, price, groupPrice, title, name, tag } = goods$[ k ];
                let meta = Object.assign({ }, l, {
                    tag,
                    img,
                    price,
                    groupPrice,
                    goodName: title,
                    standarName: name,
                    ac_groupPrice,
                    ac_price
                });

                if ( needOrders !== false ) {
                    meta = Object.assign({ }, meta, {
                        order: orders$[ k ],
                        total: orders$[ k ].reduce(( x, y ) => {
                            return x + y.count;
                        }, 0 )
                    })
                }

                return meta;
            });

            return ctx.body = {
                status: 200,
                data: list,
            }

        } catch ( e ) { return ctx.body = { status: 500 };}
    })

    /**
     * 购物清单调整
     * -------- 请求
     * {
     *    shoppingId, adjustPrice, purchase, adjustGroupPrice
     * }
     */
    app.router('adjust', async( ctx, next ) => {
        try {
            
            const { shoppingId, adjustPrice, adjustGroupPrice } = event.data;

            /**
             * 清单，先拿到订单采购总数
             * 随后更新：采购量、清单售价、清单团购价、base_status、buy_status
             */
            const shopping$ = await db.collection('shopping-list')
                .doc( shoppingId )
                .get( );
   
            console.log('111111', shopping$ );

            const orders$ = await Promise.all( shopping$.data.oids.map( oid => {
                return db.collection('order')
                    .doc( oid )
                    .get( );
            }));

            console.log('2222222', orders$ );

            // 剩余分配量
            let lastAllocated = 0;

            /**
             * 总分配量
             */
            let purchase = event.data.purchase;

            /**
             * ! 传入分配量不能少于。已完成分配订单的数额之和
             */
            const finishAdjustOrders = orders$
                .map(( x: any ) => x.data )
                .filter( o => o.base_status === '2' );

            console.log('333333', finishAdjustOrders);

            // 已分配量
            const hasBeenAdjust = finishAdjustOrders.reduce(( x, y ) => {
                return x + y.allocatedCount;
            }, 0 );

            console.log('444444', hasBeenAdjust );

            if ( purchase < hasBeenAdjust ) {
                return ctx.body = {
                    status: 500,
                    message: `有${finishAdjustOrders.length}个订单已确认，数量不能少于${hasBeenAdjust}件`
                }
            }
            
            let needBuyTotal = orders$.reduce(( x, y ) => {
                return x + (y as any).data.count;
            }, 0 );

            const temp = Object.assign({ }, shopping$.data, {
                purchase,
                adjustPrice,
                adjustGroupPrice,
                base_status: '1',
                buy_status: purchase < needBuyTotal ? '2' : '1',
                updateTime: getNow( true )
            });

            delete temp['_id'];

            console.log('555555', temp)

            // 更新清单
            await db.collection('shopping-list')
                .doc( shoppingId )
                .set({
                    data: temp
                });

            /**
             * !以下订单都是已付订金的
             * 订单：批量对订单的价格、团购价、购买状态进行调整(已购买/进行中，其他已经确定调整的订单，不做处理)
             * 其实应该也要自动注入订单数量（策略：先到先得，后下单会有得不到单的风险）
             * !如果已经分配过了，则不再自动分配采购量
             */
            const sorredOrders = orders$
                .map(( x: any ) => x.data )
                .filter(( x: any ) => x.base_status === '0' || x.base_status === '1' )
                .sort(( x: any, y: any ) => x.createTime - y.createTime );

            console.log('666666', sorredOrders );

            // 剩余分配量
            purchase -= hasBeenAdjust;

            console.log( '777', purchase );
        
            await Promise.all( sorredOrders.map( async order => {

                const baseTemp = {
                    allocatedPrice: adjustPrice,
                    allocatedGroupPrice: adjustGroupPrice,
                    // 无论自动分配是否成功，都是被“分配”操作过的
                    base_status: '1',
                    /**
                     * ! v1: 剩余分配量不足采购量就分配0
                     * ! v2: 剩余分配量不足采购量，就分配剩余的采购量
                     */
                    // allocatedCount: purchase - order.count >= 0 ? order.count : 0
                    allocatedCount: purchase - order.count >= 0 ?
                        order.count :
                        purchase
                };
                
                // 分配成功
                if ( purchase - order.count >= 0 ) {
                    lastAllocated = purchase - order.count;
                    purchase -= order.count;

                // 货源不足，分配最后的剩余量
                } else {
                    lastAllocated = 0;
                    purchase = 0;
                }

                const temp = Object.assign({ }, order, baseTemp );

                delete temp['_id'];
                
                await db.collection('order')
                    .doc( order._id )
                    .set({
                        data: temp
                    });
                
                return;

            }));

            // 更新清单的剩余分配数
            await db.collection('shopping-list')
                .doc( shoppingId )
                .update({
                    data: { lastAllocated }
                });
        
            return ctx.body = {
                status: 200
            }

        } catch ( e ) { return ctx.body = { status: 500 };}
    })

    /**
     * @description
     * 获取行程里是否还有未调整的清单
    */
    app.router('adjust-status', async( ctx, next ) => {
        try {
            const { tid } = event.data;
            const count = await db.collection('shopping-list')
                .where({
                    tid,
                    base_status: '0'
                })
                .count( );

            return ctx.body = {
                status: 200,
                data: count.total
            }

        } catch ( e ) {
            return ctx.body = { status: 500 };
        }
    })

    /**
     * @description
     * 等待拼团列表 / 可拼团列表 ( 可指定商品: 商品详情页面 )
     * {
     *    tid,
     *    pid,
     *    limit
     *    detail: boolean 是否带回商品详情（默认带回）
     *    showUser: boolean 是否需要用户头像等信息（默认不带回）
     *    type:  'wait' | 'pin' | 'all' // 等待拼团、已拼团、等待拼团+已拼团、所有购物清淡
     * }
     */
    app.router('pin', async( ctx, next ) => {
        try {

            let bjpConfig: any = null;
            const openid = event.userInfo.openId;
            const { tid, detail, pid, type, limit } = event.data;
            const showUser = event.data.showUser || false;

            const query = pid ? {
                tid,
                pid
            } : {
                tid
            };

            let shopping$;
            if ( limit ) {
                shopping$ = await db.collection('shopping-list')
                    .where( query )
                    .limit( limit )
                    .get( );
            } else {
                shopping$ = await db.collection('shopping-list')
                    .where( query )
                    .get( );
            }
            
            // 保健品配置
            const bjpConfig$ = await db.collection('app-config')
            .where({
                type: 'app-bjp-visible'
            })
            .get( );
            bjpConfig = bjpConfig$.data[ 0 ];

            // uids长度为1，为待拼列表 ( 查询待拼列表时，可以有自己，让客户知道系统会列出来 )
            // uids长度为2，为可以拼团列表
            let data: any = [ ];
            let data$ = shopping$.data.filter( s => {
                if ( type === 'pin' ) {
                    return ( !!s.adjustGroupPrice || !!s.groupPrice ) && s.uids.length > 1;

                } else if ( type === 'wait' ) {
                    return ( !!s.adjustGroupPrice || !!s.groupPrice ) && s.uids.length === 1;

                } else if ( type === undefined ) {
                    return ( !!s.adjustGroupPrice || !!s.groupPrice );
                } else {
                    return true;
                }
            });

            data$ = data$.sort(( x, y ) => y.uids.length - x.uids.length );
            data = data$;

            // 商品
            const goodIds = Array.from(
                new Set( data$.map( list => 
                    list.pid
                ))
            );

            // 型号
            const standarsIds = Array.from(
                new Set( data$.map( list => 
                    list.sid
                ))
            ).filter( x => !!x );

            // 商品
            let allGoods$: any = await Promise.all( goodIds.map( goodId => {
                return db.collection('goods')
                    .doc( String( goodId ))
                    .get( );
            }));

            allGoods$ = allGoods$.map( x => x.data );

            // 查询每条清单底下每个商品的详情
            if ( detail === undefined || !!detail ) {

                // 型号
                let allStandars$: any = await Promise.all( standarsIds.map( sid => {
                    return db.collection('standards')
                        .doc( String( sid ))
                        .get( );
                }));

                allStandars$ = allStandars$.map( x => x.data );

                const good$ = data$.map( list => {

                    const { pid, sid } = list;
                    const good: any = allGoods$.find( x => x._id === pid );
                    const standar = allStandars$.find( x => x._id === sid );
    
                    return {
                        good,
                        tag: good.tag,
                        title: good.title,
                        saled: good.saled,
                        name: standar ? standar.name : '',
                        price: standar ? standar.price : good.price,
                        img: standar ? standar.img : good.img[ 0 ],
                        groupPrice: standar ? standar.groupPrice : good.groupPrice,
                    }
                });
    
                // 注入商品详情
                data = data$.map(( shopping, k ) => {
                    return {
                        ...shopping, 
                        detail: good$[ k ]
                    };
                });

            }

            // 展示用户头像
            if ( showUser ) {

                let uids: string[ ] = [ ];
                data$.map( list => {
                    uids = [ ...uids, ...list.uids ];
                });

                uids = Array.from(
                    new Set( uids )
                );
 
                let users$: any = await Promise.all( uids.map( uid => {
                    return db.collection('user')
                        .where({
                            openid: uid
                        })
                        .field({
                            openid: true,
                            avatarUrl: true,
                            nickName: true
                        })
                        .get( );
                }));

                users$ = users$.map( x => x.data[ 0 ]);

                data = data.map(( shopping, k ) => {
                    return {
                        ...shopping,
                        users: shopping.uids.map( uid => users$.find( x => x.openid === uid ))
                    }
                });

            }
            
            // 根据保健品设置进行相应的过滤
            if ( !!bjpConfig && !bjpConfig.value ) {
                const meta = data
                    .filter( x => {
                        const good = allGoods$.find( y => y._id === x.pid );
                        return String( good.category ) !== '4'
                    });
                data = meta;
            }

            return ctx.body = {
                data,
                status: 200
            }

        } catch ( e ) {
            return ctx.body = { status: 500 };
        }
    });

    /** 
     * @description
     * 仙女购物清单 ( 买了多少、卡券多少、省了多少 )
     */
    app.router('fairy-shoppinglist', async( ctx, next ) => {
        try {

            const { tid } = event.data;
            const limit = event.data.limit || 5;

            /** 行程购物清单 */
            const shoppingMeta$ = await db.collection('shopping-list')
                .where({
                    tid
                })
                .get( );
            
        
            /** 所有uid（含重复） */
            let uids: any = [ ];
            shoppingMeta$.data.map( sl => {
                uids = [ ...uids, ...sl.uids ];
            });

            /** 处理优化
             * 让购买量更多的用户，展示在前面
             */
            let uidMapTimes: {
                [ key: string ] : number
            } = { };
            uids.map( uidstring => {
                if ( !uidMapTimes[ uidstring ]) {
                    uidMapTimes = Object.assign({ }, uidMapTimes, {
                        [ uidstring ]: 1
                    })
                } else {
                    uidMapTimes = Object.assign({ }, uidMapTimes, {
                        [ uidstring ]: uidMapTimes[ uidstring ] + 1
                    })
                }
            });

            /** 前5名的用户id */
            const userIds = Object.entries( uidMapTimes )
                .sort(( x, y ) => 
                    y[ 1 ] - x[ 1 ]
                )
                .slice( 0, limit )
                .map( x => x[ 0 ]);

            /** 每个用户的信息 */
            const users$ = await Promise.all( userIds.map( uid => Promise.all([
                db.collection('user')
                    .where({
                        openid: uid
                    })
                    .get( )
            ])));

            /** 前5人的卡券 */
            const coupons$: any = await Promise.all(
                userIds.map( uid => 
                    db.collection('coupon')
                        .where(_.or([
                            {
                                tid,
                                openid: uid
                            }, {
                                openid: uid,
                                canUseInNext: true
                            }
                        ]))
                        .field({
                            type: true,
                            value: true,
                            openid: true
                        })
                        .get( )
                )
            )

            /** 前5个人总的购物清单 */
            const shoppingMetaFilter = shoppingMeta$.data.filter( s => 
                !!userIds.find( uid => 
                    s.uids.find( 
                        u => u === uid
                    )
            ));

            /** 商品id */
            const pIds = Array.from(
                new Set( 
                    shoppingMetaFilter
                        .map( s => s.pid )
                )
            );

            /** 商品详情 */            
            const details$ = await Promise.all( pIds.map( pid => {
                return db.collection('goods')
                    .doc( pid )
                    .field({
                        _id: true,
                        tag: true,
                        img: true,
                        title: true
                    })
                    .get( )
            }));

            /** 购物清单注入商品详情 */
            const shoppingInject = shoppingMetaFilter.map( sl => {
                const detail = details$.find( x => x.data._id === sl.pid );
                if ( detail ) {
                    return Object.assign({ }, sl, {
                        detail: detail.data
                    });
                } else {
                    return Object.assign({ }, sl );
                }
            });

            /** 返回结果 */
            const metaData = users$.map(( x, k ) => {
                return {
                    user: x[ 0 ].data[ 0 ],
                    coupons: coupons$[ k ].data, 
                    shoppinglist: shoppingInject.filter( sl => sl.uids.find( uid => uid === x[ 0 ].data[ 0 ].openid ))
                }
            });

            return ctx.body = {
                status: 200,
                data: metaData
            }

        } catch ( e ) {
            return ctx.body = { status: 500 };
        }
    })

    /**
     * @description
     * 个人的等待拼团任务列表
     * {
     *    openid？
     * }
     */
    app.router('pin-task', async( ctx, next ) => {
        try {
            const openid = event.data.openId || event.data.openid || event.userInfo.openId;

            // 先找到当前的行程
            const trips$ = await cloud.callFunction({
                data: {
                    $url: 'enter'
                },
                name: 'trip'
            });
            const trips = trips$.result.data;
            const trip = trips[ 0 ];

            if ( !trip ) {
                return ctx.body = {
                    data: [ ],
                    status: 200
                };
            }

            // 获取当前行程的未拼团列表
            const shopping$ = await db.collection('shopping-list')
                .where({
                    tid: trip._id,
                    uids: openid
                })
                .get( );

            // 查询清单底下的个人订单
            const all$ = await Promise.all(
                shopping$.data.map( async shopping => {
                    const { pid, sid, tid } = shopping;

                    // 获取订单
                    const allOrders$ = await db.collection('order')
                        .where({
                            pid, 
                            sid, 
                            tid,
                            openid,
                            pay_status: '1',
                            base_status: _.or( _.eq('0'), _.eq('1'), _.eq('2'))
                        })
                        .get( );
                    const count = allOrders$.data.reduce(( x, y ) => {
                        return x + y.count;
                    }, 0 );

                    // 是否有拼团成功
                    const groupMenOrders$ = await db.collection('order')
                        .where({
                            pid, 
                            sid, 
                            tid,
                            openid: _.neq( openid ),
                            pay_status: '1',
                            base_status: _.or( _.eq('0'), _.eq('1'), _.eq('2'))
                        })
                        .count( );

                    // 获取商品详情
                    const good$ = await db.collection('goods')
                        .doc( String( pid ))
                        .field({
                            title: true,
                            img: true
                        })
                        .get( );

                    // 获取型号详情
                    let standard: any = undefined;
                    if ( !!sid ) {
                        const standard$ = await db.collection('standards')
                            .doc( String( sid ))
                            .field({
                                name: true,
                                img: true
                            })
                            .get( );
                        standard = standard$.data;
                    }

                    return {
                        count,
                        ...shopping,
                        type: 'shoppinglist',
                        isPin: groupMenOrders$.total > 0,
                        detail: {
                            ...good$.data,
                            img: standard ? standard.img : good$.data.img[ 0 ],
                            name: standard ? standard.name : ''
                        }
                    }
                })
            );

            // 查询优惠券领用情况
            // 行程立减金额/行程满减金额/行程代金券金额
            const { reduce_price } = trip;

            // 行程立减代金券
            const lijian$ = await db.collection('coupon')
                .where({
                    openid,
                    tid: trip._id,
                    type: 't_lijian'
                })
                .get( );
            const lijian = lijian$.data[ 0 ];
            
            const t_total = reduce_price;
            const t_current = !!lijian ?
                lijian.value : 0;
            const t_delta = Number(( reduce_price - t_current ).toFixed( 2 ));

            return ctx.body = {
                status: 200,
                data: [
                    {
                        type: 't_lijian',
                        t_total,
                        t_current,
                        t_delta
                    },
                    ...all$
                ]
            };

        } catch ( e ) {
            return ctx.body = {
                status: 500
            };
        }
    })

    return app.serve( );

}