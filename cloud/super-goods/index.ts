
import * as cloud from 'wx-server-sdk';
import * as TcbRouter from 'tcb-router';

cloud.init({
    env: process.env.cloud
});

const db: DB.Database = cloud.database( );
const _ = db.command;

/** 
 * 转换格林尼治时区 +8时区
 * Date().now() / new Date().getTime() 是时不时正常的+8
 * Date.toLocalString( ) 好像是一直是+0的
 * 先拿到 +0，然后+8
 */
const getNow = ( ts = false ): any => {
    if ( ts ) {
        return Date.now( );
    }
    const time_0 = new Date( new Date( ).toLocaleString( ));
    return new Date( time_0.getTime( ) + 8 * 60 * 60 * 1000 )
}


/**
 *
 * @description 
 * 主推商品
 *      
 * category
 * detail
 * fadePrice
 * img
 * tag
 * title
 */
export const main = async ( event, context ) => {

    const app = new TcbRouter({ event });

    /**
     * @description
     * 更新 / 创建 一个主推商品
     * {
     *   _id?
     *   ...data
     * }
     */
    app.router('create', async( ctx, next ) => {
        try {

            const _id = event.data._id;
            const meta = event.data;

            delete meta['_id'];

            if ( _id ) {
                await db.collection('super-goods')
                    .doc( String( _id ))
                    .update({ 
                        data: {
                            ...meta,
                            updateTime: getNow( true )
                        }
                    });
            } else {
                await db.collection('super-goods')
                    .add({
                        data: {
                            ...meta,
                            updateTime: getNow( true )
                        }
                    })
            }

            return ctx.body = {
                status: 200
            }

        } catch ( e ) {
            console.log('???', e );
            return ctx.body = { status: 500 }
        }
    });

    /**
     * @description
     * 获取 一个主推商品
     * {
     *   _id
     * }
     */
    app.router('detail', async( ctx, next ) => {
        try {

            const _id = event.data._id;

            const find$ = await db.collection('super-goods')
                .doc( _id )
                .get( );

            return ctx.body = {
                status: 200,
                data: find$.data
            }

        } catch ( e ) {
            return ctx.body = { status: 500 }
        }
    });

    /**
     * @description
     * 获取 主推商品列表
     * {
     *    page
     * }
     */
    app.router('list', async( ctx, next ) => {
        try {

            const { page, title } = event.data

            // 查询条数
            const limit = 15;

            const search = { };

            // 获取总数
            const total$ = await db.collection('super-goods')
                .where( search )
                .count( );

            // 获取数据
            const data$ = await db.collection('super-goods')
                .where( search )
                .limit( limit )
                .skip(( event.data.page - 1 ) * limit )
                .orderBy('updateTime', 'desc')
                .get( );

            return ctx.body = {
                    status: 200,
                    data: {
                        page,
                        pageSize: limit,
                        data: data$.data,
                        total: total$.total,
                        totalPage: Math.ceil( total$.total / limit )
                    }
                };


        } catch ( e ) {
            return ctx.body = { status: 500 }
        }
    });

    /**
     * @description
     * 上下架 一个主推商品
     * {
     *   spid
     *   push: boolean
     * }
     */
    app.router('set-push', async( ctx, next ) => {
        try {

            const { spid, push } = event.data;

            await db.collection('super-goods')
                .doc( String( spid ))
                .update({
                    data: {
                        push
                    }
                })

            return ctx.body = {
                status: 200
            }

        } catch ( e ) {
            return ctx.body = { status: 500 }
        }
    });

    /**
     * @description
     * 上下架 一个主推商品
     * {
     *   spid
     *   push: boolean
     * }
     */
    app.router('delete', async( ctx, next ) => {
        try {

            const { spid } = event.data;

            await db.collection('super-goods')
                .doc( String( spid ))
                .remove( )

            return ctx.body = {
                status: 200
            }

        } catch ( e ) {
            return ctx.body = { status: 500 }
        }
    });

    return app.serve( );

}