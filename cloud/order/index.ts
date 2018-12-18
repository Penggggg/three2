
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
 * type: 'custom' | 'normal' | 'pre' 自定义加单、普通加单、预订单
 * img: Array[ string ]
 * desc,
 * aid
        * username, 收货人
        * postalcode, 邮政
        * phone, 收获电话
        * address, 收获地址
 * ! base_status: 0,1,2,3,4 进行中（客户还可以调整自己的订单），已购买，已调整，已结算，已取消
 * ! pay_status: 0,1,2 未付款，已付订金，已付全款
 * ! deliver_status: 0,1 未发布，已发布、
 */
export const main = async ( event, context ) => {

    const app = new TcbRouter({ event });

    /**
     * @description 创建订单
     * -------- 请求 ----------
     * {
     *      from: 'cart' | 'buy' | 'custom' | 'agents' 来源：购物车、直接购买、自定义下单、代购下单
     *      orders: Array<{ 
     *          cid
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
                data: {
                    $url: 'enter'
                },
                name: 'trip'
            });
    
            // 1、判断有没有可用行程
            if ( trips$.result.status !== 200 || !trips$.result.data || !trips$.result.data[ 0 ]) {
                return ctx.body = {
                    status: 400,
                    message: `暂无行程计划，暂时不能购买～`
                };
            }

            // 最新可用行程
            const trip = trips$.result.data[ 0 ];

            /**
             * ! 订单主人的openid
             */
            let openid;

            /**
             * ! 根据地址对象，拿到地址id
             */
            let addressid$ = {
                result: {
                    data: null,
                    status: 500
                }
            };

            // 2、根据来源，整理地址id
            // 订单来源：购物车
            if ( event.data.from === 'cart' ) {
                openid = event.data.openId;
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

            // 3、批量创建订单，（过滤掉不能创建购物清单的商品）
            const temp = event.data.orders.map( meta => {
                return Object.assign({ }, meta, {
                    aid,
                    tid: trip._id,
                    openid: openid,
                    createTime: new Date( ).getTime( ),
                });
            });

            // 4、批量加入或创建购物清单

            // 5、批量删除已加入购物清单的购物车商品
    
            return ctx.body = {
                status: 200,
                data: temp,
                message: '购买成功！'
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