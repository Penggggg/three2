const { computed } = require('../../lib/vuefy/index.js');
const { http } = require('../../util/http.js');
const { navTo } = require('../../util/route.js');

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
        pingList: [ ],

        /** 等待拼团 + 拼团列表 + 普通 */
        allShoppinglist: [ ]

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
            },

            allShoppinglist$: function( ) {
                const { allShoppinglist } = this.data;
                return allShoppinglist
                    .map( x => Object.assign({ }, x, {
                        delta: !x.adjustGroupPrice ? 0 : ( x.adjustPrice - x.adjustGroupPrice ).toFixed( 0 )
                    }))
                    .sort(( x, y ) => {
                        return x.detail.saled - y.detail.saled;
                    });
            },
        });
    },

    /** 拉取所有购物清单 */
    fetchAllShoppinglist( tid ) {
        http({
            data: {
                tid,
                type: 'all',
                showUser: true
            },
            url: 'shopping-list_pin',
            success: res => {
                const { status, data } = res;
                if ( status !== 200 ) { return; }

                const noPin = data.filter( x => !x.adjustGroupPrice );
                const waitPin = data.filter( x => !!x.adjustGroupPrice && x.uids.length === 1 );
                const pingList = data.filter( x => !!x.adjustGroupPrice && x.uids.length > 1 );

                this.setData({
                    waitPin,
                    pingList,
                    loading: false,
                    allShoppinglist: [ ...waitPin, ...pingList,...noPin  ]
                });
            }
        });
    },

    /** 跳到商品详情 */
    goDetail({ currentTarget }) {
        const { data } = currentTarget.dataset;
        navTo(`/pages/goods-detail/index?id=${data.pid}&tid=${this.data.tid}`);
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
        const tid = options.id || '281fb4bf5d04a99f01c43e504a1421fd';
        if ( tid ) { 
            this.setData({
                tid
            });
            this.fetchAllShoppinglist( tid );
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