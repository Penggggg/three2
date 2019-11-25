"use strict";
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
        openingSku: false
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
                    var price = detail.price, title = detail.title, img = detail.img, _id_1 = detail._id;
                    meta = [{
                            price: price,
                            pid: _id_1,
                            name: title,
                            groupPrice: groupPrice,
                            sid: undefined,
                            img: img[0],
                            canPin: !!shopping.find(function (s) { return s.pid === _id_1; })
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
            pinCount$: function () {
                var _a = this.data, detail = _a.detail, shopping = _a.shopping;
                if (!detail) {
                    return 0;
                }
                var standards = detail.standards, groupPrice = detail.groupPrice;
                if (!!standards && standards.length > 0) {
                    return standards
                        .filter(function (x) { return !!shopping.find(function (s) { return s.sid === x._id && s.pid === x.pid; }); })
                        .length;
                }
                else if (!!groupPrice) {
                    var _id_2 = detail._id;
                    return !!shopping.find(function (s) { return s.pid === _id_2; }) ? 1 : 0;
                }
                return 0;
            },
            hasStanders$: function () {
                var detail = this.data.detail;
                if (!detail) {
                    return false;
                }
                var standards = detail.standards;
                return !!standards && standards.length > 0;
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
                console.log('====', r);
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
            }
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
                pid: pid,
                tid: tid,
                detail: false
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
                if (!!data[0]) {
                    var tid = data[0]._id;
                    if (!!tid) {
                        _this.fetchShopping(id, tid);
                    }
                    _this.setData({
                        tid: tid,
                        trip: data[0]
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
        var _a = this.data, id = _a.id, tid = _a.tid;
        this.fetDetail(id);
        this.fetchShopping(id, tid);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUNBLDhDQUEwQztBQUMxQyxxREFBb0Q7QUFDcEQsZ0RBQXFEO0FBQ3JELGdEQUE0QztBQUU1QyxJQUFNLEdBQUcsR0FBRyxNQUFNLEVBQVEsQ0FBQztBQUczQixJQUFNLFVBQVUsR0FBRyxvQkFBb0IsQ0FBQztBQUV4QyxJQUFJLENBQUM7SUFHRCx5QkFBeUIsRUFBRSxJQUFJO0lBSy9CLElBQUksRUFBRTtRQUVGLE1BQU0sRUFBRSxFQUFFO1FBR1YsUUFBUSxFQUFFLEVBQUU7UUFHWixLQUFLLEVBQUUsSUFBSTtRQUdYLEdBQUcsRUFBRSxFQUFFO1FBR1AsRUFBRSxFQUFFLEVBQUU7UUFHTixNQUFNLEVBQUUsSUFBSTtRQUdaLEdBQUcsRUFBRSxFQUFHO1FBR1IsT0FBTyxFQUFFLElBQUk7UUFHYixXQUFXLEVBQUUsS0FBSztRQUdsQixLQUFLLEVBQUUsS0FBSztRQUdaLFdBQVcsRUFBRTtZQUNULE1BQU0sRUFBRSxNQUFNLEVBQUUsTUFBTTtTQUN6QjtRQUdELHlCQUF5QixFQUFFLElBQUk7UUFHL0IsT0FBTyxFQUFFLEtBQUs7UUFHZCxhQUFhLEVBQUUsS0FBSztRQUdwQixZQUFZLEVBQUUsTUFBTTtRQUdwQixpQkFBaUIsRUFBRSxLQUFLO1FBR3hCLFlBQVksRUFBRSxNQUFNO1FBR3BCLGNBQWMsRUFBRSxLQUFLO1FBR3JCLEdBQUcsRUFBRSxFQUFHO1FBR1IsUUFBUSxFQUFFLEVBQUc7UUFHYixVQUFVLEVBQUUsRUFBRztRQUdmLFNBQVMsRUFBRSxFQUFHO1FBR2QsSUFBSSxFQUFFLElBQUk7UUFHVixnQkFBZ0IsRUFBRSxLQUFLO1FBR3ZCLE1BQU0sRUFBRSxFQUFFO1FBR1YsSUFBSSxFQUFFLEVBQUU7UUFHUixnQkFBZ0IsRUFBRSxDQUFDO1FBR25CLFVBQVUsRUFBRSxLQUFLO0tBQ3BCO0lBR0QsV0FBVztRQUNQLG1C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NkIsQ0FBQztRQUMxRCxPQUFPO1lBQ0gsUUFBUSxFQUFFLEtBQUcsT0FBTyxDQUFDLEdBQUcsQ0FBRSxDQUFDLENBQUk7WUFDL0IsSUFBSSxFQUFFLGtDQUFnQyxPQUFPLENBQUMsR0FBRyxjQUFTLE1BQVE7WUFDbEUsS0FBSyxFQUFFLENBQUMsQ0FBQyxPQUFPLElBQUksT0FBTyxDQUFDLE1BQU0sSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO2dCQUM5QyxxR0FBbUIsT0FBTyxDQUFDLEtBQU8sQ0FBQyxDQUFDO2dCQUNwQyx1QkFBTSxPQUFPLENBQUMsT0FBTywyQkFBTyxPQUFPLENBQUMsS0FBTztTQUNsRCxDQUFBO0lBQ0wsQ0FBQztDQUNGLENBQUMsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbIlxuaW1wb3J0IHsgaHR0cCB9IGZyb20gJy4uLy4uL3V0aWwvaHR0cC5qcyc7XG5pbXBvcnQgeyBjb21wdXRlZCB9IGZyb20gJy4uLy4uL2xpYi92dWVmeS9pbmRleC5qcyc7XG5pbXBvcnQgeyBkZWxheWVyaW5nR29vZCB9IGZyb20gJy4uLy4uL3V0aWwvZ29vZHMuanMnO1xuaW1wb3J0IHsgbmF2VG8gfSBmcm9tICcuLi8uLi91dGlsL3JvdXRlLmpzJztcblxuY29uc3QgYXBwID0gZ2V0QXBwPGFueT4oICk7XG5cbi8vIOaJk+W8gOaLvOWbouaPkOekuueahGtleVxuY29uc3Qgc3RvcmFnZUtleSA9ICdvcGVuZWQtcGluLWluLWdvb2QnO1xuXG5QYWdlKHtcblxuICAgIC8vIOWKqOeUu1xuICAgIGFuaW1hdGlvbk1pZGRsZUhlYWRlckl0ZW06IG51bGwsXG5cbiAgICAvKipcbiAgICAgKiDpobXpnaLnmoTliJ3lp4vmlbDmja5cbiAgICAgKi9cbiAgICBkYXRhOiB7XG4gICAgICAgIC8vIGlwXG4gICAgICAgIGlwTmFtZTogJycsXG5cbiAgICAgICAgLy8gaXAgXG4gICAgICAgIGlwQXZhdGFyOiAnJyxcblxuICAgICAgICAvLyDmmK/lkKbkuLrmlrDlrqJcbiAgICAgICAgaXNOZXc6IHRydWUsXG5cbiAgICAgICAgLy8g6KGM56iLXG4gICAgICAgIHRpZDogJycsXG5cbiAgICAgICAgLy8g5ZWG5ZOBaWRcbiAgICAgICAgaWQ6ICcnLFxuXG4gICAgICAgIC8vIOWVhuWTgeivpuaDhVxuICAgICAgICBkZXRhaWw6IG51bGwsXG4gICAgICAgIFxuICAgICAgICAvLyDmlbDmja7lrZflhbhcbiAgICAgICAgZGljOiB7IH0sXG4gICAgICAgIFxuICAgICAgICAvLyDliqDovb3nirbmgIFcbiAgICAgICAgbG9hZGluZzogdHJ1ZSxcblxuICAgICAgICAvLyDmmK/lkKbliJ3lp4vljJbov4figJzllpzmrKLigJ1cbiAgICAgICAgaGFzSW5pdExpa2U6IGZhbHNlLFxuXG4gICAgICAgIC8vIOaYr+WQpuKAnOWWnOasouKAnVxuICAgICAgICBsaWtlZDogZmFsc2UsXG5cbiAgICAgICAgLy8g5paH5a2X5L+d6K+B5o+Q56S6XG4gICAgICAgIHByb21pc2VUaXBzOiBbXG4gICAgICAgICAgICAn5q2j5ZOB5L+d6K+BJywgJ+S7t+agvOS8mOWKvycsICfnnJ/kurrot5Hohb8nXG4gICAgICAgIF0sXG5cbiAgICAgICAgLy8g5Yqo55S7XG4gICAgICAgIGFuaW1hdGlvbk1pZGRsZUhlYWRlckl0ZW06IG51bGwsXG5cbiAgICAgICAgLy8g5bGV56S6566h55CG5YWl5Y+jXG4gICAgICAgIHNob3dCdG46IGZhbHNlLFxuXG4gICAgICAgIC8vIOato+WcqOWxleekuua1t+aKpVxuICAgICAgICBzaG93aW5nUG9zdGVyOiBmYWxzZSxcblxuICAgICAgICAvLyDlsZXnpLrmi7zlm6Lnjqnms5XnmoTlvLnmoYZcbiAgICAgICAgc2hvd1BsYXlUaXBzOiAnaGlkZScsXG5cbiAgICAgICAgLy8g5bGV56S65YiG5Lqr6LWa6ZKxXG4gICAgICAgIHNob3dTaGFyZUdldE1vbmV5OiBmYWxzZSxcblxuICAgICAgICAvLyDlsZXnpLrmi7zlm6LllYblk4HliJfooahcbiAgICAgICAgc2hvd1Bpbkdvb2RzOiAnaGlkZScsXG5cbiAgICAgICAgLy8g5YiG5LqrVGlwczJcbiAgICAgICAgc2hvd1NoYXJlVGlwczI6IGZhbHNlLFxuXG4gICAgICAgIC8vIOaLvOWbouWIl+ihqFxuICAgICAgICBwaW46IFsgXSxcblxuICAgICAgICAvLyDllYblk4HlnKjmnKzooYznqIvnmoTotK3nianmuIXljZXliJfooahcbiAgICAgICAgc2hvcHBpbmc6IFsgXSxcblxuICAgICAgICAvLyDkuIDlj6Pku7fmtLvliqjliJfooahcbiAgICAgICAgYWN0aXZpdGllczogWyBdLFxuXG4gICAgICAgIC8vIOacrOi2n+iDveWkn+aLvOWboueahHNrdVxuICAgICAgICBjYW5QaW5Ta3U6IFsgXSxcblxuICAgICAgICAvLyDlvZPliY3nmoTooYznqItcbiAgICAgICAgdHJpcDogbnVsbCxcblxuICAgICAgICAvLyDlvZPliY3mmK/lkKblvIDlkK/kuobnp6/liIbmjqjlub9cbiAgICAgICAgY2FuSW50ZWdyYXlTaGFyZTogZmFsc2UsXG5cbiAgICAgICAgLy8g5b2T5YmN6LSm5Y+355qEb3BlbmlkXG4gICAgICAgIG9wZW5pZDogJycsXG5cbiAgICAgICAgLy8g5YiG5Lqr5Lq655qEb3BlbmlkXG4gICAgICAgIGZyb206ICcnLFxuXG4gICAgICAgIC8vIOenr+WIhuaOqOW5v+iOt+eCueavlOS+i1xuICAgICAgICBwdXNoSW50ZWdyYWxSYXRlOiAwLFxuXG4gICAgICAgIC8vIOaYr+WQpuWxleW8gHNrdVxuICAgICAgICBvcGVuaW5nU2t1OiBmYWxzZVxuICAgIH0sXG5cbiAgICAvKiog6K6+572uY29tcHV0ZWQgKi9cbiAgICBydW5Db21wdXRlZCggKSB7XG4gICAgICAgIGNvbXB1dGVkKCB0aGlzLCB7XG5cbiAgICAgICAgICAgIC8vIOiuoeeul+S7t+agvFxuICAgICAgICAgICAgcHJpY2U6IGZ1bmN0aW9uKCApIHtcbiAgICAgICAgICAgICAgICBjb25zdCB7IGRldGFpbCB9ID0gdGhpcy5kYXRhO1xuICAgICAgICAgICAgICAgIGNvbnN0IHJlc3VsdCA9IGRlbGF5ZXJpbmdHb29kKCBkZXRhaWwgKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVzdWx0ID8gcmVzdWx0LnByaWNlJCA6ICcnO1xuICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAgLy8g5ZWG5ZOB6K+m5oOFIC0g5YiG6KGM5pi+56S6XG4gICAgICAgICAgICBkZXRhaWxJbnRybzogZnVuY3Rpb24oICkge1xuICAgICAgICAgICAgICAgIGNvbnN0IHsgZGV0YWlsIH0gPSB0aGlzLmRhdGE7XG4gICAgICAgICAgICAgICAgaWYgKCAhZGV0YWlsIHx8ICggISFkZXRhaWwgJiYgIWRldGFpbC5kZXRhaWwgKSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gWyBdO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBkZXRhaWwuZGV0YWlsLnNwbGl0KCdcXG4nKS5maWx0ZXIoIHggPT4gISF4ICk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAgLy8g5Lu35qC8IO+9niDlm6LotK3ku7fnmoTlt67ku7dcbiAgICAgICAgICAgIHByaWNlR2FwOiBmdW5jdGlvbiggKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgeyBkZXRhaWwgfSA9IHRoaXMuZGF0YTtcbiAgICAgICAgICAgICAgICBpZiAoICFkZXRhaWwgKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAnJ1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHJlc3VsdCA9IGRlbGF5ZXJpbmdHb29kKCBkZXRhaWwgKTtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgZ2FwID0gcmVzdWx0ID8gU3RyaW5nKCByZXN1bHQuZ29vZFBpbnMuZWFjaFByaWNlUm91bmQgKS5yZXBsYWNlKC9cXC4wMC9nLCAnJykgOiAnJztcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgbWV0YSA9IGdhcCAhPT0gJzAnICYmICEhZ2FwID8gZ2FwIDogJyc7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBtZXRhO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgIC8vIOaLvOWbouWIl+ihqFxuICAgICAgICAgICAgcGluJDogZnVuY3Rpb24oICkge1xuICAgICAgICAgICAgICAgIGxldCBtZXRhOiBhbnkgPSBbIF07XG4gICAgICAgICAgICAgICAgY29uc3QgeyBkZXRhaWwsIHNob3BwaW5nLCBhY3Rpdml0aWVzIH0gPSB0aGlzLmRhdGE7XG5cbiAgICAgICAgICAgICAgICBpZiAoICFkZXRhaWwgKSB7IFxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gWyBdO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGNvbnN0IHsgc3RhbmRhcmRzLCBncm91cFByaWNlIH0gPSBkZXRhaWw7XG5cbiAgICAgICAgICAgICAgICBpZiAoIHN0YW5kYXJkcy5sZW5ndGggPiAwICkge1xuICAgICAgICAgICAgICAgICAgICBtZXRhID0gc3RhbmRhcmRzXG4gICAgICAgICAgICAgICAgICAgICAgICAuZmlsdGVyKCB4ID0+ICEheC5ncm91cFByaWNlIClcbiAgICAgICAgICAgICAgICAgICAgICAgIC5tYXAoIHggPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBPYmplY3QuYXNzaWduKHsgfSwgeCwge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzaWQ6IHguX2lkLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYW5QaW46ICEhc2hvcHBpbmcuZmluZCggcyA9PiBzLnNpZCA9PT0geC5faWQgJiYgcy5waWQgPT09IHgucGlkIClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKCAhIWdyb3VwUHJpY2UgKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHsgcHJpY2UsIHRpdGxlLCBpbWcsIF9pZCB9ID0gZGV0YWlsO1xuICAgICAgICAgICAgICAgICAgICBtZXRhID0gW3tcbiAgICAgICAgICAgICAgICAgICAgICAgIHByaWNlLFxuICAgICAgICAgICAgICAgICAgICAgICAgcGlkOiBfaWQsXG4gICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiB0aXRsZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGdyb3VwUHJpY2UsXG4gICAgICAgICAgICAgICAgICAgICAgICBzaWQ6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICAgICAgICAgIGltZzogaW1nWyAwIF0sXG4gICAgICAgICAgICAgICAgICAgICAgICBjYW5QaW46ICEhc2hvcHBpbmcuZmluZCggcyA9PiBzLnBpZCA9PT0gX2lkIClcbiAgICAgICAgICAgICAgICAgICAgfV07XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgLy8g5qC55o2u5rS75Yqo77yM5pu05pS544CB5paw5aKe5ou85Zui6aG555uuXG4gICAgICAgICAgICAgICAgYWN0aXZpdGllcy5tYXAoIGFjID0+IHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCAhYWMuYWNfZ3JvdXBQcmljZSApIHsgcmV0dXJuOyB9XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHBpblRhcmdldCA9IG1ldGEuZmluZCggeCA9PiB4LnBpZCA9PT0gYWMucGlkICYmIHguc2lkID09PSBhYy5zaWQgKTtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgcGluVGFyZ2V0SW5kZXggPSBtZXRhLmZpbmRJbmRleCggeCA9PiB4LnBpZCA9PT0gYWMucGlkICYmIHguc2lkID09PSBhYy5zaWQgKTtcblxuICAgICAgICAgICAgICAgICAgICAvLyDmm7/mjaJcbiAgICAgICAgICAgICAgICAgICAgaWYgKCBwaW5UYXJnZXRJbmRleCAhPT0gLTEgKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBtZXRhLnNwbGljZSggcGluVGFyZ2V0SW5kZXgsIDEsIE9iamVjdC5hc3NpZ24oeyB9LCBwaW5UYXJnZXQsIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcmljZTogYWMuYWNfcHJpY2UsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZ3JvdXBQcmljZTogYWMuYWNfZ3JvdXBQcmljZVxuICAgICAgICAgICAgICAgICAgICAgICAgfSkpO1xuXG4gICAgICAgICAgICAgICAgICAgIC8vIOaWsOWinlxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgbWV0YS5wdXNoKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzaWQ6IGFjLnNpZCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwaWQ6IGFjLnBpZCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbWc6IGFjLmltZyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiBhYy50aXRsZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYW5QaW46ICEhc2hvcHBpbmcuZmluZCggcyA9PiBzLnNpZCA9PT0gYWMuc2lkICYmIHMucGlkID09PSBhYy5waWQgKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcmljZTogYWMuYWNfcHJpY2UsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZ3JvdXBQcmljZTogYWMuYWNfZ3JvdXBQcmljZSBcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgIGNvbnN0IG1ldGEyID0gbWV0YS5tYXAoIHggPT4gT2JqZWN0LmFzc2lnbih7IH0sIHgsIHtcbiAgICAgICAgICAgICAgICAgICAgZGVsdGE6IE51bWJlciggeC5wcmljZSAtIHguZ3JvdXBQcmljZSApLnRvRml4ZWQoIDAgKVxuICAgICAgICAgICAgICAgIH0pKTtcblxuICAgICAgICAgICAgICAgIHJldHVybiBtZXRhMjtcbiAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgIC8vIOmprOS4iuWPr+S7peaLvOWboueahOS4quaVsFxuICAgICAgICAgICAgcGluQ291bnQkOiBmdW5jdGlvbiggKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgeyBkZXRhaWwsIHNob3BwaW5nIH0gPSB0aGlzLmRhdGE7XG4gICAgICAgICAgICAgICAgaWYgKCAhZGV0YWlsICkgeyBcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIDA7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgY29uc3QgeyBzdGFuZGFyZHMsIGdyb3VwUHJpY2UgfSA9IGRldGFpbDtcblxuICAgICAgICAgICAgICAgIGlmICggISFzdGFuZGFyZHMgJiYgc3RhbmRhcmRzLmxlbmd0aCA+IDAgKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBzdGFuZGFyZHNcbiAgICAgICAgICAgICAgICAgICAgICAgIC5maWx0ZXIoIHggPT4gISFzaG9wcGluZy5maW5kKCBzID0+IHMuc2lkID09PSB4Ll9pZCAmJiBzLnBpZCA9PT0geC5waWQgKSlcbiAgICAgICAgICAgICAgICAgICAgICAgIC5sZW5ndGg7XG5cbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKCAhIWdyb3VwUHJpY2UgKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHsgX2lkIH0gPSBkZXRhaWw7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAhIXNob3BwaW5nLmZpbmQoIHMgPT4gcy5waWQgPT09IF9pZCApID8gMSA6IDBcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gMDtcbiAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgIC8vIOaYr+WQpuacieWei+WPt1xuICAgICAgICAgICAgaGFzU3RhbmRlcnMkOiBmdW5jdGlvbiggKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgeyBkZXRhaWwgfSA9IHRoaXMuZGF0YTtcbiAgICAgICAgICAgICAgICBpZiAoICFkZXRhaWwgKSB7IFxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGNvbnN0IHsgc3RhbmRhcmRzIH0gPSBkZXRhaWw7XG4gICAgICAgICAgICAgICAgcmV0dXJuICEhc3RhbmRhcmRzICYmIHN0YW5kYXJkcy5sZW5ndGggPiAwIDtcbiAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgIC8vIOenr+WIhuWMuumXtFxuICAgICAgICAgICAgaW50ZWdyYWwkOiBmdW5jdGlvbiggKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgeyBkZXRhaWwsIHB1c2hJbnRlZ3JhbFJhdGUgfSA9IHRoaXMuZGF0YTtcbiAgICAgICAgICAgICAgICBpZiAoICFkZXRhaWwgKSB7IFxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gJyc7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGNvbnN0IHJlc3VsdCA9IGRlbGF5ZXJpbmdHb29kKCBkZXRhaWwsIHB1c2hJbnRlZ3JhbFJhdGUgKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVzdWx0LmludGVncmFsJDtcbiAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgIC8vIOivpuaDhVxuICAgICAgICAgICAgZGV0YWlsJDogZnVuY3Rpb24oICkge1xuICAgICAgICAgICAgICAgIGNvbnN0IHsgZGV0YWlsIH0gPSB0aGlzLmRhdGE7XG4gICAgICAgICAgICAgICAgY29uc3QgciA9IGRlbGF5ZXJpbmdHb29kKCBkZXRhaWwgKVxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCc9PT09JywgciApO1xuICAgICAgICAgICAgICAgIHJldHVybiByO1xuICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAgLy8g5q2k6LSm5Y+377yM5piv5ZCm5pyJ5Y2VXG4gICAgICAgICAgICBoYXNPcmRlciQoICkge1xuICAgICAgICAgICAgICAgIGNvbnN0IHsgb3BlbmlkLCB0cmlwU2hvcHBpbmdsaXN0IH0gPSB0aGlzLmRhdGE7XG4gICAgICAgICAgICAgICAgY29uc3QgciA9ICh0cmlwU2hvcHBpbmdsaXN0IHx8IFsgXSlcbiAgICAgICAgICAgICAgICAgICAgLmZpbHRlciggc2wgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgeyB1aWRzIH0gPSBzbDtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB1aWRzLmluY2x1ZGVzKCBvcGVuaWQgKTtcbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICBjb25zdCByZXN1bHQgPSBBcnJheS5pc0FycmF5KCB0cmlwU2hvcHBpbmdsaXN0ICkgJiYgdHJpcFNob3BwaW5nbGlzdC5sZW5ndGggPiAwXG4gICAgICAgICAgICAgICAgICAgID8gci5sZW5ndGggPiAwIDogZmFsc2U7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgICAgICAgIH1cblxuICAgICAgICB9KVxuICAgIH0sXG5cbiAgICAvKiog55uR5ZCs5YWo5bGA566h55CG5ZGY5p2D6ZmQICovXG4gICAgd2F0Y2hSb2xlKCApIHtcbiAgICAgICAgKGFwcCBhcyBhbnkpLndhdGNoJCgncm9sZScsICggdmFsICkgPT4ge1xuICAgICAgICAgICAgdGhpcy5zZXREYXRhISh7XG4gICAgICAgICAgICAgICAgc2hvd0J0bjogKCB2YWwgPT09IDEgKVxuICAgICAgICAgICAgfSlcbiAgICAgICAgfSk7XG4gICAgICAgIChhcHAgYXMgYW55KS53YXRjaCQoJ2lzTmV3JywgdmFsID0+IHtcbiAgICAgICAgICAgIHRoaXMuc2V0RGF0YSEoe1xuICAgICAgICAgICAgICAgIGlzTmV3OiB2YWxcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICAgICAgKGFwcCBhcyBhbnkpLndhdGNoJCgnYXBwQ29uZmlnJywgdmFsID0+IHtcbiAgICAgICAgICAgIGlmICggIXZhbCApIHsgcmV0dXJuOyB9XG4gICAgICAgICAgICB0aGlzLnNldERhdGEhKHtcbiAgICAgICAgICAgICAgICBpcE5hbWU6IHZhbFsnaXAtbmFtZSddLFxuICAgICAgICAgICAgICAgIGlwQXZhdGFyOiB2YWxbJ2lwLWF2YXRhciddLFxuICAgICAgICAgICAgICAgIHB1c2hJbnRlZ3JhbFJhdGU6ICh2YWwgfHwgeyB9KVsncHVzaC1pbnRlZ3JhbC1nZXQtcmF0ZSddIHx8IDAsXG4gICAgICAgICAgICAgICAgY2FuSW50ZWdyYXlTaGFyZTogISEodmFsIHx8IHsgfSlbJ2dvb2QtaW50ZWdyYWwtc2hhcmUnXSB8fCBmYWxzZVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB0aGlzLmNyZWF0ZVNoYXJlKCApO1xuICAgICAgICB9KTtcbiAgICAgICAgKGFwcCBhcyBhbnkpLndhdGNoJCgnb3BlbmlkJywgdmFsID0+IHtcbiAgICAgICAgICAgIHRoaXMuc2V0RGF0YSEoe1xuICAgICAgICAgICAgICAgIG9wZW5pZDogdmFsXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHRoaXMuY3JlYXRlU2hhcmUoICk7XG4gICAgICAgIH0pO1xuICAgIH0sXG5cbiAgICAvKiog5ouJ5Y+W5ZWG5ZOB6K+m5oOFICovXG4gICAgZmV0RGV0YWlsKCBpZCApIHtcbiAgICAgICAgY29uc3QgeyBkZXRhaWwsIGZyb20gfSA9IHRoaXMuZGF0YTtcbiAgICAgICAgaWYgKCBkZXRhaWwgKSB7IHJldHVybjsgfVxuICAgICAgICBodHRwKHtcbiAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICBfaWQ6IGlkLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGVyck1zZzogJ+iOt+WPluWVhuWTgemUmeivr++8jOivt+mHjeivlScsXG4gICAgICAgICAgICB1cmw6IGBnb29kX2RldGFpbGAsXG4gICAgICAgICAgICBzdWNjZXNzOiByZXMgPT4ge1xuICAgICAgICAgICAgICBpZiAoIHJlcy5zdGF0dXMgIT09IDIwMCApIHsgcmV0dXJuOyB9XG5cbiAgICAgICAgICAgICAgICBsZXQgcGluOiBhbnkgPSBbIF07XG4gICAgICAgICAgICAgICAgY29uc3QgeyBzdGFuZGFyZHMsIGdyb3VwUHJpY2UsIGFjdGl2aXRpZXMgfSA9IHJlcy5kYXRhO1xuXG4gICAgICAgICAgICAgICAgaWYgKCBzdGFuZGFyZHMubGVuZ3RoID4gMCApIHtcbiAgICAgICAgICAgICAgICAgICAgcGluID0gc3RhbmRhcmRzLmZpbHRlciggeCA9PiAhIXguZ3JvdXBQcmljZSApO1xuXG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmICggISFncm91cFByaWNlICkge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCB7IHByaWNlLCB0aXRsZSwgaW1nICB9ID0gcmVzLmRhdGE7XG4gICAgICAgICAgICAgICAgICAgIHBpbiA9IFt7XG4gICAgICAgICAgICAgICAgICAgICAgICBwcmljZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6IHRpdGxlLFxuICAgICAgICAgICAgICAgICAgICAgICAgZ3JvdXBQcmljZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGltZzogaW1nWyAwIF1cbiAgICAgICAgICAgICAgICAgICAgfV07XG4gICAgICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgICAgIGNvbnN0IGFjdGl2aXRpZXMkID0gYWN0aXZpdGllcy5tYXAoIHggPT4ge1xuXG4gICAgICAgICAgICAgICAgICAgIGxldCBpbWcgPSAnJztcbiAgICAgICAgICAgICAgICAgICAgaWYgKCAhIXguc2lkICkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaW1nID0gc3RhbmRhcmRzLmZpbmQoIHkgPT4geS5faWQgPT09IHguc2lkICkuaW1nXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpbWcgPSByZXMuZGF0YS5pbWdbIDAgXTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBPYmplY3QuYXNzaWduKHsgfSwgeCwgeyBcbiAgICAgICAgICAgICAgICAgICAgICAgIGltZyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvdW50ZG93bjogKCB4LmVuZFRpbWUgLSBuZXcgRGF0ZSggKS5nZXRUaW1lKCApKSAvICggMTAwMCApXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgfSkuZmlsdGVyKCB5ID0+IHkuZW5kVGltZSA+IG5ldyBEYXRlKCApLmdldFRpbWUoICkpO1xuXG4gICAgICAgICAgICAgICAgdGhpcy5zZXREYXRhISh7XG4gICAgICAgICAgICAgICAgICAgIHBpbixcbiAgICAgICAgICAgICAgICAgICAgbG9hZGluZzogZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgIGRldGFpbDogcmVzLmRhdGEsXG4gICAgICAgICAgICAgICAgICAgIGFjdGl2aXRpZXM6IGFjdGl2aXRpZXMkXG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICAvLyDlvLnotbfmi7zlm6LmoYZcbiAgICAgICAgICAgICAgICBpZiAoICEhZnJvbSAmJiBkZWxheWVyaW5nR29vZCggcmVzLmRhdGEgKS5oYXNQaW4gKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc2V0RGF0YSEoe1xuICAgICAgICAgICAgICAgICAgICAgICAgc2hvd1BsYXlUaXBzOiAnc2hvdydcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmICggIWZyb20gJiYgZGVsYXllcmluZ0dvb2QoIHJlcy5kYXRhICkuaGFzUGluICkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmNoZWNrT3BlblBpbiggKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH0sXG5cbiAgICAvKiog5ouJ5Y+W5b2T5YmN5ZWG5ZOB55qE6LSt54mp6K+35Y2V5L+h5oGvICovXG4gICAgZmV0Y2hTaG9wcGluZyggcGlkLCB0aWQgKSB7XG4gICAgICAgIGlmICggIXBpZCB8fCAhdGlkICkgeyByZXR1cm47IH1cblxuICAgICAgICBodHRwKHtcbiAgICAgICAgICAgIHVybDogJ3Nob3BwaW5nLWxpc3RfcGluJyxcbiAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICBwaWQsXG4gICAgICAgICAgICAgICAgdGlkLFxuICAgICAgICAgICAgICAgIGRldGFpbDogZmFsc2VcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBzdWNjZXNzOiByZXMgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IHsgc3RhdHVzLCBkYXRhIH0gPSByZXM7XG4gICAgICAgICAgICAgICAgaWYgKCBzdGF0dXMgIT09IDIwMCApIHsgcmV0dXJuOyB9XG4gICAgICAgICAgICAgICAgdGhpcy5zZXREYXRhISh7XG4gICAgICAgICAgICAgICAgICAgIHNob3BwaW5nOiBkYXRhLFxuICAgICAgICAgICAgICAgICAgICBjYW5QaW5Ta3U6IGRhdGEubWFwKCB4ID0+ICh7XG4gICAgICAgICAgICAgICAgICAgICAgICBwaWQ6IHgucGlkLFxuICAgICAgICAgICAgICAgICAgICAgICAgc2lkOiB4LnNpZFxuICAgICAgICAgICAgICAgICAgICB9KSlcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSlcbiAgICB9LFxuXG4gICAgLyoqIOaLieWPluS4pOS4quacgOaWsOihjOeoiyAqL1xuICAgIGZldGNoTGFzdCggKSB7XG4gICAgICAgIGNvbnN0IHsgaWQgfSA9IHRoaXMuZGF0YTtcbiAgICAgICAgaHR0cCh7XG4gICAgICAgICAgICBkYXRhOiB7IH0sXG4gICAgICAgICAgICB1cmw6IGB0cmlwX2VudGVyYCxcbiAgICAgICAgICAgIHN1Y2Nlc3M6IHJlcyA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3QgeyBzdGF0dXMsIGRhdGEgfSA9IHJlcztcbiAgICAgICAgICAgICAgICBpZiAoIHN0YXR1cyAhPT0gMjAwICkgeyByZXR1cm47IH1cblxuICAgICAgICAgICAgICAgIGlmICggISFkYXRhWyAwIF0pIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgdGlkID0gZGF0YVsgMCBdLl9pZFxuXG4gICAgICAgICAgICAgICAgICAgIGlmICggISF0aWQgKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmZldGNoU2hvcHBpbmcoIGlkLCB0aWQgKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB0aGlzLnNldERhdGEhKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRpZCxcbiAgICAgICAgICAgICAgICAgICAgICAgIHRyaXA6IGRhdGFbIDAgXVxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgfSxcblxuICAgIC8qKiDliJvlu7rliIbkuqvorrDlvZUgKi9cbiAgICBjcmVhdGVTaGFyZSggKSB7XG4gICAgICAgIGNvbnN0IHsgaWQsIGNhbkludGVncmF5U2hhcmUsIGZyb20sIG9wZW5pZCB9ID0gdGhpcy5kYXRhO1xuICAgICAgICBpZiAoICFpZCB8fCAhY2FuSW50ZWdyYXlTaGFyZSB8fCAhZnJvbSB8fCAhb3BlbmlkICkgeyByZXR1cm47IH1cbiAgICAgICAgaHR0cCh7XG4gICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgZnJvbSxcbiAgICAgICAgICAgICAgICBwaWQ6IGlkLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHVybDogJ2NvbW1vbl9jcmVhdGUtc2hhcmUnXG4gICAgICAgIH0pO1xuICAgIH0sXG5cbiAgICAvLyDlsZXlvIDmj5DnpLpcbiAgICB0b2dnbGVQYWx5VGlwcyggZT8gKSB7XG4gICAgICAgIGNvbnN0IHsgc2hvd1BsYXlUaXBzIH0gPSB0aGlzLmRhdGE7XG4gICAgICAgIHRoaXMuc2V0RGF0YSEoe1xuICAgICAgICAgICAgc2hvd1BsYXlUaXBzOiBzaG93UGxheVRpcHMgPT09ICdzaG93JyA/ICdoaWRlJyA6ICdzaG93J1xuICAgICAgICB9KTtcbiAgICB9LFxuXG4gICAgdG9nZ2xlU2hhcmVHZXRNb25leSggKSB7XG4gICAgICAgIGNvbnN0IHsgc2hvd1NoYXJlR2V0TW9uZXkgfSA9IHRoaXMuZGF0YTtcbiAgICAgICAgdGhpcy5zZXREYXRhISh7XG4gICAgICAgICAgICBzaG93U2hhcmVHZXRNb25leTogIXNob3dTaGFyZUdldE1vbmV5XG4gICAgICAgIH0pO1xuICAgICAgICBpZiAoICFzaG93U2hhcmVHZXRNb25leSApIHtcbiAgICAgICAgICAgIHRoaXMub25TdWJzY3JpYmUoICk7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgdG9nZ2xlUGluR29vZHMoICkge1xuICAgICAgICBjb25zdCB7IHNob3dQaW5Hb29kcyB9ID0gdGhpcy5kYXRhO1xuICAgICAgICB0aGlzLnNldERhdGEhKHtcbiAgICAgICAgICAgIHNob3dQaW5Hb29kczogc2hvd1Bpbkdvb2RzID09PSAnaGlkZScgPyAnc2hvdycgOiAnaGlkZSdcbiAgICAgICAgfSk7XG4gICAgICAgIGlmICggc2hvd1Bpbkdvb2RzID09PSAnaGlkZScgKSB7XG4gICAgICAgICAgICB0aGlzLm9uU3Vic2NyaWJlKCApO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIG9uU3Vic2NyaWJlKCApIHtcbiAgICAgICAgYXBwLmdldFN1YnNjcmliZSgnYnV5UGluLHdhaXRQaW4sdHJpcCcpO1xuICAgIH0sXG5cbiAgICAvLyDov5vlhaXllYblk4HnrqHnkIZcbiAgICBnb01hbmFnZXIoICkge1xuICAgICAgICBuYXZUbyhgL3BhZ2VzL21hbmFnZXItZ29vZHMtZGV0YWlsL2luZGV4P2lkPSR7dGhpcy5kYXRhLmlkfWApXG4gICAgfSxcbiAgICBcbiAgICAvKiog6aKE6KeI5Zu+54mHICovXG4gICAgcHJldmlld0ltZyh7IGN1cnJlbnRUYXJnZXQgfSkge1xuICAgICAgICBjb25zdCB7IGltZyB9ID0gY3VycmVudFRhcmdldC5kYXRhc2V0O1xuICAgICAgICB0aGlzLmRhdGEuZGV0YWlsICYmIHd4LnByZXZpZXdJbWFnZSh7XG4gICAgICAgICAgICBjdXJyZW50OiBpbWcsXG4gICAgICAgICAgICB1cmxzOiBbIC4uLih0aGlzLmRhdGEgYXMgYW55KS5kZXRhaWwuaW1nIF0sXG4gICAgICAgIH0pO1xuICAgIH0sXG5cbiAgICAvKiog6aKE6KeI5Y2V5byg5Zu+54mH77ya5ou85Zui5Zu+54mH44CB5LiA5Y+j5Lu377yI6ZmQ5pe25oqi77yJICovXG4gICAgcHJldmlld1NpbmdsZUltZyh7IGN1cnJlbnRUYXJnZXQgfSkge1xuXG4gICAgICAgIGNvbnN0IGltZyA9IGN1cnJlbnRUYXJnZXQuZGF0YXNldC5kYXRhID9cbiAgICAgICAgICAgIGN1cnJlbnRUYXJnZXQuZGF0YXNldC5kYXRhLmltZzpcbiAgICAgICAgICAgIGN1cnJlbnRUYXJnZXQuZGF0YXNldC5pbWc7XG5cbiAgICAgICAgdGhpcy5kYXRhLmRldGFpbCAmJiB3eC5wcmV2aWV3SW1hZ2Uoe1xuICAgICAgICAgICAgY3VycmVudDogaW1nLFxuICAgICAgICAgICAgdXJsczogWyBpbWcgXSxcbiAgICAgICAgfSk7XG4gICAgfSxcblxuICAgIC8qKiDmo4Dmn6XmmK/lkKbmnInkuLvliqjlvLnlvIDov4fmi7zlm6Lnjqnms5UgKi9cbiAgICBjaGVja09wZW5QaW4oICkge1xuICAgICAgICBjb25zdCB7IGRldGFpbCB9ID0gdGhpcy5kYXRhO1xuICAgICAgICBpZiAoICFkZXRhaWwgKSB7IHJldHVybiB9XG4gICAgICAgIGNvbnN0IHJlc3VsdCA9IGRlbGF5ZXJpbmdHb29kKCBkZXRhaWwgKTtcbiAgICAgICAgaWYgKCByZXN1bHQgKSB7XG4gICAgICAgICAgICBjb25zdCBvbmVEYXkgPSAyNCAqIDYwICogNjAgKiAxMDAwO1xuICAgICAgICAgICAgY29uc3QgcHJpY2VHYXAgPSBTdHJpbmcoIHJlc3VsdC5nb29kUGlucy5lYWNoUHJpY2VSb3VuZCApLnJlcGxhY2UoL1xcLjAwL2csICcnKTtcbiAgICAgICAgICAgIGNvbnN0IG9wZW5SZWNvcmQgPSB3eC5nZXRTdG9yYWdlU3luYyggc3RvcmFnZUtleSApO1xuXG4gICAgICAgICAgICBpZiAoICEhcHJpY2VHYXAgJiYgRGF0ZS5ub3coICkgLSBOdW1iZXIoIG9wZW5SZWNvcmQgKSA+PSBvbmVEYXkgKSB7XG4gICAgICAgICAgICAgICAgd3guc2V0U3RvcmFnZVN5bmMoIHN0b3JhZ2VLZXksIFN0cmluZyggRGF0ZS5ub3coICkpKTtcbiAgICAgICAgICAgICAgICB0aGlzLnRvZ2dsZVBhbHlUaXBzKCApO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSxcblxuICAgIC8qKiDorr7nva7igJzllpzmrKLigJ0gKi9cbiAgICBvbkxpa2UoICkge1xuICAgICAgICBjb25zdCB0aGF0ID0gdGhpcztcbiAgICAgICAgaWYgKCAhdGhpcy5kYXRhLmhhc0luaXRMaWtlICkgeyByZXR1cm47IH1cbiAgICAgICAgaHR0cCh7XG4gICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgcGlkOiB0aGlzLmRhdGEuaWRcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB1cmw6ICdsaWtlX2NyZWF0ZScsXG4gICAgICAgICAgICBzdWNjZXNzOiAgKCByZXM6IGFueSApID0+IHtcbiAgICAgICAgICAgICAgICBpZiAoIHJlcy5zdGF0dXMgPT09IDIwMCApIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zZXREYXRhISh7XG4gICAgICAgICAgICAgICAgICAgICAgICBsaWtlZDogIXRoaXMuZGF0YS5saWtlZFxuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfSxcblxuICAgIC8qKiDorr7nva7igJzllpzmrKLigJ0gKi9cbiAgICBjaGVja0xpa2UoICkge1xuICAgICAgICBjb25zdCB0aGF0ID0gdGhpcztcbiAgICAgICAgaHR0cCh7XG4gICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgcGlkOiB0aGlzLmRhdGEuaWRcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB1cmw6ICdsaWtlX2NoZWNrJyxcbiAgICAgICAgICAgIHN1Y2Nlc3M6ICAoIHJlczogYW55ICkgPT4ge1xuICAgICAgICAgICAgICAgIGlmICggcmVzLnN0YXR1cyA9PT0gMjAwICkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnNldERhdGEhKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxpa2VkOiByZXMuZGF0YSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGhhc0luaXRMaWtlOiB0cnVlXG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9LFxuXG4gICAgLyoqIOa1t+aKpeW8gOWFsyAqL1xuICAgIG9uUG9zdFRvZ2dsZSggZSApIHtcbiAgICAgICAgY29uc3QgdmFsID0gZS5kZXRhaWw7XG4gICAgICAgIHRoaXMuc2V0RGF0YSEoe1xuICAgICAgICAgICAgc2hvd2luZ1Bvc3RlcjogdmFsXG4gICAgICAgIH0pO1xuICAgICAgICB3eC5zZXROYXZpZ2F0aW9uQmFyVGl0bGUoe1xuICAgICAgICAgICAgdGl0bGU6IHZhbCA/ICfliIbkuqvllYblk4EnIDogJ+WVhuWTgeivpuaDhSdcbiAgICAgICAgfSk7XG4gICAgfSxcblxuICAgIC8qKiBza3XpgInmi6nlvLnmoYYgKi9cbiAgICBvblNrdVRvZ2dsZSggZSApIHtcbiAgICAgICAgdGhpcy5zZXREYXRhISh7XG4gICAgICAgICAgICBvcGVuaW5nU2t1OiBlLmRldGFpbFxuICAgICAgICB9KTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICog55Sf5ZG95ZGo5pyf5Ye95pWwLS3nm5HlkKzpobXpnaLliqDovb1cbiAgICAgKiB7XG4gICAgICogICAgaWQgfHwgc2NlbmUgLy8g5ZWG5ZOBaWRcbiAgICAgKiAgICB0aWQgLy8g6KGM56iLaWRcbiAgICAgKiAgICBmcm9tIC8vIOWIhuS6q+S6uueahGlkXG4gICAgICogfVxuICAgICAqL1xuICAgIG9uTG9hZDogZnVuY3Rpb24gKG9wdGlvbnMpIHtcblxuICAgICAgICBjb25zdCBzY2VuZSA9IGRlY29kZVVSSUNvbXBvbmVudCggb3B0aW9ucyEuc2NlbmUgfHwgJycgKVxuICAgICAgICBcbiAgICAgICAgdGhpcy5ydW5Db21wdXRlZCggKTtcblxuICAgICAgICB0aGlzLnNldERhdGEhKHtcbiAgICAgICAgICAgIGlkOiAnNzFmMmNkOTQ1Y2FiNGZjMTAyNjEyMzJiM2YzNTg2MTknXG4gICAgICAgIH0pXG5cbiAgICAgICAgaWYgKCBvcHRpb25zIS5pZCB8fCBzY2VuZSApIHsgXG4gICAgICAgICAgICB0aGlzLnNldERhdGEhKHtcbiAgICAgICAgICAgICAgICBpZDogb3B0aW9ucyEuaWQgfHwgc2NlbmUsXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICggISEob3B0aW9ucyBhcyBhbnkpLmZyb20gKSB7XG4gICAgICAgICAgICB0aGlzLnNldERhdGEhKHtcbiAgICAgICAgICAgICAgICBmcm9tOiBvcHRpb25zIS5mcm9tXG4gICAgICAgICAgICB9KVxuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICBzZXRUaW1lb3V0KCggKSA9PiB7XG4gICAgICAgICAgICB0aGlzLndhdGNoUm9sZSggKTtcbiAgICAgICAgICAgIC8vIHRoaXMuY2hlY2tMaWtlKCApO1xuICAgICAgICAgICAgdGhpcy5mZXRjaExhc3QoICk7XG4gICAgICAgIH0sIDIwICk7XG4gICAgfSxcbiAgXG4gICAgLyoqXG4gICAgICog55Sf5ZG95ZGo5pyf5Ye95pWwLS3nm5HlkKzpobXpnaLliJ3mrKHmuLLmn5PlrozmiJBcbiAgICAgKi9cbiAgICBvblJlYWR5OiBmdW5jdGlvbiAoICkge1xuICAgICAgICBsZXQgY2lyY2xlQ291bnQgPSAwOyBcbiAgICAgICAgY29uc3QgdGhhdDogYW55ID0gdGhpcztcbiAgICAgICAgLy8g5b+D6Lez55qE5aSW5qGG5Yqo55S7IFxuICAgICAgICB0aGF0LmFuaW1hdGlvbk1pZGRsZUhlYWRlckl0ZW0gPSB3eC5jcmVhdGVBbmltYXRpb24oeyBcbiAgICAgICAgICAgIGR1cmF0aW9uOiA4MDAsIFxuICAgICAgICAgICAgdGltaW5nRnVuY3Rpb246ICdlYXNlJywgXG4gICAgICAgICAgICB0cmFuc2Zvcm1PcmlnaW46ICc1MCUgNTAlJyxcbiAgICAgICAgfSk7IFxuICAgICAgICBzZXRJbnRlcnZhbCggZnVuY3Rpb24oICkgeyBcbiAgICAgICAgICAgIGlmIChjaXJjbGVDb3VudCAlIDIgPT0gMCkgeyBcbiAgICAgICAgICAgICAgICB0aGF0LmFuaW1hdGlvbk1pZGRsZUhlYWRlckl0ZW0uc2NhbGUoIDEuMCApLnJvdGF0ZSggMTAgKS5zdGVwKCApOyBcbiAgICAgICAgICAgIH0gZWxzZSB7IFxuICAgICAgICAgICAgICAgIHRoYXQuYW5pbWF0aW9uTWlkZGxlSGVhZGVySXRlbS5zY2FsZSggMS4wICkucm90YXRlKCAtMzAgKS5zdGVwKCApOyBcbiAgICAgICAgICAgIH0gXG4gICAgICAgICAgICB0aGF0LnNldERhdGEoeyBcbiAgICAgICAgICAgICAgICBhbmltYXRpb25NaWRkbGVIZWFkZXJJdGVtOiB0aGF0LmFuaW1hdGlvbk1pZGRsZUhlYWRlckl0ZW0uZXhwb3J0KCApIFxuICAgICAgICAgICAgfSk7IFxuICAgICAgICAgICAgXG4gICAgICAgICAgICBpZiAoICsrY2lyY2xlQ291bnQgPT09IDEwMDAgKSB7IFxuICAgICAgICAgICAgICAgIGNpcmNsZUNvdW50ID0gMDsgXG4gICAgICAgICAgICB9IFxuICAgICAgICB9LmJpbmQoIHRoaXMgKSwgMTAwMCApOyBcbiAgICB9LFxuICBcbiAgICAvKipcbiAgICAgKiDnlJ/lkb3lkajmnJ/lh73mlbAtLeebkeWQrOmhtemdouaYvuekulxuICAgICAqL1xuICAgIG9uU2hvdzogZnVuY3Rpb24gKCApIHtcbiAgICAgICAgY29uc3QgeyBpZCwgdGlkIH0gPSB0aGlzLmRhdGE7XG5cbiAgICAgICAgdGhpcy5mZXREZXRhaWwoIGlkICk7XG4gICAgICAgIHRoaXMuZmV0Y2hTaG9wcGluZyggaWQsIHRpZCApO1xuICAgIH0sXG4gIFxuICAgIC8qKlxuICAgICAqIOeUn+WRveWRqOacn+WHveaVsC0t55uR5ZCs6aG16Z2i6ZqQ6JePXG4gICAgICovXG4gICAgb25IaWRlOiBmdW5jdGlvbiAoKSB7XG4gIFxuICAgIH0sXG4gIFxuICAgIC8qKlxuICAgICAqIOeUn+WRveWRqOacn+WHveaVsC0t55uR5ZCs6aG16Z2i5Y246L29XG4gICAgICovXG4gICAgb25VbmxvYWQ6IGZ1bmN0aW9uICgpIHtcbiAgXG4gICAgfSxcbiAgXG4gICAgLyoqXG4gICAgICog6aG16Z2i55u45YWz5LqL5Lu25aSE55CG5Ye95pWwLS3nm5HlkKznlKjmiLfkuIvmi4nliqjkvZxcbiAgICAgKi9cbiAgICBvblB1bGxEb3duUmVmcmVzaDogZnVuY3Rpb24gKCkge1xuICBcbiAgICB9LFxuICBcbiAgICAvKipcbiAgICAgKiDpobXpnaLkuIrmi4nop6blupXkuovku7bnmoTlpITnkIblh73mlbBcbiAgICAgKi9cbiAgICBvblJlYWNoQm90dG9tOiBmdW5jdGlvbiAoKSB7XG4gIFxuICAgIH0sXG4gIFxuICAgIC8qKlxuICAgICAqIOeUqOaIt+eCueWHu+WPs+S4iuinkuWIhuS6q1xuICAgICAqL1xuICAgIG9uU2hhcmVBcHBNZXNzYWdlOiBmdW5jdGlvbiAoIGUgKSB7XG4gICAgICAgIC8vIGNvbnN0IHsgZGV0YWlsLCBwaW4kLCBhY3Rpdml0aWVzLCBwcmljZUdhcCwgdHJpcCwgb3BlbmlkIH0gPSB0aGlzLmRhdGE7XG4gICAgICAgIC8vIHJldHVybiB7XG4gICAgICAgIC8vICAgICB0aXRsZTogYCR7cHJpY2VHYXAgIT09ICcnICYmIE51bWJlciggcHJpY2VHYXAgKSAhPT0gMCA/IFxuICAgICAgICAvLyAgICAgICAgICAgICAgICAgYWN0aXZpdGllcy5sZW5ndGggPT09IDAgP1xuICAgICAgICAvLyAgICAgICAgICAgICAgICAgICAgIGDmi7zlm6LkubDvvIHkuIDotbfnnIEke1N0cmluZyggcHJpY2VHYXAgKS5yZXBsYWNlKC9cXC4wMC9nLCAnJyl95YWD77yBYCA6XG4gICAgICAgIC8vICAgICAgICAgICAgICAgICAgICAgJ+mZkOaXtueJueS7t+i2heWunuaDoO+8gScgOiBcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgIHRyaXAgJiYgdHJpcC5yZWR1Y2VfcHJpY2UgPyBcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgICBg56uL5YePJHt0cmlwLnJlZHVjZV9wcmljZX3lhYPvvIFgIDpcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgICAn57uZ5L2g55yL55yL6L+Z5a6d6LSd77yBJ1xuICAgICAgICAvLyAgICAgICAgIH0ke2RldGFpbC50aXRsZX1gLFxuICAgICAgICAvLyAgICAgLy8g5YiG5Lqr5LiN5bqU6K+l5bimdGlkXG4gICAgICAgIC8vICAgICBwYXRoOiBgL3BhZ2VzL2dvb2RzLWRldGFpbC9pbmRleD9pZD0ke2RldGFpbC5faWR9JmZyb209JHtvcGVuaWR9YCxcbiAgICAgICAgLy8gICAgIGltYWdlVXJsOiBgJHtkZXRhaWwuaW1nWyAwIF19YFxuICAgICAgICAvLyB9XG4gICAgICAgIGNvbnN0IHsgaGFzT3JkZXIkLCBkZXRhaWwkLCBvcGVuaWQgfSA9ICh0aGlzLmRhdGEgYXMgYW55KTtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGltYWdlVXJsOiBgJHtkZXRhaWwkLmltZ1sgMCBdfWAsXG4gICAgICAgICAgICBwYXRoOiBgL3BhZ2VzL2dvb2RzLWRldGFpbC9pbmRleD9pZD0ke2RldGFpbCQuX2lkfSZmcm9tPSR7b3BlbmlkfWAsXG4gICAgICAgICAgICB0aXRsZTogISFkZXRhaWwkICYmIGRldGFpbCQuaGFzUGluICYmICFoYXNPcmRlciQgP1xuICAgICAgICAgICAgICAgIGDmnInkurrmg7PopoHlkJfvvJ/mi7zlm6LkubDvvIzmiJHku6zpg73og73nnIHvvIEke2RldGFpbCQudGl0bGV9YCA6XG4gICAgICAgICAgICAgICAgYOaOqOiNkOOAjCR7ZGV0YWlsJC50YWdUZXh0feOAjeelnuWZqCEke2RldGFpbCQudGl0bGV9YFxuICAgICAgICB9XG4gICAgfVxuICB9KSJdfQ==