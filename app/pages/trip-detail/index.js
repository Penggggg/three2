const { computed } = require('../../lib/vuefy/index.js');
const { http } = require('../../util/http.js');

Page({

    /**
     * 页面的初始数据
     */
    data: {

        /** 行程id */
        tid: '',

        /** 加载状态 */
        loading: true,

        /** 等待拼团列表 */
        waitPin: [ ],

        /** 拼团列表 */
        pingList: [ ]

    },

    /** 设置computed */
    runComputed( ) {
        computed( this, {

            /** 等待拼团列表 */
            waitPin$: function( ) {
                const { waitPin } = this.data;
                return waitPin.sort(( x, y ) => {
                    return x.detail.saled - y.detail.saled;
                });
            },

            /** 等待拼团列表 */
            pingList$: function( ) {
                const { pingList } = this.data;
                return pingList.sort(( x, y ) => {
                    return x.detail.saled - y.detail.saled;
                });
            }
        });
    },

    /** 拉取等待拼团 */
    fetchWaitPin( tid ) {
        return new Promise(( resolve, reject ) => {
            http({
                data: {
                    tid,
                    type: 'wait',
                    showUser: true
                },
                url: 'shopping-list_pin',
                success: res => {
                    const { status, data } = res;
                    if ( status !== 200 ) {
                        return reject( );
                    }
                    this.setData({ 
                        waitPin: data
                    });
                    resolve( );
                }
            });
        })
    },

    /** 拉取已经拼团成功的商品列表 */
    fetchPin( tid ) {
        return new Promise(( resolve, reject ) => {
            http({
                data: {
                    tid,
                    type: 'pin',
                    showUser: true
                },
                url: 'shopping-list_pin',
                success: res => {
                    const { status, data } = res;
                    if ( status !== 200 ) {
                        return reject( );
                    }
                    this.setData({ 
                        pingList: data
                    });
                    resolve( );
                }
            });
        });
    },

    /** 拉取拼团、等待拼团 */
    fetchAllPin( tid ) {
        Promise.all([
            this.fetchPin( tid ),
            this.fetchWaitPin( tid )
        ]).then(( ) => {
            this.setData({
                loading: false
            })
        }).catch( e => {

        });
    },

    /** 跳到商品详情 */
    goDetail({ currentTarget }) {
        const { data } = currentTarget.dataset;
        wx.navigateTo({
            url: `/pages/goods-detail/index?id=${data.pid}&tid=${this.data.tid}`
        });
    },

    /** 预览图片 */
    priviewSingle({ currentTarget }) {
        const { img, imgs } = currentTarget.dataset;
        wx.previewImage({
            current: img,
            urls: imgs || [ img ],
        })
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

        this.runComputed( );
        const tid = options.id;
        if ( tid ) { 
            this.setData({
                tid
            });
            this.fetchAllPin( tid )
        }
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
        const { tid } = this.data;
        return {
            title: '买到就赚到！拼着买，更便宜！',
            path: `/pages/trip-detail/index?id=${tid}`
        }
    }
})