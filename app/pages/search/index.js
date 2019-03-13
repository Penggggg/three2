const { http } = require('../../util/http.js');

const storageKey = 'client-search';

Page({

    /**
     * 页面的初始数据
     */
    data: {

        // 搜索页
        page: 0,

        // 历史搜搜数据列表
        history: [ ],

        // 搜索
        search: '',

        // 搜索结果
        result: [ ],

        /** 能否记载更多 */
        canLoadMore: true

    },

    fetchList( ) {
        const { page, result, search } = this.data;

        // 搜索
        http({
            data: {
                search,
                page: page + 1
            },
            url: 'good_client-search',
            success: res => {
                const { status, data } = res;
                if ( status !== 200 ) { return; }
                
                const { page, totalPage } = data;
                this.setData({
                    page,
                    canLoadMore: totalPage > page,
                    result: page === 1 ? data.data : [ ...result, ...data.data ]
                })
            }
        })
    },

    /** 确认搜索 */
    onConfirm({ detail }) {

        const search = detail;
        this.addHistory( search );

        this.setData({
            page: 0
        })

        this.fetchList( )
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

        this.initHistory( );
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
        this.onConfirm({
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