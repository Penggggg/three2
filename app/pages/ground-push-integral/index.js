
import { http } from '../../util/http.js';
import { navTo } from '../../util/route.js';
import { computed } from '../../lib/vuefy/index.js';
import { delayeringGood } from '../../util/goods.js';

const app = getApp( );

Page({

    /**
     * 页面的初始数据
     */
    data: {

        // 积分推广获点比例
        pushIntegralRate: 0,

        // 分页
        page: 0,

        // 加载
        canLoadMore: true,

        // 加载中
        loadingRank: false,

        // 列表
        rank: [ ],

        // 当前人的推广积分
        pushIntegral: 0,

        // 能否分享
        canShare: false,

        // 是否打开提示
        openTips: true,

        // 手动打开的时间
        openTime: 0
    },

    /**  */
    runComputed( ) {
        computed( this, {
            /** 排行榜 */
            rank$: function( ) {
                const { rank, pushIntegralRate } = this.data;
                return rank.map( x => delayeringGood( x, pushIntegralRate ));
            }
        });
    },

    /** 监听全局管理员权限 */
    watchRole( ) {
        app.watch$('appConfig', val => {
            this.setData({
                pushIntegralRate: (val || { })['push-integral-get-rate'] || 0,
                canShare: (val || { })['good-integral-share'] || false
            });
        });
    },

    /** 推广商品排行榜 */
    fetchRank( ) {
        const { page, canLoadMore, loadingRank, rank } = this.data;

        if ( !canLoadMore || !!loadingRank ) { return; }

        this.setData({
            loadingRank: true
        })

        http({
            data: {
                limit: 10,
                page: page + 1
            },
            url: `good_push-integral-rank`,
            success: res => {
                const { status, data } = res;
                if ( status !== 200 ) { return; }

                const { pagenation } = data;
                const { page, totalPage } = pagenation;
                const list = data.data.map( delayeringGood );
                const meta = page === 1 ? list : [ ...rank, ...list ];

                this.setData({
                    page,
                    rank: meta,
                    loadingRank: false,
                    canLoadMore: page < totalPage
                });
            }
        });
    },

    /** 获取当前人的推广积分 */
    fetchPushIntegral( ) {
        http({
            url: 'common_push-integral',
            success: res => {
                const { status, data } = res;
                if ( status !== 200 ) { return; }
                this.setData({
                    pushIntegral: data
                });
            }
        })
    },

    /** 手动打开 */
    sureOpen( ) {
        this.setData({
            openTips: true,
            openTime: Date.now( )
        })
    },

    /** 提示弹框 */
    onToggle( e ) {
        this.setData({
            openTips: e.detail
        })
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.runComputed( );
        this.watchRole( );

        this.fetchRank( );
        this.fetchPushIntegral( );
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
    onShareAppMessage: function ( event ) {
        const { _id, img, activities, priceGap, title } = event.target.dataset.share;

        if ( event.from === 'button' ) {
            setTimeout(( ) => {
                wx.showToast({
                    duration: 2000,
                    title: '分享成功！'
                });
            }, 2000 );
        }

        return {
            title: `${priceGap !== '' && Number( priceGap ) !== 0 ? 
                activities.length === 0 ?
                    `看看这宝贝！拼团可省${String( priceGap ).replace(/\.00/g, '')}元！` :
                    `看看这宝贝！限时特价！` : 
                '给你看看这宝贝！'
                }${title}`,
            path: `/pages/goods-detail/index?id=${_id}`,
            imageUrl: img[ 0 ]
        }
    }
})