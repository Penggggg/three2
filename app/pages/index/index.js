const { http } = require('../../util/http.js');
const { computed } = require('../../lib/vuefy/index.js');
const { delayeringGood } = require('../../util/goods.js');
const { navTo } = require('../../util/route.js');

const app = getApp( );

Page({

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

        // 行程id
        tid: '',

        // 活动
        activities: [ ],

        // 新品分页
        newPage: 0,

        // 新品
        newList: [ ],

        // 加载新品
        canLoadNewMore: true,

        // 加载新品
        loadingNewMore: false,

        // 拼团列表
        pingList: [ ],

        // 滚动加载排行榜
        canLoadMore: true,

        // 排行榜
        page: 0,

        // 排行榜
        rank: [ ],

        // 排行榜
        loadingRank: false
    },

    runComputed( ) {
        computed( this, {

            // 新品产品
            newList$( ) {
                const { newList } = this.data;
                return newList.map( x => delayeringGood( x ));
            },

            // 特价活动
            activities$( ) {
                const { activities } = this.data;
                return activities
                    .map( x => {
                        const { ac_groupPrice, ac_price } = x;
                        const meta = delayeringGood( Object.assign({ }, x.detail, {
                            activities: [{
                                ac_price,
                                ac_groupPrice
                            }]
                        }));
                        return Object.assign({ }, meta, x, {
                            _id: x.pid
                        });
                    })
                    .map(( x, k ) => Object.assign({ }, x, {
                        // 排在右边
                        right: k % 2 !== 0
                    }));
            },

            /** 等待拼团列表 */
            pingList$: function( ) {
                const { pingList } = this.data;
                return pingList.sort(( x, y ) => {
                    return x.detail.saled - y.detail.saled;
                });
            },

            /** 排行榜 */
            rank$: function( ) {
                const { rank } = this.data;
                const changeSort = arr => {
                    const arr1 = arr.filter(( x, k ) => k % 2 === 0 );
                    const arr2 = arr.filter(( x, k ) => k % 2 === 1 )
                    return [ ...arr1, ...arr2 ]
                };
                return changeSort( rank )
            }
        });
    },

    /** 拉取一口价列表 */
    fetchDiscount( ) {
        const { activities, role } = this.data;
        if ( role === 0 && activities.length > 0 ) { return; }

        http({
            data: {
                page: 1,
                limit: 999,
                filterPass: true,
                isClosed: false
            },
            url: `activity_good-discount-list`,
            success: res => {
                const { status, data } = res;
                if ( status !== 200 ) { return; }

                const { list, pagenation } = data;
                this.setData({
                    activities: list
                })
            }
        })
    },

    /** 拉取新品列表 */
    fetchNew( ) {
        const { canLoadNewMore, loadingNewMore, newPage, newList } = this.data;

        if ( !canLoadNewMore || !!loadingNewMore ) { return; }

        this.setData({
            loadingNewMore: true
        });

        http({
            data: {
                limit: 5,
                page: newPage + 1,
                sort: 'createTime',
                filterBjp: true
            },
            url: `good_rank`,
            success: res => {
                const { status, data } = res;
                if ( status !== 200 ) { return; }

                const list = data.data;
                const { pagenation } = data;
                const { page, totalPage } = pagenation;

                const meta = page === 1 ? list : [ ...newList, ...list ] 

                this.setData({
                    newPage: page,
                    newList: meta,
                    loadingNewMore: false,
                    canLoadNewMore: page < totalPage,
                });

            }
        })
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

    /** 获取当前行程 */
    fetchCurrentTrip( cb ) {
        const { tid } = this.data;
        if ( !!tid ) { return !!cb && cb( tid ); }

        http({
            url: 'trip_enter',
            data: {
                shouldGetGoods: false
            },
            loadingMsg: 'none',
            success: res => {
                const { status, data } = res;
                if ( status === 200 && !!data[ 0 ]) {
                    const tid = data[ 0 ]._id;
                    !!cb && cb( tid );
                    this.setData({
                        tid
                    });
                    // 此页面不再需要完整的拼团列表
                    // this.fetchPin( tid )
                }
            }
        });
    },

    /** 拉取已经拼团成功的商品列表 */
    fetchPin( tid ) {
        http({
            data: {
                tid,
                type: 'pin',
                showUser: true
            },
            url: 'shopping-list_pin',
            success: res => {
                const { status, data } = res;
                if ( status !== 200 ) { return; }
                this.setData({ 
                    pingList: data
                });
            }
        });
    },

    /** 拉取热门榜列表 */
    fetchRank( ) {
        const { page, canLoadMore, loadingRank, rank } = this.data;

        if ( !canLoadMore || !!loadingRank ) { return; }

        this.setData({
            loadingRank: true
        })

        // 搜索
        http({
            data: {
                limit: 10,
                page: page + 1,
                filterBjp: true
            },
            url: `good_rank`,
            success: res => {
                const { status, data } = res;
                if ( status !== 200 ) { return; }

                const { pagenation } = data;
                const { page, totalPage } = pagenation;
                const list = data.data.map( delayeringGood );
                const meta = page === 1 ? list : [ ...rank, ...list ];

                this.setData({
                    page,
                    rank: meta,
                    loadingRank: false,
                    canLoadMore: page < totalPage
                });
            }
        })
    },

    /** 预览图片 */
    priviewSingle({ currentTarget }) {
        const { img, imgs } = currentTarget.dataset;
        wx.previewImage({
            current: img,
            urls: imgs || [ img ],
        })
    },

    /** 跳到商品详情 */
    goGoodDetail({ currentTarget }) {
        const { tid } = this.data;
        const { good } = currentTarget.dataset;
        navTo(`/pages/goods-detail/index?id=${good.pid || good._id}&tid=${tid}`);
    },

    /** 去搜索 */
    goSearch( ) {
        navTo('/pages/search/index')
    },

    /** 选择分类 */
    onChoiceClassify({ currentTarget }) {
        const { value } = currentTarget.dataset;
        this.setData({
            active: value
        })
    },

    /** 跳到行程详情 */
    goTripDetail( ) {
        const { tid } = this.data;
        if ( !tid ) { return; } 
        navTo(`/pages/trip-detail/index?id=${tid}`);
    },

    /** 初始化加载 */
    initLoad( ) {
        this.fetchRank( );
        this.fetchNew( );
        this.fetchDic( );
        this.fetchDiscount( );
        this.fetchCurrentTrip( );
    },

    onShow( ) {
        const { role } = this.data;
        if ( role === 1 ) {
            this.setData({
                page: 0,
                newPage: 0,
                canLoadMore: true,
                canLoadNewMore: true
            });
            setTimeout(( ) => {
                this.initLoad( );
            }, 20 );
        }
    },

    onLoad( options ) {
        this.runComputed( );
        this.initLoad( );
        app.watch$('role', role => {
            this.setData({
                role
            });
        });
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function ( event ) {
        return {
            title: '[有人@你]跟我一起来拔草～',
            path: '/pages/trip-enter/index',
            imageUrl: 'https://global-1257764567.cos.ap-guangzhou.myqcloud.com/share.png'
        }
    }
});
