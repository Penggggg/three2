import * as cloud from 'wx-server-sdk';
import * as TcbRouter from 'tcb-router';

cloud.init( );

const db: DB.Database = cloud.database( );
const _ = db.command;

/**
 * @description 
 * 公共模块
 */
export const main = async ( event, context ) => {

    const app = new TcbRouter({ event });

    /** 数据字典 */
    app.router('dic', async( ctx, next ) => {
        try {

            const dbRes = await db.collection('dic')
                .where({
                    belong: db.RegExp({
                        regexp: event.data.dicName.replace(/\,/g, '|'),
                        optiond: 'i'
                    })
                })
                .get( );
        
            let result = { };
            dbRes.data.map( dic => {
                result = Object.assign({ }, result, {
                    [ dic.belong ]: dic[ dic.belong ]
                });
            });

            return ctx.body = {
                status: 200,
                data: result
            };

        } catch ( e ) {
            return ctx.body = {
                status: 500,
                message: e
            };
        }
    });

    /** 微信用户信息存储 */
    app.router('userEdit', async( ctx, next ) => {
        try {
            console.log( event );
            const openid = event.userInfo.openId;
            const data$ = await db.collection('user')
                .where({
                    openid
                })
                .get( )
                .catch( err => { throw `${err}`});
        
            // 如果不存在，则创建
            if ( data$.data.length === 0 ) {
        
                await db.collection('user')
                    .add({
                        data: Object.assign({ }, event.data, { openid })
                    }).catch( err => { throw `${err}`});
        
            // 如果存在，则更新
            } else {
                const meta = Object.assign({ }, data$.data[ 0 ], event.data );
                delete meta._id;
                
                await db.collection('user').doc(( data$.data[ 0 ] as any)._id )
                    .set({
                        data: meta
                    }).catch( err => { throw `${err}`});
            }    

            return ctx.body = {
                status: 200
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