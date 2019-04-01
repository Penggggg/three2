const MAX_PAGES = 9;

/** 匹配到url，但是不用匹配query */
const whiteList = [
   
];

/** 根据url 返回param对象 */
const makeQuery = ( url: string ) => {
    let params = { };
    const path = url.split('?')[ 1 ];

    if ( !path ) {
        return params;
    }

    const paramsArr = path.split('&');
    paramsArr.map( paramsSet => {
        params = Object.assign({ }, params, {
            [ paramsSet.split('=')[ 0 ]]:  paramsSet.split('=')[ 1 ]
        })
    });
    return params;
};

/** 
 * ! 此函数有漏洞
 * 判断两个params对象是否相等
 */
const judgeEqual = ( obj1: object, obj2: object ) => {
    const key1 = Object.keys( obj1 );
    const key2 = Object.keys( obj2 );
    if ( key1.length !== key2.length ) { return; }
    return !key1.some( keyx1 => obj1[ keyx1 ] !== obj2[ keyx1 ]);
};

/**
 * 
 * 连续2个相同url，不同query，
 * A -> B 的时候，query参数可能有问题
 */
export const navTo = ( url: string ) => {

        const pages = getCurrentPages( );
        const pageLen = pages.length;
        const params = makeQuery( url );
        const existedTarget: any = pages.find( x => `/${x.route}` === url.split('?')[ 0 ]);
        const existedIndex = pages.findIndex( x => `/${x.route}` === url.split('?')[ 0 ]);

        // 如果找到历史路由
        if ( !!existedTarget ) {

            const isParamEqual = judgeEqual( params, existedTarget.options );

            if ( isParamEqual || whiteList.findIndex( x => x === url.split('?')[ 0 ]) !== -1 ) {

                // 参数匹配或者存在白名单的情况下，立马返回
                wx.navigateBack({
                    delta: pageLen - existedIndex - 1
                });

            // url匹配，但是参数不匹配
            } else {

                // 找不到，且不超过max
                if ( pageLen < MAX_PAGES ) {
                    wx.navigateTo({
                        url
                    });

                // 找不到，且超过了max
                } else {
                    wx.redirectTo({
                        url
                    });
                }
            }

        } else {

            // 找不到，且不超过max
            if ( pageLen < MAX_PAGES ) {
                wx.navigateTo({
                    url
                });

            // 找不到，且超过了max
            } else {
                wx.redirectTo({
                    url
                });
            }
        }
};