// container/test/index.js
Component({
    /**
     * 组件的属性列表
     */
    properties: {
        scroll: {
            type: Boolean,
            value: false
          },
          isShow: {
            type: Boolean,
            value: true
          },
          notice: {
            type: String,
            value: ''
          },
          bgColor: {
            type: String,
            value: '#ff5777' // 通告栏背景色
          },
          color: {
            type: String,
            value: '#fff' // 文字颜色
          },
          showIcon: {
            type: Boolean,
            value: false
          },
          iconColor: {
            type: String,
            value: '#fff'
          },
          close: {
            type: Boolean,
            value: false
          },
          bgRgba: {
            type: String,
            value: 'rgba(255, 85, 119, 0)' // 背景颜色的rgba形式，a的值为0，配合close使用
          }
    },
  
    /**
     * 组件的初始数据
     */
    data: {
  
    },
  
    /**
     * 组件的方法列表
     */
    methods: {
        onDismissNotice(event) {
            this.setData({
              isShow: false
            });
            let detail = event.detail;
            let option = {};
            this.triggerEvent('close', detail, option);
          }
    }
  })
  