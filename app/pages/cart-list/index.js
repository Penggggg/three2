// app/pages/cart-list/index.js

const { http } = require('../../util/http.js');
const { computed } = require('../../lib/vuefy/index.js');

const app = getApp( );

Page({

    /**
     * 页面的初始数据
     */
    data: {
        /** 购物车列表 含商品详情、型号详情 */
        cartList: [ ],
        /** 当前选中的购物车的id列表 */
        selectCartIdList: [ ],
        /** 选中购物车的总金额 */
        sum: 0,
        /** 是否全选 */
        isSelectAll: false,
        /** 是否弹出sku */
        openSku: false,
        /** 当前的sku列表 */
        skuItems: [ ],
        /** 是否已经初始化过购物车清单 */
        hasInitCart: false,
        /** 是否在删除状态 */
        isInDelete: false,
        /** 是否进行了用户授权 */
        isUserAuth: false,
        /** 当前行程 */
        trip: null,
        // 是否新客户
        isNew: true,
        // 订金总额
        sum2: 0
    },

    /** 设置computed */
    runComputed( ) {
        computed( this, {
            // 是否需要付订金
            needPrePay: function( ) {
                const { isNew, trip } = this.data;
                if ( !trip ) { return true; }
                if ( isNew && trip.payment === '0' ) {
                    return true;

                } else if ( isNew && trip.payment === '1' ) {
                    return true;

                }  else if ( isNew && trip.payment === '2' ) {
                    return false;
                    
                } else if ( !isNew && trip.payment === '0' ) {
                    return false;
                    
                }  else if ( !isNew && trip.payment === '1' ) {
                    return true;
                    
                } else if ( isNew && trip.payment === '2' ) {
                    return false;
                    
                } else {
                    return true;
                }
            }
        });
    },

    /** 监听全局新旧客 */
    watchRole( ) {
        app.watch$('isNew', val => {
            this.setData({
                isNew: val
            })
        });
    },

    /** 拉取购物车列表 */
    fetchList: function( ) {
        const that = this;

        if ( !this.data.hasInitCart ) {
            wx.showLoading({
                title: '加载中...',
            });
        }
        
        http({
            data: { },
            url: `cart_list`,
            success: res => {
     
                const { status, data } = res;
                
                if ( status !== 200 ) { return; }
        
                // 处理：计算当前选择的sku，并设置为current
                const dealed = data.map( x => {

                    let current = null;
                    const { cart, detail } = x;

                    // 为当前sku注入一些公共属性
                    // 数量使用 库存、所选数量的最小值
                    const decorateCurrent = current => Object.assign({ }, current, {
                        depositPrice: detail.depositPrice || 0,
                        pid: detail._id,
                        title: detail.title,
                        limit: detail.limit,
                        // 当前已选数量
                        count: cart.count,
                        count$: current.stock && current.stock < cart.count ? current.stock : cart.count,
                        // 之前选中时候的价格
                        lastPrice: cart.current_price,
                        // 是否需要支付订金

                    });

                    // 如果只有主商品
                    if ( !cart.standard_id ) {

                        const { _id, title, price, img, stock, limit, groupPrice } = detail;

                        // 如果商品的型号还是为 0 
                        if ( detail.standards.length === 0 ) {
                            current = {
                                sid: null,
                                standardName: null,
                                stock,
                                price,
                                groupPrice,
                                img: detail.img[ 0 ],
                                outOfStock: stock === 0,
                                // 团购差价
                                groupPriceGap: groupPrice ? Math.floor( price - groupPrice ) : 0
                            }
                            current = decorateCurrent( current );
                        } else {
                            // 重选型号
                            current = {
                                title: detail.title,
                                img: detail.img[ 0 ],
                                hasBeenDelete: true
                            }
                        }
                        

                    // 如果有型号sku
                    } else {

                        const currentStandard = detail.standards.find( x => x._id === cart.standard_id );

                        // sku有可能被删除，当sku被删除时，要显示“请重选商品规格”
                        if ( currentStandard ) {
                            const { name, price, img, stock, groupPrice } = currentStandard;

                            current = {
                                img,
                                price,
                                stock,
                                groupPrice,
                                standardName: name,
                                sid: cart.standard_id,
                                outOfStock: stock === 0,
                                // 团购差价
                                groupPriceGap: groupPrice ? Math.floor( price - groupPrice ) : 0
                            };
                            current = decorateCurrent( current );
                        } else {
                            // sku被删除
                            current = {
                                title: detail.title,
                                img: detail.img[ 0 ],
                                hasBeenDelete: true
                            }
                        }
                        
                    }
                    
                    return Object.assign({ }, x , {
                        current,
                        visiable: detail.visiable,
                        // 勾选框
                        selected: !!this.data.selectCartIdList.find( x => x === cart._id )
                    });
                });
                
                this.setData({
                    cartList: dealed,
                    hasInitCart: true
                });

                this.calculateSum( );
            }
        });

    },

    /**  选中、取消选中某个商品 */
    toggleSelectCart: function( e ) {

        const { selectCartIdList, cartList } = this.data;
        const { detail, currentTarget } = e; 
        const cart_id = currentTarget.dataset.cart.cart._id;
        const currentCart = cartList.find( x => x.cart._id === cart_id );
        const currentCartIndex = cartList.findIndex( x => x.cart._id === cart_id );

        // 插入
        if ( detail.value ) {
            const isExisted = selectCartIdList.find( x => x === cart_id );
            const newList = isExisted ? selectCartIdList : [ ...selectCartIdList, cart_id ];
            this.setData({
                selectCartIdList: newList,
                isSelectAll: newList.length === cartList.length
            });
        } else {
            // 移除
            const index = selectCartIdList.findIndex( x => x === cart_id );
            selectCartIdList.splice( index, 1 );
            // 同时关闭全选
            this.setData({
                isSelectAll: false,
                selectCartIdList: [ ...selectCartIdList ]
            });
        }

        const tempList = [ ...cartList ];
        tempList.splice( currentCartIndex, 1, Object.assign({ }, currentCart, {
            selected: !currentCart.selected
        }))
        this.setData({
            cartList: tempList
        });

        this.calculateSum( )
    },

    /** 全选、取消全选 */
    toggleSelectAll: function( e ) {
        const { value } = e.detail;
        const { cartList } = this.data;
        // 全选
        if ( value ) {
            const { selectCartIdList, cartList } = this.data;
            this.setData({
                isSelectAll: true,
                selectCartIdList: cartList.map( x => x.cart._id )
            });
            this.calculateSum( );
        } else {
            // 取消全选
            this.setData({
                sum: 0,
                sum2: 0,
                isSelectAll: false,
                selectCartIdList: [ ]
            });
        }

        const tempList = cartList.map( x => Object.assign({ }, x, {
            selected: value
        }));

        this.setData({
            cartList: tempList
        });
        
    },

    /** 跳往商品详情 */
    goDetail({ currentTarget }) {
        const pid = currentTarget.dataset.cart.detail._id;
        wx.navigateTo({
            url: `/pages/goods-detail/index?id=${pid}`
        });
    },

    /** 计算选中购物车总金额 */
    calculateSum( ) {
        const { selectCartIdList, cartList } = this.data;
        const total = selectCartIdList.reduce(( preSum, nextCid ) => {
            const currentCart = cartList.find( x => x.cart._id === nextCid );
            if ( currentCart ) {
                const { count, price } = currentCart.current;
                return preSum + count * price;
            }
                return preSum + 0;
        }, 0 );
        const total2 = selectCartIdList.reduce(( preSum, nextCid ) => {
            const currentCart = cartList.find( x => x.cart._id === nextCid );
            if ( currentCart ) {
                const { count, depositPrice } = currentCart.current;
                return preSum + count * depositPrice;
            }
                return preSum + 0;
        }, 0 );

        this.setData({
            sum: total,
            sum2: total2
        })
    },

    /** 展开sku */
    toggleSku({ currentTarget }) {
        
        if ( this.data.isInDelete ||  currentTarget.dataset.cart.current.outOfStock ) {
            return; 
        }
        
        let skuItems = [ ];
        const { detail, cart, current } = currentTarget.dataset.cart;
        const { _id, stock, standards, price, title, img, limit } = detail;
    
        if ( standards.length === 0 ) {
            // 只有单品本身
            skuItems = [{
                _id,
                title: '默认型号',
                price,
                stock,
                pid: _id,
                img: img[ 0 ],
                sid: null,
                limit,
                // 加入已有计数
                count: current.hasBeenDelete ? 1 : current.count$,
                // 购物车id
                cart_id: cart._id,
                canSelect: stock !== undefined && stock > 0
            }];
        } else {
            // 有型号 - 型号需要排序 - 目前购物车的型号，需要排在第一位，让sku默认选择上
            skuItems = standards.map( x => ({
                _id: x._id,
                sid: x._id,
                pid: x.pid,
                title: x.name,
                img: x.img,
                stock: x.stock,
                price: x.price,
                limit: x.limit,
                // 加入已有计数
                count: current.hasBeenDelete ? 1 : current.count$,
                // 购物车id
                cart_id: cart._id,
                canSelect: x.stock !== undefined && x.stock > 0
            }));

            // 当前已选中的型号
            const currentCartInStandards = skuItems.find( x => x.sid === cart.standard_id );
            if ( currentCartInStandards ) {

                // 当前已选中的型号下标
                const currentCartInStandardsIndex = skuItems.findIndex( x => x.sid === cart.standard_id );
                // 重新插入到数组头部
                skuItems.splice( currentCartInStandardsIndex, 1 );
                skuItems.unshift( currentCartInStandards );
            }
            
        };
      
        this.setData({
            skuItems,
            openSku: true
        })
    },

    /** 关闭sku */
    onCloseSku( e ) {
        this.setData({
            openSku: e.detail
        });
    },

    /** 确认选择sku */
    onConfirmSku( e ) {
        const selectedSku = e.detail;
        const { cart_id, count, price, pid, sid } = selectedSku;

        // 重组
        const updateItem = {
            pid,
            count,
            _id: cart_id,
            standard_id: sid,
            current_price: price
        };

        http({
            data: updateItem,
            errMsg: '更新失败，请重试',
            loadingMsg: '更新中...',
            url: `cart_update`,
            success: res => {
                if ( res.status === 200 ) {
                    this.fetchList( );
                }
            }
        });
    },

    /** 点击管理，进入删除状态 */
    toggleDelete( ) {
        this.setData({
            isInDelete: !this.data.isInDelete
        });
    },

    /** 确认删除 */
    confirmDelete( ) {
        const { selectCartIdList } = this.data;

        wx.showModal({
            title: '提示',
            content: '您确认删除以下宝贝吗?',
            cancelColor: '#ff5777',
            confirmColor: '#999999',
            success: res => {
                if (res.confirm) {

                    http({
                        data: {
                            ids: selectCartIdList.join(',')
                        },
                        errMsg: '删除失败，请重试',
                        loadingMsg: '删除中...',
                        url: `cart_delete`,
                        success: res => {
                            const { status, } = res;
                            if ( status !== 200 ) { return; }
                            
                            wx.showToast({
                                title: '删除成功',
                            });
            
                            this.fetchList( );
                            this.setData({
                                isInDelete: false
                            });
                        }
                    });

                }
            }
        });

    },

    /** 监听用户授权情况 */
    checkAuth( ) {
        app.watch$('isUserAuth', val => {
            if ( val === undefined ) { return; }
            this.setData({
                isUserAuth: val
            })
        });
    },

    /** 获取用户信息授权 */
    getUserAuth( ) {
        app.getWxUserInfo(( ) => {
            // 进行结算
            this.batchSettle( );
        });
    },

    /** 批量进行购物车结算 */
    batchSettle( ) {
        const { cartList, selectCartIdList, trip } = this.data;
        if ( selectCartIdList.length === 0 ) { return; }

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

                // 购物车商品
                const selectedCheck = selectCartIdList.map( cid => {
                    const temp = cartList.find( x => x.cart._id === cid );
                    if ( temp ) {
                        const { pid, sid, count, price, groupPrice, img, standardName, title, depositPrice } = temp.current;
                        return {
                            sid,
                            pid,
                            count,
                            price,
                            img: [ img ],
                            groupPrice,
                            tid: trip._id,
                            depositPrice,
                            type: 'pre', // 预付类型订单，
                            cid: temp.cart._id,
                            name: `${title}`,
                            standername: standardName,
                            address: {
                                username: userName,
                                postalcode: postalCode,
                                phone: telNumber,
                                address: `${provinceName}${cityName}${countyName}${detailInfo}`
                            }
                        }
                    }
                    return null; 
                }).filter( x => !!x );

                /**
                 * 判断在购物清单，这些商品是否存在 买不全、买不到
                 * ! 或货存不足
                 */
                http({
                    data: {
                        tid: trip._id,
                        list: selectedCheck
                    },
                    url: `shopping-list_findCannotBuy`,
                    success: res => {
                        const { status, data } = res;
                        if ( status !== 200 ) { return; }
                        const { hasBeenBuy, cannotBuy, hasBeenDelete, lowStock } = data;

                        /** 提示行程无货 */
                        const cannotBuy$ = cannotBuy.map( x => {
                            return this.data.cartList.find( y => ( y.current.pid === x.pid && y.current.sid === x.sid ) 
                                || ( y.current.pid === x.pid && !y.current.sid && !x.sid ));
                        });
                        if ( cannotBuy.length > 0 ) {
                            return wx.showModal({
                                title: '提示',
                                content: `火爆缺货！${cannotBuy$.map( x => `${x.current.title}${x.current.standardName}`).join('、')}暂时无货！`
                            });
                        }

                        /** 商品被删除 */
                        const hasBeenDelete$ = hasBeenDelete.map( x => {
                            return this.data.cartList.find( y => ( y.current.pid === x.pid && y.current.sid === x.sid )
                                || ( y.current.pid === x.pid && !y.current.sid && !x.sid ));
                        });
                        if ( hasBeenDelete.length > 0 ) {
                            return wx.showModal({
                                title: '提示',
                                content: `${hasBeenDelete$.map( x => `${x.current.title}${x.current.standardName}`).join('、')}已被删除，请重新选择！`
                            });
                        }

                        /** 提示低库存 */
                        const lowStock$ = lowStock.map( x => {
                            return this.data.cartList.find( y => ( y.current.pid === x.pid && y.current.sid === x.sid )
                                || ( y.current.pid === x.pid && !y.current.sid && !x.sid ))
                        });
                        if ( lowStock.length > 0 ) {
                            return wx.showModal({
                                title: '提示',
                                content: `${lowStock$.map( x => `${x.current.title}${x.current.standardName}`).join('、')}货存不足，请重新选择！`
                            });
                        }

                        /** 已经购买提示 */
                        const hasBeenBuy$ = hasBeenBuy.map( x => {
                            return this.data.cartList.find( y => ( y.current.pid === x.pid && y.current.sid === x.sid )
                                || ( y.current.pid === x.pid && !y.current.sid && !x.sid ))
                        });

                        if ( hasBeenBuy.length > 0 ) {
                            wx.showToast({
                                icon: 'none',
                                duration: 3000,
                                title: `群主已经买了${hasBeenBuy$.map( x => `${x.current.title}${x.current.standardName}`).join('、')}，不一定会返程购买，请联系群主！`
                            });
                        }
                        

                        return console.log('????', data );

                        // 计算需要交的订金
                        const allDepositPrice = canBuy.reduce(( x, y ) => {
                            return x + y.current.count$ * ( y.detail.depositPrice || 0 );
                        }, 0 );

                        // 计算需要交全款的
                        const allPrice = canBuy.reduce(( x, y ) => {
                            return x + y.current.count$ * y.current.price;
                        }, 0 );
                        
                        // 发起支付：类型为，订金支付、全款支付，然后更新所有预付订单号状态
                        // 判断支付对象：0: 新客付订金/旧客免订金;1: 所有人付定金; 2: 所有人免定金; 3: 所有人付全额
                        const { payment } = this.data.trip
                        if ( payment !== '2' ) {
                            
                        }

                        /**
                         * ! 提示无法加入订单的商品
                         * ! 重新刷新购物车，因为成功加入清单的购物车的商品，这个商品的购物车会被删除掉
                         */
                    }
                });


            }
        });

    },

    /** 发起微信支付 */
    wxPay( ) {
        http({
            url: 'common_wxpay',
            data: {
                total_fee: 100
            },
            errMsg: '支付失败，请重试',
            success: res => {
                if ( res.status !== 200 ) { return; }
                const { nonce_str, paySign, prepay_id, timeStamp } = res.data;
                wx.requestPayment({
                    paySign,
                    timeStamp,
                    signType: 'MD5',
                    nonceStr: nonce_str,
                    package: `prepay_id=${prepay_id}`,
                    success: res => {
                        const { errMsg } = res;
                        if ( errMsg === 'requestPayment:ok' ) {
                            // 支付成功
                        }
                    },
                    fail: err => {
                        console.log( 'err', err );
                        wx.showToast({
                            icon: 'none',
                            title: '支付失败，请重试'
                        })
                    }
                });
            }
        })
    },

    /** 拉取最新可用行程 */
    fetchTrip( ) {
        http({
            data: { },
            url: `trip_enter`,
            success: res => {
                if ( res.status === 200 ) {
                    this.setData({
                        trip: res.data[ 0 ] ? this.dealTrip( res.data[ 0 ]) : null
                    });
                }
            }
        });  
    },

    /** 处理详情 */
    dealTrip( tripDetail ) {

        const { start_date, end_date } = tripDetail;
        const MMdd = timestamp => {
            const d = new Date( timestamp );
            return `${d.getMonth( ) + 1}月${d.getDate( )}日`
        }

        return Object.assign({ }, tripDetail, {
            end_date$: MMdd( end_date ),
            start_date$: MMdd( start_date )
        });
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.watchRole( );
        this.checkAuth( );
        this.runComputed( );
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function ( ) {
        this.fetchList( );
        this.fetchTrip( );
    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },

    /**
     * 用户点击右上角分享
     */
    // onShareAppMessage: function () {

    // }
})