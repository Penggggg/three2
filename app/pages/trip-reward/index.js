"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var http_js_1 = require("../../util/http.js");
var index_js_1 = require("../../lib/vuefy/index.js");
var route_js_1 = require("../../util/route.js");
var app = getApp();
var storageKey = 'trip-has-reward-list';
Page({
    data: {
        tid: '',
        openid: '',
        ipAvatar: '',
        isAuth: false,
        loading: true,
        swiperIndex: 0,
        showDanmu: false,
        list: [],
        showHongbao: 'hide',
        hasGet: true
    },
    runComputed: function () {
        index_js_1.computed(this, {
            social$: function () {
                var avatar = 'https://wx.qlogo.cn/mmopen/vi_32/IejMVZTG8WlibHicHIVQhqcNeC4uBxkzH0FFTbRLMicxib8wrxRRWoJY3gvctylATdmAPhiaVicU4sH0NptSszBdyHiaA/132';
                var getRandom = function (n) { return Math.floor(Math.random() * n); };
                var allTexts = [
                    "\u68D2! \u62FC\u56E2\u7684\u7FA4\u53CB\u771F\u7ED9\u529B",
                    "\u54C7! \u548C\u7FA4\u53CB\u62FC\u56E2\u597D\u5212\u7B97",
                    "\u54C8! \u4E0B\u6B21\u7EE7\u7EED\u7528\u7FA4\u62FC\u56E2"
                ];
                var visitors = [
                    avatar,
                    avatar
                ];
                var allVisitors = visitors
                    .map(function (x) {
                    var randomNum = getRandom(allTexts.length);
                    return {
                        avatar: x,
                        text: allTexts[randomNum]
                    };
                });
                return allVisitors;
            },
            others$: function () {
                var _this = this;
                var _a = this.data, list = _a.list, openid = _a.openid;
                var otherList = list
                    .filter(function (x) {
                    return !x.users.find(function (y) { return y.openid === openid; });
                })
                    .sort(function (x, y) {
                    return y.users.length - x.users.length;
                });
                var r = otherList.map(function (sl) { return _this.transferSl(sl); });
                return r;
            },
            personal$: function () {
                var _this = this;
                var _a = this.data, list = _a.list, openid = _a.openid;
                var allTexts = [
                    "\u771F\u7ED9\u529B",
                    "\u8C22\u8C22\u4F60",
                    "\u5212\u7B97\uFF5E",
                    "\u68D2!",
                    "\u8D5E!",
                    "\u8D5A!"
                ];
                var myList = list
                    .filter(function (x) {
                    return x.users.find(function (y) { return y.openid === openid; });
                })
                    .sort(function (x, y) {
                    return y.users.length - x.users.length;
                });
                var r = myList.map(function (sl) { return _this.transferSl(sl, allTexts); });
                return r;
            },
            summary$: function () {
                var _this = this;
                var _a = this.data, list = _a.list, openid = _a.openid;
                var allSl = list.map(function (sl) { return _this.transferSl(sl); });
                var mySL = list
                    .filter(function (x) {
                    return x.users.find(function (y) { return y.openid === openid; });
                })
                    .map(function (sl) { return _this.transferSl(sl); });
                var r = {
                    groupTotalDelta: allSl.reduce(function (x, y) { return x + y.totalDelta; }, 0),
                    myTotalDelta: mySL.reduce(function (x, y) { return x + y.successDelta; }, 0)
                };
                return r;
            },
            hongbao$: function () {
                var _a = this.data, list = _a.list, openid = _a.openid;
                var myList = list
                    .filter(function (x) {
                    return x.users.find(function (y) { return y.openid === openid; });
                });
                var hasBuy = myList.length > 0;
                var gift = hasBuy ? 1.24 : 0.88;
                var somePinSuccess = myList.some(function (x) { return x.users.length > 1; });
                var title = hasBuy && somePinSuccess ?
                    '拼团成功' :
                    hasBuy && !somePinSuccess ?
                        '莫灰心' :
                        '下次跟着拼';
                var summary = hasBuy && somePinSuccess ?
                    '请再接再厉~' :
                    hasBuy && !somePinSuccess ?
                        '差点就拼成!' :
                        '群拼团 省钱!';
                return {
                    gift: gift,
                    title: title,
                    summary: summary
                };
            }
        });
    },
    watchStore: function () {
        var _this = this;
        app.watch$('appConfig', function (val) {
            if (!!val) {
                _this.setTitle((val['ip-name'] || '') + "\u7FA4\u62FC\u56E2");
                _this.setData({
                    ipAvatar: "" + (val['ip-avatar'] || '')
                });
            }
        });
        app.watch$('openid', function (val) {
            !!val && _this.setData({
                openid: val
            });
        });
        app.watch$('isUserAuth', function (val) {
            if (val === undefined) {
                return;
            }
            _this.setData({
                isAuth: val
            });
        });
    },
    fetchShopping: function (tid) {
        var _this = this;
        if (!tid) {
            return;
        }
        http_js_1.http({
            url: 'shopping-list_pin',
            data: {
                tid: tid,
                detail: true,
                showUser: true
            },
            success: function (res) {
                var status = res.status, data = res.data;
                if (status !== 200) {
                    return;
                }
                _this.setData({
                    list: data,
                    loading: false,
                    showHongbao: 'show'
                });
            }
        });
    },
    fetchGetGift: function () {
        var _this = this;
        var _a = this.data, tid = _a.tid, hasGet = _a.hasGet;
        var hongbao$ = this.data.hongbao$;
        if (hasGet) {
            wx.showToast({
                title: '你成功领取过啦'
            });
            return this.toggleHongbao();
        }
        http_js_1.http({
            url: 'common_get-integral',
            data: {
                integral: hongbao$.gift
            },
            loadingMsg: '领取中...',
            success: function (res) {
                var status = res.status;
                if (status !== 200) {
                    return;
                }
                wx.showToast({
                    title: '领取成功'
                });
                _this.toggleHongbao();
                _this.setTripReward(tid);
                _this.checkIsGet(tid);
            }
        });
    },
    setTitle: function (title) {
        if (!title) {
            return;
        }
        wx.setNavigationBarTitle({
            title: title
        });
    },
    transferSl: function (sl, allTexts) {
        if (allTexts === void 0) { allTexts = []; }
        var pid = sl.pid, adjustGroupPrice = sl.adjustGroupPrice, adjustPrice = sl.adjustPrice, users = sl.users, detail = sl.detail;
        var delta = adjustGroupPrice ? Math.ceil(adjustPrice - adjustGroupPrice) : 0;
        var totalDelta = delta * users.length;
        var getRandom = function (n) { return Math.floor(Math.random() * n); };
        return {
            pid: pid,
            price: adjustPrice,
            groupPrice: adjustGroupPrice,
            fadePrice: detail.good.fadePrice,
            title: detail.title,
            name: detail.name || '',
            goodImg: detail.img,
            delta: delta,
            totalDelta: totalDelta,
            successDelta: users.length > 1 ? delta : 0,
            buyer: users.map(function (x) { return ({
                name: x.nickName,
                avatar: x.avatarUrl
            }); }),
            pinSuccess: users.length > 1,
            tips: allTexts[getRandom(allTexts.length)],
            tipsIndex: getRandom(users.length > 4 ? 3 : users.length - 1) + 1
        };
    },
    toggleHongbao: function () {
        var showHongbao = this.data.showHongbao;
        this.setData({
            showHongbao: showHongbao === 'show' ? 'hide' : 'show'
        });
    },
    goGoodDetail: function (e) {
        var data = e.currentTarget.dataset.data;
        route_js_1.navTo("/pages/goods-detail/index?id=" + data.pid);
    },
    onSubscribe: function () {
        app.getSubscribe('buyPin,waitPin,trip');
        this.fetchGetGift();
    },
    getUserAuth: function () {
        var _this = this;
        app.getWxUserInfo(function () {
            _this.fetchGetGift();
        });
    },
    setTripReward: function (tid) {
        var tripSum = 10;
        var hasRewardList = JSON.parse(wx.getStorageSync(storageKey) || '[ ]');
        hasRewardList.unshift(tid);
        wx.setStorageSync(storageKey, JSON.stringify(hasRewardList.slice(0, tripSum)));
    },
    checkIsGet: function (tid) {
        var hasRewardList = JSON.parse(wx.getStorageSync(storageKey) || '[ ]');
        this.setData({
            hasGet: hasRewardList.includes(tid)
        });
    },
    onSwiper: function (e) {
        var current = e.detail.current;
        this.setData({
            swiperIndex: current
        });
    },
    onScroll: function (e) {
        var showDanmu = this.data.showDanmu;
        var scrollTop = e.detail.scrollTop;
        if (!!showDanmu) {
            return;
        }
        if (scrollTop > 100) {
            this.setData({
                showDanmu: true
            });
        }
    },
    onLoad: function (query) {
        var tid = query.tid || "e8f863ba5de6241400076921441bc8d5";
        this.watchStore();
        this.runComputed();
        this.setData({
            tid: tid
        });
        this.checkIsGet(tid);
        this.fetchShopping(tid);
    },
    onReady: function () {
    },
    onShow: function () {
    },
    onHide: function () {
    },
    onUnload: function () {
    },
    onPullDownRefresh: function () {
    },
    onReachBottom: function () {
    },
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUNBLDhDQUEwQztBQUMxQyxxREFBb0Q7QUFFcEQsZ0RBQTRDO0FBRTVDLElBQU0sR0FBRyxHQUFHLE1BQU0sRUFBUSxDQUFDO0FBQzNCLElBQU0sVUFBVSxHQUFHLHNCQUFzQixDQUFDO0FBRTFDLElBQUksQ0FBQztJQUVELElBQUksRUFBRTtRQUVGLEdBQUcsRUFBRSxFQUFFO1FBRVAsTUFBTSxFQUFFLEVBQUU7UUFFVixRQUFRLEVBQUUsRUFBRTtRQUtaLE1BQU0sRUFBRSxLQUFLO1FBS2IsT0FBTyxFQUFFLElBQUk7UUFLYixXQUFXLEVBQUUsQ0FBQztRQUtkLFNBQVMsRUFBRSxLQUFLO1FBS2hCLElBQUksRUFBRSxFQUFHO1FBS1QsV0FBVyxFQUFFLE1BQU07UUFLbkIsTUFBTSxFQUFFLElBQUk7S0FFZjtJQUVELFdBQVc7UUFDUCxtQkFBUSxDQUFFLElBQUksRUFBRTtZQUdaLE9BQU87Z0JBQ0gsSUFBTSxNQUFNLEdBQUcsb0lBQW9JLENBQUM7Z0JBQ3BKLElBQU0sU0FBUyxHQUFHLFVBQUEsQ0FBQyxJQUFJLE9BQUEsSUFBSSxDQUFDLEtBQUssQ0FBRSxJQUFJLENBQUMsTUFBTSxFQUFHLEdBQUcsQ0FBQyxDQUFFLEVBQWhDLENBQWdDLENBQUM7Z0JBQ3hELElBQU0sUUFBUSxHQUFHO29CQUNiLDBEQUFhO29CQUNiLDBEQUFhO29CQUNiLDBEQUFhO2lCQUNoQixDQUFDO2dCQUVGLElBQU0sUUFBUSxHQUFHO29CQUNiLE1BQU07b0JBQ04sTUFBTTtpQkFDVCxDQUFDO2dCQUNGLElBQU0sV0FBVyxHQUFHLFFBQVE7cUJBQ3ZCLEdBQUcsQ0FBRSxVQUFBLENBQUM7b0JBQ0gsSUFBTSxTQUFTLEdBQUcsU0FBUyxDQUFFLFFBQVEsQ0FBQyxNQUFNLENBQUUsQ0FBQztvQkFDL0MsT0FBTzt3QkFDSCxNQUFNLEVBQUUsQ0FBQzt3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QUcsR0FBRyxLQUFLLENBQUMsR0FBRyxJQUFJLGtDQUFrQyxDQUFDO1FBQzVELElBQUksQ0FBQyxVQUFVLEVBQUcsQ0FBQztRQUNuQixJQUFJLENBQUMsV0FBVyxFQUFHLENBQUM7UUFFcEIsSUFBSSxDQUFDLE9BQVEsQ0FBQztZQUNWLEdBQUcsS0FBQTtTQUNOLENBQUMsQ0FBQztRQUVILElBQUksQ0FBQyxVQUFVLENBQUUsR0FBRyxDQUFFLENBQUM7UUFDdkIsSUFBSSxDQUFDLGFBQWEsQ0FBRSxHQUFHLENBQUUsQ0FBQztJQUU5QixDQUFDO0lBS0QsT0FBTyxFQUFFO0lBRVQsQ0FBQztJQUtELE1BQU0sRUFBRTtJQUVSLENBQUM7SUFLRCxNQUFNLEVBQUU7SUFFUixDQUFDO0lBS0QsUUFBUSxFQUFFO0lBRVYsQ0FBQztJQUtELGlCQUFpQixFQUFFO0lBRW5CLENBQUM7SUFLRCxhQUFhLEVBQUU7SUFFZixDQUFDO0NBUUYsQ0FBQyxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiXG5pbXBvcnQgeyBodHRwIH0gZnJvbSAnLi4vLi4vdXRpbC9odHRwLmpzJztcbmltcG9ydCB7IGNvbXB1dGVkIH0gZnJvbSAnLi4vLi4vbGliL3Z1ZWZ5L2luZGV4LmpzJztcbmltcG9ydCB7IGRlbGF5ZXJpbmdHb29kIH0gZnJvbSAnLi4vLi4vdXRpbC9nb29kcy5qcyc7XG5pbXBvcnQgeyBuYXZUbyB9IGZyb20gJy4uLy4uL3V0aWwvcm91dGUuanMnO1xuXG5jb25zdCBhcHAgPSBnZXRBcHA8YW55PiggKTtcbmNvbnN0IHN0b3JhZ2VLZXkgPSAndHJpcC1oYXMtcmV3YXJkLWxpc3QnO1xuXG5QYWdlKHtcblxuICAgIGRhdGE6IHtcblxuICAgICAgICB0aWQ6ICcnLFxuXG4gICAgICAgIG9wZW5pZDogJycsXG5cbiAgICAgICAgaXBBdmF0YXI6ICcnLFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiDmmK/lkKbmnInnlKjmiLfmjojmnYNcbiAgICAgICAgICovXG4gICAgICAgIGlzQXV0aDogZmFsc2UsXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIOWKoOi9vVxuICAgICAgICAgKi9cbiAgICAgICAgbG9hZGluZzogdHJ1ZSxcblxuICAgICAgICAvKipcbiAgICAgICAgICog5YW25LuW5Lq65riF5Y2V55qEIHN3aXBlclxuICAgICAgICAgKi9cbiAgICAgICAgc3dpcGVySW5kZXg6IDAsXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIOaYr+WQpuWxleekuuW8ueW5lVxuICAgICAgICAgKi9cbiAgICAgICAgc2hvd0Rhbm11OiBmYWxzZSxcblxuICAgICAgICAvKipcbiAgICAgICAgICog6LSt54mp5riF5Y2VXG4gICAgICAgICAqL1xuICAgICAgICBsaXN0OiBbIF0sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIOWxleekuue6ouWMhVxuICAgICAgICAgKi9cbiAgICAgICAgc2hvd0hvbmdiYW86ICdoaWRlJyxcblxuICAgICAgICAvKipcbiAgICAgICAgICog5piv5ZCm5bey57uP6aKG5Y+W6L+H57qi5YyF5LqGXG4gICAgICAgICAqL1xuICAgICAgICBoYXNHZXQ6IHRydWVcblxuICAgIH0sXG5cbiAgICBydW5Db21wdXRlZCggKSB7XG4gICAgICAgIGNvbXB1dGVkKCB0aGlzLCB7XG5cbiAgICAgICAgICAgIC8vIOi0reS5sOiusOW9lSArIOekvuS6pOWxnuaAp+aooeWdl1xuICAgICAgICAgICAgc29jaWFsJCggKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgYXZhdGFyID0gJ2h0dHBzOi8vd3gucWxvZ28uY24vbW1vcGVuL3ZpXzMyL0llak1WWlRHOFdsaWJIaWNISVZRaHFjTmVDNHVCeGt6SDBGRlRiUkxNaWN4aWI4d3J4UlJXb0pZM2d2Y3R5bEFUZG1BUGhpYVZpY1U0c0gwTnB0U3N6QmR5SGlhQS8xMzInO1xuICAgICAgICAgICAgICAgIGNvbnN0IGdldFJhbmRvbSA9IG4gPT4gTWF0aC5mbG9vciggTWF0aC5yYW5kb20oICkgKiBuICk7XG4gICAgICAgICAgICAgICAgY29uc3QgYWxsVGV4dHMgPSBbXG4gICAgICAgICAgICAgICAgICAgIGDmo5IhIOaLvOWboueahOe+pOWPi+ecn+e7meWKm2AsXG4gICAgICAgICAgICAgICAgICAgIGDlk4chIOWSjOe+pOWPi+aLvOWbouWlveWIkueul2AsXG4gICAgICAgICAgICAgICAgICAgIGDlk4ghIOS4i+asoee7p+e7reeUqOe+pOaLvOWbomBcbiAgICAgICAgICAgICAgICBdO1xuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIGNvbnN0IHZpc2l0b3JzID0gW1xuICAgICAgICAgICAgICAgICAgICBhdmF0YXIsXG4gICAgICAgICAgICAgICAgICAgIGF2YXRhclxuICAgICAgICAgICAgICAgIF07XG4gICAgICAgICAgICAgICAgY29uc3QgYWxsVmlzaXRvcnMgPSB2aXNpdG9yc1xuICAgICAgICAgICAgICAgICAgICAubWFwKCB4ID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHJhbmRvbU51bSA9IGdldFJhbmRvbSggYWxsVGV4dHMubGVuZ3RoICk7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGF2YXRhcjogeCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZXh0OiBhbGxUZXh0c1sgcmFuZG9tTnVtIF1cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICByZXR1cm4gYWxsVmlzaXRvcnM7XG5cbiAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgIC8vIOWFtuS7luS6uijmiJbogIXmmK/miYDmnInkurrnmoQp55qE6LSt54mp5riF5Y2VXG4gICAgICAgICAgICBvdGhlcnMkKCApIHtcbiAgICAgICAgICAgICAgICBjb25zdCB7IGxpc3QsIG9wZW5pZCB9ID0gdGhpcy5kYXRhO1xuICAgICAgICAgICAgICAgIGNvbnN0IG90aGVyTGlzdCA9IGxpc3RcbiAgICAgICAgICAgICAgICAgICAgLmZpbHRlciggeCA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gIXgudXNlcnMuZmluZCggeSA9PiB5Lm9wZW5pZCA9PT0gb3BlbmlkICk7XG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgIC5zb3J0KCggeCwgeSApID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB5LnVzZXJzLmxlbmd0aCAtIHgudXNlcnMubGVuZ3RoXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgY29uc3QgciA9IG90aGVyTGlzdC5tYXAoIHNsID0+IHRoaXMudHJhbnNmZXJTbCggc2wgKSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHI7XG4gICAgICAgICAgICB9LFxuXG4gICAgICAgICAgICAvLyDkuKrkurrotK3nianmuIXljZVcbiAgICAgICAgICAgIHBlcnNvbmFsJCggKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgeyBsaXN0LCBvcGVuaWQgfSA9IHRoaXMuZGF0YTtcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICBjb25zdCBhbGxUZXh0cyA9IFtcbiAgICAgICAgICAgICAgICAgICAgYOecn+e7meWKm2AsXG4gICAgICAgICAgICAgICAgICAgIGDosKLosKLkvaBgLFxuICAgICAgICAgICAgICAgICAgICBg5YiS566X772eYCxcbiAgICAgICAgICAgICAgICAgICAgYOajkiFgLFxuICAgICAgICAgICAgICAgICAgICBg6LWeIWAsXG4gICAgICAgICAgICAgICAgICAgIGDotZohYFxuICAgICAgICAgICAgICAgIF07XG5cbiAgICAgICAgICAgICAgICBjb25zdCBteUxpc3QgPSBsaXN0XG4gICAgICAgICAgICAgICAgICAgIC5maWx0ZXIoIHggPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHgudXNlcnMuZmluZCggeSA9PiB5Lm9wZW5pZCA9PT0gb3BlbmlkICk7XG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgIC5zb3J0KCggeCwgeSApID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB5LnVzZXJzLmxlbmd0aCAtIHgudXNlcnMubGVuZ3RoXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgY29uc3QgciA9IG15TGlzdC5tYXAoIHNsID0+IHRoaXMudHJhbnNmZXJTbCggc2wsIGFsbFRleHRzICkpO1xuICAgICAgICAgICAgICAgIHJldHVybiByO1xuICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAgLy8g6KGM56iL5riF5Y2V5oC75qaC5Ya1XG4gICAgICAgICAgICBzdW1tYXJ5JCggKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgeyBsaXN0LCBvcGVuaWQgfSA9IHRoaXMuZGF0YTtcblxuICAgICAgICAgICAgICAgIGNvbnN0IGFsbFNsID0gbGlzdC5tYXAoIHNsID0+IHRoaXMudHJhbnNmZXJTbCggc2wgKSk7XG4gICAgICAgICAgICAgICAgY29uc3QgbXlTTCA9IGxpc3RcbiAgICAgICAgICAgICAgICAgICAgLmZpbHRlciggeCA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4geC51c2Vycy5maW5kKCB5ID0+IHkub3BlbmlkID09PSBvcGVuaWQgKTtcbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgLm1hcCggc2wgPT4gdGhpcy50cmFuc2ZlclNsKCBzbCApKTtcblxuICAgICAgICAgICAgICAgIGNvbnN0IHIgPSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIOaJgOaciee+pOWPi++8jOS4gOWFseecgeS6huWkmuWwkVxuICAgICAgICAgICAgICAgICAgICBncm91cFRvdGFsRGVsdGE6IGFsbFNsLnJlZHVjZSgoIHgsIHkgKSA9PiB4ICsgeS50b3RhbERlbHRhLCAwICksXG4gICAgICAgICAgICAgICAgICAgIC8vIOaIkeS4gOWFseecgeS6huWkmuWwkVxuICAgICAgICAgICAgICAgICAgICBteVRvdGFsRGVsdGE6IG15U0wucmVkdWNlKCggeCwgeSApID0+IHggKyB5LnN1Y2Nlc3NEZWx0YSwgMCApXG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICByZXR1cm4gcjtcbiAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgIC8vIOaKteeOsOmHkeeahOWlluWKsemHkeminVxuICAgICAgICAgICAgaG9uZ2JhbyQoICkge1xuICAgICAgICAgICAgICAgIGNvbnN0IHsgbGlzdCwgb3BlbmlkIH0gPSB0aGlzLmRhdGE7XG5cbiAgICAgICAgICAgICAgICAvLyDmiJHnmoTotK3nianmuIXljZVcbiAgICAgICAgICAgICAgICBjb25zdCBteUxpc3QgPSBsaXN0XG4gICAgICAgICAgICAgICAgICAgIC5maWx0ZXIoIHggPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHgudXNlcnMuZmluZCggeSA9PiB5Lm9wZW5pZCA9PT0gb3BlbmlkICk7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgLy8g5piv5ZCm5pyJ5Lmw6L+H5Lic6KW/XG4gICAgICAgICAgICAgICAgY29uc3QgaGFzQnV5ID0gbXlMaXN0Lmxlbmd0aCA+IDA7XG5cbiAgICAgICAgICAgICAgICAvLyDlpZblirHph5Hpop1cbiAgICAgICAgICAgICAgICBjb25zdCBnaWZ0ID0gaGFzQnV5ID8gMS4yNCA6IDAuODg7XG5cbiAgICAgICAgICAgICAgICAvLyDmmK/lkKbmnInmi7zlm6LmiJDlip9cbiAgICAgICAgICAgICAgICBjb25zdCBzb21lUGluU3VjY2VzcyA9IG15TGlzdC5zb21lKCB4ID0+IHgudXNlcnMubGVuZ3RoID4gMSApO1xuXG4gICAgICAgICAgICAgICAgLy8g5paH5qGIMVxuICAgICAgICAgICAgICAgIGNvbnN0IHRpdGxlID0gaGFzQnV5ICYmIHNvbWVQaW5TdWNjZXNzID9cbiAgICAgICAgICAgICAgICAgICAgJ+aLvOWbouaIkOWKnycgOlxuICAgICAgICAgICAgICAgICAgICBoYXNCdXkgJiYgIXNvbWVQaW5TdWNjZXNzID9cbiAgICAgICAgICAgICAgICAgICAgICAgICfojqvngbDlv4MnIDpcbiAgICAgICAgICAgICAgICAgICAgICAgICfkuIvmrKHot5/nnYDmi7wnO1xuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIC8vIOaWh+WuiTJcbiAgICAgICAgICAgICAgICBjb25zdCBzdW1tYXJ5ID0gaGFzQnV5ICYmIHNvbWVQaW5TdWNjZXNzID9cbiAgICAgICAgICAgICAgICAgICAgJ+ivt+WGjeaOpeWGjeWOiX4nIDpcbiAgICAgICAgICAgICAgICAgICAgaGFzQnV5ICYmICFzb21lUGluU3VjY2VzcyA/XG4gICAgICAgICAgICAgICAgICAgICAgICAn5beu54K55bCx5ou85oiQIScgOlxuICAgICAgICAgICAgICAgICAgICAgICAgJ+e+pOaLvOWboiDnnIHpkrEhJztcblxuICAgICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgICAgIGdpZnQsXG4gICAgICAgICAgICAgICAgICAgIHRpdGxlLFxuICAgICAgICAgICAgICAgICAgICBzdW1tYXJ5XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgIH0pO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiDnm5HlkKxzdG9yZVxuICAgICAqL1xuICAgIHdhdGNoU3RvcmUoICkge1xuICAgICAgICBhcHAud2F0Y2gkKCdhcHBDb25maWcnLCB2YWwgPT4ge1xuICAgICAgICAgICAgaWYgKCAhIXZhbCApIHtcbiAgICAgICAgICAgICAgICB0aGlzLnNldFRpdGxlKGAke3ZhbFsnaXAtbmFtZSddIHx8ICcnfee+pOaLvOWbomApXG4gICAgICAgICAgICAgICAgdGhpcy5zZXREYXRhISh7XG4gICAgICAgICAgICAgICAgICAgIGlwQXZhdGFyOiBgJHt2YWxbJ2lwLWF2YXRhciddIHx8ICcnfWBcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgYXBwLndhdGNoJCgnb3BlbmlkJywgdmFsID0+IHtcbiAgICAgICAgICAgICEhdmFsICYmIHRoaXMuc2V0RGF0YSEoe1xuICAgICAgICAgICAgICAgIG9wZW5pZDogdmFsXG4gICAgICAgICAgICB9KVxuICAgICAgICB9KTtcbiAgICAgICAgYXBwLndhdGNoJCgnaXNVc2VyQXV0aCcsIHZhbCA9PiB7XG4gICAgICAgICAgICBpZiAoIHZhbCA9PT0gdW5kZWZpbmVkICkgeyByZXR1cm47IH1cbiAgICAgICAgICAgIHRoaXMuc2V0RGF0YSEoe1xuICAgICAgICAgICAgICAgIGlzQXV0aDogdmFsXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfSxcblxuICAgIC8qKiBcbiAgICAgKiDmi4nlj5booYznqIvnmoTotK3nianor7fljZXkv6Hmga9cbiAgICAgKi9cbiAgICBmZXRjaFNob3BwaW5nKCB0aWQgKSB7XG4gICAgICAgIGlmICggIXRpZCApIHsgcmV0dXJuOyB9XG5cbiAgICAgICAgaHR0cCh7XG4gICAgICAgICAgICB1cmw6ICdzaG9wcGluZy1saXN0X3BpbicsXG4gICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgdGlkLFxuICAgICAgICAgICAgICAgIGRldGFpbDogdHJ1ZSxcbiAgICAgICAgICAgICAgICBzaG93VXNlcjogdHJ1ZVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHN1Y2Nlc3M6IHJlcyA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3QgeyBzdGF0dXMsIGRhdGEgfSA9IHJlcztcbiAgICAgICAgICAgICAgICBpZiAoIHN0YXR1cyAhPT0gMjAwICkgeyByZXR1cm47IH1cbiAgICAgICAgICAgICAgICB0aGlzLnNldERhdGEhKHtcbiAgICAgICAgICAgICAgICAgICAgbGlzdDogZGF0YSxcbiAgICAgICAgICAgICAgICAgICAgbG9hZGluZzogZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgIHNob3dIb25nYmFvOiAnc2hvdydcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSlcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICog6aKG5Y+W57qi5YyFXG4gICAgICovXG4gICAgZmV0Y2hHZXRHaWZ0KCApIHtcbiAgICAgICAgY29uc3QgeyB0aWQsIGhhc0dldCB9ID0gdGhpcy5kYXRhO1xuICAgICAgICBjb25zdCBob25nYmFvJCA9ICh0aGlzIGFzIGFueSkuZGF0YS5ob25nYmFvJDtcblxuICAgICAgICBpZiAoIGhhc0dldCApIHtcbiAgICAgICAgICAgIHd4LnNob3dUb2FzdCh7XG4gICAgICAgICAgICAgICAgdGl0bGU6ICfkvaDmiJDlip/pooblj5bov4fllaYnXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnRvZ2dsZUhvbmdiYW8oICk7XG4gICAgICAgIH1cblxuICAgICAgICBodHRwKHtcbiAgICAgICAgICAgIHVybDogJ2NvbW1vbl9nZXQtaW50ZWdyYWwnLFxuICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgIGludGVncmFsOiBob25nYmFvJC5naWZ0XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgbG9hZGluZ01zZzogJ+mihuWPluS4rS4uLicsXG4gICAgICAgICAgICBzdWNjZXNzOiByZXMgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IHsgc3RhdHVzIH0gPSByZXM7XG4gICAgICAgICAgICAgICAgaWYgKCBzdGF0dXMgIT09IDIwMCApIHsgcmV0dXJuOyB9XG5cbiAgICAgICAgICAgICAgICB3eC5zaG93VG9hc3Qoe1xuICAgICAgICAgICAgICAgICAgICB0aXRsZTogJ+mihuWPluaIkOWKnydcbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgIHRoaXMudG9nZ2xlSG9uZ2JhbyggKTtcbiAgICAgICAgICAgICAgICB0aGlzLnNldFRyaXBSZXdhcmQoIHRpZCApO1xuICAgICAgICAgICAgICAgIHRoaXMuY2hlY2tJc0dldCggdGlkICk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH0sXG5cbiAgICAvKiogXG4gICAgICog6K6+572u5qCH6aKYXG4gICAgICovXG4gICAgc2V0VGl0bGUoIHRpdGxlOiBzdHJpbmcgKSB7XG4gICAgICAgIGlmICggIXRpdGxlICkgeyByZXR1cm47IH1cbiAgICAgICAgd3guc2V0TmF2aWdhdGlvbkJhclRpdGxlKHtcbiAgICAgICAgICAgIHRpdGxlXG4gICAgICAgIH0pO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiDovazmjaLmoLzlvI9cbiAgICAgKi9cbiAgICB0cmFuc2ZlclNsKCBzbCwgYWxsVGV4dHMgPSBbIF0pIHtcblxuICAgICAgICBjb25zdCB7IHBpZCwgYWRqdXN0R3JvdXBQcmljZSwgYWRqdXN0UHJpY2UsIHVzZXJzLCBkZXRhaWwgfSA9IHNsO1xuICAgICAgICBjb25zdCBkZWx0YSA9IGFkanVzdEdyb3VwUHJpY2UgPyBNYXRoLmNlaWwoIGFkanVzdFByaWNlIC0gYWRqdXN0R3JvdXBQcmljZSApIDogMDtcbiAgICAgICAgY29uc3QgdG90YWxEZWx0YSA9IGRlbHRhICogdXNlcnMubGVuZ3RoO1xuXG4gICAgICAgIGNvbnN0IGdldFJhbmRvbSA9IG4gPT4gTWF0aC5mbG9vciggTWF0aC5yYW5kb20oICkgKiBuICk7XG5cbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHBpZCxcbiAgICAgICAgICAgIHByaWNlOiBhZGp1c3RQcmljZSxcbiAgICAgICAgICAgIGdyb3VwUHJpY2U6IGFkanVzdEdyb3VwUHJpY2UsXG4gICAgICAgICAgICBmYWRlUHJpY2U6IGRldGFpbC5nb29kLmZhZGVQcmljZSxcbiAgICAgICAgICAgIHRpdGxlOiBkZXRhaWwudGl0bGUsXG4gICAgICAgICAgICBuYW1lOiBkZXRhaWwubmFtZSB8fCAnJyxcbiAgICAgICAgICAgIGdvb2RJbWc6IGRldGFpbC5pbWcsXG4gICAgICAgICAgICAvLyDmgLvlt67lgLxcbiAgICAgICAgICAgIGRlbHRhLCBcbiAgICAgICAgICAgIC8vIOi0reeJqea4heWNleaAu+W3ruWAvFxuICAgICAgICAgICAgdG90YWxEZWx0YSxcbiAgICAgICAgICAgIC8vIOaIkeeahOaIkOWKn+aLvOWbouW3ruWAvFxuICAgICAgICAgICAgc3VjY2Vzc0RlbHRhOiB1c2Vycy5sZW5ndGggPiAxID8gZGVsdGEgOiAwLFxuICAgICAgICAgICAgYnV5ZXI6IHVzZXJzLm1hcCggeCA9PiAoe1xuICAgICAgICAgICAgICAgIG5hbWU6IHgubmlja05hbWUsXG4gICAgICAgICAgICAgICAgYXZhdGFyOiB4LmF2YXRhclVybFxuICAgICAgICAgICAgfSkpLFxuICAgICAgICAgICAgcGluU3VjY2VzczogdXNlcnMubGVuZ3RoID4gMSxcbiAgICAgICAgICAgIHRpcHM6IGFsbFRleHRzWyBnZXRSYW5kb20oIGFsbFRleHRzLmxlbmd0aCApXSxcbiAgICAgICAgICAgIHRpcHNJbmRleDogZ2V0UmFuZG9tKCB1c2Vycy5sZW5ndGggPiA0ID8gMyA6IHVzZXJzLmxlbmd0aCAtIDEgKSArIDFcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiDlvIDlhbPnuqLljIVcbiAgICAgKi9cbiAgICB0b2dnbGVIb25nYmFvKCApIHtcbiAgICAgICAgY29uc3QgeyBzaG93SG9uZ2JhbyB9ID0gdGhpcy5kYXRhO1xuICAgICAgICB0aGlzLnNldERhdGEhKHtcbiAgICAgICAgICAgIHNob3dIb25nYmFvOiBzaG93SG9uZ2JhbyA9PT0gJ3Nob3cnID8gJ2hpZGUnIDogJ3Nob3cnXG4gICAgICAgIH0pXG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIOi3s+WIsOWVhuWTgeivpuaDhVxuICAgICAqL1xuICAgIGdvR29vZERldGFpbCggZSApIHtcbiAgICAgICAgY29uc3QgeyBkYXRhIH0gPSBlLmN1cnJlbnRUYXJnZXQuZGF0YXNldDtcbiAgICAgICAgbmF2VG8oYC9wYWdlcy9nb29kcy1kZXRhaWwvaW5kZXg/aWQ9JHtkYXRhLnBpZH1gKVxuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiDorqLpmIVcbiAgICAgKi9cbiAgICBvblN1YnNjcmliZSggKSB7XG4gICAgICAgIGFwcC5nZXRTdWJzY3JpYmUoJ2J1eVBpbix3YWl0UGluLHRyaXAnKTtcbiAgICAgICAgdGhpcy5mZXRjaEdldEdpZnQoICk7XG4gICAgfSxcblxuICAgIC8qKiBcbiAgICAgKiDojrflj5bnlKjmiLfmjojmnYNcbiAgICAgKi9cbiAgICBnZXRVc2VyQXV0aCggKSB7XG4gICAgICAgIGFwcC5nZXRXeFVzZXJJbmZvKCggKSA9PiB7XG4gICAgICAgICAgICB0aGlzLmZldGNoR2V0R2lmdCggKTtcbiAgICAgICAgfSk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIOiuvue9ruW3sumihuWPlue6ouWMhVxuICAgICAqIOS7heS/neeVmTEw5Liq6KGM56iLaWRcbiAgICAgKi9cbiAgICBzZXRUcmlwUmV3YXJkKCB0aWQgKSB7XG4gICAgICAgIGNvbnN0IHRyaXBTdW0gPSAxMDtcbiAgICAgICAgY29uc3QgaGFzUmV3YXJkTGlzdCA9IEpTT04ucGFyc2UoIHd4LmdldFN0b3JhZ2VTeW5jKCBzdG9yYWdlS2V5ICkgfHwgJ1sgXScpO1xuICAgICAgICBoYXNSZXdhcmRMaXN0LnVuc2hpZnQoIHRpZCApO1xuICAgICAgICB3eC5zZXRTdG9yYWdlU3luYyggc3RvcmFnZUtleSwgSlNPTi5zdHJpbmdpZnkoIGhhc1Jld2FyZExpc3Quc2xpY2UoIDAsIHRyaXBTdW0gKSkpXG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIOajgOafpeivpei2n+ihjOeoi+mHjOmdolxuICAgICAqIOaYr+WQpuW3sue7j+mihuWPlui/h+e6ouWMhVxuICAgICAqL1xuICAgIGNoZWNrSXNHZXQoIHRpZCApIHtcbiAgICAgICAgY29uc3QgaGFzUmV3YXJkTGlzdCA9IEpTT04ucGFyc2UoIHd4LmdldFN0b3JhZ2VTeW5jKCBzdG9yYWdlS2V5ICkgfHwgJ1sgXScpO1xuICAgICAgICB0aGlzLnNldERhdGEhKHtcbiAgICAgICAgICAgIGhhc0dldDogaGFzUmV3YXJkTGlzdC5pbmNsdWRlcyggdGlkIClcbiAgICAgICAgfSk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIHN3aXBlcuebkeWQrFxuICAgICAqL1xuICAgIG9uU3dpcGVyKCBlOiBhbnkgKSB7XG4gICAgICAgIGNvbnN0IHsgY3VycmVudCB9ID0gZS5kZXRhaWw7XG4gICAgICAgIHRoaXMuc2V0RGF0YSEoe1xuICAgICAgICAgICAgc3dpcGVySW5kZXg6IGN1cnJlbnRcbiAgICAgICAgfSk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIOmhtemdoua7muWKqFxuICAgICAqL1xuICAgIG9uU2Nyb2xsKCBlOiBhbnkgKSB7XG4gICAgICAgIGNvbnN0IHsgc2hvd0Rhbm11IH0gPSB0aGlzLmRhdGE7XG4gICAgICAgIGNvbnN0IHsgc2Nyb2xsVG9wIH0gPSBlLmRldGFpbDtcbiAgICAgICAgaWYgKCAhIXNob3dEYW5tdSApIHsgcmV0dXJuOyB9IFxuXG4gICAgICAgIGlmICggc2Nyb2xsVG9wID4gMTAwICkge1xuICAgICAgICAgICAgdGhpcy5zZXREYXRhISh7XG4gICAgICAgICAgICAgICAgc2hvd0Rhbm11OiB0cnVlXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiB0aWQg6KGM56iLaWRcbiAgICAgKi9cbiAgICBvbkxvYWQ6IGZ1bmN0aW9uICggcXVlcnk6IGFueSApIHtcbiAgICAgICAgY29uc3QgdGlkID0gcXVlcnkudGlkIHx8IFwiZThmODYzYmE1ZGU2MjQxNDAwMDc2OTIxNDQxYmM4ZDVcIjtcbiAgICAgICAgdGhpcy53YXRjaFN0b3JlKCApO1xuICAgICAgICB0aGlzLnJ1bkNvbXB1dGVkKCApO1xuICAgICAgICBcbiAgICAgICAgdGhpcy5zZXREYXRhISh7XG4gICAgICAgICAgICB0aWRcbiAgICAgICAgfSk7XG5cbiAgICAgICAgdGhpcy5jaGVja0lzR2V0KCB0aWQgKTtcbiAgICAgICAgdGhpcy5mZXRjaFNob3BwaW5nKCB0aWQgKTtcblxuICAgIH0sXG4gIFxuICAgIC8qKlxuICAgICAqIOeUn+WRveWRqOacn+WHveaVsC0t55uR5ZCs6aG16Z2i5Yid5qyh5riy5p+T5a6M5oiQXG4gICAgICovXG4gICAgb25SZWFkeTogZnVuY3Rpb24gKCApIHtcblxuICAgIH0sXG4gIFxuICAgIC8qKlxuICAgICAqIOeUn+WRveWRqOacn+WHveaVsC0t55uR5ZCs6aG16Z2i5pi+56S6XG4gICAgICovXG4gICAgb25TaG93OiBmdW5jdGlvbiAoICkge1xuXG4gICAgfSxcbiAgXG4gICAgLyoqXG4gICAgICog55Sf5ZG95ZGo5pyf5Ye95pWwLS3nm5HlkKzpobXpnaLpmpDol49cbiAgICAgKi9cbiAgICBvbkhpZGU6IGZ1bmN0aW9uICgpIHtcbiAgXG4gICAgfSxcbiAgXG4gICAgLyoqXG4gICAgICog55Sf5ZG95ZGo5pyf5Ye95pWwLS3nm5HlkKzpobXpnaLljbjovb1cbiAgICAgKi9cbiAgICBvblVubG9hZDogZnVuY3Rpb24gKCkge1xuICBcbiAgICB9LFxuICBcbiAgICAvKipcbiAgICAgKiDpobXpnaLnm7jlhbPkuovku7blpITnkIblh73mlbAtLeebkeWQrOeUqOaIt+S4i+aLieWKqOS9nFxuICAgICAqL1xuICAgIG9uUHVsbERvd25SZWZyZXNoOiBmdW5jdGlvbiAoKSB7XG4gIFxuICAgIH0sXG4gIFxuICAgIC8qKlxuICAgICAqIOmhtemdouS4iuaLieinpuW6leS6i+S7tueahOWkhOeQhuWHveaVsFxuICAgICAqL1xuICAgIG9uUmVhY2hCb3R0b206IGZ1bmN0aW9uICgpIHtcbiAgXG4gICAgfSxcbiAgXG4gICAgLyoqXG4gICAgICog55So5oi354K55Ye75Y+z5LiK6KeS5YiG5LqrXG4gICAgICovXG4gICAgLy8gb25TaGFyZUFwcE1lc3NhZ2U6IGZ1bmN0aW9uICggZSApIHtcblxuICAgIC8vIH1cbiAgfSkiXX0=