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
            const openid = event.userInfo.openId;
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
                    openid,
                    base_status: _.neq('5')
                })
                .count( );


            // 卡券数( 过滤掉只剩当前的trip卡券 )
            let coupons$: any = {
                total: 0
            };
            
            if ( !!trip ) {
                coupons$ = await db.collection('coupon')
                    .where({
                        openid,
                        tid: trip._id,
                        type: _.neq('t_daijin'),
                    })
                    .count( );
            }

            const coupons2$ = await db.collection('coupon')
                .where({
                    openid,
                    isUsed: false,
                    type: 't_daijin',
                })
                .count( );

            coupons = coupons$.total + coupons2$.total;
            
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
     *     form_id （ 或者是 prepay_id ）
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

            if ( getNow( true ) - Number( c_timestamp ) > 30 * 60 * 1000 ) {
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
                            createTime: getNow( true )
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
                    openid
                })
                .count( );
            
            const create$ = await db.collection('form-ids')
                .add({
                    data: {
                        openid,
                        formid,
                        createTime: getNow( true ),
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

    /**
     * @description
     * 模板推送服务，消费form-ids
     * {
     *      openid
     *      type: 'buyPin' | 'buy' | 'getMoney' | 'waitPin' | 'newOrder'
     *      texts: [ 'xx', 'yy' ]
     *      ?page
     *      ?prepay_id
     * }
     */
    app.router('push-template', async( ctx, next ) => {
        try {

            let formid_id: any = '';
            let formid = event.data.prepay_id;
            const { type, texts } = event.data;
            const openid = event.data.openId || event.data.openid || event.userInfo.openId;
            const page = event.data.page || 'pages/order-list/index';

            // 如果没有prepay_id, 就去拿该用户的form_id
            if ( !formid ) {
                const find$ = await db.collection('form-ids')
                    .where({
                        openid
                    })
                    .limit( 1 )
                    .get( );

                if ( !find$.data[ 0 ]) {
                    throw `该用户${openid}没有formid、prepay_id`;
                }

                formid = find$.data[ 0 ].formid;
                formid_id = find$.data[ 0 ]._id;
            }

            let textData = { };
            texts.map(( text, index ) => {
                const keyText = `keyword${index + 1}`;
                textData = Object.assign({ }, textData, {
                    [ keyText ] : {
                        value: text
                    }
                })
            });

            const weappTemplateMsg = {
                page,
                data: textData,
                formId: formid,
                templateId: CONFIG.push_template[ type ].value
            };

            console.log('===推送', weappTemplateMsg );

            const send$ = await cloud.openapi.uniformMessage.send({
                touser: openid,
                weappTemplateMsg
            });

            if ( String( send$.errCode ) !== '0' ) {
                throw send$.errMsg;
            }

            // 删除该条form-id
            if ( !!formid_id ) {
                try {
                    await db.collection('form-ids')
                        .doc( formid_id )
                        .remove( );
                } catch ( e ) { }
            }

            return ctx.body = {
                status: 200
            };

        } catch ( e ) {
            return ctx.body = {
                status: 500,
                message: typeof e === 'string' ? e : JSON.stringify( e )
            }
        }
    });

    /** 
     * @description
     * 同上，云开发用
     */
    app.router('push-template-cloud', async( ctx, next ) => {
        try {
            // 获取token
            const result = await (axios as any)({
                method: 'get',
                url: `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${CONFIG.app.id}&secret=${CONFIG.app.secrect}`
            });
            
            const { access_token, errcode } = result.data;

            if ( errcode ) {
                throw '生成access_token错误'
            }

            let formid_id: any = '';
            let formid = event.data.prepay_id;
            const { type, texts } = event.data;
            const openid = event.data.openId || event.data.openid || event.userInfo.openId;
            const page = event.data.page || 'pages/order-list/index';

            // 如果没有prepay_id, 就去拿该用户的form_id
            // 倒叙拿formid
            if ( !formid ) {
                const find$ = await db.collection('form-ids')
                    .where({
                        openid,
                        formid: _.neq('the formId is a mock one')
                    })
                    .orderBy('createTime', 'asc')
                    .limit( 1 )
                    .get( );

                if ( !find$.data[ 0 ]) {
                    throw `该用户${openid}没有formid、prepay_id`;
                }

                formid = find$.data[ 0 ].formid;
                formid_id = find$.data[ 0 ]._id;
            }

            let textData = { };
            texts.map(( text, index ) => {
                const keyText = `keyword${index + 1}`;
                textData = Object.assign({ }, textData, {
                    [ keyText ] : {
                        value: text
                    }
                })
            });

            const weapp_template_msg = {
                page,
                data: textData,
                form_id: formid,
                template_id: CONFIG.push_template[ type ].value
            };

            console.log('===推送', weapp_template_msg );

            const reqData = {
                touser: openid,
                weapp_template_msg
            }

            // 发送推送
            const send = await (axios as any)({
                data: reqData,
                method: 'post',
                url: `https://api.weixin.qq.com/cgi-bin/message/wxopen/template/uniform_send?access_token=${access_token}`
            });

            if ( String( send.data.errcode ) !== '0' ) {
                throw send.data.errmsg;
            }

            // 删除该条form-id
            if ( !!formid_id ) {
                try {
                    await db.collection('form-ids')
                        .doc( formid_id )
                        .remove( );
                } catch ( e ) { }
            }
        
            return ctx.body = {
                data: send.data,
                status: 200
            }

            
        } catch ( e ) {
            return ctx.body = {
                status: 500,
                message: typeof e === 'string' ? e : JSON.stringify( e )
            }
        }
    })

    /** 
     * @description
     * 订阅推送
     * {
     *      openid
     *      type: 'buyPin' | 'buy' | 'getMoney' | 'waitPin' | 'newOrder'
     *      texts: [ 'xx', 'yy' ]
     *      ?page
     * }
     */
    app.router('push-subscribe', async ( ctx, next ) => {
        try {
            const { type, texts } = event.data;
            const openid = event.data.openId || event.data.openid || event.userInfo.openId;
            const page = event.data.page || 'pages/trip-enter/index';
            const template = CONFIG.subscribe_templates[ type ];

            let textData = { };
            texts.map(( text, k ) => {
                textData = {
                    ...textData,
                    [ template.textKeys[ k ]]: {
                        value: text
                    }
                };
            });

            const subscribeData = {
                page,
                data: textData,
                touser: openid,
                templateId: template.id
            };

            console.log('===订阅推送', subscribeData );

            const send$ = await cloud.openapi.subscribeMessage.send( subscribeData );

            if ( String( send$.errCode ) !== '0' ) {
                throw send$.errMsg;
            }

            return ctx.body = {
                status: 200
            }
        } catch ( e ) {
            console.log('????', e );
            return ctx.body = { 
                status: 500,
                data: e
            };
        }
    })

    /** 
     * @description
     * 订阅推送，云版本
     */
    app.router('push-subscribe-cloud', async( ctx, next ) => {
        try {
            const { type, texts } = event.data;
            const openid = event.data.openId || event.data.openid || event.userInfo.openId;
            const page = event.data.page || 'pages/trip-enter/index';
            const template = CONFIG.subscribe_templates[ type ];

            let textData = { };
            texts.map(( text, k ) => {
                textData = {
                    ...textData,
                    [ template.textKeys[ k ]]: {
                        value: text
                    }
                };
            });

            const subscribeData = {
                page,
                data: textData,
                touser: openid,
                template_id: template.id
            };

            // 获取token
            const result = await (axios as any)({
                method: 'get',
                url: `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${CONFIG.app.id}&secret=${CONFIG.app.secrect}`
            });
            
            const { access_token, errcode } = result.data;

            if ( errcode ) {
                throw '生成access_token错误'
            }

            console.log('===云版本订阅推送', subscribeData );

            const send = await (axios as any)({
                data: subscribeData,
                method: 'post',
                url: `https://api.weixin.qq.com/cgi-bin/message/subscribe/send?access_token=${access_token}`
            });

            console.log('===云版本订阅推送', send.data );
            if ( String( send.data.errcode ) !== '0' ) {
                throw send.data.errmsg;
            }

            return ctx.body = {
                status: 200
            }
        } catch ( e ) {
            return ctx.body = { 
                status: 500,
                data: e
            };
        }
    });

    /**
     * @description
     * 创建一个分享记录
     * 表结构 {
     *      to // 受推者
     *      from // 推广者
     *      pid
     *      createTime // 分享时间
     *      isSuccess: boolean // 是否推广成功
     *      successTime: // 推广成功的时间
     * }
     * 请求{
     *     pid
     *     from
     * }
     */
    app.router('create-share', async( ctx, next ) => {
        try {
            const openid = event.userInfo.openId;
            const { from, pid } = event.data;

            // 规则1:防重复
            // 如果A给B推广过商品1，则C给B推广商品1无效
            const count$ = await db.collection('share-record')
                .where({
                    pid,
                    openid,
                    isSuccess: false
                })
                .count( );

            if ( count$.total > 0 ) {
                return ctx.body = { status: 200 };
            }

            // 规则2: 不能自己推自己
            if ( openid === from ) {
                return ctx.body = { status: 200 };
            }

            // 规则3: 24h内不能重复推
            const count2$ = await db.collection('share-record')
                .where({
                    pid,
                    openid,
                    isSuccess: true,
                    successTime: _.gte( getNow( true ) - 24 * 60 * 60 * 1000 )
                })
                .count( );
            
            if ( count2$.total > 0 ) {
                return ctx.body = { status: 200 };
            }

            // 创建
            const create$ = await db.collection('share-record')
                .add({
                    data: {
                        pid,
                        from,
                        openid,
                        isSuccess: false,
                        createTime: getNow( true )
                    }
                });

            return ctx.body = { status: 200 };

        } catch ( e ) {
            return ctx.body = {
                status: 500
            }
        }
    })

    /** 
     * @description
     * 获取推广积分
     * {
     *    showMore?: false
     * }
     */
    app.router('push-integral', async ( ctx, next ) => {
        try {
            const { showMore } = event.data;
            const openid = event.data.openId || event.userInfo.openId;
            const user$ = await db.collection('user')
                .where({
                    openid
                })
                .get( );
            const user = user$.data[ 0 ];

            const exp = !!user ? user.exp || 0 : 0;
            const integral = !!user ? user.push_integral || 0 : 0;

            return ctx.body = {
                status: 200,
                data: !showMore ? 
                    integral :
                    {
                        exp,
                        integral,
                    }
            }

        } catch ( e ) {
            return ctx.body = { status: 500 };
        } 
    })

    /**
     * @description
     * 获取积分使用记录
     * {
     *    tids: 'a,b,c'
     *    type: 'push_integral' | ''
     * }
     */
    app.router('push-integral-use', async ( ctx, next ) => {
        try {
            const { tids, type } = event.data;
            const openid = event.data.openId || event.data.openid || event.userInfo.openId;

            const find$: any = await Promise.all(
                tids.split(',')
                    .map( tid => {
                        return db.collection('integral-use-record')
                            .where({
                                tid,
                                type,
                                openid
                            })
                            .get( );
                    })
            );

            const meta = find$
                .filter( x => !!x.data[ 0 ])
                .map( x => x.data[ 0 ]);

            return ctx.body = {
                data: meta,
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
     * 签到领积分
     * {
     *      exp: number
     * }
     */
    app.router('get-exp', async ( ctx, next ) => {
        try {
            const { exp } = event.data;
            const openid = event.data.openId || event.data.openid || event.userInfo.openId;

            const user$ = await db.collection('user')
                .where({
                    openid
                })
                .get( );

            const user = user$.data[ 0 ] || null;

            if ( !user ) { return ctx.body = { status: 200 }};

            const bd_uid = user._id;
            const body = {
                ...user,
                exp: !user.exp ? exp : user.exp + exp
            };

            delete body['_id'];

            const update$ = await db.collection('user')
                .doc( String( bd_uid ))
                .set({
                    data: body
                });

            return ctx.body = {
                status: 200
            };

        } catch ( e ) {
            return ctx.body = { status: 500 };
        }
    })

    /**
     * @description
     * 签到领积分
     * {
     *      integral: number
     * }
     */
    app.router('get-integral', async ( ctx, next ) => {
        try {
            const { integral } = event.data;
            const openid = event.data.openId || event.data.openid || event.userInfo.openId;

            const user$ = await db.collection('user')
                .where({
                    openid
                })
                .get( );

            const user = user$.data[ 0 ] || null;

            if ( !user ) { return ctx.body = { status: 200 }};

            const bd_uid = user._id;
            const body = {
                ...user,
                push_integral: !user.push_integral ? 
                    integral :
                    Number(( user.push_integral + integral ).toFixed( 2 ))
            };

            delete body['_id'];

            const update$ = await db.collection('user')
                .doc( String( bd_uid ))
                .set({
                    data: body
                });

            return ctx.body = {
                status: 200
            };

        } catch ( e ) {
            return ctx.body = { status: 500 };
        }
    })

    /**
     * @description
     * 领取抵现金成功，推送
     * 并设置2小时候后的经验获取推送
     * {
     *      signExp: 领取的经验
     *      get_integral: number // 本次获得
     *      next_integral: number // 下次获得
     *      week_integral: number // 本周获得
     *      nextweek_integral: number // 下周获得
     * }
     */
    app.router('get-integral-push', async ( ctx, next ) => {
        try {
            const openid = event.data.openId || event.data.openid || event.userInfo.openId;
            const { signExp, get_integral, next_integral, week_integral, nextweek_integral } = event.data;

            // 4、调用推送
            const push$ = await cloud.callFunction({
                name: 'common',
                data: {
                    $url: 'push-subscribe-cloud',
                    data: {
                        openid,
                        type: 'hongbao',
                        page: 'pages/my/index',
                        texts: [`${get_integral}元抵现金！`, `下单就能用！本周登陆送${week_integral}元！`]
                    }
                }
            });

            // 5、插入调用栈
            const create$ = await db.collection('push-timer')
                .add({
                    data: {
                        openid,
                        texts: [`登陆领取${signExp}点经验`, `升级后，全周可领${nextweek_integral}元！`],
                        pushtime: getNow( true ) + 2.1 * 60 * 60 * 1000,
                        desc: '到时间领取经验了',
                        type: 'user-exp-get'
                    }
                });

            return ctx.body = { status: 200 };

        } catch ( e ) {
            return ctx.body = { status: 500 };
        }
    })

    /** 
     * @description
     * 获取订阅模板列表
     */
    app.router('get-subscribe-templates', async ( ctx, next ) => {
        try {
            return ctx.body = { 
                status: 200,
                data: CONFIG.subscribe_templates
            };
        } catch ( e ) {
            return ctx.body = { status: 500 };
        }
    })

    /**
     * @description
     * 根据openid返回用户信息（可返回null）
     */
    app.router('get-user-info', async ( ctx, next ) => {
        try {
            const openid = event.data.openId || event.data.openid || event.userInfo.openId;
            const user$ = await db.collection('user')
                .where({
                    openid
                })
                .get( );

            const data = user$.data[ 0 ] || null;

            // 查询是否为adm
            if ( !!data ) {

                const adm$ = await db.collection('manager-member')
                    .where(({
                        openid: data.openid
                    }))
                    .count( );

                return ctx.body = {
                    data: {
                        ...data,
                        role: adm$.total > 0 ? 1 : 0
                    },
                    status: 200
                }
                
            } else {
                return ctx.body = {
                    data: null,
                    status: 200
                }
            }
        } catch ( e ) {
            return ctx.body = {
                status: 200,
                data: e
            }
        }
    })

    /** 
     * @description
     * 测试专用
     */
    app.router('test', async ( ctx, next ) => {
        try {
            
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
                    pid: true
                })
                .get( );
            const visitorRecords = visitorRecords$.data;

            // 拿到浏览记录最高的商品
            let maxPid = '';
            let maxNum = 0;
            visitorRecords.reduce(( res, record ) => {
                res[ record.pid ] = !res[ record.pid ] ? 1 : res[ record.pid ] + 1;
                if ( res[ record.pid ] > maxNum ) {
                    maxPid = record.pid;
                    maxNum = res[ record.pid ];
                }
                return res;
            }, { });

            // 若有，获取这个商品的总拼团人数
            if ( !maxNum || !maxPid ) {
                return ctx.body = { status: 200 }
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

            if ( order$.data.length === 0 ) {
                return ctx.body = { status: 200 }
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
                return ctx.body = { status: 200 }
            }

            // 获取所有管理员
            const adms$ = await db.collection('manager-member')
                .where({ })
                .get( );

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
                            $url: 'push-subscribe-cloud',
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

            return ctx.body = {
                status: 200
            }
        } catch ( e ) {
            return ctx.body = { 
                status: 500,
                data: e
            };
        }
    })

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