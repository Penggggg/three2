// container/good-item-1/index.js
Component({
    /**
     * 组件的属性列表
     */
    properties: {
        good: {
            type: Object,
            observer: 'dealDetail'
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
