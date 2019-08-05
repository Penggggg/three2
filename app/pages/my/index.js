const { http } = require('../../util/http.js');
const { navTo } = require('../../util/route.js');
const { computed } = require('../../lib/vuefy/index.js');

const app = getApp( );

Page({

    /**
     * 页面的初始数据
     */
    data: {

        // 分导航模块
        icons: [
            {
                title: '联系客服',
                url: '/pages/concat/index',
                handler: '',
                iconImg: 'https://global-1257764567.cos.ap-guangzhou.myqcloud.com/icon-kefu2.png'
            }
        ],

        // 基本资料
        baseInfo: {
            orders: 0,
            coupons: 0
        },

        // 展示抵现金提示
        showInteral: false,

        // 文字拼团提示
        tips: [
            '下单就能用'
        ],

        // 当前文字拼团提示的下标
        tipsIndex: null,

        // 当前的文字
        tipsText: '',

        // 推广抵现积分
        pushIntegral: 0,

        // 用户经验
        exp: 0,

        // 用户等级数组
        userLevelArr: [ 0, 999, 9999 ],

        // 签到奖励数组
        signGift: [ ],

        // 签到赢积分
        signExp: 20
    },

    runComputed( ) {
        computed( this, {

            // 用户等级
            currentLevel$: function( ) {
                const { userLevelArr, exp } = this.data;
                let level = 0;
                userLevelArr.map(( x, k ) => {
                    if ( exp >= x ) {
                        level = k + 1;
                    }
                });
                return level;
            },

            // 当前用户等级的上限
            currentLevelExp$: function( ) {
                const { userLevelArr, exp } = this.data;
                let max = 999;
                userLevelArr.map(( x, k ) => {
                    if ( exp >= x ) {
                        max = userLevelArr[ k + 1 ] || userLevelArr[ k ];
                    }
                });
                return max;
            },

            // 当前等级的全周送金额
            currentLevelSignGift$: function( ) {
                const { userLevelArr, exp, signGift } = this.data;
                let level = 0;
                userLevelArr.map(( x, k ) => {
                    if ( exp >= x ) {
                        level = k;
                    }
                });
                const signGiftArr = signGift[ level ];
                return signGiftArr ?
                    signGiftArr.reduce(( x, y ) => Number(( x + y ).toFixed( 2 )), 0 ):
                    0;
            },

            // 下级全周送
            nextLevelSignGift$: function( ) {
                const { userLevelArr, exp, signGift } = this.data;
                let level = 0;
                userLevelArr.map(( x, k ) => {
                    if ( exp >= x ) {
                        level = k;
                    }
                });
                const signGiftArr = signGift[ level + 1 ] || signGift[ level ];
                return signGiftArr ?
                    signGiftArr.reduce(( x, y ) => Number(( x + y ).toFixed( 2 )), 0 ):
                    0;
            },

            // 今天签到领多少钱
            todaySignGift$: function( ) {
                const day = new Date( ).getDay( ); // 0 ~ 6
                const { userLevelArr, exp, signGift } = this.data;
                let level = 0;
                userLevelArr.map(( x, k ) => {
                    if ( exp >= x ) {
                        level = k;
                    }
                });
                const signGiftArr = signGift[ level ];
                
                if ( !signGiftArr ) {
                    return 0;
                }

                if ( day === 0 ) {
                    return signGiftArr[ signGiftArr.length - 1 ];
                } else {
                    return signGiftArr[ day - 1 ];
                }
            },

            // 明天签到领多少钱
            toSignGift$: function( ) {
                let level = 0;
                const ts = 24 * 60 * 60 * 1000;
                const day = new Date( new Date( ).getTime( ) + ts ).getDay( ); // 0 ~ 6
                const { userLevelArr, exp, signGift, signExp } = this.data;

                userLevelArr.map(( x, k ) => {
                    if ( exp + signExp >= x ) {
                        level = k;
                    }
                });

                const signGiftArr = signGift[ level ];
                if ( !signGiftArr ) {
                    return 0;
                }

                if ( day === 0 ) {
                    return signGiftArr[ signGiftArr.length - 1 ];
                } else {
                    return signGiftArr[ day - 1 ];
                }
            },

            // 文字提示
            tips$: function( ) {

                let money = 0;
                const meta = ['下单就能用']
                const day = new Date( ).getDay( ); // 0 ~ 6
                const { userLevelArr, exp, signGift } = this.data;
                let level = 0;
                userLevelArr.map(( x, k ) => {
                    if ( exp >= x ) {
                        level = k;
                    }
                });
                const signGiftArr = signGift[ level ];
                
                if ( !signGiftArr ) {
                    return meta;
                }

                if ( day === 0 ) {
                    money = signGiftArr[ signGiftArr.length - 1 ];
                } else {
                    money = signGiftArr[ day - 1 ];
                };

                return [ ...meta, `今天已领${money}元` ]
            }
        });
    },

    /** 全局数据 */
    watchRole( ) {
        app.watch$('appConfig', ( val ) => {

            if ( !val ) { return; }

            const one = val['user-level-one'];
            const two = val['user-level-two'];
            const three = val['user-level-three'];

            const sign1 = val['sign-gift-one'];
            const sign2 = val['sign-gift-two'];
            const sign3 = val['sign-gift-three'];

            this.setData({
                signGift: [ sign1, sign2, sign3 ],
                userLevelArr: [ one, two, three ]
            });
        });
    },

    /** 获取当前人的推广积分 */
    fetchPushIntegral( ) {
        http({
            data: {
                showMore: true
            },
            url: 'common_push-integral',
            success: res => {
                const { status, data } = res;
                if ( status !== 200 ) { return; }
                this.setData({
                    exp: data.exp,
                    pushIntegral: data.integral
                });
                setTimeout(( ) => this.initTips( ), 100 );
            }
        })
    },

    /** 拉取订单、卡券数据 */
    fetchData( ) {
        const { baseInfo } = this.data;

        http({
            loadMsg: '加载中...',
            url: 'common_mypage-info',
            success: res => {
                if ( res.status !== 200 ) { return; }

                const temp = { };
                Object.keys( res.data ).map( key => {
                    temp[ key ] = res.data[ key ];
                });
                this.setData({
                    baseInfo: Object.assign({ }, this.data.baseInfo, temp )
                });
            }
        })
    },

    /** 跳到订单列表 */
    goOrderList( ) {
        navTo('/pages/order-list/index');
    },

    /** 跳到优惠券列表 */
    goCouponList( ) {
        navTo('/pages/coupon-list/index');
    },

    /** 跳到我的喜欢 */
    goLike( ) {
        navTo('/pages/like-goods/index');
    },

    /** 点击下方的客服等模块 */
    onTabIcon({ currentTarget }) {
        const { data } = currentTarget.dataset;
        if ( data.url ) {
            navTo( data.url );
        } else {
            !!this[ data.handler ] && !!this[ data.handler ]( );
        }
    },

    // 自动弹出转发提示
    initTips( ) {

        const time = setInterval(( ) => {
            const { tips, tips$, tipsIndex, showInteral } = this.data;
            const allTips = tips$

            if ( tipsIndex >= allTips.length - 1 ) {
                this.setData({
                    showInteral: false
                });
                return clearInterval( time );
            }

            if ( !showInteral ) {
                const index = tipsIndex === null ? 0 : tipsIndex + 1;
                this.setData({
                    showInteral: true,
                    tipsIndex: index,
                    tipsText: allTips[ index ]
                });
            } else {
                this.setData({
                    showInteral: false
                });
            }
        }, 3500 );
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.runComputed( );
        this.watchRole( );
        // this.initTips( );
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
        this.fetchData( );
        // this.fetchPushIntegral( );
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
            title: '这个小程序真不错！跟我一起来拔草～',
            path: '/pages/trip-enter/index'
        }
    }
})