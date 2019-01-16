const { http } = require('../../util/http.js');
const { wxPay } = require('../../util/pay.js');
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
        isNew: true,
        // 优惠券列表
        coupons: [ ]
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

    /** 拉取优惠券列表 */
    fetchCoupons( ) {
        http({
            url: `coupon_list`,
            data: {
                isUsed: false
            },
            success: res => {
                const { status, data } = res;
                if ( status !== 200 ) { return; }
                this.setData({
                    coupons: data
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
            const { count, depositPrice, allocatedCount, allocatedGroupPrice, allocatedPrice } = order;

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
                let statusCN = [ ];
                const p = order.pay_status;
                const b = order.base_status;
                const d = order.deliver_status;

                if ( isNeedPrePay && p === '0' && b === '5' ) {
                    statusCN = [ '支付过期，请重新购买' ];

                } else if ( isNeedPrePay && p === '0' && b !== '5' && b !== '4' ) {
                    statusCN = [ '待付订金' ]

                } else if ( p === '1' && b === '0' ) {
                    statusCN = [ '跑腿购买中' ]

                } else if ( p === '1' && b === '1' ) {
                    statusCN = [ '已购买，结算中' ] 

                } else if ( p === '1' && b === '2' ) {
                    statusCN = [ '已购买，待付款' ]

                } else if ( p === '1' && b === '4' ) {
                    statusCN = [ '买不到，退款中' ]

                } else if ( p === '2' && d === '0' ) {
                    statusCN = [ '未发货' ]
                    
                } else if ( p === '2' && d === '2' ) {
                    statusCN = [ '已发货' ]
                } 

                if ( b === '1' && count - allocatedCount > 0 ) {
                    const index = statusCN.findIndex( x => x === '已购买，结算中');
                    statusCN.splice( index, 1, '货源不足');
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
                    tripTime: `${d.getMonth( )+1}月${d.getDate( )}出发`,
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
            if ( orders.filter( x => x.b !== '4' && x.b !== '5').some( x => x.statusCN[ 0 ] === '待付订金' )) {
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

            // 计算当前可结算的商品数量
            const count$ = order => {
                return order.b === '0' ?
                    order.count :
                    order.b === '1' || ordre.b === '2' ?
                        order.allocatedCount === undefined || order.allocatedCount === null ? order.count : order.allocatedCount :
                        0;
            }

            // 处理订单商品数量
            const sum = orders.reduce(( x, y ) => {
                return x + count$( y );
            }, 0 );
            tripOrders['sum'] = sum;

            // 处理订单商品总价价格
            const totalPrice = orders.reduce(( x, y ) => {
                const price = y.allocatedPrice || y.price;
                return x + price * count$( y );;
            }, 0 );
            tripOrders['totalPrice'] = totalPrice;

            /**
             * 处理订单商品团购价
             * ! 团购价可以为0
             * ! 无分配团购价时，取分配售价
             */
            const totalGroupPrice = orders.reduce(( x, y ) => {
                const groupPrice = y.allocatedGroupPrice !== null || y.allocatedGroupPrice !== undefined ?
                    y.allocatedGroupPrice :
                    y.allocatedPrice ;
                return x + groupPrice * count$( y );
            }, 0 );
            tripOrders['totalGroupPrice'] = totalGroupPrice || totalPrice;

            // 剩余订金、未付订金列表
            const notPayDepositOrders = [ ];
            const lastDepositPrice = orders.reduce(( x, y ) => {
                let currentDepositPrice = ( y.p === '0' && !!y.depositPrice ) ? y.depositPrice : 0;
                if ( !!currentDepositPrice ) {
                    notPayDepositOrders.push( y._id )
                }
                return x + currentDepositPrice * count$( y );;
            }, 0 );
            tripOrders['lastDepositPrice'] = lastDepositPrice;
            tripOrders['notPayDepositOrders'] = notPayDepositOrders;

            // 已付订金
            const hasPayDepositPrice = orders.reduce(( x, y ) => {
                const depositPrice = y.depositPrice || 0;
                return x + depositPrice * y.count;
            }, 0 )
            tripOrders['hasPayDepositPrice'] = hasPayDepositPrice;

            // 剩余尾款
            // 注意，这里应该计算好因为货存不足，带来多付订金的情况。
            const lastPrice = orders.reduce(( x, y ) => {
                const depositPrice = y.depositPrice || 0;
                const count = y.b === '0' || y.b === '1' || y.b === '2' ?  y.count : 0;
                const { allocatedCount, allocatedPrice } = y;
                let currentPrice = allocatedPrice * allocatedCount - count * depositPrice;
                return x + currentPrice;
            }, 0 );
            tripOrders['lastPrice'] = lastPrice;

            const { coupons } = this.data;
            const coupons_manjian = coupons.find( x => x.type === 't_manjian');
            const coupons_lijian = coupons.find( x => x.type === 't_lijian');
            const coupons_daijin = coupons.find( x => x.type === 't_daijin');
   
            // 处理满减
            const t_manjian = !coupons_manjian ? { value: 0 } : {
                value: coupons_manjian.value,
                atleast: coupons_manjian.atleast,
                canUsed: coupons_manjian.atleast <= totalPrice || !coupons_manjian.atleast
            };
            tripOrders['t_manjian'] = t_manjian;
           
            // 处理立减
            const t_lijian = !coupons_lijian ? { value: 0 } : {
                value: coupons_lijian.value,
                atleast: coupons_lijian.atleast,
                canUsed: coupons_lijian.atleast <= totalPrice || !coupons_lijian.atleast
            };
            tripOrders['t_lijian'] = t_lijian;

            // 处理代金券
            const t_daijin = !coupons_daijin ? { value: 0 } : {
                value: coupons_daijin.value,
                atleast: coupons_daijin.atleast,
                canUsed: coupons_daijin.atleast <= totalPrice || !coupons_daijin.atleast
            };
            tripOrders['t_daijin'] = t_daijin;

            // 总可减免
            let cutoff = 0;
            if ( t_manjian.canUsed ) {
                cutoff += t_manjian.value;
            }
            if ( t_lijian.canUsed ) {
                cutoff += t_lijian.value;
            }
            if ( t_daijin.canUsed ) {
                cutoff += t_daijin.value;
            }
            tripOrders['cutoff'] = cutoff;

            // 处理订单邮费

        });
        
        console.log(Object.keys( orderObj ).map( tid => orderObj[ tid ]))
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

    /** 付剩余订金 */
    payLastDepositPrice({ currentTarget }) {
        const { lastDepositPrice, notPayDepositOrders } = currentTarget.dataset.data;
        wxPay( lastDepositPrice, ( ) => {
            // 批量更新订单为已支付
            const pay = ( ) => http({
                url: 'order_upadte-to-payed',
                data: {
                    orderIds: notPayDepositOrders.join(',')
                },
                success: res => {
                    if ( res.status === 200 ) {
                        lastDepositPrice && wx.showToast({
                            title: '支付成功'
                        });
                        this.setData({
                            page: 0,
                            skip: 0,
                            canloadMore: true,
                            metaList: [ ],
                            tripOrders: [ ],
                        });
                        this.fetchList( this.data.active );
                    } else {
                        wx.showToast({
                            icon: 'none',
                            title: '支付成功，刷新失败，重试中...'
                        });
                        pay( );
                    }
                }
            });
            pay( );
        }, ( ) => { });
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.watchRole( );
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function ( ) {
        this.setData({
            skip: 0,
            page: 0
        })
        setTimeout(( ) => {
            this.fetchCoupons( );
            this.fetchList( this.data.active );
        }, 0 );
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