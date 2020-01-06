import * as cloud from 'wx-server-sdk';
import * as TcbRouter from 'tcb-router';

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
 *
 * @description 行程模块
 * -------- 字段 ----------
        title 标题 string
        warning: 是否发送过期警告给adm,
        start_date 开始时间 number
        end_date 结束时间 number
        reduce_price 行程立减 number
        sales_volume 销售总额
        fullreduce_atleast 行程满减 - 门槛 number
        fullreduce_values 行程满减 - 减多少 number
        cashcoupon_atleast 行程代金券 - 门槛 number
        cashcoupon_values 行程代金券 - 金额 number
*!      postage 邮费类型 dic 
*!      postagefree_atleast  免邮门槛 number
        payment 付款类型 dic 
        published 是否发布 boolean
        createTime 创建时间
        updateTime 更新时间
        isClosed: 是否已经手动关闭
        callMoneyTimes: 发起催款次数
*!      type: 类型，sys（系统自动发起）、undefined（手动创建）
 */
export const main = async ( event, context ) => {

    const app = new TcbRouter({ event });

    /**
     * ------ 请求 --------
     * {
     *    shouldGetGoods: 默认true，可以不填，获取行程推荐商品
     * }
     */
    app.router('enter', async( ctx, next ) => {
        try {
            const shouldGetGoods = event.data ? event.data.shouldGetGoods : undefined;

            // 按开始日期正序，获取最多2条 已发布、未结束的行程
            const data$ = await db.collection('trip')
                .where({
                    isClosed: false,
                    published: true,
                    end_date: _.gt( getNow( true ))
                })
                .limit( 2 )
                .orderBy('start_date', 'asc')
                .get( );

            let trips = data$.data;

            // 拉取最新行程的推荐商品
            if (( !!trips[ 0 ] && shouldGetGoods === undefined ) || shouldGetGoods === true ) {
                const tripOneProducts$ = await Promise.all( trips[ 0 ].selectedProductIds.map( pid => {
                    return cloud.callFunction({
                        data: {
                            data: {
                                _id: pid,
                            },
                            $url: 'detail'
                        },
                        name: 'good'
                    }).then( res => res.result.data );
                }));
                trips[ 0 ] = Object.assign({ }, trips[ 0 ], {
                    products: tripOneProducts$
                });
            }

            return ctx.body = {
                status: 200,
                data: trips
            };

        } catch ( e ) {
            return ctx.body = {
                status: 500,
                message: e
            };
        }
    });

    app.router('list', async( ctx, next ) => {
        try {

            // 查询条数
            const limit = 20;
            const search$ = event.data.title || '';
            const search = new RegExp( search$.replace(/\s+/g, ""), 'i');

            // 获取总数
            const total$ = await db.collection('trip')
                .where({
                    title: search
                })
                .count( );

            // 获取数据
            const trips$ = await db.collection('trip')
                .where({
                    title: search
                })
                .limit( limit )
                .skip(( event.data.page - 1 ) * limit )
                .orderBy('updateTime', 'desc')
                .get( );

            const more = await Promise.all(
                trips$.data.map( async trip => {

                    // 获取行程的购物清单
                    const sl$ = await db.collection('shopping-list')
                        .where({
                            tid: trip._id
                        })
                        .field({
                            pid: true,
                            oids: true,
                            uids: true,
                            adjustPrice: true,
                            adjustGroupPrice: true
                        })
                        .get( );
                    const sl = sl$.data;

                    // 统计收益
                    const slOrders$ = await Promise.all(
                        sl.map( async s => {
                            const { oids } = s;
                            const orders: any = await Promise.all(
                                oids.map( async o => {
                                    const order$ = await db.collection('order')
                                        .doc( String( o ))
                                        .field({
                                            count: true,
                                            allocatedCount: true
                                        })
                                        .get( );
                                    return order$.data;
                                })
                            );
                            return {
                                ...s,
                                orders
                            }
                        })
                    );

                    // 统计收益
                    const income = slOrders$.reduce(( sum, sl: any ) => {
                        const { orders, uids, adjustPrice, adjustGroupPrice } = sl;
                        const slInome = orders.reduce(( last, order ) => {
                            const { allocatedCount, count } = order;
                            let count_ = allocatedCount !== undefined ? allocatedCount : count;
                            return last + ( uids.length > 1 ? ( adjustGroupPrice ? adjustGroupPrice : adjustPrice ) : adjustPrice ) * count_;
                        }, 0 );
                        return slInome + sum;
                    }, 0 );

                    const orders$ = await db.collection('order')
                        .where({
                            tid: trip._id,
                            pay_status: _.eq('1'),
                            base_status: _.or( _.eq('0'),_.eq('1'), _.eq('2'), _.eq('3'))
                        })
                        .field({
                            openid: true
                        })
                        .get( );

                    // 未付款买家
                    const notPayAllClients = Array.from(
                        new Set( 
                            orders$.data
                                .map( x => x.openid )
                        )
                    ).length;

                    return {
                        notPayAllClients,
                        sales_volume: income
                    }

                })
            );

            const inject = trips$.data.map(( trip, key ) => {
                return {
                    ...trip,
                    ...more[ key ]
                }
            })
            
            return ctx.body = {
                status: 200,
                data: {
                    search: event.data.title.replace(/\s+/g, ''),
                    pageSize: limit,
                    page: event.data.page,
                    data: inject,
                    total: total$.total,
                    totalPage: Math.ceil( total$.total / limit )
                }
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
     * 行程详情
     * {
     *      moreDetail: undefined | false | true
     * }
     */
    app.router('detail', async( ctx, next ) => {
        try {

            const { moreDetail } = event.data;
            const tid = event.data._id || event.data.tid;
            
            // 获取基本详情
            const data$ = await db.collection('trip')
                .doc( tid )
                .get( );
            const meta = data$.data;

            if ( moreDetail !== false ) {
                // 通过已选的商品ids,拿到对应的图片、title、_id
                const products$: any = await Promise.all( meta.selectedProductIds.map( pid => {
                    return db.collection('goods')
                            .where({
                                _id: pid
                            })
                            .field({
                                img: true,
                                title: true
                            })
                            .get( );
                }));

                meta.selectedProducts = products$.map( x => {
                    return x.data[ 0 ];
                });
            } else {
                meta.selectedProducts = [ ];
            }
            
            const canEdit$ = await db.collection('coupon')
                .where({
                    tid
                })
                .count( );

            // meta.canEditCoupons = canEdit$.total === 0;
            // 这个版本只有 立减
            meta.canEditCoupons = true;

            return ctx.body = {
                status: 200,
                data: meta
            };

        } catch( e ) {
            return ctx.body = {
                status: 500,
                message: e
            };
        }
    });

    /**
     * @description
     * 创建 / 编辑当前行程
     */
    app.router('edit', async( ctx, next ) => {
        try {

            let lastTrip: any = null;
            let start_date = getNow( true );
            let _id = event.data._id;
            const tid = event.data._id;
            const { published, title, reduce_price } = event.data;
            
            const getErr = message => {
                return ctx.body = {
                    status: 500,
                    message
                }
            };

            // 行程默认在当天晚上23点结束
            const fixEndDate = endDate => {
                const t = new Date( endDate );
                const y = t.getFullYear( );
                const m = t.getMonth( ) + 1;
                const d = t.getDate( );

                return new Date(`${y}/${m}/${d} 23:00:00`).getTime( );
            };

            const end_date = fixEndDate( Number( event.data.end_date ));

            if ( reduce_price < 1 ) {
                return getErr('立减金额不能少于1元')
            }

            // 创建行程
            if ( !_id ) {

                const count$ = await db.collection('trip')
                    .where({
                        isClosed: false,
                        published: true,
                    })
                    .count( );
                
                if ( count$.total ) {
                    return getErr('有未结束行程,请结束行程后再创建');
                }

                const createData = {
                    ...event.data,
                    end_date,
                    start_date: getNow( true ),
                    warning: false,
                    callMoneyTimes: 0
                };

                const create$ = await db.collection('trip')
                    .add({
                        data: createData
                    });
                _id = create$._id;
            // 编辑行程、覆盖sysTrip
            } else {
    
                const origin$ = await db.collection('trip')
                    .where({
                        _id
                    })
                    .get( );
                
                const origin = origin$.data[ 0 ];
                const isClosed = getNow( true ) >= Number( end_date );
    
                delete origin['_id'];
                delete event.data['_id'];
                delete event.data['createTime'];
                delete event.data['sales_volume']
                
                const temp = Object.assign({ }, origin, {
                    ...event.data,
                    isClosed,
                    type: 'custom',
                    callMoneyTimes: end_date > origin['end_date'] ? 0 : origin['callMoneyTimes']
                });

                await db.collection('trip')
                    .doc( _id )
                    .set({
                        data: temp
                    });   
            }

            /**
             * 推送
             * 创建时候的推送
             */
            if (( !tid && published )) {

                const time = new Date( start_date );

                // 推送代购通知
                const members = await db.collection('manager-member')
                    .where({
                        push: true
                    })
                    .get( );

                await Promise.all(
                    members.data.map( async member => {
                        // 4、调用推送
                        const push$ = await cloud.callFunction({
                            name: 'common',
                            data: {
                                $url: 'push-subscribe-cloud',
                                data: {
                                    openid: member.openid,
                                    type: 'trip',
                                    page: 'pages/manager-trip-list/index',
                                    texts: [`${title}`, `代购行程推送到客户，且开通了订单推送`]
                                }
                            }
                        });
                    })
                );

                // 推送客户通知
                const users = await db.collection('user')
                    .where({

                    })
                    .get( );

                await Promise.all(
                    users.data
                        .filter( user => {
                            return !members.data.find( member => member.openid === user.openid )
                        })
                        .map( async user => {
                            // 4、调用推送
                            const push$ = await cloud.callFunction({
                                name: 'common',
                                data: {
                                    $url: 'push-subscribe-cloud',
                                    data: {
                                        openid: user.openid,
                                        type: 'trip',
                                        page: 'pages/trip-enter/index',
                                        texts: [`${title}`, `代购在${time.getMonth( )+1}月${time.getDate( )}日开始！无门槛立减${reduce_price}元！`]
                                    }
                                }
                            });
                        })
                );

            }

            return ctx.body = {
                data: _id,
                status: 200
            };
             
        } catch( e ) {
            return ctx.body = {
                status: 500,
                message: e
            };
        }
    });

    /** 
     * @description
     * 获取行程底下的基本业务数据
     * 销售总额、
     * 客户总数、
     * 未付尾款客户数量、
     * 总订单数、
     * 行程名称、
     * 已发送催款次数
     */
    app.router('order-info', async( ctx, next ) => {
        try {
            const { tid } = event.data;

            /** 行程详情 */
            const trip$ = await db.collection('trip')
                .doc( tid )
                .get( );
        
            // 获取行程底下所有的订单
            const orders$ = await db.collection('order')
                .where({
                    tid,
                    pay_status: _.neq('0')
                })
                .get( );

            /**
             * 总客户数量
             * !至少已付订金
             */
            const clients = Array.from(
                new Set( orders$.data
                    .filter( x => x.pay_status !== '0' )
                    .map( x => x.openid )
            )).length;

            /**
             * 总未交尾款客户数量
             */
            const notPayAllClients = Array.from(
                new Set( orders$.data
                    .filter( x => x.pay_status === '1' )
                    .map( x => x.openid )
            )).length;

            // 获取行程的购物清单
            const sl$ = await db.collection('shopping-list')
                .where({
                    tid
                })
                .field({
                    pid: true,
                    oids: true,
                    uids: true,
                    adjustPrice: true,
                    adjustGroupPrice: true
                })
                .get( );
            const sl = sl$.data;

            // 统计收益
            const slOrders$ = await Promise.all(
                sl.map( async s => {
                    const { oids } = s;
                    const orders: any = await Promise.all(
                        oids.map( async o => {
                            const order$ = await db.collection('order')
                                .doc( String( o ))
                                .field({
                                    count: true,
                                    allocatedCount: true
                                })
                                .get( );
                            return order$.data;
                        })
                    );
                    return {
                        ...s,
                        orders
                    }
                })
            );
        
            // 统计收益
            const sum = slOrders$.reduce(( sum, sl: any ) => {
                const { orders, uids, adjustPrice, adjustGroupPrice } = sl;
                const slInome = orders.reduce(( last, order ) => {
                    const { allocatedCount, count } = order;
                    let count_ = allocatedCount !== undefined ? allocatedCount : count;
                    return last + ( uids.length > 1 ? ( adjustGroupPrice ? adjustGroupPrice : adjustPrice ) : adjustPrice ) * count_;
                }, 0 );
                return slInome + sum;
            }, 0 );

            return ctx.body = {
                status: 200,
                data: {
                    sum, // 销售总额
                    clients, // 客户总数
                    notPayAllClients, // 未付尾款客户数量
                    count: orders$.data.length, // 总订单数,
                    title: trip$.data.title, // 行程名称
                    callMoneyTimes: trip$.data.callMoneyTimes // 已发送催款次数
                }
            };

        } catch ( e ) { return ctx.body = { status: 500 };}
    })

    /**
     * @@description
     * 更新行程底下的快递图册
     */
    app.router('update-deliver', async( ctx, next ) => {
        try {
            const { tid, imgs } = event.data;
            const target = await db.collection('deliver')
                .where({
                    tid,
                    type: 'deliver-img'
                })
                .get( );

            // 创建
            if ( !target.data[ 0 ]) {
                await db.collection('deliver')
                    .add({
                        data: {
                            tid,
                            imgs,
                            type: 'deliver-img'
                        }
                    });
            // 更新
            } else {
                await db.collection('deliver')
                    .doc( String( target.data[ 0 ]._id))
                    .update({
                        data: {
                            imgs
                        }
                    })
            }

            return ctx.body = { status: 200 };
            
        } catch ( e ) { return ctx.body = { status: 500 }}
    })

    /**
     * @@description
     * 获取行程底下的快递图册
     */
    app.router('deliver', async( ctx, next ) => {
        try {
            const { tid } = event.data;
            const target = await db.collection('deliver')
                .where({
                    tid,
                    type: 'deliver-img'
                })
                .get( );

            return ctx.body = { 
                status: 200,
                data: target.data[ 0 ] ? target.data[ 0 ].imgs : [ ]
            }

        } catch ( e ) {
            return ctx.body = { status: 500 };
        }
    });

    /**
     * @description
     * 手动关闭当前行程
     * {
     *    tid
     * }
     */
    app.router('close', async( ctx, next ) => {
        try {
            const { tid } = event.data;

            // 更新行程close字段
            await db.collection('trip')
                .doc( String( tid ))
                .update({
                    data: {
                        isClosed: true
                    }
                });
            
            // 手动取消行程时，把待支付订单设为取消
            const orders$ = await db.collection('order')
                .where({
                    tid,
                    pay_status: '0',
                })
                .get( );
            
            await Promise.all( orders$.data.map( order$ => {
                return db.collection('order')
                    .doc( String( order$._id ))
                    .update({
                        data: {
                            base_status: '5'
                        }
                    })
            }));

            const trip$ = await db.collection('trip')
                .doc( tid )
                .get( );

            // 推送代购通知
            const members = await db.collection('manager-member')
                .where({
                    push: true
                })
                .get( );
        
            await Promise.all(
                members.data.map( async member => {

                    // 4、调用推送
                    const push1$ = await cloud.callFunction({
                        name: 'common',
                        data: {
                            $url: 'push-subscribe-cloud',
                            data: {
                                openid: member.openid,
                                type: 'getMoney',
                                page: `pages/manager-trip-order/index?id=${tid}&ac=${1}`,
                                texts: [`${trip$.data.title}`, `关闭成功！一键收款功能已开启`]
                            }
                        }
                    });

                    const push2$ = await cloud.callFunction({
                        name: 'trip',
                        data: {
                            $url: 'close-trip-analyze',
                            data: {
                                tid
                            }
                        }
                    });

                })
            );

            return ctx.body = { status: 200 };

        } catch ( e ) {
            return ctx.body = { status: 500 };
        }
    });

    /**
     * @description
     * 手动/自动关闭行程的时候，发送整个行程的运营数据给adm。
     * 同时发送「群报」给adm
     */
    app.router('close-trip-analyze', async( ctx, next ) => {
        try {

            // 收益
            let income = 0;
            // 成功下单的商品
            let pinGoodsNum = 0;
            // 被查看的商品
            let visitGoodsNum = 0;
            // 行程天数
            let daysNum = 0;
            // 浏览量
            let visitNum = 0;
            // 浏览人数
            let visitorNum = 0;
            // 成功拼团人数
            let pinNum = 0;
    
            const { tid } = event.data;

            // 获取行程详情
            const trip$ = await db.collection('trip')
                .doc( String( tid ))
                .field({
                    end_date: true,
                    start_date: true
                })
                .get( )
            const trip = trip$.data;

            // 获取行程的浏览量
            const visitRecords$ = await db.collection('good-visiting-record')
                .where({
                    visitTime: _.gte( trip.start_date )
                })
                .get( );
            const visitRecords = visitRecords$.data;

            // 获取行程的购物清单
            const sl$ = await db.collection('shopping-list')
                .where({
                    tid
                })
                .field({
                    pid: true,
                    oids: true,
                    uids: true,
                    adjustPrice: true,
                    adjustGroupPrice: true
                })
                .get( );
            const sl = sl$.data;
                
            // 统计收益
            const slOrders$ = await Promise.all(
                sl.map( async s => {
                    const { oids } = s;
                    const orders: any = await Promise.all(
                        oids.map( async o => {
                            const order$ = await db.collection('order')
                                .doc( String( o ))
                                .field({
                                    count: true,
                                    allocatedCount: true
                                })
                                .get( );
                            return order$.data;
                        })
                    );
                    return {
                        ...s,
                        orders
                    }
                })
            );
        
            // 统计收益
            income = slOrders$.reduce(( sum, sl: any ) => {
                const { orders, uids, adjustPrice, adjustGroupPrice } = sl;
                const slInome = orders.reduce(( last, order ) => {
                    const { allocatedCount, count } = order;
                    let count_ = allocatedCount !== undefined ? allocatedCount : count;
                    return last + ( uids.length > 1 ? ( adjustGroupPrice ? adjustGroupPrice : adjustPrice ) : adjustPrice ) * count_;
                }, 0 );
                return slInome + sum;
            }, 0 );

            // 统计成功拼团
            let slOpenids: string[ ] = [ ];
            sl.map( s => {
                slOpenids = [ ...slOpenids, ...s.uids ]
            });
            pinNum = Array.from(
                new Set( slOpenids )
            ).length;

            // 统计成功下单的产品
            pinGoodsNum = sl.length;

            // 统计查看的数据
            let goodIds: string[ ] = [ ];
            let visitOpenids: string[ ] = [ ];

            visitRecords.map( v => {
                goodIds = [ ...goodIds, v.pid ]
                visitOpenids = [ ...visitOpenids, v.openid ]
            });

            visitGoodsNum = Array.from(
                new Set( goodIds )
            ).length;

            visitorNum = Array.from(
                new Set( visitOpenids )
            ).length;

            // 按人均每款商品都打开3次计算
            visitNum = visitorNum * visitGoodsNum * 3;

            // 统计天数
            daysNum = Math.ceil(( trip.end_date - trip.start_date ) / ( 24 * 60 * 60 * 1000))

            const text1 = `${daysNum}天内，`;
            const text2 = `${visitGoodsNum}件商品被${visitorNum}人围观${visitNum}次`;
            const texts = [
                `收益${income}元，${pinNum}人拼团${pinGoodsNum}件商品`,
                (text1 + text2).length > 20 ? text2 : text1 + text2
            ];

            // 获取所有管理员
            const adms$ = await db.collection('manager-member')
                .where({ })
                .get( );
            
            // 推送
            await Promise.all(
                adms$.data.map( async adm => {

                    // 运营数据
                    await cloud.callFunction({
                        name: 'common',
                        data: {
                            $url: 'push-subscribe-cloud',
                            data: {
                                openid: adm.openid,
                                type: 'waitPin',
                                page: `pages/manager-trip-list/index`,
                                texts
                            }
                        }
                    });

                    // 群报
                    await cloud.callFunction({
                        name: 'common',
                        data: {
                            $url: 'push-subscribe-cloud',
                            data: {
                                openid: adm.openid,
                                type: 'trip',
                                page: `pages/trip-reward/index?tid=${tid}`,
                                texts: ['群拼团报告已出！', '点击并分享给群友吧～']
                            }
                        }
                    });

                    return 
                })
            );

            return ctx.body = {
                status: 200,
                data: {
                    texts,
                    pinNum,
                    income,
                    pinGoodsNum,
                    visitorNum,
                    visitGoodsNum,
                    visitNum,
                    daysNum,
                }
            }
            
        } catch ( e ) {
            console.log('????', e )
            return ctx.body = {
                status: 500,
                message: e
            }
        }
    });

    return app.serve( );

}