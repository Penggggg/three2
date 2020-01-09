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
 * 运营数据分享：上一个运营活动的数据
 * 时间：早上9点
 */
export const lastDayData = async ( ) => {
    try {

        if ( !checkIsInRange( getNow( ), [ 9 ])) {
            return { status: 200 };
        }

        // 找到昨晚下午6点后的时间戳
        const nowTime = getNow( );
        const y = nowTime.getFullYear( );
        const m = nowTime.getMonth( ) + 1;
        const d = nowTime.getDate( );
        const lastNightTime = new Date(`${y}/${m}/${d} 00:00:00`);
        const time = lastNightTime.getTime( ) - 6 * 60 * 60 * 1000;

        // 把这个时间点以后的查看商品记录都拿出来
        const visitorRecords$ = await db.collection('good-visiting-record')
            .where({
                visitTime: _.gte( time )
            })
            .field({
                pid: true,
                openid: true
            })
            .get( );
        const visitorRecords = visitorRecords$.data;

        // 拿到浏览记录最高的商品
        let maxPid = '';
        let maxNum = 0;

        let pidArr: string[ ] = [ ];
        let openidArr: string[ ] = [ ];

        visitorRecords.reduce(( res, record ) => {

            pidArr.push( record.pid );
            openidArr.push( record.openid );

            res[ record.pid ] = !res[ record.pid ] ? 1 : res[ record.pid ] + 1;
            if ( res[ record.pid ] > maxNum ) {
                maxPid = record.pid;
                maxNum = res[ record.pid ];
            }
            return res;
        }, { });

        /** 被流量量 */
        const totalPids = Array.from(
            new Set( pidArr )
        ).length;

        /** 用户访问量 */
        const totalOpenids = Array.from(
            new Set( openidArr )
        ).length;

        // 若有，获取这个商品的总拼团人数
        if ( !maxNum || !maxPid ) {
            return  { status: 200 }
        };

        // 逻辑：通过order的createtime找到tid， 通过 tid+ pid 找到shoppinglist
        const order$ = await db.collection('order')
            .where({
                createTime: _.gte( time )
            })
            .field({
                tid: true
            })
            .limit( 1 )
            .get( );
        const order = order$.data[ 0 ];

        // 获取所有管理员
        const adms$ = await db.collection('manager-member')
            .where({ })
            .get( );

        // 如果没有订单，则发送的部分数据
        if ( order$.data.length === 0 ) {
            // 推送
            await Promise.all(
                adms$.data.map( async adm => {
                    await cloud.callFunction({
                        name: 'common',
                        data: {
                            $url: 'push-subscribe',
                            data: {
                                openid: adm.openid,
                                type: 'waitPin',
                                page: `pages/ground-pin/index`,
                                texts: [`昨天${totalPids}款商品被${totalOpenids}人围观了${ totalPids * totalOpenids * 2 }次`, `暂无订单，请尽快发起群拼团～`]
                            }
                        }
                    });
                    return 
                })
            );

            return {
                status: 200
            }
        }

        const sl$ = await db.collection('shopping-list')
            .where({
                pid: maxPid,
                tid: order.tid
            })
            .field({
                uids: true
            })
            .get( );
        const sl = sl$.data[ 0 ];

        if ( sl$.data.length === 0 ) {
            return  { status: 200 }
        }

        // 获取商品详情
        const good$ = await db.collection('goods')
            .doc( String( maxPid ))
            .field({
                title: true
            })
            .get( );

        // 推送
        await Promise.all(
            adms$.data.map( async adm => {
                await cloud.callFunction({
                    name: 'common',
                    data: {
                        $url: 'push-subscribe',
                        data: {
                            openid: adm.openid,
                            type: 'waitPin',
                            page: `pages/manager-trip-order/index?id=${order.tid}`,
                            texts: [`昨天有${maxNum}人浏览，${sl.uids.length}人成功${sl.uids.length > 1 ? '拼团！' : '下单！'}`, `${good$.data.title}`]
                        }
                    }
                });
                return 
            })
        );

        return {
            status: 200
        }

    } catch ( e ) {
        console.log('!!!!!!lastDayData')
        return { status: 500 };
    }
};