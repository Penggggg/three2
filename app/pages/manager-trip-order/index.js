const app = getApp( );
const { http } = require('../../util/http.js');

Page({

    /**
     * 页面的初始数据
     */
    data: {
        // 行程id
        id: '',
        // 上方活动tab
        active: 0,
        // 上方tabs
        tabs: [{
            key: 0,
            label: '采购单'
        }, {
            key: 1,
            label: '收尾款'
        }
        // , {
        //     key: 2,
        //     label: '快递信息'
        // }
        ],
        // 购物清单是否显示边框
        shopping_list_outline: true,
    },

    /** 切换tab */
    onTabChange({ currentTarget, detail }) {
        
        const { index } = currentTarget.dataset;
        this.setData({
            active: index
        });
    },

    onSubscribe( ) {
        app.getSubscribe('newOrder,trip,getMoney');
    },

    /** 子组件修改tab */
    onChildChangeTab( event ) {
        this.setData({
            active: event.detail
        });
    },

    onOutline( event ) {
        this.setData({
            shopping_list_outline: event.detail
        });
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        wx.hideShareMenu( );
        const { id, ac } = options;

        if ( !id ) { return }
        this.setData({
            id
        })

        if ( ac !== null && ac !== undefined ) {
            this.setData({
                active: Number( ac )
            })
        }
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function ( ) {

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
    onShareAppMessage: function ( ) {
        return {
            title: '商品已到货',
            path: `/pages/trip-deliver/index?id=${this.data.id}`,
            imageUrl: 'https://global-1257764567.cos.ap-guangzhou.myqcloud.com/share.png'
        }
    }

})