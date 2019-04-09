const { http } = require('../../util/http.js');
const { navTo } = require('../../util/route.js');
const { computed } = require('../../lib/vuefy/index.js');
const { delayeringGood } = require('../../util/goods.js');

const app = getApp( );

Page({

    /**
     * 页面的初始数据
     */
    data: {

        role: 0,

        /** 加载 */
        loaded: false,

        /** 最快可用行程 */
        current: null,

        /** 下一趟可用行程 */
        next: null,

        /** 顶部公共 */
        notice: '',

        /** 热门推荐 */
        recommendGoods: [ ],

        /** 排行榜商品 */
        rankGoods: [ ],

        /** 3~20名商品 */
        otherGoods: [ ],

        /** 展开立减框 */
        showLijian: false,

        /** 展开满减 */
        showManjian: false,

        /** 立减信息 */
        lijian: {
            notGet: 0,
            hasBeenGet: 0
        },

        /** 参加人数 */
        memberCount: 0,

        /** 仙女购物单 */
        fairyList: [ ],

        /** 一口价商品列表 */
        goodDiscounts: [ ],

        /** 是否展示社交弹幕 */
        showMember: false,

        /** 本期拼团王产品 */
        pinest: null,

        /** 所有的拼团列表（待拼、可拼） */
        allPin: [ ]
    },

    /** 设置computed */
    runComputed( ) {
        computed( this, {

            // 仙女购物单
            fairyList$: function( ) {
                const { fairyList } = this.data;
                const temp = fairyList.map( usersl => {
                    const { user, shoppinglist, coupons } = usersl;

                    // 最多省多少：拼团 + 优惠券
                    const delta1 = shoppinglist.reduce(( x, y ) => {
                        const { adjustPrice, adjustGroupPrice } = y;

                        if ( !adjustGroupPrice || !adjustPrice ) {
                            return x + 0;
                        }

                        return x + Number( Number(( adjustPrice - adjustGroupPrice )).toFixed( 2 ));

                    }, 0 );

                    const delta2 = coupons.reduce(( x, y ) => {
                        return Number( Number( x + y.value ).toFixed( 2 ))
                    }, 0 );

                    return {
                        user,
                        coupons,
                        shoppinglist,
                        delta: Number( Number( delta1 + delta2 ).toFixed( 2 ))
                    }
                });
                return temp;
            },

            // 热门推荐前四
            recommendGoodsTop$: function( ) {
                const { recommendGoods } = this.data;
                return recommendGoods.slice( 0, 4 );
            },

            // 热门推荐 + 活动标志 
            recommendGoods$: function( ) {
                const { recommendGoods } = this.data;
                const meta = recommendGoods.map( x => Object.assign({ }, x, {
                    // 是否有特价活动
                    hasActivity: Array.isArray( x.activities ) && x.activities.length > 0
                }));
                return meta;
            }
        })
    },

    /** 拉取两个最新行程 */
    fetchLast( ) {

        http({
            data: { },
            errMsg: '加载失败，请重试',
            loadingMsg: '加载中...',
            url: `trip_enter`,
            success: res => {
                const { status, data } = res;
                if ( status !== 200 ) { return; }

                const current = data[ 0 ];
                const next = data[ 1 ];
                this.setData({
                    loaded: true,
                    recommendGoods: current? current.products.map( delayeringGood ).filter( x => !!x ) : [ ],
                    next: data[ 1 ] ? this.dealTrip( data[ 1 ]) : null,
                    current: data[ 0 ] ? this.dealTrip( data[ 0 ]) : null
                });

                // 顶部公共
                if ( current ) {
                    let text = '';
                    if ( current.fullreduce_values ) {
                        text += `【超值优惠】满${current.fullreduce_atleast}减${current.fullreduce_values}券等你拿！`;
                    }
                    if ( current.reduce_price ) {
                        text += `【立减】无门槛${current.reduce_price}优惠券等你拿！`
                    }
                    if ( current.postage === '0' ) {
                        text += `【免邮】消费满${current.postagefree_atleast}元立即免邮!`
                    } else if ( current.postage === '1' ) {
                        text += `【包邮】消费任意金额均包邮费！`
                    }
                    this.setData({
                        notice: text
                    });

                    this.fetchCoupon( current._id );
                    this.fetchFairy( current._id )
                    this.fetchPin( current._id )

                } else if ( !next ) {
                    this.setData({
                        notice: `暂无下一趟行程 T.T`
                    });
                }

            }
        });

    },

    /** 拉取仙女购物单 */
    fetchFairy( tid ) {
        http({
            data: {
                tid
            },
            url: 'shopping-list_fairy-shoppinglist',
            success: res => {
                if ( res.status !== 200 ) {
                    return; 
                }
                this.setData({
                    fairyList: res.data
                })
            }
        })
    },

    /** 拉取商品销量排行榜(前20) */
    fetchRank( ) {
     
        const { rankGoods, role } = this.data;
        if ( role === 0 && rankGoods.length > 0 ) { return; }

        http({
            data: {
                page: 1
            },
            url: `good_rank`,
            success: res => {
                const { status, data } = res;
                if ( status !== 200 ) { return; }
                this.setData({
                    rankGoods: data.data.map( delayeringGood ),
                    otherGoods: data.data.map( delayeringGood ).slice( 3 )
                });
            }
        });
    },

    /** 拉取优惠券信息 */
    fetchCoupon( tid ) {
        http({
            url: 'coupon_isget',
            data: {
                tid,
                check: 't_lijian,t_manjian,t_daijin'
            },
            success: res => {
                if ( res.status !== 200 ) { return; }

                const { reduce_price } = this.data.current;
                const { t_daijin, t_lijian, t_manjian } = res.data;
                
                /** 
                 * 先处理：立减
                 * 如果未领取立减到上半部分，则系统创建
                 **/
                const halfOfLijian = Number( reduce_price * 0.4 ).toFixed( 1 );
                this.setData({
                    lijian: {
                        hasBeenGet: halfOfLijian,
                        notGet: Number( reduce_price * 0.6 ).toFixed( 1 ),
                    }
                })

                // 未领取过立减，则自动拿“半张”优惠券
                if ( t_lijian === false ) {
                    this.autoGetLijian( halfOfLijian );
                }

                this.setData({
                    showLijian: t_lijian === 'half',
                    showManjian: t_manjian === false
                });
            }
        })
    },

    /** 拉取本期拼图 */
    fetchPin( tid ) {
        http({
            data: {
                tid,
                // type: 'pin', 等待拼团，已拼团，均有
                showUser: false
            },
            url: 'shopping-list_pin',
            success: res => {
                const { status, data } = res;
                this.setData({
                    pinest: data[ 0 ],
                    allPin: data.map( x => Object.assign({ }, x )).splice( 1 )
                });
            }
        });
    },

    /** 系统自动领取立减到券 */
    autoGetLijian( money ) {
        const { current } = this.data;
        const temp = {
            tid: current._id,
            title: '行程立减优惠券',
            type: 't_lijian',
            canUseInNext: false,
            value: Number( money ),
            atleast: 0
        };
        http({
            data: temp,
            url: 'coupon_create',
            success: res => {
                this.setData({
                    showLijian: true
                });
            }
        })
    },

    /** 领取另一张优惠券 */
    getAnotherLijian( ) {
        const { current } = this.data;
        http({
            data: {
                tid: current._id
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
                    }, 2500 );
                }
            }
        })
        
    },

    /** 社交弹幕 */
    onMemberChange({ detail }) {
        this.setData({
            memberCount: detail
        })
    },

    /** 处理详情 */
    dealTrip( tripDetail ) {

        const { start_date, end_date } = tripDetail;
        const MMdd = timestamp => {
            const d = new Date( timestamp );
            return `${d.getMonth( ) + 1}.${d.getDate( )}`
        }

        return Object.assign({ }, tripDetail, {
            end_date$: MMdd( end_date ),
            start_date$: MMdd( start_date )
        });
    },

    /** 关闭立减弹层，来源于分享完成、主动关闭 */
    closeLijian( ) {
        this.setData({
            showLijian: false
        });
    },

    /** 关闭满减弹窗 */
    closeManjian( ) {
        this.setData({
            showManjian: false
        })
    },

    /** 页面滚动 */
    onScroll( e ) {
        const { scrollTop } = e.detail;
        const { showMember } = this.data;
        if ( showMember ) { return; }
        this.setData({
            showMember: scrollTop > 100
        })
    },

    /** 跳到行程详情 */
    goTripDetail( ) {
        const { current } = this.data;
        if ( !current ) { return; } 
        navTo(`/pages/trip-detail/index?id=${current._id}`)
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.fetchRank( );
        this.fetchLast( );
        this.runComputed( );

        app.watch$('role', role => {
            this.setData({
                role
            });
        });
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function ( ) {
        const { role } = this.data;
        if ( role === 1 ) {
            this.setData({
                
            });
            setTimeout(( ) => {
                this.fetchRank( );
                this.fetchLast( );
            }, 20 );
        }
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {
        
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
        // 获取另一个立减
        if ( event.from === 'button' ) {
            this.getAnotherLijian( );
        }
        return {
            title: '[有人@你]跟我一起来拔草～',
            path: '/pages/trip-enter/index',
            imageUrl: 'https://global-1257764567.cos.ap-guangzhou.myqcloud.com/share.png'
        }
    }
})