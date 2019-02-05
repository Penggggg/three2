const { computed } = require('../../lib/vuefy/index.js');
const { http } = require('../../util/http.js');

Page({

    /**
     * 页面的初始数据
     */
    data: {

        /** 行程列表 */
        id: '',

        /** 快递图片 */
        delivers: [ ],

        /**
         * 客户订单列表
         * {
         *      pin // 拼团数据
         *      name // 姓名
         *      avatar // 头像
         *      orders // 订单
         * }[ ]
         */
        list: [ ]
    },

    runComputed( ) {
        computed( this, {

            /** 前3 */
            top3$: function( ) {
                const temp = [ ...this.data.list ];
                return temp.slice( 0, 3 );
            },

            /** 前3以外 */
            outtop3$: function( ) {
                const temp = [ ...this.data.list ];
                return temp.slice( 3 );
            },

            /** 全部 */
            list$: function( ) {
                return [ ...this.data.list ];
            }

        })
    },

    /** 拉取图片 */
    fetchImgs( ) {
        http({
            url: 'trip_deliver',
            data: {
                tid: this.data.tid
            },
            success: res => {
                if ( res.status === 200 ) {
                    this.setData({
                        delivers: res.data
                    })
                }
            }
        })
    },

    /** 拉取客户订单列表 */
    fetchOrder( tid ) {
        http({
            url: 'order_daigou-list',
            data: {
                tid
            },
            loadMsg: '加载中...',
            errorMsg: '加载失败，请刷新',
            success: res => {
                const { status, data } = res;
                if ( status === 200 ) {
                    console.log('===', data )
                    const metaList = data.map( meta => {
                        const { user, orders, address } = meta;
                        return {
                            name: user.nickName,
                            avatar: user.avatarUrl,
                            orders: orders.map( o => ({
                                pid: o.pid,
                                imgs: o.img,
                                canGroup: !!o.canGroup
                            })),
                            pin: orders.filter( o => !!o.canGroup ).length
                        }
                    });
                    console.log('...', metaList )
                    this.setData({
                        list: metaList
                    })
                }
            }
        })
    },

    /** 查看快递 */
    showDeliver( ) {
        const { delivers } = this.data;
        if ( delivers.length === 0 ) {
            return wx.showToast({
                icon: 'none',
                title: '暂无快递信息'
            });
        }
        wx.previewImage({
            current: delivers[ 0 ],
            urls: delivers
        })
    },

    /** 跳往行程 */
    goTrip( ) {
        wx.navigateTo({
            url: '/pages/trip-enter/index'
        });
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.runComputed( );
        if ( options.id ) { 
            this.setData({
                id: options.id
            });
            this.fetchImgs( );
            this.fetchOrder( options.id );
        }

        /**
         * !请记得去掉这段代码
         */
        this.setData({
            id: 'XDGzG97E7L4wLIdu'
        });
        this.fetchImgs( );
        this.fetchOrder( 'XDGzG97E7L4wLIdu' );
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