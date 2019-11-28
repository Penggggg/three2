"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var http_js_1 = require("../../util/http.js");
var index_js_1 = require("../../lib/vuefy/index.js");
var goods_js_1 = require("../../util/goods.js");
var route_js_1 = require("../../util/route.js");
var app = getApp();
var storageKey = 'opened-pin-in-good';
Page({
    animationMiddleHeaderItem: null,
    data: {
        isUserAuth: true,
        ipName: '',
        ipAvatar: '',
        isNew: true,
        tid: '',
        id: '',
        detail: null,
        dic: {},
        loading: true,
        hasInitLike: false,
        liked: false,
        promiseTips: [
            '正品保证', '价格优势', '真人跑腿'
        ],
        animationMiddleHeaderItem: null,
        showBtn: false,
        showingPoster: false,
        showPlayTips: 'hide',
        showShareGetMoney: false,
        showPinGoods: 'hide',
        showShareTips2: false,
        pin: [],
        shopping: [],
        activities: [],
        canPinSku: [],
        trip: null,
        canIntegrayShare: false,
        openid: '',
        from: '',
        pushIntegralRate: 0,
        openingSku: false,
        visitors: []
    },
    runComputed: function () {
        index_js_1.computed(this, {
            price: function () {
                var detail = this.data.detail;
                var result = goods_js_1.delayeringGood(detail);
                return result ? result.price$ : '';
            },
            detailIntro: function () {
                var detail = this.data.detail;
                if (!detail || (!!detail && !detail.detail)) {
                    return [];
                }
                else {
                    return detail.detail.split('\n').filter(function (x) { return !!x; });
                }
            },
            priceGap: function () {
                var detail = this.data.detail;
                if (!detail) {
                    return '';
                }
                else {
                    var result = goods_js_1.delayeringGood(detail);
                    var gap = result ? String(result.goodPins.eachPriceRound).replace(/\.00/g, '') : '';
                    var meta = gap !== '0' && !!gap ? gap : '';
                    return meta;
                }
            },
            pinCount$: function () {
                var _a = this.data, id = _a.id, detail = _a.detail;
                var goodShopping = this.data.shopping.filter(function (x) { return x.pid === id; });
                if (!detail) {
                    return 0;
                }
                var standards = detail.standards, groupPrice = detail.groupPrice;
                if (!!standards && standards.length > 0) {
                    return standards
                        .filter(function (x) { return !!goodShopping.find(function (s) { return s.sid === x._id && s.pid === x.pid; }); })
                        .length;
                }
                else if (!!groupPrice) {
                    var _id_1 = detail._id;
                    return !!goodShopping.find(function (s) { return s.pid === _id_1; }) ? 1 : 0;
                }
                return 0;
            },
            pin$: function () {
                var meta = [];
                var _a = this.data, detail = _a.detail, shopping = _a.shopping, activities = _a.activities;
                if (!detail) {
                    return [];
                }
                var standards = detail.standards, groupPrice = detail.groupPrice;
                if (standards.length > 0) {
                    meta = standards
                        .filter(function (x) { return !!x.groupPrice; })
                        .map(function (x) {
                        return Object.assign({}, x, {
                            sid: x._id,
                            canPin: !!shopping.find(function (s) { return s.sid === x._id && s.pid === x.pid; })
                        });
                    });
                }
                else if (!!groupPrice) {
                    var price = detail.price, title = detail.title, img = detail.img, _id_2 = detail._id;
                    meta = [{
                            price: price,
                            pid: _id_2,
                            name: title,
                            groupPrice: groupPrice,
                            sid: undefined,
                            img: img[0],
                            canPin: !!shopping.find(function (s) { return s.pid === _id_2; })
                        }];
                }
                activities.map(function (ac) {
                    if (!ac.ac_groupPrice) {
                        return;
                    }
                    var pinTarget = meta.find(function (x) { return x.pid === ac.pid && x.sid === ac.sid; });
                    var pinTargetIndex = meta.findIndex(function (x) { return x.pid === ac.pid && x.sid === ac.sid; });
                    if (pinTargetIndex !== -1) {
                        meta.splice(pinTargetIndex, 1, Object.assign({}, pinTarget, {
                            price: ac.ac_price,
                            groupPrice: ac.ac_groupPrice
                        }));
                    }
                    else {
                        meta.push({
                            sid: ac.sid,
                            pid: ac.pid,
                            img: ac.img,
                            name: ac.title,
                            canPin: !!shopping.find(function (s) { return s.sid === ac.sid && s.pid === ac.pid; }),
                            price: ac.ac_price,
                            groupPrice: ac.ac_groupPrice
                        });
                    }
                });
                var meta2 = meta.map(function (x) { return Object.assign({}, x, {
                    delta: Number(x.price - x.groupPrice).toFixed(0)
                }); });
                return meta2;
            },
            integral$: function () {
                var _a = this.data, detail = _a.detail, pushIntegralRate = _a.pushIntegralRate;
                if (!detail) {
                    return '';
                }
                var result = goods_js_1.delayeringGood(detail, pushIntegralRate);
                return result.integral$;
            },
            detail$: function () {
                var detail = this.data.detail;
                var r = goods_js_1.delayeringGood(detail);
                return r;
            },
            hasOrder$: function () {
                var _a = this.data, openid = _a.openid, tripShoppinglist = _a.tripShoppinglist;
                var r = (tripShoppinglist || [])
                    .filter(function (sl) {
                    var uids = sl.uids;
                    return uids.includes(openid);
                });
                var result = Array.isArray(tripShoppinglist) && tripShoppinglist.length > 0
                    ? r.length > 0 : false;
                return result;
            },
            visitors$: function () {
                var _a = this.data, visitors = _a.visitors, openid = _a.openid;
                return visitors.filter(function (x) { return x.openid !== openid; });
            },
            social$: function () {
                var _a = this.data, visitors = _a.visitors, openid = _a.openid, detail = _a.detail;
                var good = goods_js_1.delayeringGood(detail);
                var getRandom = function (n) { return Math.floor(Math.random() * n); };
                var allTexts = [
                    "\u7FA4\u91CC\u7684\u5979\u4E5F\u5728\u770B",
                    "\u7FA4\u91CC\u7684\u5979\u4E5F\u5173\u6CE8\u300C" + good.tagText + "\u300D",
                    "\u5979\u4E5F\u611F\u5174\u8DA3\uFF0C\u8DDF\u5979\u62FC\u56E2"
                ];
                var allVisitors = visitors
                    .filter(function (x) { return true || x.openid !== openid; })
                    .map(function (x) {
                    var randomNum = getRandom(allTexts.length);
                    return {
                        avatar: x.avatarUrl,
                        text: allTexts[randomNum]
                    };
                });
                return allVisitors;
            },
            shopping$: function () {
                var _a = this.data, shopping = _a.shopping, id = _a.id;
                return shopping
                    .filter(function (x) { return x.pid === id; })
                    .map(function (sl) {
                    var users = sl.users, sid = sl.sid, detail = sl.detail;
                    var name = detail.name;
                    return __assign({}, sl, { name: name, firstUser: users[0], otherUser: users.slice(1) });
                });
            },
            otherShopping$: function () {
                var _a = this.data, shopping = _a.shopping, id = _a.id;
                return shopping
                    .filter(function (x) { return x.pid !== id; })
                    .map(function (sl) {
                    var users = sl.users, sid = sl.sid, detail = sl.detail;
                    var name = detail.name;
                    return __assign({}, sl, { name: name, firstUser: users[0], otherUser: users.slice(1) });
                });
            },
            allPinPlayers$: function () {
                var _a = this.data, id = _a.id, shopping = _a.shopping;
                var goodShopping = shopping.filter(function (x) { return x.pid === id; });
                return goodShopping.reduce(function (x, sl) {
                    return x + sl.uids.length;
                }, 0);
            },
            countDownNight$: function () {
                var now = new Date();
                var y = now.getFullYear();
                var m = now.getMonth() + 1;
                var d = now.getDate();
                var todayOne = new Date(y + "/" + m + "/" + d + " 01:00:00");
                var tomorrowOne = todayOne.getTime() + 24 * 60 * 60 * 1000;
                return ((tomorrowOne - Date.now()) / 1000).toFixed(0);
            },
        });
    },
    watchRole: function () {
        var _this = this;
        app.watch$('role', function (val) {
            _this.setData({
                showBtn: (val === 1)
            });
        });
        app.watch$('isNew', function (val) {
            _this.setData({
                isNew: val
            });
        });
        app.watch$('appConfig', function (val) {
            if (!val) {
                return;
            }
            _this.setData({
                ipName: val['ip-name'],
                ipAvatar: val['ip-avatar'],
                pushIntegralRate: (val || {})['push-integral-get-rate'] || 0,
                canIntegrayShare: !!(val || {})['good-integral-share'] || false
            });
            _this.createShare();
        });
        app.watch$('openid', function (val) {
            _this.setData({
                openid: val
            });
            _this.createShare();
        });
        app.watch$('isUserAuth', function (val) {
            if (val === undefined) {
                return;
            }
            _this.setData({
                isUserAuth: val
            });
        });
    },
    fetDetail: function (id) {
        var _this = this;
        var _a = this.data, detail = _a.detail, from = _a.from;
        if (detail) {
            return;
        }
        http_js_1.http({
            data: {
                _id: id,
            },
            errMsg: '获取商品错误，请重试',
            url: "good_detail",
            success: function (res) {
                if (res.status !== 200) {
                    return;
                }
                var pin = [];
                var _a = res.data, standards = _a.standards, groupPrice = _a.groupPrice, activities = _a.activities;
                if (standards.length > 0) {
                    pin = standards.filter(function (x) { return !!x.groupPrice; });
                }
                else if (!!groupPrice) {
                    var _b = res.data, price = _b.price, title = _b.title, img = _b.img;
                    pin = [{
                            price: price,
                            name: title,
                            groupPrice: groupPrice,
                            img: img[0]
                        }];
                }
                ;
                var activities$ = activities.map(function (x) {
                    var img = '';
                    if (!!x.sid) {
                        img = standards.find(function (y) { return y._id === x.sid; }).img;
                    }
                    else {
                        img = res.data.img[0];
                    }
                    return Object.assign({}, x, {
                        img: img,
                        countdown: (x.endTime - new Date().getTime()) / (1000)
                    });
                }).filter(function (y) { return y.endTime > new Date().getTime(); });
                _this.setData({
                    pin: pin,
                    loading: false,
                    detail: res.data,
                    activities: activities$
                });
                if (!!from && goods_js_1.delayeringGood(res.data).hasPin) {
                    _this.setData({
                        showPlayTips: 'show'
                    });
                }
                else if (!from && goods_js_1.delayeringGood(res.data).hasPin) {
                    _this.checkOpenPin();
                }
            }
        });
    },
    fetchShopping: function (pid, tid) {
        var _this = this;
        if (!pid || !tid) {
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
                    shopping: data,
                    canPinSku: data.map(function (x) { return ({
                        pid: x.pid,
                        sid: x.sid
                    }); })
                });
            }
        });
    },
    fetchVisitRecord: function (pid, start, before) {
        var _this = this;
        if (!start || !before) {
            return;
        }
        http_js_1.http({
            url: 'good_good-visitors',
            data: {
                pid: pid,
                start: start,
                before: before
            },
            success: function (res) {
                var status = res.status, data = res.data;
                if (status !== 200) {
                    return;
                }
                _this.setData({
                    visitors: data
                });
            }
        });
    },
    fetchLast: function () {
        var _this = this;
        var id = this.data.id;
        http_js_1.http({
            data: {},
            url: "trip_enter",
            success: function (res) {
                var status = res.status, data = res.data;
                if (status !== 200) {
                    return;
                }
                var trip = data[0];
                if (!!trip) {
                    var _id = trip._id, start_date = trip.start_date, end_date = trip.end_date;
                    var tid = _id;
                    _this.fetchShopping(id, tid);
                    _this.fetchVisitRecord(id, start_date, end_date);
                    _this.setData({
                        tid: tid,
                        trip: trip
                    });
                }
            }
        });
    },
    createShare: function () {
        var _a = this.data, id = _a.id, canIntegrayShare = _a.canIntegrayShare, from = _a.from, openid = _a.openid;
        if (!id || !canIntegrayShare || !from || !openid) {
            return;
        }
        http_js_1.http({
            data: {
                from: from,
                pid: id,
            },
            url: 'common_create-share'
        });
    },
    togglePalyTips: function (e) {
        var showPlayTips = this.data.showPlayTips;
        this.setData({
            showPlayTips: showPlayTips === 'show' ? 'hide' : 'show'
        });
    },
    getUserAuth: function () {
        var _this = this;
        app.getWxUserInfo(function () {
            _this.setData({
                showPlayTips: 'hide'
            });
        });
    },
    toggleShareGetMoney: function () {
        var showShareGetMoney = this.data.showShareGetMoney;
        this.setData({
            showShareGetMoney: !showShareGetMoney
        });
        if (!showShareGetMoney) {
            this.onSubscribe();
        }
    },
    togglePinGoods: function () {
        var showPinGoods = this.data.showPinGoods;
        this.setData({
            showPinGoods: showPinGoods === 'hide' ? 'show' : 'hide'
        });
        if (showPinGoods === 'hide') {
            this.onSubscribe();
        }
    },
    onSubscribe: function () {
        app.getSubscribe('buyPin,waitPin,trip');
    },
    goManager: function () {
        route_js_1.navTo("/pages/manager-goods-detail/index?id=" + this.data.id);
    },
    goGround: function () {
        route_js_1.navTo('/pages/ground-pin/index');
    },
    goGoodDetail: function (_a) {
        var currentTarget = _a.currentTarget;
        var pid = currentTarget.dataset.pid;
        route_js_1.navTo("/pages/goods-detail/index?id=" + pid);
    },
    previewImg: function (_a) {
        var currentTarget = _a.currentTarget;
        var img = currentTarget.dataset.img;
        this.data.detail && wx.previewImage({
            current: img,
            urls: this.data.detail.img.slice(),
        });
    },
    previewSingleImg: function (_a) {
        var currentTarget = _a.currentTarget;
        var img = currentTarget.dataset.data ?
            currentTarget.dataset.data.img :
            currentTarget.dataset.img;
        this.data.detail && wx.previewImage({
            current: img,
            urls: [img],
        });
    },
    checkOpenPin: function () {
        var detail = this.data.detail;
        if (!detail) {
            return;
        }
        var result = goods_js_1.delayeringGood(detail);
        if (result) {
            var oneDay = 24 * 60 * 60 * 1000;
            var priceGap = String(result.goodPins.eachPriceRound).replace(/\.00/g, '');
            var openRecord = wx.getStorageSync(storageKey);
            if (!!priceGap && Date.now() - Number(openRecord) >= oneDay) {
                wx.setStorageSync(storageKey, String(Date.now()));
                this.togglePalyTips();
            }
        }
    },
    onLike: function () {
        var _this = this;
        var that = this;
        if (!this.data.hasInitLike) {
            return;
        }
        http_js_1.http({
            data: {
                pid: this.data.id
            },
            url: 'like_create',
            success: function (res) {
                if (res.status === 200) {
                    _this.setData({
                        liked: !_this.data.liked
                    });
                }
            }
        });
    },
    checkLike: function () {
        var _this = this;
        var that = this;
        http_js_1.http({
            data: {
                pid: this.data.id
            },
            url: 'like_check',
            success: function (res) {
                if (res.status === 200) {
                    _this.setData({
                        liked: res.data,
                        hasInitLike: true
                    });
                }
            }
        });
    },
    onPostToggle: function (e) {
        var val = e.detail;
        this.setData({
            showingPoster: val
        });
        wx.setNavigationBarTitle({
            title: val ? '分享商品' : '商品详情'
        });
    },
    openPoster: function () {
        var showingPoster = this.data.showingPoster;
        var poster = this.selectComponent('#poster');
        poster.toggle();
        if (!showingPoster) {
            this.onSubscribe();
        }
    },
    onSkuToggle: function (e) {
        this.setData({
            openingSku: e.detail
        });
    },
    onSkuTap: function (e) {
        var type = e.detail;
        if (type === 'moneyQuestion') {
            this.toggleShareGetMoney();
        }
    },
    onToggleSku: function () {
        var openingSku = this.data.openingSku;
        var sku = this.selectComponent('#sku');
        sku.toggleSku();
        if (!openingSku) {
            this.onSubscribe();
        }
    },
    onLoad: function (options) {
        var _this = this;
        var scene = decodeURIComponent(options.scene || '');
        this.runComputed();
        this.setData({
            id: '1a2751ef5cab50440283e59a10d24bec'
        });
        if (options.id || scene) {
            this.setData({
                id: options.id || scene,
            });
        }
        if (!!options.from) {
            this.setData({
                from: options.from
            });
        }
        setTimeout(function () {
            _this.watchRole();
            _this.fetchLast();
        }, 20);
    },
    onReady: function () {
        var circleCount = 0;
        var that = this;
        that.animationMiddleHeaderItem = wx.createAnimation({
            duration: 800,
            timingFunction: 'ease',
            transformOrigin: '50% 50%',
        });
        setInterval(function () {
            if (circleCount % 2 == 0) {
                that.animationMiddleHeaderItem.scale(1.0).rotate(10).step();
            }
            else {
                that.animationMiddleHeaderItem.scale(1.0).rotate(-30).step();
            }
            that.setData({
                animationMiddleHeaderItem: that.animationMiddleHeaderItem.export()
            });
            if (++circleCount === 1000) {
                circleCount = 0;
            }
        }.bind(this), 1000);
    },
    onShow: function () {
        var _a = this.data, id = _a.id, tid = _a.tid, trip = _a.trip;
        this.fetDetail(id);
        this.fetchShopping(id, tid);
        if (!!trip) {
            var _b = trip, start_date = _b.start_date, end_date = _b.end_date;
            this.fetchVisitRecord(id, start_date, end_date);
        }
    },
    onHide: function () {
    },
    onUnload: function () {
    },
    onPullDownRefresh: function () {
    },
    onReachBottom: function () {
    },
    onShareAppMessage: function (e) {
        var _a = this.data, hasOrder$ = _a.hasOrder$, detail$ = _a.detail$, openid = _a.openid;
        return {
            imageUrl: "" + detail$.img[0],
            path: "/pages/goods-detail/index?id=" + detail$._id + "&from=" + openid,
            title: !!detail$ && detail$.hasPin && !hasOrder$ ?
                "\u6709\u4EBA\u60F3\u8981\u5417\uFF1F\u62FC\u56E2\u4E70\uFF0C\u6211\u4EEC\u90FD\u80FD\u7701\uFF01" + detail$.title :
                "\u63A8\u8350\u300C" + detail$.tagText + "\u300D\u795E\u5668!" + detail$.title
        };
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7O0FBQ0EsOENBQTBDO0FBQzFDLHFEQUFvRDtBQUNwRCxnREFBcUQ7QUFDckQsZ0RBQTRDO0FBRTVDLElBQU0sR0FBRyxHQUFHLE1BQU0sRUFBUSxDQUFDO0FBRzNCLElBQU0sVUFBVSxHQUFHLG9CQUFvQixDQUFDO0FBRXhDLElBQUksQ0FBQztJQUdELHlCQUF5QixFQUFFLElBQUk7SUFLL0IsSUFBSSxFQUFFO1FBRUYsVUFBVSxFQUFFLElBQUk7UUFHaEIsTUFBTSxFQUFFLEVBQUU7UUFHVixRQUFRLEVBQUUsRUFBRTtRQUdaLEtBQUssRUFBRSxJQUFJO1FBR1gsR0FBRyxFQUFFLEVBQUU7UUFHUCxFQUFFLEVBQUUsRUFBRTtRQUdOLE1BQU0sRUFBRSxJQUFJO1FBR1osR0FBRyxFQUFFLEVBQUc7UUFHUixPQUFPLEVBQUUsSUFBSTtRQUdiLFdBQVcsRUFBRSxLQUFLO1FBR2xCLEtBQUssRUFBRSxLQUFLO1FBR1osV0FBVyxFQUFFO1lBQ1QsTUFBTSxFQUFFLE1BQU0sRUFBRSxNQUFNO1NBQ3pCO1FBR0QseUJBQXlCLEVBQUUsSUFBSTtRQUcvQixPQUFPLEVBQUUsS0FBSztRQUdkLGFBQWEsRUFBRSxLQUFLO1FBR3BCLFlBQVksRUFBRSxNQUFNO1FBR3BCLGlCQUFpQixFQUFFLEtBQUs7UUFHeEIsWUFBWSxFQUFFLE1BQU07UUFHcEIsY0FBYyxFQUFFLEtBQUs7UUFHckIsR0FBRyxFQUFFLEVBQUc7UUFHUixRQUFRLEVBQUUsRUFBRztRQUdiLFVBQVUsRUFBRSxFQUFHO1FBR2YsU0FBUyxFQUFFLEVBQUc7UUFHZCxJQUFJLEVBQUUsSUFBSTtRQUdWLGdCQUFnQixFQUFFLEtBQUs7UUFHdkIsTUFBTSxFQUFFLEVBQUU7UUFHVixJQUFJLEVBQUUsRUFBRTtRQUdSLGdCQUFnQixFQUFFLENBQUM7UUFHbkIsVUFBVSxF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QyxhQUFhLENBQUUsRUFBRSxFQUFFLEdBQUcsQ0FBRSxDQUFDO1FBRTlCLElBQUssQ0FBQyxDQUFDLElBQUksRUFBRztZQUNKLElBQUEsU0FBd0MsRUFBdEMsMEJBQVUsRUFBRSxzQkFBMEIsQ0FBQztZQUM5QyxJQUFJLENBQUMsZ0JBQWdCLENBQUUsRUFBRSxFQUFFLFVBQVUsRUFBRSxRQUFRLENBQUUsQ0FBQztTQUN0RDtJQUVMLENBQUM7SUFLRCxNQUFNLEVBQUU7SUFFUixDQUFDO0lBS0QsUUFBUSxFQUFFO0lBRVYsQ0FBQztJQUtELGlCQUFpQixFQUFFO0lBRW5CLENBQUM7SUFLRCxhQUFhLEVBQUU7SUFFZixDQUFDO0lBS0QsaUJBQWlCLEVBQUUsVUFBVyxDQUFDO1FBQ3JCLElBQUEsY0FBbUQsRUFBakQsd0JBQVMsRUFBRSxvQkFBTyxFQUFFLGtCQUE2QixDQUFDO1FBQzFELE9BQU87WUFDSCxRQUFRLEVBQUUsS0FBRyxPQUFPLENBQUMsR0FBRyxDQUFFLENBQUMsQ0FBSTtZQUMvQixJQUFJLEVBQUUsa0NBQWdDLE9BQU8sQ0FBQyxHQUFHLGNBQVMsTUFBUTtZQUNsRSxLQUFLLEVBQUUsQ0FBQyxDQUFDLE9BQU8sSUFBSSxPQUFPLENBQUMsTUFBTSxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7Z0JBQzlDLHFHQUFtQixPQUFPLENBQUMsS0FBTyxDQUFDLENBQUM7Z0JBQ3BDLHVCQUFNLE9BQU8sQ0FBQyxPQUFPLDJCQUFPLE9BQU8sQ0FBQyxLQUFPO1NBQ2xELENBQUE7SUFDTCxDQUFDO0NBQ0YsQ0FBQyxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiXG5pbXBvcnQgeyBodHRwIH0gZnJvbSAnLi4vLi4vdXRpbC9odHRwLmpzJztcbmltcG9ydCB7IGNvbXB1dGVkIH0gZnJvbSAnLi4vLi4vbGliL3Z1ZWZ5L2luZGV4LmpzJztcbmltcG9ydCB7IGRlbGF5ZXJpbmdHb29kIH0gZnJvbSAnLi4vLi4vdXRpbC9nb29kcy5qcyc7XG5pbXBvcnQgeyBuYXZUbyB9IGZyb20gJy4uLy4uL3V0aWwvcm91dGUuanMnO1xuXG5jb25zdCBhcHAgPSBnZXRBcHA8YW55PiggKTtcblxuLy8g5omT5byA5ou85Zui5o+Q56S655qEa2V5XG5jb25zdCBzdG9yYWdlS2V5ID0gJ29wZW5lZC1waW4taW4tZ29vZCc7XG5cblBhZ2Uoe1xuXG4gICAgLy8g5Yqo55S7XG4gICAgYW5pbWF0aW9uTWlkZGxlSGVhZGVySXRlbTogbnVsbCxcblxuICAgIC8qKlxuICAgICAqIOmhtemdoueahOWIneWni+aVsOaNrlxuICAgICAqL1xuICAgIGRhdGE6IHtcbiAgICAgICAgLy8g5piv5ZCm5pyJ55So5oi35o6I5p2DXG4gICAgICAgIGlzVXNlckF1dGg6IHRydWUsXG5cbiAgICAgICAgLy8gaXBcbiAgICAgICAgaXBOYW1lOiAnJyxcblxuICAgICAgICAvLyBpcCBcbiAgICAgICAgaXBBdmF0YXI6ICcnLFxuXG4gICAgICAgIC8vIOaYr+WQpuS4uuaWsOWuolxuICAgICAgICBpc05ldzogdHJ1ZSxcblxuICAgICAgICAvLyDooYznqItcbiAgICAgICAgdGlkOiAnJyxcblxuICAgICAgICAvLyDllYblk4FpZFxuICAgICAgICBpZDogJycsXG5cbiAgICAgICAgLy8g5ZWG5ZOB6K+m5oOFXG4gICAgICAgIGRldGFpbDogbnVsbCxcbiAgICAgICAgXG4gICAgICAgIC8vIOaVsOaNruWtl+WFuFxuICAgICAgICBkaWM6IHsgfSxcbiAgICAgICAgXG4gICAgICAgIC8vIOWKoOi9veeKtuaAgVxuICAgICAgICBsb2FkaW5nOiB0cnVlLFxuXG4gICAgICAgIC8vIOaYr+WQpuWIneWni+WMlui/h+KAnOWWnOasouKAnVxuICAgICAgICBoYXNJbml0TGlrZTogZmFsc2UsXG5cbiAgICAgICAgLy8g5piv5ZCm4oCc5Zac5qyi4oCdXG4gICAgICAgIGxpa2VkOiBmYWxzZSxcblxuICAgICAgICAvLyDmloflrZfkv53or4Hmj5DnpLpcbiAgICAgICAgcHJvbWlzZVRpcHM6IFtcbiAgICAgICAgICAgICfmraPlk4Hkv53or4EnLCAn5Lu35qC85LyY5Yq/JywgJ+ecn+S6uui3keiFvydcbiAgICAgICAgXSxcblxuICAgICAgICAvLyDliqjnlLtcbiAgICAgICAgYW5pbWF0aW9uTWlkZGxlSGVhZGVySXRlbTogbnVsbCxcblxuICAgICAgICAvLyDlsZXnpLrnrqHnkIblhaXlj6NcbiAgICAgICAgc2hvd0J0bjogZmFsc2UsXG5cbiAgICAgICAgLy8g5q2j5Zyo5bGV56S65rW35oqlXG4gICAgICAgIHNob3dpbmdQb3N0ZXI6IGZhbHNlLFxuXG4gICAgICAgIC8vIOWxleekuuaLvOWboueOqeazleeahOW8ueahhlxuICAgICAgICBzaG93UGxheVRpcHM6ICdoaWRlJyxcblxuICAgICAgICAvLyDlsZXnpLrliIbkuqvotZrpkrFcbiAgICAgICAgc2hvd1NoYXJlR2V0TW9uZXk6IGZhbHNlLFxuXG4gICAgICAgIC8vIOWxleekuuaLvOWbouWVhuWTgeWIl+ihqFxuICAgICAgICBzaG93UGluR29vZHM6ICdoaWRlJyxcblxuICAgICAgICAvLyDliIbkuqtUaXBzMlxuICAgICAgICBzaG93U2hhcmVUaXBzMjogZmFsc2UsXG5cbiAgICAgICAgLy8g5ou85Zui5YiX6KGoXG4gICAgICAgIHBpbjogWyBdLFxuXG4gICAgICAgIC8vIOacrOihjOeoi+eahOi0reeJqea4heWNleWIl+ihqFxuICAgICAgICBzaG9wcGluZzogWyBdLFxuXG4gICAgICAgIC8vIOS4gOWPo+S7t+a0u+WKqOWIl+ihqFxuICAgICAgICBhY3Rpdml0aWVzOiBbIF0sXG5cbiAgICAgICAgLy8g5pys6Laf6IO95aSf5ou85Zui55qEc2t1XG4gICAgICAgIGNhblBpblNrdTogWyBdLFxuXG4gICAgICAgIC8vIOW9k+WJjeeahOihjOeoi1xuICAgICAgICB0cmlwOiBudWxsLFxuXG4gICAgICAgIC8vIOW9k+WJjeaYr+WQpuW8gOWQr+S6huenr+WIhuaOqOW5v1xuICAgICAgICBjYW5JbnRlZ3JheVNoYXJlOiBmYWxzZSxcblxuICAgICAgICAvLyDlvZPliY3otKblj7fnmoRvcGVuaWRcbiAgICAgICAgb3BlbmlkOiAnJyxcblxuICAgICAgICAvLyDliIbkuqvkurrnmoRvcGVuaWRcbiAgICAgICAgZnJvbTogJycsXG5cbiAgICAgICAgLy8g56ev5YiG5o6o5bm/6I6354K55q+U5L6LXG4gICAgICAgIHB1c2hJbnRlZ3JhbFJhdGU6IDAsXG5cbiAgICAgICAgLy8g5piv5ZCm5bGV5byAc2t1XG4gICAgICAgIG9wZW5pbmdTa3U6IGZhbHNlLFxuXG4gICAgICAgIC8vIOiuv+mXruiusOW9lVxuICAgICAgICB2aXNpdG9yczogWyBdXG4gICAgfSxcblxuICAgIC8qKiDorr7nva5jb21wdXRlZCAqL1xuICAgIHJ1bkNvbXB1dGVkKCApIHtcbiAgICAgICAgY29tcHV0ZWQoIHRoaXMsIHtcblxuICAgICAgICAgICAgLy8g6K6h566X5Lu35qC8XG4gICAgICAgICAgICBwcmljZTogZnVuY3Rpb24oICkge1xuICAgICAgICAgICAgICAgIGNvbnN0IHsgZGV0YWlsIH0gPSB0aGlzLmRhdGE7XG4gICAgICAgICAgICAgICAgY29uc3QgcmVzdWx0ID0gZGVsYXllcmluZ0dvb2QoIGRldGFpbCApO1xuICAgICAgICAgICAgICAgIHJldHVybiByZXN1bHQgPyByZXN1bHQucHJpY2UkIDogJyc7XG4gICAgICAgICAgICB9LFxuXG4gICAgICAgICAgICAvLyDllYblk4Hor6bmg4UgLSDliIbooYzmmL7npLpcbiAgICAgICAgICAgIGRldGFpbEludHJvOiBmdW5jdGlvbiggKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgeyBkZXRhaWwgfSA9IHRoaXMuZGF0YTtcbiAgICAgICAgICAgICAgICBpZiAoICFkZXRhaWwgfHwgKCAhIWRldGFpbCAmJiAhZGV0YWlsLmRldGFpbCApKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBbIF07XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGRldGFpbC5kZXRhaWwuc3BsaXQoJ1xcbicpLmZpbHRlciggeCA9PiAhIXggKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LFxuXG4gICAgICAgICAgICAvLyDku7fmoLwg772eIOWboui0reS7t+eahOW3ruS7t1xuICAgICAgICAgICAgcHJpY2VHYXA6IGZ1bmN0aW9uKCApIHtcbiAgICAgICAgICAgICAgICBjb25zdCB7IGRldGFpbCB9ID0gdGhpcy5kYXRhO1xuICAgICAgICAgICAgICAgIGlmICggIWRldGFpbCApIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuICcnXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgcmVzdWx0ID0gZGVsYXllcmluZ0dvb2QoIGRldGFpbCApO1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBnYXAgPSByZXN1bHQgPyBTdHJpbmcoIHJlc3VsdC5nb29kUGlucy5lYWNoUHJpY2VSb3VuZCApLnJlcGxhY2UoL1xcLjAwL2csICcnKSA6ICcnO1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBtZXRhID0gZ2FwICE9PSAnMCcgJiYgISFnYXAgPyBnYXAgOiAnJztcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG1ldGE7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAgLy8g6ams5LiK5Y+v5Lul5ou85Zui55qE5Liq5pWwXG4gICAgICAgICAgICBwaW5Db3VudCQ6IGZ1bmN0aW9uKCApIHtcbiAgICAgICAgICAgICAgICBjb25zdCB7IGlkLCBkZXRhaWwgfSA9IHRoaXMuZGF0YTtcbiAgICAgICAgICAgICAgICBjb25zdCBnb29kU2hvcHBpbmcgPSB0aGlzLmRhdGEuc2hvcHBpbmcuZmlsdGVyKCB4ID0+IHgucGlkID09PSBpZCApO1xuICAgICAgICAgICAgICAgIGlmICggIWRldGFpbCApIHsgXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAwO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGNvbnN0IHsgc3RhbmRhcmRzLCBncm91cFByaWNlIH0gPSBkZXRhaWw7XG5cbiAgICAgICAgICAgICAgICBpZiAoICEhc3RhbmRhcmRzICYmIHN0YW5kYXJkcy5sZW5ndGggPiAwICkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gc3RhbmRhcmRzXG4gICAgICAgICAgICAgICAgICAgICAgICAuZmlsdGVyKCB4ID0+ICEhZ29vZFNob3BwaW5nLmZpbmQoIHMgPT4gcy5zaWQgPT09IHguX2lkICYmIHMucGlkID09PSB4LnBpZCApKVxuICAgICAgICAgICAgICAgICAgICAgICAgLmxlbmd0aDtcblxuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoICEhZ3JvdXBQcmljZSApIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgeyBfaWQgfSA9IGRldGFpbDtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuICEhZ29vZFNob3BwaW5nLmZpbmQoIHMgPT4gcy5waWQgPT09IF9pZCApID8gMSA6IDBcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gMDtcbiAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgIC8vIOaLvOWbouWIl+ihqFxuICAgICAgICAgICAgcGluJDogZnVuY3Rpb24oICkge1xuICAgICAgICAgICAgICAgIGxldCBtZXRhOiBhbnkgPSBbIF07XG4gICAgICAgICAgICAgICAgY29uc3QgeyBkZXRhaWwsIHNob3BwaW5nLCBhY3Rpdml0aWVzIH0gPSB0aGlzLmRhdGE7XG5cbiAgICAgICAgICAgICAgICBpZiAoICFkZXRhaWwgKSB7IFxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gWyBdO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGNvbnN0IHsgc3RhbmRhcmRzLCBncm91cFByaWNlIH0gPSBkZXRhaWw7XG5cbiAgICAgICAgICAgICAgICBpZiAoIHN0YW5kYXJkcy5sZW5ndGggPiAwICkge1xuICAgICAgICAgICAgICAgICAgICBtZXRhID0gc3RhbmRhcmRzXG4gICAgICAgICAgICAgICAgICAgICAgICAuZmlsdGVyKCB4ID0+ICEheC5ncm91cFByaWNlIClcbiAgICAgICAgICAgICAgICAgICAgICAgIC5tYXAoIHggPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBPYmplY3QuYXNzaWduKHsgfSwgeCwge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzaWQ6IHguX2lkLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYW5QaW46ICEhc2hvcHBpbmcuZmluZCggcyA9PiBzLnNpZCA9PT0geC5faWQgJiYgcy5waWQgPT09IHgucGlkIClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKCAhIWdyb3VwUHJpY2UgKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHsgcHJpY2UsIHRpdGxlLCBpbWcsIF9pZCB9ID0gZGV0YWlsO1xuICAgICAgICAgICAgICAgICAgICBtZXRhID0gW3tcbiAgICAgICAgICAgICAgICAgICAgICAgIHByaWNlLFxuICAgICAgICAgICAgICAgICAgICAgICAgcGlkOiBfaWQsXG4gICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiB0aXRsZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGdyb3VwUHJpY2UsXG4gICAgICAgICAgICAgICAgICAgICAgICBzaWQ6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICAgICAgICAgIGltZzogaW1nWyAwIF0sXG4gICAgICAgICAgICAgICAgICAgICAgICBjYW5QaW46ICEhc2hvcHBpbmcuZmluZCggcyA9PiBzLnBpZCA9PT0gX2lkIClcbiAgICAgICAgICAgICAgICAgICAgfV07XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgLy8g5qC55o2u5rS75Yqo77yM5pu05pS544CB5paw5aKe5ou85Zui6aG555uuXG4gICAgICAgICAgICAgICAgYWN0aXZpdGllcy5tYXAoIGFjID0+IHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCAhYWMuYWNfZ3JvdXBQcmljZSApIHsgcmV0dXJuOyB9XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHBpblRhcmdldCA9IG1ldGEuZmluZCggeCA9PiB4LnBpZCA9PT0gYWMucGlkICYmIHguc2lkID09PSBhYy5zaWQgKTtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgcGluVGFyZ2V0SW5kZXggPSBtZXRhLmZpbmRJbmRleCggeCA9PiB4LnBpZCA9PT0gYWMucGlkICYmIHguc2lkID09PSBhYy5zaWQgKTtcblxuICAgICAgICAgICAgICAgICAgICAvLyDmm7/mjaJcbiAgICAgICAgICAgICAgICAgICAgaWYgKCBwaW5UYXJnZXRJbmRleCAhPT0gLTEgKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBtZXRhLnNwbGljZSggcGluVGFyZ2V0SW5kZXgsIDEsIE9iamVjdC5hc3NpZ24oeyB9LCBwaW5UYXJnZXQsIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcmljZTogYWMuYWNfcHJpY2UsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZ3JvdXBQcmljZTogYWMuYWNfZ3JvdXBQcmljZVxuICAgICAgICAgICAgICAgICAgICAgICAgfSkpO1xuXG4gICAgICAgICAgICAgICAgICAgIC8vIOaWsOWinlxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgbWV0YS5wdXNoKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzaWQ6IGFjLnNpZCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwaWQ6IGFjLnBpZCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbWc6IGFjLmltZyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiBhYy50aXRsZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYW5QaW46ICEhc2hvcHBpbmcuZmluZCggcyA9PiBzLnNpZCA9PT0gYWMuc2lkICYmIHMucGlkID09PSBhYy5waWQgKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcmljZTogYWMuYWNfcHJpY2UsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZ3JvdXBQcmljZTogYWMuYWNfZ3JvdXBQcmljZSBcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgIGNvbnN0IG1ldGEyID0gbWV0YS5tYXAoIHggPT4gT2JqZWN0LmFzc2lnbih7IH0sIHgsIHtcbiAgICAgICAgICAgICAgICAgICAgZGVsdGE6IE51bWJlciggeC5wcmljZSAtIHguZ3JvdXBQcmljZSApLnRvRml4ZWQoIDAgKVxuICAgICAgICAgICAgICAgIH0pKTtcblxuICAgICAgICAgICAgICAgIHJldHVybiBtZXRhMjtcbiAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgIC8vIOenr+WIhuWMuumXtFxuICAgICAgICAgICAgaW50ZWdyYWwkOiBmdW5jdGlvbiggKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgeyBkZXRhaWwsIHB1c2hJbnRlZ3JhbFJhdGUgfSA9IHRoaXMuZGF0YTtcbiAgICAgICAgICAgICAgICBpZiAoICFkZXRhaWwgKSB7IFxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gJyc7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGNvbnN0IHJlc3VsdCA9IGRlbGF5ZXJpbmdHb29kKCBkZXRhaWwsIHB1c2hJbnRlZ3JhbFJhdGUgKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVzdWx0LmludGVncmFsJDtcbiAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgIC8vIOivpuaDhVxuICAgICAgICAgICAgZGV0YWlsJDogZnVuY3Rpb24oICkge1xuICAgICAgICAgICAgICAgIGNvbnN0IHsgZGV0YWlsIH0gPSB0aGlzLmRhdGE7XG4gICAgICAgICAgICAgICAgY29uc3QgciA9IGRlbGF5ZXJpbmdHb29kKCBkZXRhaWwgKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gcjtcbiAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgIC8vIOatpOi0puWPt++8jOaYr+WQpuacieWNlVxuICAgICAgICAgICAgaGFzT3JkZXIkKCApIHtcbiAgICAgICAgICAgICAgICBjb25zdCB7IG9wZW5pZCwgdHJpcFNob3BwaW5nbGlzdCB9ID0gdGhpcy5kYXRhO1xuICAgICAgICAgICAgICAgIGNvbnN0IHIgPSAodHJpcFNob3BwaW5nbGlzdCB8fCBbIF0pXG4gICAgICAgICAgICAgICAgICAgIC5maWx0ZXIoIHNsID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHsgdWlkcyB9ID0gc2w7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdWlkcy5pbmNsdWRlcyggb3BlbmlkICk7XG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgY29uc3QgcmVzdWx0ID0gQXJyYXkuaXNBcnJheSggdHJpcFNob3BwaW5nbGlzdCApICYmIHRyaXBTaG9wcGluZ2xpc3QubGVuZ3RoID4gMFxuICAgICAgICAgICAgICAgICAgICA/IHIubGVuZ3RoID4gMCA6IGZhbHNlO1xuICAgICAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICAgICAgICB9LFxuXG4gICAgICAgICAgICAvLyDllYblk4HnmoTorr/pl67orrDlvZVcbiAgICAgICAgICAgIHZpc2l0b3JzJCggKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgeyB2aXNpdG9ycywgb3BlbmlkIH0gPSB0aGlzLmRhdGE7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHZpc2l0b3JzLmZpbHRlciggeCA9PiB4Lm9wZW5pZCAhPT0gb3BlbmlkICk7XG4gICAgICAgICAgICB9LFxuXG4gICAgICAgICAgICAvLyDllYblk4HnmoTorr/pl64gKyDnpL7kuqTlsZ7mgKfmqKHlnZdcbiAgICAgICAgICAgIHNvY2lhbCQoICkge1xuICAgICAgICAgICAgICAgIGNvbnN0IHsgdmlzaXRvcnMsIG9wZW5pZCwgZGV0YWlsIH0gPSB0aGlzLmRhdGE7XG4gICAgICAgICAgICAgICAgY29uc3QgZ29vZCA9IGRlbGF5ZXJpbmdHb29kKCBkZXRhaWwgKTsgXG4gICAgICAgICAgICAgICAgY29uc3QgZ2V0UmFuZG9tID0gbiA9PiBNYXRoLmZsb29yKCBNYXRoLnJhbmRvbSggKSAqIG4gKTtcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICBjb25zdCBhbGxUZXh0cyA9IFtcbiAgICAgICAgICAgICAgICAgICAgYOe+pOmHjOeahOWlueS5n+WcqOeci2AsXG4gICAgICAgICAgICAgICAgICAgIGDnvqTph4znmoTlpbnkuZ/lhbPms6jjgIwke2dvb2QudGFnVGV4dH3jgI1gLFxuICAgICAgICAgICAgICAgICAgICBg5aW55Lmf5oSf5YW06Laj77yM6Lef5aW55ou85ZuiYFxuICAgICAgICAgICAgICAgIF07XG5cbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICBjb25zdCBhbGxWaXNpdG9ycyA9IHZpc2l0b3JzXG4gICAgICAgICAgICAgICAgICAgIC5maWx0ZXIoIHggPT4gdHJ1ZXx8IHgub3BlbmlkICE9PSBvcGVuaWQgKVxuICAgICAgICAgICAgICAgICAgICAubWFwKCB4ID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHJhbmRvbU51bSA9IGdldFJhbmRvbSggYWxsVGV4dHMubGVuZ3RoICk7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGF2YXRhcjogeC5hdmF0YXJVcmwsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGV4dDogYWxsVGV4dHNbIHJhbmRvbU51bSBdXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgcmV0dXJuIGFsbFZpc2l0b3JzO1xuXG4gICAgICAgICAgICB9LFxuXG4gICAgICAgICAgICAvLyDlvZPliY3llYblk4HnmoTotK3nianmuIXljZVcbiAgICAgICAgICAgIHNob3BwaW5nJCggKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgeyBzaG9wcGluZywgaWQgfSA9IHRoaXMuZGF0YTtcbiAgICAgICAgICAgICAgICByZXR1cm4gc2hvcHBpbmdcbiAgICAgICAgICAgICAgICAgICAgLmZpbHRlciggeCA9PiB4LnBpZCA9PT0gaWQgKVxuICAgICAgICAgICAgICAgICAgICAubWFwKCBzbCA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCB7IHVzZXJzLCBzaWQsIGRldGFpbCB9ID0gc2w7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCB7IG5hbWUgfSA9IGRldGFpbDtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLi4uc2wsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbmFtZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmaXJzdFVzZXI6IHVzZXJzWyAwIF0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb3RoZXJVc2VyOiB1c2Vycy5zbGljZSggMSApLFxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAgLy8g6KGM56iL5Lit55qE5YW25LuW6LSt54mp5riF5Y2VXG4gICAgICAgICAgICBvdGhlclNob3BwaW5nJCggKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgeyBzaG9wcGluZywgaWQgfSA9IHRoaXMuZGF0YTtcbiAgICAgICAgICAgICAgICByZXR1cm4gc2hvcHBpbmdcbiAgICAgICAgICAgICAgICAgICAgLmZpbHRlciggeCA9PiB4LnBpZCAhPT0gaWQgKVxuICAgICAgICAgICAgICAgICAgICAubWFwKCBzbCA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCB7IHVzZXJzLCBzaWQsIGRldGFpbCB9ID0gc2w7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCB7IG5hbWUgfSA9IGRldGFpbDtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLi4uc2wsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbmFtZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmaXJzdFVzZXI6IHVzZXJzWyAwIF0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb3RoZXJVc2VyOiB1c2Vycy5zbGljZSggMSApLFxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAgLy8g6KGM56iL5Lit77yM5b2T5YmN5Lqn5ZOB5omA5pyJ5Z6L5Y+35Yqg6LW35p2l77yM5pyJ5aSa5bCR5Lq65Zyo5ou85ZuiXG4gICAgICAgICAgICBhbGxQaW5QbGF5ZXJzJCggKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgeyBpZCwgc2hvcHBpbmcgfSA9IHRoaXMuZGF0YTtcbiAgICAgICAgICAgICAgICBjb25zdCBnb29kU2hvcHBpbmcgPSBzaG9wcGluZy5maWx0ZXIoIHggPT4geC5waWQgPT09IGlkICk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGdvb2RTaG9wcGluZy5yZWR1Y2UoKCB4LCBzbCApID0+IHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHggKyBzbC51aWRzLmxlbmd0aDtcbiAgICAgICAgICAgICAgICB9LCAwICk7XG4gICAgICAgICAgICB9LFxuXG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIOeOsOWcqOWIsOWHjOaZqDHngrnnmoTlgJLorqHml7ZcbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgY291bnREb3duTmlnaHQkKCApIHtcbiAgICAgICAgICAgICAgICBjb25zdCBub3cgPSBuZXcgRGF0ZSggKTtcbiAgICAgICAgICAgICAgICBjb25zdCB5ID0gbm93LmdldEZ1bGxZZWFyKCApO1xuICAgICAgICAgICAgICAgIGNvbnN0IG0gPSBub3cuZ2V0TW9udGgoICkgKyAxO1xuICAgICAgICAgICAgICAgIGNvbnN0IGQgPSBub3cuZ2V0RGF0ZSggKTtcbiAgICAgICAgICAgICAgICBjb25zdCB0b2RheU9uZSA9IG5ldyBEYXRlKGAke3l9LyR7bX0vJHtkfSAwMTowMDowMGApO1xuICAgICAgICAgICAgICAgIGNvbnN0IHRvbW9ycm93T25lID0gdG9kYXlPbmUuZ2V0VGltZSggKSArIDI0ICogNjAgKiA2MCAqIDEwMDA7XG4gICAgICAgICAgICAgICAgcmV0dXJuICgoIHRvbW9ycm93T25lIC0gRGF0ZS5ub3coICkpIC8gMTAwMCApLnRvRml4ZWQoIDAgKTtcbiAgICAgICAgICAgIH0sXG5cbiAgICAgICAgfSlcbiAgICB9LFxuXG4gICAgLyoqIOebkeWQrOWFqOWxgOeuoeeQhuWRmOadg+mZkCAqL1xuICAgIHdhdGNoUm9sZSggKSB7XG4gICAgICAgIChhcHAgYXMgYW55KS53YXRjaCQoJ3JvbGUnLCAoIHZhbCApID0+IHtcbiAgICAgICAgICAgIHRoaXMuc2V0RGF0YSEoe1xuICAgICAgICAgICAgICAgIHNob3dCdG46ICggdmFsID09PSAxIClcbiAgICAgICAgICAgIH0pXG4gICAgICAgIH0pO1xuICAgICAgICAoYXBwIGFzIGFueSkud2F0Y2gkKCdpc05ldycsIHZhbCA9PiB7XG4gICAgICAgICAgICB0aGlzLnNldERhdGEhKHtcbiAgICAgICAgICAgICAgICBpc05ldzogdmFsXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgICAgIChhcHAgYXMgYW55KS53YXRjaCQoJ2FwcENvbmZpZycsIHZhbCA9PiB7XG4gICAgICAgICAgICBpZiAoICF2YWwgKSB7IHJldHVybjsgfVxuICAgICAgICAgICAgdGhpcy5zZXREYXRhISh7XG4gICAgICAgICAgICAgICAgaXBOYW1lOiB2YWxbJ2lwLW5hbWUnXSxcbiAgICAgICAgICAgICAgICBpcEF2YXRhcjogdmFsWydpcC1hdmF0YXInXSxcbiAgICAgICAgICAgICAgICBwdXNoSW50ZWdyYWxSYXRlOiAodmFsIHx8IHsgfSlbJ3B1c2gtaW50ZWdyYWwtZ2V0LXJhdGUnXSB8fCAwLFxuICAgICAgICAgICAgICAgIGNhbkludGVncmF5U2hhcmU6ICEhKHZhbCB8fCB7IH0pWydnb29kLWludGVncmFsLXNoYXJlJ10gfHwgZmFsc2VcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgdGhpcy5jcmVhdGVTaGFyZSggKTtcbiAgICAgICAgfSk7XG4gICAgICAgIChhcHAgYXMgYW55KS53YXRjaCQoJ29wZW5pZCcsIHZhbCA9PiB7XG4gICAgICAgICAgICB0aGlzLnNldERhdGEhKHtcbiAgICAgICAgICAgICAgICBvcGVuaWQ6IHZhbFxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB0aGlzLmNyZWF0ZVNoYXJlKCApO1xuICAgICAgICB9KTtcbiAgICAgICAgYXBwLndhdGNoJCgnaXNVc2VyQXV0aCcsIHZhbCA9PiB7XG4gICAgICAgICAgICBpZiAoIHZhbCA9PT0gdW5kZWZpbmVkICkgeyByZXR1cm47IH1cbiAgICAgICAgICAgIHRoaXMuc2V0RGF0YSEoe1xuICAgICAgICAgICAgICAgIGlzVXNlckF1dGg6IHZhbFxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH0sXG5cbiAgICAvKiog5ouJ5Y+W5ZWG5ZOB6K+m5oOFICovXG4gICAgZmV0RGV0YWlsKCBpZCApIHtcbiAgICAgICAgY29uc3QgeyBkZXRhaWwsIGZyb20gfSA9IHRoaXMuZGF0YTtcbiAgICAgICAgaWYgKCBkZXRhaWwgKSB7IHJldHVybjsgfVxuICAgICAgICBodHRwKHtcbiAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICBfaWQ6IGlkLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGVyck1zZzogJ+iOt+WPluWVhuWTgemUmeivr++8jOivt+mHjeivlScsXG4gICAgICAgICAgICB1cmw6IGBnb29kX2RldGFpbGAsXG4gICAgICAgICAgICBzdWNjZXNzOiByZXMgPT4ge1xuICAgICAgICAgICAgICBpZiAoIHJlcy5zdGF0dXMgIT09IDIwMCApIHsgcmV0dXJuOyB9XG5cbiAgICAgICAgICAgICAgICBsZXQgcGluOiBhbnkgPSBbIF07XG4gICAgICAgICAgICAgICAgY29uc3QgeyBzdGFuZGFyZHMsIGdyb3VwUHJpY2UsIGFjdGl2aXRpZXMgfSA9IHJlcy5kYXRhO1xuXG4gICAgICAgICAgICAgICAgaWYgKCBzdGFuZGFyZHMubGVuZ3RoID4gMCApIHtcbiAgICAgICAgICAgICAgICAgICAgcGluID0gc3RhbmRhcmRzLmZpbHRlciggeCA9PiAhIXguZ3JvdXBQcmljZSApO1xuXG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmICggISFncm91cFByaWNlICkge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCB7IHByaWNlLCB0aXRsZSwgaW1nICB9ID0gcmVzLmRhdGE7XG4gICAgICAgICAgICAgICAgICAgIHBpbiA9IFt7XG4gICAgICAgICAgICAgICAgICAgICAgICBwcmljZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6IHRpdGxlLFxuICAgICAgICAgICAgICAgICAgICAgICAgZ3JvdXBQcmljZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGltZzogaW1nWyAwIF1cbiAgICAgICAgICAgICAgICAgICAgfV07XG4gICAgICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgICAgIGNvbnN0IGFjdGl2aXRpZXMkID0gYWN0aXZpdGllcy5tYXAoIHggPT4ge1xuXG4gICAgICAgICAgICAgICAgICAgIGxldCBpbWcgPSAnJztcbiAgICAgICAgICAgICAgICAgICAgaWYgKCAhIXguc2lkICkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaW1nID0gc3RhbmRhcmRzLmZpbmQoIHkgPT4geS5faWQgPT09IHguc2lkICkuaW1nXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpbWcgPSByZXMuZGF0YS5pbWdbIDAgXTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBPYmplY3QuYXNzaWduKHsgfSwgeCwgeyBcbiAgICAgICAgICAgICAgICAgICAgICAgIGltZyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvdW50ZG93bjogKCB4LmVuZFRpbWUgLSBuZXcgRGF0ZSggKS5nZXRUaW1lKCApKSAvICggMTAwMCApXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgfSkuZmlsdGVyKCB5ID0+IHkuZW5kVGltZSA+IG5ldyBEYXRlKCApLmdldFRpbWUoICkpO1xuXG4gICAgICAgICAgICAgICAgdGhpcy5zZXREYXRhISh7XG4gICAgICAgICAgICAgICAgICAgIHBpbixcbiAgICAgICAgICAgICAgICAgICAgbG9hZGluZzogZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgIGRldGFpbDogcmVzLmRhdGEsXG4gICAgICAgICAgICAgICAgICAgIGFjdGl2aXRpZXM6IGFjdGl2aXRpZXMkXG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICAvLyDlvLnotbfmi7zlm6LmoYZcbiAgICAgICAgICAgICAgICBpZiAoICEhZnJvbSAmJiBkZWxheWVyaW5nR29vZCggcmVzLmRhdGEgKS5oYXNQaW4gKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc2V0RGF0YSEoe1xuICAgICAgICAgICAgICAgICAgICAgICAgc2hvd1BsYXlUaXBzOiAnc2hvdydcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmICggIWZyb20gJiYgZGVsYXllcmluZ0dvb2QoIHJlcy5kYXRhICkuaGFzUGluICkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmNoZWNrT3BlblBpbiggKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH0sXG5cbiAgICAvKiog5ouJ5Y+W6KGM56iL55qE6LSt54mp6K+35Y2V5L+h5oGvICovXG4gICAgZmV0Y2hTaG9wcGluZyggcGlkLCB0aWQgKSB7XG4gICAgICAgIGlmICggIXBpZCB8fCAhdGlkICkgeyByZXR1cm47IH1cblxuICAgICAgICBodHRwKHtcbiAgICAgICAgICAgIHVybDogJ3Nob3BwaW5nLWxpc3RfcGluJyxcbiAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAvLyBwaWQsXG4gICAgICAgICAgICAgICAgdGlkLFxuICAgICAgICAgICAgICAgIGRldGFpbDogdHJ1ZSxcbiAgICAgICAgICAgICAgICBzaG93VXNlcjogdHJ1ZVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHN1Y2Nlc3M6IHJlcyA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3QgeyBzdGF0dXMsIGRhdGEgfSA9IHJlcztcbiAgICAgICAgICAgICAgICBpZiAoIHN0YXR1cyAhPT0gMjAwICkgeyByZXR1cm47IH1cbiAgICAgICAgICAgICAgICB0aGlzLnNldERhdGEhKHtcbiAgICAgICAgICAgICAgICAgICAgc2hvcHBpbmc6IGRhdGEsXG4gICAgICAgICAgICAgICAgICAgIGNhblBpblNrdTogZGF0YS5tYXAoIHggPT4gKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHBpZDogeC5waWQsXG4gICAgICAgICAgICAgICAgICAgICAgICBzaWQ6IHguc2lkXG4gICAgICAgICAgICAgICAgICAgIH0pKVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KVxuICAgIH0sXG5cbiAgICAvKiog5ouJ5Y+W5b2T5YmN5ZWG5ZOB55qE6K6/6Zeu6K6w5b2VICovXG4gICAgZmV0Y2hWaXNpdFJlY29yZCggcGlkLCBzdGFydCwgYmVmb3JlICkge1xuICAgICAgICBpZiAoICFzdGFydCB8fCAhYmVmb3JlICkgeyByZXR1cm47IH1cbiAgICAgICAgaHR0cCh7XG4gICAgICAgICAgICB1cmw6ICdnb29kX2dvb2QtdmlzaXRvcnMnLFxuICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgIHBpZCxcbiAgICAgICAgICAgICAgICBzdGFydCwgXG4gICAgICAgICAgICAgICAgYmVmb3JlXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgc3VjY2VzczogcmVzID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCB7IHN0YXR1cywgZGF0YSB9ID0gcmVzO1xuICAgICAgICAgICAgICAgIGlmICggc3RhdHVzICE9PSAyMDAgKSB7IHJldHVybjsgfVxuICAgICAgICAgICAgICAgIHRoaXMuc2V0RGF0YSEoe1xuICAgICAgICAgICAgICAgICAgICB2aXNpdG9yczogZGF0YVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9LFxuXG4gICAgLyoqIOaLieWPluS4pOS4quacgOaWsOihjOeoiyAqL1xuICAgIGZldGNoTGFzdCggKSB7XG4gICAgICAgIGNvbnN0IHsgaWQgfSA9IHRoaXMuZGF0YTtcbiAgICAgICAgaHR0cCh7XG4gICAgICAgICAgICBkYXRhOiB7IH0sXG4gICAgICAgICAgICB1cmw6IGB0cmlwX2VudGVyYCxcbiAgICAgICAgICAgIHN1Y2Nlc3M6IHJlcyA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3QgeyBzdGF0dXMsIGRhdGEgfSA9IHJlcztcbiAgICAgICAgICAgICAgICBpZiAoIHN0YXR1cyAhPT0gMjAwICkgeyByZXR1cm47IH1cbiAgICAgICAgICAgICAgICBjb25zdCB0cmlwID0gZGF0YVsgMCBdO1xuICAgICAgICAgICAgICAgIGlmICggISF0cmlwICkge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCB7IF9pZCwgc3RhcnRfZGF0ZSwgZW5kX2RhdGUgfSA9IHRyaXA7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHRpZCA9IF9pZFxuXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZmV0Y2hTaG9wcGluZyggaWQsIHRpZCApO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmZldGNoVmlzaXRSZWNvcmQoIGlkLCBzdGFydF9kYXRlLCBlbmRfZGF0ZSApO1xuXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc2V0RGF0YSEoe1xuICAgICAgICAgICAgICAgICAgICAgICAgdGlkLFxuICAgICAgICAgICAgICAgICAgICAgICAgdHJpcFxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgfSxcblxuICAgIC8qKiDliJvlu7rliIbkuqvorrDlvZUgKi9cbiAgICBjcmVhdGVTaGFyZSggKSB7XG4gICAgICAgIGNvbnN0IHsgaWQsIGNhbkludGVncmF5U2hhcmUsIGZyb20sIG9wZW5pZCB9ID0gdGhpcy5kYXRhO1xuICAgICAgICBpZiAoICFpZCB8fCAhY2FuSW50ZWdyYXlTaGFyZSB8fCAhZnJvbSB8fCAhb3BlbmlkICkgeyByZXR1cm47IH1cbiAgICAgICAgaHR0cCh7XG4gICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgZnJvbSxcbiAgICAgICAgICAgICAgICBwaWQ6IGlkLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHVybDogJ2NvbW1vbl9jcmVhdGUtc2hhcmUnXG4gICAgICAgIH0pO1xuICAgIH0sXG5cbiAgICAvLyDlsZXlvIDmi7zlm6Lnjqnms5Xmj5DnpLpcbiAgICB0b2dnbGVQYWx5VGlwcyggZT8gKSB7XG4gICAgICAgIGNvbnN0IHsgc2hvd1BsYXlUaXBzIH0gPSB0aGlzLmRhdGE7XG4gICAgICAgIHRoaXMuc2V0RGF0YSEoe1xuICAgICAgICAgICAgc2hvd1BsYXlUaXBzOiBzaG93UGxheVRpcHMgPT09ICdzaG93JyA/ICdoaWRlJyA6ICdzaG93J1xuICAgICAgICB9KTtcbiAgICB9LFxuXG4gICAgLy8g6I635Y+W5o6I5p2D44CB5YWz6Zet5ou85Zui546p5rOV5o+Q56S6XG4gICAgZ2V0VXNlckF1dGgoICkge1xuICAgICAgICBhcHAuZ2V0V3hVc2VySW5mbygoICkgPT4ge1xuICAgICAgICAgICAgdGhpcy5zZXREYXRhISh7XG4gICAgICAgICAgICAgICAgc2hvd1BsYXlUaXBzOiAnaGlkZSdcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9LFxuXG4gICAgLy8g5bGV56S65o6o5bm/56ev5YiG6KeE5YiZXG4gICAgdG9nZ2xlU2hhcmVHZXRNb25leSggKSB7XG4gICAgICAgIGNvbnN0IHsgc2hvd1NoYXJlR2V0TW9uZXkgfSA9IHRoaXMuZGF0YTtcbiAgICAgICAgdGhpcy5zZXREYXRhISh7XG4gICAgICAgICAgICBzaG93U2hhcmVHZXRNb25leTogIXNob3dTaGFyZUdldE1vbmV5XG4gICAgICAgIH0pO1xuICAgICAgICBpZiAoICFzaG93U2hhcmVHZXRNb25leSApIHtcbiAgICAgICAgICAgIHRoaXMub25TdWJzY3JpYmUoICk7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgLy8g5bGV56S65ou85Zui5YiX6KGoXG4gICAgdG9nZ2xlUGluR29vZHMoICkge1xuICAgICAgICBjb25zdCB7IHNob3dQaW5Hb29kcyB9ID0gdGhpcy5kYXRhO1xuICAgICAgICB0aGlzLnNldERhdGEhKHtcbiAgICAgICAgICAgIHNob3dQaW5Hb29kczogc2hvd1Bpbkdvb2RzID09PSAnaGlkZScgPyAnc2hvdycgOiAnaGlkZSdcbiAgICAgICAgfSk7XG4gICAgICAgIGlmICggc2hvd1Bpbkdvb2RzID09PSAnaGlkZScgKSB7XG4gICAgICAgICAgICB0aGlzLm9uU3Vic2NyaWJlKCApO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIG9uU3Vic2NyaWJlKCApIHtcbiAgICAgICAgYXBwLmdldFN1YnNjcmliZSgnYnV5UGluLHdhaXRQaW4sdHJpcCcpO1xuICAgIH0sXG5cbiAgICAvLyDov5vlhaXllYblk4HnrqHnkIZcbiAgICBnb01hbmFnZXIoICkge1xuICAgICAgICBuYXZUbyhgL3BhZ2VzL21hbmFnZXItZ29vZHMtZGV0YWlsL2luZGV4P2lkPSR7dGhpcy5kYXRhLmlkfWApO1xuICAgIH0sXG5cbiAgICAvLyDov5vlhaXmi7zlm6Llub/lnLpcbiAgICBnb0dyb3VuZCggKSB7XG4gICAgICAgIG5hdlRvKCcvcGFnZXMvZ3JvdW5kLXBpbi9pbmRleCcpXG4gICAgfSxcbiAgICBcbiAgICAvLyDov5vlhaXllYblk4Hor6bmg4VcbiAgICBnb0dvb2REZXRhaWwoeyBjdXJyZW50VGFyZ2V0IH0pIHtcbiAgICAgICAgY29uc3QgeyBwaWQgfSA9IGN1cnJlbnRUYXJnZXQuZGF0YXNldDtcbiAgICAgICAgbmF2VG8oYC9wYWdlcy9nb29kcy1kZXRhaWwvaW5kZXg/aWQ9JHtwaWR9YClcbiAgICB9LFxuXG4gICAgLyoqIOmihOiniOWbvueJhyAqL1xuICAgIHByZXZpZXdJbWcoeyBjdXJyZW50VGFyZ2V0IH0pIHtcbiAgICAgICAgY29uc3QgeyBpbWcgfSA9IGN1cnJlbnRUYXJnZXQuZGF0YXNldDtcbiAgICAgICAgdGhpcy5kYXRhLmRldGFpbCAmJiB3eC5wcmV2aWV3SW1hZ2Uoe1xuICAgICAgICAgICAgY3VycmVudDogaW1nLFxuICAgICAgICAgICAgdXJsczogWyAuLi4odGhpcy5kYXRhIGFzIGFueSkuZGV0YWlsLmltZyBdLFxuICAgICAgICB9KTtcbiAgICB9LFxuXG4gICAgLyoqIOmihOiniOWNleW8oOWbvueJh++8muaLvOWbouWbvueJh+OAgeS4gOWPo+S7t++8iOmZkOaXtuaKou+8iSAqL1xuICAgIHByZXZpZXdTaW5nbGVJbWcoeyBjdXJyZW50VGFyZ2V0IH0pIHtcblxuICAgICAgICBjb25zdCBpbWcgPSBjdXJyZW50VGFyZ2V0LmRhdGFzZXQuZGF0YSA/XG4gICAgICAgICAgICBjdXJyZW50VGFyZ2V0LmRhdGFzZXQuZGF0YS5pbWc6XG4gICAgICAgICAgICBjdXJyZW50VGFyZ2V0LmRhdGFzZXQuaW1nO1xuXG4gICAgICAgIHRoaXMuZGF0YS5kZXRhaWwgJiYgd3gucHJldmlld0ltYWdlKHtcbiAgICAgICAgICAgIGN1cnJlbnQ6IGltZyxcbiAgICAgICAgICAgIHVybHM6IFsgaW1nIF0sXG4gICAgICAgIH0pO1xuICAgIH0sXG5cbiAgICAvKiog5qOA5p+l5piv5ZCm5pyJ5Li75Yqo5by55byA6L+H5ou85Zui546p5rOVICovXG4gICAgY2hlY2tPcGVuUGluKCApIHtcbiAgICAgICAgY29uc3QgeyBkZXRhaWwgfSA9IHRoaXMuZGF0YTtcbiAgICAgICAgaWYgKCAhZGV0YWlsICkgeyByZXR1cm4gfVxuICAgICAgICBjb25zdCByZXN1bHQgPSBkZWxheWVyaW5nR29vZCggZGV0YWlsICk7XG4gICAgICAgIGlmICggcmVzdWx0ICkge1xuICAgICAgICAgICAgY29uc3Qgb25lRGF5ID0gMjQgKiA2MCAqIDYwICogMTAwMDtcbiAgICAgICAgICAgIGNvbnN0IHByaWNlR2FwID0gU3RyaW5nKCByZXN1bHQuZ29vZFBpbnMuZWFjaFByaWNlUm91bmQgKS5yZXBsYWNlKC9cXC4wMC9nLCAnJyk7XG4gICAgICAgICAgICBjb25zdCBvcGVuUmVjb3JkID0gd3guZ2V0U3RvcmFnZVN5bmMoIHN0b3JhZ2VLZXkgKTtcblxuICAgICAgICAgICAgaWYgKCAhIXByaWNlR2FwICYmIERhdGUubm93KCApIC0gTnVtYmVyKCBvcGVuUmVjb3JkICkgPj0gb25lRGF5ICkge1xuICAgICAgICAgICAgICAgIHd4LnNldFN0b3JhZ2VTeW5jKCBzdG9yYWdlS2V5LCBTdHJpbmcoIERhdGUubm93KCApKSk7XG4gICAgICAgICAgICAgICAgdGhpcy50b2dnbGVQYWx5VGlwcyggKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICAvKiog6K6+572u4oCc5Zac5qyi4oCdICovXG4gICAgb25MaWtlKCApIHtcbiAgICAgICAgY29uc3QgdGhhdCA9IHRoaXM7XG4gICAgICAgIGlmICggIXRoaXMuZGF0YS5oYXNJbml0TGlrZSApIHsgcmV0dXJuOyB9XG4gICAgICAgIGh0dHAoe1xuICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgIHBpZDogdGhpcy5kYXRhLmlkXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgdXJsOiAnbGlrZV9jcmVhdGUnLFxuICAgICAgICAgICAgc3VjY2VzczogICggcmVzOiBhbnkgKSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKCByZXMuc3RhdHVzID09PSAyMDAgKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc2V0RGF0YSEoe1xuICAgICAgICAgICAgICAgICAgICAgICAgbGlrZWQ6ICF0aGlzLmRhdGEubGlrZWRcbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH0sXG5cbiAgICAvKiog6K6+572u4oCc5Zac5qyi4oCdICovXG4gICAgY2hlY2tMaWtlKCApIHtcbiAgICAgICAgY29uc3QgdGhhdCA9IHRoaXM7XG4gICAgICAgIGh0dHAoe1xuICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgIHBpZDogdGhpcy5kYXRhLmlkXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgdXJsOiAnbGlrZV9jaGVjaycsXG4gICAgICAgICAgICBzdWNjZXNzOiAgKCByZXM6IGFueSApID0+IHtcbiAgICAgICAgICAgICAgICBpZiAoIHJlcy5zdGF0dXMgPT09IDIwMCApIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zZXREYXRhISh7XG4gICAgICAgICAgICAgICAgICAgICAgICBsaWtlZDogcmVzLmRhdGEsXG4gICAgICAgICAgICAgICAgICAgICAgICBoYXNJbml0TGlrZTogdHJ1ZVxuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfSxcblxuICAgIC8qKiDmtbfmiqXlvIDlhbPnm5HlkKwgKi9cbiAgICBvblBvc3RUb2dnbGUoIGUgKSB7XG4gICAgICAgIGNvbnN0IHZhbCA9IGUuZGV0YWlsO1xuICAgICAgICB0aGlzLnNldERhdGEhKHtcbiAgICAgICAgICAgIHNob3dpbmdQb3N0ZXI6IHZhbFxuICAgICAgICB9KTtcbiAgICAgICAgd3guc2V0TmF2aWdhdGlvbkJhclRpdGxlKHtcbiAgICAgICAgICAgIHRpdGxlOiB2YWwgPyAn5YiG5Lqr5ZWG5ZOBJyA6ICfllYblk4Hor6bmg4UnXG4gICAgICAgIH0pO1xuICAgIH0sXG5cbiAgICAvKiog5rW35oqlLS3lvIAgKi9cbiAgICBvcGVuUG9zdGVyKCApIHtcbiAgICAgICAgY29uc3QgeyBzaG93aW5nUG9zdGVyIH0gPSB0aGlzLmRhdGE7XG4gICAgICAgIGNvbnN0IHBvc3RlciA9ICh0aGlzIGFzIGFueSkuc2VsZWN0Q29tcG9uZW50KCcjcG9zdGVyJyk7XG4gICAgICAgIHBvc3Rlci50b2dnbGUoICk7XG4gICAgICAgIGlmICggIXNob3dpbmdQb3N0ZXIgKSB7XG4gICAgICAgICAgICB0aGlzLm9uU3Vic2NyaWJlKCApO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIC8qKiBza3XpgInmi6nlvLnmoYYgKi9cbiAgICBvblNrdVRvZ2dsZSggZSApIHtcbiAgICAgICAgdGhpcy5zZXREYXRhISh7XG4gICAgICAgICAgICBvcGVuaW5nU2t1OiBlLmRldGFpbFxuICAgICAgICB9KTtcbiAgICB9LFxuXG4gICAgLyoqIHNrdeafkOmDqOWIhueCueWHuyAqL1xuICAgIG9uU2t1VGFwKCBlICkge1xuICAgICAgICBjb25zdCB0eXBlID0gZS5kZXRhaWw7XG4gICAgICAgIGlmICggdHlwZSA9PT0gJ21vbmV5UXVlc3Rpb24nICkge1xuICAgICAgICAgICAgdGhpcy50b2dnbGVTaGFyZUdldE1vbmV5KCApO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIC8qKiDlsZXlvIDjgIHlhbPpl61za3XmoYYgKi9cbiAgICBvblRvZ2dsZVNrdSggKSB7XG4gICAgICAgIGNvbnN0IHsgb3BlbmluZ1NrdSB9ID0gdGhpcy5kYXRhO1xuICAgICAgICBjb25zdCBza3UgPSAodGhpcyBhcyBhbnkpLnNlbGVjdENvbXBvbmVudCgnI3NrdScpO1xuICAgICAgICBza3UudG9nZ2xlU2t1KCApO1xuICAgICAgICBpZiAoICFvcGVuaW5nU2t1ICkge1xuICAgICAgICAgICAgdGhpcy5vblN1YnNjcmliZSggKTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiDnlJ/lkb3lkajmnJ/lh73mlbAtLeebkeWQrOmhtemdouWKoOi9vVxuICAgICAqIHtcbiAgICAgKiAgICBpZCB8fCBzY2VuZSAvLyDllYblk4FpZFxuICAgICAqICAgIHRpZCAvLyDooYznqItpZFxuICAgICAqICAgIGZyb20gLy8g5YiG5Lqr5Lq655qEaWRcbiAgICAgKiB9XG4gICAgICovXG4gICAgb25Mb2FkOiBmdW5jdGlvbiAob3B0aW9ucykge1xuXG4gICAgICAgIGNvbnN0IHNjZW5lID0gZGVjb2RlVVJJQ29tcG9uZW50KCBvcHRpb25zIS5zY2VuZSB8fCAnJyApXG5cbiAgICAgICAgdGhpcy5ydW5Db21wdXRlZCggKTtcblxuICAgICAgICB0aGlzLnNldERhdGEhKHtcbiAgICAgICAgICAgIGlkOiAnMWEyNzUxZWY1Y2FiNTA0NDAyODNlNTlhMTBkMjRiZWMnXG4gICAgICAgIH0pXG5cbiAgICAgICAgaWYgKCBvcHRpb25zIS5pZCB8fCBzY2VuZSApIHsgXG4gICAgICAgICAgICB0aGlzLnNldERhdGEhKHtcbiAgICAgICAgICAgICAgICBpZDogb3B0aW9ucyEuaWQgfHwgc2NlbmUsXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICggISEob3B0aW9ucyBhcyBhbnkpLmZyb20gKSB7XG4gICAgICAgICAgICB0aGlzLnNldERhdGEhKHtcbiAgICAgICAgICAgICAgICBmcm9tOiBvcHRpb25zIS5mcm9tXG4gICAgICAgICAgICB9KVxuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICBzZXRUaW1lb3V0KCggKSA9PiB7XG4gICAgICAgICAgICB0aGlzLndhdGNoUm9sZSggKTtcbiAgICAgICAgICAgIC8vIHRoaXMuY2hlY2tMaWtlKCApO1xuICAgICAgICAgICAgdGhpcy5mZXRjaExhc3QoICk7XG4gICAgICAgIH0sIDIwICk7XG4gICAgfSxcbiAgXG4gICAgLyoqXG4gICAgICog55Sf5ZG95ZGo5pyf5Ye95pWwLS3nm5HlkKzpobXpnaLliJ3mrKHmuLLmn5PlrozmiJBcbiAgICAgKi9cbiAgICBvblJlYWR5OiBmdW5jdGlvbiAoICkge1xuICAgICAgICBsZXQgY2lyY2xlQ291bnQgPSAwOyBcbiAgICAgICAgY29uc3QgdGhhdDogYW55ID0gdGhpcztcbiAgICAgICAgLy8g5b+D6Lez55qE5aSW5qGG5Yqo55S7IFxuICAgICAgICB0aGF0LmFuaW1hdGlvbk1pZGRsZUhlYWRlckl0ZW0gPSB3eC5jcmVhdGVBbmltYXRpb24oeyBcbiAgICAgICAgICAgIGR1cmF0aW9uOiA4MDAsIFxuICAgICAgICAgICAgdGltaW5nRnVuY3Rpb246ICdlYXNlJywgXG4gICAgICAgICAgICB0cmFuc2Zvcm1PcmlnaW46ICc1MCUgNTAlJyxcbiAgICAgICAgfSk7IFxuICAgICAgICBzZXRJbnRlcnZhbCggZnVuY3Rpb24oICkgeyBcbiAgICAgICAgICAgIGlmIChjaXJjbGVDb3VudCAlIDIgPT0gMCkgeyBcbiAgICAgICAgICAgICAgICB0aGF0LmFuaW1hdGlvbk1pZGRsZUhlYWRlckl0ZW0uc2NhbGUoIDEuMCApLnJvdGF0ZSggMTAgKS5zdGVwKCApOyBcbiAgICAgICAgICAgIH0gZWxzZSB7IFxuICAgICAgICAgICAgICAgIHRoYXQuYW5pbWF0aW9uTWlkZGxlSGVhZGVySXRlbS5zY2FsZSggMS4wICkucm90YXRlKCAtMzAgKS5zdGVwKCApOyBcbiAgICAgICAgICAgIH0gXG4gICAgICAgICAgICB0aGF0LnNldERhdGEoeyBcbiAgICAgICAgICAgICAgICBhbmltYXRpb25NaWRkbGVIZWFkZXJJdGVtOiB0aGF0LmFuaW1hdGlvbk1pZGRsZUhlYWRlckl0ZW0uZXhwb3J0KCApIFxuICAgICAgICAgICAgfSk7IFxuICAgICAgICAgICAgXG4gICAgICAgICAgICBpZiAoICsrY2lyY2xlQ291bnQgPT09IDEwMDAgKSB7IFxuICAgICAgICAgICAgICAgIGNpcmNsZUNvdW50ID0gMDsgXG4gICAgICAgICAgICB9IFxuICAgICAgICB9LmJpbmQoIHRoaXMgKSwgMTAwMCApOyBcbiAgICB9LFxuICBcbiAgICAvKipcbiAgICAgKiDnlJ/lkb3lkajmnJ/lh73mlbAtLeebkeWQrOmhtemdouaYvuekulxuICAgICAqL1xuICAgIG9uU2hvdzogZnVuY3Rpb24gKCApIHtcbiAgICAgICAgY29uc3QgeyBpZCwgdGlkLCB0cmlwIH0gPSB0aGlzLmRhdGE7XG4gICAgICAgIFxuICAgICAgICB0aGlzLmZldERldGFpbCggaWQgKTtcbiAgICAgICAgdGhpcy5mZXRjaFNob3BwaW5nKCBpZCwgdGlkICk7XG5cbiAgICAgICAgaWYgKCAhIXRyaXAgKSB7XG4gICAgICAgICAgICBjb25zdCB7IHN0YXJ0X2RhdGUsIGVuZF9kYXRlIH0gPSAodHJpcCBhcyBhbnkpO1xuICAgICAgICAgICAgIHRoaXMuZmV0Y2hWaXNpdFJlY29yZCggaWQsIHN0YXJ0X2RhdGUsIGVuZF9kYXRlICk7XG4gICAgICAgIH1cblxuICAgIH0sXG4gIFxuICAgIC8qKlxuICAgICAqIOeUn+WRveWRqOacn+WHveaVsC0t55uR5ZCs6aG16Z2i6ZqQ6JePXG4gICAgICovXG4gICAgb25IaWRlOiBmdW5jdGlvbiAoKSB7XG4gIFxuICAgIH0sXG4gIFxuICAgIC8qKlxuICAgICAqIOeUn+WRveWRqOacn+WHveaVsC0t55uR5ZCs6aG16Z2i5Y246L29XG4gICAgICovXG4gICAgb25VbmxvYWQ6IGZ1bmN0aW9uICgpIHtcbiAgXG4gICAgfSxcbiAgXG4gICAgLyoqXG4gICAgICog6aG16Z2i55u45YWz5LqL5Lu25aSE55CG5Ye95pWwLS3nm5HlkKznlKjmiLfkuIvmi4nliqjkvZxcbiAgICAgKi9cbiAgICBvblB1bGxEb3duUmVmcmVzaDogZnVuY3Rpb24gKCkge1xuICBcbiAgICB9LFxuICBcbiAgICAvKipcbiAgICAgKiDpobXpnaLkuIrmi4nop6blupXkuovku7bnmoTlpITnkIblh73mlbBcbiAgICAgKi9cbiAgICBvblJlYWNoQm90dG9tOiBmdW5jdGlvbiAoKSB7XG4gIFxuICAgIH0sXG4gIFxuICAgIC8qKlxuICAgICAqIOeUqOaIt+eCueWHu+WPs+S4iuinkuWIhuS6q1xuICAgICAqL1xuICAgIG9uU2hhcmVBcHBNZXNzYWdlOiBmdW5jdGlvbiAoIGUgKSB7XG4gICAgICAgIGNvbnN0IHsgaGFzT3JkZXIkLCBkZXRhaWwkLCBvcGVuaWQgfSA9ICh0aGlzLmRhdGEgYXMgYW55KTtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGltYWdlVXJsOiBgJHtkZXRhaWwkLmltZ1sgMCBdfWAsXG4gICAgICAgICAgICBwYXRoOiBgL3BhZ2VzL2dvb2RzLWRldGFpbC9pbmRleD9pZD0ke2RldGFpbCQuX2lkfSZmcm9tPSR7b3BlbmlkfWAsXG4gICAgICAgICAgICB0aXRsZTogISFkZXRhaWwkICYmIGRldGFpbCQuaGFzUGluICYmICFoYXNPcmRlciQgP1xuICAgICAgICAgICAgICAgIGDmnInkurrmg7PopoHlkJfvvJ/mi7zlm6LkubDvvIzmiJHku6zpg73og73nnIHvvIEke2RldGFpbCQudGl0bGV9YCA6XG4gICAgICAgICAgICAgICAgYOaOqOiNkOOAjCR7ZGV0YWlsJC50YWdUZXh0feOAjeelnuWZqCEke2RldGFpbCQudGl0bGV9YFxuICAgICAgICB9XG4gICAgfVxuICB9KSJdfQ==