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
            var where$, _a, type, tid, passusedless, limit, openid, total$, data$, last, fix$, meta, tripIds, trips$_1, meta2, e_2;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 6, , 7]);
                        where$ = {};
                        _a = event.data, type = _a.type, tid = _a.tid, passusedless = _a.passusedless;
                        limit = tid ? 99 : 10;
                        openid = event.data.openid || event.userInfo.openId;
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
                        if (passusedless !== false) {
                            where$ = Object.assign({}, where$, {
                                base_status: _.neq('5')
                            });
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
                                tid: last.tid,
                                base_status: _.neq('5')
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
            var _a, tid_1, needCoupons, needAddress, orders$_1, users$, deliverfees$_1, address$_1, coupons$_1, userOders, e_4;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 8, , 9]);
                        _a = event.data, tid_1 = _a.tid, needCoupons = _a.needCoupons, needAddress = _a.needAddress;
                        return [4, db.collection('order')
                                .where({
                                tid: tid_1,
                                base_status: _.neq('5'),
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
                        return [4, Promise.all(Array.from(new Set(orders$_1.data
                                .map(function (x) { return x.openid; })))
                                .map(function (uid) { return db.collection('deliver-fee')
                                .where({
                                tid: tid_1,
                                openid: uid
                            })
                                .get(); }))];
                    case 3:
                        deliverfees$_1 = _b.sent();
                        address$_1 = [];
                        if (!(!!needAddress || needAddress === undefined)) return [3, 5];
                        return [4, Promise.all(Array.from(new Set(orders$_1.data
                                .map(function (x) { return x.aid; })))
                                .map(function (aid) { return db.collection('address')
                                .doc(aid)
                                .get(); }))];
                    case 4:
                        address$_1 = _b.sent();
                        _b.label = 5;
                    case 5:
                        coupons$_1 = [];
                        if (!(!!needCoupons || needCoupons === undefined)) return [3, 7];
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
                    case 6:
                        coupons$_1 = _b.sent();
                        _b.label = 7;
                    case 7:
                        userOders = users$.map(function (user$, k) {
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
                            var deliverFee = deliverfees$_1[k].data[0] || null;
                            return {
                                user: user,
                                orders: orders,
                                address: address,
                                deliverFee: deliverFee,
                                coupons: (!!coupons && coupons.length > 0) ? coupons[0] : []
                            };
                        });
                        return [2, ctx.body = {
                                status: 200,
                                data: userOders
                            }];
                    case 8:
                        e_4 = _b.sent();
                        console.log('...', e_4);
                        return [2, ctx.body = { status: 500 }];
                    case 9: return [2];
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFDQSxpQkEybENDOztBQTNsQ0QscUNBQXVDO0FBQ3ZDLHNDQUF3QztBQUN4QyxtQ0FBbUM7QUFFbkMsS0FBSyxDQUFDLElBQUksQ0FBQztJQUNQLEdBQUcsRUFBRSxPQUFPLENBQUMsR0FBRyxDQUFDLEtBQUs7Q0FDekIsQ0FBQyxDQUFDO0FBRUgsSUFBTSxFQUFFLEdBQWdCLEtBQUssQ0FBQyxRQUFRLEVBQUcsQ0FBQztBQUUxQyxJQUFNLENBQUMsR0FBRyxFQUFFLENBQUMsT0FBTyxDQUFDO0FBbUNSLFFBQUEsSUFBSSxHQUFHLFVBQVEsS0FBSyxFQUFFLE9BQU87Ozs7UUFFaEMsR0FBRyxHQUFHLElBQUksU0FBUyxDQUFDLEVBQUUsS0FBSyxPQUFBLEVBQUUsQ0FBQyxDQUFDO1FBaUNyQyxHQUFHLENBQUMsTUFBTSxDQUFDLFFBQVEsRUFBRSxVQUFPLEdBQUcsRUFBRSxJQUFJOzs7Ozs7d0JBR3ZCLEtBQXdCLEtBQUssQ0FBQyxJQUFJLEVBQWhDLEdBQUcsU0FBQSxFQUFFLElBQUksVUFBQSxFQUFFLE1BQU0sWUFBQSxDQUFnQjt3QkFDbkMsV0FBUyxLQUFLLENBQUMsSUFBSSxDQUFDLE1BQU0sSUFBSSxLQUFLLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQzt3QkFHMUMsV0FBTSxLQUFLLENBQUMsWUFBWSxDQUFDO2dDQUNyQyxJQUFJLEVBQUU7b0NBQ0YsSUFBSSxFQUFFO3dDQUNGLEdBQUcsRUFBRSxHQUFHO3FDQUNYO29DQUNELElBQUksRUFBRSxRQUFRO2lDQUNqQjtnQ0FDRCxJQUFJLEVBQUUsTUFBTTs2QkFDZixDQUFDLEVBQUE7O3dCQVJJLE9BQU8sR0FBRyxTQVFkO3dCQUVJLE1BQU0sR0FBRyxPQUFPLENBQUMsTUFBTSxDQUFDO3dCQUM5QixJQUFLLE1B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RyxFQUFDOztLQUV0QixDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiXG5pbXBvcnQgKiBhcyBjbG91ZCBmcm9tICd3eC1zZXJ2ZXItc2RrJztcbmltcG9ydCAqIGFzIFRjYlJvdXRlciBmcm9tICd0Y2Itcm91dGVyJztcbmltcG9ydCB7IGNyZWF0ZSQgfSBmcm9tICcuL2NyZWF0ZSc7XG5cbmNsb3VkLmluaXQoe1xuICAgIGVudjogcHJvY2Vzcy5lbnYuY2xvdWRcbn0pO1xuXG5jb25zdCBkYjogREIuRGF0YWJhc2UgPSBjbG91ZC5kYXRhYmFzZSggKTtcblxuY29uc3QgXyA9IGRiLmNvbW1hbmQ7XG5cbi8qKlxuICogXG4gKiBAZGVzY3JpcHRpb24g6K6i5Y2V5qih5Z2XXG4gKiAtLS0tLS0tLSDlrZfmrrUgLS0tLS0tLS0tLVxuICogX2lkXG4gKiBvcGVuaWQsXG4gKiBjcmVhdGV0aW1lXG4gKiB0aWQsXG4gKiBwaWQsXG4gKiBjaWQgKOWPr+S4uuepuilcbiAqIHNpZCwgKOWPr+S4uuepuilcbiAqIGNvdW50LFxuICogcHJpY2UsXG4gKiBncm91cFByaWNlLFxuICogZGVwb3NpdF9wcmljZTog5ZWG5ZOB6K6i6YeRICjlj6/kuLrnqbopXG4gKiAhIGFjaWQg5ZWG5ZOB5rS75YqoaWRcbiAqICEgaXNPY2N1cGllZCwg5piv5ZCm5Y2g5bqT5a2YXG4gKiBncm91cF9wcmljZSAo5Y+v5Li656m6KVxuICogdHlwZTogJ2N1c3RvbScgfCAnbm9ybWFsJyB8ICdwcmUnIOiHquWumuS5ieWKoOWNleOAgeaZrumAmuWKoOWNleOAgemihOiuouWNlVxuICogaW1nOiBBcnJheVsgc3RyaW5nIF1cbiAqIGRlc2PvvIjlj6/kuLrnqbrvvIksXG4gKiBhaWRcbiAqIGFsbG9jYXRlZFByaWNlIOWIhumFjeeahOS7t+agvFxuICogYWxsb2NhdGVkR3JvdXBQcmljZSDliIbphY3lm6LotK3ku7dcbiAqIGFsbG9jYXRlZENvdW50IOWIhumFjeeahOaVsOmHj1xuICogZm9ybV9pZFxuICogcHJlcGF5X2lkLFxuICogZmluYWxfcHJpY2Ug5pyA5ZCO5oiQ5Lqk5Lu3XG4gKiAhIGNhbkdyb3VwIOaYr+WQpuWPr+S7peaLvOWbolxuICogYmFzZV9zdGF0dXM6IDAsMSwyLDMsNCw1IOi/m+ihjOS4re+8jOS7o+i0reW3sui0reS5sO+8jOW3suiwg+aVtO+8jOW3sue7k+eul++8jOW3suWPlua2iO+8iOS5sOS4jeWIsO+8ie+8jOW3sui/h+acn++8iOaUr+S7mOi/h+acn++8iVxuICogcGF5X3N0YXR1czogMCwxLDIg5pyq5LuY5qy+77yM5bey5LuY6K6i6YeR77yM5bey5LuY5YWo5qy+XG4gKiAhIGRlbGl2ZXJfc3RhdHVzOiAwLDEg5pyq5Y+R5biD77yM5bey5Y+R5biD44CBXG4gKi9cbmV4cG9ydCBjb25zdCBtYWluID0gYXN5bmMgKCBldmVudCwgY29udGV4dCApID0+IHtcblxuICAgIGNvbnN0IGFwcCA9IG5ldyBUY2JSb3V0ZXIoeyBldmVudCB9KTtcblxuICAgIC8qKlxuICAgICAqIEBkZXNjcmlwdGlvbiDliJvlu7rorqLljZVcbiAgICAgKiAtLS0tLS0tLSDor7fmsYIgLS0tLS0tLS0tLVxuICAgICAqIHtcbiAgICAgKiAgICAgIHRpZCxcbiAgICAgKiAgICAgIG9wZW5JZCAvLyDorqLljZXkuLvkurpcbiAgICAgKiAgICAgIGZyb206ICdjYXJ0JyB8ICdidXknIHwgJ2N1c3RvbScgfCAnYWdlbnRzJyB8ICdzeXN0ZW0nIOadpea6kO+8mui0reeJqei9puOAgeebtOaOpei0reS5sOOAgeiHquWumuS5ieS4i+WNleOAgeS7o+i0reS4i+WNleOAgeezu+e7n+WPkei1t+mihOS7mOiuouWNlVxuICAgICAqICAgICAgb3JkZXJzOiBBcnJheTx7IFxuICAgICAqICAgICAgICAgIHRpZFxuICAgICAqICAgICAgICAgIGNpZFxuICAgICAqICAgICAgICAgIHNpZFxuICAgICAqICAgICAgICAgIHBpZFxuICAgICAqICAgICAgICAgIHByaWNlXG4gICAgICogICAgICAgICAgbmFtZVxuICAgICAqICAgICAgICAgIGFjaWRcbiAgICAgKiAgICAgICAgICBzdGFuZGVybmFtZVxuICAgICAqICAgICAgICAgIGdyb3VwUHJpY2VcbiAgICAgKiAgICAgICAgICBjb3VudFxuICAgICAqICAgICAgICAgIGRlc2NcbiAgICAgKiAgICAgICAgICBpbWdcbiAgICAgKiAgICAgICAgICB0eXBlXG4gICAgICogICAgICAgICAgcGF5X3N0YXR1cyxcbiAgICAgKiAgICAgICAgICBhZGRyZXNzOiB7XG4gICAgICogICAgICAgICAgICAgIG5hbWUsXG4gICAgICogICAgICAgICAgICAgIHBob25lLFxuICAgICAqICAgICAgICAgICAgICBkZXRhaWwsXG4gICAgICogICAgICAgICAgICAgIHBvc3RhbGNvZGVcbiAgICAgKiAgICAgICAgICB9XG4gICAgICogICAgICB9PlxuICAgICAqIH1cbiAgICAgKi9cbiAgICBhcHAucm91dGVyKCdjcmVhdGUnLCBhc3luYyggY3R4LCBuZXh0ICkgPT4ge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgXG4gICAgICAgICAgICBjb25zdCB7IHRpZCwgZnJvbSwgb3JkZXJzIH0gPSBldmVudC5kYXRhO1xuICAgICAgICAgICAgY29uc3Qgb3BlbmlkID0gZXZlbnQuZGF0YS5vcGVuSWQgfHwgZXZlbnQudXNlckluZm8ub3BlbklkO1xuXG4gICAgICAgICAgICAvLyAx44CB5Yik5pat6K+l6KGM56iL5piv5ZCm5Y+v5Lul55SoXG4gICAgICAgICAgICBjb25zdCB0cmlwcyQkID0gYXdhaXQgY2xvdWQuY2FsbEZ1bmN0aW9uKHtcbiAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIF9pZDogdGlkXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICR1cmw6ICdkZXRhaWwnXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBuYW1lOiAndHJpcCdcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBjb25zdCB0cmlwcyQgPSB0cmlwcyQkLnJlc3VsdDsgICAgICAgIFxuICAgICAgICAgICAgaWYgKCB0cmlwcyQuc3RhdHVzICE9PSAyMDBcbiAgICAgICAgICAgICAgICAgICAgfHwgIXRyaXBzJC5kYXRhIFxuICAgICAgICAgICAgICAgICAgICB8fCAoICEhdHJpcHMkLmRhdGEgJiYgdHJpcHMkLmRhdGEuaXNDbG9zZWQgKSBcbiAgICAgICAgICAgICAgICAgICAgfHwgKCAhIXRyaXBzJC5kYXRhICYmIG5ldyBEYXRlKCApLmdldFRpbWUoICkgPj0gdHJpcHMkLmRhdGEuZW5kX2RhdGUgKSkge1xuICAgICAgICAgICAgICAgIHRocm93ICfmmoLml6DooYznqIvorqHliJLvvIzmmoLml7bkuI3og73otK3kubDvvZ4nXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIOacgOaWsOWPr+eUqOihjOeoi1xuICAgICAgICAgICAgY29uc3QgdHJpcCA9IHRyaXBzJC5kYXRhO1xuXG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIOagueaNruWcsOWdgOWvueixoe+8jOaLv+WIsOWcsOWdgGlkXG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIGxldCBhZGRyZXNzaWQkID0ge1xuICAgICAgICAgICAgICAgIHJlc3VsdDoge1xuICAgICAgICAgICAgICAgICAgICBkYXRhOiBudWxsLFxuICAgICAgICAgICAgICAgICAgICBzdGF0dXM6IDUwMFxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIC8vIOiuouWNleadpea6kO+8mui0reeJqei9puOAgeezu+e7n+WKoOWNlVxuICAgICAgICAgICAgaWYgKCBldmVudC5kYXRhLmZyb20gPT09ICdjYXJ0JyB8fCBldmVudC5kYXRhLmZyb20gPT09ICdzeXN0ZW0nIHx8IGV2ZW50LmRhdGEuZnJvbSA9PT0gJ2J1eScgKSB7XG4gICAgICAgICAgICAgICAgYWRkcmVzc2lkJCA9IGF3YWl0IGNsb3VkLmNhbGxGdW5jdGlvbih7XG4gICAgICAgICAgICAgICAgICAgIGRhdGE6IHsgXG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb3BlbklkOiBvcGVuaWQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYWRkcmVzczogZXZlbnQuZGF0YS5vcmRlcnNbIDAgXS5hZGRyZXNzXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgJHVybDogJ2dldEFkZHJlc3NJZCdcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgbmFtZTogJ2FkZHJlc3MnXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIC8vIOiuouWNleadpea6kO+8mui0reeJqei9puOAgeezu+e7n+WKoOWNlVxuICAgICAgICAgICAgaWYgKCggZXZlbnQuZGF0YS5mcm9tID09PSAnY2FydCcgfHwgZXZlbnQuZGF0YS5mcm9tID09PSAnc3lzdGVtJyApICYmIGFkZHJlc3NpZCQucmVzdWx0LnN0YXR1cyAhPT0gMjAwICkge1xuICAgICAgICAgICAgICAgIHRocm93ICfmn6Xor6LlnLDlnYDplJnor68nO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyDlj6/nlKjlnLDlnYBpZFxuICAgICAgICAgICAgY29uc3QgYWlkID0gYWRkcmVzc2lkJC5yZXN1bHQuZGF0YTtcblxuICAgICAgICAgICAgLy8g5piv5ZCm5paw5a6i5oi3XG4gICAgICAgICAgICBjb25zdCBpc05ldyQgPSBhd2FpdCBjbG91ZC5jYWxsRnVuY3Rpb24oe1xuICAgICAgICAgICAgICAgIG5hbWU6ICdjb21tb24nLFxuICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgJHVybDogJ2lzLW5ldy1jdXN0b21lcicsXG4gICAgICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG9wZW5JZDogb3BlbmlkXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KVxuXG4gICAgICAgICAgICBjb25zdCBpc05ldyA9IGlzTmV3JC5yZXN1bHQuZGF0YTtcblxuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiDmlrDlrqIgKyDmlrDlrqLopoHorqLph5EgPSAnMCcsXG4gICAgICAgICAgICAgKiDmlrDlrqIgKyDopoHorqLph5EgPSAnMCcsXG4gICAgICAgICAgICAgKiDmlrDlrqIgKyDlhY3orqLph5EgPSAnMScsXG4gICAgICAgICAgICAgKiDml6flrqIgKyDml6flrqLlhY3orqLph5EgPSAnMScsXG4gICAgICAgICAgICAgKiDml6flrqIgKyDopoHorqLph5EgPSAnMCcsXG4gICAgICAgICAgICAgKiDml6flrqIgKyDlhY3orqLph5EgPSAnMScsXG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIGxldCBwYXlfc3RhdHVzID0gJzAnO1xuICAgICAgICAgICAgY29uc3QgcCA9IHRyaXAucGF5bWVudDtcblxuICAgICAgICAgICAgaWYgKCBpc05ldyAmJiBwID09PSAnMCcgKSB7XG4gICAgICAgICAgICAgICAgcGF5X3N0YXR1cyA9ICcwJ1xuXG4gICAgICAgICAgICB9IGVsc2UgaWYgKCBpc05ldyAmJiBwID09PSAnMScgKSB7XG4gICAgICAgICAgICAgICAgcGF5X3N0YXR1cyA9ICcwJ1xuXG4gICAgICAgICAgICB9IGVsc2UgaWYgKCBpc05ldyAmJiBwID09PSAnMicgKSB7XG4gICAgICAgICAgICAgICAgcGF5X3N0YXR1cyA9ICcxJ1xuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgfSBlbHNlIGlmICggIWlzTmV3ICYmIHAgPT09ICcwJyApIHtcbiAgICAgICAgICAgICAgICBwYXlfc3RhdHVzID0gJzEnXG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICB9IGVsc2UgaWYgKCAhaXNOZXcgJiYgcCA9PT0gJzEnICkge1xuICAgICAgICAgICAgICAgIHBheV9zdGF0dXMgPSAnMCdcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoICFpc05ldyAmJiBwID09PSAnMicgKSB7XG4gICAgICAgICAgICAgICAgcGF5X3N0YXR1cyA9ICcxJ1xuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBwYXlfc3RhdHVzID0gJzAnXG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIDPjgIHmibnph4/liJvlu7rorqLljZXvvIzvvIjov4fmu6TmjonkuI3og73liJvlu7rotK3nianmuIXljZXnmoTllYblk4HvvIlcbiAgICAgICAgICAgIGNvbnN0IHRlbXAgPSBldmVudC5kYXRhLm9yZGVycy5tYXAoIG1ldGEgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IHQgPSBPYmplY3QuYXNzaWduKHsgfSwgbWV0YSwge1xuICAgICAgICAgICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAgICAgICAgICogISBkZWxpdmVyX3N0YXR1c+S4uuacquWPkeW4gyDlj6/og73mnInpl67pophcbiAgICAgICAgICAgICAgICAgICAgICovXG4gICAgICAgICAgICAgICAgICAgIGFpZCxcbiAgICAgICAgICAgICAgICAgICAgaXNPY2N1cGllZDogdHJ1ZSwgLy8g5Y2g6aKG5bqT5a2Y5qCH5b+XXG4gICAgICAgICAgICAgICAgICAgIG9wZW5pZDogb3BlbmlkLFxuICAgICAgICAgICAgICAgICAgICBkZWxpdmVyX3N0YXR1czogJzAnLCBcbiAgICAgICAgICAgICAgICAgICAgYmFzZV9zdGF0dXM6ICcwJyxcbiAgICAgICAgICAgICAgICAgICAgcGF5X3N0YXR1czogIW1ldGEuZGVwb3NpdFByaWNlID8gJzEnIDogcGF5X3N0YXR1cyAsIC8vIOWVhuWTgeiuoumHkemineW6puS4ujBcbiAgICAgICAgICAgICAgICAgICAgY3JlYXRlVGltZTogbmV3IERhdGUoICkuZ2V0VGltZSggKSxcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogISFtZXRhLmRlcG9zaXRQcmljZSA/IG1ldGEudHlwZSA6ICdub3JtYWwnXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgZGVsZXRlIHRbJ2FkZHJlc3MnXTtcbiAgICAgICAgICAgICAgICByZXR1cm4gdDtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAvLyA044CB5om56YeP5Yib5bu66K6i5Y2VICgg5ZCM5pe25aSE55CG5Y2g6aKG6LSn5a2Y55qE6Zeu6aKYIClcbiAgICAgICAgICAgIGNvbnN0IHNhdmUkOiBhbnkgPSBhd2FpdCBQcm9taXNlLmFsbCggdGVtcC5tYXAoIG8gPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiBjcmVhdGUkKCBvcGVuaWQsIG8sIGRiLCBjdHggKTtcbiAgICAgICAgICAgIH0pKTtcbiAgICAgICAgXG4gICAgICAgICAgICBpZiAoIHNhdmUkLnNvbWUoIHggPT4geC5zdGF0dXMgIT09IDIwMCApKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgJ+WIm+W7uuiuouWNlemUmeivr++8gSdcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8g6L+U5Zue6K6i5Y2V5L+h5oGvXG4gICAgICAgICAgICBjb25zdCBvcmRlcl9yZXN1bHQgPSBzYXZlJC5tYXAoKCB4LCBrICkgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IHsgcHJpY2UsIGNvdW50LCBwYXlfc3RhdHVzLCBkZXBvc2l0UHJpY2UgfSA9IHRlbXBbIGsgXTtcbiAgICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgICAgICBvaWQ6IHguZGF0YS5faWQsXG4gICAgICAgICAgICAgICAgICAgIHByaWNlLFxuICAgICAgICAgICAgICAgICAgICBjb3VudCxcbiAgICAgICAgICAgICAgICAgICAgcGF5X3N0YXR1cyxcbiAgICAgICAgICAgICAgICAgICAgZGVwb3NpdFByaWNlXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHJldHVybiBjdHguYm9keSA9IHtcbiAgICAgICAgICAgICAgICBzdGF0dXM6IDIwMCxcbiAgICAgICAgICAgICAgICBkYXRhOiBvcmRlcl9yZXN1bHRcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgfSBjYXRjaCAoIGUgKSB7XG4gICAgIFxuICAgICAgICAgICAgcmV0dXJuIGN0eC5ib2R5ID0ge1xuICAgICAgICAgICAgICAgIHN0YXR1czogNTAwLFxuICAgICAgICAgICAgICAgIG1lc3NhZ2U6IGVcbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgIC8qKlxuICAgICAqIEBkZXNjcmlwdGlvblxuICAgICAqIOWuouaIt+err+afpeivolxuICAgICAqIFxuICAgICAqIOWIhumhtSArIHF1ZXJ5IOafpeivouiuouWNleWIl+ihqO+8iOacquiBmuWQiO+8iVxuICAgICAqIC0tLS0tIOivt+axgiAtLS0tLS1cbiAgICAgKiB7XG4gICAgICohICAgIHRpZDog6KGM56iLaWQg77yI5Y+v5peg77yJXG4gICAgICogICAgIG9wZW5pZDog77yI5Y+v5peg77yJXG4gICAgICogICAgIHBhZ2U6IG51bWJlclxuICAgICAqICAgICBza2lwOiBudW1iZXJcbiAgICAgKiAgICAgdHlwZTog5oiR55qE5YWo6YOoIHwg5pyq5LuY5qy+6K6i5Y2VIHwg5b6F5Y+R6LSnIHwg5bey5a6M5oiQIHwg566h55CG5ZGY77yI6KGM56iL6K6i5Y2V77yJfCDnrqHnkIblkZjvvIjmiYDmnInorqLljZXvvIlcbiAgICAgKiAgICAgdHlwZTogbXktYWxsIHwgbXktbm90cGF5IHwgbXktZGVsaXZlciB8IG15LWZpbmlzaCB8IG1hbmFnZXItdHJpcCB8IG1hbmFnZXItYWxsXG4gICAgICogICAgIHBhc3N1c2VkbGVzczogdHJ1ZSB8IGZhbHNlIHwgdW5kZWZpbmVkIOaYr+WQpui/h+a7pOaOiei/h+acn+eahOiuouWNlVxuICAgICAqIH1cbiAgICAgKiAhIOacquS7mOasvuiuouWNle+8mnBheV9zdGF0dXM6IOacquS7mOasvi/lt7Lku5jorqLph5Eg5oiWIHR5cGU6IHByZVxuICAgICAqICEg5b6F5Y+R6LSn77yaZGVsaXZlcl9zdGF0dXPvvJrmnKrlj5HotKcg5LiUIHBheV9zdGF0dXMg5bey5LuY5qy+XG4gICAgICogISDlt7LlrozmiJDvvJpkZWxpdmVyX3N0YXR1c++8muW3suWPkei0pyDkuJQgcGF5X3N0YXR1cyDlt7Lku5jlhajmrL5cbiAgICAgKi9cbiAgICBhcHAucm91dGVyKCdsaXN0JywgYXN5bmMoIGN0eCwgbmV4dCApID0+IHtcbiAgICAgICAgdHJ5IHtcblxuICAgICAgICAgICAgbGV0IHdoZXJlJCA9IHsgfTtcbiAgICAgICAgICAgIGNvbnN0IHsgdHlwZSwgdGlkLCBwYXNzdXNlZGxlc3MgfSA9IGV2ZW50LmRhdGE7XG5cbiAgICAgICAgICAgIC8vIOafpeivouadoeaVsFxuICAgICAgICAgICAgY29uc3QgbGltaXQgPSB0aWQgPyA5OSA6IDEwO1xuXG4gICAgICAgICAgICBjb25zdCBvcGVuaWQgPSBldmVudC5kYXRhLm9wZW5pZCB8fCBldmVudC51c2VySW5mby5vcGVuSWQ7XG5cblxuICAgICAgICAgICAgLy8g5oiR55qE5YWo6YOoXG4gICAgICAgICAgICBpZiAoIHR5cGUgPT09ICdteS1hbGwnICkge1xuICAgICAgICAgICAgICAgIHdoZXJlJCA9IHtcbiAgICAgICAgICAgICAgICAgICAgb3BlbmlkOiBvcGVuaWRcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIOacquS7mOasvlxuICAgICAgICAgICAgfSBlbHNlIGlmICggdHlwZSA9PT0gJ215LW5vdHBheScgKSB7XG4gICAgICAgICAgICAgICAgd2hlcmUkID0gXy5hbmQoe1xuICAgICAgICAgICAgICAgICAgICBvcGVuaWQsXG4gICAgICAgICAgICAgICAgICAgIGJhc2Vfc3RhdHVzOiAnMidcbiAgICAgICAgICAgICAgICB9LCBfLm9yKFtcbiAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogJ3ByZSdcbiAgICAgICAgICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICAgICAgICAgICAgcGF5X3N0YXR1czogXy5vciggXy5lcSgnMCcpLCBfLmVxKCcxJykpXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBdKSk7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIC8vIOacquWPkei0p1xuICAgICAgICAgICAgfSBlbHNlIGlmICggdHlwZSA9PT0gJ215LWRlbGl2ZScgKSB7XG4gICAgICAgICAgICAgICAgd2hlcmUkID0ge1xuICAgICAgICAgICAgICAgICAgICBvcGVuaWQsXG4gICAgICAgICAgICAgICAgICAgIHBheV9zdGF0dXM6ICcyJyxcbiAgICAgICAgICAgICAgICAgICAgZGVsaXZlcl9zdGF0dXM6ICcwJ1xuICAgICAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIC8vIOW3suWujOaIkFxuICAgICAgICAgICAgfSBlbHNlIGlmICggdHlwZSA9PT0gJ215LWZpbmlzaCcgKSB7XG4gICAgICAgICAgICAgICAgd2hlcmUkID0ge1xuICAgICAgICAgICAgICAgICAgICBvcGVuaWQsXG4gICAgICAgICAgICAgICAgICAgIHBheV9zdGF0dXM6ICcyJyxcbiAgICAgICAgICAgICAgICAgICAgZGVsaXZlcl9zdGF0dXM6ICcxJ1xuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIOi/h+a7pOaOiei/h+acn+iuouWNlVxuICAgICAgICAgICAgaWYgKCBwYXNzdXNlZGxlc3MgIT09IGZhbHNlICkge1xuICAgICAgICAgICAgICAgIHdoZXJlJCA9IE9iamVjdC5hc3NpZ24oeyB9LCB3aGVyZSQsIHtcbiAgICAgICAgICAgICAgICAgICAgYmFzZV9zdGF0dXM6IF8ubmVxKCc1JylcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8g6KGM56iL6K6i5Y2VXG4gICAgICAgICAgICBpZiAoIHRpZCApIHtcbiAgICAgICAgICAgICAgICB3aGVyZSQgPSBPYmplY3QuYXNzaWduKHsgfSwgd2hlcmUkLCB7XG4gICAgICAgICAgICAgICAgICAgIHRpZFxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyDojrflj5bmgLvmlbBcbiAgICAgICAgICAgIGNvbnN0IHRvdGFsJCA9IGF3YWl0IGRiLmNvbGxlY3Rpb24oJ29yZGVyJylcbiAgICAgICAgICAgICAgICAud2hlcmUoIHdoZXJlJCApXG4gICAgICAgICAgICAgICAgLmNvdW50KCApO1xuXG4gICAgICAgICAgICAvLyDojrflj5borqLljZXmlbDmja5cbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogISDlpoLmnpzmmK/mnInmjIflrpp0aWTnmoTvvIzliJnkuI3pnIDopoFsaW1pdOS6hu+8jOebtOaOpeaLieWPluihjOeoi+aJgOacieeahOiuouWNlVxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICBjb25zdCBkYXRhJCA9IGF3YWl0IGRiLmNvbGxlY3Rpb24oJ29yZGVyJylcbiAgICAgICAgICAgICAgICAud2hlcmUoIHdoZXJlJCApXG4gICAgICAgICAgICAgICAgLm9yZGVyQnkoJ2NyZWF0ZVRpbWUnLCAnZGVzYycpXG4gICAgICAgICAgICAgICAgLmxpbWl0KCBsaW1pdCApXG4gICAgICAgICAgICAgICAgLnNraXAoIGV2ZW50LmRhdGEuc2tpcCB8fCAoIGV2ZW50LmRhdGEucGFnZSAtIDEgKSAqIGxpbWl0IClcbiAgICAgICAgICAgICAgICAuZ2V0KCApO1xuXG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqICEg55Sx5LqO5p+l6K+i5piv5oyJ5YiG6aG177yM5L2G5piv5pi+56S65piv5oyJ6KGM56iL5p2l6IGa5ZCI5pi+56S6XG4gICAgICAgICAgICAgKiAhIOWboOatpOacieWPr+iDve+8jE7pobXmnIDlkI7kuIDkvY3vvIzot59OKzHpobXnrKzkuIDkvY3kvp3nhLblsZ7kuo7lkIzkuIDooYznqItcbiAgICAgICAgICAgICAqICEg5aaC5LiN6L+b6KGM5aSE55CG77yM5a6i5oi35p+l6K+i6K6i5Y2V5YiX6KGo5pi+56S66KGM56iL6K6i5Y2V5pe277yM5Lya4oCc5pyJ5Y+v6IO94oCd5pi+56S65LiN5YWoXG4gICAgICAgICAgICAgKiAhIOeJueauiuWkhOeQhu+8mueUqOacgOWQjuS4gOS9jeeahHRpZO+8jOafpeivouacgOWQjuS4gOS9jeS7peWQjuWQjHRpZOeahG9yZGVy77yM54S25ZCO5L+u5q2j5omA6L+U5Zue55qEcGFnZVxuICAgICAgICAgICAgICovXG5cbiAgICAgICAgICAgIGNvbnN0IGxhc3QgPSBkYXRhJC5kYXRhWyBkYXRhJC5kYXRhLmxlbmd0aCAtIDEgXTtcblxuICAgICAgICAgICAgbGV0IGZpeCQ6IGFueSA9IHtcbiAgICAgICAgICAgICAgICBkYXRhOiBbIF1cbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIC8vIOWmguaenOayoeaciXRpZOWPguaVsO+8jOaJjeWOu+WBmmZpeOeahOWKqOS9nFxuICAgICAgICAgICAgaWYgKCBsYXN0ICYmICF0aWQgKSB7IFxuICAgICAgICAgICAgICAgIGZpeCQgPSBhd2FpdCBkYi5jb2xsZWN0aW9uKCdvcmRlcicpXG4gICAgICAgICAgICAgICAgICAgIC53aGVyZSh7XG4gICAgICAgICAgICAgICAgICAgICAgICBvcGVuaWQsXG4gICAgICAgICAgICAgICAgICAgICAgICB0aWQ6IGxhc3QudGlkLFxuICAgICAgICAgICAgICAgICAgICAgICAgYmFzZV9zdGF0dXM6IF8ubmVxKCc1JylcbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgLm9yZGVyQnkoJ2NyZWF0ZVRpbWUnLCAnZGVzYycpXG4gICAgICAgICAgICAgICAgICAgIC5za2lwKCBldmVudC5kYXRhLnNraXAgPyBldmVudC5kYXRhLnNraXAgKyBkYXRhJC5kYXRhLmxlbmd0aCA6ICggZXZlbnQuZGF0YS5wYWdlIC0gMSApICogbGltaXQgKyBkYXRhJC5kYXRhLmxlbmd0aCApXG4gICAgICAgICAgICAgICAgICAgIC5nZXQoICk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGNvbnN0IG1ldGEgPSBbIC4uLmRhdGEkLmRhdGEsIC4uLmZpeCQuZGF0YSBdO1xuXG4gICAgICAgICAgICAvLyDov5nph4znmoTooYznqIvor6bmg4XnlKggbmV3IFNldOeahOaWueW8j+afpeivolxuICAgICAgICAgICAgY29uc3QgdHJpcElkcyA9IEFycmF5LmZyb20oXG4gICAgICAgICAgICAgICAgbmV3IFNldCggbWV0YS5tYXAoIG0gPT4gbS50aWQgKSlcbiAgICAgICAgICAgICk7XG5cbiAgICAgICAgICAgIGNvbnN0IHRyaXBzJCA9IGF3YWl0IFByb21pc2UuYWxsKCB0cmlwSWRzLm1hcCggdGlkID0+IHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZGIuY29sbGVjdGlvbigndHJpcCcpXG4gICAgICAgICAgICAgICAgICAgIC53aGVyZSh7XG4gICAgICAgICAgICAgICAgICAgICAgICBfaWQ6IHRpZFxuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAuZ2V0KCApO1xuICAgICAgICAgICAgfSkpO1xuICAgICBcbiAgICAgICAgICAgIC8vIOiBmuWQiOihjOeoi+aVsOaNrlxuICAgICAgICAgICAgY29uc3QgbWV0YTIgPSBtZXRhLm1hcCgoIHgsIGkgKSA9PiBPYmplY3QuYXNzaWduKHsgfSwgeCwge1xuICAgICAgICAgICAgICAgIC8vIHRyaXA6IHRyaXBzJFsgaSBdLmRhdGFbIDAgXVxuICAgICAgICAgICAgICAgIHRyaXA6ICh0cmlwcyQuZmluZCggeSA9PiB5LmRhdGFbIDAgXS5faWQgPT09IHgudGlkICkgYXMgYW55KS5kYXRhWyAwIF1cbiAgICAgICAgICAgIH0pKTtcblxuICAgICAgICAgICAgcmV0dXJuIGN0eC5ib2R5ID0ge1xuICAgICAgICAgICAgICAgIHN0YXR1czogMjAwLFxuICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgZGF0YTogbWV0YTIsXG4gICAgICAgICAgICAgICAgICAgIHBhZ2VTaXplOiBsaW1pdCxcbiAgICAgICAgICAgICAgICAgICAgdG90YWw6IHRvdGFsJC50b3RhbCxcbiAgICAgICAgICAgICAgICAgICAgcGFnZTogZml4JC5kYXRhLmxlbmd0aCA9PT0gMCA/IGV2ZW50LmRhdGEucGFnZSA6IGV2ZW50LmRhdGEucGFnZSArIE1hdGguY2VpbCggZml4JC5kYXRhLmxlbmd0aCAvIGxpbWl0ICksXG4gICAgICAgICAgICAgICAgICAgIGN1cnJlbnQ6IGV2ZW50LmRhdGEuc2tpcCA/IGV2ZW50LmRhdGEuc2tpcCArIG1ldGEubGVuZ3RoIDogKCBldmVudC5kYXRhLnBhZ2UgLSAxICkgKiBsaW1pdCArIG1ldGEubGVuZ3RoLFxuICAgICAgICAgICAgICAgICAgICB0b3RhbFBhZ2U6IE1hdGguY2VpbCggdG90YWwkLnRvdGFsIC8gbGltaXQgKVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIFxuICAgICAgICB9IGNhdGNoICggZSApIHsgcmV0dXJuIGN0eC5ib2R5ID0geyBzdGF0dXM6IDUwMH07fVxuICAgIH0pXG5cbiAgICAvKipcbiAgICAgKiDmibnph4/mm7TmlrDvvIzorqLljZXkuLrlt7LmlK/ku5jvvIzlubbkuJTlop7liqDliLDotK3nianmuIXljZVcbiAgICAgKiBvcmRlcklkczogXCIxMjMsMjM0LDM0NVwiXG4gICAgICogZm9ybV9pZCxcbiAgICAgKiBwcmVwYXlfaWRcbiAgICAgKi9cbiAgICBhcHAucm91dGVyKCd1cGFkdGUtdG8tcGF5ZWQnLCBhc3luYyggY3R4LCBuZXh0ICkgPT4ge1xuICAgICAgICB0cnkge1xuXG4gICAgICAgICAgICBjb25zdCBvcGVuSWQgPSBldmVudC51c2VySW5mby5vcGVuSWQ7XG4gICAgICAgICAgICBjb25zdCB7IG9yZGVySWRzLCBwcmVwYXlfaWQsIGZvcm1faWQgfSA9IGV2ZW50LmRhdGE7XG5cbiAgICAgICAgICAgIC8vIOabtOaWsOiuouWNleWtl+autVxuICAgICAgICAgICAgYXdhaXQgUHJvbWlzZS5hbGwoIG9yZGVySWRzLnNwbGl0KCcsJykubWFwKCBvaWQgPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiBkYi5jb2xsZWN0aW9uKCdvcmRlcicpLmRvYyggb2lkIClcbiAgICAgICAgICAgICAgICAgICAgLnVwZGF0ZSh7XG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9ybV9pZCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcmVwYXlfaWQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcGF5X3N0YXR1czogJzEnXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSkpO1xuXG4gICAgICAgICAgICAvLyDliJvlu7ov5o+S5YWl5Yiw6LSt54mp5riF5Y2VXG4gICAgICAgICAgICBjb25zdCBmaW5kJDogYW55ID0gYXdhaXQgUHJvbWlzZS5hbGwoIG9yZGVySWRzLnNwbGl0KCcsJykubWFwKCBvaWQgPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiBkYi5jb2xsZWN0aW9uKCdvcmRlcicpXG4gICAgICAgICAgICAgICAgICAgIC53aGVyZSh7XG4gICAgICAgICAgICAgICAgICAgICAgICBfaWQ6IG9pZFxuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAuZ2V0KCApO1xuICAgICAgICAgICAgfSkpO1xuXG4gICAgICAgICAgICBjb25zdCBsaXN0ID0gZmluZCQubWFwKCB4ID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCB7IF9pZCwgdGlkLCBwaWQsIHNpZCwgcHJpY2UsIGdyb3VwUHJpY2UsIGFjaWQgfSA9IHguZGF0YVsgMCBdO1xuICAgICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgICAgIG9pZDogX2lkLFxuICAgICAgICAgICAgICAgICAgICBhY2lkLCBncm91cFByaWNlLFxuICAgICAgICAgICAgICAgICAgICB0aWQsIHBpZCwgc2lkLCBwcmljZVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAvLyDov5nph4zmnKzmnaXkuI3pnIDopoHlkIzmraXnrYnlvoXotK3nianmuIXljZXnmoTliJvlu7rvvIzkvYbmmK/kuI3liqBhd2FpdOiyjOS8vOayoeacieiiq+aJp+ihjOWIsFxuICAgICAgICAgICAgYXdhaXQgY2xvdWQuY2FsbEZ1bmN0aW9uKHtcbiAgICAgICAgICAgICAgICBuYW1lOiAnc2hvcHBpbmctbGlzdCcsXG4gICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgICAkdXJsOiAnY3JlYXRlJyxcbiAgICAgICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgICAgICAgbGlzdCxcbiAgICAgICAgICAgICAgICAgICAgICAgIG9wZW5JZFxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSlcblxuICAgICAgICAgICAgcmV0dXJuIGN0eC5ib2R5ID0ge1xuICAgICAgICAgICAgICAgIHN0YXR1czogMjAwXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfSBjYXRjaCAoIGUgKSB7IFxuICAgICAgICAgICAgcmV0dXJuIGN0eC5ib2R5ID0geyBzdGF0dXM6IDUwMCB9O1xuICAgICAgICB9IFxuICAgIH0pXG5cbiAgICAvKiogXG4gICAgICogQGRlc2NyaXB0aW9uXG4gICAgICog5Luj6LSt5riF5biQ5YKs5qy+55qE6K6i5Y2V5YiX6KGoXG4gICAgICoge1xuICAgICAqICAgICB0aWQgXG4gICAgICogICAgIG5lZWRDb3Vwb25zOiBmYWxzZSB8IHRydWUgfCB1bmRlZmluZWRcbiAgICAgKiAgICAgbmVlZEFkZHJlc3M6IGZhbHNlIHwgdHJ1ZSB8IHVuZGVmaW5lZFxuICAgICAqIH1cbiAgICAgKi9cbiAgICBhcHAucm91dGVyKCdkYWlnb3UtbGlzdCcsIGFzeW5jKCBjdHgsIG5leHQgKSA9PiB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBjb25zdCB7IHRpZCwgbmVlZENvdXBvbnMsIG5lZWRBZGRyZXNzIH0gPSBldmVudC5kYXRhO1xuXG4gICAgICAgICAgICAvLyDorqLljZXkv6Hmga9cbiAgICAgICAgICAgIGNvbnN0IG9yZGVycyQgPSBhd2FpdCBkYi5jb2xsZWN0aW9uKCdvcmRlcicpXG4gICAgICAgICAgICAgICAgLndoZXJlKHtcbiAgICAgICAgICAgICAgICAgICAgdGlkLFxuICAgICAgICAgICAgICAgICAgICBiYXNlX3N0YXR1czogXy5uZXEoJzUnKSxcbiAgICAgICAgICAgICAgICAgICAgcGF5X3N0YXR1czogXy5vciggXy5lcSgnMScpLCBfLmVxKCcyJykpXG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAuZ2V0KCApO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICAvLyDnlKjmiLfkv6Hmga9cbiAgICAgICAgICAgIGNvbnN0IHVzZXJzJCA9IGF3YWl0IFByb21pc2UuYWxsKFxuICAgICAgICAgICAgICAgIEFycmF5LmZyb20oIFxuICAgICAgICAgICAgICAgICAgICBuZXcgU2V0KCBvcmRlcnMkLmRhdGFcbiAgICAgICAgICAgICAgICAgICAgICAgIC5tYXAoIHggPT4geC5vcGVuaWQgKVxuICAgICAgICAgICAgICAgICkpXG4gICAgICAgICAgICAgICAgLm1hcCggdWlkID0+IGRiLmNvbGxlY3Rpb24oJ3VzZXInKVxuICAgICAgICAgICAgICAgICAgICAud2hlcmUoe1xuICAgICAgICAgICAgICAgICAgICAgICAgb3BlbmlkOiB1aWRcbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgLmdldCggKSlcbiAgICAgICAgICAgICk7XG5cbiAgICAgICAgICAgIC8vIOW/q+mAkui0ueeUqOS/oeaBr1xuICAgICAgICAgICAgY29uc3QgZGVsaXZlcmZlZXMkID0gYXdhaXQgUHJvbWlzZS5hbGwoXG4gICAgICAgICAgICAgICAgQXJyYXkuZnJvbSggXG4gICAgICAgICAgICAgICAgICAgIG5ldyBTZXQoIG9yZGVycyQuZGF0YVxuICAgICAgICAgICAgICAgICAgICAgICAgLm1hcCggeCA9PiB4Lm9wZW5pZCApXG4gICAgICAgICAgICAgICAgKSlcbiAgICAgICAgICAgICAgICAubWFwKCB1aWQgPT4gZGIuY29sbGVjdGlvbignZGVsaXZlci1mZWUnKVxuICAgICAgICAgICAgICAgICAgICAud2hlcmUoe1xuICAgICAgICAgICAgICAgICAgICAgICAgdGlkLFxuICAgICAgICAgICAgICAgICAgICAgICAgb3BlbmlkOiB1aWRcbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgLmdldCggKSlcbiAgICAgICAgICAgICk7XG5cbiAgICAgICAgICAgIC8vIOWcsOWdgOS/oeaBr1xuICAgICAgICAgICAgbGV0IGFkZHJlc3MkOiBhbnkgPSBbIF07XG4gICAgICAgICAgICBpZiAoICEhbmVlZEFkZHJlc3MgfHwgbmVlZEFkZHJlc3MgPT09IHVuZGVmaW5lZCApIHtcbiAgICAgICAgICAgICAgICBhZGRyZXNzJCA9IGF3YWl0IFByb21pc2UuYWxsKFxuICAgICAgICAgICAgICAgICAgICBBcnJheS5mcm9tKFxuICAgICAgICAgICAgICAgICAgICAgICAgbmV3IFNldCggb3JkZXJzJC5kYXRhXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLm1hcCggeCA9PiB4LmFpZCApXG4gICAgICAgICAgICAgICAgICAgICkpXG4gICAgICAgICAgICAgICAgICAgIC5tYXAoIGFpZCA9PiBkYi5jb2xsZWN0aW9uKCdhZGRyZXNzJylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLmRvYyggYWlkIClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLmdldCggKSlcbiAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgXG4gICAgICAgICAgICAvLyDljaHliLjkv6Hmga9cbiAgICAgICAgICAgIGxldCBjb3Vwb25zJDogYW55ID0gWyBdO1xuICAgICAgICAgICAgaWYgKCAhIW5lZWRDb3Vwb25zIHx8IG5lZWRDb3Vwb25zID09PSB1bmRlZmluZWQgKSB7XG4gICAgICAgICAgICAgICAgY291cG9ucyQgPSBhd2FpdCBQcm9taXNlLmFsbChcbiAgICAgICAgICAgICAgICAgICAgQXJyYXkuZnJvbShcbiAgICAgICAgICAgICAgICAgICAgICAgIG5ldyBTZXQoIG9yZGVycyQuZGF0YSBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAubWFwKCB4ID0+IHgub3BlbmlkIClcbiAgICAgICAgICAgICAgICAgICAgKSlcbiAgICAgICAgICAgICAgICAgICAgLm1hcCggb3BlbmlkID0+IGRiLmNvbGxlY3Rpb24oJ2NvdXBvbicpXG4gICAgICAgICAgICAgICAgICAgICAgICAud2hlcmUoIF8ub3IoW1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGlkLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvcGVuaWQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6IF8ub3IoIF8uZXEoJ3RfbWFuamlhbicpLCBfLmVxKCd0X2xpamlhbicpKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb3BlbmlkLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpc1VzZWQ6IGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYW5Vc2VJbk5leHQ6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6ICd0X2RhaWppbidcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBdKSlcbiAgICAgICAgICAgICAgICAgICAgICAgIC5nZXQoIClcbiAgICAgICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGNvbnN0IHVzZXJPZGVycyA9IHVzZXJzJC5tYXAoKCB1c2VyJCwgayApID0+IHtcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICBjb25zdCB1c2VyID0gdXNlciQuZGF0YVsgMCBdO1xuXG4gICAgICAgICAgICAgICAgY29uc3Qgb3JkZXJzID0gb3JkZXJzJC5kYXRhXG4gICAgICAgICAgICAgICAgICAgIC5maWx0ZXIoIHggPT4geC5vcGVuaWQgPT09IHVzZXIub3BlbmlkICk7XG5cbiAgICAgICAgICAgICAgICBjb25zdCBhZGRyZXNzID0gYWRkcmVzcyQubGVuZ3RoID4gMCA/XG4gICAgICAgICAgICAgICAgICAgIGFkZHJlc3MkXG4gICAgICAgICAgICAgICAgICAgICAgICAubWFwKCB4ID0+IHguZGF0YSApXG4gICAgICAgICAgICAgICAgICAgICAgICAuZmlsdGVyKCB4ID0+IHgub3BlbmlkID09PSB1c2VyLm9wZW5pZCApIDpcbiAgICAgICAgICAgICAgICAgICAgdW5kZWZpbmVkO1xuXG4gICAgICAgICAgICAgICAgY29uc3QgY291cG9ucyA9IGNvdXBvbnMkLmxlbmd0aCA+IDAgP1xuICAgICAgICAgICAgICAgICAgICBjb3Vwb25zJFxuICAgICAgICAgICAgICAgICAgICAgICAgLm1hcCggeCA9PiB4LmRhdGEgKVxuICAgICAgICAgICAgICAgICAgICAgICAgLmZpbHRlciggeCA9PiB4Lmxlbmd0aCA+IDAgJiYgeFsgMCBdLm9wZW5pZCA9PT0gdXNlci5vcGVuaWQgKSA6XG4gICAgICAgICAgICAgICAgICAgIHVuZGVmaW5lZDtcblxuICAgICAgICAgICAgICAgIGNvbnN0IGRlbGl2ZXJGZWUgPSBkZWxpdmVyZmVlcyRbIGsgXS5kYXRhWyAwIF0gfHwgbnVsbFxuXG4gICAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICAgICAgdXNlcixcbiAgICAgICAgICAgICAgICAgICAgb3JkZXJzLFxuICAgICAgICAgICAgICAgICAgICBhZGRyZXNzLFxuICAgICAgICAgICAgICAgICAgICBkZWxpdmVyRmVlLFxuICAgICAgICAgICAgICAgICAgICBjb3Vwb25zOiAoISFjb3Vwb25zICYmIGNvdXBvbnMubGVuZ3RoID4gMCApID8gY291cG9uc1sgMCBdIDogWyBdXG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICByZXR1cm4gY3R4LmJvZHkgPSB7XG4gICAgICAgICAgICAgICAgc3RhdHVzOiAyMDAsXG4gICAgICAgICAgICAgICAgZGF0YTogdXNlck9kZXJzXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfSBjYXRjaCAoIGUgKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyggJy4uLicsIGUgKTtcbiAgICAgICAgICAgIHJldHVybiBjdHguYm9keSA9IHsgc3RhdHVzOiA1MDAgfTtcbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgLyoqXG4gICAgICogQGRlc2NyaXB0aW9uXG4gICAgICog5LuO5riF5biQ5YKs5qy+77yM6LCD5pW06K6i5Y2V5YiG6YWN6YePXG4gICAgICoge1xuICAgICAqICAgICAgb2lkLCB0aWQsIHNpZCwgcGlkLCBjb3VudFxuICAgICAqIH1cbiAgICAgKi9cbiAgICBhcHAucm91dGVyKCdhZGp1c3QtY291bnQnLCBhc3luYyggY3R4LCBuZXh0ICkgPT4ge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgY29uc3Qgb3BlbmlkID0gZXZlbnQuZGF0YS5vcGVuSWQgfHwgZXZlbnQudXNlckluZm8ub3BlbklkOyBcbiAgICAgICAgICAgIGNvbnN0IHsgb2lkLCB0aWQsIHNpZCwgcGlkLCBjb3VudCB9ID0gZXZlbnQuZGF0YTtcblxuICAgICAgICAgICAgY29uc3QgZ2V0V3JvbmcgPSBtZXNzYWdlID0+IGN0eC5ib2R5ID0ge1xuICAgICAgICAgICAgICAgIG1lc3NhZ2UsXG4gICAgICAgICAgICAgICAgc3RhdHVzOiA0MDBcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiDmmK/lkKbog73nu6fnu63osIPmlbRcbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgY29uc3Qgb3JkZXIkID0gYXdhaXQgZGIuY29sbGVjdGlvbignb3JkZXInKVxuICAgICAgICAgICAgICAgIC5kb2MoIG9pZCApXG4gICAgICAgICAgICAgICAgLmdldCggKTtcblxuICAgICAgICAgICAgaWYgKCBvcmRlciQuZGF0YS5iYXNlX3N0YXR1cyA9PT0gJzInICkge1xuICAgICAgICAgICAgICAgIHJldHVybiBnZXRXcm9uZygn5YKs5qy+5ZCO5LiN6IO95L+u5pS55pWw6YePJyk7XG5cbiAgICAgICAgICAgIH0gZWxzZSBpZiAoIG9yZGVyJC5kYXRhLmJhc2Vfc3RhdHVzID09PSAnMCcgKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGdldFdyb25nKCfor7flhYjosIPmlbTor6XllYblk4Hku7fmoLwnKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiDkuI3og73lpJrkuo7muIXljZXliIbphY3nmoTmgLvotK3lhaXph49cbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgY29uc3Qgc2hvcHBpbmckID0gYXdhaXQgZGIuY29sbGVjdGlvbignc2hvcHBpbmctbGlzdCcpXG4gICAgICAgICAgICAgICAgLndoZXJlKHtcbiAgICAgICAgICAgICAgICAgICAgdGlkLCBzaWQsIHBpZFxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLmdldCggKTtcbiAgICAgICAgICAgIGNvbnN0IHNob3BwaW5nID0gc2hvcHBpbmckLmRhdGFbIDAgXTtcbiAgICAgICAgICAgIGNvbnN0IGxhc3RPcmRlcnMkID0gYXdhaXQgZGIuY29sbGVjdGlvbignb3JkZXInKVxuICAgICAgICAgICAgICAgIC53aGVyZSh7XG4gICAgICAgICAgICAgICAgICAgIHRpZCwgc2lkLCBwaWQsXG4gICAgICAgICAgICAgICAgICAgIHBheV9zdGF0dXM6IF8ubmVxKCcwJyksXG4gICAgICAgICAgICAgICAgICAgIGJhc2Vfc3RhdHVzOiBfLm9yKCBfLmVxKCcxJyksIF8uZXEoJzInKSwgXy5lcSgnMycpKVxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLmdldCggKTtcblxuICAgICAgICAgICAgY29uc3QgbGFzdE9yZGVycyA9IGxhc3RPcmRlcnMkLmRhdGE7XG4gICAgICAgICAgICBjb25zdCBvdGhlckNvdW50OiBhbnkgPSBsYXN0T3JkZXJzXG4gICAgICAgICAgICAgICAgLmZpbHRlciggbyA9PiBvLl9pZCAhPT0gb2lkIClcbiAgICAgICAgICAgICAgICAucmVkdWNlKCggeCwgeSApID0+IHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHggKyB5LmFsbG9jYXRlZENvdW50IHx8IDBcbiAgICAgICAgICAgICAgICB9LCAwICk7XG5cbiAgICAgICAgICAgIGlmICggY291bnQgKyBvdGhlckNvdW50ID4gc2hvcHBpbmcucHVyY2hhc2UgKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGdldFdyb25nKGDor6XllYblk4HmgLvmlbDph4/kuI3og73lpKfkuo7ph4fotK3mlbAke3Nob3BwaW5nLnB1cmNoYXNlfeS7tu+8gWApO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvKiog5pu05paw6K6i5Y2VICovXG4gICAgICAgICAgICBhd2FpdCBkYi5jb2xsZWN0aW9uKCdvcmRlcicpXG4gICAgICAgICAgICAgICAgLmRvYyggb2lkIClcbiAgICAgICAgICAgICAgICAudXBkYXRlKHtcbiAgICAgICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgICAgICAgYWxsb2NhdGVkQ291bnQ6IGNvdW50XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiDmm7TmlrDmuIXljZVcbiAgICAgICAgICAgICAqIOWwkeS6juaAu+i0reWFpemHj+aXtu+8jOmHjeaWsOiwg+aVtOa4heWNleeahOWJqeS9meWIhumFjemHj1xuICAgICAgICAgICAgICovXG4gICAgICAgICAgICBpZiAoIGNvdW50ICsgb3RoZXJDb3VudCA8IHNob3BwaW5nLnB1cmNoYXNlICkge1xuXG4gICAgICAgICAgICAgICAgY29uc3QgbmV3c2hvcHBpbmcgPSBPYmplY3QuYXNzaWduKHsgfSwgc2hvcHBpbmcsIHtcbiAgICAgICAgICAgICAgICAgICAgbGFzdEFsbG9jYXRlZDogc2hvcHBpbmcucHVyY2hhc2UgLSAoIGNvdW50ICsgb3RoZXJDb3VudCApXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgZGVsZXRlIG5ld3Nob3BwaW5nWydfaWQnXTtcblxuICAgICAgICAgICAgICAgIGF3YWl0IGRiLmNvbGxlY3Rpb24oJ3Nob3BwaW5nLWxpc3QnKVxuICAgICAgICAgICAgICAgICAgICAuZG9jKCBTdHJpbmcoIHNob3BwaW5nLl9pZCApKVxuICAgICAgICAgICAgICAgICAgICAuc2V0KHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRhdGE6IG5ld3Nob3BwaW5nXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gY3R4LmJvZHkgPSB7XG4gICAgICAgICAgICAgICAgc3RhdHVzOiAyMDBcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIFxuICAgICAgICB9IGNhdGNoICggZSApIHtcbiAgICAgICAgICAgIHJldHVybiBjdHguYm9keSA9IHsgc3RhdHVzOiA1MDAgfVxuICAgICAgICB9XG4gICAgfSlcblxuICAgIC8qKlxuICAgICAqIEBkZXNjcmlwdGlvblxuICAgICAqIOaJuemHj+WcsO+8muehruiupOWuouaIt+iuouWNleOAgeaYr+WQpuWboui0reOAgea2iOaBr+aOqOmAgeaTjeS9nFxuICAgICAqIHtcbiAgICAgKiAgICB0aWQsXG4gICAgICogICAgb3JkZXJzOiB7XG4gICAgICogICAgICAgIG9pZFxuICAgICAqICAgICAgICBwaWRcbiAgICAgKiAgICAgICAgc2lkXG4gICAgICogICAgICAgIG9wZW5pZFxuICAgICAqICAgICAgICBwcmVwYXlfaWRcbiAgICAgKiAgICAgICAgZm9ybV9pZFxuICAgICAqICAgICAgICBhbGxvY2F0ZWRDb3VudFxuICAgICAqICAgICAgICBhbGxvY2F0ZWRHcm91cFByaWNlXG4gICAgICogICAgfVsgXVxuICAgICAqICAgIG5vdGlmaWNhdGlvbjogeyBcbiAgICAgKiAgICAgICB0aXRsZSxcbiAgICAgKiAgICAgICBkZXNjLFxuICAgICAqICAgICAgIHRpbWVcbiAgICAgKiAgICB9XG4gICAgICogfVxuICAgICAqL1xuICAgIGFwcC5yb3V0ZXIoJ2JhdGNoLWFkanVzdCcsIGFzeW5jKCBjdHgsIG5leHQgKSA9PiB7XG4gICAgICAgIHRyeSB7XG5cbiAgICAgICAgICAgIC8qKiDmmK/lkKbog73mi7zlm6IgKi9cbiAgICAgICAgICAgIGxldCBjYW5Hcm91cFVzZXJNYXBDb3VudDoge1xuICAgICAgICAgICAgICAgIFsgazogc3RyaW5nIF0gOiBudW1iZXJcbiAgICAgICAgICAgIH0gPSB7IH07XG5cbiAgICAgICAgICAgIGNvbnN0IHsgdGlkLCBvcmRlcnMsIG5vdGlmaWNhdGlvbiB9ID0gZXZlbnQuZGF0YTtcbiAgICAgICAgICAgIGNvbnN0IGdldFdyb25nID0gbWVzc2FnZSA9PiBjdHguYm9keSA9IHtcbiAgICAgICAgICAgICAgICBtZXNzYWdlLFxuICAgICAgICAgICAgICAgIHN0YXR1czogNDAwXG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICBjb25zdCB0cmlwJCA9IGF3YWl0IGRiLmNvbGxlY3Rpb24oJ3RyaXAnKVxuICAgICAgICAgICAgICAgIC5kb2MoIHRpZCApXG4gICAgICAgICAgICAgICAgLmdldCggKTtcbiAgICAgICAgICAgIGNvbnN0IHRyaXAgPSB0cmlwJC5kYXRhO1xuXG4gICAgICAgICAgICAvLyDmnKrnu5PmnZ/vvIzkuJTmnKrmiYvliqjlhbPpl61cbiAgICAgICAgICAgIGlmICggbmV3IERhdGUoICkuZ2V0VGltZSggKSA8IHRyaXAuZW5kX2RhdGUgJiYgIXRyaXAuaXNDbG9zZWQgKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGdldFdyb25nKCfooYznqIvmnKrnu5PmnZ/vvIzor7fmiYvliqjlhbPpl63lvZPliY3ooYznqIsnKTtcblxuICAgICAgICAgICAgfSBlbHNlIGlmICggdHJpcC5jYWxsTW9uZXlUaW1lcyAmJiAgdHJpcC5jYWxsTW9uZXlUaW1lcyA+PSAzICkge1xuICAgICAgICAgICAgICAgIHJldHVybiBnZXRXcm9uZyhg5bey57uP5Y+R6LW36L+HJHt0cmlwLmNhbGxNb25leVRpbWVzfeasoeWCrOasvmApO1xuXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIOabtOaWsOiuouWNlVxuICAgICAgICAgICAgYXdhaXQgUHJvbWlzZS5hbGwoIG9yZGVycy5tYXAoIG9yZGVyID0+IHtcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAvLyDmnInlm6LotK3ku7fjgIHlpKfkuo4y5Lq66LSt5Lmw77yM5LiU6KKr5YiG6YWN5pWw5Z2H5aSn5LqOMO+8jOivpeiuouWNleaJjei+vuWIsOKAnOWboui0reKAneeahOadoeS7tlxuICAgICAgICAgICAgICAgIGNvbnN0IGNhbkdyb3VwID0gISFvcmRlcnMuZmluZCggbyA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBvLm9pZCAhPT0gb3JkZXIub2lkICYmXG4gICAgICAgICAgICAgICAgICAgICAgICBvLm9wZW5pZCAhPT0gb3JkZXIub3BlbmlkICYmIFxuICAgICAgICAgICAgICAgICAgICAgICAgby5waWQgPT09IG9yZGVyLnBpZCAmJiBvLnNpZCA9PT0gb3JkZXIuc2lkICYmXG4gICAgICAgICAgICAgICAgICAgICAgICBvLmFsbG9jYXRlZENvdW50ID4gMCAmJiBvcmRlci5hbGxvY2F0ZWRDb3VudCA+IDAgJiZcbiAgICAgICAgICAgICAgICAgICAgICAgICEhby5hbGxvY2F0ZWRHcm91cFByaWNlXG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICBpZiAoIGNhbkdyb3VwICkge1xuICAgICAgICAgICAgICAgICAgICBjYW5Hcm91cFVzZXJNYXBDb3VudCA9IE9iamVjdC5hc3NpZ24oeyB9LCBjYW5Hcm91cFVzZXJNYXBDb3VudCwge1xuICAgICAgICAgICAgICAgICAgICAgICAgWyBvcmRlci5vcGVuaWQgXTogY2FuR3JvdXBVc2VyTWFwQ291bnRbIG9yZGVyLm9wZW5pZCBdID09PSB1bmRlZmluZWQgPyAxIDogY2FuR3JvdXBVc2VyTWFwQ291bnRbIG9yZGVyLm9wZW5pZCBdICsgMVxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gZGIuY29sbGVjdGlvbignb3JkZXInKVxuICAgICAgICAgICAgICAgICAgICAuZG9jKCBvcmRlci5vaWQgKVxuICAgICAgICAgICAgICAgICAgICAudXBkYXRlKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYW5Hcm91cCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBiYXNlX3N0YXR1czogJzInXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICB9KSk7XG5cbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogIeabtOaWsOi0reeJqea4heWNlVxuICAgICAgICAgICAgICovXG5cbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICog5raI5oGv5o6o6YCBXG4gICAgICAgICAgICAgKiAh5pyq5LuY5YWo5qy+5omN5Y+R6YCBXG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIGNvbnN0IHVzZXJzID0gQXJyYXkuZnJvbShcbiAgICAgICAgICAgICAgICBuZXcgU2V0KFxuICAgICAgICAgICAgICAgICAgICBvcmRlcnNcbiAgICAgICAgICAgICAgICAgICAgICAgIC5tYXAoIG9yZGVyID0+IG9yZGVyLm9wZW5pZCApXG4gICAgICAgICAgICAgICAgICAgICAgICAuZmlsdGVyKCBvcGVuaWQgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiAhIW9yZGVycy5maW5kKCBvcmRlciA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBvcmRlci5vcGVuaWQgPT09IG9wZW5pZCAmJiBTdHJpbmcoIG9yZGVyLnBheV9zdGF0dXMgKSA9PT0gJzEnXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICk7XG5cbiAgICAgICAgICAgIC8qKiDmjqjpgIHpgJrnn6UgKi9cbiAgICAgICAgICAgIGNvbnN0IHJzID0gYXdhaXQgUHJvbWlzZS5hbGwoIHVzZXJzLm1hcCggb3BlbmlkID0+IHtcblxuICAgICAgICAgICAgICAgIGNvbnN0IHRhcmdldCA9IG9yZGVycy5maW5kKCBvcmRlciA9PiBvcmRlci5vcGVuaWQgPT09IG9wZW5pZCAmJlxuICAgICAgICAgICAgICAgICAgICAoISFvcmRlci5wcmVwYXlfaWQgfHwgISFvcmRlci5mb3JtX2lkICkpO1xuXG4gICAgICAgICAgICAgICAgcmV0dXJuIGNsb3VkLmNhbGxGdW5jdGlvbih7XG4gICAgICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0b3VzZXI6IG9wZW5pZCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRpdGxlOiBjYW5Hcm91cFVzZXJNYXBDb3VudFsgU3RyaW5nKCBvcGVuaWQgKV0gP1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYOaLvOWboiR7IGNhbkdyb3VwVXNlck1hcENvdW50WyBTdHJpbmcoIG9wZW5pZCApXX3ku7bvvIHmgqjotK3kubDnmoTllYblk4Hlt7LliLDotKdgIDpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICfmgqjotK3kubDnmoTllYblk4Hlt7LliLDotKcnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aW1lOiBgW+ihjOeoi10ke3RyaXAudGl0bGV9YFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9ybV9pZDogdGFyZ2V0LnByZXBheV9pZCB8fCB0YXJnZXQuZm9ybV9pZFxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICR1cmw6ICdub3RpZmljYXRpb24tZ2V0bW9uZXknXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIG5hbWU6ICdjb21tb24nXG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIH0pKTtcbiBcbiAgICAgICAgICAgIC8vIOabtOaWsOihjOeoi1xuICAgICAgICAgICAgYXdhaXQgZGIuY29sbGVjdGlvbigndHJpcCcpXG4gICAgICAgICAgICAgICAgLmRvYyggdGlkIClcbiAgICAgICAgICAgICAgICAudXBkYXRlKHtcbiAgICAgICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgICAgICAgY2FsbE1vbmV5VGltZXM6IF8uaW5jKCAxIClcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICByZXR1cm4gY3R4LmJvZHkgPSB7XG4gICAgICAgICAgICAgICAgc3RhdHVzOiAyMDAsXG4gICAgICAgICAgICAgICAgLy8g5Ymp5L2Z5qyh5pWwXG4gICAgICAgICAgICAgICAgZGF0YTogMyAtICggMSArIHRyaXAuY2FsbE1vbmV5VGltZXMgKVxuICAgICAgICAgICAgfVxuXG4gICAgICAgIH0gY2F0Y2ggKCBlICkge1xuICAgICAgICAgICAgcmV0dXJuIGN0eC5ib2R5ID0geyBzdGF0dXM6IDUwMCB9O1xuICAgICAgICB9XG4gICAgfSlcblxuICAgIC8qKiBcbiAgICAgKiBAZGVzY3JpcHRpb25cbiAgICAgKiDorqLljZXku5jlsL7mrL5cbiAgICAgKiB7XG4gICAgICogICAgICB0aWQgLy8g6aKG5Luj6YeR5Yi4XG4gICAgICogICAgICBpbnRlZ3JhbCAvLyDnp6/liIbmgLvpop3vvIh1c2Vy6KGo77yJXG4gICAgICogICAgICBvcmRlcnM6IFt7ICBcbiAgICAgKiAgICAgICAgICBvaWQgLy8g6K6i5Y2V54q25oCBXG4gICAgICogICAgICAgICAgcGlkXG4gICAgICogICAgICAgICAgZmluYWxfcHJpY2UgLy8g5pyA57uI5oiQ5Lqk6aKdXG4gICAgICogICAgICAgICAgYWxsb2NhdGVkQ291bnQgLy8g5pyA57uI5oiQ5Lqk6YePXG4gICAgICogICAgICB9XVxuICAgICAqICAgICAgY291cG9uczogWyAvLyDljaHliLjmtojotLlcbiAgICAgKiAgICAgICAgICBpZDEsXG4gICAgICogICAgICAgICAgaWQyLi4uXG4gICAgICogICAgICBdXG4gICAgICogfVxuICAgICAqL1xuICAgIGFwcC5yb3V0ZXIoJ3BheS1sYXN0JywgYXN5bmMoIGN0eCwgbmV4dCApID0+IHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGNvbnN0IG9wZW5pZCA9IGV2ZW50LnVzZXJJbmZvLm9wZW5JZDtcbiAgICAgICAgICAgIGNvbnN0IHsgdGlkLCBpbnRlZ3JhbCwgb3JkZXJzLCBjb3Vwb25zIH0gPSBldmVudC5kYXRhO1xuXG4gICAgICAgICAgICBjb25zdCB1c2VyJCA9IGF3YWl0IGRiLmNvbGxlY3Rpb24oJ3VzZXInKVxuICAgICAgICAgICAgICAgIC53aGVyZSh7XG4gICAgICAgICAgICAgICAgICAgIG9wZW5pZFxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLmdldCggKTtcblxuICAgICAgICAgICAgLy8g5aKe5Yqg56ev5YiG5oC76aKdXG4gICAgICAgICAgICBhd2FpdCBkYi5jb2xsZWN0aW9uKCd1c2VyJylcbiAgICAgICAgICAgICAgICAuZG9jKCBTdHJpbmcoIHVzZXIkLmRhdGFbIDAgXS5faWQgKSlcbiAgICAgICAgICAgICAgICAudXBkYXRlKHtcbiAgICAgICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgICAgICAgaW50ZWdyYWw6IF8uaW5jKCBpbnRlZ3JhbCApXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgLy8g5pu05paw6K6i5Y2V54q25oCB44CB5ZWG5ZOB6ZSA6YePXG4gICAgICAgICAgICBhd2FpdCBQcm9taXNlLmFsbCggb3JkZXJzLm1hcCggb3JkZXIgPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiBQcm9taXNlLmFsbChbXG4gICAgICAgICAgICAgICAgICAgIGRiLmNvbGxlY3Rpb24oJ29yZGVyJylcbiAgICAgICAgICAgICAgICAgICAgICAgIC5kb2MoIG9yZGVyLm9pZCApXG4gICAgICAgICAgICAgICAgICAgICAgICAudXBkYXRlKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJhc2Vfc3RhdHVzOiAnMycsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBheV9zdGF0dXM6ICcyJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZmluYWxfcHJpY2U6IG9yZGVyLmZpbmFsX3ByaWNlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH0pLFxuICAgICAgICAgICAgICAgICAgICBkYi5jb2xsZWN0aW9uKCdnb29kcycpXG4gICAgICAgICAgICAgICAgICAgICAgICAuZG9jKCBvcmRlci5waWQgKVxuICAgICAgICAgICAgICAgICAgICAgICAgLnVwZGF0ZSh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzYWxlZDogXy5pbmMoIG9yZGVyLmFsbG9jYXRlZENvdW50IClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIF0pXG4gICAgICAgICAgICB9KSk7XG5cbiAgICAgICAgICAgIC8vIOabtOaWsOWNoeWIuOS9v+eUqOeKtuaAgVxuICAgICAgICAgICAgYXdhaXQgUHJvbWlzZS5hbGwoIGNvdXBvbnMubWFwKCBjb3Vwb25pZCA9PiB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGRiLmNvbGxlY3Rpb24oJ2NvdXBvbicpXG4gICAgICAgICAgICAgICAgICAgIC5kb2MoIGNvdXBvbmlkIClcbiAgICAgICAgICAgICAgICAgICAgLnVwZGF0ZSh7XG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaXNVc2VkOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHVzZWRCeTogdGlkLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhblVzZUluTmV4dDogZmFsc2VcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIH0pKTtcblxuICAgICAgICAgICAgLy8g6L6+5Yiw5p2h5Lu277yM5YiZ6aKG5Y+W5Luj6YeR5Yi4XG4gICAgICAgICAgICAvLyDlkIzml7bliKDpmaTkuIrkuIDkuKrmnKrkvb/nlKjov4fnmoTku6Pph5HliLhcbiAgICAgICAgICAgIGNvbnN0IHRyaXAkID0gYXdhaXQgZGIuY29sbGVjdGlvbigndHJpcCcpXG4gICAgICAgICAgICAgICAgLmRvYyggdGlkIClcbiAgICAgICAgICAgICAgICAuZ2V0KCApO1xuXG4gICAgICAgICAgICBsZXQgcmVxID0ge1xuICAgICAgICAgICAgICAgIHJlc3VsdDoge1xuICAgICAgICAgICAgICAgICAgICBzdGF0dXM6IDUwMFxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIFxuICAgICAgICAgICAgY29uc3QgeyBjYXNoY291cG9uX2F0bGVhc3QsIGNhc2hjb3Vwb25fdmFsdWVzIH0gPSB0cmlwJC5kYXRhO1xuXG4gICAgICAgICAgICBjb25zdCB0ZW1wID0ge1xuICAgICAgICAgICAgICAgIG9wZW5JZDogb3BlbmlkLFxuICAgICAgICAgICAgICAgIGZyb210aWQ6IHRpZCxcbiAgICAgICAgICAgICAgICB0eXBlOiAndF9kYWlqaW4nLFxuICAgICAgICAgICAgICAgIHRpdGxlOiAn6KGM56iL5Luj6YeR5Yi4JyxcbiAgICAgICAgICAgICAgICBjYW5Vc2VJbk5leHQ6IHRydWUsXG4gICAgICAgICAgICAgICAgaXNVc2VkOiBmYWxzZSxcbiAgICAgICAgICAgICAgICBhdGxlYXN0OiBjYXNoY291cG9uX2F0bGVhc3QgfHwgMCxcbiAgICAgICAgICAgICAgICB2YWx1ZTogY2FzaGNvdXBvbl92YWx1ZXNcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIC8vIOaXoOmcgOmXqOanm++8jOacieS7o+mHkeWIuOWNs+WPr+mihuWPllxuICAgICAgICAgICAgaWYgKCAhIWNhc2hjb3Vwb25fdmFsdWVzICkge1xuXG4gICAgICAgICAgICAgICAgLy8g5Yig6Zmk5LiK5LiA5Liq5pyq5L2/55So55qE5Luj6YeR5Yi4XG4gICAgICAgICAgICAgICAgY29uc3QgbGFzdERhaWppbiQgPSBhd2FpdCBkYi5jb2xsZWN0aW9uKCdjb3Vwb24nKVxuICAgICAgICAgICAgICAgICAgICAud2hlcmUoe1xuICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogJ3RfZGFpamluJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGlzVXNlZDogZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgICAgICBjYW5Vc2VJbk5leHQ6IHRydWVcbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgLmdldCggKTtcblxuICAgICAgICAgICAgICAgIGlmICggbGFzdERhaWppbiQuZGF0YVsgMCBdKSB7XG4gICAgICAgICAgICAgICAgICAgIGF3YWl0IGRiLmNvbGxlY3Rpb24oJ2NvdXBvbicpXG4gICAgICAgICAgICAgICAgICAgICAgICAuZG9jKCBTdHJpbmcoIGxhc3REYWlqaW4kLmRhdGFbIDAgXS5faWQgKSlcbiAgICAgICAgICAgICAgICAgICAgICAgIC5yZW1vdmUoICk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgLy8g6aKG5Y+W5Luj6YeR5Yi4XG4gICAgICAgICAgICAgICAgcmVxID0gYXdhaXQgY2xvdWQuY2FsbEZ1bmN0aW9uKHtcbiAgICAgICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgICAgICAgZGF0YTogdGVtcCxcbiAgICAgICAgICAgICAgICAgICAgICAgICR1cmw6ICdjcmVhdGUnXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIG5hbWU6ICdjb3Vwb24nXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiBjdHguYm9keSA9IHtcbiAgICAgICAgICAgICAgICBzdGF0dXM6IDIwMCxcbiAgICAgICAgICAgICAgICBkYXRhOiByZXEucmVzdWx0LnN0YXR1cyA9PT0gMjAwID8gdGVtcCA6IG51bGwgXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfSBjYXRjaCAoIGUgKSB7XG4gICAgICAgICAgICByZXR1cm4gY3R4LmJvZHkgPSB7IHN0YXR1czogNTAwIH1cbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgLyoqIFxuICAgICAqIEBkZXNjcmlwdGlvblxuICAgICAqIOS7o+i0reiOt+WPluacquivu+iuouWNlVxuICAgICAqL1xuICAgIGFwcC5yb3V0ZXIoJ3VucmVhZCcsIGFzeW5jKCBjdHgsIG5leHQgKSA9PiB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBjb25zdCB7IHRpZCwgbGFzdFRpbWUgfSA9IGV2ZW50LmRhdGE7XG4gICAgICAgICAgICBsZXQgd2hlcmUkID0ge1xuICAgICAgICAgICAgICAgIHRpZFxuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgaWYgKCBsYXN0VGltZSApIHtcbiAgICAgICAgICAgICAgICB3aGVyZSQgPSBPYmplY3QuYXNzaWduKHsgfSwgd2hlcmUkLCB7XG4gICAgICAgICAgICAgICAgICAgIGNyZWF0ZXRpbWU6IF8uZ3RlKCBsYXN0VGltZSApXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGNvbnN0IGRhdGEkID0gYXdhaXQgZGIuY29sbGVjdGlvbignb3JkZXInKVxuICAgICAgICAgICAgICAgIC53aGVyZSggd2hlcmUkIClcbiAgICAgICAgICAgICAgICAuY291bnQoICk7XG5cbiAgICAgICAgICAgIHJldHVybiBjdHguYm9keSA9IHtcbiAgICAgICAgICAgICAgICBzdGF0dXM6IDIwMCxcbiAgICAgICAgICAgICAgICBkYXRhOiBkYXRhJC50b3RhbFxuICAgICAgICAgICAgfVxuXG4gICAgICAgIH0gY2F0Y2ggKCBlICkgeyByZXR1cm4gY3R4LmJvZHkgPSB7IHN0YXR1czogNTAwIH07fVxuICAgIH0pO1xuXG4gICAgLyoqIFxuICAgICAqIEBkZXNjcmlwdGlvblxuICAgICAqIOS7o+i0reafpeeci+aJgOacieeahOiuouWNleWIl+ihqFxuICAgICAqL1xuICAgIGFwcC5yb3V0ZXIoJ2xpc3QtYWxsJywgYXN5bmMoIGN0eCwgbmV4dCApID0+IHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIC8vIOafpeivouadoeaVsFxuICAgICAgICAgICAgY29uc3QgbGltaXQgPSAxMDtcbiAgICAgICAgICAgIGNvbnN0IHsgdGlkLCBwYWdlIH0gPSBldmVudC5kYXRhO1xuXG4gICAgICAgICAgICBjb25zdCB3aGVyZSQgPSB7XG4gICAgICAgICAgICAgICAgdGlkLFxuICAgICAgICAgICAgICAgIHBheV9zdGF0dXM6IF8ubmVxKCcwJylcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIGNvbnN0IHRvdGFsJCA9IGF3YWl0IGRiLmNvbGxlY3Rpb24oJ29yZGVyJylcbiAgICAgICAgICAgICAgICAud2hlcmUoIHdoZXJlJCApXG4gICAgICAgICAgICAgICAgLmNvdW50KCApO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICBjb25zdCBvcmRlcnMkID0gYXdhaXQgZGIuY29sbGVjdGlvbignb3JkZXInKVxuICAgICAgICAgICAgICAgIC53aGVyZSggd2hlcmUkIClcbiAgICAgICAgICAgICAgICAubGltaXQoIGxpbWl0IClcbiAgICAgICAgICAgICAgICAuc2tpcCgoIHBhZ2UgLSAxICkgKiBsaW1pdCApXG4gICAgICAgICAgICAgICAgLm9yZGVyQnkoJ2NyZWF0ZVRpbWUnLCAnZGVzYycpXG4gICAgICAgICAgICAgICAgLmdldCggKTtcblxuICAgICAgICAgICAgY29uc3QgcGlkcyA9IEFycmF5LmZyb20oXG4gICAgICAgICAgICAgICAgbmV3IFNldCggXG4gICAgICAgICAgICAgICAgICAgIG9yZGVycyQuZGF0YVxuICAgICAgICAgICAgICAgICAgICAgICAgLm1hcCggeCA9PiB4LnBpZCApXG4gICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgKTtcblxuICAgICAgICAgICAgY29uc3Qgc2lkcyA9IEFycmF5LmZyb20oXG4gICAgICAgICAgICAgICAgbmV3IFNldCggXG4gICAgICAgICAgICAgICAgICAgIG9yZGVycyQuZGF0YVxuICAgICAgICAgICAgICAgICAgICAgICAgLm1hcCggeCA9PiB4LnNpZCApXG4gICAgICAgICAgICAgICAgICAgICAgICAuZmlsdGVyKCB4ID0+ICEheCApXG4gICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgKTtcblxuICAgICAgICAgICAgY29uc3QgdWlkcyA9IEFycmF5LmZyb20oXG4gICAgICAgICAgICAgICAgbmV3IFNldCggXG4gICAgICAgICAgICAgICAgICAgIG9yZGVycyQuZGF0YVxuICAgICAgICAgICAgICAgICAgICAgICAgLm1hcCggeCA9PiB4Lm9wZW5pZCApXG4gICAgICAgICAgICAgICAgICAgICAgICAuZmlsdGVyKCB4ID0+ICEheCApXG4gICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgKTtcblxuICAgICAgICAgICAgLy8gY29uc3QgZ29vZHMkJCA9IGF3YWl0IFByb21pc2UuYWxsKFxuICAgICAgICAgICAgLy8gICAgIHBpZHMubWFwKCBcbiAgICAgICAgICAgIC8vICAgICAgICAgcGlkID0+IGRiLmNvbGxlY3Rpb24oJ2dvb2RzJylcbiAgICAgICAgICAgIC8vICAgICAgICAgICAgIC5kb2MoIFN0cmluZyggcGlkICkpXG4gICAgICAgICAgICAvLyAgICAgICAgICAgICAuZ2V0KCApXG4gICAgICAgICAgICAvLyAgICAgKVxuICAgICAgICAgICAgLy8gKTtcbiAgICAgICAgICAgIC8vIGNvbnN0IGdvb2RzJCA9IGdvb2RzJCQubWFwKCB4ID0+IHguZGF0YSApO1xuXG4gICAgICAgICAgICAvLyBjb25zdCBzdGFuZGFycyQkID0gYXdhaXQgUHJvbWlzZS5hbGwoXG4gICAgICAgICAgICAvLyAgICAgc2lkcy5tYXAoIFxuICAgICAgICAgICAgLy8gICAgICAgICBzaWQgPT4gZGIuY29sbGVjdGlvbignc3RhbmRhcmRzJylcbiAgICAgICAgICAgIC8vICAgICAgICAgICAgIC5kb2MoIFN0cmluZyggc2lkICkpXG4gICAgICAgICAgICAvLyAgICAgICAgICAgICAuZmllbGQoe1xuICAgICAgICAgICAgLy8gICAgICAgICAgICAgICAgIHBpZDogdHJ1ZSxcbiAgICAgICAgICAgIC8vICAgICAgICAgICAgICAgICBuYW1lOiB0cnVlXG4gICAgICAgICAgICAvLyAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgLy8gICAgICAgICAgICAgLmdldCggKVxuICAgICAgICAgICAgLy8gICAgIClcbiAgICAgICAgICAgIC8vICk7XG4gICAgICAgICAgICAvLyBjb25zdCBzdGFuZGFycyQgPSBzdGFuZGFycyQkLm1hcCggeCA9PiB4LmRhdGEgKTtcblxuICAgICAgICAgICAgY29uc3QgdXNlcnMkJCA9IGF3YWl0IFByb21pc2UuYWxsKFxuICAgICAgICAgICAgICAgIHVpZHMubWFwKCBcbiAgICAgICAgICAgICAgICAgICAgb3BlbmlkID0+IGRiLmNvbGxlY3Rpb24oJ3VzZXInKVxuICAgICAgICAgICAgICAgICAgICAgICAgLndoZXJlKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvcGVuaWRcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgICAgICAuZmllbGQoe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9wZW5pZDogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhdmF0YXJVcmw6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbmlja05hbWU6IHRydWVcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgICAgICAuZ2V0KCApXG4gICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIGNvbnN0IHVzZXJzJCA9IHVzZXJzJCQubWFwKCB4ID0+IHguZGF0YVsgMCBdKTtcblxuICAgICAgICAgICAgY29uc3QgbWV0YSA9IG9yZGVycyQuZGF0YS5tYXAoIG9yZGVyID0+IHtcblxuICAgICAgICAgICAgICAgIGNvbnN0IHVzZXIgPSB1c2VycyQuZmluZCggdXNlciA9PiB1c2VyLm9wZW5pZCA9PT0gb3JkZXIub3BlbmlkICk7XG4gICAgICAgICAgICAgICAgLy8gY29uc3QgZGV0YWlsID0gZ29vZHMkLmZpbmQoIGdvb2QgPT4gZ29vZC5faWQgPT09IG9yZGVyLnBpZCApO1xuICAgICAgICAgICAgICAgIC8vIGNvbnN0IHN0YW5kYXIgPSBzdGFuZGFycyQuZmluZCggcyA9PiBzLl9pZCA9PT0gb3JkZXIuc2lkICk7XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gT2JqZWN0LmFzc2lnbih7IH0sIG9yZGVyLCB7XG4gICAgICAgICAgICAgICAgICAgIHVzZXIsXG4gICAgICAgICAgICAgICAgICAgIC8vIGRldGFpbCxcbiAgICAgICAgICAgICAgICAgICAgLy8gc3RhbmRhclxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgcmV0dXJuIGN0eC5ib2R5ID0ge1xuICAgICAgICAgICAgICAgIHN0YXR1czogMjAwLFxuICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgcGFnZSxcbiAgICAgICAgICAgICAgICAgICAgcGFnZVNpemU6IGxpbWl0LFxuICAgICAgICAgICAgICAgICAgICBkYXRhOiBtZXRhLFxuICAgICAgICAgICAgICAgICAgICB0b3RhbDogdG90YWwkLnRvdGFsLFxuICAgICAgICAgICAgICAgICAgICB0b3RhbFBhZ2U6IE1hdGguY2VpbCggdG90YWwkLnRvdGFsIC8gbGltaXQgKVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuXG4gICAgICAgIH0gY2F0Y2ggKCBlICkgeyBcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCc/Pz8nLCBlIClcbiAgICAgICAgICAgIHJldHVybiBjdHguYm9keSA9IHsgc3RhdHVzOiA1MDAgfVxuICAgICAgICB9XG4gICAgfSlcbiBcbiAgIHJldHVybiBhcHAuc2VydmUoICk7XG5cbn0iXX0=