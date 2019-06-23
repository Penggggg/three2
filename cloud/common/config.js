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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29uZmlnLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiY29uZmlnLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsNkJBQTRCO0FBQzVCLDJDQUFtQztBQUd0QixRQUFBLEdBQUcsR0FBRztJQUNmLEVBQUUsRUFBRSxvQkFBb0I7SUFDeEIsT0FBTyxFQUFFLGtDQUFrQztDQUM5QyxDQUFBO0FBR1ksUUFBQSxxQkFBcUIsR0FBRztJQUNqQyxTQUFTLEVBQUUsNkNBQTZDO0NBQzNELENBQUE7QUFHWSxRQUFBLGFBQWEsR0FBRztJQUN6QixNQUFNLEVBQUU7UUFDSixJQUFJLEVBQUUsa0JBQWtCO1FBQ3hCLE9BQU8sRUFBRSxtQ0FBbUM7UUFDNUMsUUFBUSxFQUFFLDZDQUE2QztRQUN2RCxLQUFLLEVBQUUsNkNBQTZDO0tBQ3ZEO0lBQ0QsT0FBTyxFQUFFO1FBQ0wsSUFBSSxFQUFFLGtCQUFrQjtRQUN4QixPQUFPLEVBQUUsOEJBQThCO1FBQ3ZDLEtBQUssRUFBRSw2Q0FBNkM7S0FDdkQ7SUFDRCxHQUFHLEVBQUU7UUFDRCxJQUFJLEVBQUUsY0FBYztRQUNwQixPQUFPLEVBQUUsd0JBQXdCO1FBQ2pDLEtBQUssRUFBRSw2Q0FBNkM7S0FDdkQ7SUFDRCxRQUFRLEVBQUU7UUFDTixJQUFJLEVBQUUsa0JBQWtCO1FBQ3hCLE9BQU8sRUFBRSxpQkFBaUI7UUFDMUIsS0FBSyxFQUFFLDZDQUE2QztLQUN2RDtDQUNKLENBQUM7QUFHVyxRQUFBLEtBQUssR0FBRztJQUNqQixNQUFNLEVBQUUsWUFBWTtJQUNwQixHQUFHLEVBQUUsa0NBQWtDO0lBQ3ZDLElBQUksRUFBRSxNQUFNO0lBQ1osTUFBTSxFQUFFLFVBQVU7SUFDbEIsVUFBVSxFQUFFLDZCQUE2QjtJQUN6QyxnQkFBZ0IsRUFBRSxlQUFlO0NBQ3BDLENBQUE7QUFHWSxRQUFBLFdBQVcsR0FBRztJQUN2QixVQUFVO0lBQ1YsU0FBUztJQUNULGFBQWE7SUFDYixZQUFZO0lBQ1osaUJBQWlCO0lBQ2pCLE1BQU07SUFDTixLQUFLO0lBQ0wsTUFBTTtJQUNOLGlCQUFpQjtJQUNqQixPQUFPO0lBQ1AsUUFBUTtJQUNSLE9BQU87SUFDUCxlQUFlO0lBQ2YsTUFBTTtJQUNOLFdBQVc7SUFDWCxTQUFTO0lBQ1QsU0FBUztJQUNULGdCQUFnQjtJQUNoQixVQUFVO0NBQ2IsQ0FBQztBQUdXLFFBQUEsSUFBSSxHQUFHO0lBQ2hCLElBQUksRUFBRSxXQUFXO0NBQ3BCLENBQUE7QUFHWSxRQUFBLEdBQUcsR0FBRyxhQUFPLENBQUM7QUFHZCxRQUFBLFFBQVEsR0FBRyxvQkFBTyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGRpY0NvbmYgZnJvbSAnLi9kaWMnO1xuaW1wb3J0IGFwcENvbmYgZnJvbSAnLi9hcHAtY29uZmlnJztcblxuLyoqIGFwcCAqL1xuZXhwb3J0IGNvbnN0IGFwcCA9IHtcbiAgICBpZDogJ3d4NjBiZjdmNzQ1Y2UzMWVmMCcsXG4gICAgc2VjcmVjdDogJzZjOGZmMzE0ODljY2U3ZGQ0ZWRmMGIxODQzYjdiMGY1J1xufVxuXG4vKiog5o6o6YCB5qih54mIICovXG5leHBvcnQgY29uc3Qgbm90aWZpY2F0aW9uX3RlbXBsYXRlID0ge1xuICAgIGdldE1vbmV5MzogJ2ZDdkNyWThfNWw2MHN2UGdsTXZRZE8xc3VsQVpRVVRjT3QzaGR0ckRJc3cnLy8g5Lia5Yqh5Y+X55CG6YCa55+lXG59XG5cbi8qKiDmjqjpgIHmqKHmnb/mnI3liqEgKi9cbmV4cG9ydCBjb25zdCBwdXNoX3RlbXBsYXRlID0ge1xuICAgIGJ1eVBpbjoge1xuICAgICAgICBkZXNjOiAn5ou85Zui5oiQ5Yqf6YCa55+l77ya5ou85Zui54q25oCB44CB5oiQ5Zui5p2h5Lu2JyxcbiAgICAgICAgZXhhbXBsZTogJ+aLvOWbouaIkOWKn++8geaBreWWnOaCqOecgeS6hnh45YWD77yBO+aCqOWSjOWFtuS7luS6uuS5sOS6huWQjOasvuaLvOWbouWVhuWTge+8jOeCueWHu+afpeeciycsXG4gICAgICAgIGV4YW1wbGUyOiAn5oGt5Zac5ou85Zui5oiQ5Yqf77yB5oKo6LSt5Lmw55qE5ZWG5ZOB5Y+v5YePJHtkZWx0YX3lhYMh5pyJ5Lq65LiO5L2g5Lmw5LqG5ZCM5qy+5ou85Zui55qE5ZWG5ZOB77yM54K55Ye75p+l55yLJyxcbiAgICAgICAgdmFsdWU6ICdhT05LdHhxdW0xSm4xNWpLVk9WR3FOekNTZkEwZl9uNmpfMEJMQVNZQ0RnJ1xuICAgIH0sXG4gICAgd2FpdFBpbjoge1xuICAgICAgICBkZXNjOiAn5ou85Zui5b6F5oiQ5Zui5o+Q6YaS77yaXHTlpIfms6jjgIHmuKnppqjmj5DnpLonLFxuICAgICAgICBleGFtcGxlOiAn5oKo6LSt5Lmw55qE5ZWG5ZOB5Y+v5Y+C5Yqg5ou85Zui77yB77yb56uL5Y2z5Y+C5Yqg5ou85Zui77yM5Y+v5Lul5YaN55yBeHjlhYPvvIEnLFxuICAgICAgICB2YWx1ZTogJ210VExJcDJDLUZRODd5bjQ2anBZM2NIOWlsR0l6TDQzNE4yUWxVUzBNSDAnXG4gICAgfSxcbiAgICBidXk6IHtcbiAgICAgICAgZGVzYzogJ+i0reS5sOaIkOWKn+mAmuefpe+8muWkh+azqOOAgeaXtumXtCcsXG4gICAgICAgIGV4YW1wbGU6ICfkuIvljZXmiJDlip/vvIHkvJrlsL3lv6vph4fotK3vvZ7vvJt45pyIeOaXpSAxNTowMCcsXG4gICAgICAgIHZhbHVlOiAnZldqNnlhX0puOExOYjdXMkR1MzVaY3NXd0J2ZUF5MnBqZ3p4OHhDaGpoaydcbiAgICB9LFxuICAgIGdldE1vbmV5OiB7XG4gICAgICAgIGRlc2M6ICflsL7mrL7mlK/ku5jmj5DphpLvvJrmuKnppqjmj5DnpLrjgIHmiKrmraLml7bpl7QnLFxuICAgICAgICBleGFtcGxlOiAn5pSv5LuY5bC+5qy+77yM56uL5Y2z5Y+R6LSn5ZOm77yb6LaK5b+r6LaK5aW9JyxcbiAgICAgICAgdmFsdWU6ICdxS3dGOGNhWVFBREo2bFRjbkVUZXh5MGhxaTExU3ExZGhrc05PSEJxT2RRJ1xuICAgIH1cbn07XG5cbi8qKiDlvq7kv6HmlK/ku5ggKi9cbmV4cG9ydCBjb25zdCB3eFBheSA9IHtcbiAgICBtY2hfaWQ6ICcxNTIxNTIyNzgxJywgLy8g5ZWG5oi35Y+3XG4gICAga2V5OiAnYTkyMDA2MjUwYjRjYTkyNDdjMDJlZGNlNjlmNmEyMWEnLCAvLyDov5nkuKrmmK/llYbmiLflj7forr7nva7nmoRrZXlcbiAgICBib2R5OiAn5b6u5L+h5pSv5LuYJywgLy8g566A5Y2V5o+P6L+wXG4gICAgYXR0YWNoOiAnYW55dGhpbmcnLCAvLyDpmYTliqDmlbDmja5cbiAgICBub3RpZnlfdXJsOiAnaHR0cHM6Ly93aGF0ZXZlci5jb20vbm90aWZ5JywgLy8g5Zue6LCDXG4gICAgc3BiaWxsX2NyZWF0ZV9pcDogJzExOC44OS40MC4yMDAnXG59XG5cbi8qKiDmlbDmja7lupMgKi9cbmV4cG9ydCBjb25zdCBjb2xsZWN0aW9ucyA9IFtcbiAgICAnYWN0aXZpdHknLFxuICAgICdhZGRyZXNzJyxcbiAgICAnZGVsaXZlci1mZWUnLFxuICAgICdhcHAtY29uZmlnJyxcbiAgICAnbGlrZS1jb2xsZWN0aW9uJyxcbiAgICAnY2FydCcsXG4gICAgJ2RpYycsXG4gICAgJ3VzZXInLFxuICAgICdtYW5hZ2VyLXd4LWluZm8nLFxuICAgICdvcmRlcicsXG4gICAgJ2NvdXBvbicsXG4gICAgJ2dvb2RzJyxcbiAgICAnc2hvcHBpbmctbGlzdCcsXG4gICAgJ3RyaXAnLFxuICAgICdzdGFuZGFyZHMnLFxuICAgICdkZWxpdmVyJyxcbiAgICAnYXV0aHBzdycsXG4gICAgJ21hbmFnZXItbWVtYmVyJyxcbiAgICAnZm9ybS1pZHMnXG5dO1xuXG4vKiog5p2D6ZmQ5qih5Z2XICovXG5leHBvcnQgY29uc3QgYXV0aCA9IHtcbiAgICBzYWx0OiAnaHpwaXNiZXN0J1xufVxuXG4vKiog5pWw5o2u5a2X5YW4ICovXG5leHBvcnQgY29uc3QgZGljID0gZGljQ29uZjtcblxuLyoqIOW6lOeUqOmFjee9riAqL1xuZXhwb3J0IGNvbnN0IGFwcENvbmZzID0gYXBwQ29uZjsiXX0=