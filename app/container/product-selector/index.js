// container/product-selector/index.js
Component({
    /**
     * 组件的属性列表
     */
    properties: {
        // 是否展开
        show: {
            type: Boolean,
            value: false,
            observer: 'setShow'
        }
    },

    /**
     * 组件的初始数据
     */
    data: {
        /**  是否展开 */
        show$: false,
        /** 搜索字段 */
        search: '',
        /** 加载状态 */
        loading: false,
        /** 列表 */
        list: [ ],
        /** 当前选中的商品id */
        selectedProductId: null
    },

    /**
     * 组件的方法列表
     */
    methods: {

        /** 点击modal确定 */
        onOk( ) {
            console.log('ok');
            const { list } = this.data;
            if ( list.length === 0 ) { 
                return this.fetchList( );
            }
        },

        /** 点击modal取消 */
        onCancel( ) {
            this.triggerEvent('close');
        },

        /** 设置展开 */
        setShow( val ) {
            this.setData({
                show$: val
            });
        },

        /** 获取列表 */
        fetchList( ) {
            const { search } = this.data;
            if ( !search || !search.trim( )) {
                return wx.showToast({
                    icon: 'none',
                    title: '请输入搜索关键词'
                })
            }

            wx.showLoading({
                title: '加载中...',
            });

            wx.cloud.callFunction({
                name: 'api-goods-list',
                data: {
                    page: 1,
                    title: search.replace(/\s+/g, "")
                },
                success: res => {
                    const { status, data } = res.result;
                    if ( status !== 200 ) { return; }

                    const meta = data.data.map( x => {

                        // 设置型号、库存的价格
                        let stock = x.stock;
                        let price = x.price;

                        // 没有型号
                        if ( x.standards.length === 0 ) {
                            stock = x.stock;
                            price = x.price;

                        // 型号只有1种
                        } else if ( x.standards.length === 1 ) {
                            stock = x.standards[ 0 ].stock;
                            price = x.standards[ 0 ].price;
                        
                        // 型号大于1种
                        } else if ( x.standards.length > 1 ) {

                            // 处理价格
                            const sortedPrice = x.standards.sort(( x, y ) => x.price - y.price );
                            if ( sortedPrice[0].price === sortedPrice[sortedPrice.length - 1 ].price ) {
                                price = sortedPrice[0].price;
                            } else {
                                price = `${sortedPrice[0].price}~${sortedPrice[sortedPrice.length - 1 ].price}`;
                            }
                            
                            // 处理货存
                            const sortedStock = x.standards.filter(i => i.stock !== undefined && i.stock !== null).sort((x, y) => x.stock - y.stock);
                            // 有库存型号
                            if ( sortedStock.length === 1 ) {
                                stock = `${sortedStock[0].stock}`;
                            } else if ( sortedStock.length > 1 ) {
                              if ( sortedStock[0].stock === sortedStock[sortedStock.length - 1].stock ) {
                                  stock = `${sortedStock[0].stock}`;
                              } else {
                                  stock = `${sortedStock[0].stock}~${sortedStock[sortedStock.length - 1].stock}`;
                              }
                            }            
                        }

                        return Object.assign({ }, x, {
                            stock,
                            price
                        });

                    });

                    this.setData({
                        list: meta
                    })
                    console.log( meta );
                },
                fail: function( ) {
                    wx.showToast({
                        icon: 'none',
                        title: '获取数据错误',
                    });
                },
                complete: ( ) => {
                    wx.hideLoading({ });
                }
                
            });
        },

        /** 搜索输入 */
        onInput({ detail }) {
            this.setData({
                search: detail.value
            });
        },
    }
})
