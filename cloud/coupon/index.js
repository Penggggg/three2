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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLHFDQUF1QztBQUN2QyxzQ0FBd0M7QUFFeEMsS0FBSyxDQUFDLElBQUksQ0FBQztJQUNQLEdBQUcsRUFBRSxPQUFPLENBQUMsR0FBRyxDQUFDLEtBQUs7Q0FDekIsQ0FBQyxDQUFDO0FBRUgsSUFBTSxFQUFFLEdBQWdCLEtBQUssQ0FBQyxRQUFRLEVBQUcsQ0FBQztBQVMxQyxJQUFNLE1BQU0sR0FBRyxVQUFFLEVBQVU7SUFBVixtQkFBQSxFQUFBLFVBQVU7SUFDdkIsSUFBSyxFQUFFLEVBQUc7UUFDTixPQUFPLElBQUksQ0FBQyxHQUFHLEVBQUcsQ0FBQztLQUN0QjtJQUNELElBQU0sTUFBTSxHQUFHLElBQUksSUFBSSxDQUFFLElBQUksSUFBSSxFQUFHLENBQUMsY0FBYyxFQUFHLENBQUMsQ0FBQztJQUN4RCxPQUFPLElBQUksSUFBSSxDQUFFLE1BQU0sQ0FBQyxPQUFPLEVBQUcsR0FBRyxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxJQUFJLENBQUUsQ0FBQTtBQUM3RCxDQUFDLENBQUE7QUFvQlksUUFBQSxJQUFJLEdBQUcsVUFBUSxLQUFLLEVBQUUsT0FBTzs7O1FBRWhDLEdBQUcsR0FBRyxJQUFJLFNBQVMsQ0FBQyxFQUFFLEtBQUssT0FBQSxFQUFFLENBQUMsQ0FBQztRQWtCckMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxRQUFRLEVBQUUsVUFBTyxHQUFHLEVBQUUsSUFBSTs7Ozs7O3dCQUd2QixNQUFNLEdBQUcsS0FBSyxDQUFDLElBQUksQ0FBQyxNQUFNLElBQUksS0FBSyxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUM7d0JBQ3BELElBQUksR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDLEVBQUcsRUFBRSxLQUFLLENBQUMsSUFBSSxFQUFFOzRCQUN4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RUFBRSxFQUFDOzs7O2FBRXpDLENBQUMsQ0FBQTtRQUVGLFdBQU8sR0FBRyxDQUFDLEtBQUssRUFBRyxFQUFDOztLQUN2QixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgY2xvdWQgZnJvbSAnd3gtc2VydmVyLXNkayc7XG5pbXBvcnQgKiBhcyBUY2JSb3V0ZXIgZnJvbSAndGNiLXJvdXRlcic7XG5cbmNsb3VkLmluaXQoe1xuICAgIGVudjogcHJvY2Vzcy5lbnYuY2xvdWRcbn0pO1xuXG5jb25zdCBkYjogREIuRGF0YWJhc2UgPSBjbG91ZC5kYXRhYmFzZSggKTtcblxuXG4vKiogXG4gKiDovazmjaLmoLzmnpflsLzmsrvml7bljLogKzjml7bljLpcbiAqIERhdGUoKS5ub3coKSAvIG5ldyBEYXRlKCkuZ2V0VGltZSgpIOaYr+aXtuS4jeaXtuato+W4uOeahCs4XG4gKiBEYXRlLnRvTG9jYWxTdHJpbmcoICkg5aW95YOP5piv5LiA55u05pivKzDnmoRcbiAqIOWFiOaLv+WIsCArMO+8jOeEtuWQjis4XG4gKi9cbmNvbnN0IGdldE5vdyA9ICggdHMgPSBmYWxzZSApOiBhbnkgPT4ge1xuICAgIGlmICggdHMgKSB7XG4gICAgICAgIHJldHVybiBEYXRlLm5vdyggKTtcbiAgICB9XG4gICAgY29uc3QgdGltZV8wID0gbmV3IERhdGUoIG5ldyBEYXRlKCApLnRvTG9jYWxlU3RyaW5nKCApKTtcbiAgICByZXR1cm4gbmV3IERhdGUoIHRpbWVfMC5nZXRUaW1lKCApICsgOCAqIDYwICogNjAgKiAxMDAwIClcbn1cblxuXG4vKipcbiAqXG4gKiBAZGVzY3JpcHRpb24g5Y2h5Yi45qih5Z2XXG4gKiAtLS0tLS0tLSDlrZfmrrUgLS0tLS0tLS0tLVxuICogISB0aWQg6aKG5Y+W6K+l5LyY5oOg5Yi455qE5omA5bGe6KGM56iL77yI5Y+v5peg77yJXG4gKiB0aXRsZSDliLjlkI3np7BcbiAqIHVzZWRCeTog6KKreHh46KGM56iL5omA5L2/55SoXG4gKiB0eXBlOiAndF9saWppYW4nIHwgJ3RfbWFuamlhbicgfCAndF9kYWlqaW4nIOWIuOexu+Wei++8muihjOeoi+eri+WHj+OAgeihjOeoi+a7oeWHj+OAgeihjOeoi+S7o+mHkeWIuFxuICogaXNVc2VkOiDmmK/lkKblt7LnlKhcbiAqIG9wZW5pZFxuICogY2FuVXNlSW5OZXh0OiDmmK/lkKbkuIvotp/lj6/nlKhcbiAqIGF0bGVhc3Q6IOa2iOi0uemXqOanm1xuICogdmFsdWXvvJrmtojotLnkvJjmg6Dpop3luqZcbiAqISB2YWxpdGVybTog5pyJ5pWI5pyf5pel5pyfKOWPr+aXoClcbiAqIGNyZWF0ZVRpbWUg5Yib5bu65pel5pyfXG4gKiByZWR1Y2VfdHlwZTogJ3l1YW4nIHwgJ3BlcmNlbnQnIOS8mOaDoOexu+Wei++8muWFg+OAgeaKmOaJo1xuICovXG5leHBvcnQgY29uc3QgbWFpbiA9IGFzeW5jICggZXZlbnQsIGNvbnRleHQgKSA9PiB7XG5cbiAgICBjb25zdCBhcHAgPSBuZXcgVGNiUm91dGVyKHsgZXZlbnQgfSk7XG5cbiAgICAvKipcbiAgICAgKiBAZGVzY3JpcHRpb24g5Yib5bu65LyY5oOg5Yi4XG4gICAgICogLS0tLS0tLS0g6K+35rGCIC0tLS0tLS0tLVxuICAgICAqIHtcbiAgICAgKiAgIHRpZFxuICAgICAqICAgdGl0bGVcbiAgICAgKiAgIG9wZW5pZCAgXG4gICAgICogICB0eXBlXG4gICAgICogICBjYW5Vc2VJbk5leHRcbiAgICAgKiAgIGF0bGVhc3RcbiAgICAgKiAgIHZhbHVlXG4gICAgICogICBmcm9tdGlkXG4gICAgICohICAgdmFsaXRlcm1cbiAgICAgKiEgICByZWR1Y2VfdHlwZVxuICAgICAqIH1cbiAgICAgKi9cbiAgICBhcHAucm91dGVyKCdjcmVhdGUnLCBhc3luYyggY3R4LCBuZXh0ICkgPT4ge1xuICAgICAgICB0cnkge1xuXG4gICAgICAgICAgICBjb25zdCBvcGVuaWQgPSBldmVudC5kYXRhLm9wZW5JZCB8fCBldmVudC51c2VySW5mby5vcGVuSWQ7XG4gICAgICAgICAgICBjb25zdCB0ZW1wID0gT2JqZWN0LmFzc2lnbih7IH0sIGV2ZW50LmRhdGEsIHtcbiAgICAgICAgICAgICAgICBvcGVuaWQsXG4gICAgICAgICAgICAgICAgaXNVc2VkOiBmYWxzZSxcbiAgICAgICAgICAgICAgICBmcm9tdGlkOiBldmVudC5kYXRhLmZyb210aWQgfHwgZXZlbnQuZGF0YS50aWQsXG4gICAgICAgICAgICAgICAgcmVkdWNlX3R5cGU6IGV2ZW50LmRhdGEucmVkdWNlX3R5cGUgfHwgJ3l1YW4nLFxuICAgICAgICAgICAgICAgIGNyZWF0ZVRpbWU6IGdldE5vdyggdHJ1ZSApXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgY29uc3QgYWRkJCA9IGF3YWl0IGRiLmNvbGxlY3Rpb24oJ2NvdXBvbicpXG4gICAgICAgICAgICAgICAgLmFkZCh7XG4gICAgICAgICAgICAgICAgICAgIGRhdGE6IHRlbXBcbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgcmV0dXJuIGN0eC5ib2R5ID0ge1xuICAgICAgICAgICAgICAgIHN0YXR1czogMjAwLFxuICAgICAgICAgICAgICAgIGRhdGE6IGFkZCQuX2lkXG4gICAgICAgICAgICB9XG4gICAgICAgIH0gY2F0Y2ggKCBlICkgeyByZXR1cm4gY3R4LmJvZHkgPSB7IHN0YXR1czogNTAwIH07fVxuICAgIH0pO1xuXG4gICAgLyoqXG4gICAgICogQGRlc2NyaXB0aW9uIOihpem9kOeri+WHj+WIuFxuICAgICAqIC0tLS0tLS0tIOivt+axgiAtLS0tLS0tLVxuICAgICAqIHtcbiAgICAgKiAgICB0aWRcbiAgICAgKiB9XG4gICAgICovXG4gICAgYXBwLnJvdXRlcigncmVwYWlyLWxpamlhbicsIGFzeW5jKCBjdHgsIG5leHQgKSA9PiB7XG4gICAgICAgIHRyeSB7XG5cbiAgICAgICAgICAgIGNvbnN0IHsgdGlkIH0gPSBldmVudC5kYXRhO1xuICAgICAgICAgICAgY29uc3Qgb3BlbmlkID0gZXZlbnQuZGF0YS5vcGVuSWQgfHwgZXZlbnQudXNlckluZm8ub3BlbklkO1xuXG4gICAgICAgICAgICBjb25zdCB0cmlwJCA9IGF3YWl0IGRiLmNvbGxlY3Rpb24oJ3RyaXAnKVxuICAgICAgICAgICAgICAgIC5kb2MoIHRpZCApXG4gICAgICAgICAgICAgICAgLmdldCggKTtcblxuICAgICAgICAgICAgY29uc3QgdHJpcCA9IHRyaXAkLmRhdGE7XG4gICAgICAgICAgICBjb25zdCB7IHJlZHVjZV9wcmljZSB9ID0gdHJpcDtcblxuICAgICAgICAgICAgY29uc3QgZmluZCQgPSBhd2FpdCBkYi5jb2xsZWN0aW9uKCdjb3Vwb24nKVxuICAgICAgICAgICAgICAgIC53aGVyZSh7XG4gICAgICAgICAgICAgICAgICAgIHRpZCxcbiAgICAgICAgICAgICAgICAgICAgb3BlbmlkLFxuICAgICAgICAgICAgICAgICAgICB0eXBlOiAndF9saWppYW4nXG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAuZ2V0KCApO1xuICAgICAgICAgICAgY29uc3QgdGFyZ2V0ID0gZmluZCQuZGF0YVsgMCBdO1xuXG4gICAgICAgICAgICAvLyDlhajpop3ooaXpvZBcbiAgICAgICAgICAgIGlmICggIXRhcmdldCAmJiAhIXJlZHVjZV9wcmljZSApIHtcbiAgICAgICAgICAgICAgICBhd2FpdCBkYi5jb2xsZWN0aW9uKCdjb3Vwb24nKVxuICAgICAgICAgICAgICAgICAgICAuYWRkKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aWQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb3BlbmlkLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGF0bGVhc3Q6IDAsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZnJvbXRpZDogdGlkLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlOiByZWR1Y2VfcHJpY2UsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogJ3RfbGlqaWFuJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpc1VzZWQ6IGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhblVzZUluTmV4dDogZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGl0bGU6ICfooYznqIvnq4vlh4/kvJjmg6DliLgnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlZHVjZV90eXBlOiAneXVhbicsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY3JlYXRlVGltZTogZ2V0Tm93KCB0cnVlIClcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8g5beu6aKd6KGl6b2QXG4gICAgICAgICAgICBpZiAoICEhdGFyZ2V0ICYmICEhcmVkdWNlX3ByaWNlICkge1xuICAgICAgICAgICAgICAgIGF3YWl0IGRiLmNvbGxlY3Rpb24oJ2NvdXBvbicpXG4gICAgICAgICAgICAgICAgICAgIC5kb2MoIFN0cmluZyggdGFyZ2V0Ll9pZCApKVxuICAgICAgICAgICAgICAgICAgICAudXBkYXRlKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZTogcmVkdWNlX3ByaWNlXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyA044CB6LCD55So5o6o6YCBXG4gICAgICAgICAgICBjb25zdCBwdXNoJCA9IGF3YWl0IGNsb3VkLmNhbGxGdW5jdGlvbih7XG4gICAgICAgICAgICAgICAgbmFtZTogJ2NvbW1vbicsXG4gICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgICAkdXJsOiAncHVzaC1zdWJzY3JpYmUtY2xvdWQnLFxuICAgICAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBvcGVuaWQsXG4gICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiAnaG9uZ2JhbycsXG4gICAgICAgICAgICAgICAgICAgICAgICBwYWdlOiAncGFnZXMvdHJpcC1lbnRlci9pbmRleCcsXG4gICAgICAgICAgICAgICAgICAgICAgICB0ZXh0czogW2Dmga3llpzojrflvpfnuqLljIUke3JlZHVjZV9wcmljZX3lhYNgLCBg6LaB5pep5LiL5Y2V77yB5peg6Zeo5qeb56uL5YePJHtyZWR1Y2VfcHJpY2V95YWDYF1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICByZXR1cm4gY3R4LmJvZHkgPSB7XG4gICAgICAgICAgICAgICAgc3RhdHVzOiAyMDBcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgfSBjYXRjaCAoIGUgKSB7XG4gICAgICAgICAgICByZXR1cm4gY3R4LmJvZHkgPSB7IHN0YXR1czogNTAwIH07XG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgIC8qKlxuICAgICAqIEBkZXNjcmlwdGlvbiDmo4DmtYvooYznqIvph4zpnaLvvIzlrqLmiLfmmK/lkKblt7Lnu4/pooblj5bov5nlh6DnsbvnmoTkvJjmg6DliLgsIG51bGzkuLrmsqHmnInor6XnsbvlnovkvJjmg6DvvIx0cnVl5Li65bey57uP6aKG5Y+W77yMZmFsc2XkuLrmnKrpooblj5ZcbiAgICAgKiAtLS0tLS0tLSDor7fmsYIgLS0tLS0tLVxuICAgICAqIHtcbiAgICAgKiAgIHRpZDogXG4gICAgICogICBvcGVuaWQ6IFxuICAgICAqICAgY2hlY2s6ICd0X2xpamlhbix0X21hbmppYW4sdF9kYWlqaW4nXG4gICAgICogfVxuICAgICAqIC0tLS0tIOi/lOWbniAtLS0tLVxuICAgICAqIHtcbiAgICAgKiAgIHN0YXR1cyxcbiAgICAgKiAgIGRhdGE6IHtcbiAgICAgKiAgICAgdF9saWppYW46IG51bGwvdHJ1ZS9mYWxzZS9oYWxmXG4gICAgICogICAgIHRfbWFuamlhbjogbnVsbC90cnVlL2ZhbHNlXG4gICAgICogICAgIHRfZGFpamluOiBudWxsL3RydWUvZmFsc2VcbiAgICAgKiAgIH0gXG4gICAgICogfVxuICAgICAqL1xuICAgIGFwcC5yb3V0ZXIoJ2lzZ2V0JywgYXN5bmMoIGN0eCwgbmV4dCApID0+IHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgY29uc3QgeyB0aWQsIGNoZWNrIH0gPSBldmVudC5kYXRhO1xuICAgICAgICAgICAgY29uc3Qgb3BlbmlkID0gZXZlbnQuZGF0YS5vcGVuSWQgfHwgZXZlbnQudXNlckluZm8ub3BlbklkO1xuXG4gICAgICAgICAgICAvLyDlhYjmo4Dmn6XvvIzor6XooYznqIvmnInmsqHmnInor6Xnp43kvJjmg6BcbiAgICAgICAgICAgIGNvbnN0IHRyaXAkID0gYXdhaXQgZGIuY29sbGVjdGlvbigndHJpcCcpXG4gICAgICAgICAgICAgICAgLmRvYyggdGlkIClcbiAgICAgICAgICAgICAgICAuZ2V0KCApO1xuXG4gICAgICAgICAgICBjb25zdCB0cmlwID0gdHJpcCQuZGF0YTtcblxuICAgICAgICAgICAgLy8g6KGM56iL56uL5YeP6YeR6aKdL+ihjOeoi+a7oeWHj+mHkeminS/ooYznqIvku6Pph5HliLjph5Hpop1cbiAgICAgICAgICAgIGNvbnN0IHsgcmVkdWNlX3ByaWNlLCBmdWxscmVkdWNlX3ZhbHVlcywgY2FzaGNvdXBvbl92YWx1ZXMgfSA9IHRyaXA7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIC8vIOihjOeoi+eri+WHj+S7o+mHkeWIuFxuICAgICAgICAgICAgY29uc3QgbGlqaWFuJCA9IGF3YWl0IGRiLmNvbGxlY3Rpb24oJ2NvdXBvbicpXG4gICAgICAgICAgICAgICAgLndoZXJlKHtcbiAgICAgICAgICAgICAgICAgICAgdGlkLFxuICAgICAgICAgICAgICAgICAgICBvcGVuaWQsXG4gICAgICAgICAgICAgICAgICAgIHR5cGU6ICd0X2xpamlhbidcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIC5nZXQoICk7XG5cbiAgICAgICAgICAgIC8vIOihjOeoi+a7oeWHj+WIuFxuICAgICAgICAgICAgY29uc3QgbWFuamlhbiQgPSBhd2FpdCBkYi5jb2xsZWN0aW9uKCdjb3Vwb24nKVxuICAgICAgICAgICAgICAgIC53aGVyZSh7XG4gICAgICAgICAgICAgICAgICAgIHRpZCxcbiAgICAgICAgICAgICAgICAgICAgb3BlbmlkLFxuICAgICAgICAgICAgICAgICAgICB0eXBlOiAndF9tYW5qaWFuJ1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLmdldCggKTtcblxuICAgICAgICAgICAgLy8g6KGM56iL56uL5YeP5Yi4XG4gICAgICAgICAgICBjb25zdCBkYWlqaW4kID0gYXdhaXQgZGIuY29sbGVjdGlvbignY291cG9uJylcbiAgICAgICAgICAgICAgICAud2hlcmUoe1xuICAgICAgICAgICAgICAgICAgICB0aWQsXG4gICAgICAgICAgICAgICAgICAgIG9wZW5pZCxcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogJ3RfZGFpamluJ1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLmdldCggKTtcblxuICAgICAgICAgICAgY29uc3QgdGVtcCA9IHsgfTtcbiAgICAgICAgICAgIGNoZWNrLnNwbGl0KCcsJykubWFwKCBjaGVja1R5cGUgPT4ge1xuXG4gICAgICAgICAgICAgICAgaWYgKCBjaGVja1R5cGUgPT09ICd0X21hbmppYW4nICkge1xuICAgICAgICAgICAgICAgICAgICB0ZW1wWyBjaGVja1R5cGUgXSA9ICEhZnVsbHJlZHVjZV92YWx1ZXMgP1xuICAgICAgICAgICAgICAgICAgICAgICAgbWFuamlhbiQuZGF0YS5sZW5ndGggPT09IDAgPyBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmYWxzZSA6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdHJ1ZSA6XG4gICAgICAgICAgICAgICAgICAgICAgICBudWxsXG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmICggY2hlY2tUeXBlID09PSAndF9kYWlqaW4nICkge1xuICAgICAgICAgICAgICAgICAgICB0ZW1wWyBjaGVja1R5cGUgXSA9ICEhY2FzaGNvdXBvbl92YWx1ZXMgP1xuICAgICAgICAgICAgICAgICAgICAgICAgZGFpamluJC5kYXRhLmxlbmd0aCA9PT0gMCA/IFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZhbHNlIDpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0cnVlIDpcbiAgICAgICAgICAgICAgICAgICAgICAgIG51bGxcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKCBjaGVja1R5cGUgPT09ICd0X2xpamlhbicgKSB7XG4gICAgICAgICAgICAgICAgICAgIHRlbXBbIGNoZWNrVHlwZSBdID0gISFyZWR1Y2VfcHJpY2UgP1xuICAgICAgICAgICAgICAgICAgICAgICAgbGlqaWFuJC5kYXRhLmxlbmd0aCA9PT0gMCA/IFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZhbHNlIDpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsaWppYW4kLmRhdGFbIDAgXS52YWx1ZSA8IHJlZHVjZV9wcmljZSA/XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICdoYWxmJyA6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRydWUgOlxuICAgICAgICAgICAgICAgICAgICAgICAgbnVsbFxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHJldHVybiBjdHguYm9keSA9IHtcbiAgICAgICAgICAgICAgICBzdGF0dXM6IDIwMCxcbiAgICAgICAgICAgICAgICBkYXRhOiB0ZW1wXG4gICAgICAgICAgICB9XG4gICAgICAgIH0gY2F0Y2ggKCBlICkgeyByZXR1cm4gY3R4LmJvZHkgPSB7IHN0YXR1cyA6NTAwIH07fVxuICAgIH0pXG4gICAgXG4gICAgLyoqIFxuICAgICAqIEBkZXNjcmlwdGlvbiDljaHliLjliJfooahcbiAgICAgKi9cbiAgICBhcHAucm91dGVyKCdsaXN0JywgYXN5bmMoIGN0eCwgbmV4dCApID0+IHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgY29uc3Qgb3BlbmlkID0gZXZlbnQuZGF0YS5vcGVuSWQgfHwgZXZlbnQudXNlckluZm8ub3BlbklkO1xuICAgICAgICAgICAgY29uc3QgeyBpc1VzZWQgfSA9IGV2ZW50LmRhdGE7XG4gICAgICAgICAgICBsZXQgcXVlcnkkID0ge1xuICAgICAgICAgICAgICAgIG9wZW5pZFxuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgaWYgKCBpc1VzZWQgIT09IHVuZGVmaW5lZCApIHtcbiAgICAgICAgICAgICAgICBxdWVyeSQgPSBPYmplY3QuYXNzaWduKHsgfSwgcXVlcnkkLCB7XG4gICAgICAgICAgICAgICAgICAgIGlzVXNlZFxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBjb25zdCBsaXN0JCA9IGF3YWl0IGRiLmNvbGxlY3Rpb24oJ2NvdXBvbicpXG4gICAgICAgICAgICAgICAgLndoZXJlKCBxdWVyeSQgKVxuICAgICAgICAgICAgICAgIC5nZXQoICk7XG5cbiAgICAgICAgICAgIC8vIOihjOeoi+S/oeaBr1xuICAgICAgICAgICAgY29uc3QgdHJpcHNJZHMgPSBBcnJheS5mcm9tKCBuZXcgU2V0KCBsaXN0JC5kYXRhLm1hcCggeCA9PiB4LnRpZCApKSk7XG4gICAgICAgICAgICBjb25zdCB0cmlwcyQgPSBhd2FpdCBQcm9taXNlLmFsbCggdHJpcHNJZHMubWFwKCB0aWQgPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiBkYi5jb2xsZWN0aW9uKCd0cmlwJylcbiAgICAgICAgICAgICAgICAgICAgLmRvYyggdGlkIClcbiAgICAgICAgICAgICAgICAgICAgLmdldCggKTtcbiAgICAgICAgICAgIH0pKTtcblxuICAgICAgICAgICAgY29uc3QgdHJpcHMgPSB0cmlwcyQubWFwKCB4ID0+IHguZGF0YSApO1xuXG4gICAgICAgICAgICAvLyDljaHliLjmj5LlhaXooYznqItcbiAgICAgICAgICAgIGNvbnN0IGxpc3QgPSBsaXN0JC5kYXRhLm1hcCggY291cG9uID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCB0cmlwTWV0YSA9IHRyaXBzLmZpbmQoIHggPT4geC5faWQgPT09IGNvdXBvbi50aWQgKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gT2JqZWN0LmFzc2lnbih7IH0sIGNvdXBvbiwge1xuICAgICAgICAgICAgICAgICAgICB0cmlwOiB0cmlwTWV0YSB8fCBudWxsXG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICByZXR1cm4gY3R4LmJvZHkgPSB7XG4gICAgICAgICAgICAgICAgc3RhdHVzOiAyMDAsXG4gICAgICAgICAgICAgICAgZGF0YTogbGlzdFxuICAgICAgICAgICAgfVxuXG4gICAgICAgIH0gY2F0Y2ggKCBlICkge1xuICAgICAgICAgICAgcmV0dXJuIGN0eC5ib2R5ID0geyBzdGF0dXM6IDUwMCB9O1xuICAgICAgICB9XG4gICAgfSlcblxuICAgIHJldHVybiBhcHAuc2VydmUoICk7XG59OyJdfQ==