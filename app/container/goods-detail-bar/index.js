const app = getApp( );
const { http } = require('../../util/http.js');
const { wxPay } = require('../../util/pay.js');
const { navTo } = require('../../util/route.js');
const { createOrders } = require('../../util/order.js');
const { computed } = require('../../lib/vuefy/index.js');

Component({

    // behaviors: [require('../../behaviores/computed/index.js')],
    /**
     * 组件的属性列表
     */
    properties: {

        // 是否在预览模式
        preview: {
            type: Boolean,
            value: false
        },

        // 行程id
        tid: {
            type: String,
            value: '',
            observer: 'checkPrePay'
        },

        // 商品详情
        detail: {
            type: Object,
            value: { },
            observer: 'dealDetail'
        },
        // 活动列表
        activities: {
            type: Object,
            value: [ ]
        },
        /**
         * 本躺行程，可以拼团的列表
         * [{ pid: string, sid: string }]
         */
        canPinSku: {
            type: Array,
            value: [ ]
        },
        /** 是否有sku可以拼团 */
        someCanPin: {
            type: Boolean,
            value: false
        },
        /** 
         * 本躺行程的购物清单 
         * 全属性，且不止自己
         */
        tripShoppinglist: {
            type: Array,
            value: [ ]
        },
        /** 此产品是否可以拼团 */
        canPin: {
            type: Boolean,
            value: true
        },
        /** 行程详情 */
        tripDetail: {
            type: Object,
            value: { }
        }
    },

    /**
     * 组件的初始数据
     */
    data: {
        openid: '',
        // 按钮列表
        btnList: [
            {
                label: '商城',
                url: '/pages/trip-enter/index',
                src: 'https://global-1257764567.cos.ap-guangzhou.myqcloud.com/good-bar-home4.png'
            },
            {
                label: '钱',
                url: '/pages/ground-pin/index',
                src: 'https://global-1257764567.cos.ap-guangzhou.myqcloud.com/icon-sheng.png'
            }
            // {
            //     label: '行程',
            //     url: '/pages/index/index',
            //     src: 'https://global-1257764567.cos.ap-guangzhou.myqcloud.com/good-bar-train4.png'          
            // },
            // {
            //     label: '购物车',
            //     url: '/pages/cart-list/index',
            //     src: 'https://global-1257764567.cos.ap-guangzhou.myqcloud.com/good-bar-cart4.png'          
            // }
        ],
        // 库存
        hasStock: true,
        // 动画
        animationSku: null,
        // 动画
        animationSkuBg: null,
        // 展开sku
        openSku: false,
        // 选择sku的类型：cart、buy，（购物车、立即购买）
        skuSelectType: null,
        /** 是否进行了用户授权 */
        isUserAuth: false,

        // 是否为新客
        isNew: true,

        // 是否需要付订金
        shouldPrepay: true,

        // 按钮禁止点击
        disabled: false,
    },

    // computed: {

    // },

    /**
     * 组件的方法列表
     */
    methods: {
        runComputed( ) {
            computed( this, {
                /**
                 * @description
                 * sku展示队列
                 * _id
                 * img 图片
                 * sid 型号id
                 * pid 产品id
                 * stock 库存
                 * title 名称
                 * price 价格
                 * limit 限购数量
                 * canSelect 是否能选
                 * canPin 本趟是否能拼团
                 */
                skuItems$( ) {
                    const { detail, activities, canPinSku } = this.data;

                    if ( !detail ) { 
                        return [ ];
                    }

                    let skuItems = [ ];
                    const { _id, stock, standards, price, title, img, limit, groupPrice } = detail;

                    if ( standards.length === 0 ) {
                        // 只有单品本身
                        const ac = activities.find( ac => ac.pid === _id );

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
                            canPin: !!canPinSku.find( x => x.pid === _id ),
                            canSelect: stock !== 0
                        }];

                        // 根据活动 更改价格
                        if ( ac ) {
                            skuItems = [ Object.assign({ }, skuItems[ 0 ], {
                                acid: ac._id,
                                price: ac.ac_price,
                                groupPrice: ac.ac_groupPrice
                            })];
                        }
                    } else {

                        // 有型号
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
                            canPin: !!canPinSku.find( y => y.pid === x.pid && y.sid === x._id ),
                            canSelect: x.stock !== 0
                        }))

                        // 根据活动 更改价格
                        skuItems = skuItems.map( sku => {
                            const target = activities.find( ac => ac.pid === sku.pid && ac.sid === sku.sid );
                            return Object.assign({ }, sku, {
                                acid: target ? target._id : undefined,
                                price: target ? target.ac_price : sku.price,
                                groupPrice: target ? target.ac_groupPrice : sku.groupPrice,
                            });
                        });
                    } 
                    return skuItems;
                },
                /**
                 * 此账号，是否有单
                 */
                hasOrder$( ) {
                    const { openid, tripShoppinglist } = this.data;
                    const r = (tripShoppinglist || [ ])
                        .filter( sl => {
                            const { uids } = sl;
                            return uids.includes( openid );
                        })
                    
                    const result = Array.isArray( tripShoppinglist ) && tripShoppinglist.length > 0
                        ? r.length > 0 : false;
                    return result;
                },
                /**
                 * 此账号，是否所有已下单sku中，均已经拼团成功
                 */
                allPinSuccess$( ) {
                    const { openid, tripShoppinglist } = this.data;
                    const r = (tripShoppinglist || [ ])
                        .filter( sl => {
                            const { uids } = sl;
                            return uids.includes( openid );
                        })
                        .every( sl => {
                            return (sl.uids || [ ]).length > 1;
                        });

                    return Array.isArray( tripShoppinglist ) && tripShoppinglist.length > 0
                        ? r : false;
                },
                /**
                 * 现在到凌晨1点的倒计时
                 */
                countDownNight$( ) {
                    const now = new Date( );
                    const y = now.getFullYear( );
                    const m = now.getMonth( ) + 1;
                    const d = now.getDate( );
                    const todayOne = new Date(`${y}/${m}/${d} 01:00:00`);
                    const tomorrowOne = todayOne.getTime( ) + 24 * 60 * 60 * 1000;
                    return (( tomorrowOne - Date.now( )) / 1000 ).toFixed( 0 );
                },
                /**
                 * 现在到行程结束的倒计时
                 */
                countDownTrip$( ) {
                    const tripDetail = this.data.tripDetail || { };
                    const { end_date } = tripDetail;
                    if ( !end_date ) { return 0; }
                    return (( end_date - Date.now( )) / 1000 ).toFixed( 0 );
                },
                /**
                 * 是否有错误而不能购买商品
                 */
                hasErr$( ) {
                    const { preview, detail, hasStock } = this.data;
                    if ( !preview && !!detail && detail.isDelete ) {
                        return '已删除'
                    }
                    if ( !preview && !!detail && !detail.visiable ) {
                        return '已下架'
                    }
                    if ( !preview && !!detail && detail.visiable && !hasStock ) {
                        return '已售罄'
                    }
                    return ''
                }
            });
        },
        /** 监听全局状态 */
        watchRole( ) {
            app.watch$('openid', val => {
                this.setData({
                    openid: val
                });
            });
            app.watch$('isUserAuth', val => {
                if ( val === undefined ) { return; }
                this.setData({
                    isUserAuth: val
                });
            });
        },
        /** 检查是否需要付订金 */
        checkPrePay( tid ) {
            if ( !tid ) { return; }
            http({
                data: {
                    tid
                },
                url: 'common_should-prepay',
                success: res => {
                    const { status, data } = res;
                    if ( status !== 200 ) { return; }
                    const { isNew, shouldPrepay } = data;
                    this.setData({
                        isNew,
                        shouldPrepay
                    });
                }
            })
        },
        onSubscribe( e ) {
            app.getSubscribe('buyPin,waitPin,buy');
        },
        /** 展开/关闭 sku */
        toggleSku( e ) {
            const { openSku, disabled } = this.data;

            if ( disabled && !openSku ) {
                return;
            }

            this.setData({
                openSku: !openSku
            });
            if ( !openSku && e ) {
                this.setData({
                    skuSelectType: e.currentTarget.dataset.type || 'buy'
                });
            }

            // 发布
            this.triggerEvent('toggle', !openSku );
        },
        /** 关闭sku */
        onCloseSku( e ) {
            this.setData({
                openSku: e.detail
            });
            this.triggerEvent('toggle', false );
        },
        /** 选择sku */
        onConfirmSku( e ) {
            const selectedSku = e.detail.sku;
            const { form_id } = e.detail;
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
                this.buy( skuItem, form_id );
            }
        },
        /** 处理商品详情 */
        dealDetail( data ) {
            if ( !data ) { return; }

            let result = false;
            const that = this;
            const { _id, stock, standards, price, title, img, limit, groupPrice } = data;
                    
            if ( standards.length === 0 ) {
                // 只有单品本身
                result = stock !== 0

            } else {
                // 有型号
                result = standards.some( x => x.stock !== 0 )
            } 
            
            that.setData({
                hasStock: result
            });
        },
        /** 加入购物车 */
        putCart( item ) {
            const { preview } = this.data;
            const { count, current_price, pid, standard_id } = item;

            if ( preview ) { return; }

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
        buy( item, form_id ) {

            const { tid, shouldPrepay, preview, disabled } = this.data;
            const { sid, pid, price, count, img, title, groupPrice, acid } = item;

            if ( preview || disabled ) { return; }

            // 判断是否没有最新行程
            if ( !tid ) {
                return wx.showToast({
                    icon: 'none',
                    title: '暂无行程计划，暂时不能购买～'
                });
            }

            this.setData({
                disabled: true
            });

            // 地址选择
            wx.chooseAddress({
                success: res => {
            
                    const { userName, provinceName, cityName, countyName, detailInfo, postalCode, telNumber } = res;
                    const orderObj = {
                        type: 'pre', // 预付类型订单，
                        sid,
                        pid,
                        tid,
                        acid,
                        price,
                        count,
                        img: [ img ],
                        depositPrice: shouldPrepay ? this.data.detail.depositPrice || 0 : 0,
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

                    createOrders( tid, [ orderObj ], 'buy', orders => {
                      
                        // 发起微信支付
                        let total_fee = orders.reduce(( x, y ) => {
                            const { pay_status, depositPrice } = y;
                            const deposit_price = pay_status === '0' && !!depositPrice ? depositPrice : 0;
                            return x + deposit_price * y.count;
                        }, 0 );

                        if ( !shouldPrepay ) {
                            total_fee = 0;
                        }
                      
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
                                        prepay_id,
                                        form_id
                                    },
                                    success: res => {

                                        this.setData({
                                            disabled: false
                                        });
                        
                                        if ( res.status === 200 ) {
                                            total_fee && wx.showToast({
                                                title: '支付成功'
                                            });
                                        } else {
                                            wx.showToast({
                                                icon: 'none',
                                                title: '刷新失败，请联系管理员'
                                            });
                                            // pay( );
                                        }
                                    }
                                });
                            }
                            pay( );
                        }, ( ) => {
                            this.setData({
                                disabled: false
                            });
                            // 失败/成功-订单列表
                            navTo('/pages/order-list/index');
                        });

                    }, ( ) => {
                        this.setData({
                            disabled: false
                        });
                    });
                },
                fail: res => {
                    this.setData({
                        disabled: false
                    });
                }
            });
            
        },
        /** 地址跳转 */
        navigate( e ) {
            const { preview } = this.data;
            !preview && navTo( e.currentTarget.dataset.url );
        },
        /** 获取用户信息授权 */
        getUserAuth( ) {
            app.getWxUserInfo(( ) => {
                // 进行结算
                this.batchSettle( );
            });
        },
        /** 拼团广场 */
        goGroundPin( ) {
            navTo('/pages/ground-pin/index')
        }
    },

    attached: function( ) {
        this.runComputed( );
        this.watchRole( );
    }

})
