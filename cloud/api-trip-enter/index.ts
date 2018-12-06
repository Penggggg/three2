// 云函数入口文件
import * as cloud from 'wx-server-sdk';

cloud.init( );

const db: DB.Database = cloud.database( );
const _ = db.command;

/**
 * @description 返回两个行程，一个在用/即将到来，另一个下一趟即将到来
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

        return db.collection('trip')
            .where({
                published: true
            })
            .limit( 2 )
            .orderBy('start_date', 'asc')
            .get( )
            .then( data$ => {
                return {
                    status: 200,
                    data: data$.data
                }
            }).catch( e => {
                return {
                    status: 500
                }
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