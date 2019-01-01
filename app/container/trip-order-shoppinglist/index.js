const { http } = require('../../util/http.js');

Component({
    /**
     * 组件的属性列表
     */
    properties: {
        // 行程id
        tid: {
            value: '',
            type: String,
            observer: 'fetchDetail'
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
        fetchDetail( tid ) {

        }
    },

    attached: function( ) {

    }
})
