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
        var _b = currentTarget.dataset.data, tid = _b.tid, isClosed = _b.isClosed;
        route_js_1.navTo("/pages/manager-trip-order/index?id=" + tid + "&ac=" + (isClosed ? 1 : 0));
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
            imageUrl: 'https://global-1257764567.cos.ap-guangzhou.myqcloud.com/cover-trip-enter-1.png'
        };
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7QUFBQSxJQUFNLEdBQUcsR0FBRyxNQUFNLEVBQVEsQ0FBQztBQUMzQix3Q0FBdUM7QUFDdkMsZ0RBQTRDO0FBRTVDLElBQUksQ0FBQztJQU1ELElBQUksRUFBRTtRQUVGLElBQUksRUFBRSxDQUFDO1FBRVAsU0FBUyxFQUFFLENBQUM7UUFFWixNQUFNLEVBQUUsRUFBRTtRQUVWLElBQUksRUFBRSxFQUFHO1FBRVQsV0FBVyxFQUFFLEtBQUs7UUFFbEIsV0FBVyxFQUFFLElBQUk7UUFFakIsVUFBVSxFQUFFLEVBQUU7UUFFZCxrQkFBa0IsRUFBRSxLQUFLO1FBRXpCLEdBQUcsRUFBRTtZQUNELHNFQUFzRTtZQUN0RSxrRkFBa0Y7WUFDbEYsc0VBQXNFO1lBQ3RFLHNFQUFzRTtZQUN0RSxzRUFBc0U7WUFDdEUsdUVBQXVFO1lBQ3ZFLG9GQUFvRjtTQUN2RjtRQUNELElBQUksRUFBRTtZQUNGLGdHQUFnRztZQUNoRyxpR0FBaUc7U0FDcEc7UUFFRCxXQUFXLEVBQUUsS0FBSztLQUNyQjtJQUdELFFBQVEsWUFBRSxDQUFDO1FBQ1AsZ0JBQUssQ0FBQyxrQ0FBa0MsQ0FBQyxDQUFDO0lBQzlDLENBQUM7SUFHRCxlQUFlLEVBQWYsVUFBZ0IsRUFBVTtZQUFSLGtCQUFNO1FBQ3BCLElBQUksQ0FBQyxPQUFRLENBQUM7WUFDVixJQUFJLEVBQUUsQ0FBQztZQUNQLFNBQVMsRUFBRSxDQUFDO1lBQ1osTUFBTSxFQUFFLE1BQU07WUFDZCxXQUFXLEVBQUUsSUFBSTtTQUNwQixDQUFDLENBQUM7UUFDSCxJQUFJLENBQUMsU0FBUyxFQUFHLENBQUM7SUFDdEIsQ0FBQztJQUdELFNBQVMsRUFBVDtRQUFBLGlCQTZEQztRQTNEUyxJQUFBLGNBQTRELEVBQTFELDRCQUFXLEVBQUUsNEJBQVcsRUFBRSwwQkFBVSxFQUFFLGtCQUFvQixDQUFD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c0MsR0FBRyxhQUFRLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUcsQ0FBQyxDQUFDO0lBQ2hGLENBQUM7SUFFRCxXQUFXO1FBQ1AsR0FBRyxDQUFDLFlBQVksQ0FBQyx1QkFBdUIsQ0FBQyxDQUFDO0lBQzlDLENBQUM7SUFPRCxNQUFNLEVBQUUsVUFBVyxLQUFVO1FBQ3pCLEVBQUUsQ0FBQyxhQUFhLENBQUMsRUFBRyxDQUFDLENBQUM7UUFDdEIsSUFBSSxDQUFDLE9BQVEsQ0FBQztZQUNWLFdBQVcsRUFBRSxNQUFNLENBQUUsS0FBSyxDQUFDLENBQUMsQ0FBRSxLQUFLLEdBQUc7U0FDekMsQ0FBQyxDQUFBO0lBQ04sQ0FBQztJQUtELE9BQU8sRUFBRTtJQUVULENBQUM7SUFLRCxNQUFNLEVBQUU7UUFDSixJQUFJLENBQUMsT0FBUSxDQUFDO1lBQ1YsSUFBSSxFQUFFLENBQUM7WUFDUCxXQUFXLEVBQUUsSUFBSTtTQUNwQixDQUFDLENBQUM7UUFDSCxJQUFJLENBQUMsU0FBUyxFQUFHLENBQUM7SUFDdEIsQ0FBQztJQUtELE1BQU0sRUFBRTtJQUVSLENBQUM7SUFLRCxRQUFRLEVBQUU7SUFFVixDQUFDO0lBS0QsaUJBQWlCLEVBQUU7SUFFbkIsQ0FBQztJQUtELGFBQWEsRUFBRTtJQUVmLENBQUM7SUFLRCxpQkFBaUIsRUFBRTtRQUNmLElBQUksQ0FBQyxPQUFRLENBQUM7WUFDVixXQUFXLEVBQUUsS0FBSztTQUNyQixDQUFDLENBQUM7UUFDSCxPQUFPO1lBQ0gsS0FBSyxFQUFFLGFBQWE7WUFDcEIsSUFBSSxFQUFFLHlCQUF5QjtZQUUvQixRQUFRLEVBQUUsZ0ZBQWdGO1NBQzdGLENBQUE7SUFDTCxDQUFDO0NBQ0osQ0FBQyxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiY29uc3QgYXBwID0gZ2V0QXBwPGFueT4oICk7XG5pbXBvcnQgeyBodHRwIH0gZnJvbSAnLi4vLi4vdXRpbC9odHRwJztcbmltcG9ydCB7IG5hdlRvIH0gZnJvbSAnLi4vLi4vdXRpbC9yb3V0ZS5qcyc7XG5cblBhZ2Uoe1xuXG4gICAgLyoqXG4gICAgICog6aG16Z2i55qE5Yid5aeL5pWw5o2uXG4gICAgICogISDliJfooajlsZXnpLrnu7TluqbvvJrlkI3np7DjgIHplIDllK7pop3jgIHorqLljZXmlbDjgIHnirbmgIHjgIHlvIDlp4vml7bpl7RcbiAgICAgKi9cbiAgICBkYXRhOiB7XG4gICAgICAgIC8vIOW9k+WJjemhteeggVxuICAgICAgICBwYWdlOiAwLFxuICAgICAgICAvLyDmgLvpobXmlbBcbiAgICAgICAgdG90YWxQYWdlOiAxLFxuICAgICAgICAvLyDmkJzntKJcbiAgICAgICAgc2VhcmNoOiAnJyxcbiAgICAgICAgLy8g5ZWG5ZOB5YiX6KGoXG4gICAgICAgIGxpc3Q6IFsgXSxcbiAgICAgICAgLy8g5Yqg6L295YiX6KGoaW5nXG4gICAgICAgIGxvYWRpbmdMaXN0OiBmYWxzZSxcbiAgICAgICAgLy8g6IO95ZCm57un57ut5Yqg6L29XG4gICAgICAgIGNhbkxvYWRNb3JlOiB0cnVlLFxuICAgICAgICAvLyDkuIrmrKHmkJzntKLnmoTmlofmnKxcbiAgICAgICAgbGFzdFNlYXJjaDogJycsXG4gICAgICAgIC8vIOaYr+WQpuW3sue7j+ayoeacieS4i+S4gOS4quWPr+eUqOihjOeoi1xuICAgICAgICBpc05vdEF2YWlsYWJsZVRyaXA6IGZhbHNlLFxuICAgICAgICAvLyDog4zmma/moLflvI9cbiAgICAgICAgYmdzOiBbXG4gICAgICAgICAgICAnYmFja2dyb3VuZC1pbWFnZTogbGluZWFyLWdyYWRpZW50KDEyMGRlZywgIzg0ZmFiMCAwJSwgIzhmZDNmNCAxMDAlKTsnLFxuICAgICAgICAgICAgJ2JhY2tncm91bmQtaW1hZ2U6IGxpbmVhci1ncmFkaWVudCg0NWRlZywgI2ZmOWE5ZSAwJSwgI2ZhZDBjNCA5OSUsICNmYWQwYzQgMTAwJSk7JyxcbiAgICAgICAgICAgICdiYWNrZ3JvdW5kLWltYWdlOiBsaW5lYXItZ3JhZGllbnQoMTIwZGVnLCAjODlmN2ZlIDAlLCAjNjZhNmZmIDEwMCUpOycsXG4gICAgICAgICAgICAnYmFja2dyb3VuZC1pbWFnZTogbGluZWFyLWdyYWRpZW50KHRvIHRvcCwgIzM3ZWNiYSAwJSwgIzcyYWZkMyAxMDAlKTsnLFxuICAgICAgICAgICAgJ2JhY2tncm91bmQtaW1hZ2U6IGxpbmVhci1ncmFkaWVudCgtNDVkZWcsICNGRkM3OTYgMCUsICNGRjZCOTUgMTAwJSk7JyxcbiAgICAgICAgICAgICdiYWNrZ3JvdW5kLWltYWdlOiBsaW5lYXItZ3JhZGllbnQoLTIyNWRlZywgIzIwRTJENyAwJSwgI0Y5RkVBNSAxMDAlKTsnLFxuICAgICAgICAgICAgJ2JhY2tncm91bmQtaW1hZ2U6IGxpbmVhci1ncmFkaWVudCgtMjI1ZGVnLCAjOUVGQkQzIDAlLCAjNTdFOUYyIDQ4JSwgIzQ1RDRGQiAxMDAlKTsnLFxuICAgICAgICBdLFxuICAgICAgICBiZzJzOiBbXG4gICAgICAgICAgICAnaHR0cHM6Ly9nbG9iYWwtMTI1Nzc2NDU2Ny5jb3MuYXAtZ3Vhbmd6aG91Lm15cWNsb3VkLmNvbS9pY29uLWJnLXRyaXAtbWFuYWdlci1saXN0LWNvbG9yZnVsLnBuZycsXG4gICAgICAgICAgICAnaHR0cHM6Ly9nbG9iYWwtMTI1Nzc2NDU2Ny5jb3MuYXAtZ3Vhbmd6aG91Lm15cWNsb3VkLmNvbS9pY29uLWJnMi10cmlwLW1hbmFnZXItbGlzdC1jb2xvcmZ1bC5wbmcnXG4gICAgICAgIF0sXG4gICAgICAgIC8vIOWxleekuuWIm+W7uuaIkOWKn+aPkOekulxuICAgICAgICBzaG93U3VjY2VzczogZmFsc2VcbiAgICB9LFxuXG4gICAgLyoqIOi3s+mhtSAqL1xuICAgIG5hdmlnYXRlKCBlICkge1xuICAgICAgICBuYXZUbygnL3BhZ2VzL21hbmFnZXItdHJpcC1kZXRhaWwvaW5kZXgnKTtcbiAgICB9LFxuXG4gICAgLyoqIOi+k+WFpeahhuehruiupCAqL1xuICAgIG9uQ29uZm9ybVNlYXJjaCh7IGRldGFpbCB9KSB7XG4gICAgICAgIHRoaXMuc2V0RGF0YSEoe1xuICAgICAgICAgICAgcGFnZTogMCxcbiAgICAgICAgICAgIHRvdGFsUGFnZTogMCxcbiAgICAgICAgICAgIHNlYXJjaDogZGV0YWlsLFxuICAgICAgICAgICAgY2FuTG9hZE1vcmU6IHRydWVcbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMuZmV0Y2hEYXRhKCApO1xuICAgIH0sXG5cbiAgICAvKiog5ouJ5Y+W5YiX6KGoICovXG4gICAgZmV0Y2hEYXRhKCApIHtcblxuICAgICAgICBjb25zdCB7IGNhbkxvYWRNb3JlLCBsb2FkaW5nTGlzdCwgbGFzdFNlYXJjaCwgc2VhcmNoIH0gPSB0aGlzLmRhdGE7XG5cbiAgICAgICAgaWYgKCBsb2FkaW5nTGlzdCB8fCAhY2FuTG9hZE1vcmUgKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIHNlYXJjaC5yZXBsYWNlKC9cXHMrL2csIFwiXCIpICE9PSBsYXN0U2VhcmNoICkge1xuICAgICAgICAgICAgdGhpcy5zZXREYXRhISh7XG4gICAgICAgICAgICAgICAgcGFnZTogMCxcbiAgICAgICAgICAgICAgICB0b3RhbFBhZ2U6IDFcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5zZXREYXRhISh7XG4gICAgICAgICAgICBsb2FkaW5nTGlzdDogdHJ1ZVxuICAgICAgICB9KTtcblxuICAgICAgICBodHRwKHtcbiAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICBwYWdlOiB0aGlzLmRhdGEucGFnZSArIDEsXG4gICAgICAgICAgICAgICAgdGl0bGU6IHRoaXMuZGF0YS5zZWFyY2hcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBlcnJNc2c6ICfliqDovb3lpLHotKXvvIzor7fph43or5UnLFxuICAgICAgICAgICAgbG9hZGluZ01zZzogJ+WKoOi9veS4rS4uLicsXG4gICAgICAgICAgICB1cmw6IGB0cmlwX2xpc3RgLFxuICAgICAgICAgICAgc3VjY2VzczogcmVzID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCB7IHN0YXR1cywgZGF0YSB9ID0gcmVzO1xuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIGlmICggc3RhdHVzID09PSAyMDAgKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHsgcGFnZSwgdG90YWxQYWdlLCBzZWFyY2ggfSA9IGRhdGE7XG4gICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICB0aGlzLnNldERhdGEhKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHBhZ2UsXG4gICAgICAgICAgICAgICAgICAgICAgICB0b3RhbFBhZ2UsXG4gICAgICAgICAgICAgICAgICAgICAgICBsYXN0U2VhcmNoOiBzZWFyY2ggfHwgJycsXG4gICAgICAgICAgICAgICAgICAgICAgICBjYW5Mb2FkTW9yZTogdG90YWxQYWdlID4gcGFnZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGlzTm90QXZhaWxhYmxlVHJpcDogIWRhdGEuZGF0YS5zb21lKCB4ID0+IHgucHVibGlzaGVkID09PSB0cnVlICYmIG5ldyBEYXRlKCApLmdldFRpbWUoICkgPCB4LnN0YXJ0X2RhdGUgKVxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgIGlmICggZGF0YS5kYXRhICYmIGRhdGEuZGF0YS5sZW5ndGggPiAwICkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgbWV0YSA9IHBhZ2UgPT09IDEgP1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmRlYWxMaXN0VGV4dCggZGF0YS5kYXRhICk6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgWyAuLi50aGlzLmRhdGEubGlzdCwgLi4udGhpcy5kZWFsTGlzdFRleHQoIGRhdGEuZGF0YSApXTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zZXREYXRhISh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGlzdDogbWV0YVxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnNldERhdGEhKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsaXN0OiBbIF1cbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIHRoaXMuc2V0RGF0YSEoe1xuICAgICAgICAgICAgICAgICAgICBsb2FkaW5nTGlzdDogZmFsc2VcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfSxcblxuICAgIC8qKiDnvJbovpHooYznqIvliJfooajmloflrZcgKi9cbiAgICBkZWFsTGlzdFRleHQoIGxpc3QgKSB7XG5cbiAgICAgICAgY29uc3QgeyBiZzJzIH0gPSB0aGlzLmRhdGFcblxuICAgICAgICBjb25zdCBzaW1wbGVUaW1lID0gKHRzOiBudW1iZXIpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IHRpbWUgPSBuZXcgRGF0ZSggTnVtYmVyKCB0cyApKTtcbiAgICAgICAgICAgIHJldHVybiBgJHt0aW1lLmdldE1vbnRoKCApKzF95pyIJHt0aW1lLmdldERhdGUoICl95pelYFxuICAgICAgICB9O1xuXG4gICAgICAgIGNvbnN0IHNpbXBsZVRpbWUyID0gKHRzOiBudW1iZXIpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IHRpbWUgPSBuZXcgRGF0ZSggTnVtYmVyKCB0cyApKTtcbiAgICAgICAgICAgIHJldHVybiBgJHt0aW1lLmdldE1vbnRoKCApKzF9LiR7dGltZS5nZXREYXRlKCApfWBcbiAgICAgICAgfTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogISDms6jmhI/vvIzml7bpl7Tlr7nmr5TjgILlvIDlp4vml7bpl7TmmK8g5oyH5a6a5pel5pyf55qE5pep5LiKOOeCue+8m+e7k+adn+aXpeacn+aYryDmjIflrprml6XmnJ/nmoTmmZrkuIoyNDowMFxuICAgICAgICAgKi9cbiAgICAgICAgY29uc3QgbWV0YSA9IGxpc3QubWFwKCggeCwgayApID0+IHtcbiAgICAgICAgICAgIGNvbnN0IHsgX2lkLCB0eXBlLCBzZWxlY3RlZFByb2R1Y3RJZHMsIHRpdGxlLCBzYWxlc192b2x1bWUsIHN0YXJ0X2RhdGUsIHB1Ymxpc2hlZCwgZW5kX2RhdGUsIG9yZGVycywgaXNDbG9zZWQsIGNsaWVudHMsIG5vdFBheUFsbENsaWVudHMgfSA9IHg7XG5cbiAgICAgICAgICAgIGNvbnN0IHN0YXRlJCA9ICFwdWJsaXNoZWQgP1xuICAgICAgICAgICAgICAgICfmnKrlj5HluIMnIDpcbiAgICAgICAgICAgICAgICBpc0Nsb3NlZCA/XG4gICAgICAgICAgICAgICAgICAgICflt7Lnu5PmnZ8nIDpcbiAgICAgICAgICAgICAgICAgICAgbmV3IERhdGUoICkuZ2V0VGltZSggKSA+PSBlbmRfZGF0ZSA/XG4gICAgICAgICAgICAgICAgICAgICAgICAn5bey57uT5p2fJyA6XG4gICAgICAgICAgICAgICAgICAgICAgICBuZXcgRGF0ZSggKS5nZXRUaW1lKCApID49IHN0YXJ0X2RhdGUgP1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICfov5vooYzkuK0nIDpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAn5Y2z5bCG5byA5aeLJztcblxuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBfaWQsXG4gICAgICAgICAgICAgICAgdGlkOiBfaWQsXG4gICAgICAgICAgICAgICAgdGl0bGUsXG4gICAgICAgICAgICAgICAgb3JkZXJzLFxuICAgICAgICAgICAgICAgIGJnOiBrICUgNyxcbiAgICAgICAgICAgICAgICBpbWdCZzogayAlIDIgPyBiZzJzWyAxIF0gOiBiZzJzWyAwIF0sXG4gICAgICAgICAgICAgICAgc2FsZXNfdm9sdW1lLFxuICAgICAgICAgICAgICAgIHN0YXRlJCxcbiAgICAgICAgICAgICAgICBpc0Nsb3NlZCxcbiAgICAgICAgICAgICAgICBjbGllbnRzLFxuICAgICAgICAgICAgICAgIG5vdFBheUFsbENsaWVudHMsXG4gICAgICAgICAgICAgICAgaW5nOiBzdGF0ZSQgPT09ICfov5vooYzkuK0nLFxuICAgICAgICAgICAgICAgIGVuZERhdGU6IHNpbXBsZVRpbWUoIGVuZF9kYXRlICksXG4gICAgICAgICAgICAgICAgc3RhcnREYXRlOiBzaW1wbGVUaW1lKCBzdGFydF9kYXRlICksXG4gICAgICAgICAgICAgICAgZW5kRGF0ZTI6IHNpbXBsZVRpbWUyKCBlbmRfZGF0ZSApLFxuICAgICAgICAgICAgICAgIHN0YXJ0RGF0ZTI6IHNpbXBsZVRpbWUyKCBzdGFydF9kYXRlICksXG4gICAgICAgICAgICAgICAgaGFzUHJvZHVjdElkczogc2VsZWN0ZWRQcm9kdWN0SWRzLmxlbmd0aCA+IDAsXG4gICAgICAgICAgICAgICAgcmVkOiBzdGF0ZSQgPT09ICfmnKrlj5HluIMnIHx8IHN0YXRlJCA9PT0gJ+i/m+ihjOS4rScgfHwgc3RhdGUkID09PSAn5Y2z5bCG5byA5aeLJyxcbiAgICAgICAgICAgICAgICBsYWJlbDogdHlwZSA9PT0gJ3N5cycgJiYgc3RhdGUkID09PSAn6L+b6KGM5LitJyA/ICfoh6rliqjliJvlu7onIDogJydcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiBtZXRhO1xuICAgIH0sXG5cbiAgICAvKiog5pCc57Si6L6T5YWlICovXG4gICAgb25JbnB1dCh7IGRldGFpbCB9KSB7XG4gICAgICAgIHRoaXMuc2V0RGF0YSEoe1xuICAgICAgICAgICAgc2VhcmNoOiBkZXRhaWwudmFsdWUsXG4gICAgICAgICAgICBjYW5Mb2FkTW9yZTogZGV0YWlsLnZhbHVlLnJlcGxhY2UoL1xccysvZywgXCJcIikgIT09IHRoaXMuZGF0YS5sYXN0U2VhcmNoXG4gICAgICAgIH0pO1xuICAgIH0sXG5cbiAgICAvKiog54K55Ye76K+m5oOFICovXG4gICAgb25UYWIoeyBjdXJyZW50VGFyZ2V0LCBkZXRhaWwgfSkge1xuICAgICAgICBjb25zdCB7IHRpZCB9ID0gY3VycmVudFRhcmdldC5kYXRhc2V0O1xuICAgICAgICBpZiAoICF0aWQgKSB7IHJldHVybjsgfVxuICAgICAgICB0aGlzLm9uU3Vic2NyaWJlKCApO1xuICAgICAgICBuYXZUbyhgL3BhZ2VzL21hbmFnZXItdHJpcC1kZXRhaWwvaW5kZXg/aWQ9JHt0aWR9YCk7XG4gICAgfSxcblxuICAgIC8qKiDot7PorqLljZXliJfooaggKi9cbiAgICBnb09yZGVyKHsgY3VycmVudFRhcmdldCwgZGV0YWlsIH0pIHtcbiAgICAgICAgdGhpcy5vblN1YnNjcmliZSggKTtcbiAgICAgICAgY29uc3QgeyB0aWQsIGlzQ2xvc2VkIH0gPSBjdXJyZW50VGFyZ2V0LmRhdGFzZXQuZGF0YTtcblxuICAgICAgICBuYXZUbyhgL3BhZ2VzL21hbmFnZXItdHJpcC1vcmRlci9pbmRleD9pZD0ke3RpZH0mYWM9JHsgaXNDbG9zZWQgPyAxIDogMCB9YCk7XG4gICAgfSxcblxuICAgIG9uU3Vic2NyaWJlKCApIHtcbiAgICAgICAgYXBwLmdldFN1YnNjcmliZSgnbmV3T3JkZXIsdHJpcCx3YWl0UGluJyk7XG4gICAgfSxcbiAgXG4gICAgLyoqXG4gICAgICogcXVlcnkge1xuICAgICAqICAgczogMS8wIOWIm+W7uuaIkOWKn++8jOacieW8ueahhlxuICAgICAqIH1cbiAgICAgKi9cbiAgICBvbkxvYWQ6IGZ1bmN0aW9uICggcXVlcnk6IGFueSApIHtcbiAgICAgICAgd3guaGlkZVNoYXJlTWVudSh7IH0pO1xuICAgICAgICB0aGlzLnNldERhdGEhKHtcbiAgICAgICAgICAgIHNob3dTdWNjZXNzOiBTdHJpbmcoIHF1ZXJ5LnMgKSA9PT0gJzEnXG4gICAgICAgIH0pXG4gICAgfSxcbiAgXG4gICAgLyoqXG4gICAgICog55Sf5ZG95ZGo5pyf5Ye95pWwLS3nm5HlkKzpobXpnaLliJ3mrKHmuLLmn5PlrozmiJBcbiAgICAgKi9cbiAgICBvblJlYWR5OiBmdW5jdGlvbiAoICkge1xuICBcbiAgICB9LFxuICBcbiAgICAvKipcbiAgICAgKiDnlJ/lkb3lkajmnJ/lh73mlbAtLeebkeWQrOmhtemdouaYvuekulxuICAgICAqL1xuICAgIG9uU2hvdzogZnVuY3Rpb24gKCApIHtcbiAgICAgICAgdGhpcy5zZXREYXRhISh7XG4gICAgICAgICAgICBwYWdlOiAwLFxuICAgICAgICAgICAgY2FuTG9hZE1vcmU6IHRydWVcbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMuZmV0Y2hEYXRhKCApO1xuICAgIH0sXG4gIFxuICAgIC8qKlxuICAgICAqIOeUn+WRveWRqOacn+WHveaVsC0t55uR5ZCs6aG16Z2i6ZqQ6JePXG4gICAgICovXG4gICAgb25IaWRlOiBmdW5jdGlvbiAoICkge1xuICBcbiAgICB9LFxuICBcbiAgICAvKipcbiAgICAgKiDnlJ/lkb3lkajmnJ/lh73mlbAtLeebkeWQrOmhtemdouWNuOi9vVxuICAgICAqL1xuICAgIG9uVW5sb2FkOiBmdW5jdGlvbiAoICkge1xuICBcbiAgICB9LFxuICBcbiAgICAvKipcbiAgICAgKiDpobXpnaLnm7jlhbPkuovku7blpITnkIblh73mlbAtLeebkeWQrOeUqOaIt+S4i+aLieWKqOS9nFxuICAgICAqL1xuICAgIG9uUHVsbERvd25SZWZyZXNoOiBmdW5jdGlvbiAoICkge1xuICBcbiAgICB9LFxuICBcbiAgICAvKipcbiAgICAgKiDpobXpnaLkuIrmi4nop6blupXkuovku7bnmoTlpITnkIblh73mlbBcbiAgICAgKi9cbiAgICBvblJlYWNoQm90dG9tOiBmdW5jdGlvbiAoICkge1xuICBcbiAgICB9LFxuICBcbiAgICAvKipcbiAgICAgKiDnlKjmiLfngrnlh7vlj7PkuIrop5LliIbkuqtcbiAgICAgKi9cbiAgICBvblNoYXJlQXBwTWVzc2FnZTogZnVuY3Rpb24gKCApIHtcbiAgICAgICAgdGhpcy5zZXREYXRhISh7XG4gICAgICAgICAgICBzaG93U3VjY2VzczogZmFsc2VcbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICB0aXRsZTogJ+i2heWAvOe+pOaLvOWbou+9nui/m+adpeeci+eci+WQpycsXG4gICAgICAgICAgICBwYXRoOiAnL3BhZ2VzL2dyb3VuZC1waW4vaW5kZXgnLFxuICAgICAgICAgICAgLy8gaW1hZ2VVcmw6ICdodHRwczovL2dsb2JhbC0xMjU3NzY0NTY3LmNvcy5hcC1ndWFuZ3pob3UubXlxY2xvdWQuY29tL2JnLXRyaXAtcmV3YXJkLXNoYXJlLWNvbG9yZnVsLmpwZydcbiAgICAgICAgICAgIGltYWdlVXJsOiAnaHR0cHM6Ly9nbG9iYWwtMTI1Nzc2NDU2Ny5jb3MuYXAtZ3Vhbmd6aG91Lm15cWNsb3VkLmNvbS9jb3Zlci10cmlwLWVudGVyLTEucG5nJ1xuICAgICAgICB9XG4gICAgfVxufSkiXX0=