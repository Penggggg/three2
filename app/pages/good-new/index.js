const { http } = require('../../util/http.js');
const { navTo } = require('../../util/route.js');
const { computed } = require('../../lib/vuefy/index.js');
const { delayeringGood } = require('../../util/goods.js');
const app = getApp( );

Page({

    /**
     * 页面的初始数据
     */
    data: {

        // banner文字
        bannerTips: [
            '发现',
            '美好新品'
        ],

        // ip
        ipName: '',

        // ip
        ipAvatar: '',

        // 排行榜
        loadingRank: false,

        // 排行榜
        canLoadRankMore: true,

        // 排行榜
        rankPage: 0,

        // 排行榜
        rankList: [ ],

    },

    runComputed( ) {
        computed( this, {
            // 热门推荐 + 活动标志 
            bannerTips$: function( ) {
                const { bannerTips, ipName } = this.data;
                if ( !ipName ) {
                    return bannerTips
                } else {
                    return [
                        `${ipName}`,
                        `为你选新品`
                    ]
                }
            }
        });
    },

    /** 全局数据 */
    watchRole( ) {
        app.watch$('appConfig', ( val ) => {
            if ( !val ) { return; }
            this.setData({
                ipName: val['ip-name'],
                ipAvatar: val['ip-avatar']
            })
        });
    },

    /** 新品榜 */
    fetchRank( ) {
     
        const { loadingRank, canLoadRankMore, rankPage, rankList } = this.data;
        if ( loadingRank || !canLoadRankMore ) { return; }

        this.setData({
            loadingRank: true
        });

        http({
            data: {
                limit: 6,
                page: rankPage + 1,
                sort: 'createTime'
            },
            url: `good_rank`,
            success: res => {
                const { status, data } = res;
                if ( status !== 200 ) { return; }

                const list = data.data;
                const { pagenation } = data;
                const { page, totalPage } = pagenation;

                const meta = page === 1 ? list : [ ...rankList, ...list ]

                this.setData({
                    rankPage: page,
                    rankList: meta.map( delayeringGood ),
                    loadingRank: false,
                    canLoadRankMore: page < totalPage,
                });
            }
        });
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.fetchRank( );
        this.watchRole( );
        this.runComputed( );
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