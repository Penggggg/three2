const app = getApp<any>( );
import { http } from '../../util/http';
import { navTo } from '../../util/route.js';

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
        isNotAvailableTrip: false,
        // 背景样式
        bgs: [
            'background-image: linear-gradient(120deg, #84fab0 0%, #8fd3f4 100%);',
            'background-image: linear-gradient(45deg, #ff9a9e 0%, #fad0c4 99%, #fad0c4 100%);',
            'background-image: linear-gradient(120deg, #89f7fe 0%, #66a6ff 100%);',
            'background-image: linear-gradient(to top, #37ecba 0%, #72afd3 100%);',
            'background-image: linear-gradient(-45deg, #FFC796 0%, #FF6B95 100%);',
            'background-image: linear-gradient(-225deg, #20E2D7 0%, #F9FEA5 100%);',
            'background-image: linear-gradient(-225deg, #9EFBD3 0%, #57E9F2 48%, #45D4FB 100%);',
        ],
        // 展示创建成功提示
        showSuccess: false
    },

    /** 跳页 */
    navigate( e ) {
        navTo('/pages/manager-trip-detail/index');
    },

    /** 输入框确认 */
    onConformSearch({ detail }) {
        this.setData!({
            page: 0,
            totalPage: 0,
            search: detail,
            canLoadMore: true
        });
        this.fetchData( );
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

        http({
            data: {
                page: this.data.page + 1,
                title: this.data.search
            },
            errMsg: '加载失败，请重试',
            loadingMsg: '加载中...',
            url: `trip_list`,
            success: res => {
                const { status, data } = res;
                
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
            }
        });
    },

    /** 编辑行程列表文字 */
    dealListText( list ) {

        const simpleTime = (ts: number) => {
            const time = new Date( Number( ts ));
            return `${time.getMonth( )+1}月${time.getDate( )}日`
        };

        const simpleTime2 = (ts: number) => {
            const time = new Date( Number( ts ));
            return `${time.getMonth( )+1}.${time.getDate( )}`
        };

        /**
         * ! 注意，时间对比。开始时间是 指定日期的早上8点；结束日期是 指定日期的晚上24:00
         */
        const meta = list.map(( x, k ) => {
            const { _id, type, title, sales_volume, start_date, published, end_date, orders, isClosed, clients, notPayAllClients } = x;

            const state$ = !published ?
                '未发布' :
                isClosed ?
                    '已关闭' :
                    new Date( ).getTime( ) >= end_date ?
                        '已结束' :
                        new Date( ).getTime( ) >= start_date ?
                            '进行中' :
                            '即将开始';

            return {
                _id,
                title,
                orders,
                bg: k % 7,
                sales_volume,
                state: state$,
                isClosed,
                clients,
                notPayAllClients,
                ing: state$ === '进行中',
                endDate: simpleTime( end_date ),
                startDate: simpleTime( start_date ),
                endDate2: simpleTime2( end_date ),
                startDate2: simpleTime2( start_date ),
                red: state$ === '未发布' || state$ === '进行中' || state$ === '即将开始',
                label: type === 'sys' ? '自动创建' : ''
            }
        });
        return meta;
    },

    /** 搜索输入 */
    onInput({ detail }) {
        this.setData!({
            search: detail.value,
            canLoadMore: detail.value.replace(/\s+/g, "") !== this.data.lastSearch
        });
    },

    /** 点击详情 */
    onTab({ currentTarget, detail }) {
        const { tid } = currentTarget.dataset;
        if ( !tid ) { return; }
        navTo(`/pages/manager-trip-detail/index?id=${tid}`);
    },

    /** 跳动详情的订单 */
    goOrder({ currentTarget, detail }) {
        const { tid } = currentTarget.dataset;
        navTo(`/pages/manager-trip-order/index?id=${tid}`);
    },

    onSubscribe( ) {
        app.getSubscribe('newOrder,trip,getMoney');
    },
  
    /**
     * query {
     *   s: 1/0 创建成功，有弹框
     * }
     */
    onLoad: function ( query: any ) {
        wx.hideShareMenu({ });
        this.setData!({
            showSuccess: String( query.s ) === '1'
        })
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
        this.setData!({
            page: 0,
            canLoadMore: true
        });
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
    onShareAppMessage: function ( ) {
        this.setData!({
            showSuccess: false
        });
        return {
            title: '超值拼团～进来看看吧',
            path: '/pages/ground-pin/index',
            imageUrl: 'https://global-1257764567.cos.ap-guangzhou.myqcloud.com/share.png'
        }
    }
})