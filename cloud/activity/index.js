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
exports.main = function (event, context) { return __awaiter(_this, void 0, void 0, function () {
    var app;
    var _this = this;
    return __generator(this, function (_a) {
        app = new TcbRouter({ event: event });
        app.router('create-good-discount', function (ctx, next) { return __awaiter(_this, void 0, void 0, function () {
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
        app.router('check-good-discount', function (ctx, next) { return __awaiter(_this, void 0, void 0, function () {
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
        app.router('good-discount-list', function (ctx, next) { return __awaiter(_this, void 0, void 0, function () {
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
        app.router('delete-good-discount', function (ctx, next) { return __awaiter(_this, void 0, void 0, function () {
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
        app.router('update-good-discount', function (ctx, next) { return __awaiter(_this, void 0, void 0, function () {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSxpQkF5WEM7O0FBelhELHFDQUF1QztBQUN2QyxzQ0FBd0M7QUFFeEMsS0FBSyxDQUFDLElBQUksQ0FBQztJQUNQLEdBQUcsRUFBRSxPQUFPLENBQUMsR0FBRyxDQUFDLEtBQUs7Q0FDekIsQ0FBQyxDQUFDO0FBRUgsSUFBTSxFQUFFLEdBQWdCLEtBQUssQ0FBQyxRQUFRLEVBQUcsQ0FBQztBQUMxQyxJQUFNLENBQUMsR0FBRyxFQUFFLENBQUMsT0FBTyxDQUFDO0FBUXJCLElBQU0sTUFBTSxHQUFHLFVBQUUsRUFBVTtJQUFWLG1CQUFBLEVBQUEsVUFBVTtJQUN2QixJQUFLLEVBQUUsRUFBRztRQUNOLE9BQU8sSUFBSSxDQUFDLEdBQUcsRUFBRyxDQUFDO0tBQ3RCO0lBQ0QsSUFBTSxNQUFNLEdBQUcsSUFBSSxJQUFJLENBQUUsSUFBSSxJQUFJLEVBQUcsQ0FBQyxjQUFjLEVBQUcsQ0FBQyxDQUFDO0lBQ3hELE9BQU8sSUFBSSxJQUFJLENBQUUsTUFBTSxDQUFDLE9BQU8sRUFBRyxHQUFHLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLElBQUksQ0FBRSxDQUFBO0FBQzdELENBQUMsQ0FBQTtBQW9CWSxRQUFBLElBQUksR0FBRyxVQUFRLEtBQUssRUFBRSxPQUFPOzs7O1FBRWhDLEdBQUcsR0FBRyxJQUFJLFNBQVMsQ0FBQyxFQUFFLEtBQUssT0FBQSxFQUFFLENBQUMsQ0FBQztRQWVyQyxHQUFHLENBQUMsTUFBTSxDQUFDLHNCQUFzQixFQUFFLFVBQU8sR0FBRyxFQUFFLElBQUk7Ozs7Ozt3QkFHbkMsSUFBSSxHQUFLLEtBQUssQ0FBQyxJQUFJLEtBQWYsQ0FBZ0I7d0JBQ3RCLGFBQW1CLElBQUksQ0FBQyxHQUFHLENBQUUsVUFBQSxDQUFDLElBQUksT0FB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RSxHQUFHLEVBQUUsRUFBQzs7OzthQUV6QyxDQUFDLENBQUM7UUFFSCxXQUFPLEdBQUcsQ0FBQyxLQUFLLEVBQUcsRUFBQzs7S0FDdkIsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIGNsb3VkIGZyb20gJ3d4LXNlcnZlci1zZGsnO1xuaW1wb3J0ICogYXMgVGNiUm91dGVyIGZyb20gJ3RjYi1yb3V0ZXInO1xuXG5jbG91ZC5pbml0KHtcbiAgICBlbnY6IHByb2Nlc3MuZW52LmNsb3VkXG59KTtcblxuY29uc3QgZGI6IERCLkRhdGFiYXNlID0gY2xvdWQuZGF0YWJhc2UoICk7XG5jb25zdCBfID0gZGIuY29tbWFuZDtcblxuLyoqIFxuICog6L2s5o2i5qC85p6X5bC85rK75pe25Yy6ICs45pe25Yy6XG4gKiBEYXRlKCkubm93KCkgLyBuZXcgRGF0ZSgpLmdldFRpbWUoKSDmmK/ml7bkuI3ml7bmraPluLjnmoQrOFxuICogRGF0ZS50b0xvY2FsU3RyaW5nKCApIOWlveWDj+aYr+S4gOebtOaYrysw55qEXG4gKiDlhYjmi7/liLAgKzDvvIznhLblkI4rOFxuICovXG5jb25zdCBnZXROb3cgPSAoIHRzID0gZmFsc2UgKTogYW55ID0+IHtcbiAgICBpZiAoIHRzICkge1xuICAgICAgICByZXR1cm4gRGF0ZS5ub3coICk7XG4gICAgfVxuICAgIGNvbnN0IHRpbWVfMCA9IG5ldyBEYXRlKCBuZXcgRGF0ZSggKS50b0xvY2FsZVN0cmluZyggKSk7XG4gICAgcmV0dXJuIG5ldyBEYXRlKCB0aW1lXzAuZ2V0VGltZSggKSArIDggKiA2MCAqIDYwICogMTAwMCApXG59XG5cbi8qKlxuICpcbiAqIEBkZXNjcmlwdGlvbiDllYblk4HmtLvliqjmqKHlnZdcbiAqICEg4oCc5LiA5Y+j5Lu34oCd77yaIOWQjOS4gOWVhuWTge+8jOS4jeWQjOWei+WPt+mDveWPr+S7peWPguWKoO+8jOS4gOWPo+S7t+aYr+S7peWei+WPt+S4uue7tOW6pueahFxuICogLS0tLS0tLS0g5a2X5q61IC0tLS0tLS0tLS1cbiAqIHR5cGUg57G75Z6LICdnb29kX2Rpc2NvdW50J1xuICogcGlkXG4gKiBzaWRcbiAqIHRpdGxlIOWei+WPt+WQjeensFxuICogc3RvY2so5Y+v5pegKVxuICogZW5kVGltZVxuICogYWNfcHJpY2VcbiAqIGFjX2dyb3VwUHJpY2VcbiAqIGNyZWF0ZWRUaW1lXG4gKiB1cGRhdGVkVGltZVxuICogaXNDbG9zZWQg5piv5ZCm5bey57uP5LiK5p62XG4gKiBpc0RlbGV0ZWQg5piv5ZCm5bey57uP5omL5Yqo5Yig6ZmkXG4gKi9cbmV4cG9ydCBjb25zdCBtYWluID0gYXN5bmMgKCBldmVudCwgY29udGV4dCApID0+IHtcblxuICAgIGNvbnN0IGFwcCA9IG5ldyBUY2JSb3V0ZXIoeyBldmVudCB9KTtcblxuICAgIC8qKlxuICAgICAqIEBkZXNjcmlwdGlvblxuICAgICAqIOWIm+W7ulxuICAgICAqIGxpc3Q6IHtcbiAgICAgICAgKiBhY19ncm91cFByaWNlXG4gICAgICAgICogYWNfcHJpY2VcbiAgICAgICAgKiBlbmRUaW1lXG4gICAgICAgICogcGlkXG4gICAgICAgICogc2lkXG4gICAgICAgICogc3RvY2tcbiAgICAgICAgKiB0aXRsZVxuICAgICAqIH1bIF1cbiAgICAgKi9cbiAgICBhcHAucm91dGVyKCdjcmVhdGUtZ29vZC1kaXNjb3VudCcsIGFzeW5jKCBjdHgsIG5leHQgKSA9PiB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGNvbnN0IHsgbGlzdCB9ID0gZXZlbnQuZGF0YTtcbiAgICAgICAgICAgIGNvbnN0IGRhdGFNZXRhOiBhbnlbIF0gPSBsaXN0Lm1hcCggeCA9PiBPYmplY3QuYXNzaWduKHsgfSwgeCwge1xuICAgICAgICAgICAgICAgIGlzQ2xvc2VkOiB0cnVlLFxuICAgICAgICAgICAgICAgIGlzRGVsZXRlZDogZmFsc2UsXG4gICAgICAgICAgICAgICAgdHlwZTogJ2dvb2RfZGlzY291bnQnLFxuICAgICAgICAgICAgICAgIHVwZGF0ZWRUaW1lOiBnZXROb3coIHRydWUgKSxcbiAgICAgICAgICAgICAgICBjcmVhdGVkVGltZTogZ2V0Tm93KCB0cnVlIClcbiAgICAgICAgICAgIH0pKTtcblxuICAgICAgICAgICAgLy8g6ZSZ6K+v5a6a5LmJXG4gICAgICAgICAgICBjb25zdCBoYXNFcnIgPSBtZXNzYWdlID0+IGN0eC5ib2R5ID0ge1xuICAgICAgICAgICAgICAgIG1lc3NhZ2UsXG4gICAgICAgICAgICAgICAgc3RhdHVzOiA1MDBcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIC8vIOWOu+mHjVxuICAgICAgICAgICAgY29uc3QgY2hlY2tzJDogYW55ID0gYXdhaXQgUHJvbWlzZS5hbGwoIGRhdGFNZXRhLm1hcCggbWV0YSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3QgeyBwaWQsIHNpZCB9ID0gbWV0YTtcbiAgICAgICAgICAgICAgICByZXR1cm4gZGIuY29sbGVjdGlvbignYWN0aXZpdHknKVxuICAgICAgICAgICAgICAgICAgICAud2hlcmUoe1xuICAgICAgICAgICAgICAgICAgICAgICAgcGlkLFxuICAgICAgICAgICAgICAgICAgICAgICAgc2lkLFxuICAgICAgICAgICAgICAgICAgICAgICAgaXNEZWxldGVkOiBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGlzQ2xvc2VkOiBmYWxzZVxuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAuY291bnQoIClcbiAgICAgICAgICAgIH0pKTtcblxuICAgICAgICAgICAgLy8g5Y676YeN6ZSZ6K+vXG4gICAgICAgICAgICBjb25zdCBlcnJvckxpc3Q6IHN0cmluZ1tdID0gWyBdO1xuICAgICAgICAgICAgY2hlY2tzJC5tYXAoKCB4LCBrICkgPT4ge1xuICAgICAgICAgICAgICAgIGlmICggIHgudG90YWwgPiAwICkge1xuICAgICAgICAgICAgICAgICAgICBlcnJvckxpc3QucHVzaCggZGF0YU1ldGFbIGsgXS50aXRsZSApO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBpZiAoIGVycm9yTGlzdC5sZW5ndGggPiAwICkge1xuICAgICAgICAgICAgICAgIHJldHVybiBoYXNFcnIoYCR7ZXJyb3JMaXN0LmpvaW4oJ+OAgScpfSDnibnku7flt7LlrZjlnKhgKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8g5paw5bu6XG4gICAgICAgICAgICBjb25zdCBjcmVhdGUkID0gYXdhaXQgUHJvbWlzZS5hbGwoIGRhdGFNZXRhLm1hcCggbWV0YSA9PiB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFByb21pc2UuYWxsKFtcbiAgICAgICAgICAgICAgICAgICAgZGIuY29sbGVjdGlvbignYWN0aXZpdHknKVxuICAgICAgICAgICAgICAgICAgICAgICAgLmFkZCh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YTogbWV0YVxuICAgICAgICAgICAgICAgICAgICAgICAgfSksXG4gICAgICAgICAgICAgICAgICAgIGRiLmNvbGxlY3Rpb24oJ2dvb2RzJylcbiAgICAgICAgICAgICAgICAgICAgICAgIC5kb2MoIG1ldGEucGlkIClcbiAgICAgICAgICAgICAgICAgICAgICAgIC51cGRhdGUoe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdXBkYXRlVGltZTogZ2V0Tm93KCB0cnVlIClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIF0pXG4gICAgICAgICAgICB9KSk7XG5cbiAgICAgICAgICAgIHJldHVybiBjdHguYm9keSA9IHsgXG4gICAgICAgICAgICAgICAgc3RhdHVzOiAyMDBcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBjYXRjaCAoIGUgKSB7XG4gICAgICAgICAgICByZXR1cm4gY3R4LmJvZHkgPSB7IHN0YXR1czogNTAwIH07XG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgIC8qKlxuICAgICAqIEBkZXNjcmlwdGlvblxuICAgICAqIOajgOafpeaYr+WQpuaciemHjeWkjVxuICAgICAqIGxpc3Q6IHtcbiAgICAgICAgKiBwaWRcbiAgICAgICAgKiBzaWQsXG4gICAgICAgICogdGl0bGVcbiAgICAgKiB9WyBdXG4gICAgICovXG4gICAgYXBwLnJvdXRlcignY2hlY2stZ29vZC1kaXNjb3VudCcsIGFzeW5jKCBjdHgsIG5leHQgKSA9PiB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGNvbnN0IHsgbGlzdCB9ID0gZXZlbnQuZGF0YTtcblxuICAgICAgICAgICAgLy8g6ZSZ6K+v5a6a5LmJXG4gICAgICAgICAgICBjb25zdCBoYXNFcnIgPSBtZXNzYWdlID0+IGN0eC5ib2R5ID0ge1xuICAgICAgICAgICAgICAgIG1lc3NhZ2UsXG4gICAgICAgICAgICAgICAgc3RhdHVzOiA1MDBcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIC8vIOWOu+mHjVxuICAgICAgICAgICAgY29uc3QgY2hlY2tzJDogYW55ID0gYXdhaXQgUHJvbWlzZS5hbGwoIGxpc3QubWFwKCBtZXRhID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCB7IHBpZCwgc2lkIH0gPSBtZXRhO1xuICAgICAgICAgICAgICAgIHJldHVybiBkYi5jb2xsZWN0aW9uKCdhY3Rpdml0eScpXG4gICAgICAgICAgICAgICAgICAgIC53aGVyZSh7XG4gICAgICAgICAgICAgICAgICAgICAgICBwaWQsXG4gICAgICAgICAgICAgICAgICAgICAgICBzaWQsXG4gICAgICAgICAgICAgICAgICAgICAgICBpc0RlbGV0ZWQ6IGZhbHNlXG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgIC5jb3VudCggKVxuICAgICAgICAgICAgfSkpO1xuXG4gICAgICAgICAgICAvLyDljrvph43plJnor69cbiAgICAgICAgICAgIGNvbnN0IGVycm9yTGlzdDogc3RyaW5nWyBdID0gWyBdO1xuICAgICAgICAgICAgY2hlY2tzJC5tYXAoKCB4LCBrICkgPT4ge1xuICAgICAgICAgICAgICAgIGlmICggIHgudG90YWwgPiAwICkge1xuICAgICAgICAgICAgICAgICAgICBlcnJvckxpc3QucHVzaCggbGlzdFsgayBdLnRpdGxlICk7XG4gICAgICAgICAgICAgICAgfSBcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBpZiAoIGVycm9yTGlzdC5sZW5ndGggPiAwICkge1xuICAgICAgICAgICAgICAgIHJldHVybiBoYXNFcnIoYCR7ZXJyb3JMaXN0LmpvaW4oJ+OAgScpfeeJueS7t+W3suWtmOWcqGApO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gY3R4LmJvZHkgPSB7IFxuICAgICAgICAgICAgICAgIHN0YXR1czogMjAwXG4gICAgICAgICAgICB9XG4gICAgICAgIH0gY2F0Y2ggKCBlICkge1xuICAgICAgICAgICAgcmV0dXJuIGN0eC5ib2R5ID0geyBzdGF0dXM6IDUwMCB9O1xuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICAvKiogXG4gICAgICogQGRlc2NyaXB0aW9uXG4gICAgICog5YiG6aG15p+l6K+i4oCc5LiA5Y+j5Lu34oCd5rS75Yqo5ZWG5ZOB5YiX6KGoXG4gICAgICoge1xuICAgICAqICAgICBwYWdlOijlv4XloaspXG4gICAgICogICAgIGxpbWl0XG4gICAgICogICAgIGZpbHRlckJqcDogZmFsc2UgfCB0cnVlIHwgdW5kZWZpbmVkIO+8iCDmmK/lkKbov4fmu6Tkv53lgaXlk4Eg77yJXG4gICAgICogICAgIGZpbHRlclBhc3M6IGJvb2xlYW4gKOaYr+WQpui/h+a7pOaOieW3sui/h+acnyAtIOWuouaIt+err+imgei/h+a7pOaOiSlcbiAgICAgKiAgICAgaXNDbG9zZWQ6IHVuZGVmaW5lZCB8IHRydWUgfCBmYWxzZVxuICAgICAqIH1cbiAgICAgKi9cbiAgICBhcHAucm91dGVyKCdnb29kLWRpc2NvdW50LWxpc3QnLCBhc3luYyggY3R4LCBuZXh0ICkgPT4ge1xuICAgICAgICB0cnkge1xuXG4gICAgICAgICAgICBsZXQgYmpwQ29uZmlnOiBhbnkgPSBudWxsO1xuICAgICAgICAgICAgLy8g5p+l6K+i5p2h5pWwXG4gICAgICAgICAgICBjb25zdCBsaW1pdCA9IGV2ZW50LmRhdGEubGltaXQgfHwgMjA7XG4gICAgICAgICAgICBjb25zdCB7IGlzQ2xvc2VkLCBmaWx0ZXJQYXNzIH0gPSBldmVudC5kYXRhO1xuXG4gICAgICAgICAgICAvLyDmn6Xor6LmnaHku7YgICAgICAgICAgICBcbiAgICAgICAgICAgIGxldCB3aGVyZSQgPSB7XG4gICAgICAgICAgICAgICAgaXNEZWxldGVkOiBmYWxzZSxcbiAgICAgICAgICAgICAgICB0eXBlOiAnZ29vZF9kaXNjb3VudCdcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIC8vIOS/neWBpeWTgemFjee9rlxuICAgICAgICAgICAgY29uc3QgYmpwQ29uZmlnJCA9IGF3YWl0IGRiLmNvbGxlY3Rpb24oJ2FwcC1jb25maWcnKVxuICAgICAgICAgICAgICAgICAgICAud2hlcmUoe1xuICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogJ2FwcC1ianAtdmlzaWJsZSdcbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgLmdldCggKTtcbiAgICAgICAgICAgIGJqcENvbmZpZyA9IGJqcENvbmZpZyQuZGF0YVsgMCBdO1xuXG4gICAgICAgICAgICBpZiAoIGlzQ2xvc2VkICE9PSB1bmRlZmluZWQgKSB7XG4gICAgICAgICAgICAgICAgd2hlcmUkID0gT2JqZWN0LmFzc2lnbih7IH0sIHdoZXJlJCwge1xuICAgICAgICAgICAgICAgICAgICBpc0Nsb3NlZFxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoICEhZmlsdGVyUGFzcyApIHtcbiAgICAgICAgICAgICAgICB3aGVyZSQgPSBPYmplY3QuYXNzaWduKHsgfSwgd2hlcmUkLCB7XG4gICAgICAgICAgICAgICAgICAgIGVuZFRpbWU6IF8uZ3QoIGdldE5vdyggdHJ1ZSApKVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBjb25zdCB0b3RhbCQgPSBhd2FpdCBkYi5jb2xsZWN0aW9uKCdhY3Rpdml0eScpXG4gICAgICAgICAgICAgICAgLndoZXJlKCB3aGVyZSQgKVxuICAgICAgICAgICAgICAgIC5jb3VudCggKTtcbiAgICBcbiAgICAgICAgICAgIC8vIOafpeivoua0u+WKqOWVhuWTgeWIl+ihqFxuICAgICAgICAgICAgY29uc3QgZGF0YSQgPSBhd2FpdCBkYi5jb2xsZWN0aW9uKCdhY3Rpdml0eScpXG4gICAgICAgICAgICAgICAgLndoZXJlKCB3aGVyZSQgKVxuICAgICAgICAgICAgICAgIC5saW1pdCggbGltaXQgKVxuICAgICAgICAgICAgICAgIC5za2lwKCggZXZlbnQuZGF0YS5wYWdlIC0gMSApICogbGltaXQgKVxuICAgICAgICAgICAgICAgIC5vcmRlckJ5KCd1cGRhdGVkVGltZScsICdkZXNjJylcbiAgICAgICAgICAgICAgICAuZ2V0KCApO1xuXG4gICAgICAgICAgICBsZXQgYWN0aXZpdGllcyA9IGRhdGEkLmRhdGE7XG5cbiAgICAgICAgICAgIC8vIOWVhuWTgWlk5YiX6KGoXG4gICAgICAgICAgICBjb25zdCBnb29kc0lkcyA9IEFycmF5LmZyb20oXG4gICAgICAgICAgICAgICAgbmV3IFNldCggYWN0aXZpdGllcy5tYXAoIHggPT4geC5waWQgKSlcbiAgICAgICAgICAgICkuZmlsdGVyKCB4ID0+ICEheCApO1xuXG4gICAgICAgICAgICAvLyDlnovlj7dpZOWIl+ihqFxuICAgICAgICAgICAgY29uc3Qgc0lkcyA9IEFycmF5LmZyb20oXG4gICAgICAgICAgICAgICAgbmV3IFNldCggYWN0aXZpdGllcy5tYXAoIHggPT4geC5zaWQgKSlcbiAgICAgICAgICAgICkuZmlsdGVyKCB4ID0+ICEheCApO1xuXG4gICAgICAgICAgICAvLyDmn6Xor6LllYblk4Hor6bmg4VcbiAgICAgICAgICAgIGNvbnN0IGdvb2RzJCQgPSBhd2FpdCBQcm9taXNlLmFsbCggZ29vZHNJZHMubWFwKCBwaWQgPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiBkYi5jb2xsZWN0aW9uKCdnb29kcycpXG4gICAgICAgICAgICAgICAgICAgIC5kb2MoIFN0cmluZyggcGlkICkpXG4gICAgICAgICAgICAgICAgICAgIC5nZXQoIClcbiAgICAgICAgICAgIH0pKTtcbiAgICAgICAgICAgIGNvbnN0IGdvb2RzJCA9IGdvb2RzJCQubWFwKCB4ID0+IHguZGF0YSApO1xuXG4gICAgICAgICAgICAvLyDmn6Xor6Llnovlj7for6bmg4VcbiAgICAgICAgICAgIGNvbnN0IHN0YW5kYXJzJCQgPSBhd2FpdCBQcm9taXNlLmFsbCggc0lkcy5tYXAoIHNpZCA9PiB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGRiLmNvbGxlY3Rpb24oJ3N0YW5kYXJkcycpXG4gICAgICAgICAgICAgICAgICAgIC5kb2MoIFN0cmluZyggc2lkICkpXG4gICAgICAgICAgICAgICAgICAgIC5nZXQoIClcbiAgICAgICAgICAgIH0pKTtcblxuICAgICAgICAgICAgY29uc3Qgc3RhbmRhcnMkID0gc3RhbmRhcnMkJC5tYXAoIHggPT4geC5kYXRhICk7XG5cbiAgICAgICAgICAgIC8vIOafpeivouS/neWBpeWTgeaVsOmHj+OAgei/h+a7pOS/neWBpeWTgea0u+WKqFxuICAgICAgICAgICAgbGV0IGJqcENvdW50ID0gMDtcbiAgICAgICAgICAgIGlmICggISFianBDb25maWcgJiYgIWJqcENvbmZpZy52YWx1ZSApIHtcbiAgICAgICAgICAgICAgICBjb25zdCBub3RCanBBY3RpdmllcyA9IGFjdGl2aXRpZXNcbiAgICAgICAgICAgICAgICAgICAgLmZpbHRlciggYWN0aXZlID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHsgcGlkIH0gPSBhY3RpdmU7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBnb29kID0gZ29vZHMkLmZpbmQoIHggPT4geC5faWQgPT09IHBpZCApO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuICEhZ29vZCAmJiBTdHJpbmcoIGdvb2QuY2F0ZWdvcnkgKSAhPT0gJzQnXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgXG4gICAgICAgICAgICAgICAgYmpwQ291bnQgPSBhY3Rpdml0aWVzLmxlbmd0aCAtIG5vdEJqcEFjdGl2aWVzLmxlbmd0aDtcbiAgICAgICAgICAgICAgICBhY3Rpdml0aWVzID0gbm90QmpwQWN0aXZpZXNcbiAgICAgICAgICAgIH1cblxuXG4gICAgICAgICAgICAvLyDmlbDmja7lpITnkIZcbiAgICAgICAgICAgIGNvbnN0IHJlc3VsdCA9IGFjdGl2aXRpZXMubWFwKCBtZXRhID0+IHtcblxuICAgICAgICAgICAgICAgIGxldCBnb29kID0gZ29vZHMkLmZpbmQoIGdvb2QkID0+IHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGdvb2QkLl9pZCA9PT0gbWV0YS5waWRcbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgIGNvbnN0IHN0YW5kYXJkID0gc3RhbmRhcnMkLmZpbmQoIHN0YW5kYXIkID0+IHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHN0YW5kYXIkLl9pZCA9PT0gbWV0YS5zaWRcbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgIGlmICggISFzdGFuZGFyZCApIHtcbiAgICAgICAgICAgICAgICAgICAgZ29vZCA9IE9iamVjdC5hc3NpZ24oeyB9LCBnb29kLCB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjdXJyZW50U3RhbmRhcmQ6IHN0YW5kYXJkXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gT2JqZWN0LmFzc2lnbih7IH0sIG1ldGEsIHtcbiAgICAgICAgICAgICAgICAgICAgZGV0YWlsOiBnb29kXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgcmV0dXJuIGN0eC5ib2R5ID0ge1xuICAgICAgICAgICAgICAgIHN0YXR1czogMjAwLFxuICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgbGlzdDogcmVzdWx0LFxuICAgICAgICAgICAgICAgICAgICBwYWdlbmF0aW9uOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0b3RhbDogdG90YWwkLnRvdGFsIC0gYmpwQ291bnQsXG4gICAgICAgICAgICAgICAgICAgICAgICBwYWdlU2l6ZTogbGltaXQsXG4gICAgICAgICAgICAgICAgICAgICAgICBwYWdlOiBldmVudC5kYXRhLnBhZ2UsXG4gICAgICAgICAgICAgICAgICAgICAgICB0b3RhbFBhZ2U6IE1hdGguY2VpbCgoIHRvdGFsJC50b3RhbCAtIGJqcENvdW50ICkgLyBsaW1pdCApXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfSBjYXRjaCAoIGUgKSB7IHJldHVybiBjdHguYm9keSA9IHsgc3RhdHVzOiA1MDAgfTt9XG4gICAgfSk7XG5cbiAgICAvKiogXG4gICAgICogQGRlc2NyaXB0aW9uIFxuICAgICAqIOaJi+WKqOWIoOmZpOS4gOS4quWVhuWTgeS4gOWPo+S7t+a0u+WKqFxuICAgICAqL1xuICAgIGFwcC5yb3V0ZXIoJ2RlbGV0ZS1nb29kLWRpc2NvdW50JywgYXN5bmMoIGN0eCwgbmV4dCApID0+IHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGNvbnN0IHsgYWNpZCB9ID0gZXZlbnQuZGF0YTtcbiAgICAgICAgICAgIGF3YWl0IGRiLmNvbGxlY3Rpb24oJ2FjdGl2aXR5JylcbiAgICAgICAgICAgICAgICAuZG9jKCBTdHJpbmcoIGFjaWQgKSlcbiAgICAgICAgICAgICAgICAudXBkYXRlKHtcbiAgICAgICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgICAgICAgaXNEZWxldGVkOiB0cnVlXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgcmV0dXJuIGN0eC5ib2R5ID0ge1xuICAgICAgICAgICAgICAgIHN0YXR1czogMjAwXG4gICAgICAgICAgICB9XG4gICAgICAgIH0gY2F0Y2ggKCBlICkgeyByZXR1cm4gY3R4LmJvZHkgPSB7IHN0YXR1czogNTAwIH07fVxuICAgIH0pO1xuXG4gICAgLyoqIFxuICAgICAqIEBkZXNjcmlwdGlvblxuICAgICAqIOabtOaWsOWVhuWTgeS4gOWPo+S7t+a0u+WKqFxuICAgICAqIOWFqOWtl+autemHjO+8jOS7u+aEj+Wtl+autVxuICAgICAqIGFjaWRcbiAgICAgKi9cbiAgICBhcHAucm91dGVyKCd1cGRhdGUtZ29vZC1kaXNjb3VudCcsIGFzeW5jKCBjdHgsIG5leHQgKSA9PiB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBjb25zdCB7IGFjaWQsIHBpZCB9ID0gZXZlbnQuZGF0YTtcbiAgICAgICAgICAgIGNvbnN0IHVwZGF0ZUJvZHkgPSBldmVudC5kYXRhO1xuICAgICAgICAgICAgZGVsZXRlIHVwZGF0ZUJvZHkuYWNpZDtcblxuICAgICAgICAgICAgYXdhaXQgZGIuY29sbGVjdGlvbignYWN0aXZpdHknKVxuICAgICAgICAgICAgICAgIC5kb2MoIGFjaWQgKVxuICAgICAgICAgICAgICAgIC51cGRhdGUoe1xuICAgICAgICAgICAgICAgICAgICBkYXRhOiBPYmplY3QuYXNzaWduKHsgfSwgdXBkYXRlQm9keSwge1xuICAgICAgICAgICAgICAgICAgICAgICAgdXBkYXRlZFRpbWU6IGdldE5vdyggdHJ1ZSApXG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIGF3YWl0IGRiLmNvbGxlY3Rpb24oJ2dvb2RzJylcbiAgICAgICAgICAgICAgICAuZG9jKCBwaWQgKVxuICAgICAgICAgICAgICAgIC51cGRhdGUoe1xuICAgICAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICB1cGRhdGVUaW1lOiBnZXROb3coIHRydWUgKVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHJldHVybiBjdHguYm9keSA9IHtcbiAgICAgICAgICAgICAgICBzdGF0dXM6IDIwMFxuICAgICAgICAgICAgfTtcblxuICAgICAgICB9IGNhdGNoICggZSApIHtcbiAgICAgICAgICAgIHJldHVybiBjdHguYm9keSA9IHsgc3RhdHVzOiA1MDAgfTtcbiAgICAgICAgfSBcbiAgICB9KTtcblxuICAgIHJldHVybiBhcHAuc2VydmUoICk7XG59Il19