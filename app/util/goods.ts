
/** 
 * 商品 ～ 价格区间、库存区间、差价、最低价格（含团购价）
 * ! 差价排序计算有问题，没有根据差价排序
 * ! 此处默认 团购价小于原价，但不一定有团购价
 */
const delayeringGood = x => {
    if ( !x ) {
        return null
    }
    
    // 初始化 库存、价格、差价、最低价格
    let stock = x.stock;
    let price = x.price;
    let priceGap: any = 0;
    let lowest_price = x.groupPrice || x.price;

    // 处理 库存、价格、最低价格
    // 没有型号
    if ( x.standards.length === 0 ) {
        stock = x.stock;
        price = x.price;

    // 型号只有1种
    } else if ( x.standards.length === 1 ) {
        stock = x.standards[ 0 ].stock;
        price = x.standards[ 0 ].price;
        
        // 型号没有团购价
        if ( !x.standards[ 0 ].groupPrice ) {
            lowest_price = lowest_price < x.standards[ 0 ].price ?
                lowest_price :
                x.standards[ 0 ].price;
        // 型号有团购价
        } else {
            lowest_price = lowest_price < x.standards[ 0 ].groupPrice ?
                lowest_price :
                x.standards[ 0 ].groupPrice;
        }
    
    // 型号大于1种
    }  else if ( x.standards.length > 1 ) {

        // 处理价格
        const sortedPrice = x.standards.sort(( x, y ) => x.price - y.price );
        if ( sortedPrice[0].price === sortedPrice[sortedPrice.length - 1 ].price ) {
            price = sortedPrice[0].price;
        } else {
            price = `${sortedPrice[0].price}~${sortedPrice[sortedPrice.length - 1 ].price}`;
        }
        
        // 处理货存
        const sortedStock = x.standards.filter(i => i.stock !== undefined && i.stock !== null).sort((x, y) => x.stock - y.stock);
        // 有库存型号
        if ( sortedStock.length === 1 ) {
            stock = `${sortedStock[0].stock}`;
        } else if ( sortedStock.length > 1 ) {
          if ( sortedStock[0].stock === sortedStock[sortedStock.length - 1].stock ) {
              stock = `${sortedStock[0].stock}`;
          } else {
              stock = `${sortedStock[0].stock}~${sortedStock[sortedStock.length - 1].stock}`;
          }
        }    
        
        // 拿到型号列表的最低价格，含团购价
        let priceList: number[] = [ ];
        x.standards.map( s => {
            if ( !s.groupPrice ) {
                priceList.push( s.price )
            } else {
                priceList.push( s.groupPrice < s.price ?
                    s.groupPrice :
                    s.price
                )
            }
        });
        priceList = priceList.sort(( x, y ) => x - y );
        lowest_price = priceList[ 0 ];
        
    }

    // 处理差价
    if ( x.standards.length === 0 ) {
        // 有团购的
        if ( x.groupPrice !== null && x.groupPrice !== undefined ) {
             priceGap = x.price - x.groupPrice;
        } else {
            priceGap = 0;
        }
    // 有型号
    } else {
        const groupPrice = x.standards.filter( x => x.groupPrice !== null && x.groupPrice !== undefined );
        // 型号里面有团购的
        if ( groupPrice.length > 0 ) {
            const sortedGroupPrice = groupPrice.sort(( x, y ) => (( x.groupPrice - x.price ) - ( y.groupPrice - y.price )));
            if (( sortedGroupPrice[0].groupPrice - sortedGroupPrice[0].price ) ===
                ( sortedGroupPrice[ sortedGroupPrice.length - 1 ].groupPrice - sortedGroupPrice[ sortedGroupPrice.length - 1 ].price )) {
                priceGap = ( sortedGroupPrice[0].price - sortedGroupPrice[0].groupPrice );
            } else {
                priceGap = `${sortedGroupPrice[ sortedGroupPrice.length - 1 ].price - sortedGroupPrice[ sortedGroupPrice.length - 1 ].groupPrice}~${sortedGroupPrice[0].price - sortedGroupPrice[0].groupPrice}`;
            }
        } else {
            priceGap = 0;
        }
    }

    return Object.assign({ }, x, {
        pid: x._id,
        // 库存区间
        stock$: stock,
        // 价格区间
        price$: price,
        // 差价
        priceGap,
        // 最低价格（含团购价）
        lowest_price$: lowest_price
    })

};

export {
    delayeringGood
}