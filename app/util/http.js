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
            console.log("\u3010---- Request ERROR : " + params$.url + "\u3011", params$.data);
        },
        complete: function () {
            params.complete && params.complete();
        }
    });
};
exports.http = http;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaHR0cC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImh0dHAudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7OztBQUFBLElBQU0sU0FBUyxHQUFHO0lBQ2QsR0FBRyxFQUFFLEVBQUU7SUFDUCxJQUFJLEVBQUUsRUFBRztJQUNULE9BQU8sRUFBRSxVQUFFLEdBQUcsSUFBUSxDQUFDO0lBQ3ZCLFVBQVUsRUFBRSxTQUFTO0lBQ3JCLE1BQU0sRUFBRSxVQUFVO0lBQ2xCLFFBQVEsRUFBRSxjQUFTLENBQUM7SUFDcEIsS0FBSyxFQUFFLGNBQVMsQ0FBQztDQUNwQixDQUFDO0FBSUYsSUFBTSxJQUFJLEdBQUcsVUFBRSxPQUFrQjtJQUU3QixJQUFNLE1BQU0sR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDLEVBQUcsRUFBRSxTQUFTLGVBQU8sT0FBTyxFQUFHLENBQUM7SUFFN0QsTUFBTSxDQUFDLFVBQVUsS0FBSyxNQUFNLElBQUksRUFBRSxDQUFDLFdBQVcsQ0FBQztRQUMzQyxLQUFLLEVBQUUsTUFBTSxDQUFDLFVBQVU7S0FDM0IsQ0FBQyxDQUFDO0lBRUgsSUFBTSxRQUFRLEdBQUcsVUFBRSxHQUFtQixFQUFFLEdBQVM7UUFBOUIsb0JBQUEsRUFBQSxNQUFNLE1BQU0sQ0FBQyxNQUFNO1FBQ2xDLE9BQU8sQ0FBQyxHQUFHLENBQUMsYUFBYSxDQUFDLENBQUE7UUFDMUIsR0FBRyxJQUFJLE9BQU8sQ0FBQyxHQUFHLENBQUMsU0FBUyxFQUFFLEdBQUcsSUFBSSxHQUFHLENBQUUsQ0FBQztRQUMzQyxFQUFFLENBQUMsU0FBUyxDQUFDO1lBQ1QsSUFBSSxFQUFFLE1BQU07WUFDWixLQUFLLEVBQUUsR0FBRztZQUNWLFFBQVEsRUFBRSxJQUFJO1NBQ2pCLENBQUMsQ0FBQztJQUNQLENBQUMsQ0FBQTtJQUVELElBQU0sSUFBSSxHQUFHLE1BQU0sQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFFLENBQUMsQ0FBRSxDQUFDO0lBQ3hDLElBQU0sSUFBSSxHQUFHLE1BQU0sQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFFLENBQUMsQ0FBRSxDQUFDO0lBRXhDLEVBQUUsQ0FBQyxLQUFLLENBQUMsWUFBWSxDQUFDO1FBQ2xCLElBQUksRUFBRTtZQUNGLElBQUksTUFBQTtZQUNKLElBQUksRUFBRSxNQUFNLENBQUMsSUFBSTtTQUNwQjtRQUNELElBQUksTUFBQTtRQUNKLE9BQU8sRUFBRSxVQUFFLEdBQVE7WUFDUCxJQUFBLG1CQUFNLENBQVM7WUFDdkIsSUFBSyxDQUFDLE1BQU0sRUFBRztnQkFBRSxPQUFPLFFBQVEsRUFBRyxDQUFDO2FBQUM7WUFDckMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxrQ0FBMkIsT0FBTyxDQUFDLEdBQUcsV0FBRyxFQUFFLE9BQU8sQ0FBQyxJQUFJLEVBQUUsR0FBRyxDQUFDLE1BQU0sQ0FBRSxDQUFDO1lBQzFFLElBQUEsc0JBQU0sRUFBRSxrQkFBSSxFQUFFLHdCQUFPLENBQVk7WUFDekMsSUFBSyxNQUFNLEtBQUssR0FBRyxFQUFHO2dCQUNsQixRQUFRLENBQUUsT0FBTyxJQUFJLE9BQU8sS0FBSyxFQUFHLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBRSxDQUFDO2FBRXBFO2lCQUFNO2dCQUNILEVBQUUsQ0FBQyxXQUFXLENBQUMsRUFBRyxDQUFDLENBQUM7YUFDdkI7WUFDRCxNQUFNLENBQUMsT0FBTyxDQUFFLEdBQUcsQ0FBQyxNQUFNLENBQUUsQ0FBQztRQUNqQyxDQUFDO1FBQ0QsSUFBSSxFQUFFLFVBQUEsR0FBRztZQUNMLFFBQVEsQ0FBRSxNQUFNLEVBQUUsR0FBRyxDQUFFLENBQUM7WUFDeEIsTUFBTSxDQUFDLEtBQUssSUFBSSxNQUFNLENBQUMsS0FBSyxFQUFHLENBQUM7WUFDaEMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxnQ0FBeUIsT0FBTyxDQUFDLEdBQUcsV0FBRyxFQUFFLE9BQU8sQ0FBQyxJQUFJLENBQUUsQ0FBQztRQUN4RSxDQUFDO1FBQ0QsUUFBUSxFQUFFO1lBRU4sTUFBTSxDQUFDLFFBQVEsSUFBSSxNQUFNLENBQUMsUUFBUSxFQUFHLENBQUE7UUFDekMsQ0FBQztLQUNKLENBQUMsQ0FBQTtBQUVOLENBQUMsQ0FBQTtBQUdHLG9CQUFJIiwic291cmNlc0NvbnRlbnQiOlsiY29uc3QgaHR0cFBhcmFtID0ge1xuICAgIHVybDogJycsXG4gICAgZGF0YTogeyB9LFxuICAgIHN1Y2Nlc3M6ICggcmVzICkgPT4geyB9LFxuICAgIGxvYWRpbmdNc2c6ICfliqDovb3kuK0uLi4uJyxcbiAgICBlcnJNc2c6ICfliqDovb3plJnor6/vvIzor7fph43or5UnLFxuICAgIGNvbXBsZXRlOiAoICkgPT4geyB9LFxuICAgIGVycm9yOiAoICkgPT4geyB9XG59O1xuXG50eXBlIGh0dHBQYXJhbSA9IGFueTtcblxuY29uc3QgaHR0cCA9ICggcGFyYW1zJDogaHR0cFBhcmFtICkgPT4ge1xuXG4gICAgY29uc3QgcGFyYW1zID0gT2JqZWN0LmFzc2lnbih7IH0sIGh0dHBQYXJhbSwgeyAuLi5wYXJhbXMkIH0pO1xuXG4gICAgcGFyYW1zLmxvYWRpbmdNc2cgIT09ICdub25lJyAmJiB3eC5zaG93TG9hZGluZyh7XG4gICAgICAgIHRpdGxlOiBwYXJhbXMubG9hZGluZ01zZ1xuICAgIH0pO1xuXG4gICAgY29uc3QgZ2V0RXJyb3IgPSAoIG1zZyA9IHBhcmFtcy5lcnJNc2csIGVycj86IGFueSApID0+IHtcbiAgICAgICAgY29uc29sZS5sb2coJz8/Pz8/Pz9lZWVlJylcbiAgICAgICAgZXJyICYmIGNvbnNvbGUubG9nKGBFcnJvcjogYCwgZXJyIHx8IG1zZyApO1xuICAgICAgICB3eC5zaG93VG9hc3Qoe1xuICAgICAgICAgICAgaWNvbjogJ25vbmUnLFxuICAgICAgICAgICAgdGl0bGU6IG1zZyxcbiAgICAgICAgICAgIGR1cmF0aW9uOiAyMDAwXG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIGNvbnN0IG5hbWUgPSBwYXJhbXMudXJsLnNwbGl0KCdfJylbIDAgXTtcbiAgICBjb25zdCAkdXJsID0gcGFyYW1zLnVybC5zcGxpdCgnXycpWyAxIF07XG5cbiAgICB3eC5jbG91ZC5jYWxsRnVuY3Rpb24oe1xuICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAkdXJsLFxuICAgICAgICAgICAgZGF0YTogcGFyYW1zLmRhdGFcbiAgICAgICAgfSxcbiAgICAgICAgbmFtZSxcbiAgICAgICAgc3VjY2VzczogKCByZXM6IGFueSApID0+IHtcbiAgICAgICAgICAgIGNvbnN0IHsgcmVzdWx0IH0gPSByZXM7XG4gICAgICAgICAgICBpZiAoICFyZXN1bHQgKSB7IHJldHVybiBnZXRFcnJvciggKTt9XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhg44CQLS0tLSBSZXF1ZXN0IFN1Y2Nlc3MgOiAke3BhcmFtcyQudXJsfeOAkWAsIHBhcmFtcyQuZGF0YSwgcmVzLnJlc3VsdCApO1xuICAgICAgICAgICAgY29uc3QgeyBzdGF0dXMsIGRhdGEsIG1lc3NhZ2UgfSA9IHJlc3VsdDtcbiAgICAgICAgICAgIGlmICggc3RhdHVzICE9PSAyMDAgKSB7XG4gICAgICAgICAgICAgICAgZ2V0RXJyb3IoIG1lc3NhZ2UgJiYgbWVzc2FnZSAhPT0geyB9ID8gbWVzc2FnZSA6IHBhcmFtcy5lcnJNc2cgKTtcblxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB3eC5oaWRlTG9hZGluZyh7IH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcGFyYW1zLnN1Y2Nlc3MoIHJlcy5yZXN1bHQgKTtcbiAgICAgICAgfSxcbiAgICAgICAgZmFpbDogZXJyID0+IHtcbiAgICAgICAgICAgIGdldEVycm9yKCAn572R57uc6ZSZ6K+vJywgZXJyICk7XG4gICAgICAgICAgICBwYXJhbXMuZXJyb3IgJiYgcGFyYW1zLmVycm9yKCApO1xuICAgICAgICAgICAgY29uc29sZS5sb2coYOOAkC0tLS0gUmVxdWVzdCBFUlJPUiA6ICR7cGFyYW1zJC51cmx944CRYCwgcGFyYW1zJC5kYXRhICk7XG4gICAgICAgIH0sXG4gICAgICAgIGNvbXBsZXRlOiAoICkgPT4ge1xuICAgICAgICAgICAgLy8gd3guaGlkZUxvYWRpbmcoeyB9KTtcbiAgICAgICAgICAgIHBhcmFtcy5jb21wbGV0ZSAmJiBwYXJhbXMuY29tcGxldGUoIClcbiAgICAgICAgfVxuICAgIH0pXG5cbn1cblxuZXhwb3J0IHtcbiAgICBodHRwXG59OyJdfQ==