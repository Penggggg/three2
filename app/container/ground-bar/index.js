const { navTo } = require('../../util/route.js');

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
        navigate({ currentTarget }) {
            const pages = getCurrentPages( )
            const current = pages[ pages.length - 1 ];
            const url = current.route;

            if ( currentTarget.dataset.url.indexOf( url ) === -1 ) {
                navTo(  currentTarget.dataset.url )
            }
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
