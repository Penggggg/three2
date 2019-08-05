const { http } = require('../../util/http.js');
const { computed } = require('../../lib/vuefy/index.js');
const { navTo } = require('../../util/route.js');

const app = getApp( );
const storageKey = {
    'exp-get-last-time': 'exp-get-last-time', // 上次获得经验的时间
    'exp-end-count-time': 'exp-end-count-time', // 可以获取经验倒计时的时间
};

Component({
    /**
     * 组件的属性列表
     */
    properties: {

    },

    /**
     * 组件的初始数据
     */
    data: {

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
        signExp: 25,

        // 今天是否已经领取了经验
        isGetExp: true,

        // 今天的经验倒计时
        countDown: 0,

        // x小时后签到
        signCountHour: 2,

    },

    /**
     * 组件的方法列表
     */
    methods: {

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

        // 领取经验
        getExp( ) {
            const { isGetExp, signExp } = this.data;
            if ( isGetExp ) {
                return wx.showToast({
                    icon: 'none',
                    title: '明天再来～'
                });
            }
            http({
                url: 'common_get-exp',
                data: {
                    exp: signExp
                },
                loadingMsg: '领取中...',
                success: res => {
                    const { status } = res;
                    if ( status !== 200 ) { return; }
                    wx.showToast({
                        title: '领取成功',
                        duration: 2500,
                    });
                    this.setData({
                        isGetExp: true
                    });
                    this.fetchPushIntegral( );
                    wx.setStorageSync( storageKey['exp-get-last-time'], String( Date.now( )));
                }
            })
        },

        // 自动弹出转发提示
        initTips( ) {

            const time = setInterval(( ) => {
                const { tips, tips$, tipsIndex, showInteral } = this.data;
                const allTips = tips$

                if ( tipsIndex >= allTips.length - 1 ) {
                    return this.setData({
                        tipsIndex: null,
                        // showInteral: false
                    });
                    // return clearInterval( time );
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

        // 初始化经验倒计时
        initExpCount( ) {
            const now = new Date( );
            const { signCountHour } = this.data;
            const endTime = Number( wx.getStorageSync( storageKey['exp-end-count-time']));

            // 获取可以领取经验的时间点
            // 如果指定时间为 20点 ～ 24点，则统一为23:00，就可领取经验
            const getRightTime = ( ts, signCountHour ) => {
                const time = new Date( Number( ts ));
                const y = time.getFullYear( );
                const m = time.getMonth( ) + 1;
                const d = time.getDate( );
                const hour = time.getHours( );
                if ( hour === 20 || hour === 21 || hour === 22 || hour === 23 ) {
                    return new Date(`${y}/${m}/${d} 22:00:00`).getTime( );
                } else {
                    return Number( ts ) + signCountHour * 60 * 60 * 1000;
                }
            };

            const reset = ( ) => {
                const whenCanGetExp = getRightTime( Date.now( ), signCountHour );
                wx.setStorageSync( storageKey['exp-end-count-time'], String( whenCanGetExp ));

                if ( whenCanGetExp > Date.now( )) {
                    this.setData({
                        countDown: Number((( whenCanGetExp - Date.now( )) / 1000 ).toFixed( 0 ))
                    });
                }
            }

            // 初始化
            if ( !endTime ) {
                
                reset( );
                
            // 如果有endTime
            } else {

                // 倒计时还没有过时
                if ( endTime > Date.now( )) {
                    this.setData({
                        countDown: Number((( endTime - Date.now( )) / 1000 ).toFixed( 0 ))
                    });
                // 倒计时已经过时了
                } else {

                    // 如果倒计时已经过时，并已经不是当天，则重新计算
                    const now = new Date( );
                    const thatTime = new Date( Number( endTime ));

                    const d1 = now.getDate( );
                    const d2 = thatTime.getDate( );
                    const oneDay = 24 * 60 * 60 * 1000;

                    if ( 
                        now.getTime( ) > thatTime.getTime( ) &&
                        (
                            d1 !== d2 ||
                            now.getTime( ) - thatTime.getTime( ) > oneDay
                        ) 
                    ) {
                        reset( );
                    }

                }
            }
        },

        // 今天是否已经领取经验
        checkGetExp( ) {
            const lastTime =  wx.getStorageSync( storageKey['exp-get-last-time']);

            const reset = ( ) => {
                this.setData({
                    isGetExp: false
                });
                this.initExpCount( );
            }

            if ( !lastTime ) {
                reset( );
                
            } else {
                const now = new Date( );
                const thatTime = new Date( Number( lastTime ));

                const d1 = now.getDate( );
                const d2 = thatTime.getDate( );
                const oneDay = 24 * 60 * 60 * 1000;

                if ( 
                    now.getTime( ) > thatTime.getTime( ) &&
                    (
                        d1 !== d2 ||
                        now.getTime( ) - thatTime.getTime( ) > oneDay
                    ) 
                ) {
                    reset( );
                }
            }
        },

        // 跳到分享广场
        goGound( ) {
            navTo('/pages/ground-push-integral/index');
        }

    },

    attached: function( ) {
        this.watchRole( );
        this.runComputed( );

        this.checkGetExp( );
        this.fetchPushIntegral( );
    }
})
