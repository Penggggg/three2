import * as cloud from 'wx-server-sdk';

cloud.init({
    env: process.env.cloud
});

const db: DB.Database = cloud.database( );
const _ = db.command;

/**
 * 订单1: 所有应该支付，但是没有支付（支付超时30分钟）的订单，释放原来的库存，订单重置为已过时
 */
export const overtime = async ( ) => {
    try {

        const orders$ = await db.collection('order')
            .where({
                pay_status: '0',
                base_status: '0',
                createTime: _.lte( new Date( ).getTime( ) - 30 * 60 * 1000 )
            })
            .get( );
        
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
        console.log('!!!!定时器订单priceFix错误',)
        return { status: 500 }
    }
}