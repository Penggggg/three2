// 云函数入口文件
import * as cloud from 'wx-server-sdk';

cloud.init( );

const db: DB.Database = cloud.database();

/**
 * @description 行程详情
 * -------- 请求 ----------
 * {
 *      _id: 行程id
 * }
 * ---------- 返回 --------
 * {
 *      data: 行程详情
 *      status
 * }
 */
export const main = async ( event, context) => {

    try {

        // 获取基本详情
        const data$ = await db.collection('trip')
              .where({
                  _id: event._id
              })
              .get( );
        const meta = data$.data[ 0 ];

        // 通过已选的商品ids,拿到对应的图片、title、_id
        const products$: any = await Promise.all( meta.selectedProductIds.map( pid => {
            return db.collection('goods')
                    .where({
                        _id: pid
                    })
                    .field({
                        img: true,
                        title: true
                    })
                    .get( );
        }));

        meta.selectedProducts = products$.map( x => {
            return x.data[ 0 ];
        });
        

        return new Promise( resolve => {
              resolve({
                  status: 200,
                  data: data$.data[ 0 ]
              });
        });
    } catch ( e ) {
        return new Promise(( resolve, reject ) => {
            reject({
                status: 500,
                message: e
            })
        })
    }

}