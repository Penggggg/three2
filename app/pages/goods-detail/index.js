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
                    "\u7FA4\u53CB\u4E5F\u5728\u770B",
                    "\u7FA4\u53CB\u5728\u5173\u6CE8\u300C" + good.tagText + "\u300D",
                    "\u7FA4\u53CB\u611F\u5174\u8DA3\uFF0C\u8DDF\u5979\u62FC\u56E2"
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
        var id = options.id || scene || '1a2751ef5cab50440283e59a10d24bec';
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7O0FBQ0EsOENBQTBDO0FBQzFDLHFEQUFvRDtBQUNwRCxnREFBcUQ7QUFDckQsZ0RBQTRDO0FBRTVDLElBQU0sR0FBRyxHQUFHLE1BQU0sRUFBUSxDQUFDO0FBRzNCLElBQU0sVUFBVSxHQUFHLG9CQUFvQixDQUFDO0FBRXhDLElBQUksQ0FBQztJQUdELHlCQUF5QixFQUFFLElBQUk7SUFLL0IsSUFBSSxFQUFFO1FBRUYsVUFBVSxFQUFFLElBQUk7UUFHaEIsTUFBTSxFQUFFLEVBQUU7UUFHVixRQUFRLEVBQUUsRUFBRTtRQUdaLEtBQUssRUFBRSxJQUFJO1FBR1gsR0FBRyxFQUFFLEVBQUU7UUFHUCxFQUFFLEVBQUUsRUFBRTtRQUdOLE1BQU0sRUFBRSxJQUFJO1FBR1osR0FBRyxFQUFFLEVBQUc7UUFHUixPQUFPLEVBQUUsSUFBSTtRQUdiLFdBQVcsRUFBRSxLQUFLO1FBR2xCLEtBQUssRUFBRSxLQUFLO1FBR1osV0FBVyxFQUFFO1lBQ1QsTUFBTSxFQUFFLE1BQU0sRUFBRSxNQUFNO1NBQ3pCO1FBR0QseUJBQXlCLEVBQUUsSUFBSTtRQUcvQixVQUFVLEVBQUUsS0FBSztRQUdqQixhQUFhLEVBQUUsS0FBSztRQUdwQixZQUFZLEVBQUUsTUFBTTtRQUdwQixpQkFBaUIsRUFBRSxLQUFLO1FBR3hCLFlBQVksRUFBRSxNQUFNO1FBR3BCLGNBQWMsRUFBRSxLQUFLO1FBR3JCLEdBQUcsRUFBRSxFQUFHO1FBR1IsUUFBUSxFQUFFLEVBQUc7UUFHYixVQUFVLEVBQUUsRUFBRztRQUdmLFNBQVMsRUFBRSxFQUFHO1FBR2QsSUFBSSxFQUFFLElBQUk7UUFHVixnQkFBZ0IsRUFBRSxLQUFLO1FBR3ZCLE1BQU0sRUFBRSxFQUFFO1FBR1YsSUFBSSxFQUFFLEVBQUU7UUFHUixnQkFBZ0IsRUFBRSxDQUFDO1FBR25CLFVBQVUsRUFBRSxLQUFLO1FBR2pCLFFBQVEsRUFBRSxFQUFHO1FBR2IsYUFBYSxFQUFFLEVBQUc7UUFHbEIsVUFBVSxFQUFFLEVBQUU7UUFHZCxTQUFTLEVBQUUsT0FBTztLQUNyQjtJQUdELFdBQVc7UUFDUCxtQkFBUSxDQUFFLElBQUksRUFBRTtZQUdaLEtBQUssRUFBRTtnQkFDSyxJQUFBLHlCQUFNLENBQWU7Z0JBQzdCLElBQU0sTUFBTSxHQUFHLHlCQUFjLENBQUUsTUFBTSxDQUFFLENBQUM7Z0JBQ3hDLE9BQU8sTUFBTSxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUM7WUFDdkMsQ0FBQztZQUdELFdBQVcsRUFBRTtnQkFDRCxJQUFBLHlCQUFNLENBQWU7Z0JBQzdCLElBQUssQ0FBQyxNQUFNLElBQUksQ0FBRSxDQUFDLENBQUMsTUFBTSxJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBRSxFQUFFO29CQUM1QyxPQUFPLEVBQUcsQ0FBQztpQkFDZDtxQkFBTTtvQkFDSCxPQUFPLE1BQU0sQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLE1BQU0sQ0FBRSxVQUFBLENBQUMsSUFBSSxPQUFBLENBQUMsQ0FBQyxDQUFDLEVBQUgsQ0FBRyxDQUFFLENBQUM7aUJBQ3ZEO1lBQ0wsQ0FBQztZQUdELFFBQVEsRUFBRTtnQkFDRSxJQUFBLHlCQUFNLENBQWU7Z0JBQzdCLElBQUssQ0FBQyxNQUFNLEVBQUc7b0JBQ1gsT0FBTyxFQUFFLENBQUE7aUJBQ1o7cUJBQU07b0JBQ0gsSUFBTSxNQUFNLEdBQUcseUJBQWMsQ0FBRSxNQUFNLENBQUUsQ0FBQztvQkFDeEMsSUFBTSxHQUFHLEdBQUcsTUFBTSxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUUsTUFBTSxDQUFDLFFBQVEsQ0FBQyxjQUFjLENBQUUsQ0FBQyxPQUFPLENBQUMsT0FBTyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUM7b0JBQ3hGLElBQU0sSUFBSSxHQUFHLEdBQUcsS0FBSyxHQUFHLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUM7b0JBQzdDLE9BQU8sSUFBSSxDQUFDO2lCQUNmO1lBQ0wsQ0FBQztZQUdELFNBQVMsRUFBRTtnQkFDRCxJQUFBLGNBQTBCLEVBQXhCLFVBQUUsRUFBRSxrQkFBb0IsQ0FBQztnQkFDakMsSUFBTSxZQUFZLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFFLFVBQUEsQ0FBQyxJQUFJLE9BQUEsQ0FBQyxDQUFDLEdBQUcsS0FBSyxFQUFFLEVBQVosQ0FBWSxDQUFFLENBQUM7Z0JBQ3BFLElBQUssQ0FBQyxNQUFNLEVBQUc7b0JBQ1gsT0FBTyxDQUFDLENBQUM7aUJBQ1o7Z0JBRU8sSUFBQSw0QkFBUyxFQUFFLDhCQUFVLENBQVk7Z0JBRXpDLElBQUssQ0FBQyxDQUFDLFNBQVMsSUFBSSxTQUFTLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRztvQkFDdkMsT0FBTyxTQUFTO3lCQUNYLE1BQU0sQ0FBRSxVQUFBLENBQUMsSUFBSSxPQUFBLENBQUMsQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFFLFVBQUEsQ0FBQyxJQUFJLE9BQUEsQ0FBQyxDQUFDLEdBQUcsS0FBSyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxHQUFHLEtBQUssQ0FBQyxDQUFDLEdBQUcsRUFBbEMsQ0FBa0MsQ0FBRSxFQUE5RCxDQUE4RCxDQUFDO3lCQUM1RSxNQUFNLENBQUM7aUJBRWY7cUJBQU0sSUFBSyxDQUFDLENBQUMsVUFBVSxFQUFHO29CQUNmLElBQUEsa0JBQUcsQ0FBWTtvQkFDdkIsT0FBTyxDQUFDLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBRSxVQUFBLENBQUMsSUFBSSxPQUFBLENBQUMsQ0FBQyxHQUFHLEtBQUssS0FBRyxFQUFiLENBQWEsQ0FBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQTtpQkFDM0Q7Z0JBRUQsT0FBTyxDQUFDLENBQUM7WUFDYixDQUFDO1lBR0QsSUFBSSxFQUFFO2dCQUNGLElBQUksSUFBSSxHQUFRLEVBQUcsQ0FBQztnQkFDZCxJQUFBLGNBQTRDLEVBQTFDLGtCQUFNLEVBQUUsc0JBQVEsRUFBRSwwQkFBd0IsQ0FBQztnQkFFbkQsSUFBSyxDQUFDLE1BQU0sRUFBRztvQkFDWCxPQUFPLEVBQUcsQ0FBQztpQkFDZDtnQkFFTyxJQUFBLDRCQUFTLEVBQUUsOEJBQVUsQ0FBWTtnQkFFekMsSUFBSyxTQUFTLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRztvQkFDeEIsSUFBSSxHQUFHLFNBQVM7eUJBQ1gsTUFBTSxDQUFFLFVBQUEsQ0FBQyxJQUFJLE9BQUEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxVQUFVLEVBQWQsQ0FBYyxDQUFFO3lCQUM3QixHQUFHLENBQUUsVUFBQSxDQUFDO3dCQUNILE9BQU8sTUFBTSxDQUFDLE1BQU0sQ0FBQyxFQUFHLEVBQUUsQ0FBQyxFQUFFOzRCQUN6QixHQUFHLEVBQUUsQ0FBQyxDQUFDLEdBQUc7NEJBQ1YsTUFBTSxFQUFFLENBQUMsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFFLFVBQUEsQ0FBQyxJQUFJLE9BQUEsQ0FBQyxDQUFDLEdBQUcsS0FBSyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxHQUFHLEtBQUssQ0FBQyxDQUFDLEdBQUcsRUFBbEMsQ0FBa0MsQ0FBRTt5QkFDckUsQ0FBQyxDQUFBO29CQUNOLENBQUMsQ0FBQyxDQUFDO2lCQUVWO3FCQUFNLElBQUssQ0FBQyxDQUFDLFVBQVUsRUFBRztvQkFDZixJQUFBLG9CQUFLLEVBQUUsb0JBQUssRUFBRSxnQkFBRyxFQUFFLGtCQUFHLENBQVk7b0JBQzFDLElBQUksR0FBRyxDQUFDOzRCQUNKLEtBQUssT0FBQTs0QkFDTCxHQUFHLEVBQUUsS0FBRzs0QkFDUixJQUFJLEVBQUUsS0FBSzs0QkFDWCxVQUFVLFlBQUE7NEJBQ1YsR0FBRyxFQUFFLFNBQVM7NEJBQ2QsR0FBRyxFQUFFLEdBQUcsQ0FBRSxDQUFDLENBQUU7NEJBQ2IsTUFBTSxFQUFFLENBQUMsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFFLFVBQUEsQ0FBQyxJQUFJLE9BQUEsQ0FBQyxDQUFDLEdBQUcsS0FBSyxLQUFHLEVBQWIsQ0FBYSxDQUFFO3lCQUNoRCxDQUFDLENBQUM7aUJBQ047Z0JBR0QsVUFBVSxDQUFDLEdBQUcsQ0FBRSxVQUFBLEVBQUU7b0JBQ2QsSUFBSyxDQUFDLEVBQUUsQ0FBQyxhQUFhLEVBQUc7d0JBQUUsT0FBTztxQkFBRTtvQkFDcEMsSUFBTSxTQUFTLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBRSxVQUFBLENBQUMsSUFBSSxPQUFBLENBQUMsQ0FBQyxHQUFHLEtBQUssRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsR0FBRyxLQUFLLEVBQUUsQ0FBQyxHQUFHLEVBQXBDLENBQW9DLENBQUUsQ0FBQztvQkFDekUsSUFBTSxjQUFjLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBRSxVQUFBLENBQUMsSUFBSSxPQUFBLENBQUMsQ0FBQyxHQUFHLEtBQUssRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsR0FBRyxLQUFLLEVBQUUsQ0FBQyxHQUFHLEVBQXBDLENBQW9DLENBQUUsQ0FBQztvQkFHbkYsSUFBSyxjQUFjLEtBQUssQ0FBQyxDQUFDLEVBQUc7d0JBQ3pCLElBQUksQ0FBQyxNQUFNLENBQUUsY0FBYyxFQUFFLENBQUMsRUFBRSxNQUFNLENBQUMsTUFBTSxDQUFDLEVBQUcsRUFBRSxTQUFTLEVBQUU7NEJBQzFELEtBQUssRUFBRSxFQUFFLENBQUMsUUFBUTs0QkFDbEIsVUFBVSxFQUFFLEVBQUUsQ0FBQyxhQUFhO3lCQUMvQixDQUFDLENBQUMsQ0FBQztxQkFHUDt5QkFBTTt3QkFDSCxJQUFJLENBQUMsSUFBSSxDQUFDOzRCQUNOLEdBQUcsRUFBRSxFQUFFLENBQUMsR0FBRzs0QkFDWCxHQUFHLEVBQUUsRUFBRSxDQUFDLEdBQUc7NEJBQ1gsR0FBRyxFQUFFLEVBQUUsQ0FBQyxHQUFHOzRCQUNYLElBQUksRUFBRSxFQUFFLENBQUMsS0FBSzs0QkFDZCxNQUFNLEVBQUUsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUUsVUFBQSxDQUFDLElBQUksT0FBQSxDQUFDLENBQUMsR0FBRyxLQUFLLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLEdBQUcsS0FBSyxFQUFFLENBQUMsR0FBRyxFQUFwQyxDQUFvQyxDQUFFOzRCQUNwRSxLQUFLLEVBQUUsRUFBRSxDQUFDLFFBQVE7NEJBQ2xCLFVBQVUsRUFBRSxFQUFFLENBQUMsYUFBYTt5QkFDL0IsQ0FBQyxDQUFBO3FCQUNMO2dCQUNMLENBQUMsQ0FBQyxDQUFDO2dCQUVILElBQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUUsVUFBQSxDQUFDLElBQUksT0FBQSxNQUFNLENBQUMsTUFBTSxDQUFDLEVBQUcsRUFBRSxDQUFDLEVBQUU7b0JBQy9DLEtBQUssRUFBRSxNQUFNLENBQUUsQ0FBQyxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUMsVUFBVSxDQUFFLENBQUMsT0FBTyxDQUFFLENBQUMsQ0FBRTtpQkFDdkQsQ0FBQyxFQUYyQixDQUUzQixDQUFDLENBQUM7Z0JBRUosT0FBTyxLQUFLLENBQUM7WUFDakIsQ0FBQztZQUdELFNBQVMsRUFBRTtnQkFDRCxJQUFBLGNBQXdDLEVBQXRDLGtCQUFNLEVBQUUsc0NBQThCLENBQUM7Z0JBQy9DLElBQUssQ0FBQyxNQUFNLEVBQUc7b0JBQ1gsT0FBTyxFQUFFLENBQUM7aUJBQ2I7Z0JBQ0QsSUFBTSxNQUFNLEdBQUcseUJBQWMsQ0FBRSxNQUFNLEVBQUUsZ0JBQWdCLENBQUUsQ0FBQztnQkFDMUQsT0FBTyxNQUFNLENBQUMsU0FBUyxDQUFDO1lBQzVCLENBQUM7WUFHRCxPQUFPLEVBQUU7Z0JBQ0csSUFBQSx5QkFBTSxDQUFlO2dCQUM3QixJQUFNLENBQUMsR0FBRyx5QkFBYyxDQUFFLE1BQU0sQ0FBRSxDQUFDO2dCQUNuQyxPQUFPLENBQUMsQ0FBQztZQUNiLENBQUM7WUFHRCxTQUFTO2dCQUNDLElBQUEsY0FBd0MsRUFBdEMsa0JBQU0sRUFBRSxzQ0FBOEIsQ0FBQztnQkFDL0MsSUFBTSxDQUFDLEdBQUcsQ0FBQyxnQkFBZ0IsSUFBSSxFQUFHLENBQUM7cUJBQzlCLE1BQU0sQ0FBRSxVQUFBLEVBQUU7b0JBQ0MsSUFBQSxjQUFJLENBQVE7b0JBQ3BCLE9BQU8sSUFBSSxDQUFDLFFBQVEsQ0FBRSxNQUFNLENBQUUsQ0FBQztnQkFDbkMsQ0FBQyxDQUFDLENBQUE7Z0JBRU4sSUFBTSxNQUFNLEdBQUcsS0FBSyxDQUFDLE9BQU8sQ0FBRSxnQkFBZ0IsQ0FBRSxJQUFJLGdCQUFnQixDQUFDLE1BQU0sR0FBRyxDQUFDO29CQUMzRSxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQztnQkFDM0IsT0FBTyxNQUFNLENBQUM7WUFDbEIsQ0FBQztZQUdELFNBQVM7Z0JBQ0MsSUFBQSxjQUFnQyxFQUE5QixzQkFBUSxFQUFFLGtCQUFvQixDQUFDO2dCQUN2QyxPQUFPLFFBQVEsQ0FBQyxNQUFNLENBQUUsVUFBQSxDQUFDLElBQUksT0FBQSxDQUFDLENBQUMsTUFBTSxLQUFLLE1BQU0sRUFBbkIsQ0FBbUIsQ0FBRSxDQUFDO1lBQ3ZELENBQUM7WUFHRCxPQUFPO2dCQUNHLElBQUEsY0FBd0MsRUFBdEMsc0JBQVEsRUFBRSxrQkFBTSxFQUFFLGtCQUFvQixDQUFDO2dCQUMvQyxJQUFNLElBQUksR0FBRyx5QkFBYyxDQUFFLE1BQU0sQ0FBRSxDQUFDO2dCQUN0QyxJQUFNLFNBQVMsR0FBRyxVQUFBLENBQUMsSUFBSSxPQUFBLElBQUksQ0FBQyxLQUFLLENBQUUsSUFBSSxDQUFDLE1BQU0sRUFBRyxHQUFHLENBQUMsQ0FBRSxFQUFoQyxDQUFnQyxDQUFDO2dCQUV4RCxJQUFNLFFBQVEsR0FBRztvQkFDYixnQ0FBTztvQkFDUCx5Q0FBUyxJQUFJLENBQUMsT0FBTyxXQUFHO29CQUN4Qiw4REFBWTtpQkFDZixDQUFDO2dCQUdGLElBQU0sV0FBVyxHQUFHLFFBQVE7cUJBQ3ZCLE1BQU0sQ0FBRSxVQUFBLENBQUMsSUFBSSxPQUFBLENBQUMsQ0FBQyxNQUFNLEtBQUssTUFBTSxFQUFuQixDQUFtQixDQUFFO3FCQUNsQyxHQUFHLENBQUUsVUFBQSxDQUFDO29CQUNILElBQU0sU0FBUyxHQUFHLFNBQVMsQ0FBRSxRQUFRLENBQUMsTUFBTSxDQUFFLENBQUM7b0JBQy9DLE9BQU87d0JBQ0gsTUFBTSxFQUFFLENBQUMsQ0FBQyxTQUFTO3dCQUNuQixJQUFJLEVBQUUsUUFBUSxDQUFFLFNBQVMsQ0FBRTtxQkFDOUIsQ0FBQTtnQkFDTCxDQUFDLENBQUMsQ0FBQTtnQkFDTixPQUFPLFdBQVcsQ0FBQztZQUV2QixDQUFDO1lBR0QsU0FBUztnQkFDQyxJQUFBLGNBQTRCLEVBQTFCLHNCQUFRLEVBQUUsVUFBZ0IsQ0FBQztnQkFDbkMsT0FBTyxRQUFRO3FCQUNWLE1BQU0sQ0FBRSxVQUFBLENBQUMsSUFBSSxPQUFBLENBQUMsQ0FBQyxHQUFHLEtBQUssRUFBRSxFQUFaLENBQVksQ0FBRTtxQkFDM0IsR0FBRyxDQUFFLFVBQUEsRUFBRTtvQkFDSSxJQUFBLGdCQUFLLEVBQUUsWUFBRyxFQUFFLGtCQUFNLENBQVE7b0JBQzFCLElBQUEsa0JBQUksQ0FBWTtvQkFDeEIsb0JBQ08sRUFBRSxJQUNMLElBQUksTUFBQSxFQUNKLFNBQVMsRUFBRSxLQUFLLENBQUUsQ0FBQyxDQUFFLEVBQ3JCLFNBQVMsRUFBRSxLQUFLLENBQUMsS0FBSyxDQUFFLENBQUMsQ0FBRSxJQUM5QjtnQkFDTCxDQUFDLENBQUMsQ0FBQTtZQUNWLENBQUM7WUFHRCxjQUFjO2dCQUNKLElBQUEsY0FBNEIsRUFBMUIsc0JBQVEsRUFBRSxVQUFnQixDQUFDO2dCQUNuQyxPQUFPLFFBQVE7cUJBQ1YsTUFBTSxDQUFFLFVBQUEsQ0FBQyxJQUFJLE9BQUEsQ0FBQyxDQUFDLEdBQUcsS0FBSyxFQUFFLEVBQVosQ0FBWSxDQUFFO3FCQUMzQixHQUFHLENBQUUsVUFBQSxFQUFFO29CQUNJLElBQUEsZ0JBQUssRUFBRSxZQUFHLEVBQUUsa0JBQU0sQ0FBUTtvQkFDMUIsSUFBQSxrQkFBSSxDQUFZO29CQUN4QixvQkFDTyxFQUFFLElBQ0wsSUFBSSxNQUFBLEVBQ0osU0FBUyxFQUFFLEtBQUssQ0FBRSxDQUFDLENBQUUsRUFDckIsU0FBUyxFQUFFLEtBQUssQ0FBQyxLQUFLLENBQUUsQ0FBQyxDQUFFLElBQzlCO2dCQUNMLENBQUMsQ0FBQyxDQUFBO1lBQ1YsQ0FBQztZQUdELGNBQWM7Z0JBQ0osSUFBQSxjQUE0QixFQUExQixVQUFFLEVBQUUsc0JBQXNCLENBQUM7Z0JBQ25DLElBQU0sWUFBWSxHQUFHLFFBQVEsQ0FBQyxNQUFNLENBQUUsVUFBQSxDQUFDLElBQUksT0FBQSxDQUFDLENBQUMsR0FBRyxLQUFLLEVBQUUsRUFBWixDQUFZLENBQUUsQ0FBQztnQkFDMUQsT0FBTyxZQUFZLENBQUMsTUFBTSxDQUFDLFVBQUUsQ0FBQyxFQUFFLEVBQUU7b0JBQzlCLE9BQU8sQ0FBQyxHQUFHLEVBQUUsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDO2dCQUM5QixDQUFDLEVBQUUsQ0FBQyxDQUFFLENBQUM7WUFDWCxDQUFDO1lBS0QsZUFBZTtnQkFDWCxJQUFNLEdBQUcsR0FBRyxJQUFJLElBQUksRUFBRyxDQUFDO2dCQUN4QixJQUFNLENBQUMsR0FBRyxHQUFHLENBQUMsV0FBVyxFQUFHLENBQUM7Z0JBQzdCLElBQU0sQ0FBQyxHQUFHLEdBQUcsQ0FBQyxRQUFRLEVBQUcsR0FBRyxDQUFDLENBQUM7Z0JBQzlCLElBQU0sQ0FBQyxHQUFHLEdBQUcsQ0FBQyxPQUFPLEVBQUcsQ0FBQztnQkFDekIsSUFBTSxRQUFRLEdBQUcsSUFBSSxJQUFJLENBQUksQ0FBQyxTQUFJLENBQUMsU0FBSSxDQUFDLGNBQVcsQ0FBQyxDQUFDO2dCQUNyRCxJQUFNLFdBQVcsR0FBRyxRQUFRLENBQUMsT0FBTyxFQUFHLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsSUFBSSxDQUFDO2dCQUM5RCxPQUFPLENBQUMsQ0FBRSxXQUFXLEdBQUcsSUFBSSxDQUFDLEdBQUcsRUFBRyxDQUFDLEdBQUcsSUFBSSxDQUFFLENBQUMsT0FBTyxDQUFFLENBQUMsQ0FBRSxDQUFDO1lBQy9ELENBQUM7U0FFSixDQUFDLENBQUE7SUFDTixDQUFDO0lBR0QsU0FBUztRQUFULGlCQWtDQztRQWpDSSxHQUFXLENBQUMsTUFBTSxDQUFDLE1BQU0sRUFBRSxVQUFFLEdBQUc7WUFDN0IsS0FBSSxDQUFDLE9BQVEsQ0FBQztnQkFDVixVQUFVLEVBQUUsQ0FBRSxHQUFHLEtBQUssQ0FBQyxDQUFFO2FBQzVCLENBQUMsQ0FBQTtRQUNOLENBQUMsQ0FBQyxDQUFDO1FBQ0YsR0FBVyxDQUFDLE1BQU0sQ0FBQyxPQUFPLEVBQUUsVUFBQSxHQUFHO1lBQzVCLEtBQUksQ0FBQyxPQUFRLENBQUM7Z0JBQ1YsS0FBSyxFQUFFLEdBQUc7YUFDYixDQUFDLENBQUM7UUFDUCxDQUFDLENBQUMsQ0FBQztRQUNGLEdBQVcsQ0FBQyxNQUFNLENBQUMsV0FBVyxFQUFFLFVBQUEsR0FBRztZQUNoQyxJQUFLLENBQUMsR0FBRyxFQUFHO2dCQUFFLE9BQU87YUFBRTtZQUN2QixLQUFJLENBQUMsT0FBUSxDQUFDO2dCQUNWLE1BQU0sRUFBRSxHQUFHLENBQUMsU0FBUyxDQUFDO2dCQUN0QixRQUFRLEVBQUUsR0FBRyxDQUFDLFdBQVcsQ0FBQztnQkFDMUIsZ0JBQWdCLEVBQUUsQ0FBQyxHQUFHLElBQUksRUFBRyxDQUFDLENBQUMsd0JBQXdCLENBQUMsSUFBSSxDQUFDO2dCQUM3RCxnQkFBZ0IsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksRUFBRyxDQUFDLENBQUMscUJBQXFCLENBQUMsSUFBSSxLQUFLO2FBQ25FLENBQUMsQ0FBQztZQUNILEtBQUksQ0FBQyxXQUFXLEVBQUcsQ0FBQztRQUN4QixDQUFDLENBQUMsQ0FBQztRQUNGLEdBQVcsQ0FBQyxNQUFNLENBQUMsUUFBUSxFQUFFLFVBQUEsR0FBRztZQUM3QixLQUFJLENBQUMsT0FBUSxDQUFDO2dCQUNWLE1BQU0sRUFBRSxHQUFHO2FBQ2QsQ0FBQyxDQUFDO1lBQ0gsS0FBSSxDQUFDLFdBQVcsRUFBRyxDQUFDO1lBQ3BCLEtBQUksQ0FBQyxXQUFXLEVBQUcsQ0FBQztRQUN4QixDQUFDLENBQUMsQ0FBQztRQUNILEdBQUcsQ0FBQyxNQUFNLENBQUMsWUFBWSxFQUFFLFVBQUEsR0FBRztZQUN4QixJQUFLLEdBQUcsS0FBSyxTQUFTLEVBQUc7Z0JBQUUsT0FBTzthQUFFO1lBQ3BDLEtBQUksQ0FBQyxPQUFRLENBQUM7Z0JBQ1YsVUFBVSxFQUFFLEdBQUc7YUFDbEIsQ0FBQyxDQUFDO1FBQ1AsQ0FBQyxDQUFDLENBQUM7SUFDUCxDQUFDO0lBR0QsU0FBUyxZQUFFLEVBQUU7UUFBYixpQkE2REM7UUE1RFMsSUFBQSxjQUE0QixFQUExQixrQkFBTSxFQUFFLGNBQWtCLENBQUM7UUFDbkMsSUFBSyxNQUFNLEVBQUc7WUFBRSxPQUFPO1NBQUU7UUFDekIsY0FBSSxDQUFDO1lBQ0QsSUFBSSxFQUFFO2dCQUNGLEdBQUcsRUFBRSxFQUFFO2FBQ1Y7WUFDRCxNQUFNLEVBQUUsWUFBWTtZQUNwQixHQUFHLEVBQUUsYUFBYTtZQUNsQixPQUFPLEVBQUUsVUFBQSxHQUFHO2dCQUNWLElBQUssR0FBRyxDQUFDLE1BQU0sS0FBSyxHQUFHLEVBQUc7b0JBQUUsT0FBTztpQkFBRTtnQkFFbkMsSUFBSSxHQUFHLEdBQVEsRUFBRyxDQUFDO2dCQUNiLElBQUEsYUFBZ0QsRUFBOUMsd0JBQVMsRUFBRSwwQkFBVSxFQUFFLDBCQUF1QixDQUFDO2dCQUV2RCxJQUFLLFNBQVMsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFHO29CQUN4QixHQUFHLEdBQUcsU0FBUyxDQUFDLE1BQU0sQ0FBRSxVQUFBLENBQUMsSUFBSSxPQUFBLENBQUMsQ0FBQyxDQUFDLENBQUMsVUFBVSxFQUFkLENBQWMsQ0FBRSxDQUFDO2lCQUVqRDtxQkFBTSxJQUFLLENBQUMsQ0FBQyxVQUFVLEVBQUc7b0JBQ2pCLElBQUEsYUFBaUMsRUFBL0IsZ0JBQUssRUFBRSxnQkFBSyxFQUFFLFlBQWlCLENBQUM7b0JBQ3hDLEdBQUcsR0FBRyxDQUFDOzRCQUNILEtBQUssT0FBQTs0QkFDTCxJQUFJLEVBQUUsS0FBSzs0QkFDWCxVQUFVLFlBQUE7NEJBQ1YsR0FBRyxFQUFFLEdBQUcsQ0FBRSxDQUFDLENBQUU7eUJBQ2hCLENBQUMsQ0FBQztpQkFDTjtnQkFBQSxDQUFDO2dCQUVGLElBQU0sV0FBVyxHQUFHLFVBQVUsQ0FBQyxHQUFHLENBQUUsVUFBQSxDQUFDO29CQUVqQyxJQUFJLEdBQUcsR0FBRyxFQUFFLENBQUM7b0JBQ2IsSUFBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRzt3QkFDWCxHQUFHLEdBQUcsU0FBUyxDQUFDLElBQUksQ0FBRSxVQUFBLENBQUMsSUFBSSxPQUFBLENBQUMsQ0FBQyxHQUFHLEtBQUssQ0FBQyxDQUFDLEdBQUcsRUFBZixDQUFlLENBQUUsQ0FBQyxHQUFHLENBQUE7cUJBQ25EO3lCQUFNO3dCQUNILEdBQUcsR0FBRyxHQUFHLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBRSxDQUFDLENBQUUsQ0FBQztxQkFDM0I7b0JBRUQsT0FBTyxNQUFNLENBQUMsTUFBTSxDQUFDLEVBQUcsRUFBRSxDQUFDLEVBQUU7d0JBQ3pCLEdBQUcsS0FBQTt3QkFDSCxTQUFTLEVBQUUsQ0FBRSxDQUFDLENBQUMsT0FBTyxHQUFHLElBQUksSUFBSSxFQUFHLENBQUMsT0FBTyxFQUFHLENBQUMsR0FBRyxDQUFFLElBQUksQ0FBRTtxQkFDOUQsQ0FBQyxDQUFDO2dCQUVQLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBRSxVQUFBLENBQUMsSUFBSSxPQUFBLENBQUMsQ0FBQyxPQUFPLEdBQUcsSUFBSSxJQUFJLEVBQUcsQ0FBQyxPQUFPLEVBQUcsRUFBbEMsQ0FBa0MsQ0FBQyxDQUFDO2dCQUVwRCxLQUFJLENBQUMsT0FBUSxDQUFDO29CQUNWLEdBQUcsS0FBQTtvQkFDSCxPQUFPLEVBQUUsS0FBSztvQkFDZCxNQUFNLEVBQUUsR0FBRyxDQUFDLElBQUk7b0JBQ2hCLFVBQVUsRUFBRSxXQUFXO2lCQUMxQixDQUFDLENBQUM7Z0JBR0gsSUFBSyxDQUFDLENBQUMsSUFBSSxJQUFJLHlCQUFjLENBQUUsR0FBRyxDQUFDLElBQUksQ0FBRSxDQUFDLE1BQU0sRUFBRztvQkFDL0MsS0FBSSxDQUFDLE9BQVEsQ0FBQzt3QkFDVixZQUFZLEVBQUUsTUFBTTtxQkFDdkIsQ0FBQyxDQUFDO2lCQUNOO3FCQUFNLElBQUssQ0FBQyxJQUFJLElBQUkseUJBQWMsQ0FBRSxHQUFHLENBQUMsSUFBSSxDQUFFLENBQUMsTUFBTSxFQUFHO29CQUNyRCxLQUFJLENBQUMsWUFBWSxFQUFHLENBQUM7aUJBQ3hCO1lBQ0wsQ0FBQztTQUNKLENBQUMsQ0FBQztJQUNQLENBQUM7SUFHRCxhQUFhLFlBQUUsR0FBRyxFQUFFLEdBQUc7UUFBdkIsaUJBdUJDO1FBdEJHLElBQUssQ0FBQyxHQUFHLElBQUksQ0FBQyxHQUFHLEVBQUc7WUFBRSxPQUFPO1NBQUU7UUFFL0IsY0FBSSxDQUFDO1lBQ0QsR0FBRyxFQUFFLG1CQUFtQjtZQUN4QixJQUFJLEVBQUU7Z0JBRUYsR0FBRyxLQUFBO2dCQUNILE1BQU0sRUFBRSxJQUFJO2dCQUNaLFFBQVEsRUFBRSxJQUFJO2FBQ2pCO1lBQ0QsT0FBTyxFQUFFLFVBQUEsR0FBRztnQkFDQSxJQUFBLG1CQUFNLEVBQUUsZUFBSSxDQUFTO2dCQUM3QixJQUFLLE1BQU0sS0FBSyxHQUFHLEVBQUc7b0JBQUUsT0FBTztpQkFBRTtnQkFDakMsS0FBSSxDQUFDLE9BQVEsQ0FBQztvQkFDVixRQUFRLEVBQUUsSUFBSTtvQkFDZCxTQUFTLEVBQUUsSUFBSSxDQUFDLEdBQUcsQ0FBRSxVQUFBLENBQUMsSUFBSSxPQUFBLENBQUM7d0JBQ3ZCLEdBQUcsRUFBRSxDQUFDLENBQUMsR0FBRzt3QkFDVixHQUFHLEVBQUUsQ0FBQyxDQUFDLEdBQUc7cUJBQ2IsQ0FBQyxFQUh3QixDQUd4QixDQUFDO2lCQUNOLENBQUMsQ0FBQztZQUNQLENBQUM7U0FDSixDQUFDLENBQUE7SUFDTixDQUFDO0lBR0QsZ0JBQWdCLFlBQUUsR0FBRyxFQUFFLEtBQUssRUFBRSxNQUFNO1FBQXBDLGlCQWlCQztRQWhCRyxJQUFLLENBQUMsS0FBSyxJQUFJLENBQUMsTUFBTSxFQUFHO1lBQUUsT0FBTztTQUFFO1FBQ3BDLGNBQUksQ0FBQztZQUNELEdBQUcsRUFBRSxvQkFBb0I7WUFDekIsSUFBSSxFQUFFO2dCQUNGLEdBQUcsS0FBQTtnQkFDSCxLQUFLLE9BQUE7Z0JBQ0wsTUFBTSxRQUFBO2FBQ1Q7WUFDRCxPQUFPLEVBQUUsVUFBQSxHQUFHO2dCQUNBLElBQUEsbUJBQU0sRUFBRSxlQUFJLENBQVM7Z0JBQzdCLElBQUssTUFBTSxLQUFLLEdBQUcsRUFBRztvQkFBRSxPQUFPO2lCQUFFO2dCQUNqQyxLQUFJLENBQUMsT0FBUSxDQUFDO29CQUNWLFFBQVEsRUFBRSxJQUFJO2lCQUNqQixDQUFDLENBQUM7WUFDUCxDQUFDO1NBQ0osQ0FBQyxDQUFDO0lBQ1AsQ0FBQztJQUdELFNBQVM7UUFBVCxpQkF1QkM7UUF0QlcsSUFBQSxpQkFBRSxDQUFlO1FBQ3pCLGNBQUksQ0FBQztZQUNELElBQUksRUFBRSxFQUFHO1lBQ1QsR0FBRyxFQUFFLFlBQVk7WUFDakIsT0FBTyxFQUFFLFVBQUEsR0FBRztnQkFDQSxJQUFBLG1CQUFNLEVBQUUsZUFBSSxDQUFTO2dCQUM3QixJQUFLLE1BQU0sS0FBSyxHQUFHLEVBQUc7b0JBQUUsT0FBTztpQkFBRTtnQkFDakMsSUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFFLENBQUMsQ0FBRSxDQUFDO2dCQUN2QixJQUFLLENBQUMsQ0FBQyxJQUFJLEVBQUc7b0JBQ0YsSUFBQSxjQUFHLEVBQUUsNEJBQVUsRUFBRSx3QkFBUSxDQUFVO29CQUMzQyxJQUFNLEdBQUcsR0FBRyxHQUFHLENBQUE7b0JBRWYsS0FBSSxDQUFDLGFBQWEsQ0FBRSxFQUFFLEVBQUUsR0FBRyxDQUFFLENBQUM7b0JBQzlCLEtBQUksQ0FBQyxnQkFBZ0IsQ0FBRSxFQUFFLEVBQUUsVUFBVSxFQUFFLFFBQVEsQ0FBRSxDQUFDO29CQUVsRCxLQUFJLENBQUMsT0FBUSxDQUFDO3dCQUNWLEdBQUcsS0FBQTt3QkFDSCxJQUFJLE1BQUE7cUJBQ1AsQ0FBQyxDQUFDO2lCQUNOO1lBQ0wsQ0FBQztTQUNKLENBQUMsQ0FBQTtJQUNOLENBQUM7SUFHRCxXQUFXO1FBQVgsaUJBa0JDO1FBakJTLElBQUEsY0FBNEIsRUFBMUIsa0JBQU0sRUFBRSxjQUFrQixDQUFDO1FBQ25DLElBQUssQ0FBQyxJQUFJLElBQUksQ0FBQyxNQUFNLElBQUksSUFBSSxLQUFLLE1BQU0sRUFBRztZQUN2QyxPQUFPO1NBQ1Y7UUFDRCxjQUFJLENBQUM7WUFDRCxJQUFJLEVBQUU7Z0JBQ0YsTUFBTSxFQUFFLElBQUk7YUFDZjtZQUNELEdBQUcsRUFBRSxzQkFBc0I7WUFDM0IsT0FBTyxFQUFFLFVBQUEsR0FBRztnQkFDQSxJQUFBLG1CQUFNLEVBQUUsZUFBSSxDQUFTO2dCQUM3QixJQUFLLE1BQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxJQUFJLEVBQUc7b0JBQUUsT0FBTztpQkFBRTtnQkFDMUMsS0FBSSxDQUFDLE9BQVEsQ0FBQztvQkFDVixhQUFhLEVBQUUsSUFBSTtpQkFDdEIsQ0FBQyxDQUFDO1lBQ1AsQ0FBQztTQUNKLENBQUMsQ0FBQTtJQUNOLENBQUM7SUFFRCxhQUFhO1FBQ1QsSUFBTSxHQUFHLEdBQUcsRUFBRSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUUsSUFBSSxDQUFDLE1BQU0sRUFBRyxHQUFHLEVBQUUsQ0FBQyxDQUFDO1FBQ2pELElBQUksQ0FBQyxPQUFRLENBQUM7WUFDVixTQUFTLEVBQUssR0FBRyx1QkFBSztTQUN6QixDQUFDLENBQUM7SUFDUCxDQUFDO0lBR0QsV0FBVztRQUNELElBQUEsY0FBa0QsRUFBaEQsVUFBRSxFQUFFLHNDQUFnQixFQUFFLGNBQUksRUFBRSxrQkFBb0IsQ0FBQztRQUN6RCxJQUFLLENBQUMsRUFBRSxJQUFJLENBQUMsZ0JBQWdCLElBQUksQ0FBQyxJQUFJLElBQUksQ0FBQyxNQUFNLEVBQUc7WUFBRSxPQUFPO1NBQUU7UUFDL0QsY0FBSSxDQUFDO1lBQ0QsSUFBSSxFQUFFO2dCQUNGLElBQUksTUFBQTtnQkFDSixHQUFHLEVBQUUsRUFBRTthQUNWO1lBQ0QsR0FBRyxFQUFFLHFCQUFxQjtTQUM3QixDQUFDLENBQUM7SUFDUCxDQUFDO0lBR0QsY0FBYyxZQUFFLENBQUU7UUFDTixJQUFBLHFDQUFZLENBQWU7UUFDbkMsSUFBSSxDQUFDLE9BQVEsQ0FBQztZQUNWLFlBQVksRUFBRSxZQUFZLEtBQUssTUFBTSxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLE1BQU07U0FDMUQsQ0FBQyxDQUFDO0lBQ1AsQ0FBQztJQUdELFdBQVc7UUFBWCxpQkFNQztRQUxHLEdBQUcsQ0FBQyxhQUFhLENBQUM7WUFDZCxLQUFJLENBQUMsT0FBUSxDQUFDO2dCQUNWLFlBQVksRUFBRSxNQUFNO2FBQ3ZCLENBQUMsQ0FBQztRQUNQLENBQUMsQ0FBQyxDQUFDO0lBQ1AsQ0FBQztJQUdELG1CQUFtQjtRQUNQLElBQUEsK0NBQWlCLENBQWU7UUFDeEMsSUFBSSxDQUFDLE9BQVEsQ0FBQztZQUNWLGlCQUFpQixFQUFFLENBQUMsaUJBQWlCO1NBQ3hDLENBQUMsQ0FBQztRQUNILElBQUssQ0FBQyxpQkFBaUIsRUFBRztZQUN0QixJQUFJLENBQUMsV0FBVyxFQUFHLENBQUM7U0FDdkI7SUFDTCxDQUFDO0lBR0QsY0FBYztRQUNGLElBQUEscUNBQVksQ0FBZTtRQUNuQyxJQUFJLENBQUMsT0FBUSxDQUFDO1lBQ1YsWUFBWSxFQUFFLFlBQVksS0FBSyxNQUFNLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsTUFBTTtTQUMxRCxDQUFDLENBQUM7UUFDSCxJQUFLLFlBQVksS0FBSyxNQUFNLEVBQUc7WUFDM0IsSUFBSSxDQUFDLFdBQVcsRUFBRyxDQUFDO1NBQ3ZCO0lBQ0wsQ0FBQztJQUVELFdBQVc7UUFDUCxHQUFHLENBQUMsWUFBWSxDQUFDLHFCQUFxQixDQUFDLENBQUM7SUFDNUMsQ0FBQztJQUdELFNBQVM7UUFDTCxnQkFBSyxDQUFDLDBDQUF3QyxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUksQ0FBQyxDQUFDO0lBQ2xFLENBQUM7SUFHRCxRQUFRO1FBQ0osZ0JBQUssQ0FBQyx5QkFBeUIsQ0FBQyxDQUFBO0lBQ3BDLENBQUM7SUFHRCxZQUFZLFlBQUMsRUFBaUI7WUFBZixnQ0FBYTtRQUNoQixJQUFBLCtCQUFHLENBQTJCO1FBQ3RDLGdCQUFLLENBQUMsa0NBQWdDLEdBQUssQ0FBQyxDQUFBO0lBQ2hELENBQUM7SUFHRCxVQUFVLFlBQUMsRUFBaUI7WUFBZixnQ0FBYTtRQUNkLElBQUEsK0JBQUcsQ0FBMkI7UUFDdEMsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLElBQUksRUFBRSxDQUFDLFlBQVksQ0FBQztZQUNoQyxPQUFPLEVBQUUsR0FBRztZQUNaLElBQUksRUFBUSxJQUFJLENBQUMsSUFBWSxDQUFDLE1BQU0sQ0FBQyxHQUFHLFFBQUU7U0FDN0MsQ0FBQyxDQUFDO0lBQ1AsQ0FBQztJQUdELGdCQUFnQixZQUFDLEVBQWlCO1lBQWYsZ0NBQWE7UUFFNUIsSUFBTSxHQUFHLEdBQUcsYUFBYSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUNwQyxhQUFhLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUEsQ0FBQztZQUMvQixhQUFhLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQztRQUU5QixJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sSUFBSSxFQUFFLENBQUMsWUFBWSxDQUFDO1lBQ2hDLE9BQU8sRUFBRSxHQUFHO1lBQ1osSUFBSSxFQUFFLENBQUUsR0FBRyxDQUFFO1NBQ2hCLENBQUMsQ0FBQztJQUNQLENBQUM7SUFHRCxZQUFZO1FBQ0EsSUFBQSx5QkFBTSxDQUFlO1FBQzdCLElBQUssQ0FBQyxNQUFNLEVBQUc7WUFBRSxPQUFNO1NBQUU7UUFDekIsSUFBTSxNQUFNLEdBQUcseUJBQWMsQ0FBRSxNQUFNLENBQUUsQ0FBQztRQUN4QyxJQUFLLE1BQU0sRUFBRztZQUNWLElBQU0sTUFBTSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLElBQUksQ0FBQztZQUNuQyxJQUFNLFFBQVEsR0FBRyxNQUFNLENBQUUsTUFBTSxDQUFDLFFBQVEsQ0FBQyxjQUFjLENBQUUsQ0FBQyxPQUFPLENBQUMsT0FBTyxFQUFFLEVBQUUsQ0FBQyxDQUFDO1lBQy9FLElBQU0sVUFBVSxHQUFHLEVBQUUsQ0FBQyxjQUFjLENBQUUsVUFBVSxDQUFFLENBQUM7WUFFbkQsSUFBSyxDQUFDLENBQUMsUUFBUSxJQUFJLElBQUksQ0FBQyxHQUFHLEVBQUcsR0FBRyxNQUFNLENBQUUsVUFBVSxDQUFFLElBQUksTUFBTSxFQUFHO2dCQUM5RCxFQUFFLENBQUMsY0FBYyxDQUFFLFVBQVUsRUFBRSxNQUFNLENBQUUsSUFBSSxDQUFDLEdBQUcsRUFBRyxDQUFDLENBQUMsQ0FBQztnQkFDckQsSUFBSSxDQUFDLGNBQWMsRUFBRyxDQUFDO2FBQzFCO1NBQ0o7SUFDTCxDQUFDO0lBR0QsTUFBTTtRQUFOLGlCQWdCQztRQWZHLElBQU0sSUFBSSxHQUFHLElBQUksQ0FBQztRQUNsQixJQUFLLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxXQUFXLEVBQUc7WUFBRSxPQUFPO1NBQUU7UUFDekMsY0FBSSxDQUFDO1lBQ0QsSUFBSSxFQUFFO2dCQUNGLEdBQUcsRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUU7YUFDcEI7WUFDRCxHQUFHLEVBQUUsYUFBYTtZQUNsQixPQUFPLEVBQUcsVUFBRSxHQUFRO2dCQUNoQixJQUFLLEdBQUcsQ0FBQyxNQUFNLEtBQUssR0FBRyxFQUFHO29CQUN0QixLQUFJLENBQUMsT0FBUSxDQUFDO3dCQUNWLEtBQUssRUFBRSxDQUFDLEtBQUksQ0FBQyxJQUFJLENBQUMsS0FBSztxQkFDMUIsQ0FBQyxDQUFBO2lCQUNMO1lBQ0wsQ0FBQztTQUNKLENBQUMsQ0FBQztJQUNQLENBQUM7SUFHRCxTQUFTO1FBQVQsaUJBZ0JDO1FBZkcsSUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDO1FBQ2xCLGNBQUksQ0FBQztZQUNELElBQUksRUFBRTtnQkFDRixHQUFHLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFO2FBQ3BCO1lBQ0QsR0FBRyxFQUFFLFlBQVk7WUFDakIsT0FBTyxFQUFHLFVBQUUsR0FBUTtnQkFDaEIsSUFBSyxHQUFHLENBQUMsTUFBTSxLQUFLLEdBQUcsRUFBRztvQkFDdEIsS0FBSSxDQUFDLE9BQVEsQ0FBQzt3QkFDVixLQUFLLEVBQUUsR0FBRyxDQUFDLElBQUk7d0JBQ2YsV0FBVyxFQUFFLElBQUk7cUJBQ3BCLENBQUMsQ0FBQTtpQkFDTDtZQUNMLENBQUM7U0FDSixDQUFDLENBQUM7SUFDUCxDQUFDO0lBR0QsWUFBWSxZQUFFLENBQUM7UUFDWCxJQUFNLEdBQUcsR0FBRyxDQUFDLENBQUMsTUFBTSxDQUFDO1FBQ3JCLElBQUksQ0FBQyxPQUFRLENBQUM7WUFDVixhQUFhLEVBQUUsR0FBRztTQUNyQixDQUFDLENBQUM7UUFDSCxFQUFFLENBQUMscUJBQXFCLENBQUM7WUFDckIsS0FBSyxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxNQUFNO1NBQy9CLENBQUMsQ0FBQztJQUNQLENBQUM7SUFHRCxVQUFVO1FBQ0UsSUFBQSx1Q0FBYSxDQUFlO1FBQ3BDLElBQU0sTUFBTSxHQUFJLElBQVksQ0FBQyxlQUFlLENBQUMsU0FBUyxDQUFDLENBQUM7UUFDeEQsTUFBTSxDQUFDLE1BQU0sRUFBRyxDQUFDO1FBQ2pCLElBQUssQ0FBQyxhQUFhLEVBQUc7WUFDbEIsSUFBSSxDQUFDLFdBQVcsRUFBRyxDQUFDO1NBQ3ZCO0lBQ0wsQ0FBQztJQUdELFdBQVc7UUFDUCxJQUFJO1lBQ0EsSUFBTSxNQUFNLEdBQUksSUFBWSxDQUFDLGVBQWUsQ0FBQyxTQUFTLENBQUMsQ0FBQztZQUN4RCxNQUFNLENBQUMsS0FBSyxFQUFHLENBQUM7U0FDbkI7UUFBQyxPQUFRLENBQUMsRUFBRyxHQUFHO0lBQ3JCLENBQUM7SUFHRCxXQUFXLFlBQUUsQ0FBQztRQUNWLElBQUksQ0FBQyxPQUFRLENBQUM7WUFDVixVQUFVLEVBQUUsQ0FBQyxDQUFDLE1BQU07U0FDdkIsQ0FBQyxDQUFDO0lBQ1AsQ0FBQztJQUdELFFBQVEsWUFBRSxDQUFDO1FBQ1AsSUFBTSxJQUFJLEdBQUcsQ0FBQyxDQUFDLE1BQU0sQ0FBQztRQUN0QixJQUFLLElBQUksS0FBSyxlQUFlLEVBQUc7WUFDNUIsSUFBSSxDQUFDLG1CQUFtQixFQUFHLENBQUM7U0FDL0I7SUFDTCxDQUFDO0lBR0QsV0FBVztRQUNDLElBQUEsaUNBQVUsQ0FBZTtRQUNqQyxJQUFNLEdBQUcsR0FBSSxJQUFZLENBQUMsZUFBZSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQ2xELEdBQUcsQ0FBQyxTQUFTLEVBQUcsQ0FBQztRQUNqQixJQUFLLENBQUMsVUFBVSxFQUFHO1lBQ2YsSUFBSSxDQUFDLFdBQVcsRUFBRyxDQUFDO1NBQ3ZCO0lBQ0wsQ0FBQztJQUdELFdBQVcsWUFBRSxDQUFDO1FBQ1YsSUFBSSxDQUFDLE9BQVEsQ0FBQztZQUNWLFVBQVUsRUFBRSxDQUFDLENBQUMsTUFBTTtTQUN2QixDQUFDLENBQUM7SUFDUCxDQUFDO0lBVUQsTUFBTSxFQUFFLFVBQVUsT0FBTztRQUFqQixpQkF5QlA7UUF2QkcsSUFBTSxLQUFLLEdBQUcsa0JBQWtCLENBQUUsT0FBUSxDQUFDLEtBQUssSUFBSSxFQUFFLENBQUUsQ0FBQTtRQUN4RCxJQUFNLEVBQUUsR0FBRyxPQUFRLENBQUMsRUFBRSxJQUFJLEtBQUssSUFBSSxrQ0FBa0MsQ0FBQztRQUV0RSxJQUFJLENBQUMsV0FBVyxFQUFHLENBQUM7UUFDcEIsSUFBSSxDQUFDLGFBQWEsRUFBRyxDQUFDO1FBRXRCLElBQUssQ0FBQyxDQUFDLEVBQUUsRUFBRztZQUNSLElBQUksQ0FBQyxPQUFRLENBQUM7Z0JBQ1YsRUFBRSxJQUFBO2FBQ0wsQ0FBQyxDQUFDO1NBQ047UUFFRCxJQUFLLENBQUMsQ0FBRSxPQUFlLENBQUMsSUFBSSxFQUFHO1lBQzNCLElBQUksQ0FBQyxPQUFRLENBQUM7Z0JBQ1YsSUFBSSxFQUFFLE9BQVEsQ0FBQyxJQUFJO2FBQ3RCLENBQUMsQ0FBQTtTQUNMO1FBRUQsVUFBVSxDQUFDO1lBQ1AsS0FBSSxDQUFDLFNBQVMsRUFBRyxDQUFDO1lBQ2xCLEtBQUksQ0FBQyxTQUFTLEVBQUcsQ0FBQztZQUNsQixLQUFJLENBQUMsU0FBUyxDQUFFLEVBQUUsQ0FBRSxDQUFDO1FBQ3pCLENBQUMsRUFBRSxFQUFFLENBQUUsQ0FBQztJQUNaLENBQUM7SUFLRCxPQUFPLEVBQUU7UUFDTCxJQUFJLFdBQVcsR0FBRyxDQUFDLENBQUM7UUFDcEIsSUFBTSxJQUFJLEdBQVEsSUFBSSxDQUFDO1FBRXZCLElBQUksQ0FBQyx5QkFBeUIsR0FBRyxFQUFFLENBQUMsZUFBZSxDQUFDO1lBQ2hELFFBQVEsRUFBRSxHQUFHO1lBQ2IsY0FBYyxFQUFFLE1BQU07WUFDdEIsZUFBZSxFQUFFLFNBQVM7U0FDN0IsQ0FBQyxDQUFDO1FBQ0gsV0FBVyxDQUFFO1lBQ1QsSUFBSSxXQUFXLEdBQUcsQ0FBQyxJQUFJLENBQUMsRUFBRTtnQkFDdEIsSUFBSSxDQUFDLHlCQUF5QixDQUFDLEtBQUssQ0FBRSxHQUFHLENBQUUsQ0FBQyxNQUFNLENBQUUsRUFBRSxDQUFFLENBQUMsSUFBSSxFQUFHLENBQUM7YUFDcEU7aUJBQU07Z0JBQ0gsSUFBSSxDQUFDLHlCQUF5QixDQUFDLEtBQUssQ0FBRSxHQUFHLENBQUUsQ0FBQyxNQUFNLENBQUUsQ0FBQyxFQUFFLENBQUUsQ0FBQyxJQUFJLEVBQUcsQ0FBQzthQUNyRTtZQUNELElBQUksQ0FBQyxPQUFPLENBQUM7Z0JBQ1QseUJBQXlCLEVBQUUsSUFBSSxDQUFDLHlCQUF5QixDQUFDLE1BQU0sRUFBRzthQUN0RSxDQUFDLENBQUM7WUFFSCxJQUFLLEVBQUUsV0FBVyxLQUFLLElBQUksRUFBRztnQkFDMUIsV0FBVyxHQUFHLENBQUMsQ0FBQzthQUNuQjtRQUNMLENBQUMsQ0FBQyxJQUFJLENBQUUsSUFBSSxDQUFFLEVBQUUsSUFBSSxDQUFFLENBQUM7SUFDM0IsQ0FBQztJQUtELE1BQU0sRUFBRTtRQUNFLElBQUEsY0FBNkIsRUFBM0IsVUFBRSxFQUFFLFlBQUcsRUFBRSxjQUFrQixDQUFDO1FBRXBDLElBQUksQ0FBQyxhQUFhLENBQUUsRUFBRSxFQUFFLEdBQUcsQ0FBRSxDQUFDO1FBQzlCLElBQUssQ0FBQyxDQUFDLElBQUksRUFBRztZQUNKLElBQUEsU0FBd0MsRUFBdEMsMEJBQVUsRUFBRSxzQkFBMEIsQ0FBQztZQUMvQyxJQUFJLENBQUMsZ0JBQWdCLENBQUUsRUFBRSxFQUFFLFVBQVUsRUFBRSxRQUFRLENBQUUsQ0FBQztTQUNyRDtJQUVMLENBQUM7SUFLRCxNQUFNLEVBQUU7SUFFUixDQUFDO0lBS0QsUUFBUSxFQUFFO0lBRVYsQ0FBQztJQUtELGlCQUFpQixFQUFFO0lBRW5CLENBQUM7SUFLRCxhQUFhLEVBQUU7SUFFZixDQUFDO0lBS0QsaUJBQWlCLEVBQUUsVUFBVyxDQUFDO1FBQVosaUJBZ0JsQjtRQWZTLElBQUEsY0FBK0QsRUFBN0Qsd0JBQVMsRUFBRSxvQkFBTyxFQUFFLGtCQUFNLEVBQUUsMEJBQWlDLENBQUM7UUFFdEUsSUFBSSxDQUFDLFdBQVcsRUFBRyxDQUFDO1FBQ3BCLFVBQVUsQ0FBQztZQUNQLElBQU0sWUFBWSxHQUFJLEtBQVksQ0FBQyxlQUFlLENBQUMsaUJBQWlCLENBQUMsQ0FBQztZQUN0RSxZQUFZLENBQUMsTUFBTSxFQUFHLENBQUM7UUFDM0IsQ0FBQyxFQUFFLEdBQUcsQ0FBRSxDQUFDO1FBRVQsT0FBTztZQUNILFFBQVEsRUFBRSxVQUFVLElBQUksS0FBRyxPQUFPLENBQUMsR0FBRyxDQUFFLENBQUMsQ0FBSTtZQUM3QyxJQUFJLEVBQUUsa0NBQWdDLE9BQU8sQ0FBQyxHQUFHLGNBQVMsTUFBUTtZQUNsRSxLQUFLLEVBQUUsQ0FBQyxDQUFDLE9BQU8sSUFBSSxPQUFPLENBQUMsTUFBTSxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7Z0JBQzlDLHFHQUFtQixPQUFPLENBQUMsS0FBSyxTQUFJLE9BQU8sQ0FBQyxPQUFTLENBQUMsQ0FBQztnQkFDdkQsdUJBQU0sT0FBTyxDQUFDLE9BQU8sMkJBQU8sT0FBTyxDQUFDLEtBQU87U0FDbEQsQ0FBQTtJQUNMLENBQUM7Q0FDRixDQUFDLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJcbmltcG9ydCB7IGh0dHAgfSBmcm9tICcuLi8uLi91dGlsL2h0dHAuanMnO1xuaW1wb3J0IHsgY29tcHV0ZWQgfSBmcm9tICcuLi8uLi9saWIvdnVlZnkvaW5kZXguanMnO1xuaW1wb3J0IHsgZGVsYXllcmluZ0dvb2QgfSBmcm9tICcuLi8uLi91dGlsL2dvb2RzLmpzJztcbmltcG9ydCB7IG5hdlRvIH0gZnJvbSAnLi4vLi4vdXRpbC9yb3V0ZS5qcyc7XG5cbmNvbnN0IGFwcCA9IGdldEFwcDxhbnk+KCApO1xuXG4vLyDmiZPlvIDmi7zlm6Lmj5DnpLrnmoRrZXlcbmNvbnN0IHN0b3JhZ2VLZXkgPSAnb3BlbmVkLXBpbi1pbi1nb29kJztcblxuUGFnZSh7XG5cbiAgICAvLyDliqjnlLtcbiAgICBhbmltYXRpb25NaWRkbGVIZWFkZXJJdGVtOiBudWxsLFxuXG4gICAgLyoqXG4gICAgICog6aG16Z2i55qE5Yid5aeL5pWw5o2uXG4gICAgICovXG4gICAgZGF0YToge1xuICAgICAgICAvLyDmmK/lkKbmnInnlKjmiLfmjojmnYNcbiAgICAgICAgaXNVc2VyQXV0aDogdHJ1ZSxcblxuICAgICAgICAvLyBpcFxuICAgICAgICBpcE5hbWU6ICcnLFxuXG4gICAgICAgIC8vIGlwIFxuICAgICAgICBpcEF2YXRhcjogJycsXG5cbiAgICAgICAgLy8g5piv5ZCm5Li65paw5a6iXG4gICAgICAgIGlzTmV3OiB0cnVlLFxuXG4gICAgICAgIC8vIOihjOeoi1xuICAgICAgICB0aWQ6ICcnLFxuXG4gICAgICAgIC8vIOWVhuWTgWlkXG4gICAgICAgIGlkOiAnJyxcblxuICAgICAgICAvLyDllYblk4Hor6bmg4VcbiAgICAgICAgZGV0YWlsOiBudWxsLFxuICAgICAgICBcbiAgICAgICAgLy8g5pWw5o2u5a2X5YW4XG4gICAgICAgIGRpYzogeyB9LFxuICAgICAgICBcbiAgICAgICAgLy8g5Yqg6L2954q25oCBXG4gICAgICAgIGxvYWRpbmc6IHRydWUsXG5cbiAgICAgICAgLy8g5piv5ZCm5Yid5aeL5YyW6L+H4oCc5Zac5qyi4oCdXG4gICAgICAgIGhhc0luaXRMaWtlOiBmYWxzZSxcblxuICAgICAgICAvLyDmmK/lkKbigJzllpzmrKLigJ1cbiAgICAgICAgbGlrZWQ6IGZhbHNlLFxuXG4gICAgICAgIC8vIOaWh+Wtl+S/neivgeaPkOekulxuICAgICAgICBwcm9taXNlVGlwczogW1xuICAgICAgICAgICAgJ+ato+WTgeS/neivgScsICfku7fmoLzkvJjlir8nLCAn55yf5Lq66LeR6IW/J1xuICAgICAgICBdLFxuXG4gICAgICAgIC8vIOWKqOeUu1xuICAgICAgICBhbmltYXRpb25NaWRkbGVIZWFkZXJJdGVtOiBudWxsLFxuXG4gICAgICAgIC8vIOWxleekuueuoeeQhuWFpeWPo1xuICAgICAgICBzaG93QWRtQnRuOiBmYWxzZSxcblxuICAgICAgICAvLyDmraPlnKjlsZXnpLrmtbfmiqVcbiAgICAgICAgc2hvd2luZ1Bvc3RlcjogZmFsc2UsXG5cbiAgICAgICAgLy8g5bGV56S65ou85Zui546p5rOV55qE5by55qGGXG4gICAgICAgIHNob3dQbGF5VGlwczogJ2hpZGUnLFxuXG4gICAgICAgIC8vIOWxleekuuWIhuS6q+i1mumSsVxuICAgICAgICBzaG93U2hhcmVHZXRNb25leTogZmFsc2UsXG5cbiAgICAgICAgLy8g5bGV56S65ou85Zui5ZWG5ZOB5YiX6KGoXG4gICAgICAgIHNob3dQaW5Hb29kczogJ2hpZGUnLFxuXG4gICAgICAgIC8vIOWIhuS6q1RpcHMyXG4gICAgICAgIHNob3dTaGFyZVRpcHMyOiBmYWxzZSxcblxuICAgICAgICAvLyDmi7zlm6LliJfooahcbiAgICAgICAgcGluOiBbIF0sXG5cbiAgICAgICAgLy8g5pys6KGM56iL55qE6LSt54mp5riF5Y2V5YiX6KGoXG4gICAgICAgIHNob3BwaW5nOiBbIF0sXG5cbiAgICAgICAgLy8g5LiA5Y+j5Lu35rS75Yqo5YiX6KGoXG4gICAgICAgIGFjdGl2aXRpZXM6IFsgXSxcblxuICAgICAgICAvLyDmnKzotp/og73lpJ/mi7zlm6LnmoRza3VcbiAgICAgICAgY2FuUGluU2t1OiBbIF0sXG5cbiAgICAgICAgLy8g5b2T5YmN55qE6KGM56iLXG4gICAgICAgIHRyaXA6IG51bGwsXG5cbiAgICAgICAgLy8g5b2T5YmN5piv5ZCm5byA5ZCv5LqG56ev5YiG5o6o5bm/XG4gICAgICAgIGNhbkludGVncmF5U2hhcmU6IGZhbHNlLFxuXG4gICAgICAgIC8vIOW9k+WJjei0puWPt+eahG9wZW5pZFxuICAgICAgICBvcGVuaWQ6ICcnLFxuXG4gICAgICAgIC8vIOWIhuS6q+S6uueahG9wZW5pZFxuICAgICAgICBmcm9tOiAnJyxcblxuICAgICAgICAvLyDnp6/liIbmjqjlub/ojrfngrnmr5TkvotcbiAgICAgICAgcHVzaEludGVncmFsUmF0ZTogMCxcblxuICAgICAgICAvLyDmmK/lkKblsZXlvIBza3VcbiAgICAgICAgb3BlbmluZ1NrdTogZmFsc2UsXG5cbiAgICAgICAgLy8g6K6/6Zeu6K6w5b2VXG4gICAgICAgIHZpc2l0b3JzOiBbIF0sXG5cbiAgICAgICAgLy8g5YiG5Lqr5Lq65L+h5oGvXG4gICAgICAgIHNoYXJlRnJvbVVzZXI6IHsgfSxcblxuICAgICAgICAvLyDliIbkuqvlsIHpnaJcbiAgICAgICAgc2hhcmVDb3ZlcjogJycsXG5cbiAgICAgICAgLy8g5bCB6Z2i5o+Q56S6XG4gICAgICAgIGNvdmVyVGV4dDogXCIyM+S6uueci+i/h1wiXG4gICAgfSxcblxuICAgIC8qKiDorr7nva5jb21wdXRlZCAqL1xuICAgIHJ1bkNvbXB1dGVkKCApIHtcbiAgICAgICAgY29tcHV0ZWQoIHRoaXMsIHtcblxuICAgICAgICAgICAgLy8g6K6h566X5Lu35qC8XG4gICAgICAgICAgICBwcmljZTogZnVuY3Rpb24oICkge1xuICAgICAgICAgICAgICAgIGNvbnN0IHsgZGV0YWlsIH0gPSB0aGlzLmRhdGE7XG4gICAgICAgICAgICAgICAgY29uc3QgcmVzdWx0ID0gZGVsYXllcmluZ0dvb2QoIGRldGFpbCApO1xuICAgICAgICAgICAgICAgIHJldHVybiByZXN1bHQgPyByZXN1bHQucHJpY2UkIDogJyc7XG4gICAgICAgICAgICB9LFxuXG4gICAgICAgICAgICAvLyDllYblk4Hor6bmg4UgLSDliIbooYzmmL7npLpcbiAgICAgICAgICAgIGRldGFpbEludHJvOiBmdW5jdGlvbiggKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgeyBkZXRhaWwgfSA9IHRoaXMuZGF0YTtcbiAgICAgICAgICAgICAgICBpZiAoICFkZXRhaWwgfHwgKCAhIWRldGFpbCAmJiAhZGV0YWlsLmRldGFpbCApKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBbIF07XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGRldGFpbC5kZXRhaWwuc3BsaXQoJ1xcbicpLmZpbHRlciggeCA9PiAhIXggKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LFxuXG4gICAgICAgICAgICAvLyDku7fmoLwg772eIOWboui0reS7t+eahOW3ruS7t1xuICAgICAgICAgICAgcHJpY2VHYXA6IGZ1bmN0aW9uKCApIHtcbiAgICAgICAgICAgICAgICBjb25zdCB7IGRldGFpbCB9ID0gdGhpcy5kYXRhO1xuICAgICAgICAgICAgICAgIGlmICggIWRldGFpbCApIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuICcnXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgcmVzdWx0ID0gZGVsYXllcmluZ0dvb2QoIGRldGFpbCApO1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBnYXAgPSByZXN1bHQgPyBTdHJpbmcoIHJlc3VsdC5nb29kUGlucy5lYWNoUHJpY2VSb3VuZCApLnJlcGxhY2UoL1xcLjAwL2csICcnKSA6ICcnO1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBtZXRhID0gZ2FwICE9PSAnMCcgJiYgISFnYXAgPyBnYXAgOiAnJztcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG1ldGE7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAgLy8g6ams5LiK5Y+v5Lul5ou85Zui55qE5Liq5pWwXG4gICAgICAgICAgICBwaW5Db3VudCQ6IGZ1bmN0aW9uKCApIHtcbiAgICAgICAgICAgICAgICBjb25zdCB7IGlkLCBkZXRhaWwgfSA9IHRoaXMuZGF0YTtcbiAgICAgICAgICAgICAgICBjb25zdCBnb29kU2hvcHBpbmcgPSB0aGlzLmRhdGEuc2hvcHBpbmcuZmlsdGVyKCB4ID0+IHgucGlkID09PSBpZCApO1xuICAgICAgICAgICAgICAgIGlmICggIWRldGFpbCApIHsgXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAwO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGNvbnN0IHsgc3RhbmRhcmRzLCBncm91cFByaWNlIH0gPSBkZXRhaWw7XG5cbiAgICAgICAgICAgICAgICBpZiAoICEhc3RhbmRhcmRzICYmIHN0YW5kYXJkcy5sZW5ndGggPiAwICkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gc3RhbmRhcmRzXG4gICAgICAgICAgICAgICAgICAgICAgICAuZmlsdGVyKCB4ID0+ICEhZ29vZFNob3BwaW5nLmZpbmQoIHMgPT4gcy5zaWQgPT09IHguX2lkICYmIHMucGlkID09PSB4LnBpZCApKVxuICAgICAgICAgICAgICAgICAgICAgICAgLmxlbmd0aDtcblxuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoICEhZ3JvdXBQcmljZSApIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgeyBfaWQgfSA9IGRldGFpbDtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuICEhZ29vZFNob3BwaW5nLmZpbmQoIHMgPT4gcy5waWQgPT09IF9pZCApID8gMSA6IDBcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gMDtcbiAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgIC8vIOaLvOWbouWIl+ihqFxuICAgICAgICAgICAgcGluJDogZnVuY3Rpb24oICkge1xuICAgICAgICAgICAgICAgIGxldCBtZXRhOiBhbnkgPSBbIF07XG4gICAgICAgICAgICAgICAgY29uc3QgeyBkZXRhaWwsIHNob3BwaW5nLCBhY3Rpdml0aWVzIH0gPSB0aGlzLmRhdGE7XG5cbiAgICAgICAgICAgICAgICBpZiAoICFkZXRhaWwgKSB7IFxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gWyBdO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGNvbnN0IHsgc3RhbmRhcmRzLCBncm91cFByaWNlIH0gPSBkZXRhaWw7XG5cbiAgICAgICAgICAgICAgICBpZiAoIHN0YW5kYXJkcy5sZW5ndGggPiAwICkge1xuICAgICAgICAgICAgICAgICAgICBtZXRhID0gc3RhbmRhcmRzXG4gICAgICAgICAgICAgICAgICAgICAgICAuZmlsdGVyKCB4ID0+ICEheC5ncm91cFByaWNlIClcbiAgICAgICAgICAgICAgICAgICAgICAgIC5tYXAoIHggPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBPYmplY3QuYXNzaWduKHsgfSwgeCwge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzaWQ6IHguX2lkLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYW5QaW46ICEhc2hvcHBpbmcuZmluZCggcyA9PiBzLnNpZCA9PT0geC5faWQgJiYgcy5waWQgPT09IHgucGlkIClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKCAhIWdyb3VwUHJpY2UgKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHsgcHJpY2UsIHRpdGxlLCBpbWcsIF9pZCB9ID0gZGV0YWlsO1xuICAgICAgICAgICAgICAgICAgICBtZXRhID0gW3tcbiAgICAgICAgICAgICAgICAgICAgICAgIHByaWNlLFxuICAgICAgICAgICAgICAgICAgICAgICAgcGlkOiBfaWQsXG4gICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiB0aXRsZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGdyb3VwUHJpY2UsXG4gICAgICAgICAgICAgICAgICAgICAgICBzaWQ6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICAgICAgICAgIGltZzogaW1nWyAwIF0sXG4gICAgICAgICAgICAgICAgICAgICAgICBjYW5QaW46ICEhc2hvcHBpbmcuZmluZCggcyA9PiBzLnBpZCA9PT0gX2lkIClcbiAgICAgICAgICAgICAgICAgICAgfV07XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgLy8g5qC55o2u5rS75Yqo77yM5pu05pS544CB5paw5aKe5ou85Zui6aG555uuXG4gICAgICAgICAgICAgICAgYWN0aXZpdGllcy5tYXAoIGFjID0+IHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCAhYWMuYWNfZ3JvdXBQcmljZSApIHsgcmV0dXJuOyB9XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHBpblRhcmdldCA9IG1ldGEuZmluZCggeCA9PiB4LnBpZCA9PT0gYWMucGlkICYmIHguc2lkID09PSBhYy5zaWQgKTtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgcGluVGFyZ2V0SW5kZXggPSBtZXRhLmZpbmRJbmRleCggeCA9PiB4LnBpZCA9PT0gYWMucGlkICYmIHguc2lkID09PSBhYy5zaWQgKTtcblxuICAgICAgICAgICAgICAgICAgICAvLyDmm7/mjaJcbiAgICAgICAgICAgICAgICAgICAgaWYgKCBwaW5UYXJnZXRJbmRleCAhPT0gLTEgKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBtZXRhLnNwbGljZSggcGluVGFyZ2V0SW5kZXgsIDEsIE9iamVjdC5hc3NpZ24oeyB9LCBwaW5UYXJnZXQsIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcmljZTogYWMuYWNfcHJpY2UsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZ3JvdXBQcmljZTogYWMuYWNfZ3JvdXBQcmljZVxuICAgICAgICAgICAgICAgICAgICAgICAgfSkpO1xuXG4gICAgICAgICAgICAgICAgICAgIC8vIOaWsOWinlxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgbWV0YS5wdXNoKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzaWQ6IGFjLnNpZCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwaWQ6IGFjLnBpZCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbWc6IGFjLmltZyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiBhYy50aXRsZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYW5QaW46ICEhc2hvcHBpbmcuZmluZCggcyA9PiBzLnNpZCA9PT0gYWMuc2lkICYmIHMucGlkID09PSBhYy5waWQgKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcmljZTogYWMuYWNfcHJpY2UsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZ3JvdXBQcmljZTogYWMuYWNfZ3JvdXBQcmljZSBcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgIGNvbnN0IG1ldGEyID0gbWV0YS5tYXAoIHggPT4gT2JqZWN0LmFzc2lnbih7IH0sIHgsIHtcbiAgICAgICAgICAgICAgICAgICAgZGVsdGE6IE51bWJlciggeC5wcmljZSAtIHguZ3JvdXBQcmljZSApLnRvRml4ZWQoIDAgKVxuICAgICAgICAgICAgICAgIH0pKTtcblxuICAgICAgICAgICAgICAgIHJldHVybiBtZXRhMjtcbiAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgIC8vIOenr+WIhuWMuumXtFxuICAgICAgICAgICAgaW50ZWdyYWwkOiBmdW5jdGlvbiggKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgeyBkZXRhaWwsIHB1c2hJbnRlZ3JhbFJhdGUgfSA9IHRoaXMuZGF0YTtcbiAgICAgICAgICAgICAgICBpZiAoICFkZXRhaWwgKSB7IFxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gJyc7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGNvbnN0IHJlc3VsdCA9IGRlbGF5ZXJpbmdHb29kKCBkZXRhaWwsIHB1c2hJbnRlZ3JhbFJhdGUgKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVzdWx0LmludGVncmFsJDtcbiAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgIC8vIOivpuaDhVxuICAgICAgICAgICAgZGV0YWlsJDogZnVuY3Rpb24oICkge1xuICAgICAgICAgICAgICAgIGNvbnN0IHsgZGV0YWlsIH0gPSB0aGlzLmRhdGE7XG4gICAgICAgICAgICAgICAgY29uc3QgciA9IGRlbGF5ZXJpbmdHb29kKCBkZXRhaWwgKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gcjtcbiAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgIC8vIOatpOi0puWPt++8jOaYr+WQpuacieWNlVxuICAgICAgICAgICAgaGFzT3JkZXIkKCApIHtcbiAgICAgICAgICAgICAgICBjb25zdCB7IG9wZW5pZCwgdHJpcFNob3BwaW5nbGlzdCB9ID0gdGhpcy5kYXRhO1xuICAgICAgICAgICAgICAgIGNvbnN0IHIgPSAodHJpcFNob3BwaW5nbGlzdCB8fCBbIF0pXG4gICAgICAgICAgICAgICAgICAgIC5maWx0ZXIoIHNsID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHsgdWlkcyB9ID0gc2w7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdWlkcy5pbmNsdWRlcyggb3BlbmlkICk7XG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgY29uc3QgcmVzdWx0ID0gQXJyYXkuaXNBcnJheSggdHJpcFNob3BwaW5nbGlzdCApICYmIHRyaXBTaG9wcGluZ2xpc3QubGVuZ3RoID4gMFxuICAgICAgICAgICAgICAgICAgICA/IHIubGVuZ3RoID4gMCA6IGZhbHNlO1xuICAgICAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICAgICAgICB9LFxuXG4gICAgICAgICAgICAvLyDllYblk4HnmoTorr/pl67orrDlvZVcbiAgICAgICAgICAgIHZpc2l0b3JzJCggKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgeyB2aXNpdG9ycywgb3BlbmlkIH0gPSB0aGlzLmRhdGE7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHZpc2l0b3JzLmZpbHRlciggeCA9PiB4Lm9wZW5pZCAhPT0gb3BlbmlkICk7XG4gICAgICAgICAgICB9LFxuXG4gICAgICAgICAgICAvLyDllYblk4HnmoTorr/pl64gKyDnpL7kuqTlsZ7mgKfmqKHlnZdcbiAgICAgICAgICAgIHNvY2lhbCQoICkge1xuICAgICAgICAgICAgICAgIGNvbnN0IHsgdmlzaXRvcnMsIG9wZW5pZCwgZGV0YWlsIH0gPSB0aGlzLmRhdGE7XG4gICAgICAgICAgICAgICAgY29uc3QgZ29vZCA9IGRlbGF5ZXJpbmdHb29kKCBkZXRhaWwgKTsgXG4gICAgICAgICAgICAgICAgY29uc3QgZ2V0UmFuZG9tID0gbiA9PiBNYXRoLmZsb29yKCBNYXRoLnJhbmRvbSggKSAqIG4gKTtcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICBjb25zdCBhbGxUZXh0cyA9IFtcbiAgICAgICAgICAgICAgICAgICAgYOe+pOWPi+S5n+WcqOeci2AsXG4gICAgICAgICAgICAgICAgICAgIGDnvqTlj4vlnKjlhbPms6jjgIwke2dvb2QudGFnVGV4dH3jgI1gLFxuICAgICAgICAgICAgICAgICAgICBg576k5Y+L5oSf5YW06Laj77yM6Lef5aW55ou85ZuiYFxuICAgICAgICAgICAgICAgIF07XG5cbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICBjb25zdCBhbGxWaXNpdG9ycyA9IHZpc2l0b3JzXG4gICAgICAgICAgICAgICAgICAgIC5maWx0ZXIoIHggPT4geC5vcGVuaWQgIT09IG9wZW5pZCApXG4gICAgICAgICAgICAgICAgICAgIC5tYXAoIHggPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgcmFuZG9tTnVtID0gZ2V0UmFuZG9tKCBhbGxUZXh0cy5sZW5ndGggKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYXZhdGFyOiB4LmF2YXRhclVybCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZXh0OiBhbGxUZXh0c1sgcmFuZG9tTnVtIF1cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICByZXR1cm4gYWxsVmlzaXRvcnM7XG5cbiAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgIC8vIOW9k+WJjeWVhuWTgeeahOi0reeJqea4heWNlVxuICAgICAgICAgICAgc2hvcHBpbmckKCApIHtcbiAgICAgICAgICAgICAgICBjb25zdCB7IHNob3BwaW5nLCBpZCB9ID0gdGhpcy5kYXRhO1xuICAgICAgICAgICAgICAgIHJldHVybiBzaG9wcGluZ1xuICAgICAgICAgICAgICAgICAgICAuZmlsdGVyKCB4ID0+IHgucGlkID09PSBpZCApXG4gICAgICAgICAgICAgICAgICAgIC5tYXAoIHNsID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHsgdXNlcnMsIHNpZCwgZGV0YWlsIH0gPSBzbDtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHsgbmFtZSB9ID0gZGV0YWlsO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAuLi5zbCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBuYW1lLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZpcnN0VXNlcjogdXNlcnNbIDAgXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvdGhlclVzZXI6IHVzZXJzLnNsaWNlKCAxICksXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICB9LFxuXG4gICAgICAgICAgICAvLyDooYznqIvkuK3nmoTlhbbku5botK3nianmuIXljZVcbiAgICAgICAgICAgIG90aGVyU2hvcHBpbmckKCApIHtcbiAgICAgICAgICAgICAgICBjb25zdCB7IHNob3BwaW5nLCBpZCB9ID0gdGhpcy5kYXRhO1xuICAgICAgICAgICAgICAgIHJldHVybiBzaG9wcGluZ1xuICAgICAgICAgICAgICAgICAgICAuZmlsdGVyKCB4ID0+IHgucGlkICE9PSBpZCApXG4gICAgICAgICAgICAgICAgICAgIC5tYXAoIHNsID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHsgdXNlcnMsIHNpZCwgZGV0YWlsIH0gPSBzbDtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHsgbmFtZSB9ID0gZGV0YWlsO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAuLi5zbCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBuYW1lLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZpcnN0VXNlcjogdXNlcnNbIDAgXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvdGhlclVzZXI6IHVzZXJzLnNsaWNlKCAxICksXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICB9LFxuXG4gICAgICAgICAgICAvLyDooYznqIvkuK3vvIzlvZPliY3kuqflk4HmiYDmnInlnovlj7fliqDotbfmnaXvvIzmnInlpJrlsJHkurrlnKjmi7zlm6JcbiAgICAgICAgICAgIGFsbFBpblBsYXllcnMkKCApIHtcbiAgICAgICAgICAgICAgICBjb25zdCB7IGlkLCBzaG9wcGluZyB9ID0gdGhpcy5kYXRhO1xuICAgICAgICAgICAgICAgIGNvbnN0IGdvb2RTaG9wcGluZyA9IHNob3BwaW5nLmZpbHRlciggeCA9PiB4LnBpZCA9PT0gaWQgKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gZ29vZFNob3BwaW5nLnJlZHVjZSgoIHgsIHNsICkgPT4ge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4geCArIHNsLnVpZHMubGVuZ3RoO1xuICAgICAgICAgICAgICAgIH0sIDAgKTtcbiAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICog546w5Zyo5Yiw5YeM5pmoMeeCueeahOWAkuiuoeaXtlxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICBjb3VudERvd25OaWdodCQoICkge1xuICAgICAgICAgICAgICAgIGNvbnN0IG5vdyA9IG5ldyBEYXRlKCApO1xuICAgICAgICAgICAgICAgIGNvbnN0IHkgPSBub3cuZ2V0RnVsbFllYXIoICk7XG4gICAgICAgICAgICAgICAgY29uc3QgbSA9IG5vdy5nZXRNb250aCggKSArIDE7XG4gICAgICAgICAgICAgICAgY29uc3QgZCA9IG5vdy5nZXREYXRlKCApO1xuICAgICAgICAgICAgICAgIGNvbnN0IHRvZGF5T25lID0gbmV3IERhdGUoYCR7eX0vJHttfS8ke2R9IDAxOjAwOjAwYCk7XG4gICAgICAgICAgICAgICAgY29uc3QgdG9tb3Jyb3dPbmUgPSB0b2RheU9uZS5nZXRUaW1lKCApICsgMjQgKiA2MCAqIDYwICogMTAwMDtcbiAgICAgICAgICAgICAgICByZXR1cm4gKCggdG9tb3Jyb3dPbmUgLSBEYXRlLm5vdyggKSkgLyAxMDAwICkudG9GaXhlZCggMCApO1xuICAgICAgICAgICAgfSxcblxuICAgICAgICB9KVxuICAgIH0sXG5cbiAgICAvKiog55uR5ZCs5YWo5bGA566h55CG5ZGY5p2D6ZmQICovXG4gICAgd2F0Y2hSb2xlKCApIHtcbiAgICAgICAgKGFwcCBhcyBhbnkpLndhdGNoJCgncm9sZScsICggdmFsICkgPT4ge1xuICAgICAgICAgICAgdGhpcy5zZXREYXRhISh7XG4gICAgICAgICAgICAgICAgc2hvd0FkbUJ0bjogKCB2YWwgPT09IDEgKVxuICAgICAgICAgICAgfSlcbiAgICAgICAgfSk7XG4gICAgICAgIChhcHAgYXMgYW55KS53YXRjaCQoJ2lzTmV3JywgdmFsID0+IHtcbiAgICAgICAgICAgIHRoaXMuc2V0RGF0YSEoe1xuICAgICAgICAgICAgICAgIGlzTmV3OiB2YWxcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICAgICAgKGFwcCBhcyBhbnkpLndhdGNoJCgnYXBwQ29uZmlnJywgdmFsID0+IHtcbiAgICAgICAgICAgIGlmICggIXZhbCApIHsgcmV0dXJuOyB9XG4gICAgICAgICAgICB0aGlzLnNldERhdGEhKHtcbiAgICAgICAgICAgICAgICBpcE5hbWU6IHZhbFsnaXAtbmFtZSddLFxuICAgICAgICAgICAgICAgIGlwQXZhdGFyOiB2YWxbJ2lwLWF2YXRhciddLFxuICAgICAgICAgICAgICAgIHB1c2hJbnRlZ3JhbFJhdGU6ICh2YWwgfHwgeyB9KVsncHVzaC1pbnRlZ3JhbC1nZXQtcmF0ZSddIHx8IDAsXG4gICAgICAgICAgICAgICAgY2FuSW50ZWdyYXlTaGFyZTogISEodmFsIHx8IHsgfSlbJ2dvb2QtaW50ZWdyYWwtc2hhcmUnXSB8fCBmYWxzZVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB0aGlzLmNyZWF0ZVNoYXJlKCApO1xuICAgICAgICB9KTtcbiAgICAgICAgKGFwcCBhcyBhbnkpLndhdGNoJCgnb3BlbmlkJywgdmFsID0+IHtcbiAgICAgICAgICAgIHRoaXMuc2V0RGF0YSEoe1xuICAgICAgICAgICAgICAgIG9wZW5pZDogdmFsXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHRoaXMuY3JlYXRlU2hhcmUoICk7XG4gICAgICAgICAgICB0aGlzLmZldGNoU2hhcmVyKCApO1xuICAgICAgICB9KTtcbiAgICAgICAgYXBwLndhdGNoJCgnaXNVc2VyQXV0aCcsIHZhbCA9PiB7XG4gICAgICAgICAgICBpZiAoIHZhbCA9PT0gdW5kZWZpbmVkICkgeyByZXR1cm47IH1cbiAgICAgICAgICAgIHRoaXMuc2V0RGF0YSEoe1xuICAgICAgICAgICAgICAgIGlzVXNlckF1dGg6IHZhbFxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH0sXG5cbiAgICAvKiog5ouJ5Y+W5ZWG5ZOB6K+m5oOFICovXG4gICAgZmV0RGV0YWlsKCBpZCApIHtcbiAgICAgICAgY29uc3QgeyBkZXRhaWwsIGZyb20gfSA9IHRoaXMuZGF0YTtcbiAgICAgICAgaWYgKCBkZXRhaWwgKSB7IHJldHVybjsgfVxuICAgICAgICBodHRwKHtcbiAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICBfaWQ6IGlkLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGVyck1zZzogJ+iOt+WPluWVhuWTgemUmeivr++8jOivt+mHjeivlScsXG4gICAgICAgICAgICB1cmw6IGBnb29kX2RldGFpbGAsXG4gICAgICAgICAgICBzdWNjZXNzOiByZXMgPT4ge1xuICAgICAgICAgICAgICBpZiAoIHJlcy5zdGF0dXMgIT09IDIwMCApIHsgcmV0dXJuOyB9XG5cbiAgICAgICAgICAgICAgICBsZXQgcGluOiBhbnkgPSBbIF07XG4gICAgICAgICAgICAgICAgY29uc3QgeyBzdGFuZGFyZHMsIGdyb3VwUHJpY2UsIGFjdGl2aXRpZXMgfSA9IHJlcy5kYXRhO1xuXG4gICAgICAgICAgICAgICAgaWYgKCBzdGFuZGFyZHMubGVuZ3RoID4gMCApIHtcbiAgICAgICAgICAgICAgICAgICAgcGluID0gc3RhbmRhcmRzLmZpbHRlciggeCA9PiAhIXguZ3JvdXBQcmljZSApO1xuXG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmICggISFncm91cFByaWNlICkge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCB7IHByaWNlLCB0aXRsZSwgaW1nICB9ID0gcmVzLmRhdGE7XG4gICAgICAgICAgICAgICAgICAgIHBpbiA9IFt7XG4gICAgICAgICAgICAgICAgICAgICAgICBwcmljZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6IHRpdGxlLFxuICAgICAgICAgICAgICAgICAgICAgICAgZ3JvdXBQcmljZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGltZzogaW1nWyAwIF1cbiAgICAgICAgICAgICAgICAgICAgfV07XG4gICAgICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgICAgIGNvbnN0IGFjdGl2aXRpZXMkID0gYWN0aXZpdGllcy5tYXAoIHggPT4ge1xuXG4gICAgICAgICAgICAgICAgICAgIGxldCBpbWcgPSAnJztcbiAgICAgICAgICAgICAgICAgICAgaWYgKCAhIXguc2lkICkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaW1nID0gc3RhbmRhcmRzLmZpbmQoIHkgPT4geS5faWQgPT09IHguc2lkICkuaW1nXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpbWcgPSByZXMuZGF0YS5pbWdbIDAgXTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBPYmplY3QuYXNzaWduKHsgfSwgeCwgeyBcbiAgICAgICAgICAgICAgICAgICAgICAgIGltZyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvdW50ZG93bjogKCB4LmVuZFRpbWUgLSBuZXcgRGF0ZSggKS5nZXRUaW1lKCApKSAvICggMTAwMCApXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgfSkuZmlsdGVyKCB5ID0+IHkuZW5kVGltZSA+IG5ldyBEYXRlKCApLmdldFRpbWUoICkpO1xuXG4gICAgICAgICAgICAgICAgdGhpcy5zZXREYXRhISh7XG4gICAgICAgICAgICAgICAgICAgIHBpbixcbiAgICAgICAgICAgICAgICAgICAgbG9hZGluZzogZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgIGRldGFpbDogcmVzLmRhdGEsXG4gICAgICAgICAgICAgICAgICAgIGFjdGl2aXRpZXM6IGFjdGl2aXRpZXMkXG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICAvLyDlvLnotbfmi7zlm6LmoYZcbiAgICAgICAgICAgICAgICBpZiAoICEhZnJvbSAmJiBkZWxheWVyaW5nR29vZCggcmVzLmRhdGEgKS5oYXNQaW4gKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc2V0RGF0YSEoe1xuICAgICAgICAgICAgICAgICAgICAgICAgc2hvd1BsYXlUaXBzOiAnc2hvdydcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmICggIWZyb20gJiYgZGVsYXllcmluZ0dvb2QoIHJlcy5kYXRhICkuaGFzUGluICkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmNoZWNrT3BlblBpbiggKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH0sXG5cbiAgICAvKiog5ouJ5Y+W6KGM56iL55qE6LSt54mp6K+35Y2V5L+h5oGvICovXG4gICAgZmV0Y2hTaG9wcGluZyggcGlkLCB0aWQgKSB7XG4gICAgICAgIGlmICggIXBpZCB8fCAhdGlkICkgeyByZXR1cm47IH1cblxuICAgICAgICBodHRwKHtcbiAgICAgICAgICAgIHVybDogJ3Nob3BwaW5nLWxpc3RfcGluJyxcbiAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAvLyBwaWQsXG4gICAgICAgICAgICAgICAgdGlkLFxuICAgICAgICAgICAgICAgIGRldGFpbDogdHJ1ZSxcbiAgICAgICAgICAgICAgICBzaG93VXNlcjogdHJ1ZVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHN1Y2Nlc3M6IHJlcyA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3QgeyBzdGF0dXMsIGRhdGEgfSA9IHJlcztcbiAgICAgICAgICAgICAgICBpZiAoIHN0YXR1cyAhPT0gMjAwICkgeyByZXR1cm47IH1cbiAgICAgICAgICAgICAgICB0aGlzLnNldERhdGEhKHtcbiAgICAgICAgICAgICAgICAgICAgc2hvcHBpbmc6IGRhdGEsXG4gICAgICAgICAgICAgICAgICAgIGNhblBpblNrdTogZGF0YS5tYXAoIHggPT4gKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHBpZDogeC5waWQsXG4gICAgICAgICAgICAgICAgICAgICAgICBzaWQ6IHguc2lkXG4gICAgICAgICAgICAgICAgICAgIH0pKVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KVxuICAgIH0sXG5cbiAgICAvKiog5ouJ5Y+W5b2T5YmN5ZWG5ZOB55qE6K6/6Zeu6K6w5b2VICovXG4gICAgZmV0Y2hWaXNpdFJlY29yZCggcGlkLCBzdGFydCwgYmVmb3JlICkge1xuICAgICAgICBpZiAoICFzdGFydCB8fCAhYmVmb3JlICkgeyByZXR1cm47IH1cbiAgICAgICAgaHR0cCh7XG4gICAgICAgICAgICB1cmw6ICdnb29kX2dvb2QtdmlzaXRvcnMnLFxuICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgIHBpZCxcbiAgICAgICAgICAgICAgICBzdGFydCwgXG4gICAgICAgICAgICAgICAgYmVmb3JlXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgc3VjY2VzczogcmVzID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCB7IHN0YXR1cywgZGF0YSB9ID0gcmVzO1xuICAgICAgICAgICAgICAgIGlmICggc3RhdHVzICE9PSAyMDAgKSB7IHJldHVybjsgfVxuICAgICAgICAgICAgICAgIHRoaXMuc2V0RGF0YSEoe1xuICAgICAgICAgICAgICAgICAgICB2aXNpdG9yczogZGF0YVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9LFxuXG4gICAgLyoqIOaLieWPluS4pOS4quacgOaWsOihjOeoiyAqL1xuICAgIGZldGNoTGFzdCggKSB7XG4gICAgICAgIGNvbnN0IHsgaWQgfSA9IHRoaXMuZGF0YTtcbiAgICAgICAgaHR0cCh7XG4gICAgICAgICAgICBkYXRhOiB7IH0sXG4gICAgICAgICAgICB1cmw6IGB0cmlwX2VudGVyYCxcbiAgICAgICAgICAgIHN1Y2Nlc3M6IHJlcyA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3QgeyBzdGF0dXMsIGRhdGEgfSA9IHJlcztcbiAgICAgICAgICAgICAgICBpZiAoIHN0YXR1cyAhPT0gMjAwICkgeyByZXR1cm47IH1cbiAgICAgICAgICAgICAgICBjb25zdCB0cmlwID0gZGF0YVsgMCBdO1xuICAgICAgICAgICAgICAgIGlmICggISF0cmlwICkge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCB7IF9pZCwgc3RhcnRfZGF0ZSwgZW5kX2RhdGUgfSA9IHRyaXA7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHRpZCA9IF9pZFxuXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZmV0Y2hTaG9wcGluZyggaWQsIHRpZCApO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmZldGNoVmlzaXRSZWNvcmQoIGlkLCBzdGFydF9kYXRlLCBlbmRfZGF0ZSApO1xuXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc2V0RGF0YSEoe1xuICAgICAgICAgICAgICAgICAgICAgICAgdGlkLFxuICAgICAgICAgICAgICAgICAgICAgICAgdHJpcFxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgfSxcblxuICAgIC8qKiDojrflj5bkuIrkuKrliIbkuqvkurrnmoTlpLTlg48gKi9cbiAgICBmZXRjaFNoYXJlciggKSB7XG4gICAgICAgIGNvbnN0IHsgb3BlbmlkLCBmcm9tIH0gPSB0aGlzLmRhdGE7XG4gICAgICAgIGlmICggIWZyb20gfHwgIW9wZW5pZCB8fCBmcm9tID09PSBvcGVuaWQgKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgaHR0cCh7XG4gICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgb3BlbmlkOiBmcm9tIFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHVybDogJ2NvbW1vbl9nZXQtdXNlci1pbmZvJyxcbiAgICAgICAgICAgIHN1Y2Nlc3M6IHJlcyA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3QgeyBzdGF0dXMsIGRhdGEgfSA9IHJlcztcbiAgICAgICAgICAgICAgICBpZiAoIHN0YXR1cyAhPT0gMjAwIHx8ICFkYXRhICkgeyByZXR1cm47IH1cbiAgICAgICAgICAgICAgICB0aGlzLnNldERhdGEhKHtcbiAgICAgICAgICAgICAgICAgICAgc2hhcmVGcm9tVXNlcjogZGF0YVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KVxuICAgIH0sXG5cbiAgICBpbml0Q292ZXJUZXh0KCApIHtcbiAgICAgICAgY29uc3QgbnVtID0gMTggKyBNYXRoLmNlaWwoIE1hdGgucmFuZG9tKCApICogMjApO1xuICAgICAgICB0aGlzLnNldERhdGEhKHtcbiAgICAgICAgICAgIGNvdmVyVGV4dDogYCR7bnVtfeS6uueci+i/h2BcbiAgICAgICAgfSk7XG4gICAgfSxcblxuICAgIC8qKiDliJvlu7rliIbkuqvorrDlvZUgKi9cbiAgICBjcmVhdGVTaGFyZSggKSB7XG4gICAgICAgIGNvbnN0IHsgaWQsIGNhbkludGVncmF5U2hhcmUsIGZyb20sIG9wZW5pZCB9ID0gdGhpcy5kYXRhO1xuICAgICAgICBpZiAoICFpZCB8fCAhY2FuSW50ZWdyYXlTaGFyZSB8fCAhZnJvbSB8fCAhb3BlbmlkICkgeyByZXR1cm47IH1cbiAgICAgICAgaHR0cCh7XG4gICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgZnJvbSxcbiAgICAgICAgICAgICAgICBwaWQ6IGlkLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHVybDogJ2NvbW1vbl9jcmVhdGUtc2hhcmUnXG4gICAgICAgIH0pO1xuICAgIH0sXG5cbiAgICAvLyDlsZXlvIDmi7zlm6Lnjqnms5Xmj5DnpLpcbiAgICB0b2dnbGVQYWx5VGlwcyggZT8gKSB7XG4gICAgICAgIGNvbnN0IHsgc2hvd1BsYXlUaXBzIH0gPSB0aGlzLmRhdGE7XG4gICAgICAgIHRoaXMuc2V0RGF0YSEoe1xuICAgICAgICAgICAgc2hvd1BsYXlUaXBzOiBzaG93UGxheVRpcHMgPT09ICdzaG93JyA/ICdoaWRlJyA6ICdzaG93J1xuICAgICAgICB9KTtcbiAgICB9LFxuXG4gICAgLy8g6I635Y+W5o6I5p2D44CB5YWz6Zet5ou85Zui546p5rOV5o+Q56S6XG4gICAgZ2V0VXNlckF1dGgoICkge1xuICAgICAgICBhcHAuZ2V0V3hVc2VySW5mbygoICkgPT4ge1xuICAgICAgICAgICAgdGhpcy5zZXREYXRhISh7XG4gICAgICAgICAgICAgICAgc2hvd1BsYXlUaXBzOiAnaGlkZSdcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9LFxuXG4gICAgLy8g5bGV56S65o6o5bm/56ev5YiG6KeE5YiZXG4gICAgdG9nZ2xlU2hhcmVHZXRNb25leSggKSB7XG4gICAgICAgIGNvbnN0IHsgc2hvd1NoYXJlR2V0TW9uZXkgfSA9IHRoaXMuZGF0YTtcbiAgICAgICAgdGhpcy5zZXREYXRhISh7XG4gICAgICAgICAgICBzaG93U2hhcmVHZXRNb25leTogIXNob3dTaGFyZUdldE1vbmV5XG4gICAgICAgIH0pO1xuICAgICAgICBpZiAoICFzaG93U2hhcmVHZXRNb25leSApIHtcbiAgICAgICAgICAgIHRoaXMub25TdWJzY3JpYmUoICk7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgLy8g5bGV56S65ou85Zui5YiX6KGoXG4gICAgdG9nZ2xlUGluR29vZHMoICkge1xuICAgICAgICBjb25zdCB7IHNob3dQaW5Hb29kcyB9ID0gdGhpcy5kYXRhO1xuICAgICAgICB0aGlzLnNldERhdGEhKHtcbiAgICAgICAgICAgIHNob3dQaW5Hb29kczogc2hvd1Bpbkdvb2RzID09PSAnaGlkZScgPyAnc2hvdycgOiAnaGlkZSdcbiAgICAgICAgfSk7XG4gICAgICAgIGlmICggc2hvd1Bpbkdvb2RzID09PSAnaGlkZScgKSB7XG4gICAgICAgICAgICB0aGlzLm9uU3Vic2NyaWJlKCApO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIG9uU3Vic2NyaWJlKCApIHtcbiAgICAgICAgYXBwLmdldFN1YnNjcmliZSgnYnV5UGluLHdhaXRQaW4sdHJpcCcpO1xuICAgIH0sXG5cbiAgICAvLyDov5vlhaXllYblk4HnrqHnkIZcbiAgICBnb01hbmFnZXIoICkge1xuICAgICAgICBuYXZUbyhgL3BhZ2VzL21hbmFnZXItZ29vZHMtZGV0YWlsL2luZGV4P2lkPSR7dGhpcy5kYXRhLmlkfWApO1xuICAgIH0sXG5cbiAgICAvLyDov5vlhaXmi7zlm6Llub/lnLpcbiAgICBnb0dyb3VuZCggKSB7XG4gICAgICAgIG5hdlRvKCcvcGFnZXMvZ3JvdW5kLXBpbi9pbmRleCcpXG4gICAgfSxcbiAgICBcbiAgICAvLyDov5vlhaXllYblk4Hor6bmg4VcbiAgICBnb0dvb2REZXRhaWwoeyBjdXJyZW50VGFyZ2V0IH0pIHtcbiAgICAgICAgY29uc3QgeyBwaWQgfSA9IGN1cnJlbnRUYXJnZXQuZGF0YXNldDtcbiAgICAgICAgbmF2VG8oYC9wYWdlcy9nb29kcy1kZXRhaWwvaW5kZXg/aWQ9JHtwaWR9YClcbiAgICB9LFxuXG4gICAgLyoqIOmihOiniOWbvueJhyAqL1xuICAgIHByZXZpZXdJbWcoeyBjdXJyZW50VGFyZ2V0IH0pIHtcbiAgICAgICAgY29uc3QgeyBpbWcgfSA9IGN1cnJlbnRUYXJnZXQuZGF0YXNldDtcbiAgICAgICAgdGhpcy5kYXRhLmRldGFpbCAmJiB3eC5wcmV2aWV3SW1hZ2Uoe1xuICAgICAgICAgICAgY3VycmVudDogaW1nLFxuICAgICAgICAgICAgdXJsczogWyAuLi4odGhpcy5kYXRhIGFzIGFueSkuZGV0YWlsLmltZyBdLFxuICAgICAgICB9KTtcbiAgICB9LFxuXG4gICAgLyoqIOmihOiniOWNleW8oOWbvueJh++8muaLvOWbouWbvueJh+OAgeS4gOWPo+S7t++8iOmZkOaXtuaKou+8iSAqL1xuICAgIHByZXZpZXdTaW5nbGVJbWcoeyBjdXJyZW50VGFyZ2V0IH0pIHtcblxuICAgICAgICBjb25zdCBpbWcgPSBjdXJyZW50VGFyZ2V0LmRhdGFzZXQuZGF0YSA/XG4gICAgICAgICAgICBjdXJyZW50VGFyZ2V0LmRhdGFzZXQuZGF0YS5pbWc6XG4gICAgICAgICAgICBjdXJyZW50VGFyZ2V0LmRhdGFzZXQuaW1nO1xuXG4gICAgICAgIHRoaXMuZGF0YS5kZXRhaWwgJiYgd3gucHJldmlld0ltYWdlKHtcbiAgICAgICAgICAgIGN1cnJlbnQ6IGltZyxcbiAgICAgICAgICAgIHVybHM6IFsgaW1nIF0sXG4gICAgICAgIH0pO1xuICAgIH0sXG5cbiAgICAvKiog5qOA5p+l5piv5ZCm5pyJ5Li75Yqo5by55byA6L+H5ou85Zui546p5rOVICovXG4gICAgY2hlY2tPcGVuUGluKCApIHtcbiAgICAgICAgY29uc3QgeyBkZXRhaWwgfSA9IHRoaXMuZGF0YTtcbiAgICAgICAgaWYgKCAhZGV0YWlsICkgeyByZXR1cm4gfVxuICAgICAgICBjb25zdCByZXN1bHQgPSBkZWxheWVyaW5nR29vZCggZGV0YWlsICk7XG4gICAgICAgIGlmICggcmVzdWx0ICkge1xuICAgICAgICAgICAgY29uc3Qgb25lRGF5ID0gMjQgKiA2MCAqIDYwICogMTAwMDtcbiAgICAgICAgICAgIGNvbnN0IHByaWNlR2FwID0gU3RyaW5nKCByZXN1bHQuZ29vZFBpbnMuZWFjaFByaWNlUm91bmQgKS5yZXBsYWNlKC9cXC4wMC9nLCAnJyk7XG4gICAgICAgICAgICBjb25zdCBvcGVuUmVjb3JkID0gd3guZ2V0U3RvcmFnZVN5bmMoIHN0b3JhZ2VLZXkgKTtcblxuICAgICAgICAgICAgaWYgKCAhIXByaWNlR2FwICYmIERhdGUubm93KCApIC0gTnVtYmVyKCBvcGVuUmVjb3JkICkgPj0gb25lRGF5ICkge1xuICAgICAgICAgICAgICAgIHd4LnNldFN0b3JhZ2VTeW5jKCBzdG9yYWdlS2V5LCBTdHJpbmcoIERhdGUubm93KCApKSk7XG4gICAgICAgICAgICAgICAgdGhpcy50b2dnbGVQYWx5VGlwcyggKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICAvKiog6K6+572u4oCc5Zac5qyi4oCdICovXG4gICAgb25MaWtlKCApIHtcbiAgICAgICAgY29uc3QgdGhhdCA9IHRoaXM7XG4gICAgICAgIGlmICggIXRoaXMuZGF0YS5oYXNJbml0TGlrZSApIHsgcmV0dXJuOyB9XG4gICAgICAgIGh0dHAoe1xuICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgIHBpZDogdGhpcy5kYXRhLmlkXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgdXJsOiAnbGlrZV9jcmVhdGUnLFxuICAgICAgICAgICAgc3VjY2VzczogICggcmVzOiBhbnkgKSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKCByZXMuc3RhdHVzID09PSAyMDAgKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc2V0RGF0YSEoe1xuICAgICAgICAgICAgICAgICAgICAgICAgbGlrZWQ6ICF0aGlzLmRhdGEubGlrZWRcbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH0sXG5cbiAgICAvKiog6K6+572u4oCc5Zac5qyi4oCdICovXG4gICAgY2hlY2tMaWtlKCApIHtcbiAgICAgICAgY29uc3QgdGhhdCA9IHRoaXM7XG4gICAgICAgIGh0dHAoe1xuICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgIHBpZDogdGhpcy5kYXRhLmlkXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgdXJsOiAnbGlrZV9jaGVjaycsXG4gICAgICAgICAgICBzdWNjZXNzOiAgKCByZXM6IGFueSApID0+IHtcbiAgICAgICAgICAgICAgICBpZiAoIHJlcy5zdGF0dXMgPT09IDIwMCApIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zZXREYXRhISh7XG4gICAgICAgICAgICAgICAgICAgICAgICBsaWtlZDogcmVzLmRhdGEsXG4gICAgICAgICAgICAgICAgICAgICAgICBoYXNJbml0TGlrZTogdHJ1ZVxuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfSxcblxuICAgIC8qKiDmtbfmiqXlvIDlhbPnm5HlkKwgKi9cbiAgICBvblBvc3RUb2dnbGUoIGUgKSB7XG4gICAgICAgIGNvbnN0IHZhbCA9IGUuZGV0YWlsO1xuICAgICAgICB0aGlzLnNldERhdGEhKHtcbiAgICAgICAgICAgIHNob3dpbmdQb3N0ZXI6IHZhbFxuICAgICAgICB9KTtcbiAgICAgICAgd3guc2V0TmF2aWdhdGlvbkJhclRpdGxlKHtcbiAgICAgICAgICAgIHRpdGxlOiB2YWwgPyAn5YiG5Lqr5ZWG5ZOBJyA6ICfllYblk4Hor6bmg4UnXG4gICAgICAgIH0pO1xuICAgIH0sXG5cbiAgICAvKiog5rW35oqlLS3lvIAgKi9cbiAgICBvcGVuUG9zdGVyKCApIHtcbiAgICAgICAgY29uc3QgeyBzaG93aW5nUG9zdGVyIH0gPSB0aGlzLmRhdGE7XG4gICAgICAgIGNvbnN0IHBvc3RlciA9ICh0aGlzIGFzIGFueSkuc2VsZWN0Q29tcG9uZW50KCcjcG9zdGVyJyk7XG4gICAgICAgIHBvc3Rlci50b2dnbGUoICk7XG4gICAgICAgIGlmICggIXNob3dpbmdQb3N0ZXIgKSB7XG4gICAgICAgICAgICB0aGlzLm9uU3Vic2NyaWJlKCApO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIC8qKiDmtbfmiqUtLeWFsyAqL1xuICAgIGNsb3NlUG9zdGVyKCApIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGNvbnN0IHBvc3RlciA9ICh0aGlzIGFzIGFueSkuc2VsZWN0Q29tcG9uZW50KCcjcG9zdGVyJyk7XG4gICAgICAgICAgICBwb3N0ZXIuY2xvc2UoICk7XG4gICAgICAgIH0gY2F0Y2ggKCBlICkgeyB9XG4gICAgfSxcblxuICAgIC8qKiBza3XpgInmi6nlvLnmoYYgKi9cbiAgICBvblNrdVRvZ2dsZSggZSApIHtcbiAgICAgICAgdGhpcy5zZXREYXRhISh7XG4gICAgICAgICAgICBvcGVuaW5nU2t1OiBlLmRldGFpbFxuICAgICAgICB9KTtcbiAgICB9LFxuXG4gICAgLyoqIHNrdeafkOmDqOWIhueCueWHuyAqL1xuICAgIG9uU2t1VGFwKCBlICkge1xuICAgICAgICBjb25zdCB0eXBlID0gZS5kZXRhaWw7XG4gICAgICAgIGlmICggdHlwZSA9PT0gJ21vbmV5UXVlc3Rpb24nICkge1xuICAgICAgICAgICAgdGhpcy50b2dnbGVTaGFyZUdldE1vbmV5KCApO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIC8qKiDlsZXlvIDjgIHlhbPpl61za3XmoYYgKi9cbiAgICBvblRvZ2dsZVNrdSggKSB7XG4gICAgICAgIGNvbnN0IHsgb3BlbmluZ1NrdSB9ID0gdGhpcy5kYXRhO1xuICAgICAgICBjb25zdCBza3UgPSAodGhpcyBhcyBhbnkpLnNlbGVjdENvbXBvbmVudCgnI3NrdScpO1xuICAgICAgICBza3UudG9nZ2xlU2t1KCApO1xuICAgICAgICBpZiAoICFvcGVuaW5nU2t1ICkge1xuICAgICAgICAgICAgdGhpcy5vblN1YnNjcmliZSggKTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICAvKiog6L2s5Y+R5bCB6Z2iICovXG4gICAgb25Db3ZlckRvbmUoIGUgKSB7XG4gICAgICAgIHRoaXMuc2V0RGF0YSEoe1xuICAgICAgICAgICAgc2hhcmVDb3ZlcjogZS5kZXRhaWxcbiAgICAgICAgfSk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIOeUn+WRveWRqOacn+WHveaVsC0t55uR5ZCs6aG16Z2i5Yqg6L29XG4gICAgICoge1xuICAgICAqICAgIGlkIHx8IHNjZW5lIC8vIOWVhuWTgWlkXG4gICAgICogICAgdGlkIC8vIOihjOeoi2lkXG4gICAgICogICAgZnJvbSAvLyDliIbkuqvkurrnmoRpZFxuICAgICAqIH1cbiAgICAgKi9cbiAgICBvbkxvYWQ6IGZ1bmN0aW9uIChvcHRpb25zKSB7XG5cbiAgICAgICAgY29uc3Qgc2NlbmUgPSBkZWNvZGVVUklDb21wb25lbnQoIG9wdGlvbnMhLnNjZW5lIHx8ICcnIClcbiAgICAgICAgY29uc3QgaWQgPSBvcHRpb25zIS5pZCB8fCBzY2VuZSB8fCAnMWEyNzUxZWY1Y2FiNTA0NDAyODNlNTlhMTBkMjRiZWMnO1xuXG4gICAgICAgIHRoaXMucnVuQ29tcHV0ZWQoICk7XG4gICAgICAgIHRoaXMuaW5pdENvdmVyVGV4dCggKTtcblxuICAgICAgICBpZiAoICEhaWQgKSB7IFxuICAgICAgICAgICAgdGhpcy5zZXREYXRhISh7XG4gICAgICAgICAgICAgICAgaWRcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCAhIShvcHRpb25zIGFzIGFueSkuZnJvbSApIHtcbiAgICAgICAgICAgIHRoaXMuc2V0RGF0YSEoe1xuICAgICAgICAgICAgICAgIGZyb206IG9wdGlvbnMhLmZyb21cbiAgICAgICAgICAgIH0pXG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgIHNldFRpbWVvdXQoKCApID0+IHtcbiAgICAgICAgICAgIHRoaXMud2F0Y2hSb2xlKCApO1xuICAgICAgICAgICAgdGhpcy5mZXRjaExhc3QoICk7XG4gICAgICAgICAgICB0aGlzLmZldERldGFpbCggaWQgKTtcbiAgICAgICAgfSwgMjAgKTtcbiAgICB9LFxuICBcbiAgICAvKipcbiAgICAgKiDnlJ/lkb3lkajmnJ/lh73mlbAtLeebkeWQrOmhtemdouWIneasoea4suafk+WujOaIkFxuICAgICAqL1xuICAgIG9uUmVhZHk6IGZ1bmN0aW9uICggKSB7XG4gICAgICAgIGxldCBjaXJjbGVDb3VudCA9IDA7IFxuICAgICAgICBjb25zdCB0aGF0OiBhbnkgPSB0aGlzO1xuICAgICAgICAvLyDlv4Pot7PnmoTlpJbmoYbliqjnlLsgXG4gICAgICAgIHRoYXQuYW5pbWF0aW9uTWlkZGxlSGVhZGVySXRlbSA9IHd4LmNyZWF0ZUFuaW1hdGlvbih7IFxuICAgICAgICAgICAgZHVyYXRpb246IDgwMCwgXG4gICAgICAgICAgICB0aW1pbmdGdW5jdGlvbjogJ2Vhc2UnLCBcbiAgICAgICAgICAgIHRyYW5zZm9ybU9yaWdpbjogJzUwJSA1MCUnLFxuICAgICAgICB9KTsgXG4gICAgICAgIHNldEludGVydmFsKCBmdW5jdGlvbiggKSB7IFxuICAgICAgICAgICAgaWYgKGNpcmNsZUNvdW50ICUgMiA9PSAwKSB7IFxuICAgICAgICAgICAgICAgIHRoYXQuYW5pbWF0aW9uTWlkZGxlSGVhZGVySXRlbS5zY2FsZSggMS4wICkucm90YXRlKCAxMCApLnN0ZXAoICk7IFxuICAgICAgICAgICAgfSBlbHNlIHsgXG4gICAgICAgICAgICAgICAgdGhhdC5hbmltYXRpb25NaWRkbGVIZWFkZXJJdGVtLnNjYWxlKCAxLjAgKS5yb3RhdGUoIC0zMCApLnN0ZXAoICk7IFxuICAgICAgICAgICAgfSBcbiAgICAgICAgICAgIHRoYXQuc2V0RGF0YSh7IFxuICAgICAgICAgICAgICAgIGFuaW1hdGlvbk1pZGRsZUhlYWRlckl0ZW06IHRoYXQuYW5pbWF0aW9uTWlkZGxlSGVhZGVySXRlbS5leHBvcnQoICkgXG4gICAgICAgICAgICB9KTsgXG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGlmICggKytjaXJjbGVDb3VudCA9PT0gMTAwMCApIHsgXG4gICAgICAgICAgICAgICAgY2lyY2xlQ291bnQgPSAwOyBcbiAgICAgICAgICAgIH0gXG4gICAgICAgIH0uYmluZCggdGhpcyApLCAxMDAwICk7IFxuICAgIH0sXG4gIFxuICAgIC8qKlxuICAgICAqIOeUn+WRveWRqOacn+WHveaVsC0t55uR5ZCs6aG16Z2i5pi+56S6XG4gICAgICovXG4gICAgb25TaG93OiBmdW5jdGlvbiAoICkge1xuICAgICAgICBjb25zdCB7IGlkLCB0aWQsIHRyaXAgfSA9IHRoaXMuZGF0YTtcbiAgICAgICAgXG4gICAgICAgIHRoaXMuZmV0Y2hTaG9wcGluZyggaWQsIHRpZCApO1xuICAgICAgICBpZiAoICEhdHJpcCApIHtcbiAgICAgICAgICAgIGNvbnN0IHsgc3RhcnRfZGF0ZSwgZW5kX2RhdGUgfSA9ICh0cmlwIGFzIGFueSk7XG4gICAgICAgICAgICB0aGlzLmZldGNoVmlzaXRSZWNvcmQoIGlkLCBzdGFydF9kYXRlLCBlbmRfZGF0ZSApO1xuICAgICAgICB9XG5cbiAgICB9LFxuICBcbiAgICAvKipcbiAgICAgKiDnlJ/lkb3lkajmnJ/lh73mlbAtLeebkeWQrOmhtemdoumakOiXj1xuICAgICAqL1xuICAgIG9uSGlkZTogZnVuY3Rpb24gKCkge1xuICBcbiAgICB9LFxuICBcbiAgICAvKipcbiAgICAgKiDnlJ/lkb3lkajmnJ/lh73mlbAtLeebkeWQrOmhtemdouWNuOi9vVxuICAgICAqL1xuICAgIG9uVW5sb2FkOiBmdW5jdGlvbiAoKSB7XG4gIFxuICAgIH0sXG4gIFxuICAgIC8qKlxuICAgICAqIOmhtemdouebuOWFs+S6i+S7tuWkhOeQhuWHveaVsC0t55uR5ZCs55So5oi35LiL5ouJ5Yqo5L2cXG4gICAgICovXG4gICAgb25QdWxsRG93blJlZnJlc2g6IGZ1bmN0aW9uICgpIHtcbiAgXG4gICAgfSxcbiAgXG4gICAgLyoqXG4gICAgICog6aG16Z2i5LiK5ouJ6Kem5bqV5LqL5Lu255qE5aSE55CG5Ye95pWwXG4gICAgICovXG4gICAgb25SZWFjaEJvdHRvbTogZnVuY3Rpb24gKCkge1xuICBcbiAgICB9LFxuICBcbiAgICAvKipcbiAgICAgKiDnlKjmiLfngrnlh7vlj7PkuIrop5LliIbkuqtcbiAgICAgKi9cbiAgICBvblNoYXJlQXBwTWVzc2FnZTogZnVuY3Rpb24gKCBlICkge1xuICAgICAgICBjb25zdCB7IGhhc09yZGVyJCwgZGV0YWlsJCwgb3BlbmlkLCBzaGFyZUNvdmVyIH0gPSAodGhpcy5kYXRhIGFzIGFueSk7XG5cbiAgICAgICAgdGhpcy5jbG9zZVBvc3RlciggKTtcbiAgICAgICAgc2V0VGltZW91dCgoICkgPT4ge1xuICAgICAgICAgICAgY29uc3Qgc2hhcmVGZWRiYWNrID0gKHRoaXMgYXMgYW55KS5zZWxlY3RDb21wb25lbnQoJyNzaGFyZS1mZWVkYmFjaycpO1xuICAgICAgICAgICAgc2hhcmVGZWRiYWNrLnRvZ2dsZSggKTtcbiAgICAgICAgfSwgNTAwICk7XG5cbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGltYWdlVXJsOiBzaGFyZUNvdmVyIHx8IGAke2RldGFpbCQuaW1nWyAwIF19YCxcbiAgICAgICAgICAgIHBhdGg6IGAvcGFnZXMvZ29vZHMtZGV0YWlsL2luZGV4P2lkPSR7ZGV0YWlsJC5faWR9JmZyb209JHtvcGVuaWR9YCxcbiAgICAgICAgICAgIHRpdGxlOiAhIWRldGFpbCQgJiYgZGV0YWlsJC5oYXNQaW4gJiYgIWhhc09yZGVyJCA/XG4gICAgICAgICAgICAgICAgYOacieS6uuaDs+imgeWQl++8n+aLvOWbouS5sO+8jOaIkeS7rOmDveiDveecge+8gSR7ZGV0YWlsJC50aXRsZX0gJHtkZXRhaWwkLnRhZ1RleHR9YCA6XG4gICAgICAgICAgICAgICAgYOaOqOiNkOOAjCR7ZGV0YWlsJC50YWdUZXh0feOAjeelnuWZqCEke2RldGFpbCQudGl0bGV9YFxuICAgICAgICB9XG4gICAgfVxuICB9KSJdfQ==