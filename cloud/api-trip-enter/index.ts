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
    return new Promise( async resolve => {
        try {

            // 按开始日期正序，获取最多2条已发布，未结束的行程
            const data$ = await db.collection('trip')
                .where({
                    isClosed: false,
                    published: true,
                    end_date: _.gt( new Date( ).getTime( ))
                })
                .limit( 2 )
                .orderBy('start_date', 'asc')
                .get( );

            let trips = data$.data;
            // 拉取最新行程的推荐商品
            if ( !!trips[ 0 ]) {
                const tripOneProducts$ = await Promise.all( trips[ 0 ].selectedProductIds.map( pid => {
                    return cloud.callFunction({
                        data: {
                            _id: pid
                        },
                        name: 'api-goods-detail'
                    }).then( res => res.result.data );
                }));
                trips[ 0 ] = Object.assign({ }, trips[ 0 ], {
                    products: tripOneProducts$
                });

            }

            return resolve({
                status: 200,
                data: trips
            })

        } catch ( e ) {
            return resolve({
                status: 500,
                message: e
            });
        }
    });

}