import { http } from './http';

/** 发起微信支付 */
export const wxPay = ( total_fee, successCB, completeCB ) => {

    if ( !total_fee ) {
        // 支付成功
        successCB && successCB( );
        completeCB && completeCB( );
        return;
    }

    http({
        url: 'common_wxpay',
        data: {
            total_fee: Math.floor( total_fee * 100 ) // 这里的单位是分，不是元
        },
        errMsg: '支付失败，请重试',
        success: res1 => {
            if ( res1.status !== 200 ) {
                wx.showToast({
                    icon: 'none',
                    title: '支付失败，请重试'
                });
                completeCB && completeCB( );
                return;
            }
            const { nonce_str, paySign, prepay_id, timeStamp } = res1.data;
            wx.requestPayment({
                paySign,
                timeStamp,
                signType: 'MD5',
                nonceStr: nonce_str,
                package: `prepay_id=${prepay_id}`,
                success: res => {
                    const { errMsg } = res;
                    if ( errMsg === 'requestPayment:ok' ) {
                        // 支付成功
                        successCB && successCB( res1.data );
                    }
                },
                fail: err => {
                    wx.showToast({
                        icon: 'none',
                        title: '支付失败，请重试'
                    });
                },
                complete: ( ) => { completeCB && completeCB( );}
            });
        }
    })
}