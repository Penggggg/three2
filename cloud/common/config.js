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
    'share-record'
];
exports.auth = {
    salt: 'hzpisbest'
};
exports.dic = dic_1.default;
exports.appConfs = app_config_1.default;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29uZmlnLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiY29uZmlnLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsNkJBQTRCO0FBQzVCLDJDQUFtQztBQUd0QixRQUFBLEdBQUcsR0FBRztJQUNmLEVBQUUsRUFBRSxvQkFBb0I7SUFDeEIsT0FBTyxFQUFFLGtDQUFrQztDQUM5QyxDQUFBO0FBR1ksUUFBQSxxQkFBcUIsR0FBRztJQUNqQyxTQUFTLEVBQUUsNkNBQTZDO0NBQzNELENBQUE7QUFHWSxRQUFBLGFBQWEsR0FBRztJQUN6QixNQUFNLEVBQUU7UUFDSixJQUFJLEVBQUUsa0JBQWtCO1FBQ3hCLE9BQU8sRUFBRSxtQ0FBbUM7UUFDNUMsUUFBUSxFQUFFLDZDQUE2QztRQUN2RCxLQUFLLEVBQUUsNkNBQTZDO0tBQ3ZEO0lBQ0QsT0FBTyxFQUFFO1FBQ0wsSUFBSSxFQUFFLGtCQUFrQjtRQUN4QixPQUFPLEVBQUUsOEJBQThCO1FBQ3ZDLEtBQUssRUFBRSw2Q0FBNkM7S0FDdkQ7SUFDRCxHQUFHLEVBQUU7UUFDRCxJQUFJLEVBQUUsY0FBYztRQUNwQixPQUFPLEVBQUUsd0JBQXdCO1FBQ2pDLEtBQUssRUFBRSw2Q0FBNkM7S0FDdkQ7SUFDRCxRQUFRLEVBQUU7UUFDTixJQUFJLEVBQUUsa0JBQWtCO1FBQ3hCLE9BQU8sRUFBRSxpQkFBaUI7UUFDMUIsS0FBSyxFQUFFLDZDQUE2QztLQUN2RDtJQUNELFFBQVEsRUFBRTtRQUNOLElBQUksRUFBRSxpQkFBaUI7UUFDdkIsT0FBTyxFQUFFLGNBQWM7UUFDdkIsS0FBSyxFQUFFLDZDQUE2QztLQUN2RDtJQUNELElBQUksRUFBRTtRQUNGLElBQUksRUFBRSxnQkFBZ0I7UUFDdEIsS0FBSyxFQUFFLDZDQUE2QztRQUNwRCxPQUFPLEVBQUUsb0JBQW9CO1FBQzdCLFFBQVEsRUFBRSx1QkFBdUI7UUFDakMsUUFBUSxFQUFFLHFCQUFxQjtLQUNsQztJQUNELE9BQU8sRUFBRTtRQUNMLElBQUksRUFBRSxrQkFBa0I7UUFDeEIsS0FBSyxFQUFFLDZDQUE2QztRQUNwRCxPQUFPLEVBQUUsNkJBQTZCO1FBQ3RDLFFBQVEsRUFBRSxnQ0FBZ0M7S0FDN0M7Q0FDSixDQUFDO0FBR1csUUFBQSxLQUFLLEdBQUc7SUFDakIsTUFBTSxFQUFFLFlBQVk7SUFDcEIsR0FBRyxFQUFFLGtDQUFrQztJQUN2QyxJQUFJLEVBQUUsTUFBTTtJQUNaLE1BQU0sRUFBRSxVQUFVO0lBQ2xCLFVBQVUsRUFBRSw2QkFBNkI7SUFDekMsZ0JBQWdCLEVBQUUsZUFBZTtDQUNwQyxDQUFBO0FBR1ksUUFBQSxXQUFXLEdBQUc7SUFDdkIsVUFBVTtJQUNWLFNBQVM7SUFDVCxhQUFhO0lBQ2IsWUFBWTtJQUNaLGlCQUFpQjtJQUNqQixNQUFNO0lBQ04sS0FBSztJQUNMLE1BQU07SUFDTixpQkFBaUI7SUFDakIsT0FBTztJQUNQLFFBQVE7SUFDUixPQUFPO0lBQ1AsZUFBZTtJQUNmLE1BQU07SUFDTixXQUFXO0lBQ1gsU0FBUztJQUNULFNBQVM7SUFDVCxnQkFBZ0I7SUFDaEIsVUFBVTtJQUNWLGNBQWM7SUFDZCxjQUFjO0NBQ2pCLENBQUM7QUFHVyxRQUFBLElBQUksR0FBRztJQUNoQixJQUFJLEVBQUUsV0FBVztDQUNwQixDQUFBO0FBR1ksUUFBQSxHQUFHLEdBQUcsYUFBTyxDQUFDO0FBR2QsUUFBQSxRQUFRLEdBQUcsb0JBQU8sQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBkaWNDb25mIGZyb20gJy4vZGljJztcbmltcG9ydCBhcHBDb25mIGZyb20gJy4vYXBwLWNvbmZpZyc7XG5cbi8qKiBhcHAgKi9cbmV4cG9ydCBjb25zdCBhcHAgPSB7XG4gICAgaWQ6ICd3eDYwYmY3Zjc0NWNlMzFlZjAnLFxuICAgIHNlY3JlY3Q6ICc2YzhmZjMxNDg5Y2NlN2RkNGVkZjBiMTg0M2I3YjBmNSdcbn1cblxuLyoqIOaOqOmAgeaooeeJiCAqL1xuZXhwb3J0IGNvbnN0IG5vdGlmaWNhdGlvbl90ZW1wbGF0ZSA9IHtcbiAgICBnZXRNb25leTM6ICdmQ3ZDclk4XzVsNjBzdlBnbE12UWRPMXN1bEFaUVVUY090M2hkdHJESXN3Jy8vIOS4muWKoeWPl+eQhumAmuefpVxufVxuXG4vKiog5o6o6YCB5qih5p2/5pyN5YqhICovXG5leHBvcnQgY29uc3QgcHVzaF90ZW1wbGF0ZSA9IHtcbiAgICBidXlQaW46IHtcbiAgICAgICAgZGVzYzogJ+aLvOWbouaIkOWKn+mAmuefpe+8muaLvOWboueKtuaAgeOAgeaIkOWbouadoeS7ticsXG4gICAgICAgIGV4YW1wbGU6ICfmi7zlm6LmiJDlip/vvIHmga3llpzmgqjnnIHkuoZ4eOWFg++8gTvmgqjlkozlhbbku5bkurrkubDkuoblkIzmrL7mi7zlm6LllYblk4HvvIzngrnlh7vmn6XnnIsnLFxuICAgICAgICBleGFtcGxlMjogJ+aBreWWnOaLvOWbouaIkOWKn++8geaCqOi0reS5sOeahOWVhuWTgeWPr+WHjyR7ZGVsdGF95YWDIeacieS6uuS4juS9oOS5sOS6huWQjOasvuaLvOWboueahOWVhuWTge+8jOeCueWHu+afpeeciycsXG4gICAgICAgIHZhbHVlOiAnYU9OS3R4cXVtMUpuMTVqS1ZPVkdxTnpDU2ZBMGZfbjZqXzBCTEFTWUNEZydcbiAgICB9LFxuICAgIHdhaXRQaW46IHtcbiAgICAgICAgZGVzYzogJ+aLvOWbouW+heaIkOWbouaPkOmGku+8mlx05aSH5rOo44CB5rip6aao5o+Q56S6JyxcbiAgICAgICAgZXhhbXBsZTogJ+aCqOi0reS5sOeahOWVhuWTgeWPr+WPguWKoOaLvOWbou+8ge+8m+eri+WNs+WPguWKoOaLvOWbou+8jOWPr+S7peWGjeecgXh45YWD77yBJyxcbiAgICAgICAgdmFsdWU6ICdtdFRMSXAyQy1GUTg3eW40NmpwWTNjSDlpbEdJekw0MzROMlFsVVMwTUgwJ1xuICAgIH0sXG4gICAgYnV5OiB7XG4gICAgICAgIGRlc2M6ICfotK3kubDmiJDlip/pgJrnn6XvvJrlpIfms6jjgIHml7bpl7QnLFxuICAgICAgICBleGFtcGxlOiAn5LiL5Y2V5oiQ5Yqf77yB5Lya5bC95b+r6YeH6LSt772e77ybeOaciHjml6UgMTU6MDAnLFxuICAgICAgICB2YWx1ZTogJ2ZXajZ5YV9KbjhMTmI3VzJEdTM1WmNzV3dCdmVBeTJwamd6eDh4Q2hqaGsnXG4gICAgfSxcbiAgICBnZXRNb25leToge1xuICAgICAgICBkZXNjOiAn5bC+5qy+5pSv5LuY5o+Q6YaS77ya5rip6aao5o+Q56S644CB5oiq5q2i5pe26Ze0JyxcbiAgICAgICAgZXhhbXBsZTogJ+aUr+S7mOWwvuasvu+8jOeri+WNs+WPkei0p+WTpu+8m+i2iuW/q+i2iuWlvScsXG4gICAgICAgIHZhbHVlOiAncUt3RjhjYVlRQURKNmxUY25FVGV4eTBocWkxMVNxMWRoa3NOT0hCcU9kUSdcbiAgICB9LCBcbiAgICBuZXdPcmRlcjoge1xuICAgICAgICBkZXNjOiAn5paw6K6i5Y2V6YCa55+l77ya6K6i5Y2V6K+m5oOF44CB6K6i5Y2V54q25oCBJyxcbiAgICAgICAgZXhhbXBsZTogJ+S9oOaciXjmnaHmlrDorqLljZXvvJvngrnlh7vmn6XnnIsnLFxuICAgICAgICB2YWx1ZTogJ1RRbWxDbnRrRGMxYThDdW9FUDlnTkREQWhPSlZmNFFUUHBjZldMZjBzdlEnXG4gICAgfSxcbiAgICB0cmlwOiB7XG4gICAgICAgIGRlc2M6ICfooYznqIvmj5DphpLvvJrooYznqIvlkI3np7DjgIHooYznqIvlpIfms6gnLFxuICAgICAgICB2YWx1ZTogJ1hvWFk4WFdmNkVpeW1XN3RZRFBrSERENFZjZGgtQnFQMXljWGJQa28tWlUnLFxuICAgICAgICBleGFtcGxlOiAn44CQ5ZCN56ew44CR77yb5Y+R5biD5oiQ5Yqf77yM5bm25byA6YCa5paw6K6i5Y2V5o6o6YCBJyxcbiAgICAgICAgZXhhbXBsZTI6ICfjgJDlkI3np7DjgJHvvJvlhbPpl63ooYznqIvmiJDlip/vvIzkuIDplK7mlLbmrL7lip/og73lt7LlvIDlkK8nLFxuICAgICAgICBleGFtcGxlMzogJ+OAkOWQjeensOOAke+8m+OAkOaXtumXtOOAkeW8gOWni+mHh+i0re+8jOaLvOWboui2iuS8mOaDoCcsXG4gICAgfSxcbiAgICBob25nYmFvOiB7XG4gICAgICAgIGRlc2M6ICfpooblj5bmiJDlip/pgJrnn6XvvJrpooblj5bph5Hpop3jgIHpgILnlKjojIPlm7QnLFxuICAgICAgICB2YWx1ZTogJ0lfeVpqVXhUSmtsUEdEVnJCLWJ0dDgyRjV6Njg3XzJjcFR4MU1pZV90OUEnLFxuICAgICAgICBleGFtcGxlOiAn5oGt5Zac6I635b6X57qi5YyF44CQ6YeR6aKd44CR5YWD77yb6LaB5pep5LiL5Y2V77yB5peg6Zeo5qeb56uL5YeP44CQ6YeR6aKd44CR5YWDJyxcbiAgICAgICAgZXhhbXBsZTQ6ICfmga3llpzvvIHojrflvpfjgJDph5Hpop3jgJHnjrDph5Hnp6/liIbvvJvmjqjlub/miJDlip/vvIHmnInkurrotK3kubDkuobkvaDliIbkuqvnmoTllYblk4EnXG4gICAgfVxufTtcblxuLyoqIOW+ruS/oeaUr+S7mCAqL1xuZXhwb3J0IGNvbnN0IHd4UGF5ID0ge1xuICAgIG1jaF9pZDogJzE1MjE1MjI3ODEnLCAvLyDllYbmiLflj7dcbiAgICBrZXk6ICdhOTIwMDYyNTBiNGNhOTI0N2MwMmVkY2U2OWY2YTIxYScsIC8vIOi/meS4quaYr+WVhuaIt+WPt+iuvue9rueahGtleVxuICAgIGJvZHk6ICflvq7kv6HmlK/ku5gnLCAvLyDnroDljZXmj4/ov7BcbiAgICBhdHRhY2g6ICdhbnl0aGluZycsIC8vIOmZhOWKoOaVsOaNrlxuICAgIG5vdGlmeV91cmw6ICdodHRwczovL3doYXRldmVyLmNvbS9ub3RpZnknLCAvLyDlm57osINcbiAgICBzcGJpbGxfY3JlYXRlX2lwOiAnMTE4Ljg5LjQwLjIwMCdcbn1cblxuLyoqIOaVsOaNruW6kyAqL1xuZXhwb3J0IGNvbnN0IGNvbGxlY3Rpb25zID0gW1xuICAgICdhY3Rpdml0eScsXG4gICAgJ2FkZHJlc3MnLFxuICAgICdkZWxpdmVyLWZlZScsXG4gICAgJ2FwcC1jb25maWcnLFxuICAgICdsaWtlLWNvbGxlY3Rpb24nLFxuICAgICdjYXJ0JyxcbiAgICAnZGljJyxcbiAgICAndXNlcicsXG4gICAgJ21hbmFnZXItd3gtaW5mbycsXG4gICAgJ29yZGVyJyxcbiAgICAnY291cG9uJyxcbiAgICAnZ29vZHMnLFxuICAgICdzaG9wcGluZy1saXN0JyxcbiAgICAndHJpcCcsXG4gICAgJ3N0YW5kYXJkcycsXG4gICAgJ2RlbGl2ZXInLFxuICAgICdhdXRocHN3JyxcbiAgICAnbWFuYWdlci1tZW1iZXInLFxuICAgICdmb3JtLWlkcycsXG4gICAgJ2FuYWx5c2UtZGF0YScsXG4gICAgJ3NoYXJlLXJlY29yZCdcbl07XG5cbi8qKiDmnYPpmZDmqKHlnZcgKi9cbmV4cG9ydCBjb25zdCBhdXRoID0ge1xuICAgIHNhbHQ6ICdoenBpc2Jlc3QnXG59XG5cbi8qKiDmlbDmja7lrZflhbggKi9cbmV4cG9ydCBjb25zdCBkaWMgPSBkaWNDb25mO1xuXG4vKiog5bqU55So6YWN572uICovXG5leHBvcnQgY29uc3QgYXBwQ29uZnMgPSBhcHBDb25mOyJdfQ==