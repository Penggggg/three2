// container/form/goods-detail/index.js
Component({

  behaviors: [require('../../../behaviores/computed/index.js')],
  /**
   * 组件的属性列表
   */
  properties: {
    gid: {
      type: String,
      value: ''
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    /** 数据字典 */
    dic: { }
  },

  /** 计算属性 */
  computed: {
    
    // 表单数据
    meta( ) {
      return [
        {
          title: '基本信息',
          desc: '让顾客对商品有大致了解'
        }, {
          key: 'title',
          label: '商品名称',
          type: 'input',
          max: 50,
          placeholder: '如：YSL莹亮纯魅唇膏多色可选',
          value: undefined,
          rules: [{
            validate: val => !!val,
            message: '商品名称不能为空'
          }]
        }, {
          key: 'detail',
          label: '商品描述',
          type: 'textarea',
          placeholder: `可长可短的一段介绍(回车可换行)`,
          value: undefined,
          rules: [ ]
        }, , {
          key: 'tag',
          label: '商品标签',
          type: 'tag',
          max: 2,
          placeholder: `如：补水`,
          value: [ ],
        }, {
          key: 'category',
          label: '商品类目',
          type: 'select',
          placeholder: '请设置商品类目',
          value: undefined,
          options: this.data.dic['goods_category'] || [ ] 
        }
      ]
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {

    /** 拉取数据字典 */
    fetchDic( ) {
      const that = this;
      wx.cloud.callFunction({
        name: 'api-dic',
        data: {
          dicName: 'goods_category',
        },
        complete: function (res) {
          that.setData({
            dic: res.result
          });
        }
      })
    }

  },

  attached: function () {
    this.fetchDic( );
  }

})
