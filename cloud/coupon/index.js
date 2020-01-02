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
        app.router('create', function (ctx, next) { return __awaiter(void 0, void 0, void 0, function () {
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
                            createTime: getNow(true)
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
        app.router('repair-lijian', function (ctx, next) { return __awaiter(void 0, void 0, void 0, function () {
            var tid, openid, trip$, trip, reduce_price, find$, target, push$, e_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 8, , 9]);
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
                                    createTime: getNow(true)
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
                    case 6: return [4, cloud.callFunction({
                            name: 'common',
                            data: {
                                $url: 'push-subscribe-cloud',
                                data: {
                                    openid: openid,
                                    type: 'hongbao',
                                    page: 'pages/trip-enter/index',
                                    texts: ["\u606D\u559C\u83B7\u5F97\u7EA2\u5305" + reduce_price + "\u5143", "\u8D81\u65E9\u4E0B\u5355\uFF01\u65E0\u95E8\u69DB\u7ACB\u51CF" + reduce_price + "\u5143"]
                                }
                            }
                        })];
                    case 7:
                        push$ = _a.sent();
                        return [2, ctx.body = {
                                status: 200
                            }];
                    case 8:
                        e_2 = _a.sent();
                        return [2, ctx.body = { status: 500 }];
                    case 9: return [2];
                }
            });
        }); });
        app.router('isget', function (ctx, next) { return __awaiter(void 0, void 0, void 0, function () {
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
        app.router('list', function (ctx, next) { return __awaiter(void 0, void 0, void 0, function () {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLHFDQUF1QztBQUN2QyxzQ0FBd0M7QUFFeEMsS0FBSyxDQUFDLElBQUksQ0FBQztJQUNQLEdBQUcsRUFBRSxLQUFLLENBQUMsbUJBQW1CO0NBQ2pDLENBQUMsQ0FBQztBQUVILElBQU0sRUFBRSxHQUFnQixLQUFLLENBQUMsUUFBUSxFQUFHLENBQUM7QUFTMUMsSUFBTSxNQUFNLEdBQUcsVUFBRSxFQUFVO0lBQVYsbUJBQUEsRUFBQSxVQUFVO0lBQ3ZCLElBQUssRUFBRSxFQUFHO1FBQ04sT0FBTyxJQUFJLENBQUMsR0FBRyxFQUFHLENBQUM7S0FDdEI7SUFDRCxJQUFNLE1BQU0sR0FBRyxJQUFJLElBQUksQ0FBRSxJQUFJLElBQUksRUFBRyxDQUFDLGNBQWMsRUFBRyxDQUFDLENBQUM7SUFDeEQsT0FBTyxJQUFJLElBQUksQ0FBRSxNQUFNLENBQUMsT0FBTyxFQUFHLEdBQUcsQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsSUFBSSxDQUFFLENBQUE7QUFDN0QsQ0FBQyxDQUFBO0FBb0JZLFFBQUEsSUFBSSxHQUFHLFVBQVEsS0FBSyxFQUFFLE9BQU87OztRQUVoQyxHQUFHLEdBQUcsSUFBSSxTQUFTLENBQUMsRUFBRSxLQUFLLE9BQUEsRUFBRSxDQUFDLENBQUM7UUFrQnJDLEdBQUcsQ0FBQyxNQUFNLENBQUMsUUFBUSxFQUFFLFVBQU8sR0FBRyxFQUFFLElBQUk7Ozs7Ozt3QkFHdkIsTUFBTSxHQUFHLEtBQUssQ0FBQyxJQUFJLENBQUMsTUFBTSxJQUFJLEtBQUssQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDO3dCQUNwRCxJQUFJLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQyxFQUFHLEVBQUUsS0FBSyxDQUFDLElBQUksRUFBRTs0QkFDeEMsTUFBTSxR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Qzs7OzthQUV6QyxDQUFDLENBQUE7UUFFRixXQUFPLEdBQUcsQ0FBQyxLQUFLLEVBQUcsRUFBQzs7S0FDdkIsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIGNsb3VkIGZyb20gJ3d4LXNlcnZlci1zZGsnO1xuaW1wb3J0ICogYXMgVGNiUm91dGVyIGZyb20gJ3RjYi1yb3V0ZXInO1xuXG5jbG91ZC5pbml0KHtcbiAgICBlbnY6IGNsb3VkLkRZTkFNSUNfQ1VSUkVOVF9FTlZcbn0pO1xuXG5jb25zdCBkYjogREIuRGF0YWJhc2UgPSBjbG91ZC5kYXRhYmFzZSggKTtcblxuXG4vKiogXG4gKiDovazmjaLmoLzmnpflsLzmsrvml7bljLogKzjml7bljLpcbiAqIERhdGUoKS5ub3coKSAvIG5ldyBEYXRlKCkuZ2V0VGltZSgpIOaYr+aXtuS4jeaXtuato+W4uOeahCs4XG4gKiBEYXRlLnRvTG9jYWxTdHJpbmcoICkg5aW95YOP5piv5LiA55u05pivKzDnmoRcbiAqIOWFiOaLv+WIsCArMO+8jOeEtuWQjis4XG4gKi9cbmNvbnN0IGdldE5vdyA9ICggdHMgPSBmYWxzZSApOiBhbnkgPT4ge1xuICAgIGlmICggdHMgKSB7XG4gICAgICAgIHJldHVybiBEYXRlLm5vdyggKTtcbiAgICB9XG4gICAgY29uc3QgdGltZV8wID0gbmV3IERhdGUoIG5ldyBEYXRlKCApLnRvTG9jYWxlU3RyaW5nKCApKTtcbiAgICByZXR1cm4gbmV3IERhdGUoIHRpbWVfMC5nZXRUaW1lKCApICsgOCAqIDYwICogNjAgKiAxMDAwIClcbn1cblxuXG4vKipcbiAqXG4gKiBAZGVzY3JpcHRpb24g5Y2h5Yi45qih5Z2XXG4gKiAtLS0tLS0tLSDlrZfmrrUgLS0tLS0tLS0tLVxuICogISB0aWQg6aKG5Y+W6K+l5LyY5oOg5Yi455qE5omA5bGe6KGM56iL77yI5Y+v5peg77yJXG4gKiB0aXRsZSDliLjlkI3np7BcbiAqIHVzZWRCeTog6KKreHh46KGM56iL5omA5L2/55SoXG4gKiB0eXBlOiAndF9saWppYW4nIHwgJ3RfbWFuamlhbicgfCAndF9kYWlqaW4nIOWIuOexu+Wei++8muihjOeoi+eri+WHj+OAgeihjOeoi+a7oeWHj+OAgeihjOeoi+S7o+mHkeWIuFxuICogaXNVc2VkOiDmmK/lkKblt7LnlKhcbiAqIG9wZW5pZFxuICogY2FuVXNlSW5OZXh0OiDmmK/lkKbkuIvotp/lj6/nlKhcbiAqIGF0bGVhc3Q6IOa2iOi0uemXqOanm1xuICogdmFsdWXvvJrmtojotLnkvJjmg6Dpop3luqZcbiAqISB2YWxpdGVybTog5pyJ5pWI5pyf5pel5pyfKOWPr+aXoClcbiAqIGNyZWF0ZVRpbWUg5Yib5bu65pel5pyfXG4gKiByZWR1Y2VfdHlwZTogJ3l1YW4nIHwgJ3BlcmNlbnQnIOS8mOaDoOexu+Wei++8muWFg+OAgeaKmOaJo1xuICovXG5leHBvcnQgY29uc3QgbWFpbiA9IGFzeW5jICggZXZlbnQsIGNvbnRleHQgKSA9PiB7XG5cbiAgICBjb25zdCBhcHAgPSBuZXcgVGNiUm91dGVyKHsgZXZlbnQgfSk7XG5cbiAgICAvKipcbiAgICAgKiBAZGVzY3JpcHRpb24g5Yib5bu65LyY5oOg5Yi4XG4gICAgICogLS0tLS0tLS0g6K+35rGCIC0tLS0tLS0tLVxuICAgICAqIHtcbiAgICAgKiAgIHRpZFxuICAgICAqICAgdGl0bGVcbiAgICAgKiAgIG9wZW5pZCAgXG4gICAgICogICB0eXBlXG4gICAgICogICBjYW5Vc2VJbk5leHRcbiAgICAgKiAgIGF0bGVhc3RcbiAgICAgKiAgIHZhbHVlXG4gICAgICogICBmcm9tdGlkXG4gICAgICohICAgdmFsaXRlcm1cbiAgICAgKiEgICByZWR1Y2VfdHlwZVxuICAgICAqIH1cbiAgICAgKi9cbiAgICBhcHAucm91dGVyKCdjcmVhdGUnLCBhc3luYyggY3R4LCBuZXh0ICkgPT4ge1xuICAgICAgICB0cnkge1xuXG4gICAgICAgICAgICBjb25zdCBvcGVuaWQgPSBldmVudC5kYXRhLm9wZW5JZCB8fCBldmVudC51c2VySW5mby5vcGVuSWQ7XG4gICAgICAgICAgICBjb25zdCB0ZW1wID0gT2JqZWN0LmFzc2lnbih7IH0sIGV2ZW50LmRhdGEsIHtcbiAgICAgICAgICAgICAgICBvcGVuaWQsXG4gICAgICAgICAgICAgICAgaXNVc2VkOiBmYWxzZSxcbiAgICAgICAgICAgICAgICBmcm9tdGlkOiBldmVudC5kYXRhLmZyb210aWQgfHwgZXZlbnQuZGF0YS50aWQsXG4gICAgICAgICAgICAgICAgcmVkdWNlX3R5cGU6IGV2ZW50LmRhdGEucmVkdWNlX3R5cGUgfHwgJ3l1YW4nLFxuICAgICAgICAgICAgICAgIGNyZWF0ZVRpbWU6IGdldE5vdyggdHJ1ZSApXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgY29uc3QgYWRkJCA9IGF3YWl0IGRiLmNvbGxlY3Rpb24oJ2NvdXBvbicpXG4gICAgICAgICAgICAgICAgLmFkZCh7XG4gICAgICAgICAgICAgICAgICAgIGRhdGE6IHRlbXBcbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgcmV0dXJuIGN0eC5ib2R5ID0ge1xuICAgICAgICAgICAgICAgIHN0YXR1czogMjAwLFxuICAgICAgICAgICAgICAgIGRhdGE6IGFkZCQuX2lkXG4gICAgICAgICAgICB9XG4gICAgICAgIH0gY2F0Y2ggKCBlICkgeyByZXR1cm4gY3R4LmJvZHkgPSB7IHN0YXR1czogNTAwIH07fVxuICAgIH0pO1xuXG4gICAgLyoqXG4gICAgICogQGRlc2NyaXB0aW9uIOihpem9kOeri+WHj+WIuFxuICAgICAqIC0tLS0tLS0tIOivt+axgiAtLS0tLS0tLVxuICAgICAqIHtcbiAgICAgKiAgICB0aWRcbiAgICAgKiB9XG4gICAgICovXG4gICAgYXBwLnJvdXRlcigncmVwYWlyLWxpamlhbicsIGFzeW5jKCBjdHgsIG5leHQgKSA9PiB7XG4gICAgICAgIHRyeSB7XG5cbiAgICAgICAgICAgIGNvbnN0IHsgdGlkIH0gPSBldmVudC5kYXRhO1xuICAgICAgICAgICAgY29uc3Qgb3BlbmlkID0gZXZlbnQuZGF0YS5vcGVuSWQgfHwgZXZlbnQudXNlckluZm8ub3BlbklkO1xuXG4gICAgICAgICAgICBjb25zdCB0cmlwJCA9IGF3YWl0IGRiLmNvbGxlY3Rpb24oJ3RyaXAnKVxuICAgICAgICAgICAgICAgIC5kb2MoIHRpZCApXG4gICAgICAgICAgICAgICAgLmdldCggKTtcblxuICAgICAgICAgICAgY29uc3QgdHJpcCA9IHRyaXAkLmRhdGE7XG4gICAgICAgICAgICBjb25zdCB7IHJlZHVjZV9wcmljZSB9ID0gdHJpcDtcblxuICAgICAgICAgICAgY29uc3QgZmluZCQgPSBhd2FpdCBkYi5jb2xsZWN0aW9uKCdjb3Vwb24nKVxuICAgICAgICAgICAgICAgIC53aGVyZSh7XG4gICAgICAgICAgICAgICAgICAgIHRpZCxcbiAgICAgICAgICAgICAgICAgICAgb3BlbmlkLFxuICAgICAgICAgICAgICAgICAgICB0eXBlOiAndF9saWppYW4nXG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAuZ2V0KCApO1xuICAgICAgICAgICAgY29uc3QgdGFyZ2V0ID0gZmluZCQuZGF0YVsgMCBdO1xuXG4gICAgICAgICAgICAvLyDlhajpop3ooaXpvZBcbiAgICAgICAgICAgIGlmICggIXRhcmdldCAmJiAhIXJlZHVjZV9wcmljZSApIHtcbiAgICAgICAgICAgICAgICBhd2FpdCBkYi5jb2xsZWN0aW9uKCdjb3Vwb24nKVxuICAgICAgICAgICAgICAgICAgICAuYWRkKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aWQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb3BlbmlkLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGF0bGVhc3Q6IDAsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZnJvbXRpZDogdGlkLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlOiByZWR1Y2VfcHJpY2UsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogJ3RfbGlqaWFuJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpc1VzZWQ6IGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhblVzZUluTmV4dDogZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGl0bGU6ICfooYznqIvnq4vlh4/kvJjmg6DliLgnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlZHVjZV90eXBlOiAneXVhbicsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY3JlYXRlVGltZTogZ2V0Tm93KCB0cnVlIClcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8g5beu6aKd6KGl6b2QXG4gICAgICAgICAgICBpZiAoICEhdGFyZ2V0ICYmICEhcmVkdWNlX3ByaWNlICkge1xuICAgICAgICAgICAgICAgIGF3YWl0IGRiLmNvbGxlY3Rpb24oJ2NvdXBvbicpXG4gICAgICAgICAgICAgICAgICAgIC5kb2MoIFN0cmluZyggdGFyZ2V0Ll9pZCApKVxuICAgICAgICAgICAgICAgICAgICAudXBkYXRlKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZTogcmVkdWNlX3ByaWNlXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyA044CB6LCD55So5o6o6YCBXG4gICAgICAgICAgICBjb25zdCBwdXNoJCA9IGF3YWl0IGNsb3VkLmNhbGxGdW5jdGlvbih7XG4gICAgICAgICAgICAgICAgbmFtZTogJ2NvbW1vbicsXG4gICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgICAkdXJsOiAncHVzaC1zdWJzY3JpYmUtY2xvdWQnLFxuICAgICAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBvcGVuaWQsXG4gICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiAnaG9uZ2JhbycsXG4gICAgICAgICAgICAgICAgICAgICAgICBwYWdlOiAncGFnZXMvdHJpcC1lbnRlci9pbmRleCcsXG4gICAgICAgICAgICAgICAgICAgICAgICB0ZXh0czogW2Dmga3llpzojrflvpfnuqLljIUke3JlZHVjZV9wcmljZX3lhYNgLCBg6LaB5pep5LiL5Y2V77yB5peg6Zeo5qeb56uL5YePJHtyZWR1Y2VfcHJpY2V95YWDYF1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICByZXR1cm4gY3R4LmJvZHkgPSB7XG4gICAgICAgICAgICAgICAgc3RhdHVzOiAyMDBcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgfSBjYXRjaCAoIGUgKSB7XG4gICAgICAgICAgICByZXR1cm4gY3R4LmJvZHkgPSB7IHN0YXR1czogNTAwIH07XG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgIC8qKlxuICAgICAqIEBkZXNjcmlwdGlvbiDmo4DmtYvooYznqIvph4zpnaLvvIzlrqLmiLfmmK/lkKblt7Lnu4/pooblj5bov5nlh6DnsbvnmoTkvJjmg6DliLgsIG51bGzkuLrmsqHmnInor6XnsbvlnovkvJjmg6DvvIx0cnVl5Li65bey57uP6aKG5Y+W77yMZmFsc2XkuLrmnKrpooblj5ZcbiAgICAgKiAtLS0tLS0tLSDor7fmsYIgLS0tLS0tLVxuICAgICAqIHtcbiAgICAgKiAgIHRpZDogXG4gICAgICogICBvcGVuaWQ6IFxuICAgICAqICAgY2hlY2s6ICd0X2xpamlhbix0X21hbmppYW4sdF9kYWlqaW4nXG4gICAgICogfVxuICAgICAqIC0tLS0tIOi/lOWbniAtLS0tLVxuICAgICAqIHtcbiAgICAgKiAgIHN0YXR1cyxcbiAgICAgKiAgIGRhdGE6IHtcbiAgICAgKiAgICAgdF9saWppYW46IG51bGwvdHJ1ZS9mYWxzZS9oYWxmXG4gICAgICogICAgIHRfbWFuamlhbjogbnVsbC90cnVlL2ZhbHNlXG4gICAgICogICAgIHRfZGFpamluOiBudWxsL3RydWUvZmFsc2VcbiAgICAgKiAgIH0gXG4gICAgICogfVxuICAgICAqL1xuICAgIGFwcC5yb3V0ZXIoJ2lzZ2V0JywgYXN5bmMoIGN0eCwgbmV4dCApID0+IHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgY29uc3QgeyB0aWQsIGNoZWNrIH0gPSBldmVudC5kYXRhO1xuICAgICAgICAgICAgY29uc3Qgb3BlbmlkID0gZXZlbnQuZGF0YS5vcGVuSWQgfHwgZXZlbnQudXNlckluZm8ub3BlbklkO1xuXG4gICAgICAgICAgICAvLyDlhYjmo4Dmn6XvvIzor6XooYznqIvmnInmsqHmnInor6Xnp43kvJjmg6BcbiAgICAgICAgICAgIGNvbnN0IHRyaXAkID0gYXdhaXQgZGIuY29sbGVjdGlvbigndHJpcCcpXG4gICAgICAgICAgICAgICAgLmRvYyggdGlkIClcbiAgICAgICAgICAgICAgICAuZ2V0KCApO1xuXG4gICAgICAgICAgICBjb25zdCB0cmlwID0gdHJpcCQuZGF0YTtcblxuICAgICAgICAgICAgLy8g6KGM56iL56uL5YeP6YeR6aKdL+ihjOeoi+a7oeWHj+mHkeminS/ooYznqIvku6Pph5HliLjph5Hpop1cbiAgICAgICAgICAgIGNvbnN0IHsgcmVkdWNlX3ByaWNlLCBmdWxscmVkdWNlX3ZhbHVlcywgY2FzaGNvdXBvbl92YWx1ZXMgfSA9IHRyaXA7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIC8vIOihjOeoi+eri+WHj+S7o+mHkeWIuFxuICAgICAgICAgICAgY29uc3QgbGlqaWFuJCA9IGF3YWl0IGRiLmNvbGxlY3Rpb24oJ2NvdXBvbicpXG4gICAgICAgICAgICAgICAgLndoZXJlKHtcbiAgICAgICAgICAgICAgICAgICAgdGlkLFxuICAgICAgICAgICAgICAgICAgICBvcGVuaWQsXG4gICAgICAgICAgICAgICAgICAgIHR5cGU6ICd0X2xpamlhbidcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIC5nZXQoICk7XG5cbiAgICAgICAgICAgIC8vIOihjOeoi+a7oeWHj+WIuFxuICAgICAgICAgICAgY29uc3QgbWFuamlhbiQgPSBhd2FpdCBkYi5jb2xsZWN0aW9uKCdjb3Vwb24nKVxuICAgICAgICAgICAgICAgIC53aGVyZSh7XG4gICAgICAgICAgICAgICAgICAgIHRpZCxcbiAgICAgICAgICAgICAgICAgICAgb3BlbmlkLFxuICAgICAgICAgICAgICAgICAgICB0eXBlOiAndF9tYW5qaWFuJ1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLmdldCggKTtcblxuICAgICAgICAgICAgLy8g6KGM56iL56uL5YeP5Yi4XG4gICAgICAgICAgICBjb25zdCBkYWlqaW4kID0gYXdhaXQgZGIuY29sbGVjdGlvbignY291cG9uJylcbiAgICAgICAgICAgICAgICAud2hlcmUoe1xuICAgICAgICAgICAgICAgICAgICB0aWQsXG4gICAgICAgICAgICAgICAgICAgIG9wZW5pZCxcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogJ3RfZGFpamluJ1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLmdldCggKTtcblxuICAgICAgICAgICAgY29uc3QgdGVtcCA9IHsgfTtcbiAgICAgICAgICAgIGNoZWNrLnNwbGl0KCcsJykubWFwKCBjaGVja1R5cGUgPT4ge1xuXG4gICAgICAgICAgICAgICAgaWYgKCBjaGVja1R5cGUgPT09ICd0X21hbmppYW4nICkge1xuICAgICAgICAgICAgICAgICAgICB0ZW1wWyBjaGVja1R5cGUgXSA9ICEhZnVsbHJlZHVjZV92YWx1ZXMgP1xuICAgICAgICAgICAgICAgICAgICAgICAgbWFuamlhbiQuZGF0YS5sZW5ndGggPT09IDAgPyBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmYWxzZSA6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdHJ1ZSA6XG4gICAgICAgICAgICAgICAgICAgICAgICBudWxsXG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmICggY2hlY2tUeXBlID09PSAndF9kYWlqaW4nICkge1xuICAgICAgICAgICAgICAgICAgICB0ZW1wWyBjaGVja1R5cGUgXSA9ICEhY2FzaGNvdXBvbl92YWx1ZXMgP1xuICAgICAgICAgICAgICAgICAgICAgICAgZGFpamluJC5kYXRhLmxlbmd0aCA9PT0gMCA/IFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZhbHNlIDpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0cnVlIDpcbiAgICAgICAgICAgICAgICAgICAgICAgIG51bGxcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKCBjaGVja1R5cGUgPT09ICd0X2xpamlhbicgKSB7XG4gICAgICAgICAgICAgICAgICAgIHRlbXBbIGNoZWNrVHlwZSBdID0gISFyZWR1Y2VfcHJpY2UgP1xuICAgICAgICAgICAgICAgICAgICAgICAgbGlqaWFuJC5kYXRhLmxlbmd0aCA9PT0gMCA/IFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZhbHNlIDpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsaWppYW4kLmRhdGFbIDAgXS52YWx1ZSA8IHJlZHVjZV9wcmljZSA/XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICdoYWxmJyA6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRydWUgOlxuICAgICAgICAgICAgICAgICAgICAgICAgbnVsbFxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHJldHVybiBjdHguYm9keSA9IHtcbiAgICAgICAgICAgICAgICBzdGF0dXM6IDIwMCxcbiAgICAgICAgICAgICAgICBkYXRhOiB0ZW1wXG4gICAgICAgICAgICB9XG4gICAgICAgIH0gY2F0Y2ggKCBlICkgeyByZXR1cm4gY3R4LmJvZHkgPSB7IHN0YXR1cyA6NTAwIH07fVxuICAgIH0pXG4gICAgXG4gICAgLyoqIFxuICAgICAqIEBkZXNjcmlwdGlvbiDljaHliLjliJfooahcbiAgICAgKi9cbiAgICBhcHAucm91dGVyKCdsaXN0JywgYXN5bmMoIGN0eCwgbmV4dCApID0+IHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgY29uc3Qgb3BlbmlkID0gZXZlbnQuZGF0YS5vcGVuSWQgfHwgZXZlbnQudXNlckluZm8ub3BlbklkO1xuICAgICAgICAgICAgY29uc3QgeyBpc1VzZWQgfSA9IGV2ZW50LmRhdGE7XG4gICAgICAgICAgICBsZXQgcXVlcnkkID0ge1xuICAgICAgICAgICAgICAgIG9wZW5pZFxuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgaWYgKCBpc1VzZWQgIT09IHVuZGVmaW5lZCApIHtcbiAgICAgICAgICAgICAgICBxdWVyeSQgPSBPYmplY3QuYXNzaWduKHsgfSwgcXVlcnkkLCB7XG4gICAgICAgICAgICAgICAgICAgIGlzVXNlZFxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBjb25zdCBsaXN0JCA9IGF3YWl0IGRiLmNvbGxlY3Rpb24oJ2NvdXBvbicpXG4gICAgICAgICAgICAgICAgLndoZXJlKCBxdWVyeSQgKVxuICAgICAgICAgICAgICAgIC5nZXQoICk7XG5cbiAgICAgICAgICAgIC8vIOihjOeoi+S/oeaBr1xuICAgICAgICAgICAgY29uc3QgdHJpcHNJZHMgPSBBcnJheS5mcm9tKCBuZXcgU2V0KCBsaXN0JC5kYXRhLm1hcCggeCA9PiB4LnRpZCApKSk7XG4gICAgICAgICAgICBjb25zdCB0cmlwcyQgPSBhd2FpdCBQcm9taXNlLmFsbCggdHJpcHNJZHMubWFwKCB0aWQgPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiBkYi5jb2xsZWN0aW9uKCd0cmlwJylcbiAgICAgICAgICAgICAgICAgICAgLmRvYyggdGlkIClcbiAgICAgICAgICAgICAgICAgICAgLmdldCggKTtcbiAgICAgICAgICAgIH0pKTtcblxuICAgICAgICAgICAgY29uc3QgdHJpcHMgPSB0cmlwcyQubWFwKCB4ID0+IHguZGF0YSApO1xuXG4gICAgICAgICAgICAvLyDljaHliLjmj5LlhaXooYznqItcbiAgICAgICAgICAgIGNvbnN0IGxpc3QgPSBsaXN0JC5kYXRhLm1hcCggY291cG9uID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCB0cmlwTWV0YSA9IHRyaXBzLmZpbmQoIHggPT4geC5faWQgPT09IGNvdXBvbi50aWQgKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gT2JqZWN0LmFzc2lnbih7IH0sIGNvdXBvbiwge1xuICAgICAgICAgICAgICAgICAgICB0cmlwOiB0cmlwTWV0YSB8fCBudWxsXG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICByZXR1cm4gY3R4LmJvZHkgPSB7XG4gICAgICAgICAgICAgICAgc3RhdHVzOiAyMDAsXG4gICAgICAgICAgICAgICAgZGF0YTogbGlzdFxuICAgICAgICAgICAgfVxuXG4gICAgICAgIH0gY2F0Y2ggKCBlICkge1xuICAgICAgICAgICAgcmV0dXJuIGN0eC5ib2R5ID0geyBzdGF0dXM6IDUwMCB9O1xuICAgICAgICB9XG4gICAgfSlcblxuICAgIHJldHVybiBhcHAuc2VydmUoICk7XG59OyJdfQ==