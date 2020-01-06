const storeKey = 'last-show-subscribe-tips';

/** 今天内有没弹过订阅框 */
export const checkSubscribeTips = ( ) => {
    const now = new Date( );
    const record = Number(( wx.getStorageSync( storeKey ) || 0 ));
    
    if ( !record ) {
        wx.setStorageSync( storeKey, String( Date.now( )));
        return false;
    } else {
        const toady = new Date(`${now.getFullYear( )}/${now.getMonth( ) + 1}/${now.getDate( )} 00:00:00`);
        if ( record >= toady.getTime( )) {
            return true;
        } else {
            wx.setStorageSync( storeKey, String( Date.now( )));
            return false;
        }
    }
};

/**
 * 
 * @param type 
 * 订阅类型, 用逗号隔开的3个参数（最多）
 */
export const requestSubscribe = ( types: any, allTemplates: any, cb? ) => {
    
    const typeArr = types.split(',');
    const tmplIds = typeArr.map( type => {
        return (allTemplates[ type ] || { }).id
    }).filter( x => !!x );

    (wx as any).requestSubscribeMessage({
        tmplIds,
        success: ( ) => {
            !!cb && cb( );
            console.log('订阅接口调用成功，但未必允许')
        },
        fail: e => {
            console.log('订阅接口失败', e );
        }
    })
}