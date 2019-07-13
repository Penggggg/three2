const { http } = require('../../util/http.js');
const { computed } = require('../../lib/vuefy/index.js');
const { createFormId } = require('../../util/form-id.js');
const { wxPay } = require('../../util/pay.js');

Component({
    /**
     * 组件的属性列表
     */
    properties: {
        /** 是否展开 */
        show: {
            value: false,
            type: Boolean,
            observer: 'init'
        },
        /** 该行程的订单 */
        tripOrder: {
            value: { },
            type: Object,
            observer: 'initOrder'
        },
        /** 总推广积分 */
        totalPushIntegral: {
            value: 0,
            type: Number
        },
        /** 推广积分可以抵现比例 */
        pushIntegralRate: {
            value: 0,
            type: Number
        }
    },

    /**
     * 组件的初始数据
     */
    data: {
        /** 总应付尾款 */
        lastPrice: 0,

        /** 是否使用积分推广 */
        isUsePushIntegral: true,

        /** 积分推广 */
        showShareTips: false
    },

    /**
     * 组件的方法列表
     */
    methods: {

        runComputed( ) {
            computed( this, {

                /** 应付尾款 */
                lastPrice$( ) {
                    const { isUsePushIntegral, totalPushIntegral, pushIntegralRate, lastPrice } = this.data;
                    /** 最大抵扣额 */
                    const maxDeduction = Number(( pushIntegralRate * lastPrice ).toFixed( 2 ));
                    const shouldDeduction = totalPushIntegral > maxDeduction ? maxDeduction : totalPushIntegral;

                    return Number(( lastPrice - ( isUsePushIntegral ? shouldDeduction : 0 )).toFixed( 2 ));
                },

                /** 可用抵扣额 */
                deduction$( ) {
                    const { totalPushIntegral, pushIntegralRate, lastPrice } = this.data;
                    /** 最大抵扣额 */
                    const maxDeduction = Number(( pushIntegralRate * lastPrice ).toFixed( 2 ));
                    return totalPushIntegral > maxDeduction ? maxDeduction : totalPushIntegral;
                }

            });
        },

        // 初始化
        init( isShow ) {
            !!isShow && this.setTopColor( );
            !isShow && this.resetTopColor( );
        },

        // 行程订单
        initOrder( tripOrder ) {
            const { lastPrice } = tripOrder;
            if ( !!lastPrice ) {
                this.setData({
                    lastPrice
                });
            }
        },

        // 设置顶部颜色
        setTopColor( ) {
            wx.setNavigationBarColor({
                frontColor: '#000000',
                backgroundColor: '#ffffff'
            })
        },

        // 还原顶部颜色
        resetTopColor( ) {
            wx.setNavigationBarColor({
                frontColor: '#ffffff',
                backgroundColor: '#f80759'
            })
        },

        // 勾选
        onCheckboxChange( e ) {
            this.setData({
                isUsePushIntegral: e.detail.value.length > 0
            })
        },

        // 关闭积分推广提示弹窗
        toggleTips( e = null ) {
            const { showShareTips } = this.data;
            this.setData({
                showShareTips: !showShareTips,
            });
        },

        // 关闭本窗口
        onClose( ) {
            this.triggerEvent('toggle', false );
        },

        // 开启结算
        onSettle( e ) {
            createFormId( e.detail.formId );

            const coupons = [ ];
            const { lastPrice$, tripOrder } = this.data;
            const { tid, meta, t_daijin, t_lijian, t_manjian, wholePriceByDiscount } = tripOrder;

            wxPay( lastPrice$, ({ prepay_id }) => {

                if ( wholePriceByDiscount <= 0 ) { return; }

                if ( t_daijin.isUsed && t_daijin.id ) {
                    coupons.push( t_daijin.id )
                } 
                if ( t_lijian.isUsed && t_lijian.id ) {
                    coupons.push( t_lijian.id )
                } 
                if ( t_manjian.isUsed && t_manjian.id ) {
                    coupons.push( t_manjian.id )
                } 

                const orders = meta.map( order => {
                    const { _id, pid, sid, canGroup, allocatedGroupPrice, allocatedCount, allocatedPrice } = order;
                    const final_price = !!canGroup && allocatedGroupPrice ?
                        allocatedCount * allocatedGroupPrice :
                        allocatedCount * allocatedPrice;
                    return {
                        pid,
                        sid,
                        oid: _id,
                        final_price,
                        allocatedCount,
                    }
                });

                const data = {
                    tid,
                    orders,
                    coupons,
                    integral: wholePriceByDiscount,
                };

                http({
                    data,
                    url: 'order_pay-last',
                    success: res => {
                        if ( res.status === 200 ) {
                            this.onClose( );
                            this.triggerEvent('ok', res.data );
                        }
                    }
                });

            }, ( ) => { });
        }

    },

    attached: function( ) {
        this.runComputed( );
    }
})
