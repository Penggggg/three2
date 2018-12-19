import * as cloud from 'wx-server-sdk';
/**
 * sid
 * pid
 * count
 */
const create$ = async( openid, data, db: DB.Database, ctx ) => {
    try {

        // 创建之前，处理占领货存的问题
        if ( data.isOccupied ) {
            const deal$ = await cloud.callFunction({
                name: 'good',
                data: {
                    $url: 'update-stock',
                    data: data
                }
            });
    
            if ( deal$.result.status !== 200 ) {
                throw '创建订单错误：整理库存失败'
            }
        }

        const create$ = await db.collection('order')
            .add({
                data: Object.assign({ }, data, {
                    openid
                })
            });

        return {
            status: 200,
            data: create$
        }
    } catch ( e ) {
        console.log(`----【Error-Order-Create】----：${JSON.stringify( e )}`);
        return ctx.body = { status: 500, message: e };
    }
}

export { create$ }