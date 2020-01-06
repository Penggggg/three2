const { computed } = require('../../lib/vuefy/index.js');

// 左上角的弹幕
Component({
    /**
     * 组件的属性列表
     */
    properties: {

        /** 
         * 数据
         * {
         *   avatar?: string,
         *   text: string
         * }[ ]
         */
        data: {
            type: Array,
            value: [ ]
        },

        /**
         * 头像大小
         */
        avatarSize: {
            type: Number,
            value: 70
        },

        /**
         * 文字宽度基数
         */
        letterSize: {
            type: Number,
            value: 24
        },

        /**
         * 左上角位置
         */
        left: {
            type: Number,
            value: 0,
        },

        /**
         * 右上角位置
         */
        top: {
            type: Number,
            value: 50
        },

        /**
         * 上方位置
         */
        right: {
            type: Number,
            value: 0,
        }

    },

    /**
     * 组件的初始数据
     */
    data: {
        current: 0
    },

    /**
     * 组件的方法列表
     */
    methods: {
        runComputed( ) {
            computed( this, {
                // 计算宽度
                width$: function( ) {
                    const { current, data, letterSize, avatarSize } = this.data;
                    const target = data[ current ];
                    if ( !target ) { return 0; }
                    const avatarWdith = target.avatar ? avatarSize + 30 : 0;
                    const r = avatarWdith + letterSize * target.text.length - 20;
                    return r;
                }
            });
        },
        onChange({ detail }) {
            this.setData({
                current: detail.current
            });
        },

    },

    attached: function( ) {
        this.runComputed( );
    }

})
