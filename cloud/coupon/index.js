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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSxpQkE0UkU7O0FBNVJGLHFDQUF1QztBQUN2QyxzQ0FBd0M7QUFFeEMsS0FBSyxDQUFDLElBQUksRUFBRyxDQUFDO0FBRWQsSUFBTSxFQUFFLEdBQWdCLEtBQUssQ0FBQyxRQUFRLEVBQUcsQ0FBQztBQW1CN0IsUUFBQSxJQUFJLEdBQUcsVUFBUSxLQUFLLEVBQUUsT0FBTzs7OztRQUVoQyxHQUFHLEdBQUcsSUFBSSxTQUFTLENBQUMsRUFBRSxLQUFLLE9BQUEsRUFBRSxDQUFDLENBQUM7UUFrQnJDLEdBQUcsQ0FBQyxNQUFNLENBQUMsUUFBUSxFQUFFLFVBQU8sR0FBRyxFQUFFLElBQUk7Ozs7Ozt3QkFHdkIsTUFBTSxHQUFHLEtBQUssQ0FBQyxJQUFJLENBQUMsTUFBTSxJQUFJLEtBQUssQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDO3dCQUNwRCxJQUFJLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQyxFQUFHLEVBQUUsS0FBSyxDQUFDLElBQUksRUFBRTs0QkFDeEMsTUFBTSxRQUFBOzRCQUNOLE1BQU0sRUFBRSxLQUFLOzRCQUNiLE9BQU8sRUFBRSxLQUFLLENBQUMsSUFBSSxDQUFDLE9BQU8sSUFBSSxLQUFLLENBQUMsSUFBSSxDQUFDLEdBQUc7NEJBQzdDLFdBQVcsRUFBRSxLQUFLLENBQUMsSUFBSSxDQUFDLFdBQVcsSUFBSSxNQUFNOzRCQUM3QyxVQUFVLEVBQUUsSUFBSSxJQUFJLEVBQUcsQ0FBQyxPQUFPLEVBQUc7eUJBQ3JDLENBQUMsQ0FBQzt3QkFFVSxXQUFNLEVBQUUsQ0FBQyxVQUFVLENBQUMsUUFBUSxDQUFDO2lDQUNyQyxHQUFHLENBQUM7Z0NBQ0QsSUFBSSxFQUFFLElBQUk7NkJBQ2IsQ0FBQyxFQUFBOzt3QkFIQSxJQUFJLEdBQUcsU0FHUDt3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SyxNQUFNLENBQUMsR0FBRyxFQUFwQixDQUFvQixDQUFFLENBQUM7NEJBQ3pELE9BQU8sTUFBTSxDQUFDLE1BQU0sQ0FBQyxFQUFHLEVBQUUsTUFBTSxFQUFFO2dDQUM5QixJQUFJLEVBQUUsUUFBUSxJQUFJLElBQUk7NkJBQ3pCLENBQUMsQ0FBQTt3QkFDTixDQUFDLENBQUMsQ0FBQzt3QkFFSCxXQUFPLEdBQUcsQ0FBQyxJQUFJLEdBQUc7Z0NBQ2QsTUFBTSxFQUFFLEdBQUc7Z0NBQ1gsSUFBSSxFQUFFLElBQUk7NkJBQ2IsRUFBQTs7O3dCQUdELFdBQU8sR0FBRyxDQUFDLElBQUksR0FBRyxFQUFFLE1BQU0sRUFBRSxHQUFHLEVBQUUsRUFBQzs7OzthQUV6QyxDQUFDLENBQUE7UUFFRixXQUFPLEdBQUcsQ0FBQyxLQUFLLEVBQUcsRUFBQzs7S0FDdkIsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIGNsb3VkIGZyb20gJ3d4LXNlcnZlci1zZGsnO1xuaW1wb3J0ICogYXMgVGNiUm91dGVyIGZyb20gJ3RjYi1yb3V0ZXInO1xuXG5jbG91ZC5pbml0KCApO1xuXG5jb25zdCBkYjogREIuRGF0YWJhc2UgPSBjbG91ZC5kYXRhYmFzZSggKTtcblxuLyoqXG4gKlxuICogQGRlc2NyaXB0aW9uIOWNoeWIuOaooeWdl1xuICogLS0tLS0tLS0g5a2X5q61IC0tLS0tLS0tLS1cbiAqICEgdGlkIOmihuWPluivpeS8mOaDoOWIuOeahOaJgOWxnuihjOeoi++8iOWPr+aXoO+8iVxuICogdGl0bGUg5Yi45ZCN56ewXG4gKiB1c2VkQnk6IOiiq3h4eOihjOeoi+aJgOS9v+eUqFxuICogdHlwZTogJ3RfbGlqaWFuJyB8ICd0X21hbmppYW4nIHwgJ3RfZGFpamluJyDliLjnsbvlnovvvJrooYznqIvnq4vlh4/jgIHooYznqIvmu6Hlh4/jgIHooYznqIvku6Pph5HliLhcbiAqIGlzVXNlZDog5piv5ZCm5bey55SoXG4gKiBvcGVuaWRcbiAqIGNhblVzZUluTmV4dDog5piv5ZCm5LiL6Laf5Y+v55SoXG4gKiBhdGxlYXN0OiDmtojotLnpl6jmp5tcbiAqIHZhbHVl77ya5raI6LS55LyY5oOg6aKd5bqmXG4gKiEgdmFsaXRlcm06IOacieaViOacn+aXpeacnyjlj6/ml6ApXG4gKiBjcmVhdGVUaW1lIOWIm+W7uuaXpeacn1xuICogcmVkdWNlX3R5cGU6ICd5dWFuJyB8ICdwZXJjZW50JyDkvJjmg6DnsbvlnovvvJrlhYPjgIHmipjmiaNcbiAqL1xuZXhwb3J0IGNvbnN0IG1haW4gPSBhc3luYyAoIGV2ZW50LCBjb250ZXh0ICkgPT4ge1xuXG4gICAgY29uc3QgYXBwID0gbmV3IFRjYlJvdXRlcih7IGV2ZW50IH0pO1xuXG4gICAgLyoqXG4gICAgICogQGRlc2NyaXB0aW9uIOWIm+W7uuS8mOaDoOWIuFxuICAgICAqIC0tLS0tLS0tIOivt+axgiAtLS0tLS0tLS1cbiAgICAgKiB7XG4gICAgICogICB0aWRcbiAgICAgKiAgIHRpdGxlXG4gICAgICogICBvcGVuaWQgIFxuICAgICAqICAgdHlwZVxuICAgICAqICAgY2FuVXNlSW5OZXh0XG4gICAgICogICBhdGxlYXN0XG4gICAgICogICB2YWx1ZVxuICAgICAqICAgZnJvbXRpZFxuICAgICAqISAgIHZhbGl0ZXJtXG4gICAgICohICAgcmVkdWNlX3R5cGVcbiAgICAgKiB9XG4gICAgICovXG4gICAgYXBwLnJvdXRlcignY3JlYXRlJywgYXN5bmMoIGN0eCwgbmV4dCApID0+IHtcbiAgICAgICAgdHJ5IHtcblxuICAgICAgICAgICAgY29uc3Qgb3BlbmlkID0gZXZlbnQuZGF0YS5vcGVuSWQgfHwgZXZlbnQudXNlckluZm8ub3BlbklkO1xuICAgICAgICAgICAgY29uc3QgdGVtcCA9IE9iamVjdC5hc3NpZ24oeyB9LCBldmVudC5kYXRhLCB7XG4gICAgICAgICAgICAgICAgb3BlbmlkLFxuICAgICAgICAgICAgICAgIGlzVXNlZDogZmFsc2UsXG4gICAgICAgICAgICAgICAgZnJvbXRpZDogZXZlbnQuZGF0YS5mcm9tdGlkIHx8IGV2ZW50LmRhdGEudGlkLFxuICAgICAgICAgICAgICAgIHJlZHVjZV90eXBlOiBldmVudC5kYXRhLnJlZHVjZV90eXBlIHx8ICd5dWFuJyxcbiAgICAgICAgICAgICAgICBjcmVhdGVUaW1lOiBuZXcgRGF0ZSggKS5nZXRUaW1lKCApXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgY29uc3QgYWRkJCA9IGF3YWl0IGRiLmNvbGxlY3Rpb24oJ2NvdXBvbicpXG4gICAgICAgICAgICAgICAgLmFkZCh7XG4gICAgICAgICAgICAgICAgICAgIGRhdGE6IHRlbXBcbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgcmV0dXJuIGN0eC5ib2R5ID0ge1xuICAgICAgICAgICAgICAgIHN0YXR1czogMjAwLFxuICAgICAgICAgICAgICAgIGRhdGE6IGFkZCQuX2lkXG4gICAgICAgICAgICB9XG4gICAgICAgIH0gY2F0Y2ggKCBlICkgeyByZXR1cm4gY3R4LmJvZHkgPSB7IHN0YXR1czogNTAwIH07fVxuICAgIH0pO1xuXG4gICAgLyoqXG4gICAgICogQGRlc2NyaXB0aW9uIOihpem9kOeri+WHj+WIuFxuICAgICAqIC0tLS0tLS0tIOivt+axgiAtLS0tLS0tLVxuICAgICAqIHtcbiAgICAgKiAgICB0aWRcbiAgICAgKiB9XG4gICAgICovXG4gICAgYXBwLnJvdXRlcigncmVwYWlyLWxpamlhbicsIGFzeW5jKCBjdHgsIG5leHQgKSA9PiB7XG4gICAgICAgIHRyeSB7XG5cbiAgICAgICAgICAgIGNvbnN0IHsgdGlkIH0gPSBldmVudC5kYXRhO1xuICAgICAgICAgICAgY29uc3Qgb3BlbmlkID0gZXZlbnQuZGF0YS5vcGVuSWQgfHwgZXZlbnQudXNlckluZm8ub3BlbklkO1xuXG4gICAgICAgICAgICBjb25zdCB0cmlwJCA9IGF3YWl0IGRiLmNvbGxlY3Rpb24oJ3RyaXAnKVxuICAgICAgICAgICAgICAgIC5kb2MoIHRpZCApXG4gICAgICAgICAgICAgICAgLmdldCggKTtcblxuICAgICAgICAgICAgY29uc3QgdHJpcCA9IHRyaXAkLmRhdGE7XG4gICAgICAgICAgICBjb25zdCB7IHJlZHVjZV9wcmljZSB9ID0gdHJpcDtcblxuICAgICAgICAgICAgY29uc3QgZmluZCQgPSBhd2FpdCBkYi5jb2xsZWN0aW9uKCdjb3Vwb24nKVxuICAgICAgICAgICAgICAgIC53aGVyZSh7XG4gICAgICAgICAgICAgICAgICAgIHRpZCxcbiAgICAgICAgICAgICAgICAgICAgb3BlbmlkLFxuICAgICAgICAgICAgICAgICAgICB0eXBlOiAndF9saWppYW4nXG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAuZ2V0KCApO1xuICAgICAgICAgICAgY29uc3QgdGFyZ2V0ID0gZmluZCQuZGF0YVsgMCBdO1xuXG4gICAgICAgICAgICAvLyDlhajpop3ooaXpvZBcbiAgICAgICAgICAgIGlmICggIXRhcmdldCAmJiAhIXJlZHVjZV9wcmljZSApIHtcbiAgICAgICAgICAgICAgICBhd2FpdCBkYi5jb2xsZWN0aW9uKCdjb3Vwb24nKVxuICAgICAgICAgICAgICAgICAgICAuYWRkKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aWQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb3BlbmlkLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGF0bGVhc3Q6IDAsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZnJvbXRpZDogdGlkLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlOiByZWR1Y2VfcHJpY2UsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogJ3RfbGlqaWFuJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpc1VzZWQ6IGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhblVzZUluTmV4dDogZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGl0bGU6ICfooYznqIvnq4vlh4/kvJjmg6DliLgnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlZHVjZV90eXBlOiAneXVhbicsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY3JlYXRlVGltZTogbmV3IERhdGUoICkuZ2V0VGltZSggKVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyDlt67pop3ooaXpvZBcbiAgICAgICAgICAgIGlmICggISF0YXJnZXQgJiYgISFyZWR1Y2VfcHJpY2UgKSB7XG4gICAgICAgICAgICAgICAgYXdhaXQgZGIuY29sbGVjdGlvbignY291cG9uJylcbiAgICAgICAgICAgICAgICAgICAgLmRvYyggU3RyaW5nKCB0YXJnZXQuX2lkICkpXG4gICAgICAgICAgICAgICAgICAgIC51cGRhdGUoe1xuICAgICAgICAgICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlOiByZWR1Y2VfcHJpY2VcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBcblxuICAgICAgICAgICAgcmV0dXJuIGN0eC5ib2R5ID0ge1xuICAgICAgICAgICAgICAgIHN0YXR1czogMjAwXG4gICAgICAgICAgICB9O1xuXG4gICAgICAgIH0gY2F0Y2ggKCBlICkge1xuICAgICAgICAgICAgcmV0dXJuIGN0eC5ib2R5ID0geyBzdGF0dXM6IDUwMCB9O1xuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICAvKipcbiAgICAgKiBAZGVzY3JpcHRpb24g5qOA5rWL6KGM56iL6YeM6Z2i77yM5a6i5oi35piv5ZCm5bey57uP6aKG5Y+W6L+Z5Yeg57G755qE5LyY5oOg5Yi4LCBudWxs5Li65rKh5pyJ6K+l57G75Z6L5LyY5oOg77yMdHJ1ZeS4uuW3sue7j+mihuWPlu+8jGZhbHNl5Li65pyq6aKG5Y+WXG4gICAgICogLS0tLS0tLS0g6K+35rGCIC0tLS0tLS1cbiAgICAgKiB7XG4gICAgICogICB0aWQ6IFxuICAgICAqICAgb3BlbmlkOiBcbiAgICAgKiAgIGNoZWNrOiAndF9saWppYW4sdF9tYW5qaWFuLHRfZGFpamluJ1xuICAgICAqIH1cbiAgICAgKiAtLS0tLSDov5Tlm54gLS0tLS1cbiAgICAgKiB7XG4gICAgICogICBzdGF0dXMsXG4gICAgICogICBkYXRhOiB7XG4gICAgICogICAgIHRfbGlqaWFuOiBudWxsL3RydWUvZmFsc2UvaGFsZlxuICAgICAqICAgICB0X21hbmppYW46IG51bGwvdHJ1ZS9mYWxzZVxuICAgICAqICAgICB0X2RhaWppbjogbnVsbC90cnVlL2ZhbHNlXG4gICAgICogICB9IFxuICAgICAqIH1cbiAgICAgKi9cbiAgICBhcHAucm91dGVyKCdpc2dldCcsIGFzeW5jKCBjdHgsIG5leHQgKSA9PiB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGNvbnN0IHsgdGlkLCBjaGVjayB9ID0gZXZlbnQuZGF0YTtcbiAgICAgICAgICAgIGNvbnN0IG9wZW5pZCA9IGV2ZW50LmRhdGEub3BlbklkIHx8IGV2ZW50LnVzZXJJbmZvLm9wZW5JZDtcblxuICAgICAgICAgICAgLy8g5YWI5qOA5p+l77yM6K+l6KGM56iL5pyJ5rKh5pyJ6K+l56eN5LyY5oOgXG4gICAgICAgICAgICBjb25zdCB0cmlwJCA9IGF3YWl0IGRiLmNvbGxlY3Rpb24oJ3RyaXAnKVxuICAgICAgICAgICAgICAgIC5kb2MoIHRpZCApXG4gICAgICAgICAgICAgICAgLmdldCggKTtcblxuICAgICAgICAgICAgY29uc3QgdHJpcCA9IHRyaXAkLmRhdGE7XG5cbiAgICAgICAgICAgIC8vIOihjOeoi+eri+WHj+mHkeminS/ooYznqIvmu6Hlh4/ph5Hpop0v6KGM56iL5Luj6YeR5Yi46YeR6aKdXG4gICAgICAgICAgICBjb25zdCB7IHJlZHVjZV9wcmljZSwgZnVsbHJlZHVjZV92YWx1ZXMsIGNhc2hjb3Vwb25fdmFsdWVzIH0gPSB0cmlwO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICAvLyDooYznqIvnq4vlh4/ku6Pph5HliLhcbiAgICAgICAgICAgIGNvbnN0IGxpamlhbiQgPSBhd2FpdCBkYi5jb2xsZWN0aW9uKCdjb3Vwb24nKVxuICAgICAgICAgICAgICAgIC53aGVyZSh7XG4gICAgICAgICAgICAgICAgICAgIHRpZCxcbiAgICAgICAgICAgICAgICAgICAgb3BlbmlkLFxuICAgICAgICAgICAgICAgICAgICB0eXBlOiAndF9saWppYW4nXG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAuZ2V0KCApO1xuXG4gICAgICAgICAgICAvLyDooYznqIvmu6Hlh4/liLhcbiAgICAgICAgICAgIGNvbnN0IG1hbmppYW4kID0gYXdhaXQgZGIuY29sbGVjdGlvbignY291cG9uJylcbiAgICAgICAgICAgICAgICAud2hlcmUoe1xuICAgICAgICAgICAgICAgICAgICB0aWQsXG4gICAgICAgICAgICAgICAgICAgIG9wZW5pZCxcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogJ3RfbWFuamlhbidcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIC5nZXQoICk7XG5cbiAgICAgICAgICAgIC8vIOihjOeoi+eri+WHj+WIuFxuICAgICAgICAgICAgY29uc3QgZGFpamluJCA9IGF3YWl0IGRiLmNvbGxlY3Rpb24oJ2NvdXBvbicpXG4gICAgICAgICAgICAgICAgLndoZXJlKHtcbiAgICAgICAgICAgICAgICAgICAgdGlkLFxuICAgICAgICAgICAgICAgICAgICBvcGVuaWQsXG4gICAgICAgICAgICAgICAgICAgIHR5cGU6ICd0X2RhaWppbidcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIC5nZXQoICk7XG5cbiAgICAgICAgICAgIGNvbnN0IHRlbXAgPSB7IH07XG4gICAgICAgICAgICBjaGVjay5zcGxpdCgnLCcpLm1hcCggY2hlY2tUeXBlID0+IHtcblxuICAgICAgICAgICAgICAgIGlmICggY2hlY2tUeXBlID09PSAndF9tYW5qaWFuJyApIHtcbiAgICAgICAgICAgICAgICAgICAgdGVtcFsgY2hlY2tUeXBlIF0gPSAhIWZ1bGxyZWR1Y2VfdmFsdWVzID9cbiAgICAgICAgICAgICAgICAgICAgICAgIG1hbmppYW4kLmRhdGEubGVuZ3RoID09PSAwID8gXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZmFsc2UgOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRydWUgOlxuICAgICAgICAgICAgICAgICAgICAgICAgbnVsbFxuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoIGNoZWNrVHlwZSA9PT0gJ3RfZGFpamluJyApIHtcbiAgICAgICAgICAgICAgICAgICAgdGVtcFsgY2hlY2tUeXBlIF0gPSAhIWNhc2hjb3Vwb25fdmFsdWVzID9cbiAgICAgICAgICAgICAgICAgICAgICAgIGRhaWppbiQuZGF0YS5sZW5ndGggPT09IDAgPyBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmYWxzZSA6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdHJ1ZSA6XG4gICAgICAgICAgICAgICAgICAgICAgICBudWxsXG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmICggY2hlY2tUeXBlID09PSAndF9saWppYW4nICkge1xuICAgICAgICAgICAgICAgICAgICB0ZW1wWyBjaGVja1R5cGUgXSA9ICEhcmVkdWNlX3ByaWNlID9cbiAgICAgICAgICAgICAgICAgICAgICAgIGxpamlhbiQuZGF0YS5sZW5ndGggPT09IDAgPyBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmYWxzZSA6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGlqaWFuJC5kYXRhWyAwIF0udmFsdWUgPCByZWR1Y2VfcHJpY2UgP1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnaGFsZicgOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0cnVlIDpcbiAgICAgICAgICAgICAgICAgICAgICAgIG51bGxcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICByZXR1cm4gY3R4LmJvZHkgPSB7XG4gICAgICAgICAgICAgICAgc3RhdHVzOiAyMDAsXG4gICAgICAgICAgICAgICAgZGF0YTogdGVtcFxuICAgICAgICAgICAgfVxuICAgICAgICB9IGNhdGNoICggZSApIHsgcmV0dXJuIGN0eC5ib2R5ID0geyBzdGF0dXMgOjUwMCB9O31cbiAgICB9KVxuICAgIFxuICAgIC8qKiBcbiAgICAgKiBAZGVzY3JpcHRpb24g5Y2h5Yi45YiX6KGoXG4gICAgICovXG4gICAgYXBwLnJvdXRlcignbGlzdCcsIGFzeW5jKCBjdHgsIG5leHQgKSA9PiB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGNvbnN0IG9wZW5pZCA9IGV2ZW50LmRhdGEub3BlbklkIHx8IGV2ZW50LnVzZXJJbmZvLm9wZW5JZDtcbiAgICAgICAgICAgIGNvbnN0IHsgaXNVc2VkIH0gPSBldmVudC5kYXRhO1xuICAgICAgICAgICAgbGV0IHF1ZXJ5JCA9IHtcbiAgICAgICAgICAgICAgICBvcGVuaWRcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIGlmICggaXNVc2VkICE9PSB1bmRlZmluZWQgKSB7XG4gICAgICAgICAgICAgICAgcXVlcnkkID0gT2JqZWN0LmFzc2lnbih7IH0sIHF1ZXJ5JCwge1xuICAgICAgICAgICAgICAgICAgICBpc1VzZWRcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgY29uc3QgbGlzdCQgPSBhd2FpdCBkYi5jb2xsZWN0aW9uKCdjb3Vwb24nKVxuICAgICAgICAgICAgICAgIC53aGVyZSggcXVlcnkkIClcbiAgICAgICAgICAgICAgICAuZ2V0KCApO1xuXG4gICAgICAgICAgICAvLyDooYznqIvkv6Hmga9cbiAgICAgICAgICAgIGNvbnN0IHRyaXBzSWRzID0gQXJyYXkuZnJvbSggbmV3IFNldCggbGlzdCQuZGF0YS5tYXAoIHggPT4geC50aWQgKSkpO1xuICAgICAgICAgICAgY29uc3QgdHJpcHMkID0gYXdhaXQgUHJvbWlzZS5hbGwoIHRyaXBzSWRzLm1hcCggdGlkID0+IHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZGIuY29sbGVjdGlvbigndHJpcCcpXG4gICAgICAgICAgICAgICAgICAgIC5kb2MoIHRpZCApXG4gICAgICAgICAgICAgICAgICAgIC5nZXQoICk7XG4gICAgICAgICAgICB9KSk7XG5cbiAgICAgICAgICAgIGNvbnN0IHRyaXBzID0gdHJpcHMkLm1hcCggeCA9PiB4LmRhdGEgKTtcblxuICAgICAgICAgICAgLy8g5Y2h5Yi45o+S5YWl6KGM56iLXG4gICAgICAgICAgICBjb25zdCBsaXN0ID0gbGlzdCQuZGF0YS5tYXAoIGNvdXBvbiA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3QgdHJpcE1ldGEgPSB0cmlwcy5maW5kKCB4ID0+IHguX2lkID09PSBjb3Vwb24udGlkICk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIE9iamVjdC5hc3NpZ24oeyB9LCBjb3Vwb24sIHtcbiAgICAgICAgICAgICAgICAgICAgdHJpcDogdHJpcE1ldGEgfHwgbnVsbFxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgcmV0dXJuIGN0eC5ib2R5ID0ge1xuICAgICAgICAgICAgICAgIHN0YXR1czogMjAwLFxuICAgICAgICAgICAgICAgIGRhdGE6IGxpc3RcbiAgICAgICAgICAgIH1cblxuICAgICAgICB9IGNhdGNoICggZSApIHtcbiAgICAgICAgICAgIHJldHVybiBjdHguYm9keSA9IHsgc3RhdHVzOiA1MDAgfTtcbiAgICAgICAgfVxuICAgIH0pXG5cbiAgICByZXR1cm4gYXBwLnNlcnZlKCApO1xufTsiXX0=