// 云函数入口文件
import * as cloud from 'wx-server-sdk';

cloud.init();

const db: DB.Database = cloud.database();

/**
 * @description 商品销量排行榜列表
 * -------- 请求 ----------
 * {
 *      page: 页数
 *      search: 搜索
 *      category: 商品类目
 * }
 * ---------- 返回 --------
 * {
 *      data: 列表
 *      page: 页数
 *      total: 总数
 *      totalPage: 总页数
 *      pageSize: 20
 * }
 */
export const main = async (event, context) => {

  try {

    // 查询条数
    const limit = 20;
    const { category } = event;
    const search$ = event.search || '';
    const search = new RegExp( search$.replace(/\s+/g, ""), 'i');

    // 获取总数
    const total$ = await db.collection('goods')
        .where({
            category,
            title: search
        })
        .count( );

    // 获取数据
    const data$ = await db.collection('goods')
        .where({
            category,
            title: search
        })
        .limit( limit )
        .skip(( event.page - 1 ) * limit )
        .orderBy('saled', 'desc')
        .get( );

    const standards = await Promise.all( data$.data.map( x => {
        return db.collection('standards')
            .where({
                pid: x._id,
                isDelete: false
            })
            .get( );
    }));

    const insertStandars = data$.data.map(( x, k ) => Object.assign({ }, x, {
        standards: standards[ k ].data
    }));

    return new Promise( resolve => {
        resolve({
            status: 200,
            data: {
                search: search$.replace(/\s+/g),
                pageSize: limit,
                page: event.page,
                data: insertStandars,
                total: total$.total,
                totalPage: Math.ceil( total$.total / limit )
            }
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