const app = getApp( );
const { http } = require('../../util/http.js');
const { navTo } = require('../../util/route.js');

const storageKey = 'manager-check-order';

Component({
    /**
     * 组件的属性列表
     */
    properties: {
        // 行程id
        tid: {
            value: '',
            type: String,
            observer: 'init'
        },
        // 未调整的，展示边框
        outline: {
            value: false,
            type: Boolean
        }
    },

    /**
     * 组件的初始数据
     */
    data: {
        // 行程订单数
        count: 0,
        // 行程交易额
        sum: 0,
        // 催款次数
        callMoneyTimes: 0,
        // 清单列表
        list: [ ],
        // 展示弹框
        show: false,
        // 正在调整的清单对象
        currentSL: null,
        // 调整价格存储
        slTemp: {
            purchase: 0,
            adjustPrice: 0,
            adjustGroupPrice: 0
        },
        // 上次拉取未读订单的时间
        lastCheckTime: null,
        // 未读订单数
        unread: 0
    },

    /**
     * 组件的方法列表
     */
    methods: {

        init( val ) {
            this.fetchDetail( val );
            this.fetchShoppingList( val );
        },

        // 获取购物清单
        fetchDetail( tid ) {
            http({
                url: 'shopping-list_list',
                data: {
                    tid
                },
                loadMsg: '加载中...',
                errorMsg: '加载失败，请刷新',
                success: res => {
                    if ( res.status === 200 ) {

                        const meta = res.data;
                        const meta1 = meta.map( x => {

                            let depositPricesArr = [ ];
                            x.order.map( y => depositPricesArr.push( y.depositPrice ));
                            depositPricesArr.sort(( x, y ) => x - y );

                            if ( depositPricesArr[ 0 ] === depositPricesArr[ depositPricesArr.length - 1 ]) {
                                depositPricesArr = [ depositPricesArr[ 0 ]];
                            }

                            return Object.assign({ }, x, {
                                depositPricesArr
                            });

                        });

                        this.setData({
                            list:  [
                                ...meta1.filter( x => x.base_status === '0'),
                                ...meta1
                                    .filter( x => x.base_status === '1')
                                    .filter( x => !!x.lastAllocated ),
                                ...meta1
                                    .filter( x => x.base_status === '1')
                                    .filter( x => !x.lastAllocated )
                            ]
                        });
                    }
                }
            })
        },

        // 获取行程订单数、收入
        fetchShoppingList( tid ) {
            http({
                url: 'trip_order-info',
                data: {
                    tid
                },
                loadMsg: '加载中...',
                errorMsg: '加载失败，请刷新',
                success: res => {
                    if ( res.status === 200 ) {
                        const { count, sum, callMoneyTimes } = res.data;
                        this.setData({
                            sum,
                            count,
                            callMoneyTimes
                        })
                    }
                }
            })
        },

        // 拉取未读订单
        fetchUnRead( ) {
            const { tid, lastCheckTime } = this.data;
            http({
                url: 'order_unread',
                data: {
                    tid,
                    lastTime: lastCheckTime
                },
                success: res => {
                    const { status, data } = res;
                    if ( status !== 200 ) { return; }
                    this.setData({
                        unread: data
                    });
                }
            })
        },

        // 跳到商品详情
        goGoodDetail({ currentTarget }) {
            const { pid } = currentTarget.dataset.data;
            navTo(`/pages/goods-detail/index?id=${pid}&tid=${this.data.tid}`);
        },

        // 展开修改框
        showModal({ currentTarget }) {
            const data = currentTarget.dataset.data;
            const { adjustGroupPrice, adjustPrice, purchase } = data;
            this.setData({
                show: true,
                currentSL: data,
                slTemp: {
                    purchase,
                    adjustPrice,
                    adjustGroupPrice
                }
            });
        },

        // 提交修改
        submit( ) {
            const { slTemp, currentSL } = this.data;
            const { adjustPrice, purchase, adjustGroupPrice } = slTemp;
            const biggestDeposit = currentSL.depositPricesArr[ currentSL.depositPricesArr.length - 1 ];

            if ( purchase === null ) {
                return wx.showToast({
                    icon: 'none',
                    title: '实际购买量不能为空'
                })
            }

            if ( !adjustPrice ) {
                return wx.showToast({
                    icon: 'none',
                    title: '实际售价不能为空或为0'
                })
            }

            if ( adjustGroupPrice === 0 ) {
                return wx.showToast({
                    icon: 'none',
                    title: '团购价不能为0'
                })
            }

            if ( !!adjustPrice && adjustPrice < biggestDeposit ) {
                return wx.showToast({
                    icon: 'none',
                    title: '售价不能少于订金'
                })
            }

            if ( !!adjustGroupPrice && adjustGroupPrice < biggestDeposit ) {
                return wx.showToast({
                    icon: 'none',
                    title: '团购价不能少于订金'
                })
            }
            
            // 更新
            http({
                url: 'shopping-list_adjust',
                data: {
                    purchase,
                    adjustPrice,
                    adjustGroupPrice,
                    shoppingId: currentSL._id
                },
                success: res => {
                    if ( res.status !== 200 ) { return; }

                    this.setData({
                        show: false,
                        currentSL: null
                    });
                    this.fetchDetail( this.data.tid );
                    this.fetchShoppingList( this.data.tid );
                    wx.showToast({
                        title: '调整成功'
                    });
                }
            })

        },

        // 取消
        cancel( ) {
            this.setData({
                show: false,
                currentSL: null
            })
        },

        // 修改框输入
        modalInput( e ) {
            const { slTemp } = this.data;
            const { detail, currentTarget } = e;
            const { value } = detail;
            const { key } = currentTarget.dataset;

            const temp = Object.assign({ }, slTemp, {
                [ key ]: value !== '' ? Number( value ) : null
            });

            this.setData({
                slTemp: temp
            });
        },

        // 初始化上次拉取未读订单的时间
        initTime( ) {
            const meta =  wx.getStorageSync( storageKey );
            this.setData({
                lastCheckTime: meta ? JSON.parse( meta ) : null
            });
            setTimeout(( ) => this.fetchUnRead( ), 200 );
        },

        // 跳到所有的订单
        goAllOrder( e ) {
            const { tid, lastCheckTime } = this.data;
            navTo(`/pages/manager-trip-order-all/index?tid=${tid}&last=${lastCheckTime}`);
        },

        onSubscribe( ) {
            app.getSubscribe('newOrder,trip,waitPin');
        }
    },

    attached: function( ) {
        this.initTime( );
    }
})
