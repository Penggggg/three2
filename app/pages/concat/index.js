const { http } = require('../../util/http.js');

Page({

    /**
     * 页面的初始数据
     */
    data: {
        wx_qrcode: [ ],
        group_qrcode: [ ]
    },

    /** 拉取已有二维码信息 */
    fetchQrCode( ) {
        http({
            url: `common_wxinfo`,
            success: res => {
     
                if ( res.status !== 200 ) { return; }

                const keys = ['wx_qrcode', 'group_qrcode'];
                keys.map( key => {
                    if ( !!res.data[ key ]) {
                        this.setData({
                            [ key ]: res.data[ key ]
                        });
                    }
                });
            }
        });
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.fetchQrCode( );
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
        
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
    onShareAppMessage: function () {
        return {
            title: '分享给你 超值代购',
            path: '/pages/trip-enter/index',
            imageUrl: 'https://global-1257764567.cos.ap-guangzhou.myqcloud.com/share.png'
        }
    }
})