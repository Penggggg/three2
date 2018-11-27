// 云函数入口文件
import * as cloud from 'wx-server-sdk';

cloud.init();

const db: DB.Database = cloud.database();


/**
 * 购物车lie 白哦
 * req: {
 *      openid
 * }
 * 
 * res: {
 *      status: 200/500
 *      data: Array<{
 *          cart: cart详情，
 *          detail: product + standards详情
 *      }>
 * }
 */
export const main = async (event, context) => {

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

        return new Promise( resolve => {
            resolve({
                status: 200,
                data: goodsDetails$
            });
        });
    } catch( e ) {
        return new Promise( resolve => {
            resolve({
                status: 500,
                data: JSON.stringify( e )
            });
        });
    }

}