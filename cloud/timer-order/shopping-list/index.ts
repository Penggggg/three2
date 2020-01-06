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
 * 清单1：查询未被安排进清单的订单（ pay_status: 1 的order ）
 */
export const catchLostOrders = async ( ) => {
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
            return { status: 200 };
        }

        const tid = currentTrip._id;

        // 拿到所有该行程下的已付订金订单、基本状态为0的订单
        const find1$ = await db.collection('order')
            .where({
                tid,
                pay_status: '1',
                base_status: '0'
            })
            .get( );

        if ( find1$.data.length === 0 ) { 
            return {
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

        await Promise.all( find1$.data.map( order => {
            return new Promise( async ( resolve, reject ) => {
                try {
                    const { sid, pid, _id, acid, openid, price, groupPrice } = order;
                    const currentGoodShoppingList = tripShoppingList.find( x => 
                        x.sid === sid &&
                        x.pid === pid &&
                        x.acid === acid
                    );

                    // 如果没有购物清单，则创建
                    // 如果有购物清单、但是清单里面的oids没有它，就插入并更新
                    if (( !currentGoodShoppingList ) ||
                        ( !!currentGoodShoppingList && !currentGoodShoppingList.oids.find( x => x === _id ) )) {

                        await cloud.callFunction({
                            name: 'shopping-list',
                            data: {
                                $url: 'create',
                                data: {
                                    openId: openid,
                                    list: [{
                                        tid,
                                        sid,
                                        pid,
                                        acid,
                                        price,
                                        groupPrice,
                                        oid: _id
                                    }]
                                }
                            }
                        });
                        resolve( );
                    
                    } 
                    resolve( );
                } catch ( e ) {
                    resolve( );
                }
            });
        }));
        
        return {
            status: 200
        }

    } catch ( e ) {
        console.log('!!!!定时器订单catchLostOrders错误', e );
        return { status: 500 };
    }
}

/** 清单2: 查询支付订金超时的订单，并把其从购物清单中去掉 */
export const removeUselessOrders = async ( ) => {
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

        const uselessOrders$ = await db.collection('order')
            .where({
                tid,
                base_status: '5'
            })
            .get( );

        await Promise.all( uselessOrders$.data.map( async order => {
            const orderId = order._id;
            const { pid, sid, tid } = order;

            let where$ = {
                pid,
                tid
            };

            if ( !!sid ) {
                where$ = Object.assign({ }, where$, {
                    sid
                });
            }

            const shoppingList$ = await db.collection('shopping-list')
                .where( where$ )
                .get( );
            const theShoppingList = shoppingList$.data[ 0 ];

            if ( !theShoppingList ) { return; }

            const { oids } = theShoppingList;
            const orderIndex = oids.findIndex( x => x === orderId );

            if ( orderIndex !== -1 ) {
                oids.splice( orderIndex, 1 )
                await db.collection( 'shopping-list' )
                    .doc( String( theShoppingList._id ))
                    .update({
                        data: {
                            oids
                        }
                    })
                return;
            }
            return;
        }));


    } catch ( e ) {
        return { status: 500 }
    }
}