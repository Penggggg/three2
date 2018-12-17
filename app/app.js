"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var http_1 = require("./util/http");
App({
    globalData$: {
        role: 0,
        openid: '',
        isUserAuth: false,
        userInfo: null
    },
    globalData: {
        role: 0,
        openid: '',
        isUserAuth: false,
        userInfo: null
    },
    watchCallBack: {},
    watchingKeys: [],
    init: function () {
        var _this = this;
        wx.cloud.init({
            traceUser: true
        });
        this.globalData$ = Object.assign({}, this.globalData);
        wx.getSetting({
            success: function (res) {
                var isUserAuth = res.authSetting['scope.userInfo'];
                _this.setGlobalData({
                    isUserAuth: isUserAuth === undefined ? false : isUserAuth
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
    getUserInfo: function () {
        var _this = this;
        wx.cloud.callFunction({
            name: 'login'
        }).then(function (res) {
            _this.setGlobalData(res.result);
        });
    },
    setGlobalData: function (obj) {
        var _this = this;
        console.log('setGlobalData...', obj);
        Object.keys(obj).map(function (key) {
            _this.globalData[key] = obj[key];
        });
    },
    watch$: function (key, cb) {
        var _a;
        this.watchCallBack = Object.assign({}, this.watchCallBack, (_a = {},
            _a[key] = this.watchCallBack[key] || [],
            _a));
        this.watchCallBack[key].push(cb);
        console.log('watch$....', key);
        var old = this.globalData[key];
        cb(old, old);
        if (!this.watchingKeys.find(function (x) { return x === key; })) {
            var that_1 = this;
            this.watchingKeys.push(key);
            Object.defineProperty(this.globalData, key, {
                configurable: true,
                enumerable: true,
                set: function (val) {
                    console.log(key + "\u88ABset", val);
                    var old = that_1.globalData$[key];
                    that_1.globalData$[key] = val;
                    that_1.watchCallBack[key].map(function (func) { return func(val, old); });
                },
                get: function () {
                    return that_1.globalData$[key];
                }
            });
        }
    },
    onLaunch: function () {
        this.init();
        this.getUserInfo();
    }
});
var Role;
(function (Role) {
    Role[Role["normal"] = 0] = "normal";
    Role[Role["admin"] = 1] = "admin";
})(Role || (Role = {}));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiYXBwLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsb0NBQW1DO0FBRW5DLEdBQUcsQ0FBUTtJQUdQLFdBQVcsRUFBRTtRQUVULElBQUksRUFBRSxDQUFDO1FBRVAsTUFBTSxFQUFFLEVBQUU7UUFFVixVQUFVLEVBQUUsS0FBSztRQUVqQixRQUFRLEVBQUUsSUFBSTtLQUNqQjtJQUdELFVBQVUsRUFBRTtRQUNSLElBQUksRUFBRSxDQUFDO1FBQ1AsTUFBTSxFQUFFLEVBQUU7UUFDVixVQUFVLEVBQUUsS0FBSztRQUNqQixRQUFRLEVBQUUsSUFBSTtLQUNqQjtJQUdELGFBQWEsRUFBRSxFQUFHO0lBR2xCLFlBQVksRUFBRSxFQUFHO0lBR2pCLElBQUk7UUFBSixpQkFtQkM7UUFqQkcsRUFBRSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUM7WUFDVixTQUFTLEVBQUUsSUFBSTtTQUNsQixDQUFDLENBQUM7UUFHSCxJQUFJLENBQUMsV0FBVyxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUMsRUFBRyxFQUFFLElBQUksQ0FBQyxVQUFVLENBQUUsQ0FBQztRQUd4RCxFQUFFLENBQUMsVUFBVSxDQUFDO1lBQ1YsT0FBTyxFQUFFLFVBQUEsR0FBRztnQkFFUixJQUFNLFVBQVUsR0FBRyxHQUFHLENBQUMsV0FBVyxDQUFDLGdCQUFnQixDQUFDLENBQUM7Z0JBQ3JELEtBQUksQ0FBQyxhQUFhLENBQUM7b0JBQ2YsVUFBVSxFQUFFLFVBQVUsS0FBSyxTQUFTLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsVUFBVTtpQkFDNUQsQ0FBQyxDQUFDO1lBQ1AsQ0FBQztTQUNKLENBQUMsQ0FBQztJQUNQLENBQUM7SUFHRCxhQUFhLFlBQUUsRUFBRTtRQUFqQixpQkFrQkM7UUFqQkcsRUFBRSxDQUFDLFdBQVcsQ0FBQztZQUNYLE9BQU8sRUFBRSxVQUFBLEdBQUc7Z0JBQ1IsV0FBSSxDQUFDO29C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VyxDQUFFLEdBQUcsQ0FBRSxDQUFDO2dCQUNuQyxDQUFDO2FBQ0osQ0FBQyxDQUFDO1NBQ047SUFDTCxDQUFDO0lBR0QsUUFBUSxFQUFFO1FBQ04sSUFBSSxDQUFDLElBQUksRUFBRyxDQUFDO1FBQ2IsSUFBSSxDQUFDLFdBQVcsRUFBRyxDQUFDO0lBQ3hCLENBQUM7Q0FDSixDQUFDLENBQUM7QUFnQkgsSUFBSyxJQUdKO0FBSEQsV0FBSyxJQUFJO0lBQ0wsbUNBQU0sQ0FBQTtJQUNOLGlDQUFLLENBQUE7QUFDVCxDQUFDLEVBSEksSUFBSSxLQUFKLElBQUksUUFHUiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGh0dHAgfSBmcm9tICcuL3V0aWwvaHR0cCc7XG5cbkFwcDxNeUFwcD4oe1xuXG4gICAgLyoqIGZhZGUgZ2xvYmFsRGF0YSAqL1xuICAgIGdsb2JhbERhdGEkOiB7XG4gICAgICAgIC8vIOeZu+W9leS6uuadg+mZkFxuICAgICAgICByb2xlOiAwLFxuICAgICAgICAvLyDnmbvlvZXkurppZFxuICAgICAgICBvcGVuaWQ6ICcnLFxuICAgICAgICAvLyDmmK/lkKblt7Lnu4/mjojmnYPnlKjmiLfkv6Hmga9cbiAgICAgICAgaXNVc2VyQXV0aDogZmFsc2UsXG4gICAgICAgIC8vIOeUqOaIt+S/oeaBr1xuICAgICAgICB1c2VySW5mbzogbnVsbFxuICAgIH0sXG5cbiAgICAvKiog5YWo5bGAc3RvcmUgKi9cbiAgICBnbG9iYWxEYXRhOiB7XG4gICAgICAgIHJvbGU6IDAsXG4gICAgICAgIG9wZW5pZDogJycsXG4gICAgICAgIGlzVXNlckF1dGg6IGZhbHNlLFxuICAgICAgICB1c2VySW5mbzogbnVsbFxuICAgIH0sXG5cbiAgICAvKiog55uR5ZCs5Ye95pWw55qE5a+56LGh5pWw57uEICovXG4gICAgd2F0Y2hDYWxsQmFjazogeyB9LFxuXG4gICAgLyoqIOebkeWQrOWIl+ihqCAqL1xuICAgIHdhdGNoaW5nS2V5czogWyBdLFxuXG4gICAgLyoqIOWIneWni+WMliAqL1xuICAgIGluaXQoICkge1xuICAgICAgICAvLyDkupFcbiAgICAgICAgd3guY2xvdWQuaW5pdCh7XG4gICAgICAgICAgICB0cmFjZVVzZXI6IHRydWVcbiAgICAgICAgfSk7XG4gICAgICAgIFxuICAgICAgICAvLyDlhajlsYDmlbDmja5cbiAgICAgICAgdGhpcy5nbG9iYWxEYXRhJCA9IE9iamVjdC5hc3NpZ24oeyB9LCB0aGlzLmdsb2JhbERhdGEgKTtcblxuICAgICAgICAvLyDnlKjmiLfkv6Hmga9cbiAgICAgICAgd3guZ2V0U2V0dGluZyh7XG4gICAgICAgICAgICBzdWNjZXNzOiByZXMgPT4ge1xuICAgICAgICAgICAgICAgIC8vIOaYr+WQpuW3sue7j+aOiOadg1xuICAgICAgICAgICAgICAgIGNvbnN0IGlzVXNlckF1dGggPSByZXMuYXV0aFNldHRpbmdbJ3Njb3BlLnVzZXJJbmZvJ107XG4gICAgICAgICAgICAgICAgdGhpcy5zZXRHbG9iYWxEYXRhKHtcbiAgICAgICAgICAgICAgICAgICAgaXNVc2VyQXV0aDogaXNVc2VyQXV0aCA9PT0gdW5kZWZpbmVkID8gZmFsc2UgOiBpc1VzZXJBdXRoXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH0sXG5cbiAgICAvKiog6I635Y+W5b6u5L+h55So5oi355m75b2V5L+h5oGv44CB5o6I5p2D44CB5LiK5Lyg5L+d5a2YICovXG4gICAgZ2V0V3hVc2VySW5mbyggY2IgKSB7XG4gICAgICAgIHd4LmdldFVzZXJJbmZvKHtcbiAgICAgICAgICAgIHN1Y2Nlc3M6IHJlcyA9PiB7XG4gICAgICAgICAgICAgICAgaHR0cCh7XG4gICAgICAgICAgICAgICAgICAgIGRhdGE6IHJlcy51c2VySW5mbyxcbiAgICAgICAgICAgICAgICAgICAgdXJsOiAnY29tbW9uX3VzZXJFZGl0JyxcbiAgICAgICAgICAgICAgICAgICAgc3VjY2VzczogcmVzMiA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIHJlczIgJiYgcmVzMi5zdGF0dXMgPT09IDIwMCApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnNldEdsb2JhbERhdGEoe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpc1VzZXJBdXRoOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB1c2VySW5mbzogcmVzLnVzZXJJbmZvXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2IgJiYgY2IoICk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSlcbiAgICB9LFxuXG4gICAgLyoqIOiOt+WPlueUqOaIt+adg+mZkOS/oeaBryByb2xlLyBvcGVuaWQgKi9cbiAgICBnZXRVc2VySW5mbyggKSB7XG4gICAgICAgIHd4LmNsb3VkLmNhbGxGdW5jdGlvbih7XG4gICAgICAgICAgICBuYW1lOiAnbG9naW4nXG4gICAgICAgIH0pLnRoZW4oKCByZXM6IGFueSkgPT4ge1xuICAgICAgICAgICAgdGhpcy5zZXRHbG9iYWxEYXRhKCByZXMucmVzdWx0ICk7XG4gICAgICAgIH0pO1xuICAgIH0sXG5cbiAgICAvKiog6K6+572u5YWo5bGA5pWw5o2uICovXG4gICAgc2V0R2xvYmFsRGF0YSggb2JqICkge1xuICAgICAgICBjb25zb2xlLmxvZyggJ3NldEdsb2JhbERhdGEuLi4nLCBvYmogKVxuICAgICAgICBPYmplY3Qua2V5cyggb2JqICkubWFwKCBrZXkgPT4ge1xuICAgICAgICAgICAgdGhpcy5nbG9iYWxEYXRhWyBrZXkgXSA9IG9ialsga2V5IF07XG4gICAgICAgIH0pO1xuICAgIH0sXG5cbiAgICAvKiogd2F0Y2jlh73mlbAgKi9cbiAgICB3YXRjaCQoIGtleSwgY2IgKSB7XG4gICAgICAgIHRoaXMud2F0Y2hDYWxsQmFjayA9IE9iamVjdC5hc3NpZ24oeyB9LCB0aGlzLndhdGNoQ2FsbEJhY2ssIHtcbiAgICAgICAgICAgIFsga2V5IF06IHRoaXMud2F0Y2hDYWxsQmFja1sga2V5IF0gfHwgWyBdXG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLndhdGNoQ2FsbEJhY2tbIGtleSBdLnB1c2goIGNiICk7XG4gICAgICAgIGNvbnNvbGUubG9nKCAnd2F0Y2gkLi4uLicsIGtleSApO1xuICAgICAgICAvLyDnq4vpqazmiafooYzkuIDkuItjYlxuICAgICAgICBjb25zdCBvbGQgPSB0aGlzLmdsb2JhbERhdGFbIGtleSBdO1xuICAgICAgICBjYiggb2xkLCBvbGQgKTtcblxuICAgICAgICAvLyDmiafooYxzZXTnmoTml7blgJnvvIzlho3miafooYzkuIDkuItjYlxuICAgICAgICBpZiAoICF0aGlzLndhdGNoaW5nS2V5cy5maW5kKCB4ID0+IHggPT09IGtleSApKSB7XG4gICAgICAgICAgICBjb25zdCB0aGF0ID0gdGhpcztcbiAgICAgICAgICAgIHRoaXMud2F0Y2hpbmdLZXlzLnB1c2goIGtleSApO1xuICAgICAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KCB0aGlzLmdsb2JhbERhdGEsIGtleSwge1xuICAgICAgICAgICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcbiAgICAgICAgICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxuICAgICAgICAgICAgICAgIHNldDogZnVuY3Rpb24oIHZhbCApIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coYCR7a2V5feiiq3NldGAsIHZhbCApO1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBvbGQgPSB0aGF0Lmdsb2JhbERhdGEkWyBrZXkgXTtcbiAgICAgICAgICAgICAgICAgICAgdGhhdC5nbG9iYWxEYXRhJFsga2V5IF0gPSB2YWw7XG4gICAgICAgICAgICAgICAgICAgIHRoYXQud2F0Y2hDYWxsQmFja1sga2V5IF0ubWFwKGZ1bmMgPT4gZnVuYyggdmFsLCBvbGQgKSk7XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBnZXQ6IGZ1bmN0aW9uKCApIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoYXQuZ2xvYmFsRGF0YSRbIGtleSBdO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfSxcbiAgXG4gICAgLyoqIOeUn+WRveWRqOacnyAqL1xuICAgIG9uTGF1bmNoOiBmdW5jdGlvbiggKSB7XG4gICAgICAgIHRoaXMuaW5pdCggKTtcbiAgICAgICAgdGhpcy5nZXRVc2VySW5mbyggKTtcbiAgICB9XG59KTtcblxuZXhwb3J0IGludGVyZmFjZSBNeUFwcCB7XG4gICAgZ2xvYmFsRGF0YTogZ2xvYmFsU3RhdGUsXG4gICAgZ2xvYmFsRGF0YSQ6IGdsb2JhbFN0YXRlLFxuICAgIHdhdGNoQ2FsbEJhY2s6IHtcbiAgICAgICAgWyBrZXk6IHN0cmluZyBdOiAoKCB2YWwxOiBhbnksIHZhbDI6IGFueSApID0+IHZvaWQpWyBdXG4gICAgfVxuICAgIHdhdGNoaW5nS2V5czogc3RyaW5nWyBdXG4gICAgaW5pdDogKCApID0+IHZvaWRcbiAgICBnZXRVc2VySW5mbzogKCApID0+IHZvaWQsXG4gICAgZ2V0V3hVc2VySW5mbzogKCBjYj86ICggKSA9PiB2b2lkICkgPT4gdm9pZCxcbiAgICBzZXRHbG9iYWxEYXRhOiA8SyBleHRlbmRzIGtleW9mIGdsb2JhbFN0YXRlPiggZGF0YTogZ2xvYmFsU3RhdGUgfCBQaWNrPGdsb2JhbFN0YXRlLCBLPiApID0+IHZvaWQsXG4gICAgd2F0Y2gkOiAoIGtleToga2V5b2YgZ2xvYmFsU3RhdGUsIGFueSApID0+IHZvaWRcbn1cblxuZW51bSBSb2xlIHtcbiAgICBub3JtYWwsXG4gICAgYWRtaW5cbn1cblxudHlwZSBnbG9iYWxTdGF0ZSA9IHtcbiAgICByb2xlOiBSb2xlLFxuICAgIG9wZW5pZDogc3RyaW5nLFxuICAgIGlzVXNlckF1dGg6IGJvb2xlYW4sXG4gICAgdXNlckluZm86IGFueVxufSJdfQ==