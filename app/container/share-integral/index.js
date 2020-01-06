const app = getApp( );

Component({
    /**
     * 组件的属性列表
     */
    properties: {
        // 是否展开
        show: {
            type: Boolean,
            value: false,
            observer: 'onShow'
        },
        // 能否转发
        canShare: {
            type: Boolean,
            value: true,
        }
    },

    /**
     * 组件的初始数据
     */
    data: {
        // modal
        showShareTips: 'hide',

        // 积分推广文案
        shareTexts: [
            '分享商品',
            '朋友购买',
            '获抵现金',
            '当现金用'
        ],

        // 当前账号可用抵现金
        pushIntegral: 0
    },

    /**
     * 组件的方法列表
     */
    methods: {
        /** 监听全局状态 */
        watchRole( ) {
            app.watch$('pushIntegral', val => {
                this.setData({
                    pushIntegral: val
                });
            });
        },

        // 开关
        onShow( isShow ) {
            this.setData({
                showShareTips: isShow ? 'show' : 'hide'
            });
            if ( isShow ) {
                app.getPushIntegral( );
            }
        },

        toggleTips2( e = { detail: null }) {
            const { showShareTips } = this.data;
            this.setData({
                showShareTips: showShareTips === 'show' ? 'hide' : 'show'
            });
            this.triggerEvent('toggle', showShareTips === 'show' ? false : true );
        },

        onSubscribe( ) {
            app.getSubscribe('buyPin,hongbao,trip');
        },

    },

    attached: function( ) {
        this.watchRole( );
    }
})
