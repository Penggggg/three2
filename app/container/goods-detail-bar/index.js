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
        openSku: false,
        // sku展示队列 _id, canSelect是否能选、 title名称、price价格、stock库存、pid产品id、sid型号id、img图片
        skuItems: [ ],
        // 选中的 sku
        selectedSku: null
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
      
                    let result = false;
                    let skuItems = [ ];
                    const { status, data, } = res.result;
                    console.log( data );
                    if ( status !== 200 ) { return; }

                    // 判断是否有库存、设置sku的展示队列
                    const { _id, stock, standards, price, title, img } = data;
                    
                    if ( standards.length === 0 ) {
                        // 只有单品本身
                        result = stock === undefined || stock > 0;
                        skuItems = [{
                            _id,
                            title: '默认型号',
                            price,
                            stock,
                            pid: _id,
                            img: img[ 0 ],
                            sid: null,
                            canSelect: stock !== undefined && stock > 0
                        }];
                    } else {
                        // 有型号
                        result = standards.some( x => x.stock === undefined || x.stock > 0 )
                        skuItems = standards.map( x => ({
                            _id: x._id,
                            sid: x._id,
                            pid: x.pid,
                            title: x.name,
                            img: x.img,
                            stock: x.stock,
                            price: x.price,
                            canSelect: x.stock !== undefined && x.stock > 0
                        }))
                    }                    
                    wx.hideLoading({ });
                    that.setData({
                        skuItems,
                        detail: data,
                        hasStock: result,
                        selectedSku: skuItems[ 0 ]
                    });
                    console.log( skuItems, skuItems[ 0 ] )
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
            
            // if ( !openSku ) {
            //     this.fetchDetail( pid );
            // }

            const animationSkuMeta = wx.createAnimation({ 
                duration: 50,
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
        },
        /** 预览图片 */
        previewImg({ currentTarget }) {
            const img = currentTarget.dataset.img;
            wx.previewImage({
                current: img,
                urls: [ img ]
            });
        },
        /** 禁止滑动 */
        preventTouchMove( ) {

        }
    },

    attached: function( ) {
        // this.toggleAnimate( );
    }

})
