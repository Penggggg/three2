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
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
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
        showAdmBtn: false,
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
        visitors: [],
        shareFromUser: {},
        shareCover: '',
        coverText: "23人看过",
        hasShowPlayTips: false
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
                var _a = this.data, visitors = _a.visitors, openid = _a.openid, detail = _a.detail, canPinSku = _a.canPinSku, ipAvatar = _a.ipAvatar;
                var good = goods_js_1.delayeringGood(detail);
                var getRandom = function (n) { return Math.floor(Math.random() * n); };
                var allTexts = [
                    "\u5212\u7B97\u8036\uFF01\u6709\u7FA4\u53CB\u62FC\u56E2\u5417",
                    "\u300C" + good.tagText + "\u300D\u611F\u89C9\u4E0D\u9519",
                    "\u770B\u8D77\u6765\u4E0D\u9519\uFF01\u60F3\u62FC\u56E2",
                    "\u6709\u7FA4\u53CB\u62FC\u56E2\u5417\uFF1F\u6211\u4EEC\u4E00\u8D77\u7701"
                ];
                var allVisitors = visitors
                    .filter(function (x) {
                    if (visitors.length === 1) {
                        return x.openid !== openid;
                    }
                    ;
                    return true;
                })
                    .map(function (x) {
                    var randomNum = getRandom(allTexts.length);
                    return {
                        avatar: x.avatarUrl,
                        text: allTexts[randomNum]
                    };
                });
                if (canPinSku.length > 0) {
                    allVisitors.unshift({
                        avatar: ipAvatar,
                        text: "\u7FA4\u91CC\u62FC\u56E2\u4E2D\u54E6\uFF5E"
                    });
                }
                return allVisitors;
            },
            shopping$: function () {
                var _a = this.data, shopping = _a.shopping, id = _a.id, openid = _a.openid;
                var getRandom = function (n) { return Math.floor(Math.random() * n); };
                var allTexts = [
                    "\u8C22\u8C22\u62FC\u56E2\u7684\u7FA4\u53CB~",
                    "\u8D5E\uFF01\u53C8\u7701\u94B1\u4E86\uFF5E",
                    "\u9519\u8FC7\u5C31\u4E8F\u5566\uFF5E",
                    "\u62FC\u56E2\u597D\u5212\u7B97~"
                ];
                return shopping
                    .filter(function (x) { return x.pid === id; })
                    .map(function (sl) {
                    var users = sl.users, detail = sl.detail, uids = sl.uids;
                    var name = detail.name;
                    return __assign(__assign({}, sl), { name: name, firstUser: users[0], otherUser: users.slice(1), tips: allTexts[getRandom(allTexts.length)], hasOrder: uids.includes(openid) });
                });
            },
            otherShopping$: function () {
                var _a = this.data, shopping = _a.shopping, id = _a.id;
                var result = shopping
                    .filter(function (x) { return x.pid !== id; })
                    .map(function (x) {
                    var pid = x.pid, detail = x.detail, users = x.users, adjustPrice = x.adjustPrice, adjustGroupPrice = x.adjustGroupPrice;
                    var name = detail.name, title = detail.title;
                    var totalDelta = users.length * Math.ceil(adjustPrice - adjustGroupPrice);
                    return {
                        pid: pid,
                        img: detail.img,
                        topTips: (users.length > 1 ? users.length + '人' : '') + "\u7701" + totalDelta + "\u5143",
                        bottomTips: users.length + "\u7FA4\u53CB\u62FC\u56E2",
                        avatars: users.map(function (x) { return x.avatarUrl; }),
                        title: "" + (name ? name + ' ' : '') + title
                    };
                });
                return result;
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
                showAdmBtn: (val === 1)
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
            _this.fetchSharer();
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
        var _a = this.data, detail = _a.detail, from = _a.from, showAdmBtn = _a.showAdmBtn, hasShowPlayTips = _a.hasShowPlayTips;
        if (detail && !showAdmBtn) {
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
                if (!!from && goods_js_1.delayeringGood(res.data).hasPin && !hasShowPlayTips) {
                    _this.setData({
                        showPlayTips: 'show',
                        hasShowPlayTips: true
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
                if (data.length > 0) {
                    wx.setNavigationBarTitle({
                        title: '拼团中 划算！'
                    });
                }
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
    fetchSharer: function () {
        var _this = this;
        var _a = this.data, openid = _a.openid, from = _a.from;
        if (!from || !openid || from === openid) {
            return;
        }
        http_js_1.http({
            data: {
                openid: from
            },
            url: 'common_get-user-info',
            success: function (res) {
                var status = res.status, data = res.data;
                if (status !== 200 || !data) {
                    return;
                }
                data.role !== 1 && _this.setData({
                    shareFromUser: data
                });
            }
        });
    },
    initCoverText: function () {
        var num = 18 + Math.ceil(Math.random() * 20);
        this.setData({
            coverText: num + "\u4EBA\u770B\u8FC7"
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
        app.getSubscribe('buyPin,hongbao,trip');
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
            urls: __spreadArrays(this.data.detail.img),
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
    closePoster: function () {
        try {
            var poster = this.selectComponent('#poster');
            poster.close();
        }
        catch (e) { }
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
    onCoverDone: function (e) {
        this.setData({
            shareCover: e.detail
        });
    },
    onLoad: function (options) {
        var _this = this;
        var scene = decodeURIComponent(options.scene || '');
        var id = options.id || scene || 'ee3099285cdbf38f12869b13363bc206';
        this.setData({
            from: 'oJyGB4ntePYcKT8OfW-3qb19JsjA'
        });
        this.runComputed();
        this.initCoverText();
        if (!!id) {
            this.setData({
                id: id
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
            _this.fetDetail(id);
        }, 20);
    },
    onReady: function () {
    },
    onShow: function () {
        var _a = this.data, id = _a.id, tid = _a.tid, trip = _a.trip, detail = _a.detail, showAdmBtn = _a.showAdmBtn;
        this.fetchShopping(id, tid);
        if (!!trip) {
            var _b = trip, start_date = _b.start_date, end_date = _b.end_date;
            this.fetchVisitRecord(id, start_date, end_date);
        }
        if (!!detail && !!showAdmBtn) {
            this.fetDetail(id);
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
        var _this = this;
        var _a = this.data, hasOrder$ = _a.hasOrder$, detail$ = _a.detail$, openid = _a.openid, shareCover = _a.shareCover;
        this.closePoster();
        setTimeout(function () {
            var shareFedback = _this.selectComponent('#share-feedback');
            shareFedback.toggle();
        }, 500);
        return {
            imageUrl: shareCover || "" + detail$.img[0],
            path: "/pages/goods-detail/index?id=" + detail$._id + "&from=" + openid,
            title: !!detail$ && detail$.hasPin && !hasOrder$ ?
                "\u6709\u4EBA\u60F3\u8981\u5417\uFF1F\u62FC\u56E2\u4E70\uFF0C\u6211\u4EEC\u90FD\u80FD\u7701\uFF01" + detail$.title + " " + detail$.tagText :
                "\u63A8\u8350\u300C" + detail$.tagText + "\u300D\u795E\u5668!" + detail$.title
        };
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUNBLDhDQUEwQztBQUMxQyxxREFBb0Q7QUFDcEQsZ0RBQXFEO0FBQ3JELGdEQUE0QztBQUU1QyxJQUFNLEdBQUcsR0FBRyxNQUFNLEVBQVEsQ0FBQztBQUczQixJQUFNLFVBQVUsR0FBRyxvQkFBb0IsQ0FBQztBQUV4QyxJQUFJLENBQUM7SUFHRCx5QkFBeUIsRUFBRSxJQUFJO0lBSy9CLElBQUksRUFBRTtRQUVGLFVBQVUsRUFBRSxJQUFJO1FBR2hCLE1BQU0sRUFBRSxFQUFFO1FBR1YsUUFBUSxFQUFFLEVBQUU7UUFHWixLQUFLLEVBQUUsSUFBSTtRQUdYLEdBQUcsRUFBRSxFQUFFO1FBR1AsRUFBRSxFQUFFLEVBQUU7UUFHTixNQUFNLEVBQUUsSUFBSTtRQUdaLEdBQUcsRUFBRSxFQUFHO1FBR1IsT0FBTyxFQUFFLElBQUk7UUFHYixXQUFXLEVBQUUsS0FBSztRQUdsQixLQUFLLEVBQUUsS0FBSztRQUdaLFdBQVcsRUFBRTtZQUNULE1BQU0sRUFBRSxNQUFNLEVBQUUsTUFBTTtTQUN6QjtRQUdELHlCQUF5QixFQUFFLElBQUk7UUFHL0IsVUFBVSxFQUFFLEtBQUs7UUFHakIsYUFBYSxFQUFFLEtBQUs7UUFHcEIsWUFBWSxFQUFFLE1BQU07UUFHcEIsaUJBQWlCLEVBQUUsS0FBSztRQUd4QixZQUFZLEVBQUUsTUFBTTtRQUdwQixjQUFjLEVBQUUsS0FBSztRQUdyQixHQUFHLEVBQUUsRUFBRztRQUdSLFFBQVEsRUFBRSxFQUFHO1FBR2IsVUFBVSxFQUFFLEVBQUc7UUFHZixTQUFTLEVBQUUsRUFBRztRQUdkLElBQUksRUFBRSxJQUFJO1FBR1YsZ0JBQWdCLEVBQUUsS0FBSztRQUd2QixNQUFNLEVBQUUsRUFBRTtRQUdWLElBQUksRUFBRSxFQUFFO1FBR1IsZ0JBQWdCLEVBQUUsQ0FBQztRQUdu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U0FDbEQsQ0FBQTtJQUNMLENBQUM7Q0FDRixDQUFDLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJcbmltcG9ydCB7IGh0dHAgfSBmcm9tICcuLi8uLi91dGlsL2h0dHAuanMnO1xuaW1wb3J0IHsgY29tcHV0ZWQgfSBmcm9tICcuLi8uLi9saWIvdnVlZnkvaW5kZXguanMnO1xuaW1wb3J0IHsgZGVsYXllcmluZ0dvb2QgfSBmcm9tICcuLi8uLi91dGlsL2dvb2RzLmpzJztcbmltcG9ydCB7IG5hdlRvIH0gZnJvbSAnLi4vLi4vdXRpbC9yb3V0ZS5qcyc7XG5cbmNvbnN0IGFwcCA9IGdldEFwcDxhbnk+KCApO1xuXG4vLyDmiZPlvIDmi7zlm6Lmj5DnpLrnmoRrZXlcbmNvbnN0IHN0b3JhZ2VLZXkgPSAnb3BlbmVkLXBpbi1pbi1nb29kJztcblxuUGFnZSh7XG5cbiAgICAvLyDliqjnlLtcbiAgICBhbmltYXRpb25NaWRkbGVIZWFkZXJJdGVtOiBudWxsLFxuXG4gICAgLyoqXG4gICAgICog6aG16Z2i55qE5Yid5aeL5pWw5o2uXG4gICAgICovXG4gICAgZGF0YToge1xuICAgICAgICAvLyDmmK/lkKbmnInnlKjmiLfmjojmnYNcbiAgICAgICAgaXNVc2VyQXV0aDogdHJ1ZSxcblxuICAgICAgICAvLyBpcFxuICAgICAgICBpcE5hbWU6ICcnLFxuXG4gICAgICAgIC8vIGlwIFxuICAgICAgICBpcEF2YXRhcjogJycsXG5cbiAgICAgICAgLy8g5piv5ZCm5Li65paw5a6iXG4gICAgICAgIGlzTmV3OiB0cnVlLFxuXG4gICAgICAgIC8vIOihjOeoi1xuICAgICAgICB0aWQ6ICcnLFxuXG4gICAgICAgIC8vIOWVhuWTgWlkXG4gICAgICAgIGlkOiAnJyxcblxuICAgICAgICAvLyDllYblk4Hor6bmg4VcbiAgICAgICAgZGV0YWlsOiBudWxsLFxuICAgICAgICBcbiAgICAgICAgLy8g5pWw5o2u5a2X5YW4XG4gICAgICAgIGRpYzogeyB9LFxuICAgICAgICBcbiAgICAgICAgLy8g5Yqg6L2954q25oCBXG4gICAgICAgIGxvYWRpbmc6IHRydWUsXG5cbiAgICAgICAgLy8g5piv5ZCm5Yid5aeL5YyW6L+H4oCc5Zac5qyi4oCdXG4gICAgICAgIGhhc0luaXRMaWtlOiBmYWxzZSxcblxuICAgICAgICAvLyDmmK/lkKbigJzllpzmrKLigJ1cbiAgICAgICAgbGlrZWQ6IGZhbHNlLFxuXG4gICAgICAgIC8vIOaWh+Wtl+S/neivgeaPkOekulxuICAgICAgICBwcm9taXNlVGlwczogW1xuICAgICAgICAgICAgJ+ato+WTgeS/neivgScsICfku7fmoLzkvJjlir8nLCAn55yf5Lq66LeR6IW/J1xuICAgICAgICBdLFxuXG4gICAgICAgIC8vIOWKqOeUu1xuICAgICAgICBhbmltYXRpb25NaWRkbGVIZWFkZXJJdGVtOiBudWxsLFxuXG4gICAgICAgIC8vIOWxleekuueuoeeQhuWFpeWPo1xuICAgICAgICBzaG93QWRtQnRuOiBmYWxzZSxcblxuICAgICAgICAvLyDmraPlnKjlsZXnpLrmtbfmiqVcbiAgICAgICAgc2hvd2luZ1Bvc3RlcjogZmFsc2UsXG5cbiAgICAgICAgLy8g5bGV56S65ou85Zui546p5rOV55qE5by55qGGXG4gICAgICAgIHNob3dQbGF5VGlwczogJ2hpZGUnLFxuXG4gICAgICAgIC8vIOWxleekuuWIhuS6q+i1mumSsVxuICAgICAgICBzaG93U2hhcmVHZXRNb25leTogZmFsc2UsXG5cbiAgICAgICAgLy8g5bGV56S65ou85Zui5ZWG5ZOB5YiX6KGoXG4gICAgICAgIHNob3dQaW5Hb29kczogJ2hpZGUnLFxuXG4gICAgICAgIC8vIOWIhuS6q1RpcHMyXG4gICAgICAgIHNob3dTaGFyZVRpcHMyOiBmYWxzZSxcblxuICAgICAgICAvLyDmi7zlm6LliJfooahcbiAgICAgICAgcGluOiBbIF0sXG5cbiAgICAgICAgLy8g5pys6KGM56iL55qE6LSt54mp5riF5Y2V5YiX6KGoXG4gICAgICAgIHNob3BwaW5nOiBbIF0sXG5cbiAgICAgICAgLy8g5LiA5Y+j5Lu35rS75Yqo5YiX6KGoXG4gICAgICAgIGFjdGl2aXRpZXM6IFsgXSxcblxuICAgICAgICAvLyDmnKzotp/og73lpJ/mi7zlm6LnmoRza3VcbiAgICAgICAgY2FuUGluU2t1OiBbIF0sXG5cbiAgICAgICAgLy8g5b2T5YmN55qE6KGM56iLXG4gICAgICAgIHRyaXA6IG51bGwsXG5cbiAgICAgICAgLy8g5b2T5YmN5piv5ZCm5byA5ZCv5LqG56ev5YiG5o6o5bm/XG4gICAgICAgIGNhbkludGVncmF5U2hhcmU6IGZhbHNlLFxuXG4gICAgICAgIC8vIOW9k+WJjei0puWPt+eahG9wZW5pZFxuICAgICAgICBvcGVuaWQ6ICcnLFxuXG4gICAgICAgIC8vIOWIhuS6q+S6uueahG9wZW5pZFxuICAgICAgICBmcm9tOiAnJyxcblxuICAgICAgICAvLyDnp6/liIbmjqjlub/ojrfngrnmr5TkvotcbiAgICAgICAgcHVzaEludGVncmFsUmF0ZTogMCxcblxuICAgICAgICAvLyDmmK/lkKblsZXlvIBza3VcbiAgICAgICAgb3BlbmluZ1NrdTogZmFsc2UsXG5cbiAgICAgICAgLy8g6K6/6Zeu6K6w5b2VXG4gICAgICAgIHZpc2l0b3JzOiBbIF0sXG5cbiAgICAgICAgLy8g5YiG5Lqr5Lq65L+h5oGvXG4gICAgICAgIHNoYXJlRnJvbVVzZXI6IHsgfSxcblxuICAgICAgICAvLyDliIbkuqvlsIHpnaJcbiAgICAgICAgc2hhcmVDb3ZlcjogJycsXG5cbiAgICAgICAgLy8g5bCB6Z2i5o+Q56S6XG4gICAgICAgIGNvdmVyVGV4dDogXCIyM+S6uueci+i/h1wiLFxuXG4gICAgICAgIC8vIOaYr+WQpuW8uei1t+adpei/h+eOqeazleS7i+e7jVxuICAgICAgICBoYXNTaG93UGxheVRpcHM6IGZhbHNlXG4gICAgfSxcblxuICAgIC8qKiDorr7nva5jb21wdXRlZCAqL1xuICAgIHJ1bkNvbXB1dGVkKCApIHtcbiAgICAgICAgY29tcHV0ZWQoIHRoaXMsIHtcblxuICAgICAgICAgICAgLy8g6K6h566X5Lu35qC8XG4gICAgICAgICAgICBwcmljZTogZnVuY3Rpb24oICkge1xuICAgICAgICAgICAgICAgIGNvbnN0IHsgZGV0YWlsIH0gPSB0aGlzLmRhdGE7XG4gICAgICAgICAgICAgICAgY29uc3QgcmVzdWx0ID0gZGVsYXllcmluZ0dvb2QoIGRldGFpbCApO1xuICAgICAgICAgICAgICAgIHJldHVybiByZXN1bHQgPyByZXN1bHQucHJpY2UkIDogJyc7XG4gICAgICAgICAgICB9LFxuXG4gICAgICAgICAgICAvLyDllYblk4Hor6bmg4UgLSDliIbooYzmmL7npLpcbiAgICAgICAgICAgIGRldGFpbEludHJvOiBmdW5jdGlvbiggKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgeyBkZXRhaWwgfSA9IHRoaXMuZGF0YTtcbiAgICAgICAgICAgICAgICBpZiAoICFkZXRhaWwgfHwgKCAhIWRldGFpbCAmJiAhZGV0YWlsLmRldGFpbCApKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBbIF07XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGRldGFpbC5kZXRhaWwuc3BsaXQoJ1xcbicpLmZpbHRlciggeCA9PiAhIXggKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LFxuXG4gICAgICAgICAgICAvLyDku7fmoLwg772eIOWboui0reS7t+eahOW3ruS7t1xuICAgICAgICAgICAgcHJpY2VHYXA6IGZ1bmN0aW9uKCApIHtcbiAgICAgICAgICAgICAgICBjb25zdCB7IGRldGFpbCB9ID0gdGhpcy5kYXRhO1xuICAgICAgICAgICAgICAgIGlmICggIWRldGFpbCApIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuICcnXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgcmVzdWx0ID0gZGVsYXllcmluZ0dvb2QoIGRldGFpbCApO1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBnYXAgPSByZXN1bHQgPyBTdHJpbmcoIHJlc3VsdC5nb29kUGlucy5lYWNoUHJpY2VSb3VuZCApLnJlcGxhY2UoL1xcLjAwL2csICcnKSA6ICcnO1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBtZXRhID0gZ2FwICE9PSAnMCcgJiYgISFnYXAgPyBnYXAgOiAnJztcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG1ldGE7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAgLy8g6ams5LiK5Y+v5Lul5ou85Zui55qE5Liq5pWwXG4gICAgICAgICAgICBwaW5Db3VudCQ6IGZ1bmN0aW9uKCApIHtcbiAgICAgICAgICAgICAgICBjb25zdCB7IGlkLCBkZXRhaWwgfSA9IHRoaXMuZGF0YTtcbiAgICAgICAgICAgICAgICBjb25zdCBnb29kU2hvcHBpbmcgPSB0aGlzLmRhdGEuc2hvcHBpbmcuZmlsdGVyKCB4ID0+IHgucGlkID09PSBpZCApO1xuICAgICAgICAgICAgICAgIGlmICggIWRldGFpbCApIHsgXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAwO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGNvbnN0IHsgc3RhbmRhcmRzLCBncm91cFByaWNlIH0gPSBkZXRhaWw7XG5cbiAgICAgICAgICAgICAgICBpZiAoICEhc3RhbmRhcmRzICYmIHN0YW5kYXJkcy5sZW5ndGggPiAwICkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gc3RhbmRhcmRzXG4gICAgICAgICAgICAgICAgICAgICAgICAuZmlsdGVyKCB4ID0+ICEhZ29vZFNob3BwaW5nLmZpbmQoIHMgPT4gcy5zaWQgPT09IHguX2lkICYmIHMucGlkID09PSB4LnBpZCApKVxuICAgICAgICAgICAgICAgICAgICAgICAgLmxlbmd0aDtcblxuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoICEhZ3JvdXBQcmljZSApIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgeyBfaWQgfSA9IGRldGFpbDtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuICEhZ29vZFNob3BwaW5nLmZpbmQoIHMgPT4gcy5waWQgPT09IF9pZCApID8gMSA6IDBcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gMDtcbiAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgIC8vIOaLvOWbouWIl+ihqFxuICAgICAgICAgICAgcGluJDogZnVuY3Rpb24oICkge1xuICAgICAgICAgICAgICAgIGxldCBtZXRhOiBhbnkgPSBbIF07XG4gICAgICAgICAgICAgICAgY29uc3QgeyBkZXRhaWwsIHNob3BwaW5nLCBhY3Rpdml0aWVzIH0gPSB0aGlzLmRhdGE7XG5cbiAgICAgICAgICAgICAgICBpZiAoICFkZXRhaWwgKSB7IFxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gWyBdO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGNvbnN0IHsgc3RhbmRhcmRzLCBncm91cFByaWNlIH0gPSBkZXRhaWw7XG5cbiAgICAgICAgICAgICAgICBpZiAoIHN0YW5kYXJkcy5sZW5ndGggPiAwICkge1xuICAgICAgICAgICAgICAgICAgICBtZXRhID0gc3RhbmRhcmRzXG4gICAgICAgICAgICAgICAgICAgICAgICAuZmlsdGVyKCB4ID0+ICEheC5ncm91cFByaWNlIClcbiAgICAgICAgICAgICAgICAgICAgICAgIC5tYXAoIHggPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBPYmplY3QuYXNzaWduKHsgfSwgeCwge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzaWQ6IHguX2lkLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYW5QaW46ICEhc2hvcHBpbmcuZmluZCggcyA9PiBzLnNpZCA9PT0geC5faWQgJiYgcy5waWQgPT09IHgucGlkIClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKCAhIWdyb3VwUHJpY2UgKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHsgcHJpY2UsIHRpdGxlLCBpbWcsIF9pZCB9ID0gZGV0YWlsO1xuICAgICAgICAgICAgICAgICAgICBtZXRhID0gW3tcbiAgICAgICAgICAgICAgICAgICAgICAgIHByaWNlLFxuICAgICAgICAgICAgICAgICAgICAgICAgcGlkOiBfaWQsXG4gICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiB0aXRsZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGdyb3VwUHJpY2UsXG4gICAgICAgICAgICAgICAgICAgICAgICBzaWQ6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICAgICAgICAgIGltZzogaW1nWyAwIF0sXG4gICAgICAgICAgICAgICAgICAgICAgICBjYW5QaW46ICEhc2hvcHBpbmcuZmluZCggcyA9PiBzLnBpZCA9PT0gX2lkIClcbiAgICAgICAgICAgICAgICAgICAgfV07XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgLy8g5qC55o2u5rS75Yqo77yM5pu05pS544CB5paw5aKe5ou85Zui6aG555uuXG4gICAgICAgICAgICAgICAgYWN0aXZpdGllcy5tYXAoIGFjID0+IHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCAhYWMuYWNfZ3JvdXBQcmljZSApIHsgcmV0dXJuOyB9XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHBpblRhcmdldCA9IG1ldGEuZmluZCggeCA9PiB4LnBpZCA9PT0gYWMucGlkICYmIHguc2lkID09PSBhYy5zaWQgKTtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgcGluVGFyZ2V0SW5kZXggPSBtZXRhLmZpbmRJbmRleCggeCA9PiB4LnBpZCA9PT0gYWMucGlkICYmIHguc2lkID09PSBhYy5zaWQgKTtcblxuICAgICAgICAgICAgICAgICAgICAvLyDmm7/mjaJcbiAgICAgICAgICAgICAgICAgICAgaWYgKCBwaW5UYXJnZXRJbmRleCAhPT0gLTEgKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBtZXRhLnNwbGljZSggcGluVGFyZ2V0SW5kZXgsIDEsIE9iamVjdC5hc3NpZ24oeyB9LCBwaW5UYXJnZXQsIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcmljZTogYWMuYWNfcHJpY2UsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZ3JvdXBQcmljZTogYWMuYWNfZ3JvdXBQcmljZVxuICAgICAgICAgICAgICAgICAgICAgICAgfSkpO1xuXG4gICAgICAgICAgICAgICAgICAgIC8vIOaWsOWinlxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgbWV0YS5wdXNoKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzaWQ6IGFjLnNpZCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwaWQ6IGFjLnBpZCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbWc6IGFjLmltZyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiBhYy50aXRsZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYW5QaW46ICEhc2hvcHBpbmcuZmluZCggcyA9PiBzLnNpZCA9PT0gYWMuc2lkICYmIHMucGlkID09PSBhYy5waWQgKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcmljZTogYWMuYWNfcHJpY2UsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZ3JvdXBQcmljZTogYWMuYWNfZ3JvdXBQcmljZSBcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgIGNvbnN0IG1ldGEyID0gbWV0YS5tYXAoIHggPT4gT2JqZWN0LmFzc2lnbih7IH0sIHgsIHtcbiAgICAgICAgICAgICAgICAgICAgZGVsdGE6IE51bWJlciggeC5wcmljZSAtIHguZ3JvdXBQcmljZSApLnRvRml4ZWQoIDAgKVxuICAgICAgICAgICAgICAgIH0pKTtcblxuICAgICAgICAgICAgICAgIHJldHVybiBtZXRhMjtcbiAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgIC8vIOenr+WIhuWMuumXtFxuICAgICAgICAgICAgaW50ZWdyYWwkOiBmdW5jdGlvbiggKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgeyBkZXRhaWwsIHB1c2hJbnRlZ3JhbFJhdGUgfSA9IHRoaXMuZGF0YTtcbiAgICAgICAgICAgICAgICBpZiAoICFkZXRhaWwgKSB7IFxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gJyc7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGNvbnN0IHJlc3VsdCA9IGRlbGF5ZXJpbmdHb29kKCBkZXRhaWwsIHB1c2hJbnRlZ3JhbFJhdGUgKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVzdWx0LmludGVncmFsJDtcbiAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgIC8vIOivpuaDhVxuICAgICAgICAgICAgZGV0YWlsJDogZnVuY3Rpb24oICkge1xuICAgICAgICAgICAgICAgIGNvbnN0IHsgZGV0YWlsIH0gPSB0aGlzLmRhdGE7XG4gICAgICAgICAgICAgICAgY29uc3QgciA9IGRlbGF5ZXJpbmdHb29kKCBkZXRhaWwgKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gcjtcbiAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgIC8vIOatpOi0puWPt++8jOaYr+WQpuacieWNlVxuICAgICAgICAgICAgaGFzT3JkZXIkKCApIHtcbiAgICAgICAgICAgICAgICBjb25zdCB7IG9wZW5pZCwgdHJpcFNob3BwaW5nbGlzdCB9ID0gdGhpcy5kYXRhO1xuICAgICAgICAgICAgICAgIGNvbnN0IHIgPSAodHJpcFNob3BwaW5nbGlzdCB8fCBbIF0pXG4gICAgICAgICAgICAgICAgICAgIC5maWx0ZXIoIHNsID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHsgdWlkcyB9ID0gc2w7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdWlkcy5pbmNsdWRlcyggb3BlbmlkICk7XG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgY29uc3QgcmVzdWx0ID0gQXJyYXkuaXNBcnJheSggdHJpcFNob3BwaW5nbGlzdCApICYmIHRyaXBTaG9wcGluZ2xpc3QubGVuZ3RoID4gMFxuICAgICAgICAgICAgICAgICAgICA/IHIubGVuZ3RoID4gMCA6IGZhbHNlO1xuICAgICAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICAgICAgICB9LFxuXG4gICAgICAgICAgICAvLyDllYblk4HnmoTorr/pl67orrDlvZVcbiAgICAgICAgICAgIHZpc2l0b3JzJCggKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgeyB2aXNpdG9ycywgb3BlbmlkIH0gPSB0aGlzLmRhdGE7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHZpc2l0b3JzLmZpbHRlciggeCA9PiB4Lm9wZW5pZCAhPT0gb3BlbmlkICk7XG4gICAgICAgICAgICB9LFxuXG4gICAgICAgICAgICAvLyDllYblk4HnmoTorr/pl64gKyDnpL7kuqTlsZ7mgKfmqKHlnZdcbiAgICAgICAgICAgIHNvY2lhbCQoICkge1xuICAgICAgICAgICAgICAgIGNvbnN0IHsgdmlzaXRvcnMsIG9wZW5pZCwgZGV0YWlsLCBjYW5QaW5Ta3UsIGlwQXZhdGFyIH0gPSB0aGlzLmRhdGE7XG4gICAgICAgICAgICAgICAgY29uc3QgZ29vZCA9IGRlbGF5ZXJpbmdHb29kKCBkZXRhaWwgKTsgXG4gICAgICAgICAgICAgICAgY29uc3QgZ2V0UmFuZG9tID0gbiA9PiBNYXRoLmZsb29yKCBNYXRoLnJhbmRvbSggKSAqIG4gKTtcblxuICAgICAgICAgICAgICAgIGNvbnN0IGFsbFRleHRzID0gW1xuICAgICAgICAgICAgICAgICAgICBg5YiS566X6IC277yB5pyJ576k5Y+L5ou85Zui5ZCXYCxcbiAgICAgICAgICAgICAgICAgICAgYOOAjCR7Z29vZC50YWdUZXh0feOAjeaEn+inieS4jemUmWAsXG4gICAgICAgICAgICAgICAgICAgIGDnnIvotbfmnaXkuI3plJnvvIHmg7Pmi7zlm6JgLFxuICAgICAgICAgICAgICAgICAgICBg5pyJ576k5Y+L5ou85Zui5ZCX77yf5oiR5Lus5LiA6LW355yBYFxuICAgICAgICAgICAgICAgIF07XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgY29uc3QgYWxsVmlzaXRvcnMgPSB2aXNpdG9yc1xuICAgICAgICAgICAgICAgICAgICAuZmlsdGVyKCB4ID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICggdmlzaXRvcnMubGVuZ3RoID09PSAxICkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB4Lm9wZW5pZCAhPT0gb3BlbmlkXG4gICAgICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgIC5tYXAoIHggPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgcmFuZG9tTnVtID0gZ2V0UmFuZG9tKCBhbGxUZXh0cy5sZW5ndGggKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYXZhdGFyOiB4LmF2YXRhclVybCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZXh0OiBhbGxUZXh0c1sgcmFuZG9tTnVtIF1cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICBpZiAoIGNhblBpblNrdS5sZW5ndGggPiAwICkge1xuICAgICAgICAgICAgICAgICAgICBhbGxWaXNpdG9ycy51bnNoaWZ0KHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGF2YXRhcjogaXBBdmF0YXIsXG4gICAgICAgICAgICAgICAgICAgICAgICB0ZXh0OiBg576k6YeM5ou85Zui5Lit5ZOm772eYFxuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHJldHVybiBhbGxWaXNpdG9ycztcblxuICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAgLy8g5b2T5YmN5ZWG5ZOB55qE6LSt54mp5riF5Y2VXG4gICAgICAgICAgICBzaG9wcGluZyQoICkge1xuICAgICAgICAgICAgICAgIGNvbnN0IHsgc2hvcHBpbmcsIGlkLCBvcGVuaWQgfSA9IHRoaXMuZGF0YTtcblxuICAgICAgICAgICAgICAgIGNvbnN0IGdldFJhbmRvbSA9IG4gPT4gTWF0aC5mbG9vciggTWF0aC5yYW5kb20oICkgKiBuICk7XG4gICAgICAgICAgICAgICAgY29uc3QgYWxsVGV4dHMgPSBbXG4gICAgICAgICAgICAgICAgICAgIGDosKLosKLmi7zlm6LnmoTnvqTlj4t+YCxcbiAgICAgICAgICAgICAgICAgICAgYOi1nu+8geWPiOecgemSseS6hu+9nmAsXG4gICAgICAgICAgICAgICAgICAgIGDplJnov4flsLHkuo/llabvvZ5gLFxuICAgICAgICAgICAgICAgICAgICBg5ou85Zui5aW95YiS566XfmBcbiAgICAgICAgICAgICAgICBdO1xuXG4gICAgICAgICAgICAgICAgcmV0dXJuIHNob3BwaW5nXG4gICAgICAgICAgICAgICAgICAgIC5maWx0ZXIoIHggPT4geC5waWQgPT09IGlkIClcbiAgICAgICAgICAgICAgICAgICAgLm1hcCggc2wgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgeyB1c2VycywgZGV0YWlsLCB1aWRzIH0gPSBzbDtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHsgbmFtZSB9ID0gZGV0YWlsO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAuLi5zbCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBuYW1lLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZpcnN0VXNlcjogdXNlcnNbIDAgXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvdGhlclVzZXI6IHVzZXJzLnNsaWNlKCAxICksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGlwczogYWxsVGV4dHNbIGdldFJhbmRvbSggYWxsVGV4dHMubGVuZ3RoICldLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGhhc09yZGVyOiB1aWRzLmluY2x1ZGVzKCBvcGVuaWQgKVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAgLy8g6KGM56iL5Lit55qE5YW25LuW6LSt54mp5riF5Y2VXG4gICAgICAgICAgICBvdGhlclNob3BwaW5nJCggKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgeyBzaG9wcGluZywgaWQgfSA9IHRoaXMuZGF0YTtcblxuICAgICAgICAgICAgICAgIGNvbnN0IHJlc3VsdCA9IHNob3BwaW5nXG4gICAgICAgICAgICAgICAgICAgIC5maWx0ZXIoIHggPT4geC5waWQgIT09IGlkIClcbiAgICAgICAgICAgICAgICAgICAgLm1hcCggeCA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCB7IHBpZCwgZGV0YWlsLCB1c2VycywgYWRqdXN0UHJpY2UsIGFkanVzdEdyb3VwUHJpY2UgfSA9IHg7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCB7IG5hbWUsIHRpdGxlIH0gPSBkZXRhaWw7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCB0b3RhbERlbHRhID0gdXNlcnMubGVuZ3RoICogTWF0aC5jZWlsKCBhZGp1c3RQcmljZSAtIGFkanVzdEdyb3VwUHJpY2UgKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcGlkLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGltZzogZGV0YWlsLmltZyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0b3BUaXBzOiBgJHt1c2Vycy5sZW5ndGggPiAxID8gdXNlcnMubGVuZ3RoICsgJ+S6uicgOiAnJ33nnIEke3RvdGFsRGVsdGF95YWDYCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBib3R0b21UaXBzOiBgJHt1c2Vycy5sZW5ndGh9576k5Y+L5ou85ZuiYCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhdmF0YXJzOiB1c2Vycy5tYXAoIHggPT4geC5hdmF0YXJVcmwgKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aXRsZTogYCR7bmFtZSA/IG5hbWUgKyAnICcgOiAnJ30ke3RpdGxlfWBcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAgLy8g6KGM56iL5Lit77yM5b2T5YmN5Lqn5ZOB5omA5pyJ5Z6L5Y+35Yqg6LW35p2l77yM5pyJ5aSa5bCR5Lq65Zyo5ou85ZuiXG4gICAgICAgICAgICBhbGxQaW5QbGF5ZXJzJCggKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgeyBpZCwgc2hvcHBpbmcgfSA9IHRoaXMuZGF0YTtcbiAgICAgICAgICAgICAgICBjb25zdCBnb29kU2hvcHBpbmcgPSBzaG9wcGluZy5maWx0ZXIoIHggPT4geC5waWQgPT09IGlkICk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGdvb2RTaG9wcGluZy5yZWR1Y2UoKCB4LCBzbCApID0+IHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHggKyBzbC51aWRzLmxlbmd0aDtcbiAgICAgICAgICAgICAgICB9LCAwICk7XG4gICAgICAgICAgICB9LFxuXG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIOeOsOWcqOWIsOWHjOaZqDHngrnnmoTlgJLorqHml7ZcbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgY291bnREb3duTmlnaHQkKCApIHtcbiAgICAgICAgICAgICAgICBjb25zdCBub3cgPSBuZXcgRGF0ZSggKTtcbiAgICAgICAgICAgICAgICBjb25zdCB5ID0gbm93LmdldEZ1bGxZZWFyKCApO1xuICAgICAgICAgICAgICAgIGNvbnN0IG0gPSBub3cuZ2V0TW9udGgoICkgKyAxO1xuICAgICAgICAgICAgICAgIGNvbnN0IGQgPSBub3cuZ2V0RGF0ZSggKTtcbiAgICAgICAgICAgICAgICBjb25zdCB0b2RheU9uZSA9IG5ldyBEYXRlKGAke3l9LyR7bX0vJHtkfSAwMTowMDowMGApO1xuICAgICAgICAgICAgICAgIGNvbnN0IHRvbW9ycm93T25lID0gdG9kYXlPbmUuZ2V0VGltZSggKSArIDI0ICogNjAgKiA2MCAqIDEwMDA7XG4gICAgICAgICAgICAgICAgcmV0dXJuICgoIHRvbW9ycm93T25lIC0gRGF0ZS5ub3coICkpIC8gMTAwMCApLnRvRml4ZWQoIDAgKTtcbiAgICAgICAgICAgIH0sXG5cbiAgICAgICAgfSlcbiAgICB9LFxuXG4gICAgLyoqIOebkeWQrOWFqOWxgOeuoeeQhuWRmOadg+mZkCAqL1xuICAgIHdhdGNoUm9sZSggKSB7XG4gICAgICAgIChhcHAgYXMgYW55KS53YXRjaCQoJ3JvbGUnLCAoIHZhbCApID0+IHtcbiAgICAgICAgICAgIHRoaXMuc2V0RGF0YSEoe1xuICAgICAgICAgICAgICAgIHNob3dBZG1CdG46ICggdmFsID09PSAxIClcbiAgICAgICAgICAgIH0pXG4gICAgICAgIH0pO1xuICAgICAgICAoYXBwIGFzIGFueSkud2F0Y2gkKCdpc05ldycsIHZhbCA9PiB7XG4gICAgICAgICAgICB0aGlzLnNldERhdGEhKHtcbiAgICAgICAgICAgICAgICBpc05ldzogdmFsXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgICAgIChhcHAgYXMgYW55KS53YXRjaCQoJ2FwcENvbmZpZycsIHZhbCA9PiB7XG4gICAgICAgICAgICBpZiAoICF2YWwgKSB7IHJldHVybjsgfVxuICAgICAgICAgICAgdGhpcy5zZXREYXRhISh7XG4gICAgICAgICAgICAgICAgaXBOYW1lOiB2YWxbJ2lwLW5hbWUnXSxcbiAgICAgICAgICAgICAgICBpcEF2YXRhcjogdmFsWydpcC1hdmF0YXInXSxcbiAgICAgICAgICAgICAgICBwdXNoSW50ZWdyYWxSYXRlOiAodmFsIHx8IHsgfSlbJ3B1c2gtaW50ZWdyYWwtZ2V0LXJhdGUnXSB8fCAwLFxuICAgICAgICAgICAgICAgIGNhbkludGVncmF5U2hhcmU6ICEhKHZhbCB8fCB7IH0pWydnb29kLWludGVncmFsLXNoYXJlJ10gfHwgZmFsc2VcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgdGhpcy5jcmVhdGVTaGFyZSggKTtcbiAgICAgICAgfSk7XG4gICAgICAgIChhcHAgYXMgYW55KS53YXRjaCQoJ29wZW5pZCcsIHZhbCA9PiB7XG4gICAgICAgICAgICB0aGlzLnNldERhdGEhKHtcbiAgICAgICAgICAgICAgICBvcGVuaWQ6IHZhbFxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB0aGlzLmNyZWF0ZVNoYXJlKCApO1xuICAgICAgICAgICAgdGhpcy5mZXRjaFNoYXJlciggKTtcbiAgICAgICAgfSk7XG4gICAgICAgIGFwcC53YXRjaCQoJ2lzVXNlckF1dGgnLCB2YWwgPT4ge1xuICAgICAgICAgICAgaWYgKCB2YWwgPT09IHVuZGVmaW5lZCApIHsgcmV0dXJuOyB9XG4gICAgICAgICAgICB0aGlzLnNldERhdGEhKHtcbiAgICAgICAgICAgICAgICBpc1VzZXJBdXRoOiB2YWxcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9LFxuXG4gICAgLyoqIOaLieWPluWVhuWTgeivpuaDhSAqL1xuICAgIGZldERldGFpbCggaWQgKSB7XG4gICAgICAgIGNvbnN0IHsgZGV0YWlsLCBmcm9tLCBzaG93QWRtQnRuLCBoYXNTaG93UGxheVRpcHMgfSA9IHRoaXMuZGF0YTtcbiAgICAgICAgaWYgKCBkZXRhaWwgJiYgIXNob3dBZG1CdG4gKSB7IHJldHVybjsgfVxuICAgICAgICBodHRwKHtcbiAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICBfaWQ6IGlkLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGVyck1zZzogJ+iOt+WPluWVhuWTgemUmeivr++8jOivt+mHjeivlScsXG4gICAgICAgICAgICB1cmw6IGBnb29kX2RldGFpbGAsXG4gICAgICAgICAgICBzdWNjZXNzOiByZXMgPT4ge1xuICAgICAgICAgICAgICBpZiAoIHJlcy5zdGF0dXMgIT09IDIwMCApIHsgcmV0dXJuOyB9XG5cbiAgICAgICAgICAgICAgICBsZXQgcGluOiBhbnkgPSBbIF07XG4gICAgICAgICAgICAgICAgY29uc3QgeyBzdGFuZGFyZHMsIGdyb3VwUHJpY2UsIGFjdGl2aXRpZXMgfSA9IHJlcy5kYXRhO1xuXG4gICAgICAgICAgICAgICAgaWYgKCBzdGFuZGFyZHMubGVuZ3RoID4gMCApIHtcbiAgICAgICAgICAgICAgICAgICAgcGluID0gc3RhbmRhcmRzLmZpbHRlciggeCA9PiAhIXguZ3JvdXBQcmljZSApO1xuXG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmICggISFncm91cFByaWNlICkge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCB7IHByaWNlLCB0aXRsZSwgaW1nICB9ID0gcmVzLmRhdGE7XG4gICAgICAgICAgICAgICAgICAgIHBpbiA9IFt7XG4gICAgICAgICAgICAgICAgICAgICAgICBwcmljZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6IHRpdGxlLFxuICAgICAgICAgICAgICAgICAgICAgICAgZ3JvdXBQcmljZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGltZzogaW1nWyAwIF1cbiAgICAgICAgICAgICAgICAgICAgfV07XG4gICAgICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgICAgIGNvbnN0IGFjdGl2aXRpZXMkID0gYWN0aXZpdGllcy5tYXAoIHggPT4ge1xuXG4gICAgICAgICAgICAgICAgICAgIGxldCBpbWcgPSAnJztcbiAgICAgICAgICAgICAgICAgICAgaWYgKCAhIXguc2lkICkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaW1nID0gc3RhbmRhcmRzLmZpbmQoIHkgPT4geS5faWQgPT09IHguc2lkICkuaW1nXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpbWcgPSByZXMuZGF0YS5pbWdbIDAgXTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBPYmplY3QuYXNzaWduKHsgfSwgeCwgeyBcbiAgICAgICAgICAgICAgICAgICAgICAgIGltZyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvdW50ZG93bjogKCB4LmVuZFRpbWUgLSBuZXcgRGF0ZSggKS5nZXRUaW1lKCApKSAvICggMTAwMCApXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgfSkuZmlsdGVyKCB5ID0+IHkuZW5kVGltZSA+IG5ldyBEYXRlKCApLmdldFRpbWUoICkpO1xuXG4gICAgICAgICAgICAgICAgdGhpcy5zZXREYXRhISh7XG4gICAgICAgICAgICAgICAgICAgIHBpbixcbiAgICAgICAgICAgICAgICAgICAgbG9hZGluZzogZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgIGRldGFpbDogcmVzLmRhdGEsXG4gICAgICAgICAgICAgICAgICAgIGFjdGl2aXRpZXM6IGFjdGl2aXRpZXMkXG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICAvLyDlvLnotbfmi7zlm6LmoYZcbiAgICAgICAgICAgICAgICBpZiAoICEhZnJvbSAmJiBkZWxheWVyaW5nR29vZCggcmVzLmRhdGEgKS5oYXNQaW4gJiYgIWhhc1Nob3dQbGF5VGlwcyApIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zZXREYXRhISh7XG4gICAgICAgICAgICAgICAgICAgICAgICBzaG93UGxheVRpcHM6ICdzaG93JyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGhhc1Nob3dQbGF5VGlwczogdHJ1ZVxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKCAhZnJvbSAmJiBkZWxheWVyaW5nR29vZCggcmVzLmRhdGEgKS5oYXNQaW4gKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY2hlY2tPcGVuUGluKCApO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfSxcblxuICAgIC8qKiDmi4nlj5booYznqIvnmoTotK3nianor7fljZXkv6Hmga8gKi9cbiAgICBmZXRjaFNob3BwaW5nKCBwaWQsIHRpZCApIHtcbiAgICAgICAgaWYgKCAhcGlkIHx8ICF0aWQgKSB7IHJldHVybjsgfVxuXG4gICAgICAgIGh0dHAoe1xuICAgICAgICAgICAgdXJsOiAnc2hvcHBpbmctbGlzdF9waW4nLFxuICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgIC8vIHBpZCxcbiAgICAgICAgICAgICAgICB0aWQsXG4gICAgICAgICAgICAgICAgZGV0YWlsOiB0cnVlLFxuICAgICAgICAgICAgICAgIHNob3dVc2VyOiB0cnVlXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgc3VjY2VzczogcmVzID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCB7IHN0YXR1cywgZGF0YSB9ID0gcmVzO1xuICAgICAgICAgICAgICAgIGlmICggc3RhdHVzICE9PSAyMDAgKSB7IHJldHVybjsgfVxuICAgICAgICAgICAgICAgIHRoaXMuc2V0RGF0YSEoe1xuICAgICAgICAgICAgICAgICAgICBzaG9wcGluZzogZGF0YSxcbiAgICAgICAgICAgICAgICAgICAgY2FuUGluU2t1OiBkYXRhLm1hcCggeCA9PiAoe1xuICAgICAgICAgICAgICAgICAgICAgICAgcGlkOiB4LnBpZCxcbiAgICAgICAgICAgICAgICAgICAgICAgIHNpZDogeC5zaWRcbiAgICAgICAgICAgICAgICAgICAgfSkpXG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICBpZiAoIGRhdGEubGVuZ3RoID4gMCApIHtcbiAgICAgICAgICAgICAgICAgICAgd3guc2V0TmF2aWdhdGlvbkJhclRpdGxlKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRpdGxlOiAn5ou85Zui5LitIOWIkueul++8gSdcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgfSxcblxuICAgIC8qKiDmi4nlj5blvZPliY3llYblk4HnmoTorr/pl67orrDlvZUgKi9cbiAgICBmZXRjaFZpc2l0UmVjb3JkKCBwaWQsIHN0YXJ0LCBiZWZvcmUgKSB7XG4gICAgICAgIGlmICggIXN0YXJ0IHx8ICFiZWZvcmUgKSB7IHJldHVybjsgfVxuICAgICAgICBodHRwKHtcbiAgICAgICAgICAgIHVybDogJ2dvb2RfZ29vZC12aXNpdG9ycycsXG4gICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgcGlkLFxuICAgICAgICAgICAgICAgIHN0YXJ0LCBcbiAgICAgICAgICAgICAgICBiZWZvcmVcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBzdWNjZXNzOiByZXMgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IHsgc3RhdHVzLCBkYXRhIH0gPSByZXM7XG4gICAgICAgICAgICAgICAgaWYgKCBzdGF0dXMgIT09IDIwMCApIHsgcmV0dXJuOyB9XG4gICAgICAgICAgICAgICAgdGhpcy5zZXREYXRhISh7XG4gICAgICAgICAgICAgICAgICAgIHZpc2l0b3JzOiBkYXRhXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH0sXG5cbiAgICAvKiog5ouJ5Y+W5Lik5Liq5pyA5paw6KGM56iLICovXG4gICAgZmV0Y2hMYXN0KCApIHtcbiAgICAgICAgY29uc3QgeyBpZCB9ID0gdGhpcy5kYXRhO1xuICAgICAgICBodHRwKHtcbiAgICAgICAgICAgIGRhdGE6IHsgfSxcbiAgICAgICAgICAgIHVybDogYHRyaXBfZW50ZXJgLFxuICAgICAgICAgICAgc3VjY2VzczogcmVzID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCB7IHN0YXR1cywgZGF0YSB9ID0gcmVzO1xuICAgICAgICAgICAgICAgIGlmICggc3RhdHVzICE9PSAyMDAgKSB7IHJldHVybjsgfVxuICAgICAgICAgICAgICAgIGNvbnN0IHRyaXAgPSBkYXRhWyAwIF07XG4gICAgICAgICAgICAgICAgaWYgKCAhIXRyaXAgKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHsgX2lkLCBzdGFydF9kYXRlLCBlbmRfZGF0ZSB9ID0gdHJpcDtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgdGlkID0gX2lkXG5cbiAgICAgICAgICAgICAgICAgICAgdGhpcy5mZXRjaFNob3BwaW5nKCBpZCwgdGlkICk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZmV0Y2hWaXNpdFJlY29yZCggaWQsIHN0YXJ0X2RhdGUsIGVuZF9kYXRlICk7XG5cbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zZXREYXRhISh7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aWQsXG4gICAgICAgICAgICAgICAgICAgICAgICB0cmlwXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSlcbiAgICB9LFxuXG4gICAgLyoqIOiOt+WPluS4iuS4quWIhuS6q+S6uueahOWktOWDjyAqL1xuICAgIGZldGNoU2hhcmVyKCApIHtcbiAgICAgICAgY29uc3QgeyBvcGVuaWQsIGZyb20gfSA9IHRoaXMuZGF0YTtcbiAgICAgICAgaWYgKCAhZnJvbSB8fCAhb3BlbmlkIHx8IGZyb20gPT09IG9wZW5pZCApIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBodHRwKHtcbiAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICBvcGVuaWQ6IGZyb20gXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgdXJsOiAnY29tbW9uX2dldC11c2VyLWluZm8nLFxuICAgICAgICAgICAgc3VjY2VzczogcmVzID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCB7IHN0YXR1cywgZGF0YSB9ID0gcmVzO1xuICAgICAgICAgICAgICAgIGlmICggc3RhdHVzICE9PSAyMDAgfHwgIWRhdGEgKSB7IHJldHVybjsgfVxuICAgICAgICAgICAgICAgIGRhdGEucm9sZSAhPT0gMSAmJiB0aGlzLnNldERhdGEhKHtcbiAgICAgICAgICAgICAgICAgICAgc2hhcmVGcm9tVXNlcjogZGF0YVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KVxuICAgIH0sXG5cbiAgICBpbml0Q292ZXJUZXh0KCApIHtcbiAgICAgICAgY29uc3QgbnVtID0gMTggKyBNYXRoLmNlaWwoIE1hdGgucmFuZG9tKCApICogMjApO1xuICAgICAgICB0aGlzLnNldERhdGEhKHtcbiAgICAgICAgICAgIGNvdmVyVGV4dDogYCR7bnVtfeS6uueci+i/h2BcbiAgICAgICAgfSk7XG4gICAgfSxcblxuICAgIC8qKiDliJvlu7rliIbkuqvorrDlvZUgKi9cbiAgICBjcmVhdGVTaGFyZSggKSB7XG4gICAgICAgIGNvbnN0IHsgaWQsIGNhbkludGVncmF5U2hhcmUsIGZyb20sIG9wZW5pZCB9ID0gdGhpcy5kYXRhO1xuICAgICAgICBpZiAoICFpZCB8fCAhY2FuSW50ZWdyYXlTaGFyZSB8fCAhZnJvbSB8fCAhb3BlbmlkICkgeyByZXR1cm47IH1cbiAgICAgICAgaHR0cCh7XG4gICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgZnJvbSxcbiAgICAgICAgICAgICAgICBwaWQ6IGlkLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHVybDogJ2NvbW1vbl9jcmVhdGUtc2hhcmUnXG4gICAgICAgIH0pO1xuICAgIH0sXG5cbiAgICAvLyDlsZXlvIDmi7zlm6Lnjqnms5Xmj5DnpLpcbiAgICB0b2dnbGVQYWx5VGlwcyggZT8gKSB7XG4gICAgICAgIGNvbnN0IHsgc2hvd1BsYXlUaXBzIH0gPSB0aGlzLmRhdGE7XG4gICAgICAgIHRoaXMuc2V0RGF0YSEoe1xuICAgICAgICAgICAgc2hvd1BsYXlUaXBzOiBzaG93UGxheVRpcHMgPT09ICdzaG93JyA/ICdoaWRlJyA6ICdzaG93J1xuICAgICAgICB9KTtcbiAgICB9LFxuXG4gICAgLy8g6I635Y+W5o6I5p2D44CB5YWz6Zet5ou85Zui546p5rOV5o+Q56S6XG4gICAgZ2V0VXNlckF1dGgoICkge1xuICAgICAgICBhcHAuZ2V0V3hVc2VySW5mbygoICkgPT4ge1xuICAgICAgICAgICAgdGhpcy5zZXREYXRhISh7XG4gICAgICAgICAgICAgICAgc2hvd1BsYXlUaXBzOiAnaGlkZSdcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9LFxuXG4gICAgLy8g5bGV56S65o6o5bm/56ev5YiG6KeE5YiZXG4gICAgdG9nZ2xlU2hhcmVHZXRNb25leSggKSB7XG4gICAgICAgIGNvbnN0IHsgc2hvd1NoYXJlR2V0TW9uZXkgfSA9IHRoaXMuZGF0YTtcbiAgICAgICAgdGhpcy5zZXREYXRhISh7XG4gICAgICAgICAgICBzaG93U2hhcmVHZXRNb25leTogIXNob3dTaGFyZUdldE1vbmV5XG4gICAgICAgIH0pO1xuICAgICAgICBpZiAoICFzaG93U2hhcmVHZXRNb25leSApIHtcbiAgICAgICAgICAgIHRoaXMub25TdWJzY3JpYmUoICk7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgLy8g5bGV56S65ou85Zui5YiX6KGoXG4gICAgdG9nZ2xlUGluR29vZHMoICkge1xuICAgICAgICBjb25zdCB7IHNob3dQaW5Hb29kcyB9ID0gdGhpcy5kYXRhO1xuICAgICAgICB0aGlzLnNldERhdGEhKHtcbiAgICAgICAgICAgIHNob3dQaW5Hb29kczogc2hvd1Bpbkdvb2RzID09PSAnaGlkZScgPyAnc2hvdycgOiAnaGlkZSdcbiAgICAgICAgfSk7XG4gICAgICAgIGlmICggc2hvd1Bpbkdvb2RzID09PSAnaGlkZScgKSB7XG4gICAgICAgICAgICB0aGlzLm9uU3Vic2NyaWJlKCApO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIG9uU3Vic2NyaWJlKCApIHtcbiAgICAgICAgYXBwLmdldFN1YnNjcmliZSgnYnV5UGluLGhvbmdiYW8sdHJpcCcpO1xuICAgIH0sXG5cbiAgICAvLyDov5vlhaXllYblk4HnrqHnkIZcbiAgICBnb01hbmFnZXIoICkge1xuICAgICAgICBuYXZUbyhgL3BhZ2VzL21hbmFnZXItZ29vZHMtZGV0YWlsL2luZGV4P2lkPSR7dGhpcy5kYXRhLmlkfWApO1xuICAgIH0sXG5cbiAgICAvLyDov5vlhaXmi7zlm6Llub/lnLpcbiAgICBnb0dyb3VuZCggKSB7XG4gICAgICAgIG5hdlRvKCcvcGFnZXMvZ3JvdW5kLXBpbi9pbmRleCcpXG4gICAgfSxcbiAgICBcbiAgICAvLyDov5vlhaXllYblk4Hor6bmg4VcbiAgICBnb0dvb2REZXRhaWwoeyBjdXJyZW50VGFyZ2V0IH0pIHtcbiAgICAgICAgY29uc3QgeyBwaWQgfSA9IGN1cnJlbnRUYXJnZXQuZGF0YXNldDtcbiAgICAgICAgbmF2VG8oYC9wYWdlcy9nb29kcy1kZXRhaWwvaW5kZXg/aWQ9JHtwaWR9YClcbiAgICB9LFxuXG4gICAgLyoqIOmihOiniOWbvueJhyAqL1xuICAgIHByZXZpZXdJbWcoeyBjdXJyZW50VGFyZ2V0IH0pIHtcbiAgICAgICAgY29uc3QgeyBpbWcgfSA9IGN1cnJlbnRUYXJnZXQuZGF0YXNldDtcbiAgICAgICAgdGhpcy5kYXRhLmRldGFpbCAmJiB3eC5wcmV2aWV3SW1hZ2Uoe1xuICAgICAgICAgICAgY3VycmVudDogaW1nLFxuICAgICAgICAgICAgdXJsczogWyAuLi4odGhpcy5kYXRhIGFzIGFueSkuZGV0YWlsLmltZyBdLFxuICAgICAgICB9KTtcbiAgICB9LFxuXG4gICAgLyoqIOmihOiniOWNleW8oOWbvueJh++8muaLvOWbouWbvueJh+OAgeS4gOWPo+S7t++8iOmZkOaXtuaKou+8iSAqL1xuICAgIHByZXZpZXdTaW5nbGVJbWcoeyBjdXJyZW50VGFyZ2V0IH0pIHtcblxuICAgICAgICBjb25zdCBpbWcgPSBjdXJyZW50VGFyZ2V0LmRhdGFzZXQuZGF0YSA/XG4gICAgICAgICAgICBjdXJyZW50VGFyZ2V0LmRhdGFzZXQuZGF0YS5pbWc6XG4gICAgICAgICAgICBjdXJyZW50VGFyZ2V0LmRhdGFzZXQuaW1nO1xuXG4gICAgICAgIHRoaXMuZGF0YS5kZXRhaWwgJiYgd3gucHJldmlld0ltYWdlKHtcbiAgICAgICAgICAgIGN1cnJlbnQ6IGltZyxcbiAgICAgICAgICAgIHVybHM6IFsgaW1nIF0sXG4gICAgICAgIH0pO1xuICAgIH0sXG5cbiAgICAvKiog5qOA5p+l5piv5ZCm5pyJ5Li75Yqo5by55byA6L+H5ou85Zui546p5rOVICovXG4gICAgY2hlY2tPcGVuUGluKCApIHtcbiAgICAgICAgY29uc3QgeyBkZXRhaWwgfSA9IHRoaXMuZGF0YTtcbiAgICAgICAgaWYgKCAhZGV0YWlsICkgeyByZXR1cm4gfVxuICAgICAgICBjb25zdCByZXN1bHQgPSBkZWxheWVyaW5nR29vZCggZGV0YWlsICk7XG4gICAgICAgIGlmICggcmVzdWx0ICkge1xuICAgICAgICAgICAgY29uc3Qgb25lRGF5ID0gMjQgKiA2MCAqIDYwICogMTAwMDtcbiAgICAgICAgICAgIGNvbnN0IHByaWNlR2FwID0gU3RyaW5nKCByZXN1bHQuZ29vZFBpbnMuZWFjaFByaWNlUm91bmQgKS5yZXBsYWNlKC9cXC4wMC9nLCAnJyk7XG4gICAgICAgICAgICBjb25zdCBvcGVuUmVjb3JkID0gd3guZ2V0U3RvcmFnZVN5bmMoIHN0b3JhZ2VLZXkgKTtcblxuICAgICAgICAgICAgaWYgKCAhIXByaWNlR2FwICYmIERhdGUubm93KCApIC0gTnVtYmVyKCBvcGVuUmVjb3JkICkgPj0gb25lRGF5ICkge1xuICAgICAgICAgICAgICAgIHd4LnNldFN0b3JhZ2VTeW5jKCBzdG9yYWdlS2V5LCBTdHJpbmcoIERhdGUubm93KCApKSk7XG4gICAgICAgICAgICAgICAgdGhpcy50b2dnbGVQYWx5VGlwcyggKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICAvKiog6K6+572u4oCc5Zac5qyi4oCdICovXG4gICAgb25MaWtlKCApIHtcbiAgICAgICAgY29uc3QgdGhhdCA9IHRoaXM7XG4gICAgICAgIGlmICggIXRoaXMuZGF0YS5oYXNJbml0TGlrZSApIHsgcmV0dXJuOyB9XG4gICAgICAgIGh0dHAoe1xuICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgIHBpZDogdGhpcy5kYXRhLmlkXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgdXJsOiAnbGlrZV9jcmVhdGUnLFxuICAgICAgICAgICAgc3VjY2VzczogICggcmVzOiBhbnkgKSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKCByZXMuc3RhdHVzID09PSAyMDAgKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc2V0RGF0YSEoe1xuICAgICAgICAgICAgICAgICAgICAgICAgbGlrZWQ6ICF0aGlzLmRhdGEubGlrZWRcbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH0sXG5cbiAgICAvKiog6K6+572u4oCc5Zac5qyi4oCdICovXG4gICAgY2hlY2tMaWtlKCApIHtcbiAgICAgICAgY29uc3QgdGhhdCA9IHRoaXM7XG4gICAgICAgIGh0dHAoe1xuICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgIHBpZDogdGhpcy5kYXRhLmlkXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgdXJsOiAnbGlrZV9jaGVjaycsXG4gICAgICAgICAgICBzdWNjZXNzOiAgKCByZXM6IGFueSApID0+IHtcbiAgICAgICAgICAgICAgICBpZiAoIHJlcy5zdGF0dXMgPT09IDIwMCApIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zZXREYXRhISh7XG4gICAgICAgICAgICAgICAgICAgICAgICBsaWtlZDogcmVzLmRhdGEsXG4gICAgICAgICAgICAgICAgICAgICAgICBoYXNJbml0TGlrZTogdHJ1ZVxuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfSxcblxuICAgIC8qKiDmtbfmiqXlvIDlhbPnm5HlkKwgKi9cbiAgICBvblBvc3RUb2dnbGUoIGUgKSB7XG4gICAgICAgIGNvbnN0IHZhbCA9IGUuZGV0YWlsO1xuICAgICAgICB0aGlzLnNldERhdGEhKHtcbiAgICAgICAgICAgIHNob3dpbmdQb3N0ZXI6IHZhbFxuICAgICAgICB9KTtcbiAgICAgICAgd3guc2V0TmF2aWdhdGlvbkJhclRpdGxlKHtcbiAgICAgICAgICAgIHRpdGxlOiB2YWwgPyAn5YiG5Lqr5ZWG5ZOBJyA6ICfllYblk4Hor6bmg4UnXG4gICAgICAgIH0pO1xuICAgIH0sXG5cbiAgICAvKiog5rW35oqlLS3lvIAgKi9cbiAgICBvcGVuUG9zdGVyKCApIHtcbiAgICAgICAgY29uc3QgeyBzaG93aW5nUG9zdGVyIH0gPSB0aGlzLmRhdGE7XG4gICAgICAgIGNvbnN0IHBvc3RlciA9ICh0aGlzIGFzIGFueSkuc2VsZWN0Q29tcG9uZW50KCcjcG9zdGVyJyk7XG4gICAgICAgIHBvc3Rlci50b2dnbGUoICk7XG4gICAgICAgIGlmICggIXNob3dpbmdQb3N0ZXIgKSB7XG4gICAgICAgICAgICB0aGlzLm9uU3Vic2NyaWJlKCApO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIC8qKiDmtbfmiqUtLeWFsyAqL1xuICAgIGNsb3NlUG9zdGVyKCApIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGNvbnN0IHBvc3RlciA9ICh0aGlzIGFzIGFueSkuc2VsZWN0Q29tcG9uZW50KCcjcG9zdGVyJyk7XG4gICAgICAgICAgICBwb3N0ZXIuY2xvc2UoICk7XG4gICAgICAgIH0gY2F0Y2ggKCBlICkgeyB9XG4gICAgfSxcblxuICAgIC8qKiBza3XpgInmi6nlvLnmoYYgKi9cbiAgICBvblNrdVRvZ2dsZSggZSApIHtcbiAgICAgICAgdGhpcy5zZXREYXRhISh7XG4gICAgICAgICAgICBvcGVuaW5nU2t1OiBlLmRldGFpbFxuICAgICAgICB9KTtcbiAgICB9LFxuXG4gICAgLyoqIHNrdeafkOmDqOWIhueCueWHuyAqL1xuICAgIG9uU2t1VGFwKCBlICkge1xuICAgICAgICBjb25zdCB0eXBlID0gZS5kZXRhaWw7XG4gICAgICAgIGlmICggdHlwZSA9PT0gJ21vbmV5UXVlc3Rpb24nICkge1xuICAgICAgICAgICAgdGhpcy50b2dnbGVTaGFyZUdldE1vbmV5KCApO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIC8qKiDlsZXlvIDjgIHlhbPpl61za3XmoYYgKi9cbiAgICBvblRvZ2dsZVNrdSggKSB7XG4gICAgICAgIGNvbnN0IHsgb3BlbmluZ1NrdSB9ID0gdGhpcy5kYXRhO1xuICAgICAgICBjb25zdCBza3UgPSAodGhpcyBhcyBhbnkpLnNlbGVjdENvbXBvbmVudCgnI3NrdScpO1xuICAgICAgICBza3UudG9nZ2xlU2t1KCApO1xuICAgICAgICBpZiAoICFvcGVuaW5nU2t1ICkge1xuICAgICAgICAgICAgdGhpcy5vblN1YnNjcmliZSggKTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICAvKiog6L2s5Y+R5bCB6Z2iICovXG4gICAgb25Db3ZlckRvbmUoIGUgKSB7XG4gICAgICAgIHRoaXMuc2V0RGF0YSEoe1xuICAgICAgICAgICAgc2hhcmVDb3ZlcjogZS5kZXRhaWxcbiAgICAgICAgfSk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIOeUn+WRveWRqOacn+WHveaVsC0t55uR5ZCs6aG16Z2i5Yqg6L29XG4gICAgICoge1xuICAgICAqICAgIGlkIHx8IHNjZW5lIC8vIOWVhuWTgWlkXG4gICAgICogICAgdGlkIC8vIOihjOeoi2lkXG4gICAgICogICAgZnJvbSAvLyDliIbkuqvkurrnmoRpZFxuICAgICAqIH1cbiAgICAgKi9cbiAgICBvbkxvYWQ6IGZ1bmN0aW9uIChvcHRpb25zKSB7XG5cbiAgICAgICAgY29uc3Qgc2NlbmUgPSBkZWNvZGVVUklDb21wb25lbnQoIG9wdGlvbnMhLnNjZW5lIHx8ICcnIClcbiAgICAgICAgY29uc3QgaWQgPSBvcHRpb25zIS5pZCB8fCBzY2VuZSB8fCAnZWUzMDk5Mjg1Y2RiZjM4ZjEyODY5YjEzMzYzYmMyMDYnO1xuXG4gICAgICAgIHRoaXMuc2V0RGF0YSEoe1xuICAgICAgICAgICAgZnJvbTogJ29KeUdCNG50ZVBZY0tUOE9mVy0zcWIxOUpzakEnXG4gICAgICAgIH0pXG5cbiAgICAgICAgdGhpcy5ydW5Db21wdXRlZCggKTtcbiAgICAgICAgdGhpcy5pbml0Q292ZXJUZXh0KCApO1xuXG4gICAgICAgIGlmICggISFpZCApIHsgXG4gICAgICAgICAgICB0aGlzLnNldERhdGEhKHtcbiAgICAgICAgICAgICAgICBpZFxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoICEhKG9wdGlvbnMgYXMgYW55KS5mcm9tICkge1xuICAgICAgICAgICAgdGhpcy5zZXREYXRhISh7XG4gICAgICAgICAgICAgICAgZnJvbTogb3B0aW9ucyEuZnJvbVxuICAgICAgICAgICAgfSlcbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgc2V0VGltZW91dCgoICkgPT4ge1xuICAgICAgICAgICAgdGhpcy53YXRjaFJvbGUoICk7XG4gICAgICAgICAgICB0aGlzLmZldGNoTGFzdCggKTtcbiAgICAgICAgICAgIHRoaXMuZmV0RGV0YWlsKCBpZCApO1xuICAgICAgICB9LCAyMCApO1xuICAgIH0sXG4gIFxuICAgIC8qKlxuICAgICAqIOeUn+WRveWRqOacn+WHveaVsC0t55uR5ZCs6aG16Z2i5Yid5qyh5riy5p+T5a6M5oiQXG4gICAgICovXG4gICAgb25SZWFkeTogZnVuY3Rpb24gKCApIHtcbiAgICAgICAgLy8gbGV0IGNpcmNsZUNvdW50ID0gMDsgXG4gICAgICAgIC8vIGNvbnN0IHRoYXQ6IGFueSA9IHRoaXM7XG4gICAgICAgIC8vIC8vIOW/g+i3s+eahOWkluahhuWKqOeUuyBcbiAgICAgICAgLy8gdGhhdC5hbmltYXRpb25NaWRkbGVIZWFkZXJJdGVtID0gd3guY3JlYXRlQW5pbWF0aW9uKHsgXG4gICAgICAgIC8vICAgICBkdXJhdGlvbjogODAwLCBcbiAgICAgICAgLy8gICAgIHRpbWluZ0Z1bmN0aW9uOiAnZWFzZScsIFxuICAgICAgICAvLyAgICAgdHJhbnNmb3JtT3JpZ2luOiAnNTAlIDUwJScsXG4gICAgICAgIC8vIH0pOyBcbiAgICAgICAgLy8gc2V0SW50ZXJ2YWwoIGZ1bmN0aW9uKCApIHsgXG4gICAgICAgIC8vICAgICBpZiAoY2lyY2xlQ291bnQgJSAyID09IDApIHsgXG4gICAgICAgIC8vICAgICAgICAgdGhhdC5hbmltYXRpb25NaWRkbGVIZWFkZXJJdGVtLnNjYWxlKCAxLjAgKS5yb3RhdGUoIDEwICkuc3RlcCggKTsgXG4gICAgICAgIC8vICAgICB9IGVsc2UgeyBcbiAgICAgICAgLy8gICAgICAgICB0aGF0LmFuaW1hdGlvbk1pZGRsZUhlYWRlckl0ZW0uc2NhbGUoIDEuMCApLnJvdGF0ZSggLTMwICkuc3RlcCggKTsgXG4gICAgICAgIC8vICAgICB9IFxuICAgICAgICAvLyAgICAgdGhhdC5zZXREYXRhKHsgXG4gICAgICAgIC8vICAgICAgICAgYW5pbWF0aW9uTWlkZGxlSGVhZGVySXRlbTogdGhhdC5hbmltYXRpb25NaWRkbGVIZWFkZXJJdGVtLmV4cG9ydCggKSBcbiAgICAgICAgLy8gICAgIH0pOyBcbiAgICAgICAgICAgIFxuICAgICAgICAvLyAgICAgaWYgKCArK2NpcmNsZUNvdW50ID09PSAxMDAwICkgeyBcbiAgICAgICAgLy8gICAgICAgICBjaXJjbGVDb3VudCA9IDA7IFxuICAgICAgICAvLyAgICAgfSBcbiAgICAgICAgLy8gfS5iaW5kKCB0aGlzICksIDEwMDAgKTsgXG4gICAgfSxcbiAgXG4gICAgLyoqXG4gICAgICog55Sf5ZG95ZGo5pyf5Ye95pWwLS3nm5HlkKzpobXpnaLmmL7npLpcbiAgICAgKi9cbiAgICBvblNob3c6IGZ1bmN0aW9uICggKSB7XG4gICAgICAgIGNvbnN0IHsgaWQsIHRpZCwgdHJpcCwgZGV0YWlsLCBzaG93QWRtQnRuIH0gPSB0aGlzLmRhdGE7XG4gICAgICAgIFxuICAgICAgICB0aGlzLmZldGNoU2hvcHBpbmcoIGlkLCB0aWQgKTtcbiAgICAgICAgaWYgKCAhIXRyaXAgKSB7XG4gICAgICAgICAgICBjb25zdCB7IHN0YXJ0X2RhdGUsIGVuZF9kYXRlIH0gPSAodHJpcCBhcyBhbnkpO1xuICAgICAgICAgICAgdGhpcy5mZXRjaFZpc2l0UmVjb3JkKCBpZCwgc3RhcnRfZGF0ZSwgZW5kX2RhdGUgKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICggISFkZXRhaWwgJiYgISFzaG93QWRtQnRuICkge1xuICAgICAgICAgICAgdGhpcy5mZXREZXRhaWwoIGlkICk7XG4gICAgICAgIH1cblxuICAgIH0sXG4gIFxuICAgIC8qKlxuICAgICAqIOeUn+WRveWRqOacn+WHveaVsC0t55uR5ZCs6aG16Z2i6ZqQ6JePXG4gICAgICovXG4gICAgb25IaWRlOiBmdW5jdGlvbiAoKSB7XG4gIFxuICAgIH0sXG4gIFxuICAgIC8qKlxuICAgICAqIOeUn+WRveWRqOacn+WHveaVsC0t55uR5ZCs6aG16Z2i5Y246L29XG4gICAgICovXG4gICAgb25VbmxvYWQ6IGZ1bmN0aW9uICgpIHtcbiAgXG4gICAgfSxcbiAgXG4gICAgLyoqXG4gICAgICog6aG16Z2i55u45YWz5LqL5Lu25aSE55CG5Ye95pWwLS3nm5HlkKznlKjmiLfkuIvmi4nliqjkvZxcbiAgICAgKi9cbiAgICBvblB1bGxEb3duUmVmcmVzaDogZnVuY3Rpb24gKCkge1xuICBcbiAgICB9LFxuICBcbiAgICAvKipcbiAgICAgKiDpobXpnaLkuIrmi4nop6blupXkuovku7bnmoTlpITnkIblh73mlbBcbiAgICAgKi9cbiAgICBvblJlYWNoQm90dG9tOiBmdW5jdGlvbiAoKSB7XG4gIFxuICAgIH0sXG4gIFxuICAgIC8qKlxuICAgICAqIOeUqOaIt+eCueWHu+WPs+S4iuinkuWIhuS6q1xuICAgICAqL1xuICAgIG9uU2hhcmVBcHBNZXNzYWdlOiBmdW5jdGlvbiAoIGUgKSB7XG4gICAgICAgIGNvbnN0IHsgaGFzT3JkZXIkLCBkZXRhaWwkLCBvcGVuaWQsIHNoYXJlQ292ZXIgfSA9ICh0aGlzLmRhdGEgYXMgYW55KTtcblxuICAgICAgICB0aGlzLmNsb3NlUG9zdGVyKCApO1xuICAgICAgICBzZXRUaW1lb3V0KCggKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBzaGFyZUZlZGJhY2sgPSAodGhpcyBhcyBhbnkpLnNlbGVjdENvbXBvbmVudCgnI3NoYXJlLWZlZWRiYWNrJyk7XG4gICAgICAgICAgICBzaGFyZUZlZGJhY2sudG9nZ2xlKCApO1xuICAgICAgICB9LCA1MDAgKTtcblxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgaW1hZ2VVcmw6IHNoYXJlQ292ZXIgfHwgYCR7ZGV0YWlsJC5pbWdbIDAgXX1gLFxuICAgICAgICAgICAgcGF0aDogYC9wYWdlcy9nb29kcy1kZXRhaWwvaW5kZXg/aWQ9JHtkZXRhaWwkLl9pZH0mZnJvbT0ke29wZW5pZH1gLFxuICAgICAgICAgICAgdGl0bGU6ICEhZGV0YWlsJCAmJiBkZXRhaWwkLmhhc1BpbiAmJiAhaGFzT3JkZXIkID9cbiAgICAgICAgICAgICAgICBg5pyJ5Lq65oOz6KaB5ZCX77yf5ou85Zui5Lmw77yM5oiR5Lus6YO96IO955yB77yBJHtkZXRhaWwkLnRpdGxlfSAke2RldGFpbCQudGFnVGV4dH1gIDpcbiAgICAgICAgICAgICAgICBg5o6o6I2Q44CMJHtkZXRhaWwkLnRhZ1RleHR944CN56We5ZmoISR7ZGV0YWlsJC50aXRsZX1gXG4gICAgICAgIH1cbiAgICB9XG4gIH0pIl19