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
                            var _a = temp_1[k], price = _a.price, count = _a.count, pay_status = _a.pay_status, depositPrice = _a.depositPrice, groupPrice = _a.groupPrice;
                            return __assign(__assign({}, x.data), { price: price,
                                count: count,
                                pay_status: pay_status,
                                depositPrice: depositPrice,
                                groupPrice: groupPrice });
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
            var openid, openId_1, _a, orders, tid, prepay_id_1, form_id_1, orderIds, allUsedIntegral, find$, list_1, create$_1, _b, buyer, others, pushMe$, othersOrders$_1, othersMore, othersPush_1, appConf$, appConf, pushers$, pushers_1, appConf2$, appConf2, integralRate_1, e_3;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _c.trys.push([0, 18, , 19]);
                        openid = event.data.openId || event.data.openid || event.userInfo.openId;
                        openId_1 = openid;
                        _a = event.data, orders = _a.orders, tid = _a.tid, prepay_id_1 = _a.prepay_id, form_id_1 = _a.form_id;
                        orderIds = Array.isArray(orders) ?
                            orders.map(function (x) { return x.oid; }).join(',') : orders;
                        if (!Array.isArray(orders)) return [3, 4];
                        return [4, Promise.all(orders.map(function (order) { return __awaiter(void 0, void 0, void 0, function () {
                                var oid, pay_status, used_integral;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            oid = order.oid, pay_status = order.pay_status, used_integral = order.used_integral;
                                            return [4, db.collection('order').doc(oid)
                                                    .update({
                                                    data: {
                                                        form_id: form_id_1,
                                                        prepay_id: prepay_id_1,
                                                        pay_status: pay_status,
                                                        used_integral: used_integral
                                                    }
                                                })];
                                        case 1:
                                            _a.sent();
                                            if (!(pay_status === '2')) return [3, 3];
                                            return [4, db.collection('order').doc(oid)
                                                    .update({
                                                    data: {
                                                        depositPrice: 0
                                                    }
                                                })];
                                        case 2:
                                            _a.sent();
                                            _a.label = 3;
                                        case 3: return [2];
                                    }
                                });
                            }); }))];
                    case 1:
                        _c.sent();
                        if (!!!tid) return [3, 3];
                        allUsedIntegral = orders.reduce(function (x, y) {
                            return x + (y.used_integral || 0);
                        }, 0);
                        return [4, cloud.callFunction({
                                name: 'common',
                                data: {
                                    $url: 'push-integral-create',
                                    data: {
                                        tid: tid,
                                        openid: openid,
                                        value: allUsedIntegral
                                    }
                                }
                            })];
                    case 2:
                        _c.sent();
                        _c.label = 3;
                    case 3: return [3, 6];
                    case 4: return [4, Promise.all(orderIds.split(',').map(function (oid) {
                            return db.collection('order').doc(oid)
                                .update({
                                data: {
                                    form_id: form_id_1,
                                    prepay_id: prepay_id_1,
                                    pay_status: '1'
                                }
                            });
                        }))];
                    case 5:
                        _c.sent();
                        _c.label = 6;
                    case 6: return [4, Promise.all(orderIds.split(',').map(function (oid) {
                            return db.collection('order')
                                .where({
                                _id: oid
                            })
                                .get();
                        }))];
                    case 7:
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
                    case 8:
                        create$_1 = _c.sent();
                        if (!(create$_1.result.status === 200)) return [3, 12];
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
                    case 9:
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
                    case 10:
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
                    case 11:
                        _c.sent();
                        _c.label = 12;
                    case 12: return [4, db.collection('app-config')
                            .where({
                            type: 'good-integral-share'
                        })
                            .get()];
                    case 13:
                        appConf$ = _c.sent();
                        appConf = appConf$.data[0];
                        if (!!!appConf.value) return [3, 17];
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
                    case 14:
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
                    case 15:
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
                    case 16:
                        _c.sent();
                        _c.label = 17;
                    case 17: return [2, ctx.body = {
                            status: 200
                        }];
                    case 18:
                        e_3 = _c.sent();
                        console.log(e_3);
                        return [2, ctx.body = { status: 500 }];
                    case 19: return [2];
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
                                            texts: ['支付尾款，立即发货哦', '越快越好'],
                                            page: 'pages/order-list/index'
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
            var openid, _a, tid_2, integral, orders, coupons, push_integral, user$, user, uid, calculatePushIntegral, saveData, trip$, req, _b, cashcoupon_atleast, cashcoupon_values, temp, lastDaijin$, e_7;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _c.trys.push([0, 13, , 14]);
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
                        if (!!!push_integral) return [3, 4];
                        return [4, cloud.callFunction({
                                data: {
                                    data: {
                                        tid: tid_2,
                                        openid: openid,
                                        value: push_integral
                                    },
                                    $url: 'push-integral-create'
                                },
                                name: 'common'
                            })];
                    case 3:
                        _c.sent();
                        _c.label = 4;
                    case 4: return [4, Promise.all(orders.map(function (order) {
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
                    case 5:
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
                    case 6:
                        _c.sent();
                        return [4, db.collection('trip')
                                .doc(tid_2)
                                .get()];
                    case 7:
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
                        if (!!!cashcoupon_values) return [3, 12];
                        return [4, db.collection('coupon')
                                .where({
                                type: 't_daijin',
                                isUsed: false,
                                canUseInNext: true
                            })
                                .get()];
                    case 8:
                        lastDaijin$ = _c.sent();
                        if (!lastDaijin$.data[0]) return [3, 10];
                        return [4, db.collection('coupon')
                                .doc(String(lastDaijin$.data[0]._id))
                                .remove()];
                    case 9:
                        _c.sent();
                        _c.label = 10;
                    case 10: return [4, cloud.callFunction({
                            data: {
                                data: temp,
                                $url: 'create'
                            },
                            name: 'coupon'
                        })];
                    case 11:
                        req = _c.sent();
                        _c.label = 12;
                    case 12: return [2, ctx.body = {
                            status: 200,
                            data: req.result.status === 200 ? temp : null
                        }];
                    case 13:
                        e_7 = _c.sent();
                        return [2, ctx.body = { status: 500 }];
                    case 14: return [2];
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
            "\u606D\u559C\uFF01\u4F60\u62FC\u56E2\u7701\u4E86" + delta + "\u5143\uFF01",
            "\u70B9\u51FB\u67E5\u770B"
        ];
    }
    else if (type === 'buyPin2') {
        return [
            "\u606D\u559C\uFF01\u4F60\u62FC\u56E2\u7701\u4E86" + delta + "\u5143!",
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUNBLHFDQUF1QztBQUN2QyxzQ0FBd0M7QUFDeEMsbUNBQW1DO0FBRW5DLEtBQUssQ0FBQyxJQUFJLENBQUM7SUFDUCxHQUFHLEVBQUUsT0FBTyxDQUFDLEdBQUcsQ0FBQyxLQUFLO0NBQ3pCLENBQUMsQ0FBQztBQUVILElBQU0sRUFBRSxHQUFnQixLQUFLLENBQUMsUUFBUSxFQUFHLENBQUM7QUFDMUMsSUFBTSxDQUFDLEdBQUcsRUFBRSxDQUFDLE9BQU8sQ0FBQztBQVFyQixJQUFNLE1BQU0sR0FBRyxVQUFFLEVBQVU7SUFBVixtQkFBQSxFQUFBLFVBQVU7SUFDdkIsSUFBSyxFQUFFLEVBQUc7UUFDTixPQUFPLElBQUksQ0FBQyxHQUFHLEVBQUcsQ0FBQztLQUN0QjtJQUNELElBQU0sTUFBTSxHQUFHLElBQUksSUFBSSxDQUFFLElBQUksSUFBSSxFQUFHLENBQUMsY0FBYyxFQUFHLENBQUMsQ0FBQztJQUN4RCxPQUFPLElBQUksSUFBSSxDQUFFLE1BQU0sQ0FBQyxPQUFPLEVBQUcsR0FBRyxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxJQUFJLENBQUUsQ0FBQTtBQUM3RCxDQUFDLENBQUE7QUFxQ1ksUUFBQSxJQUFJLEdBQUcsVUFBUSxLQUFLLEVBQUUsT0FBTzs7O1FBRWhDLEdBQUcsR0FBRyxJQUFJLFNBQVMsQ0FBQyxFQUFFLEtBQUssT0FBQSxFQUFFLENBQUMsQ0FBQztRQWlDckMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxRQUFRLEVBQUUsVUFBTyxHQUFHLEVBQUUsSUFBSTs7Ozs7O3dCQUd2QixLQUF3QixLQUFLLENBQUMsSUFBSSxFQUFoQyxHQUFHLFNBQUEsRUFBRSxJQUFJLFVBQUEsRUFBRSxNQUFNLFlBQUEsQ0FB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QU0sSUFBSyxJQUFJLEtBQUssU0FBUyxFQUFHO1FBQzdCLE9BQU87WUFDSCx1Q0FBUztZQUNULHFEQUFXLEtBQUssaUJBQUk7U0FDdkIsQ0FBQTtLQUNKO1NBQU0sSUFBSyxJQUFJLEtBQUssVUFBVSxFQUFHO1FBQzlCLE9BQU87WUFDSCw4REFBWTtZQUNaLDBCQUFNO1NBQ1QsQ0FBQTtLQUNKO0lBQ0QsT0FBTyxFQUFFLENBQUE7QUFDYixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiXG5pbXBvcnQgKiBhcyBjbG91ZCBmcm9tICd3eC1zZXJ2ZXItc2RrJztcbmltcG9ydCAqIGFzIFRjYlJvdXRlciBmcm9tICd0Y2Itcm91dGVyJztcbmltcG9ydCB7IGNyZWF0ZSQgfSBmcm9tICcuL2NyZWF0ZSc7XG5cbmNsb3VkLmluaXQoe1xuICAgIGVudjogcHJvY2Vzcy5lbnYuY2xvdWRcbn0pO1xuXG5jb25zdCBkYjogREIuRGF0YWJhc2UgPSBjbG91ZC5kYXRhYmFzZSggKTtcbmNvbnN0IF8gPSBkYi5jb21tYW5kO1xuXG4vKiogXG4gKiDovazmjaLmoLzmnpflsLzmsrvml7bljLogKzjml7bljLpcbiAqIERhdGUoKS5ub3coKSAvIG5ldyBEYXRlKCkuZ2V0VGltZSgpIOaYr+aXtuS4jeaXtuato+W4uOeahCs4XG4gKiBEYXRlLnRvTG9jYWxTdHJpbmcoICkg5aW95YOP5piv5LiA55u05pivKzDnmoRcbiAqIOWFiOaLv+WIsCArMO+8jOeEtuWQjis4XG4gKi9cbmNvbnN0IGdldE5vdyA9ICggdHMgPSBmYWxzZSApOiBhbnkgPT4ge1xuICAgIGlmICggdHMgKSB7XG4gICAgICAgIHJldHVybiBEYXRlLm5vdyggKTtcbiAgICB9XG4gICAgY29uc3QgdGltZV8wID0gbmV3IERhdGUoIG5ldyBEYXRlKCApLnRvTG9jYWxlU3RyaW5nKCApKTtcbiAgICByZXR1cm4gbmV3IERhdGUoIHRpbWVfMC5nZXRUaW1lKCApICsgOCAqIDYwICogNjAgKiAxMDAwIClcbn1cblxuLyoqXG4gKiBcbiAqIEBkZXNjcmlwdGlvbiDorqLljZXmqKHlnZdcbiAqIC0tLS0tLS0tIOWtl+autSAtLS0tLS0tLS0tXG4gKiBfaWRcbiAqIG9wZW5pZCxcbiAqIGNyZWF0ZXRpbWVcbiAqIHBheXRpbWVcbiAqIHRpZCxcbiAqIHBpZCxcbiAqIGNpZCAo5Y+v5Li656m6KVxuICogc2lkLCAo5Y+v5Li656m6KVxuICogY291bnQsXG4gKiBwcmljZSxcbiAqIGdyb3VwUHJpY2UsXG4gKiBkZXBvc2l0X3ByaWNlOiDllYblk4HorqLph5EgKOWPr+S4uuepuilcbiAqICEgYWNpZCDllYblk4HmtLvliqhpZFxuICogISBpc09jY3VwaWVkLCDmmK/lkKbljaDlupPlrZhcbiAqIGdyb3VwX3ByaWNlICjlj6/kuLrnqbopXG4gKiB0eXBlOiAnY3VzdG9tJyB8ICdub3JtYWwnIHwgJ3ByZScg6Ieq5a6a5LmJ5Yqg5Y2V44CB5pmu6YCa5Yqg5Y2V44CB6aKE6K6i5Y2VXG4gKiBpbWc6IEFycmF5WyBzdHJpbmcgXVxuICogZGVzY++8iOWPr+S4uuepuu+8iSxcbiAqIGFpZFxuICogYWxsb2NhdGVkUHJpY2Ug5YiG6YWN55qE5Lu35qC8XG4gKiBhbGxvY2F0ZWRHcm91cFByaWNlIOWIhumFjeWboui0reS7t1xuICogYWxsb2NhdGVkQ291bnQg5YiG6YWN55qE5pWw6YePXG4gKiBmb3JtX2lkXG4gKiBwcmVwYXlfaWQsXG4gKiAhIHVzZWRfaW50ZWdyYWwg56ev5YiG5L2/55So5oOF5Ya1XG4gKiBmaW5hbF9wcmljZSDmnIDlkI7miJDkuqTku7dcbiAqICEgY2FuR3JvdXAg5piv5ZCm5Y+v5Lul5ou85ZuiXG4gKiBiYXNlX3N0YXR1czogMCwxLDIsMyw0LDUg6L+b6KGM5Lit77yM5Luj6LSt5bey6LSt5Lmw77yM5bey6LCD5pW077yM5bey57uT566X77yM5bey5Y+W5raI77yI5Lmw5LiN5Yiw77yJ77yM5bey6L+H5pyf77yI5pSv5LuY6L+H5pyf77yJXG4gKiBwYXlfc3RhdHVzOiAwLDEsMiDmnKrku5jmrL7vvIzlt7Lku5jorqLph5HvvIzlt7Lku5jlhajmrL5cbiAqICEgZGVsaXZlcl9zdGF0dXM6IDAsMSDmnKrlj5HluIPvvIzlt7Llj5HluIPjgIFcbiAqL1xuZXhwb3J0IGNvbnN0IG1haW4gPSBhc3luYyAoIGV2ZW50LCBjb250ZXh0ICkgPT4ge1xuXG4gICAgY29uc3QgYXBwID0gbmV3IFRjYlJvdXRlcih7IGV2ZW50IH0pO1xuXG4gICAgLyoqXG4gICAgICogQGRlc2NyaXB0aW9uIOWIm+W7uuiuouWNlVxuICAgICAqIC0tLS0tLS0tIOivt+axgiAtLS0tLS0tLS0tXG4gICAgICoge1xuICAgICAqICAgICAgdGlkLFxuICAgICAqICAgICAgb3BlbklkIC8vIOiuouWNleS4u+S6ulxuICAgICAqICAgICAgZnJvbTogJ2NhcnQnIHwgJ2J1eScgfCAnY3VzdG9tJyB8ICdhZ2VudHMnIHwgJ3N5c3RlbScg5p2l5rqQ77ya6LSt54mp6L2m44CB55u05o6l6LSt5Lmw44CB6Ieq5a6a5LmJ5LiL5Y2V44CB5Luj6LSt5LiL5Y2V44CB57O757uf5Y+R6LW36aKE5LuY6K6i5Y2VXG4gICAgICogICAgICBvcmRlcnM6IEFycmF5PHsgXG4gICAgICogICAgICAgICAgdGlkXG4gICAgICogICAgICAgICAgY2lkXG4gICAgICogICAgICAgICAgc2lkXG4gICAgICogICAgICAgICAgcGlkXG4gICAgICogICAgICAgICAgcHJpY2VcbiAgICAgKiAgICAgICAgICBuYW1lXG4gICAgICogICAgICAgICAgYWNpZFxuICAgICAqICAgICAgICAgIHN0YW5kZXJuYW1lXG4gICAgICogICAgICAgICAgZ3JvdXBQcmljZVxuICAgICAqICAgICAgICAgIGNvdW50XG4gICAgICogICAgICAgICAgZGVzY1xuICAgICAqICAgICAgICAgIGltZ1xuICAgICAqICAgICAgICAgIHR5cGVcbiAgICAgKiAgICAgICAgICBwYXlfc3RhdHVzLFxuICAgICAqICAgICAgICAgIGFkZHJlc3M6IHtcbiAgICAgKiAgICAgICAgICAgICAgbmFtZSxcbiAgICAgKiAgICAgICAgICAgICAgcGhvbmUsXG4gICAgICogICAgICAgICAgICAgIGRldGFpbCxcbiAgICAgKiAgICAgICAgICAgICAgcG9zdGFsY29kZVxuICAgICAqICAgICAgICAgIH1cbiAgICAgKiAgICAgIH0+XG4gICAgICogfVxuICAgICAqL1xuICAgIGFwcC5yb3V0ZXIoJ2NyZWF0ZScsIGFzeW5jKCBjdHgsIG5leHQgKSA9PiB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGNvbnN0IHsgdGlkLCBmcm9tLCBvcmRlcnMgfSA9IGV2ZW50LmRhdGE7XG4gICAgICAgICAgICBjb25zdCBvcGVuaWQgPSBldmVudC5kYXRhLm9wZW5JZCB8fCBldmVudC51c2VySW5mby5vcGVuSWQ7XG5cbiAgICAgICAgICAgIC8vIDHjgIHliKTmlq3or6XooYznqIvmmK/lkKblj6/ku6XnlKhcbiAgICAgICAgICAgIGNvbnN0IHRyaXBzJCQgPSBhd2FpdCBjbG91ZC5jYWxsRnVuY3Rpb24oe1xuICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgICAgICAgX2lkOiB0aWRcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgJHVybDogJ2RldGFpbCdcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIG5hbWU6ICd0cmlwJ1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIGNvbnN0IHRyaXBzJCA9IHRyaXBzJCQucmVzdWx0OyAgICAgICAgXG4gICAgICAgICAgICBpZiAoIHRyaXBzJC5zdGF0dXMgIT09IDIwMFxuICAgICAgICAgICAgICAgICAgICB8fCAhdHJpcHMkLmRhdGEgXG4gICAgICAgICAgICAgICAgICAgIHx8ICggISF0cmlwcyQuZGF0YSAmJiB0cmlwcyQuZGF0YS5pc0Nsb3NlZCApIFxuICAgICAgICAgICAgICAgICAgICB8fCAoICEhdHJpcHMkLmRhdGEgJiYgZ2V0Tm93KCB0cnVlICkgPj0gdHJpcHMkLmRhdGEuZW5kX2RhdGUgKSkge1xuICAgICAgICAgICAgICAgIHRocm93ICfmmoLml6DooYznqIvorqHliJLvvIzmmoLml7bkuI3og73otK3kubDvvZ4nXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIOacgOaWsOWPr+eUqOihjOeoi1xuICAgICAgICAgICAgY29uc3QgdHJpcCA9IHRyaXBzJC5kYXRhO1xuXG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIOagueaNruWcsOWdgOWvueixoe+8jOaLv+WIsOWcsOWdgGlkXG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIGxldCBhZGRyZXNzaWQkID0ge1xuICAgICAgICAgICAgICAgIHJlc3VsdDoge1xuICAgICAgICAgICAgICAgICAgICBkYXRhOiBudWxsLFxuICAgICAgICAgICAgICAgICAgICBzdGF0dXM6IDUwMFxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIC8vIOiuouWNleadpea6kO+8mui0reeJqei9puOAgeezu+e7n+WKoOWNlVxuICAgICAgICAgICAgaWYgKCBldmVudC5kYXRhLmZyb20gPT09ICdjYXJ0JyB8fCBldmVudC5kYXRhLmZyb20gPT09ICdzeXN0ZW0nIHx8IGV2ZW50LmRhdGEuZnJvbSA9PT0gJ2J1eScgKSB7XG4gICAgICAgICAgICAgICAgYWRkcmVzc2lkJCA9IGF3YWl0IGNsb3VkLmNhbGxGdW5jdGlvbih7XG4gICAgICAgICAgICAgICAgICAgIGRhdGE6IHsgXG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb3BlbklkOiBvcGVuaWQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYWRkcmVzczogZXZlbnQuZGF0YS5vcmRlcnNbIDAgXS5hZGRyZXNzXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgJHVybDogJ2dldEFkZHJlc3NJZCdcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgbmFtZTogJ2FkZHJlc3MnXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIC8vIOiuouWNleadpea6kO+8mui0reeJqei9puOAgeezu+e7n+WKoOWNlVxuICAgICAgICAgICAgaWYgKCggZXZlbnQuZGF0YS5mcm9tID09PSAnY2FydCcgfHwgZXZlbnQuZGF0YS5mcm9tID09PSAnc3lzdGVtJyApICYmIGFkZHJlc3NpZCQucmVzdWx0LnN0YXR1cyAhPT0gMjAwICkge1xuICAgICAgICAgICAgICAgIHRocm93ICfmn6Xor6LlnLDlnYDplJnor68nO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyDlj6/nlKjlnLDlnYBpZFxuICAgICAgICAgICAgY29uc3QgYWlkID0gYWRkcmVzc2lkJC5yZXN1bHQuZGF0YTtcblxuICAgICAgICAgICAgLy8g5piv5ZCm5paw5a6i5oi3XG4gICAgICAgICAgICBjb25zdCBpc05ldyQgPSBhd2FpdCBjbG91ZC5jYWxsRnVuY3Rpb24oe1xuICAgICAgICAgICAgICAgIG5hbWU6ICdjb21tb24nLFxuICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgJHVybDogJ2lzLW5ldy1jdXN0b21lcicsXG4gICAgICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG9wZW5JZDogb3BlbmlkXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KVxuXG4gICAgICAgICAgICBjb25zdCBpc05ldyA9IGlzTmV3JC5yZXN1bHQuZGF0YTtcblxuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiDmlrDlrqIgKyDmlrDlrqLopoHorqLph5EgPSAnMCcsXG4gICAgICAgICAgICAgKiDmlrDlrqIgKyDopoHorqLph5EgPSAnMCcsXG4gICAgICAgICAgICAgKiDmlrDlrqIgKyDlhY3orqLph5EgPSAnMScsXG4gICAgICAgICAgICAgKiDml6flrqIgKyDml6flrqLlhY3orqLph5EgPSAnMScsXG4gICAgICAgICAgICAgKiDml6flrqIgKyDopoHorqLph5EgPSAnMCcsXG4gICAgICAgICAgICAgKiDml6flrqIgKyDlhY3orqLph5EgPSAnMScsXG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIGxldCBwYXlfc3RhdHVzID0gJzAnO1xuICAgICAgICAgICAgY29uc3QgcCA9IHRyaXAucGF5bWVudDtcblxuICAgICAgICAgICAgaWYgKCBpc05ldyAmJiBwID09PSAnMCcgKSB7XG4gICAgICAgICAgICAgICAgcGF5X3N0YXR1cyA9ICcwJ1xuXG4gICAgICAgICAgICB9IGVsc2UgaWYgKCBpc05ldyAmJiBwID09PSAnMScgKSB7XG4gICAgICAgICAgICAgICAgcGF5X3N0YXR1cyA9ICcwJ1xuXG4gICAgICAgICAgICB9IGVsc2UgaWYgKCBpc05ldyAmJiBwID09PSAnMicgKSB7XG4gICAgICAgICAgICAgICAgcGF5X3N0YXR1cyA9ICcxJ1xuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgfSBlbHNlIGlmICggIWlzTmV3ICYmIHAgPT09ICcwJyApIHtcbiAgICAgICAgICAgICAgICBwYXlfc3RhdHVzID0gJzEnXG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICB9IGVsc2UgaWYgKCAhaXNOZXcgJiYgcCA9PT0gJzEnICkge1xuICAgICAgICAgICAgICAgIHBheV9zdGF0dXMgPSAnMCdcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoICFpc05ldyAmJiBwID09PSAnMicgKSB7XG4gICAgICAgICAgICAgICAgcGF5X3N0YXR1cyA9ICcxJ1xuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBwYXlfc3RhdHVzID0gJzAnXG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIDPjgIHmibnph4/liJvlu7rorqLljZXvvIzvvIjov4fmu6TmjonkuI3og73liJvlu7rotK3nianmuIXljZXnmoTllYblk4HvvIlcbiAgICAgICAgICAgIGNvbnN0IHRlbXAgPSBldmVudC5kYXRhLm9yZGVycy5tYXAoIG1ldGEgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IHQgPSBPYmplY3QuYXNzaWduKHsgfSwgbWV0YSwge1xuICAgICAgICAgICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAgICAgICAgICogISBkZWxpdmVyX3N0YXR1c+S4uuacquWPkeW4gyDlj6/og73mnInpl67pophcbiAgICAgICAgICAgICAgICAgICAgICovXG4gICAgICAgICAgICAgICAgICAgIGFpZCxcbiAgICAgICAgICAgICAgICAgICAgaXNPY2N1cGllZDogdHJ1ZSwgLy8g5Y2g6aKG5bqT5a2Y5qCH5b+XXG4gICAgICAgICAgICAgICAgICAgIG9wZW5pZDogb3BlbmlkLFxuICAgICAgICAgICAgICAgICAgICBkZWxpdmVyX3N0YXR1czogJzAnLCBcbiAgICAgICAgICAgICAgICAgICAgYmFzZV9zdGF0dXM6ICcwJyxcbiAgICAgICAgICAgICAgICAgICAgcGF5X3N0YXR1czogIW1ldGEuZGVwb3NpdFByaWNlID8gJzEnIDogcGF5X3N0YXR1cyAsIC8vIOWVhuWTgeiuoumHkemineW6puS4ujBcbiAgICAgICAgICAgICAgICAgICAgY3JlYXRlVGltZTogZ2V0Tm93KCB0cnVlICksXG4gICAgICAgICAgICAgICAgICAgIHR5cGU6ICEhbWV0YS5kZXBvc2l0UHJpY2UgPyBtZXRhLnR5cGUgOiAnbm9ybWFsJ1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIGRlbGV0ZSB0WydhZGRyZXNzJ107XG5cbiAgICAgICAgICAgICAgICBpZiAoICF0WydzaWQnXSApIHtcbiAgICAgICAgICAgICAgICAgICAgZGVsZXRlIHRbJ3NpZCddO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHJldHVybiB0O1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIC8vIDTjgIHmibnph4/liJvlu7rpooTku5jmrL7orqLljZUgKCDlkIzml7blpITnkIbljaDpoobotKflrZjnmoTpl67popggKVxuICAgICAgICAgICAgY29uc3Qgc2F2ZSQ6IGFueSA9IGF3YWl0IFByb21pc2UuYWxsKCB0ZW1wLm1hcCggbyA9PiB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGNyZWF0ZSQoIG9wZW5pZCwgbywgZGIsIGN0eCApO1xuICAgICAgICAgICAgfSkpO1xuICAgICAgICBcbiAgICAgICAgICAgIGlmICggc2F2ZSQuc29tZSggeCA9PiB4LnN0YXR1cyAhPT0gMjAwICkpIHtcbiAgICAgICAgICAgICAgICB0aHJvdyAn5Yib5bu66K6i5Y2V6ZSZ6K+v77yBJ1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyDov5Tlm57orqLljZXkv6Hmga9cbiAgICAgICAgICAgIGNvbnN0IG9yZGVyX3Jlc3VsdCA9IHNhdmUkLm1hcCgoIHgsIGsgKSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3QgeyBwcmljZSwgY291bnQsIHBheV9zdGF0dXMsIGRlcG9zaXRQcmljZSwgZ3JvdXBQcmljZSB9ID0gdGVtcFsgayBdO1xuICAgICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgICAgIC4uLnguZGF0YSxcbiAgICAgICAgICAgICAgICAgICAgcHJpY2UsXG4gICAgICAgICAgICAgICAgICAgIGNvdW50LFxuICAgICAgICAgICAgICAgICAgICBwYXlfc3RhdHVzLFxuICAgICAgICAgICAgICAgICAgICBkZXBvc2l0UHJpY2UsXG4gICAgICAgICAgICAgICAgICAgIGdyb3VwUHJpY2VcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgcmV0dXJuIGN0eC5ib2R5ID0ge1xuICAgICAgICAgICAgICAgIHN0YXR1czogMjAwLFxuICAgICAgICAgICAgICAgIGRhdGE6IG9yZGVyX3Jlc3VsdFxuICAgICAgICAgICAgfTtcblxuICAgICAgICB9IGNhdGNoICggZSApIHtcbiAgICAgXG4gICAgICAgICAgICByZXR1cm4gY3R4LmJvZHkgPSB7XG4gICAgICAgICAgICAgICAgc3RhdHVzOiA1MDAsXG4gICAgICAgICAgICAgICAgbWVzc2FnZTogZVxuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgLyoqXG4gICAgICogQGRlc2NyaXB0aW9uXG4gICAgICog5a6i5oi356uv5p+l6K+iXG4gICAgICogXG4gICAgICog5YiG6aG1ICsgcXVlcnkg5p+l6K+i6K6i5Y2V5YiX6KGo77yI5pyq6IGa5ZCI77yJXG4gICAgICogLS0tLS0g6K+35rGCIC0tLS0tLVxuICAgICAqIHtcbiAgICAgKiEgICAgdGlkOiDooYznqItpZCDvvIjlj6/ml6DvvIlcbiAgICAgKiAgICAgb3BlbmlkOiDvvIjlj6/ml6DvvIlcbiAgICAgKiAgICAgcGFnZTogbnVtYmVyXG4gICAgICogICAgIHNraXA6IG51bWJlclxuICAgICAqICAgICB0eXBlOiDmiJHnmoTlhajpg6ggfCDmnKrku5jmrL7orqLljZUgfCDlvoXlj5HotKcgfCDlt7LlrozmiJAgfCDnrqHnkIblkZjvvIjooYznqIvorqLljZXvvIl8IOeuoeeQhuWRmO+8iOaJgOacieiuouWNle+8iVxuICAgICAqICAgICB0eXBlOiBteS1hbGwgfCBteS1ub3RwYXkgfCBteS1kZWxpdmVyIHwgbXktZmluaXNoIHwgbWFuYWdlci10cmlwIHwgbWFuYWdlci1hbGxcbiAgICAgKiAgICAgcGFzc3VzZWRsZXNzOiB0cnVlIHwgZmFsc2UgfCB1bmRlZmluZWQg5piv5ZCm6L+H5ruk5o6J6L+H5pyf55qE6K6i5Y2VXG4gICAgICogfVxuICAgICAqICEg5pyq5LuY5qy+6K6i5Y2V77yacGF5X3N0YXR1czog5pyq5LuY5qy+L+W3suS7mOiuoumHkSDmiJYgdHlwZTogcHJlXG4gICAgICogISDlvoXlj5HotKfvvJpkZWxpdmVyX3N0YXR1c++8muacquWPkei0pyDkuJQgcGF5X3N0YXR1cyDlt7Lku5jmrL5cbiAgICAgKiAhIOW3suWujOaIkO+8mmRlbGl2ZXJfc3RhdHVz77ya5bey5Y+R6LSnIOS4lCBwYXlfc3RhdHVzIOW3suS7mOWFqOasvlxuICAgICAqL1xuICAgIGFwcC5yb3V0ZXIoJ2xpc3QnLCBhc3luYyggY3R4LCBuZXh0ICkgPT4ge1xuICAgICAgICB0cnkge1xuXG4gICAgICAgICAgICBsZXQgd2hlcmUkID0geyB9O1xuICAgICAgICAgICAgY29uc3QgeyB0eXBlLCB0aWQsIHBhc3N1c2VkbGVzcyB9ID0gZXZlbnQuZGF0YTtcblxuICAgICAgICAgICAgLy8g5p+l6K+i5p2h5pWwXG4gICAgICAgICAgICBjb25zdCBsaW1pdCA9IHRpZCA/IDk5IDogMTA7XG5cbiAgICAgICAgICAgIGNvbnN0IG9wZW5pZCA9IGV2ZW50LmRhdGEub3BlbmlkIHx8IGV2ZW50LnVzZXJJbmZvLm9wZW5JZDtcblxuXG4gICAgICAgICAgICAvLyDmiJHnmoTlhajpg6hcbiAgICAgICAgICAgIGlmICggdHlwZSA9PT0gJ215LWFsbCcgKSB7XG4gICAgICAgICAgICAgICAgd2hlcmUkID0ge1xuICAgICAgICAgICAgICAgICAgICBvcGVuaWQ6IG9wZW5pZFxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8g5pyq5LuY5qy+XG4gICAgICAgICAgICB9IGVsc2UgaWYgKCB0eXBlID09PSAnbXktbm90cGF5JyApIHtcbiAgICAgICAgICAgICAgICB3aGVyZSQgPSBfLmFuZCh7XG4gICAgICAgICAgICAgICAgICAgIG9wZW5pZCxcbiAgICAgICAgICAgICAgICAgICAgYmFzZV9zdGF0dXM6ICcyJ1xuICAgICAgICAgICAgICAgIH0sIF8ub3IoW1xuICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiAncHJlJ1xuICAgICAgICAgICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgICAgICAgICBwYXlfc3RhdHVzOiBfLm9yKCBfLmVxKCcwJyksIF8uZXEoJzEnKSlcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIF0pKTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgLy8g5pyq5Y+R6LSnXG4gICAgICAgICAgICB9IGVsc2UgaWYgKCB0eXBlID09PSAnbXktZGVsaXZlJyApIHtcbiAgICAgICAgICAgICAgICB3aGVyZSQgPSB7XG4gICAgICAgICAgICAgICAgICAgIG9wZW5pZCxcbiAgICAgICAgICAgICAgICAgICAgcGF5X3N0YXR1czogJzInLFxuICAgICAgICAgICAgICAgICAgICBkZWxpdmVyX3N0YXR1czogJzAnXG4gICAgICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgLy8g5bey5a6M5oiQXG4gICAgICAgICAgICB9IGVsc2UgaWYgKCB0eXBlID09PSAnbXktZmluaXNoJyApIHtcbiAgICAgICAgICAgICAgICB3aGVyZSQgPSB7XG4gICAgICAgICAgICAgICAgICAgIG9wZW5pZCxcbiAgICAgICAgICAgICAgICAgICAgcGF5X3N0YXR1czogJzInLFxuICAgICAgICAgICAgICAgICAgICBkZWxpdmVyX3N0YXR1czogJzEnXG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8g6L+H5ruk5o6J6L+H5pyf6K6i5Y2VXG4gICAgICAgICAgICBpZiAoIHBhc3N1c2VkbGVzcyAhPT0gZmFsc2UgKSB7XG4gICAgICAgICAgICAgICAgd2hlcmUkID0gT2JqZWN0LmFzc2lnbih7IH0sIHdoZXJlJCwge1xuICAgICAgICAgICAgICAgICAgICBiYXNlX3N0YXR1czogXy5uZXEoJzUnKVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyDooYznqIvorqLljZVcbiAgICAgICAgICAgIGlmICggdGlkICkge1xuICAgICAgICAgICAgICAgIHdoZXJlJCA9IE9iamVjdC5hc3NpZ24oeyB9LCB3aGVyZSQsIHtcbiAgICAgICAgICAgICAgICAgICAgdGlkXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIOiOt+WPluaAu+aVsFxuICAgICAgICAgICAgY29uc3QgdG90YWwkID0gYXdhaXQgZGIuY29sbGVjdGlvbignb3JkZXInKVxuICAgICAgICAgICAgICAgIC53aGVyZSggd2hlcmUkIClcbiAgICAgICAgICAgICAgICAuY291bnQoICk7XG5cbiAgICAgICAgICAgIC8vIOiOt+WPluiuouWNleaVsOaNrlxuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiAhIOWmguaenOaYr+acieaMh+WumnRpZOeahO+8jOWImeS4jemcgOimgWxpbWl05LqG77yM55u05o6l5ouJ5Y+W6KGM56iL5omA5pyJ55qE6K6i5Y2VXG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIGNvbnN0IGRhdGEkID0gYXdhaXQgZGIuY29sbGVjdGlvbignb3JkZXInKVxuICAgICAgICAgICAgICAgIC53aGVyZSggd2hlcmUkIClcbiAgICAgICAgICAgICAgICAub3JkZXJCeSgnY3JlYXRlVGltZScsICdkZXNjJylcbiAgICAgICAgICAgICAgICAubGltaXQoIGxpbWl0IClcbiAgICAgICAgICAgICAgICAuc2tpcCggZXZlbnQuZGF0YS5za2lwIHx8ICggZXZlbnQuZGF0YS5wYWdlIC0gMSApICogbGltaXQgKVxuICAgICAgICAgICAgICAgIC5nZXQoICk7XG5cbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogISDnlLHkuo7mn6Xor6LmmK/mjInliIbpobXvvIzkvYbmmK/mmL7npLrmmK/mjInooYznqIvmnaXogZrlkIjmmL7npLpcbiAgICAgICAgICAgICAqICEg5Zug5q2k5pyJ5Y+v6IO977yMTumhteacgOWQjuS4gOS9je+8jOi3n04rMemhteesrOS4gOS9jeS+neeEtuWxnuS6juWQjOS4gOihjOeoi1xuICAgICAgICAgICAgICogISDlpoLkuI3ov5vooYzlpITnkIbvvIzlrqLmiLfmn6Xor6LorqLljZXliJfooajmmL7npLrooYznqIvorqLljZXml7bvvIzkvJrigJzmnInlj6/og73igJ3mmL7npLrkuI3lhahcbiAgICAgICAgICAgICAqICEg54m55q6K5aSE55CG77ya55So5pyA5ZCO5LiA5L2N55qEdGlk77yM5p+l6K+i5pyA5ZCO5LiA5L2N5Lul5ZCO5ZCMdGlk55qEb3JkZXLvvIznhLblkI7kv67mraPmiYDov5Tlm57nmoRwYWdlXG4gICAgICAgICAgICAgKi9cblxuICAgICAgICAgICAgY29uc3QgbGFzdCA9IGRhdGEkLmRhdGFbIGRhdGEkLmRhdGEubGVuZ3RoIC0gMSBdO1xuXG4gICAgICAgICAgICBsZXQgZml4JDogYW55ID0ge1xuICAgICAgICAgICAgICAgIGRhdGE6IFsgXVxuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgLy8g5aaC5p6c5rKh5pyJdGlk5Y+C5pWw77yM5omN5Y675YGaZml455qE5Yqo5L2cXG4gICAgICAgICAgICBpZiAoIGxhc3QgJiYgIXRpZCApIHsgXG4gICAgICAgICAgICAgICAgZml4JCA9IGF3YWl0IGRiLmNvbGxlY3Rpb24oJ29yZGVyJylcbiAgICAgICAgICAgICAgICAgICAgLndoZXJlKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG9wZW5pZCxcbiAgICAgICAgICAgICAgICAgICAgICAgIHRpZDogbGFzdC50aWQsXG4gICAgICAgICAgICAgICAgICAgICAgICBiYXNlX3N0YXR1czogXy5uZXEoJzUnKVxuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAub3JkZXJCeSgnY3JlYXRlVGltZScsICdkZXNjJylcbiAgICAgICAgICAgICAgICAgICAgLnNraXAoIGV2ZW50LmRhdGEuc2tpcCA/IGV2ZW50LmRhdGEuc2tpcCArIGRhdGEkLmRhdGEubGVuZ3RoIDogKCBldmVudC5kYXRhLnBhZ2UgLSAxICkgKiBsaW1pdCArIGRhdGEkLmRhdGEubGVuZ3RoIClcbiAgICAgICAgICAgICAgICAgICAgLmdldCggKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgY29uc3QgbWV0YSA9IFsgLi4uZGF0YSQuZGF0YSwgLi4uZml4JC5kYXRhIF07XG5cbiAgICAgICAgICAgIC8vIOi/memHjOeahOihjOeoi+ivpuaDheeUqCBuZXcgU2V055qE5pa55byP5p+l6K+iXG4gICAgICAgICAgICBjb25zdCB0cmlwSWRzID0gQXJyYXkuZnJvbShcbiAgICAgICAgICAgICAgICBuZXcgU2V0KCBtZXRhLm1hcCggbSA9PiBtLnRpZCApKVxuICAgICAgICAgICAgKTtcblxuICAgICAgICAgICAgY29uc3QgdHJpcHMkID0gYXdhaXQgUHJvbWlzZS5hbGwoIHRyaXBJZHMubWFwKCB0aWQgPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiBkYi5jb2xsZWN0aW9uKCd0cmlwJylcbiAgICAgICAgICAgICAgICAgICAgLndoZXJlKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIF9pZDogdGlkXG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgIC5nZXQoICk7XG4gICAgICAgICAgICB9KSk7XG4gICAgIFxuICAgICAgICAgICAgLy8g6IGa5ZCI6KGM56iL5pWw5o2uXG4gICAgICAgICAgICBjb25zdCBtZXRhMiA9IG1ldGEubWFwKCggeCwgaSApID0+IE9iamVjdC5hc3NpZ24oeyB9LCB4LCB7XG4gICAgICAgICAgICAgICAgLy8gdHJpcDogdHJpcHMkWyBpIF0uZGF0YVsgMCBdXG4gICAgICAgICAgICAgICAgdHJpcDogKHRyaXBzJC5maW5kKCB5ID0+IHkuZGF0YVsgMCBdLl9pZCA9PT0geC50aWQgKSBhcyBhbnkpLmRhdGFbIDAgXVxuICAgICAgICAgICAgfSkpO1xuXG4gICAgICAgICAgICByZXR1cm4gY3R4LmJvZHkgPSB7XG4gICAgICAgICAgICAgICAgc3RhdHVzOiAyMDAsXG4gICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgICBkYXRhOiBtZXRhMixcbiAgICAgICAgICAgICAgICAgICAgcGFnZVNpemU6IGxpbWl0LFxuICAgICAgICAgICAgICAgICAgICB0b3RhbDogdG90YWwkLnRvdGFsLFxuICAgICAgICAgICAgICAgICAgICBwYWdlOiBmaXgkLmRhdGEubGVuZ3RoID09PSAwID8gZXZlbnQuZGF0YS5wYWdlIDogZXZlbnQuZGF0YS5wYWdlICsgTWF0aC5jZWlsKCBmaXgkLmRhdGEubGVuZ3RoIC8gbGltaXQgKSxcbiAgICAgICAgICAgICAgICAgICAgY3VycmVudDogZXZlbnQuZGF0YS5za2lwID8gZXZlbnQuZGF0YS5za2lwICsgbWV0YS5sZW5ndGggOiAoIGV2ZW50LmRhdGEucGFnZSAtIDEgKSAqIGxpbWl0ICsgbWV0YS5sZW5ndGgsXG4gICAgICAgICAgICAgICAgICAgIHRvdGFsUGFnZTogTWF0aC5jZWlsKCB0b3RhbCQudG90YWwgLyBsaW1pdCApXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgXG4gICAgICAgIH0gY2F0Y2ggKCBlICkgeyByZXR1cm4gY3R4LmJvZHkgPSB7IHN0YXR1czogNTAwfTt9XG4gICAgfSlcblxuICAgIC8qKlxuICAgICAqIOaJuemHj+abtOaWsO+8jOiuouWNleS4uuW3suaUr+S7mOOAjOiuoumHkeOAjeaIluOAjOWFqOasvuOAje+8jOW5tuS4lOWinuWKoOWIsOi0reeJqea4heWNlVxuICAgICAqIFxuICAgICAqIOW5tuaOqOmAgeebuOWFs+S5sOWutlxuICAgICAqIOW5tuaOqOmAgeebuOWFs+KAnOe+pOWPi+KAnVxuICAgICAqIHtcbiAgICAgKiAgICAgIG9yZGVyc++8iOaVsOe7hO+8ieadpeiHquS6juWVhuWTgeivpuaDhe+8iOS7mOWFqOasvuOAgeS7heS7mOiuoumHke+8iVxuICAgICAqICAgICAgb3JkZXJz77yIc3RyaW5n77yJ5p2l6Ieq5LqO6K6i5Y2V5YiX6KGo77yI5LuF5LuY6K6i6YeR77yJXG4gICAgICogICAgICBvcmRlcnM6IFwiMTExLDIyMiwzMzNcIiB8IHtcbiAgICAgKiAgICAgICAgIHVzZWRfaW50ZWdyYWw6IHh4eFxuICAgICAqICAgICAgICAgcGF5X3N0YXR1czogJzEnIHwgJzInLFxuICAgICAqICAgICAgICAgb2lkOiBzdHJpbmdcbiAgICAgKiAgICAgIH1bIF1cbiAgICAgKiAgICAgIHRpZD9cbiAgICAgKiAgICAgIGZvcm1faWQsXG4gICAgICogICAgICBwcmVwYXlfaWRcbiAgICAgKiB9XG4gICAgICovXG4gICAgYXBwLnJvdXRlcigndXBhZHRlLXRvLXBheWVkJywgYXN5bmMoIGN0eCwgbmV4dCApID0+IHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGNvbnN0IG9wZW5pZCA9IGV2ZW50LmRhdGEub3BlbklkIHx8IGV2ZW50LmRhdGEub3BlbmlkIHx8IGV2ZW50LnVzZXJJbmZvLm9wZW5JZDtcbiAgICAgICAgICAgIGNvbnN0IG9wZW5JZCA9IG9wZW5pZDtcbiAgICAgICAgICAgIGNvbnN0IHsgb3JkZXJzLCB0aWQsIHByZXBheV9pZCwgZm9ybV9pZCB9ID0gZXZlbnQuZGF0YTtcbiAgICAgICAgICAgIGNvbnN0IG9yZGVySWRzID0gQXJyYXkuaXNBcnJheSggb3JkZXJzICkgPyBcbiAgICAgICAgICAgICAgICBvcmRlcnMubWFwKCB4ID0+IHgub2lkICkuam9pbignLCcpIDogb3JkZXJzO1xuXG4gICAgICAgICAgICAvLyDmm7TmlrDorqLljZXlrZfmrrVcbiAgICAgICAgICAgIGlmICggQXJyYXkuaXNBcnJheSggb3JkZXJzICkpIHtcblxuICAgICAgICAgICAgICAgIGF3YWl0IFByb21pc2UuYWxsKCBvcmRlcnMubWFwKCBhc3luYyBvcmRlciA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHsgb2lkLCBwYXlfc3RhdHVzLCB1c2VkX2ludGVncmFsIH0gPSBvcmRlcjtcblxuICAgICAgICAgICAgICAgICAgICAvLyDmm7TmlrDnirbmgIFcbiAgICAgICAgICAgICAgICAgICAgYXdhaXQgZGIuY29sbGVjdGlvbignb3JkZXInKS5kb2MoIG9pZCApXG4gICAgICAgICAgICAgICAgICAgICAgICAudXBkYXRlKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvcm1faWQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHByZXBheV9pZCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGF5X3N0YXR1cyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdXNlZF9pbnRlZ3JhbFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgICAgIC8vIOS7mOWFqOasvlxuICAgICAgICAgICAgICAgICAgICBpZiAoIHBheV9zdGF0dXMgPT09ICcyJyApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGF3YWl0IGRiLmNvbGxlY3Rpb24oJ29yZGVyJykuZG9jKCBvaWQgKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC51cGRhdGUoe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZXBvc2l0UHJpY2U6IDBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSkpO1xuXG4gICAgICAgICAgICAgICAgLy8g5pu05paw55So5oi355qE5oq1546w6YeR5L2/55So5oOF5Ya1XG4gICAgICAgICAgICAgICAgaWYgKCAhIXRpZCApIHtcblxuICAgICAgICAgICAgICAgICAgICBjb25zdCBhbGxVc2VkSW50ZWdyYWwgPSBvcmRlcnMucmVkdWNlKCggeCwgeSApID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB4ICsgKCB5LnVzZWRfaW50ZWdyYWwgfHwgMCApXG4gICAgICAgICAgICAgICAgICAgIH0sIDAgKTtcblxuICAgICAgICAgICAgICAgICAgICBhd2FpdCBjbG91ZC5jYWxsRnVuY3Rpb24oe1xuICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogJ2NvbW1vbicsXG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJHVybDogJ3B1c2gtaW50ZWdyYWwtY3JlYXRlJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRpZCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb3BlbmlkLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZTogYWxsVXNlZEludGVncmFsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgYXdhaXQgUHJvbWlzZS5hbGwoIG9yZGVySWRzLnNwbGl0KCcsJykubWFwKCBvaWQgPT4ge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZGIuY29sbGVjdGlvbignb3JkZXInKS5kb2MoIG9pZCApXG4gICAgICAgICAgICAgICAgICAgICAgICAudXBkYXRlKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvcm1faWQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHByZXBheV9pZCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGF5X3N0YXR1czogJzEnXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfSkpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyDliJvlu7ov5o+S5YWl5Yiw6LSt54mp5riF5Y2VXG4gICAgICAgICAgICBjb25zdCBmaW5kJDogYW55ID0gYXdhaXQgUHJvbWlzZS5hbGwoIG9yZGVySWRzLnNwbGl0KCcsJykubWFwKCBvaWQgPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiBkYi5jb2xsZWN0aW9uKCdvcmRlcicpXG4gICAgICAgICAgICAgICAgICAgIC53aGVyZSh7XG4gICAgICAgICAgICAgICAgICAgICAgICBfaWQ6IG9pZFxuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAuZ2V0KCApO1xuICAgICAgICAgICAgfSkpO1xuXG4gICAgICAgICAgICAvLyDorqLljZXliJfooahcbiAgICAgICAgICAgIGNvbnN0IGxpc3QgPSBmaW5kJC5tYXAoIHggPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IHsgX2lkLCB0aWQsIHBpZCwgc2lkLCBwcmljZSwgZ3JvdXBQcmljZSwgYWNpZCB9ID0geC5kYXRhWyAwIF07XG4gICAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICAgICAgb2lkOiBfaWQsXG4gICAgICAgICAgICAgICAgICAgIGFjaWQsIGdyb3VwUHJpY2UsXG4gICAgICAgICAgICAgICAgICAgIHRpZCwgcGlkLCBzaWQsIHByaWNlXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIGNvbnN0IGNyZWF0ZSQgPSBhd2FpdCBjbG91ZC5jYWxsRnVuY3Rpb24oe1xuICAgICAgICAgICAgICAgIG5hbWU6ICdzaG9wcGluZy1saXN0JyxcbiAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICAgICR1cmw6ICdjcmVhdGUnLFxuICAgICAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBsaXN0LFxuICAgICAgICAgICAgICAgICAgICAgICAgb3BlbklkXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgLy8g5aSE55CG6LSt5Lmw55u45YWz55qE5o6o6YCBXG4gICAgICAgICAgICBpZiAoIGNyZWF0ZSQucmVzdWx0LnN0YXR1cyA9PT0gMjAwICkge1xuICAgICAgICAgICAgICAgIGNvbnN0IHsgYnV5ZXIsIG90aGVycyB9ID0gY3JlYXRlJC5yZXN1bHQuZGF0YTtcblxuICAgICAgICAgICAgICAgIC8vIOS5sOWutuaOqOmAgVxuICAgICAgICAgICAgICAgIGNvbnN0IHB1c2hNZSQgPSBhd2FpdCBjbG91ZC5jYWxsRnVuY3Rpb24oe1xuICAgICAgICAgICAgICAgICAgICBuYW1lOiAnY29tbW9uJyxcbiAgICAgICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgICAgICAgJHVybDogJ3B1c2gtc3Vic2NyaWJlJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiBidXllci50eXBlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9wZW5pZDogYnV5ZXIub3BlbmlkLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRleHRzOiBnZXRUZXh0QnlQdXNoVHlwZSggXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJ1eWVyLnR5cGUgPT09ICdidXlQaW4nID8gJ2J1eVBpbjEnIDogYnV5ZXIudHlwZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnV5ZXIuZGVsdGEgKVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICAvLyDlhbbku5bkurrmi7zlm6LmiJDlip/nmoTmjqjpgIFcbiAgICAgICAgICAgICAgICBjb25zdCBvdGhlcnNPcmRlcnMkOiBhbnkgPSBhd2FpdCBQcm9taXNlLmFsbChcbiAgICAgICAgICAgICAgICAgICAgb3RoZXJzLm1hcCggXG4gICAgICAgICAgICAgICAgICAgICAgICBvdGhlciA9PiBkYi5jb2xsZWN0aW9uKCdvcmRlcicpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLndoZXJlKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb3BlbmlkOiBvdGhlci5vcGVuaWQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFjaWQ6IG90aGVyLmFjaWQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNpZDogb3RoZXIuc2lkLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwaWQ6IG90aGVyLnBpZCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGlkOiBvdGhlci50aWQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBheV9zdGF0dXM6ICcxJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYmFzZV9zdGF0dXM6IF8ub3IoIF8uZXEoJzAnKSwgXy5lcSgnMScpLCBfLmVxKCcyJykpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAuZmllbGQoe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb3VudDogdHJ1ZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLmdldCggKVxuICAgICAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgICAgKTtcblxuICAgICAgICAgICAgICAgIC8vIOaVtOWQiGRlbHRhICsgY291bnRcbiAgICAgICAgICAgICAgICBjb25zdCBvdGhlcnNNb3JlID0gb3RoZXJzLm1hcCgoIG90aGVyLCBrZXkgKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAuLi5vdGhlcixcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvdW50OiBvdGhlcnNPcmRlcnMkWyBrZXkgXS5kYXRhLnJlZHVjZSgoIHgsIHkgKSA9PiB5LmNvdW50ICsgeCwgMCApXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgIGxldCBvdGhlcnNQdXNoID0geyB9O1xuXG4gICAgICAgICAgICAgICAgb3RoZXJzTW9yZS5tYXAoIG90aGVyID0+IHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCAhb3RoZXJzUHVzaFsgb3RoZXIub3BlbmlkIF0pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG90aGVyc1B1c2ggPSBPYmplY3QuYXNzaWduKHsgfSwgb3RoZXJzUHVzaCwge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFsgb3RoZXIub3BlbmlkIF06IG90aGVyLmRlbHRhICogb3RoZXIuY291bnRcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgb3RoZXJzUHVzaCA9IE9iamVjdC5hc3NpZ24oeyB9LCBvdGhlcnNQdXNoLCB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgWyBvdGhlci5vcGVuaWQgXTogb3RoZXJzUHVzaFsgb3RoZXIub3BlbmlkIF0gKyBvdGhlci5kZWx0YSAqIG90aGVyLmNvdW50XG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgLy8g5YW25LuW5Lq65ou85Zui5oiQ5Yqf55qE5o6o6YCBXG4gICAgICAgICAgICAgICAgYXdhaXQgUHJvbWlzZS5hbGwoXG4gICAgICAgICAgICAgICAgICAgIE9iamVjdC5rZXlzKCBvdGhlcnNQdXNoICkubWFwKFxuICAgICAgICAgICAgICAgICAgICAgICAgb3RoZXJPcGVuaWQgPT4gY2xvdWQuY2FsbEZ1bmN0aW9uKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiAnY29tbW9uJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICR1cmw6ICdwdXNoLXN1YnNjcmliZScsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6ICdidXlQaW4nLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb3BlbmlkOiBvdGhlck9wZW5pZCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRleHRzOiBnZXRUZXh0QnlQdXNoVHlwZSggJ2J1eVBpbjInLCBvdGhlcnNQdXNoWyBvdGhlck9wZW5pZCBdKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICAgICk7XG5cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8g5p+l55yLYXBwLWNvbmZpZ+enr+WIhuaOqOW5v+aYr+WQpuW8gOWQr1xuICAgICAgICAgICAgY29uc3QgYXBwQ29uZiQgPSBhd2FpdCBkYi5jb2xsZWN0aW9uKCdhcHAtY29uZmlnJylcbiAgICAgICAgICAgICAgICAud2hlcmUoe1xuICAgICAgICAgICAgICAgICAgICB0eXBlOiAnZ29vZC1pbnRlZ3JhbC1zaGFyZSdcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIC5nZXQoICk7XG4gICAgICAgICAgICBjb25zdCBhcHBDb25mID0gYXBwQ29uZiQuZGF0YVsgMCBdO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICBpZiAoICEhYXBwQ29uZi52YWx1ZSApIHtcbiAgICAgICAgICAgICAgICAvLyDmib7lh7rmiYDmnInnmoTmjqjlub/orrDlvZVcbiAgICAgICAgICAgICAgICBjb25zdCBwdXNoZXJzJDogYW55ID0gYXdhaXQgUHJvbWlzZS5hbGwoXG4gICAgICAgICAgICAgICAgICAgIGxpc3QubWFwKCBhc3luYyggeCwgayApID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHB1c2hSZWNvcmQkID0gYXdhaXQgZGIuY29sbGVjdGlvbignc2hhcmUtcmVjb3JkJylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAud2hlcmUoe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwaWQ6IHgucGlkLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvcGVuaWQ6IG9wZW5JZCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaXNTdWNjZXNzOiBmYWxzZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLmdldCggKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLi4ucHVzaFJlY29yZCQuZGF0YVsgMCBdLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHByaWNlOiBsaXN0WyBrIF0ucHJpY2UsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcHVzaElkOiBwdXNoUmVjb3JkJC5kYXRhWyAwIF0gPyBwdXNoUmVjb3JkJC5kYXRhWyAwIF0uX2lkIDogJydcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICApO1xuXG4gICAgICAgICAgICAgICAgLy8g5om+5Ye65omA5pyJ55qE5o6o5bm/6ICFXG4gICAgICAgICAgICAgICAgY29uc3QgcHVzaGVyczogYW55ID0gWyBdO1xuICAgICAgICAgICAgICAgIHB1c2hlcnMkXG4gICAgICAgICAgICAgICAgICAgIC5maWx0ZXIoIHggPT4gISF4LmZyb20gKVxuICAgICAgICAgICAgICAgICAgICAubWFwKCB4ID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGluZGV4ID0gcHVzaGVycy5maW5kSW5kZXgoIHkgPT4geS5mcm9tID09PSB4LmZyb20gKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICggaW5kZXggIT09IC0xICkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IG9yaWdpbiA9IHB1c2hlcnNbIGluZGV4IF07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcHVzaGVycy5zcGxpY2UoIGluZGV4LCAxLCB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC4uLm9yaWdpbixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJpY2U6IE51bWJlcigoIHgucHJpY2UgKyBvcmlnaW4ucHJpY2UgKS50b0ZpeGVkKCAyICkpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHB1c2hlcnMucHVzaCh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZyb206IHguZnJvbSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJpY2U6IHgucHJpY2UsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHB1c2hJZDogeC5wdXNoSWRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgIGNvbnN0IGFwcENvbmYyJCA9IGF3YWl0IGRiLmNvbGxlY3Rpb24oJ2FwcC1jb25maWcnKVxuICAgICAgICAgICAgICAgICAgICAud2hlcmUoe1xuICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogJ3B1c2gtaW50ZWdyYWwtZ2V0LXJhdGUnXG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgIC5nZXQoICk7XG4gICAgICAgICAgICAgICAgY29uc3QgYXBwQ29uZjIgPSBhcHBDb25mMiQuZGF0YVsgMCBdO1xuICAgICAgICAgICAgICAgIGNvbnN0IGludGVncmFsUmF0ZSA9IGFwcENvbmYyLnZhbHVlIHx8IDAuMDU7XG5cbiAgICAgICAgICAgICAgICBhd2FpdCBQcm9taXNlLmFsbChcbiAgICAgICAgICAgICAgICAgICAgcHVzaGVycy5tYXAoIGFzeW5jIHB1c2hlciA9PiB7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIOaOqOW5v+enr+WIhuavlOS+iyA1JVxuICAgICAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBpbnRlZ3JhbCA9IE51bWJlcigoIHB1c2hlci5wcmljZSAqIGludGVncmFsUmF0ZSApLnRvRml4ZWQoIDEgKSk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIOiusOW9leaOqOW5v+iAheenr+WIhlxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgdXNlciQgPSBhd2FpdCBkYi5jb2xsZWN0aW9uKCd1c2VyJylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAud2hlcmUoe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvcGVuaWQ6IHB1c2hlci5mcm9tXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAuZ2V0KCApO1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgdXNlciA9IHVzZXIkLmRhdGFbIDAgXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHVzZXJpZCA9IHVzZXIuX2lkO1xuICAgICAgICAgICAgICAgICAgICAgICAgZGVsZXRlIHVzZXJbJ19pZCddO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBhd2FpdCBkYi5jb2xsZWN0aW9uKCd1c2VyJylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAuZG9jKCBTdHJpbmcoIHVzZXJpZCApKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5zZXQoe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAuLi51c2VyLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcHVzaF9pbnRlZ3JhbDogdXNlci5wdXNoX2ludGVncmFsID8gXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgTnVtYmVyKCh1c2VyLnB1c2hfaW50ZWdyYWwgKyBpbnRlZ3JhbCkudG9GaXhlZCggMSApKSA6IFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGludGVncmFsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgLy8g5aSE55CG5o6o5bm/6ICF55u45YWz55qE5o6o6YCBXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBwdXNoJCA9IGF3YWl0IGNsb3VkLmNhbGxGdW5jdGlvbih7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogJ2NvbW1vbicsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAkdXJsOiAncHVzaC1zdWJzY3JpYmUnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiAnaG9uZ2JhbycsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvcGVuaWQ6IHB1c2hlci5mcm9tLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8g56ev5YiG6aG16Z2iXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYWdlOiAncGFnZXMvZ3JvdW5kLXB1c2gtaW50ZWdyYWwvaW5kZXgnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGV4dHM6IFtg5oGt5Zac77yB5L2g6I635b6XJHtpbnRlZ3JhbH3lhYPmirXnjrDph5HvvIFgLGDmnInmnIvlj4votK3kubDkuobkvaDmjqjlub/liIbkuqvnmoTllYblk4HvvZ5gXVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIOabtOaWsOaOqOW5v+eKtuaAgVxuICAgICAgICAgICAgICAgICAgICAgICAgYXdhaXQgZGIuY29sbGVjdGlvbignc2hhcmUtcmVjb3JkJylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAuZG9jKCBwdXNoZXIucHVzaElkIClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAudXBkYXRlKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaXNTdWNjZXNzOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3VjY2Vzc1RpbWU6IGdldE5vdyggdHJ1ZSApXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiBjdHguYm9keSA9IHtcbiAgICAgICAgICAgICAgICBzdGF0dXM6IDIwMFxuICAgICAgICAgICAgfVxuXG4gICAgICAgIH0gY2F0Y2ggKCBlICkgeyBcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCBlICk7XG4gICAgICAgICAgICByZXR1cm4gY3R4LmJvZHkgPSB7IHN0YXR1czogNTAwIH07XG4gICAgICAgIH0gXG4gICAgfSlcblxuICAgIC8qKiBcbiAgICAgKiBAZGVzY3JpcHRpb25cbiAgICAgKiDku6PotK3muIXluJDlgqzmrL7nmoTorqLljZXliJfooahcbiAgICAgKiB7XG4gICAgICogICAgIHRpZCBcbiAgICAgKiAgICAgbmVlZENvdXBvbnM6IGZhbHNlIHwgdHJ1ZSB8IHVuZGVmaW5lZFxuICAgICAqICAgICBuZWVkQWRkcmVzczogZmFsc2UgfCB0cnVlIHwgdW5kZWZpbmVkXG4gICAgICogfVxuICAgICAqL1xuICAgIGFwcC5yb3V0ZXIoJ2RhaWdvdS1saXN0JywgYXN5bmMoIGN0eCwgbmV4dCApID0+IHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGNvbnN0IHsgdGlkLCBuZWVkQ291cG9ucywgbmVlZEFkZHJlc3MgfSA9IGV2ZW50LmRhdGE7XG5cbiAgICAgICAgICAgIC8vIOmHh+i0rea4heWNlVxuICAgICAgICAgICAgY29uc3Qgc2hvcHBpbmdsaXN0JCA9IGF3YWl0IGRiLmNvbGxlY3Rpb24oJ3Nob3BwaW5nLWxpc3QnKVxuICAgICAgICAgICAgICAgIC53aGVyZSh7XG4gICAgICAgICAgICAgICAgICAgIHRpZFxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLmdldCggKTtcbiAgICAgICAgICAgIGNvbnN0IHNob3BwaW5nbGlzdCA9IHNob3BwaW5nbGlzdCQuZGF0YTtcblxuICAgICAgICAgICAgLy8g6K6i5Y2V5L+h5oGvXG4gICAgICAgICAgICBjb25zdCBvcmRlcnMkID0gYXdhaXQgZGIuY29sbGVjdGlvbignb3JkZXInKVxuICAgICAgICAgICAgICAgIC53aGVyZSh7XG4gICAgICAgICAgICAgICAgICAgIHRpZCxcbiAgICAgICAgICAgICAgICAgICAgYmFzZV9zdGF0dXM6IF8ubmVxKCc1JyksXG4gICAgICAgICAgICAgICAgICAgIHBheV9zdGF0dXM6IF8ub3IoIF8uZXEoJzEnKSwgXy5lcSgnMicpKVxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLmdldCggKTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgLy8g55So5oi35L+h5oGvXG4gICAgICAgICAgICBjb25zdCB1c2VycyQgPSBhd2FpdCBQcm9taXNlLmFsbChcbiAgICAgICAgICAgICAgICBBcnJheS5mcm9tKCBcbiAgICAgICAgICAgICAgICAgICAgbmV3IFNldCggb3JkZXJzJC5kYXRhXG4gICAgICAgICAgICAgICAgICAgICAgICAubWFwKCB4ID0+IHgub3BlbmlkIClcbiAgICAgICAgICAgICAgICApKVxuICAgICAgICAgICAgICAgIC5tYXAoIHVpZCA9PiBkYi5jb2xsZWN0aW9uKCd1c2VyJylcbiAgICAgICAgICAgICAgICAgICAgLndoZXJlKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG9wZW5pZDogdWlkXG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgIC5nZXQoICkpXG4gICAgICAgICAgICApO1xuXG4gICAgICAgICAgICAvLyDlv6vpgJLotLnnlKjkv6Hmga9cbiAgICAgICAgICAgIGNvbnN0IGRlbGl2ZXJmZWVzJCA9IGF3YWl0IFByb21pc2UuYWxsKFxuICAgICAgICAgICAgICAgIEFycmF5LmZyb20oIFxuICAgICAgICAgICAgICAgICAgICBuZXcgU2V0KCBvcmRlcnMkLmRhdGFcbiAgICAgICAgICAgICAgICAgICAgICAgIC5tYXAoIHggPT4geC5vcGVuaWQgKVxuICAgICAgICAgICAgICAgICkpXG4gICAgICAgICAgICAgICAgLm1hcCggdWlkID0+IGRiLmNvbGxlY3Rpb24oJ2RlbGl2ZXItZmVlJylcbiAgICAgICAgICAgICAgICAgICAgLndoZXJlKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRpZCxcbiAgICAgICAgICAgICAgICAgICAgICAgIG9wZW5pZDogdWlkXG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgIC5nZXQoICkpXG4gICAgICAgICAgICApO1xuXG4gICAgICAgICAgICAvLyDnp6/liIbmjqjlub/kvb/nlKjmg4XlhrVcbiAgICAgICAgICAgIGNvbnN0IHB1c2hJbnRlZ3JhbCQgPSBhd2FpdCBQcm9taXNlLmFsbChcbiAgICAgICAgICAgICAgICBBcnJheS5mcm9tKCBcbiAgICAgICAgICAgICAgICAgICAgbmV3IFNldCggb3JkZXJzJC5kYXRhXG4gICAgICAgICAgICAgICAgICAgICAgICAubWFwKCB4ID0+IHgub3BlbmlkIClcbiAgICAgICAgICAgICAgICApKVxuICAgICAgICAgICAgICAgIC5tYXAoIHVpZCA9PiBkYi5jb2xsZWN0aW9uKCdpbnRlZ3JhbC11c2UtcmVjb3JkJylcbiAgICAgICAgICAgICAgICAgICAgLndoZXJlKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRpZCxcbiAgICAgICAgICAgICAgICAgICAgICAgIG9wZW5pZDogdWlkLFxuICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogJ3B1c2hfaW50ZWdyYWwnXG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgIC5nZXQoICkpXG4gICAgICAgICAgICApO1xuXG4gICAgICAgICAgICAvLyDlnLDlnYDkv6Hmga9cbiAgICAgICAgICAgIGxldCBhZGRyZXNzJDogYW55ID0gWyBdO1xuICAgICAgICAgICAgaWYgKCAhIW5lZWRBZGRyZXNzIHx8IG5lZWRBZGRyZXNzID09PSB1bmRlZmluZWQgKSB7XG4gICAgICAgICAgICAgICAgYWRkcmVzcyQgPSBhd2FpdCBQcm9taXNlLmFsbChcbiAgICAgICAgICAgICAgICAgICAgQXJyYXkuZnJvbShcbiAgICAgICAgICAgICAgICAgICAgICAgIG5ldyBTZXQoIG9yZGVycyQuZGF0YVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5tYXAoIHggPT4geC5haWQgKVxuICAgICAgICAgICAgICAgICAgICApKVxuICAgICAgICAgICAgICAgICAgICAubWFwKCBhaWQgPT4gZGIuY29sbGVjdGlvbignYWRkcmVzcycpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5kb2MoIGFpZCApXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5nZXQoICkpXG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIFxuICAgICAgICAgICAgLy8g5Y2h5Yi45L+h5oGvXG4gICAgICAgICAgICBsZXQgY291cG9ucyQ6IGFueSA9IFsgXTtcbiAgICAgICAgICAgIGlmICggISFuZWVkQ291cG9ucyB8fCBuZWVkQ291cG9ucyA9PT0gdW5kZWZpbmVkICkge1xuICAgICAgICAgICAgICAgIGNvdXBvbnMkID0gYXdhaXQgUHJvbWlzZS5hbGwoXG4gICAgICAgICAgICAgICAgICAgIEFycmF5LmZyb20oXG4gICAgICAgICAgICAgICAgICAgICAgICBuZXcgU2V0KCBvcmRlcnMkLmRhdGEgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLm1hcCggeCA9PiB4Lm9wZW5pZCApXG4gICAgICAgICAgICAgICAgICAgICkpXG4gICAgICAgICAgICAgICAgICAgIC5tYXAoIG9wZW5pZCA9PiBkYi5jb2xsZWN0aW9uKCdjb3Vwb24nKVxuICAgICAgICAgICAgICAgICAgICAgICAgLndoZXJlKCBfLm9yKFtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRpZCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb3BlbmlkLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiBfLm9yKCBfLmVxKCd0X21hbmppYW4nKSwgXy5lcSgndF9saWppYW4nKSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9wZW5pZCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaXNVc2VkOiBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FuVXNlSW5OZXh0OiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiAndF9kYWlqaW4nXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgXSkpXG4gICAgICAgICAgICAgICAgICAgICAgICAuZ2V0KCApXG4gICAgICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgXG4gICAgICAgICAgICBjb25zdCB1c2VyT2RlcnMgPSB1c2VycyQubWFwKCggdXNlciQsIGsgKSA9PiB7XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgY29uc3QgdXNlciA9IHVzZXIkLmRhdGFbIDAgXTtcblxuICAgICAgICAgICAgICAgIGNvbnN0IG9yZGVycyA9IG9yZGVycyQuZGF0YVxuICAgICAgICAgICAgICAgICAgICAuZmlsdGVyKCB4ID0+IHgub3BlbmlkID09PSB1c2VyLm9wZW5pZCApXG4gICAgICAgICAgICAgICAgICAgIC5tYXAoIHggPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3Qgc2wgPSBzaG9wcGluZ2xpc3QuZmluZCggeSA9PiB5LnBpZCA9PT0geC5waWQgJiYgeS5zaWQgPT09IHguc2lkICk7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC4uLngsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FuR3JvdXA6IHNsIS51aWRzLmxlbmd0aCA+IDFcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICBjb25zdCBhZGRyZXNzID0gYWRkcmVzcyQubGVuZ3RoID4gMCA/XG4gICAgICAgICAgICAgICAgICAgIGFkZHJlc3MkXG4gICAgICAgICAgICAgICAgICAgICAgICAubWFwKCB4ID0+IHguZGF0YSApXG4gICAgICAgICAgICAgICAgICAgICAgICAuZmlsdGVyKCB4ID0+IHgub3BlbmlkID09PSB1c2VyLm9wZW5pZCApIDpcbiAgICAgICAgICAgICAgICAgICAgdW5kZWZpbmVkO1xuXG4gICAgICAgICAgICAgICAgY29uc3QgY291cG9ucyA9IGNvdXBvbnMkLmxlbmd0aCA+IDAgP1xuICAgICAgICAgICAgICAgICAgICBjb3Vwb25zJFxuICAgICAgICAgICAgICAgICAgICAgICAgLm1hcCggeCA9PiB4LmRhdGEgKVxuICAgICAgICAgICAgICAgICAgICAgICAgLmZpbHRlciggeCA9PiB4Lmxlbmd0aCA+IDAgJiYgeFsgMCBdLm9wZW5pZCA9PT0gdXNlci5vcGVuaWQgKSA6XG4gICAgICAgICAgICAgICAgICAgIHVuZGVmaW5lZDtcblxuICAgICAgICAgICAgICAgIGNvbnN0IGRlbGl2ZXJGZWUgPSBkZWxpdmVyZmVlcyRbIGsgXS5kYXRhWyAwIF0gfHwgMDtcblxuICAgICAgICAgICAgICAgIGNvbnN0IHB1c2hJbnRlZ3JhbCA9IChwdXNoSW50ZWdyYWwkWyBrIF0uZGF0YVsgMCBdIHx8IHsgfSkudmFsdWUgfHwgMDtcblxuICAgICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgICAgIHVzZXIsXG4gICAgICAgICAgICAgICAgICAgIG9yZGVycyxcbiAgICAgICAgICAgICAgICAgICAgYWRkcmVzcyxcbiAgICAgICAgICAgICAgICAgICAgZGVsaXZlckZlZSxcbiAgICAgICAgICAgICAgICAgICAgcHVzaEludGVncmFsLFxuICAgICAgICAgICAgICAgICAgICBjb3Vwb25zOiAoISFjb3Vwb25zICYmIGNvdXBvbnMubGVuZ3RoID4gMCApID8gY291cG9uc1sgMCBdIDogWyBdXG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICByZXR1cm4gY3R4LmJvZHkgPSB7XG4gICAgICAgICAgICAgICAgc3RhdHVzOiAyMDAsXG4gICAgICAgICAgICAgICAgZGF0YTogdXNlck9kZXJzXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfSBjYXRjaCAoIGUgKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyggJy4uLicsIGUgKTtcbiAgICAgICAgICAgIHJldHVybiBjdHguYm9keSA9IHsgc3RhdHVzOiA1MDAgfTtcbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgLyoqXG4gICAgICogQGRlc2NyaXB0aW9uXG4gICAgICog5LuO5riF5biQ5YKs5qy+77yM6LCD5pW06K6i5Y2V5YiG6YWN6YePXG4gICAgICoge1xuICAgICAqICAgICAgb2lkLCB0aWQsIHNpZCwgcGlkLCBjb3VudFxuICAgICAqIH1cbiAgICAgKi9cbiAgICBhcHAucm91dGVyKCdhZGp1c3QtY291bnQnLCBhc3luYyggY3R4LCBuZXh0ICkgPT4ge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgY29uc3Qgb3BlbmlkID0gZXZlbnQuZGF0YS5vcGVuSWQgfHwgZXZlbnQudXNlckluZm8ub3BlbklkOyBcbiAgICAgICAgICAgIGNvbnN0IHsgb2lkLCB0aWQsIHNpZCwgcGlkLCBjb3VudCB9ID0gZXZlbnQuZGF0YTtcblxuICAgICAgICAgICAgY29uc3QgZ2V0V3JvbmcgPSBtZXNzYWdlID0+IGN0eC5ib2R5ID0ge1xuICAgICAgICAgICAgICAgIG1lc3NhZ2UsXG4gICAgICAgICAgICAgICAgc3RhdHVzOiA0MDBcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiDmmK/lkKbog73nu6fnu63osIPmlbRcbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgY29uc3Qgb3JkZXIkID0gYXdhaXQgZGIuY29sbGVjdGlvbignb3JkZXInKVxuICAgICAgICAgICAgICAgIC5kb2MoIG9pZCApXG4gICAgICAgICAgICAgICAgLmdldCggKTtcblxuICAgICAgICAgICAgaWYgKCBvcmRlciQuZGF0YS5iYXNlX3N0YXR1cyA9PT0gJzInICkge1xuICAgICAgICAgICAgICAgIHJldHVybiBnZXRXcm9uZygn5YKs5qy+5ZCO5LiN6IO95L+u5pS55pWw6YePJyk7XG5cbiAgICAgICAgICAgIH0gZWxzZSBpZiAoIG9yZGVyJC5kYXRhLmJhc2Vfc3RhdHVzID09PSAnMCcgKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGdldFdyb25nKCfor7flhYjosIPmlbTor6XllYblk4Hku7fmoLwnKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiDkuI3og73lpJrkuo7muIXljZXliIbphY3nmoTmgLvotK3lhaXph49cbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgY29uc3Qgc2hvcHBpbmckID0gYXdhaXQgZGIuY29sbGVjdGlvbignc2hvcHBpbmctbGlzdCcpXG4gICAgICAgICAgICAgICAgLndoZXJlKHtcbiAgICAgICAgICAgICAgICAgICAgdGlkLCBzaWQsIHBpZFxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLmdldCggKTtcbiAgICAgICAgICAgIGNvbnN0IHNob3BwaW5nID0gc2hvcHBpbmckLmRhdGFbIDAgXTtcbiAgICAgICAgICAgIGNvbnN0IGxhc3RPcmRlcnMkID0gYXdhaXQgZGIuY29sbGVjdGlvbignb3JkZXInKVxuICAgICAgICAgICAgICAgIC53aGVyZSh7XG4gICAgICAgICAgICAgICAgICAgIHRpZCwgc2lkLCBwaWQsXG4gICAgICAgICAgICAgICAgICAgIHBheV9zdGF0dXM6IF8ubmVxKCcwJyksXG4gICAgICAgICAgICAgICAgICAgIGJhc2Vfc3RhdHVzOiBfLm9yKCBfLmVxKCcxJyksIF8uZXEoJzInKSwgXy5lcSgnMycpKVxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLmdldCggKTtcblxuICAgICAgICAgICAgY29uc3QgbGFzdE9yZGVycyA9IGxhc3RPcmRlcnMkLmRhdGE7XG4gICAgICAgICAgICBjb25zdCBvdGhlckNvdW50OiBhbnkgPSBsYXN0T3JkZXJzXG4gICAgICAgICAgICAgICAgLmZpbHRlciggbyA9PiBvLl9pZCAhPT0gb2lkIClcbiAgICAgICAgICAgICAgICAucmVkdWNlKCggeCwgeSApID0+IHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHggKyB5LmFsbG9jYXRlZENvdW50IHx8IDBcbiAgICAgICAgICAgICAgICB9LCAwICk7XG5cbiAgICAgICAgICAgIGlmICggY291bnQgKyBvdGhlckNvdW50ID4gc2hvcHBpbmcucHVyY2hhc2UgKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGdldFdyb25nKGDor6XllYblk4HmgLvmlbDph4/kuI3og73lpKfkuo7ph4fotK3mlbAke3Nob3BwaW5nLnB1cmNoYXNlfeS7tu+8gWApO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvKiog5pu05paw6K6i5Y2VICovXG4gICAgICAgICAgICBhd2FpdCBkYi5jb2xsZWN0aW9uKCdvcmRlcicpXG4gICAgICAgICAgICAgICAgLmRvYyggb2lkIClcbiAgICAgICAgICAgICAgICAudXBkYXRlKHtcbiAgICAgICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgICAgICAgYWxsb2NhdGVkQ291bnQ6IGNvdW50XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiDmm7TmlrDmuIXljZVcbiAgICAgICAgICAgICAqIOWwkeS6juaAu+i0reWFpemHj+aXtu+8jOmHjeaWsOiwg+aVtOa4heWNleeahOWJqeS9meWIhumFjemHj1xuICAgICAgICAgICAgICovXG4gICAgICAgICAgICBpZiAoIGNvdW50ICsgb3RoZXJDb3VudCA8IHNob3BwaW5nLnB1cmNoYXNlICkge1xuXG4gICAgICAgICAgICAgICAgY29uc3QgbmV3c2hvcHBpbmcgPSBPYmplY3QuYXNzaWduKHsgfSwgc2hvcHBpbmcsIHtcbiAgICAgICAgICAgICAgICAgICAgbGFzdEFsbG9jYXRlZDogc2hvcHBpbmcucHVyY2hhc2UgLSAoIGNvdW50ICsgb3RoZXJDb3VudCApXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgZGVsZXRlIG5ld3Nob3BwaW5nWydfaWQnXTtcblxuICAgICAgICAgICAgICAgIGF3YWl0IGRiLmNvbGxlY3Rpb24oJ3Nob3BwaW5nLWxpc3QnKVxuICAgICAgICAgICAgICAgICAgICAuZG9jKCBTdHJpbmcoIHNob3BwaW5nLl9pZCApKVxuICAgICAgICAgICAgICAgICAgICAuc2V0KHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRhdGE6IG5ld3Nob3BwaW5nXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gY3R4LmJvZHkgPSB7XG4gICAgICAgICAgICAgICAgc3RhdHVzOiAyMDBcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIFxuICAgICAgICB9IGNhdGNoICggZSApIHtcbiAgICAgICAgICAgIHJldHVybiBjdHguYm9keSA9IHsgc3RhdHVzOiA1MDAgfVxuICAgICAgICB9XG4gICAgfSlcblxuICAgIC8qKlxuICAgICAqIEBkZXNjcmlwdGlvblxuICAgICAqIOaJuemHj+WcsO+8muehruiupOWuouaIt+iuouWNleOAgeaYr+WQpuWboui0reOAgea2iOaBr+aOqOmAgeaTjeS9nFxuICAgICAqIHtcbiAgICAgKiAgICB0aWQsXG4gICAgICogICAgb3JkZXJzOiB7XG4gICAgICogICAgICAgIG9pZFxuICAgICAqICAgICAgICBwaWRcbiAgICAgKiAgICAgICAgc2lkXG4gICAgICogICAgICAgIG9wZW5pZFxuICAgICAqICAgICAgICBwcmVwYXlfaWRcbiAgICAgKiAgICAgICAgZm9ybV9pZFxuICAgICAqICAgICAgICBhbGxvY2F0ZWRDb3VudFxuICAgICAqICAgICAgICBhbGxvY2F0ZWRHcm91cFByaWNlXG4gICAgICogICAgfVsgXVxuICAgICAqICAgIG5vdGlmaWNhdGlvbjogeyBcbiAgICAgKiAgICAgICB0aXRsZSxcbiAgICAgKiAgICAgICBkZXNjLFxuICAgICAqICAgICAgIHRpbWVcbiAgICAgKiAgICB9XG4gICAgICogfVxuICAgICAqL1xuICAgIGFwcC5yb3V0ZXIoJ2JhdGNoLWFkanVzdCcsIGFzeW5jKCBjdHgsIG5leHQgKSA9PiB7XG4gICAgICAgIHRyeSB7XG5cbiAgICAgICAgICAgIC8qKiDmmK/lkKbog73mi7zlm6IgKi9cbiAgICAgICAgICAgIGxldCBjYW5Hcm91cFVzZXJNYXBDb3VudDoge1xuICAgICAgICAgICAgICAgIFsgazogc3RyaW5nIF0gOiBudW1iZXJcbiAgICAgICAgICAgIH0gPSB7IH07XG5cbiAgICAgICAgICAgIGNvbnN0IHsgdGlkLCBvcmRlcnMsIG5vdGlmaWNhdGlvbiB9ID0gZXZlbnQuZGF0YTtcbiAgICAgICAgICAgIGNvbnN0IGdldFdyb25nID0gbWVzc2FnZSA9PiBjdHguYm9keSA9IHtcbiAgICAgICAgICAgICAgICBtZXNzYWdlLFxuICAgICAgICAgICAgICAgIHN0YXR1czogNDAwXG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICBhd2FpdCBkYi5jb2xsZWN0aW9uKCd0cmlwJylcbiAgICAgICAgICAgICAgICAuZG9jKCB0aWQgKVxuICAgICAgICAgICAgICAgIC51cGRhdGUoe1xuICAgICAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpc0Nsb3NlZDogdHJ1ZVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgY29uc3QgdHJpcCQgPSBhd2FpdCBkYi5jb2xsZWN0aW9uKCd0cmlwJylcbiAgICAgICAgICAgICAgICAuZG9jKCB0aWQgKVxuICAgICAgICAgICAgICAgIC5nZXQoICk7XG4gICAgICAgICAgICBjb25zdCB0cmlwID0gdHJpcCQuZGF0YTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgaWYgKCB0cmlwLmNhbGxNb25leVRpbWVzICYmICB0cmlwLmNhbGxNb25leVRpbWVzID49IDMgKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGdldFdyb25nKGDlt7Lnu4/lj5Hotbfov4cke3RyaXAuY2FsbE1vbmV5VGltZXN95qyh5YKs5qy+YCk7XG5cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8g5pu05paw6K6i5Y2VXG4gICAgICAgICAgICBhd2FpdCBQcm9taXNlLmFsbCggb3JkZXJzLm1hcCggb3JkZXIgPT4ge1xuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIC8vIOacieWboui0reS7t+OAgeWkp+S6jjLkurrotK3kubDvvIzkuJTooqvliIbphY3mlbDlnYflpKfkuo4w77yM6K+l6K6i5Y2V5omN6L6+5Yiw4oCc5Zui6LSt4oCd55qE5p2h5Lu2XG4gICAgICAgICAgICAgICAgY29uc3QgY2FuR3JvdXAgPSAhIW9yZGVycy5maW5kKCBvID0+IHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG8ub2lkICE9PSBvcmRlci5vaWQgJiZcbiAgICAgICAgICAgICAgICAgICAgICAgIG8ub3BlbmlkICE9PSBvcmRlci5vcGVuaWQgJiYgXG4gICAgICAgICAgICAgICAgICAgICAgICBvLnBpZCA9PT0gb3JkZXIucGlkICYmIG8uc2lkID09PSBvcmRlci5zaWQgJiZcbiAgICAgICAgICAgICAgICAgICAgICAgIG8uYWxsb2NhdGVkQ291bnQgPiAwICYmIG9yZGVyLmFsbG9jYXRlZENvdW50ID4gMCAmJlxuICAgICAgICAgICAgICAgICAgICAgICAgISFvLmFsbG9jYXRlZEdyb3VwUHJpY2VcbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgIGlmICggY2FuR3JvdXAgKSB7XG4gICAgICAgICAgICAgICAgICAgIGNhbkdyb3VwVXNlck1hcENvdW50ID0gT2JqZWN0LmFzc2lnbih7IH0sIGNhbkdyb3VwVXNlck1hcENvdW50LCB7XG4gICAgICAgICAgICAgICAgICAgICAgICBbIG9yZGVyLm9wZW5pZCBdOiBjYW5Hcm91cFVzZXJNYXBDb3VudFsgb3JkZXIub3BlbmlkIF0gPT09IHVuZGVmaW5lZCA/IDEgOiBjYW5Hcm91cFVzZXJNYXBDb3VudFsgb3JkZXIub3BlbmlkIF0gKyAxXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHJldHVybiBkYi5jb2xsZWN0aW9uKCdvcmRlcicpXG4gICAgICAgICAgICAgICAgICAgIC5kb2MoIG9yZGVyLm9pZCApXG4gICAgICAgICAgICAgICAgICAgIC51cGRhdGUoe1xuICAgICAgICAgICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhbkdyb3VwLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJhc2Vfc3RhdHVzOiAnMidcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIH0pKTtcblxuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiAh5pu05paw6LSt54mp5riF5Y2VXG4gICAgICAgICAgICAgKi9cblxuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiDmtojmga/mjqjpgIFcbiAgICAgICAgICAgICAqICHmnKrku5jlhajmrL7miY3lj5HpgIFcbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgY29uc3QgdXNlcnMgPSBBcnJheS5mcm9tKFxuICAgICAgICAgICAgICAgIG5ldyBTZXQoXG4gICAgICAgICAgICAgICAgICAgIG9yZGVyc1xuICAgICAgICAgICAgICAgICAgICAgICAgLm1hcCggb3JkZXIgPT4gb3JkZXIub3BlbmlkIClcbiAgICAgICAgICAgICAgICAgICAgICAgIC5maWx0ZXIoIG9wZW5pZCA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuICEhb3JkZXJzLmZpbmQoIG9yZGVyID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG9yZGVyLm9wZW5pZCA9PT0gb3BlbmlkICYmIFN0cmluZyggb3JkZXIucGF5X3N0YXR1cyApID09PSAnMSdcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgKTtcblxuICAgICAgICAgICAgLyoqIOaOqOmAgemAmuefpSAqL1xuICAgICAgICAgICAgY29uc3QgcnMgPSBhd2FpdCBQcm9taXNlLmFsbCggdXNlcnMubWFwKCBvcGVuaWQgPT4ge1xuXG4gICAgICAgICAgICAgICAgY29uc3QgdGFyZ2V0ID0gb3JkZXJzLmZpbmQoIG9yZGVyID0+IG9yZGVyLm9wZW5pZCA9PT0gb3BlbmlkICYmXG4gICAgICAgICAgICAgICAgICAgICghIW9yZGVyLnByZXBheV9pZCB8fCAhIW9yZGVyLmZvcm1faWQgKSk7XG5cbiAgICAgICAgICAgICAgICAvLyByZXR1cm4gY2xvdWQuY2FsbEZ1bmN0aW9uKHtcbiAgICAgICAgICAgICAgICAvLyAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgIC8vICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgIC8vICAgICAgICAgICAgIHRvdXNlcjogb3BlbmlkLFxuICAgICAgICAgICAgICAgIC8vICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAvLyAgICAgICAgICAgICAgICAgdGl0bGU6IGNhbkdyb3VwVXNlck1hcENvdW50WyBTdHJpbmcoIG9wZW5pZCApXSA/XG4gICAgICAgICAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgICAvLyBg5ou85ZuiJHsgY2FuR3JvdXBVc2VyTWFwQ291bnRbIFN0cmluZyggb3BlbmlkICldfeS7tu+8geaCqOi0reS5sOeahOWVhuWTgeW3suWIsOi0p2AgOlxuICAgICAgICAgICAgICAgIC8vICAgICAgICAgICAgICAgICAgICAgLy8gJ+aCqOi0reS5sOeahOWVhuWTgeW3suWIsOi0pycsXG4gICAgICAgICAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgICAn5Yiw6LSn5ZWm77yB5LuY5bC+5qy+77yM56uL5Y2z5Y+R6LSnJyA6IFxuICAgICAgICAgICAgICAgIC8vICAgICAgICAgICAgICAgICAgICAgJ+WIsOi0p+WVpu+8geS7mOWwvuasvu+8jOeri+WNs+WPkei0pycsXG4gICAgICAgICAgICAgICAgLy8gICAgICAgICAgICAgICAgIHRpbWU6IGBb6KGM56iLXSR7dHJpcC50aXRsZX1gXG4gICAgICAgICAgICAgICAgLy8gICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAvLyAgICAgICAgICAgICBmb3JtX2lkOiB0YXJnZXQucHJlcGF5X2lkIHx8IHRhcmdldC5mb3JtX2lkXG4gICAgICAgICAgICAgICAgLy8gICAgICAgICB9LFxuICAgICAgICAgICAgICAgIC8vICAgICAgICAgJHVybDogJ25vdGlmaWNhdGlvbi1nZXRtb25leSdcbiAgICAgICAgICAgICAgICAvLyAgICAgfSxcbiAgICAgICAgICAgICAgICAvLyAgICAgbmFtZTogJ2NvbW1vbidcbiAgICAgICAgICAgICAgICAvLyB9KTtcblxuICAgICAgICAgICAgICAgIHJldHVybiBjbG91ZC5jYWxsRnVuY3Rpb24oe1xuICAgICAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb3BlbmlkLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6ICdnZXRNb25leScsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJlcGF5X2lkOiB0YXJnZXQucHJlcGF5X2lkLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRleHRzOiBbJ+aUr+S7mOWwvuasvu+8jOeri+WNs+WPkei0p+WTpicsJ+i2iuW/q+i2iuWlvSddLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhZ2U6ICdwYWdlcy9vcmRlci1saXN0L2luZGV4J1xuICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICR1cmw6ICdwdXNoLXN1YnNjcmliZSdcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgbmFtZTogJ2NvbW1vbidcbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgfSkpO1xuIFxuICAgICAgICAgICAgLy8g5pu05paw6KGM56iLXG4gICAgICAgICAgICBhd2FpdCBkYi5jb2xsZWN0aW9uKCd0cmlwJylcbiAgICAgICAgICAgICAgICAuZG9jKCB0aWQgKVxuICAgICAgICAgICAgICAgIC51cGRhdGUoe1xuICAgICAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjYWxsTW9uZXlUaW1lczogXy5pbmMoIDEgKVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHJldHVybiBjdHguYm9keSA9IHtcbiAgICAgICAgICAgICAgICBzdGF0dXM6IDIwMCxcbiAgICAgICAgICAgICAgICAvLyDliankvZnmrKHmlbBcbiAgICAgICAgICAgICAgICBkYXRhOiAzIC0gKCAxICsgdHJpcC5jYWxsTW9uZXlUaW1lcyApXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfSBjYXRjaCAoIGUgKSB7XG4gICAgICAgICAgICByZXR1cm4gY3R4LmJvZHkgPSB7IHN0YXR1czogNTAwIH07XG4gICAgICAgIH1cbiAgICB9KVxuXG4gICAgLyoqIFxuICAgICAqIEBkZXNjcmlwdGlvblxuICAgICAqIOiuouWNleS7mOWwvuasvlxuICAgICAqIHtcbiAgICAgKiAgICAgIHRpZFxuICAgICAqICAgICAgaW50ZWdyYWwgLy8g56ev5YiG5oC76aKd77yIdXNlcuihqO+8iVxuICAgICAqICAgICAgb3JkZXJzOiBbeyAgXG4gICAgICogICAgICAgICAgb2lkIC8vIOiuouWNleeKtuaAgVxuICAgICAqICAgICAgICAgIHBpZFxuICAgICAqICAgICAgICAgIGZpbmFsX3ByaWNlIC8vIOacgOe7iOaIkOS6pOminVxuICAgICAqICAgICAgICAgIGFsbG9jYXRlZENvdW50IC8vIOacgOe7iOaIkOS6pOmHj1xuICAgICAqICAgICAgfV1cbiAgICAgKiAgICAgIGNvdXBvbnM6IFsgLy8g5Y2h5Yi45raI6LS5XG4gICAgICogICAgICAgICAgaWQxLFxuICAgICAqICAgICAgICAgIGlkMi4uLlxuICAgICAqICAgICAgXSxcbiAgICAgKiAgICAgIHB1c2hfaW50ZWdyYWwgLy8g5L2/55So55qE5o6o5bm/56ev5YiGXG4gICAgICogfVxuICAgICAqL1xuICAgIGFwcC5yb3V0ZXIoJ3BheS1sYXN0JywgYXN5bmMoIGN0eCwgbmV4dCApID0+IHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGNvbnN0IG9wZW5pZCA9IGV2ZW50LnVzZXJJbmZvLm9wZW5JZDtcbiAgICAgICAgICAgIGNvbnN0IHsgdGlkLCBpbnRlZ3JhbCwgb3JkZXJzLCBjb3Vwb25zLCBwdXNoX2ludGVncmFsIH0gPSBldmVudC5kYXRhO1xuXG4gICAgICAgICAgICBjb25zdCB1c2VyJCA9IGF3YWl0IGRiLmNvbGxlY3Rpb24oJ3VzZXInKVxuICAgICAgICAgICAgICAgIC53aGVyZSh7XG4gICAgICAgICAgICAgICAgICAgIG9wZW5pZFxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLmdldCggKTtcbiAgICAgICAgICAgIGNvbnN0IHVzZXIgPSB1c2VyJC5kYXRhWyAwIF07XG4gICAgICAgICAgICBjb25zdCB1aWQgPSB1c2VyLl9pZDtcblxuICAgICAgICAgICAgLy8g6K6h566X5o6o5bm/56ev5YiGXG4gICAgICAgICAgICBjb25zdCBjYWxjdWxhdGVQdXNoSW50ZWdyYWwgPSB1c2VyLnB1c2hfaW50ZWdyYWwgLSBwdXNoX2ludGVncmFsID4gMCA/XG4gICAgICAgICAgICAgICAgdXNlci5wdXNoX2ludGVncmFsIC0gcHVzaF9pbnRlZ3JhbCA6IFxuICAgICAgICAgICAgICAgIDA7XG5cbiAgICAgICAgICAgIGNvbnN0IHNhdmVEYXRhID0ge1xuICAgICAgICAgICAgICAgIC4uLnVzZXIsXG4gICAgICAgICAgICAgICAgaW50ZWdyYWw6ICggdXNlci5pbnRlZ3JhbCB8fCAwICkgKyAoIGludGVncmFsIHx8IDAgKSxcbiAgICAgICAgICAgICAgICBwdXNoX2ludGVncmFsOiAhdXNlci5wdXNoX2ludGVncmFsID9cbiAgICAgICAgICAgICAgICAgICAgMCA6XG4gICAgICAgICAgICAgICAgICAgIGNhbGN1bGF0ZVB1c2hJbnRlZ3JhbFxuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgZGVsZXRlIHNhdmVEYXRhWydfaWQnXTtcblxuICAgICAgICAgICAgLy8g5aKe5Yqg56ev5YiG5oC76aKdXG4gICAgICAgICAgICAvLyDmirXmiaPmjqjlub/np6/liIZcbiAgICAgICAgICAgIGF3YWl0IGRiLmNvbGxlY3Rpb24oJ3VzZXInKVxuICAgICAgICAgICAgICAgIC5kb2MoIFN0cmluZyggdWlkICkpXG4gICAgICAgICAgICAgICAgLnNldCh7XG4gICAgICAgICAgICAgICAgICAgIGRhdGE6IHNhdmVEYXRhXG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIC8vIOaWsOWinuaOqOW5v+enr+WIhuS9v+eUqOiusOW9lVxuICAgICAgICAgICAgaWYgKCAhIXB1c2hfaW50ZWdyYWwgKSB7XG4gICAgICAgICAgICAgICAgYXdhaXQgY2xvdWQuY2FsbEZ1bmN0aW9uKHtcbiAgICAgICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRpZCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvcGVuaWQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU6IHB1c2hfaW50ZWdyYWxcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAkdXJsOiAncHVzaC1pbnRlZ3JhbC1jcmVhdGUnXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIG5hbWU6ICdjb21tb24nXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIOabtOaWsOiuouWNleeKtuaAgeOAgeWVhuWTgemUgOmHj1xuICAgICAgICAgICAgYXdhaXQgUHJvbWlzZS5hbGwoIG9yZGVycy5tYXAoIG9yZGVyID0+IHtcbiAgICAgICAgICAgICAgICByZXR1cm4gUHJvbWlzZS5hbGwoW1xuICAgICAgICAgICAgICAgICAgICBkYi5jb2xsZWN0aW9uKCdvcmRlcicpXG4gICAgICAgICAgICAgICAgICAgICAgICAuZG9jKCBvcmRlci5vaWQgKVxuICAgICAgICAgICAgICAgICAgICAgICAgLnVwZGF0ZSh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBiYXNlX3N0YXR1czogJzMnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXlfc3RhdHVzOiAnMicsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZpbmFsX3ByaWNlOiBvcmRlci5maW5hbF9wcmljZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGF5dGltZTogZ2V0Tm93KCB0cnVlIClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9KSxcbiAgICAgICAgICAgICAgICAgICAgZGIuY29sbGVjdGlvbignZ29vZHMnKVxuICAgICAgICAgICAgICAgICAgICAgICAgLmRvYyggb3JkZXIucGlkIClcbiAgICAgICAgICAgICAgICAgICAgICAgIC51cGRhdGUoe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2FsZWQ6IF8uaW5jKCBvcmRlci5hbGxvY2F0ZWRDb3VudCApXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICBdKVxuICAgICAgICAgICAgfSkpO1xuXG4gICAgICAgICAgICAvLyDmm7TmlrDljaHliLjkvb/nlKjnirbmgIFcbiAgICAgICAgICAgIGF3YWl0IFByb21pc2UuYWxsKCBjb3Vwb25zLm1hcCggY291cG9uaWQgPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiBkYi5jb2xsZWN0aW9uKCdjb3Vwb24nKVxuICAgICAgICAgICAgICAgICAgICAuZG9jKCBjb3Vwb25pZCApXG4gICAgICAgICAgICAgICAgICAgIC51cGRhdGUoe1xuICAgICAgICAgICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlzVXNlZDogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB1c2VkQnk6IHRpZCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYW5Vc2VJbk5leHQ6IGZhbHNlXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICB9KSk7XG5cbiAgICAgICAgICAgIC8vIOi+vuWIsOadoeS7tu+8jOWImemihuWPluS7o+mHkeWIuFxuICAgICAgICAgICAgLy8g5ZCM5pe25Yig6Zmk5LiK5LiA5Liq5pyq5L2/55So6L+H55qE5Luj6YeR5Yi4XG4gICAgICAgICAgICBjb25zdCB0cmlwJCA9IGF3YWl0IGRiLmNvbGxlY3Rpb24oJ3RyaXAnKVxuICAgICAgICAgICAgICAgIC5kb2MoIHRpZCApXG4gICAgICAgICAgICAgICAgLmdldCggKTtcblxuICAgICAgICAgICAgbGV0IHJlcSA9IHtcbiAgICAgICAgICAgICAgICByZXN1bHQ6IHtcbiAgICAgICAgICAgICAgICAgICAgc3RhdHVzOiA1MDBcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGNvbnN0IHsgY2FzaGNvdXBvbl9hdGxlYXN0LCBjYXNoY291cG9uX3ZhbHVlcyB9ID0gdHJpcCQuZGF0YTtcblxuICAgICAgICAgICAgY29uc3QgdGVtcCA9IHtcbiAgICAgICAgICAgICAgICBvcGVuSWQ6IG9wZW5pZCxcbiAgICAgICAgICAgICAgICBmcm9tdGlkOiB0aWQsXG4gICAgICAgICAgICAgICAgdHlwZTogJ3RfZGFpamluJyxcbiAgICAgICAgICAgICAgICB0aXRsZTogJ+ihjOeoi+S7o+mHkeWIuCcsXG4gICAgICAgICAgICAgICAgY2FuVXNlSW5OZXh0OiB0cnVlLFxuICAgICAgICAgICAgICAgIGlzVXNlZDogZmFsc2UsXG4gICAgICAgICAgICAgICAgYXRsZWFzdDogY2FzaGNvdXBvbl9hdGxlYXN0IHx8IDAsXG4gICAgICAgICAgICAgICAgdmFsdWU6IGNhc2hjb3Vwb25fdmFsdWVzXG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAvLyDml6DpnIDpl6jmp5vvvIzmnInku6Pph5HliLjljbPlj6/pooblj5ZcbiAgICAgICAgICAgIGlmICggISFjYXNoY291cG9uX3ZhbHVlcyApIHtcblxuICAgICAgICAgICAgICAgIC8vIOWIoOmZpOS4iuS4gOS4quacquS9v+eUqOeahOS7o+mHkeWIuFxuICAgICAgICAgICAgICAgIGNvbnN0IGxhc3REYWlqaW4kID0gYXdhaXQgZGIuY29sbGVjdGlvbignY291cG9uJylcbiAgICAgICAgICAgICAgICAgICAgLndoZXJlKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6ICd0X2RhaWppbicsXG4gICAgICAgICAgICAgICAgICAgICAgICBpc1VzZWQ6IGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICAgICAgY2FuVXNlSW5OZXh0OiB0cnVlXG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgIC5nZXQoICk7XG5cbiAgICAgICAgICAgICAgICBpZiAoIGxhc3REYWlqaW4kLmRhdGFbIDAgXSkge1xuICAgICAgICAgICAgICAgICAgICBhd2FpdCBkYi5jb2xsZWN0aW9uKCdjb3Vwb24nKVxuICAgICAgICAgICAgICAgICAgICAgICAgLmRvYyggU3RyaW5nKCBsYXN0RGFpamluJC5kYXRhWyAwIF0uX2lkICkpXG4gICAgICAgICAgICAgICAgICAgICAgICAucmVtb3ZlKCApO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIC8vIOmihuWPluS7o+mHkeWIuFxuICAgICAgICAgICAgICAgIHJlcSA9IGF3YWl0IGNsb3VkLmNhbGxGdW5jdGlvbih7XG4gICAgICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRhdGE6IHRlbXAsXG4gICAgICAgICAgICAgICAgICAgICAgICAkdXJsOiAnY3JlYXRlJ1xuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICBuYW1lOiAnY291cG9uJ1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gY3R4LmJvZHkgPSB7XG4gICAgICAgICAgICAgICAgc3RhdHVzOiAyMDAsXG4gICAgICAgICAgICAgICAgZGF0YTogcmVxLnJlc3VsdC5zdGF0dXMgPT09IDIwMCA/IHRlbXAgOiBudWxsIFxuICAgICAgICAgICAgfVxuXG4gICAgICAgIH0gY2F0Y2ggKCBlICkge1xuICAgICAgICAgICAgcmV0dXJuIGN0eC5ib2R5ID0geyBzdGF0dXM6IDUwMCB9XG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgIC8qKiBcbiAgICAgKiBAZGVzY3JpcHRpb25cbiAgICAgKiDku6PotK3ojrflj5bmnKror7vorqLljZVcbiAgICAgKi9cbiAgICBhcHAucm91dGVyKCd1bnJlYWQnLCBhc3luYyggY3R4LCBuZXh0ICkgPT4ge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgY29uc3QgeyB0aWQsIGxhc3RUaW1lIH0gPSBldmVudC5kYXRhO1xuICAgICAgICAgICAgbGV0IHdoZXJlJCA9IHtcbiAgICAgICAgICAgICAgICB0aWRcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIGlmICggbGFzdFRpbWUgKSB7XG4gICAgICAgICAgICAgICAgd2hlcmUkID0gT2JqZWN0LmFzc2lnbih7IH0sIHdoZXJlJCwge1xuICAgICAgICAgICAgICAgICAgICBjcmVhdGV0aW1lOiBfLmd0ZSggbGFzdFRpbWUgKVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBjb25zdCBkYXRhJCA9IGF3YWl0IGRiLmNvbGxlY3Rpb24oJ29yZGVyJylcbiAgICAgICAgICAgICAgICAud2hlcmUoIHdoZXJlJCApXG4gICAgICAgICAgICAgICAgLmNvdW50KCApO1xuXG4gICAgICAgICAgICByZXR1cm4gY3R4LmJvZHkgPSB7XG4gICAgICAgICAgICAgICAgc3RhdHVzOiAyMDAsXG4gICAgICAgICAgICAgICAgZGF0YTogZGF0YSQudG90YWxcbiAgICAgICAgICAgIH1cblxuICAgICAgICB9IGNhdGNoICggZSApIHsgcmV0dXJuIGN0eC5ib2R5ID0geyBzdGF0dXM6IDUwMCB9O31cbiAgICB9KTtcblxuICAgIC8qKiBcbiAgICAgKiBAZGVzY3JpcHRpb25cbiAgICAgKiDku6PotK3mn6XnnIvmiYDmnInnmoTorqLljZXliJfooahcbiAgICAgKi9cbiAgICBhcHAucm91dGVyKCdsaXN0LWFsbCcsIGFzeW5jKCBjdHgsIG5leHQgKSA9PiB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICAvLyDmn6Xor6LmnaHmlbBcbiAgICAgICAgICAgIGNvbnN0IGxpbWl0ID0gMTA7XG4gICAgICAgICAgICBjb25zdCB7IHRpZCwgcGFnZSB9ID0gZXZlbnQuZGF0YTtcblxuICAgICAgICAgICAgY29uc3Qgd2hlcmUkID0ge1xuICAgICAgICAgICAgICAgIHRpZCxcbiAgICAgICAgICAgICAgICBwYXlfc3RhdHVzOiBfLm5lcSgnMCcpXG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICBjb25zdCB0b3RhbCQgPSBhd2FpdCBkYi5jb2xsZWN0aW9uKCdvcmRlcicpXG4gICAgICAgICAgICAgICAgLndoZXJlKCB3aGVyZSQgKVxuICAgICAgICAgICAgICAgIC5jb3VudCggKTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgY29uc3Qgb3JkZXJzJCA9IGF3YWl0IGRiLmNvbGxlY3Rpb24oJ29yZGVyJylcbiAgICAgICAgICAgICAgICAud2hlcmUoIHdoZXJlJCApXG4gICAgICAgICAgICAgICAgLmxpbWl0KCBsaW1pdCApXG4gICAgICAgICAgICAgICAgLnNraXAoKCBwYWdlIC0gMSApICogbGltaXQgKVxuICAgICAgICAgICAgICAgIC5vcmRlckJ5KCdjcmVhdGVUaW1lJywgJ2Rlc2MnKVxuICAgICAgICAgICAgICAgIC5nZXQoICk7XG5cbiAgICAgICAgICAgIGNvbnN0IHBpZHMgPSBBcnJheS5mcm9tKFxuICAgICAgICAgICAgICAgIG5ldyBTZXQoIFxuICAgICAgICAgICAgICAgICAgICBvcmRlcnMkLmRhdGFcbiAgICAgICAgICAgICAgICAgICAgICAgIC5tYXAoIHggPT4geC5waWQgKVxuICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICk7XG5cbiAgICAgICAgICAgIGNvbnN0IHNpZHMgPSBBcnJheS5mcm9tKFxuICAgICAgICAgICAgICAgIG5ldyBTZXQoIFxuICAgICAgICAgICAgICAgICAgICBvcmRlcnMkLmRhdGFcbiAgICAgICAgICAgICAgICAgICAgICAgIC5tYXAoIHggPT4geC5zaWQgKVxuICAgICAgICAgICAgICAgICAgICAgICAgLmZpbHRlciggeCA9PiAhIXggKVxuICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICk7XG5cbiAgICAgICAgICAgIGNvbnN0IHVpZHMgPSBBcnJheS5mcm9tKFxuICAgICAgICAgICAgICAgIG5ldyBTZXQoIFxuICAgICAgICAgICAgICAgICAgICBvcmRlcnMkLmRhdGFcbiAgICAgICAgICAgICAgICAgICAgICAgIC5tYXAoIHggPT4geC5vcGVuaWQgKVxuICAgICAgICAgICAgICAgICAgICAgICAgLmZpbHRlciggeCA9PiAhIXggKVxuICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICk7XG5cbiAgICAgICAgICAgIC8vIGNvbnN0IGdvb2RzJCQgPSBhd2FpdCBQcm9taXNlLmFsbChcbiAgICAgICAgICAgIC8vICAgICBwaWRzLm1hcCggXG4gICAgICAgICAgICAvLyAgICAgICAgIHBpZCA9PiBkYi5jb2xsZWN0aW9uKCdnb29kcycpXG4gICAgICAgICAgICAvLyAgICAgICAgICAgICAuZG9jKCBTdHJpbmcoIHBpZCApKVxuICAgICAgICAgICAgLy8gICAgICAgICAgICAgLmdldCggKVxuICAgICAgICAgICAgLy8gICAgIClcbiAgICAgICAgICAgIC8vICk7XG4gICAgICAgICAgICAvLyBjb25zdCBnb29kcyQgPSBnb29kcyQkLm1hcCggeCA9PiB4LmRhdGEgKTtcblxuICAgICAgICAgICAgLy8gY29uc3Qgc3RhbmRhcnMkJCA9IGF3YWl0IFByb21pc2UuYWxsKFxuICAgICAgICAgICAgLy8gICAgIHNpZHMubWFwKCBcbiAgICAgICAgICAgIC8vICAgICAgICAgc2lkID0+IGRiLmNvbGxlY3Rpb24oJ3N0YW5kYXJkcycpXG4gICAgICAgICAgICAvLyAgICAgICAgICAgICAuZG9jKCBTdHJpbmcoIHNpZCApKVxuICAgICAgICAgICAgLy8gICAgICAgICAgICAgLmZpZWxkKHtcbiAgICAgICAgICAgIC8vICAgICAgICAgICAgICAgICBwaWQ6IHRydWUsXG4gICAgICAgICAgICAvLyAgICAgICAgICAgICAgICAgbmFtZTogdHJ1ZVxuICAgICAgICAgICAgLy8gICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC8vICAgICAgICAgICAgIC5nZXQoIClcbiAgICAgICAgICAgIC8vICAgICApXG4gICAgICAgICAgICAvLyApO1xuICAgICAgICAgICAgLy8gY29uc3Qgc3RhbmRhcnMkID0gc3RhbmRhcnMkJC5tYXAoIHggPT4geC5kYXRhICk7XG5cbiAgICAgICAgICAgIGNvbnN0IHVzZXJzJCQgPSBhd2FpdCBQcm9taXNlLmFsbChcbiAgICAgICAgICAgICAgICB1aWRzLm1hcCggXG4gICAgICAgICAgICAgICAgICAgIG9wZW5pZCA9PiBkYi5jb2xsZWN0aW9uKCd1c2VyJylcbiAgICAgICAgICAgICAgICAgICAgICAgIC53aGVyZSh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb3BlbmlkXG4gICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAgICAgLmZpZWxkKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvcGVuaWQ6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYXZhdGFyVXJsOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5pY2tOYW1lOiB0cnVlXG4gICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAgICAgLmdldCggKVxuICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICBjb25zdCB1c2VycyQgPSB1c2VycyQkLm1hcCggeCA9PiB4LmRhdGFbIDAgXSk7XG5cbiAgICAgICAgICAgIGNvbnN0IG1ldGEgPSBvcmRlcnMkLmRhdGEubWFwKCBvcmRlciA9PiB7XG5cbiAgICAgICAgICAgICAgICBjb25zdCB1c2VyID0gdXNlcnMkLmZpbmQoIHVzZXIgPT4gdXNlci5vcGVuaWQgPT09IG9yZGVyLm9wZW5pZCApO1xuICAgICAgICAgICAgICAgIC8vIGNvbnN0IGRldGFpbCA9IGdvb2RzJC5maW5kKCBnb29kID0+IGdvb2QuX2lkID09PSBvcmRlci5waWQgKTtcbiAgICAgICAgICAgICAgICAvLyBjb25zdCBzdGFuZGFyID0gc3RhbmRhcnMkLmZpbmQoIHMgPT4gcy5faWQgPT09IG9yZGVyLnNpZCApO1xuXG4gICAgICAgICAgICAgICAgcmV0dXJuIE9iamVjdC5hc3NpZ24oeyB9LCBvcmRlciwge1xuICAgICAgICAgICAgICAgICAgICB1c2VyLFxuICAgICAgICAgICAgICAgICAgICAvLyBkZXRhaWwsXG4gICAgICAgICAgICAgICAgICAgIC8vIHN0YW5kYXJcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHJldHVybiBjdHguYm9keSA9IHtcbiAgICAgICAgICAgICAgICBzdGF0dXM6IDIwMCxcbiAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICAgIHBhZ2UsXG4gICAgICAgICAgICAgICAgICAgIHBhZ2VTaXplOiBsaW1pdCxcbiAgICAgICAgICAgICAgICAgICAgZGF0YTogbWV0YSxcbiAgICAgICAgICAgICAgICAgICAgdG90YWw6IHRvdGFsJC50b3RhbCxcbiAgICAgICAgICAgICAgICAgICAgdG90YWxQYWdlOiBNYXRoLmNlaWwoIHRvdGFsJC50b3RhbCAvIGxpbWl0IClcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cblxuICAgICAgICB9IGNhdGNoICggZSApIHsgXG4gICAgICAgICAgICBjb25zb2xlLmxvZygnPz8/JywgZSApXG4gICAgICAgICAgICByZXR1cm4gY3R4LmJvZHkgPSB7IHN0YXR1czogNTAwIH1cbiAgICAgICAgfVxuICAgIH0pXG4gXG4gICByZXR1cm4gYXBwLnNlcnZlKCApO1xuXG59XG5cbi8qKiDmoLnmja7nsbvlnovvvIzov5Tlm57mjqjpgIHmlofmoYggKi9cbmZ1bmN0aW9uIGdldFRleHRCeVB1c2hUeXBlKCB0eXBlOiAnYnV5UGluMScgfCAnYnV5UGluMicgfCAnd2FpdFBpbicgfCAnYnV5JyB8ICdnZXRNb25leScsIGRlbHRhICkge1xuXG4gICAgY29uc3Qgbm93ID0gZ2V0Tm93KCApO1xuICAgIGNvbnN0IG1vbnRoID0gbm93LmdldE1vbnRoKCApICsgMTtcbiAgICBjb25zdCBkYXRlID0gbm93LmdldERhdGUoICk7XG4gICAgY29uc3QgaG91ciA9IG5vdy5nZXRIb3VycyggKTtcbiAgICBjb25zdCBtaW51dGVzID0gbm93LmdldE1pbnV0ZXMoICk7XG5cbiAgICBjb25zdCBmaXhaZXJvID0gcyA9PiBTdHJpbmcoIHMgKS5sZW5ndGggPT09IDEgPyBgMCR7c31gIDogczsgXG5cbiAgICBpZiAoIHR5cGUgPT09ICdidXknICkge1xuICAgICAgICByZXR1cm4gW1xuICAgICAgICAgICAgYOS4i+WNleaIkOWKn++8geS8muWwveW/q+mHh+i0re+9nmAsIFxuICAgICAgICAgICAgYCR7bW9udGh95pyIJHtkYXRlfeaXpSAke2hvdXJ9OiR7Zml4WmVybyggbWludXRlcyApfWBcbiAgICAgICAgXTtcbiAgICB9IGVsc2UgaWYgKCB0eXBlID09PSAnYnV5UGluMScgKSB7XG4gICAgICAgIHJldHVybiBbXG4gICAgICAgICAgICBg5oGt5Zac77yB5L2g5ou85Zui55yB5LqGJHtkZWx0YX3lhYPvvIFgLFxuICAgICAgICAgICAgYOeCueWHu+afpeeci2BcbiAgICAgICAgXVxuICAgIH0gZWxzZSBpZiAoIHR5cGUgPT09ICdidXlQaW4yJyApIHtcbiAgICAgICAgcmV0dXJuIFtcbiAgICAgICAgICAgIGDmga3llpzvvIHkvaDmi7zlm6LnnIHkuoYke2RlbHRhfeWFgyFgLFxuICAgICAgICAgICAgYOaciee+pOWPi+WPguWKoOS6hue+pOaLvOWbou+8jOeCueWHu+afpeeci2BcbiAgICAgICAgXVxuICAgIH0gZWxzZSBpZiAoIHR5cGUgPT09ICd3YWl0UGluJyApIHtcbiAgICAgICAgcmV0dXJuIFtcbiAgICAgICAgICAgIGDlt64x5Lq65bCx5ou85oiQ77yBYCxcbiAgICAgICAgICAgIGDmib7nvqTlj4vmi7zlm6LvvIznq4vnnIEke2RlbHRhfeWFg++8gWBcbiAgICAgICAgXVxuICAgIH0gZWxzZSBpZiAoIHR5cGUgPT09ICdnZXRNb25leScgKSB7XG4gICAgICAgIHJldHVybiBbXG4gICAgICAgICAgICBg5pSv5LuY5bC+5qy+77yM56uL5Y2z5Y+R6LSn5ZOmYCxcbiAgICAgICAgICAgIGDotorlv6votorlpb1gXG4gICAgICAgIF1cbiAgICB9XG4gICAgcmV0dXJuIFtdXG59Il19