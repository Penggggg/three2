
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
            label: '购物清单'
        }, {
            key: 1,
            label: '清账收款'
        }, {
            key: 2,
            label: '快递信息'
        }],
    },

    /** 切换tab */
    onTabChange({ currentTarget }) {
        const { index } = currentTarget.dataset;
        this.setData({
            active: index
        });
    },

    /** 子组件修改tab */
    onChildChangeTab( event ) {
        this.setData({
            active: event.detail
        });
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        // if ( !options.id ) { return; }
        this.setData({
            id: 'XDGzG97E7L4wLIdu'
        });
        // this.setData({
        //     id: options.id
        // });
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
    onShareAppMessage: function () {

    }
})