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

        // ip头像
        ipAvatar: '',

        // ip名称
        ipName: '',

        // 推荐商品
        recommendGoods: [ ],

        // 当前行程
        current: null
    },

    runComputed( ) {
        computed( this, {

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

        app.watch$('role', role => {
            this.setData({
                role
            });
        });
    },

    /** 拉取两个最新行程 */
    fetchLast( ) {

        http({
            data: { },
            loadingMsg: '加载中...',
            url: `trip_enter`,
            success: res => {
                const { status, data } = res;
                if ( status !== 200 ) { return; }

                const current = data[ 0 ];

                this.setData({
                    current: data[ 0 ] ? this.dealTrip( data[ 0 ]) : null,
                    recommendGoods: current? current.products.map( delayeringGood ).filter( x => !!x ) : [ ],
                });

            }
        });

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

    /** 拼团广场 */
    goGround( ) {
        navTo('/pages/ground-pin/index');
    },

    /** 选择分类 */
    onChoiceClassify({ currentTarget }) {
        const { value } = currentTarget.dataset;
        this.setData({
            active: value
        })
    },

    /** 处理详情 */
    dealTrip( tripDetail ) {

        const { start_date, end_date } = tripDetail;
        const MMdd = timestamp => {
            const d = new Date( timestamp );
            return `${d.getMonth( ) + 1}.${d.getDate( )}`
        }

        return Object.assign({ }, tripDetail, {
            end_date$: MMdd( end_date ),
            start_date$: MMdd( start_date )
        });
    },

    /** 去搜索 */
    goSearch( ) {
        navTo('/pages/search/index')
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.runComputed( );
        this.watchRole( );

        this.fetchLast( );
        this.fetchDic( );
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
        const { role } = this.data;
        if ( role === 1 ) {

            setTimeout(( ) => {
                this.fetchLast( );
            }, 20 );
        }
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