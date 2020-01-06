"use strict";
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var http_js_1 = require("../../util/http.js");
var goods_js_1 = require("../../util/goods.js");
var index_js_1 = require("../../lib/vuefy/index.js");
var route_js_1 = require("../../util/route.js");
Page({
    data: {
        page: 0,
        search: '',
        list: [],
        loadingList: false,
        canLoadMore: true,
        closeOpts: [
            {
                label: '上架中',
                value: true
            }, {
                label: '未上架',
                value: false
            }
        ]
    },
    runComputed: function () {
        index_js_1.computed(this, {
            list$: function () {
                var list = this.data.list;
                var meta = list.map(goods_js_1.delayeringGood);
                return meta;
            }
        });
    },
    fetchData: function () {
        var that = this;
        var _a = this.data, canLoadMore = _a.canLoadMore, loadingList = _a.loadingList, page = _a.page, search = _a.search;
        if (loadingList || !canLoadMore) {
            return;
        }
        this.setData({
            loadingList: true
        });
        http_js_1.http({
            data: {
                limit: 10,
                title: search,
                page: page + 1,
            },
            url: "good_list",
            success: function (res) {
                var status = res.status, data = res.data;
                if (status === 200) {
                    var page_1 = data.page, totalPage = data.totalPage;
                    that.setData({
                        page: page_1,
                        loadingList: false,
                        canLoadMore: totalPage > page_1
                    });
                    if (data.data && data.data.length > 0) {
                        that.setData({
                            list: page_1 === 1 ?
                                data.data : __spreadArrays(that.data.list, data.data)
                        });
                    }
                    else {
                        that.setData({
                            list: []
                        });
                    }
                }
            }
        });
    },
    fetchNew: function (pid) {
        var _this = this;
        http_js_1.http({
            data: {
                _id: pid
            },
            url: 'good_detail',
            success: function (res) {
                var list = _this.data.list;
                var newList = __spreadArrays([res.data], list);
                _this.setData({
                    list: newList
                });
            }
        });
    },
    onSwitch: function (e) {
        var _this = this;
        var _a = e.detail, value = _a.value, sign = _a.sign;
        var list = __spreadArrays(this.data.list);
        wx.showModal({
            title: '提示',
            content: "\u786E\u5B9A\u8981" + (value ? '上架' : '下架') + "\u6B64\u5546\u54C1\u5417\uFF1F",
            success: function (res) {
                if (res.confirm) {
                    http_js_1.http({
                        data: {
                            pid: sign,
                            visiable: value
                        },
                        loadingMsg: value ? '上架中...' : '下架中...',
                        url: 'good_set-visiable',
                        success: function (res) {
                            if (res.status === 200) {
                                wx.showToast({
                                    title: value ? '上架成功！' : '下架成功！'
                                });
                                var target = list.find(function (x) { return x._id === sign; });
                                var existedIndex = list.findIndex(function (x) { return x._id === sign; });
                                list.splice(existedIndex, 1, Object.assign({}, target, {
                                    visiable: value
                                }));
                                _this.setData({
                                    list: list
                                });
                            }
                        }
                    });
                }
            }
        });
    },
    onTab: function (_a) {
        var currentTarget = _a.currentTarget;
        var pid = currentTarget.dataset.pid;
        route_js_1.navTo(pid ?
            "/pages/manager-goods-detail/index?id=" + pid :
            "/pages/manager-goods-detail/index");
    },
    onConfirm: function (_a) {
        var detail = _a.detail;
        var search = detail;
        this.setData({
            page: 0,
            search: search,
            canLoadMore: true
        });
        this.fetchData();
    },
    deleteGood: function (_a) {
        var _this = this;
        var currentTarget = _a.currentTarget;
        var pid = currentTarget.dataset.pid;
        wx.showModal({
            title: '提示',
            content: '确定删除此商品吗？',
            success: function (res) {
                if (res.confirm) {
                    http_js_1.http({
                        data: {
                            pid: pid
                        },
                        url: 'good_delete',
                        success: function (res) {
                            var status = res.status, data = res.data;
                            if (status === 200) {
                                wx.showToast({
                                    title: '删除成功!'
                                });
                                var list = _this.data.list;
                                list.splice(list.findIndex(function (x) { return x._id === pid; }), 1);
                                _this.setData({
                                    list: __spreadArrays(list)
                                });
                            }
                        }
                    });
                }
            }
        });
    },
    onLoad: function (options) {
        wx.hideShareMenu({});
        this.runComputed();
    },
    onShow: function () {
        var _this = this;
        this.setData({
            page: 0,
            canLoadMore: true
        });
        setTimeout(function () {
            _this.fetchData();
        }, 20);
    },
    onReady: function () {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7QUFBQSw4Q0FBMEM7QUFDMUMsZ0RBQXFEO0FBQ3JELHFEQUFvRDtBQUNwRCxnREFBNEM7QUFHNUMsSUFBSSxDQUFDO0lBS0QsSUFBSSxFQUFFO1FBR0YsSUFBSSxFQUFFLENBQUM7UUFHUCxNQUFNLEVBQUUsRUFBRTtRQUdWLElBQUksRUFBRSxFQUFHO1FBR1QsV0FBVyxFQUFFLEtBQUs7UUFHbEIsV0FBVyxFQUFFLElBQUk7UUFHakIsU0FBUyxFQUFFO1lBQ1A7Z0JBQ0ksS0FBSyxFQUFFLEtBQUs7Z0JBQ1osS0FBSyxFQUFFLElBQUk7YUFDZCxFQUFFO2dCQUNDLEtBQUssRUFBRSxLQUFLO2dCQUNaLEtBQUssRUFBRSxLQUFLO2FBQ2Y7U0FDSjtLQUNKO0lBRUQsV0FBVztRQUNQLG1CQUFRLENBQUUsSUFBSSxFQUFFO1lBR1osS0FBSztnQkFDTyxJQUFBLHFCQUFJLENBQWU7Z0JBQzNCLElBQU0sSUFBSSxHQUFJLElBQUksQ0FBQyxHQUFHLENBQUUseUJBQWMsQ0FBRSxDQUFDO2dCQUN6QyxPQUFPLElBQUksQ0FBQztZQUNoQixDQUFDO1NBQ0osQ0FBQyxDQUFBO0lBQ04sQ0FBQztJQUlELFNBQVMsRUFBVDtRQUNJLElBQU0sSUFBSSxHQUFHLElBQUksQ0FBQztRQUNaLElBQUEsY0FBc0QsRUFBcEQsNEJBQVcsRUFBRSw0QkFBVyxFQUFFLGNBQUksRUFBRSxrQkFBb0IsQ0FBQztRQUU3RCxJQUFLLFdBQVcsSUFBSSxDQUFDLFdBQVcsRUFBRztZQUMvQixPQUFPO1NBQ1Y7UUFFRCxJQUFJLENBQUMsT0FBUSxDQUFDO1lBQ1YsV0FBVyxFQUFFLElBQUk7U0FDcEIsQ0FBQyxDQUFDO1FBRUgsY0FBSSxDQUFDO1lBQ0QsSUFBSSxFQUFFO2dCQUNGLEtBQUssRUFBRSxFQUFFO2dCQUNULEtBQUssRUFBRSxNQUFNO2dCQUNi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QztDQVFGLENBQUMsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGh0dHAgfSBmcm9tICcuLi8uLi91dGlsL2h0dHAuanMnO1xuaW1wb3J0IHsgZGVsYXllcmluZ0dvb2QgfSBmcm9tICcuLi8uLi91dGlsL2dvb2RzLmpzJztcbmltcG9ydCB7IGNvbXB1dGVkIH0gZnJvbSAnLi4vLi4vbGliL3Z1ZWZ5L2luZGV4LmpzJztcbmltcG9ydCB7IG5hdlRvIH0gZnJvbSAnLi4vLi4vdXRpbC9yb3V0ZS5qcyc7XG5cbi8vIGFwcC9wYWdlcy9tYW5hZ2VyLWdvb2RzLWxpc3QvaW5kZXguanNcblBhZ2Uoe1xuXG4gICAgLyoqXG4gICAgICog6aG16Z2i55qE5Yid5aeL5pWw5o2uXG4gICAgICovXG4gICAgZGF0YToge1xuXG4gICAgICAgIC8vIOW9k+WJjemhteeggVxuICAgICAgICBwYWdlOiAwLFxuXG4gICAgICAgIC8vIOaQnOe0olxuICAgICAgICBzZWFyY2g6ICcnLFxuXG4gICAgICAgIC8vIOWVhuWTgeWIl+ihqFxuICAgICAgICBsaXN0OiBbIF0sXG5cbiAgICAgICAgLy8g5Yqg6L295YiX6KGoaW5nXG4gICAgICAgIGxvYWRpbmdMaXN0OiBmYWxzZSxcblxuICAgICAgICAvLyDog73lkKbnu6fnu63liqDovb1cbiAgICAgICAgY2FuTG9hZE1vcmU6IHRydWUsXG5cbiAgICAgICAgLyoqIOS4iuS4i+aetumAiemhuSAqL1xuICAgICAgICBjbG9zZU9wdHM6IFtcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBsYWJlbDogJ+S4iuaetuS4rScsXG4gICAgICAgICAgICAgICAgdmFsdWU6IHRydWVcbiAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICBsYWJlbDogJ+acquS4iuaeticsXG4gICAgICAgICAgICAgICAgdmFsdWU6IGZhbHNlXG4gICAgICAgICAgICB9XG4gICAgICAgIF1cbiAgICB9LFxuXG4gICAgcnVuQ29tcHV0ZWQoICkge1xuICAgICAgICBjb21wdXRlZCggdGhpcywge1xuXG4gICAgICAgICAgICAvLyDliJfooahcbiAgICAgICAgICAgIGxpc3QkKCApIHtcbiAgICAgICAgICAgICAgICBjb25zdCB7IGxpc3QgfSA9IHRoaXMuZGF0YTtcbiAgICAgICAgICAgICAgICBjb25zdCBtZXRhICA9IGxpc3QubWFwKCBkZWxheWVyaW5nR29vZCApO1xuICAgICAgICAgICAgICAgIHJldHVybiBtZXRhO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KVxuICAgIH0sXG4gIFxuICBcbiAgICAvKiog5ouJ5Y+W5YiX6KGoICovXG4gICAgZmV0Y2hEYXRhKCApIHtcbiAgICAgICAgY29uc3QgdGhhdCA9IHRoaXM7XG4gICAgICAgIGNvbnN0IHsgY2FuTG9hZE1vcmUsIGxvYWRpbmdMaXN0LCBwYWdlLCBzZWFyY2ggfSA9IHRoaXMuZGF0YTtcblxuICAgICAgICBpZiAoIGxvYWRpbmdMaXN0IHx8ICFjYW5Mb2FkTW9yZSApIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuc2V0RGF0YSEoe1xuICAgICAgICAgICAgbG9hZGluZ0xpc3Q6IHRydWVcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaHR0cCh7XG4gICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgbGltaXQ6IDEwLFxuICAgICAgICAgICAgICAgIHRpdGxlOiBzZWFyY2gsXG4gICAgICAgICAgICAgICAgcGFnZTogcGFnZSArIDEsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgdXJsOiBgZ29vZF9saXN0YCxcbiAgICAgICAgICAgIHN1Y2Nlc3M6IHJlcyA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3QgeyBzdGF0dXMsIGRhdGEgfSA9IHJlcztcbiAgICAgICAgIFxuICAgICAgICAgICAgICAgIGlmICggc3RhdHVzID09PSAyMDAgKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHsgcGFnZSwgdG90YWxQYWdlIH0gPSBkYXRhO1xuXG4gICAgICAgICAgICAgICAgICAgIHRoYXQuc2V0RGF0YSEoe1xuICAgICAgICAgICAgICAgICAgICAgICAgcGFnZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGxvYWRpbmdMaXN0OiBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhbkxvYWRNb3JlOiB0b3RhbFBhZ2UgPiBwYWdlXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgaWYgKCBkYXRhLmRhdGEgJiYgZGF0YS5kYXRhLmxlbmd0aCA+IDAgKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGF0LnNldERhdGEhKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsaXN0OiBwYWdlID09PSAxID9cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YS5kYXRhIDpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgWyAuLi50aGF0LmRhdGEubGlzdCwgLi4uZGF0YS5kYXRhXVxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGF0LnNldERhdGEhKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsaXN0OiBbIF1cbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfSk7XG4gICAgfSxcblxuICAgIC8qKiDojrflj5bmlrDliJvlu7rnmoTllYblk4EgKi9cbiAgICBmZXRjaE5ldyggcGlkICkge1xuICAgICAgICBodHRwKHtcbiAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICBfaWQ6IHBpZFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHVybDogJ2dvb2RfZGV0YWlsJyxcbiAgICAgICAgICAgIHN1Y2Nlc3M6IHJlcyA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3QgeyBsaXN0IH0gPSB0aGlzLmRhdGE7XG4gICAgICAgICAgICAgICAgY29uc3QgbmV3TGlzdDogYW55ID0gWyByZXMuZGF0YSwgLi4ubGlzdCBdO1xuICAgICAgICAgICAgICAgIHRoaXMuc2V0RGF0YSEoe1xuICAgICAgICAgICAgICAgICAgICBsaXN0OiBuZXdMaXN0XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH0sXG5cbiAgICAvKiog5paH5a2X6YCJ6aG5IO+8jOW8gOWQr+WFs+mXreS4iuS4i+aetiovXG4gICAgb25Td2l0Y2goIGUgKSB7XG4gICAgICAgIGNvbnN0IHsgdmFsdWUsIHNpZ24gfSA9IGUuZGV0YWlsO1xuICAgICAgICBjb25zdCBsaXN0ID0gWyAuLi50aGlzLmRhdGEubGlzdCBdO1xuICAgICAgICB3eC5zaG93TW9kYWwoe1xuICAgICAgICAgICAgdGl0bGU6ICfmj5DnpLonLFxuICAgICAgICAgICAgY29udGVudDogYOehruWumuimgSR7IHZhbHVlID8gJ+S4iuaeticgOiAn5LiL5p62JyB95q2k5ZWG5ZOB5ZCX77yfYCxcbiAgICAgICAgICAgIHN1Y2Nlc3M6IHJlcyA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKCByZXMuY29uZmlybSApIHtcbiAgICAgICAgICAgICAgICAgICAgaHR0cCh7XG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcGlkOiBzaWduLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZpc2lhYmxlOiB2YWx1ZVxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGxvYWRpbmdNc2c6IHZhbHVlID8gJ+S4iuaetuS4rS4uLicgOiAn5LiL5p625LitLi4uJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIHVybDogJ2dvb2Rfc2V0LXZpc2lhYmxlJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIHN1Y2Nlc3M6IHJlcyA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCByZXMuc3RhdHVzID09PSAyMDAgKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHd4LnNob3dUb2FzdCh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aXRsZTogdmFsdWUgPyAn5LiK5p625oiQ5Yqf77yBJyA6ICfkuIvmnrbmiJDlip/vvIEnXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCB0YXJnZXQgPSBsaXN0LmZpbmQoKCB4OiBhbnkgKSA9PiB4Ll9pZCA9PT0gc2lnbiApO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBleGlzdGVkSW5kZXggPSBsaXN0LmZpbmRJbmRleCgoIHg6IGFueSApID0+IHguX2lkID09PSBzaWduICk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIChsaXN0IGFzIGFueSApLnNwbGljZSggZXhpc3RlZEluZGV4LCAxLCBPYmplY3QuYXNzaWduKHsgfSwgdGFyZ2V0LCB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2aXNpYWJsZTogdmFsdWVcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnNldERhdGEhKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxpc3RcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfSxcbiAgXG4gICAgLyoqIOeCueWHu+ivpuaDhSAqL1xuICAgIG9uVGFiKHsgY3VycmVudFRhcmdldCB9KSB7XG4gICAgICAgIGNvbnN0IHsgcGlkIH0gPSBjdXJyZW50VGFyZ2V0LmRhdGFzZXQ7XG4gICAgICAgIG5hdlRvKCBwaWQgP1xuICAgICAgICAgICAgYC9wYWdlcy9tYW5hZ2VyLWdvb2RzLWRldGFpbC9pbmRleD9pZD0ke3BpZH1gIDpcbiAgICAgICAgICAgIGAvcGFnZXMvbWFuYWdlci1nb29kcy1kZXRhaWwvaW5kZXhgXG4gICAgICAgICk7XG4gICAgfSxcblxuICAgIC8qKiDnoa7orqTovpPlhaUgKi9cbiAgICBvbkNvbmZpcm0oeyBkZXRhaWwgfSkge1xuXG4gICAgICAgIGNvbnN0IHNlYXJjaCA9IGRldGFpbDtcbiAgICAgIFxuICAgICAgICB0aGlzLnNldERhdGEhKHtcbiAgICAgICAgICAgIHBhZ2U6IDAsXG4gICAgICAgICAgICBzZWFyY2gsXG4gICAgICAgICAgICBjYW5Mb2FkTW9yZTogdHJ1ZVxuICAgICAgICB9KVxuXG4gICAgICAgIHRoaXMuZmV0Y2hEYXRhKCApO1xuICAgIH0sXG5cbiAgICAvKiog5Yig6Zmk6K+l5ZWG5ZOBICovXG4gICAgZGVsZXRlR29vZCh7IGN1cnJlbnRUYXJnZXQgfSkge1xuICAgICAgICBjb25zdCB7IHBpZCB9ID0gY3VycmVudFRhcmdldC5kYXRhc2V0O1xuICAgICAgICB3eC5zaG93TW9kYWwoe1xuICAgICAgICAgICAgdGl0bGU6ICfmj5DnpLonLFxuICAgICAgICAgICAgY29udGVudDogJ+ehruWumuWIoOmZpOatpOWVhuWTgeWQl++8nycsXG4gICAgICAgICAgICBzdWNjZXNzOiByZXMgPT4ge1xuICAgICAgICAgICAgICAgIGlmICggcmVzLmNvbmZpcm0gKSB7XG4gICAgICAgICAgICAgICAgaHR0cCh7XG4gICAgICAgICAgICAgICAgICAgIGRhdGE6IHsgXG4gICAgICAgICAgICAgICAgICAgICAgICBwaWRcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgdXJsOiAnZ29vZF9kZWxldGUnLFxuICAgICAgICAgICAgICAgICAgICBzdWNjZXNzOiByZXMgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgeyBzdGF0dXMsIGRhdGEgfSA9IHJlcztcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICggc3RhdHVzID09PSAyMDAgKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgd3guc2hvd1RvYXN0KHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGl0bGU6ICfliKDpmaTmiJDlip8hJ1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHsgbGlzdCB9ID0gdGhpcy5kYXRhO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxpc3Quc3BsaWNlKCBsaXN0LmZpbmRJbmRleCgoIHg6IGFueSApID0+IHguX2lkID09PSBwaWQgKSwgMSApO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc2V0RGF0YSEoe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsaXN0OiBbIC4uLmxpc3QgXVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9LFxuICBcbiAgICAvKipcbiAgICAgKiDnlJ/lkb3lkajmnJ/lh73mlbAtLeebkeWQrOmhtemdouWKoOi9vVxuICAgICAqL1xuICAgIG9uTG9hZCggb3B0aW9uczogYW55ICkge1xuICAgICAgICB3eC5oaWRlU2hhcmVNZW51KHsgfSk7XG4gICAgICAgIHRoaXMucnVuQ29tcHV0ZWQoICk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIOeUn+WRveWRqOacn+WHveaVsC0t55uR5ZCs6aG16Z2i5pi+56S6XG4gICAgICovXG4gICAgb25TaG93OiBmdW5jdGlvbiAoICkge1xuICAgICAgICB0aGlzLnNldERhdGEhKHtcbiAgICAgICAgICAgIHBhZ2U6IDAsXG4gICAgICAgICAgICBjYW5Mb2FkTW9yZTogdHJ1ZVxuICAgICAgICB9KTtcbiAgICAgICAgc2V0VGltZW91dCgoICkgPT4ge1xuICAgICAgICAgICAgdGhpcy5mZXRjaERhdGEoICk7XG4gICAgICAgIH0sIDIwICk7XG4gICAgfSxcbiAgXG4gICAgLyoqXG4gICAgICog55Sf5ZG95ZGo5pyf5Ye95pWwLS3nm5HlkKzpobXpnaLliJ3mrKHmuLLmn5PlrozmiJBcbiAgICAgKi9cbiAgICBvblJlYWR5OiBmdW5jdGlvbiAoKSB7XG4gIFxuICAgIH0sXG4gIFxuICAgIC8qKlxuICAgICAqIOeUn+WRveWRqOacn+WHveaVsC0t55uR5ZCs6aG16Z2i6ZqQ6JePXG4gICAgICovXG4gICAgb25IaWRlOiBmdW5jdGlvbiAoKSB7XG4gIFxuICAgIH0sXG4gIFxuICAgIC8qKlxuICAgICAqIOeUn+WRveWRqOacn+WHveaVsC0t55uR5ZCs6aG16Z2i5Y246L29XG4gICAgICovXG4gICAgb25VbmxvYWQ6IGZ1bmN0aW9uICgpIHtcbiAgXG4gICAgfSxcbiAgXG4gICAgLyoqXG4gICAgICog6aG16Z2i55u45YWz5LqL5Lu25aSE55CG5Ye95pWwLS3nm5HlkKznlKjmiLfkuIvmi4nliqjkvZxcbiAgICAgKi9cbiAgICBvblB1bGxEb3duUmVmcmVzaDogZnVuY3Rpb24gKCkge1xuICBcbiAgICB9LFxuICBcbiAgICAvKipcbiAgICAgKiDpobXpnaLkuIrmi4nop6blupXkuovku7bnmoTlpITnkIblh73mlbBcbiAgICAgKi9cbiAgICBvblJlYWNoQm90dG9tOiBmdW5jdGlvbiAoKSB7XG4gIFxuICAgIH0sXG4gIFxuICAgIC8qKlxuICAgICAqIOeUqOaIt+eCueWHu+WPs+S4iuinkuWIhuS6q1xuICAgICAqL1xuICAgIC8vIG9uU2hhcmVBcHBNZXNzYWdlOiBmdW5jdGlvbiAoKSB7XG4gIFxuICAgIC8vIH1cbiAgfSkiXX0=