
// container/manager-entry-btn/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    text: {
      type: String,
      value: 0
    },
    type: {
      type: String,
      value: 'plain'
    },
    typeColor: {
      type: String,
      value: '#ff5777'
    },
    textColor: {
      type: String,
      value: '#ffffff'
    },
    _system_: {
      type: String,
      value: ''
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
   

  },

  attached: function () {
    let host = this;
    wx.getSystemInfo && wx.getSystemInfo({
      success: function (res) {
        host.setData({
          _system_: !!~res.system.indexOf('Android') ? 'android' : 'ios'
        });
      }
    });
  }
})
