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
        example: '拼团成功！恭喜您省了xx元！;您和其他人买了同一款拼团商品，点击查看',
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
    'form-ids'
];
exports.auth = {
    salt: 'hzpisbest'
};
exports.dic = dic_1.default;
exports.appConfs = app_config_1.default;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29uZmlnLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiY29uZmlnLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsNkJBQTRCO0FBQzVCLDJDQUFtQztBQUd0QixRQUFBLEdBQUcsR0FBRztJQUNmLEVBQUUsRUFBRSxvQkFBb0I7SUFDeEIsT0FBTyxFQUFFLGtDQUFrQztDQUM5QyxDQUFBO0FBR1ksUUFBQSxxQkFBcUIsR0FBRztJQUNqQyxTQUFTLEVBQUUsNkNBQTZDO0NBQzNELENBQUE7QUFHWSxRQUFBLGFBQWEsR0FBRztJQUN6QixNQUFNLEVBQUU7UUFDSixJQUFJLEVBQUUsa0JBQWtCO1FBQ3hCLE9BQU8sRUFBRSxvQ0FBb0M7UUFDN0MsS0FBSyxFQUFFLDZDQUE2QztLQUN2RDtJQUNELE9BQU8sRUFBRTtRQUNMLElBQUksRUFBRSxrQkFBa0I7UUFDeEIsT0FBTyxFQUFFLDhCQUE4QjtRQUN2QyxLQUFLLEVBQUUsNkNBQTZDO0tBQ3ZEO0lBQ0QsR0FBRyxFQUFFO1FBQ0QsSUFBSSxFQUFFLGNBQWM7UUFDcEIsT0FBTyxFQUFFLHdCQUF3QjtRQUNqQyxLQUFLLEVBQUUsNkNBQTZDO0tBQ3ZEO0lBQ0QsUUFBUSxFQUFFO1FBQ04sSUFBSSxFQUFFLGtCQUFrQjtRQUN4QixPQUFPLEVBQUUsaUJBQWlCO1FBQzFCLEtBQUssRUFBRSw2Q0FBNkM7S0FDdkQ7Q0FDSixDQUFDO0FBR1csUUFBQSxLQUFLLEdBQUc7SUFDakIsTUFBTSxFQUFFLFlBQVk7SUFDcEIsR0FBRyxFQUFFLGtDQUFrQztJQUN2QyxJQUFJLEVBQUUsTUFBTTtJQUNaLE1BQU0sRUFBRSxVQUFVO0lBQ2xCLFVBQVUsRUFBRSw2QkFBNkI7SUFDekMsZ0JBQWdCLEVBQUUsZUFBZTtDQUNwQyxDQUFBO0FBR1ksUUFBQSxXQUFXLEdBQUc7SUFDdkIsVUFBVTtJQUNWLFNBQVM7SUFDVCxhQUFhO0lBQ2IsWUFBWTtJQUNaLGlCQUFpQjtJQUNqQixNQUFNO0lBQ04sS0FBSztJQUNMLE1BQU07SUFDTixpQkFBaUI7SUFDakIsT0FBTztJQUNQLFFBQVE7SUFDUixPQUFPO0lBQ1AsZUFBZTtJQUNmLE1BQU07SUFDTixXQUFXO0lBQ1gsU0FBUztJQUNULFNBQVM7SUFDVCxnQkFBZ0I7SUFDaEIsVUFBVTtDQUNiLENBQUM7QUFHVyxRQUFBLElBQUksR0FBRztJQUNoQixJQUFJLEVBQUUsV0FBVztDQUNwQixDQUFBO0FBR1ksUUFBQSxHQUFHLEdBQUcsYUFBTyxDQUFDO0FBR2QsUUFBQSxRQUFRLEdBQUcsb0JBQU8sQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBkaWNDb25mIGZyb20gJy4vZGljJztcbmltcG9ydCBhcHBDb25mIGZyb20gJy4vYXBwLWNvbmZpZyc7XG5cbi8qKiBhcHAgKi9cbmV4cG9ydCBjb25zdCBhcHAgPSB7XG4gICAgaWQ6ICd3eDYwYmY3Zjc0NWNlMzFlZjAnLFxuICAgIHNlY3JlY3Q6ICc2YzhmZjMxNDg5Y2NlN2RkNGVkZjBiMTg0M2I3YjBmNSdcbn1cblxuLyoqIOaOqOmAgeaooeeJiCAqL1xuZXhwb3J0IGNvbnN0IG5vdGlmaWNhdGlvbl90ZW1wbGF0ZSA9IHtcbiAgICBnZXRNb25leTM6ICdmQ3ZDclk4XzVsNjBzdlBnbE12UWRPMXN1bEFaUVVUY090M2hkdHJESXN3Jy8vIOS4muWKoeWPl+eQhumAmuefpVxufVxuXG4vKiog5o6o6YCB5qih5p2/5pyN5YqhICovXG5leHBvcnQgY29uc3QgcHVzaF90ZW1wbGF0ZSA9IHtcbiAgICBidXlQaW46IHtcbiAgICAgICAgZGVzYzogJ+aLvOWbouaIkOWKn+mAmuefpe+8muaLvOWboueKtuaAgeOAgeaIkOWbouadoeS7ticsXG4gICAgICAgIGV4YW1wbGU6ICfmi7zlm6LmiJDlip/vvIHmga3llpzmgqjnnIHkuoZ4eOWFg++8gTvmgqjlkozlhbbku5bkurrkubDkuoblkIzkuIDmrL7mi7zlm6LllYblk4HvvIzngrnlh7vmn6XnnIsnLFxuICAgICAgICB2YWx1ZTogJ2FPTkt0eHF1bTFKbjE1aktWT1ZHcU56Q1NmQTBmX242al8wQkxBU1lDRGcnXG4gICAgfSxcbiAgICB3YWl0UGluOiB7XG4gICAgICAgIGRlc2M6ICfmi7zlm6LlvoXmiJDlm6Lmj5DphpLvvJpcdOWkh+azqOOAgea4qemmqOaPkOekuicsXG4gICAgICAgIGV4YW1wbGU6ICfmgqjotK3kubDnmoTllYblk4Hlj6/lj4LliqDmi7zlm6LvvIHvvJvnq4vljbPlj4LliqDmi7zlm6LvvIzlj6/ku6Xlho3nnIF4eOWFg++8gScsXG4gICAgICAgIHZhbHVlOiAnbXRUTElwMkMtRlE4N3luNDZqcFkzY0g5aWxHSXpMNDM0TjJRbFVTME1IMCdcbiAgICB9LFxuICAgIGJ1eToge1xuICAgICAgICBkZXNjOiAn6LSt5Lmw5oiQ5Yqf6YCa55+l77ya5aSH5rOo44CB5pe26Ze0JyxcbiAgICAgICAgZXhhbXBsZTogJ+S4i+WNleaIkOWKn++8geS8muWwveW/q+mHh+i0re+9nu+8m3jmnIh45pelIDE1OjAwJyxcbiAgICAgICAgdmFsdWU6ICdmV2o2eWFfSm44TE5iN1cyRHUzNVpjc1d3QnZlQXkycGpneng4eENoamhrJ1xuICAgIH0sXG4gICAgZ2V0TW9uZXk6IHtcbiAgICAgICAgZGVzYzogJ+WwvuasvuaUr+S7mOaPkOmGku+8mua4qemmqOaPkOekuuOAgeaIquatouaXtumXtCcsXG4gICAgICAgIGV4YW1wbGU6ICfmlK/ku5jlsL7mrL7vvIznq4vljbPlj5HotKflk6bvvJvotorlv6votorlpb0nLFxuICAgICAgICB2YWx1ZTogJ3FLd0Y4Y2FZUUFESjZsVGNuRVRleHkwaHFpMTFTcTFkaGtzTk9IQnFPZFEnXG4gICAgfVxufTtcblxuLyoqIOW+ruS/oeaUr+S7mCAqL1xuZXhwb3J0IGNvbnN0IHd4UGF5ID0ge1xuICAgIG1jaF9pZDogJzE1MjE1MjI3ODEnLCAvLyDllYbmiLflj7dcbiAgICBrZXk6ICdhOTIwMDYyNTBiNGNhOTI0N2MwMmVkY2U2OWY2YTIxYScsIC8vIOi/meS4quaYr+WVhuaIt+WPt+iuvue9rueahGtleVxuICAgIGJvZHk6ICflvq7kv6HmlK/ku5gnLCAvLyDnroDljZXmj4/ov7BcbiAgICBhdHRhY2g6ICdhbnl0aGluZycsIC8vIOmZhOWKoOaVsOaNrlxuICAgIG5vdGlmeV91cmw6ICdodHRwczovL3doYXRldmVyLmNvbS9ub3RpZnknLCAvLyDlm57osINcbiAgICBzcGJpbGxfY3JlYXRlX2lwOiAnMTE4Ljg5LjQwLjIwMCdcbn1cblxuLyoqIOaVsOaNruW6kyAqL1xuZXhwb3J0IGNvbnN0IGNvbGxlY3Rpb25zID0gW1xuICAgICdhY3Rpdml0eScsXG4gICAgJ2FkZHJlc3MnLFxuICAgICdkZWxpdmVyLWZlZScsXG4gICAgJ2FwcC1jb25maWcnLFxuICAgICdsaWtlLWNvbGxlY3Rpb24nLFxuICAgICdjYXJ0JyxcbiAgICAnZGljJyxcbiAgICAndXNlcicsXG4gICAgJ21hbmFnZXItd3gtaW5mbycsXG4gICAgJ29yZGVyJyxcbiAgICAnY291cG9uJyxcbiAgICAnZ29vZHMnLFxuICAgICdzaG9wcGluZy1saXN0JyxcbiAgICAndHJpcCcsXG4gICAgJ3N0YW5kYXJkcycsXG4gICAgJ2RlbGl2ZXInLFxuICAgICdhdXRocHN3JyxcbiAgICAnbWFuYWdlci1tZW1iZXInLFxuICAgICdmb3JtLWlkcydcbl07XG5cbi8qKiDmnYPpmZDmqKHlnZcgKi9cbmV4cG9ydCBjb25zdCBhdXRoID0ge1xuICAgIHNhbHQ6ICdoenBpc2Jlc3QnXG59XG5cbi8qKiDmlbDmja7lrZflhbggKi9cbmV4cG9ydCBjb25zdCBkaWMgPSBkaWNDb25mO1xuXG4vKiog5bqU55So6YWN572uICovXG5leHBvcnQgY29uc3QgYXBwQ29uZnMgPSBhcHBDb25mOyJdfQ==