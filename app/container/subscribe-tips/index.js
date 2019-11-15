const app = getApp( );
const { requestSubscribe } = require('../../util/subscribe.js');

Component({
    /**
     * 组件的属性列表
     */
    properties: {

    },

    /**
     * 组件的初始数据
     */
    data: {
        show: 'hide'
    },

    /**
     * 组件的方法列表
     */
    methods: {

        /** 监听全局新旧客 */
        watchRole( ) {
            app.watch$('showSubscribeTips', val => {
                this.setData({
                    show: !!val ? 'show' : 'hide'
                });
            });
        },

        /** 展开收起 */
        toggle( ) {
            const { show } = this.data;
            this.setData({
                show: show === 'hide' ?
                    'show' : 'hide'
            });
        },

        /** 知道了 */
        onKnow( ) {
            const { subscribeTpye } = this.data;
            this.toggle( );
            app.setGlobalData({
                showSubscribeTips: false
            });
            requestSubscribe( 
                app.globalData.subscribeTpye, 
                (app.globalData.subscribeTemplates || [ ])
            );
        }

    },

    attached: function( ) {
        this.watchRole( );
    }
})
