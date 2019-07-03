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
exports.push_template = {
    buyPin: {
        desc: '拼团成功通知：拼团状态、成团条件',
        example: '拼团成功！恭喜您省了xx元！;您和其他人买了同款拼团商品，点击查看',
        example2: '恭喜拼团成功！您购买的商品可减${delta}元!有人与你买了同款拼团的商品，点击查看',
        value: 'VdCtZLqbawiHC1EDY3k1XuVT30CM34M_lSkWNmONlIg'
    },
    waitPin: {
        desc: '拼团待成团提醒：	备注、温馨提示',
        example: '您购买的商品可参加拼团！；立即参加拼团，可以再省xx元！',
        value: 'GOT5PcxD3KDYrO1YnEXuGmNdzBrrMuOSLP6vUJBTmyI'
    },
    buy: {
        desc: '购买成功通知：备注、时间',
        example: '下单成功！会尽快采购～；x月x日 15:00',
        value: '7TDuFkSVtVULTwAebcxmsGud7deYYs3SeHrf_vWnlvY'
    },
    getMoney: {
        desc: '尾款支付提醒：温馨提示、截止时间',
        example: '支付尾款，立即发货哦；越快越好',
        value: 'mgmsCeFK1w1vRom3MwwICSs2csS7QiWVMXFMPtEQvSc'
    },
    newOrder: {
        desc: '新订单通知：订单详情、订单状态',
        example: '你有x条新订单；点击查看',
        value: 'aBjeOjBH8Zp9B60FwEbJKvwKZF_IJEBKQtWRMSaecrQ'
    }
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
    'form-ids',
    'analyse-data'
];
exports.auth = {
    salt: 'hzpisbest'
};
exports.dic = dic_1.default;
exports.appConfs = app_config_1.default;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29uZmlnLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiY29uZmlnLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsNkJBQTRCO0FBQzVCLDJDQUFtQztBQUd0QixRQUFBLEdBQUcsR0FBRztJQUNmLEVBQUUsRUFBRSxvQkFBb0I7SUFDeEIsT0FBTyxFQUFFLGtDQUFrQztDQUM5QyxDQUFBO0FBR1ksUUFBQSxxQkFBcUIsR0FBRztJQUNqQyxTQUFTLEVBQUUsNkNBQTZDO0NBQzNELENBQUE7QUFHWSxRQUFBLGFBQWEsR0FBRztJQUN6QixNQUFNLEVBQUU7UUFDSixJQUFJLEVBQUUsa0JBQWtCO1FBQ3hCLE9BQU8sRUFBRSxtQ0FBbUM7UUFDNUMsUUFBUSxFQUFFLDZDQUE2QztRQUN2RCxLQUFLLEVBQUUsNkNBQTZDO0tBQ3ZEO0lBQ0QsT0FBTyxFQUFFO1FBQ0wsSUFBSSxFQUFFLGtCQUFrQjtRQUN4QixPQUFPLEVBQUUsOEJBQThCO1FBQ3ZDLEtBQUssRUFBRSw2Q0FBNkM7S0FDdkQ7SUFDRCxHQUFHLEVBQUU7UUFDRCxJQUFJLEVBQUUsY0FBYztRQUNwQixPQUFPLEVBQUUsd0JBQXdCO1FBQ2pDLEtBQUssRUFBRSw2Q0FBNkM7S0FDdkQ7SUFDRCxRQUFRLEVBQUU7UUFDTixJQUFJLEVBQUUsa0JBQWtCO1FBQ3hCLE9BQU8sRUFBRSxpQkFBaUI7UUFDMUIsS0FBSyxFQUFFLDZDQUE2QztLQUN2RDtJQUNELFFBQVEsRUFBRTtRQUNOLElBQUksRUFBRSxpQkFBaUI7UUFDdkIsT0FBTyxFQUFFLGNBQWM7UUFDdkIsS0FBSyxFQUFFLDZDQUE2QztLQUN2RDtDQUNKLENBQUM7QUFHVyxRQUFBLEtBQUssR0FBRztJQUNqQixNQUFNLEVBQUUsWUFBWTtJQUNwQixHQUFHLEVBQUUsa0NBQWtDO0lBQ3ZDLElBQUksRUFBRSxNQUFNO0lBQ1osTUFBTSxFQUFFLFVBQVU7SUFDbEIsVUFBVSxFQUFFLDZCQUE2QjtJQUN6QyxnQkFBZ0IsRUFBRSxlQUFlO0NBQ3BDLENBQUE7QUFHWSxRQUFBLFdBQVcsR0FBRztJQUN2QixVQUFVO0lBQ1YsU0FBUztJQUNULGFBQWE7SUFDYixZQUFZO0lBQ1osaUJBQWlCO0lBQ2pCLE1BQU07SUFDTixLQUFLO0lBQ0wsTUFBTTtJQUNOLGlCQUFpQjtJQUNqQixPQUFPO0lBQ1AsUUFBUTtJQUNSLE9BQU87SUFDUCxlQUFlO0lBQ2YsTUFBTTtJQUNOLFdBQVc7SUFDWCxTQUFTO0lBQ1QsU0FBUztJQUNULGdCQUFnQjtJQUNoQixVQUFVO0lBQ1YsY0FBYztDQUNqQixDQUFDO0FBR1csUUFBQSxJQUFJLEdBQUc7SUFDaEIsSUFBSSxFQUFFLFdBQVc7Q0FDcEIsQ0FBQTtBQUdZLFFBQUEsR0FBRyxHQUFHLGFBQU8sQ0FBQztBQUdkLFFBQUEsUUFBUSxHQUFHLG9CQUFPLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgZGljQ29uZiBmcm9tICcuL2RpYyc7XG5pbXBvcnQgYXBwQ29uZiBmcm9tICcuL2FwcC1jb25maWcnO1xuXG4vKiogYXBwICovXG5leHBvcnQgY29uc3QgYXBwID0ge1xuICAgIGlkOiAnd3g0NjE5MDcwOWExZGYzMWFiJyxcbiAgICBzZWNyZWN0OiAnNzhkOWI4ZjUzNzFjYWNmM2U4ODdlNmRjZDUzMWRhM2InXG59XG5cbi8qKiDmjqjpgIHmqKHniYggKi9cbmV4cG9ydCBjb25zdCBub3RpZmljYXRpb25fdGVtcGxhdGUgPSB7XG4gICAgZ2V0TW9uZXkzOiAnN1REdUZrU1Z0VlVMVHdBZWJjeG1zSkNLM1RzM3ZHcURsaTBqR2Y2V1hOSScvLyDotK3kubDmiJDlip/pgJrnn6Vcbn1cblxuLyoqIOaOqOmAgeaooeadv+acjeWKoSAqL1xuZXhwb3J0IGNvbnN0IHB1c2hfdGVtcGxhdGUgPSB7XG4gICAgYnV5UGluOiB7XG4gICAgICAgIGRlc2M6ICfmi7zlm6LmiJDlip/pgJrnn6XvvJrmi7zlm6LnirbmgIHjgIHmiJDlm6LmnaHku7YnLFxuICAgICAgICBleGFtcGxlOiAn5ou85Zui5oiQ5Yqf77yB5oGt5Zac5oKo55yB5LqGeHjlhYPvvIE75oKo5ZKM5YW25LuW5Lq65Lmw5LqG5ZCM5qy+5ou85Zui5ZWG5ZOB77yM54K55Ye75p+l55yLJyxcbiAgICAgICAgZXhhbXBsZTI6ICfmga3llpzmi7zlm6LmiJDlip/vvIHmgqjotK3kubDnmoTllYblk4Hlj6/lh48ke2RlbHRhfeWFgyHmnInkurrkuI7kvaDkubDkuoblkIzmrL7mi7zlm6LnmoTllYblk4HvvIzngrnlh7vmn6XnnIsnLFxuICAgICAgICB2YWx1ZTogJ1ZkQ3RaTHFiYXdpSEMxRURZM2sxWHVWVDMwQ00zNE1fbFNrV05tT05sSWcnXG4gICAgfSxcbiAgICB3YWl0UGluOiB7XG4gICAgICAgIGRlc2M6ICfmi7zlm6LlvoXmiJDlm6Lmj5DphpLvvJpcdOWkh+azqOOAgea4qemmqOaPkOekuicsXG4gICAgICAgIGV4YW1wbGU6ICfmgqjotK3kubDnmoTllYblk4Hlj6/lj4LliqDmi7zlm6LvvIHvvJvnq4vljbPlj4LliqDmi7zlm6LvvIzlj6/ku6Xlho3nnIF4eOWFg++8gScsXG4gICAgICAgIHZhbHVlOiAnR09UNVBjeEQzS0RZck8xWW5FWHVHbU5kekJyck11T1NMUDZ2VUpCVG15SSdcbiAgICB9LFxuICAgIGJ1eToge1xuICAgICAgICBkZXNjOiAn6LSt5Lmw5oiQ5Yqf6YCa55+l77ya5aSH5rOo44CB5pe26Ze0JyxcbiAgICAgICAgZXhhbXBsZTogJ+S4i+WNleaIkOWKn++8geS8muWwveW/q+mHh+i0re+9nu+8m3jmnIh45pelIDE1OjAwJyxcbiAgICAgICAgdmFsdWU6ICc3VER1RmtTVnRWVUxUd0FlYmN4bXNHdWQ3ZGVZWXMzU2VIcmZfdldubHZZJ1xuICAgIH0sXG4gICAgZ2V0TW9uZXk6IHtcbiAgICAgICAgZGVzYzogJ+WwvuasvuaUr+S7mOaPkOmGku+8mua4qemmqOaPkOekuuOAgeaIquatouaXtumXtCcsXG4gICAgICAgIGV4YW1wbGU6ICfmlK/ku5jlsL7mrL7vvIznq4vljbPlj5HotKflk6bvvJvotorlv6votorlpb0nLFxuICAgICAgICB2YWx1ZTogJ21nbXNDZUZLMXcxdlJvbTNNd3dJQ1NzMmNzUzdRaVdWTVhGTVB0RVF2U2MnXG4gICAgfSwgXG4gICAgbmV3T3JkZXI6IHtcbiAgICAgICAgZGVzYzogJ+aWsOiuouWNlemAmuefpe+8muiuouWNleivpuaDheOAgeiuouWNleeKtuaAgScsXG4gICAgICAgIGV4YW1wbGU6ICfkvaDmnIl45p2h5paw6K6i5Y2V77yb54K55Ye75p+l55yLJyxcbiAgICAgICAgdmFsdWU6ICdhQmplT2pCSDhacDlCNjBGd0ViSkt2d0taRl9JSkVCS1F0V1JNU2FlY3JRJ1xuICAgIH1cbn07XG5cbi8qKiDlvq7kv6HmlK/ku5ggKi9cbmV4cG9ydCBjb25zdCB3eFBheSA9IHtcbiAgICBtY2hfaWQ6ICcxNTM0MDYwMjMxJywgLy8g5ZWG5oi35Y+3XG4gICAga2V5OiAnYTkyMDA2MjUwYjRjYTkyNDdjMDJlZGNlNjlmNmEyMWEnLCAvLyDov5nkuKrmmK/llYbmiLflj7forr7nva7nmoRrZXlcbiAgICBib2R5OiAn5b6u5L+h5pSv5LuYJywgLy8g566A5Y2V5o+P6L+wXG4gICAgYXR0YWNoOiAnYW55dGhpbmcnLCAvLyDpmYTliqDmlbDmja5cbiAgICBub3RpZnlfdXJsOiAnaHR0cHM6Ly93aGF0ZXZlci5jb20vbm90aWZ5JywgLy8g5Zue6LCDXG4gICAgc3BiaWxsX2NyZWF0ZV9pcDogJzExOC44OS40MC4yMDAnXG59XG5cbi8qKiDmlbDmja7lupMgKi9cbmV4cG9ydCBjb25zdCBjb2xsZWN0aW9ucyA9IFtcbiAgICAnYWN0aXZpdHknLFxuICAgICdhZGRyZXNzJyxcbiAgICAnZGVsaXZlci1mZWUnLFxuICAgICdhcHAtY29uZmlnJyxcbiAgICAnbGlrZS1jb2xsZWN0aW9uJyxcbiAgICAnY2FydCcsXG4gICAgJ2RpYycsXG4gICAgJ3VzZXInLFxuICAgICdtYW5hZ2VyLXd4LWluZm8nLFxuICAgICdvcmRlcicsXG4gICAgJ2NvdXBvbicsXG4gICAgJ2dvb2RzJyxcbiAgICAnc2hvcHBpbmctbGlzdCcsXG4gICAgJ3RyaXAnLFxuICAgICdzdGFuZGFyZHMnLFxuICAgICdkZWxpdmVyJyxcbiAgICAnYXV0aHBzdycsXG4gICAgJ21hbmFnZXItbWVtYmVyJyxcbiAgICAnZm9ybS1pZHMnLFxuICAgICdhbmFseXNlLWRhdGEnXG5dO1xuXG4vKiog5p2D6ZmQ5qih5Z2XICovXG5leHBvcnQgY29uc3QgYXV0aCA9IHtcbiAgICBzYWx0OiAnaHpwaXNiZXN0J1xufVxuXG4vKiog5pWw5o2u5a2X5YW4ICovXG5leHBvcnQgY29uc3QgZGljID0gZGljQ29uZjtcblxuLyoqIOW6lOeUqOmFjee9riAqL1xuZXhwb3J0IGNvbnN0IGFwcENvbmZzID0gYXBwQ29uZjsiXX0=