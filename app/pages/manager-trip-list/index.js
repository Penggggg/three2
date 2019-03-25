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
        isNotAvailableTrip: false
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
        return list.map(function (x) {
            var _id = x._id, title = x.title, sales_volume = x.sales_volume, start_date = x.start_date, published = x.published, end_date = x.end_date, orders = x.orders;
            return {
                _id: _id,
                title: title,
                sales_volume: sales_volume,
                orders: orders,
                endData: simpleTime(end_date),
                startDate: simpleTime(start_date),
                state: !published ?
                    '未发布' :
                    new Date().getTime() >= end_date ?
                        '已结束' :
                        new Date().getTime() >= start_date ?
                            '进行中' :
                            '即将开始'
            };
        });
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUNBLHdDQUF1QztBQUd2QyxJQUFJLENBQUM7SUFNRCxJQUFJLEVBQUU7UUFFRixJQUFJLEVBQUUsQ0FBQztRQUVQLFNBQVMsRUFBRSxDQUFDO1FBRVosTUFBTSxFQUFFLEVBQUU7UUFFVixJQUFJLEVBQUUsRUFBRztRQUVULFdBQVcsRUFBRSxLQUFLO1FBRWxCLFdBQVcsRUFBRSxJQUFJO1FBRWpCLFVBQVUsRUFBRSxFQUFFO1FBRWQsa0JBQWtCLEVBQUUsS0FBSztLQUM1QjtJQUdELFFBQVEsWUFBRSxDQUFDO1FBQ1AsRUFBRSxDQUFDLFVBQVUsQ0FBQztZQUNWLEdBQUcsRUFBRSxrQ0FBa0M7U0FDMUMsQ0FBQyxDQUFDO0lBQ1AsQ0FBQztJQUdELGVBQWUsWUFBQyxFQUFVO1lBQVIsa0JBQU07UUFDcEIsSUFBSSxDQUFDLE9BQVEsQ0FBQztZQUNWLElBQUksRUFBRSxDQUFDO1lBQ1AsU0FBUyxFQUFFLENBQUM7WUFDWixNQUFNLEVBQUUsTUFBTTtZQUNkLFdBQVcsRUFBRSxJQUFJO1NBQ3BCLENBQUMsQ0FBQztRQUNILElBQUksQ0FBQyxTQUFTLEVBQUcsQ0FBQztJQUN0QixDQUFDO0lBR0QsU0FBUztRQUFULGlCQTZEQztRQTNEUyxJQUFBLGNBQTRELEVBQTFELDRCQUFXLEVBQUUsNEJBQVcsRUFBRSwwQkFBVSxFQUFFLGtCQUFvQixDQUFDO1FBRW5FLElBQUssV0FBVyxJQUFJLENBQUMsV0FBVyxFQUFHO1lBQy9CLE9BQU87U0FDVjtRQUVELElBQUssTUFBTSxDQUFDLE9BQU8sQ0FBQyxNQUFNLEVBQUUsRUFBRSxDQUFDLEtBQUssVUFBVSxFQUFHO1lBQzdDLElBQUksQ0FBQyxPQUFRLENBQUM7Z0JBQ1YsSUFBSSxFQUFFLENBQUM7Z0JBQ1AsU0FBUyxFQUFFLENBQUM7YUFDZixDQUFDLENBQUM7U0FDTjtRQUVELElBQUks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QUFLLENBQUMsQ0FBQzt3QkFDUCxJQUFJLElBQUksRUFBRyxDQUFDLE9BQU8sRUFBRyxJQUFJLFVBQVUsQ0FBQyxDQUFDOzRCQUNsQyxLQUFLLENBQUMsQ0FBQzs0QkFDUCxNQUFNO2FBQzdCLENBQUE7UUFDTCxDQUFDLENBQUMsQ0FBQTtJQUNOLENBQUM7SUFHRCxPQUFPLFlBQUMsRUFBVTtZQUFSLGtCQUFNO1FBQ1osSUFBSSxDQUFDLE9BQVEsQ0FBQztZQUNWLE1BQU0sRUFBRSxNQUFNLENBQUMsS0FBSztZQUNwQixXQUFXLEVBQUUsTUFBTSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsTUFBTSxFQUFFLEVBQUUsQ0FBQyxLQUFLLElBQUksQ0FBQyxJQUFJLENBQUMsVUFBVTtTQUN6RSxDQUFDLENBQUM7SUFDUCxDQUFDO0lBR0QsS0FBSyxZQUFDLEVBQWlCO1lBQWYsZ0NBQWE7UUFDVCxJQUFBLCtCQUFHLENBQTJCO1FBQ3RDLEVBQUUsQ0FBQyxVQUFVLENBQUM7WUFFVixHQUFHLEVBQUUseUNBQXVDLEdBQUs7U0FDcEQsQ0FBQyxDQUFDO0lBQ1AsQ0FBQztJQUtELE1BQU0sRUFBRTtRQUNKLEVBQUUsQ0FBQyxhQUFhLENBQUMsRUFBRyxDQUFDLENBQUM7SUFDMUIsQ0FBQztJQUtELE9BQU8sRUFBRTtJQUVULENBQUM7SUFLRCxNQUFNLEVBQUU7UUFDSixJQUFJLENBQUMsU0FBUyxFQUFHLENBQUM7SUFDdEIsQ0FBQztJQUtELE1BQU0sRUFBRTtJQUVSLENBQUM7SUFLRCxRQUFRLEVBQUU7SUFFVixDQUFDO0lBS0QsaUJBQWlCLEVBQUU7SUFFbkIsQ0FBQztJQUtELGFBQWEsRUFBRTtJQUVmLENBQUM7Q0FRSixDQUFDLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJcbmltcG9ydCB7IGh0dHAgfSBmcm9tICcuLi8uLi91dGlsL2h0dHAnO1xuXG4vLyBhcHAvcGFnZXMvbWFuYWdlci1nb29kcy1kZXRhaWwvaW5kZXguanNcblBhZ2Uoe1xuXG4gICAgLyoqXG4gICAgICog6aG16Z2i55qE5Yid5aeL5pWw5o2uXG4gICAgICogISDliJfooajlsZXnpLrnu7TluqbvvJrlkI3np7DjgIHplIDllK7pop3jgIHorqLljZXmlbDjgIHnirbmgIHjgIHlvIDlp4vml7bpl7RcbiAgICAgKi9cbiAgICBkYXRhOiB7XG4gICAgICAgIC8vIOW9k+WJjemhteeggVxuICAgICAgICBwYWdlOiAwLFxuICAgICAgICAvLyDmgLvpobXmlbBcbiAgICAgICAgdG90YWxQYWdlOiAxLFxuICAgICAgICAvLyDmkJzntKJcbiAgICAgICAgc2VhcmNoOiAnJyxcbiAgICAgICAgLy8g5ZWG5ZOB5YiX6KGoXG4gICAgICAgIGxpc3Q6IFsgXSxcbiAgICAgICAgLy8g5Yqg6L295YiX6KGoaW5nXG4gICAgICAgIGxvYWRpbmdMaXN0OiBmYWxzZSxcbiAgICAgICAgLy8g6IO95ZCm57un57ut5Yqg6L29XG4gICAgICAgIGNhbkxvYWRNb3JlOiB0cnVlLFxuICAgICAgICAvLyDkuIrmrKHmkJzntKLnmoTmlofmnKxcbiAgICAgICAgbGFzdFNlYXJjaDogJycsXG4gICAgICAgIC8vIOaYr+WQpuW3sue7j+ayoeacieS4i+S4gOS4quWPr+eUqOihjOeoi1xuICAgICAgICBpc05vdEF2YWlsYWJsZVRyaXA6IGZhbHNlXG4gICAgfSxcblxuICAgIC8qKiDot7PpobUgKi9cbiAgICBuYXZpZ2F0ZSggZSApIHtcbiAgICAgICAgd3gubmF2aWdhdGVUbyh7XG4gICAgICAgICAgICB1cmw6ICcvcGFnZXMvbWFuYWdlci10cmlwLWRldGFpbC9pbmRleCcsXG4gICAgICAgIH0pO1xuICAgIH0sXG5cbiAgICAvKiog6L6T5YWl5qGG56Gu6K6kICovXG4gICAgb25Db25mb3JtU2VhcmNoKHsgZGV0YWlsIH0pIHtcbiAgICAgICAgdGhpcy5zZXREYXRhISh7XG4gICAgICAgICAgICBwYWdlOiAwLFxuICAgICAgICAgICAgdG90YWxQYWdlOiAwLFxuICAgICAgICAgICAgc2VhcmNoOiBkZXRhaWwsXG4gICAgICAgICAgICBjYW5Mb2FkTW9yZTogdHJ1ZVxuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy5mZXRjaERhdGEoICk7XG4gICAgfSxcblxuICAgIC8qKiDmi4nlj5bliJfooaggKi9cbiAgICBmZXRjaERhdGEoICkge1xuXG4gICAgICAgIGNvbnN0IHsgY2FuTG9hZE1vcmUsIGxvYWRpbmdMaXN0LCBsYXN0U2VhcmNoLCBzZWFyY2ggfSA9IHRoaXMuZGF0YTtcblxuICAgICAgICBpZiAoIGxvYWRpbmdMaXN0IHx8ICFjYW5Mb2FkTW9yZSApIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICggc2VhcmNoLnJlcGxhY2UoL1xccysvZywgXCJcIikgIT09IGxhc3RTZWFyY2ggKSB7XG4gICAgICAgICAgICB0aGlzLnNldERhdGEhKHtcbiAgICAgICAgICAgICAgICBwYWdlOiAwLFxuICAgICAgICAgICAgICAgIHRvdGFsUGFnZTogMVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLnNldERhdGEhKHtcbiAgICAgICAgICAgIGxvYWRpbmdMaXN0OiB0cnVlXG4gICAgICAgIH0pO1xuXG4gICAgICAgIGh0dHAoe1xuICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgIHBhZ2U6IHRoaXMuZGF0YS5wYWdlICsgMSxcbiAgICAgICAgICAgICAgICB0aXRsZTogdGhpcy5kYXRhLnNlYXJjaFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGVyck1zZzogJ+WKoOi9veWksei0pe+8jOivt+mHjeivlScsXG4gICAgICAgICAgICBsb2FkaW5nTXNnOiAn5Yqg6L295LitLi4uJyxcbiAgICAgICAgICAgIHVybDogYHRyaXBfbGlzdGAsXG4gICAgICAgICAgICBzdWNjZXNzOiByZXMgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IHsgc3RhdHVzLCBkYXRhIH0gPSByZXM7XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgaWYgKCBzdGF0dXMgPT09IDIwMCApIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgeyBwYWdlLCB0b3RhbFBhZ2UsIHNlYXJjaCB9ID0gZGF0YTtcbiAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc2V0RGF0YSEoe1xuICAgICAgICAgICAgICAgICAgICAgICAgcGFnZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHRvdGFsUGFnZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGxhc3RTZWFyY2g6IHNlYXJjaCB8fCAnJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhbkxvYWRNb3JlOiB0b3RhbFBhZ2UgPiBwYWdlLFxuICAgICAgICAgICAgICAgICAgICAgICAgaXNOb3RBdmFpbGFibGVUcmlwOiAhZGF0YS5kYXRhLnNvbWUoIHggPT4geC5wdWJsaXNoZWQgPT09IHRydWUgJiYgbmV3IERhdGUoICkuZ2V0VGltZSggKSA8IHguc3RhcnRfZGF0ZSApXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgaWYgKCBkYXRhLmRhdGEgJiYgZGF0YS5kYXRhLmxlbmd0aCA+IDAgKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBtZXRhID0gcGFnZSA9PT0gMSA/XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZGVhbExpc3RUZXh0KCBkYXRhLmRhdGEgKTpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBbIC4uLnRoaXMuZGF0YS5saXN0LCAuLi50aGlzLmRlYWxMaXN0VGV4dCggZGF0YS5kYXRhICldO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnNldERhdGEhKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsaXN0OiBtZXRhXG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc2V0RGF0YSEoe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxpc3Q6IFsgXVxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgdGhpcy5zZXREYXRhISh7XG4gICAgICAgICAgICAgICAgICAgIGxvYWRpbmdMaXN0OiBmYWxzZVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9LFxuXG4gICAgLyoqIOe8lui+keihjOeoi+WIl+ihqOaWh+WtlyAqL1xuICAgIGRlYWxMaXN0VGV4dCggbGlzdCApIHtcblxuICAgICAgICBjb25zdCBzaW1wbGVUaW1lID0gKHRzOiBudW1iZXIpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IHRpbWUgPSBuZXcgRGF0ZSggTnVtYmVyKCB0cyApKTtcbiAgICAgICAgICAgIHJldHVybiBgJHt0aW1lLmdldE1vbnRoKCApKzF95pyIJHt0aW1lLmdldERhdGUoICl95pelYFxuICAgICAgICB9O1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiAhIOazqOaEj++8jOaXtumXtOWvueavlOOAguW8gOWni+aXtumXtOaYryDmjIflrprml6XmnJ/nmoTml6nkuIo454K577yb57uT5p2f5pel5pyf5pivIOaMh+WumuaXpeacn+eahOaZmuS4ijI0OjAwXG4gICAgICAgICAqL1xuICAgICAgICByZXR1cm4gbGlzdC5tYXAoIHggPT4ge1xuICAgICAgICAgICAgY29uc3QgeyBfaWQsIHRpdGxlLCBzYWxlc192b2x1bWUsIHN0YXJ0X2RhdGUsIHB1Ymxpc2hlZCwgZW5kX2RhdGUsIG9yZGVycyB9ID0geDtcbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgX2lkLFxuICAgICAgICAgICAgICAgIHRpdGxlLFxuICAgICAgICAgICAgICAgIHNhbGVzX3ZvbHVtZSxcbiAgICAgICAgICAgICAgICBvcmRlcnMsXG4gICAgICAgICAgICAgICAgZW5kRGF0YTogc2ltcGxlVGltZSggZW5kX2RhdGUgKSxcbiAgICAgICAgICAgICAgICBzdGFydERhdGU6IHNpbXBsZVRpbWUoIHN0YXJ0X2RhdGUgKSxcbiAgICAgICAgICAgICAgICBzdGF0ZTogIXB1Ymxpc2hlZCA/XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJ+acquWPkeW4gycgOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5ldyBEYXRlKCApLmdldFRpbWUoICkgPj0gZW5kX2RhdGUgP1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAn5bey57uT5p2fJyA6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5ldyBEYXRlKCApLmdldFRpbWUoICkgPj0gc3RhcnRfZGF0ZSA/XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAn6L+b6KGM5LitJyA6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAn5Y2z5bCG5byA5aeLJ1xuICAgICAgICAgICAgfVxuICAgICAgICB9KVxuICAgIH0sXG5cbiAgICAvKiog5pCc57Si6L6T5YWlICovXG4gICAgb25JbnB1dCh7IGRldGFpbCB9KSB7XG4gICAgICAgIHRoaXMuc2V0RGF0YSEoe1xuICAgICAgICAgICAgc2VhcmNoOiBkZXRhaWwudmFsdWUsXG4gICAgICAgICAgICBjYW5Mb2FkTW9yZTogZGV0YWlsLnZhbHVlLnJlcGxhY2UoL1xccysvZywgXCJcIikgIT09IHRoaXMuZGF0YS5sYXN0U2VhcmNoXG4gICAgICAgIH0pO1xuICAgIH0sXG5cbiAgICAvKiog54K55Ye76K+m5oOFICovXG4gICAgb25UYWIoeyBjdXJyZW50VGFyZ2V0IH0pIHtcbiAgICAgICAgY29uc3QgeyB0aWQgfSA9IGN1cnJlbnRUYXJnZXQuZGF0YXNldDtcbiAgICAgICAgd3gubmF2aWdhdGVUbyh7XG4gICAgICAgICAgICAvLyB1cmw6IGAvcGFnZXMvdHJpcC1kZXRhaWwvaW5kZXg/aWQ9JHt0aWR9YFxuICAgICAgICAgICAgdXJsOiBgL3BhZ2VzL21hbmFnZXItdHJpcC1kZXRhaWwvaW5kZXg/aWQ9JHt0aWR9YFxuICAgICAgICB9KTtcbiAgICB9LFxuICBcbiAgICAvKipcbiAgICAgKiDnlJ/lkb3lkajmnJ/lh73mlbAtLeebkeWQrOmhtemdouWKoOi9vVxuICAgICAqL1xuICAgIG9uTG9hZDogZnVuY3Rpb24gKCApIHtcbiAgICAgICAgd3guaGlkZVNoYXJlTWVudSh7IH0pO1xuICAgIH0sXG4gIFxuICAgIC8qKlxuICAgICAqIOeUn+WRveWRqOacn+WHveaVsC0t55uR5ZCs6aG16Z2i5Yid5qyh5riy5p+T5a6M5oiQXG4gICAgICovXG4gICAgb25SZWFkeTogZnVuY3Rpb24gKCApIHtcbiAgXG4gICAgfSxcbiAgXG4gICAgLyoqXG4gICAgICog55Sf5ZG95ZGo5pyf5Ye95pWwLS3nm5HlkKzpobXpnaLmmL7npLpcbiAgICAgKi9cbiAgICBvblNob3c6IGZ1bmN0aW9uICggKSB7XG4gICAgICAgIHRoaXMuZmV0Y2hEYXRhKCApO1xuICAgIH0sXG4gIFxuICAgIC8qKlxuICAgICAqIOeUn+WRveWRqOacn+WHveaVsC0t55uR5ZCs6aG16Z2i6ZqQ6JePXG4gICAgICovXG4gICAgb25IaWRlOiBmdW5jdGlvbiAoICkge1xuICBcbiAgICB9LFxuICBcbiAgICAvKipcbiAgICAgKiDnlJ/lkb3lkajmnJ/lh73mlbAtLeebkeWQrOmhtemdouWNuOi9vVxuICAgICAqL1xuICAgIG9uVW5sb2FkOiBmdW5jdGlvbiAoICkge1xuICBcbiAgICB9LFxuICBcbiAgICAvKipcbiAgICAgKiDpobXpnaLnm7jlhbPkuovku7blpITnkIblh73mlbAtLeebkeWQrOeUqOaIt+S4i+aLieWKqOS9nFxuICAgICAqL1xuICAgIG9uUHVsbERvd25SZWZyZXNoOiBmdW5jdGlvbiAoICkge1xuICBcbiAgICB9LFxuICBcbiAgICAvKipcbiAgICAgKiDpobXpnaLkuIrmi4nop6blupXkuovku7bnmoTlpITnkIblh73mlbBcbiAgICAgKi9cbiAgICBvblJlYWNoQm90dG9tOiBmdW5jdGlvbiAoICkge1xuICBcbiAgICB9LFxuICBcbiAgICAvKipcbiAgICAgKiDnlKjmiLfngrnlh7vlj7PkuIrop5LliIbkuqtcbiAgICAgKi9cbiAgICAvLyBvblNoYXJlQXBwTWVzc2FnZTogZnVuY3Rpb24gKCkge1xuICBcbiAgICAvLyB9XG59KSJdfQ==