// container/product-selector/index.js
Component({
    /**
     * 组件的属性列表
     */
    properties: {
        // 是否展开
        show: {
            type: Boolean,
            value: false,
            observer: 'setShow'
        }
    },

    /**
     * 组件的初始数据
     */
    data: {
        // 是否展开
        show$: false,
        // 搜索字段
        search: ''
    },

    /**
     * 组件的方法列表
     */
    methods: {

        /** 点击确定 */
        onOk( ) {
            console.log('ok');
        },

        /** 点击取消 */
        onCancel( ) {
            this.triggerEvent('close');
        },

        /** 设置展开 */
        setShow( val ) {
            this.setData({
                show$: val
            });
        }
    }
})
