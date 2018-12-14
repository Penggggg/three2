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
                return getError(message || params.errMsg);
            }
            params.success(res);
        },
        fail: function (err) { return getError('null', err); },
        complete: function () { return wx.hideLoading({}); }
    });
};
exports.http = http;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaHR0cC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImh0dHAudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7OztBQUFBLElBQU0sU0FBUyxHQUFHO0lBQ2QsR0FBRyxFQUFFLEVBQUU7SUFDUCxJQUFJLEVBQUUsRUFBRztJQUNULE9BQU8sRUFBRSxVQUFFLEdBQUcsSUFBUSxDQUFDO0lBQ3ZCLFVBQVUsRUFBRSxTQUFTO0lBQ3JCLE1BQU0sRUFBRSxVQUFVO0NBQ3JCLENBQUM7QUFJRixJQUFNLElBQUksR0FBRyxVQUFFLE9BQWtCO0lBQzdCLElBQU0sTUFBTSxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUMsRUFBRyxFQUFFLFNBQVMsZUFBTyxPQUFPLEVBQUcsQ0FBQztJQUU3RCxFQUFFLENBQUMsV0FBVyxDQUFDO1FBQ1gsS0FBSyxFQUFFLE1BQU0sQ0FBQyxVQUFVO0tBQzNCLENBQUMsQ0FBQztJQUVILElBQU0sUUFBUSxHQUFHLFVBQUUsR0FBbUIsRUFBRSxHQUFTO1FBQTlCLG9CQUFBLEVBQUEsTUFBTSxNQUFNLENBQUMsTUFBTTtRQUNsQyxPQUFPLENBQUMsR0FBRyxDQUFFLEdBQUcsQ0FBRSxDQUFDO1FBQ25CLEVBQUUsQ0FBQyxTQUFTLENBQUM7WUFDVCxJQUFJLEVBQUUsTUFBTTtZQUNaLEtBQUssRUFBRSxHQUFHO1NBQ2IsQ0FBQyxDQUFDO0lBQ1AsQ0FBQyxDQUFBO0lBRUQsRUFBRSxDQUFDLEtBQUssQ0FBQyxZQUFZLENBQUM7UUFDbEIsSUFBSSxFQUFFO1lBQ0YsSUFBSSxFQUFFLE1BQU0sQ0FBQyxJQUFJO1NBQ3BCO1FBQ0QsSUFBSSxFQUFFLE1BQU0sQ0FBQyxHQUFHO1FBQ2hCLE9BQU8sRUFBRSxVQUFFLEdBQVE7WUFDUCxJQUFBLG1CQUFNLENBQVM7WUFDdkIsSUFBSyxDQUFDLE1BQU0sRUFBRztnQkFBRSxPQUFPLFFBQVEsRUFBRyxDQUFDO2FBQUM7WUFFN0IsSUFBQSxzQkFBTSxFQUFFLGtCQUFJLEVBQUUsd0JBQU8sQ0FBWTtZQUN6QyxJQUFLLE1BQU0sS0FBSyxHQUFHLEVBQUc7Z0JBQ2xCLE9BQU8sUUFBUSxDQUFFLE9BQU8sSUFBSSxNQUFNLENBQUMsTUFBTSxDQUFFLENBQUM7YUFDL0M7WUFFRCxNQUFNLENBQUMsT0FBTyxDQUFFLEdBQUcsQ0FBRSxDQUFDO1FBRTFCLENBQUM7UUFDRCxJQUFJLEVBQUUsVUFBQSxHQUFHLElBQUksT0FBQSxRQUFRLENBQUUsTUFBTSxFQUFFLEdBQUcsQ0FBRSxFQUF2QixDQUF1QjtRQUNwQyxRQUFRLEVBQUUsY0FBTyxPQUFBLEVBQUUsQ0FBQyxXQUFXLENBQUMsRUFBRyxDQUFDLEVBQW5CLENBQW1CO0tBQ3ZDLENBQUMsQ0FBQTtBQUVOLENBQUMsQ0FBQTtBQUdHLG9CQUFJIiwic291cmNlc0NvbnRlbnQiOlsiY29uc3QgaHR0cFBhcmFtID0ge1xuICAgIHVybDogJycsXG4gICAgZGF0YTogeyB9LFxuICAgIHN1Y2Nlc3M6ICggcmVzICkgPT4geyB9LFxuICAgIGxvYWRpbmdNc2c6ICfliqDovb3kuK0uLi4uJyxcbiAgICBlcnJNc2c6ICfliqDovb3plJnor6/vvIzor7fph43or5UnXG59O1xuXG50eXBlIGh0dHBQYXJhbSA9IGFueTtcblxuY29uc3QgaHR0cCA9ICggcGFyYW1zJDogaHR0cFBhcmFtICkgPT4ge1xuICAgIGNvbnN0IHBhcmFtcyA9IE9iamVjdC5hc3NpZ24oeyB9LCBodHRwUGFyYW0sIHsgLi4ucGFyYW1zJCB9KTtcblxuICAgIHd4LnNob3dMb2FkaW5nKHtcbiAgICAgICAgdGl0bGU6IHBhcmFtcy5sb2FkaW5nTXNnXG4gICAgfSk7XG5cbiAgICBjb25zdCBnZXRFcnJvciA9ICggbXNnID0gcGFyYW1zLmVyck1zZywgZXJyPzogYW55ICkgPT4ge1xuICAgICAgICBjb25zb2xlLmxvZyggZXJyICk7XG4gICAgICAgIHd4LnNob3dUb2FzdCh7XG4gICAgICAgICAgICBpY29uOiAnbm9uZScsXG4gICAgICAgICAgICB0aXRsZTogbXNnXG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBcbiAgICB3eC5jbG91ZC5jYWxsRnVuY3Rpb24oe1xuICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICBkYXRhOiBwYXJhbXMuZGF0YVxuICAgICAgICB9LFxuICAgICAgICBuYW1lOiBwYXJhbXMudXJsLFxuICAgICAgICBzdWNjZXNzOiAoIHJlczogYW55ICkgPT4ge1xuICAgICAgICAgICAgY29uc3QgeyByZXN1bHQgfSA9IHJlcztcbiAgICAgICAgICAgIGlmICggIXJlc3VsdCApIHsgcmV0dXJuIGdldEVycm9yKCApO31cbiAgICAgICAgICAgIFxuICAgICAgICAgICAgY29uc3QgeyBzdGF0dXMsIGRhdGEsIG1lc3NhZ2UgfSA9IHJlc3VsdDtcbiAgICAgICAgICAgIGlmICggc3RhdHVzICE9PSAyMDAgKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGdldEVycm9yKCBtZXNzYWdlIHx8IHBhcmFtcy5lcnJNc2cgKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcGFyYW1zLnN1Y2Nlc3MoIHJlcyApO1xuXG4gICAgICAgIH0sXG4gICAgICAgIGZhaWw6IGVyciA9PiBnZXRFcnJvciggJ251bGwnLCBlcnIgKSxcbiAgICAgICAgY29tcGxldGU6ICggKSA9PiB3eC5oaWRlTG9hZGluZyh7IH0pXG4gICAgfSlcblxufVxuXG5leHBvcnQge1xuICAgIGh0dHBcbn07Il19