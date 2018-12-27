const { http } = require('../../util/http.js');
const app = getApp( );

Page({

    /**
     * 页面的初始数据
     */
    data: {
        // 上方活动tab
        active: 0,
        // 上方tabs
        // tabs: [{
        //     key: 0,
        //     label: '全部'
        // }, {
        //     key: 1,
        //     label: '待付款'
        // }, {
        //     key: 2,
        //     label: '待发货'
        // }, {
        //     key: 3,
        //     label: '已完成'
        // }],
        tabs: [{
            key: 0,
            label: '全部订单'
        }, {
            key: 1,
            label: ''
        }, {
            key: 2,
            label: ''
        }, {
            key: 3,
            label: ''
        }],
        // tab跟查询的关系
        keyMapType: {
            0: 'my-all',
            1: 'my-notpay',
            2: 'my-delive',
            3: 'my-finish'
        },
        // 滚动加载page
        page: 0,
        // 滚动skip
        skip: 0,
        // 滚动加载 是否能加载更多
        canloadMore: true,
        // 原始订单列表
        metaList: [ ],
        // 以行程为基调的订单列表
        tripOrders: [ ],
        // 是否新客户
        isNew: true
    },

    /** 点击上方各类订单 */
    onTab({ currentTarget }) {
        const { index } = currentTarget.dataset;
        if ( index === this.data.active )  { return; }
        
        this.setData({
            list:[ ],
            page: 0,
            skip: 0,
            totalPage: 1,
            active: index
        });
        this.fetchList( index );
    },

    /** 拉取订单数据 */
    fetchList( index ) {
        const { page, keyMapType, skip } = this.data;
        const type = keyMapType[ index ];
        http({
            data: {
                type,
                skip,
                page: page + 1
            },
            url: 'order_list',
            loadMsg: '加载中...',
            success: res => {
                // 本来订单跟商品是 1:1 的关系
                // 但是直接就这样子显示，会不够直观，部分操作麻烦
                // 所以这边要以“行程”为基调，重新组织订单的显示方式
                console.log( res );
                const { status, data } = res;
                if ( status !== 200 ) { return; }

                const { page, current, totalPage, total } = data;

                this.setData({
                    page,
                    skip: current,
                    metaList: data.data,
                    canloadMore: total > current,
                });
                this.covertOrder( );
            }
        })
    },

    /** 转换订单列表，为行程订单列表 */
    covertOrder( ) {

        /**
         * type orderObj = {
         *   [ key: string ]: {
         *     tid
         *     tripName
         *     tripTime
         *     tripStatusCN
         *     meta: metaOrder[ ]
         *  }
         * 
         *  {
         *     整体订单状态：some P0 （待付订金）、all P1 + B2/B4（待付尾款）、all P2（已付款）、all P2 + D0 未发货、all P2 + D1 已发货
         *  }
         * 
         *  {
         *     订单item状态：P0（待付订金）、P1+B0（购买中）、P1+B1（已购买，结算中）、P1+B2（已购买，待付款）、P1+B4（买不到，退款中）、P2+D1（未发货）、P2+D2（已发货）
         *  }
         */

        const { metaList } = this.data;
        const orderObj = { };

        metaList.map( order => {

            let isNeedPrePay = true;
            const { isNew } = this.data;
            const payment = order.trip.payment;
            const { depositPrice } = order;

            if ( isNew && payment === '0' ) {
                isNeedPrePay = true;

            } else if ( isNew && payment === '1' ) {
                isNeedPrePay = true;

            } else if ( isNew && payment === '2' ) {
                isNeedPrePay = false;

            }  else if ( !isNew && payment === '0' ) {
                isNeedPrePay = false;

            }  else if ( !isNew && payment === '1' ) {
                isNeedPrePay = true;

            }  else if ( !isNew && payment === '2' ) {
                isNeedPrePay = false;

            }  else {
                isNeedPrePay = true;
            } 

            if ( !depositPrice ) {
                isNeedPrePay = false;
            }

            // 处理单个订单 状态
            const decorateOrder = ( order, isNeedPrePay ) => {
                let statusCN = '';
                const p = order.pay_status;
                const b = order.base_status;
                const d = order.deliver_status;

                if ( isNeedPrePay && p === '0' && b === '5' ) {
                    statusCN = '支付过期，请重新购买'

                } else if ( isNeedPrePay && p === '0' && b !== '5' && b !== '4' ) {
                    statusCN = '待付订金'

                } else if ( p === '1' && b === '0' ) {
                    statusCN = '跑腿购买中'

                } else if ( p === '1' && b === '1' ) {
                    statusCN = '已购买，结算中'

                } else if ( p === '1' && b === '2' ) {
                    statusCN = '已购买，待付款'

                } else if ( p === '1' && b === '4' ) {
                    statusCN = '买不到，退款中'

                } else if ( p === '2' && d === '0' ) {
                    statusCN = '未发货'
                    
                } else if ( p === '2' && d === '2' ) {
                    statusCN = '已发货'
                } 

                return Object.assign({ }, order, {
                    p,
                    b,
                    statusCN,
                    isNeedPrePay
                })
            };

            if ( !orderObj[ order.tid ]) {
                const d = new Date( order.trip.start_date );
                orderObj[ order.tid ] = {
                    tid: order.tid,
                    tripPostage: order.trip.postage,
                    tripPostagefree_atleast: order.trip.postagefree_atleast,
                    tripName: order.trip.title,
                    tripPayment: order.trip.payment,
                    tripTime: `${d.getMonth( )+1}月${d.getDate( )}`,
                    meta: [ decorateOrder( order, isNeedPrePay )]
                };

            } else {
                orderObj[ order.tid ] = Object.assign({ }, orderObj[ order.tid ], {
                    meta: [ ...orderObj[ order.tid ].meta, decorateOrder( order, isNeedPrePay )]
                });
            }

        }); 

        // 处理订单整体状态、合计信息 tripStatusCN
        Object.keys( orderObj ).map( tid => {
            let tripStatusCN = '';
            const tripOrders = orderObj[ tid ];
            const orders = tripOrders.meta;
            
            //  处理订单整体状态
            if ( orders.filter( x => x.b !== '4' && x.b !== '5').some( x => x.statusCN === '待付订金' )) {
                tripStatusCN = '有未付订金';

            } else if ( orders.filter( x => x.b !== '4' && x.b !== '5').every( x => x.p === '1' && ( x.b === '0' || x.b === '1' ))) {
                tripStatusCN = '跑腿购买中';

            } else if ( orders.filter( x => x.b !== '4' && x.b !== '5').every( x => x.p === '1' && x.b === '2' )) {
                tripStatusCN = '待付尾款';

            } else if ( orders.filter( x => x.b !== '4' && x.b !== '5').every( x => x.p === '2')
                && orders.filter( x => x.b !== '4' && x.b !== '5').every( x => x.d === '0')) {
                tripStatusCN = '已付款，未发货';

            } else if ( orders.filter( x => x.b !== '4' && x.b !== '5').every( x => x.p === '2')
                && orders.filter( x => x.b !== '4' && x.b !== '5').every( x => x.d === '1')) {
                tripStatusCN = '已付款，已发货';

            } else if ( orders.filter( x => x.b !== '4' && x.b !== '5').every( x => x.p === '2')
                && orders.some( x => x.d === '0') && orders.some( x => x.d === '1')) {
                tripStatusCN = '已付款，部分发货';
            }
            tripOrders['tripStatusCN'] = tripStatusCN;

            // 处理订单商品数量
            const sum = orders.reduce(( x, y ) => {
                const count = y.b === '0' || y.b === '1' || y.b === '2' ?  y.count : 0;
                return x + count;
            }, 0 );
            tripOrders['sum'] = sum;

            // 处理订单商品价格
            const totalPrice = orders.reduce(( x, y ) => {
                const count = y.b === '0' || y.b === '1' || y.b === '2' ?  y.count : 0;
                return x + y.price * count;
            }, 0 );
            tripOrders['totalPrice'] = totalPrice;

            /**
             * 处理订单商品团购价
             * ! 团购总价为0，则团购价为原总价
             */
            const totalGroupPrice = orders.reduce(( x, y ) => {
                const count = y.b === '0' || y.b === '1' || y.b === '2' ?  y.count : 0;
                return x + y.groupPrice ? y.groupPrice * count : 0
            }, 0 );
            tripOrders['totalGroupPrice'] = totalGroupPrice || totalPrice;

            // 剩余订金
            const lastDepositPrice = orders.reduce(( x, y ) => {
                const count = y.b === '0' || y.b === '1' || y.b === '2' ?  y.count : 0;
                let currentDepositPrice = y.p === '0' && !!y.depositPrice ? y.depositPrice : 0;
                return x + currentDepositPrice * count;
            }, 0 );
            tripOrders['lastDepositPrice'] = lastDepositPrice;

            // 剩余尾款
            const lastPrice = orders.reduce(( x, y ) => {
                const depositPrice = y.depositPrice || 0;
                const count = y.b === '0' || y.b === '1' || y.b === '2' ?  y.count : 0;
                let currentPrice = y.p === '1' && y.b === '2' ? y.price - depositPrice : 0;
                return x + currentPrice * count;
            }, 0 );
            tripOrders['lastPrice'] = lastPrice;

            // 处理订单满减

            // 处理订单立减

            // 处理订单满减券

            // 处理订单邮费

        });
        
        console.log( Object.keys( orderObj ).map( tid => orderObj[ tid ]));
        this.setData({
            tripOrders: Object.keys( orderObj ).map( tid => orderObj[ tid ])
        })
    },

    /** 监听全局新旧客 */
    watchRole( ) {
        app.watch$('isNew', val => {
            this.setData({
                isNew: val
            });
            val !== this.data.isNew && this.covertOrder( );
        });
    },

    /** 去联系代购 */
    concact( ) {
        wx.navigateTo({
            url: '/pages/concat/index'
        });
    },

    /** 去商品详情 */
    goGoodDetail({ currentTarget }) {
        const { pid } = currentTarget.dataset.data;
        wx.navigateTo({
            url: `/pages/goods-detail/index?id=${pid}`
        })
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.watchRole( );
        this.fetchList( this.data.active );
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})