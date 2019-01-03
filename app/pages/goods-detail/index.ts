
import { http } from '../../util/http.js';
import { computed } from '../../lib/vuefy/index.js';

const app = getApp( );

Page({

    // 动画
    animationMiddleHeaderItem: null,

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
        loading: true,
        // 是否初始化过“喜欢”
        hasInitLike: false,
        // 是否“喜欢”
        liked: false,
        // 文字保证提示
        promiseTips: [
            '正品保证', '价格优势', '真人跑腿'
        ],
        // 动画
        animationMiddleHeaderItem: null,
        // 展示管理入口
        showBtn: false
    },

    // 进入商品管理
    goManager( ) {
        wx.navigateTo({
            url: `/pages/manager-goods-detail/index?id=${this.data.id}`
        })
    },

    /** 监听全局管理员权限 */
    watchRole( ) {
        (app as any).watch$('role', ( val ) => {
            this.setData!({
                showBtn: ( val === 1 )
            })
        });
    },
    
    /** 拉取商品详情 */
    fetDetail( id ) {
        http({
            data: {
                _id: id,
            },
            errMsg: '获取商品错误，请重试',
            url: `good_detail`,
            success: res => {
              if ( res.status !== 200 ) { return; }
                this.setData!({
                    detail: res.data,
                    loading: false
                });
            }
        });
    },

    /** 拉取数据字典 */
    fetchDic( ) {
        http({
            data: {
              dicName: 'goods_category',
            },
            errMsg: '加载失败，请重试',
            url: `common_dic`,
            success: res => {
              if ( res.status !== 200 ) { return; }
              this.setData!({
                dic: res.data
              });
            }
        });
    },

    /** 预览图片 */
    previewImg({ currentTarget }) {
        const { img } = currentTarget.dataset;
        this.data.detail && wx.previewImage({
            current: img,
            urls: [ ...(this.data as any).detail.img ],
        });
    },
  
    /** 设置computed */
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
            },
            // 商品详情 - 分行显示
            detailIntro: function( ) {
                const { detail } = this.data;
                if ( !detail || ( !!detail && !detail.detail )) {
                    return [ ];
                } else {
                    return detail.detail.split('\n').filter( x => !!x );
                }
            },
            // 价格 ～ 团购价的差价
            priceGap: function( ) {
                const { detail } = this.data;
                if ( !detail ) {
                    return 0;
                } else {
                    const { standards, groupPrice, price } = detail;
                    // 无型号
                    if ( standards.length === 0 ) {
                        // 有团购的
                        if ( groupPrice !== null && groupPrice !== undefined ) {
                            return  price - groupPrice;
                        } else {
                            return 0;
                        }
                    // 有型号
                    } else {
                        const groupPrice = standards.filter( x => x.groupPrice !== null && x.groupPrice !== undefined );
                        // 型号里面有团购的
                        if ( groupPrice.length > 0 ) {
                            const sortedGroupPrice = groupPrice.sort(( x, y ) => (( x.groupPrice - x.price ) - ( y.groupPrice - y.price )));
                            if (( sortedGroupPrice[0].groupPrice - sortedGroupPrice[0].price ) ===
                                ( sortedGroupPrice[ sortedGroupPrice.length - 1 ].groupPrice - sortedGroupPrice[ sortedGroupPrice.length - 1 ].price )) {
                                return ( sortedGroupPrice[0].price - sortedGroupPrice[0].groupPrice );
                            } else {
                                return `${sortedGroupPrice[ sortedGroupPrice.length - 1 ].price - sortedGroupPrice[ sortedGroupPrice.length - 1 ].groupPrice}~${sortedGroupPrice[0].price - sortedGroupPrice[0].groupPrice}`;
                            }
                        } else {
                            return 0;
                        }
                    }
                }
            }
        })
    },

    /** 设置“喜欢” */
    onLike( ) {
        const that = this;
        if ( !this.data.hasInitLike ) { return; }
        wx.cloud.callFunction({
            name: 'api-like-collection',
            data: {
                pid: this.data.id
            },
            success: function ( res: any ) {
                if ( res.result.status === 200 ) {
                    that.setData!({
                        liked: !that.data.liked
                    })
                }
            },
            fail: function( ) {
                wx.showToast({
                    icon: 'none',
                    title: '设置“喜欢”错误',
                });
            }
        });
    },

    /** 设置“喜欢” */
    checkLike( ) {
        const that = this;
        wx.cloud.callFunction({
            name: 'api-like-collection-detail',
            data: {
                pid: this.data.id
            },
            success: function ( res: any ) {
                that.setData!({
                    hasInitLike: true
                });
                if ( res.result.status === 200 ) {
                    that.setData!({
                        liked: res.result.data
                    })
                }
            },
            fail: function( ) {
                wx.showToast({
                    icon: 'none',
                    title: '查询“喜欢”错误',
                });
            }
        });
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.watchRole( );
        this.runComputed( );
        if ( !options!.id ) { return; }
        this.setData!({
          id: options!.id
        });
    },
  
    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function ( ) {
        let circleCount = 0; 
        const that: any = this;
        // 心跳的外框动画 
        that.animationMiddleHeaderItem = wx.createAnimation({ 
            duration: 800, 
            timingFunction: 'ease', 
            transformOrigin: '50% 50%',
        }); 
        setInterval( function( ) { 
            if (circleCount % 2 == 0) { 
                that.animationMiddleHeaderItem.scale( 1.0 ).rotate( 10 ).step( ); 
            } else { 
                that.animationMiddleHeaderItem.scale( 1.0 ).rotate( -30 ).step( ); 
            } 
            that.setData({ 
                animationMiddleHeaderItem: that.animationMiddleHeaderItem.export( ) 
            }); 
            
            if ( ++circleCount === 1000 ) { 
                circleCount = 0; 
            } 
        }.bind( this ), 1000 ); 
    },
  
    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function ( ) {
        this.fetchDic( ); 
        this.checkLike( );
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