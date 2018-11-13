// components/active-form/index.js
Component({
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
      })
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
    }

  },

  attached: function( ) {
    this.dealFormData( );
  }

})
