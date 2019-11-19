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
        example2: '【名称】；关闭行程成功，一键收款功能已开启',
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
        textKeys: ['thing9', 'thing7'],
        desc: '开奖结果通知：开奖结果、开奖内容',
        id: 'rau9z8QU48gWel5Jn8hLt6-ChVWi8puo8E_QXR1CgMc'
    },
    waitPin: {
        textKeys: ['thing11', 'thing6'],
        desc: '活动开始提醒：温馨提示、活动内容',
        id: 'u91Cqoo76phn_0o5N_Jdqz62rry4UdyIR6SyjRsZy0w'
    },
    buy: {
        textKeys: ['phrase2', 'thing5'],
        desc: '订单状态通知： 订单状态、备注',
        id: 'hAU2bG9eeGDr0KeOIcM_StBIMa5tJj8D2P8vibDavLQ'
    },
    getMoney: {
        textKeys: ['thing3', 'date2'],
        desc: '尾款支付提醒：温馨提示、时间期限',
        id: 'is_8EPAO0WvaKoG7eDdLcLF7PXYZJYGa04BpOIuegpo'
    },
    newOrder: {
        textKeys: ['phrase2', 'thing4'],
        desc: '新订单提醒: 订单状态、购买商品',
        id: 'Onl9TTI33fTvg5K7AHydhNgMP1HmTJ22osUMzVBmSBQ'
    },
    trip: {
        textKeys: ['thing11', 'thing6'],
        desc: '活动开始提醒：温馨提示、活动内容',
        id: 'u91Cqoo76phn_0o5N_Jdqz62rry4UdyIR6SyjRsZy0w'
    },
    hongbao: {
        textKeys: ['thing9', 'thing7'],
        desc: '开奖结果通知：开奖结果、开奖内容',
        id: 'rau9z8QU48gWel5Jn8hLt6-ChVWi8puo8E_QXR1CgMc'
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
    'push-timer'
];
exports.auth = {
    salt: 'hzpisbest'
};
exports.dic = dic_1.default;
exports.appConfs = app_config_1.default;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29uZmlnLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiY29uZmlnLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsNkJBQTRCO0FBQzVCLDJDQUFtQztBQUd0QixRQUFBLEdBQUcsR0FBRztJQUNmLEVBQUUsRUFBRSxvQkFBb0I7SUFDeEIsT0FBTyxFQUFFLGtDQUFrQztDQUM5QyxDQUFBO0FBR1ksUUFBQSxxQkFBcUIsR0FBRztJQUNqQyxTQUFTLEVBQUUsNkNBQTZDO0NBQzNELENBQUE7QUFHWSxRQUFBLGFBQWEsR0FBRztJQUN6QixNQUFNLEVBQUU7UUFDSixJQUFJLEVBQUUsa0JBQWtCO1FBQ3hCLE9BQU8sRUFBRSxtQ0FBbUM7UUFDNUMsUUFBUSxFQUFFLDZDQUE2QztRQUN2RCxLQUFLLEVBQUUsNkNBQTZDO0tBQ3ZEO0lBQ0QsT0FBTyxFQUFFO1FBQ0wsSUFBSSxFQUFFLGtCQUFrQjtRQUN4QixPQUFPLEVBQUUsOEJBQThCO1FBQ3ZDLEtBQUssRUFBRSw2Q0FBNkM7S0FDdkQ7SUFDRCxHQUFHLEVBQUU7UUFDRCxJQUFJLEVBQUUsY0FBYztRQUNwQixPQUFPLEVBQUUsd0JBQXdCO1FBQ2pDLEtBQUssRUFBRSw2Q0FBNkM7S0FDdkQ7SUFDRCxRQUFRLEVBQUU7UUFDTixJQUFJLEVBQUUsa0JBQWtCO1FBQ3hCLE9BQU8sRUFBRSxpQkFBaUI7UUFDMUIsS0FBSyxFQUFFLDZDQUE2QztLQUN2RDtJQUNELFFBQVEsRUFBRTtRQUNOLElBQUksRUFBRSxpQkFBaUI7UUFDdkIsT0FBTyxFQUFFLGNBQWM7UUFDdkIsS0FBSyxFQUFFLDZDQUE2QztLQUN2RDtJQUNELElBQUksRUFBRTtRQUNGLElBQUksRUFBRSxnQkFBZ0I7UUFDdEIsS0FBSyxFQUFFLDZDQUE2QztRQUNwRCxPQUFPLEVBQUUsb0JBQW9CO1FBQzdCLFFBQVEsRUFBRSx1QkFBdUI7UUFDakMsUUFBUSxFQUFFLHFCQUFxQjtLQUNsQztJQUNELE9BQU8sRUFBRTtRQUNMLElBQUksRUFBRSxrQkFBa0I7UUFDeEIsS0FBSyxFQUFFLDZDQUE2QztRQUNwRCxPQUFPLEVBQUUsNkJBQTZCO1FBQ3RDLFFBQVEsRUFBRSxnQ0FBZ0M7S0FDN0M7Q0FDSixDQUFDO0FBR1csUUFBQSxtQkFBbUIsR0FBRztJQUMvQixNQUFNLEVBQUU7UUFDSixRQUFRLEVBQUUsQ0FBQyxRQUFRLEVBQUUsUUFBUSxDQUFDO1FBQzlCLElBQUksRUFBRSxrQkFBa0I7UUFDeEIsRUFBRSxFQUFFLDZDQUE2QztLQUNwRDtJQUNELE9BQU8sRUFBRTtRQUNMLFFBQVEsRUFBRSxDQUFDLFNBQVMsRUFBRSxRQUFRLENBQUM7UUFDL0IsSUFBSSxFQUFFLGtCQUFrQjtRQUN4QixFQUFFLEVBQUUsNkNBQTZDO0tBQ3BEO0lBQ0QsR0FBRyxFQUFFO1FBQ0QsUUFBUSxFQUFFLENBQUMsU0FBUyxFQUFFLFFBQVEsQ0FBQztRQUMvQixJQUFJLEVBQUUsaUJBQWlCO1FBQ3ZCLEVBQUUsRUFBRSw2Q0FBNkM7S0FDcEQ7SUFDRCxRQUFRLEVBQUU7UUFDTixRQUFRLEVBQUUsQ0FBQyxRQUFRLEVBQUUsT0FBTyxDQUFDO1FBQzdCLElBQUksRUFBRSxrQkFBa0I7UUFDeEIsRUFBRSxFQUFFLDZDQUE2QztLQUNwRDtJQUNELFFBQVEsRUFBRTtRQUNOLFFBQVEsRUFBRSxDQUFDLFNBQVMsRUFBRSxRQUFRLENBQUM7UUFDL0IsSUFBSSxFQUFFLGtCQUFrQjtRQUN4QixFQUFFLEVBQUUsNkNBQTZDO0tBQ3BEO0lBQ0QsSUFBSSxFQUFFO1FBQ0YsUUFBUSxFQUFFLENBQUMsU0FBUyxFQUFFLFFBQVEsQ0FBQztRQUMvQixJQUFJLEVBQUUsa0JBQWtCO1FBQ3hCLEVBQUUsRUFBRSw2Q0FBNkM7S0FDcEQ7SUFDRCxPQUFPLEVBQUU7UUFDTCxRQUFRLEVBQUUsQ0FBQyxRQUFRLEVBQUUsUUFBUSxDQUFDO1FBQzlCLElBQUksRUFBRSxrQkFBa0I7UUFDeEIsRUFBRSxFQUFFLDZDQUE2QztLQUNwRDtDQUNKLENBQUM7QUFHVyxRQUFBLEtBQUssR0FBRztJQUNqQixNQUFNLEVBQUUsWUFBWTtJQUNwQixHQUFHLEVBQUUsa0NBQWtDO0lBQ3ZDLElBQUksRUFBRSxNQUFNO0lBQ1osTUFBTSxFQUFFLFVBQVU7SUFDbEIsVUFBVSxFQUFFLDZCQUE2QjtJQUN6QyxnQkFBZ0IsRUFBRSxlQUFlO0NBQ3BDLENBQUE7QUFHWSxRQUFBLFdBQVcsR0FBRztJQUN2QixVQUFVO0lBQ1YsU0FBUztJQUNULGFBQWE7SUFDYixZQUFZO0lBQ1osaUJBQWlCO0lBQ2pCLE1BQU07SUFDTixLQUFLO0lBQ0wsTUFBTTtJQUNOLGlCQUFpQjtJQUNqQixPQUFPO0lBQ1AsUUFBUTtJQUNSLE9BQU87SUFDUCxlQUFlO0lBQ2YsTUFBTTtJQUNOLFdBQVc7SUFDWCxTQUFTO0lBQ1QsU0FBUztJQUNULGdCQUFnQjtJQUNoQixVQUFVO0lBQ1YsY0FBYztJQUNkLGNBQWM7SUFDZCxxQkFBcUI7SUFDckIsWUFBWTtDQUNmLENBQUM7QUFHVyxRQUFBLElBQUksR0FBRztJQUNoQixJQUFJLEVBQUUsV0FBVztDQUNwQixDQUFBO0FBR1ksUUFBQSxHQUFHLEdBQUcsYUFBTyxDQUFDO0FBR2QsUUFBQSxRQUFRLEdBQUcsb0JBQU8sQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBkaWNDb25mIGZyb20gJy4vZGljJztcbmltcG9ydCBhcHBDb25mIGZyb20gJy4vYXBwLWNvbmZpZyc7XG5cbi8qKiBhcHAgKi9cbmV4cG9ydCBjb25zdCBhcHAgPSB7XG4gICAgaWQ6ICd3eDYwYmY3Zjc0NWNlMzFlZjAnLFxuICAgIHNlY3JlY3Q6ICc2YzhmZjMxNDg5Y2NlN2RkNGVkZjBiMTg0M2I3YjBmNSdcbn1cblxuLyoqIOaOqOmAgeaooeeJiCAqL1xuZXhwb3J0IGNvbnN0IG5vdGlmaWNhdGlvbl90ZW1wbGF0ZSA9IHtcbiAgICBnZXRNb25leTM6ICdmQ3ZDclk4XzVsNjBzdlBnbE12UWRPMXN1bEFaUVVUY090M2hkdHJESXN3Jy8vIOS4muWKoeWPl+eQhumAmuefpVxufVxuXG4vKiog5o6o6YCB5qih5p2/5pyN5YqhICovXG5leHBvcnQgY29uc3QgcHVzaF90ZW1wbGF0ZSA9IHtcbiAgICBidXlQaW46IHtcbiAgICAgICAgZGVzYzogJ+aLvOWbouaIkOWKn+mAmuefpe+8muaLvOWboueKtuaAgeOAgeaIkOWbouadoeS7ticsXG4gICAgICAgIGV4YW1wbGU6ICfmi7zlm6LmiJDlip/vvIHmga3llpzmgqjnnIHkuoZ4eOWFg++8gTvmgqjlkozlhbbku5bkurrkubDkuoblkIzmrL7mi7zlm6LllYblk4HvvIzngrnlh7vmn6XnnIsnLFxuICAgICAgICBleGFtcGxlMjogJ+aBreWWnOaLvOWbouaIkOWKn++8geaCqOi0reS5sOeahOWVhuWTgeWPr+WHjyR7ZGVsdGF95YWDIeacieS6uuS4juS9oOS5sOS6huWQjOasvuaLvOWboueahOWVhuWTge+8jOeCueWHu+afpeeciycsXG4gICAgICAgIHZhbHVlOiAnYU9OS3R4cXVtMUpuMTVqS1ZPVkdxTnpDU2ZBMGZfbjZqXzBCTEFTWUNEZydcbiAgICB9LFxuICAgIHdhaXRQaW46IHtcbiAgICAgICAgZGVzYzogJ+aLvOWbouW+heaIkOWbouaPkOmGku+8mlx05aSH5rOo44CB5rip6aao5o+Q56S6JyxcbiAgICAgICAgZXhhbXBsZTogJ+aCqOi0reS5sOeahOWVhuWTgeWPr+WPguWKoOaLvOWbou+8ge+8m+eri+WNs+WPguWKoOaLvOWbou+8jOWPr+S7peWGjeecgXh45YWD77yBJyxcbiAgICAgICAgdmFsdWU6ICdtdFRMSXAyQy1GUTg3eW40NmpwWTNjSDlpbEdJekw0MzROMlFsVVMwTUgwJ1xuICAgIH0sXG4gICAgYnV5OiB7XG4gICAgICAgIGRlc2M6ICfotK3kubDmiJDlip/pgJrnn6XvvJrlpIfms6jjgIHml7bpl7QnLFxuICAgICAgICBleGFtcGxlOiAn5LiL5Y2V5oiQ5Yqf77yB5Lya5bC95b+r6YeH6LSt772e77ybeOaciHjml6UgMTU6MDAnLFxuICAgICAgICB2YWx1ZTogJ2ZXajZ5YV9KbjhMTmI3VzJEdTM1WmNzV3dCdmVBeTJwamd6eDh4Q2hqaGsnXG4gICAgfSxcbiAgICBnZXRNb25leToge1xuICAgICAgICBkZXNjOiAn5bC+5qy+5pSv5LuY5o+Q6YaS77ya5rip6aao5o+Q56S644CB5oiq5q2i5pe26Ze0JyxcbiAgICAgICAgZXhhbXBsZTogJ+aUr+S7mOWwvuasvu+8jOeri+WNs+WPkei0p+WTpu+8m+i2iuW/q+i2iuWlvScsXG4gICAgICAgIHZhbHVlOiAncUt3RjhjYVlRQURKNmxUY25FVGV4eTBocWkxMVNxMWRoa3NOT0hCcU9kUSdcbiAgICB9LCBcbiAgICBuZXdPcmRlcjoge1xuICAgICAgICBkZXNjOiAn5paw6K6i5Y2V6YCa55+l77ya6K6i5Y2V6K+m5oOF44CB6K6i5Y2V54q25oCBJyxcbiAgICAgICAgZXhhbXBsZTogJ+S9oOaciXjmnaHmlrDorqLljZXvvJvngrnlh7vmn6XnnIsnLFxuICAgICAgICB2YWx1ZTogJ1RRbWxDbnRrRGMxYThDdW9FUDlnTkREQWhPSlZmNFFUUHBjZldMZjBzdlEnXG4gICAgfSxcbiAgICB0cmlwOiB7XG4gICAgICAgIGRlc2M6ICfooYznqIvmj5DphpLvvJrooYznqIvlkI3np7DjgIHooYznqIvlpIfms6gnLFxuICAgICAgICB2YWx1ZTogJ1hvWFk4WFdmNkVpeW1XN3RZRFBrSERENFZjZGgtQnFQMXljWGJQa28tWlUnLFxuICAgICAgICBleGFtcGxlOiAn44CQ5ZCN56ew44CR77yb5Y+R5biD5oiQ5Yqf77yM5bm25byA6YCa5paw6K6i5Y2V5o6o6YCBJyxcbiAgICAgICAgZXhhbXBsZTI6ICfjgJDlkI3np7DjgJHvvJvlhbPpl63ooYznqIvmiJDlip/vvIzkuIDplK7mlLbmrL7lip/og73lt7LlvIDlkK8nLFxuICAgICAgICBleGFtcGxlMzogJ+OAkOWQjeensOOAke+8m+OAkOaXtumXtOOAkeW8gOWni+mHh+i0re+8jOaLvOWboui2iuS8mOaDoCcsXG4gICAgfSxcbiAgICBob25nYmFvOiB7XG4gICAgICAgIGRlc2M6ICfpooblj5bmiJDlip/pgJrnn6XvvJrpooblj5bph5Hpop3jgIHpgILnlKjojIPlm7QnLFxuICAgICAgICB2YWx1ZTogJ0lfeVpqVXhUSmtsUEdEVnJCLWJ0dDgyRjV6Njg3XzJjcFR4MU1pZV90OUEnLFxuICAgICAgICBleGFtcGxlOiAn5oGt5Zac6I635b6X57qi5YyF44CQ6YeR6aKd44CR5YWD77yb6LaB5pep5LiL5Y2V77yB5peg6Zeo5qeb56uL5YeP44CQ6YeR6aKd44CR5YWDJyxcbiAgICAgICAgZXhhbXBsZTQ6ICfmga3llpzvvIHojrflvpfjgJDph5Hpop3jgJHnjrDph5Hnp6/liIbvvJvmjqjlub/miJDlip/vvIHmnInkurrotK3kubDkuobkvaDliIbkuqvnmoTllYblk4EnXG4gICAgfVxufTtcblxuLyoqIOiuoumYheacjeWKoeexu+WeiyAqL1xuZXhwb3J0IGNvbnN0IHN1YnNjcmliZV90ZW1wbGF0ZXMgPSB7XG4gICAgYnV5UGluOiB7XG4gICAgICAgIHRleHRLZXlzOiBbJ3RoaW5nOScsICd0aGluZzcnXSxcbiAgICAgICAgZGVzYzogJ+W8gOWllue7k+aenOmAmuefpe+8muW8gOWllue7k+aenOOAgeW8gOWlluWGheWuuScsXG4gICAgICAgIGlkOiAncmF1OXo4UVU0OGdXZWw1Sm44aEx0Ni1DaFZXaThwdW84RV9RWFIxQ2dNYydcbiAgICB9LFxuICAgIHdhaXRQaW46IHtcbiAgICAgICAgdGV4dEtleXM6IFsndGhpbmcxMScsICd0aGluZzYnXSxcbiAgICAgICAgZGVzYzogJ+a0u+WKqOW8gOWni+aPkOmGku+8mua4qemmqOaPkOekuuOAgea0u+WKqOWGheWuuScsXG4gICAgICAgIGlkOiAndTkxQ3Fvbzc2cGhuXzBvNU5fSmRxejYycnJ5NFVkeUlSNlN5alJzWnkwdydcbiAgICB9LFxuICAgIGJ1eToge1xuICAgICAgICB0ZXh0S2V5czogWydwaHJhc2UyJywgJ3RoaW5nNSddLFxuICAgICAgICBkZXNjOiAn6K6i5Y2V54q25oCB6YCa55+l77yaIOiuouWNleeKtuaAgeOAgeWkh+azqCcsXG4gICAgICAgIGlkOiAnaEFVMmJHOWVlR0RyMEtlT0ljTV9TdEJJTWE1dEpqOEQyUDh2aWJEYXZMUSdcbiAgICB9LFxuICAgIGdldE1vbmV5OiB7XG4gICAgICAgIHRleHRLZXlzOiBbJ3RoaW5nMycsICdkYXRlMiddLFxuICAgICAgICBkZXNjOiAn5bC+5qy+5pSv5LuY5o+Q6YaS77ya5rip6aao5o+Q56S644CB5pe26Ze05pyf6ZmQJyxcbiAgICAgICAgaWQ6ICdpc184RVBBTzBXdmFLb0c3ZURkTGNMRjdQWFlaSllHYTA0QnBPSXVlZ3BvJ1xuICAgIH0sIFxuICAgIG5ld09yZGVyOiB7XG4gICAgICAgIHRleHRLZXlzOiBbJ3BocmFzZTInLCAndGhpbmc0J10sXG4gICAgICAgIGRlc2M6ICfmlrDorqLljZXmj5DphpI6IOiuouWNleeKtuaAgeOAgei0reS5sOWVhuWTgScsXG4gICAgICAgIGlkOiAnT25sOVRUSTMzZlR2ZzVLN0FIeWRoTmdNUDFIbVRKMjJvc1VNelZCbVNCUSdcbiAgICB9LFxuICAgIHRyaXA6IHtcbiAgICAgICAgdGV4dEtleXM6IFsndGhpbmcxMScsICd0aGluZzYnXSxcbiAgICAgICAgZGVzYzogJ+a0u+WKqOW8gOWni+aPkOmGku+8mua4qemmqOaPkOekuuOAgea0u+WKqOWGheWuuScsXG4gICAgICAgIGlkOiAndTkxQ3Fvbzc2cGhuXzBvNU5fSmRxejYycnJ5NFVkeUlSNlN5alJzWnkwdydcbiAgICB9LFxuICAgIGhvbmdiYW86IHtcbiAgICAgICAgdGV4dEtleXM6IFsndGhpbmc5JywgJ3RoaW5nNyddLFxuICAgICAgICBkZXNjOiAn5byA5aWW57uT5p6c6YCa55+l77ya5byA5aWW57uT5p6c44CB5byA5aWW5YaF5a65JyxcbiAgICAgICAgaWQ6ICdyYXU5ejhRVTQ4Z1dlbDVKbjhoTHQ2LUNoVldpOHB1bzhFX1FYUjFDZ01jJ1xuICAgIH1cbn07XG5cbi8qKiDlvq7kv6HmlK/ku5ggKi9cbmV4cG9ydCBjb25zdCB3eFBheSA9IHtcbiAgICBtY2hfaWQ6ICcxNTIxNTIyNzgxJywgLy8g5ZWG5oi35Y+3XG4gICAga2V5OiAnYTkyMDA2MjUwYjRjYTkyNDdjMDJlZGNlNjlmNmEyMWEnLCAvLyDov5nkuKrmmK/llYbmiLflj7forr7nva7nmoRrZXlcbiAgICBib2R5OiAn5b6u5L+h5pSv5LuYJywgLy8g566A5Y2V5o+P6L+wXG4gICAgYXR0YWNoOiAnYW55dGhpbmcnLCAvLyDpmYTliqDmlbDmja5cbiAgICBub3RpZnlfdXJsOiAnaHR0cHM6Ly93aGF0ZXZlci5jb20vbm90aWZ5JywgLy8g5Zue6LCDXG4gICAgc3BiaWxsX2NyZWF0ZV9pcDogJzExOC44OS40MC4yMDAnXG59XG5cbi8qKiDmlbDmja7lupMgKi9cbmV4cG9ydCBjb25zdCBjb2xsZWN0aW9ucyA9IFtcbiAgICAnYWN0aXZpdHknLFxuICAgICdhZGRyZXNzJyxcbiAgICAnZGVsaXZlci1mZWUnLFxuICAgICdhcHAtY29uZmlnJyxcbiAgICAnbGlrZS1jb2xsZWN0aW9uJyxcbiAgICAnY2FydCcsXG4gICAgJ2RpYycsXG4gICAgJ3VzZXInLFxuICAgICdtYW5hZ2VyLXd4LWluZm8nLFxuICAgICdvcmRlcicsXG4gICAgJ2NvdXBvbicsXG4gICAgJ2dvb2RzJyxcbiAgICAnc2hvcHBpbmctbGlzdCcsXG4gICAgJ3RyaXAnLFxuICAgICdzdGFuZGFyZHMnLFxuICAgICdkZWxpdmVyJyxcbiAgICAnYXV0aHBzdycsXG4gICAgJ21hbmFnZXItbWVtYmVyJyxcbiAgICAnZm9ybS1pZHMnLFxuICAgICdhbmFseXNlLWRhdGEnLFxuICAgICdzaGFyZS1yZWNvcmQnLFxuICAgICdpbnRlZ3JhbC11c2UtcmVjb3JkJyxcbiAgICAncHVzaC10aW1lcidcbl07XG5cbi8qKiDmnYPpmZDmqKHlnZcgKi9cbmV4cG9ydCBjb25zdCBhdXRoID0ge1xuICAgIHNhbHQ6ICdoenBpc2Jlc3QnXG59XG5cbi8qKiDmlbDmja7lrZflhbggKi9cbmV4cG9ydCBjb25zdCBkaWMgPSBkaWNDb25mO1xuXG4vKiog5bqU55So6YWN572uICovXG5leHBvcnQgY29uc3QgYXBwQ29uZnMgPSBhcHBDb25mOyJdfQ==