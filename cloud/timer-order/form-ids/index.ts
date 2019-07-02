import * as cloud from 'wx-server-sdk';

cloud.init({
    env: process.env.cloud
});

const db: DB.Database = cloud.database( );
const _ = db.command;

const FORM_ID_OVERTIME = 7 * 24 * 60 * 60 * 1000;

/** 转换格林尼治时区 +8时区 */
const getNow = ( ) => {
    return new Date( Date.now( ) + 8 * 60 * 60 * 1000 )
}

/**
 * @description
 * form-ids1: 所有超过7天的formid是无效的，自动删除掉
 */
export const clearFormIds = async ( ) => {
    try {

        const find$ = await db.collection('form-ids')
            .where({
                creatTime: _.lte( getNow( ).getTime( ) - FORM_ID_OVERTIME )
            })
            .get( );

        await Promise.all(
            find$.data.map( x => 
                db.collection('form-ids')
                    .doc( String( x._id ))
                    .remove( )
            )
        );
        return { status: 200 }
    } catch ( e ) {
        console.log('!!!!定时器clearFormIds错误',)
        return { status: 500 }
    }
};