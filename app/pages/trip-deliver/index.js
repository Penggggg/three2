const { computed } = require('../../lib/vuefy/index.js');
const { http } = require('../../util/http.js');

Page({

    /**
     * 页面的初始数据
     */
    data: {

        active: 0,

        /** 行程列表 */
        id: '',

        /** 快递图片 */
        delivers: [ ],

        /** 按钮 */
        showDeliverBtn: false

    },

    /** 设置tab */
    setTab({ currentTarget }) {
        const { active } = currentTarget.dataset;
        this.setData({
            active: Number( active )
        });
    },

    /** 拉取快递图片 */
    fetchImgs( ) {
        http({
            url: 'trip_deliver',
            data: {
                tid: this.data.tid
            },
            success: res => {
                if ( res.status === 200 ) {
                    this.setData({
                        delivers: res.data
                    })
                }
            }
        })
    },

    /** 查看快递 */
    showDeliver( ) {
        const { delivers } = this.data;
        if ( delivers.length === 0 ) {
            return wx.showToast({
                icon: 'none',
                title: '暂无快递信息'
            });
        }
        wx.previewImage({
            current: delivers[ 0 ],
            urls: delivers
        })
    },

    /** 跳往行程 */
    goTrip( ) {
        wx.navigateTo({
            url: '/pages/trip-enter/index'
        });
    },

    onIsBuyer({ detail }) {
        this.setData({
            showDeliverBtn: detail
        })
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        if ( options.id ) { 
            this.setData({
                id: options.id
            });
            this.fetchImgs( );
        }

        /**
         * !请记得去掉这段代码
         */
        this.setData({
            id: 'XDGzG97E7L4wLIdu'
        });
        this.fetchImgs( );
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