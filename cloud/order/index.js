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
                            if (!t['sid']) {
                                delete t['sid'];
                            }
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFDQSxpQkFnbUNDOztBQWhtQ0QscUNBQXVDO0FBQ3ZDLHNDQUF3QztBQUN4QyxtQ0FBbUM7QUFFbkMsS0FBSyxDQUFDLElBQUksQ0FBQztJQUNQLEdBQUcsRUFBRSxPQUFPLENBQUMsR0FBRyxDQUFDLEtBQUs7Q0FDekIsQ0FBQyxDQUFDO0FBRUgsSUFBTSxFQUFFLEdBQWdCLEtBQUssQ0FBQyxRQUFRLEVBQUcsQ0FBQztBQUUxQyxJQUFNLENBQUMsR0FBRyxFQUFFLENBQUMsT0FBTyxDQUFDO0FBbUNSLFFBQUEsSUFBSSxHQUFHLFVBQVEsS0FBSyxFQUFFLE9BQU87Ozs7UUFFaEMsR0FBRyxHQUFHLElBQUksU0FBUyxDQUFDLEVBQUUsS0FBSyxPQUFBLEVBQUUsQ0FBQyxDQUFDO1FBaUNyQyxHQUFHLENBQUMsTUFBTSxDQUFDLFFBQVEsRUFBRSxVQUFPLEdBQUcsRUFBRSxJQUFJOzs7Ozs7d0JBR3ZCLEtBQXdCLEtBQUssQ0FBQyxJQUFJLEVBQWhDLEdBQUcsU0FBQSxFQUFFLElBQUksVUFBQSxFQUFFLE1BQU0sWUFBQSxDQUFnQjt3QkFDbkMsV0FBUyxLQUFLLENBQUMsSUFBSSxDQUFDLE1BQU0sSUFBSSxLQUFLLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQzt3QkFHMUMsV0FBTSxLQUFLLENBQUMsWUFBWSxDQUFDO2dDQUNyQyxJQUFJLEVBQUU7b0NBQ0YsSUFBSSxFQUFFO3dDQUNGLEdBQUcsRUFBRSxHQUFHO3FDQUNYO29DQUNELElBQUksRUFBRSxRQUFRO2lDQUNqQjtnQ0FDRCxJQUFJLEVBQUUsTUFBTTs2QkFDZixDQUFDLEVBQUE7O3dCQVJJLE9BQU8sR0FBRyxTQVFkO3dCQUVJLE1BQU0sR0FBRyxPQUFPLENBQUMsTUFBTSxDQUFDO3dCQUM5QixJQUFLLE1BQU0sQ0FBQyxNQUFNLEtBQUssR0FBRzsrQkFDZixDQUFDLE1BQU0sQ0FBQyxJQUFJOytCQUNaLENBQUUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxJQUFJLElBQUksTUFBTSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUU7K0JBQ3pDLENBQUUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxJQUFJLElBQUksSUFBSSxJQUFJLEVBQUcsQ0FBQyxPQUFPLEVBQUcsSUFBSSxNQUFNLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBRSxFQUFFOzRCQUM1RSxNQUFNLGdCQUFnQixDQUFBO3lCQUN6Qjt3QkFHSyxJQUFJLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQzt3QkFLckIsVUFBVSxHQUFHOzRCQUNiLE1BQU0sRUFBRTtnQ0FDSixJQUFJLEVBQUUsSUFBSTtnQ0FDVixNQUFNLEVBQUUsR0FBRzs2QkFDZDt5QkFDSixDQUFDOzZCQUdHLENBQUEsS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLEtBQUssTUFBTSxJQUFJLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxLQUFLLFFBQVEsSUFBSSxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksS0FBSyxLQUFLLENBQUEsRUFBdkYsY0FBdUY7d0JBQzNFLFdBQU0sS0FBSyxDQUFDLFlBQVksQ0FBQztnQ0FDbEMsSUFBSSxFQUFFO29DQUNGLElBQUksRUFBRTt3Q0FDRixNQUFNLEVBQUUsUUFBTTt3Q0FDZCxPQUFPLEVBQUUsS0FBSyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUUsQ0FBQyxDQUFFLENBQUMsT0FBTztxQ0FDMUM7b0NBQ0QsSUFBSSxFQUFFLGNBQWM7aUNBQ3ZCO2dDQUNELElBQUksRUFBRSxTQUFTOzZCQUNsQixDQUFDLEVBQUE7O3dCQVRGLFVBQVUsR0FBRyxTQVNYLENBQUM7Ozt3QkFJUCxJQUFJLENBQUUsS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLEtBQUssTUFBTSxJQUFJLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxLQUFLLFFBQVEsQ0FBRSxJQUFJLFVBQVUsQ0FBQyxNQUFNLENBQUMsTUFBTSxLQUFLLEdBQUcsRUFBRzs0QkFDckcsTUFBTSxRQUFRLENBQUM7eUJBQ2xCO3dCQUdLLFFBQU0sVUFBVSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUM7d0JBR3BCLFdBQU0sS0FBSyxDQUFDLFlBQVksQ0FBQztnQ0FDcEMsSUFBSSxFQUFFLFFBQVE7Z0NBQ2QsSUFBSSxFQUFFO29DQUNGLElBQUksRUFBRSxpQkFBaUI7b0NBQ3ZCLElBQUksRUFBRTt3Q0FDRixNQUFNLEVBQUUsUUFBTTtxQ0FDakI7aUNBQ0o7NkJBQ0osQ0FBQyxFQUFBOzt3QkFSSSxNQUFNLEdBQUcsU0FRYjt3QkFFSSxLQUFLLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUM7d0JBVTdCLGVBQWEsR0FBRyxDQUFDO3dCQUNmLENBQUMsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDO3dCQUV2QixJQUFLLEtBQUssSUFBSSxDQUFDLEtBQUssR0FBRyxFQUFHOzRCQUN0QixZQUFVLEdBQUcsR0FBRyxDQUFBO3lCQUVuQjs2QkFBTSxJQUFLLEtBQUssSUFBSSxDQUFDLEtBQUssR0FBRyxFQUFHOzRCQUM3QixZQUFVLEdBQUcsR0FBRyxDQUFBO3lCQUVuQjs2QkFBTSxJQUFLLEtBQUssSUFBSSxDQUFDLEtBQUssR0FBRyxFQUFHOzRCQUM3QixZQUFVLEdBQUcsR0FBRyxDQUFBO3lCQUVuQjs2QkFBTSxJQUFLLENBQUMsS0FBSyxJQUFJLENBQUMsS0FBSyxHQUFHLEVBQUc7NEJBQzlCLFlBQVUsR0FBRyxHQUFHLENBQUE7eUJBRW5COzZCQUFNLElBQUssQ0FBQyxLQUFLLElBQUksQ0FBQyxLQUFLLEdBQUcsRUFBRzs0QkFDOUIsWUFBVSxHQUFHLEdBQUcsQ0FBQTt5QkFFbkI7NkJBQU0sSUFBSyxDQUFDLEtBQUssSUFBSSxDQUFDLEtBQUssR0FBRyxFQUFHOzRCQUM5QixZQUFVLEdBQUcsR0FBRyxDQUFBO3lCQUVuQjs2QkFBTTs0QkFDSCxZQUFVLEdBQUcsR0FBRyxDQUFBO3lCQUVuQjt3QkFHSyxTQUFPLEtBQUssQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBRSxVQUFBLElBQUk7NEJBQ3BDLElBQU0sQ0FBQyxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUMsRUFBRyxFQUFFLElBQUksRUFBRTtnQ0FJL0IsR0FBRyxPQUFBO2dDQUNILFVBQVUsRUFBRSxJQUFJO2dDQUNoQixNQUFNLEVBQUUsUUFBTTtnQ0FDZCxjQUFjLEVBQUUsR0FBRztnQ0FDbkIsV0FBVyxFQUFFLEdBQUc7Z0NBQ2hCLFVBQVUsRUFBRSxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsWUFBVTtnQ0FDakQsVUFBVSxFQUFFLElBQUksSUFBSSxFQUFHLENBQUMsT0FBTyxFQUFHO2dDQUNsQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLFFBQVE7NkJBQ25ELENBQUMsQ0FBQzs0QkFDSCxPQUFPLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQzs0QkFFcEIsSUFBSyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsRUFBRztnQ0FDYixPQUFPLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQzs2QkFDbkI7NEJBRUQsT0FBTyxDQUFDLENBQUM7d0JBQ2IsQ0FBQyxDQUFDLENBQUM7d0JBR2dCLFdBQU0sT0FBTyxDQUFDLEdBQUcsQ0FBRSxNQUFJLENBQUMsR0FBRyxDQUFFLFVBQUEsQ0FBQztnQ0FDN0MsT0FBTyxnQkFBTyxDQUFFLFFBQU0sRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLEdBQUcsQ0FBRSxDQUFDOzRCQUN6QyxDQUFDLENBQUMsQ0FBQyxFQUFBOzt3QkFGRyxLQUFLLEdBQVEsU0FFaEI7d0JBRUgsSUFBSyxLQUFLLENBQUMsSUFBSSxDQUFFLFVBQUEsQ0FBQyxJQUFJLE9BQUEsQ0FBQyxDQUFDLE1BQU0sS0FBSyxHQUFHLEVBQWhCLENBQWdCLENBQUUsRUFBRTs0QkFDdEMsTUFBTSxTQUFTLENBQUE7eUJBQ2xCO3dCQUdLLFlBQVksR0FBRyxLQUFLLENBQUMsR0FBRyxDQUFDLFVBQUUsQ0FBQyxFQUFFLENBQUM7NEJBQzNCLElBQUEsY0FBc0QsRUFBcEQsZ0JBQUssRUFBRSxnQkFBSyxFQUFFLDBCQUFVLEVBQUUsOEJBQTBCLENBQUM7NEJBQzdELE9BQU87Z0NBQ0gsR0FBRyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRztnQ0FDZixLQUFLLE9BQUE7Z0NBQ0wsS0FBSyxPQUFBO2dDQUNMLFVBQVUsWUFBQTtnQ0FDVixZQUFZLGNBQUE7NkJBQ2YsQ0FBQTt3QkFDTCxDQUFDLENBQUMsQ0FBQzt3QkFFSCxXQUFPLEdBQUcsQ0FBQyxJQUFJLEdBQUc7Z0NBQ2QsTUFBTSxFQUFFLEdBQUc7Z0NBQ1gsSUFBSSxFQUFFLFlBQVk7NkJBQ3JCLEVBQUM7Ozt3QkFJRixXQUFPLEdBQUcsQ0FBQyxJQUFJLEdBQUc7Z0NBQ2QsTUFBTSxFQUFFLEdBQUc7Z0NBQ1gsT0FBTyxFQUFFLEdBQUM7NkJBQ2IsRUFBQzs7OzthQUVULENBQUMsQ0FBQztRQXFCSCxHQUFHLENBQUMsTUFBTSxDQUFDLE1BQU0sRUFBRSxVQUFPLEdBQUcsRUFBRSxJQUFJOzs7Ozs7d0JBR3ZCLE1BQU0sR0FBRyxFQUFHLENBQUM7d0JBQ1gsS0FBOEIsS0FBSyxDQUFDLElBQUksRUFBdEMsSUFBSSxVQUFBLEVBQUUsR0FBRyxTQUFBLEVBQUUsWUFBWSxrQkFBQSxDQUFnQjt3QkFHekMsS0FBSyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUM7d0JBRXRCLE1BQU0sR0FBRyxLQUFLLENBQUMsSUFBSSxDQUFDLE1BQU0sSUFBSSxLQUFLLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQzt3QkFJMUQsSUFBSyxJQUFJLEtBQUssUUFBUSxFQUFHOzRCQUNyQixNQUFNLEdBQUc7Z0NBQ0wsTUFBTSxFQUFFLE1BQU07NkJBQ2pCLENBQUE7eUJBR0o7NkJBQU0sSUFBSyxJQUFJLEtBQUssV0FBVyxFQUFHOzRCQUMvQixNQUFNLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQztnQ0FDWCxNQUFNLFFBQUE7Z0NBQ04sV0FBVyxFQUFFLEdBQUc7NkJBQ25CLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQztnQ0FDSjtvQ0FDSSxJQUFJLEVBQUUsS0FBSztpQ0FDZCxFQUFFO29DQUNDLFVBQVUsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQztpQ0FDMUM7NkJBQ0osQ0FBQyxDQUFDLENBQUM7eUJBR1A7NkJBQU0sSUFBSyxJQUFJLEtBQUssV0FBVyxFQUFHOzRCQUMvQixNQUFNLEdBQUc7Z0NBQ0wsTUFBTSxRQUFBO2dDQUNOLFVBQVUsRUFBRSxHQUFHO2dDQUNmLGNBQWMsRUFBRSxHQUFHOzZCQUN0QixDQUFDO3lCQUdMOzZCQUFNLElBQUssSUFBSSxLQUFLLFdBQVcsRUFBRzs0QkFDL0IsTUFBTSxHQUFHO2dDQUNMLE1BQU0sUUFBQTtnQ0FDTixVQUFVLEVBQUUsR0FBRztnQ0FDZixjQUFjLEVBQUUsR0FBRzs2QkFDdEIsQ0FBQzt5QkFDTDt3QkFHRCxJQUFLLFlBQVksS0FBSyxLQUFLLEVBQUc7NEJBQzFCLE1BQU0sR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDLEVBQUcsRUFBRSxNQUFNLEVBQUU7Z0NBQ2hDLFdBQVcsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQzs2QkFDMUIsQ0FBQyxDQUFDO3lCQUNOO3dCQUdELElBQUssR0FBRyxFQUFHOzRCQUNQLE1BQU0sR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDLEVBQUcsRUFBRSxNQUFNLEVBQUU7Z0NBQ2hDLEdBQUcsS0FBQTs2QkFDTixDQUFDLENBQUM7eUJBQ047d0JBR2MsV0FBTSxFQUFFLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQztpQ0FDdEMsS0FBSyxDQUFFLE1BQU0sQ0FBRTtpQ0FDZixLQUFLLEVBQUcsRUFBQTs7d0JBRlAsTUFBTSxHQUFHLFNBRUY7d0JBTUMsV0FBTSxFQUFFLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQztpQ0FDckMsS0FBSyxDQUFFLE1BQU0sQ0FBRTtpQ0FDZixPQUFPLENBQUMsWUFBWSxFQUFFLE1BQU0sQ0FBQztpQ0FDN0IsS0FBSyxDQUFFLEtBQUssQ0FBRTtpQ0FDZCxJQUFJLENBQUUsS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLElBQUksQ0FBRSxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksR0FBRyxDQUFDLENBQUUsR0FBRyxLQUFLLENBQUU7aUNBQzFELEdBQUcsRUFBRyxFQUFBOzt3QkFMTCxLQUFLLEdBQUcsU0FLSDt3QkFTTCxJQUFJLEdBQUcsS0FBSyxDQUFDLElBQUksQ0FBRSxLQUFLLENBQUMsSUFBSSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUUsQ0FBQzt3QkFFN0MsSUFBSSxHQUFROzRCQUNaLElBQUksRUFBRSxFQUFHO3lCQUNaLENBQUM7NkJBR0csQ0FBQSxJQUFJLElBQUksQ0FBQyxHQUFHLENBQUEsRUFBWixjQUFZO3dCQUNOLFdBQU0sRUFBRSxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUM7aUNBQzlCLEtBQUssQ0FBQztnQ0FDSCxNQUFNLFFBQUE7Z0NBQ04sR0FBRyxFQUFFLElBQUksQ0FBQyxHQUFHO2dDQUNiLFdBQVcsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQzs2QkFDMUIsQ0FBQztpQ0FDRCxPQUFPLENBQUMsWUFBWSxFQUFFLE1BQU0sQ0FBQztpQ0FDN0IsSUFBSSxDQUFFLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksR0FBRyxLQUFLLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBRSxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksR0FBRyxDQUFDLENBQUUsR0FBRyxLQUFLLEdBQUcsS0FBSyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUU7aUNBQ25ILEdBQUcsRUFBRyxFQUFBOzt3QkFSWCxJQUFJLEdBQUcsU0FRSSxDQUFDOzs7d0JBR1YsSUFBSSxHQUFRLEtBQUssQ0FBQyxJQUFJLFFBQUssSUFBSSxDQUFDLElBQUksQ0FBRSxDQUFDO3dCQUd2QyxPQUFPLEdBQUcsS0FBSyxDQUFDLElBQUksQ0FDdEIsSUFBSSxHQUFHLENBQUUsSUFBSSxDQUFDLEdBQUcsQ0FBRSxVQUFBLENBQUMsSUFBSSxPQUFBLENBQUMsQ0FBQyxHQUFHLEVBQUwsQ0FBSyxDQUFFLENBQUMsQ0FDbkMsQ0FBQzt3QkFFYSxXQUFNLE9BQU8sQ0FBQyxHQUFHLENBQUUsT0FBTyxDQUFDLEdBQUcsQ0FBRSxVQUFBLEdBQUc7Z0NBQzlDLE9BQU8sRUFBRSxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUM7cUNBQ3ZCLEtBQUssQ0FBQztvQ0FDSCxHQUFHLEVBQUUsR0FBRztpQ0FDWCxDQUFDO3FDQUNELEdBQUcsRUFBRyxDQUFDOzRCQUNoQixDQUFDLENBQUMsQ0FBQyxFQUFBOzt3QkFORyxXQUFTLFNBTVo7d0JBR0csS0FBSyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsVUFBRSxDQUFDLEVBQUUsQ0FBQyxJQUFNLE9BQUEsTUFBTSxDQUFDLE1BQU0sQ0FBQyxFQUFHLEVBQUUsQ0FBQyxFQUFFOzRCQUVyRCxJQUFJLEVBQUcsUUFBTSxDQUFDLElBQUksQ0FBRSxVQUFBLENBQUMsSUFBSSxPQUFBLENBQUMsQ0FBQyxJQUFJLENBQUUsQ0FBQyxDQUFFLENBQUMsR0FBRyxLQUFLLENBQUMsQ0FBQyxHQUFHLEVBQXpCLENBQXlCLENBQVUsQ0FBQyxJQUFJLENBQUUsQ0FBQyxDQUFFO3lCQUN6RSxDQUFDLEVBSGlDLENBR2pDLENBQUMsQ0FBQzt3QkFFSixXQUFPLEdBQUcsQ0FBQyxJQUFJLEdBQUc7Z0NBQ2QsTUFBTSxFQUFFLEdBQUc7Z0NBQ1gsSUFBSSxFQUFFO29DQUNGLElBQUksRUFBRSxLQUFLO29DQUNYLFFBQVEsRUFBRSxLQUFLO29DQUNmLEtBQUssRUFBRSxNQUFNLENBQUMsS0FBSztvQ0FDbkIsSUFBSSxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLEdBQUcsS0FBSyxDQUFFO29DQUN4RyxPQUFPLEVBQUUsS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUUsS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLEdBQUcsQ0FBQyxDQUFFLEdBQUcsS0FBSyxHQUFHLElBQUksQ0FBQyxNQUFNO29DQUN4RyxTQUFTLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBRSxNQUFNLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBRTtpQ0FDL0M7NkJBQ0osRUFBQTs7O3dCQUVXLFdBQU8sR0FBRyxDQUFDLElBQUksR0FBRyxFQUFFLE1BQU0sRUFBRSxHQUFHLEVBQUMsRUFBQzs7OzthQUNwRCxDQUFDLENBQUE7UUFRRixHQUFHLENBQUMsTUFBTSxDQUFDLGlCQUFpQixFQUFFLFVBQU8sR0FBRyxFQUFFLElBQUk7Ozs7Ozt3QkFHaEMsTUFBTSxHQUFHLEtBQUssQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDO3dCQUMvQixLQUFtQyxLQUFLLENBQUMsSUFBSSxFQUEzQyxRQUFRLGNBQUEsRUFBRSwwQkFBUyxFQUFFLHNCQUFPLENBQWdCO3dCQUdwRCxXQUFNLE9BQU8sQ0FBQyxHQUFHLENBQUUsUUFBUSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUUsVUFBQSxHQUFHO2dDQUMzQyxPQUFPLEVBQUUsQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLENBQUMsR0FBRyxDQUFFLEdBQUcsQ0FBRTtxQ0FDbkMsTUFBTSxDQUFDO29DQUNKLElBQUksRUFBRTt3Q0FDRixPQUFPLFdBQUE7d0NBQ1AsU0FBUyxhQUFBO3dDQUNULFVBQVUsRUFBRSxHQUFHO3FDQUNsQjtpQ0FDSixDQUFDLENBQUM7NEJBQ1gsQ0FBQyxDQUFDLENBQUMsRUFBQTs7d0JBVEgsU0FTRyxDQUFDO3dCQUdlLFdBQU0sT0FBTyxDQUFDLEdBQUcsQ0FBRSxRQUFRLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBRSxVQUFBLEdBQUc7Z0NBQzlELE9BQU8sRUFBRSxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUM7cUNBQ3hCLEtBQUssQ0FBQztvQ0FDSCxHQUFHLEVBQUUsR0FBRztpQ0FDWCxDQUFDO3FDQUNELEdBQUcsRUFBRyxDQUFDOzRCQUNoQixDQUFDLENBQUMsQ0FBQyxFQUFBOzt3QkFORyxLQUFLLEdBQVEsU0FNaEI7d0JBRUcsSUFBSSxHQUFHLEtBQUssQ0FBQyxHQUFHLENBQUUsVUFBQSxDQUFDOzRCQUNmLElBQUEsY0FBNkQsRUFBM0QsWUFBRyxFQUFFLFlBQUcsRUFBRSxZQUFHLEVBQUUsWUFBRyxFQUFFLGdCQUFLLEVBQUUsMEJBQVUsRUFBRSxjQUFvQixDQUFDOzRCQUNwRSxPQUFPO2dDQUNILEdBQUcsRUFBRSxHQUFHO2dDQUNSLElBQUksTUFBQSxFQUFFLFVBQVUsWUFBQTtnQ0FDaEIsR0FBRyxLQUFBLEVBQUUsR0FBRyxLQUFBLEVBQUUsR0FBRyxLQUFBLEVBQUUsS0FBSyxPQUFBOzZCQUN2QixDQUFBO3dCQUNMLENBQUMsQ0FBQyxDQUFDO3dCQUdILFdBQU0sS0FBSyxDQUFDLFlBQVksQ0FBQztnQ0FDckIsSUFBSSxFQUFFLGVBQWU7Z0NBQ3JCLElBQUksRUFBRTtvQ0FDRixJQUFJLEVBQUUsUUFBUTtvQ0FDZCxJQUFJLEVBQUU7d0NBQ0YsSUFBSSxNQUFBO3dDQUNKLE1BQU0sUUFBQTtxQ0FDVDtpQ0FDSjs2QkFDSixDQUFDLEVBQUE7O3dCQVRGLFNBU0UsQ0FBQTt3QkFFRixXQUFPLEdBQUcsQ0FBQyxJQUFJLEdBQUc7Z0NBQ2QsTUFBTSxFQUFFLEdBQUc7NkJBQ2QsRUFBQTs7O3dCQUdELFdBQU8sR0FBRyxDQUFDLElBQUksR0FBRyxFQUFFLE1BQU0sRUFBRSxHQUFHLEVBQUUsRUFBQzs7OzthQUV6QyxDQUFDLENBQUE7UUFXRixHQUFHLENBQUMsTUFBTSxDQUFDLGFBQWEsRUFBRSxVQUFPLEdBQUcsRUFBRSxJQUFJOzs7Ozs7d0JBRTVCLEtBQW9DLEtBQUssQ0FBQyxJQUFJLEVBQTVDLGNBQUcsRUFBRSxXQUFXLGlCQUFBLEVBQUUsV0FBVyxpQkFBQSxDQUFnQjt3QkFHckMsV0FBTSxFQUFFLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQztpQ0FDdkMsS0FBSyxDQUFDO2dDQUNILEdBQUcsT0FBQTtnQ0FDSCxXQUFXLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUM7Z0NBQ3ZCLFVBQVUsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQzs2QkFDMUMsQ0FBQztpQ0FDRCxHQUFHLEVBQUcsRUFBQTs7d0JBTkwsWUFBVSxTQU1MO3dCQUdJLFdBQU0sT0FBTyxDQUFDLEdBQUcsQ0FDNUIsS0FBSyxDQUFDLElBQUksQ0FDTixJQUFJLEdBQUcsQ0FBRSxTQUFPLENBQUMsSUFBSTtpQ0FDaEIsR0FBRyxDQUFFLFVBQUEsQ0FBQyxJQUFJLE9BQUEsQ0FBQyxDQUFDLE1BQU0sRUFBUixDQUFRLENBQUUsQ0FDNUIsQ0FBQztpQ0FDRCxHQUFHLENBQUUsVUFBQSxHQUFHLElBQUksT0FBQSxFQUFFLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQztpQ0FDN0IsS0FBSyxDQUFDO2dDQUNILE1BQU0sRUFBRSxHQUFHOzZCQUNkLENBQUM7aUNBQ0QsR0FBRyxFQUFHLEVBSkUsQ0FJRixDQUFDLENBQ2YsRUFBQTs7d0JBVkssTUFBTSxHQUFHLFNBVWQ7d0JBR29CLFdBQU0sT0FBTyxDQUFDLEdBQUcsQ0FDbEMsS0FBSyxDQUFDLElBQUksQ0FDTixJQUFJLEdBQUcsQ0FBRSxTQUFPLENBQUMsSUFBSTtpQ0FDaEIsR0FBRyxDQUFFLFVBQUEsQ0FBQyxJQUFJLE9BQUEsQ0FBQyxDQUFDLE1BQU0sRUFBUixDQUFRLENBQUUsQ0FDNUIsQ0FBQztpQ0FDRCxHQUFHLENBQUUsVUFBQSxHQUFHLElBQUksT0FBQSxFQUFFLENBQUMsVUFBVSxDQUFDLGFBQWEsQ0FBQztpQ0FDcEMsS0FBSyxDQUFDO2dDQUNILEdBQUcsT0FBQTtnQ0FDSCxNQUFNLEVBQUUsR0FBRzs2QkFDZCxDQUFDO2lDQUNELEdBQUcsRUFBRyxFQUxFLENBS0YsQ0FBQyxDQUNmLEVBQUE7O3dCQVhLLGlCQUFlLFNBV3BCO3dCQUdHLGFBQWdCLEVBQUcsQ0FBQzs2QkFDbkIsQ0FBQSxDQUFDLENBQUMsV0FBVyxJQUFJLFdBQVcsS0FBSyxTQUFTLENBQUEsRUFBMUMsY0FBMEM7d0JBQ2hDLFdBQU0sT0FBTyxDQUFDLEdBQUcsQ0FDeEIsS0FBSyxDQUFDLElBQUksQ0FDTixJQUFJLEdBQUcsQ0FBRSxTQUFPLENBQUMsSUFBSTtpQ0FDaEIsR0FBRyxDQUFFLFVBQUEsQ0FBQyxJQUFJLE9BQUEsQ0FBQyxDQUFDLEdBQUcsRUFBTCxDQUFLLENBQUUsQ0FDekIsQ0FBQztpQ0FDRCxHQUFHLENBQUUsVUFBQSxHQUFHLElBQUksT0FBQSxFQUFFLENBQUMsVUFBVSxDQUFDLFNBQVMsQ0FBQztpQ0FDeEIsR0FBRyxDQUFFLEdBQUcsQ0FBRTtpQ0FDVixHQUFHLEVBQUcsRUFGTixDQUVNLENBQUMsQ0FDdkIsRUFBQTs7d0JBUkQsVUFBUSxHQUFHLFNBUVYsQ0FBQzs7O3dCQUlGLGFBQWdCLEVBQUcsQ0FBQzs2QkFDbkIsQ0FBQSxDQUFDLENBQUMsV0FBVyxJQUFJLFdBQVcsS0FBSyxTQUFTLENBQUEsRUFBMUMsY0FBMEM7d0JBQ2hDLFdBQU0sT0FBTyxDQUFDLEdBQUcsQ0FDeEIsS0FBSyxDQUFDLElBQUksQ0FDTixJQUFJLEdBQUcsQ0FBRSxTQUFPLENBQUMsSUFBSTtpQ0FDaEIsR0FBRyxDQUFFLFVBQUEsQ0FBQyxJQUFJLE9BQUEsQ0FBQyxDQUFDLE1BQU0sRUFBUixDQUFRLENBQUUsQ0FDNUIsQ0FBQztpQ0FDRCxHQUFHLENBQUUsVUFBQSxNQUFNLElBQUksT0FBQSxFQUFFLENBQUMsVUFBVSxDQUFDLFFBQVEsQ0FBQztpQ0FDbEMsS0FBSyxDQUFFLENBQUMsQ0FBQyxFQUFFLENBQUM7Z0NBQ1Q7b0NBQ0ksR0FBRyxPQUFBO29DQUNILE1BQU0sUUFBQTtvQ0FDTixJQUFJLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBRSxDQUFDLENBQUMsRUFBRSxDQUFDLFdBQVcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsVUFBVSxDQUFDLENBQUM7aUNBQ25ELEVBQUU7b0NBQ0MsTUFBTSxRQUFBO29DQUNOLE1BQU0sRUFBRSxLQUFLO29DQUNiLFlBQVksRUFBRSxJQUFJO29DQUNsQixJQUFJLEVBQUUsVUFBVTtpQ0FDbkI7NkJBQ0osQ0FBQyxDQUFDO2lDQUNGLEdBQUcsRUFBRyxFQWJLLENBYUwsQ0FDVixDQUNKLEVBQUE7O3dCQXBCRCxVQUFRLEdBQUcsU0FvQlYsQ0FBQzs7O3dCQUdBLFNBQVMsR0FBRyxNQUFNLENBQUMsR0FBRyxDQUFDLFVBQUUsS0FBSyxFQUFFLENBQUM7NEJBRW5DLElBQU0sSUFBSSxHQUFHLEtBQUssQ0FBQyxJQUFJLENBQUUsQ0FBQyxDQUFFLENBQUM7NEJBRTdCLElBQU0sTUFBTSxHQUFHLFNBQU8sQ0FBQyxJQUFJO2lDQUN0QixNQUFNLENBQUUsVUFBQSxDQUFDLElBQUksT0FBQSxDQUFDLENBQUMsTUFBTSxLQUFLLElBQUksQ0FBQyxNQUFNLEVBQXhCLENBQXdCLENBQUUsQ0FBQzs0QkFFN0MsSUFBTSxPQUFPLEdBQUcsVUFBUSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQztnQ0FDakMsVUFBUTtxQ0FDSCxHQUFHLENBQUUsVUFBQSxDQUFDLElBQUksT0FBQSxDQUFDLENBQUMsSUFBSSxFQUFOLENBQU0sQ0FBRTtxQ0FDbEIsTUFBTSxDQUFFLFVBQUEsQ0FBQyxJQUFJLE9BQUEsQ0FBQyxDQUFDLE1BQU0sS0FBSyxJQUFJLENBQUMsTUFBTSxFQUF4QixDQUF3QixDQUFFLENBQUMsQ0FBQztnQ0FDOUMsU0FBUyxDQUFDOzRCQUVkLElBQU0sT0FBTyxHQUFHLFVBQVEsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUM7Z0NBQ2pDLFVBQVE7cUNBQ0gsR0FBRyxDQUFFLFVBQUEsQ0FBQyxJQUFJLE9BQUEsQ0FBQyxDQUFDLElBQUksRUFBTixDQUFNLENBQUU7cUNBQ2xCLE1BQU0sQ0FBRSxVQUFBLENBQUMsSUFBSSxPQUFBLENBQUMsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBRSxDQUFDLENBQUUsQ0FBQyxNQUFNLEtBQUssSUFBSSxDQUFDLE1BQU0sRUFBN0MsQ0FBNkMsQ0FBRSxDQUFDLENBQUM7Z0NBQ25FLFNBQVMsQ0FBQzs0QkFFZCxJQUFNLFVBQVUsR0FBRyxjQUFZLENBQUUsQ0FBQyxDQUFFLENBQUMsSUFBSSxDQUFFLENBQUMsQ0FBRSxJQUFJLElBQUksQ0FBQTs0QkFFdEQsT0FBTztnQ0FDSCxJQUFJLE1BQUE7Z0NBQ0osTUFBTSxRQUFBO2dDQUNOLE9BQU8sU0FBQTtnQ0FDUCxVQUFVLFlBQUE7Z0NBQ1YsT0FBTyxFQUFFLENBQUMsQ0FBQyxDQUFDLE9BQU8sSUFBSSxPQUFPLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBRSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUUsQ0FBQyxDQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUc7NkJBQ25FLENBQUM7d0JBQ04sQ0FBQyxDQUFDLENBQUM7d0JBRUgsV0FBTyxHQUFHLENBQUMsSUFBSSxHQUFHO2dDQUNkLE1BQU0sRUFBRSxHQUFHO2dDQUNYLElBQUksRUFBRSxTQUFTOzZCQUNsQixFQUFBOzs7d0JBR0QsT0FBTyxDQUFDLEdBQUcsQ0FBRSxLQUFLLEVBQUUsR0FBQyxDQUFFLENBQUM7d0JBQ3hCLFdBQU8sR0FBRyxDQUFDLElBQUksR0FBRyxFQUFFLE1BQU0sRUFBRSxHQUFHLEVBQUUsRUFBQzs7OzthQUV6QyxDQUFDLENBQUM7UUFTSCxHQUFHLENBQUMsTUFBTSxDQUFDLGNBQWMsRUFBRSxVQUFPLEdBQUcsRUFBRSxJQUFJOzs7Ozs7d0JBRTdCLE1BQU0sR0FBRyxLQUFLLENBQUMsSUFBSSxDQUFDLE1BQU0sSUFBSSxLQUFLLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQzt3QkFDcEQsS0FBZ0MsS0FBSyxDQUFDLElBQUksRUFBeEMsY0FBRyxFQUFFLEdBQUcsU0FBQSxFQUFFLEdBQUcsU0FBQSxFQUFFLEdBQUcsU0FBQSxFQUFFLEtBQUssV0FBQSxDQUFnQjt3QkFFM0MsUUFBUSxHQUFHLFVBQUEsT0FBTyxJQUFJLE9BQUEsR0FBRyxDQUFDLElBQUksR0FBRzs0QkFDbkMsT0FBTyxTQUFBOzRCQUNQLE1BQU0sRUFBRSxHQUFHO3lCQUNkLEVBSDJCLENBRzNCLENBQUE7d0JBS2MsV0FBTSxFQUFFLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQztpQ0FDdEMsR0FBRyxDQUFFLEtBQUcsQ0FBRTtpQ0FDVixHQUFHLEVBQUcsRUFBQTs7d0JBRkwsTUFBTSxHQUFHLFNBRUo7d0JBRVgsSUFBSyxNQUFNLENBQUMsSUFBSSxDQUFDLFdBQVcsS0FBSyxHQUFHLEVBQUc7NEJBQ25DLFdBQU8sUUFBUSxDQUFDLFdBQVcsQ0FBQyxFQUFDO3lCQUVoQzs2QkFBTSxJQUFLLE1BQU0sQ0FBQyxJQUFJLENBQUMsV0FBVyxLQUFLLEdBQUcsRUFBRzs0QkFDMUMsV0FBTyxRQUFRLENBQUMsV0FBVyxDQUFDLEVBQUM7eUJBQ2hDO3dCQUtpQixXQUFNLEVBQUUsQ0FBQyxVQUFVLENBQUMsZUFBZSxDQUFDO2lDQUNqRCxLQUFLLENBQUM7Z0NBQ0gsR0FBRyxLQUFBLEVBQUUsR0FBRyxLQUFBLEVBQUUsR0FBRyxLQUFBOzZCQUNoQixDQUFDO2lDQUNELEdBQUcsRUFBRyxFQUFBOzt3QkFKTCxTQUFTLEdBQUcsU0FJUDt3QkFDTCxRQUFRLEdBQUcsU0FBUyxDQUFDLElBQUksQ0FBRSxDQUFDLENBQUUsQ0FBQzt3QkFDakIsV0FBTSxFQUFFLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQztpQ0FDM0MsS0FBSyxDQUFDO2dDQUNILEdBQUcsS0FBQSxFQUFFLEdBQUcsS0FBQSxFQUFFLEdBQUcsS0FBQTtnQ0FDYixVQUFVLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUM7Z0NBQ3RCLFdBQVcsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDOzZCQUN0RCxDQUFDO2lDQUNELEdBQUcsRUFBRyxFQUFBOzt3QkFOTCxXQUFXLEdBQUcsU0FNVDt3QkFFTCxVQUFVLEdBQUcsV0FBVyxDQUFDLElBQUksQ0FBQzt3QkFDOUIsVUFBVSxHQUFRLFVBQVU7NkJBQzdCLE1BQU0sQ0FBRSxVQUFBLENBQUMsSUFBSSxPQUFBLENBQUMsQ0FBQyxHQUFHLEtBQUssS0FBRyxFQUFiLENBQWEsQ0FBRTs2QkFDNUIsTUFBTSxDQUFDLFVBQUUsQ0FBQyxFQUFFLENBQUM7NEJBQ1YsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDLGNBQWMsSUFBSSxDQUFDLENBQUE7d0JBQ3BDLENBQUMsRUFBRSxDQUFDLENBQUUsQ0FBQzt3QkFFWCxJQUFLLEtBQUssR0FBRyxVQUFVLEdBQUcsUUFBUSxDQUFDLFFBQVEsRUFBRzs0QkFDMUMsV0FBTyxRQUFRLENBQUMsbUZBQWdCLFFBQVEsQ0FBQyxRQUFRLGlCQUFJLENBQUMsRUFBQzt5QkFDMUQ7d0JBR0QsV0FBTSxFQUFFLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQztpQ0FDdkIsR0FBRyxDQUFFLEtBQUcsQ0FBRTtpQ0FDVixNQUFNLENBQUM7Z0NBQ0osSUFBSSxFQUFFO29DQUNGLGNBQWMsRUFBRSxLQUFLO2lDQUN4Qjs2QkFDSixDQUFDLEVBQUE7O3dCQU5OLFNBTU0sQ0FBQzs2QkFNRixDQUFBLEtBQUssR0FBRyxVQUFVLEdBQUcsUUFBUSxDQUFDLFFBQVEsQ0FBQSxFQUF0QyxjQUFzQzt3QkFFakMsV0FBVyxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUMsRUFBRyxFQUFFLFFBQVEsRUFBRTs0QkFDN0MsYUFBYSxFQUFFLFFBQVEsQ0FBQyxRQUFRLEdBQUcsQ0FBRSxLQUFLLEdBQUcsVUFBVSxDQUFFO3lCQUM1RCxDQUFDLENBQUM7d0JBQ0gsT0FBTyxXQUFXLENBQUMsS0FBSyxDQUFDLENBQUM7d0JBRTFCLFdBQU0sRUFBRSxDQUFDLFVBQVUsQ0FBQyxlQUFlLENBQUM7aUNBQy9CLEdBQUcsQ0FBRSxNQUFNLENBQUUsUUFBUSxDQUFDLEdBQUcsQ0FBRSxDQUFDO2lDQUM1QixHQUFHLENBQUM7Z0NBQ0QsSUFBSSxFQUFFLFdBQVc7NkJBQ3BCLENBQUMsRUFBQTs7d0JBSk4sU0FJTSxDQUFDOzs0QkFHWCxXQUFPLEdBQUcsQ0FBQyxJQUFJLEdBQUc7NEJBQ2QsTUFBTSxFQUFFLEdBQUc7eUJBQ2QsRUFBQTs7O3dCQUdELFdBQU8sR0FBRyxDQUFDLElBQUksR0FBRyxFQUFFLE1BQU0sRUFBRSxHQUFHLEVBQUUsRUFBQTs7OzthQUV4QyxDQUFDLENBQUE7UUF3QkYsR0FBRyxDQUFDLE1BQU0sQ0FBQyxjQUFjLEVBQUUsVUFBTyxHQUFHLEVBQUUsSUFBSTs7Ozs7O3dCQUkvQix5QkFFQSxFQUFHLENBQUM7d0JBRUYsS0FBZ0MsS0FBSyxDQUFDLElBQUksRUFBeEMsR0FBRyxTQUFBLEVBQUUsb0JBQU0sRUFBRSxZQUFZLGtCQUFBLENBQWdCO3dCQUMzQyxRQUFRLEdBQUcsVUFBQSxPQUFPLElBQUksT0FBQSxHQUFHLENBQUMsSUFBSSxHQUFHOzRCQUNuQyxPQUFPLFNBQUE7NEJBQ1AsTUFBTSxFQUFFLEdBQUc7eUJBQ2QsRUFIMkIsQ0FHM0IsQ0FBQzt3QkFFWSxXQUFNLEVBQUUsQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDO2lDQUNwQyxHQUFHLENBQUUsR0FBRyxDQUFFO2lDQUNWLEdBQUcsRUFBRyxFQUFBOzt3QkFGTCxLQUFLLEdBQUcsU0FFSDt3QkFDTCxTQUFPLEtBQUssQ0FBQyxJQUFJLENBQUM7d0JBR3hCLElBQUssSUFBSSxJQUFJLEVBQUcsQ0FBQyxPQUFPLEVBQUcsR0FBRyxNQUFJLENBQUMsUUFBUSxJQUFJLENBQUMsTUFBSSxDQUFDLFFBQVEsRUFBRzs0QkFDNUQsV0FBTyxRQUFRLENBQUMsaUJBQWlCLENBQUMsRUFBQzt5QkFFdEM7NkJBQU0sSUFBSyxNQUFJLENBQUMsY0FBYyxJQUFLLE1BQUksQ0FBQyxjQUFjLElBQUksQ0FBQyxFQUFHOzRCQUMzRCxXQUFPLFFBQVEsQ0FBQyxtQ0FBUSxNQUFJLENBQUMsY0FBYyx1QkFBSyxDQUFDLEVBQUM7eUJBRXJEO3dCQUdELFdBQU0sT0FBTyxDQUFDLEdBQUcsQ0FBRSxRQUFNLENBQUMsR0FBRyxDQUFFLFVBQUEsS0FBSzs7Z0NBR2hDLElBQU0sUUFBUSxHQUFHLENBQUMsQ0FBQyxRQUFNLENBQUMsSUFBSSxDQUFFLFVBQUEsQ0FBQztvQ0FDN0IsT0FBTyxDQUFDLENBQUMsR0FBRyxLQUFLLEtBQUssQ0FBQyxHQUFHO3dDQUN0QixDQUFDLENBQUMsTUFBTSxLQUFLLEtBQUssQ0FBQyxNQUFNO3dDQUN6QixDQUFDLENBQUMsR0FBRyxLQUFLLEtBQUssQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLEdBQUcsS0FBSyxLQUFLLENBQUMsR0FBRzt3Q0FDMUMsQ0FBQyxDQUFDLGNBQWMsR0FBRyxDQUFDLElBQUksS0FBSyxDQUFDLGNBQWMsR0FBRyxDQUFDO3dDQUNoRCxDQUFDLENBQUMsQ0FBQyxDQUFDLG1CQUFtQixDQUFBO2dDQUMvQixDQUFDLENBQUMsQ0FBQztnQ0FFSCxJQUFLLFFBQVEsRUFBRztvQ0FDWixzQkFBb0IsR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDLEVBQUcsRUFBRSxzQkFBb0I7d0NBQzFELEdBQUUsS0FBSyxDQUFDLE1BQU0sSUFBSSxzQkFBb0IsQ0FBRSxLQUFLLENBQUMsTUFBTSxDQUFFLEtBQUssU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLHNCQUFvQixDQUFFLEtBQUssQ0FBQyxNQUFNLENBQUUsR0FBRyxDQUFDOzRDQUNySCxDQUFDO2lDQUNOO2dDQUVELE9BQU8sRUFBRSxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUM7cUNBQ3hCLEdBQUcsQ0FBRSxLQUFLLENBQUMsR0FBRyxDQUFFO3FDQUNoQixNQUFNLENBQUM7b0NBQ0osSUFBSSxFQUFFO3dDQUNGLFFBQVEsVUFBQTt3Q0FDUixXQUFXLEVBQUUsR0FBRztxQ0FDbkI7aUNBQ0osQ0FBQyxDQUFBOzRCQUNWLENBQUMsQ0FBQyxDQUFDLEVBQUE7O3dCQXpCSCxTQXlCRyxDQUFDO3dCQVVFLEtBQUssR0FBRyxLQUFLLENBQUMsSUFBSSxDQUNwQixJQUFJLEdBQUcsQ0FDSCxRQUFNOzZCQUNELEdBQUcsQ0FBRSxVQUFBLEtBQUssSUFBSSxPQUFBLEtBQUssQ0FBQyxNQUFNLEVBQVosQ0FBWSxDQUFFOzZCQUM1QixNQUFNLENBQUUsVUFBQSxNQUFNOzRCQUNYLE9BQU8sQ0FBQyxDQUFDLFFBQU0sQ0FBQyxJQUFJLENBQUUsVUFBQSxLQUFLO2dDQUN2QixPQUFPLEtBQUssQ0FBQyxNQUFNLEtBQUssTUFBTSxJQUFJLE1BQU0sQ0FBRSxLQUFLLENBQUMsVUFBVSxDQUFFLEtBQUssR0FBRyxDQUFBOzRCQUN4RSxDQUFDLENBQUMsQ0FBQzt3QkFDUCxDQUFDLENBQUMsQ0FDVCxDQUNKLENBQUM7d0JBR1MsV0FBTSxPQUFPLENBQUMsR0FBRyxDQUFFLEtBQUssQ0FBQyxHQUFHLENBQUUsVUFBQSxNQUFNO2dDQUUzQyxJQUFNLE1BQU0sR0FBRyxRQUFNLENBQUMsSUFBSSxDQUFFLFVBQUEsS0FBSyxJQUFJLE9BQUEsS0FBSyxDQUFDLE1BQU0sS0FBSyxNQUFNO29DQUN4RCxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsU0FBUyxJQUFJLENBQUMsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFFLEVBRE4sQ0FDTSxDQUFDLENBQUM7Z0NBRTdDLE9BQU8sS0FBSyxDQUFDLFlBQVksQ0FBQztvQ0FDdEIsSUFBSSxFQUFFO3dDQUNGLElBQUksRUFBRTs0Q0FDRixNQUFNLEVBQUUsTUFBTTs0Q0FDZCxJQUFJLEVBQUU7Z0RBQ0YsS0FBSyxFQUFFLHNCQUFvQixDQUFFLE1BQU0sQ0FBRSxNQUFNLENBQUUsQ0FBQyxDQUFDLENBQUM7b0RBQzVDLGlCQUFNLHNCQUFvQixDQUFFLE1BQU0sQ0FBRSxNQUFNLENBQUUsQ0FBQyx1RUFBYSxDQUFDLENBQUM7b0RBQzVELFdBQVc7Z0RBQ2YsSUFBSSxFQUFFLG1CQUFPLE1BQUksQ0FBQyxLQUFPOzZDQUM1Qjs0Q0FDRCxPQUFPLEVBQUUsTUFBTSxDQUFDLFNBQVMsSUFBSSxNQUFNLENBQUMsT0FBTzt5Q0FDOUM7d0NBQ0QsSUFBSSxFQUFFLHVCQUF1QjtxQ0FDaEM7b0NBQ0QsSUFBSSxFQUFFLFFBQVE7aUNBQ2pCLENBQUMsQ0FBQTs0QkFDTixDQUFDLENBQUMsQ0FBQyxFQUFBOzt3QkFyQkcsRUFBRSxHQUFHLFNBcUJSO3dCQUdILFdBQU0sRUFBRSxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUM7aUNBQ3RCLEdBQUcsQ0FBRSxHQUFHLENBQUU7aUNBQ1YsTUFBTSxDQUFDO2dDQUNKLElBQUksRUFBRTtvQ0FDRixjQUFjLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBRSxDQUFDLENBQUU7aUNBQzdCOzZCQUNKLENBQUMsRUFBQTs7d0JBTk4sU0FNTSxDQUFDO3dCQUVQLFdBQU8sR0FBRyxDQUFDLElBQUksR0FBRztnQ0FDZCxNQUFNLEVBQUUsR0FBRztnQ0FFWCxJQUFJLEVBQUUsQ0FBQyxHQUFHLENBQUUsQ0FBQyxHQUFHLE1BQUksQ0FBQyxjQUFjLENBQUU7NkJBQ3hDLEVBQUE7Ozt3QkFHRCxXQUFPLEdBQUcsQ0FBQyxJQUFJLEdBQUcsRUFBRSxNQUFNLEVBQUUsR0FBRyxFQUFFLEVBQUM7Ozs7YUFFekMsQ0FBQyxDQUFBO1FBb0JGLEdBQUcsQ0FBQyxNQUFNLENBQUMsVUFBVSxFQUFFLFVBQU8sR0FBRyxFQUFFLElBQUk7Ozs7Ozt3QkFFekIsTUFBTSxHQUFHLEtBQUssQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDO3dCQUMvQixLQUFxQyxLQUFLLENBQUMsSUFBSSxFQUE3QyxjQUFHLEVBQUUsUUFBUSxjQUFBLEVBQUUsTUFBTSxZQUFBLEVBQUUsT0FBTyxhQUFBLENBQWdCO3dCQUV4QyxXQUFNLEVBQUUsQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDO2lDQUNwQyxLQUFLLENBQUM7Z0NBQ0gsTUFBTSxRQUFBOzZCQUNULENBQUM7aUNBQ0QsR0FBRyxFQUFHLEVBQUE7O3dCQUpMLEtBQUssR0FBRyxTQUlIO3dCQUdYLFdBQU0sRUFBRSxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUM7aUNBQ3RCLEdBQUcsQ0FBRSxNQUFNLENBQUUsS0FBSyxDQUFDLElBQUksQ0FBRSxDQUFDLENBQUUsQ0FBQyxHQUFHLENBQUUsQ0FBQztpQ0FDbkMsTUFBTSxDQUFDO2dDQUNKLElBQUksRUFBRTtvQ0FDRixRQUFRLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBRSxRQUFRLENBQUU7aUNBQzlCOzZCQUNKLENBQUMsRUFBQTs7d0JBTk4sU0FNTSxDQUFDO3dCQUdQLFdBQU0sT0FBTyxDQUFDLEdBQUcsQ0FBRSxNQUFNLENBQUMsR0FBRyxDQUFFLFVBQUEsS0FBSztnQ0FDaEMsT0FBTyxPQUFPLENBQUMsR0FBRyxDQUFDO29DQUNmLEVBQUUsQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDO3lDQUNqQixHQUFHLENBQUUsS0FBSyxDQUFDLEdBQUcsQ0FBRTt5Q0FDaEIsTUFBTSxDQUFDO3dDQUNKLElBQUksRUFBRTs0Q0FDRixXQUFXLEVBQUUsR0FBRzs0Q0FDaEIsVUFBVSxFQUFFLEdBQUc7NENBQ2YsV0FBVyxFQUFFLEtBQUssQ0FBQyxXQUFXO3lDQUNqQztxQ0FDSixDQUFDO29DQUNOLEVBQUUsQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDO3lDQUNqQixHQUFHLENBQUUsS0FBSyxDQUFDLEdBQUcsQ0FBRTt5Q0FDaEIsTUFBTSxDQUFDO3dDQUNKLElBQUksRUFBRTs0Q0FDRixLQUFLLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBRSxLQUFLLENBQUMsY0FBYyxDQUFFO3lDQUN2QztxQ0FDSixDQUFDO2lDQUNULENBQUMsQ0FBQTs0QkFDTixDQUFDLENBQUMsQ0FBQyxFQUFBOzt3QkFuQkgsU0FtQkcsQ0FBQzt3QkFHSixXQUFNLE9BQU8sQ0FBQyxHQUFHLENBQUUsT0FBTyxDQUFDLEdBQUcsQ0FBRSxVQUFBLFFBQVE7Z0NBQ3BDLE9BQU8sRUFBRSxDQUFDLFVBQVUsQ0FBQyxRQUFRLENBQUM7cUNBQ3pCLEdBQUcsQ0FBRSxRQUFRLENBQUU7cUNBQ2YsTUFBTSxDQUFDO29DQUNKLElBQUksRUFBRTt3Q0FDRixNQUFNLEVBQUUsSUFBSTt3Q0FDWixNQUFNLEVBQUUsS0FBRzt3Q0FDWCxZQUFZLEVBQUUsS0FBSztxQ0FDdEI7aUNBQ0osQ0FBQyxDQUFBOzRCQUNWLENBQUMsQ0FBQyxDQUFDLEVBQUE7O3dCQVZILFNBVUcsQ0FBQzt3QkFJVSxXQUFNLEVBQUUsQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDO2lDQUNwQyxHQUFHLENBQUUsS0FBRyxDQUFFO2lDQUNWLEdBQUcsRUFBRyxFQUFBOzt3QkFGTCxLQUFLLEdBQUcsU0FFSDt3QkFFUCxHQUFHLEdBQUc7NEJBQ04sTUFBTSxFQUFFO2dDQUNKLE1BQU0sRUFBRSxHQUFHOzZCQUNkO3lCQUNKLENBQUE7d0JBRUssS0FBNEMsS0FBSyxDQUFDLElBQUksRUFBcEQsa0JBQWtCLHdCQUFBLEVBQUUsaUJBQWlCLHVCQUFBLENBQWdCO3dCQUV2RCxJQUFJLEdBQUc7NEJBQ1QsTUFBTSxFQUFFLE1BQU07NEJBQ2QsT0FBTyxFQUFFLEtBQUc7NEJBQ1osSUFBSSxFQUFFLFVBQVU7NEJBQ2hCLEtBQUssRUFBRSxPQUFPOzRCQUNkLFlBQVksRUFBRSxJQUFJOzRCQUNsQixNQUFNLEVBQUUsS0FBSzs0QkFDYixPQUFPLEVBQUUsa0JBQWtCLElBQUksQ0FBQzs0QkFDaEMsS0FBSyxFQUFFLGlCQUFpQjt5QkFDM0IsQ0FBQzs2QkFHRyxDQUFDLENBQUMsaUJBQWlCLEVBQW5CLGVBQW1CO3dCQUdBLFdBQU0sRUFBRSxDQUFDLFVBQVUsQ0FBQyxRQUFRLENBQUM7aUNBQzVDLEtBQUssQ0FBQztnQ0FDSCxJQUFJLEVBQUUsVUFBVTtnQ0FDaEIsTUFBTSxFQUFFLEtBQUs7Z0NBQ2IsWUFBWSxFQUFFLElBQUk7NkJBQ3JCLENBQUM7aUNBQ0QsR0FBRyxFQUFHLEVBQUE7O3dCQU5MLFdBQVcsR0FBRyxTQU1UOzZCQUVOLFdBQVcsQ0FBQyxJQUFJLENBQUUsQ0FBQyxDQUFFLEVBQXJCLGNBQXFCO3dCQUN0QixXQUFNLEVBQUUsQ0FBQyxVQUFVLENBQUMsUUFBUSxDQUFDO2lDQUN4QixHQUFHLENBQUUsTUFBTSxDQUFFLFdBQVcsQ0FBQyxJQUFJLENBQUUsQ0FBQyxDQUFFLENBQUMsR0FBRyxDQUFFLENBQUM7aUNBQ3pDLE1BQU0sRUFBRyxFQUFBOzt3QkFGZCxTQUVjLENBQUM7OzRCQUliLFdBQU0sS0FBSyxDQUFDLFlBQVksQ0FBQzs0QkFDM0IsSUFBSSxFQUFFO2dDQUNGLElBQUksRUFBRSxJQUFJO2dDQUNWLElBQUksRUFBRSxRQUFROzZCQUNqQjs0QkFDRCxJQUFJLEVBQUUsUUFBUTt5QkFDakIsQ0FBQyxFQUFBOzt3QkFORixHQUFHLEdBQUcsU0FNSixDQUFDOzs2QkFHUCxXQUFPLEdBQUcsQ0FBQyxJQUFJLEdBQUc7NEJBQ2QsTUFBTSxFQUFFLEdBQUc7NEJBQ1gsSUFBSSxFQUFFLEdBQUcsQ0FBQyxNQUFNLENBQUMsTUFBTSxLQUFLLEdBQUcsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJO3lCQUNoRCxFQUFBOzs7d0JBR0QsV0FBTyxHQUFHLENBQUMsSUFBSSxHQUFHLEVBQUUsTUFBTSxFQUFFLEdBQUcsRUFBRSxFQUFBOzs7O2FBRXhDLENBQUMsQ0FBQztRQU1ILEdBQUcsQ0FBQyxNQUFNLENBQUMsUUFBUSxFQUFFLFVBQU8sR0FBRyxFQUFFLElBQUk7Ozs7Ozt3QkFFdkIsS0FBb0IsS0FBSyxDQUFDLElBQUksRUFBNUIsR0FBRyxTQUFBLEVBQUUsUUFBUSxjQUFBLENBQWdCO3dCQUNqQyxNQUFNLEdBQUc7NEJBQ1QsR0FBRyxLQUFBO3lCQUNOLENBQUM7d0JBRUYsSUFBSyxRQUFRLEVBQUc7NEJBQ1osTUFBTSxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUMsRUFBRyxFQUFFLE1BQU0sRUFBRTtnQ0FDaEMsVUFBVSxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUUsUUFBUSxDQUFFOzZCQUNoQyxDQUFDLENBQUM7eUJBQ047d0JBRWEsV0FBTSxFQUFFLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQztpQ0FDckMsS0FBSyxDQUFFLE1BQU0sQ0FBRTtpQ0FDZixLQUFLLEVBQUcsRUFBQTs7d0JBRlAsS0FBSyxHQUFHLFNBRUQ7d0JBRWIsV0FBTyxHQUFHLENBQUMsSUFBSSxHQUFHO2dDQUNkLE1BQU0sRUFBRSxHQUFHO2dDQUNYLElBQUksRUFBRSxLQUFLLENBQUMsS0FBSzs2QkFDcEIsRUFBQTs7O3dCQUVXLFdBQU8sR0FBRyxDQUFDLElBQUksR0FBRyxFQUFFLE1BQU0sRUFBRSxHQUFHLEVBQUUsRUFBQzs7OzthQUNyRCxDQUFDLENBQUM7UUFNSCxHQUFHLENBQUMsTUFBTSxDQUFDLFVBQVUsRUFBRSxVQUFPLEdBQUcsRUFBRSxJQUFJOzs7Ozs7d0JBR3pCLEtBQUssR0FBRyxFQUFFLENBQUM7d0JBQ1gsS0FBZ0IsS0FBSyxDQUFDLElBQUksRUFBeEIsR0FBRyxTQUFBLEVBQUUsSUFBSSxVQUFBLENBQWdCO3dCQUUzQixNQUFNLEdBQUc7NEJBQ1gsR0FBRyxLQUFBOzRCQUNILFVBQVUsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQzt5QkFDekIsQ0FBQzt3QkFFYSxXQUFNLEVBQUUsQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDO2lDQUN0QyxLQUFLLENBQUUsTUFBTSxDQUFFO2lDQUNmLEtBQUssRUFBRyxFQUFBOzt3QkFGUCxNQUFNLEdBQUcsU0FFRjt3QkFFRyxXQUFNLEVBQUUsQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDO2lDQUN2QyxLQUFLLENBQUUsTUFBTSxDQUFFO2lDQUNmLEtBQUssQ0FBRSxLQUFLLENBQUU7aUNBQ2QsSUFBSSxDQUFDLENBQUUsSUFBSSxHQUFHLENBQUMsQ0FBRSxHQUFHLEtBQUssQ0FBRTtpQ0FDM0IsT0FBTyxDQUFDLFlBQVksRUFBRSxNQUFNLENBQUM7aUNBQzdCLEdBQUcsRUFBRyxFQUFBOzt3QkFMTCxPQUFPLEdBQUcsU0FLTDt3QkFFTCxJQUFJLEdBQUcsS0FBSyxDQUFDLElBQUksQ0FDbkIsSUFBSSxHQUFHLENBQ0gsT0FBTyxDQUFDLElBQUk7NkJBQ1AsR0FBRyxDQUFFLFVBQUEsQ0FBQyxJQUFJLE9BQUEsQ0FBQyxDQUFDLEdBQUcsRUFBTCxDQUFLLENBQUUsQ0FDekIsQ0FDSixDQUFDO3dCQUVJLElBQUksR0FBRyxLQUFLLENBQUMsSUFBSSxDQUNuQixJQUFJLEdBQUcsQ0FDSCxPQUFPLENBQUMsSUFBSTs2QkFDUCxHQUFHLENBQUUsVUFBQSxDQUFDLElBQUksT0FBQSxDQUFDLENBQUMsR0FBRyxFQUFMLENBQUssQ0FBRTs2QkFDakIsTUFBTSxDQUFFLFVBQUEsQ0FBQyxJQUFJLE9BQUEsQ0FBQyxDQUFDLENBQUMsRUFBSCxDQUFHLENBQUUsQ0FDMUIsQ0FDSixDQUFDO3dCQUVJLElBQUksR0FBRyxLQUFLLENBQUMsSUFBSSxDQUNuQixJQUFJLEdBQUcsQ0FDSCxPQUFPLENBQUMsSUFBSTs2QkFDUCxHQUFHLENBQUUsVUFBQSxDQUFDLElBQUksT0FBQSxDQUFDLENBQUMsTUFBTSxFQUFSLENBQVEsQ0FBRTs2QkFDcEIsTUFBTSxDQUFFLFVBQUEsQ0FBQyxJQUFJLE9BQUEsQ0FBQyxDQUFDLENBQUMsRUFBSCxDQUFHLENBQUUsQ0FDMUIsQ0FDSixDQUFDO3dCQXdCYyxXQUFNLE9BQU8sQ0FBQyxHQUFHLENBQzdCLElBQUksQ0FBQyxHQUFHLENBQ0osVUFBQSxNQUFNLElBQUksT0FBQSxFQUFFLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQztpQ0FDMUIsS0FBSyxDQUFDO2dDQUNILE1BQU0sUUFBQTs2QkFDVCxDQUFDO2lDQUNELEtBQUssQ0FBQztnQ0FDSCxNQUFNLEVBQUUsSUFBSTtnQ0FDWixTQUFTLEVBQUUsSUFBSTtnQ0FDZixRQUFRLEVBQUUsSUFBSTs2QkFDakIsQ0FBQztpQ0FDRCxHQUFHLEVBQUcsRUFURCxDQVNDLENBQ2QsQ0FDSixFQUFBOzt3QkFiSyxPQUFPLEdBQUcsU0FhZjt3QkFDSyxXQUFTLE9BQU8sQ0FBQyxHQUFHLENBQUUsVUFBQSxDQUFDLElBQUksT0FBQSxDQUFDLENBQUMsSUFBSSxDQUFFLENBQUMsQ0FBRSxFQUFYLENBQVcsQ0FBQyxDQUFDO3dCQUV4QyxJQUFJLEdBQUcsT0FBTyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUUsVUFBQSxLQUFLOzRCQUVoQyxJQUFNLElBQUksR0FBRyxRQUFNLENBQUMsSUFBSSxDQUFFLFVBQUEsSUFBSSxJQUFJLE9BQUEsSUFBSSxDQUFDLE1BQU0sS0FBSyxLQUFLLENBQUMsTUFBTSxFQUE1QixDQUE0QixDQUFFLENBQUM7NEJBSWpFLE9BQU8sTUFBTSxDQUFDLE1BQU0sQ0FBQyxFQUFHLEVBQUUsS0FBSyxFQUFFO2dDQUM3QixJQUFJLE1BQUE7NkJBR1AsQ0FBQyxDQUFBO3dCQUNOLENBQUMsQ0FBQyxDQUFDO3dCQUVILFdBQU8sR0FBRyxDQUFDLElBQUksR0FBRztnQ0FDZCxNQUFNLEVBQUUsR0FBRztnQ0FDWCxJQUFJLEVBQUU7b0NBQ0YsSUFBSSxNQUFBO29DQUNKLFFBQVEsRUFBRSxLQUFLO29DQUNmLElBQUksRUFBRSxJQUFJO29DQUNWLEtBQUssRUFBRSxNQUFNLENBQUMsS0FBSztvQ0FDbkIsU0FBUyxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUUsTUFBTSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUU7aUNBQy9DOzZCQUNKLEVBQUE7Ozt3QkFJRCxPQUFPLENBQUMsR0FBRyxDQUFDLEtBQUssRUFBRSxHQUFDLENBQUUsQ0FBQTt3QkFDdEIsV0FBTyxHQUFHLENBQUMsSUFBSSxHQUFHLEVBQUUsTUFBTSxFQUFFLEdBQUcsRUFBRSxFQUFBOzs7O2FBRXhDLENBQUMsQ0FBQTtRQUVILFdBQU8sR0FBRyxDQUFDLEtBQUssRUFBRyxFQUFDOztLQUV0QixDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiXG5pbXBvcnQgKiBhcyBjbG91ZCBmcm9tICd3eC1zZXJ2ZXItc2RrJztcbmltcG9ydCAqIGFzIFRjYlJvdXRlciBmcm9tICd0Y2Itcm91dGVyJztcbmltcG9ydCB7IGNyZWF0ZSQgfSBmcm9tICcuL2NyZWF0ZSc7XG5cbmNsb3VkLmluaXQoe1xuICAgIGVudjogcHJvY2Vzcy5lbnYuY2xvdWRcbn0pO1xuXG5jb25zdCBkYjogREIuRGF0YWJhc2UgPSBjbG91ZC5kYXRhYmFzZSggKTtcblxuY29uc3QgXyA9IGRiLmNvbW1hbmQ7XG5cbi8qKlxuICogXG4gKiBAZGVzY3JpcHRpb24g6K6i5Y2V5qih5Z2XXG4gKiAtLS0tLS0tLSDlrZfmrrUgLS0tLS0tLS0tLVxuICogX2lkXG4gKiBvcGVuaWQsXG4gKiBjcmVhdGV0aW1lXG4gKiB0aWQsXG4gKiBwaWQsXG4gKiBjaWQgKOWPr+S4uuepuilcbiAqIHNpZCwgKOWPr+S4uuepuilcbiAqIGNvdW50LFxuICogcHJpY2UsXG4gKiBncm91cFByaWNlLFxuICogZGVwb3NpdF9wcmljZTog5ZWG5ZOB6K6i6YeRICjlj6/kuLrnqbopXG4gKiAhIGFjaWQg5ZWG5ZOB5rS75YqoaWRcbiAqICEgaXNPY2N1cGllZCwg5piv5ZCm5Y2g5bqT5a2YXG4gKiBncm91cF9wcmljZSAo5Y+v5Li656m6KVxuICogdHlwZTogJ2N1c3RvbScgfCAnbm9ybWFsJyB8ICdwcmUnIOiHquWumuS5ieWKoOWNleOAgeaZrumAmuWKoOWNleOAgemihOiuouWNlVxuICogaW1nOiBBcnJheVsgc3RyaW5nIF1cbiAqIGRlc2PvvIjlj6/kuLrnqbrvvIksXG4gKiBhaWRcbiAqIGFsbG9jYXRlZFByaWNlIOWIhumFjeeahOS7t+agvFxuICogYWxsb2NhdGVkR3JvdXBQcmljZSDliIbphY3lm6LotK3ku7dcbiAqIGFsbG9jYXRlZENvdW50IOWIhumFjeeahOaVsOmHj1xuICogZm9ybV9pZFxuICogcHJlcGF5X2lkLFxuICogZmluYWxfcHJpY2Ug5pyA5ZCO5oiQ5Lqk5Lu3XG4gKiAhIGNhbkdyb3VwIOaYr+WQpuWPr+S7peaLvOWbolxuICogYmFzZV9zdGF0dXM6IDAsMSwyLDMsNCw1IOi/m+ihjOS4re+8jOS7o+i0reW3sui0reS5sO+8jOW3suiwg+aVtO+8jOW3sue7k+eul++8jOW3suWPlua2iO+8iOS5sOS4jeWIsO+8ie+8jOW3sui/h+acn++8iOaUr+S7mOi/h+acn++8iVxuICogcGF5X3N0YXR1czogMCwxLDIg5pyq5LuY5qy+77yM5bey5LuY6K6i6YeR77yM5bey5LuY5YWo5qy+XG4gKiAhIGRlbGl2ZXJfc3RhdHVzOiAwLDEg5pyq5Y+R5biD77yM5bey5Y+R5biD44CBXG4gKi9cbmV4cG9ydCBjb25zdCBtYWluID0gYXN5bmMgKCBldmVudCwgY29udGV4dCApID0+IHtcblxuICAgIGNvbnN0IGFwcCA9IG5ldyBUY2JSb3V0ZXIoeyBldmVudCB9KTtcblxuICAgIC8qKlxuICAgICAqIEBkZXNjcmlwdGlvbiDliJvlu7rorqLljZVcbiAgICAgKiAtLS0tLS0tLSDor7fmsYIgLS0tLS0tLS0tLVxuICAgICAqIHtcbiAgICAgKiAgICAgIHRpZCxcbiAgICAgKiAgICAgIG9wZW5JZCAvLyDorqLljZXkuLvkurpcbiAgICAgKiAgICAgIGZyb206ICdjYXJ0JyB8ICdidXknIHwgJ2N1c3RvbScgfCAnYWdlbnRzJyB8ICdzeXN0ZW0nIOadpea6kO+8mui0reeJqei9puOAgeebtOaOpei0reS5sOOAgeiHquWumuS5ieS4i+WNleOAgeS7o+i0reS4i+WNleOAgeezu+e7n+WPkei1t+mihOS7mOiuouWNlVxuICAgICAqICAgICAgb3JkZXJzOiBBcnJheTx7IFxuICAgICAqICAgICAgICAgIHRpZFxuICAgICAqICAgICAgICAgIGNpZFxuICAgICAqICAgICAgICAgIHNpZFxuICAgICAqICAgICAgICAgIHBpZFxuICAgICAqICAgICAgICAgIHByaWNlXG4gICAgICogICAgICAgICAgbmFtZVxuICAgICAqICAgICAgICAgIGFjaWRcbiAgICAgKiAgICAgICAgICBzdGFuZGVybmFtZVxuICAgICAqICAgICAgICAgIGdyb3VwUHJpY2VcbiAgICAgKiAgICAgICAgICBjb3VudFxuICAgICAqICAgICAgICAgIGRlc2NcbiAgICAgKiAgICAgICAgICBpbWdcbiAgICAgKiAgICAgICAgICB0eXBlXG4gICAgICogICAgICAgICAgcGF5X3N0YXR1cyxcbiAgICAgKiAgICAgICAgICBhZGRyZXNzOiB7XG4gICAgICogICAgICAgICAgICAgIG5hbWUsXG4gICAgICogICAgICAgICAgICAgIHBob25lLFxuICAgICAqICAgICAgICAgICAgICBkZXRhaWwsXG4gICAgICogICAgICAgICAgICAgIHBvc3RhbGNvZGVcbiAgICAgKiAgICAgICAgICB9XG4gICAgICogICAgICB9PlxuICAgICAqIH1cbiAgICAgKi9cbiAgICBhcHAucm91dGVyKCdjcmVhdGUnLCBhc3luYyggY3R4LCBuZXh0ICkgPT4ge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgXG4gICAgICAgICAgICBjb25zdCB7IHRpZCwgZnJvbSwgb3JkZXJzIH0gPSBldmVudC5kYXRhO1xuICAgICAgICAgICAgY29uc3Qgb3BlbmlkID0gZXZlbnQuZGF0YS5vcGVuSWQgfHwgZXZlbnQudXNlckluZm8ub3BlbklkO1xuXG4gICAgICAgICAgICAvLyAx44CB5Yik5pat6K+l6KGM56iL5piv5ZCm5Y+v5Lul55SoXG4gICAgICAgICAgICBjb25zdCB0cmlwcyQkID0gYXdhaXQgY2xvdWQuY2FsbEZ1bmN0aW9uKHtcbiAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIF9pZDogdGlkXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICR1cmw6ICdkZXRhaWwnXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBuYW1lOiAndHJpcCdcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBjb25zdCB0cmlwcyQgPSB0cmlwcyQkLnJlc3VsdDsgICAgICAgIFxuICAgICAgICAgICAgaWYgKCB0cmlwcyQuc3RhdHVzICE9PSAyMDBcbiAgICAgICAgICAgICAgICAgICAgfHwgIXRyaXBzJC5kYXRhIFxuICAgICAgICAgICAgICAgICAgICB8fCAoICEhdHJpcHMkLmRhdGEgJiYgdHJpcHMkLmRhdGEuaXNDbG9zZWQgKSBcbiAgICAgICAgICAgICAgICAgICAgfHwgKCAhIXRyaXBzJC5kYXRhICYmIG5ldyBEYXRlKCApLmdldFRpbWUoICkgPj0gdHJpcHMkLmRhdGEuZW5kX2RhdGUgKSkge1xuICAgICAgICAgICAgICAgIHRocm93ICfmmoLml6DooYznqIvorqHliJLvvIzmmoLml7bkuI3og73otK3kubDvvZ4nXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIOacgOaWsOWPr+eUqOihjOeoi1xuICAgICAgICAgICAgY29uc3QgdHJpcCA9IHRyaXBzJC5kYXRhO1xuXG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIOagueaNruWcsOWdgOWvueixoe+8jOaLv+WIsOWcsOWdgGlkXG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIGxldCBhZGRyZXNzaWQkID0ge1xuICAgICAgICAgICAgICAgIHJlc3VsdDoge1xuICAgICAgICAgICAgICAgICAgICBkYXRhOiBudWxsLFxuICAgICAgICAgICAgICAgICAgICBzdGF0dXM6IDUwMFxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIC8vIOiuouWNleadpea6kO+8mui0reeJqei9puOAgeezu+e7n+WKoOWNlVxuICAgICAgICAgICAgaWYgKCBldmVudC5kYXRhLmZyb20gPT09ICdjYXJ0JyB8fCBldmVudC5kYXRhLmZyb20gPT09ICdzeXN0ZW0nIHx8IGV2ZW50LmRhdGEuZnJvbSA9PT0gJ2J1eScgKSB7XG4gICAgICAgICAgICAgICAgYWRkcmVzc2lkJCA9IGF3YWl0IGNsb3VkLmNhbGxGdW5jdGlvbih7XG4gICAgICAgICAgICAgICAgICAgIGRhdGE6IHsgXG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb3BlbklkOiBvcGVuaWQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYWRkcmVzczogZXZlbnQuZGF0YS5vcmRlcnNbIDAgXS5hZGRyZXNzXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgJHVybDogJ2dldEFkZHJlc3NJZCdcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgbmFtZTogJ2FkZHJlc3MnXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIC8vIOiuouWNleadpea6kO+8mui0reeJqei9puOAgeezu+e7n+WKoOWNlVxuICAgICAgICAgICAgaWYgKCggZXZlbnQuZGF0YS5mcm9tID09PSAnY2FydCcgfHwgZXZlbnQuZGF0YS5mcm9tID09PSAnc3lzdGVtJyApICYmIGFkZHJlc3NpZCQucmVzdWx0LnN0YXR1cyAhPT0gMjAwICkge1xuICAgICAgICAgICAgICAgIHRocm93ICfmn6Xor6LlnLDlnYDplJnor68nO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyDlj6/nlKjlnLDlnYBpZFxuICAgICAgICAgICAgY29uc3QgYWlkID0gYWRkcmVzc2lkJC5yZXN1bHQuZGF0YTtcblxuICAgICAgICAgICAgLy8g5piv5ZCm5paw5a6i5oi3XG4gICAgICAgICAgICBjb25zdCBpc05ldyQgPSBhd2FpdCBjbG91ZC5jYWxsRnVuY3Rpb24oe1xuICAgICAgICAgICAgICAgIG5hbWU6ICdjb21tb24nLFxuICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgJHVybDogJ2lzLW5ldy1jdXN0b21lcicsXG4gICAgICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG9wZW5JZDogb3BlbmlkXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KVxuXG4gICAgICAgICAgICBjb25zdCBpc05ldyA9IGlzTmV3JC5yZXN1bHQuZGF0YTtcblxuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiDmlrDlrqIgKyDmlrDlrqLopoHorqLph5EgPSAnMCcsXG4gICAgICAgICAgICAgKiDmlrDlrqIgKyDopoHorqLph5EgPSAnMCcsXG4gICAgICAgICAgICAgKiDmlrDlrqIgKyDlhY3orqLph5EgPSAnMScsXG4gICAgICAgICAgICAgKiDml6flrqIgKyDml6flrqLlhY3orqLph5EgPSAnMScsXG4gICAgICAgICAgICAgKiDml6flrqIgKyDopoHorqLph5EgPSAnMCcsXG4gICAgICAgICAgICAgKiDml6flrqIgKyDlhY3orqLph5EgPSAnMScsXG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIGxldCBwYXlfc3RhdHVzID0gJzAnO1xuICAgICAgICAgICAgY29uc3QgcCA9IHRyaXAucGF5bWVudDtcblxuICAgICAgICAgICAgaWYgKCBpc05ldyAmJiBwID09PSAnMCcgKSB7XG4gICAgICAgICAgICAgICAgcGF5X3N0YXR1cyA9ICcwJ1xuXG4gICAgICAgICAgICB9IGVsc2UgaWYgKCBpc05ldyAmJiBwID09PSAnMScgKSB7XG4gICAgICAgICAgICAgICAgcGF5X3N0YXR1cyA9ICcwJ1xuXG4gICAgICAgICAgICB9IGVsc2UgaWYgKCBpc05ldyAmJiBwID09PSAnMicgKSB7XG4gICAgICAgICAgICAgICAgcGF5X3N0YXR1cyA9ICcxJ1xuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgfSBlbHNlIGlmICggIWlzTmV3ICYmIHAgPT09ICcwJyApIHtcbiAgICAgICAgICAgICAgICBwYXlfc3RhdHVzID0gJzEnXG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICB9IGVsc2UgaWYgKCAhaXNOZXcgJiYgcCA9PT0gJzEnICkge1xuICAgICAgICAgICAgICAgIHBheV9zdGF0dXMgPSAnMCdcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoICFpc05ldyAmJiBwID09PSAnMicgKSB7XG4gICAgICAgICAgICAgICAgcGF5X3N0YXR1cyA9ICcxJ1xuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBwYXlfc3RhdHVzID0gJzAnXG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIDPjgIHmibnph4/liJvlu7rorqLljZXvvIzvvIjov4fmu6TmjonkuI3og73liJvlu7rotK3nianmuIXljZXnmoTllYblk4HvvIlcbiAgICAgICAgICAgIGNvbnN0IHRlbXAgPSBldmVudC5kYXRhLm9yZGVycy5tYXAoIG1ldGEgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IHQgPSBPYmplY3QuYXNzaWduKHsgfSwgbWV0YSwge1xuICAgICAgICAgICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAgICAgICAgICogISBkZWxpdmVyX3N0YXR1c+S4uuacquWPkeW4gyDlj6/og73mnInpl67pophcbiAgICAgICAgICAgICAgICAgICAgICovXG4gICAgICAgICAgICAgICAgICAgIGFpZCxcbiAgICAgICAgICAgICAgICAgICAgaXNPY2N1cGllZDogdHJ1ZSwgLy8g5Y2g6aKG5bqT5a2Y5qCH5b+XXG4gICAgICAgICAgICAgICAgICAgIG9wZW5pZDogb3BlbmlkLFxuICAgICAgICAgICAgICAgICAgICBkZWxpdmVyX3N0YXR1czogJzAnLCBcbiAgICAgICAgICAgICAgICAgICAgYmFzZV9zdGF0dXM6ICcwJyxcbiAgICAgICAgICAgICAgICAgICAgcGF5X3N0YXR1czogIW1ldGEuZGVwb3NpdFByaWNlID8gJzEnIDogcGF5X3N0YXR1cyAsIC8vIOWVhuWTgeiuoumHkemineW6puS4ujBcbiAgICAgICAgICAgICAgICAgICAgY3JlYXRlVGltZTogbmV3IERhdGUoICkuZ2V0VGltZSggKSxcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogISFtZXRhLmRlcG9zaXRQcmljZSA/IG1ldGEudHlwZSA6ICdub3JtYWwnXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgZGVsZXRlIHRbJ2FkZHJlc3MnXTtcblxuICAgICAgICAgICAgICAgIGlmICggIXRbJ3NpZCddICkge1xuICAgICAgICAgICAgICAgICAgICBkZWxldGUgdFsnc2lkJ107XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgcmV0dXJuIHQ7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgLy8gNOOAgeaJuemHj+WIm+W7uuiuouWNlSAoIOWQjOaXtuWkhOeQhuWNoOmihui0p+WtmOeahOmXrumimCApXG4gICAgICAgICAgICBjb25zdCBzYXZlJDogYW55ID0gYXdhaXQgUHJvbWlzZS5hbGwoIHRlbXAubWFwKCBvID0+IHtcbiAgICAgICAgICAgICAgICByZXR1cm4gY3JlYXRlJCggb3BlbmlkLCBvLCBkYiwgY3R4ICk7XG4gICAgICAgICAgICB9KSk7XG4gICAgICAgIFxuICAgICAgICAgICAgaWYgKCBzYXZlJC5zb21lKCB4ID0+IHguc3RhdHVzICE9PSAyMDAgKSkge1xuICAgICAgICAgICAgICAgIHRocm93ICfliJvlu7rorqLljZXplJnor6/vvIEnXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIOi/lOWbnuiuouWNleS/oeaBr1xuICAgICAgICAgICAgY29uc3Qgb3JkZXJfcmVzdWx0ID0gc2F2ZSQubWFwKCggeCwgayApID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCB7IHByaWNlLCBjb3VudCwgcGF5X3N0YXR1cywgZGVwb3NpdFByaWNlIH0gPSB0ZW1wWyBrIF07XG4gICAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICAgICAgb2lkOiB4LmRhdGEuX2lkLFxuICAgICAgICAgICAgICAgICAgICBwcmljZSxcbiAgICAgICAgICAgICAgICAgICAgY291bnQsXG4gICAgICAgICAgICAgICAgICAgIHBheV9zdGF0dXMsXG4gICAgICAgICAgICAgICAgICAgIGRlcG9zaXRQcmljZVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICByZXR1cm4gY3R4LmJvZHkgPSB7XG4gICAgICAgICAgICAgICAgc3RhdHVzOiAyMDAsXG4gICAgICAgICAgICAgICAgZGF0YTogb3JkZXJfcmVzdWx0XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgIH0gY2F0Y2ggKCBlICkge1xuICAgICBcbiAgICAgICAgICAgIHJldHVybiBjdHguYm9keSA9IHtcbiAgICAgICAgICAgICAgICBzdGF0dXM6IDUwMCxcbiAgICAgICAgICAgICAgICBtZXNzYWdlOiBlXG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICAvKipcbiAgICAgKiBAZGVzY3JpcHRpb25cbiAgICAgKiDlrqLmiLfnq6/mn6Xor6JcbiAgICAgKiBcbiAgICAgKiDliIbpobUgKyBxdWVyeSDmn6Xor6LorqLljZXliJfooajvvIjmnKrogZrlkIjvvIlcbiAgICAgKiAtLS0tLSDor7fmsYIgLS0tLS0tXG4gICAgICoge1xuICAgICAqISAgICB0aWQ6IOihjOeoi2lkIO+8iOWPr+aXoO+8iVxuICAgICAqICAgICBvcGVuaWQ6IO+8iOWPr+aXoO+8iVxuICAgICAqICAgICBwYWdlOiBudW1iZXJcbiAgICAgKiAgICAgc2tpcDogbnVtYmVyXG4gICAgICogICAgIHR5cGU6IOaIkeeahOWFqOmDqCB8IOacquS7mOasvuiuouWNlSB8IOW+heWPkei0pyB8IOW3suWujOaIkCB8IOeuoeeQhuWRmO+8iOihjOeoi+iuouWNle+8iXwg566h55CG5ZGY77yI5omA5pyJ6K6i5Y2V77yJXG4gICAgICogICAgIHR5cGU6IG15LWFsbCB8IG15LW5vdHBheSB8IG15LWRlbGl2ZXIgfCBteS1maW5pc2ggfCBtYW5hZ2VyLXRyaXAgfCBtYW5hZ2VyLWFsbFxuICAgICAqICAgICBwYXNzdXNlZGxlc3M6IHRydWUgfCBmYWxzZSB8IHVuZGVmaW5lZCDmmK/lkKbov4fmu6Tmjonov4fmnJ/nmoTorqLljZVcbiAgICAgKiB9XG4gICAgICogISDmnKrku5jmrL7orqLljZXvvJpwYXlfc3RhdHVzOiDmnKrku5jmrL4v5bey5LuY6K6i6YeRIOaIliB0eXBlOiBwcmVcbiAgICAgKiAhIOW+heWPkei0p++8mmRlbGl2ZXJfc3RhdHVz77ya5pyq5Y+R6LSnIOS4lCBwYXlfc3RhdHVzIOW3suS7mOasvlxuICAgICAqICEg5bey5a6M5oiQ77yaZGVsaXZlcl9zdGF0dXPvvJrlt7Llj5HotKcg5LiUIHBheV9zdGF0dXMg5bey5LuY5YWo5qy+XG4gICAgICovXG4gICAgYXBwLnJvdXRlcignbGlzdCcsIGFzeW5jKCBjdHgsIG5leHQgKSA9PiB7XG4gICAgICAgIHRyeSB7XG5cbiAgICAgICAgICAgIGxldCB3aGVyZSQgPSB7IH07XG4gICAgICAgICAgICBjb25zdCB7IHR5cGUsIHRpZCwgcGFzc3VzZWRsZXNzIH0gPSBldmVudC5kYXRhO1xuXG4gICAgICAgICAgICAvLyDmn6Xor6LmnaHmlbBcbiAgICAgICAgICAgIGNvbnN0IGxpbWl0ID0gdGlkID8gOTkgOiAxMDtcblxuICAgICAgICAgICAgY29uc3Qgb3BlbmlkID0gZXZlbnQuZGF0YS5vcGVuaWQgfHwgZXZlbnQudXNlckluZm8ub3BlbklkO1xuXG5cbiAgICAgICAgICAgIC8vIOaIkeeahOWFqOmDqFxuICAgICAgICAgICAgaWYgKCB0eXBlID09PSAnbXktYWxsJyApIHtcbiAgICAgICAgICAgICAgICB3aGVyZSQgPSB7XG4gICAgICAgICAgICAgICAgICAgIG9wZW5pZDogb3BlbmlkXG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyDmnKrku5jmrL5cbiAgICAgICAgICAgIH0gZWxzZSBpZiAoIHR5cGUgPT09ICdteS1ub3RwYXknICkge1xuICAgICAgICAgICAgICAgIHdoZXJlJCA9IF8uYW5kKHtcbiAgICAgICAgICAgICAgICAgICAgb3BlbmlkLFxuICAgICAgICAgICAgICAgICAgICBiYXNlX3N0YXR1czogJzInXG4gICAgICAgICAgICAgICAgfSwgXy5vcihbXG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6ICdwcmUnXG4gICAgICAgICAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHBheV9zdGF0dXM6IF8ub3IoIF8uZXEoJzAnKSwgXy5lcSgnMScpKVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgXSkpO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICAvLyDmnKrlj5HotKdcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoIHR5cGUgPT09ICdteS1kZWxpdmUnICkge1xuICAgICAgICAgICAgICAgIHdoZXJlJCA9IHtcbiAgICAgICAgICAgICAgICAgICAgb3BlbmlkLFxuICAgICAgICAgICAgICAgICAgICBwYXlfc3RhdHVzOiAnMicsXG4gICAgICAgICAgICAgICAgICAgIGRlbGl2ZXJfc3RhdHVzOiAnMCdcbiAgICAgICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAvLyDlt7LlrozmiJBcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoIHR5cGUgPT09ICdteS1maW5pc2gnICkge1xuICAgICAgICAgICAgICAgIHdoZXJlJCA9IHtcbiAgICAgICAgICAgICAgICAgICAgb3BlbmlkLFxuICAgICAgICAgICAgICAgICAgICBwYXlfc3RhdHVzOiAnMicsXG4gICAgICAgICAgICAgICAgICAgIGRlbGl2ZXJfc3RhdHVzOiAnMSdcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyDov4fmu6Tmjonov4fmnJ/orqLljZVcbiAgICAgICAgICAgIGlmICggcGFzc3VzZWRsZXNzICE9PSBmYWxzZSApIHtcbiAgICAgICAgICAgICAgICB3aGVyZSQgPSBPYmplY3QuYXNzaWduKHsgfSwgd2hlcmUkLCB7XG4gICAgICAgICAgICAgICAgICAgIGJhc2Vfc3RhdHVzOiBfLm5lcSgnNScpXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIOihjOeoi+iuouWNlVxuICAgICAgICAgICAgaWYgKCB0aWQgKSB7XG4gICAgICAgICAgICAgICAgd2hlcmUkID0gT2JqZWN0LmFzc2lnbih7IH0sIHdoZXJlJCwge1xuICAgICAgICAgICAgICAgICAgICB0aWRcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8g6I635Y+W5oC75pWwXG4gICAgICAgICAgICBjb25zdCB0b3RhbCQgPSBhd2FpdCBkYi5jb2xsZWN0aW9uKCdvcmRlcicpXG4gICAgICAgICAgICAgICAgLndoZXJlKCB3aGVyZSQgKVxuICAgICAgICAgICAgICAgIC5jb3VudCggKTtcblxuICAgICAgICAgICAgLy8g6I635Y+W6K6i5Y2V5pWw5o2uXG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqICEg5aaC5p6c5piv5pyJ5oyH5a6adGlk55qE77yM5YiZ5LiN6ZyA6KaBbGltaXTkuobvvIznm7TmjqXmi4nlj5booYznqIvmiYDmnInnmoTorqLljZVcbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgY29uc3QgZGF0YSQgPSBhd2FpdCBkYi5jb2xsZWN0aW9uKCdvcmRlcicpXG4gICAgICAgICAgICAgICAgLndoZXJlKCB3aGVyZSQgKVxuICAgICAgICAgICAgICAgIC5vcmRlckJ5KCdjcmVhdGVUaW1lJywgJ2Rlc2MnKVxuICAgICAgICAgICAgICAgIC5saW1pdCggbGltaXQgKVxuICAgICAgICAgICAgICAgIC5za2lwKCBldmVudC5kYXRhLnNraXAgfHwgKCBldmVudC5kYXRhLnBhZ2UgLSAxICkgKiBsaW1pdCApXG4gICAgICAgICAgICAgICAgLmdldCggKTtcblxuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiAhIOeUseS6juafpeivouaYr+aMieWIhumhte+8jOS9huaYr+aYvuekuuaYr+aMieihjOeoi+adpeiBmuWQiOaYvuekulxuICAgICAgICAgICAgICogISDlm6DmraTmnInlj6/og73vvIxO6aG15pyA5ZCO5LiA5L2N77yM6LefTisx6aG156ys5LiA5L2N5L6d54S25bGe5LqO5ZCM5LiA6KGM56iLXG4gICAgICAgICAgICAgKiAhIOWmguS4jei/m+ihjOWkhOeQhu+8jOWuouaIt+afpeivouiuouWNleWIl+ihqOaYvuekuuihjOeoi+iuouWNleaXtu+8jOS8muKAnOacieWPr+iDveKAneaYvuekuuS4jeWFqFxuICAgICAgICAgICAgICogISDnibnmrorlpITnkIbvvJrnlKjmnIDlkI7kuIDkvY3nmoR0aWTvvIzmn6Xor6LmnIDlkI7kuIDkvY3ku6XlkI7lkIx0aWTnmoRvcmRlcu+8jOeEtuWQjuS/ruato+aJgOi/lOWbnueahHBhZ2VcbiAgICAgICAgICAgICAqL1xuXG4gICAgICAgICAgICBjb25zdCBsYXN0ID0gZGF0YSQuZGF0YVsgZGF0YSQuZGF0YS5sZW5ndGggLSAxIF07XG5cbiAgICAgICAgICAgIGxldCBmaXgkOiBhbnkgPSB7XG4gICAgICAgICAgICAgICAgZGF0YTogWyBdXG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAvLyDlpoLmnpzmsqHmnIl0aWTlj4LmlbDvvIzmiY3ljrvlgZpmaXjnmoTliqjkvZxcbiAgICAgICAgICAgIGlmICggbGFzdCAmJiAhdGlkICkgeyBcbiAgICAgICAgICAgICAgICBmaXgkID0gYXdhaXQgZGIuY29sbGVjdGlvbignb3JkZXInKVxuICAgICAgICAgICAgICAgICAgICAud2hlcmUoe1xuICAgICAgICAgICAgICAgICAgICAgICAgb3BlbmlkLFxuICAgICAgICAgICAgICAgICAgICAgICAgdGlkOiBsYXN0LnRpZCxcbiAgICAgICAgICAgICAgICAgICAgICAgIGJhc2Vfc3RhdHVzOiBfLm5lcSgnNScpXG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgIC5vcmRlckJ5KCdjcmVhdGVUaW1lJywgJ2Rlc2MnKVxuICAgICAgICAgICAgICAgICAgICAuc2tpcCggZXZlbnQuZGF0YS5za2lwID8gZXZlbnQuZGF0YS5za2lwICsgZGF0YSQuZGF0YS5sZW5ndGggOiAoIGV2ZW50LmRhdGEucGFnZSAtIDEgKSAqIGxpbWl0ICsgZGF0YSQuZGF0YS5sZW5ndGggKVxuICAgICAgICAgICAgICAgICAgICAuZ2V0KCApO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBjb25zdCBtZXRhID0gWyAuLi5kYXRhJC5kYXRhLCAuLi5maXgkLmRhdGEgXTtcblxuICAgICAgICAgICAgLy8g6L+Z6YeM55qE6KGM56iL6K+m5oOF55SoIG5ldyBTZXTnmoTmlrnlvI/mn6Xor6JcbiAgICAgICAgICAgIGNvbnN0IHRyaXBJZHMgPSBBcnJheS5mcm9tKFxuICAgICAgICAgICAgICAgIG5ldyBTZXQoIG1ldGEubWFwKCBtID0+IG0udGlkICkpXG4gICAgICAgICAgICApO1xuXG4gICAgICAgICAgICBjb25zdCB0cmlwcyQgPSBhd2FpdCBQcm9taXNlLmFsbCggdHJpcElkcy5tYXAoIHRpZCA9PiB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGRiLmNvbGxlY3Rpb24oJ3RyaXAnKVxuICAgICAgICAgICAgICAgICAgICAud2hlcmUoe1xuICAgICAgICAgICAgICAgICAgICAgICAgX2lkOiB0aWRcbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgLmdldCggKTtcbiAgICAgICAgICAgIH0pKTtcbiAgICAgXG4gICAgICAgICAgICAvLyDogZrlkIjooYznqIvmlbDmja5cbiAgICAgICAgICAgIGNvbnN0IG1ldGEyID0gbWV0YS5tYXAoKCB4LCBpICkgPT4gT2JqZWN0LmFzc2lnbih7IH0sIHgsIHtcbiAgICAgICAgICAgICAgICAvLyB0cmlwOiB0cmlwcyRbIGkgXS5kYXRhWyAwIF1cbiAgICAgICAgICAgICAgICB0cmlwOiAodHJpcHMkLmZpbmQoIHkgPT4geS5kYXRhWyAwIF0uX2lkID09PSB4LnRpZCApIGFzIGFueSkuZGF0YVsgMCBdXG4gICAgICAgICAgICB9KSk7XG5cbiAgICAgICAgICAgIHJldHVybiBjdHguYm9keSA9IHtcbiAgICAgICAgICAgICAgICBzdGF0dXM6IDIwMCxcbiAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICAgIGRhdGE6IG1ldGEyLFxuICAgICAgICAgICAgICAgICAgICBwYWdlU2l6ZTogbGltaXQsXG4gICAgICAgICAgICAgICAgICAgIHRvdGFsOiB0b3RhbCQudG90YWwsXG4gICAgICAgICAgICAgICAgICAgIHBhZ2U6IGZpeCQuZGF0YS5sZW5ndGggPT09IDAgPyBldmVudC5kYXRhLnBhZ2UgOiBldmVudC5kYXRhLnBhZ2UgKyBNYXRoLmNlaWwoIGZpeCQuZGF0YS5sZW5ndGggLyBsaW1pdCApLFxuICAgICAgICAgICAgICAgICAgICBjdXJyZW50OiBldmVudC5kYXRhLnNraXAgPyBldmVudC5kYXRhLnNraXAgKyBtZXRhLmxlbmd0aCA6ICggZXZlbnQuZGF0YS5wYWdlIC0gMSApICogbGltaXQgKyBtZXRhLmxlbmd0aCxcbiAgICAgICAgICAgICAgICAgICAgdG90YWxQYWdlOiBNYXRoLmNlaWwoIHRvdGFsJC50b3RhbCAvIGxpbWl0IClcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBcbiAgICAgICAgfSBjYXRjaCAoIGUgKSB7IHJldHVybiBjdHguYm9keSA9IHsgc3RhdHVzOiA1MDB9O31cbiAgICB9KVxuXG4gICAgLyoqXG4gICAgICog5om56YeP5pu05paw77yM6K6i5Y2V5Li65bey5pSv5LuY77yM5bm25LiU5aKe5Yqg5Yiw6LSt54mp5riF5Y2VXG4gICAgICogb3JkZXJJZHM6IFwiMTIzLDIzNCwzNDVcIlxuICAgICAqIGZvcm1faWQsXG4gICAgICogcHJlcGF5X2lkXG4gICAgICovXG4gICAgYXBwLnJvdXRlcigndXBhZHRlLXRvLXBheWVkJywgYXN5bmMoIGN0eCwgbmV4dCApID0+IHtcbiAgICAgICAgdHJ5IHtcblxuICAgICAgICAgICAgY29uc3Qgb3BlbklkID0gZXZlbnQudXNlckluZm8ub3BlbklkO1xuICAgICAgICAgICAgY29uc3QgeyBvcmRlcklkcywgcHJlcGF5X2lkLCBmb3JtX2lkIH0gPSBldmVudC5kYXRhO1xuXG4gICAgICAgICAgICAvLyDmm7TmlrDorqLljZXlrZfmrrVcbiAgICAgICAgICAgIGF3YWl0IFByb21pc2UuYWxsKCBvcmRlcklkcy5zcGxpdCgnLCcpLm1hcCggb2lkID0+IHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZGIuY29sbGVjdGlvbignb3JkZXInKS5kb2MoIG9pZCApXG4gICAgICAgICAgICAgICAgICAgIC51cGRhdGUoe1xuICAgICAgICAgICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvcm1faWQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJlcGF5X2lkLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBheV9zdGF0dXM6ICcxJ1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0pKTtcblxuICAgICAgICAgICAgLy8g5Yib5bu6L+aPkuWFpeWIsOi0reeJqea4heWNlVxuICAgICAgICAgICAgY29uc3QgZmluZCQ6IGFueSA9IGF3YWl0IFByb21pc2UuYWxsKCBvcmRlcklkcy5zcGxpdCgnLCcpLm1hcCggb2lkID0+IHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZGIuY29sbGVjdGlvbignb3JkZXInKVxuICAgICAgICAgICAgICAgICAgICAud2hlcmUoe1xuICAgICAgICAgICAgICAgICAgICAgICAgX2lkOiBvaWRcbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgLmdldCggKTtcbiAgICAgICAgICAgIH0pKTtcblxuICAgICAgICAgICAgY29uc3QgbGlzdCA9IGZpbmQkLm1hcCggeCA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3QgeyBfaWQsIHRpZCwgcGlkLCBzaWQsIHByaWNlLCBncm91cFByaWNlLCBhY2lkIH0gPSB4LmRhdGFbIDAgXTtcbiAgICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgICAgICBvaWQ6IF9pZCxcbiAgICAgICAgICAgICAgICAgICAgYWNpZCwgZ3JvdXBQcmljZSxcbiAgICAgICAgICAgICAgICAgICAgdGlkLCBwaWQsIHNpZCwgcHJpY2VcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgLy8g6L+Z6YeM5pys5p2l5LiN6ZyA6KaB5ZCM5q2l562J5b6F6LSt54mp5riF5Y2V55qE5Yib5bu677yM5L2G5piv5LiN5YqgYXdhaXTosozkvLzmsqHmnInooqvmiafooYzliLBcbiAgICAgICAgICAgIGF3YWl0IGNsb3VkLmNhbGxGdW5jdGlvbih7XG4gICAgICAgICAgICAgICAgbmFtZTogJ3Nob3BwaW5nLWxpc3QnLFxuICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgJHVybDogJ2NyZWF0ZScsXG4gICAgICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxpc3QsXG4gICAgICAgICAgICAgICAgICAgICAgICBvcGVuSWRcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pXG5cbiAgICAgICAgICAgIHJldHVybiBjdHguYm9keSA9IHtcbiAgICAgICAgICAgICAgICBzdGF0dXM6IDIwMFxuICAgICAgICAgICAgfVxuXG4gICAgICAgIH0gY2F0Y2ggKCBlICkgeyBcbiAgICAgICAgICAgIHJldHVybiBjdHguYm9keSA9IHsgc3RhdHVzOiA1MDAgfTtcbiAgICAgICAgfSBcbiAgICB9KVxuXG4gICAgLyoqIFxuICAgICAqIEBkZXNjcmlwdGlvblxuICAgICAqIOS7o+i0rea4heW4kOWCrOasvueahOiuouWNleWIl+ihqFxuICAgICAqIHtcbiAgICAgKiAgICAgdGlkIFxuICAgICAqICAgICBuZWVkQ291cG9uczogZmFsc2UgfCB0cnVlIHwgdW5kZWZpbmVkXG4gICAgICogICAgIG5lZWRBZGRyZXNzOiBmYWxzZSB8IHRydWUgfCB1bmRlZmluZWRcbiAgICAgKiB9XG4gICAgICovXG4gICAgYXBwLnJvdXRlcignZGFpZ291LWxpc3QnLCBhc3luYyggY3R4LCBuZXh0ICkgPT4ge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgY29uc3QgeyB0aWQsIG5lZWRDb3Vwb25zLCBuZWVkQWRkcmVzcyB9ID0gZXZlbnQuZGF0YTtcblxuICAgICAgICAgICAgLy8g6K6i5Y2V5L+h5oGvXG4gICAgICAgICAgICBjb25zdCBvcmRlcnMkID0gYXdhaXQgZGIuY29sbGVjdGlvbignb3JkZXInKVxuICAgICAgICAgICAgICAgIC53aGVyZSh7XG4gICAgICAgICAgICAgICAgICAgIHRpZCxcbiAgICAgICAgICAgICAgICAgICAgYmFzZV9zdGF0dXM6IF8ubmVxKCc1JyksXG4gICAgICAgICAgICAgICAgICAgIHBheV9zdGF0dXM6IF8ub3IoIF8uZXEoJzEnKSwgXy5lcSgnMicpKVxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLmdldCggKTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgLy8g55So5oi35L+h5oGvXG4gICAgICAgICAgICBjb25zdCB1c2VycyQgPSBhd2FpdCBQcm9taXNlLmFsbChcbiAgICAgICAgICAgICAgICBBcnJheS5mcm9tKCBcbiAgICAgICAgICAgICAgICAgICAgbmV3IFNldCggb3JkZXJzJC5kYXRhXG4gICAgICAgICAgICAgICAgICAgICAgICAubWFwKCB4ID0+IHgub3BlbmlkIClcbiAgICAgICAgICAgICAgICApKVxuICAgICAgICAgICAgICAgIC5tYXAoIHVpZCA9PiBkYi5jb2xsZWN0aW9uKCd1c2VyJylcbiAgICAgICAgICAgICAgICAgICAgLndoZXJlKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG9wZW5pZDogdWlkXG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgIC5nZXQoICkpXG4gICAgICAgICAgICApO1xuXG4gICAgICAgICAgICAvLyDlv6vpgJLotLnnlKjkv6Hmga9cbiAgICAgICAgICAgIGNvbnN0IGRlbGl2ZXJmZWVzJCA9IGF3YWl0IFByb21pc2UuYWxsKFxuICAgICAgICAgICAgICAgIEFycmF5LmZyb20oIFxuICAgICAgICAgICAgICAgICAgICBuZXcgU2V0KCBvcmRlcnMkLmRhdGFcbiAgICAgICAgICAgICAgICAgICAgICAgIC5tYXAoIHggPT4geC5vcGVuaWQgKVxuICAgICAgICAgICAgICAgICkpXG4gICAgICAgICAgICAgICAgLm1hcCggdWlkID0+IGRiLmNvbGxlY3Rpb24oJ2RlbGl2ZXItZmVlJylcbiAgICAgICAgICAgICAgICAgICAgLndoZXJlKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRpZCxcbiAgICAgICAgICAgICAgICAgICAgICAgIG9wZW5pZDogdWlkXG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgIC5nZXQoICkpXG4gICAgICAgICAgICApO1xuXG4gICAgICAgICAgICAvLyDlnLDlnYDkv6Hmga9cbiAgICAgICAgICAgIGxldCBhZGRyZXNzJDogYW55ID0gWyBdO1xuICAgICAgICAgICAgaWYgKCAhIW5lZWRBZGRyZXNzIHx8IG5lZWRBZGRyZXNzID09PSB1bmRlZmluZWQgKSB7XG4gICAgICAgICAgICAgICAgYWRkcmVzcyQgPSBhd2FpdCBQcm9taXNlLmFsbChcbiAgICAgICAgICAgICAgICAgICAgQXJyYXkuZnJvbShcbiAgICAgICAgICAgICAgICAgICAgICAgIG5ldyBTZXQoIG9yZGVycyQuZGF0YVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5tYXAoIHggPT4geC5haWQgKVxuICAgICAgICAgICAgICAgICAgICApKVxuICAgICAgICAgICAgICAgICAgICAubWFwKCBhaWQgPT4gZGIuY29sbGVjdGlvbignYWRkcmVzcycpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5kb2MoIGFpZCApXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5nZXQoICkpXG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIFxuICAgICAgICAgICAgLy8g5Y2h5Yi45L+h5oGvXG4gICAgICAgICAgICBsZXQgY291cG9ucyQ6IGFueSA9IFsgXTtcbiAgICAgICAgICAgIGlmICggISFuZWVkQ291cG9ucyB8fCBuZWVkQ291cG9ucyA9PT0gdW5kZWZpbmVkICkge1xuICAgICAgICAgICAgICAgIGNvdXBvbnMkID0gYXdhaXQgUHJvbWlzZS5hbGwoXG4gICAgICAgICAgICAgICAgICAgIEFycmF5LmZyb20oXG4gICAgICAgICAgICAgICAgICAgICAgICBuZXcgU2V0KCBvcmRlcnMkLmRhdGEgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLm1hcCggeCA9PiB4Lm9wZW5pZCApXG4gICAgICAgICAgICAgICAgICAgICkpXG4gICAgICAgICAgICAgICAgICAgIC5tYXAoIG9wZW5pZCA9PiBkYi5jb2xsZWN0aW9uKCdjb3Vwb24nKVxuICAgICAgICAgICAgICAgICAgICAgICAgLndoZXJlKCBfLm9yKFtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRpZCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb3BlbmlkLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiBfLm9yKCBfLmVxKCd0X21hbmppYW4nKSwgXy5lcSgndF9saWppYW4nKSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9wZW5pZCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaXNVc2VkOiBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FuVXNlSW5OZXh0OiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiAndF9kYWlqaW4nXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgXSkpXG4gICAgICAgICAgICAgICAgICAgICAgICAuZ2V0KCApXG4gICAgICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgXG4gICAgICAgICAgICBjb25zdCB1c2VyT2RlcnMgPSB1c2VycyQubWFwKCggdXNlciQsIGsgKSA9PiB7XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgY29uc3QgdXNlciA9IHVzZXIkLmRhdGFbIDAgXTtcblxuICAgICAgICAgICAgICAgIGNvbnN0IG9yZGVycyA9IG9yZGVycyQuZGF0YVxuICAgICAgICAgICAgICAgICAgICAuZmlsdGVyKCB4ID0+IHgub3BlbmlkID09PSB1c2VyLm9wZW5pZCApO1xuXG4gICAgICAgICAgICAgICAgY29uc3QgYWRkcmVzcyA9IGFkZHJlc3MkLmxlbmd0aCA+IDAgP1xuICAgICAgICAgICAgICAgICAgICBhZGRyZXNzJFxuICAgICAgICAgICAgICAgICAgICAgICAgLm1hcCggeCA9PiB4LmRhdGEgKVxuICAgICAgICAgICAgICAgICAgICAgICAgLmZpbHRlciggeCA9PiB4Lm9wZW5pZCA9PT0gdXNlci5vcGVuaWQgKSA6XG4gICAgICAgICAgICAgICAgICAgIHVuZGVmaW5lZDtcblxuICAgICAgICAgICAgICAgIGNvbnN0IGNvdXBvbnMgPSBjb3Vwb25zJC5sZW5ndGggPiAwID9cbiAgICAgICAgICAgICAgICAgICAgY291cG9ucyRcbiAgICAgICAgICAgICAgICAgICAgICAgIC5tYXAoIHggPT4geC5kYXRhIClcbiAgICAgICAgICAgICAgICAgICAgICAgIC5maWx0ZXIoIHggPT4geC5sZW5ndGggPiAwICYmIHhbIDAgXS5vcGVuaWQgPT09IHVzZXIub3BlbmlkICkgOlxuICAgICAgICAgICAgICAgICAgICB1bmRlZmluZWQ7XG5cbiAgICAgICAgICAgICAgICBjb25zdCBkZWxpdmVyRmVlID0gZGVsaXZlcmZlZXMkWyBrIF0uZGF0YVsgMCBdIHx8IG51bGxcblxuICAgICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgICAgIHVzZXIsXG4gICAgICAgICAgICAgICAgICAgIG9yZGVycyxcbiAgICAgICAgICAgICAgICAgICAgYWRkcmVzcyxcbiAgICAgICAgICAgICAgICAgICAgZGVsaXZlckZlZSxcbiAgICAgICAgICAgICAgICAgICAgY291cG9uczogKCEhY291cG9ucyAmJiBjb3Vwb25zLmxlbmd0aCA+IDAgKSA/IGNvdXBvbnNbIDAgXSA6IFsgXVxuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgcmV0dXJuIGN0eC5ib2R5ID0ge1xuICAgICAgICAgICAgICAgIHN0YXR1czogMjAwLFxuICAgICAgICAgICAgICAgIGRhdGE6IHVzZXJPZGVyc1xuICAgICAgICAgICAgfVxuXG4gICAgICAgIH0gY2F0Y2ggKCBlICkge1xuICAgICAgICAgICAgY29uc29sZS5sb2coICcuLi4nLCBlICk7XG4gICAgICAgICAgICByZXR1cm4gY3R4LmJvZHkgPSB7IHN0YXR1czogNTAwIH07XG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgIC8qKlxuICAgICAqIEBkZXNjcmlwdGlvblxuICAgICAqIOS7jua4heW4kOWCrOasvu+8jOiwg+aVtOiuouWNleWIhumFjemHj1xuICAgICAqIHtcbiAgICAgKiAgICAgIG9pZCwgdGlkLCBzaWQsIHBpZCwgY291bnRcbiAgICAgKiB9XG4gICAgICovXG4gICAgYXBwLnJvdXRlcignYWRqdXN0LWNvdW50JywgYXN5bmMoIGN0eCwgbmV4dCApID0+IHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGNvbnN0IG9wZW5pZCA9IGV2ZW50LmRhdGEub3BlbklkIHx8IGV2ZW50LnVzZXJJbmZvLm9wZW5JZDsgXG4gICAgICAgICAgICBjb25zdCB7IG9pZCwgdGlkLCBzaWQsIHBpZCwgY291bnQgfSA9IGV2ZW50LmRhdGE7XG5cbiAgICAgICAgICAgIGNvbnN0IGdldFdyb25nID0gbWVzc2FnZSA9PiBjdHguYm9keSA9IHtcbiAgICAgICAgICAgICAgICBtZXNzYWdlLFxuICAgICAgICAgICAgICAgIHN0YXR1czogNDAwXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICog5piv5ZCm6IO957un57ut6LCD5pW0XG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIGNvbnN0IG9yZGVyJCA9IGF3YWl0IGRiLmNvbGxlY3Rpb24oJ29yZGVyJylcbiAgICAgICAgICAgICAgICAuZG9jKCBvaWQgKVxuICAgICAgICAgICAgICAgIC5nZXQoICk7XG5cbiAgICAgICAgICAgIGlmICggb3JkZXIkLmRhdGEuYmFzZV9zdGF0dXMgPT09ICcyJyApIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZ2V0V3JvbmcoJ+WCrOasvuWQjuS4jeiDveS/ruaUueaVsOmHjycpO1xuXG4gICAgICAgICAgICB9IGVsc2UgaWYgKCBvcmRlciQuZGF0YS5iYXNlX3N0YXR1cyA9PT0gJzAnICkge1xuICAgICAgICAgICAgICAgIHJldHVybiBnZXRXcm9uZygn6K+35YWI6LCD5pW06K+l5ZWG5ZOB5Lu35qC8Jyk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICog5LiN6IO95aSa5LqO5riF5Y2V5YiG6YWN55qE5oC76LSt5YWl6YePXG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIGNvbnN0IHNob3BwaW5nJCA9IGF3YWl0IGRiLmNvbGxlY3Rpb24oJ3Nob3BwaW5nLWxpc3QnKVxuICAgICAgICAgICAgICAgIC53aGVyZSh7XG4gICAgICAgICAgICAgICAgICAgIHRpZCwgc2lkLCBwaWRcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIC5nZXQoICk7XG4gICAgICAgICAgICBjb25zdCBzaG9wcGluZyA9IHNob3BwaW5nJC5kYXRhWyAwIF07XG4gICAgICAgICAgICBjb25zdCBsYXN0T3JkZXJzJCA9IGF3YWl0IGRiLmNvbGxlY3Rpb24oJ29yZGVyJylcbiAgICAgICAgICAgICAgICAud2hlcmUoe1xuICAgICAgICAgICAgICAgICAgICB0aWQsIHNpZCwgcGlkLFxuICAgICAgICAgICAgICAgICAgICBwYXlfc3RhdHVzOiBfLm5lcSgnMCcpLFxuICAgICAgICAgICAgICAgICAgICBiYXNlX3N0YXR1czogXy5vciggXy5lcSgnMScpLCBfLmVxKCcyJyksIF8uZXEoJzMnKSlcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIC5nZXQoICk7XG5cbiAgICAgICAgICAgIGNvbnN0IGxhc3RPcmRlcnMgPSBsYXN0T3JkZXJzJC5kYXRhO1xuICAgICAgICAgICAgY29uc3Qgb3RoZXJDb3VudDogYW55ID0gbGFzdE9yZGVyc1xuICAgICAgICAgICAgICAgIC5maWx0ZXIoIG8gPT4gby5faWQgIT09IG9pZCApXG4gICAgICAgICAgICAgICAgLnJlZHVjZSgoIHgsIHkgKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB4ICsgeS5hbGxvY2F0ZWRDb3VudCB8fCAwXG4gICAgICAgICAgICAgICAgfSwgMCApO1xuXG4gICAgICAgICAgICBpZiAoIGNvdW50ICsgb3RoZXJDb3VudCA+IHNob3BwaW5nLnB1cmNoYXNlICkge1xuICAgICAgICAgICAgICAgIHJldHVybiBnZXRXcm9uZyhg6K+l5ZWG5ZOB5oC75pWw6YeP5LiN6IO95aSn5LqO6YeH6LSt5pWwJHtzaG9wcGluZy5wdXJjaGFzZX3ku7bvvIFgKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLyoqIOabtOaWsOiuouWNlSAqL1xuICAgICAgICAgICAgYXdhaXQgZGIuY29sbGVjdGlvbignb3JkZXInKVxuICAgICAgICAgICAgICAgIC5kb2MoIG9pZCApXG4gICAgICAgICAgICAgICAgLnVwZGF0ZSh7XG4gICAgICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGFsbG9jYXRlZENvdW50OiBjb3VudFxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICog5pu05paw5riF5Y2VXG4gICAgICAgICAgICAgKiDlsJHkuo7mgLvotK3lhaXph4/ml7bvvIzph43mlrDosIPmlbTmuIXljZXnmoTliankvZnliIbphY3ph49cbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgaWYgKCBjb3VudCArIG90aGVyQ291bnQgPCBzaG9wcGluZy5wdXJjaGFzZSApIHtcblxuICAgICAgICAgICAgICAgIGNvbnN0IG5ld3Nob3BwaW5nID0gT2JqZWN0LmFzc2lnbih7IH0sIHNob3BwaW5nLCB7XG4gICAgICAgICAgICAgICAgICAgIGxhc3RBbGxvY2F0ZWQ6IHNob3BwaW5nLnB1cmNoYXNlIC0gKCBjb3VudCArIG90aGVyQ291bnQgKVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIGRlbGV0ZSBuZXdzaG9wcGluZ1snX2lkJ107XG5cbiAgICAgICAgICAgICAgICBhd2FpdCBkYi5jb2xsZWN0aW9uKCdzaG9wcGluZy1saXN0JylcbiAgICAgICAgICAgICAgICAgICAgLmRvYyggU3RyaW5nKCBzaG9wcGluZy5faWQgKSlcbiAgICAgICAgICAgICAgICAgICAgLnNldCh7XG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRhOiBuZXdzaG9wcGluZ1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIGN0eC5ib2R5ID0ge1xuICAgICAgICAgICAgICAgIHN0YXR1czogMjAwXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBcbiAgICAgICAgfSBjYXRjaCAoIGUgKSB7XG4gICAgICAgICAgICByZXR1cm4gY3R4LmJvZHkgPSB7IHN0YXR1czogNTAwIH1cbiAgICAgICAgfVxuICAgIH0pXG5cbiAgICAvKipcbiAgICAgKiBAZGVzY3JpcHRpb25cbiAgICAgKiDmibnph4/lnLDvvJrnoa7orqTlrqLmiLforqLljZXjgIHmmK/lkKblm6LotK3jgIHmtojmga/mjqjpgIHmk43kvZxcbiAgICAgKiB7XG4gICAgICogICAgdGlkLFxuICAgICAqICAgIG9yZGVyczoge1xuICAgICAqICAgICAgICBvaWRcbiAgICAgKiAgICAgICAgcGlkXG4gICAgICogICAgICAgIHNpZFxuICAgICAqICAgICAgICBvcGVuaWRcbiAgICAgKiAgICAgICAgcHJlcGF5X2lkXG4gICAgICogICAgICAgIGZvcm1faWRcbiAgICAgKiAgICAgICAgYWxsb2NhdGVkQ291bnRcbiAgICAgKiAgICAgICAgYWxsb2NhdGVkR3JvdXBQcmljZVxuICAgICAqICAgIH1bIF1cbiAgICAgKiAgICBub3RpZmljYXRpb246IHsgXG4gICAgICogICAgICAgdGl0bGUsXG4gICAgICogICAgICAgZGVzYyxcbiAgICAgKiAgICAgICB0aW1lXG4gICAgICogICAgfVxuICAgICAqIH1cbiAgICAgKi9cbiAgICBhcHAucm91dGVyKCdiYXRjaC1hZGp1c3QnLCBhc3luYyggY3R4LCBuZXh0ICkgPT4ge1xuICAgICAgICB0cnkge1xuXG4gICAgICAgICAgICAvKiog5piv5ZCm6IO95ou85ZuiICovXG4gICAgICAgICAgICBsZXQgY2FuR3JvdXBVc2VyTWFwQ291bnQ6IHtcbiAgICAgICAgICAgICAgICBbIGs6IHN0cmluZyBdIDogbnVtYmVyXG4gICAgICAgICAgICB9ID0geyB9O1xuXG4gICAgICAgICAgICBjb25zdCB7IHRpZCwgb3JkZXJzLCBub3RpZmljYXRpb24gfSA9IGV2ZW50LmRhdGE7XG4gICAgICAgICAgICBjb25zdCBnZXRXcm9uZyA9IG1lc3NhZ2UgPT4gY3R4LmJvZHkgPSB7XG4gICAgICAgICAgICAgICAgbWVzc2FnZSxcbiAgICAgICAgICAgICAgICBzdGF0dXM6IDQwMFxuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgY29uc3QgdHJpcCQgPSBhd2FpdCBkYi5jb2xsZWN0aW9uKCd0cmlwJylcbiAgICAgICAgICAgICAgICAuZG9jKCB0aWQgKVxuICAgICAgICAgICAgICAgIC5nZXQoICk7XG4gICAgICAgICAgICBjb25zdCB0cmlwID0gdHJpcCQuZGF0YTtcblxuICAgICAgICAgICAgLy8g5pyq57uT5p2f77yM5LiU5pyq5omL5Yqo5YWz6ZetXG4gICAgICAgICAgICBpZiAoIG5ldyBEYXRlKCApLmdldFRpbWUoICkgPCB0cmlwLmVuZF9kYXRlICYmICF0cmlwLmlzQ2xvc2VkICkge1xuICAgICAgICAgICAgICAgIHJldHVybiBnZXRXcm9uZygn6KGM56iL5pyq57uT5p2f77yM6K+35omL5Yqo5YWz6Zet5b2T5YmN6KGM56iLJyk7XG5cbiAgICAgICAgICAgIH0gZWxzZSBpZiAoIHRyaXAuY2FsbE1vbmV5VGltZXMgJiYgIHRyaXAuY2FsbE1vbmV5VGltZXMgPj0gMyApIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZ2V0V3JvbmcoYOW3sue7j+WPkei1t+i/hyR7dHJpcC5jYWxsTW9uZXlUaW1lc33mrKHlgqzmrL5gKTtcblxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyDmm7TmlrDorqLljZVcbiAgICAgICAgICAgIGF3YWl0IFByb21pc2UuYWxsKCBvcmRlcnMubWFwKCBvcmRlciA9PiB7XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgLy8g5pyJ5Zui6LSt5Lu344CB5aSn5LqOMuS6uui0reS5sO+8jOS4lOiiq+WIhumFjeaVsOWdh+Wkp+S6jjDvvIzor6XorqLljZXmiY3ovr7liLDigJzlm6LotK3igJ3nmoTmnaHku7ZcbiAgICAgICAgICAgICAgICBjb25zdCBjYW5Hcm91cCA9ICEhb3JkZXJzLmZpbmQoIG8gPT4ge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gby5vaWQgIT09IG9yZGVyLm9pZCAmJlxuICAgICAgICAgICAgICAgICAgICAgICAgby5vcGVuaWQgIT09IG9yZGVyLm9wZW5pZCAmJiBcbiAgICAgICAgICAgICAgICAgICAgICAgIG8ucGlkID09PSBvcmRlci5waWQgJiYgby5zaWQgPT09IG9yZGVyLnNpZCAmJlxuICAgICAgICAgICAgICAgICAgICAgICAgby5hbGxvY2F0ZWRDb3VudCA+IDAgJiYgb3JkZXIuYWxsb2NhdGVkQ291bnQgPiAwICYmXG4gICAgICAgICAgICAgICAgICAgICAgICAhIW8uYWxsb2NhdGVkR3JvdXBQcmljZVxuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgaWYgKCBjYW5Hcm91cCApIHtcbiAgICAgICAgICAgICAgICAgICAgY2FuR3JvdXBVc2VyTWFwQ291bnQgPSBPYmplY3QuYXNzaWduKHsgfSwgY2FuR3JvdXBVc2VyTWFwQ291bnQsIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIFsgb3JkZXIub3BlbmlkIF06IGNhbkdyb3VwVXNlck1hcENvdW50WyBvcmRlci5vcGVuaWQgXSA9PT0gdW5kZWZpbmVkID8gMSA6IGNhbkdyb3VwVXNlck1hcENvdW50WyBvcmRlci5vcGVuaWQgXSArIDFcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgcmV0dXJuIGRiLmNvbGxlY3Rpb24oJ29yZGVyJylcbiAgICAgICAgICAgICAgICAgICAgLmRvYyggb3JkZXIub2lkIClcbiAgICAgICAgICAgICAgICAgICAgLnVwZGF0ZSh7XG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FuR3JvdXAsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYmFzZV9zdGF0dXM6ICcyJ1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgfSkpO1xuXG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqICHmm7TmlrDotK3nianmuIXljZVcbiAgICAgICAgICAgICAqL1xuXG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIOa2iOaBr+aOqOmAgVxuICAgICAgICAgICAgICogIeacquS7mOWFqOasvuaJjeWPkemAgVxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICBjb25zdCB1c2VycyA9IEFycmF5LmZyb20oXG4gICAgICAgICAgICAgICAgbmV3IFNldChcbiAgICAgICAgICAgICAgICAgICAgb3JkZXJzXG4gICAgICAgICAgICAgICAgICAgICAgICAubWFwKCBvcmRlciA9PiBvcmRlci5vcGVuaWQgKVxuICAgICAgICAgICAgICAgICAgICAgICAgLmZpbHRlciggb3BlbmlkID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gISFvcmRlcnMuZmluZCggb3JkZXIgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gb3JkZXIub3BlbmlkID09PSBvcGVuaWQgJiYgU3RyaW5nKCBvcmRlci5wYXlfc3RhdHVzICkgPT09ICcxJ1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICApO1xuXG4gICAgICAgICAgICAvKiog5o6o6YCB6YCa55+lICovXG4gICAgICAgICAgICBjb25zdCBycyA9IGF3YWl0IFByb21pc2UuYWxsKCB1c2Vycy5tYXAoIG9wZW5pZCA9PiB7XG5cbiAgICAgICAgICAgICAgICBjb25zdCB0YXJnZXQgPSBvcmRlcnMuZmluZCggb3JkZXIgPT4gb3JkZXIub3BlbmlkID09PSBvcGVuaWQgJiZcbiAgICAgICAgICAgICAgICAgICAgKCEhb3JkZXIucHJlcGF5X2lkIHx8ICEhb3JkZXIuZm9ybV9pZCApKTtcblxuICAgICAgICAgICAgICAgIHJldHVybiBjbG91ZC5jYWxsRnVuY3Rpb24oe1xuICAgICAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdG91c2VyOiBvcGVuaWQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aXRsZTogY2FuR3JvdXBVc2VyTWFwQ291bnRbIFN0cmluZyggb3BlbmlkICldID9cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGDmi7zlm6IkeyBjYW5Hcm91cFVzZXJNYXBDb3VudFsgU3RyaW5nKCBvcGVuaWQgKV195Lu277yB5oKo6LSt5Lmw55qE5ZWG5ZOB5bey5Yiw6LSnYCA6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAn5oKo6LSt5Lmw55qE5ZWG5ZOB5bey5Yiw6LSnJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGltZTogYFvooYznqItdJHt0cmlwLnRpdGxlfWBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvcm1faWQ6IHRhcmdldC5wcmVwYXlfaWQgfHwgdGFyZ2V0LmZvcm1faWRcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAkdXJsOiAnbm90aWZpY2F0aW9uLWdldG1vbmV5J1xuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICBuYW1lOiAnY29tbW9uJ1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICB9KSk7XG4gXG4gICAgICAgICAgICAvLyDmm7TmlrDooYznqItcbiAgICAgICAgICAgIGF3YWl0IGRiLmNvbGxlY3Rpb24oJ3RyaXAnKVxuICAgICAgICAgICAgICAgIC5kb2MoIHRpZCApXG4gICAgICAgICAgICAgICAgLnVwZGF0ZSh7XG4gICAgICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhbGxNb25leVRpbWVzOiBfLmluYyggMSApXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgcmV0dXJuIGN0eC5ib2R5ID0ge1xuICAgICAgICAgICAgICAgIHN0YXR1czogMjAwLFxuICAgICAgICAgICAgICAgIC8vIOWJqeS9measoeaVsFxuICAgICAgICAgICAgICAgIGRhdGE6IDMgLSAoIDEgKyB0cmlwLmNhbGxNb25leVRpbWVzIClcbiAgICAgICAgICAgIH1cblxuICAgICAgICB9IGNhdGNoICggZSApIHtcbiAgICAgICAgICAgIHJldHVybiBjdHguYm9keSA9IHsgc3RhdHVzOiA1MDAgfTtcbiAgICAgICAgfVxuICAgIH0pXG5cbiAgICAvKiogXG4gICAgICogQGRlc2NyaXB0aW9uXG4gICAgICog6K6i5Y2V5LuY5bC+5qy+XG4gICAgICoge1xuICAgICAqICAgICAgdGlkIC8vIOmihuS7o+mHkeWIuFxuICAgICAqICAgICAgaW50ZWdyYWwgLy8g56ev5YiG5oC76aKd77yIdXNlcuihqO+8iVxuICAgICAqICAgICAgb3JkZXJzOiBbeyAgXG4gICAgICogICAgICAgICAgb2lkIC8vIOiuouWNleeKtuaAgVxuICAgICAqICAgICAgICAgIHBpZFxuICAgICAqICAgICAgICAgIGZpbmFsX3ByaWNlIC8vIOacgOe7iOaIkOS6pOminVxuICAgICAqICAgICAgICAgIGFsbG9jYXRlZENvdW50IC8vIOacgOe7iOaIkOS6pOmHj1xuICAgICAqICAgICAgfV1cbiAgICAgKiAgICAgIGNvdXBvbnM6IFsgLy8g5Y2h5Yi45raI6LS5XG4gICAgICogICAgICAgICAgaWQxLFxuICAgICAqICAgICAgICAgIGlkMi4uLlxuICAgICAqICAgICAgXVxuICAgICAqIH1cbiAgICAgKi9cbiAgICBhcHAucm91dGVyKCdwYXktbGFzdCcsIGFzeW5jKCBjdHgsIG5leHQgKSA9PiB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBjb25zdCBvcGVuaWQgPSBldmVudC51c2VySW5mby5vcGVuSWQ7XG4gICAgICAgICAgICBjb25zdCB7IHRpZCwgaW50ZWdyYWwsIG9yZGVycywgY291cG9ucyB9ID0gZXZlbnQuZGF0YTtcblxuICAgICAgICAgICAgY29uc3QgdXNlciQgPSBhd2FpdCBkYi5jb2xsZWN0aW9uKCd1c2VyJylcbiAgICAgICAgICAgICAgICAud2hlcmUoe1xuICAgICAgICAgICAgICAgICAgICBvcGVuaWRcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIC5nZXQoICk7XG5cbiAgICAgICAgICAgIC8vIOWinuWKoOenr+WIhuaAu+minVxuICAgICAgICAgICAgYXdhaXQgZGIuY29sbGVjdGlvbigndXNlcicpXG4gICAgICAgICAgICAgICAgLmRvYyggU3RyaW5nKCB1c2VyJC5kYXRhWyAwIF0uX2lkICkpXG4gICAgICAgICAgICAgICAgLnVwZGF0ZSh7XG4gICAgICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGludGVncmFsOiBfLmluYyggaW50ZWdyYWwgKVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIC8vIOabtOaWsOiuouWNleeKtuaAgeOAgeWVhuWTgemUgOmHj1xuICAgICAgICAgICAgYXdhaXQgUHJvbWlzZS5hbGwoIG9yZGVycy5tYXAoIG9yZGVyID0+IHtcbiAgICAgICAgICAgICAgICByZXR1cm4gUHJvbWlzZS5hbGwoW1xuICAgICAgICAgICAgICAgICAgICBkYi5jb2xsZWN0aW9uKCdvcmRlcicpXG4gICAgICAgICAgICAgICAgICAgICAgICAuZG9jKCBvcmRlci5vaWQgKVxuICAgICAgICAgICAgICAgICAgICAgICAgLnVwZGF0ZSh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBiYXNlX3N0YXR1czogJzMnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXlfc3RhdHVzOiAnMicsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZpbmFsX3ByaWNlOiBvcmRlci5maW5hbF9wcmljZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9KSxcbiAgICAgICAgICAgICAgICAgICAgZGIuY29sbGVjdGlvbignZ29vZHMnKVxuICAgICAgICAgICAgICAgICAgICAgICAgLmRvYyggb3JkZXIucGlkIClcbiAgICAgICAgICAgICAgICAgICAgICAgIC51cGRhdGUoe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2FsZWQ6IF8uaW5jKCBvcmRlci5hbGxvY2F0ZWRDb3VudCApXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICBdKVxuICAgICAgICAgICAgfSkpO1xuXG4gICAgICAgICAgICAvLyDmm7TmlrDljaHliLjkvb/nlKjnirbmgIFcbiAgICAgICAgICAgIGF3YWl0IFByb21pc2UuYWxsKCBjb3Vwb25zLm1hcCggY291cG9uaWQgPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiBkYi5jb2xsZWN0aW9uKCdjb3Vwb24nKVxuICAgICAgICAgICAgICAgICAgICAuZG9jKCBjb3Vwb25pZCApXG4gICAgICAgICAgICAgICAgICAgIC51cGRhdGUoe1xuICAgICAgICAgICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlzVXNlZDogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB1c2VkQnk6IHRpZCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYW5Vc2VJbk5leHQ6IGZhbHNlXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICB9KSk7XG5cbiAgICAgICAgICAgIC8vIOi+vuWIsOadoeS7tu+8jOWImemihuWPluS7o+mHkeWIuFxuICAgICAgICAgICAgLy8g5ZCM5pe25Yig6Zmk5LiK5LiA5Liq5pyq5L2/55So6L+H55qE5Luj6YeR5Yi4XG4gICAgICAgICAgICBjb25zdCB0cmlwJCA9IGF3YWl0IGRiLmNvbGxlY3Rpb24oJ3RyaXAnKVxuICAgICAgICAgICAgICAgIC5kb2MoIHRpZCApXG4gICAgICAgICAgICAgICAgLmdldCggKTtcblxuICAgICAgICAgICAgbGV0IHJlcSA9IHtcbiAgICAgICAgICAgICAgICByZXN1bHQ6IHtcbiAgICAgICAgICAgICAgICAgICAgc3RhdHVzOiA1MDBcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGNvbnN0IHsgY2FzaGNvdXBvbl9hdGxlYXN0LCBjYXNoY291cG9uX3ZhbHVlcyB9ID0gdHJpcCQuZGF0YTtcblxuICAgICAgICAgICAgY29uc3QgdGVtcCA9IHtcbiAgICAgICAgICAgICAgICBvcGVuSWQ6IG9wZW5pZCxcbiAgICAgICAgICAgICAgICBmcm9tdGlkOiB0aWQsXG4gICAgICAgICAgICAgICAgdHlwZTogJ3RfZGFpamluJyxcbiAgICAgICAgICAgICAgICB0aXRsZTogJ+ihjOeoi+S7o+mHkeWIuCcsXG4gICAgICAgICAgICAgICAgY2FuVXNlSW5OZXh0OiB0cnVlLFxuICAgICAgICAgICAgICAgIGlzVXNlZDogZmFsc2UsXG4gICAgICAgICAgICAgICAgYXRsZWFzdDogY2FzaGNvdXBvbl9hdGxlYXN0IHx8IDAsXG4gICAgICAgICAgICAgICAgdmFsdWU6IGNhc2hjb3Vwb25fdmFsdWVzXG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAvLyDml6DpnIDpl6jmp5vvvIzmnInku6Pph5HliLjljbPlj6/pooblj5ZcbiAgICAgICAgICAgIGlmICggISFjYXNoY291cG9uX3ZhbHVlcyApIHtcblxuICAgICAgICAgICAgICAgIC8vIOWIoOmZpOS4iuS4gOS4quacquS9v+eUqOeahOS7o+mHkeWIuFxuICAgICAgICAgICAgICAgIGNvbnN0IGxhc3REYWlqaW4kID0gYXdhaXQgZGIuY29sbGVjdGlvbignY291cG9uJylcbiAgICAgICAgICAgICAgICAgICAgLndoZXJlKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6ICd0X2RhaWppbicsXG4gICAgICAgICAgICAgICAgICAgICAgICBpc1VzZWQ6IGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICAgICAgY2FuVXNlSW5OZXh0OiB0cnVlXG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgIC5nZXQoICk7XG5cbiAgICAgICAgICAgICAgICBpZiAoIGxhc3REYWlqaW4kLmRhdGFbIDAgXSkge1xuICAgICAgICAgICAgICAgICAgICBhd2FpdCBkYi5jb2xsZWN0aW9uKCdjb3Vwb24nKVxuICAgICAgICAgICAgICAgICAgICAgICAgLmRvYyggU3RyaW5nKCBsYXN0RGFpamluJC5kYXRhWyAwIF0uX2lkICkpXG4gICAgICAgICAgICAgICAgICAgICAgICAucmVtb3ZlKCApO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIC8vIOmihuWPluS7o+mHkeWIuFxuICAgICAgICAgICAgICAgIHJlcSA9IGF3YWl0IGNsb3VkLmNhbGxGdW5jdGlvbih7XG4gICAgICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRhdGE6IHRlbXAsXG4gICAgICAgICAgICAgICAgICAgICAgICAkdXJsOiAnY3JlYXRlJ1xuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICBuYW1lOiAnY291cG9uJ1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gY3R4LmJvZHkgPSB7XG4gICAgICAgICAgICAgICAgc3RhdHVzOiAyMDAsXG4gICAgICAgICAgICAgICAgZGF0YTogcmVxLnJlc3VsdC5zdGF0dXMgPT09IDIwMCA/IHRlbXAgOiBudWxsIFxuICAgICAgICAgICAgfVxuXG4gICAgICAgIH0gY2F0Y2ggKCBlICkge1xuICAgICAgICAgICAgcmV0dXJuIGN0eC5ib2R5ID0geyBzdGF0dXM6IDUwMCB9XG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgIC8qKiBcbiAgICAgKiBAZGVzY3JpcHRpb25cbiAgICAgKiDku6PotK3ojrflj5bmnKror7vorqLljZVcbiAgICAgKi9cbiAgICBhcHAucm91dGVyKCd1bnJlYWQnLCBhc3luYyggY3R4LCBuZXh0ICkgPT4ge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgY29uc3QgeyB0aWQsIGxhc3RUaW1lIH0gPSBldmVudC5kYXRhO1xuICAgICAgICAgICAgbGV0IHdoZXJlJCA9IHtcbiAgICAgICAgICAgICAgICB0aWRcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIGlmICggbGFzdFRpbWUgKSB7XG4gICAgICAgICAgICAgICAgd2hlcmUkID0gT2JqZWN0LmFzc2lnbih7IH0sIHdoZXJlJCwge1xuICAgICAgICAgICAgICAgICAgICBjcmVhdGV0aW1lOiBfLmd0ZSggbGFzdFRpbWUgKVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBjb25zdCBkYXRhJCA9IGF3YWl0IGRiLmNvbGxlY3Rpb24oJ29yZGVyJylcbiAgICAgICAgICAgICAgICAud2hlcmUoIHdoZXJlJCApXG4gICAgICAgICAgICAgICAgLmNvdW50KCApO1xuXG4gICAgICAgICAgICByZXR1cm4gY3R4LmJvZHkgPSB7XG4gICAgICAgICAgICAgICAgc3RhdHVzOiAyMDAsXG4gICAgICAgICAgICAgICAgZGF0YTogZGF0YSQudG90YWxcbiAgICAgICAgICAgIH1cblxuICAgICAgICB9IGNhdGNoICggZSApIHsgcmV0dXJuIGN0eC5ib2R5ID0geyBzdGF0dXM6IDUwMCB9O31cbiAgICB9KTtcblxuICAgIC8qKiBcbiAgICAgKiBAZGVzY3JpcHRpb25cbiAgICAgKiDku6PotK3mn6XnnIvmiYDmnInnmoTorqLljZXliJfooahcbiAgICAgKi9cbiAgICBhcHAucm91dGVyKCdsaXN0LWFsbCcsIGFzeW5jKCBjdHgsIG5leHQgKSA9PiB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICAvLyDmn6Xor6LmnaHmlbBcbiAgICAgICAgICAgIGNvbnN0IGxpbWl0ID0gMTA7XG4gICAgICAgICAgICBjb25zdCB7IHRpZCwgcGFnZSB9ID0gZXZlbnQuZGF0YTtcblxuICAgICAgICAgICAgY29uc3Qgd2hlcmUkID0ge1xuICAgICAgICAgICAgICAgIHRpZCxcbiAgICAgICAgICAgICAgICBwYXlfc3RhdHVzOiBfLm5lcSgnMCcpXG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICBjb25zdCB0b3RhbCQgPSBhd2FpdCBkYi5jb2xsZWN0aW9uKCdvcmRlcicpXG4gICAgICAgICAgICAgICAgLndoZXJlKCB3aGVyZSQgKVxuICAgICAgICAgICAgICAgIC5jb3VudCggKTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgY29uc3Qgb3JkZXJzJCA9IGF3YWl0IGRiLmNvbGxlY3Rpb24oJ29yZGVyJylcbiAgICAgICAgICAgICAgICAud2hlcmUoIHdoZXJlJCApXG4gICAgICAgICAgICAgICAgLmxpbWl0KCBsaW1pdCApXG4gICAgICAgICAgICAgICAgLnNraXAoKCBwYWdlIC0gMSApICogbGltaXQgKVxuICAgICAgICAgICAgICAgIC5vcmRlckJ5KCdjcmVhdGVUaW1lJywgJ2Rlc2MnKVxuICAgICAgICAgICAgICAgIC5nZXQoICk7XG5cbiAgICAgICAgICAgIGNvbnN0IHBpZHMgPSBBcnJheS5mcm9tKFxuICAgICAgICAgICAgICAgIG5ldyBTZXQoIFxuICAgICAgICAgICAgICAgICAgICBvcmRlcnMkLmRhdGFcbiAgICAgICAgICAgICAgICAgICAgICAgIC5tYXAoIHggPT4geC5waWQgKVxuICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICk7XG5cbiAgICAgICAgICAgIGNvbnN0IHNpZHMgPSBBcnJheS5mcm9tKFxuICAgICAgICAgICAgICAgIG5ldyBTZXQoIFxuICAgICAgICAgICAgICAgICAgICBvcmRlcnMkLmRhdGFcbiAgICAgICAgICAgICAgICAgICAgICAgIC5tYXAoIHggPT4geC5zaWQgKVxuICAgICAgICAgICAgICAgICAgICAgICAgLmZpbHRlciggeCA9PiAhIXggKVxuICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICk7XG5cbiAgICAgICAgICAgIGNvbnN0IHVpZHMgPSBBcnJheS5mcm9tKFxuICAgICAgICAgICAgICAgIG5ldyBTZXQoIFxuICAgICAgICAgICAgICAgICAgICBvcmRlcnMkLmRhdGFcbiAgICAgICAgICAgICAgICAgICAgICAgIC5tYXAoIHggPT4geC5vcGVuaWQgKVxuICAgICAgICAgICAgICAgICAgICAgICAgLmZpbHRlciggeCA9PiAhIXggKVxuICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICk7XG5cbiAgICAgICAgICAgIC8vIGNvbnN0IGdvb2RzJCQgPSBhd2FpdCBQcm9taXNlLmFsbChcbiAgICAgICAgICAgIC8vICAgICBwaWRzLm1hcCggXG4gICAgICAgICAgICAvLyAgICAgICAgIHBpZCA9PiBkYi5jb2xsZWN0aW9uKCdnb29kcycpXG4gICAgICAgICAgICAvLyAgICAgICAgICAgICAuZG9jKCBTdHJpbmcoIHBpZCApKVxuICAgICAgICAgICAgLy8gICAgICAgICAgICAgLmdldCggKVxuICAgICAgICAgICAgLy8gICAgIClcbiAgICAgICAgICAgIC8vICk7XG4gICAgICAgICAgICAvLyBjb25zdCBnb29kcyQgPSBnb29kcyQkLm1hcCggeCA9PiB4LmRhdGEgKTtcblxuICAgICAgICAgICAgLy8gY29uc3Qgc3RhbmRhcnMkJCA9IGF3YWl0IFByb21pc2UuYWxsKFxuICAgICAgICAgICAgLy8gICAgIHNpZHMubWFwKCBcbiAgICAgICAgICAgIC8vICAgICAgICAgc2lkID0+IGRiLmNvbGxlY3Rpb24oJ3N0YW5kYXJkcycpXG4gICAgICAgICAgICAvLyAgICAgICAgICAgICAuZG9jKCBTdHJpbmcoIHNpZCApKVxuICAgICAgICAgICAgLy8gICAgICAgICAgICAgLmZpZWxkKHtcbiAgICAgICAgICAgIC8vICAgICAgICAgICAgICAgICBwaWQ6IHRydWUsXG4gICAgICAgICAgICAvLyAgICAgICAgICAgICAgICAgbmFtZTogdHJ1ZVxuICAgICAgICAgICAgLy8gICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC8vICAgICAgICAgICAgIC5nZXQoIClcbiAgICAgICAgICAgIC8vICAgICApXG4gICAgICAgICAgICAvLyApO1xuICAgICAgICAgICAgLy8gY29uc3Qgc3RhbmRhcnMkID0gc3RhbmRhcnMkJC5tYXAoIHggPT4geC5kYXRhICk7XG5cbiAgICAgICAgICAgIGNvbnN0IHVzZXJzJCQgPSBhd2FpdCBQcm9taXNlLmFsbChcbiAgICAgICAgICAgICAgICB1aWRzLm1hcCggXG4gICAgICAgICAgICAgICAgICAgIG9wZW5pZCA9PiBkYi5jb2xsZWN0aW9uKCd1c2VyJylcbiAgICAgICAgICAgICAgICAgICAgICAgIC53aGVyZSh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb3BlbmlkXG4gICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAgICAgLmZpZWxkKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvcGVuaWQ6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYXZhdGFyVXJsOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5pY2tOYW1lOiB0cnVlXG4gICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAgICAgLmdldCggKVxuICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICBjb25zdCB1c2VycyQgPSB1c2VycyQkLm1hcCggeCA9PiB4LmRhdGFbIDAgXSk7XG5cbiAgICAgICAgICAgIGNvbnN0IG1ldGEgPSBvcmRlcnMkLmRhdGEubWFwKCBvcmRlciA9PiB7XG5cbiAgICAgICAgICAgICAgICBjb25zdCB1c2VyID0gdXNlcnMkLmZpbmQoIHVzZXIgPT4gdXNlci5vcGVuaWQgPT09IG9yZGVyLm9wZW5pZCApO1xuICAgICAgICAgICAgICAgIC8vIGNvbnN0IGRldGFpbCA9IGdvb2RzJC5maW5kKCBnb29kID0+IGdvb2QuX2lkID09PSBvcmRlci5waWQgKTtcbiAgICAgICAgICAgICAgICAvLyBjb25zdCBzdGFuZGFyID0gc3RhbmRhcnMkLmZpbmQoIHMgPT4gcy5faWQgPT09IG9yZGVyLnNpZCApO1xuXG4gICAgICAgICAgICAgICAgcmV0dXJuIE9iamVjdC5hc3NpZ24oeyB9LCBvcmRlciwge1xuICAgICAgICAgICAgICAgICAgICB1c2VyLFxuICAgICAgICAgICAgICAgICAgICAvLyBkZXRhaWwsXG4gICAgICAgICAgICAgICAgICAgIC8vIHN0YW5kYXJcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHJldHVybiBjdHguYm9keSA9IHtcbiAgICAgICAgICAgICAgICBzdGF0dXM6IDIwMCxcbiAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICAgIHBhZ2UsXG4gICAgICAgICAgICAgICAgICAgIHBhZ2VTaXplOiBsaW1pdCxcbiAgICAgICAgICAgICAgICAgICAgZGF0YTogbWV0YSxcbiAgICAgICAgICAgICAgICAgICAgdG90YWw6IHRvdGFsJC50b3RhbCxcbiAgICAgICAgICAgICAgICAgICAgdG90YWxQYWdlOiBNYXRoLmNlaWwoIHRvdGFsJC50b3RhbCAvIGxpbWl0IClcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cblxuICAgICAgICB9IGNhdGNoICggZSApIHsgXG4gICAgICAgICAgICBjb25zb2xlLmxvZygnPz8/JywgZSApXG4gICAgICAgICAgICByZXR1cm4gY3R4LmJvZHkgPSB7IHN0YXR1czogNTAwIH1cbiAgICAgICAgfVxuICAgIH0pXG4gXG4gICByZXR1cm4gYXBwLnNlcnZlKCApO1xuXG59Il19