import * as cloud from 'wx-server-sdk';
import * as TcbRouter from 'tcb-router';
import { find$ } from './find';

cloud.init( );

const db: DB.Database = cloud.database( );
const _ = db.command;

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

            // 不能购买的商品列表（清单里面买不全）
            const findings$: any = await Promise.all( event.data.list.map( i => {
                return find$({
                    tid: i.tid,
                    pid: i.pid,
                    sid: i.sid,
                    buy_status: '2'
                }, db, ctx )
            }))

            if ( findings$.some( x => x.status !== 200 )) {
                throw '查询购物清单错误';
            }

            // 已完成购买的商品列表
            const hasBeenBuy$: any = await Promise.all( event.data.list.map( i => {
                return find$({
                    tid: i.tid,
                    pid: i.pid,
                    sid: i.sid,
                    buy_status: '1'
                }, db, ctx )
            }));

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
           
            const goods = goodDetails$.map( x => x.data[ 0 ]).filter( y => !!y ).filter( z => !z.pid );
            const standards = goodDetails$.map( x => x.data[ 0 ]).filter( y => !!y ).filter( z => !!z.pid );

            // 库存不足
            let lowStock: any = [ ];

            // 被删除
            let hasBeenDelete: any = [ ];

            // 买不到
            const cannotBuy = findings$.map( x => x.data[ 0 ]).filter( y => !!y );

            // 已经被购买了（风险单）
            const hasBeenBuy = hasBeenBuy$.map( x => x.data[ 0 ]).filter( y => !!y )

            event.data.list.map( i => {
                // 型号
                if ( !!i.sid ) {
                    const standard = standards.find( x => x._id === i.sid && x.pid === i.pid );
                    if ( !standard ) {
                        hasBeenDelete.push( i );
                    } else if ( standard.stock !== undefined &&  standard.stock < i.count ) {
                        lowStock.push( Object.assign({ }, i, {
                            stock: standard.stock,
                            goodName: i.name,
                            standerName: i.standername
                        }));
                    }
                // 主体商品
                } else {
                    const good = goods.find( x => x._id === i.pid );
                    if ( !good || ( !!good && !good.visiable )) {
                        hasBeenDelete.push( i )
                    } else if ( good.stock !== undefined &&  good.stock < i.count ) {
                        lowStock.push( Object.assign({ }, i, {
                            stock: good.stock,
                            goodName: i.name
                        }));
                    }

                }
            });

            let orders = [ ];
            /**
             * 如果可以购买
             * ! 批量创建预付订单
             */
            if ( lowStock.length === 0 && cannotBuy.length === 0 && hasBeenDelete.length === 0 ) {

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
                    lowStock,
                    hasBeenDelete,
                    cannotBuy,
                    hasBeenBuy,
                    orders
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
     * list: {
     *    tid,
     *    pid,
     *    sid,
     *    oid,
     *    price,
     *    groupPrice,
     *!   acid
     * }[ ]
     */
    app.router('create', async( ctx, next ) => {
        try {

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
                query = Object.assign({ }, query, {
                    acid: acid || _.eq( undefined )
                });

                const find$ = await db.collection('shopping-list')
                    .where( query )
                    .get( );

                if ( find$.data.length === 0 ) {

                    const meta = Object.assign({ }, query,{
                        acid: acid || undefined
                    },{
                        oids: [ oid ],
                        uids: [ openId ],
                        purchase: 0,
                        buy_status: '0',
                        base_status: '0',
                        adjustPrice: price,
                        adjustGroupPrice: groupPrice,
                        createTime: new Date( ).getTime( )
                    });
     
                    const creaet$ = await db.collection('shopping-list')
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
                                    updateTime: new Date( ).getTime( )
                                }
                            })
                    }
                    return;
                }

            }));

            return ctx.body = {
                status: 200
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
     * "看看他人买了什么"
     */
    app.router('list', async( ctx, next ) => {
        try {

            let orders$: any = [ ];
            const { tid, needOrders } = event.data;
            
            
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
                updateTime: new Date( ).getTime( )
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
     * 等待拼团列表 / 可拼团列表
     * {
     *    tid,
     *    pid,
     *    detail: boolean 是否带回商品详情
     *    !（可无）type: 'wait' | 'pin' // 等待拼团，已经可以拼团
     * }
     */
    app.router('pin', async( ctx, next ) => {
        try {

            const openid = event.userInfo.openId;
            const type = event.data.type || 'pin';
            const { tid, detail, pid } = event.data;

            const query = pid ? {
                tid,
                pid
            } : {
                tid
            };

            const shopping$ = await db.collection('shopping-list')
                .where( query )
                .get( );

            // uids长度为1，为待拼列表 ( 不应该有自己 )
            // uids长度为2，为可以拼团列表
            // 拼团、等待拼团
            let data: any = [ ];
            const data$ = shopping$.data.filter( s => {
                if ( type === 'pin' ) {
                    return !!s.adjustGroupPrice && s.uids.length > 1

                } else if ( type === 'wait' ) {
                    return !!s.adjustGroupPrice && s.uids.length === 1 && s.uids[ 0 ] !== openid

                } else {
                    return ( !!s.adjustGroupPrice && s.uids.length > 1 ) ||
                        ( !!s.adjustGroupPrice && s.uids.length === 1 && s.uids[ 0 ] !== openid )
                }
            });

            data = data$;

            // 注入商品详情
            if ( detail === undefined || !!detail ) {
                const data = data$.map( shopping => {
                    return Object.assign({ }, shopping, {
                        detail: { }
                    })
                });
            }
            
            return ctx.body = {
                data,
                status: 200
            }

        } catch ( e ) {
            return ctx.body = { status: 500 };
        }
    });

    /** @description
     * 仙女购物清单
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



    return app.serve( );

}