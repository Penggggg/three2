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
export const main = async ( event, context ) => {

  try {

    const openid = event.userInfo.openId;
    const data$ = await db.collection('user')
        .where({
            openid
        })
        .get( )
        .catch( err => { throw `${err}`});

    // 如果不存在，则创建
    if ( data$.data.length === 0 ) {

        await db.collection('user')
            .add({
                data: Object.assign({ }, event.data, { openid })
            }).catch( err => { throw `${err}`});

    // 如果存在，则更新
    } else {
        const meta = Object.assign({ }, data$.data[ 0 ], event.data );
        delete meta._id;
        
        await db.collection('user').doc(( data$.data[ 0 ] as any)._id )
            .set({
                data: meta
            }).catch( err => { throw `${err}`});
    }    

    return new Promise( resolve => {
        resolve({
            status: 200
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