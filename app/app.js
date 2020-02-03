"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var http_1 = require("./util/http");
var subscribe_1 = require("./util/subscribe");
var cloudEnv = undefined;
App({
    globalData$: {
        role: 0,
        openid: '',
        isUserAuth: false,
        userInfo: {},
        isNew: true,
        editingGood: {},
        appConfig: {},
        showSubscribeTips: false,
        subscribeTpye: '',
        subscribeTemplates: [],
        pushIntegral: 0
    },
    globalData: {
        role: 0,
        openid: '',
        isUserAuth: false,
        userInfo: null,
        isNew: true,
        editingGood: null,
        appConfig: null,
        showSubscribeTips: false,
        subscribeTpye: '',
        subscribeTemplates: [],
        pushIntegral: 0
    },
    watchCallBack: {},
    watchingKeys: [],
    init: function () {
        var _this = this;
        var that = this;
        this.globalData$ = Object.assign({}, this.globalData);
        Object.keys(this.globalData).map(function (key) {
            Object.defineProperty(_this.globalData, key, {
                configurable: true,
                enumerable: true,
                set: function (val) {
                    var old = that.globalData$[key];
                    that.globalData$[key] = val;
                    if (Array.isArray(that.watchCallBack[key])) {
                        that.watchCallBack[key].map(function (func) { return func(val, old); });
                    }
                },
                get: function () {
                    return that.globalData$[key];
                }
            });
        });
        wx.getSetting({
            success: function (res) {
                var isUserAuth = res.authSetting['scope.userInfo'];
                _this.setGlobalData({
                    isUserAuth: isUserAuth === undefined ? false : isUserAuth
                });
            }
        });
    },
    initCloud: function () {
        return new Promise(function (resolve, reject) {
            wx.cloud.init({
                traceUser: true,
                env: cloudEnv
            });
            resolve();
        });
    },
    getIsNewCustom: function () {
        var _this = this;
        http_1.http({
            url: 'common_is-new-customer',
            success: function (res) {
                _this.setGlobalData({
                    isNew: res.data
                });
            }
        });
    },
    getPushIntegral: function () {
        var _this = this;
        http_1.http({
            data: {
                showMore: true,
            },
            loadingMsg: 'none',
            url: 'common_push-integral',
            success: function (res) {
                var status = res.status, data = res.data;
                if (status !== 200) {
                    return;
                }
                _this.setGlobalData({
                    pushIntegral: data.integral
                });
            }
        });
    },
    getSubscribeTemplated: function () {
        var _this = this;
        http_1.http({
            url: 'common_get-subscribe-templates',
            success: function (res) {
                _this.setGlobalData({
                    subscribeTemplates: res.data
                });
            }
        });
    },
    getAppConfig: function () {
        var _this = this;
        http_1.http({
            url: 'common_check-app-config',
            success: function (res) {
                if (res.status !== 200) {
                    return;
                }
                _this.setGlobalData({
                    appConfig: res.data
                });
            }
        });
    },
    getWxUserInfo: function (cb) {
        var _this = this;
        wx.getUserInfo({
            success: function (res) {
                http_1.http({
                    data: res.userInfo,
                    url: 'common_userEdit',
                    success: function (res2) {
                        if (res2 && res2.status === 200) {
                            _this.setGlobalData({
                                isUserAuth: true,
                                userInfo: res.userInfo
                            });
                            cb && cb();
                        }
                    }
                });
            }
        });
    },
    getUserInfo: function (cb) {
        var _this = this;
        wx.cloud.callFunction({
            name: 'login'
        }).then(function (res) {
            console.log('[LOGIN]', res.result);
            _this.setGlobalData(res.result);
            !!cb && cb();
        });
    },
    getSubscribe: function (types) {
        var hasShow = subscribe_1.checkSubscribeTips();
        if (!hasShow) {
            this.setGlobalData({
                subscribeTpye: types,
                showSubscribeTips: true
            });
        }
        else {
            subscribe_1.requestSubscribe(types, (this.globalData.subscribeTemplates || []));
        }
    },
    setGlobalData: function (obj) {
        var _this = this;
        console.log('【---- Global Set ----】', obj);
        Object.keys(obj).map(function (key) {
            _this.globalData[key] = obj[key];
        });
    },
    watch$: function (key, cb) {
        var _a;
        var _this = this;
        this.watchCallBack = Object.assign({}, this.watchCallBack, (_a = {},
            _a[key] = this.watchCallBack[key] || [],
            _a));
        this.watchCallBack[key].push(cb);
        setTimeout(function () {
            var val = _this.globalData$[key];
            var old = _this.globalData[key];
            cb(val, old);
        }, 0);
        if (!this.watchingKeys.find(function (x) { return x === key; })) {
            var that = this;
            this.watchingKeys.push(key);
        }
    },
    onLaunch: function () {
        var _this = this;
        this.init();
        this.initCloud()
            .then(function () {
            _this.getUserInfo();
            _this.getAppConfig();
            _this.getSubscribeTemplated();
            _this.getWxUserInfo();
        })
            .catch(function (e) {
            wx.showToast({
                icon: 'none',
                duration: 2000,
                title: '数据库初始错误'
            });
        });
    }
});
var Role;
(function (Role) {
    Role[Role["normal"] = 0] = "normal";
    Role[Role["admin"] = 1] = "admin";
})(Role || (Role = {}));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiYXBwLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsb0NBQW1DO0FBQ25DLDhDQUF3RTtBQUd4RSxJQUFNLFFBQVEsR0FBRyxTQUFTLENBQUM7QUFFM0IsR0FBRyxDQUFRO0lBR1AsV0FBVyxFQUFFO1FBRVQsSUFBSSxFQUFFLENBQUM7UUFFUCxNQUFNLEVBQUUsRUFBRTtRQUVWLFVBQVUsRUFBRSxLQUFLO1FBRWpCLFFBQVEsRUFBRSxFQUFHO1FBRWIsS0FBSyxFQUFFLElBQUk7UUFFWCxXQUFXLEVBQUUsRUFBRztRQUVoQixTQUFTLEVBQUUsRUFBRztRQUVkLGlCQUFpQixFQUFFLEtBQUs7UUFFeEIsYUFBYSxFQUFFLEVBQUU7UUFFakIsa0JBQWtCLEVBQUUsRUFBRztRQUV2QixZQUFZLEVBQUUsQ0FBQztLQUNsQjtJQUdELFVBQVUsRUFBRTtRQUNSLElBQUksRUFBRSxDQUFDO1FBQ1AsTUFBTSxFQUFFLEVBQUU7UUFDVixVQUFVLEVBQUUsS0FBSztRQUNqQixRQUFRLEVBQUUsSUFBSTtRQUNkLEtBQUssRUFBRSxJQUFJO1FBQ1gsV0FBVyxFQUFFLElBQUk7UUFDakIsU0FBUyxFQUFFLElBQUk7UUFDZixpQkFBaUIsRUFBRSxLQUFLO1FBQ3hCLGFBQWEsRUFBRSxFQUFFO1FBQ2pCLGtCQUFrQixFQUFFLEVBQUc7UUFDdkIsWUFBWSxFQUFFLENBQUM7S0FDbEI7SUFHRCxhQUFhLEVBQUUsRUFBRztJQUdsQixZQUFZLEVBQUUsRUFBRztJQUdqQixJQUFJO1FBQUosaUJBb0NDO1FBbENHLElBQU0sSUFBSSxHQUFHLElBQUksQ0FBQztRQUdsQixJQUFJLENBQUMsV0FBVyxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUMsRUFBRyxFQUFFLElBQUksQ0FBQyxVQUFVLENBQUUsQ0FBQztRQUd4RCxNQUFNLENBQUMsSUFBSSxDQUFFLElBQUksQ0FBQyxVQUFVLENBQUUsQ0FBQyxHQUFHLENBQUUsVUFBQSxHQUFHO1lBQ25DLE1BQU0sQ0FBQyxjQUFjLENBQUUsS0FBSSxDQUFDLFVBQVUsRUFBRSxHQUFHLEVBQUU7Z0JBQ3pDLFlBQVksRUFBRSxJQUFJO2dCQUNsQixVQUFVLEVBQUUsSUFBSTtnQkFDaEIsR0FBRyxFQUFFLFVBQVUsR0FBRztvQkFDZCxJQUFNLEdBQUcsR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFFLEdBQUcsQ0FBRSxDQUFDO29CQUNwQyxJQUFJLENBQUMsV0FBVyxDQUFFLEdBQUcsQ0FBRSxHQUFHLEdBQUcsQ0FBQztvQkFDOUIsSUFBSyxLQUFLLENBQUMsT0FBTyxDQUFFLElBQUksQ0FBQyxhQUFhLENBQUUsR0FBRyxDQUFFLENBQUMsRUFBRTt3QkFDNUMsSUFBSSxDQUFDLGFBQWEsQ0FBRSxHQUFHLENBQUUsQ0FBQyxHQUFHLENBQUMsVUFBQSxJQUFJLElBQUksT0FBQSxJQUFJLENBQUUsR0FBRyxFQUFFLEdBQUcsQ0FBRSxFQUFoQixDQUFnQixDQUFDLENBQUM7cUJBQzNEO2dCQUNMLENBQUM7Z0JBQ0QsR0FBRyxFQUFFO29CQUNELE9BQU8sSUFBSSxDQUFDLFdBQVcsQ0FBRSxHQUFHLENBQUUsQ0FBQztnQkFDbkMsQ0FBQzthQUNKLENBQUMsQ0FBQztRQUNQLENBQUMsQ0FBQyxDQUFDO1FBR0gsRUFBRSxDQUFDLFVBQVUsQ0FBQztZQUNWLE9BQU8sRUFBRSxVQUFBLEdBQUc7Z0JBRVIsSUFBTSxVQUFVLEdBQUcsR0FBRyxDQUFDLFdBQVcsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO2dCQUNyRCxLQUFJLENBQUMsYUFBYSxDQUFDO29CQUNmLFVBQVUsRUFBRSxVQUFVLEtBQUssU0FBUyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLFVBQVU7aUJBQzVELENBQUMsQ0FBQztZQUNQLENBQUM7U0FDSixDQUFDLENBQUM7SUFFUCxDQUFDO0lBR0QsU0FBUztRQUNMLE9BQU8sSUFBSSxPQUFPLENBQUMsVUFBRSxPQUFPLEVBQUUsTUFBTTtZQUdoQyxFQUFFLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQztnQkFDVixTQUFTLEVBQUUsSUFBSTtnQkFDZixHQUFHLEVBQUUsUUFBUTthQUNoQixDQUFDLENBQUM7WUFDSCxPQUFPLEVBQUcsQ0FBQztRQUNmLENBQUMsQ0FBQyxDQUFDO0lBQ1AsQ0FBQztJQUdELGNBQWM7UUFBZCxpQkFTQztRQVJHLFdBQUksQ0FBQztZQUNELEdBQUcsRUFBRSx3QkFBd0I7WUFDN0IsT0FBTyxFQUFFLFVBQUEsR0FBRztnQkFDUixLQUFJLENBQUMsYUFBYSxDQUFDO29CQUNmLEtBQUssRUFBRSxHQUFHLENBQUMsSUFBSTtpQkFDbEIsQ0FBQyxDQUFDO1lBQ1AsQ0FBQztTQUNKLENBQUMsQ0FBQTtJQUNOLENBQUM7SUFHRCxlQUFlO1FBQWYsaUJBZUM7UUFkRyxXQUFJLENBQUM7WUFDRCxJQUFJLEVBQUU7Z0JBQ0YsUUFBUSxFQUFFLElBQUk7YUFDakI7WUFDRCxVQUFVLEVBQUUsTUFBTTtZQUNsQixHQUFHLEVBQUUsc0JBQXNCO1lBQzNCLE9BQU8sRUFBRSxVQUFBLEdBQUc7Z0JBQ0EsSUFBQSxtQkFBTSxFQUFFLGVBQUksQ0FBUztnQkFDN0IsSUFBSyxNQUFNLEtBQUssR0FBRyxFQUFHO29CQUFFLE9BQU87aUJBQUU7Z0JBQ2pDLEtBQUksQ0FBQyxhQUFhLENBQUM7b0JBQ2YsWUFBWSxFQUFFLElBQUksQ0FBQyxRQUFRO2lCQUM5QixDQUFDLENBQUM7WUFDUCxDQUFDO1NBQ0osQ0FBQyxDQUFBO0lBQ04sQ0FBQztJQUdELHFCQUFxQjtRQUFyQixpQkFTQztRQVJHLFdBQUksQ0FBQztZQUNELEdBQUcsRUFBRSxnQ0FBZ0M7WUFDckMsT0FBTyxFQUFFLFVBQUEsR0FBRztnQkFDUixLQUFJLENBQUMsYUFBYSxDQUFDO29CQUNmLGtCQUFrQixFQUFFLEdBQUcsQ0FBQyxJQUFJO2lCQUMvQixDQUFDLENBQUM7WUFDUCxDQUFDO1NBQ0osQ0FBQyxDQUFBO0lBQ04sQ0FBQztJQUdELFlBQVk7UUFBWixpQkFVQztRQVRHLFdBQUksQ0FBQztZQUNELEdBQUcsRUFBRSx5QkFBeUI7WUFDOUIsT0FBTyxFQUFFLFVBQUEsR0FBRztnQkFDUixJQUFLLEdBQUcsQ0FBQyxNQUFNLEtBQUssR0FBRyxFQUFHO29CQUFFLE9BQU87aUJBQUU7Z0JBQ3JDLEtBQUksQ0FBQyxhQUFhLENBQUM7b0JBQ2YsU0FBUyxFQUFFLEdBQUcsQ0FBQyxJQUFJO2lCQUN0QixDQUFDLENBQUM7WUFDUCxDQUFDO1NBQ0osQ0FBQyxDQUFBO0lBQ04sQ0FBQztJQUdELGFBQWEsWUFBRSxFQUFFO1FBQWpCLGlCQWtCQztRQWpCRyxFQUFFLENBQUMsV0FBVyxDQUFDO1lBQ1gsT0FBTyxFQUFFLFVBQUEsR0FBRztnQkFDUixXQUFJLENBQUM7b0JBQ0QsSUFBSSxFQUFFLEdBQUcsQ0FBQyxRQUFRO29CQUNsQixHQUFHLEVBQUUsaUJBQWlCO29CQUN0QixPQUFPLEVBQUUsVUFBQSxJQUFJO3dCQUNULElBQUssSUFBSSxJQUFJLElBQUksQ0FBQyxNQUFNLEtBQUssR0FBRyxFQUFHOzRCQUMvQixLQUFJLENBQUMsYUFBYSxDQUFDO2dDQUNmLFVBQVUsRUFBRSxJQUFJO2dDQUNoQixRQUFRLEVBQUUsR0FBRyxDQUFDLFFBQVE7NkJBQ3pCLENBQUMsQ0FBQzs0QkFDSCxFQUFFLElBQUksRUFBRSxFQUFHLENBQUM7eUJBQ2Y7b0JBQ0wsQ0FBQztpQkFDSixDQUFDLENBQUM7WUFDUCxDQUFDO1NBQ0osQ0FBQyxDQUFBO0lBQ04sQ0FBQztJQUdELFdBQVcsRUFBWCxVQUFhLEVBQUU7UUFBZixpQkFRQztRQVBHLEVBQUUsQ0FBQyxLQUFLLENBQUMsWUFBWSxDQUFDO1lBQ2xCLElBQUksRUFBRSxPQUFPO1NBQ2hCLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBRSxHQUFRO1lBQ2QsT0FBTyxDQUFDLEdBQUcsQ0FBQyxTQUFTLEVBQUUsR0FBRyxDQUFDLE1BQU0sQ0FBRSxDQUFDO1lBQ3BDLEtBQUksQ0FBQyxhQUFhLENBQUUsR0FBRyxDQUFDLE1BQU0sQ0FBRSxDQUFDO1lBQ2pDLENBQUMsQ0FBQyxFQUFFLElBQUksRUFBRSxFQUFHLENBQUM7UUFDbEIsQ0FBQyxDQUFDLENBQUM7SUFDUCxDQUFDO0lBR0QsWUFBWSxZQUFFLEtBQUs7UUFDZixJQUFNLE9BQU8sR0FBRyw4QkFBa0IsRUFBRyxDQUFDO1FBQ3RDLElBQUssQ0FBQyxPQUFPLEVBQUc7WUFFWixJQUFJLENBQUMsYUFBYSxDQUFDO2dCQUNmLGFBQWEsRUFBRSxLQUFLO2dCQUNwQixpQkFBaUIsRUFBRSxJQUFJO2FBQzFCLENBQUMsQ0FBQztTQUNOO2FBQU07WUFFSCw0QkFBZ0IsQ0FBRSxLQUFLLEVBQUUsQ0FBRSxJQUFJLENBQUMsVUFBVSxDQUFDLGtCQUFrQixJQUFJLEVBQUcsQ0FBQyxDQUFDLENBQUM7U0FDMUU7SUFDTCxDQUFDO0lBR0QsYUFBYSxZQUFFLEdBQUc7UUFBbEIsaUJBS0M7UUFKRyxPQUFPLENBQUMsR0FBRyxDQUFFLHdCQUF3QixFQUFFLEdBQUcsQ0FBRSxDQUFBO1FBQzVDLE1BQU0sQ0FBQyxJQUFJLENBQUUsR0FBRyxDQUFFLENBQUMsR0FBRyxDQUFFLFVBQUEsR0FBRztZQUN2QixLQUFJLENBQUMsVUFBVSxDQUFFLEdBQUcsQ0FBRSxHQUFHLEdBQUcsQ0FBRSxHQUFHLENBQUUsQ0FBQztRQUN4QyxDQUFDLENBQUMsQ0FBQztJQUNQLENBQUM7SUFHRCxNQUFNLFlBQUUsR0FBRyxFQUFFLEVBQUU7O1FBQWYsaUJBOEJDO1FBN0JHLElBQUksQ0FBQyxhQUFhLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQyxFQUFHLEVBQUUsSUFBSSxDQUFDLGFBQWE7WUFDdEQsR0FBRSxHQUFHLElBQUksSUFBSSxDQUFDLGFBQWEsQ0FBRSxHQUFHLENBQUUsSUFBSSxFQUFHO2dCQUMzQyxDQUFDO1FBQ0gsSUFBSSxDQUFDLGFBQWEsQ0FBRSxHQUFHLENBQUUsQ0FBQyxJQUFJLENBQUUsRUFBRSxDQUFFLENBQUM7UUFFckMsVUFBVSxDQUFDO1lBQ1AsSUFBTSxHQUFHLEdBQUcsS0FBSSxDQUFDLFdBQVcsQ0FBRSxHQUFHLENBQUUsQ0FBQztZQUNwQyxJQUFNLEdBQUcsR0FBRyxLQUFJLENBQUMsVUFBVSxDQUFFLEdBQUcsQ0FBRSxDQUFDO1lBQ25DLEVBQUUsQ0FBRSxHQUFHLEVBQUUsR0FBRyxDQUFFLENBQUM7UUFDbkIsQ0FBQyxFQUFFLENBQUMsQ0FBRSxDQUFDO1FBR1AsSUFBSyxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFFLFVBQUEsQ0FBQyxJQUFJLE9BQUEsQ0FBQyxLQUFLLEdBQUcsRUFBVCxDQUFTLENBQUUsRUFBRTtZQUM1QyxJQUFNLElBQUksR0FBRyxJQUFJLENBQUM7WUFDbEIsSUFBSSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUUsR0FBRyxDQUFFLENBQUM7U0FjakM7SUFDTCxDQUFDO0lBR0QsUUFBUSxFQUFFO1FBQUEsaUJBbUJUO1FBbEJHLElBQUksQ0FBQyxJQUFJLEVBQUcsQ0FBQztRQUNiLElBQUksQ0FBQyxTQUFTLEVBQUc7YUFDWixJQUFJLENBQUM7WUFDRixLQUFJLENBQUMsV0FBVyxFQUFHLENBQUM7WUFDcEIsS0FBSSxDQUFDLFlBQVksRUFBRyxDQUFDO1lBR3JCLEtBQUksQ0FBQyxxQkFBcUIsRUFBRyxDQUFDO1lBQzlCLEtBQUksQ0FBQyxhQUFhLEVBQUcsQ0FBQztRQUMxQixDQUFDLENBQUM7YUFDRCxLQUFLLENBQUUsVUFBQSxDQUFDO1lBQ0wsRUFBRSxDQUFDLFNBQVMsQ0FBQztnQkFDVCxJQUFJLEVBQUUsTUFBTTtnQkFDWixRQUFRLEVBQUUsSUFBSTtnQkFDZCxLQUFLLEVBQUUsU0FBUzthQUNuQixDQUFDLENBQUM7UUFDUCxDQUFDLENBQUMsQ0FBQTtJQUVWLENBQUM7Q0FDSixDQUFDLENBQUM7QUFzQkgsSUFBSyxJQUdKO0FBSEQsV0FBSyxJQUFJO0lBQ0wsbUNBQU0sQ0FBQTtJQUNOLGlDQUFLLENBQUE7QUFDVCxDQUFDLEVBSEksSUFBSSxLQUFKLElBQUksUUFHUiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGh0dHAgfSBmcm9tICcuL3V0aWwvaHR0cCc7XG5pbXBvcnQgeyBjaGVja1N1YnNjcmliZVRpcHMsIHJlcXVlc3RTdWJzY3JpYmUgfSBmcm9tICcuL3V0aWwvc3Vic2NyaWJlJztcblxuLy8gY29uc3QgY2xvdWRFbnYgPSAncHJvZC1iODdiNzYnOztcbmNvbnN0IGNsb3VkRW52ID0gdW5kZWZpbmVkO1xuXG5BcHA8TXlBcHA+KHtcblxuICAgIC8qKiBmYWRlIGdsb2JhbERhdGEgKi9cbiAgICBnbG9iYWxEYXRhJDoge1xuICAgICAgICAvLyDnmbvlvZXkurrmnYPpmZBcbiAgICAgICAgcm9sZTogMCxcbiAgICAgICAgLy8g55m75b2V5Lq6aWRcbiAgICAgICAgb3BlbmlkOiAnJyxcbiAgICAgICAgLy8g5piv5ZCm5bey57uP5o6I5p2D55So5oi35L+h5oGvXG4gICAgICAgIGlzVXNlckF1dGg6IGZhbHNlLFxuICAgICAgICAvLyDnlKjmiLfkv6Hmga9cbiAgICAgICAgdXNlckluZm86IHsgfSxcbiAgICAgICAgLyoqIOaYr+WQpuaYr+aWsOWuouaItyAqL1xuICAgICAgICBpc05ldzogdHJ1ZSxcbiAgICAgICAgLyoqIOe8lui+keS4reeahOWVhuWTgeaVsOaNriAqL1xuICAgICAgICBlZGl0aW5nR29vZDogeyB9LFxuICAgICAgICAvKiogYXBw6YWN572uICovXG4gICAgICAgIGFwcENvbmZpZzogeyB9LFxuICAgICAgICAvKiog5bGV56S65YWo5bGA55qE6K6i6ZiF5o+Q56S65L+h5oGvICovXG4gICAgICAgIHNob3dTdWJzY3JpYmVUaXBzOiBmYWxzZSxcbiAgICAgICAgLyoqIOiuoumYheexu+WeiyAqL1xuICAgICAgICBzdWJzY3JpYmVUcHllOiAnJyxcbiAgICAgICAgLyoqIOiuoumYheaooeadvyAqL1xuICAgICAgICBzdWJzY3JpYmVUZW1wbGF0ZXM6IFsgXSxcbiAgICAgICAgLyoqIOatpOi0puWPt+WPr+eUqOaKteeOsOmHkSAqL1xuICAgICAgICBwdXNoSW50ZWdyYWw6IDBcbiAgICB9LFxuXG4gICAgLyoqIOWFqOWxgHN0b3JlICovXG4gICAgZ2xvYmFsRGF0YToge1xuICAgICAgICByb2xlOiAwLFxuICAgICAgICBvcGVuaWQ6ICcnLFxuICAgICAgICBpc1VzZXJBdXRoOiBmYWxzZSxcbiAgICAgICAgdXNlckluZm86IG51bGwsXG4gICAgICAgIGlzTmV3OiB0cnVlLFxuICAgICAgICBlZGl0aW5nR29vZDogbnVsbCxcbiAgICAgICAgYXBwQ29uZmlnOiBudWxsLFxuICAgICAgICBzaG93U3Vic2NyaWJlVGlwczogZmFsc2UsXG4gICAgICAgIHN1YnNjcmliZVRweWU6ICcnLFxuICAgICAgICBzdWJzY3JpYmVUZW1wbGF0ZXM6IFsgXSxcbiAgICAgICAgcHVzaEludGVncmFsOiAwXG4gICAgfSxcblxuICAgIC8qKiDnm5HlkKzlh73mlbDnmoTlr7nosaHmlbDnu4QgKi9cbiAgICB3YXRjaENhbGxCYWNrOiB7IH0sXG5cbiAgICAvKiog55uR5ZCs5YiX6KGoICovXG4gICAgd2F0Y2hpbmdLZXlzOiBbIF0sXG5cbiAgICAvKiog5Yid5aeL5YyWICovXG4gICAgaW5pdCggKSB7XG5cbiAgICAgICAgY29uc3QgdGhhdCA9IHRoaXM7XG4gICAgICAgIFxuICAgICAgICAvLyDlhajlsYDmlbDmja5cbiAgICAgICAgdGhpcy5nbG9iYWxEYXRhJCA9IE9iamVjdC5hc3NpZ24oeyB9LCB0aGlzLmdsb2JhbERhdGEgKTtcblxuICAgICAgICAvLyB3YXRjaFxuICAgICAgICBPYmplY3Qua2V5cyggdGhpcy5nbG9iYWxEYXRhICkubWFwKCBrZXkgPT4ge1xuICAgICAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KCB0aGlzLmdsb2JhbERhdGEsIGtleSwge1xuICAgICAgICAgICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcbiAgICAgICAgICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxuICAgICAgICAgICAgICAgIHNldDogZnVuY3Rpb24oIHZhbCApIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3Qgb2xkID0gdGhhdC5nbG9iYWxEYXRhJFsga2V5IF07XG4gICAgICAgICAgICAgICAgICAgIHRoYXQuZ2xvYmFsRGF0YSRbIGtleSBdID0gdmFsO1xuICAgICAgICAgICAgICAgICAgICBpZiAoIEFycmF5LmlzQXJyYXkoIHRoYXQud2F0Y2hDYWxsQmFja1sga2V5IF0pKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGF0LndhdGNoQ2FsbEJhY2tbIGtleSBdLm1hcChmdW5jID0+IGZ1bmMoIHZhbCwgb2xkICkpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBnZXQ6IGZ1bmN0aW9uKCApIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoYXQuZ2xvYmFsRGF0YSRbIGtleSBdO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcblxuICAgICAgICAvLyDnlKjmiLfkv6Hmga9cbiAgICAgICAgd3guZ2V0U2V0dGluZyh7XG4gICAgICAgICAgICBzdWNjZXNzOiByZXMgPT4ge1xuICAgICAgICAgICAgICAgIC8vIOaYr+WQpuW3sue7j+aOiOadg1xuICAgICAgICAgICAgICAgIGNvbnN0IGlzVXNlckF1dGggPSByZXMuYXV0aFNldHRpbmdbJ3Njb3BlLnVzZXJJbmZvJ107XG4gICAgICAgICAgICAgICAgdGhpcy5zZXRHbG9iYWxEYXRhKHtcbiAgICAgICAgICAgICAgICAgICAgaXNVc2VyQXV0aDogaXNVc2VyQXV0aCA9PT0gdW5kZWZpbmVkID8gZmFsc2UgOiBpc1VzZXJBdXRoXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgfSxcblxuICAgIC8qKiDliJ3lp4vljJbkupHlh73mlbDmlbDmja7lupMgKi9cbiAgICBpbml0Q2xvdWQoICkge1xuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKCByZXNvbHZlLCByZWplY3QgKSA9PiB7XG5cbiAgICAgICAgICAgIC8vIOS6kVxuICAgICAgICAgICAgd3guY2xvdWQuaW5pdCh7XG4gICAgICAgICAgICAgICAgdHJhY2VVc2VyOiB0cnVlLFxuICAgICAgICAgICAgICAgIGVudjogY2xvdWRFbnZcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgcmVzb2x2ZSggKTtcbiAgICAgICAgfSk7XG4gICAgfSxcblxuICAgIC8qKiDmmK/lkKbkuLrmlrDlrqIgKi9cbiAgICBnZXRJc05ld0N1c3RvbSggKSB7XG4gICAgICAgIGh0dHAoe1xuICAgICAgICAgICAgdXJsOiAnY29tbW9uX2lzLW5ldy1jdXN0b21lcicsXG4gICAgICAgICAgICBzdWNjZXNzOiByZXMgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMuc2V0R2xvYmFsRGF0YSh7XG4gICAgICAgICAgICAgICAgICAgIGlzTmV3OiByZXMuZGF0YVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KVxuICAgIH0sXG5cbiAgICAvKiog6I635Y+W5b2T5YmN6LSm5Y+355qE5oq1546w6YeR44CB562+5Yiw57uP6aqMICovXG4gICAgZ2V0UHVzaEludGVncmFsKCApIHtcbiAgICAgICAgaHR0cCh7XG4gICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgc2hvd01vcmU6IHRydWUsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgbG9hZGluZ01zZzogJ25vbmUnLFxuICAgICAgICAgICAgdXJsOiAnY29tbW9uX3B1c2gtaW50ZWdyYWwnLFxuICAgICAgICAgICAgc3VjY2VzczogcmVzID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCB7IHN0YXR1cywgZGF0YSB9ID0gcmVzO1xuICAgICAgICAgICAgICAgIGlmICggc3RhdHVzICE9PSAyMDAgKSB7IHJldHVybjsgfVxuICAgICAgICAgICAgICAgIHRoaXMuc2V0R2xvYmFsRGF0YSh7XG4gICAgICAgICAgICAgICAgICAgIHB1c2hJbnRlZ3JhbDogZGF0YS5pbnRlZ3JhbFxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KVxuICAgIH0sXG5cbiAgICAvKiog6I635Y+W6K6i6ZiF5qih5p2/ICovXG4gICAgZ2V0U3Vic2NyaWJlVGVtcGxhdGVkKCApIHtcbiAgICAgICAgaHR0cCh7XG4gICAgICAgICAgICB1cmw6ICdjb21tb25fZ2V0LXN1YnNjcmliZS10ZW1wbGF0ZXMnLFxuICAgICAgICAgICAgc3VjY2VzczogcmVzID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLnNldEdsb2JhbERhdGEoe1xuICAgICAgICAgICAgICAgICAgICBzdWJzY3JpYmVUZW1wbGF0ZXM6IHJlcy5kYXRhXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgfSxcblxuICAgIC8qKiDojrflj5ZhcHDphY3nva4gKi9cbiAgICBnZXRBcHBDb25maWcoICkge1xuICAgICAgICBodHRwKHtcbiAgICAgICAgICAgIHVybDogJ2NvbW1vbl9jaGVjay1hcHAtY29uZmlnJyxcbiAgICAgICAgICAgIHN1Y2Nlc3M6IHJlcyA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKCByZXMuc3RhdHVzICE9PSAyMDAgKSB7IHJldHVybjsgfVxuICAgICAgICAgICAgICAgIHRoaXMuc2V0R2xvYmFsRGF0YSh7XG4gICAgICAgICAgICAgICAgICAgIGFwcENvbmZpZzogcmVzLmRhdGFcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSlcbiAgICB9LFxuXG4gICAgLyoqIOWFqOWxgOaWueazle+8jOiOt+WPluW+ruS/oeeUqOaIt+eZu+W9leS/oeaBr+OAgeaOiOadg+OAgeS4iuS8oOS/neWtmCAqL1xuICAgIGdldFd4VXNlckluZm8oIGNiICkge1xuICAgICAgICB3eC5nZXRVc2VySW5mbyh7XG4gICAgICAgICAgICBzdWNjZXNzOiByZXMgPT4ge1xuICAgICAgICAgICAgICAgIGh0dHAoe1xuICAgICAgICAgICAgICAgICAgICBkYXRhOiByZXMudXNlckluZm8sXG4gICAgICAgICAgICAgICAgICAgIHVybDogJ2NvbW1vbl91c2VyRWRpdCcsXG4gICAgICAgICAgICAgICAgICAgIHN1Y2Nlc3M6IHJlczIgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCByZXMyICYmIHJlczIuc3RhdHVzID09PSAyMDAgKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zZXRHbG9iYWxEYXRhKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaXNVc2VyQXV0aDogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdXNlckluZm86IHJlcy51c2VySW5mb1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNiICYmIGNiKCApO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgfSxcblxuICAgIC8qKiDojrflj5bnlKjmiLfmnYPpmZDkv6Hmga8gcm9sZS8gb3BlbmlkICovXG4gICAgZ2V0VXNlckluZm8oIGNiICkge1xuICAgICAgICB3eC5jbG91ZC5jYWxsRnVuY3Rpb24oe1xuICAgICAgICAgICAgbmFtZTogJ2xvZ2luJ1xuICAgICAgICB9KS50aGVuKCggcmVzOiBhbnkpID0+IHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdbTE9HSU5dJywgcmVzLnJlc3VsdCApO1xuICAgICAgICAgICAgdGhpcy5zZXRHbG9iYWxEYXRhKCByZXMucmVzdWx0ICk7XG4gICAgICAgICAgICAhIWNiICYmIGNiKCApO1xuICAgICAgICB9KTtcbiAgICB9LFxuXG4gICAgLyoqIOiOt+WPluiuoumYheaOiOadgyAqL1xuICAgIGdldFN1YnNjcmliZSggdHlwZXMgKSB7XG4gICAgICAgIGNvbnN0IGhhc1Nob3cgPSBjaGVja1N1YnNjcmliZVRpcHMoICk7XG4gICAgICAgIGlmICggIWhhc1Nob3cgKSB7XG4gICAgICAgICAgICAvLyDlvLnmoYZcbiAgICAgICAgICAgIHRoaXMuc2V0R2xvYmFsRGF0YSh7XG4gICAgICAgICAgICAgICAgc3Vic2NyaWJlVHB5ZTogdHlwZXMsXG4gICAgICAgICAgICAgICAgc2hvd1N1YnNjcmliZVRpcHM6IHRydWVcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9IGVsc2UgeyAgICBcbiAgICAgICAgICAgIC8vIOiuoumYheivt+axglxuICAgICAgICAgICAgcmVxdWVzdFN1YnNjcmliZSggdHlwZXMsICggdGhpcy5nbG9iYWxEYXRhLnN1YnNjcmliZVRlbXBsYXRlcyB8fCBbIF0pKTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICAvKiog6K6+572u5YWo5bGA5pWw5o2uICovXG4gICAgc2V0R2xvYmFsRGF0YSggb2JqICkge1xuICAgICAgICBjb25zb2xlLmxvZyggJ+OAkC0tLS0gR2xvYmFsIFNldCAtLS0t44CRJywgb2JqIClcbiAgICAgICAgT2JqZWN0LmtleXMoIG9iaiApLm1hcCgga2V5ID0+IHtcbiAgICAgICAgICAgIHRoaXMuZ2xvYmFsRGF0YVsga2V5IF0gPSBvYmpbIGtleSBdO1xuICAgICAgICB9KTtcbiAgICB9LFxuXG4gICAgLyoqIHdhdGNo5Ye95pWwICovXG4gICAgd2F0Y2gkKCBrZXksIGNiICkge1xuICAgICAgICB0aGlzLndhdGNoQ2FsbEJhY2sgPSBPYmplY3QuYXNzaWduKHsgfSwgdGhpcy53YXRjaENhbGxCYWNrLCB7XG4gICAgICAgICAgICBbIGtleSBdOiB0aGlzLndhdGNoQ2FsbEJhY2tbIGtleSBdIHx8IFsgXVxuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy53YXRjaENhbGxCYWNrWyBrZXkgXS5wdXNoKCBjYiApO1xuICAgICAgICAvLyDnq4vpqazmiafooYzkuIDkuItjYlxuICAgICAgICBzZXRUaW1lb3V0KCggKSA9PiB7XG4gICAgICAgICAgICBjb25zdCB2YWwgPSB0aGlzLmdsb2JhbERhdGEkWyBrZXkgXTtcbiAgICAgICAgICAgIGNvbnN0IG9sZCA9IHRoaXMuZ2xvYmFsRGF0YVsga2V5IF07XG4gICAgICAgICAgICBjYiggdmFsLCBvbGQgKTtcbiAgICAgICAgfSwgMCApO1xuXG4gICAgICAgIC8vIOaJp+ihjHNldOeahOaXtuWAme+8jOWGjeaJp+ihjOS4gOS4i2NiXG4gICAgICAgIGlmICggIXRoaXMud2F0Y2hpbmdLZXlzLmZpbmQoIHggPT4geCA9PT0ga2V5ICkpIHtcbiAgICAgICAgICAgIGNvbnN0IHRoYXQgPSB0aGlzO1xuICAgICAgICAgICAgdGhpcy53YXRjaGluZ0tleXMucHVzaCgga2V5ICk7XG4gICAgICAgICAgICAvLyBPYmplY3QuZGVmaW5lUHJvcGVydHkoIHRoaXMuZ2xvYmFsRGF0YSwga2V5LCB7XG4gICAgICAgICAgICAvLyAgICAgY29uZmlndXJhYmxlOiB0cnVlLFxuICAgICAgICAgICAgLy8gICAgIGVudW1lcmFibGU6IHRydWUsXG4gICAgICAgICAgICAvLyAgICAgc2V0OiBmdW5jdGlvbiggdmFsICkge1xuICAgICAgICAgICAgLy8gICAgICAgICBjb25zb2xlLmxvZyhgJHtrZXl96KKrc2V0YCwgdmFsICk7XG4gICAgICAgICAgICAvLyAgICAgICAgIGNvbnN0IG9sZCA9IHRoYXQuZ2xvYmFsRGF0YSRbIGtleSBdO1xuICAgICAgICAgICAgLy8gICAgICAgICB0aGF0Lmdsb2JhbERhdGEkWyBrZXkgXSA9IHZhbDtcbiAgICAgICAgICAgIC8vICAgICAgICAgdGhhdC53YXRjaENhbGxCYWNrWyBrZXkgXS5tYXAoZnVuYyA9PiBmdW5jKCB2YWwsIG9sZCApKTtcbiAgICAgICAgICAgIC8vICAgICB9LFxuICAgICAgICAgICAgLy8gICAgIGdldDogZnVuY3Rpb24oICkge1xuICAgICAgICAgICAgLy8gICAgICAgICByZXR1cm4gdGhhdC5nbG9iYWxEYXRhJFsga2V5IF07XG4gICAgICAgICAgICAvLyAgICAgfVxuICAgICAgICAgICAgLy8gfSk7XG4gICAgICAgIH1cbiAgICB9LFxuICBcbiAgICAvKiog55Sf5ZG95ZGo5pyfICovXG4gICAgb25MYXVuY2g6IGZ1bmN0aW9uKCApIHtcbiAgICAgICAgdGhpcy5pbml0KCApO1xuICAgICAgICB0aGlzLmluaXRDbG91ZCggKVxuICAgICAgICAgICAgLnRoZW4oKCApID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLmdldFVzZXJJbmZvKCApO1xuICAgICAgICAgICAgICAgIHRoaXMuZ2V0QXBwQ29uZmlnKCApO1xuICAgICAgICAgICAgICAgIC8vIHRoaXMuZ2V0UHVzaEludGVncmFsKCApO1xuICAgICAgICAgICAgICAgIC8vIHRoaXMuZ2V0SXNOZXdDdXN0b20oICk7XG4gICAgICAgICAgICAgICAgdGhpcy5nZXRTdWJzY3JpYmVUZW1wbGF0ZWQoICk7XG4gICAgICAgICAgICAgICAgdGhpcy5nZXRXeFVzZXJJbmZvKCApO1xuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC5jYXRjaCggZSA9PiB7XG4gICAgICAgICAgICAgICAgd3guc2hvd1RvYXN0KHtcbiAgICAgICAgICAgICAgICAgICAgaWNvbjogJ25vbmUnLFxuICAgICAgICAgICAgICAgICAgICBkdXJhdGlvbjogMjAwMCxcbiAgICAgICAgICAgICAgICAgICAgdGl0bGU6ICfmlbDmja7lupPliJ3lp4vplJnor68nXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9KVxuICAgICAgICBcbiAgICB9XG59KTtcblxuZXhwb3J0IGludGVyZmFjZSBNeUFwcCB7XG4gICAgZ2xvYmFsRGF0YTogZ2xvYmFsU3RhdGUsXG4gICAgZ2xvYmFsRGF0YSQ6IGdsb2JhbFN0YXRlLFxuICAgIHdhdGNoQ2FsbEJhY2s6IHtcbiAgICAgICAgWyBrZXk6IHN0cmluZyBdOiAoKCB2YWwxOiBhbnksIHZhbDI6IGFueSApID0+IHZvaWQpWyBdXG4gICAgfVxuICAgIHdhdGNoaW5nS2V5czogc3RyaW5nWyBdXG4gICAgaW5pdDogKCApID0+IHZvaWRcbiAgICBpbml0Q2xvdWQ6ICggKSA9PiBQcm9taXNlPGFueT5cbiAgICBnZXRBcHBDb25maWc6ICggKSA9PiB2b2lkXG4gICAgZ2V0VXNlckluZm86ICggY2I/OiAoKSA9PiB2b2lkICkgPT4gdm9pZCxcbiAgICBnZXRJc05ld0N1c3RvbTogICggKSA9PiB2b2lkLFxuICAgIGdldFB1c2hJbnRlZ3JhbDogKCApID0+IHZvaWQsXG4gICAgZ2V0U3Vic2NyaWJlVGVtcGxhdGVkOiAoICkgPT4gdm9pZCxcbiAgICBnZXRXeFVzZXJJbmZvOiAoIGNiPzogKCApID0+IHZvaWQgKSA9PiB2b2lkLFxuICAgIGdldFN1YnNjcmliZTogKCB0eXBlPzogYW55ICkgPT4gdm9pZCxcbiAgICBzZXRHbG9iYWxEYXRhOiA8SyBleHRlbmRzIGtleW9mIGdsb2JhbFN0YXRlPiggZGF0YTogZ2xvYmFsU3RhdGUgfCBQaWNrPGdsb2JhbFN0YXRlLCBLPiApID0+IHZvaWQsXG4gICAgd2F0Y2gkOiAoIGtleToga2V5b2YgZ2xvYmFsU3RhdGUsIGFueSApID0+IHZvaWRcbn1cblxuZW51bSBSb2xlIHtcbiAgICBub3JtYWwsXG4gICAgYWRtaW5cbn1cblxudHlwZSBnbG9iYWxTdGF0ZSA9IHtcbiAgICByb2xlOiBSb2xlLFxuICAgIG9wZW5pZDogc3RyaW5nLFxuICAgIGVkaXRpbmdHb29kOiBhbnksXG4gICAgaXNVc2VyQXV0aDogYm9vbGVhbixcbiAgICB1c2VySW5mbzogYW55XG4gICAgaXNOZXc6IGJvb2xlYW5cbiAgICBhcHBDb25maWc6IGFueSxcbiAgICBzaG93U3Vic2NyaWJlVGlwczogYm9vbGVhblxuICAgIHN1YnNjcmliZVRweWU6IGFueSxcbiAgICBzdWJzY3JpYmVUZW1wbGF0ZXM6IGFueVtdXG4gICAgcHVzaEludGVncmFsOiBudW1iZXJcbn0iXX0=