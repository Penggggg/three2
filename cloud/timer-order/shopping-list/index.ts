import * as cloud from 'wx-server-sdk';

cloud.init( );

const db: DB.Database = cloud.database( );
const _ = db.command;

/**
 * 清单1：查询未被安排进清单的订单（pay_status: 1 的order）
 */
export const catchLostOrders = async ( ) => {
    try {

        /**
         * 未被安排的订单
         */
        const lostOrders: {
            tid,
            pid,
            sid,
            oid
        }[ ] = [ ];

        // 获取当前进行中的行程
        const trips$ = await cloud.callFunction({
            name: 'trip',
            data: {
                $url: 'enter'
            }
        });

        const currentTrip = trips$.result.data[ 0 ];
        
        if ( !currentTrip ) { 
            return {
                status: 200
            }
        }

        const tid = currentTrip._id;

        // 拿到所有该行程下的已付订金订单
        const find1$ = await db.collection('order')
            .where({
                tid,
                pay_status: '1'
            })
            .get( );

        if ( find1$.data.length === 0 ) { 
            return {
                status: 200
            }
        }

        // 拿到该行程下的购物清单
        const find2$ = await db.collection('shopping-list')
            .where({
                tid
            })
            .get( );

        const tripShoppingList = find2$.data; 
        
        /**
         * 跟清单进行匹配
         * 1. 该订单的商品/型号还没有任何清单
         * 2. 该订单没有在已有同款商品/型号的清单里面
         */

        find1$.data.map( order => {

            const { sid, pid, _id, acid } = order;
            const currentGoodShoppingList = tripShoppingList.find( x => x.sid === sid && x.pid === pid );

            // 如果没有购物清单，则创建
            if ( !currentGoodShoppingList ) {
                lostOrders.push({
                    tid,
                    sid,
                    pid,
                    oid: _id
                })
            
            // 如果有购物清单、但是清单里面的oids没有它，就插入并更新
            } else {
                const { oids } = currentGoodShoppingList;
                if ( !oids.find( x => x === _id )) {
                    lostOrders.push({
                        tid,
                        sid,
                        pid,
                        oid: _id
                    })
                }
            }

        });

        if ( lostOrders.length === 0 ) {
            return {
                status: 200
            }
        }

        await cloud.callFunction({
            name: 'shopping-list',
            data: {
                $url: 'create',
                data: {
                    list: lostOrders
                }
            }
        });
        
        return {
            status: 200,
            data: lostOrders
        }

    } catch ( e ) {
        console.log('!!!!定时器订单catchLostOrders错误',)
        return { status: 500 };
    }
}