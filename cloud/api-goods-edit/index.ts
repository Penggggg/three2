// 云函数入口文件
import * as cloud from 'wx-server-sdk';

cloud.init();

const db: DB.Database = cloud.database();

/**
 * @description 创建/编辑商品
 * -------- 请求 ----------
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
 *      standards!: 型号规格 Array<{ 
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
 * -------- 请求 ----------
 * {
 *      _id: string
 *      status: 200 / 500
 * }
 * ! 更新的时候，先判断型号有没有被引用
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