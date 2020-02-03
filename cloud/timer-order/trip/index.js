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
var subscribe_push_1 = require("../subscribe-push");
cloud.init({
    env: process.env.cloud
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
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4, subscribe_push_1.subscribePush({
                                        openid: member.openid,
                                        type: 'waitPin',
                                        page: "pages/manager-trip-list/index",
                                        texts: ["\u4EE3\u8D2D\u884C\u7A0B\u5373\u5C06\u7ED3\u675F", "\u8BF7\u5C3D\u5FEB\u8C03\u6574\u7FA4\u62FC\u56E2\u552E\u4EF7"]
                                    })];
                                case 1:
                                    _a.sent();
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
    var trips$, e_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 5, , 6]);
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
                if (!(trips$.data.length > 0)) return [3, 4];
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
            case 3:
                _a.sent();
                _a.label = 4;
            case 4: return [2, { status: 200 }];
            case 5:
                e_2 = _a.sent();
                console.log('!!!!overtimeTrip');
                return [2, { status: 500 }];
            case 6: return [2];
        }
    });
}); };
exports.autoTrip = function () { return __awaiter(void 0, void 0, void 0, function () {
    var runningTrip$, now, day, oneDay, Sunday, y, m, d, end_date, e_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
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
                end_date = new Date(y + "/" + m + "/" + d + " 23:00:00").getTime() - 8 * 60 * 60 * 1000;
                return [4, db.collection('trip')
                        .add({
                        data: {
                            type: 'sys',
                            payment: '1',
                            warning: true,
                            published: true,
                            isClosed: false,
                            reduce_price: 0,
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
                return [2, {
                        status: 200
                    }];
            case 3:
                e_3 = _a.sent();
                console.log('!!!!autoTrip', e_3);
                return [2, { status: 500 }];
            case 4: return [2];
        }
    });
}); };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLHFDQUF1QztBQUN2QyxvREFBa0Q7QUFFbEQsS0FBSyxDQUFDLElBQUksQ0FBQztJQUNQLEdBQUcsRUFBRSxPQUFPLENBQUMsR0FBRyxDQUFDLEtBQUs7Q0FDekIsQ0FBQyxDQUFDO0FBRUgsSUFBTSxFQUFFLEdBQWdCLEtBQUssQ0FBQyxRQUFRLEVBQUcsQ0FBQztBQUMxQyxJQUFNLENBQUMsR0FBRyxFQUFFLENBQUMsT0FBTyxDQUFDO0FBUXJCLElBQU0sTUFBTSxHQUFHLFVBQUUsRUFBVTtJQUFWLG1CQUFBLEVBQUEsVUFBVTtJQUN2QixJQUFLLEVBQUUsRUFBRztRQUNOLE9BQU8sSUFBSSxDQUFDLEdBQUcsRUFBRyxDQUFDO0tBQ3RCO0lBQ0QsSUFBTSxNQUFNLEdBQUcsSUFBSSxJQUFJLENBQUUsSUFBSSxJQUFJLEVBQUcsQ0FBQyxjQUFjLEVBQUcsQ0FBQyxDQUFDO0lBQ3hELE9BQU8sSUFBSSxJQUFJLENBQUUsTUFBTSxDQUFDLE9BQU8sRUFBRyxHQUFHLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLElBQUksQ0FBRSxDQUFBO0FBQzdELENBQUMsQ0FBQTtBQUVELElBQU0sY0FBYyxHQUFHLFVBQUUsR0FBUyxFQUFFLEtBQWM7SUFBZCxzQkFBQSxFQUFBLFNBQVUsRUFBRSxDQUFFO0lBQzlDLE9BQU8sS0FBSyxDQUFDLElBQUksQ0FBRSxVQUFBLENBQUM7UUFDaEIsSUFBTSxDQUFDLEdBQUcsR0FBRyxDQUFDLFFBQVEsRUFBRyxDQUFDO1FBQzFCLE9BQU8sQ0FBQyxLQUFLLENBQUMsSUFBSSxHQUFHLENBQUMsVUFBVSxFQUFHLEtBQUssQ0FBQyxDQUFDO0lBQzlDLENBQUMsQ0FBQyxDQUFDO0FBQ1AsQ0FBQyxDQUFBO0FBTVksUUFBQSxVQUFV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LE1BQU0sQ0FBRSxJQUFJLENBQUU7NEJBRTFCLFFBQVEsVUFBQTt5QkFDWDtxQkFDSixDQUFDLEVBQUE7O2dCQWxCTixTQWtCTSxDQUFDO2dCQXFCUCxXQUFPO3dCQUNILE1BQU0sRUFBRSxHQUFHO3FCQUNkLEVBQUE7OztnQkFHRCxPQUFPLENBQUMsR0FBRyxDQUFDLGNBQWMsRUFBRSxHQUFDLENBQUUsQ0FBQztnQkFDaEMsV0FBTyxFQUFFLE1BQU0sRUFBRSxHQUFHLEVBQUUsRUFBQTs7OztLQUU3QixDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgY2xvdWQgZnJvbSAnd3gtc2VydmVyLXNkayc7XG5pbXBvcnQgeyBzdWJzY3JpYmVQdXNoIH0gZnJvbSAnLi4vc3Vic2NyaWJlLXB1c2gnO1xuXG5jbG91ZC5pbml0KHtcbiAgICBlbnY6IHByb2Nlc3MuZW52LmNsb3VkXG59KTtcblxuY29uc3QgZGI6IERCLkRhdGFiYXNlID0gY2xvdWQuZGF0YWJhc2UoICk7XG5jb25zdCBfID0gZGIuY29tbWFuZDtcblxuLyoqIFxuICog6L2s5o2i5qC85p6X5bC85rK75pe25Yy6ICs45pe25Yy6XG4gKiBEYXRlKCkubm93KCkgLyBuZXcgRGF0ZSgpLmdldFRpbWUoKSDmmK/ml7bkuI3ml7bmraPluLjnmoQrOFxuICogRGF0ZS50b0xvY2FsU3RyaW5nKCApIOWlveWDj+aYr+S4gOebtOaYrysw55qEXG4gKiDlhYjmi7/liLAgKzDvvIznhLblkI4rOFxuICovXG5jb25zdCBnZXROb3cgPSAoIHRzID0gZmFsc2UgKTogYW55ID0+IHtcbiAgICBpZiAoIHRzICkge1xuICAgICAgICByZXR1cm4gRGF0ZS5ub3coICk7XG4gICAgfVxuICAgIGNvbnN0IHRpbWVfMCA9IG5ldyBEYXRlKCBuZXcgRGF0ZSggKS50b0xvY2FsZVN0cmluZyggKSk7XG4gICAgcmV0dXJuIG5ldyBEYXRlKCB0aW1lXzAuZ2V0VGltZSggKSArIDggKiA2MCAqIDYwICogMTAwMCApXG59XG5cbmNvbnN0IGNoZWNrSXNJblJhbmdlID0gKCBub3c6IERhdGUsIHJhbmdlID0gWyA5OSBdKSA9PiB7XG4gICAgcmV0dXJuIHJhbmdlLnNvbWUoIHggPT4ge1xuICAgICAgICBjb25zdCBoID0gbm93LmdldEhvdXJzKCApO1xuICAgICAgICByZXR1cm4geCA9PT0gaCAmJiBub3cuZ2V0TWludXRlcyggKSA9PT0gMDtcbiAgICB9KTtcbn1cblxuLyoqXG4gKiDooYznqIsxOiDljbPlsIbov4fmnJ/nmoTooYznqIvvvIzmj5DphpLku6PotK1cbiAqIOaXtumXtO+8muS4reWNiDEy54K55omN5Y+R6YCBXG4gKi9cbmV4cG9ydCBjb25zdCBhbG1vc3RPdmVyID0gYXN5bmMgKCApID0+IHtcbiAgICB0cnkge1xuXG4gICAgICAgIGlmICggIWNoZWNrSXNJblJhbmdlKCBnZXROb3coICksIFsgMTIgXSkpIHtcbiAgICAgICAgICAgIHJldHVybiB7IHN0YXR1czogMjAwIH0gXG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCB0cmlwcyQgPSBhd2FpdCBkYi5jb2xsZWN0aW9uKCd0cmlwJylcbiAgICAgICAgICAgIC53aGVyZSh7XG4gICAgICAgICAgICAgICAgaXNDbG9zZWQ6IGZhbHNlLFxuICAgICAgICAgICAgICAgIHdhcm5pbmc6IF8ubmVxKCB0cnVlICksXG4gICAgICAgICAgICAgICAgZW5kX2RhdGU6IF8ubHRlKCBnZXROb3coIHRydWUgKSAtIDI0ICogNjAgKiA2MCAqIDEwMDAgKVxuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC5nZXQoICk7XG5cbiAgICAgICAgYXdhaXQgUHJvbWlzZS5hbGwoIHRyaXBzJC5kYXRhLm1hcCggdHJpcCA9PiB7XG4gICAgICAgICAgICByZXR1cm4gZGIuY29sbGVjdGlvbigndHJpcCcpXG4gICAgICAgICAgICAgICAgLmRvYyggU3RyaW5nKCB0cmlwLl9pZCApKVxuICAgICAgICAgICAgICAgIC51cGRhdGUoe1xuICAgICAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICB3YXJuaW5nOiB0cnVlXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICB9KSk7XG5cbiAgICAgICAgaWYgKCB0cmlwcyQuZGF0YS5sZW5ndGggPiAwICkge1xuICAgICAgICAgICAgLy8g5o6o6YCB5Luj6LSt6YCa55+lXG4gICAgICAgICAgICBjb25zdCBtZW1iZXJzID0gYXdhaXQgZGIuY29sbGVjdGlvbignbWFuYWdlci1tZW1iZXInKVxuICAgICAgICAgICAgICAgIC53aGVyZSh7XG4gICAgICAgICAgICAgICAgICAgIHB1c2g6IHRydWVcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIC5nZXQoICk7XG5cbiAgICAgICAgICAgIGF3YWl0IFByb21pc2UuYWxsKFxuICAgICAgICAgICAgICAgIG1lbWJlcnMuZGF0YS5tYXAoIGFzeW5jIG1lbWJlciA9PiB7XG4gICAgICAgICAgICAgICAgICAgIC8vIDTjgIHosIPnlKjmjqjpgIFcbiAgICAgICAgICAgICAgICAgICAgYXdhaXQgc3Vic2NyaWJlUHVzaCh7XG4gICAgICAgICAgICAgICAgICAgICAgICBvcGVuaWQ6IG1lbWJlci5vcGVuaWQsXG4gICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiAnd2FpdFBpbicsXG4gICAgICAgICAgICAgICAgICAgICAgICBwYWdlOiBgcGFnZXMvbWFuYWdlci10cmlwLWxpc3QvaW5kZXhgLFxuICAgICAgICAgICAgICAgICAgICAgICAgdGV4dHM6IFtg5Luj6LSt6KGM56iL5Y2z5bCG57uT5p2fYCwgYOivt+WwveW/q+iwg+aVtOe+pOaLvOWbouWUruS7t2BdXG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4geyBzdGF0dXM6IDIwMCB9XG5cbiAgICB9IGNhdGNoICggZSApIHtcbiAgICAgICAgY29uc29sZS5sb2coJyEhISFhbG1vc3RPdmVyJylcbiAgICAgICAgcmV0dXJuIHsgc3RhdHVzOiA1MDAgfVxuICAgIH1cbn1cblxuLyoqXG4gKiDooYznqIsyOiDmiYDmnInotoXov4dlbmR0aW1l55qEdHJpcO+8jOW6lOivpeiHquWKqOiuvuWbnuWOu2lzQ2xvc2VcbiAqL1xuZXhwb3J0IGNvbnN0IG92ZXJ0aW1lVHJpcCA9IGFzeW5jICggKSA9PiB7XG4gICAgdHJ5IHtcblxuICAgICAgICAvLyDliJvlu7rnmoTml6XmnJ/vvIzpg73mmK/mmZrkuIoyM+eCueaIquatoueahFxuICAgICAgICBpZiAoICFjaGVja0lzSW5SYW5nZSggZ2V0Tm93KCApLCBbIDIyLCAyMywgMCBdKSkge1xuICAgICAgICAgICAgcmV0dXJuIHsgc3RhdHVzOiAyMDAgfSBcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IHRyaXBzJCA9IGF3YWl0IGRiLmNvbGxlY3Rpb24oJ3RyaXAnKVxuICAgICAgICAgICAgLndoZXJlKHtcbiAgICAgICAgICAgICAgICBpc0Nsb3NlZDogZmFsc2UsXG4gICAgICAgICAgICAgICAgZW5kX2RhdGU6IF8ubHRlKCBnZXROb3coIHRydWUgKSlcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAuZ2V0KCApO1xuXG4gICAgICAgIGF3YWl0IFByb21pc2UuYWxsKCB0cmlwcyQuZGF0YS5tYXAoIHRyaXAgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIGRiLmNvbGxlY3Rpb24oJ3RyaXAnKVxuICAgICAgICAgICAgICAgIC5kb2MoIFN0cmluZyggdHJpcC5faWQgKSlcbiAgICAgICAgICAgICAgICAudXBkYXRlKHtcbiAgICAgICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgICAgICAgaXNDbG9zZWQ6IHRydWVcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgIH0pKTtcblxuICAgICAgICBpZiAoIHRyaXBzJC5kYXRhLmxlbmd0aCA+IDAgKSB7XG5cbiAgICAgICAgICAgIC8vIOaOqOmAgeS7o+i0remAmuefpVxuICAgICAgICAgICAgYXdhaXQgUHJvbWlzZS5hbGwoXG4gICAgICAgICAgICAgICAgdHJpcHMkLmRhdGEubWFwKCBhc3luYyB0cmlwID0+IHtcbiAgICAgICAgICAgICAgICAgICAgYXdhaXQgY2xvdWQuY2FsbEZ1bmN0aW9uKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6ICd0cmlwJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkdXJsOiAnY2xvc2UtdHJpcC1hbmFseXplJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRpZDogdHJpcC5faWRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICApXG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4geyBzdGF0dXM6IDIwMCB9XG5cbiAgICB9IGNhdGNoICggZSApIHtcbiAgICAgICAgY29uc29sZS5sb2coJyEhISFvdmVydGltZVRyaXAnKVxuICAgICAgICByZXR1cm4geyBzdGF0dXM6IDUwMCB9XG4gICAgfVxufTtcblxuLyoqXG4gKiDooYznqIsz77ya6Ieq5Yqo5Yib5bu6IHN5c+exu+Wei+eahCDooYznqItcbiAqL1xuZXhwb3J0IGNvbnN0IGF1dG9UcmlwID0gYXN5bmMgKCApID0+IHtcbiAgICB0cnkge1xuICAgICAgICBcbiAgICAgICAgY29uc3QgcnVubmluZ1RyaXAkID0gYXdhaXQgZGIuY29sbGVjdGlvbigndHJpcCcpXG4gICAgICAgICAgICAud2hlcmUoe1xuICAgICAgICAgICAgICAgIGlzQ2xvc2VkOiBmYWxzZSxcbiAgICAgICAgICAgICAgICBwdWJsaXNoZWQ6IHRydWUsXG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLmNvdW50KCApO1xuICAgICAgICAgICBcbiAgICAgICAgLy8g6Ziy5q2i6YeN5aSN44CB5LiN6ZyA6KaBIHN5c1RyaXBcbiAgICAgICAgaWYgKCBydW5uaW5nVHJpcCQudG90YWwgPiAwICkgeyBcbiAgICAgICAgICAgIHJldHVybiB7IHN0YXR1czogMjAwIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC8vIOiuoeeul+acrOWRqOaXpe+8jOaZmuS4ijIz54K5XG4gICAgICAgIGNvbnN0IG5vdyA9IGdldE5vdyggKTtcbiAgICAgICAgY29uc3QgZGF5ID0gbm93LmdldERheSggKTtcbiAgICAgICAgY29uc3Qgb25lRGF5ID0gMjQgKiA2MCAqIDYwICogMTAwMDtcbiAgICAgICAgY29uc3QgU3VuZGF5ID0gbmV3IERhdGUoIGdldE5vdyggdHJ1ZSApICsgKCA3IC0gZGF5KSAqIG9uZURheSApO1xuICAgICAgICBjb25zdCB5ID0gU3VuZGF5LmdldEZ1bGxZZWFyKCApO1xuICAgICAgICBjb25zdCBtID0gU3VuZGF5LmdldE1vbnRoKCApICsgMTtcbiAgICAgICAgY29uc3QgZCA9IFN1bmRheS5nZXREYXRlKCApO1xuICAgICAgICBjb25zdCBlbmRfZGF0ZSA9IG5ldyBEYXRlKGAke3l9LyR7bX0vJHtkfSAyMzowMDowMGApLmdldFRpbWUoICkgLSA4ICogNjAgKiA2MCAqIDEwMDA7XG5cbiAgICAgICAgLy8g6Ieq5Yqo5Yib5bu6XG4gICAgICAgIGF3YWl0IGRiLmNvbGxlY3Rpb24oJ3RyaXAnKVxuICAgICAgICAgICAgLmFkZCh7XG4gICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgICB0eXBlOiAnc3lzJyxcbiAgICAgICAgICAgICAgICAgICAgcGF5bWVudDogJzEnLFxuICAgICAgICAgICAgICAgICAgICB3YXJuaW5nOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICBwdWJsaXNoZWQ6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgIGlzQ2xvc2VkOiBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgcmVkdWNlX3ByaWNlOiAwLFxuICAgICAgICAgICAgICAgICAgICBjYWxsTW9uZXlUaW1lczogMCxcbiAgICAgICAgICAgICAgICAgICAgdGl0bGU6ICfnvqTmi7zlm6InLFxuICAgICAgICAgICAgICAgICAgICBzZWxlY3RlZFByb2R1Y3RJZHM6IFsgXSxcbiAgICAgICAgICAgICAgICAgICAgY3JlYXRlVGltZTogZ2V0Tm93KCB0cnVlICksXG4gICAgICAgICAgICAgICAgICAgIHVwZGF0ZVRpbWU6IGdldE5vdyggdHJ1ZSApLFxuICAgICAgICAgICAgICAgICAgICBzdGFydF9kYXRlOiBnZXROb3coIHRydWUgKSxcbiAgICAgICAgICAgICAgICAgICAgLy8g5pys5ZGo5pel5pma5LiKMjPngrlcbiAgICAgICAgICAgICAgICAgICAgZW5kX2RhdGVcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAvLyDmjqjpgIHku6PotK3pgJrnn6VcbiAgICAgICAgLy8gY29uc3QgbWVtYmVycyA9IGF3YWl0IGRiLmNvbGxlY3Rpb24oJ21hbmFnZXItbWVtYmVyJylcbiAgICAgICAgLy8gICAgIC53aGVyZSh7XG4gICAgICAgIC8vICAgICAgICAgcHVzaDogdHJ1ZVxuICAgICAgICAvLyAgICAgfSlcbiAgICAgICAgLy8gICAgIC5nZXQoICk7XG5cbiAgICAgICAgLy8gYXdhaXQgUHJvbWlzZS5hbGwoXG4gICAgICAgIC8vICAgICBtZW1iZXJzLmRhdGEubWFwKCBhc3luYyBtZW1iZXIgPT4ge1xuICAgICAgICAvLyAgICAgICAgIC8vIOiwg+eUqOaOqOmAgVxuICAgICAgICAvLyAgICAgICAgIGF3YWl0IHN1YnNjcmliZVB1c2goe1xuICAgICAgICAvLyAgICAgICAgICAgICBvcGVuaWQ6IG1lbWJlci5vcGVuaWQsXG4gICAgICAgIC8vICAgICAgICAgICAgIHR5cGU6ICd0cmlwJyxcbiAgICAgICAgLy8gICAgICAgICAgICAgcGFnZTogYHBhZ2VzL21hbmFnZXItdHJpcC1saXN0L2luZGV4P3M9MWAsXG4gICAgICAgIC8vICAgICAgICAgICAgIHRleHRzOiBbYOiHquWKqOWIm+W7uuS7o+i0reihjOeoi++9nmAsIGDlj6/kvb/nlKjnvqTmi7zlm6LllabvvIHvvZ5gXVxuICAgICAgICAvLyAgICAgICAgIH0pO1xuICAgICAgICAvLyAgICAgfSlcbiAgICAgICAgLy8gKTtcbiAgICAgICAgXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBzdGF0dXM6IDIwMFxuICAgICAgICB9XG5cbiAgICB9IGNhdGNoICggZSApIHtcbiAgICAgICAgY29uc29sZS5sb2coJyEhISFhdXRvVHJpcCcsIGUgKTtcbiAgICAgICAgcmV0dXJuIHsgc3RhdHVzOiA1MDAgfVxuICAgIH1cbn0iXX0=