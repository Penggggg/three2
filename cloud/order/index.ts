
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
 * ! sid, (可为空)
 * count,
 * price,
 * ! group_price (可为空)
 * type: 'custom' | 'normal' 自定义加单、普通加单
 * img: Array[ string ]
 * desc,
 * aid
        * username, 收货人
        * postalcode, 邮政
        * phone, 收获电话
        * address, 收获地址
 * base_status: 0,1,2,3,4 进行中（客户还可以调整自己的订单），已购买，已调整，已结算，已取消
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
     *      orders: Array<{
     *          sid
     *          pid
     *          price
     *          group_price
     *          count
     *          desc
     *          img
     *          type
     *          pay_status,
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
            
            const { from, orders } = event.data;
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

            // 最新可用行程
            const trip = trips$.result.data[ 0 ];
            // 订单主人的openid
            let openid = event.data.openId;

            // 根据地址对象，拿到地址id
            let addressid$ = {
                result: {
                    data: null,
                    status: 500
                }
            };
            let base_status = '0';
            let deliver_status = '0'


            // 根据来源，整理地址id、基本状态、快递状态
            // 订单来源：购物车
            if ( event.data.from === 'cart' ) {
                addressid$ = await cloud.callFunction({
                    data: { 
                        data: {
                            address: event.data.orders[ 0 ].address
                        },
                        $url: 'getAddressId'
                    },
                    name: 'address'
                });
            }
            
            if ( addressid$.result.status !== 200 ) {
                return ctx.body = {
                    status: 500,
                    message: '查询地址错误'
                };
            }

            // 可用地址id
            const aid = addressid$.result.data;

            // 批量存储订单对象
            const temp = event.data.orders.map( meta => {
                return Object.assign({ }, meta, {
                    aid,
                    tid: trip._id,
                    openid: openid,
                    createTime: new Date( ).getTime( ),
                });
            });
    
            return ctx.body = {
                status: 200,
                data: temp
            };

        } catch ( e ) {
     
            return ctx.body = {
                status: 500,
                message: e
            };
        }
    });

    return app.serve( );

}