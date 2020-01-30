import * as cloud from 'wx-server-sdk';
/**
 * 
 * 创建「预付款」订单！！！
 * 
 * data: {
 *   tid
 *   sid
 *   pid
 *   cid
 *   count
 * }
 */
const create$ = async( openid, data, db: DB.Database, ctx ) => {
    try {

        const { isOccupied, cid, tid, sid, pid } = data;
        // 创建之前，处理占领货存的问题
        if ( isOccupied ) {
            const deal$ = await cloud.callFunction({
                name: 'good',
                data: {
                    data,
                    $url: 'update-stock',
                }
            });
    
            if ( deal$.result.status !== 200 ) {
                throw '创建订单错误：整理库存失败'
            }
        }

        // 判断是否已经有对应的采购单，无的话付订金，有的话付全款（拼团价）
        const find$ = await db.collection('shopping-list')
            .where({
                tid,
                pid,
                sid
            })
            .get( );

        let shouldPayAll = false;
        const sl$ = find$.data[ 0 ];

        if ( !!sl$ ) {
            const { uids } = sl$;

            if ( uids.length === 1 && uids.includes( openid )) {
                shouldPayAll = false;
            } else {
                shouldPayAll = true;
            }

        } else {
            shouldPayAll = false;
        }

        const create$ = await db.collection('order')
            .add({
                data: {
                    ...data, 
                    openid,
                    used_integral: 0
                }
            });

        // 删除对应的购物车
        if ( !!cid ) {
            await db.collection('cart')
                .doc( cid )
                .remove( );
        }

        return {
            status: 200,
            data: {
                oid: create$._id,
                shouldPayAll
            }
        }
    } catch ( e ) {
        console.log(`----【Error-Order-Create】----：${JSON.stringify( e )}`);
        return ctx.body = { status: 500, message: e };
    }
}

export { create$ }