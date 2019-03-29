import * as cloud from 'wx-server-sdk';
import * as TcbRouter from 'tcb-router';

cloud.init( );

const db: DB.Database = cloud.database( );
const _ = db.command;

/**
 * 
 * @description 创建/编辑商品
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
                    type: 'good_discount'
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

            // 查询条数
            const limit = event.data.limit || 20;
            const { category, sort } = event.data;
            const search$ = event.data.search || '';
            const search = new RegExp( search$.replace(/\s+/g, ""), 'i');

            // 获取总数
            const total$ = await db.collection('goods')
                .where({
                    category,
                    title: search
                })
                .count( );

            // 获取商品数据
            const data$ = await db.collection('goods')
                .where({
                    category,
                    title: search
                })
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
                            endTime: _.gt( new Date( ).getTime( ))
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
            if ( !_id ) {
                // 创建
                const { standards } = event.data;
    
                delete event.data['standards'];
    
                const create$ = await db.collection('goods').add({
                    data: event.data,
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
                const meta = Object.assign({ }, event.data );
                delete meta[ _id ];
                const { title, category, depositPrice, detail, fadePrice, img, limit, 
                    standards, tag, updateTime, visiable, price, groupPrice, stock, saled } = meta;
                await db.collection('goods').doc( _id ).update({
                    data: { 
                        tag,
                        img,
                        stock,
                        price,
                        limit,
                        title,
                        detail,
                        saled,
                        groupPrice,
                        category,
                        fadePrice,
                        visiable,
                        updateTime,
                        depositPrice
                    }
                });
    
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
                        data: Object.assign({ }, x, {
                            pid: _id,
                            isDelete: false
                        })
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
            const { search, page, category } = event.data;

            let query: any = null;

            if ( !!search ) {

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
                        title: new RegExp( search.replace( /\s+/g, '' ), 'i' )
                    }, {
                        visiable: true,
                        isDelete: _.neq( true ),
                        detail: new RegExp( search.replace( /\s+/g, '' ), 'i' )
                    }
                ]);

            }

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

            // 拼接型号或商品活动
            const activities$ = await Promise.all( data$.data.map( good => {
                return db.collection('activity')
                    .where({
                        pid: good._id,
                        isClosed: false,
                        isDeleted: false,
                        type: 'good_discount'
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

            const insertActivities = data$.data.map(( meta, k ) => {
                return Object.assign({ }, meta, {
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
                        updateTime: new Date( ).getTime( )
                    }
                });

            return ctx.body = { status: 200 };
            
        } catch ( e ) {
            return ctx.body = { status: 500 };
        }
    })

    return app.serve( );

};