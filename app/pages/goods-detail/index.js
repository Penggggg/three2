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
        coverText: "23人看过"
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
                    "\u5212\u7B97\u8036\uFF01\u6709\u7FA4\u53CB\u62FC\u56E2\u5417",
                    "\u300C" + good.tagText + "\u300D\u611F\u89C9\u4E0D\u9519",
                    "\u770B\u8D77\u6765\u4E0D\u9519\uFF01\u60F3\u62FC\u56E2",
                    "\u6709\u7FA4\u53CB\u62FC\u56E2\u5417\uFF1F\u6211\u4EEC\u4E00\u8D77\u7701"
                ];
                var allVisitors = visitors
                    .filter(function (x) { return x.openid !== openid; })
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
                    var users = sl.users, detail = sl.detail;
                    var name = detail.name;
                    return __assign({}, sl, { name: name, firstUser: users[0], otherUser: users.slice(1), tips: allTexts[getRandom(allTexts.length)] });
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
                _this.setData({
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7O0FBQ0EsOENBQTBDO0FBQzFDLHFEQUFvRDtBQUNwRCxnREFBcUQ7QUFDckQsZ0RBQTRDO0FBRTVDLElBQU0sR0FBRyxHQUFHLE1BQU0sRUFBUSxDQUFDO0FBRzNCLElBQU0sVUFBVSxHQUFHLG9CQUFvQixDQUFDO0FBRXhDLElBQUksQ0FBQztJQUdELHlCQUF5QixFQUFFLElBQUk7SUFLL0IsSUFBSSxFQUFFO1FBRUYsVUFBVSxFQUFFLElBQUk7UUFHaEIsTUFBTSxFQUFFLEVBQUU7UUFHVixRQUFRLEVBQUUsRUFBRTtRQUdaLEtBQUssRUFBRSxJQUFJO1FBR1gsR0FBRyxFQUFFLEVBQUU7UUFHUCxFQUFFLEVBQUUsRUFBRTtRQUdOLE1BQU0sRUFBRSxJQUFJO1FBR1osR0FBRyxFQUFFLEVBQUc7UUFHUixPQUFPLEVBQUUsSUFBSTtRQUdiLFdBQVcsRUFBRSxLQUFLO1FBR2xCLEtBQUssRUFBRSxLQUFLO1FBR1osV0FBVyxFQUFFO1lBQ1QsTUFBTSxFQUFFLE1BQU0sRUFBRSxNQUFNO1NBQ3pCO1FBR0QseUJBQXlCLEVBQUUsSUFBSTtRQUcvQixVQUFVLEVBQUUsS0FBSztRQUdqQixhQUFhLEVBQUUsS0FBSztRQUdwQixZQUFZLEVBQUUsTUFBTTtRQUdwQixpQkFBaUIsRUFBRSxLQUFLO1FBR3hCLFlBQVksRUFBRSxNQUFNO1FBR3BCLGNBQWMsRUFBRSxLQUFLO1FBR3JCLEdBQUcsRUFBRSxFQUFHO1FBR1IsUUFBUSxFQUFFLEVBQUc7UUFHYixVQUFVLEVBQUUsRUFBRztRQUdmLFNBQVMsRUFBRSxFQUFHO1FBR2QsSUFBSSxFQUFFLElBQUk7UUFHVixnQkFBZ0IsRUFBRSxLQUFLO1FBR3ZCLE1BQU0sRUFBRSxFQUFFO1FBR1YsSUFBSSxFQUFFLEVBQUU7UUFHUixnQkFBZ0IsRUFBRSxDQUFDO1FBR25CLFVBQVUs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LEVBQUUsUUFBUSxDQUFFLENBQUM7U0FDckQ7SUFFTCxDQUFDO0lBS0QsTUFBTSxFQUFFO0lBRVIsQ0FBQztJQUtELFFBQVEsRUFBRTtJQUVWLENBQUM7SUFLRCxpQkFBaUIsRUFBRTtJQUVuQixDQUFDO0lBS0QsYUFBYSxFQUFFO0lBRWYsQ0FBQztJQUtELGlCQUFpQixFQUFFLFVBQVcsQ0FBQztRQUFaLGlCQWdCbEI7UUFmUyxJQUFBLGNBQStELEVBQTdELHdCQUFTLEVBQUUsb0JBQU8sRUFBRSxrQkFBTSxFQUFFLDBCQUFpQyxDQUFDO1FBRXRFLElBQUksQ0FBQyxXQUFXLEVBQUcsQ0FBQztRQUNwQixVQUFVLENBQUM7WUFDUCxJQUFNLFlBQVksR0FBSSxLQUFZLENBQUMsZUFBZSxDQUFDLGlCQUFpQixDQUFDLENBQUM7WUFDdEUsWUFBWSxDQUFDLE1BQU0sRUFBRyxDQUFDO1FBQzNCLENBQUMsRUFBRSxHQUFHLENBQUUsQ0FBQztRQUVULE9BQU87WUFDSCxRQUFRLEVBQUUsVUFBVSxJQUFJLEtBQUcsT0FBTyxDQUFDLEdBQUcsQ0FBRSxDQUFDLENBQUk7WUFDN0MsSUFBSSxFQUFFLGtDQUFnQyxPQUFPLENBQUMsR0FBRyxjQUFTLE1BQVE7WUFDbEUsS0FBSyxFQUFFLENBQUMsQ0FBQyxPQUFPLElBQUksT0FBTyxDQUFDLE1BQU0sSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO2dCQUM5QyxxR0FBbUIsT0FBTyxDQUFDLEtBQUssU0FBSSxPQUFPLENBQUMsT0FBUyxDQUFDLENBQUM7Z0JBQ3ZELHVCQUFNLE9BQU8sQ0FBQyxPQUFPLDJCQUFPLE9BQU8sQ0FBQyxLQUFPO1NBQ2xELENBQUE7SUFDTCxDQUFDO0NBQ0YsQ0FBQyxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiXG5pbXBvcnQgeyBodHRwIH0gZnJvbSAnLi4vLi4vdXRpbC9odHRwLmpzJztcbmltcG9ydCB7IGNvbXB1dGVkIH0gZnJvbSAnLi4vLi4vbGliL3Z1ZWZ5L2luZGV4LmpzJztcbmltcG9ydCB7IGRlbGF5ZXJpbmdHb29kIH0gZnJvbSAnLi4vLi4vdXRpbC9nb29kcy5qcyc7XG5pbXBvcnQgeyBuYXZUbyB9IGZyb20gJy4uLy4uL3V0aWwvcm91dGUuanMnO1xuXG5jb25zdCBhcHAgPSBnZXRBcHA8YW55PiggKTtcblxuLy8g5omT5byA5ou85Zui5o+Q56S655qEa2V5XG5jb25zdCBzdG9yYWdlS2V5ID0gJ29wZW5lZC1waW4taW4tZ29vZCc7XG5cblBhZ2Uoe1xuXG4gICAgLy8g5Yqo55S7XG4gICAgYW5pbWF0aW9uTWlkZGxlSGVhZGVySXRlbTogbnVsbCxcblxuICAgIC8qKlxuICAgICAqIOmhtemdoueahOWIneWni+aVsOaNrlxuICAgICAqL1xuICAgIGRhdGE6IHtcbiAgICAgICAgLy8g5piv5ZCm5pyJ55So5oi35o6I5p2DXG4gICAgICAgIGlzVXNlckF1dGg6IHRydWUsXG5cbiAgICAgICAgLy8gaXBcbiAgICAgICAgaXBOYW1lOiAnJyxcblxuICAgICAgICAvLyBpcCBcbiAgICAgICAgaXBBdmF0YXI6ICcnLFxuXG4gICAgICAgIC8vIOaYr+WQpuS4uuaWsOWuolxuICAgICAgICBpc05ldzogdHJ1ZSxcblxuICAgICAgICAvLyDooYznqItcbiAgICAgICAgdGlkOiAnJyxcblxuICAgICAgICAvLyDllYblk4FpZFxuICAgICAgICBpZDogJycsXG5cbiAgICAgICAgLy8g5ZWG5ZOB6K+m5oOFXG4gICAgICAgIGRldGFpbDogbnVsbCxcbiAgICAgICAgXG4gICAgICAgIC8vIOaVsOaNruWtl+WFuFxuICAgICAgICBkaWM6IHsgfSxcbiAgICAgICAgXG4gICAgICAgIC8vIOWKoOi9veeKtuaAgVxuICAgICAgICBsb2FkaW5nOiB0cnVlLFxuXG4gICAgICAgIC8vIOaYr+WQpuWIneWni+WMlui/h+KAnOWWnOasouKAnVxuICAgICAgICBoYXNJbml0TGlrZTogZmFsc2UsXG5cbiAgICAgICAgLy8g5piv5ZCm4oCc5Zac5qyi4oCdXG4gICAgICAgIGxpa2VkOiBmYWxzZSxcblxuICAgICAgICAvLyDmloflrZfkv53or4Hmj5DnpLpcbiAgICAgICAgcHJvbWlzZVRpcHM6IFtcbiAgICAgICAgICAgICfmraPlk4Hkv53or4EnLCAn5Lu35qC85LyY5Yq/JywgJ+ecn+S6uui3keiFvydcbiAgICAgICAgXSxcblxuICAgICAgICAvLyDliqjnlLtcbiAgICAgICAgYW5pbWF0aW9uTWlkZGxlSGVhZGVySXRlbTogbnVsbCxcblxuICAgICAgICAvLyDlsZXnpLrnrqHnkIblhaXlj6NcbiAgICAgICAgc2hvd0FkbUJ0bjogZmFsc2UsXG5cbiAgICAgICAgLy8g5q2j5Zyo5bGV56S65rW35oqlXG4gICAgICAgIHNob3dpbmdQb3N0ZXI6IGZhbHNlLFxuXG4gICAgICAgIC8vIOWxleekuuaLvOWboueOqeazleeahOW8ueahhlxuICAgICAgICBzaG93UGxheVRpcHM6ICdoaWRlJyxcblxuICAgICAgICAvLyDlsZXnpLrliIbkuqvotZrpkrFcbiAgICAgICAgc2hvd1NoYXJlR2V0TW9uZXk6IGZhbHNlLFxuXG4gICAgICAgIC8vIOWxleekuuaLvOWbouWVhuWTgeWIl+ihqFxuICAgICAgICBzaG93UGluR29vZHM6ICdoaWRlJyxcblxuICAgICAgICAvLyDliIbkuqtUaXBzMlxuICAgICAgICBzaG93U2hhcmVUaXBzMjogZmFsc2UsXG5cbiAgICAgICAgLy8g5ou85Zui5YiX6KGoXG4gICAgICAgIHBpbjogWyBdLFxuXG4gICAgICAgIC8vIOacrOihjOeoi+eahOi0reeJqea4heWNleWIl+ihqFxuICAgICAgICBzaG9wcGluZzogWyBdLFxuXG4gICAgICAgIC8vIOS4gOWPo+S7t+a0u+WKqOWIl+ihqFxuICAgICAgICBhY3Rpdml0aWVzOiBbIF0sXG5cbiAgICAgICAgLy8g5pys6Laf6IO95aSf5ou85Zui55qEc2t1XG4gICAgICAgIGNhblBpblNrdTogWyBdLFxuXG4gICAgICAgIC8vIOW9k+WJjeeahOihjOeoi1xuICAgICAgICB0cmlwOiBudWxsLFxuXG4gICAgICAgIC8vIOW9k+WJjeaYr+WQpuW8gOWQr+S6huenr+WIhuaOqOW5v1xuICAgICAgICBjYW5JbnRlZ3JheVNoYXJlOiBmYWxzZSxcblxuICAgICAgICAvLyDlvZPliY3otKblj7fnmoRvcGVuaWRcbiAgICAgICAgb3BlbmlkOiAnJyxcblxuICAgICAgICAvLyDliIbkuqvkurrnmoRvcGVuaWRcbiAgICAgICAgZnJvbTogJycsXG5cbiAgICAgICAgLy8g56ev5YiG5o6o5bm/6I6354K55q+U5L6LXG4gICAgICAgIHB1c2hJbnRlZ3JhbFJhdGU6IDAsXG5cbiAgICAgICAgLy8g5piv5ZCm5bGV5byAc2t1XG4gICAgICAgIG9wZW5pbmdTa3U6IGZhbHNlLFxuXG4gICAgICAgIC8vIOiuv+mXruiusOW9lVxuICAgICAgICB2aXNpdG9yczogWyBdLFxuXG4gICAgICAgIC8vIOWIhuS6q+S6uuS/oeaBr1xuICAgICAgICBzaGFyZUZyb21Vc2VyOiB7IH0sXG5cbiAgICAgICAgLy8g5YiG5Lqr5bCB6Z2iXG4gICAgICAgIHNoYXJlQ292ZXI6ICcnLFxuXG4gICAgICAgIC8vIOWwgemdouaPkOekulxuICAgICAgICBjb3ZlclRleHQ6IFwiMjPkurrnnIvov4dcIlxuICAgIH0sXG5cbiAgICAvKiog6K6+572uY29tcHV0ZWQgKi9cbiAgICBydW5Db21wdXRlZCggKSB7XG4gICAgICAgIGNvbXB1dGVkKCB0aGlzLCB7XG5cbiAgICAgICAgICAgIC8vIOiuoeeul+S7t+agvFxuICAgICAgICAgICAgcHJpY2U6IGZ1bmN0aW9uKCApIHtcbiAgICAgICAgICAgICAgICBjb25zdCB7IGRldGFpbCB9ID0gdGhpcy5kYXRhO1xuICAgICAgICAgICAgICAgIGNvbnN0IHJlc3VsdCA9IGRlbGF5ZXJpbmdHb29kKCBkZXRhaWwgKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVzdWx0ID8gcmVzdWx0LnByaWNlJCA6ICcnO1xuICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAgLy8g5ZWG5ZOB6K+m5oOFIC0g5YiG6KGM5pi+56S6XG4gICAgICAgICAgICBkZXRhaWxJbnRybzogZnVuY3Rpb24oICkge1xuICAgICAgICAgICAgICAgIGNvbnN0IHsgZGV0YWlsIH0gPSB0aGlzLmRhdGE7XG4gICAgICAgICAgICAgICAgaWYgKCAhZGV0YWlsIHx8ICggISFkZXRhaWwgJiYgIWRldGFpbC5kZXRhaWwgKSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gWyBdO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBkZXRhaWwuZGV0YWlsLnNwbGl0KCdcXG4nKS5maWx0ZXIoIHggPT4gISF4ICk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAgLy8g5Lu35qC8IO+9niDlm6LotK3ku7fnmoTlt67ku7dcbiAgICAgICAgICAgIHByaWNlR2FwOiBmdW5jdGlvbiggKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgeyBkZXRhaWwgfSA9IHRoaXMuZGF0YTtcbiAgICAgICAgICAgICAgICBpZiAoICFkZXRhaWwgKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAnJ1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHJlc3VsdCA9IGRlbGF5ZXJpbmdHb29kKCBkZXRhaWwgKTtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgZ2FwID0gcmVzdWx0ID8gU3RyaW5nKCByZXN1bHQuZ29vZFBpbnMuZWFjaFByaWNlUm91bmQgKS5yZXBsYWNlKC9cXC4wMC9nLCAnJykgOiAnJztcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgbWV0YSA9IGdhcCAhPT0gJzAnICYmICEhZ2FwID8gZ2FwIDogJyc7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBtZXRhO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgIC8vIOmprOS4iuWPr+S7peaLvOWboueahOS4quaVsFxuICAgICAgICAgICAgcGluQ291bnQkOiBmdW5jdGlvbiggKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgeyBpZCwgZGV0YWlsIH0gPSB0aGlzLmRhdGE7XG4gICAgICAgICAgICAgICAgY29uc3QgZ29vZFNob3BwaW5nID0gdGhpcy5kYXRhLnNob3BwaW5nLmZpbHRlciggeCA9PiB4LnBpZCA9PT0gaWQgKTtcbiAgICAgICAgICAgICAgICBpZiAoICFkZXRhaWwgKSB7IFxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gMDtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBjb25zdCB7IHN0YW5kYXJkcywgZ3JvdXBQcmljZSB9ID0gZGV0YWlsO1xuXG4gICAgICAgICAgICAgICAgaWYgKCAhIXN0YW5kYXJkcyAmJiBzdGFuZGFyZHMubGVuZ3RoID4gMCApIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHN0YW5kYXJkc1xuICAgICAgICAgICAgICAgICAgICAgICAgLmZpbHRlciggeCA9PiAhIWdvb2RTaG9wcGluZy5maW5kKCBzID0+IHMuc2lkID09PSB4Ll9pZCAmJiBzLnBpZCA9PT0geC5waWQgKSlcbiAgICAgICAgICAgICAgICAgICAgICAgIC5sZW5ndGg7XG5cbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKCAhIWdyb3VwUHJpY2UgKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHsgX2lkIH0gPSBkZXRhaWw7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAhIWdvb2RTaG9wcGluZy5maW5kKCBzID0+IHMucGlkID09PSBfaWQgKSA/IDEgOiAwXG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgcmV0dXJuIDA7XG4gICAgICAgICAgICB9LFxuXG4gICAgICAgICAgICAvLyDmi7zlm6LliJfooahcbiAgICAgICAgICAgIHBpbiQ6IGZ1bmN0aW9uKCApIHtcbiAgICAgICAgICAgICAgICBsZXQgbWV0YTogYW55ID0gWyBdO1xuICAgICAgICAgICAgICAgIGNvbnN0IHsgZGV0YWlsLCBzaG9wcGluZywgYWN0aXZpdGllcyB9ID0gdGhpcy5kYXRhO1xuXG4gICAgICAgICAgICAgICAgaWYgKCAhZGV0YWlsICkgeyBcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFsgXTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBjb25zdCB7IHN0YW5kYXJkcywgZ3JvdXBQcmljZSB9ID0gZGV0YWlsO1xuXG4gICAgICAgICAgICAgICAgaWYgKCBzdGFuZGFyZHMubGVuZ3RoID4gMCApIHtcbiAgICAgICAgICAgICAgICAgICAgbWV0YSA9IHN0YW5kYXJkc1xuICAgICAgICAgICAgICAgICAgICAgICAgLmZpbHRlciggeCA9PiAhIXguZ3JvdXBQcmljZSApXG4gICAgICAgICAgICAgICAgICAgICAgICAubWFwKCB4ID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gT2JqZWN0LmFzc2lnbih7IH0sIHgsIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2lkOiB4Ll9pZCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FuUGluOiAhIXNob3BwaW5nLmZpbmQoIHMgPT4gcy5zaWQgPT09IHguX2lkICYmIHMucGlkID09PSB4LnBpZCApXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmICggISFncm91cFByaWNlICkge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCB7IHByaWNlLCB0aXRsZSwgaW1nLCBfaWQgfSA9IGRldGFpbDtcbiAgICAgICAgICAgICAgICAgICAgbWV0YSA9IFt7XG4gICAgICAgICAgICAgICAgICAgICAgICBwcmljZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHBpZDogX2lkLFxuICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogdGl0bGUsXG4gICAgICAgICAgICAgICAgICAgICAgICBncm91cFByaWNlLFxuICAgICAgICAgICAgICAgICAgICAgICAgc2lkOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgICAgICAgICBpbWc6IGltZ1sgMCBdLFxuICAgICAgICAgICAgICAgICAgICAgICAgY2FuUGluOiAhIXNob3BwaW5nLmZpbmQoIHMgPT4gcy5waWQgPT09IF9pZCApXG4gICAgICAgICAgICAgICAgICAgIH1dO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIC8vIOagueaNrua0u+WKqO+8jOabtOaUueOAgeaWsOWinuaLvOWboumhueebrlxuICAgICAgICAgICAgICAgIGFjdGl2aXRpZXMubWFwKCBhYyA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGlmICggIWFjLmFjX2dyb3VwUHJpY2UgKSB7IHJldHVybjsgfVxuICAgICAgICAgICAgICAgICAgICBjb25zdCBwaW5UYXJnZXQgPSBtZXRhLmZpbmQoIHggPT4geC5waWQgPT09IGFjLnBpZCAmJiB4LnNpZCA9PT0gYWMuc2lkICk7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHBpblRhcmdldEluZGV4ID0gbWV0YS5maW5kSW5kZXgoIHggPT4geC5waWQgPT09IGFjLnBpZCAmJiB4LnNpZCA9PT0gYWMuc2lkICk7XG5cbiAgICAgICAgICAgICAgICAgICAgLy8g5pu/5o2iXG4gICAgICAgICAgICAgICAgICAgIGlmICggcGluVGFyZ2V0SW5kZXggIT09IC0xICkge1xuICAgICAgICAgICAgICAgICAgICAgICAgbWV0YS5zcGxpY2UoIHBpblRhcmdldEluZGV4LCAxLCBPYmplY3QuYXNzaWduKHsgfSwgcGluVGFyZ2V0LCB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJpY2U6IGFjLmFjX3ByaWNlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGdyb3VwUHJpY2U6IGFjLmFjX2dyb3VwUHJpY2VcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pKTtcblxuICAgICAgICAgICAgICAgICAgICAvLyDmlrDlop5cbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG1ldGEucHVzaCh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2lkOiBhYy5zaWQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcGlkOiBhYy5waWQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaW1nOiBhYy5pbWcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogYWMudGl0bGUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FuUGluOiAhIXNob3BwaW5nLmZpbmQoIHMgPT4gcy5zaWQgPT09IGFjLnNpZCAmJiBzLnBpZCA9PT0gYWMucGlkICksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJpY2U6IGFjLmFjX3ByaWNlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGdyb3VwUHJpY2U6IGFjLmFjX2dyb3VwUHJpY2UgXG4gICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICBjb25zdCBtZXRhMiA9IG1ldGEubWFwKCB4ID0+IE9iamVjdC5hc3NpZ24oeyB9LCB4LCB7XG4gICAgICAgICAgICAgICAgICAgIGRlbHRhOiBOdW1iZXIoIHgucHJpY2UgLSB4Lmdyb3VwUHJpY2UgKS50b0ZpeGVkKCAwIClcbiAgICAgICAgICAgICAgICB9KSk7XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gbWV0YTI7XG4gICAgICAgICAgICB9LFxuXG4gICAgICAgICAgICAvLyDnp6/liIbljLrpl7RcbiAgICAgICAgICAgIGludGVncmFsJDogZnVuY3Rpb24oICkge1xuICAgICAgICAgICAgICAgIGNvbnN0IHsgZGV0YWlsLCBwdXNoSW50ZWdyYWxSYXRlIH0gPSB0aGlzLmRhdGE7XG4gICAgICAgICAgICAgICAgaWYgKCAhZGV0YWlsICkgeyBcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuICcnO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBjb25zdCByZXN1bHQgPSBkZWxheWVyaW5nR29vZCggZGV0YWlsLCBwdXNoSW50ZWdyYWxSYXRlICk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlc3VsdC5pbnRlZ3JhbCQ7XG4gICAgICAgICAgICB9LFxuXG4gICAgICAgICAgICAvLyDor6bmg4VcbiAgICAgICAgICAgIGRldGFpbCQ6IGZ1bmN0aW9uKCApIHtcbiAgICAgICAgICAgICAgICBjb25zdCB7IGRldGFpbCB9ID0gdGhpcy5kYXRhO1xuICAgICAgICAgICAgICAgIGNvbnN0IHIgPSBkZWxheWVyaW5nR29vZCggZGV0YWlsICk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHI7XG4gICAgICAgICAgICB9LFxuXG4gICAgICAgICAgICAvLyDmraTotKblj7fvvIzmmK/lkKbmnInljZVcbiAgICAgICAgICAgIGhhc09yZGVyJCggKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgeyBvcGVuaWQsIHRyaXBTaG9wcGluZ2xpc3QgfSA9IHRoaXMuZGF0YTtcbiAgICAgICAgICAgICAgICBjb25zdCByID0gKHRyaXBTaG9wcGluZ2xpc3QgfHwgWyBdKVxuICAgICAgICAgICAgICAgICAgICAuZmlsdGVyKCBzbCA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCB7IHVpZHMgfSA9IHNsO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHVpZHMuaW5jbHVkZXMoIG9wZW5pZCApO1xuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIGNvbnN0IHJlc3VsdCA9IEFycmF5LmlzQXJyYXkoIHRyaXBTaG9wcGluZ2xpc3QgKSAmJiB0cmlwU2hvcHBpbmdsaXN0Lmxlbmd0aCA+IDBcbiAgICAgICAgICAgICAgICAgICAgPyByLmxlbmd0aCA+IDAgOiBmYWxzZTtcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAgLy8g5ZWG5ZOB55qE6K6/6Zeu6K6w5b2VXG4gICAgICAgICAgICB2aXNpdG9ycyQoICkge1xuICAgICAgICAgICAgICAgIGNvbnN0IHsgdmlzaXRvcnMsIG9wZW5pZCB9ID0gdGhpcy5kYXRhO1xuICAgICAgICAgICAgICAgIHJldHVybiB2aXNpdG9ycy5maWx0ZXIoIHggPT4geC5vcGVuaWQgIT09IG9wZW5pZCApO1xuICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAgLy8g5ZWG5ZOB55qE6K6/6ZeuICsg56S+5Lqk5bGe5oCn5qih5Z2XXG4gICAgICAgICAgICBzb2NpYWwkKCApIHtcbiAgICAgICAgICAgICAgICBjb25zdCB7IHZpc2l0b3JzLCBvcGVuaWQsIGRldGFpbCB9ID0gdGhpcy5kYXRhO1xuICAgICAgICAgICAgICAgIGNvbnN0IGdvb2QgPSBkZWxheWVyaW5nR29vZCggZGV0YWlsICk7IFxuICAgICAgICAgICAgICAgIGNvbnN0IGdldFJhbmRvbSA9IG4gPT4gTWF0aC5mbG9vciggTWF0aC5yYW5kb20oICkgKiBuICk7XG5cbiAgICAgICAgICAgICAgICBjb25zdCBhbGxUZXh0cyA9IFtcbiAgICAgICAgICAgICAgICAgICAgYOWIkueul+iAtu+8geaciee+pOWPi+aLvOWbouWQl2AsXG4gICAgICAgICAgICAgICAgICAgIGDjgIwke2dvb2QudGFnVGV4dH3jgI3mhJ/op4nkuI3plJlgLFxuICAgICAgICAgICAgICAgICAgICBg55yL6LW35p2l5LiN6ZSZ77yB5oOz5ou85ZuiYCxcbiAgICAgICAgICAgICAgICAgICAgYOaciee+pOWPi+aLvOWbouWQl++8n+aIkeS7rOS4gOi1t+ecgWBcbiAgICAgICAgICAgICAgICBdO1xuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIGNvbnN0IGFsbFZpc2l0b3JzID0gdmlzaXRvcnNcbiAgICAgICAgICAgICAgICAgICAgLmZpbHRlciggeCA9PiB4Lm9wZW5pZCAhPT0gb3BlbmlkIClcbiAgICAgICAgICAgICAgICAgICAgLm1hcCggeCA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCByYW5kb21OdW0gPSBnZXRSYW5kb20oIGFsbFRleHRzLmxlbmd0aCApO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhdmF0YXI6IHguYXZhdGFyVXJsLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRleHQ6IGFsbFRleHRzWyByYW5kb21OdW0gXVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIHJldHVybiBhbGxWaXNpdG9ycztcblxuICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAgLy8g5b2T5YmN5ZWG5ZOB55qE6LSt54mp5riF5Y2VXG4gICAgICAgICAgICBzaG9wcGluZyQoICkge1xuICAgICAgICAgICAgICAgIGNvbnN0IHsgc2hvcHBpbmcsIGlkIH0gPSB0aGlzLmRhdGE7XG5cbiAgICAgICAgICAgICAgICBjb25zdCBnZXRSYW5kb20gPSBuID0+IE1hdGguZmxvb3IoIE1hdGgucmFuZG9tKCApICogbiApO1xuICAgICAgICAgICAgICAgIGNvbnN0IGFsbFRleHRzID0gW1xuICAgICAgICAgICAgICAgICAgICBg6LCi6LCi5ou85Zui55qE576k5Y+LfmAsXG4gICAgICAgICAgICAgICAgICAgIGDotZ7vvIHlj4jnnIHpkrHkuobvvZ5gLFxuICAgICAgICAgICAgICAgICAgICBg6ZSZ6L+H5bCx5LqP5ZWm772eYCxcbiAgICAgICAgICAgICAgICAgICAgYOaLvOWbouWlveWIkueul35gXG4gICAgICAgICAgICAgICAgXTtcblxuICAgICAgICAgICAgICAgIHJldHVybiBzaG9wcGluZ1xuICAgICAgICAgICAgICAgICAgICAuZmlsdGVyKCB4ID0+IHgucGlkID09PSBpZCApXG4gICAgICAgICAgICAgICAgICAgIC5tYXAoIHNsID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHsgdXNlcnMsIGRldGFpbCB9ID0gc2w7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCB7IG5hbWUgfSA9IGRldGFpbDtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLi4uc2wsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbmFtZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmaXJzdFVzZXI6IHVzZXJzWyAwIF0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb3RoZXJVc2VyOiB1c2Vycy5zbGljZSggMSApLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRpcHM6IGFsbFRleHRzWyBnZXRSYW5kb20oIGFsbFRleHRzLmxlbmd0aCApXVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAgLy8g6KGM56iL5Lit55qE5YW25LuW6LSt54mp5riF5Y2VXG4gICAgICAgICAgICBvdGhlclNob3BwaW5nJCggKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgeyBzaG9wcGluZywgaWQgfSA9IHRoaXMuZGF0YTtcblxuICAgICAgICAgICAgICAgIGNvbnN0IHJlc3VsdCA9IHNob3BwaW5nXG4gICAgICAgICAgICAgICAgICAgIC5maWx0ZXIoIHggPT4geC5waWQgIT09IGlkIClcbiAgICAgICAgICAgICAgICAgICAgLm1hcCggeCA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCB7IHBpZCwgZGV0YWlsLCB1c2VycywgYWRqdXN0UHJpY2UsIGFkanVzdEdyb3VwUHJpY2UgfSA9IHg7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCB7IG5hbWUsIHRpdGxlIH0gPSBkZXRhaWw7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCB0b3RhbERlbHRhID0gdXNlcnMubGVuZ3RoICogTWF0aC5jZWlsKCBhZGp1c3RQcmljZSAtIGFkanVzdEdyb3VwUHJpY2UgKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcGlkLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGltZzogZGV0YWlsLmltZyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0b3BUaXBzOiBgJHt1c2Vycy5sZW5ndGggPiAxID8gdXNlcnMubGVuZ3RoICsgJ+S6uicgOiAnJ33nnIEke3RvdGFsRGVsdGF95YWDYCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBib3R0b21UaXBzOiBgJHt1c2Vycy5sZW5ndGh9576k5Y+L5ou85ZuiYCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhdmF0YXJzOiB1c2Vycy5tYXAoIHggPT4geC5hdmF0YXJVcmwgKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aXRsZTogYCR7bmFtZSA/IG5hbWUgKyAnICcgOiAnJ30ke3RpdGxlfWBcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAgLy8g6KGM56iL5Lit77yM5b2T5YmN5Lqn5ZOB5omA5pyJ5Z6L5Y+35Yqg6LW35p2l77yM5pyJ5aSa5bCR5Lq65Zyo5ou85ZuiXG4gICAgICAgICAgICBhbGxQaW5QbGF5ZXJzJCggKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgeyBpZCwgc2hvcHBpbmcgfSA9IHRoaXMuZGF0YTtcbiAgICAgICAgICAgICAgICBjb25zdCBnb29kU2hvcHBpbmcgPSBzaG9wcGluZy5maWx0ZXIoIHggPT4geC5waWQgPT09IGlkICk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGdvb2RTaG9wcGluZy5yZWR1Y2UoKCB4LCBzbCApID0+IHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHggKyBzbC51aWRzLmxlbmd0aDtcbiAgICAgICAgICAgICAgICB9LCAwICk7XG4gICAgICAgICAgICB9LFxuXG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIOeOsOWcqOWIsOWHjOaZqDHngrnnmoTlgJLorqHml7ZcbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgY291bnREb3duTmlnaHQkKCApIHtcbiAgICAgICAgICAgICAgICBjb25zdCBub3cgPSBuZXcgRGF0ZSggKTtcbiAgICAgICAgICAgICAgICBjb25zdCB5ID0gbm93LmdldEZ1bGxZZWFyKCApO1xuICAgICAgICAgICAgICAgIGNvbnN0IG0gPSBub3cuZ2V0TW9udGgoICkgKyAxO1xuICAgICAgICAgICAgICAgIGNvbnN0IGQgPSBub3cuZ2V0RGF0ZSggKTtcbiAgICAgICAgICAgICAgICBjb25zdCB0b2RheU9uZSA9IG5ldyBEYXRlKGAke3l9LyR7bX0vJHtkfSAwMTowMDowMGApO1xuICAgICAgICAgICAgICAgIGNvbnN0IHRvbW9ycm93T25lID0gdG9kYXlPbmUuZ2V0VGltZSggKSArIDI0ICogNjAgKiA2MCAqIDEwMDA7XG4gICAgICAgICAgICAgICAgcmV0dXJuICgoIHRvbW9ycm93T25lIC0gRGF0ZS5ub3coICkpIC8gMTAwMCApLnRvRml4ZWQoIDAgKTtcbiAgICAgICAgICAgIH0sXG5cbiAgICAgICAgfSlcbiAgICB9LFxuXG4gICAgLyoqIOebkeWQrOWFqOWxgOeuoeeQhuWRmOadg+mZkCAqL1xuICAgIHdhdGNoUm9sZSggKSB7XG4gICAgICAgIChhcHAgYXMgYW55KS53YXRjaCQoJ3JvbGUnLCAoIHZhbCApID0+IHtcbiAgICAgICAgICAgIHRoaXMuc2V0RGF0YSEoe1xuICAgICAgICAgICAgICAgIHNob3dBZG1CdG46ICggdmFsID09PSAxIClcbiAgICAgICAgICAgIH0pXG4gICAgICAgIH0pO1xuICAgICAgICAoYXBwIGFzIGFueSkud2F0Y2gkKCdpc05ldycsIHZhbCA9PiB7XG4gICAgICAgICAgICB0aGlzLnNldERhdGEhKHtcbiAgICAgICAgICAgICAgICBpc05ldzogdmFsXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgICAgIChhcHAgYXMgYW55KS53YXRjaCQoJ2FwcENvbmZpZycsIHZhbCA9PiB7XG4gICAgICAgICAgICBpZiAoICF2YWwgKSB7IHJldHVybjsgfVxuICAgICAgICAgICAgdGhpcy5zZXREYXRhISh7XG4gICAgICAgICAgICAgICAgaXBOYW1lOiB2YWxbJ2lwLW5hbWUnXSxcbiAgICAgICAgICAgICAgICBpcEF2YXRhcjogdmFsWydpcC1hdmF0YXInXSxcbiAgICAgICAgICAgICAgICBwdXNoSW50ZWdyYWxSYXRlOiAodmFsIHx8IHsgfSlbJ3B1c2gtaW50ZWdyYWwtZ2V0LXJhdGUnXSB8fCAwLFxuICAgICAgICAgICAgICAgIGNhbkludGVncmF5U2hhcmU6ICEhKHZhbCB8fCB7IH0pWydnb29kLWludGVncmFsLXNoYXJlJ10gfHwgZmFsc2VcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgdGhpcy5jcmVhdGVTaGFyZSggKTtcbiAgICAgICAgfSk7XG4gICAgICAgIChhcHAgYXMgYW55KS53YXRjaCQoJ29wZW5pZCcsIHZhbCA9PiB7XG4gICAgICAgICAgICB0aGlzLnNldERhdGEhKHtcbiAgICAgICAgICAgICAgICBvcGVuaWQ6IHZhbFxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB0aGlzLmNyZWF0ZVNoYXJlKCApO1xuICAgICAgICAgICAgdGhpcy5mZXRjaFNoYXJlciggKTtcbiAgICAgICAgfSk7XG4gICAgICAgIGFwcC53YXRjaCQoJ2lzVXNlckF1dGgnLCB2YWwgPT4ge1xuICAgICAgICAgICAgaWYgKCB2YWwgPT09IHVuZGVmaW5lZCApIHsgcmV0dXJuOyB9XG4gICAgICAgICAgICB0aGlzLnNldERhdGEhKHtcbiAgICAgICAgICAgICAgICBpc1VzZXJBdXRoOiB2YWxcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9LFxuXG4gICAgLyoqIOaLieWPluWVhuWTgeivpuaDhSAqL1xuICAgIGZldERldGFpbCggaWQgKSB7XG4gICAgICAgIGNvbnN0IHsgZGV0YWlsLCBmcm9tIH0gPSB0aGlzLmRhdGE7XG4gICAgICAgIGlmICggZGV0YWlsICkgeyByZXR1cm47IH1cbiAgICAgICAgaHR0cCh7XG4gICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgX2lkOiBpZCxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBlcnJNc2c6ICfojrflj5bllYblk4HplJnor6/vvIzor7fph43or5UnLFxuICAgICAgICAgICAgdXJsOiBgZ29vZF9kZXRhaWxgLFxuICAgICAgICAgICAgc3VjY2VzczogcmVzID0+IHtcbiAgICAgICAgICAgICAgaWYgKCByZXMuc3RhdHVzICE9PSAyMDAgKSB7IHJldHVybjsgfVxuXG4gICAgICAgICAgICAgICAgbGV0IHBpbjogYW55ID0gWyBdO1xuICAgICAgICAgICAgICAgIGNvbnN0IHsgc3RhbmRhcmRzLCBncm91cFByaWNlLCBhY3Rpdml0aWVzIH0gPSByZXMuZGF0YTtcblxuICAgICAgICAgICAgICAgIGlmICggc3RhbmRhcmRzLmxlbmd0aCA+IDAgKSB7XG4gICAgICAgICAgICAgICAgICAgIHBpbiA9IHN0YW5kYXJkcy5maWx0ZXIoIHggPT4gISF4Lmdyb3VwUHJpY2UgKTtcblxuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoICEhZ3JvdXBQcmljZSApIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgeyBwcmljZSwgdGl0bGUsIGltZyAgfSA9IHJlcy5kYXRhO1xuICAgICAgICAgICAgICAgICAgICBwaW4gPSBbe1xuICAgICAgICAgICAgICAgICAgICAgICAgcHJpY2UsXG4gICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiB0aXRsZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGdyb3VwUHJpY2UsXG4gICAgICAgICAgICAgICAgICAgICAgICBpbWc6IGltZ1sgMCBdXG4gICAgICAgICAgICAgICAgICAgIH1dO1xuICAgICAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgICAgICBjb25zdCBhY3Rpdml0aWVzJCA9IGFjdGl2aXRpZXMubWFwKCB4ID0+IHtcblxuICAgICAgICAgICAgICAgICAgICBsZXQgaW1nID0gJyc7XG4gICAgICAgICAgICAgICAgICAgIGlmICggISF4LnNpZCApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGltZyA9IHN0YW5kYXJkcy5maW5kKCB5ID0+IHkuX2lkID09PSB4LnNpZCApLmltZ1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgaW1nID0gcmVzLmRhdGEuaW1nWyAwIF07XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gT2JqZWN0LmFzc2lnbih7IH0sIHgsIHsgXG4gICAgICAgICAgICAgICAgICAgICAgICBpbWcsXG4gICAgICAgICAgICAgICAgICAgICAgICBjb3VudGRvd246ICggeC5lbmRUaW1lIC0gbmV3IERhdGUoICkuZ2V0VGltZSggKSkgLyAoIDEwMDAgKVxuICAgICAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgIH0pLmZpbHRlciggeSA9PiB5LmVuZFRpbWUgPiBuZXcgRGF0ZSggKS5nZXRUaW1lKCApKTtcblxuICAgICAgICAgICAgICAgIHRoaXMuc2V0RGF0YSEoe1xuICAgICAgICAgICAgICAgICAgICBwaW4sXG4gICAgICAgICAgICAgICAgICAgIGxvYWRpbmc6IGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICBkZXRhaWw6IHJlcy5kYXRhLFxuICAgICAgICAgICAgICAgICAgICBhY3Rpdml0aWVzOiBhY3Rpdml0aWVzJFxuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgLy8g5by56LW35ou85Zui5qGGXG4gICAgICAgICAgICAgICAgaWYgKCAhIWZyb20gJiYgZGVsYXllcmluZ0dvb2QoIHJlcy5kYXRhICkuaGFzUGluICkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnNldERhdGEhKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNob3dQbGF5VGlwczogJ3Nob3cnXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoICFmcm9tICYmIGRlbGF5ZXJpbmdHb29kKCByZXMuZGF0YSApLmhhc1BpbiApIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jaGVja09wZW5QaW4oICk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9LFxuXG4gICAgLyoqIOaLieWPluihjOeoi+eahOi0reeJqeivt+WNleS/oeaBryAqL1xuICAgIGZldGNoU2hvcHBpbmcoIHBpZCwgdGlkICkge1xuICAgICAgICBpZiAoICFwaWQgfHwgIXRpZCApIHsgcmV0dXJuOyB9XG5cbiAgICAgICAgaHR0cCh7XG4gICAgICAgICAgICB1cmw6ICdzaG9wcGluZy1saXN0X3BpbicsXG4gICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgLy8gcGlkLFxuICAgICAgICAgICAgICAgIHRpZCxcbiAgICAgICAgICAgICAgICBkZXRhaWw6IHRydWUsXG4gICAgICAgICAgICAgICAgc2hvd1VzZXI6IHRydWVcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBzdWNjZXNzOiByZXMgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IHsgc3RhdHVzLCBkYXRhIH0gPSByZXM7XG4gICAgICAgICAgICAgICAgaWYgKCBzdGF0dXMgIT09IDIwMCApIHsgcmV0dXJuOyB9XG4gICAgICAgICAgICAgICAgdGhpcy5zZXREYXRhISh7XG4gICAgICAgICAgICAgICAgICAgIHNob3BwaW5nOiBkYXRhLFxuICAgICAgICAgICAgICAgICAgICBjYW5QaW5Ta3U6IGRhdGEubWFwKCB4ID0+ICh7XG4gICAgICAgICAgICAgICAgICAgICAgICBwaWQ6IHgucGlkLFxuICAgICAgICAgICAgICAgICAgICAgICAgc2lkOiB4LnNpZFxuICAgICAgICAgICAgICAgICAgICB9KSlcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSlcbiAgICB9LFxuXG4gICAgLyoqIOaLieWPluW9k+WJjeWVhuWTgeeahOiuv+mXruiusOW9lSAqL1xuICAgIGZldGNoVmlzaXRSZWNvcmQoIHBpZCwgc3RhcnQsIGJlZm9yZSApIHtcbiAgICAgICAgaWYgKCAhc3RhcnQgfHwgIWJlZm9yZSApIHsgcmV0dXJuOyB9XG4gICAgICAgIGh0dHAoe1xuICAgICAgICAgICAgdXJsOiAnZ29vZF9nb29kLXZpc2l0b3JzJyxcbiAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICBwaWQsXG4gICAgICAgICAgICAgICAgc3RhcnQsIFxuICAgICAgICAgICAgICAgIGJlZm9yZVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHN1Y2Nlc3M6IHJlcyA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3QgeyBzdGF0dXMsIGRhdGEgfSA9IHJlcztcbiAgICAgICAgICAgICAgICBpZiAoIHN0YXR1cyAhPT0gMjAwICkgeyByZXR1cm47IH1cbiAgICAgICAgICAgICAgICB0aGlzLnNldERhdGEhKHtcbiAgICAgICAgICAgICAgICAgICAgdmlzaXRvcnM6IGRhdGFcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfSxcblxuICAgIC8qKiDmi4nlj5bkuKTkuKrmnIDmlrDooYznqIsgKi9cbiAgICBmZXRjaExhc3QoICkge1xuICAgICAgICBjb25zdCB7IGlkIH0gPSB0aGlzLmRhdGE7XG4gICAgICAgIGh0dHAoe1xuICAgICAgICAgICAgZGF0YTogeyB9LFxuICAgICAgICAgICAgdXJsOiBgdHJpcF9lbnRlcmAsXG4gICAgICAgICAgICBzdWNjZXNzOiByZXMgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IHsgc3RhdHVzLCBkYXRhIH0gPSByZXM7XG4gICAgICAgICAgICAgICAgaWYgKCBzdGF0dXMgIT09IDIwMCApIHsgcmV0dXJuOyB9XG4gICAgICAgICAgICAgICAgY29uc3QgdHJpcCA9IGRhdGFbIDAgXTtcbiAgICAgICAgICAgICAgICBpZiAoICEhdHJpcCApIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgeyBfaWQsIHN0YXJ0X2RhdGUsIGVuZF9kYXRlIH0gPSB0cmlwO1xuICAgICAgICAgICAgICAgICAgICBjb25zdCB0aWQgPSBfaWRcblxuICAgICAgICAgICAgICAgICAgICB0aGlzLmZldGNoU2hvcHBpbmcoIGlkLCB0aWQgKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5mZXRjaFZpc2l0UmVjb3JkKCBpZCwgc3RhcnRfZGF0ZSwgZW5kX2RhdGUgKTtcblxuICAgICAgICAgICAgICAgICAgICB0aGlzLnNldERhdGEhKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRpZCxcbiAgICAgICAgICAgICAgICAgICAgICAgIHRyaXBcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9KVxuICAgIH0sXG5cbiAgICAvKiog6I635Y+W5LiK5Liq5YiG5Lqr5Lq655qE5aS05YOPICovXG4gICAgZmV0Y2hTaGFyZXIoICkge1xuICAgICAgICBjb25zdCB7IG9wZW5pZCwgZnJvbSB9ID0gdGhpcy5kYXRhO1xuICAgICAgICBpZiAoICFmcm9tIHx8ICFvcGVuaWQgfHwgZnJvbSA9PT0gb3BlbmlkICkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGh0dHAoe1xuICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgIG9wZW5pZDogZnJvbSBcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB1cmw6ICdjb21tb25fZ2V0LXVzZXItaW5mbycsXG4gICAgICAgICAgICBzdWNjZXNzOiByZXMgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IHsgc3RhdHVzLCBkYXRhIH0gPSByZXM7XG4gICAgICAgICAgICAgICAgaWYgKCBzdGF0dXMgIT09IDIwMCB8fCAhZGF0YSApIHsgcmV0dXJuOyB9XG4gICAgICAgICAgICAgICAgdGhpcy5zZXREYXRhISh7XG4gICAgICAgICAgICAgICAgICAgIHNoYXJlRnJvbVVzZXI6IGRhdGFcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSlcbiAgICB9LFxuXG4gICAgaW5pdENvdmVyVGV4dCggKSB7XG4gICAgICAgIGNvbnN0IG51bSA9IDE4ICsgTWF0aC5jZWlsKCBNYXRoLnJhbmRvbSggKSAqIDIwKTtcbiAgICAgICAgdGhpcy5zZXREYXRhISh7XG4gICAgICAgICAgICBjb3ZlclRleHQ6IGAke251bX3kurrnnIvov4dgXG4gICAgICAgIH0pO1xuICAgIH0sXG5cbiAgICAvKiog5Yib5bu65YiG5Lqr6K6w5b2VICovXG4gICAgY3JlYXRlU2hhcmUoICkge1xuICAgICAgICBjb25zdCB7IGlkLCBjYW5JbnRlZ3JheVNoYXJlLCBmcm9tLCBvcGVuaWQgfSA9IHRoaXMuZGF0YTtcbiAgICAgICAgaWYgKCAhaWQgfHwgIWNhbkludGVncmF5U2hhcmUgfHwgIWZyb20gfHwgIW9wZW5pZCApIHsgcmV0dXJuOyB9XG4gICAgICAgIGh0dHAoe1xuICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgIGZyb20sXG4gICAgICAgICAgICAgICAgcGlkOiBpZCxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB1cmw6ICdjb21tb25fY3JlYXRlLXNoYXJlJ1xuICAgICAgICB9KTtcbiAgICB9LFxuXG4gICAgLy8g5bGV5byA5ou85Zui546p5rOV5o+Q56S6XG4gICAgdG9nZ2xlUGFseVRpcHMoIGU/ICkge1xuICAgICAgICBjb25zdCB7IHNob3dQbGF5VGlwcyB9ID0gdGhpcy5kYXRhO1xuICAgICAgICB0aGlzLnNldERhdGEhKHtcbiAgICAgICAgICAgIHNob3dQbGF5VGlwczogc2hvd1BsYXlUaXBzID09PSAnc2hvdycgPyAnaGlkZScgOiAnc2hvdydcbiAgICAgICAgfSk7XG4gICAgfSxcblxuICAgIC8vIOiOt+WPluaOiOadg+OAgeWFs+mXreaLvOWboueOqeazleaPkOekulxuICAgIGdldFVzZXJBdXRoKCApIHtcbiAgICAgICAgYXBwLmdldFd4VXNlckluZm8oKCApID0+IHtcbiAgICAgICAgICAgIHRoaXMuc2V0RGF0YSEoe1xuICAgICAgICAgICAgICAgIHNob3dQbGF5VGlwczogJ2hpZGUnXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfSxcblxuICAgIC8vIOWxleekuuaOqOW5v+enr+WIhuinhOWImVxuICAgIHRvZ2dsZVNoYXJlR2V0TW9uZXkoICkge1xuICAgICAgICBjb25zdCB7IHNob3dTaGFyZUdldE1vbmV5IH0gPSB0aGlzLmRhdGE7XG4gICAgICAgIHRoaXMuc2V0RGF0YSEoe1xuICAgICAgICAgICAgc2hvd1NoYXJlR2V0TW9uZXk6ICFzaG93U2hhcmVHZXRNb25leVxuICAgICAgICB9KTtcbiAgICAgICAgaWYgKCAhc2hvd1NoYXJlR2V0TW9uZXkgKSB7XG4gICAgICAgICAgICB0aGlzLm9uU3Vic2NyaWJlKCApO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIC8vIOWxleekuuaLvOWbouWIl+ihqFxuICAgIHRvZ2dsZVBpbkdvb2RzKCApIHtcbiAgICAgICAgY29uc3QgeyBzaG93UGluR29vZHMgfSA9IHRoaXMuZGF0YTtcbiAgICAgICAgdGhpcy5zZXREYXRhISh7XG4gICAgICAgICAgICBzaG93UGluR29vZHM6IHNob3dQaW5Hb29kcyA9PT0gJ2hpZGUnID8gJ3Nob3cnIDogJ2hpZGUnXG4gICAgICAgIH0pO1xuICAgICAgICBpZiAoIHNob3dQaW5Hb29kcyA9PT0gJ2hpZGUnICkge1xuICAgICAgICAgICAgdGhpcy5vblN1YnNjcmliZSggKTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBvblN1YnNjcmliZSggKSB7XG4gICAgICAgIGFwcC5nZXRTdWJzY3JpYmUoJ2J1eVBpbixob25nYmFvLHRyaXAnKTtcbiAgICB9LFxuXG4gICAgLy8g6L+b5YWl5ZWG5ZOB566h55CGXG4gICAgZ29NYW5hZ2VyKCApIHtcbiAgICAgICAgbmF2VG8oYC9wYWdlcy9tYW5hZ2VyLWdvb2RzLWRldGFpbC9pbmRleD9pZD0ke3RoaXMuZGF0YS5pZH1gKTtcbiAgICB9LFxuXG4gICAgLy8g6L+b5YWl5ou85Zui5bm/5Zy6XG4gICAgZ29Hcm91bmQoICkge1xuICAgICAgICBuYXZUbygnL3BhZ2VzL2dyb3VuZC1waW4vaW5kZXgnKVxuICAgIH0sXG4gICAgXG4gICAgLy8g6L+b5YWl5ZWG5ZOB6K+m5oOFXG4gICAgZ29Hb29kRGV0YWlsKHsgY3VycmVudFRhcmdldCB9KSB7XG4gICAgICAgIGNvbnN0IHsgcGlkIH0gPSBjdXJyZW50VGFyZ2V0LmRhdGFzZXQ7XG4gICAgICAgIG5hdlRvKGAvcGFnZXMvZ29vZHMtZGV0YWlsL2luZGV4P2lkPSR7cGlkfWApXG4gICAgfSxcblxuICAgIC8qKiDpooTop4jlm77niYcgKi9cbiAgICBwcmV2aWV3SW1nKHsgY3VycmVudFRhcmdldCB9KSB7XG4gICAgICAgIGNvbnN0IHsgaW1nIH0gPSBjdXJyZW50VGFyZ2V0LmRhdGFzZXQ7XG4gICAgICAgIHRoaXMuZGF0YS5kZXRhaWwgJiYgd3gucHJldmlld0ltYWdlKHtcbiAgICAgICAgICAgIGN1cnJlbnQ6IGltZyxcbiAgICAgICAgICAgIHVybHM6IFsgLi4uKHRoaXMuZGF0YSBhcyBhbnkpLmRldGFpbC5pbWcgXSxcbiAgICAgICAgfSk7XG4gICAgfSxcblxuICAgIC8qKiDpooTop4jljZXlvKDlm77niYfvvJrmi7zlm6Llm77niYfjgIHkuIDlj6Pku7fvvIjpmZDml7bmiqLvvIkgKi9cbiAgICBwcmV2aWV3U2luZ2xlSW1nKHsgY3VycmVudFRhcmdldCB9KSB7XG5cbiAgICAgICAgY29uc3QgaW1nID0gY3VycmVudFRhcmdldC5kYXRhc2V0LmRhdGEgP1xuICAgICAgICAgICAgY3VycmVudFRhcmdldC5kYXRhc2V0LmRhdGEuaW1nOlxuICAgICAgICAgICAgY3VycmVudFRhcmdldC5kYXRhc2V0LmltZztcblxuICAgICAgICB0aGlzLmRhdGEuZGV0YWlsICYmIHd4LnByZXZpZXdJbWFnZSh7XG4gICAgICAgICAgICBjdXJyZW50OiBpbWcsXG4gICAgICAgICAgICB1cmxzOiBbIGltZyBdLFxuICAgICAgICB9KTtcbiAgICB9LFxuXG4gICAgLyoqIOajgOafpeaYr+WQpuacieS4u+WKqOW8ueW8gOi/h+aLvOWboueOqeazlSAqL1xuICAgIGNoZWNrT3BlblBpbiggKSB7XG4gICAgICAgIGNvbnN0IHsgZGV0YWlsIH0gPSB0aGlzLmRhdGE7XG4gICAgICAgIGlmICggIWRldGFpbCApIHsgcmV0dXJuIH1cbiAgICAgICAgY29uc3QgcmVzdWx0ID0gZGVsYXllcmluZ0dvb2QoIGRldGFpbCApO1xuICAgICAgICBpZiAoIHJlc3VsdCApIHtcbiAgICAgICAgICAgIGNvbnN0IG9uZURheSA9IDI0ICogNjAgKiA2MCAqIDEwMDA7XG4gICAgICAgICAgICBjb25zdCBwcmljZUdhcCA9IFN0cmluZyggcmVzdWx0Lmdvb2RQaW5zLmVhY2hQcmljZVJvdW5kICkucmVwbGFjZSgvXFwuMDAvZywgJycpO1xuICAgICAgICAgICAgY29uc3Qgb3BlblJlY29yZCA9IHd4LmdldFN0b3JhZ2VTeW5jKCBzdG9yYWdlS2V5ICk7XG5cbiAgICAgICAgICAgIGlmICggISFwcmljZUdhcCAmJiBEYXRlLm5vdyggKSAtIE51bWJlciggb3BlblJlY29yZCApID49IG9uZURheSApIHtcbiAgICAgICAgICAgICAgICB3eC5zZXRTdG9yYWdlU3luYyggc3RvcmFnZUtleSwgU3RyaW5nKCBEYXRlLm5vdyggKSkpO1xuICAgICAgICAgICAgICAgIHRoaXMudG9nZ2xlUGFseVRpcHMoICk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgLyoqIOiuvue9ruKAnOWWnOasouKAnSAqL1xuICAgIG9uTGlrZSggKSB7XG4gICAgICAgIGNvbnN0IHRoYXQgPSB0aGlzO1xuICAgICAgICBpZiAoICF0aGlzLmRhdGEuaGFzSW5pdExpa2UgKSB7IHJldHVybjsgfVxuICAgICAgICBodHRwKHtcbiAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICBwaWQ6IHRoaXMuZGF0YS5pZFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHVybDogJ2xpa2VfY3JlYXRlJyxcbiAgICAgICAgICAgIHN1Y2Nlc3M6ICAoIHJlczogYW55ICkgPT4ge1xuICAgICAgICAgICAgICAgIGlmICggcmVzLnN0YXR1cyA9PT0gMjAwICkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnNldERhdGEhKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxpa2VkOiAhdGhpcy5kYXRhLmxpa2VkXG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9LFxuXG4gICAgLyoqIOiuvue9ruKAnOWWnOasouKAnSAqL1xuICAgIGNoZWNrTGlrZSggKSB7XG4gICAgICAgIGNvbnN0IHRoYXQgPSB0aGlzO1xuICAgICAgICBodHRwKHtcbiAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICBwaWQ6IHRoaXMuZGF0YS5pZFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHVybDogJ2xpa2VfY2hlY2snLFxuICAgICAgICAgICAgc3VjY2VzczogICggcmVzOiBhbnkgKSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKCByZXMuc3RhdHVzID09PSAyMDAgKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc2V0RGF0YSEoe1xuICAgICAgICAgICAgICAgICAgICAgICAgbGlrZWQ6IHJlcy5kYXRhLFxuICAgICAgICAgICAgICAgICAgICAgICAgaGFzSW5pdExpa2U6IHRydWVcbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH0sXG5cbiAgICAvKiog5rW35oql5byA5YWz55uR5ZCsICovXG4gICAgb25Qb3N0VG9nZ2xlKCBlICkge1xuICAgICAgICBjb25zdCB2YWwgPSBlLmRldGFpbDtcbiAgICAgICAgdGhpcy5zZXREYXRhISh7XG4gICAgICAgICAgICBzaG93aW5nUG9zdGVyOiB2YWxcbiAgICAgICAgfSk7XG4gICAgICAgIHd4LnNldE5hdmlnYXRpb25CYXJUaXRsZSh7XG4gICAgICAgICAgICB0aXRsZTogdmFsID8gJ+WIhuS6q+WVhuWTgScgOiAn5ZWG5ZOB6K+m5oOFJ1xuICAgICAgICB9KTtcbiAgICB9LFxuXG4gICAgLyoqIOa1t+aKpS0t5byAICovXG4gICAgb3BlblBvc3RlciggKSB7XG4gICAgICAgIGNvbnN0IHsgc2hvd2luZ1Bvc3RlciB9ID0gdGhpcy5kYXRhO1xuICAgICAgICBjb25zdCBwb3N0ZXIgPSAodGhpcyBhcyBhbnkpLnNlbGVjdENvbXBvbmVudCgnI3Bvc3RlcicpO1xuICAgICAgICBwb3N0ZXIudG9nZ2xlKCApO1xuICAgICAgICBpZiAoICFzaG93aW5nUG9zdGVyICkge1xuICAgICAgICAgICAgdGhpcy5vblN1YnNjcmliZSggKTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICAvKiog5rW35oqlLS3lhbMgKi9cbiAgICBjbG9zZVBvc3RlciggKSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBjb25zdCBwb3N0ZXIgPSAodGhpcyBhcyBhbnkpLnNlbGVjdENvbXBvbmVudCgnI3Bvc3RlcicpO1xuICAgICAgICAgICAgcG9zdGVyLmNsb3NlKCApO1xuICAgICAgICB9IGNhdGNoICggZSApIHsgfVxuICAgIH0sXG5cbiAgICAvKiogc2t16YCJ5oup5by55qGGICovXG4gICAgb25Ta3VUb2dnbGUoIGUgKSB7XG4gICAgICAgIHRoaXMuc2V0RGF0YSEoe1xuICAgICAgICAgICAgb3BlbmluZ1NrdTogZS5kZXRhaWxcbiAgICAgICAgfSk7XG4gICAgfSxcblxuICAgIC8qKiBza3Xmn5Dpg6jliIbngrnlh7sgKi9cbiAgICBvblNrdVRhcCggZSApIHtcbiAgICAgICAgY29uc3QgdHlwZSA9IGUuZGV0YWlsO1xuICAgICAgICBpZiAoIHR5cGUgPT09ICdtb25leVF1ZXN0aW9uJyApIHtcbiAgICAgICAgICAgIHRoaXMudG9nZ2xlU2hhcmVHZXRNb25leSggKTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICAvKiog5bGV5byA44CB5YWz6Zetc2t15qGGICovXG4gICAgb25Ub2dnbGVTa3UoICkge1xuICAgICAgICBjb25zdCB7IG9wZW5pbmdTa3UgfSA9IHRoaXMuZGF0YTtcbiAgICAgICAgY29uc3Qgc2t1ID0gKHRoaXMgYXMgYW55KS5zZWxlY3RDb21wb25lbnQoJyNza3UnKTtcbiAgICAgICAgc2t1LnRvZ2dsZVNrdSggKTtcbiAgICAgICAgaWYgKCAhb3BlbmluZ1NrdSApIHtcbiAgICAgICAgICAgIHRoaXMub25TdWJzY3JpYmUoICk7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgLyoqIOi9rOWPkeWwgemdoiAqL1xuICAgIG9uQ292ZXJEb25lKCBlICkge1xuICAgICAgICB0aGlzLnNldERhdGEhKHtcbiAgICAgICAgICAgIHNoYXJlQ292ZXI6IGUuZGV0YWlsXG4gICAgICAgIH0pO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiDnlJ/lkb3lkajmnJ/lh73mlbAtLeebkeWQrOmhtemdouWKoOi9vVxuICAgICAqIHtcbiAgICAgKiAgICBpZCB8fCBzY2VuZSAvLyDllYblk4FpZFxuICAgICAqICAgIHRpZCAvLyDooYznqItpZFxuICAgICAqICAgIGZyb20gLy8g5YiG5Lqr5Lq655qEaWRcbiAgICAgKiB9XG4gICAgICovXG4gICAgb25Mb2FkOiBmdW5jdGlvbiAob3B0aW9ucykge1xuXG4gICAgICAgIGNvbnN0IHNjZW5lID0gZGVjb2RlVVJJQ29tcG9uZW50KCBvcHRpb25zIS5zY2VuZSB8fCAnJyApXG4gICAgICAgIGNvbnN0IGlkID0gb3B0aW9ucyEuaWQgfHwgc2NlbmUgfHwgJ2VlMzA5OTI4NWNkYmYzOGYxMjg2OWIxMzM2M2JjMjA2JztcblxuICAgICAgICB0aGlzLnJ1bkNvbXB1dGVkKCApO1xuICAgICAgICB0aGlzLmluaXRDb3ZlclRleHQoICk7XG5cbiAgICAgICAgaWYgKCAhIWlkICkgeyBcbiAgICAgICAgICAgIHRoaXMuc2V0RGF0YSEoe1xuICAgICAgICAgICAgICAgIGlkXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICggISEob3B0aW9ucyBhcyBhbnkpLmZyb20gKSB7XG4gICAgICAgICAgICB0aGlzLnNldERhdGEhKHtcbiAgICAgICAgICAgICAgICBmcm9tOiBvcHRpb25zIS5mcm9tXG4gICAgICAgICAgICB9KVxuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICBzZXRUaW1lb3V0KCggKSA9PiB7XG4gICAgICAgICAgICB0aGlzLndhdGNoUm9sZSggKTtcbiAgICAgICAgICAgIHRoaXMuZmV0Y2hMYXN0KCApO1xuICAgICAgICAgICAgdGhpcy5mZXREZXRhaWwoIGlkICk7XG4gICAgICAgIH0sIDIwICk7XG4gICAgfSxcbiAgXG4gICAgLyoqXG4gICAgICog55Sf5ZG95ZGo5pyf5Ye95pWwLS3nm5HlkKzpobXpnaLliJ3mrKHmuLLmn5PlrozmiJBcbiAgICAgKi9cbiAgICBvblJlYWR5OiBmdW5jdGlvbiAoICkge1xuICAgICAgICBsZXQgY2lyY2xlQ291bnQgPSAwOyBcbiAgICAgICAgY29uc3QgdGhhdDogYW55ID0gdGhpcztcbiAgICAgICAgLy8g5b+D6Lez55qE5aSW5qGG5Yqo55S7IFxuICAgICAgICB0aGF0LmFuaW1hdGlvbk1pZGRsZUhlYWRlckl0ZW0gPSB3eC5jcmVhdGVBbmltYXRpb24oeyBcbiAgICAgICAgICAgIGR1cmF0aW9uOiA4MDAsIFxuICAgICAgICAgICAgdGltaW5nRnVuY3Rpb246ICdlYXNlJywgXG4gICAgICAgICAgICB0cmFuc2Zvcm1PcmlnaW46ICc1MCUgNTAlJyxcbiAgICAgICAgfSk7IFxuICAgICAgICBzZXRJbnRlcnZhbCggZnVuY3Rpb24oICkgeyBcbiAgICAgICAgICAgIGlmIChjaXJjbGVDb3VudCAlIDIgPT0gMCkgeyBcbiAgICAgICAgICAgICAgICB0aGF0LmFuaW1hdGlvbk1pZGRsZUhlYWRlckl0ZW0uc2NhbGUoIDEuMCApLnJvdGF0ZSggMTAgKS5zdGVwKCApOyBcbiAgICAgICAgICAgIH0gZWxzZSB7IFxuICAgICAgICAgICAgICAgIHRoYXQuYW5pbWF0aW9uTWlkZGxlSGVhZGVySXRlbS5zY2FsZSggMS4wICkucm90YXRlKCAtMzAgKS5zdGVwKCApOyBcbiAgICAgICAgICAgIH0gXG4gICAgICAgICAgICB0aGF0LnNldERhdGEoeyBcbiAgICAgICAgICAgICAgICBhbmltYXRpb25NaWRkbGVIZWFkZXJJdGVtOiB0aGF0LmFuaW1hdGlvbk1pZGRsZUhlYWRlckl0ZW0uZXhwb3J0KCApIFxuICAgICAgICAgICAgfSk7IFxuICAgICAgICAgICAgXG4gICAgICAgICAgICBpZiAoICsrY2lyY2xlQ291bnQgPT09IDEwMDAgKSB7IFxuICAgICAgICAgICAgICAgIGNpcmNsZUNvdW50ID0gMDsgXG4gICAgICAgICAgICB9IFxuICAgICAgICB9LmJpbmQoIHRoaXMgKSwgMTAwMCApOyBcbiAgICB9LFxuICBcbiAgICAvKipcbiAgICAgKiDnlJ/lkb3lkajmnJ/lh73mlbAtLeebkeWQrOmhtemdouaYvuekulxuICAgICAqL1xuICAgIG9uU2hvdzogZnVuY3Rpb24gKCApIHtcbiAgICAgICAgY29uc3QgeyBpZCwgdGlkLCB0cmlwIH0gPSB0aGlzLmRhdGE7XG4gICAgICAgIFxuICAgICAgICB0aGlzLmZldGNoU2hvcHBpbmcoIGlkLCB0aWQgKTtcbiAgICAgICAgaWYgKCAhIXRyaXAgKSB7XG4gICAgICAgICAgICBjb25zdCB7IHN0YXJ0X2RhdGUsIGVuZF9kYXRlIH0gPSAodHJpcCBhcyBhbnkpO1xuICAgICAgICAgICAgdGhpcy5mZXRjaFZpc2l0UmVjb3JkKCBpZCwgc3RhcnRfZGF0ZSwgZW5kX2RhdGUgKTtcbiAgICAgICAgfVxuXG4gICAgfSxcbiAgXG4gICAgLyoqXG4gICAgICog55Sf5ZG95ZGo5pyf5Ye95pWwLS3nm5HlkKzpobXpnaLpmpDol49cbiAgICAgKi9cbiAgICBvbkhpZGU6IGZ1bmN0aW9uICgpIHtcbiAgXG4gICAgfSxcbiAgXG4gICAgLyoqXG4gICAgICog55Sf5ZG95ZGo5pyf5Ye95pWwLS3nm5HlkKzpobXpnaLljbjovb1cbiAgICAgKi9cbiAgICBvblVubG9hZDogZnVuY3Rpb24gKCkge1xuICBcbiAgICB9LFxuICBcbiAgICAvKipcbiAgICAgKiDpobXpnaLnm7jlhbPkuovku7blpITnkIblh73mlbAtLeebkeWQrOeUqOaIt+S4i+aLieWKqOS9nFxuICAgICAqL1xuICAgIG9uUHVsbERvd25SZWZyZXNoOiBmdW5jdGlvbiAoKSB7XG4gIFxuICAgIH0sXG4gIFxuICAgIC8qKlxuICAgICAqIOmhtemdouS4iuaLieinpuW6leS6i+S7tueahOWkhOeQhuWHveaVsFxuICAgICAqL1xuICAgIG9uUmVhY2hCb3R0b206IGZ1bmN0aW9uICgpIHtcbiAgXG4gICAgfSxcbiAgXG4gICAgLyoqXG4gICAgICog55So5oi354K55Ye75Y+z5LiK6KeS5YiG5LqrXG4gICAgICovXG4gICAgb25TaGFyZUFwcE1lc3NhZ2U6IGZ1bmN0aW9uICggZSApIHtcbiAgICAgICAgY29uc3QgeyBoYXNPcmRlciQsIGRldGFpbCQsIG9wZW5pZCwgc2hhcmVDb3ZlciB9ID0gKHRoaXMuZGF0YSBhcyBhbnkpO1xuXG4gICAgICAgIHRoaXMuY2xvc2VQb3N0ZXIoICk7XG4gICAgICAgIHNldFRpbWVvdXQoKCApID0+IHtcbiAgICAgICAgICAgIGNvbnN0IHNoYXJlRmVkYmFjayA9ICh0aGlzIGFzIGFueSkuc2VsZWN0Q29tcG9uZW50KCcjc2hhcmUtZmVlZGJhY2snKTtcbiAgICAgICAgICAgIHNoYXJlRmVkYmFjay50b2dnbGUoICk7XG4gICAgICAgIH0sIDUwMCApO1xuXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBpbWFnZVVybDogc2hhcmVDb3ZlciB8fCBgJHtkZXRhaWwkLmltZ1sgMCBdfWAsXG4gICAgICAgICAgICBwYXRoOiBgL3BhZ2VzL2dvb2RzLWRldGFpbC9pbmRleD9pZD0ke2RldGFpbCQuX2lkfSZmcm9tPSR7b3BlbmlkfWAsXG4gICAgICAgICAgICB0aXRsZTogISFkZXRhaWwkICYmIGRldGFpbCQuaGFzUGluICYmICFoYXNPcmRlciQgP1xuICAgICAgICAgICAgICAgIGDmnInkurrmg7PopoHlkJfvvJ/mi7zlm6LkubDvvIzmiJHku6zpg73og73nnIHvvIEke2RldGFpbCQudGl0bGV9ICR7ZGV0YWlsJC50YWdUZXh0fWAgOlxuICAgICAgICAgICAgICAgIGDmjqjojZDjgIwke2RldGFpbCQudGFnVGV4dH3jgI3npZ7lmaghJHtkZXRhaWwkLnRpdGxlfWBcbiAgICAgICAgfVxuICAgIH1cbiAgfSkiXX0=