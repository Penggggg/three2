const app = getApp( );

/**
 * 分享反馈组件
 */
Component({
    /**
     * 组件的属性列表
     */
    properties: {

        /**
         * 行程
         */
        tid: {
            type: String,
            value: ''
        },

        /**
         * 商品
         */
        pid: {
            type: String,
            value: ''
        },

        /**
         * 可省下多少钱
         */
        discount: {
            type: Number,
            value: 0
        }

    },

    /**
     * 组件的初始数据
     */
    data: {

        /**
         * 展示弹框
         */
        showModal: 'hide',

        /**
         * 是否为第一次分享
         */
        isFirst: false

    },

    /**
     * 组件的方法列表
     */
    methods: {

        /**
         * 监听打开
         */
        onShow( v ) {
            this.setData({
                showModal: !!v ? 'show' : 'hide'
            });
        },

        /**
         * 组件内开关
         */
        toggle( ) {
            const { showModal } = this.data;
            this.setData({
                showModal: showModal === 'show' ? 'hide' : 'show'
            });
            showModal === 'show' && this.onSubscribe( );
        },

        /**
         * 订阅
         */
        onSubscribe( ) {
            app.getSubscribe('buyPin,waitPin,trip');
        },

    },

    attached: function( ) {

    }
})
