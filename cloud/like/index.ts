
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
                            createTime: getNow( true )
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
    });

    /** 
     * @description
     * 查询喜欢列表
     */
    app.router('list', async( ctx, next ) => {
        try {

            // 查询条数
            const limit = 10;
            const { page } = event.data;
            const openid = event.userInfo.openId;

            const total$ = await db.collection('like-collection')
                .where({
                    openid 
                })
                .count( );
            
            const like$ = await db.collection('like-collection')
                .where({
                    openid
                })
                .limit( limit )
                .skip(( page - 1 ) * limit )
                .orderBy('createTime', 'desc')
                .get( );

            const good$ = await Promise.all( like$.data.map( l => {
                return db.collection('goods')
                    .doc( String( l.pid ))
                    .get( );
            }));

            const activities$ = await Promise.all( like$.data.map( l => {
                return db.collection('activity')
                    .where({
                        pid: l.pid,
                        isClosed: false,
                        isDeleted: false,
                        type: 'good_discount',
                        endTime: _.gt( getNow( true ))
                    })
                    .get( );
            }));

            const insertActivities = good$.map(( meta, k ) => {
                return Object.assign({ }, meta.data, {
                    activity: activities$[ k ].data.length === 0 ? null : activities$[ k ].data[ 0 ]
                });
            });

            return ctx.body = {
                status: 200,
                data: {
                    page,
                    pageSize: limit,
                    data: insertActivities,
                    total: total$.total,
                    totalPage: Math.ceil( total$.total / limit )
                }
            }

        } catch ( e ) { return ctx.body = { status: 500 }}
    })

    return app.serve( );

}