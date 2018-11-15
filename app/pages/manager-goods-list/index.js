// app/pages/manager-goods-list/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 当前页码
    page: 1,
    // 总页数
    totalPage: 1,
    // 搜索
    search: '',
    // 商品列表
    list: [ ]
  },

  /** 跳页 */
  navigate( e ) {
    wx.navigateTo({
      url: e.currentTarget.dataset.url || '/pages/manager-goods-detail/index',
    })
  },

  /** 拉取列表 */
  fetchData( ) {
    const that = this;
    wx.cloud.callFunction({
      name: 'api-goods-list',
      data: {
        page: 1,
        title: this.data.search
      },
      success: function (res) {
        // const { status, data } = res.result;
        console.log( res )
        // if ( status === 200 ) {
        //   const { page, totalPage } = data;
        //   that.setData({
        //     page,
        //     totalPage,
        //     list: data.data
        //   });
        // }
      },
      fail: function( ) {
        wx.showToast({
          icon: 'none',
          title: '获取数据错误',
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.fetchData( );
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