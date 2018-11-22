// container/goods-detail-bar/index.js
Component({

    behaviors: [require('../../behaviores/computed/index.js')],
    /**
     * 组件的属性列表
     */
    properties: {
        // 商品id
        pid: {
            type: String,
            value: '',
            observer: 'fetchDetail'
        }  
    },

    /**
     * 组件的初始数据
     */
    data: {
        // 按钮列表
        btnList: [
            {
                label: '商城',
                src: 'cloud://dev-0822cd.6465-dev-0822cd/icon-img/good-bar-home4.png'
            }, {
                label: '行程',
                src: 'cloud://dev-0822cd.6465-dev-0822cd/icon-img/good-bar-train4.png'          
            }, {
                label: '购物车',
                src: 'cloud://dev-0822cd.6465-dev-0822cd/icon-img/good-bar-cart4.png'          
            }
        ]
    },

    /**
     * 组件的方法列表
     */
    methods: {
        /** 拉取商品详情 */
        fetchDetail( id ) {

            const that = this;
            if ( !id ) { return; }
            wx.showLoading({
                title: '加载中...',
            });
    
            wx.cloud.callFunction({
                name: 'api-goods-detail',
                data: {
                    _id: this.data.pid
                },
                success: function ( res ) {
    
                    const { status, data, } = res.result;
                    if ( status !== 200 ) { return; }
                    wx.hideLoading({ });
                    
                    const { title, detail, tag, category, img, fadePrice, price,
                    groupPrice, stock, standards, depositPrice, limit, visiable } = data;
    
                },
                fail: function( ) {
                    wx.showToast({
                        icon: 'none',
                        title: '获取数据错误',
                    });
                    wx.hideLoading({ });
                }
            });
        },
    }
})
