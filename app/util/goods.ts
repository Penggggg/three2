
/** 
 * 商品 ～ 价格区间、库存区间、差价、最低价格（含团购价/一口价）
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

    // 无条件注入 特价活动的价格、团购价
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
    if ( !x.standards || x.standards.length === 0 ) {
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
                allPriceArr[ 0 ] === allPriceArr[ allPriceArr.length - 1 ] ? 
                    allPriceArr[ 0 ] :
                    `${allPriceArr[ 0 ]} ~ ${allPriceArr[ allPriceArr.length - 1 ]}`,
        // 最大幅度差价
        priceGap: allPriceArr.length === 0 ?
            0 :
            `${allPriceArr[ allPriceArr.length - 1 ] - allPriceArr[ 0 ]}`,
        // 最低价格（含团购价）
        lowest_price$: allPriceArr[ 0 ],
        /** 是否有活动 */
        hasActivity: !!x.activity || (Array.isArray( x.activities ) && x.activities.length > 0),
        /** 拼团信息 */
        goodPins: dealGoodPin( x )
    })

};

/** 处理商品的拼团差价，返回拼团列表和拼团差价区间（含特价） */
const dealGoodPin = good => {
    const { activities, standards, price, groupPrice } = good;

    // 单品 
    if ( !standards || standards.length === 0 ) {
        return {
            list: [{
                price,
                groupPrice
            }],
            maxDelta: price - groupPrice
        }
    } else {

        const meta = standards.map( standard => {
            const acTarget = activities.find( ac => ac.pid === standard.pid && ac.sid === standard._id );
            if (( !!acTarget && !!acTarget.ac_groupPrice ) || standard.groupPrice ) {
                if ( acTarget ) {
                    return {
                        price: acTarget.ac_price,
                        groupPrice: acTarget.ac_groupPrice
                    }
                } else {
                    return {
                        price: standard.price,
                        groupPrice: standard.groupPrice
                    }
                }
            }
            return null;
        }).filter( x => !!x );

        const deltas = meta.map( x => 
            x.price - x.groupPrice
        ).sort(( x, y ) => y - x );

        return {
            list: meta,
            maxDelta: deltas[ 0 ],
            maxGap: `${deltas[ deltas.length - 1 ]} ~ ${deltas[ 0 ]}`
        };
    }
}

export {
    delayeringGood
}