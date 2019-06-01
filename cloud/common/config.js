"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var dic_1 = require("./dic");
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29uZmlnLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiY29uZmlnLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsNkJBQTRCO0FBR2YsUUFBQSxHQUFHLEdBQUc7SUFDZixFQUFFLEVBQUUsb0JBQW9CO0lBQ3hCLE9BQU8sRUFBRSxrQ0FBa0M7Q0FDOUMsQ0FBQTtBQUdZLFFBQUEscUJBQXFCLEdBQUc7SUFDakMsU0FBUyxFQUFFLDZDQUE2QztDQUMzRCxDQUFBO0FBR1ksUUFBQSxLQUFLLEdBQUc7SUFDakIsTUFBTSxFQUFFLFlBQVk7SUFDcEIsR0FBRyxFQUFFLGtDQUFrQztJQUN2QyxJQUFJLEVBQUUsTUFBTTtJQUNaLE1BQU0sRUFBRSxVQUFVO0lBQ2xCLFVBQVUsRUFBRSw2QkFBNkI7SUFDekMsZ0JBQWdCLEVBQUUsZUFBZTtDQUNwQyxDQUFBO0FBR1ksUUFBQSxXQUFXLEdBQUc7SUFDdkIsVUFBVTtJQUNWLFNBQVM7SUFDVCxhQUFhO0lBQ2IsaUJBQWlCO0lBQ2pCLE1BQU07SUFDTixLQUFLO0lBQ0wsTUFBTTtJQUNOLGlCQUFpQjtJQUNqQixPQUFPO0lBQ1AsUUFBUTtJQUNSLE9BQU87SUFDUCxlQUFlO0lBQ2YsTUFBTTtJQUNOLFdBQVc7SUFDWCxTQUFTO0lBQ1QsU0FBUztJQUNULGdCQUFnQjtDQUNuQixDQUFDO0FBR1csUUFBQSxJQUFJLEdBQUc7SUFDaEIsSUFBSSxFQUFFLFdBQVc7Q0FDcEIsQ0FBQTtBQUdZLFFBQUEsR0FBRyxHQUFHLGFBQU8sQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBkaWNDb25mIGZyb20gJy4vZGljJztcblxuLyoqIGFwcCAqL1xuZXhwb3J0IGNvbnN0IGFwcCA9IHtcbiAgICBpZDogJ3d4NjBiZjdmNzQ1Y2UzMWVmMCcsXG4gICAgc2VjcmVjdDogJzZjOGZmMzE0ODljY2U3ZGQ0ZWRmMGIxODQzYjdiMGY1J1xufVxuXG4vKiog5o6o6YCB5qih54mIICovXG5leHBvcnQgY29uc3Qgbm90aWZpY2F0aW9uX3RlbXBsYXRlID0ge1xuICAgIGdldE1vbmV5MzogJ2ZDdkNyWThfNWw2MHN2UGdsTXZRZE8xc3VsQVpRVVRjT3QzaGR0ckRJc3cnLy8g5Lia5Yqh5Y+X55CG6YCa55+lXG59XG5cbi8qKiDlvq7kv6HmlK/ku5ggKi9cbmV4cG9ydCBjb25zdCB3eFBheSA9IHtcbiAgICBtY2hfaWQ6ICcxNTIxNTIyNzgxJywgLy8g5ZWG5oi35Y+3XG4gICAga2V5OiAnYTkyMDA2MjUwYjRjYTkyNDdjMDJlZGNlNjlmNmEyMWEnLCAvLyDov5nkuKrmmK/llYbmiLflj7forr7nva7nmoRrZXlcbiAgICBib2R5OiAn5b6u5L+h5pSv5LuYJywgLy8g566A5Y2V5o+P6L+wXG4gICAgYXR0YWNoOiAnYW55dGhpbmcnLCAvLyDpmYTliqDmlbDmja5cbiAgICBub3RpZnlfdXJsOiAnaHR0cHM6Ly93aGF0ZXZlci5jb20vbm90aWZ5JywgLy8g5Zue6LCDXG4gICAgc3BiaWxsX2NyZWF0ZV9pcDogJzExOC44OS40MC4yMDAnXG59XG5cbi8qKiDmlbDmja7lupMgKi9cbmV4cG9ydCBjb25zdCBjb2xsZWN0aW9ucyA9IFtcbiAgICAnYWN0aXZpdHknLFxuICAgICdhZGRyZXNzJyxcbiAgICAnZGVsaXZlci1mZWUnLFxuICAgICdsaWtlLWNvbGxlY3Rpb24nLFxuICAgICdjYXJ0JyxcbiAgICAnZGljJyxcbiAgICAndXNlcicsXG4gICAgJ21hbmFnZXItd3gtaW5mbycsXG4gICAgJ29yZGVyJyxcbiAgICAnY291cG9uJyxcbiAgICAnZ29vZHMnLFxuICAgICdzaG9wcGluZy1saXN0JyxcbiAgICAndHJpcCcsXG4gICAgJ3N0YW5kYXJkcycsXG4gICAgJ2RlbGl2ZXInLFxuICAgICdhdXRocHN3JyxcbiAgICAnbWFuYWdlci1tZW1iZXInLFxuXTtcblxuLyoqIOadg+mZkOaooeWdlyAqL1xuZXhwb3J0IGNvbnN0IGF1dGggPSB7XG4gICAgc2FsdDogJ2h6cGlzYmVzdCdcbn1cblxuLyoqIOaVsOaNruWtl+WFuCAqL1xuZXhwb3J0IGNvbnN0IGRpYyA9IGRpY0NvbmY7Il19