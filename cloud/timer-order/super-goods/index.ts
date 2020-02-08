import * as cloud from 'wx-server-sdk';
import { subscribePush } from '../subscribe-push';

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
 * 1: 
 * 凌晨3点，清空昨日的主推商品
 */
export const cleanPushing = async ( ) => {
    try {

        if ( !checkIsInRange( getNow( ), [ 2 ])) {
            return { status: 200 } 
        }

        const pushing$ = await db.collection('super-goods')
            .where({
                push: true
            })
            .get( );
        const pushing = pushing$.data;

        await Promise.all(
            pushing.map( pushingGood => {
                return db.collection('super-goods')
                    .doc( String( pushingGood._id ))
                    .update({
                        data: {
                            push: false
                        }
                    })
            })
        )

        return { status: 200 }

    } catch ( e ) {
        console.log('!!!!cleanPushing')
        return { status: 500 }
    }
}
