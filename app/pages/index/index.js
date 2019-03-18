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

        // 新品
        newList: [ ]
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
        http({
            data: {
                page: 1,
                limit: 5,
                sort: 'updateTime'
            },
            url: `good_rank`,
            success: res => {
                const { status, data } = res;
                if ( status !== 200 ) { return; }

                const list = data.data;
                const { pagenation } = data;
                this.setData({
                    newList: list.map( x => delayeringGood( x ))
                });

                console.log( list.map( x => delayeringGood( x )))
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

    onLoad( options ) {
        this.fetchNew( );
        this.fetchDic( );
        this.fetchDiscount( );
        this.fetchCurrentTrip( );
    }
});
