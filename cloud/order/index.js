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
            var _a, orderIds, prepay_id_1, find$, list, e_3;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 4, , 5]);
                        _a = event.data, orderIds = _a.orderIds, prepay_id_1 = _a.prepay_id;
                        return [4, Promise.all(orderIds.split(',').map(function (oid) {
                                return db.collection('order').doc(oid)
                                    .update({
                                    data: {
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
                                base_status: _.or(_.eq('1'), _.eq('2'), _.eq('3'))
                            })
                                .get()];
                    case 3:
                        lastOrders$ = _b.sent();
                        lastOrders = lastOrders$.data;
                        otherCount = lastOrders
                            .filter(function (o) { return o._id !== oid_1; })
                            .reduce(function (x, y) {
                            return x + y.allocatedCount;
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
        return [2, app.serve()];
    });
}); };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFDQSxpQkErdUJDOztBQS91QkQscUNBQXVDO0FBQ3ZDLHNDQUF3QztBQUN4QyxtQ0FBbUM7QUFFbkMsS0FBSyxDQUFDLElBQUksRUFBRyxDQUFDO0FBRWQsSUFBTSxFQUFFLEdBQWdCLEtBQUssQ0FBQyxRQUFRLEVBQUcsQ0FBQztBQUUxQyxJQUFNLENBQUMsR0FBRyxFQUFFLENBQUMsT0FBTyxDQUFDO0FBaUNSLFFBQUEsSUFBSSxHQUFHLFVBQVEsS0FBSyxFQUFFLE9BQU87Ozs7UUFFaEMsR0FBRyxHQUFHLElBQUksU0FBUyxDQUFDLEVBQUUsS0FBSyxPQUFBLEVBQUUsQ0FBQyxDQUFDO1FBZ0NyQyxHQUFHLENBQUMsTUFBTSxDQUFDLFFBQVEsRUFBRSxVQUFPLEdBQUcsRUFBRSxJQUFJOzs7Ozs7d0JBR3ZCLEtBQXdCLEtBQUssQ0FBQyxJQUFJLEVBQWhDLEdBQUcsU0FBQSxFQUFFLElBQUksVUFBQSxFQUFFLE1BQU0sWUFBQSxDQUFnQjt3QkFDbkMsV0FBUyxLQUFLLENBQUMsSUFBSSxDQUFDLE1BQU0sSUFBSSxLQUFLLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQzt3QkFHMUMsV0FBTSxLQUFLLENBQUMsWUFBWSxDQUFDO2dDQUNyQyxJQUFJLEVBQUU7b0NBQ0YsSUFBSSxFQUFFO3dDQUNGLEdBQUcsRUFBRSxHQUFHO3FDQUNYO29DQUNELElBQUksRUFBRSxRQUFRO2lDQUNqQjtnQ0FDRCxJQUFJLEVBQUUsTUFBTTs2QkFDZixDQUFDLEVBQUE7O3dCQVJJLE9BQU8sR0FBRyxTQVFkO3dCQUVJLE1BQU0sR0FBRyxPQUFPLENBQUMsTUFBTSxDQUFDO3dCQUM5QixJQUFLLE1BQU0sQ0FBQyxNQUFNLEtBQUssR0FBRzsrQkFDZixDQUFDLE1BQU0sQ0FBQyxJQUFJOytC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eC1zZXJ2ZXItc2RrJztcbmltcG9ydCAqIGFzIFRjYlJvdXRlciBmcm9tICd0Y2Itcm91dGVyJztcbmltcG9ydCB7IGNyZWF0ZSQgfSBmcm9tICcuL2NyZWF0ZSc7XG5cbmNsb3VkLmluaXQoICk7XG5cbmNvbnN0IGRiOiBEQi5EYXRhYmFzZSA9IGNsb3VkLmRhdGFiYXNlKCApO1xuXG5jb25zdCBfID0gZGIuY29tbWFuZDtcblxuLyoqXG4gKiBcbiAqIEBkZXNjcmlwdGlvbiDorqLljZXmqKHlnZdcbiAqIC0tLS0tLS0tIOWtl+autSAtLS0tLS0tLS0tXG4gKiBfaWRcbiAqIG9wZW5pZCxcbiAqIGNyZWF0ZXRpbWVcbiAqIHRpZCxcbiAqIHBpZCxcbiAqIGNpZCAo5Y+v5Li656m6KVxuICogc2lkLCAo5Y+v5Li656m6KVxuICogY291bnQsXG4gKiBwcmljZSxcbiAqIGdyb3VwUHJpY2UsXG4gKiBkZXBvc2l0X3ByaWNlOiDllYblk4HorqLph5EgKOWPr+S4uuepuilcbiAqICEgaXNPY2N1cGllZCwg5piv5ZCm5Y2g5bqT5a2YXG4gKiBncm91cF9wcmljZSAo5Y+v5Li656m6KVxuICogdHlwZTogJ2N1c3RvbScgfCAnbm9ybWFsJyB8ICdwcmUnIOiHquWumuS5ieWKoOWNleOAgeaZrumAmuWKoOWNleOAgemihOiuouWNlVxuICogaW1nOiBBcnJheVsgc3RyaW5nIF1cbiAqIGRlc2PvvIjlj6/kuLrnqbrvvIksXG4gKiBhaWRcbiAqIGFsbG9jYXRlZFByaWNlIOWIhumFjeeahOS7t+agvFxuICogYWxsb2NhdGVkR3JvdXBQcmljZSDliIbphY3lm6LotK3ku7dcbiAqIGFsbG9jYXRlZENvdW50IOWIhumFjeeahOaVsOmHj1xuICogZm9ybV9pZFxuICogcHJlcGF5X2lkLFxuICogISBmaW5hbF9wcmljZSDmnIDlkI7miJDkuqTku7dcbiAqICEgYmFzZV9zdGF0dXM6IDAsMSwyLDMsNCw1IOi/m+ihjOS4re+8iOWuouaIt+i/mOWPr+S7peiwg+aVtOiHquW3seeahOiuouWNle+8ie+8jOS7o+i0reW3sui0reS5sO+8jOW3suiwg+aVtO+8jOW3sue7k+eul++8jOW3suWPlua2iO+8iOS5sOS4jeWIsO+8ie+8jOW3sui/h+acn++8iOaUr+S7mOi/h+acn++8iVxuICogISBwYXlfc3RhdHVzOiAwLDEsMiDmnKrku5jmrL7vvIzlt7Lku5jorqLph5HvvIzlt7Lku5jlhajmrL5cbiAqICEgZGVsaXZlcl9zdGF0dXM6IDAsMSDmnKrlj5HluIPvvIzlt7Llj5HluIPjgIFcbiAqL1xuZXhwb3J0IGNvbnN0IG1haW4gPSBhc3luYyAoIGV2ZW50LCBjb250ZXh0ICkgPT4ge1xuXG4gICAgY29uc3QgYXBwID0gbmV3IFRjYlJvdXRlcih7IGV2ZW50IH0pO1xuXG4gICAgLyoqXG4gICAgICogQGRlc2NyaXB0aW9uIOWIm+W7uuiuouWNlVxuICAgICAqIC0tLS0tLS0tIOivt+axgiAtLS0tLS0tLS0tXG4gICAgICoge1xuICAgICAqICAgICAgdGlkLFxuICAgICAqICAgICAgb3BlbklkIC8vIOiuouWNleS4u+S6ulxuICAgICAqICAgICAgZnJvbTogJ2NhcnQnIHwgJ2J1eScgfCAnY3VzdG9tJyB8ICdhZ2VudHMnIHwgJ3N5c3RlbScg5p2l5rqQ77ya6LSt54mp6L2m44CB55u05o6l6LSt5Lmw44CB6Ieq5a6a5LmJ5LiL5Y2V44CB5Luj6LSt5LiL5Y2V44CB57O757uf5Y+R6LW36aKE5LuY6K6i5Y2VXG4gICAgICogICAgICBvcmRlcnM6IEFycmF5PHsgXG4gICAgICogICAgICAgICAgdGlkXG4gICAgICogICAgICAgICAgY2lkXG4gICAgICogICAgICAgICAgc2lkXG4gICAgICogICAgICAgICAgcGlkXG4gICAgICogICAgICAgICAgcHJpY2VcbiAgICAgKiAgICAgICAgICBuYW1lXG4gICAgICogICAgICAgICAgc3RhbmRlcm5hbWVcbiAgICAgKiAgICAgICAgICBncm91cFByaWNlXG4gICAgICogICAgICAgICAgY291bnRcbiAgICAgKiAgICAgICAgICBkZXNjXG4gICAgICogICAgICAgICAgaW1nXG4gICAgICogICAgICAgICAgdHlwZVxuICAgICAqICAgICAgICAgIHBheV9zdGF0dXMsXG4gICAgICogICAgICAgICAgYWRkcmVzczoge1xuICAgICAqICAgICAgICAgICAgICBuYW1lLFxuICAgICAqICAgICAgICAgICAgICBwaG9uZSxcbiAgICAgKiAgICAgICAgICAgICAgZGV0YWlsLFxuICAgICAqICAgICAgICAgICAgICBwb3N0YWxjb2RlXG4gICAgICogICAgICAgICAgfVxuICAgICAqICAgICAgfT5cbiAgICAgKiB9XG4gICAgICovXG4gICAgYXBwLnJvdXRlcignY3JlYXRlJywgYXN5bmMoIGN0eCwgbmV4dCApID0+IHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgY29uc3QgeyB0aWQsIGZyb20sIG9yZGVycyB9ID0gZXZlbnQuZGF0YTtcbiAgICAgICAgICAgIGNvbnN0IG9wZW5pZCA9IGV2ZW50LmRhdGEub3BlbklkIHx8IGV2ZW50LnVzZXJJbmZvLm9wZW5JZDtcblxuICAgICAgICAgICAgLy8gMeOAgeWIpOaWreivpeihjOeoi+aYr+WQpuWPr+S7peeUqFxuICAgICAgICAgICAgY29uc3QgdHJpcHMkJCA9IGF3YWl0IGNsb3VkLmNhbGxGdW5jdGlvbih7XG4gICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBfaWQ6IHRpZFxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAkdXJsOiAnZGV0YWlsJ1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgbmFtZTogJ3RyaXAnXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgY29uc3QgdHJpcHMkID0gdHJpcHMkJC5yZXN1bHQ7ICAgICAgICBcbiAgICAgICAgICAgIGlmICggdHJpcHMkLnN0YXR1cyAhPT0gMjAwXG4gICAgICAgICAgICAgICAgICAgIHx8ICF0cmlwcyQuZGF0YSBcbiAgICAgICAgICAgICAgICAgICAgfHwgKCAhIXRyaXBzJC5kYXRhICYmIHRyaXBzJC5kYXRhLmlzQ2xvc2VkICkgXG4gICAgICAgICAgICAgICAgICAgIHx8ICggISF0cmlwcyQuZGF0YSAmJiBuZXcgRGF0ZSggKS5nZXRUaW1lKCApID49IHRyaXBzJC5kYXRhLmVuZF9kYXRlICkpIHtcbiAgICAgICAgICAgICAgICB0aHJvdyAn5pqC5peg6KGM56iL6K6h5YiS77yM5pqC5pe25LiN6IO96LSt5Lmw772eJ1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyDmnIDmlrDlj6/nlKjooYznqItcbiAgICAgICAgICAgIGNvbnN0IHRyaXAgPSB0cmlwcyQuZGF0YTtcblxuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiDmoLnmja7lnLDlnYDlr7nosaHvvIzmi7/liLDlnLDlnYBpZFxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICBsZXQgYWRkcmVzc2lkJCA9IHtcbiAgICAgICAgICAgICAgICByZXN1bHQ6IHtcbiAgICAgICAgICAgICAgICAgICAgZGF0YTogbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgc3RhdHVzOiA1MDBcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAvLyDorqLljZXmnaXmupDvvJrotK3nianovabjgIHns7vnu5/liqDljZVcbiAgICAgICAgICAgIGlmICggZXZlbnQuZGF0YS5mcm9tID09PSAnY2FydCcgfHwgZXZlbnQuZGF0YS5mcm9tID09PSAnc3lzdGVtJyB8fCBldmVudC5kYXRhLmZyb20gPT09ICdidXknICkge1xuICAgICAgICAgICAgICAgIGFkZHJlc3NpZCQgPSBhd2FpdCBjbG91ZC5jYWxsRnVuY3Rpb24oe1xuICAgICAgICAgICAgICAgICAgICBkYXRhOiB7IFxuICAgICAgICAgICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9wZW5JZDogb3BlbmlkLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFkZHJlc3M6IGV2ZW50LmRhdGEub3JkZXJzWyAwIF0uYWRkcmVzc1xuICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICR1cmw6ICdnZXRBZGRyZXNzSWQnXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIG5hbWU6ICdhZGRyZXNzJ1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgXG4gICAgICAgICAgICAvLyDorqLljZXmnaXmupDvvJrotK3nianovabjgIHns7vnu5/liqDljZVcbiAgICAgICAgICAgIGlmICgoIGV2ZW50LmRhdGEuZnJvbSA9PT0gJ2NhcnQnIHx8IGV2ZW50LmRhdGEuZnJvbSA9PT0gJ3N5c3RlbScgKSAmJiBhZGRyZXNzaWQkLnJlc3VsdC5zdGF0dXMgIT09IDIwMCApIHtcbiAgICAgICAgICAgICAgICB0aHJvdyAn5p+l6K+i5Zyw5Z2A6ZSZ6K+vJztcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8g5Y+v55So5Zyw5Z2AaWRcbiAgICAgICAgICAgIGNvbnN0IGFpZCA9IGFkZHJlc3NpZCQucmVzdWx0LmRhdGE7XG5cbiAgICAgICAgICAgIC8vIOaYr+WQpuaWsOWuouaIt1xuICAgICAgICAgICAgY29uc3QgaXNOZXckID0gYXdhaXQgY2xvdWQuY2FsbEZ1bmN0aW9uKHtcbiAgICAgICAgICAgICAgICBuYW1lOiAnY29tbW9uJyxcbiAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICAgICR1cmw6ICdpcy1uZXctY3VzdG9tZXInLFxuICAgICAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBvcGVuSWQ6IG9wZW5pZFxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSlcblxuICAgICAgICAgICAgY29uc3QgaXNOZXcgPSBpc05ldyQucmVzdWx0LmRhdGE7XG5cbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICog5paw5a6iICsg5paw5a6i6KaB6K6i6YeRID0gJzAnLFxuICAgICAgICAgICAgICog5paw5a6iICsg6KaB6K6i6YeRID0gJzAnLFxuICAgICAgICAgICAgICog5paw5a6iICsg5YWN6K6i6YeRID0gJzEnLFxuICAgICAgICAgICAgICog5pen5a6iICsg5pen5a6i5YWN6K6i6YeRID0gJzEnLFxuICAgICAgICAgICAgICog5pen5a6iICsg6KaB6K6i6YeRID0gJzAnLFxuICAgICAgICAgICAgICog5pen5a6iICsg5YWN6K6i6YeRID0gJzEnLFxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICBsZXQgcGF5X3N0YXR1cyA9ICcwJztcbiAgICAgICAgICAgIGNvbnN0IHAgPSB0cmlwLnBheW1lbnQ7XG5cbiAgICAgICAgICAgIGlmICggaXNOZXcgJiYgcCA9PT0gJzAnICkge1xuICAgICAgICAgICAgICAgIHBheV9zdGF0dXMgPSAnMCdcblxuICAgICAgICAgICAgfSBlbHNlIGlmICggaXNOZXcgJiYgcCA9PT0gJzEnICkge1xuICAgICAgICAgICAgICAgIHBheV9zdGF0dXMgPSAnMCdcblxuICAgICAgICAgICAgfSBlbHNlIGlmICggaXNOZXcgJiYgcCA9PT0gJzInICkge1xuICAgICAgICAgICAgICAgIHBheV9zdGF0dXMgPSAnMSdcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoICFpc05ldyAmJiBwID09PSAnMCcgKSB7XG4gICAgICAgICAgICAgICAgcGF5X3N0YXR1cyA9ICcxJ1xuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgfSBlbHNlIGlmICggIWlzTmV3ICYmIHAgPT09ICcxJyApIHtcbiAgICAgICAgICAgICAgICBwYXlfc3RhdHVzID0gJzAnXG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICB9IGVsc2UgaWYgKCAhaXNOZXcgJiYgcCA9PT0gJzInICkge1xuICAgICAgICAgICAgICAgIHBheV9zdGF0dXMgPSAnMSdcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcGF5X3N0YXR1cyA9ICcwJ1xuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyAz44CB5om56YeP5Yib5bu66K6i5Y2V77yM77yI6L+H5ruk5o6J5LiN6IO95Yib5bu66LSt54mp5riF5Y2V55qE5ZWG5ZOB77yJXG4gICAgICAgICAgICBjb25zdCB0ZW1wID0gZXZlbnQuZGF0YS5vcmRlcnMubWFwKCBtZXRhID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCB0ID0gT2JqZWN0LmFzc2lnbih7IH0sIG1ldGEsIHtcbiAgICAgICAgICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgICAgICAgICAqICEgZGVsaXZlcl9zdGF0dXPkuLrmnKrlj5HluIMg5Y+v6IO95pyJ6Zeu6aKYXG4gICAgICAgICAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgICAgICAgICBhaWQsXG4gICAgICAgICAgICAgICAgICAgIGlzT2NjdXBpZWQ6IHRydWUsIC8vIOWNoOmihuW6k+WtmOagh+W/l1xuICAgICAgICAgICAgICAgICAgICBvcGVuaWQ6IG9wZW5pZCxcbiAgICAgICAgICAgICAgICAgICAgZGVsaXZlcl9zdGF0dXM6ICcwJywgXG4gICAgICAgICAgICAgICAgICAgIGJhc2Vfc3RhdHVzOiAnMCcsXG4gICAgICAgICAgICAgICAgICAgIHBheV9zdGF0dXM6ICFtZXRhLmRlcG9zaXRQcmljZSA/ICcxJyA6IHBheV9zdGF0dXMgLCAvLyDllYblk4HorqLph5Hpop3luqbkuLowXG4gICAgICAgICAgICAgICAgICAgIGNyZWF0ZVRpbWU6IG5ldyBEYXRlKCApLmdldFRpbWUoICksXG4gICAgICAgICAgICAgICAgICAgIHR5cGU6ICEhbWV0YS5kZXBvc2l0UHJpY2UgPyBtZXRhLnR5cGUgOiAnbm9ybWFsJ1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIGRlbGV0ZSB0WydhZGRyZXNzJ107XG4gICAgICAgICAgICAgICAgcmV0dXJuIHQ7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgLy8gNOOAgeaJuemHj+WIm+W7uuiuouWNlSAoIOWQjOaXtuWkhOeQhuWNoOmihui0p+WtmOeahOmXrumimCApXG4gICAgICAgICAgICBjb25zdCBzYXZlJDogYW55ID0gYXdhaXQgUHJvbWlzZS5hbGwoIHRlbXAubWFwKCBvID0+IHtcbiAgICAgICAgICAgICAgICByZXR1cm4gY3JlYXRlJCggb3BlbmlkLCBvLCBkYiwgY3R4ICk7XG4gICAgICAgICAgICB9KSk7XG4gICAgICAgIFxuICAgICAgICAgICAgaWYgKCBzYXZlJC5zb21lKCB4ID0+IHguc3RhdHVzICE9PSAyMDAgKSkge1xuICAgICAgICAgICAgICAgIHRocm93ICfliJvlu7rorqLljZXplJnor6/vvIEnXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIOi/lOWbnuiuouWNleS/oeaBr1xuICAgICAgICAgICAgY29uc3Qgb3JkZXJfcmVzdWx0ID0gc2F2ZSQubWFwKCggeCwgayApID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCB7IHByaWNlLCBjb3VudCwgcGF5X3N0YXR1cywgZGVwb3NpdFByaWNlIH0gPSB0ZW1wWyBrIF07XG4gICAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICAgICAgb2lkOiB4LmRhdGEuX2lkLFxuICAgICAgICAgICAgICAgICAgICBwcmljZSxcbiAgICAgICAgICAgICAgICAgICAgY291bnQsXG4gICAgICAgICAgICAgICAgICAgIHBheV9zdGF0dXMsXG4gICAgICAgICAgICAgICAgICAgIGRlcG9zaXRQcmljZVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICByZXR1cm4gY3R4LmJvZHkgPSB7XG4gICAgICAgICAgICAgICAgc3RhdHVzOiAyMDAsXG4gICAgICAgICAgICAgICAgZGF0YTogb3JkZXJfcmVzdWx0XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgIH0gY2F0Y2ggKCBlICkge1xuICAgICBcbiAgICAgICAgICAgIHJldHVybiBjdHguYm9keSA9IHtcbiAgICAgICAgICAgICAgICBzdGF0dXM6IDUwMCxcbiAgICAgICAgICAgICAgICBtZXNzYWdlOiBlXG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICAvKipcbiAgICAgKiDliIbpobUgKyBxdWVyeSDmn6Xor6LorqLljZXliJfooajvvIjmnKrogZrlkIjvvIlcbiAgICAgKiAtLS0tLSDor7fmsYIgLS0tLS0tXG4gICAgICoge1xuICAgICAqICAgICBwYWdlOiBudW1iZXJcbiAgICAgKiAgICAgc2tpcDogbnVtYmVyXG4gICAgICogICAgIHR5cGU6IOaIkeeahOWFqOmDqCB8IOacquS7mOasvuiuouWNlSB8IOW+heWPkei0pyB8IOW3suWujOaIkCB8IOeuoeeQhuWRmO+8iOihjOeoi+iuouWNle+8iXwg566h55CG5ZGY77yI5omA5pyJ6K6i5Y2V77yJXG4gICAgICogICAgIHR5cGU6IG15LWFsbCB8IG15LW5vdHBheSB8IG15LWRlbGl2ZXIgfCBteS1maW5pc2ggfCBtYW5hZ2VyLXRyaXAgfCBtYW5hZ2VyLWFsbFxuICAgICAqIH1cbiAgICAgKiAhIOacquS7mOasvuiuouWNle+8mnBheV9zdGF0dXM6IOacquS7mOasvi/lt7Lku5jorqLph5Eg5oiWIHR5cGU6IHByZVxuICAgICAqICEg5b6F5Y+R6LSn77yaZGVsaXZlcl9zdGF0dXPvvJrmnKrlj5HotKcg5LiUIHBheV9zdGF0dXMg5bey5LuY5qy+XG4gICAgICogISDlt7LlrozmiJDvvJpkZWxpdmVyX3N0YXR1c++8muW3suWPkei0pyDkuJQgcGF5X3N0YXR1cyDlt7Lku5jlhajmrL5cbiAgICAgKi9cbiAgICBhcHAucm91dGVyKCdsaXN0JywgYXN5bmMoIGN0eCwgbmV4dCApID0+IHtcbiAgICAgICAgdHJ5IHtcblxuICAgICAgICAgICAgLy8g5p+l6K+i5p2h5pWwXG4gICAgICAgICAgICBjb25zdCBsaW1pdCA9IDEwO1xuXG4gICAgICAgICAgICBsZXQgd2hlcmUkID0geyB9O1xuICAgICAgICAgICAgY29uc3QgeyB0eXBlIH0gPSBldmVudC5kYXRhO1xuICAgICAgICAgICAgY29uc3Qgb3BlbmlkID0gZXZlbnQudXNlckluZm8ub3BlbklkO1xuXG4gICAgICAgICAgICAvLyDmiJHnmoTlhajpg6hcbiAgICAgICAgICAgIGlmICggdHlwZSA9PT0gJ215LWFsbCcgKSB7XG4gICAgICAgICAgICAgICAgd2hlcmUkID0ge1xuICAgICAgICAgICAgICAgICAgICBvcGVuaWQ6IG9wZW5pZFxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8g5pyq5LuY5qy+XG4gICAgICAgICAgICB9IGVsc2UgaWYgKCB0eXBlID09PSAnbXktbm90cGF5JyApIHtcbiAgICAgICAgICAgICAgICB3aGVyZSQgPSBfLmFuZCh7XG4gICAgICAgICAgICAgICAgICAgIG9wZW5pZCxcbiAgICAgICAgICAgICAgICAgICAgYmFzZV9zdGF0dXM6ICcyJ1xuICAgICAgICAgICAgICAgIH0sIF8ub3IoW1xuICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiAncHJlJ1xuICAgICAgICAgICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgICAgICAgICBwYXlfc3RhdHVzOiBfLm9yKCBfLmVxKCcwJyksIF8uZXEoJzEnKSlcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIF0pKTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgLy8g5pyq5Y+R6LSnXG4gICAgICAgICAgICB9IGVsc2UgaWYgKCB0eXBlID09PSAnbXktZGVsaXZlJyApIHtcbiAgICAgICAgICAgICAgICB3aGVyZSQgPSB7XG4gICAgICAgICAgICAgICAgICAgIG9wZW5pZCxcbiAgICAgICAgICAgICAgICAgICAgcGF5X3N0YXR1czogJzInLFxuICAgICAgICAgICAgICAgICAgICBkZWxpdmVyX3N0YXR1czogJzAnXG4gICAgICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgLy8g5bey5a6M5oiQXG4gICAgICAgICAgICB9IGVsc2UgaWYgKCB0eXBlID09PSAnbXktZmluaXNoJyApIHtcbiAgICAgICAgICAgICAgICB3aGVyZSQgPSB7XG4gICAgICAgICAgICAgICAgICAgIG9wZW5pZCxcbiAgICAgICAgICAgICAgICAgICAgcGF5X3N0YXR1czogJzInLFxuICAgICAgICAgICAgICAgICAgICBkZWxpdmVyX3N0YXR1czogJzEnXG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8g6I635Y+W5oC75pWwXG4gICAgICAgICAgICBjb25zdCB0b3RhbCQgPSBhd2FpdCBkYi5jb2xsZWN0aW9uKCdvcmRlcicpXG4gICAgICAgICAgICAgICAgLndoZXJlKCB3aGVyZSQgKVxuICAgICAgICAgICAgICAgIC5jb3VudCggKTtcblxuICAgICAgICAgICAgLy8g6I635Y+W5pWw5o2uXG4gICAgICAgICAgICBjb25zdCBkYXRhJCA9IGF3YWl0IGRiLmNvbGxlY3Rpb24oJ29yZGVyJylcbiAgICAgICAgICAgICAgICAud2hlcmUoIHdoZXJlJCApXG4gICAgICAgICAgICAgICAgLm9yZGVyQnkoJ2NyZWF0ZVRpbWUnLCAnZGVzYycpXG4gICAgICAgICAgICAgICAgLmxpbWl0KCBsaW1pdCApXG4gICAgICAgICAgICAgICAgLnNraXAoIGV2ZW50LmRhdGEuc2tpcCB8fCAoIGV2ZW50LmRhdGEucGFnZSAtIDEgKSAqIGxpbWl0IClcbiAgICAgICAgICAgICAgICAuZ2V0KCApO1xuXG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqICEg55Sx5LqO5p+l6K+i5piv5oyJ5YiG6aG177yM5L2G5piv5pi+56S65piv5oyJ6KGM56iL5p2l6IGa5ZCI5pi+56S6XG4gICAgICAgICAgICAgKiAhIOWboOatpOacieWPr+iDve+8jE7pobXmnIDlkI7kuIDkvY3vvIzot59OKzHpobXnrKzkuIDkvY3kvp3nhLblsZ7kuo7lkIzkuIDooYznqItcbiAgICAgICAgICAgICAqICEg5aaC5LiN6L+b6KGM5aSE55CG77yM5a6i5oi35p+l6K+i6K6i5Y2V5YiX6KGo5pi+56S66KGM56iL6K6i5Y2V5pe277yM5Lya4oCc5pyJ5Y+v6IO94oCd5pi+56S65LiN5YWoXG4gICAgICAgICAgICAgKiAhIOeJueauiuWkhOeQhu+8mueUqOacgOWQjuS4gOS9jeeahHRpZO+8jOafpeivouacgOWQjuS4gOS9jeS7peWQjuWQjHRpZOeahG9yZGVy77yM54S25ZCO5L+u5q2j5omA6L+U5Zue55qEcGFnZVxuICAgICAgICAgICAgICovXG5cbiAgICAgICAgICAgIGNvbnN0IGxhc3QgPSBkYXRhJC5kYXRhWyBkYXRhJC5kYXRhLmxlbmd0aCAtIDEgXTtcblxuICAgICAgICAgICAgbGV0IGZpeCQ6IGFueSA9IHtcbiAgICAgICAgICAgICAgICBkYXRhOiBbIF1cbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIGlmICggbGFzdCApIHsgXG4gICAgICAgICAgICAgICAgZml4JCA9IGF3YWl0IGRiLmNvbGxlY3Rpb24oJ29yZGVyJylcbiAgICAgICAgICAgICAgICAgICAgLndoZXJlKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG9wZW5pZCxcbiAgICAgICAgICAgICAgICAgICAgICAgIHRpZDogbGFzdC50aWRcbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgLm9yZGVyQnkoJ2NyZWF0ZVRpbWUnLCAnZGVzYycpXG4gICAgICAgICAgICAgICAgICAgIC5za2lwKCBldmVudC5kYXRhLnNraXAgPyBldmVudC5kYXRhLnNraXAgKyBkYXRhJC5kYXRhLmxlbmd0aCA6ICggZXZlbnQuZGF0YS5wYWdlIC0gMSApICogbGltaXQgKyBkYXRhJC5kYXRhLmxlbmd0aCApXG4gICAgICAgICAgICAgICAgICAgIC5nZXQoICk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGNvbnN0IG1ldGEgPSBbIC4uLmRhdGEkLmRhdGEsIC4uLmZpeCQuZGF0YSBdO1xuICAgICAgICAgICAgY29uc3QgdHJpcHMkID0gYXdhaXQgUHJvbWlzZS5hbGwoIG1ldGEubWFwKCB4ID0+IHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZGIuY29sbGVjdGlvbigndHJpcCcpXG4gICAgICAgICAgICAgICAgICAgIC53aGVyZSh7XG4gICAgICAgICAgICAgICAgICAgICAgICBfaWQ6IHgudGlkXG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgIC5maWVsZCh7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aXRsZTogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0YXJ0X2RhdGU6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgICAgICBwYXltZW50OiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICAgICAgcG9zdGFnZTogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHBvc3RhZ2VmcmVlX2F0bGVhc3Q6IHRydWVcbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgLmdldCggKTtcbiAgICAgICAgICAgIH0pKTtcbiAgICAgXG4gICAgICAgICAgICAvLyDogZrlkIjooYznqIvmlbDmja5cbiAgICAgICAgICAgIGNvbnN0IG1ldGEyID0gbWV0YS5tYXAoKCB4LCBpICkgPT4gT2JqZWN0LmFzc2lnbih7IH0sIHgsIHtcbiAgICAgICAgICAgICAgICB0cmlwOiB0cmlwcyRbIGkgXS5kYXRhWyAwIF1cbiAgICAgICAgICAgIH0pKTtcblxuICAgICAgICAgICAgcmV0dXJuIGN0eC5ib2R5ID0ge1xuICAgICAgICAgICAgICAgIHN0YXR1czogMjAwLFxuICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgZGF0YTogbWV0YTIsXG4gICAgICAgICAgICAgICAgICAgIHBhZ2VTaXplOiBsaW1pdCxcbiAgICAgICAgICAgICAgICAgICAgdG90YWw6IHRvdGFsJC50b3RhbCxcbiAgICAgICAgICAgICAgICAgICAgcGFnZTogZml4JC5kYXRhLmxlbmd0aCA9PT0gMCA/IGV2ZW50LmRhdGEucGFnZSA6IGV2ZW50LmRhdGEucGFnZSArIE1hdGguY2VpbCggZml4JC5kYXRhLmxlbmd0aCAvIGxpbWl0ICksXG4gICAgICAgICAgICAgICAgICAgIGN1cnJlbnQ6IGV2ZW50LmRhdGEuc2tpcCA/IGV2ZW50LmRhdGEuc2tpcCArIG1ldGEubGVuZ3RoIDogKCBldmVudC5kYXRhLnBhZ2UgLSAxICkgKiBsaW1pdCArIG1ldGEubGVuZ3RoLFxuICAgICAgICAgICAgICAgICAgICB0b3RhbFBhZ2U6IE1hdGguY2VpbCggdG90YWwkLnRvdGFsIC8gbGltaXQgKVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIFxuICAgICAgICB9IGNhdGNoICggZSApIHsgcmV0dXJuIGN0eC5ib2R5ID0geyBzdGF0dXM6IDUwMH07fVxuICAgIH0pXG5cbiAgICAvKipcbiAgICAgKiDmibnph4/mm7TmlrDvvIzorqLljZXkuLrlt7LmlK/ku5jvvIzlubbkuJTlop7liqDliLDotK3nianmuIXljZVcbiAgICAgKiBvcmRlcklkczogXCIxMjMsMjM0LDM0NVwiXG4gICAgICovXG4gICAgYXBwLnJvdXRlcigndXBhZHRlLXRvLXBheWVkJywgYXN5bmMoIGN0eCwgbmV4dCApID0+IHtcbiAgICAgICAgdHJ5IHtcblxuICAgICAgICAgICAgY29uc3QgeyBvcmRlcklkcywgcHJlcGF5X2lkIH0gPSBldmVudC5kYXRhO1xuXG4gICAgICAgICAgICAvLyDmm7TmlrDorqLljZXlrZfmrrVcbiAgICAgICAgICAgIGF3YWl0IFByb21pc2UuYWxsKCBvcmRlcklkcy5zcGxpdCgnLCcpLm1hcCggb2lkID0+IHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZGIuY29sbGVjdGlvbignb3JkZXInKS5kb2MoIG9pZCApXG4gICAgICAgICAgICAgICAgICAgIC51cGRhdGUoe1xuICAgICAgICAgICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHByZXBheV9pZCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXlfc3RhdHVzOiAnMSdcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9KSk7XG5cbiAgICAgICAgICAgIC8vIOWIm+W7ui/mj5LlhaXliLDotK3nianmuIXljZVcbiAgICAgICAgICAgIGNvbnN0IGZpbmQkOiBhbnkgPSBhd2FpdCBQcm9taXNlLmFsbCggb3JkZXJJZHMuc3BsaXQoJywnKS5tYXAoIG9pZCA9PiB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGRiLmNvbGxlY3Rpb24oJ29yZGVyJylcbiAgICAgICAgICAgICAgICAgICAgLndoZXJlKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIF9pZDogb2lkXG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgIC5nZXQoICk7XG4gICAgICAgICAgICB9KSk7XG5cbiAgICAgICAgICAgIGNvbnN0IGxpc3QgPSBmaW5kJC5tYXAoIHggPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IHsgX2lkLCB0aWQsIHBpZCwgc2lkLCBwcmljZSwgZ3JvdXBQcmljZSAgfSA9IHguZGF0YVsgMCBdO1xuICAgICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgICAgIG9pZDogX2lkLFxuICAgICAgICAgICAgICAgICAgICB0aWQsIHBpZCwgc2lkLCBwcmljZSxcbiAgICAgICAgICAgICAgICAgICAgZ3JvdXBQcmljZTogZ3JvdXBQcmljZVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAvLyDov5nph4zmnKzmnaXkuI3pnIDopoHlkIzmraXnrYnlvoXotK3nianmuIXljZXnmoTliJvlu7rvvIzkvYbmmK/kuI3liqBhd2FpdOiyjOS8vOayoeacieiiq+aJp+ihjOWIsFxuICAgICAgICAgICAgYXdhaXQgY2xvdWQuY2FsbEZ1bmN0aW9uKHtcbiAgICAgICAgICAgICAgICBuYW1lOiAnc2hvcHBpbmctbGlzdCcsXG4gICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgICAkdXJsOiAnY3JlYXRlJyxcbiAgICAgICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgICAgICAgbGlzdFxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSlcblxuICAgICAgICAgICAgcmV0dXJuIGN0eC5ib2R5ID0ge1xuICAgICAgICAgICAgICAgIHN0YXR1czogMjAwXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfSBjYXRjaCAoIGUgKSB7IFxuICAgICAgICAgICAgcmV0dXJuIGN0eC5ib2R5ID0geyBzdGF0dXM6IDUwMCB9O1xuICAgICAgICB9IFxuICAgIH0pXG5cbiAgICBhcHAucm91dGVyKCd0ZXN0JywgYXN5bmMoIGN0eCwgbmV4dCApID0+IHtcbiAgICAgICAgdHJ5IHtcblxuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiDmnKrooqvlronmjpLnmoTorqLljZVcbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgY29uc3QgbG9zdE9yZGVyczoge1xuICAgICAgICAgICAgICAgIHRpZCxcbiAgICAgICAgICAgICAgICBwaWQsXG4gICAgICAgICAgICAgICAgc2lkLFxuICAgICAgICAgICAgICAgIG9pZFxuICAgICAgICAgICAgfVsgXSA9IFsgXTtcbiAgICBcbiAgICAgICAgICAgIC8vIOiOt+WPluW9k+WJjei/m+ihjOS4reeahOihjOeoi1xuICAgICAgICAgICAgY29uc3QgdHJpcHMkID0gYXdhaXQgY2xvdWQuY2FsbEZ1bmN0aW9uKHtcbiAgICAgICAgICAgICAgICBuYW1lOiAndHJpcCcsXG4gICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgICAkdXJsOiAnZW50ZXInXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgXG4gICAgICAgICAgICBjb25zdCBjdXJyZW50VHJpcCA9IHRyaXBzJC5yZXN1bHQuZGF0YVsgMCBdO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICBpZiAoICFjdXJyZW50VHJpcCApIHsgXG4gICAgICAgICAgICAgICAgcmV0dXJuIGN0eC5ib2R5ID0ge1xuICAgICAgICAgICAgICAgICAgICBzdGF0dXM6IDIwMFxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICBcbiAgICAgICAgICAgIGNvbnN0IHRpZCA9IGN1cnJlbnRUcmlwLl9pZDtcblxuICAgICAgICAgICAgLy8g5ou/5Yiw5omA5pyJ6K+l6KGM56iL5LiL55qE5bey5LuY6K6i6YeR6K6i5Y2VXG4gICAgICAgICAgICBjb25zdCBmaW5kMSQgPSBhd2FpdCBkYi5jb2xsZWN0aW9uKCdvcmRlcicpXG4gICAgICAgICAgICAgICAgLndoZXJlKHtcbiAgICAgICAgICAgICAgICAgICAgdGlkLFxuICAgICAgICAgICAgICAgICAgICBwYXlfc3RhdHVzOiAnMSdcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIC5nZXQoICk7XG5cbiAgICAgICAgICAgIGlmICggZmluZDEkLmRhdGEubGVuZ3RoID09PSAwICkgeyBcbiAgICAgICAgICAgICAgICByZXR1cm4gY3R4LmJvZHkgPSB7XG4gICAgICAgICAgICAgICAgICAgIHN0YXR1czogMjAwXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgIFxuICAgICAgICAgICAgLy8g5ou/5Yiw6K+l6KGM56iL5LiL55qE6LSt54mp5riF5Y2VXG4gICAgICAgICAgICBjb25zdCBmaW5kMiQgPSBhd2FpdCBkYi5jb2xsZWN0aW9uKCdzaG9wcGluZy1saXN0JylcbiAgICAgICAgICAgICAgICAud2hlcmUoe1xuICAgICAgICAgICAgICAgICAgICB0aWRcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIC5nZXQoICk7XG5cbiAgICAgICAgICAgIGNvbnN0IHRyaXBTaG9wcGluZ0xpc3QgPSBmaW5kMiQuZGF0YTsgXG4gICAgICAgICAgICBcbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICog6Lef5riF5Y2V6L+b6KGM5Yy56YWNXG4gICAgICAgICAgICAgKiAxLiDor6XorqLljZXnmoTllYblk4Ev5Z6L5Y+36L+Y5rKh5pyJ5Lu75L2V5riF5Y2VXG4gICAgICAgICAgICAgKiAyLiDor6XorqLljZXmsqHmnInlnKjlt7LmnInlkIzmrL7llYblk4Ev5Z6L5Y+355qE5riF5Y2V6YeM6Z2iXG4gICAgICAgICAgICAgKi9cblxuICAgICAgICAgICAgZmluZDEkLmRhdGEubWFwKCBvcmRlciA9PiB7XG5cbiAgICAgICAgICAgICAgICBjb25zdCB7IHNpZCwgcGlkLCBfaWQgfSA9IG9yZGVyO1xuICAgICAgICAgICAgICAgIGNvbnN0IGN1cnJlbnRHb29kU2hvcHBpbmdMaXN0ID0gdHJpcFNob3BwaW5nTGlzdC5maW5kKCB4ID0+IHguc2lkID09PSBzaWQgJiYgeC5waWQgPT09IHBpZCApO1xuXG4gICAgICAgICAgICAgICAgaWYgKCAhY3VycmVudEdvb2RTaG9wcGluZ0xpc3QgKSB7XG4gICAgICAgICAgICAgICAgICAgIGxvc3RPcmRlcnMucHVzaCh7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aWQsXG4gICAgICAgICAgICAgICAgICAgICAgICBzaWQsXG4gICAgICAgICAgICAgICAgICAgICAgICBwaWQsXG4gICAgICAgICAgICAgICAgICAgICAgICBvaWQ6IF9pZFxuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHsgb2lkcyB9ID0gY3VycmVudEdvb2RTaG9wcGluZ0xpc3Q7XG4gICAgICAgICAgICAgICAgICAgIGlmICggIW9pZHMuZmluZCggeCA9PiB4ID09PSBfaWQgKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgbG9zdE9yZGVycy5wdXNoKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aWQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2lkLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBpZCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvaWQ6IF9pZFxuICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIGlmICggbG9zdE9yZGVycy5sZW5ndGggPT09IDAgKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGN0eC5ib2R5ID0ge1xuICAgICAgICAgICAgICAgICAgICBzdGF0dXM6IDIwMFxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgYXdhaXQgY2xvdWQuY2FsbEZ1bmN0aW9uKHtcbiAgICAgICAgICAgICAgICBuYW1lOiAnc2hvcHBpbmctbGlzdCcsXG4gICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgICAkdXJsOiAnY3JlYXRlJyxcbiAgICAgICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgICAgICAgbGlzdDogbG9zdE9yZGVyc1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgXG4gICAgICAgICAgICByZXR1cm4gY3R4LmJvZHkgPSB7XG4gICAgICAgICAgICAgICAgc3RhdHVzOiAyMDAsXG4gICAgICAgICAgICAgICAgZGF0YTogbG9zdE9yZGVyc1xuICAgICAgICAgICAgfVxuICAgIFxuICAgICAgICB9IGNhdGNoICggZSApIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCchISEh5a6a5pe25Zmo6K6i5Y2VY2F0Y2hMb3N0T3JkZXJz6ZSZ6K+vJywpXG4gICAgICAgICAgICByZXR1cm4gY3R4LmJvZHkgPSB7IHN0YXR1czogNTAwIH07XG4gICAgICAgIH1cbiAgICB9KVxuXG4gICAgLyoqIFxuICAgICAqIEBkZXNjcmlwdGlvblxuICAgICAqIOS7o+i0rea4heW4kOWCrOasvueahOiuouWNleWIl+ihqFxuICAgICAqL1xuICAgIGFwcC5yb3V0ZXIoJ2RhaWdvdS1saXN0JywgYXN5bmMoIGN0eCwgbmV4dCApID0+IHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGNvbnN0IHsgdGlkIH0gPSBldmVudC5kYXRhO1xuICAgICAgICAgICAgY29uc3Qgb3JkZXJzJCA9IGF3YWl0IGRiLmNvbGxlY3Rpb24oJ29yZGVyJylcbiAgICAgICAgICAgICAgICAud2hlcmUoe1xuICAgICAgICAgICAgICAgICAgICB0aWQsXG4gICAgICAgICAgICAgICAgICAgIHBheV9zdGF0dXM6IF8ub3IoIF8uZXEoJzEnKSwgXy5lcSgnMicpLCBfLmVxKCczJykpXG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAuZ2V0KCApO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICAvLyDnlKjmiLfkv6Hmga9cbiAgICAgICAgICAgIGNvbnN0IHVzZXJzJCA9IGF3YWl0IFByb21pc2UuYWxsKFxuICAgICAgICAgICAgICAgIEFycmF5LmZyb20oIFxuICAgICAgICAgICAgICAgICAgICBuZXcgU2V0KCBvcmRlcnMkLmRhdGFcbiAgICAgICAgICAgICAgICAgICAgICAgIC5tYXAoIHggPT4geC5vcGVuaWQgKVxuICAgICAgICAgICAgICAgICkpXG4gICAgICAgICAgICAgICAgLm1hcCggdWlkID0+IGRiLmNvbGxlY3Rpb24oJ3VzZXInKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC53aGVyZSh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9wZW5pZDogdWlkXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAuZ2V0KCApKVxuICAgICAgICAgICAgKTtcblxuICAgICAgICAgICAgLy8g5Zyw5Z2A5L+h5oGvXG4gICAgICAgICAgICBjb25zdCBhZGRyZXNzJCA9IGF3YWl0IFByb21pc2UuYWxsKFxuICAgICAgICAgICAgICAgIEFycmF5LmZyb20oXG4gICAgICAgICAgICAgICAgICAgIG5ldyBTZXQoIG9yZGVycyQuZGF0YVxuICAgICAgICAgICAgICAgICAgICAgICAgLm1hcCggeCA9PiB4LmFpZCApXG4gICAgICAgICAgICAgICAgKSlcbiAgICAgICAgICAgICAgICAubWFwKCBhaWQgPT4gZGIuY29sbGVjdGlvbignYWRkcmVzcycpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLmRvYyggYWlkIClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAuZ2V0KCApKVxuICAgICAgICAgICAgKTtcblxuICAgICAgICAgICAgY29uc3QgdXNlck9kZXJzID0gdXNlcnMkLm1hcCggdXNlciQgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IHVzZXIgPSB1c2VyJC5kYXRhWyAwIF07XG4gICAgICAgICAgICAgICAgY29uc3Qgb3JkZXJzID0gb3JkZXJzJC5kYXRhLmZpbHRlciggeCA9PiB4Lm9wZW5pZCA9PT0gdXNlci5vcGVuaWQgKTtcbiAgICAgICAgICAgICAgICBjb25zdCBhZGRyZXNzID0gYWRkcmVzcyRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5tYXAoIHggPT4geC5kYXRhIClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5maWx0ZXIoIHggPT4geC5vcGVuaWQgPT09IHVzZXIub3BlbmlkICk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICAgICAgdXNlcixcbiAgICAgICAgICAgICAgICAgICAgb3JkZXJzLFxuICAgICAgICAgICAgICAgICAgICBhZGRyZXNzXG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICByZXR1cm4gY3R4LmJvZHkgPSB7XG4gICAgICAgICAgICAgICAgc3RhdHVzOiAyMDAsXG4gICAgICAgICAgICAgICAgZGF0YTogdXNlck9kZXJzXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfSBjYXRjaCAoIGUgKSB7XG4gICAgICAgICAgICByZXR1cm4gY3R4LmJvZHkgPSB7IHN0YXR1czogNTAwIH07XG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgIC8qKlxuICAgICAqIEBkZXNjcmlwdGlvblxuICAgICAqIOS7jua4heW4kOWCrOasvu+8jOiwg+aVtOiuouWNleWIhumFjemHj1xuICAgICAqIHtcbiAgICAgKiAgICAgIG9pZCwgdGlkLCBzaWQsIHBpZCwgY291bnRcbiAgICAgKiB9XG4gICAgICovXG4gICAgYXBwLnJvdXRlcignYWRqdXN0LWNvdW50JywgYXN5bmMoIGN0eCwgbmV4dCApID0+IHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGNvbnN0IG9wZW5pZCA9IGV2ZW50LmRhdGEub3BlbklkIHx8IGV2ZW50LnVzZXJJbmZvLm9wZW5JZDsgXG4gICAgICAgICAgICBjb25zdCB7IG9pZCwgdGlkLCBzaWQsIHBpZCwgY291bnQgfSA9IGV2ZW50LmRhdGE7XG5cbiAgICAgICAgICAgIGNvbnN0IGdldFdyb25nID0gbWVzc2FnZSA9PiBjdHguYm9keSA9IHtcbiAgICAgICAgICAgICAgICBtZXNzYWdlLFxuICAgICAgICAgICAgICAgIHN0YXR1czogNDAwXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICog5piv5ZCm6IO957un57ut6LCD5pW0XG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIGNvbnN0IG9yZGVyJCA9IGF3YWl0IGRiLmNvbGxlY3Rpb24oJ29yZGVyJylcbiAgICAgICAgICAgICAgICAuZG9jKCBvaWQgKVxuICAgICAgICAgICAgICAgIC5nZXQoICk7XG5cbiAgICAgICAgICAgIGlmICggb3JkZXIkLmRhdGEuYmFzZV9zdGF0dXMgPT09ICcyJyApIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZ2V0V3JvbmcoJ+WCrOasvuWQjuS4jeiDveS/ruaUueaVsOmHjycpO1xuXG4gICAgICAgICAgICB9IGVsc2UgaWYgKCBvcmRlciQuZGF0YS5iYXNlX3N0YXR1cyA9PT0gJzAnICkge1xuICAgICAgICAgICAgICAgIHJldHVybiBnZXRXcm9uZygn6K+35YWI6LCD5pW06K+l5ZWG5ZOB5Lu35qC8Jyk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICog5LiN6IO95aSa5LqO5riF5Y2V5YiG6YWN55qE5oC76LSt5YWl6YePXG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIGNvbnN0IHNob3BwaW5nJCA9IGF3YWl0IGRiLmNvbGxlY3Rpb24oJ3Nob3BwaW5nLWxpc3QnKVxuICAgICAgICAgICAgICAgIC53aGVyZSh7XG4gICAgICAgICAgICAgICAgICAgIHRpZCwgc2lkLCBwaWRcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIC5nZXQoICk7XG4gICAgICAgICAgICBjb25zdCBzaG9wcGluZyA9IHNob3BwaW5nJC5kYXRhWyAwIF07XG4gICAgICAgICAgICBjb25zdCBsYXN0T3JkZXJzJCA9IGF3YWl0IGRiLmNvbGxlY3Rpb24oJ29yZGVyJylcbiAgICAgICAgICAgICAgICAud2hlcmUoe1xuICAgICAgICAgICAgICAgICAgICB0aWQsIHNpZCwgcGlkLFxuICAgICAgICAgICAgICAgICAgICBiYXNlX3N0YXR1czogXy5vciggXy5lcSgnMScpLCBfLmVxKCcyJyksIF8uZXEoJzMnKSlcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIC5nZXQoICk7XG5cbiAgICAgICAgICAgIGNvbnN0IGxhc3RPcmRlcnMgPSBsYXN0T3JkZXJzJC5kYXRhO1xuICAgICAgICAgICAgY29uc3Qgb3RoZXJDb3VudDogYW55ID0gbGFzdE9yZGVyc1xuICAgICAgICAgICAgICAgIC5maWx0ZXIoIG8gPT4gby5faWQgIT09IG9pZCApXG4gICAgICAgICAgICAgICAgLnJlZHVjZSgoIHgsIHkgKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB4ICsgeS5hbGxvY2F0ZWRDb3VudFxuICAgICAgICAgICAgICAgIH0sIDAgKTtcblxuICAgICAgICAgICAgaWYgKCBjb3VudCArIG90aGVyQ291bnQgPiBzaG9wcGluZy5wdXJjaGFzZSApIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZ2V0V3JvbmcoYOivpeWVhuWTgeaAu+aVsOmHj+S4jeiDveWkp+S6jumHh+i0reaVsCR7c2hvcHBpbmcucHVyY2hhc2V95Lu277yBYCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8qKiDmm7TmlrDorqLljZUgKi9cbiAgICAgICAgICAgIGF3YWl0IGRiLmNvbGxlY3Rpb24oJ29yZGVyJylcbiAgICAgICAgICAgICAgICAuZG9jKCBvaWQgKVxuICAgICAgICAgICAgICAgIC51cGRhdGUoe1xuICAgICAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBhbGxvY2F0ZWRDb3VudDogY291bnRcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIOabtOaWsOa4heWNlVxuICAgICAgICAgICAgICog5bCR5LqO5oC76LSt5YWl6YeP5pe277yM6YeN5paw6LCD5pW05riF5Y2V55qE5Ymp5L2Z5YiG6YWN6YePXG4gICAgICAgICAgICAgKi9cblxuICAgICAgICAgICAgaWYgKCBjb3VudCArIG90aGVyQ291bnQgPCBzaG9wcGluZy5wdXJjaGFzZSApIHtcblxuICAgICAgICAgICAgICAgIGNvbnN0IG5ld3Nob3BwaW5nID0gT2JqZWN0LmFzc2lnbih7IH0sIHNob3BwaW5nLCB7XG4gICAgICAgICAgICAgICAgICAgIGxhc3RBbGxvY2F0ZWQ6IHNob3BwaW5nLnB1cmNoYXNlIC0gKCBjb3VudCArIG90aGVyQ291bnQgKVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIGRlbGV0ZSBuZXdzaG9wcGluZ1snX2lkJ107XG5cbiAgICAgICAgICAgICAgICBhd2FpdCBkYi5jb2xsZWN0aW9uKCdzaG9wcGluZy1saXN0JylcbiAgICAgICAgICAgICAgICAgICAgLmRvYyggU3RyaW5nKCBzaG9wcGluZy5faWQgKSlcbiAgICAgICAgICAgICAgICAgICAgLnNldCh7XG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRhOiBuZXdzaG9wcGluZ1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIGN0eC5ib2R5ID0ge1xuICAgICAgICAgICAgICAgIHN0YXR1czogMjAwXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBcbiAgICAgICAgfSBjYXRjaCAoIGUgKSB7XG4gICAgICAgICAgICByZXR1cm4gY3R4LmJvZHkgPSB7IHN0YXR1czogNTAwIH1cbiAgICAgICAgfVxuICAgIH0pXG5cbiAgICAvKipcbiAgICAgKiBAZGVzY3JpcHRpb25cbiAgICAgKiAh5bey5byD55So77yM5L2/55So5om56YeP5YKs5qy+44CB6LCD5pW05Yqf6IO977yM6ICM5LiN5piv5q+P5qyh6ZKI5a+55Y2V5Liqb3JkZXLov5vooYzmk43kvZxcbiAgICAgKiDlgqzluJDvvIzosIPmlbTkuIvliJforqLljZXkuLrigJzlt7LosIPmlbTigJ3vvIzlubblj5HpgIHmtojmga/mqKHmnb9cbiAgICAgKiB7XG4gICAgICogICAgdGlkLCBvaWRzXG4gICAgICogfVxuICAgICAqL1xuICAgIGFwcC5yb3V0ZXIoJ2FkanVzdC1zdGF0dXMnLCBhc3luYyggY3R4LCBuZXh0ICkgPT4ge1xuICAgICAgICB0cnkge1xuXG4gICAgICAgICAgICBjb25zdCB7IHRpZCwgb2lkcywgZm9ybV9pZCB9ID0gZXZlbnQuZGF0YTtcbiAgICAgICAgICAgIGNvbnN0IGdldFdyb25nID0gbWVzc2FnZSA9PiBjdHguYm9keSA9IHtcbiAgICAgICAgICAgICAgICBtZXNzYWdlLFxuICAgICAgICAgICAgICAgIHN0YXR1czogNDAwXG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICBjb25zdCB0cmlwJCA9IGF3YWl0IGRiLmNvbGxlY3Rpb24oJ3RyaXAnKVxuICAgICAgICAgICAgICAgIC5kb2MoIHRpZCApXG4gICAgICAgICAgICAgICAgLmdldCggKTtcbiAgICAgICAgICAgIGNvbnN0IHRyaXAgPSB0cmlwJC5kYXRhO1xuXG4gICAgICAgICAgICAvLyDmnKrnu5PmnZ/vvIzkuJTmnKrmiYvliqjlhbPpl61cbiAgICAgICAgICAgIGlmICggbmV3IERhdGUoICkuZ2V0VGltZSggKSA8IHRyaXAuZW5kX2RhdGUgJiYgIXRyaXAuaXNDbG9zZWQgKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGdldFdyb25nKCfooYznqIvmnKrnu5PmnZ/vvIzor7fmiYvliqjlhbPpl63lvZPliY3ooYznqIsnKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8g5pu05paw6K6i5Y2VXG4gICAgICAgICAgICBjb25zdCB1cGRhdGUkID0gYXdhaXQgUHJvbWlzZS5hbGwoIG9pZHMubWFwKCBvaWQgPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiBkYi5jb2xsZWN0aW9uKCdvcmRlcicpXG4gICAgICAgICAgICAgICAgICAgIC5kb2MoIG9pZCApXG4gICAgICAgICAgICAgICAgICAgIC51cGRhdGUoe1xuICAgICAgICAgICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJhc2Vfc3RhdHVzOiAnMidcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9KSk7XG5cbiAgICAgICAgICAgIFxuICAgICAgICAgICAgcmV0dXJuIGN0eC5ib2R5ID0ge1xuICAgICAgICAgICAgICAgIHN0YXR1czogMjAwXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfSBjYXRjaCAoIGUgKSB7IHJldHVybiBjdHguYm9keSA9IHsgc3RhdHVzOiA1MDAgfX1cbiAgICB9KVxuXG4gICAgLyoqXG4gICAgICogQGRlc2NyaXB0aW9uXG4gICAgICogPz8/XG4gICAgICoge1xuICAgICAqICBcbiAgICAgKiB9XG4gICAgICovXG4gXG4gICByZXR1cm4gYXBwLnNlcnZlKCApO1xuXG59Il19