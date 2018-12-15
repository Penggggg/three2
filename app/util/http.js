"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var httpParam = {
    url: '',
    data: {},
    success: function (res) { },
    loadingMsg: '加载中....',
    errMsg: '加载错误，请重试'
};
var http = function (params$) {
    var params = Object.assign({}, httpParam, __assign({}, params$));
    wx.showLoading({
        title: params.loadingMsg
    });
    var getError = function (msg, err) {
        if (msg === void 0) { msg = params.errMsg; }
        err && console.log(err);
        wx.showToast({
            icon: 'none',
            title: msg
        });
    };
    var name = params.url.split('_')[0];
    var $url = params.url.split('_')[1];
    wx.cloud.callFunction({
        data: {
            $url: $url,
            data: params.data
        },
        name: name,
        success: function (res) {
            var result = res.result;
            if (!result) {
                return getError();
            }
            var status = result.status, data = result.data, message = result.message;
            if (status !== 200) {
                getError(message && message !== {} ? message : params.errMsg);
            }
            params.success(res.result);
        },
        fail: function (err) { return getError('网络错误', err); },
        complete: function () { return wx.hideLoading({}); }
    });
};
exports.http = http;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaHR0cC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImh0dHAudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7OztBQUFBLElBQU0sU0FBUyxHQUFHO0lBQ2QsR0FBRyxFQUFFLEVBQUU7SUFDUCxJQUFJLEVBQUUsRUFBRztJQUNULE9BQU8sRUFBRSxVQUFFLEdBQUcsSUFBUSxDQUFDO0lBQ3ZCLFVBQVUsRUFBRSxTQUFTO0lBQ3JCLE1BQU0sRUFBRSxVQUFVO0NBQ3JCLENBQUM7QUFJRixJQUFNLElBQUksR0FBRyxVQUFFLE9BQWtCO0lBQzdCLElBQU0sTUFBTSxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUMsRUFBRyxFQUFFLFNBQVMsZUFBTyxPQUFPLEVBQUcsQ0FBQztJQUU3RCxFQUFFLENBQUMsV0FBVyxDQUFDO1FBQ1gsS0FBSyxFQUFFLE1BQU0sQ0FBQyxVQUFVO0tBQzNCLENBQUMsQ0FBQztJQUVILElBQU0sUUFBUSxHQUFHLFVBQUUsR0FBbUIsRUFBRSxHQUFTO1FBQTlCLG9CQUFBLEVBQUEsTUFBTSxNQUFNLENBQUMsTUFBTTtRQUNsQyxHQUFHLElBQUksT0FBTyxDQUFDLEdBQUcsQ0FBRSxHQUFHLENBQUUsQ0FBQztRQUMxQixFQUFFLENBQUMsU0FBUyxDQUFDO1lBQ1QsSUFBSSxFQUFFLE1BQU07WUFDWixLQUFLLEVBQUUsR0FBRztTQUNiLENBQUMsQ0FBQztJQUNQLENBQUMsQ0FBQTtJQUVELElBQU0sSUFBSSxHQUFHLE1BQU0sQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFFLENBQUMsQ0FBRSxDQUFDO0lBQ3hDLElBQU0sSUFBSSxHQUFHLE1BQU0sQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFFLENBQUMsQ0FBRSxDQUFDO0lBRXhDLEVBQUUsQ0FBQyxLQUFLLENBQUMsWUFBWSxDQUFDO1FBQ2xCLElBQUksRUFBRTtZQUNGLElBQUksTUFBQTtZQUNKLElBQUksRUFBRSxNQUFNLENBQUMsSUFBSTtTQUNwQjtRQUNELElBQUksTUFBQTtRQUNKLE9BQU8sRUFBRSxVQUFFLEdBQVE7WUFDUCxJQUFBLG1CQUFNLENBQVM7WUFDdkIsSUFBSyxDQUFDLE1BQU0sRUFBRztnQkFBRSxPQUFPLFFBQVEsRUFBRyxDQUFDO2FBQUM7WUFFN0IsSUFBQSxzQkFBTSxFQUFFLGtCQUFJLEVBQUUsd0JBQU8sQ0FBWTtZQUN6QyxJQUFLLE1BQU0sS0FBSyxHQUFHLEVBQUc7Z0JBQ2xCLFFBQVEsQ0FBRSxPQUFPLElBQUksT0FBTyxLQUFLLEVBQUcsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFFLENBQUM7YUFDcEU7WUFFRCxNQUFNLENBQUMsT0FBTyxDQUFFLEdBQUcsQ0FBQyxNQUFNLENBQUUsQ0FBQztRQUVqQyxDQUFDO1FBQ0QsSUFBSSxFQUFFLFVBQUEsR0FBRyxJQUFJLE9BQUEsUUFBUSxDQUFFLE1BQU0sRUFBRSxHQUFHLENBQUUsRUFBdkIsQ0FBdUI7UUFDcEMsUUFBUSxFQUFFLGNBQU8sT0FBQSxFQUFFLENBQUMsV0FBVyxDQUFDLEVBQUcsQ0FBQyxFQUFuQixDQUFtQjtLQUN2QyxDQUFDLENBQUE7QUFFTixDQUFDLENBQUE7QUFHRyxvQkFBSSIsInNvdXJjZXNDb250ZW50IjpbImNvbnN0IGh0dHBQYXJhbSA9IHtcbiAgICB1cmw6ICcnLFxuICAgIGRhdGE6IHsgfSxcbiAgICBzdWNjZXNzOiAoIHJlcyApID0+IHsgfSxcbiAgICBsb2FkaW5nTXNnOiAn5Yqg6L295LitLi4uLicsXG4gICAgZXJyTXNnOiAn5Yqg6L296ZSZ6K+v77yM6K+36YeN6K+VJ1xufTtcblxudHlwZSBodHRwUGFyYW0gPSBhbnk7XG5cbmNvbnN0IGh0dHAgPSAoIHBhcmFtcyQ6IGh0dHBQYXJhbSApID0+IHtcbiAgICBjb25zdCBwYXJhbXMgPSBPYmplY3QuYXNzaWduKHsgfSwgaHR0cFBhcmFtLCB7IC4uLnBhcmFtcyQgfSk7XG5cbiAgICB3eC5zaG93TG9hZGluZyh7XG4gICAgICAgIHRpdGxlOiBwYXJhbXMubG9hZGluZ01zZ1xuICAgIH0pO1xuXG4gICAgY29uc3QgZ2V0RXJyb3IgPSAoIG1zZyA9IHBhcmFtcy5lcnJNc2csIGVycj86IGFueSApID0+IHtcbiAgICAgICAgZXJyICYmIGNvbnNvbGUubG9nKCBlcnIgKTtcbiAgICAgICAgd3guc2hvd1RvYXN0KHtcbiAgICAgICAgICAgIGljb246ICdub25lJyxcbiAgICAgICAgICAgIHRpdGxlOiBtc2dcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgY29uc3QgbmFtZSA9IHBhcmFtcy51cmwuc3BsaXQoJ18nKVsgMCBdO1xuICAgIGNvbnN0ICR1cmwgPSBwYXJhbXMudXJsLnNwbGl0KCdfJylbIDEgXTtcblxuICAgIHd4LmNsb3VkLmNhbGxGdW5jdGlvbih7XG4gICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICR1cmwsXG4gICAgICAgICAgICBkYXRhOiBwYXJhbXMuZGF0YVxuICAgICAgICB9LFxuICAgICAgICBuYW1lLFxuICAgICAgICBzdWNjZXNzOiAoIHJlczogYW55ICkgPT4ge1xuICAgICAgICAgICAgY29uc3QgeyByZXN1bHQgfSA9IHJlcztcbiAgICAgICAgICAgIGlmICggIXJlc3VsdCApIHsgcmV0dXJuIGdldEVycm9yKCApO31cbiAgICAgICAgICAgIFxuICAgICAgICAgICAgY29uc3QgeyBzdGF0dXMsIGRhdGEsIG1lc3NhZ2UgfSA9IHJlc3VsdDtcbiAgICAgICAgICAgIGlmICggc3RhdHVzICE9PSAyMDAgKSB7XG4gICAgICAgICAgICAgICAgZ2V0RXJyb3IoIG1lc3NhZ2UgJiYgbWVzc2FnZSAhPT0geyB9ID8gbWVzc2FnZSA6IHBhcmFtcy5lcnJNc2cgKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcGFyYW1zLnN1Y2Nlc3MoIHJlcy5yZXN1bHQgKTtcblxuICAgICAgICB9LFxuICAgICAgICBmYWlsOiBlcnIgPT4gZ2V0RXJyb3IoICfnvZHnu5zplJnor68nLCBlcnIgKSxcbiAgICAgICAgY29tcGxldGU6ICggKSA9PiB3eC5oaWRlTG9hZGluZyh7IH0pXG4gICAgfSlcblxufVxuXG5leHBvcnQge1xuICAgIGh0dHBcbn07Il19