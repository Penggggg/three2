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
                label: '已下架',
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
    onLoad: function (options) {
        wx.hideShareMenu({});
        this.runComputed();
        this.fetchData();
    },
    onReady: function () {
    },
    onShow: function () {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLDhDQUEwQztBQUMxQyxnREFBcUQ7QUFDckQscURBQW9EO0FBQ3BELGdEQUE0QztBQUc1QyxJQUFJLENBQUM7SUFLRCxJQUFJLEVBQUU7UUFHRixJQUFJLEVBQUUsQ0FBQztRQUdQLE1BQU0sRUFBRSxFQUFFO1FBR1YsSUFBSSxFQUFFLEVBQUc7UUFHVCxXQUFXLEVBQUUsS0FBSztRQUdsQixXQUFXLEVBQUUsSUFBSTtRQUdqQixTQUFTLEVBQUU7WUFDUDtnQkFDSSxLQUFLLEVBQUUsS0FBSztnQkFDWixLQUFLLEVBQUUsSUFBSTthQUNkLEVBQUU7Z0JBQ0MsS0FBSyxFQUFFLEtBQUs7Z0JBQ1osS0FBSyxFQUFFLEtBQUs7YUFDZjtTQUNKO0tBQ0o7SUFFRCxXQUFXO1FBQ1AsbUJBQVEsQ0FBRSxJQUFJLEVBQUU7WUFHWixLQUFLO2dCQUNPLElBQUEscUJBQUksQ0FBZTtnQkFDM0IsSUFBTSxJQUFJLEdBQUksSUFBSSxDQUFDLEdBQUcsQ0FBRSx5QkFBYyxDQUFFLENBQUM7Z0JBQ3pDLE9BQU8sSUFBSSxDQUFDO1lBQ2hCLENBQUM7U0FDSixDQUFDLENBQUE7SUFDTixDQUFDO0lBSUQsU0FBUztRQUNMLElBQU0sSUFBSSxHQUFHLElBQUksQ0FBQztRQUNaLElBQUEsY0FBc0QsRUFBcEQsNEJBQVcsRUFBRSw0QkFBVyxFQUFFLGNBQUksRUFBRSxrQkFBb0IsQ0FBQztRQUU3RCxJQUFLLFdBQVcsSUFBSSxDQUFDLFdBQVcsRUFBRztZQUMvQixPQUFPO1NBQ1Y7UUFFRCxJQUFJLENBQUMsT0FBUSxDQUFDO1lBQ1YsV0FBVyxFQUFFLElBQUk7U0FDcEIsQ0FBQyxDQUFDO1FBRUgsY0FBSSxDQUFDO1lBQ0QsSUFBSSxFQUFFO2dCQUNGLEtBQUssRUFBRSxFQUFFO2dCQUNULEtBQUssRUFBRSxNQUFNO2dCQUNiLElBQUksRUFBRSxJ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SUFBQSwrQkFBRyxDQUEyQjtRQUN0QyxnQkFBSyxDQUFFLEdBQUcsQ0FBQyxDQUFDO1lBQ1IsMENBQXdDLEdBQUssQ0FBQyxDQUFDO1lBQy9DLG1DQUFtQyxDQUN0QyxDQUFDO0lBQ04sQ0FBQztJQUdELFNBQVMsWUFBQyxFQUFVO1lBQVIsa0JBQU07UUFFZCxJQUFNLE1BQU0sR0FBRyxNQUFNLENBQUM7UUFFdEIsSUFBSSxDQUFDLE9BQVEsQ0FBQztZQUNWLElBQUksRUFBRSxDQUFDO1lBQ1AsTUFBTSxRQUFBO1lBQ04sV0FBVyxFQUFFLElBQUk7U0FDcEIsQ0FBQyxDQUFBO1FBRUYsSUFBSSxDQUFDLFNBQVMsRUFBRyxDQUFDO0lBQ3RCLENBQUM7SUFLRCxNQUFNLEVBQUUsVUFBVSxPQUFPO1FBQ3JCLEVBQUUsQ0FBQyxhQUFhLENBQUMsRUFBRyxDQUFDLENBQUM7UUFDdEIsSUFBSSxDQUFDLFdBQVcsRUFBRyxDQUFDO1FBQ3BCLElBQUksQ0FBQyxTQUFTLEVBQUcsQ0FBQztJQUN0QixDQUFDO0lBS0QsT0FBTyxFQUFFO0lBRVQsQ0FBQztJQUtELE1BQU0sRUFBRTtJQUVSLENBQUM7SUFLRCxNQUFNLEVBQUU7SUFFUixDQUFDO0lBS0QsUUFBUSxFQUFFO0lBRVYsQ0FBQztJQUtELGlCQUFpQixFQUFFO0lBRW5CLENBQUM7SUFLRCxhQUFhLEVBQUU7SUFFZixDQUFDO0NBUUYsQ0FBQyxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgaHR0cCB9IGZyb20gJy4uLy4uL3V0aWwvaHR0cC5qcyc7XG5pbXBvcnQgeyBkZWxheWVyaW5nR29vZCB9IGZyb20gJy4uLy4uL3V0aWwvZ29vZHMuanMnO1xuaW1wb3J0IHsgY29tcHV0ZWQgfSBmcm9tICcuLi8uLi9saWIvdnVlZnkvaW5kZXguanMnO1xuaW1wb3J0IHsgbmF2VG8gfSBmcm9tICcuLi8uLi91dGlsL3JvdXRlLmpzJztcblxuLy8gYXBwL3BhZ2VzL21hbmFnZXItZ29vZHMtbGlzdC9pbmRleC5qc1xuUGFnZSh7XG5cbiAgICAvKipcbiAgICAgKiDpobXpnaLnmoTliJ3lp4vmlbDmja5cbiAgICAgKi9cbiAgICBkYXRhOiB7XG5cbiAgICAgICAgLy8g5b2T5YmN6aG156CBXG4gICAgICAgIHBhZ2U6IDAsXG5cbiAgICAgICAgLy8g5pCc57SiXG4gICAgICAgIHNlYXJjaDogJycsXG5cbiAgICAgICAgLy8g5ZWG5ZOB5YiX6KGoXG4gICAgICAgIGxpc3Q6IFsgXSxcblxuICAgICAgICAvLyDliqDovb3liJfooahpbmdcbiAgICAgICAgbG9hZGluZ0xpc3Q6IGZhbHNlLFxuXG4gICAgICAgIC8vIOiDveWQpue7p+e7reWKoOi9vVxuICAgICAgICBjYW5Mb2FkTW9yZTogdHJ1ZSxcblxuICAgICAgICAvKiog5LiK5LiL5p626YCJ6aG5ICovXG4gICAgICAgIGNsb3NlT3B0czogW1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIGxhYmVsOiAn5LiK5p625LitJyxcbiAgICAgICAgICAgICAgICB2YWx1ZTogdHJ1ZVxuICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICAgIGxhYmVsOiAn5bey5LiL5p62JyxcbiAgICAgICAgICAgICAgICB2YWx1ZTogZmFsc2VcbiAgICAgICAgICAgIH1cbiAgICAgICAgXVxuICAgIH0sXG5cbiAgICBydW5Db21wdXRlZCggKSB7XG4gICAgICAgIGNvbXB1dGVkKCB0aGlzLCB7XG5cbiAgICAgICAgICAgIC8vIOWIl+ihqFxuICAgICAgICAgICAgbGlzdCQoICkge1xuICAgICAgICAgICAgICAgIGNvbnN0IHsgbGlzdCB9ID0gdGhpcy5kYXRhO1xuICAgICAgICAgICAgICAgIGNvbnN0IG1ldGEgID0gbGlzdC5tYXAoIGRlbGF5ZXJpbmdHb29kICk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG1ldGE7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgfSxcbiAgXG4gIFxuICAgIC8qKiDmi4nlj5bliJfooaggKi9cbiAgICBmZXRjaERhdGEoICkge1xuICAgICAgICBjb25zdCB0aGF0ID0gdGhpcztcbiAgICAgICAgY29uc3QgeyBjYW5Mb2FkTW9yZSwgbG9hZGluZ0xpc3QsIHBhZ2UsIHNlYXJjaCB9ID0gdGhpcy5kYXRhO1xuXG4gICAgICAgIGlmICggbG9hZGluZ0xpc3QgfHwgIWNhbkxvYWRNb3JlICkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5zZXREYXRhISh7XG4gICAgICAgICAgICBsb2FkaW5nTGlzdDogdHJ1ZVxuICAgICAgICB9KTtcblxuICAgICAgICBodHRwKHtcbiAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICBsaW1pdDogMTAsXG4gICAgICAgICAgICAgICAgdGl0bGU6IHNlYXJjaCxcbiAgICAgICAgICAgICAgICBwYWdlOiBwYWdlICsgMSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB1cmw6IGBnb29kX2xpc3RgLFxuICAgICAgICAgICAgc3VjY2VzczogcmVzID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCB7IHN0YXR1cywgZGF0YSB9ID0gcmVzO1xuICAgICAgICAgXG4gICAgICAgICAgICAgICAgaWYgKCBzdGF0dXMgPT09IDIwMCApIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgeyBwYWdlLCB0b3RhbFBhZ2UgfSA9IGRhdGE7XG5cbiAgICAgICAgICAgICAgICAgICAgdGhhdC5zZXREYXRhISh7XG4gICAgICAgICAgICAgICAgICAgICAgICBwYWdlLFxuICAgICAgICAgICAgICAgICAgICAgICAgbG9hZGluZ0xpc3Q6IGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICAgICAgY2FuTG9hZE1vcmU6IHRvdGFsUGFnZSA+IHBhZ2VcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICBpZiAoIGRhdGEuZGF0YSAmJiBkYXRhLmRhdGEubGVuZ3RoID4gMCApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoYXQuc2V0RGF0YSEoe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxpc3Q6IHBhZ2UgPT09IDEgP1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhLmRhdGEgOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBbIC4uLnRoYXQuZGF0YS5saXN0LCAuLi5kYXRhLmRhdGFdXG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoYXQuc2V0RGF0YSEoe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxpc3Q6IFsgXVxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICB9KTtcbiAgICB9LFxuXG4gICAgLyoqIOaWh+Wtl+mAiemhuSDvvIzlvIDlkK/lhbPpl63kuIrkuIvmnrYqL1xuICAgIG9uU3dpdGNoKCBlICkge1xuICAgICAgICBjb25zdCB7IHZhbHVlLCBzaWduIH0gPSBlLmRldGFpbDtcbiAgICAgICAgY29uc3QgbGlzdCA9IFsgLi4udGhpcy5kYXRhLmxpc3QgXTtcbiAgICAgICAgd3guc2hvd01vZGFsKHtcbiAgICAgICAgICAgIHRpdGxlOiAn5o+Q56S6JyxcbiAgICAgICAgICAgIGNvbnRlbnQ6IGDnoa7lrpropoEkeyB2YWx1ZSA/ICfkuIrmnrYnIDogJ+S4i+aeticgfeatpOWVhuWTgeWQl++8n2AsXG4gICAgICAgICAgICBzdWNjZXNzOiByZXMgPT4ge1xuICAgICAgICAgICAgICAgIGlmICggcmVzLmNvbmZpcm0gKSB7XG4gICAgICAgICAgICAgICAgICAgIGh0dHAoe1xuICAgICAgICAgICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBpZDogc2lnbixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2aXNpYWJsZTogdmFsdWVcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICBsb2FkaW5nTXNnOiB2YWx1ZSA/ICfkuIrmnrbkuK0uLi4nIDogJ+S4i+aetuS4rS4uLicsXG4gICAgICAgICAgICAgICAgICAgICAgICB1cmw6ICdnb29kX3NldC12aXNpYWJsZScsXG4gICAgICAgICAgICAgICAgICAgICAgICBzdWNjZXNzOiByZXMgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICggcmVzLnN0YXR1cyA9PT0gMjAwICkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB3eC5zaG93VG9hc3Qoe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGl0bGU6IHZhbHVlID8gJ+S4iuaetuaIkOWKn++8gScgOiAn5LiL5p625oiQ5Yqf77yBJ1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgdGFyZ2V0ID0gbGlzdC5maW5kKCggeDogYW55ICkgPT4geC5faWQgPT09IHNpZ24gKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgZXhpc3RlZEluZGV4ID0gbGlzdC5maW5kSW5kZXgoKCB4OiBhbnkgKSA9PiB4Ll9pZCA9PT0gc2lnbiApO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAobGlzdCBhcyBhbnkgKS5zcGxpY2UoIGV4aXN0ZWRJbmRleCwgMSwgT2JqZWN0LmFzc2lnbih7IH0sIHRhcmdldCwge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmlzaWFibGU6IHZhbHVlXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zZXREYXRhISh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsaXN0XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH0sXG4gIFxuICAgIC8qKiDngrnlh7vor6bmg4UgKi9cbiAgICBvblRhYih7IGN1cnJlbnRUYXJnZXQgfSkge1xuICAgICAgICBjb25zdCB7IHBpZCB9ID0gY3VycmVudFRhcmdldC5kYXRhc2V0O1xuICAgICAgICBuYXZUbyggcGlkID9cbiAgICAgICAgICAgIGAvcGFnZXMvbWFuYWdlci1nb29kcy1kZXRhaWwvaW5kZXg/aWQ9JHtwaWR9YCA6XG4gICAgICAgICAgICBgL3BhZ2VzL21hbmFnZXItZ29vZHMtZGV0YWlsL2luZGV4YFxuICAgICAgICApO1xuICAgIH0sXG5cbiAgICAvKiog56Gu6K6k6L6T5YWlICovXG4gICAgb25Db25maXJtKHsgZGV0YWlsIH0pIHtcblxuICAgICAgICBjb25zdCBzZWFyY2ggPSBkZXRhaWw7XG4gICAgICBcbiAgICAgICAgdGhpcy5zZXREYXRhISh7XG4gICAgICAgICAgICBwYWdlOiAwLFxuICAgICAgICAgICAgc2VhcmNoLFxuICAgICAgICAgICAgY2FuTG9hZE1vcmU6IHRydWVcbiAgICAgICAgfSlcblxuICAgICAgICB0aGlzLmZldGNoRGF0YSggKTtcbiAgICB9LFxuICBcbiAgICAvKipcbiAgICAgKiDnlJ/lkb3lkajmnJ/lh73mlbAtLeebkeWQrOmhtemdouWKoOi9vVxuICAgICAqL1xuICAgIG9uTG9hZDogZnVuY3Rpb24gKG9wdGlvbnMpIHtcbiAgICAgICAgd3guaGlkZVNoYXJlTWVudSh7IH0pO1xuICAgICAgICB0aGlzLnJ1bkNvbXB1dGVkKCApO1xuICAgICAgICB0aGlzLmZldGNoRGF0YSggKTtcbiAgICB9LFxuICBcbiAgICAvKipcbiAgICAgKiDnlJ/lkb3lkajmnJ/lh73mlbAtLeebkeWQrOmhtemdouWIneasoea4suafk+WujOaIkFxuICAgICAqL1xuICAgIG9uUmVhZHk6IGZ1bmN0aW9uICgpIHtcbiAgXG4gICAgfSxcbiAgXG4gICAgLyoqXG4gICAgICog55Sf5ZG95ZGo5pyf5Ye95pWwLS3nm5HlkKzpobXpnaLmmL7npLpcbiAgICAgKi9cbiAgICBvblNob3c6IGZ1bmN0aW9uICggKSB7XG4gICAgICBcbiAgICB9LFxuICBcbiAgICAvKipcbiAgICAgKiDnlJ/lkb3lkajmnJ/lh73mlbAtLeebkeWQrOmhtemdoumakOiXj1xuICAgICAqL1xuICAgIG9uSGlkZTogZnVuY3Rpb24gKCkge1xuICBcbiAgICB9LFxuICBcbiAgICAvKipcbiAgICAgKiDnlJ/lkb3lkajmnJ/lh73mlbAtLeebkeWQrOmhtemdouWNuOi9vVxuICAgICAqL1xuICAgIG9uVW5sb2FkOiBmdW5jdGlvbiAoKSB7XG4gIFxuICAgIH0sXG4gIFxuICAgIC8qKlxuICAgICAqIOmhtemdouebuOWFs+S6i+S7tuWkhOeQhuWHveaVsC0t55uR5ZCs55So5oi35LiL5ouJ5Yqo5L2cXG4gICAgICovXG4gICAgb25QdWxsRG93blJlZnJlc2g6IGZ1bmN0aW9uICgpIHtcbiAgXG4gICAgfSxcbiAgXG4gICAgLyoqXG4gICAgICog6aG16Z2i5LiK5ouJ6Kem5bqV5LqL5Lu255qE5aSE55CG5Ye95pWwXG4gICAgICovXG4gICAgb25SZWFjaEJvdHRvbTogZnVuY3Rpb24gKCkge1xuICBcbiAgICB9LFxuICBcbiAgICAvKipcbiAgICAgKiDnlKjmiLfngrnlh7vlj7PkuIrop5LliIbkuqtcbiAgICAgKi9cbiAgICAvLyBvblNoYXJlQXBwTWVzc2FnZTogZnVuY3Rpb24gKCkge1xuICBcbiAgICAvLyB9XG4gIH0pIl19