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
                    "\u8C22\u8C22\u7ED9\u529B\u7684\u7FA4\u53CB~",
                    "\u8D5E!\u62FC\u56E2\u597D\u5212\u7B97~",
                    "\u54C8!\u4E0B\u6B21\u7EE7\u7EED\u62FC~"
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7O0FBQ0EsOENBQTBDO0FBQzFDLHFEQUFvRDtBQUNwRCxnREFBcUQ7QUFDckQsZ0RBQTRDO0FBRTVDLElBQU0sR0FBRyxHQUFHLE1BQU0sRUFBUSxDQUFDO0FBRzNCLElBQU0sVUFBVSxHQUFHLG9CQUFvQixDQUFDO0FBRXhDLElBQUksQ0FBQztJQUdELHlCQUF5QixFQUFFLElBQUk7SUFLL0IsSUFBSSxFQUFFO1FBRUYsVUFBVSxFQUFFLElBQUk7UUFHaEIsTUFBTSxFQUFFLEVBQUU7UUFHVixRQUFRLEVBQUUsRUFBRTtRQUdaLEtBQUssRUFBRSxJQUFJO1FBR1gsR0FBRyxFQUFFLEVBQUU7UUFHUCxFQUFFLEVBQUUsRUFBRTtRQUdOLE1BQU0sRUFBRSxJQUFJO1FBR1osR0FBRyxFQUFFLEVBQUc7UUFHUixPQUFPLEVBQUUsSUFBSTtRQUdiLFdBQVcsRUFBRSxLQUFLO1FBR2xCLEtBQUssRUFBRSxLQUFLO1FBR1osV0FBVyxFQUFFO1lBQ1QsTUFBTSxFQUFFLE1BQU0sRUFBRSxNQUFNO1NBQ3pCO1FBR0QseUJBQXlCLEVBQUUsSUFBSTtRQUcvQixVQUFVLEVBQUUsS0FBSztRQUdqQixhQUFhLEVBQUUsS0FBSztRQUdwQixZQUFZLEVBQUUsTUFBTTtRQUdwQixpQkFBaUIsRUFBRSxLQUFLO1FBR3hCLFlBQVksRUFBRSxNQUFNO1FBR3BCLGNBQWMsRUFBRSxLQUFLO1FBR3JCLEdBQUcsRUFBRSxFQUFHO1FBR1IsUUFBUSxFQUFFLEVBQUc7UUFHYixVQUFVLEVBQUUsRUFBRztRQUdmLFNBQVMsRUFBRSxFQUFHO1FBR2QsSUFBSSxFQUFFLElBQUk7UUFHVixnQkFBZ0IsRUFBRSxLQUFLO1FBR3ZCLE1BQU0sRUFBRSxFQUFFO1FBR1YsSUFBSSxFQUFFLEVBQUU7UUFHUixnQkFBZ0IsRUFBRSxDQUFDO1FBR25CLFVBQVUs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QUFFLENBQUM7U0FDckQ7SUFFTCxDQUFDO0lBS0QsTUFBTSxFQUFFO0lBRVIsQ0FBQztJQUtELFFBQVEsRUFBRTtJQUVWLENBQUM7SUFLRCxpQkFBaUIsRUFBRTtJQUVuQixDQUFDO0lBS0QsYUFBYSxFQUFFO0lBRWYsQ0FBQztJQUtELGlCQUFpQixFQUFFLFVBQVcsQ0FBQztRQUFaLGlCQWdCbEI7UUFmUyxJQUFBLGNBQStELEVBQTdELHdCQUFTLEVBQUUsb0JBQU8sRUFBRSxrQkFBTSxFQUFFLDBCQUFpQyxDQUFDO1FBRXRFLElBQUksQ0FBQyxXQUFXLEVBQUcsQ0FBQztRQUNwQixVQUFVLENBQUM7WUFDUCxJQUFNLFlBQVksR0FBSSxLQUFZLENBQUMsZUFBZSxDQUFDLGlCQUFpQixDQUFDLENBQUM7WUFDdEUsWUFBWSxDQUFDLE1BQU0sRUFBRyxDQUFDO1FBQzNCLENBQUMsRUFBRSxHQUFHLENBQUUsQ0FBQztRQUVULE9BQU87WUFDSCxRQUFRLEVBQUUsVUFBVSxJQUFJLEtBQUcsT0FBTyxDQUFDLEdBQUcsQ0FBRSxDQUFDLENBQUk7WUFDN0MsSUFBSSxFQUFFLGtDQUFnQyxPQUFPLENBQUMsR0FBRyxjQUFTLE1BQVE7WUFDbEUsS0FBSyxFQUFFLENBQUMsQ0FBQyxPQUFPLElBQUksT0FBTyxDQUFDLE1BQU0sSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO2dCQUM5QyxxR0FBbUIsT0FBTyxDQUFDLEtBQUssU0FBSSxPQUFPLENBQUMsT0FBUyxDQUFDLENBQUM7Z0JBQ3ZELHVCQUFNLE9BQU8sQ0FBQyxPQUFPLDJCQUFPLE9BQU8sQ0FBQyxLQUFPO1NBQ2xELENBQUE7SUFDTCxDQUFDO0NBQ0YsQ0FBQyxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiXG5pbXBvcnQgeyBodHRwIH0gZnJvbSAnLi4vLi4vdXRpbC9odHRwLmpzJztcbmltcG9ydCB7IGNvbXB1dGVkIH0gZnJvbSAnLi4vLi4vbGliL3Z1ZWZ5L2luZGV4LmpzJztcbmltcG9ydCB7IGRlbGF5ZXJpbmdHb29kIH0gZnJvbSAnLi4vLi4vdXRpbC9nb29kcy5qcyc7XG5pbXBvcnQgeyBuYXZUbyB9IGZyb20gJy4uLy4uL3V0aWwvcm91dGUuanMnO1xuXG5jb25zdCBhcHAgPSBnZXRBcHA8YW55PiggKTtcblxuLy8g5omT5byA5ou85Zui5o+Q56S655qEa2V5XG5jb25zdCBzdG9yYWdlS2V5ID0gJ29wZW5lZC1waW4taW4tZ29vZCc7XG5cblBhZ2Uoe1xuXG4gICAgLy8g5Yqo55S7XG4gICAgYW5pbWF0aW9uTWlkZGxlSGVhZGVySXRlbTogbnVsbCxcblxuICAgIC8qKlxuICAgICAqIOmhtemdoueahOWIneWni+aVsOaNrlxuICAgICAqL1xuICAgIGRhdGE6IHtcbiAgICAgICAgLy8g5piv5ZCm5pyJ55So5oi35o6I5p2DXG4gICAgICAgIGlzVXNlckF1dGg6IHRydWUsXG5cbiAgICAgICAgLy8gaXBcbiAgICAgICAgaXBOYW1lOiAnJyxcblxuICAgICAgICAvLyBpcCBcbiAgICAgICAgaXBBdmF0YXI6ICcnLFxuXG4gICAgICAgIC8vIOaYr+WQpuS4uuaWsOWuolxuICAgICAgICBpc05ldzogdHJ1ZSxcblxuICAgICAgICAvLyDooYznqItcbiAgICAgICAgdGlkOiAnJyxcblxuICAgICAgICAvLyDllYblk4FpZFxuICAgICAgICBpZDogJycsXG5cbiAgICAgICAgLy8g5ZWG5ZOB6K+m5oOFXG4gICAgICAgIGRldGFpbDogbnVsbCxcbiAgICAgICAgXG4gICAgICAgIC8vIOaVsOaNruWtl+WFuFxuICAgICAgICBkaWM6IHsgfSxcbiAgICAgICAgXG4gICAgICAgIC8vIOWKoOi9veeKtuaAgVxuICAgICAgICBsb2FkaW5nOiB0cnVlLFxuXG4gICAgICAgIC8vIOaYr+WQpuWIneWni+WMlui/h+KAnOWWnOasouKAnVxuICAgICAgICBoYXNJbml0TGlrZTogZmFsc2UsXG5cbiAgICAgICAgLy8g5piv5ZCm4oCc5Zac5qyi4oCdXG4gICAgICAgIGxpa2VkOiBmYWxzZSxcblxuICAgICAgICAvLyDmloflrZfkv53or4Hmj5DnpLpcbiAgICAgICAgcHJvbWlzZVRpcHM6IFtcbiAgICAgICAgICAgICfmraPlk4Hkv53or4EnLCAn5Lu35qC85LyY5Yq/JywgJ+ecn+S6uui3keiFvydcbiAgICAgICAgXSxcblxuICAgICAgICAvLyDliqjnlLtcbiAgICAgICAgYW5pbWF0aW9uTWlkZGxlSGVhZGVySXRlbTogbnVsbCxcblxuICAgICAgICAvLyDlsZXnpLrnrqHnkIblhaXlj6NcbiAgICAgICAgc2hvd0FkbUJ0bjogZmFsc2UsXG5cbiAgICAgICAgLy8g5q2j5Zyo5bGV56S65rW35oqlXG4gICAgICAgIHNob3dpbmdQb3N0ZXI6IGZhbHNlLFxuXG4gICAgICAgIC8vIOWxleekuuaLvOWboueOqeazleeahOW8ueahhlxuICAgICAgICBzaG93UGxheVRpcHM6ICdoaWRlJyxcblxuICAgICAgICAvLyDlsZXnpLrliIbkuqvotZrpkrFcbiAgICAgICAgc2hvd1NoYXJlR2V0TW9uZXk6IGZhbHNlLFxuXG4gICAgICAgIC8vIOWxleekuuaLvOWbouWVhuWTgeWIl+ihqFxuICAgICAgICBzaG93UGluR29vZHM6ICdoaWRlJyxcblxuICAgICAgICAvLyDliIbkuqtUaXBzMlxuICAgICAgICBzaG93U2hhcmVUaXBzMjogZmFsc2UsXG5cbiAgICAgICAgLy8g5ou85Zui5YiX6KGoXG4gICAgICAgIHBpbjogWyBdLFxuXG4gICAgICAgIC8vIOacrOihjOeoi+eahOi0reeJqea4heWNleWIl+ihqFxuICAgICAgICBzaG9wcGluZzogWyBdLFxuXG4gICAgICAgIC8vIOS4gOWPo+S7t+a0u+WKqOWIl+ihqFxuICAgICAgICBhY3Rpdml0aWVzOiBbIF0sXG5cbiAgICAgICAgLy8g5pys6Laf6IO95aSf5ou85Zui55qEc2t1XG4gICAgICAgIGNhblBpblNrdTogWyBdLFxuXG4gICAgICAgIC8vIOW9k+WJjeeahOihjOeoi1xuICAgICAgICB0cmlwOiBudWxsLFxuXG4gICAgICAgIC8vIOW9k+WJjeaYr+WQpuW8gOWQr+S6huenr+WIhuaOqOW5v1xuICAgICAgICBjYW5JbnRlZ3JheVNoYXJlOiBmYWxzZSxcblxuICAgICAgICAvLyDlvZPliY3otKblj7fnmoRvcGVuaWRcbiAgICAgICAgb3BlbmlkOiAnJyxcblxuICAgICAgICAvLyDliIbkuqvkurrnmoRvcGVuaWRcbiAgICAgICAgZnJvbTogJycsXG5cbiAgICAgICAgLy8g56ev5YiG5o6o5bm/6I6354K55q+U5L6LXG4gICAgICAgIHB1c2hJbnRlZ3JhbFJhdGU6IDAsXG5cbiAgICAgICAgLy8g5piv5ZCm5bGV5byAc2t1XG4gICAgICAgIG9wZW5pbmdTa3U6IGZhbHNlLFxuXG4gICAgICAgIC8vIOiuv+mXruiusOW9lVxuICAgICAgICB2aXNpdG9yczogWyBdLFxuXG4gICAgICAgIC8vIOWIhuS6q+S6uuS/oeaBr1xuICAgICAgICBzaGFyZUZyb21Vc2VyOiB7IH0sXG5cbiAgICAgICAgLy8g5YiG5Lqr5bCB6Z2iXG4gICAgICAgIHNoYXJlQ292ZXI6ICcnLFxuXG4gICAgICAgIC8vIOWwgemdouaPkOekulxuICAgICAgICBjb3ZlclRleHQ6IFwiMjPkurrnnIvov4dcIlxuICAgIH0sXG5cbiAgICAvKiog6K6+572uY29tcHV0ZWQgKi9cbiAgICBydW5Db21wdXRlZCggKSB7XG4gICAgICAgIGNvbXB1dGVkKCB0aGlzLCB7XG5cbiAgICAgICAgICAgIC8vIOiuoeeul+S7t+agvFxuICAgICAgICAgICAgcHJpY2U6IGZ1bmN0aW9uKCApIHtcbiAgICAgICAgICAgICAgICBjb25zdCB7IGRldGFpbCB9ID0gdGhpcy5kYXRhO1xuICAgICAgICAgICAgICAgIGNvbnN0IHJlc3VsdCA9IGRlbGF5ZXJpbmdHb29kKCBkZXRhaWwgKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVzdWx0ID8gcmVzdWx0LnByaWNlJCA6ICcnO1xuICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAgLy8g5ZWG5ZOB6K+m5oOFIC0g5YiG6KGM5pi+56S6XG4gICAgICAgICAgICBkZXRhaWxJbnRybzogZnVuY3Rpb24oICkge1xuICAgICAgICAgICAgICAgIGNvbnN0IHsgZGV0YWlsIH0gPSB0aGlzLmRhdGE7XG4gICAgICAgICAgICAgICAgaWYgKCAhZGV0YWlsIHx8ICggISFkZXRhaWwgJiYgIWRldGFpbC5kZXRhaWwgKSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gWyBdO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBkZXRhaWwuZGV0YWlsLnNwbGl0KCdcXG4nKS5maWx0ZXIoIHggPT4gISF4ICk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAgLy8g5Lu35qC8IO+9niDlm6LotK3ku7fnmoTlt67ku7dcbiAgICAgICAgICAgIHByaWNlR2FwOiBmdW5jdGlvbiggKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgeyBkZXRhaWwgfSA9IHRoaXMuZGF0YTtcbiAgICAgICAgICAgICAgICBpZiAoICFkZXRhaWwgKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAnJ1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHJlc3VsdCA9IGRlbGF5ZXJpbmdHb29kKCBkZXRhaWwgKTtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgZ2FwID0gcmVzdWx0ID8gU3RyaW5nKCByZXN1bHQuZ29vZFBpbnMuZWFjaFByaWNlUm91bmQgKS5yZXBsYWNlKC9cXC4wMC9nLCAnJykgOiAnJztcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgbWV0YSA9IGdhcCAhPT0gJzAnICYmICEhZ2FwID8gZ2FwIDogJyc7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBtZXRhO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgIC8vIOmprOS4iuWPr+S7peaLvOWboueahOS4quaVsFxuICAgICAgICAgICAgcGluQ291bnQkOiBmdW5jdGlvbiggKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgeyBpZCwgZGV0YWlsIH0gPSB0aGlzLmRhdGE7XG4gICAgICAgICAgICAgICAgY29uc3QgZ29vZFNob3BwaW5nID0gdGhpcy5kYXRhLnNob3BwaW5nLmZpbHRlciggeCA9PiB4LnBpZCA9PT0gaWQgKTtcbiAgICAgICAgICAgICAgICBpZiAoICFkZXRhaWwgKSB7IFxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gMDtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBjb25zdCB7IHN0YW5kYXJkcywgZ3JvdXBQcmljZSB9ID0gZGV0YWlsO1xuXG4gICAgICAgICAgICAgICAgaWYgKCAhIXN0YW5kYXJkcyAmJiBzdGFuZGFyZHMubGVuZ3RoID4gMCApIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHN0YW5kYXJkc1xuICAgICAgICAgICAgICAgICAgICAgICAgLmZpbHRlciggeCA9PiAhIWdvb2RTaG9wcGluZy5maW5kKCBzID0+IHMuc2lkID09PSB4Ll9pZCAmJiBzLnBpZCA9PT0geC5waWQgKSlcbiAgICAgICAgICAgICAgICAgICAgICAgIC5sZW5ndGg7XG5cbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKCAhIWdyb3VwUHJpY2UgKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHsgX2lkIH0gPSBkZXRhaWw7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAhIWdvb2RTaG9wcGluZy5maW5kKCBzID0+IHMucGlkID09PSBfaWQgKSA/IDEgOiAwXG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgcmV0dXJuIDA7XG4gICAgICAgICAgICB9LFxuXG4gICAgICAgICAgICAvLyDmi7zlm6LliJfooahcbiAgICAgICAgICAgIHBpbiQ6IGZ1bmN0aW9uKCApIHtcbiAgICAgICAgICAgICAgICBsZXQgbWV0YTogYW55ID0gWyBdO1xuICAgICAgICAgICAgICAgIGNvbnN0IHsgZGV0YWlsLCBzaG9wcGluZywgYWN0aXZpdGllcyB9ID0gdGhpcy5kYXRhO1xuXG4gICAgICAgICAgICAgICAgaWYgKCAhZGV0YWlsICkgeyBcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFsgXTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBjb25zdCB7IHN0YW5kYXJkcywgZ3JvdXBQcmljZSB9ID0gZGV0YWlsO1xuXG4gICAgICAgICAgICAgICAgaWYgKCBzdGFuZGFyZHMubGVuZ3RoID4gMCApIHtcbiAgICAgICAgICAgICAgICAgICAgbWV0YSA9IHN0YW5kYXJkc1xuICAgICAgICAgICAgICAgICAgICAgICAgLmZpbHRlciggeCA9PiAhIXguZ3JvdXBQcmljZSApXG4gICAgICAgICAgICAgICAgICAgICAgICAubWFwKCB4ID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gT2JqZWN0LmFzc2lnbih7IH0sIHgsIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2lkOiB4Ll9pZCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FuUGluOiAhIXNob3BwaW5nLmZpbmQoIHMgPT4gcy5zaWQgPT09IHguX2lkICYmIHMucGlkID09PSB4LnBpZCApXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmICggISFncm91cFByaWNlICkge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCB7IHByaWNlLCB0aXRsZSwgaW1nLCBfaWQgfSA9IGRldGFpbDtcbiAgICAgICAgICAgICAgICAgICAgbWV0YSA9IFt7XG4gICAgICAgICAgICAgICAgICAgICAgICBwcmljZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHBpZDogX2lkLFxuICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogdGl0bGUsXG4gICAgICAgICAgICAgICAgICAgICAgICBncm91cFByaWNlLFxuICAgICAgICAgICAgICAgICAgICAgICAgc2lkOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgICAgICAgICBpbWc6IGltZ1sgMCBdLFxuICAgICAgICAgICAgICAgICAgICAgICAgY2FuUGluOiAhIXNob3BwaW5nLmZpbmQoIHMgPT4gcy5waWQgPT09IF9pZCApXG4gICAgICAgICAgICAgICAgICAgIH1dO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIC8vIOagueaNrua0u+WKqO+8jOabtOaUueOAgeaWsOWinuaLvOWboumhueebrlxuICAgICAgICAgICAgICAgIGFjdGl2aXRpZXMubWFwKCBhYyA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGlmICggIWFjLmFjX2dyb3VwUHJpY2UgKSB7IHJldHVybjsgfVxuICAgICAgICAgICAgICAgICAgICBjb25zdCBwaW5UYXJnZXQgPSBtZXRhLmZpbmQoIHggPT4geC5waWQgPT09IGFjLnBpZCAmJiB4LnNpZCA9PT0gYWMuc2lkICk7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHBpblRhcmdldEluZGV4ID0gbWV0YS5maW5kSW5kZXgoIHggPT4geC5waWQgPT09IGFjLnBpZCAmJiB4LnNpZCA9PT0gYWMuc2lkICk7XG5cbiAgICAgICAgICAgICAgICAgICAgLy8g5pu/5o2iXG4gICAgICAgICAgICAgICAgICAgIGlmICggcGluVGFyZ2V0SW5kZXggIT09IC0xICkge1xuICAgICAgICAgICAgICAgICAgICAgICAgbWV0YS5zcGxpY2UoIHBpblRhcmdldEluZGV4LCAxLCBPYmplY3QuYXNzaWduKHsgfSwgcGluVGFyZ2V0LCB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJpY2U6IGFjLmFjX3ByaWNlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGdyb3VwUHJpY2U6IGFjLmFjX2dyb3VwUHJpY2VcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pKTtcblxuICAgICAgICAgICAgICAgICAgICAvLyDmlrDlop5cbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG1ldGEucHVzaCh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2lkOiBhYy5zaWQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcGlkOiBhYy5waWQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaW1nOiBhYy5pbWcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogYWMudGl0bGUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FuUGluOiAhIXNob3BwaW5nLmZpbmQoIHMgPT4gcy5zaWQgPT09IGFjLnNpZCAmJiBzLnBpZCA9PT0gYWMucGlkICksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJpY2U6IGFjLmFjX3ByaWNlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGdyb3VwUHJpY2U6IGFjLmFjX2dyb3VwUHJpY2UgXG4gICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICBjb25zdCBtZXRhMiA9IG1ldGEubWFwKCB4ID0+IE9iamVjdC5hc3NpZ24oeyB9LCB4LCB7XG4gICAgICAgICAgICAgICAgICAgIGRlbHRhOiBOdW1iZXIoIHgucHJpY2UgLSB4Lmdyb3VwUHJpY2UgKS50b0ZpeGVkKCAwIClcbiAgICAgICAgICAgICAgICB9KSk7XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gbWV0YTI7XG4gICAgICAgICAgICB9LFxuXG4gICAgICAgICAgICAvLyDnp6/liIbljLrpl7RcbiAgICAgICAgICAgIGludGVncmFsJDogZnVuY3Rpb24oICkge1xuICAgICAgICAgICAgICAgIGNvbnN0IHsgZGV0YWlsLCBwdXNoSW50ZWdyYWxSYXRlIH0gPSB0aGlzLmRhdGE7XG4gICAgICAgICAgICAgICAgaWYgKCAhZGV0YWlsICkgeyBcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuICcnO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBjb25zdCByZXN1bHQgPSBkZWxheWVyaW5nR29vZCggZGV0YWlsLCBwdXNoSW50ZWdyYWxSYXRlICk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlc3VsdC5pbnRlZ3JhbCQ7XG4gICAgICAgICAgICB9LFxuXG4gICAgICAgICAgICAvLyDor6bmg4VcbiAgICAgICAgICAgIGRldGFpbCQ6IGZ1bmN0aW9uKCApIHtcbiAgICAgICAgICAgICAgICBjb25zdCB7IGRldGFpbCB9ID0gdGhpcy5kYXRhO1xuICAgICAgICAgICAgICAgIGNvbnN0IHIgPSBkZWxheWVyaW5nR29vZCggZGV0YWlsICk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHI7XG4gICAgICAgICAgICB9LFxuXG4gICAgICAgICAgICAvLyDmraTotKblj7fvvIzmmK/lkKbmnInljZVcbiAgICAgICAgICAgIGhhc09yZGVyJCggKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgeyBvcGVuaWQsIHRyaXBTaG9wcGluZ2xpc3QgfSA9IHRoaXMuZGF0YTtcbiAgICAgICAgICAgICAgICBjb25zdCByID0gKHRyaXBTaG9wcGluZ2xpc3QgfHwgWyBdKVxuICAgICAgICAgICAgICAgICAgICAuZmlsdGVyKCBzbCA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCB7IHVpZHMgfSA9IHNsO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHVpZHMuaW5jbHVkZXMoIG9wZW5pZCApO1xuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIGNvbnN0IHJlc3VsdCA9IEFycmF5LmlzQXJyYXkoIHRyaXBTaG9wcGluZ2xpc3QgKSAmJiB0cmlwU2hvcHBpbmdsaXN0Lmxlbmd0aCA+IDBcbiAgICAgICAgICAgICAgICAgICAgPyByLmxlbmd0aCA+IDAgOiBmYWxzZTtcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAgLy8g5ZWG5ZOB55qE6K6/6Zeu6K6w5b2VXG4gICAgICAgICAgICB2aXNpdG9ycyQoICkge1xuICAgICAgICAgICAgICAgIGNvbnN0IHsgdmlzaXRvcnMsIG9wZW5pZCB9ID0gdGhpcy5kYXRhO1xuICAgICAgICAgICAgICAgIHJldHVybiB2aXNpdG9ycy5maWx0ZXIoIHggPT4geC5vcGVuaWQgIT09IG9wZW5pZCApO1xuICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAgLy8g5ZWG5ZOB55qE6K6/6ZeuICsg56S+5Lqk5bGe5oCn5qih5Z2XXG4gICAgICAgICAgICBzb2NpYWwkKCApIHtcbiAgICAgICAgICAgICAgICBjb25zdCB7IHZpc2l0b3JzLCBvcGVuaWQsIGRldGFpbCB9ID0gdGhpcy5kYXRhO1xuICAgICAgICAgICAgICAgIGNvbnN0IGdvb2QgPSBkZWxheWVyaW5nR29vZCggZGV0YWlsICk7IFxuICAgICAgICAgICAgICAgIGNvbnN0IGdldFJhbmRvbSA9IG4gPT4gTWF0aC5mbG9vciggTWF0aC5yYW5kb20oICkgKiBuICk7XG5cbiAgICAgICAgICAgICAgICBjb25zdCBhbGxUZXh0cyA9IFtcbiAgICAgICAgICAgICAgICAgICAgYOWIkueul+iAtu+8geaciee+pOWPi+aLvOWbouWQl2AsXG4gICAgICAgICAgICAgICAgICAgIGDjgIwke2dvb2QudGFnVGV4dH3jgI3mhJ/op4nkuI3plJlgLFxuICAgICAgICAgICAgICAgICAgICBg55yL6LW35p2l5LiN6ZSZ77yB5oOz5ou85ZuiYCxcbiAgICAgICAgICAgICAgICAgICAgYOaciee+pOWPi+aLvOWbouWQl++8n+aIkeS7rOS4gOi1t+ecgWBcbiAgICAgICAgICAgICAgICBdO1xuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIGNvbnN0IGFsbFZpc2l0b3JzID0gdmlzaXRvcnNcbiAgICAgICAgICAgICAgICAgICAgLmZpbHRlciggeCA9PiB4Lm9wZW5pZCAhPT0gb3BlbmlkIClcbiAgICAgICAgICAgICAgICAgICAgLm1hcCggeCA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCByYW5kb21OdW0gPSBnZXRSYW5kb20oIGFsbFRleHRzLmxlbmd0aCApO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhdmF0YXI6IHguYXZhdGFyVXJsLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRleHQ6IGFsbFRleHRzWyByYW5kb21OdW0gXVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIHJldHVybiBhbGxWaXNpdG9ycztcblxuICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAgLy8g5b2T5YmN5ZWG5ZOB55qE6LSt54mp5riF5Y2VXG4gICAgICAgICAgICBzaG9wcGluZyQoICkge1xuICAgICAgICAgICAgICAgIGNvbnN0IHsgc2hvcHBpbmcsIGlkIH0gPSB0aGlzLmRhdGE7XG5cbiAgICAgICAgICAgICAgICBjb25zdCBnZXRSYW5kb20gPSBuID0+IE1hdGguZmxvb3IoIE1hdGgucmFuZG9tKCApICogbiApO1xuICAgICAgICAgICAgICAgIGNvbnN0IGFsbFRleHRzID0gW1xuICAgICAgICAgICAgICAgICAgICBg6LCi6LCi57uZ5Yqb55qE576k5Y+LfmAsXG4gICAgICAgICAgICAgICAgICAgIGDotZ4h5ou85Zui5aW95YiS566XfmAsXG4gICAgICAgICAgICAgICAgICAgIGDlk4gh5LiL5qyh57un57ut5ou8fmBcbiAgICAgICAgICAgICAgICBdO1xuXG4gICAgICAgICAgICAgICAgcmV0dXJuIHNob3BwaW5nXG4gICAgICAgICAgICAgICAgICAgIC5maWx0ZXIoIHggPT4geC5waWQgPT09IGlkIClcbiAgICAgICAgICAgICAgICAgICAgLm1hcCggc2wgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgeyB1c2VycywgZGV0YWlsIH0gPSBzbDtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHsgbmFtZSB9ID0gZGV0YWlsO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAuLi5zbCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBuYW1lLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZpcnN0VXNlcjogdXNlcnNbIDAgXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvdGhlclVzZXI6IHVzZXJzLnNsaWNlKCAxICksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGlwczogYWxsVGV4dHNbIGdldFJhbmRvbSggYWxsVGV4dHMubGVuZ3RoICldXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICB9LFxuXG4gICAgICAgICAgICAvLyDooYznqIvkuK3nmoTlhbbku5botK3nianmuIXljZVcbiAgICAgICAgICAgIG90aGVyU2hvcHBpbmckKCApIHtcbiAgICAgICAgICAgICAgICBjb25zdCB7IHNob3BwaW5nLCBpZCB9ID0gdGhpcy5kYXRhO1xuXG4gICAgICAgICAgICAgICAgY29uc3QgcmVzdWx0ID0gc2hvcHBpbmdcbiAgICAgICAgICAgICAgICAgICAgLmZpbHRlciggeCA9PiB4LnBpZCAhPT0gaWQgKVxuICAgICAgICAgICAgICAgICAgICAubWFwKCB4ID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHsgcGlkLCBkZXRhaWwsIHVzZXJzLCBhZGp1c3RQcmljZSwgYWRqdXN0R3JvdXBQcmljZSB9ID0geDtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHsgbmFtZSwgdGl0bGUgfSA9IGRldGFpbDtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHRvdGFsRGVsdGEgPSB1c2Vycy5sZW5ndGggKiBNYXRoLmNlaWwoIGFkanVzdFByaWNlIC0gYWRqdXN0R3JvdXBQcmljZSApO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwaWQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaW1nOiBkZXRhaWwuaW1nLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRvcFRpcHM6IGAke3VzZXJzLmxlbmd0aCA+IDEgPyB1c2Vycy5sZW5ndGggKyAn5Lq6JyA6ICcnfeecgSR7dG90YWxEZWx0YX3lhYNgLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJvdHRvbVRpcHM6IGAke3VzZXJzLmxlbmd0aH3nvqTlj4vmi7zlm6JgLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGF2YXRhcnM6IHVzZXJzLm1hcCggeCA9PiB4LmF2YXRhclVybCApLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRpdGxlOiBgJHtuYW1lID8gbmFtZSArICcgJyA6ICcnfSR7dGl0bGV9YFxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICAgICAgICB9LFxuXG4gICAgICAgICAgICAvLyDooYznqIvkuK3vvIzlvZPliY3kuqflk4HmiYDmnInlnovlj7fliqDotbfmnaXvvIzmnInlpJrlsJHkurrlnKjmi7zlm6JcbiAgICAgICAgICAgIGFsbFBpblBsYXllcnMkKCApIHtcbiAgICAgICAgICAgICAgICBjb25zdCB7IGlkLCBzaG9wcGluZyB9ID0gdGhpcy5kYXRhO1xuICAgICAgICAgICAgICAgIGNvbnN0IGdvb2RTaG9wcGluZyA9IHNob3BwaW5nLmZpbHRlciggeCA9PiB4LnBpZCA9PT0gaWQgKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gZ29vZFNob3BwaW5nLnJlZHVjZSgoIHgsIHNsICkgPT4ge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4geCArIHNsLnVpZHMubGVuZ3RoO1xuICAgICAgICAgICAgICAgIH0sIDAgKTtcbiAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICog546w5Zyo5Yiw5YeM5pmoMeeCueeahOWAkuiuoeaXtlxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICBjb3VudERvd25OaWdodCQoICkge1xuICAgICAgICAgICAgICAgIGNvbnN0IG5vdyA9IG5ldyBEYXRlKCApO1xuICAgICAgICAgICAgICAgIGNvbnN0IHkgPSBub3cuZ2V0RnVsbFllYXIoICk7XG4gICAgICAgICAgICAgICAgY29uc3QgbSA9IG5vdy5nZXRNb250aCggKSArIDE7XG4gICAgICAgICAgICAgICAgY29uc3QgZCA9IG5vdy5nZXREYXRlKCApO1xuICAgICAgICAgICAgICAgIGNvbnN0IHRvZGF5T25lID0gbmV3IERhdGUoYCR7eX0vJHttfS8ke2R9IDAxOjAwOjAwYCk7XG4gICAgICAgICAgICAgICAgY29uc3QgdG9tb3Jyb3dPbmUgPSB0b2RheU9uZS5nZXRUaW1lKCApICsgMjQgKiA2MCAqIDYwICogMTAwMDtcbiAgICAgICAgICAgICAgICByZXR1cm4gKCggdG9tb3Jyb3dPbmUgLSBEYXRlLm5vdyggKSkgLyAxMDAwICkudG9GaXhlZCggMCApO1xuICAgICAgICAgICAgfSxcblxuICAgICAgICB9KVxuICAgIH0sXG5cbiAgICAvKiog55uR5ZCs5YWo5bGA566h55CG5ZGY5p2D6ZmQICovXG4gICAgd2F0Y2hSb2xlKCApIHtcbiAgICAgICAgKGFwcCBhcyBhbnkpLndhdGNoJCgncm9sZScsICggdmFsICkgPT4ge1xuICAgICAgICAgICAgdGhpcy5zZXREYXRhISh7XG4gICAgICAgICAgICAgICAgc2hvd0FkbUJ0bjogKCB2YWwgPT09IDEgKVxuICAgICAgICAgICAgfSlcbiAgICAgICAgfSk7XG4gICAgICAgIChhcHAgYXMgYW55KS53YXRjaCQoJ2lzTmV3JywgdmFsID0+IHtcbiAgICAgICAgICAgIHRoaXMuc2V0RGF0YSEoe1xuICAgICAgICAgICAgICAgIGlzTmV3OiB2YWxcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICAgICAgKGFwcCBhcyBhbnkpLndhdGNoJCgnYXBwQ29uZmlnJywgdmFsID0+IHtcbiAgICAgICAgICAgIGlmICggIXZhbCApIHsgcmV0dXJuOyB9XG4gICAgICAgICAgICB0aGlzLnNldERhdGEhKHtcbiAgICAgICAgICAgICAgICBpcE5hbWU6IHZhbFsnaXAtbmFtZSddLFxuICAgICAgICAgICAgICAgIGlwQXZhdGFyOiB2YWxbJ2lwLWF2YXRhciddLFxuICAgICAgICAgICAgICAgIHB1c2hJbnRlZ3JhbFJhdGU6ICh2YWwgfHwgeyB9KVsncHVzaC1pbnRlZ3JhbC1nZXQtcmF0ZSddIHx8IDAsXG4gICAgICAgICAgICAgICAgY2FuSW50ZWdyYXlTaGFyZTogISEodmFsIHx8IHsgfSlbJ2dvb2QtaW50ZWdyYWwtc2hhcmUnXSB8fCBmYWxzZVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB0aGlzLmNyZWF0ZVNoYXJlKCApO1xuICAgICAgICB9KTtcbiAgICAgICAgKGFwcCBhcyBhbnkpLndhdGNoJCgnb3BlbmlkJywgdmFsID0+IHtcbiAgICAgICAgICAgIHRoaXMuc2V0RGF0YSEoe1xuICAgICAgICAgICAgICAgIG9wZW5pZDogdmFsXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHRoaXMuY3JlYXRlU2hhcmUoICk7XG4gICAgICAgICAgICB0aGlzLmZldGNoU2hhcmVyKCApO1xuICAgICAgICB9KTtcbiAgICAgICAgYXBwLndhdGNoJCgnaXNVc2VyQXV0aCcsIHZhbCA9PiB7XG4gICAgICAgICAgICBpZiAoIHZhbCA9PT0gdW5kZWZpbmVkICkgeyByZXR1cm47IH1cbiAgICAgICAgICAgIHRoaXMuc2V0RGF0YSEoe1xuICAgICAgICAgICAgICAgIGlzVXNlckF1dGg6IHZhbFxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH0sXG5cbiAgICAvKiog5ouJ5Y+W5ZWG5ZOB6K+m5oOFICovXG4gICAgZmV0RGV0YWlsKCBpZCApIHtcbiAgICAgICAgY29uc3QgeyBkZXRhaWwsIGZyb20gfSA9IHRoaXMuZGF0YTtcbiAgICAgICAgaWYgKCBkZXRhaWwgKSB7IHJldHVybjsgfVxuICAgICAgICBodHRwKHtcbiAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICBfaWQ6IGlkLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGVyck1zZzogJ+iOt+WPluWVhuWTgemUmeivr++8jOivt+mHjeivlScsXG4gICAgICAgICAgICB1cmw6IGBnb29kX2RldGFpbGAsXG4gICAgICAgICAgICBzdWNjZXNzOiByZXMgPT4ge1xuICAgICAgICAgICAgICBpZiAoIHJlcy5zdGF0dXMgIT09IDIwMCApIHsgcmV0dXJuOyB9XG5cbiAgICAgICAgICAgICAgICBsZXQgcGluOiBhbnkgPSBbIF07XG4gICAgICAgICAgICAgICAgY29uc3QgeyBzdGFuZGFyZHMsIGdyb3VwUHJpY2UsIGFjdGl2aXRpZXMgfSA9IHJlcy5kYXRhO1xuXG4gICAgICAgICAgICAgICAgaWYgKCBzdGFuZGFyZHMubGVuZ3RoID4gMCApIHtcbiAgICAgICAgICAgICAgICAgICAgcGluID0gc3RhbmRhcmRzLmZpbHRlciggeCA9PiAhIXguZ3JvdXBQcmljZSApO1xuXG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmICggISFncm91cFByaWNlICkge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCB7IHByaWNlLCB0aXRsZSwgaW1nICB9ID0gcmVzLmRhdGE7XG4gICAgICAgICAgICAgICAgICAgIHBpbiA9IFt7XG4gICAgICAgICAgICAgICAgICAgICAgICBwcmljZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6IHRpdGxlLFxuICAgICAgICAgICAgICAgICAgICAgICAgZ3JvdXBQcmljZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGltZzogaW1nWyAwIF1cbiAgICAgICAgICAgICAgICAgICAgfV07XG4gICAgICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgICAgIGNvbnN0IGFjdGl2aXRpZXMkID0gYWN0aXZpdGllcy5tYXAoIHggPT4ge1xuXG4gICAgICAgICAgICAgICAgICAgIGxldCBpbWcgPSAnJztcbiAgICAgICAgICAgICAgICAgICAgaWYgKCAhIXguc2lkICkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaW1nID0gc3RhbmRhcmRzLmZpbmQoIHkgPT4geS5faWQgPT09IHguc2lkICkuaW1nXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpbWcgPSByZXMuZGF0YS5pbWdbIDAgXTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBPYmplY3QuYXNzaWduKHsgfSwgeCwgeyBcbiAgICAgICAgICAgICAgICAgICAgICAgIGltZyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvdW50ZG93bjogKCB4LmVuZFRpbWUgLSBuZXcgRGF0ZSggKS5nZXRUaW1lKCApKSAvICggMTAwMCApXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgfSkuZmlsdGVyKCB5ID0+IHkuZW5kVGltZSA+IG5ldyBEYXRlKCApLmdldFRpbWUoICkpO1xuXG4gICAgICAgICAgICAgICAgdGhpcy5zZXREYXRhISh7XG4gICAgICAgICAgICAgICAgICAgIHBpbixcbiAgICAgICAgICAgICAgICAgICAgbG9hZGluZzogZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgIGRldGFpbDogcmVzLmRhdGEsXG4gICAgICAgICAgICAgICAgICAgIGFjdGl2aXRpZXM6IGFjdGl2aXRpZXMkXG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICAvLyDlvLnotbfmi7zlm6LmoYZcbiAgICAgICAgICAgICAgICBpZiAoICEhZnJvbSAmJiBkZWxheWVyaW5nR29vZCggcmVzLmRhdGEgKS5oYXNQaW4gKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc2V0RGF0YSEoe1xuICAgICAgICAgICAgICAgICAgICAgICAgc2hvd1BsYXlUaXBzOiAnc2hvdydcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmICggIWZyb20gJiYgZGVsYXllcmluZ0dvb2QoIHJlcy5kYXRhICkuaGFzUGluICkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmNoZWNrT3BlblBpbiggKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH0sXG5cbiAgICAvKiog5ouJ5Y+W6KGM56iL55qE6LSt54mp6K+35Y2V5L+h5oGvICovXG4gICAgZmV0Y2hTaG9wcGluZyggcGlkLCB0aWQgKSB7XG4gICAgICAgIGlmICggIXBpZCB8fCAhdGlkICkgeyByZXR1cm47IH1cblxuICAgICAgICBodHRwKHtcbiAgICAgICAgICAgIHVybDogJ3Nob3BwaW5nLWxpc3RfcGluJyxcbiAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAvLyBwaWQsXG4gICAgICAgICAgICAgICAgdGlkLFxuICAgICAgICAgICAgICAgIGRldGFpbDogdHJ1ZSxcbiAgICAgICAgICAgICAgICBzaG93VXNlcjogdHJ1ZVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHN1Y2Nlc3M6IHJlcyA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3QgeyBzdGF0dXMsIGRhdGEgfSA9IHJlcztcbiAgICAgICAgICAgICAgICBpZiAoIHN0YXR1cyAhPT0gMjAwICkgeyByZXR1cm47IH1cbiAgICAgICAgICAgICAgICB0aGlzLnNldERhdGEhKHtcbiAgICAgICAgICAgICAgICAgICAgc2hvcHBpbmc6IGRhdGEsXG4gICAgICAgICAgICAgICAgICAgIGNhblBpblNrdTogZGF0YS5tYXAoIHggPT4gKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHBpZDogeC5waWQsXG4gICAgICAgICAgICAgICAgICAgICAgICBzaWQ6IHguc2lkXG4gICAgICAgICAgICAgICAgICAgIH0pKVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KVxuICAgIH0sXG5cbiAgICAvKiog5ouJ5Y+W5b2T5YmN5ZWG5ZOB55qE6K6/6Zeu6K6w5b2VICovXG4gICAgZmV0Y2hWaXNpdFJlY29yZCggcGlkLCBzdGFydCwgYmVmb3JlICkge1xuICAgICAgICBpZiAoICFzdGFydCB8fCAhYmVmb3JlICkgeyByZXR1cm47IH1cbiAgICAgICAgaHR0cCh7XG4gICAgICAgICAgICB1cmw6ICdnb29kX2dvb2QtdmlzaXRvcnMnLFxuICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgIHBpZCxcbiAgICAgICAgICAgICAgICBzdGFydCwgXG4gICAgICAgICAgICAgICAgYmVmb3JlXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgc3VjY2VzczogcmVzID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCB7IHN0YXR1cywgZGF0YSB9ID0gcmVzO1xuICAgICAgICAgICAgICAgIGlmICggc3RhdHVzICE9PSAyMDAgKSB7IHJldHVybjsgfVxuICAgICAgICAgICAgICAgIHRoaXMuc2V0RGF0YSEoe1xuICAgICAgICAgICAgICAgICAgICB2aXNpdG9yczogZGF0YVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9LFxuXG4gICAgLyoqIOaLieWPluS4pOS4quacgOaWsOihjOeoiyAqL1xuICAgIGZldGNoTGFzdCggKSB7XG4gICAgICAgIGNvbnN0IHsgaWQgfSA9IHRoaXMuZGF0YTtcbiAgICAgICAgaHR0cCh7XG4gICAgICAgICAgICBkYXRhOiB7IH0sXG4gICAgICAgICAgICB1cmw6IGB0cmlwX2VudGVyYCxcbiAgICAgICAgICAgIHN1Y2Nlc3M6IHJlcyA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3QgeyBzdGF0dXMsIGRhdGEgfSA9IHJlcztcbiAgICAgICAgICAgICAgICBpZiAoIHN0YXR1cyAhPT0gMjAwICkgeyByZXR1cm47IH1cbiAgICAgICAgICAgICAgICBjb25zdCB0cmlwID0gZGF0YVsgMCBdO1xuICAgICAgICAgICAgICAgIGlmICggISF0cmlwICkge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCB7IF9pZCwgc3RhcnRfZGF0ZSwgZW5kX2RhdGUgfSA9IHRyaXA7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHRpZCA9IF9pZFxuXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZmV0Y2hTaG9wcGluZyggaWQsIHRpZCApO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmZldGNoVmlzaXRSZWNvcmQoIGlkLCBzdGFydF9kYXRlLCBlbmRfZGF0ZSApO1xuXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc2V0RGF0YSEoe1xuICAgICAgICAgICAgICAgICAgICAgICAgdGlkLFxuICAgICAgICAgICAgICAgICAgICAgICAgdHJpcFxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgfSxcblxuICAgIC8qKiDojrflj5bkuIrkuKrliIbkuqvkurrnmoTlpLTlg48gKi9cbiAgICBmZXRjaFNoYXJlciggKSB7XG4gICAgICAgIGNvbnN0IHsgb3BlbmlkLCBmcm9tIH0gPSB0aGlzLmRhdGE7XG4gICAgICAgIGlmICggIWZyb20gfHwgIW9wZW5pZCB8fCBmcm9tID09PSBvcGVuaWQgKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgaHR0cCh7XG4gICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgb3BlbmlkOiBmcm9tIFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHVybDogJ2NvbW1vbl9nZXQtdXNlci1pbmZvJyxcbiAgICAgICAgICAgIHN1Y2Nlc3M6IHJlcyA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3QgeyBzdGF0dXMsIGRhdGEgfSA9IHJlcztcbiAgICAgICAgICAgICAgICBpZiAoIHN0YXR1cyAhPT0gMjAwIHx8ICFkYXRhICkgeyByZXR1cm47IH1cbiAgICAgICAgICAgICAgICB0aGlzLnNldERhdGEhKHtcbiAgICAgICAgICAgICAgICAgICAgc2hhcmVGcm9tVXNlcjogZGF0YVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KVxuICAgIH0sXG5cbiAgICBpbml0Q292ZXJUZXh0KCApIHtcbiAgICAgICAgY29uc3QgbnVtID0gMTggKyBNYXRoLmNlaWwoIE1hdGgucmFuZG9tKCApICogMjApO1xuICAgICAgICB0aGlzLnNldERhdGEhKHtcbiAgICAgICAgICAgIGNvdmVyVGV4dDogYCR7bnVtfeS6uueci+i/h2BcbiAgICAgICAgfSk7XG4gICAgfSxcblxuICAgIC8qKiDliJvlu7rliIbkuqvorrDlvZUgKi9cbiAgICBjcmVhdGVTaGFyZSggKSB7XG4gICAgICAgIGNvbnN0IHsgaWQsIGNhbkludGVncmF5U2hhcmUsIGZyb20sIG9wZW5pZCB9ID0gdGhpcy5kYXRhO1xuICAgICAgICBpZiAoICFpZCB8fCAhY2FuSW50ZWdyYXlTaGFyZSB8fCAhZnJvbSB8fCAhb3BlbmlkICkgeyByZXR1cm47IH1cbiAgICAgICAgaHR0cCh7XG4gICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgZnJvbSxcbiAgICAgICAgICAgICAgICBwaWQ6IGlkLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHVybDogJ2NvbW1vbl9jcmVhdGUtc2hhcmUnXG4gICAgICAgIH0pO1xuICAgIH0sXG5cbiAgICAvLyDlsZXlvIDmi7zlm6Lnjqnms5Xmj5DnpLpcbiAgICB0b2dnbGVQYWx5VGlwcyggZT8gKSB7XG4gICAgICAgIGNvbnN0IHsgc2hvd1BsYXlUaXBzIH0gPSB0aGlzLmRhdGE7XG4gICAgICAgIHRoaXMuc2V0RGF0YSEoe1xuICAgICAgICAgICAgc2hvd1BsYXlUaXBzOiBzaG93UGxheVRpcHMgPT09ICdzaG93JyA/ICdoaWRlJyA6ICdzaG93J1xuICAgICAgICB9KTtcbiAgICB9LFxuXG4gICAgLy8g6I635Y+W5o6I5p2D44CB5YWz6Zet5ou85Zui546p5rOV5o+Q56S6XG4gICAgZ2V0VXNlckF1dGgoICkge1xuICAgICAgICBhcHAuZ2V0V3hVc2VySW5mbygoICkgPT4ge1xuICAgICAgICAgICAgdGhpcy5zZXREYXRhISh7XG4gICAgICAgICAgICAgICAgc2hvd1BsYXlUaXBzOiAnaGlkZSdcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9LFxuXG4gICAgLy8g5bGV56S65o6o5bm/56ev5YiG6KeE5YiZXG4gICAgdG9nZ2xlU2hhcmVHZXRNb25leSggKSB7XG4gICAgICAgIGNvbnN0IHsgc2hvd1NoYXJlR2V0TW9uZXkgfSA9IHRoaXMuZGF0YTtcbiAgICAgICAgdGhpcy5zZXREYXRhISh7XG4gICAgICAgICAgICBzaG93U2hhcmVHZXRNb25leTogIXNob3dTaGFyZUdldE1vbmV5XG4gICAgICAgIH0pO1xuICAgICAgICBpZiAoICFzaG93U2hhcmVHZXRNb25leSApIHtcbiAgICAgICAgICAgIHRoaXMub25TdWJzY3JpYmUoICk7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgLy8g5bGV56S65ou85Zui5YiX6KGoXG4gICAgdG9nZ2xlUGluR29vZHMoICkge1xuICAgICAgICBjb25zdCB7IHNob3dQaW5Hb29kcyB9ID0gdGhpcy5kYXRhO1xuICAgICAgICB0aGlzLnNldERhdGEhKHtcbiAgICAgICAgICAgIHNob3dQaW5Hb29kczogc2hvd1Bpbkdvb2RzID09PSAnaGlkZScgPyAnc2hvdycgOiAnaGlkZSdcbiAgICAgICAgfSk7XG4gICAgICAgIGlmICggc2hvd1Bpbkdvb2RzID09PSAnaGlkZScgKSB7XG4gICAgICAgICAgICB0aGlzLm9uU3Vic2NyaWJlKCApO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIG9uU3Vic2NyaWJlKCApIHtcbiAgICAgICAgYXBwLmdldFN1YnNjcmliZSgnYnV5UGluLHdhaXRQaW4sdHJpcCcpO1xuICAgIH0sXG5cbiAgICAvLyDov5vlhaXllYblk4HnrqHnkIZcbiAgICBnb01hbmFnZXIoICkge1xuICAgICAgICBuYXZUbyhgL3BhZ2VzL21hbmFnZXItZ29vZHMtZGV0YWlsL2luZGV4P2lkPSR7dGhpcy5kYXRhLmlkfWApO1xuICAgIH0sXG5cbiAgICAvLyDov5vlhaXmi7zlm6Llub/lnLpcbiAgICBnb0dyb3VuZCggKSB7XG4gICAgICAgIG5hdlRvKCcvcGFnZXMvZ3JvdW5kLXBpbi9pbmRleCcpXG4gICAgfSxcbiAgICBcbiAgICAvLyDov5vlhaXllYblk4Hor6bmg4VcbiAgICBnb0dvb2REZXRhaWwoeyBjdXJyZW50VGFyZ2V0IH0pIHtcbiAgICAgICAgY29uc3QgeyBwaWQgfSA9IGN1cnJlbnRUYXJnZXQuZGF0YXNldDtcbiAgICAgICAgbmF2VG8oYC9wYWdlcy9nb29kcy1kZXRhaWwvaW5kZXg/aWQ9JHtwaWR9YClcbiAgICB9LFxuXG4gICAgLyoqIOmihOiniOWbvueJhyAqL1xuICAgIHByZXZpZXdJbWcoeyBjdXJyZW50VGFyZ2V0IH0pIHtcbiAgICAgICAgY29uc3QgeyBpbWcgfSA9IGN1cnJlbnRUYXJnZXQuZGF0YXNldDtcbiAgICAgICAgdGhpcy5kYXRhLmRldGFpbCAmJiB3eC5wcmV2aWV3SW1hZ2Uoe1xuICAgICAgICAgICAgY3VycmVudDogaW1nLFxuICAgICAgICAgICAgdXJsczogWyAuLi4odGhpcy5kYXRhIGFzIGFueSkuZGV0YWlsLmltZyBdLFxuICAgICAgICB9KTtcbiAgICB9LFxuXG4gICAgLyoqIOmihOiniOWNleW8oOWbvueJh++8muaLvOWbouWbvueJh+OAgeS4gOWPo+S7t++8iOmZkOaXtuaKou+8iSAqL1xuICAgIHByZXZpZXdTaW5nbGVJbWcoeyBjdXJyZW50VGFyZ2V0IH0pIHtcblxuICAgICAgICBjb25zdCBpbWcgPSBjdXJyZW50VGFyZ2V0LmRhdGFzZXQuZGF0YSA/XG4gICAgICAgICAgICBjdXJyZW50VGFyZ2V0LmRhdGFzZXQuZGF0YS5pbWc6XG4gICAgICAgICAgICBjdXJyZW50VGFyZ2V0LmRhdGFzZXQuaW1nO1xuXG4gICAgICAgIHRoaXMuZGF0YS5kZXRhaWwgJiYgd3gucHJldmlld0ltYWdlKHtcbiAgICAgICAgICAgIGN1cnJlbnQ6IGltZyxcbiAgICAgICAgICAgIHVybHM6IFsgaW1nIF0sXG4gICAgICAgIH0pO1xuICAgIH0sXG5cbiAgICAvKiog5qOA5p+l5piv5ZCm5pyJ5Li75Yqo5by55byA6L+H5ou85Zui546p5rOVICovXG4gICAgY2hlY2tPcGVuUGluKCApIHtcbiAgICAgICAgY29uc3QgeyBkZXRhaWwgfSA9IHRoaXMuZGF0YTtcbiAgICAgICAgaWYgKCAhZGV0YWlsICkgeyByZXR1cm4gfVxuICAgICAgICBjb25zdCByZXN1bHQgPSBkZWxheWVyaW5nR29vZCggZGV0YWlsICk7XG4gICAgICAgIGlmICggcmVzdWx0ICkge1xuICAgICAgICAgICAgY29uc3Qgb25lRGF5ID0gMjQgKiA2MCAqIDYwICogMTAwMDtcbiAgICAgICAgICAgIGNvbnN0IHByaWNlR2FwID0gU3RyaW5nKCByZXN1bHQuZ29vZFBpbnMuZWFjaFByaWNlUm91bmQgKS5yZXBsYWNlKC9cXC4wMC9nLCAnJyk7XG4gICAgICAgICAgICBjb25zdCBvcGVuUmVjb3JkID0gd3guZ2V0U3RvcmFnZVN5bmMoIHN0b3JhZ2VLZXkgKTtcblxuICAgICAgICAgICAgaWYgKCAhIXByaWNlR2FwICYmIERhdGUubm93KCApIC0gTnVtYmVyKCBvcGVuUmVjb3JkICkgPj0gb25lRGF5ICkge1xuICAgICAgICAgICAgICAgIHd4LnNldFN0b3JhZ2VTeW5jKCBzdG9yYWdlS2V5LCBTdHJpbmcoIERhdGUubm93KCApKSk7XG4gICAgICAgICAgICAgICAgdGhpcy50b2dnbGVQYWx5VGlwcyggKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICAvKiog6K6+572u4oCc5Zac5qyi4oCdICovXG4gICAgb25MaWtlKCApIHtcbiAgICAgICAgY29uc3QgdGhhdCA9IHRoaXM7XG4gICAgICAgIGlmICggIXRoaXMuZGF0YS5oYXNJbml0TGlrZSApIHsgcmV0dXJuOyB9XG4gICAgICAgIGh0dHAoe1xuICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgIHBpZDogdGhpcy5kYXRhLmlkXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgdXJsOiAnbGlrZV9jcmVhdGUnLFxuICAgICAgICAgICAgc3VjY2VzczogICggcmVzOiBhbnkgKSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKCByZXMuc3RhdHVzID09PSAyMDAgKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc2V0RGF0YSEoe1xuICAgICAgICAgICAgICAgICAgICAgICAgbGlrZWQ6ICF0aGlzLmRhdGEubGlrZWRcbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH0sXG5cbiAgICAvKiog6K6+572u4oCc5Zac5qyi4oCdICovXG4gICAgY2hlY2tMaWtlKCApIHtcbiAgICAgICAgY29uc3QgdGhhdCA9IHRoaXM7XG4gICAgICAgIGh0dHAoe1xuICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgIHBpZDogdGhpcy5kYXRhLmlkXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgdXJsOiAnbGlrZV9jaGVjaycsXG4gICAgICAgICAgICBzdWNjZXNzOiAgKCByZXM6IGFueSApID0+IHtcbiAgICAgICAgICAgICAgICBpZiAoIHJlcy5zdGF0dXMgPT09IDIwMCApIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zZXREYXRhISh7XG4gICAgICAgICAgICAgICAgICAgICAgICBsaWtlZDogcmVzLmRhdGEsXG4gICAgICAgICAgICAgICAgICAgICAgICBoYXNJbml0TGlrZTogdHJ1ZVxuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfSxcblxuICAgIC8qKiDmtbfmiqXlvIDlhbPnm5HlkKwgKi9cbiAgICBvblBvc3RUb2dnbGUoIGUgKSB7XG4gICAgICAgIGNvbnN0IHZhbCA9IGUuZGV0YWlsO1xuICAgICAgICB0aGlzLnNldERhdGEhKHtcbiAgICAgICAgICAgIHNob3dpbmdQb3N0ZXI6IHZhbFxuICAgICAgICB9KTtcbiAgICAgICAgd3guc2V0TmF2aWdhdGlvbkJhclRpdGxlKHtcbiAgICAgICAgICAgIHRpdGxlOiB2YWwgPyAn5YiG5Lqr5ZWG5ZOBJyA6ICfllYblk4Hor6bmg4UnXG4gICAgICAgIH0pO1xuICAgIH0sXG5cbiAgICAvKiog5rW35oqlLS3lvIAgKi9cbiAgICBvcGVuUG9zdGVyKCApIHtcbiAgICAgICAgY29uc3QgeyBzaG93aW5nUG9zdGVyIH0gPSB0aGlzLmRhdGE7XG4gICAgICAgIGNvbnN0IHBvc3RlciA9ICh0aGlzIGFzIGFueSkuc2VsZWN0Q29tcG9uZW50KCcjcG9zdGVyJyk7XG4gICAgICAgIHBvc3Rlci50b2dnbGUoICk7XG4gICAgICAgIGlmICggIXNob3dpbmdQb3N0ZXIgKSB7XG4gICAgICAgICAgICB0aGlzLm9uU3Vic2NyaWJlKCApO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIC8qKiDmtbfmiqUtLeWFsyAqL1xuICAgIGNsb3NlUG9zdGVyKCApIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGNvbnN0IHBvc3RlciA9ICh0aGlzIGFzIGFueSkuc2VsZWN0Q29tcG9uZW50KCcjcG9zdGVyJyk7XG4gICAgICAgICAgICBwb3N0ZXIuY2xvc2UoICk7XG4gICAgICAgIH0gY2F0Y2ggKCBlICkgeyB9XG4gICAgfSxcblxuICAgIC8qKiBza3XpgInmi6nlvLnmoYYgKi9cbiAgICBvblNrdVRvZ2dsZSggZSApIHtcbiAgICAgICAgdGhpcy5zZXREYXRhISh7XG4gICAgICAgICAgICBvcGVuaW5nU2t1OiBlLmRldGFpbFxuICAgICAgICB9KTtcbiAgICB9LFxuXG4gICAgLyoqIHNrdeafkOmDqOWIhueCueWHuyAqL1xuICAgIG9uU2t1VGFwKCBlICkge1xuICAgICAgICBjb25zdCB0eXBlID0gZS5kZXRhaWw7XG4gICAgICAgIGlmICggdHlwZSA9PT0gJ21vbmV5UXVlc3Rpb24nICkge1xuICAgICAgICAgICAgdGhpcy50b2dnbGVTaGFyZUdldE1vbmV5KCApO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIC8qKiDlsZXlvIDjgIHlhbPpl61za3XmoYYgKi9cbiAgICBvblRvZ2dsZVNrdSggKSB7XG4gICAgICAgIGNvbnN0IHsgb3BlbmluZ1NrdSB9ID0gdGhpcy5kYXRhO1xuICAgICAgICBjb25zdCBza3UgPSAodGhpcyBhcyBhbnkpLnNlbGVjdENvbXBvbmVudCgnI3NrdScpO1xuICAgICAgICBza3UudG9nZ2xlU2t1KCApO1xuICAgICAgICBpZiAoICFvcGVuaW5nU2t1ICkge1xuICAgICAgICAgICAgdGhpcy5vblN1YnNjcmliZSggKTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICAvKiog6L2s5Y+R5bCB6Z2iICovXG4gICAgb25Db3ZlckRvbmUoIGUgKSB7XG4gICAgICAgIHRoaXMuc2V0RGF0YSEoe1xuICAgICAgICAgICAgc2hhcmVDb3ZlcjogZS5kZXRhaWxcbiAgICAgICAgfSk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIOeUn+WRveWRqOacn+WHveaVsC0t55uR5ZCs6aG16Z2i5Yqg6L29XG4gICAgICoge1xuICAgICAqICAgIGlkIHx8IHNjZW5lIC8vIOWVhuWTgWlkXG4gICAgICogICAgdGlkIC8vIOihjOeoi2lkXG4gICAgICogICAgZnJvbSAvLyDliIbkuqvkurrnmoRpZFxuICAgICAqIH1cbiAgICAgKi9cbiAgICBvbkxvYWQ6IGZ1bmN0aW9uIChvcHRpb25zKSB7XG5cbiAgICAgICAgY29uc3Qgc2NlbmUgPSBkZWNvZGVVUklDb21wb25lbnQoIG9wdGlvbnMhLnNjZW5lIHx8ICcnIClcbiAgICAgICAgY29uc3QgaWQgPSBvcHRpb25zIS5pZCB8fCBzY2VuZSB8fCAnZWUzMDk5Mjg1Y2RiZjM4ZjEyODY5YjEzMzYzYmMyMDYnO1xuXG4gICAgICAgIHRoaXMucnVuQ29tcHV0ZWQoICk7XG4gICAgICAgIHRoaXMuaW5pdENvdmVyVGV4dCggKTtcblxuICAgICAgICBpZiAoICEhaWQgKSB7IFxuICAgICAgICAgICAgdGhpcy5zZXREYXRhISh7XG4gICAgICAgICAgICAgICAgaWRcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCAhIShvcHRpb25zIGFzIGFueSkuZnJvbSApIHtcbiAgICAgICAgICAgIHRoaXMuc2V0RGF0YSEoe1xuICAgICAgICAgICAgICAgIGZyb206IG9wdGlvbnMhLmZyb21cbiAgICAgICAgICAgIH0pXG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgIHNldFRpbWVvdXQoKCApID0+IHtcbiAgICAgICAgICAgIHRoaXMud2F0Y2hSb2xlKCApO1xuICAgICAgICAgICAgdGhpcy5mZXRjaExhc3QoICk7XG4gICAgICAgICAgICB0aGlzLmZldERldGFpbCggaWQgKTtcbiAgICAgICAgfSwgMjAgKTtcbiAgICB9LFxuICBcbiAgICAvKipcbiAgICAgKiDnlJ/lkb3lkajmnJ/lh73mlbAtLeebkeWQrOmhtemdouWIneasoea4suafk+WujOaIkFxuICAgICAqL1xuICAgIG9uUmVhZHk6IGZ1bmN0aW9uICggKSB7XG4gICAgICAgIGxldCBjaXJjbGVDb3VudCA9IDA7IFxuICAgICAgICBjb25zdCB0aGF0OiBhbnkgPSB0aGlzO1xuICAgICAgICAvLyDlv4Pot7PnmoTlpJbmoYbliqjnlLsgXG4gICAgICAgIHRoYXQuYW5pbWF0aW9uTWlkZGxlSGVhZGVySXRlbSA9IHd4LmNyZWF0ZUFuaW1hdGlvbih7IFxuICAgICAgICAgICAgZHVyYXRpb246IDgwMCwgXG4gICAgICAgICAgICB0aW1pbmdGdW5jdGlvbjogJ2Vhc2UnLCBcbiAgICAgICAgICAgIHRyYW5zZm9ybU9yaWdpbjogJzUwJSA1MCUnLFxuICAgICAgICB9KTsgXG4gICAgICAgIHNldEludGVydmFsKCBmdW5jdGlvbiggKSB7IFxuICAgICAgICAgICAgaWYgKGNpcmNsZUNvdW50ICUgMiA9PSAwKSB7IFxuICAgICAgICAgICAgICAgIHRoYXQuYW5pbWF0aW9uTWlkZGxlSGVhZGVySXRlbS5zY2FsZSggMS4wICkucm90YXRlKCAxMCApLnN0ZXAoICk7IFxuICAgICAgICAgICAgfSBlbHNlIHsgXG4gICAgICAgICAgICAgICAgdGhhdC5hbmltYXRpb25NaWRkbGVIZWFkZXJJdGVtLnNjYWxlKCAxLjAgKS5yb3RhdGUoIC0zMCApLnN0ZXAoICk7IFxuICAgICAgICAgICAgfSBcbiAgICAgICAgICAgIHRoYXQuc2V0RGF0YSh7IFxuICAgICAgICAgICAgICAgIGFuaW1hdGlvbk1pZGRsZUhlYWRlckl0ZW06IHRoYXQuYW5pbWF0aW9uTWlkZGxlSGVhZGVySXRlbS5leHBvcnQoICkgXG4gICAgICAgICAgICB9KTsgXG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGlmICggKytjaXJjbGVDb3VudCA9PT0gMTAwMCApIHsgXG4gICAgICAgICAgICAgICAgY2lyY2xlQ291bnQgPSAwOyBcbiAgICAgICAgICAgIH0gXG4gICAgICAgIH0uYmluZCggdGhpcyApLCAxMDAwICk7IFxuICAgIH0sXG4gIFxuICAgIC8qKlxuICAgICAqIOeUn+WRveWRqOacn+WHveaVsC0t55uR5ZCs6aG16Z2i5pi+56S6XG4gICAgICovXG4gICAgb25TaG93OiBmdW5jdGlvbiAoICkge1xuICAgICAgICBjb25zdCB7IGlkLCB0aWQsIHRyaXAgfSA9IHRoaXMuZGF0YTtcbiAgICAgICAgXG4gICAgICAgIHRoaXMuZmV0Y2hTaG9wcGluZyggaWQsIHRpZCApO1xuICAgICAgICBpZiAoICEhdHJpcCApIHtcbiAgICAgICAgICAgIGNvbnN0IHsgc3RhcnRfZGF0ZSwgZW5kX2RhdGUgfSA9ICh0cmlwIGFzIGFueSk7XG4gICAgICAgICAgICB0aGlzLmZldGNoVmlzaXRSZWNvcmQoIGlkLCBzdGFydF9kYXRlLCBlbmRfZGF0ZSApO1xuICAgICAgICB9XG5cbiAgICB9LFxuICBcbiAgICAvKipcbiAgICAgKiDnlJ/lkb3lkajmnJ/lh73mlbAtLeebkeWQrOmhtemdoumakOiXj1xuICAgICAqL1xuICAgIG9uSGlkZTogZnVuY3Rpb24gKCkge1xuICBcbiAgICB9LFxuICBcbiAgICAvKipcbiAgICAgKiDnlJ/lkb3lkajmnJ/lh73mlbAtLeebkeWQrOmhtemdouWNuOi9vVxuICAgICAqL1xuICAgIG9uVW5sb2FkOiBmdW5jdGlvbiAoKSB7XG4gIFxuICAgIH0sXG4gIFxuICAgIC8qKlxuICAgICAqIOmhtemdouebuOWFs+S6i+S7tuWkhOeQhuWHveaVsC0t55uR5ZCs55So5oi35LiL5ouJ5Yqo5L2cXG4gICAgICovXG4gICAgb25QdWxsRG93blJlZnJlc2g6IGZ1bmN0aW9uICgpIHtcbiAgXG4gICAgfSxcbiAgXG4gICAgLyoqXG4gICAgICog6aG16Z2i5LiK5ouJ6Kem5bqV5LqL5Lu255qE5aSE55CG5Ye95pWwXG4gICAgICovXG4gICAgb25SZWFjaEJvdHRvbTogZnVuY3Rpb24gKCkge1xuICBcbiAgICB9LFxuICBcbiAgICAvKipcbiAgICAgKiDnlKjmiLfngrnlh7vlj7PkuIrop5LliIbkuqtcbiAgICAgKi9cbiAgICBvblNoYXJlQXBwTWVzc2FnZTogZnVuY3Rpb24gKCBlICkge1xuICAgICAgICBjb25zdCB7IGhhc09yZGVyJCwgZGV0YWlsJCwgb3BlbmlkLCBzaGFyZUNvdmVyIH0gPSAodGhpcy5kYXRhIGFzIGFueSk7XG5cbiAgICAgICAgdGhpcy5jbG9zZVBvc3RlciggKTtcbiAgICAgICAgc2V0VGltZW91dCgoICkgPT4ge1xuICAgICAgICAgICAgY29uc3Qgc2hhcmVGZWRiYWNrID0gKHRoaXMgYXMgYW55KS5zZWxlY3RDb21wb25lbnQoJyNzaGFyZS1mZWVkYmFjaycpO1xuICAgICAgICAgICAgc2hhcmVGZWRiYWNrLnRvZ2dsZSggKTtcbiAgICAgICAgfSwgNTAwICk7XG5cbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGltYWdlVXJsOiBzaGFyZUNvdmVyIHx8IGAke2RldGFpbCQuaW1nWyAwIF19YCxcbiAgICAgICAgICAgIHBhdGg6IGAvcGFnZXMvZ29vZHMtZGV0YWlsL2luZGV4P2lkPSR7ZGV0YWlsJC5faWR9JmZyb209JHtvcGVuaWR9YCxcbiAgICAgICAgICAgIHRpdGxlOiAhIWRldGFpbCQgJiYgZGV0YWlsJC5oYXNQaW4gJiYgIWhhc09yZGVyJCA/XG4gICAgICAgICAgICAgICAgYOacieS6uuaDs+imgeWQl++8n+aLvOWbouS5sO+8jOaIkeS7rOmDveiDveecge+8gSR7ZGV0YWlsJC50aXRsZX0gJHtkZXRhaWwkLnRhZ1RleHR9YCA6XG4gICAgICAgICAgICAgICAgYOaOqOiNkOOAjCR7ZGV0YWlsJC50YWdUZXh0feOAjeelnuWZqCEke2RldGFpbCQudGl0bGV9YFxuICAgICAgICB9XG4gICAgfVxuICB9KSJdfQ==