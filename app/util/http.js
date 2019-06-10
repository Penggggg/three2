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
                wx.hideLoading({});
            }
            params.success(res.result);
        },
        fail: function (err) {
            getError('网络错误', err);
            params.error && params.error();
            console.log("\u3010---- Request ERROR : " + params$.url + "\u3011", params$.data);
        },
        complete: function () {
            params.complete && params.complete();
        }
    });
};
exports.http = http;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaHR0cC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImh0dHAudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7OztBQUFBLElBQU0sU0FBUyxHQUFHO0lBQ2QsR0FBRyxFQUFFLEVBQUU7SUFDUCxJQUFJLEVBQUUsRUFBRztJQUNULE9BQU8sRUFBRSxVQUFFLEdBQUcsSUFBUSxDQUFDO0lBQ3ZCLFVBQVUsRUFBRSxTQUFTO0lBQ3JCLE1BQU0sRUFBRSxVQUFVO0lBQ2xCLFFBQVEsRUFBRSxjQUFTLENBQUM7SUFDcEIsS0FBSyxFQUFFLGNBQVMsQ0FBQztDQUNwQixDQUFDO0FBSUYsSUFBTSxJQUFJLEdBQUcsVUFBRSxPQUFrQjtJQUU3QixJQUFNLE1BQU0sR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDLEVBQUcsRUFBRSxTQUFTLGVBQU8sT0FBTyxFQUFHLENBQUM7SUFFN0QsTUFBTSxDQUFDLFVBQVUsS0FBSyxNQUFNLElBQUksRUFBRSxDQUFDLFdBQVcsQ0FBQztRQUMzQyxLQUFLLEVBQUUsTUFBTSxDQUFDLFVBQVU7S0FDM0IsQ0FBQyxDQUFDO0lBRUgsSUFBTSxRQUFRLEdBQUcsVUFBRSxHQUFtQixFQUFFLEdBQVM7UUFBOUIsb0JBQUEsRUFBQSxNQUFNLE1BQU0sQ0FBQyxNQUFNO1FBQ2xDLE9BQU8sQ0FBQyxHQUFHLENBQUMsYUFBYSxFQUFFLE1BQU0sQ0FBQyxHQUFHLENBQUUsQ0FBQztRQUN4QyxHQUFHLElBQUksT0FBTyxDQUFDLEdBQUcsQ0FBQyxTQUFTLEVBQUUsR0FBRyxJQUFJLEdBQUcsQ0FBRSxDQUFDO1FBQzNDLEVBQUUsQ0FBQyxTQUFTLENBQUM7WUFDVCxJQUFJLEVBQUUsTUFBTTtZQUNaLEtBQUssRUFBRSxHQUFHO1lBQ1YsUUFBUSxFQUFFLElBQUk7U0FDakIsQ0FBQyxDQUFDO0lBQ1AsQ0FBQyxDQUFBO0lBRUQsSUFBTSxJQUFJLEdBQUcsTUFBTSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUUsQ0FBQyxDQUFFLENBQUM7SUFDeEMsSUFBTSxJQUFJLEdBQUcsTUFBTSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUUsQ0FBQyxDQUFFLENBQUM7SUFFeEMsRUFBRSxDQUFDLEtBQUssQ0FBQyxZQUFZLENBQUM7UUFDbEIsSUFBSSxFQUFFO1lBQ0YsSUFBSSxNQUFBO1lBQ0osSUFBSSxFQUFFLE1BQU0sQ0FBQyxJQUFJO1NBQ3BCO1FBQ0QsSUFBSSxNQUFBO1FBQ0osT0FBTyxFQUFFLFVBQUUsR0FBUTtZQUNQLElBQUEsbUJBQU0sQ0FBUztZQUN2QixJQUFLLENBQUMsTUFBTSxFQUFHO2dCQUFFLE9BQU8sUUFBUSxFQUFHLENBQUM7YUFBQztZQUNyQyxPQUFPLENBQUMsR0FBRyxDQUFDLGtDQUEyQixPQUFPLENBQUMsR0FBRyxXQUFHLEVBQUUsT0FBTyxDQUFDLElBQUksRUFBRSxHQUFHLENBQUMsTUFBTSxDQUFFLENBQUM7WUFDMUUsSUFBQSxzQkFBTSxFQUFFLGtCQUFJLEVBQUUsd0JBQU8sQ0FBWTtZQUN6QyxJQUFLLE1BQU0sS0FBSyxHQUFHLEVBQUc7Z0JBQ2xCLFFBQVEsQ0FBRSxPQUFPLElBQUksT0FBTyxLQUFLLEVBQUcsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFFLENBQUM7YUFFcEU7aUJBQU07Z0JBQ0gsRUFBRSxDQUFDLFdBQVcsQ0FBQyxFQUFHLENBQUMsQ0FBQzthQUN2QjtZQUNELE1BQU0sQ0FBQyxPQUFPLENBQUUsR0FBRyxDQUFDLE1BQU0sQ0FBRSxDQUFDO1FBQ2pDLENBQUM7UUFDRCxJQUFJLEVBQUUsVUFBQSxHQUFHO1lBQ0wsUUFBUSxDQUFFLE1BQU0sRUFBRSxHQUFHLENBQUUsQ0FBQztZQUN4QixNQUFNLENBQUMsS0FBSyxJQUFJLE1BQU0sQ0FBQyxLQUFLLEVBQUcsQ0FBQztZQUNoQyxPQUFPLENBQUMsR0FBRyxDQUFDLGdDQUF5QixPQUFPLENBQUMsR0FBRyxXQUFHLEVBQUUsT0FBTyxDQUFDLElBQUksQ0FBRSxDQUFDO1FBQ3hFLENBQUM7UUFDRCxRQUFRLEVBQUU7WUFFTixNQUFNLENBQUMsUUFBUSxJQUFJLE1BQU0sQ0FBQyxRQUFRLEVBQUcsQ0FBQTtRQUN6QyxDQUFDO0tBQ0osQ0FBQyxDQUFBO0FBRU4sQ0FBQyxDQUFBO0FBR0csb0JBQUkiLCJzb3VyY2VzQ29udGVudCI6WyJjb25zdCBodHRwUGFyYW0gPSB7XG4gICAgdXJsOiAnJyxcbiAgICBkYXRhOiB7IH0sXG4gICAgc3VjY2VzczogKCByZXMgKSA9PiB7IH0sXG4gICAgbG9hZGluZ01zZzogJ+WKoOi9veS4rS4uLi4nLFxuICAgIGVyck1zZzogJ+WKoOi9vemUmeivr++8jOivt+mHjeivlScsXG4gICAgY29tcGxldGU6ICggKSA9PiB7IH0sXG4gICAgZXJyb3I6ICggKSA9PiB7IH1cbn07XG5cbnR5cGUgaHR0cFBhcmFtID0gYW55O1xuXG5jb25zdCBodHRwID0gKCBwYXJhbXMkOiBodHRwUGFyYW0gKSA9PiB7XG5cbiAgICBjb25zdCBwYXJhbXMgPSBPYmplY3QuYXNzaWduKHsgfSwgaHR0cFBhcmFtLCB7IC4uLnBhcmFtcyQgfSk7XG5cbiAgICBwYXJhbXMubG9hZGluZ01zZyAhPT0gJ25vbmUnICYmIHd4LnNob3dMb2FkaW5nKHtcbiAgICAgICAgdGl0bGU6IHBhcmFtcy5sb2FkaW5nTXNnXG4gICAgfSk7XG5cbiAgICBjb25zdCBnZXRFcnJvciA9ICggbXNnID0gcGFyYW1zLmVyck1zZywgZXJyPzogYW55ICkgPT4ge1xuICAgICAgICBjb25zb2xlLmxvZygnPz8/Pz8/P2VlZWUnLCBwYXJhbXMudXJsICk7XG4gICAgICAgIGVyciAmJiBjb25zb2xlLmxvZyhgRXJyb3I6IGAsIGVyciB8fCBtc2cgKTtcbiAgICAgICAgd3guc2hvd1RvYXN0KHtcbiAgICAgICAgICAgIGljb246ICdub25lJyxcbiAgICAgICAgICAgIHRpdGxlOiBtc2csXG4gICAgICAgICAgICBkdXJhdGlvbjogMjAwMFxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBjb25zdCBuYW1lID0gcGFyYW1zLnVybC5zcGxpdCgnXycpWyAwIF07XG4gICAgY29uc3QgJHVybCA9IHBhcmFtcy51cmwuc3BsaXQoJ18nKVsgMSBdO1xuXG4gICAgd3guY2xvdWQuY2FsbEZ1bmN0aW9uKHtcbiAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgJHVybCxcbiAgICAgICAgICAgIGRhdGE6IHBhcmFtcy5kYXRhXG4gICAgICAgIH0sXG4gICAgICAgIG5hbWUsXG4gICAgICAgIHN1Y2Nlc3M6ICggcmVzOiBhbnkgKSA9PiB7XG4gICAgICAgICAgICBjb25zdCB7IHJlc3VsdCB9ID0gcmVzO1xuICAgICAgICAgICAgaWYgKCAhcmVzdWx0ICkgeyByZXR1cm4gZ2V0RXJyb3IoICk7fVxuICAgICAgICAgICAgY29uc29sZS5sb2coYOOAkC0tLS0gUmVxdWVzdCBTdWNjZXNzIDogJHtwYXJhbXMkLnVybH3jgJFgLCBwYXJhbXMkLmRhdGEsIHJlcy5yZXN1bHQgKTtcbiAgICAgICAgICAgIGNvbnN0IHsgc3RhdHVzLCBkYXRhLCBtZXNzYWdlIH0gPSByZXN1bHQ7XG4gICAgICAgICAgICBpZiAoIHN0YXR1cyAhPT0gMjAwICkge1xuICAgICAgICAgICAgICAgIGdldEVycm9yKCBtZXNzYWdlICYmIG1lc3NhZ2UgIT09IHsgfSA/IG1lc3NhZ2UgOiBwYXJhbXMuZXJyTXNnICk7XG5cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgd3guaGlkZUxvYWRpbmcoeyB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHBhcmFtcy5zdWNjZXNzKCByZXMucmVzdWx0ICk7XG4gICAgICAgIH0sXG4gICAgICAgIGZhaWw6IGVyciA9PiB7XG4gICAgICAgICAgICBnZXRFcnJvciggJ+e9kee7nOmUmeivrycsIGVyciApO1xuICAgICAgICAgICAgcGFyYW1zLmVycm9yICYmIHBhcmFtcy5lcnJvciggKTtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGDjgJAtLS0tIFJlcXVlc3QgRVJST1IgOiAke3BhcmFtcyQudXJsfeOAkWAsIHBhcmFtcyQuZGF0YSApO1xuICAgICAgICB9LFxuICAgICAgICBjb21wbGV0ZTogKCApID0+IHtcbiAgICAgICAgICAgIC8vIHd4LmhpZGVMb2FkaW5nKHsgfSk7XG4gICAgICAgICAgICBwYXJhbXMuY29tcGxldGUgJiYgcGFyYW1zLmNvbXBsZXRlKCApXG4gICAgICAgIH1cbiAgICB9KVxuXG59XG5cbmV4cG9ydCB7XG4gICAgaHR0cFxufTsiXX0=