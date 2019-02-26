// container/product-selector/index.js
const { http } = require('../../util/http.js');

/**
 * @description 单个商品选择的组件
 */
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
        },
        // 是否需要选择型号
        shouldChoiceStander: {
            type: Boolean,
            value: false
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
        /** 上次搜索的字段 */
        lastSearch: '',
        /** 上次搜索的时间 */
        lastSearchTime: null,
        /** 列表 */
        list: [ ],
        /** 当前选中的商品id */
        selectedProductId: null,
        /** 当前选中的商品 */
        selectedProduct: null,

        /** 已选择的型号列表 */
        selectedStanderIds: [ ],
        /** 展示型号选择框 */
        show2$: false,
        /** 已选择的型号列表 */
        selectedStanderIdObj: {

        },
        /** 搜索截流定时器 */
        timer: null
    },

    /**
     * 组件的方法列表
     */
    methods: {

        /** 点击modal确定(产品) */
        onOk( ) {

            const { list, selectedProduct, selectedProductId } = this.data;

            // 如果没有搜索过 就变搜索
            if ( list.length === 0 ) { 
                return this.fetchList( );

            // 暴露已选
            } else if ( !selectedProductId ) {
                wx.showToast({
                    icon: 'none',
                    title: '请点击选中一个商品'
                })

            } else {

                // 需要选择型号
                if ( this.data.shouldChoiceStander && selectedProduct.standards.length > 0 ) {

                    this.setData({
                        show$: false,
                        show2$: true,
                        selectedStanderIds: [ ],
                    })

                // 不需要选择型号
                } else {
                    this.setData({
                        list: [ ],
                        search: '',
                        selectedStanderIds: [ ],
                        selectedProduct: null,
                        selectedProductId: null
                    });
                    this.triggerEvent('confirm', {
                        _id: selectedProductId,
                        detail: selectedProduct
                    });
                    this.onCancel( );
                }

            }
        },

        /** 点击modal取消（产品） */
        onCancel( ) {
            this.triggerEvent('close');
        },

        /** 设置展开（产品） */
        setShow( val ) {
            this.setData({
                show$: val
            });
        },

        /** 获取列表 */
        fetchList( ) {
            const { search, lastSearch } = this.data;

            this.setData({
                lastSearch: search,
                lastSearchTime: new Date( ).getTime( )
            });

            if ( !search || !search.trim( )) {
                return wx.showToast({
                    icon: 'none',
                    title: '请输入搜索关键词'
                })
            }

            if ( lastSearch === search ) {
                return; 
            }

            http({
                data: {
                    page: 1,
                    title: search.replace(/\s+/g, "")
                },
                errMsg: '加载失败，请重试',
                url: `good_list`,
                success: res => {
                    const { status, data } = res;

                    if ( status !== 200 ) { return; }

                    if ( data.search !== search ) {
                        return;
                    }

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
                        list: meta,
                        lastSearch: search,
                        selectedProduct: null,
                        selectedProductId: null
                    });

                }
            });
        },

        /** 搜索输入 */
        onInput({ detail }) {
            const { timer } = this.data;
            this.setData({
                search: detail.value.replace(/\s+/g, "")
            });

            if ( timer ) {
                clearTimeout( timer );
            }

            this.setData({
                timer: setTimeout(( ) => this.fetchList( ), 500 )
            });
        },

        /** 选择商品 */
        onChoice({ currentTarget }) {
            const { item } = currentTarget.dataset;
            this.setData({ 
                selectedProduct: item,
                selectedProductId: item._id
            });
        },

        /** 展开/关闭产品框 */
        toggleStander( ) {
            const { show2$ } = this.data;
            this.setData({
                show2$: show2$ ? false : true
            });

            if ( show2$ ) {
                this.setData({
                    list: [ ],
                    search: '',
                    selectedProduct: null,
                    selectedProductId: null,
                    selectedStanderIds: [ ]
                });
            }
        },

        /** 关闭产品框 */
        closeStander( ) {
            this.setData({
                show2$: false
            });

            if ( show2$ ) {
                this.setData({
                    list: [ ],
                    search: '',
                    selectedProduct: null,
                    selectedProductId: null,
                    selectedStanderIds: [ ]
                });
            }
        },

        /** 点击型号 */
        onTapStander({ currentTarget }) {

            const { selectedStanderIds, selectedStanderIdObj } = this.data;
            let selectedStanderIdObj$ = Object.assign({ }, selectedStanderIdObj );

            const { data } = currentTarget.dataset;
            const sid = data._id;
            
            const existedIndex = selectedStanderIds.findIndex( x => x === sid );
            // 如果已经存在
            if ( existedIndex !== -1 ) {
                selectedStanderIds.splice( existedIndex, 1 );
                delete selectedStanderIdObj$[ sid ];

            } else {
                selectedStanderIds.push( sid );
                selectedStanderIdObj$ = Object.assign({ }, selectedStanderIdObj$, {
                    [ sid ]: true
                });
            }

            this.setData({
                selectedStanderIds,
                selectedStanderIdObj: selectedStanderIdObj$
            });
        },

        /** 确认型号 */
        onOk2( ) {
            const { list, selectedProduct, selectedProductId, selectedStanderIds } = this.data;
            const { standards } = selectedProduct;

            if ( selectedStanderIds.length === 0 ) {
                return wx.showToast({
                    icon: 'none',
                    title: '请至少选择一个型号',
                });
            }

            this.triggerEvent('confirm', {
                _id: selectedProductId,
                detail: Object.assign({ }, selectedProduct, {
                    standards: standards.filter( x => !!selectedStanderIds.find( sid => sid === x._id ))
                })
            });
            // 型号关闭比较特殊，要由外层关闭
            // this.toggleStander( );
        }
    }
})
