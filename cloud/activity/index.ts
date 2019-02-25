import * as cloud from 'wx-server-sdk';
import * as TcbRouter from 'tcb-router';

cloud.init( );

const db: DB.Database = cloud.database( );
const _ = db.command;

/**
 *
 * @description 商品活动模块
 * -------- 字段 ----------
 * type 类型 'good_discount'
 * pid
 * sid
 * stock
 * endTime
 * ac_price
 * ac_groupPrice
 * isClosed
 */
export const main = async ( event, context ) => {

    const app = new TcbRouter({ event });

    /**
     * @description
     * 创建
     * list: {
        * ac_groupPrice
        * ac_price
        * endTime
        * pid
        * sid
        * stock
        * title
     * }[ ]
     */
    app.router('create-good-discount', async( ctx, next ) => {
        try {
            
            const { list } = event.data;
            const dataMeta: any[ ] = list.map( x => Object.assign({ }, x, {
                isClosed: false,
                type: 'good_discount'
            }));

            // 错误定义
            const hasErr = message => ctx.body = {
                message,
                status: 500
            };

            // 去重
            const checks$: any = await Promise.all( dataMeta.map( meta => {
                const { pid, sid } = meta;
                return db.collection('activity')
                    .where({
                        pid,
                        sid,
                        isClosed: false
                    })
                    .count( )
            }));

            // 去重错误
            const errorList: string[] = [ ];
            const hasError = checks$.some(( x, k ) => {
                if (  x.total > 0 ) {
                    errorList.push( dataMeta[ k ].title );
                    return true;
                } 
                return false;
            });

            if ( hasError ) {
                return hasErr(`${errorList.join('、')} 特价已存在`);
            }

            // 新建
            const create$ = await Promise.all( dataMeta.map( meta => {
                return db.collection('activity')
                    .add({
                        data: meta
                    })
            }));

            return ctx.body = { 
                status: 200
            }
        } catch ( e ) {
            return ctx.body = { status: 500 };
        }
    });

    /**
     * @description
     * 检查是否有重复
     * list: {
        * pid
        * sid,
        * title
     * }[ ]
     */
    app.router('check-good-discount', async( ctx, next ) => {
        try {
            
            const { list } = event.data;

            // 错误定义
            const hasErr = message => ctx.body = {
                message,
                status: 500
            };

            // 去重
            const checks$: any = await Promise.all( list.map( meta => {
                const { pid, sid } = meta;
                return db.collection('activity')
                    .where({
                        pid,
                        sid,
                        isClosed: false
                    })
                    .count( )
            }));

            // 去重错误
            const errorList: string[] = [ ];
            const hasError = checks$.some(( x, k ) => {
                if (  x.total > 0 ) {
                    errorList.push( list[ k ].title );
                    return true;
                } 
                return false;
            });

            if ( hasError ) {
                return hasErr(`${errorList.join('、')}特价已存在`);
            }

            return ctx.body = { 
                status: 200
            }
        } catch ( e ) {
            return ctx.body = { status: 500 };
        }
    });

    return app.serve( );
}