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
            var list, dataMeta_1, hasErr, checks$, errorList_1, hasError, create$, e_1;
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
                                    isClosed: false
                                })
                                    .count();
                            }))];
                    case 1:
                        checks$ = _a.sent();
                        errorList_1 = [];
                        hasError = checks$.some(function (x, k) {
                            if (x.total > 0) {
                                errorList_1.push(dataMeta_1[k].title);
                                return true;
                            }
                            return false;
                        });
                        if (hasError) {
                            return [2, hasErr(errorList_1.join('、') + " \u7279\u4EF7\u5DF2\u5B58\u5728")];
                        }
                        return [4, Promise.all(dataMeta_1.map(function (meta) {
                                return db.collection('activity')
                                    .add({
                                    data: meta
                                });
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
            var list_1, hasErr, checks$, errorList_2, hasError, e_2;
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
                        hasError = checks$.some(function (x, k) {
                            if (x.total > 0) {
                                errorList_2.push(list_1[k].title);
                                return true;
                            }
                            return false;
                        });
                        if (hasError) {
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
            var limit, isClosed, where$, total$, data$, goodsIds, sIds, goods$$, goods$_1, standars$$, standars$_1, result, e_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 5, , 6]);
                        limit = event.data.limit || 20;
                        isClosed = event.data.isClosed;
                        where$ = {
                            isDeleted: false,
                            type: 'good_discount'
                        };
                        if (isClosed !== undefined) {
                            where$ = Object.assign({}, where$, {
                                isClosed: isClosed
                            });
                        }
                        return [4, db.collection('activity')
                                .where(where$)
                                .count()];
                    case 1:
                        total$ = _a.sent();
                        return [4, db.collection('activity')
                                .where(where$)
                                .limit(limit)
                                .skip((event.data.page - 1) * limit)
                                .orderBy('updatedTime', 'desc')
                                .get()];
                    case 2:
                        data$ = _a.sent();
                        goodsIds = Array.from(new Set(data$.data.map(function (x) { return x.pid; }))).filter(function (x) { return !!x; });
                        sIds = Array.from(new Set(data$.data.map(function (x) { return x.sid; }))).filter(function (x) { return !!x; });
                        return [4, Promise.all(goodsIds.map(function (pid) {
                                return db.collection('goods')
                                    .doc(String(pid))
                                    .get();
                            }))];
                    case 3:
                        goods$$ = _a.sent();
                        goods$_1 = goods$$.map(function (x) { return x.data; });
                        return [4, Promise.all(sIds.map(function (sid) {
                                return db.collection('standards')
                                    .doc(String(sid))
                                    .get();
                            }))];
                    case 4:
                        standars$$ = _a.sent();
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
                        e_3 = _a.sent();
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
            var acid, updateBody, e_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        acid = event.data.acid;
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
                        _a.sent();
                        return [2, ctx.body = {
                                status: 200
                            }];
                    case 2:
                        e_5 = _a.sent();
                        return [2, ctx.body = { status: 500 }];
                    case 3: return [2];
                }
            });
        }); });
        return [2, app.serve()];
    });
}); };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSxpQkEwVEM7O0FBMVRELHFDQUF1QztBQUN2QyxzQ0FBd0M7QUFFeEMsS0FBSyxDQUFDLElBQUksRUFBRyxDQUFDO0FBRWQsSUFBTSxFQUFFLEdBQWdCLEtBQUssQ0FBQyxRQUFRLEVBQUcsQ0FBQztBQUMxQyxJQUFNLENBQUMsR0FBRyxFQUFFLENBQUMsT0FBTyxDQUFDO0FBb0JSLFFBQUEsSUFBSSxHQUFHLFVBQVEsS0FBSyxFQUFFLE9BQU87Ozs7UUFFaEMsR0FBRyxHQUFHLElBQUksU0FBUyxDQUFDLEVBQUUsS0FBSyxPQUFBLEVBQUUsQ0FBQyxDQUFDO1FBZXJDLEdBQUcsQ0FBQyxNQUFNLENBQUMsc0JBQXNCLEVBQUUsVUFBTyxHQUFHLEVBQUUsSUFBSTs7Ozs7O3dCQUduQyxJQUFJLEdBQUssS0FBSyxDQUFDLElBQUksS0FBZixDQUFnQjt3QkFDdEIsYUFBbUIsSUFBSSxDQUFDLEdBQUcsQ0FBRSxVQUFBLENBQUMsSUFBSSxPQUFBLE1BQU0sQ0FBQyxNQUFNLENBQUMsRUFBRyxFQUFFLENBQUMsRUFBRTs0QkFDMUQsUUFBUSxFQUFFLElBQUk7NEJBQ2QsU0FBUyxFQUFFLEtBQUs7NEJBQ2hCLElBQUksRUFBRSxlQUFlOzRCQUNyQixXQUFXLEVBQUUsSUFBSSxJQUFJLEVBQUcsQ0FBQyxPQUFPLEVBQUc7NEJBQ25DLFdBQVcsRUFBRSxJQUFJLElBQUksRUFBRyxDQUFDLE9BQU8sRUFBRzt5QkFDdEMsQ0FBQyxFQU5zQyxDQU10QyxDQUFDLENBQUM7d0JBR0UsTUFBTSxHQUFHLFVBQUEsT0FBTyxJQUFJLE9BQUEsR0FBRyxDQUFDLElBQUksR0FBRzs0QkFDakMsT0FBTyxTQUFBOzRCQUNQLE1BQU0sRUFBRSxHQUFHO3lCQUNkLEVBSHlCLENBR3pCLENBQUM7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SUFBSSxFQUFFLE1BQU0sQ0FBQyxNQUFNLENBQUMsRUFBRyxFQUFFLFVBQVUsRUFBRTtvQ0FDakMsV0FBVyxFQUFFLElBQUksSUFBSSxFQUFHLENBQUMsT0FBTyxFQUFHO2lDQUN0QyxDQUFDOzZCQUNMLENBQUMsRUFBQTs7d0JBTk4sU0FNTSxDQUFDO3dCQUVQLFdBQU8sR0FBRyxDQUFDLElBQUksR0FBRztnQ0FDZCxNQUFNLEVBQUUsR0FBRzs2QkFDZCxFQUFDOzs7d0JBR0YsV0FBTyxHQUFHLENBQUMsSUFBSSxHQUFHLEVBQUUsTUFBTSxFQUFFLEdBQUcsRUFBRSxFQUFDOzs7O2FBRXpDLENBQUMsQ0FBQztRQUVILFdBQU8sR0FBRyxDQUFDLEtBQUssRUFBRyxFQUFDOztLQUN2QixDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgY2xvdWQgZnJvbSAnd3gtc2VydmVyLXNkayc7XG5pbXBvcnQgKiBhcyBUY2JSb3V0ZXIgZnJvbSAndGNiLXJvdXRlcic7XG5cbmNsb3VkLmluaXQoICk7XG5cbmNvbnN0IGRiOiBEQi5EYXRhYmFzZSA9IGNsb3VkLmRhdGFiYXNlKCApO1xuY29uc3QgXyA9IGRiLmNvbW1hbmQ7XG5cbi8qKlxuICpcbiAqIEBkZXNjcmlwdGlvbiDllYblk4HmtLvliqjmqKHlnZdcbiAqICEg4oCc5LiA5Y+j5Lu34oCd77yaIOWQjOS4gOWVhuWTge+8jOS4jeWQjOWei+WPt+mDveWPr+S7peWPguWKoO+8jOS4gOWPo+S7t+aYr+S7peWei+WPt+S4uue7tOW6pueahFxuICogLS0tLS0tLS0g5a2X5q61IC0tLS0tLS0tLS1cbiAqIHR5cGUg57G75Z6LICdnb29kX2Rpc2NvdW50J1xuICogcGlkXG4gKiBzaWRcbiAqIHRpdGxlIOWei+WPt+WQjeensFxuICogc3RvY2so5Y+v5pegKVxuICogZW5kVGltZVxuICogYWNfcHJpY2VcbiAqIGFjX2dyb3VwUHJpY2VcbiAqIGNyZWF0ZWRUaW1lXG4gKiB1cGRhdGVkVGltZVxuICogaXNDbG9zZWQg5piv5ZCm5bey57uP5LiK5p62XG4gKiBpc0RlbGV0ZWQg5piv5ZCm5bey57uP5omL5Yqo5Yig6ZmkXG4gKi9cbmV4cG9ydCBjb25zdCBtYWluID0gYXN5bmMgKCBldmVudCwgY29udGV4dCApID0+IHtcblxuICAgIGNvbnN0IGFwcCA9IG5ldyBUY2JSb3V0ZXIoeyBldmVudCB9KTtcblxuICAgIC8qKlxuICAgICAqIEBkZXNjcmlwdGlvblxuICAgICAqIOWIm+W7ulxuICAgICAqIGxpc3Q6IHtcbiAgICAgICAgKiBhY19ncm91cFByaWNlXG4gICAgICAgICogYWNfcHJpY2VcbiAgICAgICAgKiBlbmRUaW1lXG4gICAgICAgICogcGlkXG4gICAgICAgICogc2lkXG4gICAgICAgICogc3RvY2tcbiAgICAgICAgKiB0aXRsZVxuICAgICAqIH1bIF1cbiAgICAgKi9cbiAgICBhcHAucm91dGVyKCdjcmVhdGUtZ29vZC1kaXNjb3VudCcsIGFzeW5jKCBjdHgsIG5leHQgKSA9PiB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGNvbnN0IHsgbGlzdCB9ID0gZXZlbnQuZGF0YTtcbiAgICAgICAgICAgIGNvbnN0IGRhdGFNZXRhOiBhbnlbIF0gPSBsaXN0Lm1hcCggeCA9PiBPYmplY3QuYXNzaWduKHsgfSwgeCwge1xuICAgICAgICAgICAgICAgIGlzQ2xvc2VkOiB0cnVlLFxuICAgICAgICAgICAgICAgIGlzRGVsZXRlZDogZmFsc2UsXG4gICAgICAgICAgICAgICAgdHlwZTogJ2dvb2RfZGlzY291bnQnLFxuICAgICAgICAgICAgICAgIHVwZGF0ZWRUaW1lOiBuZXcgRGF0ZSggKS5nZXRUaW1lKCApLFxuICAgICAgICAgICAgICAgIGNyZWF0ZWRUaW1lOiBuZXcgRGF0ZSggKS5nZXRUaW1lKCApXG4gICAgICAgICAgICB9KSk7XG5cbiAgICAgICAgICAgIC8vIOmUmeivr+WumuS5iVxuICAgICAgICAgICAgY29uc3QgaGFzRXJyID0gbWVzc2FnZSA9PiBjdHguYm9keSA9IHtcbiAgICAgICAgICAgICAgICBtZXNzYWdlLFxuICAgICAgICAgICAgICAgIHN0YXR1czogNTAwXG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAvLyDljrvph41cbiAgICAgICAgICAgIGNvbnN0IGNoZWNrcyQ6IGFueSA9IGF3YWl0IFByb21pc2UuYWxsKCBkYXRhTWV0YS5tYXAoIG1ldGEgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IHsgcGlkLCBzaWQgfSA9IG1ldGE7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGRiLmNvbGxlY3Rpb24oJ2FjdGl2aXR5JylcbiAgICAgICAgICAgICAgICAgICAgLndoZXJlKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHBpZCxcbiAgICAgICAgICAgICAgICAgICAgICAgIHNpZCxcbiAgICAgICAgICAgICAgICAgICAgICAgIGlzQ2xvc2VkOiBmYWxzZVxuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAuY291bnQoIClcbiAgICAgICAgICAgIH0pKTtcblxuICAgICAgICAgICAgLy8g5Y676YeN6ZSZ6K+vXG4gICAgICAgICAgICBjb25zdCBlcnJvckxpc3Q6IHN0cmluZ1tdID0gWyBdO1xuICAgICAgICAgICAgY29uc3QgaGFzRXJyb3IgPSBjaGVja3MkLnNvbWUoKCB4LCBrICkgPT4ge1xuICAgICAgICAgICAgICAgIGlmICggIHgudG90YWwgPiAwICkge1xuICAgICAgICAgICAgICAgICAgICBlcnJvckxpc3QucHVzaCggZGF0YU1ldGFbIGsgXS50aXRsZSApO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9IFxuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBpZiAoIGhhc0Vycm9yICkge1xuICAgICAgICAgICAgICAgIHJldHVybiBoYXNFcnIoYCR7ZXJyb3JMaXN0LmpvaW4oJ+OAgScpfSDnibnku7flt7LlrZjlnKhgKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8g5paw5bu6XG4gICAgICAgICAgICBjb25zdCBjcmVhdGUkID0gYXdhaXQgUHJvbWlzZS5hbGwoIGRhdGFNZXRhLm1hcCggbWV0YSA9PiB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGRiLmNvbGxlY3Rpb24oJ2FjdGl2aXR5JylcbiAgICAgICAgICAgICAgICAgICAgLmFkZCh7XG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRhOiBtZXRhXG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICB9KSk7XG5cbiAgICAgICAgICAgIHJldHVybiBjdHguYm9keSA9IHsgXG4gICAgICAgICAgICAgICAgc3RhdHVzOiAyMDBcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBjYXRjaCAoIGUgKSB7XG4gICAgICAgICAgICByZXR1cm4gY3R4LmJvZHkgPSB7IHN0YXR1czogNTAwIH07XG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgIC8qKlxuICAgICAqIEBkZXNjcmlwdGlvblxuICAgICAqIOajgOafpeaYr+WQpuaciemHjeWkjVxuICAgICAqIGxpc3Q6IHtcbiAgICAgICAgKiBwaWRcbiAgICAgICAgKiBzaWQsXG4gICAgICAgICogdGl0bGVcbiAgICAgKiB9WyBdXG4gICAgICovXG4gICAgYXBwLnJvdXRlcignY2hlY2stZ29vZC1kaXNjb3VudCcsIGFzeW5jKCBjdHgsIG5leHQgKSA9PiB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGNvbnN0IHsgbGlzdCB9ID0gZXZlbnQuZGF0YTtcblxuICAgICAgICAgICAgLy8g6ZSZ6K+v5a6a5LmJXG4gICAgICAgICAgICBjb25zdCBoYXNFcnIgPSBtZXNzYWdlID0+IGN0eC5ib2R5ID0ge1xuICAgICAgICAgICAgICAgIG1lc3NhZ2UsXG4gICAgICAgICAgICAgICAgc3RhdHVzOiA1MDBcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIC8vIOWOu+mHjVxuICAgICAgICAgICAgY29uc3QgY2hlY2tzJDogYW55ID0gYXdhaXQgUHJvbWlzZS5hbGwoIGxpc3QubWFwKCBtZXRhID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCB7IHBpZCwgc2lkIH0gPSBtZXRhO1xuICAgICAgICAgICAgICAgIHJldHVybiBkYi5jb2xsZWN0aW9uKCdhY3Rpdml0eScpXG4gICAgICAgICAgICAgICAgICAgIC53aGVyZSh7XG4gICAgICAgICAgICAgICAgICAgICAgICBwaWQsXG4gICAgICAgICAgICAgICAgICAgICAgICBzaWQsXG4gICAgICAgICAgICAgICAgICAgICAgICBpc0RlbGV0ZWQ6IGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICAgICAgaXNDbG9zZWQ6IGZhbHNlXG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgIC5jb3VudCggKVxuICAgICAgICAgICAgfSkpO1xuXG4gICAgICAgICAgICAvLyDljrvph43plJnor69cbiAgICAgICAgICAgIGNvbnN0IGVycm9yTGlzdDogc3RyaW5nW10gPSBbIF07XG4gICAgICAgICAgICBjb25zdCBoYXNFcnJvciA9IGNoZWNrcyQuc29tZSgoIHgsIGsgKSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKCAgeC50b3RhbCA+IDAgKSB7XG4gICAgICAgICAgICAgICAgICAgIGVycm9yTGlzdC5wdXNoKCBsaXN0WyBrIF0udGl0bGUgKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICAgICAgfSBcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgaWYgKCBoYXNFcnJvciApIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gaGFzRXJyKGAke2Vycm9yTGlzdC5qb2luKCfjgIEnKX3nibnku7flt7LlrZjlnKhgKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIGN0eC5ib2R5ID0geyBcbiAgICAgICAgICAgICAgICBzdGF0dXM6IDIwMFxuICAgICAgICAgICAgfVxuICAgICAgICB9IGNhdGNoICggZSApIHtcbiAgICAgICAgICAgIHJldHVybiBjdHguYm9keSA9IHsgc3RhdHVzOiA1MDAgfTtcbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgLyoqIFxuICAgICAqIEBkZXNjcmlwdGlvblxuICAgICAqIOWIhumhteafpeivouKAnOS4gOWPo+S7t+KAnea0u+WKqOWVhuWTgeWIl+ihqFxuICAgICAqIHtcbiAgICAgKiAgICAgcGFnZToo5b+F5aGrKVxuICAgICAqICAgICBsaW1pdDpcbiAgICAgKiAgICAgaXNDbG9zZWQ6IHVuZGVmaW5lZCB8IHRydWUgfCBmYWxzZVxuICAgICAqIH1cbiAgICAgKi9cbiAgICBhcHAucm91dGVyKCdnb29kLWRpc2NvdW50LWxpc3QnLCBhc3luYyggY3R4LCBuZXh0ICkgPT4ge1xuICAgICAgICB0cnkge1xuXG4gICAgICAgICAgICAvLyDmn6Xor6LmnaHmlbBcbiAgICAgICAgICAgIGNvbnN0IGxpbWl0ID0gZXZlbnQuZGF0YS5saW1pdCB8fCAyMDtcbiAgICAgICAgICAgIGNvbnN0IHsgaXNDbG9zZWQgfSA9IGV2ZW50LmRhdGE7XG5cbiAgICAgICAgICAgIC8vIOafpeivouadoeS7tiAgICAgICAgICAgIFxuICAgICAgICAgICAgbGV0IHdoZXJlJCA9IHtcbiAgICAgICAgICAgICAgICBpc0RlbGV0ZWQ6IGZhbHNlLFxuICAgICAgICAgICAgICAgIHR5cGU6ICdnb29kX2Rpc2NvdW50J1xuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIGlmICggaXNDbG9zZWQgIT09IHVuZGVmaW5lZCApIHtcbiAgICAgICAgICAgICAgICB3aGVyZSQgPSBPYmplY3QuYXNzaWduKHsgfSwgd2hlcmUkLCB7XG4gICAgICAgICAgICAgICAgICAgIGlzQ2xvc2VkXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGNvbnN0IHRvdGFsJCA9IGF3YWl0IGRiLmNvbGxlY3Rpb24oJ2FjdGl2aXR5JylcbiAgICAgICAgICAgICAgICAud2hlcmUoIHdoZXJlJCApXG4gICAgICAgICAgICAgICAgLmNvdW50KCApO1xuICAgIFxuICAgICAgICAgICAgLy8g5p+l6K+i5rS75Yqo5ZWG5ZOB5YiX6KGoXG4gICAgICAgICAgICBjb25zdCBkYXRhJCA9IGF3YWl0IGRiLmNvbGxlY3Rpb24oJ2FjdGl2aXR5JylcbiAgICAgICAgICAgICAgICAud2hlcmUoIHdoZXJlJCApXG4gICAgICAgICAgICAgICAgLmxpbWl0KCBsaW1pdCApXG4gICAgICAgICAgICAgICAgLnNraXAoKCBldmVudC5kYXRhLnBhZ2UgLSAxICkgKiBsaW1pdCApXG4gICAgICAgICAgICAgICAgLm9yZGVyQnkoJ3VwZGF0ZWRUaW1lJywgJ2Rlc2MnKVxuICAgICAgICAgICAgICAgIC5nZXQoICk7XG5cbiAgICAgICAgICAgIC8vIOWVhuWTgWlk5YiX6KGoXG4gICAgICAgICAgICBjb25zdCBnb29kc0lkcyA9IEFycmF5LmZyb20oXG4gICAgICAgICAgICAgICAgbmV3IFNldCggZGF0YSQuZGF0YS5tYXAoIHggPT4geC5waWQgKSlcbiAgICAgICAgICAgICkuZmlsdGVyKCB4ID0+ICEheCApO1xuXG4gICAgICAgICAgICAvLyDlnovlj7dpZOWIl+ihqFxuICAgICAgICAgICAgY29uc3Qgc0lkcyA9IEFycmF5LmZyb20oXG4gICAgICAgICAgICAgICAgbmV3IFNldCggZGF0YSQuZGF0YS5tYXAoIHggPT4geC5zaWQgKSlcbiAgICAgICAgICAgICkuZmlsdGVyKCB4ID0+ICEheCApO1xuXG4gICAgICAgICAgICAvLyDmn6Xor6LllYblk4Hor6bmg4VcbiAgICAgICAgICAgIGNvbnN0IGdvb2RzJCQgPSBhd2FpdCBQcm9taXNlLmFsbCggZ29vZHNJZHMubWFwKCBwaWQgPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiBkYi5jb2xsZWN0aW9uKCdnb29kcycpXG4gICAgICAgICAgICAgICAgICAgIC5kb2MoIFN0cmluZyggcGlkICkpXG4gICAgICAgICAgICAgICAgICAgIC5nZXQoIClcbiAgICAgICAgICAgIH0pKTtcblxuICAgICAgICAgICAgY29uc3QgZ29vZHMkID0gZ29vZHMkJC5tYXAoIHggPT4geC5kYXRhICk7XG5cbiAgICAgICAgICAgIC8vIOafpeivouWei+WPt+ivpuaDhVxuICAgICAgICAgICAgY29uc3Qgc3RhbmRhcnMkJCA9IGF3YWl0IFByb21pc2UuYWxsKCBzSWRzLm1hcCggc2lkID0+IHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZGIuY29sbGVjdGlvbignc3RhbmRhcmRzJylcbiAgICAgICAgICAgICAgICAgICAgLmRvYyggU3RyaW5nKCBzaWQgKSlcbiAgICAgICAgICAgICAgICAgICAgLmdldCggKVxuICAgICAgICAgICAgfSkpO1xuXG4gICAgICAgICAgICBjb25zdCBzdGFuZGFycyQgPSBzdGFuZGFycyQkLm1hcCggeCA9PiB4LmRhdGEgKTtcblxuICAgICAgICAgICAgLy8g5pWw5o2u5aSE55CGXG4gICAgICAgICAgICBjb25zdCByZXN1bHQgPSBkYXRhJC5kYXRhLm1hcCggbWV0YSA9PiB7XG5cbiAgICAgICAgICAgICAgICBsZXQgZ29vZCA9IGdvb2RzJC5maW5kKCBnb29kJCA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBnb29kJC5faWQgPT09IG1ldGEucGlkXG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICBjb25zdCBzdGFuZGFyZCA9IHN0YW5kYXJzJC5maW5kKCBzdGFuZGFyJCA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBzdGFuZGFyJC5faWQgPT09IG1ldGEuc2lkXG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICBpZiAoICEhc3RhbmRhcmQgKSB7XG4gICAgICAgICAgICAgICAgICAgIGdvb2QgPSBPYmplY3QuYXNzaWduKHsgfSwgZ29vZCwge1xuICAgICAgICAgICAgICAgICAgICAgICAgY3VycmVudFN0YW5kYXJkOiBzdGFuZGFyZFxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAgICAgcmV0dXJuIE9iamVjdC5hc3NpZ24oeyB9LCBtZXRhLCB7XG4gICAgICAgICAgICAgICAgICAgIGRldGFpbDogZ29vZFxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHJldHVybiBjdHguYm9keSA9IHtcbiAgICAgICAgICAgICAgICBzdGF0dXM6IDIwMCxcbiAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICAgIGxpc3Q6IHJlc3VsdCxcbiAgICAgICAgICAgICAgICAgICAgcGFnZW5hdGlvbjoge1xuICAgICAgICAgICAgICAgICAgICAgICAgdG90YWw6IHRvdGFsJC50b3RhbCxcbiAgICAgICAgICAgICAgICAgICAgICAgIHBhZ2VTaXplOiBsaW1pdCxcbiAgICAgICAgICAgICAgICAgICAgICAgIHBhZ2U6IGV2ZW50LmRhdGEucGFnZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHRvdGFsUGFnZTogTWF0aC5jZWlsKCB0b3RhbCQudG90YWwgLyBsaW1pdCApXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfSBjYXRjaCAoIGUgKSB7IHJldHVybiBjdHguYm9keSA9IHsgc3RhdHVzOiA1MDAgfTt9XG4gICAgfSk7XG5cbiAgICAvKiogXG4gICAgICogQGRlc2NyaXB0aW9uIFxuICAgICAqIOaJi+WKqOWIoOmZpOS4gOS4quWVhuWTgeS4gOWPo+S7t+a0u+WKqFxuICAgICAqL1xuICAgIGFwcC5yb3V0ZXIoJ2RlbGV0ZS1nb29kLWRpc2NvdW50JywgYXN5bmMoIGN0eCwgbmV4dCApID0+IHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGNvbnN0IHsgYWNpZCB9ID0gZXZlbnQuZGF0YTtcbiAgICAgICAgICAgIGF3YWl0IGRiLmNvbGxlY3Rpb24oJ2FjdGl2aXR5JylcbiAgICAgICAgICAgICAgICAuZG9jKCBTdHJpbmcoIGFjaWQgKSlcbiAgICAgICAgICAgICAgICAudXBkYXRlKHtcbiAgICAgICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgICAgICAgaXNEZWxldGVkOiB0cnVlXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgcmV0dXJuIGN0eC5ib2R5ID0ge1xuICAgICAgICAgICAgICAgIHN0YXR1czogMjAwXG4gICAgICAgICAgICB9XG4gICAgICAgIH0gY2F0Y2ggKCBlICkgeyByZXR1cm4gY3R4LmJvZHkgPSB7IHN0YXR1czogNTAwIH07fVxuICAgIH0pO1xuXG4gICAgLyoqIFxuICAgICAqIEBkZXNjcmlwdGlvblxuICAgICAqIOabtOaWsOWVhuWTgeS4gOWPo+S7t+a0u+WKqFxuICAgICAqIOWFqOWtl+autemHjO+8jOS7u+aEj+Wtl+autVxuICAgICAqIGFjaWRcbiAgICAgKi9cbiAgICBhcHAucm91dGVyKCd1cGRhdGUtZ29vZC1kaXNjb3VudCcsIGFzeW5jKCBjdHgsIG5leHQgKSA9PiB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBjb25zdCB7IGFjaWQgfSA9IGV2ZW50LmRhdGE7XG4gICAgICAgICAgICBjb25zdCB1cGRhdGVCb2R5ID0gZXZlbnQuZGF0YTtcbiAgICAgICAgICAgIGRlbGV0ZSB1cGRhdGVCb2R5LmFjaWQ7XG5cbiAgICAgICAgICAgIGF3YWl0IGRiLmNvbGxlY3Rpb24oJ2FjdGl2aXR5JylcbiAgICAgICAgICAgICAgICAuZG9jKCBhY2lkIClcbiAgICAgICAgICAgICAgICAudXBkYXRlKHtcbiAgICAgICAgICAgICAgICAgICAgZGF0YTogT2JqZWN0LmFzc2lnbih7IH0sIHVwZGF0ZUJvZHksIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHVwZGF0ZWRUaW1lOiBuZXcgRGF0ZSggKS5nZXRUaW1lKCApXG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHJldHVybiBjdHguYm9keSA9IHtcbiAgICAgICAgICAgICAgICBzdGF0dXM6IDIwMFxuICAgICAgICAgICAgfTtcblxuICAgICAgICB9IGNhdGNoICggZSApIHtcbiAgICAgICAgICAgIHJldHVybiBjdHguYm9keSA9IHsgc3RhdHVzOiA1MDAgfTtcbiAgICAgICAgfSBcbiAgICB9KTtcblxuICAgIHJldHVybiBhcHAuc2VydmUoICk7XG59Il19