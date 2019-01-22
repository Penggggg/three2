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
    errMsg: '加载错误，请重试',
    complete: function () { },
    error: function () { }
};
var http = function (params$) {
    var params = Object.assign({}, httpParam, __assign({}, params$));
    wx.showLoading({
        title: params.loadingMsg
    });
    var getError = function (msg, err) {
        if (msg === void 0) { msg = params.errMsg; }
        err && console.log("Error: ", err || msg);
        wx.showToast({
            icon: 'none',
            title: msg,
            duration: 2000
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
            else {
                wx.hideLoading({});
            }
            params.success(res.result);
        },
        fail: function (err) {
            getError('网络错误', err);
            params.error && params.error();
        },
        complete: function () {
            params.complete && params.complete();
        }
    });
};
exports.http = http;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaHR0cC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImh0dHAudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7OztBQUFBLElBQU0sU0FBUyxHQUFHO0lBQ2QsR0FBRyxFQUFFLEVBQUU7SUFDUCxJQUFJLEVBQUUsRUFBRztJQUNULE9BQU8sRUFBRSxVQUFFLEdBQUcsSUFBUSxDQUFDO0lBQ3ZCLFVBQVUsRUFBRSxTQUFTO0lBQ3JCLE1BQU0sRUFBRSxVQUFVO0lBQ2xCLFFBQVEsRUFBRSxjQUFTLENBQUM7SUFDcEIsS0FBSyxFQUFFLGNBQVMsQ0FBQztDQUNwQixDQUFDO0FBSUYsSUFBTSxJQUFJLEdBQUcsVUFBRSxPQUFrQjtJQUM3QixJQUFNLE1BQU0sR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDLEVBQUcsRUFBRSxTQUFTLGVBQU8sT0FBTyxFQUFHLENBQUM7SUFFN0QsRUFBRSxDQUFDLFdBQVcsQ0FBQztRQUNYLEtBQUssRUFBRSxNQUFNLENBQUMsVUFBVTtLQUMzQixDQUFDLENBQUM7SUFFSCxJQUFNLFFBQVEsR0FBRyxVQUFFLEdBQW1CLEVBQUUsR0FBUztRQUE5QixvQkFBQSxFQUFBLE1BQU0sTUFBTSxDQUFDLE1BQU07UUFDbEMsR0FBRyxJQUFJLE9BQU8sQ0FBQyxHQUFHLENBQUMsU0FBUyxFQUFFLEdBQUcsSUFBSSxHQUFHLENBQUUsQ0FBQztRQUMzQyxFQUFFLENBQUMsU0FBUyxDQUFDO1lBQ1QsSUFBSSxFQUFFLE1BQU07WUFDWixLQUFLLEVBQUUsR0FBRztZQUNWLFFBQVEsRUFBRSxJQUFJO1NBQ2pCLENBQUMsQ0FBQztJQUNQLENBQUMsQ0FBQTtJQUVELElBQU0sSUFBSSxHQUFHLE1BQU0sQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFFLENBQUMsQ0FBRSxDQUFDO0lBQ3hDLElBQU0sSUFBSSxHQUFHLE1BQU0sQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFFLENBQUMsQ0FBRSxDQUFDO0lBRXhDLEVBQUUsQ0FBQyxLQUFLLENBQUMsWUFBWSxDQUFDO1FBQ2xCLElBQUksRUFBRTtZQUNGLElBQUksTUFBQTtZQUNKLElBQUksRUFBRSxNQUFNLENBQUMsSUFBSTtTQUNwQjtRQUNELElBQUksTUFBQTtRQUNKLE9BQU8sRUFBRSxVQUFFLEdBQVE7WUFDUCxJQUFBLG1CQUFNLENBQVM7WUFDdkIsSUFBSyxDQUFDLE1BQU0sRUFBRztnQkFBRSxPQUFPLFFBQVEsRUFBRyxDQUFDO2FBQUM7WUFFN0IsSUFBQSxzQkFBTSxFQUFFLGtCQUFJLEVBQUUsd0JBQU8sQ0FBWTtZQUN6QyxJQUFLLE1BQU0sS0FBSyxHQUFHLEVBQUc7Z0JBQ2xCLFFBQVEsQ0FBRSxPQUFPLElBQUksT0FBTyxLQUFLLEVBQUcsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFFLENBQUM7YUFFcEU7aUJBQU07Z0JBQ0gsRUFBRSxDQUFDLFdBQVcsQ0FBQyxFQUFHLENBQUMsQ0FBQzthQUN2QjtZQUNELE1BQU0sQ0FBQyxPQUFPLENBQUUsR0FBRyxDQUFDLE1BQU0sQ0FBRSxDQUFDO1FBQ2pDLENBQUM7UUFDRCxJQUFJLEVBQUUsVUFBQSxHQUFHO1lBQ0wsUUFBUSxDQUFFLE1BQU0sRUFBRSxHQUFHLENBQUUsQ0FBQztZQUN4QixNQUFNLENBQUMsS0FBSyxJQUFJLE1BQU0sQ0FBQyxLQUFLLEVBQUcsQ0FBQTtRQUNuQyxDQUFDO1FBQ0QsUUFBUSxFQUFFO1lBRU4sTUFBTSxDQUFDLFFBQVEsSUFBSSxNQUFNLENBQUMsUUFBUSxFQUFHLENBQUE7UUFDekMsQ0FBQztLQUNKLENBQUMsQ0FBQTtBQUVOLENBQUMsQ0FBQTtBQUdHLG9CQUFJIiwic291cmNlc0NvbnRlbnQiOlsiY29uc3QgaHR0cFBhcmFtID0ge1xuICAgIHVybDogJycsXG4gICAgZGF0YTogeyB9LFxuICAgIHN1Y2Nlc3M6ICggcmVzICkgPT4geyB9LFxuICAgIGxvYWRpbmdNc2c6ICfliqDovb3kuK0uLi4uJyxcbiAgICBlcnJNc2c6ICfliqDovb3plJnor6/vvIzor7fph43or5UnLFxuICAgIGNvbXBsZXRlOiAoICkgPT4geyB9LFxuICAgIGVycm9yOiAoICkgPT4geyB9XG59O1xuXG50eXBlIGh0dHBQYXJhbSA9IGFueTtcblxuY29uc3QgaHR0cCA9ICggcGFyYW1zJDogaHR0cFBhcmFtICkgPT4ge1xuICAgIGNvbnN0IHBhcmFtcyA9IE9iamVjdC5hc3NpZ24oeyB9LCBodHRwUGFyYW0sIHsgLi4ucGFyYW1zJCB9KTtcblxuICAgIHd4LnNob3dMb2FkaW5nKHtcbiAgICAgICAgdGl0bGU6IHBhcmFtcy5sb2FkaW5nTXNnXG4gICAgfSk7XG5cbiAgICBjb25zdCBnZXRFcnJvciA9ICggbXNnID0gcGFyYW1zLmVyck1zZywgZXJyPzogYW55ICkgPT4ge1xuICAgICAgICBlcnIgJiYgY29uc29sZS5sb2coYEVycm9yOiBgLCBlcnIgfHwgbXNnICk7XG4gICAgICAgIHd4LnNob3dUb2FzdCh7XG4gICAgICAgICAgICBpY29uOiAnbm9uZScsXG4gICAgICAgICAgICB0aXRsZTogbXNnLFxuICAgICAgICAgICAgZHVyYXRpb246IDIwMDBcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgY29uc3QgbmFtZSA9IHBhcmFtcy51cmwuc3BsaXQoJ18nKVsgMCBdO1xuICAgIGNvbnN0ICR1cmwgPSBwYXJhbXMudXJsLnNwbGl0KCdfJylbIDEgXTtcblxuICAgIHd4LmNsb3VkLmNhbGxGdW5jdGlvbih7XG4gICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICR1cmwsXG4gICAgICAgICAgICBkYXRhOiBwYXJhbXMuZGF0YVxuICAgICAgICB9LFxuICAgICAgICBuYW1lLFxuICAgICAgICBzdWNjZXNzOiAoIHJlczogYW55ICkgPT4ge1xuICAgICAgICAgICAgY29uc3QgeyByZXN1bHQgfSA9IHJlcztcbiAgICAgICAgICAgIGlmICggIXJlc3VsdCApIHsgcmV0dXJuIGdldEVycm9yKCApO31cbiAgICAgICAgICAgIFxuICAgICAgICAgICAgY29uc3QgeyBzdGF0dXMsIGRhdGEsIG1lc3NhZ2UgfSA9IHJlc3VsdDtcbiAgICAgICAgICAgIGlmICggc3RhdHVzICE9PSAyMDAgKSB7XG4gICAgICAgICAgICAgICAgZ2V0RXJyb3IoIG1lc3NhZ2UgJiYgbWVzc2FnZSAhPT0geyB9ID8gbWVzc2FnZSA6IHBhcmFtcy5lcnJNc2cgKTtcblxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB3eC5oaWRlTG9hZGluZyh7IH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcGFyYW1zLnN1Y2Nlc3MoIHJlcy5yZXN1bHQgKTtcbiAgICAgICAgfSxcbiAgICAgICAgZmFpbDogZXJyID0+IHtcbiAgICAgICAgICAgIGdldEVycm9yKCAn572R57uc6ZSZ6K+vJywgZXJyICk7XG4gICAgICAgICAgICBwYXJhbXMuZXJyb3IgJiYgcGFyYW1zLmVycm9yKCApXG4gICAgICAgIH0sXG4gICAgICAgIGNvbXBsZXRlOiAoICkgPT4ge1xuICAgICAgICAgICAgLy8gd3guaGlkZUxvYWRpbmcoeyB9KTtcbiAgICAgICAgICAgIHBhcmFtcy5jb21wbGV0ZSAmJiBwYXJhbXMuY29tcGxldGUoIClcbiAgICAgICAgfVxuICAgIH0pXG5cbn1cblxuZXhwb3J0IHtcbiAgICBodHRwXG59OyJdfQ==