const app = getApp( );
const { http } = require('../../util/http.js');
const { navTo } = require('../../util/route.js');

Component({
    /**
     * 组件的属性列表
     */
    properties: {
        // 跳转地址
        url: {
            value: '',
            type: String
        },
        // 行程id
        tid: {
            value: '',
            type: String,
            observer: 'fetchDetail'
        },
        // 是否变透明
        opacity: {
            value: false,
            type: Boolean,
        }
    },

    /**
     * 组件的初始数据
     */
    data: {
        /** 头像列表 */
        imgList: [ ]
    },

    /**
     * 组件的方法列表
     */
    methods: {

        /** 地址跳转 */
        go( ) {
            const { url, tid } = this.data;
            if ( !!url || !!tid ) {
                navTo( url || `/pages/trip-detail/index?id=${tid}` );
            }
        },

        /** 拉取行程订单购买用户数 */
        fetchDetail( tid ) {
            http({
                data: {
                    tid
                },
                url: 'common_customer-in-trip',
                success: res => {
                    if ( res.status === 200 ) {
                        this.setData({
                            imgList: res.data
                        });
                        this.triggerEvent('change', res.data.length > 99 ? '99+' : res.data.length );
                    }
                }
            })
        }
    },

    attached: function( ) {
        // this.fetchDetail( this.data.tid );
    }
})
