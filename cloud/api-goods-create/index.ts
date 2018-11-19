// 云函数入口文件
import * as cloud from 'wx-server-sdk';

cloud.init();

const db = cloud.database();

/**
 * @description 创建商品
 * -------- 请求 ----------
 * {
 *      title: 商品名称 String
 *      detail!: 商品描述 String
 *      tag: 商品标签 Array<String>
 *      category: 商品类目 String
 *      img: 商品图片 Array<String>
 *      price: 价格 Number
 *      fadePrice: 划线价 Number
 *      groupPrice!: 团购价 Number
 *      stock!: 库存 Number
 *      depositPrice!: 商品订金 Number
 *      limit!: 限购数量 Number
 *      visiable: 是否上架 Boolean
 *      saled: 销量 Number
 *      standards!: 型号规格 Array<{ 
 *          name: String,
 *          price: Number,
 *          groupPrice!: Number,
 *          stock!: Number:
 *          img: String 
 *      }>
 * }
 * -------- 请求 ----------
 * {
 *      status: 200 / 500
 * }
 */
export const main = async (event, context) => {

  try {
    
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