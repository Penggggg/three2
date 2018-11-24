"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
        var that = this;
        wx.cloud.callFunction({
            name: 'api-goods-detail',
            data: {
                _id: this.data.id
            },
            success: function (res) {
                var _a = res.result, status = _a.status, data = _a.data;
                if (status !== 200) {
                    return;
                }
                wx.hideLoading({});
                that.setData({
                    detail: data,
                    loading: false
                });
            },
            fail: function () {
                wx.showToast({
                    icon: 'none',
                    title: '获取商品详情错误',
                });
                wx.hideLoading({});
            }
        });
    },
    fetchDic: function () {
        var that = this;
        wx.cloud.callFunction({
            name: 'api-dic',
            data: {
                dicName: 'goods_category',
            },
            success: function (res) {
                that.setData({
                    dic: res.result
                });
            },
            fail: function () {
                wx.showToast({
                    icon: 'none',
                    title: '获取数据错误',
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUVBLHFEQUFvRDtBQUVwRCxJQUFJLENBQUM7SUFHRCx5QkFBeUIsRUFBRSxJQUFJO0lBSy9CLElBQUksRUFBRTtRQUVGLEVBQUUsRUFBRSxFQUFFO1FBRU4sTUFBTSxFQUFFLElBQUk7UUFFWixHQUFHLEVBQUUsRUFBRztRQUVSLE9BQU8sRUFBRSxJQUFJO1FBRWIsV0FBVyxFQUFFLEtBQUs7UUFFbEIsS0FBSyxFQUFFLEtBQUs7UUFFWixXQUFXLEVBQUU7WUFDVCxNQUFNLEVBQUUsTUFBTSxFQUFFLE1BQU07U0FDekI7UUFFRCx5QkFBeUIsRUFBRSxJQUFJO0tBQ2xDO0lBR0QsU0FBUyxZQUFFLEVBQUU7UUFDVCxJQUFNLElBQUksR0FBRyxJQUFJLENBQUM7UUFDbEIsRUFBRSxDQUFDLEtBQUssQ0FBQyxZQUFZLENBQUM7WUFDbEIsSUFBSSxFQUFFLGtCQUFrQjtZQUN4QixJQUFJLEVBQUU7Z0JBQ0YsR0FBRyxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRTthQUNwQjtZQUNELE9BQU8sRUFBRSxVQUFXLEdBQVE7Z0JBRWxCLElBQUEsZUFBNkIsRUFBM0Isa0JBQU0sRUFBRSxjQUFtQixDQUFDO2dCQUNwQyxJQUFLLE1BQU0sS0FBSyxHQUFHLEVBQUc7b0JBQUUsT0FBTztpQkFBRTtnQkFFakMsRUFBRSxDQUFDLFdBQVcsQ0FBQyxFQUFHLENBQUMsQ0FBQztnQkFDcEIsSUFBSSxDQUFDLE9BQVEsQ0FBQztvQkFDVixNQUFNLEVBQUUsSUFBSTtvQkFDWixPQUFPLEVBQUUsS0FBSztpQkFDakIsQ0FBQyxDQUFDO1lBRVAsQ0FBQztZQUNELElBQUksRUFBRTtnQkFDRixFQUFFLENBQUMsU0FBUyxDQUFDO29CQUNULElBQUksRUFBRSxNQUFNO29CQUNaLEtBQUssRUFBRSxVQUFVO2lCQUNwQixDQUFDLENBQUM7Z0JBQ0gsRUFB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O1lBQ3RCLGVBQWUsRUFBRSxTQUFTO1NBQzdCLENBQUMsQ0FBQztRQUNILFdBQVcsQ0FBRTtZQUNULElBQUksV0FBVyxHQUFHLENBQUMsSUFBSSxDQUFDLEVBQUU7Z0JBQ3RCLElBQUksQ0FBQyx5QkFBeUIsQ0FBQyxLQUFLLENBQUUsR0FBRyxDQUFFLENBQUMsTUFBTSxDQUFFLEVBQUUsQ0FBRSxDQUFDLElBQUksRUFBRyxDQUFDO2FBQ3BFO2lCQUFNO2dCQUNILElBQUksQ0FBQyx5QkFBeUIsQ0FBQyxLQUFLLENBQUUsR0FBRyxDQUFFLENBQUMsTUFBTSxDQUFFLENBQUMsRUFBRSxDQUFFLENBQUMsSUFBSSxFQUFHLENBQUM7YUFDckU7WUFDRCxJQUFJLENBQUMsT0FBTyxDQUFDO2dCQUNULHlCQUF5QixFQUFFLElBQUksQ0FBQyx5QkFBeUIsQ0FBQyxNQUFNLEVBQUc7YUFDdEUsQ0FBQyxDQUFDO1lBRUgsSUFBSyxFQUFFLFdBQVcsS0FBSyxJQUFJLEVBQUc7Z0JBQzFCLFdBQVcsR0FBRyxDQUFDLENBQUM7YUFDbkI7UUFDTCxDQUFDLENBQUMsSUFBSSxDQUFFLElBQUksQ0FBRSxFQUFFLElBQUksQ0FBRSxDQUFDO0lBQzNCLENBQUM7SUFLRCxNQUFNLEVBQUU7UUFDSixJQUFJLENBQUMsUUFBUSxFQUFHLENBQUM7UUFDakIsSUFBSSxDQUFDLFNBQVMsRUFBRyxDQUFDO1FBQ2xCLElBQUksQ0FBQyxTQUFTLENBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUUsQ0FBQztJQUNuQyxDQUFDO0lBS0QsTUFBTSxFQUFFO0lBRVIsQ0FBQztJQUtELFFBQVEsRUFBRTtJQUVWLENBQUM7SUFLRCxpQkFBaUIsRUFBRTtJQUVuQixDQUFDO0lBS0QsYUFBYSxFQUFFO0lBRWYsQ0FBQztDQVFGLENBQUMsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbIi8vIGFwcC9wYWdlcy9tYW5hZ2VyLWdvb2RzLWxpc3QvaW5kZXguanNcblxuaW1wb3J0IHsgY29tcHV0ZWQgfSBmcm9tICcuLi8uLi9saWIvdnVlZnkvaW5kZXguanMnO1xuXG5QYWdlKHtcblxuICAgIC8vIOWKqOeUu1xuICAgIGFuaW1hdGlvbk1pZGRsZUhlYWRlckl0ZW06IG51bGwsXG5cbiAgICAvKipcbiAgICAgKiDpobXpnaLnmoTliJ3lp4vmlbDmja5cbiAgICAgKi9cbiAgICBkYXRhOiB7XG4gICAgICAgIC8vIOWVhuWTgWlkXG4gICAgICAgIGlkOiAnJyxcbiAgICAgICAgLy8g5ZWG5ZOB6K+m5oOFXG4gICAgICAgIGRldGFpbDogbnVsbCxcbiAgICAgICAgLy8g5pWw5o2u5a2X5YW4XG4gICAgICAgIGRpYzogeyB9LFxuICAgICAgICAvLyDliqDovb3nirbmgIFcbiAgICAgICAgbG9hZGluZzogdHJ1ZSxcbiAgICAgICAgLy8g5piv5ZCm5Yid5aeL5YyW6L+H4oCc5Zac5qyi4oCdXG4gICAgICAgIGhhc0luaXRMaWtlOiBmYWxzZSxcbiAgICAgICAgLy8g5piv5ZCm4oCc5Zac5qyi4oCdXG4gICAgICAgIGxpa2VkOiBmYWxzZSxcbiAgICAgICAgLy8g5paH5a2X5L+d6K+B5o+Q56S6XG4gICAgICAgIHByb21pc2VUaXBzOiBbXG4gICAgICAgICAgICAn5q2j5ZOB5L+d6K+BJywgJ+S7t+agvOS8mOWKvycsICfnnJ/kurrot5Hohb8nXG4gICAgICAgIF0sXG4gICAgICAgIC8vIOWKqOeUu1xuICAgICAgICBhbmltYXRpb25NaWRkbGVIZWFkZXJJdGVtOiBudWxsXG4gICAgfSxcbiAgICBcbiAgICAvKiog5ouJ5Y+W5ZWG5ZOB6K+m5oOFICovXG4gICAgZmV0RGV0YWlsKCBpZCApIHtcbiAgICAgICAgY29uc3QgdGhhdCA9IHRoaXM7XG4gICAgICAgIHd4LmNsb3VkLmNhbGxGdW5jdGlvbih7XG4gICAgICAgICAgICBuYW1lOiAnYXBpLWdvb2RzLWRldGFpbCcsXG4gICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgX2lkOiB0aGlzLmRhdGEuaWRcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbiAoIHJlczogYW55ICkge1xuICBcbiAgICAgICAgICAgICAgICBjb25zdCB7IHN0YXR1cywgZGF0YSB9ID0gcmVzLnJlc3VsdDtcbiAgICAgICAgICAgICAgICBpZiAoIHN0YXR1cyAhPT0gMjAwICkgeyByZXR1cm47IH1cbiAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICB3eC5oaWRlTG9hZGluZyh7IH0pO1xuICAgICAgICAgICAgICAgIHRoYXQuc2V0RGF0YSEoe1xuICAgICAgICAgICAgICAgICAgICBkZXRhaWw6IGRhdGEsXG4gICAgICAgICAgICAgICAgICAgIGxvYWRpbmc6IGZhbHNlXG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBmYWlsOiBmdW5jdGlvbiggKSB7XG4gICAgICAgICAgICAgICAgd3guc2hvd1RvYXN0KHtcbiAgICAgICAgICAgICAgICAgICAgaWNvbjogJ25vbmUnLFxuICAgICAgICAgICAgICAgICAgICB0aXRsZTogJ+iOt+WPluWVhuWTgeivpuaDhemUmeivrycsXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgd3guaGlkZUxvYWRpbmcoeyB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfSxcblxuICAgIC8qKiDmi4nlj5bmlbDmja7lrZflhbggKi9cbiAgICBmZXRjaERpYyggKSB7XG4gICAgICAgIGNvbnN0IHRoYXQgPSB0aGlzO1xuICAgICAgICB3eC5jbG91ZC5jYWxsRnVuY3Rpb24oe1xuICAgICAgICAgICAgbmFtZTogJ2FwaS1kaWMnLFxuICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgIGRpY05hbWU6ICdnb29kc19jYXRlZ29yeScsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgc3VjY2VzczogZnVuY3Rpb24oIHJlczogYW55ICkge1xuICAgICAgICAgICAgICAgIHRoYXQuc2V0RGF0YSEoe1xuICAgICAgICAgICAgICAgICAgICBkaWM6IHJlcy5yZXN1bHRcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBmYWlsOiBmdW5jdGlvbiggKSB7XG4gICAgICAgICAgICAgICAgd3guc2hvd1RvYXN0KHtcbiAgICAgICAgICAgICAgICAgICAgaWNvbjogJ25vbmUnLFxuICAgICAgICAgICAgICAgICAgICB0aXRsZTogJ+iOt+WPluaVsOaNrumUmeivrycsXG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSlcbiAgICB9LFxuXG4gICAgLyoqIOmihOiniOWbvueJhyAqL1xuICAgIHByZXZpZXdJbWcoeyBjdXJyZW50VGFyZ2V0IH0pIHtcbiAgICAgICAgY29uc3QgeyBpbWcgfSA9IGN1cnJlbnRUYXJnZXQuZGF0YXNldDtcbiAgICAgICAgdGhpcy5kYXRhLmRldGFpbCAmJiB3eC5wcmV2aWV3SW1hZ2Uoe1xuICAgICAgICAgICAgY3VycmVudDogaW1nLFxuICAgICAgICAgICAgdXJsczogWyAuLi4odGhpcy5kYXRhIGFzIGFueSkuZGV0YWlsLmltZyBdLFxuICAgICAgICB9KTtcbiAgICB9LFxuICBcbiAgICAvKiog6K6+572uY29tcHV0ZWQgKi9cbiAgICBydW5Db21wdXRlZCggKSB7XG4gICAgICAgIGNvbXB1dGVkKCB0aGlzLCB7XG4gICAgICAgICAgICAvLyDorqHnrpfku7fmoLxcbiAgICAgICAgICAgIHByaWNlOiBmdW5jdGlvbiggKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgeyBkZXRhaWwgfSA9IHRoaXMuZGF0YTtcbiAgICAgICAgICAgICAgICBpZiAoICFkZXRhaWwgKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAnJztcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBpZiAoIGRldGFpbC5zdGFuZGFyZHMubGVuZ3RoID09PSAwICkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGRldGFpbC5wcmljZTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmICggZGV0YWlsLnN0YW5kYXJkcy5sZW5ndGggPT09IDEgKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gZGV0YWlsLnN0YW5kYXJkc1sgMCBdLnByaWNlO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3Qgc29ydGVkUHJpY2UgPSBkZXRhaWwuc3RhbmRhcmRzLnNvcnQoKCB4LCB5ICkgPT4geC5wcmljZSAtIHkucHJpY2UgKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICggIHNvcnRlZFByaWNlWzBdLnByaWNlID09PSBzb3J0ZWRQcmljZVsgc29ydGVkUHJpY2UubGVuZ3RoIC0gMSBdLnByaWNlICkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBzb3J0ZWRQcmljZVsgMCBdLnByaWNlO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gYCR7c29ydGVkUHJpY2VbMF0ucHJpY2V9fiR7c29ydGVkUHJpY2Vbc29ydGVkUHJpY2UubGVuZ3RoIC0gMSBdLnByaWNlfWA7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgLy8g5ZWG5ZOB6K+m5oOFXG4gICAgICAgICAgICBkZXRhaWxJbnRybzogZnVuY3Rpb24oICkge1xuICAgICAgICAgICAgICAgIGNvbnN0IHsgZGV0YWlsIH0gPSB0aGlzLmRhdGE7XG4gICAgICAgICAgICAgICAgaWYgKCAhZGV0YWlsIHx8ICggISFkZXRhaWwgJiYgIWRldGFpbC5kZXRhaWwgKSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gWyBdO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBkZXRhaWwuZGV0YWlsLnNwbGl0KCdcXG4nKS5maWx0ZXIoIHggPT4gISF4ICk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIC8vIOS7t+agvCDvvZ4g5Zui6LSt5Lu355qE5beu5Lu3XG4gICAgICAgICAgICBwcmljZUdhcDogZnVuY3Rpb24oICkge1xuICAgICAgICAgICAgICAgIGNvbnN0IHsgZGV0YWlsIH0gPSB0aGlzLmRhdGE7XG4gICAgICAgICAgICAgICAgaWYgKCAhZGV0YWlsICkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gMDtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCB7IHN0YW5kYXJkcywgZ3JvdXBQcmljZSwgcHJpY2UgfSA9IGRldGFpbDtcbiAgICAgICAgICAgICAgICAgICAgLy8g5peg5Z6L5Y+3XG4gICAgICAgICAgICAgICAgICAgIGlmICggc3RhbmRhcmRzLmxlbmd0aCA9PT0gMCApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIOacieWboui0reeahFxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCBncm91cFByaWNlICE9PSBudWxsICYmIGdyb3VwUHJpY2UgIT09IHVuZGVmaW5lZCApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gIHByaWNlIC0gZ3JvdXBQcmljZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIDA7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIC8vIOacieWei+WPt1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgZ3JvdXBQcmljZSA9IHN0YW5kYXJkcy5maWx0ZXIoIHggPT4geC5ncm91cFByaWNlICE9PSBudWxsICYmIHguZ3JvdXBQcmljZSAhPT0gdW5kZWZpbmVkICk7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyDlnovlj7fph4zpnaLmnInlm6LotK3nmoRcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICggZ3JvdXBQcmljZS5sZW5ndGggPiAwICkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHNvcnRlZEdyb3VwUHJpY2UgPSBncm91cFByaWNlLnNvcnQoKCB4LCB5ICkgPT4gKCggeC5ncm91cFByaWNlIC0geC5wcmljZSApIC0gKCB5Lmdyb3VwUHJpY2UgLSB5LnByaWNlICkpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoKCBzb3J0ZWRHcm91cFByaWNlWzBdLmdyb3VwUHJpY2UgLSBzb3J0ZWRHcm91cFByaWNlWzBdLnByaWNlICkgPT09XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICggc29ydGVkR3JvdXBQcmljZVsgc29ydGVkR3JvdXBQcmljZS5sZW5ndGggLSAxIF0uZ3JvdXBQcmljZSAtIHNvcnRlZEdyb3VwUHJpY2VbIHNvcnRlZEdyb3VwUHJpY2UubGVuZ3RoIC0gMSBdLnByaWNlICkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuICggc29ydGVkR3JvdXBQcmljZVswXS5wcmljZSAtIHNvcnRlZEdyb3VwUHJpY2VbMF0uZ3JvdXBQcmljZSApO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBgJHtzb3J0ZWRHcm91cFByaWNlWyBzb3J0ZWRHcm91cFByaWNlLmxlbmd0aCAtIDEgXS5wcmljZSAtIHNvcnRlZEdyb3VwUHJpY2VbIHNvcnRlZEdyb3VwUHJpY2UubGVuZ3RoIC0gMSBdLmdyb3VwUHJpY2V9fiR7c29ydGVkR3JvdXBQcmljZVswXS5wcmljZSAtIHNvcnRlZEdyb3VwUHJpY2VbMF0uZ3JvdXBQcmljZX1gO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIDA7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgfSxcblxuICAgIC8qKiDorr7nva7igJzllpzmrKLigJ0gKi9cbiAgICBvbkxpa2UoICkge1xuICAgICAgICBjb25zdCB0aGF0ID0gdGhpcztcbiAgICAgICAgaWYgKCAhdGhpcy5kYXRhLmhhc0luaXRMaWtlICkgeyByZXR1cm47IH1cbiAgICAgICAgd3guY2xvdWQuY2FsbEZ1bmN0aW9uKHtcbiAgICAgICAgICAgIG5hbWU6ICdhcGktbGlrZS1jb2xsZWN0aW9uJyxcbiAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICBwaWQ6IHRoaXMuZGF0YS5pZFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uICggcmVzOiBhbnkgKSB7XG4gICAgICAgICAgICAgICAgaWYgKCByZXMucmVzdWx0LnN0YXR1cyA9PT0gMjAwICkge1xuICAgICAgICAgICAgICAgICAgICB0aGF0LnNldERhdGEhKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxpa2VkOiAhdGhhdC5kYXRhLmxpa2VkXG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGZhaWw6IGZ1bmN0aW9uKCApIHtcbiAgICAgICAgICAgICAgICB3eC5zaG93VG9hc3Qoe1xuICAgICAgICAgICAgICAgICAgICBpY29uOiAnbm9uZScsXG4gICAgICAgICAgICAgICAgICAgIHRpdGxlOiAn6K6+572u4oCc5Zac5qyi4oCd6ZSZ6K+vJyxcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfSxcblxuICAgIC8qKiDorr7nva7igJzllpzmrKLigJ0gKi9cbiAgICBjaGVja0xpa2UoICkge1xuICAgICAgICBjb25zdCB0aGF0ID0gdGhpcztcbiAgICAgICAgd3guY2xvdWQuY2FsbEZ1bmN0aW9uKHtcbiAgICAgICAgICAgIG5hbWU6ICdhcGktbGlrZS1jb2xsZWN0aW9uLWRldGFpbCcsXG4gICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgcGlkOiB0aGlzLmRhdGEuaWRcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbiAoIHJlczogYW55ICkge1xuICAgICAgICAgICAgICAgIHRoYXQuc2V0RGF0YSEoe1xuICAgICAgICAgICAgICAgICAgICBoYXNJbml0TGlrZTogdHJ1ZVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIGlmICggcmVzLnJlc3VsdC5zdGF0dXMgPT09IDIwMCApIHtcbiAgICAgICAgICAgICAgICAgICAgdGhhdC5zZXREYXRhISh7XG4gICAgICAgICAgICAgICAgICAgICAgICBsaWtlZDogcmVzLnJlc3VsdC5kYXRhXG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGZhaWw6IGZ1bmN0aW9uKCApIHtcbiAgICAgICAgICAgICAgICB3eC5zaG93VG9hc3Qoe1xuICAgICAgICAgICAgICAgICAgICBpY29uOiAnbm9uZScsXG4gICAgICAgICAgICAgICAgICAgIHRpdGxlOiAn5p+l6K+i4oCc5Zac5qyi4oCd6ZSZ6K+vJyxcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIOeUn+WRveWRqOacn+WHveaVsC0t55uR5ZCs6aG16Z2i5Yqg6L29XG4gICAgICovXG4gICAgb25Mb2FkOiBmdW5jdGlvbiAob3B0aW9ucykge1xuICAgICAgICB0aGlzLnJ1bkNvbXB1dGVkKCApO1xuICAgICAgICBpZiAoICFvcHRpb25zIS5pZCApIHsgcmV0dXJuOyB9XG4gICAgICAgIHRoaXMuc2V0RGF0YSEoe1xuICAgICAgICAgIGlkOiBvcHRpb25zIS5pZFxuICAgICAgICB9KTtcbiAgICB9LFxuICBcbiAgICAvKipcbiAgICAgKiDnlJ/lkb3lkajmnJ/lh73mlbAtLeebkeWQrOmhtemdouWIneasoea4suafk+WujOaIkFxuICAgICAqL1xuICAgIG9uUmVhZHk6IGZ1bmN0aW9uICggKSB7XG4gICAgICAgIGxldCBjaXJjbGVDb3VudCA9IDA7IFxuICAgICAgICBjb25zdCB0aGF0OiBhbnkgPSB0aGlzO1xuICAgICAgICAvLyDlv4Pot7PnmoTlpJbmoYbliqjnlLsgXG4gICAgICAgIHRoYXQuYW5pbWF0aW9uTWlkZGxlSGVhZGVySXRlbSA9IHd4LmNyZWF0ZUFuaW1hdGlvbih7IFxuICAgICAgICAgICAgZHVyYXRpb246IDgwMCwgXG4gICAgICAgICAgICB0aW1pbmdGdW5jdGlvbjogJ2Vhc2UnLCBcbiAgICAgICAgICAgIHRyYW5zZm9ybU9yaWdpbjogJzUwJSA1MCUnLFxuICAgICAgICB9KTsgXG4gICAgICAgIHNldEludGVydmFsKCBmdW5jdGlvbiggKSB7IFxuICAgICAgICAgICAgaWYgKGNpcmNsZUNvdW50ICUgMiA9PSAwKSB7IFxuICAgICAgICAgICAgICAgIHRoYXQuYW5pbWF0aW9uTWlkZGxlSGVhZGVySXRlbS5zY2FsZSggMS4wICkucm90YXRlKCAxMCApLnN0ZXAoICk7IFxuICAgICAgICAgICAgfSBlbHNlIHsgXG4gICAgICAgICAgICAgICAgdGhhdC5hbmltYXRpb25NaWRkbGVIZWFkZXJJdGVtLnNjYWxlKCAxLjAgKS5yb3RhdGUoIC0zMCApLnN0ZXAoICk7IFxuICAgICAgICAgICAgfSBcbiAgICAgICAgICAgIHRoYXQuc2V0RGF0YSh7IFxuICAgICAgICAgICAgICAgIGFuaW1hdGlvbk1pZGRsZUhlYWRlckl0ZW06IHRoYXQuYW5pbWF0aW9uTWlkZGxlSGVhZGVySXRlbS5leHBvcnQoICkgXG4gICAgICAgICAgICB9KTsgXG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGlmICggKytjaXJjbGVDb3VudCA9PT0gMTAwMCApIHsgXG4gICAgICAgICAgICAgICAgY2lyY2xlQ291bnQgPSAwOyBcbiAgICAgICAgICAgIH0gXG4gICAgICAgIH0uYmluZCggdGhpcyApLCAxMDAwICk7IFxuICAgIH0sXG4gIFxuICAgIC8qKlxuICAgICAqIOeUn+WRveWRqOacn+WHveaVsC0t55uR5ZCs6aG16Z2i5pi+56S6XG4gICAgICovXG4gICAgb25TaG93OiBmdW5jdGlvbiAoICkge1xuICAgICAgICB0aGlzLmZldGNoRGljKCApOyBcbiAgICAgICAgdGhpcy5jaGVja0xpa2UoICk7XG4gICAgICAgIHRoaXMuZmV0RGV0YWlsKCB0aGlzLmRhdGEuaWQgKTtcbiAgICB9LFxuICBcbiAgICAvKipcbiAgICAgKiDnlJ/lkb3lkajmnJ/lh73mlbAtLeebkeWQrOmhtemdoumakOiXj1xuICAgICAqL1xuICAgIG9uSGlkZTogZnVuY3Rpb24gKCkge1xuICBcbiAgICB9LFxuICBcbiAgICAvKipcbiAgICAgKiDnlJ/lkb3lkajmnJ/lh73mlbAtLeebkeWQrOmhtemdouWNuOi9vVxuICAgICAqL1xuICAgIG9uVW5sb2FkOiBmdW5jdGlvbiAoKSB7XG4gIFxuICAgIH0sXG4gIFxuICAgIC8qKlxuICAgICAqIOmhtemdouebuOWFs+S6i+S7tuWkhOeQhuWHveaVsC0t55uR5ZCs55So5oi35LiL5ouJ5Yqo5L2cXG4gICAgICovXG4gICAgb25QdWxsRG93blJlZnJlc2g6IGZ1bmN0aW9uICgpIHtcbiAgXG4gICAgfSxcbiAgXG4gICAgLyoqXG4gICAgICog6aG16Z2i5LiK5ouJ6Kem5bqV5LqL5Lu255qE5aSE55CG5Ye95pWwXG4gICAgICovXG4gICAgb25SZWFjaEJvdHRvbTogZnVuY3Rpb24gKCkge1xuICBcbiAgICB9LFxuICBcbiAgICAvKipcbiAgICAgKiDnlKjmiLfngrnlh7vlj7PkuIrop5LliIbkuqtcbiAgICAgKi9cbiAgICAvLyBvblNoYXJlQXBwTWVzc2FnZTogZnVuY3Rpb24gKCkge1xuICBcbiAgICAvLyB9XG4gIH0pIl19