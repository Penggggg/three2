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
    // 数据字典
    dic: { },
    // 展开规格
    standarding: false,
    // 规格弹框表单
    standarForm: {
      name: null,
      price: null,
      groupPrice: null,
      stock: null,
      img: null
    },
    // 选中型号的下标
    selectingStandarIndex: null,
    // 规格信息: 字段名称、价格、团购价、划线价、库存、图片
    standards: [ ],
  },

  /** 计算属性 */
  computed: {
    
    // 表单数据
    meta( ) {
      return [
        {
          title: '基本信息',
          desc: ''
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
        }, {
          key: 'tag',
          label: '商品标签',
          type: 'tag',
          max: 2,
          placeholder: `如：补水`,
          value: [ ],
          rules: [{
            validate: val => val.length >= 1,
            message: '至少有一个商品标签'
          }]
        }, {
          key: 'category',
          label: '商品类目',
          type: 'select',
          placeholder: '请设置商品类目',
          value: '0',
          options: this.data.dic['goods_category'] || [ ]
        }, {
          key: 'img',
          label: '商品图片',
          type: 'img',
          max: 6,
          value: [ ],
          rules: [{
            validate: val => val.length >= 1,
            message: '至少上传一张商品图片'
          }]
        }, {
          title: '价格信息',
          desc: ''
        }, {
          key: 'price',
          label: '价格',
          type: 'number',
          placeholder: '商品单价',
          value: undefined,
          rules: [{
            validate: val => !!val && !!val.trim( ),
            message: '请设置商品单价'
          }]
        }, {
          key: 'fadePrice',
          label: '划线价',
          type: 'number',
          placeholder: '建议输入比原价格稍高的价位',
          value: undefined,
          rules: [{
            validate: val => !!val && !!val.trim(),
            message: '请设置商品划线价'
          }]
        }, {
          key: 'groupPrice',
          label: '团购价',
          type: 'number',
          placeholder: '鼓励多个客户在一趟团购行程中同时下单',
          value: undefined
        }, {
          key: 'stock',
          label: '库存',
          type: 'number',
          placeholder: '不填写，则无限库存',
          value: undefined
        }, {
          title: '规格型号',
          desc: ''
        }
      ]
    },

    // 表单数据2
    meta2( ) {
      return [
        {
          title: '其他信息',
          desc: ''
        }, {
          key: 'depositPrice',
          label: '商品订金',
          type: 'number',
          placeholder: '在行程出发前，客户将收到订金收款推送',
          value: undefined
        }, {
          key: 'limit',
          label: '限购数量',
          type: 'number',
          placeholder: '不填或为0，则表示不限购',
          value: undefined
        }, {
          key: 'visiable',
          label: '立即上架',
          type: 'switch',
          value: true
        }
      ]
    },

    // modal按钮
    actions( ) {

      return this.data.selectingStandarIndex !== null ? [{
        name: '取消',
      }, {
        name: '删除',
        color: 'red'
      }, {
        name: '确认',
        color: '#2d8cf0',
      }
      ] : [{
        name: '取消',
      }, {
        name: '确认',
        color: '#2d8cf0',
      }]
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
        success: function (res) {
          that.setData({
            dic: res.result
          });
        },
        fail: function( ) {
          wx.showToast({
            icon: 'none',
            title: '获取数据错误',
          })
        }
      })
    },

    /** 开启关闭规格信息 */
    toogleStandard( ) {
      this.setData({
        selectingStandarIndex: null,
        standarding: !this.data.standarding,
        standarForm: {
          name: null,
          price: null,
          groupPrice: null,
          stock: null,
          img: null
        }
      });
      const imgEle = this.selectComponent('.img-upload');
      imgEle && imgEle.reset( );
    },

    /** 增加编辑型号/规格 */
    addStandard( ) {

      if (Object.keys(this.data.standarForm).filter(k => (k !== 'stock' && k !== 'groupPrice'))
            .some(key => (!this.data.standarForm[ key ] ||!this.data.standarForm[ key ].trim( )))) {
        return wx.showToast({
          icon: 'none',
          title: '请完善型号信息',
        });
      }

      let origin = [...this.data.standards];
      if ( this.data.selectingStandarIndex === null ) {
        origin.push( this.data.standarForm );
      } else {
        origin.splice( this.data.selectingStandarIndex, 1, this.data.standarForm );
      }

      this.setData({
        standards: origin,
        standarding: false,
        standarForm: {
          name: null,
          price: null,
          groupPrice: null,
          stock: null,
          img: null
        }
      });

    },

    /** 型号/规格弹框输入 */
    standarInput( e ) {
      const { currentTarget, detail } = e;
      this.setData({
        standarForm: Object.assign({ }, this.data.standarForm, {
          [ currentTarget.dataset.key ]: detail.value
        })
      });
    },

    /** 型号的图片 */
    onImgChange( e ) {
      const { currentTarget, detail } = e;
      this.setData({
        standarForm: Object.assign({}, this.data.standarForm, {
          [currentTarget.dataset.key]: detail[ 0 ]
        })
      });
    },

    /** 点击modal */
    modalClick({ detail }) {
      const index = detail.index;
      const { selectingStandarIndex } = this.data;
      if ( index === 0 ) {
        this.toogleStandard( );
      } else if ( index === 1 && selectingStandarIndex !== null) {
        this.deleteStandar( );
      } else if ( index === 2 && selectingStandarIndex !== null) {
        this.addStandard();
      } else if ( index === 1 && selectingStandarIndex === null ) {
        this.addStandard();
      }
    },

    /** 点击规格 */
    standarClick({ currentTarget }) {
      const { index } = currentTarget.dataset;
      this.setData({
        standarding: true,
        selectingStandarIndex: index,
        standarForm: this.data.standards[ index ]
      })
    },

    /** 删除规格 */
    deleteStandar( ) {
      const { standards, selectingStandarIndex } = this.data;
      if ( selectingStandarIndex !== null ) {
        const origin = [ ...standards ];
        origin.splice( selectingStandarIndex, 1 );
        this.setData({
          standards: origin
        })
      }
      this.toogleStandard( );
    },

    /** 拉取商品详情s */

    /** 提交当前表单的值 */
    submit( ) {
      const form1 = this.selectComponent('#form1');
      const form2 = this.selectComponent('#form2');
      const r1 = form1.getData();
      const r2 = form2.getData( );

      if ( !r1.result || !r2.result ) {
        return wx.showToast({
          icon: 'none',
          title: '请完善商品信息',
        })
      }

      const goodsDetail = {
        ...r1.data,
        ...r2.data,
        saled: 0,
        standards: this.data.standards,
        createTime: new Date().getTime( ),
        updateTime: new Date().getTime()
      };
      
      wx.cloud.callFunction({
        name: 'api-goods-create',
        data: {
          data: goodsDetail,
        },
        success: function (res) {
          if ( res.result.status === 200 ) {
            wx.showToast({
              title: '创建成功！'
            })
          }
        },
        fail: function () {
          wx.showToast({
            icon: 'none',
            title: '获取数据错误',
          })
        }
      })

    }

  },

  attached: function () {
    this.fetchDic( );
  }

})
