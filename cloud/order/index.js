"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
var getNow = function (ts) {
    if (ts === void 0) { ts = false; }
    if (ts) {
        return Date.now();
    }
    var time_0 = new Date(new Date().toLocaleString());
    return new Date(time_0.getTime() + 8 * 60 * 60 * 1000);
};
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
                            || (!!trips$.data && getNow(true) >= trips$.data.end_date)) {
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
                                createTime: getNow(true),
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
            var openId_1, _a, orderIds, prepay_id_1, form_id_1, find$, list_1, create$_1, _b, buyer, others, pushMe$, othersOrders$_1, othersMore, othersPush_1, appConf$, appConf, pushers$, pushers_1, e_3;
            var _this = this;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _c.trys.push([0, 12, , 13]);
                        openId_1 = event.userInfo.openId;
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
                        _c.sent();
                        return [4, Promise.all(orderIds.split(',').map(function (oid) {
                                return db.collection('order')
                                    .where({
                                    _id: oid
                                })
                                    .get();
                            }))];
                    case 2:
                        find$ = _c.sent();
                        list_1 = find$.map(function (x) {
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
                                        list: list_1,
                                        openId: openId_1
                                    }
                                }
                            })];
                    case 3:
                        create$_1 = _c.sent();
                        if (!(create$_1.result.status === 200)) return [3, 7];
                        _b = create$_1.result.data, buyer = _b.buyer, others = _b.others;
                        return [4, cloud.callFunction({
                                name: 'common',
                                data: {
                                    $url: 'push-template',
                                    data: {
                                        type: buyer.type,
                                        openid: buyer.openid,
                                        texts: getTextByPushType(buyer.type === 'buyPin' ? 'buyPin1' : buyer.type, buyer.delta)
                                    }
                                }
                            })];
                    case 4:
                        pushMe$ = _c.sent();
                        return [4, Promise.all(others.map(function (other) { return db.collection('order')
                                .where({
                                openid: other.openid,
                                acid: other.acid,
                                sid: other.sid,
                                pid: other.pid,
                                tid: other.tid,
                                pay_status: '1',
                                base_status: _.or(_.eq('0'), _.eq('1'), _.eq('2'))
                            })
                                .field({
                                count: true
                            })
                                .get(); }))];
                    case 5:
                        othersOrders$_1 = _c.sent();
                        othersMore = others.map(function (other, key) {
                            return __assign({}, other, { count: othersOrders$_1[key].data.reduce(function (x, y) { return y.count + x; }, 0) });
                        });
                        othersPush_1 = {};
                        othersMore.map(function (other) {
                            var _a, _b;
                            if (!othersPush_1[other.openid]) {
                                othersPush_1 = Object.assign({}, othersPush_1, (_a = {},
                                    _a[other.openid] = other.delta * other.count,
                                    _a));
                            }
                            else {
                                othersPush_1 = Object.assign({}, othersPush_1, (_b = {},
                                    _b[other.openid] = othersPush_1[other.openid] + other.delta * other.count,
                                    _b));
                            }
                        });
                        return [4, Promise.all(Object.keys(othersPush_1).map(function (otherOpenid) { return cloud.callFunction({
                                name: 'common',
                                data: {
                                    $url: 'push-template',
                                    data: {
                                        type: 'buyPin',
                                        openid: otherOpenid,
                                        texts: getTextByPushType('buyPin2', othersPush_1[otherOpenid])
                                    }
                                }
                            }); }))];
                    case 6:
                        _c.sent();
                        _c.label = 7;
                    case 7: return [4, db.collection('app-config')
                            .where({
                            type: 'good-integral-share'
                        })
                            .get()];
                    case 8:
                        appConf$ = _c.sent();
                        appConf = appConf$.data[0];
                        if (!appConf.value) return [3, 11];
                        return [4, Promise.all(list_1.map(function (x, k) { return __awaiter(_this, void 0, void 0, function () {
                                var pushRecord$;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4, db.collection('share-record')
                                                .where({
                                                pid: x.pid,
                                                openid: openId_1,
                                                isSuccess: false
                                            })
                                                .get()];
                                        case 1:
                                            pushRecord$ = _a.sent();
                                            return [2, __assign({}, pushRecord$.data[0], { price: list_1[k].price, pushId: pushRecord$.data[0] ? pushRecord$.data[0]._id : '' })];
                                    }
                                });
                            }); }))];
                    case 9:
                        pushers$ = _c.sent();
                        pushers_1 = [];
                        pushers$
                            .filter(function (x) { return !!x.from; })
                            .map(function (x) {
                            var index = pushers_1.findIndex(function (y) { return y.from === x.from; });
                            if (index !== -1) {
                                var origin = pushers_1[index];
                                pushers_1.splice(index, 1, __assign({}, origin, { price: Number((x.price + origin.price).toFixed(2)) }));
                            }
                            else {
                                pushers_1.push({
                                    from: x.from,
                                    price: x.price,
                                    pushId: x.pushId
                                });
                            }
                        });
                        return [4, Promise.all(pushers_1.map(function (pusher) { return __awaiter(_this, void 0, void 0, function () {
                                var integralRate, integral, user$, user, userid, push$;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            integralRate = 0.05;
                                            integral = Number((pusher.price * integralRate).toFixed(1));
                                            return [4, db.collection('user')
                                                    .where({
                                                    openid: pusher.from
                                                })
                                                    .get()];
                                        case 1:
                                            user$ = _a.sent();
                                            user = user$.data[0];
                                            userid = user._id;
                                            delete user['_id'];
                                            return [4, db.collection('user')
                                                    .doc(String(userid))
                                                    .set({
                                                    data: __assign({}, user, { push_integral: user.push_integral ?
                                                            Number((user.push_integral + integral).toFixed(1)) :
                                                            integral })
                                                })];
                                        case 2:
                                            _a.sent();
                                            return [4, cloud.callFunction({
                                                    name: 'common',
                                                    data: {
                                                        $url: 'push-template',
                                                        data: {
                                                            type: 'hongbao',
                                                            openid: pusher.from,
                                                            page: 'pages/trip-enter/index',
                                                            texts: ["\u606D\u559C\uFF01\u83B7\u5F97" + integral + "\u5143\u62B5\u6263\u73B0\u91D1", "\u63A8\u5E7F\u6210\u529F\uFF01\u6709\u4EBA\u8D2D\u4E70\u4E86\u4F60\u5206\u4EAB\u7684\u5546\u54C1"]
                                                        }
                                                    }
                                                })];
                                        case 3:
                                            push$ = _a.sent();
                                            return [4, db.collection('share-record')
                                                    .doc(pusher.pushId)
                                                    .update({
                                                    data: {
                                                        isSuccess: true,
                                                        successTime: getNow(true)
                                                    }
                                                })];
                                        case 4:
                                            _a.sent();
                                            return [2];
                                    }
                                });
                            }); }))];
                    case 10:
                        _c.sent();
                        _c.label = 11;
                    case 11: return [2, ctx.body = {
                            status: 200
                        }];
                    case 12:
                        e_3 = _c.sent();
                        console.log(e_3);
                        return [2, ctx.body = { status: 500 }];
                    case 13: return [2];
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
            var canGroupUserMapCount_1, _a, tid, orders_1, notification, getWrong, trip$, trip, users, rs, e_6;
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
                        trip = trip$.data;
                        if (getNow(true) < trip.end_date && !trip.isClosed) {
                            return [2, getWrong('行程未结束，请手动关闭当前行程')];
                        }
                        else if (trip.callMoneyTimes && trip.callMoneyTimes >= 3) {
                            return [2, getWrong("\u5DF2\u7ECF\u53D1\u8D77\u8FC7" + trip.callMoneyTimes + "\u6B21\u50AC\u6B3E")];
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
                                            openid: openid,
                                            type: 'getMoney',
                                            prepay_id: target.prepay_id,
                                            texts: ['支付尾款，立即发货哦', '越快越好']
                                        },
                                        $url: 'push-template'
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
                                            paytime: getNow(true)
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
function getTextByPushType(type, delta) {
    var now = getNow();
    var month = now.getMonth() + 1;
    var date = now.getDate();
    var hour = now.getHours();
    var minutes = now.getMinutes();
    var fixZero = function (s) { return String(s).length === 1 ? "0" + s : s; };
    if (type === 'buy') {
        return [
            "\u4E0B\u5355\u6210\u529F\uFF01\u4F1A\u5C3D\u5FEB\u91C7\u8D2D\uFF5E",
            month + "\u6708" + date + "\u65E5 " + hour + ":" + fixZero(minutes)
        ];
    }
    else if (type === 'buyPin1') {
        return [
            "\u606D\u559C\u60A8\u7701\u4E86" + delta + "\u5143\uFF01",
            "\u60A8\u548C\u5176\u4ED6\u4EBA\u4E70\u4E86\u540C\u6B3E\u62FC\u56E2\u5546\u54C1\uFF0C\u67E5\u770B"
        ];
    }
    else if (type === 'buyPin2') {
        return [
            "\u606D\u559C\uFF01\u60A8\u4E70\u7684\u5546\u54C1\u51CF\u4E86" + delta + "\u5143!",
            "\u6709\u4EBA\u8D2D\u4E70\u4E86\u540C\u6B3E\u62FC\u56E2\u7684\u5546\u54C1\uFF0C\u67E5\u770B"
        ];
    }
    else if (type === 'waitPin') {
        return [
            "\u60A8\u7684\u5546\u54C1\u53EF\u53C2\u52A0\u62FC\u56E2\uFF01",
            "\u53C2\u52A0\u62FC\u56E2\uFF0C\u53EF\u4EE5\u518D\u7701" + delta + "\u5143\uFF01"
        ];
    }
    else if (type === 'getMoney') {
        return [
            "\u652F\u4ED8\u5C3E\u6B3E\uFF0C\u7ACB\u5373\u53D1\u8D27\u54E6",
            "\u8D8A\u5FEB\u8D8A\u597D"
        ];
    }
    return [];
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUNBLGlCQW8yQ0M7O0FBcDJDRCxxQ0FBdUM7QUFDdkMsc0NBQXdDO0FBQ3hDLG1DQUFtQztBQUVuQyxLQUFLLENBQUMsSUFBSSxDQUFDO0lBQ1AsR0FBRyxFQUFFLE9BQU8sQ0FBQyxHQUFHLENBQUMsS0FBSztDQUN6QixDQUFDLENBQUM7QUFFSCxJQUFNLEVBQUUsR0FBZ0IsS0FBSyxDQUFDLFFBQVEsRUFBRyxDQUFDO0FBQzFDLElBQU0sQ0FBQyxHQUFHLEVBQUUsQ0FBQyxPQUFPLENBQUM7QUFRckIsSUFBTSxNQUFNLEdBQUcsVUFBRSxFQUFVO0lBQVYsbUJBQUEsRUFBQSxVQUFVO0lBQ3ZCLElBQUssRUFBRSxFQUFHO1FBQ04sT0FBTyxJQUFJLENBQUMsR0FBRyxFQUFHLENBQUM7S0FDdEI7SUFDRCxJQUFNLE1BQU0sR0FBRyxJQUFJLElBQUksQ0FBRSxJQUFJLElBQUksRUFBRyxDQUFDLGNBQWMsRUFBRyxDQUFDLENBQUM7SUFDeEQsT0FBTyxJQUFJLElBQUksQ0FBRSxNQUFNLENBQUMsT0FBTyxFQUFHLEdBQUcsQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsSUFBSSxDQUFFLENBQUE7QUFDN0QsQ0FBQyxDQUFBO0FBb0NZLFFBQUEsSUFBSSxHQUFHLFVBQVEsS0FBSyxFQUFFLE9BQU87Ozs7UUFFaEMsR0FBRyxHQUFHLElBQUksU0FBUyxDQUFDLEVBQUUsS0FBSyxPQUFBLEVBQUUsQ0FBQyxDQUFDO1FBaUNyQyxHQUFHLENBQUMsTUFBTSxDQUFDLFFBQVEsRUFBRSxVQUFPLEdBQUcsRUFBRSxJQUFJOzs7Ozs7d0JBR3ZCLEtBQXdCLEtBQUssQ0FBQyxJQUFJLEVBQWhDLEdBQUcsU0FBQSxFQUFFLElBQUksVUFBQSxFQUFFLE1BQU0s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QUFNLE9BQU8sR0FBRyxVQUFBLENBQUMsSUFBSSxPQUFBLE1BQU0sQ0FBRSxDQUFDLENBQUUsQ0FBQyxNQUFNLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFJLENBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUF0QyxDQUFzQyxDQUFDO0lBRTVELElBQUssSUFBSSxLQUFLLEtBQUssRUFBRztRQUNsQixPQUFPO1lBQ0gsb0VBQWE7WUFDVixLQUFLLGNBQUksSUFBSSxlQUFLLElBQUksU0FBSSxPQUFPLENBQUUsT0FBTyxDQUFJO1NBQ3BELENBQUM7S0FDTDtTQUFNLElBQUssSUFBSSxLQUFLLFNBQVMsRUFBRztRQUM3QixPQUFPO1lBQ0gsbUNBQVEsS0FBSyxpQkFBSTtZQUNqQixrR0FBa0I7U0FDckIsQ0FBQTtLQUNKO1NBQU0sSUFBSyxJQUFJLEtBQUssU0FBUyxFQUFHO1FBQzdCLE9BQU87WUFDSCxpRUFBYSxLQUFLLFlBQUk7WUFDdEIsNEZBQWlCO1NBQ3BCLENBQUE7S0FDSjtTQUFNLElBQUssSUFBSSxLQUFLLFNBQVMsRUFBRztRQUM3QixPQUFPO1lBQ0gsOERBQVk7WUFDWiwyREFBWSxLQUFLLGlCQUFJO1NBQ3hCLENBQUE7S0FDSjtTQUFNLElBQUssSUFBSSxLQUFLLFVBQVUsRUFBRztRQUM5QixPQUFPO1lBQ0gsOERBQVk7WUFDWiwwQkFBTTtTQUNULENBQUE7S0FDSjtJQUNELE9BQU8sRUFBRSxDQUFBO0FBQ2IsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIlxuaW1wb3J0ICogYXMgY2xvdWQgZnJvbSAnd3gtc2VydmVyLXNkayc7XG5pbXBvcnQgKiBhcyBUY2JSb3V0ZXIgZnJvbSAndGNiLXJvdXRlcic7XG5pbXBvcnQgeyBjcmVhdGUkIH0gZnJvbSAnLi9jcmVhdGUnO1xuXG5jbG91ZC5pbml0KHtcbiAgICBlbnY6IHByb2Nlc3MuZW52LmNsb3VkXG59KTtcblxuY29uc3QgZGI6IERCLkRhdGFiYXNlID0gY2xvdWQuZGF0YWJhc2UoICk7XG5jb25zdCBfID0gZGIuY29tbWFuZDtcblxuLyoqIFxuICog6L2s5o2i5qC85p6X5bC85rK75pe25Yy6ICs45pe25Yy6XG4gKiBEYXRlKCkubm93KCkgLyBuZXcgRGF0ZSgpLmdldFRpbWUoKSDmmK/ml7bkuI3ml7bmraPluLjnmoQrOFxuICogRGF0ZS50b0xvY2FsU3RyaW5nKCApIOWlveWDj+aYr+S4gOebtOaYrysw55qEXG4gKiDlhYjmi7/liLAgKzDvvIznhLblkI4rOFxuICovXG5jb25zdCBnZXROb3cgPSAoIHRzID0gZmFsc2UgKTogYW55ID0+IHtcbiAgICBpZiAoIHRzICkge1xuICAgICAgICByZXR1cm4gRGF0ZS5ub3coICk7XG4gICAgfVxuICAgIGNvbnN0IHRpbWVfMCA9IG5ldyBEYXRlKCBuZXcgRGF0ZSggKS50b0xvY2FsZVN0cmluZyggKSk7XG4gICAgcmV0dXJuIG5ldyBEYXRlKCB0aW1lXzAuZ2V0VGltZSggKSArIDggKiA2MCAqIDYwICogMTAwMCApXG59XG5cbi8qKlxuICogXG4gKiBAZGVzY3JpcHRpb24g6K6i5Y2V5qih5Z2XXG4gKiAtLS0tLS0tLSDlrZfmrrUgLS0tLS0tLS0tLVxuICogX2lkXG4gKiBvcGVuaWQsXG4gKiBjcmVhdGV0aW1lXG4gKiBwYXl0aW1lXG4gKiB0aWQsXG4gKiBwaWQsXG4gKiBjaWQgKOWPr+S4uuepuilcbiAqIHNpZCwgKOWPr+S4uuepuilcbiAqIGNvdW50LFxuICogcHJpY2UsXG4gKiBncm91cFByaWNlLFxuICogZGVwb3NpdF9wcmljZTog5ZWG5ZOB6K6i6YeRICjlj6/kuLrnqbopXG4gKiAhIGFjaWQg5ZWG5ZOB5rS75YqoaWRcbiAqICEgaXNPY2N1cGllZCwg5piv5ZCm5Y2g5bqT5a2YXG4gKiBncm91cF9wcmljZSAo5Y+v5Li656m6KVxuICogdHlwZTogJ2N1c3RvbScgfCAnbm9ybWFsJyB8ICdwcmUnIOiHquWumuS5ieWKoOWNleOAgeaZrumAmuWKoOWNleOAgemihOiuouWNlVxuICogaW1nOiBBcnJheVsgc3RyaW5nIF1cbiAqIGRlc2PvvIjlj6/kuLrnqbrvvIksXG4gKiBhaWRcbiAqIGFsbG9jYXRlZFByaWNlIOWIhumFjeeahOS7t+agvFxuICogYWxsb2NhdGVkR3JvdXBQcmljZSDliIbphY3lm6LotK3ku7dcbiAqIGFsbG9jYXRlZENvdW50IOWIhumFjeeahOaVsOmHj1xuICogZm9ybV9pZFxuICogcHJlcGF5X2lkLFxuICogZmluYWxfcHJpY2Ug5pyA5ZCO5oiQ5Lqk5Lu3XG4gKiAhIGNhbkdyb3VwIOaYr+WQpuWPr+S7peaLvOWbolxuICogYmFzZV9zdGF0dXM6IDAsMSwyLDMsNCw1IOi/m+ihjOS4re+8jOS7o+i0reW3sui0reS5sO+8jOW3suiwg+aVtO+8jOW3sue7k+eul++8jOW3suWPlua2iO+8iOS5sOS4jeWIsO+8ie+8jOW3sui/h+acn++8iOaUr+S7mOi/h+acn++8iVxuICogcGF5X3N0YXR1czogMCwxLDIg5pyq5LuY5qy+77yM5bey5LuY6K6i6YeR77yM5bey5LuY5YWo5qy+XG4gKiAhIGRlbGl2ZXJfc3RhdHVzOiAwLDEg5pyq5Y+R5biD77yM5bey5Y+R5biD44CBXG4gKi9cbmV4cG9ydCBjb25zdCBtYWluID0gYXN5bmMgKCBldmVudCwgY29udGV4dCApID0+IHtcblxuICAgIGNvbnN0IGFwcCA9IG5ldyBUY2JSb3V0ZXIoeyBldmVudCB9KTtcblxuICAgIC8qKlxuICAgICAqIEBkZXNjcmlwdGlvbiDliJvlu7rorqLljZVcbiAgICAgKiAtLS0tLS0tLSDor7fmsYIgLS0tLS0tLS0tLVxuICAgICAqIHtcbiAgICAgKiAgICAgIHRpZCxcbiAgICAgKiAgICAgIG9wZW5JZCAvLyDorqLljZXkuLvkurpcbiAgICAgKiAgICAgIGZyb206ICdjYXJ0JyB8ICdidXknIHwgJ2N1c3RvbScgfCAnYWdlbnRzJyB8ICdzeXN0ZW0nIOadpea6kO+8mui0reeJqei9puOAgeebtOaOpei0reS5sOOAgeiHquWumuS5ieS4i+WNleOAgeS7o+i0reS4i+WNleOAgeezu+e7n+WPkei1t+mihOS7mOiuouWNlVxuICAgICAqICAgICAgb3JkZXJzOiBBcnJheTx7IFxuICAgICAqICAgICAgICAgIHRpZFxuICAgICAqICAgICAgICAgIGNpZFxuICAgICAqICAgICAgICAgIHNpZFxuICAgICAqICAgICAgICAgIHBpZFxuICAgICAqICAgICAgICAgIHByaWNlXG4gICAgICogICAgICAgICAgbmFtZVxuICAgICAqICAgICAgICAgIGFjaWRcbiAgICAgKiAgICAgICAgICBzdGFuZGVybmFtZVxuICAgICAqICAgICAgICAgIGdyb3VwUHJpY2VcbiAgICAgKiAgICAgICAgICBjb3VudFxuICAgICAqICAgICAgICAgIGRlc2NcbiAgICAgKiAgICAgICAgICBpbWdcbiAgICAgKiAgICAgICAgICB0eXBlXG4gICAgICogICAgICAgICAgcGF5X3N0YXR1cyxcbiAgICAgKiAgICAgICAgICBhZGRyZXNzOiB7XG4gICAgICogICAgICAgICAgICAgIG5hbWUsXG4gICAgICogICAgICAgICAgICAgIHBob25lLFxuICAgICAqICAgICAgICAgICAgICBkZXRhaWwsXG4gICAgICogICAgICAgICAgICAgIHBvc3RhbGNvZGVcbiAgICAgKiAgICAgICAgICB9XG4gICAgICogICAgICB9PlxuICAgICAqIH1cbiAgICAgKi9cbiAgICBhcHAucm91dGVyKCdjcmVhdGUnLCBhc3luYyggY3R4LCBuZXh0ICkgPT4ge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgXG4gICAgICAgICAgICBjb25zdCB7IHRpZCwgZnJvbSwgb3JkZXJzIH0gPSBldmVudC5kYXRhO1xuICAgICAgICAgICAgY29uc3Qgb3BlbmlkID0gZXZlbnQuZGF0YS5vcGVuSWQgfHwgZXZlbnQudXNlckluZm8ub3BlbklkO1xuXG4gICAgICAgICAgICAvLyAx44CB5Yik5pat6K+l6KGM56iL5piv5ZCm5Y+v5Lul55SoXG4gICAgICAgICAgICBjb25zdCB0cmlwcyQkID0gYXdhaXQgY2xvdWQuY2FsbEZ1bmN0aW9uKHtcbiAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIF9pZDogdGlkXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICR1cmw6ICdkZXRhaWwnXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBuYW1lOiAndHJpcCdcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBjb25zdCB0cmlwcyQgPSB0cmlwcyQkLnJlc3VsdDsgICAgICAgIFxuICAgICAgICAgICAgaWYgKCB0cmlwcyQuc3RhdHVzICE9PSAyMDBcbiAgICAgICAgICAgICAgICAgICAgfHwgIXRyaXBzJC5kYXRhIFxuICAgICAgICAgICAgICAgICAgICB8fCAoICEhdHJpcHMkLmRhdGEgJiYgdHJpcHMkLmRhdGEuaXNDbG9zZWQgKSBcbiAgICAgICAgICAgICAgICAgICAgfHwgKCAhIXRyaXBzJC5kYXRhICYmIGdldE5vdyggdHJ1ZSApID49IHRyaXBzJC5kYXRhLmVuZF9kYXRlICkpIHtcbiAgICAgICAgICAgICAgICB0aHJvdyAn5pqC5peg6KGM56iL6K6h5YiS77yM5pqC5pe25LiN6IO96LSt5Lmw772eJ1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyDmnIDmlrDlj6/nlKjooYznqItcbiAgICAgICAgICAgIGNvbnN0IHRyaXAgPSB0cmlwcyQuZGF0YTtcblxuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiDmoLnmja7lnLDlnYDlr7nosaHvvIzmi7/liLDlnLDlnYBpZFxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICBsZXQgYWRkcmVzc2lkJCA9IHtcbiAgICAgICAgICAgICAgICByZXN1bHQ6IHtcbiAgICAgICAgICAgICAgICAgICAgZGF0YTogbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgc3RhdHVzOiA1MDBcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAvLyDorqLljZXmnaXmupDvvJrotK3nianovabjgIHns7vnu5/liqDljZVcbiAgICAgICAgICAgIGlmICggZXZlbnQuZGF0YS5mcm9tID09PSAnY2FydCcgfHwgZXZlbnQuZGF0YS5mcm9tID09PSAnc3lzdGVtJyB8fCBldmVudC5kYXRhLmZyb20gPT09ICdidXknICkge1xuICAgICAgICAgICAgICAgIGFkZHJlc3NpZCQgPSBhd2FpdCBjbG91ZC5jYWxsRnVuY3Rpb24oe1xuICAgICAgICAgICAgICAgICAgICBkYXRhOiB7IFxuICAgICAgICAgICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9wZW5JZDogb3BlbmlkLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFkZHJlc3M6IGV2ZW50LmRhdGEub3JkZXJzWyAwIF0uYWRkcmVzc1xuICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICR1cmw6ICdnZXRBZGRyZXNzSWQnXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIG5hbWU6ICdhZGRyZXNzJ1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgXG4gICAgICAgICAgICAvLyDorqLljZXmnaXmupDvvJrotK3nianovabjgIHns7vnu5/liqDljZVcbiAgICAgICAgICAgIGlmICgoIGV2ZW50LmRhdGEuZnJvbSA9PT0gJ2NhcnQnIHx8IGV2ZW50LmRhdGEuZnJvbSA9PT0gJ3N5c3RlbScgKSAmJiBhZGRyZXNzaWQkLnJlc3VsdC5zdGF0dXMgIT09IDIwMCApIHtcbiAgICAgICAgICAgICAgICB0aHJvdyAn5p+l6K+i5Zyw5Z2A6ZSZ6K+vJztcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8g5Y+v55So5Zyw5Z2AaWRcbiAgICAgICAgICAgIGNvbnN0IGFpZCA9IGFkZHJlc3NpZCQucmVzdWx0LmRhdGE7XG5cbiAgICAgICAgICAgIC8vIOaYr+WQpuaWsOWuouaIt1xuICAgICAgICAgICAgY29uc3QgaXNOZXckID0gYXdhaXQgY2xvdWQuY2FsbEZ1bmN0aW9uKHtcbiAgICAgICAgICAgICAgICBuYW1lOiAnY29tbW9uJyxcbiAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICAgICR1cmw6ICdpcy1uZXctY3VzdG9tZXInLFxuICAgICAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBvcGVuSWQ6IG9wZW5pZFxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSlcblxuICAgICAgICAgICAgY29uc3QgaXNOZXcgPSBpc05ldyQucmVzdWx0LmRhdGE7XG5cbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICog5paw5a6iICsg5paw5a6i6KaB6K6i6YeRID0gJzAnLFxuICAgICAgICAgICAgICog5paw5a6iICsg6KaB6K6i6YeRID0gJzAnLFxuICAgICAgICAgICAgICog5paw5a6iICsg5YWN6K6i6YeRID0gJzEnLFxuICAgICAgICAgICAgICog5pen5a6iICsg5pen5a6i5YWN6K6i6YeRID0gJzEnLFxuICAgICAgICAgICAgICog5pen5a6iICsg6KaB6K6i6YeRID0gJzAnLFxuICAgICAgICAgICAgICog5pen5a6iICsg5YWN6K6i6YeRID0gJzEnLFxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICBsZXQgcGF5X3N0YXR1cyA9ICcwJztcbiAgICAgICAgICAgIGNvbnN0IHAgPSB0cmlwLnBheW1lbnQ7XG5cbiAgICAgICAgICAgIGlmICggaXNOZXcgJiYgcCA9PT0gJzAnICkge1xuICAgICAgICAgICAgICAgIHBheV9zdGF0dXMgPSAnMCdcblxuICAgICAgICAgICAgfSBlbHNlIGlmICggaXNOZXcgJiYgcCA9PT0gJzEnICkge1xuICAgICAgICAgICAgICAgIHBheV9zdGF0dXMgPSAnMCdcblxuICAgICAgICAgICAgfSBlbHNlIGlmICggaXNOZXcgJiYgcCA9PT0gJzInICkge1xuICAgICAgICAgICAgICAgIHBheV9zdGF0dXMgPSAnMSdcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoICFpc05ldyAmJiBwID09PSAnMCcgKSB7XG4gICAgICAgICAgICAgICAgcGF5X3N0YXR1cyA9ICcxJ1xuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgfSBlbHNlIGlmICggIWlzTmV3ICYmIHAgPT09ICcxJyApIHtcbiAgICAgICAgICAgICAgICBwYXlfc3RhdHVzID0gJzAnXG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICB9IGVsc2UgaWYgKCAhaXNOZXcgJiYgcCA9PT0gJzInICkge1xuICAgICAgICAgICAgICAgIHBheV9zdGF0dXMgPSAnMSdcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcGF5X3N0YXR1cyA9ICcwJ1xuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyAz44CB5om56YeP5Yib5bu66K6i5Y2V77yM77yI6L+H5ruk5o6J5LiN6IO95Yib5bu66LSt54mp5riF5Y2V55qE5ZWG5ZOB77yJXG4gICAgICAgICAgICBjb25zdCB0ZW1wID0gZXZlbnQuZGF0YS5vcmRlcnMubWFwKCBtZXRhID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCB0ID0gT2JqZWN0LmFzc2lnbih7IH0sIG1ldGEsIHtcbiAgICAgICAgICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgICAgICAgICAqICEgZGVsaXZlcl9zdGF0dXPkuLrmnKrlj5HluIMg5Y+v6IO95pyJ6Zeu6aKYXG4gICAgICAgICAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgICAgICAgICBhaWQsXG4gICAgICAgICAgICAgICAgICAgIGlzT2NjdXBpZWQ6IHRydWUsIC8vIOWNoOmihuW6k+WtmOagh+W/l1xuICAgICAgICAgICAgICAgICAgICBvcGVuaWQ6IG9wZW5pZCxcbiAgICAgICAgICAgICAgICAgICAgZGVsaXZlcl9zdGF0dXM6ICcwJywgXG4gICAgICAgICAgICAgICAgICAgIGJhc2Vfc3RhdHVzOiAnMCcsXG4gICAgICAgICAgICAgICAgICAgIHBheV9zdGF0dXM6ICFtZXRhLmRlcG9zaXRQcmljZSA/ICcxJyA6IHBheV9zdGF0dXMgLCAvLyDllYblk4HorqLph5Hpop3luqbkuLowXG4gICAgICAgICAgICAgICAgICAgIGNyZWF0ZVRpbWU6IGdldE5vdyggdHJ1ZSApLFxuICAgICAgICAgICAgICAgICAgICB0eXBlOiAhIW1ldGEuZGVwb3NpdFByaWNlID8gbWV0YS50eXBlIDogJ25vcm1hbCdcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICBkZWxldGUgdFsnYWRkcmVzcyddO1xuXG4gICAgICAgICAgICAgICAgaWYgKCAhdFsnc2lkJ10gKSB7XG4gICAgICAgICAgICAgICAgICAgIGRlbGV0ZSB0WydzaWQnXTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gdDtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAvLyA044CB5om56YeP5Yib5bu66K6i5Y2VICgg5ZCM5pe25aSE55CG5Y2g6aKG6LSn5a2Y55qE6Zeu6aKYIClcbiAgICAgICAgICAgIGNvbnN0IHNhdmUkOiBhbnkgPSBhd2FpdCBQcm9taXNlLmFsbCggdGVtcC5tYXAoIG8gPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiBjcmVhdGUkKCBvcGVuaWQsIG8sIGRiLCBjdHggKTtcbiAgICAgICAgICAgIH0pKTtcbiAgICAgICAgXG4gICAgICAgICAgICBpZiAoIHNhdmUkLnNvbWUoIHggPT4geC5zdGF0dXMgIT09IDIwMCApKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgJ+WIm+W7uuiuouWNlemUmeivr++8gSdcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8g6L+U5Zue6K6i5Y2V5L+h5oGvXG4gICAgICAgICAgICBjb25zdCBvcmRlcl9yZXN1bHQgPSBzYXZlJC5tYXAoKCB4LCBrICkgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IHsgcHJpY2UsIGNvdW50LCBwYXlfc3RhdHVzLCBkZXBvc2l0UHJpY2UgfSA9IHRlbXBbIGsgXTtcbiAgICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgICAgICBvaWQ6IHguZGF0YS5faWQsXG4gICAgICAgICAgICAgICAgICAgIHByaWNlLFxuICAgICAgICAgICAgICAgICAgICBjb3VudCxcbiAgICAgICAgICAgICAgICAgICAgcGF5X3N0YXR1cyxcbiAgICAgICAgICAgICAgICAgICAgZGVwb3NpdFByaWNlXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHJldHVybiBjdHguYm9keSA9IHtcbiAgICAgICAgICAgICAgICBzdGF0dXM6IDIwMCxcbiAgICAgICAgICAgICAgICBkYXRhOiBvcmRlcl9yZXN1bHRcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgfSBjYXRjaCAoIGUgKSB7XG4gICAgIFxuICAgICAgICAgICAgcmV0dXJuIGN0eC5ib2R5ID0ge1xuICAgICAgICAgICAgICAgIHN0YXR1czogNTAwLFxuICAgICAgICAgICAgICAgIG1lc3NhZ2U6IGVcbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgIC8qKlxuICAgICAqIEBkZXNjcmlwdGlvblxuICAgICAqIOWuouaIt+err+afpeivolxuICAgICAqIFxuICAgICAqIOWIhumhtSArIHF1ZXJ5IOafpeivouiuouWNleWIl+ihqO+8iOacquiBmuWQiO+8iVxuICAgICAqIC0tLS0tIOivt+axgiAtLS0tLS1cbiAgICAgKiB7XG4gICAgICohICAgIHRpZDog6KGM56iLaWQg77yI5Y+v5peg77yJXG4gICAgICogICAgIG9wZW5pZDog77yI5Y+v5peg77yJXG4gICAgICogICAgIHBhZ2U6IG51bWJlclxuICAgICAqICAgICBza2lwOiBudW1iZXJcbiAgICAgKiAgICAgdHlwZTog5oiR55qE5YWo6YOoIHwg5pyq5LuY5qy+6K6i5Y2VIHwg5b6F5Y+R6LSnIHwg5bey5a6M5oiQIHwg566h55CG5ZGY77yI6KGM56iL6K6i5Y2V77yJfCDnrqHnkIblkZjvvIjmiYDmnInorqLljZXvvIlcbiAgICAgKiAgICAgdHlwZTogbXktYWxsIHwgbXktbm90cGF5IHwgbXktZGVsaXZlciB8IG15LWZpbmlzaCB8IG1hbmFnZXItdHJpcCB8IG1hbmFnZXItYWxsXG4gICAgICogICAgIHBhc3N1c2VkbGVzczogdHJ1ZSB8IGZhbHNlIHwgdW5kZWZpbmVkIOaYr+WQpui/h+a7pOaOiei/h+acn+eahOiuouWNlVxuICAgICAqIH1cbiAgICAgKiAhIOacquS7mOasvuiuouWNle+8mnBheV9zdGF0dXM6IOacquS7mOasvi/lt7Lku5jorqLph5Eg5oiWIHR5cGU6IHByZVxuICAgICAqICEg5b6F5Y+R6LSn77yaZGVsaXZlcl9zdGF0dXPvvJrmnKrlj5HotKcg5LiUIHBheV9zdGF0dXMg5bey5LuY5qy+XG4gICAgICogISDlt7LlrozmiJDvvJpkZWxpdmVyX3N0YXR1c++8muW3suWPkei0pyDkuJQgcGF5X3N0YXR1cyDlt7Lku5jlhajmrL5cbiAgICAgKi9cbiAgICBhcHAucm91dGVyKCdsaXN0JywgYXN5bmMoIGN0eCwgbmV4dCApID0+IHtcbiAgICAgICAgdHJ5IHtcblxuICAgICAgICAgICAgbGV0IHdoZXJlJCA9IHsgfTtcbiAgICAgICAgICAgIGNvbnN0IHsgdHlwZSwgdGlkLCBwYXNzdXNlZGxlc3MgfSA9IGV2ZW50LmRhdGE7XG5cbiAgICAgICAgICAgIC8vIOafpeivouadoeaVsFxuICAgICAgICAgICAgY29uc3QgbGltaXQgPSB0aWQgPyA5OSA6IDEwO1xuXG4gICAgICAgICAgICBjb25zdCBvcGVuaWQgPSBldmVudC5kYXRhLm9wZW5pZCB8fCBldmVudC51c2VySW5mby5vcGVuSWQ7XG5cblxuICAgICAgICAgICAgLy8g5oiR55qE5YWo6YOoXG4gICAgICAgICAgICBpZiAoIHR5cGUgPT09ICdteS1hbGwnICkge1xuICAgICAgICAgICAgICAgIHdoZXJlJCA9IHtcbiAgICAgICAgICAgICAgICAgICAgb3BlbmlkOiBvcGVuaWRcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIOacquS7mOasvlxuICAgICAgICAgICAgfSBlbHNlIGlmICggdHlwZSA9PT0gJ215LW5vdHBheScgKSB7XG4gICAgICAgICAgICAgICAgd2hlcmUkID0gXy5hbmQoe1xuICAgICAgICAgICAgICAgICAgICBvcGVuaWQsXG4gICAgICAgICAgICAgICAgICAgIGJhc2Vfc3RhdHVzOiAnMidcbiAgICAgICAgICAgICAgICB9LCBfLm9yKFtcbiAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogJ3ByZSdcbiAgICAgICAgICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICAgICAgICAgICAgcGF5X3N0YXR1czogXy5vciggXy5lcSgnMCcpLCBfLmVxKCcxJykpXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBdKSk7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIC8vIOacquWPkei0p1xuICAgICAgICAgICAgfSBlbHNlIGlmICggdHlwZSA9PT0gJ215LWRlbGl2ZScgKSB7XG4gICAgICAgICAgICAgICAgd2hlcmUkID0ge1xuICAgICAgICAgICAgICAgICAgICBvcGVuaWQsXG4gICAgICAgICAgICAgICAgICAgIHBheV9zdGF0dXM6ICcyJyxcbiAgICAgICAgICAgICAgICAgICAgZGVsaXZlcl9zdGF0dXM6ICcwJ1xuICAgICAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIC8vIOW3suWujOaIkFxuICAgICAgICAgICAgfSBlbHNlIGlmICggdHlwZSA9PT0gJ215LWZpbmlzaCcgKSB7XG4gICAgICAgICAgICAgICAgd2hlcmUkID0ge1xuICAgICAgICAgICAgICAgICAgICBvcGVuaWQsXG4gICAgICAgICAgICAgICAgICAgIHBheV9zdGF0dXM6ICcyJyxcbiAgICAgICAgICAgICAgICAgICAgZGVsaXZlcl9zdGF0dXM6ICcxJ1xuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIOi/h+a7pOaOiei/h+acn+iuouWNlVxuICAgICAgICAgICAgaWYgKCBwYXNzdXNlZGxlc3MgIT09IGZhbHNlICkge1xuICAgICAgICAgICAgICAgIHdoZXJlJCA9IE9iamVjdC5hc3NpZ24oeyB9LCB3aGVyZSQsIHtcbiAgICAgICAgICAgICAgICAgICAgYmFzZV9zdGF0dXM6IF8ubmVxKCc1JylcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8g6KGM56iL6K6i5Y2VXG4gICAgICAgICAgICBpZiAoIHRpZCApIHtcbiAgICAgICAgICAgICAgICB3aGVyZSQgPSBPYmplY3QuYXNzaWduKHsgfSwgd2hlcmUkLCB7XG4gICAgICAgICAgICAgICAgICAgIHRpZFxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyDojrflj5bmgLvmlbBcbiAgICAgICAgICAgIGNvbnN0IHRvdGFsJCA9IGF3YWl0IGRiLmNvbGxlY3Rpb24oJ29yZGVyJylcbiAgICAgICAgICAgICAgICAud2hlcmUoIHdoZXJlJCApXG4gICAgICAgICAgICAgICAgLmNvdW50KCApO1xuXG4gICAgICAgICAgICAvLyDojrflj5borqLljZXmlbDmja5cbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogISDlpoLmnpzmmK/mnInmjIflrpp0aWTnmoTvvIzliJnkuI3pnIDopoFsaW1pdOS6hu+8jOebtOaOpeaLieWPluihjOeoi+aJgOacieeahOiuouWNlVxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICBjb25zdCBkYXRhJCA9IGF3YWl0IGRiLmNvbGxlY3Rpb24oJ29yZGVyJylcbiAgICAgICAgICAgICAgICAud2hlcmUoIHdoZXJlJCApXG4gICAgICAgICAgICAgICAgLm9yZGVyQnkoJ2NyZWF0ZVRpbWUnLCAnZGVzYycpXG4gICAgICAgICAgICAgICAgLmxpbWl0KCBsaW1pdCApXG4gICAgICAgICAgICAgICAgLnNraXAoIGV2ZW50LmRhdGEuc2tpcCB8fCAoIGV2ZW50LmRhdGEucGFnZSAtIDEgKSAqIGxpbWl0IClcbiAgICAgICAgICAgICAgICAuZ2V0KCApO1xuXG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqICEg55Sx5LqO5p+l6K+i5piv5oyJ5YiG6aG177yM5L2G5piv5pi+56S65piv5oyJ6KGM56iL5p2l6IGa5ZCI5pi+56S6XG4gICAgICAgICAgICAgKiAhIOWboOatpOacieWPr+iDve+8jE7pobXmnIDlkI7kuIDkvY3vvIzot59OKzHpobXnrKzkuIDkvY3kvp3nhLblsZ7kuo7lkIzkuIDooYznqItcbiAgICAgICAgICAgICAqICEg5aaC5LiN6L+b6KGM5aSE55CG77yM5a6i5oi35p+l6K+i6K6i5Y2V5YiX6KGo5pi+56S66KGM56iL6K6i5Y2V5pe277yM5Lya4oCc5pyJ5Y+v6IO94oCd5pi+56S65LiN5YWoXG4gICAgICAgICAgICAgKiAhIOeJueauiuWkhOeQhu+8mueUqOacgOWQjuS4gOS9jeeahHRpZO+8jOafpeivouacgOWQjuS4gOS9jeS7peWQjuWQjHRpZOeahG9yZGVy77yM54S25ZCO5L+u5q2j5omA6L+U5Zue55qEcGFnZVxuICAgICAgICAgICAgICovXG5cbiAgICAgICAgICAgIGNvbnN0IGxhc3QgPSBkYXRhJC5kYXRhWyBkYXRhJC5kYXRhLmxlbmd0aCAtIDEgXTtcblxuICAgICAgICAgICAgbGV0IGZpeCQ6IGFueSA9IHtcbiAgICAgICAgICAgICAgICBkYXRhOiBbIF1cbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIC8vIOWmguaenOayoeaciXRpZOWPguaVsO+8jOaJjeWOu+WBmmZpeOeahOWKqOS9nFxuICAgICAgICAgICAgaWYgKCBsYXN0ICYmICF0aWQgKSB7IFxuICAgICAgICAgICAgICAgIGZpeCQgPSBhd2FpdCBkYi5jb2xsZWN0aW9uKCdvcmRlcicpXG4gICAgICAgICAgICAgICAgICAgIC53aGVyZSh7XG4gICAgICAgICAgICAgICAgICAgICAgICBvcGVuaWQsXG4gICAgICAgICAgICAgICAgICAgICAgICB0aWQ6IGxhc3QudGlkLFxuICAgICAgICAgICAgICAgICAgICAgICAgYmFzZV9zdGF0dXM6IF8ubmVxKCc1JylcbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgLm9yZGVyQnkoJ2NyZWF0ZVRpbWUnLCAnZGVzYycpXG4gICAgICAgICAgICAgICAgICAgIC5za2lwKCBldmVudC5kYXRhLnNraXAgPyBldmVudC5kYXRhLnNraXAgKyBkYXRhJC5kYXRhLmxlbmd0aCA6ICggZXZlbnQuZGF0YS5wYWdlIC0gMSApICogbGltaXQgKyBkYXRhJC5kYXRhLmxlbmd0aCApXG4gICAgICAgICAgICAgICAgICAgIC5nZXQoICk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGNvbnN0IG1ldGEgPSBbIC4uLmRhdGEkLmRhdGEsIC4uLmZpeCQuZGF0YSBdO1xuXG4gICAgICAgICAgICAvLyDov5nph4znmoTooYznqIvor6bmg4XnlKggbmV3IFNldOeahOaWueW8j+afpeivolxuICAgICAgICAgICAgY29uc3QgdHJpcElkcyA9IEFycmF5LmZyb20oXG4gICAgICAgICAgICAgICAgbmV3IFNldCggbWV0YS5tYXAoIG0gPT4gbS50aWQgKSlcbiAgICAgICAgICAgICk7XG5cbiAgICAgICAgICAgIGNvbnN0IHRyaXBzJCA9IGF3YWl0IFByb21pc2UuYWxsKCB0cmlwSWRzLm1hcCggdGlkID0+IHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZGIuY29sbGVjdGlvbigndHJpcCcpXG4gICAgICAgICAgICAgICAgICAgIC53aGVyZSh7XG4gICAgICAgICAgICAgICAgICAgICAgICBfaWQ6IHRpZFxuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAuZ2V0KCApO1xuICAgICAgICAgICAgfSkpO1xuICAgICBcbiAgICAgICAgICAgIC8vIOiBmuWQiOihjOeoi+aVsOaNrlxuICAgICAgICAgICAgY29uc3QgbWV0YTIgPSBtZXRhLm1hcCgoIHgsIGkgKSA9PiBPYmplY3QuYXNzaWduKHsgfSwgeCwge1xuICAgICAgICAgICAgICAgIC8vIHRyaXA6IHRyaXBzJFsgaSBdLmRhdGFbIDAgXVxuICAgICAgICAgICAgICAgIHRyaXA6ICh0cmlwcyQuZmluZCggeSA9PiB5LmRhdGFbIDAgXS5faWQgPT09IHgudGlkICkgYXMgYW55KS5kYXRhWyAwIF1cbiAgICAgICAgICAgIH0pKTtcblxuICAgICAgICAgICAgcmV0dXJuIGN0eC5ib2R5ID0ge1xuICAgICAgICAgICAgICAgIHN0YXR1czogMjAwLFxuICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgZGF0YTogbWV0YTIsXG4gICAgICAgICAgICAgICAgICAgIHBhZ2VTaXplOiBsaW1pdCxcbiAgICAgICAgICAgICAgICAgICAgdG90YWw6IHRvdGFsJC50b3RhbCxcbiAgICAgICAgICAgICAgICAgICAgcGFnZTogZml4JC5kYXRhLmxlbmd0aCA9PT0gMCA/IGV2ZW50LmRhdGEucGFnZSA6IGV2ZW50LmRhdGEucGFnZSArIE1hdGguY2VpbCggZml4JC5kYXRhLmxlbmd0aCAvIGxpbWl0ICksXG4gICAgICAgICAgICAgICAgICAgIGN1cnJlbnQ6IGV2ZW50LmRhdGEuc2tpcCA/IGV2ZW50LmRhdGEuc2tpcCArIG1ldGEubGVuZ3RoIDogKCBldmVudC5kYXRhLnBhZ2UgLSAxICkgKiBsaW1pdCArIG1ldGEubGVuZ3RoLFxuICAgICAgICAgICAgICAgICAgICB0b3RhbFBhZ2U6IE1hdGguY2VpbCggdG90YWwkLnRvdGFsIC8gbGltaXQgKVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIFxuICAgICAgICB9IGNhdGNoICggZSApIHsgcmV0dXJuIGN0eC5ib2R5ID0geyBzdGF0dXM6IDUwMH07fVxuICAgIH0pXG5cbiAgICAvKipcbiAgICAgKiDmibnph4/mm7TmlrDvvIzorqLljZXkuLrlt7LmlK/ku5jvvIzlubbkuJTlop7liqDliLDotK3nianmuIXljZVcbiAgICAgKiDlubbmjqjpgIHnm7jlhbPkubDlrrZcbiAgICAgKiDlubbmjqjpgIHnm7jlhbPigJzmjqjlub/ogIXigJ1cbiAgICAgKiB7XG4gICAgICogICAgICBvcmRlcklkczogXCIxMjMsMjM0LDM0NVwiXG4gICAgICogICAgICBmb3JtX2lkLFxuICAgICAqICAgICAgcHJlcGF5X2lkXG4gICAgICogfVxuICAgICAqL1xuICAgIGFwcC5yb3V0ZXIoJ3VwYWR0ZS10by1wYXllZCcsIGFzeW5jKCBjdHgsIG5leHQgKSA9PiB7XG4gICAgICAgIHRyeSB7XG5cbiAgICAgICAgICAgIGNvbnN0IG9wZW5JZCA9IGV2ZW50LnVzZXJJbmZvLm9wZW5JZDtcbiAgICAgICAgICAgIGNvbnN0IHsgb3JkZXJJZHMsIHByZXBheV9pZCwgZm9ybV9pZCB9ID0gZXZlbnQuZGF0YTtcblxuICAgICAgICAgICAgLy8g5pu05paw6K6i5Y2V5a2X5q61XG4gICAgICAgICAgICBhd2FpdCBQcm9taXNlLmFsbCggb3JkZXJJZHMuc3BsaXQoJywnKS5tYXAoIG9pZCA9PiB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGRiLmNvbGxlY3Rpb24oJ29yZGVyJykuZG9jKCBvaWQgKVxuICAgICAgICAgICAgICAgICAgICAudXBkYXRlKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb3JtX2lkLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHByZXBheV9pZCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXlfc3RhdHVzOiAnMSdcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9KSk7XG5cbiAgICAgICAgICAgIC8vIOWIm+W7ui/mj5LlhaXliLDotK3nianmuIXljZVcbiAgICAgICAgICAgIGNvbnN0IGZpbmQkOiBhbnkgPSBhd2FpdCBQcm9taXNlLmFsbCggb3JkZXJJZHMuc3BsaXQoJywnKS5tYXAoIG9pZCA9PiB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGRiLmNvbGxlY3Rpb24oJ29yZGVyJylcbiAgICAgICAgICAgICAgICAgICAgLndoZXJlKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIF9pZDogb2lkXG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgIC5nZXQoICk7XG4gICAgICAgICAgICB9KSk7XG5cbiAgICAgICAgICAgIC8vIOiuouWNleWIl+ihqFxuICAgICAgICAgICAgY29uc3QgbGlzdCA9IGZpbmQkLm1hcCggeCA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3QgeyBfaWQsIHRpZCwgcGlkLCBzaWQsIHByaWNlLCBncm91cFByaWNlLCBhY2lkIH0gPSB4LmRhdGFbIDAgXTtcbiAgICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgICAgICBvaWQ6IF9pZCxcbiAgICAgICAgICAgICAgICAgICAgYWNpZCwgZ3JvdXBQcmljZSxcbiAgICAgICAgICAgICAgICAgICAgdGlkLCBwaWQsIHNpZCwgcHJpY2VcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgY29uc3QgY3JlYXRlJCA9IGF3YWl0IGNsb3VkLmNhbGxGdW5jdGlvbih7XG4gICAgICAgICAgICAgICAgbmFtZTogJ3Nob3BwaW5nLWxpc3QnLFxuICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgJHVybDogJ2NyZWF0ZScsXG4gICAgICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxpc3QsXG4gICAgICAgICAgICAgICAgICAgICAgICBvcGVuSWRcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAvLyDlpITnkIbotK3kubDnm7jlhbPnmoTmjqjpgIFcbiAgICAgICAgICAgIGlmICggY3JlYXRlJC5yZXN1bHQuc3RhdHVzID09PSAyMDAgKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgeyBidXllciwgb3RoZXJzIH0gPSBjcmVhdGUkLnJlc3VsdC5kYXRhO1xuXG4gICAgICAgICAgICAgICAgLy8g5Lmw5a625o6o6YCBXG4gICAgICAgICAgICAgICAgY29uc3QgcHVzaE1lJCA9IGF3YWl0IGNsb3VkLmNhbGxGdW5jdGlvbih7XG4gICAgICAgICAgICAgICAgICAgIG5hbWU6ICdjb21tb24nLFxuICAgICAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAkdXJsOiAncHVzaC10ZW1wbGF0ZScsXG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogYnV5ZXIudHlwZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvcGVuaWQ6IGJ1eWVyLm9wZW5pZCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZXh0czogZ2V0VGV4dEJ5UHVzaFR5cGUoIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBidXllci50eXBlID09PSAnYnV5UGluJyA/ICdidXlQaW4xJyA6IGJ1eWVyLnR5cGUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJ1eWVyLmRlbHRhIClcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgLy8g5YW25LuW5Lq65ou85Zui5oiQ5Yqf55qE5o6o6YCBXG4gICAgICAgICAgICAgICAgY29uc3Qgb3RoZXJzT3JkZXJzJDogYW55ID0gYXdhaXQgUHJvbWlzZS5hbGwoXG4gICAgICAgICAgICAgICAgICAgIG90aGVycy5tYXAoIFxuICAgICAgICAgICAgICAgICAgICAgICAgb3RoZXIgPT4gZGIuY29sbGVjdGlvbignb3JkZXInKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC53aGVyZSh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9wZW5pZDogb3RoZXIub3BlbmlkLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhY2lkOiBvdGhlci5hY2lkLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzaWQ6IG90aGVyLnNpZCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGlkOiBvdGhlci5waWQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRpZDogb3RoZXIudGlkLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXlfc3RhdHVzOiAnMScsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJhc2Vfc3RhdHVzOiBfLm9yKCBfLmVxKCcwJyksIF8uZXEoJzEnKSwgXy5lcSgnMicpKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLmZpZWxkKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY291bnQ6IHRydWVcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5nZXQoIClcbiAgICAgICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICAgICk7XG5cbiAgICAgICAgICAgICAgICAvLyDmlbTlkIhkZWx0YSArIGNvdW50XG4gICAgICAgICAgICAgICAgY29uc3Qgb3RoZXJzTW9yZSA9IG90aGVycy5tYXAoKCBvdGhlciwga2V5ICkgPT4ge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgLi4ub3RoZXIsXG4gICAgICAgICAgICAgICAgICAgICAgICBjb3VudDogb3RoZXJzT3JkZXJzJFsga2V5IF0uZGF0YS5yZWR1Y2UoKCB4LCB5ICkgPT4geS5jb3VudCArIHgsIDAgKVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICBsZXQgb3RoZXJzUHVzaCA9IHsgfTtcblxuICAgICAgICAgICAgICAgIG90aGVyc01vcmUubWFwKCBvdGhlciA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGlmICggIW90aGVyc1B1c2hbIG90aGVyLm9wZW5pZCBdKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBvdGhlcnNQdXNoID0gT2JqZWN0LmFzc2lnbih7IH0sIG90aGVyc1B1c2gsIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBbIG90aGVyLm9wZW5pZCBdOiBvdGhlci5kZWx0YSAqIG90aGVyLmNvdW50XG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG90aGVyc1B1c2ggPSBPYmplY3QuYXNzaWduKHsgfSwgb3RoZXJzUHVzaCwge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFsgb3RoZXIub3BlbmlkIF06IG90aGVyc1B1c2hbIG90aGVyLm9wZW5pZCBdICsgb3RoZXIuZGVsdGEgKiBvdGhlci5jb3VudFxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgIC8vIOWFtuS7luS6uuaLvOWbouaIkOWKn+eahOaOqOmAgVxuICAgICAgICAgICAgICAgIGF3YWl0IFByb21pc2UuYWxsKFxuICAgICAgICAgICAgICAgICAgICBPYmplY3Qua2V5cyggb3RoZXJzUHVzaCApLm1hcChcbiAgICAgICAgICAgICAgICAgICAgICAgIG90aGVyT3BlbmlkID0+IGNsb3VkLmNhbGxGdW5jdGlvbih7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogJ2NvbW1vbicsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAkdXJsOiAncHVzaC10ZW1wbGF0ZScsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6ICdidXlQaW4nLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb3BlbmlkOiBvdGhlck9wZW5pZCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRleHRzOiBnZXRUZXh0QnlQdXNoVHlwZSggJ2J1eVBpbjInLCBvdGhlcnNQdXNoWyBvdGhlck9wZW5pZCBdKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICAgICk7XG5cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8g5p+l55yLYXBwLWNvbmZpZ+enr+WIhuaOqOW5v+aYr+WQpuW8gOWQr1xuICAgICAgICAgICAgY29uc3QgYXBwQ29uZiQgPSBhd2FpdCBkYi5jb2xsZWN0aW9uKCdhcHAtY29uZmlnJylcbiAgICAgICAgICAgICAgICAud2hlcmUoe1xuICAgICAgICAgICAgICAgICAgICB0eXBlOiAnZ29vZC1pbnRlZ3JhbC1zaGFyZSdcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIC5nZXQoICk7XG4gICAgICAgICAgICBjb25zdCBhcHBDb25mID0gYXBwQ29uZiQuZGF0YVsgMCBdO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICBpZiAoIGFwcENvbmYudmFsdWUgKSB7XG4gICAgICAgICAgICAgICAgLy8g5om+5Ye65omA5pyJ55qE5o6o5bm/6K6w5b2VXG4gICAgICAgICAgICAgICAgY29uc3QgcHVzaGVycyQ6IGFueSA9IGF3YWl0IFByb21pc2UuYWxsKFxuICAgICAgICAgICAgICAgICAgICBsaXN0Lm1hcCggYXN5bmMoIHgsIGsgKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBwdXNoUmVjb3JkJCA9IGF3YWl0IGRiLmNvbGxlY3Rpb24oJ3NoYXJlLXJlY29yZCcpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLndoZXJlKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGlkOiB4LnBpZCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb3BlbmlkOiBvcGVuSWQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlzU3VjY2VzczogZmFsc2VcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5nZXQoICk7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC4uLnB1c2hSZWNvcmQkLmRhdGFbIDAgXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcmljZTogbGlzdFsgayBdLnByaWNlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHB1c2hJZDogcHVzaFJlY29yZCQuZGF0YVsgMCBdID8gcHVzaFJlY29yZCQuZGF0YVsgMCBdLl9pZCA6ICcnXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgKTtcblxuICAgICAgICAgICAgICAgIC8vIOaJvuWHuuaJgOacieeahOaOqOW5v+iAhVxuICAgICAgICAgICAgICAgIGNvbnN0IHB1c2hlcnM6IGFueSA9IFsgXTtcbiAgICAgICAgICAgICAgICBwdXNoZXJzJFxuICAgICAgICAgICAgICAgICAgICAuZmlsdGVyKCB4ID0+ICEheC5mcm9tIClcbiAgICAgICAgICAgICAgICAgICAgLm1hcCggeCA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBpbmRleCA9IHB1c2hlcnMuZmluZEluZGV4KCB5ID0+IHkuZnJvbSA9PT0geC5mcm9tICk7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIGluZGV4ICE9PSAtMSApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBvcmlnaW4gPSBwdXNoZXJzWyBpbmRleCBdO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHB1c2hlcnMuc3BsaWNlKCBpbmRleCwgMSwge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAuLi5vcmlnaW4sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHByaWNlOiBOdW1iZXIoKCB4LnByaWNlICsgb3JpZ2luLnByaWNlICkudG9GaXhlZCggMiApKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwdXNoZXJzLnB1c2goe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmcm9tOiB4LmZyb20sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHByaWNlOiB4LnByaWNlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwdXNoSWQ6IHgucHVzaElkXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICBhd2FpdCBQcm9taXNlLmFsbChcbiAgICAgICAgICAgICAgICAgICAgcHVzaGVycy5tYXAoIGFzeW5jIHB1c2hlciA9PiB7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIOaOqOW5v+enr+WIhuavlOS+iyA1JVxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgaW50ZWdyYWxSYXRlID0gMC4wNTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGludGVncmFsID0gTnVtYmVyKCggcHVzaGVyLnByaWNlICogaW50ZWdyYWxSYXRlICkudG9GaXhlZCggMSApKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgLy8g6K6w5b2V5o6o5bm/6ICF56ev5YiGXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCB1c2VyJCA9IGF3YWl0IGRiLmNvbGxlY3Rpb24oJ3VzZXInKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC53aGVyZSh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9wZW5pZDogcHVzaGVyLmZyb21cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5nZXQoICk7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCB1c2VyID0gdXNlciQuZGF0YVsgMCBdO1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgdXNlcmlkID0gdXNlci5faWQ7XG4gICAgICAgICAgICAgICAgICAgICAgICBkZWxldGUgdXNlclsnX2lkJ107XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGF3YWl0IGRiLmNvbGxlY3Rpb24oJ3VzZXInKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5kb2MoIFN0cmluZyggdXNlcmlkICkpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLnNldCh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC4uLnVzZXIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwdXNoX2ludGVncmFsOiB1c2VyLnB1c2hfaW50ZWdyYWwgPyBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBOdW1iZXIoKHVzZXIucHVzaF9pbnRlZ3JhbCArIGludGVncmFsKS50b0ZpeGVkKCAxICkpIDogXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaW50ZWdyYWxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyDlpITnkIbmjqjlub/ogIXnm7jlhbPnmoTmjqjpgIFcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHB1c2gkID0gYXdhaXQgY2xvdWQuY2FsbEZ1bmN0aW9uKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiAnY29tbW9uJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICR1cmw6ICdwdXNoLXRlbXBsYXRlJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogJ2hvbmdiYW8nLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb3BlbmlkOiBwdXNoZXIuZnJvbSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIOenr+WIhumhtemdolxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGFnZTogJ3BhZ2VzL3RyaXAtZW50ZXIvaW5kZXgnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGV4dHM6IFtg5oGt5Zac77yB6I635b6XJHtpbnRlZ3JhbH3lhYPmirXmiaPnjrDph5FgLGDmjqjlub/miJDlip/vvIHmnInkurrotK3kubDkuobkvaDliIbkuqvnmoTllYblk4FgXVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIOabtOaWsOaOqOW5v+eKtuaAgVxuICAgICAgICAgICAgICAgICAgICAgICAgYXdhaXQgZGIuY29sbGVjdGlvbignc2hhcmUtcmVjb3JkJylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAuZG9jKCBwdXNoZXIucHVzaElkIClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAudXBkYXRlKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaXNTdWNjZXNzOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3VjY2Vzc1RpbWU6IGdldE5vdyggdHJ1ZSApXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiBjdHguYm9keSA9IHtcbiAgICAgICAgICAgICAgICBzdGF0dXM6IDIwMFxuICAgICAgICAgICAgfVxuXG4gICAgICAgIH0gY2F0Y2ggKCBlICkgeyBcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCBlICk7XG4gICAgICAgICAgICByZXR1cm4gY3R4LmJvZHkgPSB7IHN0YXR1czogNTAwIH07XG4gICAgICAgIH0gXG4gICAgfSlcblxuICAgIC8qKiBcbiAgICAgKiBAZGVzY3JpcHRpb25cbiAgICAgKiDku6PotK3muIXluJDlgqzmrL7nmoTorqLljZXliJfooahcbiAgICAgKiB7XG4gICAgICogICAgIHRpZCBcbiAgICAgKiAgICAgbmVlZENvdXBvbnM6IGZhbHNlIHwgdHJ1ZSB8IHVuZGVmaW5lZFxuICAgICAqICAgICBuZWVkQWRkcmVzczogZmFsc2UgfCB0cnVlIHwgdW5kZWZpbmVkXG4gICAgICogfVxuICAgICAqL1xuICAgIGFwcC5yb3V0ZXIoJ2RhaWdvdS1saXN0JywgYXN5bmMoIGN0eCwgbmV4dCApID0+IHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGNvbnN0IHsgdGlkLCBuZWVkQ291cG9ucywgbmVlZEFkZHJlc3MgfSA9IGV2ZW50LmRhdGE7XG5cbiAgICAgICAgICAgIC8vIOiuouWNleS/oeaBr1xuICAgICAgICAgICAgY29uc3Qgb3JkZXJzJCA9IGF3YWl0IGRiLmNvbGxlY3Rpb24oJ29yZGVyJylcbiAgICAgICAgICAgICAgICAud2hlcmUoe1xuICAgICAgICAgICAgICAgICAgICB0aWQsXG4gICAgICAgICAgICAgICAgICAgIGJhc2Vfc3RhdHVzOiBfLm5lcSgnNScpLFxuICAgICAgICAgICAgICAgICAgICBwYXlfc3RhdHVzOiBfLm9yKCBfLmVxKCcxJyksIF8uZXEoJzInKSlcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIC5nZXQoICk7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIC8vIOeUqOaIt+S/oeaBr1xuICAgICAgICAgICAgY29uc3QgdXNlcnMkID0gYXdhaXQgUHJvbWlzZS5hbGwoXG4gICAgICAgICAgICAgICAgQXJyYXkuZnJvbSggXG4gICAgICAgICAgICAgICAgICAgIG5ldyBTZXQoIG9yZGVycyQuZGF0YVxuICAgICAgICAgICAgICAgICAgICAgICAgLm1hcCggeCA9PiB4Lm9wZW5pZCApXG4gICAgICAgICAgICAgICAgKSlcbiAgICAgICAgICAgICAgICAubWFwKCB1aWQgPT4gZGIuY29sbGVjdGlvbigndXNlcicpXG4gICAgICAgICAgICAgICAgICAgIC53aGVyZSh7XG4gICAgICAgICAgICAgICAgICAgICAgICBvcGVuaWQ6IHVpZFxuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAuZ2V0KCApKVxuICAgICAgICAgICAgKTtcblxuICAgICAgICAgICAgLy8g5b+r6YCS6LS555So5L+h5oGvXG4gICAgICAgICAgICBjb25zdCBkZWxpdmVyZmVlcyQgPSBhd2FpdCBQcm9taXNlLmFsbChcbiAgICAgICAgICAgICAgICBBcnJheS5mcm9tKCBcbiAgICAgICAgICAgICAgICAgICAgbmV3IFNldCggb3JkZXJzJC5kYXRhXG4gICAgICAgICAgICAgICAgICAgICAgICAubWFwKCB4ID0+IHgub3BlbmlkIClcbiAgICAgICAgICAgICAgICApKVxuICAgICAgICAgICAgICAgIC5tYXAoIHVpZCA9PiBkYi5jb2xsZWN0aW9uKCdkZWxpdmVyLWZlZScpXG4gICAgICAgICAgICAgICAgICAgIC53aGVyZSh7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aWQsXG4gICAgICAgICAgICAgICAgICAgICAgICBvcGVuaWQ6IHVpZFxuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAuZ2V0KCApKVxuICAgICAgICAgICAgKTtcblxuICAgICAgICAgICAgLy8g5Zyw5Z2A5L+h5oGvXG4gICAgICAgICAgICBsZXQgYWRkcmVzcyQ6IGFueSA9IFsgXTtcbiAgICAgICAgICAgIGlmICggISFuZWVkQWRkcmVzcyB8fCBuZWVkQWRkcmVzcyA9PT0gdW5kZWZpbmVkICkge1xuICAgICAgICAgICAgICAgIGFkZHJlc3MkID0gYXdhaXQgUHJvbWlzZS5hbGwoXG4gICAgICAgICAgICAgICAgICAgIEFycmF5LmZyb20oXG4gICAgICAgICAgICAgICAgICAgICAgICBuZXcgU2V0KCBvcmRlcnMkLmRhdGFcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAubWFwKCB4ID0+IHguYWlkIClcbiAgICAgICAgICAgICAgICAgICAgKSlcbiAgICAgICAgICAgICAgICAgICAgLm1hcCggYWlkID0+IGRiLmNvbGxlY3Rpb24oJ2FkZHJlc3MnKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAuZG9jKCBhaWQgKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAuZ2V0KCApKVxuICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIC8vIOWNoeWIuOS/oeaBr1xuICAgICAgICAgICAgbGV0IGNvdXBvbnMkOiBhbnkgPSBbIF07XG4gICAgICAgICAgICBpZiAoICEhbmVlZENvdXBvbnMgfHwgbmVlZENvdXBvbnMgPT09IHVuZGVmaW5lZCApIHtcbiAgICAgICAgICAgICAgICBjb3Vwb25zJCA9IGF3YWl0IFByb21pc2UuYWxsKFxuICAgICAgICAgICAgICAgICAgICBBcnJheS5mcm9tKFxuICAgICAgICAgICAgICAgICAgICAgICAgbmV3IFNldCggb3JkZXJzJC5kYXRhIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5tYXAoIHggPT4geC5vcGVuaWQgKVxuICAgICAgICAgICAgICAgICAgICApKVxuICAgICAgICAgICAgICAgICAgICAubWFwKCBvcGVuaWQgPT4gZGIuY29sbGVjdGlvbignY291cG9uJylcbiAgICAgICAgICAgICAgICAgICAgICAgIC53aGVyZSggXy5vcihbXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aWQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9wZW5pZCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogXy5vciggXy5lcSgndF9tYW5qaWFuJyksIF8uZXEoJ3RfbGlqaWFuJykpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvcGVuaWQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlzVXNlZDogZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhblVzZUluTmV4dDogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogJ3RfZGFpamluJ1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIF0pKVxuICAgICAgICAgICAgICAgICAgICAgICAgLmdldCggKVxuICAgICAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIFxuICAgICAgICAgICAgY29uc3QgdXNlck9kZXJzID0gdXNlcnMkLm1hcCgoIHVzZXIkLCBrICkgPT4ge1xuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIGNvbnN0IHVzZXIgPSB1c2VyJC5kYXRhWyAwIF07XG5cbiAgICAgICAgICAgICAgICBjb25zdCBvcmRlcnMgPSBvcmRlcnMkLmRhdGFcbiAgICAgICAgICAgICAgICAgICAgLmZpbHRlciggeCA9PiB4Lm9wZW5pZCA9PT0gdXNlci5vcGVuaWQgKTtcblxuICAgICAgICAgICAgICAgIGNvbnN0IGFkZHJlc3MgPSBhZGRyZXNzJC5sZW5ndGggPiAwID9cbiAgICAgICAgICAgICAgICAgICAgYWRkcmVzcyRcbiAgICAgICAgICAgICAgICAgICAgICAgIC5tYXAoIHggPT4geC5kYXRhIClcbiAgICAgICAgICAgICAgICAgICAgICAgIC5maWx0ZXIoIHggPT4geC5vcGVuaWQgPT09IHVzZXIub3BlbmlkICkgOlxuICAgICAgICAgICAgICAgICAgICB1bmRlZmluZWQ7XG5cbiAgICAgICAgICAgICAgICBjb25zdCBjb3Vwb25zID0gY291cG9ucyQubGVuZ3RoID4gMCA/XG4gICAgICAgICAgICAgICAgICAgIGNvdXBvbnMkXG4gICAgICAgICAgICAgICAgICAgICAgICAubWFwKCB4ID0+IHguZGF0YSApXG4gICAgICAgICAgICAgICAgICAgICAgICAuZmlsdGVyKCB4ID0+IHgubGVuZ3RoID4gMCAmJiB4WyAwIF0ub3BlbmlkID09PSB1c2VyLm9wZW5pZCApIDpcbiAgICAgICAgICAgICAgICAgICAgdW5kZWZpbmVkO1xuXG4gICAgICAgICAgICAgICAgY29uc3QgZGVsaXZlckZlZSA9IGRlbGl2ZXJmZWVzJFsgayBdLmRhdGFbIDAgXSB8fCBudWxsXG5cbiAgICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgICAgICB1c2VyLFxuICAgICAgICAgICAgICAgICAgICBvcmRlcnMsXG4gICAgICAgICAgICAgICAgICAgIGFkZHJlc3MsXG4gICAgICAgICAgICAgICAgICAgIGRlbGl2ZXJGZWUsXG4gICAgICAgICAgICAgICAgICAgIGNvdXBvbnM6ICghIWNvdXBvbnMgJiYgY291cG9ucy5sZW5ndGggPiAwICkgPyBjb3Vwb25zWyAwIF0gOiBbIF1cbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHJldHVybiBjdHguYm9keSA9IHtcbiAgICAgICAgICAgICAgICBzdGF0dXM6IDIwMCxcbiAgICAgICAgICAgICAgICBkYXRhOiB1c2VyT2RlcnNcbiAgICAgICAgICAgIH1cblxuICAgICAgICB9IGNhdGNoICggZSApIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCAnLi4uJywgZSApO1xuICAgICAgICAgICAgcmV0dXJuIGN0eC5ib2R5ID0geyBzdGF0dXM6IDUwMCB9O1xuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICAvKipcbiAgICAgKiBAZGVzY3JpcHRpb25cbiAgICAgKiDku47muIXluJDlgqzmrL7vvIzosIPmlbTorqLljZXliIbphY3ph49cbiAgICAgKiB7XG4gICAgICogICAgICBvaWQsIHRpZCwgc2lkLCBwaWQsIGNvdW50XG4gICAgICogfVxuICAgICAqL1xuICAgIGFwcC5yb3V0ZXIoJ2FkanVzdC1jb3VudCcsIGFzeW5jKCBjdHgsIG5leHQgKSA9PiB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBjb25zdCBvcGVuaWQgPSBldmVudC5kYXRhLm9wZW5JZCB8fCBldmVudC51c2VySW5mby5vcGVuSWQ7IFxuICAgICAgICAgICAgY29uc3QgeyBvaWQsIHRpZCwgc2lkLCBwaWQsIGNvdW50IH0gPSBldmVudC5kYXRhO1xuXG4gICAgICAgICAgICBjb25zdCBnZXRXcm9uZyA9IG1lc3NhZ2UgPT4gY3R4LmJvZHkgPSB7XG4gICAgICAgICAgICAgICAgbWVzc2FnZSxcbiAgICAgICAgICAgICAgICBzdGF0dXM6IDQwMFxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIOaYr+WQpuiDvee7p+e7reiwg+aVtFxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICBjb25zdCBvcmRlciQgPSBhd2FpdCBkYi5jb2xsZWN0aW9uKCdvcmRlcicpXG4gICAgICAgICAgICAgICAgLmRvYyggb2lkIClcbiAgICAgICAgICAgICAgICAuZ2V0KCApO1xuXG4gICAgICAgICAgICBpZiAoIG9yZGVyJC5kYXRhLmJhc2Vfc3RhdHVzID09PSAnMicgKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGdldFdyb25nKCflgqzmrL7lkI7kuI3og73kv67mlLnmlbDph48nKTtcblxuICAgICAgICAgICAgfSBlbHNlIGlmICggb3JkZXIkLmRhdGEuYmFzZV9zdGF0dXMgPT09ICcwJyApIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZ2V0V3JvbmcoJ+ivt+WFiOiwg+aVtOivpeWVhuWTgeS7t+agvCcpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIOS4jeiDveWkmuS6jua4heWNleWIhumFjeeahOaAu+i0reWFpemHj1xuICAgICAgICAgICAgICovXG4gICAgICAgICAgICBjb25zdCBzaG9wcGluZyQgPSBhd2FpdCBkYi5jb2xsZWN0aW9uKCdzaG9wcGluZy1saXN0JylcbiAgICAgICAgICAgICAgICAud2hlcmUoe1xuICAgICAgICAgICAgICAgICAgICB0aWQsIHNpZCwgcGlkXG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAuZ2V0KCApO1xuICAgICAgICAgICAgY29uc3Qgc2hvcHBpbmcgPSBzaG9wcGluZyQuZGF0YVsgMCBdO1xuICAgICAgICAgICAgY29uc3QgbGFzdE9yZGVycyQgPSBhd2FpdCBkYi5jb2xsZWN0aW9uKCdvcmRlcicpXG4gICAgICAgICAgICAgICAgLndoZXJlKHtcbiAgICAgICAgICAgICAgICAgICAgdGlkLCBzaWQsIHBpZCxcbiAgICAgICAgICAgICAgICAgICAgcGF5X3N0YXR1czogXy5uZXEoJzAnKSxcbiAgICAgICAgICAgICAgICAgICAgYmFzZV9zdGF0dXM6IF8ub3IoIF8uZXEoJzEnKSwgXy5lcSgnMicpLCBfLmVxKCczJykpXG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAuZ2V0KCApO1xuXG4gICAgICAgICAgICBjb25zdCBsYXN0T3JkZXJzID0gbGFzdE9yZGVycyQuZGF0YTtcbiAgICAgICAgICAgIGNvbnN0IG90aGVyQ291bnQ6IGFueSA9IGxhc3RPcmRlcnNcbiAgICAgICAgICAgICAgICAuZmlsdGVyKCBvID0+IG8uX2lkICE9PSBvaWQgKVxuICAgICAgICAgICAgICAgIC5yZWR1Y2UoKCB4LCB5ICkgPT4ge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4geCArIHkuYWxsb2NhdGVkQ291bnQgfHwgMFxuICAgICAgICAgICAgICAgIH0sIDAgKTtcblxuICAgICAgICAgICAgaWYgKCBjb3VudCArIG90aGVyQ291bnQgPiBzaG9wcGluZy5wdXJjaGFzZSApIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZ2V0V3JvbmcoYOivpeWVhuWTgeaAu+aVsOmHj+S4jeiDveWkp+S6jumHh+i0reaVsCR7c2hvcHBpbmcucHVyY2hhc2V95Lu277yBYCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8qKiDmm7TmlrDorqLljZUgKi9cbiAgICAgICAgICAgIGF3YWl0IGRiLmNvbGxlY3Rpb24oJ29yZGVyJylcbiAgICAgICAgICAgICAgICAuZG9jKCBvaWQgKVxuICAgICAgICAgICAgICAgIC51cGRhdGUoe1xuICAgICAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBhbGxvY2F0ZWRDb3VudDogY291bnRcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIOabtOaWsOa4heWNlVxuICAgICAgICAgICAgICog5bCR5LqO5oC76LSt5YWl6YeP5pe277yM6YeN5paw6LCD5pW05riF5Y2V55qE5Ymp5L2Z5YiG6YWN6YePXG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIGlmICggY291bnQgKyBvdGhlckNvdW50IDwgc2hvcHBpbmcucHVyY2hhc2UgKSB7XG5cbiAgICAgICAgICAgICAgICBjb25zdCBuZXdzaG9wcGluZyA9IE9iamVjdC5hc3NpZ24oeyB9LCBzaG9wcGluZywge1xuICAgICAgICAgICAgICAgICAgICBsYXN0QWxsb2NhdGVkOiBzaG9wcGluZy5wdXJjaGFzZSAtICggY291bnQgKyBvdGhlckNvdW50IClcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICBkZWxldGUgbmV3c2hvcHBpbmdbJ19pZCddO1xuXG4gICAgICAgICAgICAgICAgYXdhaXQgZGIuY29sbGVjdGlvbignc2hvcHBpbmctbGlzdCcpXG4gICAgICAgICAgICAgICAgICAgIC5kb2MoIFN0cmluZyggc2hvcHBpbmcuX2lkICkpXG4gICAgICAgICAgICAgICAgICAgIC5zZXQoe1xuICAgICAgICAgICAgICAgICAgICAgICAgZGF0YTogbmV3c2hvcHBpbmdcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiBjdHguYm9keSA9IHtcbiAgICAgICAgICAgICAgICBzdGF0dXM6IDIwMFxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgXG4gICAgICAgIH0gY2F0Y2ggKCBlICkge1xuICAgICAgICAgICAgcmV0dXJuIGN0eC5ib2R5ID0geyBzdGF0dXM6IDUwMCB9XG4gICAgICAgIH1cbiAgICB9KVxuXG4gICAgLyoqXG4gICAgICogQGRlc2NyaXB0aW9uXG4gICAgICog5om56YeP5Zyw77ya56Gu6K6k5a6i5oi36K6i5Y2V44CB5piv5ZCm5Zui6LSt44CB5raI5oGv5o6o6YCB5pON5L2cXG4gICAgICoge1xuICAgICAqICAgIHRpZCxcbiAgICAgKiAgICBvcmRlcnM6IHtcbiAgICAgKiAgICAgICAgb2lkXG4gICAgICogICAgICAgIHBpZFxuICAgICAqICAgICAgICBzaWRcbiAgICAgKiAgICAgICAgb3BlbmlkXG4gICAgICogICAgICAgIHByZXBheV9pZFxuICAgICAqICAgICAgICBmb3JtX2lkXG4gICAgICogICAgICAgIGFsbG9jYXRlZENvdW50XG4gICAgICogICAgICAgIGFsbG9jYXRlZEdyb3VwUHJpY2VcbiAgICAgKiAgICB9WyBdXG4gICAgICogICAgbm90aWZpY2F0aW9uOiB7IFxuICAgICAqICAgICAgIHRpdGxlLFxuICAgICAqICAgICAgIGRlc2MsXG4gICAgICogICAgICAgdGltZVxuICAgICAqICAgIH1cbiAgICAgKiB9XG4gICAgICovXG4gICAgYXBwLnJvdXRlcignYmF0Y2gtYWRqdXN0JywgYXN5bmMoIGN0eCwgbmV4dCApID0+IHtcbiAgICAgICAgdHJ5IHtcblxuICAgICAgICAgICAgLyoqIOaYr+WQpuiDveaLvOWboiAqL1xuICAgICAgICAgICAgbGV0IGNhbkdyb3VwVXNlck1hcENvdW50OiB7XG4gICAgICAgICAgICAgICAgWyBrOiBzdHJpbmcgXSA6IG51bWJlclxuICAgICAgICAgICAgfSA9IHsgfTtcblxuICAgICAgICAgICAgY29uc3QgeyB0aWQsIG9yZGVycywgbm90aWZpY2F0aW9uIH0gPSBldmVudC5kYXRhO1xuICAgICAgICAgICAgY29uc3QgZ2V0V3JvbmcgPSBtZXNzYWdlID0+IGN0eC5ib2R5ID0ge1xuICAgICAgICAgICAgICAgIG1lc3NhZ2UsXG4gICAgICAgICAgICAgICAgc3RhdHVzOiA0MDBcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIGNvbnN0IHRyaXAkID0gYXdhaXQgZGIuY29sbGVjdGlvbigndHJpcCcpXG4gICAgICAgICAgICAgICAgLmRvYyggdGlkIClcbiAgICAgICAgICAgICAgICAuZ2V0KCApO1xuICAgICAgICAgICAgY29uc3QgdHJpcCA9IHRyaXAkLmRhdGE7XG5cbiAgICAgICAgICAgIC8vIOacque7k+adn++8jOS4lOacquaJi+WKqOWFs+mXrVxuICAgICAgICAgICAgaWYgKCBnZXROb3coIHRydWUgKSA8IHRyaXAuZW5kX2RhdGUgJiYgIXRyaXAuaXNDbG9zZWQgKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGdldFdyb25nKCfooYznqIvmnKrnu5PmnZ/vvIzor7fmiYvliqjlhbPpl63lvZPliY3ooYznqIsnKTtcblxuICAgICAgICAgICAgfSBlbHNlIGlmICggdHJpcC5jYWxsTW9uZXlUaW1lcyAmJiAgdHJpcC5jYWxsTW9uZXlUaW1lcyA+PSAzICkge1xuICAgICAgICAgICAgICAgIHJldHVybiBnZXRXcm9uZyhg5bey57uP5Y+R6LW36L+HJHt0cmlwLmNhbGxNb25leVRpbWVzfeasoeWCrOasvmApO1xuXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIOabtOaWsOiuouWNlVxuICAgICAgICAgICAgYXdhaXQgUHJvbWlzZS5hbGwoIG9yZGVycy5tYXAoIG9yZGVyID0+IHtcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAvLyDmnInlm6LotK3ku7fjgIHlpKfkuo4y5Lq66LSt5Lmw77yM5LiU6KKr5YiG6YWN5pWw5Z2H5aSn5LqOMO+8jOivpeiuouWNleaJjei+vuWIsOKAnOWboui0reKAneeahOadoeS7tlxuICAgICAgICAgICAgICAgIGNvbnN0IGNhbkdyb3VwID0gISFvcmRlcnMuZmluZCggbyA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBvLm9pZCAhPT0gb3JkZXIub2lkICYmXG4gICAgICAgICAgICAgICAgICAgICAgICBvLm9wZW5pZCAhPT0gb3JkZXIub3BlbmlkICYmIFxuICAgICAgICAgICAgICAgICAgICAgICAgby5waWQgPT09IG9yZGVyLnBpZCAmJiBvLnNpZCA9PT0gb3JkZXIuc2lkICYmXG4gICAgICAgICAgICAgICAgICAgICAgICBvLmFsbG9jYXRlZENvdW50ID4gMCAmJiBvcmRlci5hbGxvY2F0ZWRDb3VudCA+IDAgJiZcbiAgICAgICAgICAgICAgICAgICAgICAgICEhby5hbGxvY2F0ZWRHcm91cFByaWNlXG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICBpZiAoIGNhbkdyb3VwICkge1xuICAgICAgICAgICAgICAgICAgICBjYW5Hcm91cFVzZXJNYXBDb3VudCA9IE9iamVjdC5hc3NpZ24oeyB9LCBjYW5Hcm91cFVzZXJNYXBDb3VudCwge1xuICAgICAgICAgICAgICAgICAgICAgICAgWyBvcmRlci5vcGVuaWQgXTogY2FuR3JvdXBVc2VyTWFwQ291bnRbIG9yZGVyLm9wZW5pZCBdID09PSB1bmRlZmluZWQgPyAxIDogY2FuR3JvdXBVc2VyTWFwQ291bnRbIG9yZGVyLm9wZW5pZCBdICsgMVxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gZGIuY29sbGVjdGlvbignb3JkZXInKVxuICAgICAgICAgICAgICAgICAgICAuZG9jKCBvcmRlci5vaWQgKVxuICAgICAgICAgICAgICAgICAgICAudXBkYXRlKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYW5Hcm91cCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBiYXNlX3N0YXR1czogJzInXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICB9KSk7XG5cbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogIeabtOaWsOi0reeJqea4heWNlVxuICAgICAgICAgICAgICovXG5cbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICog5raI5oGv5o6o6YCBXG4gICAgICAgICAgICAgKiAh5pyq5LuY5YWo5qy+5omN5Y+R6YCBXG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIGNvbnN0IHVzZXJzID0gQXJyYXkuZnJvbShcbiAgICAgICAgICAgICAgICBuZXcgU2V0KFxuICAgICAgICAgICAgICAgICAgICBvcmRlcnNcbiAgICAgICAgICAgICAgICAgICAgICAgIC5tYXAoIG9yZGVyID0+IG9yZGVyLm9wZW5pZCApXG4gICAgICAgICAgICAgICAgICAgICAgICAuZmlsdGVyKCBvcGVuaWQgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiAhIW9yZGVycy5maW5kKCBvcmRlciA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBvcmRlci5vcGVuaWQgPT09IG9wZW5pZCAmJiBTdHJpbmcoIG9yZGVyLnBheV9zdGF0dXMgKSA9PT0gJzEnXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICk7XG5cbiAgICAgICAgICAgIC8qKiDmjqjpgIHpgJrnn6UgKi9cbiAgICAgICAgICAgIGNvbnN0IHJzID0gYXdhaXQgUHJvbWlzZS5hbGwoIHVzZXJzLm1hcCggb3BlbmlkID0+IHtcblxuICAgICAgICAgICAgICAgIGNvbnN0IHRhcmdldCA9IG9yZGVycy5maW5kKCBvcmRlciA9PiBvcmRlci5vcGVuaWQgPT09IG9wZW5pZCAmJlxuICAgICAgICAgICAgICAgICAgICAoISFvcmRlci5wcmVwYXlfaWQgfHwgISFvcmRlci5mb3JtX2lkICkpO1xuXG4gICAgICAgICAgICAgICAgLy8gcmV0dXJuIGNsb3VkLmNhbGxGdW5jdGlvbih7XG4gICAgICAgICAgICAgICAgLy8gICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAvLyAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAvLyAgICAgICAgICAgICB0b3VzZXI6IG9wZW5pZCxcbiAgICAgICAgICAgICAgICAvLyAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgLy8gICAgICAgICAgICAgICAgIHRpdGxlOiBjYW5Hcm91cFVzZXJNYXBDb3VudFsgU3RyaW5nKCBvcGVuaWQgKV0gP1xuICAgICAgICAgICAgICAgIC8vICAgICAgICAgICAgICAgICAgICAgLy8gYOaLvOWboiR7IGNhbkdyb3VwVXNlck1hcENvdW50WyBTdHJpbmcoIG9wZW5pZCApXX3ku7bvvIHmgqjotK3kubDnmoTllYblk4Hlt7LliLDotKdgIDpcbiAgICAgICAgICAgICAgICAvLyAgICAgICAgICAgICAgICAgICAgIC8vICfmgqjotK3kubDnmoTllYblk4Hlt7LliLDotKcnLFxuICAgICAgICAgICAgICAgIC8vICAgICAgICAgICAgICAgICAgICAgJ+WIsOi0p+WVpu+8geS7mOWwvuasvu+8jOeri+WNs+WPkei0pycgOiBcbiAgICAgICAgICAgICAgICAvLyAgICAgICAgICAgICAgICAgICAgICfliLDotKfllabvvIHku5jlsL7mrL7vvIznq4vljbPlj5HotKcnLFxuICAgICAgICAgICAgICAgIC8vICAgICAgICAgICAgICAgICB0aW1lOiBgW+ihjOeoi10ke3RyaXAudGl0bGV9YFxuICAgICAgICAgICAgICAgIC8vICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgLy8gICAgICAgICAgICAgZm9ybV9pZDogdGFyZ2V0LnByZXBheV9pZCB8fCB0YXJnZXQuZm9ybV9pZFxuICAgICAgICAgICAgICAgIC8vICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAvLyAgICAgICAgICR1cmw6ICdub3RpZmljYXRpb24tZ2V0bW9uZXknXG4gICAgICAgICAgICAgICAgLy8gICAgIH0sXG4gICAgICAgICAgICAgICAgLy8gICAgIG5hbWU6ICdjb21tb24nXG4gICAgICAgICAgICAgICAgLy8gfSk7XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gY2xvdWQuY2FsbEZ1bmN0aW9uKHtcbiAgICAgICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9wZW5pZCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiAnZ2V0TW9uZXknLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHByZXBheV9pZDogdGFyZ2V0LnByZXBheV9pZCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZXh0czogWyfmlK/ku5jlsL7mrL7vvIznq4vljbPlj5HotKflk6YnLCfotorlv6votorlpb0nXVxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICR1cmw6ICdwdXNoLXRlbXBsYXRlJ1xuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICBuYW1lOiAnY29tbW9uJ1xuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICB9KSk7XG4gXG4gICAgICAgICAgICAvLyDmm7TmlrDooYznqItcbiAgICAgICAgICAgIGF3YWl0IGRiLmNvbGxlY3Rpb24oJ3RyaXAnKVxuICAgICAgICAgICAgICAgIC5kb2MoIHRpZCApXG4gICAgICAgICAgICAgICAgLnVwZGF0ZSh7XG4gICAgICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhbGxNb25leVRpbWVzOiBfLmluYyggMSApXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgcmV0dXJuIGN0eC5ib2R5ID0ge1xuICAgICAgICAgICAgICAgIHN0YXR1czogMjAwLFxuICAgICAgICAgICAgICAgIC8vIOWJqeS9measoeaVsFxuICAgICAgICAgICAgICAgIGRhdGE6IDMgLSAoIDEgKyB0cmlwLmNhbGxNb25leVRpbWVzIClcbiAgICAgICAgICAgIH1cblxuICAgICAgICB9IGNhdGNoICggZSApIHtcbiAgICAgICAgICAgIHJldHVybiBjdHguYm9keSA9IHsgc3RhdHVzOiA1MDAgfTtcbiAgICAgICAgfVxuICAgIH0pXG5cbiAgICAvKiogXG4gICAgICogQGRlc2NyaXB0aW9uXG4gICAgICog6K6i5Y2V5LuY5bC+5qy+XG4gICAgICoge1xuICAgICAqICAgICAgdGlkIC8vIOmihuS7o+mHkeWIuFxuICAgICAqICAgICAgaW50ZWdyYWwgLy8g56ev5YiG5oC76aKd77yIdXNlcuihqO+8iVxuICAgICAqICAgICAgb3JkZXJzOiBbeyAgXG4gICAgICogICAgICAgICAgb2lkIC8vIOiuouWNleeKtuaAgVxuICAgICAqICAgICAgICAgIHBpZFxuICAgICAqICAgICAgICAgIGZpbmFsX3ByaWNlIC8vIOacgOe7iOaIkOS6pOminVxuICAgICAqICAgICAgICAgIGFsbG9jYXRlZENvdW50IC8vIOacgOe7iOaIkOS6pOmHj1xuICAgICAqICAgICAgfV1cbiAgICAgKiAgICAgIGNvdXBvbnM6IFsgLy8g5Y2h5Yi45raI6LS5XG4gICAgICogICAgICAgICAgaWQxLFxuICAgICAqICAgICAgICAgIGlkMi4uLlxuICAgICAqICAgICAgXVxuICAgICAqIH1cbiAgICAgKi9cbiAgICBhcHAucm91dGVyKCdwYXktbGFzdCcsIGFzeW5jKCBjdHgsIG5leHQgKSA9PiB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBjb25zdCBvcGVuaWQgPSBldmVudC51c2VySW5mby5vcGVuSWQ7XG4gICAgICAgICAgICBjb25zdCB7IHRpZCwgaW50ZWdyYWwsIG9yZGVycywgY291cG9ucyB9ID0gZXZlbnQuZGF0YTtcblxuICAgICAgICAgICAgY29uc3QgdXNlciQgPSBhd2FpdCBkYi5jb2xsZWN0aW9uKCd1c2VyJylcbiAgICAgICAgICAgICAgICAud2hlcmUoe1xuICAgICAgICAgICAgICAgICAgICBvcGVuaWRcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIC5nZXQoICk7XG5cbiAgICAgICAgICAgIC8vIOWinuWKoOenr+WIhuaAu+minVxuICAgICAgICAgICAgYXdhaXQgZGIuY29sbGVjdGlvbigndXNlcicpXG4gICAgICAgICAgICAgICAgLmRvYyggU3RyaW5nKCB1c2VyJC5kYXRhWyAwIF0uX2lkICkpXG4gICAgICAgICAgICAgICAgLnVwZGF0ZSh7XG4gICAgICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGludGVncmFsOiBfLmluYyggaW50ZWdyYWwgKVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIC8vIOabtOaWsOiuouWNleeKtuaAgeOAgeWVhuWTgemUgOmHj1xuICAgICAgICAgICAgYXdhaXQgUHJvbWlzZS5hbGwoIG9yZGVycy5tYXAoIG9yZGVyID0+IHtcbiAgICAgICAgICAgICAgICByZXR1cm4gUHJvbWlzZS5hbGwoW1xuICAgICAgICAgICAgICAgICAgICBkYi5jb2xsZWN0aW9uKCdvcmRlcicpXG4gICAgICAgICAgICAgICAgICAgICAgICAuZG9jKCBvcmRlci5vaWQgKVxuICAgICAgICAgICAgICAgICAgICAgICAgLnVwZGF0ZSh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBiYXNlX3N0YXR1czogJzMnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXlfc3RhdHVzOiAnMicsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZpbmFsX3ByaWNlOiBvcmRlci5maW5hbF9wcmljZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGF5dGltZTogZ2V0Tm93KCB0cnVlIClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9KSxcbiAgICAgICAgICAgICAgICAgICAgZGIuY29sbGVjdGlvbignZ29vZHMnKVxuICAgICAgICAgICAgICAgICAgICAgICAgLmRvYyggb3JkZXIucGlkIClcbiAgICAgICAgICAgICAgICAgICAgICAgIC51cGRhdGUoe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2FsZWQ6IF8uaW5jKCBvcmRlci5hbGxvY2F0ZWRDb3VudCApXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICBdKVxuICAgICAgICAgICAgfSkpO1xuXG4gICAgICAgICAgICAvLyDmm7TmlrDljaHliLjkvb/nlKjnirbmgIFcbiAgICAgICAgICAgIGF3YWl0IFByb21pc2UuYWxsKCBjb3Vwb25zLm1hcCggY291cG9uaWQgPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiBkYi5jb2xsZWN0aW9uKCdjb3Vwb24nKVxuICAgICAgICAgICAgICAgICAgICAuZG9jKCBjb3Vwb25pZCApXG4gICAgICAgICAgICAgICAgICAgIC51cGRhdGUoe1xuICAgICAgICAgICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlzVXNlZDogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB1c2VkQnk6IHRpZCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYW5Vc2VJbk5leHQ6IGZhbHNlXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICB9KSk7XG5cbiAgICAgICAgICAgIC8vIOi+vuWIsOadoeS7tu+8jOWImemihuWPluS7o+mHkeWIuFxuICAgICAgICAgICAgLy8g5ZCM5pe25Yig6Zmk5LiK5LiA5Liq5pyq5L2/55So6L+H55qE5Luj6YeR5Yi4XG4gICAgICAgICAgICBjb25zdCB0cmlwJCA9IGF3YWl0IGRiLmNvbGxlY3Rpb24oJ3RyaXAnKVxuICAgICAgICAgICAgICAgIC5kb2MoIHRpZCApXG4gICAgICAgICAgICAgICAgLmdldCggKTtcblxuICAgICAgICAgICAgbGV0IHJlcSA9IHtcbiAgICAgICAgICAgICAgICByZXN1bHQ6IHtcbiAgICAgICAgICAgICAgICAgICAgc3RhdHVzOiA1MDBcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGNvbnN0IHsgY2FzaGNvdXBvbl9hdGxlYXN0LCBjYXNoY291cG9uX3ZhbHVlcyB9ID0gdHJpcCQuZGF0YTtcblxuICAgICAgICAgICAgY29uc3QgdGVtcCA9IHtcbiAgICAgICAgICAgICAgICBvcGVuSWQ6IG9wZW5pZCxcbiAgICAgICAgICAgICAgICBmcm9tdGlkOiB0aWQsXG4gICAgICAgICAgICAgICAgdHlwZTogJ3RfZGFpamluJyxcbiAgICAgICAgICAgICAgICB0aXRsZTogJ+ihjOeoi+S7o+mHkeWIuCcsXG4gICAgICAgICAgICAgICAgY2FuVXNlSW5OZXh0OiB0cnVlLFxuICAgICAgICAgICAgICAgIGlzVXNlZDogZmFsc2UsXG4gICAgICAgICAgICAgICAgYXRsZWFzdDogY2FzaGNvdXBvbl9hdGxlYXN0IHx8IDAsXG4gICAgICAgICAgICAgICAgdmFsdWU6IGNhc2hjb3Vwb25fdmFsdWVzXG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAvLyDml6DpnIDpl6jmp5vvvIzmnInku6Pph5HliLjljbPlj6/pooblj5ZcbiAgICAgICAgICAgIGlmICggISFjYXNoY291cG9uX3ZhbHVlcyApIHtcblxuICAgICAgICAgICAgICAgIC8vIOWIoOmZpOS4iuS4gOS4quacquS9v+eUqOeahOS7o+mHkeWIuFxuICAgICAgICAgICAgICAgIGNvbnN0IGxhc3REYWlqaW4kID0gYXdhaXQgZGIuY29sbGVjdGlvbignY291cG9uJylcbiAgICAgICAgICAgICAgICAgICAgLndoZXJlKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6ICd0X2RhaWppbicsXG4gICAgICAgICAgICAgICAgICAgICAgICBpc1VzZWQ6IGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICAgICAgY2FuVXNlSW5OZXh0OiB0cnVlXG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgIC5nZXQoICk7XG5cbiAgICAgICAgICAgICAgICBpZiAoIGxhc3REYWlqaW4kLmRhdGFbIDAgXSkge1xuICAgICAgICAgICAgICAgICAgICBhd2FpdCBkYi5jb2xsZWN0aW9uKCdjb3Vwb24nKVxuICAgICAgICAgICAgICAgICAgICAgICAgLmRvYyggU3RyaW5nKCBsYXN0RGFpamluJC5kYXRhWyAwIF0uX2lkICkpXG4gICAgICAgICAgICAgICAgICAgICAgICAucmVtb3ZlKCApO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIC8vIOmihuWPluS7o+mHkeWIuFxuICAgICAgICAgICAgICAgIHJlcSA9IGF3YWl0IGNsb3VkLmNhbGxGdW5jdGlvbih7XG4gICAgICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRhdGE6IHRlbXAsXG4gICAgICAgICAgICAgICAgICAgICAgICAkdXJsOiAnY3JlYXRlJ1xuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICBuYW1lOiAnY291cG9uJ1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gY3R4LmJvZHkgPSB7XG4gICAgICAgICAgICAgICAgc3RhdHVzOiAyMDAsXG4gICAgICAgICAgICAgICAgZGF0YTogcmVxLnJlc3VsdC5zdGF0dXMgPT09IDIwMCA/IHRlbXAgOiBudWxsIFxuICAgICAgICAgICAgfVxuXG4gICAgICAgIH0gY2F0Y2ggKCBlICkge1xuICAgICAgICAgICAgcmV0dXJuIGN0eC5ib2R5ID0geyBzdGF0dXM6IDUwMCB9XG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgIC8qKiBcbiAgICAgKiBAZGVzY3JpcHRpb25cbiAgICAgKiDku6PotK3ojrflj5bmnKror7vorqLljZVcbiAgICAgKi9cbiAgICBhcHAucm91dGVyKCd1bnJlYWQnLCBhc3luYyggY3R4LCBuZXh0ICkgPT4ge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgY29uc3QgeyB0aWQsIGxhc3RUaW1lIH0gPSBldmVudC5kYXRhO1xuICAgICAgICAgICAgbGV0IHdoZXJlJCA9IHtcbiAgICAgICAgICAgICAgICB0aWRcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIGlmICggbGFzdFRpbWUgKSB7XG4gICAgICAgICAgICAgICAgd2hlcmUkID0gT2JqZWN0LmFzc2lnbih7IH0sIHdoZXJlJCwge1xuICAgICAgICAgICAgICAgICAgICBjcmVhdGV0aW1lOiBfLmd0ZSggbGFzdFRpbWUgKVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBjb25zdCBkYXRhJCA9IGF3YWl0IGRiLmNvbGxlY3Rpb24oJ29yZGVyJylcbiAgICAgICAgICAgICAgICAud2hlcmUoIHdoZXJlJCApXG4gICAgICAgICAgICAgICAgLmNvdW50KCApO1xuXG4gICAgICAgICAgICByZXR1cm4gY3R4LmJvZHkgPSB7XG4gICAgICAgICAgICAgICAgc3RhdHVzOiAyMDAsXG4gICAgICAgICAgICAgICAgZGF0YTogZGF0YSQudG90YWxcbiAgICAgICAgICAgIH1cblxuICAgICAgICB9IGNhdGNoICggZSApIHsgcmV0dXJuIGN0eC5ib2R5ID0geyBzdGF0dXM6IDUwMCB9O31cbiAgICB9KTtcblxuICAgIC8qKiBcbiAgICAgKiBAZGVzY3JpcHRpb25cbiAgICAgKiDku6PotK3mn6XnnIvmiYDmnInnmoTorqLljZXliJfooahcbiAgICAgKi9cbiAgICBhcHAucm91dGVyKCdsaXN0LWFsbCcsIGFzeW5jKCBjdHgsIG5leHQgKSA9PiB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICAvLyDmn6Xor6LmnaHmlbBcbiAgICAgICAgICAgIGNvbnN0IGxpbWl0ID0gMTA7XG4gICAgICAgICAgICBjb25zdCB7IHRpZCwgcGFnZSB9ID0gZXZlbnQuZGF0YTtcblxuICAgICAgICAgICAgY29uc3Qgd2hlcmUkID0ge1xuICAgICAgICAgICAgICAgIHRpZCxcbiAgICAgICAgICAgICAgICBwYXlfc3RhdHVzOiBfLm5lcSgnMCcpXG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICBjb25zdCB0b3RhbCQgPSBhd2FpdCBkYi5jb2xsZWN0aW9uKCdvcmRlcicpXG4gICAgICAgICAgICAgICAgLndoZXJlKCB3aGVyZSQgKVxuICAgICAgICAgICAgICAgIC5jb3VudCggKTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgY29uc3Qgb3JkZXJzJCA9IGF3YWl0IGRiLmNvbGxlY3Rpb24oJ29yZGVyJylcbiAgICAgICAgICAgICAgICAud2hlcmUoIHdoZXJlJCApXG4gICAgICAgICAgICAgICAgLmxpbWl0KCBsaW1pdCApXG4gICAgICAgICAgICAgICAgLnNraXAoKCBwYWdlIC0gMSApICogbGltaXQgKVxuICAgICAgICAgICAgICAgIC5vcmRlckJ5KCdjcmVhdGVUaW1lJywgJ2Rlc2MnKVxuICAgICAgICAgICAgICAgIC5nZXQoICk7XG5cbiAgICAgICAgICAgIGNvbnN0IHBpZHMgPSBBcnJheS5mcm9tKFxuICAgICAgICAgICAgICAgIG5ldyBTZXQoIFxuICAgICAgICAgICAgICAgICAgICBvcmRlcnMkLmRhdGFcbiAgICAgICAgICAgICAgICAgICAgICAgIC5tYXAoIHggPT4geC5waWQgKVxuICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICk7XG5cbiAgICAgICAgICAgIGNvbnN0IHNpZHMgPSBBcnJheS5mcm9tKFxuICAgICAgICAgICAgICAgIG5ldyBTZXQoIFxuICAgICAgICAgICAgICAgICAgICBvcmRlcnMkLmRhdGFcbiAgICAgICAgICAgICAgICAgICAgICAgIC5tYXAoIHggPT4geC5zaWQgKVxuICAgICAgICAgICAgICAgICAgICAgICAgLmZpbHRlciggeCA9PiAhIXggKVxuICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICk7XG5cbiAgICAgICAgICAgIGNvbnN0IHVpZHMgPSBBcnJheS5mcm9tKFxuICAgICAgICAgICAgICAgIG5ldyBTZXQoIFxuICAgICAgICAgICAgICAgICAgICBvcmRlcnMkLmRhdGFcbiAgICAgICAgICAgICAgICAgICAgICAgIC5tYXAoIHggPT4geC5vcGVuaWQgKVxuICAgICAgICAgICAgICAgICAgICAgICAgLmZpbHRlciggeCA9PiAhIXggKVxuICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICk7XG5cbiAgICAgICAgICAgIC8vIGNvbnN0IGdvb2RzJCQgPSBhd2FpdCBQcm9taXNlLmFsbChcbiAgICAgICAgICAgIC8vICAgICBwaWRzLm1hcCggXG4gICAgICAgICAgICAvLyAgICAgICAgIHBpZCA9PiBkYi5jb2xsZWN0aW9uKCdnb29kcycpXG4gICAgICAgICAgICAvLyAgICAgICAgICAgICAuZG9jKCBTdHJpbmcoIHBpZCApKVxuICAgICAgICAgICAgLy8gICAgICAgICAgICAgLmdldCggKVxuICAgICAgICAgICAgLy8gICAgIClcbiAgICAgICAgICAgIC8vICk7XG4gICAgICAgICAgICAvLyBjb25zdCBnb29kcyQgPSBnb29kcyQkLm1hcCggeCA9PiB4LmRhdGEgKTtcblxuICAgICAgICAgICAgLy8gY29uc3Qgc3RhbmRhcnMkJCA9IGF3YWl0IFByb21pc2UuYWxsKFxuICAgICAgICAgICAgLy8gICAgIHNpZHMubWFwKCBcbiAgICAgICAgICAgIC8vICAgICAgICAgc2lkID0+IGRiLmNvbGxlY3Rpb24oJ3N0YW5kYXJkcycpXG4gICAgICAgICAgICAvLyAgICAgICAgICAgICAuZG9jKCBTdHJpbmcoIHNpZCApKVxuICAgICAgICAgICAgLy8gICAgICAgICAgICAgLmZpZWxkKHtcbiAgICAgICAgICAgIC8vICAgICAgICAgICAgICAgICBwaWQ6IHRydWUsXG4gICAgICAgICAgICAvLyAgICAgICAgICAgICAgICAgbmFtZTogdHJ1ZVxuICAgICAgICAgICAgLy8gICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC8vICAgICAgICAgICAgIC5nZXQoIClcbiAgICAgICAgICAgIC8vICAgICApXG4gICAgICAgICAgICAvLyApO1xuICAgICAgICAgICAgLy8gY29uc3Qgc3RhbmRhcnMkID0gc3RhbmRhcnMkJC5tYXAoIHggPT4geC5kYXRhICk7XG5cbiAgICAgICAgICAgIGNvbnN0IHVzZXJzJCQgPSBhd2FpdCBQcm9taXNlLmFsbChcbiAgICAgICAgICAgICAgICB1aWRzLm1hcCggXG4gICAgICAgICAgICAgICAgICAgIG9wZW5pZCA9PiBkYi5jb2xsZWN0aW9uKCd1c2VyJylcbiAgICAgICAgICAgICAgICAgICAgICAgIC53aGVyZSh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb3BlbmlkXG4gICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAgICAgLmZpZWxkKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvcGVuaWQ6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYXZhdGFyVXJsOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5pY2tOYW1lOiB0cnVlXG4gICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAgICAgLmdldCggKVxuICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICBjb25zdCB1c2VycyQgPSB1c2VycyQkLm1hcCggeCA9PiB4LmRhdGFbIDAgXSk7XG5cbiAgICAgICAgICAgIGNvbnN0IG1ldGEgPSBvcmRlcnMkLmRhdGEubWFwKCBvcmRlciA9PiB7XG5cbiAgICAgICAgICAgICAgICBjb25zdCB1c2VyID0gdXNlcnMkLmZpbmQoIHVzZXIgPT4gdXNlci5vcGVuaWQgPT09IG9yZGVyLm9wZW5pZCApO1xuICAgICAgICAgICAgICAgIC8vIGNvbnN0IGRldGFpbCA9IGdvb2RzJC5maW5kKCBnb29kID0+IGdvb2QuX2lkID09PSBvcmRlci5waWQgKTtcbiAgICAgICAgICAgICAgICAvLyBjb25zdCBzdGFuZGFyID0gc3RhbmRhcnMkLmZpbmQoIHMgPT4gcy5faWQgPT09IG9yZGVyLnNpZCApO1xuXG4gICAgICAgICAgICAgICAgcmV0dXJuIE9iamVjdC5hc3NpZ24oeyB9LCBvcmRlciwge1xuICAgICAgICAgICAgICAgICAgICB1c2VyLFxuICAgICAgICAgICAgICAgICAgICAvLyBkZXRhaWwsXG4gICAgICAgICAgICAgICAgICAgIC8vIHN0YW5kYXJcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHJldHVybiBjdHguYm9keSA9IHtcbiAgICAgICAgICAgICAgICBzdGF0dXM6IDIwMCxcbiAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICAgIHBhZ2UsXG4gICAgICAgICAgICAgICAgICAgIHBhZ2VTaXplOiBsaW1pdCxcbiAgICAgICAgICAgICAgICAgICAgZGF0YTogbWV0YSxcbiAgICAgICAgICAgICAgICAgICAgdG90YWw6IHRvdGFsJC50b3RhbCxcbiAgICAgICAgICAgICAgICAgICAgdG90YWxQYWdlOiBNYXRoLmNlaWwoIHRvdGFsJC50b3RhbCAvIGxpbWl0IClcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cblxuICAgICAgICB9IGNhdGNoICggZSApIHsgXG4gICAgICAgICAgICBjb25zb2xlLmxvZygnPz8/JywgZSApXG4gICAgICAgICAgICByZXR1cm4gY3R4LmJvZHkgPSB7IHN0YXR1czogNTAwIH1cbiAgICAgICAgfVxuICAgIH0pXG4gXG4gICByZXR1cm4gYXBwLnNlcnZlKCApO1xuXG59XG5cbi8qKiDmoLnmja7nsbvlnovvvIzov5Tlm57mjqjpgIHmlofmoYggKi9cbmZ1bmN0aW9uIGdldFRleHRCeVB1c2hUeXBlKCB0eXBlOiAnYnV5UGluMScgfCAnYnV5UGluMicgfCAnd2FpdFBpbicgfCAnYnV5JyB8ICdnZXRNb25leScsIGRlbHRhICkge1xuXG4gICAgY29uc3Qgbm93ID0gZ2V0Tm93KCApO1xuICAgIGNvbnN0IG1vbnRoID0gbm93LmdldE1vbnRoKCApICsgMTtcbiAgICBjb25zdCBkYXRlID0gbm93LmdldERhdGUoICk7XG4gICAgY29uc3QgaG91ciA9IG5vdy5nZXRIb3VycyggKTtcbiAgICBjb25zdCBtaW51dGVzID0gbm93LmdldE1pbnV0ZXMoICk7XG5cbiAgICBjb25zdCBmaXhaZXJvID0gcyA9PiBTdHJpbmcoIHMgKS5sZW5ndGggPT09IDEgPyBgMCR7c31gIDogczsgXG5cbiAgICBpZiAoIHR5cGUgPT09ICdidXknICkge1xuICAgICAgICByZXR1cm4gW1xuICAgICAgICAgICAgYOS4i+WNleaIkOWKn++8geS8muWwveW/q+mHh+i0re+9nmAsIFxuICAgICAgICAgICAgYCR7bW9udGh95pyIJHtkYXRlfeaXpSAke2hvdXJ9OiR7Zml4WmVybyggbWludXRlcyApfWBcbiAgICAgICAgXTtcbiAgICB9IGVsc2UgaWYgKCB0eXBlID09PSAnYnV5UGluMScgKSB7XG4gICAgICAgIHJldHVybiBbXG4gICAgICAgICAgICBg5oGt5Zac5oKo55yB5LqGJHtkZWx0YX3lhYPvvIFgLFxuICAgICAgICAgICAgYOaCqOWSjOWFtuS7luS6uuS5sOS6huWQjOasvuaLvOWbouWVhuWTge+8jOafpeeci2BcbiAgICAgICAgXVxuICAgIH0gZWxzZSBpZiAoIHR5cGUgPT09ICdidXlQaW4yJyApIHtcbiAgICAgICAgcmV0dXJuIFtcbiAgICAgICAgICAgIGDmga3llpzvvIHmgqjkubDnmoTllYblk4Hlh4/kuoYke2RlbHRhfeWFgyFgLFxuICAgICAgICAgICAgYOacieS6uui0reS5sOS6huWQjOasvuaLvOWboueahOWVhuWTge+8jOafpeeci2BcbiAgICAgICAgXVxuICAgIH0gZWxzZSBpZiAoIHR5cGUgPT09ICd3YWl0UGluJyApIHtcbiAgICAgICAgcmV0dXJuIFtcbiAgICAgICAgICAgIGDmgqjnmoTllYblk4Hlj6/lj4LliqDmi7zlm6LvvIFgLFxuICAgICAgICAgICAgYOWPguWKoOaLvOWbou+8jOWPr+S7peWGjeecgSR7ZGVsdGF95YWD77yBYFxuICAgICAgICBdXG4gICAgfSBlbHNlIGlmICggdHlwZSA9PT0gJ2dldE1vbmV5JyApIHtcbiAgICAgICAgcmV0dXJuIFtcbiAgICAgICAgICAgIGDmlK/ku5jlsL7mrL7vvIznq4vljbPlj5HotKflk6ZgLFxuICAgICAgICAgICAgYOi2iuW/q+i2iuWlvWBcbiAgICAgICAgXVxuICAgIH1cbiAgICByZXR1cm4gW11cbn0iXX0=