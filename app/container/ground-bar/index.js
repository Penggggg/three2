const app = getApp( );
const { navTo } = require('../../util/route.js');
const { http } = require('../../util/http');

Component({

    behaviors: [require('../../behaviores/computed/index.js')],
    /**
     * 组件的属性列表
     */
    properties: {
        ac: {
            type: Number,
            value: 0
        }
    },

    /**
     * 组件的初始数据
     */
    data: {
        // 当前活动下标
        active: 0,
    },

    computed: {
        // 按钮
        /**
         */
        navList$( ) {
            const { tid } = this.data;
            const meta = [
                {
                    title: '钱',
                    url: `/pages/ground-pin/index`,
                    img: "https://global-1257764567.cos.ap-guangzhou.myqcloud.com/icon-sheng.png",
                    activeImg: "https://global-1257764567.cos.ap-guangzhou.myqcloud.com/icon-sheng-color.png"
                }, {
                    title: '钱',
                    url: `/pages/ground-push-integral/index`,
                    img: "https://global-1257764567.cos.ap-guangzhou.myqcloud.com/icon-zhuan.png",
                    activeImg: "https://global-1257764567.cos.ap-guangzhou.myqcloud.com/icon-zhuan-color.png"
                }
            ];
            return meta;
        }
    },

    /**
     * 组件的方法列表
     */
    methods: {

        /** 点击导航 */
        navigate({ currentTarget, detail }) {
            navTo( currentTarget.dataset.url )
        },

        onSubscribe( ) {
            // app.getSubscribe('buyPin,waitPin,trip');
            app.getSubscribe('hongbao');
            setTimeout(( ) => {
                http({
                    data: {
                        type: 'hongbao',
                        texts: ['呵呵', 'xx']
                    },
                    url: 'common_push-subscribe-cloud'
                })
            }, 2000 );
        },

        /** 初始化下标 */
        init( ) {
            const { ac } = this.data;
            if ( ac !== undefined && ac !== null ) {
                this.setData({
                    active: Number( ac )
                });
            }
        }
    },

    attached: function( ) {
        this.init( );
    }
})
