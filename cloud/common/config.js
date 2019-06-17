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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29uZmlnLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiY29uZmlnLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsNkJBQTRCO0FBQzVCLDJDQUFtQztBQUd0QixRQUFBLEdBQUcsR0FBRztJQUNmLEVBQUUsRUFBRSxvQkFBb0I7SUFDeEIsT0FBTyxFQUFFLGtDQUFrQztDQUM5QyxDQUFBO0FBR1ksUUFBQSxxQkFBcUIsR0FBRztJQUNqQyxTQUFTLEVBQUUsNkNBQTZDO0NBQzNELENBQUE7QUFHWSxRQUFBLEtBQUssR0FBRztJQUNqQixNQUFNLEVBQUUsWUFBWTtJQUNwQixHQUFHLEVBQUUsa0NBQWtDO0lBQ3ZDLElBQUksRUFBRSxNQUFNO0lBQ1osTUFBTSxFQUFFLFVBQVU7SUFDbEIsVUFBVSxFQUFFLDZCQUE2QjtJQUN6QyxnQkFBZ0IsRUFBRSxlQUFlO0NBQ3BDLENBQUE7QUFHWSxRQUFBLFdBQVcsR0FBRztJQUN2QixVQUFVO0lBQ1YsU0FBUztJQUNULGFBQWE7SUFDYixZQUFZO0lBQ1osaUJBQWlCO0lBQ2pCLE1BQU07SUFDTixLQUFLO0lBQ0wsTUFBTTtJQUNOLGlCQUFpQjtJQUNqQixPQUFPO0lBQ1AsUUFBUTtJQUNSLE9BQU87SUFDUCxlQUFlO0lBQ2YsTUFBTTtJQUNOLFdBQVc7SUFDWCxTQUFTO0lBQ1QsU0FBUztJQUNULGdCQUFnQjtJQUNoQixVQUFVO0NBQ2IsQ0FBQztBQUdXLFFBQUEsSUFBSSxHQUFHO0lBQ2hCLElBQUksRUFBRSxXQUFXO0NBQ3BCLENBQUE7QUFHWSxRQUFBLEdBQUcsR0FBRyxhQUFPLENBQUM7QUFHZCxRQUFBLFFBQVEsR0FBRyxvQkFBTyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGRpY0NvbmYgZnJvbSAnLi9kaWMnO1xuaW1wb3J0IGFwcENvbmYgZnJvbSAnLi9hcHAtY29uZmlnJztcblxuLyoqIGFwcCAqL1xuZXhwb3J0IGNvbnN0IGFwcCA9IHtcbiAgICBpZDogJ3d4NjBiZjdmNzQ1Y2UzMWVmMCcsXG4gICAgc2VjcmVjdDogJzZjOGZmMzE0ODljY2U3ZGQ0ZWRmMGIxODQzYjdiMGY1J1xufVxuXG4vKiog5o6o6YCB5qih54mIICovXG5leHBvcnQgY29uc3Qgbm90aWZpY2F0aW9uX3RlbXBsYXRlID0ge1xuICAgIGdldE1vbmV5MzogJ2ZDdkNyWThfNWw2MHN2UGdsTXZRZE8xc3VsQVpRVVRjT3QzaGR0ckRJc3cnLy8g5Lia5Yqh5Y+X55CG6YCa55+lXG59XG5cbi8qKiDlvq7kv6HmlK/ku5ggKi9cbmV4cG9ydCBjb25zdCB3eFBheSA9IHtcbiAgICBtY2hfaWQ6ICcxNTIxNTIyNzgxJywgLy8g5ZWG5oi35Y+3XG4gICAga2V5OiAnYTkyMDA2MjUwYjRjYTkyNDdjMDJlZGNlNjlmNmEyMWEnLCAvLyDov5nkuKrmmK/llYbmiLflj7forr7nva7nmoRrZXlcbiAgICBib2R5OiAn5b6u5L+h5pSv5LuYJywgLy8g566A5Y2V5o+P6L+wXG4gICAgYXR0YWNoOiAnYW55dGhpbmcnLCAvLyDpmYTliqDmlbDmja5cbiAgICBub3RpZnlfdXJsOiAnaHR0cHM6Ly93aGF0ZXZlci5jb20vbm90aWZ5JywgLy8g5Zue6LCDXG4gICAgc3BiaWxsX2NyZWF0ZV9pcDogJzExOC44OS40MC4yMDAnXG59XG5cbi8qKiDmlbDmja7lupMgKi9cbmV4cG9ydCBjb25zdCBjb2xsZWN0aW9ucyA9IFtcbiAgICAnYWN0aXZpdHknLFxuICAgICdhZGRyZXNzJyxcbiAgICAnZGVsaXZlci1mZWUnLFxuICAgICdhcHAtY29uZmlnJyxcbiAgICAnbGlrZS1jb2xsZWN0aW9uJyxcbiAgICAnY2FydCcsXG4gICAgJ2RpYycsXG4gICAgJ3VzZXInLFxuICAgICdtYW5hZ2VyLXd4LWluZm8nLFxuICAgICdvcmRlcicsXG4gICAgJ2NvdXBvbicsXG4gICAgJ2dvb2RzJyxcbiAgICAnc2hvcHBpbmctbGlzdCcsXG4gICAgJ3RyaXAnLFxuICAgICdzdGFuZGFyZHMnLFxuICAgICdkZWxpdmVyJyxcbiAgICAnYXV0aHBzdycsXG4gICAgJ21hbmFnZXItbWVtYmVyJyxcbiAgICAnZm9ybS1pZHMnXG5dO1xuXG4vKiog5p2D6ZmQ5qih5Z2XICovXG5leHBvcnQgY29uc3QgYXV0aCA9IHtcbiAgICBzYWx0OiAnaHpwaXNiZXN0J1xufVxuXG4vKiog5pWw5o2u5a2X5YW4ICovXG5leHBvcnQgY29uc3QgZGljID0gZGljQ29uZjtcblxuLyoqIOW6lOeUqOmFjee9riAqL1xuZXhwb3J0IGNvbnN0IGFwcENvbmZzID0gYXBwQ29uZjsiXX0=