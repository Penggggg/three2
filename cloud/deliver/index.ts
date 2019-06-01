import * as cloud from 'wx-server-sdk';
import * as TcbRouter from 'tcb-router';

cloud.init({
    env: process.env.cloud
});

const db: DB.Database = cloud.database( );

/**
 *
 * @description 快递费用模块
 * 
 * _id
 * openid
 * tid
 * fee
 */
export const main = async ( event, context ) => {

    const app = new TcbRouter({ event });

    /**
     * @description 调整快递费用
     * -------- 请求 ---------
     * {
     *      _id?
     *      openid
     *      fee
     *      tid
     * }
     */
    app.router('adjust-fee', async( ctx, next ) => {
        try {

            const { _id, fee, tid } = event.data;
            const openid = event.data.openId || event.data.openid || event.userInfo.openId;

            // 创建
            if ( !_id ) {
                await db.collection('deliver-fee')
                    .add({
                        data: {
                            fee,
                            tid,
                            openid
                        }
                    })
            // 更新
            } else {
                await db.collection('deliver-fee')
                    .doc( _id )
                    .update({
                        data: {
                            fee
                        }
                    })
            }

            return ctx.body = {
                status: 200,
                data: null
            }
        } catch ( e ) { return ctx.body = { status: 500 };}
    });

    /** 
     * @description 获取指定几个行程的邮费列表
     * {
     *     openid
     *     tids
     * }
     */
    app.router('trips-fee', async( ctx, next ) => {
        try {

            const { tids } = event.data;
            const openid = event.data.openId || event.data.openid || event.userInfo.openId;

            const fees$$: any = await Promise.all( 
                tids.split(',')
                    .map( tid => 
                        db.collection('deliver-fee')
                            .where({
                                tid,
                                openid
                            })
                            .get( )
                    )
            );

            const meta = fees$$
                .filter( x => !!x.data[ 0 ])
                .map( x => x.data[ 0 ])

            return ctx.body = {
                status: 200,
                data: meta
            }
        } catch ( e ) { return ctx.body = { status: 500 };}
    });

    return app.serve( );
}