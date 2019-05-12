const { delayeringGood } = require('../../util/goods.js');
const { computed } = require('../../lib/vuefy/index.js');
const { navTo } = require('../../util/route.js');

const app = getApp( );

Page({

    /**
     * 页面的初始数据
     */
    data: {

        // 商品详情
        detail: null,

        // 文字保证提示
        promiseTips: [
            '正品保证', '价格优势', '真人跑腿'
        ]

    },

    /** 设置computed */
    runComputed( ) {
        computed( this, {

            // 计算价格
            price$: function( ) {
                const { detail } = this.data;
                const result = delayeringGood( detail );
                return result ? result.price$ : '';
            },

            // 商品详情 - 分行显示
            detailIntro$: function( ) {
                const { detail } = this.data;
                if ( !detail || ( !!detail && !detail.detail )) {
                    return [ ];
                } else {
                    return detail.detail.split('\n').filter( x => !!x );
                }
            }
        })
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.init( );
        this.runComputed( );
    },

    init( ) {
        app.watch$('editingGood', val => {
            if ( !val ) { return; }
            this.setData({
                detail: val
            });
        });
    },

    /** 预览图片 */
    previewImg({ currentTarget }) {
        const { img } = currentTarget.dataset;
        this.data.detail && wx.previewImage({
            current: img,
            urls: [ ...this.data.detail.img ],
        });
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