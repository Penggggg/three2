const { http } = require('../../util/http.js');
const { navTo } = require('../../util/route.js');
const { computed } = require('../../lib/vuefy/index.js');
const { delayeringGood } = require('../../util/goods.js');
const { createFormId } = require('../../util/form-id');
const app = getApp( );

Page({

    /**
     * 页面的初始数据
     */
    data: {

        // banner文字
        bannerTips: [
            '买就赚',
            '限时的特价'
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
                        `${ipName}的`,
                        `买就赚特价`
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
                isClosed: false,
                filterPass: true,
                page: rankPage + 1
            },
            url: `activity_good-discount-list`,
            success: res => {
                const { status, data } = res;
                if ( status !== 200 ) { return; }

                const { list, pagenation } = data;
                const { page, totalPage } = pagenation;

                const meta = page === 1 ? list : [ ...rankList, ...list ]
                const meta2 = meta.map( x => ({
                    ...x.detail,
                    price: x.ac_price,
                    groupPrice: x.ac_groupPrice
                }));

                this.setData({
                    rankPage: page,
                    rankList: meta2.map( delayeringGood ),
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