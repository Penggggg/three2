// app/pages/cart-list/index.js
Page({

    /**
     * 页面的初始数据
     */
    data: {

    },

    fetchList: function( ) {
        const that = this;
        wx.showLoading({
            title: '加载中...',
        });

        wx.cloud.callFunction({
            data: { },
            name: 'api-cart-list',
            success: res => {
                wx.hideLoading({ });
                const { status, data } = res.result;
                console.log( data );
            },
            fail: err => {
                wx.showToast({
                    icon: 'none',
                    title: '加载购物车错误',
                });
                wx.hideLoading({ });
            }
        })
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
    onShow: function () {
        this.fetchList( );
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