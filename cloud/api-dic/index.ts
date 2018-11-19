// 云函数入口文件
import * as cloud from 'wx-server-sdk';

cloud.init();

const db: DB.Database = cloud.database();

// 云函数入口函数
// 获取数据字典值
/**
 * data: {
     dicName: 'goods_category,xxx',
   },
 */
export const main = async (event, context) => {

  const dbRes = await db.collection('dic')
    .where({
      belong: db.RegExp({
        regexp: event.dicName.replace(/\,/g, '|'),
        optiond: 'i'
      })
    })
    .get( );

  let result = { };
  dbRes.data.map( dic => {
    result = Object.assign({ }, result, {
      [ dic.belong ]: dic[ dic.belong ]
    });
  });

  return new Promise( resolve => {
    resolve({
      ...result
    });
  });

}