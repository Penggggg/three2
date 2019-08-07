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
        role: 0,

        // 数据字典
        dic: { },

        // 目录分类
        classify: [ ],

        // 加载中
        loading: true,

        // 当前选中的分类
        active: 'recommand',
    },

    /** 拉取数据字典 */
    fetchDic( ) {
        const { dic } = this.data;
        // if ( Object.keys( dic ).length > 0 ) { return;}

        http({
            data: {
                filterBjp: true,
                dicName: 'goods_category',
            },
            errMsg: '加载失败，请重试',
            url: `common_dic`,
            success: res => {
                if ( res.status !== 200 ) { return; }
                this.setData({
                    loading: false,
                    dic: res.data,
                    classify: [{
                        label: '推荐',
                        value: 'recommand'
                    }, ...res.data.goods_category ]
                });
            }
        });
    },

    /** 选择分类 */
    onChoiceClassify({ currentTarget }) {
        const { value } = currentTarget.dataset;
        this.setData({
            active: value
        })
    },

    /** 去搜索 */
    goSearch( ) {
        navTo('/pages/search/index')
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.fetchDic( )
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