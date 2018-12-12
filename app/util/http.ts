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

    const getError = ( msg = params.errMsg , err?: any ) => {
        console.log( err );
        wx.showToast({
            icon: 'none',
            title: msg
        });
    }
    
    wx.cloud.callFunction({
        data: params.data,
        name: params.url,
        success: ( res: any ) => {
            const { result } = res;
            if ( !result ) { return getError( );}
            const { status, data, message } = result;
            if ( status !== 200 ) {
                return getError( message || null );
            }

            params.success( res );

        },
        fail: err => getError( 'null', err ),
        complete: ( ) => wx.hideLoading({ })
    })

}

export {
    http
};