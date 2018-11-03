App({

    /** 初始化 */
    init: function( ) {
      // 全局store
      this.globalData = {};
      // 云
      wx.cloud.init({
        traceUser: true
      });
    },

    /** 获取用户信息 */
    getUserInfo: function () {
      wx.cloud.callFunction({
        name: 'login'
      }).then( res => {
        console.log(res)
      });
    },
  
    onLaunch: function( ) {
      this.init( );
      this.getUserInfo( );
    }
});