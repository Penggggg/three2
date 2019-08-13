const { computed } = require('../../lib/vuefy/index.js');

Component({
    /**
     * 组件的属性列表
     */
    properties: {
        title: {
            type: String,
            value: ''
        },
        left: {
            type: String,
            value: '1'
        },
        right: {
            type: String,
            value: '2'
        }
    },

    /**
     * 组件的初始数据
     */
    data: {
        imgBaseUrl: `https://global-1257764567.cos.ap-guangzhou.myqcloud.com/icon-decorate`
    },

    /**
     * 组件的方法列表
     */
    methods: {
        runComputed( ) {
            computed( this, {
                left$: function( ) {
                    const { imgBaseUrl, left } = this.data;
                    return `${imgBaseUrl}-${left}.png`
                }, 
                right$: function( ) {
                    const { imgBaseUrl, right } = this.data;
                    return `${imgBaseUrl}-${right}.png`
                }
            })
        }
    },
    attached: function( ) {
        this.runComputed( );
    }
})
