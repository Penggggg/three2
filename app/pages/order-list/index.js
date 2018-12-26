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

                this.covertOrder( metaList )

                this.setData({
                    page,
                    skip: current,
                    canloadMore: total > current
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
         *     
         *  }
         */

        const orderObj = { };

        metaList.map( order => {

            if ( !orderObj[ order.tid ]) {

                let isNeedPrePay = true;
                const { isNew } = this.data;
                const p = order.trip.payment;
                const d = new Date( order.trip.start_date );

                if ( isNew && p === '0' ) {
                    isNeedPrePay = true;

                } else if ( isNew && p === '1' ) {
                    isNeedPrePay = true;

                } else if ( isNew && p === '2' ) {
                    isNeedPrePay = false;

                }  else if ( !isNew && p === '0' ) {
                    isNeedPrePay = false;

                }  else if ( !isNew && p === '1' ) {
                    isNeedPrePay = true;

                }  else if ( !isNew && p === '2' ) {
                    isNeedPrePay = false;

                }  else {
                    isNeedPrePay = true;
                } 

                orderObj[ order.tid ] = {
                    tid: order.tid,
                    isNeedPrePay,
                    tripName: order.trip.title,
                    tripPayment: order.trip.payment,
                    tripTime: `${d.getMonth( )+1}月${d.getDate( )}`,
                    meta: [ order ]
                };

            } else {
                orderObj[ order.tid ] = Object.assign({ }, orderObj[ order.tid ], {
                    meta: [ ...orderObj[ order.tid ].meta, order ]
                });
            }

            // 处理 pay_status base_status


            this.setData({
                tripOrders: Object.keys( orderObj ).map( tid => orderObj[ tid ])
            })
        }); 
        
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