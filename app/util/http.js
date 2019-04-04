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
    params.loadingMsg !== 'none' && wx.showLoading({
        title: params.loadingMsg
    });
    var getError = function (msg, err) {
        if (msg === void 0) { msg = params.errMsg; }
        console.log('???????eeee');
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
            console.log("\u3010---- Request Success : " + params$.url + "\u3011", params$.data, res.result);
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
            console.log("\u3010---- Request ERROR : " + params$.url + "\u3011");
        },
        complete: function () {
            params.complete && params.complete();
        }
    });
};
exports.http = http;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaHR0cC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImh0dHAudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7OztBQUFBLElBQU0sU0FBUyxHQUFHO0lBQ2QsR0FBRyxFQUFFLEVBQUU7SUFDUCxJQUFJLEVBQUUsRUFBRztJQUNULE9BQU8sRUFBRSxVQUFFLEdBQUcsSUFBUSxDQUFDO0lBQ3ZCLFVBQVUsRUFBRSxTQUFTO0lBQ3JCLE1BQU0sRUFBRSxVQUFVO0lBQ2xCLFFBQVEsRUFBRSxjQUFTLENBQUM7SUFDcEIsS0FBSyxFQUFFLGNBQVMsQ0FBQztDQUNwQixDQUFDO0FBSUYsSUFBTSxJQUFJLEdBQUcsVUFBRSxPQUFrQjtJQUU3QixJQUFNLE1BQU0sR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDLEVBQUcsRUFBRSxTQUFTLGVBQU8sT0FBTyxFQUFHLENBQUM7SUFFN0QsTUFBTSxDQUFDLFVBQVUsS0FBSyxNQUFNLElBQUksRUFBRSxDQUFDLFdBQVcsQ0FBQztRQUMzQyxLQUFLLEVBQUUsTUFBTSxDQUFDLFVBQVU7S0FDM0IsQ0FBQyxDQUFDO0lBRUgsSUFBTSxRQUFRLEdBQUcsVUFBRSxHQUFtQixFQUFFLEdBQVM7UUFBOUIsb0JBQUEsRUFBQSxNQUFNLE1BQU0sQ0FBQyxNQUFNO1FBQ2xDLE9BQU8sQ0FBQyxHQUFHLENBQUMsYUFBYSxDQUFDLENBQUE7UUFDMUIsR0FBRyxJQUFJLE9BQU8sQ0FBQyxHQUFHLENBQUMsU0FBUyxFQUFFLEdBQUcsSUFBSSxHQUFHLENBQUUsQ0FBQztRQUMzQyxFQUFFLENBQUMsU0FBUyxDQUFDO1lBQ1QsSUFBSSxFQUFFLE1BQU07WUFDWixLQUFLLEVBQUUsR0FBRztZQUNWLFFBQVEsRUFBRSxJQUFJO1NBQ2pCLENBQUMsQ0FBQztJQUNQLENBQUMsQ0FBQTtJQUVELElBQU0sSUFBSSxHQUFHLE1BQU0sQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFFLENBQUMsQ0FBRSxDQUFDO0lBQ3hDLElBQU0sSUFBSSxHQUFHLE1BQU0sQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFFLENBQUMsQ0FBRSxDQUFDO0lBRXhDLEVBQUUsQ0FBQyxLQUFLLENBQUMsWUFBWSxDQUFDO1FBQ2xCLElBQUksRUFBRTtZQUNGLElBQUksTUFBQTtZQUNKLElBQUksRUFBRSxNQUFNLENBQUMsSUFBSTtTQUNwQjtRQUNELElBQUksTUFBQTtRQUNKLE9BQU8sRUFBRSxVQUFFLEdBQVE7WUFDUCxJQUFBLG1CQUFNLENBQVM7WUFDdkIsSUFBSyxDQUFDLE1BQU0sRUFBRztnQkFBRSxPQUFPLFFBQVEsRUFBRyxDQUFDO2FBQUM7WUFDckMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxrQ0FBMkIsT0FBTyxDQUFDLEdBQUcsV0FBRyxFQUFFLE9BQU8sQ0FBQyxJQUFJLEVBQUUsR0FBRyxDQUFDLE1BQU0sQ0FBRSxDQUFDO1lBQzFFLElBQUEsc0JBQU0sRUFBRSxrQkFBSSxFQUFFLHdCQUFPLENBQVk7WUFDekMsSUFBSyxNQUFNLEtBQUssR0FBRyxFQUFHO2dCQUNsQixRQUFRLENBQUUsT0FBTyxJQUFJLE9BQU8sS0FBSyxFQUFHLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBRSxDQUFDO2FBRXBFO2lCQUFNO2dCQUNILEVBQUUsQ0FBQyxXQUFXLENBQUMsRUFBRyxDQUFDLENBQUM7YUFDdkI7WUFDRCxNQUFNLENBQUMsT0FBTyxDQUFFLEdBQUcsQ0FBQyxNQUFNLENBQUUsQ0FBQztRQUNqQyxDQUFDO1FBQ0QsSUFBSSxFQUFFLFVBQUEsR0FBRztZQUNMLFFBQVEsQ0FBRSxNQUFNLEVBQUUsR0FBRyxDQUFFLENBQUM7WUFDeEIsTUFBTSxDQUFDLEtBQUssSUFBSSxNQUFNLENBQUMsS0FBSyxFQUFHLENBQUM7WUFDaEMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxnQ0FBeUIsT0FBTyxDQUFDLEdBQUcsV0FBRyxDQUFDLENBQUM7UUFDekQsQ0FBQztRQUNELFFBQVEsRUFBRTtZQUVOLE1BQU0sQ0FBQyxRQUFRLElBQUksTUFBTSxDQUFDLFFBQVEsRUFBRyxDQUFBO1FBQ3pDLENBQUM7S0FDSixDQUFDLENBQUE7QUFFTixDQUFDLENBQUE7QUFHRyxvQkFBSSIsInNvdXJjZXNDb250ZW50IjpbImNvbnN0IGh0dHBQYXJhbSA9IHtcbiAgICB1cmw6ICcnLFxuICAgIGRhdGE6IHsgfSxcbiAgICBzdWNjZXNzOiAoIHJlcyApID0+IHsgfSxcbiAgICBsb2FkaW5nTXNnOiAn5Yqg6L295LitLi4uLicsXG4gICAgZXJyTXNnOiAn5Yqg6L296ZSZ6K+v77yM6K+36YeN6K+VJyxcbiAgICBjb21wbGV0ZTogKCApID0+IHsgfSxcbiAgICBlcnJvcjogKCApID0+IHsgfVxufTtcblxudHlwZSBodHRwUGFyYW0gPSBhbnk7XG5cbmNvbnN0IGh0dHAgPSAoIHBhcmFtcyQ6IGh0dHBQYXJhbSApID0+IHtcblxuICAgIGNvbnN0IHBhcmFtcyA9IE9iamVjdC5hc3NpZ24oeyB9LCBodHRwUGFyYW0sIHsgLi4ucGFyYW1zJCB9KTtcblxuICAgIHBhcmFtcy5sb2FkaW5nTXNnICE9PSAnbm9uZScgJiYgd3guc2hvd0xvYWRpbmcoe1xuICAgICAgICB0aXRsZTogcGFyYW1zLmxvYWRpbmdNc2dcbiAgICB9KTtcblxuICAgIGNvbnN0IGdldEVycm9yID0gKCBtc2cgPSBwYXJhbXMuZXJyTXNnLCBlcnI/OiBhbnkgKSA9PiB7XG4gICAgICAgIGNvbnNvbGUubG9nKCc/Pz8/Pz8/ZWVlZScpXG4gICAgICAgIGVyciAmJiBjb25zb2xlLmxvZyhgRXJyb3I6IGAsIGVyciB8fCBtc2cgKTtcbiAgICAgICAgd3guc2hvd1RvYXN0KHtcbiAgICAgICAgICAgIGljb246ICdub25lJyxcbiAgICAgICAgICAgIHRpdGxlOiBtc2csXG4gICAgICAgICAgICBkdXJhdGlvbjogMjAwMFxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBjb25zdCBuYW1lID0gcGFyYW1zLnVybC5zcGxpdCgnXycpWyAwIF07XG4gICAgY29uc3QgJHVybCA9IHBhcmFtcy51cmwuc3BsaXQoJ18nKVsgMSBdO1xuXG4gICAgd3guY2xvdWQuY2FsbEZ1bmN0aW9uKHtcbiAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgJHVybCxcbiAgICAgICAgICAgIGRhdGE6IHBhcmFtcy5kYXRhXG4gICAgICAgIH0sXG4gICAgICAgIG5hbWUsXG4gICAgICAgIHN1Y2Nlc3M6ICggcmVzOiBhbnkgKSA9PiB7XG4gICAgICAgICAgICBjb25zdCB7IHJlc3VsdCB9ID0gcmVzO1xuICAgICAgICAgICAgaWYgKCAhcmVzdWx0ICkgeyByZXR1cm4gZ2V0RXJyb3IoICk7fVxuICAgICAgICAgICAgY29uc29sZS5sb2coYOOAkC0tLS0gUmVxdWVzdCBTdWNjZXNzIDogJHtwYXJhbXMkLnVybH3jgJFgLCBwYXJhbXMkLmRhdGEsIHJlcy5yZXN1bHQgKTtcbiAgICAgICAgICAgIGNvbnN0IHsgc3RhdHVzLCBkYXRhLCBtZXNzYWdlIH0gPSByZXN1bHQ7XG4gICAgICAgICAgICBpZiAoIHN0YXR1cyAhPT0gMjAwICkge1xuICAgICAgICAgICAgICAgIGdldEVycm9yKCBtZXNzYWdlICYmIG1lc3NhZ2UgIT09IHsgfSA/IG1lc3NhZ2UgOiBwYXJhbXMuZXJyTXNnICk7XG5cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgd3guaGlkZUxvYWRpbmcoeyB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHBhcmFtcy5zdWNjZXNzKCByZXMucmVzdWx0ICk7XG4gICAgICAgIH0sXG4gICAgICAgIGZhaWw6IGVyciA9PiB7XG4gICAgICAgICAgICBnZXRFcnJvciggJ+e9kee7nOmUmeivrycsIGVyciApO1xuICAgICAgICAgICAgcGFyYW1zLmVycm9yICYmIHBhcmFtcy5lcnJvciggKTtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGDjgJAtLS0tIFJlcXVlc3QgRVJST1IgOiAke3BhcmFtcyQudXJsfeOAkWApO1xuICAgICAgICB9LFxuICAgICAgICBjb21wbGV0ZTogKCApID0+IHtcbiAgICAgICAgICAgIC8vIHd4LmhpZGVMb2FkaW5nKHsgfSk7XG4gICAgICAgICAgICBwYXJhbXMuY29tcGxldGUgJiYgcGFyYW1zLmNvbXBsZXRlKCApXG4gICAgICAgIH1cbiAgICB9KVxuXG59XG5cbmV4cG9ydCB7XG4gICAgaHR0cFxufTsiXX0=