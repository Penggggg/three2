
import { http } from '../../util/http.js';
import { computed } from '../../lib/vuefy/index.js';
import { delayeringGood } from '../../util/goods.js';
import { navTo } from '../../util/route.js';

const app = getApp( );

Page({

    // 动画
    animationMiddleHeaderItem: null,

    /**
     * 页面的初始数据
     */
    data: {

        // 是否为新客
        isNew: true,

        // 行程
        tid: '',

        // 商品id
        id: '',

        // 商品详情
        detail: null,
        
        // 数据字典
        dic: { },
        
        // 加载状态
        loading: true,

        // 是否初始化过“喜欢”
        hasInitLike: false,

        // 是否“喜欢”
        liked: false,

        // 文字保证提示
        promiseTips: [
            '正品保证', '价格优势', '真人跑腿'
        ],

        // 动画
        animationMiddleHeaderItem: null,

        // 展示管理入口
        showBtn: false,

        // 展示弹框
        showTips: 'hide',

        // 拼团列表
        pin: [ ],

        // 商品在本行程的购物清单列表
        shopping: [ ],

        // 一口价活动列表
        activities: [ ],

        // 本趟能够拼团的sku
        canPinSku: [ ]
    },

    /** 设置computed */
    runComputed( ) {
        computed( this, {

            // 计算价格
            price: function( ) {
                const { detail } = this.data;
                const result = delayeringGood( detail );
                return result ? result.price$ : '';
            },

            // 商品详情 - 分行显示
            detailIntro: function( ) {
                const { detail } = this.data;
                if ( !detail || ( !!detail && !detail.detail )) {
                    return [ ];
                } else {
                    return detail.detail.split('\n').filter( x => !!x );
                }
            },

            // 价格 ～ 团购价的差价
            priceGap: function( ) {
                const { detail } = this.data;
                if ( !detail ) {
                    return ''
                } else {
                    const result = delayeringGood( detail );
                    return result ? result.goodPins.eachPriceRound : '';
                }
            },

            // 拼团列表
            pin$: function( ) {
                let meta: any = [ ];
                const { detail, shopping, activities } = this.data;

                if ( !detail ) { 
                    return [ ];
                }

                const { standards, groupPrice } = detail;

                if ( standards.length > 0 ) {
                    meta = standards
                        .filter( x => !!x.groupPrice )
                        .map( x => {
                            return Object.assign({ }, x, {
                                sid: x._id,
                                canPin: !!shopping.find( s => s.sid === x._id && s.pid === x.pid )
                            })
                        });

                } else if ( !!groupPrice ) {
                    const { price, title, img, _id } = detail;
                    meta = [{
                        price,
                        pid: _id,
                        name: title,
                        groupPrice,
                        sid: undefined,
                        img: img[ 0 ],
                        canPin: !!shopping.find( s => s.pid === _id )
                    }];
                }

                // 根据活动，更改、新增拼团项目
                activities.map( ac => {
                    if ( !ac.ac_groupPrice ) { return; }
                    const pinTarget = meta.find( x => x.pid === ac.pid && x.sid === ac.sid );
                    const pinTargetIndex = meta.findIndex( x => x.pid === ac.pid && x.sid === ac.sid );

                    // 替换
                    if ( pinTargetIndex !== -1 ) {
                        meta.splice( pinTargetIndex, 1, Object.assign({ }, pinTarget, {
                            price: ac.ac_price,
                            groupPrice: ac.ac_groupPrice
                        }));

                    // 新增
                    } else {
                        meta.push({
                            sid: ac.sid,
                            pid: ac.pid,
                            img: ac.img,
                            name: ac.title,
                            canPin: !!shopping.find( s => s.sid === ac.sid && s.pid === ac.pid ),
                            price: ac.ac_price,
                            groupPrice: ac.ac_groupPrice 
                        })
                    }
                });
                return meta;
            },

            // 马上可以拼团的个数
            pinCount$: function( ) {
                const { detail, shopping } = this.data;
                if ( !detail ) { 
                    return 0;
                }

                const { standards, groupPrice } = detail;

                if ( !!standards && standards.length > 0 ) {
                    return standards
                        .filter( x => !!shopping.find( s => s.sid === x._id && s.pid === x.pid ))
                        .length;

                } else if ( !!groupPrice ) {
                    const { _id } = detail;
                    return !!shopping.find( s => s.pid === _id ) ? 1 : 0
                }

                return 0;
            },

            // 是否有型号
            hasStanders$: function( ) {
                const { detail } = this.data;
                if ( !detail ) { 
                    return false;
                }
                const { standards } = detail;
                return !!standards && standards.length > 0 ;
            },

        })
    },

    /** 拉取商品详情 */
    fetDetail( id ) {
        const { detail } = this.data;
        if ( detail ) { return; }
        http({
            data: {
                _id: id,
            },
            errMsg: '获取商品错误，请重试',
            url: `good_detail`,
            success: res => {
              if ( res.status !== 200 ) { return; }

                let pin: any = [ ];
                const { standards, groupPrice, activities } = res.data;

                if ( standards.length > 0 ) {
                    pin = standards.filter( x => !!x.groupPrice );

                } else if ( !!groupPrice ) {
                    const { price, title, img  } = res.data;
                    pin = [{
                        price,
                        name: title,
                        groupPrice,
                        img: img[ 0 ]
                    }];
                }

                const activities$ = activities.map( x => {

                    let img = '';
                    if ( !!x.sid ) {
                        img = standards.find( y => y._id === x.sid ).img
                    } else {
                        img = res.data.img[ 0 ];
                    }

                    return Object.assign({ }, x, { 
                        img,
                        countdown: ( x.endTime - new Date( ).getTime( )) / ( 1000 )
                    });

                }).filter( y => y.endTime > new Date( ).getTime( ));

                this.setData!({
                    pin,
                    loading: false,
                    detail: res.data,
                    activities: activities$
                });
            }
        });
    },

    /** 拉取当前商品的购物请单信息 */
    fetchShopping( pid, tid ) {
        http({
            url: 'shopping-list_pin',
            data: {
                pid,
                tid,
                detail: false
            },
            success: res => {
                const { status, data } = res;
                if ( status !== 200 ) { return; }
                this.setData!({
                    shopping: data,
                    canPinSku: data.map( x => ({
                        pid: x.pid,
                        sid: x.sid
                    }))
                });
            }
        })
    },

    // 展开提示
    toggleTips( ) {
        const { showTips } = this.data;
        this.setData!({
            showTips: showTips === 'show' ? 'hide' : 'show'
        });
    },

    // 进入商品管理
    goManager( ) {
        navTo(`/pages/manager-goods-detail/index?id=${this.data.id}`)
    },

    /** 监听全局管理员权限 */
    watchRole( ) {
        (app as any).watch$('role', ( val ) => {
            this.setData!({
                showBtn: ( val === 1 )
            })
        });
        (app as any).watch$('isNew', val => {
            this.setData!({
                isNew: val
            });
        });
    },
    
    /** 预览图片 */
    previewImg({ currentTarget }) {
        const { img } = currentTarget.dataset;
        this.data.detail && wx.previewImage({
            current: img,
            urls: [ ...(this.data as any).detail.img ],
        });
    },

    /** 预览单张图片：拼团图片、一口价（限时抢） */
    previewSingleImg({ currentTarget }) {

        const img = currentTarget.dataset.data ?
            currentTarget.dataset.data.img:
            currentTarget.dataset.img;

        this.data.detail && wx.previewImage({
            current: img,
            urls: [ img ],
        });
    },

    /** 设置“喜欢” */
    onLike( ) {
        const that = this;
        if ( !this.data.hasInitLike ) { return; }
        http({
            data: {
                pid: this.data.id
            },
            url: 'like_create',
            success:  ( res: any ) => {
                if ( res.status === 200 ) {
                    this.setData!({
                        liked: !this.data.liked
                    })
                }
            }
        });
    },

    /** 设置“喜欢” */
    checkLike( ) {
        const that = this;
        http({
            data: {
                pid: this.data.id
            },
            url: 'like_check',
            success:  ( res: any ) => {
                if ( res.status === 200 ) {
                    this.setData!({
                        liked: res.data,
                        hasInitLike: true
                    })
                }
            }
        });
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.watchRole( );
        this.runComputed( );
        
        if ( !options!.id ) { return; }
        this.setData!({
            id: options!.id,
            tid: options!.tid
        });
    },
  
    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function ( ) {
        let circleCount = 0; 
        const that: any = this;
        // 心跳的外框动画 
        that.animationMiddleHeaderItem = wx.createAnimation({ 
            duration: 800, 
            timingFunction: 'ease', 
            transformOrigin: '50% 50%',
        }); 
        setInterval( function( ) { 
            if (circleCount % 2 == 0) { 
                that.animationMiddleHeaderItem.scale( 1.0 ).rotate( 10 ).step( ); 
            } else { 
                that.animationMiddleHeaderItem.scale( 1.0 ).rotate( -30 ).step( ); 
            } 
            that.setData({ 
                animationMiddleHeaderItem: that.animationMiddleHeaderItem.export( ) 
            }); 
            
            if ( ++circleCount === 1000 ) { 
                circleCount = 0; 
            } 
        }.bind( this ), 1000 ); 
    },
  
    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function ( ) {
        const { id, tid } = this.data;

        this.checkLike( );
        this.fetDetail( id );
        this.fetchShopping( id, tid );
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
    onShareAppMessage: function ( ) {
        const { detail, pin$, activities } = this.data;
        return {
            title: `${pin$.length === 0 ? 
                        activities.length === 0 ?
                            '给你看看这宝贝！' :
                            '限时特价超实惠！' : 
                        '一起拼团更实惠！'
                }${detail.title}`,
            path: `/pages/good-detail/index?${detail._id}&tid=${this.data.tid}`,
            imageUrl: `${detail.img[ 0 ]}`
        }
    }
  })