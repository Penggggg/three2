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
cloud.init({
    env: process.env.cloud
});
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
            var where$, _a, type, tid, limit, openid, total$, data$, last, fix$, meta, tripIds, trips$_1, meta2, e_2;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 6, , 7]);
                        where$ = {};
                        _a = event.data, type = _a.type, tid = _a.tid;
                        limit = tid ? 99 : 10;
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
                        if (tid) {
                            where$ = Object.assign({}, where$, {
                                tid: tid
                            });
                        }
                        return [4, db.collection('order')
                                .where(where$)
                                .count()];
                    case 1:
                        total$ = _b.sent();
                        return [4, db.collection('order')
                                .where(where$)
                                .orderBy('createTime', 'desc')
                                .limit(limit)
                                .skip(event.data.skip || (event.data.page - 1) * limit)
                                .get()];
                    case 2:
                        data$ = _b.sent();
                        last = data$.data[data$.data.length - 1];
                        fix$ = {
                            data: []
                        };
                        if (!(last && !tid)) return [3, 4];
                        return [4, db.collection('order')
                                .where({
                                openid: openid,
                                tid: last.tid
                            })
                                .orderBy('createTime', 'desc')
                                .skip(event.data.skip ? event.data.skip + data$.data.length : (event.data.page - 1) * limit + data$.data.length)
                                .get()];
                    case 3:
                        fix$ = _b.sent();
                        _b.label = 4;
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
                        trips$_1 = _b.sent();
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
                        e_2 = _b.sent();
                        return [2, ctx.body = { status: 500 }];
                    case 7: return [2];
                }
            });
        }); });
        app.router('upadte-to-payed', function (ctx, next) { return __awaiter(_this, void 0, void 0, function () {
            var openId, _a, orderIds, prepay_id_1, form_id_1, find$, list, e_3;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 4, , 5]);
                        openId = event.userInfo.openId;
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
                            var _a = x.data[0], _id = _a._id, tid = _a.tid, pid = _a.pid, sid = _a.sid, price = _a.price, groupPrice = _a.groupPrice, acid = _a.acid;
                            return {
                                oid: _id,
                                acid: acid, groupPrice: groupPrice,
                                tid: tid, pid: pid, sid: sid, price: price
                            };
                        });
                        return [4, cloud.callFunction({
                                name: 'shopping-list',
                                data: {
                                    $url: 'create',
                                    data: {
                                        list: list,
                                        openId: openId
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
        app.router('daigou-list', function (ctx, next) { return __awaiter(_this, void 0, void 0, function () {
            var _a, tid_1, needCoupons, needAddress, orders$_1, users$, address$_1, coupons$_1, userOders, e_4;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 7, , 8]);
                        _a = event.data, tid_1 = _a.tid, needCoupons = _a.needCoupons, needAddress = _a.needAddress;
                        return [4, db.collection('order')
                                .where({
                                tid: tid_1,
                                pay_status: _.or(_.eq('1'), _.eq('2'))
                            })
                                .get()];
                    case 1:
                        orders$_1 = _b.sent();
                        return [4, Promise.all(Array.from(new Set(orders$_1.data
                                .map(function (x) { return x.openid; })))
                                .map(function (uid) { return db.collection('user')
                                .where({
                                openid: uid
                            })
                                .get(); }))];
                    case 2:
                        users$ = _b.sent();
                        address$_1 = [];
                        if (!(!!needAddress || needAddress === undefined)) return [3, 4];
                        return [4, Promise.all(Array.from(new Set(orders$_1.data
                                .map(function (x) { return x.aid; })))
                                .map(function (aid) { return db.collection('address')
                                .doc(aid)
                                .get(); }))];
                    case 3:
                        address$_1 = _b.sent();
                        _b.label = 4;
                    case 4:
                        coupons$_1 = [];
                        if (!(!!needCoupons || needCoupons === undefined)) return [3, 6];
                        return [4, Promise.all(Array.from(new Set(orders$_1.data
                                .map(function (x) { return x.openid; })))
                                .map(function (openid) { return db.collection('coupon')
                                .where(_.or([
                                {
                                    tid: tid_1,
                                    openid: openid,
                                    type: _.or(_.eq('t_manjian'), _.eq('t_lijian'))
                                }, {
                                    openid: openid,
                                    isUsed: false,
                                    canUseInNext: true,
                                    type: 't_daijin'
                                }
                            ]))
                                .get(); }))];
                    case 5:
                        coupons$_1 = _b.sent();
                        _b.label = 6;
                    case 6:
                        userOders = users$.map(function (user$) {
                            var user = user$.data[0];
                            var orders = orders$_1.data
                                .filter(function (x) { return x.openid === user.openid; });
                            var address = address$_1.length > 0 ?
                                address$_1
                                    .map(function (x) { return x.data; })
                                    .filter(function (x) { return x.openid === user.openid; }) :
                                undefined;
                            var coupons = coupons$_1.length > 0 ?
                                coupons$_1
                                    .map(function (x) { return x.data; })
                                    .filter(function (x) { return x.length > 0 && x[0].openid === user.openid; }) :
                                undefined;
                            return {
                                user: user,
                                orders: orders,
                                address: address,
                                coupons: (!!coupons && coupons.length > 0) ? coupons[0] : []
                            };
                        });
                        return [2, ctx.body = {
                                status: 200,
                                data: userOders
                            }];
                    case 7:
                        e_4 = _b.sent();
                        console.log('...', e_4);
                        return [2, ctx.body = { status: 500 }];
                    case 8: return [2];
                }
            });
        }); });
        app.router('adjust-count', function (ctx, next) { return __awaiter(_this, void 0, void 0, function () {
            var openid, _a, oid_1, tid, sid, pid, count, getWrong, order$, shopping$, shopping, lastOrders$, lastOrders, otherCount, newshopping, e_5;
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
                        e_5 = _b.sent();
                        return [2, ctx.body = { status: 500 }];
                    case 8: return [2];
                }
            });
        }); });
        app.router('batch-adjust', function (ctx, next) { return __awaiter(_this, void 0, void 0, function () {
            var canGroupUserMapCount_1, _a, tid, orders_1, notification, getWrong, trip$, trip_1, users, rs, e_6;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 5, , 6]);
                        canGroupUserMapCount_1 = {};
                        _a = event.data, tid = _a.tid, orders_1 = _a.orders, notification = _a.notification;
                        getWrong = function (message) { return ctx.body = {
                            message: message,
                            status: 400
                        }; };
                        return [4, db.collection('trip')
                                .doc(tid)
                                .get()];
                    case 1:
                        trip$ = _b.sent();
                        trip_1 = trip$.data;
                        if (new Date().getTime() < trip_1.end_date && !trip_1.isClosed) {
                            return [2, getWrong('行程未结束，请手动关闭当前行程')];
                        }
                        else if (trip_1.callMoneyTimes && trip_1.callMoneyTimes >= 3) {
                            return [2, getWrong("\u5DF2\u7ECF\u53D1\u8D77\u8FC7" + trip_1.callMoneyTimes + "\u6B21\u50AC\u6B3E")];
                        }
                        return [4, Promise.all(orders_1.map(function (order) {
                                var _a;
                                var canGroup = !!orders_1.find(function (o) {
                                    return o.oid !== order.oid &&
                                        o.openid !== order.openid &&
                                        o.pid === order.pid && o.sid === order.sid &&
                                        o.allocatedCount > 0 && order.allocatedCount > 0 &&
                                        !!o.allocatedGroupPrice;
                                });
                                if (canGroup) {
                                    canGroupUserMapCount_1 = Object.assign({}, canGroupUserMapCount_1, (_a = {},
                                        _a[order.openid] = canGroupUserMapCount_1[order.openid] === undefined ? 1 : canGroupUserMapCount_1[order.openid] + 1,
                                        _a));
                                }
                                return db.collection('order')
                                    .doc(order.oid)
                                    .update({
                                    data: {
                                        canGroup: canGroup,
                                        base_status: '2'
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
                                            data: {
                                                title: canGroupUserMapCount_1[String(openid)] ?
                                                    "\u62FC\u56E2" + canGroupUserMapCount_1[String(openid)] + "\u4EF6\uFF01\u60A8\u8D2D\u4E70\u7684\u5546\u54C1\u5DF2\u5230\u8D27" :
                                                    '您购买的商品已到货',
                                                time: "[\u884C\u7A0B]" + trip_1.title
                                            },
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
                                data: 3 - (1 + trip_1.callMoneyTimes)
                            }];
                    case 5:
                        e_6 = _b.sent();
                        return [2, ctx.body = { status: 500 }];
                    case 6: return [2];
                }
            });
        }); });
        app.router('pay-last', function (ctx, next) { return __awaiter(_this, void 0, void 0, function () {
            var openid, _a, tid_2, integral, orders, coupons, user$, trip$, req, _b, cashcoupon_atleast, cashcoupon_values, temp, lastDaijin$, e_7;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _c.trys.push([0, 11, , 12]);
                        openid = event.userInfo.openId;
                        _a = event.data, tid_2 = _a.tid, integral = _a.integral, orders = _a.orders, coupons = _a.coupons;
                        return [4, db.collection('user')
                                .where({
                                openid: openid
                            })
                                .get()];
                    case 1:
                        user$ = _c.sent();
                        return [4, db.collection('user')
                                .doc(String(user$.data[0]._id))
                                .update({
                                data: {
                                    integral: _.inc(integral)
                                }
                            })];
                    case 2:
                        _c.sent();
                        return [4, Promise.all(orders.map(function (order) {
                                return Promise.all([
                                    db.collection('order')
                                        .doc(order.oid)
                                        .update({
                                        data: {
                                            base_status: '3',
                                            pay_status: '2',
                                            final_price: order.final_price,
                                        }
                                    }),
                                    db.collection('goods')
                                        .doc(order.pid)
                                        .update({
                                        data: {
                                            saled: _.inc(order.allocatedCount)
                                        }
                                    })
                                ]);
                            }))];
                    case 3:
                        _c.sent();
                        return [4, Promise.all(coupons.map(function (couponid) {
                                return db.collection('coupon')
                                    .doc(couponid)
                                    .update({
                                    data: {
                                        isUsed: true,
                                        usedBy: tid_2,
                                        canUseInNext: false
                                    }
                                });
                            }))];
                    case 4:
                        _c.sent();
                        return [4, db.collection('trip')
                                .doc(tid_2)
                                .get()];
                    case 5:
                        trip$ = _c.sent();
                        req = {
                            result: {
                                status: 500
                            }
                        };
                        _b = trip$.data, cashcoupon_atleast = _b.cashcoupon_atleast, cashcoupon_values = _b.cashcoupon_values;
                        temp = {
                            openId: openid,
                            fromtid: tid_2,
                            type: 't_daijin',
                            title: '行程代金券',
                            canUseInNext: true,
                            isUsed: false,
                            atleast: cashcoupon_atleast || 0,
                            value: cashcoupon_values
                        };
                        if (!!!cashcoupon_values) return [3, 10];
                        return [4, db.collection('coupon')
                                .where({
                                type: 't_daijin',
                                isUsed: false,
                                canUseInNext: true
                            })
                                .get()];
                    case 6:
                        lastDaijin$ = _c.sent();
                        if (!lastDaijin$.data[0]) return [3, 8];
                        return [4, db.collection('coupon')
                                .doc(String(lastDaijin$.data[0]._id))
                                .remove()];
                    case 7:
                        _c.sent();
                        _c.label = 8;
                    case 8: return [4, cloud.callFunction({
                            data: {
                                data: temp,
                                $url: 'create'
                            },
                            name: 'coupon'
                        })];
                    case 9:
                        req = _c.sent();
                        _c.label = 10;
                    case 10: return [2, ctx.body = {
                            status: 200,
                            data: req.result.status === 200 ? temp : null
                        }];
                    case 11:
                        e_7 = _c.sent();
                        return [2, ctx.body = { status: 500 }];
                    case 12: return [2];
                }
            });
        }); });
        app.router('unread', function (ctx, next) { return __awaiter(_this, void 0, void 0, function () {
            var _a, tid, lastTime, where$, data$, e_8;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        _a = event.data, tid = _a.tid, lastTime = _a.lastTime;
                        where$ = {
                            tid: tid
                        };
                        if (lastTime) {
                            where$ = Object.assign({}, where$, {
                                createtime: _.gte(lastTime)
                            });
                        }
                        return [4, db.collection('order')
                                .where(where$)
                                .count()];
                    case 1:
                        data$ = _b.sent();
                        return [2, ctx.body = {
                                status: 200,
                                data: data$.total
                            }];
                    case 2:
                        e_8 = _b.sent();
                        return [2, ctx.body = { status: 500 }];
                    case 3: return [2];
                }
            });
        }); });
        app.router('list-all', function (ctx, next) { return __awaiter(_this, void 0, void 0, function () {
            var limit, _a, tid, page, where$, total$, orders$, pids, sids, uids, users$$, users$_1, meta, e_9;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 4, , 5]);
                        limit = 10;
                        _a = event.data, tid = _a.tid, page = _a.page;
                        where$ = {
                            tid: tid,
                            pay_status: _.neq('0')
                        };
                        return [4, db.collection('order')
                                .where(where$)
                                .count()];
                    case 1:
                        total$ = _b.sent();
                        return [4, db.collection('order')
                                .where(where$)
                                .limit(limit)
                                .skip((page - 1) * limit)
                                .orderBy('createTime', 'desc')
                                .get()];
                    case 2:
                        orders$ = _b.sent();
                        pids = Array.from(new Set(orders$.data
                            .map(function (x) { return x.pid; })));
                        sids = Array.from(new Set(orders$.data
                            .map(function (x) { return x.sid; })
                            .filter(function (x) { return !!x; })));
                        uids = Array.from(new Set(orders$.data
                            .map(function (x) { return x.openid; })
                            .filter(function (x) { return !!x; })));
                        return [4, Promise.all(uids.map(function (openid) { return db.collection('user')
                                .where({
                                openid: openid
                            })
                                .field({
                                openid: true,
                                avatarUrl: true,
                                nickName: true
                            })
                                .get(); }))];
                    case 3:
                        users$$ = _b.sent();
                        users$_1 = users$$.map(function (x) { return x.data[0]; });
                        meta = orders$.data.map(function (order) {
                            var user = users$_1.find(function (user) { return user.openid === order.openid; });
                            return Object.assign({}, order, {
                                user: user,
                            });
                        });
                        return [2, ctx.body = {
                                status: 200,
                                data: {
                                    page: page,
                                    pageSize: limit,
                                    data: meta,
                                    total: total$.total,
                                    totalPage: Math.ceil(total$.total / limit)
                                }
                            }];
                    case 4:
                        e_9 = _b.sent();
                        console.log('???', e_9);
                        return [2, ctx.body = { status: 500 }];
                    case 5: return [2];
                }
            });
        }); });
        return [2, app.serve()];
    });
}); };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFDQSxpQkE2akNDOztBQTdqQ0QscUNBQXVDO0FBQ3ZDLHNDQUF3QztBQUN4QyxtQ0FBbUM7QUFFbkMsS0FBSyxDQUFDLElBQUksQ0FBQztJQUNQLEdBQUcsRUFBRSxPQUFPLENBQUMsR0FBRyxDQUFDLEtBQUs7Q0FDekIsQ0FBQyxDQUFDO0FBRUgsSUFBTSxFQUFFLEdBQWdCLEtBQUssQ0FBQyxRQUFRLEVBQUcsQ0FBQztBQUUxQyxJQUFNLENBQUMsR0FBRyxFQUFFLENBQUMsT0FBTyxDQUFDO0FBbUNSLFFBQUEsSUFBSSxHQUFHLFVBQVEsS0FBSyxFQUFFLE9BQU87Ozs7UUFFaEMsR0FBRyxHQUFHLElBQUksU0FBUyxDQUFDLEVBQUUsS0FBSyxPQUFBLEVBQUUsQ0FBQyxDQUFDO1FBaUNyQyxHQUFHLENBQUMsTUFBTSxDQUFDLFFBQVEsRUFBRSxVQUFPLEdBQUcsRUFBRSxJQUFJOzs7Ozs7d0JBR3ZCLEtBQXdCLEtBQUssQ0FBQyxJQUFJLEVBQWhDLEdBQUcsU0FBQSxFQUFFLElBQUksVUFBQSxFQUFFLE1BQU0sWUFBQSxDQUFnQjt3QkFDbkMsV0FBUyxLQUFLLENBQUMsSUFBSSxDQUFDLE1BQU0sSUFBSSxLQUFLLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQzt3QkFHMUMsV0FBTSxLQUFLLENBQUMsWUFBWSxDQUFDO2dDQUNyQyxJQUFJLEVBQUU7b0NBQ0YsSUFBSSxFQUFFO3dDQUNGLEdBQUcsRUFBRSxHQUFHO3FDQUNYO29DQUNELElBQUksRUFBRSxRQUFRO2lDQUNqQjtnQ0FDRCxJQUFJLEVBQUUsTUFBTTs2QkFDZixDQUFDLEVBQUE7O3dCQVJJLE9BQU8sR0FBRyxTQVFkO3dCQUVJLE1BQU0sR0FBRyxPQUFPLENBQUMsTUFBTSxDQUFDO3dCQUM5QixJQUFLLE1B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QUFHLENBQUMsS0FBSyxFQUFFLEdBQUMsQ0FBRSxDQUFBO3dCQUN0QixXQUFPLEdBQUcsQ0FBQyxJQUFJLEdBQUcsRUFBRSxNQUFNLEVBQUUsR0FBRyxFQUFFLEVBQUE7Ozs7YUFFeEMsQ0FBQyxDQUFBO1FBRUgsV0FBTyxHQUFHLENBQUMsS0FBSyxFQUFHLEVBQUM7O0tBRXRCLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJcbmltcG9ydCAqIGFzIGNsb3VkIGZyb20gJ3d4LXNlcnZlci1zZGsnO1xuaW1wb3J0ICogYXMgVGNiUm91dGVyIGZyb20gJ3RjYi1yb3V0ZXInO1xuaW1wb3J0IHsgY3JlYXRlJCB9IGZyb20gJy4vY3JlYXRlJztcblxuY2xvdWQuaW5pdCh7XG4gICAgZW52OiBwcm9jZXNzLmVudi5jbG91ZFxufSk7XG5cbmNvbnN0IGRiOiBEQi5EYXRhYmFzZSA9IGNsb3VkLmRhdGFiYXNlKCApO1xuXG5jb25zdCBfID0gZGIuY29tbWFuZDtcblxuLyoqXG4gKiBcbiAqIEBkZXNjcmlwdGlvbiDorqLljZXmqKHlnZdcbiAqIC0tLS0tLS0tIOWtl+autSAtLS0tLS0tLS0tXG4gKiBfaWRcbiAqIG9wZW5pZCxcbiAqIGNyZWF0ZXRpbWVcbiAqIHRpZCxcbiAqIHBpZCxcbiAqIGNpZCAo5Y+v5Li656m6KVxuICogc2lkLCAo5Y+v5Li656m6KVxuICogY291bnQsXG4gKiBwcmljZSxcbiAqIGdyb3VwUHJpY2UsXG4gKiBkZXBvc2l0X3ByaWNlOiDllYblk4HorqLph5EgKOWPr+S4uuepuilcbiAqICEgYWNpZCDllYblk4HmtLvliqhpZFxuICogISBpc09jY3VwaWVkLCDmmK/lkKbljaDlupPlrZhcbiAqIGdyb3VwX3ByaWNlICjlj6/kuLrnqbopXG4gKiB0eXBlOiAnY3VzdG9tJyB8ICdub3JtYWwnIHwgJ3ByZScg6Ieq5a6a5LmJ5Yqg5Y2V44CB5pmu6YCa5Yqg5Y2V44CB6aKE6K6i5Y2VXG4gKiBpbWc6IEFycmF5WyBzdHJpbmcgXVxuICogZGVzY++8iOWPr+S4uuepuu+8iSxcbiAqIGFpZFxuICogYWxsb2NhdGVkUHJpY2Ug5YiG6YWN55qE5Lu35qC8XG4gKiBhbGxvY2F0ZWRHcm91cFByaWNlIOWIhumFjeWboui0reS7t1xuICogYWxsb2NhdGVkQ291bnQg5YiG6YWN55qE5pWw6YePXG4gKiBmb3JtX2lkXG4gKiBwcmVwYXlfaWQsXG4gKiBmaW5hbF9wcmljZSDmnIDlkI7miJDkuqTku7dcbiAqICEgY2FuR3JvdXAg5piv5ZCm5Y+v5Lul5ou85ZuiXG4gKiAhIGJhc2Vfc3RhdHVzOiAwLDEsMiwzLDQsNSDov5vooYzkuK3vvIzku6PotK3lt7LotK3kubDvvIzlt7LosIPmlbTvvIzlt7Lnu5PnrpfvvIzlt7Llj5bmtojvvIjkubDkuI3liLDvvInvvIzlt7Lov4fmnJ/vvIjmlK/ku5jov4fmnJ/vvIlcbiAqICEgcGF5X3N0YXR1czogMCwxLDIg5pyq5LuY5qy+77yM5bey5LuY6K6i6YeR77yM5bey5LuY5YWo5qy+XG4gKiAhIGRlbGl2ZXJfc3RhdHVzOiAwLDEg5pyq5Y+R5biD77yM5bey5Y+R5biD44CBXG4gKi9cbmV4cG9ydCBjb25zdCBtYWluID0gYXN5bmMgKCBldmVudCwgY29udGV4dCApID0+IHtcblxuICAgIGNvbnN0IGFwcCA9IG5ldyBUY2JSb3V0ZXIoeyBldmVudCB9KTtcblxuICAgIC8qKlxuICAgICAqIEBkZXNjcmlwdGlvbiDliJvlu7rorqLljZVcbiAgICAgKiAtLS0tLS0tLSDor7fmsYIgLS0tLS0tLS0tLVxuICAgICAqIHtcbiAgICAgKiAgICAgIHRpZCxcbiAgICAgKiAgICAgIG9wZW5JZCAvLyDorqLljZXkuLvkurpcbiAgICAgKiAgICAgIGZyb206ICdjYXJ0JyB8ICdidXknIHwgJ2N1c3RvbScgfCAnYWdlbnRzJyB8ICdzeXN0ZW0nIOadpea6kO+8mui0reeJqei9puOAgeebtOaOpei0reS5sOOAgeiHquWumuS5ieS4i+WNleOAgeS7o+i0reS4i+WNleOAgeezu+e7n+WPkei1t+mihOS7mOiuouWNlVxuICAgICAqICAgICAgb3JkZXJzOiBBcnJheTx7IFxuICAgICAqICAgICAgICAgIHRpZFxuICAgICAqICAgICAgICAgIGNpZFxuICAgICAqICAgICAgICAgIHNpZFxuICAgICAqICAgICAgICAgIHBpZFxuICAgICAqICAgICAgICAgIHByaWNlXG4gICAgICogICAgICAgICAgbmFtZVxuICAgICAqICAgICAgICAgIGFjaWRcbiAgICAgKiAgICAgICAgICBzdGFuZGVybmFtZVxuICAgICAqICAgICAgICAgIGdyb3VwUHJpY2VcbiAgICAgKiAgICAgICAgICBjb3VudFxuICAgICAqICAgICAgICAgIGRlc2NcbiAgICAgKiAgICAgICAgICBpbWdcbiAgICAgKiAgICAgICAgICB0eXBlXG4gICAgICogICAgICAgICAgcGF5X3N0YXR1cyxcbiAgICAgKiAgICAgICAgICBhZGRyZXNzOiB7XG4gICAgICogICAgICAgICAgICAgIG5hbWUsXG4gICAgICogICAgICAgICAgICAgIHBob25lLFxuICAgICAqICAgICAgICAgICAgICBkZXRhaWwsXG4gICAgICogICAgICAgICAgICAgIHBvc3RhbGNvZGVcbiAgICAgKiAgICAgICAgICB9XG4gICAgICogICAgICB9PlxuICAgICAqIH1cbiAgICAgKi9cbiAgICBhcHAucm91dGVyKCdjcmVhdGUnLCBhc3luYyggY3R4LCBuZXh0ICkgPT4ge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgXG4gICAgICAgICAgICBjb25zdCB7IHRpZCwgZnJvbSwgb3JkZXJzIH0gPSBldmVudC5kYXRhO1xuICAgICAgICAgICAgY29uc3Qgb3BlbmlkID0gZXZlbnQuZGF0YS5vcGVuSWQgfHwgZXZlbnQudXNlckluZm8ub3BlbklkO1xuXG4gICAgICAgICAgICAvLyAx44CB5Yik5pat6K+l6KGM56iL5piv5ZCm5Y+v5Lul55SoXG4gICAgICAgICAgICBjb25zdCB0cmlwcyQkID0gYXdhaXQgY2xvdWQuY2FsbEZ1bmN0aW9uKHtcbiAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIF9pZDogdGlkXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICR1cmw6ICdkZXRhaWwnXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBuYW1lOiAndHJpcCdcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBjb25zdCB0cmlwcyQgPSB0cmlwcyQkLnJlc3VsdDsgICAgICAgIFxuICAgICAgICAgICAgaWYgKCB0cmlwcyQuc3RhdHVzICE9PSAyMDBcbiAgICAgICAgICAgICAgICAgICAgfHwgIXRyaXBzJC5kYXRhIFxuICAgICAgICAgICAgICAgICAgICB8fCAoICEhdHJpcHMkLmRhdGEgJiYgdHJpcHMkLmRhdGEuaXNDbG9zZWQgKSBcbiAgICAgICAgICAgICAgICAgICAgfHwgKCAhIXRyaXBzJC5kYXRhICYmIG5ldyBEYXRlKCApLmdldFRpbWUoICkgPj0gdHJpcHMkLmRhdGEuZW5kX2RhdGUgKSkge1xuICAgICAgICAgICAgICAgIHRocm93ICfmmoLml6DooYznqIvorqHliJLvvIzmmoLml7bkuI3og73otK3kubDvvZ4nXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIOacgOaWsOWPr+eUqOihjOeoi1xuICAgICAgICAgICAgY29uc3QgdHJpcCA9IHRyaXBzJC5kYXRhO1xuXG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIOagueaNruWcsOWdgOWvueixoe+8jOaLv+WIsOWcsOWdgGlkXG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIGxldCBhZGRyZXNzaWQkID0ge1xuICAgICAgICAgICAgICAgIHJlc3VsdDoge1xuICAgICAgICAgICAgICAgICAgICBkYXRhOiBudWxsLFxuICAgICAgICAgICAgICAgICAgICBzdGF0dXM6IDUwMFxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIC8vIOiuouWNleadpea6kO+8mui0reeJqei9puOAgeezu+e7n+WKoOWNlVxuICAgICAgICAgICAgaWYgKCBldmVudC5kYXRhLmZyb20gPT09ICdjYXJ0JyB8fCBldmVudC5kYXRhLmZyb20gPT09ICdzeXN0ZW0nIHx8IGV2ZW50LmRhdGEuZnJvbSA9PT0gJ2J1eScgKSB7XG4gICAgICAgICAgICAgICAgYWRkcmVzc2lkJCA9IGF3YWl0IGNsb3VkLmNhbGxGdW5jdGlvbih7XG4gICAgICAgICAgICAgICAgICAgIGRhdGE6IHsgXG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb3BlbklkOiBvcGVuaWQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYWRkcmVzczogZXZlbnQuZGF0YS5vcmRlcnNbIDAgXS5hZGRyZXNzXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgJHVybDogJ2dldEFkZHJlc3NJZCdcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgbmFtZTogJ2FkZHJlc3MnXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIC8vIOiuouWNleadpea6kO+8mui0reeJqei9puOAgeezu+e7n+WKoOWNlVxuICAgICAgICAgICAgaWYgKCggZXZlbnQuZGF0YS5mcm9tID09PSAnY2FydCcgfHwgZXZlbnQuZGF0YS5mcm9tID09PSAnc3lzdGVtJyApICYmIGFkZHJlc3NpZCQucmVzdWx0LnN0YXR1cyAhPT0gMjAwICkge1xuICAgICAgICAgICAgICAgIHRocm93ICfmn6Xor6LlnLDlnYDplJnor68nO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyDlj6/nlKjlnLDlnYBpZFxuICAgICAgICAgICAgY29uc3QgYWlkID0gYWRkcmVzc2lkJC5yZXN1bHQuZGF0YTtcblxuICAgICAgICAgICAgLy8g5piv5ZCm5paw5a6i5oi3XG4gICAgICAgICAgICBjb25zdCBpc05ldyQgPSBhd2FpdCBjbG91ZC5jYWxsRnVuY3Rpb24oe1xuICAgICAgICAgICAgICAgIG5hbWU6ICdjb21tb24nLFxuICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgJHVybDogJ2lzLW5ldy1jdXN0b21lcicsXG4gICAgICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG9wZW5JZDogb3BlbmlkXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KVxuXG4gICAgICAgICAgICBjb25zdCBpc05ldyA9IGlzTmV3JC5yZXN1bHQuZGF0YTtcblxuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiDmlrDlrqIgKyDmlrDlrqLopoHorqLph5EgPSAnMCcsXG4gICAgICAgICAgICAgKiDmlrDlrqIgKyDopoHorqLph5EgPSAnMCcsXG4gICAgICAgICAgICAgKiDmlrDlrqIgKyDlhY3orqLph5EgPSAnMScsXG4gICAgICAgICAgICAgKiDml6flrqIgKyDml6flrqLlhY3orqLph5EgPSAnMScsXG4gICAgICAgICAgICAgKiDml6flrqIgKyDopoHorqLph5EgPSAnMCcsXG4gICAgICAgICAgICAgKiDml6flrqIgKyDlhY3orqLph5EgPSAnMScsXG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIGxldCBwYXlfc3RhdHVzID0gJzAnO1xuICAgICAgICAgICAgY29uc3QgcCA9IHRyaXAucGF5bWVudDtcblxuICAgICAgICAgICAgaWYgKCBpc05ldyAmJiBwID09PSAnMCcgKSB7XG4gICAgICAgICAgICAgICAgcGF5X3N0YXR1cyA9ICcwJ1xuXG4gICAgICAgICAgICB9IGVsc2UgaWYgKCBpc05ldyAmJiBwID09PSAnMScgKSB7XG4gICAgICAgICAgICAgICAgcGF5X3N0YXR1cyA9ICcwJ1xuXG4gICAgICAgICAgICB9IGVsc2UgaWYgKCBpc05ldyAmJiBwID09PSAnMicgKSB7XG4gICAgICAgICAgICAgICAgcGF5X3N0YXR1cyA9ICcxJ1xuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgfSBlbHNlIGlmICggIWlzTmV3ICYmIHAgPT09ICcwJyApIHtcbiAgICAgICAgICAgICAgICBwYXlfc3RhdHVzID0gJzEnXG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICB9IGVsc2UgaWYgKCAhaXNOZXcgJiYgcCA9PT0gJzEnICkge1xuICAgICAgICAgICAgICAgIHBheV9zdGF0dXMgPSAnMCdcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoICFpc05ldyAmJiBwID09PSAnMicgKSB7XG4gICAgICAgICAgICAgICAgcGF5X3N0YXR1cyA9ICcxJ1xuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBwYXlfc3RhdHVzID0gJzAnXG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIDPjgIHmibnph4/liJvlu7rorqLljZXvvIzvvIjov4fmu6TmjonkuI3og73liJvlu7rotK3nianmuIXljZXnmoTllYblk4HvvIlcbiAgICAgICAgICAgIGNvbnN0IHRlbXAgPSBldmVudC5kYXRhLm9yZGVycy5tYXAoIG1ldGEgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IHQgPSBPYmplY3QuYXNzaWduKHsgfSwgbWV0YSwge1xuICAgICAgICAgICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAgICAgICAgICogISBkZWxpdmVyX3N0YXR1c+S4uuacquWPkeW4gyDlj6/og73mnInpl67pophcbiAgICAgICAgICAgICAgICAgICAgICovXG4gICAgICAgICAgICAgICAgICAgIGFpZCxcbiAgICAgICAgICAgICAgICAgICAgaXNPY2N1cGllZDogdHJ1ZSwgLy8g5Y2g6aKG5bqT5a2Y5qCH5b+XXG4gICAgICAgICAgICAgICAgICAgIG9wZW5pZDogb3BlbmlkLFxuICAgICAgICAgICAgICAgICAgICBkZWxpdmVyX3N0YXR1czogJzAnLCBcbiAgICAgICAgICAgICAgICAgICAgYmFzZV9zdGF0dXM6ICcwJyxcbiAgICAgICAgICAgICAgICAgICAgcGF5X3N0YXR1czogIW1ldGEuZGVwb3NpdFByaWNlID8gJzEnIDogcGF5X3N0YXR1cyAsIC8vIOWVhuWTgeiuoumHkemineW6puS4ujBcbiAgICAgICAgICAgICAgICAgICAgY3JlYXRlVGltZTogbmV3IERhdGUoICkuZ2V0VGltZSggKSxcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogISFtZXRhLmRlcG9zaXRQcmljZSA/IG1ldGEudHlwZSA6ICdub3JtYWwnXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgZGVsZXRlIHRbJ2FkZHJlc3MnXTtcbiAgICAgICAgICAgICAgICByZXR1cm4gdDtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAvLyA044CB5om56YeP5Yib5bu66K6i5Y2VICgg5ZCM5pe25aSE55CG5Y2g6aKG6LSn5a2Y55qE6Zeu6aKYIClcbiAgICAgICAgICAgIGNvbnN0IHNhdmUkOiBhbnkgPSBhd2FpdCBQcm9taXNlLmFsbCggdGVtcC5tYXAoIG8gPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiBjcmVhdGUkKCBvcGVuaWQsIG8sIGRiLCBjdHggKTtcbiAgICAgICAgICAgIH0pKTtcbiAgICAgICAgXG4gICAgICAgICAgICBpZiAoIHNhdmUkLnNvbWUoIHggPT4geC5zdGF0dXMgIT09IDIwMCApKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgJ+WIm+W7uuiuouWNlemUmeivr++8gSdcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8g6L+U5Zue6K6i5Y2V5L+h5oGvXG4gICAgICAgICAgICBjb25zdCBvcmRlcl9yZXN1bHQgPSBzYXZlJC5tYXAoKCB4LCBrICkgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IHsgcHJpY2UsIGNvdW50LCBwYXlfc3RhdHVzLCBkZXBvc2l0UHJpY2UgfSA9IHRlbXBbIGsgXTtcbiAgICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgICAgICBvaWQ6IHguZGF0YS5faWQsXG4gICAgICAgICAgICAgICAgICAgIHByaWNlLFxuICAgICAgICAgICAgICAgICAgICBjb3VudCxcbiAgICAgICAgICAgICAgICAgICAgcGF5X3N0YXR1cyxcbiAgICAgICAgICAgICAgICAgICAgZGVwb3NpdFByaWNlXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHJldHVybiBjdHguYm9keSA9IHtcbiAgICAgICAgICAgICAgICBzdGF0dXM6IDIwMCxcbiAgICAgICAgICAgICAgICBkYXRhOiBvcmRlcl9yZXN1bHRcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgfSBjYXRjaCAoIGUgKSB7XG4gICAgIFxuICAgICAgICAgICAgcmV0dXJuIGN0eC5ib2R5ID0ge1xuICAgICAgICAgICAgICAgIHN0YXR1czogNTAwLFxuICAgICAgICAgICAgICAgIG1lc3NhZ2U6IGVcbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgIC8qKlxuICAgICAqIEBkZXNjcmlwdGlvblxuICAgICAqIOWuouaIt+err+afpeivolxuICAgICAqIFxuICAgICAqIOWIhumhtSArIHF1ZXJ5IOafpeivouiuouWNleWIl+ihqO+8iOacquiBmuWQiO+8iVxuICAgICAqIC0tLS0tIOivt+axgiAtLS0tLS1cbiAgICAgKiB7XG4gICAgICohICAgIHRpZDog6KGM56iLaWQg77yI5Y+v5peg77yJXG4gICAgICogICAgIHBhZ2U6IG51bWJlclxuICAgICAqICAgICBza2lwOiBudW1iZXJcbiAgICAgKiAgICAgdHlwZTog5oiR55qE5YWo6YOoIHwg5pyq5LuY5qy+6K6i5Y2VIHwg5b6F5Y+R6LSnIHwg5bey5a6M5oiQIHwg566h55CG5ZGY77yI6KGM56iL6K6i5Y2V77yJfCDnrqHnkIblkZjvvIjmiYDmnInorqLljZXvvIlcbiAgICAgKiAgICAgdHlwZTogbXktYWxsIHwgbXktbm90cGF5IHwgbXktZGVsaXZlciB8IG15LWZpbmlzaCB8IG1hbmFnZXItdHJpcCB8IG1hbmFnZXItYWxsXG4gICAgICogfVxuICAgICAqICEg5pyq5LuY5qy+6K6i5Y2V77yacGF5X3N0YXR1czog5pyq5LuY5qy+L+W3suS7mOiuoumHkSDmiJYgdHlwZTogcHJlXG4gICAgICogISDlvoXlj5HotKfvvJpkZWxpdmVyX3N0YXR1c++8muacquWPkei0pyDkuJQgcGF5X3N0YXR1cyDlt7Lku5jmrL5cbiAgICAgKiAhIOW3suWujOaIkO+8mmRlbGl2ZXJfc3RhdHVz77ya5bey5Y+R6LSnIOS4lCBwYXlfc3RhdHVzIOW3suS7mOWFqOasvlxuICAgICAqL1xuICAgIGFwcC5yb3V0ZXIoJ2xpc3QnLCBhc3luYyggY3R4LCBuZXh0ICkgPT4ge1xuICAgICAgICB0cnkge1xuXG4gICAgICAgICAgICBsZXQgd2hlcmUkID0geyB9O1xuICAgICAgICAgICAgY29uc3QgeyB0eXBlLCB0aWQgfSA9IGV2ZW50LmRhdGE7XG5cbiAgICAgICAgICAgIC8vIOafpeivouadoeaVsFxuICAgICAgICAgICAgY29uc3QgbGltaXQgPSB0aWQgPyA5OSA6IDEwO1xuXG4gICAgICAgICAgICBjb25zdCBvcGVuaWQgPSBldmVudC51c2VySW5mby5vcGVuSWQ7XG5cbiAgICAgICAgICAgIC8vIOaIkeeahOWFqOmDqFxuICAgICAgICAgICAgaWYgKCB0eXBlID09PSAnbXktYWxsJyApIHtcbiAgICAgICAgICAgICAgICB3aGVyZSQgPSB7XG4gICAgICAgICAgICAgICAgICAgIG9wZW5pZDogb3BlbmlkXG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyDmnKrku5jmrL5cbiAgICAgICAgICAgIH0gZWxzZSBpZiAoIHR5cGUgPT09ICdteS1ub3RwYXknICkge1xuICAgICAgICAgICAgICAgIHdoZXJlJCA9IF8uYW5kKHtcbiAgICAgICAgICAgICAgICAgICAgb3BlbmlkLFxuICAgICAgICAgICAgICAgICAgICBiYXNlX3N0YXR1czogJzInXG4gICAgICAgICAgICAgICAgfSwgXy5vcihbXG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6ICdwcmUnXG4gICAgICAgICAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHBheV9zdGF0dXM6IF8ub3IoIF8uZXEoJzAnKSwgXy5lcSgnMScpKVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgXSkpO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICAvLyDmnKrlj5HotKdcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoIHR5cGUgPT09ICdteS1kZWxpdmUnICkge1xuICAgICAgICAgICAgICAgIHdoZXJlJCA9IHtcbiAgICAgICAgICAgICAgICAgICAgb3BlbmlkLFxuICAgICAgICAgICAgICAgICAgICBwYXlfc3RhdHVzOiAnMicsXG4gICAgICAgICAgICAgICAgICAgIGRlbGl2ZXJfc3RhdHVzOiAnMCdcbiAgICAgICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAvLyDlt7LlrozmiJBcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoIHR5cGUgPT09ICdteS1maW5pc2gnICkge1xuICAgICAgICAgICAgICAgIHdoZXJlJCA9IHtcbiAgICAgICAgICAgICAgICAgICAgb3BlbmlkLFxuICAgICAgICAgICAgICAgICAgICBwYXlfc3RhdHVzOiAnMicsXG4gICAgICAgICAgICAgICAgICAgIGRlbGl2ZXJfc3RhdHVzOiAnMSdcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyDooYznqIvorqLljZVcbiAgICAgICAgICAgIGlmICggdGlkICkge1xuICAgICAgICAgICAgICAgIHdoZXJlJCA9IE9iamVjdC5hc3NpZ24oeyB9LCB3aGVyZSQsIHtcbiAgICAgICAgICAgICAgICAgICAgdGlkXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIOiOt+WPluaAu+aVsFxuICAgICAgICAgICAgY29uc3QgdG90YWwkID0gYXdhaXQgZGIuY29sbGVjdGlvbignb3JkZXInKVxuICAgICAgICAgICAgICAgIC53aGVyZSggd2hlcmUkIClcbiAgICAgICAgICAgICAgICAuY291bnQoICk7XG5cbiAgICAgICAgICAgIC8vIOiOt+WPluiuouWNleaVsOaNrlxuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiAhIOWmguaenOaYr+acieaMh+WumnRpZOeahO+8jOWImeS4jemcgOimgWxpbWl05LqG77yM55u05o6l5ouJ5Y+W6KGM56iL5omA5pyJ55qE6K6i5Y2VXG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIGNvbnN0IGRhdGEkID0gYXdhaXQgZGIuY29sbGVjdGlvbignb3JkZXInKVxuICAgICAgICAgICAgICAgIC53aGVyZSggd2hlcmUkIClcbiAgICAgICAgICAgICAgICAub3JkZXJCeSgnY3JlYXRlVGltZScsICdkZXNjJylcbiAgICAgICAgICAgICAgICAubGltaXQoIGxpbWl0IClcbiAgICAgICAgICAgICAgICAuc2tpcCggZXZlbnQuZGF0YS5za2lwIHx8ICggZXZlbnQuZGF0YS5wYWdlIC0gMSApICogbGltaXQgKVxuICAgICAgICAgICAgICAgIC5nZXQoICk7XG5cbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogISDnlLHkuo7mn6Xor6LmmK/mjInliIbpobXvvIzkvYbmmK/mmL7npLrmmK/mjInooYznqIvmnaXogZrlkIjmmL7npLpcbiAgICAgICAgICAgICAqICEg5Zug5q2k5pyJ5Y+v6IO977yMTumhteacgOWQjuS4gOS9je+8jOi3n04rMemhteesrOS4gOS9jeS+neeEtuWxnuS6juWQjOS4gOihjOeoi1xuICAgICAgICAgICAgICogISDlpoLkuI3ov5vooYzlpITnkIbvvIzlrqLmiLfmn6Xor6LorqLljZXliJfooajmmL7npLrooYznqIvorqLljZXml7bvvIzkvJrigJzmnInlj6/og73igJ3mmL7npLrkuI3lhahcbiAgICAgICAgICAgICAqICEg54m55q6K5aSE55CG77ya55So5pyA5ZCO5LiA5L2N55qEdGlk77yM5p+l6K+i5pyA5ZCO5LiA5L2N5Lul5ZCO5ZCMdGlk55qEb3JkZXLvvIznhLblkI7kv67mraPmiYDov5Tlm57nmoRwYWdlXG4gICAgICAgICAgICAgKi9cblxuICAgICAgICAgICAgY29uc3QgbGFzdCA9IGRhdGEkLmRhdGFbIGRhdGEkLmRhdGEubGVuZ3RoIC0gMSBdO1xuXG4gICAgICAgICAgICBsZXQgZml4JDogYW55ID0ge1xuICAgICAgICAgICAgICAgIGRhdGE6IFsgXVxuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgLy8g5aaC5p6c5rKh5pyJdGlk5Y+C5pWw77yM5omN5Y675YGaZml455qE5Yqo5L2cXG4gICAgICAgICAgICBpZiAoIGxhc3QgJiYgIXRpZCApIHsgXG4gICAgICAgICAgICAgICAgZml4JCA9IGF3YWl0IGRiLmNvbGxlY3Rpb24oJ29yZGVyJylcbiAgICAgICAgICAgICAgICAgICAgLndoZXJlKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG9wZW5pZCxcbiAgICAgICAgICAgICAgICAgICAgICAgIHRpZDogbGFzdC50aWRcbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgLm9yZGVyQnkoJ2NyZWF0ZVRpbWUnLCAnZGVzYycpXG4gICAgICAgICAgICAgICAgICAgIC5za2lwKCBldmVudC5kYXRhLnNraXAgPyBldmVudC5kYXRhLnNraXAgKyBkYXRhJC5kYXRhLmxlbmd0aCA6ICggZXZlbnQuZGF0YS5wYWdlIC0gMSApICogbGltaXQgKyBkYXRhJC5kYXRhLmxlbmd0aCApXG4gICAgICAgICAgICAgICAgICAgIC5nZXQoICk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGNvbnN0IG1ldGEgPSBbIC4uLmRhdGEkLmRhdGEsIC4uLmZpeCQuZGF0YSBdO1xuXG4gICAgICAgICAgICAvLyDov5nph4znmoTooYznqIvor6bmg4XnlKggbmV3IFNldOeahOaWueW8j+afpeivolxuICAgICAgICAgICAgY29uc3QgdHJpcElkcyA9IEFycmF5LmZyb20oXG4gICAgICAgICAgICAgICAgbmV3IFNldCggbWV0YS5tYXAoIG0gPT4gbS50aWQgKSlcbiAgICAgICAgICAgICk7XG5cbiAgICAgICAgICAgIGNvbnN0IHRyaXBzJCA9IGF3YWl0IFByb21pc2UuYWxsKCB0cmlwSWRzLm1hcCggdGlkID0+IHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZGIuY29sbGVjdGlvbigndHJpcCcpXG4gICAgICAgICAgICAgICAgICAgIC53aGVyZSh7XG4gICAgICAgICAgICAgICAgICAgICAgICBfaWQ6IHRpZFxuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAuZ2V0KCApO1xuICAgICAgICAgICAgfSkpO1xuICAgICBcbiAgICAgICAgICAgIC8vIOiBmuWQiOihjOeoi+aVsOaNrlxuICAgICAgICAgICAgY29uc3QgbWV0YTIgPSBtZXRhLm1hcCgoIHgsIGkgKSA9PiBPYmplY3QuYXNzaWduKHsgfSwgeCwge1xuICAgICAgICAgICAgICAgIC8vIHRyaXA6IHRyaXBzJFsgaSBdLmRhdGFbIDAgXVxuICAgICAgICAgICAgICAgIHRyaXA6ICh0cmlwcyQuZmluZCggeSA9PiB5LmRhdGFbIDAgXS5faWQgPT09IHgudGlkICkgYXMgYW55KS5kYXRhWyAwIF1cbiAgICAgICAgICAgIH0pKTtcblxuICAgICAgICAgICAgcmV0dXJuIGN0eC5ib2R5ID0ge1xuICAgICAgICAgICAgICAgIHN0YXR1czogMjAwLFxuICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgZGF0YTogbWV0YTIsXG4gICAgICAgICAgICAgICAgICAgIHBhZ2VTaXplOiBsaW1pdCxcbiAgICAgICAgICAgICAgICAgICAgdG90YWw6IHRvdGFsJC50b3RhbCxcbiAgICAgICAgICAgICAgICAgICAgcGFnZTogZml4JC5kYXRhLmxlbmd0aCA9PT0gMCA/IGV2ZW50LmRhdGEucGFnZSA6IGV2ZW50LmRhdGEucGFnZSArIE1hdGguY2VpbCggZml4JC5kYXRhLmxlbmd0aCAvIGxpbWl0ICksXG4gICAgICAgICAgICAgICAgICAgIGN1cnJlbnQ6IGV2ZW50LmRhdGEuc2tpcCA/IGV2ZW50LmRhdGEuc2tpcCArIG1ldGEubGVuZ3RoIDogKCBldmVudC5kYXRhLnBhZ2UgLSAxICkgKiBsaW1pdCArIG1ldGEubGVuZ3RoLFxuICAgICAgICAgICAgICAgICAgICB0b3RhbFBhZ2U6IE1hdGguY2VpbCggdG90YWwkLnRvdGFsIC8gbGltaXQgKVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIFxuICAgICAgICB9IGNhdGNoICggZSApIHsgcmV0dXJuIGN0eC5ib2R5ID0geyBzdGF0dXM6IDUwMH07fVxuICAgIH0pXG5cbiAgICAvKipcbiAgICAgKiDmibnph4/mm7TmlrDvvIzorqLljZXkuLrlt7LmlK/ku5jvvIzlubbkuJTlop7liqDliLDotK3nianmuIXljZVcbiAgICAgKiBvcmRlcklkczogXCIxMjMsMjM0LDM0NVwiXG4gICAgICogZm9ybV9pZCxcbiAgICAgKiBwcmVwYXlfaWRcbiAgICAgKi9cbiAgICBhcHAucm91dGVyKCd1cGFkdGUtdG8tcGF5ZWQnLCBhc3luYyggY3R4LCBuZXh0ICkgPT4ge1xuICAgICAgICB0cnkge1xuXG4gICAgICAgICAgICBjb25zdCBvcGVuSWQgPSBldmVudC51c2VySW5mby5vcGVuSWQ7XG4gICAgICAgICAgICBjb25zdCB7IG9yZGVySWRzLCBwcmVwYXlfaWQsIGZvcm1faWQgfSA9IGV2ZW50LmRhdGE7XG5cbiAgICAgICAgICAgIC8vIOabtOaWsOiuouWNleWtl+autVxuICAgICAgICAgICAgYXdhaXQgUHJvbWlzZS5hbGwoIG9yZGVySWRzLnNwbGl0KCcsJykubWFwKCBvaWQgPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiBkYi5jb2xsZWN0aW9uKCdvcmRlcicpLmRvYyggb2lkIClcbiAgICAgICAgICAgICAgICAgICAgLnVwZGF0ZSh7XG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9ybV9pZCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcmVwYXlfaWQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcGF5X3N0YXR1czogJzEnXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSkpO1xuXG4gICAgICAgICAgICAvLyDliJvlu7ov5o+S5YWl5Yiw6LSt54mp5riF5Y2VXG4gICAgICAgICAgICBjb25zdCBmaW5kJDogYW55ID0gYXdhaXQgUHJvbWlzZS5hbGwoIG9yZGVySWRzLnNwbGl0KCcsJykubWFwKCBvaWQgPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiBkYi5jb2xsZWN0aW9uKCdvcmRlcicpXG4gICAgICAgICAgICAgICAgICAgIC53aGVyZSh7XG4gICAgICAgICAgICAgICAgICAgICAgICBfaWQ6IG9pZFxuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAuZ2V0KCApO1xuICAgICAgICAgICAgfSkpO1xuXG4gICAgICAgICAgICBjb25zdCBsaXN0ID0gZmluZCQubWFwKCB4ID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCB7IF9pZCwgdGlkLCBwaWQsIHNpZCwgcHJpY2UsIGdyb3VwUHJpY2UsIGFjaWQgfSA9IHguZGF0YVsgMCBdO1xuICAgICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgICAgIG9pZDogX2lkLFxuICAgICAgICAgICAgICAgICAgICBhY2lkLCBncm91cFByaWNlLFxuICAgICAgICAgICAgICAgICAgICB0aWQsIHBpZCwgc2lkLCBwcmljZVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAvLyDov5nph4zmnKzmnaXkuI3pnIDopoHlkIzmraXnrYnlvoXotK3nianmuIXljZXnmoTliJvlu7rvvIzkvYbmmK/kuI3liqBhd2FpdOiyjOS8vOayoeacieiiq+aJp+ihjOWIsFxuICAgICAgICAgICAgYXdhaXQgY2xvdWQuY2FsbEZ1bmN0aW9uKHtcbiAgICAgICAgICAgICAgICBuYW1lOiAnc2hvcHBpbmctbGlzdCcsXG4gICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgICAkdXJsOiAnY3JlYXRlJyxcbiAgICAgICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgICAgICAgbGlzdCxcbiAgICAgICAgICAgICAgICAgICAgICAgIG9wZW5JZFxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSlcblxuICAgICAgICAgICAgcmV0dXJuIGN0eC5ib2R5ID0ge1xuICAgICAgICAgICAgICAgIHN0YXR1czogMjAwXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfSBjYXRjaCAoIGUgKSB7IFxuICAgICAgICAgICAgcmV0dXJuIGN0eC5ib2R5ID0geyBzdGF0dXM6IDUwMCB9O1xuICAgICAgICB9IFxuICAgIH0pXG5cbiAgICAvKiogXG4gICAgICogQGRlc2NyaXB0aW9uXG4gICAgICog5Luj6LSt5riF5biQ5YKs5qy+55qE6K6i5Y2V5YiX6KGoXG4gICAgICoge1xuICAgICAqICAgICB0aWQgXG4gICAgICogICAgIG5lZWRDb3Vwb25zOiBmYWxzZSB8IHRydWUgfCB1bmRlZmluZWRcbiAgICAgKiAgICAgbmVlZEFkZHJlc3M6IGZhbHNlIHwgdHJ1ZSB8IHVuZGVmaW5lZFxuICAgICAqIH1cbiAgICAgKi9cbiAgICBhcHAucm91dGVyKCdkYWlnb3UtbGlzdCcsIGFzeW5jKCBjdHgsIG5leHQgKSA9PiB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBjb25zdCB7IHRpZCwgbmVlZENvdXBvbnMsIG5lZWRBZGRyZXNzIH0gPSBldmVudC5kYXRhO1xuICAgICAgICAgICAgY29uc3Qgb3JkZXJzJCA9IGF3YWl0IGRiLmNvbGxlY3Rpb24oJ29yZGVyJylcbiAgICAgICAgICAgICAgICAud2hlcmUoe1xuICAgICAgICAgICAgICAgICAgICB0aWQsXG4gICAgICAgICAgICAgICAgICAgIHBheV9zdGF0dXM6IF8ub3IoIF8uZXEoJzEnKSwgXy5lcSgnMicpKVxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLmdldCggKTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgLy8g55So5oi35L+h5oGvXG4gICAgICAgICAgICBjb25zdCB1c2VycyQgPSBhd2FpdCBQcm9taXNlLmFsbChcbiAgICAgICAgICAgICAgICBBcnJheS5mcm9tKCBcbiAgICAgICAgICAgICAgICAgICAgbmV3IFNldCggb3JkZXJzJC5kYXRhXG4gICAgICAgICAgICAgICAgICAgICAgICAubWFwKCB4ID0+IHgub3BlbmlkIClcbiAgICAgICAgICAgICAgICApKVxuICAgICAgICAgICAgICAgIC5tYXAoIHVpZCA9PiBkYi5jb2xsZWN0aW9uKCd1c2VyJylcbiAgICAgICAgICAgICAgICAgICAgLndoZXJlKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG9wZW5pZDogdWlkXG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgIC5nZXQoICkpXG4gICAgICAgICAgICApO1xuXG4gICAgICAgICAgICAvLyDlnLDlnYDkv6Hmga9cbiAgICAgICAgICAgIGxldCBhZGRyZXNzJDogYW55ID0gWyBdO1xuICAgICAgICAgICAgaWYgKCAhIW5lZWRBZGRyZXNzIHx8IG5lZWRBZGRyZXNzID09PSB1bmRlZmluZWQgKSB7XG4gICAgICAgICAgICAgICAgYWRkcmVzcyQgPSBhd2FpdCBQcm9taXNlLmFsbChcbiAgICAgICAgICAgICAgICAgICAgQXJyYXkuZnJvbShcbiAgICAgICAgICAgICAgICAgICAgICAgIG5ldyBTZXQoIG9yZGVycyQuZGF0YVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5tYXAoIHggPT4geC5haWQgKVxuICAgICAgICAgICAgICAgICAgICApKVxuICAgICAgICAgICAgICAgICAgICAubWFwKCBhaWQgPT4gZGIuY29sbGVjdGlvbignYWRkcmVzcycpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5kb2MoIGFpZCApXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5nZXQoICkpXG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIFxuICAgICAgICAgICAgLy8g5Y2h5Yi45L+h5oGvXG4gICAgICAgICAgICBsZXQgY291cG9ucyQ6IGFueSA9IFsgXTtcbiAgICAgICAgICAgIGlmICggISFuZWVkQ291cG9ucyB8fCBuZWVkQ291cG9ucyA9PT0gdW5kZWZpbmVkICkge1xuICAgICAgICAgICAgICAgIGNvdXBvbnMkID0gYXdhaXQgUHJvbWlzZS5hbGwoXG4gICAgICAgICAgICAgICAgICAgIEFycmF5LmZyb20oXG4gICAgICAgICAgICAgICAgICAgICAgICBuZXcgU2V0KCBvcmRlcnMkLmRhdGEgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLm1hcCggeCA9PiB4Lm9wZW5pZCApXG4gICAgICAgICAgICAgICAgICAgICkpXG4gICAgICAgICAgICAgICAgICAgIC5tYXAoIG9wZW5pZCA9PiBkYi5jb2xsZWN0aW9uKCdjb3Vwb24nKVxuICAgICAgICAgICAgICAgICAgICAgICAgLndoZXJlKCBfLm9yKFtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRpZCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb3BlbmlkLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiBfLm9yKCBfLmVxKCd0X21hbmppYW4nKSwgXy5lcSgndF9saWppYW4nKSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9wZW5pZCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaXNVc2VkOiBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FuVXNlSW5OZXh0OiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiAndF9kYWlqaW4nXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgXSkpXG4gICAgICAgICAgICAgICAgICAgICAgICAuZ2V0KCApXG4gICAgICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgXG5cbiAgICAgICAgICAgIGNvbnN0IHVzZXJPZGVycyA9IHVzZXJzJC5tYXAoIHVzZXIkID0+IHtcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICBjb25zdCB1c2VyID0gdXNlciQuZGF0YVsgMCBdO1xuXG4gICAgICAgICAgICAgICAgY29uc3Qgb3JkZXJzID0gb3JkZXJzJC5kYXRhXG4gICAgICAgICAgICAgICAgICAgIC5maWx0ZXIoIHggPT4geC5vcGVuaWQgPT09IHVzZXIub3BlbmlkICk7XG5cbiAgICAgICAgICAgICAgICBjb25zdCBhZGRyZXNzID0gYWRkcmVzcyQubGVuZ3RoID4gMCA/XG4gICAgICAgICAgICAgICAgICAgIGFkZHJlc3MkXG4gICAgICAgICAgICAgICAgICAgICAgICAubWFwKCB4ID0+IHguZGF0YSApXG4gICAgICAgICAgICAgICAgICAgICAgICAuZmlsdGVyKCB4ID0+IHgub3BlbmlkID09PSB1c2VyLm9wZW5pZCApIDpcbiAgICAgICAgICAgICAgICAgICAgdW5kZWZpbmVkO1xuXG4gICAgICAgICAgICAgICAgY29uc3QgY291cG9ucyA9IGNvdXBvbnMkLmxlbmd0aCA+IDAgP1xuICAgICAgICAgICAgICAgICAgICBjb3Vwb25zJFxuICAgICAgICAgICAgICAgICAgICAgICAgLm1hcCggeCA9PiB4LmRhdGEgKVxuICAgICAgICAgICAgICAgICAgICAgICAgLmZpbHRlciggeCA9PiB4Lmxlbmd0aCA+IDAgJiYgeFsgMCBdLm9wZW5pZCA9PT0gdXNlci5vcGVuaWQgKSA6XG4gICAgICAgICAgICAgICAgICAgIHVuZGVmaW5lZDtcblxuICAgICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgICAgIHVzZXIsXG4gICAgICAgICAgICAgICAgICAgIG9yZGVycyxcbiAgICAgICAgICAgICAgICAgICAgYWRkcmVzcyxcbiAgICAgICAgICAgICAgICAgICAgY291cG9uczogKCEhY291cG9ucyAmJiBjb3Vwb25zLmxlbmd0aCA+IDAgKSA/IGNvdXBvbnNbIDAgXSA6IFsgXVxuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgcmV0dXJuIGN0eC5ib2R5ID0ge1xuICAgICAgICAgICAgICAgIHN0YXR1czogMjAwLFxuICAgICAgICAgICAgICAgIGRhdGE6IHVzZXJPZGVyc1xuICAgICAgICAgICAgfVxuXG4gICAgICAgIH0gY2F0Y2ggKCBlICkge1xuICAgICAgICAgICAgY29uc29sZS5sb2coICcuLi4nLCBlICk7XG4gICAgICAgICAgICByZXR1cm4gY3R4LmJvZHkgPSB7IHN0YXR1czogNTAwIH07XG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgIC8qKlxuICAgICAqIEBkZXNjcmlwdGlvblxuICAgICAqIOS7jua4heW4kOWCrOasvu+8jOiwg+aVtOiuouWNleWIhumFjemHj1xuICAgICAqIHtcbiAgICAgKiAgICAgIG9pZCwgdGlkLCBzaWQsIHBpZCwgY291bnRcbiAgICAgKiB9XG4gICAgICovXG4gICAgYXBwLnJvdXRlcignYWRqdXN0LWNvdW50JywgYXN5bmMoIGN0eCwgbmV4dCApID0+IHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGNvbnN0IG9wZW5pZCA9IGV2ZW50LmRhdGEub3BlbklkIHx8IGV2ZW50LnVzZXJJbmZvLm9wZW5JZDsgXG4gICAgICAgICAgICBjb25zdCB7IG9pZCwgdGlkLCBzaWQsIHBpZCwgY291bnQgfSA9IGV2ZW50LmRhdGE7XG5cbiAgICAgICAgICAgIGNvbnN0IGdldFdyb25nID0gbWVzc2FnZSA9PiBjdHguYm9keSA9IHtcbiAgICAgICAgICAgICAgICBtZXNzYWdlLFxuICAgICAgICAgICAgICAgIHN0YXR1czogNDAwXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICog5piv5ZCm6IO957un57ut6LCD5pW0XG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIGNvbnN0IG9yZGVyJCA9IGF3YWl0IGRiLmNvbGxlY3Rpb24oJ29yZGVyJylcbiAgICAgICAgICAgICAgICAuZG9jKCBvaWQgKVxuICAgICAgICAgICAgICAgIC5nZXQoICk7XG5cbiAgICAgICAgICAgIGlmICggb3JkZXIkLmRhdGEuYmFzZV9zdGF0dXMgPT09ICcyJyApIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZ2V0V3JvbmcoJ+WCrOasvuWQjuS4jeiDveS/ruaUueaVsOmHjycpO1xuXG4gICAgICAgICAgICB9IGVsc2UgaWYgKCBvcmRlciQuZGF0YS5iYXNlX3N0YXR1cyA9PT0gJzAnICkge1xuICAgICAgICAgICAgICAgIHJldHVybiBnZXRXcm9uZygn6K+35YWI6LCD5pW06K+l5ZWG5ZOB5Lu35qC8Jyk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICog5LiN6IO95aSa5LqO5riF5Y2V5YiG6YWN55qE5oC76LSt5YWl6YePXG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIGNvbnN0IHNob3BwaW5nJCA9IGF3YWl0IGRiLmNvbGxlY3Rpb24oJ3Nob3BwaW5nLWxpc3QnKVxuICAgICAgICAgICAgICAgIC53aGVyZSh7XG4gICAgICAgICAgICAgICAgICAgIHRpZCwgc2lkLCBwaWRcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIC5nZXQoICk7XG4gICAgICAgICAgICBjb25zdCBzaG9wcGluZyA9IHNob3BwaW5nJC5kYXRhWyAwIF07XG4gICAgICAgICAgICBjb25zdCBsYXN0T3JkZXJzJCA9IGF3YWl0IGRiLmNvbGxlY3Rpb24oJ29yZGVyJylcbiAgICAgICAgICAgICAgICAud2hlcmUoe1xuICAgICAgICAgICAgICAgICAgICB0aWQsIHNpZCwgcGlkLFxuICAgICAgICAgICAgICAgICAgICBwYXlfc3RhdHVzOiBfLm5lcSgnMCcpLFxuICAgICAgICAgICAgICAgICAgICBiYXNlX3N0YXR1czogXy5vciggXy5lcSgnMScpLCBfLmVxKCcyJyksIF8uZXEoJzMnKSlcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIC5nZXQoICk7XG5cbiAgICAgICAgICAgIGNvbnN0IGxhc3RPcmRlcnMgPSBsYXN0T3JkZXJzJC5kYXRhO1xuICAgICAgICAgICAgY29uc3Qgb3RoZXJDb3VudDogYW55ID0gbGFzdE9yZGVyc1xuICAgICAgICAgICAgICAgIC5maWx0ZXIoIG8gPT4gby5faWQgIT09IG9pZCApXG4gICAgICAgICAgICAgICAgLnJlZHVjZSgoIHgsIHkgKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB4ICsgeS5hbGxvY2F0ZWRDb3VudCB8fCAwXG4gICAgICAgICAgICAgICAgfSwgMCApO1xuXG4gICAgICAgICAgICBpZiAoIGNvdW50ICsgb3RoZXJDb3VudCA+IHNob3BwaW5nLnB1cmNoYXNlICkge1xuICAgICAgICAgICAgICAgIHJldHVybiBnZXRXcm9uZyhg6K+l5ZWG5ZOB5oC75pWw6YeP5LiN6IO95aSn5LqO6YeH6LSt5pWwJHtzaG9wcGluZy5wdXJjaGFzZX3ku7bvvIFgKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLyoqIOabtOaWsOiuouWNlSAqL1xuICAgICAgICAgICAgYXdhaXQgZGIuY29sbGVjdGlvbignb3JkZXInKVxuICAgICAgICAgICAgICAgIC5kb2MoIG9pZCApXG4gICAgICAgICAgICAgICAgLnVwZGF0ZSh7XG4gICAgICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGFsbG9jYXRlZENvdW50OiBjb3VudFxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICog5pu05paw5riF5Y2VXG4gICAgICAgICAgICAgKiDlsJHkuo7mgLvotK3lhaXph4/ml7bvvIzph43mlrDosIPmlbTmuIXljZXnmoTliankvZnliIbphY3ph49cbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgaWYgKCBjb3VudCArIG90aGVyQ291bnQgPCBzaG9wcGluZy5wdXJjaGFzZSApIHtcblxuICAgICAgICAgICAgICAgIGNvbnN0IG5ld3Nob3BwaW5nID0gT2JqZWN0LmFzc2lnbih7IH0sIHNob3BwaW5nLCB7XG4gICAgICAgICAgICAgICAgICAgIGxhc3RBbGxvY2F0ZWQ6IHNob3BwaW5nLnB1cmNoYXNlIC0gKCBjb3VudCArIG90aGVyQ291bnQgKVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIGRlbGV0ZSBuZXdzaG9wcGluZ1snX2lkJ107XG5cbiAgICAgICAgICAgICAgICBhd2FpdCBkYi5jb2xsZWN0aW9uKCdzaG9wcGluZy1saXN0JylcbiAgICAgICAgICAgICAgICAgICAgLmRvYyggU3RyaW5nKCBzaG9wcGluZy5faWQgKSlcbiAgICAgICAgICAgICAgICAgICAgLnNldCh7XG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRhOiBuZXdzaG9wcGluZ1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIGN0eC5ib2R5ID0ge1xuICAgICAgICAgICAgICAgIHN0YXR1czogMjAwXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBcbiAgICAgICAgfSBjYXRjaCAoIGUgKSB7XG4gICAgICAgICAgICByZXR1cm4gY3R4LmJvZHkgPSB7IHN0YXR1czogNTAwIH1cbiAgICAgICAgfVxuICAgIH0pXG5cbiAgICAvKipcbiAgICAgKiBAZGVzY3JpcHRpb25cbiAgICAgKiDmibnph4/lnLDvvJrnoa7orqTlrqLmiLforqLljZXjgIHmmK/lkKblm6LotK3jgIHmtojmga/mjqjpgIHmk43kvZxcbiAgICAgKiB7XG4gICAgICogICAgdGlkLFxuICAgICAqICAgIG9yZGVyczoge1xuICAgICAqICAgICAgICBvaWRcbiAgICAgKiAgICAgICAgcGlkXG4gICAgICogICAgICAgIHNpZFxuICAgICAqICAgICAgICBvcGVuaWRcbiAgICAgKiAgICAgICAgcHJlcGF5X2lkXG4gICAgICogICAgICAgIGZvcm1faWRcbiAgICAgKiAgICAgICAgYWxsb2NhdGVkQ291bnRcbiAgICAgKiAgICAgICAgYWxsb2NhdGVkR3JvdXBQcmljZVxuICAgICAqICAgIH1bIF1cbiAgICAgKiAgICBub3RpZmljYXRpb246IHsgXG4gICAgICogICAgICAgdGl0bGUsXG4gICAgICogICAgICAgZGVzYyxcbiAgICAgKiAgICAgICB0aW1lXG4gICAgICogICAgfVxuICAgICAqIH1cbiAgICAgKi9cbiAgICBhcHAucm91dGVyKCdiYXRjaC1hZGp1c3QnLCBhc3luYyggY3R4LCBuZXh0ICkgPT4ge1xuICAgICAgICB0cnkge1xuXG4gICAgICAgICAgICAvKiog5piv5ZCm6IO95ou85ZuiICovXG4gICAgICAgICAgICBsZXQgY2FuR3JvdXBVc2VyTWFwQ291bnQ6IHtcbiAgICAgICAgICAgICAgICBbIGs6IHN0cmluZyBdIDogbnVtYmVyXG4gICAgICAgICAgICB9ID0geyB9O1xuXG4gICAgICAgICAgICBjb25zdCB7IHRpZCwgb3JkZXJzLCBub3RpZmljYXRpb24gfSA9IGV2ZW50LmRhdGE7XG4gICAgICAgICAgICBjb25zdCBnZXRXcm9uZyA9IG1lc3NhZ2UgPT4gY3R4LmJvZHkgPSB7XG4gICAgICAgICAgICAgICAgbWVzc2FnZSxcbiAgICAgICAgICAgICAgICBzdGF0dXM6IDQwMFxuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgY29uc3QgdHJpcCQgPSBhd2FpdCBkYi5jb2xsZWN0aW9uKCd0cmlwJylcbiAgICAgICAgICAgICAgICAuZG9jKCB0aWQgKVxuICAgICAgICAgICAgICAgIC5nZXQoICk7XG4gICAgICAgICAgICBjb25zdCB0cmlwID0gdHJpcCQuZGF0YTtcblxuICAgICAgICAgICAgLy8g5pyq57uT5p2f77yM5LiU5pyq5omL5Yqo5YWz6ZetXG4gICAgICAgICAgICBpZiAoIG5ldyBEYXRlKCApLmdldFRpbWUoICkgPCB0cmlwLmVuZF9kYXRlICYmICF0cmlwLmlzQ2xvc2VkICkge1xuICAgICAgICAgICAgICAgIHJldHVybiBnZXRXcm9uZygn6KGM56iL5pyq57uT5p2f77yM6K+35omL5Yqo5YWz6Zet5b2T5YmN6KGM56iLJyk7XG5cbiAgICAgICAgICAgIH0gZWxzZSBpZiAoIHRyaXAuY2FsbE1vbmV5VGltZXMgJiYgIHRyaXAuY2FsbE1vbmV5VGltZXMgPj0gMyApIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZ2V0V3JvbmcoYOW3sue7j+WPkei1t+i/hyR7dHJpcC5jYWxsTW9uZXlUaW1lc33mrKHlgqzmrL5gKTtcblxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyDmm7TmlrDorqLljZVcbiAgICAgICAgICAgIGF3YWl0IFByb21pc2UuYWxsKCBvcmRlcnMubWFwKCBvcmRlciA9PiB7XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgLy8g5pyJ5Zui6LSt5Lu344CB5aSn5LqOMuS6uui0reS5sO+8jOS4lOiiq+WIhumFjeaVsOWdh+Wkp+S6jjDvvIzor6XorqLljZXmiY3ovr7liLDigJzlm6LotK3igJ3nmoTmnaHku7ZcbiAgICAgICAgICAgICAgICBjb25zdCBjYW5Hcm91cCA9ICEhb3JkZXJzLmZpbmQoIG8gPT4ge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gby5vaWQgIT09IG9yZGVyLm9pZCAmJlxuICAgICAgICAgICAgICAgICAgICAgICAgby5vcGVuaWQgIT09IG9yZGVyLm9wZW5pZCAmJiBcbiAgICAgICAgICAgICAgICAgICAgICAgIG8ucGlkID09PSBvcmRlci5waWQgJiYgby5zaWQgPT09IG9yZGVyLnNpZCAmJlxuICAgICAgICAgICAgICAgICAgICAgICAgby5hbGxvY2F0ZWRDb3VudCA+IDAgJiYgb3JkZXIuYWxsb2NhdGVkQ291bnQgPiAwICYmXG4gICAgICAgICAgICAgICAgICAgICAgICAhIW8uYWxsb2NhdGVkR3JvdXBQcmljZVxuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgaWYgKCBjYW5Hcm91cCApIHtcbiAgICAgICAgICAgICAgICAgICAgY2FuR3JvdXBVc2VyTWFwQ291bnQgPSBPYmplY3QuYXNzaWduKHsgfSwgY2FuR3JvdXBVc2VyTWFwQ291bnQsIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIFsgb3JkZXIub3BlbmlkIF06IGNhbkdyb3VwVXNlck1hcENvdW50WyBvcmRlci5vcGVuaWQgXSA9PT0gdW5kZWZpbmVkID8gMSA6IGNhbkdyb3VwVXNlck1hcENvdW50WyBvcmRlci5vcGVuaWQgXSArIDFcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgcmV0dXJuIGRiLmNvbGxlY3Rpb24oJ29yZGVyJylcbiAgICAgICAgICAgICAgICAgICAgLmRvYyggb3JkZXIub2lkIClcbiAgICAgICAgICAgICAgICAgICAgLnVwZGF0ZSh7XG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FuR3JvdXAsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYmFzZV9zdGF0dXM6ICcyJ1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgfSkpO1xuXG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqICHmm7TmlrDotK3nianmuIXljZVcbiAgICAgICAgICAgICAqL1xuXG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIOa2iOaBr+aOqOmAgVxuICAgICAgICAgICAgICogIeacquS7mOWFqOasvuaJjeWPkemAgVxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICBjb25zdCB1c2VycyA9IEFycmF5LmZyb20oXG4gICAgICAgICAgICAgICAgbmV3IFNldChcbiAgICAgICAgICAgICAgICAgICAgb3JkZXJzXG4gICAgICAgICAgICAgICAgICAgICAgICAubWFwKCBvcmRlciA9PiBvcmRlci5vcGVuaWQgKVxuICAgICAgICAgICAgICAgICAgICAgICAgLmZpbHRlciggb3BlbmlkID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gISFvcmRlcnMuZmluZCggb3JkZXIgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gb3JkZXIub3BlbmlkID09PSBvcGVuaWQgJiYgU3RyaW5nKCBvcmRlci5wYXlfc3RhdHVzICkgPT09ICcxJ1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICApO1xuXG4gICAgICAgICAgICAvKiog5o6o6YCB6YCa55+lICovXG4gICAgICAgICAgICBjb25zdCBycyA9IGF3YWl0IFByb21pc2UuYWxsKCB1c2Vycy5tYXAoIG9wZW5pZCA9PiB7XG5cbiAgICAgICAgICAgICAgICBjb25zdCB0YXJnZXQgPSBvcmRlcnMuZmluZCggb3JkZXIgPT4gb3JkZXIub3BlbmlkID09PSBvcGVuaWQgJiZcbiAgICAgICAgICAgICAgICAgICAgKCEhb3JkZXIucHJlcGF5X2lkIHx8ICEhb3JkZXIuZm9ybV9pZCApKTtcblxuICAgICAgICAgICAgICAgIHJldHVybiBjbG91ZC5jYWxsRnVuY3Rpb24oe1xuICAgICAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdG91c2VyOiBvcGVuaWQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aXRsZTogY2FuR3JvdXBVc2VyTWFwQ291bnRbIFN0cmluZyggb3BlbmlkICldID9cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGDmi7zlm6IkeyBjYW5Hcm91cFVzZXJNYXBDb3VudFsgU3RyaW5nKCBvcGVuaWQgKV195Lu277yB5oKo6LSt5Lmw55qE5ZWG5ZOB5bey5Yiw6LSnYCA6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAn5oKo6LSt5Lmw55qE5ZWG5ZOB5bey5Yiw6LSnJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGltZTogYFvooYznqItdJHt0cmlwLnRpdGxlfWBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvcm1faWQ6IHRhcmdldC5wcmVwYXlfaWQgfHwgdGFyZ2V0LmZvcm1faWRcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAkdXJsOiAnbm90aWZpY2F0aW9uLWdldG1vbmV5J1xuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICBuYW1lOiAnY29tbW9uJ1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICB9KSk7XG4gXG4gICAgICAgICAgICAvLyDmm7TmlrDooYznqItcbiAgICAgICAgICAgIGF3YWl0IGRiLmNvbGxlY3Rpb24oJ3RyaXAnKVxuICAgICAgICAgICAgICAgIC5kb2MoIHRpZCApXG4gICAgICAgICAgICAgICAgLnVwZGF0ZSh7XG4gICAgICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhbGxNb25leVRpbWVzOiBfLmluYyggMSApXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgcmV0dXJuIGN0eC5ib2R5ID0ge1xuICAgICAgICAgICAgICAgIHN0YXR1czogMjAwLFxuICAgICAgICAgICAgICAgIC8vIOWJqeS9measoeaVsFxuICAgICAgICAgICAgICAgIGRhdGE6IDMgLSAoIDEgKyB0cmlwLmNhbGxNb25leVRpbWVzIClcbiAgICAgICAgICAgIH1cblxuICAgICAgICB9IGNhdGNoICggZSApIHtcbiAgICAgICAgICAgIHJldHVybiBjdHguYm9keSA9IHsgc3RhdHVzOiA1MDAgfTtcbiAgICAgICAgfVxuICAgIH0pXG5cbiAgICAvKiogXG4gICAgICogQGRlc2NyaXB0aW9uXG4gICAgICog6K6i5Y2V5LuY5bC+5qy+XG4gICAgICoge1xuICAgICAqICAgICAgdGlkIC8vIOmihuS7o+mHkeWIuFxuICAgICAqICAgICAgaW50ZWdyYWwgLy8g56ev5YiG5oC76aKd77yIdXNlcuihqO+8iVxuICAgICAqICAgICAgb3JkZXJzOiBbeyAgXG4gICAgICogICAgICAgICAgb2lkIC8vIOiuouWNleeKtuaAgVxuICAgICAqICAgICAgICAgIHBpZFxuICAgICAqICAgICAgICAgIGZpbmFsX3ByaWNlIC8vIOacgOe7iOaIkOS6pOminVxuICAgICAqICAgICAgICAgIGFsbG9jYXRlZENvdW50IC8vIOacgOe7iOaIkOS6pOmHj1xuICAgICAqICAgICAgfV1cbiAgICAgKiAgICAgIGNvdXBvbnM6IFsgLy8g5Y2h5Yi45raI6LS5XG4gICAgICogICAgICAgICAgaWQxLFxuICAgICAqICAgICAgICAgIGlkMi4uLlxuICAgICAqICAgICAgXVxuICAgICAqIH1cbiAgICAgKi9cbiAgICBhcHAucm91dGVyKCdwYXktbGFzdCcsIGFzeW5jKCBjdHgsIG5leHQgKSA9PiB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBjb25zdCBvcGVuaWQgPSBldmVudC51c2VySW5mby5vcGVuSWQ7XG4gICAgICAgICAgICBjb25zdCB7IHRpZCwgaW50ZWdyYWwsIG9yZGVycywgY291cG9ucyB9ID0gZXZlbnQuZGF0YTtcblxuICAgICAgICAgICAgY29uc3QgdXNlciQgPSBhd2FpdCBkYi5jb2xsZWN0aW9uKCd1c2VyJylcbiAgICAgICAgICAgICAgICAud2hlcmUoe1xuICAgICAgICAgICAgICAgICAgICBvcGVuaWRcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIC5nZXQoICk7XG5cbiAgICAgICAgICAgIC8vIOWinuWKoOenr+WIhuaAu+minVxuICAgICAgICAgICAgYXdhaXQgZGIuY29sbGVjdGlvbigndXNlcicpXG4gICAgICAgICAgICAgICAgLmRvYyggU3RyaW5nKCB1c2VyJC5kYXRhWyAwIF0uX2lkICkpXG4gICAgICAgICAgICAgICAgLnVwZGF0ZSh7XG4gICAgICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGludGVncmFsOiBfLmluYyggaW50ZWdyYWwgKVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIC8vIOabtOaWsOiuouWNleeKtuaAgeOAgeWVhuWTgemUgOmHj1xuICAgICAgICAgICAgYXdhaXQgUHJvbWlzZS5hbGwoIG9yZGVycy5tYXAoIG9yZGVyID0+IHtcbiAgICAgICAgICAgICAgICByZXR1cm4gUHJvbWlzZS5hbGwoW1xuICAgICAgICAgICAgICAgICAgICBkYi5jb2xsZWN0aW9uKCdvcmRlcicpXG4gICAgICAgICAgICAgICAgICAgICAgICAuZG9jKCBvcmRlci5vaWQgKVxuICAgICAgICAgICAgICAgICAgICAgICAgLnVwZGF0ZSh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBiYXNlX3N0YXR1czogJzMnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXlfc3RhdHVzOiAnMicsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZpbmFsX3ByaWNlOiBvcmRlci5maW5hbF9wcmljZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9KSxcbiAgICAgICAgICAgICAgICAgICAgZGIuY29sbGVjdGlvbignZ29vZHMnKVxuICAgICAgICAgICAgICAgICAgICAgICAgLmRvYyggb3JkZXIucGlkIClcbiAgICAgICAgICAgICAgICAgICAgICAgIC51cGRhdGUoe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2FsZWQ6IF8uaW5jKCBvcmRlci5hbGxvY2F0ZWRDb3VudCApXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICBdKVxuICAgICAgICAgICAgfSkpO1xuXG4gICAgICAgICAgICAvLyDmm7TmlrDljaHliLjkvb/nlKjnirbmgIFcbiAgICAgICAgICAgIGF3YWl0IFByb21pc2UuYWxsKCBjb3Vwb25zLm1hcCggY291cG9uaWQgPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiBkYi5jb2xsZWN0aW9uKCdjb3Vwb24nKVxuICAgICAgICAgICAgICAgICAgICAuZG9jKCBjb3Vwb25pZCApXG4gICAgICAgICAgICAgICAgICAgIC51cGRhdGUoe1xuICAgICAgICAgICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlzVXNlZDogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB1c2VkQnk6IHRpZCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYW5Vc2VJbk5leHQ6IGZhbHNlXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICB9KSk7XG5cbiAgICAgICAgICAgIC8vIOi+vuWIsOadoeS7tu+8jOWImemihuWPluS7o+mHkeWIuFxuICAgICAgICAgICAgLy8g5ZCM5pe25Yig6Zmk5LiK5LiA5Liq5pyq5L2/55So6L+H55qE5Luj6YeR5Yi4XG4gICAgICAgICAgICBjb25zdCB0cmlwJCA9IGF3YWl0IGRiLmNvbGxlY3Rpb24oJ3RyaXAnKVxuICAgICAgICAgICAgICAgIC5kb2MoIHRpZCApXG4gICAgICAgICAgICAgICAgLmdldCggKTtcblxuICAgICAgICAgICAgbGV0IHJlcSA9IHtcbiAgICAgICAgICAgICAgICByZXN1bHQ6IHtcbiAgICAgICAgICAgICAgICAgICAgc3RhdHVzOiA1MDBcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGNvbnN0IHsgY2FzaGNvdXBvbl9hdGxlYXN0LCBjYXNoY291cG9uX3ZhbHVlcyB9ID0gdHJpcCQuZGF0YTtcblxuICAgICAgICAgICAgY29uc3QgdGVtcCA9IHtcbiAgICAgICAgICAgICAgICBvcGVuSWQ6IG9wZW5pZCxcbiAgICAgICAgICAgICAgICBmcm9tdGlkOiB0aWQsXG4gICAgICAgICAgICAgICAgdHlwZTogJ3RfZGFpamluJyxcbiAgICAgICAgICAgICAgICB0aXRsZTogJ+ihjOeoi+S7o+mHkeWIuCcsXG4gICAgICAgICAgICAgICAgY2FuVXNlSW5OZXh0OiB0cnVlLFxuICAgICAgICAgICAgICAgIGlzVXNlZDogZmFsc2UsXG4gICAgICAgICAgICAgICAgYXRsZWFzdDogY2FzaGNvdXBvbl9hdGxlYXN0IHx8IDAsXG4gICAgICAgICAgICAgICAgdmFsdWU6IGNhc2hjb3Vwb25fdmFsdWVzXG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAvLyDml6DpnIDpl6jmp5vvvIzmnInku6Pph5HliLjljbPlj6/pooblj5ZcbiAgICAgICAgICAgIGlmICggISFjYXNoY291cG9uX3ZhbHVlcyApIHtcblxuICAgICAgICAgICAgICAgIC8vIOWIoOmZpOS4iuS4gOS4quacquS9v+eUqOeahOS7o+mHkeWIuFxuICAgICAgICAgICAgICAgIGNvbnN0IGxhc3REYWlqaW4kID0gYXdhaXQgZGIuY29sbGVjdGlvbignY291cG9uJylcbiAgICAgICAgICAgICAgICAgICAgLndoZXJlKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6ICd0X2RhaWppbicsXG4gICAgICAgICAgICAgICAgICAgICAgICBpc1VzZWQ6IGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICAgICAgY2FuVXNlSW5OZXh0OiB0cnVlXG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgIC5nZXQoICk7XG5cbiAgICAgICAgICAgICAgICBpZiAoIGxhc3REYWlqaW4kLmRhdGFbIDAgXSkge1xuICAgICAgICAgICAgICAgICAgICBhd2FpdCBkYi5jb2xsZWN0aW9uKCdjb3Vwb24nKVxuICAgICAgICAgICAgICAgICAgICAgICAgLmRvYyggU3RyaW5nKCBsYXN0RGFpamluJC5kYXRhWyAwIF0uX2lkICkpXG4gICAgICAgICAgICAgICAgICAgICAgICAucmVtb3ZlKCApO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIC8vIOmihuWPluS7o+mHkeWIuFxuICAgICAgICAgICAgICAgIHJlcSA9IGF3YWl0IGNsb3VkLmNhbGxGdW5jdGlvbih7XG4gICAgICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRhdGE6IHRlbXAsXG4gICAgICAgICAgICAgICAgICAgICAgICAkdXJsOiAnY3JlYXRlJ1xuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICBuYW1lOiAnY291cG9uJ1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gY3R4LmJvZHkgPSB7XG4gICAgICAgICAgICAgICAgc3RhdHVzOiAyMDAsXG4gICAgICAgICAgICAgICAgZGF0YTogcmVxLnJlc3VsdC5zdGF0dXMgPT09IDIwMCA/IHRlbXAgOiBudWxsIFxuICAgICAgICAgICAgfVxuXG4gICAgICAgIH0gY2F0Y2ggKCBlICkge1xuICAgICAgICAgICAgcmV0dXJuIGN0eC5ib2R5ID0geyBzdGF0dXM6IDUwMCB9XG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgIC8qKiBcbiAgICAgKiBAZGVzY3JpcHRpb25cbiAgICAgKiDku6PotK3ojrflj5bmnKror7vorqLljZVcbiAgICAgKi9cbiAgICBhcHAucm91dGVyKCd1bnJlYWQnLCBhc3luYyggY3R4LCBuZXh0ICkgPT4ge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgY29uc3QgeyB0aWQsIGxhc3RUaW1lIH0gPSBldmVudC5kYXRhO1xuICAgICAgICAgICAgbGV0IHdoZXJlJCA9IHtcbiAgICAgICAgICAgICAgICB0aWRcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIGlmICggbGFzdFRpbWUgKSB7XG4gICAgICAgICAgICAgICAgd2hlcmUkID0gT2JqZWN0LmFzc2lnbih7IH0sIHdoZXJlJCwge1xuICAgICAgICAgICAgICAgICAgICBjcmVhdGV0aW1lOiBfLmd0ZSggbGFzdFRpbWUgKVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBjb25zdCBkYXRhJCA9IGF3YWl0IGRiLmNvbGxlY3Rpb24oJ29yZGVyJylcbiAgICAgICAgICAgICAgICAud2hlcmUoIHdoZXJlJCApXG4gICAgICAgICAgICAgICAgLmNvdW50KCApO1xuXG4gICAgICAgICAgICByZXR1cm4gY3R4LmJvZHkgPSB7XG4gICAgICAgICAgICAgICAgc3RhdHVzOiAyMDAsXG4gICAgICAgICAgICAgICAgZGF0YTogZGF0YSQudG90YWxcbiAgICAgICAgICAgIH1cblxuICAgICAgICB9IGNhdGNoICggZSApIHsgcmV0dXJuIGN0eC5ib2R5ID0geyBzdGF0dXM6IDUwMCB9O31cbiAgICB9KTtcblxuICAgIC8qKiBcbiAgICAgKiBAZGVzY3JpcHRpb25cbiAgICAgKiDku6PotK3mn6XnnIvmiYDmnInnmoTorqLljZXliJfooahcbiAgICAgKi9cbiAgICBhcHAucm91dGVyKCdsaXN0LWFsbCcsIGFzeW5jKCBjdHgsIG5leHQgKSA9PiB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICAvLyDmn6Xor6LmnaHmlbBcbiAgICAgICAgICAgIGNvbnN0IGxpbWl0ID0gMTA7XG4gICAgICAgICAgICBjb25zdCB7IHRpZCwgcGFnZSB9ID0gZXZlbnQuZGF0YTtcblxuICAgICAgICAgICAgY29uc3Qgd2hlcmUkID0ge1xuICAgICAgICAgICAgICAgIHRpZCxcbiAgICAgICAgICAgICAgICBwYXlfc3RhdHVzOiBfLm5lcSgnMCcpXG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICBjb25zdCB0b3RhbCQgPSBhd2FpdCBkYi5jb2xsZWN0aW9uKCdvcmRlcicpXG4gICAgICAgICAgICAgICAgLndoZXJlKCB3aGVyZSQgKVxuICAgICAgICAgICAgICAgIC5jb3VudCggKTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgY29uc3Qgb3JkZXJzJCA9IGF3YWl0IGRiLmNvbGxlY3Rpb24oJ29yZGVyJylcbiAgICAgICAgICAgICAgICAud2hlcmUoIHdoZXJlJCApXG4gICAgICAgICAgICAgICAgLmxpbWl0KCBsaW1pdCApXG4gICAgICAgICAgICAgICAgLnNraXAoKCBwYWdlIC0gMSApICogbGltaXQgKVxuICAgICAgICAgICAgICAgIC5vcmRlckJ5KCdjcmVhdGVUaW1lJywgJ2Rlc2MnKVxuICAgICAgICAgICAgICAgIC5nZXQoICk7XG5cbiAgICAgICAgICAgIGNvbnN0IHBpZHMgPSBBcnJheS5mcm9tKFxuICAgICAgICAgICAgICAgIG5ldyBTZXQoIFxuICAgICAgICAgICAgICAgICAgICBvcmRlcnMkLmRhdGFcbiAgICAgICAgICAgICAgICAgICAgICAgIC5tYXAoIHggPT4geC5waWQgKVxuICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICk7XG5cbiAgICAgICAgICAgIGNvbnN0IHNpZHMgPSBBcnJheS5mcm9tKFxuICAgICAgICAgICAgICAgIG5ldyBTZXQoIFxuICAgICAgICAgICAgICAgICAgICBvcmRlcnMkLmRhdGFcbiAgICAgICAgICAgICAgICAgICAgICAgIC5tYXAoIHggPT4geC5zaWQgKVxuICAgICAgICAgICAgICAgICAgICAgICAgLmZpbHRlciggeCA9PiAhIXggKVxuICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICk7XG5cbiAgICAgICAgICAgIGNvbnN0IHVpZHMgPSBBcnJheS5mcm9tKFxuICAgICAgICAgICAgICAgIG5ldyBTZXQoIFxuICAgICAgICAgICAgICAgICAgICBvcmRlcnMkLmRhdGFcbiAgICAgICAgICAgICAgICAgICAgICAgIC5tYXAoIHggPT4geC5vcGVuaWQgKVxuICAgICAgICAgICAgICAgICAgICAgICAgLmZpbHRlciggeCA9PiAhIXggKVxuICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICk7XG5cbiAgICAgICAgICAgIC8vIGNvbnN0IGdvb2RzJCQgPSBhd2FpdCBQcm9taXNlLmFsbChcbiAgICAgICAgICAgIC8vICAgICBwaWRzLm1hcCggXG4gICAgICAgICAgICAvLyAgICAgICAgIHBpZCA9PiBkYi5jb2xsZWN0aW9uKCdnb29kcycpXG4gICAgICAgICAgICAvLyAgICAgICAgICAgICAuZG9jKCBTdHJpbmcoIHBpZCApKVxuICAgICAgICAgICAgLy8gICAgICAgICAgICAgLmdldCggKVxuICAgICAgICAgICAgLy8gICAgIClcbiAgICAgICAgICAgIC8vICk7XG4gICAgICAgICAgICAvLyBjb25zdCBnb29kcyQgPSBnb29kcyQkLm1hcCggeCA9PiB4LmRhdGEgKTtcblxuICAgICAgICAgICAgLy8gY29uc3Qgc3RhbmRhcnMkJCA9IGF3YWl0IFByb21pc2UuYWxsKFxuICAgICAgICAgICAgLy8gICAgIHNpZHMubWFwKCBcbiAgICAgICAgICAgIC8vICAgICAgICAgc2lkID0+IGRiLmNvbGxlY3Rpb24oJ3N0YW5kYXJkcycpXG4gICAgICAgICAgICAvLyAgICAgICAgICAgICAuZG9jKCBTdHJpbmcoIHNpZCApKVxuICAgICAgICAgICAgLy8gICAgICAgICAgICAgLmZpZWxkKHtcbiAgICAgICAgICAgIC8vICAgICAgICAgICAgICAgICBwaWQ6IHRydWUsXG4gICAgICAgICAgICAvLyAgICAgICAgICAgICAgICAgbmFtZTogdHJ1ZVxuICAgICAgICAgICAgLy8gICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC8vICAgICAgICAgICAgIC5nZXQoIClcbiAgICAgICAgICAgIC8vICAgICApXG4gICAgICAgICAgICAvLyApO1xuICAgICAgICAgICAgLy8gY29uc3Qgc3RhbmRhcnMkID0gc3RhbmRhcnMkJC5tYXAoIHggPT4geC5kYXRhICk7XG5cbiAgICAgICAgICAgIGNvbnN0IHVzZXJzJCQgPSBhd2FpdCBQcm9taXNlLmFsbChcbiAgICAgICAgICAgICAgICB1aWRzLm1hcCggXG4gICAgICAgICAgICAgICAgICAgIG9wZW5pZCA9PiBkYi5jb2xsZWN0aW9uKCd1c2VyJylcbiAgICAgICAgICAgICAgICAgICAgICAgIC53aGVyZSh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb3BlbmlkXG4gICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAgICAgLmZpZWxkKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvcGVuaWQ6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYXZhdGFyVXJsOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5pY2tOYW1lOiB0cnVlXG4gICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAgICAgLmdldCggKVxuICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICBjb25zdCB1c2VycyQgPSB1c2VycyQkLm1hcCggeCA9PiB4LmRhdGFbIDAgXSk7XG5cbiAgICAgICAgICAgIGNvbnN0IG1ldGEgPSBvcmRlcnMkLmRhdGEubWFwKCBvcmRlciA9PiB7XG5cbiAgICAgICAgICAgICAgICBjb25zdCB1c2VyID0gdXNlcnMkLmZpbmQoIHVzZXIgPT4gdXNlci5vcGVuaWQgPT09IG9yZGVyLm9wZW5pZCApO1xuICAgICAgICAgICAgICAgIC8vIGNvbnN0IGRldGFpbCA9IGdvb2RzJC5maW5kKCBnb29kID0+IGdvb2QuX2lkID09PSBvcmRlci5waWQgKTtcbiAgICAgICAgICAgICAgICAvLyBjb25zdCBzdGFuZGFyID0gc3RhbmRhcnMkLmZpbmQoIHMgPT4gcy5faWQgPT09IG9yZGVyLnNpZCApO1xuXG4gICAgICAgICAgICAgICAgcmV0dXJuIE9iamVjdC5hc3NpZ24oeyB9LCBvcmRlciwge1xuICAgICAgICAgICAgICAgICAgICB1c2VyLFxuICAgICAgICAgICAgICAgICAgICAvLyBkZXRhaWwsXG4gICAgICAgICAgICAgICAgICAgIC8vIHN0YW5kYXJcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHJldHVybiBjdHguYm9keSA9IHtcbiAgICAgICAgICAgICAgICBzdGF0dXM6IDIwMCxcbiAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICAgIHBhZ2UsXG4gICAgICAgICAgICAgICAgICAgIHBhZ2VTaXplOiBsaW1pdCxcbiAgICAgICAgICAgICAgICAgICAgZGF0YTogbWV0YSxcbiAgICAgICAgICAgICAgICAgICAgdG90YWw6IHRvdGFsJC50b3RhbCxcbiAgICAgICAgICAgICAgICAgICAgdG90YWxQYWdlOiBNYXRoLmNlaWwoIHRvdGFsJC50b3RhbCAvIGxpbWl0IClcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cblxuICAgICAgICB9IGNhdGNoICggZSApIHsgXG4gICAgICAgICAgICBjb25zb2xlLmxvZygnPz8/JywgZSApXG4gICAgICAgICAgICByZXR1cm4gY3R4LmJvZHkgPSB7IHN0YXR1czogNTAwIH1cbiAgICAgICAgfVxuICAgIH0pXG4gXG4gICByZXR1cm4gYXBwLnNlcnZlKCApO1xuXG59Il19