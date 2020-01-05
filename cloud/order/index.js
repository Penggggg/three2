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
                                                            texts: ["\u606D\u559C\uFF01\u4F60\u83B7\u5F97" + integral + "\u5143\u62B5\u73B0\u91D1\uFF01", "\u6709\u670B\u53CB\u8D2D\u4E70\u4E86\u4F60\u63A8\u5E7F\u5206\u4EAB\u7684\u5546\u54C1\uFF5E"]
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
            var _a, tid_1, needCoupons, needAddress, shoppinglist$, shoppinglist_1, orders$_1, users$, deliverfees$_1, pushIntegral$_1, address$_1, coupons$_1, userOders, e_4;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 10, , 11]);
                        _a = event.data, tid_1 = _a.tid, needCoupons = _a.needCoupons, needAddress = _a.needAddress;
                        return [4, db.collection('shopping-list')
                                .where({
                                tid: tid_1
                            })
                                .get()];
                    case 1:
                        shoppinglist$ = _b.sent();
                        shoppinglist_1 = shoppinglist$.data;
                        return [4, db.collection('order')
                                .where({
                                tid: tid_1,
                                base_status: _.neq('5'),
                                pay_status: _.or(_.eq('1'), _.eq('2'))
                            })
                                .get()];
                    case 2:
                        orders$_1 = _b.sent();
                        return [4, Promise.all(Array.from(new Set(orders$_1.data
                                .map(function (x) { return x.openid; })))
                                .map(function (uid) { return db.collection('user')
                                .where({
                                openid: uid
                            })
                                .get(); }))];
                    case 3:
                        users$ = _b.sent();
                        return [4, Promise.all(Array.from(new Set(orders$_1.data
                                .map(function (x) { return x.openid; })))
                                .map(function (uid) { return db.collection('deliver-fee')
                                .where({
                                tid: tid_1,
                                openid: uid
                            })
                                .get(); }))];
                    case 4:
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
                    case 5:
                        pushIntegral$_1 = _b.sent();
                        address$_1 = [];
                        if (!(!!needAddress || needAddress === undefined)) return [3, 7];
                        return [4, Promise.all(Array.from(new Set(orders$_1.data
                                .map(function (x) { return x.aid; })))
                                .map(function (aid) { return db.collection('address')
                                .doc(aid)
                                .get(); }))];
                    case 6:
                        address$_1 = _b.sent();
                        _b.label = 7;
                    case 7:
                        coupons$_1 = [];
                        if (!(!!needCoupons || needCoupons === undefined)) return [3, 9];
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
                    case 8:
                        coupons$_1 = _b.sent();
                        _b.label = 9;
                    case 9:
                        userOders = users$.map(function (user$, k) {
                            var user = user$.data[0];
                            var orders = orders$_1.data
                                .filter(function (x) { return x.openid === user.openid; })
                                .map(function (x) {
                                var sl = shoppinglist_1.find(function (y) { return y.pid === x.pid && y.sid === x.sid; });
                                return __assign(__assign({}, x), { canGroup: sl.uids.length > 1 });
                            });
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
                    case 10:
                        e_4 = _b.sent();
                        console.log('...', e_4);
                        return [2, ctx.body = { status: 500 }];
                    case 11: return [2];
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
                        _b.trys.push([0, 6, , 7]);
                        canGroupUserMapCount_1 = {};
                        _a = event.data, tid = _a.tid, orders_1 = _a.orders, notification = _a.notification;
                        getWrong = function (message) { return ctx.body = {
                            message: message,
                            status: 400
                        }; };
                        return [4, db.collection('trip')
                                .doc(tid)
                                .update({
                                data: {
                                    isClosed: true
                                }
                            })];
                    case 1:
                        _b.sent();
                        return [4, db.collection('trip')
                                .doc(tid)
                                .get()];
                    case 2:
                        trip$ = _b.sent();
                        trip = trip$.data;
                        if (trip.callMoneyTimes && trip.callMoneyTimes >= 3) {
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
                    case 3:
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
                    case 4:
                        rs = _b.sent();
                        return [4, db.collection('trip')
                                .doc(tid)
                                .update({
                                data: {
                                    callMoneyTimes: _.inc(1)
                                }
                            })];
                    case 5:
                        _b.sent();
                        return [2, ctx.body = {
                                status: 200,
                                data: 3 - (1 + trip.callMoneyTimes)
                            }];
                    case 6:
                        e_6 = _b.sent();
                        return [2, ctx.body = { status: 500 }];
                    case 7: return [2];
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
            "\u606D\u559C\uFF01\u4F60\u7701\u4E86" + delta + "\u5143\uFF01",
            "\u70B9\u51FB\u67E5\u770B"
        ];
    }
    else if (type === 'buyPin2') {
        return [
            "\u606D\u559C\uFF01\u4F60\u7701\u4E86" + delta + "\u5143!",
            "\u6709\u7FA4\u53CB\u53C2\u52A0\u4E86\u7FA4\u62FC\u56E2\uFF0C\u70B9\u51FB\u67E5\u770B"
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUNBLHFDQUF1QztBQUN2QyxzQ0FBd0M7QUFDeEMsbUNBQW1DO0FBRW5DLEtBQUssQ0FBQyxJQUFJLENBQUM7SUFDUCxHQUFHLEVBQUUsT0FBTyxDQUFDLEdBQUcsQ0FBQyxLQUFLO0NBQ3pCLENBQUMsQ0FBQztBQUVILElBQU0sRUFBRSxHQUFnQixLQUFLLENBQUMsUUFBUSxFQUFHLENBQUM7QUFDMUMsSUFBTSxDQUFDLEdBQUcsRUFBRSxDQUFDLE9BQU8sQ0FBQztBQVFyQixJQUFNLE1BQU0sR0FBRyxVQUFFLEVBQVU7SUFBVixtQkFBQSxFQUFBLFVBQVU7SUFDdkIsSUFBSyxFQUFFLEVBQUc7UUFDTixPQUFPLElBQUksQ0FBQyxHQUFHLEVBQUcsQ0FBQztLQUN0QjtJQUNELElBQU0sTUFBTSxHQUFHLElBQUksSUFBSSxDQUFFLElBQUksSUFBSSxFQUFHLENBQUMsY0FBYyxFQUFHLENBQUMsQ0FBQztJQUN4RCxPQUFPLElBQUksSUFBSSxDQUFFLE1BQU0sQ0FBQyxPQUFPLEVBQUcsR0FBRyxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxJQUFJLENBQUUsQ0FBQTtBQUM3RCxDQUFDLENBQUE7QUFvQ1ksUUFBQSxJQUFJLEdBQUcsVUFBUSxLQUFLLEVBQUUsT0FBTzs7O1FBRWhDLEdBQUcsR0FBRyxJQUFJLFNBQVMsQ0FBQyxFQUFFLEtBQUssT0FBQSxFQUFFLENBQUMsQ0FBQztRQWlDckMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxRQUFRLEVBQUUsVUFBTyxHQUFHLEVBQUUsSUFBSTs7Ozs7O3dCQUd2QixLQUF3QixLQUFLLENBQUMsSUFBSSxFQUFoQyxHQUFHLFNBQUEsRUFBRSxJQUFJLFVBQUEsRUFBRSxNQUFNLFlBQUEsQ0FB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QUFNO1NBQ1QsQ0FBQTtLQUNKO1NBQU0sSUFBSyxJQUFJLEtBQUssU0FBUyxFQUFHO1FBQzdCLE9BQU87WUFDSCx5Q0FBUyxLQUFLLFlBQUk7WUFDbEIsc0ZBQWdCO1NBQ25CLENBQUE7S0FDSjtTQUFNLElBQUssSUFBSSxLQUFLLFNBQVMsRUFBRztRQUM3QixPQUFPO1lBQ0gsdUNBQVM7WUFDVCxxREFBVyxLQUFLLGlCQUFJO1NBQ3ZCLENBQUE7S0FDSjtTQUFNLElBQUssSUFBSSxLQUFLLFVBQVUsRUFBRztRQUM5QixPQUFPO1lBQ0gsOERBQVk7WUFDWiwwQkFBTTtTQUNULENBQUE7S0FDSjtJQUNELE9BQU8sRUFBRSxDQUFBO0FBQ2IsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIlxuaW1wb3J0ICogYXMgY2xvdWQgZnJvbSAnd3gtc2VydmVyLXNkayc7XG5pbXBvcnQgKiBhcyBUY2JSb3V0ZXIgZnJvbSAndGNiLXJvdXRlcic7XG5pbXBvcnQgeyBjcmVhdGUkIH0gZnJvbSAnLi9jcmVhdGUnO1xuXG5jbG91ZC5pbml0KHtcbiAgICBlbnY6IHByb2Nlc3MuZW52LmNsb3VkXG59KTtcblxuY29uc3QgZGI6IERCLkRhdGFiYXNlID0gY2xvdWQuZGF0YWJhc2UoICk7XG5jb25zdCBfID0gZGIuY29tbWFuZDtcblxuLyoqIFxuICog6L2s5o2i5qC85p6X5bC85rK75pe25Yy6ICs45pe25Yy6XG4gKiBEYXRlKCkubm93KCkgLyBuZXcgRGF0ZSgpLmdldFRpbWUoKSDmmK/ml7bkuI3ml7bmraPluLjnmoQrOFxuICogRGF0ZS50b0xvY2FsU3RyaW5nKCApIOWlveWDj+aYr+S4gOebtOaYrysw55qEXG4gKiDlhYjmi7/liLAgKzDvvIznhLblkI4rOFxuICovXG5jb25zdCBnZXROb3cgPSAoIHRzID0gZmFsc2UgKTogYW55ID0+IHtcbiAgICBpZiAoIHRzICkge1xuICAgICAgICByZXR1cm4gRGF0ZS5ub3coICk7XG4gICAgfVxuICAgIGNvbnN0IHRpbWVfMCA9IG5ldyBEYXRlKCBuZXcgRGF0ZSggKS50b0xvY2FsZVN0cmluZyggKSk7XG4gICAgcmV0dXJuIG5ldyBEYXRlKCB0aW1lXzAuZ2V0VGltZSggKSArIDggKiA2MCAqIDYwICogMTAwMCApXG59XG5cbi8qKlxuICogXG4gKiBAZGVzY3JpcHRpb24g6K6i5Y2V5qih5Z2XXG4gKiAtLS0tLS0tLSDlrZfmrrUgLS0tLS0tLS0tLVxuICogX2lkXG4gKiBvcGVuaWQsXG4gKiBjcmVhdGV0aW1lXG4gKiBwYXl0aW1lXG4gKiB0aWQsXG4gKiBwaWQsXG4gKiBjaWQgKOWPr+S4uuepuilcbiAqIHNpZCwgKOWPr+S4uuepuilcbiAqIGNvdW50LFxuICogcHJpY2UsXG4gKiBncm91cFByaWNlLFxuICogZGVwb3NpdF9wcmljZTog5ZWG5ZOB6K6i6YeRICjlj6/kuLrnqbopXG4gKiAhIGFjaWQg5ZWG5ZOB5rS75YqoaWRcbiAqICEgaXNPY2N1cGllZCwg5piv5ZCm5Y2g5bqT5a2YXG4gKiBncm91cF9wcmljZSAo5Y+v5Li656m6KVxuICogdHlwZTogJ2N1c3RvbScgfCAnbm9ybWFsJyB8ICdwcmUnIOiHquWumuS5ieWKoOWNleOAgeaZrumAmuWKoOWNleOAgemihOiuouWNlVxuICogaW1nOiBBcnJheVsgc3RyaW5nIF1cbiAqIGRlc2PvvIjlj6/kuLrnqbrvvIksXG4gKiBhaWRcbiAqIGFsbG9jYXRlZFByaWNlIOWIhumFjeeahOS7t+agvFxuICogYWxsb2NhdGVkR3JvdXBQcmljZSDliIbphY3lm6LotK3ku7dcbiAqIGFsbG9jYXRlZENvdW50IOWIhumFjeeahOaVsOmHj1xuICogZm9ybV9pZFxuICogcHJlcGF5X2lkLFxuICogZmluYWxfcHJpY2Ug5pyA5ZCO5oiQ5Lqk5Lu3XG4gKiAhIGNhbkdyb3VwIOaYr+WQpuWPr+S7peaLvOWbolxuICogYmFzZV9zdGF0dXM6IDAsMSwyLDMsNCw1IOi/m+ihjOS4re+8jOS7o+i0reW3sui0reS5sO+8jOW3suiwg+aVtO+8jOW3sue7k+eul++8jOW3suWPlua2iO+8iOS5sOS4jeWIsO+8ie+8jOW3sui/h+acn++8iOaUr+S7mOi/h+acn++8iVxuICogcGF5X3N0YXR1czogMCwxLDIg5pyq5LuY5qy+77yM5bey5LuY6K6i6YeR77yM5bey5LuY5YWo5qy+XG4gKiAhIGRlbGl2ZXJfc3RhdHVzOiAwLDEg5pyq5Y+R5biD77yM5bey5Y+R5biD44CBXG4gKi9cbmV4cG9ydCBjb25zdCBtYWluID0gYXN5bmMgKCBldmVudCwgY29udGV4dCApID0+IHtcblxuICAgIGNvbnN0IGFwcCA9IG5ldyBUY2JSb3V0ZXIoeyBldmVudCB9KTtcblxuICAgIC8qKlxuICAgICAqIEBkZXNjcmlwdGlvbiDliJvlu7rorqLljZVcbiAgICAgKiAtLS0tLS0tLSDor7fmsYIgLS0tLS0tLS0tLVxuICAgICAqIHtcbiAgICAgKiAgICAgIHRpZCxcbiAgICAgKiAgICAgIG9wZW5JZCAvLyDorqLljZXkuLvkurpcbiAgICAgKiAgICAgIGZyb206ICdjYXJ0JyB8ICdidXknIHwgJ2N1c3RvbScgfCAnYWdlbnRzJyB8ICdzeXN0ZW0nIOadpea6kO+8mui0reeJqei9puOAgeebtOaOpei0reS5sOOAgeiHquWumuS5ieS4i+WNleOAgeS7o+i0reS4i+WNleOAgeezu+e7n+WPkei1t+mihOS7mOiuouWNlVxuICAgICAqICAgICAgb3JkZXJzOiBBcnJheTx7IFxuICAgICAqICAgICAgICAgIHRpZFxuICAgICAqICAgICAgICAgIGNpZFxuICAgICAqICAgICAgICAgIHNpZFxuICAgICAqICAgICAgICAgIHBpZFxuICAgICAqICAgICAgICAgIHByaWNlXG4gICAgICogICAgICAgICAgbmFtZVxuICAgICAqICAgICAgICAgIGFjaWRcbiAgICAgKiAgICAgICAgICBzdGFuZGVybmFtZVxuICAgICAqICAgICAgICAgIGdyb3VwUHJpY2VcbiAgICAgKiAgICAgICAgICBjb3VudFxuICAgICAqICAgICAgICAgIGRlc2NcbiAgICAgKiAgICAgICAgICBpbWdcbiAgICAgKiAgICAgICAgICB0eXBlXG4gICAgICogICAgICAgICAgcGF5X3N0YXR1cyxcbiAgICAgKiAgICAgICAgICBhZGRyZXNzOiB7XG4gICAgICogICAgICAgICAgICAgIG5hbWUsXG4gICAgICogICAgICAgICAgICAgIHBob25lLFxuICAgICAqICAgICAgICAgICAgICBkZXRhaWwsXG4gICAgICogICAgICAgICAgICAgIHBvc3RhbGNvZGVcbiAgICAgKiAgICAgICAgICB9XG4gICAgICogICAgICB9PlxuICAgICAqIH1cbiAgICAgKi9cbiAgICBhcHAucm91dGVyKCdjcmVhdGUnLCBhc3luYyggY3R4LCBuZXh0ICkgPT4ge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgXG4gICAgICAgICAgICBjb25zdCB7IHRpZCwgZnJvbSwgb3JkZXJzIH0gPSBldmVudC5kYXRhO1xuICAgICAgICAgICAgY29uc3Qgb3BlbmlkID0gZXZlbnQuZGF0YS5vcGVuSWQgfHwgZXZlbnQudXNlckluZm8ub3BlbklkO1xuXG4gICAgICAgICAgICAvLyAx44CB5Yik5pat6K+l6KGM56iL5piv5ZCm5Y+v5Lul55SoXG4gICAgICAgICAgICBjb25zdCB0cmlwcyQkID0gYXdhaXQgY2xvdWQuY2FsbEZ1bmN0aW9uKHtcbiAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIF9pZDogdGlkXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICR1cmw6ICdkZXRhaWwnXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBuYW1lOiAndHJpcCdcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBjb25zdCB0cmlwcyQgPSB0cmlwcyQkLnJlc3VsdDsgICAgICAgIFxuICAgICAgICAgICAgaWYgKCB0cmlwcyQuc3RhdHVzICE9PSAyMDBcbiAgICAgICAgICAgICAgICAgICAgfHwgIXRyaXBzJC5kYXRhIFxuICAgICAgICAgICAgICAgICAgICB8fCAoICEhdHJpcHMkLmRhdGEgJiYgdHJpcHMkLmRhdGEuaXNDbG9zZWQgKSBcbiAgICAgICAgICAgICAgICAgICAgfHwgKCAhIXRyaXBzJC5kYXRhICYmIGdldE5vdyggdHJ1ZSApID49IHRyaXBzJC5kYXRhLmVuZF9kYXRlICkpIHtcbiAgICAgICAgICAgICAgICB0aHJvdyAn5pqC5peg6KGM56iL6K6h5YiS77yM5pqC5pe25LiN6IO96LSt5Lmw772eJ1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyDmnIDmlrDlj6/nlKjooYznqItcbiAgICAgICAgICAgIGNvbnN0IHRyaXAgPSB0cmlwcyQuZGF0YTtcblxuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiDmoLnmja7lnLDlnYDlr7nosaHvvIzmi7/liLDlnLDlnYBpZFxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICBsZXQgYWRkcmVzc2lkJCA9IHtcbiAgICAgICAgICAgICAgICByZXN1bHQ6IHtcbiAgICAgICAgICAgICAgICAgICAgZGF0YTogbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgc3RhdHVzOiA1MDBcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAvLyDorqLljZXmnaXmupDvvJrotK3nianovabjgIHns7vnu5/liqDljZVcbiAgICAgICAgICAgIGlmICggZXZlbnQuZGF0YS5mcm9tID09PSAnY2FydCcgfHwgZXZlbnQuZGF0YS5mcm9tID09PSAnc3lzdGVtJyB8fCBldmVudC5kYXRhLmZyb20gPT09ICdidXknICkge1xuICAgICAgICAgICAgICAgIGFkZHJlc3NpZCQgPSBhd2FpdCBjbG91ZC5jYWxsRnVuY3Rpb24oe1xuICAgICAgICAgICAgICAgICAgICBkYXRhOiB7IFxuICAgICAgICAgICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9wZW5JZDogb3BlbmlkLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFkZHJlc3M6IGV2ZW50LmRhdGEub3JkZXJzWyAwIF0uYWRkcmVzc1xuICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICR1cmw6ICdnZXRBZGRyZXNzSWQnXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIG5hbWU6ICdhZGRyZXNzJ1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgXG4gICAgICAgICAgICAvLyDorqLljZXmnaXmupDvvJrotK3nianovabjgIHns7vnu5/liqDljZVcbiAgICAgICAgICAgIGlmICgoIGV2ZW50LmRhdGEuZnJvbSA9PT0gJ2NhcnQnIHx8IGV2ZW50LmRhdGEuZnJvbSA9PT0gJ3N5c3RlbScgKSAmJiBhZGRyZXNzaWQkLnJlc3VsdC5zdGF0dXMgIT09IDIwMCApIHtcbiAgICAgICAgICAgICAgICB0aHJvdyAn5p+l6K+i5Zyw5Z2A6ZSZ6K+vJztcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8g5Y+v55So5Zyw5Z2AaWRcbiAgICAgICAgICAgIGNvbnN0IGFpZCA9IGFkZHJlc3NpZCQucmVzdWx0LmRhdGE7XG5cbiAgICAgICAgICAgIC8vIOaYr+WQpuaWsOWuouaIt1xuICAgICAgICAgICAgY29uc3QgaXNOZXckID0gYXdhaXQgY2xvdWQuY2FsbEZ1bmN0aW9uKHtcbiAgICAgICAgICAgICAgICBuYW1lOiAnY29tbW9uJyxcbiAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICAgICR1cmw6ICdpcy1uZXctY3VzdG9tZXInLFxuICAgICAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBvcGVuSWQ6IG9wZW5pZFxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSlcblxuICAgICAgICAgICAgY29uc3QgaXNOZXcgPSBpc05ldyQucmVzdWx0LmRhdGE7XG5cbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICog5paw5a6iICsg5paw5a6i6KaB6K6i6YeRID0gJzAnLFxuICAgICAgICAgICAgICog5paw5a6iICsg6KaB6K6i6YeRID0gJzAnLFxuICAgICAgICAgICAgICog5paw5a6iICsg5YWN6K6i6YeRID0gJzEnLFxuICAgICAgICAgICAgICog5pen5a6iICsg5pen5a6i5YWN6K6i6YeRID0gJzEnLFxuICAgICAgICAgICAgICog5pen5a6iICsg6KaB6K6i6YeRID0gJzAnLFxuICAgICAgICAgICAgICog5pen5a6iICsg5YWN6K6i6YeRID0gJzEnLFxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICBsZXQgcGF5X3N0YXR1cyA9ICcwJztcbiAgICAgICAgICAgIGNvbnN0IHAgPSB0cmlwLnBheW1lbnQ7XG5cbiAgICAgICAgICAgIGlmICggaXNOZXcgJiYgcCA9PT0gJzAnICkge1xuICAgICAgICAgICAgICAgIHBheV9zdGF0dXMgPSAnMCdcblxuICAgICAgICAgICAgfSBlbHNlIGlmICggaXNOZXcgJiYgcCA9PT0gJzEnICkge1xuICAgICAgICAgICAgICAgIHBheV9zdGF0dXMgPSAnMCdcblxuICAgICAgICAgICAgfSBlbHNlIGlmICggaXNOZXcgJiYgcCA9PT0gJzInICkge1xuICAgICAgICAgICAgICAgIHBheV9zdGF0dXMgPSAnMSdcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoICFpc05ldyAmJiBwID09PSAnMCcgKSB7XG4gICAgICAgICAgICAgICAgcGF5X3N0YXR1cyA9ICcxJ1xuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgfSBlbHNlIGlmICggIWlzTmV3ICYmIHAgPT09ICcxJyApIHtcbiAgICAgICAgICAgICAgICBwYXlfc3RhdHVzID0gJzAnXG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICB9IGVsc2UgaWYgKCAhaXNOZXcgJiYgcCA9PT0gJzInICkge1xuICAgICAgICAgICAgICAgIHBheV9zdGF0dXMgPSAnMSdcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcGF5X3N0YXR1cyA9ICcwJ1xuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyAz44CB5om56YeP5Yib5bu66K6i5Y2V77yM77yI6L+H5ruk5o6J5LiN6IO95Yib5bu66LSt54mp5riF5Y2V55qE5ZWG5ZOB77yJXG4gICAgICAgICAgICBjb25zdCB0ZW1wID0gZXZlbnQuZGF0YS5vcmRlcnMubWFwKCBtZXRhID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCB0ID0gT2JqZWN0LmFzc2lnbih7IH0sIG1ldGEsIHtcbiAgICAgICAgICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgICAgICAgICAqICEgZGVsaXZlcl9zdGF0dXPkuLrmnKrlj5HluIMg5Y+v6IO95pyJ6Zeu6aKYXG4gICAgICAgICAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgICAgICAgICBhaWQsXG4gICAgICAgICAgICAgICAgICAgIGlzT2NjdXBpZWQ6IHRydWUsIC8vIOWNoOmihuW6k+WtmOagh+W/l1xuICAgICAgICAgICAgICAgICAgICBvcGVuaWQ6IG9wZW5pZCxcbiAgICAgICAgICAgICAgICAgICAgZGVsaXZlcl9zdGF0dXM6ICcwJywgXG4gICAgICAgICAgICAgICAgICAgIGJhc2Vfc3RhdHVzOiAnMCcsXG4gICAgICAgICAgICAgICAgICAgIHBheV9zdGF0dXM6ICFtZXRhLmRlcG9zaXRQcmljZSA/ICcxJyA6IHBheV9zdGF0dXMgLCAvLyDllYblk4HorqLph5Hpop3luqbkuLowXG4gICAgICAgICAgICAgICAgICAgIGNyZWF0ZVRpbWU6IGdldE5vdyggdHJ1ZSApLFxuICAgICAgICAgICAgICAgICAgICB0eXBlOiAhIW1ldGEuZGVwb3NpdFByaWNlID8gbWV0YS50eXBlIDogJ25vcm1hbCdcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICBkZWxldGUgdFsnYWRkcmVzcyddO1xuXG4gICAgICAgICAgICAgICAgaWYgKCAhdFsnc2lkJ10gKSB7XG4gICAgICAgICAgICAgICAgICAgIGRlbGV0ZSB0WydzaWQnXTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gdDtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAvLyA044CB5om56YeP5Yib5bu66K6i5Y2VICgg5ZCM5pe25aSE55CG5Y2g6aKG6LSn5a2Y55qE6Zeu6aKYIClcbiAgICAgICAgICAgIGNvbnN0IHNhdmUkOiBhbnkgPSBhd2FpdCBQcm9taXNlLmFsbCggdGVtcC5tYXAoIG8gPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiBjcmVhdGUkKCBvcGVuaWQsIG8sIGRiLCBjdHggKTtcbiAgICAgICAgICAgIH0pKTtcbiAgICAgICAgXG4gICAgICAgICAgICBpZiAoIHNhdmUkLnNvbWUoIHggPT4geC5zdGF0dXMgIT09IDIwMCApKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgJ+WIm+W7uuiuouWNlemUmeivr++8gSdcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8g6L+U5Zue6K6i5Y2V5L+h5oGvXG4gICAgICAgICAgICBjb25zdCBvcmRlcl9yZXN1bHQgPSBzYXZlJC5tYXAoKCB4LCBrICkgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IHsgcHJpY2UsIGNvdW50LCBwYXlfc3RhdHVzLCBkZXBvc2l0UHJpY2UgfSA9IHRlbXBbIGsgXTtcbiAgICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgICAgICBvaWQ6IHguZGF0YS5faWQsXG4gICAgICAgICAgICAgICAgICAgIHByaWNlLFxuICAgICAgICAgICAgICAgICAgICBjb3VudCxcbiAgICAgICAgICAgICAgICAgICAgcGF5X3N0YXR1cyxcbiAgICAgICAgICAgICAgICAgICAgZGVwb3NpdFByaWNlXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHJldHVybiBjdHguYm9keSA9IHtcbiAgICAgICAgICAgICAgICBzdGF0dXM6IDIwMCxcbiAgICAgICAgICAgICAgICBkYXRhOiBvcmRlcl9yZXN1bHRcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgfSBjYXRjaCAoIGUgKSB7XG4gICAgIFxuICAgICAgICAgICAgcmV0dXJuIGN0eC5ib2R5ID0ge1xuICAgICAgICAgICAgICAgIHN0YXR1czogNTAwLFxuICAgICAgICAgICAgICAgIG1lc3NhZ2U6IGVcbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgIC8qKlxuICAgICAqIEBkZXNjcmlwdGlvblxuICAgICAqIOWuouaIt+err+afpeivolxuICAgICAqIFxuICAgICAqIOWIhumhtSArIHF1ZXJ5IOafpeivouiuouWNleWIl+ihqO+8iOacquiBmuWQiO+8iVxuICAgICAqIC0tLS0tIOivt+axgiAtLS0tLS1cbiAgICAgKiB7XG4gICAgICohICAgIHRpZDog6KGM56iLaWQg77yI5Y+v5peg77yJXG4gICAgICogICAgIG9wZW5pZDog77yI5Y+v5peg77yJXG4gICAgICogICAgIHBhZ2U6IG51bWJlclxuICAgICAqICAgICBza2lwOiBudW1iZXJcbiAgICAgKiAgICAgdHlwZTog5oiR55qE5YWo6YOoIHwg5pyq5LuY5qy+6K6i5Y2VIHwg5b6F5Y+R6LSnIHwg5bey5a6M5oiQIHwg566h55CG5ZGY77yI6KGM56iL6K6i5Y2V77yJfCDnrqHnkIblkZjvvIjmiYDmnInorqLljZXvvIlcbiAgICAgKiAgICAgdHlwZTogbXktYWxsIHwgbXktbm90cGF5IHwgbXktZGVsaXZlciB8IG15LWZpbmlzaCB8IG1hbmFnZXItdHJpcCB8IG1hbmFnZXItYWxsXG4gICAgICogICAgIHBhc3N1c2VkbGVzczogdHJ1ZSB8IGZhbHNlIHwgdW5kZWZpbmVkIOaYr+WQpui/h+a7pOaOiei/h+acn+eahOiuouWNlVxuICAgICAqIH1cbiAgICAgKiAhIOacquS7mOasvuiuouWNle+8mnBheV9zdGF0dXM6IOacquS7mOasvi/lt7Lku5jorqLph5Eg5oiWIHR5cGU6IHByZVxuICAgICAqICEg5b6F5Y+R6LSn77yaZGVsaXZlcl9zdGF0dXPvvJrmnKrlj5HotKcg5LiUIHBheV9zdGF0dXMg5bey5LuY5qy+XG4gICAgICogISDlt7LlrozmiJDvvJpkZWxpdmVyX3N0YXR1c++8muW3suWPkei0pyDkuJQgcGF5X3N0YXR1cyDlt7Lku5jlhajmrL5cbiAgICAgKi9cbiAgICBhcHAucm91dGVyKCdsaXN0JywgYXN5bmMoIGN0eCwgbmV4dCApID0+IHtcbiAgICAgICAgdHJ5IHtcblxuICAgICAgICAgICAgbGV0IHdoZXJlJCA9IHsgfTtcbiAgICAgICAgICAgIGNvbnN0IHsgdHlwZSwgdGlkLCBwYXNzdXNlZGxlc3MgfSA9IGV2ZW50LmRhdGE7XG5cbiAgICAgICAgICAgIC8vIOafpeivouadoeaVsFxuICAgICAgICAgICAgY29uc3QgbGltaXQgPSB0aWQgPyA5OSA6IDEwO1xuXG4gICAgICAgICAgICBjb25zdCBvcGVuaWQgPSBldmVudC5kYXRhLm9wZW5pZCB8fCBldmVudC51c2VySW5mby5vcGVuSWQ7XG5cblxuICAgICAgICAgICAgLy8g5oiR55qE5YWo6YOoXG4gICAgICAgICAgICBpZiAoIHR5cGUgPT09ICdteS1hbGwnICkge1xuICAgICAgICAgICAgICAgIHdoZXJlJCA9IHtcbiAgICAgICAgICAgICAgICAgICAgb3BlbmlkOiBvcGVuaWRcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIOacquS7mOasvlxuICAgICAgICAgICAgfSBlbHNlIGlmICggdHlwZSA9PT0gJ215LW5vdHBheScgKSB7XG4gICAgICAgICAgICAgICAgd2hlcmUkID0gXy5hbmQoe1xuICAgICAgICAgICAgICAgICAgICBvcGVuaWQsXG4gICAgICAgICAgICAgICAgICAgIGJhc2Vfc3RhdHVzOiAnMidcbiAgICAgICAgICAgICAgICB9LCBfLm9yKFtcbiAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogJ3ByZSdcbiAgICAgICAgICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICAgICAgICAgICAgcGF5X3N0YXR1czogXy5vciggXy5lcSgnMCcpLCBfLmVxKCcxJykpXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBdKSk7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIC8vIOacquWPkei0p1xuICAgICAgICAgICAgfSBlbHNlIGlmICggdHlwZSA9PT0gJ215LWRlbGl2ZScgKSB7XG4gICAgICAgICAgICAgICAgd2hlcmUkID0ge1xuICAgICAgICAgICAgICAgICAgICBvcGVuaWQsXG4gICAgICAgICAgICAgICAgICAgIHBheV9zdGF0dXM6ICcyJyxcbiAgICAgICAgICAgICAgICAgICAgZGVsaXZlcl9zdGF0dXM6ICcwJ1xuICAgICAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIC8vIOW3suWujOaIkFxuICAgICAgICAgICAgfSBlbHNlIGlmICggdHlwZSA9PT0gJ215LWZpbmlzaCcgKSB7XG4gICAgICAgICAgICAgICAgd2hlcmUkID0ge1xuICAgICAgICAgICAgICAgICAgICBvcGVuaWQsXG4gICAgICAgICAgICAgICAgICAgIHBheV9zdGF0dXM6ICcyJyxcbiAgICAgICAgICAgICAgICAgICAgZGVsaXZlcl9zdGF0dXM6ICcxJ1xuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIOi/h+a7pOaOiei/h+acn+iuouWNlVxuICAgICAgICAgICAgaWYgKCBwYXNzdXNlZGxlc3MgIT09IGZhbHNlICkge1xuICAgICAgICAgICAgICAgIHdoZXJlJCA9IE9iamVjdC5hc3NpZ24oeyB9LCB3aGVyZSQsIHtcbiAgICAgICAgICAgICAgICAgICAgYmFzZV9zdGF0dXM6IF8ubmVxKCc1JylcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8g6KGM56iL6K6i5Y2VXG4gICAgICAgICAgICBpZiAoIHRpZCApIHtcbiAgICAgICAgICAgICAgICB3aGVyZSQgPSBPYmplY3QuYXNzaWduKHsgfSwgd2hlcmUkLCB7XG4gICAgICAgICAgICAgICAgICAgIHRpZFxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyDojrflj5bmgLvmlbBcbiAgICAgICAgICAgIGNvbnN0IHRvdGFsJCA9IGF3YWl0IGRiLmNvbGxlY3Rpb24oJ29yZGVyJylcbiAgICAgICAgICAgICAgICAud2hlcmUoIHdoZXJlJCApXG4gICAgICAgICAgICAgICAgLmNvdW50KCApO1xuXG4gICAgICAgICAgICAvLyDojrflj5borqLljZXmlbDmja5cbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogISDlpoLmnpzmmK/mnInmjIflrpp0aWTnmoTvvIzliJnkuI3pnIDopoFsaW1pdOS6hu+8jOebtOaOpeaLieWPluihjOeoi+aJgOacieeahOiuouWNlVxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICBjb25zdCBkYXRhJCA9IGF3YWl0IGRiLmNvbGxlY3Rpb24oJ29yZGVyJylcbiAgICAgICAgICAgICAgICAud2hlcmUoIHdoZXJlJCApXG4gICAgICAgICAgICAgICAgLm9yZGVyQnkoJ2NyZWF0ZVRpbWUnLCAnZGVzYycpXG4gICAgICAgICAgICAgICAgLmxpbWl0KCBsaW1pdCApXG4gICAgICAgICAgICAgICAgLnNraXAoIGV2ZW50LmRhdGEuc2tpcCB8fCAoIGV2ZW50LmRhdGEucGFnZSAtIDEgKSAqIGxpbWl0IClcbiAgICAgICAgICAgICAgICAuZ2V0KCApO1xuXG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqICEg55Sx5LqO5p+l6K+i5piv5oyJ5YiG6aG177yM5L2G5piv5pi+56S65piv5oyJ6KGM56iL5p2l6IGa5ZCI5pi+56S6XG4gICAgICAgICAgICAgKiAhIOWboOatpOacieWPr+iDve+8jE7pobXmnIDlkI7kuIDkvY3vvIzot59OKzHpobXnrKzkuIDkvY3kvp3nhLblsZ7kuo7lkIzkuIDooYznqItcbiAgICAgICAgICAgICAqICEg5aaC5LiN6L+b6KGM5aSE55CG77yM5a6i5oi35p+l6K+i6K6i5Y2V5YiX6KGo5pi+56S66KGM56iL6K6i5Y2V5pe277yM5Lya4oCc5pyJ5Y+v6IO94oCd5pi+56S65LiN5YWoXG4gICAgICAgICAgICAgKiAhIOeJueauiuWkhOeQhu+8mueUqOacgOWQjuS4gOS9jeeahHRpZO+8jOafpeivouacgOWQjuS4gOS9jeS7peWQjuWQjHRpZOeahG9yZGVy77yM54S25ZCO5L+u5q2j5omA6L+U5Zue55qEcGFnZVxuICAgICAgICAgICAgICovXG5cbiAgICAgICAgICAgIGNvbnN0IGxhc3QgPSBkYXRhJC5kYXRhWyBkYXRhJC5kYXRhLmxlbmd0aCAtIDEgXTtcblxuICAgICAgICAgICAgbGV0IGZpeCQ6IGFueSA9IHtcbiAgICAgICAgICAgICAgICBkYXRhOiBbIF1cbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIC8vIOWmguaenOayoeaciXRpZOWPguaVsO+8jOaJjeWOu+WBmmZpeOeahOWKqOS9nFxuICAgICAgICAgICAgaWYgKCBsYXN0ICYmICF0aWQgKSB7IFxuICAgICAgICAgICAgICAgIGZpeCQgPSBhd2FpdCBkYi5jb2xsZWN0aW9uKCdvcmRlcicpXG4gICAgICAgICAgICAgICAgICAgIC53aGVyZSh7XG4gICAgICAgICAgICAgICAgICAgICAgICBvcGVuaWQsXG4gICAgICAgICAgICAgICAgICAgICAgICB0aWQ6IGxhc3QudGlkLFxuICAgICAgICAgICAgICAgICAgICAgICAgYmFzZV9zdGF0dXM6IF8ubmVxKCc1JylcbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgLm9yZGVyQnkoJ2NyZWF0ZVRpbWUnLCAnZGVzYycpXG4gICAgICAgICAgICAgICAgICAgIC5za2lwKCBldmVudC5kYXRhLnNraXAgPyBldmVudC5kYXRhLnNraXAgKyBkYXRhJC5kYXRhLmxlbmd0aCA6ICggZXZlbnQuZGF0YS5wYWdlIC0gMSApICogbGltaXQgKyBkYXRhJC5kYXRhLmxlbmd0aCApXG4gICAgICAgICAgICAgICAgICAgIC5nZXQoICk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGNvbnN0IG1ldGEgPSBbIC4uLmRhdGEkLmRhdGEsIC4uLmZpeCQuZGF0YSBdO1xuXG4gICAgICAgICAgICAvLyDov5nph4znmoTooYznqIvor6bmg4XnlKggbmV3IFNldOeahOaWueW8j+afpeivolxuICAgICAgICAgICAgY29uc3QgdHJpcElkcyA9IEFycmF5LmZyb20oXG4gICAgICAgICAgICAgICAgbmV3IFNldCggbWV0YS5tYXAoIG0gPT4gbS50aWQgKSlcbiAgICAgICAgICAgICk7XG5cbiAgICAgICAgICAgIGNvbnN0IHRyaXBzJCA9IGF3YWl0IFByb21pc2UuYWxsKCB0cmlwSWRzLm1hcCggdGlkID0+IHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZGIuY29sbGVjdGlvbigndHJpcCcpXG4gICAgICAgICAgICAgICAgICAgIC53aGVyZSh7XG4gICAgICAgICAgICAgICAgICAgICAgICBfaWQ6IHRpZFxuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAuZ2V0KCApO1xuICAgICAgICAgICAgfSkpO1xuICAgICBcbiAgICAgICAgICAgIC8vIOiBmuWQiOihjOeoi+aVsOaNrlxuICAgICAgICAgICAgY29uc3QgbWV0YTIgPSBtZXRhLm1hcCgoIHgsIGkgKSA9PiBPYmplY3QuYXNzaWduKHsgfSwgeCwge1xuICAgICAgICAgICAgICAgIC8vIHRyaXA6IHRyaXBzJFsgaSBdLmRhdGFbIDAgXVxuICAgICAgICAgICAgICAgIHRyaXA6ICh0cmlwcyQuZmluZCggeSA9PiB5LmRhdGFbIDAgXS5faWQgPT09IHgudGlkICkgYXMgYW55KS5kYXRhWyAwIF1cbiAgICAgICAgICAgIH0pKTtcblxuICAgICAgICAgICAgcmV0dXJuIGN0eC5ib2R5ID0ge1xuICAgICAgICAgICAgICAgIHN0YXR1czogMjAwLFxuICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgZGF0YTogbWV0YTIsXG4gICAgICAgICAgICAgICAgICAgIHBhZ2VTaXplOiBsaW1pdCxcbiAgICAgICAgICAgICAgICAgICAgdG90YWw6IHRvdGFsJC50b3RhbCxcbiAgICAgICAgICAgICAgICAgICAgcGFnZTogZml4JC5kYXRhLmxlbmd0aCA9PT0gMCA/IGV2ZW50LmRhdGEucGFnZSA6IGV2ZW50LmRhdGEucGFnZSArIE1hdGguY2VpbCggZml4JC5kYXRhLmxlbmd0aCAvIGxpbWl0ICksXG4gICAgICAgICAgICAgICAgICAgIGN1cnJlbnQ6IGV2ZW50LmRhdGEuc2tpcCA/IGV2ZW50LmRhdGEuc2tpcCArIG1ldGEubGVuZ3RoIDogKCBldmVudC5kYXRhLnBhZ2UgLSAxICkgKiBsaW1pdCArIG1ldGEubGVuZ3RoLFxuICAgICAgICAgICAgICAgICAgICB0b3RhbFBhZ2U6IE1hdGguY2VpbCggdG90YWwkLnRvdGFsIC8gbGltaXQgKVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIFxuICAgICAgICB9IGNhdGNoICggZSApIHsgcmV0dXJuIGN0eC5ib2R5ID0geyBzdGF0dXM6IDUwMH07fVxuICAgIH0pXG5cbiAgICAvKipcbiAgICAgKiDmibnph4/mm7TmlrDvvIzorqLljZXkuLrlt7LmlK/ku5jvvIzlubbkuJTlop7liqDliLDotK3nianmuIXljZVcbiAgICAgKiDlubbmjqjpgIHnm7jlhbPkubDlrrZcbiAgICAgKiDlubbmjqjpgIHnm7jlhbPigJzmjqjlub/ogIXigJ1cbiAgICAgKiB7XG4gICAgICogICAgICBvcmRlcklkczogXCIxMjMsMjM0LDM0NVwiXG4gICAgICogICAgICBmb3JtX2lkLFxuICAgICAqICAgICAgcHJlcGF5X2lkXG4gICAgICogfVxuICAgICAqL1xuICAgIGFwcC5yb3V0ZXIoJ3VwYWR0ZS10by1wYXllZCcsIGFzeW5jKCBjdHgsIG5leHQgKSA9PiB7XG4gICAgICAgIHRyeSB7XG5cbiAgICAgICAgICAgIGNvbnN0IG9wZW5JZCA9IGV2ZW50LnVzZXJJbmZvLm9wZW5JZDtcbiAgICAgICAgICAgIGNvbnN0IHsgb3JkZXJJZHMsIHByZXBheV9pZCwgZm9ybV9pZCB9ID0gZXZlbnQuZGF0YTtcblxuICAgICAgICAgICAgLy8g5pu05paw6K6i5Y2V5a2X5q61XG4gICAgICAgICAgICBhd2FpdCBQcm9taXNlLmFsbCggb3JkZXJJZHMuc3BsaXQoJywnKS5tYXAoIG9pZCA9PiB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGRiLmNvbGxlY3Rpb24oJ29yZGVyJykuZG9jKCBvaWQgKVxuICAgICAgICAgICAgICAgICAgICAudXBkYXRlKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb3JtX2lkLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHByZXBheV9pZCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXlfc3RhdHVzOiAnMSdcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9KSk7XG5cbiAgICAgICAgICAgIC8vIOWIm+W7ui/mj5LlhaXliLDotK3nianmuIXljZVcbiAgICAgICAgICAgIGNvbnN0IGZpbmQkOiBhbnkgPSBhd2FpdCBQcm9taXNlLmFsbCggb3JkZXJJZHMuc3BsaXQoJywnKS5tYXAoIG9pZCA9PiB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGRiLmNvbGxlY3Rpb24oJ29yZGVyJylcbiAgICAgICAgICAgICAgICAgICAgLndoZXJlKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIF9pZDogb2lkXG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgIC5nZXQoICk7XG4gICAgICAgICAgICB9KSk7XG5cbiAgICAgICAgICAgIC8vIOiuouWNleWIl+ihqFxuICAgICAgICAgICAgY29uc3QgbGlzdCA9IGZpbmQkLm1hcCggeCA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3QgeyBfaWQsIHRpZCwgcGlkLCBzaWQsIHByaWNlLCBncm91cFByaWNlLCBhY2lkIH0gPSB4LmRhdGFbIDAgXTtcbiAgICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgICAgICBvaWQ6IF9pZCxcbiAgICAgICAgICAgICAgICAgICAgYWNpZCwgZ3JvdXBQcmljZSxcbiAgICAgICAgICAgICAgICAgICAgdGlkLCBwaWQsIHNpZCwgcHJpY2VcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgY29uc3QgY3JlYXRlJCA9IGF3YWl0IGNsb3VkLmNhbGxGdW5jdGlvbih7XG4gICAgICAgICAgICAgICAgbmFtZTogJ3Nob3BwaW5nLWxpc3QnLFxuICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgJHVybDogJ2NyZWF0ZScsXG4gICAgICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxpc3QsXG4gICAgICAgICAgICAgICAgICAgICAgICBvcGVuSWRcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAvLyDlpITnkIbotK3kubDnm7jlhbPnmoTmjqjpgIFcbiAgICAgICAgICAgIGlmICggY3JlYXRlJC5yZXN1bHQuc3RhdHVzID09PSAyMDAgKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgeyBidXllciwgb3RoZXJzIH0gPSBjcmVhdGUkLnJlc3VsdC5kYXRhO1xuXG4gICAgICAgICAgICAgICAgLy8g5Lmw5a625o6o6YCBXG4gICAgICAgICAgICAgICAgY29uc3QgcHVzaE1lJCA9IGF3YWl0IGNsb3VkLmNhbGxGdW5jdGlvbih7XG4gICAgICAgICAgICAgICAgICAgIG5hbWU6ICdjb21tb24nLFxuICAgICAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAkdXJsOiAncHVzaC1zdWJzY3JpYmUnLFxuICAgICAgICAgICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6IGJ1eWVyLnR5cGUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb3BlbmlkOiBidXllci5vcGVuaWQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGV4dHM6IGdldFRleHRCeVB1c2hUeXBlKCBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnV5ZXIudHlwZSA9PT0gJ2J1eVBpbicgPyAnYnV5UGluMScgOiBidXllci50eXBlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBidXllci5kZWx0YSApXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgIC8vIOWFtuS7luS6uuaLvOWbouaIkOWKn+eahOaOqOmAgVxuICAgICAgICAgICAgICAgIGNvbnN0IG90aGVyc09yZGVycyQ6IGFueSA9IGF3YWl0IFByb21pc2UuYWxsKFxuICAgICAgICAgICAgICAgICAgICBvdGhlcnMubWFwKCBcbiAgICAgICAgICAgICAgICAgICAgICAgIG90aGVyID0+IGRiLmNvbGxlY3Rpb24oJ29yZGVyJylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAud2hlcmUoe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvcGVuaWQ6IG90aGVyLm9wZW5pZCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYWNpZDogb3RoZXIuYWNpZCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2lkOiBvdGhlci5zaWQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBpZDogb3RoZXIucGlkLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aWQ6IG90aGVyLnRpZCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGF5X3N0YXR1czogJzEnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBiYXNlX3N0YXR1czogXy5vciggXy5lcSgnMCcpLCBfLmVxKCcxJyksIF8uZXEoJzInKSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5maWVsZCh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvdW50OiB0cnVlXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAuZ2V0KCApXG4gICAgICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgICApO1xuXG4gICAgICAgICAgICAgICAgLy8g5pW05ZCIZGVsdGEgKyBjb3VudFxuICAgICAgICAgICAgICAgIGNvbnN0IG90aGVyc01vcmUgPSBvdGhlcnMubWFwKCggb3RoZXIsIGtleSApID0+IHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC4uLm90aGVyLFxuICAgICAgICAgICAgICAgICAgICAgICAgY291bnQ6IG90aGVyc09yZGVycyRbIGtleSBdLmRhdGEucmVkdWNlKCggeCwgeSApID0+IHkuY291bnQgKyB4LCAwIClcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgbGV0IG90aGVyc1B1c2ggPSB7IH07XG5cbiAgICAgICAgICAgICAgICBvdGhlcnNNb3JlLm1hcCggb3RoZXIgPT4ge1xuICAgICAgICAgICAgICAgICAgICBpZiAoICFvdGhlcnNQdXNoWyBvdGhlci5vcGVuaWQgXSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgb3RoZXJzUHVzaCA9IE9iamVjdC5hc3NpZ24oeyB9LCBvdGhlcnNQdXNoLCB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgWyBvdGhlci5vcGVuaWQgXTogb3RoZXIuZGVsdGEgKiBvdGhlci5jb3VudFxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBvdGhlcnNQdXNoID0gT2JqZWN0LmFzc2lnbih7IH0sIG90aGVyc1B1c2gsIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBbIG90aGVyLm9wZW5pZCBdOiBvdGhlcnNQdXNoWyBvdGhlci5vcGVuaWQgXSArIG90aGVyLmRlbHRhICogb3RoZXIuY291bnRcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICAvLyDlhbbku5bkurrmi7zlm6LmiJDlip/nmoTmjqjpgIFcbiAgICAgICAgICAgICAgICBhd2FpdCBQcm9taXNlLmFsbChcbiAgICAgICAgICAgICAgICAgICAgT2JqZWN0LmtleXMoIG90aGVyc1B1c2ggKS5tYXAoXG4gICAgICAgICAgICAgICAgICAgICAgICBvdGhlck9wZW5pZCA9PiBjbG91ZC5jYWxsRnVuY3Rpb24oe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6ICdjb21tb24nLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJHVybDogJ3B1c2gtc3Vic2NyaWJlJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogJ2J1eVBpbicsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvcGVuaWQ6IG90aGVyT3BlbmlkLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGV4dHM6IGdldFRleHRCeVB1c2hUeXBlKCAnYnV5UGluMicsIG90aGVyc1B1c2hbIG90aGVyT3BlbmlkIF0pXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgICAgKTtcblxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyDmn6XnnIthcHAtY29uZmln56ev5YiG5o6o5bm/5piv5ZCm5byA5ZCvXG4gICAgICAgICAgICBjb25zdCBhcHBDb25mJCA9IGF3YWl0IGRiLmNvbGxlY3Rpb24oJ2FwcC1jb25maWcnKVxuICAgICAgICAgICAgICAgIC53aGVyZSh7XG4gICAgICAgICAgICAgICAgICAgIHR5cGU6ICdnb29kLWludGVncmFsLXNoYXJlJ1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLmdldCggKTtcbiAgICAgICAgICAgIGNvbnN0IGFwcENvbmYgPSBhcHBDb25mJC5kYXRhWyAwIF07XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGlmICggISFhcHBDb25mLnZhbHVlICkge1xuICAgICAgICAgICAgICAgIC8vIOaJvuWHuuaJgOacieeahOaOqOW5v+iusOW9lVxuICAgICAgICAgICAgICAgIGNvbnN0IHB1c2hlcnMkOiBhbnkgPSBhd2FpdCBQcm9taXNlLmFsbChcbiAgICAgICAgICAgICAgICAgICAgbGlzdC5tYXAoIGFzeW5jKCB4LCBrICkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgcHVzaFJlY29yZCQgPSBhd2FpdCBkYi5jb2xsZWN0aW9uKCdzaGFyZS1yZWNvcmQnKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC53aGVyZSh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBpZDogeC5waWQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9wZW5pZDogb3BlbklkLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpc1N1Y2Nlc3M6IGZhbHNlXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAuZ2V0KCApO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAuLi5wdXNoUmVjb3JkJC5kYXRhWyAwIF0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJpY2U6IGxpc3RbIGsgXS5wcmljZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwdXNoSWQ6IHB1c2hSZWNvcmQkLmRhdGFbIDAgXSA/IHB1c2hSZWNvcmQkLmRhdGFbIDAgXS5faWQgOiAnJ1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICk7XG5cbiAgICAgICAgICAgICAgICAvLyDmib7lh7rmiYDmnInnmoTmjqjlub/ogIVcbiAgICAgICAgICAgICAgICBjb25zdCBwdXNoZXJzOiBhbnkgPSBbIF07XG4gICAgICAgICAgICAgICAgcHVzaGVycyRcbiAgICAgICAgICAgICAgICAgICAgLmZpbHRlciggeCA9PiAhIXguZnJvbSApXG4gICAgICAgICAgICAgICAgICAgIC5tYXAoIHggPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgaW5kZXggPSBwdXNoZXJzLmZpbmRJbmRleCggeSA9PiB5LmZyb20gPT09IHguZnJvbSApO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCBpbmRleCAhPT0gLTEgKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3Qgb3JpZ2luID0gcHVzaGVyc1sgaW5kZXggXTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwdXNoZXJzLnNwbGljZSggaW5kZXgsIDEsIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLi4ub3JpZ2luLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcmljZTogTnVtYmVyKCggeC5wcmljZSArIG9yaWdpbi5wcmljZSApLnRvRml4ZWQoIDIgKSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcHVzaGVycy5wdXNoKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZnJvbTogeC5mcm9tLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcmljZTogeC5wcmljZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcHVzaElkOiB4LnB1c2hJZFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgY29uc3QgYXBwQ29uZjIkID0gYXdhaXQgZGIuY29sbGVjdGlvbignYXBwLWNvbmZpZycpXG4gICAgICAgICAgICAgICAgICAgIC53aGVyZSh7XG4gICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiAncHVzaC1pbnRlZ3JhbC1nZXQtcmF0ZSdcbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgLmdldCggKTtcbiAgICAgICAgICAgICAgICBjb25zdCBhcHBDb25mMiA9IGFwcENvbmYyJC5kYXRhWyAwIF07XG4gICAgICAgICAgICAgICAgY29uc3QgaW50ZWdyYWxSYXRlID0gYXBwQ29uZjIudmFsdWUgfHwgMC4wNTtcblxuICAgICAgICAgICAgICAgIGF3YWl0IFByb21pc2UuYWxsKFxuICAgICAgICAgICAgICAgICAgICBwdXNoZXJzLm1hcCggYXN5bmMgcHVzaGVyID0+IHtcblxuICAgICAgICAgICAgICAgICAgICAgICAgLy8g5o6o5bm/56ev5YiG5q+U5L6LIDUlXG4gICAgICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGludGVncmFsID0gTnVtYmVyKCggcHVzaGVyLnByaWNlICogaW50ZWdyYWxSYXRlICkudG9GaXhlZCggMSApKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgLy8g6K6w5b2V5o6o5bm/6ICF56ev5YiGXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCB1c2VyJCA9IGF3YWl0IGRiLmNvbGxlY3Rpb24oJ3VzZXInKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC53aGVyZSh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9wZW5pZDogcHVzaGVyLmZyb21cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5nZXQoICk7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCB1c2VyID0gdXNlciQuZGF0YVsgMCBdO1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgdXNlcmlkID0gdXNlci5faWQ7XG4gICAgICAgICAgICAgICAgICAgICAgICBkZWxldGUgdXNlclsnX2lkJ107XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGF3YWl0IGRiLmNvbGxlY3Rpb24oJ3VzZXInKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5kb2MoIFN0cmluZyggdXNlcmlkICkpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLnNldCh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC4uLnVzZXIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwdXNoX2ludGVncmFsOiB1c2VyLnB1c2hfaW50ZWdyYWwgPyBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBOdW1iZXIoKHVzZXIucHVzaF9pbnRlZ3JhbCArIGludGVncmFsKS50b0ZpeGVkKCAxICkpIDogXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaW50ZWdyYWxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyDlpITnkIbmjqjlub/ogIXnm7jlhbPnmoTmjqjpgIFcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHB1c2gkID0gYXdhaXQgY2xvdWQuY2FsbEZ1bmN0aW9uKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiAnY29tbW9uJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICR1cmw6ICdwdXNoLXN1YnNjcmliZScsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6ICdob25nYmFvJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9wZW5pZDogcHVzaGVyLmZyb20sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyDnp6/liIbpobXpnaJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhZ2U6ICdwYWdlcy9ncm91bmQtcHVzaC1pbnRlZ3JhbC9pbmRleCcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZXh0czogW2Dmga3llpzvvIHkvaDojrflvpcke2ludGVncmFsfeWFg+aKteeOsOmHke+8gWAsYOacieaci+WPi+i0reS5sOS6huS9oOaOqOW5v+WIhuS6q+eahOWVhuWTge+9nmBdXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgLy8g5pu05paw5o6o5bm/54q25oCBXG4gICAgICAgICAgICAgICAgICAgICAgICBhd2FpdCBkYi5jb2xsZWN0aW9uKCdzaGFyZS1yZWNvcmQnKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5kb2MoIHB1c2hlci5wdXNoSWQgKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC51cGRhdGUoe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpc1N1Y2Nlc3M6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdWNjZXNzVGltZTogZ2V0Tm93KCB0cnVlIClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIGN0eC5ib2R5ID0ge1xuICAgICAgICAgICAgICAgIHN0YXR1czogMjAwXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfSBjYXRjaCAoIGUgKSB7IFxuICAgICAgICAgICAgY29uc29sZS5sb2coIGUgKTtcbiAgICAgICAgICAgIHJldHVybiBjdHguYm9keSA9IHsgc3RhdHVzOiA1MDAgfTtcbiAgICAgICAgfSBcbiAgICB9KVxuXG4gICAgLyoqIFxuICAgICAqIEBkZXNjcmlwdGlvblxuICAgICAqIOS7o+i0rea4heW4kOWCrOasvueahOiuouWNleWIl+ihqFxuICAgICAqIHtcbiAgICAgKiAgICAgdGlkIFxuICAgICAqICAgICBuZWVkQ291cG9uczogZmFsc2UgfCB0cnVlIHwgdW5kZWZpbmVkXG4gICAgICogICAgIG5lZWRBZGRyZXNzOiBmYWxzZSB8IHRydWUgfCB1bmRlZmluZWRcbiAgICAgKiB9XG4gICAgICovXG4gICAgYXBwLnJvdXRlcignZGFpZ291LWxpc3QnLCBhc3luYyggY3R4LCBuZXh0ICkgPT4ge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgY29uc3QgeyB0aWQsIG5lZWRDb3Vwb25zLCBuZWVkQWRkcmVzcyB9ID0gZXZlbnQuZGF0YTtcblxuICAgICAgICAgICAgLy8g6YeH6LSt5riF5Y2VXG4gICAgICAgICAgICBjb25zdCBzaG9wcGluZ2xpc3QkID0gYXdhaXQgZGIuY29sbGVjdGlvbignc2hvcHBpbmctbGlzdCcpXG4gICAgICAgICAgICAgICAgLndoZXJlKHtcbiAgICAgICAgICAgICAgICAgICAgdGlkXG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAuZ2V0KCApO1xuICAgICAgICAgICAgY29uc3Qgc2hvcHBpbmdsaXN0ID0gc2hvcHBpbmdsaXN0JC5kYXRhO1xuXG4gICAgICAgICAgICAvLyDorqLljZXkv6Hmga9cbiAgICAgICAgICAgIGNvbnN0IG9yZGVycyQgPSBhd2FpdCBkYi5jb2xsZWN0aW9uKCdvcmRlcicpXG4gICAgICAgICAgICAgICAgLndoZXJlKHtcbiAgICAgICAgICAgICAgICAgICAgdGlkLFxuICAgICAgICAgICAgICAgICAgICBiYXNlX3N0YXR1czogXy5uZXEoJzUnKSxcbiAgICAgICAgICAgICAgICAgICAgcGF5X3N0YXR1czogXy5vciggXy5lcSgnMScpLCBfLmVxKCcyJykpXG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAuZ2V0KCApO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICAvLyDnlKjmiLfkv6Hmga9cbiAgICAgICAgICAgIGNvbnN0IHVzZXJzJCA9IGF3YWl0IFByb21pc2UuYWxsKFxuICAgICAgICAgICAgICAgIEFycmF5LmZyb20oIFxuICAgICAgICAgICAgICAgICAgICBuZXcgU2V0KCBvcmRlcnMkLmRhdGFcbiAgICAgICAgICAgICAgICAgICAgICAgIC5tYXAoIHggPT4geC5vcGVuaWQgKVxuICAgICAgICAgICAgICAgICkpXG4gICAgICAgICAgICAgICAgLm1hcCggdWlkID0+IGRiLmNvbGxlY3Rpb24oJ3VzZXInKVxuICAgICAgICAgICAgICAgICAgICAud2hlcmUoe1xuICAgICAgICAgICAgICAgICAgICAgICAgb3BlbmlkOiB1aWRcbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgLmdldCggKSlcbiAgICAgICAgICAgICk7XG5cbiAgICAgICAgICAgIC8vIOW/q+mAkui0ueeUqOS/oeaBr1xuICAgICAgICAgICAgY29uc3QgZGVsaXZlcmZlZXMkID0gYXdhaXQgUHJvbWlzZS5hbGwoXG4gICAgICAgICAgICAgICAgQXJyYXkuZnJvbSggXG4gICAgICAgICAgICAgICAgICAgIG5ldyBTZXQoIG9yZGVycyQuZGF0YVxuICAgICAgICAgICAgICAgICAgICAgICAgLm1hcCggeCA9PiB4Lm9wZW5pZCApXG4gICAgICAgICAgICAgICAgKSlcbiAgICAgICAgICAgICAgICAubWFwKCB1aWQgPT4gZGIuY29sbGVjdGlvbignZGVsaXZlci1mZWUnKVxuICAgICAgICAgICAgICAgICAgICAud2hlcmUoe1xuICAgICAgICAgICAgICAgICAgICAgICAgdGlkLFxuICAgICAgICAgICAgICAgICAgICAgICAgb3BlbmlkOiB1aWRcbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgLmdldCggKSlcbiAgICAgICAgICAgICk7XG5cbiAgICAgICAgICAgIC8vIOenr+WIhuaOqOW5v+S9v+eUqOaDheWGtVxuICAgICAgICAgICAgY29uc3QgcHVzaEludGVncmFsJCA9IGF3YWl0IFByb21pc2UuYWxsKFxuICAgICAgICAgICAgICAgIEFycmF5LmZyb20oIFxuICAgICAgICAgICAgICAgICAgICBuZXcgU2V0KCBvcmRlcnMkLmRhdGFcbiAgICAgICAgICAgICAgICAgICAgICAgIC5tYXAoIHggPT4geC5vcGVuaWQgKVxuICAgICAgICAgICAgICAgICkpXG4gICAgICAgICAgICAgICAgLm1hcCggdWlkID0+IGRiLmNvbGxlY3Rpb24oJ2ludGVncmFsLXVzZS1yZWNvcmQnKVxuICAgICAgICAgICAgICAgICAgICAud2hlcmUoe1xuICAgICAgICAgICAgICAgICAgICAgICAgdGlkLFxuICAgICAgICAgICAgICAgICAgICAgICAgb3BlbmlkOiB1aWQsXG4gICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiAncHVzaF9pbnRlZ3JhbCdcbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgLmdldCggKSlcbiAgICAgICAgICAgICk7XG5cbiAgICAgICAgICAgIC8vIOWcsOWdgOS/oeaBr1xuICAgICAgICAgICAgbGV0IGFkZHJlc3MkOiBhbnkgPSBbIF07XG4gICAgICAgICAgICBpZiAoICEhbmVlZEFkZHJlc3MgfHwgbmVlZEFkZHJlc3MgPT09IHVuZGVmaW5lZCApIHtcbiAgICAgICAgICAgICAgICBhZGRyZXNzJCA9IGF3YWl0IFByb21pc2UuYWxsKFxuICAgICAgICAgICAgICAgICAgICBBcnJheS5mcm9tKFxuICAgICAgICAgICAgICAgICAgICAgICAgbmV3IFNldCggb3JkZXJzJC5kYXRhXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLm1hcCggeCA9PiB4LmFpZCApXG4gICAgICAgICAgICAgICAgICAgICkpXG4gICAgICAgICAgICAgICAgICAgIC5tYXAoIGFpZCA9PiBkYi5jb2xsZWN0aW9uKCdhZGRyZXNzJylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLmRvYyggYWlkIClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLmdldCggKSlcbiAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgXG4gICAgICAgICAgICAvLyDljaHliLjkv6Hmga9cbiAgICAgICAgICAgIGxldCBjb3Vwb25zJDogYW55ID0gWyBdO1xuICAgICAgICAgICAgaWYgKCAhIW5lZWRDb3Vwb25zIHx8IG5lZWRDb3Vwb25zID09PSB1bmRlZmluZWQgKSB7XG4gICAgICAgICAgICAgICAgY291cG9ucyQgPSBhd2FpdCBQcm9taXNlLmFsbChcbiAgICAgICAgICAgICAgICAgICAgQXJyYXkuZnJvbShcbiAgICAgICAgICAgICAgICAgICAgICAgIG5ldyBTZXQoIG9yZGVycyQuZGF0YSBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAubWFwKCB4ID0+IHgub3BlbmlkIClcbiAgICAgICAgICAgICAgICAgICAgKSlcbiAgICAgICAgICAgICAgICAgICAgLm1hcCggb3BlbmlkID0+IGRiLmNvbGxlY3Rpb24oJ2NvdXBvbicpXG4gICAgICAgICAgICAgICAgICAgICAgICAud2hlcmUoIF8ub3IoW1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGlkLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvcGVuaWQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6IF8ub3IoIF8uZXEoJ3RfbWFuamlhbicpLCBfLmVxKCd0X2xpamlhbicpKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb3BlbmlkLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpc1VzZWQ6IGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYW5Vc2VJbk5leHQ6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6ICd0X2RhaWppbidcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBdKSlcbiAgICAgICAgICAgICAgICAgICAgICAgIC5nZXQoIClcbiAgICAgICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGNvbnN0IHVzZXJPZGVycyA9IHVzZXJzJC5tYXAoKCB1c2VyJCwgayApID0+IHtcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICBjb25zdCB1c2VyID0gdXNlciQuZGF0YVsgMCBdO1xuXG4gICAgICAgICAgICAgICAgY29uc3Qgb3JkZXJzID0gb3JkZXJzJC5kYXRhXG4gICAgICAgICAgICAgICAgICAgIC5maWx0ZXIoIHggPT4geC5vcGVuaWQgPT09IHVzZXIub3BlbmlkIClcbiAgICAgICAgICAgICAgICAgICAgLm1hcCggeCA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBzbCA9IHNob3BwaW5nbGlzdC5maW5kKCB5ID0+IHkucGlkID09PSB4LnBpZCAmJiB5LnNpZCA9PT0geC5zaWQgKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLi4ueCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYW5Hcm91cDogc2whLnVpZHMubGVuZ3RoID4gMVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgIGNvbnN0IGFkZHJlc3MgPSBhZGRyZXNzJC5sZW5ndGggPiAwID9cbiAgICAgICAgICAgICAgICAgICAgYWRkcmVzcyRcbiAgICAgICAgICAgICAgICAgICAgICAgIC5tYXAoIHggPT4geC5kYXRhIClcbiAgICAgICAgICAgICAgICAgICAgICAgIC5maWx0ZXIoIHggPT4geC5vcGVuaWQgPT09IHVzZXIub3BlbmlkICkgOlxuICAgICAgICAgICAgICAgICAgICB1bmRlZmluZWQ7XG5cbiAgICAgICAgICAgICAgICBjb25zdCBjb3Vwb25zID0gY291cG9ucyQubGVuZ3RoID4gMCA/XG4gICAgICAgICAgICAgICAgICAgIGNvdXBvbnMkXG4gICAgICAgICAgICAgICAgICAgICAgICAubWFwKCB4ID0+IHguZGF0YSApXG4gICAgICAgICAgICAgICAgICAgICAgICAuZmlsdGVyKCB4ID0+IHgubGVuZ3RoID4gMCAmJiB4WyAwIF0ub3BlbmlkID09PSB1c2VyLm9wZW5pZCApIDpcbiAgICAgICAgICAgICAgICAgICAgdW5kZWZpbmVkO1xuXG4gICAgICAgICAgICAgICAgY29uc3QgZGVsaXZlckZlZSA9IGRlbGl2ZXJmZWVzJFsgayBdLmRhdGFbIDAgXSB8fCAwO1xuXG4gICAgICAgICAgICAgICAgY29uc3QgcHVzaEludGVncmFsID0gKHB1c2hJbnRlZ3JhbCRbIGsgXS5kYXRhWyAwIF0gfHwgeyB9KS52YWx1ZSB8fCAwO1xuXG4gICAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICAgICAgdXNlcixcbiAgICAgICAgICAgICAgICAgICAgb3JkZXJzLFxuICAgICAgICAgICAgICAgICAgICBhZGRyZXNzLFxuICAgICAgICAgICAgICAgICAgICBkZWxpdmVyRmVlLFxuICAgICAgICAgICAgICAgICAgICBwdXNoSW50ZWdyYWwsXG4gICAgICAgICAgICAgICAgICAgIGNvdXBvbnM6ICghIWNvdXBvbnMgJiYgY291cG9ucy5sZW5ndGggPiAwICkgPyBjb3Vwb25zWyAwIF0gOiBbIF1cbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHJldHVybiBjdHguYm9keSA9IHtcbiAgICAgICAgICAgICAgICBzdGF0dXM6IDIwMCxcbiAgICAgICAgICAgICAgICBkYXRhOiB1c2VyT2RlcnNcbiAgICAgICAgICAgIH1cblxuICAgICAgICB9IGNhdGNoICggZSApIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCAnLi4uJywgZSApO1xuICAgICAgICAgICAgcmV0dXJuIGN0eC5ib2R5ID0geyBzdGF0dXM6IDUwMCB9O1xuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICAvKipcbiAgICAgKiBAZGVzY3JpcHRpb25cbiAgICAgKiDku47muIXluJDlgqzmrL7vvIzosIPmlbTorqLljZXliIbphY3ph49cbiAgICAgKiB7XG4gICAgICogICAgICBvaWQsIHRpZCwgc2lkLCBwaWQsIGNvdW50XG4gICAgICogfVxuICAgICAqL1xuICAgIGFwcC5yb3V0ZXIoJ2FkanVzdC1jb3VudCcsIGFzeW5jKCBjdHgsIG5leHQgKSA9PiB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBjb25zdCBvcGVuaWQgPSBldmVudC5kYXRhLm9wZW5JZCB8fCBldmVudC51c2VySW5mby5vcGVuSWQ7IFxuICAgICAgICAgICAgY29uc3QgeyBvaWQsIHRpZCwgc2lkLCBwaWQsIGNvdW50IH0gPSBldmVudC5kYXRhO1xuXG4gICAgICAgICAgICBjb25zdCBnZXRXcm9uZyA9IG1lc3NhZ2UgPT4gY3R4LmJvZHkgPSB7XG4gICAgICAgICAgICAgICAgbWVzc2FnZSxcbiAgICAgICAgICAgICAgICBzdGF0dXM6IDQwMFxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIOaYr+WQpuiDvee7p+e7reiwg+aVtFxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICBjb25zdCBvcmRlciQgPSBhd2FpdCBkYi5jb2xsZWN0aW9uKCdvcmRlcicpXG4gICAgICAgICAgICAgICAgLmRvYyggb2lkIClcbiAgICAgICAgICAgICAgICAuZ2V0KCApO1xuXG4gICAgICAgICAgICBpZiAoIG9yZGVyJC5kYXRhLmJhc2Vfc3RhdHVzID09PSAnMicgKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGdldFdyb25nKCflgqzmrL7lkI7kuI3og73kv67mlLnmlbDph48nKTtcblxuICAgICAgICAgICAgfSBlbHNlIGlmICggb3JkZXIkLmRhdGEuYmFzZV9zdGF0dXMgPT09ICcwJyApIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZ2V0V3JvbmcoJ+ivt+WFiOiwg+aVtOivpeWVhuWTgeS7t+agvCcpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIOS4jeiDveWkmuS6jua4heWNleWIhumFjeeahOaAu+i0reWFpemHj1xuICAgICAgICAgICAgICovXG4gICAgICAgICAgICBjb25zdCBzaG9wcGluZyQgPSBhd2FpdCBkYi5jb2xsZWN0aW9uKCdzaG9wcGluZy1saXN0JylcbiAgICAgICAgICAgICAgICAud2hlcmUoe1xuICAgICAgICAgICAgICAgICAgICB0aWQsIHNpZCwgcGlkXG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAuZ2V0KCApO1xuICAgICAgICAgICAgY29uc3Qgc2hvcHBpbmcgPSBzaG9wcGluZyQuZGF0YVsgMCBdO1xuICAgICAgICAgICAgY29uc3QgbGFzdE9yZGVycyQgPSBhd2FpdCBkYi5jb2xsZWN0aW9uKCdvcmRlcicpXG4gICAgICAgICAgICAgICAgLndoZXJlKHtcbiAgICAgICAgICAgICAgICAgICAgdGlkLCBzaWQsIHBpZCxcbiAgICAgICAgICAgICAgICAgICAgcGF5X3N0YXR1czogXy5uZXEoJzAnKSxcbiAgICAgICAgICAgICAgICAgICAgYmFzZV9zdGF0dXM6IF8ub3IoIF8uZXEoJzEnKSwgXy5lcSgnMicpLCBfLmVxKCczJykpXG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAuZ2V0KCApO1xuXG4gICAgICAgICAgICBjb25zdCBsYXN0T3JkZXJzID0gbGFzdE9yZGVycyQuZGF0YTtcbiAgICAgICAgICAgIGNvbnN0IG90aGVyQ291bnQ6IGFueSA9IGxhc3RPcmRlcnNcbiAgICAgICAgICAgICAgICAuZmlsdGVyKCBvID0+IG8uX2lkICE9PSBvaWQgKVxuICAgICAgICAgICAgICAgIC5yZWR1Y2UoKCB4LCB5ICkgPT4ge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4geCArIHkuYWxsb2NhdGVkQ291bnQgfHwgMFxuICAgICAgICAgICAgICAgIH0sIDAgKTtcblxuICAgICAgICAgICAgaWYgKCBjb3VudCArIG90aGVyQ291bnQgPiBzaG9wcGluZy5wdXJjaGFzZSApIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZ2V0V3JvbmcoYOivpeWVhuWTgeaAu+aVsOmHj+S4jeiDveWkp+S6jumHh+i0reaVsCR7c2hvcHBpbmcucHVyY2hhc2V95Lu277yBYCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8qKiDmm7TmlrDorqLljZUgKi9cbiAgICAgICAgICAgIGF3YWl0IGRiLmNvbGxlY3Rpb24oJ29yZGVyJylcbiAgICAgICAgICAgICAgICAuZG9jKCBvaWQgKVxuICAgICAgICAgICAgICAgIC51cGRhdGUoe1xuICAgICAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBhbGxvY2F0ZWRDb3VudDogY291bnRcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIOabtOaWsOa4heWNlVxuICAgICAgICAgICAgICog5bCR5LqO5oC76LSt5YWl6YeP5pe277yM6YeN5paw6LCD5pW05riF5Y2V55qE5Ymp5L2Z5YiG6YWN6YePXG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIGlmICggY291bnQgKyBvdGhlckNvdW50IDwgc2hvcHBpbmcucHVyY2hhc2UgKSB7XG5cbiAgICAgICAgICAgICAgICBjb25zdCBuZXdzaG9wcGluZyA9IE9iamVjdC5hc3NpZ24oeyB9LCBzaG9wcGluZywge1xuICAgICAgICAgICAgICAgICAgICBsYXN0QWxsb2NhdGVkOiBzaG9wcGluZy5wdXJjaGFzZSAtICggY291bnQgKyBvdGhlckNvdW50IClcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICBkZWxldGUgbmV3c2hvcHBpbmdbJ19pZCddO1xuXG4gICAgICAgICAgICAgICAgYXdhaXQgZGIuY29sbGVjdGlvbignc2hvcHBpbmctbGlzdCcpXG4gICAgICAgICAgICAgICAgICAgIC5kb2MoIFN0cmluZyggc2hvcHBpbmcuX2lkICkpXG4gICAgICAgICAgICAgICAgICAgIC5zZXQoe1xuICAgICAgICAgICAgICAgICAgICAgICAgZGF0YTogbmV3c2hvcHBpbmdcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiBjdHguYm9keSA9IHtcbiAgICAgICAgICAgICAgICBzdGF0dXM6IDIwMFxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgXG4gICAgICAgIH0gY2F0Y2ggKCBlICkge1xuICAgICAgICAgICAgcmV0dXJuIGN0eC5ib2R5ID0geyBzdGF0dXM6IDUwMCB9XG4gICAgICAgIH1cbiAgICB9KVxuXG4gICAgLyoqXG4gICAgICogQGRlc2NyaXB0aW9uXG4gICAgICog5om56YeP5Zyw77ya56Gu6K6k5a6i5oi36K6i5Y2V44CB5piv5ZCm5Zui6LSt44CB5raI5oGv5o6o6YCB5pON5L2cXG4gICAgICoge1xuICAgICAqICAgIHRpZCxcbiAgICAgKiAgICBvcmRlcnM6IHtcbiAgICAgKiAgICAgICAgb2lkXG4gICAgICogICAgICAgIHBpZFxuICAgICAqICAgICAgICBzaWRcbiAgICAgKiAgICAgICAgb3BlbmlkXG4gICAgICogICAgICAgIHByZXBheV9pZFxuICAgICAqICAgICAgICBmb3JtX2lkXG4gICAgICogICAgICAgIGFsbG9jYXRlZENvdW50XG4gICAgICogICAgICAgIGFsbG9jYXRlZEdyb3VwUHJpY2VcbiAgICAgKiAgICB9WyBdXG4gICAgICogICAgbm90aWZpY2F0aW9uOiB7IFxuICAgICAqICAgICAgIHRpdGxlLFxuICAgICAqICAgICAgIGRlc2MsXG4gICAgICogICAgICAgdGltZVxuICAgICAqICAgIH1cbiAgICAgKiB9XG4gICAgICovXG4gICAgYXBwLnJvdXRlcignYmF0Y2gtYWRqdXN0JywgYXN5bmMoIGN0eCwgbmV4dCApID0+IHtcbiAgICAgICAgdHJ5IHtcblxuICAgICAgICAgICAgLyoqIOaYr+WQpuiDveaLvOWboiAqL1xuICAgICAgICAgICAgbGV0IGNhbkdyb3VwVXNlck1hcENvdW50OiB7XG4gICAgICAgICAgICAgICAgWyBrOiBzdHJpbmcgXSA6IG51bWJlclxuICAgICAgICAgICAgfSA9IHsgfTtcblxuICAgICAgICAgICAgY29uc3QgeyB0aWQsIG9yZGVycywgbm90aWZpY2F0aW9uIH0gPSBldmVudC5kYXRhO1xuICAgICAgICAgICAgY29uc3QgZ2V0V3JvbmcgPSBtZXNzYWdlID0+IGN0eC5ib2R5ID0ge1xuICAgICAgICAgICAgICAgIG1lc3NhZ2UsXG4gICAgICAgICAgICAgICAgc3RhdHVzOiA0MDBcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIGF3YWl0IGRiLmNvbGxlY3Rpb24oJ3RyaXAnKVxuICAgICAgICAgICAgICAgIC5kb2MoIHRpZCApXG4gICAgICAgICAgICAgICAgLnVwZGF0ZSh7XG4gICAgICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlzQ2xvc2VkOiB0cnVlXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgXG4gICAgICAgICAgICBjb25zdCB0cmlwJCA9IGF3YWl0IGRiLmNvbGxlY3Rpb24oJ3RyaXAnKVxuICAgICAgICAgICAgICAgIC5kb2MoIHRpZCApXG4gICAgICAgICAgICAgICAgLmdldCggKTtcbiAgICAgICAgICAgIGNvbnN0IHRyaXAgPSB0cmlwJC5kYXRhO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICBpZiAoIHRyaXAuY2FsbE1vbmV5VGltZXMgJiYgIHRyaXAuY2FsbE1vbmV5VGltZXMgPj0gMyApIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZ2V0V3JvbmcoYOW3sue7j+WPkei1t+i/hyR7dHJpcC5jYWxsTW9uZXlUaW1lc33mrKHlgqzmrL5gKTtcblxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyDmm7TmlrDorqLljZVcbiAgICAgICAgICAgIGF3YWl0IFByb21pc2UuYWxsKCBvcmRlcnMubWFwKCBvcmRlciA9PiB7XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgLy8g5pyJ5Zui6LSt5Lu344CB5aSn5LqOMuS6uui0reS5sO+8jOS4lOiiq+WIhumFjeaVsOWdh+Wkp+S6jjDvvIzor6XorqLljZXmiY3ovr7liLDigJzlm6LotK3igJ3nmoTmnaHku7ZcbiAgICAgICAgICAgICAgICBjb25zdCBjYW5Hcm91cCA9ICEhb3JkZXJzLmZpbmQoIG8gPT4ge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gby5vaWQgIT09IG9yZGVyLm9pZCAmJlxuICAgICAgICAgICAgICAgICAgICAgICAgby5vcGVuaWQgIT09IG9yZGVyLm9wZW5pZCAmJiBcbiAgICAgICAgICAgICAgICAgICAgICAgIG8ucGlkID09PSBvcmRlci5waWQgJiYgby5zaWQgPT09IG9yZGVyLnNpZCAmJlxuICAgICAgICAgICAgICAgICAgICAgICAgby5hbGxvY2F0ZWRDb3VudCA+IDAgJiYgb3JkZXIuYWxsb2NhdGVkQ291bnQgPiAwICYmXG4gICAgICAgICAgICAgICAgICAgICAgICAhIW8uYWxsb2NhdGVkR3JvdXBQcmljZVxuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgaWYgKCBjYW5Hcm91cCApIHtcbiAgICAgICAgICAgICAgICAgICAgY2FuR3JvdXBVc2VyTWFwQ291bnQgPSBPYmplY3QuYXNzaWduKHsgfSwgY2FuR3JvdXBVc2VyTWFwQ291bnQsIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIFsgb3JkZXIub3BlbmlkIF06IGNhbkdyb3VwVXNlck1hcENvdW50WyBvcmRlci5vcGVuaWQgXSA9PT0gdW5kZWZpbmVkID8gMSA6IGNhbkdyb3VwVXNlck1hcENvdW50WyBvcmRlci5vcGVuaWQgXSArIDFcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgcmV0dXJuIGRiLmNvbGxlY3Rpb24oJ29yZGVyJylcbiAgICAgICAgICAgICAgICAgICAgLmRvYyggb3JkZXIub2lkIClcbiAgICAgICAgICAgICAgICAgICAgLnVwZGF0ZSh7XG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FuR3JvdXAsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYmFzZV9zdGF0dXM6ICcyJ1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgfSkpO1xuXG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqICHmm7TmlrDotK3nianmuIXljZVcbiAgICAgICAgICAgICAqL1xuXG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIOa2iOaBr+aOqOmAgVxuICAgICAgICAgICAgICogIeacquS7mOWFqOasvuaJjeWPkemAgVxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICBjb25zdCB1c2VycyA9IEFycmF5LmZyb20oXG4gICAgICAgICAgICAgICAgbmV3IFNldChcbiAgICAgICAgICAgICAgICAgICAgb3JkZXJzXG4gICAgICAgICAgICAgICAgICAgICAgICAubWFwKCBvcmRlciA9PiBvcmRlci5vcGVuaWQgKVxuICAgICAgICAgICAgICAgICAgICAgICAgLmZpbHRlciggb3BlbmlkID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gISFvcmRlcnMuZmluZCggb3JkZXIgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gb3JkZXIub3BlbmlkID09PSBvcGVuaWQgJiYgU3RyaW5nKCBvcmRlci5wYXlfc3RhdHVzICkgPT09ICcxJ1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICApO1xuXG4gICAgICAgICAgICAvKiog5o6o6YCB6YCa55+lICovXG4gICAgICAgICAgICBjb25zdCBycyA9IGF3YWl0IFByb21pc2UuYWxsKCB1c2Vycy5tYXAoIG9wZW5pZCA9PiB7XG5cbiAgICAgICAgICAgICAgICBjb25zdCB0YXJnZXQgPSBvcmRlcnMuZmluZCggb3JkZXIgPT4gb3JkZXIub3BlbmlkID09PSBvcGVuaWQgJiZcbiAgICAgICAgICAgICAgICAgICAgKCEhb3JkZXIucHJlcGF5X2lkIHx8ICEhb3JkZXIuZm9ybV9pZCApKTtcblxuICAgICAgICAgICAgICAgIC8vIHJldHVybiBjbG91ZC5jYWxsRnVuY3Rpb24oe1xuICAgICAgICAgICAgICAgIC8vICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgLy8gICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgLy8gICAgICAgICAgICAgdG91c2VyOiBvcGVuaWQsXG4gICAgICAgICAgICAgICAgLy8gICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgIC8vICAgICAgICAgICAgICAgICB0aXRsZTogY2FuR3JvdXBVc2VyTWFwQ291bnRbIFN0cmluZyggb3BlbmlkICldID9cbiAgICAgICAgICAgICAgICAvLyAgICAgICAgICAgICAgICAgICAgIC8vIGDmi7zlm6IkeyBjYW5Hcm91cFVzZXJNYXBDb3VudFsgU3RyaW5nKCBvcGVuaWQgKV195Lu277yB5oKo6LSt5Lmw55qE5ZWG5ZOB5bey5Yiw6LSnYCA6XG4gICAgICAgICAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgICAvLyAn5oKo6LSt5Lmw55qE5ZWG5ZOB5bey5Yiw6LSnJyxcbiAgICAgICAgICAgICAgICAvLyAgICAgICAgICAgICAgICAgICAgICfliLDotKfllabvvIHku5jlsL7mrL7vvIznq4vljbPlj5HotKcnIDogXG4gICAgICAgICAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgICAn5Yiw6LSn5ZWm77yB5LuY5bC+5qy+77yM56uL5Y2z5Y+R6LSnJyxcbiAgICAgICAgICAgICAgICAvLyAgICAgICAgICAgICAgICAgdGltZTogYFvooYznqItdJHt0cmlwLnRpdGxlfWBcbiAgICAgICAgICAgICAgICAvLyAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIC8vICAgICAgICAgICAgIGZvcm1faWQ6IHRhcmdldC5wcmVwYXlfaWQgfHwgdGFyZ2V0LmZvcm1faWRcbiAgICAgICAgICAgICAgICAvLyAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgLy8gICAgICAgICAkdXJsOiAnbm90aWZpY2F0aW9uLWdldG1vbmV5J1xuICAgICAgICAgICAgICAgIC8vICAgICB9LFxuICAgICAgICAgICAgICAgIC8vICAgICBuYW1lOiAnY29tbW9uJ1xuICAgICAgICAgICAgICAgIC8vIH0pO1xuXG4gICAgICAgICAgICAgICAgcmV0dXJuIGNsb3VkLmNhbGxGdW5jdGlvbih7XG4gICAgICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvcGVuaWQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogJ2dldE1vbmV5JyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcmVwYXlfaWQ6IHRhcmdldC5wcmVwYXlfaWQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGV4dHM6IFsn5pSv5LuY5bC+5qy+77yM56uL5Y2z5Y+R6LSn5ZOmJywn6LaK5b+r6LaK5aW9J11cbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAkdXJsOiAncHVzaC1zdWJzY3JpYmUnXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIG5hbWU6ICdjb21tb24nXG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIH0pKTtcbiBcbiAgICAgICAgICAgIC8vIOabtOaWsOihjOeoi1xuICAgICAgICAgICAgYXdhaXQgZGIuY29sbGVjdGlvbigndHJpcCcpXG4gICAgICAgICAgICAgICAgLmRvYyggdGlkIClcbiAgICAgICAgICAgICAgICAudXBkYXRlKHtcbiAgICAgICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgICAgICAgY2FsbE1vbmV5VGltZXM6IF8uaW5jKCAxIClcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICByZXR1cm4gY3R4LmJvZHkgPSB7XG4gICAgICAgICAgICAgICAgc3RhdHVzOiAyMDAsXG4gICAgICAgICAgICAgICAgLy8g5Ymp5L2Z5qyh5pWwXG4gICAgICAgICAgICAgICAgZGF0YTogMyAtICggMSArIHRyaXAuY2FsbE1vbmV5VGltZXMgKVxuICAgICAgICAgICAgfVxuXG4gICAgICAgIH0gY2F0Y2ggKCBlICkge1xuICAgICAgICAgICAgcmV0dXJuIGN0eC5ib2R5ID0geyBzdGF0dXM6IDUwMCB9O1xuICAgICAgICB9XG4gICAgfSlcblxuICAgIC8qKiBcbiAgICAgKiBAZGVzY3JpcHRpb25cbiAgICAgKiDorqLljZXku5jlsL7mrL5cbiAgICAgKiB7XG4gICAgICogICAgICB0aWRcbiAgICAgKiAgICAgIGludGVncmFsIC8vIOenr+WIhuaAu+mine+8iHVzZXLooajvvIlcbiAgICAgKiAgICAgIG9yZGVyczogW3sgIFxuICAgICAqICAgICAgICAgIG9pZCAvLyDorqLljZXnirbmgIFcbiAgICAgKiAgICAgICAgICBwaWRcbiAgICAgKiAgICAgICAgICBmaW5hbF9wcmljZSAvLyDmnIDnu4jmiJDkuqTpop1cbiAgICAgKiAgICAgICAgICBhbGxvY2F0ZWRDb3VudCAvLyDmnIDnu4jmiJDkuqTph49cbiAgICAgKiAgICAgIH1dXG4gICAgICogICAgICBjb3Vwb25zOiBbIC8vIOWNoeWIuOa2iOi0uVxuICAgICAqICAgICAgICAgIGlkMSxcbiAgICAgKiAgICAgICAgICBpZDIuLi5cbiAgICAgKiAgICAgIF0sXG4gICAgICogICAgICBwdXNoX2ludGVncmFsIC8vIOS9v+eUqOeahOaOqOW5v+enr+WIhlxuICAgICAqIH1cbiAgICAgKi9cbiAgICBhcHAucm91dGVyKCdwYXktbGFzdCcsIGFzeW5jKCBjdHgsIG5leHQgKSA9PiB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBjb25zdCBvcGVuaWQgPSBldmVudC51c2VySW5mby5vcGVuSWQ7XG4gICAgICAgICAgICBjb25zdCB7IHRpZCwgaW50ZWdyYWwsIG9yZGVycywgY291cG9ucywgcHVzaF9pbnRlZ3JhbCB9ID0gZXZlbnQuZGF0YTtcblxuICAgICAgICAgICAgY29uc3QgdXNlciQgPSBhd2FpdCBkYi5jb2xsZWN0aW9uKCd1c2VyJylcbiAgICAgICAgICAgICAgICAud2hlcmUoe1xuICAgICAgICAgICAgICAgICAgICBvcGVuaWRcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIC5nZXQoICk7XG4gICAgICAgICAgICBjb25zdCB1c2VyID0gdXNlciQuZGF0YVsgMCBdO1xuICAgICAgICAgICAgY29uc3QgdWlkID0gdXNlci5faWQ7XG5cbiAgICAgICAgICAgIC8vIOiuoeeul+aOqOW5v+enr+WIhlxuICAgICAgICAgICAgY29uc3QgY2FsY3VsYXRlUHVzaEludGVncmFsID0gdXNlci5wdXNoX2ludGVncmFsIC0gcHVzaF9pbnRlZ3JhbCA+IDAgP1xuICAgICAgICAgICAgICAgIHVzZXIucHVzaF9pbnRlZ3JhbCAtIHB1c2hfaW50ZWdyYWwgOiBcbiAgICAgICAgICAgICAgICAwO1xuXG4gICAgICAgICAgICBjb25zdCBzYXZlRGF0YSA9IHtcbiAgICAgICAgICAgICAgICAuLi51c2VyLFxuICAgICAgICAgICAgICAgIGludGVncmFsOiAoIHVzZXIuaW50ZWdyYWwgfHwgMCApICsgKCBpbnRlZ3JhbCB8fCAwICksXG4gICAgICAgICAgICAgICAgcHVzaF9pbnRlZ3JhbDogIXVzZXIucHVzaF9pbnRlZ3JhbCA/XG4gICAgICAgICAgICAgICAgICAgIDAgOlxuICAgICAgICAgICAgICAgICAgICBjYWxjdWxhdGVQdXNoSW50ZWdyYWxcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIGRlbGV0ZSBzYXZlRGF0YVsnX2lkJ107XG5cbiAgICAgICAgICAgIC8vIOWinuWKoOenr+WIhuaAu+minVxuICAgICAgICAgICAgLy8g5oq15omj5o6o5bm/56ev5YiGXG4gICAgICAgICAgICBhd2FpdCBkYi5jb2xsZWN0aW9uKCd1c2VyJylcbiAgICAgICAgICAgICAgICAuZG9jKCBTdHJpbmcoIHVpZCApKVxuICAgICAgICAgICAgICAgIC5zZXQoe1xuICAgICAgICAgICAgICAgICAgICBkYXRhOiBzYXZlRGF0YVxuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAvLyDmlrDlop7mjqjlub/np6/liIbkvb/nlKjorrDlvZVcbiAgICAgICAgICAgIGlmICggISFwdXNoX2ludGVncmFsICkge1xuICAgICAgICAgICAgICAgIGNvbnN0IHJlY29yZCQgPSBhd2FpdCBkYi5jb2xsZWN0aW9uKCdpbnRlZ3JhbC11c2UtcmVjb3JkJylcbiAgICAgICAgICAgICAgICAgICAgLndoZXJlKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aWQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb3BlbmlkLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6ICdwdXNoX2ludGVncmFsJ1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAuZ2V0KCApO1xuICAgICAgICAgICAgICAgIGNvbnN0IHJlY29yZCA9IHJlY29yZCQuZGF0YVsgMCBdO1xuXG4gICAgICAgICAgICAgICAgaWYgKCAhIXJlY29yZCAmJiAhIXB1c2hfaW50ZWdyYWwgKSB7XG4gICAgICAgICAgICAgICAgICAgIGF3YWl0IGRiLmNvbGxlY3Rpb24oJ2ludGVncmFsLXVzZS1yZWNvcmQnKVxuICAgICAgICAgICAgICAgICAgICAgICAgLmRvYyggU3RyaW5nKCByZWNvcmQuX2lkICkpXG4gICAgICAgICAgICAgICAgICAgICAgICAudXBkYXRlKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlOiBfLmluYyggcHVzaF9pbnRlZ3JhbCApXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmICggIXJlY29yZCAmJiAhIXB1c2hfaW50ZWdyYWwgKSB7XG4gICAgICAgICAgICAgICAgICAgIGF3YWl0IGRiLmNvbGxlY3Rpb24oJ2ludGVncmFsLXVzZS1yZWNvcmQnKVxuICAgICAgICAgICAgICAgICAgICAgICAgLmFkZCh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aWQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9wZW5pZCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU6IHB1c2hfaW50ZWdyYWwsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6ICdwdXNoX2ludGVncmFsJ1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8g5pu05paw6K6i5Y2V54q25oCB44CB5ZWG5ZOB6ZSA6YePXG4gICAgICAgICAgICBhd2FpdCBQcm9taXNlLmFsbCggb3JkZXJzLm1hcCggb3JkZXIgPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiBQcm9taXNlLmFsbChbXG4gICAgICAgICAgICAgICAgICAgIGRiLmNvbGxlY3Rpb24oJ29yZGVyJylcbiAgICAgICAgICAgICAgICAgICAgICAgIC5kb2MoIG9yZGVyLm9pZCApXG4gICAgICAgICAgICAgICAgICAgICAgICAudXBkYXRlKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJhc2Vfc3RhdHVzOiAnMycsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBheV9zdGF0dXM6ICcyJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZmluYWxfcHJpY2U6IG9yZGVyLmZpbmFsX3ByaWNlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXl0aW1lOiBnZXROb3coIHRydWUgKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH0pLFxuICAgICAgICAgICAgICAgICAgICBkYi5jb2xsZWN0aW9uKCdnb29kcycpXG4gICAgICAgICAgICAgICAgICAgICAgICAuZG9jKCBvcmRlci5waWQgKVxuICAgICAgICAgICAgICAgICAgICAgICAgLnVwZGF0ZSh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzYWxlZDogXy5pbmMoIG9yZGVyLmFsbG9jYXRlZENvdW50IClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIF0pXG4gICAgICAgICAgICB9KSk7XG5cbiAgICAgICAgICAgIC8vIOabtOaWsOWNoeWIuOS9v+eUqOeKtuaAgVxuICAgICAgICAgICAgYXdhaXQgUHJvbWlzZS5hbGwoIGNvdXBvbnMubWFwKCBjb3Vwb25pZCA9PiB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGRiLmNvbGxlY3Rpb24oJ2NvdXBvbicpXG4gICAgICAgICAgICAgICAgICAgIC5kb2MoIGNvdXBvbmlkIClcbiAgICAgICAgICAgICAgICAgICAgLnVwZGF0ZSh7XG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaXNVc2VkOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHVzZWRCeTogdGlkLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhblVzZUluTmV4dDogZmFsc2VcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIH0pKTtcblxuICAgICAgICAgICAgLy8g6L6+5Yiw5p2h5Lu277yM5YiZ6aKG5Y+W5Luj6YeR5Yi4XG4gICAgICAgICAgICAvLyDlkIzml7bliKDpmaTkuIrkuIDkuKrmnKrkvb/nlKjov4fnmoTku6Pph5HliLhcbiAgICAgICAgICAgIGNvbnN0IHRyaXAkID0gYXdhaXQgZGIuY29sbGVjdGlvbigndHJpcCcpXG4gICAgICAgICAgICAgICAgLmRvYyggdGlkIClcbiAgICAgICAgICAgICAgICAuZ2V0KCApO1xuXG4gICAgICAgICAgICBsZXQgcmVxID0ge1xuICAgICAgICAgICAgICAgIHJlc3VsdDoge1xuICAgICAgICAgICAgICAgICAgICBzdGF0dXM6IDUwMFxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIFxuICAgICAgICAgICAgY29uc3QgeyBjYXNoY291cG9uX2F0bGVhc3QsIGNhc2hjb3Vwb25fdmFsdWVzIH0gPSB0cmlwJC5kYXRhO1xuXG4gICAgICAgICAgICBjb25zdCB0ZW1wID0ge1xuICAgICAgICAgICAgICAgIG9wZW5JZDogb3BlbmlkLFxuICAgICAgICAgICAgICAgIGZyb210aWQ6IHRpZCxcbiAgICAgICAgICAgICAgICB0eXBlOiAndF9kYWlqaW4nLFxuICAgICAgICAgICAgICAgIHRpdGxlOiAn6KGM56iL5Luj6YeR5Yi4JyxcbiAgICAgICAgICAgICAgICBjYW5Vc2VJbk5leHQ6IHRydWUsXG4gICAgICAgICAgICAgICAgaXNVc2VkOiBmYWxzZSxcbiAgICAgICAgICAgICAgICBhdGxlYXN0OiBjYXNoY291cG9uX2F0bGVhc3QgfHwgMCxcbiAgICAgICAgICAgICAgICB2YWx1ZTogY2FzaGNvdXBvbl92YWx1ZXNcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIC8vIOaXoOmcgOmXqOanm++8jOacieS7o+mHkeWIuOWNs+WPr+mihuWPllxuICAgICAgICAgICAgaWYgKCAhIWNhc2hjb3Vwb25fdmFsdWVzICkge1xuXG4gICAgICAgICAgICAgICAgLy8g5Yig6Zmk5LiK5LiA5Liq5pyq5L2/55So55qE5Luj6YeR5Yi4XG4gICAgICAgICAgICAgICAgY29uc3QgbGFzdERhaWppbiQgPSBhd2FpdCBkYi5jb2xsZWN0aW9uKCdjb3Vwb24nKVxuICAgICAgICAgICAgICAgICAgICAud2hlcmUoe1xuICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogJ3RfZGFpamluJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGlzVXNlZDogZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgICAgICBjYW5Vc2VJbk5leHQ6IHRydWVcbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgLmdldCggKTtcblxuICAgICAgICAgICAgICAgIGlmICggbGFzdERhaWppbiQuZGF0YVsgMCBdKSB7XG4gICAgICAgICAgICAgICAgICAgIGF3YWl0IGRiLmNvbGxlY3Rpb24oJ2NvdXBvbicpXG4gICAgICAgICAgICAgICAgICAgICAgICAuZG9jKCBTdHJpbmcoIGxhc3REYWlqaW4kLmRhdGFbIDAgXS5faWQgKSlcbiAgICAgICAgICAgICAgICAgICAgICAgIC5yZW1vdmUoICk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgLy8g6aKG5Y+W5Luj6YeR5Yi4XG4gICAgICAgICAgICAgICAgcmVxID0gYXdhaXQgY2xvdWQuY2FsbEZ1bmN0aW9uKHtcbiAgICAgICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgICAgICAgZGF0YTogdGVtcCxcbiAgICAgICAgICAgICAgICAgICAgICAgICR1cmw6ICdjcmVhdGUnXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIG5hbWU6ICdjb3Vwb24nXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiBjdHguYm9keSA9IHtcbiAgICAgICAgICAgICAgICBzdGF0dXM6IDIwMCxcbiAgICAgICAgICAgICAgICBkYXRhOiByZXEucmVzdWx0LnN0YXR1cyA9PT0gMjAwID8gdGVtcCA6IG51bGwgXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfSBjYXRjaCAoIGUgKSB7XG4gICAgICAgICAgICByZXR1cm4gY3R4LmJvZHkgPSB7IHN0YXR1czogNTAwIH1cbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgLyoqIFxuICAgICAqIEBkZXNjcmlwdGlvblxuICAgICAqIOS7o+i0reiOt+WPluacquivu+iuouWNlVxuICAgICAqL1xuICAgIGFwcC5yb3V0ZXIoJ3VucmVhZCcsIGFzeW5jKCBjdHgsIG5leHQgKSA9PiB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBjb25zdCB7IHRpZCwgbGFzdFRpbWUgfSA9IGV2ZW50LmRhdGE7XG4gICAgICAgICAgICBsZXQgd2hlcmUkID0ge1xuICAgICAgICAgICAgICAgIHRpZFxuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgaWYgKCBsYXN0VGltZSApIHtcbiAgICAgICAgICAgICAgICB3aGVyZSQgPSBPYmplY3QuYXNzaWduKHsgfSwgd2hlcmUkLCB7XG4gICAgICAgICAgICAgICAgICAgIGNyZWF0ZXRpbWU6IF8uZ3RlKCBsYXN0VGltZSApXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGNvbnN0IGRhdGEkID0gYXdhaXQgZGIuY29sbGVjdGlvbignb3JkZXInKVxuICAgICAgICAgICAgICAgIC53aGVyZSggd2hlcmUkIClcbiAgICAgICAgICAgICAgICAuY291bnQoICk7XG5cbiAgICAgICAgICAgIHJldHVybiBjdHguYm9keSA9IHtcbiAgICAgICAgICAgICAgICBzdGF0dXM6IDIwMCxcbiAgICAgICAgICAgICAgICBkYXRhOiBkYXRhJC50b3RhbFxuICAgICAgICAgICAgfVxuXG4gICAgICAgIH0gY2F0Y2ggKCBlICkgeyByZXR1cm4gY3R4LmJvZHkgPSB7IHN0YXR1czogNTAwIH07fVxuICAgIH0pO1xuXG4gICAgLyoqIFxuICAgICAqIEBkZXNjcmlwdGlvblxuICAgICAqIOS7o+i0reafpeeci+aJgOacieeahOiuouWNleWIl+ihqFxuICAgICAqL1xuICAgIGFwcC5yb3V0ZXIoJ2xpc3QtYWxsJywgYXN5bmMoIGN0eCwgbmV4dCApID0+IHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIC8vIOafpeivouadoeaVsFxuICAgICAgICAgICAgY29uc3QgbGltaXQgPSAxMDtcbiAgICAgICAgICAgIGNvbnN0IHsgdGlkLCBwYWdlIH0gPSBldmVudC5kYXRhO1xuXG4gICAgICAgICAgICBjb25zdCB3aGVyZSQgPSB7XG4gICAgICAgICAgICAgICAgdGlkLFxuICAgICAgICAgICAgICAgIHBheV9zdGF0dXM6IF8ubmVxKCcwJylcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIGNvbnN0IHRvdGFsJCA9IGF3YWl0IGRiLmNvbGxlY3Rpb24oJ29yZGVyJylcbiAgICAgICAgICAgICAgICAud2hlcmUoIHdoZXJlJCApXG4gICAgICAgICAgICAgICAgLmNvdW50KCApO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICBjb25zdCBvcmRlcnMkID0gYXdhaXQgZGIuY29sbGVjdGlvbignb3JkZXInKVxuICAgICAgICAgICAgICAgIC53aGVyZSggd2hlcmUkIClcbiAgICAgICAgICAgICAgICAubGltaXQoIGxpbWl0IClcbiAgICAgICAgICAgICAgICAuc2tpcCgoIHBhZ2UgLSAxICkgKiBsaW1pdCApXG4gICAgICAgICAgICAgICAgLm9yZGVyQnkoJ2NyZWF0ZVRpbWUnLCAnZGVzYycpXG4gICAgICAgICAgICAgICAgLmdldCggKTtcblxuICAgICAgICAgICAgY29uc3QgcGlkcyA9IEFycmF5LmZyb20oXG4gICAgICAgICAgICAgICAgbmV3IFNldCggXG4gICAgICAgICAgICAgICAgICAgIG9yZGVycyQuZGF0YVxuICAgICAgICAgICAgICAgICAgICAgICAgLm1hcCggeCA9PiB4LnBpZCApXG4gICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgKTtcblxuICAgICAgICAgICAgY29uc3Qgc2lkcyA9IEFycmF5LmZyb20oXG4gICAgICAgICAgICAgICAgbmV3IFNldCggXG4gICAgICAgICAgICAgICAgICAgIG9yZGVycyQuZGF0YVxuICAgICAgICAgICAgICAgICAgICAgICAgLm1hcCggeCA9PiB4LnNpZCApXG4gICAgICAgICAgICAgICAgICAgICAgICAuZmlsdGVyKCB4ID0+ICEheCApXG4gICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgKTtcblxuICAgICAgICAgICAgY29uc3QgdWlkcyA9IEFycmF5LmZyb20oXG4gICAgICAgICAgICAgICAgbmV3IFNldCggXG4gICAgICAgICAgICAgICAgICAgIG9yZGVycyQuZGF0YVxuICAgICAgICAgICAgICAgICAgICAgICAgLm1hcCggeCA9PiB4Lm9wZW5pZCApXG4gICAgICAgICAgICAgICAgICAgICAgICAuZmlsdGVyKCB4ID0+ICEheCApXG4gICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgKTtcblxuICAgICAgICAgICAgLy8gY29uc3QgZ29vZHMkJCA9IGF3YWl0IFByb21pc2UuYWxsKFxuICAgICAgICAgICAgLy8gICAgIHBpZHMubWFwKCBcbiAgICAgICAgICAgIC8vICAgICAgICAgcGlkID0+IGRiLmNvbGxlY3Rpb24oJ2dvb2RzJylcbiAgICAgICAgICAgIC8vICAgICAgICAgICAgIC5kb2MoIFN0cmluZyggcGlkICkpXG4gICAgICAgICAgICAvLyAgICAgICAgICAgICAuZ2V0KCApXG4gICAgICAgICAgICAvLyAgICAgKVxuICAgICAgICAgICAgLy8gKTtcbiAgICAgICAgICAgIC8vIGNvbnN0IGdvb2RzJCA9IGdvb2RzJCQubWFwKCB4ID0+IHguZGF0YSApO1xuXG4gICAgICAgICAgICAvLyBjb25zdCBzdGFuZGFycyQkID0gYXdhaXQgUHJvbWlzZS5hbGwoXG4gICAgICAgICAgICAvLyAgICAgc2lkcy5tYXAoIFxuICAgICAgICAgICAgLy8gICAgICAgICBzaWQgPT4gZGIuY29sbGVjdGlvbignc3RhbmRhcmRzJylcbiAgICAgICAgICAgIC8vICAgICAgICAgICAgIC5kb2MoIFN0cmluZyggc2lkICkpXG4gICAgICAgICAgICAvLyAgICAgICAgICAgICAuZmllbGQoe1xuICAgICAgICAgICAgLy8gICAgICAgICAgICAgICAgIHBpZDogdHJ1ZSxcbiAgICAgICAgICAgIC8vICAgICAgICAgICAgICAgICBuYW1lOiB0cnVlXG4gICAgICAgICAgICAvLyAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgLy8gICAgICAgICAgICAgLmdldCggKVxuICAgICAgICAgICAgLy8gICAgIClcbiAgICAgICAgICAgIC8vICk7XG4gICAgICAgICAgICAvLyBjb25zdCBzdGFuZGFycyQgPSBzdGFuZGFycyQkLm1hcCggeCA9PiB4LmRhdGEgKTtcblxuICAgICAgICAgICAgY29uc3QgdXNlcnMkJCA9IGF3YWl0IFByb21pc2UuYWxsKFxuICAgICAgICAgICAgICAgIHVpZHMubWFwKCBcbiAgICAgICAgICAgICAgICAgICAgb3BlbmlkID0+IGRiLmNvbGxlY3Rpb24oJ3VzZXInKVxuICAgICAgICAgICAgICAgICAgICAgICAgLndoZXJlKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvcGVuaWRcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgICAgICAuZmllbGQoe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9wZW5pZDogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhdmF0YXJVcmw6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbmlja05hbWU6IHRydWVcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgICAgICAuZ2V0KCApXG4gICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIGNvbnN0IHVzZXJzJCA9IHVzZXJzJCQubWFwKCB4ID0+IHguZGF0YVsgMCBdKTtcblxuICAgICAgICAgICAgY29uc3QgbWV0YSA9IG9yZGVycyQuZGF0YS5tYXAoIG9yZGVyID0+IHtcblxuICAgICAgICAgICAgICAgIGNvbnN0IHVzZXIgPSB1c2VycyQuZmluZCggdXNlciA9PiB1c2VyLm9wZW5pZCA9PT0gb3JkZXIub3BlbmlkICk7XG4gICAgICAgICAgICAgICAgLy8gY29uc3QgZGV0YWlsID0gZ29vZHMkLmZpbmQoIGdvb2QgPT4gZ29vZC5faWQgPT09IG9yZGVyLnBpZCApO1xuICAgICAgICAgICAgICAgIC8vIGNvbnN0IHN0YW5kYXIgPSBzdGFuZGFycyQuZmluZCggcyA9PiBzLl9pZCA9PT0gb3JkZXIuc2lkICk7XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gT2JqZWN0LmFzc2lnbih7IH0sIG9yZGVyLCB7XG4gICAgICAgICAgICAgICAgICAgIHVzZXIsXG4gICAgICAgICAgICAgICAgICAgIC8vIGRldGFpbCxcbiAgICAgICAgICAgICAgICAgICAgLy8gc3RhbmRhclxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgcmV0dXJuIGN0eC5ib2R5ID0ge1xuICAgICAgICAgICAgICAgIHN0YXR1czogMjAwLFxuICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgcGFnZSxcbiAgICAgICAgICAgICAgICAgICAgcGFnZVNpemU6IGxpbWl0LFxuICAgICAgICAgICAgICAgICAgICBkYXRhOiBtZXRhLFxuICAgICAgICAgICAgICAgICAgICB0b3RhbDogdG90YWwkLnRvdGFsLFxuICAgICAgICAgICAgICAgICAgICB0b3RhbFBhZ2U6IE1hdGguY2VpbCggdG90YWwkLnRvdGFsIC8gbGltaXQgKVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuXG4gICAgICAgIH0gY2F0Y2ggKCBlICkgeyBcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCc/Pz8nLCBlIClcbiAgICAgICAgICAgIHJldHVybiBjdHguYm9keSA9IHsgc3RhdHVzOiA1MDAgfVxuICAgICAgICB9XG4gICAgfSlcbiBcbiAgIHJldHVybiBhcHAuc2VydmUoICk7XG5cbn1cblxuLyoqIOagueaNruexu+Wei++8jOi/lOWbnuaOqOmAgeaWh+ahiCAqL1xuZnVuY3Rpb24gZ2V0VGV4dEJ5UHVzaFR5cGUoIHR5cGU6ICdidXlQaW4xJyB8ICdidXlQaW4yJyB8ICd3YWl0UGluJyB8ICdidXknIHwgJ2dldE1vbmV5JywgZGVsdGEgKSB7XG5cbiAgICBjb25zdCBub3cgPSBnZXROb3coICk7XG4gICAgY29uc3QgbW9udGggPSBub3cuZ2V0TW9udGgoICkgKyAxO1xuICAgIGNvbnN0IGRhdGUgPSBub3cuZ2V0RGF0ZSggKTtcbiAgICBjb25zdCBob3VyID0gbm93LmdldEhvdXJzKCApO1xuICAgIGNvbnN0IG1pbnV0ZXMgPSBub3cuZ2V0TWludXRlcyggKTtcblxuICAgIGNvbnN0IGZpeFplcm8gPSBzID0+IFN0cmluZyggcyApLmxlbmd0aCA9PT0gMSA/IGAwJHtzfWAgOiBzOyBcblxuICAgIGlmICggdHlwZSA9PT0gJ2J1eScgKSB7XG4gICAgICAgIHJldHVybiBbXG4gICAgICAgICAgICBg5LiL5Y2V5oiQ5Yqf77yB5Lya5bC95b+r6YeH6LSt772eYCwgXG4gICAgICAgICAgICBgJHttb250aH3mnIgke2RhdGV95pelICR7aG91cn06JHtmaXhaZXJvKCBtaW51dGVzICl9YFxuICAgICAgICBdO1xuICAgIH0gZWxzZSBpZiAoIHR5cGUgPT09ICdidXlQaW4xJyApIHtcbiAgICAgICAgcmV0dXJuIFtcbiAgICAgICAgICAgIGDmga3llpzvvIHkvaDnnIHkuoYke2RlbHRhfeWFg++8gWAsXG4gICAgICAgICAgICBg54K55Ye75p+l55yLYFxuICAgICAgICBdXG4gICAgfSBlbHNlIGlmICggdHlwZSA9PT0gJ2J1eVBpbjInICkge1xuICAgICAgICByZXR1cm4gW1xuICAgICAgICAgICAgYOaBreWWnO+8geS9oOecgeS6hiR7ZGVsdGF95YWDIWAsXG4gICAgICAgICAgICBg5pyJ576k5Y+L5Y+C5Yqg5LqG576k5ou85Zui77yM54K55Ye75p+l55yLYFxuICAgICAgICBdXG4gICAgfSBlbHNlIGlmICggdHlwZSA9PT0gJ3dhaXRQaW4nICkge1xuICAgICAgICByZXR1cm4gW1xuICAgICAgICAgICAgYOW3rjHkurrlsLHmi7zmiJDvvIFgLFxuICAgICAgICAgICAgYOaJvue+pOWPi+aLvOWbou+8jOeri+ecgSR7ZGVsdGF95YWD77yBYFxuICAgICAgICBdXG4gICAgfSBlbHNlIGlmICggdHlwZSA9PT0gJ2dldE1vbmV5JyApIHtcbiAgICAgICAgcmV0dXJuIFtcbiAgICAgICAgICAgIGDmlK/ku5jlsL7mrL7vvIznq4vljbPlj5HotKflk6ZgLFxuICAgICAgICAgICAgYOi2iuW/q+i2iuWlvWBcbiAgICAgICAgXVxuICAgIH1cbiAgICByZXR1cm4gW11cbn0iXX0=