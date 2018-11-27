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
        /** 展开/关闭 sku */
        toggleSku( e ) {
            const { openSku } = this.data;
            this.setData({
                openSku: !this.data.openSku
            });
            if ( !openSku && e ) {
                this.setData({
                    skuSelectType: e.currentTarget.dataset.type
                })
            }
        },
        /** 关闭sku */
        onCloseSku( e ) {
            this.setData({
                openSku: e.detail
            })
        },
        /** 选择sku */
        onConfirmSku( e ) {

            const selectedSku = e.detail;
            const { skuSelectType } = this.data;

            // 寻找当前sku的cart记录，插入_id
            const skuItem = {
                pid: this.data.detail._id,
                count: selectedSku.count,
                standarad_id: selectedSku.sid,
                current_price: selectedSku.price
            };

            if ( skuSelectType === 'cart' ) {
                this.putCart( skuItem );
            } else if ( skuSelectType === 'buy' ) {
                this.buy( skuItem );
            }
        },
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
        /** 加入购物车 */
        putCart( item ) {

            const that = this;
            wx.showLoading({
                title: '添加中...',
            });

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
        
    }

})
