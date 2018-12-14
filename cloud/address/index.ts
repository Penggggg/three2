
import * as cloud from 'wx-server-sdk';
import * as TcbRouter from 'tcb-router';
import { create$ } from './create';

cloud.init( );

const db: DB.Database = cloud.database( );

export const main = async ( event, context ) => {

    const app = new TcbRouter({ event });

    app.router('create', async( ctx, next ) => {
        ctx.body = create$( event, context );
    });

    return app.serve( );

}