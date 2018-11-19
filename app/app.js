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
App({
    globalData$: {
        role: 0,
        openid: ''
    },
    globalData: {
        role: 0,
        openid: ''
    },
    watchCallBack: {},
    watchingKeys: [],
    init: function () {
        wx.cloud.init({
            traceUser: true
        });
        this.globalData$ = Object.assign({}, this.globalData);
    },
    getUserInfo: function () {
        var _this = this;
        wx.cloud.callFunction({
            name: 'login'
        }).then(function (res) {
            _this.setGlobalData(res.result);
        });
    },
    setGlobalData: function (obj) {
        var _this = this;
        Object.keys(obj).map(function (key) {
            _this.globalData[key] = obj[key];
        });
        this.globalData = Object.assign({}, this.globalData, __assign({}, obj));
    },
    watch$: function (key, cb) {
        var _a;
        this.watchCallBack = Object.assign({}, this.watchCallBack, (_a = {},
            _a[key] = this.watchCallBack[key] || [],
            _a));
        this.watchCallBack[key].push(cb);
        if (!this.watchingKeys.find(function (x) { return x === key; })) {
            var that_1 = this;
            this.watchingKeys.push(key);
            Object.defineProperty(this.globalData, key, {
                configurable: true,
                enumerable: true,
                set: function (val) {
                    var old = that_1.globalData$[key];
                    that_1.globalData$[key] = val;
                    that_1.watchCallBack[key].map(function (func) { return func(val, old); });
                },
                get: function () {
                    return that_1.globalData$[key];
                }
            });
        }
    },
    onLaunch: function () {
        var _this = this;
        this.init();
        setTimeout(function () { return _this.getUserInfo(); }, 200);
    }
});
var Role;
(function (Role) {
    Role[Role["normal"] = 0] = "normal";
    Role[Role["admin"] = 1] = "admin";
})(Role || (Role = {}));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiYXBwLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7QUFDQSxHQUFHLENBQVE7SUFHUCxXQUFXLEVBQUU7UUFDVCxJQUFJLEVBQUUsQ0FBQztRQUNQLE1BQU0sRUFBRSxFQUFFO0tBQ2I7SUFHRCxVQUFVLEVBQUU7UUFDUixJQUFJLEVBQUUsQ0FBQztRQUNQLE1BQU0sRUFBRSxFQUFFO0tBQ2I7SUFHRCxhQUFhLEVBQUUsRUFBRztJQUdsQixZQUFZLEVBQUUsRUFBRztJQUdqQixJQUFJO1FBRUEsRUFBRSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUM7WUFDVixTQUFTLEVBQUUsSUFBSTtTQUNsQixDQUFDLENBQUM7UUFFSCxJQUFJLENBQUMsV0FBVyxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUMsRUFBRyxFQUFFLElBQUksQ0FBQyxVQUFVLENBQUUsQ0FBQztJQUM1RCxDQUFDO0lBR0QsV0FBVztRQUFYLGlCQU1DO1FBTEcsRUFBRSxDQUFDLEtBQUssQ0FBQyxZQUFZLENBQUM7WUFDbEIsSUFBSSxFQUFFLE9BQU87U0FDaEIsQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFFLEdBQVE7WUFDZCxLQUFJLENBQUMsYUFBYSxDQUFFLEdBQUcsQ0FBQyxNQUFNLENBQUUsQ0FBQztRQUNyQyxDQUFDLENBQUMsQ0FBQztJQUNQLENBQUM7SUFHRCxhQUFhLFlBQUUsR0FBRztRQUFsQixpQkFLQztRQUpHLE1BQU0sQ0FBQyxJQUFJLENBQUUsR0FBRyxDQUFFLENBQUMsR0FBRyxDQUFFLFVBQUEsR0FBRztZQUN2QixLQUFJLENBQUMsVUFBVSxDQUFFLEdBQUcsQ0FBRSxHQUFHLEdBQUcsQ0FBRSxHQUFHLENBQUUsQ0FBQztRQUN4QyxDQUFDLENBQUMsQ0FBQztRQUNILElBQUksQ0FBQyxVQUFVLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQyxFQUFHLEVBQUUsSUFBSSxDQUFDLFVBQVUsZUFBUSxHQUFjLEVBQUUsQ0FBQztJQUNqRixDQUFDO0lBR0QsTUFBTSxZQUFFLEdBQUcsRUFBRSxFQUFFOztRQUNYLElBQUksQ0FBQyxhQUFhLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQyxFQUFFLEVBQUUsSUFBSSxDQUFDLGFBQWE7WUFDckQsR0FBRSxHQUFHLElBQUksSUFBSSxDQUFDLGFBQWEsQ0FBRSxHQUFHLENBQUUsSUFBSSxFQUFHO2dCQUMzQyxDQUFDO1FBQ0gsSUFBSSxDQUFDLGFBQWEsQ0FBRSxHQUFHLENBQUUsQ0FBQyxJQUFJLENBQUUsRUFBRSxDQUFFLENBQUM7UUFDckMsSUFBSyxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFFLFVBQUEsQ0FBQyxJQUFJLE9BQUEsQ0FBQyxLQUFLLEdBQUcsRUFBVCxDQUFTLENBQUUsRUFBRTtZQUM1QyxJQUFNLE1BQUksR0FBRyxJQUFJLENBQUM7WUFDbEIsSUFBSSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUUsR0FBRyxDQUFFLENBQUM7WUFDOUIsTUFBTSxDQUFDLGNBQWMsQ0FBRSxJQUFJLENBQUMsVUFBVSxFQUFFLEdBQUcsRUFBRTtnQkFDekMsWUFBWSxFQUFFLElBQUk7Z0JBQ2xCLFVBQVUsRUFBRSxJQUFJO2dCQUNoQixHQUFHLEVBQUUsVUFBVSxHQUFHO29CQUNkLElBQU0sR0FBRyxHQUFHLE1BQUksQ0FBQyxXQUFXLENBQUMsR0FBRyxDQUFDLENBQUM7b0JBQ2xDLE1BQUksQ0FBQyxXQUFXLENBQUUsR0FBRyxDQUFFLEdBQUcsR0FBRyxDQUFDO29CQUM5QixNQUFJLENBQUMsYUFBYSxDQUFFLEdBQUcsQ0FBRSxDQUFDLEdBQUcsQ0FBQyxVQUFBLElBQUksSUFBSSxPQUFBLElBQUksQ0FBRSxHQUFHLEVBQUUsR0FBRyxDQUFFLEVBQWhCLENBQWdCLENBQUMsQ0FBQztnQkFDNUQsQ0FBQztnQkFDRCxHQUFHLEVBQUU7b0JBQ0QsT0FBTyxNQUFJLENBQUMsV0FBVyxDQUFDLEdBQUcsQ0FBQyxDQUFDO2dCQUNqQyxDQUFDO2FBQ0osQ0FBQyxDQUFDO1NBQ047SUFDTCxDQUFDO0lBRUQsUUFBUSxFQUFFO1FBQUEsaUJBR1Q7UUFGQyxJQUFJLENBQUMsSUFBSSxFQUFHLENBQUM7UUFDYixVQUFVLENBQUMsY0FBTSxPQUFBLEtBQUksQ0FBQyxXQUFXLEVBQUUsRUFBbEIsQ0FBa0IsRUFBRSxHQUFHLENBQUUsQ0FBQztJQUM3QyxDQUFDO0NBQ0osQ0FBQyxDQUFDO0FBZUgsSUFBSyxJQUdKO0FBSEQsV0FBSyxJQUFJO0lBQ0wsbUNBQU0sQ0FBQTtJQUNOLGlDQUFLLENBQUE7QUFDVCxDQUFDLEVBSEksSUFBSSxLQUFKLElBQUksUUFHUiIsInNvdXJjZXNDb250ZW50IjpbIlxuQXBwPE15QXBwPih7XG5cbiAgICAvKiogZmFkZSBnbG9iYWxEYXRhICovXG4gICAgZ2xvYmFsRGF0YSQ6IHtcbiAgICAgICAgcm9sZTogMCxcbiAgICAgICAgb3BlbmlkOiAnJ1xuICAgIH0sXG5cbiAgICAvKiog5YWo5bGAc3RvcmUgKi9cbiAgICBnbG9iYWxEYXRhOiB7XG4gICAgICAgIHJvbGU6IDAsXG4gICAgICAgIG9wZW5pZDogJydcbiAgICB9LFxuXG4gICAgLyoqIOebkeWQrOWHveaVsOeahOWvueixoeaVsOe7hCAqL1xuICAgIHdhdGNoQ2FsbEJhY2s6IHsgfSxcblxuICAgIC8qKiDnm5HlkKzliJfooaggKi9cbiAgICB3YXRjaGluZ0tleXM6IFsgXSxcblxuICAgIC8qKiDliJ3lp4vljJYgKi9cbiAgICBpbml0KCApIHtcbiAgICAgICAgLy8g5LqRXG4gICAgICAgIHd4LmNsb3VkLmluaXQoe1xuICAgICAgICAgICAgdHJhY2VVc2VyOiB0cnVlXG4gICAgICAgIH0pO1xuICAgICAgICAvLyDlhajlsYDmlbDmja5cbiAgICAgICAgdGhpcy5nbG9iYWxEYXRhJCA9IE9iamVjdC5hc3NpZ24oeyB9LCB0aGlzLmdsb2JhbERhdGEgKTtcbiAgICB9LFxuXG4gICAgLyoqIOiOt+WPlueUqOaIt+S/oeaBryAqL1xuICAgIGdldFVzZXJJbmZvKCApIHtcbiAgICAgICAgd3guY2xvdWQuY2FsbEZ1bmN0aW9uKHtcbiAgICAgICAgICAgIG5hbWU6ICdsb2dpbidcbiAgICAgICAgfSkudGhlbigoIHJlczogYW55KSA9PiB7XG4gICAgICAgICAgICB0aGlzLnNldEdsb2JhbERhdGEoIHJlcy5yZXN1bHQgKTtcbiAgICAgICAgfSk7XG4gICAgfSxcblxuICAgIC8qKiDorr7nva7lhajlsYDmlbDmja4gKi9cbiAgICBzZXRHbG9iYWxEYXRhKCBvYmogKSB7XG4gICAgICAgIE9iamVjdC5rZXlzKCBvYmogKS5tYXAoIGtleSA9PiB7XG4gICAgICAgICAgICB0aGlzLmdsb2JhbERhdGFbIGtleSBdID0gb2JqWyBrZXkgXTtcbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMuZ2xvYmFsRGF0YSA9IE9iamVjdC5hc3NpZ24oeyB9LCB0aGlzLmdsb2JhbERhdGEsIHsgLi4uKG9iaiBhcyBvYmplY3QpfSk7XG4gICAgfSxcblxuICAgIC8qKiB3YXRjaOWHveaVsCAqL1xuICAgIHdhdGNoJCgga2V5LCBjYiApIHtcbiAgICAgICAgdGhpcy53YXRjaENhbGxCYWNrID0gT2JqZWN0LmFzc2lnbih7fSwgdGhpcy53YXRjaENhbGxCYWNrLCB7XG4gICAgICAgICAgICBbIGtleSBdOiB0aGlzLndhdGNoQ2FsbEJhY2tbIGtleSBdIHx8IFsgXVxuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy53YXRjaENhbGxCYWNrWyBrZXkgXS5wdXNoKCBjYiApO1xuICAgICAgICBpZiAoICF0aGlzLndhdGNoaW5nS2V5cy5maW5kKCB4ID0+IHggPT09IGtleSApKSB7XG4gICAgICAgICAgICBjb25zdCB0aGF0ID0gdGhpcztcbiAgICAgICAgICAgIHRoaXMud2F0Y2hpbmdLZXlzLnB1c2goIGtleSApO1xuICAgICAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KCB0aGlzLmdsb2JhbERhdGEsIGtleSwge1xuICAgICAgICAgICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcbiAgICAgICAgICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxuICAgICAgICAgICAgICAgIHNldDogZnVuY3Rpb24oIHZhbCApIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3Qgb2xkID0gdGhhdC5nbG9iYWxEYXRhJFtrZXldO1xuICAgICAgICAgICAgICAgICAgICB0aGF0Lmdsb2JhbERhdGEkWyBrZXkgXSA9IHZhbDtcbiAgICAgICAgICAgICAgICAgICAgdGhhdC53YXRjaENhbGxCYWNrWyBrZXkgXS5tYXAoZnVuYyA9PiBmdW5jKCB2YWwsIG9sZCApKTtcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIGdldDogZnVuY3Rpb24oICkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhhdC5nbG9iYWxEYXRhJFtrZXldO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfSxcbiAgXG4gICAgb25MYXVuY2g6IGZ1bmN0aW9uKCApIHtcbiAgICAgIHRoaXMuaW5pdCggKTtcbiAgICAgIHNldFRpbWVvdXQoKCkgPT4gdGhpcy5nZXRVc2VySW5mbygpLCAyMDAgKTtcbiAgICB9XG59KTtcblxuZXhwb3J0IGludGVyZmFjZSBNeUFwcCB7XG4gICAgZ2xvYmFsRGF0YTogZ2xvYmFsU3RhdGUsXG4gICAgZ2xvYmFsRGF0YSQ6IGdsb2JhbFN0YXRlLFxuICAgIHdhdGNoQ2FsbEJhY2s6IHtcbiAgICAgICAgWyBrZXk6IHN0cmluZyBdOiAoKCB2YWwxOiBhbnksIHZhbDI6IGFueSApID0+IHZvaWQpWyBdXG4gICAgfVxuICAgIHdhdGNoaW5nS2V5czogc3RyaW5nWyBdXG4gICAgaW5pdDogKCApID0+IHZvaWRcbiAgICBnZXRVc2VySW5mbzogKCApID0+IHZvaWQsXG4gICAgc2V0R2xvYmFsRGF0YTogPEsgZXh0ZW5kcyBrZXlvZiBnbG9iYWxTdGF0ZT4oIGRhdGE6IGdsb2JhbFN0YXRlIHwgUGljazxnbG9iYWxTdGF0ZSwgSz4gKSA9PiB2b2lkLFxuICAgIHdhdGNoJDogKCBrZXk6IGtleW9mIGdsb2JhbFN0YXRlLCBhbnkgKSA9PiB2b2lkXG59XG5cbmVudW0gUm9sZSB7XG4gICAgbm9ybWFsLFxuICAgIGFkbWluXG59XG5cbnR5cGUgZ2xvYmFsU3RhdGUgPSB7XG4gICAgcm9sZTogUm9sZSxcbiAgICBvcGVuaWQ6IHN0cmluZ1xufSJdfQ==