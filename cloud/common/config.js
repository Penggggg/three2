"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var dic_1 = require("./dic");
var app_config_1 = require("./app-config");
exports.app = {
    id: 'wx60bf7f745ce31ef0',
    secrect: '6c8ff31489cce7dd4edf0b1843b7b0f5'
};
exports.notification_template = {
    getMoney3: '7TDuFkSVtVULTwAebcxmsJCK3Ts3vGqDli0jGf6WXNI'
};
exports.push_template = {
    buyPin: {
        desc: '拼团成功通知：拼团状态、成团条件',
        example: '拼团成功！恭喜您省了xx元！;您和其他人买了同款拼团商品，点击查看',
        example2: '恭喜拼团成功！您购买的商品可减${delta}元!有人与你买了同款拼团的商品，点击查看',
        value: 'VdCtZLqbawiHC1EDY3k1XuVT30CM34M_lSkWNmONlIg'
    },
    waitPin: {
        desc: '拼团待成团提醒：	备注、温馨提示',
        example: '您购买的商品可参加拼团！；立即参加拼团，可以再省xx元！',
        value: 'GOT5PcxD3KDYrO1YnEXuGmNdzBrrMuOSLP6vUJBTmyI'
    },
    buy: {
        desc: '购买成功通知：备注、时间',
        example: '下单成功！会尽快采购～；x月x日 15:00',
        value: '7TDuFkSVtVULTwAebcxmsGud7deYYs3SeHrf_vWnlvY'
    },
    getMoney: {
        desc: '尾款支付提醒：温馨提示、截止时间',
        example: '支付尾款，立即发货哦；越快越好',
        value: 'mgmsCeFK1w1vRom3MwwICSs2csS7QiWVMXFMPtEQvSc'
    },
    newOrder: {
        desc: '新订单通知：订单详情、订单状态',
        example: '你有x条新订单；点击查看',
        value: 'aBjeOjBH8Zp9B60FwEbJKvwKZF_IJEBKQtWRMSaecrQ'
    },
    trip: {
        desc: '行程提醒：行程名称、行程备注',
        value: '39QNPuxJowajIyHvgCc7rgIW-uDIkYmSijWt8jJdbt0',
        example: '【名称】；发布成功，并开通新订单推送',
        example3: '【名称】；【时间】开始采购，拼团越优惠',
    },
    hongbao: {
        desc: '领取成功通知：领取金额、适用范围',
        value: 'OTNx2LsmMEmiKsbC-ud5WFMkLx5RiqClpYKyAvLe7QE',
        example: '恭喜获得红包【金额】元；趁早下单！无门槛立减【金额】元',
        example4: '恭喜！获得【金额】现金积分；推广成功！有人购买了你分享的商品'
    }
};
exports.subscribe_templates = {
    buyPin: {
        textKeys: ['thing4', 'thing1'],
        desc: '拼团成功通知	温馨提示、商品名称',
        id: '1dnxrEiIuypJ-EIzjCh0tcChobs4z2j2DC0xTJXcrrY'
    },
    hongbao: {
        textKeys: ['thing9', 'thing7'],
        desc: '开奖结果通知：开奖结果、开奖内容',
        id: 'CKyZDgBMwNGJ2D03Te61rd7yCTmUGh0r9FJ4T7l93uE'
    },
    waitPin: {
        textKeys: ['thing4', 'thing1'],
        desc: '拼团进度通知	温馨提示、商品名称',
        id: '93URVZtalBNld8_lBmqXq1juJ1QuBC3B9UOxt7krkJE'
    },
    buy: {
        textKeys: ['thing7', 'thing5'],
        desc: '订单状态通知： 订单状态、备注',
        id: 'Beuqu_Y-PZRV_pCWo_k-G0ObHrsuLzvbnCGMjVuIDsw'
    },
    trip: {
        textKeys: ['thing11', 'thing6'],
        desc: '活动开始提醒：温馨提示、活动内容',
        id: '1M6wamoJOrCEXra6xnit8KQWxxft7y0ULTASAEyLXYY'
    },
    getMoney: {
        textKeys: ['thing3', 'thing1'],
        desc: '尾款支付提醒	温馨提示、商品清单',
        id: '7o0xA_wJtDyZylhFgVQe4u0M2HdoSfjTjS7G5dbY1lw'
    },
    newOrder: {
        textKeys: ['thing8', 'thing4'],
        desc: '新订单提醒: 订单状态、购买商品',
        id: 'vOxV7Vn3i2Naggiu0bAe2eenEJ-vP9uqppKJFKuwnn4'
    }
};
exports.wxPay = {
    mch_id: '1521522781',
    key: 'a92006250b4ca9247c02edce69f6a21a',
    body: '微信支付',
    attach: 'anything',
    notify_url: 'https://whatever.com/notify',
    spbill_create_ip: '118.89.40.200'
};
exports.collections = [
    'activity',
    'address',
    'deliver-fee',
    'app-config',
    'like-collection',
    'cart',
    'dic',
    'user',
    'manager-wx-info',
    'order',
    'coupon',
    'goods',
    'shopping-list',
    'trip',
    'standards',
    'deliver',
    'authpsw',
    'manager-member',
    'form-ids',
    'analyse-data',
    'share-record',
    'integral-use-record',
    'push-timer',
    'good-visiting-record'
];
exports.auth = {
    salt: 'hzpisbest'
};
exports.dic = dic_1.default;
exports.appConfs = app_config_1.default;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29uZmlnLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiY29uZmlnLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsNkJBQTRCO0FBQzVCLDJDQUFtQztBQUd0QixRQUFBLEdBQUcsR0FBRztJQUNmLEVBQUUsRUFBRSxvQkFBb0I7SUFDeEIsT0FBTyxFQUFFLGtDQUFrQztDQUM5QyxDQUFBO0FBR1ksUUFBQSxxQkFBcUIsR0FBRztJQUNqQyxTQUFTLEVBQUUsNkNBQTZDO0NBQzNELENBQUE7QUFHWSxRQUFBLGFBQWEsR0FBRztJQUN6QixNQUFNLEVBQUU7UUFDSixJQUFJLEVBQUUsa0JBQWtCO1FBQ3hCLE9BQU8sRUFBRSxtQ0FBbUM7UUFDNUMsUUFBUSxFQUFFLDZDQUE2QztRQUN2RCxLQUFLLEVBQUUsNkNBQTZDO0tBQ3ZEO0lBQ0QsT0FBTyxFQUFFO1FBQ0wsSUFBSSxFQUFFLGtCQUFrQjtRQUN4QixPQUFPLEVBQUUsOEJBQThCO1FBQ3ZDLEtBQUssRUFBRSw2Q0FBNkM7S0FDdkQ7SUFDRCxHQUFHLEVBQUU7UUFDRCxJQUFJLEVBQUUsY0FBYztRQUNwQixPQUFPLEVBQUUsd0JBQXdCO1FBQ2pDLEtBQUssRUFBRSw2Q0FBNkM7S0FDdkQ7SUFDRCxRQUFRLEVBQUU7UUFDTixJQUFJLEVBQUUsa0JBQWtCO1FBQ3hCLE9BQU8sRUFBRSxpQkFBaUI7UUFDMUIsS0FBSyxFQUFFLDZDQUE2QztLQUN2RDtJQUNELFFBQVEsRUFBRTtRQUNOLElBQUksRUFBRSxpQkFBaUI7UUFDdkIsT0FBTyxFQUFFLGNBQWM7UUFDdkIsS0FBSyxFQUFFLDZDQUE2QztLQUN2RDtJQUNELElBQUksRUFBRTtRQUNGLElBQUksRUFBRSxnQkFBZ0I7UUFDdEIsS0FBSyxFQUFFLDZDQUE2QztRQUNwRCxPQUFPLEVBQUUsb0JBQW9CO1FBQzdCLFFBQVEsRUFBRSxxQkFBcUI7S0FDbEM7SUFDRCxPQUFPLEVBQUU7UUFDTCxJQUFJLEVBQUUsa0JBQWtCO1FBQ3hCLEtBQUssRUFBRSw2Q0FBNkM7UUFDcEQsT0FBTyxFQUFFLDZCQUE2QjtRQUN0QyxRQUFRLEVBQUUsZ0NBQWdDO0tBQzdDO0NBQ0osQ0FBQztBQWtCVyxRQUFBLG1CQUFtQixHQUFHO0lBQy9CLE1BQU0sRUFBRTtRQUNKLFFBQVEsRUFBRSxDQUFDLFFBQVEsRUFBRSxRQUFRLENBQUM7UUFDOUIsSUFBSSxFQUFFLGtCQUFrQjtRQUN4QixFQUFFLEVBQUUsNkNBQTZDO0tBQ3BEO0lBQ0QsT0FBTyxFQUFFO1FBQ0wsUUFBUSxFQUFFLENBQUMsUUFBUSxFQUFFLFFBQVEsQ0FBQztRQUM5QixJQUFJLEVBQUUsa0JBQWtCO1FBQ3hCLEVBQUUsRUFBRSw2Q0FBNkM7S0FDcEQ7SUFDRCxPQUFPLEVBQUU7UUFDTCxRQUFRLEVBQUUsQ0FBQyxRQUFRLEVBQUUsUUFBUSxDQUFDO1FBQzlCLElBQUksRUFBRSxrQkFBa0I7UUFDeEIsRUFBRSxFQUFFLDZDQUE2QztLQUNwRDtJQUNELEdBQUcsRUFBRTtRQUNELFFBQVEsRUFBRSxDQUFDLFFBQVEsRUFBRSxRQUFRLENBQUM7UUFDOUIsSUFBSSxFQUFFLGlCQUFpQjtRQUN2QixFQUFFLEVBQUUsNkNBQTZDO0tBQ3BEO0lBQ0QsSUFBSSxFQUFFO1FBQ0YsUUFBUSxFQUFFLENBQUMsU0FBUyxFQUFFLFFBQVEsQ0FBQztRQUMvQixJQUFJLEVBQUUsa0JBQWtCO1FBQ3hCLEVBQUUsRUFBRSw2Q0FBNkM7S0FDcEQ7SUFDRCxRQUFRLEVBQUU7UUFDTixRQUFRLEVBQUUsQ0FBQyxRQUFRLEVBQUUsUUFBUSxDQUFDO1FBQzlCLElBQUksRUFBRSxrQkFBa0I7UUFDeEIsRUFBRSxFQUFFLDZDQUE2QztLQUNwRDtJQUNELFFBQVEsRUFBRTtRQUNOLFFBQVEsRUFBRSxDQUFDLFFBQVEsRUFBRSxRQUFRLENBQUM7UUFDOUIsSUFBSSxFQUFFLGtCQUFrQjtRQUN4QixFQUFFLEVBQUUsNkNBQTZDO0tBQ3BEO0NBQ0osQ0FBQztBQUdXLFFBQUEsS0FBSyxHQUFHO0lBQ2pCLE1BQU0sRUFBRSxZQUFZO0lBQ3BCLEdBQUcsRUFBRSxrQ0FBa0M7SUFDdkMsSUFBSSxFQUFFLE1BQU07SUFDWixNQUFNLEVBQUUsVUFBVTtJQUNsQixVQUFVLEVBQUUsNkJBQTZCO0lBQ3pDLGdCQUFnQixFQUFFLGVBQWU7Q0FDcEMsQ0FBQTtBQUdZLFFBQUEsV0FBVyxHQUFHO0lBQ3ZCLFVBQVU7SUFDVixTQUFTO0lBQ1QsYUFBYTtJQUNiLFlBQVk7SUFDWixpQkFBaUI7SUFDakIsTUFBTTtJQUNOLEtBQUs7SUFDTCxNQUFNO0lBQ04saUJBQWlCO0lBQ2pCLE9BQU87SUFDUCxRQUFRO0lBQ1IsT0FBTztJQUNQLGVBQWU7SUFDZixNQUFNO0lBQ04sV0FBVztJQUNYLFNBQVM7SUFDVCxTQUFTO0lBQ1QsZ0JBQWdCO0lBQ2hCLFVBQVU7SUFDVixjQUFjO0lBQ2QsY0FBYztJQUNkLHFCQUFxQjtJQUNyQixZQUFZO0lBQ1osc0JBQXNCO0NBQ3pCLENBQUM7QUFHVyxRQUFBLElBQUksR0FBRztJQUNoQixJQUFJLEVBQUUsV0FBVztDQUNwQixDQUFBO0FBR1ksUUFBQSxHQUFHLEdBQUcsYUFBTyxDQUFDO0FBR2QsUUFBQSxRQUFRLEdBQUcsb0JBQU8sQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBkaWNDb25mIGZyb20gJy4vZGljJztcbmltcG9ydCBhcHBDb25mIGZyb20gJy4vYXBwLWNvbmZpZyc7XG5cbi8qKiBhcHAgKi9cbmV4cG9ydCBjb25zdCBhcHAgPSB7XG4gICAgaWQ6ICd3eDYwYmY3Zjc0NWNlMzFlZjAnLFxuICAgIHNlY3JlY3Q6ICc2YzhmZjMxNDg5Y2NlN2RkNGVkZjBiMTg0M2I3YjBmNSdcbn1cblxuLyoqIOaOqOmAgeaooeeJiCAqL1xuZXhwb3J0IGNvbnN0IG5vdGlmaWNhdGlvbl90ZW1wbGF0ZSA9IHtcbiAgICBnZXRNb25leTM6ICc3VER1RmtTVnRWVUxUd0FlYmN4bXNKQ0szVHMzdkdxRGxpMGpHZjZXWE5JJy8vIOi0reS5sOaIkOWKn+mAmuefpVxufVxuXG4vKiog5o6o6YCB5qih5p2/5pyN5YqhICovXG5leHBvcnQgY29uc3QgcHVzaF90ZW1wbGF0ZSA9IHtcbiAgICBidXlQaW46IHtcbiAgICAgICAgZGVzYzogJ+aLvOWbouaIkOWKn+mAmuefpe+8muaLvOWboueKtuaAgeOAgeaIkOWbouadoeS7ticsXG4gICAgICAgIGV4YW1wbGU6ICfmi7zlm6LmiJDlip/vvIHmga3llpzmgqjnnIHkuoZ4eOWFg++8gTvmgqjlkozlhbbku5bkurrkubDkuoblkIzmrL7mi7zlm6LllYblk4HvvIzngrnlh7vmn6XnnIsnLFxuICAgICAgICBleGFtcGxlMjogJ+aBreWWnOaLvOWbouaIkOWKn++8geaCqOi0reS5sOeahOWVhuWTgeWPr+WHjyR7ZGVsdGF95YWDIeacieS6uuS4juS9oOS5sOS6huWQjOasvuaLvOWboueahOWVhuWTge+8jOeCueWHu+afpeeciycsXG4gICAgICAgIHZhbHVlOiAnVmRDdFpMcWJhd2lIQzFFRFkzazFYdVZUMzBDTTM0TV9sU2tXTm1PTmxJZydcbiAgICB9LFxuICAgIHdhaXRQaW46IHtcbiAgICAgICAgZGVzYzogJ+aLvOWbouW+heaIkOWbouaPkOmGku+8mlx05aSH5rOo44CB5rip6aao5o+Q56S6JyxcbiAgICAgICAgZXhhbXBsZTogJ+aCqOi0reS5sOeahOWVhuWTgeWPr+WPguWKoOaLvOWbou+8ge+8m+eri+WNs+WPguWKoOaLvOWbou+8jOWPr+S7peWGjeecgXh45YWD77yBJyxcbiAgICAgICAgdmFsdWU6ICdHT1Q1UGN4RDNLRFlyTzFZbkVYdUdtTmR6QnJyTXVPU0xQNnZVSkJUbXlJJ1xuICAgIH0sXG4gICAgYnV5OiB7XG4gICAgICAgIGRlc2M6ICfotK3kubDmiJDlip/pgJrnn6XvvJrlpIfms6jjgIHml7bpl7QnLFxuICAgICAgICBleGFtcGxlOiAn5LiL5Y2V5oiQ5Yqf77yB5Lya5bC95b+r6YeH6LSt772e77ybeOaciHjml6UgMTU6MDAnLFxuICAgICAgICB2YWx1ZTogJzdURHVGa1NWdFZVTFR3QWViY3htc0d1ZDdkZVlZczNTZUhyZl92V25sdlknXG4gICAgfSxcbiAgICBnZXRNb25leToge1xuICAgICAgICBkZXNjOiAn5bC+5qy+5pSv5LuY5o+Q6YaS77ya5rip6aao5o+Q56S644CB5oiq5q2i5pe26Ze0JyxcbiAgICAgICAgZXhhbXBsZTogJ+aUr+S7mOWwvuasvu+8jOeri+WNs+WPkei0p+WTpu+8m+i2iuW/q+i2iuWlvScsXG4gICAgICAgIHZhbHVlOiAnbWdtc0NlRksxdzF2Um9tM013d0lDU3MyY3NTN1FpV1ZNWEZNUHRFUXZTYydcbiAgICB9LCBcbiAgICBuZXdPcmRlcjoge1xuICAgICAgICBkZXNjOiAn5paw6K6i5Y2V6YCa55+l77ya6K6i5Y2V6K+m5oOF44CB6K6i5Y2V54q25oCBJyxcbiAgICAgICAgZXhhbXBsZTogJ+S9oOaciXjmnaHmlrDorqLljZXvvJvngrnlh7vmn6XnnIsnLFxuICAgICAgICB2YWx1ZTogJ2FCamVPakJIOFpwOUI2MEZ3RWJKS3Z3S1pGX0lKRUJLUXRXUk1TYWVjclEnXG4gICAgfSxcbiAgICB0cmlwOiB7XG4gICAgICAgIGRlc2M6ICfooYznqIvmj5DphpLvvJrooYznqIvlkI3np7DjgIHooYznqIvlpIfms6gnLFxuICAgICAgICB2YWx1ZTogJzM5UU5QdXhKb3dhakl5SHZnQ2M3cmdJVy11RElrWW1TaWpXdDhqSmRidDAnLFxuICAgICAgICBleGFtcGxlOiAn44CQ5ZCN56ew44CR77yb5Y+R5biD5oiQ5Yqf77yM5bm25byA6YCa5paw6K6i5Y2V5o6o6YCBJyxcbiAgICAgICAgZXhhbXBsZTM6ICfjgJDlkI3np7DjgJHvvJvjgJDml7bpl7TjgJHlvIDlp4vph4fotK3vvIzmi7zlm6LotorkvJjmg6AnLFxuICAgIH0sXG4gICAgaG9uZ2Jhbzoge1xuICAgICAgICBkZXNjOiAn6aKG5Y+W5oiQ5Yqf6YCa55+l77ya6aKG5Y+W6YeR6aKd44CB6YCC55So6IyD5Zu0JyxcbiAgICAgICAgdmFsdWU6ICdPVE54MkxzbU1FbWlLc2JDLXVkNVdGTWtMeDVSaXFDbHBZS3lBdkxlN1FFJyxcbiAgICAgICAgZXhhbXBsZTogJ+aBreWWnOiOt+W+l+e6ouWMheOAkOmHkemineOAkeWFg++8m+i2geaXqeS4i+WNle+8geaXoOmXqOanm+eri+WHj+OAkOmHkemineOAkeWFgycsXG4gICAgICAgIGV4YW1wbGU0OiAn5oGt5Zac77yB6I635b6X44CQ6YeR6aKd44CR546w6YeR56ev5YiG77yb5o6o5bm/5oiQ5Yqf77yB5pyJ5Lq66LSt5Lmw5LqG5L2g5YiG5Lqr55qE5ZWG5ZOBJ1xuICAgIH1cbn07XG5cbi8qKiBcbiAqIOiuoumYheacjeWKoeexu+WeiyBcbiAqIFxuICogeyB0aGluZyB9IDIw5Liq5Lul5YaF5a2X56ymICAg5Y+v5rGJ5a2X44CB5pWw5a2X44CB5a2X5q+N5oiW56ym5Y+357uE5ZCIXG4gKiB7IG51bWJlciB9IDMy5L2N5Lul5YaF5pWw5a2XXHTlj6rog73mlbDlrZfvvIzlj6/luKblsI/mlbBcbiAqIHsgbGV0dGVyIH0gMzLkvY3ku6XlhoXlrZfmr41cdOWPquiDveWtl+avjVxuICogeyBzeW1ib2wgfSA15L2N5Lul5YaF56ym5Y+3XHTlj6rog73nrKblj7dcbiAqIHsgY2hhcmFjdGVyX3N0cmluZyB9IDMy5L2N5Lul5YaF5pWw5a2X44CB5a2X5q+N5oiW56ym5Y+3XHTlj6/mlbDlrZfjgIHlrZfmr43miJbnrKblj7fnu4TlkIhcbiAqIHsgdGltZSB9IDI05bCP5pe25Yi25pe26Ze05qC85byP77yI5pSv5oyBK+W5tOaciOaXpe+8iVx05L6L5aaC77yaMTU6MDHvvIzmiJbvvJoyMDE55bm0MTDmnIgx5pelIDE1OjAxXG4gKiB7IGRhdGUgfSDlubTmnIjml6XmoLzlvI/vvIjmlK/mjIErMjTlsI/ml7bliLbml7bpl7TvvIlcdOS+i+Wmgu+8mjIwMTnlubQxMOaciDHml6XvvIzmiJbvvJoyMDE55bm0MTDmnIgx5pelIDE1OjAxXG4gKiB7IGFtb3VudCB9IDHkuKrluIHnp43nrKblj7crMTDkvY3ku6XlhoXnuq/mlbDlrZfvvIzlj6/luKblsI/mlbDvvIznu5PlsL7lj6/luKbigJzlhYPigJ1cdOWPr+W4puWwj+aVsFxuICogeyBwaG9uZV9udW1iZXIgfSAxN+S9jeS7peWGhe+8jOaVsOWtl+OAgeespuWPt1x055S16K+d5Y+356CB77yM5L6L77yaKzg2LTA3NjYtNjY4ODg4NjZcbiAqIHsgY2FyX251bWJlciB9IDjkvY3ku6XlhoXvvIznrKzkuIDkvY3kuI7mnIDlkI7kuIDkvY3lj6/kuLrmsYnlrZfvvIzlhbbkvZnkuLrlrZfmr43miJbmlbDlrZdcdOi9pueJjOWPt+egge+8mueypEE4Wjg4OOaMglxuICogeyBuYW1lIH0gMTDkuKrku6XlhoXnuq/msYnlrZfmiJYyMOS4quS7peWGhee6r+Wtl+avjeaIluespuWPt1x05Lit5paH5ZCNMTDkuKrmsYnlrZflhoXvvJvnuq/oi7HmloflkI0yMOS4quWtl+avjeWGhe+8m+S4reaWh+WSjOWtl+avjea3t+WQiOaMieS4reaWh+WQjeeul++8jDEw5Liq5a2X5YaFXG4gKiB7IHBocmFzZSB9NeS4quS7peWGheaxieWtl1x0NeS4quS7peWGhee6r+axieWtl++8jOS+i+Wmgu+8mumFjemAgeS4rVxuICovXG5leHBvcnQgY29uc3Qgc3Vic2NyaWJlX3RlbXBsYXRlcyA9IHtcbiAgICBidXlQaW46IHtcbiAgICAgICAgdGV4dEtleXM6IFsndGhpbmc0JywgJ3RoaW5nMSddLFxuICAgICAgICBkZXNjOiAn5ou85Zui5oiQ5Yqf6YCa55+lXHTmuKnppqjmj5DnpLrjgIHllYblk4HlkI3np7AnLFxuICAgICAgICBpZDogJzFkbnhyRWlJdXlwSi1FSXpqQ2gwdGNDaG9iczR6MmoyREMweFRKWGNyclknXG4gICAgfSxcbiAgICBob25nYmFvOiB7XG4gICAgICAgIHRleHRLZXlzOiBbJ3RoaW5nOScsICd0aGluZzcnXSxcbiAgICAgICAgZGVzYzogJ+W8gOWllue7k+aenOmAmuefpe+8muW8gOWllue7k+aenOOAgeW8gOWlluWGheWuuScsXG4gICAgICAgIGlkOiAnQ0t5WkRnQk13TkdKMkQwM1RlNjFyZDd5Q1RtVUdoMHI5Rko0VDdsOTN1RSdcbiAgICB9LFxuICAgIHdhaXRQaW46IHtcbiAgICAgICAgdGV4dEtleXM6IFsndGhpbmc0JywgJ3RoaW5nMSddLFxuICAgICAgICBkZXNjOiAn5ou85Zui6L+b5bqm6YCa55+lXHTmuKnppqjmj5DnpLrjgIHllYblk4HlkI3np7AnLFxuICAgICAgICBpZDogJzkzVVJWWnRhbEJObGQ4X2xCbXFYcTFqdUoxUXVCQzNCOVVPeHQ3a3JrSkUnXG4gICAgfSxcbiAgICBidXk6IHtcbiAgICAgICAgdGV4dEtleXM6IFsndGhpbmc3JywgJ3RoaW5nNSddLFxuICAgICAgICBkZXNjOiAn6K6i5Y2V54q25oCB6YCa55+l77yaIOiuouWNleeKtuaAgeOAgeWkh+azqCcsXG4gICAgICAgIGlkOiAnQmV1cXVfWS1QWlJWX3BDV29fay1HME9iSHJzdUx6dmJuQ0dNalZ1SURzdydcbiAgICB9LFxuICAgIHRyaXA6IHtcbiAgICAgICAgdGV4dEtleXM6IFsndGhpbmcxMScsICd0aGluZzYnXSxcbiAgICAgICAgZGVzYzogJ+a0u+WKqOW8gOWni+aPkOmGku+8mua4qemmqOaPkOekuuOAgea0u+WKqOWGheWuuScsXG4gICAgICAgIGlkOiAnMU02d2Ftb0pPckNFWHJhNnhuaXQ4S1FXeHhmdDd5MFVMVEFTQUV5TFhZWSdcbiAgICB9LFxuICAgIGdldE1vbmV5OiB7XG4gICAgICAgIHRleHRLZXlzOiBbJ3RoaW5nMycsICd0aGluZzEnXSxcbiAgICAgICAgZGVzYzogJ+WwvuasvuaUr+S7mOaPkOmGklx05rip6aao5o+Q56S644CB5ZWG5ZOB5riF5Y2VJyxcbiAgICAgICAgaWQ6ICc3bzB4QV93SnREeVp5bGhGZ1ZRZTR1ME0ySGRvU2ZqVGpTN0c1ZGJZMWx3J1xuICAgIH0sIFxuICAgIG5ld09yZGVyOiB7XG4gICAgICAgIHRleHRLZXlzOiBbJ3RoaW5nOCcsICd0aGluZzQnXSxcbiAgICAgICAgZGVzYzogJ+aWsOiuouWNleaPkOmGkjog6K6i5Y2V54q25oCB44CB6LSt5Lmw5ZWG5ZOBJyxcbiAgICAgICAgaWQ6ICd2T3hWN1ZuM2kyTmFnZ2l1MGJBZTJlZW5FSi12UDl1cXBwS0pGS3V3bm40J1xuICAgIH1cbn07XG5cbi8qKiDlvq7kv6HmlK/ku5ggKi9cbmV4cG9ydCBjb25zdCB3eFBheSA9IHtcbiAgICBtY2hfaWQ6ICcxNTIxNTIyNzgxJywgLy8g5ZWG5oi35Y+3XG4gICAga2V5OiAnYTkyMDA2MjUwYjRjYTkyNDdjMDJlZGNlNjlmNmEyMWEnLCAvLyDov5nkuKrmmK/llYbmiLflj7forr7nva7nmoRrZXlcbiAgICBib2R5OiAn5b6u5L+h5pSv5LuYJywgLy8g566A5Y2V5o+P6L+wXG4gICAgYXR0YWNoOiAnYW55dGhpbmcnLCAvLyDpmYTliqDmlbDmja5cbiAgICBub3RpZnlfdXJsOiAnaHR0cHM6Ly93aGF0ZXZlci5jb20vbm90aWZ5JywgLy8g5Zue6LCDXG4gICAgc3BiaWxsX2NyZWF0ZV9pcDogJzExOC44OS40MC4yMDAnXG59XG5cbi8qKiDmlbDmja7lupMgKi9cbmV4cG9ydCBjb25zdCBjb2xsZWN0aW9ucyA9IFtcbiAgICAnYWN0aXZpdHknLFxuICAgICdhZGRyZXNzJyxcbiAgICAnZGVsaXZlci1mZWUnLFxuICAgICdhcHAtY29uZmlnJyxcbiAgICAnbGlrZS1jb2xsZWN0aW9uJyxcbiAgICAnY2FydCcsXG4gICAgJ2RpYycsXG4gICAgJ3VzZXInLFxuICAgICdtYW5hZ2VyLXd4LWluZm8nLFxuICAgICdvcmRlcicsXG4gICAgJ2NvdXBvbicsXG4gICAgJ2dvb2RzJyxcbiAgICAnc2hvcHBpbmctbGlzdCcsXG4gICAgJ3RyaXAnLFxuICAgICdzdGFuZGFyZHMnLFxuICAgICdkZWxpdmVyJyxcbiAgICAnYXV0aHBzdycsXG4gICAgJ21hbmFnZXItbWVtYmVyJyxcbiAgICAnZm9ybS1pZHMnLFxuICAgICdhbmFseXNlLWRhdGEnLFxuICAgICdzaGFyZS1yZWNvcmQnLFxuICAgICdpbnRlZ3JhbC11c2UtcmVjb3JkJyxcbiAgICAncHVzaC10aW1lcicsXG4gICAgJ2dvb2QtdmlzaXRpbmctcmVjb3JkJ1xuXTtcblxuLyoqIOadg+mZkOaooeWdlyAqL1xuZXhwb3J0IGNvbnN0IGF1dGggPSB7XG4gICAgc2FsdDogJ2h6cGlzYmVzdCdcbn1cblxuLyoqIOaVsOaNruWtl+WFuCAqL1xuZXhwb3J0IGNvbnN0IGRpYyA9IGRpY0NvbmY7XG5cbi8qKiDlupTnlKjphY3nva4gKi9cbmV4cG9ydCBjb25zdCBhcHBDb25mcyA9IGFwcENvbmY7Il19