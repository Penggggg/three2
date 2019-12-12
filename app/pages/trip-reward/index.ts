
import { http } from '../../util/http.js';
import { computed } from '../../lib/vuefy/index.js';
import { delayeringGood } from '../../util/goods.js';
import { navTo } from '../../util/route.js';

const app = getApp<any>( );
const storageKey = 'trip-has-reward-list';

Page({

    data: {

        tid: '',

        openid: '',

        ipAvatar: '',

        ipName: '',

        isAdm: false,

        /**
         * 是否有用户授权
         */
        isAuth: false,

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
        list: [ ],

        /**
         * 展示红包
         */
        showHongbao: 'hide',

        /**
         * 是否已经领取过红包了
         */
        hasGet: true

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

            // 其他人的购物清单
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

                const result = r.map( x => {
                    const { pid, goodImg, buyer, totalDelta, name, title } = x;
                    return {
                        pid,
                        img: goodImg,
                        topTips: `${buyer.length > 1 ? buyer.length + '人' : ''}省${totalDelta}元`,
                        bottomTips: `${buyer.length}群友拼团`,
                        avatars: buyer.map( y => y.avatar ),
                        title: `${name ? name + ' ' : ''}${title}`
                    }
                })
                return result;
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

            // 所有人的购物清单
            all$( ) {
                const { list } = this.data;
                
                const allTexts = [
                    `真给力`,
                    `谢谢你`,
                    `划算～`,
                    `棒!`,
                    `赞!`,
                    `赚!`
                ];
                const r = list.map( sl => this.transferSl( sl, allTexts ));
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
                    groupTotalDelta: allSl.reduce(( x, y ) => {
                        return x + ( y.buyer.length > 1 ? y.totalDelta : 0 );
                    }, 0 ),
                    // 我一共省了多少
                    myTotalDelta: mySL.reduce(( x, y ) => x + y.successDelta, 0 )
                };
                return r;
            },

            // 抵现金的奖励金额
            hongbao$( ) {
                const { list, openid } = this.data;

                // 我的购物清单
                const myList = list
                    .filter( x => {
                        return x.users.find( y => y.openid === openid );
                    });

                // 是否有买过东西
                const hasBuy = myList.length > 0;

                // 奖励金额
                const gift = hasBuy ? 1.24 : 0.88;

                // 是否有拼团成功
                const somePinSuccess = myList.some( x => x.users.length > 1 );

                // 文案1
                const title = hasBuy && somePinSuccess ?
                    '拼团成功' :
                    hasBuy && !somePinSuccess ?
                        '差点拼成' :
                        '群拼团 省钱!';
                
                // 文安2
                const summary = hasBuy && somePinSuccess ?
                    '省钱啦！请再接再厉~' :
                    hasBuy && !somePinSuccess ?
                        '莫灰心！多邀请群友拼团' :
                        '下次跟着群友拼';

                return {
                    gift,
                    title,
                    summary
                }
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
                    ipName: val['ip-name'],
                    ipAvatar: `${val['ip-avatar'] || ''}`
                })
            }
        });
        app.watch$('openid', val => {
            !!val && this.setData!({
                openid: val
            })
        });
        app.watch$('isUserAuth', val => {
            if ( val === undefined ) { return; }
            this.setData!({
                isAuth: val
            });
        });
        app.watch$('role', val => {
            if ( val === 0 ) {
                wx.hideShareMenu({ });
            } else {
                wx.showShareMenu({
                    withShareTicket: false
                });
            }
        });
    },

    /** 
     * 拉取行程的购物请单信息
     */
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
                    loading: false,
                    showHongbao: 'show'
                });
            }
        })
    },

    /**
     * 领取红包
     */
    fetchGetGift( ) {
        const { tid, hasGet } = this.data;
        const hongbao$ = (this as any).data.hongbao$;

        if ( hasGet ) {
            wx.showToast({
                title: '已领取过啦'
            });
            return this.toggleHongbao( );
        }

        http({
            url: 'common_get-integral',
            data: {
                integral: hongbao$.gift
            },
            loadingMsg: '领取中...',
            success: res => {
                const { status } = res;
                if ( status !== 200 ) { return; }

                wx.showToast({
                    title: '领取成功'
                });

                this.toggleHongbao( );
                this.setTripReward( tid );
                this.checkIsGet( tid );
            }
        });
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
     * 开关红包
     */
    toggleHongbao( ) {
        const { showHongbao } = this.data;
        this.setData!({
            showHongbao: showHongbao === 'show' ? 'hide' : 'show'
        })
    },

    /**
     * 跳到商品详情
     */
    goGoodDetail( e ) {
        const { data } = e.currentTarget.dataset;
        navTo(`/pages/goods-detail/index?id=${data.pid}`)
    },

    /**
     * 返回主页
     */
    goHome( ) {
        navTo(`/pages/trip-enter/index`);
    },

    /**
     * 订阅
     */
    onSubscribe( ) {
        app.getSubscribe('buyPin,waitPin,trip');
        this.fetchGetGift( );
    },

    /** 
     * 获取用户授权
     */
    getUserAuth( ) {
        app.getWxUserInfo(( ) => {
            this.fetchGetGift( );
        });
    },

    /**
     * 设置已领取红包
     * 仅保留10个行程id
     */
    setTripReward( tid ) {
        const tripSum = 10;
        const hasRewardList = JSON.parse( wx.getStorageSync( storageKey ) || '[ ]');
        hasRewardList.unshift( tid );
        wx.setStorageSync( storageKey, JSON.stringify( hasRewardList.slice( 0, tripSum )))
    },

    /**
     * 检查该趟行程里面
     * 是否已经领取过红包
     */
    checkIsGet( tid ) {
        const hasRewardList = JSON.parse( wx.getStorageSync( storageKey ) || '[ ]');
        this.setData!({
            hasGet: hasRewardList.includes( tid )
        });
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

        this.checkIsGet( tid );
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
    onShareAppMessage: function ( e ) {
        const { ipName, tid, isAdm } = this.data;
        return {
            title: `${ipName || '群拼团'}回报大家啦 点击领取抵现金`,
            imageUrl: 'https://global-1257764567.cos.ap-guangzhou.myqcloud.com/bg-trip-reward-share-colorful.jpg',
            path: `/pages/trip-reward/index?tid=${tid}`
        };
    }
  })