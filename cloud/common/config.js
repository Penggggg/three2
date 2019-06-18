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
        desc: '拼团成功通知：拼团状态、参团时间',
        value: 'aONKtxqum1Jn15jKVOVGqKUXPOgIz_jQegD7105cwe0'
    },
    buy: {
        desc: '购买成功通知：备注、时间',
        value: 'fWj6ya_Jn8LNb7W2Du35ZcsWwBveAy2pjgzx8xChjhk'
    },
    getMoney: {
        desc: '尾款支付提醒：温馨提示、截止时间',
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29uZmlnLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiY29uZmlnLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsNkJBQTRCO0FBQzVCLDJDQUFtQztBQUd0QixRQUFBLEdBQUcsR0FBRztJQUNmLEVBQUUsRUFBRSxvQkFBb0I7SUFDeEIsT0FBTyxFQUFFLGtDQUFrQztDQUM5QyxDQUFBO0FBR1ksUUFBQSxxQkFBcUIsR0FBRztJQUNqQyxTQUFTLEVBQUUsNkNBQTZDO0NBQzNELENBQUE7QUFHWSxRQUFBLGFBQWEsR0FBRztJQUN6QixNQUFNLEVBQUU7UUFDSixJQUFJLEVBQUUsa0JBQWtCO1FBQ3hCLEtBQUssRUFBRSw2Q0FBNkM7S0FDdkQ7SUFDRCxHQUFHLEVBQUU7UUFDRCxJQUFJLEVBQUUsY0FBYztRQUNwQixLQUFLLEVBQUUsNkNBQTZDO0tBQ3ZEO0lBQ0QsUUFBUSxFQUFFO1FBQ04sSUFBSSxFQUFFLGtCQUFrQjtRQUN4QixLQUFLLEVBQUUsNkNBQTZDO0tBQ3ZEO0NBQ0osQ0FBQztBQUdXLFFBQUEsS0FBSyxHQUFHO0lBQ2pCLE1BQU0sRUFBRSxZQUFZO0lBQ3BCLEdBQUcsRUFBRSxrQ0FBa0M7SUFDdkMsSUFBSSxFQUFFLE1BQU07SUFDWixNQUFNLEVBQUUsVUFBVTtJQUNsQixVQUFVLEVBQUUsNkJBQTZCO0lBQ3pDLGdCQUFnQixFQUFFLGVBQWU7Q0FDcEMsQ0FBQTtBQUdZLFFBQUEsV0FBVyxHQUFHO0lBQ3ZCLFVBQVU7SUFDVixTQUFTO0lBQ1QsYUFBYTtJQUNiLFlBQVk7SUFDWixpQkFBaUI7SUFDakIsTUFBTTtJQUNOLEtBQUs7SUFDTCxNQUFNO0lBQ04saUJBQWlCO0lBQ2pCLE9BQU87SUFDUCxRQUFRO0lBQ1IsT0FBTztJQUNQLGVBQWU7SUFDZixNQUFNO0lBQ04sV0FBVztJQUNYLFNBQVM7SUFDVCxTQUFTO0lBQ1QsZ0JBQWdCO0lBQ2hCLFVBQVU7Q0FDYixDQUFDO0FBR1csUUFBQSxJQUFJLEdBQUc7SUFDaEIsSUFBSSxFQUFFLFdBQVc7Q0FDcEIsQ0FBQTtBQUdZLFFBQUEsR0FBRyxHQUFHLGFBQU8sQ0FBQztBQUdkLFFBQUEsUUFBUSxHQUFHLG9CQUFPLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgZGljQ29uZiBmcm9tICcuL2RpYyc7XG5pbXBvcnQgYXBwQ29uZiBmcm9tICcuL2FwcC1jb25maWcnO1xuXG4vKiogYXBwICovXG5leHBvcnQgY29uc3QgYXBwID0ge1xuICAgIGlkOiAnd3g2MGJmN2Y3NDVjZTMxZWYwJyxcbiAgICBzZWNyZWN0OiAnNmM4ZmYzMTQ4OWNjZTdkZDRlZGYwYjE4NDNiN2IwZjUnXG59XG5cbi8qKiDmjqjpgIHmqKHniYggKi9cbmV4cG9ydCBjb25zdCBub3RpZmljYXRpb25fdGVtcGxhdGUgPSB7XG4gICAgZ2V0TW9uZXkzOiAnZkN2Q3JZOF81bDYwc3ZQZ2xNdlFkTzFzdWxBWlFVVGNPdDNoZHRyRElzdycvLyDkuJrliqHlj5fnkIbpgJrnn6Vcbn1cblxuLyoqIOaOqOmAgeaooeadv+acjeWKoSAqL1xuZXhwb3J0IGNvbnN0IHB1c2hfdGVtcGxhdGUgPSB7XG4gICAgYnV5UGluOiB7XG4gICAgICAgIGRlc2M6ICfmi7zlm6LmiJDlip/pgJrnn6XvvJrmi7zlm6LnirbmgIHjgIHlj4Llm6Lml7bpl7QnLFxuICAgICAgICB2YWx1ZTogJ2FPTkt0eHF1bTFKbjE1aktWT1ZHcUtVWFBPZ0l6X2pRZWdENzEwNWN3ZTAnXG4gICAgfSxcbiAgICBidXk6IHtcbiAgICAgICAgZGVzYzogJ+i0reS5sOaIkOWKn+mAmuefpe+8muWkh+azqOOAgeaXtumXtCcsXG4gICAgICAgIHZhbHVlOiAnZldqNnlhX0puOExOYjdXMkR1MzVaY3NXd0J2ZUF5MnBqZ3p4OHhDaGpoaydcbiAgICB9LFxuICAgIGdldE1vbmV5OiB7XG4gICAgICAgIGRlc2M6ICflsL7mrL7mlK/ku5jmj5DphpLvvJrmuKnppqjmj5DnpLrjgIHmiKrmraLml7bpl7QnLFxuICAgICAgICB2YWx1ZTogJ3FLd0Y4Y2FZUUFESjZsVGNuRVRleHkwaHFpMTFTcTFkaGtzTk9IQnFPZFEnXG4gICAgfVxufTtcblxuLyoqIOW+ruS/oeaUr+S7mCAqL1xuZXhwb3J0IGNvbnN0IHd4UGF5ID0ge1xuICAgIG1jaF9pZDogJzE1MjE1MjI3ODEnLCAvLyDllYbmiLflj7dcbiAgICBrZXk6ICdhOTIwMDYyNTBiNGNhOTI0N2MwMmVkY2U2OWY2YTIxYScsIC8vIOi/meS4quaYr+WVhuaIt+WPt+iuvue9rueahGtleVxuICAgIGJvZHk6ICflvq7kv6HmlK/ku5gnLCAvLyDnroDljZXmj4/ov7BcbiAgICBhdHRhY2g6ICdhbnl0aGluZycsIC8vIOmZhOWKoOaVsOaNrlxuICAgIG5vdGlmeV91cmw6ICdodHRwczovL3doYXRldmVyLmNvbS9ub3RpZnknLCAvLyDlm57osINcbiAgICBzcGJpbGxfY3JlYXRlX2lwOiAnMTE4Ljg5LjQwLjIwMCdcbn1cblxuLyoqIOaVsOaNruW6kyAqL1xuZXhwb3J0IGNvbnN0IGNvbGxlY3Rpb25zID0gW1xuICAgICdhY3Rpdml0eScsXG4gICAgJ2FkZHJlc3MnLFxuICAgICdkZWxpdmVyLWZlZScsXG4gICAgJ2FwcC1jb25maWcnLFxuICAgICdsaWtlLWNvbGxlY3Rpb24nLFxuICAgICdjYXJ0JyxcbiAgICAnZGljJyxcbiAgICAndXNlcicsXG4gICAgJ21hbmFnZXItd3gtaW5mbycsXG4gICAgJ29yZGVyJyxcbiAgICAnY291cG9uJyxcbiAgICAnZ29vZHMnLFxuICAgICdzaG9wcGluZy1saXN0JyxcbiAgICAndHJpcCcsXG4gICAgJ3N0YW5kYXJkcycsXG4gICAgJ2RlbGl2ZXInLFxuICAgICdhdXRocHN3JyxcbiAgICAnbWFuYWdlci1tZW1iZXInLFxuICAgICdmb3JtLWlkcydcbl07XG5cbi8qKiDmnYPpmZDmqKHlnZcgKi9cbmV4cG9ydCBjb25zdCBhdXRoID0ge1xuICAgIHNhbHQ6ICdoenBpc2Jlc3QnXG59XG5cbi8qKiDmlbDmja7lrZflhbggKi9cbmV4cG9ydCBjb25zdCBkaWMgPSBkaWNDb25mO1xuXG4vKiog5bqU55So6YWN572uICovXG5leHBvcnQgY29uc3QgYXBwQ29uZnMgPSBhcHBDb25mOyJdfQ==