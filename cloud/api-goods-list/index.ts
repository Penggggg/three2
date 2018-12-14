// 云函数入口文件
import * as cloud from 'wx-server-sdk';

cloud.init();

const db: DB.Database = cloud.database();

/**
 * @description 管理端的商品列表
 * -------- 请求 ----------
 * {
 *      search: 搜索
 *      page: 页数
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
      if ( !!event.title && !!event.title.trim( )) {

        const search = new RegExp(event.title.replace(/\s+/g, ""), 'i');
        // 获取总数
        const total$ = await db.collection('goods')
            .where({
              title: search
            })
            .count( );

        // 获取数据
        const data$ = await db.collection('goods')
            .where({
                title: search
            })
            .limit( limit )
            .skip(( event.page - 1 ) * limit )
            .orderBy('updateTime', 'desc')
            .get( );

        const metaList = data$.data;
        const standards = await Promise.all( metaList.map( x => {
            return db.collection('standards')
                .where({
                    pid: x._id,
                    isDelete: false
                })
                .get( );
        }));

        const insertStandars = metaList.map(( x, k ) => Object.assign({ }, x, {
            standards: standards[ k ].data
        }));

        // 查询被加入购物车数量
        const carts = await Promise.all( insertStandars.map( x => {
            return db.collection('cart')
                    .where({
                        pid: x._id
                    })
                    .count( );
        }))

        const insertCart = insertStandars.map(( x, k ) => Object.assign({ }, x, {
            carts: carts[ k ].total
        }));

        return new Promise( resolve => {
          resolve({
            status: 200,
            data: {
                search: event.title.replace(/\s+/g),
                pageSize: limit,
                page: event.page,
                data: insertCart,
                total: total$.total,
                totalPage: Math.ceil( total$.total / limit )
            }
          })
        })
      } else {

        // 获取总数
        const total$ = await db.collection('goods')
          .count( );

        // 获取数据
        const data$ = await db.collection('goods')
            .limit( limit )
            .skip(( event.page - 1 ) * limit )
            .orderBy('updateTime', 'desc')
            .get( );

        // 查询型号
        const metaList = data$.data;
        const standards = await Promise.all( metaList.map( x => {
          return db.collection('standards')
              .where({
                pid: x._id,
                isDelete: false
              })
              .get( );
        }));

        const insertStandars = metaList.map(( x, k ) => Object.assign({ }, x, {
            standards: standards[ k ].data
        }));

        // 查询被加入购物车数量
        const carts = await Promise.all( insertStandars.map( x => {
            return db.collection('cart')
                    .where({
                        pid: x._id
                    })
                    .count( );
        }))

        const insertCart = insertStandars.map(( x, k ) => Object.assign({ }, x, {
            carts: carts[ k ].total
        }));

        return new Promise( resolve => {
          resolve({
            status: 200,
            data: {
                search: null,
                pageSize: limit,
                page: event.page,
                data: insertCart,
                total: total$.total,
                totalPage: Math.ceil( total$.total / limit )
            }
          })
        })

      }

  } catch ( e ) {
      return new Promise(( resolve, reject ) => {
        resolve({
              status: 500,
              message: e
          })
      })
  }

}