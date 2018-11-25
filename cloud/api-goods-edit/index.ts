// 云函数入口文件
import * as cloud from 'wx-server-sdk';

cloud.init();

const db: DB.Database = cloud.database();

/**
 * @description 创建/编辑商品
 * -------- 请求 ----------
 * {
 *      _id: id
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
 *      standards!: 型号规格 Array<{ 
 *          name: String,
 *          price: Number,
 *          groupPrice!: Number,
 *          stock!: Number:
 *          img: String 
 *      }>
 * }
 * -------- 请求 ----------
 * {
 *      status: 200 / 500
 * }
 */
export const main = async ( event, context) => {

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
                            pid: _id
                        })
                    });
                }))
            }
        } else {

            // 更新
            const meta = Object.assign({ }, event.data );
            delete meta[ _id ];
            const { title, category, depositPrice, detail, fadePrice, img, limit, saled, 
                standards, tag, updateTime, visiable, price, groupPrice, stock } = meta;
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

            // 型号：先删除所有所属型号，然后重新新增本次型号
            await db.collection('standards')
                    .where({
                        pid: _id
                    })
                    .remove( );

            await Promise.all( standards.map( x => {
                delete x['_id'];
                return db.collection('standards')
                        .add({
                            data: Object.assign({ }, x, {
                                pid: _id
                            })
                        });
            }));

        }

        return new Promise( resolve => {
            resolve({
                data: _id,
                status: 200
            })
        })

    } catch ( e ) {
        return new Promise(( resolve, reject ) => {
            reject({
                status: 500,
                message: e
            })
        })
    }

}