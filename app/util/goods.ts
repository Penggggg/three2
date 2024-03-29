
/** 积分推广比例 */
const pushIntegralRate = 0.05;

/** 
 * 商品 ～ 价格区间、库存区间、差价、最低价格（含团购价/一口价）
 * @param x 商品详情
 * @param pushIntegralRate 积分推广获点比例
 */
const delayeringGood = ( x, pushIntegralRate = 0 ) => {
 
    if ( !x || Object.keys( x ).length === 0 ) {
        return { };
    }

    // 最低拼团价，对应的原价
    let lowest_pin_origin_price$ = x.price;

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
        lowest_pin_origin_price$ = x.price;
    // 有型号
    } else {
        x.standards.map( decorateItem );

        let standardSet: any = null;
        let lowest_standard_price = 0;

        x.standards.map( x => {
            if ( x.groupPrice < lowest_standard_price || lowest_standard_price === 0 ) {
                standardSet = x;
                lowest_standard_price = x.groupPrice;
            }
        });
        if ( !!standardSet ) {
            lowest_pin_origin_price$ = standardSet.price;
        }
    }

    // 重新排序价格和库存
    allPriceArr = allPriceArr.sort(( x, y ) => x - y );
    allStockArr = allStockArr.sort(( x, y ) => x - y );

    // 最低价
    let lowest_price$ = allPriceArr[ 0 ];

    // 有特价
    ( x.activities || [ ]).map( activity => {
        if ( 
            !!activity.ac_price &&
            !!activity.ac_groupPrice && 
            lowest_price$ === activity.ac_groupPrice 
        ) {
            lowest_pin_origin_price$ = activity.ac_price;
        }
    });


    return Object.assign({ }, x, {

        pid: x._id,

        // 是否有拼团
        hasPin: hasPin( x ),

        // 库存区间
        stock$: allStockArr.length === 0 ?
            allStockArr[ 0 ] :
            allStockArr[ 0 ] === allStockArr[ allStockArr.length - 1 ] ?
                allStockArr[ 0 ] :
                `${allStockArr[ 0 ]} ~ ${allStockArr[ allStockArr.length - 1 ]}`,

        // 价格区间
        price$: allPriceArr.length === 0 ?
            allPriceArr[ 0 ] :
                allPriceArr[ 0 ] === allPriceArr[ allPriceArr.length - 1 ] ? 
                    allPriceArr[ 0 ] :
                    `${allPriceArr[ 0 ]} ~ ${allPriceArr[ allPriceArr.length - 1 ]}`,

        // 可获积分区间
        integral$: allPriceArr.length === 0 ?
            (allPriceArr[ 0 ] * pushIntegralRate).toFixed( 1 ) :
                allPriceArr[ 0 ] === allPriceArr[ allPriceArr.length - 1 ] ? 
                    (allPriceArr[ 0 ] * pushIntegralRate).toFixed( 1 ) :
                    `${(allPriceArr[ 0 ] * pushIntegralRate).toFixed( 1 )} ~ ${(allPriceArr[ allPriceArr.length - 1 ] * pushIntegralRate).toFixed( 1 )}`,

        // 最大积分
        maxIntegral$: Number((allPriceArr[ allPriceArr.length - 1 ] * pushIntegralRate).toFixed( 1 )),

        // 最大幅度差价
        priceGap: allPriceArr.length === 0 ?
            0 :
            Math.ceil( allPriceArr[ allPriceArr.length - 1 ] - allPriceArr[ 0 ]),

        // 最低价格（含团购价）
        lowest_price$,

        // 最低价格（含团购价）的原价
        lowest_pin_origin_price$,

        /** 是否有活动 */
        hasActivity: !!x.activity || (Array.isArray( x.activities ) && x.activities.length > 0),

        /** 拼团信息 */
        goodPins: dealGoodPin( x ),

        /** 标签 */
        tagText: x.tag.join('、'),

        /** 是否存在库存告急 */
        outStock: allStockArr.some( x => x < 10 )
    })

};

const hasPin = good => {
    const { activities, standards, groupPrice } = good;
    const piningStandards = standards.filter( x => !!x.groupPrice );
    const piningActivies = !!activities ? activities.filter( x => !!x.ac_groupPrice ) : [ ];
    return !!groupPrice || piningStandards.length > 0 || piningActivies.length > 0;
}

/** 处理商品的拼团差价，返回拼团列表和拼团差价区间（含特价） */
const dealGoodPin = good => {
    const { activities, standards, price, groupPrice } = good;

    // 单品 
    if ( !standards || standards.length === 0 ) {
        const acTarget = !activities ?
                null : 
                activities.find( ac => ac.pid === good.pid );
        const p = acTarget ? acTarget.ac_price : price;
        const gp = acTarget ? acTarget.ac_groupPrice : groupPrice;
        return {
            // 拼团列表
            list: [{
                price: p,
                groupPrice: gp
            }],
            // 每对可拼团型号，可优惠的价格区间
            eachPriceRound: gp ? (p - gp).toFixed( 2 ) : 0
        }
    } else {

        /** 型号 + 特价 */
        const meta = standards.map( standard => {
            const acTarget = !activities ?
                null : 
                activities.find( ac => ac.pid === standard.pid && ac.sid === standard._id );
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
            (x.price - ( x.groupPrice || 0 )).toFixed( 2 )
        ).sort(( x, y ) => y - x );

        return {
            list: meta,
            // 每对可拼团型号，可优惠的价格区间
            eachPriceRound:  deltas[ deltas.length - 1 ] !== deltas[ 0 ] ?
                 `${deltas[ deltas.length - 1 ]} ~ ${deltas[ 0 ]}` :
                 deltas[ 0 ]
        };
    }
}

export {
    delayeringGood
}