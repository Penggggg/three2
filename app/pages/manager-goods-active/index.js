const { computed } = require('../../lib/vuefy/index.js');

Page({

    /**
     * 页面的初始数据
     */
    data: {
        /** 展示商品选择 */
        showProduct: false
    },

    /** 设置computed */
    runComputed( ) {
        computed( this, {
        })
    },

    /** 展开关闭产品选择 */
    toggleProduct( ) {
        const { showProduct } = this.data;
        this.setData({
            showProduct: showProduct ? false : true
        });
    },

    /** 选择产品/型号 */
    onConfirmProduct( e ) {
        console.log( e );
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

    }
})