import * as cloud from 'wx-server-sdk';

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
 * 签到：用户经验领取提醒
 */
export const userGetExp = async ( ) => {
    try {

        const target$ = await db.collection('push-timer')
            .where({
                type: 'user-exp-get',
                pushtime: _.lte( getNow( true ))
            })
            .get( );

        if ( target$.data.length > 0 ) {

            await Promise.all(
                target$.data.map( async target => {
                    // 4、调用推送
                    const push$ = await cloud.callFunction({
                        name: 'common',
                        data: {
                            $url: 'push-subscribe-cloud',
                            data: {
                                openid: target.openid,
                                type: 'hongbao',
                                page: `pages/my/index`,
                                texts: target.texts
                            }
                        }
                    });
                })
            );
        }

        if ( target$.data.length > 0 ) {
            await Promise.all(
                target$.data.map( async target => {
                    const delete$ = await db.collection('push-timer')
                        .doc( String( target._id ))
                        .remove( );
                })
            )
        }

    } catch ( e ) {
        console.log('!!!!userGetExp')
        return { status: 500 }
    }
}