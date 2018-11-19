// app/pages/manager-goods-list/index.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        // 当前页码
        page: 0,
        // 总页数
        totalPage: 1,
        // 搜索
        search: '',
        // 商品列表
        list: [ ],
        // 库存紧急列表
        stockNeed: [ ],
        // 加载列表ing
        loadingList: false,
        // 能否继续加载
        canLoadMore: true,
        // 上次搜索的文本
        lastSearch: ''
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
        const { canLoadMore, loadingList, lastSearch, search } = this.data;

        if ( loadingList || !canLoadMore ) {
            return;
        }

        if ( search.replace(/\s+/g, "") !== lastSearch ) {
            this.setData!({
                page: 0,
                totalPage: 1
            });
        }

        this.setData!({
            loadingList: true
        });

        wx.showLoading({
            title: '加载中...',
        });

        wx.cloud.callFunction({
            name: 'api-goods-list',
            data: {
                page: this.data.page + 1,
                title: this.data.search
            },
            success: function ( res: any ) {

                const { status, data } = res.result;
                if ( status === 200 ) {
                    const { page, totalPage, search } = data;
                    that.setData!({
                        page,
                        totalPage,
                        lastSearch: search || '',
                        canLoadMore: totalPage > page
                    });
                    
                    if ( data.data && data.data.length > 0 ) {
                        const meta = page === 1 ?
                            that.dealListText( data.data ) :
                            [ ...that.data.list, ...that.dealListText( data.data )];

                        that.setData!({
                            list: meta
                        });
                    }

                }
                wx.hideLoading({ });
                that.setData!({
                    loadingList: false
                });
            },
            fail: function( ) {
                wx.showToast({
                    icon: 'none',
                    title: '获取数据错误',
                });
                wx.hideLoading({ });
                that.setData!({
                    loadingList: false
                });
            }
        });
    },
  
    /** 搜索输入 */
    onInput({ detail }) {
        this.setData!({
            search: detail.value,
            canLoadMore: detail.value.replace(/\s+/g, "") !== this.data.lastSearch
        });
    },

    /** 处理数据到列表的文字显示 */
    dealListText( list ) {
        const that = this;

        return list.map( x => {

            // 设置型号、库存的价格
            let stock = x.stock;
            let price = x.price;

            // 型号只有1种
            if ( x.standards.length === 1 ) {

                stock = x.standards[0].stock;
                price = x.standards[ 0 ].price;
            
            // 型号大于1种
            } else if ( x.standards.length > 1 ) {

                // 处理价格
                const sortedPrice = x.standards.sort(( x, y ) => x.price - y.price );
                if ( sortedPrice[0].price === sortedPrice[sortedPrice.length - 1 ].price ) {
                    price = sortedPrice[0].price;
                } else {
                    price = `${sortedPrice[0].price}~${sortedPrice[sortedPrice.length - 1 ].price}`;
                }
                
                // 处理货存
                const sortedStock = x.standards.filter(i => i.stock !== undefined && i.stock !== null).sort((x, y) => x.stock - y.stock);
                // 有库存型号
                if ( sortedStock.length === 1 ) {
                    stock = `${sortedStock[0].stock}`;
                } else if ( sortedStock.length > 1 ) {
                  if ( sortedStock[0].stock === sortedStock[sortedStock.length - 1].stock ) {
                      stock = `${sortedStock[0].stock}`;
                  } else {
                      stock = `${sortedStock[0].stock}~${sortedStock[sortedStock.length - 1].stock}`;
                  }
                }
            }
          
            const origin: any = [ ...that.data.stockNeed ];
            origin.push(((stock !== undefined) && (Number(stock.split('~')[0]) < 10)));
            that.setData!({
                stockNeed: origin
            });
            return Object.assign({ }, x, {
                stock,
                price
            });
        })
    },

    /** 点击详情 */
    onTab({ currentTarget }) {
        const { pid } = currentTarget.dataset;
        wx.navigateTo({
            url: `/pages/manager-goods-detail/index?id=${pid}`
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