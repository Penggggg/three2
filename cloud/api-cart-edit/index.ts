// 云函数入口文件
import * as cloud from 'wx-server-sdk';

cloud.init();

const db: DB.Database = cloud.database();


/**
 * 创建、编辑单个购物车item，只能在商品详情sku选择时使用
 * 购物车更新sku，用cart-update
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