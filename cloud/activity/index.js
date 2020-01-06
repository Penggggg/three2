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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLHFDQUF1QztBQUN2QyxzQ0FBd0M7QUFFeEMsS0FBSyxDQUFDLElBQUksQ0FBQztJQUNQLEdBQUcsRUFBRSxPQUFPLENBQUMsR0FBRyxDQUFDLEtBQUs7Q0FDekIsQ0FBQyxDQUFDO0FBRUgsSUFBTSxFQUFFLEdBQWdCLEtBQUssQ0FBQyxRQUFRLEVBQUcsQ0FBQztBQUMxQyxJQUFNLENBQUMsR0FBRyxFQUFFLENBQUMsT0FBTyxDQUFDO0FBUXJCLElBQU0sTUFBTSxHQUFHLFVBQUUsRUFBVTtJQUFWLG1CQUFBLEVBQUEsVUFBVTtJQUN2QixJQUFLLEVBQUUsRUFBRztRQUNOLE9BQU8sSUFBSSxDQUFDLEdBQUcsRUFBRyxDQUFDO0tBQ3RCO0lBQ0QsSUFBTSxNQUFNLEdBQUcsSUFBSSxJQUFJLENBQUUsSUFBSSxJQUFJLEVBQUcsQ0FBQyxjQUFjLEVBQUcsQ0FBQyxDQUFDO0lBQ3hELE9BQU8sSUFBSSxJQUFJLENBQUUsTUFBTSxDQUFDLE9BQU8sRUFBRyxHQUFHLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLElBQUksQ0FBRSxDQUFBO0FBQzdELENBQUMsQ0FBQTtBQW9CWSxRQUFBLElBQUksR0FBRyxVQUFRLEtBQUssRUFBRSxPQUFPOzs7UUFFaEMsR0FBRyxHQUFHLElBQUksU0FBUyxDQUFDLEVBQUUsS0FBSyxPQUFBLEVBQUUsQ0FBQyxDQUFDO1FBZXJDLEdBQUcsQ0FBQyxNQUFNLENBQUMsc0JBQXNCLEVBQUUsVUFBTyxHQUFHLEVBQUUsSUFBSTs7Ozs7O3dCQUduQyxJQUFJLEdBQUssS0FBSyxDQUFDLElBQUksS0FBZixDQUFnQjt3QkFDdEIsYUFBbUIsSUFBSSxDQUFDLEdBQUcsQ0FBRSxVQUFBLENBQUMsSUFBSSxPQUFBLE1BQU0sQ0FBQyxN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QUFDOzs7O2FBRXpDLENBQUMsQ0FBQztRQUVILFdBQU8sR0FBRyxDQUFDLEtBQUssRUFBRyxFQUFDOztLQUN2QixDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgY2xvdWQgZnJvbSAnd3gtc2VydmVyLXNkayc7XG5pbXBvcnQgKiBhcyBUY2JSb3V0ZXIgZnJvbSAndGNiLXJvdXRlcic7XG5cbmNsb3VkLmluaXQoe1xuICAgIGVudjogcHJvY2Vzcy5lbnYuY2xvdWRcbn0pO1xuXG5jb25zdCBkYjogREIuRGF0YWJhc2UgPSBjbG91ZC5kYXRhYmFzZSggKTtcbmNvbnN0IF8gPSBkYi5jb21tYW5kO1xuXG4vKiogXG4gKiDovazmjaLmoLzmnpflsLzmsrvml7bljLogKzjml7bljLpcbiAqIERhdGUoKS5ub3coKSAvIG5ldyBEYXRlKCkuZ2V0VGltZSgpIOaYr+aXtuS4jeaXtuato+W4uOeahCs4XG4gKiBEYXRlLnRvTG9jYWxTdHJpbmcoICkg5aW95YOP5piv5LiA55u05pivKzDnmoRcbiAqIOWFiOaLv+WIsCArMO+8jOeEtuWQjis4XG4gKi9cbmNvbnN0IGdldE5vdyA9ICggdHMgPSBmYWxzZSApOiBhbnkgPT4ge1xuICAgIGlmICggdHMgKSB7XG4gICAgICAgIHJldHVybiBEYXRlLm5vdyggKTtcbiAgICB9XG4gICAgY29uc3QgdGltZV8wID0gbmV3IERhdGUoIG5ldyBEYXRlKCApLnRvTG9jYWxlU3RyaW5nKCApKTtcbiAgICByZXR1cm4gbmV3IERhdGUoIHRpbWVfMC5nZXRUaW1lKCApICsgOCAqIDYwICogNjAgKiAxMDAwIClcbn1cblxuLyoqXG4gKlxuICogQGRlc2NyaXB0aW9uIOWVhuWTgea0u+WKqOaooeWdl1xuICogISDigJzkuIDlj6Pku7figJ3vvJog5ZCM5LiA5ZWG5ZOB77yM5LiN5ZCM5Z6L5Y+36YO95Y+v5Lul5Y+C5Yqg77yM5LiA5Y+j5Lu35piv5Lul5Z6L5Y+35Li657u05bqm55qEXG4gKiAtLS0tLS0tLSDlrZfmrrUgLS0tLS0tLS0tLVxuICogdHlwZSDnsbvlnosgJ2dvb2RfZGlzY291bnQnXG4gKiBwaWRcbiAqIHNpZFxuICogdGl0bGUg5Z6L5Y+35ZCN56ewXG4gKiBzdG9jayjlj6/ml6ApXG4gKiBlbmRUaW1lXG4gKiBhY19wcmljZVxuICogYWNfZ3JvdXBQcmljZVxuICogY3JlYXRlZFRpbWVcbiAqIHVwZGF0ZWRUaW1lXG4gKiBpc0Nsb3NlZCDmmK/lkKblt7Lnu4/kuIrmnrZcbiAqIGlzRGVsZXRlZCDmmK/lkKblt7Lnu4/miYvliqjliKDpmaRcbiAqL1xuZXhwb3J0IGNvbnN0IG1haW4gPSBhc3luYyAoIGV2ZW50LCBjb250ZXh0ICkgPT4ge1xuXG4gICAgY29uc3QgYXBwID0gbmV3IFRjYlJvdXRlcih7IGV2ZW50IH0pO1xuXG4gICAgLyoqXG4gICAgICogQGRlc2NyaXB0aW9uXG4gICAgICog5Yib5bu6XG4gICAgICogbGlzdDoge1xuICAgICAgICAqIGFjX2dyb3VwUHJpY2VcbiAgICAgICAgKiBhY19wcmljZVxuICAgICAgICAqIGVuZFRpbWVcbiAgICAgICAgKiBwaWRcbiAgICAgICAgKiBzaWRcbiAgICAgICAgKiBzdG9ja1xuICAgICAgICAqIHRpdGxlXG4gICAgICogfVsgXVxuICAgICAqL1xuICAgIGFwcC5yb3V0ZXIoJ2NyZWF0ZS1nb29kLWRpc2NvdW50JywgYXN5bmMoIGN0eCwgbmV4dCApID0+IHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgY29uc3QgeyBsaXN0IH0gPSBldmVudC5kYXRhO1xuICAgICAgICAgICAgY29uc3QgZGF0YU1ldGE6IGFueVsgXSA9IGxpc3QubWFwKCB4ID0+IE9iamVjdC5hc3NpZ24oeyB9LCB4LCB7XG4gICAgICAgICAgICAgICAgaXNDbG9zZWQ6IHRydWUsXG4gICAgICAgICAgICAgICAgaXNEZWxldGVkOiBmYWxzZSxcbiAgICAgICAgICAgICAgICB0eXBlOiAnZ29vZF9kaXNjb3VudCcsXG4gICAgICAgICAgICAgICAgdXBkYXRlZFRpbWU6IGdldE5vdyggdHJ1ZSApLFxuICAgICAgICAgICAgICAgIGNyZWF0ZWRUaW1lOiBnZXROb3coIHRydWUgKVxuICAgICAgICAgICAgfSkpO1xuXG4gICAgICAgICAgICAvLyDplJnor6/lrprkuYlcbiAgICAgICAgICAgIGNvbnN0IGhhc0VyciA9IG1lc3NhZ2UgPT4gY3R4LmJvZHkgPSB7XG4gICAgICAgICAgICAgICAgbWVzc2FnZSxcbiAgICAgICAgICAgICAgICBzdGF0dXM6IDUwMFxuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgLy8g5Y676YeNXG4gICAgICAgICAgICBjb25zdCBjaGVja3MkOiBhbnkgPSBhd2FpdCBQcm9taXNlLmFsbCggZGF0YU1ldGEubWFwKCBtZXRhID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCB7IHBpZCwgc2lkIH0gPSBtZXRhO1xuICAgICAgICAgICAgICAgIHJldHVybiBkYi5jb2xsZWN0aW9uKCdhY3Rpdml0eScpXG4gICAgICAgICAgICAgICAgICAgIC53aGVyZSh7XG4gICAgICAgICAgICAgICAgICAgICAgICBwaWQsXG4gICAgICAgICAgICAgICAgICAgICAgICBzaWQsXG4gICAgICAgICAgICAgICAgICAgICAgICBpc0RlbGV0ZWQ6IGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICAgICAgaXNDbG9zZWQ6IGZhbHNlXG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgIC5jb3VudCggKVxuICAgICAgICAgICAgfSkpO1xuXG4gICAgICAgICAgICAvLyDljrvph43plJnor69cbiAgICAgICAgICAgIGNvbnN0IGVycm9yTGlzdDogc3RyaW5nW10gPSBbIF07XG4gICAgICAgICAgICBjaGVja3MkLm1hcCgoIHgsIGsgKSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKCAgeC50b3RhbCA+IDAgKSB7XG4gICAgICAgICAgICAgICAgICAgIGVycm9yTGlzdC5wdXNoKCBkYXRhTWV0YVsgayBdLnRpdGxlICk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIGlmICggZXJyb3JMaXN0Lmxlbmd0aCA+IDAgKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGhhc0VycihgJHtlcnJvckxpc3Quam9pbign44CBJyl9IOeJueS7t+W3suWtmOWcqGApO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyDmlrDlu7pcbiAgICAgICAgICAgIGNvbnN0IGNyZWF0ZSQgPSBhd2FpdCBQcm9taXNlLmFsbCggZGF0YU1ldGEubWFwKCBtZXRhID0+IHtcbiAgICAgICAgICAgICAgICByZXR1cm4gUHJvbWlzZS5hbGwoW1xuICAgICAgICAgICAgICAgICAgICBkYi5jb2xsZWN0aW9uKCdhY3Rpdml0eScpXG4gICAgICAgICAgICAgICAgICAgICAgICAuYWRkKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhOiBtZXRhXG4gICAgICAgICAgICAgICAgICAgICAgICB9KSxcbiAgICAgICAgICAgICAgICAgICAgZGIuY29sbGVjdGlvbignZ29vZHMnKVxuICAgICAgICAgICAgICAgICAgICAgICAgLmRvYyggbWV0YS5waWQgKVxuICAgICAgICAgICAgICAgICAgICAgICAgLnVwZGF0ZSh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB1cGRhdGVUaW1lOiBnZXROb3coIHRydWUgKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgXSlcbiAgICAgICAgICAgIH0pKTtcblxuICAgICAgICAgICAgcmV0dXJuIGN0eC5ib2R5ID0geyBcbiAgICAgICAgICAgICAgICBzdGF0dXM6IDIwMFxuICAgICAgICAgICAgfVxuICAgICAgICB9IGNhdGNoICggZSApIHtcbiAgICAgICAgICAgIHJldHVybiBjdHguYm9keSA9IHsgc3RhdHVzOiA1MDAgfTtcbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgLyoqXG4gICAgICogQGRlc2NyaXB0aW9uXG4gICAgICog5qOA5p+l5piv5ZCm5pyJ6YeN5aSNXG4gICAgICogbGlzdDoge1xuICAgICAgICAqIHBpZFxuICAgICAgICAqIHNpZCxcbiAgICAgICAgKiB0aXRsZVxuICAgICAqIH1bIF1cbiAgICAgKi9cbiAgICBhcHAucm91dGVyKCdjaGVjay1nb29kLWRpc2NvdW50JywgYXN5bmMoIGN0eCwgbmV4dCApID0+IHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgY29uc3QgeyBsaXN0IH0gPSBldmVudC5kYXRhO1xuXG4gICAgICAgICAgICAvLyDplJnor6/lrprkuYlcbiAgICAgICAgICAgIGNvbnN0IGhhc0VyciA9IG1lc3NhZ2UgPT4gY3R4LmJvZHkgPSB7XG4gICAgICAgICAgICAgICAgbWVzc2FnZSxcbiAgICAgICAgICAgICAgICBzdGF0dXM6IDUwMFxuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgLy8g5Y676YeNXG4gICAgICAgICAgICBjb25zdCBjaGVja3MkOiBhbnkgPSBhd2FpdCBQcm9taXNlLmFsbCggbGlzdC5tYXAoIG1ldGEgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IHsgcGlkLCBzaWQgfSA9IG1ldGE7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGRiLmNvbGxlY3Rpb24oJ2FjdGl2aXR5JylcbiAgICAgICAgICAgICAgICAgICAgLndoZXJlKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHBpZCxcbiAgICAgICAgICAgICAgICAgICAgICAgIHNpZCxcbiAgICAgICAgICAgICAgICAgICAgICAgIGlzRGVsZXRlZDogZmFsc2VcbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgLmNvdW50KCApXG4gICAgICAgICAgICB9KSk7XG5cbiAgICAgICAgICAgIC8vIOWOu+mHjemUmeivr1xuICAgICAgICAgICAgY29uc3QgZXJyb3JMaXN0OiBzdHJpbmdbIF0gPSBbIF07XG4gICAgICAgICAgICBjaGVja3MkLm1hcCgoIHgsIGsgKSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKCAgeC50b3RhbCA+IDAgKSB7XG4gICAgICAgICAgICAgICAgICAgIGVycm9yTGlzdC5wdXNoKCBsaXN0WyBrIF0udGl0bGUgKTtcbiAgICAgICAgICAgICAgICB9IFxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIGlmICggZXJyb3JMaXN0Lmxlbmd0aCA+IDAgKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGhhc0VycihgJHtlcnJvckxpc3Quam9pbign44CBJyl954m55Lu35bey5a2Y5ZyoYCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiBjdHguYm9keSA9IHsgXG4gICAgICAgICAgICAgICAgc3RhdHVzOiAyMDBcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBjYXRjaCAoIGUgKSB7XG4gICAgICAgICAgICByZXR1cm4gY3R4LmJvZHkgPSB7IHN0YXR1czogNTAwIH07XG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgIC8qKiBcbiAgICAgKiBAZGVzY3JpcHRpb25cbiAgICAgKiDliIbpobXmn6Xor6LigJzkuIDlj6Pku7figJ3mtLvliqjllYblk4HliJfooahcbiAgICAgKiB7XG4gICAgICogICAgIHBhZ2U6KOW/heWhqylcbiAgICAgKiAgICAgbGltaXRcbiAgICAgKiAgICAgZmlsdGVyQmpwOiBmYWxzZSB8IHRydWUgfCB1bmRlZmluZWQg77yIIOaYr+WQpui/h+a7pOS/neWBpeWTgSDvvIlcbiAgICAgKiAgICAgZmlsdGVyUGFzczogYm9vbGVhbiAo5piv5ZCm6L+H5ruk5o6J5bey6L+H5pyfIC0g5a6i5oi356uv6KaB6L+H5ruk5o6JKVxuICAgICAqICAgICBpc0Nsb3NlZDogdW5kZWZpbmVkIHwgdHJ1ZSB8IGZhbHNlXG4gICAgICogfVxuICAgICAqL1xuICAgIGFwcC5yb3V0ZXIoJ2dvb2QtZGlzY291bnQtbGlzdCcsIGFzeW5jKCBjdHgsIG5leHQgKSA9PiB7XG4gICAgICAgIHRyeSB7XG5cbiAgICAgICAgICAgIGxldCBianBDb25maWc6IGFueSA9IG51bGw7XG4gICAgICAgICAgICAvLyDmn6Xor6LmnaHmlbBcbiAgICAgICAgICAgIGNvbnN0IGxpbWl0ID0gZXZlbnQuZGF0YS5saW1pdCB8fCAyMDtcbiAgICAgICAgICAgIGNvbnN0IHsgaXNDbG9zZWQsIGZpbHRlclBhc3MgfSA9IGV2ZW50LmRhdGE7XG5cbiAgICAgICAgICAgIC8vIOafpeivouadoeS7tiAgICAgICAgICAgIFxuICAgICAgICAgICAgbGV0IHdoZXJlJCA9IHtcbiAgICAgICAgICAgICAgICBpc0RlbGV0ZWQ6IGZhbHNlLFxuICAgICAgICAgICAgICAgIHR5cGU6ICdnb29kX2Rpc2NvdW50J1xuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgLy8g5L+d5YGl5ZOB6YWN572uXG4gICAgICAgICAgICBjb25zdCBianBDb25maWckID0gYXdhaXQgZGIuY29sbGVjdGlvbignYXBwLWNvbmZpZycpXG4gICAgICAgICAgICAgICAgICAgIC53aGVyZSh7XG4gICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiAnYXBwLWJqcC12aXNpYmxlJ1xuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAuZ2V0KCApO1xuICAgICAgICAgICAgYmpwQ29uZmlnID0gYmpwQ29uZmlnJC5kYXRhWyAwIF07XG5cbiAgICAgICAgICAgIGlmICggaXNDbG9zZWQgIT09IHVuZGVmaW5lZCApIHtcbiAgICAgICAgICAgICAgICB3aGVyZSQgPSBPYmplY3QuYXNzaWduKHsgfSwgd2hlcmUkLCB7XG4gICAgICAgICAgICAgICAgICAgIGlzQ2xvc2VkXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICggISFmaWx0ZXJQYXNzICkge1xuICAgICAgICAgICAgICAgIHdoZXJlJCA9IE9iamVjdC5hc3NpZ24oeyB9LCB3aGVyZSQsIHtcbiAgICAgICAgICAgICAgICAgICAgZW5kVGltZTogXy5ndCggZ2V0Tm93KCB0cnVlICkpXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGNvbnN0IHRvdGFsJCA9IGF3YWl0IGRiLmNvbGxlY3Rpb24oJ2FjdGl2aXR5JylcbiAgICAgICAgICAgICAgICAud2hlcmUoIHdoZXJlJCApXG4gICAgICAgICAgICAgICAgLmNvdW50KCApO1xuICAgIFxuICAgICAgICAgICAgLy8g5p+l6K+i5rS75Yqo5ZWG5ZOB5YiX6KGoXG4gICAgICAgICAgICBjb25zdCBkYXRhJCA9IGF3YWl0IGRiLmNvbGxlY3Rpb24oJ2FjdGl2aXR5JylcbiAgICAgICAgICAgICAgICAud2hlcmUoIHdoZXJlJCApXG4gICAgICAgICAgICAgICAgLmxpbWl0KCBsaW1pdCApXG4gICAgICAgICAgICAgICAgLnNraXAoKCBldmVudC5kYXRhLnBhZ2UgLSAxICkgKiBsaW1pdCApXG4gICAgICAgICAgICAgICAgLm9yZGVyQnkoJ3VwZGF0ZWRUaW1lJywgJ2Rlc2MnKVxuICAgICAgICAgICAgICAgIC5nZXQoICk7XG5cbiAgICAgICAgICAgIGxldCBhY3Rpdml0aWVzID0gZGF0YSQuZGF0YTtcblxuICAgICAgICAgICAgLy8g5ZWG5ZOBaWTliJfooahcbiAgICAgICAgICAgIGNvbnN0IGdvb2RzSWRzID0gQXJyYXkuZnJvbShcbiAgICAgICAgICAgICAgICBuZXcgU2V0KCBhY3Rpdml0aWVzLm1hcCggeCA9PiB4LnBpZCApKVxuICAgICAgICAgICAgKS5maWx0ZXIoIHggPT4gISF4ICk7XG5cbiAgICAgICAgICAgIC8vIOWei+WPt2lk5YiX6KGoXG4gICAgICAgICAgICBjb25zdCBzSWRzID0gQXJyYXkuZnJvbShcbiAgICAgICAgICAgICAgICBuZXcgU2V0KCBhY3Rpdml0aWVzLm1hcCggeCA9PiB4LnNpZCApKVxuICAgICAgICAgICAgKS5maWx0ZXIoIHggPT4gISF4ICk7XG5cbiAgICAgICAgICAgIC8vIOafpeivouWVhuWTgeivpuaDhVxuICAgICAgICAgICAgY29uc3QgZ29vZHMkJCA9IGF3YWl0IFByb21pc2UuYWxsKCBnb29kc0lkcy5tYXAoIHBpZCA9PiB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGRiLmNvbGxlY3Rpb24oJ2dvb2RzJylcbiAgICAgICAgICAgICAgICAgICAgLmRvYyggU3RyaW5nKCBwaWQgKSlcbiAgICAgICAgICAgICAgICAgICAgLmdldCggKVxuICAgICAgICAgICAgfSkpO1xuICAgICAgICAgICAgY29uc3QgZ29vZHMkID0gZ29vZHMkJC5tYXAoIHggPT4geC5kYXRhICk7XG5cbiAgICAgICAgICAgIC8vIOafpeivouWei+WPt+ivpuaDhVxuICAgICAgICAgICAgY29uc3Qgc3RhbmRhcnMkJCA9IGF3YWl0IFByb21pc2UuYWxsKCBzSWRzLm1hcCggc2lkID0+IHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZGIuY29sbGVjdGlvbignc3RhbmRhcmRzJylcbiAgICAgICAgICAgICAgICAgICAgLmRvYyggU3RyaW5nKCBzaWQgKSlcbiAgICAgICAgICAgICAgICAgICAgLmdldCggKVxuICAgICAgICAgICAgfSkpO1xuXG4gICAgICAgICAgICBjb25zdCBzdGFuZGFycyQgPSBzdGFuZGFycyQkLm1hcCggeCA9PiB4LmRhdGEgKTtcblxuICAgICAgICAgICAgLy8g5p+l6K+i5L+d5YGl5ZOB5pWw6YeP44CB6L+H5ruk5L+d5YGl5ZOB5rS75YqoXG4gICAgICAgICAgICBsZXQgYmpwQ291bnQgPSAwO1xuICAgICAgICAgICAgaWYgKCAhIWJqcENvbmZpZyAmJiAhYmpwQ29uZmlnLnZhbHVlICkge1xuICAgICAgICAgICAgICAgIGNvbnN0IG5vdEJqcEFjdGl2aWVzID0gYWN0aXZpdGllc1xuICAgICAgICAgICAgICAgICAgICAuZmlsdGVyKCBhY3RpdmUgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgeyBwaWQgfSA9IGFjdGl2ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGdvb2QgPSBnb29kcyQuZmluZCggeCA9PiB4Ll9pZCA9PT0gcGlkICk7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gISFnb29kICYmIFN0cmluZyggZ29vZC5jYXRlZ29yeSApICE9PSAnNCdcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICBcbiAgICAgICAgICAgICAgICBianBDb3VudCA9IGFjdGl2aXRpZXMubGVuZ3RoIC0gbm90QmpwQWN0aXZpZXMubGVuZ3RoO1xuICAgICAgICAgICAgICAgIGFjdGl2aXRpZXMgPSBub3RCanBBY3Rpdmllc1xuICAgICAgICAgICAgfVxuXG5cbiAgICAgICAgICAgIC8vIOaVsOaNruWkhOeQhlxuICAgICAgICAgICAgY29uc3QgcmVzdWx0ID0gYWN0aXZpdGllcy5tYXAoIG1ldGEgPT4ge1xuXG4gICAgICAgICAgICAgICAgbGV0IGdvb2QgPSBnb29kcyQuZmluZCggZ29vZCQgPT4ge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZ29vZCQuX2lkID09PSBtZXRhLnBpZFxuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgY29uc3Qgc3RhbmRhcmQgPSBzdGFuZGFycyQuZmluZCggc3RhbmRhciQgPT4ge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gc3RhbmRhciQuX2lkID09PSBtZXRhLnNpZFxuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgaWYgKCAhIXN0YW5kYXJkICkge1xuICAgICAgICAgICAgICAgICAgICBnb29kID0gT2JqZWN0LmFzc2lnbih7IH0sIGdvb2QsIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGN1cnJlbnRTdGFuZGFyZDogc3RhbmRhcmRcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgICAgIHJldHVybiBPYmplY3QuYXNzaWduKHsgfSwgbWV0YSwge1xuICAgICAgICAgICAgICAgICAgICBkZXRhaWw6IGdvb2RcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICByZXR1cm4gY3R4LmJvZHkgPSB7XG4gICAgICAgICAgICAgICAgc3RhdHVzOiAyMDAsXG4gICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgICBsaXN0OiByZXN1bHQsXG4gICAgICAgICAgICAgICAgICAgIHBhZ2VuYXRpb246IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRvdGFsOiB0b3RhbCQudG90YWwgLSBianBDb3VudCxcbiAgICAgICAgICAgICAgICAgICAgICAgIHBhZ2VTaXplOiBsaW1pdCxcbiAgICAgICAgICAgICAgICAgICAgICAgIHBhZ2U6IGV2ZW50LmRhdGEucGFnZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHRvdGFsUGFnZTogTWF0aC5jZWlsKCggdG90YWwkLnRvdGFsIC0gYmpwQ291bnQgKSAvIGxpbWl0IClcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICB9IGNhdGNoICggZSApIHsgcmV0dXJuIGN0eC5ib2R5ID0geyBzdGF0dXM6IDUwMCB9O31cbiAgICB9KTtcblxuICAgIC8qKiBcbiAgICAgKiBAZGVzY3JpcHRpb24gXG4gICAgICog5omL5Yqo5Yig6Zmk5LiA5Liq5ZWG5ZOB5LiA5Y+j5Lu35rS75YqoXG4gICAgICovXG4gICAgYXBwLnJvdXRlcignZGVsZXRlLWdvb2QtZGlzY291bnQnLCBhc3luYyggY3R4LCBuZXh0ICkgPT4ge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgY29uc3QgeyBhY2lkIH0gPSBldmVudC5kYXRhO1xuICAgICAgICAgICAgYXdhaXQgZGIuY29sbGVjdGlvbignYWN0aXZpdHknKVxuICAgICAgICAgICAgICAgIC5kb2MoIFN0cmluZyggYWNpZCApKVxuICAgICAgICAgICAgICAgIC51cGRhdGUoe1xuICAgICAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpc0RlbGV0ZWQ6IHRydWVcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICByZXR1cm4gY3R4LmJvZHkgPSB7XG4gICAgICAgICAgICAgICAgc3RhdHVzOiAyMDBcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBjYXRjaCAoIGUgKSB7IHJldHVybiBjdHguYm9keSA9IHsgc3RhdHVzOiA1MDAgfTt9XG4gICAgfSk7XG5cbiAgICAvKiogXG4gICAgICogQGRlc2NyaXB0aW9uXG4gICAgICog5pu05paw5ZWG5ZOB5LiA5Y+j5Lu35rS75YqoXG4gICAgICog5YWo5a2X5q616YeM77yM5Lu75oSP5a2X5q61XG4gICAgICogYWNpZFxuICAgICAqL1xuICAgIGFwcC5yb3V0ZXIoJ3VwZGF0ZS1nb29kLWRpc2NvdW50JywgYXN5bmMoIGN0eCwgbmV4dCApID0+IHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGNvbnN0IHsgYWNpZCwgcGlkIH0gPSBldmVudC5kYXRhO1xuICAgICAgICAgICAgY29uc3QgdXBkYXRlQm9keSA9IGV2ZW50LmRhdGE7XG4gICAgICAgICAgICBkZWxldGUgdXBkYXRlQm9keS5hY2lkO1xuXG4gICAgICAgICAgICBhd2FpdCBkYi5jb2xsZWN0aW9uKCdhY3Rpdml0eScpXG4gICAgICAgICAgICAgICAgLmRvYyggYWNpZCApXG4gICAgICAgICAgICAgICAgLnVwZGF0ZSh7XG4gICAgICAgICAgICAgICAgICAgIGRhdGE6IE9iamVjdC5hc3NpZ24oeyB9LCB1cGRhdGVCb2R5LCB7XG4gICAgICAgICAgICAgICAgICAgICAgICB1cGRhdGVkVGltZTogZ2V0Tm93KCB0cnVlIClcbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgYXdhaXQgZGIuY29sbGVjdGlvbignZ29vZHMnKVxuICAgICAgICAgICAgICAgIC5kb2MoIHBpZCApXG4gICAgICAgICAgICAgICAgLnVwZGF0ZSh7XG4gICAgICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHVwZGF0ZVRpbWU6IGdldE5vdyggdHJ1ZSApXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgcmV0dXJuIGN0eC5ib2R5ID0ge1xuICAgICAgICAgICAgICAgIHN0YXR1czogMjAwXG4gICAgICAgICAgICB9O1xuXG4gICAgICAgIH0gY2F0Y2ggKCBlICkge1xuICAgICAgICAgICAgcmV0dXJuIGN0eC5ib2R5ID0geyBzdGF0dXM6IDUwMCB9O1xuICAgICAgICB9IFxuICAgIH0pO1xuXG4gICAgcmV0dXJuIGFwcC5zZXJ2ZSggKTtcbn0iXX0=