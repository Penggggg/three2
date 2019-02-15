const { http } = require('../../util/http.js');

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
        currentOrder: null, // 当前选中的订单
        form: { // 弹框表单
            count: null
        },
        showBtn: false, // 展示行程列表按钮,
        callMoneyTimes: 3 // 行程催款次数
    },

    /** 计算属性 */
    computed: {
        clientOders$( ) {
            
            const { clientOders, showMore, callMoneyTimes } = this.data;
            const meta = clientOders.map( x => {

                // 已经分配好的订单
                const readyOrders = [ ];
                // 未分配好的订单，包含分配不足的订单
                let notReadyOrders = [ ];
                // 分配不足的订单
                const notEnough = [ ];
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

                // 货存不足订单应退回的订金总额 ( 订金 - 至少应付（不含优惠券)）
                let retreat = x.orders
                    .filter( o => o.base_status !== '3' && o.base_status !== '4' && o.base_status !== '5' )
                    .map( o => {
                        if ( o.base_status === '0' || o.base_status === '1' ) { 
                            return 0;

                        } else if ( o.base_status === '2' ) {
                            const { canGroup, allocatedCount, allocatedPrice, allocatedGroupPrice, count, depositPrice } = o;
                            if ( count * depositPrice > allocatedCount * ( canGroup ? allocatedGroupPrice : allocatedPrice )) {
                                return count * depositPrice - allocatedCount * ( canGroup ? allocatedGroupPrice : allocatedPrice);
                            
                            } else {
                                return 0;
                            }
                        }
                        return 0;
                    })
                    .reduce(( z, y ) => Number( Number( z + y ).toFixed( 2 )), 0 );

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
                
                /**
                 * !退还订金数，可能存在多余订金的问题
                 */
                if (( hasNotEnougth || getNothing ) && retreat ) {
                    statusCN = '退订金 ' + retreat;
                } 

                return Object.assign({ }, x , {

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
            })
            console.log( meta );
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
            wx.navigateTo({
                url: `/pages/manager-trip-list/index`
            })
        },

        /** 批量催款 */
        allGetMoney( ) {
            const that = this;
            const { callMoneyTimes } = this.data;
            const ok = this.data.clientOders$.every( o => !!o.isAllAdjusted );
            if ( !ok ) {
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

            wx.showModal({
                title: '提示',
                content: '发送收款推送后，不能更改订单数量/价格',
                success(res) {
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
                        orders: orders$,
                        notification: {
                            title: '您购买的商品已到货',
                            time: `[行程]${that.data.title}`
                        }
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
                                }, 0 );
                            }
                        }
                    });

                }
            })
        }

    },

    attached: function( ) {

    }
})
