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
                console.log('...', r);
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
        var _this = this;
        var _a = this.data, hasOrder$ = _a.hasOrder$, detail$ = _a.detail$, openid = _a.openid;
        setTimeout(function () {
            var shareFedback = _this.selectComponent('#share-feedback');
            shareFedback.toggle();
        }, 500);
        return {
            imageUrl: "" + detail$.img[0],
            path: "/pages/goods-detail/index?id=" + detail$._id + "&from=" + openid,
            title: !!detail$ && detail$.hasPin && !hasOrder$ ?
                "\u6709\u4EBA\u60F3\u8981\u5417\uFF1F\u62FC\u56E2\u4E70\uFF0C\u6211\u4EEC\u90FD\u80FD\u7701\uFF01" + detail$.title :
                "\u63A8\u8350\u300C" + detail$.tagText + "\u300D\u795E\u5668!" + detail$.title
        };
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7O0FBQ0EsOENBQTBDO0FBQzFDLHFEQUFvRDtBQUNwRCxnREFBcUQ7QUFDckQsZ0RBQTRDO0FBRTVDLElBQU0sR0FBRyxHQUFHLE1BQU0sRUFBUSxDQUFDO0FBRzNCLElBQU0sVUFBVSxHQUFHLG9CQUFvQixDQUFDO0FBRXhDLElBQUksQ0FBQztJQUdELHlCQUF5QixFQUFFLElBQUk7SUFLL0IsSUFBSSxFQUFFO1FBRUYsVUFBVSxFQUFFLElBQUk7UUFHaEIsTUFBTSxFQUFFLEVBQUU7UUFHVixRQUFRLEVBQUUsRUFBRTtRQUdaLEtBQUssRUFBRSxJQUFJO1FBR1gsR0FBRyxFQUFFLEVBQUU7UUFHUCxFQUFFLEVBQUUsRUFBRTtRQUdOLE1BQU0sRUFBRSxJQUFJO1FBR1osR0FBRyxFQUFFLEVBQUc7UUFHUixPQUFPLEVBQUUsSUFBSTtRQUdiLFdBQVcsRUFBRSxLQUFLO1FBR2xCLEtBQUssRUFBRSxLQUFLO1FBR1osV0FBVyxFQUFFO1lBQ1QsTUFBTSxFQUFFLE1BQU0sRUFBRSxNQUFNO1NBQ3pCO1FBR0QseUJBQXlCLEVBQUUsSUFBSTtRQUcvQixPQUFPLEVBQUUsS0FBSztRQUdkLGFBQWEsRUFBRSxLQUFLO1FBR3BCLFlBQVksRUFBRSxNQUFNO1FBR3BCLGlCQUFpQixFQUFFLEtBQUs7UUFHeEIsWUFBWSxFQUFFLE1BQU07UUFHcEIsY0FBYyxFQUFFLEtBQUs7UUFHckIsR0FBRyxFQUFFLEVBQUc7UUFHUixRQUFRLEVBQUUsRUFBRztRQUdiLFVBQVUsRUFBRSxFQUFHO1FBR2YsU0FBUyxFQUFFLEVBQUc7UUFHZCxJQUFJLEVBQUUsSUFBSTtRQUdWLGdCQUFnQixFQUFFLEtBQUs7UUFHdkIsTUFBTSxFQUFFLEVBQUU7UUFHVixJQUFJLEVBQUUsRUFBRTtRQUdSLGdCQUFnQixFQUFFLENBQUM7UUFHbkIsVUFBVSxF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b3J0IHsgaHR0cCB9IGZyb20gJy4uLy4uL3V0aWwvaHR0cC5qcyc7XG5pbXBvcnQgeyBjb21wdXRlZCB9IGZyb20gJy4uLy4uL2xpYi92dWVmeS9pbmRleC5qcyc7XG5pbXBvcnQgeyBkZWxheWVyaW5nR29vZCB9IGZyb20gJy4uLy4uL3V0aWwvZ29vZHMuanMnO1xuaW1wb3J0IHsgbmF2VG8gfSBmcm9tICcuLi8uLi91dGlsL3JvdXRlLmpzJztcblxuY29uc3QgYXBwID0gZ2V0QXBwPGFueT4oICk7XG5cbi8vIOaJk+W8gOaLvOWbouaPkOekuueahGtleVxuY29uc3Qgc3RvcmFnZUtleSA9ICdvcGVuZWQtcGluLWluLWdvb2QnO1xuXG5QYWdlKHtcblxuICAgIC8vIOWKqOeUu1xuICAgIGFuaW1hdGlvbk1pZGRsZUhlYWRlckl0ZW06IG51bGwsXG5cbiAgICAvKipcbiAgICAgKiDpobXpnaLnmoTliJ3lp4vmlbDmja5cbiAgICAgKi9cbiAgICBkYXRhOiB7XG4gICAgICAgIC8vIOaYr+WQpuacieeUqOaIt+aOiOadg1xuICAgICAgICBpc1VzZXJBdXRoOiB0cnVlLFxuXG4gICAgICAgIC8vIGlwXG4gICAgICAgIGlwTmFtZTogJycsXG5cbiAgICAgICAgLy8gaXAgXG4gICAgICAgIGlwQXZhdGFyOiAnJyxcblxuICAgICAgICAvLyDmmK/lkKbkuLrmlrDlrqJcbiAgICAgICAgaXNOZXc6IHRydWUsXG5cbiAgICAgICAgLy8g6KGM56iLXG4gICAgICAgIHRpZDogJycsXG5cbiAgICAgICAgLy8g5ZWG5ZOBaWRcbiAgICAgICAgaWQ6ICcnLFxuXG4gICAgICAgIC8vIOWVhuWTgeivpuaDhVxuICAgICAgICBkZXRhaWw6IG51bGwsXG4gICAgICAgIFxuICAgICAgICAvLyDmlbDmja7lrZflhbhcbiAgICAgICAgZGljOiB7IH0sXG4gICAgICAgIFxuICAgICAgICAvLyDliqDovb3nirbmgIFcbiAgICAgICAgbG9hZGluZzogdHJ1ZSxcblxuICAgICAgICAvLyDmmK/lkKbliJ3lp4vljJbov4figJzllpzmrKLigJ1cbiAgICAgICAgaGFzSW5pdExpa2U6IGZhbHNlLFxuXG4gICAgICAgIC8vIOaYr+WQpuKAnOWWnOasouKAnVxuICAgICAgICBsaWtlZDogZmFsc2UsXG5cbiAgICAgICAgLy8g5paH5a2X5L+d6K+B5o+Q56S6XG4gICAgICAgIHByb21pc2VUaXBzOiBbXG4gICAgICAgICAgICAn5q2j5ZOB5L+d6K+BJywgJ+S7t+agvOS8mOWKvycsICfnnJ/kurrot5Hohb8nXG4gICAgICAgIF0sXG5cbiAgICAgICAgLy8g5Yqo55S7XG4gICAgICAgIGFuaW1hdGlvbk1pZGRsZUhlYWRlckl0ZW06IG51bGwsXG5cbiAgICAgICAgLy8g5bGV56S6566h55CG5YWl5Y+jXG4gICAgICAgIHNob3dCdG46IGZhbHNlLFxuXG4gICAgICAgIC8vIOato+WcqOWxleekuua1t+aKpVxuICAgICAgICBzaG93aW5nUG9zdGVyOiBmYWxzZSxcblxuICAgICAgICAvLyDlsZXnpLrmi7zlm6Lnjqnms5XnmoTlvLnmoYZcbiAgICAgICAgc2hvd1BsYXlUaXBzOiAnaGlkZScsXG5cbiAgICAgICAgLy8g5bGV56S65YiG5Lqr6LWa6ZKxXG4gICAgICAgIHNob3dTaGFyZUdldE1vbmV5OiBmYWxzZSxcblxuICAgICAgICAvLyDlsZXnpLrmi7zlm6LllYblk4HliJfooahcbiAgICAgICAgc2hvd1Bpbkdvb2RzOiAnaGlkZScsXG5cbiAgICAgICAgLy8g5YiG5LqrVGlwczJcbiAgICAgICAgc2hvd1NoYXJlVGlwczI6IGZhbHNlLFxuXG4gICAgICAgIC8vIOaLvOWbouWIl+ihqFxuICAgICAgICBwaW46IFsgXSxcblxuICAgICAgICAvLyDmnKzooYznqIvnmoTotK3nianmuIXljZXliJfooahcbiAgICAgICAgc2hvcHBpbmc6IFsgXSxcblxuICAgICAgICAvLyDkuIDlj6Pku7fmtLvliqjliJfooahcbiAgICAgICAgYWN0aXZpdGllczogWyBdLFxuXG4gICAgICAgIC8vIOacrOi2n+iDveWkn+aLvOWboueahHNrdVxuICAgICAgICBjYW5QaW5Ta3U6IFsgXSxcblxuICAgICAgICAvLyDlvZPliY3nmoTooYznqItcbiAgICAgICAgdHJpcDogbnVsbCxcblxuICAgICAgICAvLyDlvZPliY3mmK/lkKblvIDlkK/kuobnp6/liIbmjqjlub9cbiAgICAgICAgY2FuSW50ZWdyYXlTaGFyZTogZmFsc2UsXG5cbiAgICAgICAgLy8g5b2T5YmN6LSm5Y+355qEb3BlbmlkXG4gICAgICAgIG9wZW5pZDogJycsXG5cbiAgICAgICAgLy8g5YiG5Lqr5Lq655qEb3BlbmlkXG4gICAgICAgIGZyb206ICcnLFxuXG4gICAgICAgIC8vIOenr+WIhuaOqOW5v+iOt+eCueavlOS+i1xuICAgICAgICBwdXNoSW50ZWdyYWxSYXRlOiAwLFxuXG4gICAgICAgIC8vIOaYr+WQpuWxleW8gHNrdVxuICAgICAgICBvcGVuaW5nU2t1OiBmYWxzZSxcblxuICAgICAgICAvLyDorr/pl67orrDlvZVcbiAgICAgICAgdmlzaXRvcnM6IFsgXVxuICAgIH0sXG5cbiAgICAvKiog6K6+572uY29tcHV0ZWQgKi9cbiAgICBydW5Db21wdXRlZCggKSB7XG4gICAgICAgIGNvbXB1dGVkKCB0aGlzLCB7XG5cbiAgICAgICAgICAgIC8vIOiuoeeul+S7t+agvFxuICAgICAgICAgICAgcHJpY2U6IGZ1bmN0aW9uKCApIHtcbiAgICAgICAgICAgICAgICBjb25zdCB7IGRldGFpbCB9ID0gdGhpcy5kYXRhO1xuICAgICAgICAgICAgICAgIGNvbnN0IHJlc3VsdCA9IGRlbGF5ZXJpbmdHb29kKCBkZXRhaWwgKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVzdWx0ID8gcmVzdWx0LnByaWNlJCA6ICcnO1xuICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAgLy8g5ZWG5ZOB6K+m5oOFIC0g5YiG6KGM5pi+56S6XG4gICAgICAgICAgICBkZXRhaWxJbnRybzogZnVuY3Rpb24oICkge1xuICAgICAgICAgICAgICAgIGNvbnN0IHsgZGV0YWlsIH0gPSB0aGlzLmRhdGE7XG4gICAgICAgICAgICAgICAgaWYgKCAhZGV0YWlsIHx8ICggISFkZXRhaWwgJiYgIWRldGFpbC5kZXRhaWwgKSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gWyBdO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBkZXRhaWwuZGV0YWlsLnNwbGl0KCdcXG4nKS5maWx0ZXIoIHggPT4gISF4ICk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAgLy8g5Lu35qC8IO+9niDlm6LotK3ku7fnmoTlt67ku7dcbiAgICAgICAgICAgIHByaWNlR2FwOiBmdW5jdGlvbiggKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgeyBkZXRhaWwgfSA9IHRoaXMuZGF0YTtcbiAgICAgICAgICAgICAgICBpZiAoICFkZXRhaWwgKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAnJ1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHJlc3VsdCA9IGRlbGF5ZXJpbmdHb29kKCBkZXRhaWwgKTtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgZ2FwID0gcmVzdWx0ID8gU3RyaW5nKCByZXN1bHQuZ29vZFBpbnMuZWFjaFByaWNlUm91bmQgKS5yZXBsYWNlKC9cXC4wMC9nLCAnJykgOiAnJztcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgbWV0YSA9IGdhcCAhPT0gJzAnICYmICEhZ2FwID8gZ2FwIDogJyc7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBtZXRhO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgIC8vIOmprOS4iuWPr+S7peaLvOWboueahOS4quaVsFxuICAgICAgICAgICAgcGluQ291bnQkOiBmdW5jdGlvbiggKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgeyBpZCwgZGV0YWlsIH0gPSB0aGlzLmRhdGE7XG4gICAgICAgICAgICAgICAgY29uc3QgZ29vZFNob3BwaW5nID0gdGhpcy5kYXRhLnNob3BwaW5nLmZpbHRlciggeCA9PiB4LnBpZCA9PT0gaWQgKTtcbiAgICAgICAgICAgICAgICBpZiAoICFkZXRhaWwgKSB7IFxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gMDtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBjb25zdCB7IHN0YW5kYXJkcywgZ3JvdXBQcmljZSB9ID0gZGV0YWlsO1xuXG4gICAgICAgICAgICAgICAgaWYgKCAhIXN0YW5kYXJkcyAmJiBzdGFuZGFyZHMubGVuZ3RoID4gMCApIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHN0YW5kYXJkc1xuICAgICAgICAgICAgICAgICAgICAgICAgLmZpbHRlciggeCA9PiAhIWdvb2RTaG9wcGluZy5maW5kKCBzID0+IHMuc2lkID09PSB4Ll9pZCAmJiBzLnBpZCA9PT0geC5waWQgKSlcbiAgICAgICAgICAgICAgICAgICAgICAgIC5sZW5ndGg7XG5cbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKCAhIWdyb3VwUHJpY2UgKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHsgX2lkIH0gPSBkZXRhaWw7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAhIWdvb2RTaG9wcGluZy5maW5kKCBzID0+IHMucGlkID09PSBfaWQgKSA/IDEgOiAwXG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgcmV0dXJuIDA7XG4gICAgICAgICAgICB9LFxuXG4gICAgICAgICAgICAvLyDmi7zlm6LliJfooahcbiAgICAgICAgICAgIHBpbiQ6IGZ1bmN0aW9uKCApIHtcbiAgICAgICAgICAgICAgICBsZXQgbWV0YTogYW55ID0gWyBdO1xuICAgICAgICAgICAgICAgIGNvbnN0IHsgZGV0YWlsLCBzaG9wcGluZywgYWN0aXZpdGllcyB9ID0gdGhpcy5kYXRhO1xuXG4gICAgICAgICAgICAgICAgaWYgKCAhZGV0YWlsICkgeyBcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFsgXTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBjb25zdCB7IHN0YW5kYXJkcywgZ3JvdXBQcmljZSB9ID0gZGV0YWlsO1xuXG4gICAgICAgICAgICAgICAgaWYgKCBzdGFuZGFyZHMubGVuZ3RoID4gMCApIHtcbiAgICAgICAgICAgICAgICAgICAgbWV0YSA9IHN0YW5kYXJkc1xuICAgICAgICAgICAgICAgICAgICAgICAgLmZpbHRlciggeCA9PiAhIXguZ3JvdXBQcmljZSApXG4gICAgICAgICAgICAgICAgICAgICAgICAubWFwKCB4ID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gT2JqZWN0LmFzc2lnbih7IH0sIHgsIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2lkOiB4Ll9pZCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FuUGluOiAhIXNob3BwaW5nLmZpbmQoIHMgPT4gcy5zaWQgPT09IHguX2lkICYmIHMucGlkID09PSB4LnBpZCApXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmICggISFncm91cFByaWNlICkge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCB7IHByaWNlLCB0aXRsZSwgaW1nLCBfaWQgfSA9IGRldGFpbDtcbiAgICAgICAgICAgICAgICAgICAgbWV0YSA9IFt7XG4gICAgICAgICAgICAgICAgICAgICAgICBwcmljZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHBpZDogX2lkLFxuICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogdGl0bGUsXG4gICAgICAgICAgICAgICAgICAgICAgICBncm91cFByaWNlLFxuICAgICAgICAgICAgICAgICAgICAgICAgc2lkOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgICAgICAgICBpbWc6IGltZ1sgMCBdLFxuICAgICAgICAgICAgICAgICAgICAgICAgY2FuUGluOiAhIXNob3BwaW5nLmZpbmQoIHMgPT4gcy5waWQgPT09IF9pZCApXG4gICAgICAgICAgICAgICAgICAgIH1dO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIC8vIOagueaNrua0u+WKqO+8jOabtOaUueOAgeaWsOWinuaLvOWboumhueebrlxuICAgICAgICAgICAgICAgIGFjdGl2aXRpZXMubWFwKCBhYyA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGlmICggIWFjLmFjX2dyb3VwUHJpY2UgKSB7IHJldHVybjsgfVxuICAgICAgICAgICAgICAgICAgICBjb25zdCBwaW5UYXJnZXQgPSBtZXRhLmZpbmQoIHggPT4geC5waWQgPT09IGFjLnBpZCAmJiB4LnNpZCA9PT0gYWMuc2lkICk7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHBpblRhcmdldEluZGV4ID0gbWV0YS5maW5kSW5kZXgoIHggPT4geC5waWQgPT09IGFjLnBpZCAmJiB4LnNpZCA9PT0gYWMuc2lkICk7XG5cbiAgICAgICAgICAgICAgICAgICAgLy8g5pu/5o2iXG4gICAgICAgICAgICAgICAgICAgIGlmICggcGluVGFyZ2V0SW5kZXggIT09IC0xICkge1xuICAgICAgICAgICAgICAgICAgICAgICAgbWV0YS5zcGxpY2UoIHBpblRhcmdldEluZGV4LCAxLCBPYmplY3QuYXNzaWduKHsgfSwgcGluVGFyZ2V0LCB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJpY2U6IGFjLmFjX3ByaWNlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGdyb3VwUHJpY2U6IGFjLmFjX2dyb3VwUHJpY2VcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pKTtcblxuICAgICAgICAgICAgICAgICAgICAvLyDmlrDlop5cbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG1ldGEucHVzaCh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2lkOiBhYy5zaWQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcGlkOiBhYy5waWQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaW1nOiBhYy5pbWcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogYWMudGl0bGUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FuUGluOiAhIXNob3BwaW5nLmZpbmQoIHMgPT4gcy5zaWQgPT09IGFjLnNpZCAmJiBzLnBpZCA9PT0gYWMucGlkICksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJpY2U6IGFjLmFjX3ByaWNlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGdyb3VwUHJpY2U6IGFjLmFjX2dyb3VwUHJpY2UgXG4gICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICBjb25zdCBtZXRhMiA9IG1ldGEubWFwKCB4ID0+IE9iamVjdC5hc3NpZ24oeyB9LCB4LCB7XG4gICAgICAgICAgICAgICAgICAgIGRlbHRhOiBOdW1iZXIoIHgucHJpY2UgLSB4Lmdyb3VwUHJpY2UgKS50b0ZpeGVkKCAwIClcbiAgICAgICAgICAgICAgICB9KSk7XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gbWV0YTI7XG4gICAgICAgICAgICB9LFxuXG4gICAgICAgICAgICAvLyDnp6/liIbljLrpl7RcbiAgICAgICAgICAgIGludGVncmFsJDogZnVuY3Rpb24oICkge1xuICAgICAgICAgICAgICAgIGNvbnN0IHsgZGV0YWlsLCBwdXNoSW50ZWdyYWxSYXRlIH0gPSB0aGlzLmRhdGE7XG4gICAgICAgICAgICAgICAgaWYgKCAhZGV0YWlsICkgeyBcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuICcnO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBjb25zdCByZXN1bHQgPSBkZWxheWVyaW5nR29vZCggZGV0YWlsLCBwdXNoSW50ZWdyYWxSYXRlICk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlc3VsdC5pbnRlZ3JhbCQ7XG4gICAgICAgICAgICB9LFxuXG4gICAgICAgICAgICAvLyDor6bmg4VcbiAgICAgICAgICAgIGRldGFpbCQ6IGZ1bmN0aW9uKCApIHtcbiAgICAgICAgICAgICAgICBjb25zdCB7IGRldGFpbCB9ID0gdGhpcy5kYXRhO1xuICAgICAgICAgICAgICAgIGNvbnN0IHIgPSBkZWxheWVyaW5nR29vZCggZGV0YWlsICk7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coJy4uLicsIHIgKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gcjtcbiAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgIC8vIOatpOi0puWPt++8jOaYr+WQpuacieWNlVxuICAgICAgICAgICAgaGFzT3JkZXIkKCApIHtcbiAgICAgICAgICAgICAgICBjb25zdCB7IG9wZW5pZCwgdHJpcFNob3BwaW5nbGlzdCB9ID0gdGhpcy5kYXRhO1xuICAgICAgICAgICAgICAgIGNvbnN0IHIgPSAodHJpcFNob3BwaW5nbGlzdCB8fCBbIF0pXG4gICAgICAgICAgICAgICAgICAgIC5maWx0ZXIoIHNsID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHsgdWlkcyB9ID0gc2w7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdWlkcy5pbmNsdWRlcyggb3BlbmlkICk7XG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgY29uc3QgcmVzdWx0ID0gQXJyYXkuaXNBcnJheSggdHJpcFNob3BwaW5nbGlzdCApICYmIHRyaXBTaG9wcGluZ2xpc3QubGVuZ3RoID4gMFxuICAgICAgICAgICAgICAgICAgICA/IHIubGVuZ3RoID4gMCA6IGZhbHNlO1xuICAgICAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICAgICAgICB9LFxuXG4gICAgICAgICAgICAvLyDllYblk4HnmoTorr/pl67orrDlvZVcbiAgICAgICAgICAgIHZpc2l0b3JzJCggKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgeyB2aXNpdG9ycywgb3BlbmlkIH0gPSB0aGlzLmRhdGE7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHZpc2l0b3JzLmZpbHRlciggeCA9PiB4Lm9wZW5pZCAhPT0gb3BlbmlkICk7XG4gICAgICAgICAgICB9LFxuXG4gICAgICAgICAgICAvLyDllYblk4HnmoTorr/pl64gKyDnpL7kuqTlsZ7mgKfmqKHlnZdcbiAgICAgICAgICAgIHNvY2lhbCQoICkge1xuICAgICAgICAgICAgICAgIGNvbnN0IHsgdmlzaXRvcnMsIG9wZW5pZCwgZGV0YWlsIH0gPSB0aGlzLmRhdGE7XG4gICAgICAgICAgICAgICAgY29uc3QgZ29vZCA9IGRlbGF5ZXJpbmdHb29kKCBkZXRhaWwgKTsgXG4gICAgICAgICAgICAgICAgY29uc3QgZ2V0UmFuZG9tID0gbiA9PiBNYXRoLmZsb29yKCBNYXRoLnJhbmRvbSggKSAqIG4gKTtcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICBjb25zdCBhbGxUZXh0cyA9IFtcbiAgICAgICAgICAgICAgICAgICAgYOe+pOmHjOeahOWlueS5n+WcqOeci2AsXG4gICAgICAgICAgICAgICAgICAgIGDnvqTph4znmoTlpbnkuZ/lhbPms6jjgIwke2dvb2QudGFnVGV4dH3jgI1gLFxuICAgICAgICAgICAgICAgICAgICBg5aW55Lmf5oSf5YW06Laj77yM6Lef5aW55ou85ZuiYFxuICAgICAgICAgICAgICAgIF07XG5cbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICBjb25zdCBhbGxWaXNpdG9ycyA9IHZpc2l0b3JzXG4gICAgICAgICAgICAgICAgICAgIC5maWx0ZXIoIHggPT4geC5vcGVuaWQgIT09IG9wZW5pZCApXG4gICAgICAgICAgICAgICAgICAgIC5tYXAoIHggPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgcmFuZG9tTnVtID0gZ2V0UmFuZG9tKCBhbGxUZXh0cy5sZW5ndGggKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYXZhdGFyOiB4LmF2YXRhclVybCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZXh0OiBhbGxUZXh0c1sgcmFuZG9tTnVtIF1cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICByZXR1cm4gYWxsVmlzaXRvcnM7XG5cbiAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgIC8vIOW9k+WJjeWVhuWTgeeahOi0reeJqea4heWNlVxuICAgICAgICAgICAgc2hvcHBpbmckKCApIHtcbiAgICAgICAgICAgICAgICBjb25zdCB7IHNob3BwaW5nLCBpZCB9ID0gdGhpcy5kYXRhO1xuICAgICAgICAgICAgICAgIHJldHVybiBzaG9wcGluZ1xuICAgICAgICAgICAgICAgICAgICAuZmlsdGVyKCB4ID0+IHgucGlkID09PSBpZCApXG4gICAgICAgICAgICAgICAgICAgIC5tYXAoIHNsID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHsgdXNlcnMsIHNpZCwgZGV0YWlsIH0gPSBzbDtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHsgbmFtZSB9ID0gZGV0YWlsO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAuLi5zbCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBuYW1lLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZpcnN0VXNlcjogdXNlcnNbIDAgXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvdGhlclVzZXI6IHVzZXJzLnNsaWNlKCAxICksXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICB9LFxuXG4gICAgICAgICAgICAvLyDooYznqIvkuK3nmoTlhbbku5botK3nianmuIXljZVcbiAgICAgICAgICAgIG90aGVyU2hvcHBpbmckKCApIHtcbiAgICAgICAgICAgICAgICBjb25zdCB7IHNob3BwaW5nLCBpZCB9ID0gdGhpcy5kYXRhO1xuICAgICAgICAgICAgICAgIHJldHVybiBzaG9wcGluZ1xuICAgICAgICAgICAgICAgICAgICAuZmlsdGVyKCB4ID0+IHgucGlkICE9PSBpZCApXG4gICAgICAgICAgICAgICAgICAgIC5tYXAoIHNsID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHsgdXNlcnMsIHNpZCwgZGV0YWlsIH0gPSBzbDtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHsgbmFtZSB9ID0gZGV0YWlsO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAuLi5zbCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBuYW1lLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZpcnN0VXNlcjogdXNlcnNbIDAgXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvdGhlclVzZXI6IHVzZXJzLnNsaWNlKCAxICksXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICB9LFxuXG4gICAgICAgICAgICAvLyDooYznqIvkuK3vvIzlvZPliY3kuqflk4HmiYDmnInlnovlj7fliqDotbfmnaXvvIzmnInlpJrlsJHkurrlnKjmi7zlm6JcbiAgICAgICAgICAgIGFsbFBpblBsYXllcnMkKCApIHtcbiAgICAgICAgICAgICAgICBjb25zdCB7IGlkLCBzaG9wcGluZyB9ID0gdGhpcy5kYXRhO1xuICAgICAgICAgICAgICAgIGNvbnN0IGdvb2RTaG9wcGluZyA9IHNob3BwaW5nLmZpbHRlciggeCA9PiB4LnBpZCA9PT0gaWQgKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gZ29vZFNob3BwaW5nLnJlZHVjZSgoIHgsIHNsICkgPT4ge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4geCArIHNsLnVpZHMubGVuZ3RoO1xuICAgICAgICAgICAgICAgIH0sIDAgKTtcbiAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICog546w5Zyo5Yiw5YeM5pmoMeeCueeahOWAkuiuoeaXtlxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICBjb3VudERvd25OaWdodCQoICkge1xuICAgICAgICAgICAgICAgIGNvbnN0IG5vdyA9IG5ldyBEYXRlKCApO1xuICAgICAgICAgICAgICAgIGNvbnN0IHkgPSBub3cuZ2V0RnVsbFllYXIoICk7XG4gICAgICAgICAgICAgICAgY29uc3QgbSA9IG5vdy5nZXRNb250aCggKSArIDE7XG4gICAgICAgICAgICAgICAgY29uc3QgZCA9IG5vdy5nZXREYXRlKCApO1xuICAgICAgICAgICAgICAgIGNvbnN0IHRvZGF5T25lID0gbmV3IERhdGUoYCR7eX0vJHttfS8ke2R9IDAxOjAwOjAwYCk7XG4gICAgICAgICAgICAgICAgY29uc3QgdG9tb3Jyb3dPbmUgPSB0b2RheU9uZS5nZXRUaW1lKCApICsgMjQgKiA2MCAqIDYwICogMTAwMDtcbiAgICAgICAgICAgICAgICByZXR1cm4gKCggdG9tb3Jyb3dPbmUgLSBEYXRlLm5vdyggKSkgLyAxMDAwICkudG9GaXhlZCggMCApO1xuICAgICAgICAgICAgfSxcblxuICAgICAgICB9KVxuICAgIH0sXG5cbiAgICAvKiog55uR5ZCs5YWo5bGA566h55CG5ZGY5p2D6ZmQICovXG4gICAgd2F0Y2hSb2xlKCApIHtcbiAgICAgICAgKGFwcCBhcyBhbnkpLndhdGNoJCgncm9sZScsICggdmFsICkgPT4ge1xuICAgICAgICAgICAgdGhpcy5zZXREYXRhISh7XG4gICAgICAgICAgICAgICAgc2hvd0J0bjogKCB2YWwgPT09IDEgKVxuICAgICAgICAgICAgfSlcbiAgICAgICAgfSk7XG4gICAgICAgIChhcHAgYXMgYW55KS53YXRjaCQoJ2lzTmV3JywgdmFsID0+IHtcbiAgICAgICAgICAgIHRoaXMuc2V0RGF0YSEoe1xuICAgICAgICAgICAgICAgIGlzTmV3OiB2YWxcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICAgICAgKGFwcCBhcyBhbnkpLndhdGNoJCgnYXBwQ29uZmlnJywgdmFsID0+IHtcbiAgICAgICAgICAgIGlmICggIXZhbCApIHsgcmV0dXJuOyB9XG4gICAgICAgICAgICB0aGlzLnNldERhdGEhKHtcbiAgICAgICAgICAgICAgICBpcE5hbWU6IHZhbFsnaXAtbmFtZSddLFxuICAgICAgICAgICAgICAgIGlwQXZhdGFyOiB2YWxbJ2lwLWF2YXRhciddLFxuICAgICAgICAgICAgICAgIHB1c2hJbnRlZ3JhbFJhdGU6ICh2YWwgfHwgeyB9KVsncHVzaC1pbnRlZ3JhbC1nZXQtcmF0ZSddIHx8IDAsXG4gICAgICAgICAgICAgICAgY2FuSW50ZWdyYXlTaGFyZTogISEodmFsIHx8IHsgfSlbJ2dvb2QtaW50ZWdyYWwtc2hhcmUnXSB8fCBmYWxzZVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB0aGlzLmNyZWF0ZVNoYXJlKCApO1xuICAgICAgICB9KTtcbiAgICAgICAgKGFwcCBhcyBhbnkpLndhdGNoJCgnb3BlbmlkJywgdmFsID0+IHtcbiAgICAgICAgICAgIHRoaXMuc2V0RGF0YSEoe1xuICAgICAgICAgICAgICAgIG9wZW5pZDogdmFsXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHRoaXMuY3JlYXRlU2hhcmUoICk7XG4gICAgICAgIH0pO1xuICAgICAgICBhcHAud2F0Y2gkKCdpc1VzZXJBdXRoJywgdmFsID0+IHtcbiAgICAgICAgICAgIGlmICggdmFsID09PSB1bmRlZmluZWQgKSB7IHJldHVybjsgfVxuICAgICAgICAgICAgdGhpcy5zZXREYXRhISh7XG4gICAgICAgICAgICAgICAgaXNVc2VyQXV0aDogdmFsXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfSxcblxuICAgIC8qKiDmi4nlj5bllYblk4Hor6bmg4UgKi9cbiAgICBmZXREZXRhaWwoIGlkICkge1xuICAgICAgICBjb25zdCB7IGRldGFpbCwgZnJvbSB9ID0gdGhpcy5kYXRhO1xuICAgICAgICBpZiAoIGRldGFpbCApIHsgcmV0dXJuOyB9XG4gICAgICAgIGh0dHAoe1xuICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgIF9pZDogaWQsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgZXJyTXNnOiAn6I635Y+W5ZWG5ZOB6ZSZ6K+v77yM6K+36YeN6K+VJyxcbiAgICAgICAgICAgIHVybDogYGdvb2RfZGV0YWlsYCxcbiAgICAgICAgICAgIHN1Y2Nlc3M6IHJlcyA9PiB7XG4gICAgICAgICAgICAgIGlmICggcmVzLnN0YXR1cyAhPT0gMjAwICkgeyByZXR1cm47IH1cblxuICAgICAgICAgICAgICAgIGxldCBwaW46IGFueSA9IFsgXTtcbiAgICAgICAgICAgICAgICBjb25zdCB7IHN0YW5kYXJkcywgZ3JvdXBQcmljZSwgYWN0aXZpdGllcyB9ID0gcmVzLmRhdGE7XG5cbiAgICAgICAgICAgICAgICBpZiAoIHN0YW5kYXJkcy5sZW5ndGggPiAwICkge1xuICAgICAgICAgICAgICAgICAgICBwaW4gPSBzdGFuZGFyZHMuZmlsdGVyKCB4ID0+ICEheC5ncm91cFByaWNlICk7XG5cbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKCAhIWdyb3VwUHJpY2UgKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHsgcHJpY2UsIHRpdGxlLCBpbWcgIH0gPSByZXMuZGF0YTtcbiAgICAgICAgICAgICAgICAgICAgcGluID0gW3tcbiAgICAgICAgICAgICAgICAgICAgICAgIHByaWNlLFxuICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogdGl0bGUsXG4gICAgICAgICAgICAgICAgICAgICAgICBncm91cFByaWNlLFxuICAgICAgICAgICAgICAgICAgICAgICAgaW1nOiBpbWdbIDAgXVxuICAgICAgICAgICAgICAgICAgICB9XTtcbiAgICAgICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAgICAgY29uc3QgYWN0aXZpdGllcyQgPSBhY3Rpdml0aWVzLm1hcCggeCA9PiB7XG5cbiAgICAgICAgICAgICAgICAgICAgbGV0IGltZyA9ICcnO1xuICAgICAgICAgICAgICAgICAgICBpZiAoICEheC5zaWQgKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpbWcgPSBzdGFuZGFyZHMuZmluZCggeSA9PiB5Ll9pZCA9PT0geC5zaWQgKS5pbWdcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGltZyA9IHJlcy5kYXRhLmltZ1sgMCBdO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIE9iamVjdC5hc3NpZ24oeyB9LCB4LCB7IFxuICAgICAgICAgICAgICAgICAgICAgICAgaW1nLFxuICAgICAgICAgICAgICAgICAgICAgICAgY291bnRkb3duOiAoIHguZW5kVGltZSAtIG5ldyBEYXRlKCApLmdldFRpbWUoICkpIC8gKCAxMDAwIClcbiAgICAgICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICB9KS5maWx0ZXIoIHkgPT4geS5lbmRUaW1lID4gbmV3IERhdGUoICkuZ2V0VGltZSggKSk7XG5cbiAgICAgICAgICAgICAgICB0aGlzLnNldERhdGEhKHtcbiAgICAgICAgICAgICAgICAgICAgcGluLFxuICAgICAgICAgICAgICAgICAgICBsb2FkaW5nOiBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgZGV0YWlsOiByZXMuZGF0YSxcbiAgICAgICAgICAgICAgICAgICAgYWN0aXZpdGllczogYWN0aXZpdGllcyRcbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgIC8vIOW8uei1t+aLvOWbouahhlxuICAgICAgICAgICAgICAgIGlmICggISFmcm9tICYmIGRlbGF5ZXJpbmdHb29kKCByZXMuZGF0YSApLmhhc1BpbiApIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zZXREYXRhISh7XG4gICAgICAgICAgICAgICAgICAgICAgICBzaG93UGxheVRpcHM6ICdzaG93J1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKCAhZnJvbSAmJiBkZWxheWVyaW5nR29vZCggcmVzLmRhdGEgKS5oYXNQaW4gKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY2hlY2tPcGVuUGluKCApO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfSxcblxuICAgIC8qKiDmi4nlj5booYznqIvnmoTotK3nianor7fljZXkv6Hmga8gKi9cbiAgICBmZXRjaFNob3BwaW5nKCBwaWQsIHRpZCApIHtcbiAgICAgICAgaWYgKCAhcGlkIHx8ICF0aWQgKSB7IHJldHVybjsgfVxuXG4gICAgICAgIGh0dHAoe1xuICAgICAgICAgICAgdXJsOiAnc2hvcHBpbmctbGlzdF9waW4nLFxuICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgIC8vIHBpZCxcbiAgICAgICAgICAgICAgICB0aWQsXG4gICAgICAgICAgICAgICAgZGV0YWlsOiB0cnVlLFxuICAgICAgICAgICAgICAgIHNob3dVc2VyOiB0cnVlXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgc3VjY2VzczogcmVzID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCB7IHN0YXR1cywgZGF0YSB9ID0gcmVzO1xuICAgICAgICAgICAgICAgIGlmICggc3RhdHVzICE9PSAyMDAgKSB7IHJldHVybjsgfVxuICAgICAgICAgICAgICAgIHRoaXMuc2V0RGF0YSEoe1xuICAgICAgICAgICAgICAgICAgICBzaG9wcGluZzogZGF0YSxcbiAgICAgICAgICAgICAgICAgICAgY2FuUGluU2t1OiBkYXRhLm1hcCggeCA9PiAoe1xuICAgICAgICAgICAgICAgICAgICAgICAgcGlkOiB4LnBpZCxcbiAgICAgICAgICAgICAgICAgICAgICAgIHNpZDogeC5zaWRcbiAgICAgICAgICAgICAgICAgICAgfSkpXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgfSxcblxuICAgIC8qKiDmi4nlj5blvZPliY3llYblk4HnmoTorr/pl67orrDlvZUgKi9cbiAgICBmZXRjaFZpc2l0UmVjb3JkKCBwaWQsIHN0YXJ0LCBiZWZvcmUgKSB7XG4gICAgICAgIGlmICggIXN0YXJ0IHx8ICFiZWZvcmUgKSB7IHJldHVybjsgfVxuICAgICAgICBodHRwKHtcbiAgICAgICAgICAgIHVybDogJ2dvb2RfZ29vZC12aXNpdG9ycycsXG4gICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgcGlkLFxuICAgICAgICAgICAgICAgIHN0YXJ0LCBcbiAgICAgICAgICAgICAgICBiZWZvcmVcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBzdWNjZXNzOiByZXMgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IHsgc3RhdHVzLCBkYXRhIH0gPSByZXM7XG4gICAgICAgICAgICAgICAgaWYgKCBzdGF0dXMgIT09IDIwMCApIHsgcmV0dXJuOyB9XG4gICAgICAgICAgICAgICAgdGhpcy5zZXREYXRhISh7XG4gICAgICAgICAgICAgICAgICAgIHZpc2l0b3JzOiBkYXRhXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH0sXG5cbiAgICAvKiog5ouJ5Y+W5Lik5Liq5pyA5paw6KGM56iLICovXG4gICAgZmV0Y2hMYXN0KCApIHtcbiAgICAgICAgY29uc3QgeyBpZCB9ID0gdGhpcy5kYXRhO1xuICAgICAgICBodHRwKHtcbiAgICAgICAgICAgIGRhdGE6IHsgfSxcbiAgICAgICAgICAgIHVybDogYHRyaXBfZW50ZXJgLFxuICAgICAgICAgICAgc3VjY2VzczogcmVzID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCB7IHN0YXR1cywgZGF0YSB9ID0gcmVzO1xuICAgICAgICAgICAgICAgIGlmICggc3RhdHVzICE9PSAyMDAgKSB7IHJldHVybjsgfVxuICAgICAgICAgICAgICAgIGNvbnN0IHRyaXAgPSBkYXRhWyAwIF07XG4gICAgICAgICAgICAgICAgaWYgKCAhIXRyaXAgKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHsgX2lkLCBzdGFydF9kYXRlLCBlbmRfZGF0ZSB9ID0gdHJpcDtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgdGlkID0gX2lkXG5cbiAgICAgICAgICAgICAgICAgICAgdGhpcy5mZXRjaFNob3BwaW5nKCBpZCwgdGlkICk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZmV0Y2hWaXNpdFJlY29yZCggaWQsIHN0YXJ0X2RhdGUsIGVuZF9kYXRlICk7XG5cbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zZXREYXRhISh7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aWQsXG4gICAgICAgICAgICAgICAgICAgICAgICB0cmlwXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSlcbiAgICB9LFxuXG4gICAgLyoqIOWIm+W7uuWIhuS6q+iusOW9lSAqL1xuICAgIGNyZWF0ZVNoYXJlKCApIHtcbiAgICAgICAgY29uc3QgeyBpZCwgY2FuSW50ZWdyYXlTaGFyZSwgZnJvbSwgb3BlbmlkIH0gPSB0aGlzLmRhdGE7XG4gICAgICAgIGlmICggIWlkIHx8ICFjYW5JbnRlZ3JheVNoYXJlIHx8ICFmcm9tIHx8ICFvcGVuaWQgKSB7IHJldHVybjsgfVxuICAgICAgICBodHRwKHtcbiAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICBmcm9tLFxuICAgICAgICAgICAgICAgIHBpZDogaWQsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgdXJsOiAnY29tbW9uX2NyZWF0ZS1zaGFyZSdcbiAgICAgICAgfSk7XG4gICAgfSxcblxuICAgIC8vIOWxleW8gOaLvOWboueOqeazleaPkOekulxuICAgIHRvZ2dsZVBhbHlUaXBzKCBlPyApIHtcbiAgICAgICAgY29uc3QgeyBzaG93UGxheVRpcHMgfSA9IHRoaXMuZGF0YTtcbiAgICAgICAgdGhpcy5zZXREYXRhISh7XG4gICAgICAgICAgICBzaG93UGxheVRpcHM6IHNob3dQbGF5VGlwcyA9PT0gJ3Nob3cnID8gJ2hpZGUnIDogJ3Nob3cnXG4gICAgICAgIH0pO1xuICAgIH0sXG5cbiAgICAvLyDojrflj5bmjojmnYPjgIHlhbPpl63mi7zlm6Lnjqnms5Xmj5DnpLpcbiAgICBnZXRVc2VyQXV0aCggKSB7XG4gICAgICAgIGFwcC5nZXRXeFVzZXJJbmZvKCggKSA9PiB7XG4gICAgICAgICAgICB0aGlzLnNldERhdGEhKHtcbiAgICAgICAgICAgICAgICBzaG93UGxheVRpcHM6ICdoaWRlJ1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH0sXG5cbiAgICAvLyDlsZXnpLrmjqjlub/np6/liIbop4TliJlcbiAgICB0b2dnbGVTaGFyZUdldE1vbmV5KCApIHtcbiAgICAgICAgY29uc3QgeyBzaG93U2hhcmVHZXRNb25leSB9ID0gdGhpcy5kYXRhO1xuICAgICAgICB0aGlzLnNldERhdGEhKHtcbiAgICAgICAgICAgIHNob3dTaGFyZUdldE1vbmV5OiAhc2hvd1NoYXJlR2V0TW9uZXlcbiAgICAgICAgfSk7XG4gICAgICAgIGlmICggIXNob3dTaGFyZUdldE1vbmV5ICkge1xuICAgICAgICAgICAgdGhpcy5vblN1YnNjcmliZSggKTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICAvLyDlsZXnpLrmi7zlm6LliJfooahcbiAgICB0b2dnbGVQaW5Hb29kcyggKSB7XG4gICAgICAgIGNvbnN0IHsgc2hvd1Bpbkdvb2RzIH0gPSB0aGlzLmRhdGE7XG4gICAgICAgIHRoaXMuc2V0RGF0YSEoe1xuICAgICAgICAgICAgc2hvd1Bpbkdvb2RzOiBzaG93UGluR29vZHMgPT09ICdoaWRlJyA/ICdzaG93JyA6ICdoaWRlJ1xuICAgICAgICB9KTtcbiAgICAgICAgaWYgKCBzaG93UGluR29vZHMgPT09ICdoaWRlJyApIHtcbiAgICAgICAgICAgIHRoaXMub25TdWJzY3JpYmUoICk7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgb25TdWJzY3JpYmUoICkge1xuICAgICAgICBhcHAuZ2V0U3Vic2NyaWJlKCdidXlQaW4sd2FpdFBpbix0cmlwJyk7XG4gICAgfSxcblxuICAgIC8vIOi/m+WFpeWVhuWTgeeuoeeQhlxuICAgIGdvTWFuYWdlciggKSB7XG4gICAgICAgIG5hdlRvKGAvcGFnZXMvbWFuYWdlci1nb29kcy1kZXRhaWwvaW5kZXg/aWQ9JHt0aGlzLmRhdGEuaWR9YCk7XG4gICAgfSxcblxuICAgIC8vIOi/m+WFpeaLvOWbouW5v+WculxuICAgIGdvR3JvdW5kKCApIHtcbiAgICAgICAgbmF2VG8oJy9wYWdlcy9ncm91bmQtcGluL2luZGV4JylcbiAgICB9LFxuICAgIFxuICAgIC8vIOi/m+WFpeWVhuWTgeivpuaDhVxuICAgIGdvR29vZERldGFpbCh7IGN1cnJlbnRUYXJnZXQgfSkge1xuICAgICAgICBjb25zdCB7IHBpZCB9ID0gY3VycmVudFRhcmdldC5kYXRhc2V0O1xuICAgICAgICBuYXZUbyhgL3BhZ2VzL2dvb2RzLWRldGFpbC9pbmRleD9pZD0ke3BpZH1gKVxuICAgIH0sXG5cbiAgICAvKiog6aKE6KeI5Zu+54mHICovXG4gICAgcHJldmlld0ltZyh7IGN1cnJlbnRUYXJnZXQgfSkge1xuICAgICAgICBjb25zdCB7IGltZyB9ID0gY3VycmVudFRhcmdldC5kYXRhc2V0O1xuICAgICAgICB0aGlzLmRhdGEuZGV0YWlsICYmIHd4LnByZXZpZXdJbWFnZSh7XG4gICAgICAgICAgICBjdXJyZW50OiBpbWcsXG4gICAgICAgICAgICB1cmxzOiBbIC4uLih0aGlzLmRhdGEgYXMgYW55KS5kZXRhaWwuaW1nIF0sXG4gICAgICAgIH0pO1xuICAgIH0sXG5cbiAgICAvKiog6aKE6KeI5Y2V5byg5Zu+54mH77ya5ou85Zui5Zu+54mH44CB5LiA5Y+j5Lu377yI6ZmQ5pe25oqi77yJICovXG4gICAgcHJldmlld1NpbmdsZUltZyh7IGN1cnJlbnRUYXJnZXQgfSkge1xuXG4gICAgICAgIGNvbnN0IGltZyA9IGN1cnJlbnRUYXJnZXQuZGF0YXNldC5kYXRhID9cbiAgICAgICAgICAgIGN1cnJlbnRUYXJnZXQuZGF0YXNldC5kYXRhLmltZzpcbiAgICAgICAgICAgIGN1cnJlbnRUYXJnZXQuZGF0YXNldC5pbWc7XG5cbiAgICAgICAgdGhpcy5kYXRhLmRldGFpbCAmJiB3eC5wcmV2aWV3SW1hZ2Uoe1xuICAgICAgICAgICAgY3VycmVudDogaW1nLFxuICAgICAgICAgICAgdXJsczogWyBpbWcgXSxcbiAgICAgICAgfSk7XG4gICAgfSxcblxuICAgIC8qKiDmo4Dmn6XmmK/lkKbmnInkuLvliqjlvLnlvIDov4fmi7zlm6Lnjqnms5UgKi9cbiAgICBjaGVja09wZW5QaW4oICkge1xuICAgICAgICBjb25zdCB7IGRldGFpbCB9ID0gdGhpcy5kYXRhO1xuICAgICAgICBpZiAoICFkZXRhaWwgKSB7IHJldHVybiB9XG4gICAgICAgIGNvbnN0IHJlc3VsdCA9IGRlbGF5ZXJpbmdHb29kKCBkZXRhaWwgKTtcbiAgICAgICAgaWYgKCByZXN1bHQgKSB7XG4gICAgICAgICAgICBjb25zdCBvbmVEYXkgPSAyNCAqIDYwICogNjAgKiAxMDAwO1xuICAgICAgICAgICAgY29uc3QgcHJpY2VHYXAgPSBTdHJpbmcoIHJlc3VsdC5nb29kUGlucy5lYWNoUHJpY2VSb3VuZCApLnJlcGxhY2UoL1xcLjAwL2csICcnKTtcbiAgICAgICAgICAgIGNvbnN0IG9wZW5SZWNvcmQgPSB3eC5nZXRTdG9yYWdlU3luYyggc3RvcmFnZUtleSApO1xuXG4gICAgICAgICAgICBpZiAoICEhcHJpY2VHYXAgJiYgRGF0ZS5ub3coICkgLSBOdW1iZXIoIG9wZW5SZWNvcmQgKSA+PSBvbmVEYXkgKSB7XG4gICAgICAgICAgICAgICAgd3guc2V0U3RvcmFnZVN5bmMoIHN0b3JhZ2VLZXksIFN0cmluZyggRGF0ZS5ub3coICkpKTtcbiAgICAgICAgICAgICAgICB0aGlzLnRvZ2dsZVBhbHlUaXBzKCApO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSxcblxuICAgIC8qKiDorr7nva7igJzllpzmrKLigJ0gKi9cbiAgICBvbkxpa2UoICkge1xuICAgICAgICBjb25zdCB0aGF0ID0gdGhpcztcbiAgICAgICAgaWYgKCAhdGhpcy5kYXRhLmhhc0luaXRMaWtlICkgeyByZXR1cm47IH1cbiAgICAgICAgaHR0cCh7XG4gICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgcGlkOiB0aGlzLmRhdGEuaWRcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB1cmw6ICdsaWtlX2NyZWF0ZScsXG4gICAgICAgICAgICBzdWNjZXNzOiAgKCByZXM6IGFueSApID0+IHtcbiAgICAgICAgICAgICAgICBpZiAoIHJlcy5zdGF0dXMgPT09IDIwMCApIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zZXREYXRhISh7XG4gICAgICAgICAgICAgICAgICAgICAgICBsaWtlZDogIXRoaXMuZGF0YS5saWtlZFxuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfSxcblxuICAgIC8qKiDorr7nva7igJzllpzmrKLigJ0gKi9cbiAgICBjaGVja0xpa2UoICkge1xuICAgICAgICBjb25zdCB0aGF0ID0gdGhpcztcbiAgICAgICAgaHR0cCh7XG4gICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgcGlkOiB0aGlzLmRhdGEuaWRcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB1cmw6ICdsaWtlX2NoZWNrJyxcbiAgICAgICAgICAgIHN1Y2Nlc3M6ICAoIHJlczogYW55ICkgPT4ge1xuICAgICAgICAgICAgICAgIGlmICggcmVzLnN0YXR1cyA9PT0gMjAwICkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnNldERhdGEhKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxpa2VkOiByZXMuZGF0YSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGhhc0luaXRMaWtlOiB0cnVlXG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9LFxuXG4gICAgLyoqIOa1t+aKpeW8gOWFs+ebkeWQrCAqL1xuICAgIG9uUG9zdFRvZ2dsZSggZSApIHtcbiAgICAgICAgY29uc3QgdmFsID0gZS5kZXRhaWw7XG4gICAgICAgIHRoaXMuc2V0RGF0YSEoe1xuICAgICAgICAgICAgc2hvd2luZ1Bvc3RlcjogdmFsXG4gICAgICAgIH0pO1xuICAgICAgICB3eC5zZXROYXZpZ2F0aW9uQmFyVGl0bGUoe1xuICAgICAgICAgICAgdGl0bGU6IHZhbCA/ICfliIbkuqvllYblk4EnIDogJ+WVhuWTgeivpuaDhSdcbiAgICAgICAgfSk7XG4gICAgfSxcblxuICAgIC8qKiDmtbfmiqUtLeW8gCAqL1xuICAgIG9wZW5Qb3N0ZXIoICkge1xuICAgICAgICBjb25zdCB7IHNob3dpbmdQb3N0ZXIgfSA9IHRoaXMuZGF0YTtcbiAgICAgICAgY29uc3QgcG9zdGVyID0gKHRoaXMgYXMgYW55KS5zZWxlY3RDb21wb25lbnQoJyNwb3N0ZXInKTtcbiAgICAgICAgcG9zdGVyLnRvZ2dsZSggKTtcbiAgICAgICAgaWYgKCAhc2hvd2luZ1Bvc3RlciApIHtcbiAgICAgICAgICAgIHRoaXMub25TdWJzY3JpYmUoICk7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgLyoqIHNrdemAieaLqeW8ueahhiAqL1xuICAgIG9uU2t1VG9nZ2xlKCBlICkge1xuICAgICAgICB0aGlzLnNldERhdGEhKHtcbiAgICAgICAgICAgIG9wZW5pbmdTa3U6IGUuZGV0YWlsXG4gICAgICAgIH0pO1xuICAgIH0sXG5cbiAgICAvKiogc2t15p+Q6YOo5YiG54K55Ye7ICovXG4gICAgb25Ta3VUYXAoIGUgKSB7XG4gICAgICAgIGNvbnN0IHR5cGUgPSBlLmRldGFpbDtcbiAgICAgICAgaWYgKCB0eXBlID09PSAnbW9uZXlRdWVzdGlvbicgKSB7XG4gICAgICAgICAgICB0aGlzLnRvZ2dsZVNoYXJlR2V0TW9uZXkoICk7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgLyoqIOWxleW8gOOAgeWFs+mXrXNrdeahhiAqL1xuICAgIG9uVG9nZ2xlU2t1KCApIHtcbiAgICAgICAgY29uc3QgeyBvcGVuaW5nU2t1IH0gPSB0aGlzLmRhdGE7XG4gICAgICAgIGNvbnN0IHNrdSA9ICh0aGlzIGFzIGFueSkuc2VsZWN0Q29tcG9uZW50KCcjc2t1Jyk7XG4gICAgICAgIHNrdS50b2dnbGVTa3UoICk7XG4gICAgICAgIGlmICggIW9wZW5pbmdTa3UgKSB7XG4gICAgICAgICAgICB0aGlzLm9uU3Vic2NyaWJlKCApO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIOeUn+WRveWRqOacn+WHveaVsC0t55uR5ZCs6aG16Z2i5Yqg6L29XG4gICAgICoge1xuICAgICAqICAgIGlkIHx8IHNjZW5lIC8vIOWVhuWTgWlkXG4gICAgICogICAgdGlkIC8vIOihjOeoi2lkXG4gICAgICogICAgZnJvbSAvLyDliIbkuqvkurrnmoRpZFxuICAgICAqIH1cbiAgICAgKi9cbiAgICBvbkxvYWQ6IGZ1bmN0aW9uIChvcHRpb25zKSB7XG5cbiAgICAgICAgY29uc3Qgc2NlbmUgPSBkZWNvZGVVUklDb21wb25lbnQoIG9wdGlvbnMhLnNjZW5lIHx8ICcnIClcblxuICAgICAgICB0aGlzLnJ1bkNvbXB1dGVkKCApO1xuXG4gICAgICAgIHRoaXMuc2V0RGF0YSEoe1xuICAgICAgICAgICAgaWQ6ICcxYTI3NTFlZjVjYWI1MDQ0MDI4M2U1OWExMGQyNGJlYydcbiAgICAgICAgfSlcblxuICAgICAgICBpZiAoIG9wdGlvbnMhLmlkIHx8IHNjZW5lICkgeyBcbiAgICAgICAgICAgIHRoaXMuc2V0RGF0YSEoe1xuICAgICAgICAgICAgICAgIGlkOiBvcHRpb25zIS5pZCB8fCBzY2VuZSxcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCAhIShvcHRpb25zIGFzIGFueSkuZnJvbSApIHtcbiAgICAgICAgICAgIHRoaXMuc2V0RGF0YSEoe1xuICAgICAgICAgICAgICAgIGZyb206IG9wdGlvbnMhLmZyb21cbiAgICAgICAgICAgIH0pXG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgIHNldFRpbWVvdXQoKCApID0+IHtcbiAgICAgICAgICAgIHRoaXMud2F0Y2hSb2xlKCApO1xuICAgICAgICAgICAgLy8gdGhpcy5jaGVja0xpa2UoICk7XG4gICAgICAgICAgICB0aGlzLmZldGNoTGFzdCggKTtcbiAgICAgICAgfSwgMjAgKTtcbiAgICB9LFxuICBcbiAgICAvKipcbiAgICAgKiDnlJ/lkb3lkajmnJ/lh73mlbAtLeebkeWQrOmhtemdouWIneasoea4suafk+WujOaIkFxuICAgICAqL1xuICAgIG9uUmVhZHk6IGZ1bmN0aW9uICggKSB7XG4gICAgICAgIGxldCBjaXJjbGVDb3VudCA9IDA7IFxuICAgICAgICBjb25zdCB0aGF0OiBhbnkgPSB0aGlzO1xuICAgICAgICAvLyDlv4Pot7PnmoTlpJbmoYbliqjnlLsgXG4gICAgICAgIHRoYXQuYW5pbWF0aW9uTWlkZGxlSGVhZGVySXRlbSA9IHd4LmNyZWF0ZUFuaW1hdGlvbih7IFxuICAgICAgICAgICAgZHVyYXRpb246IDgwMCwgXG4gICAgICAgICAgICB0aW1pbmdGdW5jdGlvbjogJ2Vhc2UnLCBcbiAgICAgICAgICAgIHRyYW5zZm9ybU9yaWdpbjogJzUwJSA1MCUnLFxuICAgICAgICB9KTsgXG4gICAgICAgIHNldEludGVydmFsKCBmdW5jdGlvbiggKSB7IFxuICAgICAgICAgICAgaWYgKGNpcmNsZUNvdW50ICUgMiA9PSAwKSB7IFxuICAgICAgICAgICAgICAgIHRoYXQuYW5pbWF0aW9uTWlkZGxlSGVhZGVySXRlbS5zY2FsZSggMS4wICkucm90YXRlKCAxMCApLnN0ZXAoICk7IFxuICAgICAgICAgICAgfSBlbHNlIHsgXG4gICAgICAgICAgICAgICAgdGhhdC5hbmltYXRpb25NaWRkbGVIZWFkZXJJdGVtLnNjYWxlKCAxLjAgKS5yb3RhdGUoIC0zMCApLnN0ZXAoICk7IFxuICAgICAgICAgICAgfSBcbiAgICAgICAgICAgIHRoYXQuc2V0RGF0YSh7IFxuICAgICAgICAgICAgICAgIGFuaW1hdGlvbk1pZGRsZUhlYWRlckl0ZW06IHRoYXQuYW5pbWF0aW9uTWlkZGxlSGVhZGVySXRlbS5leHBvcnQoICkgXG4gICAgICAgICAgICB9KTsgXG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGlmICggKytjaXJjbGVDb3VudCA9PT0gMTAwMCApIHsgXG4gICAgICAgICAgICAgICAgY2lyY2xlQ291bnQgPSAwOyBcbiAgICAgICAgICAgIH0gXG4gICAgICAgIH0uYmluZCggdGhpcyApLCAxMDAwICk7IFxuICAgIH0sXG4gIFxuICAgIC8qKlxuICAgICAqIOeUn+WRveWRqOacn+WHveaVsC0t55uR5ZCs6aG16Z2i5pi+56S6XG4gICAgICovXG4gICAgb25TaG93OiBmdW5jdGlvbiAoICkge1xuICAgICAgICBjb25zdCB7IGlkLCB0aWQsIHRyaXAgfSA9IHRoaXMuZGF0YTtcbiAgICAgICAgXG4gICAgICAgIHRoaXMuZmV0RGV0YWlsKCBpZCApO1xuICAgICAgICB0aGlzLmZldGNoU2hvcHBpbmcoIGlkLCB0aWQgKTtcblxuICAgICAgICBpZiAoICEhdHJpcCApIHtcbiAgICAgICAgICAgIGNvbnN0IHsgc3RhcnRfZGF0ZSwgZW5kX2RhdGUgfSA9ICh0cmlwIGFzIGFueSk7XG4gICAgICAgICAgICAgdGhpcy5mZXRjaFZpc2l0UmVjb3JkKCBpZCwgc3RhcnRfZGF0ZSwgZW5kX2RhdGUgKTtcbiAgICAgICAgfVxuXG4gICAgfSxcbiAgXG4gICAgLyoqXG4gICAgICog55Sf5ZG95ZGo5pyf5Ye95pWwLS3nm5HlkKzpobXpnaLpmpDol49cbiAgICAgKi9cbiAgICBvbkhpZGU6IGZ1bmN0aW9uICgpIHtcbiAgXG4gICAgfSxcbiAgXG4gICAgLyoqXG4gICAgICog55Sf5ZG95ZGo5pyf5Ye95pWwLS3nm5HlkKzpobXpnaLljbjovb1cbiAgICAgKi9cbiAgICBvblVubG9hZDogZnVuY3Rpb24gKCkge1xuICBcbiAgICB9LFxuICBcbiAgICAvKipcbiAgICAgKiDpobXpnaLnm7jlhbPkuovku7blpITnkIblh73mlbAtLeebkeWQrOeUqOaIt+S4i+aLieWKqOS9nFxuICAgICAqL1xuICAgIG9uUHVsbERvd25SZWZyZXNoOiBmdW5jdGlvbiAoKSB7XG4gIFxuICAgIH0sXG4gIFxuICAgIC8qKlxuICAgICAqIOmhtemdouS4iuaLieinpuW6leS6i+S7tueahOWkhOeQhuWHveaVsFxuICAgICAqL1xuICAgIG9uUmVhY2hCb3R0b206IGZ1bmN0aW9uICgpIHtcbiAgXG4gICAgfSxcbiAgXG4gICAgLyoqXG4gICAgICog55So5oi354K55Ye75Y+z5LiK6KeS5YiG5LqrXG4gICAgICovXG4gICAgb25TaGFyZUFwcE1lc3NhZ2U6IGZ1bmN0aW9uICggZSApIHtcbiAgICAgICAgY29uc3QgeyBoYXNPcmRlciQsIGRldGFpbCQsIG9wZW5pZCB9ID0gKHRoaXMuZGF0YSBhcyBhbnkpO1xuXG4gICAgICAgIHNldFRpbWVvdXQoKCApID0+IHtcbiAgICAgICAgICAgIGNvbnN0IHNoYXJlRmVkYmFjayA9ICh0aGlzIGFzIGFueSkuc2VsZWN0Q29tcG9uZW50KCcjc2hhcmUtZmVlZGJhY2snKTtcbiAgICAgICAgICAgIHNoYXJlRmVkYmFjay50b2dnbGUoICk7XG4gICAgICAgIH0sIDUwMCApO1xuXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBpbWFnZVVybDogYCR7ZGV0YWlsJC5pbWdbIDAgXX1gLFxuICAgICAgICAgICAgcGF0aDogYC9wYWdlcy9nb29kcy1kZXRhaWwvaW5kZXg/aWQ9JHtkZXRhaWwkLl9pZH0mZnJvbT0ke29wZW5pZH1gLFxuICAgICAgICAgICAgdGl0bGU6ICEhZGV0YWlsJCAmJiBkZXRhaWwkLmhhc1BpbiAmJiAhaGFzT3JkZXIkID9cbiAgICAgICAgICAgICAgICBg5pyJ5Lq65oOz6KaB5ZCX77yf5ou85Zui5Lmw77yM5oiR5Lus6YO96IO955yB77yBJHtkZXRhaWwkLnRpdGxlfWAgOlxuICAgICAgICAgICAgICAgIGDmjqjojZDjgIwke2RldGFpbCQudGFnVGV4dH3jgI3npZ7lmaghJHtkZXRhaWwkLnRpdGxlfWBcbiAgICAgICAgfVxuICAgIH1cbiAgfSkiXX0=