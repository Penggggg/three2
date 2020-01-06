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
        console.log('???????eeee', params.url);
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
            }
            params.success(res.result);
        },
        fail: function (err) {
            getError('网络错误', err);
            params.error && params.error();
            console.log("\u3010---- Request ERROR : " + params$.url + "\u3011", params$.data);
        },
        complete: function () {
            wx.hideLoading({});
            params.complete && params.complete();
        }
    });
};
exports.http = http;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaHR0cC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImh0dHAudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7OztBQUFBLElBQU0sU0FBUyxHQUFHO0lBQ2QsR0FBRyxFQUFFLEVBQUU7SUFDUCxJQUFJLEVBQUUsRUFBRztJQUNULE9BQU8sRUFBRSxVQUFFLEdBQUcsSUFBUSxDQUFDO0lBQ3ZCLFVBQVUsRUFBRSxTQUFTO0lBQ3JCLE1BQU0sRUFBRSxVQUFVO0lBQ2xCLFFBQVEsRUFBRSxjQUFTLENBQUM7SUFDcEIsS0FBSyxFQUFFLGNBQVMsQ0FBQztDQUNwQixDQUFDO0FBSUYsSUFBTSxJQUFJLEdBQUcsVUFBRSxPQUFrQjtJQUU3QixJQUFNLE1BQU0sR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDLEVBQUcsRUFBRSxTQUFTLGVBQU8sT0FBTyxFQUFHLENBQUM7SUFFN0QsTUFBTSxDQUFDLFVBQVUsS0FBSyxNQUFNLElBQUksRUFBRSxDQUFDLFdBQVcsQ0FBQztRQUMzQyxLQUFLLEVBQUUsTUFBTSxDQUFDLFVBQVU7S0FDM0IsQ0FBQyxDQUFDO0lBRUgsSUFBTSxRQUFRLEdBQUcsVUFBRSxHQUFtQixFQUFFLEdBQVM7UUFBOUIsb0JBQUEsRUFBQSxNQUFNLE1BQU0sQ0FBQyxNQUFNO1FBQ2xDLE9BQU8sQ0FBQyxHQUFHLENBQUMsYUFBYSxFQUFFLE1BQU0sQ0FBQyxHQUFHLENBQUUsQ0FBQztRQUN4QyxHQUFHLElBQUksT0FBTyxDQUFDLEdBQUcsQ0FBQyxTQUFTLEVBQUUsR0FBRyxJQUFJLEdBQUcsQ0FBRSxDQUFDO1FBQzNDLEVBQUUsQ0FBQyxTQUFTLENBQUM7WUFDVCxJQUFJLEVBQUUsTUFBTTtZQUNaLEtBQUssRUFBRSxHQUFHO1lBQ1YsUUFBUSxFQUFFLElBQUk7U0FDakIsQ0FBQyxDQUFDO0lBQ1AsQ0FBQyxDQUFBO0lBRUQsSUFBTSxJQUFJLEdBQUcsTUFBTSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUUsQ0FBQyxDQUFFLENBQUM7SUFDeEMsSUFBTSxJQUFJLEdBQUcsTUFBTSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUUsQ0FBQyxDQUFFLENBQUM7SUFFeEMsRUFBRSxDQUFDLEtBQUssQ0FBQyxZQUFZLENBQUM7UUFDbEIsSUFBSSxFQUFFO1lBQ0YsSUFBSSxNQUFBO1lBQ0osSUFBSSxFQUFFLE1BQU0sQ0FBQyxJQUFJO1NBQ3BCO1FBQ0QsSUFBSSxNQUFBO1FBQ0osT0FBTyxFQUFFLFVBQUUsR0FBUTtZQUNQLElBQUEsbUJBQU0sQ0FBUztZQUN2QixJQUFLLENBQUMsTUFBTSxFQUFHO2dCQUFFLE9BQU8sUUFBUSxFQUFHLENBQUM7YUFBQztZQUNyQyxPQUFPLENBQUMsR0FBRyxDQUFDLGtDQUEyQixPQUFPLENBQUMsR0FBRyxXQUFHLEVBQUUsT0FBTyxDQUFDLElBQUksRUFBRSxHQUFHLENBQUMsTUFBTSxDQUFFLENBQUM7WUFDMUUsSUFBQSxzQkFBTSxFQUFFLGtCQUFJLEVBQUUsd0JBQU8sQ0FBWTtZQUN6QyxJQUFLLE1BQU0sS0FBSyxHQUFHLEVBQUc7Z0JBQ2xCLFFBQVEsQ0FBRSxPQUFPLElBQUksT0FBTyxLQUFLLEVBQUcsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFFLENBQUM7YUFFcEU7aUJBQU07YUFFTjtZQUNELE1BQU0sQ0FBQyxPQUFPLENBQUUsR0FBRyxDQUFDLE1BQU0sQ0FBRSxDQUFDO1FBQ2pDLENBQUM7UUFDRCxJQUFJLEVBQUUsVUFBQSxHQUFHO1lBQ0wsUUFBUSxDQUFFLE1BQU0sRUFBRSxHQUFHLENBQUUsQ0FBQztZQUN4QixNQUFNLENBQUMsS0FBSyxJQUFJLE1BQU0sQ0FBQyxLQUFLLEVBQUcsQ0FBQztZQUNoQyxPQUFPLENBQUMsR0FBRyxDQUFDLGdDQUF5QixPQUFPLENBQUMsR0FBRyxXQUFHLEVBQUUsT0FBTyxDQUFDLElBQUksQ0FBRSxDQUFDO1FBQ3hFLENBQUM7UUFDRCxRQUFRLEVBQUU7WUFDTixFQUFFLENBQUMsV0FBVyxDQUFDLEVBQUcsQ0FBQyxDQUFDO1lBQ3BCLE1BQU0sQ0FBQyxRQUFRLElBQUksTUFBTSxDQUFDLFFBQVEsRUFBRyxDQUFBO1FBQ3pDLENBQUM7S0FDSixDQUFDLENBQUE7QUFFTixDQUFDLENBQUE7QUFHRyxvQkFBSSIsInNvdXJjZXNDb250ZW50IjpbImNvbnN0IGh0dHBQYXJhbSA9IHtcbiAgICB1cmw6ICcnLFxuICAgIGRhdGE6IHsgfSxcbiAgICBzdWNjZXNzOiAoIHJlcyApID0+IHsgfSxcbiAgICBsb2FkaW5nTXNnOiAn5Yqg6L295LitLi4uLicsXG4gICAgZXJyTXNnOiAn5Yqg6L296ZSZ6K+v77yM6K+36YeN6K+VJyxcbiAgICBjb21wbGV0ZTogKCApID0+IHsgfSxcbiAgICBlcnJvcjogKCApID0+IHsgfVxufTtcblxudHlwZSBodHRwUGFyYW0gPSBhbnk7XG5cbmNvbnN0IGh0dHAgPSAoIHBhcmFtcyQ6IGh0dHBQYXJhbSApID0+IHtcblxuICAgIGNvbnN0IHBhcmFtcyA9IE9iamVjdC5hc3NpZ24oeyB9LCBodHRwUGFyYW0sIHsgLi4ucGFyYW1zJCB9KTtcblxuICAgIHBhcmFtcy5sb2FkaW5nTXNnICE9PSAnbm9uZScgJiYgd3guc2hvd0xvYWRpbmcoe1xuICAgICAgICB0aXRsZTogcGFyYW1zLmxvYWRpbmdNc2dcbiAgICB9KTtcblxuICAgIGNvbnN0IGdldEVycm9yID0gKCBtc2cgPSBwYXJhbXMuZXJyTXNnLCBlcnI/OiBhbnkgKSA9PiB7XG4gICAgICAgIGNvbnNvbGUubG9nKCc/Pz8/Pz8/ZWVlZScsIHBhcmFtcy51cmwgKTtcbiAgICAgICAgZXJyICYmIGNvbnNvbGUubG9nKGBFcnJvcjogYCwgZXJyIHx8IG1zZyApO1xuICAgICAgICB3eC5zaG93VG9hc3Qoe1xuICAgICAgICAgICAgaWNvbjogJ25vbmUnLFxuICAgICAgICAgICAgdGl0bGU6IG1zZyxcbiAgICAgICAgICAgIGR1cmF0aW9uOiAyMDAwXG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIGNvbnN0IG5hbWUgPSBwYXJhbXMudXJsLnNwbGl0KCdfJylbIDAgXTtcbiAgICBjb25zdCAkdXJsID0gcGFyYW1zLnVybC5zcGxpdCgnXycpWyAxIF07XG5cbiAgICB3eC5jbG91ZC5jYWxsRnVuY3Rpb24oe1xuICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAkdXJsLFxuICAgICAgICAgICAgZGF0YTogcGFyYW1zLmRhdGFcbiAgICAgICAgfSxcbiAgICAgICAgbmFtZSxcbiAgICAgICAgc3VjY2VzczogKCByZXM6IGFueSApID0+IHtcbiAgICAgICAgICAgIGNvbnN0IHsgcmVzdWx0IH0gPSByZXM7XG4gICAgICAgICAgICBpZiAoICFyZXN1bHQgKSB7IHJldHVybiBnZXRFcnJvciggKTt9XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhg44CQLS0tLSBSZXF1ZXN0IFN1Y2Nlc3MgOiAke3BhcmFtcyQudXJsfeOAkWAsIHBhcmFtcyQuZGF0YSwgcmVzLnJlc3VsdCApO1xuICAgICAgICAgICAgY29uc3QgeyBzdGF0dXMsIGRhdGEsIG1lc3NhZ2UgfSA9IHJlc3VsdDtcbiAgICAgICAgICAgIGlmICggc3RhdHVzICE9PSAyMDAgKSB7XG4gICAgICAgICAgICAgICAgZ2V0RXJyb3IoIG1lc3NhZ2UgJiYgbWVzc2FnZSAhPT0geyB9ID8gbWVzc2FnZSA6IHBhcmFtcy5lcnJNc2cgKTtcblxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAvLyB3eC5oaWRlTG9hZGluZyh7IH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcGFyYW1zLnN1Y2Nlc3MoIHJlcy5yZXN1bHQgKTtcbiAgICAgICAgfSxcbiAgICAgICAgZmFpbDogZXJyID0+IHtcbiAgICAgICAgICAgIGdldEVycm9yKCAn572R57uc6ZSZ6K+vJywgZXJyICk7XG4gICAgICAgICAgICBwYXJhbXMuZXJyb3IgJiYgcGFyYW1zLmVycm9yKCApO1xuICAgICAgICAgICAgY29uc29sZS5sb2coYOOAkC0tLS0gUmVxdWVzdCBFUlJPUiA6ICR7cGFyYW1zJC51cmx944CRYCwgcGFyYW1zJC5kYXRhICk7XG4gICAgICAgIH0sXG4gICAgICAgIGNvbXBsZXRlOiAoICkgPT4ge1xuICAgICAgICAgICAgd3guaGlkZUxvYWRpbmcoeyB9KTtcbiAgICAgICAgICAgIHBhcmFtcy5jb21wbGV0ZSAmJiBwYXJhbXMuY29tcGxldGUoIClcbiAgICAgICAgfVxuICAgIH0pXG5cbn1cblxuZXhwb3J0IHtcbiAgICBodHRwXG59OyJdfQ==