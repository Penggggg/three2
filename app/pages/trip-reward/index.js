"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var index_js_1 = require("../../lib/vuefy/index.js");
var app = getApp();
Page({
    data: {
        loading: false,
        swiperIndex: 0
    },
    runComputed: function () {
        index_js_1.computed(this, {
            social$: function () {
                var avatar = 'https://wx.qlogo.cn/mmopen/vi_32/IejMVZTG8WlibHicHIVQhqcNeC4uBxkzH0FFTbRLMicxib8wrxRRWoJY3gvctylATdmAPhiaVicU4sH0NptSszBdyHiaA/132';
                var getRandom = function (n) { return Math.floor(Math.random() * n); };
                var allTexts = [
                    "\u68D2! \u62FC\u56E2\u7684\u7FA4\u53CB\u771F\u7ED9\u529B",
                    "\u54C7! \u548C\u7FA4\u53CB\u62FC\u56E2\u771F\u5212\u7B97",
                    "\u54C8! \u4E0B\u6B21\u7EE7\u7EED\u548C\u7FA4\u53CB\u62FC\u56E2"
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
    onLoad: function (options) {
        this.watchStore();
        this.runComputed();
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
        return {};
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUVBLHFEQUFvRDtBQUlwRCxJQUFNLEdBQUcsR0FBRyxNQUFNLEVBQVEsQ0FBQztBQUUzQixJQUFJLENBQUM7SUFFRCxJQUFJLEVBQUU7UUFLRixPQUFPLEVBQUUsS0FBSztRQUtkLFdBQVcsRUFBRSxDQUFDO0tBRWpCO0lBRUQsV0FBVztRQUNQLG1CQUFRLENBQUUsSUFBSSxFQUFFO1lBR1osT0FBTztnQkFDSCxJQUFNLE1BQU0sR0FBRyxvSUFBb0ksQ0FBQztnQkFDcEosSUFBTSxTQUFTLEdBQUcsVUFBQSxDQUFDLElBQUksT0FBQSxJQUFJLENBQUMsS0FBSyxDQUFFLElBQUksQ0FBQyxNQUFNLEVBQUcsR0FBRyxDQUFDLENBQUUsRUFBaEMsQ0FBZ0MsQ0FBQztnQkFDeEQsSUFBTSxRQUFRLEdBQUc7b0JBQ2IsMERBQWE7b0JBQ2IsMERBQWE7b0JBQ2IsZ0VBQWM7aUJBQ2pCLENBQUM7Z0JBRUYsSUFBTSxRQUFRLEdBQUc7b0JBQ2IsTUFBTTtvQkFDTixNQUFNO2lCQUNULENBQUM7Z0JBQ0YsSUFBTSxXQUFXLEdBQUcsUUFBUTtxQkFDdkIsR0FBRyxDQUFFLFVBQUEsQ0FBQztvQkFDSCxJQUFNLFNBQVMsR0FBRyxTQUFTLENBQUUsUUFBUSxDQUFDLE1BQU0sQ0FBRSxDQUFDO29CQUMvQyxPQUFPO3dCQUNILE1BQU0sRUFBRSxDQUFDO3dCQUNULElBQUksRUFBRSxRQUFRLENBQUUsU0FBUyxDQUFFO3FCQUM5QixDQUFBO2dCQUNMLENBQUMsQ0FBQyxDQUFBO2dCQUNOLE9BQU8sV0FBVyxDQUFDO1lBRXZCLENBQUM7WUFHRCxTQUFTO2dCQUNMLElBQU0sTUFBTSxHQUFHLG9JQUFvSSxDQUFDO2dCQUNwSixJQUFNLE1BQU0sR0FBRyw4SEFBOEgsQ0FBQztnQkFDOUksSUFBTSxDQUFDLEdBQUc7b0JBQ047d0JBQ0ksTUFBTSxFQUFFLEdBQUc7d0JBQ1gsS0FBSyxFQUFFLEVBQUU7d0JBQ1QsVUFBVSxFQUFFLEVBQUU7d0JBQ2QsS0FBSyxFQUFFLEVBQUU7d0JBQ1QsVUFBVSxFQUFFLEVBQUU7d0JBQ2QsU0FBUyxFQUFFLEdBQUc7d0JBQ2QsS0FBSyxFQUFFLFFBQVE7d0JBQ2YsSUFBSSxFQUFFLElBQUk7d0JBQ1YsS0FBSyxFQUFFOzRCQUNIO2dDQUNJLElBQUksRUFBRSxLQUFLO2dDQUNYLE1BQU0sUUFBQTs2QkFDVCxFQUFFO2dDQUNDLElBQUksRUFBRSxLQUFLO2dDQUNYLE1BQU0sUUFBQTs2QkFDVCxFQUFFO2dDQUNDLElBQUksRUFBRSxLQUFLO2dDQUNYLE1BQU0sUUFBQTs2QkFDVCxFQUFFO2dDQUNDLElBQUksRUFBRSxLQUFLO2dDQUNYLE1BQU0sUUFBQTs2QkFDVDt5QkFDSjt3QkFDRCxVQUFVLEVBQUUsSUFBSTt3QkFDaEIsT0FBTyxFQUFFLE1BQU07cUJBQ2xCLEVBQUU7d0JBQ0MsTUFBTSxFQUFFLEdBQUc7d0JBQ1gsS0FBSyxFQUFFLEVBQUU7d0JBQ1QsVUFBVSxFQUFFLEVBQUU7d0JBQ2QsS0FBSyxFQUFFLEVBQUU7d0JBQ1QsVUFBVSxFQUFFLEVBQUU7d0JBQ2QsU0FBUyxFQUFFLEdBQUc7d0JBQ2QsS0FBSyxFQUFFLFFBQVE7d0JBQ2YsSUFBSSxFQUFFLElBQUk7d0JBQ1YsS0FBSyxFQUFFOzRCQUNIO2dDQUNJLElBQUksRUFBRSxLQUFLO2dDQUNYLE1BQU0sUUFBQTs2QkFDVCxFQUFFO2dDQUNDLElBQUksRUFBRSxLQUFLO2dDQUNYLE1BQU0sUUFBQTs2QkFDVCxFQUFFO2dDQUNDLElBQUksRUFBRSxLQUFLO2dDQUNYLE1BQU0sUUFBQTs2QkFDVCxFQUFFO2dDQUNDLElBQUksRUFBRSxLQUFLO2dDQUNYLE1BQU0sUUFBQTs2QkFDVCxFQUFFO2dDQUNDLElBQUksRUFBRSxLQUFLO2dDQUNYLE1BQU0sUUFBQTs2QkFDVCxFQUFFO2dDQUNDLElBQUksRUFBRSxLQUFLO2dDQUNYLE1BQU0sUUFBQTs2QkFDVCxFQUFF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QUc7WUFDdkIsSUFBSyxDQUFDLEdBQUcsRUFBRztnQkFBRSxPQUFPO2FBQUU7WUFDdkIsS0FBSSxDQUFDLFFBQVEsQ0FBSSxHQUFHLENBQUMsU0FBUyxDQUFDLHVCQUFLLENBQUMsQ0FBQTtRQUN6QyxDQUFDLENBQUMsQ0FBQztJQUNQLENBQUM7SUFLRCxRQUFRLFlBQUUsS0FBYTtRQUNuQixJQUFLLENBQUMsS0FBSyxFQUFHO1lBQUUsT0FBTztTQUFFO1FBQ3pCLEVBQUUsQ0FBQyxxQkFBcUIsQ0FBQztZQUNyQixLQUFLLE9BQUE7U0FDUixDQUFDLENBQUM7SUFDUCxDQUFDO0lBS0QsUUFBUSxZQUFFLENBQU07UUFDSixJQUFBLDBCQUFPLENBQWM7UUFDN0IsSUFBSSxDQUFDLE9BQVEsQ0FBQztZQUNWLFdBQVcsRUFBRSxPQUFPO1NBQ3ZCLENBQUMsQ0FBQztJQUNQLENBQUM7SUFFRCxNQUFNLEVBQUUsVUFBVSxPQUFPO1FBQ3JCLElBQUksQ0FBQyxVQUFVLEVBQUcsQ0FBQztRQUNuQixJQUFJLENBQUMsV0FBVyxFQUFHLENBQUM7SUFDeEIsQ0FBQztJQUtELE9BQU8sRUFBRTtJQUVULENBQUM7SUFLRCxNQUFNLEVBQUU7SUFFUixDQUFDO0lBS0QsTUFBTSxFQUFFO0lBRVIsQ0FBQztJQUtELFFBQVEsRUFBRTtJQUVWLENBQUM7SUFLRCxpQkFBaUIsRUFBRTtJQUVuQixDQUFDO0lBS0QsYUFBYSxFQUFFO0lBRWYsQ0FBQztJQUtELGlCQUFpQixFQUFFLFVBQVcsQ0FBQztRQUMzQixPQUFPLEVBQ04sQ0FBQTtJQUNMLENBQUM7Q0FDRixDQUFDLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJcbmltcG9ydCB7IGh0dHAgfSBmcm9tICcuLi8uLi91dGlsL2h0dHAuanMnO1xuaW1wb3J0IHsgY29tcHV0ZWQgfSBmcm9tICcuLi8uLi9saWIvdnVlZnkvaW5kZXguanMnO1xuaW1wb3J0IHsgZGVsYXllcmluZ0dvb2QgfSBmcm9tICcuLi8uLi91dGlsL2dvb2RzLmpzJztcbmltcG9ydCB7IG5hdlRvIH0gZnJvbSAnLi4vLi4vdXRpbC9yb3V0ZS5qcyc7XG5cbmNvbnN0IGFwcCA9IGdldEFwcDxhbnk+KCApO1xuXG5QYWdlKHtcblxuICAgIGRhdGE6IHtcblxuICAgICAgICAvKipcbiAgICAgICAgICog5Yqg6L29XG4gICAgICAgICAqL1xuICAgICAgICBsb2FkaW5nOiBmYWxzZSxcblxuICAgICAgICAvKipcbiAgICAgICAgICog5YW25LuW5Lq65riF5Y2V55qEIHN3aXBlclxuICAgICAgICAgKi9cbiAgICAgICAgc3dpcGVySW5kZXg6IDBcblxuICAgIH0sXG5cbiAgICBydW5Db21wdXRlZCggKSB7XG4gICAgICAgIGNvbXB1dGVkKCB0aGlzLCB7XG5cbiAgICAgICAgICAgIC8vIOi0reS5sOiusOW9lSArIOekvuS6pOWxnuaAp+aooeWdl1xuICAgICAgICAgICAgc29jaWFsJCggKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgYXZhdGFyID0gJ2h0dHBzOi8vd3gucWxvZ28uY24vbW1vcGVuL3ZpXzMyL0llak1WWlRHOFdsaWJIaWNISVZRaHFjTmVDNHVCeGt6SDBGRlRiUkxNaWN4aWI4d3J4UlJXb0pZM2d2Y3R5bEFUZG1BUGhpYVZpY1U0c0gwTnB0U3N6QmR5SGlhQS8xMzInO1xuICAgICAgICAgICAgICAgIGNvbnN0IGdldFJhbmRvbSA9IG4gPT4gTWF0aC5mbG9vciggTWF0aC5yYW5kb20oICkgKiBuICk7XG4gICAgICAgICAgICAgICAgY29uc3QgYWxsVGV4dHMgPSBbXG4gICAgICAgICAgICAgICAgICAgIGDmo5IhIOaLvOWboueahOe+pOWPi+ecn+e7meWKm2AsXG4gICAgICAgICAgICAgICAgICAgIGDlk4chIOWSjOe+pOWPi+aLvOWbouecn+WIkueul2AsXG4gICAgICAgICAgICAgICAgICAgIGDlk4ghIOS4i+asoee7p+e7reWSjOe+pOWPi+aLvOWbomBcbiAgICAgICAgICAgICAgICBdO1xuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIGNvbnN0IHZpc2l0b3JzID0gW1xuICAgICAgICAgICAgICAgICAgICBhdmF0YXIsXG4gICAgICAgICAgICAgICAgICAgIGF2YXRhclxuICAgICAgICAgICAgICAgIF07XG4gICAgICAgICAgICAgICAgY29uc3QgYWxsVmlzaXRvcnMgPSB2aXNpdG9yc1xuICAgICAgICAgICAgICAgICAgICAubWFwKCB4ID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHJhbmRvbU51bSA9IGdldFJhbmRvbSggYWxsVGV4dHMubGVuZ3RoICk7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGF2YXRhcjogeCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZXh0OiBhbGxUZXh0c1sgcmFuZG9tTnVtIF1cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICByZXR1cm4gYWxsVmlzaXRvcnM7XG5cbiAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgIC8vIOS4quS6uui0reeJqea4heWNlVxuICAgICAgICAgICAgcGVyc29uYWwkKCApIHtcbiAgICAgICAgICAgICAgICBjb25zdCBhdmF0YXIgPSAnaHR0cHM6Ly93eC5xbG9nby5jbi9tbW9wZW4vdmlfMzIvSWVqTVZaVEc4V2xpYkhpY0hJVlFocWNOZUM0dUJ4a3pIMEZGVGJSTE1pY3hpYjh3cnhSUldvSlkzZ3ZjdHlsQVRkbUFQaGlhVmljVTRzSDBOcHRTc3pCZHlIaWFBLzEzMic7XG4gICAgICAgICAgICAgICAgY29uc3QgaW1nVXJsID0gJ2h0dHBzOi8vd3g2MGJmN2Y3NDVjZTMxZWYwLTEyNTc3NjQ1NjcuY29zLmFwLWd1YW5nemhvdS5teXFjbG91ZC5jb20vdG1wXzdlMjRkMDkwOWQzNDFlODEyOTY4YjgzY2U1YTMyOGQxMDJiYzFiMTc0YTM3NGY0ZS5qcGcnO1xuICAgICAgICAgICAgICAgIGNvbnN0IHIgPSBbXG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGdvb2RJZDogJzEnLFxuICAgICAgICAgICAgICAgICAgICAgICAgZGVsdGE6IDE1LFxuICAgICAgICAgICAgICAgICAgICAgICAgdG90YWxEZWx0YTogNDUsXG4gICAgICAgICAgICAgICAgICAgICAgICBwcmljZTogODYsXG4gICAgICAgICAgICAgICAgICAgICAgICBncm91cFByaWNlOiA3MSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGZhZGVQcmljZTogMTI4LFxuICAgICAgICAgICAgICAgICAgICAgICAgdGl0bGU6ICdTS1TmiqTogqTpnJwnLFxuICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogJ+e6ouiJsicsXG4gICAgICAgICAgICAgICAgICAgICAgICBidXllcjogW1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogJ3h4eCcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGF2YXRhclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogJ3l5eScsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGF2YXRhclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogJ3p6eicsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGF2YXRhclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogJ3h4eCcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGF2YXRhclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgICAgICAgICBwaW5TdWNjZXNzOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICAgICAgZ29vZEltZzogaW1nVXJsXG4gICAgICAgICAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGdvb2RJZDogJzEnLFxuICAgICAgICAgICAgICAgICAgICAgICAgZGVsdGE6IDE1LFxuICAgICAgICAgICAgICAgICAgICAgICAgdG90YWxEZWx0YTogNDUsXG4gICAgICAgICAgICAgICAgICAgICAgICBwcmljZTogODYsXG4gICAgICAgICAgICAgICAgICAgICAgICBncm91cFByaWNlOiA3MSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGZhZGVQcmljZTogMTI4LFxuICAgICAgICAgICAgICAgICAgICAgICAgdGl0bGU6ICdTS1TmiqTogqTpnJwnLFxuICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogJ+e6ouiJsicsXG4gICAgICAgICAgICAgICAgICAgICAgICBidXllcjogW1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogJ3h4eCcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGF2YXRhclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogJ3l5eScsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGF2YXRhclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogJ3p6eicsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGF2YXRhclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogJ3h4eCcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGF2YXRhclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogJ3l5eScsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGF2YXRhclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogJ3p6eicsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGF2YXRhclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogJ3h4eCcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGF2YXRhclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogJ3l5eScsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGF2YXRhclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogJ3p6eicsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGF2YXRhclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgICAgICAgICBwaW5TdWNjZXNzOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICAgICAgZ29vZEltZzogaW1nVXJsXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBdO1xuICAgICAgICAgICAgICAgIHJldHVybiByO1xuICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAgLy8g5YW25LuW5Lq655qE6LSt54mp5riF5Y2VXG4gICAgICAgICAgICBvdGhlcnMkKCApIHtcbiAgICAgICAgICAgICAgICBjb25zdCBhdmF0YXIgPSAnaHR0cHM6Ly93eC5xbG9nby5jbi9tbW9wZW4vdmlfMzIvSWVqTVZaVEc4V2xpYkhpY0hJVlFocWNOZUM0dUJ4a3pIMEZGVGJSTE1pY3hpYjh3cnhSUldvSlkzZ3ZjdHlsQVRkbUFQaGlhVmljVTRzSDBOcHRTc3pCZHlIaWFBLzEzMic7XG4gICAgICAgICAgICAgICAgY29uc3QgaW1nVXJsID0gJ2h0dHBzOi8vd3g2MGJmN2Y3NDVjZTMxZWYwLTEyNTc3NjQ1NjcuY29zLmFwLWd1YW5nemhvdS5teXFjbG91ZC5jb20vdG1wXzdlMjRkMDkwOWQzNDFlODEyOTY4YjgzY2U1YTMyOGQxMDJiYzFiMTc0YTM3NGY0ZS5qcGcnO1xuICAgICAgICAgICAgICAgIGNvbnN0IHIgPSBbXG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGdvb2RJZDogJzEnLFxuICAgICAgICAgICAgICAgICAgICAgICAgZGVsdGE6IDE1LFxuICAgICAgICAgICAgICAgICAgICAgICAgdG90YWxEZWx0YTogNDUsXG4gICAgICAgICAgICAgICAgICAgICAgICBwcmljZTogODYsXG4gICAgICAgICAgICAgICAgICAgICAgICBncm91cFByaWNlOiA3MSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGZhZGVQcmljZTogMTI4LFxuICAgICAgICAgICAgICAgICAgICAgICAgdGl0bGU6ICdTS1TmiqTogqTpnJwnLFxuICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogJ+e6ouiJsicsXG4gICAgICAgICAgICAgICAgICAgICAgICBidXllcjogW1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogJ3h4eCcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGF2YXRhclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogJ3l5eScsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGF2YXRhclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogJ3p6eicsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGF2YXRhclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogJ3h4eCcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGF2YXRhclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgICAgICAgICBwaW5TdWNjZXNzOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICAgICAgZ29vZEltZzogaW1nVXJsXG4gICAgICAgICAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGdvb2RJZDogJzEnLFxuICAgICAgICAgICAgICAgICAgICAgICAgZGVsdGE6IDE1LFxuICAgICAgICAgICAgICAgICAgICAgICAgdG90YWxEZWx0YTogNDUsXG4gICAgICAgICAgICAgICAgICAgICAgICBwcmljZTogODYsXG4gICAgICAgICAgICAgICAgICAgICAgICBncm91cFByaWNlOiA3MSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGZhZGVQcmljZTogMTI4LFxuICAgICAgICAgICAgICAgICAgICAgICAgdGl0bGU6ICdTS1TmiqTogqTpnJwnLFxuICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogJ+e6ouiJsicsXG4gICAgICAgICAgICAgICAgICAgICAgICBidXllcjogW1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogJ3h4eCcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGF2YXRhclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogJ3l5eScsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGF2YXRhclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogJ3p6eicsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGF2YXRhclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogJ3h4eCcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGF2YXRhclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogJ3l5eScsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGF2YXRhclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogJ3p6eicsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGF2YXRhclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogJ3h4eCcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGF2YXRhclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogJ3l5eScsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGF2YXRhclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogJ3p6eicsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGF2YXRhclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgICAgICAgICBwaW5TdWNjZXNzOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICAgICAgZ29vZEltZzogaW1nVXJsXG4gICAgICAgICAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGdvb2RJZDogJzEnLFxuICAgICAgICAgICAgICAgICAgICAgICAgZGVsdGE6IDE1LFxuICAgICAgICAgICAgICAgICAgICAgICAgdG90YWxEZWx0YTogNDUsXG4gICAgICAgICAgICAgICAgICAgICAgICBwcmljZTogODYsXG4gICAgICAgICAgICAgICAgICAgICAgICBncm91cFByaWNlOiA3MSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGZhZGVQcmljZTogMTI4LFxuICAgICAgICAgICAgICAgICAgICAgICAgdGl0bGU6ICdTS1TmiqTogqTpnJwnLFxuICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogJ+e6ouiJsicsXG4gICAgICAgICAgICAgICAgICAgICAgICBidXllcjogW1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogJ3h4eCcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGF2YXRhclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogJ3l5eScsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGF2YXRhclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogJ3p6eicsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGF2YXRhclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogJ3h4eCcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGF2YXRhclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgICAgICAgICBwaW5TdWNjZXNzOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICAgICAgZ29vZEltZzogaW1nVXJsXG4gICAgICAgICAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGdvb2RJZDogJzEnLFxuICAgICAgICAgICAgICAgICAgICAgICAgZGVsdGE6IDE1LFxuICAgICAgICAgICAgICAgICAgICAgICAgdG90YWxEZWx0YTogNDUsXG4gICAgICAgICAgICAgICAgICAgICAgICBwcmljZTogODYsXG4gICAgICAgICAgICAgICAgICAgICAgICBncm91cFByaWNlOiA3MSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGZhZGVQcmljZTogMTI4LFxuICAgICAgICAgICAgICAgICAgICAgICAgdGl0bGU6ICdTS1TmiqTogqTpnJwnLFxuICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogJ+e6ouiJsicsXG4gICAgICAgICAgICAgICAgICAgICAgICBidXllcjogW1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogJ3h4eCcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGF2YXRhclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogJ3l5eScsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGF2YXRhclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogJ3p6eicsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGF2YXRhclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogJ3h4eCcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGF2YXRhclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogJ3l5eScsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGF2YXRhclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogJ3p6eicsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGF2YXRhclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogJ3h4eCcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGF2YXRhclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogJ3l5eScsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGF2YXRhclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogJ3p6eicsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGF2YXRhclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgICAgICAgICBwaW5TdWNjZXNzOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICAgICAgZ29vZEltZzogaW1nVXJsXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBdO1xuICAgICAgICAgICAgICAgIHJldHVybiByOyBcbiAgICAgICAgICAgIH1cblxuICAgICAgICB9KTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICog55uR5ZCsc3RvcmVcbiAgICAgKi9cbiAgICB3YXRjaFN0b3JlKCApIHtcbiAgICAgICAgYXBwLndhdGNoJCgnYXBwQ29uZmlnJywgdmFsID0+IHtcbiAgICAgICAgICAgIGlmICggIXZhbCApIHsgcmV0dXJuOyB9XG4gICAgICAgICAgICB0aGlzLnNldFRpdGxlKGAke3ZhbFsnaXAtbmFtZSddfee+pOaLvOWbomApXG4gICAgICAgIH0pO1xuICAgIH0sXG5cbiAgICAvKiogXG4gICAgICog6K6+572u5qCH6aKYXG4gICAgICovXG4gICAgc2V0VGl0bGUoIHRpdGxlOiBzdHJpbmcgKSB7XG4gICAgICAgIGlmICggIXRpdGxlICkgeyByZXR1cm47IH1cbiAgICAgICAgd3guc2V0TmF2aWdhdGlvbkJhclRpdGxlKHtcbiAgICAgICAgICAgIHRpdGxlXG4gICAgICAgIH0pO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBzd2lwZXLnm5HlkKxcbiAgICAgKi9cbiAgICBvblN3aXBlciggZTogYW55ICkge1xuICAgICAgICBjb25zdCB7IGN1cnJlbnQgfSA9IGUuZGV0YWlsO1xuICAgICAgICB0aGlzLnNldERhdGEhKHtcbiAgICAgICAgICAgIHN3aXBlckluZGV4OiBjdXJyZW50XG4gICAgICAgIH0pO1xuICAgIH0sXG5cbiAgICBvbkxvYWQ6IGZ1bmN0aW9uIChvcHRpb25zKSB7XG4gICAgICAgIHRoaXMud2F0Y2hTdG9yZSggKTtcbiAgICAgICAgdGhpcy5ydW5Db21wdXRlZCggKTtcbiAgICB9LFxuICBcbiAgICAvKipcbiAgICAgKiDnlJ/lkb3lkajmnJ/lh73mlbAtLeebkeWQrOmhtemdouWIneasoea4suafk+WujOaIkFxuICAgICAqL1xuICAgIG9uUmVhZHk6IGZ1bmN0aW9uICggKSB7XG5cbiAgICB9LFxuICBcbiAgICAvKipcbiAgICAgKiDnlJ/lkb3lkajmnJ/lh73mlbAtLeebkeWQrOmhtemdouaYvuekulxuICAgICAqL1xuICAgIG9uU2hvdzogZnVuY3Rpb24gKCApIHtcblxuICAgIH0sXG4gIFxuICAgIC8qKlxuICAgICAqIOeUn+WRveWRqOacn+WHveaVsC0t55uR5ZCs6aG16Z2i6ZqQ6JePXG4gICAgICovXG4gICAgb25IaWRlOiBmdW5jdGlvbiAoKSB7XG4gIFxuICAgIH0sXG4gIFxuICAgIC8qKlxuICAgICAqIOeUn+WRveWRqOacn+WHveaVsC0t55uR5ZCs6aG16Z2i5Y246L29XG4gICAgICovXG4gICAgb25VbmxvYWQ6IGZ1bmN0aW9uICgpIHtcbiAgXG4gICAgfSxcbiAgXG4gICAgLyoqXG4gICAgICog6aG16Z2i55u45YWz5LqL5Lu25aSE55CG5Ye95pWwLS3nm5HlkKznlKjmiLfkuIvmi4nliqjkvZxcbiAgICAgKi9cbiAgICBvblB1bGxEb3duUmVmcmVzaDogZnVuY3Rpb24gKCkge1xuICBcbiAgICB9LFxuICBcbiAgICAvKipcbiAgICAgKiDpobXpnaLkuIrmi4nop6blupXkuovku7bnmoTlpITnkIblh73mlbBcbiAgICAgKi9cbiAgICBvblJlYWNoQm90dG9tOiBmdW5jdGlvbiAoKSB7XG4gIFxuICAgIH0sXG4gIFxuICAgIC8qKlxuICAgICAqIOeUqOaIt+eCueWHu+WPs+S4iuinkuWIhuS6q1xuICAgICAqL1xuICAgIG9uU2hhcmVBcHBNZXNzYWdlOiBmdW5jdGlvbiAoIGUgKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgIH1cbiAgICB9XG4gIH0pIl19