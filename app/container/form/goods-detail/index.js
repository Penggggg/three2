
const app = getApp( );
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
        },

        // 主推商品id
        spid: {
          type: String,
          value: '',
          observer: 'fetchSuperDetail'
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
                const { category } = this.data;

                const meta = [
                  {
                    title: '基本信息',
                    desc: ''
                  }, {
                    key: 'title',
                    label: '商品名称',
                    type: 'input',
                    max: 50,
                    placeholder: '如：YSL莹亮纯魅唇膏',
                    value: undefined,
                    rules: [{
                      validate: val => !!val,
                      message: '商品名称不能为空'
                    }]
                  }, {
                    key: 'detail',
                    label: '商品描述',
                    type: 'textarea',
                    placeholder: `一段介绍（回车换行）`,
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
                    value: category,
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
                      message: '上传一张图片（白底效果好）'
                    }]
                  }, {
                    title: '价格信息',
                    desc: ''
                  }, {
                    key: 'fadePrice',
                    label: '淘宝价',
                    type: 'number',
                    placeholder: '比售价稍高，用于客户对比',
                    value: undefined,
                    rules: [{
                      validate: val => !!val,
                      message: '请设置商品淘宝价'
                    }, {
                      validate: val => Number( val ) > 0,
                      message: '淘宝价不能为0'
                    }]
                  }, {
                    title: '规格型号',
                    desc: '无型号 则不填写'
                  }
                ];
          
                if ( this.data.standards.length === 0 ) {
                  meta.splice( 7, 0, {
                    key: 'price',
                    label: '单买价',
                    type: 'number',
                    placeholder: '如：128',
                    value: undefined,
                    rules: [{
                      validate: val => !!val,
                      message: '请设置商品单价'
                    }, {
                      validate: val => Number( val ) > 0,
                      message: '价格不能为0'
                    }]
                  });
                  meta.splice( 8, 0, {
                    key: 'groupPrice',
                    label: '拼团价',
                    type: 'number',
                    placeholder: '让客户相互分享、多下单',
                    value: undefined,
                    rules: [{
                      validate: val => !!val,
                      message: '请设置拼团价'
                    }, {
                      validate: val => Number( val ) > 0,
                      message: '拼团价不能为0'
                    }]
                  });
                  // meta.splice( 10, 0, {
                  //   key: 'stock',
                  //   label: '库存',
                  //   type: 'number',
                  //   placeholder: '不填则无限制',
                  //   value: undefined
                  // })
                }
          
                return meta;
              },
          
              // 表单数据2
              meta2( ) {
                
                return [
                  {
                    title: '其他信息',
                    desc: ''
                  }
                  // , {
                  //   key: 'depositPrice',
                  //   label: '商品订金',
                  //   type: 'number',
                  //   placeholder: '先付订金，后付尾款',
                  //   value: undefined
                  // }
                  , {
                    key: 'limit',
                    label: '限购数量',
                    type: 'number',
                    placeholder: '不填则不限购',
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
        const imgEle = this.selectComponent('.img-s-upload');
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

        if ( groupPrice === undefined || groupPrice === null || !String( groupPrice ).trim( )) {
          return errMsg('请填写拼团价');
        } 

        if ( groupPrice !== undefined && groupPrice !== null  && Number( groupPrice ) <= 0 ) {
          return errMsg('拼团价不能为0');
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
          this.addStandard( );
        } else if ( index === 1 && selectingStandarIndex === null ) {
          this.addStandard( );
        }
      },

      /** 点击规格 */
      standarClick({ currentTarget }) {
        const { index } = currentTarget.dataset;      
        setTimeout(( ) => {
          const imgEle = this.selectComponent('.img-s-upload');
          imgEle && imgEle.reset( );
          setTimeout(( ) => {
            this.setData({
              standarding: true,
              selectingStandarIndex: index,
              standarForm: this.data.standards[ index ]
            });
          }, 20 )
        }, 20 )
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
                // stock,
                price,
                detail,
                category,
                fadePrice,
                groupPrice
              });

              form2 && form2.set({
                limit,
                visiable,
                // depositPrice
              })
            }
        });
      },

      /** 拉取主推商品详情 */
      fetchSuperDetail( spid ) {
        if ( !spid ) { return; }
        // 以pid为最高权重，而不是spid
        if ( !!this.data.pid ) { return; }

        http({
          data: {
              body: { 
                spid
              },
              url: 'super-goods_detail'
          },
          url: 'common_core-app-api',
          success: res => {
              if ( res.status !== 200 ) { return; }
              const { title, detail, tag, category, img, fadePrice } = res.data;

              const form1 = this.selectComponent('#form1');

              this.setData({
                category,
                hasBeenUploaded: img
              });

              form1 && form1.set({
                tag,
                title,
                detail,
                fadePrice
              });

            }
        });
      },

      /** 检查、并返回商品数据 */
      check( ) {
        const form1 = this.selectComponent('#form1');
        const form2 = this.selectComponent('#form2');
        const r1 = form1.getData();
        const r2 = form2.getData( );

        if ( !r1.result || !r2.result ) {
          wx.showToast({
            icon: 'none',
            title: '请完善商品信息',
          });
          return null;
        }

        // 这里有点奇怪 number 如果是带 小数点的 会返回 string，因此做个特殊处理
        const standards$ = this.data.standards.map( x => {
          return {
            ...x,
            groupPrice: ( x.groupPrice === null || x.groupPrice === undefined ) ? x.groupPrice : Number( x.groupPrice ),
            price: ( x.price === null || x.price === undefined ) ? x.price : Number( x.price ),
            stock: ( x.stock === null || x.stock === undefined ) ? x.stock : Number( x.stock )
          };
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
            goodsDetail = {
              ...goodsDetail,
              createTime: new Date( ).getTime( )
            };
        } else {
            goodsDetail = {
              ...goodsDetail,
              _id,
              isDelete: false,
            };
        }

        // 自动设置订金
        if ( !!goodsDetail.groupPrice ) {
          goodsDetail = {
            ...goodsDetail,
            depositPrice: Number(( goodsDetail.groupPrice * 0.5 ).toFixed( 2 ))
          }
        } else if ( Array.isArray( goodsDetail.standards ) && goodsDetail.standards.length > 0 ) {
          // 拿到最便宜的拼团价
          const sort = standards$
            .filter( x => !!x.groupPrice )
            .sort(( x, y ) => x.groupPrice - y.groupPrice );
          
          goodsDetail = {
            ...goodsDetail,
            depositPrice: Number(( sort[ 0 ].groupPrice * 0.5 ).toFixed( 2 ))
          }
        } else {
          goodsDetail = {
            ...goodsDetail,
            depositPrice: 5
          }
        }
        return goodsDetail;
      },

      /** 提交当前表单的值 */
      submit( ) {
        const { pid, spid } = this.data;
        let data = this.check( );
        if ( !data ) { return; }
    
        data = {
          ...data,
          spid
        }

        http({
            data,
            loadingMsg: pid ? '更新中...' : '创建中..',
            errMsg: pid ? '更新失败' : '创建失败',
            url: `good_edit`,
            success: res => {
              if ( res.status !== 200 ) { return; }
              this.initForm( );
              wx.showToast({
                  title: pid ? '更新成功' : '创建成功'
              });

              wx.redirectTo({
                url: `/pages/manager-goods-list/index`
            });
            }
        });

      },

      /** 预览 */
      preview( ) {
        const { spid } = this.data;
        const data = this.check( );

        if ( !data ) { return; }
        app.setGlobalData({
          editingGood: data
        });

        setTimeout(( ) => {
          navTo(`/pages/goods-detail-preview/index?spid=${ spid || '' }`)
        }, 20 );
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
                    navTo(`/pages/manager-goods-list/index`)
                  }
                }
              });
            }
          }
        });
      },

      /** 初始化商品详情 */
      initForm( ) {
        const form1 = this.selectComponent('#form1');
        const form2 = this.selectComponent('#form2');
        form1 && form1.reset( );
        form2 && form2.reset( );
        this.setData({
          standards: [ ],
          hasBeenUploaded: [ ],
          selectingStandarIndex: null,
        });
      },

      /** 表单1 */
      onForm1Change({ detail }) {
        const { img } = detail;
        const { hasBeenUploaded } = this.data;
        
        const needUpdate = img.some(( x, k ) => {
          return x !== hasBeenUploaded[ k ];
        });

        needUpdate && this.setData({
          hasBeenUploaded: img
        });
      }

    },

    attached: function ( ) {
      this.fetchDic( );
      this.runComputed( )
    }

})
