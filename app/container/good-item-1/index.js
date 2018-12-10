// container/good-item-1/index.js

/**
 * 单个商品框，用在行程入口的热门推荐、普通商品列表
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
        dealDetail( good ) {
            this.setData({
                tags: good.tag.map( x => `#${x}`).join(' ')
            })
        }
    }
})
