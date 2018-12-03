// 云函数入口文件
import * as cloud from 'wx-server-sdk';

cloud.init();

const db: DB.Database = cloud.database();

/**
 * @description 创建/编辑商品
 * -------- 请求 ----------
 * {
        title 标题 string
        destination 目的地 string
        start_date 开始时间 number
        end_date 结束时间 number
        reduce_price 行程立减 number
        sales_volume 销售总额
        fullreduce_atleast 行程满减 - 门槛 number
        fullreduce_values 行程满减 - 减多少 number
        cashcoupon_atleast 行程代金券 - 门槛 number
        cashcoupon_values 行程代金券 - 金额 number
        postage 邮费类型 dic 
        postagefree_atleast  免邮门槛 number
        payment 付款类型 dic 
        published 是否发布 boolean
        isPassed 是否过期
        createTime 创建时间
        updateTime 更新时间
 * }
 * -------- 请求 ----------
 * {
 *      _id: string
 *      status: 200 / 500
 * }
 */
export const main = async ( event, context) => {

    try {

        let _id = event.data._id;

        // 创建 
        if ( !_id ) {

            const create$ = await db.collection('trip').add({
                data: event.data
            });
            _id = create$._id;

        // 编辑
        } else {

            const origin$ = await db.collection('trip')
                                .where({
                                    _id
                                })
                                .get( );
            
            const origin = origin$.data[ 0 ];

            delete origin['_id'];
            delete event.data['_id']

            const temp = Object.assign({ }, origin, {
                ...event.data
            })

            await db.collection('trip')
                    .doc( _id )
                    .set({
                        data: temp
                    });

        }

        return new Promise( resolve => {
            resolve({
                data: _id,
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