const { http } = require('../../util/http.js');
const { wxPay } = require('../../util/pay.js');
const { navTo } = require('../../util/route.js');
const { computed } = require('../../lib/vuefy/index.js');

const app = getApp( );

Page({

    /**
     * 页面的初始数据
     */
    data: {
        // 上方活动tab
        active: 0,
        // 上方tabs
        tabs: [{
            key: 0,
            label: '全部订单'
        }, {
            key: 1,
            label: ''
        }, {
            key: 2,
            label: ''
        }, {
            key: 3,
            label: ''
        }],
        // tab跟查询的关系
        keyMapType: {
            0: 'my-all',
            1: 'my-notpay',
            2: 'my-delive',
            3: 'my-finish'
        },
        // 滚动加载page
        page: 0,
        // 滚动skip
        skip: 0,
        // 滚动加载 是否能加载更多
        canloadMore: true,
        // 原始订单列表
        metaList: [ ],
        // 快递费用列表
        deliverFees: [ ],
        // 是否新客户
        isNew: true,
        // 优惠券列表
        coupons: [ ],
        // 页面是否在加载中
        loading: true,
        // 购物清单列表 - 他人买了什么
        shoppinglist: [ ],
        // 当前行程的tid
        tid: '',
        // 展示当前行程的优惠情况(任务)
        showTask: 'hide',
        // 展示手指头
        showFinger: true,
        // 用于调整前的拼团预测（列表）
        pinList: [ ],
        // 展示代金券（自动领取代金券）
        showDaijin: 'hide',
        // 领取代金券的信息
        daijin: null,
        // 通过参数传入的tid
        tidParam: '',
        // 是否来自与行程详情
        fromDetail: false,
        // 列表
        loadingList: false,
        // 展示其他行程的订单
        showALlTrip: false,
        // 推广积分
        pushIntegral: 0,
        // 积分推广抵现比例
        pushIntegralMoneyRate: 0.1,
        // 是否展示结账
        isShowSettle: false,
        // 当前行程的订单
        currentTripOrder: { },
        // 推广积分使用记录表
        pushIntegralFees: [ ],
        // 展示任务组件
        showTaskCom: false
    },

    /** 设置computed */
    runComputed( ) {
        computed( this, {

            // 如果有当前行程的订单
            // 则展示顶部的优惠信息
            showDataBar$: function( ) {
                const { tid, metaList } = this.data;
                return !!metaList.find( x => x.tid === tid );
            },

            // 行程订单
            tripOrders$: function( ) {
                /**
                 * type orderObj = {
                 *   [ key: string ]: {
                 *     tid
                 *     tripName
                 *     tripTime
                 *     tripStatusCN
                 *     meta: metaOrder[ ]
                 *  }
                 * 
                 *  {
                 *     整体订单状态：some P0 （待付订金）、all P1 + B2/B4（待付尾款）、all P2（已付款）、all P2 + D0 未发货、all P2 + D1 已发货
                 *  }
                 * 
                 *  {
                 *     订单item状态：P0（待付订金）、P1+B0（购买中）、P1+B1（已购买，结算中）、P1+B2（已购买，待付款）、P1+B4（买不到，退款中）、P2+D1（未发货）、P2+D2（已发货）
                 *  }
                 */

                const { tid, showALlTrip, isNew, metaList, pinList, deliverFees, pushIntegralFees, coupons } = this.data;
                const orderObj = { };

                const fixNumber = n => {
                    const str = Number( Number( n )).toFixed( 2 );
                    if ( !str.includes('.00')) {
                        return str;
                    } else {
                        return str.split('.')[ 0 ];
                    }
                };


                // 计算当前可结算的商品数量 
                const count$ = order => {
                    const b = order.base_status;
                    return b === '0' || b === '1' ?
                            order.count :
                            b === '2' || b === '3' ?
                                order.allocatedCount:
                                0;
                }


                // 计算当前订单的拼团 (可减免金额)
                const pinCutoff$ = order => {
                    let _cutoff = 0;
                    const b = order.base_status;
                    const { canGroup, allocatedCount, allocatedGroupPrice, allocatedPrice, count, groupPrice, price } = order;

                    if (( b === '2' || b === '3' )) {

                        if ( canGroup && allocatedGroupPrice ) {
                            _cutoff = allocatedCount * ( allocatedPrice - allocatedGroupPrice );

                        } else {
                            _cutoff = 0;
                        }
                    } else if (( b === '0' || b === '1' )) {

                        /**
                         * 这里不用预测
                        */
                    if ( allocatedGroupPrice ) {
                            _cutoff = ( allocatedCount || count ) * ( allocatedPrice - allocatedGroupPrice );
                    } else if ( groupPrice ) {
                            _cutoff = count * ( price - groupPrice );
                        } else {
                            _cutoff = 0;
                        }

                    } else {
                        _cutoff = 0
                    }
                    return Number( _cutoff.toFixed( 2 ));
                }


                // 计算当前订单是否处于拼团状态（含预测）
                const pining$ = order => {
                    
                    const b = order.base_status;
                    if (( b === '2' || b === '3' )) {
                        return order.canGroup;

                    } else if (( b === '0' || b === '1' )) {
                        return !!pinList.find( shopping => shopping.sid === order.sid && shopping.pid === order.pid )

                    } else {
                        return false;
                    }
                }


                // 处理单个订单 状态
                metaList.map( order => {

                    let isNeedPrePay = true;
                    const { isNew } = this.data;
                    const payment = order.trip.payment;
                    const { count, depositPrice, allocatedCount, allocatedGroupPrice, allocatedPrice, canGroup } = order;

                    if ( isNew && payment === '0' ) {
                        isNeedPrePay = true;

                    } else if ( isNew && payment === '1' ) {
                        isNeedPrePay = true;

                    } else if ( isNew && payment === '2' ) {
                        isNeedPrePay = false;

                    }  else if ( !isNew && payment === '0' ) {
                        isNeedPrePay = false;

                    }  else if ( !isNew && payment === '1' ) {
                        isNeedPrePay = true;

                    }  else if ( !isNew && payment === '2' ) {
                        isNeedPrePay = false;

                    }  else {
                        isNeedPrePay = true;
                    } 

                    if ( !depositPrice ) {
                        isNeedPrePay = false;
                    }

                    // 处理单个订单 状态
                    const decorateOrder = ( order, isNeedPrePay ) => {
                        let statusCN = [ ];
                        const p = order.pay_status;
                        const b = order.base_status;
                        const d = order.deliver_status;

                        if ( isNeedPrePay && p === '0' && b === '5' ) {
                            statusCN = [ '支付过期' ];

                        } else if ( isNeedPrePay && p === '0' && b !== '5' && b !== '4' ) {
                            statusCN = [ '待付订金' ]

                        } else if ( p === '1' && b === '0' ) {
                            // statusCN = [ '购买中' ]
                            statusCN = ''

                        } else if ( p === '1' && b === '1' ) {
                            statusCN = [ '结算中' ] 

                        } else if ( p === '1' && b === '2' && !!allocatedCount ) {
                            statusCN = [ '待付款' ]

                        } else if ( p === '1' && b === '2' && !allocatedCount ) {
                            statusCN = [ '退订金' ]

                        } else if ( p === '1' && b === '4' ) {
                            statusCN = [ '已取消' ]

                        } else if ( p === '2' && d === '0' ) {
                            // statusCN = [ '未发货' ]
                            statusCN = ''
                            
                        } else if ( p === '2' && d === '2' ) {
                            statusCN = [ '已发货' ]
                        } 

                        if ( allocatedCount !== undefined && count - allocatedCount > 0 ) {
                            statusCN = ['货源不足']
                        }

                        if ( statusCN[ 0 ] === '待付款' && allocatedGroupPrice && canGroup ) {
                            statusCN = ['拼成']
                        }

                        const pining = pining$( order );
                        const pin_cutoff = pinCutoff$( order );
                        const order_cutoff = pin_cutoff + (order.used_integral || 0);
                        const showingPrice = pining ? 
                            (order.allocatedGroupPrice || order.groupPrice) - (order.used_integral || 0) :
                            (order.allocatedPrice || order.groupPrice) - (order.used_integral || 0);

                        return {

                            ...order,
                            p,
                            b,
                            statusCN,
                            isNeedPrePay,
                            pining, // 是否处于拼团状态
                            pin_cutoff, // 拼团减免（预测）
                            order_cutoff, // 总减免：拼团 + 抵现金
                            showingPrice, // 在界面展示的价格
                            retreat: b === '2' && allocatedCount < count ? // 退还订金
                                !!depositPrice ?
                                    (count - allocatedCount) * depositPrice :
                                    0 :
                                0,
                        }
                    };

                    // 创建一个新的 行程键值对
                    if ( !orderObj[ order.tid ]) {
                        const d = new Date( order.trip.start_date );
                        const d2 = new Date( order.trip.end_date );
                        orderObj[ order.tid ] = {
                            tid: order.tid,
                            isClosed: order.trip.isClosed,
                            tripPostage: order.trip.postage,
                            tripPostagefree_atleast: order.trip.postagefree_atleast,
                            tripName: order.trip.title,
                            tripPayment: order.trip.payment,
                            tripTime: order.trip.isClosed ?
                                '已结束' :
                                new Date( ).getTime( ) >= order.trip.start_date ?
                                    `${d2.getMonth( )+1}月${d2.getDate( )}完成采购` :
                                    `${d.getMonth( )+1}月${d.getDate( )}出发`,
                            meta: [ decorateOrder( order, isNeedPrePay )]
                        };

                    // 在行程键值对插入新的订单信息
                    } else {
                        orderObj[ order.tid ] = Object.assign({ }, orderObj[ order.tid ], {
                            meta: [ ...orderObj[ order.tid ].meta, decorateOrder( order, isNeedPrePay )]
                        });
                    }

                }); 

                // 处理订单整体状态、合计信息
                Object.keys( orderObj ).map( tid => {

                    let tripStatusCN = '';
                    const tripOrders = orderObj[ tid ];
                    const orders = tripOrders.meta;

                    // 所有订单，使用的抵现金
                    const allUsedIntegral = orders.reduce(( x, y ) => x + (y.used_integral || 0 ), 0 );
                    tripOrders['allUsedIntegral'] = allUsedIntegral

            
                    // 行程是否已经付过尾款
                    const hasPay = orders.every( x => x.b !== '0' && x.b !== '1' && x.b !== '2' );
                    tripOrders['hasPay'] = hasPay;


                    // 是否展示更多
                    tripOrders['showMore'] = !!hasPay || false;


                    // 处理订单商品数量
                    const sum = orders.reduce(( x, y ) => {
                        // return x + count$( y );
                        return x + y.count
                    }, 0 );
                    tripOrders['sum'] = sum;

                    // 应付全款（不含优惠券）
                    let wholePriceNotDiscount = orders.reduce(( x, y ) => {
                        let currentPrice = 0;
                        const { allocatedCount, allocatedPrice, allocatedGroupPrice, canGroup, count, price } = y;
                        if ( y.base_status === '1' || y.base_status === '2' || y.base_status === '3' ) {
                            currentPrice = (canGroup && allocatedGroupPrice ? allocatedGroupPrice : allocatedPrice) * count$( y );
                        } else if ( y.base_status === '0' ) {
                            currentPrice = count$( y ) * ( allocatedPrice || price );
                        } else {
                            currentPrice = 0;
                        }
                        return x + currentPrice;
                    }, 0 );
                    

                    // 邮费
                    const userDeliverFeeMeta = deliverFees.find( x => x.tid === tripOrders.tid );
                    const userDeliverFee = userDeliverFeeMeta ? userDeliverFeeMeta.fee : 0;

                    // 推广积分
                    const pushIntegralFeesMeta = pushIntegralFees.find( x => x.tid === tripOrders.tid );
                    // 总的积分使用情况，权重比 allUsedIntegral 高
                    const pushintegralFee = pushIntegralFeesMeta ? pushIntegralFeesMeta.value : null;

                    if ( userDeliverFee ) {
                        wholePriceNotDiscount += userDeliverFee;
                    }
                    tripOrders['pushintegralFee'] = pushintegralFee;
                    tripOrders['userDeliverFee'] = userDeliverFee;
                    tripOrders['wholePriceNotDiscount'] = wholePriceNotDiscount;
                    

                    // 优惠券
                    const { coupons } = this.data;
                    const coupons_manjian = coupons.find( x => x.type === 't_manjian' && x.tid === tid );
                    const coupons_lijian = coupons.find( x => x.type === 't_lijian' && x.tid === tid );
                    const coupons_daijin = coupons.find( x => x.type === 't_daijin' && (( !x.isUsed && x.canUseInNext ) || ( !!x.isUsed && x.usedBy === tid )));
        

                    // 处理满减
                    const t_manjian = !coupons_manjian ? { value: 0, canUsed: false, isUsed: false, atleast: 0 } : {
                        // 处理真的已用，和即将要用的情况
                        isUsed: coupons_manjian.isUsed || coupons_manjian.atleast <= wholePriceNotDiscount,
                        id: coupons_manjian._id,
                        value: coupons_manjian.value ,
                        atleast: coupons_manjian.atleast,
                        canUsed: coupons_manjian.atleast <= wholePriceNotDiscount || !coupons_manjian.atleast
                    };
                    tripOrders['t_manjian'] = t_manjian;
                

                    // 处理立减
                    const t_lijian = !coupons_lijian ? { value: 0, canUsed: false, isUsed: false, atleast: 0 } : {
                        isUsed: true,
                        canUsed: true,
                        id: coupons_lijian._id,
                        value: coupons_lijian.value,
                        atleast: coupons_lijian.atleast,
                    };
                    tripOrders['t_lijian'] = t_lijian;


                    // 处理代金券
                    const t_daijin = !coupons_daijin ? { value: 0, canUsed: false, isUsed: false, atleast: 0 } : {
                        // 处理真的已用，和即将要用的情况
                        isUsed: coupons_daijin.isUsed || coupons_daijin.atleast <= wholePriceNotDiscount,
                        id: coupons_daijin._id,
                        value: coupons_daijin.value,
                        atleast: coupons_daijin.atleast,
                        canUsed: coupons_daijin.atleast <= wholePriceNotDiscount || !coupons_daijin.atleast
                    };
                    tripOrders['t_daijin'] = t_daijin;


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

                    // 推广积分
                    if ( pushintegralFee ) {
                        wholePriceByDiscount = Number((wholePriceByDiscount - pushintegralFee).toFixed( 2 ));
                    }

                    tripOrders['wholePriceByDiscount'] = wholePriceByDiscount;

                    // 剩余订金、未付订金列表
                    const notPayDepositOrders = [ ];
                    const lastDepositPrice = orders.reduce(( x, y ) => {
                        let currentDepositPrice = ( y.p === '0' && !!y.depositPrice ) ? y.depositPrice : 0;
                        if ( !!currentDepositPrice ) {
                            notPayDepositOrders.push( y._id )
                        }
                        return x + currentDepositPrice * count$( y );;
                    }, 0 );
                    tripOrders['lastDepositPrice'] = lastDepositPrice;
                    tripOrders['notPayDepositOrders'] = notPayDepositOrders;


                    // 已付订金
                    const hasPayDepositPrice = orders.reduce(( x, y ) => {
                        const depositPrice = String( y.pay_status ) !== '0' ?
                            y.depositPrice || 0 : 0;
                        return Number(Number( x + Number(Number( depositPrice * y.count ).toFixed( 2 ))).toFixed( 2 ));
                    }, 0 )
                    tripOrders['hasPayDepositPrice'] = hasPayDepositPrice;


                    // 剩余尾款
                    // 注意，这里应该计算好因为货存不足，带来多付订金的情况。
                    let lastPrice = wholePriceByDiscount;
                    orders.map( y => {
                        const count = y.b === '0' || y.b === '1' || y.b === '2' ?  y.count : 0;
                        lastPrice -= count * ( y.depositPrice || 0 );
                    });
                    tripOrders['lastPrice'] = Number( lastPrice.toFixed( 2 ));


                    // 目前的总可减免，除了优惠券类，
                    let cutoff = 0;
                    if ( t_manjian.isUsed ) {
                        cutoff += Number( t_manjian.value );
                    }
                    if ( t_lijian.isUsed ) {
                        cutoff += Number( t_lijian.value );
                    }
                    if ( t_daijin.isUsed ) {
                        cutoff += Number( t_daijin.value );
                    }

                    orders.map( order => {
                        if ( pinList.find( shopping =>
                            shopping.pid === order.pid && shopping.sid === order.sid )) {
                                cutoff += order.pin_cutoff;
                        }
                    });

                    tripOrders['cutoff'] = fixNumber( cutoff );


                    /**
                    * ! 处理邮费
                    */

                    /** 总减免，包含所有商品都成功拼团的情况 */
                    let total_cutoff = 0;
                    total_cutoff += Number( t_manjian.value ); // 满减
                    total_cutoff += Number( t_daijin.value ); // 代金券
                    total_cutoff += orders[ 0 ].trip.reduce_price || 0 ; // 立减
                
                    orders.map( order => { // 成功拼团的情况
                        const { groupPrice, price, allocatedGroupPrice, allocatedPrice } = order;

                        if ( !!groupPrice || !!allocatedGroupPrice ) {
                            const good_cutoff = allocatedGroupPrice ?
                                allocatedPrice - allocatedGroupPrice:
                                price - groupPrice;
                            total_cutoff += good_cutoff * count$( order );
                        }
                    });

                    tripOrders['total_cutoff'] = total_cutoff;


                    /** 总减免 和 目前减免的差值 */
                    tripOrders['cutoff_delta'] = fixNumber( total_cutoff - cutoff );


                    /** 总减免 和 目前减免的比例 */
                    tripOrders['cutoff_percent'] = Math.floor( Number(Number( cutoff / total_cutoff ).toFixed( 2 )) * 100);

                    
                    /** 任务列表 */
                    const task = [ ];
                    orders
                        .filter( order => order.base_status !== '4' && order.base_status !== '5')
                        .map( order => {
                            if ( !!order.groupPrice || !!order.allocatedGroupPrice ) {

                                const price = order.allocatedGroupPrice ?
                                    order.allocatedPrice - order.allocatedGroupPrice :
                                    order.price - order.groupPrice;

                                task.push({
                                    type: 'good',

                                    price: Number(( price * order.count).toFixed( 2 )),

                                    title: '拼成就减',

                                    img: order.img[ 0 ],

                                    // desc: `${order.name} ${order.standername !== '默认型号' && !!order.standername ? order.standername : ''}`,

                                    desc: `邀请群友拼团购买，立减${Number(( price * order.count).toFixed( 1 ))}元`,

                                    share: {
                                        title: `省${order.allocatedGroupPrice ?
                                            ( order.allocatedPrice - order.allocatedGroupPrice ).toFixed( 2 ) :
                                            ( order.price - order.groupPrice ).toFixed( 2 )}元！${order.name}`,
                                        path: `/pages/goods-detail/index?id=${order.pid}&tid=${this.data.tid}`,
                                        imageUrl: order.img[ 0 ]
                                    },

                                    // 处理真正拼团跟预测拼团
                                    finished: !!pinList.find( shopping => {
                                        return shopping.pid === order.pid && shopping.sid === order.sid
                                    })
                                })
                            }
                        });

                    
                    ['t_lijian', 't_manjian', 't_daijin'].map( quan => {
                        const target = tripOrders[ quan ];
                        if ((( quan === 't_manjian' || quan === 't_daijin' ) && !!target.value ) || ( quan === 't_lijian' && !!orders[ 0 ].trip.reduce_price )) {
                            
                            task.push({

                                type: quan,

                                price: quan === 't_lijian' ?
                                    target.value < orders[ 0 ].trip.reduce_price ?
                                    fixNumber( orders[ 0 ].trip.reduce_price - target.value ) :
                                        fixNumber( target.value ):
                                        fixNumber( target.value ),

                                title: quan === 't_lijian' ?
                                    '立减券' :
                                    quan === 't_manjian' ?
                                        '满减券' : '代金券',

                                desc: quan === 't_lijian' ?
                                    '转发即可获得。马上分享行程给闺蜜吧～' :
                                    quan === 't_manjian' ?
                                    target.atleast ? `满${target.atleast}元即可自动使用` : `无门槛满减券` :
                                    target.atleast ? `满${target.atleast}元即可自动使用` : `无门槛代金券`,

                                share: ( quan === 't_lijian' &&
                                    !!orders[ 0 ].trip.reduce_price &&
                                    target.value < orders[ 0 ].trip.reduce_price ) ? {
                                        title: '分享给你 超值代购～',
                                        path: '/pages/trip-enter/index',
                                        imageUrl: 'https://global-1257764567.cos.ap-guangzhou.myqcloud.com/share.png'
                                    } : null,

                                finished: quan === 't_lijian' ?
                                    (!!orders[ 0 ].trip.reduce_price &&
                                        target.value >= orders[ 0 ].trip.reduce_price ) :
                                        quan === 't_manjian' ?
                                            tripOrders.wholePriceNotDiscount >= Number( target.atleast ) || tripOrders.wholePriceByDiscount >= Number( target.atleast ):
                                            tripOrders.wholePriceNotDiscount >= Number( target.atleast ) || tripOrders.wholePriceByDiscount >= Number( target.atleast )
                            });
                        }
                    });

                    tripOrders['task'] = task;

                    /** 结算后的合计 */
                    let total = orders.reduce(( x, y ) => {
                        return x + ( y.final_price || 0 ) * ( y.allocatedCount || 0 );
                    }, 0 );

                    if ( t_manjian.isUsed ) {
                        total = Number( Number( total - t_manjian.value ).toFixed( 2 ));
                    }
                    if ( t_lijian.isUsed ) {
                        total = Number( Number( total - t_lijian.value ).toFixed( 2 ));
                    }
                    if ( t_daijin.isUsed ) {
                        total = Number( Number( total - t_daijin.value ).toFixed( 2 ));
                    }
                    if ( !!pushintegralFee ) {
                        total = Number( Number( total - pushintegralFee ).toFixed( 2 ));
                    }

                    tripOrders['total'] = total;

                    // 已付款（拼团）
                    const hasBeenPay = orders
                        .filter( o => o.pay_status === '2' )
                        .reduce(( x, y ) => {
                            return Number(( x + ( y.final_price || 0 )).toFixed( 2 ))
                        }, 0 );
                    tripOrders['hasBeenPay'] = hasBeenPay;

                    // 已付（拼团+订金）
                    const hasBeenPayAll = Number(( hasBeenPay + ( hasPayDepositPrice || 0 )).toFixed( 2 ));
                    tripOrders['hasBeenPayAll'] = hasBeenPayAll;

                    // 应退订金 ( 已付订金 > 应付 )
                    const retreat = hasPayDepositPrice > wholePriceByDiscount ?
                        (hasPayDepositPrice - wholePriceByDiscount).toFixed( 2 ) : 0;
                    tripOrders['retreat'] = retreat;

                    // 计算尾款情况（ 待付 或 退款 ）
                    let rest = orders.reduce(( x, y ) => {
                        const { allocatedCount, allocatedGroupPrice, allocatedPrice, final_price,
                            count, groupPrice, price, canGroup, depositPrice, pay_status } = y;
                        
                        // 已付
                        const hasPayed = 
                            final_price !== undefined ? 
                                final_price :
                                pay_status === '1' ? 
                                    count * depositPrice:
                                    count * ( canGroup ? groupPrice : price );

                        // 应交(订单)
                        const shouldPay = allocatedCount * ( canGroup ? allocatedGroupPrice : allocatedPrice );
                        return Number(( x + ( shouldPay - hasPayed )).toFixed( 2 ));

                    }, 0 );

                    // 加上邮费
                    rest += ( !userDeliverFeeMeta || (userDeliverFeeMeta || { }).hasPay ) ? 0 : ( userDeliverFee || 0);

                    // 行程还没有开始结算
                    if ( !tripOrders.isClosed ) {
                        rest = 0;
                    }
                    tripOrders['rest'] = rest;
                    tripOrders['restAbs'] = Math.abs( rest );

                    //  处理订单整体状态
                    if ( orders.filter( x => x.b !== '4' && x.b !== '5').some( x => x.statusCN[ 0 ] === '待付订金' )) {
                        tripStatusCN = '待付订金';

                    } else if ( orders.filter( x => x.b !== '4' && x.b !== '5').every( x => ( x.p === '1' || x.p === '2' ) && ( x.b === '0' || x.b === '1' ))) {
                        tripStatusCN = '采购中';

                    }

                    // 退款
                    if ( rest > 0 ) {
                        tripStatusCN = '待支付';
                    } else if ( rest < 0 ) {
                        tripStatusCN = '需退款';
                    }

                    // 总状态
                    tripOrders['tripStatusCN'] = tripStatusCN;

                    /** 是否处于可以结算的状态 */
                    const canSettle = tripStatusCN === '待支付';
                    tripOrders['canSettle'] = canSettle;

                });

                const allTripOrders = Object.keys( orderObj ).map( tid => orderObj[ tid ]);

                // 如果没有当前行程的订单，则展示全部
                // 如果有，则先展示当前行程的订单
                const hasCurrentTripOrder = !!metaList.find( x => x.tid === tid );

                if ( hasCurrentTripOrder && !showALlTrip ) {
                    return allTripOrders.filter( x => x.tid === tid );
                } else {
                    if ( !showALlTrip ) {
                        const notPay = allTripOrders.filter( x => x.hasPay === false );
                        if ( notPay.length > 0 ) {
                            return notPay
                        } else {
                            return allTripOrders;
                        }
                    } else {
                        return allTripOrders;
                    }
                }
            }

        })
    },

    /** 点击上方各类订单 */
    onTab({ currentTarget }) {
        const { index } = currentTarget.dataset;
        if ( index === this.data.active )  { return; }
        
        this.setData({
            list:[ ],
            page: 0,
            skip: 0,
            totalPage: 1,
            active: index
        });
        this.fetchList( index );
    },

    /** 设置微信bar */
    setNavBar( ) {
        wx.setNavigationBarColor({
            frontColor: '#ffffff',
            backgroundColor: '#f80759'
        })
    },

    /** 拉取拼团列表（预测） */
    fetchPinList( tid ) {

        if ( this.data.pinList.length !== 0 ) { return; }

        http({
            url: 'shopping-list_pin',
            data: {
                tid,
                detail: false,
                type: 'pin'
            },
            loadingMsg: 'none',
            success: res => {
                if ( res.status === 200 ) {
                    this.setData({
                        pinList: res.data
                    });

                    // 已经拼团成功的
                    const pinList = res.data;
                    // 本次形成的订单列表
                    const tripOrders = this.data.metaList.filter( x => x.tid === tid );

                    // 等待拼团
                    const someWaitPin = tripOrders.filter( order => {
                        return !pinList.find( shopping => {
                            return shopping.pid === order.pid && shopping.sid === order.sid;
                        });
                    });
                }
            }
        });
    },

    /** 获取当前行程 */
    fetchCurrentTrip( cb ) {
        http({
            url: 'trip_enter',
            data: {
                shouldGetGoods: false
            },
            loadingMsg: 'none',
            success: res => {
                const { status, data } = res;
                if ( status === 200 && !!data[ 0 ]) {
                    !!cb && cb( data[ 0 ]._id );
                    this.setData({
                        loading: false,
                        tid: data[ 0 ]._id
                    });
                } else {
                    this.setData({
                        loading: false
                    });
                }
            }
        });
    },

    /** 拉取推荐拼团列表 */
    fetchGroupList( tid ) {
        if ( !tid ) { return; }
        if ( this.data.shoppinglist.length !== 0 ) { return; }
        http({
            url: 'shopping-list_list',
            data: {
                tid,
                needOrders: false
            },
            loadingMsg: 'none',
            success: res => {
                const { status, data } = res;
                if ( status === 200 ) {
                    this.setData({
                        shoppinglist: data
                    })
                }
                this.setData({
                    loading: false
                });
            }
        });
    },

    /** 拉取订单数据 */
    fetchList( index, reset = false ) {
        const { page, keyMapType, skip, canloadMore, metaList, tidParam, fromDetail, loadingList } = this.data;
        const type = typeof index !== 'object' ?
            keyMapType[ index ] :
            keyMapType[ 0 ];

        if ( !canloadMore || loadingList ) { return; }

        this.setData({
            loadingList: true
        })

        let reqData = {
            type,
            skip,
            page: page + 1
        };

        if ( !!tidParam && !!fromDetail ) {
            reqData = Object.assign({ }, reqData, {
                tid: tidParam
            });
        }

        http({
            data: reqData,
            url: 'order_list',
            loadMsg: '加载中...',
            success: res => {
                // 本来订单跟商品是 1:1 的关系
                // 但是直接就这样子显示，会不够直观，部分操作麻烦
                // 所以这边要以“行程”为基调，重新组织订单的显示方式

                const { status, data } = res;
                if ( status !== 200 ) { return; }
                const { page, current, totalPage, total } = data;
                const metaData = !reset ? [ ...metaList, ...data.data ] : [ ...data.data ];
                this.setData({
                    page,
                    skip: current,
                    metaList: metaData,
                    canloadMore: total > current
                });

                // 有订单则显示订单，并设置bar
                if ( data.data.length !== 0 ) {
                    this.setNavBar( );

                    const tidsArr = metaData.map( x => x.tid );

                    this.fetchDeliverFee( tidsArr.join(','));
                    this.fetchPushIntegralFee( tidsArr.join(','));
                    
                    this.fetchCurrentTrip( tid => this.fetchPinList( tid ));
                // 无订单则显示默认文案
                } else {
                    this.fetchCurrentTrip( tid => this.fetchGroupList( tid ));
                }
                
            }
        })
    },

    /** 拉取优惠券列表 */
    fetchCoupons( check = false ) {

        const { coupons } = this.data;
        if ( coupons.length > 0 && !check ) { return; }

        http({
            url: `coupon_list`,
            data: { },
            success: res => {
                const { status, data } = res;
                if ( status !== 200 ) { return; }
                this.setData({
                    coupons: data
                });
            }
        })
    },

    /** 拉取快递费用 */
    fetchDeliverFee( tids ) {

        const action = ( ) => {
            this.setData({
                loadingList: false
            })
        }

        if ( !tids ) {
            return action( );
        }

        http({
            data: {
                tids
            },
            url: 'deliver_trips-fee',
            success: res => {
                const { status, data } = res;
                if ( status === 200 ) {
                    this.setData({
                        deliverFees: data
                    });
                    setTimeout(( ) => {
                        action( );
                    }, 20 );
                }
            }
        })
        
    },

    /** 拉取积分推广使用情况 */
    fetchPushIntegralFee( tids ) {

        const action = ( ) => {
            this.setData({
                loadingList: false
            })
        }

        if ( !tids ) {
            return action( );
        }

        http({
            data: {
                tids,
                type: 'push_integral'
            },
            url: 'common_push-integral-use',
            success: res => {
                const { status, data } = res;
                if ( status === 200 ) {
                    this.setData({
                        pushIntegralFees: data
                    });
                    setTimeout(( ) => {
                        action( );
                    }, 20 );
                }
            }
        })
        
    },

    /** 获取当前人的推广积分 */
    fetchPushIntegral( ) {
        http({
            url: 'common_push-integral',
            success: res => {
                const { status, data } = res;
                if ( status !== 200 ) { return; }
                this.setData({
                    pushIntegral: data
                });
            }
        })
    },

    /** 跳到快递排行榜页面 */
    goDeliver({ currentTarget }) {
        navTo(`/pages/trip-deliver/index?id=${currentTarget.dataset.tid}`);
    },

    /** 去商品详情 */
    goGoodDetail({ currentTarget }) {
        const { pid } = currentTarget.dataset.data;
        navTo(`/pages/goods-detail/index?id=${pid}&tid=${this.data.tid}`)
    },

    /** 跳到行程入口 */
    goTripEntry({ currentTarget }) {
        if ( !currentTarget || (!!currentTarget && !currentTarget.dataset.isClosed )) {
            navTo(`/pages/trip-enter/index`);
        }
    },

    /** 补齐立减券 */
    fixLiJian({ currentTarget }) {
        const { tid } = currentTarget.dataset;
        http({
            data: {
                tid,
            },
            url: 'coupon_repair-lijian',
            success: res => {
                if ( res.status === 200 ) {
                    this.setData({
                        showLijian: false
                    });
                    setTimeout(( ) => {
                        wx.showToast({
                            duration: 2000,
                            title: '领取成功！'
                        });
                        this.fetchCoupons( true );
                    }, 2500 );
                }
            }
        });
    },

    // 在任务模块，领取了另一个券
    onReplareLijian( ) {
        // onShow会自动调
        // this.fetchCoupons( true );
    },

    /** 监听全局新旧客 */
    watchRole( ) {
        app.watch$('isNew', val => {
            this.setData({
                isNew: val
            });
            if (val !== this.data.isNew && this.data.metaList.length > 0 ) {

            }
        });
        app.watch$('appConfig', val => {
            !!val && this.setData({
                pushIntegralMoneyRate: val['push-integral-money-rate'] || 0
            });
        });
    },

    /** 去联系代购 */
    concact( ) {
        navTo('/pages/concat/index');
    },

    /** 付剩余订金 */
    payLastDepositPrice({ currentTarget }) {
        const { lastDepositPrice, notPayDepositOrders } = currentTarget.dataset.data;
        wxPay( lastDepositPrice, ({ prepay_id }) => {
            // 批量更新订单为已支付
            const pay = ( ) => http({
                url: 'order_upadte-to-payed',
                data: {
                    prepay_id,
                    orders: notPayDepositOrders.join(',')
                },
                success: res => {
                    if ( res.status === 200 ) {
                        lastDepositPrice && wx.showToast({
                            title: '支付成功'
                        });
                        this.setData({
                            page: 0,
                            skip: 0,
                            canloadMore: true,
                            metaList: [ ],
                        });
                        setTimeout(( ) => {
                            this.fetchList( this.data.active );
                        }, 20 );
                    } else {
                        wx.showToast({
                            icon: 'none',
                            title: '支付成功，刷新失败，重试中...'
                        });
                        pay( );
                    }
                }
            });
            pay( );
        }, ( ) => { });
    },

    /** 付尾款 */
    payLast({ currentTarget }) {

        const tripOrder = currentTarget.dataset.data;

        return this.setData({
            isShowSettle: true,
            currentTripOrder: tripOrder
        });
    },

    /** 成功付尾款 */
    onPayLast( e ) {
        this.setData({
            page: 0,
            skip: 0,
            canloadMore: true,
        });
        setTimeout(( ) => {
            this.fetchCoupons( true );
            this.fetchList( this.data.active, true );
        }, 20 );
    
        wx.showToast({
            title: '支付成功'
        });

        // 如果领取了代金券
        if ( !!e.detail && !!e.detail.value ) {
            this.setData({
                showDaijin: 'show',
                daijin: e.detail
            });
        };
    },

    /** 关闭结账界面 */
    onSettleToggle( e ) {
        this.setData({
            isShowSettle: e.detail
        });
    },

    /** 展示任务弹框 */
    toggleTask( ) {
        // const { showTask } = this.data;

        // 即将打开
        // if ( showTask === 'hide' ) {
        //     wx.showShareMenu( );
        // } else {
        //     wx.hideShareMenu( );
        // }

        // this.setData({
        //     showTask: showTask === 'hide' ? 'show' : 'hide',
        //     showFinger: false
        // });

        var el = this.selectComponent('#task');
        el.toggle();
        
    },

    /** 展示代金券 */
    toggleDaijin( ) {
        const { showDaijin } = this.data;
        this.setData({
            showDaijin: showDaijin === 'hide' ? 'show' : 'hide'
        });
    },

    /** 展示全部 */
    toggleAll( ) {
        const { showALlTrip } = this.data;
        this.setData({
            showALlTrip: !showALlTrip
        });
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.watchRole( );
        this.runComputed( );
        // wx.hideShareMenu( );

        const { tid, fromDetail } = options;
        if ( tid ) { 
            this.setData({
                tidParam: tid || null,
                fromDetail: fromDetail === 'true'
            });

            wx.setNavigationBarTitle({
                title: '省钱'
            });
        }

        setTimeout(( ) => {
            this.setData({
                showTaskCom: true
            })
        }, 500 );
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
        this.setData({
            skip: 0,
            page: 0
        })
        setTimeout(( ) => {
            this.fetchPushIntegral( );
            this.fetchCoupons( );
            this.fetchList( this.data.active );
        }, 0 );
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
    onShareAppMessage: function ( event ) {

        // return event.target.dataset.share;
        return {
            title: '群拼团！大家都能省～',
            path: '/pages/trip-enter/index',
            imageUrl: 'https://global-1257764567.cos.ap-guangzhou.myqcloud.com/cover-trip-enter-1.png'
        }
    }
})