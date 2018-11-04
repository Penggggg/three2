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
    // 展示按钮
    showBtn: false,
    // 展示弹框
    showDrawer: false,
    // 展示列表
    list: [
      {
        title: '我的商品',
        desc: '新增、编辑、上下架商品',
        url: '/pages/manager-goods-detail/index',
        img: 'cloud://dev-0822cd.6465-dev-0822cd/icon-img/11.png'
      }, {
        title: '商品分组',
        desc: '批量推荐同类型商品',
        img: 'cloud://dev-0822cd.6465-dev-0822cd/icon-img/22.png'
      }
    ]
  },

  /**
   * 组件的方法列表
   */
  methods: {

    /** 监听全局管理员权限 */
    watchRole( ) {
      app.watch$('role', ( val ) => {
        val === 1 && this.setBtn( true );
      });
    },

    /** 设置按钮可视 */
    setBtn( showBtn ) {
      this.setData({
        showBtn
      })
    },

    /** 弹窗开关 */
    toggleDrawer( ) {
      this.setData({
        showDrawer: !this.data.showDrawer
      })
    },

    /** 地址跳转 */
    navigate( e ) {
      wx.navigateTo({
        url: e.currentTarget.dataset.url
      });
    }
    
  },

  attached: function( ) {
    this.watchRole( );
    this.setBtn( app.globalData.role === 1 );
  }
})
