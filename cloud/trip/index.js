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
cloud.init({
    env: cloud.DYNAMIC_CURRENT_ENV
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
        app.router('enter', function (ctx, next) { return __awaiter(_this, void 0, void 0, function () {
            var shouldGetGoods, data$, trips, tripOneProducts$, e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 4, , 5]);
                        shouldGetGoods = event.data ? event.data.shouldGetGoods : undefined;
                        return [4, db.collection('trip')
                                .where({
                                isClosed: false,
                                published: true,
                                end_date: _.gt(getNow(true))
                            })
                                .limit(2)
                                .orderBy('start_date', 'asc')
                                .get()];
                    case 1:
                        data$ = _a.sent();
                        trips = data$.data;
                        if (!((!!trips[0] && shouldGetGoods === undefined) || shouldGetGoods === true)) return [3, 3];
                        return [4, Promise.all(trips[0].selectedProductIds.map(function (pid) {
                                return cloud.callFunction({
                                    data: {
                                        data: {
                                            _id: pid,
                                        },
                                        $url: 'detail'
                                    },
                                    name: 'good'
                                }).then(function (res) { return res.result.data; });
                            }))];
                    case 2:
                        tripOneProducts$ = _a.sent();
                        trips[0] = Object.assign({}, trips[0], {
                            products: tripOneProducts$
                        });
                        _a.label = 3;
                    case 3: return [2, ctx.body = {
                            status: 200,
                            data: trips
                        }];
                    case 4:
                        e_1 = _a.sent();
                        return [2, ctx.body = {
                                status: 500,
                                message: e_1
                            }];
                    case 5: return [2];
                }
            });
        }); });
        app.router('list', function (ctx, next) { return __awaiter(_this, void 0, void 0, function () {
            var limit, search$, search, total$, trips$, more_1, inject, e_2;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 4, , 5]);
                        limit = 20;
                        search$ = event.data.title || '';
                        search = new RegExp(search$.replace(/\s+/g, ""), 'i');
                        return [4, db.collection('trip')
                                .where({
                                title: search
                            })
                                .count()];
                    case 1:
                        total$ = _a.sent();
                        return [4, db.collection('trip')
                                .where({
                                title: search
                            })
                                .limit(limit)
                                .skip((event.data.page - 1) * limit)
                                .orderBy('updateTime', 'desc')
                                .get()];
                    case 2:
                        trips$ = _a.sent();
                        return [4, Promise.all(trips$.data.map(function (trip) { return __awaiter(_this, void 0, void 0, function () {
                                var sl$, sl, slOrders$, income, orders$, notPayAllClients;
                                var _this = this;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4, db.collection('shopping-list')
                                                .where({
                                                tid: trip._id
                                            })
                                                .field({
                                                pid: true,
                                                oids: true,
                                                uids: true,
                                                adjustPrice: true,
                                                adjustGroupPrice: true
                                            })
                                                .get()];
                                        case 1:
                                            sl$ = _a.sent();
                                            sl = sl$.data;
                                            return [4, Promise.all(sl.map(function (s) { return __awaiter(_this, void 0, void 0, function () {
                                                    var oids, orders;
                                                    var _this = this;
                                                    return __generator(this, function (_a) {
                                                        switch (_a.label) {
                                                            case 0:
                                                                oids = s.oids;
                                                                return [4, Promise.all(oids.map(function (o) { return __awaiter(_this, void 0, void 0, function () {
                                                                        var order$;
                                                                        return __generator(this, function (_a) {
                                                                            switch (_a.label) {
                                                                                case 0: return [4, db.collection('order')
                                                                                        .doc(String(o))
                                                                                        .field({
                                                                                        count: true,
                                                                                        allocatedCount: true
                                                                                    })
                                                                                        .get()];
                                                                                case 1:
                                                                                    order$ = _a.sent();
                                                                                    return [2, order$.data];
                                                                            }
                                                                        });
                                                                    }); }))];
                                                            case 1:
                                                                orders = _a.sent();
                                                                return [2, __assign({}, s, { orders: orders })];
                                                        }
                                                    });
                                                }); }))];
                                        case 2:
                                            slOrders$ = _a.sent();
                                            income = slOrders$.reduce(function (sum, sl) {
                                                var orders = sl.orders, uids = sl.uids, adjustPrice = sl.adjustPrice, adjustGroupPrice = sl.adjustGroupPrice;
                                                var slInome = orders.reduce(function (last, order) {
                                                    var allocatedCount = order.allocatedCount, count = order.count;
                                                    var count_ = allocatedCount !== undefined ? allocatedCount : count;
                                                    return last + (uids.length > 1 ? (adjustGroupPrice ? adjustGroupPrice : adjustPrice) : adjustPrice) * count_;
                                                }, 0);
                                                return slInome + sum;
                                            }, 0);
                                            return [4, db.collection('order')
                                                    .where({
                                                    tid: trip._id,
                                                    pay_status: _.eq('1'),
                                                    base_status: _.or(_.eq('0'), _.eq('1'), _.eq('2'), _.eq('3'))
                                                })
                                                    .field({
                                                    openid: true
                                                })
                                                    .get()];
                                        case 3:
                                            orders$ = _a.sent();
                                            notPayAllClients = Array.from(new Set(orders$.data
                                                .map(function (x) { return x.openid; }))).length;
                                            return [2, {
                                                    notPayAllClients: notPayAllClients,
                                                    sales_volume: income
                                                }];
                                    }
                                });
                            }); }))];
                    case 3:
                        more_1 = _a.sent();
                        inject = trips$.data.map(function (trip, key) {
                            return __assign({}, trip, more_1[key]);
                        });
                        return [2, ctx.body = {
                                status: 200,
                                data: {
                                    search: event.data.title.replace(/\s+/g, ''),
                                    pageSize: limit,
                                    page: event.data.page,
                                    data: inject,
                                    total: total$.total,
                                    totalPage: Math.ceil(total$.total / limit)
                                }
                            }];
                    case 4:
                        e_2 = _a.sent();
                        return [2, ctx.body = {
                                status: 500,
                                message: e_2
                            }];
                    case 5: return [2];
                }
            });
        }); });
        app.router('detail', function (ctx, next) { return __awaiter(_this, void 0, void 0, function () {
            var moreDetail, tid, data$, meta, products$, canEdit$, e_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 6, , 7]);
                        moreDetail = event.data.moreDetail;
                        tid = event.data._id || event.data.tid;
                        return [4, db.collection('trip')
                                .doc(tid)
                                .get()];
                    case 1:
                        data$ = _a.sent();
                        meta = data$.data;
                        if (!(moreDetail !== false)) return [3, 3];
                        return [4, Promise.all(meta.selectedProductIds.map(function (pid) {
                                return db.collection('goods')
                                    .where({
                                    _id: pid
                                })
                                    .field({
                                    img: true,
                                    title: true
                                })
                                    .get();
                            }))];
                    case 2:
                        products$ = _a.sent();
                        meta.selectedProducts = products$.map(function (x) {
                            return x.data[0];
                        });
                        return [3, 4];
                    case 3:
                        meta.selectedProducts = [];
                        _a.label = 4;
                    case 4: return [4, db.collection('coupon')
                            .where({
                            tid: tid
                        })
                            .count()];
                    case 5:
                        canEdit$ = _a.sent();
                        meta.canEditCoupons = true;
                        return [2, ctx.body = {
                                status: 200,
                                data: meta
                            }];
                    case 6:
                        e_3 = _a.sent();
                        return [2, ctx.body = {
                                status: 500,
                                message: e_3
                            }];
                    case 7: return [2];
                }
            });
        }); });
        app.router('edit', function (ctx, next) { return __awaiter(_this, void 0, void 0, function () {
            var lastTrip, start_date, _id, tid, _a, published, title_1, reduce_price_1, getErr, fixEndDate, end_date, count$, createData, create$, origin$, origin, isClosed, temp, time_1, members_1, users, e_4;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 12, , 13]);
                        lastTrip = null;
                        start_date = getNow(true);
                        _id = event.data._id;
                        tid = event.data._id;
                        _a = event.data, published = _a.published, title_1 = _a.title, reduce_price_1 = _a.reduce_price;
                        getErr = function (message) {
                            return ctx.body = {
                                status: 500,
                                message: message
                            };
                        };
                        fixEndDate = function (endDate) {
                            var t = new Date(endDate);
                            var y = t.getFullYear();
                            var m = t.getMonth() + 1;
                            var d = t.getDate();
                            return new Date(y + "/" + m + "/" + d + " 23:00:00").getTime();
                        };
                        end_date = fixEndDate(Number(event.data.end_date));
                        if (reduce_price_1 < 1) {
                            return [2, getErr('立减金额不能少于1元')];
                        }
                        if (!!_id) return [3, 3];
                        return [4, db.collection('trip')
                                .where({
                                isClosed: false,
                                published: true,
                            })
                                .count()];
                    case 1:
                        count$ = _b.sent();
                        if (count$.total) {
                            return [2, getErr('有未结束行程,请结束行程后再创建')];
                        }
                        createData = __assign({}, event.data, { end_date: end_date, start_date: getNow(true), warning: false, callMoneyTimes: 0 });
                        return [4, db.collection('trip')
                                .add({
                                data: createData
                            })];
                    case 2:
                        create$ = _b.sent();
                        _id = create$._id;
                        return [3, 6];
                    case 3: return [4, db.collection('trip')
                            .where({
                            _id: _id
                        })
                            .get()];
                    case 4:
                        origin$ = _b.sent();
                        origin = origin$.data[0];
                        isClosed = getNow(true) >= Number(end_date);
                        delete origin['_id'];
                        delete event.data['_id'];
                        delete event.data['createTime'];
                        delete event.data['sales_volume'];
                        temp = Object.assign({}, origin, __assign({}, event.data, { isClosed: isClosed, type: 'custom', callMoneyTimes: end_date > origin['end_date'] ? 0 : origin['callMoneyTimes'] }));
                        return [4, db.collection('trip')
                                .doc(_id)
                                .set({
                                data: temp
                            })];
                    case 5:
                        _b.sent();
                        _b.label = 6;
                    case 6:
                        if (!(!tid && published)) return [3, 11];
                        time_1 = new Date(start_date);
                        return [4, db.collection('manager-member')
                                .where({
                                push: true
                            })
                                .get()];
                    case 7:
                        members_1 = _b.sent();
                        return [4, Promise.all(members_1.data.map(function (member) { return __awaiter(_this, void 0, void 0, function () {
                                var push$;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4, cloud.callFunction({
                                                name: 'common',
                                                data: {
                                                    $url: 'push-subscribe-cloud',
                                                    data: {
                                                        openid: member.openid,
                                                        type: 'trip',
                                                        page: 'pages/manager-trip-list/index',
                                                        texts: ["" + title_1, "\u4EE3\u8D2D\u884C\u7A0B\u63A8\u9001\u5230\u5BA2\u6237\uFF0C\u4E14\u5F00\u901A\u4E86\u8BA2\u5355\u63A8\u9001"]
                                                    }
                                                }
                                            })];
                                        case 1:
                                            push$ = _a.sent();
                                            return [2];
                                    }
                                });
                            }); }))];
                    case 8:
                        _b.sent();
                        return [4, db.collection('user')
                                .where({})
                                .get()];
                    case 9:
                        users = _b.sent();
                        return [4, Promise.all(users.data
                                .filter(function (user) {
                                return !members_1.data.find(function (member) { return member.openid === user.openid; });
                            })
                                .map(function (user) { return __awaiter(_this, void 0, void 0, function () {
                                var push$;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4, cloud.callFunction({
                                                name: 'common',
                                                data: {
                                                    $url: 'push-subscribe-cloud',
                                                    data: {
                                                        openid: user.openid,
                                                        type: 'trip',
                                                        page: 'pages/trip-enter/index',
                                                        texts: ["" + title_1, "\u4EE3\u8D2D\u5728" + (time_1.getMonth() + 1) + "\u6708" + time_1.getDate() + "\u65E5\u5F00\u59CB\uFF01\u65E0\u95E8\u69DB\u7ACB\u51CF" + reduce_price_1 + "\u5143\uFF01"]
                                                    }
                                                }
                                            })];
                                        case 1:
                                            push$ = _a.sent();
                                            return [2];
                                    }
                                });
                            }); }))];
                    case 10:
                        _b.sent();
                        _b.label = 11;
                    case 11: return [2, ctx.body = {
                            data: _id,
                            status: 200
                        }];
                    case 12:
                        e_4 = _b.sent();
                        return [2, ctx.body = {
                                status: 500,
                                message: e_4
                            }];
                    case 13: return [2];
                }
            });
        }); });
        app.router('order-info', function (ctx, next) { return __awaiter(_this, void 0, void 0, function () {
            var tid, trip$, orders$, clients, notPayAllClients, sl$, sl, slOrders$, sum, e_5;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 5, , 6]);
                        tid = event.data.tid;
                        return [4, db.collection('trip')
                                .doc(tid)
                                .get()];
                    case 1:
                        trip$ = _a.sent();
                        return [4, db.collection('order')
                                .where({
                                tid: tid,
                                pay_status: _.neq('0')
                            })
                                .get()];
                    case 2:
                        orders$ = _a.sent();
                        clients = Array.from(new Set(orders$.data
                            .filter(function (x) { return x.pay_status !== '0'; })
                            .map(function (x) { return x.openid; }))).length;
                        notPayAllClients = Array.from(new Set(orders$.data
                            .filter(function (x) { return x.pay_status === '1'; })
                            .map(function (x) { return x.openid; }))).length;
                        return [4, db.collection('shopping-list')
                                .where({
                                tid: tid
                            })
                                .field({
                                pid: true,
                                oids: true,
                                uids: true,
                                adjustPrice: true,
                                adjustGroupPrice: true
                            })
                                .get()];
                    case 3:
                        sl$ = _a.sent();
                        sl = sl$.data;
                        return [4, Promise.all(sl.map(function (s) { return __awaiter(_this, void 0, void 0, function () {
                                var oids, orders;
                                var _this = this;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            oids = s.oids;
                                            return [4, Promise.all(oids.map(function (o) { return __awaiter(_this, void 0, void 0, function () {
                                                    var order$;
                                                    return __generator(this, function (_a) {
                                                        switch (_a.label) {
                                                            case 0: return [4, db.collection('order')
                                                                    .doc(String(o))
                                                                    .field({
                                                                    count: true,
                                                                    allocatedCount: true
                                                                })
                                                                    .get()];
                                                            case 1:
                                                                order$ = _a.sent();
                                                                return [2, order$.data];
                                                        }
                                                    });
                                                }); }))];
                                        case 1:
                                            orders = _a.sent();
                                            return [2, __assign({}, s, { orders: orders })];
                                    }
                                });
                            }); }))];
                    case 4:
                        slOrders$ = _a.sent();
                        sum = slOrders$.reduce(function (sum, sl) {
                            var orders = sl.orders, uids = sl.uids, adjustPrice = sl.adjustPrice, adjustGroupPrice = sl.adjustGroupPrice;
                            var slInome = orders.reduce(function (last, order) {
                                var allocatedCount = order.allocatedCount, count = order.count;
                                var count_ = allocatedCount !== undefined ? allocatedCount : count;
                                return last + (uids.length > 1 ? (adjustGroupPrice ? adjustGroupPrice : adjustPrice) : adjustPrice) * count_;
                            }, 0);
                            return slInome + sum;
                        }, 0);
                        return [2, ctx.body = {
                                status: 200,
                                data: {
                                    sum: sum,
                                    clients: clients,
                                    notPayAllClients: notPayAllClients,
                                    count: orders$.data.length,
                                    title: trip$.data.title,
                                    callMoneyTimes: trip$.data.callMoneyTimes
                                }
                            }];
                    case 5:
                        e_5 = _a.sent();
                        return [2, ctx.body = { status: 500 }];
                    case 6: return [2];
                }
            });
        }); });
        app.router('update-deliver', function (ctx, next) { return __awaiter(_this, void 0, void 0, function () {
            var _a, tid, imgs, target, e_6;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 6, , 7]);
                        _a = event.data, tid = _a.tid, imgs = _a.imgs;
                        return [4, db.collection('deliver')
                                .where({
                                tid: tid,
                                type: 'deliver-img'
                            })
                                .get()];
                    case 1:
                        target = _b.sent();
                        if (!!target.data[0]) return [3, 3];
                        return [4, db.collection('deliver')
                                .add({
                                data: {
                                    tid: tid,
                                    imgs: imgs,
                                    type: 'deliver-img'
                                }
                            })];
                    case 2:
                        _b.sent();
                        return [3, 5];
                    case 3: return [4, db.collection('deliver')
                            .doc(String(target.data[0]._id))
                            .update({
                            data: {
                                imgs: imgs
                            }
                        })];
                    case 4:
                        _b.sent();
                        _b.label = 5;
                    case 5: return [2, ctx.body = { status: 200 }];
                    case 6:
                        e_6 = _b.sent();
                        return [2, ctx.body = { status: 500 }];
                    case 7: return [2];
                }
            });
        }); });
        app.router('deliver', function (ctx, next) { return __awaiter(_this, void 0, void 0, function () {
            var tid, target, e_7;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        tid = event.data.tid;
                        return [4, db.collection('deliver')
                                .where({
                                tid: tid,
                                type: 'deliver-img'
                            })
                                .get()];
                    case 1:
                        target = _a.sent();
                        return [2, ctx.body = {
                                status: 200,
                                data: target.data[0] ? target.data[0].imgs : []
                            }];
                    case 2:
                        e_7 = _a.sent();
                        return [2, ctx.body = { status: 500 }];
                    case 3: return [2];
                }
            });
        }); });
        app.router('close', function (ctx, next) { return __awaiter(_this, void 0, void 0, function () {
            var tid_1, orders$, trip$_1, members, e_8;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 7, , 8]);
                        tid_1 = event.data.tid;
                        return [4, db.collection('trip')
                                .doc(String(tid_1))
                                .update({
                                data: {
                                    isClosed: true
                                }
                            })];
                    case 1:
                        _a.sent();
                        return [4, db.collection('order')
                                .where({
                                tid: tid_1,
                                pay_status: '0',
                            })
                                .get()];
                    case 2:
                        orders$ = _a.sent();
                        return [4, Promise.all(orders$.data.map(function (order$) {
                                return db.collection('order')
                                    .doc(String(order$._id))
                                    .update({
                                    data: {
                                        base_status: '5'
                                    }
                                });
                            }))];
                    case 3:
                        _a.sent();
                        return [4, db.collection('trip')
                                .doc(tid_1)
                                .get()];
                    case 4:
                        trip$_1 = _a.sent();
                        return [4, db.collection('manager-member')
                                .where({
                                push: true
                            })
                                .get()];
                    case 5:
                        members = _a.sent();
                        return [4, Promise.all(members.data.map(function (member) { return __awaiter(_this, void 0, void 0, function () {
                                var push1$, push2$;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4, cloud.callFunction({
                                                name: 'common',
                                                data: {
                                                    $url: 'push-subscribe-cloud',
                                                    data: {
                                                        openid: member.openid,
                                                        type: 'getMoney',
                                                        page: "pages/manager-trip-order/index?id=" + tid_1 + "&ac=" + 1,
                                                        texts: ["" + trip$_1.data.title, "\u5173\u95ED\u6210\u529F\uFF01\u4E00\u952E\u6536\u6B3E\u529F\u80FD\u5DF2\u5F00\u542F"]
                                                    }
                                                }
                                            })];
                                        case 1:
                                            push1$ = _a.sent();
                                            return [4, cloud.callFunction({
                                                    name: 'trip',
                                                    data: {
                                                        $url: 'close-trip-analyze',
                                                        data: {
                                                            tid: tid_1
                                                        }
                                                    }
                                                })];
                                        case 2:
                                            push2$ = _a.sent();
                                            return [2];
                                    }
                                });
                            }); }))];
                    case 6:
                        _a.sent();
                        return [2, ctx.body = { status: 200 }];
                    case 7:
                        e_8 = _a.sent();
                        return [2, ctx.body = { status: 500 }];
                    case 8: return [2];
                }
            });
        }); });
        app.router('close-trip-analyze', function (ctx, next) { return __awaiter(_this, void 0, void 0, function () {
            var income, pinGoodsNum, visitGoodsNum, daysNum, visitNum, visitorNum, pinNum, tid_2, trip$, trip, visitRecords$, visitRecords, sl$, sl, slOrders$, slOpenids_1, goodIds_1, visitOpenids_1, text1, text2, texts_1, adms$, e_9;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 7, , 8]);
                        income = 0;
                        pinGoodsNum = 0;
                        visitGoodsNum = 0;
                        daysNum = 0;
                        visitNum = 0;
                        visitorNum = 0;
                        pinNum = 0;
                        tid_2 = event.data.tid;
                        return [4, db.collection('trip')
                                .doc(String(tid_2))
                                .field({
                                end_date: true,
                                start_date: true
                            })
                                .get()];
                    case 1:
                        trip$ = _a.sent();
                        trip = trip$.data;
                        return [4, db.collection('good-visiting-record')
                                .where({
                                visitTime: _.gte(trip.start_date)
                            })
                                .get()];
                    case 2:
                        visitRecords$ = _a.sent();
                        visitRecords = visitRecords$.data;
                        return [4, db.collection('shopping-list')
                                .where({
                                tid: tid_2
                            })
                                .field({
                                pid: true,
                                oids: true,
                                uids: true,
                                adjustPrice: true,
                                adjustGroupPrice: true
                            })
                                .get()];
                    case 3:
                        sl$ = _a.sent();
                        sl = sl$.data;
                        return [4, Promise.all(sl.map(function (s) { return __awaiter(_this, void 0, void 0, function () {
                                var oids, orders;
                                var _this = this;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            oids = s.oids;
                                            return [4, Promise.all(oids.map(function (o) { return __awaiter(_this, void 0, void 0, function () {
                                                    var order$;
                                                    return __generator(this, function (_a) {
                                                        switch (_a.label) {
                                                            case 0: return [4, db.collection('order')
                                                                    .doc(String(o))
                                                                    .field({
                                                                    count: true,
                                                                    allocatedCount: true
                                                                })
                                                                    .get()];
                                                            case 1:
                                                                order$ = _a.sent();
                                                                return [2, order$.data];
                                                        }
                                                    });
                                                }); }))];
                                        case 1:
                                            orders = _a.sent();
                                            return [2, __assign({}, s, { orders: orders })];
                                    }
                                });
                            }); }))];
                    case 4:
                        slOrders$ = _a.sent();
                        income = slOrders$.reduce(function (sum, sl) {
                            var orders = sl.orders, uids = sl.uids, adjustPrice = sl.adjustPrice, adjustGroupPrice = sl.adjustGroupPrice;
                            var slInome = orders.reduce(function (last, order) {
                                var allocatedCount = order.allocatedCount, count = order.count;
                                var count_ = allocatedCount !== undefined ? allocatedCount : count;
                                return last + (uids.length > 1 ? (adjustGroupPrice ? adjustGroupPrice : adjustPrice) : adjustPrice) * count_;
                            }, 0);
                            return slInome + sum;
                        }, 0);
                        slOpenids_1 = [];
                        sl.map(function (s) {
                            slOpenids_1 = slOpenids_1.concat(s.uids);
                        });
                        pinNum = Array.from(new Set(slOpenids_1)).length;
                        pinGoodsNum = sl.length;
                        goodIds_1 = [];
                        visitOpenids_1 = [];
                        visitRecords.map(function (v) {
                            goodIds_1 = goodIds_1.concat([v.pid]);
                            visitOpenids_1 = visitOpenids_1.concat([v.openid]);
                        });
                        visitGoodsNum = Array.from(new Set(goodIds_1)).length;
                        visitorNum = Array.from(new Set(visitOpenids_1)).length;
                        visitNum = visitorNum * visitGoodsNum * 3;
                        daysNum = Math.ceil((trip.end_date - trip.start_date) / (24 * 60 * 60 * 1000));
                        text1 = daysNum + "\u5929\u5185\uFF0C";
                        text2 = visitGoodsNum + "\u4EF6\u5546\u54C1\u88AB" + visitorNum + "\u4EBA\u56F4\u89C2" + visitNum + "\u6B21";
                        texts_1 = [
                            "\u6536\u76CA" + income + "\u5143\uFF0C" + pinNum + "\u4EBA\u62FC\u56E2" + pinGoodsNum + "\u4EF6\u5546\u54C1",
                            (text1 + text2).length > 20 ? text2 : text1 + text2
                        ];
                        return [4, db.collection('manager-member')
                                .where({})
                                .get()];
                    case 5:
                        adms$ = _a.sent();
                        return [4, Promise.all(adms$.data.map(function (adm) { return __awaiter(_this, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4, cloud.callFunction({
                                                name: 'common',
                                                data: {
                                                    $url: 'push-subscribe-cloud',
                                                    data: {
                                                        openid: adm.openid,
                                                        type: 'waitPin',
                                                        page: "pages/manager-trip-list/index",
                                                        texts: texts_1
                                                    }
                                                }
                                            })];
                                        case 1:
                                            _a.sent();
                                            return [4, cloud.callFunction({
                                                    name: 'common',
                                                    data: {
                                                        $url: 'push-subscribe-cloud',
                                                        data: {
                                                            openid: adm.openid,
                                                            type: 'trip',
                                                            page: "pages/trip-reward/index?tid=" + tid_2,
                                                            texts: ['群拼团报告已出！', '点击并分享给群友吧～']
                                                        }
                                                    }
                                                })];
                                        case 2:
                                            _a.sent();
                                            return [2];
                                    }
                                });
                            }); }))];
                    case 6:
                        _a.sent();
                        return [2, ctx.body = {
                                status: 200,
                                data: {
                                    texts: texts_1,
                                    pinNum: pinNum,
                                    income: income,
                                    pinGoodsNum: pinGoodsNum,
                                    visitorNum: visitorNum,
                                    visitGoodsNum: visitGoodsNum,
                                    visitNum: visitNum,
                                    daysNum: daysNum,
                                }
                            }];
                    case 7:
                        e_9 = _a.sent();
                        console.log('????', e_9);
                        return [2, ctx.body = {
                                status: 500,
                                message: e_9
                            }];
                    case 8: return [2];
                }
            });
        }); });
        return [2, app.serve()];
    });
}); };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLGlCQW02QkM7O0FBbjZCRCxxQ0FBdUM7QUFDdkMsc0NBQXdDO0FBRXhDLEtBQUssQ0FBQyxJQUFJLENBQUM7SUFDUCxHQUFHLEVBQUUsS0FBSyxDQUFDLG1CQUFtQjtDQUNqQyxDQUFDLENBQUM7QUFFSCxJQUFNLEVBQUUsR0FBZ0IsS0FBSyxDQUFDLFFBQVEsRUFBRyxDQUFDO0FBQzFDLElBQU0sQ0FBQyxHQUFHLEVBQUUsQ0FBQyxPQUFPLENBQUM7QUFRckIsSUFBTSxNQUFNLEdBQUcsVUFBRSxFQUFVO0lBQVYsbUJBQUEsRUFBQSxVQUFVO0lBQ3ZCLElBQUssRUFBRSxFQUFHO1FBQ04sT0FBTyxJQUFJLENBQUMsR0FBRyxFQUFHLENBQUM7S0FDdEI7SUFDRCxJQUFNLE1BQU0sR0FBRyxJQUFJLElBQUksQ0FBRSxJQUFJLElBQUksRUFBRyxDQUFDLGNBQWMsRUFBRyxDQUFDLENBQUM7SUFDeEQsT0FBTyxJQUFJLElBQUksQ0FBRSxNQUFNLENBQUMsT0FBTyxFQUFHLEdBQUcsQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsSUFBSSxDQUFFLENBQUE7QUFDN0QsQ0FBQyxDQUFBO0FBMEJZLFFBQUEsSUFBSSxHQUFHLFVBQVEsS0FBSyxFQUFFLE9BQU87Ozs7UUFFaEMsR0FBRyxHQUFHLElBQUksU0FBUyxDQUFDLEVBQUUsS0FBSyxPQUFBLEVBQUUsQ0FBQyxDQUFDO1FBUXJDLEdBQUcsQ0FBQyxNQUFNLENBQUMsT0FBTyxFQUFFLFVBQU8sR0FBRyxFQUFFLElBQUk7Ozs7Ozt3QkFFdEIsY0FBYyxHQUFHLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQyxTQUFT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QU07NERBQ2xCLElBQUksRUFBRSxNQUFNOzREQUNaLElBQUksRUFBRSxpQ0FBK0IsS0FBSzs0REFDMUMsS0FBSyxFQUFFLENBQUMsVUFBVSxFQUFFLFlBQVksQ0FBQzt5REFDcEM7cURBQ0o7aURBQ0osQ0FBQyxFQUFBOzs0Q0FYRixTQVdFLENBQUM7NENBRUgsV0FBTTs7O2lDQUNULENBQUMsQ0FDTCxFQUFBOzt3QkFqQ0QsU0FpQ0MsQ0FBQzt3QkFFRixXQUFPLEdBQUcsQ0FBQyxJQUFJLEdBQUc7Z0NBQ2QsTUFBTSxFQUFFLEdBQUc7Z0NBQ1gsSUFBSSxFQUFFO29DQUNGLEtBQUssU0FBQTtvQ0FDTCxNQUFNLFFBQUE7b0NBQ04sTUFBTSxRQUFBO29DQUNOLFdBQVcsYUFBQTtvQ0FDWCxVQUFVLFlBQUE7b0NBQ1YsYUFBYSxlQUFBO29DQUNiLFFBQVEsVUFBQTtvQ0FDUixPQUFPLFNBQUE7aUNBQ1Y7NkJBQ0osRUFBQTs7O3dCQUdELE9BQU8sQ0FBQyxHQUFHLENBQUMsTUFBTSxFQUFFLEdBQUMsQ0FBRSxDQUFBO3dCQUN2QixXQUFPLEdBQUcsQ0FBQyxJQUFJLEdBQUc7Z0NBQ2QsTUFBTSxFQUFFLEdBQUc7Z0NBQ1gsT0FBTyxFQUFFLEdBQUM7NkJBQ2IsRUFBQTs7OzthQUVSLENBQUMsQ0FBQztRQUVILFdBQU8sR0FBRyxDQUFDLEtBQUssRUFBRyxFQUFDOztLQUV2QixDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgY2xvdWQgZnJvbSAnd3gtc2VydmVyLXNkayc7XG5pbXBvcnQgKiBhcyBUY2JSb3V0ZXIgZnJvbSAndGNiLXJvdXRlcic7XG5cbmNsb3VkLmluaXQoe1xuICAgIGVudjogY2xvdWQuRFlOQU1JQ19DVVJSRU5UX0VOVlxufSk7XG5cbmNvbnN0IGRiOiBEQi5EYXRhYmFzZSA9IGNsb3VkLmRhdGFiYXNlKCApO1xuY29uc3QgXyA9IGRiLmNvbW1hbmQ7XG5cbi8qKiBcbiAqIOi9rOaNouagvOael+WwvOayu+aXtuWMuiArOOaXtuWMulxuICogRGF0ZSgpLm5vdygpIC8gbmV3IERhdGUoKS5nZXRUaW1lKCkg5piv5pe25LiN5pe25q2j5bi455qEKzhcbiAqIERhdGUudG9Mb2NhbFN0cmluZyggKSDlpb3lg4/mmK/kuIDnm7TmmK8rMOeahFxuICog5YWI5ou/5YiwICsw77yM54S25ZCOKzhcbiAqL1xuY29uc3QgZ2V0Tm93ID0gKCB0cyA9IGZhbHNlICk6IGFueSA9PiB7XG4gICAgaWYgKCB0cyApIHtcbiAgICAgICAgcmV0dXJuIERhdGUubm93KCApO1xuICAgIH1cbiAgICBjb25zdCB0aW1lXzAgPSBuZXcgRGF0ZSggbmV3IERhdGUoICkudG9Mb2NhbGVTdHJpbmcoICkpO1xuICAgIHJldHVybiBuZXcgRGF0ZSggdGltZV8wLmdldFRpbWUoICkgKyA4ICogNjAgKiA2MCAqIDEwMDAgKVxufVxuXG4vKipcbiAqXG4gKiBAZGVzY3JpcHRpb24g6KGM56iL5qih5Z2XXG4gKiAtLS0tLS0tLSDlrZfmrrUgLS0tLS0tLS0tLVxuICAgICAgICB0aXRsZSDmoIfpopggc3RyaW5nXG4gICAgICAgIHdhcm5pbmc6IOaYr+WQpuWPkemAgei/h+acn+itpuWRiue7mWFkbSxcbiAgICAgICAgc3RhcnRfZGF0ZSDlvIDlp4vml7bpl7QgbnVtYmVyXG4gICAgICAgIGVuZF9kYXRlIOe7k+adn+aXtumXtCBudW1iZXJcbiAgICAgICAgcmVkdWNlX3ByaWNlIOihjOeoi+eri+WHjyBudW1iZXJcbiAgICAgICAgc2FsZXNfdm9sdW1lIOmUgOWUruaAu+minVxuICAgICAgICBmdWxscmVkdWNlX2F0bGVhc3Qg6KGM56iL5ruh5YePIC0g6Zeo5qebIG51bWJlclxuICAgICAgICBmdWxscmVkdWNlX3ZhbHVlcyDooYznqIvmu6Hlh48gLSDlh4/lpJrlsJEgbnVtYmVyXG4gICAgICAgIGNhc2hjb3Vwb25fYXRsZWFzdCDooYznqIvku6Pph5HliLggLSDpl6jmp5sgbnVtYmVyXG4gICAgICAgIGNhc2hjb3Vwb25fdmFsdWVzIOihjOeoi+S7o+mHkeWIuCAtIOmHkeminSBudW1iZXJcbiohICAgICAgcG9zdGFnZSDpgq7otLnnsbvlnosgZGljIFxuKiEgICAgICBwb3N0YWdlZnJlZV9hdGxlYXN0ICDlhY3pgq7pl6jmp5sgbnVtYmVyXG4gICAgICAgIHBheW1lbnQg5LuY5qy+57G75Z6LIGRpYyBcbiAgICAgICAgcHVibGlzaGVkIOaYr+WQpuWPkeW4gyBib29sZWFuXG4gICAgICAgIGNyZWF0ZVRpbWUg5Yib5bu65pe26Ze0XG4gICAgICAgIHVwZGF0ZVRpbWUg5pu05paw5pe26Ze0XG4gICAgICAgIGlzQ2xvc2VkOiDmmK/lkKblt7Lnu4/miYvliqjlhbPpl61cbiAgICAgICAgY2FsbE1vbmV5VGltZXM6IOWPkei1t+WCrOasvuasoeaVsFxuKiEgICAgICB0eXBlOiDnsbvlnovvvIxzeXPvvIjns7vnu5/oh6rliqjlj5HotbfvvInjgIF1bmRlZmluZWTvvIjmiYvliqjliJvlu7rvvIlcbiAqL1xuZXhwb3J0IGNvbnN0IG1haW4gPSBhc3luYyAoIGV2ZW50LCBjb250ZXh0ICkgPT4ge1xuXG4gICAgY29uc3QgYXBwID0gbmV3IFRjYlJvdXRlcih7IGV2ZW50IH0pO1xuXG4gICAgLyoqXG4gICAgICogLS0tLS0tIOivt+axgiAtLS0tLS0tLVxuICAgICAqIHtcbiAgICAgKiAgICBzaG91bGRHZXRHb29kczog6buY6K6kdHJ1Ze+8jOWPr+S7peS4jeWhq++8jOiOt+WPluihjOeoi+aOqOiNkOWVhuWTgVxuICAgICAqIH1cbiAgICAgKi9cbiAgICBhcHAucm91dGVyKCdlbnRlcicsIGFzeW5jKCBjdHgsIG5leHQgKSA9PiB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBjb25zdCBzaG91bGRHZXRHb29kcyA9IGV2ZW50LmRhdGEgPyBldmVudC5kYXRhLnNob3VsZEdldEdvb2RzIDogdW5kZWZpbmVkO1xuXG4gICAgICAgICAgICAvLyDmjInlvIDlp4vml6XmnJ/mraPluo/vvIzojrflj5bmnIDlpJoy5p2hIOW3suWPkeW4g+OAgeacque7k+adn+eahOihjOeoi1xuICAgICAgICAgICAgY29uc3QgZGF0YSQgPSBhd2FpdCBkYi5jb2xsZWN0aW9uKCd0cmlwJylcbiAgICAgICAgICAgICAgICAud2hlcmUoe1xuICAgICAgICAgICAgICAgICAgICBpc0Nsb3NlZDogZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgIHB1Ymxpc2hlZDogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgZW5kX2RhdGU6IF8uZ3QoIGdldE5vdyggdHJ1ZSApKVxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLmxpbWl0KCAyIClcbiAgICAgICAgICAgICAgICAub3JkZXJCeSgnc3RhcnRfZGF0ZScsICdhc2MnKVxuICAgICAgICAgICAgICAgIC5nZXQoICk7XG5cbiAgICAgICAgICAgIGxldCB0cmlwcyA9IGRhdGEkLmRhdGE7XG5cbiAgICAgICAgICAgIC8vIOaLieWPluacgOaWsOihjOeoi+eahOaOqOiNkOWVhuWTgVxuICAgICAgICAgICAgaWYgKCggISF0cmlwc1sgMCBdICYmIHNob3VsZEdldEdvb2RzID09PSB1bmRlZmluZWQgKSB8fCBzaG91bGRHZXRHb29kcyA9PT0gdHJ1ZSApIHtcbiAgICAgICAgICAgICAgICBjb25zdCB0cmlwT25lUHJvZHVjdHMkID0gYXdhaXQgUHJvbWlzZS5hbGwoIHRyaXBzWyAwIF0uc2VsZWN0ZWRQcm9kdWN0SWRzLm1hcCggcGlkID0+IHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGNsb3VkLmNhbGxGdW5jdGlvbih7XG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBfaWQ6IHBpZCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICR1cmw6ICdkZXRhaWwnXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogJ2dvb2QnXG4gICAgICAgICAgICAgICAgICAgIH0pLnRoZW4oIHJlcyA9PiByZXMucmVzdWx0LmRhdGEgKTtcbiAgICAgICAgICAgICAgICB9KSk7XG4gICAgICAgICAgICAgICAgdHJpcHNbIDAgXSA9IE9iamVjdC5hc3NpZ24oeyB9LCB0cmlwc1sgMCBdLCB7XG4gICAgICAgICAgICAgICAgICAgIHByb2R1Y3RzOiB0cmlwT25lUHJvZHVjdHMkXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiBjdHguYm9keSA9IHtcbiAgICAgICAgICAgICAgICBzdGF0dXM6IDIwMCxcbiAgICAgICAgICAgICAgICBkYXRhOiB0cmlwc1xuICAgICAgICAgICAgfTtcblxuICAgICAgICB9IGNhdGNoICggZSApIHtcbiAgICAgICAgICAgIHJldHVybiBjdHguYm9keSA9IHtcbiAgICAgICAgICAgICAgICBzdGF0dXM6IDUwMCxcbiAgICAgICAgICAgICAgICBtZXNzYWdlOiBlXG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICBhcHAucm91dGVyKCdsaXN0JywgYXN5bmMoIGN0eCwgbmV4dCApID0+IHtcbiAgICAgICAgdHJ5IHtcblxuICAgICAgICAgICAgLy8g5p+l6K+i5p2h5pWwXG4gICAgICAgICAgICBjb25zdCBsaW1pdCA9IDIwO1xuICAgICAgICAgICAgY29uc3Qgc2VhcmNoJCA9IGV2ZW50LmRhdGEudGl0bGUgfHwgJyc7XG4gICAgICAgICAgICBjb25zdCBzZWFyY2ggPSBuZXcgUmVnRXhwKCBzZWFyY2gkLnJlcGxhY2UoL1xccysvZywgXCJcIiksICdpJyk7XG5cbiAgICAgICAgICAgIC8vIOiOt+WPluaAu+aVsFxuICAgICAgICAgICAgY29uc3QgdG90YWwkID0gYXdhaXQgZGIuY29sbGVjdGlvbigndHJpcCcpXG4gICAgICAgICAgICAgICAgLndoZXJlKHtcbiAgICAgICAgICAgICAgICAgICAgdGl0bGU6IHNlYXJjaFxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLmNvdW50KCApO1xuXG4gICAgICAgICAgICAvLyDojrflj5bmlbDmja5cbiAgICAgICAgICAgIGNvbnN0IHRyaXBzJCA9IGF3YWl0IGRiLmNvbGxlY3Rpb24oJ3RyaXAnKVxuICAgICAgICAgICAgICAgIC53aGVyZSh7XG4gICAgICAgICAgICAgICAgICAgIHRpdGxlOiBzZWFyY2hcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIC5saW1pdCggbGltaXQgKVxuICAgICAgICAgICAgICAgIC5za2lwKCggZXZlbnQuZGF0YS5wYWdlIC0gMSApICogbGltaXQgKVxuICAgICAgICAgICAgICAgIC5vcmRlckJ5KCd1cGRhdGVUaW1lJywgJ2Rlc2MnKVxuICAgICAgICAgICAgICAgIC5nZXQoICk7XG5cbiAgICAgICAgICAgIGNvbnN0IG1vcmUgPSBhd2FpdCBQcm9taXNlLmFsbChcbiAgICAgICAgICAgICAgICB0cmlwcyQuZGF0YS5tYXAoIGFzeW5jIHRyaXAgPT4ge1xuXG4gICAgICAgICAgICAgICAgICAgIC8vIOiOt+WPluihjOeoi+eahOi0reeJqea4heWNlVxuICAgICAgICAgICAgICAgICAgICBjb25zdCBzbCQgPSBhd2FpdCBkYi5jb2xsZWN0aW9uKCdzaG9wcGluZy1saXN0JylcbiAgICAgICAgICAgICAgICAgICAgICAgIC53aGVyZSh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGlkOiB0cmlwLl9pZFxuICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgICAgIC5maWVsZCh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcGlkOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9pZHM6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdWlkczogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhZGp1c3RQcmljZTogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhZGp1c3RHcm91cFByaWNlOiB0cnVlXG4gICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAgICAgLmdldCggKTtcbiAgICAgICAgICAgICAgICAgICAgY29uc3Qgc2wgPSBzbCQuZGF0YTtcblxuICAgICAgICAgICAgICAgICAgICAvLyDnu5/orqHmlLbnm4pcbiAgICAgICAgICAgICAgICAgICAgY29uc3Qgc2xPcmRlcnMkID0gYXdhaXQgUHJvbWlzZS5hbGwoXG4gICAgICAgICAgICAgICAgICAgICAgICBzbC5tYXAoIGFzeW5jIHMgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHsgb2lkcyB9ID0gcztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBvcmRlcnM6IGFueSA9IGF3YWl0IFByb21pc2UuYWxsKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvaWRzLm1hcCggYXN5bmMgbyA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBvcmRlciQgPSBhd2FpdCBkYi5jb2xsZWN0aW9uKCdvcmRlcicpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLmRvYyggU3RyaW5nKCBvICkpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLmZpZWxkKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY291bnQ6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFsbG9jYXRlZENvdW50OiB0cnVlXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAuZ2V0KCApO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG9yZGVyJC5kYXRhO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLi4ucyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb3JkZXJzXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgKTtcblxuICAgICAgICAgICAgICAgICAgICAvLyDnu5/orqHmlLbnm4pcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgaW5jb21lID0gc2xPcmRlcnMkLnJlZHVjZSgoIHN1bSwgc2w6IGFueSApID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHsgb3JkZXJzLCB1aWRzLCBhZGp1c3RQcmljZSwgYWRqdXN0R3JvdXBQcmljZSB9ID0gc2w7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBzbElub21lID0gb3JkZXJzLnJlZHVjZSgoIGxhc3QsIG9yZGVyICkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHsgYWxsb2NhdGVkQ291bnQsIGNvdW50IH0gPSBvcmRlcjtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgY291bnRfID0gYWxsb2NhdGVkQ291bnQgIT09IHVuZGVmaW5lZCA/IGFsbG9jYXRlZENvdW50IDogY291bnQ7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGxhc3QgKyAoIHVpZHMubGVuZ3RoID4gMSA/ICggYWRqdXN0R3JvdXBQcmljZSA/IGFkanVzdEdyb3VwUHJpY2UgOiBhZGp1c3RQcmljZSApIDogYWRqdXN0UHJpY2UgKSAqIGNvdW50XztcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sIDAgKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBzbElub21lICsgc3VtO1xuICAgICAgICAgICAgICAgICAgICB9LCAwICk7XG5cbiAgICAgICAgICAgICAgICAgICAgY29uc3Qgb3JkZXJzJCA9IGF3YWl0IGRiLmNvbGxlY3Rpb24oJ29yZGVyJylcbiAgICAgICAgICAgICAgICAgICAgICAgIC53aGVyZSh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGlkOiB0cmlwLl9pZCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXlfc3RhdHVzOiBfLmVxKCcxJyksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYmFzZV9zdGF0dXM6IF8ub3IoIF8uZXEoJzAnKSxfLmVxKCcxJyksIF8uZXEoJzInKSwgXy5lcSgnMycpKVxuICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgICAgIC5maWVsZCh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb3BlbmlkOiB0cnVlXG4gICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAgICAgLmdldCggKTtcblxuICAgICAgICAgICAgICAgICAgICAvLyDmnKrku5jmrL7kubDlrrZcbiAgICAgICAgICAgICAgICAgICAgY29uc3Qgbm90UGF5QWxsQ2xpZW50cyA9IEFycmF5LmZyb20oXG4gICAgICAgICAgICAgICAgICAgICAgICBuZXcgU2V0KCBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvcmRlcnMkLmRhdGFcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLm1hcCggeCA9PiB4Lm9wZW5pZCApXG4gICAgICAgICAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgICAgICAgICkubGVuZ3RoO1xuXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBub3RQYXlBbGxDbGllbnRzLFxuICAgICAgICAgICAgICAgICAgICAgICAgc2FsZXNfdm9sdW1lOiBpbmNvbWVcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICk7XG5cbiAgICAgICAgICAgIGNvbnN0IGluamVjdCA9IHRyaXBzJC5kYXRhLm1hcCgoIHRyaXAsIGtleSApID0+IHtcbiAgICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgICAgICAuLi50cmlwLFxuICAgICAgICAgICAgICAgICAgICAuLi5tb3JlWyBrZXkgXVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICBcbiAgICAgICAgICAgIHJldHVybiBjdHguYm9keSA9IHtcbiAgICAgICAgICAgICAgICBzdGF0dXM6IDIwMCxcbiAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICAgIHNlYXJjaDogZXZlbnQuZGF0YS50aXRsZS5yZXBsYWNlKC9cXHMrL2csICcnKSxcbiAgICAgICAgICAgICAgICAgICAgcGFnZVNpemU6IGxpbWl0LFxuICAgICAgICAgICAgICAgICAgICBwYWdlOiBldmVudC5kYXRhLnBhZ2UsXG4gICAgICAgICAgICAgICAgICAgIGRhdGE6IGluamVjdCxcbiAgICAgICAgICAgICAgICAgICAgdG90YWw6IHRvdGFsJC50b3RhbCxcbiAgICAgICAgICAgICAgICAgICAgdG90YWxQYWdlOiBNYXRoLmNlaWwoIHRvdGFsJC50b3RhbCAvIGxpbWl0IClcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgIH0gY2F0Y2ggKCBlICkge1xuICAgICAgICAgICAgcmV0dXJuIGN0eC5ib2R5ID0ge1xuICAgICAgICAgICAgICAgIHN0YXR1czogNTAwLFxuICAgICAgICAgICAgICAgIG1lc3NhZ2U6IGVcbiAgICAgICAgICAgIH07XG4gICAgICAgIH0gXG4gICAgfSk7XG4gICAgXG4gICAgLyoqXG4gICAgICogQGRlc2NyaXB0aW9uXG4gICAgICog6KGM56iL6K+m5oOFXG4gICAgICoge1xuICAgICAqICAgICAgbW9yZURldGFpbDogdW5kZWZpbmVkIHwgZmFsc2UgfCB0cnVlXG4gICAgICogfVxuICAgICAqL1xuICAgIGFwcC5yb3V0ZXIoJ2RldGFpbCcsIGFzeW5jKCBjdHgsIG5leHQgKSA9PiB7XG4gICAgICAgIHRyeSB7XG5cbiAgICAgICAgICAgIGNvbnN0IHsgbW9yZURldGFpbCB9ID0gZXZlbnQuZGF0YTtcbiAgICAgICAgICAgIGNvbnN0IHRpZCA9IGV2ZW50LmRhdGEuX2lkIHx8IGV2ZW50LmRhdGEudGlkO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICAvLyDojrflj5bln7rmnKzor6bmg4VcbiAgICAgICAgICAgIGNvbnN0IGRhdGEkID0gYXdhaXQgZGIuY29sbGVjdGlvbigndHJpcCcpXG4gICAgICAgICAgICAgICAgLmRvYyggdGlkIClcbiAgICAgICAgICAgICAgICAuZ2V0KCApO1xuICAgICAgICAgICAgY29uc3QgbWV0YSA9IGRhdGEkLmRhdGE7XG5cbiAgICAgICAgICAgIGlmICggbW9yZURldGFpbCAhPT0gZmFsc2UgKSB7XG4gICAgICAgICAgICAgICAgLy8g6YCa6L+H5bey6YCJ55qE5ZWG5ZOBaWRzLOaLv+WIsOWvueW6lOeahOWbvueJh+OAgXRpdGxl44CBX2lkXG4gICAgICAgICAgICAgICAgY29uc3QgcHJvZHVjdHMkOiBhbnkgPSBhd2FpdCBQcm9taXNlLmFsbCggbWV0YS5zZWxlY3RlZFByb2R1Y3RJZHMubWFwKCBwaWQgPT4ge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZGIuY29sbGVjdGlvbignZ29vZHMnKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC53aGVyZSh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIF9pZDogcGlkXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAuZmllbGQoe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbWc6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRpdGxlOiB0cnVlXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAuZ2V0KCApO1xuICAgICAgICAgICAgICAgIH0pKTtcblxuICAgICAgICAgICAgICAgIG1ldGEuc2VsZWN0ZWRQcm9kdWN0cyA9IHByb2R1Y3RzJC5tYXAoIHggPT4ge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4geC5kYXRhWyAwIF07XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIG1ldGEuc2VsZWN0ZWRQcm9kdWN0cyA9IFsgXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIFxuICAgICAgICAgICAgY29uc3QgY2FuRWRpdCQgPSBhd2FpdCBkYi5jb2xsZWN0aW9uKCdjb3Vwb24nKVxuICAgICAgICAgICAgICAgIC53aGVyZSh7XG4gICAgICAgICAgICAgICAgICAgIHRpZFxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLmNvdW50KCApO1xuXG4gICAgICAgICAgICAvLyBtZXRhLmNhbkVkaXRDb3Vwb25zID0gY2FuRWRpdCQudG90YWwgPT09IDA7XG4gICAgICAgICAgICAvLyDov5nkuKrniYjmnKzlj6rmnIkg56uL5YePXG4gICAgICAgICAgICBtZXRhLmNhbkVkaXRDb3Vwb25zID0gdHJ1ZTtcblxuICAgICAgICAgICAgcmV0dXJuIGN0eC5ib2R5ID0ge1xuICAgICAgICAgICAgICAgIHN0YXR1czogMjAwLFxuICAgICAgICAgICAgICAgIGRhdGE6IG1ldGFcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgfSBjYXRjaCggZSApIHtcbiAgICAgICAgICAgIHJldHVybiBjdHguYm9keSA9IHtcbiAgICAgICAgICAgICAgICBzdGF0dXM6IDUwMCxcbiAgICAgICAgICAgICAgICBtZXNzYWdlOiBlXG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICAvKipcbiAgICAgKiBAZGVzY3JpcHRpb25cbiAgICAgKiDliJvlu7ogLyDnvJbovpHlvZPliY3ooYznqItcbiAgICAgKi9cbiAgICBhcHAucm91dGVyKCdlZGl0JywgYXN5bmMoIGN0eCwgbmV4dCApID0+IHtcbiAgICAgICAgdHJ5IHtcblxuICAgICAgICAgICAgbGV0IGxhc3RUcmlwOiBhbnkgPSBudWxsO1xuICAgICAgICAgICAgbGV0IHN0YXJ0X2RhdGUgPSBnZXROb3coIHRydWUgKTtcbiAgICAgICAgICAgIGxldCBfaWQgPSBldmVudC5kYXRhLl9pZDtcbiAgICAgICAgICAgIGNvbnN0IHRpZCA9IGV2ZW50LmRhdGEuX2lkO1xuICAgICAgICAgICAgY29uc3QgeyBwdWJsaXNoZWQsIHRpdGxlLCByZWR1Y2VfcHJpY2UgfSA9IGV2ZW50LmRhdGE7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGNvbnN0IGdldEVyciA9IG1lc3NhZ2UgPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiBjdHguYm9keSA9IHtcbiAgICAgICAgICAgICAgICAgICAgc3RhdHVzOiA1MDAsXG4gICAgICAgICAgICAgICAgICAgIG1lc3NhZ2VcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAvLyDooYznqIvpu5jorqTlnKjlvZPlpKnmmZrkuIoyM+eCuee7k+adn1xuICAgICAgICAgICAgY29uc3QgZml4RW5kRGF0ZSA9IGVuZERhdGUgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IHQgPSBuZXcgRGF0ZSggZW5kRGF0ZSApO1xuICAgICAgICAgICAgICAgIGNvbnN0IHkgPSB0LmdldEZ1bGxZZWFyKCApO1xuICAgICAgICAgICAgICAgIGNvbnN0IG0gPSB0LmdldE1vbnRoKCApICsgMTtcbiAgICAgICAgICAgICAgICBjb25zdCBkID0gdC5nZXREYXRlKCApO1xuXG4gICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBEYXRlKGAke3l9LyR7bX0vJHtkfSAyMzowMDowMGApLmdldFRpbWUoICk7XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICBjb25zdCBlbmRfZGF0ZSA9IGZpeEVuZERhdGUoIE51bWJlciggZXZlbnQuZGF0YS5lbmRfZGF0ZSApKTtcblxuICAgICAgICAgICAgaWYgKCByZWR1Y2VfcHJpY2UgPCAxICkge1xuICAgICAgICAgICAgICAgIHJldHVybiBnZXRFcnIoJ+eri+WHj+mHkemineS4jeiDveWwkeS6jjHlhYMnKVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyDliJvlu7rooYznqItcbiAgICAgICAgICAgIGlmICggIV9pZCApIHtcblxuICAgICAgICAgICAgICAgIGNvbnN0IGNvdW50JCA9IGF3YWl0IGRiLmNvbGxlY3Rpb24oJ3RyaXAnKVxuICAgICAgICAgICAgICAgICAgICAud2hlcmUoe1xuICAgICAgICAgICAgICAgICAgICAgICAgaXNDbG9zZWQ6IGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICAgICAgcHVibGlzaGVkOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAuY291bnQoICk7XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgaWYgKCBjb3VudCQudG90YWwgKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBnZXRFcnIoJ+acieacque7k+adn+ihjOeoiyzor7fnu5PmnZ/ooYznqIvlkI7lho3liJvlu7onKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBjb25zdCBjcmVhdGVEYXRhID0ge1xuICAgICAgICAgICAgICAgICAgICAuLi5ldmVudC5kYXRhLFxuICAgICAgICAgICAgICAgICAgICBlbmRfZGF0ZSxcbiAgICAgICAgICAgICAgICAgICAgc3RhcnRfZGF0ZTogZ2V0Tm93KCB0cnVlICksXG4gICAgICAgICAgICAgICAgICAgIHdhcm5pbmc6IGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICBjYWxsTW9uZXlUaW1lczogMFxuICAgICAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgICAgICBjb25zdCBjcmVhdGUkID0gYXdhaXQgZGIuY29sbGVjdGlvbigndHJpcCcpXG4gICAgICAgICAgICAgICAgICAgIC5hZGQoe1xuICAgICAgICAgICAgICAgICAgICAgICAgZGF0YTogY3JlYXRlRGF0YVxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICBfaWQgPSBjcmVhdGUkLl9pZDtcbiAgICAgICAgICAgIC8vIOe8lui+keihjOeoi+OAgeimhueblnN5c1RyaXBcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgXG4gICAgICAgICAgICAgICAgY29uc3Qgb3JpZ2luJCA9IGF3YWl0IGRiLmNvbGxlY3Rpb24oJ3RyaXAnKVxuICAgICAgICAgICAgICAgICAgICAud2hlcmUoe1xuICAgICAgICAgICAgICAgICAgICAgICAgX2lkXG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgIC5nZXQoICk7XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgY29uc3Qgb3JpZ2luID0gb3JpZ2luJC5kYXRhWyAwIF07XG4gICAgICAgICAgICAgICAgY29uc3QgaXNDbG9zZWQgPSBnZXROb3coIHRydWUgKSA+PSBOdW1iZXIoIGVuZF9kYXRlICk7XG4gICAgXG4gICAgICAgICAgICAgICAgZGVsZXRlIG9yaWdpblsnX2lkJ107XG4gICAgICAgICAgICAgICAgZGVsZXRlIGV2ZW50LmRhdGFbJ19pZCddO1xuICAgICAgICAgICAgICAgIGRlbGV0ZSBldmVudC5kYXRhWydjcmVhdGVUaW1lJ107XG4gICAgICAgICAgICAgICAgZGVsZXRlIGV2ZW50LmRhdGFbJ3NhbGVzX3ZvbHVtZSddXG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgY29uc3QgdGVtcCA9IE9iamVjdC5hc3NpZ24oeyB9LCBvcmlnaW4sIHtcbiAgICAgICAgICAgICAgICAgICAgLi4uZXZlbnQuZGF0YSxcbiAgICAgICAgICAgICAgICAgICAgaXNDbG9zZWQsXG4gICAgICAgICAgICAgICAgICAgIHR5cGU6ICdjdXN0b20nLFxuICAgICAgICAgICAgICAgICAgICBjYWxsTW9uZXlUaW1lczogZW5kX2RhdGUgPiBvcmlnaW5bJ2VuZF9kYXRlJ10gPyAwIDogb3JpZ2luWydjYWxsTW9uZXlUaW1lcyddXG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICBhd2FpdCBkYi5jb2xsZWN0aW9uKCd0cmlwJylcbiAgICAgICAgICAgICAgICAgICAgLmRvYyggX2lkIClcbiAgICAgICAgICAgICAgICAgICAgLnNldCh7XG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRhOiB0ZW1wXG4gICAgICAgICAgICAgICAgICAgIH0pOyAgIFxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIOaOqOmAgVxuICAgICAgICAgICAgICog5Yib5bu65pe25YCZ55qE5o6o6YCBXG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIGlmICgoICF0aWQgJiYgcHVibGlzaGVkICkpIHtcblxuICAgICAgICAgICAgICAgIGNvbnN0IHRpbWUgPSBuZXcgRGF0ZSggc3RhcnRfZGF0ZSApO1xuXG4gICAgICAgICAgICAgICAgLy8g5o6o6YCB5Luj6LSt6YCa55+lXG4gICAgICAgICAgICAgICAgY29uc3QgbWVtYmVycyA9IGF3YWl0IGRiLmNvbGxlY3Rpb24oJ21hbmFnZXItbWVtYmVyJylcbiAgICAgICAgICAgICAgICAgICAgLndoZXJlKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHB1c2g6IHRydWVcbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgLmdldCggKTtcblxuICAgICAgICAgICAgICAgIGF3YWl0IFByb21pc2UuYWxsKFxuICAgICAgICAgICAgICAgICAgICBtZW1iZXJzLmRhdGEubWFwKCBhc3luYyBtZW1iZXIgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gNOOAgeiwg+eUqOaOqOmAgVxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgcHVzaCQgPSBhd2FpdCBjbG91ZC5jYWxsRnVuY3Rpb24oe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6ICdjb21tb24nLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJHVybDogJ3B1c2gtc3Vic2NyaWJlLWNsb3VkJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb3BlbmlkOiBtZW1iZXIub3BlbmlkLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogJ3RyaXAnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGFnZTogJ3BhZ2VzL21hbmFnZXItdHJpcC1saXN0L2luZGV4JyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRleHRzOiBbYCR7dGl0bGV9YCwgYOS7o+i0reihjOeoi+aOqOmAgeWIsOWuouaIt++8jOS4lOW8gOmAmuS6huiuouWNleaOqOmAgWBdXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICApO1xuXG4gICAgICAgICAgICAgICAgLy8g5o6o6YCB5a6i5oi36YCa55+lXG4gICAgICAgICAgICAgICAgY29uc3QgdXNlcnMgPSBhd2FpdCBkYi5jb2xsZWN0aW9uKCd1c2VyJylcbiAgICAgICAgICAgICAgICAgICAgLndoZXJlKHtcblxuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAuZ2V0KCApO1xuXG4gICAgICAgICAgICAgICAgYXdhaXQgUHJvbWlzZS5hbGwoXG4gICAgICAgICAgICAgICAgICAgIHVzZXJzLmRhdGFcbiAgICAgICAgICAgICAgICAgICAgICAgIC5maWx0ZXIoIHVzZXIgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiAhbWVtYmVycy5kYXRhLmZpbmQoIG1lbWJlciA9PiBtZW1iZXIub3BlbmlkID09PSB1c2VyLm9wZW5pZCApXG4gICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAgICAgLm1hcCggYXN5bmMgdXNlciA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gNOOAgeiwg+eUqOaOqOmAgVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHB1c2gkID0gYXdhaXQgY2xvdWQuY2FsbEZ1bmN0aW9uKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogJ2NvbW1vbicsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICR1cmw6ICdwdXNoLXN1YnNjcmliZS1jbG91ZCcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb3BlbmlkOiB1c2VyLm9wZW5pZCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiAndHJpcCcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGFnZTogJ3BhZ2VzL3RyaXAtZW50ZXIvaW5kZXgnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRleHRzOiBbYCR7dGl0bGV9YCwgYOS7o+i0reWcqCR7dGltZS5nZXRNb250aCggKSsxfeaciCR7dGltZS5nZXREYXRlKCApfeaXpeW8gOWni++8geaXoOmXqOanm+eri+WHjyR7cmVkdWNlX3ByaWNlfeWFg++8gWBdXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgKTtcblxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gY3R4LmJvZHkgPSB7XG4gICAgICAgICAgICAgICAgZGF0YTogX2lkLFxuICAgICAgICAgICAgICAgIHN0YXR1czogMjAwXG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgIFxuICAgICAgICB9IGNhdGNoKCBlICkge1xuICAgICAgICAgICAgcmV0dXJuIGN0eC5ib2R5ID0ge1xuICAgICAgICAgICAgICAgIHN0YXR1czogNTAwLFxuICAgICAgICAgICAgICAgIG1lc3NhZ2U6IGVcbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgIC8qKiBcbiAgICAgKiBAZGVzY3JpcHRpb25cbiAgICAgKiDojrflj5booYznqIvlupXkuIvnmoTln7rmnKzkuJrliqHmlbDmja5cbiAgICAgKiDplIDllK7mgLvpop3jgIFcbiAgICAgKiDlrqLmiLfmgLvmlbDjgIFcbiAgICAgKiDmnKrku5jlsL7mrL7lrqLmiLfmlbDph4/jgIFcbiAgICAgKiDmgLvorqLljZXmlbDjgIFcbiAgICAgKiDooYznqIvlkI3np7DjgIFcbiAgICAgKiDlt7Llj5HpgIHlgqzmrL7mrKHmlbBcbiAgICAgKi9cbiAgICBhcHAucm91dGVyKCdvcmRlci1pbmZvJywgYXN5bmMoIGN0eCwgbmV4dCApID0+IHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGNvbnN0IHsgdGlkIH0gPSBldmVudC5kYXRhO1xuXG4gICAgICAgICAgICAvKiog6KGM56iL6K+m5oOFICovXG4gICAgICAgICAgICBjb25zdCB0cmlwJCA9IGF3YWl0IGRiLmNvbGxlY3Rpb24oJ3RyaXAnKVxuICAgICAgICAgICAgICAgIC5kb2MoIHRpZCApXG4gICAgICAgICAgICAgICAgLmdldCggKTtcbiAgICAgICAgXG4gICAgICAgICAgICAvLyDojrflj5booYznqIvlupXkuIvmiYDmnInnmoTorqLljZVcbiAgICAgICAgICAgIGNvbnN0IG9yZGVycyQgPSBhd2FpdCBkYi5jb2xsZWN0aW9uKCdvcmRlcicpXG4gICAgICAgICAgICAgICAgLndoZXJlKHtcbiAgICAgICAgICAgICAgICAgICAgdGlkLFxuICAgICAgICAgICAgICAgICAgICBwYXlfc3RhdHVzOiBfLm5lcSgnMCcpXG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAuZ2V0KCApO1xuXG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIOaAu+WuouaIt+aVsOmHj1xuICAgICAgICAgICAgICogIeiHs+WwkeW3suS7mOiuoumHkVxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICBjb25zdCBjbGllbnRzID0gQXJyYXkuZnJvbShcbiAgICAgICAgICAgICAgICBuZXcgU2V0KCBvcmRlcnMkLmRhdGFcbiAgICAgICAgICAgICAgICAgICAgLmZpbHRlciggeCA9PiB4LnBheV9zdGF0dXMgIT09ICcwJyApXG4gICAgICAgICAgICAgICAgICAgIC5tYXAoIHggPT4geC5vcGVuaWQgKVxuICAgICAgICAgICAgKSkubGVuZ3RoO1xuXG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIOaAu+acquS6pOWwvuasvuWuouaIt+aVsOmHj1xuICAgICAgICAgICAgICovXG4gICAgICAgICAgICBjb25zdCBub3RQYXlBbGxDbGllbnRzID0gQXJyYXkuZnJvbShcbiAgICAgICAgICAgICAgICBuZXcgU2V0KCBvcmRlcnMkLmRhdGFcbiAgICAgICAgICAgICAgICAgICAgLmZpbHRlciggeCA9PiB4LnBheV9zdGF0dXMgPT09ICcxJyApXG4gICAgICAgICAgICAgICAgICAgIC5tYXAoIHggPT4geC5vcGVuaWQgKVxuICAgICAgICAgICAgKSkubGVuZ3RoO1xuXG4gICAgICAgICAgICAvLyDojrflj5booYznqIvnmoTotK3nianmuIXljZVcbiAgICAgICAgICAgIGNvbnN0IHNsJCA9IGF3YWl0IGRiLmNvbGxlY3Rpb24oJ3Nob3BwaW5nLWxpc3QnKVxuICAgICAgICAgICAgICAgIC53aGVyZSh7XG4gICAgICAgICAgICAgICAgICAgIHRpZFxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLmZpZWxkKHtcbiAgICAgICAgICAgICAgICAgICAgcGlkOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICBvaWRzOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICB1aWRzOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICBhZGp1c3RQcmljZTogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgYWRqdXN0R3JvdXBQcmljZTogdHJ1ZVxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLmdldCggKTtcbiAgICAgICAgICAgIGNvbnN0IHNsID0gc2wkLmRhdGE7XG5cbiAgICAgICAgICAgIC8vIOe7n+iuoeaUtuebilxuICAgICAgICAgICAgY29uc3Qgc2xPcmRlcnMkID0gYXdhaXQgUHJvbWlzZS5hbGwoXG4gICAgICAgICAgICAgICAgc2wubWFwKCBhc3luYyBzID0+IHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgeyBvaWRzIH0gPSBzO1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBvcmRlcnM6IGFueSA9IGF3YWl0IFByb21pc2UuYWxsKFxuICAgICAgICAgICAgICAgICAgICAgICAgb2lkcy5tYXAoIGFzeW5jIG8gPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IG9yZGVyJCA9IGF3YWl0IGRiLmNvbGxlY3Rpb24oJ29yZGVyJylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLmRvYyggU3RyaW5nKCBvICkpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5maWVsZCh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb3VudDogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFsbG9jYXRlZENvdW50OiB0cnVlXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5nZXQoICk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG9yZGVyJC5kYXRhO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC4uLnMsXG4gICAgICAgICAgICAgICAgICAgICAgICBvcmRlcnNcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICApO1xuICAgICAgICBcbiAgICAgICAgICAgIC8vIOe7n+iuoeaUtuebilxuICAgICAgICAgICAgY29uc3Qgc3VtID0gc2xPcmRlcnMkLnJlZHVjZSgoIHN1bSwgc2w6IGFueSApID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCB7IG9yZGVycywgdWlkcywgYWRqdXN0UHJpY2UsIGFkanVzdEdyb3VwUHJpY2UgfSA9IHNsO1xuICAgICAgICAgICAgICAgIGNvbnN0IHNsSW5vbWUgPSBvcmRlcnMucmVkdWNlKCggbGFzdCwgb3JkZXIgKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHsgYWxsb2NhdGVkQ291bnQsIGNvdW50IH0gPSBvcmRlcjtcbiAgICAgICAgICAgICAgICAgICAgbGV0IGNvdW50XyA9IGFsbG9jYXRlZENvdW50ICE9PSB1bmRlZmluZWQgPyBhbGxvY2F0ZWRDb3VudCA6IGNvdW50O1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gbGFzdCArICggdWlkcy5sZW5ndGggPiAxID8gKCBhZGp1c3RHcm91cFByaWNlID8gYWRqdXN0R3JvdXBQcmljZSA6IGFkanVzdFByaWNlICkgOiBhZGp1c3RQcmljZSApICogY291bnRfO1xuICAgICAgICAgICAgICAgIH0sIDAgKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gc2xJbm9tZSArIHN1bTtcbiAgICAgICAgICAgIH0sIDAgKTtcblxuICAgICAgICAgICAgcmV0dXJuIGN0eC5ib2R5ID0ge1xuICAgICAgICAgICAgICAgIHN0YXR1czogMjAwLFxuICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgc3VtLCAvLyDplIDllK7mgLvpop1cbiAgICAgICAgICAgICAgICAgICAgY2xpZW50cywgLy8g5a6i5oi35oC75pWwXG4gICAgICAgICAgICAgICAgICAgIG5vdFBheUFsbENsaWVudHMsIC8vIOacquS7mOWwvuasvuWuouaIt+aVsOmHj1xuICAgICAgICAgICAgICAgICAgICBjb3VudDogb3JkZXJzJC5kYXRhLmxlbmd0aCwgLy8g5oC76K6i5Y2V5pWwLFxuICAgICAgICAgICAgICAgICAgICB0aXRsZTogdHJpcCQuZGF0YS50aXRsZSwgLy8g6KGM56iL5ZCN56ewXG4gICAgICAgICAgICAgICAgICAgIGNhbGxNb25leVRpbWVzOiB0cmlwJC5kYXRhLmNhbGxNb25leVRpbWVzIC8vIOW3suWPkemAgeWCrOasvuasoeaVsFxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgfSBjYXRjaCAoIGUgKSB7IHJldHVybiBjdHguYm9keSA9IHsgc3RhdHVzOiA1MDAgfTt9XG4gICAgfSlcblxuICAgIC8qKlxuICAgICAqIEBAZGVzY3JpcHRpb25cbiAgICAgKiDmm7TmlrDooYznqIvlupXkuIvnmoTlv6vpgJLlm77lhoxcbiAgICAgKi9cbiAgICBhcHAucm91dGVyKCd1cGRhdGUtZGVsaXZlcicsIGFzeW5jKCBjdHgsIG5leHQgKSA9PiB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBjb25zdCB7IHRpZCwgaW1ncyB9ID0gZXZlbnQuZGF0YTtcbiAgICAgICAgICAgIGNvbnN0IHRhcmdldCA9IGF3YWl0IGRiLmNvbGxlY3Rpb24oJ2RlbGl2ZXInKVxuICAgICAgICAgICAgICAgIC53aGVyZSh7XG4gICAgICAgICAgICAgICAgICAgIHRpZCxcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogJ2RlbGl2ZXItaW1nJ1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLmdldCggKTtcblxuICAgICAgICAgICAgLy8g5Yib5bu6XG4gICAgICAgICAgICBpZiAoICF0YXJnZXQuZGF0YVsgMCBdKSB7XG4gICAgICAgICAgICAgICAgYXdhaXQgZGIuY29sbGVjdGlvbignZGVsaXZlcicpXG4gICAgICAgICAgICAgICAgICAgIC5hZGQoe1xuICAgICAgICAgICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRpZCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbWdzLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6ICdkZWxpdmVyLWltZydcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAvLyDmm7TmlrBcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgYXdhaXQgZGIuY29sbGVjdGlvbignZGVsaXZlcicpXG4gICAgICAgICAgICAgICAgICAgIC5kb2MoIFN0cmluZyggdGFyZ2V0LmRhdGFbIDAgXS5faWQpKVxuICAgICAgICAgICAgICAgICAgICAudXBkYXRlKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbWdzXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiBjdHguYm9keSA9IHsgc3RhdHVzOiAyMDAgfTtcbiAgICAgICAgICAgIFxuICAgICAgICB9IGNhdGNoICggZSApIHsgcmV0dXJuIGN0eC5ib2R5ID0geyBzdGF0dXM6IDUwMCB9fVxuICAgIH0pXG5cbiAgICAvKipcbiAgICAgKiBAQGRlc2NyaXB0aW9uXG4gICAgICog6I635Y+W6KGM56iL5bqV5LiL55qE5b+r6YCS5Zu+5YaMXG4gICAgICovXG4gICAgYXBwLnJvdXRlcignZGVsaXZlcicsIGFzeW5jKCBjdHgsIG5leHQgKSA9PiB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBjb25zdCB7IHRpZCB9ID0gZXZlbnQuZGF0YTtcbiAgICAgICAgICAgIGNvbnN0IHRhcmdldCA9IGF3YWl0IGRiLmNvbGxlY3Rpb24oJ2RlbGl2ZXInKVxuICAgICAgICAgICAgICAgIC53aGVyZSh7XG4gICAgICAgICAgICAgICAgICAgIHRpZCxcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogJ2RlbGl2ZXItaW1nJ1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLmdldCggKTtcblxuICAgICAgICAgICAgcmV0dXJuIGN0eC5ib2R5ID0geyBcbiAgICAgICAgICAgICAgICBzdGF0dXM6IDIwMCxcbiAgICAgICAgICAgICAgICBkYXRhOiB0YXJnZXQuZGF0YVsgMCBdID8gdGFyZ2V0LmRhdGFbIDAgXS5pbWdzIDogWyBdXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfSBjYXRjaCAoIGUgKSB7XG4gICAgICAgICAgICByZXR1cm4gY3R4LmJvZHkgPSB7IHN0YXR1czogNTAwIH07XG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgIC8qKlxuICAgICAqIEBkZXNjcmlwdGlvblxuICAgICAqIOaJi+WKqOWFs+mXreW9k+WJjeihjOeoi1xuICAgICAqIHtcbiAgICAgKiAgICB0aWRcbiAgICAgKiB9XG4gICAgICovXG4gICAgYXBwLnJvdXRlcignY2xvc2UnLCBhc3luYyggY3R4LCBuZXh0ICkgPT4ge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgY29uc3QgeyB0aWQgfSA9IGV2ZW50LmRhdGE7XG5cbiAgICAgICAgICAgIC8vIOabtOaWsOihjOeoi2Nsb3Nl5a2X5q61XG4gICAgICAgICAgICBhd2FpdCBkYi5jb2xsZWN0aW9uKCd0cmlwJylcbiAgICAgICAgICAgICAgICAuZG9jKCBTdHJpbmcoIHRpZCApKVxuICAgICAgICAgICAgICAgIC51cGRhdGUoe1xuICAgICAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpc0Nsb3NlZDogdHJ1ZVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIC8vIOaJi+WKqOWPlua2iOihjOeoi+aXtu+8jOaKiuW+heaUr+S7mOiuouWNleiuvuS4uuWPlua2iFxuICAgICAgICAgICAgY29uc3Qgb3JkZXJzJCA9IGF3YWl0IGRiLmNvbGxlY3Rpb24oJ29yZGVyJylcbiAgICAgICAgICAgICAgICAud2hlcmUoe1xuICAgICAgICAgICAgICAgICAgICB0aWQsXG4gICAgICAgICAgICAgICAgICAgIHBheV9zdGF0dXM6ICcwJyxcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIC5nZXQoICk7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGF3YWl0IFByb21pc2UuYWxsKCBvcmRlcnMkLmRhdGEubWFwKCBvcmRlciQgPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiBkYi5jb2xsZWN0aW9uKCdvcmRlcicpXG4gICAgICAgICAgICAgICAgICAgIC5kb2MoIFN0cmluZyggb3JkZXIkLl9pZCApKVxuICAgICAgICAgICAgICAgICAgICAudXBkYXRlKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBiYXNlX3N0YXR1czogJzUnXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICB9KSk7XG5cbiAgICAgICAgICAgIGNvbnN0IHRyaXAkID0gYXdhaXQgZGIuY29sbGVjdGlvbigndHJpcCcpXG4gICAgICAgICAgICAgICAgLmRvYyggdGlkIClcbiAgICAgICAgICAgICAgICAuZ2V0KCApO1xuXG4gICAgICAgICAgICAvLyDmjqjpgIHku6PotK3pgJrnn6VcbiAgICAgICAgICAgIGNvbnN0IG1lbWJlcnMgPSBhd2FpdCBkYi5jb2xsZWN0aW9uKCdtYW5hZ2VyLW1lbWJlcicpXG4gICAgICAgICAgICAgICAgLndoZXJlKHtcbiAgICAgICAgICAgICAgICAgICAgcHVzaDogdHJ1ZVxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLmdldCggKTtcbiAgICAgICAgXG4gICAgICAgICAgICBhd2FpdCBQcm9taXNlLmFsbChcbiAgICAgICAgICAgICAgICBtZW1iZXJzLmRhdGEubWFwKCBhc3luYyBtZW1iZXIgPT4ge1xuXG4gICAgICAgICAgICAgICAgICAgIC8vIDTjgIHosIPnlKjmjqjpgIFcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgcHVzaDEkID0gYXdhaXQgY2xvdWQuY2FsbEZ1bmN0aW9uKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6ICdjb21tb24nLFxuICAgICAgICAgICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICR1cmw6ICdwdXNoLXN1YnNjcmliZS1jbG91ZCcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvcGVuaWQ6IG1lbWJlci5vcGVuaWQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6ICdnZXRNb25leScsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhZ2U6IGBwYWdlcy9tYW5hZ2VyLXRyaXAtb3JkZXIvaW5kZXg/aWQ9JHt0aWR9JmFjPSR7MX1gLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZXh0czogW2Ake3RyaXAkLmRhdGEudGl0bGV9YCwgYOWFs+mXreaIkOWKn++8geS4gOmUruaUtuasvuWKn+iDveW3suW8gOWQr2BdXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgICAgICBjb25zdCBwdXNoMiQgPSBhd2FpdCBjbG91ZC5jYWxsRnVuY3Rpb24oe1xuICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogJ3RyaXAnLFxuICAgICAgICAgICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICR1cmw6ICdjbG9zZS10cmlwLWFuYWx5emUnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGlkXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICApO1xuXG4gICAgICAgICAgICByZXR1cm4gY3R4LmJvZHkgPSB7IHN0YXR1czogMjAwIH07XG5cbiAgICAgICAgfSBjYXRjaCAoIGUgKSB7XG4gICAgICAgICAgICByZXR1cm4gY3R4LmJvZHkgPSB7IHN0YXR1czogNTAwIH07XG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgIC8qKlxuICAgICAqIEBkZXNjcmlwdGlvblxuICAgICAqIOaJi+WKqC/oh6rliqjlhbPpl63ooYznqIvnmoTml7blgJnvvIzlj5HpgIHmlbTkuKrooYznqIvnmoTov5DokKXmlbDmja7nu5lhZG3jgIJcbiAgICAgKiDlkIzml7blj5HpgIHjgIznvqTmiqXjgI3nu5lhZG1cbiAgICAgKi9cbiAgICBhcHAucm91dGVyKCdjbG9zZS10cmlwLWFuYWx5emUnLCBhc3luYyggY3R4LCBuZXh0ICkgPT4ge1xuICAgICAgICB0cnkge1xuXG4gICAgICAgICAgICAvLyDmlLbnm4pcbiAgICAgICAgICAgIGxldCBpbmNvbWUgPSAwO1xuICAgICAgICAgICAgLy8g5oiQ5Yqf5LiL5Y2V55qE5ZWG5ZOBXG4gICAgICAgICAgICBsZXQgcGluR29vZHNOdW0gPSAwO1xuICAgICAgICAgICAgLy8g6KKr5p+l55yL55qE5ZWG5ZOBXG4gICAgICAgICAgICBsZXQgdmlzaXRHb29kc051bSA9IDA7XG4gICAgICAgICAgICAvLyDooYznqIvlpKnmlbBcbiAgICAgICAgICAgIGxldCBkYXlzTnVtID0gMDtcbiAgICAgICAgICAgIC8vIOa1j+iniOmHj1xuICAgICAgICAgICAgbGV0IHZpc2l0TnVtID0gMDtcbiAgICAgICAgICAgIC8vIOa1j+iniOS6uuaVsFxuICAgICAgICAgICAgbGV0IHZpc2l0b3JOdW0gPSAwO1xuICAgICAgICAgICAgLy8g5oiQ5Yqf5ou85Zui5Lq65pWwXG4gICAgICAgICAgICBsZXQgcGluTnVtID0gMDtcbiAgICBcbiAgICAgICAgICAgIGNvbnN0IHsgdGlkIH0gPSBldmVudC5kYXRhO1xuXG4gICAgICAgICAgICAvLyDojrflj5booYznqIvor6bmg4VcbiAgICAgICAgICAgIGNvbnN0IHRyaXAkID0gYXdhaXQgZGIuY29sbGVjdGlvbigndHJpcCcpXG4gICAgICAgICAgICAgICAgLmRvYyggU3RyaW5nKCB0aWQgKSlcbiAgICAgICAgICAgICAgICAuZmllbGQoe1xuICAgICAgICAgICAgICAgICAgICBlbmRfZGF0ZTogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgc3RhcnRfZGF0ZTogdHJ1ZVxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLmdldCggKVxuICAgICAgICAgICAgY29uc3QgdHJpcCA9IHRyaXAkLmRhdGE7XG5cbiAgICAgICAgICAgIC8vIOiOt+WPluihjOeoi+eahOa1j+iniOmHj1xuICAgICAgICAgICAgY29uc3QgdmlzaXRSZWNvcmRzJCA9IGF3YWl0IGRiLmNvbGxlY3Rpb24oJ2dvb2QtdmlzaXRpbmctcmVjb3JkJylcbiAgICAgICAgICAgICAgICAud2hlcmUoe1xuICAgICAgICAgICAgICAgICAgICB2aXNpdFRpbWU6IF8uZ3RlKCB0cmlwLnN0YXJ0X2RhdGUgKVxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLmdldCggKTtcbiAgICAgICAgICAgIGNvbnN0IHZpc2l0UmVjb3JkcyA9IHZpc2l0UmVjb3JkcyQuZGF0YTtcblxuICAgICAgICAgICAgLy8g6I635Y+W6KGM56iL55qE6LSt54mp5riF5Y2VXG4gICAgICAgICAgICBjb25zdCBzbCQgPSBhd2FpdCBkYi5jb2xsZWN0aW9uKCdzaG9wcGluZy1saXN0JylcbiAgICAgICAgICAgICAgICAud2hlcmUoe1xuICAgICAgICAgICAgICAgICAgICB0aWRcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIC5maWVsZCh7XG4gICAgICAgICAgICAgICAgICAgIHBpZDogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgb2lkczogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgdWlkczogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgYWRqdXN0UHJpY2U6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgIGFkanVzdEdyb3VwUHJpY2U6IHRydWVcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIC5nZXQoICk7XG4gICAgICAgICAgICBjb25zdCBzbCA9IHNsJC5kYXRhO1xuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgLy8g57uf6K6h5pS255uKXG4gICAgICAgICAgICBjb25zdCBzbE9yZGVycyQgPSBhd2FpdCBQcm9taXNlLmFsbChcbiAgICAgICAgICAgICAgICBzbC5tYXAoIGFzeW5jIHMgPT4ge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCB7IG9pZHMgfSA9IHM7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IG9yZGVyczogYW55ID0gYXdhaXQgUHJvbWlzZS5hbGwoXG4gICAgICAgICAgICAgICAgICAgICAgICBvaWRzLm1hcCggYXN5bmMgbyA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3Qgb3JkZXIkID0gYXdhaXQgZGIuY29sbGVjdGlvbignb3JkZXInKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAuZG9jKCBTdHJpbmcoIG8gKSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLmZpZWxkKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvdW50OiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYWxsb2NhdGVkQ291bnQ6IHRydWVcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLmdldCggKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gb3JkZXIkLmRhdGE7XG4gICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgLi4ucyxcbiAgICAgICAgICAgICAgICAgICAgICAgIG9yZGVyc1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICk7XG4gICAgICAgIFxuICAgICAgICAgICAgLy8g57uf6K6h5pS255uKXG4gICAgICAgICAgICBpbmNvbWUgPSBzbE9yZGVycyQucmVkdWNlKCggc3VtLCBzbDogYW55ICkgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IHsgb3JkZXJzLCB1aWRzLCBhZGp1c3RQcmljZSwgYWRqdXN0R3JvdXBQcmljZSB9ID0gc2w7XG4gICAgICAgICAgICAgICAgY29uc3Qgc2xJbm9tZSA9IG9yZGVycy5yZWR1Y2UoKCBsYXN0LCBvcmRlciApID0+IHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgeyBhbGxvY2F0ZWRDb3VudCwgY291bnQgfSA9IG9yZGVyO1xuICAgICAgICAgICAgICAgICAgICBsZXQgY291bnRfID0gYWxsb2NhdGVkQ291bnQgIT09IHVuZGVmaW5lZCA/IGFsbG9jYXRlZENvdW50IDogY291bnQ7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBsYXN0ICsgKCB1aWRzLmxlbmd0aCA+IDEgPyAoIGFkanVzdEdyb3VwUHJpY2UgPyBhZGp1c3RHcm91cFByaWNlIDogYWRqdXN0UHJpY2UgKSA6IGFkanVzdFByaWNlICkgKiBjb3VudF87XG4gICAgICAgICAgICAgICAgfSwgMCApO1xuICAgICAgICAgICAgICAgIHJldHVybiBzbElub21lICsgc3VtO1xuICAgICAgICAgICAgfSwgMCApO1xuXG4gICAgICAgICAgICAvLyDnu5/orqHmiJDlip/mi7zlm6JcbiAgICAgICAgICAgIGxldCBzbE9wZW5pZHM6IHN0cmluZ1sgXSA9IFsgXTtcbiAgICAgICAgICAgIHNsLm1hcCggcyA9PiB7XG4gICAgICAgICAgICAgICAgc2xPcGVuaWRzID0gWyAuLi5zbE9wZW5pZHMsIC4uLnMudWlkcyBdXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHBpbk51bSA9IEFycmF5LmZyb20oXG4gICAgICAgICAgICAgICAgbmV3IFNldCggc2xPcGVuaWRzIClcbiAgICAgICAgICAgICkubGVuZ3RoO1xuXG4gICAgICAgICAgICAvLyDnu5/orqHmiJDlip/kuIvljZXnmoTkuqflk4FcbiAgICAgICAgICAgIHBpbkdvb2RzTnVtID0gc2wubGVuZ3RoO1xuXG4gICAgICAgICAgICAvLyDnu5/orqHmn6XnnIvnmoTmlbDmja5cbiAgICAgICAgICAgIGxldCBnb29kSWRzOiBzdHJpbmdbIF0gPSBbIF07XG4gICAgICAgICAgICBsZXQgdmlzaXRPcGVuaWRzOiBzdHJpbmdbIF0gPSBbIF07XG5cbiAgICAgICAgICAgIHZpc2l0UmVjb3Jkcy5tYXAoIHYgPT4ge1xuICAgICAgICAgICAgICAgIGdvb2RJZHMgPSBbIC4uLmdvb2RJZHMsIHYucGlkIF1cbiAgICAgICAgICAgICAgICB2aXNpdE9wZW5pZHMgPSBbIC4uLnZpc2l0T3Blbmlkcywgdi5vcGVuaWQgXVxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHZpc2l0R29vZHNOdW0gPSBBcnJheS5mcm9tKFxuICAgICAgICAgICAgICAgIG5ldyBTZXQoIGdvb2RJZHMgKVxuICAgICAgICAgICAgKS5sZW5ndGg7XG5cbiAgICAgICAgICAgIHZpc2l0b3JOdW0gPSBBcnJheS5mcm9tKFxuICAgICAgICAgICAgICAgIG5ldyBTZXQoIHZpc2l0T3BlbmlkcyApXG4gICAgICAgICAgICApLmxlbmd0aDtcblxuICAgICAgICAgICAgLy8g5oyJ5Lq65Z2H5q+P5qy+5ZWG5ZOB6YO95omT5byAM+asoeiuoeeul1xuICAgICAgICAgICAgdmlzaXROdW0gPSB2aXNpdG9yTnVtICogdmlzaXRHb29kc051bSAqIDM7XG5cbiAgICAgICAgICAgIC8vIOe7n+iuoeWkqeaVsFxuICAgICAgICAgICAgZGF5c051bSA9IE1hdGguY2VpbCgoIHRyaXAuZW5kX2RhdGUgLSB0cmlwLnN0YXJ0X2RhdGUgKSAvICggMjQgKiA2MCAqIDYwICogMTAwMCkpXG5cbiAgICAgICAgICAgIGNvbnN0IHRleHQxID0gYCR7ZGF5c051bX3lpKnlhoXvvIxgO1xuICAgICAgICAgICAgY29uc3QgdGV4dDIgPSBgJHt2aXNpdEdvb2RzTnVtfeS7tuWVhuWTgeiiqyR7dmlzaXRvck51bX3kurrlm7Top4Ike3Zpc2l0TnVtfeasoWA7XG4gICAgICAgICAgICBjb25zdCB0ZXh0cyA9IFtcbiAgICAgICAgICAgICAgICBg5pS255uKJHtpbmNvbWV95YWD77yMJHtwaW5OdW195Lq65ou85ZuiJHtwaW5Hb29kc051bX3ku7bllYblk4FgLFxuICAgICAgICAgICAgICAgICh0ZXh0MSArIHRleHQyKS5sZW5ndGggPiAyMCA/IHRleHQyIDogdGV4dDEgKyB0ZXh0MlxuICAgICAgICAgICAgXTtcblxuICAgICAgICAgICAgLy8g6I635Y+W5omA5pyJ566h55CG5ZGYXG4gICAgICAgICAgICBjb25zdCBhZG1zJCA9IGF3YWl0IGRiLmNvbGxlY3Rpb24oJ21hbmFnZXItbWVtYmVyJylcbiAgICAgICAgICAgICAgICAud2hlcmUoeyB9KVxuICAgICAgICAgICAgICAgIC5nZXQoICk7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIC8vIOaOqOmAgVxuICAgICAgICAgICAgYXdhaXQgUHJvbWlzZS5hbGwoXG4gICAgICAgICAgICAgICAgYWRtcyQuZGF0YS5tYXAoIGFzeW5jIGFkbSA9PiB7XG5cbiAgICAgICAgICAgICAgICAgICAgLy8g6L+Q6JCl5pWw5o2uXG4gICAgICAgICAgICAgICAgICAgIGF3YWl0IGNsb3VkLmNhbGxGdW5jdGlvbih7XG4gICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiAnY29tbW9uJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkdXJsOiAncHVzaC1zdWJzY3JpYmUtY2xvdWQnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb3BlbmlkOiBhZG0ub3BlbmlkLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiAnd2FpdFBpbicsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhZ2U6IGBwYWdlcy9tYW5hZ2VyLXRyaXAtbGlzdC9pbmRleGAsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRleHRzXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgICAgICAvLyDnvqTmiqVcbiAgICAgICAgICAgICAgICAgICAgYXdhaXQgY2xvdWQuY2FsbEZ1bmN0aW9uKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6ICdjb21tb24nLFxuICAgICAgICAgICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICR1cmw6ICdwdXNoLXN1YnNjcmliZS1jbG91ZCcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvcGVuaWQ6IGFkbS5vcGVuaWQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6ICd0cmlwJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGFnZTogYHBhZ2VzL3RyaXAtcmV3YXJkL2luZGV4P3RpZD0ke3RpZH1gLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZXh0czogWyfnvqTmi7zlm6LmiqXlkYrlt7Llh7rvvIEnLCAn54K55Ye75bm25YiG5Lqr57uZ576k5Y+L5ZCn772eJ11cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgKTtcblxuICAgICAgICAgICAgcmV0dXJuIGN0eC5ib2R5ID0ge1xuICAgICAgICAgICAgICAgIHN0YXR1czogMjAwLFxuICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgdGV4dHMsXG4gICAgICAgICAgICAgICAgICAgIHBpbk51bSxcbiAgICAgICAgICAgICAgICAgICAgaW5jb21lLFxuICAgICAgICAgICAgICAgICAgICBwaW5Hb29kc051bSxcbiAgICAgICAgICAgICAgICAgICAgdmlzaXRvck51bSxcbiAgICAgICAgICAgICAgICAgICAgdmlzaXRHb29kc051bSxcbiAgICAgICAgICAgICAgICAgICAgdmlzaXROdW0sXG4gICAgICAgICAgICAgICAgICAgIGRheXNOdW0sXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgXG4gICAgICAgIH0gY2F0Y2ggKCBlICkge1xuICAgICAgICAgICAgY29uc29sZS5sb2coJz8/Pz8nLCBlIClcbiAgICAgICAgICAgIHJldHVybiBjdHguYm9keSA9IHtcbiAgICAgICAgICAgICAgICBzdGF0dXM6IDUwMCxcbiAgICAgICAgICAgICAgICBtZXNzYWdlOiBlXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgIHJldHVybiBhcHAuc2VydmUoICk7XG5cbn0iXX0=