const httpParam = {
    url: '',
    data: { },
    success: ( res ) => { },
    loadingMsg: '加载中....',
    errMsg: '加载错误，请重试'
};

type httpParam = any;

const http = ( params$: httpParam ) => {
    const params = Object.assign({ }, httpParam, { ...params$ });

    wx.showLoading({
        title: params.loadingMsg
    });

    const getError = ( msg = params.errMsg, err?: any ) => {
        err && console.log( err );
        wx.showToast({
            icon: 'none',
            title: msg
        });
    }

    const name = params.url.split('-')[ 0 ];
    const $url = params.url.split('-')[ 1 ];

    wx.cloud.callFunction({
        data: {
            $url,
            data: params.data
        },
        name,
        success: ( res: any ) => {
            const { result } = res;
            if ( !result ) { return getError( );}
            
            const { status, data, message } = result;
            if ( status !== 200 ) {
                getError( message || params.errMsg );
            }

            params.success( res.result );

        },
        fail: err => getError( '网络错误', err ),
        complete: ( ) => wx.hideLoading({ })
    })

}

export {
    http
};