// app/pages/manager-goods-detail/index.js
Page({

    /**
     * 页面的初始数据
     * ! 列表展示维度：名称、销售额、订单数、状态、开始时间
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
        // 加载列表ing
        loadingList: false,
        // 能否继续加载
        canLoadMore: true,
        // 上次搜索的文本
        lastSearch: '',
        // 是否已经没有下一个可用行程
        isNotAvailableTrip: false
    },

    /** 跳页 */
    navigate( e ) {
        wx.navigateTo({
            url: '/pages/manager-trip-detail/index',
        });
    },

    /** 拉取列表 */
    fetchData( ) {

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
            name: 'api-trip-list',
            data: {
                page: this.data.page + 1,
                title: this.data.search
            },
            success: (res: any) => {
                const { status, data } = res.result;
                if ( status === 200 ) {
                    const { page, totalPage, search } = data;
                    
                    this.setData!({
                        page,
                        totalPage,
                        lastSearch: search || '',
                        canLoadMore: totalPage > page,
                        isNotAvailableTrip: !data.data.some( x => x.published === true && new Date( ).getTime( ) < x.start_date )
                    });
                    
                    if ( data.data && data.data.length > 0 ) {
                        const meta = page === 1 ?
                                this.dealListText( data.data ):
                            [ ...this.data.list, ...this.dealListText( data.data )];

                        this.setData!({
                            list: meta
                        });
                    } else {
                        this.setData!({
                            list: [ ]
                        });
                    }
                }
                
                this.setData!({
                    loadingList: false
                });
            },
            fail: ( ) => {
                wx.showToast({
                    icon: 'none',
                    title: '获取行程错误',
                });
                
                this.setData!({
                    loadingList: false
                });
            },
            complete: ( ) => {
                wx.hideLoading({ });
            }
        });
    },

    /** 编辑行程列表文字 */
    dealListText( list ) {
        /**
         * ! 注意，时间对比。开始时间是 指定日期的早上8点；结束日期是 指定日期的晚上24:00
         */
        return list.map( x => {
            const { _id, title, sales_volume, start_date, published, end_date } = x;
            return {
                _id,
                title,
                sales_volume,
                orders: 0,
                startDate: new Date( start_date ).toLocaleDateString( ),
                state: !published ?
                            '未发布' :
                            new Date( ).getTime( ) >= end_date ?
                                '已结束' :
                                new Date( ).getTime( ) >= start_date ?
                                    '进行中' :
                                    '即将到来'
            }
        })
    },

    /** 搜索输入 */
    onInput({ detail }) {
        this.setData!({
            search: detail.value,
            canLoadMore: detail.value.replace(/\s+/g, "") !== this.data.lastSearch
        });
    },

    /** 点击详情 */
    onTab({ currentTarget }) {
        const { tid } = currentTarget.dataset;
        wx.navigateTo({
            // url: `/pages/trip-detail/index?id=${tid}`
            url: `/pages/manager-trip-detail/index?id=${tid}`
        });
    },
  
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function ( ) {
    
    },
  
    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function ( ) {
  
    },
  
    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function ( ) {
        this.fetchData( );
    },
  
    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function ( ) {
  
    },
  
    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function ( ) {
  
    },
  
    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function ( ) {
  
    },
  
    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function ( ) {
  
    },
  
    /**
     * 用户点击右上角分享
     */
    // onShareAppMessage: function () {
  
    // }
})