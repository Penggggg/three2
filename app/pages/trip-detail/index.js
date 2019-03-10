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
            resolve( );
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
        /**
         * !请记得去掉这段代码
         */
        this.setData({
            tid: 'XDGzG97E7L4wLIdu'
        });
        this.fetchAllPin( 'XDGzG97E7L4wLIdu' )
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