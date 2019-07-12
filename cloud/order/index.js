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
            var openId_1, _a, orderIds, prepay_id_1, form_id_1, find$, list_1, create$_1, _b, buyer, others, pushMe$, othersOrders$_1, othersMore, othersPush_1, appConf$, appConf, pushers$, pushers_1, appConf2$, appConf2, integralRate_1, e_3;
            var _this = this;
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
                        if (!!!appConf.value) return [3, 12];
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
                        return [4, db.collection('app-config')
                                .where({
                                type: 'push-integral-get-rate'
                            })
                                .get()];
                    case 10:
                        appConf2$ = _c.sent();
                        appConf2 = appConf2$.data[0];
                        integralRate_1 = appConf2.value || 0.05;
                        return [4, Promise.all(pushers_1.map(function (pusher) { return __awaiter(_this, void 0, void 0, function () {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUNBLGlCQTQyQ0M7O0FBNTJDRCxxQ0FBdUM7QUFDdkMsc0NBQXdDO0FBQ3hDLG1DQUFtQztBQUVuQyxLQUFLLENBQUMsSUFBSSxDQUFDO0lBQ1AsR0FBRyxFQUFFLE9BQU8sQ0FBQyxHQUFHLENBQUMsS0FBSztDQUN6QixDQUFDLENBQUM7QUFFSCxJQUFNLEVBQUUsR0FBZ0IsS0FBSyxDQUFDLFFBQVEsRUFBRyxDQUFDO0FBQzFDLElBQU0sQ0FBQyxHQUFHLEVBQUUsQ0FBQyxPQUFPLENBQUM7QUFRckIsSUFBTSxNQUFNLEdBQUcsVUFBRSxFQUFVO0lBQVYsbUJBQUEsRUFBQSxVQUFVO0lBQ3ZCLElBQUssRUFBRSxFQUFHO1FBQ04sT0FBTyxJQUFJLENBQUMsR0FBRyxFQUFHLENBQUM7S0FDdEI7SUFDRCxJQUFNLE1BQU0sR0FBRyxJQUFJLElBQUksQ0FBRSxJQUFJLElBQUksRUFBRyxDQUFDLGNBQWMsRUFBRyxDQUFDLENBQUM7SUFDeEQsT0FBTyxJQUFJLElBQUksQ0FBRSxNQUFNLENBQUMsT0FBTyxFQUFHLEdBQUcsQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsSUFBSSxDQUFFLENBQUE7QUFDN0QsQ0FBQyxDQUFBO0FBb0NZLFFBQUEsSUFBSSxHQUFHLFVBQVEsS0FBSyxFQUFFLE9BQU87Ozs7UUFFaEMsR0FBRyxHQUFHLElBQUksU0FBUyxDQUFDLEVBQUUsS0FBSyxPQUFBLEVBQUUsQ0FBQyxDQUFDO1FBaUNyQyxHQUFHLENBQUMsTUFBTSxDQUFDLFFBQVEsRUFBRSxVQUFPLEdBQUcsRUFBRSxJQUFJOzs7Ozs7d0JBR3ZCLEtBQXdCLEtBQUssQ0FBQyxJQUFJLEVBQWhDLEdBQUcsU0FBQSxFQUFFLElBQUksVUFBQSxFQUFFLE1BQU0s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J3d4LXNlcnZlci1zZGsnO1xuaW1wb3J0ICogYXMgVGNiUm91dGVyIGZyb20gJ3RjYi1yb3V0ZXInO1xuaW1wb3J0IHsgY3JlYXRlJCB9IGZyb20gJy4vY3JlYXRlJztcblxuY2xvdWQuaW5pdCh7XG4gICAgZW52OiBwcm9jZXNzLmVudi5jbG91ZFxufSk7XG5cbmNvbnN0IGRiOiBEQi5EYXRhYmFzZSA9IGNsb3VkLmRhdGFiYXNlKCApO1xuY29uc3QgXyA9IGRiLmNvbW1hbmQ7XG5cbi8qKiBcbiAqIOi9rOaNouagvOael+WwvOayu+aXtuWMuiArOOaXtuWMulxuICogRGF0ZSgpLm5vdygpIC8gbmV3IERhdGUoKS5nZXRUaW1lKCkg5piv5pe25LiN5pe25q2j5bi455qEKzhcbiAqIERhdGUudG9Mb2NhbFN0cmluZyggKSDlpb3lg4/mmK/kuIDnm7TmmK8rMOeahFxuICog5YWI5ou/5YiwICsw77yM54S25ZCOKzhcbiAqL1xuY29uc3QgZ2V0Tm93ID0gKCB0cyA9IGZhbHNlICk6IGFueSA9PiB7XG4gICAgaWYgKCB0cyApIHtcbiAgICAgICAgcmV0dXJuIERhdGUubm93KCApO1xuICAgIH1cbiAgICBjb25zdCB0aW1lXzAgPSBuZXcgRGF0ZSggbmV3IERhdGUoICkudG9Mb2NhbGVTdHJpbmcoICkpO1xuICAgIHJldHVybiBuZXcgRGF0ZSggdGltZV8wLmdldFRpbWUoICkgKyA4ICogNjAgKiA2MCAqIDEwMDAgKVxufVxuXG4vKipcbiAqIFxuICogQGRlc2NyaXB0aW9uIOiuouWNleaooeWdl1xuICogLS0tLS0tLS0g5a2X5q61IC0tLS0tLS0tLS1cbiAqIF9pZFxuICogb3BlbmlkLFxuICogY3JlYXRldGltZVxuICogcGF5dGltZVxuICogdGlkLFxuICogcGlkLFxuICogY2lkICjlj6/kuLrnqbopXG4gKiBzaWQsICjlj6/kuLrnqbopXG4gKiBjb3VudCxcbiAqIHByaWNlLFxuICogZ3JvdXBQcmljZSxcbiAqIGRlcG9zaXRfcHJpY2U6IOWVhuWTgeiuoumHkSAo5Y+v5Li656m6KVxuICogISBhY2lkIOWVhuWTgea0u+WKqGlkXG4gKiAhIGlzT2NjdXBpZWQsIOaYr+WQpuWNoOW6k+WtmFxuICogZ3JvdXBfcHJpY2UgKOWPr+S4uuepuilcbiAqIHR5cGU6ICdjdXN0b20nIHwgJ25vcm1hbCcgfCAncHJlJyDoh6rlrprkuYnliqDljZXjgIHmma7pgJrliqDljZXjgIHpooTorqLljZVcbiAqIGltZzogQXJyYXlbIHN0cmluZyBdXG4gKiBkZXNj77yI5Y+v5Li656m677yJLFxuICogYWlkXG4gKiBhbGxvY2F0ZWRQcmljZSDliIbphY3nmoTku7fmoLxcbiAqIGFsbG9jYXRlZEdyb3VwUHJpY2Ug5YiG6YWN5Zui6LSt5Lu3XG4gKiBhbGxvY2F0ZWRDb3VudCDliIbphY3nmoTmlbDph49cbiAqIGZvcm1faWRcbiAqIHByZXBheV9pZCxcbiAqIGZpbmFsX3ByaWNlIOacgOWQjuaIkOS6pOS7t1xuICogISBjYW5Hcm91cCDmmK/lkKblj6/ku6Xmi7zlm6JcbiAqIGJhc2Vfc3RhdHVzOiAwLDEsMiwzLDQsNSDov5vooYzkuK3vvIzku6PotK3lt7LotK3kubDvvIzlt7LosIPmlbTvvIzlt7Lnu5PnrpfvvIzlt7Llj5bmtojvvIjkubDkuI3liLDvvInvvIzlt7Lov4fmnJ/vvIjmlK/ku5jov4fmnJ/vvIlcbiAqIHBheV9zdGF0dXM6IDAsMSwyIOacquS7mOasvu+8jOW3suS7mOiuoumHke+8jOW3suS7mOWFqOasvlxuICogISBkZWxpdmVyX3N0YXR1czogMCwxIOacquWPkeW4g++8jOW3suWPkeW4g+OAgVxuICovXG5leHBvcnQgY29uc3QgbWFpbiA9IGFzeW5jICggZXZlbnQsIGNvbnRleHQgKSA9PiB7XG5cbiAgICBjb25zdCBhcHAgPSBuZXcgVGNiUm91dGVyKHsgZXZlbnQgfSk7XG5cbiAgICAvKipcbiAgICAgKiBAZGVzY3JpcHRpb24g5Yib5bu66K6i5Y2VXG4gICAgICogLS0tLS0tLS0g6K+35rGCIC0tLS0tLS0tLS1cbiAgICAgKiB7XG4gICAgICogICAgICB0aWQsXG4gICAgICogICAgICBvcGVuSWQgLy8g6K6i5Y2V5Li75Lq6XG4gICAgICogICAgICBmcm9tOiAnY2FydCcgfCAnYnV5JyB8ICdjdXN0b20nIHwgJ2FnZW50cycgfCAnc3lzdGVtJyDmnaXmupDvvJrotK3nianovabjgIHnm7TmjqXotK3kubDjgIHoh6rlrprkuYnkuIvljZXjgIHku6PotK3kuIvljZXjgIHns7vnu5/lj5HotbfpooTku5jorqLljZVcbiAgICAgKiAgICAgIG9yZGVyczogQXJyYXk8eyBcbiAgICAgKiAgICAgICAgICB0aWRcbiAgICAgKiAgICAgICAgICBjaWRcbiAgICAgKiAgICAgICAgICBzaWRcbiAgICAgKiAgICAgICAgICBwaWRcbiAgICAgKiAgICAgICAgICBwcmljZVxuICAgICAqICAgICAgICAgIG5hbWVcbiAgICAgKiAgICAgICAgICBhY2lkXG4gICAgICogICAgICAgICAgc3RhbmRlcm5hbWVcbiAgICAgKiAgICAgICAgICBncm91cFByaWNlXG4gICAgICogICAgICAgICAgY291bnRcbiAgICAgKiAgICAgICAgICBkZXNjXG4gICAgICogICAgICAgICAgaW1nXG4gICAgICogICAgICAgICAgdHlwZVxuICAgICAqICAgICAgICAgIHBheV9zdGF0dXMsXG4gICAgICogICAgICAgICAgYWRkcmVzczoge1xuICAgICAqICAgICAgICAgICAgICBuYW1lLFxuICAgICAqICAgICAgICAgICAgICBwaG9uZSxcbiAgICAgKiAgICAgICAgICAgICAgZGV0YWlsLFxuICAgICAqICAgICAgICAgICAgICBwb3N0YWxjb2RlXG4gICAgICogICAgICAgICAgfVxuICAgICAqICAgICAgfT5cbiAgICAgKiB9XG4gICAgICovXG4gICAgYXBwLnJvdXRlcignY3JlYXRlJywgYXN5bmMoIGN0eCwgbmV4dCApID0+IHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgY29uc3QgeyB0aWQsIGZyb20sIG9yZGVycyB9ID0gZXZlbnQuZGF0YTtcbiAgICAgICAgICAgIGNvbnN0IG9wZW5pZCA9IGV2ZW50LmRhdGEub3BlbklkIHx8IGV2ZW50LnVzZXJJbmZvLm9wZW5JZDtcblxuICAgICAgICAgICAgLy8gMeOAgeWIpOaWreivpeihjOeoi+aYr+WQpuWPr+S7peeUqFxuICAgICAgICAgICAgY29uc3QgdHJpcHMkJCA9IGF3YWl0IGNsb3VkLmNhbGxGdW5jdGlvbih7XG4gICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBfaWQ6IHRpZFxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAkdXJsOiAnZGV0YWlsJ1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgbmFtZTogJ3RyaXAnXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgY29uc3QgdHJpcHMkID0gdHJpcHMkJC5yZXN1bHQ7ICAgICAgICBcbiAgICAgICAgICAgIGlmICggdHJpcHMkLnN0YXR1cyAhPT0gMjAwXG4gICAgICAgICAgICAgICAgICAgIHx8ICF0cmlwcyQuZGF0YSBcbiAgICAgICAgICAgICAgICAgICAgfHwgKCAhIXRyaXBzJC5kYXRhICYmIHRyaXBzJC5kYXRhLmlzQ2xvc2VkICkgXG4gICAgICAgICAgICAgICAgICAgIHx8ICggISF0cmlwcyQuZGF0YSAmJiBnZXROb3coIHRydWUgKSA+PSB0cmlwcyQuZGF0YS5lbmRfZGF0ZSApKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgJ+aaguaXoOihjOeoi+iuoeWIku+8jOaaguaXtuS4jeiDvei0reS5sO+9nidcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8g5pyA5paw5Y+v55So6KGM56iLXG4gICAgICAgICAgICBjb25zdCB0cmlwID0gdHJpcHMkLmRhdGE7XG5cbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICog5qC55o2u5Zyw5Z2A5a+56LGh77yM5ou/5Yiw5Zyw5Z2AaWRcbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgbGV0IGFkZHJlc3NpZCQgPSB7XG4gICAgICAgICAgICAgICAgcmVzdWx0OiB7XG4gICAgICAgICAgICAgICAgICAgIGRhdGE6IG51bGwsXG4gICAgICAgICAgICAgICAgICAgIHN0YXR1czogNTAwXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgLy8g6K6i5Y2V5p2l5rqQ77ya6LSt54mp6L2m44CB57O757uf5Yqg5Y2VXG4gICAgICAgICAgICBpZiAoIGV2ZW50LmRhdGEuZnJvbSA9PT0gJ2NhcnQnIHx8IGV2ZW50LmRhdGEuZnJvbSA9PT0gJ3N5c3RlbScgfHwgZXZlbnQuZGF0YS5mcm9tID09PSAnYnV5JyApIHtcbiAgICAgICAgICAgICAgICBhZGRyZXNzaWQkID0gYXdhaXQgY2xvdWQuY2FsbEZ1bmN0aW9uKHtcbiAgICAgICAgICAgICAgICAgICAgZGF0YTogeyBcbiAgICAgICAgICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvcGVuSWQ6IG9wZW5pZCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhZGRyZXNzOiBldmVudC5kYXRhLm9yZGVyc1sgMCBdLmFkZHJlc3NcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAkdXJsOiAnZ2V0QWRkcmVzc0lkJ1xuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICBuYW1lOiAnYWRkcmVzcydcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIFxuICAgICAgICAgICAgLy8g6K6i5Y2V5p2l5rqQ77ya6LSt54mp6L2m44CB57O757uf5Yqg5Y2VXG4gICAgICAgICAgICBpZiAoKCBldmVudC5kYXRhLmZyb20gPT09ICdjYXJ0JyB8fCBldmVudC5kYXRhLmZyb20gPT09ICdzeXN0ZW0nICkgJiYgYWRkcmVzc2lkJC5yZXN1bHQuc3RhdHVzICE9PSAyMDAgKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgJ+afpeivouWcsOWdgOmUmeivryc7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIOWPr+eUqOWcsOWdgGlkXG4gICAgICAgICAgICBjb25zdCBhaWQgPSBhZGRyZXNzaWQkLnJlc3VsdC5kYXRhO1xuXG4gICAgICAgICAgICAvLyDmmK/lkKbmlrDlrqLmiLdcbiAgICAgICAgICAgIGNvbnN0IGlzTmV3JCA9IGF3YWl0IGNsb3VkLmNhbGxGdW5jdGlvbih7XG4gICAgICAgICAgICAgICAgbmFtZTogJ2NvbW1vbicsXG4gICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgICAkdXJsOiAnaXMtbmV3LWN1c3RvbWVyJyxcbiAgICAgICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgICAgICAgb3BlbklkOiBvcGVuaWRcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pXG5cbiAgICAgICAgICAgIGNvbnN0IGlzTmV3ID0gaXNOZXckLnJlc3VsdC5kYXRhO1xuXG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIOaWsOWuoiArIOaWsOWuouimgeiuoumHkSA9ICcwJyxcbiAgICAgICAgICAgICAqIOaWsOWuoiArIOimgeiuoumHkSA9ICcwJyxcbiAgICAgICAgICAgICAqIOaWsOWuoiArIOWFjeiuoumHkSA9ICcxJyxcbiAgICAgICAgICAgICAqIOaXp+WuoiArIOaXp+WuouWFjeiuoumHkSA9ICcxJyxcbiAgICAgICAgICAgICAqIOaXp+WuoiArIOimgeiuoumHkSA9ICcwJyxcbiAgICAgICAgICAgICAqIOaXp+WuoiArIOWFjeiuoumHkSA9ICcxJyxcbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgbGV0IHBheV9zdGF0dXMgPSAnMCc7XG4gICAgICAgICAgICBjb25zdCBwID0gdHJpcC5wYXltZW50O1xuXG4gICAgICAgICAgICBpZiAoIGlzTmV3ICYmIHAgPT09ICcwJyApIHtcbiAgICAgICAgICAgICAgICBwYXlfc3RhdHVzID0gJzAnXG5cbiAgICAgICAgICAgIH0gZWxzZSBpZiAoIGlzTmV3ICYmIHAgPT09ICcxJyApIHtcbiAgICAgICAgICAgICAgICBwYXlfc3RhdHVzID0gJzAnXG5cbiAgICAgICAgICAgIH0gZWxzZSBpZiAoIGlzTmV3ICYmIHAgPT09ICcyJyApIHtcbiAgICAgICAgICAgICAgICBwYXlfc3RhdHVzID0gJzEnXG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICB9IGVsc2UgaWYgKCAhaXNOZXcgJiYgcCA9PT0gJzAnICkge1xuICAgICAgICAgICAgICAgIHBheV9zdGF0dXMgPSAnMSdcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoICFpc05ldyAmJiBwID09PSAnMScgKSB7XG4gICAgICAgICAgICAgICAgcGF5X3N0YXR1cyA9ICcwJ1xuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgfSBlbHNlIGlmICggIWlzTmV3ICYmIHAgPT09ICcyJyApIHtcbiAgICAgICAgICAgICAgICBwYXlfc3RhdHVzID0gJzEnXG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHBheV9zdGF0dXMgPSAnMCdcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gM+OAgeaJuemHj+WIm+W7uuiuouWNle+8jO+8iOi/h+a7pOaOieS4jeiDveWIm+W7uui0reeJqea4heWNleeahOWVhuWTge+8iVxuICAgICAgICAgICAgY29uc3QgdGVtcCA9IGV2ZW50LmRhdGEub3JkZXJzLm1hcCggbWV0YSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3QgdCA9IE9iamVjdC5hc3NpZ24oeyB9LCBtZXRhLCB7XG4gICAgICAgICAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICAgICAgICAgKiAhIGRlbGl2ZXJfc3RhdHVz5Li65pyq5Y+R5biDIOWPr+iDveaciemXrumimFxuICAgICAgICAgICAgICAgICAgICAgKi9cbiAgICAgICAgICAgICAgICAgICAgYWlkLFxuICAgICAgICAgICAgICAgICAgICBpc09jY3VwaWVkOiB0cnVlLCAvLyDljaDpooblupPlrZjmoIflv5dcbiAgICAgICAgICAgICAgICAgICAgb3BlbmlkOiBvcGVuaWQsXG4gICAgICAgICAgICAgICAgICAgIGRlbGl2ZXJfc3RhdHVzOiAnMCcsIFxuICAgICAgICAgICAgICAgICAgICBiYXNlX3N0YXR1czogJzAnLFxuICAgICAgICAgICAgICAgICAgICBwYXlfc3RhdHVzOiAhbWV0YS5kZXBvc2l0UHJpY2UgPyAnMScgOiBwYXlfc3RhdHVzICwgLy8g5ZWG5ZOB6K6i6YeR6aKd5bqm5Li6MFxuICAgICAgICAgICAgICAgICAgICBjcmVhdGVUaW1lOiBnZXROb3coIHRydWUgKSxcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogISFtZXRhLmRlcG9zaXRQcmljZSA/IG1ldGEudHlwZSA6ICdub3JtYWwnXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgZGVsZXRlIHRbJ2FkZHJlc3MnXTtcblxuICAgICAgICAgICAgICAgIGlmICggIXRbJ3NpZCddICkge1xuICAgICAgICAgICAgICAgICAgICBkZWxldGUgdFsnc2lkJ107XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgcmV0dXJuIHQ7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgLy8gNOOAgeaJuemHj+WIm+W7uuiuouWNlSAoIOWQjOaXtuWkhOeQhuWNoOmihui0p+WtmOeahOmXrumimCApXG4gICAgICAgICAgICBjb25zdCBzYXZlJDogYW55ID0gYXdhaXQgUHJvbWlzZS5hbGwoIHRlbXAubWFwKCBvID0+IHtcbiAgICAgICAgICAgICAgICByZXR1cm4gY3JlYXRlJCggb3BlbmlkLCBvLCBkYiwgY3R4ICk7XG4gICAgICAgICAgICB9KSk7XG4gICAgICAgIFxuICAgICAgICAgICAgaWYgKCBzYXZlJC5zb21lKCB4ID0+IHguc3RhdHVzICE9PSAyMDAgKSkge1xuICAgICAgICAgICAgICAgIHRocm93ICfliJvlu7rorqLljZXplJnor6/vvIEnXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIOi/lOWbnuiuouWNleS/oeaBr1xuICAgICAgICAgICAgY29uc3Qgb3JkZXJfcmVzdWx0ID0gc2F2ZSQubWFwKCggeCwgayApID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCB7IHByaWNlLCBjb3VudCwgcGF5X3N0YXR1cywgZGVwb3NpdFByaWNlIH0gPSB0ZW1wWyBrIF07XG4gICAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICAgICAgb2lkOiB4LmRhdGEuX2lkLFxuICAgICAgICAgICAgICAgICAgICBwcmljZSxcbiAgICAgICAgICAgICAgICAgICAgY291bnQsXG4gICAgICAgICAgICAgICAgICAgIHBheV9zdGF0dXMsXG4gICAgICAgICAgICAgICAgICAgIGRlcG9zaXRQcmljZVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICByZXR1cm4gY3R4LmJvZHkgPSB7XG4gICAgICAgICAgICAgICAgc3RhdHVzOiAyMDAsXG4gICAgICAgICAgICAgICAgZGF0YTogb3JkZXJfcmVzdWx0XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgIH0gY2F0Y2ggKCBlICkge1xuICAgICBcbiAgICAgICAgICAgIHJldHVybiBjdHguYm9keSA9IHtcbiAgICAgICAgICAgICAgICBzdGF0dXM6IDUwMCxcbiAgICAgICAgICAgICAgICBtZXNzYWdlOiBlXG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICAvKipcbiAgICAgKiBAZGVzY3JpcHRpb25cbiAgICAgKiDlrqLmiLfnq6/mn6Xor6JcbiAgICAgKiBcbiAgICAgKiDliIbpobUgKyBxdWVyeSDmn6Xor6LorqLljZXliJfooajvvIjmnKrogZrlkIjvvIlcbiAgICAgKiAtLS0tLSDor7fmsYIgLS0tLS0tXG4gICAgICoge1xuICAgICAqISAgICB0aWQ6IOihjOeoi2lkIO+8iOWPr+aXoO+8iVxuICAgICAqICAgICBvcGVuaWQ6IO+8iOWPr+aXoO+8iVxuICAgICAqICAgICBwYWdlOiBudW1iZXJcbiAgICAgKiAgICAgc2tpcDogbnVtYmVyXG4gICAgICogICAgIHR5cGU6IOaIkeeahOWFqOmDqCB8IOacquS7mOasvuiuouWNlSB8IOW+heWPkei0pyB8IOW3suWujOaIkCB8IOeuoeeQhuWRmO+8iOihjOeoi+iuouWNle+8iXwg566h55CG5ZGY77yI5omA5pyJ6K6i5Y2V77yJXG4gICAgICogICAgIHR5cGU6IG15LWFsbCB8IG15LW5vdHBheSB8IG15LWRlbGl2ZXIgfCBteS1maW5pc2ggfCBtYW5hZ2VyLXRyaXAgfCBtYW5hZ2VyLWFsbFxuICAgICAqICAgICBwYXNzdXNlZGxlc3M6IHRydWUgfCBmYWxzZSB8IHVuZGVmaW5lZCDmmK/lkKbov4fmu6Tmjonov4fmnJ/nmoTorqLljZVcbiAgICAgKiB9XG4gICAgICogISDmnKrku5jmrL7orqLljZXvvJpwYXlfc3RhdHVzOiDmnKrku5jmrL4v5bey5LuY6K6i6YeRIOaIliB0eXBlOiBwcmVcbiAgICAgKiAhIOW+heWPkei0p++8mmRlbGl2ZXJfc3RhdHVz77ya5pyq5Y+R6LSnIOS4lCBwYXlfc3RhdHVzIOW3suS7mOasvlxuICAgICAqICEg5bey5a6M5oiQ77yaZGVsaXZlcl9zdGF0dXPvvJrlt7Llj5HotKcg5LiUIHBheV9zdGF0dXMg5bey5LuY5YWo5qy+XG4gICAgICovXG4gICAgYXBwLnJvdXRlcignbGlzdCcsIGFzeW5jKCBjdHgsIG5leHQgKSA9PiB7XG4gICAgICAgIHRyeSB7XG5cbiAgICAgICAgICAgIGxldCB3aGVyZSQgPSB7IH07XG4gICAgICAgICAgICBjb25zdCB7IHR5cGUsIHRpZCwgcGFzc3VzZWRsZXNzIH0gPSBldmVudC5kYXRhO1xuXG4gICAgICAgICAgICAvLyDmn6Xor6LmnaHmlbBcbiAgICAgICAgICAgIGNvbnN0IGxpbWl0ID0gdGlkID8gOTkgOiAxMDtcblxuICAgICAgICAgICAgY29uc3Qgb3BlbmlkID0gZXZlbnQuZGF0YS5vcGVuaWQgfHwgZXZlbnQudXNlckluZm8ub3BlbklkO1xuXG5cbiAgICAgICAgICAgIC8vIOaIkeeahOWFqOmDqFxuICAgICAgICAgICAgaWYgKCB0eXBlID09PSAnbXktYWxsJyApIHtcbiAgICAgICAgICAgICAgICB3aGVyZSQgPSB7XG4gICAgICAgICAgICAgICAgICAgIG9wZW5pZDogb3BlbmlkXG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyDmnKrku5jmrL5cbiAgICAgICAgICAgIH0gZWxzZSBpZiAoIHR5cGUgPT09ICdteS1ub3RwYXknICkge1xuICAgICAgICAgICAgICAgIHdoZXJlJCA9IF8uYW5kKHtcbiAgICAgICAgICAgICAgICAgICAgb3BlbmlkLFxuICAgICAgICAgICAgICAgICAgICBiYXNlX3N0YXR1czogJzInXG4gICAgICAgICAgICAgICAgfSwgXy5vcihbXG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6ICdwcmUnXG4gICAgICAgICAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHBheV9zdGF0dXM6IF8ub3IoIF8uZXEoJzAnKSwgXy5lcSgnMScpKVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgXSkpO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICAvLyDmnKrlj5HotKdcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoIHR5cGUgPT09ICdteS1kZWxpdmUnICkge1xuICAgICAgICAgICAgICAgIHdoZXJlJCA9IHtcbiAgICAgICAgICAgICAgICAgICAgb3BlbmlkLFxuICAgICAgICAgICAgICAgICAgICBwYXlfc3RhdHVzOiAnMicsXG4gICAgICAgICAgICAgICAgICAgIGRlbGl2ZXJfc3RhdHVzOiAnMCdcbiAgICAgICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAvLyDlt7LlrozmiJBcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoIHR5cGUgPT09ICdteS1maW5pc2gnICkge1xuICAgICAgICAgICAgICAgIHdoZXJlJCA9IHtcbiAgICAgICAgICAgICAgICAgICAgb3BlbmlkLFxuICAgICAgICAgICAgICAgICAgICBwYXlfc3RhdHVzOiAnMicsXG4gICAgICAgICAgICAgICAgICAgIGRlbGl2ZXJfc3RhdHVzOiAnMSdcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyDov4fmu6Tmjonov4fmnJ/orqLljZVcbiAgICAgICAgICAgIGlmICggcGFzc3VzZWRsZXNzICE9PSBmYWxzZSApIHtcbiAgICAgICAgICAgICAgICB3aGVyZSQgPSBPYmplY3QuYXNzaWduKHsgfSwgd2hlcmUkLCB7XG4gICAgICAgICAgICAgICAgICAgIGJhc2Vfc3RhdHVzOiBfLm5lcSgnNScpXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIOihjOeoi+iuouWNlVxuICAgICAgICAgICAgaWYgKCB0aWQgKSB7XG4gICAgICAgICAgICAgICAgd2hlcmUkID0gT2JqZWN0LmFzc2lnbih7IH0sIHdoZXJlJCwge1xuICAgICAgICAgICAgICAgICAgICB0aWRcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8g6I635Y+W5oC75pWwXG4gICAgICAgICAgICBjb25zdCB0b3RhbCQgPSBhd2FpdCBkYi5jb2xsZWN0aW9uKCdvcmRlcicpXG4gICAgICAgICAgICAgICAgLndoZXJlKCB3aGVyZSQgKVxuICAgICAgICAgICAgICAgIC5jb3VudCggKTtcblxuICAgICAgICAgICAgLy8g6I635Y+W6K6i5Y2V5pWw5o2uXG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqICEg5aaC5p6c5piv5pyJ5oyH5a6adGlk55qE77yM5YiZ5LiN6ZyA6KaBbGltaXTkuobvvIznm7TmjqXmi4nlj5booYznqIvmiYDmnInnmoTorqLljZVcbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgY29uc3QgZGF0YSQgPSBhd2FpdCBkYi5jb2xsZWN0aW9uKCdvcmRlcicpXG4gICAgICAgICAgICAgICAgLndoZXJlKCB3aGVyZSQgKVxuICAgICAgICAgICAgICAgIC5vcmRlckJ5KCdjcmVhdGVUaW1lJywgJ2Rlc2MnKVxuICAgICAgICAgICAgICAgIC5saW1pdCggbGltaXQgKVxuICAgICAgICAgICAgICAgIC5za2lwKCBldmVudC5kYXRhLnNraXAgfHwgKCBldmVudC5kYXRhLnBhZ2UgLSAxICkgKiBsaW1pdCApXG4gICAgICAgICAgICAgICAgLmdldCggKTtcblxuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiAhIOeUseS6juafpeivouaYr+aMieWIhumhte+8jOS9huaYr+aYvuekuuaYr+aMieihjOeoi+adpeiBmuWQiOaYvuekulxuICAgICAgICAgICAgICogISDlm6DmraTmnInlj6/og73vvIxO6aG15pyA5ZCO5LiA5L2N77yM6LefTisx6aG156ys5LiA5L2N5L6d54S25bGe5LqO5ZCM5LiA6KGM56iLXG4gICAgICAgICAgICAgKiAhIOWmguS4jei/m+ihjOWkhOeQhu+8jOWuouaIt+afpeivouiuouWNleWIl+ihqOaYvuekuuihjOeoi+iuouWNleaXtu+8jOS8muKAnOacieWPr+iDveKAneaYvuekuuS4jeWFqFxuICAgICAgICAgICAgICogISDnibnmrorlpITnkIbvvJrnlKjmnIDlkI7kuIDkvY3nmoR0aWTvvIzmn6Xor6LmnIDlkI7kuIDkvY3ku6XlkI7lkIx0aWTnmoRvcmRlcu+8jOeEtuWQjuS/ruato+aJgOi/lOWbnueahHBhZ2VcbiAgICAgICAgICAgICAqL1xuXG4gICAgICAgICAgICBjb25zdCBsYXN0ID0gZGF0YSQuZGF0YVsgZGF0YSQuZGF0YS5sZW5ndGggLSAxIF07XG5cbiAgICAgICAgICAgIGxldCBmaXgkOiBhbnkgPSB7XG4gICAgICAgICAgICAgICAgZGF0YTogWyBdXG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAvLyDlpoLmnpzmsqHmnIl0aWTlj4LmlbDvvIzmiY3ljrvlgZpmaXjnmoTliqjkvZxcbiAgICAgICAgICAgIGlmICggbGFzdCAmJiAhdGlkICkgeyBcbiAgICAgICAgICAgICAgICBmaXgkID0gYXdhaXQgZGIuY29sbGVjdGlvbignb3JkZXInKVxuICAgICAgICAgICAgICAgICAgICAud2hlcmUoe1xuICAgICAgICAgICAgICAgICAgICAgICAgb3BlbmlkLFxuICAgICAgICAgICAgICAgICAgICAgICAgdGlkOiBsYXN0LnRpZCxcbiAgICAgICAgICAgICAgICAgICAgICAgIGJhc2Vfc3RhdHVzOiBfLm5lcSgnNScpXG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgIC5vcmRlckJ5KCdjcmVhdGVUaW1lJywgJ2Rlc2MnKVxuICAgICAgICAgICAgICAgICAgICAuc2tpcCggZXZlbnQuZGF0YS5za2lwID8gZXZlbnQuZGF0YS5za2lwICsgZGF0YSQuZGF0YS5sZW5ndGggOiAoIGV2ZW50LmRhdGEucGFnZSAtIDEgKSAqIGxpbWl0ICsgZGF0YSQuZGF0YS5sZW5ndGggKVxuICAgICAgICAgICAgICAgICAgICAuZ2V0KCApO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBjb25zdCBtZXRhID0gWyAuLi5kYXRhJC5kYXRhLCAuLi5maXgkLmRhdGEgXTtcblxuICAgICAgICAgICAgLy8g6L+Z6YeM55qE6KGM56iL6K+m5oOF55SoIG5ldyBTZXTnmoTmlrnlvI/mn6Xor6JcbiAgICAgICAgICAgIGNvbnN0IHRyaXBJZHMgPSBBcnJheS5mcm9tKFxuICAgICAgICAgICAgICAgIG5ldyBTZXQoIG1ldGEubWFwKCBtID0+IG0udGlkICkpXG4gICAgICAgICAgICApO1xuXG4gICAgICAgICAgICBjb25zdCB0cmlwcyQgPSBhd2FpdCBQcm9taXNlLmFsbCggdHJpcElkcy5tYXAoIHRpZCA9PiB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGRiLmNvbGxlY3Rpb24oJ3RyaXAnKVxuICAgICAgICAgICAgICAgICAgICAud2hlcmUoe1xuICAgICAgICAgICAgICAgICAgICAgICAgX2lkOiB0aWRcbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgLmdldCggKTtcbiAgICAgICAgICAgIH0pKTtcbiAgICAgXG4gICAgICAgICAgICAvLyDogZrlkIjooYznqIvmlbDmja5cbiAgICAgICAgICAgIGNvbnN0IG1ldGEyID0gbWV0YS5tYXAoKCB4LCBpICkgPT4gT2JqZWN0LmFzc2lnbih7IH0sIHgsIHtcbiAgICAgICAgICAgICAgICAvLyB0cmlwOiB0cmlwcyRbIGkgXS5kYXRhWyAwIF1cbiAgICAgICAgICAgICAgICB0cmlwOiAodHJpcHMkLmZpbmQoIHkgPT4geS5kYXRhWyAwIF0uX2lkID09PSB4LnRpZCApIGFzIGFueSkuZGF0YVsgMCBdXG4gICAgICAgICAgICB9KSk7XG5cbiAgICAgICAgICAgIHJldHVybiBjdHguYm9keSA9IHtcbiAgICAgICAgICAgICAgICBzdGF0dXM6IDIwMCxcbiAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICAgIGRhdGE6IG1ldGEyLFxuICAgICAgICAgICAgICAgICAgICBwYWdlU2l6ZTogbGltaXQsXG4gICAgICAgICAgICAgICAgICAgIHRvdGFsOiB0b3RhbCQudG90YWwsXG4gICAgICAgICAgICAgICAgICAgIHBhZ2U6IGZpeCQuZGF0YS5sZW5ndGggPT09IDAgPyBldmVudC5kYXRhLnBhZ2UgOiBldmVudC5kYXRhLnBhZ2UgKyBNYXRoLmNlaWwoIGZpeCQuZGF0YS5sZW5ndGggLyBsaW1pdCApLFxuICAgICAgICAgICAgICAgICAgICBjdXJyZW50OiBldmVudC5kYXRhLnNraXAgPyBldmVudC5kYXRhLnNraXAgKyBtZXRhLmxlbmd0aCA6ICggZXZlbnQuZGF0YS5wYWdlIC0gMSApICogbGltaXQgKyBtZXRhLmxlbmd0aCxcbiAgICAgICAgICAgICAgICAgICAgdG90YWxQYWdlOiBNYXRoLmNlaWwoIHRvdGFsJC50b3RhbCAvIGxpbWl0IClcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBcbiAgICAgICAgfSBjYXRjaCAoIGUgKSB7IHJldHVybiBjdHguYm9keSA9IHsgc3RhdHVzOiA1MDB9O31cbiAgICB9KVxuXG4gICAgLyoqXG4gICAgICog5om56YeP5pu05paw77yM6K6i5Y2V5Li65bey5pSv5LuY77yM5bm25LiU5aKe5Yqg5Yiw6LSt54mp5riF5Y2VXG4gICAgICog5bm25o6o6YCB55u45YWz5Lmw5a62XG4gICAgICog5bm25o6o6YCB55u45YWz4oCc5o6o5bm/6ICF4oCdXG4gICAgICoge1xuICAgICAqICAgICAgb3JkZXJJZHM6IFwiMTIzLDIzNCwzNDVcIlxuICAgICAqICAgICAgZm9ybV9pZCxcbiAgICAgKiAgICAgIHByZXBheV9pZFxuICAgICAqIH1cbiAgICAgKi9cbiAgICBhcHAucm91dGVyKCd1cGFkdGUtdG8tcGF5ZWQnLCBhc3luYyggY3R4LCBuZXh0ICkgPT4ge1xuICAgICAgICB0cnkge1xuXG4gICAgICAgICAgICBjb25zdCBvcGVuSWQgPSBldmVudC51c2VySW5mby5vcGVuSWQ7XG4gICAgICAgICAgICBjb25zdCB7IG9yZGVySWRzLCBwcmVwYXlfaWQsIGZvcm1faWQgfSA9IGV2ZW50LmRhdGE7XG5cbiAgICAgICAgICAgIC8vIOabtOaWsOiuouWNleWtl+autVxuICAgICAgICAgICAgYXdhaXQgUHJvbWlzZS5hbGwoIG9yZGVySWRzLnNwbGl0KCcsJykubWFwKCBvaWQgPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiBkYi5jb2xsZWN0aW9uKCdvcmRlcicpLmRvYyggb2lkIClcbiAgICAgICAgICAgICAgICAgICAgLnVwZGF0ZSh7XG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9ybV9pZCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcmVwYXlfaWQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcGF5X3N0YXR1czogJzEnXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSkpO1xuXG4gICAgICAgICAgICAvLyDliJvlu7ov5o+S5YWl5Yiw6LSt54mp5riF5Y2VXG4gICAgICAgICAgICBjb25zdCBmaW5kJDogYW55ID0gYXdhaXQgUHJvbWlzZS5hbGwoIG9yZGVySWRzLnNwbGl0KCcsJykubWFwKCBvaWQgPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiBkYi5jb2xsZWN0aW9uKCdvcmRlcicpXG4gICAgICAgICAgICAgICAgICAgIC53aGVyZSh7XG4gICAgICAgICAgICAgICAgICAgICAgICBfaWQ6IG9pZFxuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAuZ2V0KCApO1xuICAgICAgICAgICAgfSkpO1xuXG4gICAgICAgICAgICAvLyDorqLljZXliJfooahcbiAgICAgICAgICAgIGNvbnN0IGxpc3QgPSBmaW5kJC5tYXAoIHggPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IHsgX2lkLCB0aWQsIHBpZCwgc2lkLCBwcmljZSwgZ3JvdXBQcmljZSwgYWNpZCB9ID0geC5kYXRhWyAwIF07XG4gICAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICAgICAgb2lkOiBfaWQsXG4gICAgICAgICAgICAgICAgICAgIGFjaWQsIGdyb3VwUHJpY2UsXG4gICAgICAgICAgICAgICAgICAgIHRpZCwgcGlkLCBzaWQsIHByaWNlXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIGNvbnN0IGNyZWF0ZSQgPSBhd2FpdCBjbG91ZC5jYWxsRnVuY3Rpb24oe1xuICAgICAgICAgICAgICAgIG5hbWU6ICdzaG9wcGluZy1saXN0JyxcbiAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICAgICR1cmw6ICdjcmVhdGUnLFxuICAgICAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBsaXN0LFxuICAgICAgICAgICAgICAgICAgICAgICAgb3BlbklkXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgLy8g5aSE55CG6LSt5Lmw55u45YWz55qE5o6o6YCBXG4gICAgICAgICAgICBpZiAoIGNyZWF0ZSQucmVzdWx0LnN0YXR1cyA9PT0gMjAwICkge1xuICAgICAgICAgICAgICAgIGNvbnN0IHsgYnV5ZXIsIG90aGVycyB9ID0gY3JlYXRlJC5yZXN1bHQuZGF0YTtcblxuICAgICAgICAgICAgICAgIC8vIOS5sOWutuaOqOmAgVxuICAgICAgICAgICAgICAgIGNvbnN0IHB1c2hNZSQgPSBhd2FpdCBjbG91ZC5jYWxsRnVuY3Rpb24oe1xuICAgICAgICAgICAgICAgICAgICBuYW1lOiAnY29tbW9uJyxcbiAgICAgICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgICAgICAgJHVybDogJ3B1c2gtdGVtcGxhdGUnLFxuICAgICAgICAgICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6IGJ1eWVyLnR5cGUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb3BlbmlkOiBidXllci5vcGVuaWQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGV4dHM6IGdldFRleHRCeVB1c2hUeXBlKCBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnV5ZXIudHlwZSA9PT0gJ2J1eVBpbicgPyAnYnV5UGluMScgOiBidXllci50eXBlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBidXllci5kZWx0YSApXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgIC8vIOWFtuS7luS6uuaLvOWbouaIkOWKn+eahOaOqOmAgVxuICAgICAgICAgICAgICAgIGNvbnN0IG90aGVyc09yZGVycyQ6IGFueSA9IGF3YWl0IFByb21pc2UuYWxsKFxuICAgICAgICAgICAgICAgICAgICBvdGhlcnMubWFwKCBcbiAgICAgICAgICAgICAgICAgICAgICAgIG90aGVyID0+IGRiLmNvbGxlY3Rpb24oJ29yZGVyJylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAud2hlcmUoe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvcGVuaWQ6IG90aGVyLm9wZW5pZCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYWNpZDogb3RoZXIuYWNpZCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2lkOiBvdGhlci5zaWQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBpZDogb3RoZXIucGlkLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aWQ6IG90aGVyLnRpZCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGF5X3N0YXR1czogJzEnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBiYXNlX3N0YXR1czogXy5vciggXy5lcSgnMCcpLCBfLmVxKCcxJyksIF8uZXEoJzInKSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5maWVsZCh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvdW50OiB0cnVlXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAuZ2V0KCApXG4gICAgICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgICApO1xuXG4gICAgICAgICAgICAgICAgLy8g5pW05ZCIZGVsdGEgKyBjb3VudFxuICAgICAgICAgICAgICAgIGNvbnN0IG90aGVyc01vcmUgPSBvdGhlcnMubWFwKCggb3RoZXIsIGtleSApID0+IHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC4uLm90aGVyLFxuICAgICAgICAgICAgICAgICAgICAgICAgY291bnQ6IG90aGVyc09yZGVycyRbIGtleSBdLmRhdGEucmVkdWNlKCggeCwgeSApID0+IHkuY291bnQgKyB4LCAwIClcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgbGV0IG90aGVyc1B1c2ggPSB7IH07XG5cbiAgICAgICAgICAgICAgICBvdGhlcnNNb3JlLm1hcCggb3RoZXIgPT4ge1xuICAgICAgICAgICAgICAgICAgICBpZiAoICFvdGhlcnNQdXNoWyBvdGhlci5vcGVuaWQgXSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgb3RoZXJzUHVzaCA9IE9iamVjdC5hc3NpZ24oeyB9LCBvdGhlcnNQdXNoLCB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgWyBvdGhlci5vcGVuaWQgXTogb3RoZXIuZGVsdGEgKiBvdGhlci5jb3VudFxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBvdGhlcnNQdXNoID0gT2JqZWN0LmFzc2lnbih7IH0sIG90aGVyc1B1c2gsIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBbIG90aGVyLm9wZW5pZCBdOiBvdGhlcnNQdXNoWyBvdGhlci5vcGVuaWQgXSArIG90aGVyLmRlbHRhICogb3RoZXIuY291bnRcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICAvLyDlhbbku5bkurrmi7zlm6LmiJDlip/nmoTmjqjpgIFcbiAgICAgICAgICAgICAgICBhd2FpdCBQcm9taXNlLmFsbChcbiAgICAgICAgICAgICAgICAgICAgT2JqZWN0LmtleXMoIG90aGVyc1B1c2ggKS5tYXAoXG4gICAgICAgICAgICAgICAgICAgICAgICBvdGhlck9wZW5pZCA9PiBjbG91ZC5jYWxsRnVuY3Rpb24oe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6ICdjb21tb24nLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJHVybDogJ3B1c2gtdGVtcGxhdGUnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiAnYnV5UGluJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9wZW5pZDogb3RoZXJPcGVuaWQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZXh0czogZ2V0VGV4dEJ5UHVzaFR5cGUoICdidXlQaW4yJywgb3RoZXJzUHVzaFsgb3RoZXJPcGVuaWQgXSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgICApO1xuXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIOafpeeci2FwcC1jb25maWfnp6/liIbmjqjlub/mmK/lkKblvIDlkK9cbiAgICAgICAgICAgIGNvbnN0IGFwcENvbmYkID0gYXdhaXQgZGIuY29sbGVjdGlvbignYXBwLWNvbmZpZycpXG4gICAgICAgICAgICAgICAgLndoZXJlKHtcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogJ2dvb2QtaW50ZWdyYWwtc2hhcmUnXG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAuZ2V0KCApO1xuICAgICAgICAgICAgY29uc3QgYXBwQ29uZiA9IGFwcENvbmYkLmRhdGFbIDAgXTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgaWYgKCAhIWFwcENvbmYudmFsdWUgKSB7XG4gICAgICAgICAgICAgICAgLy8g5om+5Ye65omA5pyJ55qE5o6o5bm/6K6w5b2VXG4gICAgICAgICAgICAgICAgY29uc3QgcHVzaGVycyQ6IGFueSA9IGF3YWl0IFByb21pc2UuYWxsKFxuICAgICAgICAgICAgICAgICAgICBsaXN0Lm1hcCggYXN5bmMoIHgsIGsgKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBwdXNoUmVjb3JkJCA9IGF3YWl0IGRiLmNvbGxlY3Rpb24oJ3NoYXJlLXJlY29yZCcpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLndoZXJlKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGlkOiB4LnBpZCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb3BlbmlkOiBvcGVuSWQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlzU3VjY2VzczogZmFsc2VcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5nZXQoICk7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC4uLnB1c2hSZWNvcmQkLmRhdGFbIDAgXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcmljZTogbGlzdFsgayBdLnByaWNlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHB1c2hJZDogcHVzaFJlY29yZCQuZGF0YVsgMCBdID8gcHVzaFJlY29yZCQuZGF0YVsgMCBdLl9pZCA6ICcnXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgKTtcblxuICAgICAgICAgICAgICAgIC8vIOaJvuWHuuaJgOacieeahOaOqOW5v+iAhVxuICAgICAgICAgICAgICAgIGNvbnN0IHB1c2hlcnM6IGFueSA9IFsgXTtcbiAgICAgICAgICAgICAgICBwdXNoZXJzJFxuICAgICAgICAgICAgICAgICAgICAuZmlsdGVyKCB4ID0+ICEheC5mcm9tIClcbiAgICAgICAgICAgICAgICAgICAgLm1hcCggeCA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBpbmRleCA9IHB1c2hlcnMuZmluZEluZGV4KCB5ID0+IHkuZnJvbSA9PT0geC5mcm9tICk7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIGluZGV4ICE9PSAtMSApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBvcmlnaW4gPSBwdXNoZXJzWyBpbmRleCBdO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHB1c2hlcnMuc3BsaWNlKCBpbmRleCwgMSwge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAuLi5vcmlnaW4sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHByaWNlOiBOdW1iZXIoKCB4LnByaWNlICsgb3JpZ2luLnByaWNlICkudG9GaXhlZCggMiApKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwdXNoZXJzLnB1c2goe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmcm9tOiB4LmZyb20sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHByaWNlOiB4LnByaWNlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwdXNoSWQ6IHgucHVzaElkXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICBjb25zdCBhcHBDb25mMiQgPSBhd2FpdCBkYi5jb2xsZWN0aW9uKCdhcHAtY29uZmlnJylcbiAgICAgICAgICAgICAgICAgICAgLndoZXJlKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6ICdwdXNoLWludGVncmFsLWdldC1yYXRlJ1xuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAuZ2V0KCApO1xuICAgICAgICAgICAgICAgIGNvbnN0IGFwcENvbmYyID0gYXBwQ29uZjIkLmRhdGFbIDAgXTtcbiAgICAgICAgICAgICAgICBjb25zdCBpbnRlZ3JhbFJhdGUgPSBhcHBDb25mMi52YWx1ZSB8fCAwLjA1O1xuXG4gICAgICAgICAgICAgICAgYXdhaXQgUHJvbWlzZS5hbGwoXG4gICAgICAgICAgICAgICAgICAgIHB1c2hlcnMubWFwKCBhc3luYyBwdXNoZXIgPT4ge1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyDmjqjlub/np6/liIbmr5TkvosgNSVcbiAgICAgICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgaW50ZWdyYWwgPSBOdW1iZXIoKCBwdXNoZXIucHJpY2UgKiBpbnRlZ3JhbFJhdGUgKS50b0ZpeGVkKCAxICkpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyDorrDlvZXmjqjlub/ogIXnp6/liIZcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHVzZXIkID0gYXdhaXQgZGIuY29sbGVjdGlvbigndXNlcicpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLndoZXJlKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb3BlbmlkOiBwdXNoZXIuZnJvbVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLmdldCggKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHVzZXIgPSB1c2VyJC5kYXRhWyAwIF07XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCB1c2VyaWQgPSB1c2VyLl9pZDtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRlbGV0ZSB1c2VyWydfaWQnXTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgYXdhaXQgZGIuY29sbGVjdGlvbigndXNlcicpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLmRvYyggU3RyaW5nKCB1c2VyaWQgKSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAuc2V0KHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLi4udXNlcixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHB1c2hfaW50ZWdyYWw6IHVzZXIucHVzaF9pbnRlZ3JhbCA/IFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIE51bWJlcigodXNlci5wdXNoX2ludGVncmFsICsgaW50ZWdyYWwpLnRvRml4ZWQoIDEgKSkgOiBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbnRlZ3JhbFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIOWkhOeQhuaOqOW5v+iAheebuOWFs+eahOaOqOmAgVxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgcHVzaCQgPSBhd2FpdCBjbG91ZC5jYWxsRnVuY3Rpb24oe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6ICdjb21tb24nLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJHVybDogJ3B1c2gtdGVtcGxhdGUnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiAnaG9uZ2JhbycsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvcGVuaWQ6IHB1c2hlci5mcm9tLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8g56ev5YiG6aG16Z2iXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYWdlOiAncGFnZXMvdHJpcC1lbnRlci9pbmRleCcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZXh0czogW2Dmga3llpzvvIHojrflvpcke2ludGVncmFsfeWFg+aKteaJo+eOsOmHkWAsYOaOqOW5v+aIkOWKn++8geacieS6uui0reS5sOS6huS9oOWIhuS6q+eahOWVhuWTgWBdXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgLy8g5pu05paw5o6o5bm/54q25oCBXG4gICAgICAgICAgICAgICAgICAgICAgICBhd2FpdCBkYi5jb2xsZWN0aW9uKCdzaGFyZS1yZWNvcmQnKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5kb2MoIHB1c2hlci5wdXNoSWQgKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC51cGRhdGUoe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpc1N1Y2Nlc3M6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdWNjZXNzVGltZTogZ2V0Tm93KCB0cnVlIClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIGN0eC5ib2R5ID0ge1xuICAgICAgICAgICAgICAgIHN0YXR1czogMjAwXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfSBjYXRjaCAoIGUgKSB7IFxuICAgICAgICAgICAgY29uc29sZS5sb2coIGUgKTtcbiAgICAgICAgICAgIHJldHVybiBjdHguYm9keSA9IHsgc3RhdHVzOiA1MDAgfTtcbiAgICAgICAgfSBcbiAgICB9KVxuXG4gICAgLyoqIFxuICAgICAqIEBkZXNjcmlwdGlvblxuICAgICAqIOS7o+i0rea4heW4kOWCrOasvueahOiuouWNleWIl+ihqFxuICAgICAqIHtcbiAgICAgKiAgICAgdGlkIFxuICAgICAqICAgICBuZWVkQ291cG9uczogZmFsc2UgfCB0cnVlIHwgdW5kZWZpbmVkXG4gICAgICogICAgIG5lZWRBZGRyZXNzOiBmYWxzZSB8IHRydWUgfCB1bmRlZmluZWRcbiAgICAgKiB9XG4gICAgICovXG4gICAgYXBwLnJvdXRlcignZGFpZ291LWxpc3QnLCBhc3luYyggY3R4LCBuZXh0ICkgPT4ge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgY29uc3QgeyB0aWQsIG5lZWRDb3Vwb25zLCBuZWVkQWRkcmVzcyB9ID0gZXZlbnQuZGF0YTtcblxuICAgICAgICAgICAgLy8g6K6i5Y2V5L+h5oGvXG4gICAgICAgICAgICBjb25zdCBvcmRlcnMkID0gYXdhaXQgZGIuY29sbGVjdGlvbignb3JkZXInKVxuICAgICAgICAgICAgICAgIC53aGVyZSh7XG4gICAgICAgICAgICAgICAgICAgIHRpZCxcbiAgICAgICAgICAgICAgICAgICAgYmFzZV9zdGF0dXM6IF8ubmVxKCc1JyksXG4gICAgICAgICAgICAgICAgICAgIHBheV9zdGF0dXM6IF8ub3IoIF8uZXEoJzEnKSwgXy5lcSgnMicpKVxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLmdldCggKTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgLy8g55So5oi35L+h5oGvXG4gICAgICAgICAgICBjb25zdCB1c2VycyQgPSBhd2FpdCBQcm9taXNlLmFsbChcbiAgICAgICAgICAgICAgICBBcnJheS5mcm9tKCBcbiAgICAgICAgICAgICAgICAgICAgbmV3IFNldCggb3JkZXJzJC5kYXRhXG4gICAgICAgICAgICAgICAgICAgICAgICAubWFwKCB4ID0+IHgub3BlbmlkIClcbiAgICAgICAgICAgICAgICApKVxuICAgICAgICAgICAgICAgIC5tYXAoIHVpZCA9PiBkYi5jb2xsZWN0aW9uKCd1c2VyJylcbiAgICAgICAgICAgICAgICAgICAgLndoZXJlKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG9wZW5pZDogdWlkXG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgIC5nZXQoICkpXG4gICAgICAgICAgICApO1xuXG4gICAgICAgICAgICAvLyDlv6vpgJLotLnnlKjkv6Hmga9cbiAgICAgICAgICAgIGNvbnN0IGRlbGl2ZXJmZWVzJCA9IGF3YWl0IFByb21pc2UuYWxsKFxuICAgICAgICAgICAgICAgIEFycmF5LmZyb20oIFxuICAgICAgICAgICAgICAgICAgICBuZXcgU2V0KCBvcmRlcnMkLmRhdGFcbiAgICAgICAgICAgICAgICAgICAgICAgIC5tYXAoIHggPT4geC5vcGVuaWQgKVxuICAgICAgICAgICAgICAgICkpXG4gICAgICAgICAgICAgICAgLm1hcCggdWlkID0+IGRiLmNvbGxlY3Rpb24oJ2RlbGl2ZXItZmVlJylcbiAgICAgICAgICAgICAgICAgICAgLndoZXJlKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRpZCxcbiAgICAgICAgICAgICAgICAgICAgICAgIG9wZW5pZDogdWlkXG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgIC5nZXQoICkpXG4gICAgICAgICAgICApO1xuXG4gICAgICAgICAgICAvLyDlnLDlnYDkv6Hmga9cbiAgICAgICAgICAgIGxldCBhZGRyZXNzJDogYW55ID0gWyBdO1xuICAgICAgICAgICAgaWYgKCAhIW5lZWRBZGRyZXNzIHx8IG5lZWRBZGRyZXNzID09PSB1bmRlZmluZWQgKSB7XG4gICAgICAgICAgICAgICAgYWRkcmVzcyQgPSBhd2FpdCBQcm9taXNlLmFsbChcbiAgICAgICAgICAgICAgICAgICAgQXJyYXkuZnJvbShcbiAgICAgICAgICAgICAgICAgICAgICAgIG5ldyBTZXQoIG9yZGVycyQuZGF0YVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5tYXAoIHggPT4geC5haWQgKVxuICAgICAgICAgICAgICAgICAgICApKVxuICAgICAgICAgICAgICAgICAgICAubWFwKCBhaWQgPT4gZGIuY29sbGVjdGlvbignYWRkcmVzcycpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5kb2MoIGFpZCApXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5nZXQoICkpXG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIFxuICAgICAgICAgICAgLy8g5Y2h5Yi45L+h5oGvXG4gICAgICAgICAgICBsZXQgY291cG9ucyQ6IGFueSA9IFsgXTtcbiAgICAgICAgICAgIGlmICggISFuZWVkQ291cG9ucyB8fCBuZWVkQ291cG9ucyA9PT0gdW5kZWZpbmVkICkge1xuICAgICAgICAgICAgICAgIGNvdXBvbnMkID0gYXdhaXQgUHJvbWlzZS5hbGwoXG4gICAgICAgICAgICAgICAgICAgIEFycmF5LmZyb20oXG4gICAgICAgICAgICAgICAgICAgICAgICBuZXcgU2V0KCBvcmRlcnMkLmRhdGEgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLm1hcCggeCA9PiB4Lm9wZW5pZCApXG4gICAgICAgICAgICAgICAgICAgICkpXG4gICAgICAgICAgICAgICAgICAgIC5tYXAoIG9wZW5pZCA9PiBkYi5jb2xsZWN0aW9uKCdjb3Vwb24nKVxuICAgICAgICAgICAgICAgICAgICAgICAgLndoZXJlKCBfLm9yKFtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRpZCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb3BlbmlkLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiBfLm9yKCBfLmVxKCd0X21hbmppYW4nKSwgXy5lcSgndF9saWppYW4nKSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9wZW5pZCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaXNVc2VkOiBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FuVXNlSW5OZXh0OiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiAndF9kYWlqaW4nXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgXSkpXG4gICAgICAgICAgICAgICAgICAgICAgICAuZ2V0KCApXG4gICAgICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgXG4gICAgICAgICAgICBjb25zdCB1c2VyT2RlcnMgPSB1c2VycyQubWFwKCggdXNlciQsIGsgKSA9PiB7XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgY29uc3QgdXNlciA9IHVzZXIkLmRhdGFbIDAgXTtcblxuICAgICAgICAgICAgICAgIGNvbnN0IG9yZGVycyA9IG9yZGVycyQuZGF0YVxuICAgICAgICAgICAgICAgICAgICAuZmlsdGVyKCB4ID0+IHgub3BlbmlkID09PSB1c2VyLm9wZW5pZCApO1xuXG4gICAgICAgICAgICAgICAgY29uc3QgYWRkcmVzcyA9IGFkZHJlc3MkLmxlbmd0aCA+IDAgP1xuICAgICAgICAgICAgICAgICAgICBhZGRyZXNzJFxuICAgICAgICAgICAgICAgICAgICAgICAgLm1hcCggeCA9PiB4LmRhdGEgKVxuICAgICAgICAgICAgICAgICAgICAgICAgLmZpbHRlciggeCA9PiB4Lm9wZW5pZCA9PT0gdXNlci5vcGVuaWQgKSA6XG4gICAgICAgICAgICAgICAgICAgIHVuZGVmaW5lZDtcblxuICAgICAgICAgICAgICAgIGNvbnN0IGNvdXBvbnMgPSBjb3Vwb25zJC5sZW5ndGggPiAwID9cbiAgICAgICAgICAgICAgICAgICAgY291cG9ucyRcbiAgICAgICAgICAgICAgICAgICAgICAgIC5tYXAoIHggPT4geC5kYXRhIClcbiAgICAgICAgICAgICAgICAgICAgICAgIC5maWx0ZXIoIHggPT4geC5sZW5ndGggPiAwICYmIHhbIDAgXS5vcGVuaWQgPT09IHVzZXIub3BlbmlkICkgOlxuICAgICAgICAgICAgICAgICAgICB1bmRlZmluZWQ7XG5cbiAgICAgICAgICAgICAgICBjb25zdCBkZWxpdmVyRmVlID0gZGVsaXZlcmZlZXMkWyBrIF0uZGF0YVsgMCBdIHx8IG51bGxcblxuICAgICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgICAgIHVzZXIsXG4gICAgICAgICAgICAgICAgICAgIG9yZGVycyxcbiAgICAgICAgICAgICAgICAgICAgYWRkcmVzcyxcbiAgICAgICAgICAgICAgICAgICAgZGVsaXZlckZlZSxcbiAgICAgICAgICAgICAgICAgICAgY291cG9uczogKCEhY291cG9ucyAmJiBjb3Vwb25zLmxlbmd0aCA+IDAgKSA/IGNvdXBvbnNbIDAgXSA6IFsgXVxuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgcmV0dXJuIGN0eC5ib2R5ID0ge1xuICAgICAgICAgICAgICAgIHN0YXR1czogMjAwLFxuICAgICAgICAgICAgICAgIGRhdGE6IHVzZXJPZGVyc1xuICAgICAgICAgICAgfVxuXG4gICAgICAgIH0gY2F0Y2ggKCBlICkge1xuICAgICAgICAgICAgY29uc29sZS5sb2coICcuLi4nLCBlICk7XG4gICAgICAgICAgICByZXR1cm4gY3R4LmJvZHkgPSB7IHN0YXR1czogNTAwIH07XG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgIC8qKlxuICAgICAqIEBkZXNjcmlwdGlvblxuICAgICAqIOS7jua4heW4kOWCrOasvu+8jOiwg+aVtOiuouWNleWIhumFjemHj1xuICAgICAqIHtcbiAgICAgKiAgICAgIG9pZCwgdGlkLCBzaWQsIHBpZCwgY291bnRcbiAgICAgKiB9XG4gICAgICovXG4gICAgYXBwLnJvdXRlcignYWRqdXN0LWNvdW50JywgYXN5bmMoIGN0eCwgbmV4dCApID0+IHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGNvbnN0IG9wZW5pZCA9IGV2ZW50LmRhdGEub3BlbklkIHx8IGV2ZW50LnVzZXJJbmZvLm9wZW5JZDsgXG4gICAgICAgICAgICBjb25zdCB7IG9pZCwgdGlkLCBzaWQsIHBpZCwgY291bnQgfSA9IGV2ZW50LmRhdGE7XG5cbiAgICAgICAgICAgIGNvbnN0IGdldFdyb25nID0gbWVzc2FnZSA9PiBjdHguYm9keSA9IHtcbiAgICAgICAgICAgICAgICBtZXNzYWdlLFxuICAgICAgICAgICAgICAgIHN0YXR1czogNDAwXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICog5piv5ZCm6IO957un57ut6LCD5pW0XG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIGNvbnN0IG9yZGVyJCA9IGF3YWl0IGRiLmNvbGxlY3Rpb24oJ29yZGVyJylcbiAgICAgICAgICAgICAgICAuZG9jKCBvaWQgKVxuICAgICAgICAgICAgICAgIC5nZXQoICk7XG5cbiAgICAgICAgICAgIGlmICggb3JkZXIkLmRhdGEuYmFzZV9zdGF0dXMgPT09ICcyJyApIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZ2V0V3JvbmcoJ+WCrOasvuWQjuS4jeiDveS/ruaUueaVsOmHjycpO1xuXG4gICAgICAgICAgICB9IGVsc2UgaWYgKCBvcmRlciQuZGF0YS5iYXNlX3N0YXR1cyA9PT0gJzAnICkge1xuICAgICAgICAgICAgICAgIHJldHVybiBnZXRXcm9uZygn6K+35YWI6LCD5pW06K+l5ZWG5ZOB5Lu35qC8Jyk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICog5LiN6IO95aSa5LqO5riF5Y2V5YiG6YWN55qE5oC76LSt5YWl6YePXG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIGNvbnN0IHNob3BwaW5nJCA9IGF3YWl0IGRiLmNvbGxlY3Rpb24oJ3Nob3BwaW5nLWxpc3QnKVxuICAgICAgICAgICAgICAgIC53aGVyZSh7XG4gICAgICAgICAgICAgICAgICAgIHRpZCwgc2lkLCBwaWRcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIC5nZXQoICk7XG4gICAgICAgICAgICBjb25zdCBzaG9wcGluZyA9IHNob3BwaW5nJC5kYXRhWyAwIF07XG4gICAgICAgICAgICBjb25zdCBsYXN0T3JkZXJzJCA9IGF3YWl0IGRiLmNvbGxlY3Rpb24oJ29yZGVyJylcbiAgICAgICAgICAgICAgICAud2hlcmUoe1xuICAgICAgICAgICAgICAgICAgICB0aWQsIHNpZCwgcGlkLFxuICAgICAgICAgICAgICAgICAgICBwYXlfc3RhdHVzOiBfLm5lcSgnMCcpLFxuICAgICAgICAgICAgICAgICAgICBiYXNlX3N0YXR1czogXy5vciggXy5lcSgnMScpLCBfLmVxKCcyJyksIF8uZXEoJzMnKSlcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIC5nZXQoICk7XG5cbiAgICAgICAgICAgIGNvbnN0IGxhc3RPcmRlcnMgPSBsYXN0T3JkZXJzJC5kYXRhO1xuICAgICAgICAgICAgY29uc3Qgb3RoZXJDb3VudDogYW55ID0gbGFzdE9yZGVyc1xuICAgICAgICAgICAgICAgIC5maWx0ZXIoIG8gPT4gby5faWQgIT09IG9pZCApXG4gICAgICAgICAgICAgICAgLnJlZHVjZSgoIHgsIHkgKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB4ICsgeS5hbGxvY2F0ZWRDb3VudCB8fCAwXG4gICAgICAgICAgICAgICAgfSwgMCApO1xuXG4gICAgICAgICAgICBpZiAoIGNvdW50ICsgb3RoZXJDb3VudCA+IHNob3BwaW5nLnB1cmNoYXNlICkge1xuICAgICAgICAgICAgICAgIHJldHVybiBnZXRXcm9uZyhg6K+l5ZWG5ZOB5oC75pWw6YeP5LiN6IO95aSn5LqO6YeH6LSt5pWwJHtzaG9wcGluZy5wdXJjaGFzZX3ku7bvvIFgKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLyoqIOabtOaWsOiuouWNlSAqL1xuICAgICAgICAgICAgYXdhaXQgZGIuY29sbGVjdGlvbignb3JkZXInKVxuICAgICAgICAgICAgICAgIC5kb2MoIG9pZCApXG4gICAgICAgICAgICAgICAgLnVwZGF0ZSh7XG4gICAgICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGFsbG9jYXRlZENvdW50OiBjb3VudFxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICog5pu05paw5riF5Y2VXG4gICAgICAgICAgICAgKiDlsJHkuo7mgLvotK3lhaXph4/ml7bvvIzph43mlrDosIPmlbTmuIXljZXnmoTliankvZnliIbphY3ph49cbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgaWYgKCBjb3VudCArIG90aGVyQ291bnQgPCBzaG9wcGluZy5wdXJjaGFzZSApIHtcblxuICAgICAgICAgICAgICAgIGNvbnN0IG5ld3Nob3BwaW5nID0gT2JqZWN0LmFzc2lnbih7IH0sIHNob3BwaW5nLCB7XG4gICAgICAgICAgICAgICAgICAgIGxhc3RBbGxvY2F0ZWQ6IHNob3BwaW5nLnB1cmNoYXNlIC0gKCBjb3VudCArIG90aGVyQ291bnQgKVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIGRlbGV0ZSBuZXdzaG9wcGluZ1snX2lkJ107XG5cbiAgICAgICAgICAgICAgICBhd2FpdCBkYi5jb2xsZWN0aW9uKCdzaG9wcGluZy1saXN0JylcbiAgICAgICAgICAgICAgICAgICAgLmRvYyggU3RyaW5nKCBzaG9wcGluZy5faWQgKSlcbiAgICAgICAgICAgICAgICAgICAgLnNldCh7XG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRhOiBuZXdzaG9wcGluZ1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIGN0eC5ib2R5ID0ge1xuICAgICAgICAgICAgICAgIHN0YXR1czogMjAwXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBcbiAgICAgICAgfSBjYXRjaCAoIGUgKSB7XG4gICAgICAgICAgICByZXR1cm4gY3R4LmJvZHkgPSB7IHN0YXR1czogNTAwIH1cbiAgICAgICAgfVxuICAgIH0pXG5cbiAgICAvKipcbiAgICAgKiBAZGVzY3JpcHRpb25cbiAgICAgKiDmibnph4/lnLDvvJrnoa7orqTlrqLmiLforqLljZXjgIHmmK/lkKblm6LotK3jgIHmtojmga/mjqjpgIHmk43kvZxcbiAgICAgKiB7XG4gICAgICogICAgdGlkLFxuICAgICAqICAgIG9yZGVyczoge1xuICAgICAqICAgICAgICBvaWRcbiAgICAgKiAgICAgICAgcGlkXG4gICAgICogICAgICAgIHNpZFxuICAgICAqICAgICAgICBvcGVuaWRcbiAgICAgKiAgICAgICAgcHJlcGF5X2lkXG4gICAgICogICAgICAgIGZvcm1faWRcbiAgICAgKiAgICAgICAgYWxsb2NhdGVkQ291bnRcbiAgICAgKiAgICAgICAgYWxsb2NhdGVkR3JvdXBQcmljZVxuICAgICAqICAgIH1bIF1cbiAgICAgKiAgICBub3RpZmljYXRpb246IHsgXG4gICAgICogICAgICAgdGl0bGUsXG4gICAgICogICAgICAgZGVzYyxcbiAgICAgKiAgICAgICB0aW1lXG4gICAgICogICAgfVxuICAgICAqIH1cbiAgICAgKi9cbiAgICBhcHAucm91dGVyKCdiYXRjaC1hZGp1c3QnLCBhc3luYyggY3R4LCBuZXh0ICkgPT4ge1xuICAgICAgICB0cnkge1xuXG4gICAgICAgICAgICAvKiog5piv5ZCm6IO95ou85ZuiICovXG4gICAgICAgICAgICBsZXQgY2FuR3JvdXBVc2VyTWFwQ291bnQ6IHtcbiAgICAgICAgICAgICAgICBbIGs6IHN0cmluZyBdIDogbnVtYmVyXG4gICAgICAgICAgICB9ID0geyB9O1xuXG4gICAgICAgICAgICBjb25zdCB7IHRpZCwgb3JkZXJzLCBub3RpZmljYXRpb24gfSA9IGV2ZW50LmRhdGE7XG4gICAgICAgICAgICBjb25zdCBnZXRXcm9uZyA9IG1lc3NhZ2UgPT4gY3R4LmJvZHkgPSB7XG4gICAgICAgICAgICAgICAgbWVzc2FnZSxcbiAgICAgICAgICAgICAgICBzdGF0dXM6IDQwMFxuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgY29uc3QgdHJpcCQgPSBhd2FpdCBkYi5jb2xsZWN0aW9uKCd0cmlwJylcbiAgICAgICAgICAgICAgICAuZG9jKCB0aWQgKVxuICAgICAgICAgICAgICAgIC5nZXQoICk7XG4gICAgICAgICAgICBjb25zdCB0cmlwID0gdHJpcCQuZGF0YTtcblxuICAgICAgICAgICAgLy8g5pyq57uT5p2f77yM5LiU5pyq5omL5Yqo5YWz6ZetXG4gICAgICAgICAgICBpZiAoIGdldE5vdyggdHJ1ZSApIDwgdHJpcC5lbmRfZGF0ZSAmJiAhdHJpcC5pc0Nsb3NlZCApIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZ2V0V3JvbmcoJ+ihjOeoi+acque7k+adn++8jOivt+aJi+WKqOWFs+mXreW9k+WJjeihjOeoiycpO1xuXG4gICAgICAgICAgICB9IGVsc2UgaWYgKCB0cmlwLmNhbGxNb25leVRpbWVzICYmICB0cmlwLmNhbGxNb25leVRpbWVzID49IDMgKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGdldFdyb25nKGDlt7Lnu4/lj5Hotbfov4cke3RyaXAuY2FsbE1vbmV5VGltZXN95qyh5YKs5qy+YCk7XG5cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8g5pu05paw6K6i5Y2VXG4gICAgICAgICAgICBhd2FpdCBQcm9taXNlLmFsbCggb3JkZXJzLm1hcCggb3JkZXIgPT4ge1xuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIC8vIOacieWboui0reS7t+OAgeWkp+S6jjLkurrotK3kubDvvIzkuJTooqvliIbphY3mlbDlnYflpKfkuo4w77yM6K+l6K6i5Y2V5omN6L6+5Yiw4oCc5Zui6LSt4oCd55qE5p2h5Lu2XG4gICAgICAgICAgICAgICAgY29uc3QgY2FuR3JvdXAgPSAhIW9yZGVycy5maW5kKCBvID0+IHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG8ub2lkICE9PSBvcmRlci5vaWQgJiZcbiAgICAgICAgICAgICAgICAgICAgICAgIG8ub3BlbmlkICE9PSBvcmRlci5vcGVuaWQgJiYgXG4gICAgICAgICAgICAgICAgICAgICAgICBvLnBpZCA9PT0gb3JkZXIucGlkICYmIG8uc2lkID09PSBvcmRlci5zaWQgJiZcbiAgICAgICAgICAgICAgICAgICAgICAgIG8uYWxsb2NhdGVkQ291bnQgPiAwICYmIG9yZGVyLmFsbG9jYXRlZENvdW50ID4gMCAmJlxuICAgICAgICAgICAgICAgICAgICAgICAgISFvLmFsbG9jYXRlZEdyb3VwUHJpY2VcbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgIGlmICggY2FuR3JvdXAgKSB7XG4gICAgICAgICAgICAgICAgICAgIGNhbkdyb3VwVXNlck1hcENvdW50ID0gT2JqZWN0LmFzc2lnbih7IH0sIGNhbkdyb3VwVXNlck1hcENvdW50LCB7XG4gICAgICAgICAgICAgICAgICAgICAgICBbIG9yZGVyLm9wZW5pZCBdOiBjYW5Hcm91cFVzZXJNYXBDb3VudFsgb3JkZXIub3BlbmlkIF0gPT09IHVuZGVmaW5lZCA/IDEgOiBjYW5Hcm91cFVzZXJNYXBDb3VudFsgb3JkZXIub3BlbmlkIF0gKyAxXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHJldHVybiBkYi5jb2xsZWN0aW9uKCdvcmRlcicpXG4gICAgICAgICAgICAgICAgICAgIC5kb2MoIG9yZGVyLm9pZCApXG4gICAgICAgICAgICAgICAgICAgIC51cGRhdGUoe1xuICAgICAgICAgICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhbkdyb3VwLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJhc2Vfc3RhdHVzOiAnMidcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIH0pKTtcblxuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiAh5pu05paw6LSt54mp5riF5Y2VXG4gICAgICAgICAgICAgKi9cblxuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiDmtojmga/mjqjpgIFcbiAgICAgICAgICAgICAqICHmnKrku5jlhajmrL7miY3lj5HpgIFcbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgY29uc3QgdXNlcnMgPSBBcnJheS5mcm9tKFxuICAgICAgICAgICAgICAgIG5ldyBTZXQoXG4gICAgICAgICAgICAgICAgICAgIG9yZGVyc1xuICAgICAgICAgICAgICAgICAgICAgICAgLm1hcCggb3JkZXIgPT4gb3JkZXIub3BlbmlkIClcbiAgICAgICAgICAgICAgICAgICAgICAgIC5maWx0ZXIoIG9wZW5pZCA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuICEhb3JkZXJzLmZpbmQoIG9yZGVyID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG9yZGVyLm9wZW5pZCA9PT0gb3BlbmlkICYmIFN0cmluZyggb3JkZXIucGF5X3N0YXR1cyApID09PSAnMSdcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgKTtcblxuICAgICAgICAgICAgLyoqIOaOqOmAgemAmuefpSAqL1xuICAgICAgICAgICAgY29uc3QgcnMgPSBhd2FpdCBQcm9taXNlLmFsbCggdXNlcnMubWFwKCBvcGVuaWQgPT4ge1xuXG4gICAgICAgICAgICAgICAgY29uc3QgdGFyZ2V0ID0gb3JkZXJzLmZpbmQoIG9yZGVyID0+IG9yZGVyLm9wZW5pZCA9PT0gb3BlbmlkICYmXG4gICAgICAgICAgICAgICAgICAgICghIW9yZGVyLnByZXBheV9pZCB8fCAhIW9yZGVyLmZvcm1faWQgKSk7XG5cbiAgICAgICAgICAgICAgICAvLyByZXR1cm4gY2xvdWQuY2FsbEZ1bmN0aW9uKHtcbiAgICAgICAgICAgICAgICAvLyAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgIC8vICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgIC8vICAgICAgICAgICAgIHRvdXNlcjogb3BlbmlkLFxuICAgICAgICAgICAgICAgIC8vICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAvLyAgICAgICAgICAgICAgICAgdGl0bGU6IGNhbkdyb3VwVXNlck1hcENvdW50WyBTdHJpbmcoIG9wZW5pZCApXSA/XG4gICAgICAgICAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgICAvLyBg5ou85ZuiJHsgY2FuR3JvdXBVc2VyTWFwQ291bnRbIFN0cmluZyggb3BlbmlkICldfeS7tu+8geaCqOi0reS5sOeahOWVhuWTgeW3suWIsOi0p2AgOlxuICAgICAgICAgICAgICAgIC8vICAgICAgICAgICAgICAgICAgICAgLy8gJ+aCqOi0reS5sOeahOWVhuWTgeW3suWIsOi0pycsXG4gICAgICAgICAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgICAn5Yiw6LSn5ZWm77yB5LuY5bC+5qy+77yM56uL5Y2z5Y+R6LSnJyA6IFxuICAgICAgICAgICAgICAgIC8vICAgICAgICAgICAgICAgICAgICAgJ+WIsOi0p+WVpu+8geS7mOWwvuasvu+8jOeri+WNs+WPkei0pycsXG4gICAgICAgICAgICAgICAgLy8gICAgICAgICAgICAgICAgIHRpbWU6IGBb6KGM56iLXSR7dHJpcC50aXRsZX1gXG4gICAgICAgICAgICAgICAgLy8gICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAvLyAgICAgICAgICAgICBmb3JtX2lkOiB0YXJnZXQucHJlcGF5X2lkIHx8IHRhcmdldC5mb3JtX2lkXG4gICAgICAgICAgICAgICAgLy8gICAgICAgICB9LFxuICAgICAgICAgICAgICAgIC8vICAgICAgICAgJHVybDogJ25vdGlmaWNhdGlvbi1nZXRtb25leSdcbiAgICAgICAgICAgICAgICAvLyAgICAgfSxcbiAgICAgICAgICAgICAgICAvLyAgICAgbmFtZTogJ2NvbW1vbidcbiAgICAgICAgICAgICAgICAvLyB9KTtcblxuICAgICAgICAgICAgICAgIHJldHVybiBjbG91ZC5jYWxsRnVuY3Rpb24oe1xuICAgICAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb3BlbmlkLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6ICdnZXRNb25leScsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJlcGF5X2lkOiB0YXJnZXQucHJlcGF5X2lkLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRleHRzOiBbJ+aUr+S7mOWwvuasvu+8jOeri+WNs+WPkei0p+WTpicsJ+i2iuW/q+i2iuWlvSddXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgJHVybDogJ3B1c2gtdGVtcGxhdGUnXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIG5hbWU6ICdjb21tb24nXG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIH0pKTtcbiBcbiAgICAgICAgICAgIC8vIOabtOaWsOihjOeoi1xuICAgICAgICAgICAgYXdhaXQgZGIuY29sbGVjdGlvbigndHJpcCcpXG4gICAgICAgICAgICAgICAgLmRvYyggdGlkIClcbiAgICAgICAgICAgICAgICAudXBkYXRlKHtcbiAgICAgICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgICAgICAgY2FsbE1vbmV5VGltZXM6IF8uaW5jKCAxIClcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICByZXR1cm4gY3R4LmJvZHkgPSB7XG4gICAgICAgICAgICAgICAgc3RhdHVzOiAyMDAsXG4gICAgICAgICAgICAgICAgLy8g5Ymp5L2Z5qyh5pWwXG4gICAgICAgICAgICAgICAgZGF0YTogMyAtICggMSArIHRyaXAuY2FsbE1vbmV5VGltZXMgKVxuICAgICAgICAgICAgfVxuXG4gICAgICAgIH0gY2F0Y2ggKCBlICkge1xuICAgICAgICAgICAgcmV0dXJuIGN0eC5ib2R5ID0geyBzdGF0dXM6IDUwMCB9O1xuICAgICAgICB9XG4gICAgfSlcblxuICAgIC8qKiBcbiAgICAgKiBAZGVzY3JpcHRpb25cbiAgICAgKiDorqLljZXku5jlsL7mrL5cbiAgICAgKiB7XG4gICAgICogICAgICB0aWQgLy8g6aKG5Luj6YeR5Yi4XG4gICAgICogICAgICBpbnRlZ3JhbCAvLyDnp6/liIbmgLvpop3vvIh1c2Vy6KGo77yJXG4gICAgICogICAgICBvcmRlcnM6IFt7ICBcbiAgICAgKiAgICAgICAgICBvaWQgLy8g6K6i5Y2V54q25oCBXG4gICAgICogICAgICAgICAgcGlkXG4gICAgICogICAgICAgICAgZmluYWxfcHJpY2UgLy8g5pyA57uI5oiQ5Lqk6aKdXG4gICAgICogICAgICAgICAgYWxsb2NhdGVkQ291bnQgLy8g5pyA57uI5oiQ5Lqk6YePXG4gICAgICogICAgICB9XVxuICAgICAqICAgICAgY291cG9uczogWyAvLyDljaHliLjmtojotLlcbiAgICAgKiAgICAgICAgICBpZDEsXG4gICAgICogICAgICAgICAgaWQyLi4uXG4gICAgICogICAgICBdXG4gICAgICogfVxuICAgICAqL1xuICAgIGFwcC5yb3V0ZXIoJ3BheS1sYXN0JywgYXN5bmMoIGN0eCwgbmV4dCApID0+IHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGNvbnN0IG9wZW5pZCA9IGV2ZW50LnVzZXJJbmZvLm9wZW5JZDtcbiAgICAgICAgICAgIGNvbnN0IHsgdGlkLCBpbnRlZ3JhbCwgb3JkZXJzLCBjb3Vwb25zIH0gPSBldmVudC5kYXRhO1xuXG4gICAgICAgICAgICBjb25zdCB1c2VyJCA9IGF3YWl0IGRiLmNvbGxlY3Rpb24oJ3VzZXInKVxuICAgICAgICAgICAgICAgIC53aGVyZSh7XG4gICAgICAgICAgICAgICAgICAgIG9wZW5pZFxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLmdldCggKTtcblxuICAgICAgICAgICAgLy8g5aKe5Yqg56ev5YiG5oC76aKdXG4gICAgICAgICAgICBhd2FpdCBkYi5jb2xsZWN0aW9uKCd1c2VyJylcbiAgICAgICAgICAgICAgICAuZG9jKCBTdHJpbmcoIHVzZXIkLmRhdGFbIDAgXS5faWQgKSlcbiAgICAgICAgICAgICAgICAudXBkYXRlKHtcbiAgICAgICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgICAgICAgaW50ZWdyYWw6IF8uaW5jKCBpbnRlZ3JhbCApXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgLy8g5pu05paw6K6i5Y2V54q25oCB44CB5ZWG5ZOB6ZSA6YePXG4gICAgICAgICAgICBhd2FpdCBQcm9taXNlLmFsbCggb3JkZXJzLm1hcCggb3JkZXIgPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiBQcm9taXNlLmFsbChbXG4gICAgICAgICAgICAgICAgICAgIGRiLmNvbGxlY3Rpb24oJ29yZGVyJylcbiAgICAgICAgICAgICAgICAgICAgICAgIC5kb2MoIG9yZGVyLm9pZCApXG4gICAgICAgICAgICAgICAgICAgICAgICAudXBkYXRlKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJhc2Vfc3RhdHVzOiAnMycsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBheV9zdGF0dXM6ICcyJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZmluYWxfcHJpY2U6IG9yZGVyLmZpbmFsX3ByaWNlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXl0aW1lOiBnZXROb3coIHRydWUgKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH0pLFxuICAgICAgICAgICAgICAgICAgICBkYi5jb2xsZWN0aW9uKCdnb29kcycpXG4gICAgICAgICAgICAgICAgICAgICAgICAuZG9jKCBvcmRlci5waWQgKVxuICAgICAgICAgICAgICAgICAgICAgICAgLnVwZGF0ZSh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzYWxlZDogXy5pbmMoIG9yZGVyLmFsbG9jYXRlZENvdW50IClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIF0pXG4gICAgICAgICAgICB9KSk7XG5cbiAgICAgICAgICAgIC8vIOabtOaWsOWNoeWIuOS9v+eUqOeKtuaAgVxuICAgICAgICAgICAgYXdhaXQgUHJvbWlzZS5hbGwoIGNvdXBvbnMubWFwKCBjb3Vwb25pZCA9PiB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGRiLmNvbGxlY3Rpb24oJ2NvdXBvbicpXG4gICAgICAgICAgICAgICAgICAgIC5kb2MoIGNvdXBvbmlkIClcbiAgICAgICAgICAgICAgICAgICAgLnVwZGF0ZSh7XG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaXNVc2VkOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHVzZWRCeTogdGlkLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhblVzZUluTmV4dDogZmFsc2VcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIH0pKTtcblxuICAgICAgICAgICAgLy8g6L6+5Yiw5p2h5Lu277yM5YiZ6aKG5Y+W5Luj6YeR5Yi4XG4gICAgICAgICAgICAvLyDlkIzml7bliKDpmaTkuIrkuIDkuKrmnKrkvb/nlKjov4fnmoTku6Pph5HliLhcbiAgICAgICAgICAgIGNvbnN0IHRyaXAkID0gYXdhaXQgZGIuY29sbGVjdGlvbigndHJpcCcpXG4gICAgICAgICAgICAgICAgLmRvYyggdGlkIClcbiAgICAgICAgICAgICAgICAuZ2V0KCApO1xuXG4gICAgICAgICAgICBsZXQgcmVxID0ge1xuICAgICAgICAgICAgICAgIHJlc3VsdDoge1xuICAgICAgICAgICAgICAgICAgICBzdGF0dXM6IDUwMFxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIFxuICAgICAgICAgICAgY29uc3QgeyBjYXNoY291cG9uX2F0bGVhc3QsIGNhc2hjb3Vwb25fdmFsdWVzIH0gPSB0cmlwJC5kYXRhO1xuXG4gICAgICAgICAgICBjb25zdCB0ZW1wID0ge1xuICAgICAgICAgICAgICAgIG9wZW5JZDogb3BlbmlkLFxuICAgICAgICAgICAgICAgIGZyb210aWQ6IHRpZCxcbiAgICAgICAgICAgICAgICB0eXBlOiAndF9kYWlqaW4nLFxuICAgICAgICAgICAgICAgIHRpdGxlOiAn6KGM56iL5Luj6YeR5Yi4JyxcbiAgICAgICAgICAgICAgICBjYW5Vc2VJbk5leHQ6IHRydWUsXG4gICAgICAgICAgICAgICAgaXNVc2VkOiBmYWxzZSxcbiAgICAgICAgICAgICAgICBhdGxlYXN0OiBjYXNoY291cG9uX2F0bGVhc3QgfHwgMCxcbiAgICAgICAgICAgICAgICB2YWx1ZTogY2FzaGNvdXBvbl92YWx1ZXNcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIC8vIOaXoOmcgOmXqOanm++8jOacieS7o+mHkeWIuOWNs+WPr+mihuWPllxuICAgICAgICAgICAgaWYgKCAhIWNhc2hjb3Vwb25fdmFsdWVzICkge1xuXG4gICAgICAgICAgICAgICAgLy8g5Yig6Zmk5LiK5LiA5Liq5pyq5L2/55So55qE5Luj6YeR5Yi4XG4gICAgICAgICAgICAgICAgY29uc3QgbGFzdERhaWppbiQgPSBhd2FpdCBkYi5jb2xsZWN0aW9uKCdjb3Vwb24nKVxuICAgICAgICAgICAgICAgICAgICAud2hlcmUoe1xuICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogJ3RfZGFpamluJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGlzVXNlZDogZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgICAgICBjYW5Vc2VJbk5leHQ6IHRydWVcbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgLmdldCggKTtcblxuICAgICAgICAgICAgICAgIGlmICggbGFzdERhaWppbiQuZGF0YVsgMCBdKSB7XG4gICAgICAgICAgICAgICAgICAgIGF3YWl0IGRiLmNvbGxlY3Rpb24oJ2NvdXBvbicpXG4gICAgICAgICAgICAgICAgICAgICAgICAuZG9jKCBTdHJpbmcoIGxhc3REYWlqaW4kLmRhdGFbIDAgXS5faWQgKSlcbiAgICAgICAgICAgICAgICAgICAgICAgIC5yZW1vdmUoICk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgLy8g6aKG5Y+W5Luj6YeR5Yi4XG4gICAgICAgICAgICAgICAgcmVxID0gYXdhaXQgY2xvdWQuY2FsbEZ1bmN0aW9uKHtcbiAgICAgICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgICAgICAgZGF0YTogdGVtcCxcbiAgICAgICAgICAgICAgICAgICAgICAgICR1cmw6ICdjcmVhdGUnXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIG5hbWU6ICdjb3Vwb24nXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiBjdHguYm9keSA9IHtcbiAgICAgICAgICAgICAgICBzdGF0dXM6IDIwMCxcbiAgICAgICAgICAgICAgICBkYXRhOiByZXEucmVzdWx0LnN0YXR1cyA9PT0gMjAwID8gdGVtcCA6IG51bGwgXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfSBjYXRjaCAoIGUgKSB7XG4gICAgICAgICAgICByZXR1cm4gY3R4LmJvZHkgPSB7IHN0YXR1czogNTAwIH1cbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgLyoqIFxuICAgICAqIEBkZXNjcmlwdGlvblxuICAgICAqIOS7o+i0reiOt+WPluacquivu+iuouWNlVxuICAgICAqL1xuICAgIGFwcC5yb3V0ZXIoJ3VucmVhZCcsIGFzeW5jKCBjdHgsIG5leHQgKSA9PiB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBjb25zdCB7IHRpZCwgbGFzdFRpbWUgfSA9IGV2ZW50LmRhdGE7XG4gICAgICAgICAgICBsZXQgd2hlcmUkID0ge1xuICAgICAgICAgICAgICAgIHRpZFxuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgaWYgKCBsYXN0VGltZSApIHtcbiAgICAgICAgICAgICAgICB3aGVyZSQgPSBPYmplY3QuYXNzaWduKHsgfSwgd2hlcmUkLCB7XG4gICAgICAgICAgICAgICAgICAgIGNyZWF0ZXRpbWU6IF8uZ3RlKCBsYXN0VGltZSApXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGNvbnN0IGRhdGEkID0gYXdhaXQgZGIuY29sbGVjdGlvbignb3JkZXInKVxuICAgICAgICAgICAgICAgIC53aGVyZSggd2hlcmUkIClcbiAgICAgICAgICAgICAgICAuY291bnQoICk7XG5cbiAgICAgICAgICAgIHJldHVybiBjdHguYm9keSA9IHtcbiAgICAgICAgICAgICAgICBzdGF0dXM6IDIwMCxcbiAgICAgICAgICAgICAgICBkYXRhOiBkYXRhJC50b3RhbFxuICAgICAgICAgICAgfVxuXG4gICAgICAgIH0gY2F0Y2ggKCBlICkgeyByZXR1cm4gY3R4LmJvZHkgPSB7IHN0YXR1czogNTAwIH07fVxuICAgIH0pO1xuXG4gICAgLyoqIFxuICAgICAqIEBkZXNjcmlwdGlvblxuICAgICAqIOS7o+i0reafpeeci+aJgOacieeahOiuouWNleWIl+ihqFxuICAgICAqL1xuICAgIGFwcC5yb3V0ZXIoJ2xpc3QtYWxsJywgYXN5bmMoIGN0eCwgbmV4dCApID0+IHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIC8vIOafpeivouadoeaVsFxuICAgICAgICAgICAgY29uc3QgbGltaXQgPSAxMDtcbiAgICAgICAgICAgIGNvbnN0IHsgdGlkLCBwYWdlIH0gPSBldmVudC5kYXRhO1xuXG4gICAgICAgICAgICBjb25zdCB3aGVyZSQgPSB7XG4gICAgICAgICAgICAgICAgdGlkLFxuICAgICAgICAgICAgICAgIHBheV9zdGF0dXM6IF8ubmVxKCcwJylcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIGNvbnN0IHRvdGFsJCA9IGF3YWl0IGRiLmNvbGxlY3Rpb24oJ29yZGVyJylcbiAgICAgICAgICAgICAgICAud2hlcmUoIHdoZXJlJCApXG4gICAgICAgICAgICAgICAgLmNvdW50KCApO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICBjb25zdCBvcmRlcnMkID0gYXdhaXQgZGIuY29sbGVjdGlvbignb3JkZXInKVxuICAgICAgICAgICAgICAgIC53aGVyZSggd2hlcmUkIClcbiAgICAgICAgICAgICAgICAubGltaXQoIGxpbWl0IClcbiAgICAgICAgICAgICAgICAuc2tpcCgoIHBhZ2UgLSAxICkgKiBsaW1pdCApXG4gICAgICAgICAgICAgICAgLm9yZGVyQnkoJ2NyZWF0ZVRpbWUnLCAnZGVzYycpXG4gICAgICAgICAgICAgICAgLmdldCggKTtcblxuICAgICAgICAgICAgY29uc3QgcGlkcyA9IEFycmF5LmZyb20oXG4gICAgICAgICAgICAgICAgbmV3IFNldCggXG4gICAgICAgICAgICAgICAgICAgIG9yZGVycyQuZGF0YVxuICAgICAgICAgICAgICAgICAgICAgICAgLm1hcCggeCA9PiB4LnBpZCApXG4gICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgKTtcblxuICAgICAgICAgICAgY29uc3Qgc2lkcyA9IEFycmF5LmZyb20oXG4gICAgICAgICAgICAgICAgbmV3IFNldCggXG4gICAgICAgICAgICAgICAgICAgIG9yZGVycyQuZGF0YVxuICAgICAgICAgICAgICAgICAgICAgICAgLm1hcCggeCA9PiB4LnNpZCApXG4gICAgICAgICAgICAgICAgICAgICAgICAuZmlsdGVyKCB4ID0+ICEheCApXG4gICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgKTtcblxuICAgICAgICAgICAgY29uc3QgdWlkcyA9IEFycmF5LmZyb20oXG4gICAgICAgICAgICAgICAgbmV3IFNldCggXG4gICAgICAgICAgICAgICAgICAgIG9yZGVycyQuZGF0YVxuICAgICAgICAgICAgICAgICAgICAgICAgLm1hcCggeCA9PiB4Lm9wZW5pZCApXG4gICAgICAgICAgICAgICAgICAgICAgICAuZmlsdGVyKCB4ID0+ICEheCApXG4gICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgKTtcblxuICAgICAgICAgICAgLy8gY29uc3QgZ29vZHMkJCA9IGF3YWl0IFByb21pc2UuYWxsKFxuICAgICAgICAgICAgLy8gICAgIHBpZHMubWFwKCBcbiAgICAgICAgICAgIC8vICAgICAgICAgcGlkID0+IGRiLmNvbGxlY3Rpb24oJ2dvb2RzJylcbiAgICAgICAgICAgIC8vICAgICAgICAgICAgIC5kb2MoIFN0cmluZyggcGlkICkpXG4gICAgICAgICAgICAvLyAgICAgICAgICAgICAuZ2V0KCApXG4gICAgICAgICAgICAvLyAgICAgKVxuICAgICAgICAgICAgLy8gKTtcbiAgICAgICAgICAgIC8vIGNvbnN0IGdvb2RzJCA9IGdvb2RzJCQubWFwKCB4ID0+IHguZGF0YSApO1xuXG4gICAgICAgICAgICAvLyBjb25zdCBzdGFuZGFycyQkID0gYXdhaXQgUHJvbWlzZS5hbGwoXG4gICAgICAgICAgICAvLyAgICAgc2lkcy5tYXAoIFxuICAgICAgICAgICAgLy8gICAgICAgICBzaWQgPT4gZGIuY29sbGVjdGlvbignc3RhbmRhcmRzJylcbiAgICAgICAgICAgIC8vICAgICAgICAgICAgIC5kb2MoIFN0cmluZyggc2lkICkpXG4gICAgICAgICAgICAvLyAgICAgICAgICAgICAuZmllbGQoe1xuICAgICAgICAgICAgLy8gICAgICAgICAgICAgICAgIHBpZDogdHJ1ZSxcbiAgICAgICAgICAgIC8vICAgICAgICAgICAgICAgICBuYW1lOiB0cnVlXG4gICAgICAgICAgICAvLyAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgLy8gICAgICAgICAgICAgLmdldCggKVxuICAgICAgICAgICAgLy8gICAgIClcbiAgICAgICAgICAgIC8vICk7XG4gICAgICAgICAgICAvLyBjb25zdCBzdGFuZGFycyQgPSBzdGFuZGFycyQkLm1hcCggeCA9PiB4LmRhdGEgKTtcblxuICAgICAgICAgICAgY29uc3QgdXNlcnMkJCA9IGF3YWl0IFByb21pc2UuYWxsKFxuICAgICAgICAgICAgICAgIHVpZHMubWFwKCBcbiAgICAgICAgICAgICAgICAgICAgb3BlbmlkID0+IGRiLmNvbGxlY3Rpb24oJ3VzZXInKVxuICAgICAgICAgICAgICAgICAgICAgICAgLndoZXJlKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvcGVuaWRcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgICAgICAuZmllbGQoe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9wZW5pZDogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhdmF0YXJVcmw6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbmlja05hbWU6IHRydWVcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgICAgICAuZ2V0KCApXG4gICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIGNvbnN0IHVzZXJzJCA9IHVzZXJzJCQubWFwKCB4ID0+IHguZGF0YVsgMCBdKTtcblxuICAgICAgICAgICAgY29uc3QgbWV0YSA9IG9yZGVycyQuZGF0YS5tYXAoIG9yZGVyID0+IHtcblxuICAgICAgICAgICAgICAgIGNvbnN0IHVzZXIgPSB1c2VycyQuZmluZCggdXNlciA9PiB1c2VyLm9wZW5pZCA9PT0gb3JkZXIub3BlbmlkICk7XG4gICAgICAgICAgICAgICAgLy8gY29uc3QgZGV0YWlsID0gZ29vZHMkLmZpbmQoIGdvb2QgPT4gZ29vZC5faWQgPT09IG9yZGVyLnBpZCApO1xuICAgICAgICAgICAgICAgIC8vIGNvbnN0IHN0YW5kYXIgPSBzdGFuZGFycyQuZmluZCggcyA9PiBzLl9pZCA9PT0gb3JkZXIuc2lkICk7XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gT2JqZWN0LmFzc2lnbih7IH0sIG9yZGVyLCB7XG4gICAgICAgICAgICAgICAgICAgIHVzZXIsXG4gICAgICAgICAgICAgICAgICAgIC8vIGRldGFpbCxcbiAgICAgICAgICAgICAgICAgICAgLy8gc3RhbmRhclxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgcmV0dXJuIGN0eC5ib2R5ID0ge1xuICAgICAgICAgICAgICAgIHN0YXR1czogMjAwLFxuICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgcGFnZSxcbiAgICAgICAgICAgICAgICAgICAgcGFnZVNpemU6IGxpbWl0LFxuICAgICAgICAgICAgICAgICAgICBkYXRhOiBtZXRhLFxuICAgICAgICAgICAgICAgICAgICB0b3RhbDogdG90YWwkLnRvdGFsLFxuICAgICAgICAgICAgICAgICAgICB0b3RhbFBhZ2U6IE1hdGguY2VpbCggdG90YWwkLnRvdGFsIC8gbGltaXQgKVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuXG4gICAgICAgIH0gY2F0Y2ggKCBlICkgeyBcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCc/Pz8nLCBlIClcbiAgICAgICAgICAgIHJldHVybiBjdHguYm9keSA9IHsgc3RhdHVzOiA1MDAgfVxuICAgICAgICB9XG4gICAgfSlcbiBcbiAgIHJldHVybiBhcHAuc2VydmUoICk7XG5cbn1cblxuLyoqIOagueaNruexu+Wei++8jOi/lOWbnuaOqOmAgeaWh+ahiCAqL1xuZnVuY3Rpb24gZ2V0VGV4dEJ5UHVzaFR5cGUoIHR5cGU6ICdidXlQaW4xJyB8ICdidXlQaW4yJyB8ICd3YWl0UGluJyB8ICdidXknIHwgJ2dldE1vbmV5JywgZGVsdGEgKSB7XG5cbiAgICBjb25zdCBub3cgPSBnZXROb3coICk7XG4gICAgY29uc3QgbW9udGggPSBub3cuZ2V0TW9udGgoICkgKyAxO1xuICAgIGNvbnN0IGRhdGUgPSBub3cuZ2V0RGF0ZSggKTtcbiAgICBjb25zdCBob3VyID0gbm93LmdldEhvdXJzKCApO1xuICAgIGNvbnN0IG1pbnV0ZXMgPSBub3cuZ2V0TWludXRlcyggKTtcblxuICAgIGNvbnN0IGZpeFplcm8gPSBzID0+IFN0cmluZyggcyApLmxlbmd0aCA9PT0gMSA/IGAwJHtzfWAgOiBzOyBcblxuICAgIGlmICggdHlwZSA9PT0gJ2J1eScgKSB7XG4gICAgICAgIHJldHVybiBbXG4gICAgICAgICAgICBg5LiL5Y2V5oiQ5Yqf77yB5Lya5bC95b+r6YeH6LSt772eYCwgXG4gICAgICAgICAgICBgJHttb250aH3mnIgke2RhdGV95pelICR7aG91cn06JHtmaXhaZXJvKCBtaW51dGVzICl9YFxuICAgICAgICBdO1xuICAgIH0gZWxzZSBpZiAoIHR5cGUgPT09ICdidXlQaW4xJyApIHtcbiAgICAgICAgcmV0dXJuIFtcbiAgICAgICAgICAgIGDmga3llpzmgqjnnIHkuoYke2RlbHRhfeWFg++8gWAsXG4gICAgICAgICAgICBg5oKo5ZKM5YW25LuW5Lq65Lmw5LqG5ZCM5qy+5ou85Zui5ZWG5ZOB77yM5p+l55yLYFxuICAgICAgICBdXG4gICAgfSBlbHNlIGlmICggdHlwZSA9PT0gJ2J1eVBpbjInICkge1xuICAgICAgICByZXR1cm4gW1xuICAgICAgICAgICAgYOaBreWWnO+8geaCqOS5sOeahOWVhuWTgeWHj+S6hiR7ZGVsdGF95YWDIWAsXG4gICAgICAgICAgICBg5pyJ5Lq66LSt5Lmw5LqG5ZCM5qy+5ou85Zui55qE5ZWG5ZOB77yM5p+l55yLYFxuICAgICAgICBdXG4gICAgfSBlbHNlIGlmICggdHlwZSA9PT0gJ3dhaXRQaW4nICkge1xuICAgICAgICByZXR1cm4gW1xuICAgICAgICAgICAgYOaCqOeahOWVhuWTgeWPr+WPguWKoOaLvOWbou+8gWAsXG4gICAgICAgICAgICBg5Y+C5Yqg5ou85Zui77yM5Y+v5Lul5YaN55yBJHtkZWx0YX3lhYPvvIFgXG4gICAgICAgIF1cbiAgICB9IGVsc2UgaWYgKCB0eXBlID09PSAnZ2V0TW9uZXknICkge1xuICAgICAgICByZXR1cm4gW1xuICAgICAgICAgICAgYOaUr+S7mOWwvuasvu+8jOeri+WNs+WPkei0p+WTpmAsXG4gICAgICAgICAgICBg6LaK5b+r6LaK5aW9YFxuICAgICAgICBdXG4gICAgfVxuICAgIHJldHVybiBbXVxufSJdfQ==