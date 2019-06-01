const { http } = require('../../util/http.js');
const { navTo } = require('../../util/route.js');

Component({

    behaviors: [require('../../behaviores/computed/index.js')],

    /**
     * 组件的属性列表
     */
    properties: {
        // 行程id
        tid: {
            value: '',
            type: String,
            observer: 'init'
        }
    },

    /**
     * 组件的初始数据
     */
    data: {
        title: '', // 行程名称
        clients: 0, // 总客户数
        notPayAllClients: 0, // 未交尾款客户数
        canAction: false, // 是否调整完成，并进行催款
        lastAdjust: 0, // 剩余未调整订单
        clientOders: [ ], // 客户订单,
        showMore: [ ], // 展示更多 uid[ ]
        showModal: false, // 展示弹框
        showDeliverModal: false, // 快递弹框
        currentOrder: null, // 当前选中的订单
        form: { // 弹框表单
            fee: null,
            count: null
        },
        showBtn: false, // 展示行程列表按钮,
        callMoneyTimes: 3 // 行程催款次数
    },

    /** 计算属性 */
    computed: {
        clientOders$( ) {
            
            const { tid, clientOders, showMore, callMoneyTimes } = this.data;

            // 计算当前可结算的商品数量 
            const count$ = order => {
                const b = order.base_status;
                return b === '0' || b === '1' ?
                        order.allocatedCount !== undefined ? order.allocatedCount : order.count :
                        b === '2' || b === '3' ?
                            order.allocatedCount:
                            0;
            }

            const meta = clientOders.map( x => {
                
                const { coupons, orders, deliverFee } = x;

                // 应付全款（不含优惠券）
                let wholePriceNotDiscount = orders.reduce(( x, y ) => {
                    let currentPrice = 0;
                    const { allocatedCount, allocatedPrice, allocatedGroupPrice, canGroup, count, price } = y;
                    if ( y.base_status === '2' || y.base_status === '3' ) {
                        currentPrice = (canGroup && allocatedGroupPrice ? allocatedGroupPrice : allocatedPrice) * count$( y );
                    } else if ( y.base_status === '0' || y.base_status === '1' ) {
                        currentPrice = count$( y ) * ( allocatedPrice || price );
                    } else {
                        currentPrice = 0;
                    }
                    return x + currentPrice;
                }, 0 );

                // 邮费
                const userDeliverFee = !!deliverFee ? Number( Number( deliverFee.fee ).toFixed( 2 )) : null;

                if ( userDeliverFee ) {
                    wholePriceNotDiscount += userDeliverFee;
                }

                // 优惠券
                const coupons_manjian = coupons.find( c => c.type === 't_manjian' && c.tid === tid );
                const coupons_lijian = coupons.find( c => c.type === 't_lijian' && c.tid === tid );
                const coupons_daijin = coupons.find( c => c.type === 't_daijin' && (( !c.isUsed && c.canUseInNext ) || ( !!c.isUsed && c.usedBy === tid )));


                // 处理满减
                const t_manjian = !coupons_manjian ? { value: 0, canUsed: false, isUsed: false, atleast: 0 } : {
                    // 处理真的已用，和即将要用的情况
                    isUsed: coupons_manjian.isUsed || coupons_manjian.atleast <= wholePriceNotDiscount,
                    id: coupons_manjian._id,
                    value: coupons_manjian.value ,
                    atleast: coupons_manjian.atleast,
                    canUsed: coupons_manjian.atleast <= wholePriceNotDiscount || !coupons_manjian.atleast
                };


                // 处理立减
                const t_lijian = !coupons_lijian ? { value: 0, canUsed: false, isUsed: false, atleast: 0 } : {
                    isUsed: true,
                    canUsed: true,
                    id: coupons_lijian._id,
                    value: coupons_lijian.value,
                    atleast: coupons_lijian.atleast,
                };


                // 处理代金券
                const t_daijin = !coupons_daijin ? { value: 0, canUsed: false, isUsed: false, atleast: 0 } : {
                    // 处理真的已用，和即将要用的情况
                    isUsed: coupons_daijin.isUsed || coupons_daijin.atleast <= wholePriceNotDiscount,
                    id: coupons_daijin._id,
                    value: coupons_daijin.value,
                    atleast: coupons_daijin.atleast,
                    canUsed: coupons_daijin.atleast <= wholePriceNotDiscount || !coupons_daijin.atleast
                };


                // 应付全款（含优惠券、拼团折扣）
                let wholePriceByDiscount = wholePriceNotDiscount;
                if ( t_manjian.canUsed ) {
                    wholePriceByDiscount = Number( Number( wholePriceByDiscount - t_manjian.value ).toFixed( 2 ));
                }
                if ( t_lijian.canUsed ) {
                    wholePriceByDiscount = Number( Number( wholePriceByDiscount - t_lijian.value ).toFixed( 2 ));
                } 
                if ( t_daijin.canUsed ) {
                    wholePriceByDiscount = Number( Number( wholePriceByDiscount - t_daijin.value ).toFixed( 2 ));
                }


                // 已付订金
                const hasPayDepositPrice = orders.reduce(( x, y ) => {
                    const depositPrice = String( y.pay_status ) !== '0' ?
                        y.depositPrice || 0 : 0;
                    return Number(Number( x + Number(Number( depositPrice * y.count ).toFixed( 2 ))).toFixed( 2 ));
                }, 0 )


                const retreat = hasPayDepositPrice > wholePriceByDiscount ?
                    (hasPayDepositPrice - wholePriceByDiscount).toFixed( 2 ) : 0;


                // 已经分配好的订单
                const readyOrders = [ ];


                // 未分配好的订单，包含分配不足的订单
                let notReadyOrders = [ ];


                // 分配不足的订单
                const notEnough = [ ];


                // 是否展示更多
                const canShowMore = !!showMore.find( y => y === x.user.openid );
                

                // 处理已分配、未分配订单
                x.orders.map( order => {
                    if ( order.allocatedPrice === undefined ||
                            order.allocatedCount === undefined
                    ) {
                        notReadyOrders.push( order );

                    } else if ( order.allocatedCount < order.count) {
                        notEnough.push( order );

                    }else if ( order.allocatedCount >= order.count ) {
                        readyOrders.push( order );
                    }
                });
                notReadyOrders = [ ...notReadyOrders, ...notEnough ];


                // 根据地址整理订单
                const addressOrders = x.address.map( address => {
                    return {
                        address,
                        isAllOk: x.orders
                            .filter( order => order.aid === address._id )
                            .every( order => !!order.allocatedCount ),
                        orders: x.orders.filter( order => order.aid === address._id )
                    }
                });


                // 是否所有订单都被分配了，包括 0
                const isAllAdjusted = x.orders.every( o => o.allocatedCount !== undefined );


                // 是否全部被分配为0
                const getAllNothing = x.orders
                    .every( o => o.allocatedCount === 0 );


                // 是否已经结算
                const hasBeenGivenMoney = x.orders
                    .filter( o => o.base_status !== '4' && o.base_status !== '5' )
                    .filter( o => !!o.allocatedCount )
                    .every( o => o.base_status === '3' );


                // 是否存在被分配为0
                const getNothing =  x.orders
                    .some( o => o.allocatedCount === 0 );


                // 是否存在货存不足的情况
                const hasNotEnougth = x.orders
                    .some( o => o.allocatedCount !== undefined && o.allocatedCount < o.count );

    
                // 订单中文状态
                let statusCN = !isAllAdjusted ?
                    '待分配' :
                    callMoneyTimes > 0 ?
                        !getAllNothing ?
                            !hasBeenGivenMoney ?
                                '未到帐' :
                                '已到帐' :
                            '' :
                    '';
                if ( !hasBeenGivenMoney && retreat ) {
                    statusCN = '退订金 ' + retreat;
                } 

                return Object.assign({ }, x , {

                    userDeliverFee,

                    hasPayDepositPrice,

                    wholePriceNotDiscount,

                    wholePriceByDiscount,

                    t_manjian,

                    t_lijian,

                    t_daijin,

                    statusCN,

                    retreat,

                    getNothing,

                    getAllNothing,

                    isAllAdjusted,

                    hasBeenGivenMoney,

                    emptyOrders: [ ],

                    // 根据地址展示订单
                    addressOrders,

                    // 是否正在展示更多
                    canShowMore,

                    // 订单列表展示类型
                    key: x.orders.every( o => o.base_status === '2' ) && !canShowMore? 

                            'emptyOrders' :
                            x.orders.every( o => o.base_status === '2' ) && canShowMore ?
                                'allOrders' :
                                !x.orders.every( o => o.base_status === '2' ) && canShowMore ?
                                'allOrders' :
                                'notReadyOrders',

                    // 已经准备好的订单
                    // readyOrders,
                        
                    // 未准备好的订单
                    notReadyOrders,

                    // 按是否准备排序的订单
                    allOrders: [ ...notReadyOrders, ...readyOrders ],

                    // 未被分配的订单量
                    hasNotAdjustedLength: x.orders.filter( o => o.allocatedCount === undefined ).length
                });
            });
       
            return meta;
        },
        lastCallMoneyTimes$( ) {
            const { callMoneyTimes } = this.data;
            return 3 - callMoneyTimes;
        }
    },

    /**
     * 组件的方法列表
     */
    methods: {

        /** 初始化 */
        init( tid ) {
            this.fetchInfo( tid );
            this.fetchOrder( tid );
            this.fetchAdjustStatus( tid );
        },

        /** 拉取客户数量、未付款订单数 */
        fetchInfo( tid ) {
            http({
                url: 'trip_order-info',
                data: {
                    tid
                },
                loadMsg: '加载中...',
                errorMsg: '加载失败，请刷新',
                success: res => {
                    if ( res.status === 200 ) {
                        const { clients, notPayAllClients, callMoneyTimes, title } = res.data;
                        this.setData({
                            title,
                            clients,
                            notPayAllClients
                        });
                        setTimeout(( ) => {
                            this.setData({ callMoneyTimes })
                        }, 100 );
                    }
                }
            })
        },

        /** 拉取分配状态 */
        fetchAdjustStatus( tid ) {
            http({
                url: 'shopping-list_adjust-status',
                data: {
                    tid
                },
                errorMsg: '加载失败，请刷新',
                success: res => {
                    const { status, data } = res;
                    if ( status === 200 ) {
                        this.setData({
                            lastAdjust: data,
                            canAction: data === 0
                        })
                    }
                }
            })
        },

        /** 拉取客户订单列表 */
        fetchOrder( tid ) {
            http({
                url: 'order_daigou-list',
                data: {
                    tid
                },
                loadMsg: '加载中...',
                errorMsg: '加载失败，请刷新',
                success: res => {
                    const { status, data } = res;
                    if ( status === 200 ) {
                        this.setData({
                            clientOders: data
                        })
                    }
                }
            })
        },

        /** 跳到价格调整 */
        goFixPrice( ) {
            this.triggerEvent('tabchange', 0 );
            this.triggerEvent('outline', true );
        },

        /** 展示更多 */
        onShowMore({ currentTarget }) {
            const { showMore } = this.data;
            const userOrders = currentTarget.dataset.data;
            const existedIndex = showMore.findIndex( x => x === userOrders.user.openid );

            if ( existedIndex === -1 ) {
                showMore.push( userOrders.user.openid );
            } else {
                showMore.splice( existedIndex, 1 );
            }

            this.setData({
                showMore
            });
        },

        /** 展示调整快递费用弹框 */
        onShowDeliverModal({ currentTarget }) {
            const currentOrder = currentTarget.dataset.data;
            this.setData({
                currentOrder,
                showDeliverModal: true
            });
        },

        /** 展示调整弹框 */
        onShowModal({ currentTarget }) {
            const currentOrder = currentTarget.dataset.data;

            if ( currentOrder.base_status === '2' ) {
                return wx.showToast({
                    icon: 'none',
                    title: '催款后不能再更改订单数量'
                })
            } else if ( currentOrder.base_status === '0' ) {
                return wx.showToast({
                    icon: 'none',
                    title: '请先调整商品价格'
                })
            }

            this.setData({
                currentOrder,
                showModal: true,
                form: {
                    count: currentOrder.allocatedCount
                }
            });
        },

        /** 取消弹框 */
        onCancelModal( ) {
            this.setData({
                currentOrder: null,
                showModal: false,
                form: {
                    fee: null,
                    count: null
                }
            })
        },

        /** 取消弹框2 */
        onCancelModal2( ) {
            this.setData({
                currentOrder: null,
                showDeliverModal: false,
                form: {
                    fee: null,
                    count: null
                }
            })
        },

        /** 提交订单修改 */
        submitOrder( ) {
            const { currentOrder, form } = this.data;

            if ( form.count === null||
                form.count === undefined ||
                ( typeof form.count === 'string' && !form.count.trim( ))
            ) {
                return this.onCancelModal( );
            }

            const { _id, tid, sid, pid } = currentOrder;
            const temp = {
                oid: _id,
                tid, sid, pid,
                count: Number( form.count )
            };

            http({
                data: temp,
                url: 'order_adjust-count',
                success: res => {
                    if ( res.status === 200 ) {
                        this.onCancelModal( );
                        this.fetchOrder( this.data.tid );
                        setTimeout(( ) => {
                            wx.showToast({
                                title: '分配成功'
                            });
                        }, 0 );
                    }
                }
            });
        },

        /** 提交邮费修改 */
        submitDeliverFee( ) {
            const { currentOrder, form, tid } = this.data;

            if ( form.fee === null||
                form.fee === undefined ||
                ( typeof form.fee === 'string' && !form.fee.trim( ))
            ) {
                return wx.showToast({
                    icon: 'none',
                    title: '费用不能为空'
                })
            }

            const { deliverFee } = currentOrder;
            let temp = {
                tid,
                openid: currentOrder.user.openid,
                fee: Number (Number( form.fee ).toFixed( 0 ))
            }

            if ( deliverFee ) {
                temp = Object.assign({ }, temp, {
                    _id: deliverFee._id
                })
            }

            http({
                data: temp,
                url: 'deliver_adjust-fee',
                success: res => {
                    if ( res.status === 200 ) {
                        this.onCancelModal2( );
                        this.fetchOrder( this.data.tid );
                        setTimeout(( ) => {
                            wx.showToast({
                                title: '更新成功'
                            });
                        }, 0 );
                    }
                }
            });

        },

        /** 弹框输入 */
        modalInput( e ) {
            const { detail, currentTarget } = e;
            const { key } = currentTarget.dataset;
            const { form } = this.data;
            this.setData({
                form: Object.assign({ }, form, {
                    [ key ]: detail.value
                })
            })
        },

        /** 跳往行程列表 */
        goTrip( ) {
            navTo(`/pages/manager-trip-list/index`)
        },

        /** 批量催款 */
        allGetMoney( ) {
            const that = this;
            const { callMoneyTimes } = this.data;
            const isAllAdjusted = this.data.clientOders$.every( o => !!o.isAllAdjusted );
            const isAllHasDeliver = this.data.clientOders$.every( o => !!o.deliverFee );

            const sendGetMoney = ( ) => {
                wx.showModal({
                    title: '提示',
                    content: '发送收款推送后，不能更改订单数量/价格',
                    success: res => {
                        if ( !res.confirm ) { return; }
    
                        const orders$ = [ ];
                        that.data.clientOders$.map( userOrder => {
                            const { user, orders } = userOrder;
                            orders.map( order => {
                                const { _id, prepay_id, form_id, pid, sid, openid, pay_status, allocatedCount, allocatedGroupPrice } = order;
                                const temp = {
                                    oid: _id,
                                    pay_status,
                                    allocatedCount,
                                    allocatedGroupPrice,
                                    prepay_id, form_id, pid, sid, openid
                                };
                                orders$.push( temp );
                            });
                        });
    
                        const data = {
                            tid: that.data.tid,
                            orders: orders$
                        };
    
                        http({
                            data,
                            url: 'order_batch-adjust',
                            success: res => {
                                if ( res.status === 200 ) {
                                    setTimeout(( ) => {
                                        wx.showToast({
                                            duration: 2000,
                                            title: `发送成功`
                                        });
                                        that.setData({
                                            callMoneyTimes: 3 - res.data
                                        });
                                        setTimeout(( ) => {
                                            that.fetchOrder( that.data.tid );
                                        }, 300 );
                                    }, 20 );
                                }
                            }
                        });
    
                    }
                })
            }

            if ( !isAllAdjusted ) {
                return wx.showToast({
                    icon: 'none',
                    title: '请处理待分配订单'
                })
            } 

            if ( !!callMoneyTimes && callMoneyTimes >= 3 ) {
                return wx.showToast({
                    icon: 'none',
                    title: '已超过发送次数'
                });
            }

            if ( !isAllHasDeliver ) {
                wx.showModal({
                    title: '提示',
                    content: '有未调整邮费，确定提交吗？',
                    success: res => {
                        res.confirm && sendGetMoney( )
                    }
                });
            } else {
                sendGetMoney( );
            }

        },

        /** 退订金 */
        giveBackMoney({ currentTarget }) {
            const { tid } = this.data;
            const { data } = currentTarget.dataset;
            const { wholePriceByDiscount, wholePriceNotDiscount, coupons } = data;

            const orders = data.orders.map( order => {
                const { _id, pid, sid, canGroup, allocatedGroupPrice, allocatedCount, allocatedPrice } = order;
                const final_price = !!canGroup && allocatedGroupPrice ?
                    allocatedCount * allocatedGroupPrice :
                    allocatedCount * allocatedPrice;
                return {
                    pid,
                    sid,
                    oid: _id,
                    final_price,
                    allocatedCount,
                }
            });

            const reqData = {
                tid,
                orders,
                coupons,
                integral: wholePriceByDiscount > 0 ? wholePriceByDiscount : wholePriceNotDiscount
            };

            wx.showModal({
                title: '提示',
                content: '确定已退款吗?',
                success: res => {
                    if ( res.confirm ) {
                        http({
                            data: reqData,
                            url: 'order_pay-last',
                            success: res => {
                                if ( res.status === 200 ) {
                                    wx.showToast({
                                        title: '退款成功'
                                    });
                                    this.init( tid );
                                }
                            }
                        });
                    }
                }
            });
        },

        /** 复制快递信息 */
        copyDeliver({ currentTarget }) {
            const { info } = currentTarget.dataset;
            wx.setClipboardData({
                data: `${info.username} ${info.phone} ${info.address} ${info.postalcode}`,
                success: res => {
                    wx.showToast({
                        title: '快递信息复制'
                    });
                }
            })
        }

    },

    attached: function( ) {

    }
})
