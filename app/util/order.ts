import { http } from './http';

/**
 * 
 * @param tid 行程id
 * @param from 订单来源 'buy' | 
 * @param targetBuys 预付订单列表，数据结构如下
 * {
        sid,
        pid,
        count,
        price,
        img: [ img ],
        groupPrice,
        tid: trip._id,
        depositPrice: depositPrice || 0,
 *!     acid: 一口价活动的id，可无
        type: 'pre', // 预付类型订单，
 *!     cid?: temp.cart._id,
        name: `${title}`,
        standername: standardName,
        address: {
            username: userName,
            postalcode: postalCode,
            phone: telNumber,
            address: `${provinceName}${cityName}${countyName}${detailInfo}`
        }
 * }[ ]
 */
export const createOrders = ( tid, targetBuys, from, successCB, errorCB ) => {
    http({
        data: {
            from,
            tid: tid,
            list: targetBuys
        },
        loadingMsg: '结算中...',
        url: `shopping-list_findCannotBuy`,
        success: res => {
            const { status, data } = res;
            if ( status !== 200 ) { return; }

            const { hasBeenBuy, cannotBuy, hasBeenDelete, lowStock, orders } = data;
      
            /** 提示行程无货 */
            if ( cannotBuy.length > 0 ) {
                return wx.showModal({
                    title: '提示',
                    content: `火爆！${cannotBuy.map( x => `${x.goodName || x.name}${x.standername !== '默认型号' ? '-' + x.standername : ''}`).join('、')}暂时无货！`
                });
            }

            /** 商品被删除 */
            if ( hasBeenDelete.length > 0 ) {
                return wx.showModal({
                    title: '提示',
                    content: `${hasBeenDelete.map( x => `${x.goodName || x.name}${x.standername !== '默认型号' ? '-' + x.standername : ''}`).join('、')}已被删除，请重新选择！`
                });
            }

            /** 提示低库存 */
            if ( lowStock.length > 0 ) {
                return wx.showModal({
                    title: '提示',
                    content: `${lowStock.map( x => `${x.goodName || x.name}${x.standername !== '默认型号' ? '-' + x.standername : ''}`).join('、')}货存不足，请重新选择！`
                });
            }

            /** 
             * 已经购买就进行提示
             * 但是依然可以继续购买
             */
            if ( hasBeenBuy.length > 0 ) {
                wx.showModal({
                    title: '提示',
                    content: `群主已经买了${hasBeenBuy.map( x => `${x.goodName}${x.standardName}`).join('、')}，不一定会返程购买，请联系群主！`
                });
            }
            
            if ( orders.length === 0 ) { return; }

            successCB && successCB( orders );

        },
        error: ( ) => {
            errorCB && errorCB( );
        }
    });
}