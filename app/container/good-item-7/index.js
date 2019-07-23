const { navTo } = require('../../util/route.js');
const { createFormId } = require('../../util/form-id.js');

/**
 * @description
 * 沾满一行的商品框，积分推广的商品列表
 */
Component({

    behaviors: [require('../../behaviores/computed/index.js')],
    /**
     * 组件的属性列表
     */
    properties: {
        // 商品详情
        good: {
            type: Object,
            observer: 'dealDetail'
        },
        // 能否分享
        canShare: {
            type: Boolean,
            value: false
        }
    },

    /**
     * 组件的初始数据
     */
    data: {
        // 标签名
        tag: ''
    },

    computed: {

    },

    /**
     * 组件的方法列表
     */
    methods: {

        // 处理商品
        dealDetail: function( ) {
            const { good } = this.data;
            this.setData({
                tag: good ? good.tag.map( x => `#${x}`).join(' ') : ''
            })
        },

        // 详情
        goDetail( e ) {
            createFormId( e.detail.formId );
            const { _id } = this.data.good;
            navTo(`/pages/goods-detail/index?id=${_id}&tid=${this.data.tid}`)
        }

    }
})