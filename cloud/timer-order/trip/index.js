"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var cloud = require("wx-server-sdk");
cloud.init({
    env: cloud.DYNAMIC_CURRENT_ENV
});
var db = cloud.database();
var _ = db.command;
var getNow = function (ts) {
    if (ts === void 0) { ts = false; }
    if (ts) {
        return Date.now();
    }
    var time_0 = new Date(new Date().toLocaleString());
    return new Date(time_0.getTime() + 8 * 60 * 60 * 1000);
};
var checkIsInRange = function (now, range) {
    if (range === void 0) { range = [99]; }
    return range.some(function (x) {
        var h = now.getHours();
        return x === h && now.getMinutes() === 0;
    });
};
exports.almostOver = function () { return __awaiter(void 0, void 0, void 0, function () {
    var trips$, members, e_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 6, , 7]);
                if (!checkIsInRange(getNow(), [12])) {
                    return [2, { status: 200 }];
                }
                return [4, db.collection('trip')
                        .where({
                        isClosed: false,
                        warning: _.neq(true),
                        end_date: _.lte(getNow(true) - 24 * 60 * 60 * 1000)
                    })
                        .get()];
            case 1:
                trips$ = _a.sent();
                return [4, Promise.all(trips$.data.map(function (trip) {
                        return db.collection('trip')
                            .doc(String(trip._id))
                            .update({
                            data: {
                                warning: true
                            }
                        });
                    }))];
            case 2:
                _a.sent();
                if (!(trips$.data.length > 0)) return [3, 5];
                return [4, db.collection('manager-member')
                        .where({
                        push: true
                    })
                        .get()];
            case 3:
                members = _a.sent();
                return [4, Promise.all(members.data.map(function (member) { return __awaiter(void 0, void 0, void 0, function () {
                        var push$;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4, cloud.callFunction({
                                        name: 'common',
                                        data: {
                                            $url: 'push-subscribe-cloud',
                                            data: {
                                                openid: member.openid,
                                                type: 'waitPin',
                                                page: "pages/manager-trip-list/index",
                                                texts: ["\u4EE3\u8D2D\u884C\u7A0B\u5373\u5C06\u7ED3\u675F", "\u8BF7\u5C3D\u5FEB\u8C03\u6574\u7FA4\u62FC\u56E2\u552E\u4EF7"]
                                            }
                                        }
                                    })];
                                case 1:
                                    push$ = _a.sent();
                                    return [2];
                            }
                        });
                    }); }))];
            case 4:
                _a.sent();
                _a.label = 5;
            case 5: return [2, { status: 200 }];
            case 6:
                e_1 = _a.sent();
                console.log('!!!!almostOver');
                return [2, { status: 500 }];
            case 7: return [2];
        }
    });
}); };
exports.overtimeTrip = function () { return __awaiter(void 0, void 0, void 0, function () {
    var trips$, members$, e_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 7, , 8]);
                if (!checkIsInRange(getNow(), [22, 23, 0])) {
                    return [2, { status: 200 }];
                }
                return [4, db.collection('trip')
                        .where({
                        isClosed: false,
                        end_date: _.lte(getNow(true))
                    })
                        .get()];
            case 1:
                trips$ = _a.sent();
                return [4, Promise.all(trips$.data.map(function (trip) {
                        return db.collection('trip')
                            .doc(String(trip._id))
                            .update({
                            data: {
                                isClosed: true
                            }
                        });
                    }))];
            case 2:
                _a.sent();
                if (!(trips$.data.length > 0)) return [3, 6];
                return [4, db.collection('manager-member')
                        .where({
                        push: true
                    })
                        .get()];
            case 3:
                members$ = _a.sent();
                return [4, Promise.all(members$.data.map(function (member) { return __awaiter(void 0, void 0, void 0, function () {
                        var push$;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4, cloud.callFunction({
                                        name: 'common',
                                        data: {
                                            $url: 'push-subscribe-cloud',
                                            data: {
                                                openid: member.openid,
                                                type: 'trip',
                                                page: "pages/manager-trip-list/index",
                                                texts: ["\u884C\u7A0B\u5DF2\u81EA\u52A8\u5230\u671F", "\u8BF7\u67E5\u770B\u5C3E\u6B3E\u60C5\u51B5"]
                                            }
                                        }
                                    })];
                                case 1:
                                    push$ = _a.sent();
                                    return [2];
                            }
                        });
                    }); }))];
            case 4:
                _a.sent();
                return [4, Promise.all(trips$.data.map(function (trip) { return __awaiter(void 0, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4, cloud.callFunction({
                                        name: 'trip',
                                        data: {
                                            $url: 'close-trip-analyze',
                                            data: {
                                                tid: trip._id
                                            }
                                        }
                                    })];
                                case 1:
                                    _a.sent();
                                    return [2];
                            }
                        });
                    }); }))];
            case 5:
                _a.sent();
                _a.label = 6;
            case 6: return [2, { status: 200 }];
            case 7:
                e_2 = _a.sent();
                console.log('!!!!overtimeTrip');
                return [2, { status: 500 }];
            case 8: return [2];
        }
    });
}); };
exports.autoTrip = function () { return __awaiter(void 0, void 0, void 0, function () {
    var runningTrip$, now, day, oneDay, Sunday, y, m, d, end_date, members, e_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 5, , 6]);
                return [4, db.collection('trip')
                        .where({
                        isClosed: false,
                        published: true,
                    })
                        .count()];
            case 1:
                runningTrip$ = _a.sent();
                if (runningTrip$.total > 0) {
                    return [2, { status: 200 }];
                }
                now = getNow();
                day = now.getDay();
                oneDay = 24 * 60 * 60 * 1000;
                Sunday = new Date(getNow(true) + (7 - day) * oneDay);
                y = Sunday.getFullYear();
                m = Sunday.getMonth() + 1;
                d = Sunday.getDate();
                end_date = new Date(y + "/" + m + "/" + d + " 23:00:00").getTime();
                return [4, db.collection('trip')
                        .add({
                        data: {
                            type: 'sys',
                            payment: '1',
                            warning: true,
                            published: true,
                            isClosed: false,
                            reduce_price: 1,
                            callMoneyTimes: 0,
                            title: '群拼团',
                            selectedProductIds: [],
                            createTime: getNow(true),
                            updateTime: getNow(true),
                            start_date: getNow(true),
                            end_date: end_date
                        }
                    })];
            case 2:
                _a.sent();
                return [4, db.collection('manager-member')
                        .where({
                        push: true
                    })
                        .get()];
            case 3:
                members = _a.sent();
                return [4, Promise.all(members.data.map(function (member) { return __awaiter(void 0, void 0, void 0, function () {
                        var push$;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4, cloud.callFunction({
                                        name: 'common',
                                        data: {
                                            $url: 'push-subscribe-cloud',
                                            data: {
                                                openid: member.openid,
                                                type: 'trip',
                                                page: "pages/manager-trip-list/index?s=1",
                                                texts: ["\u81EA\u52A8\u521B\u5EFA\u4EE3\u8D2D\u884C\u7A0B\uFF5E", "\u53EF\u4F7F\u7528\u7FA4\u62FC\u56E2\u5566\uFF01\uFF5E"]
                                            }
                                        }
                                    })];
                                case 1:
                                    push$ = _a.sent();
                                    return [2];
                            }
                        });
                    }); }))];
            case 4:
                _a.sent();
                return [2, {
                        status: 200
                    }];
            case 5:
                e_3 = _a.sent();
                console.log('!!!!autoTrip', e_3);
                return [2, { status: 500 }];
            case 6: return [2];
        }
    });
}); };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLHFDQUF1QztBQUV2QyxLQUFLLENBQUMsSUFBSSxDQUFDO0lBQ1AsR0FBRyxFQUFFLEtBQUssQ0FBQyxtQkFBbUI7Q0FDakMsQ0FBQyxDQUFDO0FBRUgsSUFBTSxFQUFFLEdBQWdCLEtBQUssQ0FBQyxRQUFRLEVBQUcsQ0FBQztBQUMxQyxJQUFNLENBQUMsR0FBRyxFQUFFLENBQUMsT0FBTyxDQUFDO0FBUXJCLElBQU0sTUFBTSxHQUFHLFVBQUUsRUFBVTtJQUFWLG1CQUFBLEVBQUEsVUFBVTtJQUN2QixJQUFLLEVBQUUsRUFBRztRQUNOLE9BQU8sSUFBSSxDQUFDLEdBQUcsRUFBRyxDQUFDO0tBQ3RCO0lBQ0QsSUFBTSxNQUFNLEdBQUcsSUFBSSxJQUFJLENBQUUsSUFBSSxJQUFJLEVBQUcsQ0FBQyxjQUFjLEVBQUcsQ0FBQyxDQUFDO0lBQ3hELE9BQU8sSUFBSSxJQUFJLENBQUUsTUFBTSxDQUFDLE9BQU8sRUFBRyxHQUFHLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLElBQUksQ0FBRSxDQUFBO0FBQzdELENBQUMsQ0FBQTtBQUVELElBQU0sY0FBYyxHQUFHLFVBQUUsR0FBUyxFQUFFLEtBQWM7SUFBZCxzQkFBQSxFQUFBLFNBQVUsRUFBRSxDQUFFO0lBQzlDLE9BQU8sS0FBSyxDQUFDLElBQUksQ0FBRSxVQUFBLENBQUM7UUFDaEIsSUFBTSxDQUFDLEdBQUcsR0FBRyxDQUFDLFFBQVEsRUFBRyxDQUFDO1FBQzFCLE9BQU8sQ0FBQyxLQUFLLENBQUMsSUFBSSxHQUFHLENBQUMsVUFBVSxFQUFHLEtBQUssQ0FBQyxDQUFDO0lBQzlDLENBQUMsQ0FBQyxDQUFDO0FBQ1AsQ0FBQyxDQUFBO0FBTVksUUFBQSxVQUFVLEdBQUc7Ozs7OztnQkFHbEIsSUFB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LElBQUksRUFBRSxRQUFRO3dDQUNkLElBQUksRUFBRTs0Q0FDRixJQUFJLEVBQUUsc0JBQXNCOzRDQUM1QixJQUFJLEVBQUU7Z0RBQ0YsTUFBTSxFQUFFLE1BQU0sQ0FBQyxNQUFNO2dEQUNyQixJQUFJLEVBQUUsTUFBTTtnREFDWixJQUFJLEVBQUUsbUNBQW1DO2dEQUN6QyxLQUFLLEVBQUUsQ0FBQyx3REFBVyxFQUFFLHdEQUFXLENBQUM7NkNBQ3BDO3lDQUNKO3FDQUNKLENBQUMsRUFBQTs7b0NBWEksS0FBSyxHQUFHLFNBV1o7Ozs7eUJBQ0wsQ0FBQyxDQUNMLEVBQUE7O2dCQWhCRCxTQWdCQyxDQUFDO2dCQUVGLFdBQU87d0JBQ0gsTUFBTSxFQUFFLEdBQUc7cUJBQ2QsRUFBQTs7O2dCQUdELE9BQU8sQ0FBQyxHQUFHLENBQUMsY0FBYyxFQUFFLEdBQUMsQ0FBRSxDQUFDO2dCQUNoQyxXQUFPLEVBQUUsTUFBTSxFQUFFLEdBQUcsRUFBRSxFQUFBOzs7O0tBRTdCLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBjbG91ZCBmcm9tICd3eC1zZXJ2ZXItc2RrJztcblxuY2xvdWQuaW5pdCh7XG4gICAgZW52OiBjbG91ZC5EWU5BTUlDX0NVUlJFTlRfRU5WXG59KTtcblxuY29uc3QgZGI6IERCLkRhdGFiYXNlID0gY2xvdWQuZGF0YWJhc2UoICk7XG5jb25zdCBfID0gZGIuY29tbWFuZDtcblxuLyoqIFxuICog6L2s5o2i5qC85p6X5bC85rK75pe25Yy6ICs45pe25Yy6XG4gKiBEYXRlKCkubm93KCkgLyBuZXcgRGF0ZSgpLmdldFRpbWUoKSDmmK/ml7bkuI3ml7bmraPluLjnmoQrOFxuICogRGF0ZS50b0xvY2FsU3RyaW5nKCApIOWlveWDj+aYr+S4gOebtOaYrysw55qEXG4gKiDlhYjmi7/liLAgKzDvvIznhLblkI4rOFxuICovXG5jb25zdCBnZXROb3cgPSAoIHRzID0gZmFsc2UgKTogYW55ID0+IHtcbiAgICBpZiAoIHRzICkge1xuICAgICAgICByZXR1cm4gRGF0ZS5ub3coICk7XG4gICAgfVxuICAgIGNvbnN0IHRpbWVfMCA9IG5ldyBEYXRlKCBuZXcgRGF0ZSggKS50b0xvY2FsZVN0cmluZyggKSk7XG4gICAgcmV0dXJuIG5ldyBEYXRlKCB0aW1lXzAuZ2V0VGltZSggKSArIDggKiA2MCAqIDYwICogMTAwMCApXG59XG5cbmNvbnN0IGNoZWNrSXNJblJhbmdlID0gKCBub3c6IERhdGUsIHJhbmdlID0gWyA5OSBdKSA9PiB7XG4gICAgcmV0dXJuIHJhbmdlLnNvbWUoIHggPT4ge1xuICAgICAgICBjb25zdCBoID0gbm93LmdldEhvdXJzKCApO1xuICAgICAgICByZXR1cm4geCA9PT0gaCAmJiBub3cuZ2V0TWludXRlcyggKSA9PT0gMDtcbiAgICB9KTtcbn1cblxuLyoqXG4gKiDooYznqIsxOiDljbPlsIbov4fmnJ/nmoTooYznqIvvvIzmj5DphpLku6PotK1cbiAqIOaXtumXtO+8muS4reWNiDEy54K55omN5Y+R6YCBXG4gKi9cbmV4cG9ydCBjb25zdCBhbG1vc3RPdmVyID0gYXN5bmMgKCApID0+IHtcbiAgICB0cnkge1xuXG4gICAgICAgIGlmICggIWNoZWNrSXNJblJhbmdlKCBnZXROb3coICksIFsgMTIgXSkpIHtcbiAgICAgICAgICAgIHJldHVybiB7IHN0YXR1czogMjAwIH0gXG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCB0cmlwcyQgPSBhd2FpdCBkYi5jb2xsZWN0aW9uKCd0cmlwJylcbiAgICAgICAgICAgIC53aGVyZSh7XG4gICAgICAgICAgICAgICAgaXNDbG9zZWQ6IGZhbHNlLFxuICAgICAgICAgICAgICAgIHdhcm5pbmc6IF8ubmVxKCB0cnVlICksXG4gICAgICAgICAgICAgICAgZW5kX2RhdGU6IF8ubHRlKCBnZXROb3coIHRydWUgKSAtIDI0ICogNjAgKiA2MCAqIDEwMDAgKVxuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC5nZXQoICk7XG5cbiAgICAgICAgYXdhaXQgUHJvbWlzZS5hbGwoIHRyaXBzJC5kYXRhLm1hcCggdHJpcCA9PiB7XG4gICAgICAgICAgICByZXR1cm4gZGIuY29sbGVjdGlvbigndHJpcCcpXG4gICAgICAgICAgICAgICAgLmRvYyggU3RyaW5nKCB0cmlwLl9pZCApKVxuICAgICAgICAgICAgICAgIC51cGRhdGUoe1xuICAgICAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICB3YXJuaW5nOiB0cnVlXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICB9KSk7XG5cbiAgICAgICAgaWYgKCB0cmlwcyQuZGF0YS5sZW5ndGggPiAwICkge1xuICAgICAgICAgICAgLy8g5o6o6YCB5Luj6LSt6YCa55+lXG4gICAgICAgICAgICBjb25zdCBtZW1iZXJzID0gYXdhaXQgZGIuY29sbGVjdGlvbignbWFuYWdlci1tZW1iZXInKVxuICAgICAgICAgICAgICAgIC53aGVyZSh7XG4gICAgICAgICAgICAgICAgICAgIHB1c2g6IHRydWVcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIC5nZXQoICk7XG5cbiAgICAgICAgICAgIGF3YWl0IFByb21pc2UuYWxsKFxuICAgICAgICAgICAgICAgIG1lbWJlcnMuZGF0YS5tYXAoIGFzeW5jIG1lbWJlciA9PiB7XG4gICAgICAgICAgICAgICAgICAgIC8vIDTjgIHosIPnlKjmjqjpgIFcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgcHVzaCQgPSBhd2FpdCBjbG91ZC5jYWxsRnVuY3Rpb24oe1xuICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogJ2NvbW1vbicsXG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJHVybDogJ3B1c2gtc3Vic2NyaWJlLWNsb3VkJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9wZW5pZDogbWVtYmVyLm9wZW5pZCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogJ3dhaXRQaW4nLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYWdlOiBgcGFnZXMvbWFuYWdlci10cmlwLWxpc3QvaW5kZXhgLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZXh0czogW2Dku6PotK3ooYznqIvljbPlsIbnu5PmnZ9gLCBg6K+35bC95b+r6LCD5pW0576k5ou85Zui5ZSu5Lu3YF1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICApO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHsgc3RhdHVzOiAyMDAgfVxuXG4gICAgfSBjYXRjaCAoIGUgKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKCchISEhYWxtb3N0T3ZlcicpXG4gICAgICAgIHJldHVybiB7IHN0YXR1czogNTAwIH1cbiAgICB9XG59XG5cbi8qKlxuICog6KGM56iLMjog5omA5pyJ6LaF6L+HZW5kdGltZeeahHRyaXDvvIzlupTor6Xoh6rliqjorr7lm57ljrtpc0Nsb3NlXG4gKi9cbmV4cG9ydCBjb25zdCBvdmVydGltZVRyaXAgPSBhc3luYyAoICkgPT4ge1xuICAgIHRyeSB7XG5cbiAgICAgICAgLy8g5Yib5bu655qE5pel5pyf77yM6YO95piv5pma5LiKMjPngrnmiKrmraLnmoRcbiAgICAgICAgaWYgKCAhY2hlY2tJc0luUmFuZ2UoIGdldE5vdyggKSwgWyAyMiwgMjMsIDAgXSkpIHtcbiAgICAgICAgICAgIHJldHVybiB7IHN0YXR1czogMjAwIH0gXG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCB0cmlwcyQgPSBhd2FpdCBkYi5jb2xsZWN0aW9uKCd0cmlwJylcbiAgICAgICAgICAgIC53aGVyZSh7XG4gICAgICAgICAgICAgICAgaXNDbG9zZWQ6IGZhbHNlLFxuICAgICAgICAgICAgICAgIGVuZF9kYXRlOiBfLmx0ZSggZ2V0Tm93KCB0cnVlICkpXG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLmdldCggKTtcblxuICAgICAgICBhd2FpdCBQcm9taXNlLmFsbCggdHJpcHMkLmRhdGEubWFwKCB0cmlwID0+IHtcbiAgICAgICAgICAgIHJldHVybiBkYi5jb2xsZWN0aW9uKCd0cmlwJylcbiAgICAgICAgICAgICAgICAuZG9jKCBTdHJpbmcoIHRyaXAuX2lkICkpXG4gICAgICAgICAgICAgICAgLnVwZGF0ZSh7XG4gICAgICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlzQ2xvc2VkOiB0cnVlXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICB9KSk7XG5cbiAgICAgICAgaWYgKCB0cmlwcyQuZGF0YS5sZW5ndGggPiAwICkge1xuICAgICAgICAgICAgLy8g5o6o6YCB5Luj6LSt6YCa55+lXG4gICAgICAgICAgICBjb25zdCBtZW1iZXJzJCA9IGF3YWl0IGRiLmNvbGxlY3Rpb24oJ21hbmFnZXItbWVtYmVyJylcbiAgICAgICAgICAgICAgICAud2hlcmUoe1xuICAgICAgICAgICAgICAgICAgICBwdXNoOiB0cnVlXG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAuZ2V0KCApO1xuXG4gICAgICAgICAgICBhd2FpdCBQcm9taXNlLmFsbChcbiAgICAgICAgICAgICAgICBtZW1iZXJzJC5kYXRhLm1hcCggYXN5bmMgbWVtYmVyID0+IHtcbiAgICAgICAgICAgICAgICAgICAgLy8gNOOAgeiwg+eUqOaOqOmAgVxuICAgICAgICAgICAgICAgICAgICBjb25zdCBwdXNoJCA9IGF3YWl0IGNsb3VkLmNhbGxGdW5jdGlvbih7XG4gICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiAnY29tbW9uJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkdXJsOiAncHVzaC1zdWJzY3JpYmUtY2xvdWQnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb3BlbmlkOiBtZW1iZXIub3BlbmlkLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiAndHJpcCcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhZ2U6IGBwYWdlcy9tYW5hZ2VyLXRyaXAtbGlzdC9pbmRleGAsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRleHRzOiBbYOihjOeoi+W3suiHquWKqOWIsOacn2AsIGDor7fmn6XnnIvlsL7mrL7mg4XlhrVgXVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICk7XG5cbiAgICAgICAgICAgIGF3YWl0IFByb21pc2UuYWxsKFxuICAgICAgICAgICAgICAgIHRyaXBzJC5kYXRhLm1hcCggYXN5bmMgdHJpcCA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGF3YWl0IGNsb3VkLmNhbGxGdW5jdGlvbih7XG4gICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiAndHJpcCcsXG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJHVybDogJ2Nsb3NlLXRyaXAtYW5hbHl6ZScsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aWQ6IHRyaXAuX2lkXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgKVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHsgc3RhdHVzOiAyMDAgfVxuXG4gICAgfSBjYXRjaCAoIGUgKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKCchISEhb3ZlcnRpbWVUcmlwJylcbiAgICAgICAgcmV0dXJuIHsgc3RhdHVzOiA1MDAgfVxuICAgIH1cbn07XG5cbi8qKlxuICog6KGM56iLM++8muiHquWKqOWIm+W7uiBzeXPnsbvlnovnmoQg6KGM56iLXG4gKi9cbmV4cG9ydCBjb25zdCBhdXRvVHJpcCA9IGFzeW5jICggKSA9PiB7XG4gICAgdHJ5IHtcbiAgICAgICAgXG4gICAgICAgIGNvbnN0IHJ1bm5pbmdUcmlwJCA9IGF3YWl0IGRiLmNvbGxlY3Rpb24oJ3RyaXAnKVxuICAgICAgICAgICAgLndoZXJlKHtcbiAgICAgICAgICAgICAgICBpc0Nsb3NlZDogZmFsc2UsXG4gICAgICAgICAgICAgICAgcHVibGlzaGVkOiB0cnVlLFxuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC5jb3VudCggKTtcbiAgICAgICAgICAgXG4gICAgICAgIC8vIOmYsuatoumHjeWkjeOAgeS4jemcgOimgSBzeXNUcmlwXG4gICAgICAgIGlmICggcnVubmluZ1RyaXAkLnRvdGFsID4gMCApIHsgXG4gICAgICAgICAgICByZXR1cm4geyBzdGF0dXM6IDIwMCB9XG4gICAgICAgIH1cblxuICAgICAgICAvLyDorqHnrpfmnKzlkajml6XvvIzmmZrkuIoyM+eCuVxuICAgICAgICBjb25zdCBub3cgPSBnZXROb3coICk7XG4gICAgICAgIGNvbnN0IGRheSA9IG5vdy5nZXREYXkoICk7XG4gICAgICAgIGNvbnN0IG9uZURheSA9IDI0ICogNjAgKiA2MCAqIDEwMDA7XG4gICAgICAgIGNvbnN0IFN1bmRheSA9IG5ldyBEYXRlKCBnZXROb3coIHRydWUgKSArICggNyAtIGRheSkgKiBvbmVEYXkgKTtcbiAgICAgICAgY29uc3QgeSA9IFN1bmRheS5nZXRGdWxsWWVhciggKTtcbiAgICAgICAgY29uc3QgbSA9IFN1bmRheS5nZXRNb250aCggKSArIDE7XG4gICAgICAgIGNvbnN0IGQgPSBTdW5kYXkuZ2V0RGF0ZSggKTtcbiAgICAgICAgY29uc3QgZW5kX2RhdGUgPSBuZXcgRGF0ZShgJHt5fS8ke219LyR7ZH0gMjM6MDA6MDBgKS5nZXRUaW1lKCApXG5cbiAgICAgICAgLy8g6Ieq5Yqo5Yib5bu6XG4gICAgICAgIGF3YWl0IGRiLmNvbGxlY3Rpb24oJ3RyaXAnKVxuICAgICAgICAgICAgLmFkZCh7XG4gICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgICB0eXBlOiAnc3lzJyxcbiAgICAgICAgICAgICAgICAgICAgcGF5bWVudDogJzEnLFxuICAgICAgICAgICAgICAgICAgICB3YXJuaW5nOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICBwdWJsaXNoZWQ6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgIGlzQ2xvc2VkOiBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgcmVkdWNlX3ByaWNlOiAxLFxuICAgICAgICAgICAgICAgICAgICBjYWxsTW9uZXlUaW1lczogMCxcbiAgICAgICAgICAgICAgICAgICAgdGl0bGU6ICfnvqTmi7zlm6InLFxuICAgICAgICAgICAgICAgICAgICBzZWxlY3RlZFByb2R1Y3RJZHM6IFsgXSxcbiAgICAgICAgICAgICAgICAgICAgY3JlYXRlVGltZTogZ2V0Tm93KCB0cnVlICksXG4gICAgICAgICAgICAgICAgICAgIHVwZGF0ZVRpbWU6IGdldE5vdyggdHJ1ZSApLFxuICAgICAgICAgICAgICAgICAgICBzdGFydF9kYXRlOiBnZXROb3coIHRydWUgKSxcbiAgICAgICAgICAgICAgICAgICAgLy8g5pys5ZGo5pel5pma5LiKMjPngrlcbiAgICAgICAgICAgICAgICAgICAgZW5kX2RhdGVcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAvLyDmjqjpgIHku6PotK3pgJrnn6VcbiAgICAgICAgY29uc3QgbWVtYmVycyA9IGF3YWl0IGRiLmNvbGxlY3Rpb24oJ21hbmFnZXItbWVtYmVyJylcbiAgICAgICAgICAgIC53aGVyZSh7XG4gICAgICAgICAgICAgICAgcHVzaDogdHJ1ZVxuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC5nZXQoICk7XG5cbiAgICAgICAgYXdhaXQgUHJvbWlzZS5hbGwoXG4gICAgICAgICAgICBtZW1iZXJzLmRhdGEubWFwKCBhc3luYyBtZW1iZXIgPT4ge1xuICAgICAgICAgICAgICAgIC8vIOiwg+eUqOaOqOmAgVxuICAgICAgICAgICAgICAgIGNvbnN0IHB1c2gkID0gYXdhaXQgY2xvdWQuY2FsbEZ1bmN0aW9uKHtcbiAgICAgICAgICAgICAgICAgICAgbmFtZTogJ2NvbW1vbicsXG4gICAgICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICR1cmw6ICdwdXNoLXN1YnNjcmliZS1jbG91ZCcsXG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb3BlbmlkOiBtZW1iZXIub3BlbmlkLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6ICd0cmlwJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYWdlOiBgcGFnZXMvbWFuYWdlci10cmlwLWxpc3QvaW5kZXg/cz0xYCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZXh0czogW2Doh6rliqjliJvlu7rku6PotK3ooYznqIvvvZ5gLCBg5Y+v5L2/55So576k5ou85Zui5ZWm77yB772eYF1cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSlcbiAgICAgICAgKTtcbiAgICAgICAgXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBzdGF0dXM6IDIwMFxuICAgICAgICB9XG5cbiAgICB9IGNhdGNoICggZSApIHtcbiAgICAgICAgY29uc29sZS5sb2coJyEhISFhdXRvVHJpcCcsIGUgKTtcbiAgICAgICAgcmV0dXJuIHsgc3RhdHVzOiA1MDAgfVxuICAgIH1cbn0iXX0=