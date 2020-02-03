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
        app.router('enter', function (ctx, next) { return __awaiter(void 0, void 0, void 0, function () {
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
        app.router('list', function (ctx, next) { return __awaiter(void 0, void 0, void 0, function () {
            var limit, search$, search, total$, trips$, more_1, inject, e_2;
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
                        return [4, Promise.all(trips$.data.map(function (trip) { return __awaiter(void 0, void 0, void 0, function () {
                                var sl$, sl, slOrders$, income, orders$, notPayAllClients;
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
                                            return [4, Promise.all(sl.map(function (s) { return __awaiter(void 0, void 0, void 0, function () {
                                                    var oids, orders;
                                                    return __generator(this, function (_a) {
                                                        switch (_a.label) {
                                                            case 0:
                                                                oids = s.oids;
                                                                return [4, Promise.all(oids.map(function (o) { return __awaiter(void 0, void 0, void 0, function () {
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
                                                                return [2, __assign(__assign({}, s), { orders: orders })];
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
                            return __assign(__assign({}, trip), more_1[key]);
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
        app.router('detail', function (ctx, next) { return __awaiter(void 0, void 0, void 0, function () {
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
        app.router('edit', function (ctx, next) { return __awaiter(void 0, void 0, void 0, function () {
            var lastTrip, start_date, _id, tid, _a, published, title_1, reduce_price, getErr, fixEndDate, end_date, count$, createData, create$, origin$, origin, isClosed, temp, time, members_1, users, e_4;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 12, , 13]);
                        lastTrip = null;
                        start_date = getNow(true);
                        _id = event.data._id;
                        tid = event.data._id;
                        _a = event.data, published = _a.published, title_1 = _a.title, reduce_price = _a.reduce_price;
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
                        createData = __assign(__assign({}, event.data), { end_date: end_date, start_date: getNow(true), warning: false, callMoneyTimes: 0 });
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
                        temp = Object.assign({}, origin, __assign(__assign({}, event.data), { isClosed: isClosed, type: 'custom', callMoneyTimes: end_date > origin['end_date'] ? 0 : origin['callMoneyTimes'] }));
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
                        time = new Date(start_date);
                        return [4, db.collection('manager-member')
                                .where({
                                push: true
                            })
                                .get()];
                    case 7:
                        members_1 = _b.sent();
                        return [4, Promise.all(members_1.data.map(function (member) { return __awaiter(void 0, void 0, void 0, function () {
                                var push$;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4, cloud.callFunction({
                                                name: 'common',
                                                data: {
                                                    $url: 'push-subscribe',
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
                                .map(function (user) { return __awaiter(void 0, void 0, void 0, function () {
                                var push$;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4, cloud.callFunction({
                                                name: 'common',
                                                data: {
                                                    $url: 'push-subscribe',
                                                    data: {
                                                        openid: user.openid,
                                                        type: 'trip',
                                                        page: 'pages/trip-enter/index',
                                                        texts: ["" + title_1, "\u5373\u5C06\u91C7\u8D2D\uFF01\u7528\u7FA4\u62FC\u56E2\u4E0B\u5355\u5427\uFF5E"]
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
        app.router('create-recommand', function (ctx, next) { return __awaiter(void 0, void 0, void 0, function () {
            var pid, trip$, trip, e_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        pid = event.data.pid;
                        return [4, db.collection('trip')
                                .where({
                                isClosed: false,
                                published: true,
                                end_date: _.gt(getNow(true))
                            })
                                .limit(1)
                                .orderBy('start_date', 'asc')
                                .get()];
                    case 1:
                        trip$ = _a.sent();
                        trip = trip$.data[0];
                        if (!trip) {
                            return [2, ctx.body = { status: 200 }];
                        }
                        if ((trip.selectedProductIds || []).includes(pid)) {
                            return [2, ctx.body = { status: 200 }];
                        }
                        return [4, db.collection('trip')
                                .doc(String(trip._id))
                                .update({
                                data: {
                                    selectedProductIds: _.unshift([pid])
                                }
                            })];
                    case 2:
                        _a.sent();
                        return [2, ctx.body = {
                                status: 200
                            }];
                    case 3:
                        e_5 = _a.sent();
                        return [2, ctx.body = {
                                status: 500
                            }];
                    case 4: return [2];
                }
            });
        }); });
        app.router('order-info', function (ctx, next) { return __awaiter(void 0, void 0, void 0, function () {
            var tid, trip$, orders$, clients, notPayAllClients, sl$, sl, slOrders$, sum, e_6;
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
                        return [4, Promise.all(sl.map(function (s) { return __awaiter(void 0, void 0, void 0, function () {
                                var oids, orders;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            oids = s.oids;
                                            return [4, Promise.all(oids.map(function (o) { return __awaiter(void 0, void 0, void 0, function () {
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
                                            return [2, __assign(__assign({}, s), { orders: orders })];
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
                                    callMoneyTimes: trip$.data.callMoneyTimes,
                                    isClosed: trip$.data.isClosed
                                }
                            }];
                    case 5:
                        e_6 = _a.sent();
                        return [2, ctx.body = { status: 500 }];
                    case 6: return [2];
                }
            });
        }); });
        app.router('update-deliver', function (ctx, next) { return __awaiter(void 0, void 0, void 0, function () {
            var _a, tid, imgs, target, e_7;
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
                        e_7 = _b.sent();
                        return [2, ctx.body = { status: 500 }];
                    case 7: return [2];
                }
            });
        }); });
        app.router('deliver', function (ctx, next) { return __awaiter(void 0, void 0, void 0, function () {
            var tid, target, e_8;
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
                        e_8 = _a.sent();
                        return [2, ctx.body = { status: 500 }];
                    case 3: return [2];
                }
            });
        }); });
        app.router('close', function (ctx, next) { return __awaiter(void 0, void 0, void 0, function () {
            var tid_1, orders$, trip$_1, members, e_9;
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
                        return [4, Promise.all(members.data.map(function (member) { return __awaiter(void 0, void 0, void 0, function () {
                                var push1$, push2$;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4, cloud.callFunction({
                                                name: 'common',
                                                data: {
                                                    $url: 'push-subscribe',
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
                        e_9 = _a.sent();
                        return [2, ctx.body = { status: 500 }];
                    case 8: return [2];
                }
            });
        }); });
        app.router('close-trip-analyze', function (ctx, next) { return __awaiter(void 0, void 0, void 0, function () {
            var income, pinGoodsNum, visitGoodsNum, daysNum, visitNum, visitorNum, pinNum, tid_2, trip$, trip, visitRecords$, visitRecords, sl$, sl, slOrders$, slOpenids_1, goodIds_1, visitOpenids_1, text1, text2, texts_1, adms$, e_10;
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
                        return [4, Promise.all(sl.map(function (s) { return __awaiter(void 0, void 0, void 0, function () {
                                var oids, orders;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            oids = s.oids;
                                            return [4, Promise.all(oids.map(function (o) { return __awaiter(void 0, void 0, void 0, function () {
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
                                            return [2, __assign(__assign({}, s), { orders: orders })];
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
                            slOpenids_1 = __spreadArrays(slOpenids_1, s.uids);
                        });
                        pinNum = Array.from(new Set(slOpenids_1)).length;
                        pinGoodsNum = sl.length;
                        goodIds_1 = [];
                        visitOpenids_1 = [];
                        visitRecords.map(function (v) {
                            goodIds_1 = __spreadArrays(goodIds_1, [v.pid]);
                            visitOpenids_1 = __spreadArrays(visitOpenids_1, [v.openid]);
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
                        return [4, Promise.all(adms$.data.map(function (adm) { return __awaiter(void 0, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4, cloud.callFunction({
                                                name: 'common',
                                                data: {
                                                    $url: 'push-subscribe',
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
                                                        $url: 'push-subscribe',
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
                        e_10 = _a.sent();
                        console.log('????', e_10);
                        return [2, ctx.body = {
                                status: 500,
                                message: e_10
                            }];
                    case 8: return [2];
                }
            });
        }); });
        return [2, app.serve()];
    });
}); };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLHFDQUF1QztBQUN2QyxzQ0FBd0M7QUFFeEMsS0FBSyxDQUFDLElBQUksQ0FBQztJQUNQLEdBQUcsRUFBRSxPQUFPLENBQUMsR0FBRyxDQUFDLEtBQUs7Q0FDekIsQ0FBQyxDQUFDO0FBRUgsSUFBTSxFQUFFLEdBQWdCLEtBQUssQ0FBQyxRQUFRLEVBQUcsQ0FBQztBQUMxQyxJQUFNLENBQUMsR0FBRyxFQUFFLENBQUMsT0FBTyxDQUFDO0FBUXJCLElBQU0sTUFBTSxHQUFHLFVBQUUsRUFBVTtJQUFWLG1CQUFBLEVBQUEsVUFBVTtJQUN2QixJQUFLLEVBQUUsRUFBRztRQUNOLE9BQU8sSUFBSSxDQUFDLEdBQUcsRUFBRyxDQUFDO0tBQ3RCO0lBQ0QsSUFBTSxNQUFNLEdBQUcsSUFBSSxJQUFJLENBQUUsSUFBSSxJQUFJLEVBQUcsQ0FBQyxjQUFjLEVBQUcsQ0FBQyxDQUFDO0lBQ3hELE9BQU8sSUFBSSxJQUFJLENBQUUsTUFBTSxDQUFDLE9BQU8sRUFBRyxHQUFHLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLElBQUksQ0FBRSxDQUFBO0FBQzdELENBQUMsQ0FBQTtBQTJCWSxRQUFBLElBQUksR0FBRyxVQUFRLEtBQUssRUFBRSxPQUFPOzs7UUFFaEMsR0FBRyxHQUFHLElBQUksU0FBUyxDQUFDLEVBQUUsS0FBSyxPQUFBLEVBQUUsQ0FBQyxDQUFDO1FBUXJDLEdBQUcsQ0FBQyxNQUFNLENBQUMsT0FBTyxFQUFFLFVBQU8sR0FBRyxFQUFFLElBQUk7Ozs7Ozt3QkFFdEIsY0FBYyxHQUFHLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQyxTQUFT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O3dEQUN0QixJQUFJLEVBQUU7NERBQ0YsTUFBTSxFQUFFLEdBQUcsQ0FBQyxNQUFNOzREQUNsQixJQUFJLEVBQUUsTUFBTTs0REFDWixJQUFJLEVBQUUsaUNBQStCLEtBQUs7NERBQzFDLEtBQUssRUFBRSxDQUFDLFVBQVUsRUFBRSxZQUFZLENBQUM7eURBQ3BDO3FEQUNKO2lEQUNKLENBQUMsRUFBQTs7NENBWEYsU0FXRSxDQUFDOzRDQUVILFdBQU07OztpQ0FDVCxDQUFDLENBQ0wsRUFBQTs7d0JBakNELFNBaUNDLENBQUM7d0JBRUYsV0FBTyxHQUFHLENBQUMsSUFBSSxHQUFHO2dDQUNkLE1BQU0sRUFBRSxHQUFHO2dDQUNYLElBQUksRUFBRTtvQ0FDRixLQUFLLFNBQUE7b0NBQ0wsTUFBTSxRQUFBO29DQUNOLE1BQU0sUUFBQTtvQ0FDTixXQUFXLGFBQUE7b0NBQ1gsVUFBVSxZQUFBO29DQUNWLGFBQWEsZUFBQTtvQ0FDYixRQUFRLFVBQUE7b0NBQ1IsT0FBTyxTQUFBO2lDQUNWOzZCQUNKLEVBQUE7Ozt3QkFHRCxPQUFPLENBQUMsR0FBRyxDQUFDLE1BQU0sRUFBRSxJQUFDLENBQUUsQ0FBQTt3QkFDdkIsV0FBTyxHQUFHLENBQUMsSUFBSSxHQUFHO2dDQUNkLE1BQU0sRUFBRSxHQUFHO2dDQUNYLE9BQU8sRUFBRSxJQUFDOzZCQUNiLEVBQUE7Ozs7YUFFUixDQUFDLENBQUM7UUFFSCxXQUFPLEdBQUcsQ0FBQyxLQUFLLEVBQUcsRUFBQzs7S0FFdkIsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIGNsb3VkIGZyb20gJ3d4LXNlcnZlci1zZGsnO1xuaW1wb3J0ICogYXMgVGNiUm91dGVyIGZyb20gJ3RjYi1yb3V0ZXInO1xuXG5jbG91ZC5pbml0KHtcbiAgICBlbnY6IHByb2Nlc3MuZW52LmNsb3VkXG59KTtcblxuY29uc3QgZGI6IERCLkRhdGFiYXNlID0gY2xvdWQuZGF0YWJhc2UoICk7XG5jb25zdCBfID0gZGIuY29tbWFuZDtcblxuLyoqIFxuICog6L2s5o2i5qC85p6X5bC85rK75pe25Yy6ICs45pe25Yy6XG4gKiBEYXRlKCkubm93KCkgLyBuZXcgRGF0ZSgpLmdldFRpbWUoKSDmmK/ml7bkuI3ml7bmraPluLjnmoQrOFxuICogRGF0ZS50b0xvY2FsU3RyaW5nKCApIOWlveWDj+aYr+S4gOebtOaYrysw55qEXG4gKiDlhYjmi7/liLAgKzDvvIznhLblkI4rOFxuICovXG5jb25zdCBnZXROb3cgPSAoIHRzID0gZmFsc2UgKTogYW55ID0+IHtcbiAgICBpZiAoIHRzICkge1xuICAgICAgICByZXR1cm4gRGF0ZS5ub3coICk7XG4gICAgfVxuICAgIGNvbnN0IHRpbWVfMCA9IG5ldyBEYXRlKCBuZXcgRGF0ZSggKS50b0xvY2FsZVN0cmluZyggKSk7XG4gICAgcmV0dXJuIG5ldyBEYXRlKCB0aW1lXzAuZ2V0VGltZSggKSArIDggKiA2MCAqIDYwICogMTAwMCApXG59XG5cbi8qKlxuICpcbiAqIEBkZXNjcmlwdGlvbiDooYznqIvmqKHlnZdcbiAqIC0tLS0tLS0tIOWtl+autSAtLS0tLS0tLS0tXG4gICAgICAgIHRpdGxlIOagh+mimCBzdHJpbmdcbiAgICAgICAgd2FybmluZzog5piv5ZCm5Y+R6YCB6L+H5pyf6K2m5ZGK57uZYWRtLFxuICAgICAgICBzdGFydF9kYXRlIOW8gOWni+aXtumXtCBudW1iZXJcbiAgICAgICAgZW5kX2RhdGUg57uT5p2f5pe26Ze0IG51bWJlclxuICAgICAgICByZWR1Y2VfcHJpY2Ug6KGM56iL56uL5YePIG51bWJlclxuICAgICAgICBzYWxlc192b2x1bWUg6ZSA5ZSu5oC76aKdXG4gICAgICAgIGZ1bGxyZWR1Y2VfYXRsZWFzdCDooYznqIvmu6Hlh48gLSDpl6jmp5sgbnVtYmVyXG4gICAgICAgIGZ1bGxyZWR1Y2VfdmFsdWVzIOihjOeoi+a7oeWHjyAtIOWHj+WkmuWwkSBudW1iZXJcbiAgICAgICAgY2FzaGNvdXBvbl9hdGxlYXN0IOihjOeoi+S7o+mHkeWIuCAtIOmXqOanmyBudW1iZXJcbiAgICAgICAgY2FzaGNvdXBvbl92YWx1ZXMg6KGM56iL5Luj6YeR5Yi4IC0g6YeR6aKdIG51bWJlclxuKiEgICAgICBwb3N0YWdlIOmCrui0ueexu+WeiyBkaWMgXG4qISAgICAgIHBvc3RhZ2VmcmVlX2F0bGVhc3QgIOWFjemCrumXqOanmyBudW1iZXJcbiAgICAgICAgcGF5bWVudCDku5jmrL7nsbvlnosgZGljIFxuICAgICAgICBwdWJsaXNoZWQg5piv5ZCm5Y+R5biDIGJvb2xlYW5cbiAgICAgICAgY3JlYXRlVGltZSDliJvlu7rml7bpl7RcbiAgICAgICAgdXBkYXRlVGltZSDmm7TmlrDml7bpl7RcbiAgICAgICAgaXNDbG9zZWQ6IOaYr+WQpuW3sue7j+aJi+WKqOWFs+mXrVxuICAgICAgICBjYWxsTW9uZXlUaW1lczog5Y+R6LW35YKs5qy+5qyh5pWwXG4gICAgICAgIHNlbGVjdGVkUHJvZHVjdElkczog5o6o6I2Q5ZWG5ZOBXG4qISAgICAgIHR5cGU6IOexu+Wei++8jHN5c++8iOezu+e7n+iHquWKqOWPkei1t++8ieOAgXVuZGVmaW5lZO+8iOaJi+WKqOWIm+W7uu+8iVxuICovXG5leHBvcnQgY29uc3QgbWFpbiA9IGFzeW5jICggZXZlbnQsIGNvbnRleHQgKSA9PiB7XG5cbiAgICBjb25zdCBhcHAgPSBuZXcgVGNiUm91dGVyKHsgZXZlbnQgfSk7XG5cbiAgICAvKipcbiAgICAgKiAtLS0tLS0g6K+35rGCIC0tLS0tLS0tXG4gICAgICoge1xuICAgICAqICAgIHNob3VsZEdldEdvb2RzOiDpu5jorqR0cnVl77yM5Y+v5Lul5LiN5aGr77yM6I635Y+W6KGM56iL5o6o6I2Q5ZWG5ZOBXG4gICAgICogfVxuICAgICAqL1xuICAgIGFwcC5yb3V0ZXIoJ2VudGVyJywgYXN5bmMoIGN0eCwgbmV4dCApID0+IHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGNvbnN0IHNob3VsZEdldEdvb2RzID0gZXZlbnQuZGF0YSA/IGV2ZW50LmRhdGEuc2hvdWxkR2V0R29vZHMgOiB1bmRlZmluZWQ7XG5cbiAgICAgICAgICAgIC8vIOaMieW8gOWni+aXpeacn+ato+W6j++8jOiOt+WPluacgOWkmjLmnaEg5bey5Y+R5biD44CB5pyq57uT5p2f55qE6KGM56iLXG4gICAgICAgICAgICBjb25zdCBkYXRhJCA9IGF3YWl0IGRiLmNvbGxlY3Rpb24oJ3RyaXAnKVxuICAgICAgICAgICAgICAgIC53aGVyZSh7XG4gICAgICAgICAgICAgICAgICAgIGlzQ2xvc2VkOiBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgcHVibGlzaGVkOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICBlbmRfZGF0ZTogXy5ndCggZ2V0Tm93KCB0cnVlICkpXG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAubGltaXQoIDIgKVxuICAgICAgICAgICAgICAgIC5vcmRlckJ5KCdzdGFydF9kYXRlJywgJ2FzYycpXG4gICAgICAgICAgICAgICAgLmdldCggKTtcblxuICAgICAgICAgICAgbGV0IHRyaXBzID0gZGF0YSQuZGF0YTtcblxuICAgICAgICAgICAgLy8g5ouJ5Y+W5pyA5paw6KGM56iL55qE5o6o6I2Q5ZWG5ZOBXG4gICAgICAgICAgICBpZiAoKCAhIXRyaXBzWyAwIF0gJiYgc2hvdWxkR2V0R29vZHMgPT09IHVuZGVmaW5lZCApIHx8IHNob3VsZEdldEdvb2RzID09PSB0cnVlICkge1xuICAgICAgICAgICAgICAgIGNvbnN0IHRyaXBPbmVQcm9kdWN0cyQgPSBhd2FpdCBQcm9taXNlLmFsbCggdHJpcHNbIDAgXS5zZWxlY3RlZFByb2R1Y3RJZHMubWFwKCBwaWQgPT4ge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gY2xvdWQuY2FsbEZ1bmN0aW9uKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIF9pZDogcGlkLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJHVybDogJ2RldGFpbCdcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiAnZ29vZCdcbiAgICAgICAgICAgICAgICAgICAgfSkudGhlbiggcmVzID0+IHJlcy5yZXN1bHQuZGF0YSApO1xuICAgICAgICAgICAgICAgIH0pKTtcbiAgICAgICAgICAgICAgICB0cmlwc1sgMCBdID0gT2JqZWN0LmFzc2lnbih7IH0sIHRyaXBzWyAwIF0sIHtcbiAgICAgICAgICAgICAgICAgICAgcHJvZHVjdHM6IHRyaXBPbmVQcm9kdWN0cyRcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIGN0eC5ib2R5ID0ge1xuICAgICAgICAgICAgICAgIHN0YXR1czogMjAwLFxuICAgICAgICAgICAgICAgIGRhdGE6IHRyaXBzXG4gICAgICAgICAgICB9O1xuXG4gICAgICAgIH0gY2F0Y2ggKCBlICkge1xuICAgICAgICAgICAgcmV0dXJuIGN0eC5ib2R5ID0ge1xuICAgICAgICAgICAgICAgIHN0YXR1czogNTAwLFxuICAgICAgICAgICAgICAgIG1lc3NhZ2U6IGVcbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgIGFwcC5yb3V0ZXIoJ2xpc3QnLCBhc3luYyggY3R4LCBuZXh0ICkgPT4ge1xuICAgICAgICB0cnkge1xuXG4gICAgICAgICAgICAvLyDmn6Xor6LmnaHmlbBcbiAgICAgICAgICAgIGNvbnN0IGxpbWl0ID0gMjA7XG4gICAgICAgICAgICBjb25zdCBzZWFyY2gkID0gZXZlbnQuZGF0YS50aXRsZSB8fCAnJztcbiAgICAgICAgICAgIGNvbnN0IHNlYXJjaCA9IG5ldyBSZWdFeHAoIHNlYXJjaCQucmVwbGFjZSgvXFxzKy9nLCBcIlwiKSwgJ2knKTtcblxuICAgICAgICAgICAgLy8g6I635Y+W5oC75pWwXG4gICAgICAgICAgICBjb25zdCB0b3RhbCQgPSBhd2FpdCBkYi5jb2xsZWN0aW9uKCd0cmlwJylcbiAgICAgICAgICAgICAgICAud2hlcmUoe1xuICAgICAgICAgICAgICAgICAgICB0aXRsZTogc2VhcmNoXG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAuY291bnQoICk7XG5cbiAgICAgICAgICAgIC8vIOiOt+WPluaVsOaNrlxuICAgICAgICAgICAgY29uc3QgdHJpcHMkID0gYXdhaXQgZGIuY29sbGVjdGlvbigndHJpcCcpXG4gICAgICAgICAgICAgICAgLndoZXJlKHtcbiAgICAgICAgICAgICAgICAgICAgdGl0bGU6IHNlYXJjaFxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLmxpbWl0KCBsaW1pdCApXG4gICAgICAgICAgICAgICAgLnNraXAoKCBldmVudC5kYXRhLnBhZ2UgLSAxICkgKiBsaW1pdCApXG4gICAgICAgICAgICAgICAgLm9yZGVyQnkoJ3VwZGF0ZVRpbWUnLCAnZGVzYycpXG4gICAgICAgICAgICAgICAgLmdldCggKTtcblxuICAgICAgICAgICAgY29uc3QgbW9yZSA9IGF3YWl0IFByb21pc2UuYWxsKFxuICAgICAgICAgICAgICAgIHRyaXBzJC5kYXRhLm1hcCggYXN5bmMgdHJpcCA9PiB7XG5cbiAgICAgICAgICAgICAgICAgICAgLy8g6I635Y+W6KGM56iL55qE6LSt54mp5riF5Y2VXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHNsJCA9IGF3YWl0IGRiLmNvbGxlY3Rpb24oJ3Nob3BwaW5nLWxpc3QnKVxuICAgICAgICAgICAgICAgICAgICAgICAgLndoZXJlKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aWQ6IHRyaXAuX2lkXG4gICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAgICAgLmZpZWxkKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwaWQ6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb2lkczogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB1aWRzOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFkanVzdFByaWNlOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFkanVzdEdyb3VwUHJpY2U6IHRydWVcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgICAgICAuZ2V0KCApO1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBzbCA9IHNsJC5kYXRhO1xuXG4gICAgICAgICAgICAgICAgICAgIC8vIOe7n+iuoeaUtuebilxuICAgICAgICAgICAgICAgICAgICBjb25zdCBzbE9yZGVycyQgPSBhd2FpdCBQcm9taXNlLmFsbChcbiAgICAgICAgICAgICAgICAgICAgICAgIHNsLm1hcCggYXN5bmMgcyA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgeyBvaWRzIH0gPSBzO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IG9yZGVyczogYW55ID0gYXdhaXQgUHJvbWlzZS5hbGwoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9pZHMubWFwKCBhc3luYyBvID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IG9yZGVyJCA9IGF3YWl0IGRiLmNvbGxlY3Rpb24oJ29yZGVyJylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAuZG9jKCBTdHJpbmcoIG8gKSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAuZmllbGQoe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb3VudDogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYWxsb2NhdGVkQ291bnQ6IHRydWVcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5nZXQoICk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gb3JkZXIkLmRhdGE7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAuLi5zLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvcmRlcnNcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICApO1xuXG4gICAgICAgICAgICAgICAgICAgIC8vIOe7n+iuoeaUtuebilxuICAgICAgICAgICAgICAgICAgICBjb25zdCBpbmNvbWUgPSBzbE9yZGVycyQucmVkdWNlKCggc3VtLCBzbDogYW55ICkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgeyBvcmRlcnMsIHVpZHMsIGFkanVzdFByaWNlLCBhZGp1c3RHcm91cFByaWNlIH0gPSBzbDtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHNsSW5vbWUgPSBvcmRlcnMucmVkdWNlKCggbGFzdCwgb3JkZXIgKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgeyBhbGxvY2F0ZWRDb3VudCwgY291bnQgfSA9IG9yZGVyO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCBjb3VudF8gPSBhbGxvY2F0ZWRDb3VudCAhPT0gdW5kZWZpbmVkID8gYWxsb2NhdGVkQ291bnQgOiBjb3VudDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gbGFzdCArICggdWlkcy5sZW5ndGggPiAxID8gKCBhZGp1c3RHcm91cFByaWNlID8gYWRqdXN0R3JvdXBQcmljZSA6IGFkanVzdFByaWNlICkgOiBhZGp1c3RQcmljZSApICogY291bnRfO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSwgMCApO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHNsSW5vbWUgKyBzdW07XG4gICAgICAgICAgICAgICAgICAgIH0sIDAgKTtcblxuICAgICAgICAgICAgICAgICAgICBjb25zdCBvcmRlcnMkID0gYXdhaXQgZGIuY29sbGVjdGlvbignb3JkZXInKVxuICAgICAgICAgICAgICAgICAgICAgICAgLndoZXJlKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aWQ6IHRyaXAuX2lkLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBheV9zdGF0dXM6IF8uZXEoJzEnKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBiYXNlX3N0YXR1czogXy5vciggXy5lcSgnMCcpLF8uZXEoJzEnKSwgXy5lcSgnMicpLCBfLmVxKCczJykpXG4gICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAgICAgLmZpZWxkKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvcGVuaWQ6IHRydWVcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgICAgICAuZ2V0KCApO1xuXG4gICAgICAgICAgICAgICAgICAgIC8vIOacquS7mOasvuS5sOWutlxuICAgICAgICAgICAgICAgICAgICBjb25zdCBub3RQYXlBbGxDbGllbnRzID0gQXJyYXkuZnJvbShcbiAgICAgICAgICAgICAgICAgICAgICAgIG5ldyBTZXQoIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9yZGVycyQuZGF0YVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAubWFwKCB4ID0+IHgub3BlbmlkIClcbiAgICAgICAgICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgICAgICAgKS5sZW5ndGg7XG5cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG5vdFBheUFsbENsaWVudHMsXG4gICAgICAgICAgICAgICAgICAgICAgICBzYWxlc192b2x1bWU6IGluY29tZVxuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgKTtcblxuICAgICAgICAgICAgY29uc3QgaW5qZWN0ID0gdHJpcHMkLmRhdGEubWFwKCggdHJpcCwga2V5ICkgPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgICAgIC4uLnRyaXAsXG4gICAgICAgICAgICAgICAgICAgIC4uLm1vcmVbIGtleSBdXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgcmV0dXJuIGN0eC5ib2R5ID0ge1xuICAgICAgICAgICAgICAgIHN0YXR1czogMjAwLFxuICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgc2VhcmNoOiBldmVudC5kYXRhLnRpdGxlLnJlcGxhY2UoL1xccysvZywgJycpLFxuICAgICAgICAgICAgICAgICAgICBwYWdlU2l6ZTogbGltaXQsXG4gICAgICAgICAgICAgICAgICAgIHBhZ2U6IGV2ZW50LmRhdGEucGFnZSxcbiAgICAgICAgICAgICAgICAgICAgZGF0YTogaW5qZWN0LFxuICAgICAgICAgICAgICAgICAgICB0b3RhbDogdG90YWwkLnRvdGFsLFxuICAgICAgICAgICAgICAgICAgICB0b3RhbFBhZ2U6IE1hdGguY2VpbCggdG90YWwkLnRvdGFsIC8gbGltaXQgKVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgfSBjYXRjaCAoIGUgKSB7XG4gICAgICAgICAgICByZXR1cm4gY3R4LmJvZHkgPSB7XG4gICAgICAgICAgICAgICAgc3RhdHVzOiA1MDAsXG4gICAgICAgICAgICAgICAgbWVzc2FnZTogZVxuICAgICAgICAgICAgfTtcbiAgICAgICAgfSBcbiAgICB9KTtcbiAgICBcbiAgICAvKipcbiAgICAgKiBAZGVzY3JpcHRpb25cbiAgICAgKiDooYznqIvor6bmg4VcbiAgICAgKiB7XG4gICAgICogICAgICBtb3JlRGV0YWlsOiB1bmRlZmluZWQgfCBmYWxzZSB8IHRydWVcbiAgICAgKiB9XG4gICAgICovXG4gICAgYXBwLnJvdXRlcignZGV0YWlsJywgYXN5bmMoIGN0eCwgbmV4dCApID0+IHtcbiAgICAgICAgdHJ5IHtcblxuICAgICAgICAgICAgY29uc3QgeyBtb3JlRGV0YWlsIH0gPSBldmVudC5kYXRhO1xuICAgICAgICAgICAgY29uc3QgdGlkID0gZXZlbnQuZGF0YS5faWQgfHwgZXZlbnQuZGF0YS50aWQ7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIC8vIOiOt+WPluWfuuacrOivpuaDhVxuICAgICAgICAgICAgY29uc3QgZGF0YSQgPSBhd2FpdCBkYi5jb2xsZWN0aW9uKCd0cmlwJylcbiAgICAgICAgICAgICAgICAuZG9jKCB0aWQgKVxuICAgICAgICAgICAgICAgIC5nZXQoICk7XG4gICAgICAgICAgICBjb25zdCBtZXRhID0gZGF0YSQuZGF0YTtcblxuICAgICAgICAgICAgaWYgKCBtb3JlRGV0YWlsICE9PSBmYWxzZSApIHtcbiAgICAgICAgICAgICAgICAvLyDpgJrov4flt7LpgInnmoTllYblk4FpZHMs5ou/5Yiw5a+55bqU55qE5Zu+54mH44CBdGl0bGXjgIFfaWRcbiAgICAgICAgICAgICAgICBjb25zdCBwcm9kdWN0cyQ6IGFueSA9IGF3YWl0IFByb21pc2UuYWxsKCBtZXRhLnNlbGVjdGVkUHJvZHVjdElkcy5tYXAoIHBpZCA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBkYi5jb2xsZWN0aW9uKCdnb29kcycpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLndoZXJlKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgX2lkOiBwaWRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5maWVsZCh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGltZzogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGl0bGU6IHRydWVcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5nZXQoICk7XG4gICAgICAgICAgICAgICAgfSkpO1xuXG4gICAgICAgICAgICAgICAgbWV0YS5zZWxlY3RlZFByb2R1Y3RzID0gcHJvZHVjdHMkLm1hcCggeCA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB4LmRhdGFbIDAgXTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgbWV0YS5zZWxlY3RlZFByb2R1Y3RzID0gWyBdO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgXG4gICAgICAgICAgICBjb25zdCBjYW5FZGl0JCA9IGF3YWl0IGRiLmNvbGxlY3Rpb24oJ2NvdXBvbicpXG4gICAgICAgICAgICAgICAgLndoZXJlKHtcbiAgICAgICAgICAgICAgICAgICAgdGlkXG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAuY291bnQoICk7XG5cbiAgICAgICAgICAgIC8vIG1ldGEuY2FuRWRpdENvdXBvbnMgPSBjYW5FZGl0JC50b3RhbCA9PT0gMDtcbiAgICAgICAgICAgIC8vIOi/meS4queJiOacrOWPquaciSDnq4vlh49cbiAgICAgICAgICAgIG1ldGEuY2FuRWRpdENvdXBvbnMgPSB0cnVlO1xuXG4gICAgICAgICAgICByZXR1cm4gY3R4LmJvZHkgPSB7XG4gICAgICAgICAgICAgICAgc3RhdHVzOiAyMDAsXG4gICAgICAgICAgICAgICAgZGF0YTogbWV0YVxuICAgICAgICAgICAgfTtcblxuICAgICAgICB9IGNhdGNoKCBlICkge1xuICAgICAgICAgICAgcmV0dXJuIGN0eC5ib2R5ID0ge1xuICAgICAgICAgICAgICAgIHN0YXR1czogNTAwLFxuICAgICAgICAgICAgICAgIG1lc3NhZ2U6IGVcbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgIC8qKlxuICAgICAqIEBkZXNjcmlwdGlvblxuICAgICAqIOWIm+W7uiAvIOe8lui+keW9k+WJjeihjOeoi1xuICAgICAqL1xuICAgIGFwcC5yb3V0ZXIoJ2VkaXQnLCBhc3luYyggY3R4LCBuZXh0ICkgPT4ge1xuICAgICAgICB0cnkge1xuXG4gICAgICAgICAgICBsZXQgbGFzdFRyaXA6IGFueSA9IG51bGw7XG4gICAgICAgICAgICBsZXQgc3RhcnRfZGF0ZSA9IGdldE5vdyggdHJ1ZSApO1xuICAgICAgICAgICAgbGV0IF9pZCA9IGV2ZW50LmRhdGEuX2lkO1xuICAgICAgICAgICAgY29uc3QgdGlkID0gZXZlbnQuZGF0YS5faWQ7XG4gICAgICAgICAgICBjb25zdCB7IHB1Ymxpc2hlZCwgdGl0bGUsIHJlZHVjZV9wcmljZSB9ID0gZXZlbnQuZGF0YTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgY29uc3QgZ2V0RXJyID0gbWVzc2FnZSA9PiB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGN0eC5ib2R5ID0ge1xuICAgICAgICAgICAgICAgICAgICBzdGF0dXM6IDUwMCxcbiAgICAgICAgICAgICAgICAgICAgbWVzc2FnZVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIC8vIOihjOeoi+m7mOiupOWcqOW9k+WkqeaZmuS4ijIz54K557uT5p2fXG4gICAgICAgICAgICBjb25zdCBmaXhFbmREYXRlID0gZW5kRGF0ZSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3QgdCA9IG5ldyBEYXRlKCBlbmREYXRlICk7XG4gICAgICAgICAgICAgICAgY29uc3QgeSA9IHQuZ2V0RnVsbFllYXIoICk7XG4gICAgICAgICAgICAgICAgY29uc3QgbSA9IHQuZ2V0TW9udGgoICkgKyAxO1xuICAgICAgICAgICAgICAgIGNvbnN0IGQgPSB0LmdldERhdGUoICk7XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gbmV3IERhdGUoYCR7eX0vJHttfS8ke2R9IDIzOjAwOjAwYCkuZ2V0VGltZSggKTtcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIGNvbnN0IGVuZF9kYXRlID0gZml4RW5kRGF0ZSggTnVtYmVyKCBldmVudC5kYXRhLmVuZF9kYXRlICkpO1xuXG4gICAgICAgICAgICAvLyBpZiAoIHJlZHVjZV9wcmljZSA8IDEgKSB7XG4gICAgICAgICAgICAvLyAgICAgcmV0dXJuIGdldEVycign56uL5YeP6YeR6aKd5LiN6IO95bCR5LqOMeWFgycpXG4gICAgICAgICAgICAvLyB9XG5cbiAgICAgICAgICAgIC8vIOWIm+W7uuihjOeoi1xuICAgICAgICAgICAgaWYgKCAhX2lkICkge1xuXG4gICAgICAgICAgICAgICAgY29uc3QgY291bnQkID0gYXdhaXQgZGIuY29sbGVjdGlvbigndHJpcCcpXG4gICAgICAgICAgICAgICAgICAgIC53aGVyZSh7XG4gICAgICAgICAgICAgICAgICAgICAgICBpc0Nsb3NlZDogZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgICAgICBwdWJsaXNoZWQ6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgIC5jb3VudCggKTtcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICBpZiAoIGNvdW50JC50b3RhbCApIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGdldEVycign5pyJ5pyq57uT5p2f6KGM56iLLOivt+e7k+adn+ihjOeoi+WQjuWGjeWIm+W7uicpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGNvbnN0IGNyZWF0ZURhdGEgPSB7XG4gICAgICAgICAgICAgICAgICAgIC4uLmV2ZW50LmRhdGEsXG4gICAgICAgICAgICAgICAgICAgIGVuZF9kYXRlLFxuICAgICAgICAgICAgICAgICAgICBzdGFydF9kYXRlOiBnZXROb3coIHRydWUgKSxcbiAgICAgICAgICAgICAgICAgICAgd2FybmluZzogZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgIGNhbGxNb25leVRpbWVzOiAwXG4gICAgICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgICAgIGNvbnN0IGNyZWF0ZSQgPSBhd2FpdCBkYi5jb2xsZWN0aW9uKCd0cmlwJylcbiAgICAgICAgICAgICAgICAgICAgLmFkZCh7XG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRhOiBjcmVhdGVEYXRhXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIF9pZCA9IGNyZWF0ZSQuX2lkO1xuICAgICAgICAgICAgLy8g57yW6L6R6KGM56iL44CB6KaG55uWc3lzVHJpcFxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICBcbiAgICAgICAgICAgICAgICBjb25zdCBvcmlnaW4kID0gYXdhaXQgZGIuY29sbGVjdGlvbigndHJpcCcpXG4gICAgICAgICAgICAgICAgICAgIC53aGVyZSh7XG4gICAgICAgICAgICAgICAgICAgICAgICBfaWRcbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgLmdldCggKTtcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICBjb25zdCBvcmlnaW4gPSBvcmlnaW4kLmRhdGFbIDAgXTtcbiAgICAgICAgICAgICAgICBjb25zdCBpc0Nsb3NlZCA9IGdldE5vdyggdHJ1ZSApID49IE51bWJlciggZW5kX2RhdGUgKTtcbiAgICBcbiAgICAgICAgICAgICAgICBkZWxldGUgb3JpZ2luWydfaWQnXTtcbiAgICAgICAgICAgICAgICBkZWxldGUgZXZlbnQuZGF0YVsnX2lkJ107XG4gICAgICAgICAgICAgICAgZGVsZXRlIGV2ZW50LmRhdGFbJ2NyZWF0ZVRpbWUnXTtcbiAgICAgICAgICAgICAgICBkZWxldGUgZXZlbnQuZGF0YVsnc2FsZXNfdm9sdW1lJ11cbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICBjb25zdCB0ZW1wID0gT2JqZWN0LmFzc2lnbih7IH0sIG9yaWdpbiwge1xuICAgICAgICAgICAgICAgICAgICAuLi5ldmVudC5kYXRhLFxuICAgICAgICAgICAgICAgICAgICBpc0Nsb3NlZCxcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogJ2N1c3RvbScsXG4gICAgICAgICAgICAgICAgICAgIGNhbGxNb25leVRpbWVzOiBlbmRfZGF0ZSA+IG9yaWdpblsnZW5kX2RhdGUnXSA/IDAgOiBvcmlnaW5bJ2NhbGxNb25leVRpbWVzJ11cbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgIGF3YWl0IGRiLmNvbGxlY3Rpb24oJ3RyaXAnKVxuICAgICAgICAgICAgICAgICAgICAuZG9jKCBfaWQgKVxuICAgICAgICAgICAgICAgICAgICAuc2V0KHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRhdGE6IHRlbXBcbiAgICAgICAgICAgICAgICAgICAgfSk7ICAgXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICog5o6o6YCBXG4gICAgICAgICAgICAgKiDliJvlu7rml7blgJnnmoTmjqjpgIFcbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgaWYgKCggIXRpZCAmJiBwdWJsaXNoZWQgKSkge1xuXG4gICAgICAgICAgICAgICAgY29uc3QgdGltZSA9IG5ldyBEYXRlKCBzdGFydF9kYXRlICk7XG5cbiAgICAgICAgICAgICAgICAvLyDmjqjpgIHku6PotK3pgJrnn6VcbiAgICAgICAgICAgICAgICBjb25zdCBtZW1iZXJzID0gYXdhaXQgZGIuY29sbGVjdGlvbignbWFuYWdlci1tZW1iZXInKVxuICAgICAgICAgICAgICAgICAgICAud2hlcmUoe1xuICAgICAgICAgICAgICAgICAgICAgICAgcHVzaDogdHJ1ZVxuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAuZ2V0KCApO1xuXG4gICAgICAgICAgICAgICAgYXdhaXQgUHJvbWlzZS5hbGwoXG4gICAgICAgICAgICAgICAgICAgIG1lbWJlcnMuZGF0YS5tYXAoIGFzeW5jIG1lbWJlciA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyA044CB6LCD55So5o6o6YCBXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBwdXNoJCA9IGF3YWl0IGNsb3VkLmNhbGxGdW5jdGlvbih7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogJ2NvbW1vbicsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAkdXJsOiAncHVzaC1zdWJzY3JpYmUnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvcGVuaWQ6IG1lbWJlci5vcGVuaWQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiAndHJpcCcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYWdlOiAncGFnZXMvbWFuYWdlci10cmlwLWxpc3QvaW5kZXgnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGV4dHM6IFtgJHt0aXRsZX1gLCBg5Luj6LSt6KGM56iL5o6o6YCB5Yiw5a6i5oi377yM5LiU5byA6YCa5LqG6K6i5Y2V5o6o6YCBYF1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICk7XG5cbiAgICAgICAgICAgICAgICAvLyDmjqjpgIHlrqLmiLfpgJrnn6VcbiAgICAgICAgICAgICAgICBjb25zdCB1c2VycyA9IGF3YWl0IGRiLmNvbGxlY3Rpb24oJ3VzZXInKVxuICAgICAgICAgICAgICAgICAgICAud2hlcmUoe1xuXG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgIC5nZXQoICk7XG5cbiAgICAgICAgICAgICAgICBhd2FpdCBQcm9taXNlLmFsbChcbiAgICAgICAgICAgICAgICAgICAgdXNlcnMuZGF0YVxuICAgICAgICAgICAgICAgICAgICAgICAgLmZpbHRlciggdXNlciA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuICFtZW1iZXJzLmRhdGEuZmluZCggbWVtYmVyID0+IG1lbWJlci5vcGVuaWQgPT09IHVzZXIub3BlbmlkIClcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgICAgICAubWFwKCBhc3luYyB1c2VyID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyA044CB6LCD55So5o6o6YCBXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgcHVzaCQgPSBhd2FpdCBjbG91ZC5jYWxsRnVuY3Rpb24oe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiAnY29tbW9uJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJHVybDogJ3B1c2gtc3Vic2NyaWJlJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvcGVuaWQ6IHVzZXIub3BlbmlkLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6ICd0cmlwJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYWdlOiAncGFnZXMvdHJpcC1lbnRlci9pbmRleCcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGV4dHM6IFtgJHt0aXRsZX1gLCBg5Y2z5bCG6YeH6LSt77yB55So576k5ou85Zui5LiL5Y2V5ZCn772eYF1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICApO1xuXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiBjdHguYm9keSA9IHtcbiAgICAgICAgICAgICAgICBkYXRhOiBfaWQsXG4gICAgICAgICAgICAgICAgc3RhdHVzOiAyMDBcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgXG4gICAgICAgIH0gY2F0Y2goIGUgKSB7XG4gICAgICAgICAgICByZXR1cm4gY3R4LmJvZHkgPSB7XG4gICAgICAgICAgICAgICAgc3RhdHVzOiA1MDAsXG4gICAgICAgICAgICAgICAgbWVzc2FnZTogZVxuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgLyoqXG4gICAgICogQGRlc2NyaXB0aW9uXG4gICAgICog57uZ5pyA5paw6KGM56iL5o+S5YWl5o6o6I2Q5ZWG5ZOBXG4gICAgICoge1xuICAgICAqICAgIHBpZFxuICAgICAqIH1cbiAgICAgKi9cbiAgICBhcHAucm91dGVyKCdjcmVhdGUtcmVjb21tYW5kJywgYXN5bmMoIGN0eCwgbmV4dCApID0+IHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGxldCB7IHBpZCB9ID0gZXZlbnQuZGF0YTtcblxuICAgICAgICAgICAgY29uc3QgdHJpcCQgPSBhd2FpdCBkYi5jb2xsZWN0aW9uKCd0cmlwJylcbiAgICAgICAgICAgICAgICAud2hlcmUoe1xuICAgICAgICAgICAgICAgICAgICBpc0Nsb3NlZDogZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgIHB1Ymxpc2hlZDogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgZW5kX2RhdGU6IF8uZ3QoIGdldE5vdyggdHJ1ZSApKVxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLmxpbWl0KCAxIClcbiAgICAgICAgICAgICAgICAub3JkZXJCeSgnc3RhcnRfZGF0ZScsICdhc2MnKVxuICAgICAgICAgICAgICAgIC5nZXQoICk7XG4gICAgICAgICAgICBjb25zdCB0cmlwID0gdHJpcCQuZGF0YVsgMCBdO1xuXG4gICAgICAgICAgICBpZiAoICF0cmlwICkgeyByZXR1cm4gY3R4LmJvZHkgPSB7IHN0YXR1czogMjAwIH07fVxuICAgICAgICAgICAgaWYgKCggdHJpcC5zZWxlY3RlZFByb2R1Y3RJZHMgfHwgWyBdKS5pbmNsdWRlcyggcGlkICkpIHsgcmV0dXJuIGN0eC5ib2R5ID0geyBzdGF0dXM6IDIwMCB9O31cblxuICAgICAgICAgICAgYXdhaXQgZGIuY29sbGVjdGlvbigndHJpcCcpXG4gICAgICAgICAgICAgICAgLmRvYyggU3RyaW5nKCB0cmlwLl9pZCApKVxuICAgICAgICAgICAgICAgIC51cGRhdGUoe1xuICAgICAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzZWxlY3RlZFByb2R1Y3RJZHM6IF8udW5zaGlmdChbIHBpZCBdKVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIHJldHVybiBjdHguYm9keSA9IHtcbiAgICAgICAgICAgICAgICBzdGF0dXM6IDIwMFxuICAgICAgICAgICAgfVxuXG4gICAgICAgIH0gY2F0Y2ggKCBlICkge1xuICAgICAgICAgICAgcmV0dXJuIGN0eC5ib2R5ID0ge1xuICAgICAgICAgICAgICAgIHN0YXR1czogNTAwXG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgfSlcblxuICAgIC8qKiBcbiAgICAgKiBAZGVzY3JpcHRpb25cbiAgICAgKiDojrflj5booYznqIvlupXkuIvnmoTln7rmnKzkuJrliqHmlbDmja5cbiAgICAgKiDplIDllK7mgLvpop3jgIFcbiAgICAgKiDlrqLmiLfmgLvmlbDjgIFcbiAgICAgKiDmnKrku5jlsL7mrL7lrqLmiLfmlbDph4/jgIFcbiAgICAgKiDmgLvorqLljZXmlbDjgIFcbiAgICAgKiDooYznqIvlkI3np7DjgIFcbiAgICAgKiDlt7Llj5HpgIHlgqzmrL7mrKHmlbBcbiAgICAgKi9cbiAgICBhcHAucm91dGVyKCdvcmRlci1pbmZvJywgYXN5bmMoIGN0eCwgbmV4dCApID0+IHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGNvbnN0IHsgdGlkIH0gPSBldmVudC5kYXRhO1xuXG4gICAgICAgICAgICAvKiog6KGM56iL6K+m5oOFICovXG4gICAgICAgICAgICBjb25zdCB0cmlwJCA9IGF3YWl0IGRiLmNvbGxlY3Rpb24oJ3RyaXAnKVxuICAgICAgICAgICAgICAgIC5kb2MoIHRpZCApXG4gICAgICAgICAgICAgICAgLmdldCggKTtcbiAgICAgICAgXG4gICAgICAgICAgICAvLyDojrflj5booYznqIvlupXkuIvmiYDmnInnmoTorqLljZVcbiAgICAgICAgICAgIGNvbnN0IG9yZGVycyQgPSBhd2FpdCBkYi5jb2xsZWN0aW9uKCdvcmRlcicpXG4gICAgICAgICAgICAgICAgLndoZXJlKHtcbiAgICAgICAgICAgICAgICAgICAgdGlkLFxuICAgICAgICAgICAgICAgICAgICBwYXlfc3RhdHVzOiBfLm5lcSgnMCcpXG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAuZ2V0KCApO1xuXG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIOaAu+WuouaIt+aVsOmHj1xuICAgICAgICAgICAgICogIeiHs+WwkeW3suS7mOiuoumHkVxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICBjb25zdCBjbGllbnRzID0gQXJyYXkuZnJvbShcbiAgICAgICAgICAgICAgICBuZXcgU2V0KCBvcmRlcnMkLmRhdGFcbiAgICAgICAgICAgICAgICAgICAgLmZpbHRlciggeCA9PiB4LnBheV9zdGF0dXMgIT09ICcwJyApXG4gICAgICAgICAgICAgICAgICAgIC5tYXAoIHggPT4geC5vcGVuaWQgKVxuICAgICAgICAgICAgKSkubGVuZ3RoO1xuXG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIOaAu+acquS6pOWwvuasvuWuouaIt+aVsOmHj1xuICAgICAgICAgICAgICovXG4gICAgICAgICAgICBjb25zdCBub3RQYXlBbGxDbGllbnRzID0gQXJyYXkuZnJvbShcbiAgICAgICAgICAgICAgICBuZXcgU2V0KCBvcmRlcnMkLmRhdGFcbiAgICAgICAgICAgICAgICAgICAgLmZpbHRlciggeCA9PiB4LnBheV9zdGF0dXMgPT09ICcxJyApXG4gICAgICAgICAgICAgICAgICAgIC5tYXAoIHggPT4geC5vcGVuaWQgKVxuICAgICAgICAgICAgKSkubGVuZ3RoO1xuXG4gICAgICAgICAgICAvLyDojrflj5booYznqIvnmoTotK3nianmuIXljZVcbiAgICAgICAgICAgIGNvbnN0IHNsJCA9IGF3YWl0IGRiLmNvbGxlY3Rpb24oJ3Nob3BwaW5nLWxpc3QnKVxuICAgICAgICAgICAgICAgIC53aGVyZSh7XG4gICAgICAgICAgICAgICAgICAgIHRpZFxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLmZpZWxkKHtcbiAgICAgICAgICAgICAgICAgICAgcGlkOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICBvaWRzOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICB1aWRzOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICBhZGp1c3RQcmljZTogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgYWRqdXN0R3JvdXBQcmljZTogdHJ1ZVxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLmdldCggKTtcbiAgICAgICAgICAgIGNvbnN0IHNsID0gc2wkLmRhdGE7XG5cbiAgICAgICAgICAgIC8vIOe7n+iuoeaUtuebilxuICAgICAgICAgICAgY29uc3Qgc2xPcmRlcnMkID0gYXdhaXQgUHJvbWlzZS5hbGwoXG4gICAgICAgICAgICAgICAgc2wubWFwKCBhc3luYyBzID0+IHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgeyBvaWRzIH0gPSBzO1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBvcmRlcnM6IGFueSA9IGF3YWl0IFByb21pc2UuYWxsKFxuICAgICAgICAgICAgICAgICAgICAgICAgb2lkcy5tYXAoIGFzeW5jIG8gPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IG9yZGVyJCA9IGF3YWl0IGRiLmNvbGxlY3Rpb24oJ29yZGVyJylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLmRvYyggU3RyaW5nKCBvICkpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5maWVsZCh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb3VudDogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFsbG9jYXRlZENvdW50OiB0cnVlXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5nZXQoICk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG9yZGVyJC5kYXRhO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC4uLnMsXG4gICAgICAgICAgICAgICAgICAgICAgICBvcmRlcnNcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICApO1xuICAgICAgICBcbiAgICAgICAgICAgIC8vIOe7n+iuoeaUtuebilxuICAgICAgICAgICAgY29uc3Qgc3VtID0gc2xPcmRlcnMkLnJlZHVjZSgoIHN1bSwgc2w6IGFueSApID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCB7IG9yZGVycywgdWlkcywgYWRqdXN0UHJpY2UsIGFkanVzdEdyb3VwUHJpY2UgfSA9IHNsO1xuICAgICAgICAgICAgICAgIGNvbnN0IHNsSW5vbWUgPSBvcmRlcnMucmVkdWNlKCggbGFzdCwgb3JkZXIgKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHsgYWxsb2NhdGVkQ291bnQsIGNvdW50IH0gPSBvcmRlcjtcbiAgICAgICAgICAgICAgICAgICAgbGV0IGNvdW50XyA9IGFsbG9jYXRlZENvdW50ICE9PSB1bmRlZmluZWQgPyBhbGxvY2F0ZWRDb3VudCA6IGNvdW50O1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gbGFzdCArICggdWlkcy5sZW5ndGggPiAxID8gKCBhZGp1c3RHcm91cFByaWNlID8gYWRqdXN0R3JvdXBQcmljZSA6IGFkanVzdFByaWNlICkgOiBhZGp1c3RQcmljZSApICogY291bnRfO1xuICAgICAgICAgICAgICAgIH0sIDAgKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gc2xJbm9tZSArIHN1bTtcbiAgICAgICAgICAgIH0sIDAgKTtcblxuICAgICAgICAgICAgcmV0dXJuIGN0eC5ib2R5ID0ge1xuICAgICAgICAgICAgICAgIHN0YXR1czogMjAwLFxuICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgc3VtLCAvLyDplIDllK7mgLvpop1cbiAgICAgICAgICAgICAgICAgICAgY2xpZW50cywgLy8g5a6i5oi35oC75pWwXG4gICAgICAgICAgICAgICAgICAgIG5vdFBheUFsbENsaWVudHMsIC8vIOacquS7mOWwvuasvuWuouaIt+aVsOmHj1xuICAgICAgICAgICAgICAgICAgICBjb3VudDogb3JkZXJzJC5kYXRhLmxlbmd0aCwgLy8g5oC76K6i5Y2V5pWwLFxuICAgICAgICAgICAgICAgICAgICB0aXRsZTogdHJpcCQuZGF0YS50aXRsZSwgLy8g6KGM56iL5ZCN56ewXG4gICAgICAgICAgICAgICAgICAgIGNhbGxNb25leVRpbWVzOiB0cmlwJC5kYXRhLmNhbGxNb25leVRpbWVzLCAvLyDlt7Llj5HpgIHlgqzmrL7mrKHmlbBcbiAgICAgICAgICAgICAgICAgICAgaXNDbG9zZWQ6IHRyaXAkLmRhdGEuaXNDbG9zZWQgLy8g5piv5ZCm5bey57uP57uT5p2f6KGM56iLXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfTtcblxuICAgICAgICB9IGNhdGNoICggZSApIHsgcmV0dXJuIGN0eC5ib2R5ID0geyBzdGF0dXM6IDUwMCB9O31cbiAgICB9KVxuXG4gICAgLyoqXG4gICAgICogQEBkZXNjcmlwdGlvblxuICAgICAqIOabtOaWsOihjOeoi+W6leS4i+eahOW/q+mAkuWbvuWGjFxuICAgICAqL1xuICAgIGFwcC5yb3V0ZXIoJ3VwZGF0ZS1kZWxpdmVyJywgYXN5bmMoIGN0eCwgbmV4dCApID0+IHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGNvbnN0IHsgdGlkLCBpbWdzIH0gPSBldmVudC5kYXRhO1xuICAgICAgICAgICAgY29uc3QgdGFyZ2V0ID0gYXdhaXQgZGIuY29sbGVjdGlvbignZGVsaXZlcicpXG4gICAgICAgICAgICAgICAgLndoZXJlKHtcbiAgICAgICAgICAgICAgICAgICAgdGlkLFxuICAgICAgICAgICAgICAgICAgICB0eXBlOiAnZGVsaXZlci1pbWcnXG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAuZ2V0KCApO1xuXG4gICAgICAgICAgICAvLyDliJvlu7pcbiAgICAgICAgICAgIGlmICggIXRhcmdldC5kYXRhWyAwIF0pIHtcbiAgICAgICAgICAgICAgICBhd2FpdCBkYi5jb2xsZWN0aW9uKCdkZWxpdmVyJylcbiAgICAgICAgICAgICAgICAgICAgLmFkZCh7XG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGlkLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGltZ3MsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogJ2RlbGl2ZXItaW1nJ1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIC8vIOabtOaWsFxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBhd2FpdCBkYi5jb2xsZWN0aW9uKCdkZWxpdmVyJylcbiAgICAgICAgICAgICAgICAgICAgLmRvYyggU3RyaW5nKCB0YXJnZXQuZGF0YVsgMCBdLl9pZCkpXG4gICAgICAgICAgICAgICAgICAgIC51cGRhdGUoe1xuICAgICAgICAgICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGltZ3NcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIGN0eC5ib2R5ID0geyBzdGF0dXM6IDIwMCB9O1xuICAgICAgICAgICAgXG4gICAgICAgIH0gY2F0Y2ggKCBlICkgeyByZXR1cm4gY3R4LmJvZHkgPSB7IHN0YXR1czogNTAwIH19XG4gICAgfSlcblxuICAgIC8qKlxuICAgICAqIEBAZGVzY3JpcHRpb25cbiAgICAgKiDojrflj5booYznqIvlupXkuIvnmoTlv6vpgJLlm77lhoxcbiAgICAgKi9cbiAgICBhcHAucm91dGVyKCdkZWxpdmVyJywgYXN5bmMoIGN0eCwgbmV4dCApID0+IHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGNvbnN0IHsgdGlkIH0gPSBldmVudC5kYXRhO1xuICAgICAgICAgICAgY29uc3QgdGFyZ2V0ID0gYXdhaXQgZGIuY29sbGVjdGlvbignZGVsaXZlcicpXG4gICAgICAgICAgICAgICAgLndoZXJlKHtcbiAgICAgICAgICAgICAgICAgICAgdGlkLFxuICAgICAgICAgICAgICAgICAgICB0eXBlOiAnZGVsaXZlci1pbWcnXG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAuZ2V0KCApO1xuXG4gICAgICAgICAgICByZXR1cm4gY3R4LmJvZHkgPSB7IFxuICAgICAgICAgICAgICAgIHN0YXR1czogMjAwLFxuICAgICAgICAgICAgICAgIGRhdGE6IHRhcmdldC5kYXRhWyAwIF0gPyB0YXJnZXQuZGF0YVsgMCBdLmltZ3MgOiBbIF1cbiAgICAgICAgICAgIH1cblxuICAgICAgICB9IGNhdGNoICggZSApIHtcbiAgICAgICAgICAgIHJldHVybiBjdHguYm9keSA9IHsgc3RhdHVzOiA1MDAgfTtcbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgLyoqXG4gICAgICogQGRlc2NyaXB0aW9uXG4gICAgICog5omL5Yqo5YWz6Zet5b2T5YmN6KGM56iLXG4gICAgICoge1xuICAgICAqICAgIHRpZFxuICAgICAqIH1cbiAgICAgKi9cbiAgICBhcHAucm91dGVyKCdjbG9zZScsIGFzeW5jKCBjdHgsIG5leHQgKSA9PiB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBjb25zdCB7IHRpZCB9ID0gZXZlbnQuZGF0YTtcblxuICAgICAgICAgICAgLy8g5pu05paw6KGM56iLY2xvc2XlrZfmrrVcbiAgICAgICAgICAgIGF3YWl0IGRiLmNvbGxlY3Rpb24oJ3RyaXAnKVxuICAgICAgICAgICAgICAgIC5kb2MoIFN0cmluZyggdGlkICkpXG4gICAgICAgICAgICAgICAgLnVwZGF0ZSh7XG4gICAgICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlzQ2xvc2VkOiB0cnVlXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgLy8g5omL5Yqo5Y+W5raI6KGM56iL5pe277yM5oqK5b6F5pSv5LuY6K6i5Y2V6K6+5Li65Y+W5raIXG4gICAgICAgICAgICBjb25zdCBvcmRlcnMkID0gYXdhaXQgZGIuY29sbGVjdGlvbignb3JkZXInKVxuICAgICAgICAgICAgICAgIC53aGVyZSh7XG4gICAgICAgICAgICAgICAgICAgIHRpZCxcbiAgICAgICAgICAgICAgICAgICAgcGF5X3N0YXR1czogJzAnLFxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLmdldCggKTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgYXdhaXQgUHJvbWlzZS5hbGwoIG9yZGVycyQuZGF0YS5tYXAoIG9yZGVyJCA9PiB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGRiLmNvbGxlY3Rpb24oJ29yZGVyJylcbiAgICAgICAgICAgICAgICAgICAgLmRvYyggU3RyaW5nKCBvcmRlciQuX2lkICkpXG4gICAgICAgICAgICAgICAgICAgIC51cGRhdGUoe1xuICAgICAgICAgICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJhc2Vfc3RhdHVzOiAnNSdcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIH0pKTtcblxuICAgICAgICAgICAgY29uc3QgdHJpcCQgPSBhd2FpdCBkYi5jb2xsZWN0aW9uKCd0cmlwJylcbiAgICAgICAgICAgICAgICAuZG9jKCB0aWQgKVxuICAgICAgICAgICAgICAgIC5nZXQoICk7XG5cbiAgICAgICAgICAgIC8vIOaOqOmAgeS7o+i0remAmuefpVxuICAgICAgICAgICAgY29uc3QgbWVtYmVycyA9IGF3YWl0IGRiLmNvbGxlY3Rpb24oJ21hbmFnZXItbWVtYmVyJylcbiAgICAgICAgICAgICAgICAud2hlcmUoe1xuICAgICAgICAgICAgICAgICAgICBwdXNoOiB0cnVlXG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAuZ2V0KCApO1xuICAgICAgICBcbiAgICAgICAgICAgIGF3YWl0IFByb21pc2UuYWxsKFxuICAgICAgICAgICAgICAgIG1lbWJlcnMuZGF0YS5tYXAoIGFzeW5jIG1lbWJlciA9PiB7XG5cbiAgICAgICAgICAgICAgICAgICAgLy8gNOOAgeiwg+eUqOaOqOmAgVxuICAgICAgICAgICAgICAgICAgICBjb25zdCBwdXNoMSQgPSBhd2FpdCBjbG91ZC5jYWxsRnVuY3Rpb24oe1xuICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogJ2NvbW1vbicsXG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJHVybDogJ3B1c2gtc3Vic2NyaWJlJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9wZW5pZDogbWVtYmVyLm9wZW5pZCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogJ2dldE1vbmV5JyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGFnZTogYHBhZ2VzL21hbmFnZXItdHJpcC1vcmRlci9pbmRleD9pZD0ke3RpZH0mYWM9JHsxfWAsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRleHRzOiBbYCR7dHJpcCQuZGF0YS50aXRsZX1gLCBg5YWz6Zet5oiQ5Yqf77yB5LiA6ZSu5pS25qy+5Yqf6IO95bey5byA5ZCvYF1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHB1c2gyJCA9IGF3YWl0IGNsb3VkLmNhbGxGdW5jdGlvbih7XG4gICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiAndHJpcCcsXG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJHVybDogJ2Nsb3NlLXRyaXAtYW5hbHl6ZScsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aWRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICk7XG5cbiAgICAgICAgICAgIHJldHVybiBjdHguYm9keSA9IHsgc3RhdHVzOiAyMDAgfTtcblxuICAgICAgICB9IGNhdGNoICggZSApIHtcbiAgICAgICAgICAgIHJldHVybiBjdHguYm9keSA9IHsgc3RhdHVzOiA1MDAgfTtcbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgLyoqXG4gICAgICogQGRlc2NyaXB0aW9uXG4gICAgICog5omL5YqoL+iHquWKqOWFs+mXreihjOeoi+eahOaXtuWAme+8jOWPkemAgeaVtOS4quihjOeoi+eahOi/kOiQpeaVsOaNrue7mWFkbeOAglxuICAgICAqIOWQjOaXtuWPkemAgeOAjOe+pOaKpeOAjee7mWFkbVxuICAgICAqL1xuICAgIGFwcC5yb3V0ZXIoJ2Nsb3NlLXRyaXAtYW5hbHl6ZScsIGFzeW5jKCBjdHgsIG5leHQgKSA9PiB7XG4gICAgICAgIHRyeSB7XG5cbiAgICAgICAgICAgIC8vIOaUtuebilxuICAgICAgICAgICAgbGV0IGluY29tZSA9IDA7XG4gICAgICAgICAgICAvLyDmiJDlip/kuIvljZXnmoTllYblk4FcbiAgICAgICAgICAgIGxldCBwaW5Hb29kc051bSA9IDA7XG4gICAgICAgICAgICAvLyDooqvmn6XnnIvnmoTllYblk4FcbiAgICAgICAgICAgIGxldCB2aXNpdEdvb2RzTnVtID0gMDtcbiAgICAgICAgICAgIC8vIOihjOeoi+WkqeaVsFxuICAgICAgICAgICAgbGV0IGRheXNOdW0gPSAwO1xuICAgICAgICAgICAgLy8g5rWP6KeI6YePXG4gICAgICAgICAgICBsZXQgdmlzaXROdW0gPSAwO1xuICAgICAgICAgICAgLy8g5rWP6KeI5Lq65pWwXG4gICAgICAgICAgICBsZXQgdmlzaXRvck51bSA9IDA7XG4gICAgICAgICAgICAvLyDmiJDlip/mi7zlm6LkurrmlbBcbiAgICAgICAgICAgIGxldCBwaW5OdW0gPSAwO1xuICAgIFxuICAgICAgICAgICAgY29uc3QgeyB0aWQgfSA9IGV2ZW50LmRhdGE7XG5cbiAgICAgICAgICAgIC8vIOiOt+WPluihjOeoi+ivpuaDhVxuICAgICAgICAgICAgY29uc3QgdHJpcCQgPSBhd2FpdCBkYi5jb2xsZWN0aW9uKCd0cmlwJylcbiAgICAgICAgICAgICAgICAuZG9jKCBTdHJpbmcoIHRpZCApKVxuICAgICAgICAgICAgICAgIC5maWVsZCh7XG4gICAgICAgICAgICAgICAgICAgIGVuZF9kYXRlOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICBzdGFydF9kYXRlOiB0cnVlXG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAuZ2V0KCApXG4gICAgICAgICAgICBjb25zdCB0cmlwID0gdHJpcCQuZGF0YTtcblxuICAgICAgICAgICAgLy8g6I635Y+W6KGM56iL55qE5rWP6KeI6YePXG4gICAgICAgICAgICBjb25zdCB2aXNpdFJlY29yZHMkID0gYXdhaXQgZGIuY29sbGVjdGlvbignZ29vZC12aXNpdGluZy1yZWNvcmQnKVxuICAgICAgICAgICAgICAgIC53aGVyZSh7XG4gICAgICAgICAgICAgICAgICAgIHZpc2l0VGltZTogXy5ndGUoIHRyaXAuc3RhcnRfZGF0ZSApXG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAuZ2V0KCApO1xuICAgICAgICAgICAgY29uc3QgdmlzaXRSZWNvcmRzID0gdmlzaXRSZWNvcmRzJC5kYXRhO1xuXG4gICAgICAgICAgICAvLyDojrflj5booYznqIvnmoTotK3nianmuIXljZVcbiAgICAgICAgICAgIGNvbnN0IHNsJCA9IGF3YWl0IGRiLmNvbGxlY3Rpb24oJ3Nob3BwaW5nLWxpc3QnKVxuICAgICAgICAgICAgICAgIC53aGVyZSh7XG4gICAgICAgICAgICAgICAgICAgIHRpZFxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLmZpZWxkKHtcbiAgICAgICAgICAgICAgICAgICAgcGlkOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICBvaWRzOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICB1aWRzOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICBhZGp1c3RQcmljZTogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgYWRqdXN0R3JvdXBQcmljZTogdHJ1ZVxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLmdldCggKTtcbiAgICAgICAgICAgIGNvbnN0IHNsID0gc2wkLmRhdGE7XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAvLyDnu5/orqHmlLbnm4pcbiAgICAgICAgICAgIGNvbnN0IHNsT3JkZXJzJCA9IGF3YWl0IFByb21pc2UuYWxsKFxuICAgICAgICAgICAgICAgIHNsLm1hcCggYXN5bmMgcyA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHsgb2lkcyB9ID0gcztcbiAgICAgICAgICAgICAgICAgICAgY29uc3Qgb3JkZXJzOiBhbnkgPSBhd2FpdCBQcm9taXNlLmFsbChcbiAgICAgICAgICAgICAgICAgICAgICAgIG9pZHMubWFwKCBhc3luYyBvID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBvcmRlciQgPSBhd2FpdCBkYi5jb2xsZWN0aW9uKCdvcmRlcicpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5kb2MoIFN0cmluZyggbyApKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAuZmllbGQoe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY291bnQ6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhbGxvY2F0ZWRDb3VudDogdHJ1ZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAuZ2V0KCApO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBvcmRlciQuZGF0YTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAuLi5zLFxuICAgICAgICAgICAgICAgICAgICAgICAgb3JkZXJzXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgKTtcbiAgICAgICAgXG4gICAgICAgICAgICAvLyDnu5/orqHmlLbnm4pcbiAgICAgICAgICAgIGluY29tZSA9IHNsT3JkZXJzJC5yZWR1Y2UoKCBzdW0sIHNsOiBhbnkgKSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3QgeyBvcmRlcnMsIHVpZHMsIGFkanVzdFByaWNlLCBhZGp1c3RHcm91cFByaWNlIH0gPSBzbDtcbiAgICAgICAgICAgICAgICBjb25zdCBzbElub21lID0gb3JkZXJzLnJlZHVjZSgoIGxhc3QsIG9yZGVyICkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCB7IGFsbG9jYXRlZENvdW50LCBjb3VudCB9ID0gb3JkZXI7XG4gICAgICAgICAgICAgICAgICAgIGxldCBjb3VudF8gPSBhbGxvY2F0ZWRDb3VudCAhPT0gdW5kZWZpbmVkID8gYWxsb2NhdGVkQ291bnQgOiBjb3VudDtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGxhc3QgKyAoIHVpZHMubGVuZ3RoID4gMSA/ICggYWRqdXN0R3JvdXBQcmljZSA/IGFkanVzdEdyb3VwUHJpY2UgOiBhZGp1c3RQcmljZSApIDogYWRqdXN0UHJpY2UgKSAqIGNvdW50XztcbiAgICAgICAgICAgICAgICB9LCAwICk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHNsSW5vbWUgKyBzdW07XG4gICAgICAgICAgICB9LCAwICk7XG5cbiAgICAgICAgICAgIC8vIOe7n+iuoeaIkOWKn+aLvOWbolxuICAgICAgICAgICAgbGV0IHNsT3Blbmlkczogc3RyaW5nWyBdID0gWyBdO1xuICAgICAgICAgICAgc2wubWFwKCBzID0+IHtcbiAgICAgICAgICAgICAgICBzbE9wZW5pZHMgPSBbIC4uLnNsT3BlbmlkcywgLi4ucy51aWRzIF1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgcGluTnVtID0gQXJyYXkuZnJvbShcbiAgICAgICAgICAgICAgICBuZXcgU2V0KCBzbE9wZW5pZHMgKVxuICAgICAgICAgICAgKS5sZW5ndGg7XG5cbiAgICAgICAgICAgIC8vIOe7n+iuoeaIkOWKn+S4i+WNleeahOS6p+WTgVxuICAgICAgICAgICAgcGluR29vZHNOdW0gPSBzbC5sZW5ndGg7XG5cbiAgICAgICAgICAgIC8vIOe7n+iuoeafpeeci+eahOaVsOaNrlxuICAgICAgICAgICAgbGV0IGdvb2RJZHM6IHN0cmluZ1sgXSA9IFsgXTtcbiAgICAgICAgICAgIGxldCB2aXNpdE9wZW5pZHM6IHN0cmluZ1sgXSA9IFsgXTtcblxuICAgICAgICAgICAgdmlzaXRSZWNvcmRzLm1hcCggdiA9PiB7XG4gICAgICAgICAgICAgICAgZ29vZElkcyA9IFsgLi4uZ29vZElkcywgdi5waWQgXVxuICAgICAgICAgICAgICAgIHZpc2l0T3BlbmlkcyA9IFsgLi4udmlzaXRPcGVuaWRzLCB2Lm9wZW5pZCBdXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgdmlzaXRHb29kc051bSA9IEFycmF5LmZyb20oXG4gICAgICAgICAgICAgICAgbmV3IFNldCggZ29vZElkcyApXG4gICAgICAgICAgICApLmxlbmd0aDtcblxuICAgICAgICAgICAgdmlzaXRvck51bSA9IEFycmF5LmZyb20oXG4gICAgICAgICAgICAgICAgbmV3IFNldCggdmlzaXRPcGVuaWRzIClcbiAgICAgICAgICAgICkubGVuZ3RoO1xuXG4gICAgICAgICAgICAvLyDmjInkurrlnYfmr4/mrL7llYblk4Hpg73miZPlvIAz5qyh6K6h566XXG4gICAgICAgICAgICB2aXNpdE51bSA9IHZpc2l0b3JOdW0gKiB2aXNpdEdvb2RzTnVtICogMztcblxuICAgICAgICAgICAgLy8g57uf6K6h5aSp5pWwXG4gICAgICAgICAgICBkYXlzTnVtID0gTWF0aC5jZWlsKCggdHJpcC5lbmRfZGF0ZSAtIHRyaXAuc3RhcnRfZGF0ZSApIC8gKCAyNCAqIDYwICogNjAgKiAxMDAwKSlcblxuICAgICAgICAgICAgY29uc3QgdGV4dDEgPSBgJHtkYXlzTnVtfeWkqeWGhe+8jGA7XG4gICAgICAgICAgICBjb25zdCB0ZXh0MiA9IGAke3Zpc2l0R29vZHNOdW195Lu25ZWG5ZOB6KKrJHt2aXNpdG9yTnVtfeS6uuWbtOingiR7dmlzaXROdW195qyhYDtcbiAgICAgICAgICAgIGNvbnN0IHRleHRzID0gW1xuICAgICAgICAgICAgICAgIGDmlLbnm4oke2luY29tZX3lhYPvvIwke3Bpbk51bX3kurrmi7zlm6Ike3Bpbkdvb2RzTnVtfeS7tuWVhuWTgWAsXG4gICAgICAgICAgICAgICAgKHRleHQxICsgdGV4dDIpLmxlbmd0aCA+IDIwID8gdGV4dDIgOiB0ZXh0MSArIHRleHQyXG4gICAgICAgICAgICBdO1xuXG4gICAgICAgICAgICAvLyDojrflj5bmiYDmnInnrqHnkIblkZhcbiAgICAgICAgICAgIGNvbnN0IGFkbXMkID0gYXdhaXQgZGIuY29sbGVjdGlvbignbWFuYWdlci1tZW1iZXInKVxuICAgICAgICAgICAgICAgIC53aGVyZSh7IH0pXG4gICAgICAgICAgICAgICAgLmdldCggKTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgLy8g5o6o6YCBXG4gICAgICAgICAgICBhd2FpdCBQcm9taXNlLmFsbChcbiAgICAgICAgICAgICAgICBhZG1zJC5kYXRhLm1hcCggYXN5bmMgYWRtID0+IHtcblxuICAgICAgICAgICAgICAgICAgICAvLyDov5DokKXmlbDmja5cbiAgICAgICAgICAgICAgICAgICAgYXdhaXQgY2xvdWQuY2FsbEZ1bmN0aW9uKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6ICdjb21tb24nLFxuICAgICAgICAgICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICR1cmw6ICdwdXNoLXN1YnNjcmliZScsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvcGVuaWQ6IGFkbS5vcGVuaWQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6ICd3YWl0UGluJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGFnZTogYHBhZ2VzL21hbmFnZXItdHJpcC1saXN0L2luZGV4YCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGV4dHNcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgICAgIC8vIOe+pOaKpVxuICAgICAgICAgICAgICAgICAgICBhd2FpdCBjbG91ZC5jYWxsRnVuY3Rpb24oe1xuICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogJ2NvbW1vbicsXG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJHVybDogJ3B1c2gtc3Vic2NyaWJlJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9wZW5pZDogYWRtLm9wZW5pZCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogJ3RyaXAnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYWdlOiBgcGFnZXMvdHJpcC1yZXdhcmQvaW5kZXg/dGlkPSR7dGlkfWAsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRleHRzOiBbJ+e+pOaLvOWbouaKpeWRiuW3suWHuu+8gScsICfngrnlh7vlubbliIbkuqvnu5nnvqTlj4vlkKfvvZ4nXVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICApO1xuXG4gICAgICAgICAgICByZXR1cm4gY3R4LmJvZHkgPSB7XG4gICAgICAgICAgICAgICAgc3RhdHVzOiAyMDAsXG4gICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgICB0ZXh0cyxcbiAgICAgICAgICAgICAgICAgICAgcGluTnVtLFxuICAgICAgICAgICAgICAgICAgICBpbmNvbWUsXG4gICAgICAgICAgICAgICAgICAgIHBpbkdvb2RzTnVtLFxuICAgICAgICAgICAgICAgICAgICB2aXNpdG9yTnVtLFxuICAgICAgICAgICAgICAgICAgICB2aXNpdEdvb2RzTnVtLFxuICAgICAgICAgICAgICAgICAgICB2aXNpdE51bSxcbiAgICAgICAgICAgICAgICAgICAgZGF5c051bSxcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBcbiAgICAgICAgfSBjYXRjaCAoIGUgKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZygnPz8/PycsIGUgKVxuICAgICAgICAgICAgcmV0dXJuIGN0eC5ib2R5ID0ge1xuICAgICAgICAgICAgICAgIHN0YXR1czogNTAwLFxuICAgICAgICAgICAgICAgIG1lc3NhZ2U6IGVcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgcmV0dXJuIGFwcC5zZXJ2ZSggKTtcblxufSJdfQ==