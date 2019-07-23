
import { http } from '../../util/http.js';
import { navTo } from '../../util/route.js';
import { computed } from '../../lib/vuefy/index.js';
import { delayeringGood } from '../../util/goods.js';

const app = getApp( );

Page({

    /**
     * 页面的初始数据
     */
    data: {

        // 分页
        page: 0,

        // 加载
        canLoadMore: true,

        // 加载中
        loading: false,

        // 列表
        list: [ ],

        // 是否打开提示
        openTips: true,

        // 本次手动打开的时间
        openTime: 0,

        // 搜索
        search: ''
    },

    /**  */
    runComputed( ) {
        computed( this, {
            list$: function( ) {
                const { list } = this.data;
                const metaList = [ ];
                
                list.map( good => {
                    const { standards, activities } = good;
                    // 有型号
                    if ( Array.isArray( standards ) && standards.length > 0 ) {
                        standards.map( standard => {
                            const activeTarget = activities.find( ac => ac.sid === standard._id && !!ac.ac_groupPrice );
                            const meta = {
                                tag: good.tag,
                                title: good.title,
                                img: standard.img,
                                name: standard.name
                            };
                            if ( !!activeTarget ) {
                                metaList.push({
                                    ...meta,
                                    price: activeTarget.ac_price,
                                    groupPrice: activeTarget.ac_groupPrice
                                });
                            } else if ( !!standard.groupPrice ) {
                                metaList.push({
                                    ...meta,
                                    price: standard.price,
                                    groupPrice: standard.groupPrice
                                });
                            }
                        });
                    // 无型号
                    } else {
                        const activeTarget = activities.find( ac => !ac.sid && !!ac.ac_groupPrice );
                        const meta = {
                            tag: good.tag,
                            img: good.img,
                            title: good.title,
                            detail: good.detail
                        };
                        if ( !!activeTarget ) {
                            metaList.push({
                                ...meta,
                                price: activeTarget.ac_price,
                                groupPrice: activeTarget.ac_groupPrice
                            });
                        } else if ( !!good.groupPrice ) {
                            metaList.push({
                                ...meta,
                                price: good.price,
                                groupPrice: good.groupPrice
                            });
                        }
                    }
                });
                return metaList;
            }
        });
    },

    /** 拉取拼团列表 */
    fetchPin( reset = false ) {
        const { page, canLoadMore, loading, list, search } = this.data;

        if ( !canLoadMore || !!loading ) { return; }

        this.setData({
            loading: true
        });

        http({
            data: {
                search,
                limit: 10,
                page: page + 1
            },
            url: `good_pin-ground`,
            success: res => {
                const { status, data } = res;
                if ( status !== 200 ) { return; }

                const { pagenation } = data;
                const { page, totalPage } = pagenation;

                const meta = reset ?
                    data.data :
                    page === 1 ? data.data : [ ...list, ...data.data ];
     
                this.setData({
                    page,
                    list: meta,
                    loading: false,
                    canLoadMore: page < totalPage
                });
            }
        });
    },

    /** 输入搜索 */
    onSearch( e ) {
        this.setData({
            search: e.detail.value
        });
    },

    /** 输入搜索 */
    onConfirmSearch( ) {
        this.setData({
            page: 0,
            canLoadMore: true
        });
        setTimeout(( ) => {
            this.fetchPin( true );
        }, 20 );
    },

    /** 提示弹框 */
    onToggle( e ) {
        this.setData({
            openTips: e.detail
        })
    },

    /** 手动打开 */
    sureOpen( ) {
        this.setData({
            openTips: true,
            openTime: Date.now( )
        })
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.runComputed( );
        this.fetchPin( );
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