
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
                  if ( !search ) {
                        return wx.showToast({
                              icon: 'none',
                              title: '未输入内容哦'
                        })
                  }
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
            
      }
})
