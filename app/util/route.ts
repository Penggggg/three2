const MAX_PAGES = 9;

/**
 * 
 * ! bug
 * 连续2个相同url，不同query，
 * A -> B 的时候，query参数可能有问题
 */
export const navTo = ( url: string ) => {

        const pages = getCurrentPages( );
        const pageLen = pages.length;
        const existedIndex = pages.findIndex( x => `/${x.route}` === url.split('?') [0 ]);

        console.log( pages.map( x => x.route ), pageLen, existedIndex )

        if ( existedIndex !== -1 ) {
            wx.navigateBack({
                delta: pageLen - existedIndex - 1
            });
        } else {
            if ( pageLen < MAX_PAGES ) {
                wx.navigateTo({
                    url
                });
            } else {
                wx.redirectTo({
                    url
                });
            }
        }
};