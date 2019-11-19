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
 * 订单1: 所有超过endtime的trip，应该自动设回去isClose
 */
export const almostOver = async ( ) => {
    try {

        const trips$ = await db.collection('trip')
            .where({
                isClosed: false,
                warning: _.neq( true ),
                end_date: _.lte( getNow( true ) - 24 * 60 * 60 * 1000 )
            })
            .get( );

        await Promise.all( trips$.data.map( trip => {
            return db.collection('trip')
                .doc( String( trip._id ))
                .update({
                    data: {
                        warning: true
                    }
                })
        }));


        if ( trips$.data.length > 0 ) {
            // 推送代购通知
            const members = await db.collection('manager-member')
            .where({
                push: true
            })
            .get( );

            await Promise.all(
                members.data.map( async member => {
                    // 4、调用推送
                    const push$ = await cloud.callFunction({
                        name: 'common',
                        data: {
                            $url: 'push-subscribe-cloud',
                            data: {
                                openid: member.openid,
                                type: 'trip',
                                page: `pages/manager-trip-list/index`,
                                texts: [`代购行程将于明天结束`, `请尽快调整售价`]
                            }
                        }
                    });
                })
            );
        }

        

    } catch ( e ) {
        console.log('!!!!almostOver')
        return { status: 500 }
    }
}

/**
 * 订单2: 所有超过endtime的trip，应该自动设回去isClose
 */
export const overtimeTrip = async ( ) => {
    try {
        const trips$ = await db.collection('trip')
            .where({
                isClosed: false,
                end_date: _.lte( getNow( true ))
            })
            .get( );

        await Promise.all( trips$.data.map( trip => {
            return db.collection('trip')
                .doc( String( trip._id ))
                .update({
                    data: {
                        isClosed: true
                    }
                })
        }));

        if ( trips$.data.length > 0 ) {
            // 推送代购通知
            const members = await db.collection('manager-member')
            .where({
                push: true
            })
            .get( );

            await Promise.all(
                members.data.map( async member => {
                    // 4、调用推送
                    const push$ = await cloud.callFunction({
                        name: 'common',
                        data: {
                            $url: 'push-subscribe-cloud',
                            data: {
                                openid: member.openid,
                                type: 'trip',
                                page: `pages/manager-trip-list/index`,
                                texts: [`行程已自动到期`, `请查看尾款情况`]
                            }
                        }
                    });
                })
            );
        }

        

    } catch ( e ) {
        console.log('!!!!overtimeTrip')
        return { status: 500 }
    }
};