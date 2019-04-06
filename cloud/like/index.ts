
import * as cloud from 'wx-server-sdk';
import * as TcbRouter from 'tcb-router';

cloud.init( );

const db: DB.Database = cloud.database( );
const _ = db.command;

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
     * @description
     * 收藏 / 取消收藏一款商品
     * {
     *   pid
     * }
     */
    app.router('create', async( ctx, next ) => {
        try {

            const pid = event.data.pid;
            const openid = event.userInfo.openId;
        
            // 查找有没有该记录
            const history$ = await db.collection('like-collection')
                .where({
                    pid,
                    openid
                })
                .count( );
        
            // 新增
            if ( history$.total === 0 ) {
                await db.collection('like-collection')
                    .add({
                        data: {
                            pid,
                            openid,
                            createTime: new Date( ).getTime( )
                        }
                    });
            // 删除
            } else {
                await db.collection('like-collection')
                    .where({
                        pid,
                        openid
                    })
                    .remove( );
            }

            return ctx.body = {
                status: 200
            }

        } catch ( e ) {
            return ctx.body = { status: 500 }
        }
    });

    /**
     * @description
     * 在商品详情里查询是否有收藏
     */
    app.router('check', async( ctx, next ) => {
        try {
            const pid = event.data.pid;
            const openid = event.userInfo.openId;

            // 查找有没有该记录
            const history$ = await db.collection('like-collection')
                .where({
                    pid,
                    openid
                })
                .count( );

            return ctx.body = {
                status: 200,
                data: history$.total > 0
            }

        } catch ( e ) { return ctx.body = { status: 500 };}
    })

    return app.serve( );

}