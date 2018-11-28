// 云函数入口文件
import * as cloud from 'wx-server-sdk';

cloud.init();

const db: DB.Database = cloud.database();


/**
 * 购物车更新sku，连同可能变更的standards_id一起更新
 * ! 备注：由于开发时，云开发的doc.update有bug，standard_id无法更新为 null、''、0；因此更新符换用 .set
 * req: {
 *      _id
 *      openid
 *      pid: 商品id
 *      count: 选购数量
 *      standard_id: 型号id
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

        const openid = event.userInfo.openId;
        const { _id, standard_id, current_price, count, pid } = event;

        const data = {
            
        }

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
                
        return new Promise( resolve => {
            resolve({
                _id,
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