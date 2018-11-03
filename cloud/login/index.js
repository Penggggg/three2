// 云函数入口文件
const cloud = require('wx-server-sdk');

/** 
 * 云函数入口函数
 * 返回openid、是否管理员
 */
exports.main = async (event, context) => {
  return new Promise( resolve => {
    resolve({
      openid: event.userInfo.openId
    });
  });
}