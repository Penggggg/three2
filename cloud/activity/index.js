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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSxpQkEwWEM7O0FBMVhELHFDQUF1QztBQUN2QyxzQ0FBd0M7QUFFeEMsS0FBSyxDQUFDLElBQUksQ0FBQztJQUNQLEdBQUcsRUFBRSxPQUFPLENBQUMsR0FBRyxDQUFDLEtBQUs7Q0FDekIsQ0FBQyxDQUFDO0FBRUgsSUFBTSxFQUFFLEdBQWdCLEtBQUssQ0FBQyxRQUFRLEVBQUcsQ0FBQztBQUMxQyxJQUFNLENBQUMsR0FBRyxFQUFFLENBQUMsT0FBTyxDQUFDO0FBUXJCLElBQU0sTUFBTSxHQUFHLFVBQUUsRUFBVTtJQUFWLG1CQUFBLEVBQUEsVUFBVTtJQUN2QixJQUFLLEVBQUUsRUFBRztRQUNOLE9BQU8sSUFBSSxDQUFDLEdBQUcsRUFBRyxDQUFDO0tBQ3RCO0lBQ0QsSUFBTSxNQUFNLEdBQUcsSUFBSSxJQUFJLENBQUUsSUFBSSxJQUFJLEVBQUcsQ0FBQyxjQUFjLEVBQUcsQ0FBQyxDQUFDO0lBQ3hELE9BQU8sSUFBSSxJQUFJLENBQUUsTUFBTSxDQUFDLE9BQU8sRUFBRyxHQUFHLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLElBQUksQ0FBRSxDQUFBO0FBQzdELENBQUMsQ0FBQTtBQW9CWSxRQUFBLElBQUksR0FBRyxVQUFRLEtBQUssRUFBRSxPQUFPOzs7O1FBRWhDLEdBQUcsR0FBRyxJQUFJLFNBQVMsQ0FBQyxFQUFFLEtBQUssT0FBQSxFQUFFLENBQUMsQ0FBQztRQWVyQyxHQUFHLENBQUMsTUFBTSxDQUFDLHNCQUFzQixFQUFFLFVBQU8sR0FBRyxFQUFFLElBQUk7Ozs7Ozt3QkFHbkMsSUFBSSxHQUFLLEtBQUssQ0FBQyxJQUFJLEtBQWYsQ0FBZ0I7d0JBQ3RCLGFBQW1CLElBQUksQ0FBQyxHQUFHLENBQUUsVUFBQSxDQUFDLElBQUksT0FB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QUFJLEdBQUcsRUFBRSxNQUFNLEVBQUUsR0FBRyxFQUFFLEVBQUM7Ozs7YUFFekMsQ0FBQyxDQUFDO1FBRUgsV0FBTyxHQUFHLENBQUMsS0FBSyxFQUFHLEVBQUM7O0tBQ3ZCLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBjbG91ZCBmcm9tICd3eC1zZXJ2ZXItc2RrJztcbmltcG9ydCAqIGFzIFRjYlJvdXRlciBmcm9tICd0Y2Itcm91dGVyJztcblxuY2xvdWQuaW5pdCh7XG4gICAgZW52OiBwcm9jZXNzLmVudi5jbG91ZFxufSk7XG5cbmNvbnN0IGRiOiBEQi5EYXRhYmFzZSA9IGNsb3VkLmRhdGFiYXNlKCApO1xuY29uc3QgXyA9IGRiLmNvbW1hbmQ7XG5cbi8qKiBcbiAqIOi9rOaNouagvOael+WwvOayu+aXtuWMuiArOOaXtuWMulxuICogRGF0ZSgpLm5vdygpIC8gbmV3IERhdGUoKS5nZXRUaW1lKCkg5piv5pe25LiN5pe25q2j5bi455qEKzhcbiAqIERhdGUudG9Mb2NhbFN0cmluZyggKSDlpb3lg4/mmK/kuIDnm7TmmK8rMOeahFxuICog5YWI5ou/5YiwICsw77yM54S25ZCOKzhcbiAqL1xuY29uc3QgZ2V0Tm93ID0gKCB0cyA9IGZhbHNlICk6IGFueSA9PiB7XG4gICAgaWYgKCB0cyApIHtcbiAgICAgICAgcmV0dXJuIERhdGUubm93KCApO1xuICAgIH1cbiAgICBjb25zdCB0aW1lXzAgPSBuZXcgRGF0ZSggbmV3IERhdGUoICkudG9Mb2NhbGVTdHJpbmcoICkpO1xuICAgIHJldHVybiBuZXcgRGF0ZSggdGltZV8wLmdldFRpbWUoICkgKyA4ICogNjAgKiA2MCAqIDEwMDAgKVxufVxuXG4vKipcbiAqXG4gKiBAZGVzY3JpcHRpb24g5ZWG5ZOB5rS75Yqo5qih5Z2XXG4gKiAhIOKAnOS4gOWPo+S7t+KAne+8miDlkIzkuIDllYblk4HvvIzkuI3lkIzlnovlj7fpg73lj6/ku6Xlj4LliqDvvIzkuIDlj6Pku7fmmK/ku6Xlnovlj7fkuLrnu7TluqbnmoRcbiAqIC0tLS0tLS0tIOWtl+autSAtLS0tLS0tLS0tXG4gKiB0eXBlIOexu+WeiyAnZ29vZF9kaXNjb3VudCdcbiAqIHBpZFxuICogc2lkXG4gKiB0aXRsZSDlnovlj7flkI3np7BcbiAqIHN0b2NrKOWPr+aXoClcbiAqIGVuZFRpbWVcbiAqIGFjX3ByaWNlXG4gKiBhY19ncm91cFByaWNlXG4gKiBjcmVhdGVkVGltZVxuICogdXBkYXRlZFRpbWVcbiAqIGlzQ2xvc2VkIOaYr+WQpuW3sue7j+S4iuaetlxuICogaXNEZWxldGVkIOaYr+WQpuW3sue7j+aJi+WKqOWIoOmZpFxuICovXG5leHBvcnQgY29uc3QgbWFpbiA9IGFzeW5jICggZXZlbnQsIGNvbnRleHQgKSA9PiB7XG5cbiAgICBjb25zdCBhcHAgPSBuZXcgVGNiUm91dGVyKHsgZXZlbnQgfSk7XG5cbiAgICAvKipcbiAgICAgKiBAZGVzY3JpcHRpb25cbiAgICAgKiDliJvlu7pcbiAgICAgKiBsaXN0OiB7XG4gICAgICAgICogYWNfZ3JvdXBQcmljZVxuICAgICAgICAqIGFjX3ByaWNlXG4gICAgICAgICogZW5kVGltZVxuICAgICAgICAqIHBpZFxuICAgICAgICAqIHNpZFxuICAgICAgICAqIHN0b2NrXG4gICAgICAgICogdGl0bGVcbiAgICAgKiB9WyBdXG4gICAgICovXG4gICAgYXBwLnJvdXRlcignY3JlYXRlLWdvb2QtZGlzY291bnQnLCBhc3luYyggY3R4LCBuZXh0ICkgPT4ge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgXG4gICAgICAgICAgICBjb25zdCB7IGxpc3QgfSA9IGV2ZW50LmRhdGE7XG4gICAgICAgICAgICBjb25zdCBkYXRhTWV0YTogYW55WyBdID0gbGlzdC5tYXAoIHggPT4gT2JqZWN0LmFzc2lnbih7IH0sIHgsIHtcbiAgICAgICAgICAgICAgICBpc0Nsb3NlZDogdHJ1ZSxcbiAgICAgICAgICAgICAgICBpc0RlbGV0ZWQ6IGZhbHNlLFxuICAgICAgICAgICAgICAgIHR5cGU6ICdnb29kX2Rpc2NvdW50JyxcbiAgICAgICAgICAgICAgICB1cGRhdGVkVGltZTogZ2V0Tm93KCB0cnVlICksXG4gICAgICAgICAgICAgICAgY3JlYXRlZFRpbWU6IGdldE5vdyggdHJ1ZSApXG4gICAgICAgICAgICB9KSk7XG5cbiAgICAgICAgICAgIC8vIOmUmeivr+WumuS5iVxuICAgICAgICAgICAgY29uc3QgaGFzRXJyID0gbWVzc2FnZSA9PiBjdHguYm9keSA9IHtcbiAgICAgICAgICAgICAgICBtZXNzYWdlLFxuICAgICAgICAgICAgICAgIHN0YXR1czogNTAwXG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAvLyDljrvph41cbiAgICAgICAgICAgIGNvbnN0IGNoZWNrcyQ6IGFueSA9IGF3YWl0IFByb21pc2UuYWxsKCBkYXRhTWV0YS5tYXAoIG1ldGEgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IHsgcGlkLCBzaWQgfSA9IG1ldGE7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGRiLmNvbGxlY3Rpb24oJ2FjdGl2aXR5JylcbiAgICAgICAgICAgICAgICAgICAgLndoZXJlKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHBpZCxcbiAgICAgICAgICAgICAgICAgICAgICAgIHNpZCxcbiAgICAgICAgICAgICAgICAgICAgICAgIGlzRGVsZXRlZDogZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgICAgICBpc0Nsb3NlZDogZmFsc2VcbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgLmNvdW50KCApXG4gICAgICAgICAgICB9KSk7XG5cbiAgICAgICAgICAgIC8vIOWOu+mHjemUmeivr1xuICAgICAgICAgICAgY29uc3QgZXJyb3JMaXN0OiBzdHJpbmdbXSA9IFsgXTtcbiAgICAgICAgICAgIGNoZWNrcyQubWFwKCggeCwgayApID0+IHtcbiAgICAgICAgICAgICAgICBpZiAoICB4LnRvdGFsID4gMCApIHtcbiAgICAgICAgICAgICAgICAgICAgZXJyb3JMaXN0LnB1c2goIGRhdGFNZXRhWyBrIF0udGl0bGUgKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgaWYgKCBlcnJvckxpc3QubGVuZ3RoID4gMCApIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gaGFzRXJyKGAke2Vycm9yTGlzdC5qb2luKCfjgIEnKX0g54m55Lu35bey5a2Y5ZyoYCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIOaWsOW7ulxuICAgICAgICAgICAgY29uc3QgY3JlYXRlJCA9IGF3YWl0IFByb21pc2UuYWxsKCBkYXRhTWV0YS5tYXAoIG1ldGEgPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiBQcm9taXNlLmFsbChbXG4gICAgICAgICAgICAgICAgICAgIGRiLmNvbGxlY3Rpb24oJ2FjdGl2aXR5JylcbiAgICAgICAgICAgICAgICAgICAgICAgIC5hZGQoe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGE6IG1ldGFcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pLFxuICAgICAgICAgICAgICAgICAgICBkYi5jb2xsZWN0aW9uKCdnb29kcycpXG4gICAgICAgICAgICAgICAgICAgICAgICAuZG9jKCBtZXRhLnBpZCApXG4gICAgICAgICAgICAgICAgICAgICAgICAudXBkYXRlKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHVwZGF0ZVRpbWU6IGdldE5vdyggdHJ1ZSApXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICBdKVxuICAgICAgICAgICAgfSkpO1xuXG4gICAgICAgICAgICByZXR1cm4gY3R4LmJvZHkgPSB7IFxuICAgICAgICAgICAgICAgIHN0YXR1czogMjAwXG4gICAgICAgICAgICB9XG4gICAgICAgIH0gY2F0Y2ggKCBlICkge1xuICAgICAgICAgICAgcmV0dXJuIGN0eC5ib2R5ID0geyBzdGF0dXM6IDUwMCB9O1xuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICAvKipcbiAgICAgKiBAZGVzY3JpcHRpb25cbiAgICAgKiDmo4Dmn6XmmK/lkKbmnInph43lpI1cbiAgICAgKiBsaXN0OiB7XG4gICAgICAgICogcGlkXG4gICAgICAgICogc2lkLFxuICAgICAgICAqIHRpdGxlXG4gICAgICogfVsgXVxuICAgICAqL1xuICAgIGFwcC5yb3V0ZXIoJ2NoZWNrLWdvb2QtZGlzY291bnQnLCBhc3luYyggY3R4LCBuZXh0ICkgPT4ge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgXG4gICAgICAgICAgICBjb25zdCB7IGxpc3QgfSA9IGV2ZW50LmRhdGE7XG5cbiAgICAgICAgICAgIC8vIOmUmeivr+WumuS5iVxuICAgICAgICAgICAgY29uc3QgaGFzRXJyID0gbWVzc2FnZSA9PiBjdHguYm9keSA9IHtcbiAgICAgICAgICAgICAgICBtZXNzYWdlLFxuICAgICAgICAgICAgICAgIHN0YXR1czogNTAwXG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAvLyDljrvph41cbiAgICAgICAgICAgIGNvbnN0IGNoZWNrcyQ6IGFueSA9IGF3YWl0IFByb21pc2UuYWxsKCBsaXN0Lm1hcCggbWV0YSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3QgeyBwaWQsIHNpZCB9ID0gbWV0YTtcbiAgICAgICAgICAgICAgICByZXR1cm4gZGIuY29sbGVjdGlvbignYWN0aXZpdHknKVxuICAgICAgICAgICAgICAgICAgICAud2hlcmUoe1xuICAgICAgICAgICAgICAgICAgICAgICAgcGlkLFxuICAgICAgICAgICAgICAgICAgICAgICAgc2lkLFxuICAgICAgICAgICAgICAgICAgICAgICAgaXNEZWxldGVkOiBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGlzQ2xvc2VkOiBmYWxzZVxuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAuY291bnQoIClcbiAgICAgICAgICAgIH0pKTtcblxuICAgICAgICAgICAgLy8g5Y676YeN6ZSZ6K+vXG4gICAgICAgICAgICBjb25zdCBlcnJvckxpc3Q6IHN0cmluZ1sgXSA9IFsgXTtcbiAgICAgICAgICAgIGNoZWNrcyQubWFwKCggeCwgayApID0+IHtcbiAgICAgICAgICAgICAgICBpZiAoICB4LnRvdGFsID4gMCApIHtcbiAgICAgICAgICAgICAgICAgICAgZXJyb3JMaXN0LnB1c2goIGxpc3RbIGsgXS50aXRsZSApO1xuICAgICAgICAgICAgICAgIH0gXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgaWYgKCBlcnJvckxpc3QubGVuZ3RoID4gMCApIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gaGFzRXJyKGAke2Vycm9yTGlzdC5qb2luKCfjgIEnKX3nibnku7flt7LlrZjlnKhgKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIGN0eC5ib2R5ID0geyBcbiAgICAgICAgICAgICAgICBzdGF0dXM6IDIwMFxuICAgICAgICAgICAgfVxuICAgICAgICB9IGNhdGNoICggZSApIHtcbiAgICAgICAgICAgIHJldHVybiBjdHguYm9keSA9IHsgc3RhdHVzOiA1MDAgfTtcbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgLyoqIFxuICAgICAqIEBkZXNjcmlwdGlvblxuICAgICAqIOWIhumhteafpeivouKAnOS4gOWPo+S7t+KAnea0u+WKqOWVhuWTgeWIl+ihqFxuICAgICAqIHtcbiAgICAgKiAgICAgcGFnZToo5b+F5aGrKVxuICAgICAqICAgICBsaW1pdFxuICAgICAqICAgICBmaWx0ZXJCanA6IGZhbHNlIHwgdHJ1ZSB8IHVuZGVmaW5lZCDvvIgg5piv5ZCm6L+H5ruk5L+d5YGl5ZOBIO+8iVxuICAgICAqICAgICBmaWx0ZXJQYXNzOiBib29sZWFuICjmmK/lkKbov4fmu6Tmjonlt7Lov4fmnJ8gLSDlrqLmiLfnq6/opoHov4fmu6TmjokpXG4gICAgICogICAgIGlzQ2xvc2VkOiB1bmRlZmluZWQgfCB0cnVlIHwgZmFsc2VcbiAgICAgKiB9XG4gICAgICovXG4gICAgYXBwLnJvdXRlcignZ29vZC1kaXNjb3VudC1saXN0JywgYXN5bmMoIGN0eCwgbmV4dCApID0+IHtcbiAgICAgICAgdHJ5IHtcblxuICAgICAgICAgICAgbGV0IGJqcENvbmZpZzogYW55ID0gbnVsbDtcbiAgICAgICAgICAgIC8vIOafpeivouadoeaVsFxuICAgICAgICAgICAgY29uc3QgbGltaXQgPSBldmVudC5kYXRhLmxpbWl0IHx8IDIwO1xuICAgICAgICAgICAgY29uc3QgeyBpc0Nsb3NlZCwgZmlsdGVyUGFzcyB9ID0gZXZlbnQuZGF0YTtcblxuICAgICAgICAgICAgLy8g5p+l6K+i5p2h5Lu2ICAgICAgICAgICAgXG4gICAgICAgICAgICBsZXQgd2hlcmUkID0ge1xuICAgICAgICAgICAgICAgIGlzRGVsZXRlZDogZmFsc2UsXG4gICAgICAgICAgICAgICAgdHlwZTogJ2dvb2RfZGlzY291bnQnXG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAvLyDkv53lgaXlk4HphY3nva5cbiAgICAgICAgICAgIGNvbnN0IGJqcENvbmZpZyQgPSBhd2FpdCBkYi5jb2xsZWN0aW9uKCdhcHAtY29uZmlnJylcbiAgICAgICAgICAgICAgICAgICAgLndoZXJlKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6ICdhcHAtYmpwLXZpc2libGUnXG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgIC5nZXQoICk7XG4gICAgICAgICAgICBianBDb25maWcgPSBianBDb25maWckLmRhdGFbIDAgXTtcblxuICAgICAgICAgICAgaWYgKCBpc0Nsb3NlZCAhPT0gdW5kZWZpbmVkICkge1xuICAgICAgICAgICAgICAgIHdoZXJlJCA9IE9iamVjdC5hc3NpZ24oeyB9LCB3aGVyZSQsIHtcbiAgICAgICAgICAgICAgICAgICAgaXNDbG9zZWRcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKCAhIWZpbHRlclBhc3MgKSB7XG4gICAgICAgICAgICAgICAgd2hlcmUkID0gT2JqZWN0LmFzc2lnbih7IH0sIHdoZXJlJCwge1xuICAgICAgICAgICAgICAgICAgICBlbmRUaW1lOiBfLmd0KCBnZXROb3coIHRydWUgKSlcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgY29uc3QgdG90YWwkID0gYXdhaXQgZGIuY29sbGVjdGlvbignYWN0aXZpdHknKVxuICAgICAgICAgICAgICAgIC53aGVyZSggd2hlcmUkIClcbiAgICAgICAgICAgICAgICAuY291bnQoICk7XG4gICAgXG4gICAgICAgICAgICAvLyDmn6Xor6LmtLvliqjllYblk4HliJfooahcbiAgICAgICAgICAgIGNvbnN0IGRhdGEkID0gYXdhaXQgZGIuY29sbGVjdGlvbignYWN0aXZpdHknKVxuICAgICAgICAgICAgICAgIC53aGVyZSggd2hlcmUkIClcbiAgICAgICAgICAgICAgICAubGltaXQoIGxpbWl0IClcbiAgICAgICAgICAgICAgICAuc2tpcCgoIGV2ZW50LmRhdGEucGFnZSAtIDEgKSAqIGxpbWl0IClcbiAgICAgICAgICAgICAgICAub3JkZXJCeSgndXBkYXRlZFRpbWUnLCAnZGVzYycpXG4gICAgICAgICAgICAgICAgLmdldCggKTtcblxuICAgICAgICAgICAgbGV0IGFjdGl2aXRpZXMgPSBkYXRhJC5kYXRhO1xuXG4gICAgICAgICAgICAvLyDllYblk4FpZOWIl+ihqFxuICAgICAgICAgICAgY29uc3QgZ29vZHNJZHMgPSBBcnJheS5mcm9tKFxuICAgICAgICAgICAgICAgIG5ldyBTZXQoIGFjdGl2aXRpZXMubWFwKCB4ID0+IHgucGlkICkpXG4gICAgICAgICAgICApLmZpbHRlciggeCA9PiAhIXggKTtcblxuICAgICAgICAgICAgLy8g5Z6L5Y+3aWTliJfooahcbiAgICAgICAgICAgIGNvbnN0IHNJZHMgPSBBcnJheS5mcm9tKFxuICAgICAgICAgICAgICAgIG5ldyBTZXQoIGFjdGl2aXRpZXMubWFwKCB4ID0+IHguc2lkICkpXG4gICAgICAgICAgICApLmZpbHRlciggeCA9PiAhIXggKTtcblxuICAgICAgICAgICAgLy8g5p+l6K+i5ZWG5ZOB6K+m5oOFXG4gICAgICAgICAgICBjb25zdCBnb29kcyQkID0gYXdhaXQgUHJvbWlzZS5hbGwoIGdvb2RzSWRzLm1hcCggcGlkID0+IHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZGIuY29sbGVjdGlvbignZ29vZHMnKVxuICAgICAgICAgICAgICAgICAgICAuZG9jKCBTdHJpbmcoIHBpZCApKVxuICAgICAgICAgICAgICAgICAgICAuZ2V0KCApXG4gICAgICAgICAgICB9KSk7XG4gICAgICAgICAgICBjb25zdCBnb29kcyQgPSBnb29kcyQkLm1hcCggeCA9PiB4LmRhdGEgKTtcblxuICAgICAgICAgICAgLy8g5p+l6K+i5Z6L5Y+36K+m5oOFXG4gICAgICAgICAgICBjb25zdCBzdGFuZGFycyQkID0gYXdhaXQgUHJvbWlzZS5hbGwoIHNJZHMubWFwKCBzaWQgPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiBkYi5jb2xsZWN0aW9uKCdzdGFuZGFyZHMnKVxuICAgICAgICAgICAgICAgICAgICAuZG9jKCBTdHJpbmcoIHNpZCApKVxuICAgICAgICAgICAgICAgICAgICAuZ2V0KCApXG4gICAgICAgICAgICB9KSk7XG5cbiAgICAgICAgICAgIGNvbnN0IHN0YW5kYXJzJCA9IHN0YW5kYXJzJCQubWFwKCB4ID0+IHguZGF0YSApO1xuXG4gICAgICAgICAgICAvLyDmn6Xor6Lkv53lgaXlk4HmlbDph4/jgIHov4fmu6Tkv53lgaXlk4HmtLvliqhcbiAgICAgICAgICAgIGxldCBianBDb3VudCA9IDA7XG4gICAgICAgICAgICBpZiAoICEhYmpwQ29uZmlnICYmICFianBDb25maWcudmFsdWUgKSB7XG4gICAgICAgICAgICAgICAgY29uc3Qgbm90QmpwQWN0aXZpZXMgPSBhY3Rpdml0aWVzXG4gICAgICAgICAgICAgICAgICAgIC5maWx0ZXIoIGFjdGl2ZSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCB7IHBpZCB9ID0gYWN0aXZlO1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgZ29vZCA9IGdvb2RzJC5maW5kKCB4ID0+IHguX2lkID09PSBwaWQgKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiAhIWdvb2QgJiYgU3RyaW5nKCBnb29kLmNhdGVnb3J5ICkgIT09ICc0J1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgIFxuICAgICAgICAgICAgICAgIGJqcENvdW50ID0gYWN0aXZpdGllcy5sZW5ndGggLSBub3RCanBBY3Rpdmllcy5sZW5ndGg7XG4gICAgICAgICAgICAgICAgYWN0aXZpdGllcyA9IG5vdEJqcEFjdGl2aWVzXG4gICAgICAgICAgICB9XG5cblxuICAgICAgICAgICAgLy8g5pWw5o2u5aSE55CGXG4gICAgICAgICAgICBjb25zdCByZXN1bHQgPSBhY3Rpdml0aWVzLm1hcCggbWV0YSA9PiB7XG5cbiAgICAgICAgICAgICAgICBsZXQgZ29vZCA9IGdvb2RzJC5maW5kKCBnb29kJCA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBnb29kJC5faWQgPT09IG1ldGEucGlkXG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICBjb25zdCBzdGFuZGFyZCA9IHN0YW5kYXJzJC5maW5kKCBzdGFuZGFyJCA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBzdGFuZGFyJC5faWQgPT09IG1ldGEuc2lkXG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICBpZiAoICEhc3RhbmRhcmQgKSB7XG4gICAgICAgICAgICAgICAgICAgIGdvb2QgPSBPYmplY3QuYXNzaWduKHsgfSwgZ29vZCwge1xuICAgICAgICAgICAgICAgICAgICAgICAgY3VycmVudFN0YW5kYXJkOiBzdGFuZGFyZFxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAgICAgcmV0dXJuIE9iamVjdC5hc3NpZ24oeyB9LCBtZXRhLCB7XG4gICAgICAgICAgICAgICAgICAgIGRldGFpbDogZ29vZFxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHJldHVybiBjdHguYm9keSA9IHtcbiAgICAgICAgICAgICAgICBzdGF0dXM6IDIwMCxcbiAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICAgIGxpc3Q6IHJlc3VsdCxcbiAgICAgICAgICAgICAgICAgICAgcGFnZW5hdGlvbjoge1xuICAgICAgICAgICAgICAgICAgICAgICAgdG90YWw6IHRvdGFsJC50b3RhbCAtIGJqcENvdW50LFxuICAgICAgICAgICAgICAgICAgICAgICAgcGFnZVNpemU6IGxpbWl0LFxuICAgICAgICAgICAgICAgICAgICAgICAgcGFnZTogZXZlbnQuZGF0YS5wYWdlLFxuICAgICAgICAgICAgICAgICAgICAgICAgdG90YWxQYWdlOiBNYXRoLmNlaWwoKCB0b3RhbCQudG90YWwgLSBianBDb3VudCApIC8gbGltaXQgKVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgIH0gY2F0Y2ggKCBlICkgeyByZXR1cm4gY3R4LmJvZHkgPSB7IHN0YXR1czogNTAwIH07fVxuICAgIH0pO1xuXG4gICAgLyoqIFxuICAgICAqIEBkZXNjcmlwdGlvbiBcbiAgICAgKiDmiYvliqjliKDpmaTkuIDkuKrllYblk4HkuIDlj6Pku7fmtLvliqhcbiAgICAgKi9cbiAgICBhcHAucm91dGVyKCdkZWxldGUtZ29vZC1kaXNjb3VudCcsIGFzeW5jKCBjdHgsIG5leHQgKSA9PiB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBjb25zdCB7IGFjaWQgfSA9IGV2ZW50LmRhdGE7XG4gICAgICAgICAgICBhd2FpdCBkYi5jb2xsZWN0aW9uKCdhY3Rpdml0eScpXG4gICAgICAgICAgICAgICAgLmRvYyggU3RyaW5nKCBhY2lkICkpXG4gICAgICAgICAgICAgICAgLnVwZGF0ZSh7XG4gICAgICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlzRGVsZXRlZDogdHJ1ZVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHJldHVybiBjdHguYm9keSA9IHtcbiAgICAgICAgICAgICAgICBzdGF0dXM6IDIwMFxuICAgICAgICAgICAgfVxuICAgICAgICB9IGNhdGNoICggZSApIHsgcmV0dXJuIGN0eC5ib2R5ID0geyBzdGF0dXM6IDUwMCB9O31cbiAgICB9KTtcblxuICAgIC8qKiBcbiAgICAgKiBAZGVzY3JpcHRpb25cbiAgICAgKiDmm7TmlrDllYblk4HkuIDlj6Pku7fmtLvliqhcbiAgICAgKiDlhajlrZfmrrXph4zvvIzku7vmhI/lrZfmrrVcbiAgICAgKiBhY2lkXG4gICAgICovXG4gICAgYXBwLnJvdXRlcigndXBkYXRlLWdvb2QtZGlzY291bnQnLCBhc3luYyggY3R4LCBuZXh0ICkgPT4ge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgY29uc3QgeyBhY2lkLCBwaWQgfSA9IGV2ZW50LmRhdGE7XG4gICAgICAgICAgICBjb25zdCB1cGRhdGVCb2R5ID0gZXZlbnQuZGF0YTtcbiAgICAgICAgICAgIGRlbGV0ZSB1cGRhdGVCb2R5LmFjaWQ7XG5cbiAgICAgICAgICAgIGF3YWl0IGRiLmNvbGxlY3Rpb24oJ2FjdGl2aXR5JylcbiAgICAgICAgICAgICAgICAuZG9jKCBhY2lkIClcbiAgICAgICAgICAgICAgICAudXBkYXRlKHtcbiAgICAgICAgICAgICAgICAgICAgZGF0YTogT2JqZWN0LmFzc2lnbih7IH0sIHVwZGF0ZUJvZHksIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHVwZGF0ZWRUaW1lOiBnZXROb3coIHRydWUgKVxuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBhd2FpdCBkYi5jb2xsZWN0aW9uKCdnb29kcycpXG4gICAgICAgICAgICAgICAgLmRvYyggcGlkIClcbiAgICAgICAgICAgICAgICAudXBkYXRlKHtcbiAgICAgICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgICAgICAgdXBkYXRlVGltZTogZ2V0Tm93KCB0cnVlIClcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICByZXR1cm4gY3R4LmJvZHkgPSB7XG4gICAgICAgICAgICAgICAgc3RhdHVzOiAyMDBcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgfSBjYXRjaCAoIGUgKSB7XG4gICAgICAgICAgICByZXR1cm4gY3R4LmJvZHkgPSB7IHN0YXR1czogNTAwIH07XG4gICAgICAgIH0gXG4gICAgfSk7XG5cbiAgICByZXR1cm4gYXBwLnNlcnZlKCApO1xufSJdfQ==