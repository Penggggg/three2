
/** 
 * 商品 ～ 转扁平化价格、库存、差价
 * ! 差价排序计算有问题，没有根据差价排序
 */
const delayeringGood = x => {
    
    // 设置型号、库存的价格
    let stock = x.stock;
    let price = x.price;
    let priceGap: any = 0;

    // 没有型号
    if ( x.standards.length === 0 ) {
        stock = x.stock;
        price = x.price;

    // 型号只有1种
    } else if ( x.standards.length === 1 ) {
        stock = x.standards[ 0 ].stock;
        price = x.standards[ 0 ].price;
    
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
    }

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
        stock$: stock,
        price$: price,
        priceGap: price
    })

};

export {
    delayeringGood
}