"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var index_js_1 = require("../../lib/vuefy/index.js");
var app = getApp();
Page({
    data: {
        loading: false
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUVBLHFEQUFvRDtBQUlwRCxJQUFNLEdBQUcsR0FBRyxNQUFNLEVBQVEsQ0FBQztBQUUzQixJQUFJLENBQUM7SUFFRCxJQUFJLEVBQUU7UUFLRixPQUFPLEVBQUUsS0FBSztLQUVqQjtJQUVELFdBQVc7UUFDUCxtQkFBUSxDQUFFLElBQUksRUFBRTtZQUdaLE9BQU87Z0JBQ0gsSUFBTSxNQUFNLEdBQUcsb0lBQW9JLENBQUM7Z0JBQ3BKLElBQU0sU0FBUyxHQUFHLFVBQUEsQ0FBQyxJQUFJLE9BQUEsSUFBSSxDQUFDLEtBQUssQ0FBRSxJQUFJLENBQUMsTUFBTSxFQUFHLEdBQUcsQ0FBQyxDQUFFLEVBQWhDLENBQWdDLENBQUM7Z0JBQ3hELElBQU0sUUFBUSxHQUFHO29CQUNiLDBEQUFhO29CQUNiLDBEQUFhO29CQUNiLGdFQUFjO2lCQUNqQixDQUFDO2dCQUVGLElBQU0sUUFBUSxHQUFHO29CQUNiLE1BQU07b0JBQ04sTUFBTTtpQkFDVCxDQUFDO2dCQUNGLElBQU0sV0FBVyxHQUFHLFFBQVE7cUJBQ3ZCLEdBQUcsQ0FBRSxVQUFBLENBQUM7b0JBQ0gsSUFBTSxTQUFTLEdBQUcsU0FBUyxDQUFFLFFBQVEsQ0FBQyxNQUFNLENBQUUsQ0FBQztvQkFDL0MsT0FBTzt3QkFDSCxNQUFNLEVBQUUsQ0FBQzt3QkFDVCxJQUFJLEVBQUUsUUFBUSxDQUFFLFNBQVMsQ0FBRTtxQkFDOUIsQ0FBQTtnQkFDTCxDQUFDLENBQUMsQ0FBQTtnQkFDTixPQUFPLFdBQVcsQ0FBQztZQUV2QixDQUFDO1lBR0QsU0FBUztnQkFDTCxJQUFNLE1BQU0sR0FBRyxvSUFBb0ksQ0FBQztnQkFDcEosSUFBTSxNQUFNLEdBQUcsOEhBQThILENBQUM7Z0JBQzlJLElBQU0sQ0FBQyxHQUFHO29CQUNOO3dCQUNJLE1BQU0sRUFBRSxHQUFHO3dCQUNYLEtBQUssRUFB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c291cmNlc0NvbnRlbnQiOlsiXG5pbXBvcnQgeyBodHRwIH0gZnJvbSAnLi4vLi4vdXRpbC9odHRwLmpzJztcbmltcG9ydCB7IGNvbXB1dGVkIH0gZnJvbSAnLi4vLi4vbGliL3Z1ZWZ5L2luZGV4LmpzJztcbmltcG9ydCB7IGRlbGF5ZXJpbmdHb29kIH0gZnJvbSAnLi4vLi4vdXRpbC9nb29kcy5qcyc7XG5pbXBvcnQgeyBuYXZUbyB9IGZyb20gJy4uLy4uL3V0aWwvcm91dGUuanMnO1xuXG5jb25zdCBhcHAgPSBnZXRBcHA8YW55PiggKTtcblxuUGFnZSh7XG5cbiAgICBkYXRhOiB7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIOWKoOi9vVxuICAgICAgICAgKi9cbiAgICAgICAgbG9hZGluZzogZmFsc2VcblxuICAgIH0sXG5cbiAgICBydW5Db21wdXRlZCggKSB7XG4gICAgICAgIGNvbXB1dGVkKCB0aGlzLCB7XG5cbiAgICAgICAgICAgIC8vIOi0reS5sOiusOW9lSArIOekvuS6pOWxnuaAp+aooeWdl1xuICAgICAgICAgICAgc29jaWFsJCggKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgYXZhdGFyID0gJ2h0dHBzOi8vd3gucWxvZ28uY24vbW1vcGVuL3ZpXzMyL0llak1WWlRHOFdsaWJIaWNISVZRaHFjTmVDNHVCeGt6SDBGRlRiUkxNaWN4aWI4d3J4UlJXb0pZM2d2Y3R5bEFUZG1BUGhpYVZpY1U0c0gwTnB0U3N6QmR5SGlhQS8xMzInO1xuICAgICAgICAgICAgICAgIGNvbnN0IGdldFJhbmRvbSA9IG4gPT4gTWF0aC5mbG9vciggTWF0aC5yYW5kb20oICkgKiBuICk7XG4gICAgICAgICAgICAgICAgY29uc3QgYWxsVGV4dHMgPSBbXG4gICAgICAgICAgICAgICAgICAgIGDmo5IhIOaLvOWboueahOe+pOWPi+ecn+e7meWKm2AsXG4gICAgICAgICAgICAgICAgICAgIGDlk4chIOWSjOe+pOWPi+aLvOWbouecn+WIkueul2AsXG4gICAgICAgICAgICAgICAgICAgIGDlk4ghIOS4i+asoee7p+e7reWSjOe+pOWPi+aLvOWbomBcbiAgICAgICAgICAgICAgICBdO1xuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIGNvbnN0IHZpc2l0b3JzID0gW1xuICAgICAgICAgICAgICAgICAgICBhdmF0YXIsXG4gICAgICAgICAgICAgICAgICAgIGF2YXRhclxuICAgICAgICAgICAgICAgIF07XG4gICAgICAgICAgICAgICAgY29uc3QgYWxsVmlzaXRvcnMgPSB2aXNpdG9yc1xuICAgICAgICAgICAgICAgICAgICAubWFwKCB4ID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHJhbmRvbU51bSA9IGdldFJhbmRvbSggYWxsVGV4dHMubGVuZ3RoICk7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGF2YXRhcjogeCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZXh0OiBhbGxUZXh0c1sgcmFuZG9tTnVtIF1cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICByZXR1cm4gYWxsVmlzaXRvcnM7XG5cbiAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgIC8vIOS4quS6uui0reeJqea4heWNlVxuICAgICAgICAgICAgcGVyc29uYWwkKCApIHtcbiAgICAgICAgICAgICAgICBjb25zdCBhdmF0YXIgPSAnaHR0cHM6Ly93eC5xbG9nby5jbi9tbW9wZW4vdmlfMzIvSWVqTVZaVEc4V2xpYkhpY0hJVlFocWNOZUM0dUJ4a3pIMEZGVGJSTE1pY3hpYjh3cnhSUldvSlkzZ3ZjdHlsQVRkbUFQaGlhVmljVTRzSDBOcHRTc3pCZHlIaWFBLzEzMic7XG4gICAgICAgICAgICAgICAgY29uc3QgaW1nVXJsID0gJ2h0dHBzOi8vd3g2MGJmN2Y3NDVjZTMxZWYwLTEyNTc3NjQ1NjcuY29zLmFwLWd1YW5nemhvdS5teXFjbG91ZC5jb20vdG1wXzdlMjRkMDkwOWQzNDFlODEyOTY4YjgzY2U1YTMyOGQxMDJiYzFiMTc0YTM3NGY0ZS5qcGcnO1xuICAgICAgICAgICAgICAgIGNvbnN0IHIgPSBbXG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGdvb2RJZDogJzEnLFxuICAgICAgICAgICAgICAgICAgICAgICAgZGVsdGE6IDE1LFxuICAgICAgICAgICAgICAgICAgICAgICAgdG90YWxEZWx0YTogNDUsXG4gICAgICAgICAgICAgICAgICAgICAgICBwcmljZTogODYsXG4gICAgICAgICAgICAgICAgICAgICAgICBncm91cFByaWNlOiA3MSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGZhZGVQcmljZTogMTI4LFxuICAgICAgICAgICAgICAgICAgICAgICAgdGl0bGU6ICdTS1TmiqTogqTpnJwnLFxuICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogJ+e6ouiJsicsXG4gICAgICAgICAgICAgICAgICAgICAgICBidXllcjogW1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogJ3h4eCcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGF2YXRhclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogJ3l5eScsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGF2YXRhclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogJ3p6eicsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGF2YXRhclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogJ3h4eCcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGF2YXRhclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgICAgICAgICBwaW5TdWNjZXNzOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICAgICAgZ29vZEltZzogaW1nVXJsXG4gICAgICAgICAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGdvb2RJZDogJzEnLFxuICAgICAgICAgICAgICAgICAgICAgICAgZGVsdGE6IDE1LFxuICAgICAgICAgICAgICAgICAgICAgICAgdG90YWxEZWx0YTogNDUsXG4gICAgICAgICAgICAgICAgICAgICAgICBwcmljZTogODYsXG4gICAgICAgICAgICAgICAgICAgICAgICBncm91cFByaWNlOiA3MSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGZhZGVQcmljZTogMTI4LFxuICAgICAgICAgICAgICAgICAgICAgICAgdGl0bGU6ICdTS1TmiqTogqTpnJwnLFxuICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogJ+e6ouiJsicsXG4gICAgICAgICAgICAgICAgICAgICAgICBidXllcjogW1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogJ3h4eCcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGF2YXRhclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogJ3l5eScsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGF2YXRhclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogJ3p6eicsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGF2YXRhclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogJ3h4eCcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGF2YXRhclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogJ3l5eScsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGF2YXRhclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogJ3p6eicsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGF2YXRhclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogJ3h4eCcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGF2YXRhclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogJ3l5eScsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGF2YXRhclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogJ3p6eicsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGF2YXRhclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgICAgICAgICBwaW5TdWNjZXNzOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICAgICAgZ29vZEltZzogaW1nVXJsXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBdO1xuICAgICAgICAgICAgICAgIHJldHVybiByO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgIH0pO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiDnm5HlkKxzdG9yZVxuICAgICAqL1xuICAgIHdhdGNoU3RvcmUoICkge1xuICAgICAgICBhcHAud2F0Y2gkKCdhcHBDb25maWcnLCB2YWwgPT4ge1xuICAgICAgICAgICAgaWYgKCAhdmFsICkgeyByZXR1cm47IH1cbiAgICAgICAgICAgIHRoaXMuc2V0VGl0bGUoYCR7dmFsWydpcC1uYW1lJ119576k5ou85ZuiYClcbiAgICAgICAgfSk7XG4gICAgfSxcblxuICAgIC8qKiBcbiAgICAgKiDorr7nva7moIfpophcbiAgICAgKi9cbiAgICBzZXRUaXRsZSggdGl0bGU6IHN0cmluZyApIHtcbiAgICAgICAgaWYgKCAhdGl0bGUgKSB7IHJldHVybjsgfVxuICAgICAgICB3eC5zZXROYXZpZ2F0aW9uQmFyVGl0bGUoe1xuICAgICAgICAgICAgdGl0bGVcbiAgICAgICAgfSk7XG4gICAgfSxcblxuICAgIG9uTG9hZDogZnVuY3Rpb24gKG9wdGlvbnMpIHtcbiAgICAgICAgdGhpcy53YXRjaFN0b3JlKCApO1xuICAgICAgICB0aGlzLnJ1bkNvbXB1dGVkKCApO1xuICAgIH0sXG4gIFxuICAgIC8qKlxuICAgICAqIOeUn+WRveWRqOacn+WHveaVsC0t55uR5ZCs6aG16Z2i5Yid5qyh5riy5p+T5a6M5oiQXG4gICAgICovXG4gICAgb25SZWFkeTogZnVuY3Rpb24gKCApIHtcblxuICAgIH0sXG4gIFxuICAgIC8qKlxuICAgICAqIOeUn+WRveWRqOacn+WHveaVsC0t55uR5ZCs6aG16Z2i5pi+56S6XG4gICAgICovXG4gICAgb25TaG93OiBmdW5jdGlvbiAoICkge1xuXG4gICAgfSxcbiAgXG4gICAgLyoqXG4gICAgICog55Sf5ZG95ZGo5pyf5Ye95pWwLS3nm5HlkKzpobXpnaLpmpDol49cbiAgICAgKi9cbiAgICBvbkhpZGU6IGZ1bmN0aW9uICgpIHtcbiAgXG4gICAgfSxcbiAgXG4gICAgLyoqXG4gICAgICog55Sf5ZG95ZGo5pyf5Ye95pWwLS3nm5HlkKzpobXpnaLljbjovb1cbiAgICAgKi9cbiAgICBvblVubG9hZDogZnVuY3Rpb24gKCkge1xuICBcbiAgICB9LFxuICBcbiAgICAvKipcbiAgICAgKiDpobXpnaLnm7jlhbPkuovku7blpITnkIblh73mlbAtLeebkeWQrOeUqOaIt+S4i+aLieWKqOS9nFxuICAgICAqL1xuICAgIG9uUHVsbERvd25SZWZyZXNoOiBmdW5jdGlvbiAoKSB7XG4gIFxuICAgIH0sXG4gIFxuICAgIC8qKlxuICAgICAqIOmhtemdouS4iuaLieinpuW6leS6i+S7tueahOWkhOeQhuWHveaVsFxuICAgICAqL1xuICAgIG9uUmVhY2hCb3R0b206IGZ1bmN0aW9uICgpIHtcbiAgXG4gICAgfSxcbiAgXG4gICAgLyoqXG4gICAgICog55So5oi354K55Ye75Y+z5LiK6KeS5YiG5LqrXG4gICAgICovXG4gICAgb25TaGFyZUFwcE1lc3NhZ2U6IGZ1bmN0aW9uICggZSApIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgfVxuICAgIH1cbiAgfSkiXX0=