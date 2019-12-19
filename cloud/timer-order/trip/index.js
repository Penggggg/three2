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
    var trips$, members, e_2;
    var _this = this;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 6, , 7]);
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
                _a.label = 5;
            case 5: return [2, { status: 200 }];
            case 6:
                e_2 = _a.sent();
                console.log('!!!!overtimeTrip');
                return [2, { status: 500 }];
            case 7: return [2];
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
                end_date = new Date(y + "/" + m + "/" + d + " 23:00:00");
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
                                                texts: ["\u5DF2\u81EA\u52A8\u521B\u5EFA\u4EE3\u8D2D\u884C\u7A0B", "\u53EF\u63A8\u8350\u62FC\u56E2\u5546\u54C1\u5566\uFF5E"]
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSxpQkErT0M7O0FBL09ELHFDQUF1QztBQUV2QyxLQUFLLENBQUMsSUFBSSxDQUFDO0lBQ1AsR0FBRyxFQUFFLE9BQU8sQ0FBQyxHQUFHLENBQUMsS0FBSztDQUN6QixDQUFDLENBQUM7QUFFSCxJQUFNLEVBQUUsR0FBZ0IsS0FBSyxDQUFDLFFBQVEsRUFBRyxDQUFDO0FBQzFDLElBQU0sQ0FBQyxHQUFHLEVBQUUsQ0FBQyxPQUFPLENBQUM7QUFRckIsSUFBTSxNQUFNLEdBQUcsVUFBRSxFQUFVO0lBQVYsbUJBQUEsRUFBQSxVQUFVO0lBQ3ZCLElBQUssRUFBRSxFQUFHO1FBQ04sT0FBTyxJQUFJLENBQUMsR0FBRyxFQUFHLENBQUM7S0FDdEI7SUFDRCxJQUFNLE1BQU0sR0FBRyxJQUFJLElBQUksQ0FBRSxJQUFJLElBQUksRUFBRyxDQUFDLGNBQWMsRUFBRyxDQUFDLENBQUM7SUFDeEQsT0FBTyxJQUFJLElBQUksQ0FBRSxNQUFNLENBQUMsT0FBTyxFQUFHLEdBQUcsQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsSUFBSSxDQUFFLENBQUE7QUFDN0QsQ0FBQyxDQUFBO0FBRUQsSUFBTSxjQUFjLEdBQUcsVUFBRSxHQUFTLEVBQUUsS0FBYztJQUFkLHNCQUFBLEVBQUEsU0FBVSxFQUFFLENBQUU7SUFDOUMsT0FBTyxLQUFLLENBQUMsSUFBSSxDQUFFLFVBQUEsQ0FBQztRQUNoQixJQUFNLENBQUMsR0FBRyxHQUFHLENBQUMsUUFBUSxFQUFHLENBQUM7UUFDMUIsT0FBTyxDQUFDLEtBQUssQ0FBQyxJQUFJLEdBQUcsQ0FBQyxVQUFVLEVBQUcsS0FBSyxDQUFDLENBQUM7SUFDOUMsQ0FBQyxDQUFDLENBQUM7QUFDUCxDQUFDLENBQUE7QUFNWSxRQUFBLFVBQVUs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QUFPO3dCQUNILE1BQU0sRUFBRSxHQUFHO3FCQUNkLEVBQUE7OztnQkFHRCxPQUFPLENBQUMsR0FBRyxDQUFDLGNBQWMsQ0FBQyxDQUFBO2dCQUMzQixXQUFPLEVBQUUsTUFBTSxFQUFFLEdBQUcsRUFBRSxFQUFBOzs7O0tBRTdCLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBjbG91ZCBmcm9tICd3eC1zZXJ2ZXItc2RrJztcblxuY2xvdWQuaW5pdCh7XG4gICAgZW52OiBwcm9jZXNzLmVudi5jbG91ZFxufSk7XG5cbmNvbnN0IGRiOiBEQi5EYXRhYmFzZSA9IGNsb3VkLmRhdGFiYXNlKCApO1xuY29uc3QgXyA9IGRiLmNvbW1hbmQ7XG5cbi8qKiBcbiAqIOi9rOaNouagvOael+WwvOayu+aXtuWMuiArOOaXtuWMulxuICogRGF0ZSgpLm5vdygpIC8gbmV3IERhdGUoKS5nZXRUaW1lKCkg5piv5pe25LiN5pe25q2j5bi455qEKzhcbiAqIERhdGUudG9Mb2NhbFN0cmluZyggKSDlpb3lg4/mmK/kuIDnm7TmmK8rMOeahFxuICog5YWI5ou/5YiwICsw77yM54S25ZCOKzhcbiAqL1xuY29uc3QgZ2V0Tm93ID0gKCB0cyA9IGZhbHNlICk6IGFueSA9PiB7XG4gICAgaWYgKCB0cyApIHtcbiAgICAgICAgcmV0dXJuIERhdGUubm93KCApO1xuICAgIH1cbiAgICBjb25zdCB0aW1lXzAgPSBuZXcgRGF0ZSggbmV3IERhdGUoICkudG9Mb2NhbGVTdHJpbmcoICkpO1xuICAgIHJldHVybiBuZXcgRGF0ZSggdGltZV8wLmdldFRpbWUoICkgKyA4ICogNjAgKiA2MCAqIDEwMDAgKVxufVxuXG5jb25zdCBjaGVja0lzSW5SYW5nZSA9ICggbm93OiBEYXRlLCByYW5nZSA9IFsgOTkgXSkgPT4ge1xuICAgIHJldHVybiByYW5nZS5zb21lKCB4ID0+IHtcbiAgICAgICAgY29uc3QgaCA9IG5vdy5nZXRIb3VycyggKTtcbiAgICAgICAgcmV0dXJuIHggPT09IGggJiYgbm93LmdldE1pbnV0ZXMoICkgPT09IDA7XG4gICAgfSk7XG59XG5cbi8qKlxuICog6KGM56iLMTog5Y2z5bCG6L+H5pyf55qE6KGM56iL77yM5o+Q6YaS5Luj6LStXG4gKiDml7bpl7TvvJrkuK3ljYgxMueCueaJjeWPkemAgVxuICovXG5leHBvcnQgY29uc3QgYWxtb3N0T3ZlciA9IGFzeW5jICggKSA9PiB7XG4gICAgdHJ5IHtcblxuICAgICAgICBpZiAoICFjaGVja0lzSW5SYW5nZSggZ2V0Tm93KCApLCBbIDEyIF0pKSB7XG4gICAgICAgICAgICByZXR1cm4geyBzdGF0dXM6IDIwMCB9IFxuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgdHJpcHMkID0gYXdhaXQgZGIuY29sbGVjdGlvbigndHJpcCcpXG4gICAgICAgICAgICAud2hlcmUoe1xuICAgICAgICAgICAgICAgIGlzQ2xvc2VkOiBmYWxzZSxcbiAgICAgICAgICAgICAgICB3YXJuaW5nOiBfLm5lcSggdHJ1ZSApLFxuICAgICAgICAgICAgICAgIGVuZF9kYXRlOiBfLmx0ZSggZ2V0Tm93KCB0cnVlICkgLSAyNCAqIDYwICogNjAgKiAxMDAwIClcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAuZ2V0KCApO1xuXG4gICAgICAgIGF3YWl0IFByb21pc2UuYWxsKCB0cmlwcyQuZGF0YS5tYXAoIHRyaXAgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIGRiLmNvbGxlY3Rpb24oJ3RyaXAnKVxuICAgICAgICAgICAgICAgIC5kb2MoIFN0cmluZyggdHJpcC5faWQgKSlcbiAgICAgICAgICAgICAgICAudXBkYXRlKHtcbiAgICAgICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgICAgICAgd2FybmluZzogdHJ1ZVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgfSkpO1xuXG4gICAgICAgIGlmICggdHJpcHMkLmRhdGEubGVuZ3RoID4gMCApIHtcbiAgICAgICAgICAgIC8vIOaOqOmAgeS7o+i0remAmuefpVxuICAgICAgICAgICAgY29uc3QgbWVtYmVycyA9IGF3YWl0IGRiLmNvbGxlY3Rpb24oJ21hbmFnZXItbWVtYmVyJylcbiAgICAgICAgICAgICAgICAud2hlcmUoe1xuICAgICAgICAgICAgICAgICAgICBwdXNoOiB0cnVlXG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAuZ2V0KCApO1xuXG4gICAgICAgICAgICBhd2FpdCBQcm9taXNlLmFsbChcbiAgICAgICAgICAgICAgICBtZW1iZXJzLmRhdGEubWFwKCBhc3luYyBtZW1iZXIgPT4ge1xuICAgICAgICAgICAgICAgICAgICAvLyA044CB6LCD55So5o6o6YCBXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHB1c2gkID0gYXdhaXQgY2xvdWQuY2FsbEZ1bmN0aW9uKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6ICdjb21tb24nLFxuICAgICAgICAgICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICR1cmw6ICdwdXNoLXN1YnNjcmliZS1jbG91ZCcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvcGVuaWQ6IG1lbWJlci5vcGVuaWQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6ICd3YWl0UGluJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGFnZTogYHBhZ2VzL21hbmFnZXItdHJpcC1saXN0L2luZGV4YCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGV4dHM6IFtg5Luj6LSt6KGM56iL5Y2z5bCG57uT5p2fYCwgYOivt+WwveW/q+iwg+aVtOe+pOaLvOWbouWUruS7t2BdXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB7IHN0YXR1czogMjAwIH1cblxuICAgIH0gY2F0Y2ggKCBlICkge1xuICAgICAgICBjb25zb2xlLmxvZygnISEhIWFsbW9zdE92ZXInKVxuICAgICAgICByZXR1cm4geyBzdGF0dXM6IDUwMCB9XG4gICAgfVxufVxuXG4vKipcbiAqIOihjOeoizI6IOaJgOaciei2hei/h2VuZHRpbWXnmoR0cmlw77yM5bqU6K+l6Ieq5Yqo6K6+5Zue5Y67aXNDbG9zZVxuICovXG5leHBvcnQgY29uc3Qgb3ZlcnRpbWVUcmlwID0gYXN5bmMgKCApID0+IHtcbiAgICB0cnkge1xuXG4gICAgICAgIC8vIOWIm+W7uueahOaXpeacn++8jOmDveaYr+aZmuS4ijIz54K55oiq5q2i55qEXG4gICAgICAgIGlmICggIWNoZWNrSXNJblJhbmdlKCBnZXROb3coICksIFsgMjIsIDIzLCAwIF0pKSB7XG4gICAgICAgICAgICByZXR1cm4geyBzdGF0dXM6IDIwMCB9IFxuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgdHJpcHMkID0gYXdhaXQgZGIuY29sbGVjdGlvbigndHJpcCcpXG4gICAgICAgICAgICAud2hlcmUoe1xuICAgICAgICAgICAgICAgIGlzQ2xvc2VkOiBmYWxzZSxcbiAgICAgICAgICAgICAgICBlbmRfZGF0ZTogXy5sdGUoIGdldE5vdyggdHJ1ZSApKVxuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC5nZXQoICk7XG5cbiAgICAgICAgYXdhaXQgUHJvbWlzZS5hbGwoIHRyaXBzJC5kYXRhLm1hcCggdHJpcCA9PiB7XG4gICAgICAgICAgICByZXR1cm4gZGIuY29sbGVjdGlvbigndHJpcCcpXG4gICAgICAgICAgICAgICAgLmRvYyggU3RyaW5nKCB0cmlwLl9pZCApKVxuICAgICAgICAgICAgICAgIC51cGRhdGUoe1xuICAgICAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpc0Nsb3NlZDogdHJ1ZVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgfSkpO1xuXG4gICAgICAgIGlmICggdHJpcHMkLmRhdGEubGVuZ3RoID4gMCApIHtcbiAgICAgICAgICAgIC8vIOaOqOmAgeS7o+i0remAmuefpVxuICAgICAgICAgICAgY29uc3QgbWVtYmVycyA9IGF3YWl0IGRiLmNvbGxlY3Rpb24oJ21hbmFnZXItbWVtYmVyJylcbiAgICAgICAgICAgICAgICAud2hlcmUoe1xuICAgICAgICAgICAgICAgICAgICBwdXNoOiB0cnVlXG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAuZ2V0KCApO1xuXG4gICAgICAgICAgICBhd2FpdCBQcm9taXNlLmFsbChcbiAgICAgICAgICAgICAgICBtZW1iZXJzLmRhdGEubWFwKCBhc3luYyBtZW1iZXIgPT4ge1xuICAgICAgICAgICAgICAgICAgICAvLyA044CB6LCD55So5o6o6YCBXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHB1c2gkID0gYXdhaXQgY2xvdWQuY2FsbEZ1bmN0aW9uKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6ICdjb21tb24nLFxuICAgICAgICAgICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICR1cmw6ICdwdXNoLXN1YnNjcmliZS1jbG91ZCcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvcGVuaWQ6IG1lbWJlci5vcGVuaWQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6ICd0cmlwJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGFnZTogYHBhZ2VzL21hbmFnZXItdHJpcC1saXN0L2luZGV4YCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGV4dHM6IFtg6KGM56iL5bey6Ieq5Yqo5Yiw5pyfYCwgYOivt+afpeeci+WwvuasvuaDheWGtWBdXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB7IHN0YXR1czogMjAwIH1cblxuICAgIH0gY2F0Y2ggKCBlICkge1xuICAgICAgICBjb25zb2xlLmxvZygnISEhIW92ZXJ0aW1lVHJpcCcpXG4gICAgICAgIHJldHVybiB7IHN0YXR1czogNTAwIH1cbiAgICB9XG59O1xuXG4vKipcbiAqIOihjOeoizPvvJroh6rliqjliJvlu7ogc3lz57G75Z6L55qEIOihjOeoi1xuICovXG5leHBvcnQgY29uc3QgYXV0b1RyaXAgPSBhc3luYyAoICkgPT4ge1xuICAgIHRyeSB7XG4gICAgICAgIFxuICAgICAgICBjb25zdCBydW5uaW5nVHJpcCQgPSBhd2FpdCBkYi5jb2xsZWN0aW9uKCd0cmlwJylcbiAgICAgICAgICAgIC53aGVyZSh7XG4gICAgICAgICAgICAgICAgaXNDbG9zZWQ6IGZhbHNlLFxuICAgICAgICAgICAgICAgIHB1Ymxpc2hlZDogdHJ1ZSxcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAuY291bnQoICk7XG4gICAgICAgICAgIFxuICAgICAgICAvLyDpmLLmraLph43lpI3jgIHkuI3pnIDopoEgc3lzVHJpcFxuICAgICAgICBpZiAoIHJ1bm5pbmdUcmlwJC50b3RhbCA+IDAgKSB7IFxuICAgICAgICAgICAgcmV0dXJuIHsgc3RhdHVzOiAyMDAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLy8g6K6h566X5pys5ZGo5pel77yM5pma5LiKMjPngrlcbiAgICAgICAgY29uc3Qgbm93ID0gZ2V0Tm93KCApO1xuICAgICAgICBjb25zdCBkYXkgPSBub3cuZ2V0RGF5KCApO1xuICAgICAgICBjb25zdCBvbmVEYXkgPSAyNCAqIDYwICogNjAgKiAxMDAwO1xuICAgICAgICBjb25zdCBTdW5kYXkgPSBuZXcgRGF0ZSggZ2V0Tm93KCB0cnVlICkgKyAoIDcgLSBkYXkpICogb25lRGF5ICk7XG4gICAgICAgIGNvbnN0IHkgPSBTdW5kYXkuZ2V0RnVsbFllYXIoICk7XG4gICAgICAgIGNvbnN0IG0gPSBTdW5kYXkuZ2V0TW9udGgoICkgKyAxO1xuICAgICAgICBjb25zdCBkID0gU3VuZGF5LmdldERhdGUoICk7XG4gICAgICAgIGNvbnN0IGVuZF9kYXRlID0gbmV3IERhdGUoYCR7eX0vJHttfS8ke2R9IDIzOjAwOjAwYClcblxuICAgICAgICAvLyDoh6rliqjliJvlu7pcbiAgICAgICAgYXdhaXQgZGIuY29sbGVjdGlvbigndHJpcCcpXG4gICAgICAgICAgICAuYWRkKHtcbiAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICAgIHR5cGU6ICdzeXMnLFxuICAgICAgICAgICAgICAgICAgICBwYXltZW50OiAnMScsXG4gICAgICAgICAgICAgICAgICAgIHdhcm5pbmc6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgIHB1Ymxpc2hlZDogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgaXNDbG9zZWQ6IGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICByZWR1Y2VfcHJpY2U6IDEsXG4gICAgICAgICAgICAgICAgICAgIGNhbGxNb25leVRpbWVzOiAwLFxuICAgICAgICAgICAgICAgICAgICB0aXRsZTogJ+e+pOaLvOWboicsXG4gICAgICAgICAgICAgICAgICAgIHNlbGVjdGVkUHJvZHVjdElkczogWyBdLFxuICAgICAgICAgICAgICAgICAgICBjcmVhdGVUaW1lOiBnZXROb3coIHRydWUgKSxcbiAgICAgICAgICAgICAgICAgICAgdXBkYXRlVGltZTogZ2V0Tm93KCB0cnVlICksXG4gICAgICAgICAgICAgICAgICAgIHN0YXJ0X2RhdGU6IGdldE5vdyggdHJ1ZSApLFxuICAgICAgICAgICAgICAgICAgICAvLyDmnKzlkajml6XmmZrkuIoyM+eCuVxuICAgICAgICAgICAgICAgICAgICBlbmRfZGF0ZVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgIC8vIOaOqOmAgeS7o+i0remAmuefpVxuICAgICAgICBjb25zdCBtZW1iZXJzID0gYXdhaXQgZGIuY29sbGVjdGlvbignbWFuYWdlci1tZW1iZXInKVxuICAgICAgICAgICAgLndoZXJlKHtcbiAgICAgICAgICAgICAgICBwdXNoOiB0cnVlXG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLmdldCggKTtcblxuICAgICAgICBhd2FpdCBQcm9taXNlLmFsbChcbiAgICAgICAgICAgIG1lbWJlcnMuZGF0YS5tYXAoIGFzeW5jIG1lbWJlciA9PiB7XG4gICAgICAgICAgICAgICAgLy8g6LCD55So5o6o6YCBXG4gICAgICAgICAgICAgICAgY29uc3QgcHVzaCQgPSBhd2FpdCBjbG91ZC5jYWxsRnVuY3Rpb24oe1xuICAgICAgICAgICAgICAgICAgICBuYW1lOiAnY29tbW9uJyxcbiAgICAgICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgICAgICAgJHVybDogJ3B1c2gtc3Vic2NyaWJlLWNsb3VkJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvcGVuaWQ6IG1lbWJlci5vcGVuaWQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogJ3RyaXAnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhZ2U6IGBwYWdlcy9tYW5hZ2VyLXRyaXAtbGlzdC9pbmRleD9zPTFgLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRleHRzOiBbYOW3suiHquWKqOWIm+W7uuS7o+i0reihjOeoi2AsIGDlj6/mjqjojZDmi7zlm6LllYblk4HllabvvZ5gXVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9KVxuICAgICAgICApO1xuICAgICAgICBcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHN0YXR1czogMjAwXG4gICAgICAgIH1cblxuICAgIH0gY2F0Y2ggKCBlICkge1xuICAgICAgICBjb25zb2xlLmxvZygnISEhIWF1dG9UcmlwJylcbiAgICAgICAgcmV0dXJuIHsgc3RhdHVzOiA1MDAgfVxuICAgIH1cbn0iXX0=