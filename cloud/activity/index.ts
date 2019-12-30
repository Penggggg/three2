import * as cloud from 'wx-server-sdk';
import * as TcbRouter from 'tcb-router';

cloud.init({
    env: cloud.DYNAMIC_CURRENT_ENV
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
 * @description 商品活动模块
 * ! “一口价”： 同一商品，不同型号都可以参加，一口价是以型号为维度的
 * -------- 字段 ----------
 * type 类型 'good_discount'
 * pid
 * sid
 * title 型号名称
 * stock(可无)
 * endTime
 * ac_price
 * ac_groupPrice
 * createdTime
 * updatedTime
 * isClosed 是否已经上架
 * isDeleted 是否已经手动删除
 */
export const main = async ( event, context ) => {

    const app = new TcbRouter({ event });

    /**
     * @description
     * 创建
     * list: {
        * ac_groupPrice
        * ac_price
        * endTime
        * pid
        * sid
        * stock
        * title
     * }[ ]
     */
    app.router('create-good-discount', async( ctx, next ) => {
        try {
            
            const { list } = event.data;
            const dataMeta: any[ ] = list.map( x => Object.assign({ }, x, {
                isClosed: true,
                isDeleted: false,
                type: 'good_discount',
                updatedTime: getNow( true ),
                createdTime: getNow( true )
            }));

            // 错误定义
            const hasErr = message => ctx.body = {
                message,
                status: 500
            };

            // 去重
            const checks$: any = await Promise.all( dataMeta.map( meta => {
                const { pid, sid } = meta;
                return db.collection('activity')
                    .where({
                        pid,
                        sid,
                        isDeleted: false,
                        isClosed: false
                    })
                    .count( )
            }));

            // 去重错误
            const errorList: string[] = [ ];
            checks$.map(( x, k ) => {
                if (  x.total > 0 ) {
                    errorList.push( dataMeta[ k ].title );
                }
            });

            if ( errorList.length > 0 ) {
                return hasErr(`${errorList.join('、')} 特价已存在`);
            }

            // 新建
            const create$ = await Promise.all( dataMeta.map( meta => {
                return Promise.all([
                    db.collection('activity')
                        .add({
                            data: meta
                        }),
                    db.collection('goods')
                        .doc( meta.pid )
                        .update({
                            data: {
                                updateTime: getNow( true )
                            }
                        })
                ])
            }));

            return ctx.body = { 
                status: 200
            }
        } catch ( e ) {
            return ctx.body = { status: 500 };
        }
    });

    /**
     * @description
     * 检查是否有重复
     * list: {
        * pid
        * sid,
        * title
     * }[ ]
     */
    app.router('check-good-discount', async( ctx, next ) => {
        try {
            
            const { list } = event.data;

            // 错误定义
            const hasErr = message => ctx.body = {
                message,
                status: 500
            };

            // 去重
            const checks$: any = await Promise.all( list.map( meta => {
                const { pid, sid } = meta;
                return db.collection('activity')
                    .where({
                        pid,
                        sid,
                        isDeleted: false
                    })
                    .count( )
            }));

            // 去重错误
            const errorList: string[ ] = [ ];
            checks$.map(( x, k ) => {
                if (  x.total > 0 ) {
                    errorList.push( list[ k ].title );
                } 
            });

            if ( errorList.length > 0 ) {
                return hasErr(`${errorList.join('、')}特价已存在`);
            }

            return ctx.body = { 
                status: 200
            }
        } catch ( e ) {
            return ctx.body = { status: 500 };
        }
    });

    /** 
     * @description
     * 分页查询“一口价”活动商品列表
     * {
     *     page:(必填)
     *     limit
     *     filterBjp: false | true | undefined （ 是否过滤保健品 ）
     *     filterPass: boolean (是否过滤掉已过期 - 客户端要过滤掉)
     *     isClosed: undefined | true | false
     * }
     */
    app.router('good-discount-list', async( ctx, next ) => {
        try {

            let bjpConfig: any = null;
            // 查询条数
            const limit = event.data.limit || 20;
            const { isClosed, filterPass } = event.data;

            // 查询条件            
            let where$ = {
                isDeleted: false,
                type: 'good_discount'
            };

            // 保健品配置
            const bjpConfig$ = await db.collection('app-config')
                    .where({
                        type: 'app-bjp-visible'
                    })
                    .get( );
            bjpConfig = bjpConfig$.data[ 0 ];

            if ( isClosed !== undefined ) {
                where$ = Object.assign({ }, where$, {
                    isClosed
                });
            }

            if ( !!filterPass ) {
                where$ = Object.assign({ }, where$, {
                    endTime: _.gt( getNow( true ))
                });
            }

            const total$ = await db.collection('activity')
                .where( where$ )
                .count( );
    
            // 查询活动商品列表
            const data$ = await db.collection('activity')
                .where( where$ )
                .limit( limit )
                .skip(( event.data.page - 1 ) * limit )
                .orderBy('updatedTime', 'desc')
                .get( );

            let activities = data$.data;

            // 商品id列表
            const goodsIds = Array.from(
                new Set( activities.map( x => x.pid ))
            ).filter( x => !!x );

            // 型号id列表
            const sIds = Array.from(
                new Set( activities.map( x => x.sid ))
            ).filter( x => !!x );

            // 查询商品详情
            const goods$$ = await Promise.all( goodsIds.map( pid => {
                return db.collection('goods')
                    .doc( String( pid ))
                    .get( )
            }));
            const goods$ = goods$$.map( x => x.data );

            // 查询型号详情
            const standars$$ = await Promise.all( sIds.map( sid => {
                return db.collection('standards')
                    .doc( String( sid ))
                    .get( )
            }));

            const standars$ = standars$$.map( x => x.data );

            // 查询保健品数量、过滤保健品活动
            let bjpCount = 0;
            if ( !!bjpConfig && !bjpConfig.value ) {
                const notBjpActivies = activities
                    .filter( active => {
                        const { pid } = active;
                        const good = goods$.find( x => x._id === pid );
                        return !!good && String( good.category ) !== '4'
                    });
         
                bjpCount = activities.length - notBjpActivies.length;
                activities = notBjpActivies
            }


            // 数据处理
            const result = activities.map( meta => {

                let good = goods$.find( good$ => {
                    return good$._id === meta.pid
                });

                const standard = standars$.find( standar$ => {
                    return standar$._id === meta.sid
                });

                if ( !!standard ) {
                    good = Object.assign({ }, good, {
                        currentStandard: standard
                    });
                };

                return Object.assign({ }, meta, {
                    detail: good
                });
            });

            return ctx.body = {
                status: 200,
                data: {
                    list: result,
                    pagenation: {
                        total: total$.total - bjpCount,
                        pageSize: limit,
                        page: event.data.page,
                        totalPage: Math.ceil(( total$.total - bjpCount ) / limit )
                    }
                }
            }

        } catch ( e ) { return ctx.body = { status: 500 };}
    });

    /** 
     * @description 
     * 手动删除一个商品一口价活动
     */
    app.router('delete-good-discount', async( ctx, next ) => {
        try {
            const { acid } = event.data;
            await db.collection('activity')
                .doc( String( acid ))
                .update({
                    data: {
                        isDeleted: true
                    }
                });

            return ctx.body = {
                status: 200
            }
        } catch ( e ) { return ctx.body = { status: 500 };}
    });

    /** 
     * @description
     * 更新商品一口价活动
     * 全字段里，任意字段
     * acid
     */
    app.router('update-good-discount', async( ctx, next ) => {
        try {
            const { acid, pid } = event.data;
            const updateBody = event.data;
            delete updateBody.acid;

            await db.collection('activity')
                .doc( acid )
                .update({
                    data: Object.assign({ }, updateBody, {
                        updatedTime: getNow( true )
                    })
                });

            await db.collection('goods')
                .doc( pid )
                .update({
                    data: {
                        updateTime: getNow( true )
                    }
                });

            return ctx.body = {
                status: 200
            };

        } catch ( e ) {
            return ctx.body = { status: 500 };
        } 
    });

    return app.serve( );
}