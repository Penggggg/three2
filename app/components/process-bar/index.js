const { computed } = require('../../lib/vuefy/index.js');

Component({
    /**
     * 组件的属性列表
     */
    properties: {
        total: {
            type: Number,
            value: 100
        },
        current: {
            type: Number,
            value: 0
        },
        showRate: {
            type: Boolean,
            value: true
        },
        valText: {
            type: String,
            value: ''
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
        runComputed( ) {
            computed( this, {
                rate$: function( ) {
                    const { total, current } = this.data;
                    return ( current / total ).toFixed( 1 );
                },
                text$: function( ) {
                    const { total, current } = this.data;
                    return Number(( current / total ).toFixed( 1 )) * 100 + '%';
                }
            });
        }
    },

    attached: function( ) {
        this.runComputed( );
    }
})
