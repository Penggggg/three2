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
                getError(message || params.errMsg);
            }
            params.success(res.result);
        },
        fail: function (err) { return getError('网络错误', err); },
        complete: function () { return wx.hideLoading({}); }
    });
};
exports.http = http;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaHR0cC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImh0dHAudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7OztBQUFBLElBQU0sU0FBUyxHQUFHO0lBQ2QsR0FBRyxFQUFFLEVBQUU7SUFDUCxJQUFJLEVBQUUsRUFBRztJQUNULE9BQU8sRUFBRSxVQUFFLEdBQUcsSUFBUSxDQUFDO0lBQ3ZCLFVBQVUsRUFBRSxTQUFTO0lBQ3JCLE1BQU0sRUFBRSxVQUFVO0NBQ3JCLENBQUM7QUFJRixJQUFNLElBQUksR0FBRyxVQUFFLE9BQWtCO0lBQzdCLElBQU0sTUFBTSxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUMsRUFBRyxFQUFFLFNBQVMsZUFBTyxPQUFPLEVBQUcsQ0FBQztJQUU3RCxFQUFFLENBQUMsV0FBVyxDQUFDO1FBQ1gsS0FBSyxFQUFFLE1BQU0sQ0FBQyxVQUFVO0tBQzNCLENBQUMsQ0FBQztJQUVILElBQU0sUUFBUSxHQUFHLFVBQUUsR0FBbUIsRUFBRSxHQUFTO1FBQTlCLG9CQUFBLEVBQUEsTUFBTSxNQUFNLENBQUMsTUFBTTtRQUNsQyxHQUFHLElBQUksT0FBTyxDQUFDLEdBQUcsQ0FBRSxHQUFHLENBQUUsQ0FBQztRQUMxQixFQUFFLENBQUMsU0FBUyxDQUFDO1lBQ1QsSUFBSSxFQUFFLE1BQU07WUFDWixLQUFLLEVBQUUsR0FBRztTQUNiLENBQUMsQ0FBQztJQUNQLENBQUMsQ0FBQTtJQUVELElBQU0sSUFBSSxHQUFHLE1BQU0sQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFFLENBQUMsQ0FBRSxDQUFDO0lBQ3hDLElBQU0sSUFBSSxHQUFHLE1BQU0sQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFFLENBQUMsQ0FBRSxDQUFDO0lBRXhDLEVBQUUsQ0FBQyxLQUFLLENBQUMsWUFBWSxDQUFDO1FBQ2xCLElBQUksRUFBRTtZQUNGLElBQUksTUFBQTtZQUNKLElBQUksRUFBRSxNQUFNLENBQUMsSUFBSTtTQUNwQjtRQUNELElBQUksTUFBQTtRQUNKLE9BQU8sRUFBRSxVQUFFLEdBQVE7WUFDUCxJQUFBLG1CQUFNLENBQVM7WUFDdkIsSUFBSyxDQUFDLE1BQU0sRUFBRztnQkFBRSxPQUFPLFFBQVEsRUFBRyxDQUFDO2FBQUM7WUFFN0IsSUFBQSxzQkFBTSxFQUFFLGtCQUFJLEVBQUUsd0JBQU8sQ0FBWTtZQUN6QyxJQUFLLE1BQU0sS0FBSyxHQUFHLEVBQUc7Z0JBQ2xCLFFBQVEsQ0FBRSxPQUFPLElBQUksTUFBTSxDQUFDLE1BQU0sQ0FBRSxDQUFDO2FBQ3hDO1lBRUQsTUFBTSxDQUFDLE9BQU8sQ0FBRSxHQUFHLENBQUMsTUFBTSxDQUFFLENBQUM7UUFFakMsQ0FBQztRQUNELElBQUksRUFBRSxVQUFBLEdBQUcsSUFBSSxPQUFBLFFBQVEsQ0FBRSxNQUFNLEVBQUUsR0FBRyxDQUFFLEVBQXZCLENBQXVCO1FBQ3BDLFFBQVEsRUFBRSxjQUFPLE9BQUEsRUFBRSxDQUFDLFdBQVcsQ0FBQyxFQUFHLENBQUMsRUFBbkIsQ0FBbUI7S0FDdkMsQ0FBQyxDQUFBO0FBRU4sQ0FBQyxDQUFBO0FBR0csb0JBQUkiLCJzb3VyY2VzQ29udGVudCI6WyJjb25zdCBodHRwUGFyYW0gPSB7XG4gICAgdXJsOiAnJyxcbiAgICBkYXRhOiB7IH0sXG4gICAgc3VjY2VzczogKCByZXMgKSA9PiB7IH0sXG4gICAgbG9hZGluZ01zZzogJ+WKoOi9veS4rS4uLi4nLFxuICAgIGVyck1zZzogJ+WKoOi9vemUmeivr++8jOivt+mHjeivlSdcbn07XG5cbnR5cGUgaHR0cFBhcmFtID0gYW55O1xuXG5jb25zdCBodHRwID0gKCBwYXJhbXMkOiBodHRwUGFyYW0gKSA9PiB7XG4gICAgY29uc3QgcGFyYW1zID0gT2JqZWN0LmFzc2lnbih7IH0sIGh0dHBQYXJhbSwgeyAuLi5wYXJhbXMkIH0pO1xuXG4gICAgd3guc2hvd0xvYWRpbmcoe1xuICAgICAgICB0aXRsZTogcGFyYW1zLmxvYWRpbmdNc2dcbiAgICB9KTtcblxuICAgIGNvbnN0IGdldEVycm9yID0gKCBtc2cgPSBwYXJhbXMuZXJyTXNnLCBlcnI/OiBhbnkgKSA9PiB7XG4gICAgICAgIGVyciAmJiBjb25zb2xlLmxvZyggZXJyICk7XG4gICAgICAgIHd4LnNob3dUb2FzdCh7XG4gICAgICAgICAgICBpY29uOiAnbm9uZScsXG4gICAgICAgICAgICB0aXRsZTogbXNnXG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIGNvbnN0IG5hbWUgPSBwYXJhbXMudXJsLnNwbGl0KCdfJylbIDAgXTtcbiAgICBjb25zdCAkdXJsID0gcGFyYW1zLnVybC5zcGxpdCgnXycpWyAxIF07XG5cbiAgICB3eC5jbG91ZC5jYWxsRnVuY3Rpb24oe1xuICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAkdXJsLFxuICAgICAgICAgICAgZGF0YTogcGFyYW1zLmRhdGFcbiAgICAgICAgfSxcbiAgICAgICAgbmFtZSxcbiAgICAgICAgc3VjY2VzczogKCByZXM6IGFueSApID0+IHtcbiAgICAgICAgICAgIGNvbnN0IHsgcmVzdWx0IH0gPSByZXM7XG4gICAgICAgICAgICBpZiAoICFyZXN1bHQgKSB7IHJldHVybiBnZXRFcnJvciggKTt9XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGNvbnN0IHsgc3RhdHVzLCBkYXRhLCBtZXNzYWdlIH0gPSByZXN1bHQ7XG4gICAgICAgICAgICBpZiAoIHN0YXR1cyAhPT0gMjAwICkge1xuICAgICAgICAgICAgICAgIGdldEVycm9yKCBtZXNzYWdlIHx8IHBhcmFtcy5lcnJNc2cgKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcGFyYW1zLnN1Y2Nlc3MoIHJlcy5yZXN1bHQgKTtcblxuICAgICAgICB9LFxuICAgICAgICBmYWlsOiBlcnIgPT4gZ2V0RXJyb3IoICfnvZHnu5zplJnor68nLCBlcnIgKSxcbiAgICAgICAgY29tcGxldGU6ICggKSA9PiB3eC5oaWRlTG9hZGluZyh7IH0pXG4gICAgfSlcblxufVxuXG5leHBvcnQge1xuICAgIGh0dHBcbn07Il19