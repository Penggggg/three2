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
        tabs: [{
            key: 0,
            label: '全部'
        }, {
            key: 1,
            label: '待付款'
        }, {
            key: 2,
            label: '待发货'
        }, {
            key: 3,
            label: '已完成'
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
                const metaList = data.data;

                this.setData({
                    page,
                    skip: current,
                    canloadMore: total > current,
                    tripOrders: this.covertOrder( metaList )
                });
            }
        })
    },

    /** 转换订单列表，为行程订单列表 */
    covertOrder( metaList ) {

        /**
         * type orderObj = {
         *   [ key: string ]: {
         *     tid
         *     tripName
         *     tripTime
         *     isNeedPrePay // 是否要付订金
         *     pay_status
         *     base_status
         *     meta: metaOrder[ ]
         *  }
         * 
         *  {
         *     订单item状态：P0（待付订金）、P1+B0（购买中）、P1+B1（已购买，结算中）、P1+B2（已购买，待付款）、P1+B4（买不到，退款中）、P2+D1（未发货）、P2+D2（已发货）
         *  }
         */

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

                if ( isNeedPrePay && p === '0' ) {
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

            // 处理订单整体状态 pay_status base_status


        }); 

        Object.keys( orderObj ).map( tid => {
            let tripStatusCN = '';
            const tripOrders = orderObj[ tid ];
            const orders = tripOrders.meta;
            
            if ( orders.some( x => x.statusCN === '待付订金' )) {
                tripStatusCN = '未付订金';

            } else if ( orders.every( x => x.p === '1' && ( x.b === '2' || x.b === '4' ))) {
                tripStatusCN = '待付尾款';

            } else if ( orders.every( x => x.p === '2') && orders.every( x => x.d === '0')) {
                tripStatusCN = '已付款，未发货';

            } else if ( orders.every( x => x.p === '2') && orders.every( x => x.d === '1')) {
                tripStatusCN = '已付款，已发货';

            } else if ( orders.every( x => x.p === '2') && orders.some( x => x.d === '0') && orders.some( x => x.d === '1')) {
                tripStatusCN = '已付款，部分发货';
            }

            tripOrders['tripStatusCN'] = tripStatusCN;

        });
        
        console.log( Object.keys( orderObj ).map( tid => orderObj[ tid ]));
        return Object.keys( orderObj ).map( tid => orderObj[ tid ]);
    },

    /** 监听全局新旧客 */
    watchRole( ) {
        app.watch$('isNew', val => {
            this.setData({
                isNew: val
            })
        });
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