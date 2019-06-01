
import * as cloud from 'wx-server-sdk';
import * as TcbRouter from 'tcb-router';
import { create$ } from './create';

cloud.init({
    env: process.env.cloud
});

const db: DB.Database = cloud.database( );

const _ = db.command;

/**
 * 
 * @description 订单模块
 * -------- 字段 ----------
 * _id
 * openid,
 * createtime
 * tid,
 * pid,
 * cid (可为空)
 * sid, (可为空)
 * count,
 * price,
 * groupPrice,
 * deposit_price: 商品订金 (可为空)
 * ! acid 商品活动id
 * ! isOccupied, 是否占库存
 * group_price (可为空)
 * type: 'custom' | 'normal' | 'pre' 自定义加单、普通加单、预订单
 * img: Array[ string ]
 * desc（可为空）,
 * aid
 * allocatedPrice 分配的价格
 * allocatedGroupPrice 分配团购价
 * allocatedCount 分配的数量
 * form_id
 * prepay_id,
 * final_price 最后成交价
 * ! canGroup 是否可以拼团
 * base_status: 0,1,2,3,4,5 进行中，代购已购买，已调整，已结算，已取消（买不到），已过期（支付过期）
 * pay_status: 0,1,2 未付款，已付订金，已付全款
 * ! deliver_status: 0,1 未发布，已发布、
 */
export const main = async ( event, context ) => {

    const app = new TcbRouter({ event });

    /**
     * @description 创建订单
     * -------- 请求 ----------
     * {
     *      tid,
     *      openId // 订单主人
     *      from: 'cart' | 'buy' | 'custom' | 'agents' | 'system' 来源：购物车、直接购买、自定义下单、代购下单、系统发起预付订单
     *      orders: Array<{ 
     *          tid
     *          cid
     *          sid
     *          pid
     *          price
     *          name
     *          acid
     *          standername
     *          groupPrice
     *          count
     *          desc
     *          img
     *          type
     *          pay_status,
     *          address: {
     *              name,
     *              phone,
     *              detail,
     *              postalcode
     *          }
     *      }>
     * }
     */
    app.router('create', async( ctx, next ) => {
        try {
            
            const { tid, from, orders } = event.data;
            const openid = event.data.openId || event.userInfo.openId;

            // 1、判断该行程是否可以用
            const trips$$ = await cloud.callFunction({
                data: {
                    data: {
                        _id: tid
                    },
                    $url: 'detail'
                },
                name: 'trip'
            });

            const trips$ = trips$$.result;        
            if ( trips$.status !== 200
                    || !trips$.data 
                    || ( !!trips$.data && trips$.data.isClosed ) 
                    || ( !!trips$.data && new Date( ).getTime( ) >= trips$.data.end_date )) {
                throw '暂无行程计划，暂时不能购买～'
            }

            // 最新可用行程
            const trip = trips$.data;

            /**
             * 根据地址对象，拿到地址id
             */
            let addressid$ = {
                result: {
                    data: null,
                    status: 500
                }
            };

            // 订单来源：购物车、系统加单
            if ( event.data.from === 'cart' || event.data.from === 'system' || event.data.from === 'buy' ) {
                addressid$ = await cloud.callFunction({
                    data: { 
                        data: {
                            openId: openid,
                            address: event.data.orders[ 0 ].address
                        },
                        $url: 'getAddressId'
                    },
                    name: 'address'
                });
            }
            
            // 订单来源：购物车、系统加单
            if (( event.data.from === 'cart' || event.data.from === 'system' ) && addressid$.result.status !== 200 ) {
                throw '查询地址错误';
            }

            // 可用地址id
            const aid = addressid$.result.data;

            // 是否新客户
            const isNew$ = await cloud.callFunction({
                name: 'common',
                data: {
                    $url: 'is-new-customer',
                    data: {
                        openId: openid
                    }
                }
            })

            const isNew = isNew$.result.data;

            /**
             * 新客 + 新客要订金 = '0',
             * 新客 + 要订金 = '0',
             * 新客 + 免订金 = '1',
             * 旧客 + 旧客免订金 = '1',
             * 旧客 + 要订金 = '0',
             * 旧客 + 免订金 = '1',
             */
            let pay_status = '0';
            const p = trip.payment;

            if ( isNew && p === '0' ) {
                pay_status = '0'

            } else if ( isNew && p === '1' ) {
                pay_status = '0'

            } else if ( isNew && p === '2' ) {
                pay_status = '1'
                
            } else if ( !isNew && p === '0' ) {
                pay_status = '1'
                
            } else if ( !isNew && p === '1' ) {
                pay_status = '0'
                
            } else if ( !isNew && p === '2' ) {
                pay_status = '1'
                
            } else {
                pay_status = '0'
                
            }

            // 3、批量创建订单，（过滤掉不能创建购物清单的商品）
            const temp = event.data.orders.map( meta => {
                const t = Object.assign({ }, meta, {
                    /**
                     * ! deliver_status为未发布 可能有问题
                     */
                    aid,
                    isOccupied: true, // 占领库存标志
                    openid: openid,
                    deliver_status: '0', 
                    base_status: '0',
                    pay_status: !meta.depositPrice ? '1' : pay_status , // 商品订金额度为0
                    createTime: new Date( ).getTime( ),
                    type: !!meta.depositPrice ? meta.type : 'normal'
                });
                delete t['address'];
                return t;
            });

            // 4、批量创建订单 ( 同时处理占领货存的问题 )
            const save$: any = await Promise.all( temp.map( o => {
                return create$( openid, o, db, ctx );
            }));
        
            if ( save$.some( x => x.status !== 200 )) {
                throw '创建订单错误！'
            }

            // 返回订单信息
            const order_result = save$.map(( x, k ) => {
                const { price, count, pay_status, depositPrice } = temp[ k ];
                return {
                    oid: x.data._id,
                    price,
                    count,
                    pay_status,
                    depositPrice
                }
            });

            return ctx.body = {
                status: 200,
                data: order_result
            };

        } catch ( e ) {
     
            return ctx.body = {
                status: 500,
                message: e
            };
        }
    });

    /**
     * @description
     * 客户端查询
     * 
     * 分页 + query 查询订单列表（未聚合）
     * ----- 请求 ------
     * {
     *!    tid: 行程id （可无）
     *     page: number
     *     skip: number
     *     type: 我的全部 | 未付款订单 | 待发货 | 已完成 | 管理员（行程订单）| 管理员（所有订单）
     *     type: my-all | my-notpay | my-deliver | my-finish | manager-trip | manager-all
     *     passusedless: true | false | undefined 是否过滤掉过期的订单
     * }
     * ! 未付款订单：pay_status: 未付款/已付订金 或 type: pre
     * ! 待发货：deliver_status：未发货 且 pay_status 已付款
     * ! 已完成：deliver_status：已发货 且 pay_status 已付全款
     */
    app.router('list', async( ctx, next ) => {
        try {

            let where$ = { };
            const { type, tid, passusedless } = event.data;

            // 查询条数
            const limit = tid ? 99 : 10;

            const openid = event.userInfo.openId;


            // 我的全部
            if ( type === 'my-all' ) {
                where$ = {
                    openid: openid
                }

            // 未付款
            } else if ( type === 'my-notpay' ) {
                where$ = _.and({
                    openid,
                    base_status: '2'
                }, _.or([
                    {
                        type: 'pre'
                    }, {
                        pay_status: _.or( _.eq('0'), _.eq('1'))
                    }
                ]));
            
            // 未发货
            } else if ( type === 'my-delive' ) {
                where$ = {
                    openid,
                    pay_status: '2',
                    deliver_status: '0'
                };

            // 已完成
            } else if ( type === 'my-finish' ) {
                where$ = {
                    openid,
                    pay_status: '2',
                    deliver_status: '1'
                };
            }

            // 过滤掉过期订单
            if ( passusedless === true ) {
                where$ = Object.assign({ }, where$, {
                    base_status: _.neq('5')
                });
            }

            // 行程订单
            if ( tid ) {
                where$ = Object.assign({ }, where$, {
                    tid
                });
            }

            // 获取总数
            const total$ = await db.collection('order')
                .where( where$ )
                .count( );

            // 获取订单数据
            /**
             * ! 如果是有指定tid的，则不需要limit了，直接拉取行程所有的订单
             */
            const data$ = await db.collection('order')
                .where( where$ )
                .orderBy('createTime', 'desc')
                .limit( limit )
                .skip( event.data.skip || ( event.data.page - 1 ) * limit )
                .get( );

            /**
             * ! 由于查询是按分页，但是显示是按行程来聚合显示
             * ! 因此有可能，N页最后一位，跟N+1页第一位依然属于同一行程
             * ! 如不进行处理，客户查询订单列表显示行程订单时，会“有可能”显示不全
             * ! 特殊处理：用最后一位的tid，查询最后一位以后同tid的order，然后修正所返回的page
             */

            const last = data$.data[ data$.data.length - 1 ];

            let fix$: any = {
                data: [ ]
            };

            // 如果没有tid参数，才去做fix的动作
            if ( last && !tid ) { 
                fix$ = await db.collection('order')
                    .where({
                        openid,
                        tid: last.tid
                    })
                    .orderBy('createTime', 'desc')
                    .skip( event.data.skip ? event.data.skip + data$.data.length : ( event.data.page - 1 ) * limit + data$.data.length )
                    .get( );
            }

            const meta = [ ...data$.data, ...fix$.data ];

            // 这里的行程详情用 new Set的方式查询
            const tripIds = Array.from(
                new Set( meta.map( m => m.tid ))
            );

            const trips$ = await Promise.all( tripIds.map( tid => {
                return db.collection('trip')
                    .where({
                        _id: tid
                    })
                    .get( );
            }));
     
            // 聚合行程数据
            const meta2 = meta.map(( x, i ) => Object.assign({ }, x, {
                // trip: trips$[ i ].data[ 0 ]
                trip: (trips$.find( y => y.data[ 0 ]._id === x.tid ) as any).data[ 0 ]
            }));

            return ctx.body = {
                status: 200,
                data: {
                    data: meta2,
                    pageSize: limit,
                    total: total$.total,
                    page: fix$.data.length === 0 ? event.data.page : event.data.page + Math.ceil( fix$.data.length / limit ),
                    current: event.data.skip ? event.data.skip + meta.length : ( event.data.page - 1 ) * limit + meta.length,
                    totalPage: Math.ceil( total$.total / limit )
                }
            }
            
        } catch ( e ) { return ctx.body = { status: 500};}
    })

    /**
     * 批量更新，订单为已支付，并且增加到购物清单
     * orderIds: "123,234,345"
     * form_id,
     * prepay_id
     */
    app.router('upadte-to-payed', async( ctx, next ) => {
        try {

            const openId = event.userInfo.openId;
            const { orderIds, prepay_id, form_id } = event.data;

            // 更新订单字段
            await Promise.all( orderIds.split(',').map( oid => {
                return db.collection('order').doc( oid )
                    .update({
                        data: {
                            form_id,
                            prepay_id,
                            pay_status: '1'
                        }
                    });
            }));

            // 创建/插入到购物清单
            const find$: any = await Promise.all( orderIds.split(',').map( oid => {
                return db.collection('order')
                    .where({
                        _id: oid
                    })
                    .get( );
            }));

            const list = find$.map( x => {
                const { _id, tid, pid, sid, price, groupPrice, acid } = x.data[ 0 ];
                return {
                    oid: _id,
                    acid, groupPrice,
                    tid, pid, sid, price
                }
            });

            // 这里本来不需要同步等待购物清单的创建，但是不加await貌似没有被执行到
            await cloud.callFunction({
                name: 'shopping-list',
                data: {
                    $url: 'create',
                    data: {
                        list,
                        openId
                    }
                }
            })

            return ctx.body = {
                status: 200
            }

        } catch ( e ) { 
            return ctx.body = { status: 500 };
        } 
    })

    /** 
     * @description
     * 代购清帐催款的订单列表
     * {
     *     tid 
     *     needCoupons: false | true | undefined
     *     needAddress: false | true | undefined
     * }
     */
    app.router('daigou-list', async( ctx, next ) => {
        try {
            const { tid, needCoupons, needAddress } = event.data;

            // 订单信息
            const orders$ = await db.collection('order')
                .where({
                    tid,
                    pay_status: _.or( _.eq('1'), _.eq('2'))
                })
                .get( );
            
            // 用户信息
            const users$ = await Promise.all(
                Array.from( 
                    new Set( orders$.data
                        .map( x => x.openid )
                ))
                .map( uid => db.collection('user')
                    .where({
                        openid: uid
                    })
                    .get( ))
            );

            // 快递费用信息
            const deliverfees$ = await Promise.all(
                Array.from( 
                    new Set( orders$.data
                        .map( x => x.openid )
                ))
                .map( uid => db.collection('deliver-fee')
                    .where({
                        tid,
                        openid: uid
                    })
                    .get( ))
            );

            // 地址信息
            let address$: any = [ ];
            if ( !!needAddress || needAddress === undefined ) {
                address$ = await Promise.all(
                    Array.from(
                        new Set( orders$.data
                            .map( x => x.aid )
                    ))
                    .map( aid => db.collection('address')
                                .doc( aid )
                                .get( ))
                );
            }
            
            // 卡券信息
            let coupons$: any = [ ];
            if ( !!needCoupons || needCoupons === undefined ) {
                coupons$ = await Promise.all(
                    Array.from(
                        new Set( orders$.data 
                            .map( x => x.openid )
                    ))
                    .map( openid => db.collection('coupon')
                        .where( _.or([
                            {
                                tid,
                                openid,
                                type: _.or( _.eq('t_manjian'), _.eq('t_lijian'))
                            }, {
                                openid,
                                isUsed: false,
                                canUseInNext: true,
                                type: 't_daijin'
                            }
                        ]))
                        .get( )
                    )
                );
            }
            
            const userOders = users$.map(( user$, k ) => {
                
                const user = user$.data[ 0 ];

                const orders = orders$.data
                    .filter( x => x.openid === user.openid );

                const address = address$.length > 0 ?
                    address$
                        .map( x => x.data )
                        .filter( x => x.openid === user.openid ) :
                    undefined;

                const coupons = coupons$.length > 0 ?
                    coupons$
                        .map( x => x.data )
                        .filter( x => x.length > 0 && x[ 0 ].openid === user.openid ) :
                    undefined;

                const deliverFee = deliverfees$[ k ].data[ 0 ] || null

                return {
                    user,
                    orders,
                    address,
                    deliverFee,
                    coupons: (!!coupons && coupons.length > 0 ) ? coupons[ 0 ] : [ ]
                };
            });

            return ctx.body = {
                status: 200,
                data: userOders
            }

        } catch ( e ) {
            console.log( '...', e );
            return ctx.body = { status: 500 };
        }
    });

    /**
     * @description
     * 从清帐催款，调整订单分配量
     * {
     *      oid, tid, sid, pid, count
     * }
     */
    app.router('adjust-count', async( ctx, next ) => {
        try {
            const openid = event.data.openId || event.userInfo.openId; 
            const { oid, tid, sid, pid, count } = event.data;

            const getWrong = message => ctx.body = {
                message,
                status: 400
            }

            /**
             * 是否能继续调整
             */
            const order$ = await db.collection('order')
                .doc( oid )
                .get( );

            if ( order$.data.base_status === '2' ) {
                return getWrong('催款后不能修改数量');

            } else if ( order$.data.base_status === '0' ) {
                return getWrong('请先调整该商品价格');
            }

            /**
             * 不能多于清单分配的总购入量
             */
            const shopping$ = await db.collection('shopping-list')
                .where({
                    tid, sid, pid
                })
                .get( );
            const shopping = shopping$.data[ 0 ];
            const lastOrders$ = await db.collection('order')
                .where({
                    tid, sid, pid,
                    pay_status: _.neq('0'),
                    base_status: _.or( _.eq('1'), _.eq('2'), _.eq('3'))
                })
                .get( );

            const lastOrders = lastOrders$.data;
            const otherCount: any = lastOrders
                .filter( o => o._id !== oid )
                .reduce(( x, y ) => {
                    return x + y.allocatedCount || 0
                }, 0 );

            if ( count + otherCount > shopping.purchase ) {
                return getWrong(`该商品总数量不能大于采购数${shopping.purchase}件！`);
            }

            /** 更新订单 */
            await db.collection('order')
                .doc( oid )
                .update({
                    data: {
                        allocatedCount: count
                    }
                });

            /**
             * 更新清单
             * 少于总购入量时，重新调整清单的剩余分配量
             */
            if ( count + otherCount < shopping.purchase ) {

                const newshopping = Object.assign({ }, shopping, {
                    lastAllocated: shopping.purchase - ( count + otherCount )
                });
                delete newshopping['_id'];

                await db.collection('shopping-list')
                    .doc( String( shopping._id ))
                    .set({
                        data: newshopping
                    });
            }

            return ctx.body = {
                status: 200
            }
            
        } catch ( e ) {
            return ctx.body = { status: 500 }
        }
    })

    /**
     * @description
     * 批量地：确认客户订单、是否团购、消息推送操作
     * {
     *    tid,
     *    orders: {
     *        oid
     *        pid
     *        sid
     *        openid
     *        prepay_id
     *        form_id
     *        allocatedCount
     *        allocatedGroupPrice
     *    }[ ]
     *    notification: { 
     *       title,
     *       desc,
     *       time
     *    }
     * }
     */
    app.router('batch-adjust', async( ctx, next ) => {
        try {

            /** 是否能拼团 */
            let canGroupUserMapCount: {
                [ k: string ] : number
            } = { };

            const { tid, orders, notification } = event.data;
            const getWrong = message => ctx.body = {
                message,
                status: 400
            };

            const trip$ = await db.collection('trip')
                .doc( tid )
                .get( );
            const trip = trip$.data;

            // 未结束，且未手动关闭
            if ( new Date( ).getTime( ) < trip.end_date && !trip.isClosed ) {
                return getWrong('行程未结束，请手动关闭当前行程');

            } else if ( trip.callMoneyTimes &&  trip.callMoneyTimes >= 3 ) {
                return getWrong(`已经发起过${trip.callMoneyTimes}次催款`);

            }

            // 更新订单
            await Promise.all( orders.map( order => {
                
                // 有团购价、大于2人购买，且被分配数均大于0，该订单才达到“团购”的条件
                const canGroup = !!orders.find( o => {
                    return o.oid !== order.oid &&
                        o.openid !== order.openid && 
                        o.pid === order.pid && o.sid === order.sid &&
                        o.allocatedCount > 0 && order.allocatedCount > 0 &&
                        !!o.allocatedGroupPrice
                });

                if ( canGroup ) {
                    canGroupUserMapCount = Object.assign({ }, canGroupUserMapCount, {
                        [ order.openid ]: canGroupUserMapCount[ order.openid ] === undefined ? 1 : canGroupUserMapCount[ order.openid ] + 1
                    });
                }

                return db.collection('order')
                    .doc( order.oid )
                    .update({
                        data: {
                            canGroup,
                            base_status: '2'
                        }
                    })
            }));

            /**
             * !更新购物清单
             */

            /**
             * 消息推送
             * !未付全款才发送
             */
            const users = Array.from(
                new Set(
                    orders
                        .map( order => order.openid )
                        .filter( openid => {
                            return !!orders.find( order => {
                                return order.openid === openid && String( order.pay_status ) === '1'
                            });
                        })
                )
            );

            /** 推送通知 */
            const rs = await Promise.all( users.map( openid => {

                const target = orders.find( order => order.openid === openid &&
                    (!!order.prepay_id || !!order.form_id ));

                return cloud.callFunction({
                    data: {
                        data: {
                            touser: openid,
                            data: {
                                title: canGroupUserMapCount[ String( openid )] ?
                                    `拼团${ canGroupUserMapCount[ String( openid )]}件！您购买的商品已到货` :
                                    '您购买的商品已到货',
                                time: `[行程]${trip.title}`
                            },
                            form_id: target.prepay_id || target.form_id
                        },
                        $url: 'notification-getmoney'
                    },
                    name: 'common'
                })
            }));
 
            // 更新行程
            await db.collection('trip')
                .doc( tid )
                .update({
                    data: {
                        callMoneyTimes: _.inc( 1 )
                    }
                });

            return ctx.body = {
                status: 200,
                // 剩余次数
                data: 3 - ( 1 + trip.callMoneyTimes )
            }

        } catch ( e ) {
            return ctx.body = { status: 500 };
        }
    })

    /** 
     * @description
     * 订单付尾款
     * {
     *      tid // 领代金券
     *      integral // 积分总额（user表）
     *      orders: [{  
     *          oid // 订单状态
     *          pid
     *          final_price // 最终成交额
     *          allocatedCount // 最终成交量
     *      }]
     *      coupons: [ // 卡券消费
     *          id1,
     *          id2...
     *      ]
     * }
     */
    app.router('pay-last', async( ctx, next ) => {
        try {
            const openid = event.userInfo.openId;
            const { tid, integral, orders, coupons } = event.data;

            const user$ = await db.collection('user')
                .where({
                    openid
                })
                .get( );

            // 增加积分总额
            await db.collection('user')
                .doc( String( user$.data[ 0 ]._id ))
                .update({
                    data: {
                        integral: _.inc( integral )
                    }
                });

            // 更新订单状态、商品销量
            await Promise.all( orders.map( order => {
                return Promise.all([
                    db.collection('order')
                        .doc( order.oid )
                        .update({
                            data: {
                                base_status: '3',
                                pay_status: '2',
                                final_price: order.final_price,
                            }
                        }),
                    db.collection('goods')
                        .doc( order.pid )
                        .update({
                            data: {
                                saled: _.inc( order.allocatedCount )
                            }
                        })
                ])
            }));

            // 更新卡券使用状态
            await Promise.all( coupons.map( couponid => {
                return db.collection('coupon')
                    .doc( couponid )
                    .update({
                        data: {
                            isUsed: true,
                            usedBy: tid,
                            canUseInNext: false
                        }
                    })
            }));

            // 达到条件，则领取代金券
            // 同时删除上一个未使用过的代金券
            const trip$ = await db.collection('trip')
                .doc( tid )
                .get( );

            let req = {
                result: {
                    status: 500
                }
            }
            
            const { cashcoupon_atleast, cashcoupon_values } = trip$.data;

            const temp = {
                openId: openid,
                fromtid: tid,
                type: 't_daijin',
                title: '行程代金券',
                canUseInNext: true,
                isUsed: false,
                atleast: cashcoupon_atleast || 0,
                value: cashcoupon_values
            };

            // 无需门槛，有代金券即可领取
            if ( !!cashcoupon_values ) {

                // 删除上一个未使用的代金券
                const lastDaijin$ = await db.collection('coupon')
                    .where({
                        type: 't_daijin',
                        isUsed: false,
                        canUseInNext: true
                    })
                    .get( );

                if ( lastDaijin$.data[ 0 ]) {
                    await db.collection('coupon')
                        .doc( String( lastDaijin$.data[ 0 ]._id ))
                        .remove( );
                }

                // 领取代金券
                req = await cloud.callFunction({
                    data: {
                        data: temp,
                        $url: 'create'
                    },
                    name: 'coupon'
                });
            }

            return ctx.body = {
                status: 200,
                data: req.result.status === 200 ? temp : null 
            }

        } catch ( e ) {
            return ctx.body = { status: 500 }
        }
    });

    /** 
     * @description
     * 代购获取未读订单
     */
    app.router('unread', async( ctx, next ) => {
        try {
            const { tid, lastTime } = event.data;
            let where$ = {
                tid
            };

            if ( lastTime ) {
                where$ = Object.assign({ }, where$, {
                    createtime: _.gte( lastTime )
                });
            }

            const data$ = await db.collection('order')
                .where( where$ )
                .count( );

            return ctx.body = {
                status: 200,
                data: data$.total
            }

        } catch ( e ) { return ctx.body = { status: 500 };}
    });

    /** 
     * @description
     * 代购查看所有的订单列表
     */
    app.router('list-all', async( ctx, next ) => {
        try {
            // 查询条数
            const limit = 10;
            const { tid, page } = event.data;

            const where$ = {
                tid,
                pay_status: _.neq('0')
            };

            const total$ = await db.collection('order')
                .where( where$ )
                .count( );
            
            const orders$ = await db.collection('order')
                .where( where$ )
                .limit( limit )
                .skip(( page - 1 ) * limit )
                .orderBy('createTime', 'desc')
                .get( );

            const pids = Array.from(
                new Set( 
                    orders$.data
                        .map( x => x.pid )
                )
            );

            const sids = Array.from(
                new Set( 
                    orders$.data
                        .map( x => x.sid )
                        .filter( x => !!x )
                )
            );

            const uids = Array.from(
                new Set( 
                    orders$.data
                        .map( x => x.openid )
                        .filter( x => !!x )
                )
            );

            // const goods$$ = await Promise.all(
            //     pids.map( 
            //         pid => db.collection('goods')
            //             .doc( String( pid ))
            //             .get( )
            //     )
            // );
            // const goods$ = goods$$.map( x => x.data );

            // const standars$$ = await Promise.all(
            //     sids.map( 
            //         sid => db.collection('standards')
            //             .doc( String( sid ))
            //             .field({
            //                 pid: true,
            //                 name: true
            //             })
            //             .get( )
            //     )
            // );
            // const standars$ = standars$$.map( x => x.data );

            const users$$ = await Promise.all(
                uids.map( 
                    openid => db.collection('user')
                        .where({
                            openid
                        })
                        .field({
                            openid: true,
                            avatarUrl: true,
                            nickName: true
                        })
                        .get( )
                )
            );
            const users$ = users$$.map( x => x.data[ 0 ]);

            const meta = orders$.data.map( order => {

                const user = users$.find( user => user.openid === order.openid );
                // const detail = goods$.find( good => good._id === order.pid );
                // const standar = standars$.find( s => s._id === order.sid );

                return Object.assign({ }, order, {
                    user,
                    // detail,
                    // standar
                })
            });

            return ctx.body = {
                status: 200,
                data: {
                    page,
                    pageSize: limit,
                    data: meta,
                    total: total$.total,
                    totalPage: Math.ceil( total$.total / limit )
                }
            }


        } catch ( e ) { 
            console.log('???', e )
            return ctx.body = { status: 500 }
        }
    })
 
   return app.serve( );

}