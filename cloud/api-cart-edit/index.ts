// 云函数入口文件
import * as cloud from 'wx-server-sdk';

cloud.init();

const db: DB.Database = cloud.database();


/**
 * 创建、编辑单个购物车item
 * req: {
 *      _id
 *      pid: 商品id
 *      count: 数量
 *      standarad_id: 型号id
 *      current_price: 当时的价格
 * }
 * 
 * res: {
 *      status: 200/500
 * }
 */
export const main = async (event, context) => {

    try {
        return new Promise( resolve => {
            resolve({
                status: 200
            });
        });
    } catch( e ) {
        return new Promise( resolve => {
            resolve({
                status: 500
            });
        });
    }

}