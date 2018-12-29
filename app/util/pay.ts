import { http } from './http';

/** 发起微信支付 */
export const wxPay = ( total_fee, successCB, completeCB ) => {
    http({
        url: 'common_wxpay',
        data: {
            total_fee: Math.floor( total_fee * 100 ) // 这里的单位是分，不是元
        },
        errMsg: '支付失败，请重试',
        success: res => {
            if ( res.status !== 200 ) { return; }
            const { nonce_str, paySign, prepay_id, timeStamp } = res.data;
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
                        successCB && successCB( );
                    }
                },
                fail: err => {
                    wx.showToast({
                        icon: 'none',
                        title: '支付失败，请重试'
                    })
                },
                complete: ( ) => { completeCB && completeCB( );}
            });
        }
    })
}