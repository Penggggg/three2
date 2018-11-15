// 云函数入口文件
const cloud = require('wx-server-sdk');

cloud.init();

const db = cloud.database();

// 云函数入口函数
exports.main = async (event, context) => {

  try {
    console.log( '..', event.data );
    await db.collection('goods').add({
      data: event.data,
    });

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