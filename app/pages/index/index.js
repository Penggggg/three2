const { http } = require('../../util/http.js');
const { computed } = require('../../lib/vuefy/index.js');
const { delayeringGood } = require('../../util/goods.js');

const app = getApp( );

Page({

    data: {

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
        loadingNewMore: false
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
            }
        });
    },

    /** 拉取一口价列表 */
    fetchDiscount( ) {
        const { activities } = this.data;
        if ( activities.length > 0 ) { return; }
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
                sort: 'updateTime'
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
        if ( Object.keys( dic ).length > 0 ) { return;}

        http({
            data: {
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
        if ( !!tid ) { return; }
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
                        tid: data[ 0 ]._id
                    });
                }
            }
        });
    },

    /** 跳到商品详情 */
    goGoodDetail({ currentTarget }) {
        const { tid } = this.data;
        const { good } = currentTarget.dataset;
        wx.navigateTo({
            url: `/pages/goods-detail/index?id=${good._id}&tid=${tid}`
        });
    },

    /** 去搜索 */
    goSearch( ) {
        wx.navigateTo({
            url: '/pages/search/index'
        });
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
        wx.navigateTo({
            url: `/pages/trip-detail/index?id=${tid}`
        })
    },

    onLoad( options ) {

        this.runComputed( );

        this.fetchNew( );
        this.fetchDic( );
        this.fetchDiscount( );
        this.fetchCurrentTrip( );
    }
});
