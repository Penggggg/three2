"use strict";
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
                                data.data : that.data.list.concat(data.data)
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
                var newList = [res.data].concat(list);
                _this.setData({
                    list: newList
                });
            }
        });
    },
    onSwitch: function (e) {
        var _this = this;
        var _a = e.detail, value = _a.value, sign = _a.sign;
        var list = this.data.list.slice();
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
                                    list: list.slice()
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLDhDQUEwQztBQUMxQyxnREFBcUQ7QUFDckQscURBQW9EO0FBQ3BELGdEQUE0QztBQUc1QyxJQUFJLENBQUM7SUFLRCxJQUFJLEVBQUU7UUFHRixJQUFJLEVBQUUsQ0FBQztRQUdQLE1BQU0sRUFBRSxFQUFFO1FBR1YsSUFBSSxFQUFFLEVBQUc7UUFHVCxXQUFXLEVBQUUsS0FBSztRQUdsQixXQUFXLEVBQUUsSUFBSTtRQUdqQixTQUFTLEVBQUU7WUFDUDtnQkFDSSxLQUFLLEVBQUUsS0FBSztnQkFDWixLQUFLLEVBQUUsSUFBSTthQUNkLEVBQUU7Z0JBQ0MsS0FBSyxFQUFFLEtBQUs7Z0JBQ1osS0FBSyxFQUFFLEtBQUs7YUFDZjtTQUNKO0tBQ0o7SUFFRCxXQUFXO1FBQ1AsbUJBQVEsQ0FBRSxJQUFJLEVBQUU7WUFHWixLQUFLO2dCQUNPLElBQUEscUJBQUksQ0FBZTtnQkFDM0IsSUFBTSxJQUFJLEdBQUksSUFBSSxDQUFDLEdBQUcsQ0FBRSx5QkFBYyxDQUFFLENBQUM7Z0JBQ3pDLE9BQU8sSUFBSSxDQUFDO1lBQ2hCLENBQUM7U0FDSixDQUFDLENBQUE7SUFDTixDQUFDO0lBSUQsU0FBUztRQUNMLElBQU0sSUFBSSxHQUFHLElBQUksQ0FBQztRQUNaLElBQUEsY0FBc0QsRUFBcEQsNEJBQVcsRUFBRSw0QkFBVyxFQUFFLGNBQUksRUFBRSxrQkFBb0IsQ0FBQztRQUU3RCxJQUFLLFdBQVcsSUFBSSxDQUFDLFdBQVcsRUFBRztZQUMvQixPQUFPO1NBQ1Y7UUFFRCxJQUFJLENBQUMsT0FBUSxDQUFDO1lBQ1YsV0FBVyxFQUFFLElBQUk7U0FDcEIsQ0FBQyxDQUFDO1FBRUgsY0FBSSxDQUFDO1lBQ0QsSUFBSSxFQUFFO2dCQUNGLEtBQUssRUFBRSxFQUFFO2dCQUNULEtBQUssRUFBRSxNQUFNO2dCQUNiLElBQUksRUFBRSxJQUFJLEdBQUcsQ0FBQzthQUNqQjtZQUNELEdBQUcsRUFBRSxXQUFXO1lBQ2hCLE9BQU8sRUFBRSxVQUFBLEdBQUc7Z0JBQ0EsSUFBQSxtQkFBTSxFQUFFLGVBQUksQ0FBUztnQkFFN0IsSUFBSyxNQUFNLEtBQUssR0FBRyxFQUFHO29CQUNWLElBQUEsa0JBQUksRUFBRSwwQkFBUyxDQUFVO29CQUVqQyxJQUFJLENBQUMsT0FBUSxDQUFDO3dCQUNWLElBQUksUUFBQTt3QkFDSixXQUFXLEVBQUUsS0FBSzt3QkFDbEIsV0FBVyxFQUFFLFNBQVMsR0FBRyxNQUFJO3FCQUNoQyxDQUFDLENBQUM7b0JBRUgsSUFBSyxJQUFJLENBQUMsSUFBSSxJQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRzt3QkFDckMsSUFBSSxDQUFDLE9BQVEsQ0FBQzs0QkFDVixJQUFJLEVBQUUsTUFBSSxLQUFLLENBQUMsQ0FBQyxDQUFDO2dDQUNkLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUNOLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxRQUFLLElBQUksQ0FBQyxJQUFJLENBQUM7eUJBQ3pDLENBQUMsQ0FBQztxQkFDTjt5QkFBTTt3QkFDSCxJQUFJLENBQUMsT0FBUSxDQUFDOzRCQUNWLElBQUksRUFBRSxFQUFHO3lCQUNaLENBQUMsQ0FBQztxQkFDTjtpQkFFSjtZQUNMLENBQUM7U0FFSixDQUFDLENBQUM7SUFDUCxDQUFDO0lBR0QsUUFBUSxZQUFFLEdBQUc7UUFBYixpQkFjQztRQWJHLGNBQUksQ0FBQztZQUNELElBQUksRUFBRTtnQkFDRixHQUFHLEVBQUUsR0FBRzthQUNYO1lBQ0QsR0FBRyxFQUFFLGFBQWE7WUFDbEIsT0FBTyxFQUFFLFVBQUEsR0FBRztnQkFDQSxJQUFBLHNCQUFJLENBQWU7Z0JBQzNCLElBQU0sT0FBTyxJQUFVLEdBQUcsQ0FBQyxJQUFJLFNBQUssSUFBSSxDQUFFLENBQUM7Z0JBQzNDLEtBQUksQ0FBQyxPQUFRLENBQUM7b0JBQ1YsSUFBSSxFQUFFLE9BQU87aUJBQ2hCLENBQUMsQ0FBQztZQUNQLENBQUM7U0FDSixDQUFDLENBQUM7SUFDUCxDQUFDO0lBR0QsUUFBUSxZQUFFLENBQUM7UUFBWCxpQkFrQ0M7UUFqQ1MsSUFBQSxhQUEwQixFQUF4QixnQkFBSyxFQUFFLGNBQWlCLENBQUM7UUFDakMsSUFBTSxJQUFJLEdBQVEsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLFFBQUUsQ0FBQztRQUNuQyxFQUFFLENBQUMsU0FBUyxDQUFDO1lBQ1QsS0FBSyxFQUFFLElBQUk7WUFDWCxPQUFPLEVBQUUsd0JBQU8sS0FBSyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksb0NBQVE7WUFDM0MsT0FBTyxFQUFFLFVBQUEsR0FBRztnQkFDUixJQUFLLEdBQUcsQ0FBQyxPQUFPLEVBQUc7b0JBQ2YsY0FBSSxDQUFDO3dCQUNELElBQUksRUFBRTs0QkFDRixHQUFHLEVBQUUsSUFBSTs0QkFDVCxRQUFRLEVBQUUsS0FBSzt5QkFDbEI7d0JBQ0QsVUFBVSxFQUFFLEtBQUssQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxRQUFRO3dCQUN2QyxHQUFHLEVBQUUsbUJBQW1CO3dCQUN4QixPQUFPLEVBQUUsVUFBQSxHQUFHOzRCQUNSLElBQUssR0FBRyxDQUFDLE1BQU0sS0FBSyxHQUFHLEVBQUc7Z0NBQ3RCLEVBQUUsQ0FBQyxTQUFTLENBQUM7b0NBQ1QsS0FBSyxFQUFFLEtBQUssQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxPQUFPO2lDQUNuQyxDQUFDLENBQUM7Z0NBQ0gsSUFBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxVQUFFLENBQU0sSUFBTSxPQUFBLENBQUMsQ0FBQyxHQUFHLEtBQUssSUFBSSxFQUFkLENBQWMsQ0FBRSxDQUFDO2dDQUN4RCxJQUFNLFlBQVksR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLFVBQUUsQ0FBTSxJQUFNLE9BQUEsQ0FBQyxDQUFDLEdBQUcsS0FBSyxJQUFJLEVBQWQsQ0FBYyxDQUFFLENBQUM7Z0NBQ2xFLElBQWEsQ0FBQyxNQUFNLENBQUUsWUFBWSxFQUFFLENBQUMsRUFBRSxNQUFNLENBQUMsTUFBTSxDQUFDLEVBQUcsRUFBRSxNQUFNLEVBQUU7b0NBQy9ELFFBQVEsRUFBRSxLQUFLO2lDQUNsQixDQUFDLENBQUMsQ0FBQztnQ0FDSixLQUFJLENBQUMsT0FBUSxDQUFDO29DQUNWLElBQUksTUFBQTtpQ0FDUCxDQUFDLENBQUM7NkJBQ047d0JBQ0wsQ0FBQztxQkFDSixDQUFDLENBQUE7aUJBQ0w7WUFDTCxDQUFDO1NBQ0osQ0FBQyxDQUFDO0lBQ1AsQ0FBQztJQUdELEtBQUssWUFBQyxFQUFpQjtZQUFmLGdDQUFhO1FBQ1QsSUFBQSwrQkFBRyxDQUEyQjtRQUN0QyxnQkFBSyxDQUFFLEdBQUcsQ0FBQyxDQUFDO1lBQ1IsMENBQXdDLEdBQUssQ0FBQyxDQUFDO1lBQy9DLG1DQUFtQyxDQUN0QyxDQUFDO0lBQ04sQ0FBQztJQUdELFNBQVMsWUFBQyxFQUFVO1lBQVIsa0JBQU07UUFFZCxJQUFNLE1BQU0sR0FBRyxNQUFNLENBQUM7UUFFdEIsSUFBSSxDQUFDLE9BQVEsQ0FBQztZQUNWLElBQUksRUFBRSxDQUFDO1lBQ1AsTUFBTSxRQUFBO1lBQ04sV0FBVyxFQUFFLElBQUk7U0FDcEIsQ0FBQyxDQUFBO1FBRUYsSUFBSSxDQUFDLFNBQVMsRUFBRyxDQUFDO0lBQ3RCLENBQUM7SUFHRCxVQUFVLFlBQUMsRUFBaUI7UUFBNUIsaUJBNkJDO1lBN0JZLGdDQUFhO1FBQ2QsSUFBQSwrQkFBRyxDQUEyQjtRQUN0QyxFQUFFLENBQUMsU0FBUyxDQUFDO1lBQ1QsS0FBSyxFQUFFLElBQUk7WUFDWCxPQUFPLEVBQUUsV0FBVztZQUNwQixPQUFPLEVBQUUsVUFBQSxHQUFHO2dCQUNSLElBQUssR0FBRyxDQUFDLE9BQU8sRUFBRztvQkFDbkIsY0FBSSxDQUFDO3dCQUNELElBQUksRUFBRTs0QkFDRixHQUFHLEtBQUE7eUJBQ047d0JBQ0QsR0FBRyxFQUFFLGFBQWE7d0JBQ2xCLE9BQU8sRUFBRSxVQUFBLEdBQUc7NEJBQ0EsSUFBQSxtQkFBTSxFQUFFLGVBQUksQ0FBUzs0QkFDN0IsSUFBSyxNQUFNLEtBQUssR0FBRyxFQUFHO2dDQUNsQixFQUFFLENBQUMsU0FBUyxDQUFDO29DQUNULEtBQUssRUFBRSxPQUFPO2lDQUNqQixDQUFDLENBQUM7Z0NBQ0ssSUFBQSxzQkFBSSxDQUFlO2dDQUMzQixJQUFJLENBQUMsTUFBTSxDQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsVUFBRSxDQUFNLElBQU0sT0FBQSxDQUFDLENBQUMsR0FBRyxLQUFLLEdBQUcsRUFBYixDQUFhLENBQUUsRUFBRSxDQUFDLENBQUUsQ0FBQztnQ0FDL0QsS0FBSSxDQUFDLE9BQVEsQ0FBQztvQ0FDVixJQUFJLEVBQU8sSUFBSSxRQUFFO2lDQUNwQixDQUFDLENBQUM7NkJBQ047d0JBQ0wsQ0FBQztxQkFDSixDQUFDLENBQUM7aUJBQ0Y7WUFDTCxDQUFDO1NBQ0osQ0FBQyxDQUFDO0lBQ1AsQ0FBQztJQUtELE1BQU0sWUFBRSxPQUFZO1FBQ2hCLEVBQUUsQ0FBQyxhQUFhLENBQUMsRUFBRyxDQUFDLENBQUM7UUFDdEIsSUFBSSxDQUFDLFdBQVcsRUFBRyxDQUFDO0lBQ3hCLENBQUM7SUFLRCxNQUFNLEVBQUU7UUFBQSxpQkFRUDtRQVBHLElBQUksQ0FBQyxPQUFRLENBQUM7WUFDVixJQUFJLEVBQUUsQ0FBQztZQUNQLFdBQVcsRUFBRSxJQUFJO1NBQ3BCLENBQUMsQ0FBQztRQUNILFVBQVUsQ0FBQztZQUNQLEtBQUksQ0FBQyxTQUFTLEVBQUcsQ0FBQztRQUN0QixDQUFDLEVBQUUsRUFBRSxDQUFFLENBQUM7SUFDWixDQUFDO0lBS0QsT0FBTyxFQUFFO0lBRVQsQ0FBQztJQUtELE1BQU0sRUFBRTtJQUVSLENBQUM7SUFLRCxRQUFRLEVBQUU7SUFFVixDQUFDO0lBS0QsaUJBQWlCLEVBQUU7SUFFbkIsQ0FBQztJQUtELGFBQWEsRUFBRTtJQUVmLENBQUM7Q0FRRixDQUFDLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBodHRwIH0gZnJvbSAnLi4vLi4vdXRpbC9odHRwLmpzJztcbmltcG9ydCB7IGRlbGF5ZXJpbmdHb29kIH0gZnJvbSAnLi4vLi4vdXRpbC9nb29kcy5qcyc7XG5pbXBvcnQgeyBjb21wdXRlZCB9IGZyb20gJy4uLy4uL2xpYi92dWVmeS9pbmRleC5qcyc7XG5pbXBvcnQgeyBuYXZUbyB9IGZyb20gJy4uLy4uL3V0aWwvcm91dGUuanMnO1xuXG4vLyBhcHAvcGFnZXMvbWFuYWdlci1nb29kcy1saXN0L2luZGV4LmpzXG5QYWdlKHtcblxuICAgIC8qKlxuICAgICAqIOmhtemdoueahOWIneWni+aVsOaNrlxuICAgICAqL1xuICAgIGRhdGE6IHtcblxuICAgICAgICAvLyDlvZPliY3pobXnoIFcbiAgICAgICAgcGFnZTogMCxcblxuICAgICAgICAvLyDmkJzntKJcbiAgICAgICAgc2VhcmNoOiAnJyxcblxuICAgICAgICAvLyDllYblk4HliJfooahcbiAgICAgICAgbGlzdDogWyBdLFxuXG4gICAgICAgIC8vIOWKoOi9veWIl+ihqGluZ1xuICAgICAgICBsb2FkaW5nTGlzdDogZmFsc2UsXG5cbiAgICAgICAgLy8g6IO95ZCm57un57ut5Yqg6L29XG4gICAgICAgIGNhbkxvYWRNb3JlOiB0cnVlLFxuXG4gICAgICAgIC8qKiDkuIrkuIvmnrbpgInpobkgKi9cbiAgICAgICAgY2xvc2VPcHRzOiBbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgbGFiZWw6ICfkuIrmnrbkuK0nLFxuICAgICAgICAgICAgICAgIHZhbHVlOiB0cnVlXG4gICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgbGFiZWw6ICfmnKrkuIrmnrYnLFxuICAgICAgICAgICAgICAgIHZhbHVlOiBmYWxzZVxuICAgICAgICAgICAgfVxuICAgICAgICBdXG4gICAgfSxcblxuICAgIHJ1bkNvbXB1dGVkKCApIHtcbiAgICAgICAgY29tcHV0ZWQoIHRoaXMsIHtcblxuICAgICAgICAgICAgLy8g5YiX6KGoXG4gICAgICAgICAgICBsaXN0JCggKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgeyBsaXN0IH0gPSB0aGlzLmRhdGE7XG4gICAgICAgICAgICAgICAgY29uc3QgbWV0YSAgPSBsaXN0Lm1hcCggZGVsYXllcmluZ0dvb2QgKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gbWV0YTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSlcbiAgICB9LFxuICBcbiAgXG4gICAgLyoqIOaLieWPluWIl+ihqCAqL1xuICAgIGZldGNoRGF0YSggKSB7XG4gICAgICAgIGNvbnN0IHRoYXQgPSB0aGlzO1xuICAgICAgICBjb25zdCB7IGNhbkxvYWRNb3JlLCBsb2FkaW5nTGlzdCwgcGFnZSwgc2VhcmNoIH0gPSB0aGlzLmRhdGE7XG5cbiAgICAgICAgaWYgKCBsb2FkaW5nTGlzdCB8fCAhY2FuTG9hZE1vcmUgKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLnNldERhdGEhKHtcbiAgICAgICAgICAgIGxvYWRpbmdMaXN0OiB0cnVlXG4gICAgICAgIH0pO1xuXG4gICAgICAgIGh0dHAoe1xuICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgIGxpbWl0OiAxMCxcbiAgICAgICAgICAgICAgICB0aXRsZTogc2VhcmNoLFxuICAgICAgICAgICAgICAgIHBhZ2U6IHBhZ2UgKyAxLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHVybDogYGdvb2RfbGlzdGAsXG4gICAgICAgICAgICBzdWNjZXNzOiByZXMgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IHsgc3RhdHVzLCBkYXRhIH0gPSByZXM7XG4gICAgICAgICBcbiAgICAgICAgICAgICAgICBpZiAoIHN0YXR1cyA9PT0gMjAwICkge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCB7IHBhZ2UsIHRvdGFsUGFnZSB9ID0gZGF0YTtcblxuICAgICAgICAgICAgICAgICAgICB0aGF0LnNldERhdGEhKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHBhZ2UsXG4gICAgICAgICAgICAgICAgICAgICAgICBsb2FkaW5nTGlzdDogZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgICAgICBjYW5Mb2FkTW9yZTogdG90YWxQYWdlID4gcGFnZVxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgIGlmICggZGF0YS5kYXRhICYmIGRhdGEuZGF0YS5sZW5ndGggPiAwICkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhhdC5zZXREYXRhISh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGlzdDogcGFnZSA9PT0gMSA/XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGEuZGF0YSA6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFsgLi4udGhhdC5kYXRhLmxpc3QsIC4uLmRhdGEuZGF0YV1cbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhhdC5zZXREYXRhISh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGlzdDogWyBdXG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgIH0pO1xuICAgIH0sXG5cbiAgICAvKiog6I635Y+W5paw5Yib5bu655qE5ZWG5ZOBICovXG4gICAgZmV0Y2hOZXcoIHBpZCApIHtcbiAgICAgICAgaHR0cCh7XG4gICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgX2lkOiBwaWRcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB1cmw6ICdnb29kX2RldGFpbCcsXG4gICAgICAgICAgICBzdWNjZXNzOiByZXMgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IHsgbGlzdCB9ID0gdGhpcy5kYXRhO1xuICAgICAgICAgICAgICAgIGNvbnN0IG5ld0xpc3Q6IGFueSA9IFsgcmVzLmRhdGEsIC4uLmxpc3QgXTtcbiAgICAgICAgICAgICAgICB0aGlzLnNldERhdGEhKHtcbiAgICAgICAgICAgICAgICAgICAgbGlzdDogbmV3TGlzdFxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9LFxuXG4gICAgLyoqIOaWh+Wtl+mAiemhuSDvvIzlvIDlkK/lhbPpl63kuIrkuIvmnrYqL1xuICAgIG9uU3dpdGNoKCBlICkge1xuICAgICAgICBjb25zdCB7IHZhbHVlLCBzaWduIH0gPSBlLmRldGFpbDtcbiAgICAgICAgY29uc3QgbGlzdCA9IFsgLi4udGhpcy5kYXRhLmxpc3QgXTtcbiAgICAgICAgd3guc2hvd01vZGFsKHtcbiAgICAgICAgICAgIHRpdGxlOiAn5o+Q56S6JyxcbiAgICAgICAgICAgIGNvbnRlbnQ6IGDnoa7lrpropoEkeyB2YWx1ZSA/ICfkuIrmnrYnIDogJ+S4i+aeticgfeatpOWVhuWTgeWQl++8n2AsXG4gICAgICAgICAgICBzdWNjZXNzOiByZXMgPT4ge1xuICAgICAgICAgICAgICAgIGlmICggcmVzLmNvbmZpcm0gKSB7XG4gICAgICAgICAgICAgICAgICAgIGh0dHAoe1xuICAgICAgICAgICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBpZDogc2lnbixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2aXNpYWJsZTogdmFsdWVcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICBsb2FkaW5nTXNnOiB2YWx1ZSA/ICfkuIrmnrbkuK0uLi4nIDogJ+S4i+aetuS4rS4uLicsXG4gICAgICAgICAgICAgICAgICAgICAgICB1cmw6ICdnb29kX3NldC12aXNpYWJsZScsXG4gICAgICAgICAgICAgICAgICAgICAgICBzdWNjZXNzOiByZXMgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICggcmVzLnN0YXR1cyA9PT0gMjAwICkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB3eC5zaG93VG9hc3Qoe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGl0bGU6IHZhbHVlID8gJ+S4iuaetuaIkOWKn++8gScgOiAn5LiL5p625oiQ5Yqf77yBJ1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgdGFyZ2V0ID0gbGlzdC5maW5kKCggeDogYW55ICkgPT4geC5faWQgPT09IHNpZ24gKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgZXhpc3RlZEluZGV4ID0gbGlzdC5maW5kSW5kZXgoKCB4OiBhbnkgKSA9PiB4Ll9pZCA9PT0gc2lnbiApO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAobGlzdCBhcyBhbnkgKS5zcGxpY2UoIGV4aXN0ZWRJbmRleCwgMSwgT2JqZWN0LmFzc2lnbih7IH0sIHRhcmdldCwge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmlzaWFibGU6IHZhbHVlXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zZXREYXRhISh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsaXN0XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH0sXG4gIFxuICAgIC8qKiDngrnlh7vor6bmg4UgKi9cbiAgICBvblRhYih7IGN1cnJlbnRUYXJnZXQgfSkge1xuICAgICAgICBjb25zdCB7IHBpZCB9ID0gY3VycmVudFRhcmdldC5kYXRhc2V0O1xuICAgICAgICBuYXZUbyggcGlkID9cbiAgICAgICAgICAgIGAvcGFnZXMvbWFuYWdlci1nb29kcy1kZXRhaWwvaW5kZXg/aWQ9JHtwaWR9YCA6XG4gICAgICAgICAgICBgL3BhZ2VzL21hbmFnZXItZ29vZHMtZGV0YWlsL2luZGV4YFxuICAgICAgICApO1xuICAgIH0sXG5cbiAgICAvKiog56Gu6K6k6L6T5YWlICovXG4gICAgb25Db25maXJtKHsgZGV0YWlsIH0pIHtcblxuICAgICAgICBjb25zdCBzZWFyY2ggPSBkZXRhaWw7XG4gICAgICBcbiAgICAgICAgdGhpcy5zZXREYXRhISh7XG4gICAgICAgICAgICBwYWdlOiAwLFxuICAgICAgICAgICAgc2VhcmNoLFxuICAgICAgICAgICAgY2FuTG9hZE1vcmU6IHRydWVcbiAgICAgICAgfSlcblxuICAgICAgICB0aGlzLmZldGNoRGF0YSggKTtcbiAgICB9LFxuXG4gICAgLyoqIOWIoOmZpOivpeWVhuWTgSAqL1xuICAgIGRlbGV0ZUdvb2QoeyBjdXJyZW50VGFyZ2V0IH0pIHtcbiAgICAgICAgY29uc3QgeyBwaWQgfSA9IGN1cnJlbnRUYXJnZXQuZGF0YXNldDtcbiAgICAgICAgd3guc2hvd01vZGFsKHtcbiAgICAgICAgICAgIHRpdGxlOiAn5o+Q56S6JyxcbiAgICAgICAgICAgIGNvbnRlbnQ6ICfnoa7lrprliKDpmaTmraTllYblk4HlkJfvvJ8nLFxuICAgICAgICAgICAgc3VjY2VzczogcmVzID0+IHtcbiAgICAgICAgICAgICAgICBpZiAoIHJlcy5jb25maXJtICkge1xuICAgICAgICAgICAgICAgIGh0dHAoe1xuICAgICAgICAgICAgICAgICAgICBkYXRhOiB7IFxuICAgICAgICAgICAgICAgICAgICAgICAgcGlkXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIHVybDogJ2dvb2RfZGVsZXRlJyxcbiAgICAgICAgICAgICAgICAgICAgc3VjY2VzczogcmVzID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHsgc3RhdHVzLCBkYXRhIH0gPSByZXM7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIHN0YXR1cyA9PT0gMjAwICkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHd4LnNob3dUb2FzdCh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRpdGxlOiAn5Yig6Zmk5oiQ5YqfISdcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCB7IGxpc3QgfSA9IHRoaXMuZGF0YTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsaXN0LnNwbGljZSggbGlzdC5maW5kSW5kZXgoKCB4OiBhbnkgKSA9PiB4Ll9pZCA9PT0gcGlkICksIDEgKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnNldERhdGEhKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGlzdDogWyAuLi5saXN0IF1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfSxcbiAgXG4gICAgLyoqXG4gICAgICog55Sf5ZG95ZGo5pyf5Ye95pWwLS3nm5HlkKzpobXpnaLliqDovb1cbiAgICAgKi9cbiAgICBvbkxvYWQoIG9wdGlvbnM6IGFueSApIHtcbiAgICAgICAgd3guaGlkZVNoYXJlTWVudSh7IH0pO1xuICAgICAgICB0aGlzLnJ1bkNvbXB1dGVkKCApO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiDnlJ/lkb3lkajmnJ/lh73mlbAtLeebkeWQrOmhtemdouaYvuekulxuICAgICAqL1xuICAgIG9uU2hvdzogZnVuY3Rpb24gKCApIHtcbiAgICAgICAgdGhpcy5zZXREYXRhISh7XG4gICAgICAgICAgICBwYWdlOiAwLFxuICAgICAgICAgICAgY2FuTG9hZE1vcmU6IHRydWVcbiAgICAgICAgfSk7XG4gICAgICAgIHNldFRpbWVvdXQoKCApID0+IHtcbiAgICAgICAgICAgIHRoaXMuZmV0Y2hEYXRhKCApO1xuICAgICAgICB9LCAyMCApO1xuICAgIH0sXG4gIFxuICAgIC8qKlxuICAgICAqIOeUn+WRveWRqOacn+WHveaVsC0t55uR5ZCs6aG16Z2i5Yid5qyh5riy5p+T5a6M5oiQXG4gICAgICovXG4gICAgb25SZWFkeTogZnVuY3Rpb24gKCkge1xuICBcbiAgICB9LFxuICBcbiAgICAvKipcbiAgICAgKiDnlJ/lkb3lkajmnJ/lh73mlbAtLeebkeWQrOmhtemdoumakOiXj1xuICAgICAqL1xuICAgIG9uSGlkZTogZnVuY3Rpb24gKCkge1xuICBcbiAgICB9LFxuICBcbiAgICAvKipcbiAgICAgKiDnlJ/lkb3lkajmnJ/lh73mlbAtLeebkeWQrOmhtemdouWNuOi9vVxuICAgICAqL1xuICAgIG9uVW5sb2FkOiBmdW5jdGlvbiAoKSB7XG4gIFxuICAgIH0sXG4gIFxuICAgIC8qKlxuICAgICAqIOmhtemdouebuOWFs+S6i+S7tuWkhOeQhuWHveaVsC0t55uR5ZCs55So5oi35LiL5ouJ5Yqo5L2cXG4gICAgICovXG4gICAgb25QdWxsRG93blJlZnJlc2g6IGZ1bmN0aW9uICgpIHtcbiAgXG4gICAgfSxcbiAgXG4gICAgLyoqXG4gICAgICog6aG16Z2i5LiK5ouJ6Kem5bqV5LqL5Lu255qE5aSE55CG5Ye95pWwXG4gICAgICovXG4gICAgb25SZWFjaEJvdHRvbTogZnVuY3Rpb24gKCkge1xuICBcbiAgICB9LFxuICBcbiAgICAvKipcbiAgICAgKiDnlKjmiLfngrnlh7vlj7PkuIrop5LliIbkuqtcbiAgICAgKi9cbiAgICAvLyBvblNoYXJlQXBwTWVzc2FnZTogZnVuY3Rpb24gKCkge1xuICBcbiAgICAvLyB9XG4gIH0pIl19