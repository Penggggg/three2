"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var index_js_1 = require("../../lib/vuefy/index.js");
var app = getApp();
Page({
    data: {
        tid: '',
        loading: false,
        swiperIndex: 0,
        showDanmu: false
    },
    runComputed: function () {
        index_js_1.computed(this, {
            social$: function () {
                var avatar = 'https://wx.qlogo.cn/mmopen/vi_32/IejMVZTG8WlibHicHIVQhqcNeC4uBxkzH0FFTbRLMicxib8wrxRRWoJY3gvctylATdmAPhiaVicU4sH0NptSszBdyHiaA/132';
                var getRandom = function (n) { return Math.floor(Math.random() * n); };
                var allTexts = [
                    "\u68D2! \u62FC\u56E2\u7684\u7FA4\u53CB\u771F\u7ED9\u529B",
                    "\u54C7! \u548C\u7FA4\u53CB\u62FC\u56E2\u597D\u5212\u7B97",
                    "\u54C8! \u4E0B\u6B21\u7EE7\u7EED\u7528\u7FA4\u62FC\u56E2"
                ];
                var visitors = [
                    avatar,
                    avatar
                ];
                var allVisitors = visitors
                    .map(function (x) {
                    var randomNum = getRandom(allTexts.length);
                    return {
                        avatar: x,
                        text: allTexts[randomNum]
                    };
                });
                return allVisitors;
            },
            personal$: function () {
                var avatar = 'https://wx.qlogo.cn/mmopen/vi_32/IejMVZTG8WlibHicHIVQhqcNeC4uBxkzH0FFTbRLMicxib8wrxRRWoJY3gvctylATdmAPhiaVicU4sH0NptSszBdyHiaA/132';
                var imgUrl = 'https://wx60bf7f745ce31ef0-1257764567.cos.ap-guangzhou.myqcloud.com/tmp_7e24d0909d341e812968b83ce5a328d102bc1b174a374f4e.jpg';
                var getRandom = function (n) { return Math.floor(Math.random() * n); };
                var allTexts = [
                    "\u771F\u7ED9\u529B",
                    "\u8C22\u8C22\u4F60",
                    "\u5212\u7B97\uFF5E",
                    "\u68D2!",
                    "\u8D5E!",
                    "\u8D5A!"
                ];
                var r = [
                    {
                        goodId: '1',
                        delta: 15,
                        totalDelta: 45,
                        price: 86,
                        groupPrice: 71,
                        fadePrice: 128,
                        title: 'SKT护肤霜',
                        name: '红色',
                        buyer: [
                            {
                                name: 'xxx',
                                avatar: avatar
                            }, {
                                name: 'yyy',
                                avatar: avatar
                            }, {
                                name: 'zzz',
                                avatar: avatar
                            }, {
                                name: 'xxx',
                                avatar: avatar
                            }
                        ],
                        pinSuccess: true,
                        goodImg: imgUrl,
                        tips: allTexts[getRandom(allTexts.length)],
                        tipsIndex: getRandom(9 > 4 ? 3 : 9) + 1
                    }, {
                        goodId: '1',
                        delta: 15,
                        totalDelta: 45,
                        price: 86,
                        groupPrice: 71,
                        fadePrice: 128,
                        title: 'SKT护肤霜',
                        name: '红色',
                        buyer: [
                            {
                                name: 'xxx',
                                avatar: avatar
                            }, {
                                name: 'yyy',
                                avatar: avatar
                            }, {
                                name: 'zzz',
                                avatar: avatar
                            }, {
                                name: 'xxx',
                                avatar: avatar
                            }, {
                                name: 'yyy',
                                avatar: avatar
                            }, {
                                name: 'zzz',
                                avatar: avatar
                            }, {
                                name: 'xxx',
                                avatar: avatar
                            }, {
                                name: 'yyy',
                                avatar: avatar
                            }, {
                                name: 'zzz',
                                avatar: avatar
                            }
                        ],
                        pinSuccess: true,
                        goodImg: imgUrl,
                        tips: allTexts[getRandom(allTexts.length)],
                        tipsIndex: getRandom(9 > 4 ? 3 : 9) + 1
                    }, {
                        goodId: '1',
                        delta: 15,
                        totalDelta: 45,
                        price: 86,
                        groupPrice: 71,
                        fadePrice: 128,
                        title: 'SKT护肤霜',
                        name: '红色',
                        buyer: [
                            {
                                name: 'xxx',
                                avatar: avatar
                            }, {
                                name: 'yyy',
                                avatar: avatar
                            }, {
                                name: 'zzz',
                                avatar: avatar
                            }, {
                                name: 'xxx',
                                avatar: avatar
                            }
                        ],
                        pinSuccess: false,
                        goodImg: imgUrl,
                        tips: allTexts[getRandom(allTexts.length)],
                        tipsIndex: getRandom(9 > 4 ? 3 : 9) + 1
                    }
                ];
                return r;
            },
            others$: function () {
                var avatar = 'https://wx.qlogo.cn/mmopen/vi_32/IejMVZTG8WlibHicHIVQhqcNeC4uBxkzH0FFTbRLMicxib8wrxRRWoJY3gvctylATdmAPhiaVicU4sH0NptSszBdyHiaA/132';
                var imgUrl = 'https://wx60bf7f745ce31ef0-1257764567.cos.ap-guangzhou.myqcloud.com/tmp_7e24d0909d341e812968b83ce5a328d102bc1b174a374f4e.jpg';
                var r = [
                    {
                        goodId: '1',
                        delta: 15,
                        totalDelta: 45,
                        price: 86,
                        groupPrice: 71,
                        fadePrice: 128,
                        title: 'SKT护肤霜',
                        name: '红色',
                        buyer: [
                            {
                                name: 'xxx',
                                avatar: avatar
                            }, {
                                name: 'yyy',
                                avatar: avatar
                            }, {
                                name: 'zzz',
                                avatar: avatar
                            }, {
                                name: 'xxx',
                                avatar: avatar
                            }
                        ],
                        pinSuccess: true,
                        goodImg: imgUrl
                    }, {
                        goodId: '1',
                        delta: 15,
                        totalDelta: 45,
                        price: 86,
                        groupPrice: 71,
                        fadePrice: 128,
                        title: 'SKT护肤霜',
                        name: '红色',
                        buyer: [
                            {
                                name: 'xxx',
                                avatar: avatar
                            }, {
                                name: 'yyy',
                                avatar: avatar
                            }, {
                                name: 'zzz',
                                avatar: avatar
                            }, {
                                name: 'xxx',
                                avatar: avatar
                            }, {
                                name: 'yyy',
                                avatar: avatar
                            }, {
                                name: 'zzz',
                                avatar: avatar
                            }, {
                                name: 'xxx',
                                avatar: avatar
                            }, {
                                name: 'yyy',
                                avatar: avatar
                            }, {
                                name: 'zzz',
                                avatar: avatar
                            }
                        ],
                        pinSuccess: true,
                        goodImg: imgUrl
                    }, {
                        goodId: '1',
                        delta: 15,
                        totalDelta: 45,
                        price: 86,
                        groupPrice: 71,
                        fadePrice: 128,
                        title: 'SKT护肤霜',
                        name: '红色',
                        buyer: [
                            {
                                name: 'xxx',
                                avatar: avatar
                            }, {
                                name: 'yyy',
                                avatar: avatar
                            }, {
                                name: 'zzz',
                                avatar: avatar
                            }, {
                                name: 'xxx',
                                avatar: avatar
                            }
                        ],
                        pinSuccess: true,
                        goodImg: imgUrl
                    }, {
                        goodId: '1',
                        delta: 15,
                        totalDelta: 45,
                        price: 86,
                        groupPrice: 71,
                        fadePrice: 128,
                        title: 'SKT护肤霜',
                        name: '红色',
                        buyer: [
                            {
                                name: 'xxx',
                                avatar: avatar
                            }, {
                                name: 'yyy',
                                avatar: avatar
                            }, {
                                name: 'zzz',
                                avatar: avatar
                            }, {
                                name: 'xxx',
                                avatar: avatar
                            }, {
                                name: 'yyy',
                                avatar: avatar
                            }, {
                                name: 'zzz',
                                avatar: avatar
                            }, {
                                name: 'xxx',
                                avatar: avatar
                            }, {
                                name: 'yyy',
                                avatar: avatar
                            }, {
                                name: 'zzz',
                                avatar: avatar
                            }
                        ],
                        pinSuccess: true,
                        goodImg: imgUrl
                    }
                ];
                return r;
            }
        });
    },
    watchStore: function () {
        var _this = this;
        app.watch$('appConfig', function (val) {
            if (!val) {
                return;
            }
            _this.setTitle(val['ip-name'] + "\u7FA4\u62FC\u56E2");
        });
    },
    setTitle: function (title) {
        if (!title) {
            return;
        }
        wx.setNavigationBarTitle({
            title: title
        });
    },
    onSwiper: function (e) {
        var current = e.detail.current;
        this.setData({
            swiperIndex: current
        });
    },
    onScroll: function (e) {
        var showDanmu = this.data.showDanmu;
        var scrollTop = e.detail.scrollTop;
        if (!!showDanmu) {
            return;
        }
        if (scrollTop > 100) {
            this.setData({
                showDanmu: true
            });
        }
    },
    onLoad: function (query) {
        var tid = query.tid || "e8f863ba5de6241400076921441bc8d5";
        this.watchStore();
        this.runComputed();
        this.setData({
            tid: tid
        });
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
    onShareAppMessage: function (e) {
        var tid = this.data.tid;
        return {
            path: "/pages/trip-reward/index?tid=" + tid,
            title: '回报群友啦～免费领抵现金！'
        };
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUVBLHFEQUFvRDtBQUlwRCxJQUFNLEdBQUcsR0FBRyxNQUFNLEVBQVEsQ0FBQztBQUUzQixJQUFJLENBQUM7SUFFRCxJQUFJLEVBQUU7UUFFRixHQUFHLEVBQUUsRUFBRTtRQUtQLE9BQU8sRUFBRSxLQUFLO1FBS2QsV0FBVyxFQUFFLENBQUM7UUFLZCxTQUFTLEVBQUUsS0FBSztLQUVuQjtJQUVELFdBQVc7UUFDUCxtQkFBUSxDQUFFLElBQUksRUFBRTtZQUdaLE9BQU87Z0JBQ0gsSUFBTSxNQUFNLEdBQUcsb0lBQW9JLENBQUM7Z0JBQ3BKLElBQU0sU0FBUyxHQUFHLFVBQUEsQ0FBQyxJQUFJLE9BQUEsSUFBSSxDQUFDLEtBQUssQ0FBRSxJQUFJLENBQUMsTUFBTSxFQUFHLEdBQUcsQ0FBQyxDQUFFLEVBQWhDLENBQWdDLENBQUM7Z0JBQ3hELElBQU0sUUFBUSxHQUFHO29CQUNiLDBEQUFhO29CQUNiLDBEQUFhO29CQUNiLDBEQUFhO2lCQUNoQixDQUFDO2dCQUVGLElBQU0sUUFBUSxHQUFHO29CQUNiLE1BQU07b0JBQ04sTUFBTTtpQkFDVCxDQUFDO2dCQUNGLElBQU0sV0FBVyxHQUFHLFFBQVE7cUJBQ3ZCLEdBQUcsQ0FBRSxVQUFBLENBQUM7b0JBQ0gsSUFBTSxTQUFTLEdBQUcsU0FBUyxDQUFFLFFBQVEsQ0FBQyxNQUFNLENBQUUsQ0FBQztvQkFDL0MsT0FBTzt3QkFDSCxNQUFNLEVBQUUsQ0FBQzt3QkFDVCxJQUFJLEVBQUUsUUFBUSxDQUFFLFNBQVMsQ0FBRTtxQkFDOUIsQ0FBQTtnQkFDTCxDQUFDLENBQUMsQ0FBQTtnQkFDTixPQUFPLFdBQVcsQ0FBQztZQUV2QixDQUFDO1lBR0QsU0FBUztnQkFDTCxJQUFNLE1BQU0sR0FBRyxvSUFBb0ksQ0FBQztnQkFDcEosSUFBTSxNQUFNLEdBQUcsOEhBQThILENBQUM7Z0JBRTlJLElBQU0sU0FBUyxHQUFHLFVBQUEsQ0FBQyxJQUFJLE9BQUEsSUFBSSxDQUFDLEtBQUssQ0FBRSxJQUFJLENBQUMsTUFBTSxFQUFHLEdBQUcsQ0FBQyxDQUFFLEVBQWhDLENBQWdDLENBQUM7Z0JBQ3hELElBQU0sUUFBUSxHQUFHO29CQUNiLG9CQUFLO29CQUNMLG9CQUFLO29CQUNMLG9CQUFLO29CQUNMLFNBQUk7b0JBQ0osU0FBSTtvQkFDSixTQUFJO2lCQUNQLENBQUM7Z0JBRUYsSUFBTSxDQUFDLEdBQUc7b0JBQ047d0JBQ0ksTUFBTSxFQUFFLEdBQUc7d0JBQ1gsS0FBSyxFQUFFLEVBQUU7d0JBQ1QsVUFBVSxFQUFFLEVBQUU7d0JBQ2QsS0FBSyxFQUFFLEVBQUU7d0JBQ1QsVUFBVSxFQUFFLEVBQUU7d0JBQ2QsU0FBUyxFQUFFLEdBQUc7d0JBQ2QsS0FBSyxFQUFFLFFBQVE7d0JBQ2YsSUFBSSxFQUFFLElBQUk7d0JBQ1YsS0FBSyxFQUFFOzRCQUNIO2dDQUNJLElBQUksRUFBRSxLQUFLO2dDQUNYLE1BQU0sUUFBQTs2QkFDVCxFQUFFO2dDQUNDLElBQUksRUFBRSxLQUFLO2dDQUNYLE1BQU0sUUFBQTs2QkFDVCxFQUFFO2dDQUNDLElBQUksRUFBRSxLQUFLO2dDQUNYLE1BQU0sUUFBQTs2QkFDVCxFQUFFO2dDQUNDLElBQUksRUFBRSxLQUFLO2dDQUNYLE1BQU0sUUFBQTs2QkFDVDt5QkFDSjt3QkFDRCxVQUFVLEVBQUUsSUFBSTt3QkFDaEIsT0FBTyxFQUFFLE1BQU07d0JBQ2YsSUFBSSxFQUFFLFFBQVEsQ0FBRSxTQUFTLENBQUUsUUFBUSxDQUFDLE1BQU0sQ0FBRSxDQUFDO3dCQUM3QyxTQUFTLEVBQUUsU0FBUyxDQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFFLEdBQUcsQ0FBQztxQkFDNUMsRUFBRTt3QkFDQyxNQUFNLEVBQUUsR0FBRzt3QkFDWCxLQUFLLEVBQUUsRUFBRTt3QkFDVCxVQUFVLEVBQUUsRUFBRTt3QkFDZCxLQUFLLEVBQUUsRUFBRTt3QkFDVCxVQUFVLEVBQUUsRUFBRTt3QkFDZCxTQUFTLEVBQUUsR0FBRzt3QkFDZCxLQUFLLEVBQUUsUUFBUTt3QkFDZixJQUFJLEVBQUUsSUFBSTt3QkFDVixLQUFLLEVBQUU7NEJBQ0g7Z0NBQ0ksSUFBSSxFQUFFLEtBQUs7Z0NBQ1gsTUFBTSxRQUFBOzZCQUNULEVBQUU7Z0NBQ0MsSUFBSSxFQUFFLEtBQUs7Z0NBQ1gsTUFBTSxRQUFBOzZCQUNULEVBQUU7Z0NBQ0MsSUFBSSxFQUFFLEtBQUs7Z0NBQ1gsTUFBTSxRQUFBOzZCQUNULEVBQUU7Z0NBQ0MsSUFBSSxFQUFFLEtBQUs7Z0NBQ1gsTUFBTSxRQUFBOzZCQUNULEVBQUU7Z0NBQ0MsSUFBSSxFQUFFLEtBQUs7Z0NBQ1gsTUFBTSxRQUFBOzZCQUNULEVBQUU7Z0NBQ0MsSUFBSSxFQUFFLEtBQUs7Z0NBQ1gsTUFBTSxRQUFBOzZCQUNULEVBQUU7Z0NBQ0MsSUFBSSxFQUFFLEtBQUs7Z0NBQ1gsTUFBTSxRQUFBOzZCQUNULEVBQUU7Z0NBQ0MsSUFBSSxFQUFFLEtBQUs7Z0NBQ1gsTUFBTSxRQUFBOzZCQUNULEVBQUU7Z0NBQ0MsSUFBSSxFQUFFLEtBQUs7Z0NBQ1gsTUFBTSxRQUFBOzZCQUNUO3lCQUNKO3dCQUNELFVBQVUsRUFBRSxJQUFJO3dCQUNoQixPQUFPLEVBQUUsTUFBTTt3QkFDZixJQUFJLEVBQUUsUUFBUSxDQUFFLFNBQVMsQ0FBRSxRQUFRLENBQUMsTUFBTSxDQUFFLENBQUM7d0JBQzdDLFNBQVMsRUFBRSxTQUFTLENBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUUsR0FBRyxDQUFDO3FCQUM1QyxFQUFFO3dCQUNDLE1BQU0sRUFBRSxHQUFHO3dCQUNYLEtBQUssRUFBRSxFQUFFO3dCQUNULFVBQVUsRUFBRSxFQUFFO3dCQUNkLEtBQUssRUFBRSxFQUFFO3dCQUNULFVBQVUsRUFBRSxFQUFFO3dCQUNkLFNBQVMsRUFBRSxHQUFHO3dC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TSxHQUFHLEdBQUcsS0FBSyxDQUFDLEdBQUcsSUFBSSxrQ0FBa0MsQ0FBQztRQUM1RCxJQUFJLENBQUMsVUFBVSxFQUFHLENBQUM7UUFDbkIsSUFBSSxDQUFDLFdBQVcsRUFBRyxDQUFDO1FBRXBCLElBQUksQ0FBQyxPQUFRLENBQUM7WUFDVixHQUFHLEtBQUE7U0FDTixDQUFDLENBQUM7SUFFUCxDQUFDO0lBS0QsT0FBTyxFQUFFO0lBRVQsQ0FBQztJQUtELE1BQU0sRUFBRTtJQUVSLENBQUM7SUFLRCxNQUFNLEVBQUU7SUFFUixDQUFDO0lBS0QsUUFBUSxFQUFFO0lBRVYsQ0FBQztJQUtELGlCQUFpQixFQUFFO0lBRW5CLENBQUM7SUFLRCxhQUFhLEVBQUU7SUFFZixDQUFDO0lBS0QsaUJBQWlCLEVBQUUsVUFBVyxDQUFDO1FBQ25CLElBQUEsbUJBQUcsQ0FBZTtRQUMxQixPQUFPO1lBQ0gsSUFBSSxFQUFFLGtDQUFnQyxHQUFLO1lBQzNDLEtBQUssRUFBRSxlQUFlO1NBQ3pCLENBQUE7SUFDTCxDQUFDO0NBQ0YsQ0FBQyxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiXG5pbXBvcnQgeyBodHRwIH0gZnJvbSAnLi4vLi4vdXRpbC9odHRwLmpzJztcbmltcG9ydCB7IGNvbXB1dGVkIH0gZnJvbSAnLi4vLi4vbGliL3Z1ZWZ5L2luZGV4LmpzJztcbmltcG9ydCB7IGRlbGF5ZXJpbmdHb29kIH0gZnJvbSAnLi4vLi4vdXRpbC9nb29kcy5qcyc7XG5pbXBvcnQgeyBuYXZUbyB9IGZyb20gJy4uLy4uL3V0aWwvcm91dGUuanMnO1xuXG5jb25zdCBhcHAgPSBnZXRBcHA8YW55PiggKTtcblxuUGFnZSh7XG5cbiAgICBkYXRhOiB7XG5cbiAgICAgICAgdGlkOiAnJyxcblxuICAgICAgICAvKipcbiAgICAgICAgICog5Yqg6L29XG4gICAgICAgICAqL1xuICAgICAgICBsb2FkaW5nOiBmYWxzZSxcblxuICAgICAgICAvKipcbiAgICAgICAgICog5YW25LuW5Lq65riF5Y2V55qEIHN3aXBlclxuICAgICAgICAgKi9cbiAgICAgICAgc3dpcGVySW5kZXg6IDAsXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIOaYr+WQpuWxleekuuW8ueW5lVxuICAgICAgICAgKi9cbiAgICAgICAgc2hvd0Rhbm11OiBmYWxzZVxuXG4gICAgfSxcblxuICAgIHJ1bkNvbXB1dGVkKCApIHtcbiAgICAgICAgY29tcHV0ZWQoIHRoaXMsIHtcblxuICAgICAgICAgICAgLy8g6LSt5Lmw6K6w5b2VICsg56S+5Lqk5bGe5oCn5qih5Z2XXG4gICAgICAgICAgICBzb2NpYWwkKCApIHtcbiAgICAgICAgICAgICAgICBjb25zdCBhdmF0YXIgPSAnaHR0cHM6Ly93eC5xbG9nby5jbi9tbW9wZW4vdmlfMzIvSWVqTVZaVEc4V2xpYkhpY0hJVlFocWNOZUM0dUJ4a3pIMEZGVGJSTE1pY3hpYjh3cnhSUldvSlkzZ3ZjdHlsQVRkbUFQaGlhVmljVTRzSDBOcHRTc3pCZHlIaWFBLzEzMic7XG4gICAgICAgICAgICAgICAgY29uc3QgZ2V0UmFuZG9tID0gbiA9PiBNYXRoLmZsb29yKCBNYXRoLnJhbmRvbSggKSAqIG4gKTtcbiAgICAgICAgICAgICAgICBjb25zdCBhbGxUZXh0cyA9IFtcbiAgICAgICAgICAgICAgICAgICAgYOajkiEg5ou85Zui55qE576k5Y+L55yf57uZ5YqbYCxcbiAgICAgICAgICAgICAgICAgICAgYOWThyEg5ZKM576k5Y+L5ou85Zui5aW95YiS566XYCxcbiAgICAgICAgICAgICAgICAgICAgYOWTiCEg5LiL5qyh57un57ut55So576k5ou85ZuiYFxuICAgICAgICAgICAgICAgIF07XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgY29uc3QgdmlzaXRvcnMgPSBbXG4gICAgICAgICAgICAgICAgICAgIGF2YXRhcixcbiAgICAgICAgICAgICAgICAgICAgYXZhdGFyXG4gICAgICAgICAgICAgICAgXTtcbiAgICAgICAgICAgICAgICBjb25zdCBhbGxWaXNpdG9ycyA9IHZpc2l0b3JzXG4gICAgICAgICAgICAgICAgICAgIC5tYXAoIHggPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgcmFuZG9tTnVtID0gZ2V0UmFuZG9tKCBhbGxUZXh0cy5sZW5ndGggKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYXZhdGFyOiB4LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRleHQ6IGFsbFRleHRzWyByYW5kb21OdW0gXVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIHJldHVybiBhbGxWaXNpdG9ycztcblxuICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAgLy8g5Liq5Lq66LSt54mp5riF5Y2VXG4gICAgICAgICAgICBwZXJzb25hbCQoICkge1xuICAgICAgICAgICAgICAgIGNvbnN0IGF2YXRhciA9ICdodHRwczovL3d4LnFsb2dvLmNuL21tb3Blbi92aV8zMi9JZWpNVlpURzhXbGliSGljSElWUWhxY05lQzR1QnhrekgwRkZUYlJMTWljeGliOHdyeFJSV29KWTNndmN0eWxBVGRtQVBoaWFWaWNVNHNIME5wdFNzekJkeUhpYUEvMTMyJztcbiAgICAgICAgICAgICAgICBjb25zdCBpbWdVcmwgPSAnaHR0cHM6Ly93eDYwYmY3Zjc0NWNlMzFlZjAtMTI1Nzc2NDU2Ny5jb3MuYXAtZ3Vhbmd6aG91Lm15cWNsb3VkLmNvbS90bXBfN2UyNGQwOTA5ZDM0MWU4MTI5NjhiODNjZTVhMzI4ZDEwMmJjMWIxNzRhMzc0ZjRlLmpwZyc7XG5cbiAgICAgICAgICAgICAgICBjb25zdCBnZXRSYW5kb20gPSBuID0+IE1hdGguZmxvb3IoIE1hdGgucmFuZG9tKCApICogbiApO1xuICAgICAgICAgICAgICAgIGNvbnN0IGFsbFRleHRzID0gW1xuICAgICAgICAgICAgICAgICAgICBg55yf57uZ5YqbYCxcbiAgICAgICAgICAgICAgICAgICAgYOiwouiwouS9oGAsXG4gICAgICAgICAgICAgICAgICAgIGDliJLnrpfvvZ5gLFxuICAgICAgICAgICAgICAgICAgICBg5qOSIWAsXG4gICAgICAgICAgICAgICAgICAgIGDotZ4hYCxcbiAgICAgICAgICAgICAgICAgICAgYOi1miFgXG4gICAgICAgICAgICAgICAgXTtcblxuICAgICAgICAgICAgICAgIGNvbnN0IHIgPSBbXG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGdvb2RJZDogJzEnLFxuICAgICAgICAgICAgICAgICAgICAgICAgZGVsdGE6IDE1LFxuICAgICAgICAgICAgICAgICAgICAgICAgdG90YWxEZWx0YTogNDUsXG4gICAgICAgICAgICAgICAgICAgICAgICBwcmljZTogODYsXG4gICAgICAgICAgICAgICAgICAgICAgICBncm91cFByaWNlOiA3MSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGZhZGVQcmljZTogMTI4LFxuICAgICAgICAgICAgICAgICAgICAgICAgdGl0bGU6ICdTS1TmiqTogqTpnJwnLFxuICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogJ+e6ouiJsicsXG4gICAgICAgICAgICAgICAgICAgICAgICBidXllcjogW1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogJ3h4eCcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGF2YXRhclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogJ3l5eScsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGF2YXRhclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogJ3p6eicsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGF2YXRhclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogJ3h4eCcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGF2YXRhclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgICAgICAgICBwaW5TdWNjZXNzOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICAgICAgZ29vZEltZzogaW1nVXJsLFxuICAgICAgICAgICAgICAgICAgICAgICAgdGlwczogYWxsVGV4dHNbIGdldFJhbmRvbSggYWxsVGV4dHMubGVuZ3RoICldLFxuICAgICAgICAgICAgICAgICAgICAgICAgdGlwc0luZGV4OiBnZXRSYW5kb20oIDkgPiA0ID8gMyA6IDkgKSArIDFcbiAgICAgICAgICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICAgICAgICAgICAgZ29vZElkOiAnMScsXG4gICAgICAgICAgICAgICAgICAgICAgICBkZWx0YTogMTUsXG4gICAgICAgICAgICAgICAgICAgICAgICB0b3RhbERlbHRhOiA0NSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHByaWNlOiA4NixcbiAgICAgICAgICAgICAgICAgICAgICAgIGdyb3VwUHJpY2U6IDcxLFxuICAgICAgICAgICAgICAgICAgICAgICAgZmFkZVByaWNlOiAxMjgsXG4gICAgICAgICAgICAgICAgICAgICAgICB0aXRsZTogJ1NLVOaKpOiCpOmcnCcsXG4gICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiAn57qi6ImyJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGJ1eWVyOiBbXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiAneHh4JyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYXZhdGFyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiAneXl5JyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYXZhdGFyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiAnenp6JyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYXZhdGFyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiAneHh4JyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYXZhdGFyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiAneXl5JyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYXZhdGFyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiAnenp6JyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYXZhdGFyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiAneHh4JyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYXZhdGFyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiAneXl5JyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYXZhdGFyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiAnenp6JyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYXZhdGFyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHBpblN1Y2Nlc3M6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgICAgICBnb29kSW1nOiBpbWdVcmwsXG4gICAgICAgICAgICAgICAgICAgICAgICB0aXBzOiBhbGxUZXh0c1sgZ2V0UmFuZG9tKCBhbGxUZXh0cy5sZW5ndGggKV0sXG4gICAgICAgICAgICAgICAgICAgICAgICB0aXBzSW5kZXg6IGdldFJhbmRvbSggOSA+IDQgPyAzIDogOSApICsgMVxuICAgICAgICAgICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgICAgICAgICBnb29kSWQ6ICcxJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGRlbHRhOiAxNSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHRvdGFsRGVsdGE6IDQ1LFxuICAgICAgICAgICAgICAgICAgICAgICAgcHJpY2U6IDg2LFxuICAgICAgICAgICAgICAgICAgICAgICAgZ3JvdXBQcmljZTogNzEsXG4gICAgICAgICAgICAgICAgICAgICAgICBmYWRlUHJpY2U6IDEyOCxcbiAgICAgICAgICAgICAgICAgICAgICAgIHRpdGxlOiAnU0tU5oqk6IKk6ZycJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6ICfnuqLoibInLFxuICAgICAgICAgICAgICAgICAgICAgICAgYnV5ZXI6IFtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6ICd4eHgnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhdmF0YXJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6ICd5eXknLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhdmF0YXJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6ICd6enonLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhdmF0YXJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6ICd4eHgnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhdmF0YXJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgICAgICAgICAgcGluU3VjY2VzczogZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgICAgICBnb29kSW1nOiBpbWdVcmwsXG4gICAgICAgICAgICAgICAgICAgICAgICB0aXBzOiBhbGxUZXh0c1sgZ2V0UmFuZG9tKCBhbGxUZXh0cy5sZW5ndGggKV0sXG4gICAgICAgICAgICAgICAgICAgICAgICB0aXBzSW5kZXg6IGdldFJhbmRvbSggOSA+IDQgPyAzIDogOSApICsgMVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgXTtcbiAgICAgICAgICAgICAgICByZXR1cm4gcjtcbiAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgIC8vIOWFtuS7luS6uueahOi0reeJqea4heWNlVxuICAgICAgICAgICAgb3RoZXJzJCggKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgYXZhdGFyID0gJ2h0dHBzOi8vd3gucWxvZ28uY24vbW1vcGVuL3ZpXzMyL0llak1WWlRHOFdsaWJIaWNISVZRaHFjTmVDNHVCeGt6SDBGRlRiUkxNaWN4aWI4d3J4UlJXb0pZM2d2Y3R5bEFUZG1BUGhpYVZpY1U0c0gwTnB0U3N6QmR5SGlhQS8xMzInO1xuICAgICAgICAgICAgICAgIGNvbnN0IGltZ1VybCA9ICdodHRwczovL3d4NjBiZjdmNzQ1Y2UzMWVmMC0xMjU3NzY0NTY3LmNvcy5hcC1ndWFuZ3pob3UubXlxY2xvdWQuY29tL3RtcF83ZTI0ZDA5MDlkMzQxZTgxMjk2OGI4M2NlNWEzMjhkMTAyYmMxYjE3NGEzNzRmNGUuanBnJztcbiAgICAgICAgICAgICAgICBjb25zdCByID0gW1xuICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICBnb29kSWQ6ICcxJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGRlbHRhOiAxNSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHRvdGFsRGVsdGE6IDQ1LFxuICAgICAgICAgICAgICAgICAgICAgICAgcHJpY2U6IDg2LFxuICAgICAgICAgICAgICAgICAgICAgICAgZ3JvdXBQcmljZTogNzEsXG4gICAgICAgICAgICAgICAgICAgICAgICBmYWRlUHJpY2U6IDEyOCxcbiAgICAgICAgICAgICAgICAgICAgICAgIHRpdGxlOiAnU0tU5oqk6IKk6ZycJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6ICfnuqLoibInLFxuICAgICAgICAgICAgICAgICAgICAgICAgYnV5ZXI6IFtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6ICd4eHgnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhdmF0YXJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6ICd5eXknLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhdmF0YXJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6ICd6enonLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhdmF0YXJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6ICd4eHgnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhdmF0YXJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgICAgICAgICAgcGluU3VjY2VzczogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGdvb2RJbWc6IGltZ1VybFxuICAgICAgICAgICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgICAgICAgICBnb29kSWQ6ICcxJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGRlbHRhOiAxNSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHRvdGFsRGVsdGE6IDQ1LFxuICAgICAgICAgICAgICAgICAgICAgICAgcHJpY2U6IDg2LFxuICAgICAgICAgICAgICAgICAgICAgICAgZ3JvdXBQcmljZTogNzEsXG4gICAgICAgICAgICAgICAgICAgICAgICBmYWRlUHJpY2U6IDEyOCxcbiAgICAgICAgICAgICAgICAgICAgICAgIHRpdGxlOiAnU0tU5oqk6IKk6ZycJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6ICfnuqLoibInLFxuICAgICAgICAgICAgICAgICAgICAgICAgYnV5ZXI6IFtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6ICd4eHgnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhdmF0YXJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6ICd5eXknLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhdmF0YXJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6ICd6enonLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhdmF0YXJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6ICd4eHgnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhdmF0YXJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6ICd5eXknLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhdmF0YXJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6ICd6enonLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhdmF0YXJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6ICd4eHgnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhdmF0YXJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6ICd5eXknLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhdmF0YXJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6ICd6enonLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhdmF0YXJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgICAgICAgICAgcGluU3VjY2VzczogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGdvb2RJbWc6IGltZ1VybFxuICAgICAgICAgICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgICAgICAgICBnb29kSWQ6ICcxJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGRlbHRhOiAxNSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHRvdGFsRGVsdGE6IDQ1LFxuICAgICAgICAgICAgICAgICAgICAgICAgcHJpY2U6IDg2LFxuICAgICAgICAgICAgICAgICAgICAgICAgZ3JvdXBQcmljZTogNzEsXG4gICAgICAgICAgICAgICAgICAgICAgICBmYWRlUHJpY2U6IDEyOCxcbiAgICAgICAgICAgICAgICAgICAgICAgIHRpdGxlOiAnU0tU5oqk6IKk6ZycJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6ICfnuqLoibInLFxuICAgICAgICAgICAgICAgICAgICAgICAgYnV5ZXI6IFtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6ICd4eHgnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhdmF0YXJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6ICd5eXknLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhdmF0YXJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6ICd6enonLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhdmF0YXJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6ICd4eHgnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhdmF0YXJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgICAgICAgICAgcGluU3VjY2VzczogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGdvb2RJbWc6IGltZ1VybFxuICAgICAgICAgICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgICAgICAgICBnb29kSWQ6ICcxJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGRlbHRhOiAxNSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHRvdGFsRGVsdGE6IDQ1LFxuICAgICAgICAgICAgICAgICAgICAgICAgcHJpY2U6IDg2LFxuICAgICAgICAgICAgICAgICAgICAgICAgZ3JvdXBQcmljZTogNzEsXG4gICAgICAgICAgICAgICAgICAgICAgICBmYWRlUHJpY2U6IDEyOCxcbiAgICAgICAgICAgICAgICAgICAgICAgIHRpdGxlOiAnU0tU5oqk6IKk6ZycJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6ICfnuqLoibInLFxuICAgICAgICAgICAgICAgICAgICAgICAgYnV5ZXI6IFtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6ICd4eHgnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhdmF0YXJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6ICd5eXknLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhdmF0YXJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6ICd6enonLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhdmF0YXJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6ICd4eHgnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhdmF0YXJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6ICd5eXknLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhdmF0YXJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6ICd6enonLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhdmF0YXJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6ICd4eHgnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhdmF0YXJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6ICd5eXknLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhdmF0YXJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6ICd6enonLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhdmF0YXJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgICAgICAgICAgcGluU3VjY2VzczogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGdvb2RJbWc6IGltZ1VybFxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgXTtcbiAgICAgICAgICAgICAgICByZXR1cm4gcjsgXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfSk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIOebkeWQrHN0b3JlXG4gICAgICovXG4gICAgd2F0Y2hTdG9yZSggKSB7XG4gICAgICAgIGFwcC53YXRjaCQoJ2FwcENvbmZpZycsIHZhbCA9PiB7XG4gICAgICAgICAgICBpZiAoICF2YWwgKSB7IHJldHVybjsgfVxuICAgICAgICAgICAgdGhpcy5zZXRUaXRsZShgJHt2YWxbJ2lwLW5hbWUnXX3nvqTmi7zlm6JgKVxuICAgICAgICB9KTtcbiAgICB9LFxuXG4gICAgLyoqIFxuICAgICAqIOiuvue9ruagh+mimFxuICAgICAqL1xuICAgIHNldFRpdGxlKCB0aXRsZTogc3RyaW5nICkge1xuICAgICAgICBpZiAoICF0aXRsZSApIHsgcmV0dXJuOyB9XG4gICAgICAgIHd4LnNldE5hdmlnYXRpb25CYXJUaXRsZSh7XG4gICAgICAgICAgICB0aXRsZVxuICAgICAgICB9KTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogc3dpcGVy55uR5ZCsXG4gICAgICovXG4gICAgb25Td2lwZXIoIGU6IGFueSApIHtcbiAgICAgICAgY29uc3QgeyBjdXJyZW50IH0gPSBlLmRldGFpbDtcbiAgICAgICAgdGhpcy5zZXREYXRhISh7XG4gICAgICAgICAgICBzd2lwZXJJbmRleDogY3VycmVudFxuICAgICAgICB9KTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICog6aG16Z2i5rua5YqoXG4gICAgICovXG4gICAgb25TY3JvbGwoIGU6IGFueSApIHtcbiAgICAgICAgY29uc3QgeyBzaG93RGFubXUgfSA9IHRoaXMuZGF0YTtcbiAgICAgICAgY29uc3QgeyBzY3JvbGxUb3AgfSA9IGUuZGV0YWlsO1xuICAgICAgICBpZiAoICEhc2hvd0Rhbm11ICkgeyByZXR1cm47IH0gXG5cbiAgICAgICAgaWYgKCBzY3JvbGxUb3AgPiAxMDAgKSB7XG4gICAgICAgICAgICB0aGlzLnNldERhdGEhKHtcbiAgICAgICAgICAgICAgICBzaG93RGFubXU6IHRydWVcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIHRpZCDooYznqItpZFxuICAgICAqL1xuICAgIG9uTG9hZDogZnVuY3Rpb24gKCBxdWVyeTogYW55ICkge1xuICAgICAgICBjb25zdCB0aWQgPSBxdWVyeS50aWQgfHwgXCJlOGY4NjNiYTVkZTYyNDE0MDAwNzY5MjE0NDFiYzhkNVwiO1xuICAgICAgICB0aGlzLndhdGNoU3RvcmUoICk7XG4gICAgICAgIHRoaXMucnVuQ29tcHV0ZWQoICk7XG4gICAgICAgIFxuICAgICAgICB0aGlzLnNldERhdGEhKHtcbiAgICAgICAgICAgIHRpZFxuICAgICAgICB9KTtcblxuICAgIH0sXG4gIFxuICAgIC8qKlxuICAgICAqIOeUn+WRveWRqOacn+WHveaVsC0t55uR5ZCs6aG16Z2i5Yid5qyh5riy5p+T5a6M5oiQXG4gICAgICovXG4gICAgb25SZWFkeTogZnVuY3Rpb24gKCApIHtcblxuICAgIH0sXG4gIFxuICAgIC8qKlxuICAgICAqIOeUn+WRveWRqOacn+WHveaVsC0t55uR5ZCs6aG16Z2i5pi+56S6XG4gICAgICovXG4gICAgb25TaG93OiBmdW5jdGlvbiAoICkge1xuXG4gICAgfSxcbiAgXG4gICAgLyoqXG4gICAgICog55Sf5ZG95ZGo5pyf5Ye95pWwLS3nm5HlkKzpobXpnaLpmpDol49cbiAgICAgKi9cbiAgICBvbkhpZGU6IGZ1bmN0aW9uICgpIHtcbiAgXG4gICAgfSxcbiAgXG4gICAgLyoqXG4gICAgICog55Sf5ZG95ZGo5pyf5Ye95pWwLS3nm5HlkKzpobXpnaLljbjovb1cbiAgICAgKi9cbiAgICBvblVubG9hZDogZnVuY3Rpb24gKCkge1xuICBcbiAgICB9LFxuICBcbiAgICAvKipcbiAgICAgKiDpobXpnaLnm7jlhbPkuovku7blpITnkIblh73mlbAtLeebkeWQrOeUqOaIt+S4i+aLieWKqOS9nFxuICAgICAqL1xuICAgIG9uUHVsbERvd25SZWZyZXNoOiBmdW5jdGlvbiAoKSB7XG4gIFxuICAgIH0sXG4gIFxuICAgIC8qKlxuICAgICAqIOmhtemdouS4iuaLieinpuW6leS6i+S7tueahOWkhOeQhuWHveaVsFxuICAgICAqL1xuICAgIG9uUmVhY2hCb3R0b206IGZ1bmN0aW9uICgpIHtcbiAgXG4gICAgfSxcbiAgXG4gICAgLyoqXG4gICAgICog55So5oi354K55Ye75Y+z5LiK6KeS5YiG5LqrXG4gICAgICovXG4gICAgb25TaGFyZUFwcE1lc3NhZ2U6IGZ1bmN0aW9uICggZSApIHtcbiAgICAgICAgY29uc3QgeyB0aWQgfSA9IHRoaXMuZGF0YTtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHBhdGg6IGAvcGFnZXMvdHJpcC1yZXdhcmQvaW5kZXg/dGlkPSR7dGlkfWAsXG4gICAgICAgICAgICB0aXRsZTogJ+WbnuaKpee+pOWPi+WVpu+9nuWFjei0uemihuaKteeOsOmHke+8gSdcbiAgICAgICAgfVxuICAgIH1cbiAgfSkiXX0=