// 云函数入口文件
// const cloud = require('wx-server-sdk');
import * as cloud from 'wx-server-sdk';

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});

const db: DB.Database = cloud.database();

/** 
 * 云函数入口函数
 * 返回openid、是否管理员
 */
export const main = async (event, context) => {

  const openid = event.userInfo.openId;
  const dbRes = await db.collection('manager-member')
    .where({
      openid
    })
    .get( );

  return new Promise( resolve => {
    resolve({
      openid,
      role: dbRes.data.length > 0 ? 1 : 0
    });
  });
}