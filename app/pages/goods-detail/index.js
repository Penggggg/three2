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
        showTips: 'hide',
        showShareTips: 'hide',
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
            }
        });
    },
    fetDetail: function (id) {
        var _this = this;
        var detail = this.data.detail;
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
                _this.checkOpenPin();
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
    toggleTips: function (e) {
        var showTips = this.data.showTips;
        this.setData({
            showTips: showTips === 'show' ? 'hide' : 'show'
        });
        !!e && this.createFormId(e.detail.formId);
    },
    toggleTips2: function (e) {
        var showShareTips = this.data.showShareTips;
        this.setData({
            showShareTips: showShareTips === 'show' ? 'hide' : 'show'
        });
        !!e && this.createFormId(e.detail.formId);
    },
    toggleTips3: function (e) {
        var showShareTips2 = this.data.showShareTips2;
        this.setData({
            showShareTips2: !showShareTips2,
        });
        !!e && this.createFormId(e.detail.formId);
    },
    goManager: function () {
        route_js_1.navTo("/pages/manager-goods-detail/index?id=" + this.data.id);
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
            _this.setData({
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
        var _a = this.data, detail = _a.detail, tid = _a.tid;
        if (!detail) {
            return;
        }
        var result = goods_js_1.delayeringGood(detail);
        if (result && tid) {
            var priceGap = String(result.goodPins.eachPriceRound).replace(/\.00/g, '');
            var openRecordTid = wx.getStorageSync(storageKey);
            if (!!priceGap && !!tid && openRecordTid !== tid) {
                wx.setStorageSync(storageKey, tid);
                this.toggleTips();
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
    createFormId: function (formid) {
        if (!formid) {
            return;
        }
        http_js_1.http({
            data: {
                formid: formid
            },
            loadingMsg: 'none',
            url: 'common_create-formid',
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
        if (!options.id && !scene && !'71f2cd945cab4fc10261232b3f358619') {
            return;
        }
        this.setData({
            id: options.id || scene || '71f2cd945cab4fc10261232b3f358619',
        });
        if (options.id || scene) {
            this.setData({
                id: options.id || scene,
            });
        }
        if (!!options.from) {
            this.setData({
                from: options.from,
                showTips: 'show'
            });
        }
        setTimeout(function () {
            _this.watchRole();
            _this.checkLike();
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
        var _a = this.data, detail = _a.detail, pin$ = _a.pin$, activities = _a.activities, priceGap = _a.priceGap, trip = _a.trip, openid = _a.openid;
        return {
            title: "" + (priceGap !== '' && Number(priceGap) !== 0 ?
                activities.length === 0 ?
                    "\u4E00\u8D77\u4E70\uFF01\u4E00\u8D77\u7701" + String(priceGap).replace(/\.00/g, '') + "\u5143\uFF01" :
                    '限时特价超实惠！' :
                trip && trip.reduce_price ?
                    "\u7ACB\u51CF" + trip.reduce_price + "\u5143\uFF01" :
                    '给你看看这宝贝！') + detail.title,
            path: "/pages/goods-detail/index?id=" + detail._id + "&from=" + openid,
            imageUrl: "" + detail.img[0]
        };
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUNBLDhDQUEwQztBQUMxQyxxREFBb0Q7QUFDcEQsZ0RBQXFEO0FBQ3JELGdEQUE0QztBQUU1QyxJQUFNLEdBQUcsR0FBRyxNQUFNLEVBQUcsQ0FBQztBQUd0QixJQUFNLFVBQVUsR0FBRyxvQkFBb0IsQ0FBQztBQUV4QyxJQUFJLENBQUM7SUFHRCx5QkFBeUIsRUFBRSxJQUFJO0lBSy9CLElBQUksRUFBRTtRQUdGLEtBQUssRUFBRSxJQUFJO1FBR1gsR0FBRyxFQUFFLEVBQUU7UUFHUCxFQUFFLEVBQUUsRUFBRTtRQUdOLE1BQU0sRUFBRSxJQUFJO1FBR1osR0FBRyxFQUFFLEVBQUc7UUFHUixPQUFPLEVBQUUsSUFBSTtRQUdiLFdBQVcsRUFBRSxLQUFLO1FBR2xCLEtBQUssRUFBRSxLQUFLO1FBR1osV0FBVyxFQUFFO1lBQ1QsTUFBTSxFQUFFLE1BQU0sRUFBRSxNQUFNO1NBQ3pCO1FBR0QseUJBQXlCLEVBQUUsSUFBSTtRQUcvQixPQUFPLEVBQUUsS0FBSztRQUdkLGFBQWEsRUFBRSxLQUFLO1FBR3BCLFFBQVEsRUFBRSxNQUFNO1FBR2hCLGFBQWEsRUFBRSxNQUFNO1FBR3JCLGNBQWMsRUFBRSxLQUFLO1FBR3JCLEdBQUcsRUFBRSxFQUFHO1FBR1IsUUFBUSxFQUFFLEVBQUc7UUFHYixVQUFVLEVBQUUsRUFBRztRQUdmLFNBQVMsRUFBRSxFQUFHO1FBR2QsSUFBSSxFQUFFLElBQUk7UUFHVixnQkFBZ0IsRUFBRSxLQUFLO1FBR3ZCLE1BQU0sRUFBRSxFQUFFO1FBR1YsSUFBSSxFQUFFLEVBQUU7UUFHUixnQkFBZ0IsRUFBRSxDQUFDO1FBR25CLFVBQVUsRUFBRSxLQUFLO0tBQ3BCO0lBR0QsV0FBVztRQUNQLG1CQUFRLENBQUUsSUFBSSxFQUFFO1lBR1osS0FBSyxFQUFFO2dCQUNLLElBQUEseUJBQU0sQ0FBZTtnQkFDN0Is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RSxFQUFFLEVBQUUsR0FBRyxDQUFFLENBQUM7SUFDbEMsQ0FBQztJQUtELE1BQU0sRUFBRTtJQUVSLENBQUM7SUFLRCxRQUFRLEVBQUU7SUFFVixDQUFDO0lBS0QsaUJBQWlCLEVBQUU7SUFFbkIsQ0FBQztJQUtELGFBQWEsRUFBRTtJQUVmLENBQUM7SUFLRCxpQkFBaUIsRUFBRSxVQUFXLENBQUM7UUFDckIsSUFBQSxjQUFnRSxFQUE5RCxrQkFBTSxFQUFFLGNBQUksRUFBRSwwQkFBVSxFQUFFLHNCQUFRLEVBQUUsY0FBSSxFQUFFLGtCQUFvQixDQUFDO1FBQ3ZFLE9BQU87WUFDSCxLQUFLLEVBQUUsTUFBRyxRQUFRLEtBQUssRUFBRSxJQUFJLE1BQU0sQ0FBRSxRQUFRLENBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQztnQkFDM0MsVUFBVSxDQUFDLE1BQU0sS0FBSyxDQUFDLENBQUMsQ0FBQztvQkFDckIsK0NBQVUsTUFBTSxDQUFFLFFBQVEsQ0FBRSxDQUFDLE9BQU8sQ0FBQyxPQUFPLEVBQUUsRUFBRSxDQUFDLGlCQUFJLENBQUMsQ0FBQztvQkFDdkQsVUFBVSxDQUFDLENBQUM7Z0JBQ2hCLElBQUksSUFBSSxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUM7b0JBQ3ZCLGlCQUFLLElBQUksQ0FBQyxZQUFZLGlCQUFJLENBQUMsQ0FBQztvQkFDNUIsVUFBVSxJQUNuQixNQUFNLENBQUMsS0FBTztZQUVyQixJQUFJLEVBQUUsa0NBQWdDLE1BQU0sQ0FBQyxHQUFHLGNBQVMsTUFBUTtZQUNqRSxRQUFRLEVBQUUsS0FBRyxNQUFNLENBQUMsR0FBRyxDQUFFLENBQUMsQ0FBSTtTQUNqQyxDQUFBO0lBQ0wsQ0FBQztDQUNGLENBQUMsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbIlxuaW1wb3J0IHsgaHR0cCB9IGZyb20gJy4uLy4uL3V0aWwvaHR0cC5qcyc7XG5pbXBvcnQgeyBjb21wdXRlZCB9IGZyb20gJy4uLy4uL2xpYi92dWVmeS9pbmRleC5qcyc7XG5pbXBvcnQgeyBkZWxheWVyaW5nR29vZCB9IGZyb20gJy4uLy4uL3V0aWwvZ29vZHMuanMnO1xuaW1wb3J0IHsgbmF2VG8gfSBmcm9tICcuLi8uLi91dGlsL3JvdXRlLmpzJztcblxuY29uc3QgYXBwID0gZ2V0QXBwKCApO1xuXG4vLyDmiZPlvIDmi7zlm6Lmj5DnpLrnmoRrZXlcbmNvbnN0IHN0b3JhZ2VLZXkgPSAnb3BlbmVkLXBpbi1pbi1nb29kJztcblxuUGFnZSh7XG5cbiAgICAvLyDliqjnlLtcbiAgICBhbmltYXRpb25NaWRkbGVIZWFkZXJJdGVtOiBudWxsLFxuXG4gICAgLyoqXG4gICAgICog6aG16Z2i55qE5Yid5aeL5pWw5o2uXG4gICAgICovXG4gICAgZGF0YToge1xuXG4gICAgICAgIC8vIOaYr+WQpuS4uuaWsOWuolxuICAgICAgICBpc05ldzogdHJ1ZSxcblxuICAgICAgICAvLyDooYznqItcbiAgICAgICAgdGlkOiAnJyxcblxuICAgICAgICAvLyDllYblk4FpZFxuICAgICAgICBpZDogJycsXG5cbiAgICAgICAgLy8g5ZWG5ZOB6K+m5oOFXG4gICAgICAgIGRldGFpbDogbnVsbCxcbiAgICAgICAgXG4gICAgICAgIC8vIOaVsOaNruWtl+WFuFxuICAgICAgICBkaWM6IHsgfSxcbiAgICAgICAgXG4gICAgICAgIC8vIOWKoOi9veeKtuaAgVxuICAgICAgICBsb2FkaW5nOiB0cnVlLFxuXG4gICAgICAgIC8vIOaYr+WQpuWIneWni+WMlui/h+KAnOWWnOasouKAnVxuICAgICAgICBoYXNJbml0TGlrZTogZmFsc2UsXG5cbiAgICAgICAgLy8g5piv5ZCm4oCc5Zac5qyi4oCdXG4gICAgICAgIGxpa2VkOiBmYWxzZSxcblxuICAgICAgICAvLyDmloflrZfkv53or4Hmj5DnpLpcbiAgICAgICAgcHJvbWlzZVRpcHM6IFtcbiAgICAgICAgICAgICfmraPlk4Hkv53or4EnLCAn5Lu35qC85LyY5Yq/JywgJ+ecn+S6uui3keiFvydcbiAgICAgICAgXSxcblxuICAgICAgICAvLyDliqjnlLtcbiAgICAgICAgYW5pbWF0aW9uTWlkZGxlSGVhZGVySXRlbTogbnVsbCxcblxuICAgICAgICAvLyDlsZXnpLrnrqHnkIblhaXlj6NcbiAgICAgICAgc2hvd0J0bjogZmFsc2UsXG5cbiAgICAgICAgLy8g5q2j5Zyo5bGV56S65rW35oqlXG4gICAgICAgIHNob3dpbmdQb3N0ZXI6IGZhbHNlLFxuXG4gICAgICAgIC8vIOWxleekuuW8ueahhlxuICAgICAgICBzaG93VGlwczogJ2hpZGUnLFxuXG4gICAgICAgIC8vIOWIhuS6q1RpcHNcbiAgICAgICAgc2hvd1NoYXJlVGlwczogJ2hpZGUnLFxuXG4gICAgICAgIC8vIOWIhuS6q1RpcHMyXG4gICAgICAgIHNob3dTaGFyZVRpcHMyOiBmYWxzZSxcblxuICAgICAgICAvLyDmi7zlm6LliJfooahcbiAgICAgICAgcGluOiBbIF0sXG5cbiAgICAgICAgLy8g5ZWG5ZOB5Zyo5pys6KGM56iL55qE6LSt54mp5riF5Y2V5YiX6KGoXG4gICAgICAgIHNob3BwaW5nOiBbIF0sXG5cbiAgICAgICAgLy8g5LiA5Y+j5Lu35rS75Yqo5YiX6KGoXG4gICAgICAgIGFjdGl2aXRpZXM6IFsgXSxcblxuICAgICAgICAvLyDmnKzotp/og73lpJ/mi7zlm6LnmoRza3VcbiAgICAgICAgY2FuUGluU2t1OiBbIF0sXG5cbiAgICAgICAgLy8g5b2T5YmN55qE6KGM56iLXG4gICAgICAgIHRyaXA6IG51bGwsXG5cbiAgICAgICAgLy8g5b2T5YmN5piv5ZCm5byA5ZCv5LqG56ev5YiG5o6o5bm/XG4gICAgICAgIGNhbkludGVncmF5U2hhcmU6IGZhbHNlLFxuXG4gICAgICAgIC8vIOW9k+WJjei0puWPt+eahG9wZW5pZFxuICAgICAgICBvcGVuaWQ6ICcnLFxuXG4gICAgICAgIC8vIOWIhuS6q+S6uueahG9wZW5pZFxuICAgICAgICBmcm9tOiAnJyxcblxuICAgICAgICAvLyDnp6/liIbmjqjlub/ojrfngrnmr5TkvotcbiAgICAgICAgcHVzaEludGVncmFsUmF0ZTogMCxcblxuICAgICAgICAvLyDmmK/lkKblsZXlvIBza3VcbiAgICAgICAgb3BlbmluZ1NrdTogZmFsc2VcbiAgICB9LFxuXG4gICAgLyoqIOiuvue9rmNvbXB1dGVkICovXG4gICAgcnVuQ29tcHV0ZWQoICkge1xuICAgICAgICBjb21wdXRlZCggdGhpcywge1xuXG4gICAgICAgICAgICAvLyDorqHnrpfku7fmoLxcbiAgICAgICAgICAgIHByaWNlOiBmdW5jdGlvbiggKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgeyBkZXRhaWwgfSA9IHRoaXMuZGF0YTtcbiAgICAgICAgICAgICAgICBjb25zdCByZXN1bHQgPSBkZWxheWVyaW5nR29vZCggZGV0YWlsICk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlc3VsdCA/IHJlc3VsdC5wcmljZSQgOiAnJztcbiAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgIC8vIOWVhuWTgeivpuaDhSAtIOWIhuihjOaYvuekulxuICAgICAgICAgICAgZGV0YWlsSW50cm86IGZ1bmN0aW9uKCApIHtcbiAgICAgICAgICAgICAgICBjb25zdCB7IGRldGFpbCB9ID0gdGhpcy5kYXRhO1xuICAgICAgICAgICAgICAgIGlmICggIWRldGFpbCB8fCAoICEhZGV0YWlsICYmICFkZXRhaWwuZGV0YWlsICkpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFsgXTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZGV0YWlsLmRldGFpbC5zcGxpdCgnXFxuJykuZmlsdGVyKCB4ID0+ICEheCApO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgIC8vIOS7t+agvCDvvZ4g5Zui6LSt5Lu355qE5beu5Lu3XG4gICAgICAgICAgICBwcmljZUdhcDogZnVuY3Rpb24oICkge1xuICAgICAgICAgICAgICAgIGNvbnN0IHsgZGV0YWlsIH0gPSB0aGlzLmRhdGE7XG4gICAgICAgICAgICAgICAgaWYgKCAhZGV0YWlsICkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gJydcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCByZXN1bHQgPSBkZWxheWVyaW5nR29vZCggZGV0YWlsICk7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGdhcCA9IHJlc3VsdCA/IFN0cmluZyggcmVzdWx0Lmdvb2RQaW5zLmVhY2hQcmljZVJvdW5kICkucmVwbGFjZSgvXFwuMDAvZywgJycpIDogJyc7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IG1ldGEgPSBnYXAgIT09ICcwJyAmJiAhIWdhcCA/IGdhcCA6ICcnO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gbWV0YTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LFxuXG4gICAgICAgICAgICAvLyDmi7zlm6LliJfooahcbiAgICAgICAgICAgIHBpbiQ6IGZ1bmN0aW9uKCApIHtcbiAgICAgICAgICAgICAgICBsZXQgbWV0YTogYW55ID0gWyBdO1xuICAgICAgICAgICAgICAgIGNvbnN0IHsgZGV0YWlsLCBzaG9wcGluZywgYWN0aXZpdGllcyB9ID0gdGhpcy5kYXRhO1xuXG4gICAgICAgICAgICAgICAgaWYgKCAhZGV0YWlsICkgeyBcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFsgXTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBjb25zdCB7IHN0YW5kYXJkcywgZ3JvdXBQcmljZSB9ID0gZGV0YWlsO1xuXG4gICAgICAgICAgICAgICAgaWYgKCBzdGFuZGFyZHMubGVuZ3RoID4gMCApIHtcbiAgICAgICAgICAgICAgICAgICAgbWV0YSA9IHN0YW5kYXJkc1xuICAgICAgICAgICAgICAgICAgICAgICAgLmZpbHRlciggeCA9PiAhIXguZ3JvdXBQcmljZSApXG4gICAgICAgICAgICAgICAgICAgICAgICAubWFwKCB4ID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gT2JqZWN0LmFzc2lnbih7IH0sIHgsIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2lkOiB4Ll9pZCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FuUGluOiAhIXNob3BwaW5nLmZpbmQoIHMgPT4gcy5zaWQgPT09IHguX2lkICYmIHMucGlkID09PSB4LnBpZCApXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmICggISFncm91cFByaWNlICkge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCB7IHByaWNlLCB0aXRsZSwgaW1nLCBfaWQgfSA9IGRldGFpbDtcbiAgICAgICAgICAgICAgICAgICAgbWV0YSA9IFt7XG4gICAgICAgICAgICAgICAgICAgICAgICBwcmljZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHBpZDogX2lkLFxuICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogdGl0bGUsXG4gICAgICAgICAgICAgICAgICAgICAgICBncm91cFByaWNlLFxuICAgICAgICAgICAgICAgICAgICAgICAgc2lkOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgICAgICAgICBpbWc6IGltZ1sgMCBdLFxuICAgICAgICAgICAgICAgICAgICAgICAgY2FuUGluOiAhIXNob3BwaW5nLmZpbmQoIHMgPT4gcy5waWQgPT09IF9pZCApXG4gICAgICAgICAgICAgICAgICAgIH1dO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIC8vIOagueaNrua0u+WKqO+8jOabtOaUueOAgeaWsOWinuaLvOWboumhueebrlxuICAgICAgICAgICAgICAgIGFjdGl2aXRpZXMubWFwKCBhYyA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGlmICggIWFjLmFjX2dyb3VwUHJpY2UgKSB7IHJldHVybjsgfVxuICAgICAgICAgICAgICAgICAgICBjb25zdCBwaW5UYXJnZXQgPSBtZXRhLmZpbmQoIHggPT4geC5waWQgPT09IGFjLnBpZCAmJiB4LnNpZCA9PT0gYWMuc2lkICk7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHBpblRhcmdldEluZGV4ID0gbWV0YS5maW5kSW5kZXgoIHggPT4geC5waWQgPT09IGFjLnBpZCAmJiB4LnNpZCA9PT0gYWMuc2lkICk7XG5cbiAgICAgICAgICAgICAgICAgICAgLy8g5pu/5o2iXG4gICAgICAgICAgICAgICAgICAgIGlmICggcGluVGFyZ2V0SW5kZXggIT09IC0xICkge1xuICAgICAgICAgICAgICAgICAgICAgICAgbWV0YS5zcGxpY2UoIHBpblRhcmdldEluZGV4LCAxLCBPYmplY3QuYXNzaWduKHsgfSwgcGluVGFyZ2V0LCB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJpY2U6IGFjLmFjX3ByaWNlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGdyb3VwUHJpY2U6IGFjLmFjX2dyb3VwUHJpY2VcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pKTtcblxuICAgICAgICAgICAgICAgICAgICAvLyDmlrDlop5cbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG1ldGEucHVzaCh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2lkOiBhYy5zaWQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcGlkOiBhYy5waWQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaW1nOiBhYy5pbWcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogYWMudGl0bGUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FuUGluOiAhIXNob3BwaW5nLmZpbmQoIHMgPT4gcy5zaWQgPT09IGFjLnNpZCAmJiBzLnBpZCA9PT0gYWMucGlkICksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJpY2U6IGFjLmFjX3ByaWNlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGdyb3VwUHJpY2U6IGFjLmFjX2dyb3VwUHJpY2UgXG4gICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICBjb25zdCBtZXRhMiA9IG1ldGEubWFwKCB4ID0+IE9iamVjdC5hc3NpZ24oeyB9LCB4LCB7XG4gICAgICAgICAgICAgICAgICAgIGRlbHRhOiBOdW1iZXIoIHgucHJpY2UgLSB4Lmdyb3VwUHJpY2UgKS50b0ZpeGVkKCAwIClcbiAgICAgICAgICAgICAgICB9KSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG1ldGEyO1xuICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAgLy8g6ams5LiK5Y+v5Lul5ou85Zui55qE5Liq5pWwXG4gICAgICAgICAgICBwaW5Db3VudCQ6IGZ1bmN0aW9uKCApIHtcbiAgICAgICAgICAgICAgICBjb25zdCB7IGRldGFpbCwgc2hvcHBpbmcgfSA9IHRoaXMuZGF0YTtcbiAgICAgICAgICAgICAgICBpZiAoICFkZXRhaWwgKSB7IFxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gMDtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBjb25zdCB7IHN0YW5kYXJkcywgZ3JvdXBQcmljZSB9ID0gZGV0YWlsO1xuXG4gICAgICAgICAgICAgICAgaWYgKCAhIXN0YW5kYXJkcyAmJiBzdGFuZGFyZHMubGVuZ3RoID4gMCApIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHN0YW5kYXJkc1xuICAgICAgICAgICAgICAgICAgICAgICAgLmZpbHRlciggeCA9PiAhIXNob3BwaW5nLmZpbmQoIHMgPT4gcy5zaWQgPT09IHguX2lkICYmIHMucGlkID09PSB4LnBpZCApKVxuICAgICAgICAgICAgICAgICAgICAgICAgLmxlbmd0aDtcblxuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoICEhZ3JvdXBQcmljZSApIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgeyBfaWQgfSA9IGRldGFpbDtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuICEhc2hvcHBpbmcuZmluZCggcyA9PiBzLnBpZCA9PT0gX2lkICkgPyAxIDogMFxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHJldHVybiAwO1xuICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAgLy8g5piv5ZCm5pyJ5Z6L5Y+3XG4gICAgICAgICAgICBoYXNTdGFuZGVycyQ6IGZ1bmN0aW9uKCApIHtcbiAgICAgICAgICAgICAgICBjb25zdCB7IGRldGFpbCB9ID0gdGhpcy5kYXRhO1xuICAgICAgICAgICAgICAgIGlmICggIWRldGFpbCApIHsgXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgY29uc3QgeyBzdGFuZGFyZHMgfSA9IGRldGFpbDtcbiAgICAgICAgICAgICAgICByZXR1cm4gISFzdGFuZGFyZHMgJiYgc3RhbmRhcmRzLmxlbmd0aCA+IDAgO1xuICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAgLy8g56ev5YiG5Yy66Ze0XG4gICAgICAgICAgICBpbnRlZ3JhbCQ6IGZ1bmN0aW9uKCApIHtcbiAgICAgICAgICAgICAgICBjb25zdCB7IGRldGFpbCwgcHVzaEludGVncmFsUmF0ZSB9ID0gdGhpcy5kYXRhO1xuICAgICAgICAgICAgICAgIGlmICggIWRldGFpbCApIHsgXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAnJztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgY29uc3QgcmVzdWx0ID0gZGVsYXllcmluZ0dvb2QoIGRldGFpbCwgcHVzaEludGVncmFsUmF0ZSApO1xuICAgICAgICAgICAgICAgIHJldHVybiByZXN1bHQuaW50ZWdyYWwkO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgIH0pXG4gICAgfSxcblxuICAgIC8qKiDmi4nlj5bllYblk4Hor6bmg4UgKi9cbiAgICBmZXREZXRhaWwoIGlkICkge1xuICAgICAgICBjb25zdCB7IGRldGFpbCB9ID0gdGhpcy5kYXRhO1xuICAgICAgICBpZiAoIGRldGFpbCApIHsgcmV0dXJuOyB9XG4gICAgICAgIGh0dHAoe1xuICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgIF9pZDogaWQsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgZXJyTXNnOiAn6I635Y+W5ZWG5ZOB6ZSZ6K+v77yM6K+36YeN6K+VJyxcbiAgICAgICAgICAgIHVybDogYGdvb2RfZGV0YWlsYCxcbiAgICAgICAgICAgIHN1Y2Nlc3M6IHJlcyA9PiB7XG4gICAgICAgICAgICAgIGlmICggcmVzLnN0YXR1cyAhPT0gMjAwICkgeyByZXR1cm47IH1cblxuICAgICAgICAgICAgICAgIGxldCBwaW46IGFueSA9IFsgXTtcbiAgICAgICAgICAgICAgICBjb25zdCB7IHN0YW5kYXJkcywgZ3JvdXBQcmljZSwgYWN0aXZpdGllcyB9ID0gcmVzLmRhdGE7XG5cbiAgICAgICAgICAgICAgICBpZiAoIHN0YW5kYXJkcy5sZW5ndGggPiAwICkge1xuICAgICAgICAgICAgICAgICAgICBwaW4gPSBzdGFuZGFyZHMuZmlsdGVyKCB4ID0+ICEheC5ncm91cFByaWNlICk7XG5cbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKCAhIWdyb3VwUHJpY2UgKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHsgcHJpY2UsIHRpdGxlLCBpbWcgIH0gPSByZXMuZGF0YTtcbiAgICAgICAgICAgICAgICAgICAgcGluID0gW3tcbiAgICAgICAgICAgICAgICAgICAgICAgIHByaWNlLFxuICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogdGl0bGUsXG4gICAgICAgICAgICAgICAgICAgICAgICBncm91cFByaWNlLFxuICAgICAgICAgICAgICAgICAgICAgICAgaW1nOiBpbWdbIDAgXVxuICAgICAgICAgICAgICAgICAgICB9XTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBjb25zdCBhY3Rpdml0aWVzJCA9IGFjdGl2aXRpZXMubWFwKCB4ID0+IHtcblxuICAgICAgICAgICAgICAgICAgICBsZXQgaW1nID0gJyc7XG4gICAgICAgICAgICAgICAgICAgIGlmICggISF4LnNpZCApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGltZyA9IHN0YW5kYXJkcy5maW5kKCB5ID0+IHkuX2lkID09PSB4LnNpZCApLmltZ1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgaW1nID0gcmVzLmRhdGEuaW1nWyAwIF07XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gT2JqZWN0LmFzc2lnbih7IH0sIHgsIHsgXG4gICAgICAgICAgICAgICAgICAgICAgICBpbWcsXG4gICAgICAgICAgICAgICAgICAgICAgICBjb3VudGRvd246ICggeC5lbmRUaW1lIC0gbmV3IERhdGUoICkuZ2V0VGltZSggKSkgLyAoIDEwMDAgKVxuICAgICAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgIH0pLmZpbHRlciggeSA9PiB5LmVuZFRpbWUgPiBuZXcgRGF0ZSggKS5nZXRUaW1lKCApKTtcblxuICAgICAgICAgICAgICAgIHRoaXMuc2V0RGF0YSEoe1xuICAgICAgICAgICAgICAgICAgICBwaW4sXG4gICAgICAgICAgICAgICAgICAgIGxvYWRpbmc6IGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICBkZXRhaWw6IHJlcy5kYXRhLFxuICAgICAgICAgICAgICAgICAgICBhY3Rpdml0aWVzOiBhY3Rpdml0aWVzJFxuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgdGhpcy5jaGVja09wZW5QaW4oICk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH0sXG5cbiAgICAvKiog5ouJ5Y+W5b2T5YmN5ZWG5ZOB55qE6LSt54mp6K+35Y2V5L+h5oGvICovXG4gICAgZmV0Y2hTaG9wcGluZyggcGlkLCB0aWQgKSB7XG4gICAgICAgIGlmICggIXBpZCB8fCAhdGlkICkgeyByZXR1cm47IH1cblxuICAgICAgICBodHRwKHtcbiAgICAgICAgICAgIHVybDogJ3Nob3BwaW5nLWxpc3RfcGluJyxcbiAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICBwaWQsXG4gICAgICAgICAgICAgICAgdGlkLFxuICAgICAgICAgICAgICAgIGRldGFpbDogZmFsc2VcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBzdWNjZXNzOiByZXMgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IHsgc3RhdHVzLCBkYXRhIH0gPSByZXM7XG4gICAgICAgICAgICAgICAgaWYgKCBzdGF0dXMgIT09IDIwMCApIHsgcmV0dXJuOyB9XG4gICAgICAgICAgICAgICAgdGhpcy5zZXREYXRhISh7XG4gICAgICAgICAgICAgICAgICAgIHNob3BwaW5nOiBkYXRhLFxuICAgICAgICAgICAgICAgICAgICBjYW5QaW5Ta3U6IGRhdGEubWFwKCB4ID0+ICh7XG4gICAgICAgICAgICAgICAgICAgICAgICBwaWQ6IHgucGlkLFxuICAgICAgICAgICAgICAgICAgICAgICAgc2lkOiB4LnNpZFxuICAgICAgICAgICAgICAgICAgICB9KSlcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSlcbiAgICB9LFxuXG4gICAgLyoqIOaLieWPluS4pOS4quacgOaWsOihjOeoiyAqL1xuICAgIGZldGNoTGFzdCggKSB7XG4gICAgICAgIGNvbnN0IHsgaWQgfSA9IHRoaXMuZGF0YTtcbiAgICAgICAgaHR0cCh7XG4gICAgICAgICAgICBkYXRhOiB7IH0sXG4gICAgICAgICAgICB1cmw6IGB0cmlwX2VudGVyYCxcbiAgICAgICAgICAgIHN1Y2Nlc3M6IHJlcyA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3QgeyBzdGF0dXMsIGRhdGEgfSA9IHJlcztcbiAgICAgICAgICAgICAgICBpZiAoIHN0YXR1cyAhPT0gMjAwICkgeyByZXR1cm47IH1cblxuICAgICAgICAgICAgICAgIGlmICggISFkYXRhWyAwIF0pIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgdGlkID0gZGF0YVsgMCBdLl9pZFxuXG4gICAgICAgICAgICAgICAgICAgIGlmICggISF0aWQgKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmZldGNoU2hvcHBpbmcoIGlkLCB0aWQgKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB0aGlzLnNldERhdGEhKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRpZCxcbiAgICAgICAgICAgICAgICAgICAgICAgIHRyaXA6IGRhdGFbIDAgXVxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgfSxcblxuICAgIC8qKiDliJvlu7rliIbkuqvorrDlvZUgKi9cbiAgICBjcmVhdGVTaGFyZSggKSB7XG4gICAgICAgIGNvbnN0IHsgaWQsIGNhbkludGVncmF5U2hhcmUsIGZyb20sIG9wZW5pZCB9ID0gdGhpcy5kYXRhO1xuICAgICAgICBpZiAoICFpZCB8fCAhY2FuSW50ZWdyYXlTaGFyZSB8fCAhZnJvbSB8fCAhb3BlbmlkICkgeyByZXR1cm47IH1cbiAgICAgICAgaHR0cCh7XG4gICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgZnJvbSxcbiAgICAgICAgICAgICAgICBwaWQ6IGlkLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHVybDogJ2NvbW1vbl9jcmVhdGUtc2hhcmUnXG4gICAgICAgIH0pO1xuICAgIH0sXG5cbiAgICAvLyDlsZXlvIDmj5DnpLpcbiAgICB0b2dnbGVUaXBzKCBlPyApIHtcbiAgICAgICAgY29uc3QgeyBzaG93VGlwcyB9ID0gdGhpcy5kYXRhO1xuICAgICAgICB0aGlzLnNldERhdGEhKHtcbiAgICAgICAgICAgIHNob3dUaXBzOiBzaG93VGlwcyA9PT0gJ3Nob3cnID8gJ2hpZGUnIDogJ3Nob3cnXG4gICAgICAgIH0pO1xuICAgICAgICAhIWUgJiYgdGhpcy5jcmVhdGVGb3JtSWQoIGUuZGV0YWlsLmZvcm1JZCApO1xuICAgIH0sXG5cbiAgICAvLyDlsZXlvIDliIbkuqvmj5DnpLpcbiAgICB0b2dnbGVUaXBzMiggZT8gKSB7XG4gICAgICAgIGNvbnN0IHsgc2hvd1NoYXJlVGlwcyB9ID0gdGhpcy5kYXRhO1xuICAgICAgICB0aGlzLnNldERhdGEhKHtcbiAgICAgICAgICAgIHNob3dTaGFyZVRpcHM6IHNob3dTaGFyZVRpcHMgPT09ICdzaG93JyA/ICdoaWRlJyA6ICdzaG93J1xuICAgICAgICB9KTtcbiAgICAgICAgISFlICYmIHRoaXMuY3JlYXRlRm9ybUlkKCBlLmRldGFpbC5mb3JtSWQgKTtcbiAgICB9LFxuXG4gICAgdG9nZ2xlVGlwczMoIGU/ICkge1xuICAgICAgICBjb25zdCB7IHNob3dTaGFyZVRpcHMyIH0gPSB0aGlzLmRhdGE7XG4gICAgICAgIHRoaXMuc2V0RGF0YSEoe1xuICAgICAgICAgICAgc2hvd1NoYXJlVGlwczI6ICFzaG93U2hhcmVUaXBzMixcbiAgICAgICAgfSk7XG4gICAgICAgICEhZSAmJiB0aGlzLmNyZWF0ZUZvcm1JZCggZS5kZXRhaWwuZm9ybUlkICk7XG4gICAgfSxcblxuICAgIC8vIOi/m+WFpeWVhuWTgeeuoeeQhlxuICAgIGdvTWFuYWdlciggKSB7XG4gICAgICAgIG5hdlRvKGAvcGFnZXMvbWFuYWdlci1nb29kcy1kZXRhaWwvaW5kZXg/aWQ9JHt0aGlzLmRhdGEuaWR9YClcbiAgICB9LFxuXG4gICAgLyoqIOebkeWQrOWFqOWxgOeuoeeQhuWRmOadg+mZkCAqL1xuICAgIHdhdGNoUm9sZSggKSB7XG4gICAgICAgIChhcHAgYXMgYW55KS53YXRjaCQoJ3JvbGUnLCAoIHZhbCApID0+IHtcbiAgICAgICAgICAgIHRoaXMuc2V0RGF0YSEoe1xuICAgICAgICAgICAgICAgIHNob3dCdG46ICggdmFsID09PSAxIClcbiAgICAgICAgICAgIH0pXG4gICAgICAgIH0pO1xuICAgICAgICAoYXBwIGFzIGFueSkud2F0Y2gkKCdpc05ldycsIHZhbCA9PiB7XG4gICAgICAgICAgICB0aGlzLnNldERhdGEhKHtcbiAgICAgICAgICAgICAgICBpc05ldzogdmFsXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgICAgIChhcHAgYXMgYW55KS53YXRjaCQoJ2FwcENvbmZpZycsIHZhbCA9PiB7XG4gICAgICAgICAgICB0aGlzLnNldERhdGEhKHtcbiAgICAgICAgICAgICAgICBwdXNoSW50ZWdyYWxSYXRlOiAodmFsIHx8IHsgfSlbJ3B1c2gtaW50ZWdyYWwtZ2V0LXJhdGUnXSB8fCAwLFxuICAgICAgICAgICAgICAgIGNhbkludGVncmF5U2hhcmU6ICEhKHZhbCB8fCB7IH0pWydnb29kLWludGVncmFsLXNoYXJlJ10gfHwgZmFsc2VcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgdGhpcy5jcmVhdGVTaGFyZSggKTtcbiAgICAgICAgfSk7XG4gICAgICAgIChhcHAgYXMgYW55KS53YXRjaCQoJ29wZW5pZCcsIHZhbCA9PiB7XG4gICAgICAgICAgICB0aGlzLnNldERhdGEhKHtcbiAgICAgICAgICAgICAgICBvcGVuaWQ6IHZhbFxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB0aGlzLmNyZWF0ZVNoYXJlKCApO1xuICAgICAgICB9KTtcbiAgICB9LFxuICAgIFxuICAgIC8qKiDpooTop4jlm77niYcgKi9cbiAgICBwcmV2aWV3SW1nKHsgY3VycmVudFRhcmdldCB9KSB7XG4gICAgICAgIGNvbnN0IHsgaW1nIH0gPSBjdXJyZW50VGFyZ2V0LmRhdGFzZXQ7XG4gICAgICAgIHRoaXMuZGF0YS5kZXRhaWwgJiYgd3gucHJldmlld0ltYWdlKHtcbiAgICAgICAgICAgIGN1cnJlbnQ6IGltZyxcbiAgICAgICAgICAgIHVybHM6IFsgLi4uKHRoaXMuZGF0YSBhcyBhbnkpLmRldGFpbC5pbWcgXSxcbiAgICAgICAgfSk7XG4gICAgfSxcblxuICAgIC8qKiDpooTop4jljZXlvKDlm77niYfvvJrmi7zlm6Llm77niYfjgIHkuIDlj6Pku7fvvIjpmZDml7bmiqLvvIkgKi9cbiAgICBwcmV2aWV3U2luZ2xlSW1nKHsgY3VycmVudFRhcmdldCB9KSB7XG5cbiAgICAgICAgY29uc3QgaW1nID0gY3VycmVudFRhcmdldC5kYXRhc2V0LmRhdGEgP1xuICAgICAgICAgICAgY3VycmVudFRhcmdldC5kYXRhc2V0LmRhdGEuaW1nOlxuICAgICAgICAgICAgY3VycmVudFRhcmdldC5kYXRhc2V0LmltZztcblxuICAgICAgICB0aGlzLmRhdGEuZGV0YWlsICYmIHd4LnByZXZpZXdJbWFnZSh7XG4gICAgICAgICAgICBjdXJyZW50OiBpbWcsXG4gICAgICAgICAgICB1cmxzOiBbIGltZyBdLFxuICAgICAgICB9KTtcbiAgICB9LFxuXG4gICAgLyoqIOajgOafpeaYr+WQpuacieS4u+WKqOW8ueW8gOi/h+aLvOWboiAqL1xuICAgIGNoZWNrT3BlblBpbiggKSB7XG4gICAgICAgIGNvbnN0IHsgZGV0YWlsLCB0aWQgfSA9IHRoaXMuZGF0YTtcbiAgICAgICAgaWYgKCAhZGV0YWlsICkgeyByZXR1cm4gfVxuXG4gICAgICAgIGNvbnN0IHJlc3VsdCA9IGRlbGF5ZXJpbmdHb29kKCBkZXRhaWwgKTtcbiAgICAgICAgaWYgKCByZXN1bHQgJiYgdGlkICkge1xuICAgICAgICAgICAgY29uc3QgcHJpY2VHYXAgPSBTdHJpbmcoIHJlc3VsdC5nb29kUGlucy5lYWNoUHJpY2VSb3VuZCApLnJlcGxhY2UoL1xcLjAwL2csICcnKTtcbiAgICAgICAgICAgIGNvbnN0IG9wZW5SZWNvcmRUaWQgPSB3eC5nZXRTdG9yYWdlU3luYyggc3RvcmFnZUtleSApO1xuXG4gICAgICAgICAgICBpZiAoICEhcHJpY2VHYXAgJiYgISF0aWQgJiYgb3BlblJlY29yZFRpZCAhPT0gdGlkICkge1xuICAgICAgICAgICAgICAgIHd4LnNldFN0b3JhZ2VTeW5jKCBzdG9yYWdlS2V5LCB0aWQgKTtcbiAgICAgICAgICAgICAgICB0aGlzLnRvZ2dsZVRpcHMoICk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgLyoqIOiuvue9ruKAnOWWnOasouKAnSAqL1xuICAgIG9uTGlrZSggKSB7XG4gICAgICAgIGNvbnN0IHRoYXQgPSB0aGlzO1xuICAgICAgICBpZiAoICF0aGlzLmRhdGEuaGFzSW5pdExpa2UgKSB7IHJldHVybjsgfVxuICAgICAgICBodHRwKHtcbiAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICBwaWQ6IHRoaXMuZGF0YS5pZFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHVybDogJ2xpa2VfY3JlYXRlJyxcbiAgICAgICAgICAgIHN1Y2Nlc3M6ICAoIHJlczogYW55ICkgPT4ge1xuICAgICAgICAgICAgICAgIGlmICggcmVzLnN0YXR1cyA9PT0gMjAwICkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnNldERhdGEhKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxpa2VkOiAhdGhpcy5kYXRhLmxpa2VkXG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9LFxuXG4gICAgLyoqIOiuvue9ruKAnOWWnOasouKAnSAqL1xuICAgIGNoZWNrTGlrZSggKSB7XG4gICAgICAgIGNvbnN0IHRoYXQgPSB0aGlzO1xuICAgICAgICBodHRwKHtcbiAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICBwaWQ6IHRoaXMuZGF0YS5pZFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHVybDogJ2xpa2VfY2hlY2snLFxuICAgICAgICAgICAgc3VjY2VzczogICggcmVzOiBhbnkgKSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKCByZXMuc3RhdHVzID09PSAyMDAgKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc2V0RGF0YSEoe1xuICAgICAgICAgICAgICAgICAgICAgICAgbGlrZWQ6IHJlcy5kYXRhLFxuICAgICAgICAgICAgICAgICAgICAgICAgaGFzSW5pdExpa2U6IHRydWVcbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH0sXG5cbiAgICAvKiog5rW35oql5byA5YWzICovXG4gICAgb25Qb3N0VG9nZ2xlKCBlICkge1xuICAgICAgICBjb25zdCB2YWwgPSBlLmRldGFpbDtcbiAgICAgICAgdGhpcy5zZXREYXRhISh7XG4gICAgICAgICAgICBzaG93aW5nUG9zdGVyOiB2YWxcbiAgICAgICAgfSk7XG4gICAgICAgIHd4LnNldE5hdmlnYXRpb25CYXJUaXRsZSh7XG4gICAgICAgICAgICB0aXRsZTogdmFsID8gJ+WIhuS6q+WVhuWTgScgOiAn5ZWG5ZOB6K+m5oOFJ1xuICAgICAgICB9KTtcbiAgICB9LFxuXG4gICAgY3JlYXRlRm9ybUlkKCBmb3JtaWQgKSB7XG4gICAgICAgIGlmICggIWZvcm1pZCApIHsgcmV0dXJuOyB9XG4gICAgICAgIGh0dHAoe1xuICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgIGZvcm1pZFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGxvYWRpbmdNc2c6ICdub25lJyxcbiAgICAgICAgICAgIHVybDogJ2NvbW1vbl9jcmVhdGUtZm9ybWlkJyxcbiAgICAgICAgfSlcbiAgICB9LFxuXG4gICAgLyoqIHNrdemAieaLqeW8ueahhiAqL1xuICAgIG9uU2t1VG9nZ2xlKCBlICkge1xuICAgICAgICB0aGlzLnNldERhdGEhKHtcbiAgICAgICAgICAgIG9wZW5pbmdTa3U6IGUuZGV0YWlsXG4gICAgICAgIH0pO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiDnlJ/lkb3lkajmnJ/lh73mlbAtLeebkeWQrOmhtemdouWKoOi9vVxuICAgICAqIHtcbiAgICAgKiAgICBpZCB8fCBzY2VuZSAvLyDllYblk4FpZFxuICAgICAqICAgIHRpZCAvLyDooYznqItpZFxuICAgICAqICAgIGZyb20gLy8g5YiG5Lqr5Lq655qEaWRcbiAgICAgKiB9XG4gICAgICovXG4gICAgb25Mb2FkOiBmdW5jdGlvbiAob3B0aW9ucykge1xuXG4gICAgICAgIGNvbnN0IHNjZW5lID0gZGVjb2RlVVJJQ29tcG9uZW50KCBvcHRpb25zIS5zY2VuZSB8fCAnJyApXG4gICAgICAgIFxuICAgICAgICB0aGlzLnJ1bkNvbXB1dGVkKCApO1xuXG4gICAgICAgIGlmICggIW9wdGlvbnMhLmlkICYmICFzY2VuZSAmJiAhJzcxZjJjZDk0NWNhYjRmYzEwMjYxMjMyYjNmMzU4NjE5JyApIHsgcmV0dXJuOyB9XG4gICAgICAgIHRoaXMuc2V0RGF0YSEoe1xuICAgICAgICAgICAgaWQ6IG9wdGlvbnMhLmlkIHx8IHNjZW5lIHx8ICc3MWYyY2Q5NDVjYWI0ZmMxMDI2MTIzMmIzZjM1ODYxOScsXG4gICAgICAgIH0pO1xuXG4gICAgICAgIGlmICggb3B0aW9ucyEuaWQgfHwgc2NlbmUgKSB7IFxuICAgICAgICAgICAgdGhpcy5zZXREYXRhISh7XG4gICAgICAgICAgICAgICAgaWQ6IG9wdGlvbnMhLmlkIHx8IHNjZW5lLFxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgIGlmICggISEob3B0aW9ucyBhcyBhbnkpLmZyb20gKSB7XG4gICAgICAgICAgICB0aGlzLnNldERhdGEhKHtcbiAgICAgICAgICAgICAgICBmcm9tOiBvcHRpb25zIS5mcm9tLFxuICAgICAgICAgICAgICAgIHNob3dUaXBzOiAnc2hvdydcbiAgICAgICAgICAgIH0pXG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgIHNldFRpbWVvdXQoKCApID0+IHtcbiAgICAgICAgICAgIHRoaXMud2F0Y2hSb2xlKCApO1xuICAgICAgICAgICAgdGhpcy5jaGVja0xpa2UoICk7XG4gICAgICAgICAgICB0aGlzLmZldGNoTGFzdCggKTtcbiAgICAgICAgfSwgMjAgKTtcbiAgICB9LFxuICBcbiAgICAvKipcbiAgICAgKiDnlJ/lkb3lkajmnJ/lh73mlbAtLeebkeWQrOmhtemdouWIneasoea4suafk+WujOaIkFxuICAgICAqL1xuICAgIG9uUmVhZHk6IGZ1bmN0aW9uICggKSB7XG4gICAgICAgIGxldCBjaXJjbGVDb3VudCA9IDA7IFxuICAgICAgICBjb25zdCB0aGF0OiBhbnkgPSB0aGlzO1xuICAgICAgICAvLyDlv4Pot7PnmoTlpJbmoYbliqjnlLsgXG4gICAgICAgIHRoYXQuYW5pbWF0aW9uTWlkZGxlSGVhZGVySXRlbSA9IHd4LmNyZWF0ZUFuaW1hdGlvbih7IFxuICAgICAgICAgICAgZHVyYXRpb246IDgwMCwgXG4gICAgICAgICAgICB0aW1pbmdGdW5jdGlvbjogJ2Vhc2UnLCBcbiAgICAgICAgICAgIHRyYW5zZm9ybU9yaWdpbjogJzUwJSA1MCUnLFxuICAgICAgICB9KTsgXG4gICAgICAgIHNldEludGVydmFsKCBmdW5jdGlvbiggKSB7IFxuICAgICAgICAgICAgaWYgKGNpcmNsZUNvdW50ICUgMiA9PSAwKSB7IFxuICAgICAgICAgICAgICAgIHRoYXQuYW5pbWF0aW9uTWlkZGxlSGVhZGVySXRlbS5zY2FsZSggMS4wICkucm90YXRlKCAxMCApLnN0ZXAoICk7IFxuICAgICAgICAgICAgfSBlbHNlIHsgXG4gICAgICAgICAgICAgICAgdGhhdC5hbmltYXRpb25NaWRkbGVIZWFkZXJJdGVtLnNjYWxlKCAxLjAgKS5yb3RhdGUoIC0zMCApLnN0ZXAoICk7IFxuICAgICAgICAgICAgfSBcbiAgICAgICAgICAgIHRoYXQuc2V0RGF0YSh7IFxuICAgICAgICAgICAgICAgIGFuaW1hdGlvbk1pZGRsZUhlYWRlckl0ZW06IHRoYXQuYW5pbWF0aW9uTWlkZGxlSGVhZGVySXRlbS5leHBvcnQoICkgXG4gICAgICAgICAgICB9KTsgXG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGlmICggKytjaXJjbGVDb3VudCA9PT0gMTAwMCApIHsgXG4gICAgICAgICAgICAgICAgY2lyY2xlQ291bnQgPSAwOyBcbiAgICAgICAgICAgIH0gXG4gICAgICAgIH0uYmluZCggdGhpcyApLCAxMDAwICk7IFxuICAgIH0sXG4gIFxuICAgIC8qKlxuICAgICAqIOeUn+WRveWRqOacn+WHveaVsC0t55uR5ZCs6aG16Z2i5pi+56S6XG4gICAgICovXG4gICAgb25TaG93OiBmdW5jdGlvbiAoICkge1xuICAgICAgICBjb25zdCB7IGlkLCB0aWQgfSA9IHRoaXMuZGF0YTtcblxuICAgICAgICB0aGlzLmZldERldGFpbCggaWQgKTtcbiAgICAgICAgdGhpcy5mZXRjaFNob3BwaW5nKCBpZCwgdGlkICk7XG4gICAgfSxcbiAgXG4gICAgLyoqXG4gICAgICog55Sf5ZG95ZGo5pyf5Ye95pWwLS3nm5HlkKzpobXpnaLpmpDol49cbiAgICAgKi9cbiAgICBvbkhpZGU6IGZ1bmN0aW9uICgpIHtcbiAgXG4gICAgfSxcbiAgXG4gICAgLyoqXG4gICAgICog55Sf5ZG95ZGo5pyf5Ye95pWwLS3nm5HlkKzpobXpnaLljbjovb1cbiAgICAgKi9cbiAgICBvblVubG9hZDogZnVuY3Rpb24gKCkge1xuICBcbiAgICB9LFxuICBcbiAgICAvKipcbiAgICAgKiDpobXpnaLnm7jlhbPkuovku7blpITnkIblh73mlbAtLeebkeWQrOeUqOaIt+S4i+aLieWKqOS9nFxuICAgICAqL1xuICAgIG9uUHVsbERvd25SZWZyZXNoOiBmdW5jdGlvbiAoKSB7XG4gIFxuICAgIH0sXG4gIFxuICAgIC8qKlxuICAgICAqIOmhtemdouS4iuaLieinpuW6leS6i+S7tueahOWkhOeQhuWHveaVsFxuICAgICAqL1xuICAgIG9uUmVhY2hCb3R0b206IGZ1bmN0aW9uICgpIHtcbiAgXG4gICAgfSxcbiAgXG4gICAgLyoqXG4gICAgICog55So5oi354K55Ye75Y+z5LiK6KeS5YiG5LqrXG4gICAgICovXG4gICAgb25TaGFyZUFwcE1lc3NhZ2U6IGZ1bmN0aW9uICggZSApIHtcbiAgICAgICAgY29uc3QgeyBkZXRhaWwsIHBpbiQsIGFjdGl2aXRpZXMsIHByaWNlR2FwLCB0cmlwLCBvcGVuaWQgfSA9IHRoaXMuZGF0YTtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHRpdGxlOiBgJHtwcmljZUdhcCAhPT0gJycgJiYgTnVtYmVyKCBwcmljZUdhcCApICE9PSAwID8gXG4gICAgICAgICAgICAgICAgICAgICAgICBhY3Rpdml0aWVzLmxlbmd0aCA9PT0gMCA/XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYOS4gOi1t+S5sO+8geS4gOi1t+ecgSR7U3RyaW5nKCBwcmljZUdhcCApLnJlcGxhY2UoL1xcLjAwL2csICcnKX3lhYPvvIFgIDpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAn6ZmQ5pe254m55Lu36LaF5a6e5oOg77yBJyA6IFxuICAgICAgICAgICAgICAgICAgICAgICAgdHJpcCAmJiB0cmlwLnJlZHVjZV9wcmljZSA/IFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGDnq4vlh48ke3RyaXAucmVkdWNlX3ByaWNlfeWFg++8gWAgOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICfnu5nkvaDnnIvnnIvov5nlrp3otJ3vvIEnXG4gICAgICAgICAgICAgICAgfSR7ZGV0YWlsLnRpdGxlfWAsXG4gICAgICAgICAgICAvLyDliIbkuqvkuI3lupTor6XluKZ0aWRcbiAgICAgICAgICAgIHBhdGg6IGAvcGFnZXMvZ29vZHMtZGV0YWlsL2luZGV4P2lkPSR7ZGV0YWlsLl9pZH0mZnJvbT0ke29wZW5pZH1gLFxuICAgICAgICAgICAgaW1hZ2VVcmw6IGAke2RldGFpbC5pbWdbIDAgXX1gXG4gICAgICAgIH1cbiAgICB9XG4gIH0pIl19