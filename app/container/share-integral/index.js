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
        showShareTips: 'hide',

        // 积分推广文案
        shareTexts: [
            '分享商品',
            '朋友购买',
            '获抵现金',
            '当现金用'
        ],
    },

    /**
     * 组件的方法列表
     */
    methods: {

        // 开关
        onShow( isShow ) {
            this.setData({
                showShareTips: isShow ? 'show' : 'hide'
            });
        },

        toggleTips2( e = { detail: null }) {
            const { showShareTips } = this.data;
            this.setData({
                showShareTips: showShareTips === 'show' ? 'hide' : 'show'
            });
            this.triggerEvent('toggle', showShareTips === 'show' ? false : true );
        },

        onSubscribe( ) {
            app.getSubscribe('buyPin,waitPin,trip');
        },

    }
})
