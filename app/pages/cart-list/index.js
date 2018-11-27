// app/pages/cart-list/index.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        /** 购物车列表 含商品详情、型号详情 */
        cartList: [ ]
    },

    fetchList: function( ) {
        const that = this;
        wx.showLoading({
            title: '加载中...',
        });

        wx.cloud.callFunction({
            data: { },
            name: 'api-cart-list',
            success: res => {
                wx.hideLoading({ });
                const { status, data } = res.result;

                if ( status !== 200 ) { return; }

                // 处理：计算当前选择的sku，并设置为current
                const dealed = data.map( x => {

                    let current = null;
                    const { cart, detail } = x;
                    if ( !cart.standarad_id ) {
                        const { _id, title, price, img, stock, limit } = detail;
                        current = {
                            sid: null,
                            standaradName: null,
                            stock,
                            price,
                            img: detail.img[ 0 ]
                        }
                    } else {
                        const currentStandard = detail.standards.find( x => x._id === cart.standarad_id );
                        const { name, price, img, stock } = currentStandard;
                        current = {
                            img,
                            price,
                            stock,
                            standaradName: name,
                            sid: cart.standarad_id,
                        }
                    }

                    current = Object.assign({ }, current, {
                        pid: detail._id,
                        title: detail.title,
                        limit: detail.limit,
                        // 当前已选数量
                        count: cart.count,
                        // 之前选中时候的价格
                        lastPrice: cart.current_price,
                        // 勾选框
                        selected: false
                    })
                    
                    return Object.assign({ }, x , { current });
                });

                console.log( dealed );

                this.setData({
                    cartList: dealed
                })
            },
            fail: err => {
                wx.showToast({
                    icon: 'none',
                    title: '加载购物车错误',
                });
                wx.hideLoading({ });
            }
        })
    },

    c: function( e ) {
        console.log(e)
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
    onShow: function () {
        this.fetchList( );
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