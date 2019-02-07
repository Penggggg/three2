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
    console.log('【---- Http Requert ----】', params$.url);
    var params = Object.assign({}, httpParam, __assign({}, params$));
    params.loadingMsg !== 'none' && wx.showLoading({
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaHR0cC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImh0dHAudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7OztBQUFBLElBQU0sU0FBUyxHQUFHO0lBQ2QsR0FBRyxFQUFFLEVBQUU7SUFDUCxJQUFJLEVBQUUsRUFBRztJQUNULE9BQU8sRUFBRSxVQUFFLEdBQUcsSUFBUSxDQUFDO0lBQ3ZCLFVBQVUsRUFBRSxTQUFTO0lBQ3JCLE1BQU0sRUFBRSxVQUFVO0lBQ2xCLFFBQVEsRUFBRSxjQUFTLENBQUM7SUFDcEIsS0FBSyxFQUFFLGNBQVMsQ0FBQztDQUNwQixDQUFDO0FBSUYsSUFBTSxJQUFJLEdBQUcsVUFBRSxPQUFrQjtJQUU3QixPQUFPLENBQUMsR0FBRyxDQUFDLDBCQUEwQixFQUFFLE9BQU8sQ0FBQyxHQUFHLENBQUUsQ0FBQztJQUV0RCxJQUFNLE1BQU0sR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDLEVBQUcsRUFBRSxTQUFTLGVBQU8sT0FBTyxFQUFHLENBQUM7SUFFN0QsTUFBTSxDQUFDLFVBQVUsS0FBSyxNQUFNLElBQUksRUFBRSxDQUFDLFdBQVcsQ0FBQztRQUMzQyxLQUFLLEVBQUUsTUFBTSxDQUFDLFVBQVU7S0FDM0IsQ0FBQyxDQUFDO0lBRUgsSUFBTSxRQUFRLEdBQUcsVUFBRSxHQUFtQixFQUFFLEdBQVM7UUFBOUIsb0JBQUEsRUFBQSxNQUFNLE1BQU0sQ0FBQyxNQUFNO1FBQ2xDLEdBQUcsSUFBSSxPQUFPLENBQUMsR0FBRyxDQUFDLFNBQVMsRUFBRSxHQUFHLElBQUksR0FBRyxDQUFFLENBQUM7UUFDM0MsRUFBRSxDQUFDLFNBQVMsQ0FBQztZQUNULElBQUksRUFBRSxNQUFNO1lBQ1osS0FBSyxFQUFFLEdBQUc7WUFDVixRQUFRLEVBQUUsSUFBSTtTQUNqQixDQUFDLENBQUM7SUFDUCxDQUFDLENBQUE7SUFFRCxJQUFNLElBQUksR0FBRyxNQUFNLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBRSxDQUFDLENBQUUsQ0FBQztJQUN4QyxJQUFNLElBQUksR0FBRyxNQUFNLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBRSxDQUFDLENBQUUsQ0FBQztJQUV4QyxFQUFFLENBQUMsS0FBSyxDQUFDLFlBQVksQ0FBQztRQUNsQixJQUFJLEVBQUU7WUFDRixJQUFJLE1BQUE7WUFDSixJQUFJLEVBQUUsTUFBTSxDQUFDLElBQUk7U0FDcEI7UUFDRCxJQUFJLE1BQUE7UUFDSixPQUFPLEVBQUUsVUFBRSxHQUFRO1lBQ1AsSUFBQSxtQkFBTSxDQUFTO1lBQ3ZCLElBQUssQ0FBQyxNQUFNLEVBQUc7Z0JBQUUsT0FBTyxRQUFRLEVBQUcsQ0FBQzthQUFDO1lBRTdCLElBQUEsc0JBQU0sRUFBRSxrQkFBSSxFQUFFLHdCQUFPLENBQVk7WUFDekMsSUFBSyxNQUFNLEtBQUssR0FBRyxFQUFHO2dCQUNsQixRQUFRLENBQUUsT0FBTyxJQUFJLE9BQU8sS0FBSyxFQUFHLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBRSxDQUFDO2FBRXBFO2lCQUFNO2dCQUNILEVBQUUsQ0FBQyxXQUFXLENBQUMsRUFBRyxDQUFDLENBQUM7YUFDdkI7WUFDRCxNQUFNLENBQUMsT0FBTyxDQUFFLEdBQUcsQ0FBQyxNQUFNLENBQUUsQ0FBQztRQUNqQyxDQUFDO1FBQ0QsSUFBSSxFQUFFLFVBQUEsR0FBRztZQUNMLFFBQVEsQ0FBRSxNQUFNLEVBQUUsR0FBRyxDQUFFLENBQUM7WUFDeEIsTUFBTSxDQUFDLEtBQUssSUFBSSxNQUFNLENBQUMsS0FBSyxFQUFHLENBQUE7UUFDbkMsQ0FBQztRQUNELFFBQVEsRUFBRTtZQUVOLE1BQU0sQ0FBQyxRQUFRLElBQUksTUFBTSxDQUFDLFFBQVEsRUFBRyxDQUFBO1FBQ3pDLENBQUM7S0FDSixDQUFDLENBQUE7QUFFTixDQUFDLENBQUE7QUFHRyxvQkFBSSIsInNvdXJjZXNDb250ZW50IjpbImNvbnN0IGh0dHBQYXJhbSA9IHtcbiAgICB1cmw6ICcnLFxuICAgIGRhdGE6IHsgfSxcbiAgICBzdWNjZXNzOiAoIHJlcyApID0+IHsgfSxcbiAgICBsb2FkaW5nTXNnOiAn5Yqg6L295LitLi4uLicsXG4gICAgZXJyTXNnOiAn5Yqg6L296ZSZ6K+v77yM6K+36YeN6K+VJyxcbiAgICBjb21wbGV0ZTogKCApID0+IHsgfSxcbiAgICBlcnJvcjogKCApID0+IHsgfVxufTtcblxudHlwZSBodHRwUGFyYW0gPSBhbnk7XG5cbmNvbnN0IGh0dHAgPSAoIHBhcmFtcyQ6IGh0dHBQYXJhbSApID0+IHtcblxuICAgIGNvbnNvbGUubG9nKCfjgJAtLS0tIEh0dHAgUmVxdWVydCAtLS0t44CRJywgcGFyYW1zJC51cmwgKTtcblxuICAgIGNvbnN0IHBhcmFtcyA9IE9iamVjdC5hc3NpZ24oeyB9LCBodHRwUGFyYW0sIHsgLi4ucGFyYW1zJCB9KTtcblxuICAgIHBhcmFtcy5sb2FkaW5nTXNnICE9PSAnbm9uZScgJiYgd3guc2hvd0xvYWRpbmcoe1xuICAgICAgICB0aXRsZTogcGFyYW1zLmxvYWRpbmdNc2dcbiAgICB9KTtcblxuICAgIGNvbnN0IGdldEVycm9yID0gKCBtc2cgPSBwYXJhbXMuZXJyTXNnLCBlcnI/OiBhbnkgKSA9PiB7XG4gICAgICAgIGVyciAmJiBjb25zb2xlLmxvZyhgRXJyb3I6IGAsIGVyciB8fCBtc2cgKTtcbiAgICAgICAgd3guc2hvd1RvYXN0KHtcbiAgICAgICAgICAgIGljb246ICdub25lJyxcbiAgICAgICAgICAgIHRpdGxlOiBtc2csXG4gICAgICAgICAgICBkdXJhdGlvbjogMjAwMFxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBjb25zdCBuYW1lID0gcGFyYW1zLnVybC5zcGxpdCgnXycpWyAwIF07XG4gICAgY29uc3QgJHVybCA9IHBhcmFtcy51cmwuc3BsaXQoJ18nKVsgMSBdO1xuXG4gICAgd3guY2xvdWQuY2FsbEZ1bmN0aW9uKHtcbiAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgJHVybCxcbiAgICAgICAgICAgIGRhdGE6IHBhcmFtcy5kYXRhXG4gICAgICAgIH0sXG4gICAgICAgIG5hbWUsXG4gICAgICAgIHN1Y2Nlc3M6ICggcmVzOiBhbnkgKSA9PiB7XG4gICAgICAgICAgICBjb25zdCB7IHJlc3VsdCB9ID0gcmVzO1xuICAgICAgICAgICAgaWYgKCAhcmVzdWx0ICkgeyByZXR1cm4gZ2V0RXJyb3IoICk7fVxuICAgICAgICAgICAgXG4gICAgICAgICAgICBjb25zdCB7IHN0YXR1cywgZGF0YSwgbWVzc2FnZSB9ID0gcmVzdWx0O1xuICAgICAgICAgICAgaWYgKCBzdGF0dXMgIT09IDIwMCApIHtcbiAgICAgICAgICAgICAgICBnZXRFcnJvciggbWVzc2FnZSAmJiBtZXNzYWdlICE9PSB7IH0gPyBtZXNzYWdlIDogcGFyYW1zLmVyck1zZyApO1xuXG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHd4LmhpZGVMb2FkaW5nKHsgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBwYXJhbXMuc3VjY2VzcyggcmVzLnJlc3VsdCApO1xuICAgICAgICB9LFxuICAgICAgICBmYWlsOiBlcnIgPT4ge1xuICAgICAgICAgICAgZ2V0RXJyb3IoICfnvZHnu5zplJnor68nLCBlcnIgKTtcbiAgICAgICAgICAgIHBhcmFtcy5lcnJvciAmJiBwYXJhbXMuZXJyb3IoIClcbiAgICAgICAgfSxcbiAgICAgICAgY29tcGxldGU6ICggKSA9PiB7XG4gICAgICAgICAgICAvLyB3eC5oaWRlTG9hZGluZyh7IH0pO1xuICAgICAgICAgICAgcGFyYW1zLmNvbXBsZXRlICYmIHBhcmFtcy5jb21wbGV0ZSggKVxuICAgICAgICB9XG4gICAgfSlcblxufVxuXG5leHBvcnQge1xuICAgIGh0dHBcbn07Il19