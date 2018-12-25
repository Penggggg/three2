const { http } = require('../../util/http.js');

Page({

    /**
     * 页面的初始数据
     */
    data: {
        // 上方活动tab
        active: 0,
        // 上方tabs
        tabs: [{
            key: 0,
            label: '全部'
        }, {
            key: 1,
            label: '待付款'
        }, {
            key: 2,
            label: '待发货'
        }, {
            key: 3,
            label: '已完成'
        }],
        // tab跟查询的关系
        keyMapType: {
            0: 'my-all',
            1: 'my-notpay',
            2: 'my-delive',
            3: 'my-finish'
        },
        // 滚动加载page
        page: 0,
        // 滚动加载 是否能加载更多
        canloadMore: true,
        // 订单列表
        list: [ ]
    },

    /** 点击上方各类订单 */
    onTab({ currentTarget }) {
        const { index } = currentTarget.dataset;
        if ( index === this.data.active )  { return; }
        
        this.setData({
            list:[ ],
            page: 0,
            totalPage: 1,
            active: index
        });
        this.fetchList( index );
    },

    /** 拉取订单数据 */
    fetchList( index ) {
        const { page, keyMapType } = this.data;
        const type = keyMapType[ index ];
        http({
            data: {
                type,
                page: page + 1
            },
            url: 'order_list',
            loadMsg: '加载中...',
            success: res => {
                console.log( res );
            }
        })
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.fetchList( this.data.active );
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