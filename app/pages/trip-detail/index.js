const { computed } = require('../../lib/vuefy/index.js');
const { http } = require('../../util/http.js');

Page({

    /**
     * 页面的初始数据
     */
    data: {
        /** 行程id */
        tid: ''
    },

    /** 拉取等待拼团 */
    fetchWaitPin( tid ) {
        http({
            data: {
                tid,
                type: 'wait',
                showUser: true
            },
            url: 'shopping-list_pin',
            success: res => {
                const { status, data } = res;
                if ( status !== 200 ) { return; }
            }
        })
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        const tid = options.id;
        if ( tid ) { 
            this.setData({
                tid
            });
            this.fetchWaitPin( tid )
        }
        /**
         * !请记得去掉这段代码
         */
        this.setData({
            tid: 'XDGzG97E7L4wLIdu'
        });
        this.fetchWaitPin( 'XDGzG97E7L4wLIdu' )
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