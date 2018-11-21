// app/pages/manager-goods-list/index.js

import { computed } from '../../lib/vuefy/index.js';

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
        dic: { },
        // 加载状态
        loading: true
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
                console.log( data );
                wx.hideLoading({ });
                that.setData!({
                    detail: data,
                    loading: false
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

    previewImg({ currentTarget }) {
        const { img } = currentTarget.dataset;
        this.data.detail && wx.previewImage({
            current: img,
            urls: [ ...(this.data as any).detail.img ],
        });
    },
  
    runComputed( ) {
        computed( this, {
            // 计算价格
            price: function( ) {
                const { detail } = this.data;
                if ( !detail ) {
                    return '';
                } else {
                    if ( detail.standards.length === 0 ) {
                        return detail.price;
                    } else if ( detail.standards.length === 1 ) {
                        return detail.standards[ 0 ].price;
                    } else {
                        const sortedPrice = detail.standards.sort(( x, y ) => x.price - y.price );
                        if (  sortedPrice[0].price === sortedPrice[ sortedPrice.length - 1 ].price ) {
                            return sortedPrice[ 0 ].price;
                        } else {
                            return `${sortedPrice[0].price}~${sortedPrice[sortedPrice.length - 1 ].price}`;
                        }
                    }
                }
            }
        })
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.runComputed( );
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