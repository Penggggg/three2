const app = getApp( );
const { http } = require('../../util/http.js');
const { wxPay } = require('../../util/pay.js');
const { createOrders } = require('../../util/order.js');

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
        // 选择sku的类型：cart、buy，（购物车、立即购买）
        skuSelectType: null,
        // 可用想起
        trip: null,
        /** 是否进行了用户授权 */
        isUserAuth: false,
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
                });
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
            const skuItem = Object.assign({ }, selectedSku, {
                pid: this.data.detail._id,
                standard_id: selectedSku.sid,
                current_price: selectedSku.price
            });

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
            const { _id, stock, standards, price, title, img, limit, groupPrice } = data;
                    
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
                    groupPrice,
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
                    groupPrice: x.groupPrice,
                    canSelect: x.stock !== undefined && x.stock > 0
                }))
            } 
            
            that.setData({
                skuItems,
                hasStock: result
            });
        },
        /** 加入购物车 */
        putCart( item ) {
            
            const { count, current_price, pid, standard_id } = item;

            http({
                data: {
                    count, current_price, pid, standard_id
                },
                errMsg: '添加失败，请重试',
                loadingMsg: '添加中...',
                url: `cart_edit`,
                success: res => {
                    if ( res.status === 200 ) {
                        wx.showToast({
                            title: '添加成功'
                        });
                    }
                }
            });

        },
        /** 立即购买 */
        buy( item ) {

            const { trip } = this.data;
            const { sid, pid, price, count, img, title, groupPrice } = item;

            // 判断是否没有最新行程
            if ( !trip ) {
                return wx.showToast({
                    icon: 'none',
                    title: '暂无行程计划，暂时不能购买～'
                });
            }

            // 地址选择
            wx.chooseAddress({
                success: res => {
            
                    const { userName, provinceName, cityName, countyName, detailInfo, postalCode, telNumber } = res;
                    const orderObj = {
                        type: 'pre', // 预付类型订单，
                        sid,
                        pid,
                        tid: trip._id,
                        price,
                        count,
                        img: [ img ],
                        depositPrice: this.data.detail.depositPrice || 0,
                        name: this.data.detail.title,
                        standername: title,
                        groupPrice,
                        address: {
                            username: userName,
                            postalcode: postalCode,
                            phone: telNumber,
                            address: `${provinceName}${cityName}${countyName}${detailInfo}`
                        }
                    };

                    createOrders( trip._id, [ orderObj ], 'buy', orders => {
                      
                        // 发起微信支付
                        const total_fee = orders.reduce(( x, y ) => {
                            const { pay_status, depositPrice } = y;
                            const deposit_price = pay_status === '0' && !!depositPrice ? depositPrice : 0;
                            return x + deposit_price * y.count;
                        }, 0 );
                      
                        // 支付里面
                        wxPay( total_fee, ({ prepay_id }) => {
            
                            // 批量更新订单为已支付
                            const pay = ( ) => {
                        
                                http({
                                    url: 'order_upadte-to-payed',
                                    data: {
                                        orderIds: orders.map( x => {
                                            return x.pay_status === '0' || x.pay_status === '1' ? x.oid : ''
                                        })
                                        .filter( x => !!x )
                                        .join(','),
                                        prepay_id
                                    },
                                    success: res => {
                        
                                        if ( res.status === 200 ) {
                                            total_fee && wx.showToast({
                                                title: '支付成功'
                                            });
                                        } else {
                                            wx.showToast({
                                                icon: 'none',
                                                title: '支付成功，刷新失败，重试中...'
                                            });
                                            pay( );
                                        }
                                    }
                                });
                            }
                            pay( );
                        }, ( ) => {
                            // 失败/成功-订单列表
                            wx.navigateTo({
                                url: '/pages/order-list/index'
                            });
                        });

                    }, ( ) => {
                        // this.setData({
                        //     isSettling: false
                        // });
                    });

                }
            });
            
        },
        /** 拉取最新可用行程 */
        fetchTrip( ) {
            http({
                data: { },
                url: `trip_enter`,
                success: res => {
                    if ( res.status === 200 ) {
                        this.setData({
                            trip: res.data[ 0 ] || null
                        });
                    }
                }
            });  
        },
        /** 地址跳转 */
        navigate( e ) {
            wx.navigateTo({
                url: e.currentTarget.dataset.url
            });
        },
        /** 监听用户授权情况 */
        checkAuth( ) {
            app.watch$('isUserAuth', val => {
                if ( val === undefined ) { return; }
                this.setData({
                    isUserAuth: val
                });
            });
        },
        /** 获取用户信息授权 */
        getUserAuth( ) {
            app.getWxUserInfo(( ) => {
                // 进行结算
                this.batchSettle( );
            });
        },
    },

    attached: function( ) {
        this.fetchTrip( );
        this.checkAuth( );
    }

})
