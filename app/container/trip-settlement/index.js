const { computed } = require('../../lib/vuefy/index.js');
// const { http } = require('../../util/http.js');

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

        // 关闭弹窗
        toggleTips( e = null ) {
            const { showShareTips } = this.data;
            this.setData({
                showShareTips: !showShareTips,
            });
        }

    },

    attached: function( ) {
        this.runComputed( );
    }
})
