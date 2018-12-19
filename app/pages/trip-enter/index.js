const { http } = require('../../util/http.js');
const { delayeringGood } = require('../../util/goods.js');

// app/pages/trip-enter/index.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        /** 是否已加载过 */
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
        otherGoods: [ ]
    },

    /** 拉取两个最新行程 */
    fetchLast( ) {

        const { loaded } = this.data;
        if ( loaded ) { return; }

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
                    recommendGoods: current? current.products.map( delayeringGood ) : [ ],
                    next: data[ 1 ] ? this.dealTrip( data[ 1 ]) : null,
                    current: data[ 0 ] ? this.dealTrip( data[ 0 ]) : null
                });

                // 顶部公共
                if ( current ) {
                    let text = '';
                    if ( current.fullreduce_values ) {
                        text += `【超值优惠】消费满${current.fullreduce_atleast}元，立减${current.fullreduce_values}元!`;
                    }
                    if ( current.postage === '0' ) {
                        text += `【免邮】消费满${current.postagefree_atleast}元立即免邮!`
                    } else if ( current.postage === '1' ) {
                        text += `【包邮】消费任意金额均包邮费！`
                    }
                    this.setData({
                        notice: text
                    });
                } else if ( !next ) {
                    this.setData({
                        notice: `暂无下一趟行程 T.T`
                    });
                }

            }
        });

    },

    /** 拉取商品销量排行榜 */
    fetchRank( ) {
     
        http({
            data: {
                page: 1
            },
            errMsg: '加载排行榜错误，请重试',
            url: `good_rank`,
            success: res => {
                const { status, data } = res;
            
                this.setData({
                    rankGoods: data.data.map( delayeringGood ),
                    otherGoods: data.data.map( delayeringGood ).slice( 3 )
                });
            }
        });
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

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

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
        this.fetchLast( );
        this.fetchRank( );
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
    // onShareAppMessage: function () {

    // }
})