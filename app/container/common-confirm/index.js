
Component({
    /**
     * 组件的属性列表
     */
    properties: {
        /** 标题 */
        title: {
            type: String,
            value: ''
        },
        /** 文字 */
        texts: {
            type: Array,
            value: [ ]
        },
        /** 是否展开 */
        open: {
            type: Boolean,
            value: false
        },
        /** 存储key */
        storageKey: {
            type: String,
            value: ''
        }
    },

    /**
     * 组件的初始数据
     */
    data: {

        /** 能否展开 */
        canShow: false
    },

    /**
     * 组件的方法列表
     */
    methods: {
        /** 开启、关闭 */
        toggle( ) {
            const { open } = this.data;
            this.triggerEvent('toggle', !open );
        },
        /** 初始化 */
        init( ) {
            const { storageKey } = this.data;
            const lastTime = Number( wx.getStorageSync( storageKey ));
            const GAP = 2 * 24 * 60 * 60 * 1000;

            // 有storageKey且时间大于2天 或 没有storage的时候才展开
            if ( !storageKey || 
                ( !!storageKey && !lastTime ) || 
                ( !!storageKey && !!lastTime && Date.now( ) - lastTime >= GAP )) {
                    this.setData({
                        canShow: true
                    });
            }

            // 如果有storageKey就存一下本次打开的时间 
            if ( !!storageKey ) {
                wx.setStorageSync( storageKey, String( Date.now( )));
            }
        }
    },

    attached: function( ) {
        this.init( );
    }
})
