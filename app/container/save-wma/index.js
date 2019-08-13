
const storageKey = 'save-wma-last-time';

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
        show: false
    },

    /**
     * 组件的方法列表
     */
    methods: {
        toggle( ) {
            const { show } = this.data;
            this.setData({
                show: !show
            })
        },

        check( ) {

            const delta = 5 * 24 * 60 * 60 * 10000;

            const openAndClose = ( ) => {
                this.toggle( );
                setTimeout(( ) => {
                    this.toggle( );
                }, 5000 );
                wx.setStorageSync( storageKey, String( Date.now( )));
            }

            setTimeout(( ) => {
                const last = Number( wx.getStorageSync( storageKey ));
                if ( !last ) {
                    openAndClose( );
                } else if ( Date.now( ) - last > delta ) {
                    // 多于5天的时候再显示一下
                    openAndClose( );
                }
            }, 5000 );
        }
    },

    attached: function( ) {
        this.check( );
    }

})
