const { navTo } = require('../../util/route.js');

Component({
    /**
     * 组件的属性列表
     */
    properties: {

        /**
         * {
         *   pid: string
         *   img: string
         *   topTips: string
         *   bottomTips: string
         *   avatars: string[ ]
         *   title: string
         * }[ ]
         */
        list: {
            type: Array,
            value: [ ]
        },

        /**
         * 右上角的颜色
         */
        tipsColor: {
            type: String,
            value: '#13c2c2'
        }

    },

    /**
     * 组件的初始数据
     */
    data: {
        swiperIndex: 0
    },

    /**
     * 组件的方法列表
     */
    methods: {

        /**
         * swiper监听
         */
        onSwiper( e ) {
            const { current } = e.detail;
            this.setData({
                swiperIndex: current
            });
        },

        /**
         * 跳到商品
         */
        goGoodDetail( e ) {
            const { data } = e.currentTarget.dataset;
            navTo(`/pages/goods-detail/index?id=${data.pid}`)
        }

    }
})
