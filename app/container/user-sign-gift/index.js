const { http } = require('../../util/http.js');
const { computed } = require('../../lib/vuefy/index.js');
const { navTo } = require('../../util/route.js');

const app = getApp( );
const storageKey = {
    'exp-get-last-time': 'exp-get-last-time', // 上次获得经验的时间
    'exp-end-count-time': 'exp-end-count-time', // 可以获取经验倒计时的时间
    'integral-get-last-time': 'integral-get-last-time' // 上次免费获得抵扣金的时间
};

Component({
    /**
     * 组件的属性列表
     */
    properties: {
        // 是否展示在html中
        showSign: {
            type: Boolean,
            value: false
        },
        // 是否只展示小红包
        simple: {
            type: Boolean,
            value: true
        },
        // 是否只走「领取抵现金」的路径
        onlyGetMoney: {
            type: Boolean,
            value: false
        },
        // 小红包位置，左/右
        position: {
            type: String,
            value: 'right'
        }
    },

    /**
     * 组件的初始数据
     */
    data: {

        // 是否有用户授权
        isAuth: false,

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

        // 今日是否已经领取过红包
        isGetMoney: true,

        // 今天的经验倒计时
        countDown: 0,

        // x小时后签到
        signCountHour: 2,

        // 弹出登录获抵现金的红包框
        showSignGift: false,

        // 把签到面板弹出
        showSignBlock: false

    },

    /**
     * 组件的方法列表
     */
    methods: {

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
                },

                // 展示红包
                showSignGift$: function( ) {
                    const { showSignGift } = this.data;
                    return showSignGift ? 'show' : 'hide'
                },

                // 是否弹起签到框
                showSignBlock$: function( ) {
                    const { showSignBlock, showSign } = this.data;
                    return showSignBlock && !showSign;
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

            app.watch$('isUserAuth', val => {
                if ( val === undefined ) { return; }
                this.setData({
                    isAuth: val
                });
            });

        },

        /** 获取用户授权 */
        getUserAuth( ) {
            app.getWxUserInfo(( ) => {
                this.getFreeIntegral( true );
            });
        },

        /** 获取当前人的推广积分、签到经验 */
        fetchPushIntegral( e = null, mustFetch = false ) {
            const { onlyGetMoney } = this.data;
            // if ( onlyGetMoney && !mustFetch ) {
            //     return this.checkGetIntegral( true );
            // }
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

                    setTimeout(( ) => {
                        this.initTips( );
                        if ( !onlyGetMoney ) {
                            this.checkGetExp( true );
                        }
                        this.checkGetIntegral( true );
                    }, 100 );
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
                    setTimeout(( ) => {
                        wx.showToast({
                            title: '领取成功',
                            duration: 2500,
                        });
                    }, 100 );
                    this.setData({
                        isGetExp: true,
                        countDown: 0,
                        // showSignBlock: false
                    });
                    this.fetchPushIntegral( );
                    wx.setStorageSync( storageKey['exp-get-last-time'], String( Date.now( )));
                }
            })
        },

        // 获取今天的免费抵现金
        getFreeIntegral( close = false ) {
            const { todaySignGift$, isAuth, pushIntegral } = this.data;
            if ( !isAuth ) { 
                return this.setData({
                    showSignGift: true
                });
            }

            http({
                url: 'common_get-integral',
                data: {
                    integral: todaySignGift$
                },
                loadingMsg: '领取中...',
                success: res => {
                    const { status } = res;
                    if ( status !== 200 ) { return; }

                    wx.showToast({
                        title: '领取成功'
                    })

                    this.setData({
                        isGetMoney: true,
                        showSignGift: true,
                        pushIntegral: Number(( pushIntegral + todaySignGift$ ).toFixed( 2 ))
                    });
                    
                    wx.setStorageSync( storageKey['integral-get-last-time'], String( Date.now( )));

                    // this.fetchPushIntegral( null, true );
                    !!close && this.toggleGift( );
                }
            })
        },

        // 推送模板
        push( ) {
            const { signExp, todaySignGift$, toSignGift$, currentLevelSignGift$, nextLevelSignGift$ } = this.data;
            http({
                url: 'common_get-integral-push',
                data: {
                    get_integral: todaySignGift$,
                    next_integral: toSignGift$,
                    week_integral: currentLevelSignGift$,
                    nextweek_integral: nextLevelSignGift$,
                    signExp
                },
                success: res => { }
            })
        },

        // 开启、关闭红包提示
        toggleGift( e ) {
            
            if ( !!e ) {
                setTimeout(( ) => {
                    this.push( );
                }, 1000 );
            }
            
            const { showSignGift, onlyGetMoney } = this.data;
            this.setData({
                showSignGift: !showSignGift
            });

            if ( !!showSignGift && !onlyGetMoney ) {
                this.setData({
                    showSignBlock: true
                });
            }
        },

        // 开启、关闭签到框
        toggleSign( e ) {
            const { showSignBlock } = this.data;
            this.setData({
                showSignBlock: !showSignBlock
            });
        },

        onSubscribe( ) {
            app.getSubscribe('buyPin,hongbao,trip');
        },

        // 初始化经验倒计时
        // 未领取经验
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

            // 重置状态
            const reset = ( ) => {
                const whenCanGetExp = getRightTime( Date.now( ), signCountHour );
                const countDown = Number((( whenCanGetExp - Date.now( )) / 1000 ).toFixed( 0 ));

                wx.setStorageSync( storageKey['exp-end-count-time'], String( whenCanGetExp ));

                if ( whenCanGetExp > Date.now( )) {
                    this.setData({
                        countDown
                    });

                    // 倒计时
                    setTimeout(( ) => {
                        this.setData({
                            isGetExp: false
                        })
                    }, countDown * 1000 );
                } else {

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
                    } else {
                        // 如果还在今天，并且可以领取
                        this.setData({
                            showSignBlock: true
                        })
                    }

                    

                }
            }
        },

        // 今天是否已经领取经验
        checkGetExp( goNext = false ) {
            const lastTime =  wx.getStorageSync( storageKey['exp-get-last-time']);

            const reset = ( ) => {
                this.setData({
                    isGetExp: false
                });
                !!goNext && this.initExpCount( );
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

        // 检查今天是否已经领取了抵现金
        checkGetIntegral( goNext = false ) {
            const lastTime =  wx.getStorageSync( storageKey['integral-get-last-time']);

            const reset = ( ) => {
                this.setData({
                    isGetMoney: false
                });
                !!goNext && this.getFreeIntegral( );
            }

            if ( !lastTime ) {
                return reset( );
                
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
                    return reset( );
                }
            }
        },

        // 跳到分享广场
        goGound( ) {
            navTo('/pages/ground-push-integral/index');
        }

    },

    attached: function( ) {
        const { showSign, simple } = this.data;
        this.watchRole( );
        this.runComputed( );
        !!simple && this.checkGetIntegral( );
        (showSign || !simple) && this.fetchPushIntegral( );
    }
})
