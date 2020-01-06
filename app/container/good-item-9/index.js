const app = getApp( );
const { navTo } = require('../../util/route.js');

/**
 * @description
 * 好物上新、限时特价，一排一个的商品列表
 */
Component({
    /**
     * 组件的属性列表
     */
    properties: {
        /**
         * 商品详情
         * 
         * _id
         * title
         * name(型号)
         * img
         * tag
         * price
         * groupPirce
         * detail
         */
        good: {
            type: Object,
            observer: 'init'
        },
        /** 图片是否在左 */
        isLeft: {
            type: Boolean,
            value: true
        },
        /** 左上角 */
        tips: {
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
        init( val ) {
        },

        goDetail( e ) {
            const { _id } = this.data.good;
            navTo(`/pages/goods-detail/index?id=${_id}`);
        },

        onSubscribe( e ) {
            app.getSubscribe('buyPin,waitPin');
        }
    }
})
