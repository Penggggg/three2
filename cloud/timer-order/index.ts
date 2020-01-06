import * as cloud from 'wx-server-sdk';
import { overtimeTrip, almostOver, autoTrip } from './trip';
import { catchLostOrders, removeUselessOrders } from './shopping-list';
import { overtime, payedFix, priceFix, payLastFix, pushNew, pushLastPay } from './order';
import { clearShareRecord } from './share-record';
import { userGetExp } from './push-timer';
import { lastDayData } from './analyze';

// cloud.init({
//     env: process.env.cloud
// });

const db: DB.Database = cloud.database( );
const _ = db.command;

/** 
 * 定时器模块
 */
export const main = async ( event, context ) => {
    try {
        
        await autoTrip( );
        await userGetExp( );
        await pushNew( );
        await pushLastPay( );
        await overtime( );
        await payedFix( );
        await priceFix( );
        await payLastFix( );
        await overtimeTrip( );
        await almostOver( );
        await catchLostOrders( );
        await removeUselessOrders( );
        await clearShareRecord( );
        await lastDayData( );
        
        return {
            status: 200
        }
    } catch ( e ) {
        return {
            status: 500
        }
    }
}