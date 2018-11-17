// app/pages/manager-goods-list/index.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
      // 当前页码
      page: 1,
      // 总页数
      totalPage: 1,
      // 搜索
      search: '',
      // 商品列表
      list: [ ],
      // 库存紧急列表
      stockNeed: [ ]
    },
  
    /** 跳页 */
    navigate( e ) {
      wx.navigateTo({
        url: e.currentTarget.dataset.url || '/pages/manager-goods-detail/index',
      })
    },
  
    /** 拉取列表 */
    fetchData( ) {
      const that = this;
      wx.showLoading({
        title: '加载中...',
      });
      wx.cloud.callFunction({
        name: 'api-goods-list',
        data: {
          page: this.data.page,
          title: this.data.search
        },
        success: function ( res: any ) {

          const { status, data } = res.result;
          if ( status === 200 ) {
            const { page, totalPage } = data;
            that.setData!({
              page,
              totalPage,
              list: data.data.map( x => {
                // 设置型号、库存的价格
                let stock = x.stock;
                let price = x.price;
                if ( x.standards.length === 1 ) {
                  stock = x.standards[0].stock;
                  price = x.standards[ 0 ].price;
                } else if ( x.standards.length > 1 ) {
                  const sortedPrice = x.standards.sort(( x, y ) => x.price - y.price );
                  price = `${sortedPrice[0].price}~${sortedPrice[sortedPrice.length - 1 ].price}`;
                  const sortedStock = x.standards.filter(i => i.stock !== undefined && i.stock !== null).sort((x, y) => x.stock - y.stock);
                  if ( sortedStock.length === 1 ) {
                    stock = `${sortedStock[0].stock}`;
                  } else if ( sortedStock.length > 1 ) {
                    stock = `${sortedStock[0].stock}~${sortedStock[sortedStock.length - 1].stock}`;
                  }
                }
                
                const origin: any = [...that.data.stockNeed ];
                origin.push(((stock !== undefined) && (Number(stock.split('~')[0]) < 10)));
                that.setData!({
                  stockNeed: origin
                });
                return Object.assign({ }, x, {
                  stock,
                  price
                });
              })
            });
          }
          wx.hideLoading({ });
        },
        fail: function( ) {
          wx.showToast({
            icon: 'none',
            title: '获取数据错误',
          });
          wx.hideLoading({ });
        }
      })
    },
  
    /** 搜索输入 */
    onInput({ detail }) {
      this.setData!({
        search: detail.value
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
    onShow: function () {
      this.fetchData( );
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