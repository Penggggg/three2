// 云函数入口文件
import * as cloud from 'wx-server-sdk';

cloud.init();

const db: DB.Database = cloud.database();


/**
 * 创建、编辑单个购物车item
 * req: {
 *      _id
 *      openid
 *      pid: 商品id
 *      count: 选购数量
 *      standarad_id: 型号id
 *      current_price: 当时的价格
 * }
 * 
 * res: {
 *      status: 200/500
 *      data: 购物车id
 * }
 */
export const main = async (event, context) => {

    try {

        let _id = event.data._id;
        const openid = event.userInfo.openId;

        if ( !_id ) {
            // 创建
            const create$ = await db.collection('cart').add({
                data: Object.assign({ }, event.data, {
                    openid
                })
            });

            _id = create$._id;

        } else {
            // 编辑
            delete event.data[ _id ];
            await db.collection('cart').doc( _id ).update({
                data: event.data
            })
        }

        return new Promise( resolve => {
            resolve({
                data: _id,
                status: 200
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