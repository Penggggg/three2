import { http } from './util/http';

const cloudEnv = 'prod-b87b76';
// const cloudEnv = undefined;

App<MyApp>({

    /** fade globalData */
    globalData$: {
        // 登录人权限
        role: 0,
        // 登录人id
        openid: '',
        // 是否已经授权用户信息
        isUserAuth: false,
        // 用户信息
        userInfo: null,
        /** 是否是新客户 */
        isNew: true,
        /** 编辑中的商品数据 */
        editingGood: null
    },

    /** 全局store */
    globalData: {
        role: 0,
        openid: '',
        isUserAuth: false,
        userInfo: null,
        isNew: true,
        editingGood: null
    },

    /** 监听函数的对象数组 */
    watchCallBack: { },

    /** 监听列表 */
    watchingKeys: [ ],

    /** 初始化 */
    init( ) {

        const that = this;
        
        // 全局数据
        this.globalData$ = Object.assign({ }, this.globalData );

        // watch
        Object.keys( this.globalData ).map( key => {
            Object.defineProperty( this.globalData, key, {
                configurable: true,
                enumerable: true,
                set: function( val ) {
                    const old = that.globalData$[ key ];
                    that.globalData$[ key ] = val;
                    if ( Array.isArray( that.watchCallBack[ key ])) {
                        that.watchCallBack[ key ].map(func => func( val, old ));
                    }
                },
                get: function( ) {
                    return that.globalData$[ key ];
                }
            });
        });

        // 用户信息
        wx.getSetting({
            success: res => {
                // 是否已经授权
                const isUserAuth = res.authSetting['scope.userInfo'];
                this.setGlobalData({
                    isUserAuth: isUserAuth === undefined ? false : isUserAuth
                });
            }
        });

    },

    /** 初始化云函数数据库 */
    initCloud( ) {
        return new Promise(( resolve, reject ) => {

            // 云
            wx.cloud.init({
                traceUser: true,
                env: cloudEnv
            });
            resolve( );
        });
    },

    /** 是否为新客 */
    getIsNewCustom( ) {
        http({
            url: 'common_is-new-customer',
            success: res => {
                this.setGlobalData({
                    isNew: res.data
                });
            }
        })
    },

    /** 全局方法，获取微信用户登录信息、授权、上传保存 */
    getWxUserInfo( cb ) {
        wx.getUserInfo({
            success: res => {
                http({
                    data: res.userInfo,
                    url: 'common_userEdit',
                    success: res2 => {
                        if ( res2 && res2.status === 200 ) {
                            this.setGlobalData({
                                isUserAuth: true,
                                userInfo: res.userInfo
                            });
                            cb && cb( );
                        }
                    }
                });
            }
        })
    },

    /** 获取用户权限信息 role/ openid */
    getUserInfo( cb ) {
        wx.cloud.callFunction({
            name: 'login'
        }).then(( res: any) => {
            console.log('[LOGIN]', res.result );
            this.setGlobalData( res.result );
            !!cb && cb( );
        });
    },

    /** 设置全局数据 */
    setGlobalData( obj ) {
        console.log( '【---- Global Set ----】', obj )
        Object.keys( obj ).map( key => {
            this.globalData[ key ] = obj[ key ];
        });
    },

    /** watch函数 */
    watch$( key, cb ) {
        this.watchCallBack = Object.assign({ }, this.watchCallBack, {
            [ key ]: this.watchCallBack[ key ] || [ ]
        });
        this.watchCallBack[ key ].push( cb );
        // 立马执行一下cb
        setTimeout(( ) => {
            const val = this.globalData$[ key ];
            const old = this.globalData[ key ];
            cb( val, old );
        }, 0 );

        // 执行set的时候，再执行一下cb
        if ( !this.watchingKeys.find( x => x === key )) {
            const that = this;
            this.watchingKeys.push( key );
            // Object.defineProperty( this.globalData, key, {
            //     configurable: true,
            //     enumerable: true,
            //     set: function( val ) {
            //         console.log(`${key}被set`, val );
            //         const old = that.globalData$[ key ];
            //         that.globalData$[ key ] = val;
            //         that.watchCallBack[ key ].map(func => func( val, old ));
            //     },
            //     get: function( ) {
            //         return that.globalData$[ key ];
            //     }
            // });
        }
    },
  
    /** 生命周期 */
    onLaunch: function( ) {
        this.init( );
        this.initCloud( )
            .then(( ) => {
                this.getUserInfo( );
                this.getIsNewCustom( );
            })
            .catch( e => {
                wx.showToast({
                    icon: 'none',
                    duration: 2000,
                    title: '数据库初始错误'
                });
            })
        
    }
});

export interface MyApp {
    globalData: globalState,
    globalData$: globalState,
    watchCallBack: {
        [ key: string ]: (( val1: any, val2: any ) => void)[ ]
    }
    watchingKeys: string[ ]
    init: ( ) => void
    initCloud: ( ) => Promise<any>
    getUserInfo: ( cb?: () => void ) => void,
    getIsNewCustom:  ( ) => void,
    getWxUserInfo: ( cb?: ( ) => void ) => void,
    setGlobalData: <K extends keyof globalState>( data: globalState | Pick<globalState, K> ) => void,
    watch$: ( key: keyof globalState, any ) => void
}

enum Role {
    normal,
    admin
}

type globalState = {
    role: Role,
    openid: string,
    isUserAuth: boolean,
    userInfo: any
    isNew: boolean
}