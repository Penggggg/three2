import * as cloud from 'wx-server-sdk';
import * as TcbRouter from 'tcb-router';
import * as axios from 'axios';
import * as crypto from 'crypto';
import * as rp from 'request-promise';
import * as CONFIG from './config';

cloud.init( );

const db: DB.Database = cloud.database( );
const _ = db.command;

/**
 * @description 
 * 公共模块
 */
export const main = async ( event, context ) => {

    const app = new TcbRouter({ event });

    /** 数据字典 */
    app.router('dic', async( ctx, next ) => {
        try {

            const dbRes = await db.collection('dic')
                .where({
                    belong: db.RegExp({
                        regexp: event.data.dicName.replace(/\,/g, '|'),
                        optiond: 'i'
                    })
                })
                .get( );
        
            let result = { };
            dbRes.data.map( dic => {
                result = Object.assign({ }, result, {
                    [ dic.belong ]: dic[ dic.belong ]
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

    /** 微信用户信息存储 */
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
                        data: Object.assign({ }, event.data, { openid })
                    }).catch( err => { throw `${err}`});
        
            // 如果存在，则更新
            } else {
                const meta = Object.assign({ }, data$.data[ 0 ], event.data );
                delete meta._id;
                
                await db.collection('user').doc(( data$.data[ 0 ] as any)._id )
                    .set({
                        data: meta
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
                status: 500,
                data: true
            }
        }
    });

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
            const nonce_str = Math.random().toString(36).substr(2, 15);
            const timeStamp = parseInt(String( Date.now() / 1000 )) + '';
            const out_trade_no = "otn" + nonce_str + timeStamp;

            // const body = '香猪测试';
            // const mch_id = '1521522781';
            // const attach = 'anything';
            // const appid = event.userInfo.appId;
            // const notify_url = 'https://whatever.com/notify';
            // const key = 'a92006250b4ca9247c02edce69f6a21a';
            // const total_fee = event.data.total_fee;
            // const spbill_create_ip = '118.89.40.200';
            // const openid = event.userInfo.openId;
            // const nonce_str = Math.random().toString(36).substr(2, 15);
            // const timeStamp = parseInt(String( Date.now() / 1000 )) + '';
            // const out_trade_no = "otn" + nonce_str + timeStamp;

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
            console.log('eeeee', xml );
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

    /** 查询代购个人二维码信息 */
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

    /** 获取“我的页面”的基本信息，诸如订单、卡券数量 */
    app.router('mypage-info', async( ctx, next ) => {
        try {
            
            // 订单数
            const orders$ = await db.collection('order')
                .where({
                    openid: event.userInfo.openId
                })
                .count( );

            // 卡券数
            const coupons$ = await db.collection('coupon')
                .where({
                    openid: event.userInfo.openId
                })
                .count( );
            
            return ctx.body = {
                status: 200,
                data: {
                    coupons: coupons$.total,
                    orders: orders$.total
                }
            }

        } catch ( e ) { return ctx.body = { status: 500 };}
    });

    /** 行程下，参加了购买的客户（订单）
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
     *         time
     *         price
     *         title
     *     }
     * }
     */
    app.router('notification-getmoney', async( ctx, next ) => {
        try {
            
            const page = event.data.page || 'order-list';
            const { touser, form_id, data } = event.data;

            // 获取token
            const result = await (axios as any)({
                method: 'get',
                url: `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${CONFIG.app.id}&secret=${CONFIG.app.secrect}`
            });
            
            const { access_token, errcode } = result.data;

            if ( errcode ) {
                throw '生成access_token错误'
            }

            // 发送推送
            const send = await (axios as any)({
                data: {
                    page,
                    touser,
                    form_id,
                    access_token,
                    template_id: CONFIG.notification_template.getMoney2,
                    data: {
                        // 购买时间
                        "keyword1": {
                            "value": data.time
                        },
                        // 订单总价
                        "keyword2": {
                            "value": data.price
                        },
                        // 活动名称
                        "keyword3": {
                            "value": data.title
                        }
                    }
                },
                method: 'post',
                url: `https://api.weixin.qq.com/cgi-bin/message/wxopen/template/send?access_token=${access_token}`
            })

            return ctx.body = {
                data: send.data,
                status: 200
            }

        } catch ( e ) {
            return ctx.body = { message: e, status: 500 }
        }
    });

    return app.serve( );

}