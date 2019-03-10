
Component({

    behaviors: [require('../../behaviores/computed/index.js')],
    /**
     * 组件的属性列表
     */
    properties: {
        // 行程id
        tid: {
            type: String,
            value: ''
        }
    },

    /**
     * 组件的初始数据
     */
    data: {
        // 当前活动下标
        active: 0
    },

    computed: {
        // 按钮
        navList$( ) {
            const { tid } = this.data;
            return [
                {
                    title: '推荐',
                    url: `/pages/trip-detail/index?id=${tid}`,
                    img: 'https://global-1257764567.cos.ap-guangzhou.myqcloud.com/nav-icon-kouhong.png',
                    activeImg: 'https://global-1257764567.cos.ap-guangzhou.myqcloud.com/nav-icon-kouhong-active.png'
                }, {
                    title: '我的',
                    url: `/pages/trip-detail/index?id=${tid}`,
                    img: "https://global-1257764567.cos.ap-guangzhou.myqcloud.com/nav-icon-person.png",
                    activeImg: "https://global-1257764567.cos.ap-guangzhou.myqcloud.com/nav-icon-person-active.png"
                }, {
                    title: '排行榜',
                    url: `/pages/trip-detail/index?id=${tid}`,
                    img: 'https://global-1257764567.cos.ap-guangzhou.myqcloud.com/nav-icon-jiangbei.png',
                    activeImg: 'https://global-1257764567.cos.ap-guangzhou.myqcloud.com/nav-icon-jiangbei-active.png'
                }
            ]
        }
    },

    /**
     * 组件的方法列表
     */
    methods: {
        /** 判断当前路由 */
        init( ) {
            const pages = getCurrentPages( )
            const current = pages[ pages.length - 1 ];
            const url = current.route;
 
            const activeIndex = this.data.navList$.findIndex( x => x.url.indexOf( url ) !== -1 );

            if ( activeIndex !== -1 ) {
                this.setData({
                    active: activeIndex
                });
            }
        },
        /** 点击导航 */
        navigate({ currentTarget }) {
            const pages = getCurrentPages( )
            const current = pages[ pages.length - 1 ];
            const url = current.route;
            
            if ( currentTarget.dataset.url.indexOf( url ) === -1 ) {
                wx.redirectTo({
                    url: currentTarget.dataset.url
                });
            }
        }
    },

    attached: function( ) {
        this.init( );
    }
})