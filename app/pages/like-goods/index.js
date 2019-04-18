const { http } = require('../../util/http.js');
const { navTo } = require('../../util/route.js');
const { computed } = require('../../lib/vuefy/index.js');
const { delayeringGood } =  require('../../util/goods.js');

Page({

    /**
     * 页面的初始数据
     */
    data: {

        // 搜索页
        page: 0,

        // 收藏列表
        list: [ ],

        // 能否记载更多
        canLoadMore: true,

        // 加载中
        loadingList: false,

        // tid
        tid: ''

    },

    runComputed( ) {
        computed( this, {

            // 列表
            list$( ) {
                const { list } = this.data;
                const meta = list.map( delayeringGood );
                return meta;
            }

        });
    },

    /** 拉取列表 */
    fetchList( ) {
        const { page, canLoadMore, list, loadingList } = this.data;

        if ( !canLoadMore || loadingList ) { return; }

        this.setData({
            loadingList: true
        });

        // 搜索
        http({
            data: {
                page: page + 1
            },
            url: 'like_list',
            success: res => {
                const { status, data } = res;
                if ( status !== 200 ) { return; }
                
                const { page, totalPage } = data;
                this.setData({
                    page,
                    loadingList: false,
                    canLoadMore: totalPage > page,
                    list: page === 1 ?
                        data.data :
                        [ ...list, ...data.data ]
                });
            }
        })
    },

    /** 获取当前行程 */
    fetchCurrentTrip( cb ) {
        const { tid } = this.data;
        if ( tid ) {
            return !!cb && cb( tid );
        }
        http({
            url: 'trip_enter',
            data: {
                shouldGetGoods: false
            },
            loadingMsg: 'none',
            success: res => {
                const { status, data } = res;
                if ( status === 200 && !!data[ 0 ]) {
                    !!cb && cb( data[ 0 ]._id );
                    this.setData({
                        tid: data[ 0 ]._id
                    });
                }
            }
        });
    },

    goDetail({ currentTarget }) {
        const { tid } = this.data;
        const { good } = currentTarget.dataset;
        navTo(`/pages/goods-detail/index?id=${good._id}&tid=${tid}`)
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function ( options ) {
        wx.hideShareMenu( );
        this.runComputed( );

        this.fetchList( );
        this.fetchCurrentTrip( );
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