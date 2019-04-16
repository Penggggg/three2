const { http } = require('../../util/http.js');
const { navTo } = require('../../util/route.js');
const { computed } = require('../../lib/vuefy/index.js');

const storageKey = 'manager-check-order';

Page({

    /**
     * 页面的初始数据
     */
    data: {

        // 行程
        tid: '',

        // 上次查阅的时间
        last: null,

        // 页数
        page: 0,

        // 加载
        canLoadMore: true,

        // 加载
        loading: false,

        // 列表
        list: [ ]

    },

    runComputed( ) {
        computed( this, {

            list$( ) {
                const { list } = this.data;
                const converTime = ts => {
                    const time = new Date( Number( ts ));
                    const m = time.getMonth( ) + 1;
                    const d = time.getDate( );
                    const h = time.getHours( );
                    const mm = time.getMinutes( );
                    const fix = s => `${String( s ).length === 1 ? '0' + s : s}`
                    return `${fix( m )}-${fix( d )} ${fix( h )}:${ fix( mm )}`;
                };
                const meta = list.map( x => {
                    return Object.assign({ }, x , {
                        time$: converTime( x.createTime ),
                        status$: x.pay_status === '0' ? 
                            '' : 
                            x.pay_status === '1' ? 
                                '' :
                                '已付款'
                    });
                });
                return meta;
            }
        });
    },

    /** 拉取订单列表 */
    fetchList( ) {
        const { tid, last, page, list, canLoadMore, loading } = this.data;
        if ( !canLoadMore || loading ) { return; }

        this.setData({
            loading: true
        });
 
        http({
            data: {
                tid,
                page: page + 1
            },
            url: 'order_list-all',
            success: res => {
                const { status, data } = res;
                if ( status !== 200 ) { return; }

                const { page, totalPage } = data;

                // 去重
                let meta = [ ];
                if ( page === 1 ) {
                    meta = data.data;
                } else {
                    meta = [ ...list, ...data.data.filter( x => !list.find( y => y._id === x._id ))]
                }

                this.setData({
                    page,
                    loading: false,
                    canLoadMore: totalPage > page,
                    list: meta
                });

                // 刷新时间
                page === 1 && wx.setStorageSync( storageKey, String( new Date( ).getTime( )));
            }
        })
    },

    /** 获取行程详情 */
    fetchTrip( ) {
        const { tid } = this.data;
        http({
            data: {
                tid
            },
            url: 'trip_detail',
            success: res => {
                const { status, data } = res;
            }
        })
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        const { tid , last } = options;
        wx.hideShareMenu( );
        this.runComputed( );

        this.setData({
            last: last || null,
            tid
        });
        this.fetchList( );
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
    onShareAppMessage: function () {

    }
})