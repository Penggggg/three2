import { http } from './http';

/**
 * 
 * @param tid 行程id
 * @param orders 预付订单列表
 * {
        sid,
        pid,
        count,
        price,
        img: [ img ],
        groupPrice,
        tid: trip._id,
        depositPrice: depositPrice || 0,
        type: 'pre', // 预付类型订单，
  *      !cid?: temp.cart._id,
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
export const createOrders = ( tid, orders ) => {

}