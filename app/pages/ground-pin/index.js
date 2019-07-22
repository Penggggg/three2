
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

        // 分页
        page: 0,

        // 加载
        canLoadMore: true,

        // 加载中
        loading: false,

        // 列表
        list: [ ],

        // 是否打开提示
        openTips: true
    },

    /**  */
    runComputed( ) {
        computed( this, {
        });
    },

    /** 拉取拼团列表 */
    fetchPin( ) {
        const { page, canLoadMore, loading, list } = this.data;

        if ( !canLoadMore || !!loading ) { return; }

        this.setData({
            loading: true
        });

        http({
            data: {
                limit: 10,
                page: page + 1
            },
            url: `good_pin-ground`,
            success: res => {
                const { status, data } = res;
                if ( status !== 200 ) { return; }

                const { pagenation } = data;
                const { page, totalPage } = pagenation;

                const meta = page === 1 ? list : [ ...list, ...data.data ];
                this.setData({
                    page,
                    list: meta,
                    loading: false,
                    canLoadMore: page < totalPage
                });
            }
        });
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
        this.fetchPin( );
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