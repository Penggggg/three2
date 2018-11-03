const app = getApp( );

// container/manager-entry-btn/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    showBtn: false
  },

  /**
   * 组件的方法列表
   */
  methods: {

    /** 监听全局管理员权限 */
    watchRole( ) {
      app.watch$('role', ( val ) => {
        console.log('watch...', val );
        val === 1 && this.setBtn( true );
      });
    },

    /** 设置按钮可视 */
    setBtn( showBtn ) {
      this.setData({
        showBtn
      })
    }
    
  },

  attached: function( ) {
    this.watchRole( );
    console.log('readying...', app.globalData.role)
    this.setBtn( app.globalData.role === 1 );
  }
})
