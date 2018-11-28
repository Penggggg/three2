// 云函数入口文件
import * as cloud from 'wx-server-sdk';

cloud.init();

const db: DB.Database = cloud.database();


/**
 * 购物车批量删除sku
 * req: {
 *      ids: 'id1,id2,id3'
 * }
 * 
 * res: {
 *      data: 购物车id
 * }
 */
export const main = async (event, context) => {

    try {

        const idArr = event.ids.split(',')
        await Promise.all( idArr.map( id => {
            return db.collection('cart')
                    .where({
                        _id: id
                    })
                    .remove( );
        }));
        
        return new Promise( resolve => {
            resolve({
                status: 200
            });
        });
    } catch( e ) {
        return new Promise( resolve => {
            resolve({
                status: 500,
                data: JSON.stringify( e )
            });
        });
    }

}