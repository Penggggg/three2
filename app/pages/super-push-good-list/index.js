
const app = getApp( );
const { http } = require('../../util/http.js');
const { computed } = require('../../lib/vuefy/index.js');
const { navTo } = require('../../util/route.js');

Page({
  
    data: {
        // 当前页码
        page: 0,

        // 加载中
        loadingList: false,

        // 是否可以加载
        canLoadMore: true,

        // 列表
        list: [ ],

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

    /** 拉取列表 */
    fetchData( ) {
        const { canLoadMore, loadingList, page, list } = this.data;

        if ( loadingList || !canLoadMore ) {
            return;
        }

        this.setData({
            loadingList: true
        });

        http({
            data: {
                page: page + 1,
            },
            url: `super-goods_list`,
            success: res => {
                const { status, data } = res;
         
                if ( status === 200 ) {
                    const { page, totalPage } = data;

                    this.setData({
                        page,
                        loadingList: false,
                        canLoadMore: totalPage > page
                    });
                    
                    if ( data.data && data.data.length > 0 ) {
                        this.setData({
                            list: page === 1 ?
                                data.data :
                                [ ...list, ...data.data ]
                        });
                    } else {
                        this.setData({
                            list: [ ]
                        });
                    }

                }
            }

        });
    },

    /** 创建 */
    onCreate( ) {
        navTo(`/pages/super-push-good-detail/index`)
    },

    /** 删除 */
    onDelete({ currentTarget }) {
        const { _id } = currentTarget.dataset.data;
        wx.showModal({
            title: '提示',
            content: `确定要删除此商品吗？`,
            success: res => {
                if ( res.confirm ) {
                    http({
                        data: {
                            spid: _id
                        },
                        url: 'super-goods_delete',
                        success: res => {
                            if ( res.status === 200 ) {
                                this.setData({
                                    page: 0,
                                    canLoadMore: true
                                });
                                setTimeout(( ) => {
                                    this.fetchData( );
                                }, 30 );
                            }
                        }
                    });
                }
            }
        });
    },

    /** 编辑 */
    onEdit({ currentTarget }) {
        const { _id } = currentTarget.dataset.data;
        navTo(`/pages/super-push-good-detail/index?spid=${_id}`)
    },

    /** 上下架 */
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
                            spid: sign,
                            push: value
                        },
                        loadingMsg: value ? '上架中...' : '下架中...',
                        url: 'super-goods_set-push',
                        success: res => {
                            if ( res.status === 200 ) {
                                wx.showToast({
                                    title: value ? '上架成功！' : '下架成功！'
                                });
                                const target = list.find( x => x._id === sign );
                                const existedIndex = list.findIndex( x => x._id === sign );
                                list.splice( existedIndex, 1, {
                                    ...target,
                                    push: value
                                });
                                this.setData({
                                    list
                                });
                            }
                        }
                    })
                }
            }
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
        this.setData({
            page: 0,
            canLoadMore: true
        });
        setTimeout(( ) => {
            this.fetchData( );
        }, 30 );
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