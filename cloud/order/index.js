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
                        if (!(event.data.from === 'cart' || event.data.from === 'system' || event.data.from === 'buy')) return [3, 3];
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
                                pay_status: !meta.depositPrice ? '1' : pay_status_1,
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
                                oid: x.data._id,
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
                        limit = 10;
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
            var orderIds, find$, list, e_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 4, , 5]);
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
                        return [4, Promise.all(orderIds.split(',').map(function (oid) {
                                return db.collection('order')
                                    .where({
                                    _id: oid
                                })
                                    .get();
                            }))];
                    case 2:
                        find$ = _a.sent();
                        list = find$.map(function (x) {
                            var _a = x.data[0], _id = _a._id, tid = _a.tid, pid = _a.pid, sid = _a.sid, price = _a.price, groupPrice = _a.groupPrice;
                            return {
                                oid: _id,
                                tid: tid, pid: pid, sid: sid, price: price,
                                groupPrice: groupPrice
                            };
                        });
                        return [4, cloud.callFunction({
                                name: 'shopping-list',
                                data: {
                                    $url: 'create',
                                    data: {
                                        list: list
                                    }
                                }
                            })];
                    case 3:
                        _a.sent();
                        return [2, ctx.body = {
                                status: 200
                            }];
                    case 4:
                        e_3 = _a.sent();
                        return [2, ctx.body = { status: 500 }];
                    case 5: return [2];
                }
            });
        }); });
        app.router('test', function (ctx, next) { return __awaiter(_this, void 0, void 0, function () {
            var lostOrders_1, trips$, currentTrip, tid_1, find1$, find2$, tripShoppingList_1, e_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 5, , 6]);
                        lostOrders_1 = [];
                        return [4, cloud.callFunction({
                                name: 'trip',
                                data: {
                                    $url: 'enter'
                                }
                            })];
                    case 1:
                        trips$ = _a.sent();
                        currentTrip = trips$.result.data[0];
                        if (!currentTrip) {
                            return [2, ctx.body = {
                                    status: 200
                                }];
                        }
                        tid_1 = currentTrip._id;
                        return [4, db.collection('order')
                                .where({
                                tid: tid_1,
                                pay_status: '1'
                            })
                                .get()];
                    case 2:
                        find1$ = _a.sent();
                        if (find1$.data.length === 0) {
                            return [2, ctx.body = {
                                    status: 200
                                }];
                        }
                        return [4, db.collection('shopping-list')
                                .where({
                                tid: tid_1
                            })
                                .get()];
                    case 3:
                        find2$ = _a.sent();
                        tripShoppingList_1 = find2$.data;
                        find1$.data.map(function (order) {
                            var sid = order.sid, pid = order.pid, _id = order._id;
                            var currentGoodShoppingList = tripShoppingList_1.find(function (x) { return x.sid === sid && x.pid === pid; });
                            if (!currentGoodShoppingList) {
                                lostOrders_1.push({
                                    tid: tid_1,
                                    sid: sid,
                                    pid: pid,
                                    oid: _id
                                });
                            }
                            else {
                                var oids = currentGoodShoppingList.oids;
                                if (!oids.find(function (x) { return x === _id; })) {
                                    lostOrders_1.push({
                                        tid: tid_1,
                                        sid: sid,
                                        pid: pid,
                                        oid: _id
                                    });
                                }
                            }
                        });
                        if (lostOrders_1.length === 0) {
                            return [2, ctx.body = {
                                    status: 200
                                }];
                        }
                        return [4, cloud.callFunction({
                                name: 'shopping-list',
                                data: {
                                    $url: 'create',
                                    data: {
                                        list: lostOrders_1
                                    }
                                }
                            })];
                    case 4:
                        _a.sent();
                        return [2, ctx.body = {
                                status: 200,
                                data: lostOrders_1
                            }];
                    case 5:
                        e_4 = _a.sent();
                        console.log('!!!!定时器订单catchLostOrders错误');
                        return [2, ctx.body = { status: 500 }];
                    case 6: return [2];
                }
            });
        }); });
        app.router('daigou-list', function (ctx, next) { return __awaiter(_this, void 0, void 0, function () {
            var tid, orders$_1, users$, address$_1, userOders, e_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 4, , 5]);
                        tid = event.data.tid;
                        return [4, db.collection('order')
                                .where({
                                tid: tid
                            })
                                .get()];
                    case 1:
                        orders$_1 = _a.sent();
                        return [4, Promise.all(Array.from(new Set(orders$_1.data
                                .map(function (x) { return x.openid; })))
                                .map(function (uid) { return db.collection('user')
                                .where({
                                openid: uid
                            })
                                .get(); }))];
                    case 2:
                        users$ = _a.sent();
                        return [4, Promise.all(Array.from(new Set(orders$_1.data
                                .map(function (x) { return x.aid; })))
                                .map(function (aid) { return db.collection('address')
                                .doc(aid)
                                .get(); }))];
                    case 3:
                        address$_1 = _a.sent();
                        userOders = users$.map(function (user$) {
                            var user = user$.data[0];
                            var orders = orders$_1.data.filter(function (x) { return x.openid === user.openid; });
                            var address = address$_1
                                .map(function (x) { return x.data; })
                                .filter(function (x) { return x.openid === user.openid; });
                            return {
                                user: user,
                                orders: orders,
                                address: address
                            };
                        });
                        return [2, ctx.body = {
                                status: 200,
                                data: userOders
                            }];
                    case 4:
                        e_5 = _a.sent();
                        return [2, ctx.body = { status: 500 }];
                    case 5: return [2];
                }
            });
        }); });
        return [2, app.serve()];
    });
}); };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFDQSxpQkFzbEJDOztBQXRsQkQscUNBQXVDO0FBQ3ZDLHNDQUF3QztBQUN4QyxtQ0FBbUM7QUFFbkMsS0FBSyxDQUFDLElBQUksRUFBRyxDQUFDO0FBRWQsSUFBTSxFQUFFLEdBQWdCLEtBQUssQ0FBQyxRQUFRLEVBQUcsQ0FBQztBQUUxQyxJQUFNLENBQUMsR0FBRyxFQUFFLENBQUMsT0FBTyxDQUFDO0FBK0JSLFFBQUEsSUFBSSxHQUFHLFVBQVEsS0FBSyxFQUFFLE9BQU87Ozs7UUFFaEMsR0FBRyxHQUFHLElBQUksU0FBUyxDQUFDLEVBQUUsS0FBSyxPQUFBLEVBQUUsQ0FBQyxDQUFDO1FBZ0NyQyxHQUFHLENBQUMsTUFBTSxDQUFDLFFBQVEsRUFBRSxVQUFPLEdBQUcsRUFBRSxJQUFJOzs7Ozs7d0JBR3ZCLEtBQXdCLEtBQUssQ0FBQyxJQUFJLEVBQWhDLEdBQUcsU0FBQSxFQUFFLElBQUksVUFBQSxFQUFFLE1BQU0sWUFBQSxDQUFnQjt3QkFDbkMsV0FBUyxLQUFLLENBQUMsSUFBSSxDQUFDLE1BQU0sSUFBSSxLQUFLLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQzt3QkFHMUMsV0FBTSxLQUFLLENBQUMsWUFBWSxDQUFDO2dDQUNyQyxJQUFJLEVBQUU7b0NBQ0YsSUFBSSxFQUFFO3dDQUNGLEdBQUcsRUFBRSxHQUFHO3FDQUNYO29DQUNELElBQUksRUFBRSxRQUFRO2lDQUNqQjtnQ0FDRCxJQUFJLEVBQUUsTUFBTTs2QkFDZixDQUFDLEVBQUE7O3dCQVJJLE9BQU8sR0FBRyxTQVFkO3dCQUVJLE1BQU0sR0FBRyxPQUFPLENBQUMsTUFBTSxDQUFDO3dCQUM5QixJQUFLLE1BQU0sQ0FBQyxNQUFNLEtBQUssR0FBRzsrQkFDZixDQUFDLE1BQU0sQ0FBQyxJQUFJOytC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QUksR0FBRztnQ0FDZCxNQUFNLEVBQUUsR0FBRztnQ0FDWCxJQUFJLEVBQUUsU0FBUzs2QkFDbEIsRUFBQTs7O3dCQUdELFdBQU8sR0FBRyxDQUFDLElBQUksR0FBRyxFQUFFLE1BQU0sRUFBRSxHQUFHLEVBQUUsRUFBQzs7OzthQUV6QyxDQUFDLENBQUE7UUFFSCxXQUFPLEdBQUcsQ0FBQyxLQUFLLEVBQUcsRUFBQzs7S0FFdEIsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbIlxuaW1wb3J0ICogYXMgY2xvdWQgZnJvbSAnd3gtc2VydmVyLXNkayc7XG5pbXBvcnQgKiBhcyBUY2JSb3V0ZXIgZnJvbSAndGNiLXJvdXRlcic7XG5pbXBvcnQgeyBjcmVhdGUkIH0gZnJvbSAnLi9jcmVhdGUnO1xuXG5jbG91ZC5pbml0KCApO1xuXG5jb25zdCBkYjogREIuRGF0YWJhc2UgPSBjbG91ZC5kYXRhYmFzZSggKTtcblxuY29uc3QgXyA9IGRiLmNvbW1hbmQ7XG5cbi8qKlxuICogXG4gKiBAZGVzY3JpcHRpb24g6K6i5Y2V5qih5Z2XXG4gKiAtLS0tLS0tLSDlrZfmrrUgLS0tLS0tLS0tLVxuICogX2lkXG4gKiBvcGVuaWQsXG4gKiBjcmVhdGV0aW1lXG4gKiB0aWQsXG4gKiBwaWQsXG4gKiAhIGNpZCAo5Y+v5Li656m6KVxuICogISBzaWQsICjlj6/kuLrnqbopXG4gKiBjb3VudCxcbiAqIHByaWNlLFxuICogZ3JvdXBQcmljZSxcbiAqIGRlcG9zaXRfcHJpY2U6IOWVhuWTgeiuoumHkSAo5Y+v5Li656m6KVxuICohIGlzT2NjdXBpZWQsIOaYr+WQpuWNoOW6k+WtmFxuICogISBncm91cF9wcmljZSAo5Y+v5Li656m6KVxuICogdHlwZTogJ2N1c3RvbScgfCAnbm9ybWFsJyB8ICdwcmUnIOiHquWumuS5ieWKoOWNleOAgeaZrumAmuWKoOWNleOAgemihOiuouWNlVxuICogaW1nOiBBcnJheVsgc3RyaW5nIF1cbiAqICEgZGVzY++8iOWPr+S4uuepuu+8iSxcbiAqIGFpZFxuICogYWxsb2NhdGVkUHJpY2Ug5YiG6YWN55qE5Lu35qC8XG4gKiBhbGxvY2F0ZWRHcm91cFByaWNlIOWIhumFjeWboui0reS7t1xuICogYWxsb2NhdGVkQ291bnQg5YiG6YWN55qE5pWw6YePXG4gKiEgZmluYWxfcHJpY2Ug5pyA5ZCO5oiQ5Lqk5Lu3XG4gKiAhIGJhc2Vfc3RhdHVzOiAwLDEsMiwzLDQsNSDov5vooYzkuK3vvIjlrqLmiLfov5jlj6/ku6XosIPmlbToh6rlt7HnmoTorqLljZXvvInvvIzku6PotK3lt7LotK3kubDvvIzlt7LosIPmlbTvvIzlt7Lnu5PnrpfvvIzlt7Llj5bmtojvvIjkubDkuI3liLDvvInvvIzlt7Lov4fmnJ/vvIjmlK/ku5jov4fmnJ/vvIlcbiAqICEgcGF5X3N0YXR1czogMCwxLDIg5pyq5LuY5qy+77yM5bey5LuY6K6i6YeR77yM5bey5LuY5YWo5qy+XG4gKiAhIGRlbGl2ZXJfc3RhdHVzOiAwLDEg5pyq5Y+R5biD77yM5bey5Y+R5biD44CBXG4gKi9cbmV4cG9ydCBjb25zdCBtYWluID0gYXN5bmMgKCBldmVudCwgY29udGV4dCApID0+IHtcblxuICAgIGNvbnN0IGFwcCA9IG5ldyBUY2JSb3V0ZXIoeyBldmVudCB9KTtcblxuICAgIC8qKlxuICAgICAqIEBkZXNjcmlwdGlvbiDliJvlu7rorqLljZVcbiAgICAgKiAtLS0tLS0tLSDor7fmsYIgLS0tLS0tLS0tLVxuICAgICAqIHtcbiAgICAgKiAgICAgIHRpZCxcbiAgICAgKiAgICAgIG9wZW5JZCAvLyDorqLljZXkuLvkurpcbiAgICAgKiAgICAgIGZyb206ICdjYXJ0JyB8ICdidXknIHwgJ2N1c3RvbScgfCAnYWdlbnRzJyB8ICdzeXN0ZW0nIOadpea6kO+8mui0reeJqei9puOAgeebtOaOpei0reS5sOOAgeiHquWumuS5ieS4i+WNleOAgeS7o+i0reS4i+WNleOAgeezu+e7n+WPkei1t+mihOS7mOiuouWNlVxuICAgICAqICAgICAgb3JkZXJzOiBBcnJheTx7IFxuICAgICAqICAgICAgICAgIHRpZFxuICAgICAqICAgICAgICAgIGNpZFxuICAgICAqICAgICAgICAgIHNpZFxuICAgICAqICAgICAgICAgIHBpZFxuICAgICAqICAgICAgICAgIHByaWNlXG4gICAgICogICAgICAgICAgbmFtZVxuICAgICAqICAgICAgICAgIHN0YW5kZXJuYW1lXG4gICAgICogICAgICAgICAgZ3JvdXBQcmljZVxuICAgICAqICAgICAgICAgIGNvdW50XG4gICAgICogICAgICAgICAgZGVzY1xuICAgICAqICAgICAgICAgIGltZ1xuICAgICAqICAgICAgICAgIHR5cGVcbiAgICAgKiAgICAgICAgICBwYXlfc3RhdHVzLFxuICAgICAqICAgICAgICAgIGFkZHJlc3M6IHtcbiAgICAgKiAgICAgICAgICAgICAgbmFtZSxcbiAgICAgKiAgICAgICAgICAgICAgcGhvbmUsXG4gICAgICogICAgICAgICAgICAgIGRldGFpbCxcbiAgICAgKiAgICAgICAgICAgICAgcG9zdGFsY29kZVxuICAgICAqICAgICAgICAgIH1cbiAgICAgKiAgICAgIH0+XG4gICAgICogfVxuICAgICAqL1xuICAgIGFwcC5yb3V0ZXIoJ2NyZWF0ZScsIGFzeW5jKCBjdHgsIG5leHQgKSA9PiB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGNvbnN0IHsgdGlkLCBmcm9tLCBvcmRlcnMgfSA9IGV2ZW50LmRhdGE7XG4gICAgICAgICAgICBjb25zdCBvcGVuaWQgPSBldmVudC5kYXRhLm9wZW5JZCB8fCBldmVudC51c2VySW5mby5vcGVuSWQ7XG5cbiAgICAgICAgICAgIC8vIDHjgIHliKTmlq3or6XooYznqIvmmK/lkKblj6/ku6XnlKhcbiAgICAgICAgICAgIGNvbnN0IHRyaXBzJCQgPSBhd2FpdCBjbG91ZC5jYWxsRnVuY3Rpb24oe1xuICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgICAgICAgX2lkOiB0aWRcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgJHVybDogJ2RldGFpbCdcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIG5hbWU6ICd0cmlwJ1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIGNvbnN0IHRyaXBzJCA9IHRyaXBzJCQucmVzdWx0OyAgICAgICAgXG4gICAgICAgICAgICBpZiAoIHRyaXBzJC5zdGF0dXMgIT09IDIwMFxuICAgICAgICAgICAgICAgICAgICB8fCAhdHJpcHMkLmRhdGEgXG4gICAgICAgICAgICAgICAgICAgIHx8ICggISF0cmlwcyQuZGF0YSAmJiB0cmlwcyQuZGF0YS5pc0Nsb3NlZCApIFxuICAgICAgICAgICAgICAgICAgICB8fCAoICEhdHJpcHMkLmRhdGEgJiYgbmV3IERhdGUoICkuZ2V0VGltZSggKSA+PSB0cmlwcyQuZGF0YS5lbmRfZGF0ZSApKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgJ+aaguaXoOihjOeoi+iuoeWIku+8jOaaguaXtuS4jeiDvei0reS5sO+9nidcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8g5pyA5paw5Y+v55So6KGM56iLXG4gICAgICAgICAgICBjb25zdCB0cmlwID0gdHJpcHMkLmRhdGE7XG5cbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICog5qC55o2u5Zyw5Z2A5a+56LGh77yM5ou/5Yiw5Zyw5Z2AaWRcbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgbGV0IGFkZHJlc3NpZCQgPSB7XG4gICAgICAgICAgICAgICAgcmVzdWx0OiB7XG4gICAgICAgICAgICAgICAgICAgIGRhdGE6IG51bGwsXG4gICAgICAgICAgICAgICAgICAgIHN0YXR1czogNTAwXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgLy8g6K6i5Y2V5p2l5rqQ77ya6LSt54mp6L2m44CB57O757uf5Yqg5Y2VXG4gICAgICAgICAgICBpZiAoIGV2ZW50LmRhdGEuZnJvbSA9PT0gJ2NhcnQnIHx8IGV2ZW50LmRhdGEuZnJvbSA9PT0gJ3N5c3RlbScgfHwgZXZlbnQuZGF0YS5mcm9tID09PSAnYnV5JyApIHtcbiAgICAgICAgICAgICAgICBhZGRyZXNzaWQkID0gYXdhaXQgY2xvdWQuY2FsbEZ1bmN0aW9uKHtcbiAgICAgICAgICAgICAgICAgICAgZGF0YTogeyBcbiAgICAgICAgICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvcGVuSWQ6IG9wZW5pZCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhZGRyZXNzOiBldmVudC5kYXRhLm9yZGVyc1sgMCBdLmFkZHJlc3NcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAkdXJsOiAnZ2V0QWRkcmVzc0lkJ1xuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICBuYW1lOiAnYWRkcmVzcydcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIFxuICAgICAgICAgICAgLy8g6K6i5Y2V5p2l5rqQ77ya6LSt54mp6L2m44CB57O757uf5Yqg5Y2VXG4gICAgICAgICAgICBpZiAoKCBldmVudC5kYXRhLmZyb20gPT09ICdjYXJ0JyB8fCBldmVudC5kYXRhLmZyb20gPT09ICdzeXN0ZW0nICkgJiYgYWRkcmVzc2lkJC5yZXN1bHQuc3RhdHVzICE9PSAyMDAgKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgJ+afpeivouWcsOWdgOmUmeivryc7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIOWPr+eUqOWcsOWdgGlkXG4gICAgICAgICAgICBjb25zdCBhaWQgPSBhZGRyZXNzaWQkLnJlc3VsdC5kYXRhO1xuXG4gICAgICAgICAgICAvLyDmmK/lkKbmlrDlrqLmiLdcbiAgICAgICAgICAgIGNvbnN0IGlzTmV3JCA9IGF3YWl0IGNsb3VkLmNhbGxGdW5jdGlvbih7XG4gICAgICAgICAgICAgICAgbmFtZTogJ2NvbW1vbicsXG4gICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgICAkdXJsOiAnaXMtbmV3LWN1c3RvbWVyJyxcbiAgICAgICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgICAgICAgb3BlbklkOiBvcGVuaWRcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pXG5cbiAgICAgICAgICAgIGNvbnN0IGlzTmV3ID0gaXNOZXckLnJlc3VsdC5kYXRhO1xuXG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIOaWsOWuoiArIOaWsOWuouimgeiuoumHkSA9ICcwJyxcbiAgICAgICAgICAgICAqIOaWsOWuoiArIOimgeiuoumHkSA9ICcwJyxcbiAgICAgICAgICAgICAqIOaWsOWuoiArIOWFjeiuoumHkSA9ICcxJyxcbiAgICAgICAgICAgICAqIOaXp+WuoiArIOaXp+WuouWFjeiuoumHkSA9ICcxJyxcbiAgICAgICAgICAgICAqIOaXp+WuoiArIOimgeiuoumHkSA9ICcwJyxcbiAgICAgICAgICAgICAqIOaXp+WuoiArIOWFjeiuoumHkSA9ICcxJyxcbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgbGV0IHBheV9zdGF0dXMgPSAnMCc7XG4gICAgICAgICAgICBjb25zdCBwID0gdHJpcC5wYXltZW50O1xuXG4gICAgICAgICAgICBpZiAoIGlzTmV3ICYmIHAgPT09ICcwJyApIHtcbiAgICAgICAgICAgICAgICBwYXlfc3RhdHVzID0gJzAnXG5cbiAgICAgICAgICAgIH0gZWxzZSBpZiAoIGlzTmV3ICYmIHAgPT09ICcxJyApIHtcbiAgICAgICAgICAgICAgICBwYXlfc3RhdHVzID0gJzAnXG5cbiAgICAgICAgICAgIH0gZWxzZSBpZiAoIGlzTmV3ICYmIHAgPT09ICcyJyApIHtcbiAgICAgICAgICAgICAgICBwYXlfc3RhdHVzID0gJzEnXG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICB9IGVsc2UgaWYgKCAhaXNOZXcgJiYgcCA9PT0gJzAnICkge1xuICAgICAgICAgICAgICAgIHBheV9zdGF0dXMgPSAnMSdcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoICFpc05ldyAmJiBwID09PSAnMScgKSB7XG4gICAgICAgICAgICAgICAgcGF5X3N0YXR1cyA9ICcwJ1xuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgfSBlbHNlIGlmICggIWlzTmV3ICYmIHAgPT09ICcyJyApIHtcbiAgICAgICAgICAgICAgICBwYXlfc3RhdHVzID0gJzEnXG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHBheV9zdGF0dXMgPSAnMCdcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gM+OAgeaJuemHj+WIm+W7uuiuouWNle+8jO+8iOi/h+a7pOaOieS4jeiDveWIm+W7uui0reeJqea4heWNleeahOWVhuWTge+8iVxuICAgICAgICAgICAgY29uc3QgdGVtcCA9IGV2ZW50LmRhdGEub3JkZXJzLm1hcCggbWV0YSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3QgdCA9IE9iamVjdC5hc3NpZ24oeyB9LCBtZXRhLCB7XG4gICAgICAgICAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICAgICAgICAgKiAhIGRlbGl2ZXJfc3RhdHVz5Li65pyq5Y+R5biDIOWPr+iDveaciemXrumimFxuICAgICAgICAgICAgICAgICAgICAgKi9cbiAgICAgICAgICAgICAgICAgICAgYWlkLFxuICAgICAgICAgICAgICAgICAgICBpc09jY3VwaWVkOiB0cnVlLCAvLyDljaDpooblupPlrZjmoIflv5dcbiAgICAgICAgICAgICAgICAgICAgb3BlbmlkOiBvcGVuaWQsXG4gICAgICAgICAgICAgICAgICAgIGRlbGl2ZXJfc3RhdHVzOiAnMCcsIFxuICAgICAgICAgICAgICAgICAgICBiYXNlX3N0YXR1czogJzAnLFxuICAgICAgICAgICAgICAgICAgICBwYXlfc3RhdHVzOiAhbWV0YS5kZXBvc2l0UHJpY2UgPyAnMScgOiBwYXlfc3RhdHVzICwgLy8g5ZWG5ZOB6K6i6YeR6aKd5bqm5Li6MFxuICAgICAgICAgICAgICAgICAgICBjcmVhdGVUaW1lOiBuZXcgRGF0ZSggKS5nZXRUaW1lKCApLFxuICAgICAgICAgICAgICAgICAgICB0eXBlOiAhIW1ldGEuZGVwb3NpdFByaWNlID8gbWV0YS50eXBlIDogJ25vcm1hbCdcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICBkZWxldGUgdFsnYWRkcmVzcyddO1xuICAgICAgICAgICAgICAgIHJldHVybiB0O1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIC8vIDTjgIHmibnph4/liJvlu7rorqLljZUgKCDlkIzml7blpITnkIbljaDpoobotKflrZjnmoTpl67popggKVxuICAgICAgICAgICAgY29uc3Qgc2F2ZSQ6IGFueSA9IGF3YWl0IFByb21pc2UuYWxsKCB0ZW1wLm1hcCggbyA9PiB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGNyZWF0ZSQoIG9wZW5pZCwgbywgZGIsIGN0eCApO1xuICAgICAgICAgICAgfSkpO1xuICAgICAgICBcbiAgICAgICAgICAgIGlmICggc2F2ZSQuc29tZSggeCA9PiB4LnN0YXR1cyAhPT0gMjAwICkpIHtcbiAgICAgICAgICAgICAgICB0aHJvdyAn5Yib5bu66K6i5Y2V6ZSZ6K+v77yBJ1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyDov5Tlm57orqLljZXkv6Hmga9cbiAgICAgICAgICAgIGNvbnN0IG9yZGVyX3Jlc3VsdCA9IHNhdmUkLm1hcCgoIHgsIGsgKSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3QgeyBwcmljZSwgY291bnQsIHBheV9zdGF0dXMsIGRlcG9zaXRQcmljZSB9ID0gdGVtcFsgayBdO1xuICAgICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgICAgIG9pZDogeC5kYXRhLl9pZCxcbiAgICAgICAgICAgICAgICAgICAgcHJpY2UsXG4gICAgICAgICAgICAgICAgICAgIGNvdW50LFxuICAgICAgICAgICAgICAgICAgICBwYXlfc3RhdHVzLFxuICAgICAgICAgICAgICAgICAgICBkZXBvc2l0UHJpY2VcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgcmV0dXJuIGN0eC5ib2R5ID0ge1xuICAgICAgICAgICAgICAgIHN0YXR1czogMjAwLFxuICAgICAgICAgICAgICAgIGRhdGE6IG9yZGVyX3Jlc3VsdFxuICAgICAgICAgICAgfTtcblxuICAgICAgICB9IGNhdGNoICggZSApIHtcbiAgICAgXG4gICAgICAgICAgICByZXR1cm4gY3R4LmJvZHkgPSB7XG4gICAgICAgICAgICAgICAgc3RhdHVzOiA1MDAsXG4gICAgICAgICAgICAgICAgbWVzc2FnZTogZVxuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgLyoqXG4gICAgICog5YiG6aG1ICsgcXVlcnkg5p+l6K+i6K6i5Y2V5YiX6KGo77yI5pyq6IGa5ZCI77yJXG4gICAgICogLS0tLS0g6K+35rGCIC0tLS0tLVxuICAgICAqIHtcbiAgICAgKiAgICAgcGFnZTogbnVtYmVyXG4gICAgICogICAgIHNraXA6IG51bWJlclxuICAgICAqICAgICB0eXBlOiDmiJHnmoTlhajpg6ggfCDmnKrku5jmrL7orqLljZUgfCDlvoXlj5HotKcgfCDlt7LlrozmiJAgfCDnrqHnkIblkZjvvIjooYznqIvorqLljZXvvIl8IOeuoeeQhuWRmO+8iOaJgOacieiuouWNle+8iVxuICAgICAqICAgICB0eXBlOiBteS1hbGwgfCBteS1ub3RwYXkgfCBteS1kZWxpdmVyIHwgbXktZmluaXNoIHwgbWFuYWdlci10cmlwIHwgbWFuYWdlci1hbGxcbiAgICAgKiB9XG4gICAgICogISDmnKrku5jmrL7orqLljZXvvJpwYXlfc3RhdHVzOiDmnKrku5jmrL4v5bey5LuY6K6i6YeRIOaIliB0eXBlOiBwcmVcbiAgICAgKiAhIOW+heWPkei0p++8mmRlbGl2ZXJfc3RhdHVz77ya5pyq5Y+R6LSnIOS4lCBwYXlfc3RhdHVzIOW3suS7mOasvlxuICAgICAqICEg5bey5a6M5oiQ77yaZGVsaXZlcl9zdGF0dXPvvJrlt7Llj5HotKcg5LiUIHBheV9zdGF0dXMg5bey5LuY5YWo5qy+XG4gICAgICovXG4gICAgYXBwLnJvdXRlcignbGlzdCcsIGFzeW5jKCBjdHgsIG5leHQgKSA9PiB7XG4gICAgICAgIHRyeSB7XG5cbiAgICAgICAgICAgIC8vIOafpeivouadoeaVsFxuICAgICAgICAgICAgY29uc3QgbGltaXQgPSAxMDtcblxuICAgICAgICAgICAgbGV0IHdoZXJlJCA9IHsgfTtcbiAgICAgICAgICAgIGNvbnN0IHsgdHlwZSB9ID0gZXZlbnQuZGF0YTtcbiAgICAgICAgICAgIGNvbnN0IG9wZW5pZCA9IGV2ZW50LnVzZXJJbmZvLm9wZW5JZDtcblxuICAgICAgICAgICAgLy8g5oiR55qE5YWo6YOoXG4gICAgICAgICAgICBpZiAoIHR5cGUgPT09ICdteS1hbGwnICkge1xuICAgICAgICAgICAgICAgIHdoZXJlJCA9IHtcbiAgICAgICAgICAgICAgICAgICAgb3BlbmlkOiBvcGVuaWRcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIOacquS7mOasvlxuICAgICAgICAgICAgfSBlbHNlIGlmICggdHlwZSA9PT0gJ215LW5vdHBheScgKSB7XG4gICAgICAgICAgICAgICAgd2hlcmUkID0gXy5hbmQoe1xuICAgICAgICAgICAgICAgICAgICBvcGVuaWQsXG4gICAgICAgICAgICAgICAgICAgIGJhc2Vfc3RhdHVzOiAnMidcbiAgICAgICAgICAgICAgICB9LCBfLm9yKFtcbiAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogJ3ByZSdcbiAgICAgICAgICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICAgICAgICAgICAgcGF5X3N0YXR1czogXy5vciggXy5lcSgnMCcpLCBfLmVxKCcxJykpXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBdKSk7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIC8vIOacquWPkei0p1xuICAgICAgICAgICAgfSBlbHNlIGlmICggdHlwZSA9PT0gJ215LWRlbGl2ZScgKSB7XG4gICAgICAgICAgICAgICAgd2hlcmUkID0ge1xuICAgICAgICAgICAgICAgICAgICBvcGVuaWQsXG4gICAgICAgICAgICAgICAgICAgIHBheV9zdGF0dXM6ICcyJyxcbiAgICAgICAgICAgICAgICAgICAgZGVsaXZlcl9zdGF0dXM6ICcwJ1xuICAgICAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIC8vIOW3suWujOaIkFxuICAgICAgICAgICAgfSBlbHNlIGlmICggdHlwZSA9PT0gJ215LWZpbmlzaCcgKSB7XG4gICAgICAgICAgICAgICAgd2hlcmUkID0ge1xuICAgICAgICAgICAgICAgICAgICBvcGVuaWQsXG4gICAgICAgICAgICAgICAgICAgIHBheV9zdGF0dXM6ICcyJyxcbiAgICAgICAgICAgICAgICAgICAgZGVsaXZlcl9zdGF0dXM6ICcxJ1xuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIOiOt+WPluaAu+aVsFxuICAgICAgICAgICAgY29uc3QgdG90YWwkID0gYXdhaXQgZGIuY29sbGVjdGlvbignb3JkZXInKVxuICAgICAgICAgICAgICAgIC53aGVyZSggd2hlcmUkIClcbiAgICAgICAgICAgICAgICAuY291bnQoICk7XG5cbiAgICAgICAgICAgIC8vIOiOt+WPluaVsOaNrlxuICAgICAgICAgICAgY29uc3QgZGF0YSQgPSBhd2FpdCBkYi5jb2xsZWN0aW9uKCdvcmRlcicpXG4gICAgICAgICAgICAgICAgLndoZXJlKCB3aGVyZSQgKVxuICAgICAgICAgICAgICAgIC5vcmRlckJ5KCdjcmVhdGVUaW1lJywgJ2Rlc2MnKVxuICAgICAgICAgICAgICAgIC5saW1pdCggbGltaXQgKVxuICAgICAgICAgICAgICAgIC5za2lwKCBldmVudC5kYXRhLnNraXAgfHwgKCBldmVudC5kYXRhLnBhZ2UgLSAxICkgKiBsaW1pdCApXG4gICAgICAgICAgICAgICAgLmdldCggKTtcblxuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiAhIOeUseS6juafpeivouaYr+aMieWIhumhte+8jOS9huaYr+aYvuekuuaYr+aMieihjOeoi+adpeiBmuWQiOaYvuekulxuICAgICAgICAgICAgICogISDlm6DmraTmnInlj6/og73vvIxO6aG15pyA5ZCO5LiA5L2N77yM6LefTisx6aG156ys5LiA5L2N5L6d54S25bGe5LqO5ZCM5LiA6KGM56iLXG4gICAgICAgICAgICAgKiAhIOWmguS4jei/m+ihjOWkhOeQhu+8jOWuouaIt+afpeivouiuouWNleWIl+ihqOaYvuekuuihjOeoi+iuouWNleaXtu+8jOS8muKAnOacieWPr+iDveKAneaYvuekuuS4jeWFqFxuICAgICAgICAgICAgICogISDnibnmrorlpITnkIbvvJrnlKjmnIDlkI7kuIDkvY3nmoR0aWTvvIzmn6Xor6LmnIDlkI7kuIDkvY3ku6XlkI7lkIx0aWTnmoRvcmRlcu+8jOeEtuWQjuS/ruato+aJgOi/lOWbnueahHBhZ2VcbiAgICAgICAgICAgICAqL1xuXG4gICAgICAgICAgICBjb25zdCBsYXN0ID0gZGF0YSQuZGF0YVsgZGF0YSQuZGF0YS5sZW5ndGggLSAxIF07XG5cbiAgICAgICAgICAgIGxldCBmaXgkOiBhbnkgPSB7XG4gICAgICAgICAgICAgICAgZGF0YTogWyBdXG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICBpZiAoIGxhc3QgKSB7IFxuICAgICAgICAgICAgICAgIGZpeCQgPSBhd2FpdCBkYi5jb2xsZWN0aW9uKCdvcmRlcicpXG4gICAgICAgICAgICAgICAgICAgIC53aGVyZSh7XG4gICAgICAgICAgICAgICAgICAgICAgICBvcGVuaWQsXG4gICAgICAgICAgICAgICAgICAgICAgICB0aWQ6IGxhc3QudGlkXG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgIC5vcmRlckJ5KCdjcmVhdGVUaW1lJywgJ2Rlc2MnKVxuICAgICAgICAgICAgICAgICAgICAuc2tpcCggZXZlbnQuZGF0YS5za2lwID8gZXZlbnQuZGF0YS5za2lwICsgZGF0YSQuZGF0YS5sZW5ndGggOiAoIGV2ZW50LmRhdGEucGFnZSAtIDEgKSAqIGxpbWl0ICsgZGF0YSQuZGF0YS5sZW5ndGggKVxuICAgICAgICAgICAgICAgICAgICAuZ2V0KCApO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBjb25zdCBtZXRhID0gWyAuLi5kYXRhJC5kYXRhLCAuLi5maXgkLmRhdGEgXTtcbiAgICAgICAgICAgIGNvbnN0IHRyaXBzJCA9IGF3YWl0IFByb21pc2UuYWxsKCBtZXRhLm1hcCggeCA9PiB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGRiLmNvbGxlY3Rpb24oJ3RyaXAnKVxuICAgICAgICAgICAgICAgICAgICAud2hlcmUoe1xuICAgICAgICAgICAgICAgICAgICAgICAgX2lkOiB4LnRpZFxuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAuZmllbGQoe1xuICAgICAgICAgICAgICAgICAgICAgICAgdGl0bGU6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgICAgICBzdGFydF9kYXRlOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICAgICAgcGF5bWVudDogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHBvc3RhZ2U6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgICAgICBwb3N0YWdlZnJlZV9hdGxlYXN0OiB0cnVlXG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgIC5nZXQoICk7XG4gICAgICAgICAgICB9KSk7XG4gICAgIFxuICAgICAgICAgICAgLy8g6IGa5ZCI6KGM56iL5pWw5o2uXG4gICAgICAgICAgICBjb25zdCBtZXRhMiA9IG1ldGEubWFwKCggeCwgaSApID0+IE9iamVjdC5hc3NpZ24oeyB9LCB4LCB7XG4gICAgICAgICAgICAgICAgdHJpcDogdHJpcHMkWyBpIF0uZGF0YVsgMCBdXG4gICAgICAgICAgICB9KSk7XG5cbiAgICAgICAgICAgIHJldHVybiBjdHguYm9keSA9IHtcbiAgICAgICAgICAgICAgICBzdGF0dXM6IDIwMCxcbiAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICAgIGRhdGE6IG1ldGEyLFxuICAgICAgICAgICAgICAgICAgICBwYWdlU2l6ZTogbGltaXQsXG4gICAgICAgICAgICAgICAgICAgIHRvdGFsOiB0b3RhbCQudG90YWwsXG4gICAgICAgICAgICAgICAgICAgIHBhZ2U6IGZpeCQuZGF0YS5sZW5ndGggPT09IDAgPyBldmVudC5kYXRhLnBhZ2UgOiBldmVudC5kYXRhLnBhZ2UgKyBNYXRoLmNlaWwoIGZpeCQuZGF0YS5sZW5ndGggLyBsaW1pdCApLFxuICAgICAgICAgICAgICAgICAgICBjdXJyZW50OiBldmVudC5kYXRhLnNraXAgPyBldmVudC5kYXRhLnNraXAgKyBtZXRhLmxlbmd0aCA6ICggZXZlbnQuZGF0YS5wYWdlIC0gMSApICogbGltaXQgKyBtZXRhLmxlbmd0aCxcbiAgICAgICAgICAgICAgICAgICAgdG90YWxQYWdlOiBNYXRoLmNlaWwoIHRvdGFsJC50b3RhbCAvIGxpbWl0IClcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBcbiAgICAgICAgfSBjYXRjaCAoIGUgKSB7IHJldHVybiBjdHguYm9keSA9IHsgc3RhdHVzOiA1MDB9O31cbiAgICB9KVxuXG4gICAgLyoqXG4gICAgICog5om56YeP5pu05paw77yM6K6i5Y2V5Li65bey5pSv5LuY77yM5bm25LiU5aKe5Yqg5Yiw6LSt54mp5riF5Y2VXG4gICAgICogb3JkZXJJZHM6IFwiMTIzLDIzNCwzNDVcIlxuICAgICAqL1xuICAgIGFwcC5yb3V0ZXIoJ3VwYWR0ZS10by1wYXllZCcsIGFzeW5jKCBjdHgsIG5leHQgKSA9PiB7XG4gICAgICAgIHRyeSB7XG5cbiAgICAgICAgICAgIGNvbnN0IHsgb3JkZXJJZHMgfSA9IGV2ZW50LmRhdGE7XG5cbiAgICAgICAgICAgIC8vIOabtOaWsOiuouWNleWtl+autVxuICAgICAgICAgICAgYXdhaXQgUHJvbWlzZS5hbGwoIG9yZGVySWRzLnNwbGl0KCcsJykubWFwKCBvaWQgPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiBkYi5jb2xsZWN0aW9uKCdvcmRlcicpLmRvYyggb2lkIClcbiAgICAgICAgICAgICAgICAgICAgLnVwZGF0ZSh7XG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcGF5X3N0YXR1czogJzEnXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSkpO1xuXG4gICAgICAgICAgICAvLyDliJvlu7ov5o+S5YWl5Yiw6LSt54mp5riF5Y2VXG4gICAgICAgICAgICBjb25zdCBmaW5kJDogYW55ID0gYXdhaXQgUHJvbWlzZS5hbGwoIG9yZGVySWRzLnNwbGl0KCcsJykubWFwKCBvaWQgPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiBkYi5jb2xsZWN0aW9uKCdvcmRlcicpXG4gICAgICAgICAgICAgICAgICAgIC53aGVyZSh7XG4gICAgICAgICAgICAgICAgICAgICAgICBfaWQ6IG9pZFxuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAuZ2V0KCApO1xuICAgICAgICAgICAgfSkpO1xuXG4gICAgICAgICAgICBjb25zdCBsaXN0ID0gZmluZCQubWFwKCB4ID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCB7IF9pZCwgdGlkLCBwaWQsIHNpZCwgcHJpY2UsIGdyb3VwUHJpY2UgIH0gPSB4LmRhdGFbIDAgXTtcbiAgICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgICAgICBvaWQ6IF9pZCxcbiAgICAgICAgICAgICAgICAgICAgdGlkLCBwaWQsIHNpZCwgcHJpY2UsXG4gICAgICAgICAgICAgICAgICAgIGdyb3VwUHJpY2U6IGdyb3VwUHJpY2VcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgLy8g6L+Z6YeM5pys5p2l5LiN6ZyA6KaB5ZCM5q2l562J5b6F6LSt54mp5riF5Y2V55qE5Yib5bu677yM5L2G5piv5LiN5YqgYXdhaXTosozkvLzmsqHmnInooqvmiafooYzliLBcbiAgICAgICAgICAgIGF3YWl0IGNsb3VkLmNhbGxGdW5jdGlvbih7XG4gICAgICAgICAgICAgICAgbmFtZTogJ3Nob3BwaW5nLWxpc3QnLFxuICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgJHVybDogJ2NyZWF0ZScsXG4gICAgICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxpc3RcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pXG5cbiAgICAgICAgICAgIHJldHVybiBjdHguYm9keSA9IHtcbiAgICAgICAgICAgICAgICBzdGF0dXM6IDIwMFxuICAgICAgICAgICAgfVxuXG4gICAgICAgIH0gY2F0Y2ggKCBlICkgeyBcbiAgICAgICAgICAgIHJldHVybiBjdHguYm9keSA9IHsgc3RhdHVzOiA1MDAgfTtcbiAgICAgICAgfSBcbiAgICB9KVxuXG4gICAgYXBwLnJvdXRlcigndGVzdCcsIGFzeW5jKCBjdHgsIG5leHQgKSA9PiB7XG4gICAgICAgIHRyeSB7XG5cbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICog5pyq6KKr5a6J5o6S55qE6K6i5Y2VXG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIGNvbnN0IGxvc3RPcmRlcnM6IHtcbiAgICAgICAgICAgICAgICB0aWQsXG4gICAgICAgICAgICAgICAgcGlkLFxuICAgICAgICAgICAgICAgIHNpZCxcbiAgICAgICAgICAgICAgICBvaWRcbiAgICAgICAgICAgIH1bIF0gPSBbIF07XG4gICAgXG4gICAgICAgICAgICAvLyDojrflj5blvZPliY3ov5vooYzkuK3nmoTooYznqItcbiAgICAgICAgICAgIGNvbnN0IHRyaXBzJCA9IGF3YWl0IGNsb3VkLmNhbGxGdW5jdGlvbih7XG4gICAgICAgICAgICAgICAgbmFtZTogJ3RyaXAnLFxuICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgJHVybDogJ2VudGVyJ1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgIFxuICAgICAgICAgICAgY29uc3QgY3VycmVudFRyaXAgPSB0cmlwcyQucmVzdWx0LmRhdGFbIDAgXTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgaWYgKCAhY3VycmVudFRyaXAgKSB7IFxuICAgICAgICAgICAgICAgIHJldHVybiBjdHguYm9keSA9IHtcbiAgICAgICAgICAgICAgICAgICAgc3RhdHVzOiAyMDBcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgXG4gICAgICAgICAgICBjb25zdCB0aWQgPSBjdXJyZW50VHJpcC5faWQ7XG5cbiAgICAgICAgICAgIC8vIOaLv+WIsOaJgOacieivpeihjOeoi+S4i+eahOW3suS7mOiuoumHkeiuouWNlVxuICAgICAgICAgICAgY29uc3QgZmluZDEkID0gYXdhaXQgZGIuY29sbGVjdGlvbignb3JkZXInKVxuICAgICAgICAgICAgICAgIC53aGVyZSh7XG4gICAgICAgICAgICAgICAgICAgIHRpZCxcbiAgICAgICAgICAgICAgICAgICAgcGF5X3N0YXR1czogJzEnXG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAuZ2V0KCApO1xuXG4gICAgICAgICAgICBpZiAoIGZpbmQxJC5kYXRhLmxlbmd0aCA9PT0gMCApIHsgXG4gICAgICAgICAgICAgICAgcmV0dXJuIGN0eC5ib2R5ID0ge1xuICAgICAgICAgICAgICAgICAgICBzdGF0dXM6IDIwMFxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICBcbiAgICAgICAgICAgIC8vIOaLv+WIsOivpeihjOeoi+S4i+eahOi0reeJqea4heWNlVxuICAgICAgICAgICAgY29uc3QgZmluZDIkID0gYXdhaXQgZGIuY29sbGVjdGlvbignc2hvcHBpbmctbGlzdCcpXG4gICAgICAgICAgICAgICAgLndoZXJlKHtcbiAgICAgICAgICAgICAgICAgICAgdGlkXG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAuZ2V0KCApO1xuXG4gICAgICAgICAgICBjb25zdCB0cmlwU2hvcHBpbmdMaXN0ID0gZmluZDIkLmRhdGE7IFxuICAgICAgICAgICAgXG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIOi3n+a4heWNlei/m+ihjOWMuemFjVxuICAgICAgICAgICAgICogMS4g6K+l6K6i5Y2V55qE5ZWG5ZOBL+Wei+WPt+i/mOayoeacieS7u+S9lea4heWNlVxuICAgICAgICAgICAgICogMi4g6K+l6K6i5Y2V5rKh5pyJ5Zyo5bey5pyJ5ZCM5qy+5ZWG5ZOBL+Wei+WPt+eahOa4heWNlemHjOmdolxuICAgICAgICAgICAgICovXG5cbiAgICAgICAgICAgIGZpbmQxJC5kYXRhLm1hcCggb3JkZXIgPT4ge1xuXG4gICAgICAgICAgICAgICAgY29uc3QgeyBzaWQsIHBpZCwgX2lkIH0gPSBvcmRlcjtcbiAgICAgICAgICAgICAgICBjb25zdCBjdXJyZW50R29vZFNob3BwaW5nTGlzdCA9IHRyaXBTaG9wcGluZ0xpc3QuZmluZCggeCA9PiB4LnNpZCA9PT0gc2lkICYmIHgucGlkID09PSBwaWQgKTtcblxuICAgICAgICAgICAgICAgIGlmICggIWN1cnJlbnRHb29kU2hvcHBpbmdMaXN0ICkge1xuICAgICAgICAgICAgICAgICAgICBsb3N0T3JkZXJzLnB1c2goe1xuICAgICAgICAgICAgICAgICAgICAgICAgdGlkLFxuICAgICAgICAgICAgICAgICAgICAgICAgc2lkLFxuICAgICAgICAgICAgICAgICAgICAgICAgcGlkLFxuICAgICAgICAgICAgICAgICAgICAgICAgb2lkOiBfaWRcbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCB7IG9pZHMgfSA9IGN1cnJlbnRHb29kU2hvcHBpbmdMaXN0O1xuICAgICAgICAgICAgICAgICAgICBpZiAoICFvaWRzLmZpbmQoIHggPT4geCA9PT0gX2lkICkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxvc3RPcmRlcnMucHVzaCh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGlkLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNpZCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwaWQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb2lkOiBfaWRcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBpZiAoIGxvc3RPcmRlcnMubGVuZ3RoID09PSAwICkge1xuICAgICAgICAgICAgICAgIHJldHVybiBjdHguYm9keSA9IHtcbiAgICAgICAgICAgICAgICAgICAgc3RhdHVzOiAyMDBcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGF3YWl0IGNsb3VkLmNhbGxGdW5jdGlvbih7XG4gICAgICAgICAgICAgICAgbmFtZTogJ3Nob3BwaW5nLWxpc3QnLFxuICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgJHVybDogJ2NyZWF0ZScsXG4gICAgICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxpc3Q6IGxvc3RPcmRlcnNcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgIFxuICAgICAgICAgICAgcmV0dXJuIGN0eC5ib2R5ID0ge1xuICAgICAgICAgICAgICAgIHN0YXR1czogMjAwLFxuICAgICAgICAgICAgICAgIGRhdGE6IGxvc3RPcmRlcnNcbiAgICAgICAgICAgIH1cbiAgICBcbiAgICAgICAgfSBjYXRjaCAoIGUgKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZygnISEhIeWumuaXtuWZqOiuouWNlWNhdGNoTG9zdE9yZGVyc+mUmeivrycsKVxuICAgICAgICAgICAgcmV0dXJuIGN0eC5ib2R5ID0geyBzdGF0dXM6IDUwMCB9O1xuICAgICAgICB9XG4gICAgfSlcblxuICAgIC8qKiBcbiAgICAgKiBAZGVzY3JpcHRpb25cbiAgICAgKiDku6PotK3muIXluJDlgqzmrL7nmoTorqLljZXliJfooahcbiAgICAgKi9cbiAgICBhcHAucm91dGVyKCdkYWlnb3UtbGlzdCcsIGFzeW5jKCBjdHgsIG5leHQgKSA9PiB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBjb25zdCB7IHRpZCB9ID0gZXZlbnQuZGF0YTtcbiAgICAgICAgICAgIGNvbnN0IG9yZGVycyQgPSBhd2FpdCBkYi5jb2xsZWN0aW9uKCdvcmRlcicpXG4gICAgICAgICAgICAgICAgLndoZXJlKHtcbiAgICAgICAgICAgICAgICAgICAgdGlkXG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAuZ2V0KCApO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICAvLyDnlKjmiLfkv6Hmga9cbiAgICAgICAgICAgIGNvbnN0IHVzZXJzJCA9IGF3YWl0IFByb21pc2UuYWxsKFxuICAgICAgICAgICAgICAgIEFycmF5LmZyb20oIFxuICAgICAgICAgICAgICAgICAgICBuZXcgU2V0KCBvcmRlcnMkLmRhdGFcbiAgICAgICAgICAgICAgICAgICAgICAgIC5tYXAoIHggPT4geC5vcGVuaWQgKVxuICAgICAgICAgICAgICAgICkpXG4gICAgICAgICAgICAgICAgLm1hcCggdWlkID0+IGRiLmNvbGxlY3Rpb24oJ3VzZXInKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC53aGVyZSh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9wZW5pZDogdWlkXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAuZ2V0KCApKVxuICAgICAgICAgICAgKTtcblxuICAgICAgICAgICAgLy8g5Zyw5Z2A5L+h5oGvXG4gICAgICAgICAgICBjb25zdCBhZGRyZXNzJCA9IGF3YWl0IFByb21pc2UuYWxsKFxuICAgICAgICAgICAgICAgIEFycmF5LmZyb20oXG4gICAgICAgICAgICAgICAgICAgIG5ldyBTZXQoIG9yZGVycyQuZGF0YVxuICAgICAgICAgICAgICAgICAgICAgICAgLm1hcCggeCA9PiB4LmFpZCApXG4gICAgICAgICAgICAgICAgKSlcbiAgICAgICAgICAgICAgICAubWFwKCBhaWQgPT4gZGIuY29sbGVjdGlvbignYWRkcmVzcycpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLmRvYyggYWlkIClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAuZ2V0KCApKVxuICAgICAgICAgICAgKTtcblxuICAgICAgICAgICAgY29uc3QgdXNlck9kZXJzID0gdXNlcnMkLm1hcCggdXNlciQgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IHVzZXIgPSB1c2VyJC5kYXRhWyAwIF07XG4gICAgICAgICAgICAgICAgY29uc3Qgb3JkZXJzID0gb3JkZXJzJC5kYXRhLmZpbHRlciggeCA9PiB4Lm9wZW5pZCA9PT0gdXNlci5vcGVuaWQgKTtcbiAgICAgICAgICAgICAgICBjb25zdCBhZGRyZXNzID0gYWRkcmVzcyRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5tYXAoIHggPT4geC5kYXRhIClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5maWx0ZXIoIHggPT4geC5vcGVuaWQgPT09IHVzZXIub3BlbmlkICk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICAgICAgdXNlcixcbiAgICAgICAgICAgICAgICAgICAgb3JkZXJzLFxuICAgICAgICAgICAgICAgICAgICBhZGRyZXNzXG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICByZXR1cm4gY3R4LmJvZHkgPSB7XG4gICAgICAgICAgICAgICAgc3RhdHVzOiAyMDAsXG4gICAgICAgICAgICAgICAgZGF0YTogdXNlck9kZXJzXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfSBjYXRjaCAoIGUgKSB7XG4gICAgICAgICAgICByZXR1cm4gY3R4LmJvZHkgPSB7IHN0YXR1czogNTAwIH07XG4gICAgICAgIH1cbiAgICB9KVxuIFxuICAgcmV0dXJuIGFwcC5zZXJ2ZSggKTtcblxufSJdfQ==