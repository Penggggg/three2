import { http } from './util/http';

App<MyApp>({

    /** fade globalData */
    globalData$: {
        // 登录人权限
        role: 0,
        // 登录人id
        openid: '',
        // 是否已经授权用户信息
        isUserAuth: true,
        // 用户信息
        userInfo: null
    },

    /** 全局store */
    globalData: {
        role: 0,
        openid: '',
        isUserAuth: true,
        userInfo: null
    },

    /** 监听函数的对象数组 */
    watchCallBack: { },

    /** 监听列表 */
    watchingKeys: [ ],

    /** 初始化 */
    init( ) {
        // 云
        wx.cloud.init({
            traceUser: true
        });
        
        // 全局数据
        this.globalData$ = Object.assign({ }, this.globalData );

        // 用户信息
        wx.getSetting({
            success: res => {
                // 是否已经授权
                const isUserAuth = res.authSetting['scope.userInfo'];
                this.setGlobalData({
                    isUserAuth
                });
            }
        });
    },

    /** 获取微信用户登录信息、授权、上传保存 */
    getWxUserInfo( ) {
        wx.getUserInfo({
            success: res => {
                http({
                    data: res.userInfo,
                    url: 'api-user-edit',
                    success: res => {
                        console.log( res );
                        if ( res.result && res.result.status === 200 ) {
                            this.setGlobalData({
                                isUserAuth: true,
                                userInfo: res.userInfo
                            });
                        }
                    }
                });
            }
        })
    },

    /** 获取用户权限信息 */
    getUserInfo( ) {
        wx.cloud.callFunction({
            name: 'login'
        }).then(( res: any) => {
            this.setGlobalData( res.result );
        });
    },

    /** 设置全局数据 */
    setGlobalData( obj ) {
        Object.keys( obj ).map( key => {
            this.globalData[ key ] = obj[ key ];
        });
        this.globalData = Object.assign({ }, this.globalData, { ...(obj as object)});
    },

    /** watch函数 */
    watch$( key, cb ) {
        this.watchCallBack = Object.assign({ }, this.watchCallBack, {
            [ key ]: this.watchCallBack[ key ] || [ ]
        });
        this.watchCallBack[ key ].push( cb );

        // 立马执行一下cb
        const old = this.globalData[ key ];
        cb( old, old );

        // 执行的时候，set的时候，再执行一下cb
        if ( !this.watchingKeys.find( x => x === key )) {
            const that = this;
            this.watchingKeys.push( key );
            Object.defineProperty( this.globalData, key, {
                configurable: true,
                enumerable: true,
                set: function( val ) {
                    const old = that.globalData$[ key ];
                    that.globalData$[ key ] = val;
                    that.watchCallBack[ key ].map(func => func( val, old ));
                },
                get: function( ) {
                    return that.globalData$[key];
                }
            });
        }
    },
  
    /** 生命周期 */
    onLaunch: function( ) {
        this.init( );
        this.getUserInfo( );
        wx.getUserInfo({
            success: res => {
                http({
                    data: res.userInfo,
                    url: 'api-user-edit',
                    success: res => {
                        console.log( res );
                        if ( res.result && res.result.status === 200 ) {
                            this.setGlobalData({
                                isUserAuth: true,
                                userInfo: res.userInfo
                            });
                        }
                    }
                });
            }
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
    getUserInfo: ( ) => void,
    getWxUserInfo: ( ) => void,
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
}