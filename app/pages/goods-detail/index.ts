// app/pages/manager-goods-list/index.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        // 商品id
        id: '',
        // 商品详情
        detail: null,
        // 数据字典
        dic: { }
    },

    /** 拉取商品详情 */
    fetDetail( id ) {
        const that = this;
        wx.cloud.callFunction({
            name: 'api-goods-detail',
            data: {
                _id: this.data.id
            },
            success: function ( res: any ) {
  
                const { status, data } = res.result;
                if ( status !== 200 ) { return; }
                wx.hideLoading({ });
                that.setData!({
                    detail: data
                });

            },
            fail: function( ) {
                wx.showToast({
                    icon: 'none',
                    title: '获取商品详情错误',
                });
                wx.hideLoading({ });
            }
        });
    },

    /** 拉取数据字典 */
    fetchDic( ) {
        const that = this;
        wx.cloud.callFunction({
            name: 'api-dic',
            data: {
                dicName: 'goods_category',
            },
            success: function( res: any ) {
                that.setData!({
                    dic: res.result
                });
            },
            fail: function( ) {
                wx.showToast({
                    icon: 'none',
                    title: '获取数据错误',
                })
            }
        })
      },
  
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        if ( !options!.id ) { return; }
        this.setData!({
          id: options!.id
        });
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
        this.fetchDic( ); 
        this.fetDetail( this.data.id );
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