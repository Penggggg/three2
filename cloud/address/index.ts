
import * as cloud from 'wx-server-sdk';
import * as TcbRouter from 'tcb-router';
import { main as create$ } from './create';

cloud.init( );

const db: DB.Database = cloud.database( );

export const main = async ( event, context ) => {

    const app = new TcbRouter({ event });

    app.router('test', async( ctx, next ) => {
        ctx.body = create$( event, context );
    });

    return app.serve( );

}