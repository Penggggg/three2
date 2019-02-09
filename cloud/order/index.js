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
            var limit, where$, type, openid, total$, data$, last, fix$, meta, tripIds, trips$_1, meta2, e_2;
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
                        tripIds = Array.from(new Set(meta.map(function (m) { return m.tid; })));
                        return [4, Promise.all(tripIds.map(function (tid) {
                                return db.collection('trip')
                                    .where({
                                    _id: tid
                                })
                                    .get();
                            }))];
                    case 5:
                        trips$_1 = _a.sent();
                        meta2 = meta.map(function (x, i) { return Object.assign({}, x, {
                            trip: trips$_1.find(function (y) { return y.data[0]._id === x.tid; }).data[0]
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
            var _a, orderIds, prepay_id_1, form_id_1, find$, list, e_3;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 4, , 5]);
                        _a = event.data, orderIds = _a.orderIds, prepay_id_1 = _a.prepay_id, form_id_1 = _a.form_id;
                        return [4, Promise.all(orderIds.split(',').map(function (oid) {
                                return db.collection('order').doc(oid)
                                    .update({
                                    data: {
                                        form_id: form_id_1,
                                        prepay_id: prepay_id_1,
                                        pay_status: '1'
                                    }
                                });
                            }))];
                    case 1:
                        _b.sent();
                        return [4, Promise.all(orderIds.split(',').map(function (oid) {
                                return db.collection('order')
                                    .where({
                                    _id: oid
                                })
                                    .get();
                            }))];
                    case 2:
                        find$ = _b.sent();
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
                        _b.sent();
                        return [2, ctx.body = {
                                status: 200
                            }];
                    case 4:
                        e_3 = _b.sent();
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
                                tid: tid,
                                pay_status: _.or(_.eq('1'), _.eq('2'), _.eq('3'))
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
        app.router('adjust-count', function (ctx, next) { return __awaiter(_this, void 0, void 0, function () {
            var openid, _a, oid_1, tid, sid, pid, count, getWrong, order$, shopping$, shopping, lastOrders$, lastOrders, otherCount, newshopping, e_6;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 7, , 8]);
                        openid = event.data.openId || event.userInfo.openId;
                        _a = event.data, oid_1 = _a.oid, tid = _a.tid, sid = _a.sid, pid = _a.pid, count = _a.count;
                        getWrong = function (message) { return ctx.body = {
                            message: message,
                            status: 400
                        }; };
                        return [4, db.collection('order')
                                .doc(oid_1)
                                .get()];
                    case 1:
                        order$ = _b.sent();
                        if (order$.data.base_status === '2') {
                            return [2, getWrong('催款后不能修改数量')];
                        }
                        else if (order$.data.base_status === '0') {
                            return [2, getWrong('请先调整该商品价格')];
                        }
                        return [4, db.collection('shopping-list')
                                .where({
                                tid: tid, sid: sid, pid: pid
                            })
                                .get()];
                    case 2:
                        shopping$ = _b.sent();
                        shopping = shopping$.data[0];
                        return [4, db.collection('order')
                                .where({
                                tid: tid, sid: sid, pid: pid,
                                pay_status: _.neq('0'),
                                base_status: _.or(_.eq('1'), _.eq('2'), _.eq('3'))
                            })
                                .get()];
                    case 3:
                        lastOrders$ = _b.sent();
                        lastOrders = lastOrders$.data;
                        otherCount = lastOrders
                            .filter(function (o) { return o._id !== oid_1; })
                            .reduce(function (x, y) {
                            return x + y.allocatedCount || 0;
                        }, 0);
                        if (count + otherCount > shopping.purchase) {
                            return [2, getWrong("\u8BE5\u5546\u54C1\u603B\u6570\u91CF\u4E0D\u80FD\u5927\u4E8E\u91C7\u8D2D\u6570" + shopping.purchase + "\u4EF6\uFF01")];
                        }
                        return [4, db.collection('order')
                                .doc(oid_1)
                                .update({
                                data: {
                                    allocatedCount: count
                                }
                            })];
                    case 4:
                        _b.sent();
                        if (!(count + otherCount < shopping.purchase)) return [3, 6];
                        newshopping = Object.assign({}, shopping, {
                            lastAllocated: shopping.purchase - (count + otherCount)
                        });
                        delete newshopping['_id'];
                        return [4, db.collection('shopping-list')
                                .doc(String(shopping._id))
                                .set({
                                data: newshopping
                            })];
                    case 5:
                        _b.sent();
                        _b.label = 6;
                    case 6: return [2, ctx.body = {
                            status: 200
                        }];
                    case 7:
                        e_6 = _b.sent();
                        return [2, ctx.body = { status: 500 }];
                    case 8: return [2];
                }
            });
        }); });
        app.router('adjust-status', function (ctx, next) { return __awaiter(_this, void 0, void 0, function () {
            var _a, tid, oids, form_id, getWrong, trip$, trip, update$, e_7;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 3, , 4]);
                        _a = event.data, tid = _a.tid, oids = _a.oids, form_id = _a.form_id;
                        getWrong = function (message) { return ctx.body = {
                            message: message,
                            status: 400
                        }; };
                        return [4, db.collection('trip')
                                .doc(tid)
                                .get()];
                    case 1:
                        trip$ = _b.sent();
                        trip = trip$.data;
                        if (new Date().getTime() < trip.end_date && !trip.isClosed) {
                            return [2, getWrong('行程未结束，请手动关闭当前行程')];
                        }
                        return [4, Promise.all(oids.map(function (oid) {
                                return db.collection('order')
                                    .doc(oid)
                                    .update({
                                    data: {
                                        base_status: '2'
                                    }
                                });
                            }))];
                    case 2:
                        update$ = _b.sent();
                        return [2, ctx.body = {
                                status: 200
                            }];
                    case 3:
                        e_7 = _b.sent();
                        return [2, ctx.body = { status: 500 }];
                    case 4: return [2];
                }
            });
        }); });
        app.router('batch-adjust', function (ctx, next) { return __awaiter(_this, void 0, void 0, function () {
            var _a, tid, orders_1, notification_1, getWrong, trip$, trip, users, rs, e_8;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 5, , 6]);
                        _a = event.data, tid = _a.tid, orders_1 = _a.orders, notification_1 = _a.notification;
                        getWrong = function (message) { return ctx.body = {
                            message: message,
                            status: 400
                        }; };
                        return [4, db.collection('trip')
                                .doc(tid)
                                .get()];
                    case 1:
                        trip$ = _b.sent();
                        trip = trip$.data;
                        if (new Date().getTime() < trip.end_date && !trip.isClosed) {
                            return [2, getWrong('行程未结束，请手动关闭当前行程')];
                        }
                        else if (trip.callMoneyTimes && trip.callMoneyTimes >= 3) {
                            return [2, getWrong("\u5DF2\u7ECF\u53D1\u8D77\u8FC7" + trip.callMoneyTimes + "\u6B21\u50AC\u6B3E")];
                        }
                        return [4, Promise.all(orders_1.map(function (order) {
                                return db.collection('order')
                                    .doc(order.oid)
                                    .update({
                                    data: {
                                        base_status: '2',
                                        canGroup: !!orders_1.find(function (o) {
                                            return o.oid !== order.oid && o.openid !== order.openid &&
                                                o.pid === order.pid && o.sid === order.sid;
                                        })
                                    }
                                });
                            }))];
                    case 2:
                        _b.sent();
                        users = Array.from(new Set(orders_1
                            .map(function (order) { return order.openid; })
                            .filter(function (openid) {
                            return !!orders_1.find(function (order) {
                                return order.openid === openid && String(order.pay_status) === '1';
                            });
                        })));
                        return [4, Promise.all(users.map(function (openid) {
                                var target = orders_1.find(function (order) { return order.openid === openid &&
                                    (!!order.prepay_id || !!order.form_id); });
                                return cloud.callFunction({
                                    data: {
                                        data: {
                                            touser: openid,
                                            data: notification_1,
                                            form_id: target.prepay_id || target.form_id
                                        },
                                        $url: 'notification-getmoney'
                                    },
                                    name: 'common'
                                });
                            }))];
                    case 3:
                        rs = _b.sent();
                        return [4, db.collection('trip')
                                .doc(tid)
                                .update({
                                data: {
                                    callMoneyTimes: _.inc(1)
                                }
                            })];
                    case 4:
                        _b.sent();
                        return [2, ctx.body = {
                                status: 200,
                                data: 3 - (1 + trip.callMoneyTimes)
                            }];
                    case 5:
                        e_8 = _b.sent();
                        return [2, ctx.body = { status: 500 }];
                    case 6: return [2];
                }
            });
        }); });
        return [2, app.serve()];
    });
}); };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFDQSxpQkF3MUJDOztBQXgxQkQscUNBQXVDO0FBQ3ZDLHNDQUF3QztBQUN4QyxtQ0FBbUM7QUFFbkMsS0FBSyxDQUFDLElBQUksRUFBRyxDQUFDO0FBRWQsSUFBTSxFQUFFLEdBQWdCLEtBQUssQ0FBQyxRQUFRLEVBQUcsQ0FBQztBQUUxQyxJQUFNLENBQUMsR0FBRyxFQUFFLENBQUMsT0FBTyxDQUFDO0FBa0NSLFFBQUEsSUFBSSxHQUFHLFVBQVEsS0FBSyxFQUFFLE9BQU87Ozs7UUFFaEMsR0FBRyxHQUFHLElBQUksU0FBUyxDQUFDLEVBQUUsS0FBSyxPQUFBLEVBQUUsQ0FBQyxDQUFDO1FBZ0NyQyxHQUFHLENBQUMsTUFBTSxDQUFDLFFBQVEsRUFBRSxVQUFPLEdBQUcsRUFBRSxJQUFJOzs7Ozs7d0JBR3ZCLEtBQXdCLEtBQUssQ0FBQyxJQUFJLEVBQWhDLEdBQUcsU0FBQSxFQUFFLElBQUksVUFBQSxFQUFFLE1BQU0sWUFBQSxDQUFnQjt3QkFDbkMsV0FBUyxLQUFLLENBQUMsSUFBSSxDQUFDLE1BQU0sSUFBSSxLQUFLLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQzt3QkFHMUMsV0FBTSxLQUFLLENBQUMsWUFBWSxDQUFDO2dDQUNyQyxJQUFJLEVBQUU7b0NBQ0YsSUFBSSxFQUFFO3dDQUNGLEdBQUcsRUFBRSxHQUFHO3FDQUNYO29DQUNELElBQUksRUFBRSxRQUFRO2lDQUNqQjtnQ0FDRCxJQUFJLEVBQUUsTUFBTTs2QkFDZixDQUFDLEVBQUE7O3dCQVJJLE9BQU8sR0FBRyxTQVFkO3dCQUVJLE1BQU0sR0FBRyxPQUFPLENBQUMsTUFBTSxDQUFDO3dCQUM5QixJQUFLLE1BQU0sQ0FBQyxNQUFNLEtBQUssR0FBRzsrQkFDZixDQUFDLE1BQU0sQ0FBQyxJQUFJOytC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T0FBTyxDQUFFLEVBRE4sQ0FDTSxDQUFDLENBQUM7Z0NBQzdDLE9BQU8sS0FBSyxDQUFDLFlBQVksQ0FBQztvQ0FDdEIsSUFBSSxFQUFFO3dDQUNGLElBQUksRUFBRTs0Q0FDRixNQUFNLEVBQUUsTUFBTTs0Q0FDZCxJQUFJLEVBQUUsY0FBWTs0Q0FDbEIsT0FBTyxFQUFFLE1BQU0sQ0FBQyxTQUFTLElBQUksTUFBTSxDQUFDLE9BQU87eUNBQzlDO3dDQUNELElBQUksRUFBRSx1QkFBdUI7cUNBQ2hDO29DQUNELElBQUksRUFBRSxRQUFRO2lDQUNqQixDQUFDLENBQUE7NEJBQ04sQ0FBQyxDQUFDLENBQUMsRUFBQTs7d0JBZEcsRUFBRSxHQUFHLFNBY1I7d0JBR0gsV0FBTSxFQUFFLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQztpQ0FDdEIsR0FBRyxDQUFFLEdBQUcsQ0FBRTtpQ0FDVixNQUFNLENBQUM7Z0NBQ0osSUFBSSxFQUFFO29DQUNGLGNBQWMsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFFLENBQUMsQ0FBRTtpQ0FDN0I7NkJBQ0osQ0FBQyxFQUFBOzt3QkFOTixTQU1NLENBQUM7d0JBRVAsV0FBTyxHQUFHLENBQUMsSUFBSSxHQUFHO2dDQUNkLE1BQU0sRUFBRSxHQUFHO2dDQUVYLElBQUksRUFBRSxDQUFDLEdBQUcsQ0FBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLGNBQWMsQ0FBRTs2QkFDeEMsRUFBQTs7O3dCQUdELFdBQU8sR0FBRyxDQUFDLElBQUksR0FBRyxFQUFFLE1BQU0sRUFBRSxHQUFHLEVBQUUsRUFBQzs7OzthQUV6QyxDQUFDLENBQUE7UUFFSCxXQUFPLEdBQUcsQ0FBQyxLQUFLLEVBQUcsRUFBQzs7S0FFdEIsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbIlxuaW1wb3J0ICogYXMgY2xvdWQgZnJvbSAnd3gtc2VydmVyLXNkayc7XG5pbXBvcnQgKiBhcyBUY2JSb3V0ZXIgZnJvbSAndGNiLXJvdXRlcic7XG5pbXBvcnQgeyBjcmVhdGUkIH0gZnJvbSAnLi9jcmVhdGUnO1xuXG5jbG91ZC5pbml0KCApO1xuXG5jb25zdCBkYjogREIuRGF0YWJhc2UgPSBjbG91ZC5kYXRhYmFzZSggKTtcblxuY29uc3QgXyA9IGRiLmNvbW1hbmQ7XG5cbi8qKlxuICogXG4gKiBAZGVzY3JpcHRpb24g6K6i5Y2V5qih5Z2XXG4gKiAtLS0tLS0tLSDlrZfmrrUgLS0tLS0tLS0tLVxuICogX2lkXG4gKiBvcGVuaWQsXG4gKiBjcmVhdGV0aW1lXG4gKiB0aWQsXG4gKiBwaWQsXG4gKiBjaWQgKOWPr+S4uuepuilcbiAqIHNpZCwgKOWPr+S4uuepuilcbiAqIGNvdW50LFxuICogcHJpY2UsXG4gKiBncm91cFByaWNlLFxuICogZGVwb3NpdF9wcmljZTog5ZWG5ZOB6K6i6YeRICjlj6/kuLrnqbopXG4gKiAhIGlzT2NjdXBpZWQsIOaYr+WQpuWNoOW6k+WtmFxuICogZ3JvdXBfcHJpY2UgKOWPr+S4uuepuilcbiAqIHR5cGU6ICdjdXN0b20nIHwgJ25vcm1hbCcgfCAncHJlJyDoh6rlrprkuYnliqDljZXjgIHmma7pgJrliqDljZXjgIHpooTorqLljZVcbiAqIGltZzogQXJyYXlbIHN0cmluZyBdXG4gKiBkZXNj77yI5Y+v5Li656m677yJLFxuICogYWlkXG4gKiBhbGxvY2F0ZWRQcmljZSDliIbphY3nmoTku7fmoLxcbiAqIGFsbG9jYXRlZEdyb3VwUHJpY2Ug5YiG6YWN5Zui6LSt5Lu3XG4gKiBhbGxvY2F0ZWRDb3VudCDliIbphY3nmoTmlbDph49cbiAqIGZvcm1faWRcbiAqIHByZXBheV9pZCxcbiAqICEgY2FuR3JvdXAg5piv5ZCm5Y+v5Lul5ou85ZuiXG4gKiAhIGZpbmFsX3ByaWNlIOacgOWQjuaIkOS6pOS7t1xuICogISBiYXNlX3N0YXR1czogMCwxLDIsMyw0LDUg6L+b6KGM5Lit77yI5a6i5oi36L+Y5Y+v5Lul6LCD5pW06Ieq5bex55qE6K6i5Y2V77yJ77yM5Luj6LSt5bey6LSt5Lmw77yM5bey6LCD5pW077yM5bey57uT566X77yM5bey5Y+W5raI77yI5Lmw5LiN5Yiw77yJ77yM5bey6L+H5pyf77yI5pSv5LuY6L+H5pyf77yJXG4gKiAhIHBheV9zdGF0dXM6IDAsMSwyIOacquS7mOasvu+8jOW3suS7mOiuoumHke+8jOW3suS7mOWFqOasvlxuICogISBkZWxpdmVyX3N0YXR1czogMCwxIOacquWPkeW4g++8jOW3suWPkeW4g+OAgVxuICovXG5leHBvcnQgY29uc3QgbWFpbiA9IGFzeW5jICggZXZlbnQsIGNvbnRleHQgKSA9PiB7XG5cbiAgICBjb25zdCBhcHAgPSBuZXcgVGNiUm91dGVyKHsgZXZlbnQgfSk7XG5cbiAgICAvKipcbiAgICAgKiBAZGVzY3JpcHRpb24g5Yib5bu66K6i5Y2VXG4gICAgICogLS0tLS0tLS0g6K+35rGCIC0tLS0tLS0tLS1cbiAgICAgKiB7XG4gICAgICogICAgICB0aWQsXG4gICAgICogICAgICBvcGVuSWQgLy8g6K6i5Y2V5Li75Lq6XG4gICAgICogICAgICBmcm9tOiAnY2FydCcgfCAnYnV5JyB8ICdjdXN0b20nIHwgJ2FnZW50cycgfCAnc3lzdGVtJyDmnaXmupDvvJrotK3nianovabjgIHnm7TmjqXotK3kubDjgIHoh6rlrprkuYnkuIvljZXjgIHku6PotK3kuIvljZXjgIHns7vnu5/lj5HotbfpooTku5jorqLljZVcbiAgICAgKiAgICAgIG9yZGVyczogQXJyYXk8eyBcbiAgICAgKiAgICAgICAgICB0aWRcbiAgICAgKiAgICAgICAgICBjaWRcbiAgICAgKiAgICAgICAgICBzaWRcbiAgICAgKiAgICAgICAgICBwaWRcbiAgICAgKiAgICAgICAgICBwcmljZVxuICAgICAqICAgICAgICAgIG5hbWVcbiAgICAgKiAgICAgICAgICBzdGFuZGVybmFtZVxuICAgICAqICAgICAgICAgIGdyb3VwUHJpY2VcbiAgICAgKiAgICAgICAgICBjb3VudFxuICAgICAqICAgICAgICAgIGRlc2NcbiAgICAgKiAgICAgICAgICBpbWdcbiAgICAgKiAgICAgICAgICB0eXBlXG4gICAgICogICAgICAgICAgcGF5X3N0YXR1cyxcbiAgICAgKiAgICAgICAgICBhZGRyZXNzOiB7XG4gICAgICogICAgICAgICAgICAgIG5hbWUsXG4gICAgICogICAgICAgICAgICAgIHBob25lLFxuICAgICAqICAgICAgICAgICAgICBkZXRhaWwsXG4gICAgICogICAgICAgICAgICAgIHBvc3RhbGNvZGVcbiAgICAgKiAgICAgICAgICB9XG4gICAgICogICAgICB9PlxuICAgICAqIH1cbiAgICAgKi9cbiAgICBhcHAucm91dGVyKCdjcmVhdGUnLCBhc3luYyggY3R4LCBuZXh0ICkgPT4ge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgXG4gICAgICAgICAgICBjb25zdCB7IHRpZCwgZnJvbSwgb3JkZXJzIH0gPSBldmVudC5kYXRhO1xuICAgICAgICAgICAgY29uc3Qgb3BlbmlkID0gZXZlbnQuZGF0YS5vcGVuSWQgfHwgZXZlbnQudXNlckluZm8ub3BlbklkO1xuXG4gICAgICAgICAgICAvLyAx44CB5Yik5pat6K+l6KGM56iL5piv5ZCm5Y+v5Lul55SoXG4gICAgICAgICAgICBjb25zdCB0cmlwcyQkID0gYXdhaXQgY2xvdWQuY2FsbEZ1bmN0aW9uKHtcbiAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIF9pZDogdGlkXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICR1cmw6ICdkZXRhaWwnXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBuYW1lOiAndHJpcCdcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBjb25zdCB0cmlwcyQgPSB0cmlwcyQkLnJlc3VsdDsgICAgICAgIFxuICAgICAgICAgICAgaWYgKCB0cmlwcyQuc3RhdHVzICE9PSAyMDBcbiAgICAgICAgICAgICAgICAgICAgfHwgIXRyaXBzJC5kYXRhIFxuICAgICAgICAgICAgICAgICAgICB8fCAoICEhdHJpcHMkLmRhdGEgJiYgdHJpcHMkLmRhdGEuaXNDbG9zZWQgKSBcbiAgICAgICAgICAgICAgICAgICAgfHwgKCAhIXRyaXBzJC5kYXRhICYmIG5ldyBEYXRlKCApLmdldFRpbWUoICkgPj0gdHJpcHMkLmRhdGEuZW5kX2RhdGUgKSkge1xuICAgICAgICAgICAgICAgIHRocm93ICfmmoLml6DooYznqIvorqHliJLvvIzmmoLml7bkuI3og73otK3kubDvvZ4nXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIOacgOaWsOWPr+eUqOihjOeoi1xuICAgICAgICAgICAgY29uc3QgdHJpcCA9IHRyaXBzJC5kYXRhO1xuXG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIOagueaNruWcsOWdgOWvueixoe+8jOaLv+WIsOWcsOWdgGlkXG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIGxldCBhZGRyZXNzaWQkID0ge1xuICAgICAgICAgICAgICAgIHJlc3VsdDoge1xuICAgICAgICAgICAgICAgICAgICBkYXRhOiBudWxsLFxuICAgICAgICAgICAgICAgICAgICBzdGF0dXM6IDUwMFxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIC8vIOiuouWNleadpea6kO+8mui0reeJqei9puOAgeezu+e7n+WKoOWNlVxuICAgICAgICAgICAgaWYgKCBldmVudC5kYXRhLmZyb20gPT09ICdjYXJ0JyB8fCBldmVudC5kYXRhLmZyb20gPT09ICdzeXN0ZW0nIHx8IGV2ZW50LmRhdGEuZnJvbSA9PT0gJ2J1eScgKSB7XG4gICAgICAgICAgICAgICAgYWRkcmVzc2lkJCA9IGF3YWl0IGNsb3VkLmNhbGxGdW5jdGlvbih7XG4gICAgICAgICAgICAgICAgICAgIGRhdGE6IHsgXG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb3BlbklkOiBvcGVuaWQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYWRkcmVzczogZXZlbnQuZGF0YS5vcmRlcnNbIDAgXS5hZGRyZXNzXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgJHVybDogJ2dldEFkZHJlc3NJZCdcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgbmFtZTogJ2FkZHJlc3MnXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIC8vIOiuouWNleadpea6kO+8mui0reeJqei9puOAgeezu+e7n+WKoOWNlVxuICAgICAgICAgICAgaWYgKCggZXZlbnQuZGF0YS5mcm9tID09PSAnY2FydCcgfHwgZXZlbnQuZGF0YS5mcm9tID09PSAnc3lzdGVtJyApICYmIGFkZHJlc3NpZCQucmVzdWx0LnN0YXR1cyAhPT0gMjAwICkge1xuICAgICAgICAgICAgICAgIHRocm93ICfmn6Xor6LlnLDlnYDplJnor68nO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyDlj6/nlKjlnLDlnYBpZFxuICAgICAgICAgICAgY29uc3QgYWlkID0gYWRkcmVzc2lkJC5yZXN1bHQuZGF0YTtcblxuICAgICAgICAgICAgLy8g5piv5ZCm5paw5a6i5oi3XG4gICAgICAgICAgICBjb25zdCBpc05ldyQgPSBhd2FpdCBjbG91ZC5jYWxsRnVuY3Rpb24oe1xuICAgICAgICAgICAgICAgIG5hbWU6ICdjb21tb24nLFxuICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgJHVybDogJ2lzLW5ldy1jdXN0b21lcicsXG4gICAgICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG9wZW5JZDogb3BlbmlkXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KVxuXG4gICAgICAgICAgICBjb25zdCBpc05ldyA9IGlzTmV3JC5yZXN1bHQuZGF0YTtcblxuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiDmlrDlrqIgKyDmlrDlrqLopoHorqLph5EgPSAnMCcsXG4gICAgICAgICAgICAgKiDmlrDlrqIgKyDopoHorqLph5EgPSAnMCcsXG4gICAgICAgICAgICAgKiDmlrDlrqIgKyDlhY3orqLph5EgPSAnMScsXG4gICAgICAgICAgICAgKiDml6flrqIgKyDml6flrqLlhY3orqLph5EgPSAnMScsXG4gICAgICAgICAgICAgKiDml6flrqIgKyDopoHorqLph5EgPSAnMCcsXG4gICAgICAgICAgICAgKiDml6flrqIgKyDlhY3orqLph5EgPSAnMScsXG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIGxldCBwYXlfc3RhdHVzID0gJzAnO1xuICAgICAgICAgICAgY29uc3QgcCA9IHRyaXAucGF5bWVudDtcblxuICAgICAgICAgICAgaWYgKCBpc05ldyAmJiBwID09PSAnMCcgKSB7XG4gICAgICAgICAgICAgICAgcGF5X3N0YXR1cyA9ICcwJ1xuXG4gICAgICAgICAgICB9IGVsc2UgaWYgKCBpc05ldyAmJiBwID09PSAnMScgKSB7XG4gICAgICAgICAgICAgICAgcGF5X3N0YXR1cyA9ICcwJ1xuXG4gICAgICAgICAgICB9IGVsc2UgaWYgKCBpc05ldyAmJiBwID09PSAnMicgKSB7XG4gICAgICAgICAgICAgICAgcGF5X3N0YXR1cyA9ICcxJ1xuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgfSBlbHNlIGlmICggIWlzTmV3ICYmIHAgPT09ICcwJyApIHtcbiAgICAgICAgICAgICAgICBwYXlfc3RhdHVzID0gJzEnXG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICB9IGVsc2UgaWYgKCAhaXNOZXcgJiYgcCA9PT0gJzEnICkge1xuICAgICAgICAgICAgICAgIHBheV9zdGF0dXMgPSAnMCdcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoICFpc05ldyAmJiBwID09PSAnMicgKSB7XG4gICAgICAgICAgICAgICAgcGF5X3N0YXR1cyA9ICcxJ1xuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBwYXlfc3RhdHVzID0gJzAnXG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIDPjgIHmibnph4/liJvlu7rorqLljZXvvIzvvIjov4fmu6TmjonkuI3og73liJvlu7rotK3nianmuIXljZXnmoTllYblk4HvvIlcbiAgICAgICAgICAgIGNvbnN0IHRlbXAgPSBldmVudC5kYXRhLm9yZGVycy5tYXAoIG1ldGEgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IHQgPSBPYmplY3QuYXNzaWduKHsgfSwgbWV0YSwge1xuICAgICAgICAgICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAgICAgICAgICogISBkZWxpdmVyX3N0YXR1c+S4uuacquWPkeW4gyDlj6/og73mnInpl67pophcbiAgICAgICAgICAgICAgICAgICAgICovXG4gICAgICAgICAgICAgICAgICAgIGFpZCxcbiAgICAgICAgICAgICAgICAgICAgaXNPY2N1cGllZDogdHJ1ZSwgLy8g5Y2g6aKG5bqT5a2Y5qCH5b+XXG4gICAgICAgICAgICAgICAgICAgIG9wZW5pZDogb3BlbmlkLFxuICAgICAgICAgICAgICAgICAgICBkZWxpdmVyX3N0YXR1czogJzAnLCBcbiAgICAgICAgICAgICAgICAgICAgYmFzZV9zdGF0dXM6ICcwJyxcbiAgICAgICAgICAgICAgICAgICAgcGF5X3N0YXR1czogIW1ldGEuZGVwb3NpdFByaWNlID8gJzEnIDogcGF5X3N0YXR1cyAsIC8vIOWVhuWTgeiuoumHkemineW6puS4ujBcbiAgICAgICAgICAgICAgICAgICAgY3JlYXRlVGltZTogbmV3IERhdGUoICkuZ2V0VGltZSggKSxcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogISFtZXRhLmRlcG9zaXRQcmljZSA/IG1ldGEudHlwZSA6ICdub3JtYWwnXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgZGVsZXRlIHRbJ2FkZHJlc3MnXTtcbiAgICAgICAgICAgICAgICByZXR1cm4gdDtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAvLyA044CB5om56YeP5Yib5bu66K6i5Y2VICgg5ZCM5pe25aSE55CG5Y2g6aKG6LSn5a2Y55qE6Zeu6aKYIClcbiAgICAgICAgICAgIGNvbnN0IHNhdmUkOiBhbnkgPSBhd2FpdCBQcm9taXNlLmFsbCggdGVtcC5tYXAoIG8gPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiBjcmVhdGUkKCBvcGVuaWQsIG8sIGRiLCBjdHggKTtcbiAgICAgICAgICAgIH0pKTtcbiAgICAgICAgXG4gICAgICAgICAgICBpZiAoIHNhdmUkLnNvbWUoIHggPT4geC5zdGF0dXMgIT09IDIwMCApKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgJ+WIm+W7uuiuouWNlemUmeivr++8gSdcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8g6L+U5Zue6K6i5Y2V5L+h5oGvXG4gICAgICAgICAgICBjb25zdCBvcmRlcl9yZXN1bHQgPSBzYXZlJC5tYXAoKCB4LCBrICkgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IHsgcHJpY2UsIGNvdW50LCBwYXlfc3RhdHVzLCBkZXBvc2l0UHJpY2UgfSA9IHRlbXBbIGsgXTtcbiAgICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgICAgICBvaWQ6IHguZGF0YS5faWQsXG4gICAgICAgICAgICAgICAgICAgIHByaWNlLFxuICAgICAgICAgICAgICAgICAgICBjb3VudCxcbiAgICAgICAgICAgICAgICAgICAgcGF5X3N0YXR1cyxcbiAgICAgICAgICAgICAgICAgICAgZGVwb3NpdFByaWNlXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHJldHVybiBjdHguYm9keSA9IHtcbiAgICAgICAgICAgICAgICBzdGF0dXM6IDIwMCxcbiAgICAgICAgICAgICAgICBkYXRhOiBvcmRlcl9yZXN1bHRcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgfSBjYXRjaCAoIGUgKSB7XG4gICAgIFxuICAgICAgICAgICAgcmV0dXJuIGN0eC5ib2R5ID0ge1xuICAgICAgICAgICAgICAgIHN0YXR1czogNTAwLFxuICAgICAgICAgICAgICAgIG1lc3NhZ2U6IGVcbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgIC8qKlxuICAgICAqIOWIhumhtSArIHF1ZXJ5IOafpeivouiuouWNleWIl+ihqO+8iOacquiBmuWQiO+8iVxuICAgICAqIC0tLS0tIOivt+axgiAtLS0tLS1cbiAgICAgKiB7XG4gICAgICogICAgIHBhZ2U6IG51bWJlclxuICAgICAqICAgICBza2lwOiBudW1iZXJcbiAgICAgKiAgICAgdHlwZTog5oiR55qE5YWo6YOoIHwg5pyq5LuY5qy+6K6i5Y2VIHwg5b6F5Y+R6LSnIHwg5bey5a6M5oiQIHwg566h55CG5ZGY77yI6KGM56iL6K6i5Y2V77yJfCDnrqHnkIblkZjvvIjmiYDmnInorqLljZXvvIlcbiAgICAgKiAgICAgdHlwZTogbXktYWxsIHwgbXktbm90cGF5IHwgbXktZGVsaXZlciB8IG15LWZpbmlzaCB8IG1hbmFnZXItdHJpcCB8IG1hbmFnZXItYWxsXG4gICAgICogfVxuICAgICAqICEg5pyq5LuY5qy+6K6i5Y2V77yacGF5X3N0YXR1czog5pyq5LuY5qy+L+W3suS7mOiuoumHkSDmiJYgdHlwZTogcHJlXG4gICAgICogISDlvoXlj5HotKfvvJpkZWxpdmVyX3N0YXR1c++8muacquWPkei0pyDkuJQgcGF5X3N0YXR1cyDlt7Lku5jmrL5cbiAgICAgKiAhIOW3suWujOaIkO+8mmRlbGl2ZXJfc3RhdHVz77ya5bey5Y+R6LSnIOS4lCBwYXlfc3RhdHVzIOW3suS7mOWFqOasvlxuICAgICAqL1xuICAgIGFwcC5yb3V0ZXIoJ2xpc3QnLCBhc3luYyggY3R4LCBuZXh0ICkgPT4ge1xuICAgICAgICB0cnkge1xuXG4gICAgICAgICAgICAvLyDmn6Xor6LmnaHmlbBcbiAgICAgICAgICAgIGNvbnN0IGxpbWl0ID0gMTA7XG5cbiAgICAgICAgICAgIGxldCB3aGVyZSQgPSB7IH07XG4gICAgICAgICAgICBjb25zdCB7IHR5cGUgfSA9IGV2ZW50LmRhdGE7XG4gICAgICAgICAgICBjb25zdCBvcGVuaWQgPSBldmVudC51c2VySW5mby5vcGVuSWQ7XG5cbiAgICAgICAgICAgIC8vIOaIkeeahOWFqOmDqFxuICAgICAgICAgICAgaWYgKCB0eXBlID09PSAnbXktYWxsJyApIHtcbiAgICAgICAgICAgICAgICB3aGVyZSQgPSB7XG4gICAgICAgICAgICAgICAgICAgIG9wZW5pZDogb3BlbmlkXG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyDmnKrku5jmrL5cbiAgICAgICAgICAgIH0gZWxzZSBpZiAoIHR5cGUgPT09ICdteS1ub3RwYXknICkge1xuICAgICAgICAgICAgICAgIHdoZXJlJCA9IF8uYW5kKHtcbiAgICAgICAgICAgICAgICAgICAgb3BlbmlkLFxuICAgICAgICAgICAgICAgICAgICBiYXNlX3N0YXR1czogJzInXG4gICAgICAgICAgICAgICAgfSwgXy5vcihbXG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6ICdwcmUnXG4gICAgICAgICAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHBheV9zdGF0dXM6IF8ub3IoIF8uZXEoJzAnKSwgXy5lcSgnMScpKVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgXSkpO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICAvLyDmnKrlj5HotKdcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoIHR5cGUgPT09ICdteS1kZWxpdmUnICkge1xuICAgICAgICAgICAgICAgIHdoZXJlJCA9IHtcbiAgICAgICAgICAgICAgICAgICAgb3BlbmlkLFxuICAgICAgICAgICAgICAgICAgICBwYXlfc3RhdHVzOiAnMicsXG4gICAgICAgICAgICAgICAgICAgIGRlbGl2ZXJfc3RhdHVzOiAnMCdcbiAgICAgICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAvLyDlt7LlrozmiJBcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoIHR5cGUgPT09ICdteS1maW5pc2gnICkge1xuICAgICAgICAgICAgICAgIHdoZXJlJCA9IHtcbiAgICAgICAgICAgICAgICAgICAgb3BlbmlkLFxuICAgICAgICAgICAgICAgICAgICBwYXlfc3RhdHVzOiAnMicsXG4gICAgICAgICAgICAgICAgICAgIGRlbGl2ZXJfc3RhdHVzOiAnMSdcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyDojrflj5bmgLvmlbBcbiAgICAgICAgICAgIGNvbnN0IHRvdGFsJCA9IGF3YWl0IGRiLmNvbGxlY3Rpb24oJ29yZGVyJylcbiAgICAgICAgICAgICAgICAud2hlcmUoIHdoZXJlJCApXG4gICAgICAgICAgICAgICAgLmNvdW50KCApO1xuXG4gICAgICAgICAgICAvLyDojrflj5borqLljZXmlbDmja5cbiAgICAgICAgICAgIGNvbnN0IGRhdGEkID0gYXdhaXQgZGIuY29sbGVjdGlvbignb3JkZXInKVxuICAgICAgICAgICAgICAgIC53aGVyZSggd2hlcmUkIClcbiAgICAgICAgICAgICAgICAub3JkZXJCeSgnY3JlYXRlVGltZScsICdkZXNjJylcbiAgICAgICAgICAgICAgICAubGltaXQoIGxpbWl0IClcbiAgICAgICAgICAgICAgICAuc2tpcCggZXZlbnQuZGF0YS5za2lwIHx8ICggZXZlbnQuZGF0YS5wYWdlIC0gMSApICogbGltaXQgKVxuICAgICAgICAgICAgICAgIC5nZXQoICk7XG5cbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogISDnlLHkuo7mn6Xor6LmmK/mjInliIbpobXvvIzkvYbmmK/mmL7npLrmmK/mjInooYznqIvmnaXogZrlkIjmmL7npLpcbiAgICAgICAgICAgICAqICEg5Zug5q2k5pyJ5Y+v6IO977yMTumhteacgOWQjuS4gOS9je+8jOi3n04rMemhteesrOS4gOS9jeS+neeEtuWxnuS6juWQjOS4gOihjOeoi1xuICAgICAgICAgICAgICogISDlpoLkuI3ov5vooYzlpITnkIbvvIzlrqLmiLfmn6Xor6LorqLljZXliJfooajmmL7npLrooYznqIvorqLljZXml7bvvIzkvJrigJzmnInlj6/og73igJ3mmL7npLrkuI3lhahcbiAgICAgICAgICAgICAqICEg54m55q6K5aSE55CG77ya55So5pyA5ZCO5LiA5L2N55qEdGlk77yM5p+l6K+i5pyA5ZCO5LiA5L2N5Lul5ZCO5ZCMdGlk55qEb3JkZXLvvIznhLblkI7kv67mraPmiYDov5Tlm57nmoRwYWdlXG4gICAgICAgICAgICAgKi9cblxuICAgICAgICAgICAgY29uc3QgbGFzdCA9IGRhdGEkLmRhdGFbIGRhdGEkLmRhdGEubGVuZ3RoIC0gMSBdO1xuXG4gICAgICAgICAgICBsZXQgZml4JDogYW55ID0ge1xuICAgICAgICAgICAgICAgIGRhdGE6IFsgXVxuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgaWYgKCBsYXN0ICkgeyBcbiAgICAgICAgICAgICAgICBmaXgkID0gYXdhaXQgZGIuY29sbGVjdGlvbignb3JkZXInKVxuICAgICAgICAgICAgICAgICAgICAud2hlcmUoe1xuICAgICAgICAgICAgICAgICAgICAgICAgb3BlbmlkLFxuICAgICAgICAgICAgICAgICAgICAgICAgdGlkOiBsYXN0LnRpZFxuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAub3JkZXJCeSgnY3JlYXRlVGltZScsICdkZXNjJylcbiAgICAgICAgICAgICAgICAgICAgLnNraXAoIGV2ZW50LmRhdGEuc2tpcCA/IGV2ZW50LmRhdGEuc2tpcCArIGRhdGEkLmRhdGEubGVuZ3RoIDogKCBldmVudC5kYXRhLnBhZ2UgLSAxICkgKiBsaW1pdCArIGRhdGEkLmRhdGEubGVuZ3RoIClcbiAgICAgICAgICAgICAgICAgICAgLmdldCggKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgY29uc3QgbWV0YSA9IFsgLi4uZGF0YSQuZGF0YSwgLi4uZml4JC5kYXRhIF07XG5cbiAgICAgICAgICAgIC8vIOi/memHjOeahOihjOeoi+ivpuaDheeUqCBuZXcgU2V055qE5pa55byP5p+l6K+iXG4gICAgICAgICAgICBjb25zdCB0cmlwSWRzID0gQXJyYXkuZnJvbShcbiAgICAgICAgICAgICAgICBuZXcgU2V0KCBtZXRhLm1hcCggbSA9PiBtLnRpZCApKVxuICAgICAgICAgICAgKTtcblxuICAgICAgICAgICAgY29uc3QgdHJpcHMkID0gYXdhaXQgUHJvbWlzZS5hbGwoIHRyaXBJZHMubWFwKCB0aWQgPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiBkYi5jb2xsZWN0aW9uKCd0cmlwJylcbiAgICAgICAgICAgICAgICAgICAgLndoZXJlKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIF9pZDogdGlkXG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgIC5nZXQoICk7XG4gICAgICAgICAgICB9KSk7XG4gICAgIFxuICAgICAgICAgICAgLy8g6IGa5ZCI6KGM56iL5pWw5o2uXG4gICAgICAgICAgICBjb25zdCBtZXRhMiA9IG1ldGEubWFwKCggeCwgaSApID0+IE9iamVjdC5hc3NpZ24oeyB9LCB4LCB7XG4gICAgICAgICAgICAgICAgLy8gdHJpcDogdHJpcHMkWyBpIF0uZGF0YVsgMCBdXG4gICAgICAgICAgICAgICAgdHJpcDogKHRyaXBzJC5maW5kKCB5ID0+IHkuZGF0YVsgMCBdLl9pZCA9PT0geC50aWQgKSBhcyBhbnkpLmRhdGFbIDAgXVxuICAgICAgICAgICAgfSkpO1xuXG4gICAgICAgICAgICByZXR1cm4gY3R4LmJvZHkgPSB7XG4gICAgICAgICAgICAgICAgc3RhdHVzOiAyMDAsXG4gICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgICBkYXRhOiBtZXRhMixcbiAgICAgICAgICAgICAgICAgICAgcGFnZVNpemU6IGxpbWl0LFxuICAgICAgICAgICAgICAgICAgICB0b3RhbDogdG90YWwkLnRvdGFsLFxuICAgICAgICAgICAgICAgICAgICBwYWdlOiBmaXgkLmRhdGEubGVuZ3RoID09PSAwID8gZXZlbnQuZGF0YS5wYWdlIDogZXZlbnQuZGF0YS5wYWdlICsgTWF0aC5jZWlsKCBmaXgkLmRhdGEubGVuZ3RoIC8gbGltaXQgKSxcbiAgICAgICAgICAgICAgICAgICAgY3VycmVudDogZXZlbnQuZGF0YS5za2lwID8gZXZlbnQuZGF0YS5za2lwICsgbWV0YS5sZW5ndGggOiAoIGV2ZW50LmRhdGEucGFnZSAtIDEgKSAqIGxpbWl0ICsgbWV0YS5sZW5ndGgsXG4gICAgICAgICAgICAgICAgICAgIHRvdGFsUGFnZTogTWF0aC5jZWlsKCB0b3RhbCQudG90YWwgLyBsaW1pdCApXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgXG4gICAgICAgIH0gY2F0Y2ggKCBlICkgeyByZXR1cm4gY3R4LmJvZHkgPSB7IHN0YXR1czogNTAwfTt9XG4gICAgfSlcblxuICAgIC8qKlxuICAgICAqIOaJuemHj+abtOaWsO+8jOiuouWNleS4uuW3suaUr+S7mO+8jOW5tuS4lOWinuWKoOWIsOi0reeJqea4heWNlVxuICAgICAqIG9yZGVySWRzOiBcIjEyMywyMzQsMzQ1XCJcbiAgICAgKiBmb3JtX2lkLFxuICAgICAqIHByZXBheV9pZFxuICAgICAqL1xuICAgIGFwcC5yb3V0ZXIoJ3VwYWR0ZS10by1wYXllZCcsIGFzeW5jKCBjdHgsIG5leHQgKSA9PiB7XG4gICAgICAgIHRyeSB7XG5cbiAgICAgICAgICAgIGNvbnN0IHsgb3JkZXJJZHMsIHByZXBheV9pZCwgZm9ybV9pZCB9ID0gZXZlbnQuZGF0YTtcblxuICAgICAgICAgICAgLy8g5pu05paw6K6i5Y2V5a2X5q61XG4gICAgICAgICAgICBhd2FpdCBQcm9taXNlLmFsbCggb3JkZXJJZHMuc3BsaXQoJywnKS5tYXAoIG9pZCA9PiB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGRiLmNvbGxlY3Rpb24oJ29yZGVyJykuZG9jKCBvaWQgKVxuICAgICAgICAgICAgICAgICAgICAudXBkYXRlKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb3JtX2lkLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHByZXBheV9pZCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXlfc3RhdHVzOiAnMSdcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9KSk7XG5cbiAgICAgICAgICAgIC8vIOWIm+W7ui/mj5LlhaXliLDotK3nianmuIXljZVcbiAgICAgICAgICAgIGNvbnN0IGZpbmQkOiBhbnkgPSBhd2FpdCBQcm9taXNlLmFsbCggb3JkZXJJZHMuc3BsaXQoJywnKS5tYXAoIG9pZCA9PiB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGRiLmNvbGxlY3Rpb24oJ29yZGVyJylcbiAgICAgICAgICAgICAgICAgICAgLndoZXJlKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIF9pZDogb2lkXG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgIC5nZXQoICk7XG4gICAgICAgICAgICB9KSk7XG5cbiAgICAgICAgICAgIGNvbnN0IGxpc3QgPSBmaW5kJC5tYXAoIHggPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IHsgX2lkLCB0aWQsIHBpZCwgc2lkLCBwcmljZSwgZ3JvdXBQcmljZSAgfSA9IHguZGF0YVsgMCBdO1xuICAgICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgICAgIG9pZDogX2lkLFxuICAgICAgICAgICAgICAgICAgICB0aWQsIHBpZCwgc2lkLCBwcmljZSxcbiAgICAgICAgICAgICAgICAgICAgZ3JvdXBQcmljZTogZ3JvdXBQcmljZVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAvLyDov5nph4zmnKzmnaXkuI3pnIDopoHlkIzmraXnrYnlvoXotK3nianmuIXljZXnmoTliJvlu7rvvIzkvYbmmK/kuI3liqBhd2FpdOiyjOS8vOayoeacieiiq+aJp+ihjOWIsFxuICAgICAgICAgICAgYXdhaXQgY2xvdWQuY2FsbEZ1bmN0aW9uKHtcbiAgICAgICAgICAgICAgICBuYW1lOiAnc2hvcHBpbmctbGlzdCcsXG4gICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgICAkdXJsOiAnY3JlYXRlJyxcbiAgICAgICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgICAgICAgbGlzdFxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSlcblxuICAgICAgICAgICAgcmV0dXJuIGN0eC5ib2R5ID0ge1xuICAgICAgICAgICAgICAgIHN0YXR1czogMjAwXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfSBjYXRjaCAoIGUgKSB7IFxuICAgICAgICAgICAgcmV0dXJuIGN0eC5ib2R5ID0geyBzdGF0dXM6IDUwMCB9O1xuICAgICAgICB9IFxuICAgIH0pXG5cbiAgICBhcHAucm91dGVyKCd0ZXN0JywgYXN5bmMoIGN0eCwgbmV4dCApID0+IHtcbiAgICAgICAgdHJ5IHtcblxuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiDmnKrooqvlronmjpLnmoTorqLljZVcbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgY29uc3QgbG9zdE9yZGVyczoge1xuICAgICAgICAgICAgICAgIHRpZCxcbiAgICAgICAgICAgICAgICBwaWQsXG4gICAgICAgICAgICAgICAgc2lkLFxuICAgICAgICAgICAgICAgIG9pZFxuICAgICAgICAgICAgfVsgXSA9IFsgXTtcbiAgICBcbiAgICAgICAgICAgIC8vIOiOt+WPluW9k+WJjei/m+ihjOS4reeahOihjOeoi1xuICAgICAgICAgICAgY29uc3QgdHJpcHMkID0gYXdhaXQgY2xvdWQuY2FsbEZ1bmN0aW9uKHtcbiAgICAgICAgICAgICAgICBuYW1lOiAndHJpcCcsXG4gICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgICAkdXJsOiAnZW50ZXInXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgXG4gICAgICAgICAgICBjb25zdCBjdXJyZW50VHJpcCA9IHRyaXBzJC5yZXN1bHQuZGF0YVsgMCBdO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICBpZiAoICFjdXJyZW50VHJpcCApIHsgXG4gICAgICAgICAgICAgICAgcmV0dXJuIGN0eC5ib2R5ID0ge1xuICAgICAgICAgICAgICAgICAgICBzdGF0dXM6IDIwMFxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICBcbiAgICAgICAgICAgIGNvbnN0IHRpZCA9IGN1cnJlbnRUcmlwLl9pZDtcblxuICAgICAgICAgICAgLy8g5ou/5Yiw5omA5pyJ6K+l6KGM56iL5LiL55qE5bey5LuY6K6i6YeR6K6i5Y2VXG4gICAgICAgICAgICBjb25zdCBmaW5kMSQgPSBhd2FpdCBkYi5jb2xsZWN0aW9uKCdvcmRlcicpXG4gICAgICAgICAgICAgICAgLndoZXJlKHtcbiAgICAgICAgICAgICAgICAgICAgdGlkLFxuICAgICAgICAgICAgICAgICAgICBwYXlfc3RhdHVzOiAnMSdcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIC5nZXQoICk7XG5cbiAgICAgICAgICAgIGlmICggZmluZDEkLmRhdGEubGVuZ3RoID09PSAwICkgeyBcbiAgICAgICAgICAgICAgICByZXR1cm4gY3R4LmJvZHkgPSB7XG4gICAgICAgICAgICAgICAgICAgIHN0YXR1czogMjAwXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgIFxuICAgICAgICAgICAgLy8g5ou/5Yiw6K+l6KGM56iL5LiL55qE6LSt54mp5riF5Y2VXG4gICAgICAgICAgICBjb25zdCBmaW5kMiQgPSBhd2FpdCBkYi5jb2xsZWN0aW9uKCdzaG9wcGluZy1saXN0JylcbiAgICAgICAgICAgICAgICAud2hlcmUoe1xuICAgICAgICAgICAgICAgICAgICB0aWRcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIC5nZXQoICk7XG5cbiAgICAgICAgICAgIGNvbnN0IHRyaXBTaG9wcGluZ0xpc3QgPSBmaW5kMiQuZGF0YTsgXG4gICAgICAgICAgICBcbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICog6Lef5riF5Y2V6L+b6KGM5Yy56YWNXG4gICAgICAgICAgICAgKiAxLiDor6XorqLljZXnmoTllYblk4Ev5Z6L5Y+36L+Y5rKh5pyJ5Lu75L2V5riF5Y2VXG4gICAgICAgICAgICAgKiAyLiDor6XorqLljZXmsqHmnInlnKjlt7LmnInlkIzmrL7llYblk4Ev5Z6L5Y+355qE5riF5Y2V6YeM6Z2iXG4gICAgICAgICAgICAgKi9cblxuICAgICAgICAgICAgZmluZDEkLmRhdGEubWFwKCBvcmRlciA9PiB7XG5cbiAgICAgICAgICAgICAgICBjb25zdCB7IHNpZCwgcGlkLCBfaWQgfSA9IG9yZGVyO1xuICAgICAgICAgICAgICAgIGNvbnN0IGN1cnJlbnRHb29kU2hvcHBpbmdMaXN0ID0gdHJpcFNob3BwaW5nTGlzdC5maW5kKCB4ID0+IHguc2lkID09PSBzaWQgJiYgeC5waWQgPT09IHBpZCApO1xuXG4gICAgICAgICAgICAgICAgaWYgKCAhY3VycmVudEdvb2RTaG9wcGluZ0xpc3QgKSB7XG4gICAgICAgICAgICAgICAgICAgIGxvc3RPcmRlcnMucHVzaCh7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aWQsXG4gICAgICAgICAgICAgICAgICAgICAgICBzaWQsXG4gICAgICAgICAgICAgICAgICAgICAgICBwaWQsXG4gICAgICAgICAgICAgICAgICAgICAgICBvaWQ6IF9pZFxuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHsgb2lkcyB9ID0gY3VycmVudEdvb2RTaG9wcGluZ0xpc3Q7XG4gICAgICAgICAgICAgICAgICAgIGlmICggIW9pZHMuZmluZCggeCA9PiB4ID09PSBfaWQgKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgbG9zdE9yZGVycy5wdXNoKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aWQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2lkLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBpZCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvaWQ6IF9pZFxuICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIGlmICggbG9zdE9yZGVycy5sZW5ndGggPT09IDAgKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGN0eC5ib2R5ID0ge1xuICAgICAgICAgICAgICAgICAgICBzdGF0dXM6IDIwMFxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgYXdhaXQgY2xvdWQuY2FsbEZ1bmN0aW9uKHtcbiAgICAgICAgICAgICAgICBuYW1lOiAnc2hvcHBpbmctbGlzdCcsXG4gICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgICAkdXJsOiAnY3JlYXRlJyxcbiAgICAgICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgICAgICAgbGlzdDogbG9zdE9yZGVyc1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgXG4gICAgICAgICAgICByZXR1cm4gY3R4LmJvZHkgPSB7XG4gICAgICAgICAgICAgICAgc3RhdHVzOiAyMDAsXG4gICAgICAgICAgICAgICAgZGF0YTogbG9zdE9yZGVyc1xuICAgICAgICAgICAgfVxuICAgIFxuICAgICAgICB9IGNhdGNoICggZSApIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCchISEh5a6a5pe25Zmo6K6i5Y2VY2F0Y2hMb3N0T3JkZXJz6ZSZ6K+vJywpXG4gICAgICAgICAgICByZXR1cm4gY3R4LmJvZHkgPSB7IHN0YXR1czogNTAwIH07XG4gICAgICAgIH1cbiAgICB9KVxuXG4gICAgLyoqIFxuICAgICAqIEBkZXNjcmlwdGlvblxuICAgICAqIOS7o+i0rea4heW4kOWCrOasvueahOiuouWNleWIl+ihqFxuICAgICAqL1xuICAgIGFwcC5yb3V0ZXIoJ2RhaWdvdS1saXN0JywgYXN5bmMoIGN0eCwgbmV4dCApID0+IHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGNvbnN0IHsgdGlkIH0gPSBldmVudC5kYXRhO1xuICAgICAgICAgICAgY29uc3Qgb3JkZXJzJCA9IGF3YWl0IGRiLmNvbGxlY3Rpb24oJ29yZGVyJylcbiAgICAgICAgICAgICAgICAud2hlcmUoe1xuICAgICAgICAgICAgICAgICAgICB0aWQsXG4gICAgICAgICAgICAgICAgICAgIHBheV9zdGF0dXM6IF8ub3IoIF8uZXEoJzEnKSwgXy5lcSgnMicpLCBfLmVxKCczJykpXG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAuZ2V0KCApO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICAvLyDnlKjmiLfkv6Hmga9cbiAgICAgICAgICAgIGNvbnN0IHVzZXJzJCA9IGF3YWl0IFByb21pc2UuYWxsKFxuICAgICAgICAgICAgICAgIEFycmF5LmZyb20oIFxuICAgICAgICAgICAgICAgICAgICBuZXcgU2V0KCBvcmRlcnMkLmRhdGFcbiAgICAgICAgICAgICAgICAgICAgICAgIC5tYXAoIHggPT4geC5vcGVuaWQgKVxuICAgICAgICAgICAgICAgICkpXG4gICAgICAgICAgICAgICAgLm1hcCggdWlkID0+IGRiLmNvbGxlY3Rpb24oJ3VzZXInKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC53aGVyZSh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9wZW5pZDogdWlkXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAuZ2V0KCApKVxuICAgICAgICAgICAgKTtcblxuICAgICAgICAgICAgLy8g5Zyw5Z2A5L+h5oGvXG4gICAgICAgICAgICBjb25zdCBhZGRyZXNzJCA9IGF3YWl0IFByb21pc2UuYWxsKFxuICAgICAgICAgICAgICAgIEFycmF5LmZyb20oXG4gICAgICAgICAgICAgICAgICAgIG5ldyBTZXQoIG9yZGVycyQuZGF0YVxuICAgICAgICAgICAgICAgICAgICAgICAgLm1hcCggeCA9PiB4LmFpZCApXG4gICAgICAgICAgICAgICAgKSlcbiAgICAgICAgICAgICAgICAubWFwKCBhaWQgPT4gZGIuY29sbGVjdGlvbignYWRkcmVzcycpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLmRvYyggYWlkIClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAuZ2V0KCApKVxuICAgICAgICAgICAgKTtcblxuICAgICAgICAgICAgY29uc3QgdXNlck9kZXJzID0gdXNlcnMkLm1hcCggdXNlciQgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IHVzZXIgPSB1c2VyJC5kYXRhWyAwIF07XG4gICAgICAgICAgICAgICAgY29uc3Qgb3JkZXJzID0gb3JkZXJzJC5kYXRhLmZpbHRlciggeCA9PiB4Lm9wZW5pZCA9PT0gdXNlci5vcGVuaWQgKTtcbiAgICAgICAgICAgICAgICBjb25zdCBhZGRyZXNzID0gYWRkcmVzcyRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5tYXAoIHggPT4geC5kYXRhIClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5maWx0ZXIoIHggPT4geC5vcGVuaWQgPT09IHVzZXIub3BlbmlkICk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICAgICAgdXNlcixcbiAgICAgICAgICAgICAgICAgICAgb3JkZXJzLFxuICAgICAgICAgICAgICAgICAgICBhZGRyZXNzXG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICByZXR1cm4gY3R4LmJvZHkgPSB7XG4gICAgICAgICAgICAgICAgc3RhdHVzOiAyMDAsXG4gICAgICAgICAgICAgICAgZGF0YTogdXNlck9kZXJzXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfSBjYXRjaCAoIGUgKSB7XG4gICAgICAgICAgICByZXR1cm4gY3R4LmJvZHkgPSB7IHN0YXR1czogNTAwIH07XG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgIC8qKlxuICAgICAqIEBkZXNjcmlwdGlvblxuICAgICAqIOS7jua4heW4kOWCrOasvu+8jOiwg+aVtOiuouWNleWIhumFjemHj1xuICAgICAqIHtcbiAgICAgKiAgICAgIG9pZCwgdGlkLCBzaWQsIHBpZCwgY291bnRcbiAgICAgKiB9XG4gICAgICovXG4gICAgYXBwLnJvdXRlcignYWRqdXN0LWNvdW50JywgYXN5bmMoIGN0eCwgbmV4dCApID0+IHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGNvbnN0IG9wZW5pZCA9IGV2ZW50LmRhdGEub3BlbklkIHx8IGV2ZW50LnVzZXJJbmZvLm9wZW5JZDsgXG4gICAgICAgICAgICBjb25zdCB7IG9pZCwgdGlkLCBzaWQsIHBpZCwgY291bnQgfSA9IGV2ZW50LmRhdGE7XG5cbiAgICAgICAgICAgIGNvbnN0IGdldFdyb25nID0gbWVzc2FnZSA9PiBjdHguYm9keSA9IHtcbiAgICAgICAgICAgICAgICBtZXNzYWdlLFxuICAgICAgICAgICAgICAgIHN0YXR1czogNDAwXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICog5piv5ZCm6IO957un57ut6LCD5pW0XG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIGNvbnN0IG9yZGVyJCA9IGF3YWl0IGRiLmNvbGxlY3Rpb24oJ29yZGVyJylcbiAgICAgICAgICAgICAgICAuZG9jKCBvaWQgKVxuICAgICAgICAgICAgICAgIC5nZXQoICk7XG5cbiAgICAgICAgICAgIGlmICggb3JkZXIkLmRhdGEuYmFzZV9zdGF0dXMgPT09ICcyJyApIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZ2V0V3JvbmcoJ+WCrOasvuWQjuS4jeiDveS/ruaUueaVsOmHjycpO1xuXG4gICAgICAgICAgICB9IGVsc2UgaWYgKCBvcmRlciQuZGF0YS5iYXNlX3N0YXR1cyA9PT0gJzAnICkge1xuICAgICAgICAgICAgICAgIHJldHVybiBnZXRXcm9uZygn6K+35YWI6LCD5pW06K+l5ZWG5ZOB5Lu35qC8Jyk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICog5LiN6IO95aSa5LqO5riF5Y2V5YiG6YWN55qE5oC76LSt5YWl6YePXG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIGNvbnN0IHNob3BwaW5nJCA9IGF3YWl0IGRiLmNvbGxlY3Rpb24oJ3Nob3BwaW5nLWxpc3QnKVxuICAgICAgICAgICAgICAgIC53aGVyZSh7XG4gICAgICAgICAgICAgICAgICAgIHRpZCwgc2lkLCBwaWRcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIC5nZXQoICk7XG4gICAgICAgICAgICBjb25zdCBzaG9wcGluZyA9IHNob3BwaW5nJC5kYXRhWyAwIF07XG4gICAgICAgICAgICBjb25zdCBsYXN0T3JkZXJzJCA9IGF3YWl0IGRiLmNvbGxlY3Rpb24oJ29yZGVyJylcbiAgICAgICAgICAgICAgICAud2hlcmUoe1xuICAgICAgICAgICAgICAgICAgICB0aWQsIHNpZCwgcGlkLFxuICAgICAgICAgICAgICAgICAgICBwYXlfc3RhdHVzOiBfLm5lcSgnMCcpLFxuICAgICAgICAgICAgICAgICAgICBiYXNlX3N0YXR1czogXy5vciggXy5lcSgnMScpLCBfLmVxKCcyJyksIF8uZXEoJzMnKSlcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIC5nZXQoICk7XG5cbiAgICAgICAgICAgIGNvbnN0IGxhc3RPcmRlcnMgPSBsYXN0T3JkZXJzJC5kYXRhO1xuICAgICAgICAgICAgY29uc3Qgb3RoZXJDb3VudDogYW55ID0gbGFzdE9yZGVyc1xuICAgICAgICAgICAgICAgIC5maWx0ZXIoIG8gPT4gby5faWQgIT09IG9pZCApXG4gICAgICAgICAgICAgICAgLnJlZHVjZSgoIHgsIHkgKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB4ICsgeS5hbGxvY2F0ZWRDb3VudCB8fCAwXG4gICAgICAgICAgICAgICAgfSwgMCApO1xuXG4gICAgICAgICAgICBpZiAoIGNvdW50ICsgb3RoZXJDb3VudCA+IHNob3BwaW5nLnB1cmNoYXNlICkge1xuICAgICAgICAgICAgICAgIHJldHVybiBnZXRXcm9uZyhg6K+l5ZWG5ZOB5oC75pWw6YeP5LiN6IO95aSn5LqO6YeH6LSt5pWwJHtzaG9wcGluZy5wdXJjaGFzZX3ku7bvvIFgKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLyoqIOabtOaWsOiuouWNlSAqL1xuICAgICAgICAgICAgYXdhaXQgZGIuY29sbGVjdGlvbignb3JkZXInKVxuICAgICAgICAgICAgICAgIC5kb2MoIG9pZCApXG4gICAgICAgICAgICAgICAgLnVwZGF0ZSh7XG4gICAgICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGFsbG9jYXRlZENvdW50OiBjb3VudFxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICog5pu05paw5riF5Y2VXG4gICAgICAgICAgICAgKiDlsJHkuo7mgLvotK3lhaXph4/ml7bvvIzph43mlrDosIPmlbTmuIXljZXnmoTliankvZnliIbphY3ph49cbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgaWYgKCBjb3VudCArIG90aGVyQ291bnQgPCBzaG9wcGluZy5wdXJjaGFzZSApIHtcblxuICAgICAgICAgICAgICAgIGNvbnN0IG5ld3Nob3BwaW5nID0gT2JqZWN0LmFzc2lnbih7IH0sIHNob3BwaW5nLCB7XG4gICAgICAgICAgICAgICAgICAgIGxhc3RBbGxvY2F0ZWQ6IHNob3BwaW5nLnB1cmNoYXNlIC0gKCBjb3VudCArIG90aGVyQ291bnQgKVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIGRlbGV0ZSBuZXdzaG9wcGluZ1snX2lkJ107XG5cbiAgICAgICAgICAgICAgICBhd2FpdCBkYi5jb2xsZWN0aW9uKCdzaG9wcGluZy1saXN0JylcbiAgICAgICAgICAgICAgICAgICAgLmRvYyggU3RyaW5nKCBzaG9wcGluZy5faWQgKSlcbiAgICAgICAgICAgICAgICAgICAgLnNldCh7XG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRhOiBuZXdzaG9wcGluZ1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIGN0eC5ib2R5ID0ge1xuICAgICAgICAgICAgICAgIHN0YXR1czogMjAwXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBcbiAgICAgICAgfSBjYXRjaCAoIGUgKSB7XG4gICAgICAgICAgICByZXR1cm4gY3R4LmJvZHkgPSB7IHN0YXR1czogNTAwIH1cbiAgICAgICAgfVxuICAgIH0pXG5cbiAgICAvKipcbiAgICAgKiBAZGVzY3JpcHRpb25cbiAgICAgKiAh5bey5byD55So77yM5L2/55So5om56YeP5YKs5qy+44CB6LCD5pW05Yqf6IO977yM6ICM5LiN5piv5q+P5qyh6ZKI5a+55Y2V5Liqb3JkZXLov5vooYzmk43kvZxcbiAgICAgKiDlgqzluJDvvIzosIPmlbTkuIvliJforqLljZXkuLrigJzlt7LosIPmlbTigJ3vvIzlubblj5HpgIHmtojmga/mqKHmnb9cbiAgICAgKiB7XG4gICAgICogICAgdGlkLCBvaWRzXG4gICAgICogfVxuICAgICAqL1xuICAgIGFwcC5yb3V0ZXIoJ2FkanVzdC1zdGF0dXMnLCBhc3luYyggY3R4LCBuZXh0ICkgPT4ge1xuICAgICAgICB0cnkge1xuXG4gICAgICAgICAgICBjb25zdCB7IHRpZCwgb2lkcywgZm9ybV9pZCB9ID0gZXZlbnQuZGF0YTtcbiAgICAgICAgICAgIGNvbnN0IGdldFdyb25nID0gbWVzc2FnZSA9PiBjdHguYm9keSA9IHtcbiAgICAgICAgICAgICAgICBtZXNzYWdlLFxuICAgICAgICAgICAgICAgIHN0YXR1czogNDAwXG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICBjb25zdCB0cmlwJCA9IGF3YWl0IGRiLmNvbGxlY3Rpb24oJ3RyaXAnKVxuICAgICAgICAgICAgICAgIC5kb2MoIHRpZCApXG4gICAgICAgICAgICAgICAgLmdldCggKTtcbiAgICAgICAgICAgIGNvbnN0IHRyaXAgPSB0cmlwJC5kYXRhO1xuXG4gICAgICAgICAgICAvLyDmnKrnu5PmnZ/vvIzkuJTmnKrmiYvliqjlhbPpl61cbiAgICAgICAgICAgIGlmICggbmV3IERhdGUoICkuZ2V0VGltZSggKSA8IHRyaXAuZW5kX2RhdGUgJiYgIXRyaXAuaXNDbG9zZWQgKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGdldFdyb25nKCfooYznqIvmnKrnu5PmnZ/vvIzor7fmiYvliqjlhbPpl63lvZPliY3ooYznqIsnKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8g5pu05paw6K6i5Y2VXG4gICAgICAgICAgICBjb25zdCB1cGRhdGUkID0gYXdhaXQgUHJvbWlzZS5hbGwoIG9pZHMubWFwKCBvaWQgPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiBkYi5jb2xsZWN0aW9uKCdvcmRlcicpXG4gICAgICAgICAgICAgICAgICAgIC5kb2MoIG9pZCApXG4gICAgICAgICAgICAgICAgICAgIC51cGRhdGUoe1xuICAgICAgICAgICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJhc2Vfc3RhdHVzOiAnMidcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9KSk7XG5cbiAgICAgICAgICAgIFxuICAgICAgICAgICAgcmV0dXJuIGN0eC5ib2R5ID0ge1xuICAgICAgICAgICAgICAgIHN0YXR1czogMjAwXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfSBjYXRjaCAoIGUgKSB7IHJldHVybiBjdHguYm9keSA9IHsgc3RhdHVzOiA1MDAgfX1cbiAgICB9KVxuXG4gICAgLyoqXG4gICAgICogQGRlc2NyaXB0aW9uXG4gICAgICog5om56YeP5Zyw77ya56Gu6K6k5a6i5oi36K6i5Y2V44CB5piv5ZCm5Zui6LSt44CB5raI5oGv5o6o6YCB5pON5L2cXG4gICAgICoge1xuICAgICAqICAgIHRpZCxcbiAgICAgKiAgICBvcmRlcnM6IHtcbiAgICAgKiAgICAgICAgb2lkXG4gICAgICogICAgICAgIHBpZFxuICAgICAqICAgICAgICBzaWRcbiAgICAgKiAgICAgICAgb3BlbmlkXG4gICAgICogICAgICAgIGZvcm1faWQgLyBwcmVwYXlfaWRcbiAgICAgKiAgICB9WyBdXG4gICAgICogICAgbm90aWZpY2F0aW9uOiB7IFxuICAgICAqICAgICAgIHRpdGxlLFxuICAgICAqICAgICAgIGRlc2MsXG4gICAgICogICAgICAgdGltZVxuICAgICAqICAgIH1bICBdXG4gICAgICogfVxuICAgICAqL1xuICAgIGFwcC5yb3V0ZXIoJ2JhdGNoLWFkanVzdCcsIGFzeW5jKCBjdHgsIG5leHQgKSA9PiB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBjb25zdCB7IHRpZCwgb3JkZXJzLCBub3RpZmljYXRpb24gfSA9IGV2ZW50LmRhdGE7XG4gICAgICAgICAgICBjb25zdCBnZXRXcm9uZyA9IG1lc3NhZ2UgPT4gY3R4LmJvZHkgPSB7XG4gICAgICAgICAgICAgICAgbWVzc2FnZSxcbiAgICAgICAgICAgICAgICBzdGF0dXM6IDQwMFxuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgY29uc3QgdHJpcCQgPSBhd2FpdCBkYi5jb2xsZWN0aW9uKCd0cmlwJylcbiAgICAgICAgICAgICAgICAuZG9jKCB0aWQgKVxuICAgICAgICAgICAgICAgIC5nZXQoICk7XG4gICAgICAgICAgICBjb25zdCB0cmlwID0gdHJpcCQuZGF0YTtcblxuICAgICAgICAgICAgLy8g5pyq57uT5p2f77yM5LiU5pyq5omL5Yqo5YWz6ZetXG4gICAgICAgICAgICBpZiAoIG5ldyBEYXRlKCApLmdldFRpbWUoICkgPCB0cmlwLmVuZF9kYXRlICYmICF0cmlwLmlzQ2xvc2VkICkge1xuICAgICAgICAgICAgICAgIHJldHVybiBnZXRXcm9uZygn6KGM56iL5pyq57uT5p2f77yM6K+35omL5Yqo5YWz6Zet5b2T5YmN6KGM56iLJyk7XG5cbiAgICAgICAgICAgIH0gZWxzZSBpZiAoIHRyaXAuY2FsbE1vbmV5VGltZXMgJiYgIHRyaXAuY2FsbE1vbmV5VGltZXMgPj0gMyApIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZ2V0V3JvbmcoYOW3sue7j+WPkei1t+i/hyR7dHJpcC5jYWxsTW9uZXlUaW1lc33mrKHlgqzmrL5gKTtcblxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyDmm7TmlrDorqLljZVcbiAgICAgICAgICAgIGF3YWl0IFByb21pc2UuYWxsKCBvcmRlcnMubWFwKCBvcmRlciA9PiB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGRiLmNvbGxlY3Rpb24oJ29yZGVyJylcbiAgICAgICAgICAgICAgICAgICAgLmRvYyggb3JkZXIub2lkIClcbiAgICAgICAgICAgICAgICAgICAgLnVwZGF0ZSh7XG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYmFzZV9zdGF0dXM6ICcyJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYW5Hcm91cDogISFvcmRlcnMuZmluZCggbyA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBvLm9pZCAhPT0gb3JkZXIub2lkICYmIG8ub3BlbmlkICE9PSBvcmRlci5vcGVuaWQgJiYgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvLnBpZCA9PT0gb3JkZXIucGlkICYmIG8uc2lkID09PSBvcmRlci5zaWRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgfSkpO1xuXG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIOa2iOaBr+aOqOmAgVxuICAgICAgICAgICAgICogIeacquS7mOWFqOasvuaJjeWPkemAgVxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICBjb25zdCB1c2VycyA9IEFycmF5LmZyb20oXG4gICAgICAgICAgICAgICAgbmV3IFNldChcbiAgICAgICAgICAgICAgICAgICAgb3JkZXJzXG4gICAgICAgICAgICAgICAgICAgICAgICAubWFwKCBvcmRlciA9PiBvcmRlci5vcGVuaWQgKVxuICAgICAgICAgICAgICAgICAgICAgICAgLmZpbHRlciggb3BlbmlkID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gISFvcmRlcnMuZmluZCggb3JkZXIgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gb3JkZXIub3BlbmlkID09PSBvcGVuaWQgJiYgU3RyaW5nKCBvcmRlci5wYXlfc3RhdHVzICkgPT09ICcxJ1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICApO1xuXG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZygnLS0tLS0tIOS7peS4i+eUqOaIt+WPkemAgeaOqOmAgSAtLS0tLS0nLCBvcmRlcnMsIHVzZXJzICk7XG4gICAgICAgICAgICBjb25zdCBycyA9IGF3YWl0IFByb21pc2UuYWxsKCB1c2Vycy5tYXAoIG9wZW5pZCA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3QgdGFyZ2V0ID0gb3JkZXJzLmZpbmQoIG9yZGVyID0+IG9yZGVyLm9wZW5pZCA9PT0gb3BlbmlkICYmXG4gICAgICAgICAgICAgICAgICAgICghIW9yZGVyLnByZXBheV9pZCB8fCAhIW9yZGVyLmZvcm1faWQgKSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGNsb3VkLmNhbGxGdW5jdGlvbih7XG4gICAgICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0b3VzZXI6IG9wZW5pZCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhOiBub3RpZmljYXRpb24sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9ybV9pZDogdGFyZ2V0LnByZXBheV9pZCB8fCB0YXJnZXQuZm9ybV9pZFxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICR1cmw6ICdub3RpZmljYXRpb24tZ2V0bW9uZXknXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIG5hbWU6ICdjb21tb24nXG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIH0pKTtcbiBcbiAgICAgICAgICAgIC8vIOabtOaWsOihjOeoi1xuICAgICAgICAgICAgYXdhaXQgZGIuY29sbGVjdGlvbigndHJpcCcpXG4gICAgICAgICAgICAgICAgLmRvYyggdGlkIClcbiAgICAgICAgICAgICAgICAudXBkYXRlKHtcbiAgICAgICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgICAgICAgY2FsbE1vbmV5VGltZXM6IF8uaW5jKCAxIClcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICByZXR1cm4gY3R4LmJvZHkgPSB7XG4gICAgICAgICAgICAgICAgc3RhdHVzOiAyMDAsXG4gICAgICAgICAgICAgICAgLy8g5Ymp5L2Z5qyh5pWwXG4gICAgICAgICAgICAgICAgZGF0YTogMyAtICggMSArIHRyaXAuY2FsbE1vbmV5VGltZXMgKVxuICAgICAgICAgICAgfVxuXG4gICAgICAgIH0gY2F0Y2ggKCBlICkge1xuICAgICAgICAgICAgcmV0dXJuIGN0eC5ib2R5ID0geyBzdGF0dXM6IDUwMCB9O1xuICAgICAgICB9XG4gICAgfSlcbiBcbiAgIHJldHVybiBhcHAuc2VydmUoICk7XG5cbn0iXX0=