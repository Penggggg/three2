const app = getApp( );
const { navTo } = require('../../util/route.js');

/**
 * @description
 * 有3中颜色
 * 沾满一行的商品框，用在行程入口的商品排行榜
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
        // 排名 1、2、3
        rank: {
            type: Number,
            value: 1
        },
        // 显示左右 left、right
        mode: {
          type: String,
          value: 'left'
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
        goDetail( ) {
            const { _id } = this.data.good;
            navTo(`/pages/goods-detail/index?id=${_id}&tid=${this.data.tid}`);
        }

    }
})
