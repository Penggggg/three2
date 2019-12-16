
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

        // 
        trip: null,

        // 分页
        page: 0,

        // 加载
        canLoadMore: true,

        // 加载中
        loading: false,

        // 列表
        list: [ ],

        // 拼团列表
        allShoppinglist: [ ],

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
                const { list, allShoppinglist, search } = this.data;

                const getRandom = n => Math.floor( Math.random( ) * n );
                const allTexts = [
                    `谢谢拼团的群友~`,
                    `赞！又省钱了～`,
                    `错过就亏啦～`,
                    `拼团好划算~`
                ];

                // 拼团总列表
                const metaList = [ ];
                
                list.map( good => {
                    const { standards, activities, visitRecord } = good;
                    // 有型号
                    if ( Array.isArray( standards ) && standards.length > 0 ) {
                        standards.map( standard => {
                            const activeTarget = activities.find( ac => ac.sid === standard._id && !!ac.ac_groupPrice );
                            const meta = {
                                _id: good._id,
                                tag: good.tag,
                                title: good.title,
                                img: standard.img,
                                name: standard.name,
                                detail: good.detail,
                                sid: standard._id,
                                pid: good._id,
                                visitRecord: visitRecord ? visitRecord.avatars : [ ],
                                visitTips: visitRecord ? `${visitRecord.visitorSum}群友在看` : ``
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
                            _id: good._id,
                            tag: good.tag,
                            img: good.img[ 0 ],
                            title: good.title,
                            detail: good.detail,
                            pid: good._id,
                            visitRecord: visitRecord ? visitRecord.avatars : [ ],
                            visitTips: visitRecord ? `${visitRecord.visitorSum}群友看过` : ``
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

                // 根据已拼团列表过滤
                const meta = metaList.filter( x => {
                    return !allShoppinglist.find( s => 
                        x.pid === s.pid &&
                        ( !x.sid || ( !!x.sid && x.sid === s.sid ))
                    );
                });

                // 购物清单
                const meta2 = allShoppinglist
                    .map( s => {
                        const { good } = s.detail;
                        return {
                            _id: s.pid,
                            pid: s.pid,
                            title: good.title,
                            tag: good.tag,
                            img: s.detail.img,
                            price: s.adjustPrice,
                            detail: good.detail,
                            users: (s.users || [ ]),
                            groupPrice: s.adjustGroupPrice,
                        };
                    })
                    .sort(( x, y ) => y.users.length - x.users.length )

                const all = !!search ? 
                    [ ...meta, ...meta2 ] :
                    [ ...meta2, ...meta ];

                const result = all.map(( x, k ) => {
                    const { price, groupPrice } = x;
                    return {
                        ...x,
                        delta: price - groupPrice,
                        zoomTips: x.visitTips || allTexts[ getRandom( allTexts.length )],
                        zoomDelay: k % 2 === 1,
                        tagText: x.tag.join('、'),
                        users: Array.isArray( x.users ) && x.users.length > 0 ? 
                            x.users :
                            Array.isArray( x.visitRecord ) && x.visitRecord.length > 0 ? 
                                x.visitRecord : 
                                [ ],
                        isPin: Array.isArray( x.users ) && x.users.length > 0,
                        isZoom: Array.isArray( x.users ) && x.users.length > 0
                    };
                });
                return result;
            }
        });
    },

    /** 拉取两个最新行程 */
    fetchLast( ) {
        http({
            data: { },
            loadingMsg: '加载中...',
            url: `trip_enter`,
            success: res => {
                const { status, data } = res;
                if ( status !== 200 ) { return; }

                this.setData({
                    trip: data[ 0 ]
                });

                this.fetchAllShoppinglist( data[ 0 ] ? data[ 0 ]._id : '' );

            }
        });
    },

    /** 拉取所有购物清单 */
    fetchAllShoppinglist( tid ) {
        const { allShoppinglist } = this.data;
        if ( allShoppinglist.length > 0 || !tid ) { 
            return this.fetchGoodRank( )
        }

        http({
            data: {
                tid,
                type: 'all',
                showUser: true
            },
            url: 'shopping-list_pin',
            success: res => {
                const { status, data } = res;
                if ( status !== 200 ) { return; }

                const noPin = data.filter( x => !x.adjustGroupPrice );
                const waitPin = data.filter( x => !!x.adjustGroupPrice && x.uids.length === 1 );
                const pingList = data.filter( x => !!x.adjustGroupPrice && x.uids.length > 1 );

                this.setData({
                    allShoppinglist: [ ...pingList, ...waitPin ]
                });

                this.fetchGoodRank( )
            }
        });
    },

    /** 拉取商品列表 */
    fetchGoodRank( reset = false ) {
        const { page, canLoadMore, loading, list, search, trip, allShoppinglist } = this.data;

        if ( !canLoadMore || !!loading ) { return; }

        this.setData({
            loading: true
        });

        http({
            data: {
                search,
                limit: 5,
                page: page + 1,
                visitTime: trip ? trip.start_date : '',
                filterGoodIds: allShoppinglist.map( x => x.pid )
            },
            url: `good_pin-ground`,
            success: res => {
                const { status, data } = res;
                if ( status !== 200 ) { return; }

                const { pagenation } = data;
                const { page, totalPage } = pagenation;

                const meta = reset === true ?
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
        console.log( e.detail.value )
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
            this.fetchGoodRank( true );
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
        this.fetchLast( );
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
        return {
            title: `分享给你！群拼团真划算～`,
            path: `/pages/ground-pin/index`
        }
    }
})