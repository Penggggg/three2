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
 * 创建/编辑商品
 * {
 *      _id: id
 *      isDelete: 是否删除
 *      title: 商品名称 String
 *      detail!: 商品描述 String
 *      tag: 商品标签 Array<String>
 *      category: 商品类目 String
 *      img: 商品图片 Array<String>
 *      price: 价格 Number
 *      fadePrice: 划线价 Number
 *      groupPrice!: 团购价 Number
 *      stock!: 库存 Number
 *      depositPrice!: 商品订金 Number
 *      limit!: 限购数量 Number
 *      visiable: 是否上架 Boolean
 *      saled: 销量 Number
 *      updateTime
 *!      standards!: 型号规格 Array<{ 
 *          name: String,
 *          price: Number,
 *          groupPrice!: Number,
 *          stock!: Number:
 *          img: String ,
 *          _id: string,
 *          pid: string,
 *          isDelete: boolean
 *      }>
 * }
 * 
 * 
 * @description
 * 商品浏览记录
 * 
 * {
 *   pid
 *   openid
 *   visitTime
 * }
 */
export const main = async ( event, context ) => {

    const app = new TcbRouter({ event });

    /**
     * @description
     * 商品详情
     * ----- 请求 -----
     * _id
     */
    app.router('detail', async( ctx, next ) => {
        try {

            const _id = event.data._id;
            const openid = event.userInfo.openId;

            // 获取数据
            const data$ = await db.collection('goods')
                .where({
                    _id
                })
                .get( );

            // 拼接型号
            const metaList = data$.data;
            const standards = await Promise.all( metaList.map( x => {
                return db.collection('standards')
                    .where({
                        pid: x._id,
                        isDelete: false
                    })
                    .get( );
            }));

            // 拼接型号或商品活动
            const activities$ = await db.collection('activity')
                .where({
                    pid: _id,
                    isClosed: false,
                    isDeleted: false,
                    type: 'good_discount',
                    endTime: _.gt( getNow( true ))
                })
                .field({
                    pid: true,
                    sid: true,
                    title: true,
                    ac_price: true,
                    endTime: true,
                    ac_groupPrice: true
                })
                .get( );

            const insert = metaList.map(( x, k ) => Object.assign({ }, x, {
                activities: activities$.data,
                standards: standards[ k ].data
            }));

            // 创建浏览
            await cloud.callFunction({
                data: {
                    data: {
                        openid,
                        pid: _id,
                    },
                    $url: 'update-good-visit-record'
                },
                name: 'good'
            });

            return ctx.body = {
                status: 200,
                data: insert[ 0 ]
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
     *      limit
     *      sort: 排序
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

            let bjpConfig: any = null;
            // 查询条数
            const limit = event.data.limit || 20;
            const { category, sort } = event.data;
            const search$ = event.data.search || '';
            const search = new RegExp( search$.replace(/\s+/g, ""), 'i');

            let where$ = {
                category,
                title: search,
                visiable: true,
                isDelete: _.neq( true )
            };

            // 保健品配置
            const bjpConfig$ = await db.collection('app-config')
                    .where({
                        type: 'app-bjp-visible'
                    })
                    .get( );
            bjpConfig = bjpConfig$.data[ 0 ];

            if ( !category && !!bjpConfig && !bjpConfig.value ) {
                where$ = Object.assign({ }, where$, {
                    category: _.neq('4')
                })
            }

            // 获取总数
            const total$ = await db.collection('goods')
                .where( where$ )
                .count( );

            // 获取商品数据
            const data$ = await db.collection('goods')
                .where( where$ )
                .limit( limit )
                .skip(( event.data.page - 1 ) * limit )
                .orderBy( sort || 'saled', 'desc')
                .get( );

            // 获取型号数据
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

            // 获取活动数据数据
            const activities$ = await Promise.all(
                data$.data.map( good => {
                    return db.collection('activity')
                        .where({
                            pid: good._id,
                            isClosed: false,
                            isDeleted: false,
                            type: 'good_discount',
                            endTime: _.gt( getNow( true ))
                        })
                        .get( )
                })
            );

            const insertActivity = insertStandars.map(( x, k ) => Object.assign({ }, x, {
                activities: activities$[ k ].data
            }));

            return ctx.body = {
                status: 200,
                data: {
                    data: insertActivity,
                    search: search$.replace(/\s+/g, ''),
                    pagenation: {
                        pageSize: limit,
                        page: event.data.page,
                        total: total$.total,
                        totalPage: Math.ceil( total$.total / limit )
                    }
                }
            };
            
        } catch ( e ) {
            return ctx.body = {
                status: 500,
                message: e
            }
        }
    });

    /** 
     * @description
     * 拼团广场的可拼团列表
     *  -------- 请求 ----------
     * {
     *      page: 页数
     *      search: 搜索
     * }
     */
    app.router('pin-ground', async( ctx, next ) => {
        try {

            const { page } = event.data;
            const limit = event.data.limit || 10;

            const search$ = event.data.search || '';
            const search = new RegExp( search$.replace(/\s+/g, ""), 'i');

            let where$ = {
                title: search,
                visiable: true,
                isDelete: _.neq( true )
            };

            // 保健品配置
            const bjpConfig$ = await db.collection('app-config')
            .where({
                type: 'app-bjp-visible'
            })
            .get( );
            const bjpConfig = bjpConfig$.data[ 0 ];

            if ( !!bjpConfig && !bjpConfig.value ) {
                where$ = Object.assign({ }, where$, {
                    category: _.neq('4')
                })
            }

            // 获取总数
            const total$ = await db.collection('goods')
                .where( where$ )
                .count( );

            /**
             * 这里没对商品、型号
             * 进行 groupPrice: _.gt( 0 ) 
             * 的限制
             * 原因是有可能active是有团购价的
             */

            // 获取商品数据
            const data$ = await db.collection('goods')
                .where( where$ )
                .limit( limit )
                .skip(( page - 1 ) * limit )
                .orderBy( 'saled', 'desc')
                .get( );

            // 获取型号数据
            const standards = await Promise.all( data$.data.map( x => {
                return db.collection('standards')
                    .where({
                        pid: x._id,
                        isDelete: false,
                    })
                    .get( );
            }));

            const insertStandars = data$.data.map(( x, k ) => Object.assign({ }, x, {
                standards: standards[ k ].data
            }));

            // 获取活动数据数据
            const activities$ = await Promise.all(
                data$.data.map( good => {
                    return db.collection('activity')
                        .where({
                            pid: good._id,
                            isClosed: false,
                            isDeleted: false,
                            type: 'good_discount',
                            endTime: _.gt( getNow( true )),
                            ac_groupPrice: _.gt( 0 )
                        })
                        .get( )
                })
            );

            const insertActivity = insertStandars.map(( x, k ) => Object.assign({ }, x, {
                activities: activities$[ k ].data
            }));

            return ctx.body = {
                status: 200,
                data: {
                    data: insertActivity,
                    pagenation: {
                        page,
                        pageSize: limit,
                        total: total$.total,
                        totalPage: Math.ceil( total$.total / limit )
                    }
                }
            }

        } catch ( e ) {
            return ctx.body = { status: 500 };
        }
    })

    /**
     * 商品列表（ 含standards、activities子表）
     * {
     *    title
     *    search 
     *    page
     * }
     */
    app.router('list', async( ctx, next ) => {
        try {
     
            // 查询条数
            const limit = event.data.limit || 20;

            // 查询条件
            const searchReq = {
                title: (!!event.data.title && !!event.data.title.trim( )) ? 
                    new RegExp(event.data.title.replace(/\s+/g, ""), 'i') : null
            };

            const temp = {
                isDelete: _.neq( true )
            };
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
                    search: event.data.title.replace(/\s+/g, ''),
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

    app.router('edit', async( ctx, next ) => {
        try {

            let _id = event.data._id;

            // 判断是否有同名商品
            const { title } = event.data;
            if ( !_id ) {
                const check1$ = await db.collection('goods')
                .where({
                    title,
                    isDelete: _.neq( true )
                })
                .count( );

                if ( check1$.total !== 0 ) {
                    return ctx.body = {
                        status: 500,
                        message: '存在同名商品,请检查'
                    }
                };
            }

            if ( !_id ) {
                // 创建
                const { standards } = event.data;
    
                delete event.data['standards'];
    
                const create$ = await db.collection('goods').add({
                    data: Object.assign({ }, event.data, {
                        isDelete: false
                    })
                });
                _id = create$._id;
    
                // 插入型号
                if ( !!standards && Array.isArray( standards )) {
                    await Promise.all( standards.map( x => {
                        return db.collection('standards').add({
                            data: Object.assign({ }, x, {
                                pid: _id,
                                isDelete: false
                            })
                        });
                    }))
                }
            } else {
    
                // 更新
                const meta = { ...event.data };
                const standards = meta.standards;

                delete meta._id;
                delete event.data._id;
                delete event.data.standards;

                await db.collection('goods')
                    .doc( _id )
                    .set({
                        data: {
                            ...event.data
                        }
                    })
    
                // 0. 查询该产品底下所有的型号
                const allStandards$ = await db.collection('standards')
                                                .where({
                                                    pid: _id
                                                })
                                                .get( );
    
                // 需要“删除”的型号
                const wouldSetDelete: any[ ] = [ ];
    
                // 需要“更新”的型号
                const wouldUpdate: any[ ] = [ ];
    
                // 需要“增加”、“更新”的型号
                const wouldCreate = standards.filter( x => !x._id );
    
                allStandards$.data.filter( x => {
                    if ( !standards.find( y => y._id === x._id )) {
                        wouldSetDelete.push( x )
                    } else {
                        wouldUpdate.push( x )
                    }
                });
    
                // 1.  “删除”部分型号
                await Promise.all( wouldSetDelete.map( x => {
                    return db.collection('standards')
                            .doc( x._id )
                            .update({
                                data: {
                                    isDelete: true
                                }
                            })
                }));
    
                // 2. 更新部分型号信息
                await Promise.all( wouldUpdate.map( x => {
                    const newTarget = standards.find( y => y._id === x._id );
                    const { name, price, groupPrice, stock, img } = newTarget;
                    return db.collection('standards')
                            .doc( x._id )
                            .update({
                                data: {
                                    name, price, groupPrice, stock, img
                                }
                            })
                }));
    
                // 3. 新增部分型号
                await Promise.all( wouldCreate.map( x => {
                    return db.collection('standards').add({
                        data: {
                            ...x,
                            pid: _id,
                            isDelete: false
                        }
                    })
                }));
    
            }

            return ctx.body = {
                data: _id,
                status: 200
            };

        } catch ( e ) {
            return ctx.body = {
                status: 500,
                message: e
            }
        }
    })

    /**
     * @description
     * 根据预付订单的相关信息，减少、更新指定商品的库存
     * ---------- 请求 -----------
     * {
     *      sid,
     *      pid,
     *      count
     * }
     */
    app.router('update-stock', async( ctx, next ) => {
        try {

            const { sid, pid, count } = event.data;

            let target: any = null;
            const targetId = sid || pid;
            const collectionName = !!sid ? 'standards' : 'goods';

            const find$ = await db.collection( collectionName )
                .where({
                    _id: targetId
                })
                .get( );

            if ( find$.data.length === 0 ) {
                throw !!sid ? '更新库存异常, 当前型号不存在' : '更新库存异常, 当前商品不存在'
            }

            target = find$.data[ 0 ];

            // 无限库存
            if ( target.stock === null || target.stock === undefined ) {
                return ctx.body = {
                    status: 200
                }
            }

            // 判断库存是否足够
            if ( target.stock - count < 0 ) {
                throw !!sid ? '更新库存异常, 当前型号库存不足' : '更新库存异常, 当前商品库存不足';
            }

            // 更新
            await db.collection( collectionName ).doc( targetId )
                .update({
                    data: {
                        stock: _.inc( -count )
                    }
                })

            return ctx.body = {
                status: 200
            }

        } catch ( e ) {
            console.log(`----【Error-Good】----：${JSON.stringify( e )}`);
            return ctx.body = { status: 500, message: e };
        }
    })

    /**
     * @description
     * 客户端搜索商品列表（ 分类搜搜、或文字搜搜 ）
     * ! search 不会是空字符串
     * {
     *    search,
     *    page,
     *    category
     * }
     */
    app.router('client-search', async( ctx, next ) => {
        try {

            // 查询条数
            const limit = 10;
            let bjpConfig: any = null;
            const openid = event.userInfo.openId;
            const { search, page, category } = event.data;

            let query: any = null;


            if ( !!category ) {
                query = _.or([
                    {
                        category,
                        visiable: true,
                        isDelete: _.neq( true )
                    }, {
                        category,
                        visiable: true,
                        isDelete: _.neq( true )
                    }
                ]);
            }

            // 保健品配置
            const bjpConfig$ = await db.collection('app-config')
                    .where({
                        type: 'app-bjp-visible'
                    })
                    .get( );
            bjpConfig = bjpConfig$.data[ 0 ];

            // 搜索也要屏蔽保健品
            // 非管理人员才屏蔽
            if ( !!search ) {

                const adminCheck = await db.collection('manager-member')
                    .where({
                        openid
                    })
                    .count( );

                let categoryFilter = _.neq('9999');

                if ( !!bjpConfig && !bjpConfig.value && adminCheck.total === 0 ) {
                    categoryFilter = _.neq('4')
                }

                /**
                 * 搜索纬度：
                 * 商品标题
                 * 详情
                 *! 标签（未实现）
                */
                query = _.or([
                    {
                        visiable: true,
                        isDelete: _.neq( true ),
                        category: categoryFilter,
                        title: new RegExp( search.replace( /\s+/g, '' ), 'i' )
                    }, {
                        visiable: true,
                        isDelete: _.neq( true ),
                        category: categoryFilter,
                        detail: new RegExp( search.replace( /\s+/g, '' ), 'i' )
                    }
                ]);

            }


            // 获取总数
            const total$ = await db.collection('goods')
                .where( query )
                .count( );

            // 获取数据
            const data$ = await db.collection('goods')
                .where( query )
                .limit( limit )
                .skip(( page - 1 ) * limit )
                .orderBy('saled', 'desc')
                .get( );

            // 拼接型号和商品活动
            const activities$ = await Promise.all( data$.data.map( good => {
                return db.collection('activity')
                    .where({
                        pid: good._id,
                        isClosed: false,
                        isDeleted: false,
                        type: 'good_discount',
                        endTime: _.gt( getNow( true ))
                    })
                    .field({
                        pid: true,
                        sid: true,
                        title: true,
                        ac_price: true,
                        endTime: true,
                        ac_groupPrice: true
                    })
                    .get( );
            }));

            const standards$ = await Promise.all( data$.data.map( good => {
                return db.collection('standards')
                    .where({
                        pid: good._id,
                        isDelete: false
                    })
                    .get( );
            }));

            const insertActivities = data$.data.map(( meta, k ) => {
                return Object.assign({ }, meta, {
                    standards: standards$[ k ].data, 
                    activity: activities$[ k ].data.length === 0 ? null : activities$[ k ].data[ 0 ]
                });
            })

            return ctx.body = {
                status: 200,
                data: {
                    page,
                    pageSize: limit,
                    data: insertActivities,
                    total: total$.total,
                    totalPage: Math.ceil( total$.total / limit ),
                    search: !!search ? search.replace( /\s+/g, '' ) : undefined
                }
            };

        } catch ( e ) {
            return ctx.body = { status: 500 };
        }
    });

    /**
     * @description
     * 管理端 上下架商品
     * {
     *    pid,
     *    visiable
     * }
     */
    app.router('set-visiable', async( ctx, next ) => {
        try {
            const { pid, visiable } = event.data;
            await db.collection('goods')
                .doc( pid )
                .update({
                    data: {
                        visiable,
                        updateTime: getNow( true )
                    }
                });

            return ctx.body = { status: 200 };
            
        } catch ( e ) {
            return ctx.body = { status: 500 };
        }
    });

    /**
     * @description
     * 删除商品
     * {
     *    pid 
     * }
     */
    app.router('delete', async( ctx, next ) => {
        try {
            const { pid } = event.data;
            await db.collection('goods')
                .doc( String( pid ))
                .update({
                    data: {
                        isDelete: true
                    }
                });
            return ctx.body = {
                data: pid,
                status: 200
            };

        } catch ( e ) {
            return ctx.body = { status: 500 };
        }
    })

    /**
     * @description
     * 推广积分商品的排行榜
     * {
     *      page
     * }
     */
    app.router('push-integral-rank', async( ctx, next ) => {
        try {

            // 查询条数
            const { page } = event.data;
            const limit = event.data.limit || 20;

            const where$ = {
                isDelete: _.neq( true ),
                category: _.or( _.eq('0'), _.eq('1'))
            };

            const total$ = await db.collection('goods')
                .where( where$ )
                .count( );

            const data$ = await db.collection('goods')
                .where( where$ )
                .limit( limit )
                .skip(( page - 1 ) * limit )
                .orderBy( 'saled', 'desc')
                .orderBy( 'fadePrice', 'desc')
                .get( );

                // 获取型号数据
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

            // 获取活动数据数据
            const activities$ = await Promise.all(
                data$.data.map( good => {
                    return db.collection('activity')
                        .where({
                            pid: good._id,
                            isClosed: false,
                            isDeleted: false,
                            type: 'good_discount',
                            endTime: _.gt( getNow( true ))
                        })
                        .get( )
                })
            );

            const insertActivity = insertStandars.map(( x, k ) => Object.assign({ }, x, {
                activities: activities$[ k ].data
            }));

            return ctx.body = {
                status: 200,
                data: {
                    data: insertActivity,
                    pagenation: {
                        page,
                        pageSize: limit,
                        total: total$.total,
                        totalPage: Math.ceil( total$.total / limit )
                    }
                }
            };

        } catch ( e ) {
            return ctx.body = {
                status: 500
            }
        }
    })

    /**
     * @description
     * 更新当前用户的商品浏览历史
     * 
     * @body {openid}
     * @body {pid} 商品ID
     */
    app.router('update-good-visit-record', async( ctx, next ) => {
        try {
            const { pid } = event.data;
            const openid = event.data.openId || event.data.openid || event.userInfo.openId;

            // 查找旧的记录
            const record$ = await db.collection('good-visiting-record')
                .where({
                    pid,
                    openid
                })
                .get( );
            const record = record$.data[ 0 ];

            // 有则更新
            if ( !!record ) {
                await db.collection('good-visiting-record')
                    .doc( String( record._id ))
                    .update({
                        data: {
                            visitTime: getNow( true )
                        }
                    })
            // 无则插入
            } else {
                await db.collection('good-visiting-record')
                    .add({
                        data: {
                            pid,
                            openid,
                            visitTime: getNow( true )
                        }
                    })
            }
            return ctx.body = {
                status: 200
            }
        } catch( e ) {
            return ctx.body = {
                status: 500
            }
        }
    })

    /** 
     * @description
     * 获取商品浏览记录（用户列表 + 头像）
     * 
     * {start} 时间戳，在此之后的访问记录
     * {before} 时间戳，在此之前的访问记录
     * {pid} 商品id
     * 
     */
    app.router('good-visitors', async( ctx, next ) => {
        try {
            const { pid, before, start } = event.data;
            let search: any = { pid };
            
            if ( !!start && !!before ) {
                search = {
                    ...search,
                    visitTime: _.and( _.gte( start ), _.lt( before ))
                };
            } else if ( !!start && !before ) {
                search = {
                    ...search,
                    visitTime: _.gte( start )
                };
            } else if ( !start && !!before ) {
                search = {
                    ...search,
                    visitTime: _.lt( before )
                };
            }
            
            const visitors$ = await db.collection('good-visiting-record')
                .where( search )
                .get( );
    
            const visitors = visitors$.data;
    
            const users$ = await Promise.all( visitors.map( async visitor => {
                const user$ = await db.collection('user')
                    .where({
                        openid: visitor.openid
                    })
                    .field({
                        openid: true,
                        nickName: true,
                        avatarUrl: true,
                    })
                    .get( );
                const user = user$.data[ 0 ];
                return !!user ? user : null;
            }));
    
            const users = users$.filter( x => !!x );
            return ctx.body = {
                status: 200,
                data: users
            };
        } catch( e ) {
            return ctx.body = {
                status: 500
            };
        }
    });


    return app.serve( );

};