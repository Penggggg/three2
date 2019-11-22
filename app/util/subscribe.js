"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var storeKey = 'last-show-subscribe-tips';
exports.checkSubscribeTips = function () {
    var now = new Date();
    var record = Number((wx.getStorageSync(storeKey) || 0));
    if (!record) {
        wx.setStorageSync(storeKey, String(Date.now()));
        return false;
    }
    else {
        var toady = new Date(now.getFullYear() + "/" + (now.getMonth() + 1) + "/" + now.getDate() + " 00:00:00");
        if (record >= toady.getTime()) {
            return true;
        }
        else {
            wx.setStorageSync(storeKey, String(Date.now()));
            return false;
        }
    }
};
exports.requestSubscribe = function (types, allTemplates, cb) {
    var typeArr = types.split(',');
    var tmplIds = typeArr.map(function (type) {
        return (allTemplates[type] || {}).id;
    }).filter(function (x) { return !!x; });
    wx.requestSubscribeMessage({
        tmplIds: tmplIds,
        success: function () {
            !!cb && cb();
            console.log('订阅接口调用成功，但未必允许');
        },
        fail: function (e) {
            console.log('订阅接口失败', e);
        }
    });
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3Vic2NyaWJlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsic3Vic2NyaWJlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsSUFBTSxRQUFRLEdBQUcsMEJBQTBCLENBQUM7QUFHL0IsUUFBQSxrQkFBa0IsR0FBRztJQUM5QixJQUFNLEdBQUcsR0FBRyxJQUFJLElBQUksRUFBRyxDQUFDO0lBQ3hCLElBQU0sTUFBTSxHQUFHLE1BQU0sQ0FBQyxDQUFFLEVBQUUsQ0FBQyxjQUFjLENBQUUsUUFBUSxDQUFFLElBQUksQ0FBQyxDQUFFLENBQUMsQ0FBQztJQUU5RCxJQUFLLENBQUMsTUFBTSxFQUFHO1FBQ1gsRUFBRSxDQUFDLGNBQWMsQ0FBRSxRQUFRLEVBQUUsTUFBTSxDQUFFLElBQUksQ0FBQyxHQUFHLEVBQUcsQ0FBQyxDQUFDLENBQUM7UUFDbkQsT0FBTyxLQUFLLENBQUM7S0FDaEI7U0FBTTtRQUNILElBQU0sS0FBSyxHQUFHLElBQUksSUFBSSxDQUFJLEdBQUcsQ0FBQyxXQUFXLEVBQUcsVUFBSSxHQUFHLENBQUMsUUFBUSxFQUFHLEdBQUcsQ0FBQyxVQUFJLEdBQUcsQ0FBQyxPQUFPLEVBQUcsY0FBVyxDQUFDLENBQUM7UUFDbEcsSUFBSyxNQUFNLElBQUksS0FBSyxDQUFDLE9BQU8sRUFBRyxFQUFFO1lBQzdCLE9BQU8sSUFBSSxDQUFDO1NBQ2Y7YUFBTTtZQUNILEVBQUUsQ0FBQyxjQUFjLENBQUUsUUFBUSxFQUFFLE1BQU0sQ0FBRSxJQUFJLENBQUMsR0FBRyxFQUFHLENBQUMsQ0FBQyxDQUFDO1lBQ25ELE9BQU8sS0FBSyxDQUFDO1NBQ2hCO0tBQ0o7QUFDTCxDQUFDLENBQUM7QUFPVyxRQUFBLGdCQUFnQixHQUFHLFVBQUUsS0FBVSxFQUFFLFlBQWlCLEVBQUUsRUFBRztJQUVoRSxJQUFNLE9BQU8sR0FBRyxLQUFLLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQ2pDLElBQU0sT0FBTyxHQUFHLE9BQU8sQ0FBQyxHQUFHLENBQUUsVUFBQSxJQUFJO1FBQzdCLE9BQU8sQ0FBQyxZQUFZLENBQUUsSUFBSSxDQUFFLElBQUksRUFBRyxDQUFDLENBQUMsRUFBRSxDQUFBO0lBQzNDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBRSxVQUFBLENBQUMsSUFBSSxPQUFBLENBQUMsQ0FBQyxDQUFDLEVBQUgsQ0FBRyxDQUFFLENBQUM7SUFFckIsRUFBVSxDQUFDLHVCQUF1QixDQUFDO1FBQ2hDLE9BQU8sU0FBQTtRQUNQLE9BQU8sRUFBRTtZQUNMLENBQUMsQ0FBQyxFQUFFLElBQUksRUFBRSxFQUFHLENBQUM7WUFDZCxPQUFPLENBQUMsR0FBRyxDQUFDLGdCQUFnQixDQUFDLENBQUE7UUFDakMsQ0FBQztRQUNELElBQUksRUFBRSxVQUFBLENBQUM7WUFDSCxPQUFPLENBQUMsR0FBRyxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUUsQ0FBQztRQUM5QixDQUFDO0tBQ0osQ0FBQyxDQUFBO0FBQ04sQ0FBQyxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiY29uc3Qgc3RvcmVLZXkgPSAnbGFzdC1zaG93LXN1YnNjcmliZS10aXBzJztcblxuLyoqIOS7iuWkqeWGheacieayoeW8uei/h+iuoumYheahhiAqL1xuZXhwb3J0IGNvbnN0IGNoZWNrU3Vic2NyaWJlVGlwcyA9ICggKSA9PiB7XG4gICAgY29uc3Qgbm93ID0gbmV3IERhdGUoICk7XG4gICAgY29uc3QgcmVjb3JkID0gTnVtYmVyKCggd3guZ2V0U3RvcmFnZVN5bmMoIHN0b3JlS2V5ICkgfHwgMCApKTtcbiAgICBcbiAgICBpZiAoICFyZWNvcmQgKSB7XG4gICAgICAgIHd4LnNldFN0b3JhZ2VTeW5jKCBzdG9yZUtleSwgU3RyaW5nKCBEYXRlLm5vdyggKSkpO1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgY29uc3QgdG9hZHkgPSBuZXcgRGF0ZShgJHtub3cuZ2V0RnVsbFllYXIoICl9LyR7bm93LmdldE1vbnRoKCApICsgMX0vJHtub3cuZ2V0RGF0ZSggKX0gMDA6MDA6MDBgKTtcbiAgICAgICAgaWYgKCByZWNvcmQgPj0gdG9hZHkuZ2V0VGltZSggKSkge1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB3eC5zZXRTdG9yYWdlU3luYyggc3RvcmVLZXksIFN0cmluZyggRGF0ZS5ub3coICkpKTtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgIH1cbn07XG5cbi8qKlxuICogXG4gKiBAcGFyYW0gdHlwZSBcbiAqIOiuoumYheexu+Weiywg55So6YCX5Y+36ZqU5byA55qEM+S4quWPguaVsO+8iOacgOWkmu+8iVxuICovXG5leHBvcnQgY29uc3QgcmVxdWVzdFN1YnNjcmliZSA9ICggdHlwZXM6IGFueSwgYWxsVGVtcGxhdGVzOiBhbnksIGNiPyApID0+IHtcbiAgICBcbiAgICBjb25zdCB0eXBlQXJyID0gdHlwZXMuc3BsaXQoJywnKTtcbiAgICBjb25zdCB0bXBsSWRzID0gdHlwZUFyci5tYXAoIHR5cGUgPT4ge1xuICAgICAgICByZXR1cm4gKGFsbFRlbXBsYXRlc1sgdHlwZSBdIHx8IHsgfSkuaWRcbiAgICB9KS5maWx0ZXIoIHggPT4gISF4ICk7XG5cbiAgICAod3ggYXMgYW55KS5yZXF1ZXN0U3Vic2NyaWJlTWVzc2FnZSh7XG4gICAgICAgIHRtcGxJZHMsXG4gICAgICAgIHN1Y2Nlc3M6ICggKSA9PiB7XG4gICAgICAgICAgICAhIWNiICYmIGNiKCApO1xuICAgICAgICAgICAgY29uc29sZS5sb2coJ+iuoumYheaOpeWPo+iwg+eUqOaIkOWKn++8jOS9huacquW/heWFgeiuuCcpXG4gICAgICAgIH0sXG4gICAgICAgIGZhaWw6IGUgPT4ge1xuICAgICAgICAgICAgY29uc29sZS5sb2coJ+iuoumYheaOpeWPo+Wksei0pScsIGUgKTtcbiAgICAgICAgfVxuICAgIH0pXG59Il19