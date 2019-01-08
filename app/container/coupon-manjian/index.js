
Component({
    /**
     * 组件的属性列表
     */
    properties: {
        // 行程id
        tid: {
            type: String
        },
        // 金额
        money: {
            type: Number
        },
        // 门槛
        atleast: {
            type: Number
        }
    },

    /**
     * 组件的初始数据
     */
    data: {
        // 动画
        animationMiddleHeaderItem: null,
    },

    /**
     * 组件的方法列表
     */
    methods: {
        /** 动画处理 */
        dealAnimate( ) {
            let circleCount = 0;
            const animate = wx.createAnimation({
                timingFunction: 'ease',
                transformOrigin: '50% 50%',
            });
            setInterval(function () {
                if (circleCount % 2 == 0) {
                    animate.scale(0.98).step();
                }
                else {
                    animate.scale(1.01).step();
                }
                this.setData({
                    animationMiddleHeaderItem: animate.export( )
                });
                if ( ++circleCount === 1000) {
                    circleCount = 0;
                }
            }.bind( this ), 200);
        },
    },

    attached: function( ) {
        this.dealAnimate( );
    }
})
