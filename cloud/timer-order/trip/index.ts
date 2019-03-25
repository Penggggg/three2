import * as cloud from 'wx-server-sdk';

cloud.init( );

const db: DB.Database = cloud.database( );
const _ = db.command;

/**
 * 订单1: 所有超过endtime的trip，应该自动设回去isClose
 */
export const overtimeTrip = async ( ) => {
    try {
        const trips$ = await db.collection('trip')
            .where({
                isClosed: false,
                end_date: _.lte( new Date( ).getTime( ))
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