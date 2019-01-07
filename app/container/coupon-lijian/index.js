
Component({
    /**
     * 组件的属性列表
     */
    properties: {
        // 展开
        show: {
            type: Boolean
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
        }
    },

    /**
     * 组件的初始数据
     */
    data: {

    },

    /**
     * 组件的方法列表
     */
    methods: {

        /** 关闭弹层 */
        closeCover( ) {
            this.triggerEvent('close', true );
        }

    }
})
