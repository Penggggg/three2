
/** 
 * 商品 ～ 价格区间、库存区间、差价、最低价格（含团购价）
 */
const delayeringGood = x => {

    if ( !x ) {
        return null
    }

    // 初始化：价格数组（含团购价、特价）
    let allPriceArr: any[ ] = [ ];

    // 初始化：库存列表
    let allStockArr: any[ ]  = [ ];

    // 无条件注入 主产品/型号价格、团购价
    const decorateItem = good => {

        allPriceArr.push( good.price );
        
        if ( good.stock ) {
            allStockArr.push( good.stock );
        }

        if ( good.groupPrice ) {
            allPriceArr.push( good.groupPrice );
        }

    };

    const decorateItem2 = activities => {
        if ( Array.isArray( activities )) {
            activities.map( ac => {
                allPriceArr.push( ac.ac_price );
                
                if ( ac.ac_groupPrice ) {
                    allPriceArr.push( ac.ac_groupPrice );
                }
            });
        }
    }

    // 无条件注入 特价活动的价格、团购价
    decorateItem2( x.activities );

    // 没有型号
    if ( x.standards.length === 0 ) {
        decorateItem( x );
    
    // 有型号
    } else {
        x.standards.map( decorateItem );
    }

    // 重新排序价格和库存
    allPriceArr = allPriceArr.sort(( x, y ) => x - y );
    allStockArr = allStockArr.sort(( x, y ) => x - y );

    return Object.assign({ }, x, {
        pid: x._id,
        // 库存区间
        stock$: allStockArr.length === 0 ?
            allStockArr[ 0 ] :
            `${allStockArr[ 0 ]} ~ ${allStockArr[ allStockArr.length - 1 ]}`,
        // 价格区间
        price$: allPriceArr.length === 0 ?
            allPriceArr[ 0 ] :
            `${allPriceArr[ 0 ]} ~ ${allPriceArr[ allPriceArr.length - 1 ]}`,
        // 最大幅度差价
        priceGap: allPriceArr.length === 0 ?
            0 :
            `${allPriceArr[ allPriceArr.length - 1 ] - allPriceArr[ 0 ]}`,
        // 最低价格（含团购价）
        lowest_price$: allPriceArr[ 0 ],
        /** 是否有活动 */
        hasActivity: Array.isArray( x.activities ) && x.activities.length > 0,
    })

};

export {
    delayeringGood
}