import * as cloud from 'wx-server-sdk';

cloud.init({
    env: process.env.cloud
});

const db: DB.Database = cloud.database( );
const _ = db.command;

/** 转换格林尼治时区 +8时区 */
const getNow = ( ) => {
    return new Date( Date.now( ) + 8 * 60 * 60 * 1000 )
}

/**
 * 订单1: 所有超过endtime的trip，应该自动设回去isClose
 */
export const overtimeTrip = async ( ) => {
    try {
        const trips$ = await db.collection('trip')
            .where({
                isClosed: false,
                end_date: _.lte( getNow( ).getTime( ))
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

    } catch ( e ) {
        console.log('!!!!overtimeTrip')
        return { status: 500 }
    }
};