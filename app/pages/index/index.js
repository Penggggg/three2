const app = getApp( );

Page({

  /** 去相应的管理页面 */
  goManager: function( event ) {
    wx.navigateTo({
      url: event.currentTarget.dataset.routeto,
    })
  },

  onLoad: function () {

  },

});