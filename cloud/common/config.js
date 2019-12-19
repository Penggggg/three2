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
        example2: '昨晚有x人浏览它，有x人成功拼团。',
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
        example2: '【名称】；关闭行程成功，一键收款功能已开启',
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
        example3: '【名称】；【时间】开始采购，拼团越优惠',
    },
    hongbao: {
        desc: '领取成功通知：领取金额、适用范围',
        value: 'I_yZjUxTJklPGDVrB-btt82F5z687_2cpTx1Mie_t9A',
        example: '恭喜获得红包【金额】元；趁早下单！无门槛立减【金额】元',
        example4: '恭喜！获得【金额】现金积分；推广成功！有人购买了你分享的商品'
    }
};
exports.subscribe_templates = {
    buyPin: {
        textKeys: ['thing4', 'thing1'],
        desc: '拼团成功通知	温馨提示、商品名称',
        id: 'yBBlVH0qvipvzSr93d-Own-cYkTnATjUBhd_Qi1L2vc'
    },
    hongbao: {
        textKeys: ['thing9', 'thing7'],
        desc: '开奖结果通知：开奖结果、开奖内容',
        id: 'rau9z8QU48gWel5Jn8hLt6-ChVWi8puo8E_QXR1CgMc'
    },
    waitPin: {
        textKeys: ['thing4', 'thing1'],
        desc: '拼团进度通知	温馨提示、商品名称',
        id: 'CC0DCPLC3SFVr1Im7ODEhRnlyMZVB8RIJSmptmLmC_U'
    },
    buy: {
        textKeys: ['thing7', 'thing5'],
        desc: '订单状态通知： 订单状态、备注',
        id: 'hAU2bG9eeGDr0KeOIcM_Sq0JbIlcA6Jfcex2HhX8OWI'
    },
    trip: {
        textKeys: ['thing11', 'thing6'],
        desc: '活动开始提醒：温馨提示、活动内容',
        id: 'u91Cqoo76phn_0o5N_Jdqz62rry4UdyIR6SyjRsZy0w'
    },
    getMoney: {
        textKeys: ['thing3', 'thing1'],
        desc: '尾款支付提醒	温馨提示、商品清单',
        id: 'is_8EPAO0WvaKoG7eDdLcBRZdGDowX2sgnmIAGGhOY0'
    },
    newOrder: {
        textKeys: ['thing8', 'thing4'],
        desc: '新订单提醒: 订单状态、购买商品',
        id: 'Onl9TTI33fTvg5K7AHydhHjk_NPmFLDGsMMxcDXE2rk'
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
    'share-record',
    'integral-use-record',
    'push-timer',
    'good-visiting-record'
];
exports.auth = {
    salt: 'hzpisbest'
};
exports.dic = dic_1.default;
exports.appConfs = app_config_1.default;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29uZmlnLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiY29uZmlnLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsNkJBQTRCO0FBQzVCLDJDQUFtQztBQUd0QixRQUFBLEdBQUcsR0FBRztJQUNmLEVBQUUsRUFBRSxvQkFBb0I7SUFDeEIsT0FBTyxFQUFFLGtDQUFrQztDQUM5QyxDQUFBO0FBR1ksUUFBQSxxQkFBcUIsR0FBRztJQUNqQyxTQUFTLEVBQUUsNkNBQTZDO0NBQzNELENBQUE7QUFHWSxRQUFBLGFBQWEsR0FBRztJQUN6QixNQUFNLEVBQUU7UUFDSixJQUFJLEVBQUUsa0JBQWtCO1FBQ3hCLE9BQU8sRUFBRSxtQ0FBbUM7UUFDNUMsUUFBUSxFQUFFLDZDQUE2QztRQUN2RCxLQUFLLEVBQUUsNkNBQTZDO0tBQ3ZEO0lBQ0QsT0FBTyxFQUFFO1FBQ0wsSUFBSSxFQUFFLGtCQUFrQjtRQUN4QixPQUFPLEVBQUUsOEJBQThCO1FBQ3ZDLFFBQVEsRUFBRSxtQkFBbUI7UUFDN0IsS0FBSyxFQUFFLDZDQUE2QztLQUN2RDtJQUNELEdBQUcsRUFBRTtRQUNELElBQUksRUFBRSxjQUFjO1FBQ3BCLE9BQU8sRUFBRSx3QkFBd0I7UUFDakMsS0FBSyxFQUFFLDZDQUE2QztLQUN2RDtJQUNELFFBQVEsRUFBRTtRQUNOLElBQUksRUFBRSxrQkFBa0I7UUFDeEIsT0FBTyxFQUFFLGlCQUFpQjtRQUMxQixRQUFRLEVBQUUsdUJBQXVCO1FBQ2pDLEtBQUssRUFBRSw2Q0FBNkM7S0FDdkQ7SUFDRCxRQUFRLEVBQUU7UUFDTixJQUFJLEVBQUUsaUJBQWlCO1FBQ3ZCLE9BQU8sRUFBRSxjQUFjO1FBQ3ZCLEtBQUssRUFBRSw2Q0FBNkM7S0FDdkQ7SUFDRCxJQUFJLEVBQUU7UUFDRixJQUFJLEVBQUUsZ0JBQWdCO1FBQ3RCLEtBQUssRUFBRSw2Q0FBNkM7UUFDcEQsT0FBTyxFQUFFLG9CQUFvQjtRQUM3QixRQUFRLEVBQUUscUJBQXFCO0tBQ2xDO0lBQ0QsT0FBTyxFQUFFO1FBQ0wsSUFBSSxFQUFFLGtCQUFrQjtRQUN4QixLQUFLLEVBQUUsNkNBQTZDO1FBQ3BELE9BQU8sRUFBRSw2QkFBNkI7UUFDdEMsUUFBUSxFQUFFLGdDQUFnQztLQUM3QztDQUNKLENBQUM7QUFrQlcsUUFBQSxtQkFBbUIsR0FBRztJQUMvQixNQUFNLEVBQUU7UUFDSixRQUFRLEVBQUUsQ0FBQyxRQUFRLEVBQUUsUUFBUSxDQUFDO1FBQzlCLElBQUksRUFBRSxrQkFBa0I7UUFDeEIsRUFBRSxFQUFFLDZDQUE2QztLQUNwRDtJQUNELE9BQU8sRUFBRTtRQUNMLFFBQVEsRUFBRSxDQUFDLFFBQVEsRUFBRSxRQUFRLENBQUM7UUFDOUIsSUFBSSxFQUFFLGtCQUFrQjtRQUN4QixFQUFFLEVBQUUsNkNBQTZDO0tBQ3BEO0lBQ0QsT0FBTyxFQUFFO1FBQ0wsUUFBUSxFQUFFLENBQUMsUUFBUSxFQUFFLFFBQVEsQ0FBQztRQUM5QixJQUFJLEVBQUUsa0JBQWtCO1FBQ3hCLEVBQUUsRUFBRSw2Q0FBNkM7S0FDcEQ7SUFDRCxHQUFHLEVBQUU7UUFDRCxRQUFRLEVBQUUsQ0FBQyxRQUFRLEVBQUUsUUFBUSxDQUFDO1FBQzlCLElBQUksRUFBRSxpQkFBaUI7UUFDdkIsRUFBRSxFQUFFLDZDQUE2QztLQUNwRDtJQUNELElBQUksRUFBRTtRQUNGLFFBQVEsRUFBRSxDQUFDLFNBQVMsRUFBRSxRQUFRLENBQUM7UUFDL0IsSUFBSSxFQUFFLGtCQUFrQjtRQUN4QixFQUFFLEVBQUUsNkNBQTZDO0tBQ3BEO0lBQ0QsUUFBUSxFQUFFO1FBQ04sUUFBUSxFQUFFLENBQUMsUUFBUSxFQUFFLFFBQVEsQ0FBQztRQUM5QixJQUFJLEVBQUUsa0JBQWtCO1FBQ3hCLEVBQUUsRUFBRSw2Q0FBNkM7S0FDcEQ7SUFDRCxRQUFRLEVBQUU7UUFDTixRQUFRLEVBQUUsQ0FBQyxRQUFRLEVBQUUsUUFBUSxDQUFDO1FBQzlCLElBQUksRUFBRSxrQkFBa0I7UUFDeEIsRUFBRSxFQUFFLDZDQUE2QztLQUNwRDtDQUNKLENBQUM7QUFHVyxRQUFBLEtBQUssR0FBRztJQUNqQixNQUFNLEVBQUUsWUFBWTtJQUNwQixHQUFHLEVBQUUsa0NBQWtDO0lBQ3ZDLElBQUksRUFBRSxNQUFNO0lBQ1osTUFBTSxFQUFFLFVBQVU7SUFDbEIsVUFBVSxFQUFFLDZCQUE2QjtJQUN6QyxnQkFBZ0IsRUFBRSxlQUFlO0NBQ3BDLENBQUE7QUFHWSxRQUFBLFdBQVcsR0FBRztJQUN2QixVQUFVO0lBQ1YsU0FBUztJQUNULGFBQWE7SUFDYixZQUFZO0lBQ1osaUJBQWlCO0lBQ2pCLE1BQU07SUFDTixLQUFLO0lBQ0wsTUFBTTtJQUNOLGlCQUFpQjtJQUNqQixPQUFPO0lBQ1AsUUFBUTtJQUNSLE9BQU87SUFDUCxlQUFlO0lBQ2YsTUFBTTtJQUNOLFdBQVc7SUFDWCxTQUFTO0lBQ1QsU0FBUztJQUNULGdCQUFnQjtJQUNoQixVQUFVO0lBQ1YsY0FBYztJQUNkLGNBQWM7SUFDZCxxQkFBcUI7SUFDckIsWUFBWTtJQUNaLHNCQUFzQjtDQUN6QixDQUFDO0FBR1csUUFBQSxJQUFJLEdBQUc7SUFDaEIsSUFBSSxFQUFFLFdBQVc7Q0FDcEIsQ0FBQTtBQUdZLFFBQUEsR0FBRyxHQUFHLGFBQU8sQ0FBQztBQUdkLFFBQUEsUUFBUSxHQUFHLG9CQUFPLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgZGljQ29uZiBmcm9tICcuL2RpYyc7XG5pbXBvcnQgYXBwQ29uZiBmcm9tICcuL2FwcC1jb25maWcnO1xuXG4vKiogYXBwICovXG5leHBvcnQgY29uc3QgYXBwID0ge1xuICAgIGlkOiAnd3g2MGJmN2Y3NDVjZTMxZWYwJyxcbiAgICBzZWNyZWN0OiAnNmM4ZmYzMTQ4OWNjZTdkZDRlZGYwYjE4NDNiN2IwZjUnXG59XG5cbi8qKiDmjqjpgIHmqKHniYggKi9cbmV4cG9ydCBjb25zdCBub3RpZmljYXRpb25fdGVtcGxhdGUgPSB7XG4gICAgZ2V0TW9uZXkzOiAnZkN2Q3JZOF81bDYwc3ZQZ2xNdlFkTzFzdWxBWlFVVGNPdDNoZHRyRElzdycvLyDkuJrliqHlj5fnkIbpgJrnn6Vcbn1cblxuLyoqIOaOqOmAgeaooeadv+acjeWKoSAqL1xuZXhwb3J0IGNvbnN0IHB1c2hfdGVtcGxhdGUgPSB7XG4gICAgYnV5UGluOiB7XG4gICAgICAgIGRlc2M6ICfmi7zlm6LmiJDlip/pgJrnn6XvvJrmi7zlm6LnirbmgIHjgIHmiJDlm6LmnaHku7YnLFxuICAgICAgICBleGFtcGxlOiAn5ou85Zui5oiQ5Yqf77yB5oGt5Zac5oKo55yB5LqGeHjlhYPvvIE75oKo5ZKM5YW25LuW5Lq65Lmw5LqG5ZCM5qy+5ou85Zui5ZWG5ZOB77yM54K55Ye75p+l55yLJyxcbiAgICAgICAgZXhhbXBsZTI6ICfmga3llpzmi7zlm6LmiJDlip/vvIHmgqjotK3kubDnmoTllYblk4Hlj6/lh48ke2RlbHRhfeWFgyHmnInkurrkuI7kvaDkubDkuoblkIzmrL7mi7zlm6LnmoTllYblk4HvvIzngrnlh7vmn6XnnIsnLFxuICAgICAgICB2YWx1ZTogJ2FPTkt0eHF1bTFKbjE1aktWT1ZHcU56Q1NmQTBmX242al8wQkxBU1lDRGcnXG4gICAgfSxcbiAgICB3YWl0UGluOiB7XG4gICAgICAgIGRlc2M6ICfmi7zlm6LlvoXmiJDlm6Lmj5DphpLvvJpcdOWkh+azqOOAgea4qemmqOaPkOekuicsXG4gICAgICAgIGV4YW1wbGU6ICfmgqjotK3kubDnmoTllYblk4Hlj6/lj4LliqDmi7zlm6LvvIHvvJvnq4vljbPlj4LliqDmi7zlm6LvvIzlj6/ku6Xlho3nnIF4eOWFg++8gScsXG4gICAgICAgIGV4YW1wbGUyOiAn5pio5pma5pyJeOS6uua1j+iniOWug++8jOaciXjkurrmiJDlip/mi7zlm6LjgIInLFxuICAgICAgICB2YWx1ZTogJ210VExJcDJDLUZRODd5bjQ2anBZM2NIOWlsR0l6TDQzNE4yUWxVUzBNSDAnXG4gICAgfSxcbiAgICBidXk6IHtcbiAgICAgICAgZGVzYzogJ+i0reS5sOaIkOWKn+mAmuefpe+8muWkh+azqOOAgeaXtumXtCcsXG4gICAgICAgIGV4YW1wbGU6ICfkuIvljZXmiJDlip/vvIHkvJrlsL3lv6vph4fotK3vvZ7vvJt45pyIeOaXpSAxNTowMCcsXG4gICAgICAgIHZhbHVlOiAnZldqNnlhX0puOExOYjdXMkR1MzVaY3NXd0J2ZUF5MnBqZ3p4OHhDaGpoaydcbiAgICB9LFxuICAgIGdldE1vbmV5OiB7XG4gICAgICAgIGRlc2M6ICflsL7mrL7mlK/ku5jmj5DphpLvvJrmuKnppqjmj5DnpLrjgIHmiKrmraLml7bpl7QnLFxuICAgICAgICBleGFtcGxlOiAn5pSv5LuY5bC+5qy+77yM56uL5Y2z5Y+R6LSn5ZOm77yb6LaK5b+r6LaK5aW9JyxcbiAgICAgICAgZXhhbXBsZTI6ICfjgJDlkI3np7DjgJHvvJvlhbPpl63ooYznqIvmiJDlip/vvIzkuIDplK7mlLbmrL7lip/og73lt7LlvIDlkK8nLFxuICAgICAgICB2YWx1ZTogJ3FLd0Y4Y2FZUUFESjZsVGNuRVRleHkwaHFpMTFTcTFkaGtzTk9IQnFPZFEnXG4gICAgfSwgXG4gICAgbmV3T3JkZXI6IHtcbiAgICAgICAgZGVzYzogJ+aWsOiuouWNlemAmuefpe+8muiuouWNleivpuaDheOAgeiuouWNleeKtuaAgScsXG4gICAgICAgIGV4YW1wbGU6ICfkvaDmnIl45p2h5paw6K6i5Y2V77yb54K55Ye75p+l55yLJyxcbiAgICAgICAgdmFsdWU6ICdUUW1sQ250a0RjMWE4Q3VvRVA5Z05EREFoT0pWZjRRVFBwY2ZXTGYwc3ZRJ1xuICAgIH0sXG4gICAgdHJpcDoge1xuICAgICAgICBkZXNjOiAn6KGM56iL5o+Q6YaS77ya6KGM56iL5ZCN56ew44CB6KGM56iL5aSH5rOoJyxcbiAgICAgICAgdmFsdWU6ICdYb1hZOFhXZjZFaXltVzd0WURQa0hERDRWY2RoLUJxUDF5Y1hiUGtvLVpVJyxcbiAgICAgICAgZXhhbXBsZTogJ+OAkOWQjeensOOAke+8m+WPkeW4g+aIkOWKn++8jOW5tuW8gOmAmuaWsOiuouWNleaOqOmAgScsXG4gICAgICAgIGV4YW1wbGUzOiAn44CQ5ZCN56ew44CR77yb44CQ5pe26Ze044CR5byA5aeL6YeH6LSt77yM5ou85Zui6LaK5LyY5oOgJyxcbiAgICB9LFxuICAgIGhvbmdiYW86IHtcbiAgICAgICAgZGVzYzogJ+mihuWPluaIkOWKn+mAmuefpe+8mumihuWPlumHkemineOAgemAgueUqOiMg+WbtCcsXG4gICAgICAgIHZhbHVlOiAnSV95WmpVeFRKa2xQR0RWckItYnR0ODJGNXo2ODdfMmNwVHgxTWllX3Q5QScsXG4gICAgICAgIGV4YW1wbGU6ICfmga3llpzojrflvpfnuqLljIXjgJDph5Hpop3jgJHlhYPvvJvotoHml6nkuIvljZXvvIHml6Dpl6jmp5vnq4vlh4/jgJDph5Hpop3jgJHlhYMnLFxuICAgICAgICBleGFtcGxlNDogJ+aBreWWnO+8geiOt+W+l+OAkOmHkemineOAkeeOsOmHkeenr+WIhu+8m+aOqOW5v+aIkOWKn++8geacieS6uui0reS5sOS6huS9oOWIhuS6q+eahOWVhuWTgSdcbiAgICB9XG59O1xuXG4vKiogXG4gKiDorqLpmIXmnI3liqHnsbvlnosgXG4gKiBcbiAqIHsgdGhpbmcgfSAyMOS4quS7peWGheWtl+espiAgIOWPr+axieWtl+OAgeaVsOWtl+OAgeWtl+avjeaIluespuWPt+e7hOWQiFxuICogeyBudW1iZXIgfSAzMuS9jeS7peWGheaVsOWtl1x05Y+q6IO95pWw5a2X77yM5Y+v5bim5bCP5pWwXG4gKiB7IGxldHRlciB9IDMy5L2N5Lul5YaF5a2X5q+NXHTlj6rog73lrZfmr41cbiAqIHsgc3ltYm9sIH0gNeS9jeS7peWGheespuWPt1x05Y+q6IO956ym5Y+3XG4gKiB7IGNoYXJhY3Rlcl9zdHJpbmcgfSAzMuS9jeS7peWGheaVsOWtl+OAgeWtl+avjeaIluespuWPt1x05Y+v5pWw5a2X44CB5a2X5q+N5oiW56ym5Y+357uE5ZCIXG4gKiB7IHRpbWUgfSAyNOWwj+aXtuWItuaXtumXtOagvOW8j++8iOaUr+aMgSvlubTmnIjml6XvvIlcdOS+i+Wmgu+8mjE1OjAx77yM5oiW77yaMjAxOeW5tDEw5pyIMeaXpSAxNTowMVxuICogeyBkYXRlIH0g5bm05pyI5pel5qC85byP77yI5pSv5oyBKzI05bCP5pe25Yi25pe26Ze077yJXHTkvovlpoLvvJoyMDE55bm0MTDmnIgx5pel77yM5oiW77yaMjAxOeW5tDEw5pyIMeaXpSAxNTowMVxuICogeyBhbW91bnQgfSAx5Liq5biB56eN56ym5Y+3KzEw5L2N5Lul5YaF57qv5pWw5a2X77yM5Y+v5bim5bCP5pWw77yM57uT5bC+5Y+v5bim4oCc5YWD4oCdXHTlj6/luKblsI/mlbBcbiAqIHsgcGhvbmVfbnVtYmVyIH0gMTfkvY3ku6XlhoXvvIzmlbDlrZfjgIHnrKblj7dcdOeUteivneWPt+egge+8jOS+i++8mis4Ni0wNzY2LTY2ODg4ODY2XG4gKiB7IGNhcl9udW1iZXIgfSA45L2N5Lul5YaF77yM56ys5LiA5L2N5LiO5pyA5ZCO5LiA5L2N5Y+v5Li65rGJ5a2X77yM5YW25L2Z5Li65a2X5q+N5oiW5pWw5a2XXHTovabniYzlj7fnoIHvvJrnsqRBOFo4ODjmjIJcbiAqIHsgbmFtZSB9IDEw5Liq5Lul5YaF57qv5rGJ5a2X5oiWMjDkuKrku6XlhoXnuq/lrZfmr43miJbnrKblj7dcdOS4reaWh+WQjTEw5Liq5rGJ5a2X5YaF77yb57qv6Iux5paH5ZCNMjDkuKrlrZfmr43lhoXvvJvkuK3mloflkozlrZfmr43mt7flkIjmjInkuK3mloflkI3nrpfvvIwxMOS4quWtl+WGhVxuICogeyBwaHJhc2UgfTXkuKrku6XlhoXmsYnlrZdcdDXkuKrku6XlhoXnuq/msYnlrZfvvIzkvovlpoLvvJrphY3pgIHkuK1cbiAqL1xuZXhwb3J0IGNvbnN0IHN1YnNjcmliZV90ZW1wbGF0ZXMgPSB7XG4gICAgYnV5UGluOiB7XG4gICAgICAgIHRleHRLZXlzOiBbJ3RoaW5nNCcsICd0aGluZzEnXSxcbiAgICAgICAgZGVzYzogJ+aLvOWbouaIkOWKn+mAmuefpVx05rip6aao5o+Q56S644CB5ZWG5ZOB5ZCN56ewJyxcbiAgICAgICAgaWQ6ICd5QkJsVkgwcXZpcHZ6U3I5M2QtT3duLWNZa1RuQVRqVUJoZF9RaTFMMnZjJ1xuICAgIH0sXG4gICAgaG9uZ2Jhbzoge1xuICAgICAgICB0ZXh0S2V5czogWyd0aGluZzknLCAndGhpbmc3J10sXG4gICAgICAgIGRlc2M6ICflvIDlpZbnu5PmnpzpgJrnn6XvvJrlvIDlpZbnu5PmnpzjgIHlvIDlpZblhoXlrrknLFxuICAgICAgICBpZDogJ3JhdTl6OFFVNDhnV2VsNUpuOGhMdDYtQ2hWV2k4cHVvOEVfUVhSMUNnTWMnXG4gICAgfSxcbiAgICB3YWl0UGluOiB7XG4gICAgICAgIHRleHRLZXlzOiBbJ3RoaW5nNCcsICd0aGluZzEnXSxcbiAgICAgICAgZGVzYzogJ+aLvOWboui/m+W6pumAmuefpVx05rip6aao5o+Q56S644CB5ZWG5ZOB5ZCN56ewJyxcbiAgICAgICAgaWQ6ICdDQzBEQ1BMQzNTRlZyMUltN09ERWhSbmx5TVpWQjhSSUpTbXB0bUxtQ19VJ1xuICAgIH0sXG4gICAgYnV5OiB7XG4gICAgICAgIHRleHRLZXlzOiBbJ3RoaW5nNycsICd0aGluZzUnXSxcbiAgICAgICAgZGVzYzogJ+iuouWNleeKtuaAgemAmuefpe+8miDorqLljZXnirbmgIHjgIHlpIfms6gnLFxuICAgICAgICBpZDogJ2hBVTJiRzllZUdEcjBLZU9JY01fU3EwSmJJbGNBNkpmY2V4MkhoWDhPV0knXG4gICAgfSxcbiAgICB0cmlwOiB7XG4gICAgICAgIHRleHRLZXlzOiBbJ3RoaW5nMTEnLCAndGhpbmc2J10sXG4gICAgICAgIGRlc2M6ICfmtLvliqjlvIDlp4vmj5DphpLvvJrmuKnppqjmj5DnpLrjgIHmtLvliqjlhoXlrrknLFxuICAgICAgICBpZDogJ3U5MUNxb283NnBobl8wbzVOX0pkcXo2MnJyeTRVZHlJUjZTeWpSc1p5MHcnXG4gICAgfSxcbiAgICBnZXRNb25leToge1xuICAgICAgICB0ZXh0S2V5czogWyd0aGluZzMnLCAndGhpbmcxJ10sXG4gICAgICAgIGRlc2M6ICflsL7mrL7mlK/ku5jmj5DphpJcdOa4qemmqOaPkOekuuOAgeWVhuWTgea4heWNlScsXG4gICAgICAgIGlkOiAnaXNfOEVQQU8wV3ZhS29HN2VEZExjQlJaZEdEb3dYMnNnbm1JQUdHaE9ZMCdcbiAgICB9LCBcbiAgICBuZXdPcmRlcjoge1xuICAgICAgICB0ZXh0S2V5czogWyd0aGluZzgnLCAndGhpbmc0J10sXG4gICAgICAgIGRlc2M6ICfmlrDorqLljZXmj5DphpI6IOiuouWNleeKtuaAgeOAgei0reS5sOWVhuWTgScsXG4gICAgICAgIGlkOiAnT25sOVRUSTMzZlR2ZzVLN0FIeWRoSGprX05QbUZMREdzTU14Y0RYRTJyaydcbiAgICB9XG59O1xuXG4vKiog5b6u5L+h5pSv5LuYICovXG5leHBvcnQgY29uc3Qgd3hQYXkgPSB7XG4gICAgbWNoX2lkOiAnMTUyMTUyMjc4MScsIC8vIOWVhuaIt+WPt1xuICAgIGtleTogJ2E5MjAwNjI1MGI0Y2E5MjQ3YzAyZWRjZTY5ZjZhMjFhJywgLy8g6L+Z5Liq5piv5ZWG5oi35Y+36K6+572u55qEa2V5XG4gICAgYm9keTogJ+W+ruS/oeaUr+S7mCcsIC8vIOeugOWNleaPj+i/sFxuICAgIGF0dGFjaDogJ2FueXRoaW5nJywgLy8g6ZmE5Yqg5pWw5o2uXG4gICAgbm90aWZ5X3VybDogJ2h0dHBzOi8vd2hhdGV2ZXIuY29tL25vdGlmeScsIC8vIOWbnuiwg1xuICAgIHNwYmlsbF9jcmVhdGVfaXA6ICcxMTguODkuNDAuMjAwJ1xufVxuXG4vKiog5pWw5o2u5bqTICovXG5leHBvcnQgY29uc3QgY29sbGVjdGlvbnMgPSBbXG4gICAgJ2FjdGl2aXR5JyxcbiAgICAnYWRkcmVzcycsXG4gICAgJ2RlbGl2ZXItZmVlJyxcbiAgICAnYXBwLWNvbmZpZycsXG4gICAgJ2xpa2UtY29sbGVjdGlvbicsXG4gICAgJ2NhcnQnLFxuICAgICdkaWMnLFxuICAgICd1c2VyJyxcbiAgICAnbWFuYWdlci13eC1pbmZvJyxcbiAgICAnb3JkZXInLFxuICAgICdjb3Vwb24nLFxuICAgICdnb29kcycsXG4gICAgJ3Nob3BwaW5nLWxpc3QnLFxuICAgICd0cmlwJyxcbiAgICAnc3RhbmRhcmRzJyxcbiAgICAnZGVsaXZlcicsXG4gICAgJ2F1dGhwc3cnLFxuICAgICdtYW5hZ2VyLW1lbWJlcicsXG4gICAgJ2Zvcm0taWRzJyxcbiAgICAnYW5hbHlzZS1kYXRhJyxcbiAgICAnc2hhcmUtcmVjb3JkJyxcbiAgICAnaW50ZWdyYWwtdXNlLXJlY29yZCcsXG4gICAgJ3B1c2gtdGltZXInLFxuICAgICdnb29kLXZpc2l0aW5nLXJlY29yZCdcbl07XG5cbi8qKiDmnYPpmZDmqKHlnZcgKi9cbmV4cG9ydCBjb25zdCBhdXRoID0ge1xuICAgIHNhbHQ6ICdoenBpc2Jlc3QnXG59XG5cbi8qKiDmlbDmja7lrZflhbggKi9cbmV4cG9ydCBjb25zdCBkaWMgPSBkaWNDb25mO1xuXG4vKiog5bqU55So6YWN572uICovXG5leHBvcnQgY29uc3QgYXBwQ29uZnMgPSBhcHBDb25mOyJdfQ==