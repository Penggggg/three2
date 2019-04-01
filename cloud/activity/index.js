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
cloud.init();
var db = cloud.database();
var _ = db.command;
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
                            updatedTime: new Date().getTime(),
                            createdTime: new Date().getTime()
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
                                            updateTime: new Date().getTime()
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
                                    isDeleted: false,
                                    isClosed: false
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
            var limit, _a, isClosed, filterPass, where$, total$, data$, goodsIds, sIds, goods$$, goods$_1, standars$$, standars$_1, result, e_3;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 5, , 6]);
                        limit = event.data.limit || 20;
                        _a = event.data, isClosed = _a.isClosed, filterPass = _a.filterPass;
                        where$ = {
                            isDeleted: false,
                            type: 'good_discount'
                        };
                        if (isClosed !== undefined) {
                            where$ = Object.assign({}, where$, {
                                isClosed: isClosed
                            });
                        }
                        if (!!filterPass) {
                            where$ = Object.assign({}, where$, {
                                endTime: _.gt(new Date().getTime())
                            });
                        }
                        return [4, db.collection('activity')
                                .where(where$)
                                .count()];
                    case 1:
                        total$ = _b.sent();
                        return [4, db.collection('activity')
                                .where(where$)
                                .limit(limit)
                                .skip((event.data.page - 1) * limit)
                                .orderBy('updatedTime', 'desc')
                                .get()];
                    case 2:
                        data$ = _b.sent();
                        goodsIds = Array.from(new Set(data$.data.map(function (x) { return x.pid; }))).filter(function (x) { return !!x; });
                        sIds = Array.from(new Set(data$.data.map(function (x) { return x.sid; }))).filter(function (x) { return !!x; });
                        return [4, Promise.all(goodsIds.map(function (pid) {
                                return db.collection('goods')
                                    .doc(String(pid))
                                    .get();
                            }))];
                    case 3:
                        goods$$ = _b.sent();
                        goods$_1 = goods$$.map(function (x) { return x.data; });
                        return [4, Promise.all(sIds.map(function (sid) {
                                return db.collection('standards')
                                    .doc(String(sid))
                                    .get();
                            }))];
                    case 4:
                        standars$$ = _b.sent();
                        standars$_1 = standars$$.map(function (x) { return x.data; });
                        result = data$.data.map(function (meta) {
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
                                        total: total$.total,
                                        pageSize: limit,
                                        page: event.data.page,
                                        totalPage: Math.ceil(total$.total / limit)
                                    }
                                }
                            }];
                    case 5:
                        e_3 = _b.sent();
                        return [2, ctx.body = { status: 500 }];
                    case 6: return [2];
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
                                    updatedTime: new Date().getTime()
                                })
                            })];
                    case 1:
                        _b.sent();
                        return [4, db.collection('goods')
                                .doc(pid)
                                .update({
                                data: {
                                    updateTime: new Date().getTime()
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSxpQkFnVkM7O0FBaFZELHFDQUF1QztBQUN2QyxzQ0FBd0M7QUFFeEMsS0FBSyxDQUFDLElBQUksRUFBRyxDQUFDO0FBRWQsSUFBTSxFQUFFLEdBQWdCLEtBQUssQ0FBQyxRQUFRLEVBQUcsQ0FBQztBQUMxQyxJQUFNLENBQUMsR0FBRyxFQUFFLENBQUMsT0FBTyxDQUFDO0FBb0JSLFFBQUEsSUFBSSxHQUFHLFVBQVEsS0FBSyxFQUFFLE9BQU87Ozs7UUFFaEMsR0FBRyxHQUFHLElBQUksU0FBUyxDQUFDLEVBQUUsS0FBSyxPQUFBLEVBQUUsQ0FBQyxDQUFDO1FBZXJDLEdBQUcsQ0FBQyxNQUFNLENBQUMsc0JBQXNCLEVBQUUsVUFBTyxHQUFHLEVBQUUsSUFBSTs7Ozs7O3dCQUduQyxJQUFJLEdBQUssS0FBSyxDQUFDLElBQUksS0FBZixDQUFnQjt3QkFDdEIsYUFBbUIsSUFBSSxDQUFDLEdBQUcsQ0FBRSxVQUFBLENBQUMsSUFBSSxPQUFBLE1BQU0sQ0FBQyxNQUFNLENBQUMsRUFBRyxFQUFFLENBQUMsRUFBRTs0QkFDMUQsUUFBUSxFQUFFLElBQUk7NEJBQ2QsU0FBUyxFQUFFLEtBQUs7NEJBQ2hCLElBQUksRUFBRSxlQUFlOzRCQUNyQixXQUFXLEVBQUUsSUFBSSxJQUFJLEVBQUcsQ0FBQyxPQUFPLEVBQUc7NEJBQ25DLFdBQVcsRUFBRSxJQUFJLElBQUksRUFBRyxDQUFDLE9BQU8sRUFBRzt5QkFDdEMsQ0FBQyxFQU5zQyxDQU10QyxDQUFDLENBQUM7d0JBR0UsTUFBTSxHQUFHLFVBQUEsT0FBTyxJQUFJLE9BQUEsR0FBRyxDQUFDLElBQUksR0FBRzs0QkFDakMsT0FBTyxTQUFBOzRCQUNQLE1BQU0sRUFBRSxHQUFHO3lCQUNkLEVBSHlCLENBR3pCLENBQUM7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QUN2QixDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgY2xvdWQgZnJvbSAnd3gtc2VydmVyLXNkayc7XG5pbXBvcnQgKiBhcyBUY2JSb3V0ZXIgZnJvbSAndGNiLXJvdXRlcic7XG5cbmNsb3VkLmluaXQoICk7XG5cbmNvbnN0IGRiOiBEQi5EYXRhYmFzZSA9IGNsb3VkLmRhdGFiYXNlKCApO1xuY29uc3QgXyA9IGRiLmNvbW1hbmQ7XG5cbi8qKlxuICpcbiAqIEBkZXNjcmlwdGlvbiDllYblk4HmtLvliqjmqKHlnZdcbiAqICEg4oCc5LiA5Y+j5Lu34oCd77yaIOWQjOS4gOWVhuWTge+8jOS4jeWQjOWei+WPt+mDveWPr+S7peWPguWKoO+8jOS4gOWPo+S7t+aYr+S7peWei+WPt+S4uue7tOW6pueahFxuICogLS0tLS0tLS0g5a2X5q61IC0tLS0tLS0tLS1cbiAqIHR5cGUg57G75Z6LICdnb29kX2Rpc2NvdW50J1xuICogcGlkXG4gKiBzaWRcbiAqIHRpdGxlIOWei+WPt+WQjeensFxuICogc3RvY2so5Y+v5pegKVxuICogZW5kVGltZVxuICogYWNfcHJpY2VcbiAqIGFjX2dyb3VwUHJpY2VcbiAqIGNyZWF0ZWRUaW1lXG4gKiB1cGRhdGVkVGltZVxuICogaXNDbG9zZWQg5piv5ZCm5bey57uP5LiK5p62XG4gKiBpc0RlbGV0ZWQg5piv5ZCm5bey57uP5omL5Yqo5Yig6ZmkXG4gKi9cbmV4cG9ydCBjb25zdCBtYWluID0gYXN5bmMgKCBldmVudCwgY29udGV4dCApID0+IHtcblxuICAgIGNvbnN0IGFwcCA9IG5ldyBUY2JSb3V0ZXIoeyBldmVudCB9KTtcblxuICAgIC8qKlxuICAgICAqIEBkZXNjcmlwdGlvblxuICAgICAqIOWIm+W7ulxuICAgICAqIGxpc3Q6IHtcbiAgICAgICAgKiBhY19ncm91cFByaWNlXG4gICAgICAgICogYWNfcHJpY2VcbiAgICAgICAgKiBlbmRUaW1lXG4gICAgICAgICogcGlkXG4gICAgICAgICogc2lkXG4gICAgICAgICogc3RvY2tcbiAgICAgICAgKiB0aXRsZVxuICAgICAqIH1bIF1cbiAgICAgKi9cbiAgICBhcHAucm91dGVyKCdjcmVhdGUtZ29vZC1kaXNjb3VudCcsIGFzeW5jKCBjdHgsIG5leHQgKSA9PiB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGNvbnN0IHsgbGlzdCB9ID0gZXZlbnQuZGF0YTtcbiAgICAgICAgICAgIGNvbnN0IGRhdGFNZXRhOiBhbnlbIF0gPSBsaXN0Lm1hcCggeCA9PiBPYmplY3QuYXNzaWduKHsgfSwgeCwge1xuICAgICAgICAgICAgICAgIGlzQ2xvc2VkOiB0cnVlLFxuICAgICAgICAgICAgICAgIGlzRGVsZXRlZDogZmFsc2UsXG4gICAgICAgICAgICAgICAgdHlwZTogJ2dvb2RfZGlzY291bnQnLFxuICAgICAgICAgICAgICAgIHVwZGF0ZWRUaW1lOiBuZXcgRGF0ZSggKS5nZXRUaW1lKCApLFxuICAgICAgICAgICAgICAgIGNyZWF0ZWRUaW1lOiBuZXcgRGF0ZSggKS5nZXRUaW1lKCApXG4gICAgICAgICAgICB9KSk7XG5cbiAgICAgICAgICAgIC8vIOmUmeivr+WumuS5iVxuICAgICAgICAgICAgY29uc3QgaGFzRXJyID0gbWVzc2FnZSA9PiBjdHguYm9keSA9IHtcbiAgICAgICAgICAgICAgICBtZXNzYWdlLFxuICAgICAgICAgICAgICAgIHN0YXR1czogNTAwXG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAvLyDljrvph41cbiAgICAgICAgICAgIGNvbnN0IGNoZWNrcyQ6IGFueSA9IGF3YWl0IFByb21pc2UuYWxsKCBkYXRhTWV0YS5tYXAoIG1ldGEgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IHsgcGlkLCBzaWQgfSA9IG1ldGE7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGRiLmNvbGxlY3Rpb24oJ2FjdGl2aXR5JylcbiAgICAgICAgICAgICAgICAgICAgLndoZXJlKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHBpZCxcbiAgICAgICAgICAgICAgICAgICAgICAgIHNpZCxcbiAgICAgICAgICAgICAgICAgICAgICAgIGlzRGVsZXRlZDogZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgICAgICBpc0Nsb3NlZDogZmFsc2VcbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgLmNvdW50KCApXG4gICAgICAgICAgICB9KSk7XG5cbiAgICAgICAgICAgIC8vIOWOu+mHjemUmeivr1xuICAgICAgICAgICAgY29uc3QgZXJyb3JMaXN0OiBzdHJpbmdbXSA9IFsgXTtcbiAgICAgICAgICAgIGNoZWNrcyQubWFwKCggeCwgayApID0+IHtcbiAgICAgICAgICAgICAgICBpZiAoICB4LnRvdGFsID4gMCApIHtcbiAgICAgICAgICAgICAgICAgICAgZXJyb3JMaXN0LnB1c2goIGRhdGFNZXRhWyBrIF0udGl0bGUgKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgaWYgKCBlcnJvckxpc3QubGVuZ3RoID4gMCApIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gaGFzRXJyKGAke2Vycm9yTGlzdC5qb2luKCfjgIEnKX0g54m55Lu35bey5a2Y5ZyoYCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIOaWsOW7ulxuICAgICAgICAgICAgY29uc3QgY3JlYXRlJCA9IGF3YWl0IFByb21pc2UuYWxsKCBkYXRhTWV0YS5tYXAoIG1ldGEgPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiBQcm9taXNlLmFsbChbXG4gICAgICAgICAgICAgICAgICAgIGRiLmNvbGxlY3Rpb24oJ2FjdGl2aXR5JylcbiAgICAgICAgICAgICAgICAgICAgICAgIC5hZGQoe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGE6IG1ldGFcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pLFxuICAgICAgICAgICAgICAgICAgICBkYi5jb2xsZWN0aW9uKCdnb29kcycpXG4gICAgICAgICAgICAgICAgICAgICAgICAuZG9jKCBtZXRhLnBpZCApXG4gICAgICAgICAgICAgICAgICAgICAgICAudXBkYXRlKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHVwZGF0ZVRpbWU6IG5ldyBEYXRlKCApLmdldFRpbWUoIClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIF0pXG4gICAgICAgICAgICB9KSk7XG5cbiAgICAgICAgICAgIHJldHVybiBjdHguYm9keSA9IHsgXG4gICAgICAgICAgICAgICAgc3RhdHVzOiAyMDBcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBjYXRjaCAoIGUgKSB7XG4gICAgICAgICAgICByZXR1cm4gY3R4LmJvZHkgPSB7IHN0YXR1czogNTAwIH07XG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgIC8qKlxuICAgICAqIEBkZXNjcmlwdGlvblxuICAgICAqIOajgOafpeaYr+WQpuaciemHjeWkjVxuICAgICAqIGxpc3Q6IHtcbiAgICAgICAgKiBwaWRcbiAgICAgICAgKiBzaWQsXG4gICAgICAgICogdGl0bGVcbiAgICAgKiB9WyBdXG4gICAgICovXG4gICAgYXBwLnJvdXRlcignY2hlY2stZ29vZC1kaXNjb3VudCcsIGFzeW5jKCBjdHgsIG5leHQgKSA9PiB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGNvbnN0IHsgbGlzdCB9ID0gZXZlbnQuZGF0YTtcblxuICAgICAgICAgICAgLy8g6ZSZ6K+v5a6a5LmJXG4gICAgICAgICAgICBjb25zdCBoYXNFcnIgPSBtZXNzYWdlID0+IGN0eC5ib2R5ID0ge1xuICAgICAgICAgICAgICAgIG1lc3NhZ2UsXG4gICAgICAgICAgICAgICAgc3RhdHVzOiA1MDBcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIC8vIOWOu+mHjVxuICAgICAgICAgICAgY29uc3QgY2hlY2tzJDogYW55ID0gYXdhaXQgUHJvbWlzZS5hbGwoIGxpc3QubWFwKCBtZXRhID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCB7IHBpZCwgc2lkIH0gPSBtZXRhO1xuICAgICAgICAgICAgICAgIHJldHVybiBkYi5jb2xsZWN0aW9uKCdhY3Rpdml0eScpXG4gICAgICAgICAgICAgICAgICAgIC53aGVyZSh7XG4gICAgICAgICAgICAgICAgICAgICAgICBwaWQsXG4gICAgICAgICAgICAgICAgICAgICAgICBzaWQsXG4gICAgICAgICAgICAgICAgICAgICAgICBpc0RlbGV0ZWQ6IGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICAgICAgaXNDbG9zZWQ6IGZhbHNlXG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgIC5jb3VudCggKVxuICAgICAgICAgICAgfSkpO1xuXG4gICAgICAgICAgICAvLyDljrvph43plJnor69cbiAgICAgICAgICAgIGNvbnN0IGVycm9yTGlzdDogc3RyaW5nWyBdID0gWyBdO1xuICAgICAgICAgICAgY2hlY2tzJC5tYXAoKCB4LCBrICkgPT4ge1xuICAgICAgICAgICAgICAgIGlmICggIHgudG90YWwgPiAwICkge1xuICAgICAgICAgICAgICAgICAgICBlcnJvckxpc3QucHVzaCggbGlzdFsgayBdLnRpdGxlICk7XG4gICAgICAgICAgICAgICAgfSBcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBpZiAoIGVycm9yTGlzdC5sZW5ndGggPiAwICkge1xuICAgICAgICAgICAgICAgIHJldHVybiBoYXNFcnIoYCR7ZXJyb3JMaXN0LmpvaW4oJ+OAgScpfeeJueS7t+W3suWtmOWcqGApO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gY3R4LmJvZHkgPSB7IFxuICAgICAgICAgICAgICAgIHN0YXR1czogMjAwXG4gICAgICAgICAgICB9XG4gICAgICAgIH0gY2F0Y2ggKCBlICkge1xuICAgICAgICAgICAgcmV0dXJuIGN0eC5ib2R5ID0geyBzdGF0dXM6IDUwMCB9O1xuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICAvKiogXG4gICAgICogQGRlc2NyaXB0aW9uXG4gICAgICog5YiG6aG15p+l6K+i4oCc5LiA5Y+j5Lu34oCd5rS75Yqo5ZWG5ZOB5YiX6KGoXG4gICAgICoge1xuICAgICAqICAgICBwYWdlOijlv4XloaspXG4gICAgICogICAgIGxpbWl0XG4gICAgICogICAgIGZpbHRlclBhc3M6IGJvb2xlYW4gKOaYr+WQpui/h+a7pOaOieW3sui/h+acnyAtIOWuouaIt+err+imgei/h+a7pOaOiSlcbiAgICAgKiAgICAgaXNDbG9zZWQ6IHVuZGVmaW5lZCB8IHRydWUgfCBmYWxzZVxuICAgICAqIH1cbiAgICAgKi9cbiAgICBhcHAucm91dGVyKCdnb29kLWRpc2NvdW50LWxpc3QnLCBhc3luYyggY3R4LCBuZXh0ICkgPT4ge1xuICAgICAgICB0cnkge1xuXG4gICAgICAgICAgICAvLyDmn6Xor6LmnaHmlbBcbiAgICAgICAgICAgIGNvbnN0IGxpbWl0ID0gZXZlbnQuZGF0YS5saW1pdCB8fCAyMDtcbiAgICAgICAgICAgIGNvbnN0IHsgaXNDbG9zZWQsIGZpbHRlclBhc3MgfSA9IGV2ZW50LmRhdGE7XG5cbiAgICAgICAgICAgIC8vIOafpeivouadoeS7tiAgICAgICAgICAgIFxuICAgICAgICAgICAgbGV0IHdoZXJlJCA9IHtcbiAgICAgICAgICAgICAgICBpc0RlbGV0ZWQ6IGZhbHNlLFxuICAgICAgICAgICAgICAgIHR5cGU6ICdnb29kX2Rpc2NvdW50J1xuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgaWYgKCBpc0Nsb3NlZCAhPT0gdW5kZWZpbmVkICkge1xuICAgICAgICAgICAgICAgIHdoZXJlJCA9IE9iamVjdC5hc3NpZ24oeyB9LCB3aGVyZSQsIHtcbiAgICAgICAgICAgICAgICAgICAgaXNDbG9zZWRcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKCAhIWZpbHRlclBhc3MgKSB7XG4gICAgICAgICAgICAgICAgd2hlcmUkID0gT2JqZWN0LmFzc2lnbih7IH0sIHdoZXJlJCwge1xuICAgICAgICAgICAgICAgICAgICBlbmRUaW1lOiBfLmd0KCBuZXcgRGF0ZSggKS5nZXRUaW1lKCApKVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBjb25zdCB0b3RhbCQgPSBhd2FpdCBkYi5jb2xsZWN0aW9uKCdhY3Rpdml0eScpXG4gICAgICAgICAgICAgICAgLndoZXJlKCB3aGVyZSQgKVxuICAgICAgICAgICAgICAgIC5jb3VudCggKTtcbiAgICBcbiAgICAgICAgICAgIC8vIOafpeivoua0u+WKqOWVhuWTgeWIl+ihqFxuICAgICAgICAgICAgY29uc3QgZGF0YSQgPSBhd2FpdCBkYi5jb2xsZWN0aW9uKCdhY3Rpdml0eScpXG4gICAgICAgICAgICAgICAgLndoZXJlKCB3aGVyZSQgKVxuICAgICAgICAgICAgICAgIC5saW1pdCggbGltaXQgKVxuICAgICAgICAgICAgICAgIC5za2lwKCggZXZlbnQuZGF0YS5wYWdlIC0gMSApICogbGltaXQgKVxuICAgICAgICAgICAgICAgIC5vcmRlckJ5KCd1cGRhdGVkVGltZScsICdkZXNjJylcbiAgICAgICAgICAgICAgICAuZ2V0KCApO1xuXG4gICAgICAgICAgICAvLyDllYblk4FpZOWIl+ihqFxuICAgICAgICAgICAgY29uc3QgZ29vZHNJZHMgPSBBcnJheS5mcm9tKFxuICAgICAgICAgICAgICAgIG5ldyBTZXQoIGRhdGEkLmRhdGEubWFwKCB4ID0+IHgucGlkICkpXG4gICAgICAgICAgICApLmZpbHRlciggeCA9PiAhIXggKTtcblxuICAgICAgICAgICAgLy8g5Z6L5Y+3aWTliJfooahcbiAgICAgICAgICAgIGNvbnN0IHNJZHMgPSBBcnJheS5mcm9tKFxuICAgICAgICAgICAgICAgIG5ldyBTZXQoIGRhdGEkLmRhdGEubWFwKCB4ID0+IHguc2lkICkpXG4gICAgICAgICAgICApLmZpbHRlciggeCA9PiAhIXggKTtcblxuICAgICAgICAgICAgLy8g5p+l6K+i5ZWG5ZOB6K+m5oOFXG4gICAgICAgICAgICBjb25zdCBnb29kcyQkID0gYXdhaXQgUHJvbWlzZS5hbGwoIGdvb2RzSWRzLm1hcCggcGlkID0+IHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZGIuY29sbGVjdGlvbignZ29vZHMnKVxuICAgICAgICAgICAgICAgICAgICAuZG9jKCBTdHJpbmcoIHBpZCApKVxuICAgICAgICAgICAgICAgICAgICAuZ2V0KCApXG4gICAgICAgICAgICB9KSk7XG5cbiAgICAgICAgICAgIGNvbnN0IGdvb2RzJCA9IGdvb2RzJCQubWFwKCB4ID0+IHguZGF0YSApO1xuXG4gICAgICAgICAgICAvLyDmn6Xor6Llnovlj7for6bmg4VcbiAgICAgICAgICAgIGNvbnN0IHN0YW5kYXJzJCQgPSBhd2FpdCBQcm9taXNlLmFsbCggc0lkcy5tYXAoIHNpZCA9PiB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGRiLmNvbGxlY3Rpb24oJ3N0YW5kYXJkcycpXG4gICAgICAgICAgICAgICAgICAgIC5kb2MoIFN0cmluZyggc2lkICkpXG4gICAgICAgICAgICAgICAgICAgIC5nZXQoIClcbiAgICAgICAgICAgIH0pKTtcblxuICAgICAgICAgICAgY29uc3Qgc3RhbmRhcnMkID0gc3RhbmRhcnMkJC5tYXAoIHggPT4geC5kYXRhICk7XG5cbiAgICAgICAgICAgIC8vIOaVsOaNruWkhOeQhlxuICAgICAgICAgICAgY29uc3QgcmVzdWx0ID0gZGF0YSQuZGF0YS5tYXAoIG1ldGEgPT4ge1xuXG4gICAgICAgICAgICAgICAgbGV0IGdvb2QgPSBnb29kcyQuZmluZCggZ29vZCQgPT4ge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZ29vZCQuX2lkID09PSBtZXRhLnBpZFxuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgY29uc3Qgc3RhbmRhcmQgPSBzdGFuZGFycyQuZmluZCggc3RhbmRhciQgPT4ge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gc3RhbmRhciQuX2lkID09PSBtZXRhLnNpZFxuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgaWYgKCAhIXN0YW5kYXJkICkge1xuICAgICAgICAgICAgICAgICAgICBnb29kID0gT2JqZWN0LmFzc2lnbih7IH0sIGdvb2QsIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGN1cnJlbnRTdGFuZGFyZDogc3RhbmRhcmRcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgICAgIHJldHVybiBPYmplY3QuYXNzaWduKHsgfSwgbWV0YSwge1xuICAgICAgICAgICAgICAgICAgICBkZXRhaWw6IGdvb2RcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICByZXR1cm4gY3R4LmJvZHkgPSB7XG4gICAgICAgICAgICAgICAgc3RhdHVzOiAyMDAsXG4gICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgICBsaXN0OiByZXN1bHQsXG4gICAgICAgICAgICAgICAgICAgIHBhZ2VuYXRpb246IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRvdGFsOiB0b3RhbCQudG90YWwsXG4gICAgICAgICAgICAgICAgICAgICAgICBwYWdlU2l6ZTogbGltaXQsXG4gICAgICAgICAgICAgICAgICAgICAgICBwYWdlOiBldmVudC5kYXRhLnBhZ2UsXG4gICAgICAgICAgICAgICAgICAgICAgICB0b3RhbFBhZ2U6IE1hdGguY2VpbCggdG90YWwkLnRvdGFsIC8gbGltaXQgKVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgIH0gY2F0Y2ggKCBlICkgeyByZXR1cm4gY3R4LmJvZHkgPSB7IHN0YXR1czogNTAwIH07fVxuICAgIH0pO1xuXG4gICAgLyoqIFxuICAgICAqIEBkZXNjcmlwdGlvbiBcbiAgICAgKiDmiYvliqjliKDpmaTkuIDkuKrllYblk4HkuIDlj6Pku7fmtLvliqhcbiAgICAgKi9cbiAgICBhcHAucm91dGVyKCdkZWxldGUtZ29vZC1kaXNjb3VudCcsIGFzeW5jKCBjdHgsIG5leHQgKSA9PiB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBjb25zdCB7IGFjaWQgfSA9IGV2ZW50LmRhdGE7XG4gICAgICAgICAgICBhd2FpdCBkYi5jb2xsZWN0aW9uKCdhY3Rpdml0eScpXG4gICAgICAgICAgICAgICAgLmRvYyggU3RyaW5nKCBhY2lkICkpXG4gICAgICAgICAgICAgICAgLnVwZGF0ZSh7XG4gICAgICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlzRGVsZXRlZDogdHJ1ZVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHJldHVybiBjdHguYm9keSA9IHtcbiAgICAgICAgICAgICAgICBzdGF0dXM6IDIwMFxuICAgICAgICAgICAgfVxuICAgICAgICB9IGNhdGNoICggZSApIHsgcmV0dXJuIGN0eC5ib2R5ID0geyBzdGF0dXM6IDUwMCB9O31cbiAgICB9KTtcblxuICAgIC8qKiBcbiAgICAgKiBAZGVzY3JpcHRpb25cbiAgICAgKiDmm7TmlrDllYblk4HkuIDlj6Pku7fmtLvliqhcbiAgICAgKiDlhajlrZfmrrXph4zvvIzku7vmhI/lrZfmrrVcbiAgICAgKiBhY2lkXG4gICAgICovXG4gICAgYXBwLnJvdXRlcigndXBkYXRlLWdvb2QtZGlzY291bnQnLCBhc3luYyggY3R4LCBuZXh0ICkgPT4ge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgY29uc3QgeyBhY2lkLCBwaWQgfSA9IGV2ZW50LmRhdGE7XG4gICAgICAgICAgICBjb25zdCB1cGRhdGVCb2R5ID0gZXZlbnQuZGF0YTtcbiAgICAgICAgICAgIGRlbGV0ZSB1cGRhdGVCb2R5LmFjaWQ7XG5cbiAgICAgICAgICAgIGF3YWl0IGRiLmNvbGxlY3Rpb24oJ2FjdGl2aXR5JylcbiAgICAgICAgICAgICAgICAuZG9jKCBhY2lkIClcbiAgICAgICAgICAgICAgICAudXBkYXRlKHtcbiAgICAgICAgICAgICAgICAgICAgZGF0YTogT2JqZWN0LmFzc2lnbih7IH0sIHVwZGF0ZUJvZHksIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHVwZGF0ZWRUaW1lOiBuZXcgRGF0ZSggKS5nZXRUaW1lKCApXG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIGF3YWl0IGRiLmNvbGxlY3Rpb24oJ2dvb2RzJylcbiAgICAgICAgICAgICAgICAuZG9jKCBwaWQgKVxuICAgICAgICAgICAgICAgIC51cGRhdGUoe1xuICAgICAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICB1cGRhdGVUaW1lOiBuZXcgRGF0ZSggKS5nZXRUaW1lKCApXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgcmV0dXJuIGN0eC5ib2R5ID0ge1xuICAgICAgICAgICAgICAgIHN0YXR1czogMjAwXG4gICAgICAgICAgICB9O1xuXG4gICAgICAgIH0gY2F0Y2ggKCBlICkge1xuICAgICAgICAgICAgcmV0dXJuIGN0eC5ib2R5ID0geyBzdGF0dXM6IDUwMCB9O1xuICAgICAgICB9IFxuICAgIH0pO1xuXG4gICAgcmV0dXJuIGFwcC5zZXJ2ZSggKTtcbn0iXX0=