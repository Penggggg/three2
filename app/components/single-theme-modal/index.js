
Component({
    /**
     * 组件的属性列表
     */
    properties: {
        // 是否展示
        show: {
            type: Boolean,
            value: false,
            observer: 'onShow' 
        },
        // 标题文案（小）
        title: {
            type: String,
            value: ''
        },
        // 主体文案
        content: {
            type: String,
            value: ''
        },
        // 还有一个slot
    },

    /**
     * 组件的初始数据
     */
    data: {
        status: 'hide'
    },

    /**
     * 组件的方法列表
     */
    methods: {
        onShow( val ) {
            this.setData({
                status: !!val ? 'show' : 'hide'
            })
        },
        toggleTips2( e = { detail: null }) {
            const { status } = this.data;
            this.setData({
                status: status === 'show' ? 'hide' : 'show'
            });
            this.triggerEvent('toggle', status === 'show' ? false : true );
        }
    },

    attached: function( ) {
    }
})
