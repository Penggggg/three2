
import * as cloud from 'wx-server-sdk';
import * as TcbRouter from 'tcb-router';
import { create$ } from './create';
import { find$ } from './find';

cloud.init( );

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
     */
    app.router('getAddressId', async( ctx, next ) => {
        try {

            const sameAddress$ = await find$( event.userInfo.openId, { 
                address: event.data.address
            }, db );

            if ( sameAddress$ .status !== 200 ) {
                return ctx.body = sameAddress$;
            }

            return ctx.body = sameAddress$;

        } catch ( e ) {
            return ctx.body = {
                status: 500,
                message: e
            }
        }
    });

    return app.serve( );

}