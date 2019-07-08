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
        pin: [],
        shopping: [],
        activities: [],
        canPinSku: [],
        trip: null
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
                    return result ? String(result.goodPins.eachPriceRound).replace(/\.00/g, '') : '';
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
                    if (!_this.data.tid) {
                        _this.fetchShopping(id, tid);
                    }
                    _this.setData({
                        tid: data[0]._id,
                        trip: data[0]
                    });
                }
            }
        });
    },
    toggleTips: function (e) {
        var showTips = this.data.showTips;
        this.setData({
            showTips: showTips === 'show' ? 'hide' : 'show'
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
    onLoad: function (options) {
        var scene = decodeURIComponent(options.scene || '');
        this.watchRole();
        this.runComputed();
        this.checkLike();
        this.fetchLast();
        if (!options.id && !scene) {
            return;
        }
        this.setData({
            id: options.id || scene,
        });
        if (!!options.tid) {
            this.setData({
                tid: options.tid
            });
        }
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
    onShareAppMessage: function () {
        var _a = this.data, detail = _a.detail, pin$ = _a.pin$, activities = _a.activities, priceGap = _a.priceGap, trip = _a.trip;
        return {
            title: "" + (priceGap !== '' && Number(priceGap) !== 0 ?
                activities.length === 0 ?
                    "\u4E00\u8D77\u4E70\uFF01\u4E00\u8D77\u7701" + String(priceGap).replace(/\.00/g, '') + "\u5143\uFF01" :
                    '限时特价超实惠！' :
                trip && trip.reduce_price ?
                    "\u7ACB\u51CF" + trip.reduce_price + "\u5143\uFF01" :
                    '给你看看这宝贝！') + detail.title,
            path: "/pages/goods-detail/index?id=" + detail._id + "&tid=" + this.data.tid,
            imageUrl: "" + detail.img[0]
        };
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUNBLDhDQUEwQztBQUMxQyxxREFBb0Q7QUFDcEQsZ0RBQXFEO0FBQ3JELGdEQUE0QztBQUU1QyxJQUFNLEdBQUcsR0FBRyxNQUFNLEVBQUcsQ0FBQztBQUd0QixJQUFNLFVBQVUsR0FBRyxvQkFBb0IsQ0FBQztBQUV4QyxJQUFJLENBQUM7SUFHRCx5QkFBeUIsRUFBRSxJQUFJO0lBSy9CLElBQUksRUFBRTtRQUdGLEtBQUssRUFBRSxJQUFJO1FBR1gsR0FBRyxFQUFFLEVBQUU7UUFHUCxFQUFFLEVBQUUsRUFBRTtRQUdOLE1BQU0sRUFBRSxJQUFJO1FBR1osR0FBRyxFQUFFLEVBQUc7UUFHUixPQUFPLEVBQUUsSUFBSTtRQUdiLFdBQVcsRUFBRSxLQUFLO1FBR2xCLEtBQUssRUFBRSxLQUFLO1FBR1osV0FBVyxFQUFFO1lBQ1QsTUFBTSxFQUFFLE1BQU0sRUFBRSxNQUFNO1NBQ3pCO1FBR0QseUJBQXlCLEVBQUUsSUFBSTtRQUcvQixPQUFPLEVBQUUsS0FBSztRQUdkLGFBQWEsRUFBRSxLQUFLO1FBR3BCLFFBQVEsRUFBRSxNQUFNO1FBR2hCLEdBQUcsRUFBRSxFQUFHO1FBR1IsUUFBUSxFQUFFLEVBQUc7UUFHYixVQUFVLEVBQUUsRUFBRztRQUdmLFNBQVMsRUFBRSxFQUFHO1FBR2QsSUFBSSxFQUFFLElBQUk7S0FDYjtJQUdELFdBQVc7UUFDUCxtQkFBUSxDQUFFLElBQUksRUFBRTtZQUdaLEtBQUssRUFBRTtnQkFDSyxJQUFBLHlCQUFNLENBQWU7Z0JBQzdCLElBQU0sTUFBTSxHQUFHLHlCQUFjLENBQUUsTUFBTSxDQUFFLENBQUM7Z0JBQ3hDLE9BQU8sTUFBTSxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUM7WUFDdkMsQ0FBQztZQUdELFdBQVcsRUFBRTtnQkFDRCxJQUFB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Y0FBd0QsRUFBdEQsa0JBQU0sRUFBRSxjQUFJLEVBQUUsMEJBQVUsRUFBRSxzQkFBUSxFQUFFLGNBQWtCLENBQUM7UUFDL0QsT0FBTztZQUNILEtBQUssRUFBRSxNQUFHLFFBQVEsS0FBSyxFQUFFLElBQUksTUFBTSxDQUFFLFFBQVEsQ0FBRSxLQUFLLENBQUMsQ0FBQyxDQUFDO2dCQUMzQyxVQUFVLENBQUMsTUFBTSxLQUFLLENBQUMsQ0FBQyxDQUFDO29CQUNyQiwrQ0FBVSxNQUFNLENBQUUsUUFBUSxDQUFFLENBQUMsT0FBTyxDQUFDLE9BQU8sRUFBRSxFQUFFLENBQUMsaUJBQUksQ0FBQyxDQUFDO29CQUN2RCxVQUFVLENBQUMsQ0FBQztnQkFDaEIsSUFBSSxJQUFJLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQztvQkFDdkIsaUJBQUssSUFBSSxDQUFDLFlBQVksaUJBQUksQ0FBQyxDQUFDO29CQUM1QixVQUFVLElBQ25CLE1BQU0sQ0FBQyxLQUFPO1lBQ3JCLElBQUksRUFBRSxrQ0FBZ0MsTUFBTSxDQUFDLEdBQUcsYUFBUSxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUs7WUFDdkUsUUFBUSxFQUFFLEtBQUcsTUFBTSxDQUFDLEdBQUcsQ0FBRSxDQUFDLENBQUk7U0FDakMsQ0FBQTtJQUNMLENBQUM7Q0FDRixDQUFDLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJcbmltcG9ydCB7IGh0dHAgfSBmcm9tICcuLi8uLi91dGlsL2h0dHAuanMnO1xuaW1wb3J0IHsgY29tcHV0ZWQgfSBmcm9tICcuLi8uLi9saWIvdnVlZnkvaW5kZXguanMnO1xuaW1wb3J0IHsgZGVsYXllcmluZ0dvb2QgfSBmcm9tICcuLi8uLi91dGlsL2dvb2RzLmpzJztcbmltcG9ydCB7IG5hdlRvIH0gZnJvbSAnLi4vLi4vdXRpbC9yb3V0ZS5qcyc7XG5cbmNvbnN0IGFwcCA9IGdldEFwcCggKTtcblxuLy8g5omT5byA5ou85Zui5o+Q56S655qEa2V5XG5jb25zdCBzdG9yYWdlS2V5ID0gJ29wZW5lZC1waW4taW4tZ29vZCc7XG5cblBhZ2Uoe1xuXG4gICAgLy8g5Yqo55S7XG4gICAgYW5pbWF0aW9uTWlkZGxlSGVhZGVySXRlbTogbnVsbCxcblxuICAgIC8qKlxuICAgICAqIOmhtemdoueahOWIneWni+aVsOaNrlxuICAgICAqL1xuICAgIGRhdGE6IHtcblxuICAgICAgICAvLyDmmK/lkKbkuLrmlrDlrqJcbiAgICAgICAgaXNOZXc6IHRydWUsXG5cbiAgICAgICAgLy8g6KGM56iLXG4gICAgICAgIHRpZDogJycsXG5cbiAgICAgICAgLy8g5ZWG5ZOBaWRcbiAgICAgICAgaWQ6ICcnLFxuXG4gICAgICAgIC8vIOWVhuWTgeivpuaDhVxuICAgICAgICBkZXRhaWw6IG51bGwsXG4gICAgICAgIFxuICAgICAgICAvLyDmlbDmja7lrZflhbhcbiAgICAgICAgZGljOiB7IH0sXG4gICAgICAgIFxuICAgICAgICAvLyDliqDovb3nirbmgIFcbiAgICAgICAgbG9hZGluZzogdHJ1ZSxcblxuICAgICAgICAvLyDmmK/lkKbliJ3lp4vljJbov4figJzllpzmrKLigJ1cbiAgICAgICAgaGFzSW5pdExpa2U6IGZhbHNlLFxuXG4gICAgICAgIC8vIOaYr+WQpuKAnOWWnOasouKAnVxuICAgICAgICBsaWtlZDogZmFsc2UsXG5cbiAgICAgICAgLy8g5paH5a2X5L+d6K+B5o+Q56S6XG4gICAgICAgIHByb21pc2VUaXBzOiBbXG4gICAgICAgICAgICAn5q2j5ZOB5L+d6K+BJywgJ+S7t+agvOS8mOWKvycsICfnnJ/kurrot5Hohb8nXG4gICAgICAgIF0sXG5cbiAgICAgICAgLy8g5Yqo55S7XG4gICAgICAgIGFuaW1hdGlvbk1pZGRsZUhlYWRlckl0ZW06IG51bGwsXG5cbiAgICAgICAgLy8g5bGV56S6566h55CG5YWl5Y+jXG4gICAgICAgIHNob3dCdG46IGZhbHNlLFxuXG4gICAgICAgIC8vIOato+WcqOWxleekuua1t+aKpVxuICAgICAgICBzaG93aW5nUG9zdGVyOiBmYWxzZSxcblxuICAgICAgICAvLyDlsZXnpLrlvLnmoYZcbiAgICAgICAgc2hvd1RpcHM6ICdoaWRlJyxcblxuICAgICAgICAvLyDmi7zlm6LliJfooahcbiAgICAgICAgcGluOiBbIF0sXG5cbiAgICAgICAgLy8g5ZWG5ZOB5Zyo5pys6KGM56iL55qE6LSt54mp5riF5Y2V5YiX6KGoXG4gICAgICAgIHNob3BwaW5nOiBbIF0sXG5cbiAgICAgICAgLy8g5LiA5Y+j5Lu35rS75Yqo5YiX6KGoXG4gICAgICAgIGFjdGl2aXRpZXM6IFsgXSxcblxuICAgICAgICAvLyDmnKzotp/og73lpJ/mi7zlm6LnmoRza3VcbiAgICAgICAgY2FuUGluU2t1OiBbIF0sXG5cbiAgICAgICAgLy8g5b2T5YmN55qE6KGM56iLXG4gICAgICAgIHRyaXA6IG51bGxcbiAgICB9LFxuXG4gICAgLyoqIOiuvue9rmNvbXB1dGVkICovXG4gICAgcnVuQ29tcHV0ZWQoICkge1xuICAgICAgICBjb21wdXRlZCggdGhpcywge1xuXG4gICAgICAgICAgICAvLyDorqHnrpfku7fmoLxcbiAgICAgICAgICAgIHByaWNlOiBmdW5jdGlvbiggKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgeyBkZXRhaWwgfSA9IHRoaXMuZGF0YTtcbiAgICAgICAgICAgICAgICBjb25zdCByZXN1bHQgPSBkZWxheWVyaW5nR29vZCggZGV0YWlsICk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlc3VsdCA/IHJlc3VsdC5wcmljZSQgOiAnJztcbiAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgIC8vIOWVhuWTgeivpuaDhSAtIOWIhuihjOaYvuekulxuICAgICAgICAgICAgZGV0YWlsSW50cm86IGZ1bmN0aW9uKCApIHtcbiAgICAgICAgICAgICAgICBjb25zdCB7IGRldGFpbCB9ID0gdGhpcy5kYXRhO1xuICAgICAgICAgICAgICAgIGlmICggIWRldGFpbCB8fCAoICEhZGV0YWlsICYmICFkZXRhaWwuZGV0YWlsICkpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFsgXTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZGV0YWlsLmRldGFpbC5zcGxpdCgnXFxuJykuZmlsdGVyKCB4ID0+ICEheCApO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgIC8vIOS7t+agvCDvvZ4g5Zui6LSt5Lu355qE5beu5Lu3XG4gICAgICAgICAgICBwcmljZUdhcDogZnVuY3Rpb24oICkge1xuICAgICAgICAgICAgICAgIGNvbnN0IHsgZGV0YWlsIH0gPSB0aGlzLmRhdGE7XG4gICAgICAgICAgICAgICAgaWYgKCAhZGV0YWlsICkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gJydcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCByZXN1bHQgPSBkZWxheWVyaW5nR29vZCggZGV0YWlsICk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiByZXN1bHQgPyBTdHJpbmcoIHJlc3VsdC5nb29kUGlucy5lYWNoUHJpY2VSb3VuZCApLnJlcGxhY2UoL1xcLjAwL2csICcnKSA6ICcnO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgIC8vIOaLvOWbouWIl+ihqFxuICAgICAgICAgICAgcGluJDogZnVuY3Rpb24oICkge1xuICAgICAgICAgICAgICAgIGxldCBtZXRhOiBhbnkgPSBbIF07XG4gICAgICAgICAgICAgICAgY29uc3QgeyBkZXRhaWwsIHNob3BwaW5nLCBhY3Rpdml0aWVzIH0gPSB0aGlzLmRhdGE7XG5cbiAgICAgICAgICAgICAgICBpZiAoICFkZXRhaWwgKSB7IFxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gWyBdO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGNvbnN0IHsgc3RhbmRhcmRzLCBncm91cFByaWNlIH0gPSBkZXRhaWw7XG5cbiAgICAgICAgICAgICAgICBpZiAoIHN0YW5kYXJkcy5sZW5ndGggPiAwICkge1xuICAgICAgICAgICAgICAgICAgICBtZXRhID0gc3RhbmRhcmRzXG4gICAgICAgICAgICAgICAgICAgICAgICAuZmlsdGVyKCB4ID0+ICEheC5ncm91cFByaWNlIClcbiAgICAgICAgICAgICAgICAgICAgICAgIC5tYXAoIHggPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBPYmplY3QuYXNzaWduKHsgfSwgeCwge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzaWQ6IHguX2lkLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYW5QaW46ICEhc2hvcHBpbmcuZmluZCggcyA9PiBzLnNpZCA9PT0geC5faWQgJiYgcy5waWQgPT09IHgucGlkIClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKCAhIWdyb3VwUHJpY2UgKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHsgcHJpY2UsIHRpdGxlLCBpbWcsIF9pZCB9ID0gZGV0YWlsO1xuICAgICAgICAgICAgICAgICAgICBtZXRhID0gW3tcbiAgICAgICAgICAgICAgICAgICAgICAgIHByaWNlLFxuICAgICAgICAgICAgICAgICAgICAgICAgcGlkOiBfaWQsXG4gICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiB0aXRsZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGdyb3VwUHJpY2UsXG4gICAgICAgICAgICAgICAgICAgICAgICBzaWQ6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICAgICAgICAgIGltZzogaW1nWyAwIF0sXG4gICAgICAgICAgICAgICAgICAgICAgICBjYW5QaW46ICEhc2hvcHBpbmcuZmluZCggcyA9PiBzLnBpZCA9PT0gX2lkIClcbiAgICAgICAgICAgICAgICAgICAgfV07XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgLy8g5qC55o2u5rS75Yqo77yM5pu05pS544CB5paw5aKe5ou85Zui6aG555uuXG4gICAgICAgICAgICAgICAgYWN0aXZpdGllcy5tYXAoIGFjID0+IHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCAhYWMuYWNfZ3JvdXBQcmljZSApIHsgcmV0dXJuOyB9XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHBpblRhcmdldCA9IG1ldGEuZmluZCggeCA9PiB4LnBpZCA9PT0gYWMucGlkICYmIHguc2lkID09PSBhYy5zaWQgKTtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgcGluVGFyZ2V0SW5kZXggPSBtZXRhLmZpbmRJbmRleCggeCA9PiB4LnBpZCA9PT0gYWMucGlkICYmIHguc2lkID09PSBhYy5zaWQgKTtcblxuICAgICAgICAgICAgICAgICAgICAvLyDmm7/mjaJcbiAgICAgICAgICAgICAgICAgICAgaWYgKCBwaW5UYXJnZXRJbmRleCAhPT0gLTEgKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBtZXRhLnNwbGljZSggcGluVGFyZ2V0SW5kZXgsIDEsIE9iamVjdC5hc3NpZ24oeyB9LCBwaW5UYXJnZXQsIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcmljZTogYWMuYWNfcHJpY2UsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZ3JvdXBQcmljZTogYWMuYWNfZ3JvdXBQcmljZVxuICAgICAgICAgICAgICAgICAgICAgICAgfSkpO1xuXG4gICAgICAgICAgICAgICAgICAgIC8vIOaWsOWinlxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgbWV0YS5wdXNoKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzaWQ6IGFjLnNpZCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwaWQ6IGFjLnBpZCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbWc6IGFjLmltZyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiBhYy50aXRsZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYW5QaW46ICEhc2hvcHBpbmcuZmluZCggcyA9PiBzLnNpZCA9PT0gYWMuc2lkICYmIHMucGlkID09PSBhYy5waWQgKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcmljZTogYWMuYWNfcHJpY2UsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZ3JvdXBQcmljZTogYWMuYWNfZ3JvdXBQcmljZSBcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgIGNvbnN0IG1ldGEyID0gbWV0YS5tYXAoIHggPT4gT2JqZWN0LmFzc2lnbih7IH0sIHgsIHtcbiAgICAgICAgICAgICAgICAgICAgZGVsdGE6IE51bWJlciggeC5wcmljZSAtIHguZ3JvdXBQcmljZSApLnRvRml4ZWQoIDAgKVxuICAgICAgICAgICAgICAgIH0pKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gbWV0YTI7XG4gICAgICAgICAgICB9LFxuXG4gICAgICAgICAgICAvLyDpqazkuIrlj6/ku6Xmi7zlm6LnmoTkuKrmlbBcbiAgICAgICAgICAgIHBpbkNvdW50JDogZnVuY3Rpb24oICkge1xuICAgICAgICAgICAgICAgIGNvbnN0IHsgZGV0YWlsLCBzaG9wcGluZyB9ID0gdGhpcy5kYXRhO1xuICAgICAgICAgICAgICAgIGlmICggIWRldGFpbCApIHsgXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAwO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGNvbnN0IHsgc3RhbmRhcmRzLCBncm91cFByaWNlIH0gPSBkZXRhaWw7XG5cbiAgICAgICAgICAgICAgICBpZiAoICEhc3RhbmRhcmRzICYmIHN0YW5kYXJkcy5sZW5ndGggPiAwICkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gc3RhbmRhcmRzXG4gICAgICAgICAgICAgICAgICAgICAgICAuZmlsdGVyKCB4ID0+ICEhc2hvcHBpbmcuZmluZCggcyA9PiBzLnNpZCA9PT0geC5faWQgJiYgcy5waWQgPT09IHgucGlkICkpXG4gICAgICAgICAgICAgICAgICAgICAgICAubGVuZ3RoO1xuXG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmICggISFncm91cFByaWNlICkge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCB7IF9pZCB9ID0gZGV0YWlsO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gISFzaG9wcGluZy5maW5kKCBzID0+IHMucGlkID09PSBfaWQgKSA/IDEgOiAwXG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgcmV0dXJuIDA7XG4gICAgICAgICAgICB9LFxuXG4gICAgICAgICAgICAvLyDmmK/lkKbmnInlnovlj7dcbiAgICAgICAgICAgIGhhc1N0YW5kZXJzJDogZnVuY3Rpb24oICkge1xuICAgICAgICAgICAgICAgIGNvbnN0IHsgZGV0YWlsIH0gPSB0aGlzLmRhdGE7XG4gICAgICAgICAgICAgICAgaWYgKCAhZGV0YWlsICkgeyBcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBjb25zdCB7IHN0YW5kYXJkcyB9ID0gZGV0YWlsO1xuICAgICAgICAgICAgICAgIHJldHVybiAhIXN0YW5kYXJkcyAmJiBzdGFuZGFyZHMubGVuZ3RoID4gMCA7XG4gICAgICAgICAgICB9LFxuXG4gICAgICAgIH0pXG4gICAgfSxcblxuICAgIC8qKiDmi4nlj5bllYblk4Hor6bmg4UgKi9cbiAgICBmZXREZXRhaWwoIGlkICkge1xuICAgICAgICBjb25zdCB7IGRldGFpbCB9ID0gdGhpcy5kYXRhO1xuICAgICAgICBpZiAoIGRldGFpbCApIHsgcmV0dXJuOyB9XG4gICAgICAgIGh0dHAoe1xuICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgIF9pZDogaWQsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgZXJyTXNnOiAn6I635Y+W5ZWG5ZOB6ZSZ6K+v77yM6K+36YeN6K+VJyxcbiAgICAgICAgICAgIHVybDogYGdvb2RfZGV0YWlsYCxcbiAgICAgICAgICAgIHN1Y2Nlc3M6IHJlcyA9PiB7XG4gICAgICAgICAgICAgIGlmICggcmVzLnN0YXR1cyAhPT0gMjAwICkgeyByZXR1cm47IH1cblxuICAgICAgICAgICAgICAgIGxldCBwaW46IGFueSA9IFsgXTtcbiAgICAgICAgICAgICAgICBjb25zdCB7IHN0YW5kYXJkcywgZ3JvdXBQcmljZSwgYWN0aXZpdGllcyB9ID0gcmVzLmRhdGE7XG5cbiAgICAgICAgICAgICAgICBpZiAoIHN0YW5kYXJkcy5sZW5ndGggPiAwICkge1xuICAgICAgICAgICAgICAgICAgICBwaW4gPSBzdGFuZGFyZHMuZmlsdGVyKCB4ID0+ICEheC5ncm91cFByaWNlICk7XG5cbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKCAhIWdyb3VwUHJpY2UgKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHsgcHJpY2UsIHRpdGxlLCBpbWcgIH0gPSByZXMuZGF0YTtcbiAgICAgICAgICAgICAgICAgICAgcGluID0gW3tcbiAgICAgICAgICAgICAgICAgICAgICAgIHByaWNlLFxuICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogdGl0bGUsXG4gICAgICAgICAgICAgICAgICAgICAgICBncm91cFByaWNlLFxuICAgICAgICAgICAgICAgICAgICAgICAgaW1nOiBpbWdbIDAgXVxuICAgICAgICAgICAgICAgICAgICB9XTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBjb25zdCBhY3Rpdml0aWVzJCA9IGFjdGl2aXRpZXMubWFwKCB4ID0+IHtcblxuICAgICAgICAgICAgICAgICAgICBsZXQgaW1nID0gJyc7XG4gICAgICAgICAgICAgICAgICAgIGlmICggISF4LnNpZCApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGltZyA9IHN0YW5kYXJkcy5maW5kKCB5ID0+IHkuX2lkID09PSB4LnNpZCApLmltZ1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgaW1nID0gcmVzLmRhdGEuaW1nWyAwIF07XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gT2JqZWN0LmFzc2lnbih7IH0sIHgsIHsgXG4gICAgICAgICAgICAgICAgICAgICAgICBpbWcsXG4gICAgICAgICAgICAgICAgICAgICAgICBjb3VudGRvd246ICggeC5lbmRUaW1lIC0gbmV3IERhdGUoICkuZ2V0VGltZSggKSkgLyAoIDEwMDAgKVxuICAgICAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgIH0pLmZpbHRlciggeSA9PiB5LmVuZFRpbWUgPiBuZXcgRGF0ZSggKS5nZXRUaW1lKCApKTtcblxuICAgICAgICAgICAgICAgIHRoaXMuc2V0RGF0YSEoe1xuICAgICAgICAgICAgICAgICAgICBwaW4sXG4gICAgICAgICAgICAgICAgICAgIGxvYWRpbmc6IGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICBkZXRhaWw6IHJlcy5kYXRhLFxuICAgICAgICAgICAgICAgICAgICBhY3Rpdml0aWVzOiBhY3Rpdml0aWVzJFxuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgdGhpcy5jaGVja09wZW5QaW4oICk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH0sXG5cbiAgICAvKiog5ouJ5Y+W5b2T5YmN5ZWG5ZOB55qE6LSt54mp6K+35Y2V5L+h5oGvICovXG4gICAgZmV0Y2hTaG9wcGluZyggcGlkLCB0aWQgKSB7XG5cbiAgICAgICAgaWYgKCAhcGlkIHx8ICF0aWQgKSB7IHJldHVybjsgfVxuXG4gICAgICAgIGh0dHAoe1xuICAgICAgICAgICAgdXJsOiAnc2hvcHBpbmctbGlzdF9waW4nLFxuICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgIHBpZCxcbiAgICAgICAgICAgICAgICB0aWQsXG4gICAgICAgICAgICAgICAgZGV0YWlsOiBmYWxzZVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHN1Y2Nlc3M6IHJlcyA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3QgeyBzdGF0dXMsIGRhdGEgfSA9IHJlcztcbiAgICAgICAgICAgICAgICBpZiAoIHN0YXR1cyAhPT0gMjAwICkgeyByZXR1cm47IH1cbiAgICAgICAgICAgICAgICB0aGlzLnNldERhdGEhKHtcbiAgICAgICAgICAgICAgICAgICAgc2hvcHBpbmc6IGRhdGEsXG4gICAgICAgICAgICAgICAgICAgIGNhblBpblNrdTogZGF0YS5tYXAoIHggPT4gKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHBpZDogeC5waWQsXG4gICAgICAgICAgICAgICAgICAgICAgICBzaWQ6IHguc2lkXG4gICAgICAgICAgICAgICAgICAgIH0pKVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KVxuICAgIH0sXG5cbiAgICAvKiog5ouJ5Y+W5Lik5Liq5pyA5paw6KGM56iLICovXG4gICAgZmV0Y2hMYXN0KCApIHtcbiAgICAgICAgY29uc3QgeyBpZCB9ID0gdGhpcy5kYXRhO1xuICAgICAgICBodHRwKHtcbiAgICAgICAgICAgIGRhdGE6IHsgfSxcbiAgICAgICAgICAgIHVybDogYHRyaXBfZW50ZXJgLFxuICAgICAgICAgICAgc3VjY2VzczogcmVzID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCB7IHN0YXR1cywgZGF0YSB9ID0gcmVzO1xuICAgICAgICAgICAgICAgIGlmICggc3RhdHVzICE9PSAyMDAgKSB7IHJldHVybjsgfVxuXG4gICAgICAgICAgICAgICAgaWYgKCAhIWRhdGFbIDAgXSkge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCB0aWQgPSBkYXRhWyAwIF0uX2lkXG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKCAhdGhpcy5kYXRhLnRpZCApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZmV0Y2hTaG9wcGluZyggaWQsIHRpZCApO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc2V0RGF0YSEoe1xuICAgICAgICAgICAgICAgICAgICAgICAgdGlkOiBkYXRhWyAwIF0uX2lkLFxuICAgICAgICAgICAgICAgICAgICAgICAgdHJpcDogZGF0YVsgMCBdXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSlcbiAgICB9LFxuXG4gICAgLy8g5bGV5byA5o+Q56S6XG4gICAgdG9nZ2xlVGlwcyggZT8gKSB7XG4gICAgICAgIGNvbnN0IHsgc2hvd1RpcHMgfSA9IHRoaXMuZGF0YTtcbiAgICAgICAgdGhpcy5zZXREYXRhISh7XG4gICAgICAgICAgICBzaG93VGlwczogc2hvd1RpcHMgPT09ICdzaG93JyA/ICdoaWRlJyA6ICdzaG93J1xuICAgICAgICB9KTtcbiAgICAgICAgISFlICYmIHRoaXMuY3JlYXRlRm9ybUlkKCBlLmRldGFpbC5mb3JtSWQgKTtcbiAgICB9LFxuXG4gICAgLy8g6L+b5YWl5ZWG5ZOB566h55CGXG4gICAgZ29NYW5hZ2VyKCApIHtcbiAgICAgICAgbmF2VG8oYC9wYWdlcy9tYW5hZ2VyLWdvb2RzLWRldGFpbC9pbmRleD9pZD0ke3RoaXMuZGF0YS5pZH1gKVxuICAgIH0sXG5cbiAgICAvKiog55uR5ZCs5YWo5bGA566h55CG5ZGY5p2D6ZmQICovXG4gICAgd2F0Y2hSb2xlKCApIHtcbiAgICAgICAgKGFwcCBhcyBhbnkpLndhdGNoJCgncm9sZScsICggdmFsICkgPT4ge1xuICAgICAgICAgICAgdGhpcy5zZXREYXRhISh7XG4gICAgICAgICAgICAgICAgc2hvd0J0bjogKCB2YWwgPT09IDEgKVxuICAgICAgICAgICAgfSlcbiAgICAgICAgfSk7XG4gICAgICAgIChhcHAgYXMgYW55KS53YXRjaCQoJ2lzTmV3JywgdmFsID0+IHtcbiAgICAgICAgICAgIHRoaXMuc2V0RGF0YSEoe1xuICAgICAgICAgICAgICAgIGlzTmV3OiB2YWxcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9LFxuICAgIFxuICAgIC8qKiDpooTop4jlm77niYcgKi9cbiAgICBwcmV2aWV3SW1nKHsgY3VycmVudFRhcmdldCB9KSB7XG4gICAgICAgIGNvbnN0IHsgaW1nIH0gPSBjdXJyZW50VGFyZ2V0LmRhdGFzZXQ7XG4gICAgICAgIHRoaXMuZGF0YS5kZXRhaWwgJiYgd3gucHJldmlld0ltYWdlKHtcbiAgICAgICAgICAgIGN1cnJlbnQ6IGltZyxcbiAgICAgICAgICAgIHVybHM6IFsgLi4uKHRoaXMuZGF0YSBhcyBhbnkpLmRldGFpbC5pbWcgXSxcbiAgICAgICAgfSk7XG4gICAgfSxcblxuICAgIC8qKiDpooTop4jljZXlvKDlm77niYfvvJrmi7zlm6Llm77niYfjgIHkuIDlj6Pku7fvvIjpmZDml7bmiqLvvIkgKi9cbiAgICBwcmV2aWV3U2luZ2xlSW1nKHsgY3VycmVudFRhcmdldCB9KSB7XG5cbiAgICAgICAgY29uc3QgaW1nID0gY3VycmVudFRhcmdldC5kYXRhc2V0LmRhdGEgP1xuICAgICAgICAgICAgY3VycmVudFRhcmdldC5kYXRhc2V0LmRhdGEuaW1nOlxuICAgICAgICAgICAgY3VycmVudFRhcmdldC5kYXRhc2V0LmltZztcblxuICAgICAgICB0aGlzLmRhdGEuZGV0YWlsICYmIHd4LnByZXZpZXdJbWFnZSh7XG4gICAgICAgICAgICBjdXJyZW50OiBpbWcsXG4gICAgICAgICAgICB1cmxzOiBbIGltZyBdLFxuICAgICAgICB9KTtcbiAgICB9LFxuXG4gICAgLyoqIOajgOafpeaYr+WQpuacieS4u+WKqOW8ueW8gOi/h+aLvOWboiAqL1xuICAgIGNoZWNrT3BlblBpbiggKSB7XG4gICAgICAgIGNvbnN0IHsgZGV0YWlsLCB0aWQgfSA9IHRoaXMuZGF0YTtcbiAgICAgICAgaWYgKCAhZGV0YWlsICkgeyByZXR1cm4gfVxuXG4gICAgICAgIGNvbnN0IHJlc3VsdCA9IGRlbGF5ZXJpbmdHb29kKCBkZXRhaWwgKTtcbiAgICAgICAgaWYgKCByZXN1bHQgJiYgdGlkICkge1xuICAgICAgICAgICAgY29uc3QgcHJpY2VHYXAgPSBTdHJpbmcoIHJlc3VsdC5nb29kUGlucy5lYWNoUHJpY2VSb3VuZCApLnJlcGxhY2UoL1xcLjAwL2csICcnKTtcbiAgICAgICAgICAgIGNvbnN0IG9wZW5SZWNvcmRUaWQgPSB3eC5nZXRTdG9yYWdlU3luYyggc3RvcmFnZUtleSApO1xuXG4gICAgICAgICAgICBpZiAoICEhcHJpY2VHYXAgJiYgISF0aWQgJiYgb3BlblJlY29yZFRpZCAhPT0gdGlkICkge1xuICAgICAgICAgICAgICAgIHd4LnNldFN0b3JhZ2VTeW5jKCBzdG9yYWdlS2V5LCB0aWQgKTtcbiAgICAgICAgICAgICAgICB0aGlzLnRvZ2dsZVRpcHMoICk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgLyoqIOiuvue9ruKAnOWWnOasouKAnSAqL1xuICAgIG9uTGlrZSggKSB7XG4gICAgICAgIGNvbnN0IHRoYXQgPSB0aGlzO1xuICAgICAgICBpZiAoICF0aGlzLmRhdGEuaGFzSW5pdExpa2UgKSB7IHJldHVybjsgfVxuICAgICAgICBodHRwKHtcbiAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICBwaWQ6IHRoaXMuZGF0YS5pZFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHVybDogJ2xpa2VfY3JlYXRlJyxcbiAgICAgICAgICAgIHN1Y2Nlc3M6ICAoIHJlczogYW55ICkgPT4ge1xuICAgICAgICAgICAgICAgIGlmICggcmVzLnN0YXR1cyA9PT0gMjAwICkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnNldERhdGEhKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxpa2VkOiAhdGhpcy5kYXRhLmxpa2VkXG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9LFxuXG4gICAgLyoqIOiuvue9ruKAnOWWnOasouKAnSAqL1xuICAgIGNoZWNrTGlrZSggKSB7XG4gICAgICAgIGNvbnN0IHRoYXQgPSB0aGlzO1xuICAgICAgICBodHRwKHtcbiAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICBwaWQ6IHRoaXMuZGF0YS5pZFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHVybDogJ2xpa2VfY2hlY2snLFxuICAgICAgICAgICAgc3VjY2VzczogICggcmVzOiBhbnkgKSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKCByZXMuc3RhdHVzID09PSAyMDAgKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc2V0RGF0YSEoe1xuICAgICAgICAgICAgICAgICAgICAgICAgbGlrZWQ6IHJlcy5kYXRhLFxuICAgICAgICAgICAgICAgICAgICAgICAgaGFzSW5pdExpa2U6IHRydWVcbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH0sXG5cbiAgICAvKiog5rW35oql5byA5YWzICovXG4gICAgb25Qb3N0VG9nZ2xlKCBlICkge1xuICAgICAgICBjb25zdCB2YWwgPSBlLmRldGFpbDtcbiAgICAgICAgdGhpcy5zZXREYXRhISh7XG4gICAgICAgICAgICBzaG93aW5nUG9zdGVyOiB2YWxcbiAgICAgICAgfSk7XG4gICAgICAgIHd4LnNldE5hdmlnYXRpb25CYXJUaXRsZSh7XG4gICAgICAgICAgICB0aXRsZTogdmFsID8gJ+WIhuS6q+WVhuWTgScgOiAn5ZWG5ZOB6K+m5oOFJ1xuICAgICAgICB9KTtcbiAgICB9LFxuXG4gICAgY3JlYXRlRm9ybUlkKCBmb3JtaWQgKSB7XG4gICAgICAgIGlmICggIWZvcm1pZCApIHsgcmV0dXJuOyB9XG4gICAgICAgIGh0dHAoe1xuICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgIGZvcm1pZFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGxvYWRpbmdNc2c6ICdub25lJyxcbiAgICAgICAgICAgIHVybDogJ2NvbW1vbl9jcmVhdGUtZm9ybWlkJyxcbiAgICAgICAgfSlcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICog55Sf5ZG95ZGo5pyf5Ye95pWwLS3nm5HlkKzpobXpnaLliqDovb1cbiAgICAgKi9cbiAgICBvbkxvYWQ6IGZ1bmN0aW9uIChvcHRpb25zKSB7XG5cbiAgICAgICAgY29uc3Qgc2NlbmUgPSBkZWNvZGVVUklDb21wb25lbnQoIG9wdGlvbnMhLnNjZW5lIHx8ICcnIClcbiAgICAgICAgXG4gICAgICAgIHRoaXMud2F0Y2hSb2xlKCApO1xuICAgICAgICB0aGlzLnJ1bkNvbXB1dGVkKCApO1xuXG4gICAgICAgIHRoaXMuY2hlY2tMaWtlKCApO1xuICAgICAgICAvLyBpZiAoICFvcHRpb25zIS50aWQgKSB7XG4gICAgICAgICAgICB0aGlzLmZldGNoTGFzdCggKTtcbiAgICAgICAgLy8gfVxuICAgICAgICBcbiAgICAgICAgaWYgKCAhb3B0aW9ucyEuaWQgJiYgIXNjZW5lICkgeyByZXR1cm47IH1cbiAgICAgICAgdGhpcy5zZXREYXRhISh7XG4gICAgICAgICAgICBpZDogb3B0aW9ucyEuaWQgfHwgc2NlbmUsXG4gICAgICAgIH0pO1xuXG4gICAgICAgIGlmICggISEob3B0aW9ucyBhcyBhbnkpLnRpZCApIHtcbiAgICAgICAgICAgIHRoaXMuc2V0RGF0YSEoe1xuICAgICAgICAgICAgICAgIHRpZDogb3B0aW9ucyEudGlkXG4gICAgICAgICAgICB9KVxuICAgICAgICB9XG4gICAgfSxcbiAgXG4gICAgLyoqXG4gICAgICog55Sf5ZG95ZGo5pyf5Ye95pWwLS3nm5HlkKzpobXpnaLliJ3mrKHmuLLmn5PlrozmiJBcbiAgICAgKi9cbiAgICBvblJlYWR5OiBmdW5jdGlvbiAoICkge1xuICAgICAgICBsZXQgY2lyY2xlQ291bnQgPSAwOyBcbiAgICAgICAgY29uc3QgdGhhdDogYW55ID0gdGhpcztcbiAgICAgICAgLy8g5b+D6Lez55qE5aSW5qGG5Yqo55S7IFxuICAgICAgICB0aGF0LmFuaW1hdGlvbk1pZGRsZUhlYWRlckl0ZW0gPSB3eC5jcmVhdGVBbmltYXRpb24oeyBcbiAgICAgICAgICAgIGR1cmF0aW9uOiA4MDAsIFxuICAgICAgICAgICAgdGltaW5nRnVuY3Rpb246ICdlYXNlJywgXG4gICAgICAgICAgICB0cmFuc2Zvcm1PcmlnaW46ICc1MCUgNTAlJyxcbiAgICAgICAgfSk7IFxuICAgICAgICBzZXRJbnRlcnZhbCggZnVuY3Rpb24oICkgeyBcbiAgICAgICAgICAgIGlmIChjaXJjbGVDb3VudCAlIDIgPT0gMCkgeyBcbiAgICAgICAgICAgICAgICB0aGF0LmFuaW1hdGlvbk1pZGRsZUhlYWRlckl0ZW0uc2NhbGUoIDEuMCApLnJvdGF0ZSggMTAgKS5zdGVwKCApOyBcbiAgICAgICAgICAgIH0gZWxzZSB7IFxuICAgICAgICAgICAgICAgIHRoYXQuYW5pbWF0aW9uTWlkZGxlSGVhZGVySXRlbS5zY2FsZSggMS4wICkucm90YXRlKCAtMzAgKS5zdGVwKCApOyBcbiAgICAgICAgICAgIH0gXG4gICAgICAgICAgICB0aGF0LnNldERhdGEoeyBcbiAgICAgICAgICAgICAgICBhbmltYXRpb25NaWRkbGVIZWFkZXJJdGVtOiB0aGF0LmFuaW1hdGlvbk1pZGRsZUhlYWRlckl0ZW0uZXhwb3J0KCApIFxuICAgICAgICAgICAgfSk7IFxuICAgICAgICAgICAgXG4gICAgICAgICAgICBpZiAoICsrY2lyY2xlQ291bnQgPT09IDEwMDAgKSB7IFxuICAgICAgICAgICAgICAgIGNpcmNsZUNvdW50ID0gMDsgXG4gICAgICAgICAgICB9IFxuICAgICAgICB9LmJpbmQoIHRoaXMgKSwgMTAwMCApOyBcbiAgICB9LFxuICBcbiAgICAvKipcbiAgICAgKiDnlJ/lkb3lkajmnJ/lh73mlbAtLeebkeWQrOmhtemdouaYvuekulxuICAgICAqL1xuICAgIG9uU2hvdzogZnVuY3Rpb24gKCApIHtcbiAgICAgICAgY29uc3QgeyBpZCwgdGlkIH0gPSB0aGlzLmRhdGE7XG5cbiAgICAgICAgdGhpcy5mZXREZXRhaWwoIGlkICk7XG4gICAgICAgIHRoaXMuZmV0Y2hTaG9wcGluZyggaWQsIHRpZCApO1xuICAgIH0sXG4gIFxuICAgIC8qKlxuICAgICAqIOeUn+WRveWRqOacn+WHveaVsC0t55uR5ZCs6aG16Z2i6ZqQ6JePXG4gICAgICovXG4gICAgb25IaWRlOiBmdW5jdGlvbiAoKSB7XG4gIFxuICAgIH0sXG4gIFxuICAgIC8qKlxuICAgICAqIOeUn+WRveWRqOacn+WHveaVsC0t55uR5ZCs6aG16Z2i5Y246L29XG4gICAgICovXG4gICAgb25VbmxvYWQ6IGZ1bmN0aW9uICgpIHtcbiAgXG4gICAgfSxcbiAgXG4gICAgLyoqXG4gICAgICog6aG16Z2i55u45YWz5LqL5Lu25aSE55CG5Ye95pWwLS3nm5HlkKznlKjmiLfkuIvmi4nliqjkvZxcbiAgICAgKi9cbiAgICBvblB1bGxEb3duUmVmcmVzaDogZnVuY3Rpb24gKCkge1xuICBcbiAgICB9LFxuICBcbiAgICAvKipcbiAgICAgKiDpobXpnaLkuIrmi4nop6blupXkuovku7bnmoTlpITnkIblh73mlbBcbiAgICAgKi9cbiAgICBvblJlYWNoQm90dG9tOiBmdW5jdGlvbiAoKSB7XG4gIFxuICAgIH0sXG4gIFxuICAgIC8qKlxuICAgICAqIOeUqOaIt+eCueWHu+WPs+S4iuinkuWIhuS6q1xuICAgICAqL1xuICAgIG9uU2hhcmVBcHBNZXNzYWdlOiBmdW5jdGlvbiAoICkge1xuICAgICAgICBjb25zdCB7IGRldGFpbCwgcGluJCwgYWN0aXZpdGllcywgcHJpY2VHYXAsIHRyaXAgfSA9IHRoaXMuZGF0YTtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHRpdGxlOiBgJHtwcmljZUdhcCAhPT0gJycgJiYgTnVtYmVyKCBwcmljZUdhcCApICE9PSAwID8gXG4gICAgICAgICAgICAgICAgICAgICAgICBhY3Rpdml0aWVzLmxlbmd0aCA9PT0gMCA/XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYOS4gOi1t+S5sO+8geS4gOi1t+ecgSR7U3RyaW5nKCBwcmljZUdhcCApLnJlcGxhY2UoL1xcLjAwL2csICcnKX3lhYPvvIFgIDpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAn6ZmQ5pe254m55Lu36LaF5a6e5oOg77yBJyA6IFxuICAgICAgICAgICAgICAgICAgICAgICAgdHJpcCAmJiB0cmlwLnJlZHVjZV9wcmljZSA/IFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGDnq4vlh48ke3RyaXAucmVkdWNlX3ByaWNlfeWFg++8gWAgOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICfnu5nkvaDnnIvnnIvov5nlrp3otJ3vvIEnXG4gICAgICAgICAgICAgICAgfSR7ZGV0YWlsLnRpdGxlfWAsXG4gICAgICAgICAgICBwYXRoOiBgL3BhZ2VzL2dvb2RzLWRldGFpbC9pbmRleD9pZD0ke2RldGFpbC5faWR9JnRpZD0ke3RoaXMuZGF0YS50aWR9YCxcbiAgICAgICAgICAgIGltYWdlVXJsOiBgJHtkZXRhaWwuaW1nWyAwIF19YFxuICAgICAgICB9XG4gICAgfVxuICB9KSJdfQ==