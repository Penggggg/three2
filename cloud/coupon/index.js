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
exports.main = function (event, context) { return __awaiter(_this, void 0, void 0, function () {
    var app;
    var _this = this;
    return __generator(this, function (_a) {
        app = new TcbRouter({ event: event });
        app.router('create', function (ctx, next) { return __awaiter(_this, void 0, void 0, function () {
            var openid, temp, add$, e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        openid = event.data.openId || event.userInfo.openId;
                        temp = Object.assign({}, event.data, {
                            openid: openid,
                            isUsed: false,
                            fromtid: event.data.fromtid || event.data.tid,
                            reduce_type: event.data.reduce_type || 'yuan',
                            createTime: new Date().getTime()
                        });
                        return [4, db.collection('coupon')
                                .add({
                                data: temp
                            })];
                    case 1:
                        add$ = _a.sent();
                        return [2, ctx.body = {
                                status: 200,
                                data: add$._id
                            }];
                    case 2:
                        e_1 = _a.sent();
                        return [2, ctx.body = { status: 500 }];
                    case 3: return [2];
                }
            });
        }); });
        app.router('repair-lijian', function (ctx, next) { return __awaiter(_this, void 0, void 0, function () {
            var tid, openid, trip$, trip, reduce_price, find$, target, e_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 7, , 8]);
                        tid = event.data.tid;
                        openid = event.data.openId || event.userInfo.openId;
                        return [4, db.collection('trip')
                                .doc(tid)
                                .get()];
                    case 1:
                        trip$ = _a.sent();
                        trip = trip$.data;
                        reduce_price = trip.reduce_price;
                        return [4, db.collection('coupon')
                                .where({
                                tid: tid,
                                openid: openid,
                                type: 't_lijian'
                            })
                                .get()];
                    case 2:
                        find$ = _a.sent();
                        target = find$.data[0];
                        if (!(!target && !!reduce_price)) return [3, 4];
                        return [4, db.collection('coupon')
                                .add({
                                data: {
                                    tid: tid,
                                    openid: openid,
                                    atleast: 0,
                                    fromtid: tid,
                                    value: reduce_price,
                                    type: 't_lijian',
                                    isUsed: false,
                                    canUseInNext: false,
                                    title: '行程立减优惠券',
                                    reduce_type: 'yuan',
                                    createTime: new Date().getTime()
                                }
                            })];
                    case 3:
                        _a.sent();
                        _a.label = 4;
                    case 4:
                        if (!(!!target && !!reduce_price)) return [3, 6];
                        return [4, db.collection('coupon')
                                .doc(String(target._id))
                                .update({
                                data: {
                                    value: reduce_price
                                }
                            })];
                    case 5:
                        _a.sent();
                        _a.label = 6;
                    case 6: return [2, ctx.body = {
                            status: 200
                        }];
                    case 7:
                        e_2 = _a.sent();
                        return [2, ctx.body = { status: 500 }];
                    case 8: return [2];
                }
            });
        }); });
        app.router('isget', function (ctx, next) { return __awaiter(_this, void 0, void 0, function () {
            var _a, tid, check, openid, trip$, trip, reduce_price_1, fullreduce_values_1, cashcoupon_values_1, lijian$_1, manjian$_1, daijin$_1, temp_1, e_3;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 5, , 6]);
                        _a = event.data, tid = _a.tid, check = _a.check;
                        openid = event.data.openId || event.userInfo.openId;
                        return [4, db.collection('trip')
                                .doc(tid)
                                .get()];
                    case 1:
                        trip$ = _b.sent();
                        trip = trip$.data;
                        reduce_price_1 = trip.reduce_price, fullreduce_values_1 = trip.fullreduce_values, cashcoupon_values_1 = trip.cashcoupon_values;
                        return [4, db.collection('coupon')
                                .where({
                                tid: tid,
                                openid: openid,
                                type: 't_lijian'
                            })
                                .get()];
                    case 2:
                        lijian$_1 = _b.sent();
                        return [4, db.collection('coupon')
                                .where({
                                tid: tid,
                                openid: openid,
                                type: 't_manjian'
                            })
                                .get()];
                    case 3:
                        manjian$_1 = _b.sent();
                        return [4, db.collection('coupon')
                                .where({
                                tid: tid,
                                openid: openid,
                                type: 't_daijin'
                            })
                                .get()];
                    case 4:
                        daijin$_1 = _b.sent();
                        temp_1 = {};
                        check.split(',').map(function (checkType) {
                            if (checkType === 't_manjian') {
                                temp_1[checkType] = !!fullreduce_values_1 ?
                                    manjian$_1.data.length === 0 ?
                                        false :
                                        true :
                                    null;
                            }
                            else if (checkType === 't_daijin') {
                                temp_1[checkType] = !!cashcoupon_values_1 ?
                                    daijin$_1.data.length === 0 ?
                                        false :
                                        true :
                                    null;
                            }
                            else if (checkType === 't_lijian') {
                                temp_1[checkType] = !!reduce_price_1 ?
                                    lijian$_1.data.length === 0 ?
                                        false :
                                        lijian$_1.data[0].value < reduce_price_1 ?
                                            'half' :
                                            true :
                                    null;
                            }
                        });
                        return [2, ctx.body = {
                                status: 200,
                                data: temp_1
                            }];
                    case 5:
                        e_3 = _b.sent();
                        return [2, ctx.body = { status: 500 }];
                    case 6: return [2];
                }
            });
        }); });
        app.router('list', function (ctx, next) { return __awaiter(_this, void 0, void 0, function () {
            var openid, isUsed, query$, list$, tripsIds, trips$, trips_1, list, e_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        openid = event.data.openId || event.userInfo.openId;
                        isUsed = event.data.isUsed;
                        query$ = {
                            openid: openid
                        };
                        if (isUsed !== undefined) {
                            query$ = Object.assign({}, query$, {
                                isUsed: isUsed
                            });
                        }
                        return [4, db.collection('coupon')
                                .where(query$)
                                .get()];
                    case 1:
                        list$ = _a.sent();
                        tripsIds = Array.from(new Set(list$.data.map(function (x) { return x.tid; })));
                        return [4, Promise.all(tripsIds.map(function (tid) {
                                return db.collection('trip')
                                    .doc(tid)
                                    .get();
                            }))];
                    case 2:
                        trips$ = _a.sent();
                        trips_1 = trips$.map(function (x) { return x.data; });
                        list = list$.data.map(function (coupon) {
                            var tripMeta = trips_1.find(function (x) { return x._id === coupon.tid; });
                            return Object.assign({}, coupon, {
                                trip: tripMeta || null
                            });
                        });
                        return [2, ctx.body = {
                                status: 200,
                                data: list
                            }];
                    case 3:
                        e_4 = _a.sent();
                        return [2, ctx.body = { status: 500 }];
                    case 4: return [2];
                }
            });
        }); });
        return [2, app.serve()];
    });
}); };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSxpQkE4UkU7O0FBOVJGLHFDQUF1QztBQUN2QyxzQ0FBd0M7QUFFeEMsS0FBSyxDQUFDLElBQUksQ0FBQztJQUNQLEdBQUcsRUFBRSxPQUFPLENBQUMsR0FBRyxDQUFDLEtBQUs7Q0FDekIsQ0FBQyxDQUFDO0FBRUgsSUFBTSxFQUFFLEdBQWdCLEtBQUssQ0FBQyxRQUFRLEVBQUcsQ0FBQztBQW1CN0IsUUFBQSxJQUFJLEdBQUcsVUFBUSxLQUFLLEVBQUUsT0FBTzs7OztRQUVoQyxHQUFHLEdBQUcsSUFBSSxTQUFTLENBQUMsRUFBRSxLQUFLLE9BQUEsRUFBRSxDQUFDLENBQUM7UUFrQnJDLEdBQUcsQ0FBQyxNQUFNLENBQUMsUUFBUSxFQUFFLFVBQU8sR0FBRyxFQUFFLElBQUk7Ozs7Ozt3QkFHdkIsTUFBTSxHQUFHLEtBQUssQ0FBQyxJQUFJLENBQUMsTUFBTSxJQUFJLEtBQUssQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDO3dCQUNwRCxJQUFJLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQyxFQUFHLEVBQUUsS0FBSyxDQUFDLElBQUksRUFBRTs0QkFDeEMsTUFBTSxRQUFBOzRCQUNOLE1BQU0sRUFBRSxLQUFLOzRCQUNiLE9BQU8sRUFBRSxLQUFLLENBQUMsSUFBSSxDQUFDLE9BQU8sSUFBSSxLQUFLLENBQUMsSUFBSSxDQUFDLEdBQUc7NEJBQzdDLFdBQVcsRUFBRSxLQUFLLENBQUMsSUFBSSxDQUFDLFdBQVcsSUFBSSxNQUFNOzRCQUM3QyxVQUFVLEVBQUUsSUFBSSxJQUFJLEVBQUcsQ0FBQyxPQUFPLEVBQUc7eUJBQ3JDLENBQUMsQ0FBQzt3QkFFVSxXQUFNLEVBQUUsQ0FBQyxVQUFVLENBQUMsUUFBUSxDQUFDO2lDQUNyQyxHQUFHLENBQUM7Z0NBQ0QsSUFB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QUMsSUFBSSxDQUFFLFVBQUEsQ0FBQyxJQUFJLE9BQUEsQ0FBQyxDQUFDLEdBQUcsS0FBSyxNQUFNLENBQUMsR0FBRyxFQUFwQixDQUFvQixDQUFFLENBQUM7NEJBQ3pELE9BQU8sTUFBTSxDQUFDLE1BQU0sQ0FBQyxFQUFHLEVBQUUsTUFBTSxFQUFFO2dDQUM5QixJQUFJLEVBQUUsUUFBUSxJQUFJLElBQUk7NkJBQ3pCLENBQUMsQ0FBQTt3QkFDTixDQUFDLENBQUMsQ0FBQzt3QkFFSCxXQUFPLEdBQUcsQ0FBQyxJQUFJLEdBQUc7Z0NBQ2QsTUFBTSxFQUFFLEdBQUc7Z0NBQ1gsSUFBSSxFQUFFLElBQUk7NkJBQ2IsRUFBQTs7O3dCQUdELFdBQU8sR0FBRyxDQUFDLElBQUksR0FBRyxFQUFFLE1BQU0sRUFBRSxHQUFHLEVBQUUsRUFBQzs7OzthQUV6QyxDQUFDLENBQUE7UUFFRixXQUFPLEdBQUcsQ0FBQyxLQUFLLEVBQUcsRUFBQzs7S0FDdkIsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIGNsb3VkIGZyb20gJ3d4LXNlcnZlci1zZGsnO1xuaW1wb3J0ICogYXMgVGNiUm91dGVyIGZyb20gJ3RjYi1yb3V0ZXInO1xuXG5jbG91ZC5pbml0KHtcbiAgICBlbnY6IHByb2Nlc3MuZW52LmNsb3VkXG59KTtcblxuY29uc3QgZGI6IERCLkRhdGFiYXNlID0gY2xvdWQuZGF0YWJhc2UoICk7XG5cbi8qKlxuICpcbiAqIEBkZXNjcmlwdGlvbiDljaHliLjmqKHlnZdcbiAqIC0tLS0tLS0tIOWtl+autSAtLS0tLS0tLS0tXG4gKiAhIHRpZCDpooblj5bor6XkvJjmg6DliLjnmoTmiYDlsZ7ooYznqIvvvIjlj6/ml6DvvIlcbiAqIHRpdGxlIOWIuOWQjeensFxuICogdXNlZEJ5OiDooqt4eHjooYznqIvmiYDkvb/nlKhcbiAqIHR5cGU6ICd0X2xpamlhbicgfCAndF9tYW5qaWFuJyB8ICd0X2RhaWppbicg5Yi457G75Z6L77ya6KGM56iL56uL5YeP44CB6KGM56iL5ruh5YeP44CB6KGM56iL5Luj6YeR5Yi4XG4gKiBpc1VzZWQ6IOaYr+WQpuW3sueUqFxuICogb3BlbmlkXG4gKiBjYW5Vc2VJbk5leHQ6IOaYr+WQpuS4i+i2n+WPr+eUqFxuICogYXRsZWFzdDog5raI6LS56Zeo5qebXG4gKiB2YWx1Ze+8mua2iOi0ueS8mOaDoOmineW6plxuICohIHZhbGl0ZXJtOiDmnInmlYjmnJ/ml6XmnJ8o5Y+v5pegKVxuICogY3JlYXRlVGltZSDliJvlu7rml6XmnJ9cbiAqIHJlZHVjZV90eXBlOiAneXVhbicgfCAncGVyY2VudCcg5LyY5oOg57G75Z6L77ya5YWD44CB5oqY5omjXG4gKi9cbmV4cG9ydCBjb25zdCBtYWluID0gYXN5bmMgKCBldmVudCwgY29udGV4dCApID0+IHtcblxuICAgIGNvbnN0IGFwcCA9IG5ldyBUY2JSb3V0ZXIoeyBldmVudCB9KTtcblxuICAgIC8qKlxuICAgICAqIEBkZXNjcmlwdGlvbiDliJvlu7rkvJjmg6DliLhcbiAgICAgKiAtLS0tLS0tLSDor7fmsYIgLS0tLS0tLS0tXG4gICAgICoge1xuICAgICAqICAgdGlkXG4gICAgICogICB0aXRsZVxuICAgICAqICAgb3BlbmlkICBcbiAgICAgKiAgIHR5cGVcbiAgICAgKiAgIGNhblVzZUluTmV4dFxuICAgICAqICAgYXRsZWFzdFxuICAgICAqICAgdmFsdWVcbiAgICAgKiAgIGZyb210aWRcbiAgICAgKiEgICB2YWxpdGVybVxuICAgICAqISAgIHJlZHVjZV90eXBlXG4gICAgICogfVxuICAgICAqL1xuICAgIGFwcC5yb3V0ZXIoJ2NyZWF0ZScsIGFzeW5jKCBjdHgsIG5leHQgKSA9PiB7XG4gICAgICAgIHRyeSB7XG5cbiAgICAgICAgICAgIGNvbnN0IG9wZW5pZCA9IGV2ZW50LmRhdGEub3BlbklkIHx8IGV2ZW50LnVzZXJJbmZvLm9wZW5JZDtcbiAgICAgICAgICAgIGNvbnN0IHRlbXAgPSBPYmplY3QuYXNzaWduKHsgfSwgZXZlbnQuZGF0YSwge1xuICAgICAgICAgICAgICAgIG9wZW5pZCxcbiAgICAgICAgICAgICAgICBpc1VzZWQ6IGZhbHNlLFxuICAgICAgICAgICAgICAgIGZyb210aWQ6IGV2ZW50LmRhdGEuZnJvbXRpZCB8fCBldmVudC5kYXRhLnRpZCxcbiAgICAgICAgICAgICAgICByZWR1Y2VfdHlwZTogZXZlbnQuZGF0YS5yZWR1Y2VfdHlwZSB8fCAneXVhbicsXG4gICAgICAgICAgICAgICAgY3JlYXRlVGltZTogbmV3IERhdGUoICkuZ2V0VGltZSggKVxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIGNvbnN0IGFkZCQgPSBhd2FpdCBkYi5jb2xsZWN0aW9uKCdjb3Vwb24nKVxuICAgICAgICAgICAgICAgIC5hZGQoe1xuICAgICAgICAgICAgICAgICAgICBkYXRhOiB0ZW1wXG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHJldHVybiBjdHguYm9keSA9IHtcbiAgICAgICAgICAgICAgICBzdGF0dXM6IDIwMCxcbiAgICAgICAgICAgICAgICBkYXRhOiBhZGQkLl9pZFxuICAgICAgICAgICAgfVxuICAgICAgICB9IGNhdGNoICggZSApIHsgcmV0dXJuIGN0eC5ib2R5ID0geyBzdGF0dXM6IDUwMCB9O31cbiAgICB9KTtcblxuICAgIC8qKlxuICAgICAqIEBkZXNjcmlwdGlvbiDooaXpvZDnq4vlh4/liLhcbiAgICAgKiAtLS0tLS0tLSDor7fmsYIgLS0tLS0tLS1cbiAgICAgKiB7XG4gICAgICogICAgdGlkXG4gICAgICogfVxuICAgICAqL1xuICAgIGFwcC5yb3V0ZXIoJ3JlcGFpci1saWppYW4nLCBhc3luYyggY3R4LCBuZXh0ICkgPT4ge1xuICAgICAgICB0cnkge1xuXG4gICAgICAgICAgICBjb25zdCB7IHRpZCB9ID0gZXZlbnQuZGF0YTtcbiAgICAgICAgICAgIGNvbnN0IG9wZW5pZCA9IGV2ZW50LmRhdGEub3BlbklkIHx8IGV2ZW50LnVzZXJJbmZvLm9wZW5JZDtcblxuICAgICAgICAgICAgY29uc3QgdHJpcCQgPSBhd2FpdCBkYi5jb2xsZWN0aW9uKCd0cmlwJylcbiAgICAgICAgICAgICAgICAuZG9jKCB0aWQgKVxuICAgICAgICAgICAgICAgIC5nZXQoICk7XG5cbiAgICAgICAgICAgIGNvbnN0IHRyaXAgPSB0cmlwJC5kYXRhO1xuICAgICAgICAgICAgY29uc3QgeyByZWR1Y2VfcHJpY2UgfSA9IHRyaXA7XG5cbiAgICAgICAgICAgIGNvbnN0IGZpbmQkID0gYXdhaXQgZGIuY29sbGVjdGlvbignY291cG9uJylcbiAgICAgICAgICAgICAgICAud2hlcmUoe1xuICAgICAgICAgICAgICAgICAgICB0aWQsXG4gICAgICAgICAgICAgICAgICAgIG9wZW5pZCxcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogJ3RfbGlqaWFuJ1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLmdldCggKTtcbiAgICAgICAgICAgIGNvbnN0IHRhcmdldCA9IGZpbmQkLmRhdGFbIDAgXTtcblxuICAgICAgICAgICAgLy8g5YWo6aKd6KGl6b2QXG4gICAgICAgICAgICBpZiAoICF0YXJnZXQgJiYgISFyZWR1Y2VfcHJpY2UgKSB7XG4gICAgICAgICAgICAgICAgYXdhaXQgZGIuY29sbGVjdGlvbignY291cG9uJylcbiAgICAgICAgICAgICAgICAgICAgLmFkZCh7XG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGlkLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9wZW5pZCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhdGxlYXN0OiAwLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZyb210aWQ6IHRpZCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZTogcmVkdWNlX3ByaWNlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6ICd0X2xpamlhbicsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaXNVc2VkOiBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYW5Vc2VJbk5leHQ6IGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRpdGxlOiAn6KGM56iL56uL5YeP5LyY5oOg5Yi4JyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZWR1Y2VfdHlwZTogJ3l1YW4nLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNyZWF0ZVRpbWU6IG5ldyBEYXRlKCApLmdldFRpbWUoIClcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8g5beu6aKd6KGl6b2QXG4gICAgICAgICAgICBpZiAoICEhdGFyZ2V0ICYmICEhcmVkdWNlX3ByaWNlICkge1xuICAgICAgICAgICAgICAgIGF3YWl0IGRiLmNvbGxlY3Rpb24oJ2NvdXBvbicpXG4gICAgICAgICAgICAgICAgICAgIC5kb2MoIFN0cmluZyggdGFyZ2V0Ll9pZCApKVxuICAgICAgICAgICAgICAgICAgICAudXBkYXRlKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZTogcmVkdWNlX3ByaWNlXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgXG5cbiAgICAgICAgICAgIHJldHVybiBjdHguYm9keSA9IHtcbiAgICAgICAgICAgICAgICBzdGF0dXM6IDIwMFxuICAgICAgICAgICAgfTtcblxuICAgICAgICB9IGNhdGNoICggZSApIHtcbiAgICAgICAgICAgIHJldHVybiBjdHguYm9keSA9IHsgc3RhdHVzOiA1MDAgfTtcbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgLyoqXG4gICAgICogQGRlc2NyaXB0aW9uIOajgOa1i+ihjOeoi+mHjOmdou+8jOWuouaIt+aYr+WQpuW3sue7j+mihuWPlui/meWHoOexu+eahOS8mOaDoOWIuCwgbnVsbOS4uuayoeacieivpeexu+Wei+S8mOaDoO+8jHRydWXkuLrlt7Lnu4/pooblj5bvvIxmYWxzZeS4uuacqumihuWPllxuICAgICAqIC0tLS0tLS0tIOivt+axgiAtLS0tLS0tXG4gICAgICoge1xuICAgICAqICAgdGlkOiBcbiAgICAgKiAgIG9wZW5pZDogXG4gICAgICogICBjaGVjazogJ3RfbGlqaWFuLHRfbWFuamlhbix0X2RhaWppbidcbiAgICAgKiB9XG4gICAgICogLS0tLS0g6L+U5ZueIC0tLS0tXG4gICAgICoge1xuICAgICAqICAgc3RhdHVzLFxuICAgICAqICAgZGF0YToge1xuICAgICAqICAgICB0X2xpamlhbjogbnVsbC90cnVlL2ZhbHNlL2hhbGZcbiAgICAgKiAgICAgdF9tYW5qaWFuOiBudWxsL3RydWUvZmFsc2VcbiAgICAgKiAgICAgdF9kYWlqaW46IG51bGwvdHJ1ZS9mYWxzZVxuICAgICAqICAgfSBcbiAgICAgKiB9XG4gICAgICovXG4gICAgYXBwLnJvdXRlcignaXNnZXQnLCBhc3luYyggY3R4LCBuZXh0ICkgPT4ge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgXG4gICAgICAgICAgICBjb25zdCB7IHRpZCwgY2hlY2sgfSA9IGV2ZW50LmRhdGE7XG4gICAgICAgICAgICBjb25zdCBvcGVuaWQgPSBldmVudC5kYXRhLm9wZW5JZCB8fCBldmVudC51c2VySW5mby5vcGVuSWQ7XG5cbiAgICAgICAgICAgIC8vIOWFiOajgOafpe+8jOivpeihjOeoi+acieayoeacieivpeenjeS8mOaDoFxuICAgICAgICAgICAgY29uc3QgdHJpcCQgPSBhd2FpdCBkYi5jb2xsZWN0aW9uKCd0cmlwJylcbiAgICAgICAgICAgICAgICAuZG9jKCB0aWQgKVxuICAgICAgICAgICAgICAgIC5nZXQoICk7XG5cbiAgICAgICAgICAgIGNvbnN0IHRyaXAgPSB0cmlwJC5kYXRhO1xuXG4gICAgICAgICAgICAvLyDooYznqIvnq4vlh4/ph5Hpop0v6KGM56iL5ruh5YeP6YeR6aKdL+ihjOeoi+S7o+mHkeWIuOmHkeminVxuICAgICAgICAgICAgY29uc3QgeyByZWR1Y2VfcHJpY2UsIGZ1bGxyZWR1Y2VfdmFsdWVzLCBjYXNoY291cG9uX3ZhbHVlcyB9ID0gdHJpcDtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgLy8g6KGM56iL56uL5YeP5Luj6YeR5Yi4XG4gICAgICAgICAgICBjb25zdCBsaWppYW4kID0gYXdhaXQgZGIuY29sbGVjdGlvbignY291cG9uJylcbiAgICAgICAgICAgICAgICAud2hlcmUoe1xuICAgICAgICAgICAgICAgICAgICB0aWQsXG4gICAgICAgICAgICAgICAgICAgIG9wZW5pZCxcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogJ3RfbGlqaWFuJ1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLmdldCggKTtcblxuICAgICAgICAgICAgLy8g6KGM56iL5ruh5YeP5Yi4XG4gICAgICAgICAgICBjb25zdCBtYW5qaWFuJCA9IGF3YWl0IGRiLmNvbGxlY3Rpb24oJ2NvdXBvbicpXG4gICAgICAgICAgICAgICAgLndoZXJlKHtcbiAgICAgICAgICAgICAgICAgICAgdGlkLFxuICAgICAgICAgICAgICAgICAgICBvcGVuaWQsXG4gICAgICAgICAgICAgICAgICAgIHR5cGU6ICd0X21hbmppYW4nXG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAuZ2V0KCApO1xuXG4gICAgICAgICAgICAvLyDooYznqIvnq4vlh4/liLhcbiAgICAgICAgICAgIGNvbnN0IGRhaWppbiQgPSBhd2FpdCBkYi5jb2xsZWN0aW9uKCdjb3Vwb24nKVxuICAgICAgICAgICAgICAgIC53aGVyZSh7XG4gICAgICAgICAgICAgICAgICAgIHRpZCxcbiAgICAgICAgICAgICAgICAgICAgb3BlbmlkLFxuICAgICAgICAgICAgICAgICAgICB0eXBlOiAndF9kYWlqaW4nXG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAuZ2V0KCApO1xuXG4gICAgICAgICAgICBjb25zdCB0ZW1wID0geyB9O1xuICAgICAgICAgICAgY2hlY2suc3BsaXQoJywnKS5tYXAoIGNoZWNrVHlwZSA9PiB7XG5cbiAgICAgICAgICAgICAgICBpZiAoIGNoZWNrVHlwZSA9PT0gJ3RfbWFuamlhbicgKSB7XG4gICAgICAgICAgICAgICAgICAgIHRlbXBbIGNoZWNrVHlwZSBdID0gISFmdWxscmVkdWNlX3ZhbHVlcyA/XG4gICAgICAgICAgICAgICAgICAgICAgICBtYW5qaWFuJC5kYXRhLmxlbmd0aCA9PT0gMCA/IFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZhbHNlIDpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0cnVlIDpcbiAgICAgICAgICAgICAgICAgICAgICAgIG51bGxcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKCBjaGVja1R5cGUgPT09ICd0X2RhaWppbicgKSB7XG4gICAgICAgICAgICAgICAgICAgIHRlbXBbIGNoZWNrVHlwZSBdID0gISFjYXNoY291cG9uX3ZhbHVlcyA/XG4gICAgICAgICAgICAgICAgICAgICAgICBkYWlqaW4kLmRhdGEubGVuZ3RoID09PSAwID8gXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZmFsc2UgOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRydWUgOlxuICAgICAgICAgICAgICAgICAgICAgICAgbnVsbFxuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoIGNoZWNrVHlwZSA9PT0gJ3RfbGlqaWFuJyApIHtcbiAgICAgICAgICAgICAgICAgICAgdGVtcFsgY2hlY2tUeXBlIF0gPSAhIXJlZHVjZV9wcmljZSA/XG4gICAgICAgICAgICAgICAgICAgICAgICBsaWppYW4kLmRhdGEubGVuZ3RoID09PSAwID8gXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZmFsc2UgOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxpamlhbiQuZGF0YVsgMCBdLnZhbHVlIDwgcmVkdWNlX3ByaWNlID9cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ2hhbGYnIDpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdHJ1ZSA6XG4gICAgICAgICAgICAgICAgICAgICAgICBudWxsXG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgcmV0dXJuIGN0eC5ib2R5ID0ge1xuICAgICAgICAgICAgICAgIHN0YXR1czogMjAwLFxuICAgICAgICAgICAgICAgIGRhdGE6IHRlbXBcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBjYXRjaCAoIGUgKSB7IHJldHVybiBjdHguYm9keSA9IHsgc3RhdHVzIDo1MDAgfTt9XG4gICAgfSlcbiAgICBcbiAgICAvKiogXG4gICAgICogQGRlc2NyaXB0aW9uIOWNoeWIuOWIl+ihqFxuICAgICAqL1xuICAgIGFwcC5yb3V0ZXIoJ2xpc3QnLCBhc3luYyggY3R4LCBuZXh0ICkgPT4ge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgXG4gICAgICAgICAgICBjb25zdCBvcGVuaWQgPSBldmVudC5kYXRhLm9wZW5JZCB8fCBldmVudC51c2VySW5mby5vcGVuSWQ7XG4gICAgICAgICAgICBjb25zdCB7IGlzVXNlZCB9ID0gZXZlbnQuZGF0YTtcbiAgICAgICAgICAgIGxldCBxdWVyeSQgPSB7XG4gICAgICAgICAgICAgICAgb3BlbmlkXG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICBpZiAoIGlzVXNlZCAhPT0gdW5kZWZpbmVkICkge1xuICAgICAgICAgICAgICAgIHF1ZXJ5JCA9IE9iamVjdC5hc3NpZ24oeyB9LCBxdWVyeSQsIHtcbiAgICAgICAgICAgICAgICAgICAgaXNVc2VkXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGNvbnN0IGxpc3QkID0gYXdhaXQgZGIuY29sbGVjdGlvbignY291cG9uJylcbiAgICAgICAgICAgICAgICAud2hlcmUoIHF1ZXJ5JCApXG4gICAgICAgICAgICAgICAgLmdldCggKTtcblxuICAgICAgICAgICAgLy8g6KGM56iL5L+h5oGvXG4gICAgICAgICAgICBjb25zdCB0cmlwc0lkcyA9IEFycmF5LmZyb20oIG5ldyBTZXQoIGxpc3QkLmRhdGEubWFwKCB4ID0+IHgudGlkICkpKTtcbiAgICAgICAgICAgIGNvbnN0IHRyaXBzJCA9IGF3YWl0IFByb21pc2UuYWxsKCB0cmlwc0lkcy5tYXAoIHRpZCA9PiB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGRiLmNvbGxlY3Rpb24oJ3RyaXAnKVxuICAgICAgICAgICAgICAgICAgICAuZG9jKCB0aWQgKVxuICAgICAgICAgICAgICAgICAgICAuZ2V0KCApO1xuICAgICAgICAgICAgfSkpO1xuXG4gICAgICAgICAgICBjb25zdCB0cmlwcyA9IHRyaXBzJC5tYXAoIHggPT4geC5kYXRhICk7XG5cbiAgICAgICAgICAgIC8vIOWNoeWIuOaPkuWFpeihjOeoi1xuICAgICAgICAgICAgY29uc3QgbGlzdCA9IGxpc3QkLmRhdGEubWFwKCBjb3Vwb24gPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IHRyaXBNZXRhID0gdHJpcHMuZmluZCggeCA9PiB4Ll9pZCA9PT0gY291cG9uLnRpZCApO1xuICAgICAgICAgICAgICAgIHJldHVybiBPYmplY3QuYXNzaWduKHsgfSwgY291cG9uLCB7XG4gICAgICAgICAgICAgICAgICAgIHRyaXA6IHRyaXBNZXRhIHx8IG51bGxcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIHJldHVybiBjdHguYm9keSA9IHtcbiAgICAgICAgICAgICAgICBzdGF0dXM6IDIwMCxcbiAgICAgICAgICAgICAgICBkYXRhOiBsaXN0XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfSBjYXRjaCAoIGUgKSB7XG4gICAgICAgICAgICByZXR1cm4gY3R4LmJvZHkgPSB7IHN0YXR1czogNTAwIH07XG4gICAgICAgIH1cbiAgICB9KVxuXG4gICAgcmV0dXJuIGFwcC5zZXJ2ZSggKTtcbn07Il19