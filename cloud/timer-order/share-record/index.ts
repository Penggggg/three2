import * as cloud from 'wx-server-sdk';

cloud.init({
    env: process.env.cloud
});

const db: DB.Database = cloud.database( );
const _ = db.command;

const SHARE_OVERTIME = 7 * 24 * 60 * 60 * 1000;

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

const checkIsInRange = ( now: Date, range = [ 99 ]) => {
    return range.some( x => {
        const h = now.getHours( );
        return x === h && now.getMinutes( ) === 0;
    });
}

/**
 * @description
 * 1: 所有超过7天的无效分享要，自动删除掉
 * 时间：晚上2点
 */
export const clearShareRecord = async ( ) => {
    try {

        if ( !checkIsInRange( getNow( ), [ 2 ])) {
            return { status: 200 };
        }

        const find$ = await db.collection('share-record')
            .where({
                isSuccess: false,
                createTime: _.lte( getNow( true ) - SHARE_OVERTIME )
            })
            .get( );

        await Promise.all(
            find$.data.map( record => {
                return db.collection('share-record')
                    .doc( String( record._id ))
                    .remove( )
            })
        );
        
        return { status: 200 }
    } catch ( e ) {
        console.log('!!!!定时器clearShareRecord错误',)
        return { status: 500 }
    }
};