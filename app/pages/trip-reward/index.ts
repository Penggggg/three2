
import { http } from '../../util/http.js';
import { computed } from '../../lib/vuefy/index.js';
import { delayeringGood } from '../../util/goods.js';
import { navTo } from '../../util/route.js';

const app = getApp<any>( );

Page({

    data: {

        tid: '',

        openid: '',

        ipAvatar: '',

        /**
         * 加载
         */
        loading: true,

        /**
         * 其他人清单的 swiper
         */
        swiperIndex: 0,

        /**
         * 是否展示弹幕
         */
        showDanmu: false,

        /**
         * 购物清单
         */
        list: [ ]

    },

    runComputed( ) {
        computed( this, {

            // 购买记录 + 社交属性模块
            social$( ) {
                const avatar = 'https://wx.qlogo.cn/mmopen/vi_32/IejMVZTG8WlibHicHIVQhqcNeC4uBxkzH0FFTbRLMicxib8wrxRRWoJY3gvctylATdmAPhiaVicU4sH0NptSszBdyHiaA/132';
                const getRandom = n => Math.floor( Math.random( ) * n );
                const allTexts = [
                    `棒! 拼团的群友真给力`,
                    `哇! 和群友拼团好划算`,
                    `哈! 下次继续用群拼团`
                ];
                
                const visitors = [
                    avatar,
                    avatar
                ];
                const allVisitors = visitors
                    .map( x => {
                        const randomNum = getRandom( allTexts.length );
                        return {
                            avatar: x,
                            text: allTexts[ randomNum ]
                        }
                    })
                return allVisitors;

            },

            // 其他人(或者是所有人的)的购物清单
            others$( ) {
                const { list, openid } = this.data;
                const otherList = list
                    .filter( x => {
                        return !x.users.find( y => y.openid === openid );
                    })
                    .sort(( x, y ) => {
                        return y.users.length - x.users.length
                    });

                const r = otherList.map( sl => this.transferSl( sl ));
                return r;
            },

            // 个人购物清单
            personal$( ) {
                const { list, openid } = this.data;
                
                const allTexts = [
                    `真给力`,
                    `谢谢你`,
                    `划算～`,
                    `棒!`,
                    `赞!`,
                    `赚!`
                ];

                const myList = list
                    .filter( x => {
                        return x.users.find( y => y.openid === openid );
                    })
                    .sort(( x, y ) => {
                        return y.users.length - x.users.length
                    });

                const r = myList.map( sl => this.transferSl( sl, allTexts ));
                return r;
            },

            // 行程清单总概况
            summary$( ) {
                const { list, openid } = this.data;

                const allSl = list.map( sl => this.transferSl( sl ));
                const mySL = list
                    .filter( x => {
                        return x.users.find( y => y.openid === openid );
                    })
                    .map( sl => this.transferSl( sl ));

                const r = {
                    // 所有群友，一共省了多少
                    groupTotalDelta: allSl.reduce(( x, y ) => x + y.totalDelta, 0 ),
                    // 我一共省了多少
                    myTotalDelta: mySL.reduce(( x, y ) => x + y.successDelta, 0 )
                };
                return r;
            }

        });
    },

    /**
     * 监听store
     */
    watchStore( ) {
        app.watch$('appConfig', val => {
            if ( !!val ) {
                this.setTitle(`${val['ip-name'] || ''}群拼团`)
                this.setData!({
                    ipAvatar: `${val['ip-avatar'] || ''}`
                })
            }
        });
        app.watch$('openid', val => {
            !!val && this.setData!({
                openid: val
            })
        });
    },

    /** 拉取行程的购物请单信息 */
    fetchShopping( tid ) {
        if ( !tid ) { return; }

        http({
            url: 'shopping-list_pin',
            data: {
                tid,
                detail: true,
                showUser: true
            },
            success: res => {
                const { status, data } = res;
                if ( status !== 200 ) { return; }
                this.setData!({
                    list: data,
                    loading: false
                });
            }
        })
    },

    /** 
     * 设置标题
     */
    setTitle( title: string ) {
        if ( !title ) { return; }
        wx.setNavigationBarTitle({
            title
        });
    },

    /**
     * 转换格式
     */
    transferSl( sl, allTexts = [ ]) {

        const { pid, adjustGroupPrice, adjustPrice, users, detail } = sl;
        const delta = adjustGroupPrice ? Math.ceil( adjustPrice - adjustGroupPrice ) : 0;
        const totalDelta = delta * users.length;

        const getRandom = n => Math.floor( Math.random( ) * n );

        return {
            pid,
            price: adjustPrice,
            groupPrice: adjustGroupPrice,
            fadePrice: detail.good.fadePrice,
            title: detail.title,
            name: detail.name || '',
            goodImg: detail.img,
            // 总差值
            delta, 
            // 购物清单总差值
            totalDelta,
            // 我的成功拼团差值
            successDelta: users.length > 1 ? delta : 0,
            buyer: users.map( x => ({
                name: x.nickName,
                avatar: x.avatarUrl
            })),
            pinSuccess: users.length > 1,
            tips: allTexts[ getRandom( allTexts.length )],
            tipsIndex: getRandom( users.length > 4 ? 3 : users.length - 1 ) + 1
        }
    },

    /**
     * swiper监听
     */
    onSwiper( e: any ) {
        const { current } = e.detail;
        this.setData!({
            swiperIndex: current
        });
    },

    /**
     * 页面滚动
     */
    onScroll( e: any ) {
        const { showDanmu } = this.data;
        const { scrollTop } = e.detail;
        if ( !!showDanmu ) { return; } 

        if ( scrollTop > 100 ) {
            this.setData!({
                showDanmu: true
            });
        }
    },

    /**
     * tid 行程id
     */
    onLoad: function ( query: any ) {
        const tid = query.tid || "e8f863ba5de6241400076921441bc8d5";
        this.watchStore( );
        this.runComputed( );
        
        this.setData!({
            tid
        });

        this.fetchShopping( tid );

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
    // onShareAppMessage: function ( e ) {

    // }
  })