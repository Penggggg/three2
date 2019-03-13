const { http } = require('../../util/http.js');

const storageKey = 'client-search';

Page({

    /**
     * 页面的初始数据
     */
    data: {

        // 历史搜搜数据列表
        history: [ ],

        // 搜索
        search: ''

    },

    /** 搜索 */
    onSearch({ detail }) {
        const search = detail;
        this.addHistory( search );

        // 搜索
        http({
            data: {
                search,
                page: 1
            },
            url: 'good_client-search'
        })
    },

    /** 加入历史记录 */
    addHistory( val ) {
        const meta =  wx.getStorageSync( storageKey );
        let temp = meta ? JSON.parse( meta ) : [ ];

        const existedIndex = temp.findIndex( x => x === val );

        // 存在该历史记录
        if ( existedIndex !== -1 ) {
            temp.splice( existedIndex, 1 );
        } 

        temp.unshift( val );
        temp = temp.slice( 0, 6 );
        
        wx.setStorageSync( storageKey, JSON.stringify( temp ));
    },

    /** 初始化历史记录 */
    initHistory( ) {
        const meta =  wx.getStorageSync( storageKey );
        this.setData({
            history: meta ? JSON.parse( meta ) : [ ]
        });
    },

    /** 选择历史记录 */
    onSelectHistory({ currentTarget }) {
        const { data } = currentTarget.dataset;
        this.setData({
            search: data
        });
        this.onSearch({
            detail: data
        });
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.initHistory( );
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