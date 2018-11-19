
App<MyApp>({

    /** fade globalData */
    globalData$: {
        role: 0,
        openid: ''
    },

    /** 全局store */
    globalData: {
        role: 0,
        openid: ''
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
    },

    /** 获取用户信息 */
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
        this.watchCallBack = Object.assign({}, this.watchCallBack, {
            [ key ]: this.watchCallBack[ key ] || [ ]
        });
        this.watchCallBack[ key ].push( cb );
        if ( !this.watchingKeys.find( x => x === key )) {
            const that = this;
            this.watchingKeys.push( key );
            Object.defineProperty( this.globalData, key, {
                configurable: true,
                enumerable: true,
                set: function( val ) {
                    const old = that.globalData$[key];
                    that.globalData$[ key ] = val;
                    that.watchCallBack[ key ].map(func => func( val, old ));
                },
                get: function( ) {
                    return that.globalData$[key];
                }
            });
        }
    },
  
    onLaunch: function( ) {
      this.init( );
      setTimeout(() => this.getUserInfo(), 200 );
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
    setGlobalData: <K extends keyof globalState>( data: globalState | Pick<globalState, K> ) => void,
    watch$: ( key: keyof globalState, any ) => void
}

enum Role {
    normal,
    admin
}

type globalState = {
    role: Role,
    openid: string
}