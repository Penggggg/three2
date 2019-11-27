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
            id: '71f2cd945cab4fc10261232b3f358619'
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7O0FBQ0EsOENBQTBDO0FBQzFDLHFEQUFvRDtBQUNwRCxnREFBcUQ7QUFDckQsZ0RBQTRDO0FBRTVDLElBQU0sR0FBRyxHQUFHLE1BQU0sRUFBUSxDQUFDO0FBRzNCLElBQU0sVUFBVSxHQUFHLG9CQUFvQixDQUFDO0FBRXhDLElBQUksQ0FBQztJQUdELHlCQUF5QixFQUFFLElBQUk7SUFLL0IsSUFBSSxFQUFFO1FBRUYsVUFBVSxFQUFFLElBQUk7UUFHaEIsTUFBTSxFQUFFLEVBQUU7UUFHVixRQUFRLEVBQUUsRUFBRTtRQUdaLEtBQUssRUFBRSxJQUFJO1FBR1gsR0FBRyxFQUFFLEVBQUU7UUFHUCxFQUFFLEVBQUUsRUFBRTtRQUdOLE1BQU0sRUFBRSxJQUFJO1FBR1osR0FBRyxFQUFFLEVBQUc7UUFHUixPQUFPLEVBQUUsSUFBSTtRQUdiLFdBQVcsRUFBRSxLQUFLO1FBR2xCLEtBQUssRUFBRSxLQUFLO1FBR1osV0FBVyxFQUFFO1lBQ1QsTUFBTSxFQUFFLE1BQU0sRUFBRSxNQUFNO1NBQ3pCO1FBR0QseUJBQXlCLEVBQUUsSUFBSTtRQUcvQixPQUFPLEVBQUUsS0FBSztRQUdkLGFBQWEsRUFBRSxLQUFLO1FBR3BCLFlBQVksRUFBRSxNQUFNO1FBR3BCLGlCQUFpQixFQUFFLEtBQUs7UUFHeEIsWUFBWSxFQUFFLE1BQU07UUFHcEIsY0FBYyxFQUFFLEtBQUs7UUFHckIsR0FBRyxFQUFFLEVBQUc7UUFHUixRQUFRLEVBQUUsRUFBRztRQUdiLFVBQVUsRUFBRSxFQUFHO1FBR2YsU0FBUyxFQUFFLEVBQUc7UUFHZCxJQUFJLEVBQUUsSUFBSTtRQUdWLGdCQUFnQixFQUFFLEtBQUs7UUFHdkIsTUFBTSxFQUFFLEVBQUU7UUFHVixJQUFJLEVBQUUsRUFBRTtRQUdSLGdCQUFnQixFQUFFLENBQUM7UUFHbkIsVUFBVSxF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QUksQ0FBQyxTQUFTLENBQUUsRUFBRSxDQUFFLENBQUM7UUFDckIsSUFBSSxDQUFDLGFBQWEsQ0FBRSxFQUFFLEVBQUUsR0FBRyxDQUFFLENBQUM7UUFFOUIsSUFBSyxDQUFDLENBQUMsSUFBSSxFQUFHO1lBQ0osSUFBQSxTQUF3QyxFQUF0QywwQkFBVSxFQUFFLHNCQUEwQixDQUFDO1lBQzlDLElBQUksQ0FBQyxnQkFBZ0IsQ0FBRSxFQUFFLEVBQUUsVUFBVSxFQUFFLFFBQVEsQ0FBRSxDQUFDO1NBQ3REO0lBRUwsQ0FBQztJQUtELE1BQU0sRUFBRTtJQUVSLENBQUM7SUFLRCxRQUFRLEVBQUU7SUFFVixDQUFDO0lBS0QsaUJBQWlCLEVBQUU7SUFFbkIsQ0FBQztJQUtELGFBQWEsRUFBRTtJQUVmLENBQUM7SUFLRCxpQkFBaUIsRUFBRSxVQUFXLENBQUM7UUFDckIsSUFBQSxjQUFtRCxFQUFqRCx3QkFBUyxFQUFFLG9CQUFPLEVBQUUsa0JBQTZCLENBQUM7UUFDMUQsT0FBTztZQUNILFFBQVEsRUFBRSxLQUFHLE9BQU8sQ0FBQyxHQUFHLENBQUUsQ0FBQyxDQUFJO1lBQy9CLElBQUksRUFBRSxrQ0FBZ0MsT0FBTyxDQUFDLEdBQUcsY0FBUyxNQUFRO1lBQ2xFLEtBQUssRUFBRSxDQUFDLENBQUMsT0FBTyxJQUFJLE9BQU8sQ0FBQyxNQUFNLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQztnQkFDOUMscUdBQW1CLE9BQU8sQ0FBQyxLQUFPLENBQUMsQ0FBQztnQkFDcEMsdUJBQU0sT0FBTyxDQUFDLE9BQU8sMkJBQU8sT0FBTyxDQUFDLEtBQU87U0FDbEQsQ0FBQTtJQUNMLENBQUM7Q0FDRixDQUFDLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJcbmltcG9ydCB7IGh0dHAgfSBmcm9tICcuLi8uLi91dGlsL2h0dHAuanMnO1xuaW1wb3J0IHsgY29tcHV0ZWQgfSBmcm9tICcuLi8uLi9saWIvdnVlZnkvaW5kZXguanMnO1xuaW1wb3J0IHsgZGVsYXllcmluZ0dvb2QgfSBmcm9tICcuLi8uLi91dGlsL2dvb2RzLmpzJztcbmltcG9ydCB7IG5hdlRvIH0gZnJvbSAnLi4vLi4vdXRpbC9yb3V0ZS5qcyc7XG5cbmNvbnN0IGFwcCA9IGdldEFwcDxhbnk+KCApO1xuXG4vLyDmiZPlvIDmi7zlm6Lmj5DnpLrnmoRrZXlcbmNvbnN0IHN0b3JhZ2VLZXkgPSAnb3BlbmVkLXBpbi1pbi1nb29kJztcblxuUGFnZSh7XG5cbiAgICAvLyDliqjnlLtcbiAgICBhbmltYXRpb25NaWRkbGVIZWFkZXJJdGVtOiBudWxsLFxuXG4gICAgLyoqXG4gICAgICog6aG16Z2i55qE5Yid5aeL5pWw5o2uXG4gICAgICovXG4gICAgZGF0YToge1xuICAgICAgICAvLyDmmK/lkKbmnInnlKjmiLfmjojmnYNcbiAgICAgICAgaXNVc2VyQXV0aDogdHJ1ZSxcblxuICAgICAgICAvLyBpcFxuICAgICAgICBpcE5hbWU6ICcnLFxuXG4gICAgICAgIC8vIGlwIFxuICAgICAgICBpcEF2YXRhcjogJycsXG5cbiAgICAgICAgLy8g5piv5ZCm5Li65paw5a6iXG4gICAgICAgIGlzTmV3OiB0cnVlLFxuXG4gICAgICAgIC8vIOihjOeoi1xuICAgICAgICB0aWQ6ICcnLFxuXG4gICAgICAgIC8vIOWVhuWTgWlkXG4gICAgICAgIGlkOiAnJyxcblxuICAgICAgICAvLyDllYblk4Hor6bmg4VcbiAgICAgICAgZGV0YWlsOiBudWxsLFxuICAgICAgICBcbiAgICAgICAgLy8g5pWw5o2u5a2X5YW4XG4gICAgICAgIGRpYzogeyB9LFxuICAgICAgICBcbiAgICAgICAgLy8g5Yqg6L2954q25oCBXG4gICAgICAgIGxvYWRpbmc6IHRydWUsXG5cbiAgICAgICAgLy8g5piv5ZCm5Yid5aeL5YyW6L+H4oCc5Zac5qyi4oCdXG4gICAgICAgIGhhc0luaXRMaWtlOiBmYWxzZSxcblxuICAgICAgICAvLyDmmK/lkKbigJzllpzmrKLigJ1cbiAgICAgICAgbGlrZWQ6IGZhbHNlLFxuXG4gICAgICAgIC8vIOaWh+Wtl+S/neivgeaPkOekulxuICAgICAgICBwcm9taXNlVGlwczogW1xuICAgICAgICAgICAgJ+ato+WTgeS/neivgScsICfku7fmoLzkvJjlir8nLCAn55yf5Lq66LeR6IW/J1xuICAgICAgICBdLFxuXG4gICAgICAgIC8vIOWKqOeUu1xuICAgICAgICBhbmltYXRpb25NaWRkbGVIZWFkZXJJdGVtOiBudWxsLFxuXG4gICAgICAgIC8vIOWxleekuueuoeeQhuWFpeWPo1xuICAgICAgICBzaG93QnRuOiBmYWxzZSxcblxuICAgICAgICAvLyDmraPlnKjlsZXnpLrmtbfmiqVcbiAgICAgICAgc2hvd2luZ1Bvc3RlcjogZmFsc2UsXG5cbiAgICAgICAgLy8g5bGV56S65ou85Zui546p5rOV55qE5by55qGGXG4gICAgICAgIHNob3dQbGF5VGlwczogJ2hpZGUnLFxuXG4gICAgICAgIC8vIOWxleekuuWIhuS6q+i1mumSsVxuICAgICAgICBzaG93U2hhcmVHZXRNb25leTogZmFsc2UsXG5cbiAgICAgICAgLy8g5bGV56S65ou85Zui5ZWG5ZOB5YiX6KGoXG4gICAgICAgIHNob3dQaW5Hb29kczogJ2hpZGUnLFxuXG4gICAgICAgIC8vIOWIhuS6q1RpcHMyXG4gICAgICAgIHNob3dTaGFyZVRpcHMyOiBmYWxzZSxcblxuICAgICAgICAvLyDmi7zlm6LliJfooahcbiAgICAgICAgcGluOiBbIF0sXG5cbiAgICAgICAgLy8g5pys6KGM56iL55qE6LSt54mp5riF5Y2V5YiX6KGoXG4gICAgICAgIHNob3BwaW5nOiBbIF0sXG5cbiAgICAgICAgLy8g5LiA5Y+j5Lu35rS75Yqo5YiX6KGoXG4gICAgICAgIGFjdGl2aXRpZXM6IFsgXSxcblxuICAgICAgICAvLyDmnKzotp/og73lpJ/mi7zlm6LnmoRza3VcbiAgICAgICAgY2FuUGluU2t1OiBbIF0sXG5cbiAgICAgICAgLy8g5b2T5YmN55qE6KGM56iLXG4gICAgICAgIHRyaXA6IG51bGwsXG5cbiAgICAgICAgLy8g5b2T5YmN5piv5ZCm5byA5ZCv5LqG56ev5YiG5o6o5bm/XG4gICAgICAgIGNhbkludGVncmF5U2hhcmU6IGZhbHNlLFxuXG4gICAgICAgIC8vIOW9k+WJjei0puWPt+eahG9wZW5pZFxuICAgICAgICBvcGVuaWQ6ICcnLFxuXG4gICAgICAgIC8vIOWIhuS6q+S6uueahG9wZW5pZFxuICAgICAgICBmcm9tOiAnJyxcblxuICAgICAgICAvLyDnp6/liIbmjqjlub/ojrfngrnmr5TkvotcbiAgICAgICAgcHVzaEludGVncmFsUmF0ZTogMCxcblxuICAgICAgICAvLyDmmK/lkKblsZXlvIBza3VcbiAgICAgICAgb3BlbmluZ1NrdTogZmFsc2UsXG5cbiAgICAgICAgLy8g6K6/6Zeu6K6w5b2VXG4gICAgICAgIHZpc2l0b3JzOiBbIF1cbiAgICB9LFxuXG4gICAgLyoqIOiuvue9rmNvbXB1dGVkICovXG4gICAgcnVuQ29tcHV0ZWQoICkge1xuICAgICAgICBjb21wdXRlZCggdGhpcywge1xuXG4gICAgICAgICAgICAvLyDorqHnrpfku7fmoLxcbiAgICAgICAgICAgIHByaWNlOiBmdW5jdGlvbiggKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgeyBkZXRhaWwgfSA9IHRoaXMuZGF0YTtcbiAgICAgICAgICAgICAgICBjb25zdCByZXN1bHQgPSBkZWxheWVyaW5nR29vZCggZGV0YWlsICk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlc3VsdCA/IHJlc3VsdC5wcmljZSQgOiAnJztcbiAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgIC8vIOWVhuWTgeivpuaDhSAtIOWIhuihjOaYvuekulxuICAgICAgICAgICAgZGV0YWlsSW50cm86IGZ1bmN0aW9uKCApIHtcbiAgICAgICAgICAgICAgICBjb25zdCB7IGRldGFpbCB9ID0gdGhpcy5kYXRhO1xuICAgICAgICAgICAgICAgIGlmICggIWRldGFpbCB8fCAoICEhZGV0YWlsICYmICFkZXRhaWwuZGV0YWlsICkpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFsgXTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZGV0YWlsLmRldGFpbC5zcGxpdCgnXFxuJykuZmlsdGVyKCB4ID0+ICEheCApO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgIC8vIOS7t+agvCDvvZ4g5Zui6LSt5Lu355qE5beu5Lu3XG4gICAgICAgICAgICBwcmljZUdhcDogZnVuY3Rpb24oICkge1xuICAgICAgICAgICAgICAgIGNvbnN0IHsgZGV0YWlsIH0gPSB0aGlzLmRhdGE7XG4gICAgICAgICAgICAgICAgaWYgKCAhZGV0YWlsICkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gJydcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCByZXN1bHQgPSBkZWxheWVyaW5nR29vZCggZGV0YWlsICk7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGdhcCA9IHJlc3VsdCA/IFN0cmluZyggcmVzdWx0Lmdvb2RQaW5zLmVhY2hQcmljZVJvdW5kICkucmVwbGFjZSgvXFwuMDAvZywgJycpIDogJyc7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IG1ldGEgPSBnYXAgIT09ICcwJyAmJiAhIWdhcCA/IGdhcCA6ICcnO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gbWV0YTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LFxuXG4gICAgICAgICAgICAvLyDpqazkuIrlj6/ku6Xmi7zlm6LnmoTkuKrmlbBcbiAgICAgICAgICAgIHBpbkNvdW50JDogZnVuY3Rpb24oICkge1xuICAgICAgICAgICAgICAgIGNvbnN0IHsgaWQsIGRldGFpbCB9ID0gdGhpcy5kYXRhO1xuICAgICAgICAgICAgICAgIGNvbnN0IGdvb2RTaG9wcGluZyA9IHRoaXMuZGF0YS5zaG9wcGluZy5maWx0ZXIoIHggPT4geC5waWQgPT09IGlkICk7XG4gICAgICAgICAgICAgICAgaWYgKCAhZGV0YWlsICkgeyBcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIDA7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgY29uc3QgeyBzdGFuZGFyZHMsIGdyb3VwUHJpY2UgfSA9IGRldGFpbDtcblxuICAgICAgICAgICAgICAgIGlmICggISFzdGFuZGFyZHMgJiYgc3RhbmRhcmRzLmxlbmd0aCA+IDAgKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBzdGFuZGFyZHNcbiAgICAgICAgICAgICAgICAgICAgICAgIC5maWx0ZXIoIHggPT4gISFnb29kU2hvcHBpbmcuZmluZCggcyA9PiBzLnNpZCA9PT0geC5faWQgJiYgcy5waWQgPT09IHgucGlkICkpXG4gICAgICAgICAgICAgICAgICAgICAgICAubGVuZ3RoO1xuXG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmICggISFncm91cFByaWNlICkge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCB7IF9pZCB9ID0gZGV0YWlsO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gISFnb29kU2hvcHBpbmcuZmluZCggcyA9PiBzLnBpZCA9PT0gX2lkICkgPyAxIDogMFxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHJldHVybiAwO1xuICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAgLy8g5ou85Zui5YiX6KGoXG4gICAgICAgICAgICBwaW4kOiBmdW5jdGlvbiggKSB7XG4gICAgICAgICAgICAgICAgbGV0IG1ldGE6IGFueSA9IFsgXTtcbiAgICAgICAgICAgICAgICBjb25zdCB7IGRldGFpbCwgc2hvcHBpbmcsIGFjdGl2aXRpZXMgfSA9IHRoaXMuZGF0YTtcblxuICAgICAgICAgICAgICAgIGlmICggIWRldGFpbCApIHsgXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBbIF07XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgY29uc3QgeyBzdGFuZGFyZHMsIGdyb3VwUHJpY2UgfSA9IGRldGFpbDtcblxuICAgICAgICAgICAgICAgIGlmICggc3RhbmRhcmRzLmxlbmd0aCA+IDAgKSB7XG4gICAgICAgICAgICAgICAgICAgIG1ldGEgPSBzdGFuZGFyZHNcbiAgICAgICAgICAgICAgICAgICAgICAgIC5maWx0ZXIoIHggPT4gISF4Lmdyb3VwUHJpY2UgKVxuICAgICAgICAgICAgICAgICAgICAgICAgLm1hcCggeCA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIE9iamVjdC5hc3NpZ24oeyB9LCB4LCB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNpZDogeC5faWQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhblBpbjogISFzaG9wcGluZy5maW5kKCBzID0+IHMuc2lkID09PSB4Ll9pZCAmJiBzLnBpZCA9PT0geC5waWQgKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoICEhZ3JvdXBQcmljZSApIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgeyBwcmljZSwgdGl0bGUsIGltZywgX2lkIH0gPSBkZXRhaWw7XG4gICAgICAgICAgICAgICAgICAgIG1ldGEgPSBbe1xuICAgICAgICAgICAgICAgICAgICAgICAgcHJpY2UsXG4gICAgICAgICAgICAgICAgICAgICAgICBwaWQ6IF9pZCxcbiAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6IHRpdGxlLFxuICAgICAgICAgICAgICAgICAgICAgICAgZ3JvdXBQcmljZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHNpZDogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgICAgICAgICAgaW1nOiBpbWdbIDAgXSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhblBpbjogISFzaG9wcGluZy5maW5kKCBzID0+IHMucGlkID09PSBfaWQgKVxuICAgICAgICAgICAgICAgICAgICB9XTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAvLyDmoLnmja7mtLvliqjvvIzmm7TmlLnjgIHmlrDlop7mi7zlm6Lpobnnm65cbiAgICAgICAgICAgICAgICBhY3Rpdml0aWVzLm1hcCggYWMgPT4ge1xuICAgICAgICAgICAgICAgICAgICBpZiAoICFhYy5hY19ncm91cFByaWNlICkgeyByZXR1cm47IH1cbiAgICAgICAgICAgICAgICAgICAgY29uc3QgcGluVGFyZ2V0ID0gbWV0YS5maW5kKCB4ID0+IHgucGlkID09PSBhYy5waWQgJiYgeC5zaWQgPT09IGFjLnNpZCApO1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBwaW5UYXJnZXRJbmRleCA9IG1ldGEuZmluZEluZGV4KCB4ID0+IHgucGlkID09PSBhYy5waWQgJiYgeC5zaWQgPT09IGFjLnNpZCApO1xuXG4gICAgICAgICAgICAgICAgICAgIC8vIOabv+aNolxuICAgICAgICAgICAgICAgICAgICBpZiAoIHBpblRhcmdldEluZGV4ICE9PSAtMSApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG1ldGEuc3BsaWNlKCBwaW5UYXJnZXRJbmRleCwgMSwgT2JqZWN0LmFzc2lnbih7IH0sIHBpblRhcmdldCwge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHByaWNlOiBhYy5hY19wcmljZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBncm91cFByaWNlOiBhYy5hY19ncm91cFByaWNlXG4gICAgICAgICAgICAgICAgICAgICAgICB9KSk7XG5cbiAgICAgICAgICAgICAgICAgICAgLy8g5paw5aKeXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBtZXRhLnB1c2goe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNpZDogYWMuc2lkLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBpZDogYWMucGlkLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGltZzogYWMuaW1nLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6IGFjLnRpdGxlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhblBpbjogISFzaG9wcGluZy5maW5kKCBzID0+IHMuc2lkID09PSBhYy5zaWQgJiYgcy5waWQgPT09IGFjLnBpZCApLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHByaWNlOiBhYy5hY19wcmljZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBncm91cFByaWNlOiBhYy5hY19ncm91cFByaWNlIFxuICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgY29uc3QgbWV0YTIgPSBtZXRhLm1hcCggeCA9PiBPYmplY3QuYXNzaWduKHsgfSwgeCwge1xuICAgICAgICAgICAgICAgICAgICBkZWx0YTogTnVtYmVyKCB4LnByaWNlIC0geC5ncm91cFByaWNlICkudG9GaXhlZCggMCApXG4gICAgICAgICAgICAgICAgfSkpO1xuXG4gICAgICAgICAgICAgICAgcmV0dXJuIG1ldGEyO1xuICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAgLy8g56ev5YiG5Yy66Ze0XG4gICAgICAgICAgICBpbnRlZ3JhbCQ6IGZ1bmN0aW9uKCApIHtcbiAgICAgICAgICAgICAgICBjb25zdCB7IGRldGFpbCwgcHVzaEludGVncmFsUmF0ZSB9ID0gdGhpcy5kYXRhO1xuICAgICAgICAgICAgICAgIGlmICggIWRldGFpbCApIHsgXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAnJztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgY29uc3QgcmVzdWx0ID0gZGVsYXllcmluZ0dvb2QoIGRldGFpbCwgcHVzaEludGVncmFsUmF0ZSApO1xuICAgICAgICAgICAgICAgIHJldHVybiByZXN1bHQuaW50ZWdyYWwkO1xuICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAgLy8g6K+m5oOFXG4gICAgICAgICAgICBkZXRhaWwkOiBmdW5jdGlvbiggKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgeyBkZXRhaWwgfSA9IHRoaXMuZGF0YTtcbiAgICAgICAgICAgICAgICBjb25zdCByID0gZGVsYXllcmluZ0dvb2QoIGRldGFpbCApXG4gICAgICAgICAgICAgICAgcmV0dXJuIHI7XG4gICAgICAgICAgICB9LFxuXG4gICAgICAgICAgICAvLyDmraTotKblj7fvvIzmmK/lkKbmnInljZVcbiAgICAgICAgICAgIGhhc09yZGVyJCggKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgeyBvcGVuaWQsIHRyaXBTaG9wcGluZ2xpc3QgfSA9IHRoaXMuZGF0YTtcbiAgICAgICAgICAgICAgICBjb25zdCByID0gKHRyaXBTaG9wcGluZ2xpc3QgfHwgWyBdKVxuICAgICAgICAgICAgICAgICAgICAuZmlsdGVyKCBzbCA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCB7IHVpZHMgfSA9IHNsO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHVpZHMuaW5jbHVkZXMoIG9wZW5pZCApO1xuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIGNvbnN0IHJlc3VsdCA9IEFycmF5LmlzQXJyYXkoIHRyaXBTaG9wcGluZ2xpc3QgKSAmJiB0cmlwU2hvcHBpbmdsaXN0Lmxlbmd0aCA+IDBcbiAgICAgICAgICAgICAgICAgICAgPyByLmxlbmd0aCA+IDAgOiBmYWxzZTtcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAgLy8g5ZWG5ZOB55qE6K6/6Zeu6K6w5b2VXG4gICAgICAgICAgICB2aXNpdG9ycyQoICkge1xuICAgICAgICAgICAgICAgIGNvbnN0IHsgdmlzaXRvcnMsIG9wZW5pZCB9ID0gdGhpcy5kYXRhO1xuICAgICAgICAgICAgICAgIHJldHVybiB2aXNpdG9ycy5maWx0ZXIoIHggPT4geC5vcGVuaWQgIT09IG9wZW5pZCApO1xuICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAgLy8g5b2T5YmN5ZWG5ZOB55qE6LSt54mp5riF5Y2VXG4gICAgICAgICAgICBzaG9wcGluZyQoICkge1xuICAgICAgICAgICAgICAgIGNvbnN0IHsgc2hvcHBpbmcsIGlkIH0gPSB0aGlzLmRhdGE7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHNob3BwaW5nXG4gICAgICAgICAgICAgICAgICAgIC5maWx0ZXIoIHggPT4geC5waWQgPT09IGlkIClcbiAgICAgICAgICAgICAgICAgICAgLm1hcCggc2wgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgeyB1c2Vycywgc2lkLCBkZXRhaWwgfSA9IHNsO1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgeyBuYW1lIH0gPSBkZXRhaWw7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC4uLnNsLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5hbWUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZmlyc3RVc2VyOiB1c2Vyc1sgMCBdLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG90aGVyVXNlcjogdXNlcnMuc2xpY2UoIDEgKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgIC8vIOihjOeoi+S4reeahOWFtuS7lui0reeJqea4heWNlVxuICAgICAgICAgICAgb3RoZXJTaG9wcGluZyQoICkge1xuICAgICAgICAgICAgICAgIGNvbnN0IHsgc2hvcHBpbmcsIGlkIH0gPSB0aGlzLmRhdGE7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHNob3BwaW5nXG4gICAgICAgICAgICAgICAgICAgIC5maWx0ZXIoIHggPT4geC5waWQgIT09IGlkIClcbiAgICAgICAgICAgICAgICAgICAgLm1hcCggc2wgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgeyB1c2Vycywgc2lkLCBkZXRhaWwgfSA9IHNsO1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgeyBuYW1lIH0gPSBkZXRhaWw7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC4uLnNsLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5hbWUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZmlyc3RVc2VyOiB1c2Vyc1sgMCBdLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG90aGVyVXNlcjogdXNlcnMuc2xpY2UoIDEgKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgIC8vIOihjOeoi+S4re+8jOW9k+WJjeS6p+WTgeaJgOacieWei+WPt+WKoOi1t+adpe+8jOacieWkmuWwkeS6uuWcqOaLvOWbolxuICAgICAgICAgICAgYWxsUGluUGxheWVycyQoICkge1xuICAgICAgICAgICAgICAgIGNvbnN0IHsgaWQsIHNob3BwaW5nIH0gPSB0aGlzLmRhdGE7XG4gICAgICAgICAgICAgICAgY29uc3QgZ29vZFNob3BwaW5nID0gc2hvcHBpbmcuZmlsdGVyKCB4ID0+IHgucGlkID09PSBpZCApO1xuICAgICAgICAgICAgICAgIHJldHVybiBnb29kU2hvcHBpbmcucmVkdWNlKCggeCwgc2wgKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB4ICsgc2wudWlkcy5sZW5ndGg7XG4gICAgICAgICAgICAgICAgfSwgMCApO1xuICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiDnjrDlnKjliLDlh4zmmagx54K555qE5YCS6K6h5pe2XG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIGNvdW50RG93bk5pZ2h0JCggKSB7XG4gICAgICAgICAgICAgICAgY29uc3Qgbm93ID0gbmV3IERhdGUoICk7XG4gICAgICAgICAgICAgICAgY29uc3QgeSA9IG5vdy5nZXRGdWxsWWVhciggKTtcbiAgICAgICAgICAgICAgICBjb25zdCBtID0gbm93LmdldE1vbnRoKCApICsgMTtcbiAgICAgICAgICAgICAgICBjb25zdCBkID0gbm93LmdldERhdGUoICk7XG4gICAgICAgICAgICAgICAgY29uc3QgdG9kYXlPbmUgPSBuZXcgRGF0ZShgJHt5fS8ke219LyR7ZH0gMDE6MDA6MDBgKTtcbiAgICAgICAgICAgICAgICBjb25zdCB0b21vcnJvd09uZSA9IHRvZGF5T25lLmdldFRpbWUoICkgKyAyNCAqIDYwICogNjAgKiAxMDAwO1xuICAgICAgICAgICAgICAgIHJldHVybiAoKCB0b21vcnJvd09uZSAtIERhdGUubm93KCApKSAvIDEwMDAgKS50b0ZpeGVkKCAwICk7XG4gICAgICAgICAgICB9LFxuXG4gICAgICAgIH0pXG4gICAgfSxcblxuICAgIC8qKiDnm5HlkKzlhajlsYDnrqHnkIblkZjmnYPpmZAgKi9cbiAgICB3YXRjaFJvbGUoICkge1xuICAgICAgICAoYXBwIGFzIGFueSkud2F0Y2gkKCdyb2xlJywgKCB2YWwgKSA9PiB7XG4gICAgICAgICAgICB0aGlzLnNldERhdGEhKHtcbiAgICAgICAgICAgICAgICBzaG93QnRuOiAoIHZhbCA9PT0gMSApXG4gICAgICAgICAgICB9KVxuICAgICAgICB9KTtcbiAgICAgICAgKGFwcCBhcyBhbnkpLndhdGNoJCgnaXNOZXcnLCB2YWwgPT4ge1xuICAgICAgICAgICAgdGhpcy5zZXREYXRhISh7XG4gICAgICAgICAgICAgICAgaXNOZXc6IHZhbFxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgICAgICAoYXBwIGFzIGFueSkud2F0Y2gkKCdhcHBDb25maWcnLCB2YWwgPT4ge1xuICAgICAgICAgICAgaWYgKCAhdmFsICkgeyByZXR1cm47IH1cbiAgICAgICAgICAgIHRoaXMuc2V0RGF0YSEoe1xuICAgICAgICAgICAgICAgIGlwTmFtZTogdmFsWydpcC1uYW1lJ10sXG4gICAgICAgICAgICAgICAgaXBBdmF0YXI6IHZhbFsnaXAtYXZhdGFyJ10sXG4gICAgICAgICAgICAgICAgcHVzaEludGVncmFsUmF0ZTogKHZhbCB8fCB7IH0pWydwdXNoLWludGVncmFsLWdldC1yYXRlJ10gfHwgMCxcbiAgICAgICAgICAgICAgICBjYW5JbnRlZ3JheVNoYXJlOiAhISh2YWwgfHwgeyB9KVsnZ29vZC1pbnRlZ3JhbC1zaGFyZSddIHx8IGZhbHNlXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHRoaXMuY3JlYXRlU2hhcmUoICk7XG4gICAgICAgIH0pO1xuICAgICAgICAoYXBwIGFzIGFueSkud2F0Y2gkKCdvcGVuaWQnLCB2YWwgPT4ge1xuICAgICAgICAgICAgdGhpcy5zZXREYXRhISh7XG4gICAgICAgICAgICAgICAgb3BlbmlkOiB2YWxcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgdGhpcy5jcmVhdGVTaGFyZSggKTtcbiAgICAgICAgfSk7XG4gICAgICAgIGFwcC53YXRjaCQoJ2lzVXNlckF1dGgnLCB2YWwgPT4ge1xuICAgICAgICAgICAgaWYgKCB2YWwgPT09IHVuZGVmaW5lZCApIHsgcmV0dXJuOyB9XG4gICAgICAgICAgICB0aGlzLnNldERhdGEhKHtcbiAgICAgICAgICAgICAgICBpc1VzZXJBdXRoOiB2YWxcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9LFxuXG4gICAgLyoqIOaLieWPluWVhuWTgeivpuaDhSAqL1xuICAgIGZldERldGFpbCggaWQgKSB7XG4gICAgICAgIGNvbnN0IHsgZGV0YWlsLCBmcm9tIH0gPSB0aGlzLmRhdGE7XG4gICAgICAgIGlmICggZGV0YWlsICkgeyByZXR1cm47IH1cbiAgICAgICAgaHR0cCh7XG4gICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgX2lkOiBpZCxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBlcnJNc2c6ICfojrflj5bllYblk4HplJnor6/vvIzor7fph43or5UnLFxuICAgICAgICAgICAgdXJsOiBgZ29vZF9kZXRhaWxgLFxuICAgICAgICAgICAgc3VjY2VzczogcmVzID0+IHtcbiAgICAgICAgICAgICAgaWYgKCByZXMuc3RhdHVzICE9PSAyMDAgKSB7IHJldHVybjsgfVxuXG4gICAgICAgICAgICAgICAgbGV0IHBpbjogYW55ID0gWyBdO1xuICAgICAgICAgICAgICAgIGNvbnN0IHsgc3RhbmRhcmRzLCBncm91cFByaWNlLCBhY3Rpdml0aWVzIH0gPSByZXMuZGF0YTtcblxuICAgICAgICAgICAgICAgIGlmICggc3RhbmRhcmRzLmxlbmd0aCA+IDAgKSB7XG4gICAgICAgICAgICAgICAgICAgIHBpbiA9IHN0YW5kYXJkcy5maWx0ZXIoIHggPT4gISF4Lmdyb3VwUHJpY2UgKTtcblxuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoICEhZ3JvdXBQcmljZSApIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgeyBwcmljZSwgdGl0bGUsIGltZyAgfSA9IHJlcy5kYXRhO1xuICAgICAgICAgICAgICAgICAgICBwaW4gPSBbe1xuICAgICAgICAgICAgICAgICAgICAgICAgcHJpY2UsXG4gICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiB0aXRsZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGdyb3VwUHJpY2UsXG4gICAgICAgICAgICAgICAgICAgICAgICBpbWc6IGltZ1sgMCBdXG4gICAgICAgICAgICAgICAgICAgIH1dO1xuICAgICAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgICAgICBjb25zdCBhY3Rpdml0aWVzJCA9IGFjdGl2aXRpZXMubWFwKCB4ID0+IHtcblxuICAgICAgICAgICAgICAgICAgICBsZXQgaW1nID0gJyc7XG4gICAgICAgICAgICAgICAgICAgIGlmICggISF4LnNpZCApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGltZyA9IHN0YW5kYXJkcy5maW5kKCB5ID0+IHkuX2lkID09PSB4LnNpZCApLmltZ1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgaW1nID0gcmVzLmRhdGEuaW1nWyAwIF07XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gT2JqZWN0LmFzc2lnbih7IH0sIHgsIHsgXG4gICAgICAgICAgICAgICAgICAgICAgICBpbWcsXG4gICAgICAgICAgICAgICAgICAgICAgICBjb3VudGRvd246ICggeC5lbmRUaW1lIC0gbmV3IERhdGUoICkuZ2V0VGltZSggKSkgLyAoIDEwMDAgKVxuICAgICAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgIH0pLmZpbHRlciggeSA9PiB5LmVuZFRpbWUgPiBuZXcgRGF0ZSggKS5nZXRUaW1lKCApKTtcblxuICAgICAgICAgICAgICAgIHRoaXMuc2V0RGF0YSEoe1xuICAgICAgICAgICAgICAgICAgICBwaW4sXG4gICAgICAgICAgICAgICAgICAgIGxvYWRpbmc6IGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICBkZXRhaWw6IHJlcy5kYXRhLFxuICAgICAgICAgICAgICAgICAgICBhY3Rpdml0aWVzOiBhY3Rpdml0aWVzJFxuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgLy8g5by56LW35ou85Zui5qGGXG4gICAgICAgICAgICAgICAgaWYgKCAhIWZyb20gJiYgZGVsYXllcmluZ0dvb2QoIHJlcy5kYXRhICkuaGFzUGluICkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnNldERhdGEhKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNob3dQbGF5VGlwczogJ3Nob3cnXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoICFmcm9tICYmIGRlbGF5ZXJpbmdHb29kKCByZXMuZGF0YSApLmhhc1BpbiApIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jaGVja09wZW5QaW4oICk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9LFxuXG4gICAgLyoqIOaLieWPluihjOeoi+eahOi0reeJqeivt+WNleS/oeaBryAqL1xuICAgIGZldGNoU2hvcHBpbmcoIHBpZCwgdGlkICkge1xuICAgICAgICBpZiAoICFwaWQgfHwgIXRpZCApIHsgcmV0dXJuOyB9XG5cbiAgICAgICAgaHR0cCh7XG4gICAgICAgICAgICB1cmw6ICdzaG9wcGluZy1saXN0X3BpbicsXG4gICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgLy8gcGlkLFxuICAgICAgICAgICAgICAgIHRpZCxcbiAgICAgICAgICAgICAgICBkZXRhaWw6IHRydWUsXG4gICAgICAgICAgICAgICAgc2hvd1VzZXI6IHRydWVcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBzdWNjZXNzOiByZXMgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IHsgc3RhdHVzLCBkYXRhIH0gPSByZXM7XG4gICAgICAgICAgICAgICAgaWYgKCBzdGF0dXMgIT09IDIwMCApIHsgcmV0dXJuOyB9XG4gICAgICAgICAgICAgICAgdGhpcy5zZXREYXRhISh7XG4gICAgICAgICAgICAgICAgICAgIHNob3BwaW5nOiBkYXRhLFxuICAgICAgICAgICAgICAgICAgICBjYW5QaW5Ta3U6IGRhdGEubWFwKCB4ID0+ICh7XG4gICAgICAgICAgICAgICAgICAgICAgICBwaWQ6IHgucGlkLFxuICAgICAgICAgICAgICAgICAgICAgICAgc2lkOiB4LnNpZFxuICAgICAgICAgICAgICAgICAgICB9KSlcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSlcbiAgICB9LFxuXG4gICAgLyoqIOaLieWPluW9k+WJjeWVhuWTgeeahOiuv+mXruiusOW9lSAqL1xuICAgIGZldGNoVmlzaXRSZWNvcmQoIHBpZCwgc3RhcnQsIGJlZm9yZSApIHtcbiAgICAgICAgaWYgKCAhc3RhcnQgfHwgIWJlZm9yZSApIHsgcmV0dXJuOyB9XG4gICAgICAgIGh0dHAoe1xuICAgICAgICAgICAgdXJsOiAnZ29vZF9nb29kLXZpc2l0b3JzJyxcbiAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICBwaWQsXG4gICAgICAgICAgICAgICAgc3RhcnQsIFxuICAgICAgICAgICAgICAgIGJlZm9yZVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHN1Y2Nlc3M6IHJlcyA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3QgeyBzdGF0dXMsIGRhdGEgfSA9IHJlcztcbiAgICAgICAgICAgICAgICBpZiAoIHN0YXR1cyAhPT0gMjAwICkgeyByZXR1cm47IH1cbiAgICAgICAgICAgICAgICB0aGlzLnNldERhdGEhKHtcbiAgICAgICAgICAgICAgICAgICAgdmlzaXRvcnM6IGRhdGFcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfSxcblxuICAgIC8qKiDmi4nlj5bkuKTkuKrmnIDmlrDooYznqIsgKi9cbiAgICBmZXRjaExhc3QoICkge1xuICAgICAgICBjb25zdCB7IGlkIH0gPSB0aGlzLmRhdGE7XG4gICAgICAgIGh0dHAoe1xuICAgICAgICAgICAgZGF0YTogeyB9LFxuICAgICAgICAgICAgdXJsOiBgdHJpcF9lbnRlcmAsXG4gICAgICAgICAgICBzdWNjZXNzOiByZXMgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IHsgc3RhdHVzLCBkYXRhIH0gPSByZXM7XG4gICAgICAgICAgICAgICAgaWYgKCBzdGF0dXMgIT09IDIwMCApIHsgcmV0dXJuOyB9XG4gICAgICAgICAgICAgICAgY29uc3QgdHJpcCA9IGRhdGFbIDAgXTtcbiAgICAgICAgICAgICAgICBpZiAoICEhdHJpcCApIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgeyBfaWQsIHN0YXJ0X2RhdGUsIGVuZF9kYXRlIH0gPSB0cmlwO1xuICAgICAgICAgICAgICAgICAgICBjb25zdCB0aWQgPSBfaWRcblxuICAgICAgICAgICAgICAgICAgICB0aGlzLmZldGNoU2hvcHBpbmcoIGlkLCB0aWQgKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5mZXRjaFZpc2l0UmVjb3JkKCBpZCwgc3RhcnRfZGF0ZSwgZW5kX2RhdGUgKTtcblxuICAgICAgICAgICAgICAgICAgICB0aGlzLnNldERhdGEhKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRpZCxcbiAgICAgICAgICAgICAgICAgICAgICAgIHRyaXBcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9KVxuICAgIH0sXG5cbiAgICAvKiog5Yib5bu65YiG5Lqr6K6w5b2VICovXG4gICAgY3JlYXRlU2hhcmUoICkge1xuICAgICAgICBjb25zdCB7IGlkLCBjYW5JbnRlZ3JheVNoYXJlLCBmcm9tLCBvcGVuaWQgfSA9IHRoaXMuZGF0YTtcbiAgICAgICAgaWYgKCAhaWQgfHwgIWNhbkludGVncmF5U2hhcmUgfHwgIWZyb20gfHwgIW9wZW5pZCApIHsgcmV0dXJuOyB9XG4gICAgICAgIGh0dHAoe1xuICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgIGZyb20sXG4gICAgICAgICAgICAgICAgcGlkOiBpZCxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB1cmw6ICdjb21tb25fY3JlYXRlLXNoYXJlJ1xuICAgICAgICB9KTtcbiAgICB9LFxuXG4gICAgLy8g5bGV5byA5ou85Zui546p5rOV5o+Q56S6XG4gICAgdG9nZ2xlUGFseVRpcHMoIGU/ICkge1xuICAgICAgICBjb25zdCB7IHNob3dQbGF5VGlwcyB9ID0gdGhpcy5kYXRhO1xuICAgICAgICB0aGlzLnNldERhdGEhKHtcbiAgICAgICAgICAgIHNob3dQbGF5VGlwczogc2hvd1BsYXlUaXBzID09PSAnc2hvdycgPyAnaGlkZScgOiAnc2hvdydcbiAgICAgICAgfSk7XG4gICAgfSxcblxuICAgIC8vIOiOt+WPluaOiOadg+OAgeWFs+mXreaLvOWboueOqeazleaPkOekulxuICAgIGdldFVzZXJBdXRoKCApIHtcbiAgICAgICAgYXBwLmdldFd4VXNlckluZm8oKCApID0+IHtcbiAgICAgICAgICAgIHRoaXMuc2V0RGF0YSEoe1xuICAgICAgICAgICAgICAgIHNob3dQbGF5VGlwczogJ2hpZGUnXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfSxcblxuICAgIC8vIOWxleekuuaOqOW5v+enr+WIhuinhOWImVxuICAgIHRvZ2dsZVNoYXJlR2V0TW9uZXkoICkge1xuICAgICAgICBjb25zdCB7IHNob3dTaGFyZUdldE1vbmV5IH0gPSB0aGlzLmRhdGE7XG4gICAgICAgIHRoaXMuc2V0RGF0YSEoe1xuICAgICAgICAgICAgc2hvd1NoYXJlR2V0TW9uZXk6ICFzaG93U2hhcmVHZXRNb25leVxuICAgICAgICB9KTtcbiAgICAgICAgaWYgKCAhc2hvd1NoYXJlR2V0TW9uZXkgKSB7XG4gICAgICAgICAgICB0aGlzLm9uU3Vic2NyaWJlKCApO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIC8vIOWxleekuuaLvOWbouWIl+ihqFxuICAgIHRvZ2dsZVBpbkdvb2RzKCApIHtcbiAgICAgICAgY29uc3QgeyBzaG93UGluR29vZHMgfSA9IHRoaXMuZGF0YTtcbiAgICAgICAgdGhpcy5zZXREYXRhISh7XG4gICAgICAgICAgICBzaG93UGluR29vZHM6IHNob3dQaW5Hb29kcyA9PT0gJ2hpZGUnID8gJ3Nob3cnIDogJ2hpZGUnXG4gICAgICAgIH0pO1xuICAgICAgICBpZiAoIHNob3dQaW5Hb29kcyA9PT0gJ2hpZGUnICkge1xuICAgICAgICAgICAgdGhpcy5vblN1YnNjcmliZSggKTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBvblN1YnNjcmliZSggKSB7XG4gICAgICAgIGFwcC5nZXRTdWJzY3JpYmUoJ2J1eVBpbix3YWl0UGluLHRyaXAnKTtcbiAgICB9LFxuXG4gICAgLy8g6L+b5YWl5ZWG5ZOB566h55CGXG4gICAgZ29NYW5hZ2VyKCApIHtcbiAgICAgICAgbmF2VG8oYC9wYWdlcy9tYW5hZ2VyLWdvb2RzLWRldGFpbC9pbmRleD9pZD0ke3RoaXMuZGF0YS5pZH1gKVxuICAgIH0sXG5cbiAgICAvLyDov5vlhaXmi7zlm6Llub/lnLpcbiAgICBnb0dyb3VuZCggKSB7XG4gICAgICAgIG5hdlRvKCcvcGFnZXMvZ3JvdW5kLXBpbi9pbmRleCcpXG4gICAgfSxcbiAgICBcbiAgICAvLyDov5vlhaXllYblk4Hor6bmg4VcbiAgICBnb0dvb2REZXRhaWwoeyBjdXJyZW50VGFyZ2V0IH0pIHtcbiAgICAgICAgY29uc3QgeyBwaWQgfSA9IGN1cnJlbnRUYXJnZXQuZGF0YXNldDtcbiAgICAgICAgbmF2VG8oYC9wYWdlcy9nb29kcy1kZXRhaWwvaW5kZXg/aWQ9JHtwaWR9YClcbiAgICB9LFxuXG4gICAgLyoqIOmihOiniOWbvueJhyAqL1xuICAgIHByZXZpZXdJbWcoeyBjdXJyZW50VGFyZ2V0IH0pIHtcbiAgICAgICAgY29uc3QgeyBpbWcgfSA9IGN1cnJlbnRUYXJnZXQuZGF0YXNldDtcbiAgICAgICAgdGhpcy5kYXRhLmRldGFpbCAmJiB3eC5wcmV2aWV3SW1hZ2Uoe1xuICAgICAgICAgICAgY3VycmVudDogaW1nLFxuICAgICAgICAgICAgdXJsczogWyAuLi4odGhpcy5kYXRhIGFzIGFueSkuZGV0YWlsLmltZyBdLFxuICAgICAgICB9KTtcbiAgICB9LFxuXG4gICAgLyoqIOmihOiniOWNleW8oOWbvueJh++8muaLvOWbouWbvueJh+OAgeS4gOWPo+S7t++8iOmZkOaXtuaKou+8iSAqL1xuICAgIHByZXZpZXdTaW5nbGVJbWcoeyBjdXJyZW50VGFyZ2V0IH0pIHtcblxuICAgICAgICBjb25zdCBpbWcgPSBjdXJyZW50VGFyZ2V0LmRhdGFzZXQuZGF0YSA/XG4gICAgICAgICAgICBjdXJyZW50VGFyZ2V0LmRhdGFzZXQuZGF0YS5pbWc6XG4gICAgICAgICAgICBjdXJyZW50VGFyZ2V0LmRhdGFzZXQuaW1nO1xuXG4gICAgICAgIHRoaXMuZGF0YS5kZXRhaWwgJiYgd3gucHJldmlld0ltYWdlKHtcbiAgICAgICAgICAgIGN1cnJlbnQ6IGltZyxcbiAgICAgICAgICAgIHVybHM6IFsgaW1nIF0sXG4gICAgICAgIH0pO1xuICAgIH0sXG5cbiAgICAvKiog5qOA5p+l5piv5ZCm5pyJ5Li75Yqo5by55byA6L+H5ou85Zui546p5rOVICovXG4gICAgY2hlY2tPcGVuUGluKCApIHtcbiAgICAgICAgY29uc3QgeyBkZXRhaWwgfSA9IHRoaXMuZGF0YTtcbiAgICAgICAgaWYgKCAhZGV0YWlsICkgeyByZXR1cm4gfVxuICAgICAgICBjb25zdCByZXN1bHQgPSBkZWxheWVyaW5nR29vZCggZGV0YWlsICk7XG4gICAgICAgIGlmICggcmVzdWx0ICkge1xuICAgICAgICAgICAgY29uc3Qgb25lRGF5ID0gMjQgKiA2MCAqIDYwICogMTAwMDtcbiAgICAgICAgICAgIGNvbnN0IHByaWNlR2FwID0gU3RyaW5nKCByZXN1bHQuZ29vZFBpbnMuZWFjaFByaWNlUm91bmQgKS5yZXBsYWNlKC9cXC4wMC9nLCAnJyk7XG4gICAgICAgICAgICBjb25zdCBvcGVuUmVjb3JkID0gd3guZ2V0U3RvcmFnZVN5bmMoIHN0b3JhZ2VLZXkgKTtcblxuICAgICAgICAgICAgaWYgKCAhIXByaWNlR2FwICYmIERhdGUubm93KCApIC0gTnVtYmVyKCBvcGVuUmVjb3JkICkgPj0gb25lRGF5ICkge1xuICAgICAgICAgICAgICAgIHd4LnNldFN0b3JhZ2VTeW5jKCBzdG9yYWdlS2V5LCBTdHJpbmcoIERhdGUubm93KCApKSk7XG4gICAgICAgICAgICAgICAgdGhpcy50b2dnbGVQYWx5VGlwcyggKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICAvKiog6K6+572u4oCc5Zac5qyi4oCdICovXG4gICAgb25MaWtlKCApIHtcbiAgICAgICAgY29uc3QgdGhhdCA9IHRoaXM7XG4gICAgICAgIGlmICggIXRoaXMuZGF0YS5oYXNJbml0TGlrZSApIHsgcmV0dXJuOyB9XG4gICAgICAgIGh0dHAoe1xuICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgIHBpZDogdGhpcy5kYXRhLmlkXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgdXJsOiAnbGlrZV9jcmVhdGUnLFxuICAgICAgICAgICAgc3VjY2VzczogICggcmVzOiBhbnkgKSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKCByZXMuc3RhdHVzID09PSAyMDAgKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc2V0RGF0YSEoe1xuICAgICAgICAgICAgICAgICAgICAgICAgbGlrZWQ6ICF0aGlzLmRhdGEubGlrZWRcbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH0sXG5cbiAgICAvKiog6K6+572u4oCc5Zac5qyi4oCdICovXG4gICAgY2hlY2tMaWtlKCApIHtcbiAgICAgICAgY29uc3QgdGhhdCA9IHRoaXM7XG4gICAgICAgIGh0dHAoe1xuICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgIHBpZDogdGhpcy5kYXRhLmlkXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgdXJsOiAnbGlrZV9jaGVjaycsXG4gICAgICAgICAgICBzdWNjZXNzOiAgKCByZXM6IGFueSApID0+IHtcbiAgICAgICAgICAgICAgICBpZiAoIHJlcy5zdGF0dXMgPT09IDIwMCApIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zZXREYXRhISh7XG4gICAgICAgICAgICAgICAgICAgICAgICBsaWtlZDogcmVzLmRhdGEsXG4gICAgICAgICAgICAgICAgICAgICAgICBoYXNJbml0TGlrZTogdHJ1ZVxuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfSxcblxuICAgIC8qKiDmtbfmiqXlvIDlhbMgKi9cbiAgICBvblBvc3RUb2dnbGUoIGUgKSB7XG4gICAgICAgIGNvbnN0IHZhbCA9IGUuZGV0YWlsO1xuICAgICAgICB0aGlzLnNldERhdGEhKHtcbiAgICAgICAgICAgIHNob3dpbmdQb3N0ZXI6IHZhbFxuICAgICAgICB9KTtcbiAgICAgICAgd3guc2V0TmF2aWdhdGlvbkJhclRpdGxlKHtcbiAgICAgICAgICAgIHRpdGxlOiB2YWwgPyAn5YiG5Lqr5ZWG5ZOBJyA6ICfllYblk4Hor6bmg4UnXG4gICAgICAgIH0pO1xuICAgIH0sXG5cbiAgICAvKiogc2t16YCJ5oup5by55qGGICovXG4gICAgb25Ta3VUb2dnbGUoIGUgKSB7XG4gICAgICAgIHRoaXMuc2V0RGF0YSEoe1xuICAgICAgICAgICAgb3BlbmluZ1NrdTogZS5kZXRhaWxcbiAgICAgICAgfSk7XG4gICAgfSxcblxuICAgIC8qKiBza3Xmn5Dpg6jliIbngrnlh7sgKi9cbiAgICBvblNrdVRhcCggZSApIHtcbiAgICAgICAgY29uc3QgdHlwZSA9IGUuZGV0YWlsO1xuICAgICAgICBpZiAoIHR5cGUgPT09ICdtb25leVF1ZXN0aW9uJyApIHtcbiAgICAgICAgICAgIHRoaXMudG9nZ2xlU2hhcmVHZXRNb25leSggKTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICAvKiog5bGV5byA44CB5YWz6Zetc2t15qGGICovXG4gICAgb25Ub2dnbGVTa3UoICkge1xuICAgICAgICBjb25zdCB7IG9wZW5pbmdTa3UgfSA9IHRoaXMuZGF0YTtcbiAgICAgICAgY29uc3Qgc2t1ID0gKHRoaXMgYXMgYW55KS5zZWxlY3RDb21wb25lbnQoJyNza3UnKTtcbiAgICAgICAgc2t1LnRvZ2dsZVNrdSggKTtcbiAgICAgICAgaWYgKCAhb3BlbmluZ1NrdSApIHtcbiAgICAgICAgICAgIHRoaXMub25TdWJzY3JpYmUoICk7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICog55Sf5ZG95ZGo5pyf5Ye95pWwLS3nm5HlkKzpobXpnaLliqDovb1cbiAgICAgKiB7XG4gICAgICogICAgaWQgfHwgc2NlbmUgLy8g5ZWG5ZOBaWRcbiAgICAgKiAgICB0aWQgLy8g6KGM56iLaWRcbiAgICAgKiAgICBmcm9tIC8vIOWIhuS6q+S6uueahGlkXG4gICAgICogfVxuICAgICAqL1xuICAgIG9uTG9hZDogZnVuY3Rpb24gKG9wdGlvbnMpIHtcblxuICAgICAgICBjb25zdCBzY2VuZSA9IGRlY29kZVVSSUNvbXBvbmVudCggb3B0aW9ucyEuc2NlbmUgfHwgJycgKVxuXG4gICAgICAgIHRoaXMucnVuQ29tcHV0ZWQoICk7XG5cbiAgICAgICAgdGhpcy5zZXREYXRhISh7XG4gICAgICAgICAgICBpZDogJzcxZjJjZDk0NWNhYjRmYzEwMjYxMjMyYjNmMzU4NjE5J1xuICAgICAgICB9KVxuXG4gICAgICAgIGlmICggb3B0aW9ucyEuaWQgfHwgc2NlbmUgKSB7IFxuICAgICAgICAgICAgdGhpcy5zZXREYXRhISh7XG4gICAgICAgICAgICAgICAgaWQ6IG9wdGlvbnMhLmlkIHx8IHNjZW5lLFxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoICEhKG9wdGlvbnMgYXMgYW55KS5mcm9tICkge1xuICAgICAgICAgICAgdGhpcy5zZXREYXRhISh7XG4gICAgICAgICAgICAgICAgZnJvbTogb3B0aW9ucyEuZnJvbVxuICAgICAgICAgICAgfSlcbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgc2V0VGltZW91dCgoICkgPT4ge1xuICAgICAgICAgICAgdGhpcy53YXRjaFJvbGUoICk7XG4gICAgICAgICAgICAvLyB0aGlzLmNoZWNrTGlrZSggKTtcbiAgICAgICAgICAgIHRoaXMuZmV0Y2hMYXN0KCApO1xuICAgICAgICB9LCAyMCApO1xuICAgIH0sXG4gIFxuICAgIC8qKlxuICAgICAqIOeUn+WRveWRqOacn+WHveaVsC0t55uR5ZCs6aG16Z2i5Yid5qyh5riy5p+T5a6M5oiQXG4gICAgICovXG4gICAgb25SZWFkeTogZnVuY3Rpb24gKCApIHtcbiAgICAgICAgbGV0IGNpcmNsZUNvdW50ID0gMDsgXG4gICAgICAgIGNvbnN0IHRoYXQ6IGFueSA9IHRoaXM7XG4gICAgICAgIC8vIOW/g+i3s+eahOWkluahhuWKqOeUuyBcbiAgICAgICAgdGhhdC5hbmltYXRpb25NaWRkbGVIZWFkZXJJdGVtID0gd3guY3JlYXRlQW5pbWF0aW9uKHsgXG4gICAgICAgICAgICBkdXJhdGlvbjogODAwLCBcbiAgICAgICAgICAgIHRpbWluZ0Z1bmN0aW9uOiAnZWFzZScsIFxuICAgICAgICAgICAgdHJhbnNmb3JtT3JpZ2luOiAnNTAlIDUwJScsXG4gICAgICAgIH0pOyBcbiAgICAgICAgc2V0SW50ZXJ2YWwoIGZ1bmN0aW9uKCApIHsgXG4gICAgICAgICAgICBpZiAoY2lyY2xlQ291bnQgJSAyID09IDApIHsgXG4gICAgICAgICAgICAgICAgdGhhdC5hbmltYXRpb25NaWRkbGVIZWFkZXJJdGVtLnNjYWxlKCAxLjAgKS5yb3RhdGUoIDEwICkuc3RlcCggKTsgXG4gICAgICAgICAgICB9IGVsc2UgeyBcbiAgICAgICAgICAgICAgICB0aGF0LmFuaW1hdGlvbk1pZGRsZUhlYWRlckl0ZW0uc2NhbGUoIDEuMCApLnJvdGF0ZSggLTMwICkuc3RlcCggKTsgXG4gICAgICAgICAgICB9IFxuICAgICAgICAgICAgdGhhdC5zZXREYXRhKHsgXG4gICAgICAgICAgICAgICAgYW5pbWF0aW9uTWlkZGxlSGVhZGVySXRlbTogdGhhdC5hbmltYXRpb25NaWRkbGVIZWFkZXJJdGVtLmV4cG9ydCggKSBcbiAgICAgICAgICAgIH0pOyBcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgaWYgKCArK2NpcmNsZUNvdW50ID09PSAxMDAwICkgeyBcbiAgICAgICAgICAgICAgICBjaXJjbGVDb3VudCA9IDA7IFxuICAgICAgICAgICAgfSBcbiAgICAgICAgfS5iaW5kKCB0aGlzICksIDEwMDAgKTsgXG4gICAgfSxcbiAgXG4gICAgLyoqXG4gICAgICog55Sf5ZG95ZGo5pyf5Ye95pWwLS3nm5HlkKzpobXpnaLmmL7npLpcbiAgICAgKi9cbiAgICBvblNob3c6IGZ1bmN0aW9uICggKSB7XG4gICAgICAgIGNvbnN0IHsgaWQsIHRpZCwgdHJpcCB9ID0gdGhpcy5kYXRhO1xuICAgICAgICBcbiAgICAgICAgdGhpcy5mZXREZXRhaWwoIGlkICk7XG4gICAgICAgIHRoaXMuZmV0Y2hTaG9wcGluZyggaWQsIHRpZCApO1xuXG4gICAgICAgIGlmICggISF0cmlwICkge1xuICAgICAgICAgICAgY29uc3QgeyBzdGFydF9kYXRlLCBlbmRfZGF0ZSB9ID0gKHRyaXAgYXMgYW55KTtcbiAgICAgICAgICAgICB0aGlzLmZldGNoVmlzaXRSZWNvcmQoIGlkLCBzdGFydF9kYXRlLCBlbmRfZGF0ZSApO1xuICAgICAgICB9XG5cbiAgICB9LFxuICBcbiAgICAvKipcbiAgICAgKiDnlJ/lkb3lkajmnJ/lh73mlbAtLeebkeWQrOmhtemdoumakOiXj1xuICAgICAqL1xuICAgIG9uSGlkZTogZnVuY3Rpb24gKCkge1xuICBcbiAgICB9LFxuICBcbiAgICAvKipcbiAgICAgKiDnlJ/lkb3lkajmnJ/lh73mlbAtLeebkeWQrOmhtemdouWNuOi9vVxuICAgICAqL1xuICAgIG9uVW5sb2FkOiBmdW5jdGlvbiAoKSB7XG4gIFxuICAgIH0sXG4gIFxuICAgIC8qKlxuICAgICAqIOmhtemdouebuOWFs+S6i+S7tuWkhOeQhuWHveaVsC0t55uR5ZCs55So5oi35LiL5ouJ5Yqo5L2cXG4gICAgICovXG4gICAgb25QdWxsRG93blJlZnJlc2g6IGZ1bmN0aW9uICgpIHtcbiAgXG4gICAgfSxcbiAgXG4gICAgLyoqXG4gICAgICog6aG16Z2i5LiK5ouJ6Kem5bqV5LqL5Lu255qE5aSE55CG5Ye95pWwXG4gICAgICovXG4gICAgb25SZWFjaEJvdHRvbTogZnVuY3Rpb24gKCkge1xuICBcbiAgICB9LFxuICBcbiAgICAvKipcbiAgICAgKiDnlKjmiLfngrnlh7vlj7PkuIrop5LliIbkuqtcbiAgICAgKi9cbiAgICBvblNoYXJlQXBwTWVzc2FnZTogZnVuY3Rpb24gKCBlICkge1xuICAgICAgICBjb25zdCB7IGhhc09yZGVyJCwgZGV0YWlsJCwgb3BlbmlkIH0gPSAodGhpcy5kYXRhIGFzIGFueSk7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBpbWFnZVVybDogYCR7ZGV0YWlsJC5pbWdbIDAgXX1gLFxuICAgICAgICAgICAgcGF0aDogYC9wYWdlcy9nb29kcy1kZXRhaWwvaW5kZXg/aWQ9JHtkZXRhaWwkLl9pZH0mZnJvbT0ke29wZW5pZH1gLFxuICAgICAgICAgICAgdGl0bGU6ICEhZGV0YWlsJCAmJiBkZXRhaWwkLmhhc1BpbiAmJiAhaGFzT3JkZXIkID9cbiAgICAgICAgICAgICAgICBg5pyJ5Lq65oOz6KaB5ZCX77yf5ou85Zui5Lmw77yM5oiR5Lus6YO96IO955yB77yBJHtkZXRhaWwkLnRpdGxlfWAgOlxuICAgICAgICAgICAgICAgIGDmjqjojZDjgIwke2RldGFpbCQudGFnVGV4dH3jgI3npZ7lmaghJHtkZXRhaWwkLnRpdGxlfWBcbiAgICAgICAgfVxuICAgIH1cbiAgfSkiXX0=