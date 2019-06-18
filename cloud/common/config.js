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
        example2: '恭喜拼团成功！您买的商品自动减x元！;有人买了和你一样的商品，点击查看',
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29uZmlnLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiY29uZmlnLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsNkJBQTRCO0FBQzVCLDJDQUFtQztBQUd0QixRQUFBLEdBQUcsR0FBRztJQUNmLEVBQUUsRUFBRSxvQkFBb0I7SUFDeEIsT0FBTyxFQUFFLGtDQUFrQztDQUM5QyxDQUFBO0FBR1ksUUFBQSxxQkFBcUIsR0FBRztJQUNqQyxTQUFTLEVBQUUsNkNBQTZDO0NBQzNELENBQUE7QUFHWSxRQUFBLGFBQWEsR0FBRztJQUN6QixNQUFNLEVBQUU7UUFDSixJQUFJLEVBQUUsa0JBQWtCO1FBQ3hCLE9BQU8sRUFBRSxvQ0FBb0M7UUFDN0MsUUFBUSxFQUFFLHFDQUFxQztRQUMvQyxLQUFLLEVBQUUsNkNBQTZDO0tBQ3ZEO0lBQ0QsT0FBTyxFQUFFO1FBQ0wsSUFBSSxFQUFFLGtCQUFrQjtRQUN4QixPQUFPLEVBQUUsOEJBQThCO1FBQ3ZDLEtBQUssRUFBRSw2Q0FBNkM7S0FDdkQ7SUFDRCxHQUFHLEVBQUU7UUFDRCxJQUFJLEVBQUUsY0FBYztRQUNwQixPQUFPLEVBQUUsd0JBQXdCO1FBQ2pDLEtBQUssRUFBRSw2Q0FBNkM7S0FDdkQ7SUFDRCxRQUFRLEVBQUU7UUFDTixJQUFJLEVBQUUsa0JBQWtCO1FBQ3hCLE9BQU8sRUFBRSxpQkFBaUI7UUFDMUIsS0FBSyxFQUFFLDZDQUE2QztLQUN2RDtDQUNKLENBQUM7QUFHVyxRQUFBLEtBQUssR0FBRztJQUNqQixNQUFNLEVBQUUsWUFBWTtJQUNwQixHQUFHLEVBQUUsa0NBQWtDO0lBQ3ZDLElBQUksRUFBRSxNQUFNO0lBQ1osTUFBTSxFQUFFLFVBQVU7SUFDbEIsVUFBVSxFQUFFLDZCQUE2QjtJQUN6QyxnQkFBZ0IsRUFBRSxlQUFlO0NBQ3BDLENBQUE7QUFHWSxRQUFBLFdBQVcsR0FBRztJQUN2QixVQUFVO0lBQ1YsU0FBUztJQUNULGFBQWE7SUFDYixZQUFZO0lBQ1osaUJBQWlCO0lBQ2pCLE1BQU07SUFDTixLQUFLO0lBQ0wsTUFBTTtJQUNOLGlCQUFpQjtJQUNqQixPQUFPO0lBQ1AsUUFBUTtJQUNSLE9BQU87SUFDUCxlQUFlO0lBQ2YsTUFBTTtJQUNOLFdBQVc7SUFDWCxTQUFTO0lBQ1QsU0FBUztJQUNULGdCQUFnQjtJQUNoQixVQUFVO0NBQ2IsQ0FBQztBQUdXLFFBQUEsSUFBSSxHQUFHO0lBQ2hCLElBQUksRUFBRSxXQUFXO0NBQ3BCLENBQUE7QUFHWSxRQUFBLEdBQUcsR0FBRyxhQUFPLENBQUM7QUFHZCxRQUFBLFFBQVEsR0FBRyxvQkFBTyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGRpY0NvbmYgZnJvbSAnLi9kaWMnO1xuaW1wb3J0IGFwcENvbmYgZnJvbSAnLi9hcHAtY29uZmlnJztcblxuLyoqIGFwcCAqL1xuZXhwb3J0IGNvbnN0IGFwcCA9IHtcbiAgICBpZDogJ3d4NjBiZjdmNzQ1Y2UzMWVmMCcsXG4gICAgc2VjcmVjdDogJzZjOGZmMzE0ODljY2U3ZGQ0ZWRmMGIxODQzYjdiMGY1J1xufVxuXG4vKiog5o6o6YCB5qih54mIICovXG5leHBvcnQgY29uc3Qgbm90aWZpY2F0aW9uX3RlbXBsYXRlID0ge1xuICAgIGdldE1vbmV5MzogJ2ZDdkNyWThfNWw2MHN2UGdsTXZRZE8xc3VsQVpRVVRjT3QzaGR0ckRJc3cnLy8g5Lia5Yqh5Y+X55CG6YCa55+lXG59XG5cbi8qKiDmjqjpgIHmqKHmnb/mnI3liqEgKi9cbmV4cG9ydCBjb25zdCBwdXNoX3RlbXBsYXRlID0ge1xuICAgIGJ1eVBpbjoge1xuICAgICAgICBkZXNjOiAn5ou85Zui5oiQ5Yqf6YCa55+l77ya5ou85Zui54q25oCB44CB5oiQ5Zui5p2h5Lu2JyxcbiAgICAgICAgZXhhbXBsZTogJ+aLvOWbouaIkOWKn++8geaBreWWnOaCqOecgeS6hnh45YWD77yBO+aCqOWSjOWFtuS7luS6uuS5sOS6huWQjOS4gOasvuaLvOWbouWVhuWTge+8jOeCueWHu+afpeeciycsXG4gICAgICAgIGV4YW1wbGUyOiAn5oGt5Zac5ou85Zui5oiQ5Yqf77yB5oKo5Lmw55qE5ZWG5ZOB6Ieq5Yqo5YePeOWFg++8gTvmnInkurrkubDkuoblkozkvaDkuIDmoLfnmoTllYblk4HvvIzngrnlh7vmn6XnnIsnLFxuICAgICAgICB2YWx1ZTogJ2FPTkt0eHF1bTFKbjE1aktWT1ZHcU56Q1NmQTBmX242al8wQkxBU1lDRGcnXG4gICAgfSxcbiAgICB3YWl0UGluOiB7XG4gICAgICAgIGRlc2M6ICfmi7zlm6LlvoXmiJDlm6Lmj5DphpLvvJpcdOWkh+azqOOAgea4qemmqOaPkOekuicsXG4gICAgICAgIGV4YW1wbGU6ICfmgqjotK3kubDnmoTllYblk4Hlj6/lj4LliqDmi7zlm6LvvIHvvJvnq4vljbPlj4LliqDmi7zlm6LvvIzlj6/ku6Xlho3nnIF4eOWFg++8gScsXG4gICAgICAgIHZhbHVlOiAnbXRUTElwMkMtRlE4N3luNDZqcFkzY0g5aWxHSXpMNDM0TjJRbFVTME1IMCdcbiAgICB9LFxuICAgIGJ1eToge1xuICAgICAgICBkZXNjOiAn6LSt5Lmw5oiQ5Yqf6YCa55+l77ya5aSH5rOo44CB5pe26Ze0JyxcbiAgICAgICAgZXhhbXBsZTogJ+S4i+WNleaIkOWKn++8geS8muWwveW/q+mHh+i0re+9nu+8m3jmnIh45pelIDE1OjAwJyxcbiAgICAgICAgdmFsdWU6ICdmV2o2eWFfSm44TE5iN1cyRHUzNVpjc1d3QnZlQXkycGpneng4eENoamhrJ1xuICAgIH0sXG4gICAgZ2V0TW9uZXk6IHtcbiAgICAgICAgZGVzYzogJ+WwvuasvuaUr+S7mOaPkOmGku+8mua4qemmqOaPkOekuuOAgeaIquatouaXtumXtCcsXG4gICAgICAgIGV4YW1wbGU6ICfmlK/ku5jlsL7mrL7vvIznq4vljbPlj5HotKflk6bvvJvotorlv6votorlpb0nLFxuICAgICAgICB2YWx1ZTogJ3FLd0Y4Y2FZUUFESjZsVGNuRVRleHkwaHFpMTFTcTFkaGtzTk9IQnFPZFEnXG4gICAgfVxufTtcblxuLyoqIOW+ruS/oeaUr+S7mCAqL1xuZXhwb3J0IGNvbnN0IHd4UGF5ID0ge1xuICAgIG1jaF9pZDogJzE1MjE1MjI3ODEnLCAvLyDllYbmiLflj7dcbiAgICBrZXk6ICdhOTIwMDYyNTBiNGNhOTI0N2MwMmVkY2U2OWY2YTIxYScsIC8vIOi/meS4quaYr+WVhuaIt+WPt+iuvue9rueahGtleVxuICAgIGJvZHk6ICflvq7kv6HmlK/ku5gnLCAvLyDnroDljZXmj4/ov7BcbiAgICBhdHRhY2g6ICdhbnl0aGluZycsIC8vIOmZhOWKoOaVsOaNrlxuICAgIG5vdGlmeV91cmw6ICdodHRwczovL3doYXRldmVyLmNvbS9ub3RpZnknLCAvLyDlm57osINcbiAgICBzcGJpbGxfY3JlYXRlX2lwOiAnMTE4Ljg5LjQwLjIwMCdcbn1cblxuLyoqIOaVsOaNruW6kyAqL1xuZXhwb3J0IGNvbnN0IGNvbGxlY3Rpb25zID0gW1xuICAgICdhY3Rpdml0eScsXG4gICAgJ2FkZHJlc3MnLFxuICAgICdkZWxpdmVyLWZlZScsXG4gICAgJ2FwcC1jb25maWcnLFxuICAgICdsaWtlLWNvbGxlY3Rpb24nLFxuICAgICdjYXJ0JyxcbiAgICAnZGljJyxcbiAgICAndXNlcicsXG4gICAgJ21hbmFnZXItd3gtaW5mbycsXG4gICAgJ29yZGVyJyxcbiAgICAnY291cG9uJyxcbiAgICAnZ29vZHMnLFxuICAgICdzaG9wcGluZy1saXN0JyxcbiAgICAndHJpcCcsXG4gICAgJ3N0YW5kYXJkcycsXG4gICAgJ2RlbGl2ZXInLFxuICAgICdhdXRocHN3JyxcbiAgICAnbWFuYWdlci1tZW1iZXInLFxuICAgICdmb3JtLWlkcydcbl07XG5cbi8qKiDmnYPpmZDmqKHlnZcgKi9cbmV4cG9ydCBjb25zdCBhdXRoID0ge1xuICAgIHNhbHQ6ICdoenBpc2Jlc3QnXG59XG5cbi8qKiDmlbDmja7lrZflhbggKi9cbmV4cG9ydCBjb25zdCBkaWMgPSBkaWNDb25mO1xuXG4vKiog5bqU55So6YWN572uICovXG5leHBvcnQgY29uc3QgYXBwQ29uZnMgPSBhcHBDb25mOyJdfQ==