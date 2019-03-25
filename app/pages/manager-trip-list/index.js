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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUNBLHdDQUF1QztBQUd2QyxJQUFJLENBQUM7SUFNRCxJQUFJLEVBQUU7UUFFRixJQUFJLEVBQUUsQ0FBQztRQUVQLFNBQVMsRUFBRSxDQUFDO1FBRVosTUFBTSxFQUFFLEVBQUU7UUFFVixJQUFJLEVBQUUsRUFBRztRQUVULFdBQVcsRUFBRSxLQUFLO1FBRWxCLFdBQVcsRUFBRSxJQUFJO1FBRWpCLFVBQVUsRUFBRSxFQUFFO1FBRWQsa0JBQWtCLEVBQUUsS0FBSztLQUM1QjtJQUdELFFBQVEsWUFBRSxDQUFDO1FBQ1AsRUFBRSxDQUFDLFVBQVUsQ0FBQztZQUNWLEdBQUcsRUFBRSxrQ0FBa0M7U0FDMUMsQ0FBQyxDQUFDO0lBQ1AsQ0FBQztJQUdELGVBQWUsWUFBQyxFQUFVO1lBQVIsa0JBQU07UUFDcEIsSUFBSSxDQUFDLE9BQVEsQ0FBQztZQUNWLE1BQU0sRUFBRSxNQUFNO1lBQ2QsV0FBVyxFQUFFLElBQUk7U0FDcEIsQ0FBQyxDQUFDO1FBQ0gsSUFBSSxDQUFDLFNBQVMsRUFBRyxDQUFDO0lBQ3RCLENBQUM7SUFHRCxTQUFTO1FBQVQsaUJBNkRDO1FBM0RTLElBQUEsY0FBNEQsRUFBMUQsNEJBQVcsRUFBRSw0QkFBVyxFQUFFLDBCQUFVLEVBQUUsa0JBQW9CLENBQUM7UUFFbkUsSUFBSyxXQUFXLElBQUksQ0FBQyxXQUFXLEVBQUc7WUFDL0IsT0FBTztTQUNWO1FBRUQsSUFBSyxNQUFNLENBQUMsT0FBTyxDQUFDLE1BQU0sRUFBRSxFQUFFLENBQUMsS0FBSyxVQUFVLEVBQUc7WUFDN0MsSUFBSSxDQUFDLE9BQVEsQ0FBQztnQkFDVixJQUFJLEVBQUUsQ0FBQztnQkFDUCxTQUFTLEVBQUUsQ0FBQzthQUNmLENBQUMsQ0FBQztTQUNOO1FBRUQsSUFBSSxDQUFDLE9BQVEsQ0FBQztZQUNWLFdBQVcsRUFBRSxJQUFJO1NBQ3BCLENBQUMsQ0FBQztRQUVILFdBQUksQ0FBQztZQUNELElBQUksRUFBRTtnQkFDRixJQUFJLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLEdBQUcsQ0FBQztnQkFDeEIsS0FBSyxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTTthQUMxQjtZQUNELE1BQU0sRUFBRSxVQUFVO1lBQ2xCLFVBQVUsRUFBRSxRQUFRO1lBQ3BCLEdBQUcsRUFBRSxXQUFXO1lBQ2hCLE9BQU8sRUFBRSxVQUFBLEdBQUc7Z0JBQ0EsSUFBQSxtQkFBTSxFQUFFLGVBQUksQ0FBUztnQkFFN0IsSUFBSyxNQUFNLEtBQUssR0FBRyxFQUFHO29CQUNWLElBQUEsZ0JBQUksRUFBRSwwQkFBUyxFQUFFLHNCQUFNLENBQVU7b0JBRXpDLEtBQUksQ0FBQyxPQUFRLENBQUM7d0JBQ1YsSUFBSSxNQUFBO3dCQUNKLFNBQVMsV0FBQTt3QkFDVCxVQUFVLEVBQUUsUUFBTSxJQUFJLEVBQUU7d0JBQ3hCLFdBQVcsRUFBRSxTQUFTLEdBQUcsSUFBSTt3QkFDN0Isa0JBQWtCLEVBQUUsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBRSxVQUFBLENBQUMsSUFBSSxPQUFBLENBQUMsQ0FBQyxTQUFTLEtBQUssSUFBSSxJQUFJLElBQUksSUFBSSxFQUFHLENBQUMsT0FBTyxFQUFHLEdBQUcsQ0FBQyxDQUFDLFVBQVUsRUFBN0QsQ0FBNkQsQ0FBRTtxQkFDNUcsQ0FBQyxDQUFDO29CQUVILElBQUssSUFBSSxDQUFDLElBQUksSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUc7d0JBQ3JDLElBQU0sSUFBSSxHQUFHLElBQUksS0FBSyxDQUFDLENBQUMsQ0FBQzs0QkFDakIsS0FBSSxDQUFDLFlBQVksQ0FBRSxJQUFJLENBQUMsSUFBSSxDQUFFLENBQUEsQ0FBQyxDQUM5QixLQUFJLENBQUMsSUFBSSxDQUFDLElBQUksUUFBSyxLQUFJLENBQUMsWUFBWSxDQUFFLElBQUksQ0FBQyxJQUFJLENBQUUsQ0FBQyxDQUFDO3dCQUU1RCxLQUFJLENBQUMsT0FBUSxDQUFDOzRCQUNWLElBQUksRUFBRSxJQUFJO3lCQUNiLENBQUMsQ0FBQztxQkFDTjt5QkFBTTt3QkFDSCxLQUFJLENBQUMsT0FBUSxDQUFDOzRCQUNWLElBQUksRUFBRSxFQUFHO3lCQUNaLENBQUMsQ0FBQztxQkFDTjtpQkFDSjtnQkFFRCxLQUFJLENBQUMsT0FBUSxDQUFDO29CQUNWLFdBQVcsRUFBRSxLQUFLO2lCQUNyQixDQUFDLENBQUM7WUFDUCxDQUFDO1NBQ0osQ0FBQyxDQUFDO0lBQ1AsQ0FBQztJQUdELFlBQVksWUFBRSxJQUFJO1FBRWQsSUFBTSxVQUFVLEdBQUcsVUFBQyxFQUFVO1lBQzFCLElBQU0sSUFBSSxHQUFHLElBQUksSUFBSSxDQUFFLE1BQU0sQ0FBRSxFQUFFLENBQUUsQ0FBQyxDQUFDO1lBQ3JDLE9BQVUsSUFBSSxDQUFDLFFBQVEsRUFBRyxHQUFDLENBQUMsY0FBSSxJQUFJLENBQUMsT0FBTyxFQUFHLFdBQUcsQ0FBQTtRQUN0RCxDQUFDLENBQUM7UUFLRixPQUFPLElBQUksQ0FBQyxHQUFHLENBQUUsVUFBQSxDQUFDO1lBQ04sSUFBQSxXQUFHLEVBQUUsZUFBSyxFQUFFLDZCQUFZLEVBQUUseUJBQVUsRUFBRSx1QkFBUyxFQUFFLHFCQUFRLEVBQUUsaUJBQU0sQ0FBTztZQUNoRixPQUFPO2dCQUNILEdBQUcsS0FBQTtnQkFDSCxLQUFLLE9BQUE7Z0JBQ0wsWUFBWSxjQUFBO2dCQUNaLE1BQU0sUUFBQTtnQkFDTixPQUFPLEVBQUUsVUFBVSxDQUFFLFFBQVEsQ0FBRTtnQkFDL0IsU0FBUyxFQUFFLFVBQVUsQ0FBRSxVQUFVLENBQUU7Z0JBQ25DLEtBQUssRUFBRSxDQUFDLFNBQVMsQ0FBQyxDQUFDO29CQUNQLEtBQUssQ0FBQyxDQUFDO29CQUNQLElBQUksSUFBSSxFQUFHLENBQUMsT0FBTyxFQUFHLElBQUksUUFBUSxDQUFDLENBQUM7d0JBQ2hDLEtBQUssQ0FBQyxDQUFDO3dCQUNQLElBQUksSUFBSSxFQUFHLENBQUMsT0FBTyxFQUFHLElBQUksVUFBVSxDQUFDLENBQUM7NEJBQ2xDLEtBQUssQ0FBQyxDQUFDOzRCQUNQLE1BQU07YUFDN0IsQ0FBQTtRQUNMLENBQUMsQ0FBQyxDQUFBO0lBQ04sQ0FBQztJQUdELE9BQU8sWUFBQyxFQUFVO1lBQVIsa0JBQU07UUFDWixJQUFJLENBQUMsT0FBUSxDQUFDO1lBQ1YsTUFBTSxFQUFFLE1BQU0sQ0FBQyxLQUFLO1lBQ3BCLFdBQVcsRUFBRSxNQUFNLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxNQUFNLEVBQUUsRUFBRSxDQUFDLEtBQUssSUFBSSxDQUFDLElBQUksQ0FBQyxVQUFVO1NBQ3pFLENBQUMsQ0FBQztJQUNQLENBQUM7SUFHRCxLQUFLLFlBQUMsRUFBaUI7WUFBZixnQ0FBYTtRQUNULElBQUEsK0JBQUcsQ0FBMkI7UUFDdEMsRUFBRSxDQUFDLFVBQVUsQ0FBQztZQUVWLEdBQUcsRUFBRSx5Q0FBdUMsR0FBSztTQUNwRCxDQUFDLENBQUM7SUFDUCxDQUFDO0lBS0QsTUFBTSxFQUFFO1FBQ0osRUFBRSxDQUFDLGFBQWEsQ0FBQyxFQUFHLENBQUMsQ0FBQztJQUMxQixDQUFDO0lBS0QsT0FBTyxFQUFFO0lBRVQsQ0FBQztJQUtELE1BQU0sRUFBRTtRQUNKLElBQUksQ0FBQyxTQUFTLEVBQUcsQ0FBQztJQUN0QixDQUFDO0lBS0QsTUFBTSxFQUFFO0lBRVIsQ0FBQztJQUtELFFBQVEsRUFBRTtJQUVWLENBQUM7SUFLRCxpQkFBaUIsRUFBRTtJQUVuQixDQUFDO0lBS0QsYUFBYSxFQUFFO0lBRWYsQ0FBQztDQVFKLENBQUMsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbIlxuaW1wb3J0IHsgaHR0cCB9IGZyb20gJy4uLy4uL3V0aWwvaHR0cCc7XG5cbi8vIGFwcC9wYWdlcy9tYW5hZ2VyLWdvb2RzLWRldGFpbC9pbmRleC5qc1xuUGFnZSh7XG5cbiAgICAvKipcbiAgICAgKiDpobXpnaLnmoTliJ3lp4vmlbDmja5cbiAgICAgKiAhIOWIl+ihqOWxleekuue7tOW6pu+8muWQjeensOOAgemUgOWUrumineOAgeiuouWNleaVsOOAgeeKtuaAgeOAgeW8gOWni+aXtumXtFxuICAgICAqL1xuICAgIGRhdGE6IHtcbiAgICAgICAgLy8g5b2T5YmN6aG156CBXG4gICAgICAgIHBhZ2U6IDAsXG4gICAgICAgIC8vIOaAu+mhteaVsFxuICAgICAgICB0b3RhbFBhZ2U6IDEsXG4gICAgICAgIC8vIOaQnOe0olxuICAgICAgICBzZWFyY2g6ICcnLFxuICAgICAgICAvLyDllYblk4HliJfooahcbiAgICAgICAgbGlzdDogWyBdLFxuICAgICAgICAvLyDliqDovb3liJfooahpbmdcbiAgICAgICAgbG9hZGluZ0xpc3Q6IGZhbHNlLFxuICAgICAgICAvLyDog73lkKbnu6fnu63liqDovb1cbiAgICAgICAgY2FuTG9hZE1vcmU6IHRydWUsXG4gICAgICAgIC8vIOS4iuasoeaQnOe0oueahOaWh+acrFxuICAgICAgICBsYXN0U2VhcmNoOiAnJyxcbiAgICAgICAgLy8g5piv5ZCm5bey57uP5rKh5pyJ5LiL5LiA5Liq5Y+v55So6KGM56iLXG4gICAgICAgIGlzTm90QXZhaWxhYmxlVHJpcDogZmFsc2VcbiAgICB9LFxuXG4gICAgLyoqIOi3s+mhtSAqL1xuICAgIG5hdmlnYXRlKCBlICkge1xuICAgICAgICB3eC5uYXZpZ2F0ZVRvKHtcbiAgICAgICAgICAgIHVybDogJy9wYWdlcy9tYW5hZ2VyLXRyaXAtZGV0YWlsL2luZGV4JyxcbiAgICAgICAgfSk7XG4gICAgfSxcblxuICAgIC8qKiDovpPlhaXmoYbnoa7orqQgKi9cbiAgICBvbkNvbmZvcm1TZWFyY2goeyBkZXRhaWwgfSkge1xuICAgICAgICB0aGlzLnNldERhdGEhKHtcbiAgICAgICAgICAgIHNlYXJjaDogZGV0YWlsLFxuICAgICAgICAgICAgY2FuTG9hZE1vcmU6IHRydWVcbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMuZmV0Y2hEYXRhKCApO1xuICAgIH0sXG5cbiAgICAvKiog5ouJ5Y+W5YiX6KGoICovXG4gICAgZmV0Y2hEYXRhKCApIHtcblxuICAgICAgICBjb25zdCB7IGNhbkxvYWRNb3JlLCBsb2FkaW5nTGlzdCwgbGFzdFNlYXJjaCwgc2VhcmNoIH0gPSB0aGlzLmRhdGE7XG5cbiAgICAgICAgaWYgKCBsb2FkaW5nTGlzdCB8fCAhY2FuTG9hZE1vcmUgKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIHNlYXJjaC5yZXBsYWNlKC9cXHMrL2csIFwiXCIpICE9PSBsYXN0U2VhcmNoICkge1xuICAgICAgICAgICAgdGhpcy5zZXREYXRhISh7XG4gICAgICAgICAgICAgICAgcGFnZTogMCxcbiAgICAgICAgICAgICAgICB0b3RhbFBhZ2U6IDFcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5zZXREYXRhISh7XG4gICAgICAgICAgICBsb2FkaW5nTGlzdDogdHJ1ZVxuICAgICAgICB9KTtcblxuICAgICAgICBodHRwKHtcbiAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICBwYWdlOiB0aGlzLmRhdGEucGFnZSArIDEsXG4gICAgICAgICAgICAgICAgdGl0bGU6IHRoaXMuZGF0YS5zZWFyY2hcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBlcnJNc2c6ICfliqDovb3lpLHotKXvvIzor7fph43or5UnLFxuICAgICAgICAgICAgbG9hZGluZ01zZzogJ+WKoOi9veS4rS4uLicsXG4gICAgICAgICAgICB1cmw6IGB0cmlwX2xpc3RgLFxuICAgICAgICAgICAgc3VjY2VzczogcmVzID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCB7IHN0YXR1cywgZGF0YSB9ID0gcmVzO1xuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIGlmICggc3RhdHVzID09PSAyMDAgKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHsgcGFnZSwgdG90YWxQYWdlLCBzZWFyY2ggfSA9IGRhdGE7XG4gICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICB0aGlzLnNldERhdGEhKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHBhZ2UsXG4gICAgICAgICAgICAgICAgICAgICAgICB0b3RhbFBhZ2UsXG4gICAgICAgICAgICAgICAgICAgICAgICBsYXN0U2VhcmNoOiBzZWFyY2ggfHwgJycsXG4gICAgICAgICAgICAgICAgICAgICAgICBjYW5Mb2FkTW9yZTogdG90YWxQYWdlID4gcGFnZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGlzTm90QXZhaWxhYmxlVHJpcDogIWRhdGEuZGF0YS5zb21lKCB4ID0+IHgucHVibGlzaGVkID09PSB0cnVlICYmIG5ldyBEYXRlKCApLmdldFRpbWUoICkgPCB4LnN0YXJ0X2RhdGUgKVxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgIGlmICggZGF0YS5kYXRhICYmIGRhdGEuZGF0YS5sZW5ndGggPiAwICkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgbWV0YSA9IHBhZ2UgPT09IDEgP1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmRlYWxMaXN0VGV4dCggZGF0YS5kYXRhICk6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgWyAuLi50aGlzLmRhdGEubGlzdCwgLi4udGhpcy5kZWFsTGlzdFRleHQoIGRhdGEuZGF0YSApXTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zZXREYXRhISh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGlzdDogbWV0YVxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnNldERhdGEhKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsaXN0OiBbIF1cbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIHRoaXMuc2V0RGF0YSEoe1xuICAgICAgICAgICAgICAgICAgICBsb2FkaW5nTGlzdDogZmFsc2VcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfSxcblxuICAgIC8qKiDnvJbovpHooYznqIvliJfooajmloflrZcgKi9cbiAgICBkZWFsTGlzdFRleHQoIGxpc3QgKSB7XG5cbiAgICAgICAgY29uc3Qgc2ltcGxlVGltZSA9ICh0czogbnVtYmVyKSA9PiB7XG4gICAgICAgICAgICBjb25zdCB0aW1lID0gbmV3IERhdGUoIE51bWJlciggdHMgKSk7XG4gICAgICAgICAgICByZXR1cm4gYCR7dGltZS5nZXRNb250aCggKSsxfeaciCR7dGltZS5nZXREYXRlKCApfeaXpWBcbiAgICAgICAgfTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogISDms6jmhI/vvIzml7bpl7Tlr7nmr5TjgILlvIDlp4vml7bpl7TmmK8g5oyH5a6a5pel5pyf55qE5pep5LiKOOeCue+8m+e7k+adn+aXpeacn+aYryDmjIflrprml6XmnJ/nmoTmmZrkuIoyNDowMFxuICAgICAgICAgKi9cbiAgICAgICAgcmV0dXJuIGxpc3QubWFwKCB4ID0+IHtcbiAgICAgICAgICAgIGNvbnN0IHsgX2lkLCB0aXRsZSwgc2FsZXNfdm9sdW1lLCBzdGFydF9kYXRlLCBwdWJsaXNoZWQsIGVuZF9kYXRlLCBvcmRlcnMgfSA9IHg7XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIF9pZCxcbiAgICAgICAgICAgICAgICB0aXRsZSxcbiAgICAgICAgICAgICAgICBzYWxlc192b2x1bWUsXG4gICAgICAgICAgICAgICAgb3JkZXJzLFxuICAgICAgICAgICAgICAgIGVuZERhdGE6IHNpbXBsZVRpbWUoIGVuZF9kYXRlICksXG4gICAgICAgICAgICAgICAgc3RhcnREYXRlOiBzaW1wbGVUaW1lKCBzdGFydF9kYXRlICksXG4gICAgICAgICAgICAgICAgc3RhdGU6ICFwdWJsaXNoZWQgP1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICfmnKrlj5HluIMnIDpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXcgRGF0ZSggKS5nZXRUaW1lKCApID49IGVuZF9kYXRlID9cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ+W3sue7k+adnycgOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXcgRGF0ZSggKS5nZXRUaW1lKCApID49IHN0YXJ0X2RhdGUgP1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ+i/m+ihjOS4rScgOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ+WNs+WwhuW8gOWniydcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSlcbiAgICB9LFxuXG4gICAgLyoqIOaQnOe0oui+k+WFpSAqL1xuICAgIG9uSW5wdXQoeyBkZXRhaWwgfSkge1xuICAgICAgICB0aGlzLnNldERhdGEhKHtcbiAgICAgICAgICAgIHNlYXJjaDogZGV0YWlsLnZhbHVlLFxuICAgICAgICAgICAgY2FuTG9hZE1vcmU6IGRldGFpbC52YWx1ZS5yZXBsYWNlKC9cXHMrL2csIFwiXCIpICE9PSB0aGlzLmRhdGEubGFzdFNlYXJjaFxuICAgICAgICB9KTtcbiAgICB9LFxuXG4gICAgLyoqIOeCueWHu+ivpuaDhSAqL1xuICAgIG9uVGFiKHsgY3VycmVudFRhcmdldCB9KSB7XG4gICAgICAgIGNvbnN0IHsgdGlkIH0gPSBjdXJyZW50VGFyZ2V0LmRhdGFzZXQ7XG4gICAgICAgIHd4Lm5hdmlnYXRlVG8oe1xuICAgICAgICAgICAgLy8gdXJsOiBgL3BhZ2VzL3RyaXAtZGV0YWlsL2luZGV4P2lkPSR7dGlkfWBcbiAgICAgICAgICAgIHVybDogYC9wYWdlcy9tYW5hZ2VyLXRyaXAtZGV0YWlsL2luZGV4P2lkPSR7dGlkfWBcbiAgICAgICAgfSk7XG4gICAgfSxcbiAgXG4gICAgLyoqXG4gICAgICog55Sf5ZG95ZGo5pyf5Ye95pWwLS3nm5HlkKzpobXpnaLliqDovb1cbiAgICAgKi9cbiAgICBvbkxvYWQ6IGZ1bmN0aW9uICggKSB7XG4gICAgICAgIHd4LmhpZGVTaGFyZU1lbnUoeyB9KTtcbiAgICB9LFxuICBcbiAgICAvKipcbiAgICAgKiDnlJ/lkb3lkajmnJ/lh73mlbAtLeebkeWQrOmhtemdouWIneasoea4suafk+WujOaIkFxuICAgICAqL1xuICAgIG9uUmVhZHk6IGZ1bmN0aW9uICggKSB7XG4gIFxuICAgIH0sXG4gIFxuICAgIC8qKlxuICAgICAqIOeUn+WRveWRqOacn+WHveaVsC0t55uR5ZCs6aG16Z2i5pi+56S6XG4gICAgICovXG4gICAgb25TaG93OiBmdW5jdGlvbiAoICkge1xuICAgICAgICB0aGlzLmZldGNoRGF0YSggKTtcbiAgICB9LFxuICBcbiAgICAvKipcbiAgICAgKiDnlJ/lkb3lkajmnJ/lh73mlbAtLeebkeWQrOmhtemdoumakOiXj1xuICAgICAqL1xuICAgIG9uSGlkZTogZnVuY3Rpb24gKCApIHtcbiAgXG4gICAgfSxcbiAgXG4gICAgLyoqXG4gICAgICog55Sf5ZG95ZGo5pyf5Ye95pWwLS3nm5HlkKzpobXpnaLljbjovb1cbiAgICAgKi9cbiAgICBvblVubG9hZDogZnVuY3Rpb24gKCApIHtcbiAgXG4gICAgfSxcbiAgXG4gICAgLyoqXG4gICAgICog6aG16Z2i55u45YWz5LqL5Lu25aSE55CG5Ye95pWwLS3nm5HlkKznlKjmiLfkuIvmi4nliqjkvZxcbiAgICAgKi9cbiAgICBvblB1bGxEb3duUmVmcmVzaDogZnVuY3Rpb24gKCApIHtcbiAgXG4gICAgfSxcbiAgXG4gICAgLyoqXG4gICAgICog6aG16Z2i5LiK5ouJ6Kem5bqV5LqL5Lu255qE5aSE55CG5Ye95pWwXG4gICAgICovXG4gICAgb25SZWFjaEJvdHRvbTogZnVuY3Rpb24gKCApIHtcbiAgXG4gICAgfSxcbiAgXG4gICAgLyoqXG4gICAgICog55So5oi354K55Ye75Y+z5LiK6KeS5YiG5LqrXG4gICAgICovXG4gICAgLy8gb25TaGFyZUFwcE1lc3NhZ2U6IGZ1bmN0aW9uICgpIHtcbiAgXG4gICAgLy8gfVxufSkiXX0=