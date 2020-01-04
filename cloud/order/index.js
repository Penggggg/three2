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
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
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
exports.main = function (event, context) { return __awaiter(void 0, void 0, void 0, function () {
    var app;
    return __generator(this, function (_a) {
        app = new TcbRouter({ event: event });
        app.router('create', function (ctx, next) { return __awaiter(void 0, void 0, void 0, function () {
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
        app.router('list', function (ctx, next) { return __awaiter(void 0, void 0, void 0, function () {
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
                        meta = __spreadArrays(data$.data, fix$.data);
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
        app.router('upadte-to-payed', function (ctx, next) { return __awaiter(void 0, void 0, void 0, function () {
            var openId_1, _a, orderIds, prepay_id_1, form_id_1, find$, list_1, create$_1, _b, buyer, others, pushMe$, othersOrders$_1, othersMore, othersPush_1, appConf$, appConf, pushers$, pushers_1, appConf2$, appConf2, integralRate_1, e_3;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _c.trys.push([0, 13, , 14]);
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
                                    $url: 'push-subscribe',
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
                            return __assign(__assign({}, other), { count: othersOrders$_1[key].data.reduce(function (x, y) { return y.count + x; }, 0) });
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
                                    $url: 'push-subscribe',
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
                        if (!!!appConf.value) return [3, 12];
                        return [4, Promise.all(list_1.map(function (x, k) { return __awaiter(void 0, void 0, void 0, function () {
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
                                            return [2, __assign(__assign({}, pushRecord$.data[0]), { price: list_1[k].price, pushId: pushRecord$.data[0] ? pushRecord$.data[0]._id : '' })];
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
                                pushers_1.splice(index, 1, __assign(__assign({}, origin), { price: Number((x.price + origin.price).toFixed(2)) }));
                            }
                            else {
                                pushers_1.push({
                                    from: x.from,
                                    price: x.price,
                                    pushId: x.pushId
                                });
                            }
                        });
                        return [4, db.collection('app-config')
                                .where({
                                type: 'push-integral-get-rate'
                            })
                                .get()];
                    case 10:
                        appConf2$ = _c.sent();
                        appConf2 = appConf2$.data[0];
                        integralRate_1 = appConf2.value || 0.05;
                        return [4, Promise.all(pushers_1.map(function (pusher) { return __awaiter(void 0, void 0, void 0, function () {
                                var integral, user$, user, userid, push$;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            integral = Number((pusher.price * integralRate_1).toFixed(1));
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
                                                    data: __assign(__assign({}, user), { push_integral: user.push_integral ?
                                                            Number((user.push_integral + integral).toFixed(1)) :
                                                            integral })
                                                })];
                                        case 2:
                                            _a.sent();
                                            return [4, cloud.callFunction({
                                                    name: 'common',
                                                    data: {
                                                        $url: 'push-subscribe',
                                                        data: {
                                                            type: 'hongbao',
                                                            openid: pusher.from,
                                                            page: 'pages/ground-push-integral/index',
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
                    case 11:
                        _c.sent();
                        _c.label = 12;
                    case 12: return [2, ctx.body = {
                            status: 200
                        }];
                    case 13:
                        e_3 = _c.sent();
                        console.log(e_3);
                        return [2, ctx.body = { status: 500 }];
                    case 14: return [2];
                }
            });
        }); });
        app.router('daigou-list', function (ctx, next) { return __awaiter(void 0, void 0, void 0, function () {
            var _a, tid_1, needCoupons, needAddress, orders$_1, users$, deliverfees$_1, pushIntegral$_1, address$_1, coupons$_1, userOders, e_4;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 9, , 10]);
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
                        return [4, Promise.all(Array.from(new Set(orders$_1.data
                                .map(function (x) { return x.openid; })))
                                .map(function (uid) { return db.collection('integral-use-record')
                                .where({
                                tid: tid_1,
                                openid: uid,
                                type: 'push_integral'
                            })
                                .get(); }))];
                    case 4:
                        pushIntegral$_1 = _b.sent();
                        address$_1 = [];
                        if (!(!!needAddress || needAddress === undefined)) return [3, 6];
                        return [4, Promise.all(Array.from(new Set(orders$_1.data
                                .map(function (x) { return x.aid; })))
                                .map(function (aid) { return db.collection('address')
                                .doc(aid)
                                .get(); }))];
                    case 5:
                        address$_1 = _b.sent();
                        _b.label = 6;
                    case 6:
                        coupons$_1 = [];
                        if (!(!!needCoupons || needCoupons === undefined)) return [3, 8];
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
                    case 7:
                        coupons$_1 = _b.sent();
                        _b.label = 8;
                    case 8:
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
                            var deliverFee = deliverfees$_1[k].data[0] || 0;
                            var pushIntegral = (pushIntegral$_1[k].data[0] || {}).value || 0;
                            return {
                                user: user,
                                orders: orders,
                                address: address,
                                deliverFee: deliverFee,
                                pushIntegral: pushIntegral,
                                coupons: (!!coupons && coupons.length > 0) ? coupons[0] : []
                            };
                        });
                        return [2, ctx.body = {
                                status: 200,
                                data: userOders
                            }];
                    case 9:
                        e_4 = _b.sent();
                        console.log('...', e_4);
                        return [2, ctx.body = { status: 500 }];
                    case 10: return [2];
                }
            });
        }); });
        app.router('adjust-count', function (ctx, next) { return __awaiter(void 0, void 0, void 0, function () {
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
        app.router('batch-adjust', function (ctx, next) { return __awaiter(void 0, void 0, void 0, function () {
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
                                        $url: 'push-subscribe'
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
        app.router('pay-last', function (ctx, next) { return __awaiter(void 0, void 0, void 0, function () {
            var openid, _a, tid_2, integral, orders, coupons, push_integral, user$, user, uid, calculatePushIntegral, saveData, record$, record, trip$, req, _b, cashcoupon_atleast, cashcoupon_values, temp, lastDaijin$, e_7;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _c.trys.push([0, 16, , 17]);
                        openid = event.userInfo.openId;
                        _a = event.data, tid_2 = _a.tid, integral = _a.integral, orders = _a.orders, coupons = _a.coupons, push_integral = _a.push_integral;
                        return [4, db.collection('user')
                                .where({
                                openid: openid
                            })
                                .get()];
                    case 1:
                        user$ = _c.sent();
                        user = user$.data[0];
                        uid = user._id;
                        calculatePushIntegral = user.push_integral - push_integral > 0 ?
                            user.push_integral - push_integral :
                            0;
                        saveData = __assign(__assign({}, user), { integral: (user.integral || 0) + (integral || 0), push_integral: !user.push_integral ?
                                0 :
                                calculatePushIntegral });
                        delete saveData['_id'];
                        return [4, db.collection('user')
                                .doc(String(uid))
                                .set({
                                data: saveData
                            })];
                    case 2:
                        _c.sent();
                        if (!!!push_integral) return [3, 7];
                        return [4, db.collection('integral-use-record')
                                .where({
                                data: {
                                    tid: tid_2,
                                    openid: openid,
                                    type: 'push_integral'
                                }
                            })
                                .get()];
                    case 3:
                        record$ = _c.sent();
                        record = record$.data[0];
                        if (!(!!record && !!push_integral)) return [3, 5];
                        return [4, db.collection('integral-use-record')
                                .doc(String(record._id))
                                .update({
                                data: {
                                    value: _.inc(push_integral)
                                }
                            })];
                    case 4:
                        _c.sent();
                        return [3, 7];
                    case 5:
                        if (!(!record && !!push_integral)) return [3, 7];
                        return [4, db.collection('integral-use-record')
                                .add({
                                data: {
                                    tid: tid_2,
                                    openid: openid,
                                    value: push_integral,
                                    type: 'push_integral'
                                }
                            })];
                    case 6:
                        _c.sent();
                        _c.label = 7;
                    case 7: return [4, Promise.all(orders.map(function (order) {
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
                    case 8:
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
                    case 9:
                        _c.sent();
                        return [4, db.collection('trip')
                                .doc(tid_2)
                                .get()];
                    case 10:
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
                        if (!!!cashcoupon_values) return [3, 15];
                        return [4, db.collection('coupon')
                                .where({
                                type: 't_daijin',
                                isUsed: false,
                                canUseInNext: true
                            })
                                .get()];
                    case 11:
                        lastDaijin$ = _c.sent();
                        if (!lastDaijin$.data[0]) return [3, 13];
                        return [4, db.collection('coupon')
                                .doc(String(lastDaijin$.data[0]._id))
                                .remove()];
                    case 12:
                        _c.sent();
                        _c.label = 13;
                    case 13: return [4, cloud.callFunction({
                            data: {
                                data: temp,
                                $url: 'create'
                            },
                            name: 'coupon'
                        })];
                    case 14:
                        req = _c.sent();
                        _c.label = 15;
                    case 15: return [2, ctx.body = {
                            status: 200,
                            data: req.result.status === 200 ? temp : null
                        }];
                    case 16:
                        e_7 = _c.sent();
                        return [2, ctx.body = { status: 500 }];
                    case 17: return [2];
                }
            });
        }); });
        app.router('unread', function (ctx, next) { return __awaiter(void 0, void 0, void 0, function () {
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
        app.router('list-all', function (ctx, next) { return __awaiter(void 0, void 0, void 0, function () {
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
            "\u606D\u559C\u4F60\u7701\u4E86" + delta + "\u5143\uFF01",
            "\u70B9\u51FB\u67E5\u770B"
        ];
    }
    else if (type === 'buyPin2') {
        return [
            "\u606D\u559C\uFF01\u4F60\u7701\u4E86" + delta + "\u5143!",
            "\u6709\u7FA4\u53CB\u53C2\u52A0\u4E86\u62FC\u56E2\uFF0C\u70B9\u51FB\u67E5\u770B"
        ];
    }
    else if (type === 'waitPin') {
        return [
            "\u5DEE1\u4EBA\u5C31\u62FC\u6210\uFF01",
            "\u627E\u7FA4\u53CB\u62FC\u56E2\uFF0C\u7ACB\u7701" + delta + "\u5143\uFF01"
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUNBLHFDQUF1QztBQUN2QyxzQ0FBd0M7QUFDeEMsbUNBQW1DO0FBRW5DLEtBQUssQ0FBQyxJQUFJLENBQUM7SUFDUCxHQUFHLEVBQUUsT0FBTyxDQUFDLEdBQUcsQ0FBQyxLQUFLO0NBQ3pCLENBQUMsQ0FBQztBQUVILElBQU0sRUFBRSxHQUFnQixLQUFLLENBQUMsUUFBUSxFQUFHLENBQUM7QUFDMUMsSUFBTSxDQUFDLEdBQUcsRUFBRSxDQUFDLE9BQU8sQ0FBQztBQVFyQixJQUFNLE1BQU0sR0FBRyxVQUFFLEVBQVU7SUFBVixtQkFBQSxFQUFBLFVBQVU7SUFDdkIsSUFBSyxFQUFFLEVBQUc7UUFDTixPQUFPLElBQUksQ0FBQyxHQUFHLEVBQUcsQ0FBQztLQUN0QjtJQUNELElBQU0sTUFBTSxHQUFHLElBQUksSUFBSSxDQUFFLElBQUksSUFBSSxFQUFHLENBQUMsY0FBYyxFQUFHLENBQUMsQ0FBQztJQUN4RCxPQUFPLElBQUksSUFBSSxDQUFFLE1BQU0sQ0FBQyxPQUFPLEVBQUcsR0FBRyxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxJQUFJLENBQUUsQ0FBQTtBQUM3RCxDQUFDLENBQUE7QUFvQ1ksUUFBQSxJQUFJLEdBQUcsVUFBUSxLQUFLLEVBQUUsT0FBTzs7O1FBRWhDLEdBQUcsR0FBRyxJQUFJLFNBQVMsQ0FBQyxFQUFFLEtBQUssT0FBQSxFQUFFLENBQUMsQ0FBQztRQWlDckMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxRQUFRLEVBQUUsVUFBTyxHQUFHLEVBQUUsSUFBSTs7Ozs7O3dCQUd2QixLQUF3QixLQUFLLENBQUMsSUFBSSxFQUFoQyxHQUFHLFNBQUEsRUFBRSxJQUFJLFVBQUEsRUFBRSxNQUFNLFlBQUEsQ0FBZ0I7d0JBQ25DLFdBQVMsS0FBSyxDQUFDLElBQUksQ0FBQyxNQUFNLElBQUksS0FBSyxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUM7d0JBRzFDLFdBQU0sS0FBSyxDQUFDLFlBQVksQ0FBQztnQ0FDckMsSUFBSSxFQUFFO29DQUNGLElBQUksRUFBRTt3Q0FDRixHQUFHLEVBQUUsR0FBRztxQ0FDWDtvQ0FDRCxJQUFJLEVBQUUsUUFBUTtpQ0FDakI7Z0NBQ0QsSUFBSSxFQUFFLE1BQU07NkJBQ2YsQ0FBQyxFQUFBOzt3QkFSSSxPQUFPLEdBQUcsU0FRZDt3QkFFSSxNQUFNLEdBQUcsT0FBTyxDQUFDLE1BQU0sQ0FBQzt3QkFDOUIsSUFBSyxNQUFNLENBQUMsTUFBTSxLQUFLLEdBQUc7K0JBQ2YsQ0FBQyxNQUFNLENBQUMsSUFBSTsrQkFDWixDQUFFLENBQUMsQ0FBQyxNQUFNLENBQUMsSUFBSSxJQUFJLE1BQU0sQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFFOytCQUN6QyxDQUFFLENBQUMsQ0FBQyxNQUFNLENBQUMsSUFBSSxJQUFJLE1BQU0sQ0FBRSxJQUFJLENBQUUsSUFBSSxNQUFNLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBRSxFQUFFOzRCQUNwRSxNQUFNLGdCQUFnQixDQUFBO3lCQUN6Qjt3QkFHSyxJQUFJLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQzt3QkFLckIsVUFBVSxHQUFHOzRCQUNiLE1BQU0sRUFBRTtnQ0FDSixJQUFJLEVBQUUsSUFBSTtnQ0FDVixNQUFNLEVBQUUsR0FBRzs2QkFDZDt5QkFDSixDQUFDOzZCQUdHLENBQUEsS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLEtBQUssTUFBTSxJQUFJLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxLQUFLLFFBQVEsSUFBSSxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksS0FBSyxLQUFLLENBQUEsRUFBdkYsY0FBdUY7d0JBQzNFLFdBQU0sS0FBSyxDQUFDLFlBQVksQ0FBQztnQ0FDbEMsSUFBSSxFQUFFO29DQUNGLElBQUksRUFBRTt3Q0FDRixNQUFNLEVBQUUsUUFBTTt3Q0FDZCxPQUFPLEVBQUUsS0FBSyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUUsQ0FBQyxDQUFFLENBQUMsT0FBTztxQ0FDMUM7b0NBQ0QsSUFBSSxFQUFFLGNBQWM7aUNBQ3ZCO2dDQUNELElBQUksRUFBRSxTQUFTOzZCQUNsQixDQUFDLEVBQUE7O3dCQVRGLFVBQVUsR0FBRyxTQVNYLENBQUM7Ozt3QkFJUCxJQUFJLENBQUUsS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLEtBQUssTUFBTSxJQUFJLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxLQUFLLFFBQVEsQ0FBRSxJQUFJLFVBQVUsQ0FBQyxNQUFNLENBQUMsTUFBTSxLQUFLLEdBQUcsRUFBRzs0QkFDckcsTUFBTSxRQUFRLENBQUM7eUJBQ2xCO3dCQUdLLFFBQU0sVUFBVSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUM7d0JBR3BCLFdBQU0sS0FBSyxDQUFDLFlBQVksQ0FBQztnQ0FDcEMsSUFBSSxFQUFFLFFBQVE7Z0NBQ2QsSUFBSSxFQUFFO29DQUNGLElBQUksRUFBRSxpQkFBaUI7b0NBQ3ZCLElBQUksRUFBRTt3Q0FDRixNQUFNLEVBQUUsUUFBTTtxQ0FDakI7aUNBQ0o7NkJBQ0osQ0FBQyxFQUFBOzt3QkFSSSxNQUFNLEdBQUcsU0FRYjt3QkFFSSxLQUFLLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUM7d0JBVTdCLGVBQWEsR0FBRyxDQUFDO3dCQUNmLENBQUMsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDO3dCQUV2QixJQUFLLEtBQUssSUFBSSxDQUFDLEtBQUssR0FBRyxFQUFHOzRCQUN0QixZQUFVLEdBQUcsR0FBRyxDQUFBO3lCQUVuQjs2QkFBTSxJQUFLLEtBQUssSUFBSSxDQUFDLEtBQUssR0FBRyxFQUFHOzRCQUM3QixZQUFVLEdBQUcsR0FBRyxDQUFBO3lCQUVuQjs2QkFBTSxJQUFLLEtBQUssSUFBSSxDQUFDLEtBQUssR0FBRyxFQUFHOzRCQUM3QixZQUFVLEdBQUcsR0FBRyxDQUFBO3lCQUVuQjs2QkFBTSxJQUFLLENBQUMsS0FBSyxJQUFJLENBQUMsS0FBSyxHQUFHLEVBQUc7NEJBQzlCLFlBQVUsR0FBRyxHQUFHLENBQUE7eUJBRW5COzZCQUFNLElBQUssQ0FBQyxLQUFLLElBQUksQ0FBQyxLQUFLLEdBQUcsRUFBRzs0QkFDOUIsWUFBVSxHQUFHLEdBQUcsQ0FBQTt5QkFFbkI7NkJBQU0sSUFBSyxDQUFDLEtBQUssSUFBSSxDQUFDLEtBQUssR0FBRyxFQUFHOzRCQUM5QixZQUFVLEdBQUcsR0FBRyxDQUFBO3lCQUVuQjs2QkFBTTs0QkFDSCxZQUFVLEdBQUcsR0FBRyxDQUFBO3lCQUVuQjt3QkFHSyxTQUFPLEtBQUssQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBRSxVQUFBLElBQUk7NEJBQ3BDLElBQU0sQ0FBQyxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUMsRUFBRyxFQUFFLElBQUksRUFBRTtnQ0FJL0IsR0FBRyxPQUFBO2dDQUNILFVBQVUsRUFBRSxJQUFJO2dDQUNoQixNQUFNLEVBQUUsUUFBTTtnQ0FDZCxjQUFjLEVBQUUsR0FBRztnQ0FDbkIsV0FBVyxFQUFFLEdBQUc7Z0NBQ2hCLFVBQVUsRUFBRSxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsWUFBVTtnQ0FDakQsVUFBVSxFQUFFLE1BQU0sQ0FBRSxJQUFJLENBQUU7Z0NBQzFCLElBQUksRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsUUFBUTs2QkFDbkQsQ0FBQyxDQUFDOzRCQUNILE9BQU8sQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDOzRCQUVwQixJQUFLLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxFQUFHO2dDQUNiLE9BQU8sQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDOzZCQUNuQjs0QkFFRCxPQUFPLENBQUMsQ0FBQzt3QkFDYixDQUFDLENBQUMsQ0FBQzt3QkFHZ0IsV0FBTSxPQUFPLENBQUMsR0FBRyxDQUFFLE1BQUksQ0FBQyxHQUFHLENBQUUsVUFBQSxDQUFDO2dDQUM3QyxPQUFPLGdCQUFPLENBQUUsUUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsR0FBRyxDQUFFLENBQUM7NEJBQ3pDLENBQUMsQ0FBQyxDQUFDLEVBQUE7O3dCQUZHLEtBQUssR0FBUSxTQUVoQjt3QkFFSCxJQUFLLEtBQUssQ0FBQyxJQUFJLENBQUUsVUFBQSxDQUFDLElBQUksT0FBQSxDQUFDLENBQUMsTUFBTSxLQUFLLEdBQUcsRUFBaEIsQ0FBZ0IsQ0FBRSxFQUFFOzRCQUN0QyxNQUFNLFNBQVMsQ0FBQTt5QkFDbEI7d0JBR0ssWUFBWSxHQUFHLEtBQUssQ0FBQyxHQUFHLENBQUMsVUFBRSxDQUFDLEVBQUUsQ0FBQzs0QkFDM0IsSUFBQSxjQUFzRCxFQUFwRCxnQkFBSyxFQUFFLGdCQUFLLEVBQUUsMEJBQVUsRUFBRSw4QkFBMEIsQ0FBQzs0QkFDN0QsT0FBTztnQ0FDSCxHQUFHLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHO2dDQUNmLEtBQUssT0FBQTtnQ0FDTCxLQUFLLE9BQUE7Z0NBQ0wsVUFBVSxZQUFBO2dDQUNWLFlBQVksY0FBQTs2QkFDZixDQUFBO3dCQUNMLENBQUMsQ0FBQyxDQUFDO3dCQUVILFdBQU8sR0FBRyxDQUFDLElBQUksR0FBRztnQ0FDZCxNQUFNLEVBQUUsR0FBRztnQ0FDWCxJQUFJLEVBQUUsWUFBWTs2QkFDckIsRUFBQzs7O3dCQUlGLFdBQU8sR0FBRyxDQUFDLElBQUksR0FBRztnQ0FDZCxNQUFNLEVBQUUsR0FBRztnQ0FDWCxPQUFPLEVBQUUsR0FBQzs2QkFDYixFQUFDOzs7O2FBRVQsQ0FBQyxDQUFDO1FBcUJILEdBQUcsQ0FBQyxNQUFNLENBQUMsTUFBTSxFQUFFLFVBQU8sR0FBRyxFQUFFLElBQUk7Ozs7Ozt3QkFHdkIsTUFBTSxHQUFHLEVBQUcsQ0FBQzt3QkFDWCxLQUE4QixLQUFLLENBQUMsSUFBSSxFQUF0QyxJQUFJLFVBQUEsRUFBRSxHQUFHLFNBQUEsRUFBRSxZQUFZLGtCQUFBLENBQWdCO3dCQUd6QyxLQUFLLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQzt3QkFFdEIsTUFBTSxHQUFHLEtBQUssQ0FBQyxJQUFJLENBQUMsTUFBTSxJQUFJLEtBQUssQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDO3dCQUkxRCxJQUFLLElBQUksS0FBSyxRQUFRLEVBQUc7NEJBQ3JCLE1BQU0sR0FBRztnQ0FDTCxNQUFNLEVBQUUsTUFBTTs2QkFDakIsQ0FBQTt5QkFHSjs2QkFBTSxJQUFLLElBQUksS0FBSyxXQUFXLEVBQUc7NEJBQy9CLE1BQU0sR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDO2dDQUNYLE1BQU0sUUFBQTtnQ0FDTixXQUFXLEVBQUUsR0FBRzs2QkFDbkIsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDO2dDQUNKO29DQUNJLElBQUksRUFBRSxLQUFLO2lDQUNkLEVBQUU7b0NBQ0MsVUFBVSxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDO2lDQUMxQzs2QkFDSixDQUFDLENBQUMsQ0FBQzt5QkFHUDs2QkFBTSxJQUFLLElBQUksS0FBSyxXQUFXLEVBQUc7NEJBQy9CLE1BQU0sR0FBRztnQ0FDTCxNQUFNLFFBQUE7Z0NBQ04sVUFBVSxFQUFFLEdBQUc7Z0NBQ2YsY0FBYyxFQUFFLEdBQUc7NkJBQ3RCLENBQUM7eUJBR0w7NkJBQU0sSUFBSyxJQUFJLEtBQUssV0FBVyxFQUFHOzRCQUMvQixNQUFNLEdBQUc7Z0NBQ0wsTUFBTSxRQUFBO2dDQUNOLFVBQVUsRUFBRSxHQUFHO2dDQUNmLGNBQWMsRUFBRSxHQUFHOzZCQUN0QixDQUFDO3lCQUNMO3dCQUdELElBQUssWUFBWSxLQUFLLEtBQUssRUFBRzs0QkFDMUIsTUFBTSxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUMsRUFBRyxFQUFFLE1BQU0sRUFBRTtnQ0FDaEMsV0FBVyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDOzZCQUMxQixDQUFDLENBQUM7eUJBQ047d0JBR0QsSUFBSyxHQUFHLEVBQUc7NEJBQ1AsTUFBTSxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUMsRUFBRyxFQUFFLE1BQU0sRUFBRTtnQ0FDaEMsR0FBRyxLQUFBOzZCQUNOLENBQUMsQ0FBQzt5QkFDTjt3QkFHYyxXQUFNLEVBQUUsQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDO2lDQUN0QyxLQUFLLENBQUUsTUFBTSxDQUFFO2lDQUNmLEtBQUssRUFBRyxFQUFBOzt3QkFGUCxNQUFNLEdBQUcsU0FFRjt3QkFNQyxXQUFNLEVBQUUsQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDO2lDQUNyQyxLQUFLLENBQUUsTUFBTSxDQUFFO2lDQUNmLE9BQU8sQ0FBQyxZQUFZLEVBQUUsTUFBTSxDQUFDO2lDQUM3QixLQUFLLENBQUUsS0FBSyxDQUFFO2lDQUNkLElBQUksQ0FBRSxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksSUFBSSxDQUFFLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxHQUFHLENBQUMsQ0FBRSxHQUFHLEtBQUssQ0FBRTtpQ0FDMUQsR0FBRyxFQUFHLEVBQUE7O3dCQUxMLEtBQUssR0FBRyxTQUtIO3dCQVNMLElBQUksR0FBRyxLQUFLLENBQUMsSUFBSSxDQUFFLEtBQUssQ0FBQyxJQUFJLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBRSxDQUFDO3dCQUU3QyxJQUFJLEdBQVE7NEJBQ1osSUFBSSxFQUFFLEVBQUc7eUJBQ1osQ0FBQzs2QkFHRyxDQUFBLElBQUksSUFBSSxDQUFDLEdBQUcsQ0FBQSxFQUFaLGNBQVk7d0JBQ04sV0FBTSxFQUFFLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQztpQ0FDOUIsS0FBSyxDQUFDO2dDQUNILE1BQU0sUUFBQTtnQ0FDTixHQUFHLEVBQUUsSUFBSSxDQUFDLEdBQUc7Z0NBQ2IsV0FBVyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDOzZCQUMxQixDQUFDO2lDQUNELE9BQU8sQ0FBQyxZQUFZLEVBQUUsTUFBTSxDQUFDO2lDQUM3QixJQUFJLENBQUUsS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxHQUFHLEtBQUssQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFFLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxHQUFHLENBQUMsQ0FBRSxHQUFHLEtBQUssR0FBRyxLQUFLLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBRTtpQ0FDbkgsR0FBRyxFQUFHLEVBQUE7O3dCQVJYLElBQUksR0FBRyxTQVFJLENBQUM7Ozt3QkFHVixJQUFJLGtCQUFRLEtBQUssQ0FBQyxJQUFJLEVBQUssSUFBSSxDQUFDLElBQUksQ0FBRSxDQUFDO3dCQUd2QyxPQUFPLEdBQUcsS0FBSyxDQUFDLElBQUksQ0FDdEIsSUFBSSxHQUFHLENBQUUsSUFBSSxDQUFDLEdBQUcsQ0FBRSxVQUFBLENBQUMsSUFBSSxPQUFBLENBQUMsQ0FBQyxHQUFHLEVBQUwsQ0FBSyxDQUFFLENBQUMsQ0FDbkMsQ0FBQzt3QkFFYSxXQUFNLE9BQU8sQ0FBQyxHQUFHLENBQUUsT0FBTyxDQUFDLEdBQUcsQ0FBRSxVQUFBLEdBQUc7Z0NBQzlDLE9BQU8sRUFBRSxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUM7cUNBQ3ZCLEtBQUssQ0FBQztvQ0FDSCxHQUFHLEVBQUUsR0FBRztpQ0FDWCxDQUFDO3FDQUNELEdBQUcsRUFBRyxDQUFDOzRCQUNoQixDQUFDLENBQUMsQ0FBQyxFQUFBOzt3QkFORyxXQUFTLFNBTVo7d0JBR0csS0FBSyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsVUFBRSxDQUFDLEVBQUUsQ0FBQyxJQUFNLE9BQUEsTUFBTSxDQUFDLE1BQU0sQ0FBQyxFQUFHLEVBQUUsQ0FBQyxFQUFFOzRCQUVyRCxJQUFJLEVBQUcsUUFBTSxDQUFDLElBQUksQ0FBRSxVQUFBLENBQUMsSUFBSSxPQUFBLENBQUMsQ0FBQyxJQUFJLENBQUUsQ0FBQyxDQUFFLENBQUMsR0FBRyxLQUFLLENBQUMsQ0FBQyxHQUFHLEVBQXpCLENBQXlCLENBQVUsQ0FBQyxJQUFJLENBQUUsQ0FBQyxDQUFFO3lCQUN6RSxDQUFDLEVBSGlDLENBR2pDLENBQUMsQ0FBQzt3QkFFSixXQUFPLEdBQUcsQ0FBQyxJQUFJLEdBQUc7Z0NBQ2QsTUFBTSxFQUFFLEdBQUc7Z0NBQ1gsSUFBSSxFQUFFO29DQUNGLElBQUksRUFBRSxLQUFLO29DQUNYLFFBQVEsRUFBRSxLQUFLO29DQUNmLEtBQUssRUFBRSxNQUFNLENBQUMsS0FBSztvQ0FDbkIsSUFBSSxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLEdBQUcsS0FBSyxDQUFFO29DQUN4RyxPQUFPLEVBQUUsS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUUsS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLEdBQUcsQ0FBQyxDQUFFLEdBQUcsS0FBSyxHQUFHLElBQUksQ0FBQyxNQUFNO29DQUN4RyxTQUFTLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBRSxNQUFNLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBRTtpQ0FDL0M7NkJBQ0osRUFBQTs7O3dCQUVXLFdBQU8sR0FBRyxDQUFDLElBQUksR0FBRyxFQUFFLE1BQU0sRUFBRSxHQUFHLEVBQUMsRUFBQzs7OzthQUNwRCxDQUFDLENBQUE7UUFZRixHQUFHLENBQUMsTUFBTSxDQUFDLGlCQUFpQixFQUFFLFVBQU8sR0FBRyxFQUFFLElBQUk7Ozs7Ozt3QkFHaEMsV0FBUyxLQUFLLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQzt3QkFDL0IsS0FBbUMsS0FBSyxDQUFDLElBQUksRUFBM0MsUUFBUSxjQUFBLEVBQUUsMEJBQVMsRUFBRSxzQkFBTyxDQUFnQjt3QkFHcEQsV0FBTSxPQUFPLENBQUMsR0FBRyxDQUFFLFFBQVEsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFFLFVBQUEsR0FBRztnQ0FDM0MsT0FBTyxFQUFFLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxDQUFDLEdBQUcsQ0FBRSxHQUFHLENBQUU7cUNBQ25DLE1BQU0sQ0FBQztvQ0FDSixJQUFJLEVBQUU7d0NBQ0YsT0FBTyxXQUFBO3dDQUNQLFNBQVMsYUFBQTt3Q0FDVCxVQUFVLEVBQUUsR0FBRztxQ0FDbEI7aUNBQ0osQ0FBQyxDQUFDOzRCQUNYLENBQUMsQ0FBQyxDQUFDLEVBQUE7O3dCQVRILFNBU0csQ0FBQzt3QkFHZSxXQUFNLE9BQU8sQ0FBQyxHQUFHLENBQUUsUUFBUSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUUsVUFBQSxHQUFHO2dDQUM5RCxPQUFPLEVBQUUsQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDO3FDQUN4QixLQUFLLENBQUM7b0NBQ0gsR0FBRyxFQUFFLEdBQUc7aUNBQ1gsQ0FBQztxQ0FDRCxHQUFHLEVBQUcsQ0FBQzs0QkFDaEIsQ0FBQyxDQUFDLENBQUMsRUFBQTs7d0JBTkcsS0FBSyxHQUFRLFNBTWhCO3dCQUdHLFNBQU8sS0FBSyxDQUFDLEdBQUcsQ0FBRSxVQUFBLENBQUM7NEJBQ2YsSUFBQSxjQUE2RCxFQUEzRCxZQUFHLEVBQUUsWUFBRyxFQUFFLFlBQUcsRUFBRSxZQUFHLEVBQUUsZ0JBQUssRUFBRSwwQkFBVSxFQUFFLGNBQW9CLENBQUM7NEJBQ3BFLE9BQU87Z0NBQ0gsR0FBRyxFQUFFLEdBQUc7Z0NBQ1IsSUFBSSxNQUFBLEVBQUUsVUFBVSxZQUFBO2dDQUNoQixHQUFHLEtBQUEsRUFBRSxHQUFHLEtBQUEsRUFBRSxHQUFHLEtBQUEsRUFBRSxLQUFLLE9BQUE7NkJBQ3ZCLENBQUE7d0JBQ0wsQ0FBQyxDQUFDLENBQUM7d0JBRWEsV0FBTSxLQUFLLENBQUMsWUFBWSxDQUFDO2dDQUNyQyxJQUFJLEVBQUUsZUFBZTtnQ0FDckIsSUFBSSxFQUFFO29DQUNGLElBQUksRUFBRSxRQUFRO29DQUNkLElBQUksRUFBRTt3Q0FDRixJQUFJLFFBQUE7d0NBQ0osTUFBTSxVQUFBO3FDQUNUO2lDQUNKOzZCQUNKLENBQUMsRUFBQTs7d0JBVEksWUFBVSxTQVNkOzZCQUdHLENBQUEsU0FBTyxDQUFDLE1BQU0sQ0FBQyxNQUFNLEtBQUssR0FBRyxDQUFBLEVBQTdCLGNBQTZCO3dCQUN4QixLQUFvQixTQUFPLENBQUMsTUFBTSxDQUFDLElBQUksRUFBckMsS0FBSyxXQUFBLEVBQUUsTUFBTSxZQUFBLENBQXlCO3dCQUc5QixXQUFNLEtBQUssQ0FBQyxZQUFZLENBQUM7Z0NBQ3JDLElBQUksRUFBRSxRQUFRO2dDQUNkLElBQUksRUFBRTtvQ0FDRixJQUFJLEVBQUUsZ0JBQWdCO29DQUN0QixJQUFJLEVBQUU7d0NBQ0YsSUFBSSxFQUFFLEtBQUssQ0FBQyxJQUFJO3dDQUNoQixNQUFNLEVBQUUsS0FBSyxDQUFDLE1BQU07d0NBQ3BCLEtBQUssRUFBRSxpQkFBaUIsQ0FDcEIsS0FBSyxDQUFDLElBQUksS0FBSyxRQUFRLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLElBQUksRUFDaEQsS0FBSyxDQUFDLEtBQUssQ0FBRTtxQ0FDcEI7aUNBQ0o7NkJBQ0osQ0FBQyxFQUFBOzt3QkFaSSxPQUFPLEdBQUcsU0FZZDt3QkFHeUIsV0FBTSxPQUFPLENBQUMsR0FBRyxDQUN4QyxNQUFNLENBQUMsR0FBRyxDQUNOLFVBQUEsS0FBSyxJQUFJLE9BQUEsRUFBRSxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUM7aUNBQzFCLEtBQUssQ0FBQztnQ0FDSCxNQUFNLEVBQUUsS0FBSyxDQUFDLE1BQU07Z0NBQ3BCLElBQUksRUFBRSxLQUFLLENBQUMsSUFBSTtnQ0FDaEIsR0FBRyxFQUFFLEtBQUssQ0FBQyxHQUFHO2dDQUNkLEdBQUcsRUFBRSxLQUFLLENBQUMsR0FBRztnQ0FDZCxHQUFHLEVBQUUsS0FBSyxDQUFDLEdBQUc7Z0NBQ2QsVUFBVSxFQUFFLEdBQUc7Z0NBQ2YsV0FBVyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUM7NkJBQ3RELENBQUM7aUNBQ0QsS0FBSyxDQUFDO2dDQUNILEtBQUssRUFBRSxJQUFJOzZCQUNkLENBQUM7aUNBQ0QsR0FBRyxFQUFHLEVBYkYsQ0FhRSxDQUNkLENBQ0osRUFBQTs7d0JBakJLLGtCQUFxQixTQWlCMUI7d0JBR0ssVUFBVSxHQUFHLE1BQU0sQ0FBQyxHQUFHLENBQUMsVUFBRSxLQUFLLEVBQUUsR0FBRzs0QkFDdEMsNkJBQ08sS0FBSyxLQUNSLEtBQUssRUFBRSxlQUFhLENBQUUsR0FBRyxDQUFFLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxVQUFFLENBQUMsRUFBRSxDQUFDLElBQU0sT0FBQSxDQUFDLENBQUMsS0FBSyxHQUFHLENBQUMsRUFBWCxDQUFXLEVBQUUsQ0FBQyxDQUFFLElBQ3ZFO3dCQUNMLENBQUMsQ0FBQyxDQUFDO3dCQUVDLGVBQWEsRUFBRyxDQUFDO3dCQUVyQixVQUFVLENBQUMsR0FBRyxDQUFFLFVBQUEsS0FBSzs7NEJBQ2pCLElBQUssQ0FBQyxZQUFVLENBQUUsS0FBSyxDQUFDLE1BQU0sQ0FBRSxFQUFFO2dDQUM5QixZQUFVLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQyxFQUFHLEVBQUUsWUFBVTtvQ0FDdEMsR0FBRSxLQUFLLENBQUMsTUFBTSxJQUFJLEtBQUssQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDLEtBQUs7d0NBQzdDLENBQUM7NkJBQ047aUNBQU07Z0NBQ0gsWUFBVSxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUMsRUFBRyxFQUFFLFlBQVU7b0NBQ3RDLEdBQUUsS0FBSyxDQUFDLE1BQU0sSUFBSSxZQUFVLENBQUUsS0FBSyxDQUFDLE1BQU0sQ0FBRSxHQUFHLEtBQUssQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDLEtBQUs7d0NBQzFFLENBQUM7NkJBQ047d0JBQ0wsQ0FBQyxDQUFDLENBQUM7d0JBR0gsV0FBTSxPQUFPLENBQUMsR0FBRyxDQUNiLE1BQU0sQ0FBQyxJQUFJLENBQUUsWUFBVSxDQUFFLENBQUMsR0FBRyxDQUN6QixVQUFBLFdBQVcsSUFBSSxPQUFBLEtBQUssQ0FBQyxZQUFZLENBQUM7Z0NBQzlCLElBQUksRUFBRSxRQUFRO2dDQUNkLElBQUksRUFBRTtvQ0FDRixJQUFJLEVBQUUsZ0JBQWdCO29DQUN0QixJQUFJLEVBQUU7d0NBQ0YsSUFBSSxFQUFFLFFBQVE7d0NBQ2QsTUFBTSxFQUFFLFdBQVc7d0NBQ25CLEtBQUssRUFBRSxpQkFBaUIsQ0FBRSxTQUFTLEVBQUUsWUFBVSxDQUFFLFdBQVcsQ0FBRSxDQUFDO3FDQUNsRTtpQ0FDSjs2QkFDSixDQUFDLEVBVmEsQ0FVYixDQUNMLENBQ0osRUFBQTs7d0JBZEQsU0FjQyxDQUFDOzs0QkFLVyxXQUFNLEVBQUUsQ0FBQyxVQUFVLENBQUMsWUFBWSxDQUFDOzZCQUM3QyxLQUFLLENBQUM7NEJBQ0gsSUFBSSxFQUFFLHFCQUFxQjt5QkFDOUIsQ0FBQzs2QkFDRCxHQUFHLEVBQUcsRUFBQTs7d0JBSkwsUUFBUSxHQUFHLFNBSU47d0JBQ0wsT0FBTyxHQUFHLFFBQVEsQ0FBQyxJQUFJLENBQUUsQ0FBQyxDQUFFLENBQUM7NkJBRTlCLENBQUMsQ0FBQyxPQUFPLENBQUMsS0FBSyxFQUFmLGVBQWU7d0JBRU0sV0FBTSxPQUFPLENBQUMsR0FBRyxDQUNuQyxNQUFJLENBQUMsR0FBRyxDQUFFLFVBQU8sQ0FBQyxFQUFFLENBQUM7Ozs7Z0RBQ0csV0FBTSxFQUFFLENBQUMsVUFBVSxDQUFDLGNBQWMsQ0FBQztpREFDbEQsS0FBSyxDQUFDO2dEQUNILEdBQUcsRUFBRSxDQUFDLENBQUMsR0FBRztnREFDVixNQUFNLEVBQUUsUUFBTTtnREFDZCxTQUFTLEVBQUUsS0FBSzs2Q0FDbkIsQ0FBQztpREFDRCxHQUFHLEVBQUcsRUFBQTs7NENBTkwsV0FBVyxHQUFHLFNBTVQ7NENBQ1gsaUNBQ08sV0FBVyxDQUFDLElBQUksQ0FBRSxDQUFDLENBQUUsS0FDeEIsS0FBSyxFQUFFLE1BQUksQ0FBRSxDQUFDLENBQUUsQ0FBQyxLQUFLLEVBQ3RCLE1BQU0sRUFBRSxXQUFXLENBQUMsSUFBSSxDQUFFLENBQUMsQ0FBRSxDQUFDLENBQUMsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFFLENBQUMsQ0FBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxLQUNqRTs7O2lDQUNKLENBQUMsQ0FDTCxFQUFBOzt3QkFmSyxRQUFRLEdBQVEsU0FlckI7d0JBR0ssWUFBZSxFQUFHLENBQUM7d0JBQ3pCLFFBQVE7NkJBQ0gsTUFBTSxDQUFFLFVBQUEsQ0FBQyxJQUFJLE9BQUEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQVIsQ0FBUSxDQUFFOzZCQUN2QixHQUFHLENBQUUsVUFBQSxDQUFDOzRCQUNILElBQU0sS0FBSyxHQUFHLFNBQU8sQ0FBQyxTQUFTLENBQUUsVUFBQSxDQUFDLElBQUksT0FBQSxDQUFDLENBQUMsSUFBSSxLQUFLLENBQUMsQ0FBQyxJQUFJLEVBQWpCLENBQWlCLENBQUUsQ0FBQzs0QkFDMUQsSUFBSyxLQUFLLEtBQUssQ0FBQyxDQUFDLEVBQUc7Z0NBQ2hCLElBQU0sTUFBTSxHQUFHLFNBQU8sQ0FBRSxLQUFLLENBQUUsQ0FBQztnQ0FDaEMsU0FBTyxDQUFDLE1BQU0sQ0FBRSxLQUFLLEVBQUUsQ0FBQyx3QkFDakIsTUFBTSxLQUNULEtBQUssRUFBRSxNQUFNLENBQUMsQ0FBRSxDQUFDLENBQUMsS0FBSyxHQUFHLE1BQU0sQ0FBQyxLQUFLLENBQUUsQ0FBQyxPQUFPLENBQUUsQ0FBQyxDQUFFLENBQUMsSUFDeEQsQ0FBQzs2QkFDTjtpQ0FBTTtnQ0FDSCxTQUFPLENBQUMsSUFBSSxDQUFDO29DQUNULElBQUksRUFBRSxDQUFDLENBQUMsSUFBSTtvQ0FDWixLQUFLLEVBQUUsQ0FBQyxDQUFDLEtBQUs7b0NBQ2QsTUFBTSxFQUFFLENBQUMsQ0FBQyxNQUFNO2lDQUNuQixDQUFDLENBQUE7NkJBQ0w7d0JBQ0wsQ0FBQyxDQUFDLENBQUM7d0JBRVcsV0FBTSxFQUFFLENBQUMsVUFBVSxDQUFDLFlBQVksQ0FBQztpQ0FDOUMsS0FBSyxDQUFDO2dDQUNILElBQUksRUFBRSx3QkFBd0I7NkJBQ2pDLENBQUM7aUNBQ0QsR0FBRyxFQUFHLEVBQUE7O3dCQUpMLFNBQVMsR0FBRyxTQUlQO3dCQUNMLFFBQVEsR0FBRyxTQUFTLENBQUMsSUFBSSxDQUFFLENBQUMsQ0FBRSxDQUFDO3dCQUMvQixpQkFBZSxRQUFRLENBQUMsS0FBSyxJQUFJLElBQUksQ0FBQzt3QkFFNUMsV0FBTSxPQUFPLENBQUMsR0FBRyxDQUNiLFNBQU8sQ0FBQyxHQUFHLENBQUUsVUFBTSxNQUFNOzs7Ozs0Q0FJZixRQUFRLEdBQUcsTUFBTSxDQUFDLENBQUUsTUFBTSxDQUFDLEtBQUssR0FBRyxjQUFZLENBQUUsQ0FBQyxPQUFPLENBQUUsQ0FBQyxDQUFFLENBQUMsQ0FBQzs0Q0FHeEQsV0FBTSxFQUFFLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQztxREFDcEMsS0FBSyxDQUFDO29EQUNILE1BQU0sRUFBRSxNQUFNLENBQUMsSUFBSTtpREFDdEIsQ0FBQztxREFDRCxHQUFHLEVBQUcsRUFBQTs7NENBSkwsS0FBSyxHQUFHLFNBSUg7NENBQ0wsSUFBSSxHQUFHLEtBQUssQ0FBQyxJQUFJLENBQUUsQ0FBQyxDQUFFLENBQUM7NENBQ3ZCLE1BQU0sR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDOzRDQUN4QixPQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQzs0Q0FFbkIsV0FBTSxFQUFFLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQztxREFDdEIsR0FBRyxDQUFFLE1BQU0sQ0FBRSxNQUFNLENBQUUsQ0FBQztxREFDdEIsR0FBRyxDQUFDO29EQUNELElBQUksd0JBQ0csSUFBSSxLQUNQLGFBQWEsRUFBRSxJQUFJLENBQUMsYUFBYSxDQUFDLENBQUM7NERBQy9CLE1BQU0sQ0FBQyxDQUFDLElBQUksQ0FBQyxhQUFhLEdBQUcsUUFBUSxDQUFDLENBQUMsT0FBTyxDQUFFLENBQUMsQ0FBRSxDQUFDLENBQUMsQ0FBQzs0REFDdEQsUUFBUSxHQUNmO2lEQUNKLENBQUMsRUFBQTs7NENBVE4sU0FTTSxDQUFDOzRDQUdPLFdBQU0sS0FBSyxDQUFDLFlBQVksQ0FBQztvREFDbkMsSUFBSSxFQUFFLFFBQVE7b0RBQ2QsSUFBSSxFQUFFO3dEQUNGLElBQUksRUFBRSxnQkFBZ0I7d0RBQ3RCLElBQUksRUFBRTs0REFDRixJQUFJLEVBQUUsU0FBUzs0REFDZixNQUFNLEVBQUUsTUFBTSxDQUFDLElBQUk7NERBRW5CLElBQUksRUFBRSxrQ0FBa0M7NERBQ3hDLEtBQUssRUFBRSxDQUFDLG1DQUFRLFFBQVEsbUNBQU8sRUFBQyxrR0FBa0IsQ0FBQzt5REFDdEQ7cURBQ0o7aURBQ0osQ0FBQyxFQUFBOzs0Q0FaSSxLQUFLLEdBQUcsU0FZWjs0Q0FHRixXQUFNLEVBQUUsQ0FBQyxVQUFVLENBQUMsY0FBYyxDQUFDO3FEQUM5QixHQUFHLENBQUUsTUFBTSxDQUFDLE1BQU0sQ0FBRTtxREFDcEIsTUFBTSxDQUFDO29EQUNKLElBQUksRUFBRTt3REFDRixTQUFTLEVBQUUsSUFBSTt3REFDZixXQUFXLEVBQUUsTUFBTSxDQUFFLElBQUksQ0FBRTtxREFDOUI7aURBQ0osQ0FBQyxFQUFBOzs0Q0FQTixTQU9NLENBQUM7Ozs7aUNBQ1YsQ0FBQyxDQUNMLEVBQUE7O3dCQXJERCxTQXFEQyxDQUFBOzs2QkFHTCxXQUFPLEdBQUcsQ0FBQyxJQUFJLEdBQUc7NEJBQ2QsTUFBTSxFQUFFLEdBQUc7eUJBQ2QsRUFBQTs7O3dCQUdELE9BQU8sQ0FBQyxHQUFHLENBQUUsR0FBQyxDQUFFLENBQUM7d0JBQ2pCLFdBQU8sR0FBRyxDQUFDLElBQUksR0FBRyxFQUFFLE1BQU0sRUFBRSxHQUFHLEVBQUUsRUFBQzs7OzthQUV6QyxDQUFDLENBQUE7UUFXRixHQUFHLENBQUMsTUFBTSxDQUFDLGFBQWEsRUFBRSxVQUFPLEdBQUcsRUFBRSxJQUFJOzs7Ozs7d0JBRTVCLEtBQW9DLEtBQUssQ0FBQyxJQUFJLEVBQTVDLGNBQUcsRUFBRSxXQUFXLGlCQUFBLEVBQUUsV0FBVyxpQkFBQSxDQUFnQjt3QkFHckMsV0FBTSxFQUFFLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQztpQ0FDdkMsS0FBSyxDQUFDO2dDQUNILEdBQUcsT0FBQTtnQ0FDSCxXQUFXLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUM7Z0NBQ3ZCLFVBQVUsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQzs2QkFDMUMsQ0FBQztpQ0FDRCxHQUFHLEVBQUcsRUFBQTs7d0JBTkwsWUFBVSxTQU1MO3dCQUdJLFdBQU0sT0FBTyxDQUFDLEdBQUcsQ0FDNUIsS0FBSyxDQUFDLElBQUksQ0FDTixJQUFJLEdBQUcsQ0FBRSxTQUFPLENBQUMsSUFBSTtpQ0FDaEIsR0FBRyxDQUFFLFVBQUEsQ0FBQyxJQUFJLE9BQUEsQ0FBQyxDQUFDLE1BQU0sRUFBUixDQUFRLENBQUUsQ0FDNUIsQ0FBQztpQ0FDRCxHQUFHLENBQUUsVUFBQSxHQUFHLElBQUksT0FBQSxFQUFFLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQztpQ0FDN0IsS0FBSyxDQUFDO2dDQUNILE1BQU0sRUFBRSxHQUFHOzZCQUNkLENBQUM7aUNBQ0QsR0FBRyxFQUFHLEVBSkUsQ0FJRixDQUFDLENBQ2YsRUFBQTs7d0JBVkssTUFBTSxHQUFHLFNBVWQ7d0JBR29CLFdBQU0sT0FBTyxDQUFDLEdBQUcsQ0FDbEMsS0FBSyxDQUFDLElBQUksQ0FDTixJQUFJLEdBQUcsQ0FBRSxTQUFPLENBQUMsSUFBSTtpQ0FDaEIsR0FBRyxDQUFFLFVBQUEsQ0FBQyxJQUFJLE9BQUEsQ0FBQyxDQUFDLE1BQU0sRUFBUixDQUFRLENBQUUsQ0FDNUIsQ0FBQztpQ0FDRCxHQUFHLENBQUUsVUFBQSxHQUFHLElBQUksT0FBQSxFQUFFLENBQUMsVUFBVSxDQUFDLGFBQWEsQ0FBQztpQ0FDcEMsS0FBSyxDQUFDO2dDQUNILEdBQUcsT0FBQTtnQ0FDSCxNQUFNLEVBQUUsR0FBRzs2QkFDZCxDQUFDO2lDQUNELEdBQUcsRUFBRyxFQUxFLENBS0YsQ0FBQyxDQUNmLEVBQUE7O3dCQVhLLGlCQUFlLFNBV3BCO3dCQUdxQixXQUFNLE9BQU8sQ0FBQyxHQUFHLENBQ25DLEtBQUssQ0FBQyxJQUFJLENBQ04sSUFBSSxHQUFHLENBQUUsU0FBTyxDQUFDLElBQUk7aUNBQ2hCLEdBQUcsQ0FBRSxVQUFBLENBQUMsSUFBSSxPQUFBLENBQUMsQ0FBQyxNQUFNLEVBQVIsQ0FBUSxDQUFFLENBQzVCLENBQUM7aUNBQ0QsR0FBRyxDQUFFLFVBQUEsR0FBRyxJQUFJLE9BQUEsRUFBRSxDQUFDLFVBQVUsQ0FBQyxxQkFBcUIsQ0FBQztpQ0FDNUMsS0FBSyxDQUFDO2dDQUNILEdBQUcsT0FBQTtnQ0FDSCxNQUFNLEVBQUUsR0FBRztnQ0FDWCxJQUFJLEVBQUUsZUFBZTs2QkFDeEIsQ0FBQztpQ0FDRCxHQUFHLEVBQUcsRUFORSxDQU1GLENBQUMsQ0FDZixFQUFBOzt3QkFaSyxrQkFBZ0IsU0FZckI7d0JBR0csYUFBZ0IsRUFBRyxDQUFDOzZCQUNuQixDQUFBLENBQUMsQ0FBQyxXQUFXLElBQUksV0FBVyxLQUFLLFNBQVMsQ0FBQSxFQUExQyxjQUEwQzt3QkFDaEMsV0FBTSxPQUFPLENBQUMsR0FBRyxDQUN4QixLQUFLLENBQUMsSUFBSSxDQUNOLElBQUksR0FBRyxDQUFFLFNBQU8sQ0FBQyxJQUFJO2lDQUNoQixHQUFHLENBQUUsVUFBQSxDQUFDLElBQUksT0FBQSxDQUFDLENBQUMsR0FBRyxFQUFMLENBQUssQ0FBRSxDQUN6QixDQUFDO2lDQUNELEdBQUcsQ0FBRSxVQUFBLEdBQUcsSUFBSSxPQUFBLEVBQUUsQ0FBQyxVQUFVLENBQUMsU0FBUyxDQUFDO2lDQUN4QixHQUFHLENBQUUsR0FBRyxDQUFFO2lDQUNWLEdBQUcsRUFBRyxFQUZOLENBRU0sQ0FBQyxDQUN2QixFQUFBOzt3QkFSRCxVQUFRLEdBQUcsU0FRVixDQUFDOzs7d0JBSUYsYUFBZ0IsRUFBRyxDQUFDOzZCQUNuQixDQUFBLENBQUMsQ0FBQyxXQUFXLElBQUksV0FBVyxLQUFLLFNBQVMsQ0FBQSxFQUExQyxjQUEwQzt3QkFDaEMsV0FBTSxPQUFPLENBQUMsR0FBRyxDQUN4QixLQUFLLENBQUMsSUFBSSxDQUNOLElBQUksR0FBRyxDQUFFLFNBQU8sQ0FBQyxJQUFJO2lDQUNoQixHQUFHLENBQUUsVUFBQSxDQUFDLElBQUksT0FBQSxDQUFDLENBQUMsTUFBTSxFQUFSLENBQVEsQ0FBRSxDQUM1QixDQUFDO2lDQUNELEdBQUcsQ0FBRSxVQUFBLE1BQU0sSUFBSSxPQUFBLEVBQUUsQ0FBQyxVQUFVLENBQUMsUUFBUSxDQUFDO2lDQUNsQyxLQUFLLENBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQztnQ0FDVDtvQ0FDSSxHQUFHLE9BQUE7b0NBQ0gsTUFBTSxRQUFBO29DQUNOLElBQUksRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsV0FBVyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxVQUFVLENBQUMsQ0FBQztpQ0FDbkQsRUFBRTtvQ0FDQyxNQUFNLFFBQUE7b0NBQ04sTUFBTSxFQUFFLEtBQUs7b0NBQ2IsWUFBWSxFQUFFLElBQUk7b0NBQ2xCLElBQUksRUFBRSxVQUFVO2lDQUNuQjs2QkFDSixDQUFDLENBQUM7aUNBQ0YsR0FBRyxFQUFHLEVBYkssQ0FhTCxDQUNWLENBQ0osRUFBQTs7d0JBcEJELFVBQVEsR0FBRyxTQW9CVixDQUFDOzs7d0JBR0EsU0FBUyxHQUFHLE1BQU0sQ0FBQyxHQUFHLENBQUMsVUFBRSxLQUFLLEVBQUUsQ0FBQzs0QkFFbkMsSUFBTSxJQUFJLEdBQUcsS0FBSyxDQUFDLElBQUksQ0FBRSxDQUFDLENBQUUsQ0FBQzs0QkFFN0IsSUFBTSxNQUFNLEdBQUcsU0FBTyxDQUFDLElBQUk7aUNBQ3RCLE1BQU0sQ0FBRSxVQUFBLENBQUMsSUFBSSxPQUFBLENBQUMsQ0FBQyxNQUFNLEtBQUssSUFBSSxDQUFDLE1BQU0sRUFBeEIsQ0FBd0IsQ0FBRSxDQUFDOzRCQUU3QyxJQUFNLE9BQU8sR0FBRyxVQUFRLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDO2dDQUNqQyxVQUFRO3FDQUNILEdBQUcsQ0FBRSxVQUFBLENBQUMsSUFBSSxPQUFBLENBQUMsQ0FBQyxJQUFJLEVBQU4sQ0FBTSxDQUFFO3FDQUNsQixNQUFNLENBQUUsVUFBQSxDQUFDLElBQUksT0FBQSxDQUFDLENBQUMsTUFBTSxLQUFLLElBQUksQ0FBQyxNQUFNLEVBQXhCLENBQXdCLENBQUUsQ0FBQyxDQUFDO2dDQUM5QyxTQUFTLENBQUM7NEJBRWQsSUFBTSxPQUFPLEdBQUcsVUFBUSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQztnQ0FDakMsVUFBUTtxQ0FDSCxHQUFHLENBQUUsVUFBQSxDQUFDLElBQUksT0FBQSxDQUFDLENBQUMsSUFBSSxFQUFOLENBQU0sQ0FBRTtxQ0FDbEIsTUFBTSxDQUFFLFVBQUEsQ0FBQyxJQUFJLE9BQUEsQ0FBQyxDQUFDLE1BQU0sR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFFLENBQUMsQ0FBRSxDQUFDLE1BQU0sS0FBSyxJQUFJLENBQUMsTUFBTSxFQUE3QyxDQUE2QyxDQUFFLENBQUMsQ0FBQztnQ0FDbkUsU0FBUyxDQUFDOzRCQUVkLElBQU0sVUFBVSxHQUFHLGNBQVksQ0FBRSxDQUFDLENBQUUsQ0FBQyxJQUFJLENBQUUsQ0FBQyxDQUFFLElBQUksQ0FBQyxDQUFDOzRCQUVwRCxJQUFNLFlBQVksR0FBRyxDQUFDLGVBQWEsQ0FBRSxDQUFDLENBQUUsQ0FBQyxJQUFJLENBQUUsQ0FBQyxDQUFFLElBQUksRUFBRyxDQUFDLENBQUMsS0FBSyxJQUFJLENBQUMsQ0FBQzs0QkFFdEUsT0FBTztnQ0FDSCxJQUFJLE1BQUE7Z0NBQ0osTUFBTSxRQUFBO2dDQUNOLE9BQU8sU0FBQTtnQ0FDUCxVQUFVLFlBQUE7Z0NBQ1YsWUFBWSxjQUFBO2dDQUNaLE9BQU8sRUFBRSxDQUFDLENBQUMsQ0FBQyxPQUFPLElBQUksT0FBTyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUUsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFFLENBQUMsQ0FBRSxDQUFDLENBQUMsQ0FBQyxFQUFHOzZCQUNuRSxDQUFDO3dCQUNOLENBQUMsQ0FBQyxDQUFDO3dCQUVILFdBQU8sR0FBRyxDQUFDLElBQUksR0FBRztnQ0FDZCxNQUFNLEVBQUUsR0FBRztnQ0FDWCxJQUFJLEVBQUUsU0FBUzs2QkFDbEIsRUFBQTs7O3dCQUdELE9BQU8sQ0FBQyxHQUFHLENBQUUsS0FBSyxFQUFFLEdBQUMsQ0FBRSxDQUFDO3dCQUN4QixXQUFPLEdBQUcsQ0FBQyxJQUFJLEdBQUcsRUFBRSxNQUFNLEVBQUUsR0FBRyxFQUFFLEVBQUM7Ozs7YUFFekMsQ0FBQyxDQUFDO1FBU0gsR0FBRyxDQUFDLE1BQU0sQ0FBQyxjQUFjLEVBQUUsVUFBTyxHQUFHLEVBQUUsSUFBSTs7Ozs7O3dCQUU3QixNQUFNLEdBQUcsS0FBSyxDQUFDLElBQUksQ0FBQyxNQUFNLElBQUksS0FBSyxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUM7d0JBQ3BELEtBQWdDLEtBQUssQ0FBQyxJQUFJLEVBQXhDLGNBQUcsRUFBRSxHQUFHLFNBQUEsRUFBRSxHQUFHLFNBQUEsRUFBRSxHQUFHLFNBQUEsRUFBRSxLQUFLLFdBQUEsQ0FBZ0I7d0JBRTNDLFFBQVEsR0FBRyxVQUFBLE9BQU8sSUFBSSxPQUFBLEdBQUcsQ0FBQyxJQUFJLEdBQUc7NEJBQ25DLE9BQU8sU0FBQTs0QkFDUCxNQUFNLEVBQUUsR0FBRzt5QkFDZCxFQUgyQixDQUczQixDQUFBO3dCQUtjLFdBQU0sRUFBRSxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUM7aUNBQ3RDLEdBQUcsQ0FBRSxLQUFHLENBQUU7aUNBQ1YsR0FBRyxFQUFHLEVBQUE7O3dCQUZMLE1BQU0sR0FBRyxTQUVKO3dCQUVYLElBQUssTUFBTSxDQUFDLElBQUksQ0FBQyxXQUFXLEtBQUssR0FBRyxFQUFHOzRCQUNuQyxXQUFPLFFBQVEsQ0FBQyxXQUFXLENBQUMsRUFBQzt5QkFFaEM7NkJBQU0sSUFBSyxNQUFNLENBQUMsSUFBSSxDQUFDLFdBQVcsS0FBSyxHQUFHLEVBQUc7NEJBQzFDLFdBQU8sUUFBUSxDQUFDLFdBQVcsQ0FBQyxFQUFDO3lCQUNoQzt3QkFLaUIsV0FBTSxFQUFFLENBQUMsVUFBVSxDQUFDLGVBQWUsQ0FBQztpQ0FDakQsS0FBSyxDQUFDO2dDQUNILEdBQUcsS0FBQSxFQUFFLEdBQUcsS0FBQSxFQUFFLEdBQUcsS0FBQTs2QkFDaEIsQ0FBQztpQ0FDRCxHQUFHLEVBQUcsRUFBQTs7d0JBSkwsU0FBUyxHQUFHLFNBSVA7d0JBQ0wsUUFBUSxHQUFHLFNBQVMsQ0FBQyxJQUFJLENBQUUsQ0FBQyxDQUFFLENBQUM7d0JBQ2pCLFdBQU0sRUFBRSxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUM7aUNBQzNDLEtBQUssQ0FBQztnQ0FDSCxHQUFHLEtBQUEsRUFBRSxHQUFHLEtBQUEsRUFBRSxHQUFHLEtBQUE7Z0NBQ2IsVUFBVSxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDO2dDQUN0QixXQUFXLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBRSxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQzs2QkFDdEQsQ0FBQztpQ0FDRCxHQUFHLEVBQUcsRUFBQTs7d0JBTkwsV0FBVyxHQUFHLFNBTVQ7d0JBRUwsVUFBVSxHQUFHLFdBQVcsQ0FBQyxJQUFJLENBQUM7d0JBQzlCLFVBQVUsR0FBUSxVQUFVOzZCQUM3QixNQUFNLENBQUUsVUFBQSxDQUFDLElBQUksT0FBQSxDQUFDLENBQUMsR0FBRyxLQUFLLEtBQUcsRUFBYixDQUFhLENBQUU7NkJBQzVCLE1BQU0sQ0FBQyxVQUFFLENBQUMsRUFBRSxDQUFDOzRCQUNWLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQyxjQUFjLElBQUksQ0FBQyxDQUFBO3dCQUNwQyxDQUFDLEVBQUUsQ0FBQyxDQUFFLENBQUM7d0JBRVgsSUFBSyxLQUFLLEdBQUcsVUFBVSxHQUFHLFFBQVEsQ0FBQyxRQUFRLEVBQUc7NEJBQzFDLFdBQU8sUUFBUSxDQUFDLG1GQUFnQixRQUFRLENBQUMsUUFBUSxpQkFBSSxDQUFDLEVBQUM7eUJBQzFEO3dCQUdELFdBQU0sRUFBRSxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUM7aUNBQ3ZCLEdBQUcsQ0FBRSxLQUFHLENBQUU7aUNBQ1YsTUFBTSxDQUFDO2dDQUNKLElBQUksRUFBRTtvQ0FDRixjQUFjLEVBQUUsS0FBSztpQ0FDeEI7NkJBQ0osQ0FBQyxFQUFBOzt3QkFOTixTQU1NLENBQUM7NkJBTUYsQ0FBQSxLQUFLLEdBQUcsVUFBVSxHQUFHLFFBQVEsQ0FBQyxRQUFRLENBQUEsRUFBdEMsY0FBc0M7d0JBRWpDLFdBQVcsR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDLEVBQUcsRUFBRSxRQUFRLEVBQUU7NEJBQzdDLGFBQWEsRUFBRSxRQUFRLENBQUMsUUFBUSxHQUFHLENBQUUsS0FBSyxHQUFHLFVBQVUsQ0FBRTt5QkFDNUQsQ0FBQyxDQUFDO3dCQUNILE9BQU8sV0FBVyxDQUFDLEtBQUssQ0FBQyxDQUFDO3dCQUUxQixXQUFNLEVBQUUsQ0FBQyxVQUFVLENBQUMsZUFBZSxDQUFDO2lDQUMvQixHQUFHLENBQUUsTUFBTSxDQUFFLFFBQVEsQ0FBQyxHQUFHLENBQUUsQ0FBQztpQ0FDNUIsR0FBRyxDQUFDO2dDQUNELElBQUksRUFBRSxXQUFXOzZCQUNwQixDQUFDLEVBQUE7O3dCQUpOLFNBSU0sQ0FBQzs7NEJBR1gsV0FBTyxHQUFHLENBQUMsSUFBSSxHQUFHOzRCQUNkLE1BQU0sRUFBRSxHQUFHO3lCQUNkLEVBQUE7Ozt3QkFHRCxXQUFPLEdBQUcsQ0FBQyxJQUFJLEdBQUcsRUFBRSxNQUFNLEVBQUUsR0FBRyxFQUFFLEVBQUE7Ozs7YUFFeEMsQ0FBQyxDQUFBO1FBd0JGLEdBQUcsQ0FBQyxNQUFNLENBQUMsY0FBYyxFQUFFLFVBQU8sR0FBRyxFQUFFLElBQUk7Ozs7Ozt3QkFJL0IseUJBRUEsRUFBRyxDQUFDO3dCQUVGLEtBQWdDLEtBQUssQ0FBQyxJQUFJLEVBQXhDLEdBQUcsU0FBQSxFQUFFLG9CQUFNLEVBQUUsWUFBWSxrQkFBQSxDQUFnQjt3QkFDM0MsUUFBUSxHQUFHLFVBQUEsT0FBTyxJQUFJLE9BQUEsR0FBRyxDQUFDLElBQUksR0FBRzs0QkFDbkMsT0FBTyxTQUFBOzRCQUNQLE1BQU0sRUFBRSxHQUFHO3lCQUNkLEVBSDJCLENBRzNCLENBQUM7d0JBRVksV0FBTSxFQUFFLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQztpQ0FDcEMsR0FBRyxDQUFFLEdBQUcsQ0FBRTtpQ0FDVixHQUFHLEVBQUcsRUFBQTs7d0JBRkwsS0FBSyxHQUFHLFNBRUg7d0JBQ0wsSUFBSSxHQUFHLEtBQUssQ0FBQyxJQUFJLENBQUM7d0JBR3hCLElBQUssTUFBTSxDQUFFLElBQUksQ0FBRSxHQUFHLElBQUksQ0FBQyxRQUFRLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFHOzRCQUNwRCxXQUFPLFFBQVEsQ0FBQyxpQkFBaUIsQ0FBQyxFQUFDO3lCQUV0Qzs2QkFBTSxJQUFLLElBQUksQ0FBQyxjQUFjLElBQUssSUFBSSxDQUFDLGNBQWMsSUFBSSxDQUFDLEVBQUc7NEJBQzNELFdBQU8sUUFBUSxDQUFDLG1DQUFRLElBQUksQ0FBQyxjQUFjLHVCQUFLLENBQUMsRUFBQzt5QkFFckQ7d0JBR0QsV0FBTSxPQUFPLENBQUMsR0FBRyxDQUFFLFFBQU0sQ0FBQyxHQUFHLENBQUUsVUFBQSxLQUFLOztnQ0FHaEMsSUFBTSxRQUFRLEdBQUcsQ0FBQyxDQUFDLFFBQU0sQ0FBQyxJQUFJLENBQUUsVUFBQSxDQUFDO29DQUM3QixPQUFPLENBQUMsQ0FBQyxHQUFHLEtBQUssS0FBSyxDQUFDLEdBQUc7d0NBQ3RCLENBQUMsQ0FBQyxNQUFNLEtBQUssS0FBSyxDQUFDLE1BQU07d0NBQ3pCLENBQUMsQ0FBQyxHQUFHLEtBQUssS0FBSyxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsR0FBRyxLQUFLLEtBQUssQ0FBQyxHQUFHO3dDQUMxQyxDQUFDLENBQUMsY0FBYyxHQUFHLENBQUMsSUFBSSxLQUFLLENBQUMsY0FBYyxHQUFHLENBQUM7d0NBQ2hELENBQUMsQ0FBQyxDQUFDLENBQUMsbUJBQW1CLENBQUE7Z0NBQy9CLENBQUMsQ0FBQyxDQUFDO2dDQUVILElBQUssUUFBUSxFQUFHO29DQUNaLHNCQUFvQixHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUMsRUFBRyxFQUFFLHNCQUFvQjt3Q0FDMUQsR0FBRSxLQUFLLENBQUMsTUFBTSxJQUFJLHNCQUFvQixDQUFFLEtBQUssQ0FBQyxNQUFNLENBQUUsS0FBSyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsc0JBQW9CLENBQUUsS0FBSyxDQUFDLE1BQU0sQ0FBRSxHQUFHLENBQUM7NENBQ3JILENBQUM7aUNBQ047Z0NBRUQsT0FBTyxFQUFFLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQztxQ0FDeEIsR0FBRyxDQUFFLEtBQUssQ0FBQyxHQUFHLENBQUU7cUNBQ2hCLE1BQU0sQ0FBQztvQ0FDSixJQUFJLEVBQUU7d0NBQ0YsUUFBUSxVQUFBO3dDQUNSLFdBQVcsRUFBRSxHQUFHO3FDQUNuQjtpQ0FDSixDQUFDLENBQUE7NEJBQ1YsQ0FBQyxDQUFDLENBQUMsRUFBQTs7d0JBekJILFNBeUJHLENBQUM7d0JBVUUsS0FBSyxHQUFHLEtBQUssQ0FBQyxJQUFJLENBQ3BCLElBQUksR0FBRyxDQUNILFFBQU07NkJBQ0QsR0FBRyxDQUFFLFVBQUEsS0FBSyxJQUFJLE9BQUEsS0FBSyxDQUFDLE1BQU0sRUFBWixDQUFZLENBQUU7NkJBQzVCLE1BQU0sQ0FBRSxVQUFBLE1BQU07NEJBQ1gsT0FBTyxDQUFDLENBQUMsUUFBTSxDQUFDLElBQUksQ0FBRSxVQUFBLEtBQUs7Z0NBQ3ZCLE9BQU8sS0FBSyxDQUFDLE1BQU0sS0FBSyxNQUFNLElBQUksTUFBTSxDQUFFLEtBQUssQ0FBQyxVQUFVLENBQUUsS0FBSyxHQUFHLENBQUE7NEJBQ3hFLENBQUMsQ0FBQyxDQUFDO3dCQUNQLENBQUMsQ0FBQyxDQUNULENBQ0osQ0FBQzt3QkFHUyxXQUFNLE9BQU8sQ0FBQyxHQUFHLENBQUUsS0FBSyxDQUFDLEdBQUcsQ0FBRSxVQUFBLE1BQU07Z0NBRTNDLElBQU0sTUFBTSxHQUFHLFFBQU0sQ0FBQyxJQUFJLENBQUUsVUFBQSxLQUFLLElBQUksT0FBQSxLQUFLLENBQUMsTUFBTSxLQUFLLE1BQU07b0NBQ3hELENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxTQUFTLElBQUksQ0FBQyxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUUsRUFETixDQUNNLENBQUMsQ0FBQztnQ0FxQjdDLE9BQU8sS0FBSyxDQUFDLFlBQVksQ0FBQztvQ0FDdEIsSUFBSSxFQUFFO3dDQUNGLElBQUksRUFBRTs0Q0FDRixNQUFNLFFBQUE7NENBQ04sSUFBSSxFQUFFLFVBQVU7NENBQ2hCLFNBQVMsRUFBRSxNQUFNLENBQUMsU0FBUzs0Q0FDM0IsS0FBSyxFQUFFLENBQUMsWUFBWSxFQUFDLE1BQU0sQ0FBQzt5Q0FDL0I7d0NBQ0QsSUFBSSxFQUFFLGdCQUFnQjtxQ0FDekI7b0NBQ0QsSUFBSSxFQUFFLFFBQVE7aUNBQ2pCLENBQUMsQ0FBQzs0QkFFUCxDQUFDLENBQUMsQ0FBQyxFQUFBOzt3QkFyQ0csRUFBRSxHQUFHLFNBcUNSO3dCQUdILFdBQU0sRUFBRSxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUM7aUNBQ3RCLEdBQUcsQ0FBRSxHQUFHLENBQUU7aUNBQ1YsTUFBTSxDQUFDO2dDQUNKLElBQUksRUFBRTtvQ0FDRixjQUFjLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBRSxDQUFDLENBQUU7aUNBQzdCOzZCQUNKLENBQUMsRUFBQTs7d0JBTk4sU0FNTSxDQUFDO3dCQUVQLFdBQU8sR0FBRyxDQUFDLElBQUksR0FBRztnQ0FDZCxNQUFNLEVBQUUsR0FBRztnQ0FFWCxJQUFJLEVBQUUsQ0FBQyxHQUFHLENBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxjQUFjLENBQUU7NkJBQ3hDLEVBQUE7Ozt3QkFHRCxXQUFPLEdBQUcsQ0FBQyxJQUFJLEdBQUcsRUFBRSxNQUFNLEVBQUUsR0FBRyxFQUFFLEVBQUM7Ozs7YUFFekMsQ0FBQyxDQUFBO1FBcUJGLEdBQUcsQ0FBQyxNQUFNLENBQUMsVUFBVSxFQUFFLFVBQU8sR0FBRyxFQUFFLElBQUk7Ozs7Ozt3QkFFekIsTUFBTSxHQUFHLEtBQUssQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDO3dCQUMvQixLQUFvRCxLQUFLLENBQUMsSUFBSSxFQUE1RCxjQUFHLEVBQUUsUUFBUSxjQUFBLEVBQUUsTUFBTSxZQUFBLEVBQUUsT0FBTyxhQUFBLEVBQUUsYUFBYSxtQkFBQSxDQUFnQjt3QkFFdkQsV0FBTSxFQUFFLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQztpQ0FDcEMsS0FBSyxDQUFDO2dDQUNILE1BQU0sUUFBQTs2QkFDVCxDQUFDO2lDQUNELEdBQUcsRUFBRyxFQUFBOzt3QkFKTCxLQUFLLEdBQUcsU0FJSDt3QkFDTCxJQUFJLEdBQUcsS0FBSyxDQUFDLElBQUksQ0FBRSxDQUFDLENBQUUsQ0FBQzt3QkFDdkIsR0FBRyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUM7d0JBR2YscUJBQXFCLEdBQUcsSUFBSSxDQUFDLGFBQWEsR0FBRyxhQUFhLEdBQUcsQ0FBQyxDQUFDLENBQUM7NEJBQ2xFLElBQUksQ0FBQyxhQUFhLEdBQUcsYUFBYSxDQUFDLENBQUM7NEJBQ3BDLENBQUMsQ0FBQzt3QkFFQSxRQUFRLHlCQUNQLElBQUksS0FDUCxRQUFRLEVBQUUsQ0FBRSxJQUFJLENBQUMsUUFBUSxJQUFJLENBQUMsQ0FBRSxHQUFHLENBQUUsUUFBUSxJQUFJLENBQUMsQ0FBRSxFQUNwRCxhQUFhLEVBQUUsQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLENBQUM7Z0NBQ2hDLENBQUMsQ0FBQyxDQUFDO2dDQUNILHFCQUFxQixHQUM1QixDQUFDO3dCQUVGLE9BQU8sUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDO3dCQUl2QixXQUFNLEVBQUUsQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDO2lDQUN0QixHQUFHLENBQUUsTUFBTSxDQUFFLEdBQUcsQ0FBRSxDQUFDO2lDQUNuQixHQUFHLENBQUM7Z0NBQ0QsSUFBSSxFQUFFLFFBQVE7NkJBQ2pCLENBQUMsRUFBQTs7d0JBSk4sU0FJTSxDQUFDOzZCQUdGLENBQUMsQ0FBQyxhQUFhLEVBQWYsY0FBZTt3QkFDQSxXQUFNLEVBQUUsQ0FBQyxVQUFVLENBQUMscUJBQXFCLENBQUM7aUNBQ3JELEtBQUssQ0FBQztnQ0FDSCxJQUFJLEVBQUU7b0NBQ0YsR0FBRyxPQUFBO29DQUNILE1BQU0sUUFBQTtvQ0FDTixJQUFJLEVBQUUsZUFBZTtpQ0FDeEI7NkJBQ0osQ0FBQztpQ0FDRCxHQUFHLEVBQUcsRUFBQTs7d0JBUkwsT0FBTyxHQUFHLFNBUUw7d0JBQ0wsTUFBTSxHQUFHLE9BQU8sQ0FBQyxJQUFJLENBQUUsQ0FBQyxDQUFFLENBQUM7NkJBRTVCLENBQUEsQ0FBQyxDQUFDLE1BQU0sSUFBSSxDQUFDLENBQUMsYUFBYSxDQUFBLEVBQTNCLGNBQTJCO3dCQUM1QixXQUFNLEVBQUUsQ0FBQyxVQUFVLENBQUMscUJBQXFCLENBQUM7aUNBQ3JDLEdBQUcsQ0FBRSxNQUFNLENBQUUsTUFBTSxDQUFDLEdBQUcsQ0FBRSxDQUFDO2lDQUMxQixNQUFNLENBQUM7Z0NBQ0osSUFBSSxFQUFFO29DQUNGLEtBQUssRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFFLGFBQWEsQ0FBRTtpQ0FDaEM7NkJBQ0osQ0FBQyxFQUFBOzt3QkFOTixTQU1NLENBQUM7Ozs2QkFDQyxDQUFBLENBQUMsTUFBTSxJQUFJLENBQUMsQ0FBQyxhQUFhLENBQUEsRUFBMUIsY0FBMEI7d0JBQ2xDLFdBQU0sRUFBRSxDQUFDLFVBQVUsQ0FBQyxxQkFBcUIsQ0FBQztpQ0FDckMsR0FBRyxDQUFDO2dDQUNELElBQUksRUFBRTtvQ0FDRixHQUFHLE9BQUE7b0NBQ0gsTUFBTSxRQUFBO29DQUNOLEtBQUssRUFBRSxhQUFhO29DQUNwQixJQUFJLEVBQUUsZUFBZTtpQ0FDeEI7NkJBQ0osQ0FBQyxFQUFBOzt3QkFSTixTQVFNLENBQUM7OzRCQUtmLFdBQU0sT0FBTyxDQUFDLEdBQUcsQ0FBRSxNQUFNLENBQUMsR0FBRyxDQUFFLFVBQUEsS0FBSzs0QkFDaEMsT0FBTyxPQUFPLENBQUMsR0FBRyxDQUFDO2dDQUNmLEVBQUUsQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDO3FDQUNqQixHQUFHLENBQUUsS0FBSyxDQUFDLEdBQUcsQ0FBRTtxQ0FDaEIsTUFBTSxDQUFDO29DQUNKLElBQUksRUFBRTt3Q0FDRixXQUFXLEVBQUUsR0FBRzt3Q0FDaEIsVUFBVSxFQUFFLEdBQUc7d0NBQ2YsV0FBVyxFQUFFLEtBQUssQ0FBQyxXQUFXO3dDQUM5QixPQUFPLEVBQUUsTUFBTSxDQUFFLElBQUksQ0FBRTtxQ0FDMUI7aUNBQ0osQ0FBQztnQ0FDTixFQUFFLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQztxQ0FDakIsR0FBRyxDQUFFLEtBQUssQ0FBQyxHQUFHLENBQUU7cUNBQ2hCLE1BQU0sQ0FBQztvQ0FDSixJQUFJLEVBQUU7d0NBQ0YsS0FBSyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUUsS0FBSyxDQUFDLGNBQWMsQ0FBRTtxQ0FDdkM7aUNBQ0osQ0FBQzs2QkFDVCxDQUFDLENBQUE7d0JBQ04sQ0FBQyxDQUFDLENBQUMsRUFBQTs7d0JBcEJILFNBb0JHLENBQUM7d0JBR0osV0FBTSxPQUFPLENBQUMsR0FBRyxDQUFFLE9BQU8sQ0FBQyxHQUFHLENBQUUsVUFBQSxRQUFRO2dDQUNwQyxPQUFPLEVBQUUsQ0FBQyxVQUFVLENBQUMsUUFBUSxDQUFDO3FDQUN6QixHQUFHLENBQUUsUUFBUSxDQUFFO3FDQUNmLE1BQU0sQ0FBQztvQ0FDSixJQUFJLEVBQUU7d0NBQ0YsTUFBTSxFQUFFLElBQUk7d0NBQ1osTUFBTSxFQUFFLEtBQUc7d0NBQ1gsWUFBWSxFQUFFLEtBQUs7cUNBQ3RCO2lDQUNKLENBQUMsQ0FBQTs0QkFDVixDQUFDLENBQUMsQ0FBQyxFQUFBOzt3QkFWSCxTQVVHLENBQUM7d0JBSVUsV0FBTSxFQUFFLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQztpQ0FDcEMsR0FBRyxDQUFFLEtBQUcsQ0FBRTtpQ0FDVixHQUFHLEVBQUcsRUFBQTs7d0JBRkwsS0FBSyxHQUFHLFNBRUg7d0JBRVAsR0FBRyxHQUFHOzRCQUNOLE1BQU0sRUFBRTtnQ0FDSixNQUFNLEVBQUUsR0FBRzs2QkFDZDt5QkFDSixDQUFBO3dCQUVLLEtBQTRDLEtBQUssQ0FBQyxJQUFJLEVBQXBELGtCQUFrQix3QkFBQSxFQUFFLGlCQUFpQix1QkFBQSxDQUFnQjt3QkFFdkQsSUFBSSxHQUFHOzRCQUNULE1BQU0sRUFBRSxNQUFNOzRCQUNkLE9BQU8sRUFBRSxLQUFHOzRCQUNaLElBQUksRUFBRSxVQUFVOzRCQUNoQixLQUFLLEVBQUUsT0FBTzs0QkFDZCxZQUFZLEVBQUUsSUFBSTs0QkFDbEIsTUFBTSxFQUFFLEtBQUs7NEJBQ2IsT0FBTyxFQUFFLGtCQUFrQixJQUFJLENBQUM7NEJBQ2hDLEtBQUssRUFBRSxpQkFBaUI7eUJBQzNCLENBQUM7NkJBR0csQ0FBQyxDQUFDLGlCQUFpQixFQUFuQixlQUFtQjt3QkFHQSxXQUFNLEVBQUUsQ0FBQyxVQUFVLENBQUMsUUFBUSxDQUFDO2lDQUM1QyxLQUFLLENBQUM7Z0NBQ0gsSUFBSSxFQUFFLFVBQVU7Z0NBQ2hCLE1BQU0sRUFBRSxLQUFLO2dDQUNiLFlBQVksRUFBRSxJQUFJOzZCQUNyQixDQUFDO2lDQUNELEdBQUcsRUFBRyxFQUFBOzt3QkFOTCxXQUFXLEdBQUcsU0FNVDs2QkFFTixXQUFXLENBQUMsSUFBSSxDQUFFLENBQUMsQ0FBRSxFQUFyQixlQUFxQjt3QkFDdEIsV0FBTSxFQUFFLENBQUMsVUFBVSxDQUFDLFFBQVEsQ0FBQztpQ0FDeEIsR0FBRyxDQUFFLE1BQU0sQ0FBRSxXQUFXLENBQUMsSUFBSSxDQUFFLENBQUMsQ0FBRSxDQUFDLEdBQUcsQ0FBRSxDQUFDO2lDQUN6QyxNQUFNLEVBQUcsRUFBQTs7d0JBRmQsU0FFYyxDQUFDOzs2QkFJYixXQUFNLEtBQUssQ0FBQyxZQUFZLENBQUM7NEJBQzNCLElBQUksRUFBRTtnQ0FDRixJQUFJLEVBQUUsSUFBSTtnQ0FDVixJQUFJLEVBQUUsUUFBUTs2QkFDakI7NEJBQ0QsSUFBSSxFQUFFLFFBQVE7eUJBQ2pCLENBQUMsRUFBQTs7d0JBTkYsR0FBRyxHQUFHLFNBTUosQ0FBQzs7NkJBR1AsV0FBTyxHQUFHLENBQUMsSUFBSSxHQUFHOzRCQUNkLE1BQU0sRUFBRSxHQUFHOzRCQUNYLElBQUksRUFBRSxHQUFHLENBQUMsTUFBTSxDQUFDLE1BQU0sS0FBSyxHQUFHLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSTt5QkFDaEQsRUFBQTs7O3dCQUdELFdBQU8sR0FBRyxDQUFDLElBQUksR0FBRyxFQUFFLE1BQU0sRUFBRSxHQUFHLEVBQUUsRUFBQTs7OzthQUV4QyxDQUFDLENBQUM7UUFNSCxHQUFHLENBQUMsTUFBTSxDQUFDLFFBQVEsRUFBRSxVQUFPLEdBQUcsRUFBRSxJQUFJOzs7Ozs7d0JBRXZCLEtBQW9CLEtBQUssQ0FBQyxJQUFJLEVBQTVCLEdBQUcsU0FBQSxFQUFFLFFBQVEsY0FBQSxDQUFnQjt3QkFDakMsTUFBTSxHQUFHOzRCQUNULEdBQUcsS0FBQTt5QkFDTixDQUFDO3dCQUVGLElBQUssUUFBUSxFQUFHOzRCQUNaLE1BQU0sR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDLEVBQUcsRUFBRSxNQUFNLEVBQUU7Z0NBQ2hDLFVBQVUsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFFLFFBQVEsQ0FBRTs2QkFDaEMsQ0FBQyxDQUFDO3lCQUNOO3dCQUVhLFdBQU0sRUFBRSxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUM7aUNBQ3JDLEtBQUssQ0FBRSxNQUFNLENBQUU7aUNBQ2YsS0FBSyxFQUFHLEVBQUE7O3dCQUZQLEtBQUssR0FBRyxTQUVEO3dCQUViLFdBQU8sR0FBRyxDQUFDLElBQUksR0FBRztnQ0FDZCxNQUFNLEVBQUUsR0FBRztnQ0FDWCxJQUFJLEVBQUUsS0FBSyxDQUFDLEtBQUs7NkJBQ3BCLEVBQUE7Ozt3QkFFVyxXQUFPLEdBQUcsQ0FBQyxJQUFJLEdBQUcsRUFBRSxNQUFNLEVBQUUsR0FBRyxFQUFFLEVBQUM7Ozs7YUFDckQsQ0FBQyxDQUFDO1FBTUgsR0FBRyxDQUFDLE1BQU0sQ0FBQyxVQUFVLEVBQUUsVUFBTyxHQUFHLEVBQUUsSUFBSTs7Ozs7O3dCQUd6QixLQUFLLEdBQUcsRUFBRSxDQUFDO3dCQUNYLEtBQWdCLEtBQUssQ0FBQyxJQUFJLEVBQXhCLEdBQUcsU0FBQSxFQUFFLElBQUksVUFBQSxDQUFnQjt3QkFFM0IsTUFBTSxHQUFHOzRCQUNYLEdBQUcsS0FBQTs0QkFDSCxVQUFVLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUM7eUJBQ3pCLENBQUM7d0JBRWEsV0FBTSxFQUFFLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQztpQ0FDdEMsS0FBSyxDQUFFLE1BQU0sQ0FBRTtpQ0FDZixLQUFLLEVBQUcsRUFBQTs7d0JBRlAsTUFBTSxHQUFHLFNBRUY7d0JBRUcsV0FBTSxFQUFFLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQztpQ0FDdkMsS0FBSyxDQUFFLE1BQU0sQ0FBRTtpQ0FDZixLQUFLLENBQUUsS0FBSyxDQUFFO2lDQUNkLElBQUksQ0FBQyxDQUFFLElBQUksR0FBRyxDQUFDLENBQUUsR0FBRyxLQUFLLENBQUU7aUNBQzNCLE9BQU8sQ0FBQyxZQUFZLEVBQUUsTUFBTSxDQUFDO2lDQUM3QixHQUFHLEVBQUcsRUFBQTs7d0JBTEwsT0FBTyxHQUFHLFNBS0w7d0JBRUwsSUFBSSxHQUFHLEtBQUssQ0FBQyxJQUFJLENBQ25CLElBQUksR0FBRyxDQUNILE9BQU8sQ0FBQyxJQUFJOzZCQUNQLEdBQUcsQ0FBRSxVQUFBLENBQUMsSUFBSSxPQUFBLENBQUMsQ0FBQyxHQUFHLEVBQUwsQ0FBSyxDQUFFLENBQ3pCLENBQ0osQ0FBQzt3QkFFSSxJQUFJLEdBQUcsS0FBSyxDQUFDLElBQUksQ0FDbkIsSUFBSSxHQUFHLENBQ0gsT0FBTyxDQUFDLElBQUk7NkJBQ1AsR0FBRyxDQUFFLFVBQUEsQ0FBQyxJQUFJLE9BQUEsQ0FBQyxDQUFDLEdBQUcsRUFBTCxDQUFLLENBQUU7NkJBQ2pCLE1BQU0sQ0FBRSxVQUFBLENBQUMsSUFBSSxPQUFBLENBQUMsQ0FBQyxDQUFDLEVBQUgsQ0FBRyxDQUFFLENBQzFCLENBQ0osQ0FBQzt3QkFFSSxJQUFJLEdBQUcsS0FBSyxDQUFDLElBQUksQ0FDbkIsSUFBSSxHQUFHLENBQ0gsT0FBTyxDQUFDLElBQUk7NkJBQ1AsR0FBRyxDQUFFLFVBQUEsQ0FBQyxJQUFJLE9BQUEsQ0FBQyxDQUFDLE1BQU0sRUFBUixDQUFRLENBQUU7NkJBQ3BCLE1BQU0sQ0FBRSxVQUFBLENBQUMsSUFBSSxPQUFBLENBQUMsQ0FBQyxDQUFDLEVBQUgsQ0FBRyxDQUFFLENBQzFCLENBQ0osQ0FBQzt3QkF3QmMsV0FBTSxPQUFPLENBQUMsR0FBRyxDQUM3QixJQUFJLENBQUMsR0FBRyxDQUNKLFVBQUEsTUFBTSxJQUFJLE9BQUEsRUFBRSxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUM7aUNBQzFCLEtBQUssQ0FBQztnQ0FDSCxNQUFNLFFBQUE7NkJBQ1QsQ0FBQztpQ0FDRCxLQUFLLENBQUM7Z0NBQ0gsTUFBTSxFQUFFLElBQUk7Z0NBQ1osU0FBUyxFQUFFLElBQUk7Z0NBQ2YsUUFBUSxFQUFFLElBQUk7NkJBQ2pCLENBQUM7aUNBQ0QsR0FBRyxFQUFHLEVBVEQsQ0FTQyxDQUNkLENBQ0osRUFBQTs7d0JBYkssT0FBTyxHQUFHLFNBYWY7d0JBQ0ssV0FBUyxPQUFPLENBQUMsR0FBRyxDQUFFLFVBQUEsQ0FBQyxJQUFJLE9BQUEsQ0FBQyxDQUFDLElBQUksQ0FBRSxDQUFDLENBQUUsRUFBWCxDQUFXLENBQUMsQ0FBQzt3QkFFeEMsSUFBSSxHQUFHLE9BQU8sQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFFLFVBQUEsS0FBSzs0QkFFaEMsSUFBTSxJQUFJLEdBQUcsUUFBTSxDQUFDLElBQUksQ0FBRSxVQUFBLElBQUksSUFBSSxPQUFBLElBQUksQ0FBQyxNQUFNLEtBQUssS0FBSyxDQUFDLE1BQU0sRUFBNUIsQ0FBNEIsQ0FBRSxDQUFDOzRCQUlqRSxPQUFPLE1BQU0sQ0FBQyxNQUFNLENBQUMsRUFBRyxFQUFFLEtBQUssRUFBRTtnQ0FDN0IsSUFBSSxNQUFBOzZCQUdQLENBQUMsQ0FBQTt3QkFDTixDQUFDLENBQUMsQ0FBQzt3QkFFSCxXQUFPLEdBQUcsQ0FBQyxJQUFJLEdBQUc7Z0NBQ2QsTUFBTSxFQUFFLEdBQUc7Z0NBQ1gsSUFBSSxFQUFFO29DQUNGLElBQUksTUFBQTtvQ0FDSixRQUFRLEVBQUUsS0FBSztvQ0FDZixJQUFJLEVBQUUsSUFBSTtvQ0FDVixLQUFLLEVBQUUsTUFBTSxDQUFDLEtBQUs7b0NBQ25CLFNBQVMsRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFFLE1BQU0sQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFFO2lDQUMvQzs2QkFDSixFQUFBOzs7d0JBSUQsT0FBTyxDQUFDLEdBQUcsQ0FBQyxLQUFLLEVBQUUsR0FBQyxDQUFFLENBQUE7d0JBQ3RCLFdBQU8sR0FBRyxDQUFDLElBQUksR0FBRyxFQUFFLE1BQU0sRUFBRSxHQUFHLEVBQUUsRUFBQTs7OzthQUV4QyxDQUFDLENBQUE7UUFFSCxXQUFPLEdBQUcsQ0FBQyxLQUFLLEVBQUcsRUFBQzs7S0FFdEIsQ0FBQTtBQUdELFNBQVMsaUJBQWlCLENBQUUsSUFBNEQsRUFBRSxLQUFLO0lBRTNGLElBQU0sR0FBRyxHQUFHLE1BQU0sRUFBRyxDQUFDO0lBQ3RCLElBQU0sS0FBSyxHQUFHLEdBQUcsQ0FBQyxRQUFRLEVBQUcsR0FBRyxDQUFDLENBQUM7SUFDbEMsSUFBTSxJQUFJLEdBQUcsR0FBRyxDQUFDLE9BQU8sRUFBRyxDQUFDO0lBQzVCLElBQU0sSUFBSSxHQUFHLEdBQUcsQ0FBQyxRQUFRLEVBQUcsQ0FBQztJQUM3QixJQUFNLE9BQU8sR0FBRyxHQUFHLENBQUMsVUFBVSxFQUFHLENBQUM7SUFFbEMsSUFBTSxPQUFPLEdBQUcsVUFBQSxDQUFDLElBQUksT0FBQSxNQUFNLENBQUUsQ0FBQyxDQUFFLENBQUMsTUFBTSxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBSSxDQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBdEMsQ0FBc0MsQ0FBQztJQUU1RCxJQUFLLElBQUksS0FBSyxLQUFLLEVBQUc7UUFDbEIsT0FBTztZQUNILG9FQUFhO1lBQ1YsS0FBSyxjQUFJLElBQUksZUFBSyxJQUFJLFNBQUksT0FBTyxDQUFFLE9BQU8sQ0FBSTtTQUNwRCxDQUFDO0tBQ0w7U0FBTSxJQUFLLElBQUksS0FBSyxTQUFTLEVBQUc7UUFDN0IsT0FBTztZQUNILG1DQUFRLEtBQUssaUJBQUk7WUFDakIsMEJBQU07U0FDVCxDQUFBO0tBQ0o7U0FBTSxJQUFLLElBQUksS0FBSyxTQUFTLEVBQUc7UUFDN0IsT0FBTztZQUNILHlDQUFTLEtBQUssWUFBSTtZQUNsQixnRkFBZTtTQUNsQixDQUFBO0tBQ0o7U0FBTSxJQUFLLElBQUksS0FBSyxTQUFTLEVBQUc7UUFDN0IsT0FBTztZQUNILHVDQUFTO1lBQ1QscURBQVcsS0FBSyxpQkFBSTtTQUN2QixDQUFBO0tBQ0o7U0FBTSxJQUFLLElBQUksS0FBSyxVQUFVLEVBQUc7UUFDOUIsT0FBTztZQUNILDhEQUFZO1lBQ1osMEJBQU07U0FDVCxDQUFBO0tBQ0o7SUFDRCxPQUFPLEVBQUUsQ0FBQTtBQUNiLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJcbmltcG9ydCAqIGFzIGNsb3VkIGZyb20gJ3d4LXNlcnZlci1zZGsnO1xuaW1wb3J0ICogYXMgVGNiUm91dGVyIGZyb20gJ3RjYi1yb3V0ZXInO1xuaW1wb3J0IHsgY3JlYXRlJCB9IGZyb20gJy4vY3JlYXRlJztcblxuY2xvdWQuaW5pdCh7XG4gICAgZW52OiBwcm9jZXNzLmVudi5jbG91ZFxufSk7XG5cbmNvbnN0IGRiOiBEQi5EYXRhYmFzZSA9IGNsb3VkLmRhdGFiYXNlKCApO1xuY29uc3QgXyA9IGRiLmNvbW1hbmQ7XG5cbi8qKiBcbiAqIOi9rOaNouagvOael+WwvOayu+aXtuWMuiArOOaXtuWMulxuICogRGF0ZSgpLm5vdygpIC8gbmV3IERhdGUoKS5nZXRUaW1lKCkg5piv5pe25LiN5pe25q2j5bi455qEKzhcbiAqIERhdGUudG9Mb2NhbFN0cmluZyggKSDlpb3lg4/mmK/kuIDnm7TmmK8rMOeahFxuICog5YWI5ou/5YiwICsw77yM54S25ZCOKzhcbiAqL1xuY29uc3QgZ2V0Tm93ID0gKCB0cyA9IGZhbHNlICk6IGFueSA9PiB7XG4gICAgaWYgKCB0cyApIHtcbiAgICAgICAgcmV0dXJuIERhdGUubm93KCApO1xuICAgIH1cbiAgICBjb25zdCB0aW1lXzAgPSBuZXcgRGF0ZSggbmV3IERhdGUoICkudG9Mb2NhbGVTdHJpbmcoICkpO1xuICAgIHJldHVybiBuZXcgRGF0ZSggdGltZV8wLmdldFRpbWUoICkgKyA4ICogNjAgKiA2MCAqIDEwMDAgKVxufVxuXG4vKipcbiAqIFxuICogQGRlc2NyaXB0aW9uIOiuouWNleaooeWdl1xuICogLS0tLS0tLS0g5a2X5q61IC0tLS0tLS0tLS1cbiAqIF9pZFxuICogb3BlbmlkLFxuICogY3JlYXRldGltZVxuICogcGF5dGltZVxuICogdGlkLFxuICogcGlkLFxuICogY2lkICjlj6/kuLrnqbopXG4gKiBzaWQsICjlj6/kuLrnqbopXG4gKiBjb3VudCxcbiAqIHByaWNlLFxuICogZ3JvdXBQcmljZSxcbiAqIGRlcG9zaXRfcHJpY2U6IOWVhuWTgeiuoumHkSAo5Y+v5Li656m6KVxuICogISBhY2lkIOWVhuWTgea0u+WKqGlkXG4gKiAhIGlzT2NjdXBpZWQsIOaYr+WQpuWNoOW6k+WtmFxuICogZ3JvdXBfcHJpY2UgKOWPr+S4uuepuilcbiAqIHR5cGU6ICdjdXN0b20nIHwgJ25vcm1hbCcgfCAncHJlJyDoh6rlrprkuYnliqDljZXjgIHmma7pgJrliqDljZXjgIHpooTorqLljZVcbiAqIGltZzogQXJyYXlbIHN0cmluZyBdXG4gKiBkZXNj77yI5Y+v5Li656m677yJLFxuICogYWlkXG4gKiBhbGxvY2F0ZWRQcmljZSDliIbphY3nmoTku7fmoLxcbiAqIGFsbG9jYXRlZEdyb3VwUHJpY2Ug5YiG6YWN5Zui6LSt5Lu3XG4gKiBhbGxvY2F0ZWRDb3VudCDliIbphY3nmoTmlbDph49cbiAqIGZvcm1faWRcbiAqIHByZXBheV9pZCxcbiAqIGZpbmFsX3ByaWNlIOacgOWQjuaIkOS6pOS7t1xuICogISBjYW5Hcm91cCDmmK/lkKblj6/ku6Xmi7zlm6JcbiAqIGJhc2Vfc3RhdHVzOiAwLDEsMiwzLDQsNSDov5vooYzkuK3vvIzku6PotK3lt7LotK3kubDvvIzlt7LosIPmlbTvvIzlt7Lnu5PnrpfvvIzlt7Llj5bmtojvvIjkubDkuI3liLDvvInvvIzlt7Lov4fmnJ/vvIjmlK/ku5jov4fmnJ/vvIlcbiAqIHBheV9zdGF0dXM6IDAsMSwyIOacquS7mOasvu+8jOW3suS7mOiuoumHke+8jOW3suS7mOWFqOasvlxuICogISBkZWxpdmVyX3N0YXR1czogMCwxIOacquWPkeW4g++8jOW3suWPkeW4g+OAgVxuICovXG5leHBvcnQgY29uc3QgbWFpbiA9IGFzeW5jICggZXZlbnQsIGNvbnRleHQgKSA9PiB7XG5cbiAgICBjb25zdCBhcHAgPSBuZXcgVGNiUm91dGVyKHsgZXZlbnQgfSk7XG5cbiAgICAvKipcbiAgICAgKiBAZGVzY3JpcHRpb24g5Yib5bu66K6i5Y2VXG4gICAgICogLS0tLS0tLS0g6K+35rGCIC0tLS0tLS0tLS1cbiAgICAgKiB7XG4gICAgICogICAgICB0aWQsXG4gICAgICogICAgICBvcGVuSWQgLy8g6K6i5Y2V5Li75Lq6XG4gICAgICogICAgICBmcm9tOiAnY2FydCcgfCAnYnV5JyB8ICdjdXN0b20nIHwgJ2FnZW50cycgfCAnc3lzdGVtJyDmnaXmupDvvJrotK3nianovabjgIHnm7TmjqXotK3kubDjgIHoh6rlrprkuYnkuIvljZXjgIHku6PotK3kuIvljZXjgIHns7vnu5/lj5HotbfpooTku5jorqLljZVcbiAgICAgKiAgICAgIG9yZGVyczogQXJyYXk8eyBcbiAgICAgKiAgICAgICAgICB0aWRcbiAgICAgKiAgICAgICAgICBjaWRcbiAgICAgKiAgICAgICAgICBzaWRcbiAgICAgKiAgICAgICAgICBwaWRcbiAgICAgKiAgICAgICAgICBwcmljZVxuICAgICAqICAgICAgICAgIG5hbWVcbiAgICAgKiAgICAgICAgICBhY2lkXG4gICAgICogICAgICAgICAgc3RhbmRlcm5hbWVcbiAgICAgKiAgICAgICAgICBncm91cFByaWNlXG4gICAgICogICAgICAgICAgY291bnRcbiAgICAgKiAgICAgICAgICBkZXNjXG4gICAgICogICAgICAgICAgaW1nXG4gICAgICogICAgICAgICAgdHlwZVxuICAgICAqICAgICAgICAgIHBheV9zdGF0dXMsXG4gICAgICogICAgICAgICAgYWRkcmVzczoge1xuICAgICAqICAgICAgICAgICAgICBuYW1lLFxuICAgICAqICAgICAgICAgICAgICBwaG9uZSxcbiAgICAgKiAgICAgICAgICAgICAgZGV0YWlsLFxuICAgICAqICAgICAgICAgICAgICBwb3N0YWxjb2RlXG4gICAgICogICAgICAgICAgfVxuICAgICAqICAgICAgfT5cbiAgICAgKiB9XG4gICAgICovXG4gICAgYXBwLnJvdXRlcignY3JlYXRlJywgYXN5bmMoIGN0eCwgbmV4dCApID0+IHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgY29uc3QgeyB0aWQsIGZyb20sIG9yZGVycyB9ID0gZXZlbnQuZGF0YTtcbiAgICAgICAgICAgIGNvbnN0IG9wZW5pZCA9IGV2ZW50LmRhdGEub3BlbklkIHx8IGV2ZW50LnVzZXJJbmZvLm9wZW5JZDtcblxuICAgICAgICAgICAgLy8gMeOAgeWIpOaWreivpeihjOeoi+aYr+WQpuWPr+S7peeUqFxuICAgICAgICAgICAgY29uc3QgdHJpcHMkJCA9IGF3YWl0IGNsb3VkLmNhbGxGdW5jdGlvbih7XG4gICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBfaWQ6IHRpZFxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAkdXJsOiAnZGV0YWlsJ1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgbmFtZTogJ3RyaXAnXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgY29uc3QgdHJpcHMkID0gdHJpcHMkJC5yZXN1bHQ7ICAgICAgICBcbiAgICAgICAgICAgIGlmICggdHJpcHMkLnN0YXR1cyAhPT0gMjAwXG4gICAgICAgICAgICAgICAgICAgIHx8ICF0cmlwcyQuZGF0YSBcbiAgICAgICAgICAgICAgICAgICAgfHwgKCAhIXRyaXBzJC5kYXRhICYmIHRyaXBzJC5kYXRhLmlzQ2xvc2VkICkgXG4gICAgICAgICAgICAgICAgICAgIHx8ICggISF0cmlwcyQuZGF0YSAmJiBnZXROb3coIHRydWUgKSA+PSB0cmlwcyQuZGF0YS5lbmRfZGF0ZSApKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgJ+aaguaXoOihjOeoi+iuoeWIku+8jOaaguaXtuS4jeiDvei0reS5sO+9nidcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8g5pyA5paw5Y+v55So6KGM56iLXG4gICAgICAgICAgICBjb25zdCB0cmlwID0gdHJpcHMkLmRhdGE7XG5cbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICog5qC55o2u5Zyw5Z2A5a+56LGh77yM5ou/5Yiw5Zyw5Z2AaWRcbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgbGV0IGFkZHJlc3NpZCQgPSB7XG4gICAgICAgICAgICAgICAgcmVzdWx0OiB7XG4gICAgICAgICAgICAgICAgICAgIGRhdGE6IG51bGwsXG4gICAgICAgICAgICAgICAgICAgIHN0YXR1czogNTAwXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgLy8g6K6i5Y2V5p2l5rqQ77ya6LSt54mp6L2m44CB57O757uf5Yqg5Y2VXG4gICAgICAgICAgICBpZiAoIGV2ZW50LmRhdGEuZnJvbSA9PT0gJ2NhcnQnIHx8IGV2ZW50LmRhdGEuZnJvbSA9PT0gJ3N5c3RlbScgfHwgZXZlbnQuZGF0YS5mcm9tID09PSAnYnV5JyApIHtcbiAgICAgICAgICAgICAgICBhZGRyZXNzaWQkID0gYXdhaXQgY2xvdWQuY2FsbEZ1bmN0aW9uKHtcbiAgICAgICAgICAgICAgICAgICAgZGF0YTogeyBcbiAgICAgICAgICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvcGVuSWQ6IG9wZW5pZCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhZGRyZXNzOiBldmVudC5kYXRhLm9yZGVyc1sgMCBdLmFkZHJlc3NcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAkdXJsOiAnZ2V0QWRkcmVzc0lkJ1xuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICBuYW1lOiAnYWRkcmVzcydcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIFxuICAgICAgICAgICAgLy8g6K6i5Y2V5p2l5rqQ77ya6LSt54mp6L2m44CB57O757uf5Yqg5Y2VXG4gICAgICAgICAgICBpZiAoKCBldmVudC5kYXRhLmZyb20gPT09ICdjYXJ0JyB8fCBldmVudC5kYXRhLmZyb20gPT09ICdzeXN0ZW0nICkgJiYgYWRkcmVzc2lkJC5yZXN1bHQuc3RhdHVzICE9PSAyMDAgKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgJ+afpeivouWcsOWdgOmUmeivryc7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIOWPr+eUqOWcsOWdgGlkXG4gICAgICAgICAgICBjb25zdCBhaWQgPSBhZGRyZXNzaWQkLnJlc3VsdC5kYXRhO1xuXG4gICAgICAgICAgICAvLyDmmK/lkKbmlrDlrqLmiLdcbiAgICAgICAgICAgIGNvbnN0IGlzTmV3JCA9IGF3YWl0IGNsb3VkLmNhbGxGdW5jdGlvbih7XG4gICAgICAgICAgICAgICAgbmFtZTogJ2NvbW1vbicsXG4gICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgICAkdXJsOiAnaXMtbmV3LWN1c3RvbWVyJyxcbiAgICAgICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgICAgICAgb3BlbklkOiBvcGVuaWRcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pXG5cbiAgICAgICAgICAgIGNvbnN0IGlzTmV3ID0gaXNOZXckLnJlc3VsdC5kYXRhO1xuXG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIOaWsOWuoiArIOaWsOWuouimgeiuoumHkSA9ICcwJyxcbiAgICAgICAgICAgICAqIOaWsOWuoiArIOimgeiuoumHkSA9ICcwJyxcbiAgICAgICAgICAgICAqIOaWsOWuoiArIOWFjeiuoumHkSA9ICcxJyxcbiAgICAgICAgICAgICAqIOaXp+WuoiArIOaXp+WuouWFjeiuoumHkSA9ICcxJyxcbiAgICAgICAgICAgICAqIOaXp+WuoiArIOimgeiuoumHkSA9ICcwJyxcbiAgICAgICAgICAgICAqIOaXp+WuoiArIOWFjeiuoumHkSA9ICcxJyxcbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgbGV0IHBheV9zdGF0dXMgPSAnMCc7XG4gICAgICAgICAgICBjb25zdCBwID0gdHJpcC5wYXltZW50O1xuXG4gICAgICAgICAgICBpZiAoIGlzTmV3ICYmIHAgPT09ICcwJyApIHtcbiAgICAgICAgICAgICAgICBwYXlfc3RhdHVzID0gJzAnXG5cbiAgICAgICAgICAgIH0gZWxzZSBpZiAoIGlzTmV3ICYmIHAgPT09ICcxJyApIHtcbiAgICAgICAgICAgICAgICBwYXlfc3RhdHVzID0gJzAnXG5cbiAgICAgICAgICAgIH0gZWxzZSBpZiAoIGlzTmV3ICYmIHAgPT09ICcyJyApIHtcbiAgICAgICAgICAgICAgICBwYXlfc3RhdHVzID0gJzEnXG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICB9IGVsc2UgaWYgKCAhaXNOZXcgJiYgcCA9PT0gJzAnICkge1xuICAgICAgICAgICAgICAgIHBheV9zdGF0dXMgPSAnMSdcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoICFpc05ldyAmJiBwID09PSAnMScgKSB7XG4gICAgICAgICAgICAgICAgcGF5X3N0YXR1cyA9ICcwJ1xuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgfSBlbHNlIGlmICggIWlzTmV3ICYmIHAgPT09ICcyJyApIHtcbiAgICAgICAgICAgICAgICBwYXlfc3RhdHVzID0gJzEnXG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHBheV9zdGF0dXMgPSAnMCdcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gM+OAgeaJuemHj+WIm+W7uuiuouWNle+8jO+8iOi/h+a7pOaOieS4jeiDveWIm+W7uui0reeJqea4heWNleeahOWVhuWTge+8iVxuICAgICAgICAgICAgY29uc3QgdGVtcCA9IGV2ZW50LmRhdGEub3JkZXJzLm1hcCggbWV0YSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3QgdCA9IE9iamVjdC5hc3NpZ24oeyB9LCBtZXRhLCB7XG4gICAgICAgICAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICAgICAgICAgKiAhIGRlbGl2ZXJfc3RhdHVz5Li65pyq5Y+R5biDIOWPr+iDveaciemXrumimFxuICAgICAgICAgICAgICAgICAgICAgKi9cbiAgICAgICAgICAgICAgICAgICAgYWlkLFxuICAgICAgICAgICAgICAgICAgICBpc09jY3VwaWVkOiB0cnVlLCAvLyDljaDpooblupPlrZjmoIflv5dcbiAgICAgICAgICAgICAgICAgICAgb3BlbmlkOiBvcGVuaWQsXG4gICAgICAgICAgICAgICAgICAgIGRlbGl2ZXJfc3RhdHVzOiAnMCcsIFxuICAgICAgICAgICAgICAgICAgICBiYXNlX3N0YXR1czogJzAnLFxuICAgICAgICAgICAgICAgICAgICBwYXlfc3RhdHVzOiAhbWV0YS5kZXBvc2l0UHJpY2UgPyAnMScgOiBwYXlfc3RhdHVzICwgLy8g5ZWG5ZOB6K6i6YeR6aKd5bqm5Li6MFxuICAgICAgICAgICAgICAgICAgICBjcmVhdGVUaW1lOiBnZXROb3coIHRydWUgKSxcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogISFtZXRhLmRlcG9zaXRQcmljZSA/IG1ldGEudHlwZSA6ICdub3JtYWwnXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgZGVsZXRlIHRbJ2FkZHJlc3MnXTtcblxuICAgICAgICAgICAgICAgIGlmICggIXRbJ3NpZCddICkge1xuICAgICAgICAgICAgICAgICAgICBkZWxldGUgdFsnc2lkJ107XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgcmV0dXJuIHQ7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgLy8gNOOAgeaJuemHj+WIm+W7uuiuouWNlSAoIOWQjOaXtuWkhOeQhuWNoOmihui0p+WtmOeahOmXrumimCApXG4gICAgICAgICAgICBjb25zdCBzYXZlJDogYW55ID0gYXdhaXQgUHJvbWlzZS5hbGwoIHRlbXAubWFwKCBvID0+IHtcbiAgICAgICAgICAgICAgICByZXR1cm4gY3JlYXRlJCggb3BlbmlkLCBvLCBkYiwgY3R4ICk7XG4gICAgICAgICAgICB9KSk7XG4gICAgICAgIFxuICAgICAgICAgICAgaWYgKCBzYXZlJC5zb21lKCB4ID0+IHguc3RhdHVzICE9PSAyMDAgKSkge1xuICAgICAgICAgICAgICAgIHRocm93ICfliJvlu7rorqLljZXplJnor6/vvIEnXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIOi/lOWbnuiuouWNleS/oeaBr1xuICAgICAgICAgICAgY29uc3Qgb3JkZXJfcmVzdWx0ID0gc2F2ZSQubWFwKCggeCwgayApID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCB7IHByaWNlLCBjb3VudCwgcGF5X3N0YXR1cywgZGVwb3NpdFByaWNlIH0gPSB0ZW1wWyBrIF07XG4gICAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICAgICAgb2lkOiB4LmRhdGEuX2lkLFxuICAgICAgICAgICAgICAgICAgICBwcmljZSxcbiAgICAgICAgICAgICAgICAgICAgY291bnQsXG4gICAgICAgICAgICAgICAgICAgIHBheV9zdGF0dXMsXG4gICAgICAgICAgICAgICAgICAgIGRlcG9zaXRQcmljZVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICByZXR1cm4gY3R4LmJvZHkgPSB7XG4gICAgICAgICAgICAgICAgc3RhdHVzOiAyMDAsXG4gICAgICAgICAgICAgICAgZGF0YTogb3JkZXJfcmVzdWx0XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgIH0gY2F0Y2ggKCBlICkge1xuICAgICBcbiAgICAgICAgICAgIHJldHVybiBjdHguYm9keSA9IHtcbiAgICAgICAgICAgICAgICBzdGF0dXM6IDUwMCxcbiAgICAgICAgICAgICAgICBtZXNzYWdlOiBlXG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICAvKipcbiAgICAgKiBAZGVzY3JpcHRpb25cbiAgICAgKiDlrqLmiLfnq6/mn6Xor6JcbiAgICAgKiBcbiAgICAgKiDliIbpobUgKyBxdWVyeSDmn6Xor6LorqLljZXliJfooajvvIjmnKrogZrlkIjvvIlcbiAgICAgKiAtLS0tLSDor7fmsYIgLS0tLS0tXG4gICAgICoge1xuICAgICAqISAgICB0aWQ6IOihjOeoi2lkIO+8iOWPr+aXoO+8iVxuICAgICAqICAgICBvcGVuaWQ6IO+8iOWPr+aXoO+8iVxuICAgICAqICAgICBwYWdlOiBudW1iZXJcbiAgICAgKiAgICAgc2tpcDogbnVtYmVyXG4gICAgICogICAgIHR5cGU6IOaIkeeahOWFqOmDqCB8IOacquS7mOasvuiuouWNlSB8IOW+heWPkei0pyB8IOW3suWujOaIkCB8IOeuoeeQhuWRmO+8iOihjOeoi+iuouWNle+8iXwg566h55CG5ZGY77yI5omA5pyJ6K6i5Y2V77yJXG4gICAgICogICAgIHR5cGU6IG15LWFsbCB8IG15LW5vdHBheSB8IG15LWRlbGl2ZXIgfCBteS1maW5pc2ggfCBtYW5hZ2VyLXRyaXAgfCBtYW5hZ2VyLWFsbFxuICAgICAqICAgICBwYXNzdXNlZGxlc3M6IHRydWUgfCBmYWxzZSB8IHVuZGVmaW5lZCDmmK/lkKbov4fmu6Tmjonov4fmnJ/nmoTorqLljZVcbiAgICAgKiB9XG4gICAgICogISDmnKrku5jmrL7orqLljZXvvJpwYXlfc3RhdHVzOiDmnKrku5jmrL4v5bey5LuY6K6i6YeRIOaIliB0eXBlOiBwcmVcbiAgICAgKiAhIOW+heWPkei0p++8mmRlbGl2ZXJfc3RhdHVz77ya5pyq5Y+R6LSnIOS4lCBwYXlfc3RhdHVzIOW3suS7mOasvlxuICAgICAqICEg5bey5a6M5oiQ77yaZGVsaXZlcl9zdGF0dXPvvJrlt7Llj5HotKcg5LiUIHBheV9zdGF0dXMg5bey5LuY5YWo5qy+XG4gICAgICovXG4gICAgYXBwLnJvdXRlcignbGlzdCcsIGFzeW5jKCBjdHgsIG5leHQgKSA9PiB7XG4gICAgICAgIHRyeSB7XG5cbiAgICAgICAgICAgIGxldCB3aGVyZSQgPSB7IH07XG4gICAgICAgICAgICBjb25zdCB7IHR5cGUsIHRpZCwgcGFzc3VzZWRsZXNzIH0gPSBldmVudC5kYXRhO1xuXG4gICAgICAgICAgICAvLyDmn6Xor6LmnaHmlbBcbiAgICAgICAgICAgIGNvbnN0IGxpbWl0ID0gdGlkID8gOTkgOiAxMDtcblxuICAgICAgICAgICAgY29uc3Qgb3BlbmlkID0gZXZlbnQuZGF0YS5vcGVuaWQgfHwgZXZlbnQudXNlckluZm8ub3BlbklkO1xuXG5cbiAgICAgICAgICAgIC8vIOaIkeeahOWFqOmDqFxuICAgICAgICAgICAgaWYgKCB0eXBlID09PSAnbXktYWxsJyApIHtcbiAgICAgICAgICAgICAgICB3aGVyZSQgPSB7XG4gICAgICAgICAgICAgICAgICAgIG9wZW5pZDogb3BlbmlkXG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyDmnKrku5jmrL5cbiAgICAgICAgICAgIH0gZWxzZSBpZiAoIHR5cGUgPT09ICdteS1ub3RwYXknICkge1xuICAgICAgICAgICAgICAgIHdoZXJlJCA9IF8uYW5kKHtcbiAgICAgICAgICAgICAgICAgICAgb3BlbmlkLFxuICAgICAgICAgICAgICAgICAgICBiYXNlX3N0YXR1czogJzInXG4gICAgICAgICAgICAgICAgfSwgXy5vcihbXG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6ICdwcmUnXG4gICAgICAgICAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHBheV9zdGF0dXM6IF8ub3IoIF8uZXEoJzAnKSwgXy5lcSgnMScpKVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgXSkpO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICAvLyDmnKrlj5HotKdcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoIHR5cGUgPT09ICdteS1kZWxpdmUnICkge1xuICAgICAgICAgICAgICAgIHdoZXJlJCA9IHtcbiAgICAgICAgICAgICAgICAgICAgb3BlbmlkLFxuICAgICAgICAgICAgICAgICAgICBwYXlfc3RhdHVzOiAnMicsXG4gICAgICAgICAgICAgICAgICAgIGRlbGl2ZXJfc3RhdHVzOiAnMCdcbiAgICAgICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAvLyDlt7LlrozmiJBcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoIHR5cGUgPT09ICdteS1maW5pc2gnICkge1xuICAgICAgICAgICAgICAgIHdoZXJlJCA9IHtcbiAgICAgICAgICAgICAgICAgICAgb3BlbmlkLFxuICAgICAgICAgICAgICAgICAgICBwYXlfc3RhdHVzOiAnMicsXG4gICAgICAgICAgICAgICAgICAgIGRlbGl2ZXJfc3RhdHVzOiAnMSdcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyDov4fmu6Tmjonov4fmnJ/orqLljZVcbiAgICAgICAgICAgIGlmICggcGFzc3VzZWRsZXNzICE9PSBmYWxzZSApIHtcbiAgICAgICAgICAgICAgICB3aGVyZSQgPSBPYmplY3QuYXNzaWduKHsgfSwgd2hlcmUkLCB7XG4gICAgICAgICAgICAgICAgICAgIGJhc2Vfc3RhdHVzOiBfLm5lcSgnNScpXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIOihjOeoi+iuouWNlVxuICAgICAgICAgICAgaWYgKCB0aWQgKSB7XG4gICAgICAgICAgICAgICAgd2hlcmUkID0gT2JqZWN0LmFzc2lnbih7IH0sIHdoZXJlJCwge1xuICAgICAgICAgICAgICAgICAgICB0aWRcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8g6I635Y+W5oC75pWwXG4gICAgICAgICAgICBjb25zdCB0b3RhbCQgPSBhd2FpdCBkYi5jb2xsZWN0aW9uKCdvcmRlcicpXG4gICAgICAgICAgICAgICAgLndoZXJlKCB3aGVyZSQgKVxuICAgICAgICAgICAgICAgIC5jb3VudCggKTtcblxuICAgICAgICAgICAgLy8g6I635Y+W6K6i5Y2V5pWw5o2uXG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqICEg5aaC5p6c5piv5pyJ5oyH5a6adGlk55qE77yM5YiZ5LiN6ZyA6KaBbGltaXTkuobvvIznm7TmjqXmi4nlj5booYznqIvmiYDmnInnmoTorqLljZVcbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgY29uc3QgZGF0YSQgPSBhd2FpdCBkYi5jb2xsZWN0aW9uKCdvcmRlcicpXG4gICAgICAgICAgICAgICAgLndoZXJlKCB3aGVyZSQgKVxuICAgICAgICAgICAgICAgIC5vcmRlckJ5KCdjcmVhdGVUaW1lJywgJ2Rlc2MnKVxuICAgICAgICAgICAgICAgIC5saW1pdCggbGltaXQgKVxuICAgICAgICAgICAgICAgIC5za2lwKCBldmVudC5kYXRhLnNraXAgfHwgKCBldmVudC5kYXRhLnBhZ2UgLSAxICkgKiBsaW1pdCApXG4gICAgICAgICAgICAgICAgLmdldCggKTtcblxuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiAhIOeUseS6juafpeivouaYr+aMieWIhumhte+8jOS9huaYr+aYvuekuuaYr+aMieihjOeoi+adpeiBmuWQiOaYvuekulxuICAgICAgICAgICAgICogISDlm6DmraTmnInlj6/og73vvIxO6aG15pyA5ZCO5LiA5L2N77yM6LefTisx6aG156ys5LiA5L2N5L6d54S25bGe5LqO5ZCM5LiA6KGM56iLXG4gICAgICAgICAgICAgKiAhIOWmguS4jei/m+ihjOWkhOeQhu+8jOWuouaIt+afpeivouiuouWNleWIl+ihqOaYvuekuuihjOeoi+iuouWNleaXtu+8jOS8muKAnOacieWPr+iDveKAneaYvuekuuS4jeWFqFxuICAgICAgICAgICAgICogISDnibnmrorlpITnkIbvvJrnlKjmnIDlkI7kuIDkvY3nmoR0aWTvvIzmn6Xor6LmnIDlkI7kuIDkvY3ku6XlkI7lkIx0aWTnmoRvcmRlcu+8jOeEtuWQjuS/ruato+aJgOi/lOWbnueahHBhZ2VcbiAgICAgICAgICAgICAqL1xuXG4gICAgICAgICAgICBjb25zdCBsYXN0ID0gZGF0YSQuZGF0YVsgZGF0YSQuZGF0YS5sZW5ndGggLSAxIF07XG5cbiAgICAgICAgICAgIGxldCBmaXgkOiBhbnkgPSB7XG4gICAgICAgICAgICAgICAgZGF0YTogWyBdXG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAvLyDlpoLmnpzmsqHmnIl0aWTlj4LmlbDvvIzmiY3ljrvlgZpmaXjnmoTliqjkvZxcbiAgICAgICAgICAgIGlmICggbGFzdCAmJiAhdGlkICkgeyBcbiAgICAgICAgICAgICAgICBmaXgkID0gYXdhaXQgZGIuY29sbGVjdGlvbignb3JkZXInKVxuICAgICAgICAgICAgICAgICAgICAud2hlcmUoe1xuICAgICAgICAgICAgICAgICAgICAgICAgb3BlbmlkLFxuICAgICAgICAgICAgICAgICAgICAgICAgdGlkOiBsYXN0LnRpZCxcbiAgICAgICAgICAgICAgICAgICAgICAgIGJhc2Vfc3RhdHVzOiBfLm5lcSgnNScpXG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgIC5vcmRlckJ5KCdjcmVhdGVUaW1lJywgJ2Rlc2MnKVxuICAgICAgICAgICAgICAgICAgICAuc2tpcCggZXZlbnQuZGF0YS5za2lwID8gZXZlbnQuZGF0YS5za2lwICsgZGF0YSQuZGF0YS5sZW5ndGggOiAoIGV2ZW50LmRhdGEucGFnZSAtIDEgKSAqIGxpbWl0ICsgZGF0YSQuZGF0YS5sZW5ndGggKVxuICAgICAgICAgICAgICAgICAgICAuZ2V0KCApO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBjb25zdCBtZXRhID0gWyAuLi5kYXRhJC5kYXRhLCAuLi5maXgkLmRhdGEgXTtcblxuICAgICAgICAgICAgLy8g6L+Z6YeM55qE6KGM56iL6K+m5oOF55SoIG5ldyBTZXTnmoTmlrnlvI/mn6Xor6JcbiAgICAgICAgICAgIGNvbnN0IHRyaXBJZHMgPSBBcnJheS5mcm9tKFxuICAgICAgICAgICAgICAgIG5ldyBTZXQoIG1ldGEubWFwKCBtID0+IG0udGlkICkpXG4gICAgICAgICAgICApO1xuXG4gICAgICAgICAgICBjb25zdCB0cmlwcyQgPSBhd2FpdCBQcm9taXNlLmFsbCggdHJpcElkcy5tYXAoIHRpZCA9PiB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGRiLmNvbGxlY3Rpb24oJ3RyaXAnKVxuICAgICAgICAgICAgICAgICAgICAud2hlcmUoe1xuICAgICAgICAgICAgICAgICAgICAgICAgX2lkOiB0aWRcbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgLmdldCggKTtcbiAgICAgICAgICAgIH0pKTtcbiAgICAgXG4gICAgICAgICAgICAvLyDogZrlkIjooYznqIvmlbDmja5cbiAgICAgICAgICAgIGNvbnN0IG1ldGEyID0gbWV0YS5tYXAoKCB4LCBpICkgPT4gT2JqZWN0LmFzc2lnbih7IH0sIHgsIHtcbiAgICAgICAgICAgICAgICAvLyB0cmlwOiB0cmlwcyRbIGkgXS5kYXRhWyAwIF1cbiAgICAgICAgICAgICAgICB0cmlwOiAodHJpcHMkLmZpbmQoIHkgPT4geS5kYXRhWyAwIF0uX2lkID09PSB4LnRpZCApIGFzIGFueSkuZGF0YVsgMCBdXG4gICAgICAgICAgICB9KSk7XG5cbiAgICAgICAgICAgIHJldHVybiBjdHguYm9keSA9IHtcbiAgICAgICAgICAgICAgICBzdGF0dXM6IDIwMCxcbiAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICAgIGRhdGE6IG1ldGEyLFxuICAgICAgICAgICAgICAgICAgICBwYWdlU2l6ZTogbGltaXQsXG4gICAgICAgICAgICAgICAgICAgIHRvdGFsOiB0b3RhbCQudG90YWwsXG4gICAgICAgICAgICAgICAgICAgIHBhZ2U6IGZpeCQuZGF0YS5sZW5ndGggPT09IDAgPyBldmVudC5kYXRhLnBhZ2UgOiBldmVudC5kYXRhLnBhZ2UgKyBNYXRoLmNlaWwoIGZpeCQuZGF0YS5sZW5ndGggLyBsaW1pdCApLFxuICAgICAgICAgICAgICAgICAgICBjdXJyZW50OiBldmVudC5kYXRhLnNraXAgPyBldmVudC5kYXRhLnNraXAgKyBtZXRhLmxlbmd0aCA6ICggZXZlbnQuZGF0YS5wYWdlIC0gMSApICogbGltaXQgKyBtZXRhLmxlbmd0aCxcbiAgICAgICAgICAgICAgICAgICAgdG90YWxQYWdlOiBNYXRoLmNlaWwoIHRvdGFsJC50b3RhbCAvIGxpbWl0IClcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBcbiAgICAgICAgfSBjYXRjaCAoIGUgKSB7IHJldHVybiBjdHguYm9keSA9IHsgc3RhdHVzOiA1MDB9O31cbiAgICB9KVxuXG4gICAgLyoqXG4gICAgICog5om56YeP5pu05paw77yM6K6i5Y2V5Li65bey5pSv5LuY77yM5bm25LiU5aKe5Yqg5Yiw6LSt54mp5riF5Y2VXG4gICAgICog5bm25o6o6YCB55u45YWz5Lmw5a62XG4gICAgICog5bm25o6o6YCB55u45YWz4oCc5o6o5bm/6ICF4oCdXG4gICAgICoge1xuICAgICAqICAgICAgb3JkZXJJZHM6IFwiMTIzLDIzNCwzNDVcIlxuICAgICAqICAgICAgZm9ybV9pZCxcbiAgICAgKiAgICAgIHByZXBheV9pZFxuICAgICAqIH1cbiAgICAgKi9cbiAgICBhcHAucm91dGVyKCd1cGFkdGUtdG8tcGF5ZWQnLCBhc3luYyggY3R4LCBuZXh0ICkgPT4ge1xuICAgICAgICB0cnkge1xuXG4gICAgICAgICAgICBjb25zdCBvcGVuSWQgPSBldmVudC51c2VySW5mby5vcGVuSWQ7XG4gICAgICAgICAgICBjb25zdCB7IG9yZGVySWRzLCBwcmVwYXlfaWQsIGZvcm1faWQgfSA9IGV2ZW50LmRhdGE7XG5cbiAgICAgICAgICAgIC8vIOabtOaWsOiuouWNleWtl+autVxuICAgICAgICAgICAgYXdhaXQgUHJvbWlzZS5hbGwoIG9yZGVySWRzLnNwbGl0KCcsJykubWFwKCBvaWQgPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiBkYi5jb2xsZWN0aW9uKCdvcmRlcicpLmRvYyggb2lkIClcbiAgICAgICAgICAgICAgICAgICAgLnVwZGF0ZSh7XG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9ybV9pZCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcmVwYXlfaWQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcGF5X3N0YXR1czogJzEnXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSkpO1xuXG4gICAgICAgICAgICAvLyDliJvlu7ov5o+S5YWl5Yiw6LSt54mp5riF5Y2VXG4gICAgICAgICAgICBjb25zdCBmaW5kJDogYW55ID0gYXdhaXQgUHJvbWlzZS5hbGwoIG9yZGVySWRzLnNwbGl0KCcsJykubWFwKCBvaWQgPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiBkYi5jb2xsZWN0aW9uKCdvcmRlcicpXG4gICAgICAgICAgICAgICAgICAgIC53aGVyZSh7XG4gICAgICAgICAgICAgICAgICAgICAgICBfaWQ6IG9pZFxuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAuZ2V0KCApO1xuICAgICAgICAgICAgfSkpO1xuXG4gICAgICAgICAgICAvLyDorqLljZXliJfooahcbiAgICAgICAgICAgIGNvbnN0IGxpc3QgPSBmaW5kJC5tYXAoIHggPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IHsgX2lkLCB0aWQsIHBpZCwgc2lkLCBwcmljZSwgZ3JvdXBQcmljZSwgYWNpZCB9ID0geC5kYXRhWyAwIF07XG4gICAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICAgICAgb2lkOiBfaWQsXG4gICAgICAgICAgICAgICAgICAgIGFjaWQsIGdyb3VwUHJpY2UsXG4gICAgICAgICAgICAgICAgICAgIHRpZCwgcGlkLCBzaWQsIHByaWNlXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIGNvbnN0IGNyZWF0ZSQgPSBhd2FpdCBjbG91ZC5jYWxsRnVuY3Rpb24oe1xuICAgICAgICAgICAgICAgIG5hbWU6ICdzaG9wcGluZy1saXN0JyxcbiAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICAgICR1cmw6ICdjcmVhdGUnLFxuICAgICAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBsaXN0LFxuICAgICAgICAgICAgICAgICAgICAgICAgb3BlbklkXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgLy8g5aSE55CG6LSt5Lmw55u45YWz55qE5o6o6YCBXG4gICAgICAgICAgICBpZiAoIGNyZWF0ZSQucmVzdWx0LnN0YXR1cyA9PT0gMjAwICkge1xuICAgICAgICAgICAgICAgIGNvbnN0IHsgYnV5ZXIsIG90aGVycyB9ID0gY3JlYXRlJC5yZXN1bHQuZGF0YTtcblxuICAgICAgICAgICAgICAgIC8vIOS5sOWutuaOqOmAgVxuICAgICAgICAgICAgICAgIGNvbnN0IHB1c2hNZSQgPSBhd2FpdCBjbG91ZC5jYWxsRnVuY3Rpb24oe1xuICAgICAgICAgICAgICAgICAgICBuYW1lOiAnY29tbW9uJyxcbiAgICAgICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgICAgICAgJHVybDogJ3B1c2gtc3Vic2NyaWJlJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiBidXllci50eXBlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9wZW5pZDogYnV5ZXIub3BlbmlkLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRleHRzOiBnZXRUZXh0QnlQdXNoVHlwZSggXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJ1eWVyLnR5cGUgPT09ICdidXlQaW4nID8gJ2J1eVBpbjEnIDogYnV5ZXIudHlwZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnV5ZXIuZGVsdGEgKVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICAvLyDlhbbku5bkurrmi7zlm6LmiJDlip/nmoTmjqjpgIFcbiAgICAgICAgICAgICAgICBjb25zdCBvdGhlcnNPcmRlcnMkOiBhbnkgPSBhd2FpdCBQcm9taXNlLmFsbChcbiAgICAgICAgICAgICAgICAgICAgb3RoZXJzLm1hcCggXG4gICAgICAgICAgICAgICAgICAgICAgICBvdGhlciA9PiBkYi5jb2xsZWN0aW9uKCdvcmRlcicpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLndoZXJlKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb3BlbmlkOiBvdGhlci5vcGVuaWQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFjaWQ6IG90aGVyLmFjaWQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNpZDogb3RoZXIuc2lkLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwaWQ6IG90aGVyLnBpZCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGlkOiBvdGhlci50aWQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBheV9zdGF0dXM6ICcxJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYmFzZV9zdGF0dXM6IF8ub3IoIF8uZXEoJzAnKSwgXy5lcSgnMScpLCBfLmVxKCcyJykpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAuZmllbGQoe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb3VudDogdHJ1ZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLmdldCggKVxuICAgICAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgICAgKTtcblxuICAgICAgICAgICAgICAgIC8vIOaVtOWQiGRlbHRhICsgY291bnRcbiAgICAgICAgICAgICAgICBjb25zdCBvdGhlcnNNb3JlID0gb3RoZXJzLm1hcCgoIG90aGVyLCBrZXkgKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAuLi5vdGhlcixcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvdW50OiBvdGhlcnNPcmRlcnMkWyBrZXkgXS5kYXRhLnJlZHVjZSgoIHgsIHkgKSA9PiB5LmNvdW50ICsgeCwgMCApXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgIGxldCBvdGhlcnNQdXNoID0geyB9O1xuXG4gICAgICAgICAgICAgICAgb3RoZXJzTW9yZS5tYXAoIG90aGVyID0+IHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCAhb3RoZXJzUHVzaFsgb3RoZXIub3BlbmlkIF0pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG90aGVyc1B1c2ggPSBPYmplY3QuYXNzaWduKHsgfSwgb3RoZXJzUHVzaCwge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFsgb3RoZXIub3BlbmlkIF06IG90aGVyLmRlbHRhICogb3RoZXIuY291bnRcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgb3RoZXJzUHVzaCA9IE9iamVjdC5hc3NpZ24oeyB9LCBvdGhlcnNQdXNoLCB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgWyBvdGhlci5vcGVuaWQgXTogb3RoZXJzUHVzaFsgb3RoZXIub3BlbmlkIF0gKyBvdGhlci5kZWx0YSAqIG90aGVyLmNvdW50XG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgLy8g5YW25LuW5Lq65ou85Zui5oiQ5Yqf55qE5o6o6YCBXG4gICAgICAgICAgICAgICAgYXdhaXQgUHJvbWlzZS5hbGwoXG4gICAgICAgICAgICAgICAgICAgIE9iamVjdC5rZXlzKCBvdGhlcnNQdXNoICkubWFwKFxuICAgICAgICAgICAgICAgICAgICAgICAgb3RoZXJPcGVuaWQgPT4gY2xvdWQuY2FsbEZ1bmN0aW9uKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiAnY29tbW9uJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICR1cmw6ICdwdXNoLXN1YnNjcmliZScsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6ICdidXlQaW4nLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb3BlbmlkOiBvdGhlck9wZW5pZCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRleHRzOiBnZXRUZXh0QnlQdXNoVHlwZSggJ2J1eVBpbjInLCBvdGhlcnNQdXNoWyBvdGhlck9wZW5pZCBdKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICAgICk7XG5cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8g5p+l55yLYXBwLWNvbmZpZ+enr+WIhuaOqOW5v+aYr+WQpuW8gOWQr1xuICAgICAgICAgICAgY29uc3QgYXBwQ29uZiQgPSBhd2FpdCBkYi5jb2xsZWN0aW9uKCdhcHAtY29uZmlnJylcbiAgICAgICAgICAgICAgICAud2hlcmUoe1xuICAgICAgICAgICAgICAgICAgICB0eXBlOiAnZ29vZC1pbnRlZ3JhbC1zaGFyZSdcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIC5nZXQoICk7XG4gICAgICAgICAgICBjb25zdCBhcHBDb25mID0gYXBwQ29uZiQuZGF0YVsgMCBdO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICBpZiAoICEhYXBwQ29uZi52YWx1ZSApIHtcbiAgICAgICAgICAgICAgICAvLyDmib7lh7rmiYDmnInnmoTmjqjlub/orrDlvZVcbiAgICAgICAgICAgICAgICBjb25zdCBwdXNoZXJzJDogYW55ID0gYXdhaXQgUHJvbWlzZS5hbGwoXG4gICAgICAgICAgICAgICAgICAgIGxpc3QubWFwKCBhc3luYyggeCwgayApID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHB1c2hSZWNvcmQkID0gYXdhaXQgZGIuY29sbGVjdGlvbignc2hhcmUtcmVjb3JkJylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAud2hlcmUoe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwaWQ6IHgucGlkLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvcGVuaWQ6IG9wZW5JZCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaXNTdWNjZXNzOiBmYWxzZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLmdldCggKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLi4ucHVzaFJlY29yZCQuZGF0YVsgMCBdLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHByaWNlOiBsaXN0WyBrIF0ucHJpY2UsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcHVzaElkOiBwdXNoUmVjb3JkJC5kYXRhWyAwIF0gPyBwdXNoUmVjb3JkJC5kYXRhWyAwIF0uX2lkIDogJydcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICApO1xuXG4gICAgICAgICAgICAgICAgLy8g5om+5Ye65omA5pyJ55qE5o6o5bm/6ICFXG4gICAgICAgICAgICAgICAgY29uc3QgcHVzaGVyczogYW55ID0gWyBdO1xuICAgICAgICAgICAgICAgIHB1c2hlcnMkXG4gICAgICAgICAgICAgICAgICAgIC5maWx0ZXIoIHggPT4gISF4LmZyb20gKVxuICAgICAgICAgICAgICAgICAgICAubWFwKCB4ID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGluZGV4ID0gcHVzaGVycy5maW5kSW5kZXgoIHkgPT4geS5mcm9tID09PSB4LmZyb20gKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICggaW5kZXggIT09IC0xICkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IG9yaWdpbiA9IHB1c2hlcnNbIGluZGV4IF07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcHVzaGVycy5zcGxpY2UoIGluZGV4LCAxLCB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC4uLm9yaWdpbixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJpY2U6IE51bWJlcigoIHgucHJpY2UgKyBvcmlnaW4ucHJpY2UgKS50b0ZpeGVkKCAyICkpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHB1c2hlcnMucHVzaCh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZyb206IHguZnJvbSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJpY2U6IHgucHJpY2UsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHB1c2hJZDogeC5wdXNoSWRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgIGNvbnN0IGFwcENvbmYyJCA9IGF3YWl0IGRiLmNvbGxlY3Rpb24oJ2FwcC1jb25maWcnKVxuICAgICAgICAgICAgICAgICAgICAud2hlcmUoe1xuICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogJ3B1c2gtaW50ZWdyYWwtZ2V0LXJhdGUnXG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgIC5nZXQoICk7XG4gICAgICAgICAgICAgICAgY29uc3QgYXBwQ29uZjIgPSBhcHBDb25mMiQuZGF0YVsgMCBdO1xuICAgICAgICAgICAgICAgIGNvbnN0IGludGVncmFsUmF0ZSA9IGFwcENvbmYyLnZhbHVlIHx8IDAuMDU7XG5cbiAgICAgICAgICAgICAgICBhd2FpdCBQcm9taXNlLmFsbChcbiAgICAgICAgICAgICAgICAgICAgcHVzaGVycy5tYXAoIGFzeW5jIHB1c2hlciA9PiB7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIOaOqOW5v+enr+WIhuavlOS+iyA1JVxuICAgICAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBpbnRlZ3JhbCA9IE51bWJlcigoIHB1c2hlci5wcmljZSAqIGludGVncmFsUmF0ZSApLnRvRml4ZWQoIDEgKSk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIOiusOW9leaOqOW5v+iAheenr+WIhlxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgdXNlciQgPSBhd2FpdCBkYi5jb2xsZWN0aW9uKCd1c2VyJylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAud2hlcmUoe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvcGVuaWQ6IHB1c2hlci5mcm9tXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAuZ2V0KCApO1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgdXNlciA9IHVzZXIkLmRhdGFbIDAgXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHVzZXJpZCA9IHVzZXIuX2lkO1xuICAgICAgICAgICAgICAgICAgICAgICAgZGVsZXRlIHVzZXJbJ19pZCddO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBhd2FpdCBkYi5jb2xsZWN0aW9uKCd1c2VyJylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAuZG9jKCBTdHJpbmcoIHVzZXJpZCApKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5zZXQoe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAuLi51c2VyLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcHVzaF9pbnRlZ3JhbDogdXNlci5wdXNoX2ludGVncmFsID8gXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgTnVtYmVyKCh1c2VyLnB1c2hfaW50ZWdyYWwgKyBpbnRlZ3JhbCkudG9GaXhlZCggMSApKSA6IFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGludGVncmFsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgLy8g5aSE55CG5o6o5bm/6ICF55u45YWz55qE5o6o6YCBXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBwdXNoJCA9IGF3YWl0IGNsb3VkLmNhbGxGdW5jdGlvbih7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogJ2NvbW1vbicsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAkdXJsOiAncHVzaC1zdWJzY3JpYmUnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiAnaG9uZ2JhbycsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvcGVuaWQ6IHB1c2hlci5mcm9tLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8g56ev5YiG6aG16Z2iXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYWdlOiAncGFnZXMvZ3JvdW5kLXB1c2gtaW50ZWdyYWwvaW5kZXgnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGV4dHM6IFtg5oGt5Zac77yB6I635b6XJHtpbnRlZ3JhbH3lhYPmirXmiaPnjrDph5FgLGDmjqjlub/miJDlip/vvIHmnInkurrotK3kubDkuobkvaDliIbkuqvnmoTllYblk4FgXVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIOabtOaWsOaOqOW5v+eKtuaAgVxuICAgICAgICAgICAgICAgICAgICAgICAgYXdhaXQgZGIuY29sbGVjdGlvbignc2hhcmUtcmVjb3JkJylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAuZG9jKCBwdXNoZXIucHVzaElkIClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAudXBkYXRlKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaXNTdWNjZXNzOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3VjY2Vzc1RpbWU6IGdldE5vdyggdHJ1ZSApXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiBjdHguYm9keSA9IHtcbiAgICAgICAgICAgICAgICBzdGF0dXM6IDIwMFxuICAgICAgICAgICAgfVxuXG4gICAgICAgIH0gY2F0Y2ggKCBlICkgeyBcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCBlICk7XG4gICAgICAgICAgICByZXR1cm4gY3R4LmJvZHkgPSB7IHN0YXR1czogNTAwIH07XG4gICAgICAgIH0gXG4gICAgfSlcblxuICAgIC8qKiBcbiAgICAgKiBAZGVzY3JpcHRpb25cbiAgICAgKiDku6PotK3muIXluJDlgqzmrL7nmoTorqLljZXliJfooahcbiAgICAgKiB7XG4gICAgICogICAgIHRpZCBcbiAgICAgKiAgICAgbmVlZENvdXBvbnM6IGZhbHNlIHwgdHJ1ZSB8IHVuZGVmaW5lZFxuICAgICAqICAgICBuZWVkQWRkcmVzczogZmFsc2UgfCB0cnVlIHwgdW5kZWZpbmVkXG4gICAgICogfVxuICAgICAqL1xuICAgIGFwcC5yb3V0ZXIoJ2RhaWdvdS1saXN0JywgYXN5bmMoIGN0eCwgbmV4dCApID0+IHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGNvbnN0IHsgdGlkLCBuZWVkQ291cG9ucywgbmVlZEFkZHJlc3MgfSA9IGV2ZW50LmRhdGE7XG5cbiAgICAgICAgICAgIC8vIOiuouWNleS/oeaBr1xuICAgICAgICAgICAgY29uc3Qgb3JkZXJzJCA9IGF3YWl0IGRiLmNvbGxlY3Rpb24oJ29yZGVyJylcbiAgICAgICAgICAgICAgICAud2hlcmUoe1xuICAgICAgICAgICAgICAgICAgICB0aWQsXG4gICAgICAgICAgICAgICAgICAgIGJhc2Vfc3RhdHVzOiBfLm5lcSgnNScpLFxuICAgICAgICAgICAgICAgICAgICBwYXlfc3RhdHVzOiBfLm9yKCBfLmVxKCcxJyksIF8uZXEoJzInKSlcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIC5nZXQoICk7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIC8vIOeUqOaIt+S/oeaBr1xuICAgICAgICAgICAgY29uc3QgdXNlcnMkID0gYXdhaXQgUHJvbWlzZS5hbGwoXG4gICAgICAgICAgICAgICAgQXJyYXkuZnJvbSggXG4gICAgICAgICAgICAgICAgICAgIG5ldyBTZXQoIG9yZGVycyQuZGF0YVxuICAgICAgICAgICAgICAgICAgICAgICAgLm1hcCggeCA9PiB4Lm9wZW5pZCApXG4gICAgICAgICAgICAgICAgKSlcbiAgICAgICAgICAgICAgICAubWFwKCB1aWQgPT4gZGIuY29sbGVjdGlvbigndXNlcicpXG4gICAgICAgICAgICAgICAgICAgIC53aGVyZSh7XG4gICAgICAgICAgICAgICAgICAgICAgICBvcGVuaWQ6IHVpZFxuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAuZ2V0KCApKVxuICAgICAgICAgICAgKTtcblxuICAgICAgICAgICAgLy8g5b+r6YCS6LS555So5L+h5oGvXG4gICAgICAgICAgICBjb25zdCBkZWxpdmVyZmVlcyQgPSBhd2FpdCBQcm9taXNlLmFsbChcbiAgICAgICAgICAgICAgICBBcnJheS5mcm9tKCBcbiAgICAgICAgICAgICAgICAgICAgbmV3IFNldCggb3JkZXJzJC5kYXRhXG4gICAgICAgICAgICAgICAgICAgICAgICAubWFwKCB4ID0+IHgub3BlbmlkIClcbiAgICAgICAgICAgICAgICApKVxuICAgICAgICAgICAgICAgIC5tYXAoIHVpZCA9PiBkYi5jb2xsZWN0aW9uKCdkZWxpdmVyLWZlZScpXG4gICAgICAgICAgICAgICAgICAgIC53aGVyZSh7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aWQsXG4gICAgICAgICAgICAgICAgICAgICAgICBvcGVuaWQ6IHVpZFxuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAuZ2V0KCApKVxuICAgICAgICAgICAgKTtcblxuICAgICAgICAgICAgLy8g56ev5YiG5o6o5bm/5L2/55So5oOF5Ya1XG4gICAgICAgICAgICBjb25zdCBwdXNoSW50ZWdyYWwkID0gYXdhaXQgUHJvbWlzZS5hbGwoXG4gICAgICAgICAgICAgICAgQXJyYXkuZnJvbSggXG4gICAgICAgICAgICAgICAgICAgIG5ldyBTZXQoIG9yZGVycyQuZGF0YVxuICAgICAgICAgICAgICAgICAgICAgICAgLm1hcCggeCA9PiB4Lm9wZW5pZCApXG4gICAgICAgICAgICAgICAgKSlcbiAgICAgICAgICAgICAgICAubWFwKCB1aWQgPT4gZGIuY29sbGVjdGlvbignaW50ZWdyYWwtdXNlLXJlY29yZCcpXG4gICAgICAgICAgICAgICAgICAgIC53aGVyZSh7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aWQsXG4gICAgICAgICAgICAgICAgICAgICAgICBvcGVuaWQ6IHVpZCxcbiAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6ICdwdXNoX2ludGVncmFsJ1xuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAuZ2V0KCApKVxuICAgICAgICAgICAgKTtcblxuICAgICAgICAgICAgLy8g5Zyw5Z2A5L+h5oGvXG4gICAgICAgICAgICBsZXQgYWRkcmVzcyQ6IGFueSA9IFsgXTtcbiAgICAgICAgICAgIGlmICggISFuZWVkQWRkcmVzcyB8fCBuZWVkQWRkcmVzcyA9PT0gdW5kZWZpbmVkICkge1xuICAgICAgICAgICAgICAgIGFkZHJlc3MkID0gYXdhaXQgUHJvbWlzZS5hbGwoXG4gICAgICAgICAgICAgICAgICAgIEFycmF5LmZyb20oXG4gICAgICAgICAgICAgICAgICAgICAgICBuZXcgU2V0KCBvcmRlcnMkLmRhdGFcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAubWFwKCB4ID0+IHguYWlkIClcbiAgICAgICAgICAgICAgICAgICAgKSlcbiAgICAgICAgICAgICAgICAgICAgLm1hcCggYWlkID0+IGRiLmNvbGxlY3Rpb24oJ2FkZHJlc3MnKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAuZG9jKCBhaWQgKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAuZ2V0KCApKVxuICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIC8vIOWNoeWIuOS/oeaBr1xuICAgICAgICAgICAgbGV0IGNvdXBvbnMkOiBhbnkgPSBbIF07XG4gICAgICAgICAgICBpZiAoICEhbmVlZENvdXBvbnMgfHwgbmVlZENvdXBvbnMgPT09IHVuZGVmaW5lZCApIHtcbiAgICAgICAgICAgICAgICBjb3Vwb25zJCA9IGF3YWl0IFByb21pc2UuYWxsKFxuICAgICAgICAgICAgICAgICAgICBBcnJheS5mcm9tKFxuICAgICAgICAgICAgICAgICAgICAgICAgbmV3IFNldCggb3JkZXJzJC5kYXRhIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5tYXAoIHggPT4geC5vcGVuaWQgKVxuICAgICAgICAgICAgICAgICAgICApKVxuICAgICAgICAgICAgICAgICAgICAubWFwKCBvcGVuaWQgPT4gZGIuY29sbGVjdGlvbignY291cG9uJylcbiAgICAgICAgICAgICAgICAgICAgICAgIC53aGVyZSggXy5vcihbXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aWQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9wZW5pZCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogXy5vciggXy5lcSgndF9tYW5qaWFuJyksIF8uZXEoJ3RfbGlqaWFuJykpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvcGVuaWQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlzVXNlZDogZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhblVzZUluTmV4dDogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogJ3RfZGFpamluJ1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIF0pKVxuICAgICAgICAgICAgICAgICAgICAgICAgLmdldCggKVxuICAgICAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIFxuICAgICAgICAgICAgY29uc3QgdXNlck9kZXJzID0gdXNlcnMkLm1hcCgoIHVzZXIkLCBrICkgPT4ge1xuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIGNvbnN0IHVzZXIgPSB1c2VyJC5kYXRhWyAwIF07XG5cbiAgICAgICAgICAgICAgICBjb25zdCBvcmRlcnMgPSBvcmRlcnMkLmRhdGFcbiAgICAgICAgICAgICAgICAgICAgLmZpbHRlciggeCA9PiB4Lm9wZW5pZCA9PT0gdXNlci5vcGVuaWQgKTtcblxuICAgICAgICAgICAgICAgIGNvbnN0IGFkZHJlc3MgPSBhZGRyZXNzJC5sZW5ndGggPiAwID9cbiAgICAgICAgICAgICAgICAgICAgYWRkcmVzcyRcbiAgICAgICAgICAgICAgICAgICAgICAgIC5tYXAoIHggPT4geC5kYXRhIClcbiAgICAgICAgICAgICAgICAgICAgICAgIC5maWx0ZXIoIHggPT4geC5vcGVuaWQgPT09IHVzZXIub3BlbmlkICkgOlxuICAgICAgICAgICAgICAgICAgICB1bmRlZmluZWQ7XG5cbiAgICAgICAgICAgICAgICBjb25zdCBjb3Vwb25zID0gY291cG9ucyQubGVuZ3RoID4gMCA/XG4gICAgICAgICAgICAgICAgICAgIGNvdXBvbnMkXG4gICAgICAgICAgICAgICAgICAgICAgICAubWFwKCB4ID0+IHguZGF0YSApXG4gICAgICAgICAgICAgICAgICAgICAgICAuZmlsdGVyKCB4ID0+IHgubGVuZ3RoID4gMCAmJiB4WyAwIF0ub3BlbmlkID09PSB1c2VyLm9wZW5pZCApIDpcbiAgICAgICAgICAgICAgICAgICAgdW5kZWZpbmVkO1xuXG4gICAgICAgICAgICAgICAgY29uc3QgZGVsaXZlckZlZSA9IGRlbGl2ZXJmZWVzJFsgayBdLmRhdGFbIDAgXSB8fCAwO1xuXG4gICAgICAgICAgICAgICAgY29uc3QgcHVzaEludGVncmFsID0gKHB1c2hJbnRlZ3JhbCRbIGsgXS5kYXRhWyAwIF0gfHwgeyB9KS52YWx1ZSB8fCAwO1xuXG4gICAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICAgICAgdXNlcixcbiAgICAgICAgICAgICAgICAgICAgb3JkZXJzLFxuICAgICAgICAgICAgICAgICAgICBhZGRyZXNzLFxuICAgICAgICAgICAgICAgICAgICBkZWxpdmVyRmVlLFxuICAgICAgICAgICAgICAgICAgICBwdXNoSW50ZWdyYWwsXG4gICAgICAgICAgICAgICAgICAgIGNvdXBvbnM6ICghIWNvdXBvbnMgJiYgY291cG9ucy5sZW5ndGggPiAwICkgPyBjb3Vwb25zWyAwIF0gOiBbIF1cbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHJldHVybiBjdHguYm9keSA9IHtcbiAgICAgICAgICAgICAgICBzdGF0dXM6IDIwMCxcbiAgICAgICAgICAgICAgICBkYXRhOiB1c2VyT2RlcnNcbiAgICAgICAgICAgIH1cblxuICAgICAgICB9IGNhdGNoICggZSApIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCAnLi4uJywgZSApO1xuICAgICAgICAgICAgcmV0dXJuIGN0eC5ib2R5ID0geyBzdGF0dXM6IDUwMCB9O1xuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICAvKipcbiAgICAgKiBAZGVzY3JpcHRpb25cbiAgICAgKiDku47muIXluJDlgqzmrL7vvIzosIPmlbTorqLljZXliIbphY3ph49cbiAgICAgKiB7XG4gICAgICogICAgICBvaWQsIHRpZCwgc2lkLCBwaWQsIGNvdW50XG4gICAgICogfVxuICAgICAqL1xuICAgIGFwcC5yb3V0ZXIoJ2FkanVzdC1jb3VudCcsIGFzeW5jKCBjdHgsIG5leHQgKSA9PiB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBjb25zdCBvcGVuaWQgPSBldmVudC5kYXRhLm9wZW5JZCB8fCBldmVudC51c2VySW5mby5vcGVuSWQ7IFxuICAgICAgICAgICAgY29uc3QgeyBvaWQsIHRpZCwgc2lkLCBwaWQsIGNvdW50IH0gPSBldmVudC5kYXRhO1xuXG4gICAgICAgICAgICBjb25zdCBnZXRXcm9uZyA9IG1lc3NhZ2UgPT4gY3R4LmJvZHkgPSB7XG4gICAgICAgICAgICAgICAgbWVzc2FnZSxcbiAgICAgICAgICAgICAgICBzdGF0dXM6IDQwMFxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIOaYr+WQpuiDvee7p+e7reiwg+aVtFxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICBjb25zdCBvcmRlciQgPSBhd2FpdCBkYi5jb2xsZWN0aW9uKCdvcmRlcicpXG4gICAgICAgICAgICAgICAgLmRvYyggb2lkIClcbiAgICAgICAgICAgICAgICAuZ2V0KCApO1xuXG4gICAgICAgICAgICBpZiAoIG9yZGVyJC5kYXRhLmJhc2Vfc3RhdHVzID09PSAnMicgKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGdldFdyb25nKCflgqzmrL7lkI7kuI3og73kv67mlLnmlbDph48nKTtcblxuICAgICAgICAgICAgfSBlbHNlIGlmICggb3JkZXIkLmRhdGEuYmFzZV9zdGF0dXMgPT09ICcwJyApIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZ2V0V3JvbmcoJ+ivt+WFiOiwg+aVtOivpeWVhuWTgeS7t+agvCcpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIOS4jeiDveWkmuS6jua4heWNleWIhumFjeeahOaAu+i0reWFpemHj1xuICAgICAgICAgICAgICovXG4gICAgICAgICAgICBjb25zdCBzaG9wcGluZyQgPSBhd2FpdCBkYi5jb2xsZWN0aW9uKCdzaG9wcGluZy1saXN0JylcbiAgICAgICAgICAgICAgICAud2hlcmUoe1xuICAgICAgICAgICAgICAgICAgICB0aWQsIHNpZCwgcGlkXG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAuZ2V0KCApO1xuICAgICAgICAgICAgY29uc3Qgc2hvcHBpbmcgPSBzaG9wcGluZyQuZGF0YVsgMCBdO1xuICAgICAgICAgICAgY29uc3QgbGFzdE9yZGVycyQgPSBhd2FpdCBkYi5jb2xsZWN0aW9uKCdvcmRlcicpXG4gICAgICAgICAgICAgICAgLndoZXJlKHtcbiAgICAgICAgICAgICAgICAgICAgdGlkLCBzaWQsIHBpZCxcbiAgICAgICAgICAgICAgICAgICAgcGF5X3N0YXR1czogXy5uZXEoJzAnKSxcbiAgICAgICAgICAgICAgICAgICAgYmFzZV9zdGF0dXM6IF8ub3IoIF8uZXEoJzEnKSwgXy5lcSgnMicpLCBfLmVxKCczJykpXG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAuZ2V0KCApO1xuXG4gICAgICAgICAgICBjb25zdCBsYXN0T3JkZXJzID0gbGFzdE9yZGVycyQuZGF0YTtcbiAgICAgICAgICAgIGNvbnN0IG90aGVyQ291bnQ6IGFueSA9IGxhc3RPcmRlcnNcbiAgICAgICAgICAgICAgICAuZmlsdGVyKCBvID0+IG8uX2lkICE9PSBvaWQgKVxuICAgICAgICAgICAgICAgIC5yZWR1Y2UoKCB4LCB5ICkgPT4ge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4geCArIHkuYWxsb2NhdGVkQ291bnQgfHwgMFxuICAgICAgICAgICAgICAgIH0sIDAgKTtcblxuICAgICAgICAgICAgaWYgKCBjb3VudCArIG90aGVyQ291bnQgPiBzaG9wcGluZy5wdXJjaGFzZSApIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZ2V0V3JvbmcoYOivpeWVhuWTgeaAu+aVsOmHj+S4jeiDveWkp+S6jumHh+i0reaVsCR7c2hvcHBpbmcucHVyY2hhc2V95Lu277yBYCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8qKiDmm7TmlrDorqLljZUgKi9cbiAgICAgICAgICAgIGF3YWl0IGRiLmNvbGxlY3Rpb24oJ29yZGVyJylcbiAgICAgICAgICAgICAgICAuZG9jKCBvaWQgKVxuICAgICAgICAgICAgICAgIC51cGRhdGUoe1xuICAgICAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBhbGxvY2F0ZWRDb3VudDogY291bnRcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIOabtOaWsOa4heWNlVxuICAgICAgICAgICAgICog5bCR5LqO5oC76LSt5YWl6YeP5pe277yM6YeN5paw6LCD5pW05riF5Y2V55qE5Ymp5L2Z5YiG6YWN6YePXG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIGlmICggY291bnQgKyBvdGhlckNvdW50IDwgc2hvcHBpbmcucHVyY2hhc2UgKSB7XG5cbiAgICAgICAgICAgICAgICBjb25zdCBuZXdzaG9wcGluZyA9IE9iamVjdC5hc3NpZ24oeyB9LCBzaG9wcGluZywge1xuICAgICAgICAgICAgICAgICAgICBsYXN0QWxsb2NhdGVkOiBzaG9wcGluZy5wdXJjaGFzZSAtICggY291bnQgKyBvdGhlckNvdW50IClcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICBkZWxldGUgbmV3c2hvcHBpbmdbJ19pZCddO1xuXG4gICAgICAgICAgICAgICAgYXdhaXQgZGIuY29sbGVjdGlvbignc2hvcHBpbmctbGlzdCcpXG4gICAgICAgICAgICAgICAgICAgIC5kb2MoIFN0cmluZyggc2hvcHBpbmcuX2lkICkpXG4gICAgICAgICAgICAgICAgICAgIC5zZXQoe1xuICAgICAgICAgICAgICAgICAgICAgICAgZGF0YTogbmV3c2hvcHBpbmdcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiBjdHguYm9keSA9IHtcbiAgICAgICAgICAgICAgICBzdGF0dXM6IDIwMFxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgXG4gICAgICAgIH0gY2F0Y2ggKCBlICkge1xuICAgICAgICAgICAgcmV0dXJuIGN0eC5ib2R5ID0geyBzdGF0dXM6IDUwMCB9XG4gICAgICAgIH1cbiAgICB9KVxuXG4gICAgLyoqXG4gICAgICogQGRlc2NyaXB0aW9uXG4gICAgICog5om56YeP5Zyw77ya56Gu6K6k5a6i5oi36K6i5Y2V44CB5piv5ZCm5Zui6LSt44CB5raI5oGv5o6o6YCB5pON5L2cXG4gICAgICoge1xuICAgICAqICAgIHRpZCxcbiAgICAgKiAgICBvcmRlcnM6IHtcbiAgICAgKiAgICAgICAgb2lkXG4gICAgICogICAgICAgIHBpZFxuICAgICAqICAgICAgICBzaWRcbiAgICAgKiAgICAgICAgb3BlbmlkXG4gICAgICogICAgICAgIHByZXBheV9pZFxuICAgICAqICAgICAgICBmb3JtX2lkXG4gICAgICogICAgICAgIGFsbG9jYXRlZENvdW50XG4gICAgICogICAgICAgIGFsbG9jYXRlZEdyb3VwUHJpY2VcbiAgICAgKiAgICB9WyBdXG4gICAgICogICAgbm90aWZpY2F0aW9uOiB7IFxuICAgICAqICAgICAgIHRpdGxlLFxuICAgICAqICAgICAgIGRlc2MsXG4gICAgICogICAgICAgdGltZVxuICAgICAqICAgIH1cbiAgICAgKiB9XG4gICAgICovXG4gICAgYXBwLnJvdXRlcignYmF0Y2gtYWRqdXN0JywgYXN5bmMoIGN0eCwgbmV4dCApID0+IHtcbiAgICAgICAgdHJ5IHtcblxuICAgICAgICAgICAgLyoqIOaYr+WQpuiDveaLvOWboiAqL1xuICAgICAgICAgICAgbGV0IGNhbkdyb3VwVXNlck1hcENvdW50OiB7XG4gICAgICAgICAgICAgICAgWyBrOiBzdHJpbmcgXSA6IG51bWJlclxuICAgICAgICAgICAgfSA9IHsgfTtcblxuICAgICAgICAgICAgY29uc3QgeyB0aWQsIG9yZGVycywgbm90aWZpY2F0aW9uIH0gPSBldmVudC5kYXRhO1xuICAgICAgICAgICAgY29uc3QgZ2V0V3JvbmcgPSBtZXNzYWdlID0+IGN0eC5ib2R5ID0ge1xuICAgICAgICAgICAgICAgIG1lc3NhZ2UsXG4gICAgICAgICAgICAgICAgc3RhdHVzOiA0MDBcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIGNvbnN0IHRyaXAkID0gYXdhaXQgZGIuY29sbGVjdGlvbigndHJpcCcpXG4gICAgICAgICAgICAgICAgLmRvYyggdGlkIClcbiAgICAgICAgICAgICAgICAuZ2V0KCApO1xuICAgICAgICAgICAgY29uc3QgdHJpcCA9IHRyaXAkLmRhdGE7XG5cbiAgICAgICAgICAgIC8vIOacque7k+adn++8jOS4lOacquaJi+WKqOWFs+mXrVxuICAgICAgICAgICAgaWYgKCBnZXROb3coIHRydWUgKSA8IHRyaXAuZW5kX2RhdGUgJiYgIXRyaXAuaXNDbG9zZWQgKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGdldFdyb25nKCfooYznqIvmnKrnu5PmnZ/vvIzor7fmiYvliqjlhbPpl63lvZPliY3ooYznqIsnKTtcblxuICAgICAgICAgICAgfSBlbHNlIGlmICggdHJpcC5jYWxsTW9uZXlUaW1lcyAmJiAgdHJpcC5jYWxsTW9uZXlUaW1lcyA+PSAzICkge1xuICAgICAgICAgICAgICAgIHJldHVybiBnZXRXcm9uZyhg5bey57uP5Y+R6LW36L+HJHt0cmlwLmNhbGxNb25leVRpbWVzfeasoeWCrOasvmApO1xuXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIOabtOaWsOiuouWNlVxuICAgICAgICAgICAgYXdhaXQgUHJvbWlzZS5hbGwoIG9yZGVycy5tYXAoIG9yZGVyID0+IHtcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAvLyDmnInlm6LotK3ku7fjgIHlpKfkuo4y5Lq66LSt5Lmw77yM5LiU6KKr5YiG6YWN5pWw5Z2H5aSn5LqOMO+8jOivpeiuouWNleaJjei+vuWIsOKAnOWboui0reKAneeahOadoeS7tlxuICAgICAgICAgICAgICAgIGNvbnN0IGNhbkdyb3VwID0gISFvcmRlcnMuZmluZCggbyA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBvLm9pZCAhPT0gb3JkZXIub2lkICYmXG4gICAgICAgICAgICAgICAgICAgICAgICBvLm9wZW5pZCAhPT0gb3JkZXIub3BlbmlkICYmIFxuICAgICAgICAgICAgICAgICAgICAgICAgby5waWQgPT09IG9yZGVyLnBpZCAmJiBvLnNpZCA9PT0gb3JkZXIuc2lkICYmXG4gICAgICAgICAgICAgICAgICAgICAgICBvLmFsbG9jYXRlZENvdW50ID4gMCAmJiBvcmRlci5hbGxvY2F0ZWRDb3VudCA+IDAgJiZcbiAgICAgICAgICAgICAgICAgICAgICAgICEhby5hbGxvY2F0ZWRHcm91cFByaWNlXG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICBpZiAoIGNhbkdyb3VwICkge1xuICAgICAgICAgICAgICAgICAgICBjYW5Hcm91cFVzZXJNYXBDb3VudCA9IE9iamVjdC5hc3NpZ24oeyB9LCBjYW5Hcm91cFVzZXJNYXBDb3VudCwge1xuICAgICAgICAgICAgICAgICAgICAgICAgWyBvcmRlci5vcGVuaWQgXTogY2FuR3JvdXBVc2VyTWFwQ291bnRbIG9yZGVyLm9wZW5pZCBdID09PSB1bmRlZmluZWQgPyAxIDogY2FuR3JvdXBVc2VyTWFwQ291bnRbIG9yZGVyLm9wZW5pZCBdICsgMVxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gZGIuY29sbGVjdGlvbignb3JkZXInKVxuICAgICAgICAgICAgICAgICAgICAuZG9jKCBvcmRlci5vaWQgKVxuICAgICAgICAgICAgICAgICAgICAudXBkYXRlKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYW5Hcm91cCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBiYXNlX3N0YXR1czogJzInXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICB9KSk7XG5cbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogIeabtOaWsOi0reeJqea4heWNlVxuICAgICAgICAgICAgICovXG5cbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICog5raI5oGv5o6o6YCBXG4gICAgICAgICAgICAgKiAh5pyq5LuY5YWo5qy+5omN5Y+R6YCBXG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIGNvbnN0IHVzZXJzID0gQXJyYXkuZnJvbShcbiAgICAgICAgICAgICAgICBuZXcgU2V0KFxuICAgICAgICAgICAgICAgICAgICBvcmRlcnNcbiAgICAgICAgICAgICAgICAgICAgICAgIC5tYXAoIG9yZGVyID0+IG9yZGVyLm9wZW5pZCApXG4gICAgICAgICAgICAgICAgICAgICAgICAuZmlsdGVyKCBvcGVuaWQgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiAhIW9yZGVycy5maW5kKCBvcmRlciA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBvcmRlci5vcGVuaWQgPT09IG9wZW5pZCAmJiBTdHJpbmcoIG9yZGVyLnBheV9zdGF0dXMgKSA9PT0gJzEnXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICk7XG5cbiAgICAgICAgICAgIC8qKiDmjqjpgIHpgJrnn6UgKi9cbiAgICAgICAgICAgIGNvbnN0IHJzID0gYXdhaXQgUHJvbWlzZS5hbGwoIHVzZXJzLm1hcCggb3BlbmlkID0+IHtcblxuICAgICAgICAgICAgICAgIGNvbnN0IHRhcmdldCA9IG9yZGVycy5maW5kKCBvcmRlciA9PiBvcmRlci5vcGVuaWQgPT09IG9wZW5pZCAmJlxuICAgICAgICAgICAgICAgICAgICAoISFvcmRlci5wcmVwYXlfaWQgfHwgISFvcmRlci5mb3JtX2lkICkpO1xuXG4gICAgICAgICAgICAgICAgLy8gcmV0dXJuIGNsb3VkLmNhbGxGdW5jdGlvbih7XG4gICAgICAgICAgICAgICAgLy8gICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAvLyAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAvLyAgICAgICAgICAgICB0b3VzZXI6IG9wZW5pZCxcbiAgICAgICAgICAgICAgICAvLyAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgLy8gICAgICAgICAgICAgICAgIHRpdGxlOiBjYW5Hcm91cFVzZXJNYXBDb3VudFsgU3RyaW5nKCBvcGVuaWQgKV0gP1xuICAgICAgICAgICAgICAgIC8vICAgICAgICAgICAgICAgICAgICAgLy8gYOaLvOWboiR7IGNhbkdyb3VwVXNlck1hcENvdW50WyBTdHJpbmcoIG9wZW5pZCApXX3ku7bvvIHmgqjotK3kubDnmoTllYblk4Hlt7LliLDotKdgIDpcbiAgICAgICAgICAgICAgICAvLyAgICAgICAgICAgICAgICAgICAgIC8vICfmgqjotK3kubDnmoTllYblk4Hlt7LliLDotKcnLFxuICAgICAgICAgICAgICAgIC8vICAgICAgICAgICAgICAgICAgICAgJ+WIsOi0p+WVpu+8geS7mOWwvuasvu+8jOeri+WNs+WPkei0pycgOiBcbiAgICAgICAgICAgICAgICAvLyAgICAgICAgICAgICAgICAgICAgICfliLDotKfllabvvIHku5jlsL7mrL7vvIznq4vljbPlj5HotKcnLFxuICAgICAgICAgICAgICAgIC8vICAgICAgICAgICAgICAgICB0aW1lOiBgW+ihjOeoi10ke3RyaXAudGl0bGV9YFxuICAgICAgICAgICAgICAgIC8vICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgLy8gICAgICAgICAgICAgZm9ybV9pZDogdGFyZ2V0LnByZXBheV9pZCB8fCB0YXJnZXQuZm9ybV9pZFxuICAgICAgICAgICAgICAgIC8vICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAvLyAgICAgICAgICR1cmw6ICdub3RpZmljYXRpb24tZ2V0bW9uZXknXG4gICAgICAgICAgICAgICAgLy8gICAgIH0sXG4gICAgICAgICAgICAgICAgLy8gICAgIG5hbWU6ICdjb21tb24nXG4gICAgICAgICAgICAgICAgLy8gfSk7XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gY2xvdWQuY2FsbEZ1bmN0aW9uKHtcbiAgICAgICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9wZW5pZCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiAnZ2V0TW9uZXknLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHByZXBheV9pZDogdGFyZ2V0LnByZXBheV9pZCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZXh0czogWyfmlK/ku5jlsL7mrL7vvIznq4vljbPlj5HotKflk6YnLCfotorlv6votorlpb0nXVxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICR1cmw6ICdwdXNoLXN1YnNjcmliZSdcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgbmFtZTogJ2NvbW1vbidcbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgfSkpO1xuIFxuICAgICAgICAgICAgLy8g5pu05paw6KGM56iLXG4gICAgICAgICAgICBhd2FpdCBkYi5jb2xsZWN0aW9uKCd0cmlwJylcbiAgICAgICAgICAgICAgICAuZG9jKCB0aWQgKVxuICAgICAgICAgICAgICAgIC51cGRhdGUoe1xuICAgICAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjYWxsTW9uZXlUaW1lczogXy5pbmMoIDEgKVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHJldHVybiBjdHguYm9keSA9IHtcbiAgICAgICAgICAgICAgICBzdGF0dXM6IDIwMCxcbiAgICAgICAgICAgICAgICAvLyDliankvZnmrKHmlbBcbiAgICAgICAgICAgICAgICBkYXRhOiAzIC0gKCAxICsgdHJpcC5jYWxsTW9uZXlUaW1lcyApXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfSBjYXRjaCAoIGUgKSB7XG4gICAgICAgICAgICByZXR1cm4gY3R4LmJvZHkgPSB7IHN0YXR1czogNTAwIH07XG4gICAgICAgIH1cbiAgICB9KVxuXG4gICAgLyoqIFxuICAgICAqIEBkZXNjcmlwdGlvblxuICAgICAqIOiuouWNleS7mOWwvuasvlxuICAgICAqIHtcbiAgICAgKiAgICAgIHRpZFxuICAgICAqICAgICAgaW50ZWdyYWwgLy8g56ev5YiG5oC76aKd77yIdXNlcuihqO+8iVxuICAgICAqICAgICAgb3JkZXJzOiBbeyAgXG4gICAgICogICAgICAgICAgb2lkIC8vIOiuouWNleeKtuaAgVxuICAgICAqICAgICAgICAgIHBpZFxuICAgICAqICAgICAgICAgIGZpbmFsX3ByaWNlIC8vIOacgOe7iOaIkOS6pOminVxuICAgICAqICAgICAgICAgIGFsbG9jYXRlZENvdW50IC8vIOacgOe7iOaIkOS6pOmHj1xuICAgICAqICAgICAgfV1cbiAgICAgKiAgICAgIGNvdXBvbnM6IFsgLy8g5Y2h5Yi45raI6LS5XG4gICAgICogICAgICAgICAgaWQxLFxuICAgICAqICAgICAgICAgIGlkMi4uLlxuICAgICAqICAgICAgXSxcbiAgICAgKiAgICAgIHB1c2hfaW50ZWdyYWwgLy8g5L2/55So55qE5o6o5bm/56ev5YiGXG4gICAgICogfVxuICAgICAqL1xuICAgIGFwcC5yb3V0ZXIoJ3BheS1sYXN0JywgYXN5bmMoIGN0eCwgbmV4dCApID0+IHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGNvbnN0IG9wZW5pZCA9IGV2ZW50LnVzZXJJbmZvLm9wZW5JZDtcbiAgICAgICAgICAgIGNvbnN0IHsgdGlkLCBpbnRlZ3JhbCwgb3JkZXJzLCBjb3Vwb25zLCBwdXNoX2ludGVncmFsIH0gPSBldmVudC5kYXRhO1xuXG4gICAgICAgICAgICBjb25zdCB1c2VyJCA9IGF3YWl0IGRiLmNvbGxlY3Rpb24oJ3VzZXInKVxuICAgICAgICAgICAgICAgIC53aGVyZSh7XG4gICAgICAgICAgICAgICAgICAgIG9wZW5pZFxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLmdldCggKTtcbiAgICAgICAgICAgIGNvbnN0IHVzZXIgPSB1c2VyJC5kYXRhWyAwIF07XG4gICAgICAgICAgICBjb25zdCB1aWQgPSB1c2VyLl9pZDtcblxuICAgICAgICAgICAgLy8g6K6h566X5o6o5bm/56ev5YiGXG4gICAgICAgICAgICBjb25zdCBjYWxjdWxhdGVQdXNoSW50ZWdyYWwgPSB1c2VyLnB1c2hfaW50ZWdyYWwgLSBwdXNoX2ludGVncmFsID4gMCA/XG4gICAgICAgICAgICAgICAgdXNlci5wdXNoX2ludGVncmFsIC0gcHVzaF9pbnRlZ3JhbCA6IFxuICAgICAgICAgICAgICAgIDA7XG5cbiAgICAgICAgICAgIGNvbnN0IHNhdmVEYXRhID0ge1xuICAgICAgICAgICAgICAgIC4uLnVzZXIsXG4gICAgICAgICAgICAgICAgaW50ZWdyYWw6ICggdXNlci5pbnRlZ3JhbCB8fCAwICkgKyAoIGludGVncmFsIHx8IDAgKSxcbiAgICAgICAgICAgICAgICBwdXNoX2ludGVncmFsOiAhdXNlci5wdXNoX2ludGVncmFsID9cbiAgICAgICAgICAgICAgICAgICAgMCA6XG4gICAgICAgICAgICAgICAgICAgIGNhbGN1bGF0ZVB1c2hJbnRlZ3JhbFxuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgZGVsZXRlIHNhdmVEYXRhWydfaWQnXTtcblxuICAgICAgICAgICAgLy8g5aKe5Yqg56ev5YiG5oC76aKdXG4gICAgICAgICAgICAvLyDmirXmiaPmjqjlub/np6/liIZcbiAgICAgICAgICAgIGF3YWl0IGRiLmNvbGxlY3Rpb24oJ3VzZXInKVxuICAgICAgICAgICAgICAgIC5kb2MoIFN0cmluZyggdWlkICkpXG4gICAgICAgICAgICAgICAgLnNldCh7XG4gICAgICAgICAgICAgICAgICAgIGRhdGE6IHNhdmVEYXRhXG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIC8vIOaWsOWinuaOqOW5v+enr+WIhuS9v+eUqOiusOW9lVxuICAgICAgICAgICAgaWYgKCAhIXB1c2hfaW50ZWdyYWwgKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgcmVjb3JkJCA9IGF3YWl0IGRiLmNvbGxlY3Rpb24oJ2ludGVncmFsLXVzZS1yZWNvcmQnKVxuICAgICAgICAgICAgICAgICAgICAud2hlcmUoe1xuICAgICAgICAgICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRpZCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvcGVuaWQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogJ3B1c2hfaW50ZWdyYWwnXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgIC5nZXQoICk7XG4gICAgICAgICAgICAgICAgY29uc3QgcmVjb3JkID0gcmVjb3JkJC5kYXRhWyAwIF07XG5cbiAgICAgICAgICAgICAgICBpZiAoICEhcmVjb3JkICYmICEhcHVzaF9pbnRlZ3JhbCApIHtcbiAgICAgICAgICAgICAgICAgICAgYXdhaXQgZGIuY29sbGVjdGlvbignaW50ZWdyYWwtdXNlLXJlY29yZCcpXG4gICAgICAgICAgICAgICAgICAgICAgICAuZG9jKCBTdHJpbmcoIHJlY29yZC5faWQgKSlcbiAgICAgICAgICAgICAgICAgICAgICAgIC51cGRhdGUoe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU6IF8uaW5jKCBwdXNoX2ludGVncmFsIClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKCAhcmVjb3JkICYmICEhcHVzaF9pbnRlZ3JhbCApIHtcbiAgICAgICAgICAgICAgICAgICAgYXdhaXQgZGIuY29sbGVjdGlvbignaW50ZWdyYWwtdXNlLXJlY29yZCcpXG4gICAgICAgICAgICAgICAgICAgICAgICAuYWRkKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRpZCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb3BlbmlkLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZTogcHVzaF9pbnRlZ3JhbCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogJ3B1c2hfaW50ZWdyYWwnXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyDmm7TmlrDorqLljZXnirbmgIHjgIHllYblk4HplIDph49cbiAgICAgICAgICAgIGF3YWl0IFByb21pc2UuYWxsKCBvcmRlcnMubWFwKCBvcmRlciA9PiB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFByb21pc2UuYWxsKFtcbiAgICAgICAgICAgICAgICAgICAgZGIuY29sbGVjdGlvbignb3JkZXInKVxuICAgICAgICAgICAgICAgICAgICAgICAgLmRvYyggb3JkZXIub2lkIClcbiAgICAgICAgICAgICAgICAgICAgICAgIC51cGRhdGUoe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYmFzZV9zdGF0dXM6ICczJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGF5X3N0YXR1czogJzInLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmaW5hbF9wcmljZTogb3JkZXIuZmluYWxfcHJpY2UsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBheXRpbWU6IGdldE5vdyggdHJ1ZSApXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfSksXG4gICAgICAgICAgICAgICAgICAgIGRiLmNvbGxlY3Rpb24oJ2dvb2RzJylcbiAgICAgICAgICAgICAgICAgICAgICAgIC5kb2MoIG9yZGVyLnBpZCApXG4gICAgICAgICAgICAgICAgICAgICAgICAudXBkYXRlKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNhbGVkOiBfLmluYyggb3JkZXIuYWxsb2NhdGVkQ291bnQgKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgXSlcbiAgICAgICAgICAgIH0pKTtcblxuICAgICAgICAgICAgLy8g5pu05paw5Y2h5Yi45L2/55So54q25oCBXG4gICAgICAgICAgICBhd2FpdCBQcm9taXNlLmFsbCggY291cG9ucy5tYXAoIGNvdXBvbmlkID0+IHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZGIuY29sbGVjdGlvbignY291cG9uJylcbiAgICAgICAgICAgICAgICAgICAgLmRvYyggY291cG9uaWQgKVxuICAgICAgICAgICAgICAgICAgICAudXBkYXRlKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpc1VzZWQ6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdXNlZEJ5OiB0aWQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FuVXNlSW5OZXh0OiBmYWxzZVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgfSkpO1xuXG4gICAgICAgICAgICAvLyDovr7liLDmnaHku7bvvIzliJnpooblj5bku6Pph5HliLhcbiAgICAgICAgICAgIC8vIOWQjOaXtuWIoOmZpOS4iuS4gOS4quacquS9v+eUqOi/h+eahOS7o+mHkeWIuFxuICAgICAgICAgICAgY29uc3QgdHJpcCQgPSBhd2FpdCBkYi5jb2xsZWN0aW9uKCd0cmlwJylcbiAgICAgICAgICAgICAgICAuZG9jKCB0aWQgKVxuICAgICAgICAgICAgICAgIC5nZXQoICk7XG5cbiAgICAgICAgICAgIGxldCByZXEgPSB7XG4gICAgICAgICAgICAgICAgcmVzdWx0OiB7XG4gICAgICAgICAgICAgICAgICAgIHN0YXR1czogNTAwXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgXG4gICAgICAgICAgICBjb25zdCB7IGNhc2hjb3Vwb25fYXRsZWFzdCwgY2FzaGNvdXBvbl92YWx1ZXMgfSA9IHRyaXAkLmRhdGE7XG5cbiAgICAgICAgICAgIGNvbnN0IHRlbXAgPSB7XG4gICAgICAgICAgICAgICAgb3BlbklkOiBvcGVuaWQsXG4gICAgICAgICAgICAgICAgZnJvbXRpZDogdGlkLFxuICAgICAgICAgICAgICAgIHR5cGU6ICd0X2RhaWppbicsXG4gICAgICAgICAgICAgICAgdGl0bGU6ICfooYznqIvku6Pph5HliLgnLFxuICAgICAgICAgICAgICAgIGNhblVzZUluTmV4dDogdHJ1ZSxcbiAgICAgICAgICAgICAgICBpc1VzZWQ6IGZhbHNlLFxuICAgICAgICAgICAgICAgIGF0bGVhc3Q6IGNhc2hjb3Vwb25fYXRsZWFzdCB8fCAwLFxuICAgICAgICAgICAgICAgIHZhbHVlOiBjYXNoY291cG9uX3ZhbHVlc1xuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgLy8g5peg6ZyA6Zeo5qeb77yM5pyJ5Luj6YeR5Yi45Y2z5Y+v6aKG5Y+WXG4gICAgICAgICAgICBpZiAoICEhY2FzaGNvdXBvbl92YWx1ZXMgKSB7XG5cbiAgICAgICAgICAgICAgICAvLyDliKDpmaTkuIrkuIDkuKrmnKrkvb/nlKjnmoTku6Pph5HliLhcbiAgICAgICAgICAgICAgICBjb25zdCBsYXN0RGFpamluJCA9IGF3YWl0IGRiLmNvbGxlY3Rpb24oJ2NvdXBvbicpXG4gICAgICAgICAgICAgICAgICAgIC53aGVyZSh7XG4gICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiAndF9kYWlqaW4nLFxuICAgICAgICAgICAgICAgICAgICAgICAgaXNVc2VkOiBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhblVzZUluTmV4dDogdHJ1ZVxuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAuZ2V0KCApO1xuXG4gICAgICAgICAgICAgICAgaWYgKCBsYXN0RGFpamluJC5kYXRhWyAwIF0pIHtcbiAgICAgICAgICAgICAgICAgICAgYXdhaXQgZGIuY29sbGVjdGlvbignY291cG9uJylcbiAgICAgICAgICAgICAgICAgICAgICAgIC5kb2MoIFN0cmluZyggbGFzdERhaWppbiQuZGF0YVsgMCBdLl9pZCApKVxuICAgICAgICAgICAgICAgICAgICAgICAgLnJlbW92ZSggKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAvLyDpooblj5bku6Pph5HliLhcbiAgICAgICAgICAgICAgICByZXEgPSBhd2FpdCBjbG91ZC5jYWxsRnVuY3Rpb24oe1xuICAgICAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRhOiB0ZW1wLFxuICAgICAgICAgICAgICAgICAgICAgICAgJHVybDogJ2NyZWF0ZSdcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgbmFtZTogJ2NvdXBvbidcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIGN0eC5ib2R5ID0ge1xuICAgICAgICAgICAgICAgIHN0YXR1czogMjAwLFxuICAgICAgICAgICAgICAgIGRhdGE6IHJlcS5yZXN1bHQuc3RhdHVzID09PSAyMDAgPyB0ZW1wIDogbnVsbCBcbiAgICAgICAgICAgIH1cblxuICAgICAgICB9IGNhdGNoICggZSApIHtcbiAgICAgICAgICAgIHJldHVybiBjdHguYm9keSA9IHsgc3RhdHVzOiA1MDAgfVxuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICAvKiogXG4gICAgICogQGRlc2NyaXB0aW9uXG4gICAgICog5Luj6LSt6I635Y+W5pyq6K+76K6i5Y2VXG4gICAgICovXG4gICAgYXBwLnJvdXRlcigndW5yZWFkJywgYXN5bmMoIGN0eCwgbmV4dCApID0+IHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGNvbnN0IHsgdGlkLCBsYXN0VGltZSB9ID0gZXZlbnQuZGF0YTtcbiAgICAgICAgICAgIGxldCB3aGVyZSQgPSB7XG4gICAgICAgICAgICAgICAgdGlkXG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICBpZiAoIGxhc3RUaW1lICkge1xuICAgICAgICAgICAgICAgIHdoZXJlJCA9IE9iamVjdC5hc3NpZ24oeyB9LCB3aGVyZSQsIHtcbiAgICAgICAgICAgICAgICAgICAgY3JlYXRldGltZTogXy5ndGUoIGxhc3RUaW1lIClcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgY29uc3QgZGF0YSQgPSBhd2FpdCBkYi5jb2xsZWN0aW9uKCdvcmRlcicpXG4gICAgICAgICAgICAgICAgLndoZXJlKCB3aGVyZSQgKVxuICAgICAgICAgICAgICAgIC5jb3VudCggKTtcblxuICAgICAgICAgICAgcmV0dXJuIGN0eC5ib2R5ID0ge1xuICAgICAgICAgICAgICAgIHN0YXR1czogMjAwLFxuICAgICAgICAgICAgICAgIGRhdGE6IGRhdGEkLnRvdGFsXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfSBjYXRjaCAoIGUgKSB7IHJldHVybiBjdHguYm9keSA9IHsgc3RhdHVzOiA1MDAgfTt9XG4gICAgfSk7XG5cbiAgICAvKiogXG4gICAgICogQGRlc2NyaXB0aW9uXG4gICAgICog5Luj6LSt5p+l55yL5omA5pyJ55qE6K6i5Y2V5YiX6KGoXG4gICAgICovXG4gICAgYXBwLnJvdXRlcignbGlzdC1hbGwnLCBhc3luYyggY3R4LCBuZXh0ICkgPT4ge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgLy8g5p+l6K+i5p2h5pWwXG4gICAgICAgICAgICBjb25zdCBsaW1pdCA9IDEwO1xuICAgICAgICAgICAgY29uc3QgeyB0aWQsIHBhZ2UgfSA9IGV2ZW50LmRhdGE7XG5cbiAgICAgICAgICAgIGNvbnN0IHdoZXJlJCA9IHtcbiAgICAgICAgICAgICAgICB0aWQsXG4gICAgICAgICAgICAgICAgcGF5X3N0YXR1czogXy5uZXEoJzAnKVxuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgY29uc3QgdG90YWwkID0gYXdhaXQgZGIuY29sbGVjdGlvbignb3JkZXInKVxuICAgICAgICAgICAgICAgIC53aGVyZSggd2hlcmUkIClcbiAgICAgICAgICAgICAgICAuY291bnQoICk7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGNvbnN0IG9yZGVycyQgPSBhd2FpdCBkYi5jb2xsZWN0aW9uKCdvcmRlcicpXG4gICAgICAgICAgICAgICAgLndoZXJlKCB3aGVyZSQgKVxuICAgICAgICAgICAgICAgIC5saW1pdCggbGltaXQgKVxuICAgICAgICAgICAgICAgIC5za2lwKCggcGFnZSAtIDEgKSAqIGxpbWl0IClcbiAgICAgICAgICAgICAgICAub3JkZXJCeSgnY3JlYXRlVGltZScsICdkZXNjJylcbiAgICAgICAgICAgICAgICAuZ2V0KCApO1xuXG4gICAgICAgICAgICBjb25zdCBwaWRzID0gQXJyYXkuZnJvbShcbiAgICAgICAgICAgICAgICBuZXcgU2V0KCBcbiAgICAgICAgICAgICAgICAgICAgb3JkZXJzJC5kYXRhXG4gICAgICAgICAgICAgICAgICAgICAgICAubWFwKCB4ID0+IHgucGlkIClcbiAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICApO1xuXG4gICAgICAgICAgICBjb25zdCBzaWRzID0gQXJyYXkuZnJvbShcbiAgICAgICAgICAgICAgICBuZXcgU2V0KCBcbiAgICAgICAgICAgICAgICAgICAgb3JkZXJzJC5kYXRhXG4gICAgICAgICAgICAgICAgICAgICAgICAubWFwKCB4ID0+IHguc2lkIClcbiAgICAgICAgICAgICAgICAgICAgICAgIC5maWx0ZXIoIHggPT4gISF4IClcbiAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICApO1xuXG4gICAgICAgICAgICBjb25zdCB1aWRzID0gQXJyYXkuZnJvbShcbiAgICAgICAgICAgICAgICBuZXcgU2V0KCBcbiAgICAgICAgICAgICAgICAgICAgb3JkZXJzJC5kYXRhXG4gICAgICAgICAgICAgICAgICAgICAgICAubWFwKCB4ID0+IHgub3BlbmlkIClcbiAgICAgICAgICAgICAgICAgICAgICAgIC5maWx0ZXIoIHggPT4gISF4IClcbiAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICApO1xuXG4gICAgICAgICAgICAvLyBjb25zdCBnb29kcyQkID0gYXdhaXQgUHJvbWlzZS5hbGwoXG4gICAgICAgICAgICAvLyAgICAgcGlkcy5tYXAoIFxuICAgICAgICAgICAgLy8gICAgICAgICBwaWQgPT4gZGIuY29sbGVjdGlvbignZ29vZHMnKVxuICAgICAgICAgICAgLy8gICAgICAgICAgICAgLmRvYyggU3RyaW5nKCBwaWQgKSlcbiAgICAgICAgICAgIC8vICAgICAgICAgICAgIC5nZXQoIClcbiAgICAgICAgICAgIC8vICAgICApXG4gICAgICAgICAgICAvLyApO1xuICAgICAgICAgICAgLy8gY29uc3QgZ29vZHMkID0gZ29vZHMkJC5tYXAoIHggPT4geC5kYXRhICk7XG5cbiAgICAgICAgICAgIC8vIGNvbnN0IHN0YW5kYXJzJCQgPSBhd2FpdCBQcm9taXNlLmFsbChcbiAgICAgICAgICAgIC8vICAgICBzaWRzLm1hcCggXG4gICAgICAgICAgICAvLyAgICAgICAgIHNpZCA9PiBkYi5jb2xsZWN0aW9uKCdzdGFuZGFyZHMnKVxuICAgICAgICAgICAgLy8gICAgICAgICAgICAgLmRvYyggU3RyaW5nKCBzaWQgKSlcbiAgICAgICAgICAgIC8vICAgICAgICAgICAgIC5maWVsZCh7XG4gICAgICAgICAgICAvLyAgICAgICAgICAgICAgICAgcGlkOiB0cnVlLFxuICAgICAgICAgICAgLy8gICAgICAgICAgICAgICAgIG5hbWU6IHRydWVcbiAgICAgICAgICAgIC8vICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAvLyAgICAgICAgICAgICAuZ2V0KCApXG4gICAgICAgICAgICAvLyAgICAgKVxuICAgICAgICAgICAgLy8gKTtcbiAgICAgICAgICAgIC8vIGNvbnN0IHN0YW5kYXJzJCA9IHN0YW5kYXJzJCQubWFwKCB4ID0+IHguZGF0YSApO1xuXG4gICAgICAgICAgICBjb25zdCB1c2VycyQkID0gYXdhaXQgUHJvbWlzZS5hbGwoXG4gICAgICAgICAgICAgICAgdWlkcy5tYXAoIFxuICAgICAgICAgICAgICAgICAgICBvcGVuaWQgPT4gZGIuY29sbGVjdGlvbigndXNlcicpXG4gICAgICAgICAgICAgICAgICAgICAgICAud2hlcmUoe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9wZW5pZFxuICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgICAgIC5maWVsZCh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb3BlbmlkOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGF2YXRhclVybDogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBuaWNrTmFtZTogdHJ1ZVxuICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgICAgIC5nZXQoIClcbiAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgY29uc3QgdXNlcnMkID0gdXNlcnMkJC5tYXAoIHggPT4geC5kYXRhWyAwIF0pO1xuXG4gICAgICAgICAgICBjb25zdCBtZXRhID0gb3JkZXJzJC5kYXRhLm1hcCggb3JkZXIgPT4ge1xuXG4gICAgICAgICAgICAgICAgY29uc3QgdXNlciA9IHVzZXJzJC5maW5kKCB1c2VyID0+IHVzZXIub3BlbmlkID09PSBvcmRlci5vcGVuaWQgKTtcbiAgICAgICAgICAgICAgICAvLyBjb25zdCBkZXRhaWwgPSBnb29kcyQuZmluZCggZ29vZCA9PiBnb29kLl9pZCA9PT0gb3JkZXIucGlkICk7XG4gICAgICAgICAgICAgICAgLy8gY29uc3Qgc3RhbmRhciA9IHN0YW5kYXJzJC5maW5kKCBzID0+IHMuX2lkID09PSBvcmRlci5zaWQgKTtcblxuICAgICAgICAgICAgICAgIHJldHVybiBPYmplY3QuYXNzaWduKHsgfSwgb3JkZXIsIHtcbiAgICAgICAgICAgICAgICAgICAgdXNlcixcbiAgICAgICAgICAgICAgICAgICAgLy8gZGV0YWlsLFxuICAgICAgICAgICAgICAgICAgICAvLyBzdGFuZGFyXG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICByZXR1cm4gY3R4LmJvZHkgPSB7XG4gICAgICAgICAgICAgICAgc3RhdHVzOiAyMDAsXG4gICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgICBwYWdlLFxuICAgICAgICAgICAgICAgICAgICBwYWdlU2l6ZTogbGltaXQsXG4gICAgICAgICAgICAgICAgICAgIGRhdGE6IG1ldGEsXG4gICAgICAgICAgICAgICAgICAgIHRvdGFsOiB0b3RhbCQudG90YWwsXG4gICAgICAgICAgICAgICAgICAgIHRvdGFsUGFnZTogTWF0aC5jZWlsKCB0b3RhbCQudG90YWwgLyBsaW1pdCApXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG5cbiAgICAgICAgfSBjYXRjaCAoIGUgKSB7IFxuICAgICAgICAgICAgY29uc29sZS5sb2coJz8/PycsIGUgKVxuICAgICAgICAgICAgcmV0dXJuIGN0eC5ib2R5ID0geyBzdGF0dXM6IDUwMCB9XG4gICAgICAgIH1cbiAgICB9KVxuIFxuICAgcmV0dXJuIGFwcC5zZXJ2ZSggKTtcblxufVxuXG4vKiog5qC55o2u57G75Z6L77yM6L+U5Zue5o6o6YCB5paH5qGIICovXG5mdW5jdGlvbiBnZXRUZXh0QnlQdXNoVHlwZSggdHlwZTogJ2J1eVBpbjEnIHwgJ2J1eVBpbjInIHwgJ3dhaXRQaW4nIHwgJ2J1eScgfCAnZ2V0TW9uZXknLCBkZWx0YSApIHtcblxuICAgIGNvbnN0IG5vdyA9IGdldE5vdyggKTtcbiAgICBjb25zdCBtb250aCA9IG5vdy5nZXRNb250aCggKSArIDE7XG4gICAgY29uc3QgZGF0ZSA9IG5vdy5nZXREYXRlKCApO1xuICAgIGNvbnN0IGhvdXIgPSBub3cuZ2V0SG91cnMoICk7XG4gICAgY29uc3QgbWludXRlcyA9IG5vdy5nZXRNaW51dGVzKCApO1xuXG4gICAgY29uc3QgZml4WmVybyA9IHMgPT4gU3RyaW5nKCBzICkubGVuZ3RoID09PSAxID8gYDAke3N9YCA6IHM7IFxuXG4gICAgaWYgKCB0eXBlID09PSAnYnV5JyApIHtcbiAgICAgICAgcmV0dXJuIFtcbiAgICAgICAgICAgIGDkuIvljZXmiJDlip/vvIHkvJrlsL3lv6vph4fotK3vvZ5gLCBcbiAgICAgICAgICAgIGAke21vbnRofeaciCR7ZGF0ZX3ml6UgJHtob3VyfToke2ZpeFplcm8oIG1pbnV0ZXMgKX1gXG4gICAgICAgIF07XG4gICAgfSBlbHNlIGlmICggdHlwZSA9PT0gJ2J1eVBpbjEnICkge1xuICAgICAgICByZXR1cm4gW1xuICAgICAgICAgICAgYOaBreWWnOS9oOecgeS6hiR7ZGVsdGF95YWD77yBYCxcbiAgICAgICAgICAgIGDngrnlh7vmn6XnnItgXG4gICAgICAgIF1cbiAgICB9IGVsc2UgaWYgKCB0eXBlID09PSAnYnV5UGluMicgKSB7XG4gICAgICAgIHJldHVybiBbXG4gICAgICAgICAgICBg5oGt5Zac77yB5L2g55yB5LqGJHtkZWx0YX3lhYMhYCxcbiAgICAgICAgICAgIGDmnInnvqTlj4vlj4LliqDkuobmi7zlm6LvvIzngrnlh7vmn6XnnItgXG4gICAgICAgIF1cbiAgICB9IGVsc2UgaWYgKCB0eXBlID09PSAnd2FpdFBpbicgKSB7XG4gICAgICAgIHJldHVybiBbXG4gICAgICAgICAgICBg5beuMeS6uuWwseaLvOaIkO+8gWAsXG4gICAgICAgICAgICBg5om+576k5Y+L5ou85Zui77yM56uL55yBJHtkZWx0YX3lhYPvvIFgXG4gICAgICAgIF1cbiAgICB9IGVsc2UgaWYgKCB0eXBlID09PSAnZ2V0TW9uZXknICkge1xuICAgICAgICByZXR1cm4gW1xuICAgICAgICAgICAgYOaUr+S7mOWwvuasvu+8jOeri+WNs+WPkei0p+WTpmAsXG4gICAgICAgICAgICBg6LaK5b+r6LaK5aW9YFxuICAgICAgICBdXG4gICAgfVxuICAgIHJldHVybiBbXVxufSJdfQ==