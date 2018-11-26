// container/test/index.js
Component({
    /**
     * 组件的属性列表
     */
    properties: {
        color: {
            type: String,
            value: '#ff5777'
          },
          number: {
            type: [Number, String],
            value: 0,
            observer: function (newVal) {
              this.setData({
                number: parseInt(newVal, 10)
              })
            }
          },
          max: {
            type: [Number, String],
            value: 1,
            observer: function (newVal) {
              this.setData({
                max: parseInt(newVal, 10)
              })
            }
          },
          min: {
            type: [Number, String],
            value: 0,
            observer: function (newVal) {
              this.setData({
                min: parseInt(newVal, 10)
              })
            }
          },
          disabled: {
            type: Boolean,
            value: false
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
        addHandler (e) {
            let min = this.data.min;
            let max = this.data.max;
            let disabled = this.data.disabled;
            if (max <= this.data.number || disabled) return;
            this.setData({
              number: ++this.data.number
            })
            this.triggerEvent('changenumber', {
              e,
              number: this.data.number,
              min,
              max,
              type: 'add'
            });
          },
          minusHandler (e) {
              let min = this.data.min;
              let max = this.data.max;
              let disabled = this.data.disabled;
              if (min >= this.data.number || disabled) return;
              this.setData({
                number: --this.data.number
              });
              this.triggerEvent('changenumber', {
                e,
                number: this.data.number,
                min,
                max,
                type: 'minus'
              });
          }
    }
  })
  