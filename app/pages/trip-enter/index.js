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

        // 数据字典
        dic: { },

        // 目录分类
        classify: [ ],

        // 加载中
        loading: true,

        // 当前选中的分类
        active: 'recommand',

        // ip头像
        ipAvatar: '',

        // ip名称
        ipName: '',

        // 每周上新
        newList: [ ],

        // 推荐商品
        recommendGoods: [ ],

        // 推荐商品宽度
        recommendGoodWidths: [ ],

        // 当前行程
        current: null,

        // 定时器
        clocks: [ ],

        // 展示助手提示
        zhushouTips: false,

        // 模块入口
        entry: [
            {
                label: '好货拼团',
                url: '/pages/ground-pin/index',
                icon: 'https://global-1257764567.cos.ap-guangzhou.myqcloud.com/icon-hufu-1.png'
            }, {
                label: '特价秒杀',
                url: '/pages/good-activity/index',
                icon: 'https://global-1257764567.cos.ap-guangzhou.myqcloud.com/icon-hufu-2.png'
            }, {
                label: '好物上新',
                url: '/pages/good-new/index',
                icon: 'https://global-1257764567.cos.ap-guangzhou.myqcloud.com/icon-hufu-3.png'
            }, {
                label: '签到福利',
                url: '/pages/my/index',
                icon: 'https://global-1257764567.cos.ap-guangzhou.myqcloud.com/icon-hufu-4.png'
            }
        ],

        // 排行榜
        loadingRank: false,

        // 排行榜
        canLoadRankMore: true,

        // 排行榜
        rankPage: 0,

        // 排行榜
        rankList: [ ],

        // 本次行程购物清单
        allShoppinglist: [ ],

        // 展示行程详情入口
        showMember: false,

        // 立减优惠券
        showLijian: false,

        /** 是否已经加载过红包领取信息 */
        initHongbao: false,

        /** 是否已经全额领取过立减红包 */
        hasGetAllLijian: false,

        /** 立减信息 */
        lijian: {
            total: 0,
            notGet: 0,
            hasBeenGet: 0
        },
    },

    runComputed( ) {
        computed( this, {
            // 热门推荐 + 活动标志 
            recommendGoods$: function( ) {
                const { recommendGoods } = this.data;
                const meta = recommendGoods.map( x => Object.assign({ }, x, {
                    // 是否有特价活动
                    hasActivity: Array.isArray( x.activities ) && x.activities.length > 0
                }));
                return meta;
            }
        });
    },

    /** 全局数据 */
    watchRole( ) {

        app.watch$('appConfig', ( val ) => {
            if ( !val ) { return; }
            this.setData({
                ipName: val['ip-name'],
                ipAvatar: val['ip-avatar']
            })
        });

        app.watch$('role', role => {
            this.setData({
                role
            });
        });
    },

    /** 拉取两个最新行程 */
    fetchLast( ) {

        http({
            data: { },
            loadingMsg: '加载中...',
            url: `trip_enter`,
            success: res => {
                const { status, data } = res;
                if ( status !== 200 ) { return; }

                const current = data[ 0 ];

                this.setData({
                    current: data[ 0 ] ? this.dealTrip( data[ 0 ]) : null,
                    recommendGoods: current ? current.products.map( delayeringGood ).filter( x => !!x ) : [ ],
                });

                this.configPinest( );
                this.fetchCoupon( current ? current._id : '' );
                // this.fetchAllShoppinglist( current ? current._id : '' );

            }
        });

    },

    /** 拉取数据字典 */
    fetchDic( ) {
        const { dic } = this.data;
        // if ( Object.keys( dic ).length > 0 ) { return;}

        http({
            data: {
                filterBjp: true,
                dicName: 'goods_category',
            },
            errMsg: '加载失败，请重试',
            url: `common_dic`,
            success: res => {
                if ( res.status !== 200 ) { return; }
                this.setData({
                    loading: false,
                    dic: res.data,
                    classify: [{
                        label: '推荐',
                        value: 'recommand'
                    }, ...res.data.goods_category ]
                });
            }
        });
    },

    /** 拉取新品列表 */
    fetchNew( ) {
        http({
            data: {
                limit: 6,
                page: 1,
                sort: 'createTime'
            },
            url: `good_rank`,
            success: res => {
                const { status, data } = res;
                if ( status !== 200 ) { return; }
                this.setData({
                    newList: data.data.map( delayeringGood ),
                });
            }
        })
    },

    /** 排行榜 */
    fetchRank( ) {
     
        const { loadingRank, canLoadRankMore, rankPage, rankList } = this.data;
        if ( loadingRank || !canLoadRankMore ) { return; }

        this.setData({
            loadingRank: true
        });

        http({
            data: {
                limit: 4,
                page: rankPage + 1,
            },
            url: `good_rank`,
            success: res => {
                const { status, data } = res;
                if ( status !== 200 ) { return; }

                const list = data.data;
                const { pagenation } = data;
                const { page, totalPage } = pagenation;

                const meta = page === 1 ? list : [ ...rankList, ...list ]

                this.setData({
                    rankPage: page,
                    rankList: meta.map( delayeringGood ),
                    loadingRank: false,
                    canLoadRankMore: page < totalPage,
                });
            }
        });
    },

    /** 拉取所有购物清单 */
    fetchAllShoppinglist( tid ) {
        const { allShoppinglist } = this.data;
        if ( allShoppinglist.length > 0 || !tid ) { return; }

        http({
            data: {
                tid,
                type: 'all',
                showUser: true
            },
            url: 'shopping-list_pin',
            success: res => {
                const { status, data } = res;
                if ( status !== 200 ) { return; }

                const noPin = data.filter( x => !x.adjustGroupPrice );
                const waitPin = data.filter( x => !!x.adjustGroupPrice && x.uids.length === 1 );
                const pingList = data.filter( x => !!x.adjustGroupPrice && x.uids.length > 1 );

                this.setData({
                    allShoppinglist: [ ...waitPin, ...pingList ]
                });
            }
        });
    },

    /** 拉取优惠券信息 */
    fetchCoupon( tid ) {
        if ( !!this.data.lijian.total || !tid ) {
            return this.setData({
                initHongbao: true,
                hasGetAllLijian: true
            });
        }

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
                const halfOfLijian = Number( Number( reduce_price * 0.4 ).toFixed( 2 ));
                this.setData({
                    lijian: {
                        total: reduce_price,
                        hasBeenGet: halfOfLijian,
                        notGet: Number( Number( reduce_price * 0.6 ).toFixed( 2 )),
                    }
                })

                // 未领取过立减，则自动拿“半张”优惠券
                if ( t_lijian === false ) {
                    this.autoGetLijian( halfOfLijian );
                }

                this.setData({
                    showLijian: t_lijian === 'half',
                    hasGetAllLijian: t_lijian === true
                });

                if ( t_lijian === 'half' ) {
                    setTimeout(( ) => {
                        this.vibrateShort( );
                    }, 200 );
                }

                setTimeout(( ) => {
                    this.setData({
                        initHongbao: true
                    })
                }, 20 );
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
                    showLijian: true,
                });
                setTimeout(( ) => {
                    this.vibrateShort( );
                }, 200 );
            }
        })
    },

    /** 短振动 */
    vibrateShort( ) {
        wx.vibrateShort({
            success: res => { }
        });
        setTimeout(( ) => {
            wx.vibrateShort({
                success: res => { }
            });
        }, 30 );
    },

    /** 设置本期推荐的网络图片 */
    configPinest( ) {
        const { recommendGoods } = this.data;
        if ( recommendGoods.length === 0 ) { return; }

        Promise.all(
            recommendGoods.map( good => {
                return this.imgInfo( good.img[ 0 ])
            })
        ).then( arr => {
            this.setData({
                recommendGoodWidths: arr
            });
        });
    },

    /** 返回promise的问了图片数据 */
    imgInfo( imgSrc ) {
        return new Promise( resolve => {
            wx.getImageInfo({
                src: imgSrc,
                success: res => {
                    // 在.wxss文件设置了 height:225rpx;
                    const proportion = res.width / res.height;
                    const imgWidth = 225 / proportion;
                    resolve( imgWidth );
                },
                fail: ( ) => {
                    resolve( 0 );
                }
            });
        });
    },

    /** 拼团广场 */
    goGround( ) {
        navTo('/pages/ground-pin/index');
    },

    /** 跳到商品详情 */
    goGoodDetail({ currentTarget }) {
        const { data } = currentTarget.dataset;
        const { pid, _id } = data;
        (!!pid || !!_id ) && navTo(`/pages/goods-detail/index?id=${pid || _id}`);
    },

    /** 选择分类 */
    onChoiceClassify({ currentTarget }) {
        const { value } = currentTarget.dataset;
        this.setData({
            active: value
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

    /** 去搜索 */
    goSearch( ) {
        navTo('/pages/search/index')
    },

    /** 初始化助手定时器 */
    initClock( ) {
        const { clocks } = this.data;
        clocks.push(
            setInterval(( ) => {
                const { zhushouTips } = this.data;
                this.setData({
                    zhushouTips: !zhushouTips
                })
            }, 4000 )
        )
    },

    /** 模块入口 */
    goEntry({ currentTarget }) {
        const { url }  = currentTarget.dataset;
        if ( !!url ) {
            navTo( url )
        } else {
            wx.showToast({
                icon: 'none',
                duration: 2000,
                title: '即将上线'
            });
        }
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

    /** 展示立减大红包 */
    showBigLijian( ) {
        this.setData({
            showLijian: true
        })
    },

    /** 关闭立减弹层，来源于分享完成、主动关闭 */
    closeLijian( ) {
        this.setData({
            showLijian: false
        });
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.runComputed( );
        this.watchRole( );

        this.initClock( );

        this.fetchDic( );
        this.fetchLast( );
        this.fetchNew( );
        this.fetchRank( );
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
        const { role } = this.data;
        if ( role === 1 ) {

            setTimeout(( ) => {
                this.fetchLast( );
            }, 20 );
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
        const { clocks } = this.data;
        clocks.map( c => {
            if ( c ) {
                try {
                    clearInterval( c );
                } catch ( e ) {}
            }
        })
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
        const { current } = this.data; 

        // 获取另一个立减
        if ( event.from === 'button' ) {
            this.getAnotherLijian( );
        }

        return {
            title: '在群拼团小程序～大家都能省！～',
            path: '/pages/trip-enter/index',
            imageUrl: 'https://global-1257764567.cos.ap-guangzhou.myqcloud.com/cover-trip-enter.png'
        }
    }
})