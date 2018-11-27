// container/goods-detail-bar/index.js

Component({

    behaviors: [require('../../behaviores/computed/index.js')],
    /**
     * 组件的属性列表
     */
    properties: {
        // 商品详情
        detail: {
            type: Object,
            value: null,
            observer: 'dealDetail'
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
                url: '/pages/index/index',
                src: 'cloud://dev-0822cd.6465-dev-0822cd/icon-img/good-bar-home4.png'
            }, {
                label: '行程',
                url: '/pages/index/index',
                src: 'cloud://dev-0822cd.6465-dev-0822cd/icon-img/good-bar-train4.png'          
            }, {
                label: '购物车',
                url: '/pages/cart-list/index',
                src: 'cloud://dev-0822cd.6465-dev-0822cd/icon-img/good-bar-cart4.png'          
            }
        ],
        // 库存
        hasStock: false,
        // 动画
        animationSku: null,
        // 动画
        animationSkuBg: null,
        // 展开sku
        openSku: false,
        // sku展示队列 _id, canSelect是否能选、 title名称、price价格、stock库存、pid产品id、sid型号id、img图片、limit限购数量
        skuItems: [ ],
        // 选中的 sku
        selectedSku: null,
        // 所选sku的购买数量
        selectdSkuCount: 1,
        // 选择sku的类型：cart、buy，（购物车、立即购买）
        skuSelectType: null,
    },

    computed: {

    },

    /**
     * 组件的方法列表
     */
    methods: {
        /** 处理商品详情 */
        dealDetail( data ) {

            if ( !data ) { return; }

            let result = false;
            let skuItems = [ ];
            const that = this;
            const { _id, stock, standards, price, title, img, limit } = data;
                    
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
                    limit,
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
                    limit: x.limit,
                    canSelect: x.stock !== undefined && x.stock > 0
                }))
            } 

            that.setData({
                skuItems,
                hasStock: result,
                selectedSku: skuItems[ 0 ]
            });
        },
        /** 创建动画 */
        toggleAnimate( e ) {
            
            const { openSku } = this.data;

            if ( !openSku && e ) {
                this.setData({
                    skuSelectType: e.currentTarget.dataset.type
                })
            }

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

        },
        /** 选择 sku */
        onSelectSku({ currentTarget }) {
            const tappingSku = currentTarget.dataset.standard;
            if ( !tappingSku.canSelect ) { return; }
            this.setData({
                selectdSkuCount: 1,
                selectedSku: tappingSku
            });
        },
        /** sku 数量 */
        onSkuCount({ detail }) {
            this.setData({
                selectdSkuCount: detail.number
            });
        },
        /** 选择购物车 */
        confirmSelect( ) {
            const { selectedSku, selectdSkuCount, skuSelectType } = this.data;

            // 寻找当前sku的cart记录，插入_id
            const skuItem = {
                pid: this.data.detail._id,
                count: selectdSkuCount,
                standarad_id: selectedSku.sid,
                current_price: selectedSku.price
            };
            this.toggleAnimate( );

            if ( skuSelectType === 'cart' ) {
                this.putCart( skuItem );
            } else if ( skuSelectType === 'buy' ) {
                this.buy( skuItem );
            }
        },
        /** 加入购物车 */
        putCart( item ) {

            const that = this;
            wx.showLoading({
                title: '添加中...',
            });

            console.log( item );

            wx.cloud.callFunction({
                name: 'api-cart-edit',
                data: {
                    data: item
                },
                success: res => {
                    wx.hideLoading({ });
                    const { status } = res.result;
                    const { selectedSku } = that.data;
        
                    if ( status !== 200 ) { return; }
                    wx.showToast({
                        title: '添加成功'
                    });
                },
                fail: err => {
                    wx.showToast({
                        icon: 'none',
                        title: '添加失败',
                    });
                    wx.hideLoading({ });
                }
            })
        },
        /** 立即购买 */
        buy( item ) {

        },
        /** 地址跳转 */
        navigate( e ) {
            wx.navigateTo({
                url: e.currentTarget.dataset.url
            });
        }
    },

    attached: function( ) {
        // this.toggleAnimate( );
    }

})
