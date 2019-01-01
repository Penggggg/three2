import * as cloud from 'wx-server-sdk';
import { overtime, payedFix } from './order';

cloud.init( );

const db: DB.Database = cloud.database( );
const _ = db.command;

/** 
 * 定时器模块
 * 1、订单1：所有应该支付，但是支付超时（30分钟）的订单，释放原来的库存，订单重置为已过时
 * 2、订单2：所有成功支付的订单，检查有没有 type 还是 pre的，有的话需要转成normal类型订单，删除对应的购物车（有的话）
 * 3、清单1：查询未被安排进清单的订单
 */
export const main = async ( event, context ) => {
    try {
        
        await overtime( );
        await payedFix( );
        
        return {
            status: 200
        }
    } catch ( e ) {
        return {
            status: 500
        }
    }
}