const { navTo } = require('../../util/route.js');

Component({
    /**
     * 组件的属性列表
     */
    properties: {

    },

    /**
     * 组件的初始数据
     */
    data: {
        // 动画
        noAnimation: { },
        // 动画
        animationData: { },
        // 导航nav
        navList: [
            {
                label: '行程',
                url: "/pages/trip-enter/index",
                normal: "https://global-1257764567.cos.ap-guangzhou.myqcloud.com/nav-icon-plane.png",
                active: "https://global-1257764567.cos.ap-guangzhou.myqcloud.com/nav-icon-plane-active.png"
            }, {
                label: '超值',
                url: "/pages/index/index",
                normal: "https://global-1257764567.cos.ap-guangzhou.myqcloud.com/nav-icon-shop.png",
                active: "https://global-1257764567.cos.ap-guangzhou.myqcloud.com/nav-icon-shop-active.png"
            }, {
                label: '钱',
                url: "/pages/ground-pin/index",
                // normal: "https://global-1257764567.cos.ap-guangzhou.myqcloud.com/nav-icon-cart.png",
                // active: "https://global-1257764567.cos.ap-guangzhou.myqcloud.com/nav-icon-cart-active.png"
                normal: "https://global-1257764567.cos.ap-guangzhou.myqcloud.com/icon-sheng.png",
                active: "https://global-1257764567.cos.ap-guangzhou.myqcloud.com/icon-sheng-color.png"
            }, {
                label: '我的',
                url: "/pages/my/index",
                normal: "https://global-1257764567.cos.ap-guangzhou.myqcloud.com/nav-icon-person.png",
                active: "https://global-1257764567.cos.ap-guangzhou.myqcloud.com/nav-icon-person-active.png"
            }
        ],
        /** 当前激活的下标 */
        active: null
    },

    /**
     * 组件的方法列表
     */
    methods: {
        // 初始化动画
        initAnimation( ) {

            const animation = wx.createAnimation({
                delay: 1000,
                duration: 10000,
                timingFunction: "ease",
            });

            animation.translateX(80).step();

            this.setData({
                animationData: animation.export()
            })
        },
        /** 点击导航 */
        navigate({ currentTarget }) {
            const pages = getCurrentPages( )
            const current = pages[ pages.length - 1 ];
            const url = current.route;

            // this.setData({
            //     active: currentTarget.dataset.index
            // })

            if ( currentTarget.dataset.url.indexOf( url ) === -1 ) {
                navTo( currentTarget.dataset.url )
            }
        },
        /** 判断当前路由 */
        init( ) {
            const pages = getCurrentPages( )
            const current = pages[ pages.length - 1 ];
            const url = current.route;
 
            const activeIndex = this.data.navList.findIndex( x => x.url.indexOf( url ) !== -1 );
            if ( activeIndex !== -1 ) {
                this.setData({
                    active: activeIndex
                });
            }
        }
    },

    attached: function( ) {
        this.init( );
    }

})
