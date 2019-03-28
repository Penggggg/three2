const { http } = require('../../util/http.js');
const { computed } = require('../../lib/vuefy/index.js');
const { delayeringGood } = require('../../util/goods.js');

const storageKey = 'client-search';

Page({

    /**
     * 页面的初始数据
     */
    data: {

        // 搜索页
        page: 0,

        // 历史搜搜数据列表
        history: [ ],

        // 搜索
        search: '',

        // 搜索结果
        result: [ ],

        /** 能否记载更多 */
        canLoadMore: true,

        /** tid */
        tid: ''

    },

    /** 设置computed */
    runComputed( ) {
        computed( this, {
            // 列表
            result$( ) {
                const { result } = this.data;
                const changeSort = arr => {
                    const arr1 = arr.filter(( x, k ) => k % 2 === 0 );
                    const arr2 = arr.filter(( x, k ) => k % 2 === 1 )
                    return [ ...arr1, ...arr2 ]
                };
    
                return changeSort( result ).map( delayeringGood );
            }
        })
    },

    /** 获取当前行程 */
    fetchCurrentTrip( cb ) {
        http({
            url: 'trip_enter',
            data: {
                shouldGetGoods: false
            },
            loadingMsg: 'none',
            success: res => {
                const { status, data } = res;
                if ( status === 200 && !!data[ 0 ]) {
                    !!cb && cb( data[ 0 ]._id );
                    this.setData({
                        tid: data[ 0 ]._id
                    });
                }
            }
        });
    },

    /** 拉取列表 */
    fetchList( ) {
        const { page, result, search, canLoadMore, loadingList } = this.data;

        if ( !canLoadMore || !search || loadingList ) { return; }

        this.setData({
            loadingList: true
        });

        // 搜索
        http({
            data: {
                search,
                page: page + 1
            },
            url: 'good_client-search',
            success: res => {
                const { status, data } = res;
                if ( status !== 200 ) { return; }
                
                const { page, totalPage } = data;
                this.setData({
                    page,
                    loadingList: false,
                    canLoadMore: totalPage > page,
                    result: page === 1 ?
                        data.data :
                        [ ...result, ...data.data ]
                });
            }
        })
    },

    /** 确认搜索 */
    onConfirm({ detail }) {

        const search = detail;
        this.addHistory( search );
      
        this.setData({
            page: 0,
            search,
            canLoadMore: true
        })

        this.fetchList( )
    },

    /** 加入历史记录 */
    addHistory( val ) {
        const meta =  wx.getStorageSync( storageKey );
        let temp = meta ? JSON.parse( meta ) : [ ];

        const existedIndex = temp.findIndex( x => x === val );

        // 存在该历史记录
        if ( existedIndex !== -1 ) {
            temp.splice( existedIndex, 1 );
        } 

        temp.unshift( val );
        temp = temp.slice( 0, 6 );
        
        wx.setStorageSync( storageKey, JSON.stringify( temp ));

        this.initHistory( );
    },

    /** 初始化历史记录 */
    initHistory( ) {
        const meta =  wx.getStorageSync( storageKey );
        this.setData({
            history: meta ? JSON.parse( meta ) : [ ]
        });
    },

    /** 选择历史记录 */
    onSelectHistory({ currentTarget }) {
        const { data } = currentTarget.dataset;
        this.setData({
            search: data
        });
        this.onConfirm({
            detail: data
        });
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.runComputed( );
        this.initHistory( );
        this.fetchCurrentTrip( );
        const search = options.search;
        if ( search ) { 
            this.setData({
                search
            });
            this.fetchList( );
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
        const { search } = this.data;
        return {
            title: '给你推荐这宝贝！',
            path: `/pages/search/index?search=${search}`,
        }
    }
})