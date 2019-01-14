import * as cloud from 'wx-server-sdk';
import * as TcbRouter from 'tcb-router';

cloud.init( );

const db: DB.Database = cloud.database( );

/**
 *
 * @description 卡券模块
 * -------- 字段 ----------
 * tid 领取该优惠券的所属行程
 * title 券名称
 * type: 't_lijain' | 't_manjian' | 't_daijin' 券类型：行程立减、行程满减、行程代金券
 * isUsed: 是否已用
 * openid
 * canUseInNext: 是否下趟可用
 * atleast: 消费门槛
 * value：消费优惠额度
 *! valiterm: 有效期日期(可无)
 * createTime 创建日期
 * reduce_type: 'yuan' | 'percent' 优惠类型：元、折扣
 */
export const main = async ( event, context ) => {

    const app = new TcbRouter({ event });

    /**
     * @description 创建优惠券
     * -------- 请求 ---------
     * {
     *   tid
     *   title
     *   openid  
     *   type
     *   canUseInNext
     *   atleast
     *   value
     *!   valiterm
     *!   reduce_type
     * }
     */
    app.router('create', async( ctx, next ) => {
        try {

            const openid = event.data.openId || event.userInfo.openId;
            const temp = Object.assign({ }, event.data, {
                openid,
                isUsed: false,
                reduce_type: event.data.reduce_type || 'yuan',
                createTime: new Date( ).getTime( )
            });

            const add$ = await db.collection('coupon')
                .add({
                    data: temp
                });

            return ctx.body = {
                status: 200,
                data: add$._id
            }
        } catch ( e ) { return ctx.body = { status: 500 };}
    });

    /**
     * @description 补齐立减券
     * -------- 请求 --------
     * {
     *    tid
     * }
     */
    app.router('repair-lijian', async( ctx, next ) => {
        try {

            const { tid } = event.data;
            const openid = event.data.openId || event.userInfo.openId;

            const trip$ = await db.collection('trip')
                .doc( tid )
                .get( );

            const trip = trip$.data;
            const { reduce_price } = trip;

            const find$ = await db.collection('coupon')
                .where({
                    tid,
                    openid,
                    type: 't_lijain'
                })
                .get( );
            const target = find$.data[ 0 ];

            if ( !target ) {
                return ctx.body = {
                    status: 200
                };
            }

            await db.collection('coupon')
                .doc( String( target._id ))
                .update({
                    data: {
                        value: reduce_price
                    }
                });

            return ctx.body = {
                status: 200
            };

        } catch ( e ) {
            return ctx.body = { status: 500 };
        }
    });

    /**
     * @description 检测行程里面，客户是否已经领取这几类的优惠券, null为没有该类型优惠，true为已经领取，false为未领取
     * -------- 请求 -------
     * {
     *   tid: 
     *   openid: 
     *   check: 't_lijain,t_manjian,t_daijin'
     * }
     * ----- 返回 -----
     * {
     *   status,
     *   data: {
     *     t_lijain: null/true/false/half
     *     t_manjian: null/true/false
     *     t_daijin: null/true/false
     *   } 
     * }
     */
    app.router('isget', async( ctx, next ) => {
        try {
            
            const { tid, check } = event.data;
            const openid = event.data.openId || event.userInfo.openId;

            // 先检查，该行程有没有该种优惠
            const trip$ = await db.collection('trip')
                .doc( tid )
                .get( );

            const trip = trip$.data;
            // 行程立减金额/行程满减金额/行程代金券金额
            const { reduce_price, fullreduce_values, cashcoupon_values } = trip;
            
            // 行程立减代金券
            const lijain$ = await db.collection('coupon')
                .where({
                    tid,
                    openid,
                    type: 't_lijain'
                })
                .get( );

            // 行程满减券
            const manjian$ = await db.collection('coupon')
                .where({
                    tid,
                    openid,
                    type: 't_manjian'
                })
                .get( );

            // 行程立减券
            const daijin$ = await db.collection('coupon')
                .where({
                    tid,
                    openid,
                    type: 't_daijin'
                })
                .get( );

            const temp = { };
            check.split(',').map( checkType => {

                if ( checkType === 't_manjian' ) {
                    temp[ checkType ] = !!fullreduce_values ?
                        manjian$.data.length === 0 ? 
                            false :
                            true :
                        null
                } else if ( checkType === 't_daijin' ) {
                    temp[ checkType ] = !!cashcoupon_values ?
                        daijin$.data.length === 0 ? 
                            false :
                            true :
                        null
                } else if ( checkType === 't_lijain' ) {
                    temp[ checkType ] = !!reduce_price ?
                        lijain$.data.length === 0 ? 
                            false :
                            lijain$.data[ 0 ].value < reduce_price ?
                                'half' :
                                true :
                        null
                }

            });

            return ctx.body = {
                status: 200,
                data: temp
            }
        } catch ( e ) { return ctx.body = { status :500 };}
    })
    

    return app.serve( );
};