"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var dic_1 = require("./dic");
var app_config_1 = require("./app-config");
exports.app = {
    id: 'wx60bf7f745ce31ef0',
    secrect: '6c8ff31489cce7dd4edf0b1843b7b0f5'
};
exports.notification_template = {
    getMoney3: 'fCvCrY8_5l60svPglMvQdO1sulAZQUTcOt3hdtrDIsw'
};
exports.push_template = {
    buyPin: {
        desc: '拼团成功通知：拼团状态、成团条件',
        example: '拼团成功！恭喜您省了xx元！;您和其他人买了同款拼团商品，点击查看',
        example2: '恭喜拼团成功！您购买的商品可减${delta}元!有人与你买了同款拼团的商品，点击查看',
        value: 'aONKtxqum1Jn15jKVOVGqNzCSfA0f_n6j_0BLASYCDg'
    },
    waitPin: {
        desc: '拼团待成团提醒：	备注、温馨提示',
        example: '您购买的商品可参加拼团！；立即参加拼团，可以再省xx元！',
        example2: '昨晚有x人浏览它，有x人成功拼团。',
        value: 'mtTLIp2C-FQ87yn46jpY3cH9ilGIzL434N2QlUS0MH0'
    },
    buy: {
        desc: '购买成功通知：备注、时间',
        example: '下单成功！会尽快采购～；x月x日 15:00',
        value: 'fWj6ya_Jn8LNb7W2Du35ZcsWwBveAy2pjgzx8xChjhk'
    },
    getMoney: {
        desc: '尾款支付提醒：温馨提示、截止时间',
        example: '支付尾款，立即发货哦；越快越好',
        example2: '【名称】；关闭行程成功，一键收款功能已开启',
        value: 'qKwF8caYQADJ6lTcnETexy0hqi11Sq1dhksNOHBqOdQ'
    },
    newOrder: {
        desc: '新订单通知：订单详情、订单状态',
        example: '你有x条新订单；点击查看',
        value: 'TQmlCntkDc1a8CuoEP9gNDDAhOJVf4QTPpcfWLf0svQ'
    },
    trip: {
        desc: '行程提醒：行程名称、行程备注',
        value: 'XoXY8XWf6EiymW7tYDPkHDD4Vcdh-BqP1ycXbPko-ZU',
        example: '【名称】；发布成功，并开通新订单推送',
        example3: '【名称】；【时间】开始采购，拼团越优惠',
    },
    hongbao: {
        desc: '领取成功通知：领取金额、适用范围',
        value: 'I_yZjUxTJklPGDVrB-btt82F5z687_2cpTx1Mie_t9A',
        example: '恭喜获得红包【金额】元；趁早下单！无门槛立减【金额】元',
        example4: '恭喜！获得【金额】现金积分；推广成功！有人购买了你分享的商品'
    }
};
exports.subscribe_templates = {
    buyPin: {
        textKeys: ['thing4', 'thing1'],
        desc: '拼团成功通知	温馨提示、商品名称',
        id: 'yBBlVH0qvipvzSr93d-Own-cYkTnATjUBhd_Qi1L2vc'
    },
    hongbao: {
        textKeys: ['thing9', 'thing7'],
        desc: '开奖结果通知：开奖结果、开奖内容',
        id: 'rau9z8QU48gWel5Jn8hLt6-ChVWi8puo8E_QXR1CgMc'
    },
    waitPin: {
        textKeys: ['thing4', 'thing1'],
        desc: '拼团进度通知	温馨提示、商品名称',
        id: 'CC0DCPLC3SFVr1Im7ODEhRnlyMZVB8RIJSmptmLmC_U'
    },
    buy: {
        textKeys: ['thing7', 'thing5'],
        desc: '订单状态通知： 订单状态、备注',
        id: 'hAU2bG9eeGDr0KeOIcM_Sq0JbIlcA6Jfcex2HhX8OWI'
    },
    trip: {
        textKeys: ['thing11', 'thing6'],
        desc: '活动开始提醒：温馨提示、活动内容',
        id: 'u91Cqoo76phn_0o5N_Jdqz62rry4UdyIR6SyjRsZy0w'
    },
    getMoney: {
        textKeys: ['thing3', 'thing1'],
        desc: '尾款支付提醒	温馨提示、商品清单',
        id: 'is_8EPAO0WvaKoG7eDdLcBRZdGDowX2sgnmIAGGhOY0'
    },
    newOrder: {
        textKeys: ['thing8', 'thing4'],
        desc: '新订单提醒: 订单状态、购买商品',
        id: 'Onl9TTI33fTvg5K7AHydhHjk_NPmFLDGsMMxcDXE2rk'
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
    'good-visiting-record',
    'super-goods'
];
exports.auth = {
    salt: 'hzpisbest'
};
exports.dic = dic_1.default;
exports.appConfs = app_config_1.default;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29uZmlnLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiY29uZmlnLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsNkJBQTRCO0FBQzVCLDJDQUFtQztBQUd0QixRQUFBLEdBQUcsR0FBRztJQUNmLEVBQUUsRUFBRSxvQkFBb0I7SUFDeEIsT0FBTyxFQUFFLGtDQUFrQztDQUM5QyxDQUFBO0FBR1ksUUFBQSxxQkFBcUIsR0FBRztJQUNqQyxTQUFTLEVBQUUsNkNBQTZDO0NBQzNELENBQUE7QUFHWSxRQUFBLGFBQWEsR0FBRztJQUN6QixNQUFNLEVBQUU7UUFDSixJQUFJLEVBQUUsa0JBQWtCO1FBQ3hCLE9BQU8sRUFBRSxtQ0FBbUM7UUFDNUMsUUFBUSxFQUFFLDZDQUE2QztRQUN2RCxLQUFLLEVBQUUsNkNBQTZDO0tBQ3ZEO0lBQ0QsT0FBTyxFQUFFO1FBQ0wsSUFBSSxFQUFFLGtCQUFrQjtRQUN4QixPQUFPLEVBQUUsOEJBQThCO1FBQ3ZDLFFBQVEsRUFBRSxtQkFBbUI7UUFDN0IsS0FBSyxFQUFFLDZDQUE2QztLQUN2RDtJQUNELEdBQUcsRUFBRTtRQUNELElBQUksRUFBRSxjQUFjO1FBQ3BCLE9BQU8sRUFBRSx3QkFBd0I7UUFDakMsS0FBSyxFQUFFLDZDQUE2QztLQUN2RDtJQUNELFFBQVEsRUFBRTtRQUNOLElBQUksRUFBRSxrQkFBa0I7UUFDeEIsT0FBTyxFQUFFLGlCQUFpQjtRQUMxQixRQUFRLEVBQUUsdUJBQXVCO1FBQ2pDLEtBQUssRUFBRSw2Q0FBNkM7S0FDdkQ7SUFDRCxRQUFRLEVBQUU7UUFDTixJQUFJLEVBQUUsaUJBQWlCO1FBQ3ZCLE9BQU8sRUFBRSxjQUFjO1FBQ3ZCLEtBQUssRUFBRSw2Q0FBNkM7S0FDdkQ7SUFDRCxJQUFJLEVBQUU7UUFDRixJQUFJLEVBQUUsZ0JBQWdCO1FBQ3RCLEtBQUssRUFBRSw2Q0FBNkM7UUFDcEQsT0FBTyxFQUFFLG9CQUFvQjtRQUM3QixRQUFRLEVBQUUscUJBQXFCO0tBQ2xDO0lBQ0QsT0FBTyxFQUFFO1FBQ0wsSUFBSSxFQUFFLGtCQUFrQjtRQUN4QixLQUFLLEVBQUUsNkNBQTZDO1FBQ3BELE9BQU8sRUFBRSw2QkFBNkI7UUFDdEMsUUFBUSxFQUFFLGdDQUFnQztLQUM3QztDQUNKLENBQUM7QUFrQlcsUUFBQSxtQkFBbUIsR0FBRztJQUMvQixNQUFNLEVBQUU7UUFDSixRQUFRLEVBQUUsQ0FBQyxRQUFRLEVBQUUsUUFBUSxDQUFDO1FBQzlCLElBQUksRUFBRSxrQkFBa0I7UUFDeEIsRUFBRSxFQUFFLDZDQUE2QztLQUNwRDtJQUNELE9BQU8sRUFBRTtRQUNMLFFBQVEsRUFBRSxDQUFDLFFBQVEsRUFBRSxRQUFRLENBQUM7UUFDOUIsSUFBSSxFQUFFLGtCQUFrQjtRQUN4QixFQUFFLEVBQUUsNkNBQTZDO0tBQ3BEO0lBQ0QsT0FBTyxFQUFFO1FBQ0wsUUFBUSxFQUFFLENBQUMsUUFBUSxFQUFFLFFBQVEsQ0FBQztRQUM5QixJQUFJLEVBQUUsa0JBQWtCO1FBQ3hCLEVBQUUsRUFBRSw2Q0FBNkM7S0FDcEQ7SUFDRCxHQUFHLEVBQUU7UUFDRCxRQUFRLEVBQUUsQ0FBQyxRQUFRLEVBQUUsUUFBUSxDQUFDO1FBQzlCLElBQUksRUFBRSxpQkFBaUI7UUFDdkIsRUFBRSxFQUFFLDZDQUE2QztLQUNwRDtJQUNELElBQUksRUFBRTtRQUNGLFFBQVEsRUFBRSxDQUFDLFNBQVMsRUFBRSxRQUFRLENBQUM7UUFDL0IsSUFBSSxFQUFFLGtCQUFrQjtRQUN4QixFQUFFLEVBQUUsNkNBQTZDO0tBQ3BEO0lBQ0QsUUFBUSxFQUFFO1FBQ04sUUFBUSxFQUFFLENBQUMsUUFBUSxFQUFFLFFBQVEsQ0FBQztRQUM5QixJQUFJLEVBQUUsa0JBQWtCO1FBQ3hCLEVBQUUsRUFBRSw2Q0FBNkM7S0FDcEQ7SUFDRCxRQUFRLEVBQUU7UUFDTixRQUFRLEVBQUUsQ0FBQyxRQUFRLEVBQUUsUUFBUSxDQUFDO1FBQzlCLElBQUksRUFBRSxrQkFBa0I7UUFDeEIsRUFBRSxFQUFFLDZDQUE2QztLQUNwRDtDQUNKLENBQUM7QUFHVyxRQUFBLEtBQUssR0FBRztJQUNqQixNQUFNLEVBQUUsWUFBWTtJQUNwQixHQUFHLEVBQUUsa0NBQWtDO0lBQ3ZDLElBQUksRUFBRSxNQUFNO0lBQ1osTUFBTSxFQUFFLFVBQVU7SUFDbEIsVUFBVSxFQUFFLDZCQUE2QjtJQUN6QyxnQkFBZ0IsRUFBRSxlQUFlO0NBQ3BDLENBQUE7QUFHWSxRQUFBLFdBQVcsR0FBRztJQUN2QixVQUFVO0lBQ1YsU0FBUztJQUNULGFBQWE7SUFDYixZQUFZO0lBQ1osaUJBQWlCO0lBQ2pCLE1BQU07SUFDTixLQUFLO0lBQ0wsTUFBTTtJQUNOLGlCQUFpQjtJQUNqQixPQUFPO0lBQ1AsUUFBUTtJQUNSLE9BQU87SUFDUCxlQUFlO0lBQ2YsTUFBTTtJQUNOLFdBQVc7SUFDWCxTQUFTO0lBQ1QsU0FBUztJQUNULGdCQUFnQjtJQUNoQixVQUFVO0lBQ1YsY0FBYztJQUNkLGNBQWM7SUFDZCxxQkFBcUI7SUFDckIsWUFBWTtJQUNaLHNCQUFzQjtJQUN0QixhQUFhO0NBQ2hCLENBQUM7QUFHVyxRQUFBLElBQUksR0FBRztJQUNoQixJQUFJLEVBQUUsV0FBVztDQUNwQixDQUFBO0FBR1ksUUFBQSxHQUFHLEdBQUcsYUFBTyxDQUFDO0FBR2QsUUFBQSxRQUFRLEdBQUcsb0JBQU8sQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBkaWNDb25mIGZyb20gJy4vZGljJztcbmltcG9ydCBhcHBDb25mIGZyb20gJy4vYXBwLWNvbmZpZyc7XG5cbi8qKiBhcHAgKi9cbmV4cG9ydCBjb25zdCBhcHAgPSB7XG4gICAgaWQ6ICd3eDYwYmY3Zjc0NWNlMzFlZjAnLFxuICAgIHNlY3JlY3Q6ICc2YzhmZjMxNDg5Y2NlN2RkNGVkZjBiMTg0M2I3YjBmNSdcbn1cblxuLyoqIOaOqOmAgeaooeeJiCAqL1xuZXhwb3J0IGNvbnN0IG5vdGlmaWNhdGlvbl90ZW1wbGF0ZSA9IHtcbiAgICBnZXRNb25leTM6ICdmQ3ZDclk4XzVsNjBzdlBnbE12UWRPMXN1bEFaUVVUY090M2hkdHJESXN3Jy8vIOS4muWKoeWPl+eQhumAmuefpVxufVxuXG4vKiog5o6o6YCB5qih5p2/5pyN5YqhICovXG5leHBvcnQgY29uc3QgcHVzaF90ZW1wbGF0ZSA9IHtcbiAgICBidXlQaW46IHtcbiAgICAgICAgZGVzYzogJ+aLvOWbouaIkOWKn+mAmuefpe+8muaLvOWboueKtuaAgeOAgeaIkOWbouadoeS7ticsXG4gICAgICAgIGV4YW1wbGU6ICfmi7zlm6LmiJDlip/vvIHmga3llpzmgqjnnIHkuoZ4eOWFg++8gTvmgqjlkozlhbbku5bkurrkubDkuoblkIzmrL7mi7zlm6LllYblk4HvvIzngrnlh7vmn6XnnIsnLFxuICAgICAgICBleGFtcGxlMjogJ+aBreWWnOaLvOWbouaIkOWKn++8geaCqOi0reS5sOeahOWVhuWTgeWPr+WHjyR7ZGVsdGF95YWDIeacieS6uuS4juS9oOS5sOS6huWQjOasvuaLvOWboueahOWVhuWTge+8jOeCueWHu+afpeeciycsXG4gICAgICAgIHZhbHVlOiAnYU9OS3R4cXVtMUpuMTVqS1ZPVkdxTnpDU2ZBMGZfbjZqXzBCTEFTWUNEZydcbiAgICB9LFxuICAgIHdhaXRQaW46IHtcbiAgICAgICAgZGVzYzogJ+aLvOWbouW+heaIkOWbouaPkOmGku+8mlx05aSH5rOo44CB5rip6aao5o+Q56S6JyxcbiAgICAgICAgZXhhbXBsZTogJ+aCqOi0reS5sOeahOWVhuWTgeWPr+WPguWKoOaLvOWbou+8ge+8m+eri+WNs+WPguWKoOaLvOWbou+8jOWPr+S7peWGjeecgXh45YWD77yBJyxcbiAgICAgICAgZXhhbXBsZTI6ICfmmKjmmZrmnIl45Lq65rWP6KeI5a6D77yM5pyJeOS6uuaIkOWKn+aLvOWbouOAgicsXG4gICAgICAgIHZhbHVlOiAnbXRUTElwMkMtRlE4N3luNDZqcFkzY0g5aWxHSXpMNDM0TjJRbFVTME1IMCdcbiAgICB9LFxuICAgIGJ1eToge1xuICAgICAgICBkZXNjOiAn6LSt5Lmw5oiQ5Yqf6YCa55+l77ya5aSH5rOo44CB5pe26Ze0JyxcbiAgICAgICAgZXhhbXBsZTogJ+S4i+WNleaIkOWKn++8geS8muWwveW/q+mHh+i0re+9nu+8m3jmnIh45pelIDE1OjAwJyxcbiAgICAgICAgdmFsdWU6ICdmV2o2eWFfSm44TE5iN1cyRHUzNVpjc1d3QnZlQXkycGpneng4eENoamhrJ1xuICAgIH0sXG4gICAgZ2V0TW9uZXk6IHtcbiAgICAgICAgZGVzYzogJ+WwvuasvuaUr+S7mOaPkOmGku+8mua4qemmqOaPkOekuuOAgeaIquatouaXtumXtCcsXG4gICAgICAgIGV4YW1wbGU6ICfmlK/ku5jlsL7mrL7vvIznq4vljbPlj5HotKflk6bvvJvotorlv6votorlpb0nLFxuICAgICAgICBleGFtcGxlMjogJ+OAkOWQjeensOOAke+8m+WFs+mXreihjOeoi+aIkOWKn++8jOS4gOmUruaUtuasvuWKn+iDveW3suW8gOWQrycsXG4gICAgICAgIHZhbHVlOiAncUt3RjhjYVlRQURKNmxUY25FVGV4eTBocWkxMVNxMWRoa3NOT0hCcU9kUSdcbiAgICB9LCBcbiAgICBuZXdPcmRlcjoge1xuICAgICAgICBkZXNjOiAn5paw6K6i5Y2V6YCa55+l77ya6K6i5Y2V6K+m5oOF44CB6K6i5Y2V54q25oCBJyxcbiAgICAgICAgZXhhbXBsZTogJ+S9oOaciXjmnaHmlrDorqLljZXvvJvngrnlh7vmn6XnnIsnLFxuICAgICAgICB2YWx1ZTogJ1RRbWxDbnRrRGMxYThDdW9FUDlnTkREQWhPSlZmNFFUUHBjZldMZjBzdlEnXG4gICAgfSxcbiAgICB0cmlwOiB7XG4gICAgICAgIGRlc2M6ICfooYznqIvmj5DphpLvvJrooYznqIvlkI3np7DjgIHooYznqIvlpIfms6gnLFxuICAgICAgICB2YWx1ZTogJ1hvWFk4WFdmNkVpeW1XN3RZRFBrSERENFZjZGgtQnFQMXljWGJQa28tWlUnLFxuICAgICAgICBleGFtcGxlOiAn44CQ5ZCN56ew44CR77yb5Y+R5biD5oiQ5Yqf77yM5bm25byA6YCa5paw6K6i5Y2V5o6o6YCBJyxcbiAgICAgICAgZXhhbXBsZTM6ICfjgJDlkI3np7DjgJHvvJvjgJDml7bpl7TjgJHlvIDlp4vph4fotK3vvIzmi7zlm6LotorkvJjmg6AnLFxuICAgIH0sXG4gICAgaG9uZ2Jhbzoge1xuICAgICAgICBkZXNjOiAn6aKG5Y+W5oiQ5Yqf6YCa55+l77ya6aKG5Y+W6YeR6aKd44CB6YCC55So6IyD5Zu0JyxcbiAgICAgICAgdmFsdWU6ICdJX3laalV4VEprbFBHRFZyQi1idHQ4MkY1ejY4N18yY3BUeDFNaWVfdDlBJyxcbiAgICAgICAgZXhhbXBsZTogJ+aBreWWnOiOt+W+l+e6ouWMheOAkOmHkemineOAkeWFg++8m+i2geaXqeS4i+WNle+8geaXoOmXqOanm+eri+WHj+OAkOmHkemineOAkeWFgycsXG4gICAgICAgIGV4YW1wbGU0OiAn5oGt5Zac77yB6I635b6X44CQ6YeR6aKd44CR546w6YeR56ev5YiG77yb5o6o5bm/5oiQ5Yqf77yB5pyJ5Lq66LSt5Lmw5LqG5L2g5YiG5Lqr55qE5ZWG5ZOBJ1xuICAgIH1cbn07XG5cbi8qKiBcbiAqIOiuoumYheacjeWKoeexu+WeiyBcbiAqIFxuICogeyB0aGluZyB9IDIw5Liq5Lul5YaF5a2X56ymICAg5Y+v5rGJ5a2X44CB5pWw5a2X44CB5a2X5q+N5oiW56ym5Y+357uE5ZCIXG4gKiB7IG51bWJlciB9IDMy5L2N5Lul5YaF5pWw5a2XXHTlj6rog73mlbDlrZfvvIzlj6/luKblsI/mlbBcbiAqIHsgbGV0dGVyIH0gMzLkvY3ku6XlhoXlrZfmr41cdOWPquiDveWtl+avjVxuICogeyBzeW1ib2wgfSA15L2N5Lul5YaF56ym5Y+3XHTlj6rog73nrKblj7dcbiAqIHsgY2hhcmFjdGVyX3N0cmluZyB9IDMy5L2N5Lul5YaF5pWw5a2X44CB5a2X5q+N5oiW56ym5Y+3XHTlj6/mlbDlrZfjgIHlrZfmr43miJbnrKblj7fnu4TlkIhcbiAqIHsgdGltZSB9IDI05bCP5pe25Yi25pe26Ze05qC85byP77yI5pSv5oyBK+W5tOaciOaXpe+8iVx05L6L5aaC77yaMTU6MDHvvIzmiJbvvJoyMDE55bm0MTDmnIgx5pelIDE1OjAxXG4gKiB7IGRhdGUgfSDlubTmnIjml6XmoLzlvI/vvIjmlK/mjIErMjTlsI/ml7bliLbml7bpl7TvvIlcdOS+i+Wmgu+8mjIwMTnlubQxMOaciDHml6XvvIzmiJbvvJoyMDE55bm0MTDmnIgx5pelIDE1OjAxXG4gKiB7IGFtb3VudCB9IDHkuKrluIHnp43nrKblj7crMTDkvY3ku6XlhoXnuq/mlbDlrZfvvIzlj6/luKblsI/mlbDvvIznu5PlsL7lj6/luKbigJzlhYPigJ1cdOWPr+W4puWwj+aVsFxuICogeyBwaG9uZV9udW1iZXIgfSAxN+S9jeS7peWGhe+8jOaVsOWtl+OAgeespuWPt1x055S16K+d5Y+356CB77yM5L6L77yaKzg2LTA3NjYtNjY4ODg4NjZcbiAqIHsgY2FyX251bWJlciB9IDjkvY3ku6XlhoXvvIznrKzkuIDkvY3kuI7mnIDlkI7kuIDkvY3lj6/kuLrmsYnlrZfvvIzlhbbkvZnkuLrlrZfmr43miJbmlbDlrZdcdOi9pueJjOWPt+egge+8mueypEE4Wjg4OOaMglxuICogeyBuYW1lIH0gMTDkuKrku6XlhoXnuq/msYnlrZfmiJYyMOS4quS7peWGhee6r+Wtl+avjeaIluespuWPt1x05Lit5paH5ZCNMTDkuKrmsYnlrZflhoXvvJvnuq/oi7HmloflkI0yMOS4quWtl+avjeWGhe+8m+S4reaWh+WSjOWtl+avjea3t+WQiOaMieS4reaWh+WQjeeul++8jDEw5Liq5a2X5YaFXG4gKiB7IHBocmFzZSB9NeS4quS7peWGheaxieWtl1x0NeS4quS7peWGhee6r+axieWtl++8jOS+i+Wmgu+8mumFjemAgeS4rVxuICovXG5leHBvcnQgY29uc3Qgc3Vic2NyaWJlX3RlbXBsYXRlcyA9IHtcbiAgICBidXlQaW46IHtcbiAgICAgICAgdGV4dEtleXM6IFsndGhpbmc0JywgJ3RoaW5nMSddLFxuICAgICAgICBkZXNjOiAn5ou85Zui5oiQ5Yqf6YCa55+lXHTmuKnppqjmj5DnpLrjgIHllYblk4HlkI3np7AnLFxuICAgICAgICBpZDogJ3lCQmxWSDBxdmlwdnpTcjkzZC1Pd24tY1lrVG5BVGpVQmhkX1FpMUwydmMnXG4gICAgfSxcbiAgICBob25nYmFvOiB7XG4gICAgICAgIHRleHRLZXlzOiBbJ3RoaW5nOScsICd0aGluZzcnXSxcbiAgICAgICAgZGVzYzogJ+W8gOWllue7k+aenOmAmuefpe+8muW8gOWllue7k+aenOOAgeW8gOWlluWGheWuuScsXG4gICAgICAgIGlkOiAncmF1OXo4UVU0OGdXZWw1Sm44aEx0Ni1DaFZXaThwdW84RV9RWFIxQ2dNYydcbiAgICB9LFxuICAgIHdhaXRQaW46IHtcbiAgICAgICAgdGV4dEtleXM6IFsndGhpbmc0JywgJ3RoaW5nMSddLFxuICAgICAgICBkZXNjOiAn5ou85Zui6L+b5bqm6YCa55+lXHTmuKnppqjmj5DnpLrjgIHllYblk4HlkI3np7AnLFxuICAgICAgICBpZDogJ0NDMERDUExDM1NGVnIxSW03T0RFaFJubHlNWlZCOFJJSlNtcHRtTG1DX1UnXG4gICAgfSxcbiAgICBidXk6IHtcbiAgICAgICAgdGV4dEtleXM6IFsndGhpbmc3JywgJ3RoaW5nNSddLFxuICAgICAgICBkZXNjOiAn6K6i5Y2V54q25oCB6YCa55+l77yaIOiuouWNleeKtuaAgeOAgeWkh+azqCcsXG4gICAgICAgIGlkOiAnaEFVMmJHOWVlR0RyMEtlT0ljTV9TcTBKYklsY0E2SmZjZXgySGhYOE9XSSdcbiAgICB9LFxuICAgIHRyaXA6IHtcbiAgICAgICAgdGV4dEtleXM6IFsndGhpbmcxMScsICd0aGluZzYnXSxcbiAgICAgICAgZGVzYzogJ+a0u+WKqOW8gOWni+aPkOmGku+8mua4qemmqOaPkOekuuOAgea0u+WKqOWGheWuuScsXG4gICAgICAgIGlkOiAndTkxQ3Fvbzc2cGhuXzBvNU5fSmRxejYycnJ5NFVkeUlSNlN5alJzWnkwdydcbiAgICB9LFxuICAgIGdldE1vbmV5OiB7XG4gICAgICAgIHRleHRLZXlzOiBbJ3RoaW5nMycsICd0aGluZzEnXSxcbiAgICAgICAgZGVzYzogJ+WwvuasvuaUr+S7mOaPkOmGklx05rip6aao5o+Q56S644CB5ZWG5ZOB5riF5Y2VJyxcbiAgICAgICAgaWQ6ICdpc184RVBBTzBXdmFLb0c3ZURkTGNCUlpkR0Rvd1gyc2dubUlBR0doT1kwJ1xuICAgIH0sIFxuICAgIG5ld09yZGVyOiB7XG4gICAgICAgIHRleHRLZXlzOiBbJ3RoaW5nOCcsICd0aGluZzQnXSxcbiAgICAgICAgZGVzYzogJ+aWsOiuouWNleaPkOmGkjog6K6i5Y2V54q25oCB44CB6LSt5Lmw5ZWG5ZOBJyxcbiAgICAgICAgaWQ6ICdPbmw5VFRJMzNmVHZnNUs3QUh5ZGhIamtfTlBtRkxER3NNTXhjRFhFMnJrJ1xuICAgIH1cbn07XG5cbi8qKiDlvq7kv6HmlK/ku5ggKi9cbmV4cG9ydCBjb25zdCB3eFBheSA9IHtcbiAgICBtY2hfaWQ6ICcxNTIxNTIyNzgxJywgLy8g5ZWG5oi35Y+3XG4gICAga2V5OiAnYTkyMDA2MjUwYjRjYTkyNDdjMDJlZGNlNjlmNmEyMWEnLCAvLyDov5nkuKrmmK/llYbmiLflj7forr7nva7nmoRrZXlcbiAgICBib2R5OiAn5b6u5L+h5pSv5LuYJywgLy8g566A5Y2V5o+P6L+wXG4gICAgYXR0YWNoOiAnYW55dGhpbmcnLCAvLyDpmYTliqDmlbDmja5cbiAgICBub3RpZnlfdXJsOiAnaHR0cHM6Ly93aGF0ZXZlci5jb20vbm90aWZ5JywgLy8g5Zue6LCDXG4gICAgc3BiaWxsX2NyZWF0ZV9pcDogJzExOC44OS40MC4yMDAnXG59XG5cbi8qKiDmlbDmja7lupMgKi9cbmV4cG9ydCBjb25zdCBjb2xsZWN0aW9ucyA9IFtcbiAgICAnYWN0aXZpdHknLFxuICAgICdhZGRyZXNzJyxcbiAgICAnZGVsaXZlci1mZWUnLFxuICAgICdhcHAtY29uZmlnJyxcbiAgICAnbGlrZS1jb2xsZWN0aW9uJyxcbiAgICAnY2FydCcsXG4gICAgJ2RpYycsXG4gICAgJ3VzZXInLFxuICAgICdtYW5hZ2VyLXd4LWluZm8nLFxuICAgICdvcmRlcicsXG4gICAgJ2NvdXBvbicsXG4gICAgJ2dvb2RzJyxcbiAgICAnc2hvcHBpbmctbGlzdCcsXG4gICAgJ3RyaXAnLFxuICAgICdzdGFuZGFyZHMnLFxuICAgICdkZWxpdmVyJyxcbiAgICAnYXV0aHBzdycsXG4gICAgJ21hbmFnZXItbWVtYmVyJyxcbiAgICAnZm9ybS1pZHMnLFxuICAgICdhbmFseXNlLWRhdGEnLFxuICAgICdzaGFyZS1yZWNvcmQnLFxuICAgICdpbnRlZ3JhbC11c2UtcmVjb3JkJyxcbiAgICAncHVzaC10aW1lcicsXG4gICAgJ2dvb2QtdmlzaXRpbmctcmVjb3JkJyxcbiAgICAnc3VwZXItZ29vZHMnXG5dO1xuXG4vKiog5p2D6ZmQ5qih5Z2XICovXG5leHBvcnQgY29uc3QgYXV0aCA9IHtcbiAgICBzYWx0OiAnaHpwaXNiZXN0J1xufVxuXG4vKiog5pWw5o2u5a2X5YW4ICovXG5leHBvcnQgY29uc3QgZGljID0gZGljQ29uZjtcblxuLyoqIOW6lOeUqOmFjee9riAqL1xuZXhwb3J0IGNvbnN0IGFwcENvbmZzID0gYXBwQ29uZjsiXX0=