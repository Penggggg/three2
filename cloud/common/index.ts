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

    return app.serve( );

}