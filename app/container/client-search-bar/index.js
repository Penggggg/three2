const app = getApp( );

Component({
      /**
       * 组件的属性列表
       */
      properties: {
            // 输入值
            value: {
                  type: String,
                  value: '',
                  observer: 'onValue'
            },
            initfocus: {
                  type: Boolean,
                  value: true
            },
            // 简单模式 - 看起来小一点
            simple: {
                  type: Boolean,
                  value: false
            }
      },

      /**
       * 组件的初始数据
       */
      data: {
            // 搜索值
            search: '',
            focus: true
      },

      /**
       * 组件的方法列表
       */
      methods: {

            /** 监听props */
            onValue( val ) {
                  this.setData({
                        search: val
                  });
                  const value = val.replace(/\s+/g, '');
                  this.triggerEvent('change', value );
            },

            /** 监听输入 */
            onInput({ detail }) {
                  const value = detail.value.replace(/\s+/g, '');
                  this.setData({
                        search: value
                  });
                  this.triggerEvent('change', value );
            },

            /** 监听关闭 */
            onClose( ) {
                  this.setData({
                        search: '',
                        focus: true
                  });
            },

            /** 确定 */
            onConfirm( ) {
                  const { search } = this.data;
                  this.triggerEvent('confirm', search );
            },

            /** 失去焦点 */
            onBlur( ) {
                  this.setData({
                        focus: false
                  });
            },

            /** 获取焦点 */
            onFocus( ) {
                  this.setData({
                        focus: true
                  });
            }
            
      },

      attached: function( ) {
            this.setData({
                  focus: this.data.initfocus
            })
      }
})
