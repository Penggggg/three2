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
            console.log("\u3010---- Request Success : " + params$.url + "\u3011", res.result);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaHR0cC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImh0dHAudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7OztBQUFBLElBQU0sU0FBUyxHQUFHO0lBQ2QsR0FBRyxFQUFFLEVBQUU7SUFDUCxJQUFJLEVBQUUsRUFBRztJQUNULE9BQU8sRUFBRSxVQUFFLEdBQUcsSUFBUSxDQUFDO0lBQ3ZCLFVBQVUsRUFBRSxTQUFTO0lBQ3JCLE1BQU0sRUFBRSxVQUFVO0lBQ2xCLFFBQVEsRUFBRSxjQUFTLENBQUM7SUFDcEIsS0FBSyxFQUFFLGNBQVMsQ0FBQztDQUNwQixDQUFDO0FBSUYsSUFBTSxJQUFJLEdBQUcsVUFBRSxPQUFrQjtJQUU3QixJQUFNLE1BQU0sR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDLEVBQUcsRUFBRSxTQUFTLGVBQU8sT0FBTyxFQUFHLENBQUM7SUFFN0QsTUFBTSxDQUFDLFVBQVUsS0FBSyxNQUFNLElBQUksRUFBRSxDQUFDLFdBQVcsQ0FBQztRQUMzQyxLQUFLLEVBQUUsTUFBTSxDQUFDLFVBQVU7S0FDM0IsQ0FBQyxDQUFDO0lBRUgsSUFBTSxRQUFRLEdBQUcsVUFBRSxHQUFtQixFQUFFLEdBQVM7UUFBOUIsb0JBQUEsRUFBQSxNQUFNLE1BQU0sQ0FBQyxNQUFNO1FBQ2xDLEdBQUcsSUFBSSxPQUFPLENBQUMsR0FBRyxDQUFDLFNBQVMsRUFBRSxHQUFHLElBQUksR0FBRyxDQUFFLENBQUM7UUFDM0MsRUFBRSxDQUFDLFNBQVMsQ0FBQztZQUNULElBQUksRUFBRSxNQUFNO1lBQ1osS0FBSyxFQUFFLEdBQUc7WUFDVixRQUFRLEVBQUUsSUFBSTtTQUNqQixDQUFDLENBQUM7SUFDUCxDQUFDLENBQUE7SUFFRCxJQUFNLElBQUksR0FBRyxNQUFNLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBRSxDQUFDLENBQUUsQ0FBQztJQUN4QyxJQUFNLElBQUksR0FBRyxNQUFNLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBRSxDQUFDLENBQUUsQ0FBQztJQUV4QyxFQUFFLENBQUMsS0FBSyxDQUFDLFlBQVksQ0FBQztRQUNsQixJQUFJLEVBQUU7WUFDRixJQUFJLE1BQUE7WUFDSixJQUFJLEVBQUUsTUFBTSxDQUFDLElBQUk7U0FDcEI7UUFDRCxJQUFJLE1BQUE7UUFDSixPQUFPLEVBQUUsVUFBRSxHQUFRO1lBQ1AsSUFBQSxtQkFBTSxDQUFTO1lBQ3ZCLElBQUssQ0FBQyxNQUFNLEVBQUc7Z0JBQUUsT0FBTyxRQUFRLEVBQUcsQ0FBQzthQUFDO1lBQ3JDLE9BQU8sQ0FBQyxHQUFHLENBQUMsa0NBQTJCLE9BQU8sQ0FBQyxHQUFHLFdBQUcsRUFBRSxHQUFHLENBQUMsTUFBTSxDQUFFLENBQUM7WUFDNUQsSUFBQSxzQkFBTSxFQUFFLGtCQUFJLEVBQUUsd0JBQU8sQ0FBWTtZQUN6QyxJQUFLLE1BQU0sS0FBSyxHQUFHLEVBQUc7Z0JBQ2xCLFFBQVEsQ0FBRSxPQUFPLElBQUksT0FBTyxLQUFLLEVBQUcsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFFLENBQUM7YUFFcEU7aUJBQU07Z0JBQ0gsRUFBRSxDQUFDLFdBQVcsQ0FBQyxFQUFHLENBQUMsQ0FBQzthQUN2QjtZQUNELE1BQU0sQ0FBQyxPQUFPLENBQUUsR0FBRyxDQUFDLE1BQU0sQ0FBRSxDQUFDO1FBQ2pDLENBQUM7UUFDRCxJQUFJLEVBQUUsVUFBQSxHQUFHO1lBQ0wsUUFBUSxDQUFFLE1BQU0sRUFBRSxHQUFHLENBQUUsQ0FBQztZQUN4QixNQUFNLENBQUMsS0FBSyxJQUFJLE1BQU0sQ0FBQyxLQUFLLEVBQUcsQ0FBQztZQUNoQyxPQUFPLENBQUMsR0FBRyxDQUFDLGdDQUF5QixPQUFPLENBQUMsR0FBRyxXQUFHLENBQUMsQ0FBQztRQUN6RCxDQUFDO1FBQ0QsUUFBUSxFQUFFO1lBRU4sTUFBTSxDQUFDLFFBQVEsSUFBSSxNQUFNLENBQUMsUUFBUSxFQUFHLENBQUE7UUFDekMsQ0FBQztLQUNKLENBQUMsQ0FBQTtBQUVOLENBQUMsQ0FBQTtBQUdHLG9CQUFJIiwic291cmNlc0NvbnRlbnQiOlsiY29uc3QgaHR0cFBhcmFtID0ge1xuICAgIHVybDogJycsXG4gICAgZGF0YTogeyB9LFxuICAgIHN1Y2Nlc3M6ICggcmVzICkgPT4geyB9LFxuICAgIGxvYWRpbmdNc2c6ICfliqDovb3kuK0uLi4uJyxcbiAgICBlcnJNc2c6ICfliqDovb3plJnor6/vvIzor7fph43or5UnLFxuICAgIGNvbXBsZXRlOiAoICkgPT4geyB9LFxuICAgIGVycm9yOiAoICkgPT4geyB9XG59O1xuXG50eXBlIGh0dHBQYXJhbSA9IGFueTtcblxuY29uc3QgaHR0cCA9ICggcGFyYW1zJDogaHR0cFBhcmFtICkgPT4ge1xuXG4gICAgY29uc3QgcGFyYW1zID0gT2JqZWN0LmFzc2lnbih7IH0sIGh0dHBQYXJhbSwgeyAuLi5wYXJhbXMkIH0pO1xuXG4gICAgcGFyYW1zLmxvYWRpbmdNc2cgIT09ICdub25lJyAmJiB3eC5zaG93TG9hZGluZyh7XG4gICAgICAgIHRpdGxlOiBwYXJhbXMubG9hZGluZ01zZ1xuICAgIH0pO1xuXG4gICAgY29uc3QgZ2V0RXJyb3IgPSAoIG1zZyA9IHBhcmFtcy5lcnJNc2csIGVycj86IGFueSApID0+IHtcbiAgICAgICAgZXJyICYmIGNvbnNvbGUubG9nKGBFcnJvcjogYCwgZXJyIHx8IG1zZyApO1xuICAgICAgICB3eC5zaG93VG9hc3Qoe1xuICAgICAgICAgICAgaWNvbjogJ25vbmUnLFxuICAgICAgICAgICAgdGl0bGU6IG1zZyxcbiAgICAgICAgICAgIGR1cmF0aW9uOiAyMDAwXG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIGNvbnN0IG5hbWUgPSBwYXJhbXMudXJsLnNwbGl0KCdfJylbIDAgXTtcbiAgICBjb25zdCAkdXJsID0gcGFyYW1zLnVybC5zcGxpdCgnXycpWyAxIF07XG5cbiAgICB3eC5jbG91ZC5jYWxsRnVuY3Rpb24oe1xuICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAkdXJsLFxuICAgICAgICAgICAgZGF0YTogcGFyYW1zLmRhdGFcbiAgICAgICAgfSxcbiAgICAgICAgbmFtZSxcbiAgICAgICAgc3VjY2VzczogKCByZXM6IGFueSApID0+IHtcbiAgICAgICAgICAgIGNvbnN0IHsgcmVzdWx0IH0gPSByZXM7XG4gICAgICAgICAgICBpZiAoICFyZXN1bHQgKSB7IHJldHVybiBnZXRFcnJvciggKTt9XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhg44CQLS0tLSBSZXF1ZXN0IFN1Y2Nlc3MgOiAke3BhcmFtcyQudXJsfeOAkWAsIHJlcy5yZXN1bHQgKTtcbiAgICAgICAgICAgIGNvbnN0IHsgc3RhdHVzLCBkYXRhLCBtZXNzYWdlIH0gPSByZXN1bHQ7XG4gICAgICAgICAgICBpZiAoIHN0YXR1cyAhPT0gMjAwICkge1xuICAgICAgICAgICAgICAgIGdldEVycm9yKCBtZXNzYWdlICYmIG1lc3NhZ2UgIT09IHsgfSA/IG1lc3NhZ2UgOiBwYXJhbXMuZXJyTXNnICk7XG5cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgd3guaGlkZUxvYWRpbmcoeyB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHBhcmFtcy5zdWNjZXNzKCByZXMucmVzdWx0ICk7XG4gICAgICAgIH0sXG4gICAgICAgIGZhaWw6IGVyciA9PiB7XG4gICAgICAgICAgICBnZXRFcnJvciggJ+e9kee7nOmUmeivrycsIGVyciApO1xuICAgICAgICAgICAgcGFyYW1zLmVycm9yICYmIHBhcmFtcy5lcnJvciggKTtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGDjgJAtLS0tIFJlcXVlc3QgRVJST1IgOiAke3BhcmFtcyQudXJsfeOAkWApO1xuICAgICAgICB9LFxuICAgICAgICBjb21wbGV0ZTogKCApID0+IHtcbiAgICAgICAgICAgIC8vIHd4LmhpZGVMb2FkaW5nKHsgfSk7XG4gICAgICAgICAgICBwYXJhbXMuY29tcGxldGUgJiYgcGFyYW1zLmNvbXBsZXRlKCApXG4gICAgICAgIH1cbiAgICB9KVxuXG59XG5cbmV4cG9ydCB7XG4gICAgaHR0cFxufTsiXX0=