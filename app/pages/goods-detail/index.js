"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var http_js_1 = require("../../util/http.js");
var index_js_1 = require("../../lib/vuefy/index.js");
var app = getApp();
Page({
    animationMiddleHeaderItem: null,
    data: {
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
        showTips: 'hide',
        pin: [],
        shopping: [],
        activities: []
    },
    runComputed: function () {
        index_js_1.computed(this, {
            price: function () {
                var detail = this.data.detail;
                if (!detail) {
                    return '';
                }
                else {
                    if (detail.standards.length === 0) {
                        return detail.price;
                    }
                    else if (detail.standards.length === 1) {
                        return detail.standards[0].price;
                    }
                    else {
                        var sortedPrice = detail.standards.sort(function (x, y) { return x.price - y.price; });
                        if (sortedPrice[0].price === sortedPrice[sortedPrice.length - 1].price) {
                            return sortedPrice[0].price;
                        }
                        else {
                            return sortedPrice[0].price + "~" + sortedPrice[sortedPrice.length - 1].price;
                        }
                    }
                }
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
                    return 0;
                }
                else {
                    var standards = detail.standards, groupPrice = detail.groupPrice, price = detail.price;
                    if (standards.length === 0) {
                        if (groupPrice !== null && groupPrice !== undefined) {
                            return Number(price - groupPrice).toFixed(2);
                        }
                        else {
                            return 0;
                        }
                    }
                    else {
                        var groupPrice_1 = standards.filter(function (x) { return x.groupPrice !== null && x.groupPrice !== undefined; });
                        if (groupPrice_1.length > 0) {
                            var sortedGroupPrice = groupPrice_1.sort(function (x, y) { return ((x.groupPrice - x.price) - (y.groupPrice - y.price)); });
                            if ((sortedGroupPrice[0].groupPrice - sortedGroupPrice[0].price) ===
                                (sortedGroupPrice[sortedGroupPrice.length - 1].groupPrice - sortedGroupPrice[sortedGroupPrice.length - 1].price)) {
                                return Number((sortedGroupPrice[0].price - sortedGroupPrice[0].groupPrice)).toFixed(2);
                            }
                            else {
                                return Number(Number(sortedGroupPrice[sortedGroupPrice.length - 1].price - sortedGroupPrice[sortedGroupPrice.length - 1].groupPrice).toFixed(2)) + "~" + Number(Number(sortedGroupPrice[0].price - sortedGroupPrice[0].groupPrice).toFixed(2));
                            }
                        }
                        else {
                            return 0;
                        }
                    }
                }
            },
            pin$: function () {
                var _a = this.data, detail = _a.detail, shopping = _a.shopping;
                if (!detail) {
                    return [];
                }
                var standards = detail.standards, groupPrice = detail.groupPrice;
                if (standards.length > 0) {
                    return standards
                        .filter(function (x) { return !!x.groupPrice; })
                        .map(function (x) {
                        return Object.assign({}, x, {
                            canPin: !!shopping.find(function (s) { return s.sid === x._id && s.pid === x.pid; })
                        });
                    });
                }
                else if (!!groupPrice) {
                    var price = detail.price, title = detail.title, img = detail.img, _id_1 = detail._id;
                    return [{
                            price: price,
                            name: title,
                            groupPrice: groupPrice,
                            img: img[0],
                            canPin: !!shopping.find(function (s) { return s.pid === _id_1; })
                        }];
                }
                return [];
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
                });
                _this.setData({
                    pin: pin,
                    loading: false,
                    detail: res.data,
                    activities: activities$
                });
                console.log('...', activities$);
            }
        });
    },
    fetchDic: function () {
        var _this = this;
        var dic = this.data.dic;
        if (Object.keys(dic).length > 0) {
            return;
        }
        http_js_1.http({
            data: {
                dicName: 'goods_category',
            },
            errMsg: '加载失败，请重试',
            url: "common_dic",
            success: function (res) {
                if (res.status !== 200) {
                    return;
                }
                _this.setData({
                    dic: res.data
                });
            }
        });
    },
    fetchShopping: function (pid, tid) {
        var _this = this;
        http_js_1.http({
            url: 'shopping-list_pin',
            data: {
                pid: pid,
                tid: tid
            },
            success: function (res) {
                var status = res.status, data = res.data;
                if (status !== 200) {
                    return;
                }
                _this.setData({
                    shopping: data
                });
            }
        });
    },
    toggleTips: function () {
        var showTips = this.data.showTips;
        this.setData({
            showTips: showTips === 'show' ? 'hide' : 'show'
        });
    },
    goManager: function () {
        wx.navigateTo({
            url: "/pages/manager-goods-detail/index?id=" + this.data.id
        });
    },
    watchRole: function () {
        var _this = this;
        app.watch$('role', function (val) {
            _this.setData({
                showBtn: (val === 1)
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
        var that = this;
        if (!this.data.hasInitLike) {
            return;
        }
        wx.cloud.callFunction({
            name: 'api-like-collection',
            data: {
                pid: this.data.id
            },
            success: function (res) {
                if (res.result.status === 200) {
                    that.setData({
                        liked: !that.data.liked
                    });
                }
            },
            fail: function () {
                wx.showToast({
                    icon: 'none',
                    title: '设置“喜欢”错误',
                });
            }
        });
    },
    checkLike: function () {
        var that = this;
        wx.cloud.callFunction({
            name: 'api-like-collection-detail',
            data: {
                pid: this.data.id
            },
            success: function (res) {
                that.setData({
                    hasInitLike: true
                });
                if (res.result.status === 200) {
                    that.setData({
                        liked: res.result.data
                    });
                }
            },
            fail: function () {
                wx.showToast({
                    icon: 'none',
                    title: '查询“喜欢”错误',
                });
            }
        });
    },
    onLoad: function (options) {
        this.watchRole();
        this.runComputed();
        if (!options.id) {
            return;
        }
        this.setData({
            id: options.id,
            tid: options.tid
        });
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
        this.checkLike();
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
        var _a = this.data, detail = _a.detail, pin$ = _a.pin$;
        return {
            title: "" + (pin$.length === 0 ? '给你看看这宝贝！' : '一起拼团更实惠！') + detail.title,
            path: "/pages/good-detail/index?" + detail._id + "&tid=" + this.data.tid,
            imageUrl: "" + detail.img[0]
        };
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUNBLDhDQUEwQztBQUMxQyxxREFBb0Q7QUFFcEQsSUFBTSxHQUFHLEdBQUcsTUFBTSxFQUFHLENBQUM7QUFFdEIsSUFBSSxDQUFDO0lBR0QseUJBQXlCLEVBQUUsSUFBSTtJQUsvQixJQUFJLEVBQUU7UUFFRixHQUFHLEVBQUUsRUFBRTtRQUVQLEVBQUUsRUFBRSxFQUFFO1FBRU4sTUFBTSxFQUFFLElBQUk7UUFFWixHQUFHLEVBQUUsRUFBRztRQUVSLE9BQU8sRUFBRSxJQUFJO1FBRWIsV0FBVyxFQUFFLEtBQUs7UUFFbEIsS0FBSyxFQUFFLEtBQUs7UUFFWixXQUFXLEVBQUU7WUFDVCxNQUFNLEVBQUUsTUFBTSxFQUFFLE1BQU07U0FDekI7UUFFRCx5QkFBeUIsRUFBRSxJQUFJO1FBRS9CLE9BQU8sRUFBRSxLQUFLO1FBRWQsUUFBUSxFQUFFLE1BQU07UUFFaEIsR0FBRyxFQUFFLEVBQUc7UUFFUixRQUFRLEVBQUUsRUFBRztRQUViLFVBQVUsRUFBRSxFQUFHO0tBQ2xCO0lBR0QsV0FBVztRQUNQLG1CQUFRLENBQUUsSUFBSSxFQUFFO1lBR1osS0FBSyxFQUFFO2dCQUNLLElBQUEseUJBQU0sQ0FBZTtnQkFDN0IsSUFBSyxDQUFDLE1BQU0sRUFBRztvQkFDWCxPQUFPLEVBQUUsQ0FBQztpQkFDYjtxQkFBTTtvQkFDSCxJQUFLLE1BQU0sQ0FBQyxTQUFTLENBQUMsTUFBTSxLQUFLLENBQUMsRUFBRzt3QkFDakMsT0FBTyxNQUFNLENBQUMsS0FBSyxDQUFDO3FCQUN2Qjt5QkFBTSxJQUFLLE1BQU0sQ0FBQyxTQUFTLENBQUMsTUFBTSxLQUFLLENBQUMsRUFBRzt3QkFDeEMsT0FBTyxNQUFNLENBQUMsU0FBUyxDQUFFLENBQUMsQ0FBRSxDQUFDLEtBQUssQ0FBQztxQkFDdEM7eUJBQU07d0JBQ0gsSUFBTSxXQUFXLEdBQUcsTUFB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Ly4uL3V0aWwvaHR0cC5qcyc7XG5pbXBvcnQgeyBjb21wdXRlZCB9IGZyb20gJy4uLy4uL2xpYi92dWVmeS9pbmRleC5qcyc7XG5cbmNvbnN0IGFwcCA9IGdldEFwcCggKTtcblxuUGFnZSh7XG5cbiAgICAvLyDliqjnlLtcbiAgICBhbmltYXRpb25NaWRkbGVIZWFkZXJJdGVtOiBudWxsLFxuXG4gICAgLyoqXG4gICAgICog6aG16Z2i55qE5Yid5aeL5pWw5o2uXG4gICAgICovXG4gICAgZGF0YToge1xuICAgICAgICAvLyDooYznqItcbiAgICAgICAgdGlkOiAnJyxcbiAgICAgICAgLy8g5ZWG5ZOBaWRcbiAgICAgICAgaWQ6ICcnLFxuICAgICAgICAvLyDllYblk4Hor6bmg4VcbiAgICAgICAgZGV0YWlsOiBudWxsLFxuICAgICAgICAvLyDmlbDmja7lrZflhbhcbiAgICAgICAgZGljOiB7IH0sXG4gICAgICAgIC8vIOWKoOi9veeKtuaAgVxuICAgICAgICBsb2FkaW5nOiB0cnVlLFxuICAgICAgICAvLyDmmK/lkKbliJ3lp4vljJbov4figJzllpzmrKLigJ1cbiAgICAgICAgaGFzSW5pdExpa2U6IGZhbHNlLFxuICAgICAgICAvLyDmmK/lkKbigJzllpzmrKLigJ1cbiAgICAgICAgbGlrZWQ6IGZhbHNlLFxuICAgICAgICAvLyDmloflrZfkv53or4Hmj5DnpLpcbiAgICAgICAgcHJvbWlzZVRpcHM6IFtcbiAgICAgICAgICAgICfmraPlk4Hkv53or4EnLCAn5Lu35qC85LyY5Yq/JywgJ+ecn+S6uui3keiFvydcbiAgICAgICAgXSxcbiAgICAgICAgLy8g5Yqo55S7XG4gICAgICAgIGFuaW1hdGlvbk1pZGRsZUhlYWRlckl0ZW06IG51bGwsXG4gICAgICAgIC8vIOWxleekuueuoeeQhuWFpeWPo1xuICAgICAgICBzaG93QnRuOiBmYWxzZSxcbiAgICAgICAgLy8g5bGV56S65by55qGGXG4gICAgICAgIHNob3dUaXBzOiAnaGlkZScsXG4gICAgICAgIC8vIOaLvOWbouWIl+ihqFxuICAgICAgICBwaW46IFsgXSxcbiAgICAgICAgLy8g5ZWG5ZOB5Zyo5pys6KGM56iL55qE6LSt54mp5riF5Y2V5YiX6KGoXG4gICAgICAgIHNob3BwaW5nOiBbIF0sXG4gICAgICAgIC8vIOS4gOWPo+S7t+a0u+WKqOWIl+ihqFxuICAgICAgICBhY3Rpdml0aWVzOiBbIF1cbiAgICB9LFxuXG4gICAgLyoqIOiuvue9rmNvbXB1dGVkICovXG4gICAgcnVuQ29tcHV0ZWQoICkge1xuICAgICAgICBjb21wdXRlZCggdGhpcywge1xuXG4gICAgICAgICAgICAvLyDorqHnrpfku7fmoLxcbiAgICAgICAgICAgIHByaWNlOiBmdW5jdGlvbiggKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgeyBkZXRhaWwgfSA9IHRoaXMuZGF0YTtcbiAgICAgICAgICAgICAgICBpZiAoICFkZXRhaWwgKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAnJztcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBpZiAoIGRldGFpbC5zdGFuZGFyZHMubGVuZ3RoID09PSAwICkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGRldGFpbC5wcmljZTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmICggZGV0YWlsLnN0YW5kYXJkcy5sZW5ndGggPT09IDEgKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gZGV0YWlsLnN0YW5kYXJkc1sgMCBdLnByaWNlO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3Qgc29ydGVkUHJpY2UgPSBkZXRhaWwuc3RhbmRhcmRzLnNvcnQoKCB4LCB5ICkgPT4geC5wcmljZSAtIHkucHJpY2UgKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICggIHNvcnRlZFByaWNlWzBdLnByaWNlID09PSBzb3J0ZWRQcmljZVsgc29ydGVkUHJpY2UubGVuZ3RoIC0gMSBdLnByaWNlICkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBzb3J0ZWRQcmljZVsgMCBdLnByaWNlO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gYCR7c29ydGVkUHJpY2VbMF0ucHJpY2V9fiR7c29ydGVkUHJpY2Vbc29ydGVkUHJpY2UubGVuZ3RoIC0gMSBdLnByaWNlfWA7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LFxuXG4gICAgICAgICAgICAvLyDllYblk4Hor6bmg4UgLSDliIbooYzmmL7npLpcbiAgICAgICAgICAgIGRldGFpbEludHJvOiBmdW5jdGlvbiggKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgeyBkZXRhaWwgfSA9IHRoaXMuZGF0YTtcbiAgICAgICAgICAgICAgICBpZiAoICFkZXRhaWwgfHwgKCAhIWRldGFpbCAmJiAhZGV0YWlsLmRldGFpbCApKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBbIF07XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGRldGFpbC5kZXRhaWwuc3BsaXQoJ1xcbicpLmZpbHRlciggeCA9PiAhIXggKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LFxuXG4gICAgICAgICAgICAvLyDku7fmoLwg772eIOWboui0reS7t+eahOW3ruS7t1xuICAgICAgICAgICAgcHJpY2VHYXA6IGZ1bmN0aW9uKCApIHtcbiAgICAgICAgICAgICAgICBjb25zdCB7IGRldGFpbCB9ID0gdGhpcy5kYXRhO1xuICAgICAgICAgICAgICAgIGlmICggIWRldGFpbCApIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIDA7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgeyBzdGFuZGFyZHMsIGdyb3VwUHJpY2UsIHByaWNlIH0gPSBkZXRhaWw7XG4gICAgICAgICAgICAgICAgICAgIC8vIOaXoOWei+WPt1xuICAgICAgICAgICAgICAgICAgICBpZiAoIHN0YW5kYXJkcy5sZW5ndGggPT09IDAgKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyDmnInlm6LotK3nmoRcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICggZ3JvdXBQcmljZSAhPT0gbnVsbCAmJiBncm91cFByaWNlICE9PSB1bmRlZmluZWQgKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuICBOdW1iZXIoIHByaWNlIC0gZ3JvdXBQcmljZSApLnRvRml4ZWQoIDIgKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIDA7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIC8vIOacieWei+WPt1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgZ3JvdXBQcmljZSA9IHN0YW5kYXJkcy5maWx0ZXIoIHggPT4geC5ncm91cFByaWNlICE9PSBudWxsICYmIHguZ3JvdXBQcmljZSAhPT0gdW5kZWZpbmVkICk7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyDlnovlj7fph4zpnaLmnInlm6LotK3nmoRcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICggZ3JvdXBQcmljZS5sZW5ndGggPiAwICkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHNvcnRlZEdyb3VwUHJpY2UgPSBncm91cFByaWNlLnNvcnQoKCB4LCB5ICkgPT4gKCggeC5ncm91cFByaWNlIC0geC5wcmljZSApIC0gKCB5Lmdyb3VwUHJpY2UgLSB5LnByaWNlICkpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoKCBzb3J0ZWRHcm91cFByaWNlWzBdLmdyb3VwUHJpY2UgLSBzb3J0ZWRHcm91cFByaWNlWzBdLnByaWNlICkgPT09XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICggc29ydGVkR3JvdXBQcmljZVsgc29ydGVkR3JvdXBQcmljZS5sZW5ndGggLSAxIF0uZ3JvdXBQcmljZSAtIHNvcnRlZEdyb3VwUHJpY2VbIHNvcnRlZEdyb3VwUHJpY2UubGVuZ3RoIC0gMSBdLnByaWNlICkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIE51bWJlcigoIHNvcnRlZEdyb3VwUHJpY2VbMF0ucHJpY2UgLSBzb3J0ZWRHcm91cFByaWNlWzBdLmdyb3VwUHJpY2UgKSkudG9GaXhlZCggMiApO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBgJHtOdW1iZXIoTnVtYmVyKHNvcnRlZEdyb3VwUHJpY2VbIHNvcnRlZEdyb3VwUHJpY2UubGVuZ3RoIC0gMSBdLnByaWNlIC0gc29ydGVkR3JvdXBQcmljZVsgc29ydGVkR3JvdXBQcmljZS5sZW5ndGggLSAxIF0uZ3JvdXBQcmljZSkudG9GaXhlZCggMiApKX1+JHtOdW1iZXIoIE51bWJlciggc29ydGVkR3JvdXBQcmljZVswXS5wcmljZSAtIHNvcnRlZEdyb3VwUHJpY2VbMF0uZ3JvdXBQcmljZSkudG9GaXhlZCggMiApKX1gXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gMDtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgIC8vIOaLvOWbouWIl+ihqFxuICAgICAgICAgICAgcGluJDogZnVuY3Rpb24oICkge1xuICAgICAgICAgICAgICAgIGNvbnN0IHsgZGV0YWlsLCBzaG9wcGluZyB9ID0gdGhpcy5kYXRhO1xuXG4gICAgICAgICAgICAgICAgaWYgKCAhZGV0YWlsICkgeyBcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFsgXTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBjb25zdCB7IHN0YW5kYXJkcywgZ3JvdXBQcmljZSB9ID0gZGV0YWlsO1xuXG4gICAgICAgICAgICAgICAgaWYgKCBzdGFuZGFyZHMubGVuZ3RoID4gMCApIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHN0YW5kYXJkc1xuICAgICAgICAgICAgICAgICAgICAgICAgLmZpbHRlciggeCA9PiAhIXguZ3JvdXBQcmljZSApXG4gICAgICAgICAgICAgICAgICAgICAgICAubWFwKCB4ID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gT2JqZWN0LmFzc2lnbih7IH0sIHgsIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FuUGluOiAhIXNob3BwaW5nLmZpbmQoIHMgPT4gcy5zaWQgPT09IHguX2lkICYmIHMucGlkID09PSB4LnBpZCApXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pXG5cbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKCAhIWdyb3VwUHJpY2UgKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHsgcHJpY2UsIHRpdGxlLCBpbWcsIF9pZCB9ID0gZGV0YWlsO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gW3tcbiAgICAgICAgICAgICAgICAgICAgICAgIHByaWNlLFxuICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogdGl0bGUsXG4gICAgICAgICAgICAgICAgICAgICAgICBncm91cFByaWNlLFxuICAgICAgICAgICAgICAgICAgICAgICAgaW1nOiBpbWdbIDAgXSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhblBpbjogISFzaG9wcGluZy5maW5kKCBzID0+IHMucGlkID09PSBfaWQgKVxuICAgICAgICAgICAgICAgICAgICB9XVxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHJldHVybiBbIF07XG4gICAgICAgICAgICB9LFxuXG4gICAgICAgICAgICAvLyDpqazkuIrlj6/ku6Xmi7zlm6LnmoTkuKrmlbBcbiAgICAgICAgICAgIHBpbkNvdW50JDogZnVuY3Rpb24oICkge1xuICAgICAgICAgICAgICAgIGNvbnN0IHsgZGV0YWlsLCBzaG9wcGluZyB9ID0gdGhpcy5kYXRhO1xuICAgICAgICAgICAgICAgIGlmICggIWRldGFpbCApIHsgXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAwO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGNvbnN0IHsgc3RhbmRhcmRzLCBncm91cFByaWNlIH0gPSBkZXRhaWw7XG5cbiAgICAgICAgICAgICAgICBpZiAoICEhc3RhbmRhcmRzICYmIHN0YW5kYXJkcy5sZW5ndGggPiAwICkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gc3RhbmRhcmRzXG4gICAgICAgICAgICAgICAgICAgICAgICAuZmlsdGVyKCB4ID0+ICEhc2hvcHBpbmcuZmluZCggcyA9PiBzLnNpZCA9PT0geC5faWQgJiYgcy5waWQgPT09IHgucGlkICkpXG4gICAgICAgICAgICAgICAgICAgICAgICAubGVuZ3RoO1xuXG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmICggISFncm91cFByaWNlICkge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCB7IF9pZCB9ID0gZGV0YWlsO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gISFzaG9wcGluZy5maW5kKCBzID0+IHMucGlkID09PSBfaWQgKSA/IDEgOiAwXG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgcmV0dXJuIDA7XG4gICAgICAgICAgICB9LFxuXG4gICAgICAgICAgICAvLyDmmK/lkKbmnInlnovlj7dcbiAgICAgICAgICAgIGhhc1N0YW5kZXJzJDogZnVuY3Rpb24oICkge1xuICAgICAgICAgICAgICAgIGNvbnN0IHsgZGV0YWlsIH0gPSB0aGlzLmRhdGE7XG4gICAgICAgICAgICAgICAgaWYgKCAhZGV0YWlsICkgeyBcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBjb25zdCB7IHN0YW5kYXJkcyB9ID0gZGV0YWlsO1xuICAgICAgICAgICAgICAgIHJldHVybiAhIXN0YW5kYXJkcyAmJiBzdGFuZGFyZHMubGVuZ3RoID4gMCA7XG4gICAgICAgICAgICB9LFxuXG4gICAgICAgIH0pXG4gICAgfSxcblxuICAgIC8qKiDmi4nlj5bllYblk4Hor6bmg4UgKi9cbiAgICBmZXREZXRhaWwoIGlkICkge1xuICAgICAgICBjb25zdCB7IGRldGFpbCB9ID0gdGhpcy5kYXRhO1xuICAgICAgICBpZiAoIGRldGFpbCApIHsgcmV0dXJuOyB9XG4gICAgICAgIGh0dHAoe1xuICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgIF9pZDogaWQsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgZXJyTXNnOiAn6I635Y+W5ZWG5ZOB6ZSZ6K+v77yM6K+36YeN6K+VJyxcbiAgICAgICAgICAgIHVybDogYGdvb2RfZGV0YWlsYCxcbiAgICAgICAgICAgIHN1Y2Nlc3M6IHJlcyA9PiB7XG4gICAgICAgICAgICAgIGlmICggcmVzLnN0YXR1cyAhPT0gMjAwICkgeyByZXR1cm47IH1cblxuICAgICAgICAgICAgICAgIGxldCBwaW46IGFueSA9IFsgXTtcbiAgICAgICAgICAgICAgICBjb25zdCB7IHN0YW5kYXJkcywgZ3JvdXBQcmljZSwgYWN0aXZpdGllcyB9ID0gcmVzLmRhdGE7XG5cbiAgICAgICAgICAgICAgICBpZiAoIHN0YW5kYXJkcy5sZW5ndGggPiAwICkge1xuICAgICAgICAgICAgICAgICAgICBwaW4gPSBzdGFuZGFyZHMuZmlsdGVyKCB4ID0+ICEheC5ncm91cFByaWNlICk7XG5cbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKCAhIWdyb3VwUHJpY2UgKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHsgcHJpY2UsIHRpdGxlLCBpbWcgIH0gPSByZXMuZGF0YTtcbiAgICAgICAgICAgICAgICAgICAgcGluID0gW3tcbiAgICAgICAgICAgICAgICAgICAgICAgIHByaWNlLFxuICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogdGl0bGUsXG4gICAgICAgICAgICAgICAgICAgICAgICBncm91cFByaWNlLFxuICAgICAgICAgICAgICAgICAgICAgICAgaW1nOiBpbWdbIDAgXVxuICAgICAgICAgICAgICAgICAgICB9XTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBjb25zdCBhY3Rpdml0aWVzJCA9IGFjdGl2aXRpZXMubWFwKCB4ID0+IHtcblxuICAgICAgICAgICAgICAgICAgICBsZXQgaW1nID0gJyc7XG4gICAgICAgICAgICAgICAgICAgIGlmICggISF4LnNpZCApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGltZyA9IHN0YW5kYXJkcy5maW5kKCB5ID0+IHkuX2lkID09PSB4LnNpZCApLmltZ1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgaW1nID0gcmVzLmRhdGEuaW1nWyAwIF07XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gT2JqZWN0LmFzc2lnbih7IH0sIHgsIHsgXG4gICAgICAgICAgICAgICAgICAgICAgICBpbWcsXG4gICAgICAgICAgICAgICAgICAgICAgICBjb3VudGRvd246ICggeC5lbmRUaW1lIC0gbmV3IERhdGUoICkuZ2V0VGltZSggKSkgLyAoIDEwMDAgKVxuICAgICAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgdGhpcy5zZXREYXRhISh7XG4gICAgICAgICAgICAgICAgICAgIHBpbixcbiAgICAgICAgICAgICAgICAgICAgbG9hZGluZzogZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgIGRldGFpbDogcmVzLmRhdGEsXG4gICAgICAgICAgICAgICAgICAgIGFjdGl2aXRpZXM6IGFjdGl2aXRpZXMkXG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnLi4uJywgYWN0aXZpdGllcyQgKVxuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9LFxuXG4gICAgLyoqIOaLieWPluaVsOaNruWtl+WFuCAqL1xuICAgIGZldGNoRGljKCApIHtcbiAgICAgICAgY29uc3QgeyBkaWMgfSA9IHRoaXMuZGF0YTtcbiAgICAgICAgaWYgKCBPYmplY3Qua2V5cyggZGljICkubGVuZ3RoID4gMCApIHsgcmV0dXJuOyB9XG4gICAgICAgIGh0dHAoe1xuICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICBkaWNOYW1lOiAnZ29vZHNfY2F0ZWdvcnknLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGVyck1zZzogJ+WKoOi9veWksei0pe+8jOivt+mHjeivlScsXG4gICAgICAgICAgICB1cmw6IGBjb21tb25fZGljYCxcbiAgICAgICAgICAgIHN1Y2Nlc3M6IHJlcyA9PiB7XG4gICAgICAgICAgICAgIGlmICggcmVzLnN0YXR1cyAhPT0gMjAwICkgeyByZXR1cm47IH1cbiAgICAgICAgICAgICAgdGhpcy5zZXREYXRhISh7XG4gICAgICAgICAgICAgICAgICAgIGRpYzogcmVzLmRhdGFcbiAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH0sXG5cbiAgICAvKiog5ouJ5Y+W5b2T5YmN5ZWG5ZOB55qE6LSt54mp6K+35Y2V5L+h5oGvICovXG4gICAgZmV0Y2hTaG9wcGluZyggcGlkLCB0aWQgKSB7XG4gICAgICAgIGh0dHAoe1xuICAgICAgICAgICAgdXJsOiAnc2hvcHBpbmctbGlzdF9waW4nLFxuICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgIHBpZCxcbiAgICAgICAgICAgICAgICB0aWRcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBzdWNjZXNzOiByZXMgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IHsgc3RhdHVzLCBkYXRhIH0gPSByZXM7XG4gICAgICAgICAgICAgICAgaWYgKCBzdGF0dXMgIT09IDIwMCApIHsgcmV0dXJuOyB9XG4gICAgICAgICAgICAgICAgdGhpcy5zZXREYXRhISh7XG4gICAgICAgICAgICAgICAgICAgIHNob3BwaW5nOiBkYXRhXG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSlcbiAgICB9LFxuXG4gICAgLy8g5bGV5byA5o+Q56S6XG4gICAgdG9nZ2xlVGlwcyggKSB7XG4gICAgICAgIGNvbnN0IHsgc2hvd1RpcHMgfSA9IHRoaXMuZGF0YTtcbiAgICAgICAgdGhpcy5zZXREYXRhISh7XG4gICAgICAgICAgICBzaG93VGlwczogc2hvd1RpcHMgPT09ICdzaG93JyA/ICdoaWRlJyA6ICdzaG93J1xuICAgICAgICB9KTtcbiAgICB9LFxuXG4gICAgLy8g6L+b5YWl5ZWG5ZOB566h55CGXG4gICAgZ29NYW5hZ2VyKCApIHtcbiAgICAgICAgd3gubmF2aWdhdGVUbyh7XG4gICAgICAgICAgICB1cmw6IGAvcGFnZXMvbWFuYWdlci1nb29kcy1kZXRhaWwvaW5kZXg/aWQ9JHt0aGlzLmRhdGEuaWR9YFxuICAgICAgICB9KVxuICAgIH0sXG5cbiAgICAvKiog55uR5ZCs5YWo5bGA566h55CG5ZGY5p2D6ZmQICovXG4gICAgd2F0Y2hSb2xlKCApIHtcbiAgICAgICAgKGFwcCBhcyBhbnkpLndhdGNoJCgncm9sZScsICggdmFsICkgPT4ge1xuICAgICAgICAgICAgdGhpcy5zZXREYXRhISh7XG4gICAgICAgICAgICAgICAgc2hvd0J0bjogKCB2YWwgPT09IDEgKVxuICAgICAgICAgICAgfSlcbiAgICAgICAgfSk7XG4gICAgfSxcbiAgICBcbiAgICAvKiog6aKE6KeI5Zu+54mHICovXG4gICAgcHJldmlld0ltZyh7IGN1cnJlbnRUYXJnZXQgfSkge1xuICAgICAgICBjb25zdCB7IGltZyB9ID0gY3VycmVudFRhcmdldC5kYXRhc2V0O1xuICAgICAgICB0aGlzLmRhdGEuZGV0YWlsICYmIHd4LnByZXZpZXdJbWFnZSh7XG4gICAgICAgICAgICBjdXJyZW50OiBpbWcsXG4gICAgICAgICAgICB1cmxzOiBbIC4uLih0aGlzLmRhdGEgYXMgYW55KS5kZXRhaWwuaW1nIF0sXG4gICAgICAgIH0pO1xuICAgIH0sXG5cbiAgICAvKiog6aKE6KeI5Y2V5byg5Zu+54mH77ya5ou85Zui5Zu+54mH44CB5LiA5Y+j5Lu377yI6ZmQ5pe25oqi77yJICovXG4gICAgcHJldmlld1NpbmdsZUltZyh7IGN1cnJlbnRUYXJnZXQgfSkge1xuXG4gICAgICAgIGNvbnN0IGltZyA9IGN1cnJlbnRUYXJnZXQuZGF0YXNldC5kYXRhID9cbiAgICAgICAgICAgIGN1cnJlbnRUYXJnZXQuZGF0YXNldC5kYXRhLmltZzpcbiAgICAgICAgICAgIGN1cnJlbnRUYXJnZXQuZGF0YXNldC5pbWc7XG5cbiAgICAgICAgdGhpcy5kYXRhLmRldGFpbCAmJiB3eC5wcmV2aWV3SW1hZ2Uoe1xuICAgICAgICAgICAgY3VycmVudDogaW1nLFxuICAgICAgICAgICAgdXJsczogWyBpbWcgXSxcbiAgICAgICAgfSk7XG4gICAgfSxcblxuICAgIC8qKiDorr7nva7igJzllpzmrKLigJ0gKi9cbiAgICBvbkxpa2UoICkge1xuICAgICAgICBjb25zdCB0aGF0ID0gdGhpcztcbiAgICAgICAgaWYgKCAhdGhpcy5kYXRhLmhhc0luaXRMaWtlICkgeyByZXR1cm47IH1cbiAgICAgICAgd3guY2xvdWQuY2FsbEZ1bmN0aW9uKHtcbiAgICAgICAgICAgIG5hbWU6ICdhcGktbGlrZS1jb2xsZWN0aW9uJyxcbiAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICBwaWQ6IHRoaXMuZGF0YS5pZFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uICggcmVzOiBhbnkgKSB7XG4gICAgICAgICAgICAgICAgaWYgKCByZXMucmVzdWx0LnN0YXR1cyA9PT0gMjAwICkge1xuICAgICAgICAgICAgICAgICAgICB0aGF0LnNldERhdGEhKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxpa2VkOiAhdGhhdC5kYXRhLmxpa2VkXG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGZhaWw6IGZ1bmN0aW9uKCApIHtcbiAgICAgICAgICAgICAgICB3eC5zaG93VG9hc3Qoe1xuICAgICAgICAgICAgICAgICAgICBpY29uOiAnbm9uZScsXG4gICAgICAgICAgICAgICAgICAgIHRpdGxlOiAn6K6+572u4oCc5Zac5qyi4oCd6ZSZ6K+vJyxcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfSxcblxuICAgIC8qKiDorr7nva7igJzllpzmrKLigJ0gKi9cbiAgICBjaGVja0xpa2UoICkge1xuICAgICAgICBjb25zdCB0aGF0ID0gdGhpcztcbiAgICAgICAgd3guY2xvdWQuY2FsbEZ1bmN0aW9uKHtcbiAgICAgICAgICAgIG5hbWU6ICdhcGktbGlrZS1jb2xsZWN0aW9uLWRldGFpbCcsXG4gICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgcGlkOiB0aGlzLmRhdGEuaWRcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbiAoIHJlczogYW55ICkge1xuICAgICAgICAgICAgICAgIHRoYXQuc2V0RGF0YSEoe1xuICAgICAgICAgICAgICAgICAgICBoYXNJbml0TGlrZTogdHJ1ZVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIGlmICggcmVzLnJlc3VsdC5zdGF0dXMgPT09IDIwMCApIHtcbiAgICAgICAgICAgICAgICAgICAgdGhhdC5zZXREYXRhISh7XG4gICAgICAgICAgICAgICAgICAgICAgICBsaWtlZDogcmVzLnJlc3VsdC5kYXRhXG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGZhaWw6IGZ1bmN0aW9uKCApIHtcbiAgICAgICAgICAgICAgICB3eC5zaG93VG9hc3Qoe1xuICAgICAgICAgICAgICAgICAgICBpY29uOiAnbm9uZScsXG4gICAgICAgICAgICAgICAgICAgIHRpdGxlOiAn5p+l6K+i4oCc5Zac5qyi4oCd6ZSZ6K+vJyxcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIOeUn+WRveWRqOacn+WHveaVsC0t55uR5ZCs6aG16Z2i5Yqg6L29XG4gICAgICovXG4gICAgb25Mb2FkOiBmdW5jdGlvbiAob3B0aW9ucykge1xuICAgICAgICB0aGlzLndhdGNoUm9sZSggKTtcbiAgICAgICAgdGhpcy5ydW5Db21wdXRlZCggKTtcbiAgICAgICAgaWYgKCAhb3B0aW9ucyEuaWQgKSB7IHJldHVybjsgfVxuICAgICAgICB0aGlzLnNldERhdGEhKHtcbiAgICAgICAgICAgIGlkOiBvcHRpb25zIS5pZCxcbiAgICAgICAgICAgIHRpZDogb3B0aW9ucyEudGlkXG4gICAgICAgIH0pO1xuICAgIH0sXG4gIFxuICAgIC8qKlxuICAgICAqIOeUn+WRveWRqOacn+WHveaVsC0t55uR5ZCs6aG16Z2i5Yid5qyh5riy5p+T5a6M5oiQXG4gICAgICovXG4gICAgb25SZWFkeTogZnVuY3Rpb24gKCApIHtcbiAgICAgICAgbGV0IGNpcmNsZUNvdW50ID0gMDsgXG4gICAgICAgIGNvbnN0IHRoYXQ6IGFueSA9IHRoaXM7XG4gICAgICAgIC8vIOW/g+i3s+eahOWkluahhuWKqOeUuyBcbiAgICAgICAgdGhhdC5hbmltYXRpb25NaWRkbGVIZWFkZXJJdGVtID0gd3guY3JlYXRlQW5pbWF0aW9uKHsgXG4gICAgICAgICAgICBkdXJhdGlvbjogODAwLCBcbiAgICAgICAgICAgIHRpbWluZ0Z1bmN0aW9uOiAnZWFzZScsIFxuICAgICAgICAgICAgdHJhbnNmb3JtT3JpZ2luOiAnNTAlIDUwJScsXG4gICAgICAgIH0pOyBcbiAgICAgICAgc2V0SW50ZXJ2YWwoIGZ1bmN0aW9uKCApIHsgXG4gICAgICAgICAgICBpZiAoY2lyY2xlQ291bnQgJSAyID09IDApIHsgXG4gICAgICAgICAgICAgICAgdGhhdC5hbmltYXRpb25NaWRkbGVIZWFkZXJJdGVtLnNjYWxlKCAxLjAgKS5yb3RhdGUoIDEwICkuc3RlcCggKTsgXG4gICAgICAgICAgICB9IGVsc2UgeyBcbiAgICAgICAgICAgICAgICB0aGF0LmFuaW1hdGlvbk1pZGRsZUhlYWRlckl0ZW0uc2NhbGUoIDEuMCApLnJvdGF0ZSggLTMwICkuc3RlcCggKTsgXG4gICAgICAgICAgICB9IFxuICAgICAgICAgICAgdGhhdC5zZXREYXRhKHsgXG4gICAgICAgICAgICAgICAgYW5pbWF0aW9uTWlkZGxlSGVhZGVySXRlbTogdGhhdC5hbmltYXRpb25NaWRkbGVIZWFkZXJJdGVtLmV4cG9ydCggKSBcbiAgICAgICAgICAgIH0pOyBcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgaWYgKCArK2NpcmNsZUNvdW50ID09PSAxMDAwICkgeyBcbiAgICAgICAgICAgICAgICBjaXJjbGVDb3VudCA9IDA7IFxuICAgICAgICAgICAgfSBcbiAgICAgICAgfS5iaW5kKCB0aGlzICksIDEwMDAgKTsgXG4gICAgfSxcbiAgXG4gICAgLyoqXG4gICAgICog55Sf5ZG95ZGo5pyf5Ye95pWwLS3nm5HlkKzpobXpnaLmmL7npLpcbiAgICAgKi9cbiAgICBvblNob3c6IGZ1bmN0aW9uICggKSB7XG4gICAgICAgIGNvbnN0IHsgaWQsIHRpZCB9ID0gdGhpcy5kYXRhO1xuICAgICAgICAvLyB0aGlzLmZldGNoRGljKCApOyBcbiAgICAgICAgdGhpcy5jaGVja0xpa2UoICk7XG4gICAgICAgIHRoaXMuZmV0RGV0YWlsKCBpZCApO1xuICAgICAgICB0aGlzLmZldGNoU2hvcHBpbmcoIGlkLCB0aWQgKTtcbiAgICB9LFxuICBcbiAgICAvKipcbiAgICAgKiDnlJ/lkb3lkajmnJ/lh73mlbAtLeebkeWQrOmhtemdoumakOiXj1xuICAgICAqL1xuICAgIG9uSGlkZTogZnVuY3Rpb24gKCkge1xuICBcbiAgICB9LFxuICBcbiAgICAvKipcbiAgICAgKiDnlJ/lkb3lkajmnJ/lh73mlbAtLeebkeWQrOmhtemdouWNuOi9vVxuICAgICAqL1xuICAgIG9uVW5sb2FkOiBmdW5jdGlvbiAoKSB7XG4gIFxuICAgIH0sXG4gIFxuICAgIC8qKlxuICAgICAqIOmhtemdouebuOWFs+S6i+S7tuWkhOeQhuWHveaVsC0t55uR5ZCs55So5oi35LiL5ouJ5Yqo5L2cXG4gICAgICovXG4gICAgb25QdWxsRG93blJlZnJlc2g6IGZ1bmN0aW9uICgpIHtcbiAgXG4gICAgfSxcbiAgXG4gICAgLyoqXG4gICAgICog6aG16Z2i5LiK5ouJ6Kem5bqV5LqL5Lu255qE5aSE55CG5Ye95pWwXG4gICAgICovXG4gICAgb25SZWFjaEJvdHRvbTogZnVuY3Rpb24gKCkge1xuICBcbiAgICB9LFxuICBcbiAgICAvKipcbiAgICAgKiDnlKjmiLfngrnlh7vlj7PkuIrop5LliIbkuqtcbiAgICAgKi9cbiAgICBvblNoYXJlQXBwTWVzc2FnZTogZnVuY3Rpb24gKCApIHtcbiAgICAgICAgY29uc3QgeyBkZXRhaWwsIHBpbiQgfSA9IHRoaXMuZGF0YTtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHRpdGxlOiBgJHtwaW4kLmxlbmd0aCA9PT0gMCA/ICfnu5nkvaDnnIvnnIvov5nlrp3otJ3vvIEnIDogJ+S4gOi1t+aLvOWbouabtOWunuaDoO+8gSd9JHtkZXRhaWwudGl0bGV9YCxcbiAgICAgICAgICAgIHBhdGg6IGAvcGFnZXMvZ29vZC1kZXRhaWwvaW5kZXg/JHtkZXRhaWwuX2lkfSZ0aWQ9JHt0aGlzLmRhdGEudGlkfWAsXG4gICAgICAgICAgICBpbWFnZVVybDogYCR7ZGV0YWlsLmltZ1sgMCBdfWBcbiAgICAgICAgfVxuICAgIH1cbiAgfSkiXX0=