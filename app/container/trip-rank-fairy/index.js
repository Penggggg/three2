const { http } = require('../../util/http.js');
const app = getApp( );

/**
 * 快递页面底下的用户排行榜
 */
Component({

    behaviors: [require('../../behaviores/computed/index.js')],

    /**
     * 组件的属性列表
     */
    properties: {
        // 行程id
        tid: {
            value: '',
            type: String,
            observer: 'init'
        }
    },

    /**
     * 组件的初始数据
     */
    data: {

        /**
         * 客户订单列表
         * {
         *      pin // 拼团数据
         *      name // 姓名
         *      avatar // 头像
         *      orders // 订单
         *      money // 订单总价
         * }[ ]
         */
        list: [ ],

        openid: ''
    },

    /** 计算属性 */
    computed: {
        
        /** 前3 */
        top3$: function( ) {
            const temp = [ ...this.data.list ];
            return temp.slice( 0, 3 );
        },

        /** 前3以外 */
        outtop3$: function( ) {
            const temp = [ ...this.data.list ];
            return temp.slice( 3 );
        },

        /** 全部 */
        list$: function( ) {
            return [ ...this.data.list ];
        },

        /** 登录人是否在清单列表中 */
        isBuyer$: function( ) {
            const { openid, list } = this.data;
            const isBuyer = !!list.find( x => x.openid === openid );
            !!this.triggerEvent && this.triggerEvent('isbuyer', isBuyer );
            return isBuyer;
        }
    },

    /**
     * 组件的方法列表
     */
    methods: {

        init( tid ) {
            this.fetchOrder( tid );
        },

        /** 拉取客户订单列表 */
        fetchOrder( tid ) {
            http({
                url: 'order_daigou-list',
                data: {
                    tid
                },
                loadMsg: '加载中...',
                errorMsg: '加载失败，请刷新',
                success: res => {
                    const { status, data } = res;

                    if ( status === 200 ) {
                        const metaList = data.map( meta => {
                            const { user, orders, address } = meta;
                            return {
                                openid: user.openid,
                                name: user.nickName,
                                avatar: user.avatarUrl,
                                orders: orders
                                    .filter( o => !!o.allocatedCount )
                                    .map( o => ({
                                        pid: o.pid,
                                        imgs: o.img,
                                        canGroup: !!o.canGroup
                                    })),
                                pin: orders.filter( o => !!o.canGroup ).length,
                                money: orders
                                    .filter( o => !!o.allocatedCount )
                                    .reduce(( x, y ) => {
                                        const price = y.canGroup && y.allocatedGroupPrice ?
                                            y.allocatedCount * y.allocatedGroupPrice :
                                            y.allocatedCount * y.allocatedPrice;
                                        return x + price;
                                    }, 0 )
                            }
                        });

                        // 按拼团排序
                        const sort1 = metaList.sort(( x, y ) => y.pin - x.pin );

                        // 拼团达人(拼团最多的人)
                        const sort2 = sort1.map(( meta, k ) => Object.assign({ }, meta, {
                            pinest: meta.pin >= sort1[ 0 ].pin || k === 0
                        }));

                        // 是否花最多钱
                        const sortByMoney = metaList.sort(( x, y ) => y.money - x.money );
                        const sort3 = sort2.map(( meta, k ) => Object.assign({ }, meta, {
                            moneyesy: meta.money >= sortByMoney[ 0 ].money
                        }));

                        this.setData({
                            list: sort3
                        })
                    }
                }
            })
        },

        /** 跳到商品详情 */
        goGoodDetail({ currentTarget }) {
            const { pid } = currentTarget.dataset;
            wx.navigateTo({
                url: `/pages/goods-detail/index?id=${pid}`
            })
        },

        /** 检查openid以及是否能展示按钮 */
        checkAuth( ) {
            app.watch$('openid', val => {
                this.setData({
                    openid: val
                });
            });
        },

    },

    attached: function( ) {
        this.checkAuth( );
    }
})
