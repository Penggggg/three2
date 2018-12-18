import * as cloud from 'wx-server-sdk';
import * as TcbRouter from 'tcb-router';
import { find$ } from './find';

cloud.init( );

const db: DB.Database = cloud.database( );
const _ = db.command;

/**
 * @description 行程清单模块
 * --------- 字段 ----------
 * tid
 * pid
 * ! sid ( 可为空 )
 * oids Array
 * status 0,1,2,3 未购买、已购买、买不全、买不到
 * img: Array
 * ! desc ( 可为空 )
 * createTime
 */
export const main = async ( event, context ) => {

    const app = new TcbRouter({ event });

    /**
     * @description
     * 判断请求的sid + tid + pid + count数组，返回不能购买的商品列表（清单里面买不到、买不全）、货全不足的商品（返回最新货存）
     * -------- 请求 ----------
     * {
     *     tid: string
     *!    openid?: string,
     *    list: { 
     *      tid
*           cid
*           sid
*           pid
*           price
*           groupPrice
*           count
*           desc
*           img
*           type
*           pay_status,
*           address: {
*              name,
*              phone,
*              detail,
*              postalcode
*           }
     *     }[ ]
     * }
     * -------- 返回 ----------
     * {
     *      * 已购买( 风险单 )
     *      hasBeenBuy: {
     *          tid, 
     *          pid,
     *          sid
     *      }[ ]
     *      * 买不到
     *      cannotBuy: { 
     *          tid, 
     *          pid,
     *          sid
     *      }[ ]
     *      * 货存不足
     *       lowStock: { 
     *          tid, 
     *          pid,
     *          sid,
     *          count,
     *          stock
     *      }[ ]
     *      * 型号已被删除 / 商品已下架
     *      hasBeenDelete: {
     *          tid, 
     *          pid,
     *          sid
     *      }[ ],
     *      * 订单号列表
     * }
     */
    app.router('findCannotBuy', async( ctx, next ) => {
        try {

            const { tid, list } = event.data;
            const openId = event.data.openId || event.userInfo.openId;

            // 不能购买的商品列表（清单里面买不到、买不全）
            const findings$: any = await Promise.all( event.data.list.map( i => {
                return find$({
                    tid: i.tid,
                    pid: i.pid,
                    sid: i.sid,
                    status: _.or( _.eq('2'), _.eq('3'))
                }, db, ctx )
            }))

            if ( findings$.some( x => x.status !== 200 )) {
                throw '查询购物清单错误';
            }

            // 已完成购买的商品列表
            const hasBeenBuy$: any = await Promise.all( event.data.list.map( i => {
                return find$({
                    tid: i.tid,
                    pid: i.pid,
                    sid: i.sid,
                    status: '1'
                }, db, ctx )
            }));

            // 查询商品详情、或者型号详情
            const goodDetails$: any = await Promise.all( event.data.list.map( i => {

                if ( !!i.sid ) {
                    return db.collection('standards')
                        .where({
                            _id: i.sid
                        })
                        .get( )
                } else {
                    return db.collection('goods')
                        .where({
                            _id: i.pid
                        })
                        .get( )
                }

            }));
           
            const goods = goodDetails$.map( x => x.data[ 0 ]).filter( y => !!y ).filter( z => !z.pid );
            const standards = goodDetails$.map( x => x.data[ 0 ]).filter( y => !!y ).filter( z => !!z.pid );

            // 库存不足
            let lowStock: any = [ ];

            // 被删除
            let hasBeenDelete: any = [ ];

            // 买不到
            const cannotBuy = findings$.map( x => x.data[ 0 ]).filter( y => !!y );

            // 已经被购买了（风险单）
            const hasBeenBuy = hasBeenBuy$.map( x => x.data[ 0 ]).filter( y => !!y )

            event.data.list.map( i => {
                // 型号
                if ( !!i.sid ) {
                    const standard = standards.find( x => x._id === i.sid && x.pid === i.pid );
                    if ( !standard ) {
                        hasBeenDelete.push( i );
                    } else if ( standard.stock !== undefined &&  standard.stock < i.count ) {
                        lowStock.push( Object.assign({ }, i, {
                            stock: standard.stock
                        }));
                    }
                // 主体商品
                } else {
                    const good = goods.find( x => x._id === i.pid );
                    if ( !good || ( !!good && !good.visiable )) {
                        hasBeenDelete.push( i )
                    } else if ( good.stock !== undefined &&  good.stock < i.count ) {
                        lowStock.push( Object.assign({ }, i, {
                            stock: good.stock
                        }));
                    }

                }
            });

            let orders = [ ];
            /**
             * 如果可以购买
             * ! 批量创建预付订单
             */
            if ( lowStock.length === 0 && cannotBuy.length === 0 && hasBeenDelete.length === 0 ) {
                const reqData = {
                    tid,
                    openId,
                    from: 'system',
                    orders: event.data.list
                }

                const createOrder$ = await cloud.callFunction({
                    data: {
                        data: reqData,
                        $url: 'create'
                    },
                    name: 'order'
                });

                if ( createOrder$.result.status !== 200 ) {
                    return ctx.body = {
                        status: 500,
                        message: '创建预付订单失败！'
                    };
                }
                orders = createOrder$.result.data;
            }

            return ctx.body = {
                data: {
                    lowStock,
                    hasBeenDelete,
                    cannotBuy,
                    hasBeenBuy,
                    orders
                },
                status: 200
            }

        } catch ( e ) {
     
            return ctx.body = {
                status: 500,
                message: e
            };
        }
    })

    return app.serve( );

}