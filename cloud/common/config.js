"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = {
    id: 'wx60bf7f745ce31ef0',
    secrect: '6c8ff31489cce7dd4edf0b1843b7b0f5'
};
exports.notification_template = {
    getMoney: 'fWj6ya_Jn8LNb7W2Du35ZYlF-29-GR6edkQZHMQKlr8',
    getMoney2: 'fCvCrY8_5l60svPglMvQdLlA8eHcVeDBh0N-QPv1DFk',
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29uZmlnLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiY29uZmlnLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQ2EsUUFBQSxHQUFHLEdBQUc7SUFDZixFQUFFLEVBQUUsb0JBQW9CO0lBQ3hCLE9BQU8sRUFBRSxrQ0FBa0M7Q0FDOUMsQ0FBQTtBQUdZLFFBQUEscUJBQXFCLEdBQUc7SUFDakMsUUFBUSxFQUFFLDZDQUE2QztJQUN2RCxTQUFTLEVBQUUsNkNBQTZDO0lBQ3hELFNBQVMsRUFBRSw2Q0FBNkM7Q0FDM0QsQ0FBQTtBQUdZLFFBQUEsS0FBSyxHQUFHO0lBQ2pCLE1BQU0sRUFBRSxZQUFZO0lBQ3BCLEdBQUcsRUFBRSxrQ0FBa0M7SUFDdkMsSUFBSSxFQUFFLE1BQU07SUFDWixNQUFNLEVBQUUsVUFBVTtJQUNsQixVQUFVLEVBQUUsNkJBQTZCO0lBQ3pDLGdCQUFnQixFQUFFLGVBQWU7Q0FDcEMsQ0FBQTtBQUdZLFFBQUEsV0FBVyxHQUFHO0lBQ3ZCLFVBQVU7SUFDVixTQUFTO0lBQ1QsaUJBQWlCO0lBQ2pCLE1BQU07SUFDTixLQUFLO0lBQ0wsTUFBTTtJQUNOLGlCQUFpQjtJQUNqQixPQUFPO0lBQ1AsUUFBUTtJQUNSLE9BQU87SUFDUCxlQUFlO0lBQ2YsTUFBTTtJQUNOLFdBQVc7SUFDWCxTQUFTO0lBQ1QsU0FBUztJQUNULGdCQUFnQjtDQUNuQixDQUFDO0FBR1csUUFBQSxJQUFJLEdBQUc7SUFDaEIsSUFBSSxFQUFFLFdBQVc7Q0FDcEIsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbIi8qKiBhcHAgKi9cbmV4cG9ydCBjb25zdCBhcHAgPSB7XG4gICAgaWQ6ICd3eDYwYmY3Zjc0NWNlMzFlZjAnLFxuICAgIHNlY3JlY3Q6ICc2YzhmZjMxNDg5Y2NlN2RkNGVkZjBiMTg0M2I3YjBmNSdcbn1cblxuLyoqIOaOqOmAgeaooeeJiCAqL1xuZXhwb3J0IGNvbnN0IG5vdGlmaWNhdGlvbl90ZW1wbGF0ZSA9IHtcbiAgICBnZXRNb25leTogJ2ZXajZ5YV9KbjhMTmI3VzJEdTM1WllsRi0yOS1HUjZlZGtRWkhNUUtscjgnLCAvLyDoh6rlrprkuYnkuobkuIDkuKpcbiAgICBnZXRNb25leTI6ICdmQ3ZDclk4XzVsNjBzdlBnbE12UWRMbEE4ZUhjVmVEQmgwTi1RUHYxREZrJywgLy8g5Lia5Yqh5Y+X55CGXG4gICAgZ2V0TW9uZXkzOiAnZkN2Q3JZOF81bDYwc3ZQZ2xNdlFkTzFzdWxBWlFVVGNPdDNoZHRyRElzdycvLyDkuJrliqHlj5fnkIYyXG59XG5cbi8qKiDlvq7kv6HmlK/ku5ggKi9cbmV4cG9ydCBjb25zdCB3eFBheSA9IHtcbiAgICBtY2hfaWQ6ICcxNTIxNTIyNzgxJywgLy8g5ZWG5oi35Y+3XG4gICAga2V5OiAnYTkyMDA2MjUwYjRjYTkyNDdjMDJlZGNlNjlmNmEyMWEnLCAvLyDov5nkuKrmmK/llYbmiLflj7forr7nva7nmoRrZXlcbiAgICBib2R5OiAn5b6u5L+h5pSv5LuYJywgLy8g566A5Y2V5o+P6L+wXG4gICAgYXR0YWNoOiAnYW55dGhpbmcnLCAvLyDpmYTliqDmlbDmja5cbiAgICBub3RpZnlfdXJsOiAnaHR0cHM6Ly93aGF0ZXZlci5jb20vbm90aWZ5JywgLy8g5Zue6LCDXG4gICAgc3BiaWxsX2NyZWF0ZV9pcDogJzExOC44OS40MC4yMDAnXG59XG5cbi8qKiDmlbDmja7lupMgKi9cbmV4cG9ydCBjb25zdCBjb2xsZWN0aW9ucyA9IFtcbiAgICAnYWN0aXZpdHknLFxuICAgICdhZGRyZXNzJyxcbiAgICAnbGlrZS1jb2xsZWN0aW9uJyxcbiAgICAnY2FydCcsXG4gICAgJ2RpYycsXG4gICAgJ3VzZXInLFxuICAgICdtYW5hZ2VyLXd4LWluZm8nLFxuICAgICdvcmRlcicsXG4gICAgJ2NvdXBvbicsXG4gICAgJ2dvb2RzJyxcbiAgICAnc2hvcHBpbmctbGlzdCcsXG4gICAgJ3RyaXAnLFxuICAgICdzdGFuZGFyZHMnLFxuICAgICdkZWxpdmVyJyxcbiAgICAnYXV0aHBzdycsXG4gICAgJ21hbmFnZXItbWVtYmVyJyxcbl07XG5cbi8qKiDmnYPpmZDmqKHlnZcgKi9cbmV4cG9ydCBjb25zdCBhdXRoID0ge1xuICAgIHNhbHQ6ICdoenBpc2Jlc3QnXG59Il19