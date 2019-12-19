import * as cloud from 'wx-server-sdk';

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

const checkIsInRange = ( now: Date, range = [ 99 ]) => {
    return range.some( x => {
        const h = now.getHours( );
        return x === h && now.getMinutes( ) === 0;
    });
}

/**
 * 订单1: 所有应该支付，但是没有支付（支付超时30分钟）的订单，释放原来的库存，订单重置为已过时
 */
export const overtime = async ( ) => {
    try {

        const orders$ = await db.collection('order')
            .where({
                pay_status: '0',
                base_status: '0',
                createTime: _.lte( getNow( true ) - 30 * 60 * 1000 )
            })
            .get( );

        if ( orders$.data.length === 0 ) {
            return { status: 200 };
        }
        
        // 订单更新
        await Promise.all( orders$.data.map( order => {
            return db.collection('order').doc( String( order._id ))
                .update({
                    data: {
                        base_status: '5'
                    }
                })
        }));

        // 库存释放 ( 如果有库存的话 )
        await Promise.all( orders$.data.map( async order => {

            const targetId = order.sid || order.pid;
            const collection = order.sid ? 'standards' : 'goods';

            const target = await db.collection( collection )
                .doc( targetId )
                .get( );

            if ( target.data.stock === undefined || target.data.stock === null ) { return; }

            await db.collection( collection ).doc( targetId )
                .update({
                    data: {
                        stock: _.inc( order.count )
                    }
                });
        }));
        
        return { status: 200 }
    } catch ( e ) {
        console.log('!!!!定时器订单overtime错误',)
        return { status: 500 }
    }
};

/**
 * 订单2：所有成功支付的订单，检查有没有 type：pre的，有的话需要转成type:normal类型订单，删除对应的购物车（有的话）
 */
export const payedFix = async ( ) => {
    try {

        const orders$ = await db.collection('order')
            .where({
                type: 'pre',
                pay_status: '1'
            })
            .get( );

        if ( orders$.data.length === 0 ) {
            return { status: 200 };
        }

        // 订单更新
        await Promise.all( orders$.data.map( order => {
            return db.collection('order').doc( String( order._id ))
                .update({
                    data: {
                        type: 'normal'
                    }
                })
        }));

        // 删除对应的购物车
        await Promise.all(
            orders$.data
                .filter( x => !!x.cid )
                .map( order => {
                    return db.collection('cart').doc( order.cid )
                        .remove( )
                })
        );

        return {
            status: 200
        }


    } catch ( e ) {
        console.log('!!!!定时器订单payedFix错误',)
        return { status: 500 }
    }
}

/**
 * 订单3：已经进行购物清单价格调整后，新来的商品订单价格如果跟清单价格不一致，应该用定时器进行调整
 * !这类订单，暂时还没有能自动注入分配数量 allocatedCount
 */
export const priceFix = async ( ) => {
    try {

        // 获取当前进行中的行程
        const trips$ = await cloud.callFunction({
            name: 'trip',
            data: {
                $url: 'enter'
            }
        });

        const currentTrip = trips$.result.data[ 0 ];

        if ( !currentTrip ) { 
            return {
                status: 200
            }
        }

        const tid = currentTrip._id;

        // 找到所有已经调整好的清单列表
        const shoppinglists$ = await db.collection('shopping-list')
            .where({
                tid,
                base_status: '1'
            })
            .get( );
        
        await Promise.all( shoppinglists$.data.map( async shoppingList => {

            const { pid, sid, adjustPrice, adjustGroupPrice } = shoppingList;

            // 找到base_status: 0 的同商品订单
            const orders$ = await db.collection('order')
                .where({
                    tid,
                    pid,
                    sid,
                    base_status: '0'
                })
                .get( );
            
            // 订单更新
            await Promise.all( orders$.data.map( order => {
                return db.collection('order')
                    .doc( String( order._id ))
                    .update({
                        data: {
                            allocatedPrice: adjustPrice,
                            allocatedGroupPrice: adjustGroupPrice,
                            base_status: '1'
                        }
                    })
            }));

        }));

        return { status: 200 }

    } catch ( e ) {
        console.log('!!!!定时器订单priceFix错误', e );
        return { status: 500 }
    }
}

/**
 * 订单4：所有成功支付尾款的订单，把base_status设为3
 */
export const payLastFix = async ( ) => {
    try {
        
        const orders$ = await db.collection('order')
            .where({
                pay_status: '2',
                base_status: _.or( _.eq('0'), _.eq('1'),  _.eq('2'))
            })
            .get( );

        if ( orders$.data.length === 0 ) {
            return { status: 200 };
        }

        await Promise.all(
            orders$.data.map( order => {
                return db.collection('order')
                    .doc( String( order._id ))
                    .update({
                        data: {
                            base_status: '3'
                        }
                    })
            })
        )
        
    } catch ( e ) {
        console.log('!!!!定时器订单payLastFix错误',)
        return { status: 500 }
    }
}

/**
 * 订单4：新订单推送
 * 时间：12, 18, 0
 */
export const pushNew = async ( ) => {
    try {
        
        const nowDate = getNow( );
        
        // 0、判断是否在那几个时间戳之内
        if ( !checkIsInRange( nowDate, [ 12, 18, 0 ])) { 
            return { status: 200 };
        }

        // 1、获取current trip
        const trips$ = await cloud.callFunction({
            data: {
                $url: 'enter'
            },
            name: 'trip'
        });
        const trips = trips$.result.data;
        const trip = trips[ 0 ];

        // 2、获取 push: true 的管理员
        const members = await db.collection('manager-member')
            .where({
                push: true
            })
            .get( );

        if ( !trip || members.data.length === 0 ) {
            return { status: 200 };
        }

        await Promise.all(
            members.data.map( async member => {
                let count = 0;
                const { openid } = member

                // 3、获取上次浏览订单的时间戳
                const config$ = await db.collection('analyse-data')
                    .where({
                        openid,
                        tid: trip._id,
                        type: 'manager-trip-order-visit'
                    })
                    .get( );
                const tripOrderVisitConfig = config$.data[ 0 ];

                let query: any = {
                    tid: trip._id,
                    pay_status: _.neq('0'),
                    base_status: _.or( _.eq('0'), _.eq('1'), _.eq('2'))
                };

                if ( !!tripOrderVisitConfig ) {
                    query = Object.assign({ }, query, {
                        createTime: _.gte( tripOrderVisitConfig.value )
                    });
                }

                // 4、调用推送
                const count$ = await db.collection('order')
                        .where( query )
                        .count( );
                count = count$.total;


                if ( count === 0 ) { 
                    return { staus: 200 };
                }

                // 4、调用推送
                const push$ = await cloud.callFunction({
                    name: 'common',
                    data: {
                        $url: 'push-subscribe-cloud',
                        data: {
                            openid,
                            type: 'newOrder',
                            page: 'pages/manager-trip-list/index',
                            texts: [`你有${count}条新订单`, `点击查看`]
                        }
                    }
                });

                console.log( '==== push', push$.result )

                // 5、更新、创建配置
                if ( push$.result.status === 200 ) {

                    if ( !!tripOrderVisitConfig ) {

                        // 更新一下此条配置
                        await db.collection('analyse-data')
                            .doc( String( tripOrderVisitConfig._id ))
                            .update({
                                data: {
                                    value: getNow( true )
                                }
                            });
                    } else {
                        // 创建一下配置
                        await db.collection('analyse-data')
                            .add({
                                data: {
                                    openid,
                                    tid: trip._id,
                                    type: 'manager-trip-order-visit',
                                    value: getNow( true )
                                }
                            });
                    }
                }

                return;

            })
        );
        
        return {
            status: 200
        };

    } catch ( e ) {
        return {
            status: 500,
            message: typeof e === 'string' ? e : JSON.stringify( e )
        }
    }
}

/** 
 * 订单5: 尾款推送
 * 22点才处理
 */
export const pushLastPay = async ( ) => {

    // 0、是否为0点
    if ( checkIsInRange( getNow( ), [ 22 ])) {
        return { status: 200 }
    }

    // 1、获取上一趟trip
    // 按结束日期倒叙序，获取最多1条 已结束的行程
    const trip$ = await db.collection('trip')
        .where({
            isClosed: true
        })
        .limit( 1 )
        .orderBy('end_date', 'desc')
        .get( );

    // 2、获取 push: true 的管理员
    const members = await db.collection('manager-member')
        .where({
            push: true
        })
        .get( );
    
    if ( trip$.data.length === 0 || members.data.length === 0 ) {
        return { status: 200 };
    }

    await Promise.all(
        members.data.map( async member => {

            const { openid } = member;

            // 3、获取上次浏览尾款的时间戳
            const config$ = await db.collection('analyse-data')
                    .where({
                        openid,
                        tid: trip$.data[ 0 ]._id,
                        type: 'manager-pay-last-visit'
                    })
                    .get( );

            const config = config$.data[ 0 ];

            // 3、查询
            let query: any = {
                pay_status: '2',
                tid: trip$.data[ 0 ]._id,
            };

            if ( config ) {
                query = {
                    ...query,
                    paytime: _.gte( config.value )
                };
            }
            
            const orders$ = await db.collection('order')
                .where( query )
                .get( );

            const count = Array.from(
                new Set(
                    orders$.data.map( x => x.openid )
                )
            ).length;

            if ( count === 0 ) {
                return { staus: 200 };
            }

            // 4、调用推送
            const push$ = await cloud.callFunction({
                name: 'common',
                data: {
                    $url: 'push-subscribe-cloud',
                    data: {
                        openid,
                        type: 'getMoney',
                        page: 'pages/manager-trip-list/index',
                        texts: [`${count}人付了尾款`, `今天`]
                    }
                }
            });

            console.log( '==== push', push$.result )
            // 5、更新、创建配置
            if ( push$.result.status === 200 ) {

                if ( !!config ) {

                    // 更新一下此条配置
                    await db.collection('analyse-data')
                        .doc( String( config._id ))
                        .update({
                            data: {
                                value: getNow( true )
                            }
                        });
                } else {
                    // 创建一下配置
                    await db.collection('analyse-data')
                        .add({
                            data: {
                                openid,
                                tid: trip$.data[ 0 ]._id,
                                type: 'manager-pay-last-visit',
                                value: getNow( true )
                            }
                        });
                }
            }
        })
    );

}