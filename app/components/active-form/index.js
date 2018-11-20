// components/active-form/index.js
Component({

  behaviors: [require('../../behaviores/computed/index.js')],

  /**
   * 组件的属性列表
   */
  properties: {
    meta: {
      type: Array,
      value: [ ],
      observer: 'dealFormData'
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    // 编辑标签
    tagging: false,
    // 表单数据
    formData: { },
    // 错误信息
    errData: { },
    // 正在选中的标签
    selectingTagIndex: null,
    // 选中标签的文字
    selecingTag: '',
    // 标签类型的选中的那个标签key
    selectingTagKey: '',
    // select类型的下标
    selectFormItemIndex: { }
  },

  /**
   * 计算属性
   */

  computed: {
    // modal按钮
    actions() {

      return this.data.selectingTagIndex !== null ? [{
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

    /** swithc/文本输入 */
    textInput( e ) {
      const formItemKey = e.currentTarget.dataset.key;
      const value = e.detail.value;
      this.setData({
        formData: Object.assign({ }, this.data.formData, {
          [ formItemKey ]: value 
        })
      });
      this.validateItem( formItemKey );
    },

    /** select输入 */
    selectChange( e ) {
      const value = e.detail.value;
      const formItemKey = e.currentTarget.dataset.formkey;
      const formItem = this.data.meta.find( x => x.key === formItemKey );
      this.setData({
        formData: Object.assign({ }, this.data.formData, {
          [ formItemKey ]: value 
        }),
        selectFormItemIndex: Object.assign({ }, this.data.selectFormItemIndex, {
          [ formItemKey ]: formItem.options.findIndex( x => x.value === value )
        })
      })
      this.validateItem( formItemKey );
    },

    /** 展开tag */
    toogleTag( e ) {
      const { tagkey, tagindex } = e.currentTarget.dataset;
      if ( tagkey ) {
        this.setData({
          selectingTagKey: tagkey,
          tagging: !this.data.tagging,
          selectingTagIndex: tagindex !== undefined ? tagindex : null,
          selecingTag: tagindex !== undefined ? this.data.formData[tagkey][tagindex] : ''
        });
      } else {
        this.setData({
          tagging: false,
          selectingTagKey: '',
          selectingTagIndex: null,
          selecingTag: ''
        })
      }
      
    },

    /** 编辑/增加标签 */
    editOrCreateTag( ) {
      const { selectingTagIndex, selectingTagKey, selecingTag, formData } = this.data;
      // 新增
      if ( selectingTagIndex === null ) {
        this.setData({
          formData: Object.assign({ }, formData, {
            [ selectingTagKey ]: [ ...formData[ selectingTagKey ], selecingTag ]
          })
        });
      } else {
        // 编辑
        const origin = formData[ selectingTagKey ];
        origin.splice( selectingTagIndex, 1, selecingTag );
        this.setData({
          formData: Object.assign({}, formData, {
            [ selectingTagKey ]: origin
          })
        })
      }
      this.setData({
        tagging: false,
        selecingTag: '',
      });
      this.validateItem( selectingTagKey );
    },

    /** 编辑ing标签 */
    editingTag( e ) {
      this.setData({
        selecingTag: e.detail.value
      })
    },

    /** 处理本地formData */
    dealFormData( ) {
      let selectTypeIndex = { };
      let obj = Object.assign({ }, this.formData );
      this.data.meta.map( formItem => {
        if ( !!formItem.key ) {
          // 处理formData
          obj = Object.assign({ }, obj, {
            [ formItem.key ]: this.data.formData[ formItem.key ] !== undefined ?
              this.data.formData[ formItem.key] :
              Array.isArray( formItem.value) ?
                [ ...formItem.value ] : 
                typeof formItem.value === 'object' && typeof formItem.value.getTime !== 'function' ?
                  Object.assign({ }, formItem.value ) :
                  formItem.value
          });
          // 处理select类型
          if ( formItem.type === 'select' ) {
            selectTypeIndex = Object.assign({ }, selectTypeIndex, {
              [ formItem.key ]: formItem.options.findIndex( x => x.value === formItem.value )
            });
          }
        }

      });
      this.setData({
        formData: obj,
        selectFormItemIndex: selectTypeIndex
      });
    },

    /** 图片上传 */
    onImgChange( e ) {
      const key = e.currentTarget.dataset.key;
      this.setData({
        formData: Object.assign({ }, this.data.formData, {
          [ key ]: e.detail
        })
      });
      this.validateItem( key );
    },

    /** 全部表单校验 */
    validate( ) {
      const validateItemResult = Object.keys( this.data.formData ).map( k => {
        return this.validateItem( k );
      }).filter( x => x !== undefined );

      return {
        data: this.data.formData,
        err: this.data.errData,
        result: !validateItemResult.some(x => !x)
      }
    },

    /** 单个表单校验 */
    validateItem( key ) {
      const formItem = this.data.meta.find( x => x.key === key );
      if ( !formItem || !formItem.rules || !formItem.key || !formItem.rules.length === 0 ) { return; }
      const isExistedErr = formItem.rules.some( rule => {
        const result = rule.validate( this.data.formData[ key ], this.data.formData );
        if ( !result ) {
          this.data.errData = Object.assign({}, this.data.errData, {
            [key]: rule.message
          });
          this.setData({
            errData: Object.assign({ }, this.data.errData, {
              [ key ]: rule.message
            })
          })
        } else {
          delete this.data.errData[ key ];
          this.setData({
            errData: this.data.errData
          });
        }
        return !result;
      });
      return !isExistedErr;
    },

    /** public - 校验并拿到校验结果 */
    getData( ) {
      return this.validate( );
    },

    /** 点击modal */
    modalClick({ detail }) {
      
      const index = detail.index;
      const { selectingTagIndex } = this.data;
      if (index === 0) {
        this.setData({
          tagging: false,
          selectingTagKey: '',
          selectingTagIndex: null,
          selecingTag: ''
        });
      } else if (index === 1 && selectingTagIndex !== null) {
        this.deleteTag();
      } else if (index === 2 && selectingTagIndex !== null) {
        this.editOrCreateTag();
      } else if (index === 1 && selectingTagIndex === null) {
        this.editOrCreateTag();
      }
    },

    /** 删除标签 */
    deleteTag() {
      const { selectingTagIndex, selectingTagKey, formData, selecingTag } = this.data;
      if (selectingTagIndex !== null) {
        const origin = formData[selectingTagKey];
        origin.splice(selectingTagIndex, 1 );
        this.setData({
          tagging: false,
          selectingTagKey: '',
          selectingTagIndex: null,
          selecingTag: '',
          formData: Object.assign({}, formData, {
            [selectingTagKey]: origin
          })
        })
      }
    },

    // 设置表单
    set( obj ) {
      this.setData({
        formData: Object.assign({ }, this.data.formData, { ...obj })
      });
      Object.keys( obj ).map( k => this.validateItem( k ));
    }

  },

  attached: function( ) {
    this.dealFormData( );
  }

})
