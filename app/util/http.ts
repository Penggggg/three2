const httpParam = {
    url: '',
    data: { },
    success: ( res ) => { },
    loadingMsg: '加载中....',
    errMsg: '加载错误，请重试',
    complete: ( ) => { },
    error: ( ) => { }
};

type httpParam = any;

const http = ( params$: httpParam ) => {

    const params = Object.assign({ }, httpParam, { ...params$ });

    params.loadingMsg !== 'none' && wx.showLoading({
        title: params.loadingMsg
    });

    const getError = ( msg = params.errMsg, err?: any ) => {
        err && console.log(`Error: `, err || msg );
        wx.showToast({
            icon: 'none',
            title: msg,
            duration: 2000
        });
    }

    const name = params.url.split('_')[ 0 ];
    const $url = params.url.split('_')[ 1 ];

    wx.cloud.callFunction({
        data: {
            $url,
            data: params.data
        },
        name,
        success: ( res: any ) => {
            const { result } = res;
            if ( !result ) { return getError( );}
            console.log(`【---- Request Success : ${params$.url}】`, params$.data, res.result );
            const { status, data, message } = result;
            if ( status !== 200 ) {
                getError( message && message !== { } ? message : params.errMsg );

            } else {
                wx.hideLoading({ });
            }
            params.success( res.result );
        },
        fail: err => {
            getError( '网络错误', err );
            params.error && params.error( );
            console.log(`【---- Request ERROR : ${params$.url}】`);
        },
        complete: ( ) => {
            // wx.hideLoading({ });
            params.complete && params.complete( )
        }
    })

}

export {
    http
};