const { navTo } = require('../../util/route.js');

/**
 * @description
 * 一行占两格或者2.5格的，单个商品框，用在行程入口的热门推荐、普通商品列表
 */
Component({
    /**
     * 组件的属性列表
     */
    properties: {
        // 商品详情
        good: {
            type: Object,
            observer: 'dealDetail'
        },
        // 显示更窄
        thin: {
            type: Boolean,
            value: false
        },
        // 当前行程
        tid: {
            type: String,
            value: ''
        }
    },

    /**
     * 组件的初始数据
     */
    data: {
        tags: ''
    },

    /**
     * 组件的方法列表
     */
    methods: {

        // 处理商品
        dealDetail( good ) {
            this.setData({
                tags: good.tag.map( x => `#${x}`).join(' ')
            })
        },

        // 详情
        goDetail( ) {
            const { _id } = this.data.good;
            navTo(`/pages/goods-detail/index?id=${_id}&tid=${this.data.tid}`);
        }
    }
})
