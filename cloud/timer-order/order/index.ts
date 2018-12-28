import * as cloud from 'wx-server-sdk';

cloud.init( );

const db: DB.Database = cloud.database( );
const _ = db.command;

/**
 * 所有应该支付，但是支付超时（30分钟）的订单，释放原来的库存，订单重置为已过时
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

            const target = await db.collection( collection ).doc( targetId )
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
        console.log('!!!!定时器错误',)
        return { status: 500 }
    }
};