// 云函数入口文件
import * as cloud from 'wx-server-sdk';

cloud.init();

const db: DB.Database = cloud.database();

/**
 * @description 创建、编辑，微信用户信息
 * -------- 请求 ----------
 * {
 *      avatar: ...,
 *      nickname: ...
 * }
 * ---------- 返回 --------
 * {
 *      status
 * }
 */
export const main = async (event, context) => {

  try {

    const total$ = await db.collection('user')
        .where({
            _id: ''
        })
        .count( );

    return new Promise( resolve => {
        resolve({
            status: 200,
            data: total$.total
        })
    })

  } catch ( e ) {
      return new Promise(( resolve, reject ) => {
          reject({
              status: 500,
              message: e
          })
      })
  }

}