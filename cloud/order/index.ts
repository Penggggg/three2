
import * as cloud from 'wx-server-sdk';
import * as TcbRouter from 'tcb-router';
import { create$ } from './create';

cloud.init( );

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
 * ! canGroup 是否可以拼团
 * ! final_price 最后成交价
 * ! base_status: 0,1,2,3,4,5 进行中（客户还可以调整自己的订单），代购已购买，已调整，已结算，已取消（买不到），已过期（支付过期）
 * ! pay_status: 0,1,2 未付款，已付订金，已付全款
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
     * 分页 + query 查询订单列表（未聚合）
     * ----- 请求 ------
     * {
     *     page: number
     *     skip: number
     *     type: 我的全部 | 未付款订单 | 待发货 | 已完成 | 管理员（行程订单）| 管理员（所有订单）
     *     type: my-all | my-notpay | my-deliver | my-finish | manager-trip | manager-all
     * }
     * ! 未付款订单：pay_status: 未付款/已付订金 或 type: pre
     * ! 待发货：deliver_status：未发货 且 pay_status 已付款
     * ! 已完成：deliver_status：已发货 且 pay_status 已付全款
     */
    app.router('list', async( ctx, next ) => {
        try {

            // 查询条数
            const limit = 10;

            let where$ = { };
            const { type } = event.data;
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

            // 获取总数
            const total$ = await db.collection('order')
                .where( where$ )
                .count( );

            // 获取订单数据
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

            if ( last ) { 
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
                const { _id, tid, pid, sid, price, groupPrice  } = x.data[ 0 ];
                return {
                    oid: _id,
                    tid, pid, sid, price,
                    groupPrice: groupPrice
                }
            });

            // 这里本来不需要同步等待购物清单的创建，但是不加await貌似没有被执行到
            await cloud.callFunction({
                name: 'shopping-list',
                data: {
                    $url: 'create',
                    data: {
                        list
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

    app.router('test', async( ctx, next ) => {
        try {

            /**
             * 未被安排的订单
             */
            const lostOrders: {
                tid,
                pid,
                sid,
                oid
            }[ ] = [ ];
    
            // 获取当前进行中的行程
            const trips$ = await cloud.callFunction({
                name: 'trip',
                data: {
                    $url: 'enter'
                }
            });
    
            const currentTrip = trips$.result.data[ 0 ];
            
            if ( !currentTrip ) { 
                return ctx.body = {
                    status: 200
                }
            }
    
            const tid = currentTrip._id;

            // 拿到所有该行程下的已付订金订单
            const find1$ = await db.collection('order')
                .where({
                    tid,
                    pay_status: '1'
                })
                .get( );

            if ( find1$.data.length === 0 ) { 
                return ctx.body = {
                    status: 200
                }
            }
    
            // 拿到该行程下的购物清单
            const find2$ = await db.collection('shopping-list')
                .where({
                    tid
                })
                .get( );

            const tripShoppingList = find2$.data; 
            
            /**
             * 跟清单进行匹配
             * 1. 该订单的商品/型号还没有任何清单
             * 2. 该订单没有在已有同款商品/型号的清单里面
             */

            find1$.data.map( order => {

                const { sid, pid, _id } = order;
                const currentGoodShoppingList = tripShoppingList.find( x => x.sid === sid && x.pid === pid );

                if ( !currentGoodShoppingList ) {
                    lostOrders.push({
                        tid,
                        sid,
                        pid,
                        oid: _id
                    })
                } else {
                    const { oids } = currentGoodShoppingList;
                    if ( !oids.find( x => x === _id )) {
                        lostOrders.push({
                            tid,
                            sid,
                            pid,
                            oid: _id
                        })
                    }
                }

            });

            if ( lostOrders.length === 0 ) {
                return ctx.body = {
                    status: 200
                }
            }

            await cloud.callFunction({
                name: 'shopping-list',
                data: {
                    $url: 'create',
                    data: {
                        list: lostOrders
                    }
                }
            });
    
            return ctx.body = {
                status: 200,
                data: lostOrders
            }
    
        } catch ( e ) {
            console.log('!!!!定时器订单catchLostOrders错误',)
            return ctx.body = { status: 500 };
        }
    })

    /** 
     * @description
     * 代购清帐催款的订单列表
     */
    app.router('daigou-list', async( ctx, next ) => {
        try {
            const { tid } = event.data;
            const orders$ = await db.collection('order')
                .where({
                    tid,
                    pay_status: _.or( _.eq('1'), _.eq('2'), _.eq('3'))
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

            // 地址信息
            const address$ = await Promise.all(
                Array.from(
                    new Set( orders$.data
                        .map( x => x.aid )
                ))
                .map( aid => db.collection('address')
                            .doc( aid )
                            .get( ))
            );

            const userOders = users$.map( user$ => {
                const user = user$.data[ 0 ];
                const orders = orders$.data.filter( x => x.openid === user.openid );
                const address = address$
                                    .map( x => x.data )
                                    .filter( x => x.openid === user.openid );
                return {
                    user,
                    orders,
                    address
                };
            });

            return ctx.body = {
                status: 200,
                data: userOders
            }

        } catch ( e ) {
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
     * !已弃用，使用批量催款、调整功能，而不是每次针对单个order进行操作
     * 催帐，调整下列订单为“已调整”，并发送消息模板
     * {
     *    tid, oids
     * }
     */
    app.router('adjust-status', async( ctx, next ) => {
        try {

            const { tid, oids, form_id } = event.data;
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
            }

            // 更新订单
            const update$ = await Promise.all( oids.map( oid => {
                return db.collection('order')
                    .doc( oid )
                    .update({
                        data: {
                            base_status: '2'
                        }
                    });
            }));

            
            return ctx.body = {
                status: 200
            }

        } catch ( e ) { return ctx.body = { status: 500 }}
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
     *        form_id / prepay_id
     *    }[ ]
     *    notification: { 
     *       title,
     *       desc,
     *       time
     *    }[  ]
     * }
     */
    app.router('batch-adjust', async( ctx, next ) => {
        try {
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
                return db.collection('order')
                    .doc( order.oid )
                    .update({
                        data: {
                            base_status: '2',
                            canGroup: !!orders.find( o => {
                                return o.oid !== order.oid && o.openid !== order.openid && 
                                    o.pid === order.pid && o.sid === order.sid
                            })
                        }
                    })
            }));

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

            // console.log('------ 以下用户发送推送 ------', orders, users );
            const rs = await Promise.all( users.map( openid => {
                const target = orders.find( order => order.openid === openid &&
                    (!!order.prepay_id || !!order.form_id ));
                return cloud.callFunction({
                    data: {
                        data: {
                            touser: openid,
                            data: notification,
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
 
   return app.serve( );

}