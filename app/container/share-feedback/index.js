const app = getApp( );
const storageKey = 'share-feedback-trip-share';
const { http } = require('../../util/http.js');

/**
 * 分享反馈组件
 */
Component({
    /**
     * 组件的属性列表
     */
    properties: {

        /**
         * 行程id
         */
        tid: {
            type: String,
            value: '',
            observer: 'onCheckIsFirstShare'
        },

        /**
         * 可省下多少钱
         */
        discount: {
            type: Number,
            value: 0
        },

        /**
         * 分享奖励
         */
        reward: {
            type: Number,
            value: 0.88
        }

    },

    /**
     * 组件的初始数据
     */
    data: {

        /**
         * 展示弹框
         */
        showModal: 'hide',

        /**
         * 是否为第一次分享
         */
        isFirst: false

    },

    /**
     * 组件的方法列表
     */
    methods: {

        /**
         * 监听打开
         */
        onShow( v ) {
            this.setData({
                showModal: !!v ? 'show' : 'hide'
            });
        },

        /**
         * 组件内开关
         */
        toggle( ) {
            const { showModal } = this.data;
            this.setData({
                showModal: showModal === 'show' ? 'hide' : 'show'
            });
            showModal === 'show' && this.onSubscribe( );
        },

        /**
         * 订阅
         */
        onSubscribe( ) {
            app.getSubscribe('buyPin,hongbao,trip');
        },

        /**
         * 检查改行程是否有过转发
         */
        onCheckIsFirstShare( tid ) {
            if ( !tid ) { return; }
            const storageData = JSON.parse( wx.getStorageSync( storageKey ) || '{ }');
            const existedRecord = !!storageData[ tid ];
            this.setData({
                isFirst: existedRecord
            });
        },

        /**
         * 领取分享奖励 抵现金
         */
        getReward( ) {
            const { reward, tid } = this.data;
            http({
                url: 'common_get-integral',
                data: {
                    integral: reward
                },
                loadingMsg: '领取中...',
                success: res => {
                    const { status } = res;
                    if ( status !== 200 ) { return; }

                    wx.setStorageSync( storageKey, JSON.stringify({
                        [ tid ]: 1
                    }));

                    wx.showToast({
                        title: '领取成功'
                    });

                    this.toggle( );
                    this.onCheckIsFirstShare( tid );
                }
            });
        }

    },

    attached: function( ) {

    }
})
