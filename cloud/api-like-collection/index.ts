// 云函数入口文件
import * as cloud from 'wx-server-sdk';

cloud.init();

const db: DB.Database = cloud.database();

/**
 * @description 插入/删除 用户对商品的收藏
 * -------- 请求 ----------
 * {
 *      pid: 商品id
 * }
 * ---------- 返回 --------
 * {
 *      status
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

    // 新增
    if ( history$.total === 0 ) {
        await db.collection('like-collection')
            .add({
                data: {
                    pid,
                    openid
                }
            });
    // 删除
    } else {
        await db.collection('like-collection')
            .where({
                pid,
                openid
            })
            .remove( );
    }

    return new Promise( resolve => {
        resolve({
            status: 200
        });
    });
  } catch ( e ) {
    return new Promise(( resolve, reject ) => {
        resolve({
        status: 500,
        message: e
      })
    })
  }

}