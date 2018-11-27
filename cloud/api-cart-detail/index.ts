// 云函数入口文件
import * as cloud from 'wx-server-sdk';

cloud.init();

const db: DB.Database = cloud.database();


/**
 * 根据商品id、型号id查询购物车结果
 * req: {
 *      sid
 *      pid
 *      openid
 * }
 * 
 * res: {
 *      status: 200/500,
 *      data: 购物车detail
 * }
 */
export const main = async (event, context) => {

    try {
  
        let find$: any = null;
        const { sid, pid } = event.data;
        const openid = event.userInfo.openId;

        if ( !!sid ) {
            find$ = await db.collection('cart')
                            .where({
                                pid,
                                openid,
                                standarad_id: sid
                            })
                            .get( );
        } else {
            find$ = await db.collection('cart')
                            .where({
                                pid,
                                openid,
                                standarad_id: null
                            })
                            .get( );
        }

        return new Promise( resolve => {
            resolve({
                status: 200,
                data: find$.data[ 0 ]
            });
        });
    } catch ( e ) {
        return new Promise( resolve => {
            resolve({
                status: 500,
                data: JSON.stringify( e )
            });
        });
    }

}