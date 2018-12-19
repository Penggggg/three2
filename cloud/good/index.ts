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

    /**
     * @description 商品销量排行榜列表
     * -------- 请求 ----------
     * {
     *      page: 页数
     *      search: 搜索
     *      category: 商品类目
     * }
     * ---------- 返回 --------
     * {
     *      data: 列表
     *      page: 页数
     *      total: 总数
     *      totalPage: 总页数
     *      pageSize: 20
     * }
     */
    app.router('rank', async( ctx, next ) => {
        try {

            // 查询条数
            const limit = 20;
            const { category } = event.data;
            const search$ = event.data.search || '';
            const search = new RegExp( search$.replace(/\s+/g, ""), 'i');

            // 获取总数
            const total$ = await db.collection('goods')
                .where({
                    category,
                    title: search
                })
                .count( );

            // 获取数据
            const data$ = await db.collection('goods')
                .where({
                    category,
                    title: search
                })
                .limit( limit )
                .skip(( event.data.page - 1 ) * limit )
                .orderBy('saled', 'desc')
                .get( );

            const standards = await Promise.all( data$.data.map( x => {
                return db.collection('standards')
                    .where({
                        pid: x._id,
                        isDelete: false
                    })
                    .get( );
            }));

            const insertStandars = data$.data.map(( x, k ) => Object.assign({ }, x, {
                standards: standards[ k ].data
            }));

            return ctx.body = {
                status: 200,
                data: {
                    search: search$.replace(/\s+/g),
                    pageSize: limit,
                    page: event.data.page,
                    data: insertStandars,
                    total: total$.total,
                    totalPage: Math.ceil( total$.total / limit )
                }
            };
            
        } catch ( e ) {
            return ctx.body = {
                status: 500,
                message: e
            }
        }
    });

    app.router('list', async( ctx, next ) => {
        try {
     
            // 查询条数
            const limit = 20;

            // 查询条件
            const searchReq = {
                title: (!!event.data.title && !!event.data.title.trim( )) ? 
                    new RegExp(event.data.title.replace(/\s+/g, ""), 'i') : null
            };

            const temp = { };
            Object.keys( searchReq ).map( key => {
                if ( !!searchReq[ key ]) {
                    temp[ key ] = searchReq[ key ];
                }
            });

            // 获取总数
            const total$ = await db.collection('goods')
                .where( temp )
                .count( );
            
            // 获取数据
            const data$ = await db.collection('goods')
                .where( temp )
                .limit( limit )
                .skip(( event.data.page - 1 ) * limit )
                .orderBy('updateTime', 'desc')
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
   
            // 查询被加入购物车数量
            const carts = await Promise.all( insertStandars.map( x => {
                return db.collection('cart')
                        .where({
                            pid: x._id
                        })
                        .count( );
            }));

            const insertCart = insertStandars.map(( x, k ) => Object.assign({ }, x, {
                carts: carts[ k ].total
            }));

            return ctx.body = {
                status: 200,
                data: {
                    search: event.data.title.replace(/\s+/g),
                    pageSize: limit,
                    page: event.data.page,
                    data: insertCart,
                    total: total$.total,
                    totalPage: Math.ceil( total$.total / limit )
                }
            };

        } catch ( e ) {
            return ctx.body = {
                status: 500,
                message: e
            }
        } 
    });

    return app.serve( );

};