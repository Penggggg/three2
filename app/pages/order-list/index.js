const { http } = require('../../util/http.js');

Page({

    /**
     * 页面的初始数据
     */
    data: {
        active: 0,
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
        keyMapType: {
            0: 'my-all',
            1: 'my-notpay',
            2: 'my-delive',
            3: 'my-finish'
        },
        page: 0,
        totalPage: 1,
    },

    onTab({ currentTarget }) {
        const { index } = currentTarget.dataset;
        this.setData({
            active: index
        });
        this.fetchList( index );
    },

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