
Component({
    /**
     * 组件的属性列表
     */
    properties: {
        // sign，可无，用于列表区分
        sign: {
            type: String,
            value: ''
        },
        // 背景颜色
        color: {
            type: String,
            value: '#19b391'
        },
        // 激活颜色
        activecolor: {
            type: String,
            value: '#19b391'
        },
        // 目前的值
        value: {
            type: Boolean,
            required: true,
            observer: 'checkValue'
        },
        // 选项
        options: {
            type: Array,
            value: [ ]
        }
    },

    /**
     * 组件的初始数据
     */
    data: {
        /** 下标值 */
        active: 0
    },

    /**
     * 组件的方法列表
     */
    methods: {

        /** 点击tab */
        onTab( ) {
            const { sign } = this.data;
            const target = this.data.options.find( x => x.value !== this.data.value );
            if ( !sign ) {
                this.triggerEvent('change', target.value );
            } else {
                this.triggerEvent('change', {
                    sign,
                    value: target.value
                });
            }
        },

        /** 根据value改变圆的位置 */
        checkValue( ) {
            const targetIndex = this.data.options.findIndex( x => x.value !== this.data.value );
            this.setData({
                active: targetIndex
            });
        }
    },

    attached: function( ) {
        this.checkValue( );
    }
})
