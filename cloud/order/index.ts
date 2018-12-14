
import * as cloud from 'wx-server-sdk';
import * as TcbRouter from 'tcb-router';

cloud.init( );

const db: DB.Database = cloud.database( );

/**
 * 
 * @description 订单模块
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
 * aid
        * username, 收货人
        * postalcode, 邮政
        * phone, 收获电话
        * address, 收获地址
 * base_status: 0,1,2,3 准备中，进行中，已调整，已结算
 * pay_status: 0,1,2 未付款，已付订金，已付全款
 * deliver_status: 0,1 未发布，已发布、
 */
export const main = async ( event, context ) => {

    const app = new TcbRouter({ event });

    /**
     * @description 创建订单
     * -------- 请求 ----------
     * {
     *      from: 'cart' | 'buy' | 'custom' | 'agents' 来源：购物车、直接购买、自定义下单、代购下单
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
     */
    app.router('create', async( ctx, next ) => {
        try {

            const trips$ = await cloud.callFunction({
                data: { },
                name: 'api-trip-enter'
            });
    
            // 判断有没有可用行程
            if ( trips$.result.status !== 200 || !trips$.result.data || !trips$.result.data[ 0 ]) {
                return ctx.body = {
                    status: 400,
                    message: `没有最新行程，暂时无法结算！`
                };
            }

            const trip = trips$.result.data[ 0 ];

            // 根据地址对象，拿到地址id
    
            return ctx.body = trip;

        } catch ( e ) {
     
            return ctx.body = {
                status: 500,
                message: e
            };
        }
    });

    return app.serve( );

}