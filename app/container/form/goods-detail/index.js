const { http } = require('../../../util/http.js');
const { computed } = require('../../../lib/vuefy/index.js');
const { navTo } = require('../../../util/route.js');

/**
 * ! 数值之间的关系校验，如：团购价必须大于原价
 */
Component({

  behaviors: [require('../../../behaviores/computed/index.js')],
  /**
   * 组件的属性列表
   */
  properties: {
    // 商品id
    pid: {
      type: String,
      value: '',
      observer: 'fetchDetail'
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
      pid: null,
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
    // 详情 - 已上传的图片列表
    hasBeenUploaded: [ ],
    // 详情 - 商品类目
    category: '0'
  },

  /**
   * 组件的方法列表
   */
  methods: {

    runComputed( ) {
         computed( this, {
    
            // 表单数据
            meta( ) {
              
              const meta = [
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
                  value: this.data.category,
                  options: this.data.dic['goods_category'] || [ ]
                }, {
                  key: 'img',
                  label: '商品图片',
                  type: 'img',
                  max: 6,
                  canAdjust: true,
                  value: this.data.hasBeenUploaded,
                  rules: [{
                    validate: val => val.length >= 1,
                    message: '至少上传一张商品图片'
                  }]
                }, {
                  title: '价格信息',
                  desc: ''
                }, {
                  key: 'fadePrice',
                  label: '划线价',
                  type: 'number',
                  placeholder: '建议输入比原价格稍高的价位',
                  value: undefined,
                  rules: [{
                    validate: val => !!val,
                    message: '请设置商品划线价'
                  }, {
                    validate: val => Number( val ) > 0,
                    message: '划线价不能为0'
                  }]
                }, {
                  title: '规格型号',
                  desc: ''
                }
              ];
        
              if ( this.data.standards.length === 0 ) {
                meta.splice( 7, 0, {
                  key: 'price',
                  label: '价格',
                  type: 'number',
                  placeholder: '商品单价',
                  value: undefined,
                  rules: [{
                    validate: val => !!val,
                    message: '请设置商品单价'
                  }, {
                    validate: val => Number( val ) > 0,
                    message: '价格不能为0'
                  }]
                });
                meta.splice( 9, 0, {
                  key: 'groupPrice',
                  label: '团购价',
                  type: 'number',
                  placeholder: '鼓励多个客户在一趟团购行程中同时下单',
                  value: undefined,
                  rules: [{
                    validate: val => val !== null && val !== undefined && !!String( val ).trim( ) ? Number( String( val ).trim( )) > 0 : true,
                    message: '价格不能为0'
                  }]
                });
                meta.splice( 10, 0, {
                  key: 'stock',
                  label: '库存',
                  type: 'number',
                  placeholder: '不填写，则无限库存',
                  value: undefined
                })
              }
        
              return meta;
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
                  value: false
                }
              ]
            },
        
            // modal按钮
            actions( ) {
              
              const { selectingStandarIndex } = this.data;
              const meta = selectingStandarIndex !== null ? [{
                name: '取消',
                }, {
                  name: '删除',
                  color: 'red'
                }, {
                  name: '确认',
                  color: '#2d8cf0',
                }] : [{
                  name: '取消',
                }, {
                  name: '确认',
                  color: '#2d8cf0',
                }];
                return meta;
            }
        })
    },

    /** 拉取数据字典 */
    fetchDic( ) {
      http({
          data: {
            dicName: 'goods_category',
          },
          errMsg: '加载失败，请重试',
          url: `common_dic`,
          success: res => {
            if ( res.status !== 200 ) { return; }
            this.setData({
              dic: res.data
            });
          }
      });
    },

    /** 开启关闭规格信息 */
    toogleStandard( ) {
      this.setData({
        selectingStandarIndex: null,
        standarding: !this.data.standarding,
        standarForm: {
          pid: null,
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
      const errMsg = title => {
        return wx.showToast({
          title,
          icon: 'none',
        });
      }
      const { name, img, price, groupPrice } = this.data.standarForm;
   
      if ( !name || !name.trim( )) {
        return errMsg('请填写型号名称');
      }

      if ( price === undefined || price === null || !String( price ).trim( )) {
        return errMsg('请填写价格');
      } 

      if ( price !== undefined && price !== null  && Number( price ) <= 0 ) {
        return errMsg('价格不能为0');
      }

      if ( groupPrice !== undefined && groupPrice !== null  && Number( groupPrice ) <= 0 ) {
        return errMsg('价格不能为0');
      }

      if ( !img ) {
        return errMsg('请上传型号图片');
      }

      let origin = [...this.data.standards ];
      if ( this.data.selectingStandarIndex === null ) {
        origin.push( this.data.standarForm );
      } else {
        origin.splice( this.data.selectingStandarIndex, 1, this.data.standarForm );
      }

      this.setData({
        standards: origin,
        standarding: false,
        standarForm: {
          pid: null,
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
      const { standarForm } = this.data;
      const { currentTarget, detail } = e;

      if ( detail[ 0 ] === standarForm.img ) { return; }

      this.setData({
        standarForm: Object.assign({ }, standarForm, {
          img: detail[ 0 ]
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

    /** 点击modal */
    modalClick2({ detail }) {
      const index = detail.index;
      const { selectingStandarIndex } = this.data;
      if ( index === 0 ) {
        this.toogleStandard2( );
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
      });
      
      const imgEle = this.selectComponent('.img-upload');
      imgEle && imgEle.reset( );
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

    /** 拉取商品详情 */
    fetchDetail( id ) {
      const that = this;
      if ( !id ) { return; }

      http({
        data: {
            _id: id,
        },
        errMsg: '获取商品错误，请重试',
        url: `good_detail`,
        success: res => {
            if ( res.status !== 200 ) { return; }
            const { title, detail, tag, category, img, fadePrice, price,
              groupPrice, stock, standards, depositPrice, limit, visiable } = res.data;

            const form1 = that.selectComponent('#form1');
            const form2 = that.selectComponent('#form2');

            that.setData({
              standards,
              category,
              hasBeenUploaded: img
            });

            form1 && form1.set({
              tag,
              img,
              title,
              stock,
              price,
              detail,
              category,
              fadePrice,
              groupPrice
            });

            form2 && form2.set({
              limit,
              visiable,
              depositPrice
            })
          }
      });
    },

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

      // 这里有点奇怪 number 如果是带 小数点的 会返回 string，因此做个特殊处理
      const standards$ = this.data.standards.map( x => {
        return Object.assign({ }, x, {
          groupPrice: ( x.groupPrice === null || x.groupPrice === undefined ) ? x.groupPrice : Number( x.groupPrice ),
          price: ( x.price === null || x.price === undefined ) ? x.price : Number( x.price ),
          stock: ( x.stock === null || x.stock === undefined ) ? x.stock : Number( x.stock )
        });
      });

      let goodsDetail = {
        ...r1.data,
        ...r2.data,
        saled: 0,
        standards: standards$,
        updateTime: new Date( ).getTime( ),
      };

      const _id = this.data.pid;

      if ( !_id ) {
          isDelete: false,
          goodsDetail = Object.assign({ }, goodsDetail, {
            createTime: new Date( ).getTime( )
          });
      } else {
          goodsDetail = Object.assign({ }, goodsDetail, {
            _id,
            isDelete: false,
          });
      }

      http({
          data: goodsDetail,
          loadingMsg: _id ? '更新中...' : '创建中..',
          errMsg: _id ? '更新失败' : '创建失败',
          url: `good_edit`,
          success: res => {
            if ( res.status !== 200 ) { return; }
            wx.showToast({
                title: _id ? '更新成功' : '创建成功'
            });

            if ( !_id ) {
              navTo(`/pages/manager-goods-list/index?newPid=${res.data}`)
            }
          }
      });

    },

    /** 删除该商品 */
    deleteGood( ) {
      wx.showModal({
        title: '提示',
        content: '确定删除此商品吗？',
        success: res => {
          if ( res.confirm ) {
            const { pid } = this.data;
            http({
              data: { 
                pid
              },
              url: 'good_delete',
              success: res => {
                const { status, data } = res;
                if ( status === 200 ) {
                  navTo(`/pages/manager-goods-list/index?newPid=${pid}`)
                }
              }
            });
          }
        }
      });
    }

  },

  attached: function () {
    this.fetchDic( );
    this.fetchDetail( );
    this.runComputed( )
  }

})
