const { http } = require('../../util/http.js');

Component({
    /**
     * 组件的属性列表
     */
    properties: {
        // 行程id
        tid: {
            value: '',
            type: String,
            observer: 'fetchDetail'
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
        }
    },

    /**
     * 组件的方法列表
     */
    methods: {

        // 获取购物清单
        fetchDetail( tid ) {
            http({
                url: 'shopping-list_list',
                data: {
                    data: {
                        tid
                    }
                },
                loadMsg: '加载中...',
                errorMsg: '加载失败，请刷新',
                success: res => {
                    if ( res.status === 200 ) {

                        const meta = res.data;
                        const meta1 = meta.map( x => {

                            const depositPricesArr = [ ];
                            x.order.map( y => depositPricesArr.push( y.depositPrice ));
                            depositPricesArr.sort(( x, y ) => x - y );

                            return Object.assign({ }, x, {
                                depositPricesArr
                            });

                        });
                        console.log('...', meta1 )
                        this.setData({
                            list: meta1
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
                    data: {
                        tid
                    }
                },
                loadMsg: '加载中...',
                errorMsg: '加载失败，请刷新',
                success: res => {
                    if ( res.status === 200 ) {
                        const { count, sum } = res.data;
                        this.setData({
                            sum,
                            count
                        })
                    }
                }
            })
        },

        // 跳到商品详情
        goGoodDetail({ currentTarget }) {
            const { pid } = currentTarget.dataset.data;
            wx.navigateTo({
                url: `/pages/goods-detail/index?id=${pid}`
            });

        },

        // 展开修改框
        showModal({ currentTarget }) {
            const data = currentTarget.dataset.data;
            const { adjustGroupPrice, adjustPrice, purchase } = data;
            wx.showModal({
                title: '提示',
                content: '修改实际购买数量后，订单会自动分配到客户（先下单先得）',
                success: res => {
                    this.setData({
                        show: true,
                        currentSL: data,
                        slTemp: {
                            purchase,
                            adjustPrice,
                            adjustGroupPrice
                        }
                    })
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
        }
    },

    attached: function( ) {
        // this.fetchDetail( this.data.tid );
        this.fetchShoppingList( this.data.tid );
    }
})
