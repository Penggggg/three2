"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var dic_1 = require("./dic");
var app_config_1 = require("./app-config");
exports.app = {
    id: 'wx46190709a1df31ab',
    secrect: '78d9b8f5371cacf3e887e6dcd531da3b'
};
exports.notification_template = {
    getMoney3: '7TDuFkSVtVULTwAebcxmsJCK3Ts3vGqDli0jGf6WXNI'
};
exports.wxPay = {
    mch_id: '1534060231',
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
];
exports.auth = {
    salt: 'hzpisbest'
};
exports.dic = dic_1.default;
exports.appConfs = app_config_1.default;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29uZmlnLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiY29uZmlnLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsNkJBQTRCO0FBQzVCLDJDQUFtQztBQUd0QixRQUFBLEdBQUcsR0FBRztJQUNmLEVBQUUsRUFBRSxvQkFBb0I7SUFDeEIsT0FBTyxFQUFFLGtDQUFrQztDQUM5QyxDQUFBO0FBR1ksUUFBQSxxQkFBcUIsR0FBRztJQUNqQyxTQUFTLEVBQUUsNkNBQTZDO0NBQzNELENBQUE7QUFHWSxRQUFBLEtBQUssR0FBRztJQUNqQixNQUFNLEVBQUUsWUFBWTtJQUNwQixHQUFHLEVBQUUsa0NBQWtDO0lBQ3ZDLElBQUksRUFBRSxNQUFNO0lBQ1osTUFBTSxFQUFFLFVBQVU7SUFDbEIsVUFBVSxFQUFFLDZCQUE2QjtJQUN6QyxnQkFBZ0IsRUFBRSxlQUFlO0NBQ3BDLENBQUE7QUFHWSxRQUFBLFdBQVcsR0FBRztJQUN2QixVQUFVO0lBQ1YsU0FBUztJQUNULGFBQWE7SUFDYixZQUFZO0lBQ1osaUJBQWlCO0lBQ2pCLE1BQU07SUFDTixLQUFLO0lBQ0wsTUFBTTtJQUNOLGlCQUFpQjtJQUNqQixPQUFPO0lBQ1AsUUFBUTtJQUNSLE9BQU87SUFDUCxlQUFlO0lBQ2YsTUFBTTtJQUNOLFdBQVc7SUFDWCxTQUFTO0lBQ1QsU0FBUztJQUNULGdCQUFnQjtDQUNuQixDQUFDO0FBR1csUUFBQSxJQUFJLEdBQUc7SUFDaEIsSUFBSSxFQUFFLFdBQVc7Q0FDcEIsQ0FBQTtBQUdZLFFBQUEsR0FBRyxHQUFHLGFBQU8sQ0FBQztBQUdkLFFBQUEsUUFBUSxHQUFHLG9CQUFPLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgZGljQ29uZiBmcm9tICcuL2RpYyc7XG5pbXBvcnQgYXBwQ29uZiBmcm9tICcuL2FwcC1jb25maWcnO1xuXG4vKiogYXBwICovXG5leHBvcnQgY29uc3QgYXBwID0ge1xuICAgIGlkOiAnd3g0NjE5MDcwOWExZGYzMWFiJyxcbiAgICBzZWNyZWN0OiAnNzhkOWI4ZjUzNzFjYWNmM2U4ODdlNmRjZDUzMWRhM2InXG59XG5cbi8qKiDmjqjpgIHmqKHniYggKi9cbmV4cG9ydCBjb25zdCBub3RpZmljYXRpb25fdGVtcGxhdGUgPSB7XG4gICAgZ2V0TW9uZXkzOiAnN1REdUZrU1Z0VlVMVHdBZWJjeG1zSkNLM1RzM3ZHcURsaTBqR2Y2V1hOSScvLyDotK3kubDmiJDlip/pgJrnn6Vcbn1cblxuLyoqIOW+ruS/oeaUr+S7mCAqL1xuZXhwb3J0IGNvbnN0IHd4UGF5ID0ge1xuICAgIG1jaF9pZDogJzE1MzQwNjAyMzEnLCAvLyDllYbmiLflj7dcbiAgICBrZXk6ICdhOTIwMDYyNTBiNGNhOTI0N2MwMmVkY2U2OWY2YTIxYScsIC8vIOi/meS4quaYr+WVhuaIt+WPt+iuvue9rueahGtleVxuICAgIGJvZHk6ICflvq7kv6HmlK/ku5gnLCAvLyDnroDljZXmj4/ov7BcbiAgICBhdHRhY2g6ICdhbnl0aGluZycsIC8vIOmZhOWKoOaVsOaNrlxuICAgIG5vdGlmeV91cmw6ICdodHRwczovL3doYXRldmVyLmNvbS9ub3RpZnknLCAvLyDlm57osINcbiAgICBzcGJpbGxfY3JlYXRlX2lwOiAnMTE4Ljg5LjQwLjIwMCdcbn1cblxuLyoqIOaVsOaNruW6kyAqL1xuZXhwb3J0IGNvbnN0IGNvbGxlY3Rpb25zID0gW1xuICAgICdhY3Rpdml0eScsXG4gICAgJ2FkZHJlc3MnLFxuICAgICdkZWxpdmVyLWZlZScsXG4gICAgJ2FwcC1jb25maWcnLFxuICAgICdsaWtlLWNvbGxlY3Rpb24nLFxuICAgICdjYXJ0JyxcbiAgICAnZGljJyxcbiAgICAndXNlcicsXG4gICAgJ21hbmFnZXItd3gtaW5mbycsXG4gICAgJ29yZGVyJyxcbiAgICAnY291cG9uJyxcbiAgICAnZ29vZHMnLFxuICAgICdzaG9wcGluZy1saXN0JyxcbiAgICAndHJpcCcsXG4gICAgJ3N0YW5kYXJkcycsXG4gICAgJ2RlbGl2ZXInLFxuICAgICdhdXRocHN3JyxcbiAgICAnbWFuYWdlci1tZW1iZXInLFxuXTtcblxuLyoqIOadg+mZkOaooeWdlyAqL1xuZXhwb3J0IGNvbnN0IGF1dGggPSB7XG4gICAgc2FsdDogJ2h6cGlzYmVzdCdcbn1cblxuLyoqIOaVsOaNruWtl+WFuCAqL1xuZXhwb3J0IGNvbnN0IGRpYyA9IGRpY0NvbmY7XG5cbi8qKiDlupTnlKjphY3nva4gKi9cbmV4cG9ydCBjb25zdCBhcHBDb25mcyA9IGFwcENvbmY7Il19