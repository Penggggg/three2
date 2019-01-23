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
        showBtn: false // 展示行程列表按钮
    },

    /** 计算属性 */
    computed: {
        clientOders$( ) {
            
            const { clientOders, showMore } = this.data;
            const meta = clientOders.map( x => {

                // 已经分配好的订单
                const readyOrders = [ ];
                // 未分配好的订单，包含分配不足的订单
                let notReadyOrders = [ ];
                // 分配不足的订单
                const notEnough = [ ];
                const canShowMore = showMore.find( y => y === x.user.openid );
                
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
                        orders: x.orders.filter( order => order.aid === address._id )
                    }
                });

                return Object.assign({ }, x , {
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
                                'notReadyOrders',
                    // 已经准备好的订单
                    // readyOrders,
                    // 是否已经结算
                    hasBeenGivenMoney: x.orders
                                        .filter( o => o.base_status !== '4' && o.base_status !== '5' )
                                        .every( o => o.base_status === '3' ),
                    // 是否发起过催款
                    hasBeenCall: x.orders.every( o => o.base_status === '2' ),
                    // 未准备好的订单
                    notReadyOrders,
                    // 按是否准备排序的订单
                    allOrders: [ ...notReadyOrders, ...readyOrders ],
                    // 是否所有订单都被分配了，包括 0
                    isAllAdjusted: x.orders.every( o => o.allocatedCount !== undefined ),
                    // 未被分配的订单量
                    hasNotAdjustedLength: x.orders.filter( o => o.allocatedCount === undefined ).length
                });
            })
            console.log( meta );
            return meta;
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
                        const { clients, notPayAllClients } = res.data;
                        this.setData({
                            clients,
                            notPayAllClients
                        })
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

        /** 催款按钮 */
        getBackMoney( e ) {
            const { currentTarget, detail } = e;
            const userOrders = currentTarget.dataset.data;
            const { orders } = userOrders;
            return console.log( e );
            if ( !userOrders.isAllAdjusted ) {
                return wx.showToast({
                    icon: 'none',
                    title: '还有未分配订单'
                });
            }
            const temp = {
                form_id: detail.formId,
                tid: orders[ 0 ].tid,
                openid: orders[ 0 ].openid,
                oids: orders.map( o => o._id )
            };

            // 调整订单状态，并发送消息模板
            const goAdjust = ( ) => {
                http({
                    data: temp,
                    url: 'order_adjust-status',
                    success: res => {
                        const { status, data, message } = res;
        
                        // 异常情况
                        if ( status!== 200 && message.indexOf('行程未结束') === 0 ) {
                            return setTimeout(( ) => {
                                this.setData({
                                    showBtn: true
                                });
                            }, 2000 );
                        }

                        // 刷新列表
                        if ( status === 200 ) {
                            this.fetchOrder( this.data.tid );
                        }

                    }
                })
            };

            // alert一下
            wx.showModal({
                title: '提示',
                content: '催款后，客户价格/数量不能再调整',
                success: res => {
                    if ( res.confirm ) {
                        goAdjust( );

                    } else if ( res.cancel ) {
                        wx.showToast({
                            icon: 'none',
                            title: '已取消'
                        })
                    }
                }
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

        test( ) {
            // http({
            //     data: {
            //         touser: 'oo-j94-6UPk0HfpG32RX1SlV7WOE',
            //         form_id: `${new Date( ).getTime( )}`,
            //         page: 'order-list',
            //         data: {
            //             time: '现在',
            //             price: '100',
            //             title: '哈哈哈'
            //         }
            //     },
            //     url: 'common_notification-getmoney',
            //     success: res => {
            //         console.log( res );
            //     }
            // })
        }

    },

    attached: function( ) {
        this.test( );
    }
})
