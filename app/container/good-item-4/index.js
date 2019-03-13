
/**
 * @description
 * 沾满一行的商品框，top系列
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
        // 当前行程
        tid: {
            type: String,
            value: ''
        },
        // 向左或有
        direction: {
            type: String,
            value: 'left'
        }
    },

    /**
     * 组件的初始数据
     */
    data: {
        // 标签名
        tag: '',
        /** 头像列表 */
        imgList: [
          'cloud://dev-0822cd.6465-dev-0822cd/icon-img/entry-icon-1.png',
          'cloud://dev-0822cd.6465-dev-0822cd/icon-img/entry-icon-2.png'
      ]
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
        goDetail( ) {
            const { _id } = this.data.good;
            wx.navigateTo({
                url: `/pages/goods-detail/index?id=${_id}&tid=${this.data.tid}`
            });
        }

    }
})
