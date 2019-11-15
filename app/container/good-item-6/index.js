const app = getApp( );
const { navTo } = require('../../util/route.js');
/**
 * @description
 * 沾满一行两格的商品框，搜索列表、普通商品列表（会展示详情2行）
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
        dealDetail: function( val ) {

            const { good } = this.data;
            this.setData({
                tag: good ? good.tag.map( x => `#${x}`).join(' ') : ''
            })
        },
  
        // 详情
        goDetail( e ) {
            const { _id } = this.data.good;
            navTo(`/pages/goods-detail/index?id=${_id}&tid=${this.data.tid}`);
        },

        onSubscribe( e ) {
            app.getSubscribe('buyPin,waitPin');
        }
  
    }
  })
  