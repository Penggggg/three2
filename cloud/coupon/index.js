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
                                    texts: ["\u606D\u559C\u83B7\u5F97\u7EA2\u5305" + reduce_price + "\u5143", "\u8D81\u65E9\u4F7F\u7528\uFF5E\u4E0B\u5355\u5C31\u51CF\uFF01"]
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLHFDQUF1QztBQUN2QyxzQ0FBd0M7QUFFeEMsS0FBSyxDQUFDLElBQUksQ0FBQztJQUNQLEdBQUcsRUFBRSxPQUFPLENBQUMsR0FBRyxDQUFDLEtBQUs7Q0FDekIsQ0FBQyxDQUFDO0FBRUgsSUFBTSxFQUFFLEdBQWdCLEtBQUssQ0FBQyxRQUFRLEVBQUcsQ0FBQztBQVMxQyxJQUFNLE1BQU0sR0FBRyxVQUFFLEVBQVU7SUFBVixtQkFBQSxFQUFBLFVBQVU7SUFDdkIsSUFBSyxFQUFFLEVBQUc7UUFDTixPQUFPLElBQUksQ0FBQyxHQUFHLEVBQUcsQ0FBQztLQUN0QjtJQUNELElBQU0sTUFBTSxHQUFHLElBQUksSUFBSSxDQUFFLElBQUksSUFBSSxFQUFHLENBQUMsY0FBYyxFQUFHLENBQUMsQ0FBQztJQUN4RCxPQUFPLElBQUksSUFBSSxDQUFFLE1BQU0sQ0FBQyxPQUFPLEVBQUcsR0FBRyxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxJQUFJLENBQUUsQ0FBQTtBQUM3RCxDQUFDLENBQUE7QUFvQlksUUFBQSxJQUFJLEdBQUcsVUFBUSxLQUFLLEVBQUUsT0FBTzs7O1FBRWhDLEdBQUcsR0FBRyxJQUFJLFNBQVMsQ0FBQyxFQUFFLEtBQUssT0FBQSxFQUFFLENBQUMsQ0FBQztRQWtCckMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxRQUFRLEVBQUUsVUFBTyxHQUFHLEVBQUUsSUFBSTs7Ozs7O3dCQUd2QixNQUFNLEdBQUcsS0FBSyxDQUFDLElBQUksQ0FBQyxNQUFNLElBQUksS0FBSyxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUM7d0JBQ3BELElBQUksR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDLEVBQUcsRUFBRSxLQUFLLENBQUMsSUFBSSxFQUFFOzRCQUN4QyxNQUFNLFFBQUE7NEJBQ04sTUFBTSxFQUFFLEtBQUs7NEJBQ2IsT0FBTyxFQUFFLEtBQUssQ0FBQyxJQUFJLENBQUMsT0FBTyxJQUFJLEtBQUssQ0FBQyxJQUFJLENBQUMsR0FBRzs0QkFDN0MsV0FBVyxFQUFFLEtBQUssQ0FBQyxJQUFJLENBQUMsV0FBVyxJQUFJLE1BQU07NEJBQzdDLFVBQVUsRUFBRSxNQUFNLENBQUUsSUFBSSxDQUFFO3lCQUM3QixDQUFDLENBQUM7d0JBRVUsV0FBTSxFQUFFLENBQUMsVUFBVSxDQUFDLFFBQVEsQ0FBQztpQ0FDckMsR0FBRyxDQUFDO2dDQUNELElBQUksRUFBRSxJQUFJOzZCQUNiLENBQUMsRUFBQTs7d0JBSEEsSUFBSSxHQUFHLFNBR1A7d0JBRU4sV0FBTyxHQUFHLENBQUMsSUFBSSxHQUFHO2dDQUNkLE1BQU0sRUFBRSxHQUFHO2dDQUNYLElBQUksRUFBRSxJQUFJLENBQUMsR0FBRzs2QkFDakIsRUFBQTs7O3dCQUNXLFdBQU8sR0FBRyxDQUFDLElBQUksR0FBRyxFQUFFLE1BQU0sRUFBRSxHQUFHLEVBQUUsRUFBQzs7OzthQUNyRCxDQUFDLENBQUM7UUFTSCxHQUFHLENBQUMsTUFBTSxDQUFDLGVBQWUsRUFBRSxVQUFPLEdBQUcsRUFBRSxJQUFJOzs7Ozs7d0JBRzVCLEdBQUcsR0FBSyxLQUFLLENBQUMsSUFBSSxJQUFmLENBQWdCO3dCQUNyQixNQUFNLEdBQUcsS0FBSyxDQUFDLElBQUksQ0FBQyxNQUFNLElBQUksS0FBSyxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUM7d0JBRTVDLFdBQU0sRUFBRSxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUM7aUNBQ3BDLEdBQUcsQ0FBRSxHQUFHLENBQUU7aUNBQ1YsR0FBRyxFQUFHLEVBQUE7O3dCQUZMLEtBQUssR0FBRyxTQUVIO3dCQUVMLElBQUksR0FBRyxLQUFLLENBQUMsSUFBSSxDQUFDO3dCQUNoQixZQUFZLEdBQUssSUFBSSxhQUFULENBQVU7d0JBRWhCLFdBQU0sRUFBRSxDQUFDLFVBQVUsQ0FBQyxRQUFRLENBQUM7aUNBQ3RDLEtBQUssQ0FBQztnQ0FDSCxHQUFHLEtBQUE7Z0NBQ0gsTUFBTSxRQUFBO2dDQUNOLElBQUksRUFBRSxVQUFVOzZCQUNuQixDQUFDO2lDQUNELEdBQUcsRUFBRyxFQUFBOzt3QkFOTCxLQUFLLEdBQUcsU0FNSDt3QkFDTCxNQUFNLEdBQUcsS0FBSyxDQUFDLElBQUksQ0FBRSxDQUFDLENBQUUsQ0FBQzs2QkFHMUIsQ0FBQSxDQUFDLE1BQU0sSUFBSSxDQUFDLENBQUMsWUFBWSxDQUFBLEVBQXpCLGNBQXlCO3dCQUMxQixXQUFNLEVBQUUsQ0FBQyxVQUFVLENBQUMsUUFBUSxDQUFDO2lDQUN4QixHQUFHLENBQUM7Z0NBQ0QsSUFBSSxFQUFFO29DQUNGLEdBQUcsS0FBQTtvQ0FDSCxNQUFNLFFBQUE7b0NBQ04sT0FBTyxFQUFFLENBQUM7b0NBQ1YsT0FBTyxFQUFFLEdBQUc7b0NBQ1osS0FBSyxFQUFFLFlBQVk7b0NBQ25CLElBQUksRUFBRSxVQUFVO29DQUNoQixNQUFNLEVBQUUsS0FBSztvQ0FDYixZQUFZLEVBQUUsS0FBSztvQ0FDbkIsS0FBSyxFQUFFLFNBQVM7b0NBQ2hCLFdBQVcsRUFBRSxNQUFNO29DQUNuQixVQUFVLEVBQUUsTUFBTSxDQUFFLElBQUksQ0FBRTtpQ0FDN0I7NkJBQ0osQ0FBQyxFQUFBOzt3QkFmTixTQWVNLENBQUE7Ozs2QkFJTCxDQUFBLENBQUMsQ0FBQyxNQUFNLElBQUksQ0FBQyxDQUFDLFlBQVksQ0FBQSxFQUExQixjQUEwQjt3QkFDM0IsV0FBTSxFQUFFLENBQUMsVUFBVSxDQUFDLFFBQVEsQ0FBQztpQ0FDeEIsR0FBRyxDQUFFLE1BQU0sQ0FBRSxNQUFNLENBQUMsR0FBRyxDQUFFLENBQUM7aUNBQzFCLE1BQU0sQ0FBQztnQ0FDSixJQUFJLEVBQUU7b0NBQ0YsS0FBSyxFQUFFLFlBQVk7aUNBQ3RCOzZCQUNKLENBQUMsRUFBQTs7d0JBTk4sU0FNTSxDQUFDOzs0QkFJRyxXQUFNLEtBQUssQ0FBQyxZQUFZLENBQUM7NEJBQ25DLElBQUksRUFBRSxRQUFROzRCQUNkLElBQUksRUFBRTtnQ0FDRixJQUFJLEVBQUUsc0JBQXNCO2dDQUM1QixJQUFJLEVBQUU7b0NBQ0YsTUFBTSxRQUFBO29DQUNOLElBQUksRUFBRSxTQUFTO29DQUNmLElBQUksRUFBRSx3QkFBd0I7b0NBQzlCLEtBQUssRUFBRSxDQUFDLHlDQUFTLFlBQVksV0FBRyxFQUFFLDhEQUFZLENBQUM7aUNBQ2xEOzZCQUNKO3lCQUNKLENBQUMsRUFBQTs7d0JBWEksS0FBSyxHQUFHLFNBV1o7d0JBRUYsV0FBTyxHQUFHLENBQUMsSUFBSSxHQUFHO2dDQUNkLE1BQU0sRUFBRSxHQUFHOzZCQUNkLEVBQUM7Ozt3QkFHRixXQUFPLEdBQUcsQ0FBQyxJQUFJLEdBQUcsRUFBRSxNQUFNLEVBQUUsR0FBRyxFQUFFLEVBQUM7Ozs7YUFFekMsQ0FBQyxDQUFDO1FBb0JILEdBQUcsQ0FBQyxNQUFNLENBQUMsT0FBTyxFQUFFLFVBQU8sR0FBRyxFQUFFLElBQUk7Ozs7Ozt3QkFHdEIsS0FBaUIsS0FBSyxDQUFDLElBQUksRUFBekIsR0FBRyxTQUFBLEVBQUUsS0FBSyxXQUFBLENBQWdCO3dCQUM1QixNQUFNLEdBQUcsS0FBSyxDQUFDLElBQUksQ0FBQyxNQUFNLElBQUksS0FBSyxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUM7d0JBRzVDLFdBQU0sRUFBRSxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUM7aUNBQ3BDLEdBQUcsQ0FBRSxHQUFHLENBQUU7aUNBQ1YsR0FBRyxFQUFHLEVBQUE7O3dCQUZMLEtBQUssR0FBRyxTQUVIO3dCQUVMLElBQUksR0FBRyxLQUFLLENBQUMsSUFBSSxDQUFDO3dCQUdoQixpQkFBdUQsSUFBSSxhQUEvQyxFQUFFLHNCQUF5QyxJQUFJLGtCQUE1QixFQUFFLHNCQUFzQixJQUFJLGtCQUFULENBQVU7d0JBR3BELFdBQU0sRUFBRSxDQUFDLFVBQVUsQ0FBQyxRQUFRLENBQUM7aUNBQ3hDLEtBQUssQ0FBQztnQ0FDSCxHQUFHLEtBQUE7Z0NBQ0gsTUFBTSxRQUFBO2dDQUNOLElBQUksRUFBRSxVQUFVOzZCQUNuQixDQUFDO2lDQUNELEdBQUcsRUFBRyxFQUFBOzt3QkFOTCxZQUFVLFNBTUw7d0JBR00sV0FBTSxFQUFFLENBQUMsVUFBVSxDQUFDLFFBQVEsQ0FBQztpQ0FDekMsS0FBSyxDQUFDO2dDQUNILEdBQUcsS0FBQTtnQ0FDSCxNQUFNLFFBQUE7Z0NBQ04sSUFBSSxFQUFFLFdBQVc7NkJBQ3BCLENBQUM7aUNBQ0QsR0FBRyxFQUFHLEVBQUE7O3dCQU5MLGFBQVcsU0FNTjt3QkFHSyxXQUFNLEVBQUUsQ0FBQyxVQUFVLENBQUMsUUFBUSxDQUFDO2lDQUN4QyxLQUFLLENBQUM7Z0NBQ0gsR0FBRyxLQUFBO2dDQUNILE1BQU0sUUFBQTtnQ0FDTixJQUFJLEVBQUUsVUFBVTs2QkFDbkIsQ0FBQztpQ0FDRCxHQUFHLEVBQUcsRUFBQTs7d0JBTkwsWUFBVSxTQU1MO3dCQUVMLFNBQU8sRUFBRyxDQUFDO3dCQUNqQixLQUFLLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBRSxVQUFBLFNBQVM7NEJBRTNCLElBQUssU0FBUyxLQUFLLFdBQVcsRUFBRztnQ0FDN0IsTUFBSSxDQUFFLFNBQVMsQ0FBRSxHQUFHLENBQUMsQ0FBQyxtQkFBaUIsQ0FBQyxDQUFDO29DQUNyQyxVQUFRLENBQUMsSUFBSSxDQUFDLE1BQU0sS0FBSyxDQUFDLENBQUMsQ0FBQzt3Q0FDeEIsS0FBSyxDQUFDLENBQUM7d0NBQ1AsSUFBSSxDQUFDLENBQUM7b0NBQ1YsSUFBSSxDQUFBOzZCQUNYO2lDQUFNLElBQUssU0FBUyxLQUFLLFVBQVUsRUFBRztnQ0FDbkMsTUFBSSxDQUFFLFNBQVMsQ0FBRSxHQUFHLENBQUMsQ0FBQyxtQkFBaUIsQ0FBQyxDQUFDO29DQUNyQyxTQUFPLENBQUMsSUFBSSxDQUFDLE1BQU0sS0FBSyxDQUFDLENBQUMsQ0FBQzt3Q0FDdkIsS0FBSyxDQUFDLENBQUM7d0NBQ1AsSUFBSSxDQUFDLENBQUM7b0NBQ1YsSUFBSSxDQUFBOzZCQUNYO2lDQUFNLElBQUssU0FBUyxLQUFLLFVBQVUsRUFBRztnQ0FDbkMsTUFBSSxDQUFFLFNBQVMsQ0FBRSxHQUFHLENBQUMsQ0FBQyxjQUFZLENBQUMsQ0FBQztvQ0FDaEMsU0FBTyxDQUFDLElBQUksQ0FBQyxNQUFNLEtBQUssQ0FBQyxDQUFDLENBQUM7d0NBQ3ZCLEtBQUssQ0FBQyxDQUFDO3dDQUNQLFNBQU8sQ0FBQyxJQUFJLENBQUUsQ0FBQyxDQUFFLENBQUMsS0FBSyxHQUFHLGNBQVksQ0FBQyxDQUFDOzRDQUNwQyxNQUFNLENBQUMsQ0FBQzs0Q0FDUixJQUFJLENBQUMsQ0FBQztvQ0FDZCxJQUFJLENBQUE7NkJBQ1g7d0JBRUwsQ0FBQyxDQUFDLENBQUM7d0JBRUgsV0FBTyxHQUFHLENBQUMsSUFBSSxHQUFHO2dDQUNkLE1BQU0sRUFBRSxHQUFHO2dDQUNYLElBQUksRUFBRSxNQUFJOzZCQUNiLEVBQUE7Ozt3QkFDVyxXQUFPLEdBQUcsQ0FBQyxJQUFJLEdBQUcsRUFBRSxNQUFNLEVBQUUsR0FBRyxFQUFFLEVBQUM7Ozs7YUFDckQsQ0FBQyxDQUFBO1FBS0YsR0FBRyxDQUFDLE1BQU0sQ0FBQyxNQUFNLEVBQUUsVUFBTyxHQUFHLEVBQUUsSUFBSTs7Ozs7O3dCQUdyQixNQUFNLEdBQUcsS0FBSyxDQUFDLElBQUksQ0FBQyxNQUFNLElBQUksS0FBSyxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUM7d0JBQ2xELE1BQU0sR0FBSyxLQUFLLENBQUMsSUFBSSxPQUFmLENBQWdCO3dCQUMxQixNQUFNLEdBQUc7NEJBQ1QsTUFBTSxRQUFBO3lCQUNULENBQUM7d0JBRUYsSUFBSyxNQUFNLEtBQUssU0FBUyxFQUFHOzRCQUN4QixNQUFNLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQyxFQUFHLEVBQUUsTUFBTSxFQUFFO2dDQUNoQyxNQUFNLFFBQUE7NkJBQ1QsQ0FBQyxDQUFDO3lCQUNOO3dCQUVhLFdBQU0sRUFBRSxDQUFDLFVBQVUsQ0FBQyxRQUFRLENBQUM7aUNBQ3RDLEtBQUssQ0FBRSxNQUFNLENBQUU7aUNBQ2YsR0FBRyxFQUFHLEVBQUE7O3dCQUZMLEtBQUssR0FBRyxTQUVIO3dCQUdMLFFBQVEsR0FBRyxLQUFLLENBQUMsSUFBSSxDQUFFLElBQUksR0FBRyxDQUFFLEtBQUssQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFFLFVBQUEsQ0FBQyxJQUFJLE9BQUEsQ0FBQyxDQUFDLEdBQUcsRUFBTCxDQUFLLENBQUUsQ0FBQyxDQUFDLENBQUM7d0JBQ3RELFdBQU0sT0FBTyxDQUFDLEdBQUcsQ0FBRSxRQUFRLENBQUMsR0FBRyxDQUFFLFVBQUEsR0FBRztnQ0FDL0MsT0FBTyxFQUFFLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQztxQ0FDdkIsR0FBRyxDQUFFLEdBQUcsQ0FBRTtxQ0FDVixHQUFHLEVBQUcsQ0FBQzs0QkFDaEIsQ0FBQyxDQUFDLENBQUMsRUFBQTs7d0JBSkcsTUFBTSxHQUFHLFNBSVo7d0JBRUcsVUFBUSxNQUFNLENBQUMsR0FBRyxDQUFFLFVBQUEsQ0FBQyxJQUFJLE9BQUEsQ0FBQyxDQUFDLElBQUksRUFBTixDQUFNLENBQUUsQ0FBQzt3QkFHbEMsSUFBSSxHQUFHLEtBQUssQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFFLFVBQUEsTUFBTTs0QkFDL0IsSUFBTSxRQUFRLEdBQUcsT0FBSyxDQUFDLElBQUksQ0FBRSxVQUFBLENBQUMsSUFBSSxPQUFBLENBQUMsQ0FBQyxHQUFHLEtBQUssTUFBTSxDQUFDLEdBQUcsRUFBcEIsQ0FBb0IsQ0FBRSxDQUFDOzRCQUN6RCxPQUFPLE1BQU0sQ0FBQyxNQUFNLENBQUMsRUFBRyxFQUFFLE1BQU0sRUFBRTtnQ0FDOUIsSUFBSSxFQUFFLFFBQVEsSUFBSSxJQUFJOzZCQUN6QixDQUFDLENBQUE7d0JBQ04sQ0FBQyxDQUFDLENBQUM7d0JBRUgsV0FBTyxHQUFHLENBQUMsSUFBSSxHQUFHO2dDQUNkLE1BQU0sRUFBRSxHQUFHO2dDQUNYLElBQUksRUFBRSxJQUFJOzZCQUNiLEVBQUE7Ozt3QkFHRCxXQUFPLEdBQUcsQ0FBQyxJQUFJLEdBQUcsRUFBRSxNQUFNLEVBQUUsR0FBRyxFQUFFLEVBQUM7Ozs7YUFFekMsQ0FBQyxDQUFBO1FBRUYsV0FBTyxHQUFHLENBQUMsS0FBSyxFQUFHLEVBQUM7O0tBQ3ZCLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBjbG91ZCBmcm9tICd3eC1zZXJ2ZXItc2RrJztcbmltcG9ydCAqIGFzIFRjYlJvdXRlciBmcm9tICd0Y2Itcm91dGVyJztcblxuY2xvdWQuaW5pdCh7XG4gICAgZW52OiBwcm9jZXNzLmVudi5jbG91ZFxufSk7XG5cbmNvbnN0IGRiOiBEQi5EYXRhYmFzZSA9IGNsb3VkLmRhdGFiYXNlKCApO1xuXG5cbi8qKiBcbiAqIOi9rOaNouagvOael+WwvOayu+aXtuWMuiArOOaXtuWMulxuICogRGF0ZSgpLm5vdygpIC8gbmV3IERhdGUoKS5nZXRUaW1lKCkg5piv5pe25LiN5pe25q2j5bi455qEKzhcbiAqIERhdGUudG9Mb2NhbFN0cmluZyggKSDlpb3lg4/mmK/kuIDnm7TmmK8rMOeahFxuICog5YWI5ou/5YiwICsw77yM54S25ZCOKzhcbiAqL1xuY29uc3QgZ2V0Tm93ID0gKCB0cyA9IGZhbHNlICk6IGFueSA9PiB7XG4gICAgaWYgKCB0cyApIHtcbiAgICAgICAgcmV0dXJuIERhdGUubm93KCApO1xuICAgIH1cbiAgICBjb25zdCB0aW1lXzAgPSBuZXcgRGF0ZSggbmV3IERhdGUoICkudG9Mb2NhbGVTdHJpbmcoICkpO1xuICAgIHJldHVybiBuZXcgRGF0ZSggdGltZV8wLmdldFRpbWUoICkgKyA4ICogNjAgKiA2MCAqIDEwMDAgKVxufVxuXG5cbi8qKlxuICpcbiAqIEBkZXNjcmlwdGlvbiDljaHliLjmqKHlnZdcbiAqIC0tLS0tLS0tIOWtl+autSAtLS0tLS0tLS0tXG4gKiAhIHRpZCDpooblj5bor6XkvJjmg6DliLjnmoTmiYDlsZ7ooYznqIvvvIjlj6/ml6DvvIlcbiAqIHRpdGxlIOWIuOWQjeensFxuICogdXNlZEJ5OiDooqt4eHjooYznqIvmiYDkvb/nlKhcbiAqIHR5cGU6ICd0X2xpamlhbicgfCAndF9tYW5qaWFuJyB8ICd0X2RhaWppbicg5Yi457G75Z6L77ya6KGM56iL56uL5YeP44CB6KGM56iL5ruh5YeP44CB6KGM56iL5Luj6YeR5Yi4XG4gKiBpc1VzZWQ6IOaYr+WQpuW3sueUqFxuICogb3BlbmlkXG4gKiBjYW5Vc2VJbk5leHQ6IOaYr+WQpuS4i+i2n+WPr+eUqFxuICogYXRsZWFzdDog5raI6LS56Zeo5qebXG4gKiB2YWx1Ze+8mua2iOi0ueS8mOaDoOmineW6plxuICohIHZhbGl0ZXJtOiDmnInmlYjmnJ/ml6XmnJ8o5Y+v5pegKVxuICogY3JlYXRlVGltZSDliJvlu7rml6XmnJ9cbiAqIHJlZHVjZV90eXBlOiAneXVhbicgfCAncGVyY2VudCcg5LyY5oOg57G75Z6L77ya5YWD44CB5oqY5omjXG4gKi9cbmV4cG9ydCBjb25zdCBtYWluID0gYXN5bmMgKCBldmVudCwgY29udGV4dCApID0+IHtcblxuICAgIGNvbnN0IGFwcCA9IG5ldyBUY2JSb3V0ZXIoeyBldmVudCB9KTtcblxuICAgIC8qKlxuICAgICAqIEBkZXNjcmlwdGlvbiDliJvlu7rkvJjmg6DliLhcbiAgICAgKiAtLS0tLS0tLSDor7fmsYIgLS0tLS0tLS0tXG4gICAgICoge1xuICAgICAqICAgdGlkXG4gICAgICogICB0aXRsZVxuICAgICAqICAgb3BlbmlkICBcbiAgICAgKiAgIHR5cGVcbiAgICAgKiAgIGNhblVzZUluTmV4dFxuICAgICAqICAgYXRsZWFzdFxuICAgICAqICAgdmFsdWVcbiAgICAgKiAgIGZyb210aWRcbiAgICAgKiEgICB2YWxpdGVybVxuICAgICAqISAgIHJlZHVjZV90eXBlXG4gICAgICogfVxuICAgICAqL1xuICAgIGFwcC5yb3V0ZXIoJ2NyZWF0ZScsIGFzeW5jKCBjdHgsIG5leHQgKSA9PiB7XG4gICAgICAgIHRyeSB7XG5cbiAgICAgICAgICAgIGNvbnN0IG9wZW5pZCA9IGV2ZW50LmRhdGEub3BlbklkIHx8IGV2ZW50LnVzZXJJbmZvLm9wZW5JZDtcbiAgICAgICAgICAgIGNvbnN0IHRlbXAgPSBPYmplY3QuYXNzaWduKHsgfSwgZXZlbnQuZGF0YSwge1xuICAgICAgICAgICAgICAgIG9wZW5pZCxcbiAgICAgICAgICAgICAgICBpc1VzZWQ6IGZhbHNlLFxuICAgICAgICAgICAgICAgIGZyb210aWQ6IGV2ZW50LmRhdGEuZnJvbXRpZCB8fCBldmVudC5kYXRhLnRpZCxcbiAgICAgICAgICAgICAgICByZWR1Y2VfdHlwZTogZXZlbnQuZGF0YS5yZWR1Y2VfdHlwZSB8fCAneXVhbicsXG4gICAgICAgICAgICAgICAgY3JlYXRlVGltZTogZ2V0Tm93KCB0cnVlIClcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBjb25zdCBhZGQkID0gYXdhaXQgZGIuY29sbGVjdGlvbignY291cG9uJylcbiAgICAgICAgICAgICAgICAuYWRkKHtcbiAgICAgICAgICAgICAgICAgICAgZGF0YTogdGVtcFxuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICByZXR1cm4gY3R4LmJvZHkgPSB7XG4gICAgICAgICAgICAgICAgc3RhdHVzOiAyMDAsXG4gICAgICAgICAgICAgICAgZGF0YTogYWRkJC5faWRcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBjYXRjaCAoIGUgKSB7IHJldHVybiBjdHguYm9keSA9IHsgc3RhdHVzOiA1MDAgfTt9XG4gICAgfSk7XG5cbiAgICAvKipcbiAgICAgKiBAZGVzY3JpcHRpb24g6KGl6b2Q56uL5YeP5Yi4XG4gICAgICogLS0tLS0tLS0g6K+35rGCIC0tLS0tLS0tXG4gICAgICoge1xuICAgICAqICAgIHRpZFxuICAgICAqIH1cbiAgICAgKi9cbiAgICBhcHAucm91dGVyKCdyZXBhaXItbGlqaWFuJywgYXN5bmMoIGN0eCwgbmV4dCApID0+IHtcbiAgICAgICAgdHJ5IHtcblxuICAgICAgICAgICAgY29uc3QgeyB0aWQgfSA9IGV2ZW50LmRhdGE7XG4gICAgICAgICAgICBjb25zdCBvcGVuaWQgPSBldmVudC5kYXRhLm9wZW5JZCB8fCBldmVudC51c2VySW5mby5vcGVuSWQ7XG5cbiAgICAgICAgICAgIGNvbnN0IHRyaXAkID0gYXdhaXQgZGIuY29sbGVjdGlvbigndHJpcCcpXG4gICAgICAgICAgICAgICAgLmRvYyggdGlkIClcbiAgICAgICAgICAgICAgICAuZ2V0KCApO1xuXG4gICAgICAgICAgICBjb25zdCB0cmlwID0gdHJpcCQuZGF0YTtcbiAgICAgICAgICAgIGNvbnN0IHsgcmVkdWNlX3ByaWNlIH0gPSB0cmlwO1xuXG4gICAgICAgICAgICBjb25zdCBmaW5kJCA9IGF3YWl0IGRiLmNvbGxlY3Rpb24oJ2NvdXBvbicpXG4gICAgICAgICAgICAgICAgLndoZXJlKHtcbiAgICAgICAgICAgICAgICAgICAgdGlkLFxuICAgICAgICAgICAgICAgICAgICBvcGVuaWQsXG4gICAgICAgICAgICAgICAgICAgIHR5cGU6ICd0X2xpamlhbidcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIC5nZXQoICk7XG4gICAgICAgICAgICBjb25zdCB0YXJnZXQgPSBmaW5kJC5kYXRhWyAwIF07XG5cbiAgICAgICAgICAgIC8vIOWFqOmineihpem9kFxuICAgICAgICAgICAgaWYgKCAhdGFyZ2V0ICYmICEhcmVkdWNlX3ByaWNlICkge1xuICAgICAgICAgICAgICAgIGF3YWl0IGRiLmNvbGxlY3Rpb24oJ2NvdXBvbicpXG4gICAgICAgICAgICAgICAgICAgIC5hZGQoe1xuICAgICAgICAgICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRpZCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvcGVuaWQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYXRsZWFzdDogMCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmcm9tdGlkOiB0aWQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU6IHJlZHVjZV9wcmljZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiAndF9saWppYW4nLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlzVXNlZDogZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FuVXNlSW5OZXh0OiBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aXRsZTogJ+ihjOeoi+eri+WHj+S8mOaDoOWIuCcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVkdWNlX3R5cGU6ICd5dWFuJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjcmVhdGVUaW1lOiBnZXROb3coIHRydWUgKVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyDlt67pop3ooaXpvZBcbiAgICAgICAgICAgIGlmICggISF0YXJnZXQgJiYgISFyZWR1Y2VfcHJpY2UgKSB7XG4gICAgICAgICAgICAgICAgYXdhaXQgZGIuY29sbGVjdGlvbignY291cG9uJylcbiAgICAgICAgICAgICAgICAgICAgLmRvYyggU3RyaW5nKCB0YXJnZXQuX2lkICkpXG4gICAgICAgICAgICAgICAgICAgIC51cGRhdGUoe1xuICAgICAgICAgICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlOiByZWR1Y2VfcHJpY2VcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIDTjgIHosIPnlKjmjqjpgIFcbiAgICAgICAgICAgIGNvbnN0IHB1c2gkID0gYXdhaXQgY2xvdWQuY2FsbEZ1bmN0aW9uKHtcbiAgICAgICAgICAgICAgICBuYW1lOiAnY29tbW9uJyxcbiAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICAgICR1cmw6ICdwdXNoLXN1YnNjcmliZS1jbG91ZCcsXG4gICAgICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG9wZW5pZCxcbiAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6ICdob25nYmFvJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIHBhZ2U6ICdwYWdlcy90cmlwLWVudGVyL2luZGV4JyxcbiAgICAgICAgICAgICAgICAgICAgICAgIHRleHRzOiBbYOaBreWWnOiOt+W+l+e6ouWMhSR7cmVkdWNlX3ByaWNlfeWFg2AsIGDotoHml6nkvb/nlKjvvZ7kuIvljZXlsLHlh4/vvIFgXVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHJldHVybiBjdHguYm9keSA9IHtcbiAgICAgICAgICAgICAgICBzdGF0dXM6IDIwMFxuICAgICAgICAgICAgfTtcblxuICAgICAgICB9IGNhdGNoICggZSApIHtcbiAgICAgICAgICAgIHJldHVybiBjdHguYm9keSA9IHsgc3RhdHVzOiA1MDAgfTtcbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgLyoqXG4gICAgICogQGRlc2NyaXB0aW9uIOajgOa1i+ihjOeoi+mHjOmdou+8jOWuouaIt+aYr+WQpuW3sue7j+mihuWPlui/meWHoOexu+eahOS8mOaDoOWIuCwgbnVsbOS4uuayoeacieivpeexu+Wei+S8mOaDoO+8jHRydWXkuLrlt7Lnu4/pooblj5bvvIxmYWxzZeS4uuacqumihuWPllxuICAgICAqIC0tLS0tLS0tIOivt+axgiAtLS0tLS0tXG4gICAgICoge1xuICAgICAqICAgdGlkOiBcbiAgICAgKiAgIG9wZW5pZDogXG4gICAgICogICBjaGVjazogJ3RfbGlqaWFuLHRfbWFuamlhbix0X2RhaWppbidcbiAgICAgKiB9XG4gICAgICogLS0tLS0g6L+U5ZueIC0tLS0tXG4gICAgICoge1xuICAgICAqICAgc3RhdHVzLFxuICAgICAqICAgZGF0YToge1xuICAgICAqICAgICB0X2xpamlhbjogbnVsbC90cnVlL2ZhbHNlL2hhbGZcbiAgICAgKiAgICAgdF9tYW5qaWFuOiBudWxsL3RydWUvZmFsc2VcbiAgICAgKiAgICAgdF9kYWlqaW46IG51bGwvdHJ1ZS9mYWxzZVxuICAgICAqICAgfSBcbiAgICAgKiB9XG4gICAgICovXG4gICAgYXBwLnJvdXRlcignaXNnZXQnLCBhc3luYyggY3R4LCBuZXh0ICkgPT4ge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgXG4gICAgICAgICAgICBjb25zdCB7IHRpZCwgY2hlY2sgfSA9IGV2ZW50LmRhdGE7XG4gICAgICAgICAgICBjb25zdCBvcGVuaWQgPSBldmVudC5kYXRhLm9wZW5JZCB8fCBldmVudC51c2VySW5mby5vcGVuSWQ7XG5cbiAgICAgICAgICAgIC8vIOWFiOajgOafpe+8jOivpeihjOeoi+acieayoeacieivpeenjeS8mOaDoFxuICAgICAgICAgICAgY29uc3QgdHJpcCQgPSBhd2FpdCBkYi5jb2xsZWN0aW9uKCd0cmlwJylcbiAgICAgICAgICAgICAgICAuZG9jKCB0aWQgKVxuICAgICAgICAgICAgICAgIC5nZXQoICk7XG5cbiAgICAgICAgICAgIGNvbnN0IHRyaXAgPSB0cmlwJC5kYXRhO1xuXG4gICAgICAgICAgICAvLyDooYznqIvnq4vlh4/ph5Hpop0v6KGM56iL5ruh5YeP6YeR6aKdL+ihjOeoi+S7o+mHkeWIuOmHkeminVxuICAgICAgICAgICAgY29uc3QgeyByZWR1Y2VfcHJpY2UsIGZ1bGxyZWR1Y2VfdmFsdWVzLCBjYXNoY291cG9uX3ZhbHVlcyB9ID0gdHJpcDtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgLy8g6KGM56iL56uL5YeP5Luj6YeR5Yi4XG4gICAgICAgICAgICBjb25zdCBsaWppYW4kID0gYXdhaXQgZGIuY29sbGVjdGlvbignY291cG9uJylcbiAgICAgICAgICAgICAgICAud2hlcmUoe1xuICAgICAgICAgICAgICAgICAgICB0aWQsXG4gICAgICAgICAgICAgICAgICAgIG9wZW5pZCxcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogJ3RfbGlqaWFuJ1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLmdldCggKTtcblxuICAgICAgICAgICAgLy8g6KGM56iL5ruh5YeP5Yi4XG4gICAgICAgICAgICBjb25zdCBtYW5qaWFuJCA9IGF3YWl0IGRiLmNvbGxlY3Rpb24oJ2NvdXBvbicpXG4gICAgICAgICAgICAgICAgLndoZXJlKHtcbiAgICAgICAgICAgICAgICAgICAgdGlkLFxuICAgICAgICAgICAgICAgICAgICBvcGVuaWQsXG4gICAgICAgICAgICAgICAgICAgIHR5cGU6ICd0X21hbmppYW4nXG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAuZ2V0KCApO1xuXG4gICAgICAgICAgICAvLyDooYznqIvnq4vlh4/liLhcbiAgICAgICAgICAgIGNvbnN0IGRhaWppbiQgPSBhd2FpdCBkYi5jb2xsZWN0aW9uKCdjb3Vwb24nKVxuICAgICAgICAgICAgICAgIC53aGVyZSh7XG4gICAgICAgICAgICAgICAgICAgIHRpZCxcbiAgICAgICAgICAgICAgICAgICAgb3BlbmlkLFxuICAgICAgICAgICAgICAgICAgICB0eXBlOiAndF9kYWlqaW4nXG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAuZ2V0KCApO1xuXG4gICAgICAgICAgICBjb25zdCB0ZW1wID0geyB9O1xuICAgICAgICAgICAgY2hlY2suc3BsaXQoJywnKS5tYXAoIGNoZWNrVHlwZSA9PiB7XG5cbiAgICAgICAgICAgICAgICBpZiAoIGNoZWNrVHlwZSA9PT0gJ3RfbWFuamlhbicgKSB7XG4gICAgICAgICAgICAgICAgICAgIHRlbXBbIGNoZWNrVHlwZSBdID0gISFmdWxscmVkdWNlX3ZhbHVlcyA/XG4gICAgICAgICAgICAgICAgICAgICAgICBtYW5qaWFuJC5kYXRhLmxlbmd0aCA9PT0gMCA/IFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZhbHNlIDpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0cnVlIDpcbiAgICAgICAgICAgICAgICAgICAgICAgIG51bGxcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKCBjaGVja1R5cGUgPT09ICd0X2RhaWppbicgKSB7XG4gICAgICAgICAgICAgICAgICAgIHRlbXBbIGNoZWNrVHlwZSBdID0gISFjYXNoY291cG9uX3ZhbHVlcyA/XG4gICAgICAgICAgICAgICAgICAgICAgICBkYWlqaW4kLmRhdGEubGVuZ3RoID09PSAwID8gXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZmFsc2UgOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRydWUgOlxuICAgICAgICAgICAgICAgICAgICAgICAgbnVsbFxuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoIGNoZWNrVHlwZSA9PT0gJ3RfbGlqaWFuJyApIHtcbiAgICAgICAgICAgICAgICAgICAgdGVtcFsgY2hlY2tUeXBlIF0gPSAhIXJlZHVjZV9wcmljZSA/XG4gICAgICAgICAgICAgICAgICAgICAgICBsaWppYW4kLmRhdGEubGVuZ3RoID09PSAwID8gXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZmFsc2UgOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxpamlhbiQuZGF0YVsgMCBdLnZhbHVlIDwgcmVkdWNlX3ByaWNlID9cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ2hhbGYnIDpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdHJ1ZSA6XG4gICAgICAgICAgICAgICAgICAgICAgICBudWxsXG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgcmV0dXJuIGN0eC5ib2R5ID0ge1xuICAgICAgICAgICAgICAgIHN0YXR1czogMjAwLFxuICAgICAgICAgICAgICAgIGRhdGE6IHRlbXBcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBjYXRjaCAoIGUgKSB7IHJldHVybiBjdHguYm9keSA9IHsgc3RhdHVzIDo1MDAgfTt9XG4gICAgfSlcbiAgICBcbiAgICAvKiogXG4gICAgICogQGRlc2NyaXB0aW9uIOWNoeWIuOWIl+ihqFxuICAgICAqL1xuICAgIGFwcC5yb3V0ZXIoJ2xpc3QnLCBhc3luYyggY3R4LCBuZXh0ICkgPT4ge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgXG4gICAgICAgICAgICBjb25zdCBvcGVuaWQgPSBldmVudC5kYXRhLm9wZW5JZCB8fCBldmVudC51c2VySW5mby5vcGVuSWQ7XG4gICAgICAgICAgICBjb25zdCB7IGlzVXNlZCB9ID0gZXZlbnQuZGF0YTtcbiAgICAgICAgICAgIGxldCBxdWVyeSQgPSB7XG4gICAgICAgICAgICAgICAgb3BlbmlkXG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICBpZiAoIGlzVXNlZCAhPT0gdW5kZWZpbmVkICkge1xuICAgICAgICAgICAgICAgIHF1ZXJ5JCA9IE9iamVjdC5hc3NpZ24oeyB9LCBxdWVyeSQsIHtcbiAgICAgICAgICAgICAgICAgICAgaXNVc2VkXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGNvbnN0IGxpc3QkID0gYXdhaXQgZGIuY29sbGVjdGlvbignY291cG9uJylcbiAgICAgICAgICAgICAgICAud2hlcmUoIHF1ZXJ5JCApXG4gICAgICAgICAgICAgICAgLmdldCggKTtcblxuICAgICAgICAgICAgLy8g6KGM56iL5L+h5oGvXG4gICAgICAgICAgICBjb25zdCB0cmlwc0lkcyA9IEFycmF5LmZyb20oIG5ldyBTZXQoIGxpc3QkLmRhdGEubWFwKCB4ID0+IHgudGlkICkpKTtcbiAgICAgICAgICAgIGNvbnN0IHRyaXBzJCA9IGF3YWl0IFByb21pc2UuYWxsKCB0cmlwc0lkcy5tYXAoIHRpZCA9PiB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGRiLmNvbGxlY3Rpb24oJ3RyaXAnKVxuICAgICAgICAgICAgICAgICAgICAuZG9jKCB0aWQgKVxuICAgICAgICAgICAgICAgICAgICAuZ2V0KCApO1xuICAgICAgICAgICAgfSkpO1xuXG4gICAgICAgICAgICBjb25zdCB0cmlwcyA9IHRyaXBzJC5tYXAoIHggPT4geC5kYXRhICk7XG5cbiAgICAgICAgICAgIC8vIOWNoeWIuOaPkuWFpeihjOeoi1xuICAgICAgICAgICAgY29uc3QgbGlzdCA9IGxpc3QkLmRhdGEubWFwKCBjb3Vwb24gPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IHRyaXBNZXRhID0gdHJpcHMuZmluZCggeCA9PiB4Ll9pZCA9PT0gY291cG9uLnRpZCApO1xuICAgICAgICAgICAgICAgIHJldHVybiBPYmplY3QuYXNzaWduKHsgfSwgY291cG9uLCB7XG4gICAgICAgICAgICAgICAgICAgIHRyaXA6IHRyaXBNZXRhIHx8IG51bGxcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIHJldHVybiBjdHguYm9keSA9IHtcbiAgICAgICAgICAgICAgICBzdGF0dXM6IDIwMCxcbiAgICAgICAgICAgICAgICBkYXRhOiBsaXN0XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfSBjYXRjaCAoIGUgKSB7XG4gICAgICAgICAgICByZXR1cm4gY3R4LmJvZHkgPSB7IHN0YXR1czogNTAwIH07XG4gICAgICAgIH1cbiAgICB9KVxuXG4gICAgcmV0dXJuIGFwcC5zZXJ2ZSggKTtcbn07Il19