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
        ],
        // 商品详情
        detail: null,
        // 库存
        hasStock: false,
        // 动画
        animationSku: null,
        // 动画
        animationSkuBg: null,
        // 展开sku
        openSku: false
    },

    computed: {

    },

    /**
     * 组件的方法列表
     */
    methods: {
        /** 拉取商品详情 */
        fetchDetail( id ) {
            const that = this;
            if ( !id || !this.data.openSku ) { return; }

            wx.showLoading({
                title: '加载中...',
            });
    
            wx.cloud.callFunction({
                name: 'api-goods-detail',
                data: {
                    _id: this.data.pid
                },
                success: function ( res ) {
      
                    let result = false;
                    const { status, data, } = res.result;
                    if ( status !== 200 ) { return; }

                    const { _id, stock, standards } = data;
                    if ( standards.length === 0 ) {
                        result = stock === undefined || stock > 0;
                    } else {
                        result = standards.some( x => x.stock === undefined || x.stock > 0 )
                    }

                    wx.hideLoading({ });
                    that.setData({
                        detail: data,
                        hasStock: result
                    });
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
        /** 创建动画 */
        toggleAnimate( ) {
            const { openSku, pid } = this.data;

            if ( !openSku ) {
                this.fetchDetail( pid );
            }

            const animationSkuMeta = wx.createAnimation({ 
                duration: 250, 
                timingFunction: 'ease-out', 
                transformOrigin: '50% 50%',
            });

            const animationSkuBgMeta = wx.createAnimation({ 
                duration: 250, 
                timingFunction: 'ease-out', 
                transformOrigin: '50% 50%',
            });
            
            if ( !openSku ) {
                animationSkuMeta.opacity( 0.3 ).translateY( '-75vh' ).opacity( 1 ).step( );
                animationSkuBgMeta.opacity( 1 ).step( );
            } else {
                animationSkuMeta.opacity( 0.5 ).translateY( '75vh' ).opacity( 0 ).step( );
                animationSkuBgMeta.opacity( 0 ).step( );
            }

            this.setData({
                openSku: !openSku,
                animationSku: animationSkuMeta.export( ),
                animationSkuBg: animationSkuBgMeta.export( )
            })
        }
    },

    attached: function( ) {
        // this.toggleAnimate( );
    }

})
