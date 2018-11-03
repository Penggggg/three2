// 云函数入口文件
const cloud = require('wx-server-sdk');
cloud.init( );
const db = cloud.database();

/** 
 * 云函数入口函数
 * 返回openid、是否管理员
 */
exports.main = async (event, context) => {

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