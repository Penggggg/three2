const { http } = require('../../util/http.js');
const { computed } = require('../../lib/vuefy/index.js');

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
        active: '0',

        tid: ''

    },

    /** 去搜索 */
    goSearch( ) {
        wx.navigateTo({
            url: '/pages/search/index'
        });
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

    /** 选择分类 */
    onChoiceClassify({ currentTarget }) {
        const { value } = currentTarget.dataset;
        this.setData({
            active: value
        })
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
                        tid: data[ 0 ]._id
                    });
                }
            }
        });
    },

    onLoad( options ) {
        this.fetchDic( );
        this.fetchCurrentTrip( );
    }
});
