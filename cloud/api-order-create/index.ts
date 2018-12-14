// 云函数入口文件
import * as cloud from 'wx-server-sdk';

cloud.init( );

const db: DB.Database = cloud.database( );

/**
 * @description 批量创建订单
 * -------- 字段 ----------
 * _id
 * openid,
 * createtime
 * tid,
 * pid,
 * sid,
 * count,
 * price,
 * type: 'custom' | 'normal' 自定义加单、普通加单
 * img: Array[ string ]
 * desc,
 * addressid
        * username, 收货人
        * postalcode, 邮政
        * phone, 收获电话
        * address, 收获地址
 * base_status: 0,1,2,3 准备中，进行中，已调整，已结算
 * pay_status: 0,1,2 未付款，已付订金，已付全款
 * deliver_status: 0,1 未发布，已发布、
 * 
 * -------- 请求 ----------
 * {
 *      from: 'cart' | 'buy' | 'custom' | 'agents'
 *      data: Array<{
 *          sid
 *          pid
 *          price
 *          count
 *          desc
 *          img
 *          type
 *          address: {
 *              name,
 *              phone,
 *              detail,
 *              postalcode
 *          }
 *      }>
 * }
 * ---------- 返回 --------
 * {
 *      status
 * }
 * @description
 * ! 先判断有没有可用行程。
 * ! 地址管理，先对比用旧地址id或新建的地址id
 */
export const main = async ( event, context ) => {
    return new Promise( async resolve => {
        try {
            
            const trips$ = await cloud.callFunction({
                data: { },
                name: 'api-trip-enter'
            });

            if ( trips$.result.status !== 200 || !trips$.result.data || !trips$.result.data[ 0 ]) {
                return resolve({
                    status: 400,
                    message: `没有最新行程，暂时无法结算！`
                });
            }

            const trip = trips$.result.data[ 0 ];

            return resolve({
                status: 200,
                data: trip
            });

        } catch ( e ) {
            return resolve({
                status: 500,
                message: e
            });
        }
    });

}