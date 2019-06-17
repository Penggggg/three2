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
        canPinSku: []
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
                    return result ? result.goodPins.eachPriceRound.replace(/\.00/g, '') : '';
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
                    _this.setData({
                        tid: data[0]._id
                    });
                    _this.fetchShopping(id, tid);
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
        if (!options.tid) {
            this.fetchLast();
        }
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
        var _a = this.data, detail = _a.detail, pin$ = _a.pin$, activities = _a.activities, priceGap = _a.priceGap;
        return {
            title: "" + (priceGap !== '' && Number(priceGap) !== 0 ?
                activities.length === 0 ?
                    "\u4E00\u8D77\u4E70\uFF01\u4E00\u8D77\u7701" + String(priceGap).replace(/\.00/g, '') + "\u5143\uFF01" :
                    '限时特价超实惠！' :
                '给你看看这宝贝！') + detail.title,
            path: "/pages/goods-detail/index?id=" + detail._id + "&tid=" + this.data.tid,
            imageUrl: "" + detail.img[0]
        };
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUNBLDhDQUEwQztBQUMxQyxxREFBb0Q7QUFDcEQsZ0RBQXFEO0FBQ3JELGdEQUE0QztBQUU1QyxJQUFNLEdBQUcsR0FBRyxNQUFNLEVBQUcsQ0FBQztBQUV0QixJQUFJLENBQUM7SUFHRCx5QkFBeUIsRUFBRSxJQUFJO0lBSy9CLElBQUksRUFBRTtRQUdGLEtBQUssRUFBRSxJQUFJO1FBR1gsR0FBRyxFQUFFLEVBQUU7UUFHUCxFQUFFLEVBQUUsRUFBRTtRQUdOLE1BQU0sRUFBRSxJQUFJO1FBR1osR0FBRyxFQUFFLEVBQUc7UUFHUixPQUFPLEVBQUUsSUFBSTtRQUdiLFdBQVcsRUFBRSxLQUFLO1FBR2xCLEtBQUssRUFBRSxLQUFLO1FBR1osV0FBVyxFQUFFO1lBQ1QsTUFBTSxFQUFFLE1BQU0sRUFBRSxNQUFNO1NBQ3pCO1FBR0QseUJBQXlCLEVBQUUsSUFBSTtRQUcvQixPQUFPLEVBQUUsS0FBSztRQUdkLGFBQWEsRUFBRSxLQUFLO1FBR3BCLFFBQVEsRUFBRSxNQUFNO1FBR2hCLEdBQUcsRUFBRSxFQUFHO1FBR1IsUUFBUSxFQUFFLEVBQUc7UUFHYixVQUFVLEVBQUUsRUFBRztRQUdmLFNBQVMsRUFBRSxFQUFHO0tBQ2pCO0lBR0QsV0FBVztRQUNQLG1CQUFRLENBQUUsSUFBSSxFQUFFO1lBR1osS0FBSyxFQUFFO2dCQUNLLElBQUEseUJBQU0sQ0FBZTtnQkFDN0IsSUFBTSxNQUFNLEdBQUcseUJBQWMsQ0FBRSxNQUFNLENBQUUsQ0FBQztnQkFDeEMsT0FBTyxNQUFNLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQztZQUN2QyxDQUFDO1lBR0QsV0FBVyxFQUFFO2dCQUNELElBQUEseUJBQU0sQ0FBZTtnQkFDN0IsSUFBSyxDQUFDLE1BQU0sSUFBSSxDQUFFLENBQUMsQ0FB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SUFBSSxDQUFDLFNBQVMsQ0FBRSxFQUFFLENBQUUsQ0FBQztRQUNyQixJQUFJLENBQUMsYUFBYSxDQUFFLEVBQUUsRUFBRSxHQUFHLENBQUUsQ0FBQztJQUNsQyxDQUFDO0lBS0QsTUFBTSxFQUFFO0lBRVIsQ0FBQztJQUtELFFBQVEsRUFBRTtJQUVWLENBQUM7SUFLRCxpQkFBaUIsRUFBRTtJQUVuQixDQUFDO0lBS0QsYUFBYSxFQUFFO0lBRWYsQ0FBQztJQUtELGlCQUFpQixFQUFFO1FBQ1QsSUFBQSxjQUFrRCxFQUFoRCxrQkFBTSxFQUFFLGNBQUksRUFBRSwwQkFBVSxFQUFFLHNCQUFzQixDQUFDO1FBQ3pELE9BQU87WUFDSCxLQUFLLEVBQUUsTUFBRyxRQUFRLEtBQUssRUFBRSxJQUFJLE1BQU0sQ0FBRSxRQUFRLENBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQztnQkFDM0MsVUFBVSxDQUFDLE1BQU0sS0FBSyxDQUFDLENBQUMsQ0FBQztvQkFDckIsK0NBQVUsTUFBTSxDQUFFLFFBQVEsQ0FBRSxDQUFDLE9BQU8sQ0FBQyxPQUFPLEVBQUUsRUFBRSxDQUFDLGlCQUFJLENBQUMsQ0FBQztvQkFDdkQsVUFBVSxDQUFDLENBQUM7Z0JBQ2hCLFVBQVUsSUFDZixNQUFNLENBQUMsS0FBTztZQUNyQixJQUFJLEVBQUUsa0NBQWdDLE1BQU0sQ0FBQyxHQUFHLGFBQVEsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFLO1lBQ3ZFLFFBQVEsRUFBRSxLQUFHLE1BQU0sQ0FBQyxHQUFHLENBQUUsQ0FBQyxDQUFJO1NBQ2pDLENBQUE7SUFDTCxDQUFDO0NBQ0YsQ0FBQyxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiXG5pbXBvcnQgeyBodHRwIH0gZnJvbSAnLi4vLi4vdXRpbC9odHRwLmpzJztcbmltcG9ydCB7IGNvbXB1dGVkIH0gZnJvbSAnLi4vLi4vbGliL3Z1ZWZ5L2luZGV4LmpzJztcbmltcG9ydCB7IGRlbGF5ZXJpbmdHb29kIH0gZnJvbSAnLi4vLi4vdXRpbC9nb29kcy5qcyc7XG5pbXBvcnQgeyBuYXZUbyB9IGZyb20gJy4uLy4uL3V0aWwvcm91dGUuanMnO1xuXG5jb25zdCBhcHAgPSBnZXRBcHAoICk7XG5cblBhZ2Uoe1xuXG4gICAgLy8g5Yqo55S7XG4gICAgYW5pbWF0aW9uTWlkZGxlSGVhZGVySXRlbTogbnVsbCxcblxuICAgIC8qKlxuICAgICAqIOmhtemdoueahOWIneWni+aVsOaNrlxuICAgICAqL1xuICAgIGRhdGE6IHtcblxuICAgICAgICAvLyDmmK/lkKbkuLrmlrDlrqJcbiAgICAgICAgaXNOZXc6IHRydWUsXG5cbiAgICAgICAgLy8g6KGM56iLXG4gICAgICAgIHRpZDogJycsXG5cbiAgICAgICAgLy8g5ZWG5ZOBaWRcbiAgICAgICAgaWQ6ICcnLFxuXG4gICAgICAgIC8vIOWVhuWTgeivpuaDhVxuICAgICAgICBkZXRhaWw6IG51bGwsXG4gICAgICAgIFxuICAgICAgICAvLyDmlbDmja7lrZflhbhcbiAgICAgICAgZGljOiB7IH0sXG4gICAgICAgIFxuICAgICAgICAvLyDliqDovb3nirbmgIFcbiAgICAgICAgbG9hZGluZzogdHJ1ZSxcblxuICAgICAgICAvLyDmmK/lkKbliJ3lp4vljJbov4figJzllpzmrKLigJ1cbiAgICAgICAgaGFzSW5pdExpa2U6IGZhbHNlLFxuXG4gICAgICAgIC8vIOaYr+WQpuKAnOWWnOasouKAnVxuICAgICAgICBsaWtlZDogZmFsc2UsXG5cbiAgICAgICAgLy8g5paH5a2X5L+d6K+B5o+Q56S6XG4gICAgICAgIHByb21pc2VUaXBzOiBbXG4gICAgICAgICAgICAn5q2j5ZOB5L+d6K+BJywgJ+S7t+agvOS8mOWKvycsICfnnJ/kurrot5Hohb8nXG4gICAgICAgIF0sXG5cbiAgICAgICAgLy8g5Yqo55S7XG4gICAgICAgIGFuaW1hdGlvbk1pZGRsZUhlYWRlckl0ZW06IG51bGwsXG5cbiAgICAgICAgLy8g5bGV56S6566h55CG5YWl5Y+jXG4gICAgICAgIHNob3dCdG46IGZhbHNlLFxuXG4gICAgICAgIC8vIOato+WcqOWxleekuua1t+aKpVxuICAgICAgICBzaG93aW5nUG9zdGVyOiBmYWxzZSxcblxuICAgICAgICAvLyDlsZXnpLrlvLnmoYZcbiAgICAgICAgc2hvd1RpcHM6ICdoaWRlJyxcblxuICAgICAgICAvLyDmi7zlm6LliJfooahcbiAgICAgICAgcGluOiBbIF0sXG5cbiAgICAgICAgLy8g5ZWG5ZOB5Zyo5pys6KGM56iL55qE6LSt54mp5riF5Y2V5YiX6KGoXG4gICAgICAgIHNob3BwaW5nOiBbIF0sXG5cbiAgICAgICAgLy8g5LiA5Y+j5Lu35rS75Yqo5YiX6KGoXG4gICAgICAgIGFjdGl2aXRpZXM6IFsgXSxcblxuICAgICAgICAvLyDmnKzotp/og73lpJ/mi7zlm6LnmoRza3VcbiAgICAgICAgY2FuUGluU2t1OiBbIF1cbiAgICB9LFxuXG4gICAgLyoqIOiuvue9rmNvbXB1dGVkICovXG4gICAgcnVuQ29tcHV0ZWQoICkge1xuICAgICAgICBjb21wdXRlZCggdGhpcywge1xuXG4gICAgICAgICAgICAvLyDorqHnrpfku7fmoLxcbiAgICAgICAgICAgIHByaWNlOiBmdW5jdGlvbiggKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgeyBkZXRhaWwgfSA9IHRoaXMuZGF0YTtcbiAgICAgICAgICAgICAgICBjb25zdCByZXN1bHQgPSBkZWxheWVyaW5nR29vZCggZGV0YWlsICk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlc3VsdCA/IHJlc3VsdC5wcmljZSQgOiAnJztcbiAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgIC8vIOWVhuWTgeivpuaDhSAtIOWIhuihjOaYvuekulxuICAgICAgICAgICAgZGV0YWlsSW50cm86IGZ1bmN0aW9uKCApIHtcbiAgICAgICAgICAgICAgICBjb25zdCB7IGRldGFpbCB9ID0gdGhpcy5kYXRhO1xuICAgICAgICAgICAgICAgIGlmICggIWRldGFpbCB8fCAoICEhZGV0YWlsICYmICFkZXRhaWwuZGV0YWlsICkpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFsgXTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZGV0YWlsLmRldGFpbC5zcGxpdCgnXFxuJykuZmlsdGVyKCB4ID0+ICEheCApO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgIC8vIOS7t+agvCDvvZ4g5Zui6LSt5Lu355qE5beu5Lu3XG4gICAgICAgICAgICBwcmljZUdhcDogZnVuY3Rpb24oICkge1xuICAgICAgICAgICAgICAgIGNvbnN0IHsgZGV0YWlsIH0gPSB0aGlzLmRhdGE7XG4gICAgICAgICAgICAgICAgaWYgKCAhZGV0YWlsICkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gJydcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCByZXN1bHQgPSBkZWxheWVyaW5nR29vZCggZGV0YWlsICk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiByZXN1bHQgPyByZXN1bHQuZ29vZFBpbnMuZWFjaFByaWNlUm91bmQucmVwbGFjZSgvXFwuMDAvZywgJycpIDogJyc7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAgLy8g5ou85Zui5YiX6KGoXG4gICAgICAgICAgICBwaW4kOiBmdW5jdGlvbiggKSB7XG4gICAgICAgICAgICAgICAgbGV0IG1ldGE6IGFueSA9IFsgXTtcbiAgICAgICAgICAgICAgICBjb25zdCB7IGRldGFpbCwgc2hvcHBpbmcsIGFjdGl2aXRpZXMgfSA9IHRoaXMuZGF0YTtcblxuICAgICAgICAgICAgICAgIGlmICggIWRldGFpbCApIHsgXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBbIF07XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgY29uc3QgeyBzdGFuZGFyZHMsIGdyb3VwUHJpY2UgfSA9IGRldGFpbDtcblxuICAgICAgICAgICAgICAgIGlmICggc3RhbmRhcmRzLmxlbmd0aCA+IDAgKSB7XG4gICAgICAgICAgICAgICAgICAgIG1ldGEgPSBzdGFuZGFyZHNcbiAgICAgICAgICAgICAgICAgICAgICAgIC5maWx0ZXIoIHggPT4gISF4Lmdyb3VwUHJpY2UgKVxuICAgICAgICAgICAgICAgICAgICAgICAgLm1hcCggeCA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIE9iamVjdC5hc3NpZ24oeyB9LCB4LCB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNpZDogeC5faWQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhblBpbjogISFzaG9wcGluZy5maW5kKCBzID0+IHMuc2lkID09PSB4Ll9pZCAmJiBzLnBpZCA9PT0geC5waWQgKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoICEhZ3JvdXBQcmljZSApIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgeyBwcmljZSwgdGl0bGUsIGltZywgX2lkIH0gPSBkZXRhaWw7XG4gICAgICAgICAgICAgICAgICAgIG1ldGEgPSBbe1xuICAgICAgICAgICAgICAgICAgICAgICAgcHJpY2UsXG4gICAgICAgICAgICAgICAgICAgICAgICBwaWQ6IF9pZCxcbiAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6IHRpdGxlLFxuICAgICAgICAgICAgICAgICAgICAgICAgZ3JvdXBQcmljZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHNpZDogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgICAgICAgICAgaW1nOiBpbWdbIDAgXSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhblBpbjogISFzaG9wcGluZy5maW5kKCBzID0+IHMucGlkID09PSBfaWQgKVxuICAgICAgICAgICAgICAgICAgICB9XTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAvLyDmoLnmja7mtLvliqjvvIzmm7TmlLnjgIHmlrDlop7mi7zlm6Lpobnnm65cbiAgICAgICAgICAgICAgICBhY3Rpdml0aWVzLm1hcCggYWMgPT4ge1xuICAgICAgICAgICAgICAgICAgICBpZiAoICFhYy5hY19ncm91cFByaWNlICkgeyByZXR1cm47IH1cbiAgICAgICAgICAgICAgICAgICAgY29uc3QgcGluVGFyZ2V0ID0gbWV0YS5maW5kKCB4ID0+IHgucGlkID09PSBhYy5waWQgJiYgeC5zaWQgPT09IGFjLnNpZCApO1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBwaW5UYXJnZXRJbmRleCA9IG1ldGEuZmluZEluZGV4KCB4ID0+IHgucGlkID09PSBhYy5waWQgJiYgeC5zaWQgPT09IGFjLnNpZCApO1xuXG4gICAgICAgICAgICAgICAgICAgIC8vIOabv+aNolxuICAgICAgICAgICAgICAgICAgICBpZiAoIHBpblRhcmdldEluZGV4ICE9PSAtMSApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG1ldGEuc3BsaWNlKCBwaW5UYXJnZXRJbmRleCwgMSwgT2JqZWN0LmFzc2lnbih7IH0sIHBpblRhcmdldCwge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHByaWNlOiBhYy5hY19wcmljZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBncm91cFByaWNlOiBhYy5hY19ncm91cFByaWNlXG4gICAgICAgICAgICAgICAgICAgICAgICB9KSk7XG5cbiAgICAgICAgICAgICAgICAgICAgLy8g5paw5aKeXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBtZXRhLnB1c2goe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNpZDogYWMuc2lkLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBpZDogYWMucGlkLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGltZzogYWMuaW1nLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6IGFjLnRpdGxlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhblBpbjogISFzaG9wcGluZy5maW5kKCBzID0+IHMuc2lkID09PSBhYy5zaWQgJiYgcy5waWQgPT09IGFjLnBpZCApLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHByaWNlOiBhYy5hY19wcmljZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBncm91cFByaWNlOiBhYy5hY19ncm91cFByaWNlIFxuICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgY29uc3QgbWV0YTIgPSBtZXRhLm1hcCggeCA9PiBPYmplY3QuYXNzaWduKHsgfSwgeCwge1xuICAgICAgICAgICAgICAgICAgICBkZWx0YTogTnVtYmVyKCB4LnByaWNlIC0geC5ncm91cFByaWNlICkudG9GaXhlZCggMCApXG4gICAgICAgICAgICAgICAgfSkpO1xuICAgICAgICAgICAgICAgIHJldHVybiBtZXRhMjtcbiAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgIC8vIOmprOS4iuWPr+S7peaLvOWboueahOS4quaVsFxuICAgICAgICAgICAgcGluQ291bnQkOiBmdW5jdGlvbiggKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgeyBkZXRhaWwsIHNob3BwaW5nIH0gPSB0aGlzLmRhdGE7XG4gICAgICAgICAgICAgICAgaWYgKCAhZGV0YWlsICkgeyBcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIDA7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgY29uc3QgeyBzdGFuZGFyZHMsIGdyb3VwUHJpY2UgfSA9IGRldGFpbDtcblxuICAgICAgICAgICAgICAgIGlmICggISFzdGFuZGFyZHMgJiYgc3RhbmRhcmRzLmxlbmd0aCA+IDAgKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBzdGFuZGFyZHNcbiAgICAgICAgICAgICAgICAgICAgICAgIC5maWx0ZXIoIHggPT4gISFzaG9wcGluZy5maW5kKCBzID0+IHMuc2lkID09PSB4Ll9pZCAmJiBzLnBpZCA9PT0geC5waWQgKSlcbiAgICAgICAgICAgICAgICAgICAgICAgIC5sZW5ndGg7XG5cbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKCAhIWdyb3VwUHJpY2UgKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHsgX2lkIH0gPSBkZXRhaWw7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAhIXNob3BwaW5nLmZpbmQoIHMgPT4gcy5waWQgPT09IF9pZCApID8gMSA6IDBcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gMDtcbiAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgIC8vIOaYr+WQpuacieWei+WPt1xuICAgICAgICAgICAgaGFzU3RhbmRlcnMkOiBmdW5jdGlvbiggKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgeyBkZXRhaWwgfSA9IHRoaXMuZGF0YTtcbiAgICAgICAgICAgICAgICBpZiAoICFkZXRhaWwgKSB7IFxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGNvbnN0IHsgc3RhbmRhcmRzIH0gPSBkZXRhaWw7XG4gICAgICAgICAgICAgICAgcmV0dXJuICEhc3RhbmRhcmRzICYmIHN0YW5kYXJkcy5sZW5ndGggPiAwIDtcbiAgICAgICAgICAgIH0sXG5cbiAgICAgICAgfSlcbiAgICB9LFxuXG4gICAgLyoqIOaLieWPluWVhuWTgeivpuaDhSAqL1xuICAgIGZldERldGFpbCggaWQgKSB7XG4gICAgICAgIGNvbnN0IHsgZGV0YWlsIH0gPSB0aGlzLmRhdGE7XG4gICAgICAgIGlmICggZGV0YWlsICkgeyByZXR1cm47IH1cbiAgICAgICAgaHR0cCh7XG4gICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgX2lkOiBpZCxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBlcnJNc2c6ICfojrflj5bllYblk4HplJnor6/vvIzor7fph43or5UnLFxuICAgICAgICAgICAgdXJsOiBgZ29vZF9kZXRhaWxgLFxuICAgICAgICAgICAgc3VjY2VzczogcmVzID0+IHtcbiAgICAgICAgICAgICAgaWYgKCByZXMuc3RhdHVzICE9PSAyMDAgKSB7IHJldHVybjsgfVxuXG4gICAgICAgICAgICAgICAgbGV0IHBpbjogYW55ID0gWyBdO1xuICAgICAgICAgICAgICAgIGNvbnN0IHsgc3RhbmRhcmRzLCBncm91cFByaWNlLCBhY3Rpdml0aWVzIH0gPSByZXMuZGF0YTtcblxuICAgICAgICAgICAgICAgIGlmICggc3RhbmRhcmRzLmxlbmd0aCA+IDAgKSB7XG4gICAgICAgICAgICAgICAgICAgIHBpbiA9IHN0YW5kYXJkcy5maWx0ZXIoIHggPT4gISF4Lmdyb3VwUHJpY2UgKTtcblxuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoICEhZ3JvdXBQcmljZSApIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgeyBwcmljZSwgdGl0bGUsIGltZyAgfSA9IHJlcy5kYXRhO1xuICAgICAgICAgICAgICAgICAgICBwaW4gPSBbe1xuICAgICAgICAgICAgICAgICAgICAgICAgcHJpY2UsXG4gICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiB0aXRsZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGdyb3VwUHJpY2UsXG4gICAgICAgICAgICAgICAgICAgICAgICBpbWc6IGltZ1sgMCBdXG4gICAgICAgICAgICAgICAgICAgIH1dO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGNvbnN0IGFjdGl2aXRpZXMkID0gYWN0aXZpdGllcy5tYXAoIHggPT4ge1xuXG4gICAgICAgICAgICAgICAgICAgIGxldCBpbWcgPSAnJztcbiAgICAgICAgICAgICAgICAgICAgaWYgKCAhIXguc2lkICkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaW1nID0gc3RhbmRhcmRzLmZpbmQoIHkgPT4geS5faWQgPT09IHguc2lkICkuaW1nXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpbWcgPSByZXMuZGF0YS5pbWdbIDAgXTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBPYmplY3QuYXNzaWduKHsgfSwgeCwgeyBcbiAgICAgICAgICAgICAgICAgICAgICAgIGltZyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvdW50ZG93bjogKCB4LmVuZFRpbWUgLSBuZXcgRGF0ZSggKS5nZXRUaW1lKCApKSAvICggMTAwMCApXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgfSkuZmlsdGVyKCB5ID0+IHkuZW5kVGltZSA+IG5ldyBEYXRlKCApLmdldFRpbWUoICkpO1xuXG4gICAgICAgICAgICAgICAgdGhpcy5zZXREYXRhISh7XG4gICAgICAgICAgICAgICAgICAgIHBpbixcbiAgICAgICAgICAgICAgICAgICAgbG9hZGluZzogZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgIGRldGFpbDogcmVzLmRhdGEsXG4gICAgICAgICAgICAgICAgICAgIGFjdGl2aXRpZXM6IGFjdGl2aXRpZXMkXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH0sXG5cbiAgICAvKiog5ouJ5Y+W5b2T5YmN5ZWG5ZOB55qE6LSt54mp6K+35Y2V5L+h5oGvICovXG4gICAgZmV0Y2hTaG9wcGluZyggcGlkLCB0aWQgKSB7XG5cbiAgICAgICAgaWYgKCAhcGlkIHx8ICF0aWQgKSB7IHJldHVybjsgfVxuXG4gICAgICAgIGh0dHAoe1xuICAgICAgICAgICAgdXJsOiAnc2hvcHBpbmctbGlzdF9waW4nLFxuICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgIHBpZCxcbiAgICAgICAgICAgICAgICB0aWQsXG4gICAgICAgICAgICAgICAgZGV0YWlsOiBmYWxzZVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHN1Y2Nlc3M6IHJlcyA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3QgeyBzdGF0dXMsIGRhdGEgfSA9IHJlcztcbiAgICAgICAgICAgICAgICBpZiAoIHN0YXR1cyAhPT0gMjAwICkgeyByZXR1cm47IH1cbiAgICAgICAgICAgICAgICB0aGlzLnNldERhdGEhKHtcbiAgICAgICAgICAgICAgICAgICAgc2hvcHBpbmc6IGRhdGEsXG4gICAgICAgICAgICAgICAgICAgIGNhblBpblNrdTogZGF0YS5tYXAoIHggPT4gKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHBpZDogeC5waWQsXG4gICAgICAgICAgICAgICAgICAgICAgICBzaWQ6IHguc2lkXG4gICAgICAgICAgICAgICAgICAgIH0pKVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KVxuICAgIH0sXG5cbiAgICAvKiog5ouJ5Y+W5Lik5Liq5pyA5paw6KGM56iLICovXG4gICAgZmV0Y2hMYXN0KCApIHtcbiAgICAgICAgY29uc3QgeyBpZCB9ID0gdGhpcy5kYXRhO1xuICAgICAgICBodHRwKHtcbiAgICAgICAgICAgIGRhdGE6IHsgfSxcbiAgICAgICAgICAgIHVybDogYHRyaXBfZW50ZXJgLFxuICAgICAgICAgICAgc3VjY2VzczogcmVzID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCB7IHN0YXR1cywgZGF0YSB9ID0gcmVzO1xuICAgICAgICAgICAgICAgIGlmICggc3RhdHVzICE9PSAyMDAgKSB7IHJldHVybjsgfVxuXG4gICAgICAgICAgICAgICAgaWYgKCAhIWRhdGFbIDAgXSkge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCB0aWQgPSBkYXRhWyAwIF0uX2lkXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc2V0RGF0YSEoe1xuICAgICAgICAgICAgICAgICAgICAgICAgdGlkOiBkYXRhWyAwIF0uX2lkXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmZldGNoU2hvcHBpbmcoIGlkLCB0aWQgKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgfSxcblxuICAgIC8vIOWxleW8gOaPkOekulxuICAgIHRvZ2dsZVRpcHMoIGUgKSB7XG4gICAgICAgIGNvbnN0IHsgc2hvd1RpcHMgfSA9IHRoaXMuZGF0YTtcbiAgICAgICAgdGhpcy5zZXREYXRhISh7XG4gICAgICAgICAgICBzaG93VGlwczogc2hvd1RpcHMgPT09ICdzaG93JyA/ICdoaWRlJyA6ICdzaG93J1xuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy5jcmVhdGVGb3JtSWQoIGUuZGV0YWlsLmZvcm1JZCApO1xuICAgIH0sXG5cbiAgICAvLyDov5vlhaXllYblk4HnrqHnkIZcbiAgICBnb01hbmFnZXIoICkge1xuICAgICAgICBuYXZUbyhgL3BhZ2VzL21hbmFnZXItZ29vZHMtZGV0YWlsL2luZGV4P2lkPSR7dGhpcy5kYXRhLmlkfWApXG4gICAgfSxcblxuICAgIC8qKiDnm5HlkKzlhajlsYDnrqHnkIblkZjmnYPpmZAgKi9cbiAgICB3YXRjaFJvbGUoICkge1xuICAgICAgICAoYXBwIGFzIGFueSkud2F0Y2gkKCdyb2xlJywgKCB2YWwgKSA9PiB7XG4gICAgICAgICAgICB0aGlzLnNldERhdGEhKHtcbiAgICAgICAgICAgICAgICBzaG93QnRuOiAoIHZhbCA9PT0gMSApXG4gICAgICAgICAgICB9KVxuICAgICAgICB9KTtcbiAgICAgICAgKGFwcCBhcyBhbnkpLndhdGNoJCgnaXNOZXcnLCB2YWwgPT4ge1xuICAgICAgICAgICAgdGhpcy5zZXREYXRhISh7XG4gICAgICAgICAgICAgICAgaXNOZXc6IHZhbFxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH0sXG4gICAgXG4gICAgLyoqIOmihOiniOWbvueJhyAqL1xuICAgIHByZXZpZXdJbWcoeyBjdXJyZW50VGFyZ2V0IH0pIHtcbiAgICAgICAgY29uc3QgeyBpbWcgfSA9IGN1cnJlbnRUYXJnZXQuZGF0YXNldDtcbiAgICAgICAgdGhpcy5kYXRhLmRldGFpbCAmJiB3eC5wcmV2aWV3SW1hZ2Uoe1xuICAgICAgICAgICAgY3VycmVudDogaW1nLFxuICAgICAgICAgICAgdXJsczogWyAuLi4odGhpcy5kYXRhIGFzIGFueSkuZGV0YWlsLmltZyBdLFxuICAgICAgICB9KTtcbiAgICB9LFxuXG4gICAgLyoqIOmihOiniOWNleW8oOWbvueJh++8muaLvOWbouWbvueJh+OAgeS4gOWPo+S7t++8iOmZkOaXtuaKou+8iSAqL1xuICAgIHByZXZpZXdTaW5nbGVJbWcoeyBjdXJyZW50VGFyZ2V0IH0pIHtcblxuICAgICAgICBjb25zdCBpbWcgPSBjdXJyZW50VGFyZ2V0LmRhdGFzZXQuZGF0YSA/XG4gICAgICAgICAgICBjdXJyZW50VGFyZ2V0LmRhdGFzZXQuZGF0YS5pbWc6XG4gICAgICAgICAgICBjdXJyZW50VGFyZ2V0LmRhdGFzZXQuaW1nO1xuXG4gICAgICAgIHRoaXMuZGF0YS5kZXRhaWwgJiYgd3gucHJldmlld0ltYWdlKHtcbiAgICAgICAgICAgIGN1cnJlbnQ6IGltZyxcbiAgICAgICAgICAgIHVybHM6IFsgaW1nIF0sXG4gICAgICAgIH0pO1xuICAgIH0sXG5cbiAgICAvKiog6K6+572u4oCc5Zac5qyi4oCdICovXG4gICAgb25MaWtlKCApIHtcbiAgICAgICAgY29uc3QgdGhhdCA9IHRoaXM7XG4gICAgICAgIGlmICggIXRoaXMuZGF0YS5oYXNJbml0TGlrZSApIHsgcmV0dXJuOyB9XG4gICAgICAgIGh0dHAoe1xuICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgIHBpZDogdGhpcy5kYXRhLmlkXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgdXJsOiAnbGlrZV9jcmVhdGUnLFxuICAgICAgICAgICAgc3VjY2VzczogICggcmVzOiBhbnkgKSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKCByZXMuc3RhdHVzID09PSAyMDAgKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc2V0RGF0YSEoe1xuICAgICAgICAgICAgICAgICAgICAgICAgbGlrZWQ6ICF0aGlzLmRhdGEubGlrZWRcbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH0sXG5cbiAgICAvKiog6K6+572u4oCc5Zac5qyi4oCdICovXG4gICAgY2hlY2tMaWtlKCApIHtcbiAgICAgICAgY29uc3QgdGhhdCA9IHRoaXM7XG4gICAgICAgIGh0dHAoe1xuICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgIHBpZDogdGhpcy5kYXRhLmlkXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgdXJsOiAnbGlrZV9jaGVjaycsXG4gICAgICAgICAgICBzdWNjZXNzOiAgKCByZXM6IGFueSApID0+IHtcbiAgICAgICAgICAgICAgICBpZiAoIHJlcy5zdGF0dXMgPT09IDIwMCApIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zZXREYXRhISh7XG4gICAgICAgICAgICAgICAgICAgICAgICBsaWtlZDogcmVzLmRhdGEsXG4gICAgICAgICAgICAgICAgICAgICAgICBoYXNJbml0TGlrZTogdHJ1ZVxuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfSxcblxuICAgIC8qKiDmtbfmiqXlvIDlhbMgKi9cbiAgICBvblBvc3RUb2dnbGUoIGUgKSB7XG4gICAgICAgIGNvbnN0IHZhbCA9IGUuZGV0YWlsO1xuICAgICAgICB0aGlzLnNldERhdGEhKHtcbiAgICAgICAgICAgIHNob3dpbmdQb3N0ZXI6IHZhbFxuICAgICAgICB9KTtcbiAgICAgICAgd3guc2V0TmF2aWdhdGlvbkJhclRpdGxlKHtcbiAgICAgICAgICAgIHRpdGxlOiB2YWwgPyAn5YiG5Lqr5ZWG5ZOBJyA6ICfllYblk4Hor6bmg4UnXG4gICAgICAgIH0pO1xuICAgIH0sXG5cbiAgICBjcmVhdGVGb3JtSWQoIGZvcm1pZCApIHtcbiAgICAgICAgaWYgKCAhZm9ybWlkICkgeyByZXR1cm47IH1cbiAgICAgICAgaHR0cCh7XG4gICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgZm9ybWlkXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgbG9hZGluZ01zZzogJ25vbmUnLFxuICAgICAgICAgICAgdXJsOiAnY29tbW9uX2NyZWF0ZS1mb3JtaWQnLFxuICAgICAgICB9KVxuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiDnlJ/lkb3lkajmnJ/lh73mlbAtLeebkeWQrOmhtemdouWKoOi9vVxuICAgICAqL1xuICAgIG9uTG9hZDogZnVuY3Rpb24gKG9wdGlvbnMpIHtcblxuICAgICAgICBjb25zdCBzY2VuZSA9IGRlY29kZVVSSUNvbXBvbmVudCggb3B0aW9ucyEuc2NlbmUgfHwgJycgKVxuICAgICAgICBcbiAgICAgICAgdGhpcy53YXRjaFJvbGUoICk7XG4gICAgICAgIHRoaXMucnVuQ29tcHV0ZWQoICk7XG5cbiAgICAgICAgaWYgKCAhb3B0aW9ucyEudGlkICkge1xuICAgICAgICAgICAgdGhpcy5mZXRjaExhc3QoICk7XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgIGlmICggIW9wdGlvbnMhLmlkICYmICFzY2VuZSApIHsgcmV0dXJuOyB9XG4gICAgICAgIHRoaXMuc2V0RGF0YSEoe1xuICAgICAgICAgICAgaWQ6IG9wdGlvbnMhLmlkIHx8IHNjZW5lLFxuICAgICAgICB9KTtcblxuICAgICAgICBpZiAoICEhKG9wdGlvbnMgYXMgYW55KS50aWQgKSB7XG4gICAgICAgICAgICB0aGlzLnNldERhdGEhKHtcbiAgICAgICAgICAgICAgICB0aWQ6IG9wdGlvbnMhLnRpZFxuICAgICAgICAgICAgfSlcbiAgICAgICAgfVxuICAgIH0sXG4gIFxuICAgIC8qKlxuICAgICAqIOeUn+WRveWRqOacn+WHveaVsC0t55uR5ZCs6aG16Z2i5Yid5qyh5riy5p+T5a6M5oiQXG4gICAgICovXG4gICAgb25SZWFkeTogZnVuY3Rpb24gKCApIHtcbiAgICAgICAgbGV0IGNpcmNsZUNvdW50ID0gMDsgXG4gICAgICAgIGNvbnN0IHRoYXQ6IGFueSA9IHRoaXM7XG4gICAgICAgIC8vIOW/g+i3s+eahOWkluahhuWKqOeUuyBcbiAgICAgICAgdGhhdC5hbmltYXRpb25NaWRkbGVIZWFkZXJJdGVtID0gd3guY3JlYXRlQW5pbWF0aW9uKHsgXG4gICAgICAgICAgICBkdXJhdGlvbjogODAwLCBcbiAgICAgICAgICAgIHRpbWluZ0Z1bmN0aW9uOiAnZWFzZScsIFxuICAgICAgICAgICAgdHJhbnNmb3JtT3JpZ2luOiAnNTAlIDUwJScsXG4gICAgICAgIH0pOyBcbiAgICAgICAgc2V0SW50ZXJ2YWwoIGZ1bmN0aW9uKCApIHsgXG4gICAgICAgICAgICBpZiAoY2lyY2xlQ291bnQgJSAyID09IDApIHsgXG4gICAgICAgICAgICAgICAgdGhhdC5hbmltYXRpb25NaWRkbGVIZWFkZXJJdGVtLnNjYWxlKCAxLjAgKS5yb3RhdGUoIDEwICkuc3RlcCggKTsgXG4gICAgICAgICAgICB9IGVsc2UgeyBcbiAgICAgICAgICAgICAgICB0aGF0LmFuaW1hdGlvbk1pZGRsZUhlYWRlckl0ZW0uc2NhbGUoIDEuMCApLnJvdGF0ZSggLTMwICkuc3RlcCggKTsgXG4gICAgICAgICAgICB9IFxuICAgICAgICAgICAgdGhhdC5zZXREYXRhKHsgXG4gICAgICAgICAgICAgICAgYW5pbWF0aW9uTWlkZGxlSGVhZGVySXRlbTogdGhhdC5hbmltYXRpb25NaWRkbGVIZWFkZXJJdGVtLmV4cG9ydCggKSBcbiAgICAgICAgICAgIH0pOyBcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgaWYgKCArK2NpcmNsZUNvdW50ID09PSAxMDAwICkgeyBcbiAgICAgICAgICAgICAgICBjaXJjbGVDb3VudCA9IDA7IFxuICAgICAgICAgICAgfSBcbiAgICAgICAgfS5iaW5kKCB0aGlzICksIDEwMDAgKTsgXG4gICAgfSxcbiAgXG4gICAgLyoqXG4gICAgICog55Sf5ZG95ZGo5pyf5Ye95pWwLS3nm5HlkKzpobXpnaLmmL7npLpcbiAgICAgKi9cbiAgICBvblNob3c6IGZ1bmN0aW9uICggKSB7XG4gICAgICAgIGNvbnN0IHsgaWQsIHRpZCB9ID0gdGhpcy5kYXRhO1xuXG4gICAgICAgIHRoaXMuY2hlY2tMaWtlKCApO1xuICAgICAgICB0aGlzLmZldERldGFpbCggaWQgKTtcbiAgICAgICAgdGhpcy5mZXRjaFNob3BwaW5nKCBpZCwgdGlkICk7XG4gICAgfSxcbiAgXG4gICAgLyoqXG4gICAgICog55Sf5ZG95ZGo5pyf5Ye95pWwLS3nm5HlkKzpobXpnaLpmpDol49cbiAgICAgKi9cbiAgICBvbkhpZGU6IGZ1bmN0aW9uICgpIHtcbiAgXG4gICAgfSxcbiAgXG4gICAgLyoqXG4gICAgICog55Sf5ZG95ZGo5pyf5Ye95pWwLS3nm5HlkKzpobXpnaLljbjovb1cbiAgICAgKi9cbiAgICBvblVubG9hZDogZnVuY3Rpb24gKCkge1xuICBcbiAgICB9LFxuICBcbiAgICAvKipcbiAgICAgKiDpobXpnaLnm7jlhbPkuovku7blpITnkIblh73mlbAtLeebkeWQrOeUqOaIt+S4i+aLieWKqOS9nFxuICAgICAqL1xuICAgIG9uUHVsbERvd25SZWZyZXNoOiBmdW5jdGlvbiAoKSB7XG4gIFxuICAgIH0sXG4gIFxuICAgIC8qKlxuICAgICAqIOmhtemdouS4iuaLieinpuW6leS6i+S7tueahOWkhOeQhuWHveaVsFxuICAgICAqL1xuICAgIG9uUmVhY2hCb3R0b206IGZ1bmN0aW9uICgpIHtcbiAgXG4gICAgfSxcbiAgXG4gICAgLyoqXG4gICAgICog55So5oi354K55Ye75Y+z5LiK6KeS5YiG5LqrXG4gICAgICovXG4gICAgb25TaGFyZUFwcE1lc3NhZ2U6IGZ1bmN0aW9uICggKSB7XG4gICAgICAgIGNvbnN0IHsgZGV0YWlsLCBwaW4kLCBhY3Rpdml0aWVzLCBwcmljZUdhcCB9ID0gdGhpcy5kYXRhO1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgdGl0bGU6IGAke3ByaWNlR2FwICE9PSAnJyAmJiBOdW1iZXIoIHByaWNlR2FwICkgIT09IDAgPyBcbiAgICAgICAgICAgICAgICAgICAgICAgIGFjdGl2aXRpZXMubGVuZ3RoID09PSAwID9cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBg5LiA6LW35Lmw77yB5LiA6LW355yBJHtTdHJpbmcoIHByaWNlR2FwICkucmVwbGFjZSgvXFwuMDAvZywgJycpfeWFg++8gWAgOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICfpmZDml7bnibnku7fotoXlrp7mg6DvvIEnIDogXG4gICAgICAgICAgICAgICAgICAgICAgICAn57uZ5L2g55yL55yL6L+Z5a6d6LSd77yBJ1xuICAgICAgICAgICAgICAgIH0ke2RldGFpbC50aXRsZX1gLFxuICAgICAgICAgICAgcGF0aDogYC9wYWdlcy9nb29kcy1kZXRhaWwvaW5kZXg/aWQ9JHtkZXRhaWwuX2lkfSZ0aWQ9JHt0aGlzLmRhdGEudGlkfWAsXG4gICAgICAgICAgICBpbWFnZVVybDogYCR7ZGV0YWlsLmltZ1sgMCBdfWBcbiAgICAgICAgfVxuICAgIH1cbiAgfSkiXX0=