import * as cloud from 'wx-server-sdk';
import * as TcbRouter from 'tcb-router';

cloud.init( );

const db: DB.Database = cloud.database( );

/**
 *
 * @description 地址模块
 * -------- 字段 ----------
 *      _id
 *      openid
        username, 收货人
        postalcode, 邮政
        phone, 收获电话
        address, 收获地址
 * 
 */
export const main = async ( event, context ) => {

    const app = new TcbRouter({ event });

    app.router('list', async( ctx, next ) => {
        try {

            const openid = event.userInfo.openId;
            const meta$ = await db.collection('cart')
                            .where({
                                openid
                            })
                            .get( );

            // 需要查询 商品详情
            const goodsDetails$ = await Promise.all( meta$.data.map( cart => {
                return cloud.callFunction({
                    data: {
                        _id: cart.pid
                    },
                    name: 'api-goods-detail'
                }).then( res => {
                    return {
                        cart,
                        detail: res.result.data
                    }
                })
            }));

            return ctx.body = {
                status: 200,
                data: goodsDetails$
            };

        } catch ( e ) {
            return ctx.body = {
                status: 500,
                message: e
            }
        }
    });

    app.router('delete', async( ctx, next ) => {
        try {

            const idArr = event.data.ids.split(',')
            await Promise.all( idArr.map( id => {
                return db.collection('cart')
                        .where({
                            _id: id
                        })
                        .remove( );
            }));

            return ctx.body = {
                status: 200
            };

        } catch ( e ) {
            return ctx.body = {
                status: 500,
                message: e
            }
        }
    });

    app.router('update', async( ctx, next ) => {
        try {

            const openid = event.userInfo.openId;
            const { _id, standard_id, current_price, count, pid } = event.data;
    
            await db.collection('cart').doc( _id )
                    .set({
                        data: {
                            pid,
                            count,
                            openid,
                            standard_id,
                            current_price
                        }
                    });

            return ctx.body = {
                _id,
                status: 200
            };

        } catch ( e ) {
            return ctx.body = {
                status: 500,
                message: e
            }
        }
    });

    app.router('edit', async( ctx, next ) => {
        try {

            let _id: any = '';
            let { pid, standard_id } = event.data;
            const openid = event.userInfo.openId;

            // 先用sid + pid查询有没有已有的cart，有则更新，无则创建
            const find$ = await db.collection('cart')
                    .where({
                        pid,
                        openid,
                        standard_id,
                    })
                    .get( );
            const result = find$.data[ 0 ];

        
            if ( !result ) {
                // 创建
                const create$ = await db.collection('cart').add({
                    data: Object.assign({ }, event.data, {
                        openid
                    })
                });
    
                _id = create$._id;
    
            } else {
                // 编辑
                await db.collection('cart').doc( (result as any)._id ).update({
                    data: event.data
                })
                _id = find$.data[ 0 ]._id;
            }

            return ctx.body = {
                data: _id,
                status: 200
            };

        } catch ( e ) {
            return ctx.body = {
                status: 500,
                message: e
            }
        }
    });

    return app.serve( );

}