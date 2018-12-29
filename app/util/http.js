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
        fail: function (err) {
            getError('网络错误', err);
            params.error && params.error();
        },
        complete: function () {
            wx.hideLoading({});
            params.complete && params.complete();
        }
    });
};
exports.http = http;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaHR0cC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImh0dHAudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7OztBQUFBLElBQU0sU0FBUyxHQUFHO0lBQ2QsR0FBRyxFQUFFLEVBQUU7SUFDUCxJQUFJLEVBQUUsRUFBRztJQUNULE9BQU8sRUFBRSxVQUFFLEdBQUcsSUFBUSxDQUFDO0lBQ3ZCLFVBQVUsRUFBRSxTQUFTO0lBQ3JCLE1BQU0sRUFBRSxVQUFVO0lBQ2xCLFFBQVEsRUFBRSxjQUFTLENBQUM7SUFDcEIsS0FBSyxFQUFFLGNBQVMsQ0FBQztDQUNwQixDQUFDO0FBSUYsSUFBTSxJQUFJLEdBQUcsVUFBRSxPQUFrQjtJQUM3QixJQUFNLE1BQU0sR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDLEVBQUcsRUFBRSxTQUFTLGVBQU8sT0FBTyxFQUFHLENBQUM7SUFFN0QsRUFBRSxDQUFDLFdBQVcsQ0FBQztRQUNYLEtBQUssRUFBRSxNQUFNLENBQUMsVUFBVTtLQUMzQixDQUFDLENBQUM7SUFFSCxJQUFNLFFBQVEsR0FBRyxVQUFFLEdBQW1CLEVBQUUsR0FBUztRQUE5QixvQkFBQSxFQUFBLE1BQU0sTUFBTSxDQUFDLE1BQU07UUFDbEMsR0FBRyxJQUFJLE9BQU8sQ0FBQyxHQUFHLENBQUUsR0FBRyxDQUFFLENBQUM7UUFDMUIsRUFBRSxDQUFDLFNBQVMsQ0FBQztZQUNULElBQUksRUFBRSxNQUFNO1lBQ1osS0FBSyxFQUFFLEdBQUc7U0FDYixDQUFDLENBQUM7SUFDUCxDQUFDLENBQUE7SUFFRCxJQUFNLElBQUksR0FBRyxNQUFNLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBRSxDQUFDLENBQUUsQ0FBQztJQUN4QyxJQUFNLElBQUksR0FBRyxNQUFNLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBRSxDQUFDLENBQUUsQ0FBQztJQUV4QyxFQUFFLENBQUMsS0FBSyxDQUFDLFlBQVksQ0FBQztRQUNsQixJQUFJLEVBQUU7WUFDRixJQUFJLE1BQUE7WUFDSixJQUFJLEVBQUUsTUFBTSxDQUFDLElBQUk7U0FDcEI7UUFDRCxJQUFJLE1BQUE7UUFDSixPQUFPLEVBQUUsVUFBRSxHQUFRO1lBQ1AsSUFBQSxtQkFBTSxDQUFTO1lBQ3ZCLElBQUssQ0FBQyxNQUFNLEVBQUc7Z0JBQUUsT0FBTyxRQUFRLEVBQUcsQ0FBQzthQUFDO1lBRTdCLElBQUEsc0JBQU0sRUFBRSxrQkFBSSxFQUFFLHdCQUFPLENBQVk7WUFDekMsSUFBSyxNQUFNLEtBQUssR0FBRyxFQUFHO2dCQUNsQixRQUFRLENBQUUsT0FBTyxJQUFJLE9BQU8sS0FBSyxFQUFHLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBRSxDQUFDO2FBQ3BFO1lBRUQsTUFBTSxDQUFDLE9BQU8sQ0FBRSxHQUFHLENBQUMsTUFBTSxDQUFFLENBQUM7UUFFakMsQ0FBQztRQUNELElBQUksRUFBRSxVQUFBLEdBQUc7WUFDTCxRQUFRLENBQUUsTUFBTSxFQUFFLEdBQUcsQ0FBRSxDQUFDO1lBQ3hCLE1BQU0sQ0FBQyxLQUFLLElBQUksTUFBTSxDQUFDLEtBQUssRUFBRyxDQUFBO1FBQ25DLENBQUM7UUFDRCxRQUFRLEVBQUU7WUFDTixFQUFFLENBQUMsV0FBVyxDQUFDLEVBQUcsQ0FBQyxDQUFDO1lBQ3BCLE1BQU0sQ0FBQyxRQUFRLElBQUksTUFBTSxDQUFDLFFBQVEsRUFBRyxDQUFBO1FBQ3pDLENBQUM7S0FDSixDQUFDLENBQUE7QUFFTixDQUFDLENBQUE7QUFHRyxvQkFBSSIsInNvdXJjZXNDb250ZW50IjpbImNvbnN0IGh0dHBQYXJhbSA9IHtcbiAgICB1cmw6ICcnLFxuICAgIGRhdGE6IHsgfSxcbiAgICBzdWNjZXNzOiAoIHJlcyApID0+IHsgfSxcbiAgICBsb2FkaW5nTXNnOiAn5Yqg6L295LitLi4uLicsXG4gICAgZXJyTXNnOiAn5Yqg6L296ZSZ6K+v77yM6K+36YeN6K+VJyxcbiAgICBjb21wbGV0ZTogKCApID0+IHsgfSxcbiAgICBlcnJvcjogKCApID0+IHsgfVxufTtcblxudHlwZSBodHRwUGFyYW0gPSBhbnk7XG5cbmNvbnN0IGh0dHAgPSAoIHBhcmFtcyQ6IGh0dHBQYXJhbSApID0+IHtcbiAgICBjb25zdCBwYXJhbXMgPSBPYmplY3QuYXNzaWduKHsgfSwgaHR0cFBhcmFtLCB7IC4uLnBhcmFtcyQgfSk7XG5cbiAgICB3eC5zaG93TG9hZGluZyh7XG4gICAgICAgIHRpdGxlOiBwYXJhbXMubG9hZGluZ01zZ1xuICAgIH0pO1xuXG4gICAgY29uc3QgZ2V0RXJyb3IgPSAoIG1zZyA9IHBhcmFtcy5lcnJNc2csIGVycj86IGFueSApID0+IHtcbiAgICAgICAgZXJyICYmIGNvbnNvbGUubG9nKCBlcnIgKTtcbiAgICAgICAgd3guc2hvd1RvYXN0KHtcbiAgICAgICAgICAgIGljb246ICdub25lJyxcbiAgICAgICAgICAgIHRpdGxlOiBtc2dcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgY29uc3QgbmFtZSA9IHBhcmFtcy51cmwuc3BsaXQoJ18nKVsgMCBdO1xuICAgIGNvbnN0ICR1cmwgPSBwYXJhbXMudXJsLnNwbGl0KCdfJylbIDEgXTtcblxuICAgIHd4LmNsb3VkLmNhbGxGdW5jdGlvbih7XG4gICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICR1cmwsXG4gICAgICAgICAgICBkYXRhOiBwYXJhbXMuZGF0YVxuICAgICAgICB9LFxuICAgICAgICBuYW1lLFxuICAgICAgICBzdWNjZXNzOiAoIHJlczogYW55ICkgPT4ge1xuICAgICAgICAgICAgY29uc3QgeyByZXN1bHQgfSA9IHJlcztcbiAgICAgICAgICAgIGlmICggIXJlc3VsdCApIHsgcmV0dXJuIGdldEVycm9yKCApO31cbiAgICAgICAgICAgIFxuICAgICAgICAgICAgY29uc3QgeyBzdGF0dXMsIGRhdGEsIG1lc3NhZ2UgfSA9IHJlc3VsdDtcbiAgICAgICAgICAgIGlmICggc3RhdHVzICE9PSAyMDAgKSB7XG4gICAgICAgICAgICAgICAgZ2V0RXJyb3IoIG1lc3NhZ2UgJiYgbWVzc2FnZSAhPT0geyB9ID8gbWVzc2FnZSA6IHBhcmFtcy5lcnJNc2cgKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcGFyYW1zLnN1Y2Nlc3MoIHJlcy5yZXN1bHQgKTtcblxuICAgICAgICB9LFxuICAgICAgICBmYWlsOiBlcnIgPT4ge1xuICAgICAgICAgICAgZ2V0RXJyb3IoICfnvZHnu5zplJnor68nLCBlcnIgKTtcbiAgICAgICAgICAgIHBhcmFtcy5lcnJvciAmJiBwYXJhbXMuZXJyb3IoIClcbiAgICAgICAgfSxcbiAgICAgICAgY29tcGxldGU6ICggKSA9PiB7XG4gICAgICAgICAgICB3eC5oaWRlTG9hZGluZyh7IH0pO1xuICAgICAgICAgICAgcGFyYW1zLmNvbXBsZXRlICYmIHBhcmFtcy5jb21wbGV0ZSggKVxuICAgICAgICB9XG4gICAgfSlcblxufVxuXG5leHBvcnQge1xuICAgIGh0dHBcbn07Il19