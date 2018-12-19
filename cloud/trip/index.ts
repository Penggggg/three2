import * as cloud from 'wx-server-sdk';
import * as TcbRouter from 'tcb-router';

cloud.init( );

const db: DB.Database = cloud.database( );
const _ = db.command;

/**
 *
 * @description 行程模块
 * -------- 字段 ----------
        title 标题 string
        destination 目的地 string
        start_date 开始时间 number
        end_date 结束时间 number
        reduce_price 行程立减 number
        sales_volume 销售总额
        fullreduce_atleast 行程满减 - 门槛 number
        fullreduce_values 行程满减 - 减多少 number
        cashcoupon_atleast 行程代金券 - 门槛 number
        cashcoupon_values 行程代金券 - 金额 number
        postage 邮费类型 dic 
        postagefree_atleast  免邮门槛 number
        payment 付款类型 dic 
        published 是否发布 boolean
        isPassed 是否过期
        createTime 创建时间
        updateTime 更新时间
        isClosed: 是否已经手动关闭
 */
export const main = async ( event, context ) => {

    const app = new TcbRouter({ event });

    app.router('enter', async( ctx, next ) => {
        try {

            // 按开始日期正序，获取最多2条已发布，未结束的行程
            const data$ = await db.collection('trip')
                .where({
                    isClosed: false,
                    published: true,
                    end_date: _.gt( new Date( ).getTime( ))
                })
                .limit( 2 )
                .orderBy('start_date', 'asc')
                .get( );

            let trips = data$.data;

            // 拉取最新行程的推荐商品
            if ( !!trips[ 0 ]) {
                const tripOneProducts$ = await Promise.all( trips[ 0 ].selectedProductIds.map( pid => {
                    return cloud.callFunction({
                        data: {
                            _id: pid
                        },
                        name: 'api-goods-detail'
                    }).then( res => res.result.data );
                }));
                trips[ 0 ] = Object.assign({ }, trips[ 0 ], {
                    products: tripOneProducts$
                });

            }

            return ctx.body = {
                status: 200,
                data: trips
            };

        } catch ( e ) {
            return ctx.body = {
                status: 500,
                message: e
            };
        }
    });

    app.router('list', async( ctx, next ) => {
        try {

            // 查询条数
            const limit = 20;
            const search$ = event.data.search || '';
            const search = new RegExp( search$.replace(/\s+/g, ""), 'i');

            // 获取总数
            const total$ = await db.collection('trip')
                .where({
                    title: search
                })
                .count( );

            // 获取数据
            const data$ = await db.collection('trip')
                .where({
                    title: search
                })
                .limit( limit )
                .skip(( event.data.page - 1 ) * limit )
                .orderBy('updateTime', 'desc')
                .get( );
            
            return ctx.body = {
                status: 200,
                data: {
                    search: event.data.title.replace(/\s+/g),
                    pageSize: limit,
                    page: event.data.page,
                    data: data$.data,
                    total: total$.total,
                    totalPage: Math.ceil( total$.total / limit )
                }
            };

        } catch ( e ) {
            return ctx.body = {
                status: 500,
                message: e
            };
        } 
    });
    
    app.router('detail', async( ctx, next ) => {
        try {

            // 获取基本详情
            const data$ = await db.collection('trip')
                    .where({
                        _id: event.data._id
                    })
                    .get( );
            const meta = data$.data[ 0 ];

            // 通过已选的商品ids,拿到对应的图片、title、_id
            const products$: any = await Promise.all( meta.selectedProductIds.map( pid => {
                return db.collection('goods')
                        .where({
                            _id: pid
                        })
                        .field({
                            img: true,
                            title: true
                        })
                        .get( );
            }));

            meta.selectedProducts = products$.map( x => {
                return x.data[ 0 ];
            });

            return ctx.body = {
                status: 200,
                data: data$.data[ 0 ]
            };

        } catch( e ) {
            return ctx.body = {
                status: 500,
                message: e
            };
        }
    });

    app.router('edit', async( ctx, next ) => {
        try {

            let _id = event.data._id;

            // 校验1：如果是想要发布当前行程，则检查是否有“已发布行程的结束时间大于等于当前新建行程的开始时间要”
            if ( event.data.published && !_id ) {
                const rule1$ = await db.collection('trip').where({
                    end_date: _.gte( event.data.start_date )
                })
                .count( );
        
                if ( rule1$.total > 0 ) {
                    return new Promise( resolve => {
                        resolve({
                            data: null,
                            status: 500,
                            message: '开始时间必须大于上趟行程的结束时间'
                        })
                    });
                }
            } 
    
            // 创建 
            if ( !_id ) {
    
                const create$ = await db.collection('trip').add({
                    data: event.data
                });
                _id = create$._id;
    
            // 编辑
            } else {
    
                const origin$ = await db.collection('trip')
                                    .where({
                                        _id
                                    })
                                    .get( );
                
                const origin = origin$.data[ 0 ];
    
                delete origin['_id'];
                delete event.data['_id']
    
                const temp = Object.assign({ }, origin, {
                    ...event.data
                })
    
                await db.collection('trip')
                        .doc( _id )
                        .set({
                            data: temp
                        });
    
            }

            return ctx.body = {
                data: _id,
                status: 200
            };
             
        } catch( e ) {
            return ctx.body = {
                status: 500,
                message: e
            };
        }
    });

    return app.serve( );

}