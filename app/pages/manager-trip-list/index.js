"use strict";
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var app = getApp();
var http_1 = require("../../util/http");
var route_js_1 = require("../../util/route.js");
Page({
    data: {
        page: 0,
        totalPage: 1,
        search: '',
        list: [],
        loadingList: false,
        canLoadMore: true,
        lastSearch: '',
        isNotAvailableTrip: false,
        bgs: [
            'background-image: linear-gradient(120deg, #84fab0 0%, #8fd3f4 100%);',
            'background-image: linear-gradient(45deg, #ff9a9e 0%, #fad0c4 99%, #fad0c4 100%);',
            'background-image: linear-gradient(120deg, #89f7fe 0%, #66a6ff 100%);',
            'background-image: linear-gradient(to top, #37ecba 0%, #72afd3 100%);',
            'background-image: linear-gradient(-45deg, #FFC796 0%, #FF6B95 100%);',
            'background-image: linear-gradient(-225deg, #20E2D7 0%, #F9FEA5 100%);',
            'background-image: linear-gradient(-225deg, #9EFBD3 0%, #57E9F2 48%, #45D4FB 100%);',
        ],
        bg2s: [
            'https://global-1257764567.cos.ap-guangzhou.myqcloud.com/icon-bg-trip-manager-list-colorful.png',
            'https://global-1257764567.cos.ap-guangzhou.myqcloud.com/icon-bg2-trip-manager-list-colorful.png'
        ],
        showSuccess: false
    },
    navigate: function (e) {
        route_js_1.navTo('/pages/manager-trip-detail/index');
    },
    onConformSearch: function (_a) {
        var detail = _a.detail;
        this.setData({
            page: 0,
            totalPage: 0,
            search: detail,
            canLoadMore: true
        });
        this.fetchData();
    },
    fetchData: function () {
        var _this = this;
        var _a = this.data, canLoadMore = _a.canLoadMore, loadingList = _a.loadingList, lastSearch = _a.lastSearch, search = _a.search;
        if (loadingList || !canLoadMore) {
            return;
        }
        if (search.replace(/\s+/g, "") !== lastSearch) {
            this.setData({
                page: 0,
                totalPage: 1
            });
        }
        this.setData({
            loadingList: true
        });
        http_1.http({
            data: {
                page: this.data.page + 1,
                title: this.data.search
            },
            errMsg: '加载失败，请重试',
            loadingMsg: '加载中...',
            url: "trip_list",
            success: function (res) {
                var status = res.status, data = res.data;
                if (status === 200) {
                    var page = data.page, totalPage = data.totalPage, search_1 = data.search;
                    _this.setData({
                        page: page,
                        totalPage: totalPage,
                        lastSearch: search_1 || '',
                        canLoadMore: totalPage > page,
                        isNotAvailableTrip: !data.data.some(function (x) { return x.published === true && new Date().getTime() < x.start_date; })
                    });
                    if (data.data && data.data.length > 0) {
                        var meta = page === 1 ?
                            _this.dealListText(data.data) : __spreadArrays(_this.data.list, _this.dealListText(data.data));
                        _this.setData({
                            list: meta
                        });
                    }
                    else {
                        _this.setData({
                            list: []
                        });
                    }
                }
                _this.setData({
                    loadingList: false
                });
            }
        });
    },
    dealListText: function (list) {
        var bg2s = this.data.bg2s;
        var simpleTime = function (ts) {
            var time = new Date(Number(ts));
            return time.getMonth() + 1 + "\u6708" + time.getDate() + "\u65E5";
        };
        var simpleTime2 = function (ts) {
            var time = new Date(Number(ts));
            return time.getMonth() + 1 + "." + time.getDate();
        };
        var meta = list.map(function (x, k) {
            var _id = x._id, type = x.type, selectedProductIds = x.selectedProductIds, title = x.title, sales_volume = x.sales_volume, start_date = x.start_date, published = x.published, end_date = x.end_date, orders = x.orders, isClosed = x.isClosed, clients = x.clients, notPayAllClients = x.notPayAllClients;
            var state$ = !published ?
                '未发布' :
                isClosed ?
                    '已结束' :
                    new Date().getTime() >= end_date ?
                        '已结束' :
                        new Date().getTime() >= start_date ?
                            '进行中' :
                            '即将开始';
            return {
                _id: _id,
                tid: _id,
                title: title,
                orders: orders,
                bg: k % 7,
                imgBg: k % 2 ? bg2s[1] : bg2s[0],
                sales_volume: sales_volume,
                state$: state$,
                isClosed: isClosed,
                clients: clients,
                notPayAllClients: notPayAllClients,
                ing: state$ === '进行中',
                endDate: simpleTime(end_date),
                startDate: simpleTime(start_date),
                endDate2: simpleTime2(end_date),
                startDate2: simpleTime2(start_date),
                hasProductIds: selectedProductIds.length > 0,
                red: state$ === '未发布' || state$ === '进行中' || state$ === '即将开始',
                label: type === 'sys' && state$ === '进行中' ? '自动创建' : ''
            };
        });
        return meta;
    },
    onInput: function (_a) {
        var detail = _a.detail;
        this.setData({
            search: detail.value,
            canLoadMore: detail.value.replace(/\s+/g, "") !== this.data.lastSearch
        });
    },
    onTab: function (_a) {
        var currentTarget = _a.currentTarget, detail = _a.detail;
        var tid = currentTarget.dataset.tid;
        if (!tid) {
            return;
        }
        this.onSubscribe();
        route_js_1.navTo("/pages/manager-trip-detail/index?id=" + tid);
    },
    goOrder: function (_a) {
        var currentTarget = _a.currentTarget, detail = _a.detail;
        this.onSubscribe();
        var tid = currentTarget.dataset.tid;
        return http_1.http({
            url: 'trip_close-trip-analyze',
            data: {
                tid: tid
            }
        });
        route_js_1.navTo("/pages/manager-trip-order/index?id=" + tid);
    },
    onSubscribe: function () {
        app.getSubscribe('newOrder,trip,waitPin');
    },
    onLoad: function (query) {
        wx.hideShareMenu({});
        this.setData({
            showSuccess: String(query.s) === '1'
        });
    },
    onReady: function () {
    },
    onShow: function () {
        this.setData({
            page: 0,
            canLoadMore: true
        });
        this.fetchData();
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
        this.setData({
            showSuccess: false
        });
        return {
            title: '超值群拼团～进来看看吧',
            path: '/pages/ground-pin/index',
            imageUrl: 'https://global-1257764567.cos.ap-guangzhou.myqcloud.com/bg-trip-reward-share-colorful.jpg'
        };
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7QUFBQSxJQUFNLEdBQUcsR0FBRyxNQUFNLEVBQVEsQ0FBQztBQUMzQix3Q0FBdUM7QUFDdkMsZ0RBQTRDO0FBRTVDLElBQUksQ0FBQztJQU1ELElBQUksRUFBRTtRQUVGLElBQUksRUFBRSxDQUFDO1FBRVAsU0FBUyxFQUFFLENBQUM7UUFFWixNQUFNLEVBQUUsRUFBRTtRQUVWLElBQUksRUFBRSxFQUFHO1FBRVQsV0FBVyxFQUFFLEtBQUs7UUFFbEIsV0FBVyxFQUFFLElBQUk7UUFFakIsVUFBVSxFQUFFLEVBQUU7UUFFZCxrQkFBa0IsRUFBRSxLQUFLO1FBRXpCLEdBQUcsRUFBRTtZQUNELHNFQUFzRTtZQUN0RSxrRkFBa0Y7WUFDbEYsc0VBQXNFO1lBQ3RFLHNFQUFzRTtZQUN0RSxzRUFBc0U7WUFDdEUsdUVBQXVFO1lBQ3ZFLG9GQUFvRjtTQUN2RjtRQUNELElBQUksRUFBRTtZQUNGLGdHQUFnRztZQUNoRyxpR0FBaUc7U0FDcEc7UUFFRCxXQUFXLEVBQUUsS0FBSztLQUNyQjtJQUdELFFBQVEsWUFBRSxDQUFDO1FBQ1AsZ0JBQUssQ0FBQyxrQ0FBa0MsQ0FBQyxDQUFDO0lBQzlDLENBQUM7SUFHRCxlQUFlLEVBQWYsVUFBZ0IsRUFBVTtZQUFSLGtCQUFNO1FBQ3BCLElBQUksQ0FBQyxPQUFRLENBQUM7WUFDVixJQUFJLEVBQUUsQ0FBQztZQUNQLFNBQVMsRUFBRSxDQUFDO1lBQ1osTUFBTSxFQUFFLE1BQU07WUFDZCxXQUFXLEVBQUUsSUFBSTtTQUNwQixDQUFDLENBQUM7UUFDSCxJQUFJLENBQUMsU0FBUyxFQUFHLENBQUM7SUFDdEIsQ0FBQztJQUdELFNBQVMsRUFBVDtRQUFBLGlCQTZEQztRQTNEUyxJQUFBLGNBQTRELEVBQTFELDRCQUFXLEVBQUUsNEJBQVcsRUFBRSwwQkFBVSxFQUFFLGtCQUFvQixDQUFD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QUM5QixJQUFJLEVBQUU7Z0JBQ0YsR0FBRyxLQUFBO2FBQ047U0FDSixDQUFDLENBQUE7UUFDRixnQkFBSyxDQUFDLHdDQUFzQyxHQUFLLENBQUMsQ0FBQztJQUN2RCxDQUFDO0lBRUQsV0FBVztRQUNQLEdBQUcsQ0FBQyxZQUFZLENBQUMsdUJBQXVCLENBQUMsQ0FBQztJQUM5QyxDQUFDO0lBT0QsTUFBTSxFQUFFLFVBQVcsS0FBVTtRQUN6QixFQUFFLENBQUMsYUFBYSxDQUFDLEVBQUcsQ0FBQyxDQUFDO1FBQ3RCLElBQUksQ0FBQyxPQUFRLENBQUM7WUFDVixXQUFXLEVBQUUsTUFBTSxDQUFFLEtBQUssQ0FBQyxDQUFDLENBQUUsS0FBSyxHQUFHO1NBQ3pDLENBQUMsQ0FBQTtJQUNOLENBQUM7SUFLRCxPQUFPLEVBQUU7SUFFVCxDQUFDO0lBS0QsTUFBTSxFQUFFO1FBQ0osSUFBSSxDQUFDLE9BQVEsQ0FBQztZQUNWLElBQUksRUFBRSxDQUFDO1lBQ1AsV0FBVyxFQUFFLElBQUk7U0FDcEIsQ0FBQyxDQUFDO1FBQ0gsSUFBSSxDQUFDLFNBQVMsRUFBRyxDQUFDO0lBQ3RCLENBQUM7SUFLRCxNQUFNLEVBQUU7SUFFUixDQUFDO0lBS0QsUUFBUSxFQUFFO0lBRVYsQ0FBQztJQUtELGlCQUFpQixFQUFFO0lBRW5CLENBQUM7SUFLRCxhQUFhLEVBQUU7SUFFZixDQUFDO0lBS0QsaUJBQWlCLEVBQUU7UUFDZixJQUFJLENBQUMsT0FBUSxDQUFDO1lBQ1YsV0FBVyxFQUFFLEtBQUs7U0FDckIsQ0FBQyxDQUFDO1FBQ0gsT0FBTztZQUNILEtBQUssRUFBRSxhQUFhO1lBQ3BCLElBQUksRUFBRSx5QkFBeUI7WUFDL0IsUUFBUSxFQUFFLDJGQUEyRjtTQUN4RyxDQUFBO0lBQ0wsQ0FBQztDQUNKLENBQUMsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImNvbnN0IGFwcCA9IGdldEFwcDxhbnk+KCApO1xuaW1wb3J0IHsgaHR0cCB9IGZyb20gJy4uLy4uL3V0aWwvaHR0cCc7XG5pbXBvcnQgeyBuYXZUbyB9IGZyb20gJy4uLy4uL3V0aWwvcm91dGUuanMnO1xuXG5QYWdlKHtcblxuICAgIC8qKlxuICAgICAqIOmhtemdoueahOWIneWni+aVsOaNrlxuICAgICAqICEg5YiX6KGo5bGV56S657u05bqm77ya5ZCN56ew44CB6ZSA5ZSu6aKd44CB6K6i5Y2V5pWw44CB54q25oCB44CB5byA5aeL5pe26Ze0XG4gICAgICovXG4gICAgZGF0YToge1xuICAgICAgICAvLyDlvZPliY3pobXnoIFcbiAgICAgICAgcGFnZTogMCxcbiAgICAgICAgLy8g5oC76aG15pWwXG4gICAgICAgIHRvdGFsUGFnZTogMSxcbiAgICAgICAgLy8g5pCc57SiXG4gICAgICAgIHNlYXJjaDogJycsXG4gICAgICAgIC8vIOWVhuWTgeWIl+ihqFxuICAgICAgICBsaXN0OiBbIF0sXG4gICAgICAgIC8vIOWKoOi9veWIl+ihqGluZ1xuICAgICAgICBsb2FkaW5nTGlzdDogZmFsc2UsXG4gICAgICAgIC8vIOiDveWQpue7p+e7reWKoOi9vVxuICAgICAgICBjYW5Mb2FkTW9yZTogdHJ1ZSxcbiAgICAgICAgLy8g5LiK5qyh5pCc57Si55qE5paH5pysXG4gICAgICAgIGxhc3RTZWFyY2g6ICcnLFxuICAgICAgICAvLyDmmK/lkKblt7Lnu4/msqHmnInkuIvkuIDkuKrlj6/nlKjooYznqItcbiAgICAgICAgaXNOb3RBdmFpbGFibGVUcmlwOiBmYWxzZSxcbiAgICAgICAgLy8g6IOM5pmv5qC35byPXG4gICAgICAgIGJnczogW1xuICAgICAgICAgICAgJ2JhY2tncm91bmQtaW1hZ2U6IGxpbmVhci1ncmFkaWVudCgxMjBkZWcsICM4NGZhYjAgMCUsICM4ZmQzZjQgMTAwJSk7JyxcbiAgICAgICAgICAgICdiYWNrZ3JvdW5kLWltYWdlOiBsaW5lYXItZ3JhZGllbnQoNDVkZWcsICNmZjlhOWUgMCUsICNmYWQwYzQgOTklLCAjZmFkMGM0IDEwMCUpOycsXG4gICAgICAgICAgICAnYmFja2dyb3VuZC1pbWFnZTogbGluZWFyLWdyYWRpZW50KDEyMGRlZywgIzg5ZjdmZSAwJSwgIzY2YTZmZiAxMDAlKTsnLFxuICAgICAgICAgICAgJ2JhY2tncm91bmQtaW1hZ2U6IGxpbmVhci1ncmFkaWVudCh0byB0b3AsICMzN2VjYmEgMCUsICM3MmFmZDMgMTAwJSk7JyxcbiAgICAgICAgICAgICdiYWNrZ3JvdW5kLWltYWdlOiBsaW5lYXItZ3JhZGllbnQoLTQ1ZGVnLCAjRkZDNzk2IDAlLCAjRkY2Qjk1IDEwMCUpOycsXG4gICAgICAgICAgICAnYmFja2dyb3VuZC1pbWFnZTogbGluZWFyLWdyYWRpZW50KC0yMjVkZWcsICMyMEUyRDcgMCUsICNGOUZFQTUgMTAwJSk7JyxcbiAgICAgICAgICAgICdiYWNrZ3JvdW5kLWltYWdlOiBsaW5lYXItZ3JhZGllbnQoLTIyNWRlZywgIzlFRkJEMyAwJSwgIzU3RTlGMiA0OCUsICM0NUQ0RkIgMTAwJSk7JyxcbiAgICAgICAgXSxcbiAgICAgICAgYmcyczogW1xuICAgICAgICAgICAgJ2h0dHBzOi8vZ2xvYmFsLTEyNTc3NjQ1NjcuY29zLmFwLWd1YW5nemhvdS5teXFjbG91ZC5jb20vaWNvbi1iZy10cmlwLW1hbmFnZXItbGlzdC1jb2xvcmZ1bC5wbmcnLFxuICAgICAgICAgICAgJ2h0dHBzOi8vZ2xvYmFsLTEyNTc3NjQ1NjcuY29zLmFwLWd1YW5nemhvdS5teXFjbG91ZC5jb20vaWNvbi1iZzItdHJpcC1tYW5hZ2VyLWxpc3QtY29sb3JmdWwucG5nJ1xuICAgICAgICBdLFxuICAgICAgICAvLyDlsZXnpLrliJvlu7rmiJDlip/mj5DnpLpcbiAgICAgICAgc2hvd1N1Y2Nlc3M6IGZhbHNlXG4gICAgfSxcblxuICAgIC8qKiDot7PpobUgKi9cbiAgICBuYXZpZ2F0ZSggZSApIHtcbiAgICAgICAgbmF2VG8oJy9wYWdlcy9tYW5hZ2VyLXRyaXAtZGV0YWlsL2luZGV4Jyk7XG4gICAgfSxcblxuICAgIC8qKiDovpPlhaXmoYbnoa7orqQgKi9cbiAgICBvbkNvbmZvcm1TZWFyY2goeyBkZXRhaWwgfSkge1xuICAgICAgICB0aGlzLnNldERhdGEhKHtcbiAgICAgICAgICAgIHBhZ2U6IDAsXG4gICAgICAgICAgICB0b3RhbFBhZ2U6IDAsXG4gICAgICAgICAgICBzZWFyY2g6IGRldGFpbCxcbiAgICAgICAgICAgIGNhbkxvYWRNb3JlOiB0cnVlXG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLmZldGNoRGF0YSggKTtcbiAgICB9LFxuXG4gICAgLyoqIOaLieWPluWIl+ihqCAqL1xuICAgIGZldGNoRGF0YSggKSB7XG5cbiAgICAgICAgY29uc3QgeyBjYW5Mb2FkTW9yZSwgbG9hZGluZ0xpc3QsIGxhc3RTZWFyY2gsIHNlYXJjaCB9ID0gdGhpcy5kYXRhO1xuXG4gICAgICAgIGlmICggbG9hZGluZ0xpc3QgfHwgIWNhbkxvYWRNb3JlICkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCBzZWFyY2gucmVwbGFjZSgvXFxzKy9nLCBcIlwiKSAhPT0gbGFzdFNlYXJjaCApIHtcbiAgICAgICAgICAgIHRoaXMuc2V0RGF0YSEoe1xuICAgICAgICAgICAgICAgIHBhZ2U6IDAsXG4gICAgICAgICAgICAgICAgdG90YWxQYWdlOiAxXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuc2V0RGF0YSEoe1xuICAgICAgICAgICAgbG9hZGluZ0xpc3Q6IHRydWVcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaHR0cCh7XG4gICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgcGFnZTogdGhpcy5kYXRhLnBhZ2UgKyAxLFxuICAgICAgICAgICAgICAgIHRpdGxlOiB0aGlzLmRhdGEuc2VhcmNoXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgZXJyTXNnOiAn5Yqg6L295aSx6LSl77yM6K+36YeN6K+VJyxcbiAgICAgICAgICAgIGxvYWRpbmdNc2c6ICfliqDovb3kuK0uLi4nLFxuICAgICAgICAgICAgdXJsOiBgdHJpcF9saXN0YCxcbiAgICAgICAgICAgIHN1Y2Nlc3M6IHJlcyA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3QgeyBzdGF0dXMsIGRhdGEgfSA9IHJlcztcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICBpZiAoIHN0YXR1cyA9PT0gMjAwICkge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCB7IHBhZ2UsIHRvdGFsUGFnZSwgc2VhcmNoIH0gPSBkYXRhO1xuICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zZXREYXRhISh7XG4gICAgICAgICAgICAgICAgICAgICAgICBwYWdlLFxuICAgICAgICAgICAgICAgICAgICAgICAgdG90YWxQYWdlLFxuICAgICAgICAgICAgICAgICAgICAgICAgbGFzdFNlYXJjaDogc2VhcmNoIHx8ICcnLFxuICAgICAgICAgICAgICAgICAgICAgICAgY2FuTG9hZE1vcmU6IHRvdGFsUGFnZSA+IHBhZ2UsXG4gICAgICAgICAgICAgICAgICAgICAgICBpc05vdEF2YWlsYWJsZVRyaXA6ICFkYXRhLmRhdGEuc29tZSggeCA9PiB4LnB1Ymxpc2hlZCA9PT0gdHJ1ZSAmJiBuZXcgRGF0ZSggKS5nZXRUaW1lKCApIDwgeC5zdGFydF9kYXRlIClcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICBpZiAoIGRhdGEuZGF0YSAmJiBkYXRhLmRhdGEubGVuZ3RoID4gMCApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IG1ldGEgPSBwYWdlID09PSAxID9cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5kZWFsTGlzdFRleHQoIGRhdGEuZGF0YSApOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFsgLi4udGhpcy5kYXRhLmxpc3QsIC4uLnRoaXMuZGVhbExpc3RUZXh0KCBkYXRhLmRhdGEgKV07XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc2V0RGF0YSEoe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxpc3Q6IG1ldGFcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zZXREYXRhISh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGlzdDogWyBdXG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICB0aGlzLnNldERhdGEhKHtcbiAgICAgICAgICAgICAgICAgICAgbG9hZGluZ0xpc3Q6IGZhbHNlXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH0sXG5cbiAgICAvKiog57yW6L6R6KGM56iL5YiX6KGo5paH5a2XICovXG4gICAgZGVhbExpc3RUZXh0KCBsaXN0ICkge1xuXG4gICAgICAgIGNvbnN0IHsgYmcycyB9ID0gdGhpcy5kYXRhXG5cbiAgICAgICAgY29uc3Qgc2ltcGxlVGltZSA9ICh0czogbnVtYmVyKSA9PiB7XG4gICAgICAgICAgICBjb25zdCB0aW1lID0gbmV3IERhdGUoIE51bWJlciggdHMgKSk7XG4gICAgICAgICAgICByZXR1cm4gYCR7dGltZS5nZXRNb250aCggKSsxfeaciCR7dGltZS5nZXREYXRlKCApfeaXpWBcbiAgICAgICAgfTtcblxuICAgICAgICBjb25zdCBzaW1wbGVUaW1lMiA9ICh0czogbnVtYmVyKSA9PiB7XG4gICAgICAgICAgICBjb25zdCB0aW1lID0gbmV3IERhdGUoIE51bWJlciggdHMgKSk7XG4gICAgICAgICAgICByZXR1cm4gYCR7dGltZS5nZXRNb250aCggKSsxfS4ke3RpbWUuZ2V0RGF0ZSggKX1gXG4gICAgICAgIH07XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqICEg5rOo5oSP77yM5pe26Ze05a+55q+U44CC5byA5aeL5pe26Ze05pivIOaMh+WumuaXpeacn+eahOaXqeS4ijjngrnvvJvnu5PmnZ/ml6XmnJ/mmK8g5oyH5a6a5pel5pyf55qE5pma5LiKMjQ6MDBcbiAgICAgICAgICovXG4gICAgICAgIGNvbnN0IG1ldGEgPSBsaXN0Lm1hcCgoIHgsIGsgKSA9PiB7XG4gICAgICAgICAgICBjb25zdCB7IF9pZCwgdHlwZSwgc2VsZWN0ZWRQcm9kdWN0SWRzLCB0aXRsZSwgc2FsZXNfdm9sdW1lLCBzdGFydF9kYXRlLCBwdWJsaXNoZWQsIGVuZF9kYXRlLCBvcmRlcnMsIGlzQ2xvc2VkLCBjbGllbnRzLCBub3RQYXlBbGxDbGllbnRzIH0gPSB4O1xuXG4gICAgICAgICAgICBjb25zdCBzdGF0ZSQgPSAhcHVibGlzaGVkID9cbiAgICAgICAgICAgICAgICAn5pyq5Y+R5biDJyA6XG4gICAgICAgICAgICAgICAgaXNDbG9zZWQgP1xuICAgICAgICAgICAgICAgICAgICAn5bey57uT5p2fJyA6XG4gICAgICAgICAgICAgICAgICAgIG5ldyBEYXRlKCApLmdldFRpbWUoICkgPj0gZW5kX2RhdGUgP1xuICAgICAgICAgICAgICAgICAgICAgICAgJ+W3sue7k+adnycgOlxuICAgICAgICAgICAgICAgICAgICAgICAgbmV3IERhdGUoICkuZ2V0VGltZSggKSA+PSBzdGFydF9kYXRlID9cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAn6L+b6KGM5LitJyA6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJ+WNs+WwhuW8gOWniyc7XG5cbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgX2lkLFxuICAgICAgICAgICAgICAgIHRpZDogX2lkLFxuICAgICAgICAgICAgICAgIHRpdGxlLFxuICAgICAgICAgICAgICAgIG9yZGVycyxcbiAgICAgICAgICAgICAgICBiZzogayAlIDcsXG4gICAgICAgICAgICAgICAgaW1nQmc6IGsgJSAyID8gYmcyc1sgMSBdIDogYmcyc1sgMCBdLFxuICAgICAgICAgICAgICAgIHNhbGVzX3ZvbHVtZSxcbiAgICAgICAgICAgICAgICBzdGF0ZSQsXG4gICAgICAgICAgICAgICAgaXNDbG9zZWQsXG4gICAgICAgICAgICAgICAgY2xpZW50cyxcbiAgICAgICAgICAgICAgICBub3RQYXlBbGxDbGllbnRzLFxuICAgICAgICAgICAgICAgIGluZzogc3RhdGUkID09PSAn6L+b6KGM5LitJyxcbiAgICAgICAgICAgICAgICBlbmREYXRlOiBzaW1wbGVUaW1lKCBlbmRfZGF0ZSApLFxuICAgICAgICAgICAgICAgIHN0YXJ0RGF0ZTogc2ltcGxlVGltZSggc3RhcnRfZGF0ZSApLFxuICAgICAgICAgICAgICAgIGVuZERhdGUyOiBzaW1wbGVUaW1lMiggZW5kX2RhdGUgKSxcbiAgICAgICAgICAgICAgICBzdGFydERhdGUyOiBzaW1wbGVUaW1lMiggc3RhcnRfZGF0ZSApLFxuICAgICAgICAgICAgICAgIGhhc1Byb2R1Y3RJZHM6IHNlbGVjdGVkUHJvZHVjdElkcy5sZW5ndGggPiAwLFxuICAgICAgICAgICAgICAgIHJlZDogc3RhdGUkID09PSAn5pyq5Y+R5biDJyB8fCBzdGF0ZSQgPT09ICfov5vooYzkuK0nIHx8IHN0YXRlJCA9PT0gJ+WNs+WwhuW8gOWniycsXG4gICAgICAgICAgICAgICAgbGFiZWw6IHR5cGUgPT09ICdzeXMnICYmIHN0YXRlJCA9PT0gJ+i/m+ihjOS4rScgPyAn6Ieq5Yqo5Yib5bu6JyA6ICcnXG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gbWV0YTtcbiAgICB9LFxuXG4gICAgLyoqIOaQnOe0oui+k+WFpSAqL1xuICAgIG9uSW5wdXQoeyBkZXRhaWwgfSkge1xuICAgICAgICB0aGlzLnNldERhdGEhKHtcbiAgICAgICAgICAgIHNlYXJjaDogZGV0YWlsLnZhbHVlLFxuICAgICAgICAgICAgY2FuTG9hZE1vcmU6IGRldGFpbC52YWx1ZS5yZXBsYWNlKC9cXHMrL2csIFwiXCIpICE9PSB0aGlzLmRhdGEubGFzdFNlYXJjaFxuICAgICAgICB9KTtcbiAgICB9LFxuXG4gICAgLyoqIOeCueWHu+ivpuaDhSAqL1xuICAgIG9uVGFiKHsgY3VycmVudFRhcmdldCwgZGV0YWlsIH0pIHtcbiAgICAgICAgY29uc3QgeyB0aWQgfSA9IGN1cnJlbnRUYXJnZXQuZGF0YXNldDtcbiAgICAgICAgaWYgKCAhdGlkICkgeyByZXR1cm47IH1cbiAgICAgICAgdGhpcy5vblN1YnNjcmliZSggKTtcbiAgICAgICAgbmF2VG8oYC9wYWdlcy9tYW5hZ2VyLXRyaXAtZGV0YWlsL2luZGV4P2lkPSR7dGlkfWApO1xuICAgIH0sXG5cbiAgICAvKiog6Lez6K6i5Y2V5YiX6KGoICovXG4gICAgZ29PcmRlcih7IGN1cnJlbnRUYXJnZXQsIGRldGFpbCB9KSB7XG4gICAgICAgIHRoaXMub25TdWJzY3JpYmUoICk7XG4gICAgICAgIGNvbnN0IHsgdGlkIH0gPSBjdXJyZW50VGFyZ2V0LmRhdGFzZXQ7XG4gICAgICAgIHJldHVybiBodHRwKHtcbiAgICAgICAgICAgIHVybDogJ3RyaXBfY2xvc2UtdHJpcC1hbmFseXplJyxcbiAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICB0aWRcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSlcbiAgICAgICAgbmF2VG8oYC9wYWdlcy9tYW5hZ2VyLXRyaXAtb3JkZXIvaW5kZXg/aWQ9JHt0aWR9YCk7XG4gICAgfSxcblxuICAgIG9uU3Vic2NyaWJlKCApIHtcbiAgICAgICAgYXBwLmdldFN1YnNjcmliZSgnbmV3T3JkZXIsdHJpcCx3YWl0UGluJyk7XG4gICAgfSxcbiAgXG4gICAgLyoqXG4gICAgICogcXVlcnkge1xuICAgICAqICAgczogMS8wIOWIm+W7uuaIkOWKn++8jOacieW8ueahhlxuICAgICAqIH1cbiAgICAgKi9cbiAgICBvbkxvYWQ6IGZ1bmN0aW9uICggcXVlcnk6IGFueSApIHtcbiAgICAgICAgd3guaGlkZVNoYXJlTWVudSh7IH0pO1xuICAgICAgICB0aGlzLnNldERhdGEhKHtcbiAgICAgICAgICAgIHNob3dTdWNjZXNzOiBTdHJpbmcoIHF1ZXJ5LnMgKSA9PT0gJzEnXG4gICAgICAgIH0pXG4gICAgfSxcbiAgXG4gICAgLyoqXG4gICAgICog55Sf5ZG95ZGo5pyf5Ye95pWwLS3nm5HlkKzpobXpnaLliJ3mrKHmuLLmn5PlrozmiJBcbiAgICAgKi9cbiAgICBvblJlYWR5OiBmdW5jdGlvbiAoICkge1xuICBcbiAgICB9LFxuICBcbiAgICAvKipcbiAgICAgKiDnlJ/lkb3lkajmnJ/lh73mlbAtLeebkeWQrOmhtemdouaYvuekulxuICAgICAqL1xuICAgIG9uU2hvdzogZnVuY3Rpb24gKCApIHtcbiAgICAgICAgdGhpcy5zZXREYXRhISh7XG4gICAgICAgICAgICBwYWdlOiAwLFxuICAgICAgICAgICAgY2FuTG9hZE1vcmU6IHRydWVcbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMuZmV0Y2hEYXRhKCApO1xuICAgIH0sXG4gIFxuICAgIC8qKlxuICAgICAqIOeUn+WRveWRqOacn+WHveaVsC0t55uR5ZCs6aG16Z2i6ZqQ6JePXG4gICAgICovXG4gICAgb25IaWRlOiBmdW5jdGlvbiAoICkge1xuICBcbiAgICB9LFxuICBcbiAgICAvKipcbiAgICAgKiDnlJ/lkb3lkajmnJ/lh73mlbAtLeebkeWQrOmhtemdouWNuOi9vVxuICAgICAqL1xuICAgIG9uVW5sb2FkOiBmdW5jdGlvbiAoICkge1xuICBcbiAgICB9LFxuICBcbiAgICAvKipcbiAgICAgKiDpobXpnaLnm7jlhbPkuovku7blpITnkIblh73mlbAtLeebkeWQrOeUqOaIt+S4i+aLieWKqOS9nFxuICAgICAqL1xuICAgIG9uUHVsbERvd25SZWZyZXNoOiBmdW5jdGlvbiAoICkge1xuICBcbiAgICB9LFxuICBcbiAgICAvKipcbiAgICAgKiDpobXpnaLkuIrmi4nop6blupXkuovku7bnmoTlpITnkIblh73mlbBcbiAgICAgKi9cbiAgICBvblJlYWNoQm90dG9tOiBmdW5jdGlvbiAoICkge1xuICBcbiAgICB9LFxuICBcbiAgICAvKipcbiAgICAgKiDnlKjmiLfngrnlh7vlj7PkuIrop5LliIbkuqtcbiAgICAgKi9cbiAgICBvblNoYXJlQXBwTWVzc2FnZTogZnVuY3Rpb24gKCApIHtcbiAgICAgICAgdGhpcy5zZXREYXRhISh7XG4gICAgICAgICAgICBzaG93U3VjY2VzczogZmFsc2VcbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICB0aXRsZTogJ+i2heWAvOe+pOaLvOWbou+9nui/m+adpeeci+eci+WQpycsXG4gICAgICAgICAgICBwYXRoOiAnL3BhZ2VzL2dyb3VuZC1waW4vaW5kZXgnLFxuICAgICAgICAgICAgaW1hZ2VVcmw6ICdodHRwczovL2dsb2JhbC0xMjU3NzY0NTY3LmNvcy5hcC1ndWFuZ3pob3UubXlxY2xvdWQuY29tL2JnLXRyaXAtcmV3YXJkLXNoYXJlLWNvbG9yZnVsLmpwZydcbiAgICAgICAgfVxuICAgIH1cbn0pIl19