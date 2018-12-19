/**
 * sid
 * pid
 * count
 */
const create$ = async( openid, data, db: DB.Database, ctx ) => {
    try {

        // 创建之前，处理占领货存的问题
        if ( data.isOccupied ) {
            // 如果是型号
            // 如果是主体商品
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
        return ctx.body = { status: 500, message: e };
    }
}

export { create$ }