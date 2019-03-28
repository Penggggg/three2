"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var http_js_1 = require("../../util/http.js");
var index_js_1 = require("../../lib/vuefy/index.js");
var goods_js_1 = require("../../util/goods.js");
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
                    console.log('.....', result);
                    return result ? result.goodPins.eachPriceRound : '';
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
                return meta;
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
                tid: tid,
                detail: false
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
        this.setData({
            id: 'W_o__NWuZ2FdFeZK',
            tid: 'XDGzG97E7L4wLIdu'
        });
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUNBLDhDQUEwQztBQUMxQyxxREFBb0Q7QUFDcEQsZ0RBQXFEO0FBRXJELElBQU0sR0FBRyxHQUFHLE1BQU0sRUFBRyxDQUFDO0FBRXRCLElBQUksQ0FBQztJQUdELHlCQUF5QixFQUFFLElBQUk7SUFLL0IsSUFBSSxFQUFFO1FBRUYsR0FBRyxFQUFFLEVBQUU7UUFFUCxFQUFFLEVBQUUsRUFBRTtRQUVOLE1BQU0sRUFBRSxJQUFJO1FBRVosR0FBRyxFQUFFLEVBQUc7UUFFUixPQUFPLEVBQUUsSUFBSTtRQUViLFdBQVcsRUFBRSxLQUFLO1FBRWxCLEtBQUssRUFBRSxLQUFLO1FBRVosV0FBVyxFQUFFO1lBQ1QsTUFBTSxFQUFFLE1BQU0sRUFBRSxNQUFNO1NBQ3pCO1FBRUQseUJBQXlCLEVBQUUsSUFBSTtRQUUvQixPQUFPLEVBQUUsS0FBSztRQUVkLFFBQVEsRUFBRSxNQUFNO1FBRWhCLEdBQUcsRUFBRSxFQUFHO1FBRVIsUUFBUSxFQUFFLEVBQUc7UUFFYixVQUFVLEVBQUUsRUFBRztLQUNsQjtJQUdELFdBQVc7UUFDUCxtQkFBUSxDQUFFLElBQUksRUFBRTtZQUdaLEtBQUssRUFBRTtnQkFDSyxJQUFBLHlCQUFNLENBQWU7Z0JBQzdCLElBQU0sTUFBTSxHQUFHLHlCQUFjLENBQUUsTUFBTSxDQUFFLENBQUM7Z0JBQ3hDLE9BQU8sTUFBTSxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUM7WUFDdkMsQ0FBQztZQUdELFdBQVcsRUFBRTtnQkFDRCxJQUFBLHlCQUFNLENBQWU7Z0JBQzdCLElBQUssQ0FBQyxNQUFNLElBQUksQ0FBRSxDQUFDLENBQUMsTUFBTSxJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBRSxFQUFFO29CQUM1QyxPQUFPLEVBQUcsQ0FBQztpQkFDZDtxQkFB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TSxFQUFFO0lBRVIsQ0FBQztJQUtELFFBQVEsRUFBRTtJQUVWLENBQUM7SUFLRCxpQkFBaUIsRUFBRTtJQUVuQixDQUFDO0lBS0QsYUFBYSxFQUFFO0lBRWYsQ0FBQztJQUtELGlCQUFpQixFQUFFO1FBQ1QsSUFBQSxjQUE0QixFQUExQixrQkFBTSxFQUFFLGNBQWtCLENBQUM7UUFDbkMsT0FBTztZQUNILEtBQUssRUFBRSxNQUFHLElBQUksQ0FBQyxNQUFNLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLFVBQVUsSUFBRyxNQUFNLENBQUMsS0FBTztZQUN0RSxJQUFJLEVBQUUsOEJBQTRCLE1BQU0sQ0FBQyxHQUFHLGFBQVEsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFLO1lBQ25FLFFBQVEsRUFBRSxLQUFHLE1BQU0sQ0FBQyxHQUFHLENBQUUsQ0FBQyxDQUFJO1NBQ2pDLENBQUE7SUFDTCxDQUFDO0NBQ0YsQ0FBQyxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiXG5pbXBvcnQgeyBodHRwIH0gZnJvbSAnLi4vLi4vdXRpbC9odHRwLmpzJztcbmltcG9ydCB7IGNvbXB1dGVkIH0gZnJvbSAnLi4vLi4vbGliL3Z1ZWZ5L2luZGV4LmpzJztcbmltcG9ydCB7IGRlbGF5ZXJpbmdHb29kIH0gZnJvbSAnLi4vLi4vdXRpbC9nb29kcy5qcyc7XG5cbmNvbnN0IGFwcCA9IGdldEFwcCggKTtcblxuUGFnZSh7XG5cbiAgICAvLyDliqjnlLtcbiAgICBhbmltYXRpb25NaWRkbGVIZWFkZXJJdGVtOiBudWxsLFxuXG4gICAgLyoqXG4gICAgICog6aG16Z2i55qE5Yid5aeL5pWw5o2uXG4gICAgICovXG4gICAgZGF0YToge1xuICAgICAgICAvLyDooYznqItcbiAgICAgICAgdGlkOiAnJyxcbiAgICAgICAgLy8g5ZWG5ZOBaWRcbiAgICAgICAgaWQ6ICcnLFxuICAgICAgICAvLyDllYblk4Hor6bmg4VcbiAgICAgICAgZGV0YWlsOiBudWxsLFxuICAgICAgICAvLyDmlbDmja7lrZflhbhcbiAgICAgICAgZGljOiB7IH0sXG4gICAgICAgIC8vIOWKoOi9veeKtuaAgVxuICAgICAgICBsb2FkaW5nOiB0cnVlLFxuICAgICAgICAvLyDmmK/lkKbliJ3lp4vljJbov4figJzllpzmrKLigJ1cbiAgICAgICAgaGFzSW5pdExpa2U6IGZhbHNlLFxuICAgICAgICAvLyDmmK/lkKbigJzllpzmrKLigJ1cbiAgICAgICAgbGlrZWQ6IGZhbHNlLFxuICAgICAgICAvLyDmloflrZfkv53or4Hmj5DnpLpcbiAgICAgICAgcHJvbWlzZVRpcHM6IFtcbiAgICAgICAgICAgICfmraPlk4Hkv53or4EnLCAn5Lu35qC85LyY5Yq/JywgJ+ecn+S6uui3keiFvydcbiAgICAgICAgXSxcbiAgICAgICAgLy8g5Yqo55S7XG4gICAgICAgIGFuaW1hdGlvbk1pZGRsZUhlYWRlckl0ZW06IG51bGwsXG4gICAgICAgIC8vIOWxleekuueuoeeQhuWFpeWPo1xuICAgICAgICBzaG93QnRuOiBmYWxzZSxcbiAgICAgICAgLy8g5bGV56S65by55qGGXG4gICAgICAgIHNob3dUaXBzOiAnaGlkZScsXG4gICAgICAgIC8vIOaLvOWbouWIl+ihqFxuICAgICAgICBwaW46IFsgXSxcbiAgICAgICAgLy8g5ZWG5ZOB5Zyo5pys6KGM56iL55qE6LSt54mp5riF5Y2V5YiX6KGoXG4gICAgICAgIHNob3BwaW5nOiBbIF0sXG4gICAgICAgIC8vIOS4gOWPo+S7t+a0u+WKqOWIl+ihqFxuICAgICAgICBhY3Rpdml0aWVzOiBbIF1cbiAgICB9LFxuXG4gICAgLyoqIOiuvue9rmNvbXB1dGVkICovXG4gICAgcnVuQ29tcHV0ZWQoICkge1xuICAgICAgICBjb21wdXRlZCggdGhpcywge1xuXG4gICAgICAgICAgICAvLyDorqHnrpfku7fmoLxcbiAgICAgICAgICAgIHByaWNlOiBmdW5jdGlvbiggKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgeyBkZXRhaWwgfSA9IHRoaXMuZGF0YTtcbiAgICAgICAgICAgICAgICBjb25zdCByZXN1bHQgPSBkZWxheWVyaW5nR29vZCggZGV0YWlsICk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlc3VsdCA/IHJlc3VsdC5wcmljZSQgOiAnJztcbiAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgIC8vIOWVhuWTgeivpuaDhSAtIOWIhuihjOaYvuekulxuICAgICAgICAgICAgZGV0YWlsSW50cm86IGZ1bmN0aW9uKCApIHtcbiAgICAgICAgICAgICAgICBjb25zdCB7IGRldGFpbCB9ID0gdGhpcy5kYXRhO1xuICAgICAgICAgICAgICAgIGlmICggIWRldGFpbCB8fCAoICEhZGV0YWlsICYmICFkZXRhaWwuZGV0YWlsICkpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFsgXTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZGV0YWlsLmRldGFpbC5zcGxpdCgnXFxuJykuZmlsdGVyKCB4ID0+ICEheCApO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgIC8vIOS7t+agvCDvvZ4g5Zui6LSt5Lu355qE5beu5Lu3XG4gICAgICAgICAgICBwcmljZUdhcDogZnVuY3Rpb24oICkge1xuICAgICAgICAgICAgICAgIGNvbnN0IHsgZGV0YWlsIH0gPSB0aGlzLmRhdGE7XG4gICAgICAgICAgICAgICAgaWYgKCAhZGV0YWlsICkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gJydcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCByZXN1bHQgPSBkZWxheWVyaW5nR29vZCggZGV0YWlsICk7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCcuLi4uLicsIHJlc3VsdCApO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gcmVzdWx0ID8gcmVzdWx0Lmdvb2RQaW5zLmVhY2hQcmljZVJvdW5kIDogJyc7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAgLy8g5ou85Zui5YiX6KGoXG4gICAgICAgICAgICBwaW4kOiBmdW5jdGlvbiggKSB7XG4gICAgICAgICAgICAgICAgbGV0IG1ldGE6IGFueSA9IFsgXTtcbiAgICAgICAgICAgICAgICBjb25zdCB7IGRldGFpbCwgc2hvcHBpbmcsIGFjdGl2aXRpZXMgfSA9IHRoaXMuZGF0YTtcblxuICAgICAgICAgICAgICAgIGlmICggIWRldGFpbCApIHsgXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBbIF07XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgY29uc3QgeyBzdGFuZGFyZHMsIGdyb3VwUHJpY2UgfSA9IGRldGFpbDtcblxuICAgICAgICAgICAgICAgIGlmICggc3RhbmRhcmRzLmxlbmd0aCA+IDAgKSB7XG4gICAgICAgICAgICAgICAgICAgIG1ldGEgPSBzdGFuZGFyZHNcbiAgICAgICAgICAgICAgICAgICAgICAgIC5maWx0ZXIoIHggPT4gISF4Lmdyb3VwUHJpY2UgKVxuICAgICAgICAgICAgICAgICAgICAgICAgLm1hcCggeCA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIE9iamVjdC5hc3NpZ24oeyB9LCB4LCB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNpZDogeC5faWQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhblBpbjogISFzaG9wcGluZy5maW5kKCBzID0+IHMuc2lkID09PSB4Ll9pZCAmJiBzLnBpZCA9PT0geC5waWQgKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoICEhZ3JvdXBQcmljZSApIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgeyBwcmljZSwgdGl0bGUsIGltZywgX2lkIH0gPSBkZXRhaWw7XG4gICAgICAgICAgICAgICAgICAgIG1ldGEgPSBbe1xuICAgICAgICAgICAgICAgICAgICAgICAgcHJpY2UsXG4gICAgICAgICAgICAgICAgICAgICAgICBwaWQ6IF9pZCxcbiAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6IHRpdGxlLFxuICAgICAgICAgICAgICAgICAgICAgICAgZ3JvdXBQcmljZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHNpZDogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgICAgICAgICAgaW1nOiBpbWdbIDAgXSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhblBpbjogISFzaG9wcGluZy5maW5kKCBzID0+IHMucGlkID09PSBfaWQgKVxuICAgICAgICAgICAgICAgICAgICB9XTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAvLyDmoLnmja7mtLvliqjvvIzmm7TmlLnjgIHmlrDlop7mi7zlm6Lpobnnm65cbiAgICAgICAgICAgICAgICBhY3Rpdml0aWVzLm1hcCggYWMgPT4ge1xuICAgICAgICAgICAgICAgICAgICBpZiAoICFhYy5hY19ncm91cFByaWNlICkgeyByZXR1cm47IH1cbiAgICAgICAgICAgICAgICAgICAgY29uc3QgcGluVGFyZ2V0ID0gbWV0YS5maW5kKCB4ID0+IHgucGlkID09PSBhYy5waWQgJiYgeC5zaWQgPT09IGFjLnNpZCApO1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBwaW5UYXJnZXRJbmRleCA9IG1ldGEuZmluZEluZGV4KCB4ID0+IHgucGlkID09PSBhYy5waWQgJiYgeC5zaWQgPT09IGFjLnNpZCApO1xuXG4gICAgICAgICAgICAgICAgICAgIC8vIOabv+aNolxuICAgICAgICAgICAgICAgICAgICBpZiAoIHBpblRhcmdldEluZGV4ICE9PSAtMSApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG1ldGEuc3BsaWNlKCBwaW5UYXJnZXRJbmRleCwgMSwgT2JqZWN0LmFzc2lnbih7IH0sIHBpblRhcmdldCwge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHByaWNlOiBhYy5hY19wcmljZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBncm91cFByaWNlOiBhYy5hY19ncm91cFByaWNlXG4gICAgICAgICAgICAgICAgICAgICAgICB9KSk7XG5cbiAgICAgICAgICAgICAgICAgICAgLy8g5paw5aKeXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBtZXRhLnB1c2goe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNpZDogYWMuc2lkLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBpZDogYWMucGlkLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGltZzogYWMuaW1nLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6IGFjLnRpdGxlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhblBpbjogISFzaG9wcGluZy5maW5kKCBzID0+IHMuc2lkID09PSBhYy5zaWQgJiYgcy5waWQgPT09IGFjLnBpZCApLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHByaWNlOiBhYy5hY19wcmljZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBncm91cFByaWNlOiBhYy5hY19ncm91cFByaWNlIFxuICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIHJldHVybiBtZXRhO1xuICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAgLy8g6ams5LiK5Y+v5Lul5ou85Zui55qE5Liq5pWwXG4gICAgICAgICAgICBwaW5Db3VudCQ6IGZ1bmN0aW9uKCApIHtcbiAgICAgICAgICAgICAgICBjb25zdCB7IGRldGFpbCwgc2hvcHBpbmcgfSA9IHRoaXMuZGF0YTtcbiAgICAgICAgICAgICAgICBpZiAoICFkZXRhaWwgKSB7IFxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gMDtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBjb25zdCB7IHN0YW5kYXJkcywgZ3JvdXBQcmljZSB9ID0gZGV0YWlsO1xuXG4gICAgICAgICAgICAgICAgaWYgKCAhIXN0YW5kYXJkcyAmJiBzdGFuZGFyZHMubGVuZ3RoID4gMCApIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHN0YW5kYXJkc1xuICAgICAgICAgICAgICAgICAgICAgICAgLmZpbHRlciggeCA9PiAhIXNob3BwaW5nLmZpbmQoIHMgPT4gcy5zaWQgPT09IHguX2lkICYmIHMucGlkID09PSB4LnBpZCApKVxuICAgICAgICAgICAgICAgICAgICAgICAgLmxlbmd0aDtcblxuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoICEhZ3JvdXBQcmljZSApIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgeyBfaWQgfSA9IGRldGFpbDtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuICEhc2hvcHBpbmcuZmluZCggcyA9PiBzLnBpZCA9PT0gX2lkICkgPyAxIDogMFxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHJldHVybiAwO1xuICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAgLy8g5piv5ZCm5pyJ5Z6L5Y+3XG4gICAgICAgICAgICBoYXNTdGFuZGVycyQ6IGZ1bmN0aW9uKCApIHtcbiAgICAgICAgICAgICAgICBjb25zdCB7IGRldGFpbCB9ID0gdGhpcy5kYXRhO1xuICAgICAgICAgICAgICAgIGlmICggIWRldGFpbCApIHsgXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgY29uc3QgeyBzdGFuZGFyZHMgfSA9IGRldGFpbDtcbiAgICAgICAgICAgICAgICByZXR1cm4gISFzdGFuZGFyZHMgJiYgc3RhbmRhcmRzLmxlbmd0aCA+IDAgO1xuICAgICAgICAgICAgfSxcblxuICAgICAgICB9KVxuICAgIH0sXG5cbiAgICAvKiog5ouJ5Y+W5ZWG5ZOB6K+m5oOFICovXG4gICAgZmV0RGV0YWlsKCBpZCApIHtcbiAgICAgICAgY29uc3QgeyBkZXRhaWwgfSA9IHRoaXMuZGF0YTtcbiAgICAgICAgaWYgKCBkZXRhaWwgKSB7IHJldHVybjsgfVxuICAgICAgICBodHRwKHtcbiAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICBfaWQ6IGlkLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGVyck1zZzogJ+iOt+WPluWVhuWTgemUmeivr++8jOivt+mHjeivlScsXG4gICAgICAgICAgICB1cmw6IGBnb29kX2RldGFpbGAsXG4gICAgICAgICAgICBzdWNjZXNzOiByZXMgPT4ge1xuICAgICAgICAgICAgICBpZiAoIHJlcy5zdGF0dXMgIT09IDIwMCApIHsgcmV0dXJuOyB9XG5cbiAgICAgICAgICAgICAgICBsZXQgcGluOiBhbnkgPSBbIF07XG4gICAgICAgICAgICAgICAgY29uc3QgeyBzdGFuZGFyZHMsIGdyb3VwUHJpY2UsIGFjdGl2aXRpZXMgfSA9IHJlcy5kYXRhO1xuXG4gICAgICAgICAgICAgICAgaWYgKCBzdGFuZGFyZHMubGVuZ3RoID4gMCApIHtcbiAgICAgICAgICAgICAgICAgICAgcGluID0gc3RhbmRhcmRzLmZpbHRlciggeCA9PiAhIXguZ3JvdXBQcmljZSApO1xuXG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmICggISFncm91cFByaWNlICkge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCB7IHByaWNlLCB0aXRsZSwgaW1nICB9ID0gcmVzLmRhdGE7XG4gICAgICAgICAgICAgICAgICAgIHBpbiA9IFt7XG4gICAgICAgICAgICAgICAgICAgICAgICBwcmljZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6IHRpdGxlLFxuICAgICAgICAgICAgICAgICAgICAgICAgZ3JvdXBQcmljZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGltZzogaW1nWyAwIF1cbiAgICAgICAgICAgICAgICAgICAgfV07XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgY29uc3QgYWN0aXZpdGllcyQgPSBhY3Rpdml0aWVzLm1hcCggeCA9PiB7XG5cbiAgICAgICAgICAgICAgICAgICAgbGV0IGltZyA9ICcnO1xuICAgICAgICAgICAgICAgICAgICBpZiAoICEheC5zaWQgKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpbWcgPSBzdGFuZGFyZHMuZmluZCggeSA9PiB5Ll9pZCA9PT0geC5zaWQgKS5pbWdcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGltZyA9IHJlcy5kYXRhLmltZ1sgMCBdO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIE9iamVjdC5hc3NpZ24oeyB9LCB4LCB7IFxuICAgICAgICAgICAgICAgICAgICAgICAgaW1nLFxuICAgICAgICAgICAgICAgICAgICAgICAgY291bnRkb3duOiAoIHguZW5kVGltZSAtIG5ldyBEYXRlKCApLmdldFRpbWUoICkpIC8gKCAxMDAwIClcbiAgICAgICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICB9KS5maWx0ZXIoIHkgPT4geS5lbmRUaW1lID4gbmV3IERhdGUoICkuZ2V0VGltZSggKSk7XG5cbiAgICAgICAgICAgICAgICB0aGlzLnNldERhdGEhKHtcbiAgICAgICAgICAgICAgICAgICAgcGluLFxuICAgICAgICAgICAgICAgICAgICBsb2FkaW5nOiBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgZGV0YWlsOiByZXMuZGF0YSxcbiAgICAgICAgICAgICAgICAgICAgYWN0aXZpdGllczogYWN0aXZpdGllcyRcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfSxcblxuICAgIC8qKiDmi4nlj5bmlbDmja7lrZflhbggKi9cbiAgICBmZXRjaERpYyggKSB7XG4gICAgICAgIGNvbnN0IHsgZGljIH0gPSB0aGlzLmRhdGE7XG4gICAgICAgIGlmICggT2JqZWN0LmtleXMoIGRpYyApLmxlbmd0aCA+IDAgKSB7IHJldHVybjsgfVxuICAgICAgICBodHRwKHtcbiAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgZGljTmFtZTogJ2dvb2RzX2NhdGVnb3J5JyxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBlcnJNc2c6ICfliqDovb3lpLHotKXvvIzor7fph43or5UnLFxuICAgICAgICAgICAgdXJsOiBgY29tbW9uX2RpY2AsXG4gICAgICAgICAgICBzdWNjZXNzOiByZXMgPT4ge1xuICAgICAgICAgICAgICBpZiAoIHJlcy5zdGF0dXMgIT09IDIwMCApIHsgcmV0dXJuOyB9XG4gICAgICAgICAgICAgIHRoaXMuc2V0RGF0YSEoe1xuICAgICAgICAgICAgICAgICAgICBkaWM6IHJlcy5kYXRhXG4gICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9LFxuXG4gICAgLyoqIOaLieWPluW9k+WJjeWVhuWTgeeahOi0reeJqeivt+WNleS/oeaBryAqL1xuICAgIGZldGNoU2hvcHBpbmcoIHBpZCwgdGlkICkge1xuICAgICAgICBodHRwKHtcbiAgICAgICAgICAgIHVybDogJ3Nob3BwaW5nLWxpc3RfcGluJyxcbiAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICBwaWQsXG4gICAgICAgICAgICAgICAgdGlkLFxuICAgICAgICAgICAgICAgIGRldGFpbDogZmFsc2VcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBzdWNjZXNzOiByZXMgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IHsgc3RhdHVzLCBkYXRhIH0gPSByZXM7XG4gICAgICAgICAgICAgICAgaWYgKCBzdGF0dXMgIT09IDIwMCApIHsgcmV0dXJuOyB9XG4gICAgICAgICAgICAgICAgdGhpcy5zZXREYXRhISh7XG4gICAgICAgICAgICAgICAgICAgIHNob3BwaW5nOiBkYXRhXG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSlcbiAgICB9LFxuXG4gICAgLy8g5bGV5byA5o+Q56S6XG4gICAgdG9nZ2xlVGlwcyggKSB7XG4gICAgICAgIGNvbnN0IHsgc2hvd1RpcHMgfSA9IHRoaXMuZGF0YTtcbiAgICAgICAgdGhpcy5zZXREYXRhISh7XG4gICAgICAgICAgICBzaG93VGlwczogc2hvd1RpcHMgPT09ICdzaG93JyA/ICdoaWRlJyA6ICdzaG93J1xuICAgICAgICB9KTtcbiAgICB9LFxuXG4gICAgLy8g6L+b5YWl5ZWG5ZOB566h55CGXG4gICAgZ29NYW5hZ2VyKCApIHtcbiAgICAgICAgd3gubmF2aWdhdGVUbyh7XG4gICAgICAgICAgICB1cmw6IGAvcGFnZXMvbWFuYWdlci1nb29kcy1kZXRhaWwvaW5kZXg/aWQ9JHt0aGlzLmRhdGEuaWR9YFxuICAgICAgICB9KVxuICAgIH0sXG5cbiAgICAvKiog55uR5ZCs5YWo5bGA566h55CG5ZGY5p2D6ZmQICovXG4gICAgd2F0Y2hSb2xlKCApIHtcbiAgICAgICAgKGFwcCBhcyBhbnkpLndhdGNoJCgncm9sZScsICggdmFsICkgPT4ge1xuICAgICAgICAgICAgdGhpcy5zZXREYXRhISh7XG4gICAgICAgICAgICAgICAgc2hvd0J0bjogKCB2YWwgPT09IDEgKVxuICAgICAgICAgICAgfSlcbiAgICAgICAgfSk7XG4gICAgfSxcbiAgICBcbiAgICAvKiog6aKE6KeI5Zu+54mHICovXG4gICAgcHJldmlld0ltZyh7IGN1cnJlbnRUYXJnZXQgfSkge1xuICAgICAgICBjb25zdCB7IGltZyB9ID0gY3VycmVudFRhcmdldC5kYXRhc2V0O1xuICAgICAgICB0aGlzLmRhdGEuZGV0YWlsICYmIHd4LnByZXZpZXdJbWFnZSh7XG4gICAgICAgICAgICBjdXJyZW50OiBpbWcsXG4gICAgICAgICAgICB1cmxzOiBbIC4uLih0aGlzLmRhdGEgYXMgYW55KS5kZXRhaWwuaW1nIF0sXG4gICAgICAgIH0pO1xuICAgIH0sXG5cbiAgICAvKiog6aKE6KeI5Y2V5byg5Zu+54mH77ya5ou85Zui5Zu+54mH44CB5LiA5Y+j5Lu377yI6ZmQ5pe25oqi77yJICovXG4gICAgcHJldmlld1NpbmdsZUltZyh7IGN1cnJlbnRUYXJnZXQgfSkge1xuXG4gICAgICAgIGNvbnN0IGltZyA9IGN1cnJlbnRUYXJnZXQuZGF0YXNldC5kYXRhID9cbiAgICAgICAgICAgIGN1cnJlbnRUYXJnZXQuZGF0YXNldC5kYXRhLmltZzpcbiAgICAgICAgICAgIGN1cnJlbnRUYXJnZXQuZGF0YXNldC5pbWc7XG5cbiAgICAgICAgdGhpcy5kYXRhLmRldGFpbCAmJiB3eC5wcmV2aWV3SW1hZ2Uoe1xuICAgICAgICAgICAgY3VycmVudDogaW1nLFxuICAgICAgICAgICAgdXJsczogWyBpbWcgXSxcbiAgICAgICAgfSk7XG4gICAgfSxcblxuICAgIC8qKiDorr7nva7igJzllpzmrKLigJ0gKi9cbiAgICBvbkxpa2UoICkge1xuICAgICAgICBjb25zdCB0aGF0ID0gdGhpcztcbiAgICAgICAgaWYgKCAhdGhpcy5kYXRhLmhhc0luaXRMaWtlICkgeyByZXR1cm47IH1cbiAgICAgICAgd3guY2xvdWQuY2FsbEZ1bmN0aW9uKHtcbiAgICAgICAgICAgIG5hbWU6ICdhcGktbGlrZS1jb2xsZWN0aW9uJyxcbiAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICBwaWQ6IHRoaXMuZGF0YS5pZFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uICggcmVzOiBhbnkgKSB7XG4gICAgICAgICAgICAgICAgaWYgKCByZXMucmVzdWx0LnN0YXR1cyA9PT0gMjAwICkge1xuICAgICAgICAgICAgICAgICAgICB0aGF0LnNldERhdGEhKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxpa2VkOiAhdGhhdC5kYXRhLmxpa2VkXG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGZhaWw6IGZ1bmN0aW9uKCApIHtcbiAgICAgICAgICAgICAgICB3eC5zaG93VG9hc3Qoe1xuICAgICAgICAgICAgICAgICAgICBpY29uOiAnbm9uZScsXG4gICAgICAgICAgICAgICAgICAgIHRpdGxlOiAn6K6+572u4oCc5Zac5qyi4oCd6ZSZ6K+vJyxcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfSxcblxuICAgIC8qKiDorr7nva7igJzllpzmrKLigJ0gKi9cbiAgICBjaGVja0xpa2UoICkge1xuICAgICAgICBjb25zdCB0aGF0ID0gdGhpcztcbiAgICAgICAgd3guY2xvdWQuY2FsbEZ1bmN0aW9uKHtcbiAgICAgICAgICAgIG5hbWU6ICdhcGktbGlrZS1jb2xsZWN0aW9uLWRldGFpbCcsXG4gICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgcGlkOiB0aGlzLmRhdGEuaWRcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbiAoIHJlczogYW55ICkge1xuICAgICAgICAgICAgICAgIHRoYXQuc2V0RGF0YSEoe1xuICAgICAgICAgICAgICAgICAgICBoYXNJbml0TGlrZTogdHJ1ZVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIGlmICggcmVzLnJlc3VsdC5zdGF0dXMgPT09IDIwMCApIHtcbiAgICAgICAgICAgICAgICAgICAgdGhhdC5zZXREYXRhISh7XG4gICAgICAgICAgICAgICAgICAgICAgICBsaWtlZDogcmVzLnJlc3VsdC5kYXRhXG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGZhaWw6IGZ1bmN0aW9uKCApIHtcbiAgICAgICAgICAgICAgICB3eC5zaG93VG9hc3Qoe1xuICAgICAgICAgICAgICAgICAgICBpY29uOiAnbm9uZScsXG4gICAgICAgICAgICAgICAgICAgIHRpdGxlOiAn5p+l6K+i4oCc5Zac5qyi4oCd6ZSZ6K+vJyxcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIOeUn+WRveWRqOacn+WHveaVsC0t55uR5ZCs6aG16Z2i5Yqg6L29XG4gICAgICovXG4gICAgb25Mb2FkOiBmdW5jdGlvbiAob3B0aW9ucykge1xuICAgICAgICB0aGlzLndhdGNoUm9sZSggKTtcbiAgICAgICAgdGhpcy5ydW5Db21wdXRlZCggKTtcbiAgICAgICAgXG4gICAgICAgIC8vIGlkPVdfb19fTld1WjJGZEZlWksmdGlkPVhER3pHOTdFN0w0d0xJZHVcbiAgICAgICAgdGhpcy5zZXREYXRhISh7XG4gICAgICAgICAgICBpZDogJ1dfb19fTld1WjJGZEZlWksnLFxuICAgICAgICAgICAgdGlkOiAnWERHekc5N0U3TDR3TElkdSdcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaWYgKCAhb3B0aW9ucyEuaWQgKSB7IHJldHVybjsgfVxuICAgICAgICB0aGlzLnNldERhdGEhKHtcbiAgICAgICAgICAgIGlkOiBvcHRpb25zIS5pZCxcbiAgICAgICAgICAgIHRpZDogb3B0aW9ucyEudGlkXG4gICAgICAgIH0pO1xuICAgIH0sXG4gIFxuICAgIC8qKlxuICAgICAqIOeUn+WRveWRqOacn+WHveaVsC0t55uR5ZCs6aG16Z2i5Yid5qyh5riy5p+T5a6M5oiQXG4gICAgICovXG4gICAgb25SZWFkeTogZnVuY3Rpb24gKCApIHtcbiAgICAgICAgbGV0IGNpcmNsZUNvdW50ID0gMDsgXG4gICAgICAgIGNvbnN0IHRoYXQ6IGFueSA9IHRoaXM7XG4gICAgICAgIC8vIOW/g+i3s+eahOWkluahhuWKqOeUuyBcbiAgICAgICAgdGhhdC5hbmltYXRpb25NaWRkbGVIZWFkZXJJdGVtID0gd3guY3JlYXRlQW5pbWF0aW9uKHsgXG4gICAgICAgICAgICBkdXJhdGlvbjogODAwLCBcbiAgICAgICAgICAgIHRpbWluZ0Z1bmN0aW9uOiAnZWFzZScsIFxuICAgICAgICAgICAgdHJhbnNmb3JtT3JpZ2luOiAnNTAlIDUwJScsXG4gICAgICAgIH0pOyBcbiAgICAgICAgc2V0SW50ZXJ2YWwoIGZ1bmN0aW9uKCApIHsgXG4gICAgICAgICAgICBpZiAoY2lyY2xlQ291bnQgJSAyID09IDApIHsgXG4gICAgICAgICAgICAgICAgdGhhdC5hbmltYXRpb25NaWRkbGVIZWFkZXJJdGVtLnNjYWxlKCAxLjAgKS5yb3RhdGUoIDEwICkuc3RlcCggKTsgXG4gICAgICAgICAgICB9IGVsc2UgeyBcbiAgICAgICAgICAgICAgICB0aGF0LmFuaW1hdGlvbk1pZGRsZUhlYWRlckl0ZW0uc2NhbGUoIDEuMCApLnJvdGF0ZSggLTMwICkuc3RlcCggKTsgXG4gICAgICAgICAgICB9IFxuICAgICAgICAgICAgdGhhdC5zZXREYXRhKHsgXG4gICAgICAgICAgICAgICAgYW5pbWF0aW9uTWlkZGxlSGVhZGVySXRlbTogdGhhdC5hbmltYXRpb25NaWRkbGVIZWFkZXJJdGVtLmV4cG9ydCggKSBcbiAgICAgICAgICAgIH0pOyBcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgaWYgKCArK2NpcmNsZUNvdW50ID09PSAxMDAwICkgeyBcbiAgICAgICAgICAgICAgICBjaXJjbGVDb3VudCA9IDA7IFxuICAgICAgICAgICAgfSBcbiAgICAgICAgfS5iaW5kKCB0aGlzICksIDEwMDAgKTsgXG4gICAgfSxcbiAgXG4gICAgLyoqXG4gICAgICog55Sf5ZG95ZGo5pyf5Ye95pWwLS3nm5HlkKzpobXpnaLmmL7npLpcbiAgICAgKi9cbiAgICBvblNob3c6IGZ1bmN0aW9uICggKSB7XG4gICAgICAgIGNvbnN0IHsgaWQsIHRpZCB9ID0gdGhpcy5kYXRhO1xuICAgICAgICAvLyB0aGlzLmZldGNoRGljKCApOyBcbiAgICAgICAgdGhpcy5jaGVja0xpa2UoICk7XG4gICAgICAgIHRoaXMuZmV0RGV0YWlsKCBpZCApO1xuICAgICAgICB0aGlzLmZldGNoU2hvcHBpbmcoIGlkLCB0aWQgKTtcbiAgICB9LFxuICBcbiAgICAvKipcbiAgICAgKiDnlJ/lkb3lkajmnJ/lh73mlbAtLeebkeWQrOmhtemdoumakOiXj1xuICAgICAqL1xuICAgIG9uSGlkZTogZnVuY3Rpb24gKCkge1xuICBcbiAgICB9LFxuICBcbiAgICAvKipcbiAgICAgKiDnlJ/lkb3lkajmnJ/lh73mlbAtLeebkeWQrOmhtemdouWNuOi9vVxuICAgICAqL1xuICAgIG9uVW5sb2FkOiBmdW5jdGlvbiAoKSB7XG4gIFxuICAgIH0sXG4gIFxuICAgIC8qKlxuICAgICAqIOmhtemdouebuOWFs+S6i+S7tuWkhOeQhuWHveaVsC0t55uR5ZCs55So5oi35LiL5ouJ5Yqo5L2cXG4gICAgICovXG4gICAgb25QdWxsRG93blJlZnJlc2g6IGZ1bmN0aW9uICgpIHtcbiAgXG4gICAgfSxcbiAgXG4gICAgLyoqXG4gICAgICog6aG16Z2i5LiK5ouJ6Kem5bqV5LqL5Lu255qE5aSE55CG5Ye95pWwXG4gICAgICovXG4gICAgb25SZWFjaEJvdHRvbTogZnVuY3Rpb24gKCkge1xuICBcbiAgICB9LFxuICBcbiAgICAvKipcbiAgICAgKiDnlKjmiLfngrnlh7vlj7PkuIrop5LliIbkuqtcbiAgICAgKi9cbiAgICBvblNoYXJlQXBwTWVzc2FnZTogZnVuY3Rpb24gKCApIHtcbiAgICAgICAgY29uc3QgeyBkZXRhaWwsIHBpbiQgfSA9IHRoaXMuZGF0YTtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHRpdGxlOiBgJHtwaW4kLmxlbmd0aCA9PT0gMCA/ICfnu5nkvaDnnIvnnIvov5nlrp3otJ3vvIEnIDogJ+S4gOi1t+aLvOWbouabtOWunuaDoO+8gSd9JHtkZXRhaWwudGl0bGV9YCxcbiAgICAgICAgICAgIHBhdGg6IGAvcGFnZXMvZ29vZC1kZXRhaWwvaW5kZXg/JHtkZXRhaWwuX2lkfSZ0aWQ9JHt0aGlzLmRhdGEudGlkfWAsXG4gICAgICAgICAgICBpbWFnZVVybDogYCR7ZGV0YWlsLmltZ1sgMCBdfWBcbiAgICAgICAgfVxuICAgIH1cbiAgfSkiXX0=