import * as cloud from 'wx-server-sdk';
import * as TcbRouter from 'tcb-router';
import { find$ } from './find';

cloud.init( );

const db: DB.Database = cloud.database( );
const _ = db.command;

/**
 * @description 行程清单模块
 * --------- 字段 ----------
 * tid
 * pid
 * ! sid ( 可为空 )
 * oids Array
 * status 0,1,2,3 未购买、已购买、买不全、买不到
 * img: Array
 * ! desc ( 可为空 )
 * createTime
 */
export const main = async ( event, context ) => {

    const app = new TcbRouter({ event });

    /**
     * @description
     * 判断请求的sid + tid + pid数组，返回不能进行购买的数组
     * -------- 请求 ----------
     * {
     *    list: { 
     *       tid, 
     *       pid,
     *       sid
     *    }[ ]
     * }
     */
    app.router('findCannotBuy', async( ctx, next ) => {
        try {

            const finding$: any = await Promise.all( event.data.list.map( i => {
                return find$({
                    tid: i.tid,
                    pid: i.pid,
                    sid: i.sid,
                    status: _.or( _.eq('2'), _.eq('3'))
                }, db, ctx );
            }));

            if ( finding$.some( x => x.status !== 200 )) {
                throw '查询购物清单错误';
            }

            return ctx.body = {
                data: finding$.map( x => x.data[ 0 ]).filter( y => !!y ),
                status: 200
            }

        } catch ( e ) {
     
            return ctx.body = {
                status: 500,
                message: e
            };
        }
    })

    return app.serve( );

}