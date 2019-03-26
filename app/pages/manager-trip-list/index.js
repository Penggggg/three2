"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var http_1 = require("../../util/http");
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
        ]
    },
    navigate: function (e) {
        wx.navigateTo({
            url: '/pages/manager-trip-detail/index',
        });
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
        console.log('=====');
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
                            _this.dealListText(data.data) : _this.data.list.concat(_this.dealListText(data.data));
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
        var simpleTime = function (ts) {
            var time = new Date(Number(ts));
            return time.getMonth() + 1 + "\u6708" + time.getDate() + "\u65E5";
        };
        var simpleTime2 = function (ts) {
            var time = new Date(Number(ts));
            return time.getMonth() + 1 + "." + time.getDate();
        };
        var meta = list.map(function (x, k) {
            var _id = x._id, title = x.title, sales_volume = x.sales_volume, start_date = x.start_date, published = x.published, end_date = x.end_date, orders = x.orders, isClosed = x.isClosed;
            var state$ = !published ?
                '未发布' :
                isClosed ?
                    '已关闭' :
                    new Date().getTime() >= end_date ?
                        '已结束' :
                        new Date().getTime() >= start_date ?
                            '进行中' :
                            '即将开始';
            return {
                _id: _id,
                title: title,
                orders: orders,
                bg: k % 7,
                sales_volume: sales_volume,
                state: state$,
                ing: state$ === '进行中',
                endDate: simpleTime(end_date),
                startDate: simpleTime(start_date),
                endDate2: simpleTime2(end_date),
                startDate2: simpleTime2(start_date),
                red: state$ === '未发布' || state$ === '进行中' || state$ === '即将开始',
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
        var currentTarget = _a.currentTarget;
        var tid = currentTarget.dataset.tid;
        wx.navigateTo({
            url: "/pages/manager-trip-detail/index?id=" + tid
        });
    },
    onLoad: function () {
        wx.hideShareMenu({});
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
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUNBLHdDQUF1QztBQUd2QyxJQUFJLENBQUM7SUFNRCxJQUFJLEVBQUU7UUFFRixJQUFJLEVBQUUsQ0FBQztRQUVQLFNBQVMsRUFBRSxDQUFDO1FBRVosTUFBTSxFQUFFLEVBQUU7UUFFVixJQUFJLEVBQUUsRUFBRztRQUVULFdBQVcsRUFBRSxLQUFLO1FBRWxCLFdBQVcsRUFBRSxJQUFJO1FBRWpCLFVBQVUsRUFBRSxFQUFFO1FBRWQsa0JBQWtCLEVBQUUsS0FBSztRQUV6QixHQUFHLEVBQUU7WUFDRCxzRUFBc0U7WUFDdEUsa0ZBQWtGO1lBQ2xGLHNFQUFzRTtZQUN0RSxzRUFBc0U7WUFDdEUsc0VBQXNFO1lBQ3RFLHVFQUF1RTtZQUN2RSxvRkFBb0Y7U0FDdkY7S0FDSjtJQUdELFFBQVEsWUFBRSxDQUFDO1FBQ1AsRUFBRSxDQUFDLFVBQVUsQ0FBQztZQUNWLEdBQUcsRUFBRSxrQ0FBa0M7U0FDMUMsQ0FBQyxDQUFDO0lBQ1AsQ0FBQztJQUdELGVBQWUsWUFBQyxFQUFVO1lBQVIsa0JBQU07UUFDcEIsSUFBSSxDQUFDLE9BQVEsQ0FBQztZQUNWLElBQUksRUFBRSxDQUFDO1lBQ1AsU0FBUyxFQUFFLENBQUM7WUFDWixNQUFNLEVBQUUsTUFBTTtZQUNkLFdBQVcsRUFBRSxJQUFJO1NBQ3BCLENBQUMsQ0FBQztRQUNILElBQUksQ0FBQyxTQUFTLEVBQUcsQ0FBQztJQUN0QixDQUFDO0lBR0QsU0FBUztRQUFULGlCQTZEQztRQTNEUyxJQUFBLGNBQTRELEVBQTFELDRCQUFXLEVBQUUsNEJBQVcsRUFBRSwwQkFBVSxFQUFFLGtCQUFvQixDQUFDO1FBRW5FLElBQUssV0FBVyxJQUFJLENBQUMsV0FBVyxFQUFHO1lBQy9CLE9BQU87U0FDVjtRQUVELElBQUssTUFBTSxDQUFDLE9BQU8sQ0FBQyxNQUFNLEVBQUUsRUFBRSxDQUFDLEtB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WUFDcEIsV0FBVyxFQUFFLE1BQU0sQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLE1BQU0sRUFBRSxFQUFFLENBQUMsS0FBSyxJQUFJLENBQUMsSUFBSSxDQUFDLFVBQVU7U0FDekUsQ0FBQyxDQUFDO0lBQ1AsQ0FBQztJQUdELEtBQUssWUFBQyxFQUFpQjtZQUFmLGdDQUFhO1FBQ1QsSUFBQSwrQkFBRyxDQUEyQjtRQUN0QyxFQUFFLENBQUMsVUFBVSxDQUFDO1lBQ1YsR0FBRyxFQUFFLHlDQUF1QyxHQUFLO1NBQ3BELENBQUMsQ0FBQztJQUNQLENBQUM7SUFLRCxNQUFNLEVBQUU7UUFDSixFQUFFLENBQUMsYUFBYSxDQUFDLEVBQUcsQ0FBQyxDQUFDO0lBQzFCLENBQUM7SUFLRCxPQUFPLEVBQUU7SUFFVCxDQUFDO0lBS0QsTUFBTSxFQUFFO1FBQ0osSUFBSSxDQUFDLE9BQVEsQ0FBQztZQUNWLElBQUksRUFBRSxDQUFDO1lBQ1AsV0FBVyxFQUFFLElBQUk7U0FDcEIsQ0FBQyxDQUFDO1FBQ0gsSUFBSSxDQUFDLFNBQVMsRUFBRyxDQUFDO0lBQ3RCLENBQUM7SUFLRCxNQUFNLEVBQUU7SUFFUixDQUFDO0lBS0QsUUFBUSxFQUFFO0lBRVYsQ0FBQztJQUtELGlCQUFpQixFQUFFO0lBRW5CLENBQUM7SUFLRCxhQUFhLEVBQUU7SUFFZixDQUFDO0NBUUosQ0FBQyxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiXG5pbXBvcnQgeyBodHRwIH0gZnJvbSAnLi4vLi4vdXRpbC9odHRwJztcblxuLy8gYXBwL3BhZ2VzL21hbmFnZXItZ29vZHMtZGV0YWlsL2luZGV4LmpzXG5QYWdlKHtcblxuICAgIC8qKlxuICAgICAqIOmhtemdoueahOWIneWni+aVsOaNrlxuICAgICAqICEg5YiX6KGo5bGV56S657u05bqm77ya5ZCN56ew44CB6ZSA5ZSu6aKd44CB6K6i5Y2V5pWw44CB54q25oCB44CB5byA5aeL5pe26Ze0XG4gICAgICovXG4gICAgZGF0YToge1xuICAgICAgICAvLyDlvZPliY3pobXnoIFcbiAgICAgICAgcGFnZTogMCxcbiAgICAgICAgLy8g5oC76aG15pWwXG4gICAgICAgIHRvdGFsUGFnZTogMSxcbiAgICAgICAgLy8g5pCc57SiXG4gICAgICAgIHNlYXJjaDogJycsXG4gICAgICAgIC8vIOWVhuWTgeWIl+ihqFxuICAgICAgICBsaXN0OiBbIF0sXG4gICAgICAgIC8vIOWKoOi9veWIl+ihqGluZ1xuICAgICAgICBsb2FkaW5nTGlzdDogZmFsc2UsXG4gICAgICAgIC8vIOiDveWQpue7p+e7reWKoOi9vVxuICAgICAgICBjYW5Mb2FkTW9yZTogdHJ1ZSxcbiAgICAgICAgLy8g5LiK5qyh5pCc57Si55qE5paH5pysXG4gICAgICAgIGxhc3RTZWFyY2g6ICcnLFxuICAgICAgICAvLyDmmK/lkKblt7Lnu4/msqHmnInkuIvkuIDkuKrlj6/nlKjooYznqItcbiAgICAgICAgaXNOb3RBdmFpbGFibGVUcmlwOiBmYWxzZSxcbiAgICAgICAgLy8g6IOM5pmv5qC35byPXG4gICAgICAgIGJnczogW1xuICAgICAgICAgICAgJ2JhY2tncm91bmQtaW1hZ2U6IGxpbmVhci1ncmFkaWVudCgxMjBkZWcsICM4NGZhYjAgMCUsICM4ZmQzZjQgMTAwJSk7JyxcbiAgICAgICAgICAgICdiYWNrZ3JvdW5kLWltYWdlOiBsaW5lYXItZ3JhZGllbnQoNDVkZWcsICNmZjlhOWUgMCUsICNmYWQwYzQgOTklLCAjZmFkMGM0IDEwMCUpOycsXG4gICAgICAgICAgICAnYmFja2dyb3VuZC1pbWFnZTogbGluZWFyLWdyYWRpZW50KDEyMGRlZywgIzg5ZjdmZSAwJSwgIzY2YTZmZiAxMDAlKTsnLFxuICAgICAgICAgICAgJ2JhY2tncm91bmQtaW1hZ2U6IGxpbmVhci1ncmFkaWVudCh0byB0b3AsICMzN2VjYmEgMCUsICM3MmFmZDMgMTAwJSk7JyxcbiAgICAgICAgICAgICdiYWNrZ3JvdW5kLWltYWdlOiBsaW5lYXItZ3JhZGllbnQoLTQ1ZGVnLCAjRkZDNzk2IDAlLCAjRkY2Qjk1IDEwMCUpOycsXG4gICAgICAgICAgICAnYmFja2dyb3VuZC1pbWFnZTogbGluZWFyLWdyYWRpZW50KC0yMjVkZWcsICMyMEUyRDcgMCUsICNGOUZFQTUgMTAwJSk7JyxcbiAgICAgICAgICAgICdiYWNrZ3JvdW5kLWltYWdlOiBsaW5lYXItZ3JhZGllbnQoLTIyNWRlZywgIzlFRkJEMyAwJSwgIzU3RTlGMiA0OCUsICM0NUQ0RkIgMTAwJSk7JyxcbiAgICAgICAgXVxuICAgIH0sXG5cbiAgICAvKiog6Lez6aG1ICovXG4gICAgbmF2aWdhdGUoIGUgKSB7XG4gICAgICAgIHd4Lm5hdmlnYXRlVG8oe1xuICAgICAgICAgICAgdXJsOiAnL3BhZ2VzL21hbmFnZXItdHJpcC1kZXRhaWwvaW5kZXgnLFxuICAgICAgICB9KTtcbiAgICB9LFxuXG4gICAgLyoqIOi+k+WFpeahhuehruiupCAqL1xuICAgIG9uQ29uZm9ybVNlYXJjaCh7IGRldGFpbCB9KSB7XG4gICAgICAgIHRoaXMuc2V0RGF0YSEoe1xuICAgICAgICAgICAgcGFnZTogMCxcbiAgICAgICAgICAgIHRvdGFsUGFnZTogMCxcbiAgICAgICAgICAgIHNlYXJjaDogZGV0YWlsLFxuICAgICAgICAgICAgY2FuTG9hZE1vcmU6IHRydWVcbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMuZmV0Y2hEYXRhKCApO1xuICAgIH0sXG5cbiAgICAvKiog5ouJ5Y+W5YiX6KGoICovXG4gICAgZmV0Y2hEYXRhKCApIHtcblxuICAgICAgICBjb25zdCB7IGNhbkxvYWRNb3JlLCBsb2FkaW5nTGlzdCwgbGFzdFNlYXJjaCwgc2VhcmNoIH0gPSB0aGlzLmRhdGE7XG5cbiAgICAgICAgaWYgKCBsb2FkaW5nTGlzdCB8fCAhY2FuTG9hZE1vcmUgKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIHNlYXJjaC5yZXBsYWNlKC9cXHMrL2csIFwiXCIpICE9PSBsYXN0U2VhcmNoICkge1xuICAgICAgICAgICAgdGhpcy5zZXREYXRhISh7XG4gICAgICAgICAgICAgICAgcGFnZTogMCxcbiAgICAgICAgICAgICAgICB0b3RhbFBhZ2U6IDFcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIGNvbnNvbGUubG9nKCc9PT09PScpXG4gICAgICAgIHRoaXMuc2V0RGF0YSEoe1xuICAgICAgICAgICAgbG9hZGluZ0xpc3Q6IHRydWVcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaHR0cCh7XG4gICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgcGFnZTogdGhpcy5kYXRhLnBhZ2UgKyAxLFxuICAgICAgICAgICAgICAgIHRpdGxlOiB0aGlzLmRhdGEuc2VhcmNoXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgZXJyTXNnOiAn5Yqg6L295aSx6LSl77yM6K+36YeN6K+VJyxcbiAgICAgICAgICAgIGxvYWRpbmdNc2c6ICfliqDovb3kuK0uLi4nLFxuICAgICAgICAgICAgdXJsOiBgdHJpcF9saXN0YCxcbiAgICAgICAgICAgIHN1Y2Nlc3M6IHJlcyA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3QgeyBzdGF0dXMsIGRhdGEgfSA9IHJlcztcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICBpZiAoIHN0YXR1cyA9PT0gMjAwICkge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCB7IHBhZ2UsIHRvdGFsUGFnZSwgc2VhcmNoIH0gPSBkYXRhO1xuICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zZXREYXRhISh7XG4gICAgICAgICAgICAgICAgICAgICAgICBwYWdlLFxuICAgICAgICAgICAgICAgICAgICAgICAgdG90YWxQYWdlLFxuICAgICAgICAgICAgICAgICAgICAgICAgbGFzdFNlYXJjaDogc2VhcmNoIHx8ICcnLFxuICAgICAgICAgICAgICAgICAgICAgICAgY2FuTG9hZE1vcmU6IHRvdGFsUGFnZSA+IHBhZ2UsXG4gICAgICAgICAgICAgICAgICAgICAgICBpc05vdEF2YWlsYWJsZVRyaXA6ICFkYXRhLmRhdGEuc29tZSggeCA9PiB4LnB1Ymxpc2hlZCA9PT0gdHJ1ZSAmJiBuZXcgRGF0ZSggKS5nZXRUaW1lKCApIDwgeC5zdGFydF9kYXRlIClcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICBpZiAoIGRhdGEuZGF0YSAmJiBkYXRhLmRhdGEubGVuZ3RoID4gMCApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IG1ldGEgPSBwYWdlID09PSAxID9cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5kZWFsTGlzdFRleHQoIGRhdGEuZGF0YSApOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFsgLi4udGhpcy5kYXRhLmxpc3QsIC4uLnRoaXMuZGVhbExpc3RUZXh0KCBkYXRhLmRhdGEgKV07XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc2V0RGF0YSEoe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxpc3Q6IG1ldGFcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zZXREYXRhISh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGlzdDogWyBdXG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICB0aGlzLnNldERhdGEhKHtcbiAgICAgICAgICAgICAgICAgICAgbG9hZGluZ0xpc3Q6IGZhbHNlXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH0sXG5cbiAgICAvKiog57yW6L6R6KGM56iL5YiX6KGo5paH5a2XICovXG4gICAgZGVhbExpc3RUZXh0KCBsaXN0ICkge1xuXG4gICAgICAgIGNvbnN0IHNpbXBsZVRpbWUgPSAodHM6IG51bWJlcikgPT4ge1xuICAgICAgICAgICAgY29uc3QgdGltZSA9IG5ldyBEYXRlKCBOdW1iZXIoIHRzICkpO1xuICAgICAgICAgICAgcmV0dXJuIGAke3RpbWUuZ2V0TW9udGgoICkrMX3mnIgke3RpbWUuZ2V0RGF0ZSggKX3ml6VgXG4gICAgICAgIH07XG5cbiAgICAgICAgY29uc3Qgc2ltcGxlVGltZTIgPSAodHM6IG51bWJlcikgPT4ge1xuICAgICAgICAgICAgY29uc3QgdGltZSA9IG5ldyBEYXRlKCBOdW1iZXIoIHRzICkpO1xuICAgICAgICAgICAgcmV0dXJuIGAke3RpbWUuZ2V0TW9udGgoICkrMX0uJHt0aW1lLmdldERhdGUoICl9YFxuICAgICAgICB9O1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiAhIOazqOaEj++8jOaXtumXtOWvueavlOOAguW8gOWni+aXtumXtOaYryDmjIflrprml6XmnJ/nmoTml6nkuIo454K577yb57uT5p2f5pel5pyf5pivIOaMh+WumuaXpeacn+eahOaZmuS4ijI0OjAwXG4gICAgICAgICAqL1xuICAgICAgICBjb25zdCBtZXRhID0gbGlzdC5tYXAoKCB4LCBrICkgPT4ge1xuICAgICAgICAgICAgY29uc3QgeyBfaWQsIHRpdGxlLCBzYWxlc192b2x1bWUsIHN0YXJ0X2RhdGUsIHB1Ymxpc2hlZCwgZW5kX2RhdGUsIG9yZGVycywgaXNDbG9zZWQgfSA9IHg7XG5cbiAgICAgICAgICAgIGNvbnN0IHN0YXRlJCA9ICFwdWJsaXNoZWQgP1xuICAgICAgICAgICAgICAgICfmnKrlj5HluIMnIDpcbiAgICAgICAgICAgICAgICBpc0Nsb3NlZCA/XG4gICAgICAgICAgICAgICAgICAgICflt7LlhbPpl60nIDpcbiAgICAgICAgICAgICAgICAgICAgbmV3IERhdGUoICkuZ2V0VGltZSggKSA+PSBlbmRfZGF0ZSA/XG4gICAgICAgICAgICAgICAgICAgICAgICAn5bey57uT5p2fJyA6XG4gICAgICAgICAgICAgICAgICAgICAgICBuZXcgRGF0ZSggKS5nZXRUaW1lKCApID49IHN0YXJ0X2RhdGUgP1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICfov5vooYzkuK0nIDpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAn5Y2z5bCG5byA5aeLJztcblxuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBfaWQsXG4gICAgICAgICAgICAgICAgdGl0bGUsXG4gICAgICAgICAgICAgICAgb3JkZXJzLFxuICAgICAgICAgICAgICAgIGJnOiBrICUgNyxcbiAgICAgICAgICAgICAgICBzYWxlc192b2x1bWUsXG4gICAgICAgICAgICAgICAgc3RhdGU6IHN0YXRlJCxcbiAgICAgICAgICAgICAgICBpbmc6IHN0YXRlJCA9PT0gJ+i/m+ihjOS4rScsXG4gICAgICAgICAgICAgICAgZW5kRGF0ZTogc2ltcGxlVGltZSggZW5kX2RhdGUgKSxcbiAgICAgICAgICAgICAgICBzdGFydERhdGU6IHNpbXBsZVRpbWUoIHN0YXJ0X2RhdGUgKSxcbiAgICAgICAgICAgICAgICBlbmREYXRlMjogc2ltcGxlVGltZTIoIGVuZF9kYXRlICksXG4gICAgICAgICAgICAgICAgc3RhcnREYXRlMjogc2ltcGxlVGltZTIoIHN0YXJ0X2RhdGUgKSxcbiAgICAgICAgICAgICAgICByZWQ6IHN0YXRlJCA9PT0gJ+acquWPkeW4gycgfHwgc3RhdGUkID09PSAn6L+b6KGM5LitJyB8fCBzdGF0ZSQgPT09ICfljbPlsIblvIDlp4snLFxuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIG1ldGE7XG4gICAgfSxcblxuICAgIC8qKiDmkJzntKLovpPlhaUgKi9cbiAgICBvbklucHV0KHsgZGV0YWlsIH0pIHtcbiAgICAgICAgdGhpcy5zZXREYXRhISh7XG4gICAgICAgICAgICBzZWFyY2g6IGRldGFpbC52YWx1ZSxcbiAgICAgICAgICAgIGNhbkxvYWRNb3JlOiBkZXRhaWwudmFsdWUucmVwbGFjZSgvXFxzKy9nLCBcIlwiKSAhPT0gdGhpcy5kYXRhLmxhc3RTZWFyY2hcbiAgICAgICAgfSk7XG4gICAgfSxcblxuICAgIC8qKiDngrnlh7vor6bmg4UgKi9cbiAgICBvblRhYih7IGN1cnJlbnRUYXJnZXQgfSkge1xuICAgICAgICBjb25zdCB7IHRpZCB9ID0gY3VycmVudFRhcmdldC5kYXRhc2V0O1xuICAgICAgICB3eC5uYXZpZ2F0ZVRvKHtcbiAgICAgICAgICAgIHVybDogYC9wYWdlcy9tYW5hZ2VyLXRyaXAtZGV0YWlsL2luZGV4P2lkPSR7dGlkfWBcbiAgICAgICAgfSk7XG4gICAgfSxcbiAgXG4gICAgLyoqXG4gICAgICog55Sf5ZG95ZGo5pyf5Ye95pWwLS3nm5HlkKzpobXpnaLliqDovb1cbiAgICAgKi9cbiAgICBvbkxvYWQ6IGZ1bmN0aW9uICggKSB7XG4gICAgICAgIHd4LmhpZGVTaGFyZU1lbnUoeyB9KTtcbiAgICB9LFxuICBcbiAgICAvKipcbiAgICAgKiDnlJ/lkb3lkajmnJ/lh73mlbAtLeebkeWQrOmhtemdouWIneasoea4suafk+WujOaIkFxuICAgICAqL1xuICAgIG9uUmVhZHk6IGZ1bmN0aW9uICggKSB7XG4gIFxuICAgIH0sXG4gIFxuICAgIC8qKlxuICAgICAqIOeUn+WRveWRqOacn+WHveaVsC0t55uR5ZCs6aG16Z2i5pi+56S6XG4gICAgICovXG4gICAgb25TaG93OiBmdW5jdGlvbiAoICkge1xuICAgICAgICB0aGlzLnNldERhdGEhKHtcbiAgICAgICAgICAgIHBhZ2U6IDAsXG4gICAgICAgICAgICBjYW5Mb2FkTW9yZTogdHJ1ZVxuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy5mZXRjaERhdGEoICk7XG4gICAgfSxcbiAgXG4gICAgLyoqXG4gICAgICog55Sf5ZG95ZGo5pyf5Ye95pWwLS3nm5HlkKzpobXpnaLpmpDol49cbiAgICAgKi9cbiAgICBvbkhpZGU6IGZ1bmN0aW9uICggKSB7XG4gIFxuICAgIH0sXG4gIFxuICAgIC8qKlxuICAgICAqIOeUn+WRveWRqOacn+WHveaVsC0t55uR5ZCs6aG16Z2i5Y246L29XG4gICAgICovXG4gICAgb25VbmxvYWQ6IGZ1bmN0aW9uICggKSB7XG4gIFxuICAgIH0sXG4gIFxuICAgIC8qKlxuICAgICAqIOmhtemdouebuOWFs+S6i+S7tuWkhOeQhuWHveaVsC0t55uR5ZCs55So5oi35LiL5ouJ5Yqo5L2cXG4gICAgICovXG4gICAgb25QdWxsRG93blJlZnJlc2g6IGZ1bmN0aW9uICggKSB7XG4gIFxuICAgIH0sXG4gIFxuICAgIC8qKlxuICAgICAqIOmhtemdouS4iuaLieinpuW6leS6i+S7tueahOWkhOeQhuWHveaVsFxuICAgICAqL1xuICAgIG9uUmVhY2hCb3R0b206IGZ1bmN0aW9uICggKSB7XG4gIFxuICAgIH0sXG4gIFxuICAgIC8qKlxuICAgICAqIOeUqOaIt+eCueWHu+WPs+S4iuinkuWIhuS6q1xuICAgICAqL1xuICAgIC8vIG9uU2hhcmVBcHBNZXNzYWdlOiBmdW5jdGlvbiAoKSB7XG4gIFxuICAgIC8vIH1cbn0pIl19