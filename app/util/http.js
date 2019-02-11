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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaHR0cC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImh0dHAudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7OztBQUFBLElBQU0sU0FBUyxHQUFHO0lBQ2QsR0FBRyxFQUFFLEVBQUU7SUFDUCxJQUFJLEVBQUUsRUFBRztJQUNULE9BQU8sRUFBRSxVQUFFLEdBQUcsSUFBUSxDQUFDO0lBQ3ZCLFVBQVUsRUFBRSxTQUFTO0lBQ3JCLE1BQU0sRUFBRSxVQUFVO0lBQ2xCLFFBQVEsRUFBRSxjQUFTLENBQUM7SUFDcEIsS0FBSyxFQUFFLGNBQVMsQ0FBQztDQUNwQixDQUFDO0FBSUYsSUFBTSxJQUFJLEdBQUcsVUFBRSxPQUFrQjtJQUU3QixJQUFNLE1BQU0sR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDLEVBQUcsRUFBRSxTQUFTLGVBQU8sT0FBTyxFQUFHLENBQUM7SUFFN0QsTUFBTSxDQUFDLFVBQVUsS0FBSyxNQUFNLElBQUksRUFBRSxDQUFDLFdBQVcsQ0FBQztRQUMzQyxLQUFLLEVBQUUsTUFBTSxDQUFDLFVBQVU7S0FDM0IsQ0FBQyxDQUFDO0lBRUgsSUFBTSxRQUFRLEdBQUcsVUFBRSxHQUFtQixFQUFFLEdBQVM7UUFBOUIsb0JBQUEsRUFBQSxNQUFNLE1BQU0sQ0FBQyxNQUFNO1FBQ2xDLEdBQUcsSUFBSSxPQUFPLENBQUMsR0FBRyxDQUFDLFNBQVMsRUFBRSxHQUFHLElBQUksR0FBRyxDQUFFLENBQUM7UUFDM0MsRUFBRSxDQUFDLFNBQVMsQ0FBQztZQUNULElBQUksRUFBRSxNQUFNO1lBQ1osS0FBSyxFQUFFLEdBQUc7WUFDVixRQUFRLEVBQUUsSUFBSTtTQUNqQixDQUFDLENBQUM7SUFDUCxDQUFDLENBQUE7SUFFRCxJQUFNLElBQUksR0FBRyxNQUFNLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBRSxDQUFDLENBQUUsQ0FBQztJQUN4QyxJQUFNLElBQUksR0FBRyxNQUFNLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBRSxDQUFDLENBQUUsQ0FBQztJQUV4QyxFQUFFLENBQUMsS0FBSyxDQUFDLFlBQVksQ0FBQztRQUNsQixJQUFJLEVBQUU7WUFDRixJQUFJLE1BQUE7WUFDSixJQUFJLEVBQUUsTUFBTSxDQUFDLElBQUk7U0FDcEI7UUFDRCxJQUFJLE1BQUE7UUFDSixPQUFPLEVBQUUsVUFBRSxHQUFRO1lBQ1AsSUFBQSxtQkFBTSxDQUFTO1lBQ3ZCLElBQUssQ0FBQyxNQUFNLEVBQUc7Z0JBQUUsT0FBTyxRQUFRLEVBQUcsQ0FBQzthQUFDO1lBQ3JDLE9BQU8sQ0FBQyxHQUFHLENBQUMsa0NBQTJCLE9BQU8sQ0FBQyxHQUFHLFdBQUcsRUFBRSxPQUFPLENBQUMsSUFBSSxFQUFFLEdBQUcsQ0FBQyxNQUFNLENBQUUsQ0FBQztZQUMxRSxJQUFBLHNCQUFNLEVBQUUsa0JBQUksRUFBRSx3QkFBTyxDQUFZO1lBQ3pDLElBQUssTUFBTSxLQUFLLEdBQUcsRUFBRztnQkFDbEIsUUFBUSxDQUFFLE9BQU8sSUFBSSxPQUFPLEtBQUssRUFBRyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUUsQ0FBQzthQUVwRTtpQkFBTTtnQkFDSCxFQUFFLENBQUMsV0FBVyxDQUFDLEVBQUcsQ0FBQyxDQUFDO2FBQ3ZCO1lBQ0QsTUFBTSxDQUFDLE9BQU8sQ0FBRSxHQUFHLENBQUMsTUFBTSxDQUFFLENBQUM7UUFDakMsQ0FBQztRQUNELElBQUksRUFBRSxVQUFBLEdBQUc7WUFDTCxRQUFRLENBQUUsTUFBTSxFQUFFLEdBQUcsQ0FBRSxDQUFDO1lBQ3hCLE1BQU0sQ0FBQyxLQUFLLElBQUksTUFBTSxDQUFDLEtBQUssRUFBRyxDQUFDO1lBQ2hDLE9BQU8sQ0FBQyxHQUFHLENBQUMsZ0NBQXlCLE9BQU8sQ0FBQyxHQUFHLFdBQUcsQ0FBQyxDQUFDO1FBQ3pELENBQUM7UUFDRCxRQUFRLEVBQUU7WUFFTixNQUFNLENBQUMsUUFBUSxJQUFJLE1BQU0sQ0FBQyxRQUFRLEVBQUcsQ0FBQTtRQUN6QyxDQUFDO0tBQ0osQ0FBQyxDQUFBO0FBRU4sQ0FBQyxDQUFBO0FBR0csb0JBQUkiLCJzb3VyY2VzQ29udGVudCI6WyJjb25zdCBodHRwUGFyYW0gPSB7XG4gICAgdXJsOiAnJyxcbiAgICBkYXRhOiB7IH0sXG4gICAgc3VjY2VzczogKCByZXMgKSA9PiB7IH0sXG4gICAgbG9hZGluZ01zZzogJ+WKoOi9veS4rS4uLi4nLFxuICAgIGVyck1zZzogJ+WKoOi9vemUmeivr++8jOivt+mHjeivlScsXG4gICAgY29tcGxldGU6ICggKSA9PiB7IH0sXG4gICAgZXJyb3I6ICggKSA9PiB7IH1cbn07XG5cbnR5cGUgaHR0cFBhcmFtID0gYW55O1xuXG5jb25zdCBodHRwID0gKCBwYXJhbXMkOiBodHRwUGFyYW0gKSA9PiB7XG5cbiAgICBjb25zdCBwYXJhbXMgPSBPYmplY3QuYXNzaWduKHsgfSwgaHR0cFBhcmFtLCB7IC4uLnBhcmFtcyQgfSk7XG5cbiAgICBwYXJhbXMubG9hZGluZ01zZyAhPT0gJ25vbmUnICYmIHd4LnNob3dMb2FkaW5nKHtcbiAgICAgICAgdGl0bGU6IHBhcmFtcy5sb2FkaW5nTXNnXG4gICAgfSk7XG5cbiAgICBjb25zdCBnZXRFcnJvciA9ICggbXNnID0gcGFyYW1zLmVyck1zZywgZXJyPzogYW55ICkgPT4ge1xuICAgICAgICBlcnIgJiYgY29uc29sZS5sb2coYEVycm9yOiBgLCBlcnIgfHwgbXNnICk7XG4gICAgICAgIHd4LnNob3dUb2FzdCh7XG4gICAgICAgICAgICBpY29uOiAnbm9uZScsXG4gICAgICAgICAgICB0aXRsZTogbXNnLFxuICAgICAgICAgICAgZHVyYXRpb246IDIwMDBcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgY29uc3QgbmFtZSA9IHBhcmFtcy51cmwuc3BsaXQoJ18nKVsgMCBdO1xuICAgIGNvbnN0ICR1cmwgPSBwYXJhbXMudXJsLnNwbGl0KCdfJylbIDEgXTtcblxuICAgIHd4LmNsb3VkLmNhbGxGdW5jdGlvbih7XG4gICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICR1cmwsXG4gICAgICAgICAgICBkYXRhOiBwYXJhbXMuZGF0YVxuICAgICAgICB9LFxuICAgICAgICBuYW1lLFxuICAgICAgICBzdWNjZXNzOiAoIHJlczogYW55ICkgPT4ge1xuICAgICAgICAgICAgY29uc3QgeyByZXN1bHQgfSA9IHJlcztcbiAgICAgICAgICAgIGlmICggIXJlc3VsdCApIHsgcmV0dXJuIGdldEVycm9yKCApO31cbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGDjgJAtLS0tIFJlcXVlc3QgU3VjY2VzcyA6ICR7cGFyYW1zJC51cmx944CRYCwgcGFyYW1zJC5kYXRhLCByZXMucmVzdWx0ICk7XG4gICAgICAgICAgICBjb25zdCB7IHN0YXR1cywgZGF0YSwgbWVzc2FnZSB9ID0gcmVzdWx0O1xuICAgICAgICAgICAgaWYgKCBzdGF0dXMgIT09IDIwMCApIHtcbiAgICAgICAgICAgICAgICBnZXRFcnJvciggbWVzc2FnZSAmJiBtZXNzYWdlICE9PSB7IH0gPyBtZXNzYWdlIDogcGFyYW1zLmVyck1zZyApO1xuXG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHd4LmhpZGVMb2FkaW5nKHsgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBwYXJhbXMuc3VjY2VzcyggcmVzLnJlc3VsdCApO1xuICAgICAgICB9LFxuICAgICAgICBmYWlsOiBlcnIgPT4ge1xuICAgICAgICAgICAgZ2V0RXJyb3IoICfnvZHnu5zplJnor68nLCBlcnIgKTtcbiAgICAgICAgICAgIHBhcmFtcy5lcnJvciAmJiBwYXJhbXMuZXJyb3IoICk7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhg44CQLS0tLSBSZXF1ZXN0IEVSUk9SIDogJHtwYXJhbXMkLnVybH3jgJFgKTtcbiAgICAgICAgfSxcbiAgICAgICAgY29tcGxldGU6ICggKSA9PiB7XG4gICAgICAgICAgICAvLyB3eC5oaWRlTG9hZGluZyh7IH0pO1xuICAgICAgICAgICAgcGFyYW1zLmNvbXBsZXRlICYmIHBhcmFtcy5jb21wbGV0ZSggKVxuICAgICAgICB9XG4gICAgfSlcblxufVxuXG5leHBvcnQge1xuICAgIGh0dHBcbn07Il19