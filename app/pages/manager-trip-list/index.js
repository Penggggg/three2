"use strict";
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
        wx.showLoading({
            title: '加载中...',
        });
        wx.cloud.callFunction({
            name: 'api-trip-list',
            data: {
                page: this.data.page + 1,
                title: this.data.search
            },
            success: function (res) {
                var _a = res.result, status = _a.status, data = _a.data;
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
            },
            fail: function () {
                wx.showToast({
                    icon: 'none',
                    title: '获取行程错误',
                });
                _this.setData({
                    loadingList: false
                });
            },
            complete: function () {
                wx.hideLoading({});
            }
        });
    },
    dealListText: function (list) {
        return list.map(function (x) {
            var _id = x._id, title = x.title, sales_volume = x.sales_volume, start_date = x.start_date, published = x.published, end_date = x.end_date;
            return {
                _id: _id,
                title: title,
                sales_volume: sales_volume,
                orders: 0,
                startDate: new Date(start_date).toLocaleDateString(),
                state: !published ?
                    '未发布' :
                    new Date().getTime() >= end_date ?
                        '已结束' :
                        '已开始'
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQ0EsSUFBSSxDQUFDO0lBTUQsSUFBSSxFQUFFO1FBRUYsSUFBSSxFQUFFLENBQUM7UUFFUCxTQUFTLEVBQUUsQ0FBQztRQUVaLE1BQU0sRUFBRSxFQUFFO1FBRVYsSUFBSSxFQUFFLEVBQUc7UUFFVCxXQUFXLEVBQUUsS0FBSztRQUVsQixXQUFXLEVBQUUsSUFBSTtRQUVqQixVQUFVLEVBQUUsRUFBRTtRQUVkLGtCQUFrQixFQUFFLEtBQUs7S0FDNUI7SUFHRCxRQUFRLFlBQUUsQ0FBQztRQUNQLEVBQUUsQ0FBQyxVQUFVLENBQUM7WUFDVixHQUFHLEVBQUUsa0NBQWtDO1NBQzFDLENBQUMsQ0FBQztJQUNQLENBQUM7SUFHRCxTQUFTO1FBQVQsaUJBMkVDO1FBekVTLElBQUEsY0FBNEQsRUFBMUQsNEJBQVcsRUFBRSw0QkFBVyxFQUFFLDBCQUFVLEVBQUUsa0JBQW9CLENBQUM7UUFFbkUsSUFBSyxXQUFXLElBQUksQ0FBQyxXQUFXLEVBQUc7WUFDL0IsT0FBTztTQUNWO1FBRUQsSUFBSyxNQUFNLENBQUMsT0FBTyxDQUFDLE1BQU0sRUFBRSxFQUFFLENBQUMsS0FBSyxVQUFVLEVBQUc7WUFDN0MsSUFBSSxDQUFDLE9BQVEsQ0FBQztnQkFDVixJQUFJLEVBQUUsQ0FBQztnQkFDUCxTQUFTLEVBQUUsQ0FBQzthQUNmLENBQUMsQ0FBQztTQUNOO1FBRUQsSUFBSSxDQUFDLE9BQVEsQ0FBQztZQUNWLFdBQVcsRUFBRSxJQUFJO1NBQ3BCLENBQUMsQ0FBQztRQUVILEVBQUUsQ0FBQyxXQUFXLENBQUM7WUFDWCxLQUFLLEVBQUUsUUFBUTtTQUNsQixDQUFDLENBQUM7UUFFSCxFQUFFLENBQUMsS0FBSyxDQUFDLFlBQVksQ0FBQztZQUNsQixJQUFJLEVBQUUsZUFBZTtZQUNyQixJQUFJLEVBQUU7Z0JBQ0YsSUFBSSxFQUFFLElBQUksQ0FB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QUNWLE1BQU0sRUFBRSxNQUFNLENBQUMsS0FBSztZQUNwQixXQUFXLEVBQUUsTUFBTSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsTUFBTSxFQUFFLEVBQUUsQ0FBQyxLQUFLLElBQUksQ0FBQyxJQUFJLENBQUMsVUFBVTtTQUN6RSxDQUFDLENBQUM7SUFDUCxDQUFDO0lBR0QsS0FBSyxZQUFDLEVBQWlCO1lBQWYsZ0NBQWE7UUFDVCxJQUFBLCtCQUFHLENBQTJCO1FBQ3RDLEVBQUUsQ0FBQyxVQUFVLENBQUM7WUFFVixHQUFHLEVBQUUseUNBQXVDLEdBQUs7U0FDcEQsQ0FBQyxDQUFDO0lBQ1AsQ0FBQztJQUtELE1BQU0sRUFBRTtJQUVSLENBQUM7SUFLRCxPQUFPLEVBQUU7SUFFVCxDQUFDO0lBS0QsTUFBTSxFQUFFO1FBQ0osSUFBSSxDQUFDLFNBQVMsRUFBRyxDQUFDO0lBQ3RCLENBQUM7SUFLRCxNQUFNLEVBQUU7SUFFUixDQUFDO0lBS0QsUUFBUSxFQUFFO0lBRVYsQ0FBQztJQUtELGlCQUFpQixFQUFFO0lBRW5CLENBQUM7SUFLRCxhQUFhLEVBQUU7SUFFZixDQUFDO0NBUUosQ0FBQyxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiLy8gYXBwL3BhZ2VzL21hbmFnZXItZ29vZHMtZGV0YWlsL2luZGV4LmpzXG5QYWdlKHtcblxuICAgIC8qKlxuICAgICAqIOmhtemdoueahOWIneWni+aVsOaNrlxuICAgICAqICEg5YiX6KGo5bGV56S657u05bqm77ya5ZCN56ew44CB6ZSA5ZSu6aKd44CB6K6i5Y2V5pWw44CB54q25oCB44CB5byA5aeL5pe26Ze0XG4gICAgICovXG4gICAgZGF0YToge1xuICAgICAgICAvLyDlvZPliY3pobXnoIFcbiAgICAgICAgcGFnZTogMCxcbiAgICAgICAgLy8g5oC76aG15pWwXG4gICAgICAgIHRvdGFsUGFnZTogMSxcbiAgICAgICAgLy8g5pCc57SiXG4gICAgICAgIHNlYXJjaDogJycsXG4gICAgICAgIC8vIOWVhuWTgeWIl+ihqFxuICAgICAgICBsaXN0OiBbIF0sXG4gICAgICAgIC8vIOWKoOi9veWIl+ihqGluZ1xuICAgICAgICBsb2FkaW5nTGlzdDogZmFsc2UsXG4gICAgICAgIC8vIOiDveWQpue7p+e7reWKoOi9vVxuICAgICAgICBjYW5Mb2FkTW9yZTogdHJ1ZSxcbiAgICAgICAgLy8g5LiK5qyh5pCc57Si55qE5paH5pysXG4gICAgICAgIGxhc3RTZWFyY2g6ICcnLFxuICAgICAgICAvLyDmmK/lkKblt7Lnu4/msqHmnInkuIvkuIDkuKrlj6/nlKjooYznqItcbiAgICAgICAgaXNOb3RBdmFpbGFibGVUcmlwOiBmYWxzZVxuICAgIH0sXG5cbiAgICAvKiog6Lez6aG1ICovXG4gICAgbmF2aWdhdGUoIGUgKSB7XG4gICAgICAgIHd4Lm5hdmlnYXRlVG8oe1xuICAgICAgICAgICAgdXJsOiAnL3BhZ2VzL21hbmFnZXItdHJpcC1kZXRhaWwvaW5kZXgnLFxuICAgICAgICB9KTtcbiAgICB9LFxuXG4gICAgLyoqIOaLieWPluWIl+ihqCAqL1xuICAgIGZldGNoRGF0YSggKSB7XG5cbiAgICAgICAgY29uc3QgeyBjYW5Mb2FkTW9yZSwgbG9hZGluZ0xpc3QsIGxhc3RTZWFyY2gsIHNlYXJjaCB9ID0gdGhpcy5kYXRhO1xuXG4gICAgICAgIGlmICggbG9hZGluZ0xpc3QgfHwgIWNhbkxvYWRNb3JlICkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCBzZWFyY2gucmVwbGFjZSgvXFxzKy9nLCBcIlwiKSAhPT0gbGFzdFNlYXJjaCApIHtcbiAgICAgICAgICAgIHRoaXMuc2V0RGF0YSEoe1xuICAgICAgICAgICAgICAgIHBhZ2U6IDAsXG4gICAgICAgICAgICAgICAgdG90YWxQYWdlOiAxXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuc2V0RGF0YSEoe1xuICAgICAgICAgICAgbG9hZGluZ0xpc3Q6IHRydWVcbiAgICAgICAgfSk7XG5cbiAgICAgICAgd3guc2hvd0xvYWRpbmcoe1xuICAgICAgICAgICAgdGl0bGU6ICfliqDovb3kuK0uLi4nLFxuICAgICAgICB9KTtcblxuICAgICAgICB3eC5jbG91ZC5jYWxsRnVuY3Rpb24oe1xuICAgICAgICAgICAgbmFtZTogJ2FwaS10cmlwLWxpc3QnLFxuICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgIHBhZ2U6IHRoaXMuZGF0YS5wYWdlICsgMSxcbiAgICAgICAgICAgICAgICB0aXRsZTogdGhpcy5kYXRhLnNlYXJjaFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHN1Y2Nlc3M6IChyZXM6IGFueSkgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IHsgc3RhdHVzLCBkYXRhIH0gPSByZXMucmVzdWx0O1xuICAgICAgICAgICAgICAgIGlmICggc3RhdHVzID09PSAyMDAgKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHsgcGFnZSwgdG90YWxQYWdlLCBzZWFyY2ggfSA9IGRhdGE7XG4gICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICB0aGlzLnNldERhdGEhKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHBhZ2UsXG4gICAgICAgICAgICAgICAgICAgICAgICB0b3RhbFBhZ2UsXG4gICAgICAgICAgICAgICAgICAgICAgICBsYXN0U2VhcmNoOiBzZWFyY2ggfHwgJycsXG4gICAgICAgICAgICAgICAgICAgICAgICBjYW5Mb2FkTW9yZTogdG90YWxQYWdlID4gcGFnZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGlzTm90QXZhaWxhYmxlVHJpcDogIWRhdGEuZGF0YS5zb21lKCB4ID0+IHgucHVibGlzaGVkID09PSB0cnVlICYmIG5ldyBEYXRlKCApLmdldFRpbWUoICkgPCB4LnN0YXJ0X2RhdGUgKVxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgIGlmICggZGF0YS5kYXRhICYmIGRhdGEuZGF0YS5sZW5ndGggPiAwICkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgbWV0YSA9IHBhZ2UgPT09IDEgP1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmRlYWxMaXN0VGV4dCggZGF0YS5kYXRhICk6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgWyAuLi50aGlzLmRhdGEubGlzdCwgLi4udGhpcy5kZWFsTGlzdFRleHQoIGRhdGEuZGF0YSApXTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zZXREYXRhISh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGlzdDogbWV0YVxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnNldERhdGEhKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsaXN0OiBbIF1cbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIHRoaXMuc2V0RGF0YSEoe1xuICAgICAgICAgICAgICAgICAgICBsb2FkaW5nTGlzdDogZmFsc2VcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBmYWlsOiAoICkgPT4ge1xuICAgICAgICAgICAgICAgIHd4LnNob3dUb2FzdCh7XG4gICAgICAgICAgICAgICAgICAgIGljb246ICdub25lJyxcbiAgICAgICAgICAgICAgICAgICAgdGl0bGU6ICfojrflj5booYznqIvplJnor68nLFxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIHRoaXMuc2V0RGF0YSEoe1xuICAgICAgICAgICAgICAgICAgICBsb2FkaW5nTGlzdDogZmFsc2VcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBjb21wbGV0ZTogKCApID0+IHtcbiAgICAgICAgICAgICAgICB3eC5oaWRlTG9hZGluZyh7IH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9LFxuXG4gICAgLyoqIOe8lui+keihjOeoi+WIl+ihqOaWh+WtlyAqL1xuICAgIGRlYWxMaXN0VGV4dCggbGlzdCApIHtcbiAgICAgICAgLyoqXG4gICAgICAgICAqICEg5rOo5oSP77yM5pe26Ze05a+55q+U44CC5byA5aeL5pe26Ze05pivIOaMh+WumuaXpeacn+eahOaXqeS4ijjngrnvvJvnu5PmnZ/ml6XmnJ/mmK8g5oyH5a6a5pel5pyf55qE5pma5LiKMjQ6MDBcbiAgICAgICAgICovXG4gICAgICAgIHJldHVybiBsaXN0Lm1hcCggeCA9PiB7XG4gICAgICAgICAgICBjb25zdCB7IF9pZCwgdGl0bGUsIHNhbGVzX3ZvbHVtZSwgc3RhcnRfZGF0ZSwgcHVibGlzaGVkLCBlbmRfZGF0ZSB9ID0geDtcbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgX2lkLFxuICAgICAgICAgICAgICAgIHRpdGxlLFxuICAgICAgICAgICAgICAgIHNhbGVzX3ZvbHVtZSxcbiAgICAgICAgICAgICAgICBvcmRlcnM6IDAsXG4gICAgICAgICAgICAgICAgc3RhcnREYXRlOiBuZXcgRGF0ZSggc3RhcnRfZGF0ZSApLnRvTG9jYWxlRGF0ZVN0cmluZyggKSxcbiAgICAgICAgICAgICAgICBzdGF0ZTogIXB1Ymxpc2hlZCA/XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJ+acquWPkeW4gycgOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5ldyBEYXRlKCApLmdldFRpbWUoICkgPj0gZW5kX2RhdGUgP1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAn5bey57uT5p2fJyA6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICflt7LlvIDlp4snXG4gICAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgfSxcblxuICAgIC8qKiDmkJzntKLovpPlhaUgKi9cbiAgICBvbklucHV0KHsgZGV0YWlsIH0pIHtcbiAgICAgICAgdGhpcy5zZXREYXRhISh7XG4gICAgICAgICAgICBzZWFyY2g6IGRldGFpbC52YWx1ZSxcbiAgICAgICAgICAgIGNhbkxvYWRNb3JlOiBkZXRhaWwudmFsdWUucmVwbGFjZSgvXFxzKy9nLCBcIlwiKSAhPT0gdGhpcy5kYXRhLmxhc3RTZWFyY2hcbiAgICAgICAgfSk7XG4gICAgfSxcblxuICAgIC8qKiDngrnlh7vor6bmg4UgKi9cbiAgICBvblRhYih7IGN1cnJlbnRUYXJnZXQgfSkge1xuICAgICAgICBjb25zdCB7IHRpZCB9ID0gY3VycmVudFRhcmdldC5kYXRhc2V0O1xuICAgICAgICB3eC5uYXZpZ2F0ZVRvKHtcbiAgICAgICAgICAgIC8vIHVybDogYC9wYWdlcy90cmlwLWRldGFpbC9pbmRleD9pZD0ke3RpZH1gXG4gICAgICAgICAgICB1cmw6IGAvcGFnZXMvbWFuYWdlci10cmlwLWRldGFpbC9pbmRleD9pZD0ke3RpZH1gXG4gICAgICAgIH0pO1xuICAgIH0sXG4gIFxuICAgIC8qKlxuICAgICAqIOeUn+WRveWRqOacn+WHveaVsC0t55uR5ZCs6aG16Z2i5Yqg6L29XG4gICAgICovXG4gICAgb25Mb2FkOiBmdW5jdGlvbiAoICkge1xuICAgIFxuICAgIH0sXG4gIFxuICAgIC8qKlxuICAgICAqIOeUn+WRveWRqOacn+WHveaVsC0t55uR5ZCs6aG16Z2i5Yid5qyh5riy5p+T5a6M5oiQXG4gICAgICovXG4gICAgb25SZWFkeTogZnVuY3Rpb24gKCApIHtcbiAgXG4gICAgfSxcbiAgXG4gICAgLyoqXG4gICAgICog55Sf5ZG95ZGo5pyf5Ye95pWwLS3nm5HlkKzpobXpnaLmmL7npLpcbiAgICAgKi9cbiAgICBvblNob3c6IGZ1bmN0aW9uICggKSB7XG4gICAgICAgIHRoaXMuZmV0Y2hEYXRhKCApO1xuICAgIH0sXG4gIFxuICAgIC8qKlxuICAgICAqIOeUn+WRveWRqOacn+WHveaVsC0t55uR5ZCs6aG16Z2i6ZqQ6JePXG4gICAgICovXG4gICAgb25IaWRlOiBmdW5jdGlvbiAoICkge1xuICBcbiAgICB9LFxuICBcbiAgICAvKipcbiAgICAgKiDnlJ/lkb3lkajmnJ/lh73mlbAtLeebkeWQrOmhtemdouWNuOi9vVxuICAgICAqL1xuICAgIG9uVW5sb2FkOiBmdW5jdGlvbiAoICkge1xuICBcbiAgICB9LFxuICBcbiAgICAvKipcbiAgICAgKiDpobXpnaLnm7jlhbPkuovku7blpITnkIblh73mlbAtLeebkeWQrOeUqOaIt+S4i+aLieWKqOS9nFxuICAgICAqL1xuICAgIG9uUHVsbERvd25SZWZyZXNoOiBmdW5jdGlvbiAoICkge1xuICBcbiAgICB9LFxuICBcbiAgICAvKipcbiAgICAgKiDpobXpnaLkuIrmi4nop6blupXkuovku7bnmoTlpITnkIblh73mlbBcbiAgICAgKi9cbiAgICBvblJlYWNoQm90dG9tOiBmdW5jdGlvbiAoICkge1xuICBcbiAgICB9LFxuICBcbiAgICAvKipcbiAgICAgKiDnlKjmiLfngrnlh7vlj7PkuIrop5LliIbkuqtcbiAgICAgKi9cbiAgICAvLyBvblNoYXJlQXBwTWVzc2FnZTogZnVuY3Rpb24gKCkge1xuICBcbiAgICAvLyB9XG59KSJdfQ==