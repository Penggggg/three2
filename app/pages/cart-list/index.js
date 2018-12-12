// app/pages/cart-list/index.js

const app = getApp( );

Page({

    /**
     * 页面的初始数据
     */
    data: {
        /** 加载状态 */
        loading: true,
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
        isUserAuth: false
    },

    /** 拉取商品列表 */
    fetchList: function( ) {
        const that = this;

        if ( !this.data.hasInitCart ) {
            wx.showLoading({
                title: '加载中...',
            });
        }

        this.setData({
            loading: true
        });

        wx.cloud.callFunction({
            data: { },
            name: 'api-cart-list',
            success: res => {
                wx.hideLoading({ });
                const { status, data } = res.result;

                if ( status !== 200 ) { return; }

                // 处理：计算当前选择的sku，并设置为current
                const dealed = data.map( x => {

                    let current = null;
                    const { cart, detail } = x;

                    // 为当前sku注入一些公共属性
                    const decorateCurrent = current => Object.assign({ }, current, {
                        pid: detail._id,
                        title: detail.title,
                        limit: detail.limit,
                        // 当前已选数量
                        count: cart.count,
                        // 之前选中时候的价格
                        lastPrice: cart.current_price
                    });

                    // 如果只有主商品
                    if ( !cart.standard_id ) {

                        const { _id, title, price, img, stock, limit } = detail;

                        // 如果商品的型号还是为 0 
                        if ( detail.standards.length === 0 ) {
                            current = {
                                sid: null,
                                standardName: null,
                                stock,
                                price,
                                img: detail.img[ 0 ]
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
                            const { name, price, img, stock } = currentStandard;
                            current = {
                                img,
                                price,
                                stock,
                                standardName: name,
                                sid: cart.standard_id,
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
            },
            fail: err => {
                wx.showToast({
                    icon: 'none',
                    title: '加载购物车错误',
                });
                wx.hideLoading({ });
            },
            complete: ( ) => {
                this.setData({
                    loading: false
                });
            }
        })
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
        this.setData({
            sum: total
        })
    },

    /** 展开sku */
    toggleSku({ currentTarget }) {
        
        if ( this.data.isInDelete ) {
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
                count: current.hasBeenDelete ? 1 : cart.count,
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
                count: current.hasBeenDelete ? 1 : cart.count,
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
        
        // 更新当前cart
        wx.showLoading({
            title: '更新中...',
        });

        wx.cloud.callFunction({
            name: 'api-cart-update',
            data: updateItem,
            success: res => {
                wx.hideLoading({ });
                const { status } = res.result;
    
                if ( status !== 200 ) { return; }
                wx.showToast({
                    title: '更新成功'
                });
                this.fetchList( );
            },
            fail: err => {
                wx.showToast({
                    icon: 'none',
                    title: '更新失败',
                });
                wx.hideLoading({ });
            }
        })

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

                    wx.showLoading({
                        title: '加载中...',
                    });

                    wx.cloud.callFunction({
                        data: {
                            ids: selectCartIdList.join(',')
                        },
                        name: 'api-cart-delete',
                        success: res => {
                            const { status, data } = res.result;
                            if ( status !== 200 ) { return; }
                            
                            wx.showToast({
                                title: '删除成功',
                            });
            
                            this.fetchList( );
                            this.setData({
                                isInDelete: false
                            });
                        },
                        fail: err => {
                            wx.showToast({
                                icon: 'none',
                                title: '删除购物车失败',
                            });
                        },
                        complete: ( ) => {
                            wx.hideLoading({ });
                        }
                    });
                }
            }
        });

    },

    /** 确认用户授权情况 */
    checkAuth( ) {
        app.watch$('isUserAuth', val => {
            this.setData({
                isUserAuth: val
            })
        });
    },

    /** 获取用户信息授权 */
    getUserAuth( ) {
        app.getWxUserInfo( );
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

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
        this.checkAuth( );
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