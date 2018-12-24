// container/nav-bar/index.js
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
                normal: "cloud://dev-0822cd.6465-dev-0822cd/icon-img/nav-icon-7.png",
                active: "cloud://dev-0822cd.6465-dev-0822cd/icon-img/nav-icon-8.png"
            }, {
                label: '超值',
                url: "/pages/index/index",
                normal: "cloud://dev-0822cd.6465-dev-0822cd/icon-img/nav-icon-5.png",
                active: "cloud://dev-0822cd.6465-dev-0822cd/icon-img/nav-icon-6.png"
            }, {
                label: '购物车',
                url: "/pages/cart-list/index",
                normal: "cloud://dev-0822cd.6465-dev-0822cd/icon-img/nav-icon-3.png",
                active: "cloud://dev-0822cd.6465-dev-0822cd/icon-img/nav-icon-4.png"
            }, {
                label: '我的',
                url: "/pages/my/index",
                normal: "cloud://dev-0822cd.6465-dev-0822cd/icon-img/nav-icon-2-2.png",
                active: "cloud://dev-0822cd.6465-dev-0822cd/icon-img/nav-icon-2.png"
            }
        ]
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

            if ( currentTarget.dataset.url.indexOf( url ) === -1 ) {
                wx.navigateTo({
                    url: currentTarget.dataset.url
                });
            }
        }
    },

    attached: function( ) {
      // this.initAnimation( );
    }

})
