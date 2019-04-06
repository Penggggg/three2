const { http } = require('../../util/http.js');
const { navTo } = require('../../util/route.js');
const { computed } = require('../../lib/vuefy/index.js');

Page({

    /**
     * 页面的初始数据
     */
    data: {

        // 行程
        tid: '',

        // 上次查阅的时间
        last: null,

        // 页数
        page: 0,

        // 加载
        canLoadMore: true,

        // 加载
        loading: false,

        // 列表
        list: [ ]

    },

    runComputed( ) {
        computed( this, {

            list$( ) {
                const { list } = this.data;
                return list;
            }
        });
    },

    /** 拉取订单列表 */
    fetchList( ) {
        const { tid, last, page, list, canLoadMore, loading } = this.data;
        if ( !canLoadMore || loading ) { return; }
        console.log('???', tid );
    },


    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        const { tid , last } = options;
        wx.hideShareMenu( );
        this.runComputed( );

        this.setData({
            last: last || null,
            tid: 'XDGzG97E7L4wLIdu'
        });
        this.fetchList( );
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