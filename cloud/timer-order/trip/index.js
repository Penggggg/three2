"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
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
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
var cloud = require("wx-server-sdk");
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
exports.almostOver = function () { return __awaiter(_this, void 0, void 0, function () {
    var trips$, members, e_1;
    var _this = this;
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
                return [4, Promise.all(members.data.map(function (member) { return __awaiter(_this, void 0, void 0, function () {
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
exports.overtimeTrip = function () { return __awaiter(_this, void 0, void 0, function () {
    var trips$, members$, e_2;
    var _this = this;
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
                return [4, Promise.all(members$.data.map(function (member) { return __awaiter(_this, void 0, void 0, function () {
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
                return [4, Promise.all(trips$.data.map(function (trip) { return __awaiter(_this, void 0, void 0, function () {
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
exports.autoTrip = function () { return __awaiter(_this, void 0, void 0, function () {
    var runningTrip$, now, day, oneDay, Sunday, y, m, d, end_date, members, e_3;
    var _this = this;
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
                return [4, Promise.all(members.data.map(function (member) { return __awaiter(_this, void 0, void 0, function () {
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
                console.log('!!!!autoTrip');
                return [2, { status: 500 }];
            case 6: return [2];
        }
    });
}); };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSxpQkE2UEM7O0FBN1BELHFDQUF1QztBQUV2QyxLQUFLLENBQUMsSUFBSSxDQUFDO0lBQ1AsR0FBRyxFQUFFLE9BQU8sQ0FBQyxHQUFHLENBQUMsS0FBSztDQUN6QixDQUFDLENBQUM7QUFFSCxJQUFNLEVBQUUsR0FBZ0IsS0FBSyxDQUFDLFFBQVEsRUFBRyxDQUFDO0FBQzFDLElBQU0sQ0FBQyxHQUFHLEVBQUUsQ0FBQyxPQUFPLENBQUM7QUFRckIsSUFBTSxNQUFNLEdBQUcsVUFBRSxFQUFVO0lBQVYsbUJBQUEsRUFBQSxVQUFVO0lBQ3ZCLElBQUssRUFBRSxFQUFHO1FBQ04sT0FBTyxJQUFJLENBQUMsR0FBRyxFQUFHLENBQUM7S0FDdEI7SUFDRCxJQUFNLE1BQU0sR0FBRyxJQUFJLElBQUksQ0FBRSxJQUFJLElBQUksRUFBRyxDQUFDLGNBQWMsRUFBRyxDQUFDLENBQUM7SUFDeEQsT0FBTyxJQUFJLElBQUksQ0FBRSxNQUFNLENBQUMsT0FBTyxFQUFHLEdBQUcsQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsSUFBSSxDQUFFLENBQUE7QUFDN0QsQ0FBQyxDQUFBO0FBRUQsSUFBTSxjQUFjLEdBQUcsVUFBRSxHQUFTLEVBQUUsS0FBYztJQUFkLHNCQUFBLEVBQUEsU0FBVSxFQUFFLENBQUU7SUFDOUMsT0FBTyxLQUFLLENBQUMsSUFBSSxDQUFFLFVBQUEsQ0FBQztRQUNoQixJQUFNLENBQUMsR0FBRyxHQUFHLENBQUMsUUFBUSxFQUFHLENBQUM7UUFDMUIsT0FBTyxDQUFDLEtBQUssQ0FBQyxJQUFJLEdBQUcsQ0FBQyxVQUFVLEVBQUcsS0FBSyxDQUFDLENBQUM7SUFDOUMsQ0FBQyxDQUFDLENBQUM7QUFDUCxDQUFDLENBQUE7QUFNWSxRQUFBLFVBQVUs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SyxDQUFDLFlBQVksQ0FBQzt3Q0FDbkMsSUFBSSxFQUFFLFFBQVE7d0NBQ2QsSUFBSSxFQUFFOzRDQUNGLElBQUksRUFBRSxzQkFBc0I7NENBQzVCLElBQUksRUFBRTtnREFDRixNQUFNLEVBQUUsTUFBTSxDQUFDLE1BQU07Z0RBQ3JCLElBQUksRUFBRSxNQUFNO2dEQUNaLElBQUksRUFBRSxtQ0FBbUM7Z0RBQ3pDLEtBQUssRUFBRSxDQUFDLHdEQUFXLEVBQUUsd0RBQVcsQ0FBQzs2Q0FDcEM7eUNBQ0o7cUNBQ0osQ0FBQyxFQUFBOztvQ0FYSSxLQUFLLEdBQUcsU0FXWjs7Ozt5QkFDTCxDQUFDLENBQ0wsRUFBQTs7Z0JBaEJELFNBZ0JDLENBQUM7Z0JBRUYsV0FBTzt3QkFDSCxNQUFNLEVBQUUsR0FBRztxQkFDZCxFQUFBOzs7Z0JBR0QsT0FBTyxDQUFDLEdBQUcsQ0FBQyxjQUFjLENBQUMsQ0FBQTtnQkFDM0IsV0FBTyxFQUFFLE1BQU0sRUFBRSxHQUFHLEVBQUUsRUFBQTs7OztLQUU3QixDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgY2xvdWQgZnJvbSAnd3gtc2VydmVyLXNkayc7XG5cbmNsb3VkLmluaXQoe1xuICAgIGVudjogcHJvY2Vzcy5lbnYuY2xvdWRcbn0pO1xuXG5jb25zdCBkYjogREIuRGF0YWJhc2UgPSBjbG91ZC5kYXRhYmFzZSggKTtcbmNvbnN0IF8gPSBkYi5jb21tYW5kO1xuXG4vKiogXG4gKiDovazmjaLmoLzmnpflsLzmsrvml7bljLogKzjml7bljLpcbiAqIERhdGUoKS5ub3coKSAvIG5ldyBEYXRlKCkuZ2V0VGltZSgpIOaYr+aXtuS4jeaXtuato+W4uOeahCs4XG4gKiBEYXRlLnRvTG9jYWxTdHJpbmcoICkg5aW95YOP5piv5LiA55u05pivKzDnmoRcbiAqIOWFiOaLv+WIsCArMO+8jOeEtuWQjis4XG4gKi9cbmNvbnN0IGdldE5vdyA9ICggdHMgPSBmYWxzZSApOiBhbnkgPT4ge1xuICAgIGlmICggdHMgKSB7XG4gICAgICAgIHJldHVybiBEYXRlLm5vdyggKTtcbiAgICB9XG4gICAgY29uc3QgdGltZV8wID0gbmV3IERhdGUoIG5ldyBEYXRlKCApLnRvTG9jYWxlU3RyaW5nKCApKTtcbiAgICByZXR1cm4gbmV3IERhdGUoIHRpbWVfMC5nZXRUaW1lKCApICsgOCAqIDYwICogNjAgKiAxMDAwIClcbn1cblxuY29uc3QgY2hlY2tJc0luUmFuZ2UgPSAoIG5vdzogRGF0ZSwgcmFuZ2UgPSBbIDk5IF0pID0+IHtcbiAgICByZXR1cm4gcmFuZ2Uuc29tZSggeCA9PiB7XG4gICAgICAgIGNvbnN0IGggPSBub3cuZ2V0SG91cnMoICk7XG4gICAgICAgIHJldHVybiB4ID09PSBoICYmIG5vdy5nZXRNaW51dGVzKCApID09PSAwO1xuICAgIH0pO1xufVxuXG4vKipcbiAqIOihjOeoizE6IOWNs+Wwhui/h+acn+eahOihjOeoi++8jOaPkOmGkuS7o+i0rVxuICog5pe26Ze077ya5Lit5Y2IMTLngrnmiY3lj5HpgIFcbiAqL1xuZXhwb3J0IGNvbnN0IGFsbW9zdE92ZXIgPSBhc3luYyAoICkgPT4ge1xuICAgIHRyeSB7XG5cbiAgICAgICAgaWYgKCAhY2hlY2tJc0luUmFuZ2UoIGdldE5vdyggKSwgWyAxMiBdKSkge1xuICAgICAgICAgICAgcmV0dXJuIHsgc3RhdHVzOiAyMDAgfSBcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IHRyaXBzJCA9IGF3YWl0IGRiLmNvbGxlY3Rpb24oJ3RyaXAnKVxuICAgICAgICAgICAgLndoZXJlKHtcbiAgICAgICAgICAgICAgICBpc0Nsb3NlZDogZmFsc2UsXG4gICAgICAgICAgICAgICAgd2FybmluZzogXy5uZXEoIHRydWUgKSxcbiAgICAgICAgICAgICAgICBlbmRfZGF0ZTogXy5sdGUoIGdldE5vdyggdHJ1ZSApIC0gMjQgKiA2MCAqIDYwICogMTAwMCApXG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLmdldCggKTtcblxuICAgICAgICBhd2FpdCBQcm9taXNlLmFsbCggdHJpcHMkLmRhdGEubWFwKCB0cmlwID0+IHtcbiAgICAgICAgICAgIHJldHVybiBkYi5jb2xsZWN0aW9uKCd0cmlwJylcbiAgICAgICAgICAgICAgICAuZG9jKCBTdHJpbmcoIHRyaXAuX2lkICkpXG4gICAgICAgICAgICAgICAgLnVwZGF0ZSh7XG4gICAgICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHdhcm5pbmc6IHRydWVcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgIH0pKTtcblxuICAgICAgICBpZiAoIHRyaXBzJC5kYXRhLmxlbmd0aCA+IDAgKSB7XG4gICAgICAgICAgICAvLyDmjqjpgIHku6PotK3pgJrnn6VcbiAgICAgICAgICAgIGNvbnN0IG1lbWJlcnMgPSBhd2FpdCBkYi5jb2xsZWN0aW9uKCdtYW5hZ2VyLW1lbWJlcicpXG4gICAgICAgICAgICAgICAgLndoZXJlKHtcbiAgICAgICAgICAgICAgICAgICAgcHVzaDogdHJ1ZVxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLmdldCggKTtcblxuICAgICAgICAgICAgYXdhaXQgUHJvbWlzZS5hbGwoXG4gICAgICAgICAgICAgICAgbWVtYmVycy5kYXRhLm1hcCggYXN5bmMgbWVtYmVyID0+IHtcbiAgICAgICAgICAgICAgICAgICAgLy8gNOOAgeiwg+eUqOaOqOmAgVxuICAgICAgICAgICAgICAgICAgICBjb25zdCBwdXNoJCA9IGF3YWl0IGNsb3VkLmNhbGxGdW5jdGlvbih7XG4gICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiAnY29tbW9uJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkdXJsOiAncHVzaC1zdWJzY3JpYmUtY2xvdWQnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb3BlbmlkOiBtZW1iZXIub3BlbmlkLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiAnd2FpdFBpbicsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhZ2U6IGBwYWdlcy9tYW5hZ2VyLXRyaXAtbGlzdC9pbmRleGAsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRleHRzOiBbYOS7o+i0reihjOeoi+WNs+Wwhue7k+adn2AsIGDor7flsL3lv6vosIPmlbTnvqTmi7zlm6LllK7ku7dgXVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4geyBzdGF0dXM6IDIwMCB9XG5cbiAgICB9IGNhdGNoICggZSApIHtcbiAgICAgICAgY29uc29sZS5sb2coJyEhISFhbG1vc3RPdmVyJylcbiAgICAgICAgcmV0dXJuIHsgc3RhdHVzOiA1MDAgfVxuICAgIH1cbn1cblxuLyoqXG4gKiDooYznqIsyOiDmiYDmnInotoXov4dlbmR0aW1l55qEdHJpcO+8jOW6lOivpeiHquWKqOiuvuWbnuWOu2lzQ2xvc2VcbiAqL1xuZXhwb3J0IGNvbnN0IG92ZXJ0aW1lVHJpcCA9IGFzeW5jICggKSA9PiB7XG4gICAgdHJ5IHtcblxuICAgICAgICAvLyDliJvlu7rnmoTml6XmnJ/vvIzpg73mmK/mmZrkuIoyM+eCueaIquatoueahFxuICAgICAgICBpZiAoICFjaGVja0lzSW5SYW5nZSggZ2V0Tm93KCApLCBbIDIyLCAyMywgMCBdKSkge1xuICAgICAgICAgICAgcmV0dXJuIHsgc3RhdHVzOiAyMDAgfSBcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IHRyaXBzJCA9IGF3YWl0IGRiLmNvbGxlY3Rpb24oJ3RyaXAnKVxuICAgICAgICAgICAgLndoZXJlKHtcbiAgICAgICAgICAgICAgICBpc0Nsb3NlZDogZmFsc2UsXG4gICAgICAgICAgICAgICAgZW5kX2RhdGU6IF8ubHRlKCBnZXROb3coIHRydWUgKSlcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAuZ2V0KCApO1xuXG4gICAgICAgIGF3YWl0IFByb21pc2UuYWxsKCB0cmlwcyQuZGF0YS5tYXAoIHRyaXAgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIGRiLmNvbGxlY3Rpb24oJ3RyaXAnKVxuICAgICAgICAgICAgICAgIC5kb2MoIFN0cmluZyggdHJpcC5faWQgKSlcbiAgICAgICAgICAgICAgICAudXBkYXRlKHtcbiAgICAgICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgICAgICAgaXNDbG9zZWQ6IHRydWVcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgIH0pKTtcblxuICAgICAgICBpZiAoIHRyaXBzJC5kYXRhLmxlbmd0aCA+IDAgKSB7XG4gICAgICAgICAgICAvLyDmjqjpgIHku6PotK3pgJrnn6VcbiAgICAgICAgICAgIGNvbnN0IG1lbWJlcnMkID0gYXdhaXQgZGIuY29sbGVjdGlvbignbWFuYWdlci1tZW1iZXInKVxuICAgICAgICAgICAgICAgIC53aGVyZSh7XG4gICAgICAgICAgICAgICAgICAgIHB1c2g6IHRydWVcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIC5nZXQoICk7XG5cbiAgICAgICAgICAgIGF3YWl0IFByb21pc2UuYWxsKFxuICAgICAgICAgICAgICAgIG1lbWJlcnMkLmRhdGEubWFwKCBhc3luYyBtZW1iZXIgPT4ge1xuICAgICAgICAgICAgICAgICAgICAvLyA044CB6LCD55So5o6o6YCBXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHB1c2gkID0gYXdhaXQgY2xvdWQuY2FsbEZ1bmN0aW9uKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6ICdjb21tb24nLFxuICAgICAgICAgICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICR1cmw6ICdwdXNoLXN1YnNjcmliZS1jbG91ZCcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvcGVuaWQ6IG1lbWJlci5vcGVuaWQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6ICd0cmlwJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGFnZTogYHBhZ2VzL21hbmFnZXItdHJpcC1saXN0L2luZGV4YCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGV4dHM6IFtg6KGM56iL5bey6Ieq5Yqo5Yiw5pyfYCwgYOivt+afpeeci+WwvuasvuaDheWGtWBdXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgKTtcblxuICAgICAgICAgICAgYXdhaXQgUHJvbWlzZS5hbGwoXG4gICAgICAgICAgICAgICAgdHJpcHMkLmRhdGEubWFwKCBhc3luYyB0cmlwID0+IHtcbiAgICAgICAgICAgICAgICAgICAgYXdhaXQgY2xvdWQuY2FsbEZ1bmN0aW9uKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6ICd0cmlwJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkdXJsOiAnY2xvc2UtdHJpcC1hbmFseXplJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRpZDogdHJpcC5faWRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICApXG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4geyBzdGF0dXM6IDIwMCB9XG5cbiAgICB9IGNhdGNoICggZSApIHtcbiAgICAgICAgY29uc29sZS5sb2coJyEhISFvdmVydGltZVRyaXAnKVxuICAgICAgICByZXR1cm4geyBzdGF0dXM6IDUwMCB9XG4gICAgfVxufTtcblxuLyoqXG4gKiDooYznqIsz77ya6Ieq5Yqo5Yib5bu6IHN5c+exu+Wei+eahCDooYznqItcbiAqL1xuZXhwb3J0IGNvbnN0IGF1dG9UcmlwID0gYXN5bmMgKCApID0+IHtcbiAgICB0cnkge1xuICAgICAgICBcbiAgICAgICAgY29uc3QgcnVubmluZ1RyaXAkID0gYXdhaXQgZGIuY29sbGVjdGlvbigndHJpcCcpXG4gICAgICAgICAgICAud2hlcmUoe1xuICAgICAgICAgICAgICAgIGlzQ2xvc2VkOiBmYWxzZSxcbiAgICAgICAgICAgICAgICBwdWJsaXNoZWQ6IHRydWUsXG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLmNvdW50KCApO1xuICAgICAgICAgICBcbiAgICAgICAgLy8g6Ziy5q2i6YeN5aSN44CB5LiN6ZyA6KaBIHN5c1RyaXBcbiAgICAgICAgaWYgKCBydW5uaW5nVHJpcCQudG90YWwgPiAwICkgeyBcbiAgICAgICAgICAgIHJldHVybiB7IHN0YXR1czogMjAwIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC8vIOiuoeeul+acrOWRqOaXpe+8jOaZmuS4ijIz54K5XG4gICAgICAgIGNvbnN0IG5vdyA9IGdldE5vdyggKTtcbiAgICAgICAgY29uc3QgZGF5ID0gbm93LmdldERheSggKTtcbiAgICAgICAgY29uc3Qgb25lRGF5ID0gMjQgKiA2MCAqIDYwICogMTAwMDtcbiAgICAgICAgY29uc3QgU3VuZGF5ID0gbmV3IERhdGUoIGdldE5vdyggdHJ1ZSApICsgKCA3IC0gZGF5KSAqIG9uZURheSApO1xuICAgICAgICBjb25zdCB5ID0gU3VuZGF5LmdldEZ1bGxZZWFyKCApO1xuICAgICAgICBjb25zdCBtID0gU3VuZGF5LmdldE1vbnRoKCApICsgMTtcbiAgICAgICAgY29uc3QgZCA9IFN1bmRheS5nZXREYXRlKCApO1xuICAgICAgICBjb25zdCBlbmRfZGF0ZSA9IG5ldyBEYXRlKGAke3l9LyR7bX0vJHtkfSAyMzowMDowMGApLmdldFRpbWUoIClcblxuICAgICAgICAvLyDoh6rliqjliJvlu7pcbiAgICAgICAgYXdhaXQgZGIuY29sbGVjdGlvbigndHJpcCcpXG4gICAgICAgICAgICAuYWRkKHtcbiAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICAgIHR5cGU6ICdzeXMnLFxuICAgICAgICAgICAgICAgICAgICBwYXltZW50OiAnMScsXG4gICAgICAgICAgICAgICAgICAgIHdhcm5pbmc6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgIHB1Ymxpc2hlZDogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgaXNDbG9zZWQ6IGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICByZWR1Y2VfcHJpY2U6IDEsXG4gICAgICAgICAgICAgICAgICAgIGNhbGxNb25leVRpbWVzOiAwLFxuICAgICAgICAgICAgICAgICAgICB0aXRsZTogJ+e+pOaLvOWboicsXG4gICAgICAgICAgICAgICAgICAgIHNlbGVjdGVkUHJvZHVjdElkczogWyBdLFxuICAgICAgICAgICAgICAgICAgICBjcmVhdGVUaW1lOiBnZXROb3coIHRydWUgKSxcbiAgICAgICAgICAgICAgICAgICAgdXBkYXRlVGltZTogZ2V0Tm93KCB0cnVlICksXG4gICAgICAgICAgICAgICAgICAgIHN0YXJ0X2RhdGU6IGdldE5vdyggdHJ1ZSApLFxuICAgICAgICAgICAgICAgICAgICAvLyDmnKzlkajml6XmmZrkuIoyM+eCuVxuICAgICAgICAgICAgICAgICAgICBlbmRfZGF0ZVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgIC8vIOaOqOmAgeS7o+i0remAmuefpVxuICAgICAgICBjb25zdCBtZW1iZXJzID0gYXdhaXQgZGIuY29sbGVjdGlvbignbWFuYWdlci1tZW1iZXInKVxuICAgICAgICAgICAgLndoZXJlKHtcbiAgICAgICAgICAgICAgICBwdXNoOiB0cnVlXG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLmdldCggKTtcblxuICAgICAgICBhd2FpdCBQcm9taXNlLmFsbChcbiAgICAgICAgICAgIG1lbWJlcnMuZGF0YS5tYXAoIGFzeW5jIG1lbWJlciA9PiB7XG4gICAgICAgICAgICAgICAgLy8g6LCD55So5o6o6YCBXG4gICAgICAgICAgICAgICAgY29uc3QgcHVzaCQgPSBhd2FpdCBjbG91ZC5jYWxsRnVuY3Rpb24oe1xuICAgICAgICAgICAgICAgICAgICBuYW1lOiAnY29tbW9uJyxcbiAgICAgICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgICAgICAgJHVybDogJ3B1c2gtc3Vic2NyaWJlLWNsb3VkJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvcGVuaWQ6IG1lbWJlci5vcGVuaWQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogJ3RyaXAnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhZ2U6IGBwYWdlcy9tYW5hZ2VyLXRyaXAtbGlzdC9pbmRleD9zPTFgLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRleHRzOiBbYOiHquWKqOWIm+W7uuS7o+i0reihjOeoi++9nmAsIGDlj6/kvb/nlKjnvqTmi7zlm6LllabvvIHvvZ5gXVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9KVxuICAgICAgICApO1xuICAgICAgICBcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHN0YXR1czogMjAwXG4gICAgICAgIH1cblxuICAgIH0gY2F0Y2ggKCBlICkge1xuICAgICAgICBjb25zb2xlLmxvZygnISEhIWF1dG9UcmlwJylcbiAgICAgICAgcmV0dXJuIHsgc3RhdHVzOiA1MDAgfVxuICAgIH1cbn0iXX0=