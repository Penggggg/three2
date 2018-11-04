// container/nav-bar/index.js
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
    // 导航nav
    navList: [
      {
        label: '代购',
        url: "/pages/index/index",
        normal: "cloud://dev-0822cd.6465-dev-0822cd/icon-img/nav-icon-7.png",
        active: "cloud://dev-0822cd.6465-dev-0822cd/icon-img/nav-icon-8.png"
      }, {
        label: '超值',
        url: "/pages/index/index",
        normal: "cloud://dev-0822cd.6465-dev-0822cd/icon-img/nav-icon-5.png",
        active: "cloud://dev-0822cd.6465-dev-0822cd/icon-img/nav-icon-6.png"
      }, {
        label: '购物车',
        url: "/pages/index/index",
        normal: "cloud://dev-0822cd.6465-dev-0822cd/icon-img/nav-icon-3.png",
        active: "cloud://dev-0822cd.6465-dev-0822cd/icon-img/nav-icon-4.png"
      }, {
        label: '我的',
        url: "/pages/index/index",
        normal: "cloud://dev-0822cd.6465-dev-0822cd/icon-img/nav-icon-1.png",
        active: "cloud://dev-0822cd.6465-dev-0822cd/icon-img/nav-icon-2.png"
      }
    ]
  },

  /**
   * 组件的方法列表
   */
  methods: {

  }
})
