"use strict";
Page({
    data: {
        page: 0,
        totalPage: 1,
        search: '',
        list: [],
        stockNeed: [],
        loadingList: false,
        canLoadMore: true,
        lastSearch: ''
    },
    navigate: function (e) {
        wx.navigateTo({
            url: e.currentTarget.dataset.url || '/pages/manager-goods-detail/index',
        });
    },
    fetchData: function () {
        var that = this;
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
            name: 'api-goods-list',
            data: {
                page: this.data.page + 1,
                title: this.data.search
            },
            success: function (res) {
                console.log(res.result.data);
                var _a = res.result, status = _a.status, data = _a.data;
                if (status === 200) {
                    var page = data.page, totalPage = data.totalPage, search_1 = data.search;
                    that.setData({
                        page: page,
                        totalPage: totalPage,
                        lastSearch: search_1 || '',
                        canLoadMore: totalPage > page
                    });
                    if (data.data && data.data.length > 0) {
                        var meta = page === 1 ?
                            that.dealListText(data.data) : that.data.list.concat(that.dealListText(data.data));
                        that.setData({
                            list: meta
                        });
                    }
                    else {
                        that.setData({
                            list: []
                        });
                    }
                }
                wx.hideLoading({});
                that.setData({
                    loadingList: false
                });
            },
            fail: function () {
                wx.showToast({
                    icon: 'none',
                    title: '获取数据错误',
                });
                wx.hideLoading({});
                that.setData({
                    loadingList: false
                });
            }
        });
    },
    onInput: function (_a) {
        var detail = _a.detail;
        this.setData({
            search: detail.value,
            canLoadMore: detail.value.replace(/\s+/g, "") !== this.data.lastSearch
        });
    },
    dealListText: function (list) {
        var that = this;
        return list.map(function (x) {
            var stock = x.stock;
            var price = x.price;
            if (x.standards.length === 1) {
                stock = x.standards[0].stock;
                price = x.standards[0].price;
            }
            else if (x.standards.length > 1) {
                var sortedPrice = x.standards.sort(function (x, y) { return x.price - y.price; });
                if (sortedPrice[0].price === sortedPrice[sortedPrice.length - 1].price) {
                    price = sortedPrice[0].price;
                }
                else {
                    price = sortedPrice[0].price + "~" + sortedPrice[sortedPrice.length - 1].price;
                }
                var sortedStock = x.standards.filter(function (i) { return i.stock !== undefined && i.stock !== null; }).sort(function (x, y) { return x.stock - y.stock; });
                if (sortedStock.length === 1) {
                    stock = "" + sortedStock[0].stock;
                }
                else if (sortedStock.length > 1) {
                    if (sortedStock[0].stock === sortedStock[sortedStock.length - 1].stock) {
                        stock = "" + sortedStock[0].stock;
                    }
                    else {
                        stock = sortedStock[0].stock + "~" + sortedStock[sortedStock.length - 1].stock;
                    }
                }
            }
            var origin = that.data.stockNeed.slice();
            origin.push(((stock !== undefined) && (Number(stock.split('~')[0]) < 10)));
            that.setData({
                stockNeed: origin
            });
            return Object.assign({}, x, {
                stock: stock,
                price: price
            });
        });
    },
    onTab: function (_a) {
        var currentTarget = _a.currentTarget;
        var pid = currentTarget.dataset.pid;
        wx.navigateTo({
            url: "/pages/goods-detail/index?id=" + pid
        });
    },
    onLoad: function (options) {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQ0EsSUFBSSxDQUFDO0lBS0QsSUFBSSxFQUFFO1FBRUYsSUFBSSxFQUFFLENBQUM7UUFFUCxTQUFTLEVBQUUsQ0FBQztRQUVaLE1BQU0sRUFBRSxFQUFFO1FBRVYsSUFBSSxFQUFFLEVBQUc7UUFFVCxTQUFTLEVBQUUsRUFBRztRQUVkLFdBQVcsRUFBRSxLQUFLO1FBRWxCLFdBQVcsRUFBRSxJQUFJO1FBRWpCLFVBQVUsRUFBRSxFQUFFO0tBQ2pCO0lBR0QsUUFBUSxZQUFFLENBQUM7UUFDUCxFQUFFLENBQUMsVUFBVSxDQUFDO1lBQ1YsR0FBRyxFQUFFLENBQUMsQ0FBQyxhQUFhLENBQUMsT0FBTyxDQUFDLEdBQUcsSUFBSSxtQ0FBbUM7U0FDMUUsQ0FBQyxDQUFBO0lBQ04sQ0FBQztJQUdELFNBQVM7UUFDTCxJQUFNLElBQUksR0FBRyxJQUFJLENBQUM7UUFDWixJQUFBLGNBQTRELEVBQTFELDRCQUFXLEVBQUUsNEJBQVcsRUFBRSwwQkFBVSxFQUFFLGtCQUFvQixDQUFDO1FBRW5FLElBQUssV0FBVyxJQUFJLENBQUMsV0FBVyxFQUFHO1lBQy9CLE9BQU87U0FDVjtRQUVELElBQUssTUFBTSxDQUFDLE9BQU8sQ0FBQyxNQUFNLEVBQUUsRUFBRSxDQUFDLEtBQUssVUFBVSxFQUFHO1lBQzdDLElBQUksQ0FBQyxPQUFRLENBQUM7Z0JBQ1YsSUFBSSxFQUFFLENBQUM7Z0JBQ1AsU0FBUyxFQUFFLENBQUM7YUFDZixDQUFDLENBQUM7U0FDTjtRQUVELElBQUksQ0FBQyxPQUFRLENBQUM7WUFDVixXQUFXLEVBQUUsSUFBSTtTQUNwQixDQUFDLENBQUM7UUFFSCxFQUFFLENBQUMsV0FBVyxDQUFDO1lBQ1gsS0FBSyxFQUFFLFFBQVE7U0FDbEIsQ0FBQyxDQUFDO1FBRUgsRUFBRSxDQUFDLEtBQUssQ0FBQyxZQUFZLENBQUM7WUFDbEIsSUFBSSxFQUFFLGdCQUFnQjtZQUN0QixJQUFJLEVBQUU7Z0JBQ0YsSUFBSSxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxHQUFHLENBQUM7Z0JBQ3hCLEtBQUssRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU07YUFDMUI7WUFDRCxPQUFPLEVBQUUsVUFBVyxHQUFRO2dCQUN4QixPQUFPLENBQUMsR0FBRyxDQUFFLEdBQUcsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFFLENBQUE7Z0JBQ3hCLElBQUEsZUFBNkIsRUFBM0Isa0JBQU0sRUFBRSxjQUFtQixDQUFDO2dCQUNwQyxJQUFLLE1BQU0sS0FBSyxHQUFHLEVBQUc7b0JBQ1YsSUFBQSxnQkFBSSxFQUFFLDBCQUFTLEVBQUUsc0JBQU0sQ0FBVTtvQkFDekMsSUFBSSxDQUFDLE9BQVEsQ0FBQzt3QkFDVixJQUFJLE1BQUE7d0JBQ0osU0FBUyxXQUFBO3dCQUNULFVBQVUsRUFBRSxRQUFNLElBQUksRUFBRTt3QkFDeEIsV0FBVyxFQUFFLFNBQVMsR0FBRyxJQUFJO3FCQUNoQyxDQUFDLENBQUM7b0JBRUgsSUFBSyxJQUFJLENBQUMsSUFBSSxJQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRzt3QkFDckMsSUFBTSxJQUFJLEdBQUcsSUFBSSxLQUFLLENBQUMsQ0FBQyxDQUFDOzRCQUNyQixJQUFJLENBQUMsWUFBWSxDQUFFLElBQUksQ0FBQyxJQUFJLENBQUUsQ0FBQyxDQUFDLENBQzNCLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxRQUFLLElBQUksQ0FBQyxZQUFZLENBQUUsSUFBSSxDQUFDLElBQUksQ0FBRSxDQUFDLENBQUM7d0JBRTVELElBQUksQ0FBQyxPQUFRLENBQUM7NEJBQ1YsSUFBSSxFQUFFLElBQUk7eUJBQ2IsQ0FBQyxDQUFDO3FCQUNOO3lCQUFNO3dCQUNILElBQUksQ0FBQyxPQUFRLENBQUM7NEJBQ1YsSUFBSSxFQUFFLEVBQUc7eUJBQ1osQ0FBQyxDQUFDO3FCQUNOO2lCQUVKO2dCQUNELEVBQUUsQ0FBQyxXQUFXLENBQUMsRUFBRyxDQUFDLENBQUM7Z0JBQ3BCLElBQUksQ0FBQyxPQUFRLENBQUM7b0JBQ1YsV0FBVyxFQUFFLEtBQUs7aUJBQ3JCLENBQUMsQ0FBQztZQUNQLENBQUM7WUFDRCxJQUFJLEVBQUU7Z0JBQ0YsRUFBRSxDQUFDLFNBQVMsQ0FBQztvQkFDVCxJQUFJLEVBQUUsTUFBTTtvQkFDWixLQUFLLEVBQUUsUUFBUTtpQkFDbEIsQ0FBQyxDQUFDO2dCQUNILEVBQUUsQ0FBQyxXQUFXLENBQUMsRUFBRyxDQUFDLENBQUM7Z0JBQ3BCLElBQUksQ0FBQyxPQUFRLENBQUM7b0JBQ1YsV0FBVyxFQUFFLEtBQUs7aUJBQ3JCLENBQUMsQ0FBQztZQUNQLENBQUM7U0FDSixDQUFDLENBQUM7SUFDUCxDQUFDO0lBR0QsT0FBTyxZQUFDLEVBQVU7WUFBUixrQkFBTTtRQUNaLElBQUksQ0FBQyxPQUFRLENBQUM7WUFDVixNQUFNLEVBQUUsTUFBTSxDQUFDLEtBQUs7WUFDcEIsV0FBVyxFQUFFLE1BQU0sQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLE1BQU0sRUFBRSxFQUFFLENBQUMsS0FBSyxJQUFJLENBQUMsSUFBSSxDQUFDLFVBQVU7U0FDekUsQ0FBQyxDQUFDO0lBQ1AsQ0FBQztJQUdELFlBQVksWUFBRSxJQUFJO1FBQ2QsSUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDO1FBRWxCLE9BQU8sSUFBSSxDQUFDLEdBQUcsQ0FBRSxVQUFBLENBQUM7WUFHZCxJQUFJLEtBQUssR0FBRyxDQUFDLENBQUMsS0FBSyxDQUFDO1lBQ3BCLElBQUksS0FBSyxHQUFHLENBQUMsQ0FBQyxLQUFLLENBQUM7WUFHcEIsSUFBSyxDQUFDLENBQUMsU0FBUyxDQUFDLE1BQU0sS0FBSyxDQUFDLEVBQUc7Z0JBRTVCLEtBQUssR0FBRyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQztnQkFDN0IsS0FBSyxHQUFHLENBQUMsQ0FBQyxTQUFTLENBQUUsQ0FBQyxDQUFFLENBQUMsS0FBSyxDQUFDO2FBR2xDO2lCQUFNLElBQUssQ0FBQyxDQUFDLFNBQVMsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFHO2dCQUdqQyxJQUFNLFdBQVcsR0FBRyxDQUFDLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxVQUFFLENBQUMsRUFBRSxDQUFDLElBQU0sT0FBQSxDQUFDLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQyxLQUFLLEVBQWpCLENBQWlCLENBQUUsQ0FBQztnQkFDckUsSUFBSyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxLQUFLLFdBQVcsQ0FBQyxXQUFXLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBRSxDQUFDLEtBQUssRUFBRztvQkFDdkUsS0FBSyxHQUFHLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUM7aUJBQ2hDO3FCQUFNO29CQUNILEtBQUssR0FBTSxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxTQUFJLFdBQVcsQ0FBQyxXQUFXLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBRSxDQUFDLEtBQU8sQ0FBQztpQkFDbkY7Z0JBR0QsSUFBTSxXQUFXLEdBQUcsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsVUFBQSxDQUFDLElBQUksT0FBQSxDQUFDLENBQUMsS0FBSyxLQUFLLFNBQVMsSUFBSSxDQUFDLENBQUMsS0FBSyxLQUFLLElBQUksRUFBekMsQ0FBeUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFDLENBQUMsRUFBRSxDQUFDLElBQUssT0FBQSxDQUFDLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQyxLQUFLLEVBQWpCLENBQWlCLENBQUMsQ0FBQztnQkFFekgsSUFBSyxXQUFXLENBQUMsTUFBTSxLQUFLLENBQUMsRUFBRztvQkFDNUIsS0FBSyxHQUFHLEtBQUcsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQU8sQ0FBQztpQkFDckM7cUJBQU0sSUFBSyxXQUFXLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRztvQkFDbkMsSUFBSyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxLQUFLLFdBQVcsQ0FBQyxXQUFXLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDLEtBQUssRUFBRzt3QkFDdEUsS0FBSyxHQUFHLEtBQUcsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQU8sQ0FBQztxQkFDckM7eUJBQU07d0JBQ0gsS0FBSyxHQUFNLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLFNBQUksV0FBVyxDQUFDLFdBQVcsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUMsS0FBTyxDQUFDO3FCQUNsRjtpQkFDRjthQUNKO1lBRUQsSUFBTSxNQUFNLEdBQWEsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLFFBQUUsQ0FBQztZQUMvQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxLQUFLLEtBQUssU0FBUyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUMzRSxJQUFJLENBQUMsT0FBUSxDQUFDO2dCQUNWLFNBQVMsRUFBRSxNQUFNO2FBQ3BCLENBQUMsQ0FBQztZQUNILE9BQU8sTUFBTSxDQUFDLE1BQU0sQ0FBQyxFQUFHLEVBQUUsQ0FBQyxFQUFFO2dCQUN6QixLQUFLLE9BQUE7Z0JBQ0wsS0FBSyxPQUFBO2FBQ1IsQ0FBQyxDQUFDO1FBQ1AsQ0FBQyxDQUFDLENBQUE7SUFDTixDQUFDO0lBR0QsS0FBSyxZQUFDLEVBQWlCO1lBQWYsZ0NBQWE7UUFDVCxJQUFBLCtCQUFHLENBQTJCO1FBQ3RDLEVBQUUsQ0FBQyxVQUFVLENBQUM7WUFFVixHQUFHLEVBQUUsa0NBQWdDLEdBQUs7U0FDN0MsQ0FBQyxDQUFDO0lBQ1AsQ0FBQztJQUtELE1BQU0sRUFBRSxVQUFVLE9BQU87SUFFekIsQ0FBQztJQUtELE9BQU8sRUFBRTtJQUVULENBQUM7SUFLRCxNQUFNLEVBQUU7UUFDTixJQUFJLENBQUMsU0FBUyxFQUFHLENBQUM7SUFDcEIsQ0FBQztJQUtELE1BQU0sRUFBRTtJQUVSLENBQUM7SUFLRCxRQUFRLEVBQUU7SUFFVixDQUFDO0lBS0QsaUJBQWlCLEVBQUU7SUFFbkIsQ0FBQztJQUtELGFBQWEsRUFBRTtJQUVmLENBQUM7Q0FRRixDQUFDLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBhcHAvcGFnZXMvbWFuYWdlci1nb29kcy1saXN0L2luZGV4LmpzXG5QYWdlKHtcblxuICAgIC8qKlxuICAgICAqIOmhtemdoueahOWIneWni+aVsOaNrlxuICAgICAqL1xuICAgIGRhdGE6IHtcbiAgICAgICAgLy8g5b2T5YmN6aG156CBXG4gICAgICAgIHBhZ2U6IDAsXG4gICAgICAgIC8vIOaAu+mhteaVsFxuICAgICAgICB0b3RhbFBhZ2U6IDEsXG4gICAgICAgIC8vIOaQnOe0olxuICAgICAgICBzZWFyY2g6ICcnLFxuICAgICAgICAvLyDllYblk4HliJfooahcbiAgICAgICAgbGlzdDogWyBdLFxuICAgICAgICAvLyDlupPlrZjntKfmgKXliJfooahcbiAgICAgICAgc3RvY2tOZWVkOiBbIF0sXG4gICAgICAgIC8vIOWKoOi9veWIl+ihqGluZ1xuICAgICAgICBsb2FkaW5nTGlzdDogZmFsc2UsXG4gICAgICAgIC8vIOiDveWQpue7p+e7reWKoOi9vVxuICAgICAgICBjYW5Mb2FkTW9yZTogdHJ1ZSxcbiAgICAgICAgLy8g5LiK5qyh5pCc57Si55qE5paH5pysXG4gICAgICAgIGxhc3RTZWFyY2g6ICcnXG4gICAgfSxcbiAgXG4gICAgLyoqIOi3s+mhtSAqL1xuICAgIG5hdmlnYXRlKCBlICkge1xuICAgICAgICB3eC5uYXZpZ2F0ZVRvKHtcbiAgICAgICAgICAgIHVybDogZS5jdXJyZW50VGFyZ2V0LmRhdGFzZXQudXJsIHx8ICcvcGFnZXMvbWFuYWdlci1nb29kcy1kZXRhaWwvaW5kZXgnLFxuICAgICAgICB9KVxuICAgIH0sXG4gIFxuICAgIC8qKiDmi4nlj5bliJfooaggKi9cbiAgICBmZXRjaERhdGEoICkge1xuICAgICAgICBjb25zdCB0aGF0ID0gdGhpcztcbiAgICAgICAgY29uc3QgeyBjYW5Mb2FkTW9yZSwgbG9hZGluZ0xpc3QsIGxhc3RTZWFyY2gsIHNlYXJjaCB9ID0gdGhpcy5kYXRhO1xuXG4gICAgICAgIGlmICggbG9hZGluZ0xpc3QgfHwgIWNhbkxvYWRNb3JlICkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCBzZWFyY2gucmVwbGFjZSgvXFxzKy9nLCBcIlwiKSAhPT0gbGFzdFNlYXJjaCApIHtcbiAgICAgICAgICAgIHRoaXMuc2V0RGF0YSEoe1xuICAgICAgICAgICAgICAgIHBhZ2U6IDAsXG4gICAgICAgICAgICAgICAgdG90YWxQYWdlOiAxXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuc2V0RGF0YSEoe1xuICAgICAgICAgICAgbG9hZGluZ0xpc3Q6IHRydWVcbiAgICAgICAgfSk7XG5cbiAgICAgICAgd3guc2hvd0xvYWRpbmcoe1xuICAgICAgICAgICAgdGl0bGU6ICfliqDovb3kuK0uLi4nLFxuICAgICAgICB9KTtcblxuICAgICAgICB3eC5jbG91ZC5jYWxsRnVuY3Rpb24oe1xuICAgICAgICAgICAgbmFtZTogJ2FwaS1nb29kcy1saXN0JyxcbiAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICBwYWdlOiB0aGlzLmRhdGEucGFnZSArIDEsXG4gICAgICAgICAgICAgICAgdGl0bGU6IHRoaXMuZGF0YS5zZWFyY2hcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbiAoIHJlczogYW55ICkge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCByZXMucmVzdWx0LmRhdGEgKVxuICAgICAgICAgICAgICAgIGNvbnN0IHsgc3RhdHVzLCBkYXRhIH0gPSByZXMucmVzdWx0O1xuICAgICAgICAgICAgICAgIGlmICggc3RhdHVzID09PSAyMDAgKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHsgcGFnZSwgdG90YWxQYWdlLCBzZWFyY2ggfSA9IGRhdGE7XG4gICAgICAgICAgICAgICAgICAgIHRoYXQuc2V0RGF0YSEoe1xuICAgICAgICAgICAgICAgICAgICAgICAgcGFnZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHRvdGFsUGFnZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGxhc3RTZWFyY2g6IHNlYXJjaCB8fCAnJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhbkxvYWRNb3JlOiB0b3RhbFBhZ2UgPiBwYWdlXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgaWYgKCBkYXRhLmRhdGEgJiYgZGF0YS5kYXRhLmxlbmd0aCA+IDAgKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBtZXRhID0gcGFnZSA9PT0gMSA/XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhhdC5kZWFsTGlzdFRleHQoIGRhdGEuZGF0YSApIDpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBbIC4uLnRoYXQuZGF0YS5saXN0LCAuLi50aGF0LmRlYWxMaXN0VGV4dCggZGF0YS5kYXRhICldO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGF0LnNldERhdGEhKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsaXN0OiBtZXRhXG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoYXQuc2V0RGF0YSEoe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxpc3Q6IFsgXVxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB3eC5oaWRlTG9hZGluZyh7IH0pO1xuICAgICAgICAgICAgICAgIHRoYXQuc2V0RGF0YSEoe1xuICAgICAgICAgICAgICAgICAgICBsb2FkaW5nTGlzdDogZmFsc2VcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBmYWlsOiBmdW5jdGlvbiggKSB7XG4gICAgICAgICAgICAgICAgd3guc2hvd1RvYXN0KHtcbiAgICAgICAgICAgICAgICAgICAgaWNvbjogJ25vbmUnLFxuICAgICAgICAgICAgICAgICAgICB0aXRsZTogJ+iOt+WPluaVsOaNrumUmeivrycsXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgd3guaGlkZUxvYWRpbmcoeyB9KTtcbiAgICAgICAgICAgICAgICB0aGF0LnNldERhdGEhKHtcbiAgICAgICAgICAgICAgICAgICAgbG9hZGluZ0xpc3Q6IGZhbHNlXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH0sXG4gIFxuICAgIC8qKiDmkJzntKLovpPlhaUgKi9cbiAgICBvbklucHV0KHsgZGV0YWlsIH0pIHtcbiAgICAgICAgdGhpcy5zZXREYXRhISh7XG4gICAgICAgICAgICBzZWFyY2g6IGRldGFpbC52YWx1ZSxcbiAgICAgICAgICAgIGNhbkxvYWRNb3JlOiBkZXRhaWwudmFsdWUucmVwbGFjZSgvXFxzKy9nLCBcIlwiKSAhPT0gdGhpcy5kYXRhLmxhc3RTZWFyY2hcbiAgICAgICAgfSk7XG4gICAgfSxcblxuICAgIC8qKiDlpITnkIbmlbDmja7liLDliJfooajnmoTmloflrZfmmL7npLogKi9cbiAgICBkZWFsTGlzdFRleHQoIGxpc3QgKSB7XG4gICAgICAgIGNvbnN0IHRoYXQgPSB0aGlzO1xuXG4gICAgICAgIHJldHVybiBsaXN0Lm1hcCggeCA9PiB7XG5cbiAgICAgICAgICAgIC8vIOiuvue9ruWei+WPt+OAgeW6k+WtmOeahOS7t+agvFxuICAgICAgICAgICAgbGV0IHN0b2NrID0geC5zdG9jaztcbiAgICAgICAgICAgIGxldCBwcmljZSA9IHgucHJpY2U7XG5cbiAgICAgICAgICAgIC8vIOWei+WPt+WPquaciTHnp41cbiAgICAgICAgICAgIGlmICggeC5zdGFuZGFyZHMubGVuZ3RoID09PSAxICkge1xuXG4gICAgICAgICAgICAgICAgc3RvY2sgPSB4LnN0YW5kYXJkc1swXS5zdG9jaztcbiAgICAgICAgICAgICAgICBwcmljZSA9IHguc3RhbmRhcmRzWyAwIF0ucHJpY2U7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIC8vIOWei+WPt+Wkp+S6jjHnp41cbiAgICAgICAgICAgIH0gZWxzZSBpZiAoIHguc3RhbmRhcmRzLmxlbmd0aCA+IDEgKSB7XG5cbiAgICAgICAgICAgICAgICAvLyDlpITnkIbku7fmoLxcbiAgICAgICAgICAgICAgICBjb25zdCBzb3J0ZWRQcmljZSA9IHguc3RhbmRhcmRzLnNvcnQoKCB4LCB5ICkgPT4geC5wcmljZSAtIHkucHJpY2UgKTtcbiAgICAgICAgICAgICAgICBpZiAoIHNvcnRlZFByaWNlWzBdLnByaWNlID09PSBzb3J0ZWRQcmljZVtzb3J0ZWRQcmljZS5sZW5ndGggLSAxIF0ucHJpY2UgKSB7XG4gICAgICAgICAgICAgICAgICAgIHByaWNlID0gc29ydGVkUHJpY2VbMF0ucHJpY2U7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgcHJpY2UgPSBgJHtzb3J0ZWRQcmljZVswXS5wcmljZX1+JHtzb3J0ZWRQcmljZVtzb3J0ZWRQcmljZS5sZW5ndGggLSAxIF0ucHJpY2V9YDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgLy8g5aSE55CG6LSn5a2YXG4gICAgICAgICAgICAgICAgY29uc3Qgc29ydGVkU3RvY2sgPSB4LnN0YW5kYXJkcy5maWx0ZXIoaSA9PiBpLnN0b2NrICE9PSB1bmRlZmluZWQgJiYgaS5zdG9jayAhPT0gbnVsbCkuc29ydCgoeCwgeSkgPT4geC5zdG9jayAtIHkuc3RvY2spO1xuICAgICAgICAgICAgICAgIC8vIOacieW6k+WtmOWei+WPt1xuICAgICAgICAgICAgICAgIGlmICggc29ydGVkU3RvY2subGVuZ3RoID09PSAxICkge1xuICAgICAgICAgICAgICAgICAgICBzdG9jayA9IGAke3NvcnRlZFN0b2NrWzBdLnN0b2NrfWA7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmICggc29ydGVkU3RvY2subGVuZ3RoID4gMSApIHtcbiAgICAgICAgICAgICAgICAgIGlmICggc29ydGVkU3RvY2tbMF0uc3RvY2sgPT09IHNvcnRlZFN0b2NrW3NvcnRlZFN0b2NrLmxlbmd0aCAtIDFdLnN0b2NrICkge1xuICAgICAgICAgICAgICAgICAgICAgIHN0b2NrID0gYCR7c29ydGVkU3RvY2tbMF0uc3RvY2t9YDtcbiAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgc3RvY2sgPSBgJHtzb3J0ZWRTdG9ja1swXS5zdG9ja31+JHtzb3J0ZWRTdG9ja1tzb3J0ZWRTdG9jay5sZW5ndGggLSAxXS5zdG9ja31gO1xuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICBcbiAgICAgICAgICAgIGNvbnN0IG9yaWdpbjogYW55ID0gWyAuLi50aGF0LmRhdGEuc3RvY2tOZWVkIF07XG4gICAgICAgICAgICBvcmlnaW4ucHVzaCgoKHN0b2NrICE9PSB1bmRlZmluZWQpICYmIChOdW1iZXIoc3RvY2suc3BsaXQoJ34nKVswXSkgPCAxMCkpKTtcbiAgICAgICAgICAgIHRoYXQuc2V0RGF0YSEoe1xuICAgICAgICAgICAgICAgIHN0b2NrTmVlZDogb3JpZ2luXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHJldHVybiBPYmplY3QuYXNzaWduKHsgfSwgeCwge1xuICAgICAgICAgICAgICAgIHN0b2NrLFxuICAgICAgICAgICAgICAgIHByaWNlXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSlcbiAgICB9LFxuXG4gICAgLyoqIOeCueWHu+ivpuaDhSAqL1xuICAgIG9uVGFiKHsgY3VycmVudFRhcmdldCB9KSB7XG4gICAgICAgIGNvbnN0IHsgcGlkIH0gPSBjdXJyZW50VGFyZ2V0LmRhdGFzZXQ7XG4gICAgICAgIHd4Lm5hdmlnYXRlVG8oe1xuICAgICAgICAgICAgLy8gdXJsOiBgL3BhZ2VzL21hbmFnZXItZ29vZHMtZGV0YWlsL2luZGV4P2lkPSR7cGlkfWBcbiAgICAgICAgICAgIHVybDogYC9wYWdlcy9nb29kcy1kZXRhaWwvaW5kZXg/aWQ9JHtwaWR9YFxuICAgICAgICB9KTtcbiAgICB9LFxuICBcbiAgICAvKipcbiAgICAgKiDnlJ/lkb3lkajmnJ/lh73mlbAtLeebkeWQrOmhtemdouWKoOi9vVxuICAgICAqL1xuICAgIG9uTG9hZDogZnVuY3Rpb24gKG9wdGlvbnMpIHtcbiAgICAgIFxuICAgIH0sXG4gIFxuICAgIC8qKlxuICAgICAqIOeUn+WRveWRqOacn+WHveaVsC0t55uR5ZCs6aG16Z2i5Yid5qyh5riy5p+T5a6M5oiQXG4gICAgICovXG4gICAgb25SZWFkeTogZnVuY3Rpb24gKCkge1xuICBcbiAgICB9LFxuICBcbiAgICAvKipcbiAgICAgKiDnlJ/lkb3lkajmnJ/lh73mlbAtLeebkeWQrOmhtemdouaYvuekulxuICAgICAqL1xuICAgIG9uU2hvdzogZnVuY3Rpb24gKCkge1xuICAgICAgdGhpcy5mZXRjaERhdGEoICk7XG4gICAgfSxcbiAgXG4gICAgLyoqXG4gICAgICog55Sf5ZG95ZGo5pyf5Ye95pWwLS3nm5HlkKzpobXpnaLpmpDol49cbiAgICAgKi9cbiAgICBvbkhpZGU6IGZ1bmN0aW9uICgpIHtcbiAgXG4gICAgfSxcbiAgXG4gICAgLyoqXG4gICAgICog55Sf5ZG95ZGo5pyf5Ye95pWwLS3nm5HlkKzpobXpnaLljbjovb1cbiAgICAgKi9cbiAgICBvblVubG9hZDogZnVuY3Rpb24gKCkge1xuICBcbiAgICB9LFxuICBcbiAgICAvKipcbiAgICAgKiDpobXpnaLnm7jlhbPkuovku7blpITnkIblh73mlbAtLeebkeWQrOeUqOaIt+S4i+aLieWKqOS9nFxuICAgICAqL1xuICAgIG9uUHVsbERvd25SZWZyZXNoOiBmdW5jdGlvbiAoKSB7XG4gIFxuICAgIH0sXG4gIFxuICAgIC8qKlxuICAgICAqIOmhtemdouS4iuaLieinpuW6leS6i+S7tueahOWkhOeQhuWHveaVsFxuICAgICAqL1xuICAgIG9uUmVhY2hCb3R0b206IGZ1bmN0aW9uICgpIHtcbiAgXG4gICAgfSxcbiAgXG4gICAgLyoqXG4gICAgICog55So5oi354K55Ye75Y+z5LiK6KeS5YiG5LqrXG4gICAgICovXG4gICAgLy8gb25TaGFyZUFwcE1lc3NhZ2U6IGZ1bmN0aW9uICgpIHtcbiAgXG4gICAgLy8gfVxuICB9KSJdfQ==