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
        console.log(err);
        wx.showToast({
            icon: 'none',
            title: msg
        });
    };
    wx.cloud.callFunction({
        data: {
            data: params.data
        },
        name: params.url,
        success: function (res) {
            var result = res.result;
            if (!result) {
                return getError();
            }
            var status = result.status, data = result.data, message = result.message;
            if (status !== 200) {
                return getError(message || null);
            }
            params.success(res);
        },
        fail: function (err) { return getError('null', err); },
        complete: function () { return wx.hideLoading({}); }
    });
};
exports.http = http;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaHR0cC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImh0dHAudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7OztBQUFBLElBQU0sU0FBUyxHQUFHO0lBQ2QsR0FBRyxFQUFFLEVBQUU7SUFDUCxJQUFJLEVBQUUsRUFBRztJQUNULE9BQU8sRUFBRSxVQUFFLEdBQUcsSUFBUSxDQUFDO0lBQ3ZCLFVBQVUsRUFBRSxTQUFTO0lBQ3JCLE1BQU0sRUFBRSxVQUFVO0NBQ3JCLENBQUM7QUFJRixJQUFNLElBQUksR0FBRyxVQUFFLE9BQWtCO0lBQzdCLElBQU0sTUFBTSxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUMsRUFBRyxFQUFFLFNBQVMsZUFBTyxPQUFPLEVBQUcsQ0FBQztJQUU3RCxFQUFFLENBQUMsV0FBVyxDQUFDO1FBQ1gsS0FBSyxFQUFFLE1BQU0sQ0FBQyxVQUFVO0tBQzNCLENBQUMsQ0FBQztJQUVILElBQU0sUUFBUSxHQUFHLFVBQUUsR0FBbUIsRUFBRyxHQUFTO1FBQS9CLG9CQUFBLEVBQUEsTUFBTSxNQUFNLENBQUMsTUFBTTtRQUNsQyxPQUFPLENBQUMsR0FBRyxDQUFFLEdBQUcsQ0FBRSxDQUFDO1FBQ25CLEVBQUUsQ0FBQyxTQUFTLENBQUM7WUFDVCxJQUFJLEVBQUUsTUFBTTtZQUNaLEtBQUssRUFBRSxHQUFHO1NBQ2IsQ0FBQyxDQUFDO0lBQ1AsQ0FBQyxDQUFBO0lBRUQsRUFBRSxDQUFDLEtBQUssQ0FBQyxZQUFZLENBQUM7UUFDbEIsSUFBSSxFQUFFO1lBQ0YsSUFBSSxFQUFFLE1BQU0sQ0FBQyxJQUFJO1NBQ3BCO1FBQ0QsSUFBSSxFQUFFLE1BQU0sQ0FBQyxHQUFHO1FBQ2hCLE9BQU8sRUFBRSxVQUFFLEdBQVE7WUFDUCxJQUFBLG1CQUFNLENBQVM7WUFDdkIsSUFBSyxDQUFDLE1BQU0sRUFBRztnQkFBRSxPQUFPLFFBQVEsRUFBRyxDQUFDO2FBQUM7WUFFN0IsSUFBQSxzQkFBTSxFQUFFLGtCQUFJLEVBQUUsd0JBQU8sQ0FBWTtZQUN6QyxJQUFLLE1BQU0sS0FBSyxHQUFHLEVBQUc7Z0JBQ2xCLE9BQU8sUUFBUSxDQUFFLE9BQU8sSUFBSSxJQUFJLENBQUUsQ0FBQzthQUN0QztZQUVELE1BQU0sQ0FBQyxPQUFPLENBQUUsR0FBRyxDQUFFLENBQUM7UUFFMUIsQ0FBQztRQUNELElBQUksRUFBRSxVQUFBLEdBQUcsSUFBSSxPQUFBLFFBQVEsQ0FBRSxNQUFNLEVBQUUsR0FBRyxDQUFFLEVBQXZCLENBQXVCO1FBQ3BDLFFBQVEsRUFBRSxjQUFPLE9BQUEsRUFBRSxDQUFDLFdBQVcsQ0FBQyxFQUFHLENBQUMsRUFBbkIsQ0FBbUI7S0FDdkMsQ0FBQyxDQUFBO0FBRU4sQ0FBQyxDQUFBO0FBR0csb0JBQUkiLCJzb3VyY2VzQ29udGVudCI6WyJjb25zdCBodHRwUGFyYW0gPSB7XG4gICAgdXJsOiAnJyxcbiAgICBkYXRhOiB7IH0sXG4gICAgc3VjY2VzczogKCByZXMgKSA9PiB7IH0sXG4gICAgbG9hZGluZ01zZzogJ+WKoOi9veS4rS4uLi4nLFxuICAgIGVyck1zZzogJ+WKoOi9vemUmeivr++8jOivt+mHjeivlSdcbn07XG5cbnR5cGUgaHR0cFBhcmFtID0gYW55O1xuXG5jb25zdCBodHRwID0gKCBwYXJhbXMkOiBodHRwUGFyYW0gKSA9PiB7XG4gICAgY29uc3QgcGFyYW1zID0gT2JqZWN0LmFzc2lnbih7IH0sIGh0dHBQYXJhbSwgeyAuLi5wYXJhbXMkIH0pO1xuXG4gICAgd3guc2hvd0xvYWRpbmcoe1xuICAgICAgICB0aXRsZTogcGFyYW1zLmxvYWRpbmdNc2dcbiAgICB9KTtcblxuICAgIGNvbnN0IGdldEVycm9yID0gKCBtc2cgPSBwYXJhbXMuZXJyTXNnICwgZXJyPzogYW55ICkgPT4ge1xuICAgICAgICBjb25zb2xlLmxvZyggZXJyICk7XG4gICAgICAgIHd4LnNob3dUb2FzdCh7XG4gICAgICAgICAgICBpY29uOiAnbm9uZScsXG4gICAgICAgICAgICB0aXRsZTogbXNnXG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBcbiAgICB3eC5jbG91ZC5jYWxsRnVuY3Rpb24oe1xuICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICBkYXRhOiBwYXJhbXMuZGF0YVxuICAgICAgICB9LFxuICAgICAgICBuYW1lOiBwYXJhbXMudXJsLFxuICAgICAgICBzdWNjZXNzOiAoIHJlczogYW55ICkgPT4ge1xuICAgICAgICAgICAgY29uc3QgeyByZXN1bHQgfSA9IHJlcztcbiAgICAgICAgICAgIGlmICggIXJlc3VsdCApIHsgcmV0dXJuIGdldEVycm9yKCApO31cbiAgICAgICAgICAgIFxuICAgICAgICAgICAgY29uc3QgeyBzdGF0dXMsIGRhdGEsIG1lc3NhZ2UgfSA9IHJlc3VsdDtcbiAgICAgICAgICAgIGlmICggc3RhdHVzICE9PSAyMDAgKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGdldEVycm9yKCBtZXNzYWdlIHx8IG51bGwgKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcGFyYW1zLnN1Y2Nlc3MoIHJlcyApO1xuXG4gICAgICAgIH0sXG4gICAgICAgIGZhaWw6IGVyciA9PiBnZXRFcnJvciggJ251bGwnLCBlcnIgKSxcbiAgICAgICAgY29tcGxldGU6ICggKSA9PiB3eC5oaWRlTG9hZGluZyh7IH0pXG4gICAgfSlcblxufVxuXG5leHBvcnQge1xuICAgIGh0dHBcbn07Il19