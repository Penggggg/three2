const { http } = require('../../util/http.js');
const { computed } = require('../../lib/vuefy/index.js');
const { navTo } = require('../../util/route.js');

Page({

    /**
     * 页面的初始数据
     */
    data: {
        // 卡券列表
        coupons: [ ],
        // 当前行程
        tid: '',
        // 拼团
        shoppinglist: [ ]
    },

    /** 设置computed */
    runComputed( ) {
        computed( this, {
            // 当前行程卡券
            list1$: function( ) {
                const { coupons, tid } = this.data;
                return [
                    ...coupons.filter( x => x.tid === tid )
                ]
            },
            // 当前行程卡券
            list2$: function( ) {
                const { coupons, tid } = this.data;
                return [
                    ...coupons.filter( x => x.tid !== tid )
                ]
            }
        })
    },

    /** 拉取卡券列表 */
    fetchList( ) {

        const { coupons } = this.data;
        if ( coupons.length > 0 ) { return; }

        http({
            data: { },
            url: 'coupon_list',
            success: res => {
                const { status, data } = res;
                if ( status !== 200 ) { return; }
                this.setData({
                    coupons: data
                });
            }
        })
    },

    /** 获取当前行程 */
    fetchCurrentTrip( cb ) {
        const { tid } = this.data;
        if ( tid ) {
            return !!cb && cb( tid );
        }
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

    /** 拉取拼团列表 */
    fetchGroupList( tid ) {
        if ( !tid ) { return; }
        http({
            url: 'shopping-list_list',
            data: {
                tid,
                needOrders: false
            },
            loadingMsg: 'none',
            success: res => {
                const { status, data } = res;
                if ( status === 200 ) {
                    this.setData({
                        shoppinglist: data
                    })
                }
            }
        });
    },

    goGoodDetail({ currentTarget }) {
        const { tid } = this.data;
        const { pid } = currentTarget.dataset.data;
        navTo(`/pages/goods-detail/index?id=${pid}&tid=${tid}`);
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function ( options ) {
        this.runComputed( );
        this.fetchList( );
        this.fetchCurrentTrip( tid => this.fetchGroupList( tid ));
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
        return {
            title: '这有优惠券！跟我一起来拔草～',
            path: '/pages/trip-enter/index'
        }
    }
})