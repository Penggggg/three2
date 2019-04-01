import { http } from '../../util/http.js';
import { delayeringGood } from '../../util/goods.js';
import { computed } from '../../lib/vuefy/index.js';
import { navTo } from '../../util/route.js';

// app/pages/manager-goods-list/index.js
Page({

    /**
     * 页面的初始数据
     */
    data: {

        // 当前页码
        page: 0,

        // 搜索
        search: '',

        // 商品列表
        list: [ ],

        // 加载列表ing
        loadingList: false,

        // 能否继续加载
        canLoadMore: true,

        /** 上下架选项 */
        closeOpts: [
            {
                label: '上架中',
                value: true
            }, {
                label: '未上架',
                value: false
            }
        ]
    },

    runComputed( ) {
        computed( this, {

            // 列表
            list$( ) {
                const { list } = this.data;
                const meta  = list.map( delayeringGood );
                return meta;
            }
        })
    },
  
  
    /** 拉取列表 */
    fetchData( ) {
        const that = this;
        const { canLoadMore, loadingList, page, search } = this.data;

        if ( loadingList || !canLoadMore ) {
            return;
        }

        this.setData!({
            loadingList: true
        });

        http({
            data: {
                limit: 10,
                title: search,
                page: page + 1,
            },
            url: `good_list`,
            success: res => {
                const { status, data } = res;
         
                if ( status === 200 ) {
                    const { page, totalPage } = data;

                    that.setData!({
                        page,
                        loadingList: false,
                        canLoadMore: totalPage > page
                    });
                    
                    if ( data.data && data.data.length > 0 ) {
                        that.setData!({
                            list: page === 1 ?
                                data.data :
                                [ ...that.data.list, ...data.data]
                        });
                    } else {
                        that.setData!({
                            list: [ ]
                        });
                    }

                }
            }

        });
    },

    /** 获取新创建的商品 */
    fetchNew( pid ) {
        http({
            data: {
                _id: pid
            },
            url: 'good_detail',
            success: res => {
                const { list } = this.data;
                const newList: any = [ res.data, ...list ];
                this.setData!({
                    list: newList
                });
            }
        });
    },

    /** 文字选项 ，开启关闭上下架*/
    onSwitch( e ) {
        const { value, sign } = e.detail;
        const list = [ ...this.data.list ];
        wx.showModal({
            title: '提示',
            content: `确定要${ value ? '上架' : '下架' }此商品吗？`,
            success: res => {
                if ( res.confirm ) {
                    http({
                        data: {
                            pid: sign,
                            visiable: value
                        },
                        loadingMsg: value ? '上架中...' : '下架中...',
                        url: 'good_set-visiable',
                        success: res => {
                            if ( res.status === 200 ) {
                                wx.showToast({
                                    title: value ? '上架成功！' : '下架成功！'
                                });
                                const target = list.find(( x: any ) => x._id === sign );
                                const existedIndex = list.findIndex(( x: any ) => x._id === sign );
                                (list as any ).splice( existedIndex, 1, Object.assign({ }, target, {
                                    visiable: value
                                }));
                                this.setData!({
                                    list
                                });
                            }
                        }
                    })
                }
            }
        });
    },
  
    /** 点击详情 */
    onTab({ currentTarget }) {
        const { pid } = currentTarget.dataset;
        navTo( pid ?
            `/pages/manager-goods-detail/index?id=${pid}` :
            `/pages/manager-goods-detail/index`
        );
    },

    /** 确认输入 */
    onConfirm({ detail }) {

        const search = detail;
      
        this.setData!({
            page: 0,
            search,
            canLoadMore: true
        })

        this.fetchData( );
    },
  
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad( options: any ) {
        wx.hideShareMenu({ });
        this.runComputed( );
        this.fetchData( );

        // 创建、删除商品而来的
        if ( options.newPid ) {
            // this.fetchNew( options.newPid );
        }
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