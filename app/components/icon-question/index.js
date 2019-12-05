
/**
 * @description
 * 一个圆形的问号图标
 */
Component({
    /**
     * 组件的属性列表
     */
    properties: {
        /**
         * 颜色
         */
        color: {
            type: String,
            value: '#6cd6d7'
        },
        /**
         * 尺寸
         */
        size: {
            type: Number,
            value: 22,
            observer: 'onSize'
        },
        /**
         * 颜色反转
         */
        invert: {
            type: Boolean,
            value: false
        }
    },

    /**
     * 组件的初始数据
     */
    data: {
        roundSize: 27
    },

    /**
     * 组件的方法列表
     */
    methods: {
        onSize( val ) {
            this.setData({
                roundSize: val + 5
            });
        }
    }
})
