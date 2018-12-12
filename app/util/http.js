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
        data: params.data,
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaHR0cC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImh0dHAudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7OztBQUFBLElBQU0sU0FBUyxHQUFHO0lBQ2QsR0FBRyxFQUFFLEVBQUU7SUFDUCxJQUFJLEVBQUUsRUFBRztJQUNULE9BQU8sRUFBRSxVQUFFLEdBQUcsSUFBUSxDQUFDO0lBQ3ZCLFVBQVUsRUFBRSxTQUFTO0lBQ3JCLE1BQU0sRUFBRSxVQUFVO0NBQ3JCLENBQUM7QUFJRixJQUFNLElBQUksR0FBRyxVQUFFLE9BQWtCO0lBQzdCLElBQU0sTUFBTSxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUMsRUFBRyxFQUFFLFNBQVMsZUFBTyxPQUFPLEVBQUcsQ0FBQztJQUU3RCxFQUFFLENBQUMsV0FBVyxDQUFDO1FBQ1gsS0FBSyxFQUFFLE1BQU0sQ0FBQyxVQUFVO0tBQzNCLENBQUMsQ0FBQztJQUVILElBQU0sUUFBUSxHQUFHLFVBQUUsR0FBbUIsRUFBRyxHQUFTO1FBQS9CLG9CQUFBLEVBQUEsTUFBTSxNQUFNLENBQUMsTUFBTTtRQUNsQyxPQUFPLENBQUMsR0FBRyxDQUFFLEdBQUcsQ0FBRSxDQUFDO1FBQ25CLEVBQUUsQ0FBQyxTQUFTLENBQUM7WUFDVCxJQUFJLEVBQUUsTUFBTTtZQUNaLEtBQUssRUFBRSxHQUFHO1NBQ2IsQ0FBQyxDQUFDO0lBQ1AsQ0FBQyxDQUFBO0lBRUQsRUFBRSxDQUFDLEtBQUssQ0FBQyxZQUFZLENBQUM7UUFDbEIsSUFBSSxFQUFFLE1BQU0sQ0FBQyxJQUFJO1FBQ2pCLElBQUksRUFBRSxNQUFNLENBQUMsR0FBRztRQUNoQixPQUFPLEVBQUUsVUFBRSxHQUFRO1lBQ1AsSUFBQSxtQkFBTSxDQUFTO1lBQ3ZCLElBQUssQ0FBQyxNQUFNLEVBQUc7Z0JBQUUsT0FBTyxRQUFRLEVBQUcsQ0FBQzthQUFDO1lBQzdCLElBQUEsc0JBQU0sRUFBRSxrQkFBSSxFQUFFLHdCQUFPLENBQVk7WUFDekMsSUFBSyxNQUFNLEtBQUssR0FBRyxFQUFHO2dCQUNsQixPQUFPLFFBQVEsQ0FBRSxPQUFPLElBQUksSUFBSSxDQUFFLENBQUM7YUFDdEM7WUFFRCxNQUFNLENBQUMsT0FBTyxDQUFFLEdBQUcsQ0FBRSxDQUFDO1FBRTFCLENBQUM7UUFDRCxJQUFJLEVBQUUsVUFBQSxHQUFHLElBQUksT0FBQSxRQUFRLENBQUUsTUFBTSxFQUFFLEdBQUcsQ0FBRSxFQUF2QixDQUF1QjtRQUNwQyxRQUFRLEVBQUUsY0FBTyxPQUFBLEVBQUUsQ0FBQyxXQUFXLENBQUMsRUFBRyxDQUFDLEVBQW5CLENBQW1CO0tBQ3ZDLENBQUMsQ0FBQTtBQUVOLENBQUMsQ0FBQTtBQUdHLG9CQUFJIiwic291cmNlc0NvbnRlbnQiOlsiY29uc3QgaHR0cFBhcmFtID0ge1xuICAgIHVybDogJycsXG4gICAgZGF0YTogeyB9LFxuICAgIHN1Y2Nlc3M6ICggcmVzICkgPT4geyB9LFxuICAgIGxvYWRpbmdNc2c6ICfliqDovb3kuK0uLi4uJyxcbiAgICBlcnJNc2c6ICfliqDovb3plJnor6/vvIzor7fph43or5UnXG59O1xuXG50eXBlIGh0dHBQYXJhbSA9IGFueTtcblxuY29uc3QgaHR0cCA9ICggcGFyYW1zJDogaHR0cFBhcmFtICkgPT4ge1xuICAgIGNvbnN0IHBhcmFtcyA9IE9iamVjdC5hc3NpZ24oeyB9LCBodHRwUGFyYW0sIHsgLi4ucGFyYW1zJCB9KTtcblxuICAgIHd4LnNob3dMb2FkaW5nKHtcbiAgICAgICAgdGl0bGU6IHBhcmFtcy5sb2FkaW5nTXNnXG4gICAgfSk7XG5cbiAgICBjb25zdCBnZXRFcnJvciA9ICggbXNnID0gcGFyYW1zLmVyck1zZyAsIGVycj86IGFueSApID0+IHtcbiAgICAgICAgY29uc29sZS5sb2coIGVyciApO1xuICAgICAgICB3eC5zaG93VG9hc3Qoe1xuICAgICAgICAgICAgaWNvbjogJ25vbmUnLFxuICAgICAgICAgICAgdGl0bGU6IG1zZ1xuICAgICAgICB9KTtcbiAgICB9XG4gICAgXG4gICAgd3guY2xvdWQuY2FsbEZ1bmN0aW9uKHtcbiAgICAgICAgZGF0YTogcGFyYW1zLmRhdGEsXG4gICAgICAgIG5hbWU6IHBhcmFtcy51cmwsXG4gICAgICAgIHN1Y2Nlc3M6ICggcmVzOiBhbnkgKSA9PiB7XG4gICAgICAgICAgICBjb25zdCB7IHJlc3VsdCB9ID0gcmVzO1xuICAgICAgICAgICAgaWYgKCAhcmVzdWx0ICkgeyByZXR1cm4gZ2V0RXJyb3IoICk7fVxuICAgICAgICAgICAgY29uc3QgeyBzdGF0dXMsIGRhdGEsIG1lc3NhZ2UgfSA9IHJlc3VsdDtcbiAgICAgICAgICAgIGlmICggc3RhdHVzICE9PSAyMDAgKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGdldEVycm9yKCBtZXNzYWdlIHx8IG51bGwgKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcGFyYW1zLnN1Y2Nlc3MoIHJlcyApO1xuXG4gICAgICAgIH0sXG4gICAgICAgIGZhaWw6IGVyciA9PiBnZXRFcnJvciggJ251bGwnLCBlcnIgKSxcbiAgICAgICAgY29tcGxldGU6ICggKSA9PiB3eC5oaWRlTG9hZGluZyh7IH0pXG4gICAgfSlcblxufVxuXG5leHBvcnQge1xuICAgIGh0dHBcbn07Il19