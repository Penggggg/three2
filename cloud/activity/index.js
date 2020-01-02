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
var TcbRouter = require("tcb-router");
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
exports.main = function (event, context) { return __awaiter(void 0, void 0, void 0, function () {
    var app;
    return __generator(this, function (_a) {
        app = new TcbRouter({ event: event });
        app.router('create-good-discount', function (ctx, next) { return __awaiter(void 0, void 0, void 0, function () {
            var list, dataMeta_1, hasErr, checks$, errorList_1, create$, e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        list = event.data.list;
                        dataMeta_1 = list.map(function (x) { return Object.assign({}, x, {
                            isClosed: true,
                            isDeleted: false,
                            type: 'good_discount',
                            updatedTime: getNow(true),
                            createdTime: getNow(true)
                        }); });
                        hasErr = function (message) { return ctx.body = {
                            message: message,
                            status: 500
                        }; };
                        return [4, Promise.all(dataMeta_1.map(function (meta) {
                                var pid = meta.pid, sid = meta.sid;
                                return db.collection('activity')
                                    .where({
                                    pid: pid,
                                    sid: sid,
                                    isDeleted: false,
                                    isClosed: false
                                })
                                    .count();
                            }))];
                    case 1:
                        checks$ = _a.sent();
                        errorList_1 = [];
                        checks$.map(function (x, k) {
                            if (x.total > 0) {
                                errorList_1.push(dataMeta_1[k].title);
                            }
                        });
                        if (errorList_1.length > 0) {
                            return [2, hasErr(errorList_1.join('、') + " \u7279\u4EF7\u5DF2\u5B58\u5728")];
                        }
                        return [4, Promise.all(dataMeta_1.map(function (meta) {
                                return Promise.all([
                                    db.collection('activity')
                                        .add({
                                        data: meta
                                    }),
                                    db.collection('goods')
                                        .doc(meta.pid)
                                        .update({
                                        data: {
                                            updateTime: getNow(true)
                                        }
                                    })
                                ]);
                            }))];
                    case 2:
                        create$ = _a.sent();
                        return [2, ctx.body = {
                                status: 200
                            }];
                    case 3:
                        e_1 = _a.sent();
                        return [2, ctx.body = { status: 500 }];
                    case 4: return [2];
                }
            });
        }); });
        app.router('check-good-discount', function (ctx, next) { return __awaiter(void 0, void 0, void 0, function () {
            var list_1, hasErr, checks$, errorList_2, e_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        list_1 = event.data.list;
                        hasErr = function (message) { return ctx.body = {
                            message: message,
                            status: 500
                        }; };
                        return [4, Promise.all(list_1.map(function (meta) {
                                var pid = meta.pid, sid = meta.sid;
                                return db.collection('activity')
                                    .where({
                                    pid: pid,
                                    sid: sid,
                                    isDeleted: false
                                })
                                    .count();
                            }))];
                    case 1:
                        checks$ = _a.sent();
                        errorList_2 = [];
                        checks$.map(function (x, k) {
                            if (x.total > 0) {
                                errorList_2.push(list_1[k].title);
                            }
                        });
                        if (errorList_2.length > 0) {
                            return [2, hasErr(errorList_2.join('、') + "\u7279\u4EF7\u5DF2\u5B58\u5728")];
                        }
                        return [2, ctx.body = {
                                status: 200
                            }];
                    case 2:
                        e_2 = _a.sent();
                        return [2, ctx.body = { status: 500 }];
                    case 3: return [2];
                }
            });
        }); });
        app.router('good-discount-list', function (ctx, next) { return __awaiter(void 0, void 0, void 0, function () {
            var bjpConfig, limit, _a, isClosed, filterPass, where$, bjpConfig$, total$, data$, activities, goodsIds, sIds, goods$$, goods$_1, standars$$, standars$_1, bjpCount, notBjpActivies, result, e_3;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 6, , 7]);
                        bjpConfig = null;
                        limit = event.data.limit || 20;
                        _a = event.data, isClosed = _a.isClosed, filterPass = _a.filterPass;
                        where$ = {
                            isDeleted: false,
                            type: 'good_discount'
                        };
                        return [4, db.collection('app-config')
                                .where({
                                type: 'app-bjp-visible'
                            })
                                .get()];
                    case 1:
                        bjpConfig$ = _b.sent();
                        bjpConfig = bjpConfig$.data[0];
                        if (isClosed !== undefined) {
                            where$ = Object.assign({}, where$, {
                                isClosed: isClosed
                            });
                        }
                        if (!!filterPass) {
                            where$ = Object.assign({}, where$, {
                                endTime: _.gt(getNow(true))
                            });
                        }
                        return [4, db.collection('activity')
                                .where(where$)
                                .count()];
                    case 2:
                        total$ = _b.sent();
                        return [4, db.collection('activity')
                                .where(where$)
                                .limit(limit)
                                .skip((event.data.page - 1) * limit)
                                .orderBy('updatedTime', 'desc')
                                .get()];
                    case 3:
                        data$ = _b.sent();
                        activities = data$.data;
                        goodsIds = Array.from(new Set(activities.map(function (x) { return x.pid; }))).filter(function (x) { return !!x; });
                        sIds = Array.from(new Set(activities.map(function (x) { return x.sid; }))).filter(function (x) { return !!x; });
                        return [4, Promise.all(goodsIds.map(function (pid) {
                                return db.collection('goods')
                                    .doc(String(pid))
                                    .get();
                            }))];
                    case 4:
                        goods$$ = _b.sent();
                        goods$_1 = goods$$.map(function (x) { return x.data; });
                        return [4, Promise.all(sIds.map(function (sid) {
                                return db.collection('standards')
                                    .doc(String(sid))
                                    .get();
                            }))];
                    case 5:
                        standars$$ = _b.sent();
                        standars$_1 = standars$$.map(function (x) { return x.data; });
                        bjpCount = 0;
                        if (!!bjpConfig && !bjpConfig.value) {
                            notBjpActivies = activities
                                .filter(function (active) {
                                var pid = active.pid;
                                var good = goods$_1.find(function (x) { return x._id === pid; });
                                return !!good && String(good.category) !== '4';
                            });
                            bjpCount = activities.length - notBjpActivies.length;
                            activities = notBjpActivies;
                        }
                        result = activities.map(function (meta) {
                            var good = goods$_1.find(function (good$) {
                                return good$._id === meta.pid;
                            });
                            var standard = standars$_1.find(function (standar$) {
                                return standar$._id === meta.sid;
                            });
                            if (!!standard) {
                                good = Object.assign({}, good, {
                                    currentStandard: standard
                                });
                            }
                            ;
                            return Object.assign({}, meta, {
                                detail: good
                            });
                        });
                        return [2, ctx.body = {
                                status: 200,
                                data: {
                                    list: result,
                                    pagenation: {
                                        total: total$.total - bjpCount,
                                        pageSize: limit,
                                        page: event.data.page,
                                        totalPage: Math.ceil((total$.total - bjpCount) / limit)
                                    }
                                }
                            }];
                    case 6:
                        e_3 = _b.sent();
                        return [2, ctx.body = { status: 500 }];
                    case 7: return [2];
                }
            });
        }); });
        app.router('delete-good-discount', function (ctx, next) { return __awaiter(void 0, void 0, void 0, function () {
            var acid, e_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        acid = event.data.acid;
                        return [4, db.collection('activity')
                                .doc(String(acid))
                                .update({
                                data: {
                                    isDeleted: true
                                }
                            })];
                    case 1:
                        _a.sent();
                        return [2, ctx.body = {
                                status: 200
                            }];
                    case 2:
                        e_4 = _a.sent();
                        return [2, ctx.body = { status: 500 }];
                    case 3: return [2];
                }
            });
        }); });
        app.router('update-good-discount', function (ctx, next) { return __awaiter(void 0, void 0, void 0, function () {
            var _a, acid, pid, updateBody, e_5;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 3, , 4]);
                        _a = event.data, acid = _a.acid, pid = _a.pid;
                        updateBody = event.data;
                        delete updateBody.acid;
                        return [4, db.collection('activity')
                                .doc(acid)
                                .update({
                                data: Object.assign({}, updateBody, {
                                    updatedTime: getNow(true)
                                })
                            })];
                    case 1:
                        _b.sent();
                        return [4, db.collection('goods')
                                .doc(pid)
                                .update({
                                data: {
                                    updateTime: getNow(true)
                                }
                            })];
                    case 2:
                        _b.sent();
                        return [2, ctx.body = {
                                status: 200
                            }];
                    case 3:
                        e_5 = _b.sent();
                        return [2, ctx.body = { status: 500 }];
                    case 4: return [2];
                }
            });
        }); });
        return [2, app.serve()];
    });
}); };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLHFDQUF1QztBQUN2QyxzQ0FBd0M7QUFFeEMsS0FBSyxDQUFDLElBQUksQ0FBQztJQUNQLEdBQUcsRUFBRSxLQUFLLENBQUMsbUJBQW1CO0NBQ2pDLENBQUMsQ0FBQztBQUVILElBQU0sRUFBRSxHQUFnQixLQUFLLENBQUMsUUFBUSxFQUFHLENBQUM7QUFDMUMsSUFBTSxDQUFDLEdBQUcsRUFBRSxDQUFDLE9BQU8sQ0FBQztBQVFyQixJQUFNLE1BQU0sR0FBRyxVQUFFLEVBQVU7SUFBVixtQkFBQSxFQUFBLFVBQVU7SUFDdkIsSUFBSyxFQUFFLEVBQUc7UUFDTixPQUFPLElBQUksQ0FBQyxHQUFHLEVBQUcsQ0FBQztLQUN0QjtJQUNELElBQU0sTUFBTSxHQUFHLElBQUksSUFBSSxDQUFFLElBQUksSUFBSSxFQUFHLENBQUMsY0FBYyxFQUFHLENBQUMsQ0FBQztJQUN4RCxPQUFPLElBQUksSUFBSSxDQUFFLE1BQU0sQ0FBQyxPQUFPLEVBQUcsR0FBRyxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxJQUFJLENBQUUsQ0FBQTtBQUM3RCxDQUFDLENBQUE7QUFvQlksUUFBQSxJQUFJLEdBQUcsVUFBUSxLQUFLLEVBQUUsT0FBTzs7O1FBRWhDLEdBQUcsR0FBRyxJQUFJLFNBQVMsQ0FBQyxFQUFFLEtBQUssT0FBQSxFQUFFLENBQUMsQ0FBQztRQWVyQyxHQUFHLENBQUMsTUFBTSxDQUFDLHNCQUFzQixFQUFFLFVBQU8sR0FBRyxFQUFFLElBQUk7Ozs7Ozt3QkFHbkMsSUFBSSxHQUFLLEtBQUssQ0FBQyxJQUFJLEtBQWYsQ0FBZ0I7d0JBQ3RCLGFBQW1CLElBQUksQ0FBQyxHQUFHLENBQUUsVUFBQSxDQUFDLElBQUksT0FBQSxNQUFNLENBQUMsTUFBTSxDQUFD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QUV6QyxDQUFDLENBQUM7UUFFSCxXQUFPLEdBQUcsQ0FBQyxLQUFLLEVBQUcsRUFBQzs7S0FDdkIsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIGNsb3VkIGZyb20gJ3d4LXNlcnZlci1zZGsnO1xuaW1wb3J0ICogYXMgVGNiUm91dGVyIGZyb20gJ3RjYi1yb3V0ZXInO1xuXG5jbG91ZC5pbml0KHtcbiAgICBlbnY6IGNsb3VkLkRZTkFNSUNfQ1VSUkVOVF9FTlZcbn0pO1xuXG5jb25zdCBkYjogREIuRGF0YWJhc2UgPSBjbG91ZC5kYXRhYmFzZSggKTtcbmNvbnN0IF8gPSBkYi5jb21tYW5kO1xuXG4vKiogXG4gKiDovazmjaLmoLzmnpflsLzmsrvml7bljLogKzjml7bljLpcbiAqIERhdGUoKS5ub3coKSAvIG5ldyBEYXRlKCkuZ2V0VGltZSgpIOaYr+aXtuS4jeaXtuato+W4uOeahCs4XG4gKiBEYXRlLnRvTG9jYWxTdHJpbmcoICkg5aW95YOP5piv5LiA55u05pivKzDnmoRcbiAqIOWFiOaLv+WIsCArMO+8jOeEtuWQjis4XG4gKi9cbmNvbnN0IGdldE5vdyA9ICggdHMgPSBmYWxzZSApOiBhbnkgPT4ge1xuICAgIGlmICggdHMgKSB7XG4gICAgICAgIHJldHVybiBEYXRlLm5vdyggKTtcbiAgICB9XG4gICAgY29uc3QgdGltZV8wID0gbmV3IERhdGUoIG5ldyBEYXRlKCApLnRvTG9jYWxlU3RyaW5nKCApKTtcbiAgICByZXR1cm4gbmV3IERhdGUoIHRpbWVfMC5nZXRUaW1lKCApICsgOCAqIDYwICogNjAgKiAxMDAwIClcbn1cblxuLyoqXG4gKlxuICogQGRlc2NyaXB0aW9uIOWVhuWTgea0u+WKqOaooeWdl1xuICogISDigJzkuIDlj6Pku7figJ3vvJog5ZCM5LiA5ZWG5ZOB77yM5LiN5ZCM5Z6L5Y+36YO95Y+v5Lul5Y+C5Yqg77yM5LiA5Y+j5Lu35piv5Lul5Z6L5Y+35Li657u05bqm55qEXG4gKiAtLS0tLS0tLSDlrZfmrrUgLS0tLS0tLS0tLVxuICogdHlwZSDnsbvlnosgJ2dvb2RfZGlzY291bnQnXG4gKiBwaWRcbiAqIHNpZFxuICogdGl0bGUg5Z6L5Y+35ZCN56ewXG4gKiBzdG9jayjlj6/ml6ApXG4gKiBlbmRUaW1lXG4gKiBhY19wcmljZVxuICogYWNfZ3JvdXBQcmljZVxuICogY3JlYXRlZFRpbWVcbiAqIHVwZGF0ZWRUaW1lXG4gKiBpc0Nsb3NlZCDmmK/lkKblt7Lnu4/kuIrmnrZcbiAqIGlzRGVsZXRlZCDmmK/lkKblt7Lnu4/miYvliqjliKDpmaRcbiAqL1xuZXhwb3J0IGNvbnN0IG1haW4gPSBhc3luYyAoIGV2ZW50LCBjb250ZXh0ICkgPT4ge1xuXG4gICAgY29uc3QgYXBwID0gbmV3IFRjYlJvdXRlcih7IGV2ZW50IH0pO1xuXG4gICAgLyoqXG4gICAgICogQGRlc2NyaXB0aW9uXG4gICAgICog5Yib5bu6XG4gICAgICogbGlzdDoge1xuICAgICAgICAqIGFjX2dyb3VwUHJpY2VcbiAgICAgICAgKiBhY19wcmljZVxuICAgICAgICAqIGVuZFRpbWVcbiAgICAgICAgKiBwaWRcbiAgICAgICAgKiBzaWRcbiAgICAgICAgKiBzdG9ja1xuICAgICAgICAqIHRpdGxlXG4gICAgICogfVsgXVxuICAgICAqL1xuICAgIGFwcC5yb3V0ZXIoJ2NyZWF0ZS1nb29kLWRpc2NvdW50JywgYXN5bmMoIGN0eCwgbmV4dCApID0+IHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgY29uc3QgeyBsaXN0IH0gPSBldmVudC5kYXRhO1xuICAgICAgICAgICAgY29uc3QgZGF0YU1ldGE6IGFueVsgXSA9IGxpc3QubWFwKCB4ID0+IE9iamVjdC5hc3NpZ24oeyB9LCB4LCB7XG4gICAgICAgICAgICAgICAgaXNDbG9zZWQ6IHRydWUsXG4gICAgICAgICAgICAgICAgaXNEZWxldGVkOiBmYWxzZSxcbiAgICAgICAgICAgICAgICB0eXBlOiAnZ29vZF9kaXNjb3VudCcsXG4gICAgICAgICAgICAgICAgdXBkYXRlZFRpbWU6IGdldE5vdyggdHJ1ZSApLFxuICAgICAgICAgICAgICAgIGNyZWF0ZWRUaW1lOiBnZXROb3coIHRydWUgKVxuICAgICAgICAgICAgfSkpO1xuXG4gICAgICAgICAgICAvLyDplJnor6/lrprkuYlcbiAgICAgICAgICAgIGNvbnN0IGhhc0VyciA9IG1lc3NhZ2UgPT4gY3R4LmJvZHkgPSB7XG4gICAgICAgICAgICAgICAgbWVzc2FnZSxcbiAgICAgICAgICAgICAgICBzdGF0dXM6IDUwMFxuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgLy8g5Y676YeNXG4gICAgICAgICAgICBjb25zdCBjaGVja3MkOiBhbnkgPSBhd2FpdCBQcm9taXNlLmFsbCggZGF0YU1ldGEubWFwKCBtZXRhID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCB7IHBpZCwgc2lkIH0gPSBtZXRhO1xuICAgICAgICAgICAgICAgIHJldHVybiBkYi5jb2xsZWN0aW9uKCdhY3Rpdml0eScpXG4gICAgICAgICAgICAgICAgICAgIC53aGVyZSh7XG4gICAgICAgICAgICAgICAgICAgICAgICBwaWQsXG4gICAgICAgICAgICAgICAgICAgICAgICBzaWQsXG4gICAgICAgICAgICAgICAgICAgICAgICBpc0RlbGV0ZWQ6IGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICAgICAgaXNDbG9zZWQ6IGZhbHNlXG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgIC5jb3VudCggKVxuICAgICAgICAgICAgfSkpO1xuXG4gICAgICAgICAgICAvLyDljrvph43plJnor69cbiAgICAgICAgICAgIGNvbnN0IGVycm9yTGlzdDogc3RyaW5nW10gPSBbIF07XG4gICAgICAgICAgICBjaGVja3MkLm1hcCgoIHgsIGsgKSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKCAgeC50b3RhbCA+IDAgKSB7XG4gICAgICAgICAgICAgICAgICAgIGVycm9yTGlzdC5wdXNoKCBkYXRhTWV0YVsgayBdLnRpdGxlICk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIGlmICggZXJyb3JMaXN0Lmxlbmd0aCA+IDAgKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGhhc0VycihgJHtlcnJvckxpc3Quam9pbign44CBJyl9IOeJueS7t+W3suWtmOWcqGApO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyDmlrDlu7pcbiAgICAgICAgICAgIGNvbnN0IGNyZWF0ZSQgPSBhd2FpdCBQcm9taXNlLmFsbCggZGF0YU1ldGEubWFwKCBtZXRhID0+IHtcbiAgICAgICAgICAgICAgICByZXR1cm4gUHJvbWlzZS5hbGwoW1xuICAgICAgICAgICAgICAgICAgICBkYi5jb2xsZWN0aW9uKCdhY3Rpdml0eScpXG4gICAgICAgICAgICAgICAgICAgICAgICAuYWRkKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhOiBtZXRhXG4gICAgICAgICAgICAgICAgICAgICAgICB9KSxcbiAgICAgICAgICAgICAgICAgICAgZGIuY29sbGVjdGlvbignZ29vZHMnKVxuICAgICAgICAgICAgICAgICAgICAgICAgLmRvYyggbWV0YS5waWQgKVxuICAgICAgICAgICAgICAgICAgICAgICAgLnVwZGF0ZSh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB1cGRhdGVUaW1lOiBnZXROb3coIHRydWUgKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgXSlcbiAgICAgICAgICAgIH0pKTtcblxuICAgICAgICAgICAgcmV0dXJuIGN0eC5ib2R5ID0geyBcbiAgICAgICAgICAgICAgICBzdGF0dXM6IDIwMFxuICAgICAgICAgICAgfVxuICAgICAgICB9IGNhdGNoICggZSApIHtcbiAgICAgICAgICAgIHJldHVybiBjdHguYm9keSA9IHsgc3RhdHVzOiA1MDAgfTtcbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgLyoqXG4gICAgICogQGRlc2NyaXB0aW9uXG4gICAgICog5qOA5p+l5piv5ZCm5pyJ6YeN5aSNXG4gICAgICogbGlzdDoge1xuICAgICAgICAqIHBpZFxuICAgICAgICAqIHNpZCxcbiAgICAgICAgKiB0aXRsZVxuICAgICAqIH1bIF1cbiAgICAgKi9cbiAgICBhcHAucm91dGVyKCdjaGVjay1nb29kLWRpc2NvdW50JywgYXN5bmMoIGN0eCwgbmV4dCApID0+IHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgY29uc3QgeyBsaXN0IH0gPSBldmVudC5kYXRhO1xuXG4gICAgICAgICAgICAvLyDplJnor6/lrprkuYlcbiAgICAgICAgICAgIGNvbnN0IGhhc0VyciA9IG1lc3NhZ2UgPT4gY3R4LmJvZHkgPSB7XG4gICAgICAgICAgICAgICAgbWVzc2FnZSxcbiAgICAgICAgICAgICAgICBzdGF0dXM6IDUwMFxuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgLy8g5Y676YeNXG4gICAgICAgICAgICBjb25zdCBjaGVja3MkOiBhbnkgPSBhd2FpdCBQcm9taXNlLmFsbCggbGlzdC5tYXAoIG1ldGEgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IHsgcGlkLCBzaWQgfSA9IG1ldGE7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGRiLmNvbGxlY3Rpb24oJ2FjdGl2aXR5JylcbiAgICAgICAgICAgICAgICAgICAgLndoZXJlKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHBpZCxcbiAgICAgICAgICAgICAgICAgICAgICAgIHNpZCxcbiAgICAgICAgICAgICAgICAgICAgICAgIGlzRGVsZXRlZDogZmFsc2VcbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgLmNvdW50KCApXG4gICAgICAgICAgICB9KSk7XG5cbiAgICAgICAgICAgIC8vIOWOu+mHjemUmeivr1xuICAgICAgICAgICAgY29uc3QgZXJyb3JMaXN0OiBzdHJpbmdbIF0gPSBbIF07XG4gICAgICAgICAgICBjaGVja3MkLm1hcCgoIHgsIGsgKSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKCAgeC50b3RhbCA+IDAgKSB7XG4gICAgICAgICAgICAgICAgICAgIGVycm9yTGlzdC5wdXNoKCBsaXN0WyBrIF0udGl0bGUgKTtcbiAgICAgICAgICAgICAgICB9IFxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIGlmICggZXJyb3JMaXN0Lmxlbmd0aCA+IDAgKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGhhc0VycihgJHtlcnJvckxpc3Quam9pbign44CBJyl954m55Lu35bey5a2Y5ZyoYCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiBjdHguYm9keSA9IHsgXG4gICAgICAgICAgICAgICAgc3RhdHVzOiAyMDBcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBjYXRjaCAoIGUgKSB7XG4gICAgICAgICAgICByZXR1cm4gY3R4LmJvZHkgPSB7IHN0YXR1czogNTAwIH07XG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgIC8qKiBcbiAgICAgKiBAZGVzY3JpcHRpb25cbiAgICAgKiDliIbpobXmn6Xor6LigJzkuIDlj6Pku7figJ3mtLvliqjllYblk4HliJfooahcbiAgICAgKiB7XG4gICAgICogICAgIHBhZ2U6KOW/heWhqylcbiAgICAgKiAgICAgbGltaXRcbiAgICAgKiAgICAgZmlsdGVyQmpwOiBmYWxzZSB8IHRydWUgfCB1bmRlZmluZWQg77yIIOaYr+WQpui/h+a7pOS/neWBpeWTgSDvvIlcbiAgICAgKiAgICAgZmlsdGVyUGFzczogYm9vbGVhbiAo5piv5ZCm6L+H5ruk5o6J5bey6L+H5pyfIC0g5a6i5oi356uv6KaB6L+H5ruk5o6JKVxuICAgICAqICAgICBpc0Nsb3NlZDogdW5kZWZpbmVkIHwgdHJ1ZSB8IGZhbHNlXG4gICAgICogfVxuICAgICAqL1xuICAgIGFwcC5yb3V0ZXIoJ2dvb2QtZGlzY291bnQtbGlzdCcsIGFzeW5jKCBjdHgsIG5leHQgKSA9PiB7XG4gICAgICAgIHRyeSB7XG5cbiAgICAgICAgICAgIGxldCBianBDb25maWc6IGFueSA9IG51bGw7XG4gICAgICAgICAgICAvLyDmn6Xor6LmnaHmlbBcbiAgICAgICAgICAgIGNvbnN0IGxpbWl0ID0gZXZlbnQuZGF0YS5saW1pdCB8fCAyMDtcbiAgICAgICAgICAgIGNvbnN0IHsgaXNDbG9zZWQsIGZpbHRlclBhc3MgfSA9IGV2ZW50LmRhdGE7XG5cbiAgICAgICAgICAgIC8vIOafpeivouadoeS7tiAgICAgICAgICAgIFxuICAgICAgICAgICAgbGV0IHdoZXJlJCA9IHtcbiAgICAgICAgICAgICAgICBpc0RlbGV0ZWQ6IGZhbHNlLFxuICAgICAgICAgICAgICAgIHR5cGU6ICdnb29kX2Rpc2NvdW50J1xuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgLy8g5L+d5YGl5ZOB6YWN572uXG4gICAgICAgICAgICBjb25zdCBianBDb25maWckID0gYXdhaXQgZGIuY29sbGVjdGlvbignYXBwLWNvbmZpZycpXG4gICAgICAgICAgICAgICAgICAgIC53aGVyZSh7XG4gICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiAnYXBwLWJqcC12aXNpYmxlJ1xuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAuZ2V0KCApO1xuICAgICAgICAgICAgYmpwQ29uZmlnID0gYmpwQ29uZmlnJC5kYXRhWyAwIF07XG5cbiAgICAgICAgICAgIGlmICggaXNDbG9zZWQgIT09IHVuZGVmaW5lZCApIHtcbiAgICAgICAgICAgICAgICB3aGVyZSQgPSBPYmplY3QuYXNzaWduKHsgfSwgd2hlcmUkLCB7XG4gICAgICAgICAgICAgICAgICAgIGlzQ2xvc2VkXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICggISFmaWx0ZXJQYXNzICkge1xuICAgICAgICAgICAgICAgIHdoZXJlJCA9IE9iamVjdC5hc3NpZ24oeyB9LCB3aGVyZSQsIHtcbiAgICAgICAgICAgICAgICAgICAgZW5kVGltZTogXy5ndCggZ2V0Tm93KCB0cnVlICkpXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGNvbnN0IHRvdGFsJCA9IGF3YWl0IGRiLmNvbGxlY3Rpb24oJ2FjdGl2aXR5JylcbiAgICAgICAgICAgICAgICAud2hlcmUoIHdoZXJlJCApXG4gICAgICAgICAgICAgICAgLmNvdW50KCApO1xuICAgIFxuICAgICAgICAgICAgLy8g5p+l6K+i5rS75Yqo5ZWG5ZOB5YiX6KGoXG4gICAgICAgICAgICBjb25zdCBkYXRhJCA9IGF3YWl0IGRiLmNvbGxlY3Rpb24oJ2FjdGl2aXR5JylcbiAgICAgICAgICAgICAgICAud2hlcmUoIHdoZXJlJCApXG4gICAgICAgICAgICAgICAgLmxpbWl0KCBsaW1pdCApXG4gICAgICAgICAgICAgICAgLnNraXAoKCBldmVudC5kYXRhLnBhZ2UgLSAxICkgKiBsaW1pdCApXG4gICAgICAgICAgICAgICAgLm9yZGVyQnkoJ3VwZGF0ZWRUaW1lJywgJ2Rlc2MnKVxuICAgICAgICAgICAgICAgIC5nZXQoICk7XG5cbiAgICAgICAgICAgIGxldCBhY3Rpdml0aWVzID0gZGF0YSQuZGF0YTtcblxuICAgICAgICAgICAgLy8g5ZWG5ZOBaWTliJfooahcbiAgICAgICAgICAgIGNvbnN0IGdvb2RzSWRzID0gQXJyYXkuZnJvbShcbiAgICAgICAgICAgICAgICBuZXcgU2V0KCBhY3Rpdml0aWVzLm1hcCggeCA9PiB4LnBpZCApKVxuICAgICAgICAgICAgKS5maWx0ZXIoIHggPT4gISF4ICk7XG5cbiAgICAgICAgICAgIC8vIOWei+WPt2lk5YiX6KGoXG4gICAgICAgICAgICBjb25zdCBzSWRzID0gQXJyYXkuZnJvbShcbiAgICAgICAgICAgICAgICBuZXcgU2V0KCBhY3Rpdml0aWVzLm1hcCggeCA9PiB4LnNpZCApKVxuICAgICAgICAgICAgKS5maWx0ZXIoIHggPT4gISF4ICk7XG5cbiAgICAgICAgICAgIC8vIOafpeivouWVhuWTgeivpuaDhVxuICAgICAgICAgICAgY29uc3QgZ29vZHMkJCA9IGF3YWl0IFByb21pc2UuYWxsKCBnb29kc0lkcy5tYXAoIHBpZCA9PiB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGRiLmNvbGxlY3Rpb24oJ2dvb2RzJylcbiAgICAgICAgICAgICAgICAgICAgLmRvYyggU3RyaW5nKCBwaWQgKSlcbiAgICAgICAgICAgICAgICAgICAgLmdldCggKVxuICAgICAgICAgICAgfSkpO1xuICAgICAgICAgICAgY29uc3QgZ29vZHMkID0gZ29vZHMkJC5tYXAoIHggPT4geC5kYXRhICk7XG5cbiAgICAgICAgICAgIC8vIOafpeivouWei+WPt+ivpuaDhVxuICAgICAgICAgICAgY29uc3Qgc3RhbmRhcnMkJCA9IGF3YWl0IFByb21pc2UuYWxsKCBzSWRzLm1hcCggc2lkID0+IHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZGIuY29sbGVjdGlvbignc3RhbmRhcmRzJylcbiAgICAgICAgICAgICAgICAgICAgLmRvYyggU3RyaW5nKCBzaWQgKSlcbiAgICAgICAgICAgICAgICAgICAgLmdldCggKVxuICAgICAgICAgICAgfSkpO1xuXG4gICAgICAgICAgICBjb25zdCBzdGFuZGFycyQgPSBzdGFuZGFycyQkLm1hcCggeCA9PiB4LmRhdGEgKTtcblxuICAgICAgICAgICAgLy8g5p+l6K+i5L+d5YGl5ZOB5pWw6YeP44CB6L+H5ruk5L+d5YGl5ZOB5rS75YqoXG4gICAgICAgICAgICBsZXQgYmpwQ291bnQgPSAwO1xuICAgICAgICAgICAgaWYgKCAhIWJqcENvbmZpZyAmJiAhYmpwQ29uZmlnLnZhbHVlICkge1xuICAgICAgICAgICAgICAgIGNvbnN0IG5vdEJqcEFjdGl2aWVzID0gYWN0aXZpdGllc1xuICAgICAgICAgICAgICAgICAgICAuZmlsdGVyKCBhY3RpdmUgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgeyBwaWQgfSA9IGFjdGl2ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGdvb2QgPSBnb29kcyQuZmluZCggeCA9PiB4Ll9pZCA9PT0gcGlkICk7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gISFnb29kICYmIFN0cmluZyggZ29vZC5jYXRlZ29yeSApICE9PSAnNCdcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICBcbiAgICAgICAgICAgICAgICBianBDb3VudCA9IGFjdGl2aXRpZXMubGVuZ3RoIC0gbm90QmpwQWN0aXZpZXMubGVuZ3RoO1xuICAgICAgICAgICAgICAgIGFjdGl2aXRpZXMgPSBub3RCanBBY3Rpdmllc1xuICAgICAgICAgICAgfVxuXG5cbiAgICAgICAgICAgIC8vIOaVsOaNruWkhOeQhlxuICAgICAgICAgICAgY29uc3QgcmVzdWx0ID0gYWN0aXZpdGllcy5tYXAoIG1ldGEgPT4ge1xuXG4gICAgICAgICAgICAgICAgbGV0IGdvb2QgPSBnb29kcyQuZmluZCggZ29vZCQgPT4ge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZ29vZCQuX2lkID09PSBtZXRhLnBpZFxuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgY29uc3Qgc3RhbmRhcmQgPSBzdGFuZGFycyQuZmluZCggc3RhbmRhciQgPT4ge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gc3RhbmRhciQuX2lkID09PSBtZXRhLnNpZFxuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgaWYgKCAhIXN0YW5kYXJkICkge1xuICAgICAgICAgICAgICAgICAgICBnb29kID0gT2JqZWN0LmFzc2lnbih7IH0sIGdvb2QsIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGN1cnJlbnRTdGFuZGFyZDogc3RhbmRhcmRcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgICAgIHJldHVybiBPYmplY3QuYXNzaWduKHsgfSwgbWV0YSwge1xuICAgICAgICAgICAgICAgICAgICBkZXRhaWw6IGdvb2RcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICByZXR1cm4gY3R4LmJvZHkgPSB7XG4gICAgICAgICAgICAgICAgc3RhdHVzOiAyMDAsXG4gICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgICBsaXN0OiByZXN1bHQsXG4gICAgICAgICAgICAgICAgICAgIHBhZ2VuYXRpb246IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRvdGFsOiB0b3RhbCQudG90YWwgLSBianBDb3VudCxcbiAgICAgICAgICAgICAgICAgICAgICAgIHBhZ2VTaXplOiBsaW1pdCxcbiAgICAgICAgICAgICAgICAgICAgICAgIHBhZ2U6IGV2ZW50LmRhdGEucGFnZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHRvdGFsUGFnZTogTWF0aC5jZWlsKCggdG90YWwkLnRvdGFsIC0gYmpwQ291bnQgKSAvIGxpbWl0IClcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICB9IGNhdGNoICggZSApIHsgcmV0dXJuIGN0eC5ib2R5ID0geyBzdGF0dXM6IDUwMCB9O31cbiAgICB9KTtcblxuICAgIC8qKiBcbiAgICAgKiBAZGVzY3JpcHRpb24gXG4gICAgICog5omL5Yqo5Yig6Zmk5LiA5Liq5ZWG5ZOB5LiA5Y+j5Lu35rS75YqoXG4gICAgICovXG4gICAgYXBwLnJvdXRlcignZGVsZXRlLWdvb2QtZGlzY291bnQnLCBhc3luYyggY3R4LCBuZXh0ICkgPT4ge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgY29uc3QgeyBhY2lkIH0gPSBldmVudC5kYXRhO1xuICAgICAgICAgICAgYXdhaXQgZGIuY29sbGVjdGlvbignYWN0aXZpdHknKVxuICAgICAgICAgICAgICAgIC5kb2MoIFN0cmluZyggYWNpZCApKVxuICAgICAgICAgICAgICAgIC51cGRhdGUoe1xuICAgICAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpc0RlbGV0ZWQ6IHRydWVcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICByZXR1cm4gY3R4LmJvZHkgPSB7XG4gICAgICAgICAgICAgICAgc3RhdHVzOiAyMDBcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBjYXRjaCAoIGUgKSB7IHJldHVybiBjdHguYm9keSA9IHsgc3RhdHVzOiA1MDAgfTt9XG4gICAgfSk7XG5cbiAgICAvKiogXG4gICAgICogQGRlc2NyaXB0aW9uXG4gICAgICog5pu05paw5ZWG5ZOB5LiA5Y+j5Lu35rS75YqoXG4gICAgICog5YWo5a2X5q616YeM77yM5Lu75oSP5a2X5q61XG4gICAgICogYWNpZFxuICAgICAqL1xuICAgIGFwcC5yb3V0ZXIoJ3VwZGF0ZS1nb29kLWRpc2NvdW50JywgYXN5bmMoIGN0eCwgbmV4dCApID0+IHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGNvbnN0IHsgYWNpZCwgcGlkIH0gPSBldmVudC5kYXRhO1xuICAgICAgICAgICAgY29uc3QgdXBkYXRlQm9keSA9IGV2ZW50LmRhdGE7XG4gICAgICAgICAgICBkZWxldGUgdXBkYXRlQm9keS5hY2lkO1xuXG4gICAgICAgICAgICBhd2FpdCBkYi5jb2xsZWN0aW9uKCdhY3Rpdml0eScpXG4gICAgICAgICAgICAgICAgLmRvYyggYWNpZCApXG4gICAgICAgICAgICAgICAgLnVwZGF0ZSh7XG4gICAgICAgICAgICAgICAgICAgIGRhdGE6IE9iamVjdC5hc3NpZ24oeyB9LCB1cGRhdGVCb2R5LCB7XG4gICAgICAgICAgICAgICAgICAgICAgICB1cGRhdGVkVGltZTogZ2V0Tm93KCB0cnVlIClcbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgYXdhaXQgZGIuY29sbGVjdGlvbignZ29vZHMnKVxuICAgICAgICAgICAgICAgIC5kb2MoIHBpZCApXG4gICAgICAgICAgICAgICAgLnVwZGF0ZSh7XG4gICAgICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHVwZGF0ZVRpbWU6IGdldE5vdyggdHJ1ZSApXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgcmV0dXJuIGN0eC5ib2R5ID0ge1xuICAgICAgICAgICAgICAgIHN0YXR1czogMjAwXG4gICAgICAgICAgICB9O1xuXG4gICAgICAgIH0gY2F0Y2ggKCBlICkge1xuICAgICAgICAgICAgcmV0dXJuIGN0eC5ib2R5ID0geyBzdGF0dXM6IDUwMCB9O1xuICAgICAgICB9IFxuICAgIH0pO1xuXG4gICAgcmV0dXJuIGFwcC5zZXJ2ZSggKTtcbn0iXX0=