const app = getApp( );
const { http } = require('../../util/http.js');

Component({
    /**
     * 组件的属性列表
     */
    properties: {
        // 行程id
        tid: {
            type: String
        },
        // 展开
        show: {
            type: Boolean,
            observer: 'init'
        },
        // 已领
        hasBeenGet: {
            type: Number
        },
        // 未领
        notGet: {
            type: Number
        },
        // 分享标题
        title: {
            type: String
        },
        // 分析图片
        img: {
            type: String
        },
        // 行程截止
        endTime: {
            type: Number
        },
    },

    /**
     * 组件的初始数据
     */
    data: {

        /** 是否进行了用户授权 */
        isUserAuth: false,

        // 动画
        animationMiddleHeaderItem: null,
    },

    /**
     * 组件的方法列表
     */
    methods: {

        /** 初始化 */
        init( val ) {
            if ( val ) {
                // this.vibrateShort( );
            }
        },

        /** 监听用户授权情况 */
        checkAuth( ) {
            app.watch$('isUserAuth', val => {
                if ( val === undefined ) { return; }
                this.setData({
                    isUserAuth: val
                });
            });
        },

        /** 关闭弹层 */
        closeCover( ) {
            this.triggerEvent('close', true );
        },

        /** 动画处理 */
        dealAnimate( ) {
            let circleCount = 0;
            const animate = wx.createAnimation({
                timingFunction: 'ease',
                transformOrigin: '0% 50%',
            });
            setInterval(function () {
                if (circleCount % 2 == 0) {
                    animate.scale(0.9).translateX( '-50%' ).step();
                }
                else {
                    animate.scale(1.05).translateX( '-50%' ).step();
                }
                this.setData({
                    animationMiddleHeaderItem: animate.export( )
                });
                if ( ++circleCount === 1000) {
                    circleCount = 0;
                }
            }.bind( this ), 200);
        },

        /** 短振动 */
        vibrateShort( ) {
            wx.vibrateShort({
                success: res => { }
            });
            setTimeout(( ) => {
                wx.vibrateShort({
                    success: res => { }
                });
            }, 30 );
        },

        /** formid */
        onShare( e ) {

        },

        /** 订阅授权 */
        onSubscribe( e ) {
            app.getSubscribe('buyPin,hongbao,trip');
        },

        /** 获取用户授权 */
        getUserAuth( ) {
            app.getWxUserInfo(( ) => {
            });
        }
    },

    attached: function( ) {
        this.checkAuth( );
        this.dealAnimate( );
    }

})
