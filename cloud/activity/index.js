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
                            isClosed: false,
                            type: 'good_discount',
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
        return [2, app.serve()];
    });
}); };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSxpQkEwSkM7O0FBMUpELHFDQUF1QztBQUN2QyxzQ0FBd0M7QUFFeEMsS0FBSyxDQUFDLElBQUksRUFBRyxDQUFDO0FBRWQsSUFBTSxFQUFFLEdBQWdCLEtBQUssQ0FBQyxRQUFRLEVBQUcsQ0FBQztBQUMxQyxJQUFNLENBQUMsR0FBRyxFQUFFLENBQUMsT0FBTyxDQUFDO0FBZ0JSLFFBQUEsSUFBSSxHQUFHLFVBQVEsS0FBSyxFQUFFLE9BQU87Ozs7UUFFaEMsR0FBRyxHQUFHLElBQUksU0FBUyxDQUFDLEVBQUUsS0FBSyxPQUFBLEVBQUUsQ0FBQyxDQUFDO1FBZXJDLEdBQUcsQ0FBQyxNQUFNLENBQUMsc0JBQXNCLEVBQUUsVUFBTyxHQUFHLEVBQUUsSUFBSTs7Ozs7O3dCQUduQyxJQUFJLEdBQUssS0FBSyxDQUFDLElBQUksS0FBZixDQUFnQjt3QkFDdEIsYUFBbUIsSUFBSSxDQUFDLEdBQUcsQ0FBRSxVQUFBLENBQUMsSUFBSSxPQUFBLE1BQU0sQ0FBQyxNQUFNLENBQUMsRUFBRyxFQUFFLENBQUMsRUFBRTs0QkFDMUQsUUFBUSxFQUFFLEtBQUs7NEJBQ2YsSUFBSSxFQUFFLGVBQWU7NEJBQ3JCLFdBQVcsRUFBRSxJQUFJLElBQUksRUFBRyxDQUFDLE9BQU8sRUFBRzt5QkFDdEMsQ0FBQyxFQUpzQyxDQUl0QyxDQUFDLENBQUM7d0JBR0UsTUFBTSxHQUFHLFVBQUEsT0FBTyxJQUFJLE9BQUEsR0FBRyxDQUFDLElBQUksR0FBRzs0QkFDakMsT0FBTyxTQUFBOzRCQUNQLE1BQU0sRUFBRSxHQUFHO3lCQUNkLEVBSHlCLENBR3pCLENBQUM7d0JBR21CLFdBQU0sT0FBTyxDQUFDLEdBQUcsQ0FBRSxVQUFRLENBQUMsR0FBRyxDQUFFLFVBQUEsSUFBSTtnQ0FDOUMs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LENBQUMsSUFBSSxHQUFHO2dDQUNkLE1BQU0sRUFBRSxHQUFHOzZCQUNkLEVBQUE7Ozt3QkFFRCxXQUFPLEdBQUcsQ0FBQyxJQUFJLEdBQUcsRUFBRSxNQUFNLEVBQUUsR0FBRyxFQUFFLEVBQUM7Ozs7YUFFekMsQ0FBQyxDQUFDO1FBSUgsV0FBTyxHQUFHLENBQUMsS0FBSyxFQUFHLEVBQUM7O0tBQ3ZCLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBjbG91ZCBmcm9tICd3eC1zZXJ2ZXItc2RrJztcbmltcG9ydCAqIGFzIFRjYlJvdXRlciBmcm9tICd0Y2Itcm91dGVyJztcblxuY2xvdWQuaW5pdCggKTtcblxuY29uc3QgZGI6IERCLkRhdGFiYXNlID0gY2xvdWQuZGF0YWJhc2UoICk7XG5jb25zdCBfID0gZGIuY29tbWFuZDtcblxuLyoqXG4gKlxuICogQGRlc2NyaXB0aW9uIOWVhuWTgea0u+WKqOaooeWdl1xuICogLS0tLS0tLS0g5a2X5q61IC0tLS0tLS0tLS1cbiAqIHR5cGUg57G75Z6LICdnb29kX2Rpc2NvdW50J1xuICogcGlkXG4gKiBzaWRcbiAqIHN0b2NrXG4gKiBlbmRUaW1lXG4gKiBhY19wcmljZVxuICogYWNfZ3JvdXBQcmljZVxuICogaXNDbG9zZWRcbiAqIGNyZWF0ZWRUaW1lXG4gKi9cbmV4cG9ydCBjb25zdCBtYWluID0gYXN5bmMgKCBldmVudCwgY29udGV4dCApID0+IHtcblxuICAgIGNvbnN0IGFwcCA9IG5ldyBUY2JSb3V0ZXIoeyBldmVudCB9KTtcblxuICAgIC8qKlxuICAgICAqIEBkZXNjcmlwdGlvblxuICAgICAqIOWIm+W7ulxuICAgICAqIGxpc3Q6IHtcbiAgICAgICAgKiBhY19ncm91cFByaWNlXG4gICAgICAgICogYWNfcHJpY2VcbiAgICAgICAgKiBlbmRUaW1lXG4gICAgICAgICogcGlkXG4gICAgICAgICogc2lkXG4gICAgICAgICogc3RvY2tcbiAgICAgICAgKiB0aXRsZVxuICAgICAqIH1bIF1cbiAgICAgKi9cbiAgICBhcHAucm91dGVyKCdjcmVhdGUtZ29vZC1kaXNjb3VudCcsIGFzeW5jKCBjdHgsIG5leHQgKSA9PiB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGNvbnN0IHsgbGlzdCB9ID0gZXZlbnQuZGF0YTtcbiAgICAgICAgICAgIGNvbnN0IGRhdGFNZXRhOiBhbnlbIF0gPSBsaXN0Lm1hcCggeCA9PiBPYmplY3QuYXNzaWduKHsgfSwgeCwge1xuICAgICAgICAgICAgICAgIGlzQ2xvc2VkOiBmYWxzZSxcbiAgICAgICAgICAgICAgICB0eXBlOiAnZ29vZF9kaXNjb3VudCcsXG4gICAgICAgICAgICAgICAgY3JlYXRlZFRpbWU6IG5ldyBEYXRlKCApLmdldFRpbWUoIClcbiAgICAgICAgICAgIH0pKTtcblxuICAgICAgICAgICAgLy8g6ZSZ6K+v5a6a5LmJXG4gICAgICAgICAgICBjb25zdCBoYXNFcnIgPSBtZXNzYWdlID0+IGN0eC5ib2R5ID0ge1xuICAgICAgICAgICAgICAgIG1lc3NhZ2UsXG4gICAgICAgICAgICAgICAgc3RhdHVzOiA1MDBcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIC8vIOWOu+mHjVxuICAgICAgICAgICAgY29uc3QgY2hlY2tzJDogYW55ID0gYXdhaXQgUHJvbWlzZS5hbGwoIGRhdGFNZXRhLm1hcCggbWV0YSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3QgeyBwaWQsIHNpZCB9ID0gbWV0YTtcbiAgICAgICAgICAgICAgICByZXR1cm4gZGIuY29sbGVjdGlvbignYWN0aXZpdHknKVxuICAgICAgICAgICAgICAgICAgICAud2hlcmUoe1xuICAgICAgICAgICAgICAgICAgICAgICAgcGlkLFxuICAgICAgICAgICAgICAgICAgICAgICAgc2lkLFxuICAgICAgICAgICAgICAgICAgICAgICAgaXNDbG9zZWQ6IGZhbHNlXG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgIC5jb3VudCggKVxuICAgICAgICAgICAgfSkpO1xuXG4gICAgICAgICAgICAvLyDljrvph43plJnor69cbiAgICAgICAgICAgIGNvbnN0IGVycm9yTGlzdDogc3RyaW5nW10gPSBbIF07XG4gICAgICAgICAgICBjb25zdCBoYXNFcnJvciA9IGNoZWNrcyQuc29tZSgoIHgsIGsgKSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKCAgeC50b3RhbCA+IDAgKSB7XG4gICAgICAgICAgICAgICAgICAgIGVycm9yTGlzdC5wdXNoKCBkYXRhTWV0YVsgayBdLnRpdGxlICk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgICAgIH0gXG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIGlmICggaGFzRXJyb3IgKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGhhc0VycihgJHtlcnJvckxpc3Quam9pbign44CBJyl9IOeJueS7t+W3suWtmOWcqGApO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyDmlrDlu7pcbiAgICAgICAgICAgIGNvbnN0IGNyZWF0ZSQgPSBhd2FpdCBQcm9taXNlLmFsbCggZGF0YU1ldGEubWFwKCBtZXRhID0+IHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZGIuY29sbGVjdGlvbignYWN0aXZpdHknKVxuICAgICAgICAgICAgICAgICAgICAuYWRkKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRhdGE6IG1ldGFcbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIH0pKTtcblxuICAgICAgICAgICAgcmV0dXJuIGN0eC5ib2R5ID0geyBcbiAgICAgICAgICAgICAgICBzdGF0dXM6IDIwMFxuICAgICAgICAgICAgfVxuICAgICAgICB9IGNhdGNoICggZSApIHtcbiAgICAgICAgICAgIHJldHVybiBjdHguYm9keSA9IHsgc3RhdHVzOiA1MDAgfTtcbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgLyoqXG4gICAgICogQGRlc2NyaXB0aW9uXG4gICAgICog5qOA5p+l5piv5ZCm5pyJ6YeN5aSNXG4gICAgICogbGlzdDoge1xuICAgICAgICAqIHBpZFxuICAgICAgICAqIHNpZCxcbiAgICAgICAgKiB0aXRsZVxuICAgICAqIH1bIF1cbiAgICAgKi9cbiAgICBhcHAucm91dGVyKCdjaGVjay1nb29kLWRpc2NvdW50JywgYXN5bmMoIGN0eCwgbmV4dCApID0+IHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgY29uc3QgeyBsaXN0IH0gPSBldmVudC5kYXRhO1xuXG4gICAgICAgICAgICAvLyDplJnor6/lrprkuYlcbiAgICAgICAgICAgIGNvbnN0IGhhc0VyciA9IG1lc3NhZ2UgPT4gY3R4LmJvZHkgPSB7XG4gICAgICAgICAgICAgICAgbWVzc2FnZSxcbiAgICAgICAgICAgICAgICBzdGF0dXM6IDUwMFxuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgLy8g5Y676YeNXG4gICAgICAgICAgICBjb25zdCBjaGVja3MkOiBhbnkgPSBhd2FpdCBQcm9taXNlLmFsbCggbGlzdC5tYXAoIG1ldGEgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IHsgcGlkLCBzaWQgfSA9IG1ldGE7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGRiLmNvbGxlY3Rpb24oJ2FjdGl2aXR5JylcbiAgICAgICAgICAgICAgICAgICAgLndoZXJlKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHBpZCxcbiAgICAgICAgICAgICAgICAgICAgICAgIHNpZCxcbiAgICAgICAgICAgICAgICAgICAgICAgIGlzQ2xvc2VkOiBmYWxzZVxuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAuY291bnQoIClcbiAgICAgICAgICAgIH0pKTtcblxuICAgICAgICAgICAgLy8g5Y676YeN6ZSZ6K+vXG4gICAgICAgICAgICBjb25zdCBlcnJvckxpc3Q6IHN0cmluZ1tdID0gWyBdO1xuICAgICAgICAgICAgY29uc3QgaGFzRXJyb3IgPSBjaGVja3MkLnNvbWUoKCB4LCBrICkgPT4ge1xuICAgICAgICAgICAgICAgIGlmICggIHgudG90YWwgPiAwICkge1xuICAgICAgICAgICAgICAgICAgICBlcnJvckxpc3QucHVzaCggbGlzdFsgayBdLnRpdGxlICk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgICAgIH0gXG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIGlmICggaGFzRXJyb3IgKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGhhc0VycihgJHtlcnJvckxpc3Quam9pbign44CBJyl954m55Lu35bey5a2Y5ZyoYCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiBjdHguYm9keSA9IHsgXG4gICAgICAgICAgICAgICAgc3RhdHVzOiAyMDBcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBjYXRjaCAoIGUgKSB7XG4gICAgICAgICAgICByZXR1cm4gY3R4LmJvZHkgPSB7IHN0YXR1czogNTAwIH07XG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgIC8qKiAgKi9cblxuICAgIHJldHVybiBhcHAuc2VydmUoICk7XG59Il19