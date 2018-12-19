import * as cloud from 'wx-server-sdk';
import * as TcbRouter from 'tcb-router';

cloud.init( );

const db: DB.Database = cloud.database( );
const _ = db.command;

export const main = async ( event, context ) => {

    const app = new TcbRouter({ event });

    app.router('detail', async( ctx, next ) => {
        try {

            // 获取数据
            const data$ = await db.collection('goods')
                .where({
                    _id: event.data._id
                })
                .get( );

            const metaList = data$.data;
            const standards = await Promise.all( metaList.map( x => {
                return db.collection('standards')
                    .where({
                        pid: x._id,
                        isDelete: false
                    })
                    .get( );
            }));

            const insertStandars = metaList.map(( x, k ) => Object.assign({ }, x, {
                standards: standards[ k ].data
            }));

            return ctx.body = {
                status: 200,
                data: insertStandars[ 0 ]
            };

        } catch ( e ) {
            return ctx.body = {
                status: 500,
                message: e
            };
        }
    });

    return app.serve( );

};