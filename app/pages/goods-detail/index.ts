
import { http } from '../../util/http.js';
import { computed } from '../../lib/vuefy/index.js';
import { delayeringGood } from '../../util/goods.js';
import { navTo } from '../../util/route.js';

const app = getApp<any>( );

// 打开拼团提示的key
const storageKey = 'opened-pin-in-good';

Page({

    // 动画
    animationMiddleHeaderItem: null,

    /**
     * 页面的初始数据
     */
    data: {
        // 是否有用户授权
        isUserAuth: true,

        // ip
        ipName: '',

        // ip 
        ipAvatar: '',

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

        // 正在展示海报
        showingPoster: false,

        // 展示拼团玩法的弹框
        showPlayTips: 'hide',

        // 展示分享赚钱
        showShareGetMoney: false,

        // 展示拼团商品列表
        showPinGoods: 'hide',

        // 分享Tips2
        showShareTips2: false,

        // 拼团列表
        pin: [ ],

        // 本行程的购物清单列表
        shopping: [ ],

        // 一口价活动列表
        activities: [ ],

        // 本趟能够拼团的sku
        canPinSku: [ ],

        // 当前的行程
        trip: null,

        // 当前是否开启了积分推广
        canIntegrayShare: false,

        // 当前账号的openid
        openid: '',

        // 分享人的openid
        from: '',

        // 积分推广获点比例
        pushIntegralRate: 0,

        // 是否展开sku
        openingSku: false,

        // 访问记录
        visitors: [ ]
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
                    const gap = result ? String( result.goodPins.eachPriceRound ).replace(/\.00/g, '') : '';
                    const meta = gap !== '0' && !!gap ? gap : '';
                    return meta;
                }
            },

            // 马上可以拼团的个数
            pinCount$: function( ) {
                const { id, detail } = this.data;
                const goodShopping = this.data.shopping.filter( x => x.pid === id );
                if ( !detail ) { 
                    return 0;
                }

                const { standards, groupPrice } = detail;

                if ( !!standards && standards.length > 0 ) {
                    return standards
                        .filter( x => !!goodShopping.find( s => s.sid === x._id && s.pid === x.pid ))
                        .length;

                } else if ( !!groupPrice ) {
                    const { _id } = detail;
                    return !!goodShopping.find( s => s.pid === _id ) ? 1 : 0
                }

                return 0;
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

                const meta2 = meta.map( x => Object.assign({ }, x, {
                    delta: Number( x.price - x.groupPrice ).toFixed( 0 )
                }));

                return meta2;
            },

            // 积分区间
            integral$: function( ) {
                const { detail, pushIntegralRate } = this.data;
                if ( !detail ) { 
                    return '';
                }
                const result = delayeringGood( detail, pushIntegralRate );
                return result.integral$;
            },

            // 详情
            detail$: function( ) {
                const { detail } = this.data;
                const r = delayeringGood( detail );
                return r;
            },

            // 此账号，是否有单
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

            // 商品的访问记录
            visitors$( ) {
                const { visitors, openid } = this.data;
                return visitors.filter( x => x.openid !== openid );
            },

            // 商品的访问 + 社交属性模块
            social$( ) {
                const { visitors, openid, detail } = this.data;
                const good = delayeringGood( detail ); 
                const getRandom = n => Math.floor( Math.random( ) * n );
                
                const allTexts = [
                    `群里的她也在看`,
                    `群里的她也关注「${good.tagText}」`,
                    `她也感兴趣，跟她拼团`
                ];

                
                const allVisitors = visitors
                    .filter( x => x.openid !== openid )
                    .map( x => {
                        const randomNum = getRandom( allTexts.length );
                        return {
                            avatar: x.avatarUrl,
                            text: allTexts[ randomNum ]
                        }
                    })
                return allVisitors;

            },

            // 当前商品的购物清单
            shopping$( ) {
                const { shopping, id } = this.data;
                return shopping
                    .filter( x => x.pid === id )
                    .map( sl => {
                        const { users, sid, detail } = sl;
                        const { name } = detail;
                        return {
                            ...sl,
                            name,
                            firstUser: users[ 0 ],
                            otherUser: users.slice( 1 ),
                        }
                    })
            },

            // 行程中的其他购物清单
            otherShopping$( ) {
                const { shopping, id } = this.data;
                return shopping
                    .filter( x => x.pid !== id )
                    .map( sl => {
                        const { users, sid, detail } = sl;
                        const { name } = detail;
                        return {
                            ...sl,
                            name,
                            firstUser: users[ 0 ],
                            otherUser: users.slice( 1 ),
                        }
                    })
            },

            // 行程中，当前产品所有型号加起来，有多少人在拼团
            allPinPlayers$( ) {
                const { id, shopping } = this.data;
                const goodShopping = shopping.filter( x => x.pid === id );
                return goodShopping.reduce(( x, sl ) => {
                    return x + sl.uids.length;
                }, 0 );
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

        })
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
        (app as any).watch$('appConfig', val => {
            if ( !val ) { return; }
            this.setData!({
                ipName: val['ip-name'],
                ipAvatar: val['ip-avatar'],
                pushIntegralRate: (val || { })['push-integral-get-rate'] || 0,
                canIntegrayShare: !!(val || { })['good-integral-share'] || false
            });
            this.createShare( );
        });
        (app as any).watch$('openid', val => {
            this.setData!({
                openid: val
            });
            this.createShare( );
        });
        app.watch$('isUserAuth', val => {
            if ( val === undefined ) { return; }
            this.setData!({
                isUserAuth: val
            });
        });
    },

    /** 拉取商品详情 */
    fetDetail( id ) {
        const { detail, from } = this.data;
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
                };

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

                // 弹起拼团框
                if ( !!from && delayeringGood( res.data ).hasPin ) {
                    this.setData!({
                        showPlayTips: 'show'
                    });
                } else if ( !from && delayeringGood( res.data ).hasPin ) {
                    this.checkOpenPin( );
                }
            }
        });
    },

    /** 拉取行程的购物请单信息 */
    fetchShopping( pid, tid ) {
        if ( !pid || !tid ) { return; }

        http({
            url: 'shopping-list_pin',
            data: {
                // pid,
                tid,
                detail: true,
                showUser: true
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

    /** 拉取当前商品的访问记录 */
    fetchVisitRecord( pid, start, before ) {
        if ( !start || !before ) { return; }
        http({
            url: 'good_good-visitors',
            data: {
                pid,
                start, 
                before
            },
            success: res => {
                const { status, data } = res;
                if ( status !== 200 ) { return; }
                this.setData!({
                    visitors: data
                });
            }
        });
    },

    /** 拉取两个最新行程 */
    fetchLast( ) {
        const { id } = this.data;
        http({
            data: { },
            url: `trip_enter`,
            success: res => {
                const { status, data } = res;
                if ( status !== 200 ) { return; }
                const trip = data[ 0 ];
                if ( !!trip ) {
                    const { _id, start_date, end_date } = trip;
                    const tid = _id

                    this.fetchShopping( id, tid );
                    this.fetchVisitRecord( id, start_date, end_date );

                    this.setData!({
                        tid,
                        trip
                    });
                }
            }
        })
    },

    /** 创建分享记录 */
    createShare( ) {
        const { id, canIntegrayShare, from, openid } = this.data;
        if ( !id || !canIntegrayShare || !from || !openid ) { return; }
        http({
            data: {
                from,
                pid: id,
            },
            url: 'common_create-share'
        });
    },

    // 展开拼团玩法提示
    togglePalyTips( e? ) {
        const { showPlayTips } = this.data;
        this.setData!({
            showPlayTips: showPlayTips === 'show' ? 'hide' : 'show'
        });
    },

    // 获取授权、关闭拼团玩法提示
    getUserAuth( ) {
        app.getWxUserInfo(( ) => {
            this.setData!({
                showPlayTips: 'hide'
            });
        });
    },

    // 展示推广积分规则
    toggleShareGetMoney( ) {
        const { showShareGetMoney } = this.data;
        this.setData!({
            showShareGetMoney: !showShareGetMoney
        });
        if ( !showShareGetMoney ) {
            this.onSubscribe( );
        }
    },

    // 展示拼团列表
    togglePinGoods( ) {
        const { showPinGoods } = this.data;
        this.setData!({
            showPinGoods: showPinGoods === 'hide' ? 'show' : 'hide'
        });
        if ( showPinGoods === 'hide' ) {
            this.onSubscribe( );
        }
    },

    onSubscribe( ) {
        app.getSubscribe('buyPin,waitPin,trip');
    },

    // 进入商品管理
    goManager( ) {
        navTo(`/pages/manager-goods-detail/index?id=${this.data.id}`);
    },

    // 进入拼团广场
    goGround( ) {
        navTo('/pages/ground-pin/index')
    },
    
    // 进入商品详情
    goGoodDetail({ currentTarget }) {
        const { pid } = currentTarget.dataset;
        navTo(`/pages/goods-detail/index?id=${pid}`)
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

    /** 检查是否有主动弹开过拼团玩法 */
    checkOpenPin( ) {
        const { detail } = this.data;
        if ( !detail ) { return }
        const result = delayeringGood( detail );
        if ( result ) {
            const oneDay = 24 * 60 * 60 * 1000;
            const priceGap = String( result.goodPins.eachPriceRound ).replace(/\.00/g, '');
            const openRecord = wx.getStorageSync( storageKey );

            if ( !!priceGap && Date.now( ) - Number( openRecord ) >= oneDay ) {
                wx.setStorageSync( storageKey, String( Date.now( )));
                this.togglePalyTips( );
            }
        }
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

    /** 海报开关监听 */
    onPostToggle( e ) {
        const val = e.detail;
        this.setData!({
            showingPoster: val
        });
        wx.setNavigationBarTitle({
            title: val ? '分享商品' : '商品详情'
        });
    },

    /** 海报--开 */
    openPoster( ) {
        const { showingPoster } = this.data;
        const poster = (this as any).selectComponent('#poster');
        poster.toggle( );
        if ( !showingPoster ) {
            this.onSubscribe( );
        }
    },

    /** sku选择弹框 */
    onSkuToggle( e ) {
        this.setData!({
            openingSku: e.detail
        });
    },

    /** sku某部分点击 */
    onSkuTap( e ) {
        const type = e.detail;
        if ( type === 'moneyQuestion' ) {
            this.toggleShareGetMoney( );
        }
    },

    /** 展开、关闭sku框 */
    onToggleSku( ) {
        const { openingSku } = this.data;
        const sku = (this as any).selectComponent('#sku');
        sku.toggleSku( );
        if ( !openingSku ) {
            this.onSubscribe( );
        }
    },

    /**
     * 生命周期函数--监听页面加载
     * {
     *    id || scene // 商品id
     *    tid // 行程id
     *    from // 分享人的id
     * }
     */
    onLoad: function (options) {

        const scene = decodeURIComponent( options!.scene || '' )

        this.runComputed( );

        this.setData!({
            id: '1a2751ef5cab50440283e59a10d24bec'
        })

        if ( options!.id || scene ) { 
            this.setData!({
                id: options!.id || scene,
            });
        }

        if ( !!(options as any).from ) {
            this.setData!({
                from: options!.from
            })
        }
        
        setTimeout(( ) => {
            this.watchRole( );
            // this.checkLike( );
            this.fetchLast( );
        }, 20 );
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
        const { id, tid, trip } = this.data;
        
        this.fetDetail( id );
        this.fetchShopping( id, tid );

        if ( !!trip ) {
            const { start_date, end_date } = (trip as any);
             this.fetchVisitRecord( id, start_date, end_date );
        }

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
    onShareAppMessage: function ( e ) {
        const { hasOrder$, detail$, openid } = (this.data as any);
        return {
            imageUrl: `${detail$.img[ 0 ]}`,
            path: `/pages/goods-detail/index?id=${detail$._id}&from=${openid}`,
            title: !!detail$ && detail$.hasPin && !hasOrder$ ?
                `有人想要吗？拼团买，我们都能省！${detail$.title}` :
                `推荐「${detail$.tagText}」神器!${detail$.title}`
        }
    }
  })