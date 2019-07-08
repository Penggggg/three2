"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var http_js_1 = require("../../util/http.js");
var index_js_1 = require("../../lib/vuefy/index.js");
var goods_js_1 = require("../../util/goods.js");
var route_js_1 = require("../../util/route.js");
var app = getApp();
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
        this.createFormId(e.detail.formId);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUNBLDhDQUEwQztBQUMxQyxxREFBb0Q7QUFDcEQsZ0RBQXFEO0FBQ3JELGdEQUE0QztBQUU1QyxJQUFNLEdBQUcsR0FBRyxNQUFNLEVBQUcsQ0FBQztBQUV0QixJQUFJLENBQUM7SUFHRCx5QkFBeUIsRUFBRSxJQUFJO0lBSy9CLElBQUksRUFBRTtRQUdGLEtBQUssRUFBRSxJQUFJO1FBR1gsR0FBRyxFQUFFLEVBQUU7UUFHUCxFQUFFLEVBQUUsRUFBRTtRQUdOLE1BQU0sRUFBRSxJQUFJO1FBR1osR0FBRyxFQUFFLEVBQUc7UUFHUixPQUFPLEVBQUUsSUFBSTtRQUdiLFdBQVcsRUFBRSxLQUFLO1FBR2xCLEtBQUssRUFBRSxLQUFLO1FBR1osV0FBVyxFQUFFO1lBQ1QsTUFBTSxFQUFFLE1BQU0sRUFBRSxNQUFNO1NBQ3pCO1FBR0QseUJBQXlCLEVBQUUsSUFBSTtRQUcvQixPQUFPLEVBQUUsS0FBSztRQUdkLGFBQWEsRUFBRSxLQUFLO1FBR3BCLFFBQVEsRUFBRSxNQUFNO1FBR2hCLEdBQUcsRUFBRSxFQUFHO1FBR1IsUUFBUSxFQUFFLEVBQUc7UUFHYixVQUFVLEVBQUUsRUFBRztRQUdmLFNBQVMsRUFBRSxFQUFHO1FBR2QsSUFBSSxFQUFFLElBQUk7S0FDYjtJQUdELFdBQVc7UUFDUCxtQkFBUSxDQUFFLElBQUksRUFBRTtZQUdaLEtBQUssRUFBRTtnQkFDSyxJQUFBLHlCQUFNLENBQWU7Z0JBQzdCLElBQU0sTUFBTSxHQUFHLHlCQUFjLENBQUUsTUFBTSxDQUFFLENBQUM7Z0JBQ3hDLE9BQU8sTUFBTSxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUM7WUFDdkMsQ0FBQztZQUdELFdBQVcsRUFBRTtnQkFDRCxJQUFBLHlCQUFNLENBQWU7Z0JBQzdCLElBQUssQ0FBQyxNQUFNLElBQUksQ0FBRSxDQUFDLENBQUMsTUFBTSxJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBRSxFQUFFO29CQUM1QyxPQUFPLEVBQUcsQ0FBQztpQkFDZDtxQkFBTTtvQkFDSCxPQUFPLE1BQU0sQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLE1BQU0sQ0FBRSxVQUFBLENBQUMsSUFBSSxPQUFBLENBQUMsQ0FBQyxDQUFDLEVBQUgsQ0FBRyxDQUFFLENBQUM7aUJBQ3ZEO1lBQ0wsQ0FBQztZQUdELFFBQVEsRUFBRTtnQkFDRSxJQUFBLHlCQUFNLENBQWU7Z0JBQzdCLElBQUssQ0FBQyxNQUFNLEVBQUc7b0JBQ1gsT0FBTyxFQUFFLENBQUE7aUJBQ1o7cUJBQU07b0JBQ0gsSUFBTSxNQUFNLEdBQUcseUJBQWMsQ0FBRSxNQUFNLENBQUUsQ0FBQztvQkFDeEMsT0FBTyxNQUFNLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBRSxNQUFNLENBQUMsUUFBUSxDQUFDLGNBQWMsQ0FBRSxDQUFDLE9BQU8sQ0FBQyxPQUFPLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQztpQkFDdEY7WUFDTCxDQUFDO1lBR0QsSUFBSSxFQUFFO2dCQUNGLElBQUksSUFBSSxHQUFRLEVBQUcsQ0FBQztnQkFDZCxJQUFBLGNBQTRDLEVBQTFDLGtCQUFNLEVBQUUsc0JBQVEsRUFBRSwwQkFBd0IsQ0FBQztnQkFFbkQsSUFBSyxDQUFDLE1BQU0sRUFBRztvQkFDWCxPQUFPLEVBQUcsQ0FBQztpQkFDZDtnQkFFTyxJQUFBLDRCQUFTLEVBQUUsOEJBQVUsQ0FBWTtnQkFFekMsSUFBSyxTQUFTLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRztvQkFDeEIsSUFBSSxHQUFHLFNBQVM7eUJBQ1gsTUFBTSxDQUFFLFVBQUEsQ0FBQyxJQUFJLE9BQUEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxVQUFVLEVBQWQsQ0FBYyxDQUFFO3lCQUM3QixHQUFHLENBQUUsVUFBQSxDQUFDO3dCQUNILE9BQU8sTUFBTSxDQUFDLE1BQU0sQ0FBQyxFQUFHLEVBQUUsQ0FBQyxFQUFFOzRCQUN6QixHQUFHLEVBQUUsQ0FBQyxDQUFDLEdBQUc7NEJBQ1YsTUFBTSxFQUFFLENBQUMsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFFLFVBQUEsQ0FBQyxJQUFJLE9BQUEsQ0FBQyxDQUFDLEdBQUcsS0FBSyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxHQUFHLEtBQUssQ0FBQyxDQUFDLEdBQUcsRUFBbEMsQ0FBa0MsQ0FBRTt5QkFDckUsQ0FBQyxDQUFBO29CQUNOLENBQUMsQ0FBQyxDQUFDO2lCQUVWO3FCQUFNLElBQUssQ0FBQyxDQUFDLFVBQVUsRUFBRztvQkFDZixJQUFBLG9CQUFLLEVBQUUsb0JBQUssRUFBRSxnQkFBRyxFQUFFLGtCQUFHLENBQVk7b0JBQzFDLElBQUksR0FBRyxDQUFDOzRCQUNKLEtBQUssT0FBQTs0QkFDTCxHQUFHLEVBQUUsS0FBRzs0QkFDUixJQUFJLEVBQUUsS0FBSzs0QkFDWCxVQUFVLFlBQUE7NEJBQ1YsR0FBRyxFQUFFLFNBQVM7NEJBQ2QsR0FBRyxFQUFFLEdBQUcsQ0FBRSxDQUFDLENBQUU7NEJBQ2IsTUFBTSxFQUFFLENBQUMsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFFLFVBQUEsQ0FBQyxJQUFJLE9BQUEsQ0FBQyxDQUFDLEdBQUcsS0FBSyxLQUFHLEVBQWIsQ0FBYSxDQUFFO3lCQUNoRCxDQUFDLENBQUM7aUJBQ047Z0JBR0QsVUFBVSxDQUFDLEdBQUcsQ0FBRSxVQUFBLEVBQUU7b0JBQ2QsSUFBSyxDQUFDLEVBQUUsQ0FBQyxhQUFhLEVBQUc7d0JBQUUsT0FBTztxQkFBRTtvQkFDcEMsSUFBTSxTQUFTLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBRSxVQUFBLENBQUMsSUFBSSxPQUFBLENBQUMsQ0FBQyxHQUFHLEtBQUssRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsR0FBRyxLQUFLLEVBQUUsQ0FBQyxHQUFHLEVBQXBDLENBQW9DLENBQUUsQ0FBQztvQkFDekUsSUFBTSxjQUFjLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBRSxVQUFBLENBQUMsSUFBSSxPQUFBLENBQUMsQ0FBQyxHQUFHLEtBQUssRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsR0FBRyxLQUFLLEVBQUUsQ0FBQyxHQUFHLEVBQXBDLENBQW9DLENBQUUsQ0FBQztvQkFHbkYsSUFBSyxjQUFjLEtBQUssQ0FBQyxDQUFDLEVBQUc7d0JBQ3pCLElBQUksQ0FBQyxNQUFNLENBQUUsY0FBYyxFQUFFLENBQUMsRUFBRSxNQUFNLENBQUMsTUFBTSxDQUFDLEVBQUcsRUFBRSxTQUFTLEVBQUU7NEJBQzFELEtBQUssRUFBRSxFQUFFLENBQUMsUUFBUTs0QkFDbEIsVUFBVSxFQUFFLEVBQUUsQ0FBQyxhQUFhO3lCQUMvQixDQUFDLENBQUMsQ0FBQztxQkFHUDt5QkFBTTt3QkFDSCxJQUFJLENBQUMsSUFBSSxDQUFDOzRCQUNOLEdBQUcsRUFBRSxFQUFFLENBQUMsR0FBRzs0QkFDWCxHQUFHLEVBQUUsRUFBRSxDQUFDLEdBQUc7NEJBQ1gsR0FBRyxFQUFFLEVBQUUsQ0FBQyxHQUFHOzRCQUNYLElBQUksRUFBRSxFQUFFLENBQUMsS0FBSzs0QkFDZCxNQUFNLEVBQUUsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUUsVUFBQSxDQUFDLElBQUksT0FBQSxDQUFDLENBQUMsR0FBRyxLQUFLLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLEdBQUcsS0FBSyxFQUFFLENBQUMsR0FBRyxFQUFwQyxDQUFvQyxDQUFFOzRCQUNwRSxLQUFLLEVBQUUsRUFBRSxDQUFDLFFBQVE7NEJBQ2xCLFVBQVUsRUFBRSxFQUFFLENBQUMsYUFBYTt5QkFDL0IsQ0FBQyxDQUFBO3FCQUNMO2dCQUNMLENBQUMsQ0FBQyxDQUFDO2dCQUVILElBQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUUsVUFBQSxDQUFDLElBQUksT0FBQSxNQUFNLENBQUMsTUFBTSxDQUFDLEVBQUcsRUFBRSxDQUFDLEVBQUU7b0JBQy9DLEtBQUssRUFBRSxNQUFNLENBQUUsQ0FBQyxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUMsVUFBVSxDQUFFLENBQUMsT0FBTyxDQUFFLENBQUMsQ0FBRTtpQkFDdkQsQ0FBQyxFQUYyQixDQUUzQixDQUFDLENBQUM7Z0JBQ0osT0FBTyxLQUFLLENBQUM7WUFDakIsQ0FBQztZQUdELFNBQVMsRUFBRTtnQkFDRCxJQUFBLGNBQWdDLEVBQTlCLGtCQUFNLEVBQUUsc0JBQXNCLENBQUM7Z0JBQ3ZDLElBQUssQ0FBQyxNQUFNLEVBQUc7b0JBQ1gsT0FBTyxDQUFDLENBQUM7aUJBQ1o7Z0JBRU8sSUFBQSw0QkFBUyxFQUFFLDhCQUFVLENBQVk7Z0JBRXpDLElBQUssQ0FBQyxDQUFDLFNBQVMsSUFBSSxTQUFTLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRztvQkFDdkMsT0FBTyxTQUFTO3lCQUNYLE1BQU0sQ0FBRSxVQUFBLENBQUMsSUFBSSxPQUFBLENBQUMsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFFLFVBQUEsQ0FBQyxJQUFJLE9BQUEsQ0FBQyxDQUFDLEdBQUcsS0FBSyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxHQUFHLEtBQUssQ0FBQyxDQUFDLEdBQUcsRUFBbEMsQ0FBa0MsQ0FBRSxFQUExRCxDQUEwRCxDQUFDO3lCQUN4RSxNQUFNLENBQUM7aUJBRWY7cUJBQU0sSUFBSyxDQUFDLENBQUMsVUFBVSxFQUFHO29CQUNmLElBQUEsa0JBQUcsQ0FBWTtvQkFDdkIsT0FBTyxDQUFDLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBRSxVQUFBLENBQUMsSUFBSSxPQUFBLENBQUMsQ0FBQyxHQUFHLEtBQUssS0FBRyxFQUFiLENBQWEsQ0FBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQTtpQkFDdkQ7Z0JBRUQsT0FBTyxDQUFDLENBQUM7WUFDYixDQUFDO1lBR0QsWUFBWSxFQUFFO2dCQUNGLElBQUEseUJBQU0sQ0FBZTtnQkFDN0IsSUFBSyxDQUFDLE1BQU0sRUFBRztvQkFDWCxPQUFPLEtBQUssQ0FBQztpQkFDaEI7Z0JBQ08sSUFBQSw0QkFBUyxDQUFZO2dCQUM3QixPQUFPLENBQUMsQ0FBQyxTQUFTLElBQUksU0FBUyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUU7WUFDaEQsQ0FBQztTQUVKLENBQUMsQ0FBQTtJQUNOLENBQUM7SUFHRCxTQUFTLFlBQUUsRUFBRTtRQUFiLGlCQW9EQztRQW5EVyxJQUFBLHlCQUFNLENBQWU7UUFDN0IsSUFBSyxNQUFNLEVBQUc7WUFBRSxPQUFPO1NBQUU7UUFDekIsY0FBSSxDQUFDO1lBQ0QsSUFBSSxFQUFFO2dCQUNGLEdBQUcsRUFBRSxFQUFFO2FBQ1Y7WUFDRCxNQUFNLEVBQUUsWUFBWTtZQUNwQixHQUFHLEVBQUUsYUFBYTtZQUNsQixPQUFPLEVBQUUsVUFBQSxHQUFHO2dCQUNWLElBQUssR0FBRyxDQUFDLE1BQU0sS0FBSyxHQUFHLEVBQUc7b0JBQUUsT0FBTztpQkFBRTtnQkFFbkMsSUFBSSxHQUFHLEdBQVEsRUFBRyxDQUFDO2dCQUNiLElBQUEsYUFBZ0QsRUFBOUMsd0JBQVMsRUFBRSwwQkFBVSxFQUFFLDBCQUF1QixDQUFDO2dCQUV2RCxJQUFLLFNBQVMsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFHO29CQUN4QixHQUFHLEdBQUcsU0FBUyxDQUFDLE1BQU0sQ0FBRSxVQUFBLENBQUMsSUFBSSxPQUFBLENBQUMsQ0FBQyxDQUFDLENBQUMsVUFBVSxFQUFkLENBQWMsQ0FBRSxDQUFDO2lCQUVqRDtxQkFBTSxJQUFLLENBQUMsQ0FBQyxVQUFVLEVBQUc7b0JBQ2pCLElBQUEsYUFBaUMsRUFBL0IsZ0JBQUssRUFBRSxnQkFBSyxFQUFFLFlBQWlCLENBQUM7b0JBQ3hDLEdBQUcsR0FBRyxDQUFDOzRCQUNILEtBQUssT0FBQTs0QkFDTCxJQUFJLEVBQUUsS0FBSzs0QkFDWCxVQUFVLFlBQUE7NEJBQ1YsR0FBRyxFQUFFLEdBQUcsQ0FBRSxDQUFDLENBQUU7eUJBQ2hCLENBQUMsQ0FBQztpQkFDTjtnQkFFRCxJQUFNLFdBQVcsR0FBRyxVQUFVLENBQUMsR0FBRyxDQUFFLFVBQUEsQ0FBQztvQkFFakMsSUFBSSxHQUFHLEdBQUcsRUFBRSxDQUFDO29CQUNiLElBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUc7d0JBQ1gsR0FBRyxHQUFHLFNBQVMsQ0FBQyxJQUFJLENBQUUsVUFBQSxDQUFDLElBQUksT0FBQSxDQUFDLENBQUMsR0FBRyxLQUFLLENBQUMsQ0FBQyxHQUFHLEVBQWYsQ0FBZSxDQUFFLENBQUMsR0FBRyxDQUFBO3FCQUNuRDt5QkFBTTt3QkFDSCxHQUFHLEdBQUcsR0FBRyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUUsQ0FBQyxDQUFFLENBQUM7cUJBQzNCO29CQUVELE9BQU8sTUFBTSxDQUFDLE1BQU0sQ0FBQyxFQUFHLEVBQUUsQ0FBQyxFQUFFO3dCQUN6QixHQUFHLEtBQUE7d0JBQ0gsU0FBUyxFQUFFLENBQUUsQ0FBQyxDQUFDLE9BQU8sR0FBRyxJQUFJLElBQUksRUFBRyxDQUFDLE9BQU8sRUFBRyxDQUFDLEdBQUcsQ0FBRSxJQUFJLENBQUU7cUJBQzlELENBQUMsQ0FBQztnQkFFUCxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUUsVUFBQSxDQUFDLElBQUksT0FBQSxDQUFDLENBQUMsT0FBTyxHQUFHLElBQUksSUFBSSxFQUFHLENBQUMsT0FBTyxFQUFHLEVBQWxDLENBQWtDLENBQUMsQ0FBQztnQkFFcEQsS0FBSSxDQUFDLE9BQVEsQ0FBQztvQkFDVixHQUFHLEtBQUE7b0JBQ0gsT0FBTyxFQUFFLEtBQUs7b0JBQ2QsTUFBTSxFQUFFLEdBQUcsQ0FBQyxJQUFJO29CQUNoQixVQUFVLEVBQUUsV0FBVztpQkFDMUIsQ0FBQyxDQUFDO1lBQ1AsQ0FBQztTQUNKLENBQUMsQ0FBQztJQUNQLENBQUM7SUFHRCxhQUFhLFlBQUUsR0FBRyxFQUFFLEdBQUc7UUFBdkIsaUJBdUJDO1FBckJHLElBQUssQ0FBQyxHQUFHLElBQUksQ0FBQyxHQUFHLEVBQUc7WUFBRSxPQUFPO1NBQUU7UUFFL0IsY0FBSSxDQUFDO1lBQ0QsR0FBRyxFQUFFLG1CQUFtQjtZQUN4QixJQUFJLEVBQUU7Z0JBQ0YsR0FBRyxLQUFBO2dCQUNILEdBQUcsS0FBQTtnQkFDSCxNQUFNLEVBQUUsS0FBSzthQUNoQjtZQUNELE9BQU8sRUFBRSxVQUFBLEdBQUc7Z0JBQ0EsSUFBQSxtQkFBTSxFQUFFLGVBQUksQ0FBUztnQkFDN0IsSUFBSyxNQUFNLEtBQUssR0FBRyxFQUFHO29CQUFFLE9BQU87aUJBQUU7Z0JBQ2pDLEtBQUksQ0FBQyxPQUFRLENBQUM7b0JBQ1YsUUFBUSxFQUFFLElBQUk7b0JBQ2QsU0FBUyxFQUFFLElBQUksQ0FBQyxHQUFHLENBQUUsVUFBQSxDQUFDLElBQUksT0FBQSxDQUFDO3dCQUN2QixHQUFHLEVBQUUsQ0FBQyxDQUFDLEdBQUc7d0JBQ1YsR0FBRyxFQUFFLENBQUMsQ0FBQyxHQUFHO3FCQUNiLENBQUMsRUFId0IsQ0FHeEIsQ0FBQztpQkFDTixDQUFDLENBQUM7WUFDUCxDQUFDO1NBQ0osQ0FBQyxDQUFBO0lBQ04sQ0FBQztJQUdELFNBQVM7UUFBVCxpQkFzQkM7UUFyQlcsSUFBQSxpQkFBRSxDQUFlO1FBQ3pCLGNBQUksQ0FBQztZQUNELElBQUksRUFBRSxFQUFHO1lBQ1QsR0FBRyxFQUFFLFlBQVk7WUFDakIsT0FBTyxFQUFFLFVBQUEsR0FBRztnQkFDQSxJQUFBLG1CQUFNLEVBQUUsZUFBSSxDQUFTO2dCQUM3QixJQUFLLE1BQU0sS0FBSyxHQUFHLEVBQUc7b0JBQUUsT0FBTztpQkFBRTtnQkFFakMsSUFBSyxDQUFDLENBQUMsSUFBSSxDQUFFLENBQUMsQ0FBRSxFQUFFO29CQUNkLElBQU0sR0FBRyxHQUFHLElBQUksQ0FBRSxDQUFDLENBQUUsQ0FBQyxHQUFHLENBQUE7b0JBRXpCLElBQUssQ0FBQyxLQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRzt3QkFDbEIsS0FBSSxDQUFDLGFBQWEsQ0FBRSxFQUFFLEVBQUUsR0FBRyxDQUFFLENBQUM7cUJBQ2pDO29CQUNELEtBQUksQ0FBQyxPQUFRLENBQUM7d0JBQ1YsR0FBRyxFQUFFLElBQUksQ0FBRSxDQUFDLENBQUUsQ0FBQyxHQUFHO3dCQUNsQixJQUFJLEVBQUUsSUFBSSxDQUFFLENBQUMsQ0FBRTtxQkFDbEIsQ0FBQyxDQUFDO2lCQUNOO1lBQ0wsQ0FBQztTQUNKLENBQUMsQ0FBQTtJQUNOLENBQUM7SUFHRCxVQUFVLFlBQUUsQ0FBQztRQUNELElBQUEsNkJBQVEsQ0FBZTtRQUMvQixJQUFJLENBQUMsT0FBUSxDQUFDO1lBQ1YsUUFBUSxFQUFFLFFBQVEsS0FBSyxNQUFNLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsTUFBTTtTQUNsRCxDQUFDLENBQUM7UUFDSCxJQUFJLENBQUMsWUFBWSxDQUFFLENBQUMsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFFLENBQUM7SUFDekMsQ0FBQztJQUdELFNBQVM7UUFDTCxnQkFBSyxDQUFDLDBDQUF3QyxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUksQ0FBQyxDQUFBO0lBQ2pFLENBQUM7SUFHRCxTQUFTO1FBQVQsaUJBV0M7UUFWSSxHQUFXLENBQUMsTUFBTSxDQUFDLE1BQU0sRUFBRSxVQUFFLEdBQUc7WUFDN0IsS0FBSSxDQUFDLE9BQVEsQ0FBQztnQkFDVixPQUFPLEVBQUUsQ0FBRSxHQUFHLEtBQUssQ0FBQyxDQUFFO2FBQ3pCLENBQUMsQ0FBQTtRQUNOLENBQUMsQ0FBQyxDQUFDO1FBQ0YsR0FBVyxDQUFDLE1BQU0sQ0FBQyxPQUFPLEVBQUUsVUFBQSxHQUFHO1lBQzVCLEtBQUksQ0FBQyxPQUFRLENBQUM7Z0JBQ1YsS0FBSyxFQUFFLEdBQUc7YUFDYixDQUFDLENBQUM7UUFDUCxDQUFDLENBQUMsQ0FBQztJQUNQLENBQUM7SUFHRCxVQUFVLFlBQUMsRUFBaUI7WUFBZixnQ0FBYTtRQUNkLElBQUEsK0JBQUcsQ0FBMkI7UUFDdEMsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLElBQUksRUFBRSxDQUFDLFlBQVksQ0FBQztZQUNoQyxPQUFPLEVBQUUsR0FBRztZQUNaLElBQUksRUFBUSxJQUFJLENBQUMsSUFBWSxDQUFDLE1BQU0sQ0FBQyxHQUFHLFFBQUU7U0FDN0MsQ0FBQyxDQUFDO0lBQ1AsQ0FBQztJQUdELGdCQUFnQixZQUFDLEVBQWlCO1lBQWYsZ0NBQWE7UUFFNUIsSUFBTSxHQUFHLEdBQUcsYUFBYSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUNwQyxhQUFhLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUEsQ0FBQztZQUMvQixhQUFhLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQztRQUU5QixJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sSUFBSSxFQUFFLENBQUMsWUFBWSxDQUFDO1lBQ2hDLE9BQU8sRUFBRSxHQUFHO1lBQ1osSUFBSSxFQUFFLENBQUUsR0FBRyxDQUFFO1NBQ2hCLENBQUMsQ0FBQztJQUNQLENBQUM7SUFHRCxNQUFNO1FBQU4saUJBZ0JDO1FBZkcsSUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDO1FBQ2xCLElBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFdBQVcsRUFBRztZQUFFLE9BQU87U0FBRTtRQUN6QyxjQUFJLENBQUM7WUFDRCxJQUFJLEVBQUU7Z0JBQ0YsR0FBRyxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRTthQUNwQjtZQUNELEdBQUcsRUFBRSxhQUFhO1lBQ2xCLE9BQU8sRUFBRyxVQUFFLEdBQVE7Z0JBQ2hCLElBQUssR0FBRyxDQUFDLE1BQU0sS0FBSyxHQUFHLEVBQUc7b0JBQ3RCLEtBQUksQ0FBQyxPQUFRLENBQUM7d0JBQ1YsS0FBSyxFQUFFLENBQUMsS0FBSSxDQUFDLElBQUksQ0FBQyxLQUFLO3FCQUMxQixDQUFDLENBQUE7aUJBQ0w7WUFDTCxDQUFDO1NBQ0osQ0FBQyxDQUFDO0lBQ1AsQ0FBQztJQUdELFNBQVM7UUFBVCxpQkFnQkM7UUFmRyxJQUFNLElBQUksR0FBRyxJQUFJLENBQUM7UUFDbEIsY0FBSSxDQUFDO1lBQ0QsSUFBSSxFQUFFO2dCQUNGLEdBQUcsRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUU7YUFDcEI7WUFDRCxHQUFHLEVBQUUsWUFBWTtZQUNqQixPQUFPLEVBQUcsVUFBRSxHQUFRO2dCQUNoQixJQUFLLEdBQUcsQ0FBQyxNQUFNLEtBQUssR0FBRyxFQUFHO29CQUN0QixLQUFJLENBQUMsT0FBUSxDQUFDO3dCQUNWLEtBQUssRUFBRSxHQUFHLENBQUMsSUFBSTt3QkFDZixXQUFXLEVBQUUsSUFBSTtxQkFDcEIsQ0FBQyxDQUFBO2lCQUNMO1lBQ0wsQ0FBQztTQUNKLENBQUMsQ0FBQztJQUNQLENBQUM7SUFHRCxZQUFZLFlBQUUsQ0FBQztRQUNYLElBQU0sR0FBRyxHQUFHLENBQUMsQ0FBQyxNQUFNLENBQUM7UUFDckIsSUFBSSxDQUFDLE9BQVEsQ0FBQztZQUNWLGFBQWEsRUFBRSxHQUFHO1NBQ3JCLENBQUMsQ0FBQztRQUNILEVBQUUsQ0FBQyxxQkFBcUIsQ0FBQztZQUNyQixLQUFLLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLE1BQU07U0FDL0IsQ0FBQyxDQUFDO0lBQ1AsQ0FBQztJQUVELFlBQVksWUFBRSxNQUFNO1FBQ2hCLElBQUssQ0FBQyxNQUFNLEVBQUc7WUFBRSxPQUFPO1NBQUU7UUFDMUIsY0FBSSxDQUFDO1lBQ0QsSUFBSSxFQUFFO2dCQUNGLE1BQU0sUUFBQTthQUNUO1lBQ0QsVUFBVSxFQUFFLE1BQU07WUFDbEIsR0FBRyxFQUFFLHNCQUFzQjtTQUM5QixDQUFDLENBQUE7SUFDTixDQUFDO0lBS0QsTUFBTSxFQUFFLFVBQVUsT0FBTztRQUVyQixJQUFNLEtBQUssR0FBRyxrQkFBa0IsQ0FBRSxPQUFRLENBQUMsS0FBSyxJQUFJLEVBQUUsQ0FBRSxDQUFBO1FBRXhELElBQUksQ0FBQyxTQUFTLEVBQUcsQ0FBQztRQUNsQixJQUFJLENBQUMsV0FBVyxFQUFHLENBQUM7UUFFcEIsSUFBSSxDQUFDLFNBQVMsRUFBRyxDQUFDO1FBRWQsSUFBSSxDQUFDLFNBQVMsRUFBRyxDQUFDO1FBR3RCLElBQUssQ0FBQyxPQUFRLENBQUMsRUFBRSxJQUFJLENBQUMsS0FBSyxFQUFHO1lBQUUsT0FBTztTQUFFO1FBQ3pDLElBQUksQ0FBQyxPQUFRLENBQUM7WUFDVixFQUFFLEVBQUUsT0FBUSxDQUFDLEVBQUUsSUFBSSxLQUFLO1NBQzNCLENBQUMsQ0FBQztRQUVILElBQUssQ0FBQyxDQUFFLE9BQWUsQ0FBQyxHQUFHLEVBQUc7WUFDMUIsSUFBSSxDQUFDLE9BQVEsQ0FBQztnQkFDVixHQUFHLEVBQUUsT0FBUSxDQUFDLEdBQUc7YUFDcEIsQ0FBQyxDQUFBO1NBQ0w7SUFDTCxDQUFDO0lBS0QsT0FBTyxFQUFFO1FBQ0wsSUFBSSxXQUFXLEdBQUcsQ0FBQyxDQUFDO1FBQ3BCLElBQU0sSUFBSSxHQUFRLElBQUksQ0FBQztRQUV2QixJQUFJLENBQUMseUJBQXlCLEdBQUcsRUFBRSxDQUFDLGVBQWUsQ0FBQztZQUNoRCxRQUFRLEVBQUUsR0FBRztZQUNiLGNBQWMsRUFBRSxNQUFNO1lBQ3RCLGVBQWUsRUFBRSxTQUFTO1NBQzdCLENBQUMsQ0FBQztRQUNILFdBQVcsQ0FBRTtZQUNULElBQUksV0FBVyxHQUFHLENBQUMsSUFBSSxDQUFDLEVBQUU7Z0JBQ3RCLElBQUksQ0FBQyx5QkFBeUIsQ0FBQyxLQUFLLENBQUUsR0FBRyxDQUFFLENBQUMsTUFBTSxDQUFFLEVBQUUsQ0FBRSxDQUFDLElBQUksRUFBRyxDQUFDO2FBQ3BFO2lCQUFNO2dCQUNILElBQUksQ0FBQyx5QkFBeUIsQ0FBQyxLQUFLLENBQUUsR0FBRyxDQUFFLENBQUMsTUFBTSxDQUFFLENBQUMsRUFBRSxDQUFFLENBQUMsSUFBSSxFQUFHLENBQUM7YUFDckU7WUFDRCxJQUFJLENBQUMsT0FBTyxDQUFDO2dCQUNULHlCQUF5QixFQUFFLElBQUksQ0FBQyx5QkFBeUIsQ0FBQyxNQUFNLEVBQUc7YUFDdEUsQ0FBQyxDQUFDO1lBRUgsSUFBSyxFQUFFLFdBQVcsS0FBSyxJQUFJLEVBQUc7Z0JBQzFCLFdBQVcsR0FBRyxDQUFDLENBQUM7YUFDbkI7UUFDTCxDQUFDLENBQUMsSUFBSSxDQUFFLElBQUksQ0FBRSxFQUFFLElBQUksQ0FBRSxDQUFDO0lBQzNCLENBQUM7SUFLRCxNQUFNLEVBQUU7UUFDRSxJQUFBLGNBQXVCLEVBQXJCLFVBQUUsRUFBRSxZQUFpQixDQUFDO1FBRTlCLElBQUksQ0FBQyxTQUFTLENBQUUsRUFBRSxDQUFFLENBQUM7UUFDckIsSUFBSSxDQUFDLGFBQWEsQ0FBRSxFQUFFLEVBQUUsR0FBRyxDQUFFLENBQUM7SUFDbEMsQ0FBQztJQUtELE1BQU0sRUFBRTtJQUVSLENBQUM7SUFLRCxRQUFRLEVBQUU7SUFFVixDQUFDO0lBS0QsaUJBQWlCLEVBQUU7SUFFbkIsQ0FBQztJQUtELGFBQWEsRUFBRTtJQUVmLENBQUM7SUFLRCxpQkFBaUIsRUFBRTtRQUNULElBQUEsY0FBd0QsRUFBdEQsa0JBQU0sRUFBRSxjQUFJLEVBQUUsMEJBQVUsRUFBRSxzQkFBUSxFQUFFLGNBQWtCLENBQUM7UUFDL0QsT0FBTztZQUNILEtBQUssRUFBRSxNQUFHLFFBQVEsS0FBSyxFQUFFLElBQUksTUFBTSxDQUFFLFFBQVEsQ0FBRSxLQUFLLENBQUMsQ0FBQyxDQUFDO2dCQUMzQyxVQUFVLENBQUMsTUFBTSxLQUFLLENBQUMsQ0FBQyxDQUFDO29CQUNyQiwrQ0FBVSxNQUFNLENBQUUsUUFBUSxDQUFFLENBQUMsT0FBTyxDQUFDLE9BQU8sRUFBRSxFQUFFLENBQUMsaUJBQUksQ0FBQyxDQUFDO29CQUN2RCxVQUFVLENBQUMsQ0FBQztnQkFDaEIsSUFBSSxJQUFJLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQztvQkFDdkIsaUJBQUssSUFBSSxDQUFDLFlBQVksaUJBQUksQ0FBQyxDQUFDO29CQUM1QixVQUFVLElBQ25CLE1BQU0sQ0FBQyxLQUFPO1lBQ3JCLElBQUksRUFBRSxrQ0FBZ0MsTUFBTSxDQUFDLEdBQUcsYUFBUSxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUs7WUFDdkUsUUFBUSxFQUFFLEtBQUcsTUFBTSxDQUFDLEdBQUcsQ0FBRSxDQUFDLENBQUk7U0FDakMsQ0FBQTtJQUNMLENBQUM7Q0FDRixDQUFDLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJcbmltcG9ydCB7IGh0dHAgfSBmcm9tICcuLi8uLi91dGlsL2h0dHAuanMnO1xuaW1wb3J0IHsgY29tcHV0ZWQgfSBmcm9tICcuLi8uLi9saWIvdnVlZnkvaW5kZXguanMnO1xuaW1wb3J0IHsgZGVsYXllcmluZ0dvb2QgfSBmcm9tICcuLi8uLi91dGlsL2dvb2RzLmpzJztcbmltcG9ydCB7IG5hdlRvIH0gZnJvbSAnLi4vLi4vdXRpbC9yb3V0ZS5qcyc7XG5cbmNvbnN0IGFwcCA9IGdldEFwcCggKTtcblxuUGFnZSh7XG5cbiAgICAvLyDliqjnlLtcbiAgICBhbmltYXRpb25NaWRkbGVIZWFkZXJJdGVtOiBudWxsLFxuXG4gICAgLyoqXG4gICAgICog6aG16Z2i55qE5Yid5aeL5pWw5o2uXG4gICAgICovXG4gICAgZGF0YToge1xuXG4gICAgICAgIC8vIOaYr+WQpuS4uuaWsOWuolxuICAgICAgICBpc05ldzogdHJ1ZSxcblxuICAgICAgICAvLyDooYznqItcbiAgICAgICAgdGlkOiAnJyxcblxuICAgICAgICAvLyDllYblk4FpZFxuICAgICAgICBpZDogJycsXG5cbiAgICAgICAgLy8g5ZWG5ZOB6K+m5oOFXG4gICAgICAgIGRldGFpbDogbnVsbCxcbiAgICAgICAgXG4gICAgICAgIC8vIOaVsOaNruWtl+WFuFxuICAgICAgICBkaWM6IHsgfSxcbiAgICAgICAgXG4gICAgICAgIC8vIOWKoOi9veeKtuaAgVxuICAgICAgICBsb2FkaW5nOiB0cnVlLFxuXG4gICAgICAgIC8vIOaYr+WQpuWIneWni+WMlui/h+KAnOWWnOasouKAnVxuICAgICAgICBoYXNJbml0TGlrZTogZmFsc2UsXG5cbiAgICAgICAgLy8g5piv5ZCm4oCc5Zac5qyi4oCdXG4gICAgICAgIGxpa2VkOiBmYWxzZSxcblxuICAgICAgICAvLyDmloflrZfkv53or4Hmj5DnpLpcbiAgICAgICAgcHJvbWlzZVRpcHM6IFtcbiAgICAgICAgICAgICfmraPlk4Hkv53or4EnLCAn5Lu35qC85LyY5Yq/JywgJ+ecn+S6uui3keiFvydcbiAgICAgICAgXSxcblxuICAgICAgICAvLyDliqjnlLtcbiAgICAgICAgYW5pbWF0aW9uTWlkZGxlSGVhZGVySXRlbTogbnVsbCxcblxuICAgICAgICAvLyDlsZXnpLrnrqHnkIblhaXlj6NcbiAgICAgICAgc2hvd0J0bjogZmFsc2UsXG5cbiAgICAgICAgLy8g5q2j5Zyo5bGV56S65rW35oqlXG4gICAgICAgIHNob3dpbmdQb3N0ZXI6IGZhbHNlLFxuXG4gICAgICAgIC8vIOWxleekuuW8ueahhlxuICAgICAgICBzaG93VGlwczogJ2hpZGUnLFxuXG4gICAgICAgIC8vIOaLvOWbouWIl+ihqFxuICAgICAgICBwaW46IFsgXSxcblxuICAgICAgICAvLyDllYblk4HlnKjmnKzooYznqIvnmoTotK3nianmuIXljZXliJfooahcbiAgICAgICAgc2hvcHBpbmc6IFsgXSxcblxuICAgICAgICAvLyDkuIDlj6Pku7fmtLvliqjliJfooahcbiAgICAgICAgYWN0aXZpdGllczogWyBdLFxuXG4gICAgICAgIC8vIOacrOi2n+iDveWkn+aLvOWboueahHNrdVxuICAgICAgICBjYW5QaW5Ta3U6IFsgXSxcblxuICAgICAgICAvLyDlvZPliY3nmoTooYznqItcbiAgICAgICAgdHJpcDogbnVsbFxuICAgIH0sXG5cbiAgICAvKiog6K6+572uY29tcHV0ZWQgKi9cbiAgICBydW5Db21wdXRlZCggKSB7XG4gICAgICAgIGNvbXB1dGVkKCB0aGlzLCB7XG5cbiAgICAgICAgICAgIC8vIOiuoeeul+S7t+agvFxuICAgICAgICAgICAgcHJpY2U6IGZ1bmN0aW9uKCApIHtcbiAgICAgICAgICAgICAgICBjb25zdCB7IGRldGFpbCB9ID0gdGhpcy5kYXRhO1xuICAgICAgICAgICAgICAgIGNvbnN0IHJlc3VsdCA9IGRlbGF5ZXJpbmdHb29kKCBkZXRhaWwgKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVzdWx0ID8gcmVzdWx0LnByaWNlJCA6ICcnO1xuICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAgLy8g5ZWG5ZOB6K+m5oOFIC0g5YiG6KGM5pi+56S6XG4gICAgICAgICAgICBkZXRhaWxJbnRybzogZnVuY3Rpb24oICkge1xuICAgICAgICAgICAgICAgIGNvbnN0IHsgZGV0YWlsIH0gPSB0aGlzLmRhdGE7XG4gICAgICAgICAgICAgICAgaWYgKCAhZGV0YWlsIHx8ICggISFkZXRhaWwgJiYgIWRldGFpbC5kZXRhaWwgKSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gWyBdO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBkZXRhaWwuZGV0YWlsLnNwbGl0KCdcXG4nKS5maWx0ZXIoIHggPT4gISF4ICk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAgLy8g5Lu35qC8IO+9niDlm6LotK3ku7fnmoTlt67ku7dcbiAgICAgICAgICAgIHByaWNlR2FwOiBmdW5jdGlvbiggKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgeyBkZXRhaWwgfSA9IHRoaXMuZGF0YTtcbiAgICAgICAgICAgICAgICBpZiAoICFkZXRhaWwgKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAnJ1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHJlc3VsdCA9IGRlbGF5ZXJpbmdHb29kKCBkZXRhaWwgKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHJlc3VsdCA/IFN0cmluZyggcmVzdWx0Lmdvb2RQaW5zLmVhY2hQcmljZVJvdW5kICkucmVwbGFjZSgvXFwuMDAvZywgJycpIDogJyc7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAgLy8g5ou85Zui5YiX6KGoXG4gICAgICAgICAgICBwaW4kOiBmdW5jdGlvbiggKSB7XG4gICAgICAgICAgICAgICAgbGV0IG1ldGE6IGFueSA9IFsgXTtcbiAgICAgICAgICAgICAgICBjb25zdCB7IGRldGFpbCwgc2hvcHBpbmcsIGFjdGl2aXRpZXMgfSA9IHRoaXMuZGF0YTtcblxuICAgICAgICAgICAgICAgIGlmICggIWRldGFpbCApIHsgXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBbIF07XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgY29uc3QgeyBzdGFuZGFyZHMsIGdyb3VwUHJpY2UgfSA9IGRldGFpbDtcblxuICAgICAgICAgICAgICAgIGlmICggc3RhbmRhcmRzLmxlbmd0aCA+IDAgKSB7XG4gICAgICAgICAgICAgICAgICAgIG1ldGEgPSBzdGFuZGFyZHNcbiAgICAgICAgICAgICAgICAgICAgICAgIC5maWx0ZXIoIHggPT4gISF4Lmdyb3VwUHJpY2UgKVxuICAgICAgICAgICAgICAgICAgICAgICAgLm1hcCggeCA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIE9iamVjdC5hc3NpZ24oeyB9LCB4LCB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNpZDogeC5faWQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhblBpbjogISFzaG9wcGluZy5maW5kKCBzID0+IHMuc2lkID09PSB4Ll9pZCAmJiBzLnBpZCA9PT0geC5waWQgKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoICEhZ3JvdXBQcmljZSApIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgeyBwcmljZSwgdGl0bGUsIGltZywgX2lkIH0gPSBkZXRhaWw7XG4gICAgICAgICAgICAgICAgICAgIG1ldGEgPSBbe1xuICAgICAgICAgICAgICAgICAgICAgICAgcHJpY2UsXG4gICAgICAgICAgICAgICAgICAgICAgICBwaWQ6IF9pZCxcbiAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6IHRpdGxlLFxuICAgICAgICAgICAgICAgICAgICAgICAgZ3JvdXBQcmljZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHNpZDogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgICAgICAgICAgaW1nOiBpbWdbIDAgXSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhblBpbjogISFzaG9wcGluZy5maW5kKCBzID0+IHMucGlkID09PSBfaWQgKVxuICAgICAgICAgICAgICAgICAgICB9XTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAvLyDmoLnmja7mtLvliqjvvIzmm7TmlLnjgIHmlrDlop7mi7zlm6Lpobnnm65cbiAgICAgICAgICAgICAgICBhY3Rpdml0aWVzLm1hcCggYWMgPT4ge1xuICAgICAgICAgICAgICAgICAgICBpZiAoICFhYy5hY19ncm91cFByaWNlICkgeyByZXR1cm47IH1cbiAgICAgICAgICAgICAgICAgICAgY29uc3QgcGluVGFyZ2V0ID0gbWV0YS5maW5kKCB4ID0+IHgucGlkID09PSBhYy5waWQgJiYgeC5zaWQgPT09IGFjLnNpZCApO1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBwaW5UYXJnZXRJbmRleCA9IG1ldGEuZmluZEluZGV4KCB4ID0+IHgucGlkID09PSBhYy5waWQgJiYgeC5zaWQgPT09IGFjLnNpZCApO1xuXG4gICAgICAgICAgICAgICAgICAgIC8vIOabv+aNolxuICAgICAgICAgICAgICAgICAgICBpZiAoIHBpblRhcmdldEluZGV4ICE9PSAtMSApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG1ldGEuc3BsaWNlKCBwaW5UYXJnZXRJbmRleCwgMSwgT2JqZWN0LmFzc2lnbih7IH0sIHBpblRhcmdldCwge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHByaWNlOiBhYy5hY19wcmljZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBncm91cFByaWNlOiBhYy5hY19ncm91cFByaWNlXG4gICAgICAgICAgICAgICAgICAgICAgICB9KSk7XG5cbiAgICAgICAgICAgICAgICAgICAgLy8g5paw5aKeXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBtZXRhLnB1c2goe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNpZDogYWMuc2lkLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBpZDogYWMucGlkLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGltZzogYWMuaW1nLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6IGFjLnRpdGxlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhblBpbjogISFzaG9wcGluZy5maW5kKCBzID0+IHMuc2lkID09PSBhYy5zaWQgJiYgcy5waWQgPT09IGFjLnBpZCApLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHByaWNlOiBhYy5hY19wcmljZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBncm91cFByaWNlOiBhYy5hY19ncm91cFByaWNlIFxuICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgY29uc3QgbWV0YTIgPSBtZXRhLm1hcCggeCA9PiBPYmplY3QuYXNzaWduKHsgfSwgeCwge1xuICAgICAgICAgICAgICAgICAgICBkZWx0YTogTnVtYmVyKCB4LnByaWNlIC0geC5ncm91cFByaWNlICkudG9GaXhlZCggMCApXG4gICAgICAgICAgICAgICAgfSkpO1xuICAgICAgICAgICAgICAgIHJldHVybiBtZXRhMjtcbiAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgIC8vIOmprOS4iuWPr+S7peaLvOWboueahOS4quaVsFxuICAgICAgICAgICAgcGluQ291bnQkOiBmdW5jdGlvbiggKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgeyBkZXRhaWwsIHNob3BwaW5nIH0gPSB0aGlzLmRhdGE7XG4gICAgICAgICAgICAgICAgaWYgKCAhZGV0YWlsICkgeyBcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIDA7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgY29uc3QgeyBzdGFuZGFyZHMsIGdyb3VwUHJpY2UgfSA9IGRldGFpbDtcblxuICAgICAgICAgICAgICAgIGlmICggISFzdGFuZGFyZHMgJiYgc3RhbmRhcmRzLmxlbmd0aCA+IDAgKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBzdGFuZGFyZHNcbiAgICAgICAgICAgICAgICAgICAgICAgIC5maWx0ZXIoIHggPT4gISFzaG9wcGluZy5maW5kKCBzID0+IHMuc2lkID09PSB4Ll9pZCAmJiBzLnBpZCA9PT0geC5waWQgKSlcbiAgICAgICAgICAgICAgICAgICAgICAgIC5sZW5ndGg7XG5cbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKCAhIWdyb3VwUHJpY2UgKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHsgX2lkIH0gPSBkZXRhaWw7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAhIXNob3BwaW5nLmZpbmQoIHMgPT4gcy5waWQgPT09IF9pZCApID8gMSA6IDBcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gMDtcbiAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgIC8vIOaYr+WQpuacieWei+WPt1xuICAgICAgICAgICAgaGFzU3RhbmRlcnMkOiBmdW5jdGlvbiggKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgeyBkZXRhaWwgfSA9IHRoaXMuZGF0YTtcbiAgICAgICAgICAgICAgICBpZiAoICFkZXRhaWwgKSB7IFxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGNvbnN0IHsgc3RhbmRhcmRzIH0gPSBkZXRhaWw7XG4gICAgICAgICAgICAgICAgcmV0dXJuICEhc3RhbmRhcmRzICYmIHN0YW5kYXJkcy5sZW5ndGggPiAwIDtcbiAgICAgICAgICAgIH0sXG5cbiAgICAgICAgfSlcbiAgICB9LFxuXG4gICAgLyoqIOaLieWPluWVhuWTgeivpuaDhSAqL1xuICAgIGZldERldGFpbCggaWQgKSB7XG4gICAgICAgIGNvbnN0IHsgZGV0YWlsIH0gPSB0aGlzLmRhdGE7XG4gICAgICAgIGlmICggZGV0YWlsICkgeyByZXR1cm47IH1cbiAgICAgICAgaHR0cCh7XG4gICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgX2lkOiBpZCxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBlcnJNc2c6ICfojrflj5bllYblk4HplJnor6/vvIzor7fph43or5UnLFxuICAgICAgICAgICAgdXJsOiBgZ29vZF9kZXRhaWxgLFxuICAgICAgICAgICAgc3VjY2VzczogcmVzID0+IHtcbiAgICAgICAgICAgICAgaWYgKCByZXMuc3RhdHVzICE9PSAyMDAgKSB7IHJldHVybjsgfVxuXG4gICAgICAgICAgICAgICAgbGV0IHBpbjogYW55ID0gWyBdO1xuICAgICAgICAgICAgICAgIGNvbnN0IHsgc3RhbmRhcmRzLCBncm91cFByaWNlLCBhY3Rpdml0aWVzIH0gPSByZXMuZGF0YTtcblxuICAgICAgICAgICAgICAgIGlmICggc3RhbmRhcmRzLmxlbmd0aCA+IDAgKSB7XG4gICAgICAgICAgICAgICAgICAgIHBpbiA9IHN0YW5kYXJkcy5maWx0ZXIoIHggPT4gISF4Lmdyb3VwUHJpY2UgKTtcblxuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoICEhZ3JvdXBQcmljZSApIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgeyBwcmljZSwgdGl0bGUsIGltZyAgfSA9IHJlcy5kYXRhO1xuICAgICAgICAgICAgICAgICAgICBwaW4gPSBbe1xuICAgICAgICAgICAgICAgICAgICAgICAgcHJpY2UsXG4gICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiB0aXRsZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGdyb3VwUHJpY2UsXG4gICAgICAgICAgICAgICAgICAgICAgICBpbWc6IGltZ1sgMCBdXG4gICAgICAgICAgICAgICAgICAgIH1dO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGNvbnN0IGFjdGl2aXRpZXMkID0gYWN0aXZpdGllcy5tYXAoIHggPT4ge1xuXG4gICAgICAgICAgICAgICAgICAgIGxldCBpbWcgPSAnJztcbiAgICAgICAgICAgICAgICAgICAgaWYgKCAhIXguc2lkICkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaW1nID0gc3RhbmRhcmRzLmZpbmQoIHkgPT4geS5faWQgPT09IHguc2lkICkuaW1nXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpbWcgPSByZXMuZGF0YS5pbWdbIDAgXTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBPYmplY3QuYXNzaWduKHsgfSwgeCwgeyBcbiAgICAgICAgICAgICAgICAgICAgICAgIGltZyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvdW50ZG93bjogKCB4LmVuZFRpbWUgLSBuZXcgRGF0ZSggKS5nZXRUaW1lKCApKSAvICggMTAwMCApXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgfSkuZmlsdGVyKCB5ID0+IHkuZW5kVGltZSA+IG5ldyBEYXRlKCApLmdldFRpbWUoICkpO1xuXG4gICAgICAgICAgICAgICAgdGhpcy5zZXREYXRhISh7XG4gICAgICAgICAgICAgICAgICAgIHBpbixcbiAgICAgICAgICAgICAgICAgICAgbG9hZGluZzogZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgIGRldGFpbDogcmVzLmRhdGEsXG4gICAgICAgICAgICAgICAgICAgIGFjdGl2aXRpZXM6IGFjdGl2aXRpZXMkXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH0sXG5cbiAgICAvKiog5ouJ5Y+W5b2T5YmN5ZWG5ZOB55qE6LSt54mp6K+35Y2V5L+h5oGvICovXG4gICAgZmV0Y2hTaG9wcGluZyggcGlkLCB0aWQgKSB7XG5cbiAgICAgICAgaWYgKCAhcGlkIHx8ICF0aWQgKSB7IHJldHVybjsgfVxuXG4gICAgICAgIGh0dHAoe1xuICAgICAgICAgICAgdXJsOiAnc2hvcHBpbmctbGlzdF9waW4nLFxuICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgIHBpZCxcbiAgICAgICAgICAgICAgICB0aWQsXG4gICAgICAgICAgICAgICAgZGV0YWlsOiBmYWxzZVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHN1Y2Nlc3M6IHJlcyA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3QgeyBzdGF0dXMsIGRhdGEgfSA9IHJlcztcbiAgICAgICAgICAgICAgICBpZiAoIHN0YXR1cyAhPT0gMjAwICkgeyByZXR1cm47IH1cbiAgICAgICAgICAgICAgICB0aGlzLnNldERhdGEhKHtcbiAgICAgICAgICAgICAgICAgICAgc2hvcHBpbmc6IGRhdGEsXG4gICAgICAgICAgICAgICAgICAgIGNhblBpblNrdTogZGF0YS5tYXAoIHggPT4gKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHBpZDogeC5waWQsXG4gICAgICAgICAgICAgICAgICAgICAgICBzaWQ6IHguc2lkXG4gICAgICAgICAgICAgICAgICAgIH0pKVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KVxuICAgIH0sXG5cbiAgICAvKiog5ouJ5Y+W5Lik5Liq5pyA5paw6KGM56iLICovXG4gICAgZmV0Y2hMYXN0KCApIHtcbiAgICAgICAgY29uc3QgeyBpZCB9ID0gdGhpcy5kYXRhO1xuICAgICAgICBodHRwKHtcbiAgICAgICAgICAgIGRhdGE6IHsgfSxcbiAgICAgICAgICAgIHVybDogYHRyaXBfZW50ZXJgLFxuICAgICAgICAgICAgc3VjY2VzczogcmVzID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCB7IHN0YXR1cywgZGF0YSB9ID0gcmVzO1xuICAgICAgICAgICAgICAgIGlmICggc3RhdHVzICE9PSAyMDAgKSB7IHJldHVybjsgfVxuXG4gICAgICAgICAgICAgICAgaWYgKCAhIWRhdGFbIDAgXSkge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCB0aWQgPSBkYXRhWyAwIF0uX2lkXG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKCAhdGhpcy5kYXRhLnRpZCApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZmV0Y2hTaG9wcGluZyggaWQsIHRpZCApO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc2V0RGF0YSEoe1xuICAgICAgICAgICAgICAgICAgICAgICAgdGlkOiBkYXRhWyAwIF0uX2lkLFxuICAgICAgICAgICAgICAgICAgICAgICAgdHJpcDogZGF0YVsgMCBdXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSlcbiAgICB9LFxuXG4gICAgLy8g5bGV5byA5o+Q56S6XG4gICAgdG9nZ2xlVGlwcyggZSApIHtcbiAgICAgICAgY29uc3QgeyBzaG93VGlwcyB9ID0gdGhpcy5kYXRhO1xuICAgICAgICB0aGlzLnNldERhdGEhKHtcbiAgICAgICAgICAgIHNob3dUaXBzOiBzaG93VGlwcyA9PT0gJ3Nob3cnID8gJ2hpZGUnIDogJ3Nob3cnXG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLmNyZWF0ZUZvcm1JZCggZS5kZXRhaWwuZm9ybUlkICk7XG4gICAgfSxcblxuICAgIC8vIOi/m+WFpeWVhuWTgeeuoeeQhlxuICAgIGdvTWFuYWdlciggKSB7XG4gICAgICAgIG5hdlRvKGAvcGFnZXMvbWFuYWdlci1nb29kcy1kZXRhaWwvaW5kZXg/aWQ9JHt0aGlzLmRhdGEuaWR9YClcbiAgICB9LFxuXG4gICAgLyoqIOebkeWQrOWFqOWxgOeuoeeQhuWRmOadg+mZkCAqL1xuICAgIHdhdGNoUm9sZSggKSB7XG4gICAgICAgIChhcHAgYXMgYW55KS53YXRjaCQoJ3JvbGUnLCAoIHZhbCApID0+IHtcbiAgICAgICAgICAgIHRoaXMuc2V0RGF0YSEoe1xuICAgICAgICAgICAgICAgIHNob3dCdG46ICggdmFsID09PSAxIClcbiAgICAgICAgICAgIH0pXG4gICAgICAgIH0pO1xuICAgICAgICAoYXBwIGFzIGFueSkud2F0Y2gkKCdpc05ldycsIHZhbCA9PiB7XG4gICAgICAgICAgICB0aGlzLnNldERhdGEhKHtcbiAgICAgICAgICAgICAgICBpc05ldzogdmFsXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfSxcbiAgICBcbiAgICAvKiog6aKE6KeI5Zu+54mHICovXG4gICAgcHJldmlld0ltZyh7IGN1cnJlbnRUYXJnZXQgfSkge1xuICAgICAgICBjb25zdCB7IGltZyB9ID0gY3VycmVudFRhcmdldC5kYXRhc2V0O1xuICAgICAgICB0aGlzLmRhdGEuZGV0YWlsICYmIHd4LnByZXZpZXdJbWFnZSh7XG4gICAgICAgICAgICBjdXJyZW50OiBpbWcsXG4gICAgICAgICAgICB1cmxzOiBbIC4uLih0aGlzLmRhdGEgYXMgYW55KS5kZXRhaWwuaW1nIF0sXG4gICAgICAgIH0pO1xuICAgIH0sXG5cbiAgICAvKiog6aKE6KeI5Y2V5byg5Zu+54mH77ya5ou85Zui5Zu+54mH44CB5LiA5Y+j5Lu377yI6ZmQ5pe25oqi77yJICovXG4gICAgcHJldmlld1NpbmdsZUltZyh7IGN1cnJlbnRUYXJnZXQgfSkge1xuXG4gICAgICAgIGNvbnN0IGltZyA9IGN1cnJlbnRUYXJnZXQuZGF0YXNldC5kYXRhID9cbiAgICAgICAgICAgIGN1cnJlbnRUYXJnZXQuZGF0YXNldC5kYXRhLmltZzpcbiAgICAgICAgICAgIGN1cnJlbnRUYXJnZXQuZGF0YXNldC5pbWc7XG5cbiAgICAgICAgdGhpcy5kYXRhLmRldGFpbCAmJiB3eC5wcmV2aWV3SW1hZ2Uoe1xuICAgICAgICAgICAgY3VycmVudDogaW1nLFxuICAgICAgICAgICAgdXJsczogWyBpbWcgXSxcbiAgICAgICAgfSk7XG4gICAgfSxcblxuICAgIC8qKiDorr7nva7igJzllpzmrKLigJ0gKi9cbiAgICBvbkxpa2UoICkge1xuICAgICAgICBjb25zdCB0aGF0ID0gdGhpcztcbiAgICAgICAgaWYgKCAhdGhpcy5kYXRhLmhhc0luaXRMaWtlICkgeyByZXR1cm47IH1cbiAgICAgICAgaHR0cCh7XG4gICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgcGlkOiB0aGlzLmRhdGEuaWRcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB1cmw6ICdsaWtlX2NyZWF0ZScsXG4gICAgICAgICAgICBzdWNjZXNzOiAgKCByZXM6IGFueSApID0+IHtcbiAgICAgICAgICAgICAgICBpZiAoIHJlcy5zdGF0dXMgPT09IDIwMCApIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zZXREYXRhISh7XG4gICAgICAgICAgICAgICAgICAgICAgICBsaWtlZDogIXRoaXMuZGF0YS5saWtlZFxuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfSxcblxuICAgIC8qKiDorr7nva7igJzllpzmrKLigJ0gKi9cbiAgICBjaGVja0xpa2UoICkge1xuICAgICAgICBjb25zdCB0aGF0ID0gdGhpcztcbiAgICAgICAgaHR0cCh7XG4gICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgcGlkOiB0aGlzLmRhdGEuaWRcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB1cmw6ICdsaWtlX2NoZWNrJyxcbiAgICAgICAgICAgIHN1Y2Nlc3M6ICAoIHJlczogYW55ICkgPT4ge1xuICAgICAgICAgICAgICAgIGlmICggcmVzLnN0YXR1cyA9PT0gMjAwICkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnNldERhdGEhKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxpa2VkOiByZXMuZGF0YSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGhhc0luaXRMaWtlOiB0cnVlXG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9LFxuXG4gICAgLyoqIOa1t+aKpeW8gOWFsyAqL1xuICAgIG9uUG9zdFRvZ2dsZSggZSApIHtcbiAgICAgICAgY29uc3QgdmFsID0gZS5kZXRhaWw7XG4gICAgICAgIHRoaXMuc2V0RGF0YSEoe1xuICAgICAgICAgICAgc2hvd2luZ1Bvc3RlcjogdmFsXG4gICAgICAgIH0pO1xuICAgICAgICB3eC5zZXROYXZpZ2F0aW9uQmFyVGl0bGUoe1xuICAgICAgICAgICAgdGl0bGU6IHZhbCA/ICfliIbkuqvllYblk4EnIDogJ+WVhuWTgeivpuaDhSdcbiAgICAgICAgfSk7XG4gICAgfSxcblxuICAgIGNyZWF0ZUZvcm1JZCggZm9ybWlkICkge1xuICAgICAgICBpZiAoICFmb3JtaWQgKSB7IHJldHVybjsgfVxuICAgICAgICBodHRwKHtcbiAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICBmb3JtaWRcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBsb2FkaW5nTXNnOiAnbm9uZScsXG4gICAgICAgICAgICB1cmw6ICdjb21tb25fY3JlYXRlLWZvcm1pZCcsXG4gICAgICAgIH0pXG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIOeUn+WRveWRqOacn+WHveaVsC0t55uR5ZCs6aG16Z2i5Yqg6L29XG4gICAgICovXG4gICAgb25Mb2FkOiBmdW5jdGlvbiAob3B0aW9ucykge1xuXG4gICAgICAgIGNvbnN0IHNjZW5lID0gZGVjb2RlVVJJQ29tcG9uZW50KCBvcHRpb25zIS5zY2VuZSB8fCAnJyApXG4gICAgICAgIFxuICAgICAgICB0aGlzLndhdGNoUm9sZSggKTtcbiAgICAgICAgdGhpcy5ydW5Db21wdXRlZCggKTtcblxuICAgICAgICB0aGlzLmNoZWNrTGlrZSggKTtcbiAgICAgICAgLy8gaWYgKCAhb3B0aW9ucyEudGlkICkge1xuICAgICAgICAgICAgdGhpcy5mZXRjaExhc3QoICk7XG4gICAgICAgIC8vIH1cbiAgICAgICAgXG4gICAgICAgIGlmICggIW9wdGlvbnMhLmlkICYmICFzY2VuZSApIHsgcmV0dXJuOyB9XG4gICAgICAgIHRoaXMuc2V0RGF0YSEoe1xuICAgICAgICAgICAgaWQ6IG9wdGlvbnMhLmlkIHx8IHNjZW5lLFxuICAgICAgICB9KTtcblxuICAgICAgICBpZiAoICEhKG9wdGlvbnMgYXMgYW55KS50aWQgKSB7XG4gICAgICAgICAgICB0aGlzLnNldERhdGEhKHtcbiAgICAgICAgICAgICAgICB0aWQ6IG9wdGlvbnMhLnRpZFxuICAgICAgICAgICAgfSlcbiAgICAgICAgfVxuICAgIH0sXG4gIFxuICAgIC8qKlxuICAgICAqIOeUn+WRveWRqOacn+WHveaVsC0t55uR5ZCs6aG16Z2i5Yid5qyh5riy5p+T5a6M5oiQXG4gICAgICovXG4gICAgb25SZWFkeTogZnVuY3Rpb24gKCApIHtcbiAgICAgICAgbGV0IGNpcmNsZUNvdW50ID0gMDsgXG4gICAgICAgIGNvbnN0IHRoYXQ6IGFueSA9IHRoaXM7XG4gICAgICAgIC8vIOW/g+i3s+eahOWkluahhuWKqOeUuyBcbiAgICAgICAgdGhhdC5hbmltYXRpb25NaWRkbGVIZWFkZXJJdGVtID0gd3guY3JlYXRlQW5pbWF0aW9uKHsgXG4gICAgICAgICAgICBkdXJhdGlvbjogODAwLCBcbiAgICAgICAgICAgIHRpbWluZ0Z1bmN0aW9uOiAnZWFzZScsIFxuICAgICAgICAgICAgdHJhbnNmb3JtT3JpZ2luOiAnNTAlIDUwJScsXG4gICAgICAgIH0pOyBcbiAgICAgICAgc2V0SW50ZXJ2YWwoIGZ1bmN0aW9uKCApIHsgXG4gICAgICAgICAgICBpZiAoY2lyY2xlQ291bnQgJSAyID09IDApIHsgXG4gICAgICAgICAgICAgICAgdGhhdC5hbmltYXRpb25NaWRkbGVIZWFkZXJJdGVtLnNjYWxlKCAxLjAgKS5yb3RhdGUoIDEwICkuc3RlcCggKTsgXG4gICAgICAgICAgICB9IGVsc2UgeyBcbiAgICAgICAgICAgICAgICB0aGF0LmFuaW1hdGlvbk1pZGRsZUhlYWRlckl0ZW0uc2NhbGUoIDEuMCApLnJvdGF0ZSggLTMwICkuc3RlcCggKTsgXG4gICAgICAgICAgICB9IFxuICAgICAgICAgICAgdGhhdC5zZXREYXRhKHsgXG4gICAgICAgICAgICAgICAgYW5pbWF0aW9uTWlkZGxlSGVhZGVySXRlbTogdGhhdC5hbmltYXRpb25NaWRkbGVIZWFkZXJJdGVtLmV4cG9ydCggKSBcbiAgICAgICAgICAgIH0pOyBcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgaWYgKCArK2NpcmNsZUNvdW50ID09PSAxMDAwICkgeyBcbiAgICAgICAgICAgICAgICBjaXJjbGVDb3VudCA9IDA7IFxuICAgICAgICAgICAgfSBcbiAgICAgICAgfS5iaW5kKCB0aGlzICksIDEwMDAgKTsgXG4gICAgfSxcbiAgXG4gICAgLyoqXG4gICAgICog55Sf5ZG95ZGo5pyf5Ye95pWwLS3nm5HlkKzpobXpnaLmmL7npLpcbiAgICAgKi9cbiAgICBvblNob3c6IGZ1bmN0aW9uICggKSB7XG4gICAgICAgIGNvbnN0IHsgaWQsIHRpZCB9ID0gdGhpcy5kYXRhO1xuXG4gICAgICAgIHRoaXMuZmV0RGV0YWlsKCBpZCApO1xuICAgICAgICB0aGlzLmZldGNoU2hvcHBpbmcoIGlkLCB0aWQgKTtcbiAgICB9LFxuICBcbiAgICAvKipcbiAgICAgKiDnlJ/lkb3lkajmnJ/lh73mlbAtLeebkeWQrOmhtemdoumakOiXj1xuICAgICAqL1xuICAgIG9uSGlkZTogZnVuY3Rpb24gKCkge1xuICBcbiAgICB9LFxuICBcbiAgICAvKipcbiAgICAgKiDnlJ/lkb3lkajmnJ/lh73mlbAtLeebkeWQrOmhtemdouWNuOi9vVxuICAgICAqL1xuICAgIG9uVW5sb2FkOiBmdW5jdGlvbiAoKSB7XG4gIFxuICAgIH0sXG4gIFxuICAgIC8qKlxuICAgICAqIOmhtemdouebuOWFs+S6i+S7tuWkhOeQhuWHveaVsC0t55uR5ZCs55So5oi35LiL5ouJ5Yqo5L2cXG4gICAgICovXG4gICAgb25QdWxsRG93blJlZnJlc2g6IGZ1bmN0aW9uICgpIHtcbiAgXG4gICAgfSxcbiAgXG4gICAgLyoqXG4gICAgICog6aG16Z2i5LiK5ouJ6Kem5bqV5LqL5Lu255qE5aSE55CG5Ye95pWwXG4gICAgICovXG4gICAgb25SZWFjaEJvdHRvbTogZnVuY3Rpb24gKCkge1xuICBcbiAgICB9LFxuICBcbiAgICAvKipcbiAgICAgKiDnlKjmiLfngrnlh7vlj7PkuIrop5LliIbkuqtcbiAgICAgKi9cbiAgICBvblNoYXJlQXBwTWVzc2FnZTogZnVuY3Rpb24gKCApIHtcbiAgICAgICAgY29uc3QgeyBkZXRhaWwsIHBpbiQsIGFjdGl2aXRpZXMsIHByaWNlR2FwLCB0cmlwIH0gPSB0aGlzLmRhdGE7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICB0aXRsZTogYCR7cHJpY2VHYXAgIT09ICcnICYmIE51bWJlciggcHJpY2VHYXAgKSAhPT0gMCA/IFxuICAgICAgICAgICAgICAgICAgICAgICAgYWN0aXZpdGllcy5sZW5ndGggPT09IDAgP1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGDkuIDotbfkubDvvIHkuIDotbfnnIEke1N0cmluZyggcHJpY2VHYXAgKS5yZXBsYWNlKC9cXC4wMC9nLCAnJyl95YWD77yBYCA6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJ+mZkOaXtueJueS7t+i2heWunuaDoO+8gScgOiBcbiAgICAgICAgICAgICAgICAgICAgICAgIHRyaXAgJiYgdHJpcC5yZWR1Y2VfcHJpY2UgPyBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBg56uL5YePJHt0cmlwLnJlZHVjZV9wcmljZX3lhYPvvIFgIDpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAn57uZ5L2g55yL55yL6L+Z5a6d6LSd77yBJ1xuICAgICAgICAgICAgICAgIH0ke2RldGFpbC50aXRsZX1gLFxuICAgICAgICAgICAgcGF0aDogYC9wYWdlcy9nb29kcy1kZXRhaWwvaW5kZXg/aWQ9JHtkZXRhaWwuX2lkfSZ0aWQ9JHt0aGlzLmRhdGEudGlkfWAsXG4gICAgICAgICAgICBpbWFnZVVybDogYCR7ZGV0YWlsLmltZ1sgMCBdfWBcbiAgICAgICAgfVxuICAgIH1cbiAgfSkiXX0=