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

const checkIsInRange = ( now: Date, range = [ 99 ]) => {
    return range.some( x => {
        const h = now.getHours( );
        return x === h && now.getMinutes( ) === 0;
    });
}

/**
 * 行程1: 即将过期的行程，提醒代购
 * 时间：中午12点才发送
 */
export const almostOver = async ( ) => {
    try {

        if ( !checkIsInRange( getNow( ), [ 12 ])) {
            return { status: 200 } 
        }

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
                                type: 'waitPin',
                                page: `pages/manager-trip-list/index`,
                                texts: [`代购行程即将结束`, `请尽快调整群拼团售价`]
                            }
                        }
                    });
                })
            );
        }

        return { status: 200 }

    } catch ( e ) {
        console.log('!!!!almostOver')
        return { status: 500 }
    }
}

/**
 * 行程2: 所有超过endtime的trip，应该自动设回去isClose
 */
export const overtimeTrip = async ( ) => {
    try {

        // 创建的日期，都是晚上23点截止的
        if ( !checkIsInRange( getNow( ), [ 22, 23, 0 ])) {
            return { status: 200 } 
        }

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
            const members$ = await db.collection('manager-member')
                .where({
                    push: true
                })
                .get( );

            await Promise.all(
                members$.data.map( async member => {
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

            await Promise.all(
                trips$.data.map( async trip => {
                    await cloud.callFunction({
                        name: 'trip',
                        data: {
                            $url: 'close-trip-analyze',
                            data: {
                                tid: trip._id
                            }
                        }
                    });
                })
            )
        }

        return { status: 200 }

    } catch ( e ) {
        console.log('!!!!overtimeTrip')
        return { status: 500 }
    }
};

/**
 * 行程3：自动创建 sys类型的 行程
 */
export const autoTrip = async ( ) => {
    try {
        
        const runningTrip$ = await db.collection('trip')
            .where({
                isClosed: false,
                published: true,
            })
            .count( );
           
        // 防止重复、不需要 sysTrip
        if ( runningTrip$.total > 0 ) { 
            return { status: 200 }
        }

        // 计算本周日，晚上23点
        const now = getNow( );
        const day = now.getDay( );
        const oneDay = 24 * 60 * 60 * 1000;
        const Sunday = new Date( getNow( true ) + ( 7 - day) * oneDay );
        const y = Sunday.getFullYear( );
        const m = Sunday.getMonth( ) + 1;
        const d = Sunday.getDate( );
        const end_date = new Date(`${y}/${m}/${d} 23:00:00`).getTime( )

        // 自动创建
        await db.collection('trip')
            .add({
                data: {
                    type: 'sys',
                    payment: '1',
                    warning: true,
                    published: true,
                    isClosed: false,
                    reduce_price: 1,
                    callMoneyTimes: 0,
                    title: '群拼团',
                    selectedProductIds: [ ],
                    createTime: getNow( true ),
                    updateTime: getNow( true ),
                    start_date: getNow( true ),
                    // 本周日晚上23点
                    end_date
                }
            });

        // 推送代购通知
        const members = await db.collection('manager-member')
            .where({
                push: true
            })
            .get( );

        await Promise.all(
            members.data.map( async member => {
                // 调用推送
                const push$ = await cloud.callFunction({
                    name: 'common',
                    data: {
                        $url: 'push-subscribe-cloud',
                        data: {
                            openid: member.openid,
                            type: 'trip',
                            page: `pages/manager-trip-list/index?s=1`,
                            texts: [`自动创建代购行程～`, `可使用群拼团啦！～`]
                        }
                    }
                });
            })
        );
        
        return {
            status: 200
        }

    } catch ( e ) {
        console.log('!!!!autoTrip')
        return { status: 500 }
    }
}