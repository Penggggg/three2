
import * as cloud from 'wx-server-sdk';
import * as TcbRouter from 'tcb-router';
import { create$ } from './create';
import { find$ } from './find';

cloud.init({
    env: cloud.DYNAMIC_CURRENT_ENV
});

const db: DB.Database = cloud.database( );

/**
 *
 * @description 地址模块
 * -------- 字段 ----------
 *      _id
 *      openid
        username, 收货人
        postalcode, 邮政
        phone, 收获电话
        address, 收获地址
 * 
 */
export const main = async ( event, context ) => {

    const app = new TcbRouter({ event });

    /**
     * @@description 根据地址对象，拿到已有的地址id或者创建一个新的地址并返回id
     * ---------- 请求 -----------
     * {
     *!     openid?: string
            address: {
                username, 收货人
                postalcode, 邮政
                phone, 收获电话
                address, 收获地址
            }
     * }
     */
    app.router('getAddressId', async( ctx, next ) => {
        try {

            // 此处openId可被传值，用于代购为客户增加自定义订单
            const openId = event.data.openId || event.userInfo.openId;
            const sameAddress$ = await find$( openId, { 
                address: event.data.address.address
            }, db, ctx );

            // 查询到旧的相同地址
            if ( sameAddress$.data && sameAddress$.data.length > 0 ) {
                return ctx.body = {
                    status: 200,
                    data: sameAddress$.data[ 0 ]._id
                }
            }
            
            const saveData = {
                ...event.data.address
            };

            // 创建新的地址
            const cerateAddress$ = await create$( openId, saveData, db, ctx );

            return ctx.body = {
                status: 200,
                data: (cerateAddress$.data as any)._id
            }

        } catch ( e ) {
            return ctx.body = {
                status: 500,
                message: e
            }
        }
    });

    return app.serve( );

}