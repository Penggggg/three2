import * as cloud from 'wx-server-sdk';
import * as TcbRouter from 'tcb-router';
import * as axios from 'axios';
import * as crypto from 'crypto';
import * as rp from 'request-promise';
import * as CONFIG from './config';

cloud.init({
    env: process.env.cloud
});

const db: DB.Database = cloud.database( );
const _ = db.command;

/**
 * @description 
 * 公共模块
 */
export const main = async ( event, context ) => {

    const app = new TcbRouter({ event });

    /**
     * @description
     * 初始化各个数据库
     */
    app.router('init', async( ctx, next ) => {
        try {
            const collections = CONFIG.collections;
            await Promise.all([
                collections.map( collectionName => (db as any).createCollection( collectionName ))
            ])

            return ctx.body = { status: 200 }
        } catch ( e ) {
            return ctx.body = { status: 500, message: e }
        }
    })

    /**
     * @description 
     * 数据字典
     * {
     *      dicName: 'xxx,yyy,zzz'
     *      filterBjp: false | true | undefined （ 是否过滤保健品 ）
     * }
     */
    app.router('dic', async( ctx, next ) => {
        try {

            // 保健品配置
            let bjpConfig: any = null;
            const { dicName, filterBjp } = event.data;
            const dbRes = await db.collection('dic')
                .where({
                    belong: db.RegExp({
                        regexp: dicName.replace(/\,/g, '|'),
                        optiond: 'i'
                    })
                })
                .get( );

            // 保健品配置
            if ( !!filterBjp ) {
                const bjpConfig$ = await db.collection('app-config')
                    .where({
                        type: 'app-bjp-visible'
                    })
                    .get( );
                bjpConfig = bjpConfig$.data[ 0 ];
            }
        
            let result = { };
            dbRes.data.map( dic => {
                result = Object.assign({ }, result, {
                    [ dic.belong ]: dic[ dic.belong ]
                        .filter( x => !!x )
                        .filter( x => {
                            if ( !!bjpConfig && !bjpConfig.value ) {
                                return String( x.value ) !== '4'
                            }
                            return true;
                        })
                });
            });

            return ctx.body = {
                status: 200,
                data: result
            };

        } catch ( e ) {
            return ctx.body = {
                status: 500,
                message: e
            };
        }
    });

    /**
     * @description
     * 微信用户信息存储
     */
    app.router('userEdit', async( ctx, next ) => {
        try {

            const openid = event.userInfo.openId;
            const data$ = await db.collection('user')
                .where({
                    openid
                })
                .get( )
                .catch( err => { throw `${err}`});
        
            // 如果不存在，则创建
            if ( data$.data.length === 0 ) {
        
                await db.collection('user')
                    .add({
                        data: Object.assign({ }, event.data, { 
                            openid,
                            integral: 0
                        })
                    }).catch( err => { throw `${err}`});
        
            // 如果存在，则更新
            } else {
                const meta = Object.assign({ }, data$.data[ 0 ], event.data );
                delete meta._id;
                
                await db.collection('user').doc(( data$.data[ 0 ] as any)._id )
                    .set({
                        data: Object.assign({ }, meta, {
                            integral: data$.data[ 0 ].integral
                        })
                    }).catch( err => { throw `${err}`});
            }    

            return ctx.body = {
                status: 200
            };

        } catch ( e ) {
            return ctx.body = {
                status: 500,
                message: e
            };
        }
    });

    /**
     * @description
     * 是新客还是旧客
     * 新客，成功支付订单 <= 3
    */
    app.router('is-new-customer', async( ctx, next ) => {
        try {
            
            const openid = event.data.openId || event.userInfo.openId;
            const find$ = await db.collection('order')
                .where({
                    openid,
                    base_status: '3'
                })
                .count( );
            
            return ctx.body = {
                status: 200,
                data: find$.total < 3
            }

        } catch ( e ) {
            return ctx.body = {
                status: 200,
                data: true
            }
        }
    });

    /** 
     * @description
     * 客户在该躺行程，是否需要付订金
     * {
     *    tid
     * }
     */
    app.router('should-prepay', async( ctx, next ) => {
        try {

            const { tid } = event.data;
            const openid = event.data.openId || event.userInfo.openId;

            const find$ = await db.collection('order')
                .where({
                    openid,
                    base_status: '3'
                })
                .count( );

            const trip$ = await db.collection('trip')
                .doc( String( tid ))
                .get( );
            const trip = trip$.data;

            const isNew = find$.total < 3;

            const judge = ( isNew, trip ) => {
                if ( !trip ) { return true; }
                if ( isNew && trip.payment === '0' ) {
                    return true;

                } else if ( isNew && trip.payment === '1' ) {
                    return true;

                }  else if ( isNew && trip.payment === '2' ) {
                    return false;
                    
                } else if ( !isNew && trip.payment === '0' ) {
                    return false;
                    
                }  else if ( !isNew && trip.payment === '1' ) {
                    return true;
                    
                } else if ( isNew && trip.payment === '2' ) {
                    return false;
                    
                } else {
                    return true;
                }
            }

            return ctx.body = {
                status: 200,
                data: {
                    isNew,
                    shouldPrepay: judge( isNew, trip )
                }
            }

        } catch ( e ) { return ctx.body = { status: 500 };}
    })

    /**
     * 微信支付，返回支付api必要参数
     * ----------- 请求 ----------
     * {
     *      total_fee
     * }
     */
    app.router('wxpay', async( ctx, next ) => {
        try {
            const { key, body, mch_id, attach, notify_url, spbill_create_ip } = CONFIG.wxPay;
            const appid = CONFIG.app.id;
            const total_fee = event.data.total_fee;
            const openid = event.userInfo.openId;
            const nonce_str = Math.random( ).toString( 36 ).substr( 2, 15 );
            const timeStamp = parseInt(String( Date.now() / 1000 )) + '';
            const out_trade_no = "otn" + nonce_str + timeStamp;

            const paysign = ({ ...args }) => {
                const sa: any = [ ]
                for ( let k in args ) {
                    sa.push( k + '=' + args[ k ]);
                }
                sa.push('key=' + key );
                const s =  crypto.createHash('md5').update(sa.join('&'), 'utf8').digest('hex');
                return s.toUpperCase( );
            }
    
            let formData = "<xml>";
    
            formData += "<appid>" + appid + "</appid>"
        
            formData += "<attach>" + attach + "</attach>"
        
            formData += "<body>" + body + "</body>"
        
            formData += "<mch_id>" + mch_id + "</mch_id>"
        
            formData += "<nonce_str>" + nonce_str + "</nonce_str>"
        
            formData += "<notify_url>" + notify_url + "</notify_url>"
        
            formData += "<openid>" + openid + "</openid>"
        
            formData += "<out_trade_no>" + out_trade_no + "</out_trade_no>"
        
            formData += "<spbill_create_ip>" + spbill_create_ip + "</spbill_create_ip>"
        
            formData += "<total_fee>" + total_fee + "</total_fee>"
        
            formData += "<trade_type>JSAPI</trade_type>"
        
            formData += "<sign>" + paysign({ appid, attach, body, mch_id, nonce_str, notify_url, openid, out_trade_no, spbill_create_ip, total_fee, trade_type: 'JSAPI' }) + "</sign>"
        
            formData += "</xml>";
    
            let res = await rp({ url: "https://api.mch.weixin.qq.com/pay/unifiedorder", method: 'POST',body: formData });
    
            let xml = res.toString("utf-8");
          
            if ( xml.indexOf('prepay_id') < 0 ) {
                return ctx.body = {
                    status: 500
                }
            }
            console.log('eeeee', formData, xml );
            let prepay_id = xml.split("<prepay_id>")[1].split("</prepay_id>")[0].split('[')[2].split(']')[0]
    
            let paySign = paysign({ appId: appid, nonceStr: nonce_str, package: ('prepay_id=' + prepay_id), signType: 'MD5', timeStamp: timeStamp })
            
            return ctx.body = {
                status: 200,
                data: { appid, nonce_str, timeStamp, prepay_id, paySign } 
            };

        } catch ( e ) {
            return ctx.body = {
                status: 500
            }
        }
    });

    /**
     * 代购个人微信二维码、群二维码
     * ------ 请求 ------
     * {
     *      wx_qrcode: string[]
     *      group_qrcode: string[]
     * }
     */
    app.router('wxinfo-edit', async( ctx, next ) => {
        try {
            
            const temp: any = [ ];
            Object.keys( event.data ).map( key => {
                if ( !!event.data[ key ]) {
                    temp.push({
                        type: key,
                        value: event.data[ key ]
                    })
                }
            });

            await Promise.all( temp.map( async x => {
                
                const find$ = await db.collection('manager-wx-info')
                    .where({
                        type: x.type
                    })
                    .get( );

                if ( find$.data.length > 0 ) {
                    await db.collection('manager-wx-info').doc( (find$.data[ 0 ] as any)._id )
                        .set({
                            data: x
                        });
                    
                } else {
                    await db.collection('manager-wx-info')
                        .add({
                            data: x
                        });
                }

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
     * 查询代购个人二维码信息
     */
    app.router('wxinfo', async( ctx, next ) => {
        try {

            const target = ['wx_qrcode', 'group_qrcode'];
            const finds$ = await Promise.all( target.map( type => {
                return db.collection('manager-wx-info')
                    .where({
                        type
                    })
                    .get( );
            }));

            const temp = { };
            finds$.map(( find$, index ) => {
                if ( find$.data.length > 0 ) {
                    temp[ target[ index ]] = find$.data[ 0 ].value;
                }
            });

            return ctx.body = {
                status: 200,
                data: temp
            }

        } catch ( e ) {
            return ctx.body = { status: 500 };
        }
    });

    /** 
     * @description
     * 获取“我的页面”的基本信息，诸如订单、卡券数量
     */
    app.router('mypage-info', async( ctx, next ) => {
        try {

            let coupons = 0;
            const trips$ = await cloud.callFunction({
                data: {
                    $url: 'enter'
                },
                name: 'trip'
            });
            const trips = trips$.result.data;
            const trip = trips[ 0 ];
            
            // 订单数
            const orders$ = await db.collection('order')
                .where({
                    openid: event.userInfo.openId,
                    base_status: _.neq('5')
                })
                .count( );

            if ( !!trip ) {
                // 卡券数( 过滤掉只剩当前的trip卡券 )
                const coupons$ = await db.collection('coupon')
                    .where({
                        tid: trip._id,
                        openid: event.userInfo.openId
                    })
                    .count( );
                coupons = coupons$.total;
            }
            
            return ctx.body = {
                status: 200,
                data: {
                    coupons,
                    orders: orders$.total
                }
            }

        } catch ( e ) { return ctx.body = { status: 500 };}
    });

    /** 
     * @description
     * 行程下，参加了购买的客户（订单）
     * { 
     *    tid
     * }
     */
    app.router('customer-in-trip', async( ctx, next ) => {
        try {
            const limit = 100;
            const allOrderUsers$ = await db.collection('order')
                .where({
                    tid: event.data.tid
                })
                .orderBy('createTime', 'desc')
                .limit( limit )
                .field({
                    openid: true
                })
                .get( );

            const openids = Array.from( new Set( allOrderUsers$.data.map( x => x.openid )));

            const avatats$ = await Promise.all( openids.map( oid => {
                return db.collection('user')
                    .where({
                        openid: oid
                    })
                    .field({
                        avatarUrl: true
                    })
                    .get( );
            }))
            
            return ctx.body = {
                status: 200,
                data: avatats$.map( x => x.data[ 0 ].avatarUrl )
            }

        } catch ( e ) {
            return ctx.body = { status: 500 };
        }
    })

    /**
     * 消息推送 - 催款
     * {
     *     touser ( openid )
     *     form_id
     *     page?: string
     *     data: { 
     *         
     *     }
     * }
     */
    app.router('notification-getmoney', async( ctx, next ) => {
        try {
            
            const page = event.data.page || 'pages/order-list/index';
            const { touser, form_id, data, prepay_id } = event.data;

            // 获取token
            const result = await (axios as any)({
                method: 'get',
                url: `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${CONFIG.app.id}&secret=${CONFIG.app.secrect}`
            });
            
            const { access_token, errcode } = result.data;

            if ( errcode ) {
                throw '生成access_token错误'
            }

            const reqData = { };
            const reqData$ = {
                page,
                touser,
                prepay_id,
                form_id,
                template_id: CONFIG.notification_template.getMoney3,
                data: {
                    // 购买时间
                    "keyword1": {
                        "value": data.title
                    },
                    // 订单总价
                    "keyword2": {
                        "value": data.time
                    }
                }
            };

            Object.keys( reqData$ ).map( key => {
                if ( !!reqData$[ key ]) {
                    reqData[ key ] = reqData$[ key ];
                }
            });

            // 发送推送
            const send = await (axios as any)({
                data: reqData,
                method: 'post',
                url: `https://api.weixin.qq.com/cgi-bin/message/wxopen/template/send?access_token=${access_token}`
            });
        
            return ctx.body = {
                data: send.data,
                status: 200
            }

        } catch ( e ) {
            return ctx.body = { message: e, status: 500 }
        }
    });

    /**
     * @description
     * 通过加解密客服给的密码，来增加权限、初始化数据库
     */
    app.router('add-auth-by-psw', async( ctx, next ) => {
        try {

            try {
                await (db as any).createCollection('manager-member');
                await (db as any).createCollection('authpsw');
            } catch ( e ) { }

            let result = '';
            const { salt } = CONFIG.auth;
            const openid = event.userInfo.openId;
            const { psw, content } = event.data;

            const getErr = message => ({
                message,
                status: 500,
            });

            try {
                const decipher = crypto.createDecipher('aes192', salt );
                const decrypted = decipher.update( psw, 'hex', 'utf8' );
                result = decrypted + decipher.final('utf8');
            } catch ( e ) {
                return ctx.body = getErr('密钥错误，请核对');
            }
            
            const [ c_timestamp, c_appid, c_content, c_max ] = result.split('-');

            if ( new Date( ).getTime( ) - Number( c_timestamp ) > 30 * 60 * 1000 ) {
                return ctx.body = getErr('密钥已过期，请联系客服');
            }

            if ( c_appid !== CONFIG.app.id ) {
                return ctx.body = getErr('密钥与小程序不关联');
            }

            if ( c_content.replace(/\s+/g, '') !== content.replace(/\s+/g, '')) {
                return ctx.body = getErr('提示词错误，请联系客服');
            }

            /**
             * authpsw 表
             * 
             * {
             *    appId,
             *    timestamp,
             *    count
             * }
             */
            const check$ = await db.collection('authpsw') 
                .where({
                    appId: c_appid,
                    timestamp: c_timestamp
                })
                .get( );
            const target = check$.data[ 0 ];

            // 密钥已被使用
            if ( !!target ) {
                
                // 次数不能多于2
                if ( target.count >= 2 ) {
                    return ctx.body = getErr('密钥已被使用，请联系客服');

                // 更新密钥信息
                } else {
                    await db.collection('authpsw')
                        .doc( String( target._id ))
                        .update({
                            data: {
                                count: _.inc( 1 )
                            }
                        });
                }
            // 创建密钥信息
            } else {
                await db.collection('authpsw')
                    .add({
                        data: {
                            count: 1,
                            appId: c_appid,
                            timestamp: c_timestamp
                        }
                    })
            }

            // 把当前人，加入到管理员
            const checkManager$ = await db.collection('manager-member')
                .where({
                    openid
                })
                .get( );
            const targetManager = checkManager$.data[ 0 ];

            if ( !targetManager ) {
                await db.collection('manager-member')
                    .add({
                        data: {
                            openid,
                            content: c_content,
                            createTime: new Date( ).getTime( )
                        }
                    })
            }

            // 初始化各个表
            await initDB( );

            return ctx.body = {
                status: 200
            }

        } catch ( e ) {
            return ctx.body = {
                status: 500,
                message: '密钥检查发生错误'
            }
        }
    });

    /**
     * @description
     * 查询应用配置
     */
    app.router('check-app-config', async( ctx, next ) => {
        try {

            let configObj = { };
            const config$ = await db.collection('app-config')
                .where({ })
                .get( );

            const meta = config$.data.map( conf => {
                configObj = Object.assign({ }, configObj, {
                    [ conf.type ]: conf.value
                })
            });

            return ctx.body = {
                data: configObj,
                status: 200
            }

        } catch ( e ) {
            return ctx.body = {
                status: 500
            }
        }
    });

    /**
     * @description
     * 更新应用配置
     * --------------
     * configs: {
     *    [ key: string ]: any 
     * }
     */
    app.router('update-app-config', async( ctx, next ) => {
        try {
            const { configs } = event.data;

            await Promise.all(
                Object.keys( configs )
                    .map( async configKey => {
                        const target$ = await db.collection('app-config')
                            .where({
                                type: configKey
                            })
                            .get( )

                        if ( !target$.data[ 0 ]) { return; }

                        await db.collection('app-config')
                            .doc( String( target$.data[ 0 ]._id ))
                            .update({
                                data: {
                                    value: configs[ configKey ]
                                }
                            })
                    })
            );

            return ctx.body = {
                status: 200
            }
        } catch ( e ) {
            return ctx.body = {
                status: 500
            }
        }
    })

    /** 
     * @description
     * 生成二维码
     * {
     *     page
     *     scene
     * }
     */
    app.router('create-qrcode', async( ctx, next ) => {
        try {
            const { page, scene } = event.data;
            const result = await cloud.openapi.wxacode.getUnlimited({
                page,
                scene: scene || ''
            });

            if ( result.errCode !== 0 ) {
                throw result.errMsg
            }

            return ctx.body = {
                status: 200,
                data: result.buffer
            }
        } catch ( e ) {
            return ctx.body = {
                status: 500,
                message: typeof e === 'string' ? e : JSON.stringify( e )
            }
        }
    });

    /** 
     * @description
     * 创建一个form-id
     * {
     *     formid
     * }
     * form-ids: {
     *      openid,
     *      formid,
     *      createTime,
     *      type: 'manager' | 'normal'
     * }
     */
    app.router('create-formid', async( ctx, next ) => {
        try {
            const openid = event.userInfo.openId;
            const { formid } = event.data; 
            const find$ = await db.collection('manager-member')
                .where({
                    openid,
                    createTime: new Date( ).getTime( )
                })
                .count( );
            
            const create$ = await db.collection('form-ids')
                .add({
                    data: {
                        openid,
                        formid,
                        type: find$.total > 0 ? 'manager' : 'normal'
                    }
                });
            ctx.body = {
                status: 200
            }
        } catch ( e ) {
            ctx.body = {
                status: 200
            }
        }
    });

    return app.serve( );

}

const time = ts => new Promise( resovle => {
    setTimeout(( ) => resovle( ), ts );
})

/**
 * 初始化数据库、基础数据
 */
const initDB = ( ) => new Promise( async resolve => {
    try {

        /** 初始化表 */
        try {
            const collections = CONFIG.collections;
            await Promise.all(
                collections.map( collectionName => (db as any).createCollection( collectionName ))
            );
        } catch ( e ) { }

        await time( 800 );

        /** 初始化数据字典 */
        try {
            const dics = CONFIG.dic;
            await Promise.all(
                dics.map( async dicSet => {

                    const targetDic$ = await db.collection('dic')
                        .where({
                            belong: dicSet.belong
                        })
                        .get( );

                    const targetDic = targetDic$.data[ 0 ];
                    if ( !!targetDic ) {
                        await db.collection('dic')
                            .doc( String( targetDic._id ))
                            .set({
                                data: dicSet
                            });

                    } else {
                        await db.collection('dic')
                            .add({
                                data: dicSet
                            });
                    }
                })
            );
        } catch ( e ) {
            console.log('eee', e );
        }

        /** 初始化应用配置 */
        try {
            const appConf = CONFIG.appConfs;
            await Promise.all(
                appConf.map( async conf => {
                    const targetConf$ = await db.collection('app-config')
                        .where({
                            type: conf.type
                        })
                        .get( );

                    const targetConf = targetConf$.data[ 0 ];
                    if ( !!targetConf ) {
                        // 由于配置已经生效且投入使用，这里不能直接更改已有的线上配置
                        // await db.collection('app-config')
                        //     .doc( String( targetConf._id ))
                        //     .set({
                        //         data: conf
                        //     });

                    } else {
                        await db.collection('app-config')
                            .add({
                                data: conf
                            });
                    }
                })
            );
        } catch ( e ) {
            console.log('eee', e );
        }

        resolve( );

    } catch ( e ) { resolve( );}
});