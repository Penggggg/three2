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
var create_1 = require("./create");
cloud.init();
var db = cloud.database();
var _ = db.command;
exports.main = function (event, context) { return __awaiter(_this, void 0, void 0, function () {
    var app;
    var _this = this;
    return __generator(this, function (_a) {
        app = new TcbRouter({ event: event });
        app.router('create', function (ctx, next) { return __awaiter(_this, void 0, void 0, function () {
            var _a, tid, from, orders, openid_1, trips$$, trips$, trip, addressid$, aid_1, isNew$, isNew, pay_status_1, p, temp_1, save$, order_result, e_1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 6, , 7]);
                        _a = event.data, tid = _a.tid, from = _a.from, orders = _a.orders;
                        openid_1 = event.data.openId || event.userInfo.openId;
                        return [4, cloud.callFunction({
                                data: {
                                    data: {
                                        _id: tid
                                    },
                                    $url: 'detail'
                                },
                                name: 'trip'
                            })];
                    case 1:
                        trips$$ = _b.sent();
                        trips$ = trips$$.result;
                        if (trips$.status !== 200
                            || !trips$.data
                            || (!!trips$.data && trips$.data.isClosed)
                            || (!!trips$.data && new Date().getTime() >= trips$.data.end_date)) {
                            throw '暂无行程计划，暂时不能购买～';
                        }
                        trip = trips$.data;
                        addressid$ = {
                            result: {
                                data: null,
                                status: 500
                            }
                        };
                        if (!(event.data.from === 'cart' || event.data.from === 'system')) return [3, 3];
                        return [4, cloud.callFunction({
                                data: {
                                    data: {
                                        openId: openid_1,
                                        address: event.data.orders[0].address
                                    },
                                    $url: 'getAddressId'
                                },
                                name: 'address'
                            })];
                    case 2:
                        addressid$ = _b.sent();
                        _b.label = 3;
                    case 3:
                        if ((event.data.from === 'cart' || event.data.from === 'system') && addressid$.result.status !== 200) {
                            throw '查询地址错误';
                        }
                        aid_1 = addressid$.result.data;
                        return [4, cloud.callFunction({
                                name: 'common',
                                data: {
                                    $url: 'is-new-customer',
                                    data: {
                                        openId: openid_1
                                    }
                                }
                            })];
                    case 4:
                        isNew$ = _b.sent();
                        isNew = isNew$.result.data;
                        pay_status_1 = '0';
                        p = trip.payment;
                        if (isNew && p === '0') {
                            pay_status_1 = '0';
                        }
                        else if (isNew && p === '1') {
                            pay_status_1 = '0';
                        }
                        else if (isNew && p === '2') {
                            pay_status_1 = '1';
                        }
                        else if (!isNew && p === '0') {
                            pay_status_1 = '1';
                        }
                        else if (!isNew && p === '1') {
                            pay_status_1 = '0';
                        }
                        else if (!isNew && p === '2') {
                            pay_status_1 = '1';
                        }
                        else {
                            pay_status_1 = '0';
                        }
                        temp_1 = event.data.orders.map(function (meta) {
                            var t = Object.assign({}, meta, {
                                aid: aid_1,
                                isOccupied: true,
                                openid: openid_1,
                                deliver_status: '0',
                                base_status: '0',
                                pay_status: meta.depositPrice === 0 ? '1' : pay_status_1,
                                createTime: new Date().getTime(),
                                type: !!meta.depositPrice ? meta.type : 'normal'
                            });
                            delete t['address'];
                            return t;
                        });
                        return [4, Promise.all(temp_1.map(function (o) {
                                return create_1.create$(openid_1, o, db, ctx);
                            }))];
                    case 5:
                        save$ = _b.sent();
                        if (save$.some(function (x) { return x.status !== 200; })) {
                            throw '创建订单错误！';
                        }
                        order_result = save$.map(function (x, k) {
                            var _a = temp_1[k], price = _a.price, count = _a.count, pay_status = _a.pay_status, depositPrice = _a.depositPrice;
                            return {
                                oid: x._id,
                                price: price,
                                count: count,
                                pay_status: pay_status,
                                depositPrice: depositPrice
                            };
                        });
                        return [2, ctx.body = {
                                status: 200,
                                data: order_result
                            }];
                    case 6:
                        e_1 = _b.sent();
                        return [2, ctx.body = {
                                status: 500,
                                message: e_1
                            }];
                    case 7: return [2];
                }
            });
        }); });
        app.router('list', function (ctx, next) { return __awaiter(_this, void 0, void 0, function () {
            var limit, where$, type, openid, total$, data$, last, fix$, meta, trips$_1, meta2, e_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 6, , 7]);
                        limit = 2;
                        where$ = {};
                        type = event.data.type;
                        openid = event.userInfo.openId;
                        if (type === 'my-all') {
                            where$ = {
                                openid: openid
                            };
                        }
                        else if (type === 'my-notpay') {
                            where$ = _.and({
                                openid: openid,
                                base_status: '2'
                            }, _.or([
                                {
                                    type: 'pre'
                                }, {
                                    pay_status: _.or(_.eq('0'), _.eq('1'))
                                }
                            ]));
                        }
                        else if (type === 'my-delive') {
                            where$ = {
                                openid: openid,
                                pay_status: '2',
                                deliver_status: '0'
                            };
                        }
                        else if (type === 'my-finish') {
                            where$ = {
                                openid: openid,
                                pay_status: '2',
                                deliver_status: '1'
                            };
                        }
                        return [4, db.collection('order')
                                .where(where$)
                                .count()];
                    case 1:
                        total$ = _a.sent();
                        return [4, db.collection('order')
                                .where(where$)
                                .orderBy('createTime', 'desc')
                                .limit(limit)
                                .skip(event.data.skip || (event.data.page - 1) * limit)
                                .get()];
                    case 2:
                        data$ = _a.sent();
                        last = data$.data[data$.data.length - 1];
                        fix$ = {
                            data: []
                        };
                        if (!last) return [3, 4];
                        return [4, db.collection('order')
                                .where({
                                openid: openid,
                                tid: last.tid
                            })
                                .orderBy('createTime', 'desc')
                                .skip(event.data.skip ? event.data.skip + data$.data.length : (event.data.page - 1) * limit + data$.data.length)
                                .get()];
                    case 3:
                        fix$ = _a.sent();
                        _a.label = 4;
                    case 4:
                        meta = data$.data.concat(fix$.data);
                        return [4, Promise.all(meta.map(function (x) {
                                return db.collection('trip')
                                    .where({
                                    _id: x.tid
                                })
                                    .field({
                                    title: true,
                                    start_date: true,
                                    payment: true,
                                    postage: true,
                                    postagefree_atleast: true
                                })
                                    .get();
                            }))];
                    case 5:
                        trips$_1 = _a.sent();
                        meta2 = meta.map(function (x, i) { return Object.assign({}, x, {
                            trip: trips$_1[i].data[0]
                        }); });
                        return [2, ctx.body = {
                                status: 200,
                                data: {
                                    data: meta2,
                                    pageSize: limit,
                                    total: total$.total,
                                    page: fix$.data.length === 0 ? event.data.page : event.data.page + Math.ceil(fix$.data.length / limit),
                                    current: event.data.skip ? event.data.skip + meta.length : (event.data.page - 1) * limit + meta.length,
                                    totalPage: Math.ceil(total$.total / limit)
                                }
                            }];
                    case 6:
                        e_2 = _a.sent();
                        return [2, ctx.body = { status: 500 }];
                    case 7: return [2];
                }
            });
        }); });
        app.router('upadte-to-payed', function (ctx, next) { return __awaiter(_this, void 0, void 0, function () {
            var orderIds, e_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        orderIds = event.data.orderIds;
                        return [4, Promise.all(orderIds.split(',').map(function (oid) {
                                return db.collection('order').doc(oid)
                                    .update({
                                    data: {
                                        pay_status: '1'
                                    }
                                });
                            }))];
                    case 1:
                        _a.sent();
                        return [2, ctx.body = {
                                status: 200
                            }];
                    case 2:
                        e_3 = _a.sent();
                        return [2, ctx.body = { status: 500 }];
                    case 3: return [2];
                }
            });
        }); });
        return [2, app.serve()];
    });
}); };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFDQSxpQkFxWUM7O0FBcllELHFDQUF1QztBQUN2QyxzQ0FBd0M7QUFDeEMsbUNBQW1DO0FBRW5DLEtBQUssQ0FBQyxJQUFJLEVBQUcsQ0FBQztBQUVkLElBQU0sRUFBRSxHQUFnQixLQUFLLENBQUMsUUFBUSxFQUFHLENBQUM7QUFFMUMsSUFBTSxDQUFDLEdBQUcsRUFBRSxDQUFDLE9BQU8sQ0FBQztBQTBCUixRQUFBLElBQUksR0FBRyxVQUFRLEtBQUssRUFBRSxPQUFPOzs7O1FBRWhDLEdBQUcsR0FBRyxJQUFJLFNBQVMsQ0FBQyxFQUFFLEtBQUssT0FBQSxFQUFFLENBQUMsQ0FBQztRQWdDckMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxRQUFRLEVBQUUsVUFBTyxHQUFHLEVBQUUsSUFBSTs7Ozs7O3dCQUd2QixLQUF3QixLQUFLLENBQUMsSUFBSSxFQUFoQyxHQUFHLFNBQUEsRUFBRSxJQUFJLFVBQUEsRUFBRSxNQUFNLFlBQUEsQ0FBZ0I7d0JBQ25DLFdBQVMsS0FBSyxDQUFDLElBQUksQ0FBQyxNQUFNLElBQUksS0FBSyxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUM7d0JBRzFDLFdBQU0sS0FBSyxDQUFDLFlBQVksQ0FBQztnQ0FDckMsSUFBSSxFQUFFO29DQUNGLElBQUksRUFBRTt3Q0FDRixHQUFHLEVBQUUsR0FBRztxQ0FDWDtvQ0FDRCxJQUFJLEVBQUUsUUFBUTtpQ0FDakI7Z0NBQ0QsSUFBSSxFQUFFLE1BQU07NkJBQ2YsQ0FBQyxFQUFBOzt3QkFSSSxPQUFPLEdBQUcsU0FRZDt3QkFFSSxNQUFNLEdBQUcsT0FBTyxDQUFDLE1BQU0sQ0FBQzt3QkFDOUIsSUFBSyxNQUFNLENBQUMsTUFBTSxLQUFLLEdBQUc7K0JBQ2YsQ0FBQyxNQUFNLENBQUMsSUFBSTsrQkFD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QUcsQ0FBQyxDQUFDLEdBQUcsQ0FBRSxVQUFBLEdBQUc7Z0NBQzNDLE9BQU8sRUFBRSxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUMsQ0FBQyxHQUFHLENBQUUsR0FBRyxDQUFFO3FDQUNuQyxNQUFNLENBQUM7b0NBQ0osSUFBSSxFQUFFO3dDQUNGLFVBQVUsRUFBRSxHQUFHO3FDQUNsQjtpQ0FDSixDQUFDLENBQUM7NEJBQ1gsQ0FBQyxDQUFDLENBQUMsRUFBQTs7d0JBUEgsU0FPRyxDQUFDO3dCQUVKLFdBQU8sR0FBRyxDQUFDLElBQUksR0FBRztnQ0FDZCxNQUFNLEVBQUUsR0FBRzs2QkFDZCxFQUFBOzs7d0JBR0QsV0FBTyxHQUFHLENBQUMsSUFBSSxHQUFHLEVBQUUsTUFBTSxFQUFFLEdBQUcsRUFBRSxFQUFDOzs7O2FBRXpDLENBQUMsQ0FBQTtRQUVILFdBQU8sR0FBRyxDQUFDLEtBQUssRUFBRyxFQUFDOztLQUV0QixDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiXG5pbXBvcnQgKiBhcyBjbG91ZCBmcm9tICd3eC1zZXJ2ZXItc2RrJztcbmltcG9ydCAqIGFzIFRjYlJvdXRlciBmcm9tICd0Y2Itcm91dGVyJztcbmltcG9ydCB7IGNyZWF0ZSQgfSBmcm9tICcuL2NyZWF0ZSc7XG5cbmNsb3VkLmluaXQoICk7XG5cbmNvbnN0IGRiOiBEQi5EYXRhYmFzZSA9IGNsb3VkLmRhdGFiYXNlKCApO1xuXG5jb25zdCBfID0gZGIuY29tbWFuZDtcblxuLyoqXG4gKiBcbiAqIEBkZXNjcmlwdGlvbiDorqLljZXmqKHlnZdcbiAqIC0tLS0tLS0tIOWtl+autSAtLS0tLS0tLS0tXG4gKiBfaWRcbiAqIG9wZW5pZCxcbiAqIGNyZWF0ZXRpbWVcbiAqIHRpZCxcbiAqIHBpZCxcbiAqICEgY2lkICjlj6/kuLrnqbopXG4gKiAhIHNpZCwgKOWPr+S4uuepuilcbiAqIGNvdW50LFxuICogcHJpY2UsXG4gKiBkZXBvc2l0X3ByaWNlOiDllYblk4HorqLph5EgKOWPr+S4uuepuilcbiAqISBpc09jY3VwaWVkLCDmmK/lkKbljaDlupPlrZhcbiAqICEgZ3JvdXBfcHJpY2UgKOWPr+S4uuepuilcbiAqIHR5cGU6ICdjdXN0b20nIHwgJ25vcm1hbCcgfCAncHJlJyDoh6rlrprkuYnliqDljZXjgIHmma7pgJrliqDljZXjgIHpooTorqLljZVcbiAqIGltZzogQXJyYXlbIHN0cmluZyBdXG4gKiAhIGRlc2PvvIjlj6/kuLrnqbrvvIksXG4gKiBhaWRcbiAqICEgYmFzZV9zdGF0dXM6IDAsMSwyLDMsNCw1IOi/m+ihjOS4re+8iOWuouaIt+i/mOWPr+S7peiwg+aVtOiHquW3seeahOiuouWNle+8ie+8jOS7o+i0reW3sui0reS5sO+8jOW3suiwg+aVtO+8jOW3sue7k+eul++8jOW3suWPlua2iO+8iOS5sOS4jeWIsO+8ie+8jOW3sui/h+acn++8iOaUr+S7mOi/h+acn++8iVxuICogISBwYXlfc3RhdHVzOiAwLDEsMiDmnKrku5jmrL7vvIzlt7Lku5jorqLph5HvvIzlt7Lku5jlhajmrL5cbiAqICEgZGVsaXZlcl9zdGF0dXM6IDAsMSDmnKrlj5HluIPvvIzlt7Llj5HluIPjgIFcbiAqL1xuZXhwb3J0IGNvbnN0IG1haW4gPSBhc3luYyAoIGV2ZW50LCBjb250ZXh0ICkgPT4ge1xuXG4gICAgY29uc3QgYXBwID0gbmV3IFRjYlJvdXRlcih7IGV2ZW50IH0pO1xuXG4gICAgLyoqXG4gICAgICogQGRlc2NyaXB0aW9uIOWIm+W7uuiuouWNlVxuICAgICAqIC0tLS0tLS0tIOivt+axgiAtLS0tLS0tLS0tXG4gICAgICoge1xuICAgICAqICAgICAgdGlkLFxuICAgICAqICAgICAgb3BlbklkIC8vIOiuouWNleS4u+S6ulxuICAgICAqICAgICAgZnJvbTogJ2NhcnQnIHwgJ2J1eScgfCAnY3VzdG9tJyB8ICdhZ2VudHMnIHwgJ3N5c3RlbScg5p2l5rqQ77ya6LSt54mp6L2m44CB55u05o6l6LSt5Lmw44CB6Ieq5a6a5LmJ5LiL5Y2V44CB5Luj6LSt5LiL5Y2V44CB57O757uf5Y+R6LW36aKE5LuY6K6i5Y2VXG4gICAgICogICAgICBvcmRlcnM6IEFycmF5PHsgXG4gICAgICogICAgICAgICAgdGlkXG4gICAgICogICAgICAgICAgY2lkXG4gICAgICogICAgICAgICAgc2lkXG4gICAgICogICAgICAgICAgcGlkXG4gICAgICogICAgICAgICAgcHJpY2VcbiAgICAgKiAgICAgICAgICBuYW1lXG4gICAgICogICAgICAgICAgc3RhbmRlcm5hbWVcbiAgICAgKiAgICAgICAgICBncm91cFByaWNlXG4gICAgICogICAgICAgICAgY291bnRcbiAgICAgKiAgICAgICAgICBkZXNjXG4gICAgICogICAgICAgICAgaW1nXG4gICAgICogICAgICAgICAgdHlwZVxuICAgICAqICAgICAgICAgIHBheV9zdGF0dXMsXG4gICAgICogICAgICAgICAgYWRkcmVzczoge1xuICAgICAqICAgICAgICAgICAgICBuYW1lLFxuICAgICAqICAgICAgICAgICAgICBwaG9uZSxcbiAgICAgKiAgICAgICAgICAgICAgZGV0YWlsLFxuICAgICAqICAgICAgICAgICAgICBwb3N0YWxjb2RlXG4gICAgICogICAgICAgICAgfVxuICAgICAqICAgICAgfT5cbiAgICAgKiB9XG4gICAgICovXG4gICAgYXBwLnJvdXRlcignY3JlYXRlJywgYXN5bmMoIGN0eCwgbmV4dCApID0+IHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgY29uc3QgeyB0aWQsIGZyb20sIG9yZGVycyB9ID0gZXZlbnQuZGF0YTtcbiAgICAgICAgICAgIGNvbnN0IG9wZW5pZCA9IGV2ZW50LmRhdGEub3BlbklkIHx8IGV2ZW50LnVzZXJJbmZvLm9wZW5JZDtcblxuICAgICAgICAgICAgLy8gMeOAgeWIpOaWreivpeihjOeoi+aYr+WQpuWPr+S7peeUqFxuICAgICAgICAgICAgY29uc3QgdHJpcHMkJCA9IGF3YWl0IGNsb3VkLmNhbGxGdW5jdGlvbih7XG4gICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBfaWQ6IHRpZFxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAkdXJsOiAnZGV0YWlsJ1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgbmFtZTogJ3RyaXAnXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgY29uc3QgdHJpcHMkID0gdHJpcHMkJC5yZXN1bHQ7ICAgICAgICBcbiAgICAgICAgICAgIGlmICggdHJpcHMkLnN0YXR1cyAhPT0gMjAwXG4gICAgICAgICAgICAgICAgICAgIHx8ICF0cmlwcyQuZGF0YSBcbiAgICAgICAgICAgICAgICAgICAgfHwgKCAhIXRyaXBzJC5kYXRhICYmIHRyaXBzJC5kYXRhLmlzQ2xvc2VkICkgXG4gICAgICAgICAgICAgICAgICAgIHx8ICggISF0cmlwcyQuZGF0YSAmJiBuZXcgRGF0ZSggKS5nZXRUaW1lKCApID49IHRyaXBzJC5kYXRhLmVuZF9kYXRlICkpIHtcbiAgICAgICAgICAgICAgICB0aHJvdyAn5pqC5peg6KGM56iL6K6h5YiS77yM5pqC5pe25LiN6IO96LSt5Lmw772eJ1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyDmnIDmlrDlj6/nlKjooYznqItcbiAgICAgICAgICAgIGNvbnN0IHRyaXAgPSB0cmlwcyQuZGF0YTtcblxuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiDmoLnmja7lnLDlnYDlr7nosaHvvIzmi7/liLDlnLDlnYBpZFxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICBsZXQgYWRkcmVzc2lkJCA9IHtcbiAgICAgICAgICAgICAgICByZXN1bHQ6IHtcbiAgICAgICAgICAgICAgICAgICAgZGF0YTogbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgc3RhdHVzOiA1MDBcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAvLyDorqLljZXmnaXmupDvvJrotK3nianovabjgIHns7vnu5/liqDljZVcbiAgICAgICAgICAgIGlmICggZXZlbnQuZGF0YS5mcm9tID09PSAnY2FydCcgfHwgZXZlbnQuZGF0YS5mcm9tID09PSAnc3lzdGVtJyApIHtcbiAgICAgICAgICAgICAgICBhZGRyZXNzaWQkID0gYXdhaXQgY2xvdWQuY2FsbEZ1bmN0aW9uKHtcbiAgICAgICAgICAgICAgICAgICAgZGF0YTogeyBcbiAgICAgICAgICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvcGVuSWQ6IG9wZW5pZCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhZGRyZXNzOiBldmVudC5kYXRhLm9yZGVyc1sgMCBdLmFkZHJlc3NcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAkdXJsOiAnZ2V0QWRkcmVzc0lkJ1xuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICBuYW1lOiAnYWRkcmVzcydcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIFxuICAgICAgICAgICAgLy8g6K6i5Y2V5p2l5rqQ77ya6LSt54mp6L2m44CB57O757uf5Yqg5Y2VXG4gICAgICAgICAgICBpZiAoKCBldmVudC5kYXRhLmZyb20gPT09ICdjYXJ0JyB8fCBldmVudC5kYXRhLmZyb20gPT09ICdzeXN0ZW0nICkgJiYgYWRkcmVzc2lkJC5yZXN1bHQuc3RhdHVzICE9PSAyMDAgKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgJ+afpeivouWcsOWdgOmUmeivryc7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIOWPr+eUqOWcsOWdgGlkXG4gICAgICAgICAgICBjb25zdCBhaWQgPSBhZGRyZXNzaWQkLnJlc3VsdC5kYXRhO1xuXG4gICAgICAgICAgICAvLyDmmK/lkKbmlrDlrqLmiLdcbiAgICAgICAgICAgIGNvbnN0IGlzTmV3JCA9IGF3YWl0IGNsb3VkLmNhbGxGdW5jdGlvbih7XG4gICAgICAgICAgICAgICAgbmFtZTogJ2NvbW1vbicsXG4gICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgICAkdXJsOiAnaXMtbmV3LWN1c3RvbWVyJyxcbiAgICAgICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgICAgICAgb3BlbklkOiBvcGVuaWRcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pXG5cbiAgICAgICAgICAgIGNvbnN0IGlzTmV3ID0gaXNOZXckLnJlc3VsdC5kYXRhO1xuXG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIOaWsOWuoiArIOaWsOWuouimgeiuoumHkSA9ICcwJyxcbiAgICAgICAgICAgICAqIOaWsOWuoiArIOimgeiuoumHkSA9ICcwJyxcbiAgICAgICAgICAgICAqIOaWsOWuoiArIOWFjeiuoumHkSA9ICcxJyxcbiAgICAgICAgICAgICAqIOaXp+WuoiArIOaXp+WuouWFjeiuoumHkSA9ICcxJyxcbiAgICAgICAgICAgICAqIOaXp+WuoiArIOimgeiuoumHkSA9ICcwJyxcbiAgICAgICAgICAgICAqIOaXp+WuoiArIOWFjeiuoumHkSA9ICcxJyxcbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgbGV0IHBheV9zdGF0dXMgPSAnMCc7XG4gICAgICAgICAgICBjb25zdCBwID0gdHJpcC5wYXltZW50O1xuXG4gICAgICAgICAgICBpZiAoIGlzTmV3ICYmIHAgPT09ICcwJyApIHtcbiAgICAgICAgICAgICAgICBwYXlfc3RhdHVzID0gJzAnXG5cbiAgICAgICAgICAgIH0gZWxzZSBpZiAoIGlzTmV3ICYmIHAgPT09ICcxJyApIHtcbiAgICAgICAgICAgICAgICBwYXlfc3RhdHVzID0gJzAnXG5cbiAgICAgICAgICAgIH0gZWxzZSBpZiAoIGlzTmV3ICYmIHAgPT09ICcyJyApIHtcbiAgICAgICAgICAgICAgICBwYXlfc3RhdHVzID0gJzEnXG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICB9IGVsc2UgaWYgKCAhaXNOZXcgJiYgcCA9PT0gJzAnICkge1xuICAgICAgICAgICAgICAgIHBheV9zdGF0dXMgPSAnMSdcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoICFpc05ldyAmJiBwID09PSAnMScgKSB7XG4gICAgICAgICAgICAgICAgcGF5X3N0YXR1cyA9ICcwJ1xuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgfSBlbHNlIGlmICggIWlzTmV3ICYmIHAgPT09ICcyJyApIHtcbiAgICAgICAgICAgICAgICBwYXlfc3RhdHVzID0gJzEnXG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHBheV9zdGF0dXMgPSAnMCdcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gM+OAgeaJuemHj+WIm+W7uuiuouWNle+8jO+8iOi/h+a7pOaOieS4jeiDveWIm+W7uui0reeJqea4heWNleeahOWVhuWTge+8iVxuICAgICAgICAgICAgY29uc3QgdGVtcCA9IGV2ZW50LmRhdGEub3JkZXJzLm1hcCggbWV0YSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3QgdCA9IE9iamVjdC5hc3NpZ24oeyB9LCBtZXRhLCB7XG4gICAgICAgICAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICAgICAgICAgKiAhIGRlbGl2ZXJfc3RhdHVz5Li65pyq5Y+R5biDIOWPr+iDveaciemXrumimFxuICAgICAgICAgICAgICAgICAgICAgKi9cbiAgICAgICAgICAgICAgICAgICAgYWlkLFxuICAgICAgICAgICAgICAgICAgICBpc09jY3VwaWVkOiB0cnVlLCAvLyDljaDpooblupPlrZjmoIflv5dcbiAgICAgICAgICAgICAgICAgICAgb3BlbmlkOiBvcGVuaWQsXG4gICAgICAgICAgICAgICAgICAgIGRlbGl2ZXJfc3RhdHVzOiAnMCcsIFxuICAgICAgICAgICAgICAgICAgICBiYXNlX3N0YXR1czogJzAnLFxuICAgICAgICAgICAgICAgICAgICBwYXlfc3RhdHVzOiBtZXRhLmRlcG9zaXRQcmljZSA9PT0gMCA/ICcxJyA6IHBheV9zdGF0dXMgLCAvLyDllYblk4HorqLph5Hpop3luqbkuLowXG4gICAgICAgICAgICAgICAgICAgIGNyZWF0ZVRpbWU6IG5ldyBEYXRlKCApLmdldFRpbWUoICksXG4gICAgICAgICAgICAgICAgICAgIHR5cGU6ICEhbWV0YS5kZXBvc2l0UHJpY2UgPyBtZXRhLnR5cGUgOiAnbm9ybWFsJ1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIGRlbGV0ZSB0WydhZGRyZXNzJ107XG4gICAgICAgICAgICAgICAgcmV0dXJuIHQ7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgLy8gNOOAgeaJuemHj+WIm+W7uuiuouWNlSAoIOWQjOaXtuWkhOeQhuWNoOmihui0p+WtmOeahOmXrumimCApXG4gICAgICAgICAgICBjb25zdCBzYXZlJDogYW55ID0gYXdhaXQgUHJvbWlzZS5hbGwoIHRlbXAubWFwKCBvID0+IHtcbiAgICAgICAgICAgICAgICByZXR1cm4gY3JlYXRlJCggb3BlbmlkLCBvLCBkYiwgY3R4ICk7XG4gICAgICAgICAgICB9KSk7XG4gICAgICAgIFxuICAgICAgICAgICAgaWYgKCBzYXZlJC5zb21lKCB4ID0+IHguc3RhdHVzICE9PSAyMDAgKSkge1xuICAgICAgICAgICAgICAgIHRocm93ICfliJvlu7rorqLljZXplJnor6/vvIEnXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIOi/lOWbnuiuouWNleS/oeaBr1xuICAgICAgICAgICAgY29uc3Qgb3JkZXJfcmVzdWx0ID0gc2F2ZSQubWFwKCggeCwgayApID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCB7IHByaWNlLCBjb3VudCwgcGF5X3N0YXR1cywgZGVwb3NpdFByaWNlIH0gPSB0ZW1wWyBrIF07XG4gICAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICAgICAgb2lkOiB4Ll9pZCxcbiAgICAgICAgICAgICAgICAgICAgcHJpY2UsXG4gICAgICAgICAgICAgICAgICAgIGNvdW50LFxuICAgICAgICAgICAgICAgICAgICBwYXlfc3RhdHVzLFxuICAgICAgICAgICAgICAgICAgICBkZXBvc2l0UHJpY2VcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgcmV0dXJuIGN0eC5ib2R5ID0ge1xuICAgICAgICAgICAgICAgIHN0YXR1czogMjAwLFxuICAgICAgICAgICAgICAgIGRhdGE6IG9yZGVyX3Jlc3VsdFxuICAgICAgICAgICAgfTtcblxuICAgICAgICB9IGNhdGNoICggZSApIHtcbiAgICAgXG4gICAgICAgICAgICByZXR1cm4gY3R4LmJvZHkgPSB7XG4gICAgICAgICAgICAgICAgc3RhdHVzOiA1MDAsXG4gICAgICAgICAgICAgICAgbWVzc2FnZTogZVxuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgLyoqXG4gICAgICog5YiG6aG1ICsgcXVlcnkg5p+l6K+i6K6i5Y2V5YiX6KGo77yI5pyq6IGa5ZCI77yJXG4gICAgICogLS0tLS0g6K+35rGCIC0tLS0tLVxuICAgICAqIHtcbiAgICAgKiAgICAgcGFnZTogbnVtYmVyXG4gICAgICogICAgIHNraXA6IG51bWJlclxuICAgICAqICAgICB0eXBlOiDmiJHnmoTlhajpg6ggfCDmnKrku5jmrL7orqLljZUgfCDlvoXlj5HotKcgfCDlt7LlrozmiJAgfCDnrqHnkIblkZjvvIjooYznqIvorqLljZXvvIl8IOeuoeeQhuWRmO+8iOaJgOacieiuouWNle+8iVxuICAgICAqICAgICB0eXBlOiBteS1hbGwgfCBteS1ub3RwYXkgfCBteS1kZWxpdmVyIHwgbXktZmluaXNoIHwgbWFuYWdlci10cmlwIHwgbWFuYWdlci1hbGxcbiAgICAgKiB9XG4gICAgICogISDmnKrku5jmrL7orqLljZXvvJpwYXlfc3RhdHVzOiDmnKrku5jmrL4v5bey5LuY6K6i6YeRIOaIliB0eXBlOiBwcmVcbiAgICAgKiAhIOW+heWPkei0p++8mmRlbGl2ZXJfc3RhdHVz77ya5pyq5Y+R6LSnIOS4lCBwYXlfc3RhdHVzIOW3suS7mOasvlxuICAgICAqICEg5bey5a6M5oiQ77yaZGVsaXZlcl9zdGF0dXPvvJrlt7Llj5HotKcg5LiUIHBheV9zdGF0dXMg5bey5LuY5YWo5qy+XG4gICAgICovXG4gICAgYXBwLnJvdXRlcignbGlzdCcsIGFzeW5jKCBjdHgsIG5leHQgKSA9PiB7XG4gICAgICAgIHRyeSB7XG5cbiAgICAgICAgICAgIC8vIOafpeivouadoeaVsFxuICAgICAgICAgICAgY29uc3QgbGltaXQgPSAyO1xuXG4gICAgICAgICAgICBsZXQgd2hlcmUkID0geyB9O1xuICAgICAgICAgICAgY29uc3QgeyB0eXBlIH0gPSBldmVudC5kYXRhO1xuICAgICAgICAgICAgY29uc3Qgb3BlbmlkID0gZXZlbnQudXNlckluZm8ub3BlbklkO1xuXG4gICAgICAgICAgICAvLyDmiJHnmoTlhajpg6hcbiAgICAgICAgICAgIGlmICggdHlwZSA9PT0gJ215LWFsbCcgKSB7XG4gICAgICAgICAgICAgICAgd2hlcmUkID0ge1xuICAgICAgICAgICAgICAgICAgICBvcGVuaWQ6IG9wZW5pZFxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8g5pyq5LuY5qy+XG4gICAgICAgICAgICB9IGVsc2UgaWYgKCB0eXBlID09PSAnbXktbm90cGF5JyApIHtcbiAgICAgICAgICAgICAgICB3aGVyZSQgPSBfLmFuZCh7XG4gICAgICAgICAgICAgICAgICAgIG9wZW5pZCxcbiAgICAgICAgICAgICAgICAgICAgYmFzZV9zdGF0dXM6ICcyJ1xuICAgICAgICAgICAgICAgIH0sIF8ub3IoW1xuICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiAncHJlJ1xuICAgICAgICAgICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgICAgICAgICBwYXlfc3RhdHVzOiBfLm9yKCBfLmVxKCcwJyksIF8uZXEoJzEnKSlcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIF0pKTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgLy8g5pyq5Y+R6LSnXG4gICAgICAgICAgICB9IGVsc2UgaWYgKCB0eXBlID09PSAnbXktZGVsaXZlJyApIHtcbiAgICAgICAgICAgICAgICB3aGVyZSQgPSB7XG4gICAgICAgICAgICAgICAgICAgIG9wZW5pZCxcbiAgICAgICAgICAgICAgICAgICAgcGF5X3N0YXR1czogJzInLFxuICAgICAgICAgICAgICAgICAgICBkZWxpdmVyX3N0YXR1czogJzAnXG4gICAgICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgLy8g5bey5a6M5oiQXG4gICAgICAgICAgICB9IGVsc2UgaWYgKCB0eXBlID09PSAnbXktZmluaXNoJyApIHtcbiAgICAgICAgICAgICAgICB3aGVyZSQgPSB7XG4gICAgICAgICAgICAgICAgICAgIG9wZW5pZCxcbiAgICAgICAgICAgICAgICAgICAgcGF5X3N0YXR1czogJzInLFxuICAgICAgICAgICAgICAgICAgICBkZWxpdmVyX3N0YXR1czogJzEnXG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8g6I635Y+W5oC75pWwXG4gICAgICAgICAgICBjb25zdCB0b3RhbCQgPSBhd2FpdCBkYi5jb2xsZWN0aW9uKCdvcmRlcicpXG4gICAgICAgICAgICAgICAgLndoZXJlKCB3aGVyZSQgKVxuICAgICAgICAgICAgICAgIC5jb3VudCggKTtcblxuICAgICAgICAgICAgLy8g6I635Y+W5pWw5o2uXG4gICAgICAgICAgICBjb25zdCBkYXRhJCA9IGF3YWl0IGRiLmNvbGxlY3Rpb24oJ29yZGVyJylcbiAgICAgICAgICAgICAgICAud2hlcmUoIHdoZXJlJCApXG4gICAgICAgICAgICAgICAgLm9yZGVyQnkoJ2NyZWF0ZVRpbWUnLCAnZGVzYycpXG4gICAgICAgICAgICAgICAgLmxpbWl0KCBsaW1pdCApXG4gICAgICAgICAgICAgICAgLnNraXAoIGV2ZW50LmRhdGEuc2tpcCB8fCAoIGV2ZW50LmRhdGEucGFnZSAtIDEgKSAqIGxpbWl0IClcbiAgICAgICAgICAgICAgICAuZ2V0KCApO1xuXG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqICEg55Sx5LqO5p+l6K+i5piv5oyJ5YiG6aG177yM5L2G5piv5pi+56S65piv5oyJ6KGM56iL5p2l6IGa5ZCI5pi+56S6XG4gICAgICAgICAgICAgKiAhIOWboOatpOacieWPr+iDve+8jE7pobXmnIDlkI7kuIDkvY3vvIzot59OKzHpobXnrKzkuIDkvY3kvp3nhLblsZ7kuo7lkIzkuIDooYznqItcbiAgICAgICAgICAgICAqICEg5aaC5LiN6L+b6KGM5aSE55CG77yM5a6i5oi35p+l6K+i6K6i5Y2V5YiX6KGo5pi+56S66KGM56iL6K6i5Y2V5pe277yM5Lya4oCc5pyJ5Y+v6IO94oCd5pi+56S65LiN5YWoXG4gICAgICAgICAgICAgKiAhIOeJueauiuWkhOeQhu+8mueUqOacgOWQjuS4gOS9jeeahHRpZO+8jOafpeivouacgOWQjuS4gOS9jeS7peWQjuWQjHRpZOeahG9yZGVy77yM54S25ZCO5L+u5q2j5omA6L+U5Zue55qEcGFnZVxuICAgICAgICAgICAgICovXG5cbiAgICAgICAgICAgIGNvbnN0IGxhc3QgPSBkYXRhJC5kYXRhWyBkYXRhJC5kYXRhLmxlbmd0aCAtIDEgXTtcblxuICAgICAgICAgICAgbGV0IGZpeCQ6IGFueSA9IHtcbiAgICAgICAgICAgICAgICBkYXRhOiBbIF1cbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIGlmICggbGFzdCApIHsgXG4gICAgICAgICAgICAgICAgZml4JCA9IGF3YWl0IGRiLmNvbGxlY3Rpb24oJ29yZGVyJylcbiAgICAgICAgICAgICAgICAgICAgLndoZXJlKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG9wZW5pZCxcbiAgICAgICAgICAgICAgICAgICAgICAgIHRpZDogbGFzdC50aWRcbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgLm9yZGVyQnkoJ2NyZWF0ZVRpbWUnLCAnZGVzYycpXG4gICAgICAgICAgICAgICAgICAgIC5za2lwKCBldmVudC5kYXRhLnNraXAgPyBldmVudC5kYXRhLnNraXAgKyBkYXRhJC5kYXRhLmxlbmd0aCA6ICggZXZlbnQuZGF0YS5wYWdlIC0gMSApICogbGltaXQgKyBkYXRhJC5kYXRhLmxlbmd0aCApXG4gICAgICAgICAgICAgICAgICAgIC5nZXQoICk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGNvbnN0IG1ldGEgPSBbIC4uLmRhdGEkLmRhdGEsIC4uLmZpeCQuZGF0YSBdO1xuICAgICAgICAgICAgY29uc3QgdHJpcHMkID0gYXdhaXQgUHJvbWlzZS5hbGwoIG1ldGEubWFwKCB4ID0+IHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZGIuY29sbGVjdGlvbigndHJpcCcpXG4gICAgICAgICAgICAgICAgICAgIC53aGVyZSh7XG4gICAgICAgICAgICAgICAgICAgICAgICBfaWQ6IHgudGlkXG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgIC5maWVsZCh7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aXRsZTogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0YXJ0X2RhdGU6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgICAgICBwYXltZW50OiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICAgICAgcG9zdGFnZTogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHBvc3RhZ2VmcmVlX2F0bGVhc3Q6IHRydWVcbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgLmdldCggKTtcbiAgICAgICAgICAgIH0pKTtcbiAgICAgXG4gICAgICAgICAgICAvLyDogZrlkIjooYznqIvmlbDmja5cbiAgICAgICAgICAgIGNvbnN0IG1ldGEyID0gbWV0YS5tYXAoKCB4LCBpICkgPT4gT2JqZWN0LmFzc2lnbih7IH0sIHgsIHtcbiAgICAgICAgICAgICAgICB0cmlwOiB0cmlwcyRbIGkgXS5kYXRhWyAwIF1cbiAgICAgICAgICAgIH0pKTtcblxuICAgICAgICAgICAgcmV0dXJuIGN0eC5ib2R5ID0ge1xuICAgICAgICAgICAgICAgIHN0YXR1czogMjAwLFxuICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgZGF0YTogbWV0YTIsXG4gICAgICAgICAgICAgICAgICAgIHBhZ2VTaXplOiBsaW1pdCxcbiAgICAgICAgICAgICAgICAgICAgdG90YWw6IHRvdGFsJC50b3RhbCxcbiAgICAgICAgICAgICAgICAgICAgcGFnZTogZml4JC5kYXRhLmxlbmd0aCA9PT0gMCA/IGV2ZW50LmRhdGEucGFnZSA6IGV2ZW50LmRhdGEucGFnZSArIE1hdGguY2VpbCggZml4JC5kYXRhLmxlbmd0aCAvIGxpbWl0ICksXG4gICAgICAgICAgICAgICAgICAgIGN1cnJlbnQ6IGV2ZW50LmRhdGEuc2tpcCA/IGV2ZW50LmRhdGEuc2tpcCArIG1ldGEubGVuZ3RoIDogKCBldmVudC5kYXRhLnBhZ2UgLSAxICkgKiBsaW1pdCArIG1ldGEubGVuZ3RoLFxuICAgICAgICAgICAgICAgICAgICB0b3RhbFBhZ2U6IE1hdGguY2VpbCggdG90YWwkLnRvdGFsIC8gbGltaXQgKVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIFxuICAgICAgICB9IGNhdGNoICggZSApIHsgcmV0dXJuIGN0eC5ib2R5ID0geyBzdGF0dXM6IDUwMH07fVxuICAgIH0pXG5cbiAgICAvKipcbiAgICAgKiDmibnph4/mm7TmlrDvvIzorqLljZXkuLrlt7LmlK/ku5hcbiAgICAgKiBvcmRlcklkczogXCIxMjMsMjM0LDM0NVwiXG4gICAgICovXG4gICAgYXBwLnJvdXRlcigndXBhZHRlLXRvLXBheWVkJywgYXN5bmMoIGN0eCwgbmV4dCApID0+IHtcbiAgICAgICAgdHJ5IHtcblxuICAgICAgICAgICAgY29uc3QgeyBvcmRlcklkcyB9ID0gZXZlbnQuZGF0YTtcbiAgICAgICAgICAgIGF3YWl0IFByb21pc2UuYWxsKCBvcmRlcklkcy5zcGxpdCgnLCcpLm1hcCggb2lkID0+IHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZGIuY29sbGVjdGlvbignb3JkZXInKS5kb2MoIG9pZCApXG4gICAgICAgICAgICAgICAgICAgIC51cGRhdGUoe1xuICAgICAgICAgICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBheV9zdGF0dXM6ICcxJ1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0pKTtcblxuICAgICAgICAgICAgcmV0dXJuIGN0eC5ib2R5ID0ge1xuICAgICAgICAgICAgICAgIHN0YXR1czogMjAwXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfSBjYXRjaCAoIGUgKSB7IFxuICAgICAgICAgICAgcmV0dXJuIGN0eC5ib2R5ID0geyBzdGF0dXM6IDUwMCB9O1xuICAgICAgICB9IFxuICAgIH0pXG4gXG4gICByZXR1cm4gYXBwLnNlcnZlKCApO1xuXG59Il19