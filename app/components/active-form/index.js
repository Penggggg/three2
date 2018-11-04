// components/active-form/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    meta: {
      type: Array,
      value: [ ]
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    // 编辑标签
    tagging: false
  },

  /**
   * 组件的方法列表
   */
  methods: {

    /** 展开tag */
    toogleTag( ) {
      this.setData({
        tagging: !this.data.tagging
      })
    }

  }

})
