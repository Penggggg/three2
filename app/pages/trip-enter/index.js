// app/pages/trip-enter/index.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        /** 是否已加载过 */
        loaded: false,
        /** 最快可用行程 */
        current: null,
        /** 下一趟可用行程 */
        next: null
    },

    /** 拉取两个最新行程 */
    fetchLast( ) {
        const { loaded } = this.data;
        if ( loaded ) { return; }

        wx.showLoading({
            title: '加载中...',
        });

        const getError = ( ) => wx.showToast({
            icon: 'none',
            title: '加载行程错误，请重试',
        });

        wx.cloud.callFunction({
            data: { },
            name: 'api-trip-enter',
            success: res => {
                const { status, data } = res.result;
                if ( status !== 200 ) {
                    return getError( );
                }

                this.setData({
                    loaded: true,
                    next: data[ 1 ] ? this.dealTrip( data[ 1 ]) : null,
                    current: data[ 0 ] ? this.dealTrip( data[ 0 ]) : null
                });
            },
            fail: err => getError( ),
            complete: ( ) => {
                wx.hideLoading({ });
            }
        });
    },

    /** 处理详情 */
    dealTrip( tripDetail ) {

        const { start_date, end_date } = tripDetail;
        const MMdd = timestamp => {
            const d = new Date( timestamp );
            return `${d.getMonth( ) + 1}.${d.getDate( )}`
        }

        return Object.assign({ }, tripDetail, {
            end_date$: MMdd( end_date ),
            start_date$: MMdd( start_date )
        });
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function ( ) {
        this.fetchLast( );
    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },

    /**
     * 用户点击右上角分享
     */
    // onShareAppMessage: function () {

    // }
})