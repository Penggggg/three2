// 云函数入口文件
import * as cloud from 'wx-server-sdk';

cloud.init();

const db: DB.Database = cloud.database();

/**
 * @description 商品详情
 * -------- 请求 ----------
 * {
 *      _id: 商品id
 * }
 * ---------- 返回 --------
 * {
 *      data: 商品详情
 *      status
 * }
 */
export const main = async ( event, context) => {

  try {
    // 获取数据
      const data$ = await db.collection('goods')
            .where({
                _id: event._id
            })
            .get( );

      return new Promise( resolve => {
            resolve({
                status: 200,
                data: data$.data[ 0 ]
            });
      });
  } catch ( e ) {
    return new Promise(( resolve, reject ) => {
      reject({
        status: 500,
        message: e
      })
    })
  }

}