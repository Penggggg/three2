"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var http_js_1 = require("../../util/http.js");
var index_js_1 = require("../../lib/vuefy/index.js");
Page({
    animationMiddleHeaderItem: null,
    data: {
        id: '',
        detail: null,
        dic: {},
        loading: true,
        hasInitLike: false,
        liked: false,
        promiseTips: [
            '正品保证', '价格优势', '真人跑腿'
        ],
        animationMiddleHeaderItem: null
    },
    fetDetail: function (id) {
        var _this = this;
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
                _this.setData({
                    detail: res.data,
                    loading: false
                });
            }
        });
    },
    fetchDic: function () {
        var _this = this;
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
    previewImg: function (_a) {
        var currentTarget = _a.currentTarget;
        var img = currentTarget.dataset.img;
        this.data.detail && wx.previewImage({
            current: img,
            urls: this.data.detail.img.slice(),
        });
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
                            return price - groupPrice;
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
                                return (sortedGroupPrice[0].price - sortedGroupPrice[0].groupPrice);
                            }
                            else {
                                return sortedGroupPrice[sortedGroupPrice.length - 1].price - sortedGroupPrice[sortedGroupPrice.length - 1].groupPrice + "~" + (sortedGroupPrice[0].price - sortedGroupPrice[0].groupPrice);
                            }
                        }
                        else {
                            return 0;
                        }
                    }
                }
            }
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
        this.runComputed();
        if (!options.id) {
            return;
        }
        this.setData({
            id: options.id
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
        this.fetchDic();
        this.checkLike();
        this.fetDetail(this.data.id);
    },
    onHide: function () {
    },
    onUnload: function () {
    },
    onPullDownRefresh: function () {
    },
    onReachBottom: function () {
    },
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUVBLDhDQUEwQztBQUMxQyxxREFBb0Q7QUFFcEQsSUFBSSxDQUFDO0lBR0QseUJBQXlCLEVBQUUsSUFBSTtJQUsvQixJQUFJLEVBQUU7UUFFRixFQUFFLEVBQUUsRUFBRTtRQUVOLE1BQU0sRUFBRSxJQUFJO1FBRVosR0FBRyxFQUFFLEVBQUc7UUFFUixPQUFPLEVBQUUsSUFBSTtRQUViLFdBQVcsRUFBRSxLQUFLO1FBRWxCLEtBQUssRUFBRSxLQUFLO1FBRVosV0FBVyxFQUFFO1lBQ1QsTUFBTSxFQUFFLE1BQU0sRUFBRSxNQUFNO1NBQ3pCO1FBRUQseUJBQXlCLEVBQUUsSUFBSTtLQUNsQztJQUdELFNBQVMsWUFBRSxFQUFFO1FBQWIsaUJBZUM7UUFkRyxjQUFJLENBQUM7WUFDRCxJQUFJLEVBQUU7Z0JBQ0YsR0FBRyxFQUFFLEVBQUU7YUFDVjtZQUNELE1BQU0sRUFBRSxZQUFZO1lBQ3BCLEdBQUcsRUFBRSxhQUFhO1lBQ2xCLE9BQU8sRUFBRSxVQUFBLEdBQUc7Z0JBQ1YsSUFBSyxHQUFHLENBQUMsTUFBTSxLQUFLLEdBQUcsRUFBRztvQkFBRSxPQUFPO2lCQUFFO2dCQUNuQyxLQUFJLENBQUMsT0FBUSxDQUFDO29CQUNWLE1BQU0sRUFBRSxHQUFHLENBQUMsSUFBSTtvQkFDaEIsT0FBTyxFQUFFLEtBQUs7aUJBQ2pCLENBQUMsQ0FBQztZQUNQLENBQUM7U0FDSixDQUFDLENBQUM7SUFDUCxDQUFDO0lBR0QsUUFBUTtRQUFSLGlCQWNDO1FBYkcsY0FBSSxDQUFDO1lBQ0QsSUFBSSxFQUFFO2dCQUNKLE9BQU8sRUFBRSxnQkFBZ0I7YUFDMUI7WUFDRCxNQUFNLEVBQUUsVUFBVTtZQUNsQixHQUFHLEVBQUUsWUFBWTtZQUNqQixPQUFPLEVBQUUsVUFBQSxHQUFHO2dCQUNWLElBQUssR0FBRyxDQUFDLE1BQU0sS0FBSyxHQUFH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LENBQUM7Z0JBQ1QseUJBQXlCLEVBQUUsSUFBSSxDQUFDLHlCQUF5QixDQUFDLE1BQU0sRUFBRzthQUN0RSxDQUFDLENBQUM7WUFFSCxJQUFLLEVBQUUsV0FBVyxLQUFLLElBQUksRUFBRztnQkFDMUIsV0FBVyxHQUFHLENBQUMsQ0FBQzthQUNuQjtRQUNMLENBQUMsQ0FBQyxJQUFJLENBQUUsSUFBSSxDQUFFLEVBQUUsSUFBSSxDQUFFLENBQUM7SUFDM0IsQ0FBQztJQUtELE1BQU0sRUFBRTtRQUNKLElBQUksQ0FBQyxRQUFRLEVBQUcsQ0FBQztRQUNqQixJQUFJLENBQUMsU0FBUyxFQUFHLENBQUM7UUFDbEIsSUFBSSxDQUFDLFNBQVMsQ0FBRSxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBRSxDQUFDO0lBQ25DLENBQUM7SUFLRCxNQUFNLEVBQUU7SUFFUixDQUFDO0lBS0QsUUFBUSxFQUFFO0lBRVYsQ0FBQztJQUtELGlCQUFpQixFQUFFO0lBRW5CLENBQUM7SUFLRCxhQUFhLEVBQUU7SUFFZixDQUFDO0NBUUYsQ0FBQyxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiXG4vLyBhcHAvcGFnZXMvbWFuYWdlci1nb29kcy1saXN0L2luZGV4LmpzXG5pbXBvcnQgeyBodHRwIH0gZnJvbSAnLi4vLi4vdXRpbC9odHRwLmpzJztcbmltcG9ydCB7IGNvbXB1dGVkIH0gZnJvbSAnLi4vLi4vbGliL3Z1ZWZ5L2luZGV4LmpzJztcblxuUGFnZSh7XG5cbiAgICAvLyDliqjnlLtcbiAgICBhbmltYXRpb25NaWRkbGVIZWFkZXJJdGVtOiBudWxsLFxuXG4gICAgLyoqXG4gICAgICog6aG16Z2i55qE5Yid5aeL5pWw5o2uXG4gICAgICovXG4gICAgZGF0YToge1xuICAgICAgICAvLyDllYblk4FpZFxuICAgICAgICBpZDogJycsXG4gICAgICAgIC8vIOWVhuWTgeivpuaDhVxuICAgICAgICBkZXRhaWw6IG51bGwsXG4gICAgICAgIC8vIOaVsOaNruWtl+WFuFxuICAgICAgICBkaWM6IHsgfSxcbiAgICAgICAgLy8g5Yqg6L2954q25oCBXG4gICAgICAgIGxvYWRpbmc6IHRydWUsXG4gICAgICAgIC8vIOaYr+WQpuWIneWni+WMlui/h+KAnOWWnOasouKAnVxuICAgICAgICBoYXNJbml0TGlrZTogZmFsc2UsXG4gICAgICAgIC8vIOaYr+WQpuKAnOWWnOasouKAnVxuICAgICAgICBsaWtlZDogZmFsc2UsXG4gICAgICAgIC8vIOaWh+Wtl+S/neivgeaPkOekulxuICAgICAgICBwcm9taXNlVGlwczogW1xuICAgICAgICAgICAgJ+ato+WTgeS/neivgScsICfku7fmoLzkvJjlir8nLCAn55yf5Lq66LeR6IW/J1xuICAgICAgICBdLFxuICAgICAgICAvLyDliqjnlLtcbiAgICAgICAgYW5pbWF0aW9uTWlkZGxlSGVhZGVySXRlbTogbnVsbFxuICAgIH0sXG4gICAgXG4gICAgLyoqIOaLieWPluWVhuWTgeivpuaDhSAqL1xuICAgIGZldERldGFpbCggaWQgKSB7XG4gICAgICAgIGh0dHAoe1xuICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgIF9pZDogaWQsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgZXJyTXNnOiAn6I635Y+W5ZWG5ZOB6ZSZ6K+v77yM6K+36YeN6K+VJyxcbiAgICAgICAgICAgIHVybDogYGdvb2RfZGV0YWlsYCxcbiAgICAgICAgICAgIHN1Y2Nlc3M6IHJlcyA9PiB7XG4gICAgICAgICAgICAgIGlmICggcmVzLnN0YXR1cyAhPT0gMjAwICkgeyByZXR1cm47IH1cbiAgICAgICAgICAgICAgICB0aGlzLnNldERhdGEhKHtcbiAgICAgICAgICAgICAgICAgICAgZGV0YWlsOiByZXMuZGF0YSxcbiAgICAgICAgICAgICAgICAgICAgbG9hZGluZzogZmFsc2VcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfSxcblxuICAgIC8qKiDmi4nlj5bmlbDmja7lrZflhbggKi9cbiAgICBmZXRjaERpYyggKSB7XG4gICAgICAgIGh0dHAoe1xuICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICBkaWNOYW1lOiAnZ29vZHNfY2F0ZWdvcnknLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGVyck1zZzogJ+WKoOi9veWksei0pe+8jOivt+mHjeivlScsXG4gICAgICAgICAgICB1cmw6IGBjb21tb25fZGljYCxcbiAgICAgICAgICAgIHN1Y2Nlc3M6IHJlcyA9PiB7XG4gICAgICAgICAgICAgIGlmICggcmVzLnN0YXR1cyAhPT0gMjAwICkgeyByZXR1cm47IH1cbiAgICAgICAgICAgICAgdGhpcy5zZXREYXRhISh7XG4gICAgICAgICAgICAgICAgZGljOiByZXMuZGF0YVxuICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfSxcblxuICAgIC8qKiDpooTop4jlm77niYcgKi9cbiAgICBwcmV2aWV3SW1nKHsgY3VycmVudFRhcmdldCB9KSB7XG4gICAgICAgIGNvbnN0IHsgaW1nIH0gPSBjdXJyZW50VGFyZ2V0LmRhdGFzZXQ7XG4gICAgICAgIHRoaXMuZGF0YS5kZXRhaWwgJiYgd3gucHJldmlld0ltYWdlKHtcbiAgICAgICAgICAgIGN1cnJlbnQ6IGltZyxcbiAgICAgICAgICAgIHVybHM6IFsgLi4uKHRoaXMuZGF0YSBhcyBhbnkpLmRldGFpbC5pbWcgXSxcbiAgICAgICAgfSk7XG4gICAgfSxcbiAgXG4gICAgLyoqIOiuvue9rmNvbXB1dGVkICovXG4gICAgcnVuQ29tcHV0ZWQoICkge1xuICAgICAgICBjb21wdXRlZCggdGhpcywge1xuICAgICAgICAgICAgLy8g6K6h566X5Lu35qC8XG4gICAgICAgICAgICBwcmljZTogZnVuY3Rpb24oICkge1xuICAgICAgICAgICAgICAgIGNvbnN0IHsgZGV0YWlsIH0gPSB0aGlzLmRhdGE7XG4gICAgICAgICAgICAgICAgaWYgKCAhZGV0YWlsICkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gJyc7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCBkZXRhaWwuc3RhbmRhcmRzLmxlbmd0aCA9PT0gMCApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBkZXRhaWwucHJpY2U7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoIGRldGFpbC5zdGFuZGFyZHMubGVuZ3RoID09PSAxICkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGRldGFpbC5zdGFuZGFyZHNbIDAgXS5wcmljZTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHNvcnRlZFByaWNlID0gZGV0YWlsLnN0YW5kYXJkcy5zb3J0KCggeCwgeSApID0+IHgucHJpY2UgLSB5LnByaWNlICk7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoICBzb3J0ZWRQcmljZVswXS5wcmljZSA9PT0gc29ydGVkUHJpY2VbIHNvcnRlZFByaWNlLmxlbmd0aCAtIDEgXS5wcmljZSApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gc29ydGVkUHJpY2VbIDAgXS5wcmljZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGAke3NvcnRlZFByaWNlWzBdLnByaWNlfX4ke3NvcnRlZFByaWNlW3NvcnRlZFByaWNlLmxlbmd0aCAtIDEgXS5wcmljZX1gO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIC8vIOWVhuWTgeivpuaDhSAtIOWIhuihjOaYvuekulxuICAgICAgICAgICAgZGV0YWlsSW50cm86IGZ1bmN0aW9uKCApIHtcbiAgICAgICAgICAgICAgICBjb25zdCB7IGRldGFpbCB9ID0gdGhpcy5kYXRhO1xuICAgICAgICAgICAgICAgIGlmICggIWRldGFpbCB8fCAoICEhZGV0YWlsICYmICFkZXRhaWwuZGV0YWlsICkpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFsgXTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZGV0YWlsLmRldGFpbC5zcGxpdCgnXFxuJykuZmlsdGVyKCB4ID0+ICEheCApO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAvLyDku7fmoLwg772eIOWboui0reS7t+eahOW3ruS7t1xuICAgICAgICAgICAgcHJpY2VHYXA6IGZ1bmN0aW9uKCApIHtcbiAgICAgICAgICAgICAgICBjb25zdCB7IGRldGFpbCB9ID0gdGhpcy5kYXRhO1xuICAgICAgICAgICAgICAgIGlmICggIWRldGFpbCApIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIDA7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgeyBzdGFuZGFyZHMsIGdyb3VwUHJpY2UsIHByaWNlIH0gPSBkZXRhaWw7XG4gICAgICAgICAgICAgICAgICAgIC8vIOaXoOWei+WPt1xuICAgICAgICAgICAgICAgICAgICBpZiAoIHN0YW5kYXJkcy5sZW5ndGggPT09IDAgKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyDmnInlm6LotK3nmoRcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICggZ3JvdXBQcmljZSAhPT0gbnVsbCAmJiBncm91cFByaWNlICE9PSB1bmRlZmluZWQgKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuICBwcmljZSAtIGdyb3VwUHJpY2U7XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiAwO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAvLyDmnInlnovlj7dcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGdyb3VwUHJpY2UgPSBzdGFuZGFyZHMuZmlsdGVyKCB4ID0+IHguZ3JvdXBQcmljZSAhPT0gbnVsbCAmJiB4Lmdyb3VwUHJpY2UgIT09IHVuZGVmaW5lZCApO1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8g5Z6L5Y+36YeM6Z2i5pyJ5Zui6LSt55qEXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIGdyb3VwUHJpY2UubGVuZ3RoID4gMCApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBzb3J0ZWRHcm91cFByaWNlID0gZ3JvdXBQcmljZS5zb3J0KCggeCwgeSApID0+ICgoIHguZ3JvdXBQcmljZSAtIHgucHJpY2UgKSAtICggeS5ncm91cFByaWNlIC0geS5wcmljZSApKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCggc29ydGVkR3JvdXBQcmljZVswXS5ncm91cFByaWNlIC0gc29ydGVkR3JvdXBQcmljZVswXS5wcmljZSApID09PVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAoIHNvcnRlZEdyb3VwUHJpY2VbIHNvcnRlZEdyb3VwUHJpY2UubGVuZ3RoIC0gMSBdLmdyb3VwUHJpY2UgLSBzb3J0ZWRHcm91cFByaWNlWyBzb3J0ZWRHcm91cFByaWNlLmxlbmd0aCAtIDEgXS5wcmljZSApKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiAoIHNvcnRlZEdyb3VwUHJpY2VbMF0ucHJpY2UgLSBzb3J0ZWRHcm91cFByaWNlWzBdLmdyb3VwUHJpY2UgKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gYCR7c29ydGVkR3JvdXBQcmljZVsgc29ydGVkR3JvdXBQcmljZS5sZW5ndGggLSAxIF0ucHJpY2UgLSBzb3J0ZWRHcm91cFByaWNlWyBzb3J0ZWRHcm91cFByaWNlLmxlbmd0aCAtIDEgXS5ncm91cFByaWNlfX4ke3NvcnRlZEdyb3VwUHJpY2VbMF0ucHJpY2UgLSBzb3J0ZWRHcm91cFByaWNlWzBdLmdyb3VwUHJpY2V9YDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiAwO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9KVxuICAgIH0sXG5cbiAgICAvKiog6K6+572u4oCc5Zac5qyi4oCdICovXG4gICAgb25MaWtlKCApIHtcbiAgICAgICAgY29uc3QgdGhhdCA9IHRoaXM7XG4gICAgICAgIGlmICggIXRoaXMuZGF0YS5oYXNJbml0TGlrZSApIHsgcmV0dXJuOyB9XG4gICAgICAgIHd4LmNsb3VkLmNhbGxGdW5jdGlvbih7XG4gICAgICAgICAgICBuYW1lOiAnYXBpLWxpa2UtY29sbGVjdGlvbicsXG4gICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgcGlkOiB0aGlzLmRhdGEuaWRcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbiAoIHJlczogYW55ICkge1xuICAgICAgICAgICAgICAgIGlmICggcmVzLnJlc3VsdC5zdGF0dXMgPT09IDIwMCApIHtcbiAgICAgICAgICAgICAgICAgICAgdGhhdC5zZXREYXRhISh7XG4gICAgICAgICAgICAgICAgICAgICAgICBsaWtlZDogIXRoYXQuZGF0YS5saWtlZFxuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBmYWlsOiBmdW5jdGlvbiggKSB7XG4gICAgICAgICAgICAgICAgd3guc2hvd1RvYXN0KHtcbiAgICAgICAgICAgICAgICAgICAgaWNvbjogJ25vbmUnLFxuICAgICAgICAgICAgICAgICAgICB0aXRsZTogJ+iuvue9ruKAnOWWnOasouKAnemUmeivrycsXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH0sXG5cbiAgICAvKiog6K6+572u4oCc5Zac5qyi4oCdICovXG4gICAgY2hlY2tMaWtlKCApIHtcbiAgICAgICAgY29uc3QgdGhhdCA9IHRoaXM7XG4gICAgICAgIHd4LmNsb3VkLmNhbGxGdW5jdGlvbih7XG4gICAgICAgICAgICBuYW1lOiAnYXBpLWxpa2UtY29sbGVjdGlvbi1kZXRhaWwnLFxuICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgIHBpZDogdGhpcy5kYXRhLmlkXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgc3VjY2VzczogZnVuY3Rpb24gKCByZXM6IGFueSApIHtcbiAgICAgICAgICAgICAgICB0aGF0LnNldERhdGEhKHtcbiAgICAgICAgICAgICAgICAgICAgaGFzSW5pdExpa2U6IHRydWVcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICBpZiAoIHJlcy5yZXN1bHQuc3RhdHVzID09PSAyMDAgKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoYXQuc2V0RGF0YSEoe1xuICAgICAgICAgICAgICAgICAgICAgICAgbGlrZWQ6IHJlcy5yZXN1bHQuZGF0YVxuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBmYWlsOiBmdW5jdGlvbiggKSB7XG4gICAgICAgICAgICAgICAgd3guc2hvd1RvYXN0KHtcbiAgICAgICAgICAgICAgICAgICAgaWNvbjogJ25vbmUnLFxuICAgICAgICAgICAgICAgICAgICB0aXRsZTogJ+afpeivouKAnOWWnOasouKAnemUmeivrycsXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiDnlJ/lkb3lkajmnJ/lh73mlbAtLeebkeWQrOmhtemdouWKoOi9vVxuICAgICAqL1xuICAgIG9uTG9hZDogZnVuY3Rpb24gKG9wdGlvbnMpIHtcbiAgICAgICAgdGhpcy5ydW5Db21wdXRlZCggKTtcbiAgICAgICAgaWYgKCAhb3B0aW9ucyEuaWQgKSB7IHJldHVybjsgfVxuICAgICAgICB0aGlzLnNldERhdGEhKHtcbiAgICAgICAgICBpZDogb3B0aW9ucyEuaWRcbiAgICAgICAgfSk7XG4gICAgfSxcbiAgXG4gICAgLyoqXG4gICAgICog55Sf5ZG95ZGo5pyf5Ye95pWwLS3nm5HlkKzpobXpnaLliJ3mrKHmuLLmn5PlrozmiJBcbiAgICAgKi9cbiAgICBvblJlYWR5OiBmdW5jdGlvbiAoICkge1xuICAgICAgICBsZXQgY2lyY2xlQ291bnQgPSAwOyBcbiAgICAgICAgY29uc3QgdGhhdDogYW55ID0gdGhpcztcbiAgICAgICAgLy8g5b+D6Lez55qE5aSW5qGG5Yqo55S7IFxuICAgICAgICB0aGF0LmFuaW1hdGlvbk1pZGRsZUhlYWRlckl0ZW0gPSB3eC5jcmVhdGVBbmltYXRpb24oeyBcbiAgICAgICAgICAgIGR1cmF0aW9uOiA4MDAsIFxuICAgICAgICAgICAgdGltaW5nRnVuY3Rpb246ICdlYXNlJywgXG4gICAgICAgICAgICB0cmFuc2Zvcm1PcmlnaW46ICc1MCUgNTAlJyxcbiAgICAgICAgfSk7IFxuICAgICAgICBzZXRJbnRlcnZhbCggZnVuY3Rpb24oICkgeyBcbiAgICAgICAgICAgIGlmIChjaXJjbGVDb3VudCAlIDIgPT0gMCkgeyBcbiAgICAgICAgICAgICAgICB0aGF0LmFuaW1hdGlvbk1pZGRsZUhlYWRlckl0ZW0uc2NhbGUoIDEuMCApLnJvdGF0ZSggMTAgKS5zdGVwKCApOyBcbiAgICAgICAgICAgIH0gZWxzZSB7IFxuICAgICAgICAgICAgICAgIHRoYXQuYW5pbWF0aW9uTWlkZGxlSGVhZGVySXRlbS5zY2FsZSggMS4wICkucm90YXRlKCAtMzAgKS5zdGVwKCApOyBcbiAgICAgICAgICAgIH0gXG4gICAgICAgICAgICB0aGF0LnNldERhdGEoeyBcbiAgICAgICAgICAgICAgICBhbmltYXRpb25NaWRkbGVIZWFkZXJJdGVtOiB0aGF0LmFuaW1hdGlvbk1pZGRsZUhlYWRlckl0ZW0uZXhwb3J0KCApIFxuICAgICAgICAgICAgfSk7IFxuICAgICAgICAgICAgXG4gICAgICAgICAgICBpZiAoICsrY2lyY2xlQ291bnQgPT09IDEwMDAgKSB7IFxuICAgICAgICAgICAgICAgIGNpcmNsZUNvdW50ID0gMDsgXG4gICAgICAgICAgICB9IFxuICAgICAgICB9LmJpbmQoIHRoaXMgKSwgMTAwMCApOyBcbiAgICB9LFxuICBcbiAgICAvKipcbiAgICAgKiDnlJ/lkb3lkajmnJ/lh73mlbAtLeebkeWQrOmhtemdouaYvuekulxuICAgICAqL1xuICAgIG9uU2hvdzogZnVuY3Rpb24gKCApIHtcbiAgICAgICAgdGhpcy5mZXRjaERpYyggKTsgXG4gICAgICAgIHRoaXMuY2hlY2tMaWtlKCApO1xuICAgICAgICB0aGlzLmZldERldGFpbCggdGhpcy5kYXRhLmlkICk7XG4gICAgfSxcbiAgXG4gICAgLyoqXG4gICAgICog55Sf5ZG95ZGo5pyf5Ye95pWwLS3nm5HlkKzpobXpnaLpmpDol49cbiAgICAgKi9cbiAgICBvbkhpZGU6IGZ1bmN0aW9uICgpIHtcbiAgXG4gICAgfSxcbiAgXG4gICAgLyoqXG4gICAgICog55Sf5ZG95ZGo5pyf5Ye95pWwLS3nm5HlkKzpobXpnaLljbjovb1cbiAgICAgKi9cbiAgICBvblVubG9hZDogZnVuY3Rpb24gKCkge1xuICBcbiAgICB9LFxuICBcbiAgICAvKipcbiAgICAgKiDpobXpnaLnm7jlhbPkuovku7blpITnkIblh73mlbAtLeebkeWQrOeUqOaIt+S4i+aLieWKqOS9nFxuICAgICAqL1xuICAgIG9uUHVsbERvd25SZWZyZXNoOiBmdW5jdGlvbiAoKSB7XG4gIFxuICAgIH0sXG4gIFxuICAgIC8qKlxuICAgICAqIOmhtemdouS4iuaLieinpuW6leS6i+S7tueahOWkhOeQhuWHveaVsFxuICAgICAqL1xuICAgIG9uUmVhY2hCb3R0b206IGZ1bmN0aW9uICgpIHtcbiAgXG4gICAgfSxcbiAgXG4gICAgLyoqXG4gICAgICog55So5oi354K55Ye75Y+z5LiK6KeS5YiG5LqrXG4gICAgICovXG4gICAgLy8gb25TaGFyZUFwcE1lc3NhZ2U6IGZ1bmN0aW9uICgpIHtcbiAgXG4gICAgLy8gfVxuICB9KSJdfQ==