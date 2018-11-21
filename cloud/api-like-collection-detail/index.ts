// 云函数入口文件
import * as cloud from 'wx-server-sdk';

cloud.init();

const db: DB.Database = cloud.database();

/**
 * @description 用户对是否商品的收藏
 * -------- 请求 ----------
 * {
 *      pid: 商品id
 * }
 * ---------- 返回 --------
 * {
 *      status
 *      data: boolean
 * }
 */
export const main = async ( event, context) => {

  try {

    const pid = event.pid;
    const openid = event.userInfo.openId;

    // 查找有没有该记录
    const history$ = await db.collection('like-collection')
        .where({
            pid,
            openid
        })
        .count( );

    return new Promise( resolve => {
        resolve({
            status: 200,
            data: history$.total > 0
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