const { http } = require('../../util/http.js');
const { navTo } = require('../../util/route.js');
const { computed } = require('../../lib/vuefy/index.js');

const app = getApp( );

Page({

    /**
     * 页面的初始数据
     */
    data: {

        // 分导航模块
        icons: [
            {
                title: '联系客服',
                url: '/pages/concat/index',
                handler: '',
                iconImg: 'https://global-1257764567.cos.ap-guangzhou.myqcloud.com/icon-kefu2.png'
            }
        ],

        // 基本资料
        baseInfo: {
            orders: 0,
            coupons: 0
        },
    },

    runComputed( ) {
        computed( this, {

        });
    },

    /** 全局数据 */
    watchRole( ) {
        app.watch$('appConfig', ( val ) => {

            if ( !val ) { return; }

            const one = val['user-level-one'];
            const two = val['user-level-two'];
            const three = val['user-level-three'];

            const sign1 = val['sign-gift-one'];
            const sign2 = val['sign-gift-two'];
            const sign3 = val['sign-gift-three'];

            this.setData({
                signGift: [ sign1, sign2, sign3 ],
                userLevelArr: [ one, two, three ]
            });
        });
    },

    /** 拉取订单、卡券数据 */
    fetchData( ) {
        const { baseInfo } = this.data;

        http({
            loadMsg: '加载中...',
            url: 'common_mypage-info',
            success: res => {
                if ( res.status !== 200 ) { return; }

                const temp = { };
                Object.keys( res.data ).map( key => {
                    temp[ key ] = res.data[ key ];
                });
                this.setData({
                    baseInfo: Object.assign({ }, this.data.baseInfo, temp )
                });
            }
        })
    },

    /** 跳到订单列表 */
    goOrderList( ) {
        navTo('/pages/order-list/index');
    },

    /** 跳到优惠券列表 */
    goCouponList( ) {
        navTo('/pages/coupon-list/index');
    },

    /** 跳到我的喜欢、联系客服 */
    goLike( ) {
        // navTo('/pages/like-goods/index');
        navTo('/pages/concat/index')
    },

    /** 点击下方的客服等模块 */
    onTabIcon({ currentTarget }) {
        const { data } = currentTarget.dataset;
        if ( data.url ) {
            navTo( data.url );
        } else {
            !!this[ data.handler ] && !!this[ data.handler ]( );
        }
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.runComputed( );
        this.watchRole( );
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function ( ) {
        this.fetchData( );

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
        return {
            title: '这个小程序真不错！跟我一起来拔草～',
            path: '/pages/trip-enter/index'
        }
    }
})