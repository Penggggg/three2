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
        route_js_1.navTo("/pages/manager-goods-detail/index?id=" + pid);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLDhDQUEwQztBQUMxQyxnREFBcUQ7QUFDckQscURBQW9EO0FBQ3BELGdEQUE0QztBQUc1QyxJQUFJLENBQUM7SUFLRCxJQUFJLEVBQUU7UUFHRixJQUFJLEVBQUUsQ0FBQztRQUdQLE1BQU0sRUFBRSxFQUFFO1FBR1YsSUFBSSxFQUFFLEVBQUc7UUFHVCxXQUFXLEVBQUUsS0FBSztRQUdsQixXQUFXLEVBQUUsSUFBSTtRQUdqQixTQUFTLEVBQUU7WUFDUDtnQkFDSSxLQUFLLEVBQUUsS0FBSztnQkFDWixLQUFLLEVBQUUsSUFBSTthQUNkLEVBQUU7Z0JBQ0MsS0FBSyxFQUFFLEtBQUs7Z0JBQ1osS0FBSyxFQUFFLEtBQUs7YUFDZjtTQUNKO0tBQ0o7SUFFRCxXQUFXO1FBQ1AsbUJBQVEsQ0FBRSxJQUFJLEVBQUU7WUFHWixLQUFLO2dCQUNPLElBQUEscUJBQUksQ0FBZTtnQkFDM0IsSUFBTSxJQUFJLEdBQUksSUFBSSxDQUFDLEdBQUcsQ0FBRSx5QkFBYyxDQUFFLENBQUM7Z0JBQ3pDLE9BQU8sSUFBSSxDQUFDO1lBQ2hCLENBQUM7U0FDSixDQUFDLENBQUE7SUFDTixDQUFDO0lBSUQsU0FBUztRQUNMLElBQU0sSUFBSSxHQUFHLElBQUksQ0FBQztRQUNaLElBQUEsY0FBc0QsRUFBcEQsNEJBQVcsRUFBRSw0QkFBVyxFQUFFLGNBQUksRUFBRSxrQkFBb0IsQ0FBQztRQUU3RCxJQUFLLFdBQVcsSUFBSSxDQUFDLFdBQVcsRUFBRztZQUMvQixPQUFPO1NBQ1Y7UUFFRCxJQUFJLENBQUMsT0FBUSxDQUFDO1lBQ1YsV0FBVyxFQUFFLElBQUk7U0FDcEIsQ0FBQyxDQUFDO1FBRUgsY0FBSSxDQUFDO1lBQ0QsSUFBSSxFQUFFO2dCQUNGLEtBQUssRUFBRSxFQUFFO2dCQUNULEtBQUssRUFBRSxNQUFNO2dCQUNiLElBQUksRUFBRSxJ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SUFBQSwrQkFBRyxDQUEyQjtRQUN0QyxnQkFBSyxDQUFFLDBDQUF3QyxHQUFLLENBQUMsQ0FBQztJQUMxRCxDQUFDO0lBR0QsU0FBUyxZQUFDLEVBQVU7WUFBUixrQkFBTTtRQUVkLElBQU0sTUFBTSxHQUFHLE1BQU0sQ0FBQztRQUV0QixJQUFJLENBQUMsT0FBUSxDQUFDO1lBQ1YsSUFBSSxFQUFFLENBQUM7WUFDUCxNQUFNLFFBQUE7WUFDTixXQUFXLEVBQUUsSUFBSTtTQUNwQixDQUFDLENBQUE7UUFFRixJQUFJLENBQUMsU0FBUyxFQUFHLENBQUM7SUFDdEIsQ0FBQztJQUtELE1BQU0sRUFBRSxVQUFVLE9BQU87UUFDckIsRUFBRSxDQUFDLGFBQWEsQ0FBQyxFQUFHLENBQUMsQ0FBQztRQUN0QixJQUFJLENBQUMsV0FBVyxFQUFHLENBQUM7UUFDcEIsSUFBSSxDQUFDLFNBQVMsRUFBRyxDQUFDO0lBQ3RCLENBQUM7SUFLRCxPQUFPLEVBQUU7SUFFVCxDQUFDO0lBS0QsTUFBTSxFQUFFO0lBRVIsQ0FBQztJQUtELE1BQU0sRUFBRTtJQUVSLENBQUM7SUFLRCxRQUFRLEVBQUU7SUFFVixDQUFDO0lBS0QsaUJBQWlCLEVBQUU7SUFFbkIsQ0FBQztJQUtELGFBQWEsRUFBRTtJQUVmLENBQUM7Q0FRRixDQUFDLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBodHRwIH0gZnJvbSAnLi4vLi4vdXRpbC9odHRwLmpzJztcbmltcG9ydCB7IGRlbGF5ZXJpbmdHb29kIH0gZnJvbSAnLi4vLi4vdXRpbC9nb29kcy5qcyc7XG5pbXBvcnQgeyBjb21wdXRlZCB9IGZyb20gJy4uLy4uL2xpYi92dWVmeS9pbmRleC5qcyc7XG5pbXBvcnQgeyBuYXZUbyB9IGZyb20gJy4uLy4uL3V0aWwvcm91dGUuanMnO1xuXG4vLyBhcHAvcGFnZXMvbWFuYWdlci1nb29kcy1saXN0L2luZGV4LmpzXG5QYWdlKHtcblxuICAgIC8qKlxuICAgICAqIOmhtemdoueahOWIneWni+aVsOaNrlxuICAgICAqL1xuICAgIGRhdGE6IHtcblxuICAgICAgICAvLyDlvZPliY3pobXnoIFcbiAgICAgICAgcGFnZTogMCxcblxuICAgICAgICAvLyDmkJzntKJcbiAgICAgICAgc2VhcmNoOiAnJyxcblxuICAgICAgICAvLyDllYblk4HliJfooahcbiAgICAgICAgbGlzdDogWyBdLFxuXG4gICAgICAgIC8vIOWKoOi9veWIl+ihqGluZ1xuICAgICAgICBsb2FkaW5nTGlzdDogZmFsc2UsXG5cbiAgICAgICAgLy8g6IO95ZCm57un57ut5Yqg6L29XG4gICAgICAgIGNhbkxvYWRNb3JlOiB0cnVlLFxuXG4gICAgICAgIC8qKiDkuIrkuIvmnrbpgInpobkgKi9cbiAgICAgICAgY2xvc2VPcHRzOiBbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgbGFiZWw6ICfkuIrmnrbkuK0nLFxuICAgICAgICAgICAgICAgIHZhbHVlOiB0cnVlXG4gICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgbGFiZWw6ICflt7LkuIvmnrYnLFxuICAgICAgICAgICAgICAgIHZhbHVlOiBmYWxzZVxuICAgICAgICAgICAgfVxuICAgICAgICBdXG4gICAgfSxcblxuICAgIHJ1bkNvbXB1dGVkKCApIHtcbiAgICAgICAgY29tcHV0ZWQoIHRoaXMsIHtcblxuICAgICAgICAgICAgLy8g5YiX6KGoXG4gICAgICAgICAgICBsaXN0JCggKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgeyBsaXN0IH0gPSB0aGlzLmRhdGE7XG4gICAgICAgICAgICAgICAgY29uc3QgbWV0YSAgPSBsaXN0Lm1hcCggZGVsYXllcmluZ0dvb2QgKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gbWV0YTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSlcbiAgICB9LFxuICBcbiAgXG4gICAgLyoqIOaLieWPluWIl+ihqCAqL1xuICAgIGZldGNoRGF0YSggKSB7XG4gICAgICAgIGNvbnN0IHRoYXQgPSB0aGlzO1xuICAgICAgICBjb25zdCB7IGNhbkxvYWRNb3JlLCBsb2FkaW5nTGlzdCwgcGFnZSwgc2VhcmNoIH0gPSB0aGlzLmRhdGE7XG5cbiAgICAgICAgaWYgKCBsb2FkaW5nTGlzdCB8fCAhY2FuTG9hZE1vcmUgKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLnNldERhdGEhKHtcbiAgICAgICAgICAgIGxvYWRpbmdMaXN0OiB0cnVlXG4gICAgICAgIH0pO1xuXG4gICAgICAgIGh0dHAoe1xuICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgIGxpbWl0OiAxMCxcbiAgICAgICAgICAgICAgICB0aXRsZTogc2VhcmNoLFxuICAgICAgICAgICAgICAgIHBhZ2U6IHBhZ2UgKyAxLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHVybDogYGdvb2RfbGlzdGAsXG4gICAgICAgICAgICBzdWNjZXNzOiByZXMgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IHsgc3RhdHVzLCBkYXRhIH0gPSByZXM7XG4gICAgICAgICBcbiAgICAgICAgICAgICAgICBpZiAoIHN0YXR1cyA9PT0gMjAwICkge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCB7IHBhZ2UsIHRvdGFsUGFnZSB9ID0gZGF0YTtcblxuICAgICAgICAgICAgICAgICAgICB0aGF0LnNldERhdGEhKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHBhZ2UsXG4gICAgICAgICAgICAgICAgICAgICAgICBsb2FkaW5nTGlzdDogZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgICAgICBjYW5Mb2FkTW9yZTogdG90YWxQYWdlID4gcGFnZVxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgIGlmICggZGF0YS5kYXRhICYmIGRhdGEuZGF0YS5sZW5ndGggPiAwICkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhhdC5zZXREYXRhISh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGlzdDogcGFnZSA9PT0gMSA/XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGEuZGF0YSA6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFsgLi4udGhhdC5kYXRhLmxpc3QsIC4uLmRhdGEuZGF0YV1cbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhhdC5zZXREYXRhISh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGlzdDogWyBdXG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgIH0pO1xuICAgIH0sXG5cbiAgICAvKiog5paH5a2X6YCJ6aG5IO+8jOW8gOWQr+WFs+mXreS4iuS4i+aetiovXG4gICAgb25Td2l0Y2goIGUgKSB7XG4gICAgICAgIGNvbnN0IHsgdmFsdWUsIHNpZ24gfSA9IGUuZGV0YWlsO1xuICAgICAgICBjb25zdCBsaXN0ID0gWyAuLi50aGlzLmRhdGEubGlzdCBdO1xuICAgICAgICB3eC5zaG93TW9kYWwoe1xuICAgICAgICAgICAgdGl0bGU6ICfmj5DnpLonLFxuICAgICAgICAgICAgY29udGVudDogYOehruWumuimgSR7IHZhbHVlID8gJ+S4iuaeticgOiAn5LiL5p62JyB95q2k5ZWG5ZOB5ZCX77yfYCxcbiAgICAgICAgICAgIHN1Y2Nlc3M6IHJlcyA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKCByZXMuY29uZmlybSApIHtcbiAgICAgICAgICAgICAgICAgICAgaHR0cCh7XG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcGlkOiBzaWduLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZpc2lhYmxlOiB2YWx1ZVxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGxvYWRpbmdNc2c6IHZhbHVlID8gJ+S4iuaetuS4rS4uLicgOiAn5LiL5p625LitLi4uJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIHVybDogJ2dvb2Rfc2V0LXZpc2lhYmxlJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIHN1Y2Nlc3M6IHJlcyA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCByZXMuc3RhdHVzID09PSAyMDAgKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHd4LnNob3dUb2FzdCh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aXRsZTogdmFsdWUgPyAn5LiK5p625oiQ5Yqf77yBJyA6ICfkuIvmnrbmiJDlip/vvIEnXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCB0YXJnZXQgPSBsaXN0LmZpbmQoKCB4OiBhbnkgKSA9PiB4Ll9pZCA9PT0gc2lnbiApO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBleGlzdGVkSW5kZXggPSBsaXN0LmZpbmRJbmRleCgoIHg6IGFueSApID0+IHguX2lkID09PSBzaWduICk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIChsaXN0IGFzIGFueSApLnNwbGljZSggZXhpc3RlZEluZGV4LCAxLCBPYmplY3QuYXNzaWduKHsgfSwgdGFyZ2V0LCB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2aXNpYWJsZTogdmFsdWVcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnNldERhdGEhKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxpc3RcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfSxcbiAgXG4gICAgLyoqIOeCueWHu+ivpuaDhSAqL1xuICAgIG9uVGFiKHsgY3VycmVudFRhcmdldCB9KSB7XG4gICAgICAgIGNvbnN0IHsgcGlkIH0gPSBjdXJyZW50VGFyZ2V0LmRhdGFzZXQ7XG4gICAgICAgIG5hdlRvKCBgL3BhZ2VzL21hbmFnZXItZ29vZHMtZGV0YWlsL2luZGV4P2lkPSR7cGlkfWApO1xuICAgIH0sXG5cbiAgICAvKiog56Gu6K6k6L6T5YWlICovXG4gICAgb25Db25maXJtKHsgZGV0YWlsIH0pIHtcblxuICAgICAgICBjb25zdCBzZWFyY2ggPSBkZXRhaWw7XG4gICAgICBcbiAgICAgICAgdGhpcy5zZXREYXRhISh7XG4gICAgICAgICAgICBwYWdlOiAwLFxuICAgICAgICAgICAgc2VhcmNoLFxuICAgICAgICAgICAgY2FuTG9hZE1vcmU6IHRydWVcbiAgICAgICAgfSlcblxuICAgICAgICB0aGlzLmZldGNoRGF0YSggKTtcbiAgICB9LFxuICBcbiAgICAvKipcbiAgICAgKiDnlJ/lkb3lkajmnJ/lh73mlbAtLeebkeWQrOmhtemdouWKoOi9vVxuICAgICAqL1xuICAgIG9uTG9hZDogZnVuY3Rpb24gKG9wdGlvbnMpIHtcbiAgICAgICAgd3guaGlkZVNoYXJlTWVudSh7IH0pO1xuICAgICAgICB0aGlzLnJ1bkNvbXB1dGVkKCApO1xuICAgICAgICB0aGlzLmZldGNoRGF0YSggKTtcbiAgICB9LFxuICBcbiAgICAvKipcbiAgICAgKiDnlJ/lkb3lkajmnJ/lh73mlbAtLeebkeWQrOmhtemdouWIneasoea4suafk+WujOaIkFxuICAgICAqL1xuICAgIG9uUmVhZHk6IGZ1bmN0aW9uICgpIHtcbiAgXG4gICAgfSxcbiAgXG4gICAgLyoqXG4gICAgICog55Sf5ZG95ZGo5pyf5Ye95pWwLS3nm5HlkKzpobXpnaLmmL7npLpcbiAgICAgKi9cbiAgICBvblNob3c6IGZ1bmN0aW9uICggKSB7XG4gICAgICBcbiAgICB9LFxuICBcbiAgICAvKipcbiAgICAgKiDnlJ/lkb3lkajmnJ/lh73mlbAtLeebkeWQrOmhtemdoumakOiXj1xuICAgICAqL1xuICAgIG9uSGlkZTogZnVuY3Rpb24gKCkge1xuICBcbiAgICB9LFxuICBcbiAgICAvKipcbiAgICAgKiDnlJ/lkb3lkajmnJ/lh73mlbAtLeebkeWQrOmhtemdouWNuOi9vVxuICAgICAqL1xuICAgIG9uVW5sb2FkOiBmdW5jdGlvbiAoKSB7XG4gIFxuICAgIH0sXG4gIFxuICAgIC8qKlxuICAgICAqIOmhtemdouebuOWFs+S6i+S7tuWkhOeQhuWHveaVsC0t55uR5ZCs55So5oi35LiL5ouJ5Yqo5L2cXG4gICAgICovXG4gICAgb25QdWxsRG93blJlZnJlc2g6IGZ1bmN0aW9uICgpIHtcbiAgXG4gICAgfSxcbiAgXG4gICAgLyoqXG4gICAgICog6aG16Z2i5LiK5ouJ6Kem5bqV5LqL5Lu255qE5aSE55CG5Ye95pWwXG4gICAgICovXG4gICAgb25SZWFjaEJvdHRvbTogZnVuY3Rpb24gKCkge1xuICBcbiAgICB9LFxuICBcbiAgICAvKipcbiAgICAgKiDnlKjmiLfngrnlh7vlj7PkuIrop5LliIbkuqtcbiAgICAgKi9cbiAgICAvLyBvblNoYXJlQXBwTWVzc2FnZTogZnVuY3Rpb24gKCkge1xuICBcbiAgICAvLyB9XG4gIH0pIl19