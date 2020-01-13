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
            var lastTrip, start_date, _id, tid, _a, published, title_1, reduce_price_1, getErr, fixEndDate, end_date, count$, createData, create$, origin$, origin, isClosed, temp, time_1, members_1, users, e_4;
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
                        time_1 = new Date(start_date);
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
        app.router('order-info', function (ctx, next) { return __awaiter(void 0, void 0, void 0, function () {
            var tid, trip$, orders$, clients, notPayAllClients, sl$, sl, slOrders$, sum, e_5;
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
                                pay_status: _.neq('0'),
                                base_status: _.neq('5')
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
        app.router('update-deliver', function (ctx, next) { return __awaiter(void 0, void 0, void 0, function () {
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
        app.router('deliver', function (ctx, next) { return __awaiter(void 0, void 0, void 0, function () {
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
        app.router('close', function (ctx, next) { return __awaiter(void 0, void 0, void 0, function () {
            var tid_1, orders$, trip$_1, members, e_8;
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
                        e_8 = _a.sent();
                        return [2, ctx.body = { status: 500 }];
                    case 8: return [2];
                }
            });
        }); });
        app.router('close-trip-analyze', function (ctx, next) { return __awaiter(void 0, void 0, void 0, function () {
            var income, pinGoodsNum, visitGoodsNum, daysNum, visitNum, visitorNum, pinNum, tid_2, trip$, trip, visitRecords$, visitRecords, sl$, sl, slOrders$, slOpenids_1, goodIds_1, visitOpenids_1, text1, text2, texts_1, adms$, e_9;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLHFDQUF1QztBQUN2QyxzQ0FBd0M7QUFFeEMsS0FBSyxDQUFDLElBQUksQ0FBQztJQUNQLEdBQUcsRUFBRSxPQUFPLENBQUMsR0FBRyxDQUFDLEtBQUs7Q0FDekIsQ0FBQyxDQUFDO0FBRUgsSUFBTSxFQUFFLEdBQWdCLEtBQUssQ0FBQyxRQUFRLEVBQUcsQ0FBQztBQUMxQyxJQUFNLENBQUMsR0FBRyxFQUFFLENBQUMsT0FBTyxDQUFDO0FBUXJCLElBQU0sTUFBTSxHQUFHLFVBQUUsRUFBVTtJQUFWLG1CQUFBLEVBQUEsVUFBVTtJQUN2QixJQUFLLEVBQUUsRUFBRztRQUNOLE9BQU8sSUFBSSxDQUFDLEdBQUcsRUFBRyxDQUFDO0tBQ3RCO0lBQ0QsSUFBTSxNQUFNLEdBQUcsSUFBSSxJQUFJLENBQUUsSUFBSSxJQUFJLEVBQUcsQ0FBQyxjQUFjLEVBQUcsQ0FBQyxDQUFDO0lBQ3hELE9BQU8sSUFBSSxJQUFJLENBQUUsTUFBTSxDQUFDLE9BQU8sRUFBRyxHQUFHLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLElBQUksQ0FBRSxDQUFBO0FBQzdELENBQUMsQ0FBQTtBQTBCWSxRQUFBLElBQUksR0FBRyxVQUFRLEtBQUssRUFBRSxPQUFPOzs7UUFFaEMsR0FBRyxHQUFHLElBQUksU0FBUyxDQUFDLEVBQUUsS0FBSyxPQUFBLEVBQUUsQ0FBQyxDQUFDO1FBUXJDLEdBQUcsQ0FBQyxNQUFNLENBQUMsT0FBTyxFQUFFLFVBQU8sR0FBRyxFQUFFLElBQUk7Ozs7Ozt3QkFFdEIsY0FBYyxHQUFHLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQyxTQUFT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Q3RCLElBQUksRUFBRTs0REFDRixNQUFNLEVBQUUsR0FBRyxDQUFDLE1BQU07NERBQ2xCLElBQUksRUFBRSxNQUFNOzREQUNaLElBQUksRUFBRSxpQ0FBK0IsS0FBSzs0REFDMUMsS0FBSyxFQUFFLENBQUMsVUFBVSxFQUFFLFlBQVksQ0FBQzt5REFDcEM7cURBQ0o7aURBQ0osQ0FBQyxFQUFBOzs0Q0FYRixTQVdFLENBQUM7NENBRUgsV0FBTTs7O2lDQUNULENBQUMsQ0FDTCxFQUFBOzt3QkFqQ0QsU0FpQ0MsQ0FBQzt3QkFFRixXQUFPLEdBQUcsQ0FBQyxJQUFJLEdBQUc7Z0NBQ2QsTUFBTSxFQUFFLEdBQUc7Z0NBQ1gsSUFBSSxFQUFFO29DQUNGLEtBQUssU0FBQTtvQ0FDTCxNQUFNLFFBQUE7b0NBQ04sTUFBTSxRQUFBO29DQUNOLFdBQVcsYUFBQTtvQ0FDWCxVQUFVLFlBQUE7b0NBQ1YsYUFBYSxlQUFBO29DQUNiLFFBQVEsVUFBQTtvQ0FDUixPQUFPLFNBQUE7aUNBQ1Y7NkJBQ0osRUFBQTs7O3dCQUdELE9BQU8sQ0FBQyxHQUFHLENBQUMsTUFBTSxFQUFFLEdBQUMsQ0FBRSxDQUFBO3dCQUN2QixXQUFPLEdBQUcsQ0FBQyxJQUFJLEdBQUc7Z0NBQ2QsTUFBTSxFQUFFLEdBQUc7Z0NBQ1gsT0FBTyxFQUFFLEdBQUM7NkJBQ2IsRUFBQTs7OzthQUVSLENBQUMsQ0FBQztRQUVILFdBQU8sR0FBRyxDQUFDLEtBQUssRUFBRyxFQUFDOztLQUV2QixDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgY2xvdWQgZnJvbSAnd3gtc2VydmVyLXNkayc7XG5pbXBvcnQgKiBhcyBUY2JSb3V0ZXIgZnJvbSAndGNiLXJvdXRlcic7XG5cbmNsb3VkLmluaXQoe1xuICAgIGVudjogcHJvY2Vzcy5lbnYuY2xvdWRcbn0pO1xuXG5jb25zdCBkYjogREIuRGF0YWJhc2UgPSBjbG91ZC5kYXRhYmFzZSggKTtcbmNvbnN0IF8gPSBkYi5jb21tYW5kO1xuXG4vKiogXG4gKiDovazmjaLmoLzmnpflsLzmsrvml7bljLogKzjml7bljLpcbiAqIERhdGUoKS5ub3coKSAvIG5ldyBEYXRlKCkuZ2V0VGltZSgpIOaYr+aXtuS4jeaXtuato+W4uOeahCs4XG4gKiBEYXRlLnRvTG9jYWxTdHJpbmcoICkg5aW95YOP5piv5LiA55u05pivKzDnmoRcbiAqIOWFiOaLv+WIsCArMO+8jOeEtuWQjis4XG4gKi9cbmNvbnN0IGdldE5vdyA9ICggdHMgPSBmYWxzZSApOiBhbnkgPT4ge1xuICAgIGlmICggdHMgKSB7XG4gICAgICAgIHJldHVybiBEYXRlLm5vdyggKTtcbiAgICB9XG4gICAgY29uc3QgdGltZV8wID0gbmV3IERhdGUoIG5ldyBEYXRlKCApLnRvTG9jYWxlU3RyaW5nKCApKTtcbiAgICByZXR1cm4gbmV3IERhdGUoIHRpbWVfMC5nZXRUaW1lKCApICsgOCAqIDYwICogNjAgKiAxMDAwIClcbn1cblxuLyoqXG4gKlxuICogQGRlc2NyaXB0aW9uIOihjOeoi+aooeWdl1xuICogLS0tLS0tLS0g5a2X5q61IC0tLS0tLS0tLS1cbiAgICAgICAgdGl0bGUg5qCH6aKYIHN0cmluZ1xuICAgICAgICB3YXJuaW5nOiDmmK/lkKblj5HpgIHov4fmnJ/orablkYrnu5lhZG0sXG4gICAgICAgIHN0YXJ0X2RhdGUg5byA5aeL5pe26Ze0IG51bWJlclxuICAgICAgICBlbmRfZGF0ZSDnu5PmnZ/ml7bpl7QgbnVtYmVyXG4gICAgICAgIHJlZHVjZV9wcmljZSDooYznqIvnq4vlh48gbnVtYmVyXG4gICAgICAgIHNhbGVzX3ZvbHVtZSDplIDllK7mgLvpop1cbiAgICAgICAgZnVsbHJlZHVjZV9hdGxlYXN0IOihjOeoi+a7oeWHjyAtIOmXqOanmyBudW1iZXJcbiAgICAgICAgZnVsbHJlZHVjZV92YWx1ZXMg6KGM56iL5ruh5YePIC0g5YeP5aSa5bCRIG51bWJlclxuICAgICAgICBjYXNoY291cG9uX2F0bGVhc3Qg6KGM56iL5Luj6YeR5Yi4IC0g6Zeo5qebIG51bWJlclxuICAgICAgICBjYXNoY291cG9uX3ZhbHVlcyDooYznqIvku6Pph5HliLggLSDph5Hpop0gbnVtYmVyXG4qISAgICAgIHBvc3RhZ2Ug6YKu6LS557G75Z6LIGRpYyBcbiohICAgICAgcG9zdGFnZWZyZWVfYXRsZWFzdCAg5YWN6YKu6Zeo5qebIG51bWJlclxuICAgICAgICBwYXltZW50IOS7mOasvuexu+WeiyBkaWMgXG4gICAgICAgIHB1Ymxpc2hlZCDmmK/lkKblj5HluIMgYm9vbGVhblxuICAgICAgICBjcmVhdGVUaW1lIOWIm+W7uuaXtumXtFxuICAgICAgICB1cGRhdGVUaW1lIOabtOaWsOaXtumXtFxuICAgICAgICBpc0Nsb3NlZDog5piv5ZCm5bey57uP5omL5Yqo5YWz6ZetXG4gICAgICAgIGNhbGxNb25leVRpbWVzOiDlj5HotbflgqzmrL7mrKHmlbBcbiohICAgICAgdHlwZTog57G75Z6L77yMc3lz77yI57O757uf6Ieq5Yqo5Y+R6LW377yJ44CBdW5kZWZpbmVk77yI5omL5Yqo5Yib5bu677yJXG4gKi9cbmV4cG9ydCBjb25zdCBtYWluID0gYXN5bmMgKCBldmVudCwgY29udGV4dCApID0+IHtcblxuICAgIGNvbnN0IGFwcCA9IG5ldyBUY2JSb3V0ZXIoeyBldmVudCB9KTtcblxuICAgIC8qKlxuICAgICAqIC0tLS0tLSDor7fmsYIgLS0tLS0tLS1cbiAgICAgKiB7XG4gICAgICogICAgc2hvdWxkR2V0R29vZHM6IOm7mOiupHRydWXvvIzlj6/ku6XkuI3loavvvIzojrflj5booYznqIvmjqjojZDllYblk4FcbiAgICAgKiB9XG4gICAgICovXG4gICAgYXBwLnJvdXRlcignZW50ZXInLCBhc3luYyggY3R4LCBuZXh0ICkgPT4ge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgY29uc3Qgc2hvdWxkR2V0R29vZHMgPSBldmVudC5kYXRhID8gZXZlbnQuZGF0YS5zaG91bGRHZXRHb29kcyA6IHVuZGVmaW5lZDtcblxuICAgICAgICAgICAgLy8g5oyJ5byA5aeL5pel5pyf5q2j5bqP77yM6I635Y+W5pyA5aSaMuadoSDlt7Llj5HluIPjgIHmnKrnu5PmnZ/nmoTooYznqItcbiAgICAgICAgICAgIGNvbnN0IGRhdGEkID0gYXdhaXQgZGIuY29sbGVjdGlvbigndHJpcCcpXG4gICAgICAgICAgICAgICAgLndoZXJlKHtcbiAgICAgICAgICAgICAgICAgICAgaXNDbG9zZWQ6IGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICBwdWJsaXNoZWQ6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgIGVuZF9kYXRlOiBfLmd0KCBnZXROb3coIHRydWUgKSlcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIC5saW1pdCggMiApXG4gICAgICAgICAgICAgICAgLm9yZGVyQnkoJ3N0YXJ0X2RhdGUnLCAnYXNjJylcbiAgICAgICAgICAgICAgICAuZ2V0KCApO1xuXG4gICAgICAgICAgICBsZXQgdHJpcHMgPSBkYXRhJC5kYXRhO1xuXG4gICAgICAgICAgICAvLyDmi4nlj5bmnIDmlrDooYznqIvnmoTmjqjojZDllYblk4FcbiAgICAgICAgICAgIGlmICgoICEhdHJpcHNbIDAgXSAmJiBzaG91bGRHZXRHb29kcyA9PT0gdW5kZWZpbmVkICkgfHwgc2hvdWxkR2V0R29vZHMgPT09IHRydWUgKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgdHJpcE9uZVByb2R1Y3RzJCA9IGF3YWl0IFByb21pc2UuYWxsKCB0cmlwc1sgMCBdLnNlbGVjdGVkUHJvZHVjdElkcy5tYXAoIHBpZCA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBjbG91ZC5jYWxsRnVuY3Rpb24oe1xuICAgICAgICAgICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgX2lkOiBwaWQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkdXJsOiAnZGV0YWlsJ1xuICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6ICdnb29kJ1xuICAgICAgICAgICAgICAgICAgICB9KS50aGVuKCByZXMgPT4gcmVzLnJlc3VsdC5kYXRhICk7XG4gICAgICAgICAgICAgICAgfSkpO1xuICAgICAgICAgICAgICAgIHRyaXBzWyAwIF0gPSBPYmplY3QuYXNzaWduKHsgfSwgdHJpcHNbIDAgXSwge1xuICAgICAgICAgICAgICAgICAgICBwcm9kdWN0czogdHJpcE9uZVByb2R1Y3RzJFxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gY3R4LmJvZHkgPSB7XG4gICAgICAgICAgICAgICAgc3RhdHVzOiAyMDAsXG4gICAgICAgICAgICAgICAgZGF0YTogdHJpcHNcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgfSBjYXRjaCAoIGUgKSB7XG4gICAgICAgICAgICByZXR1cm4gY3R4LmJvZHkgPSB7XG4gICAgICAgICAgICAgICAgc3RhdHVzOiA1MDAsXG4gICAgICAgICAgICAgICAgbWVzc2FnZTogZVxuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgYXBwLnJvdXRlcignbGlzdCcsIGFzeW5jKCBjdHgsIG5leHQgKSA9PiB7XG4gICAgICAgIHRyeSB7XG5cbiAgICAgICAgICAgIC8vIOafpeivouadoeaVsFxuICAgICAgICAgICAgY29uc3QgbGltaXQgPSAyMDtcbiAgICAgICAgICAgIGNvbnN0IHNlYXJjaCQgPSBldmVudC5kYXRhLnRpdGxlIHx8ICcnO1xuICAgICAgICAgICAgY29uc3Qgc2VhcmNoID0gbmV3IFJlZ0V4cCggc2VhcmNoJC5yZXBsYWNlKC9cXHMrL2csIFwiXCIpLCAnaScpO1xuXG4gICAgICAgICAgICAvLyDojrflj5bmgLvmlbBcbiAgICAgICAgICAgIGNvbnN0IHRvdGFsJCA9IGF3YWl0IGRiLmNvbGxlY3Rpb24oJ3RyaXAnKVxuICAgICAgICAgICAgICAgIC53aGVyZSh7XG4gICAgICAgICAgICAgICAgICAgIHRpdGxlOiBzZWFyY2hcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIC5jb3VudCggKTtcblxuICAgICAgICAgICAgLy8g6I635Y+W5pWw5o2uXG4gICAgICAgICAgICBjb25zdCB0cmlwcyQgPSBhd2FpdCBkYi5jb2xsZWN0aW9uKCd0cmlwJylcbiAgICAgICAgICAgICAgICAud2hlcmUoe1xuICAgICAgICAgICAgICAgICAgICB0aXRsZTogc2VhcmNoXG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAubGltaXQoIGxpbWl0IClcbiAgICAgICAgICAgICAgICAuc2tpcCgoIGV2ZW50LmRhdGEucGFnZSAtIDEgKSAqIGxpbWl0IClcbiAgICAgICAgICAgICAgICAub3JkZXJCeSgndXBkYXRlVGltZScsICdkZXNjJylcbiAgICAgICAgICAgICAgICAuZ2V0KCApO1xuXG4gICAgICAgICAgICBjb25zdCBtb3JlID0gYXdhaXQgUHJvbWlzZS5hbGwoXG4gICAgICAgICAgICAgICAgdHJpcHMkLmRhdGEubWFwKCBhc3luYyB0cmlwID0+IHtcblxuICAgICAgICAgICAgICAgICAgICAvLyDojrflj5booYznqIvnmoTotK3nianmuIXljZVcbiAgICAgICAgICAgICAgICAgICAgY29uc3Qgc2wkID0gYXdhaXQgZGIuY29sbGVjdGlvbignc2hvcHBpbmctbGlzdCcpXG4gICAgICAgICAgICAgICAgICAgICAgICAud2hlcmUoe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRpZDogdHJpcC5faWRcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgICAgICAuZmllbGQoe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBpZDogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvaWRzOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHVpZHM6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYWRqdXN0UHJpY2U6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYWRqdXN0R3JvdXBQcmljZTogdHJ1ZVxuICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgICAgIC5nZXQoICk7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHNsID0gc2wkLmRhdGE7XG5cbiAgICAgICAgICAgICAgICAgICAgLy8g57uf6K6h5pS255uKXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHNsT3JkZXJzJCA9IGF3YWl0IFByb21pc2UuYWxsKFxuICAgICAgICAgICAgICAgICAgICAgICAgc2wubWFwKCBhc3luYyBzID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCB7IG9pZHMgfSA9IHM7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3Qgb3JkZXJzOiBhbnkgPSBhd2FpdCBQcm9taXNlLmFsbChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb2lkcy5tYXAoIGFzeW5jIG8gPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3Qgb3JkZXIkID0gYXdhaXQgZGIuY29sbGVjdGlvbignb3JkZXInKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5kb2MoIFN0cmluZyggbyApKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5maWVsZCh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvdW50OiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhbGxvY2F0ZWRDb3VudDogdHJ1ZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLmdldCggKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBvcmRlciQuZGF0YTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC4uLnMsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9yZGVyc1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgICk7XG5cbiAgICAgICAgICAgICAgICAgICAgLy8g57uf6K6h5pS255uKXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGluY29tZSA9IHNsT3JkZXJzJC5yZWR1Y2UoKCBzdW0sIHNsOiBhbnkgKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCB7IG9yZGVycywgdWlkcywgYWRqdXN0UHJpY2UsIGFkanVzdEdyb3VwUHJpY2UgfSA9IHNsO1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3Qgc2xJbm9tZSA9IG9yZGVycy5yZWR1Y2UoKCBsYXN0LCBvcmRlciApID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCB7IGFsbG9jYXRlZENvdW50LCBjb3VudCB9ID0gb3JkZXI7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGNvdW50XyA9IGFsbG9jYXRlZENvdW50ICE9PSB1bmRlZmluZWQgPyBhbGxvY2F0ZWRDb3VudCA6IGNvdW50O1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBsYXN0ICsgKCB1aWRzLmxlbmd0aCA+IDEgPyAoIGFkanVzdEdyb3VwUHJpY2UgPyBhZGp1c3RHcm91cFByaWNlIDogYWRqdXN0UHJpY2UgKSA6IGFkanVzdFByaWNlICkgKiBjb3VudF87XG4gICAgICAgICAgICAgICAgICAgICAgICB9LCAwICk7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gc2xJbm9tZSArIHN1bTtcbiAgICAgICAgICAgICAgICAgICAgfSwgMCApO1xuXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IG9yZGVycyQgPSBhd2FpdCBkYi5jb2xsZWN0aW9uKCdvcmRlcicpXG4gICAgICAgICAgICAgICAgICAgICAgICAud2hlcmUoe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRpZDogdHJpcC5faWQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcGF5X3N0YXR1czogXy5lcSgnMScpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJhc2Vfc3RhdHVzOiBfLm9yKCBfLmVxKCcwJyksXy5lcSgnMScpLCBfLmVxKCcyJyksIF8uZXEoJzMnKSlcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgICAgICAuZmllbGQoe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9wZW5pZDogdHJ1ZVxuICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgICAgIC5nZXQoICk7XG5cbiAgICAgICAgICAgICAgICAgICAgLy8g5pyq5LuY5qy+5Lmw5a62XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IG5vdFBheUFsbENsaWVudHMgPSBBcnJheS5mcm9tKFxuICAgICAgICAgICAgICAgICAgICAgICAgbmV3IFNldCggXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb3JkZXJzJC5kYXRhXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5tYXAoIHggPT4geC5vcGVuaWQgKVxuICAgICAgICAgICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICAgICAgICApLmxlbmd0aDtcblxuICAgICAgICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgbm90UGF5QWxsQ2xpZW50cyxcbiAgICAgICAgICAgICAgICAgICAgICAgIHNhbGVzX3ZvbHVtZTogaW5jb21lXG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICApO1xuXG4gICAgICAgICAgICBjb25zdCBpbmplY3QgPSB0cmlwcyQuZGF0YS5tYXAoKCB0cmlwLCBrZXkgKSA9PiB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICAgICAgLi4udHJpcCxcbiAgICAgICAgICAgICAgICAgICAgLi4ubW9yZVsga2V5IF1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgXG4gICAgICAgICAgICByZXR1cm4gY3R4LmJvZHkgPSB7XG4gICAgICAgICAgICAgICAgc3RhdHVzOiAyMDAsXG4gICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgICBzZWFyY2g6IGV2ZW50LmRhdGEudGl0bGUucmVwbGFjZSgvXFxzKy9nLCAnJyksXG4gICAgICAgICAgICAgICAgICAgIHBhZ2VTaXplOiBsaW1pdCxcbiAgICAgICAgICAgICAgICAgICAgcGFnZTogZXZlbnQuZGF0YS5wYWdlLFxuICAgICAgICAgICAgICAgICAgICBkYXRhOiBpbmplY3QsXG4gICAgICAgICAgICAgICAgICAgIHRvdGFsOiB0b3RhbCQudG90YWwsXG4gICAgICAgICAgICAgICAgICAgIHRvdGFsUGFnZTogTWF0aC5jZWlsKCB0b3RhbCQudG90YWwgLyBsaW1pdCApXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfTtcblxuICAgICAgICB9IGNhdGNoICggZSApIHtcbiAgICAgICAgICAgIHJldHVybiBjdHguYm9keSA9IHtcbiAgICAgICAgICAgICAgICBzdGF0dXM6IDUwMCxcbiAgICAgICAgICAgICAgICBtZXNzYWdlOiBlXG4gICAgICAgICAgICB9O1xuICAgICAgICB9IFxuICAgIH0pO1xuICAgIFxuICAgIC8qKlxuICAgICAqIEBkZXNjcmlwdGlvblxuICAgICAqIOihjOeoi+ivpuaDhVxuICAgICAqIHtcbiAgICAgKiAgICAgIG1vcmVEZXRhaWw6IHVuZGVmaW5lZCB8IGZhbHNlIHwgdHJ1ZVxuICAgICAqIH1cbiAgICAgKi9cbiAgICBhcHAucm91dGVyKCdkZXRhaWwnLCBhc3luYyggY3R4LCBuZXh0ICkgPT4ge1xuICAgICAgICB0cnkge1xuXG4gICAgICAgICAgICBjb25zdCB7IG1vcmVEZXRhaWwgfSA9IGV2ZW50LmRhdGE7XG4gICAgICAgICAgICBjb25zdCB0aWQgPSBldmVudC5kYXRhLl9pZCB8fCBldmVudC5kYXRhLnRpZDtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgLy8g6I635Y+W5Z+65pys6K+m5oOFXG4gICAgICAgICAgICBjb25zdCBkYXRhJCA9IGF3YWl0IGRiLmNvbGxlY3Rpb24oJ3RyaXAnKVxuICAgICAgICAgICAgICAgIC5kb2MoIHRpZCApXG4gICAgICAgICAgICAgICAgLmdldCggKTtcbiAgICAgICAgICAgIGNvbnN0IG1ldGEgPSBkYXRhJC5kYXRhO1xuXG4gICAgICAgICAgICBpZiAoIG1vcmVEZXRhaWwgIT09IGZhbHNlICkge1xuICAgICAgICAgICAgICAgIC8vIOmAmui/h+W3sumAieeahOWVhuWTgWlkcyzmi7/liLDlr7nlupTnmoTlm77niYfjgIF0aXRsZeOAgV9pZFxuICAgICAgICAgICAgICAgIGNvbnN0IHByb2R1Y3RzJDogYW55ID0gYXdhaXQgUHJvbWlzZS5hbGwoIG1ldGEuc2VsZWN0ZWRQcm9kdWN0SWRzLm1hcCggcGlkID0+IHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGRiLmNvbGxlY3Rpb24oJ2dvb2RzJylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAud2hlcmUoe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBfaWQ6IHBpZFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLmZpZWxkKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaW1nOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aXRsZTogdHJ1ZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLmdldCggKTtcbiAgICAgICAgICAgICAgICB9KSk7XG5cbiAgICAgICAgICAgICAgICBtZXRhLnNlbGVjdGVkUHJvZHVjdHMgPSBwcm9kdWN0cyQubWFwKCB4ID0+IHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHguZGF0YVsgMCBdO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBtZXRhLnNlbGVjdGVkUHJvZHVjdHMgPSBbIF07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGNvbnN0IGNhbkVkaXQkID0gYXdhaXQgZGIuY29sbGVjdGlvbignY291cG9uJylcbiAgICAgICAgICAgICAgICAud2hlcmUoe1xuICAgICAgICAgICAgICAgICAgICB0aWRcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIC5jb3VudCggKTtcblxuICAgICAgICAgICAgLy8gbWV0YS5jYW5FZGl0Q291cG9ucyA9IGNhbkVkaXQkLnRvdGFsID09PSAwO1xuICAgICAgICAgICAgLy8g6L+Z5Liq54mI5pys5Y+q5pyJIOeri+WHj1xuICAgICAgICAgICAgbWV0YS5jYW5FZGl0Q291cG9ucyA9IHRydWU7XG5cbiAgICAgICAgICAgIHJldHVybiBjdHguYm9keSA9IHtcbiAgICAgICAgICAgICAgICBzdGF0dXM6IDIwMCxcbiAgICAgICAgICAgICAgICBkYXRhOiBtZXRhXG4gICAgICAgICAgICB9O1xuXG4gICAgICAgIH0gY2F0Y2goIGUgKSB7XG4gICAgICAgICAgICByZXR1cm4gY3R4LmJvZHkgPSB7XG4gICAgICAgICAgICAgICAgc3RhdHVzOiA1MDAsXG4gICAgICAgICAgICAgICAgbWVzc2FnZTogZVxuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgLyoqXG4gICAgICogQGRlc2NyaXB0aW9uXG4gICAgICog5Yib5bu6IC8g57yW6L6R5b2T5YmN6KGM56iLXG4gICAgICovXG4gICAgYXBwLnJvdXRlcignZWRpdCcsIGFzeW5jKCBjdHgsIG5leHQgKSA9PiB7XG4gICAgICAgIHRyeSB7XG5cbiAgICAgICAgICAgIGxldCBsYXN0VHJpcDogYW55ID0gbnVsbDtcbiAgICAgICAgICAgIGxldCBzdGFydF9kYXRlID0gZ2V0Tm93KCB0cnVlICk7XG4gICAgICAgICAgICBsZXQgX2lkID0gZXZlbnQuZGF0YS5faWQ7XG4gICAgICAgICAgICBjb25zdCB0aWQgPSBldmVudC5kYXRhLl9pZDtcbiAgICAgICAgICAgIGNvbnN0IHsgcHVibGlzaGVkLCB0aXRsZSwgcmVkdWNlX3ByaWNlIH0gPSBldmVudC5kYXRhO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICBjb25zdCBnZXRFcnIgPSBtZXNzYWdlID0+IHtcbiAgICAgICAgICAgICAgICByZXR1cm4gY3R4LmJvZHkgPSB7XG4gICAgICAgICAgICAgICAgICAgIHN0YXR1czogNTAwLFxuICAgICAgICAgICAgICAgICAgICBtZXNzYWdlXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgLy8g6KGM56iL6buY6K6k5Zyo5b2T5aSp5pma5LiKMjPngrnnu5PmnZ9cbiAgICAgICAgICAgIGNvbnN0IGZpeEVuZERhdGUgPSBlbmREYXRlID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCB0ID0gbmV3IERhdGUoIGVuZERhdGUgKTtcbiAgICAgICAgICAgICAgICBjb25zdCB5ID0gdC5nZXRGdWxsWWVhciggKTtcbiAgICAgICAgICAgICAgICBjb25zdCBtID0gdC5nZXRNb250aCggKSArIDE7XG4gICAgICAgICAgICAgICAgY29uc3QgZCA9IHQuZ2V0RGF0ZSggKTtcblxuICAgICAgICAgICAgICAgIHJldHVybiBuZXcgRGF0ZShgJHt5fS8ke219LyR7ZH0gMjM6MDA6MDBgKS5nZXRUaW1lKCApO1xuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgY29uc3QgZW5kX2RhdGUgPSBmaXhFbmREYXRlKCBOdW1iZXIoIGV2ZW50LmRhdGEuZW5kX2RhdGUgKSk7XG5cbiAgICAgICAgICAgIGlmICggcmVkdWNlX3ByaWNlIDwgMSApIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZ2V0RXJyKCfnq4vlh4/ph5Hpop3kuI3og73lsJHkuo4x5YWDJylcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8g5Yib5bu66KGM56iLXG4gICAgICAgICAgICBpZiAoICFfaWQgKSB7XG5cbiAgICAgICAgICAgICAgICBjb25zdCBjb3VudCQgPSBhd2FpdCBkYi5jb2xsZWN0aW9uKCd0cmlwJylcbiAgICAgICAgICAgICAgICAgICAgLndoZXJlKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlzQ2xvc2VkOiBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHB1Ymxpc2hlZDogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgLmNvdW50KCApO1xuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIGlmICggY291bnQkLnRvdGFsICkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZ2V0RXJyKCfmnInmnKrnu5PmnZ/ooYznqIss6K+357uT5p2f6KGM56iL5ZCO5YaN5Yib5bu6Jyk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgY29uc3QgY3JlYXRlRGF0YSA9IHtcbiAgICAgICAgICAgICAgICAgICAgLi4uZXZlbnQuZGF0YSxcbiAgICAgICAgICAgICAgICAgICAgZW5kX2RhdGUsXG4gICAgICAgICAgICAgICAgICAgIHN0YXJ0X2RhdGU6IGdldE5vdyggdHJ1ZSApLFxuICAgICAgICAgICAgICAgICAgICB3YXJuaW5nOiBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgY2FsbE1vbmV5VGltZXM6IDBcbiAgICAgICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAgICAgY29uc3QgY3JlYXRlJCA9IGF3YWl0IGRiLmNvbGxlY3Rpb24oJ3RyaXAnKVxuICAgICAgICAgICAgICAgICAgICAuYWRkKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRhdGE6IGNyZWF0ZURhdGFcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgX2lkID0gY3JlYXRlJC5faWQ7XG4gICAgICAgICAgICAvLyDnvJbovpHooYznqIvjgIHopobnm5ZzeXNUcmlwXG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgIFxuICAgICAgICAgICAgICAgIGNvbnN0IG9yaWdpbiQgPSBhd2FpdCBkYi5jb2xsZWN0aW9uKCd0cmlwJylcbiAgICAgICAgICAgICAgICAgICAgLndoZXJlKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIF9pZFxuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAuZ2V0KCApO1xuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIGNvbnN0IG9yaWdpbiA9IG9yaWdpbiQuZGF0YVsgMCBdO1xuICAgICAgICAgICAgICAgIGNvbnN0IGlzQ2xvc2VkID0gZ2V0Tm93KCB0cnVlICkgPj0gTnVtYmVyKCBlbmRfZGF0ZSApO1xuICAgIFxuICAgICAgICAgICAgICAgIGRlbGV0ZSBvcmlnaW5bJ19pZCddO1xuICAgICAgICAgICAgICAgIGRlbGV0ZSBldmVudC5kYXRhWydfaWQnXTtcbiAgICAgICAgICAgICAgICBkZWxldGUgZXZlbnQuZGF0YVsnY3JlYXRlVGltZSddO1xuICAgICAgICAgICAgICAgIGRlbGV0ZSBldmVudC5kYXRhWydzYWxlc192b2x1bWUnXVxuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIGNvbnN0IHRlbXAgPSBPYmplY3QuYXNzaWduKHsgfSwgb3JpZ2luLCB7XG4gICAgICAgICAgICAgICAgICAgIC4uLmV2ZW50LmRhdGEsXG4gICAgICAgICAgICAgICAgICAgIGlzQ2xvc2VkLFxuICAgICAgICAgICAgICAgICAgICB0eXBlOiAnY3VzdG9tJyxcbiAgICAgICAgICAgICAgICAgICAgY2FsbE1vbmV5VGltZXM6IGVuZF9kYXRlID4gb3JpZ2luWydlbmRfZGF0ZSddID8gMCA6IG9yaWdpblsnY2FsbE1vbmV5VGltZXMnXVxuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgYXdhaXQgZGIuY29sbGVjdGlvbigndHJpcCcpXG4gICAgICAgICAgICAgICAgICAgIC5kb2MoIF9pZCApXG4gICAgICAgICAgICAgICAgICAgIC5zZXQoe1xuICAgICAgICAgICAgICAgICAgICAgICAgZGF0YTogdGVtcFxuICAgICAgICAgICAgICAgICAgICB9KTsgICBcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiDmjqjpgIFcbiAgICAgICAgICAgICAqIOWIm+W7uuaXtuWAmeeahOaOqOmAgVxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICBpZiAoKCAhdGlkICYmIHB1Ymxpc2hlZCApKSB7XG5cbiAgICAgICAgICAgICAgICBjb25zdCB0aW1lID0gbmV3IERhdGUoIHN0YXJ0X2RhdGUgKTtcblxuICAgICAgICAgICAgICAgIC8vIOaOqOmAgeS7o+i0remAmuefpVxuICAgICAgICAgICAgICAgIGNvbnN0IG1lbWJlcnMgPSBhd2FpdCBkYi5jb2xsZWN0aW9uKCdtYW5hZ2VyLW1lbWJlcicpXG4gICAgICAgICAgICAgICAgICAgIC53aGVyZSh7XG4gICAgICAgICAgICAgICAgICAgICAgICBwdXNoOiB0cnVlXG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgIC5nZXQoICk7XG5cbiAgICAgICAgICAgICAgICBhd2FpdCBQcm9taXNlLmFsbChcbiAgICAgICAgICAgICAgICAgICAgbWVtYmVycy5kYXRhLm1hcCggYXN5bmMgbWVtYmVyID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIDTjgIHosIPnlKjmjqjpgIFcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHB1c2gkID0gYXdhaXQgY2xvdWQuY2FsbEZ1bmN0aW9uKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiAnY29tbW9uJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICR1cmw6ICdwdXNoLXN1YnNjcmliZScsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9wZW5pZDogbWVtYmVyLm9wZW5pZCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6ICd0cmlwJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhZ2U6ICdwYWdlcy9tYW5hZ2VyLXRyaXAtbGlzdC9pbmRleCcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZXh0czogW2Ake3RpdGxlfWAsIGDku6PotK3ooYznqIvmjqjpgIHliLDlrqLmiLfvvIzkuJTlvIDpgJrkuoborqLljZXmjqjpgIFgXVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgKTtcblxuICAgICAgICAgICAgICAgIC8vIOaOqOmAgeWuouaIt+mAmuefpVxuICAgICAgICAgICAgICAgIGNvbnN0IHVzZXJzID0gYXdhaXQgZGIuY29sbGVjdGlvbigndXNlcicpXG4gICAgICAgICAgICAgICAgICAgIC53aGVyZSh7XG5cbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgLmdldCggKTtcblxuICAgICAgICAgICAgICAgIGF3YWl0IFByb21pc2UuYWxsKFxuICAgICAgICAgICAgICAgICAgICB1c2Vycy5kYXRhXG4gICAgICAgICAgICAgICAgICAgICAgICAuZmlsdGVyKCB1c2VyID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gIW1lbWJlcnMuZGF0YS5maW5kKCBtZW1iZXIgPT4gbWVtYmVyLm9wZW5pZCA9PT0gdXNlci5vcGVuaWQgKVxuICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgICAgIC5tYXAoIGFzeW5jIHVzZXIgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIDTjgIHosIPnlKjmjqjpgIEgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgcHVzaCQgPSBhd2FpdCBjbG91ZC5jYWxsRnVuY3Rpb24oe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiAnY29tbW9uJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJHVybDogJ3B1c2gtc3Vic2NyaWJlJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvcGVuaWQ6IHVzZXIub3BlbmlkLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6ICd0cmlwJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYWdlOiAncGFnZXMvdHJpcC1lbnRlci9pbmRleCcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGV4dHM6IFtgJHt0aXRsZX1gLCBg5Luj6LSt5ZyoJHt0aW1lLmdldE1vbnRoKCApKzF95pyIJHt0aW1lLmdldERhdGUoICl95pel5byA5aeL77yB5peg6Zeo5qeb56uL5YePJHtyZWR1Y2VfcHJpY2V95YWD77yBYF1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICApO1xuXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiBjdHguYm9keSA9IHtcbiAgICAgICAgICAgICAgICBkYXRhOiBfaWQsXG4gICAgICAgICAgICAgICAgc3RhdHVzOiAyMDBcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgXG4gICAgICAgIH0gY2F0Y2goIGUgKSB7XG4gICAgICAgICAgICByZXR1cm4gY3R4LmJvZHkgPSB7XG4gICAgICAgICAgICAgICAgc3RhdHVzOiA1MDAsXG4gICAgICAgICAgICAgICAgbWVzc2FnZTogZVxuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgLyoqIFxuICAgICAqIEBkZXNjcmlwdGlvblxuICAgICAqIOiOt+WPluihjOeoi+W6leS4i+eahOWfuuacrOS4muWKoeaVsOaNrlxuICAgICAqIOmUgOWUruaAu+mineOAgVxuICAgICAqIOWuouaIt+aAu+aVsOOAgVxuICAgICAqIOacquS7mOWwvuasvuWuouaIt+aVsOmHj+OAgVxuICAgICAqIOaAu+iuouWNleaVsOOAgVxuICAgICAqIOihjOeoi+WQjeensOOAgVxuICAgICAqIOW3suWPkemAgeWCrOasvuasoeaVsFxuICAgICAqL1xuICAgIGFwcC5yb3V0ZXIoJ29yZGVyLWluZm8nLCBhc3luYyggY3R4LCBuZXh0ICkgPT4ge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgY29uc3QgeyB0aWQgfSA9IGV2ZW50LmRhdGE7XG5cbiAgICAgICAgICAgIC8qKiDooYznqIvor6bmg4UgKi9cbiAgICAgICAgICAgIGNvbnN0IHRyaXAkID0gYXdhaXQgZGIuY29sbGVjdGlvbigndHJpcCcpXG4gICAgICAgICAgICAgICAgLmRvYyggdGlkIClcbiAgICAgICAgICAgICAgICAuZ2V0KCApO1xuICAgICAgICBcbiAgICAgICAgICAgIC8vIOiOt+WPluihjOeoi+W6leS4i+aJgOacieeahOiuouWNlVxuICAgICAgICAgICAgY29uc3Qgb3JkZXJzJCA9IGF3YWl0IGRiLmNvbGxlY3Rpb24oJ29yZGVyJylcbiAgICAgICAgICAgICAgICAud2hlcmUoe1xuICAgICAgICAgICAgICAgICAgICB0aWQsXG4gICAgICAgICAgICAgICAgICAgIHBheV9zdGF0dXM6IF8ubmVxKCcwJyksXG4gICAgICAgICAgICAgICAgICAgIGJhc2Vfc3RhdHVzOiBfLm5lcSgnNScpXG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAuZ2V0KCApO1xuXG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIOaAu+WuouaIt+aVsOmHj1xuICAgICAgICAgICAgICogIeiHs+WwkeW3suS7mOiuoumHkVxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICBjb25zdCBjbGllbnRzID0gQXJyYXkuZnJvbShcbiAgICAgICAgICAgICAgICBuZXcgU2V0KCBvcmRlcnMkLmRhdGFcbiAgICAgICAgICAgICAgICAgICAgLmZpbHRlciggeCA9PiB4LnBheV9zdGF0dXMgIT09ICcwJyApXG4gICAgICAgICAgICAgICAgICAgIC5tYXAoIHggPT4geC5vcGVuaWQgKVxuICAgICAgICAgICAgKSkubGVuZ3RoO1xuXG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIOaAu+acquS6pOWwvuasvuWuouaIt+aVsOmHj1xuICAgICAgICAgICAgICovXG4gICAgICAgICAgICBjb25zdCBub3RQYXlBbGxDbGllbnRzID0gQXJyYXkuZnJvbShcbiAgICAgICAgICAgICAgICBuZXcgU2V0KCBvcmRlcnMkLmRhdGFcbiAgICAgICAgICAgICAgICAgICAgLmZpbHRlciggeCA9PiB4LnBheV9zdGF0dXMgPT09ICcxJyApXG4gICAgICAgICAgICAgICAgICAgIC5tYXAoIHggPT4geC5vcGVuaWQgKVxuICAgICAgICAgICAgKSkubGVuZ3RoO1xuXG4gICAgICAgICAgICAvLyDojrflj5booYznqIvnmoTotK3nianmuIXljZVcbiAgICAgICAgICAgIGNvbnN0IHNsJCA9IGF3YWl0IGRiLmNvbGxlY3Rpb24oJ3Nob3BwaW5nLWxpc3QnKVxuICAgICAgICAgICAgICAgIC53aGVyZSh7XG4gICAgICAgICAgICAgICAgICAgIHRpZFxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLmZpZWxkKHtcbiAgICAgICAgICAgICAgICAgICAgcGlkOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICBvaWRzOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICB1aWRzOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICBhZGp1c3RQcmljZTogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgYWRqdXN0R3JvdXBQcmljZTogdHJ1ZVxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLmdldCggKTtcbiAgICAgICAgICAgIGNvbnN0IHNsID0gc2wkLmRhdGE7XG5cbiAgICAgICAgICAgIC8vIOe7n+iuoeaUtuebilxuICAgICAgICAgICAgY29uc3Qgc2xPcmRlcnMkID0gYXdhaXQgUHJvbWlzZS5hbGwoXG4gICAgICAgICAgICAgICAgc2wubWFwKCBhc3luYyBzID0+IHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgeyBvaWRzIH0gPSBzO1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBvcmRlcnM6IGFueSA9IGF3YWl0IFByb21pc2UuYWxsKFxuICAgICAgICAgICAgICAgICAgICAgICAgb2lkcy5tYXAoIGFzeW5jIG8gPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IG9yZGVyJCA9IGF3YWl0IGRiLmNvbGxlY3Rpb24oJ29yZGVyJylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLmRvYyggU3RyaW5nKCBvICkpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5maWVsZCh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb3VudDogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFsbG9jYXRlZENvdW50OiB0cnVlXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5nZXQoICk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG9yZGVyJC5kYXRhO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC4uLnMsXG4gICAgICAgICAgICAgICAgICAgICAgICBvcmRlcnNcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICApO1xuICAgICAgICBcbiAgICAgICAgICAgIC8vIOe7n+iuoeaUtuebilxuICAgICAgICAgICAgY29uc3Qgc3VtID0gc2xPcmRlcnMkLnJlZHVjZSgoIHN1bSwgc2w6IGFueSApID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCB7IG9yZGVycywgdWlkcywgYWRqdXN0UHJpY2UsIGFkanVzdEdyb3VwUHJpY2UgfSA9IHNsO1xuICAgICAgICAgICAgICAgIGNvbnN0IHNsSW5vbWUgPSBvcmRlcnMucmVkdWNlKCggbGFzdCwgb3JkZXIgKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHsgYWxsb2NhdGVkQ291bnQsIGNvdW50IH0gPSBvcmRlcjtcbiAgICAgICAgICAgICAgICAgICAgbGV0IGNvdW50XyA9IGFsbG9jYXRlZENvdW50ICE9PSB1bmRlZmluZWQgPyBhbGxvY2F0ZWRDb3VudCA6IGNvdW50O1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gbGFzdCArICggdWlkcy5sZW5ndGggPiAxID8gKCBhZGp1c3RHcm91cFByaWNlID8gYWRqdXN0R3JvdXBQcmljZSA6IGFkanVzdFByaWNlICkgOiBhZGp1c3RQcmljZSApICogY291bnRfO1xuICAgICAgICAgICAgICAgIH0sIDAgKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gc2xJbm9tZSArIHN1bTtcbiAgICAgICAgICAgIH0sIDAgKTtcblxuICAgICAgICAgICAgcmV0dXJuIGN0eC5ib2R5ID0ge1xuICAgICAgICAgICAgICAgIHN0YXR1czogMjAwLFxuICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgc3VtLCAvLyDplIDllK7mgLvpop1cbiAgICAgICAgICAgICAgICAgICAgY2xpZW50cywgLy8g5a6i5oi35oC75pWwXG4gICAgICAgICAgICAgICAgICAgIG5vdFBheUFsbENsaWVudHMsIC8vIOacquS7mOWwvuasvuWuouaIt+aVsOmHj1xuICAgICAgICAgICAgICAgICAgICBjb3VudDogb3JkZXJzJC5kYXRhLmxlbmd0aCwgLy8g5oC76K6i5Y2V5pWwLFxuICAgICAgICAgICAgICAgICAgICB0aXRsZTogdHJpcCQuZGF0YS50aXRsZSwgLy8g6KGM56iL5ZCN56ewXG4gICAgICAgICAgICAgICAgICAgIGNhbGxNb25leVRpbWVzOiB0cmlwJC5kYXRhLmNhbGxNb25leVRpbWVzIC8vIOW3suWPkemAgeWCrOasvuasoeaVsFxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgfSBjYXRjaCAoIGUgKSB7IHJldHVybiBjdHguYm9keSA9IHsgc3RhdHVzOiA1MDAgfTt9XG4gICAgfSlcblxuICAgIC8qKlxuICAgICAqIEBAZGVzY3JpcHRpb25cbiAgICAgKiDmm7TmlrDooYznqIvlupXkuIvnmoTlv6vpgJLlm77lhoxcbiAgICAgKi9cbiAgICBhcHAucm91dGVyKCd1cGRhdGUtZGVsaXZlcicsIGFzeW5jKCBjdHgsIG5leHQgKSA9PiB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBjb25zdCB7IHRpZCwgaW1ncyB9ID0gZXZlbnQuZGF0YTtcbiAgICAgICAgICAgIGNvbnN0IHRhcmdldCA9IGF3YWl0IGRiLmNvbGxlY3Rpb24oJ2RlbGl2ZXInKVxuICAgICAgICAgICAgICAgIC53aGVyZSh7XG4gICAgICAgICAgICAgICAgICAgIHRpZCxcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogJ2RlbGl2ZXItaW1nJ1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLmdldCggKTtcblxuICAgICAgICAgICAgLy8g5Yib5bu6XG4gICAgICAgICAgICBpZiAoICF0YXJnZXQuZGF0YVsgMCBdKSB7XG4gICAgICAgICAgICAgICAgYXdhaXQgZGIuY29sbGVjdGlvbignZGVsaXZlcicpXG4gICAgICAgICAgICAgICAgICAgIC5hZGQoe1xuICAgICAgICAgICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRpZCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbWdzLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6ICdkZWxpdmVyLWltZydcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAvLyDmm7TmlrBcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgYXdhaXQgZGIuY29sbGVjdGlvbignZGVsaXZlcicpXG4gICAgICAgICAgICAgICAgICAgIC5kb2MoIFN0cmluZyggdGFyZ2V0LmRhdGFbIDAgXS5faWQpKVxuICAgICAgICAgICAgICAgICAgICAudXBkYXRlKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbWdzXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiBjdHguYm9keSA9IHsgc3RhdHVzOiAyMDAgfTtcbiAgICAgICAgICAgIFxuICAgICAgICB9IGNhdGNoICggZSApIHsgcmV0dXJuIGN0eC5ib2R5ID0geyBzdGF0dXM6IDUwMCB9fVxuICAgIH0pXG5cbiAgICAvKipcbiAgICAgKiBAQGRlc2NyaXB0aW9uXG4gICAgICog6I635Y+W6KGM56iL5bqV5LiL55qE5b+r6YCS5Zu+5YaMXG4gICAgICovXG4gICAgYXBwLnJvdXRlcignZGVsaXZlcicsIGFzeW5jKCBjdHgsIG5leHQgKSA9PiB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBjb25zdCB7IHRpZCB9ID0gZXZlbnQuZGF0YTtcbiAgICAgICAgICAgIGNvbnN0IHRhcmdldCA9IGF3YWl0IGRiLmNvbGxlY3Rpb24oJ2RlbGl2ZXInKVxuICAgICAgICAgICAgICAgIC53aGVyZSh7XG4gICAgICAgICAgICAgICAgICAgIHRpZCxcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogJ2RlbGl2ZXItaW1nJ1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLmdldCggKTtcblxuICAgICAgICAgICAgcmV0dXJuIGN0eC5ib2R5ID0geyBcbiAgICAgICAgICAgICAgICBzdGF0dXM6IDIwMCxcbiAgICAgICAgICAgICAgICBkYXRhOiB0YXJnZXQuZGF0YVsgMCBdID8gdGFyZ2V0LmRhdGFbIDAgXS5pbWdzIDogWyBdXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfSBjYXRjaCAoIGUgKSB7XG4gICAgICAgICAgICByZXR1cm4gY3R4LmJvZHkgPSB7IHN0YXR1czogNTAwIH07XG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgIC8qKlxuICAgICAqIEBkZXNjcmlwdGlvblxuICAgICAqIOaJi+WKqOWFs+mXreW9k+WJjeihjOeoi1xuICAgICAqIHtcbiAgICAgKiAgICB0aWRcbiAgICAgKiB9XG4gICAgICovXG4gICAgYXBwLnJvdXRlcignY2xvc2UnLCBhc3luYyggY3R4LCBuZXh0ICkgPT4ge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgY29uc3QgeyB0aWQgfSA9IGV2ZW50LmRhdGE7XG5cbiAgICAgICAgICAgIC8vIOabtOaWsOihjOeoi2Nsb3Nl5a2X5q61XG4gICAgICAgICAgICBhd2FpdCBkYi5jb2xsZWN0aW9uKCd0cmlwJylcbiAgICAgICAgICAgICAgICAuZG9jKCBTdHJpbmcoIHRpZCApKVxuICAgICAgICAgICAgICAgIC51cGRhdGUoe1xuICAgICAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpc0Nsb3NlZDogdHJ1ZVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIC8vIOaJi+WKqOWPlua2iOihjOeoi+aXtu+8jOaKiuW+heaUr+S7mOiuouWNleiuvuS4uuWPlua2iFxuICAgICAgICAgICAgY29uc3Qgb3JkZXJzJCA9IGF3YWl0IGRiLmNvbGxlY3Rpb24oJ29yZGVyJylcbiAgICAgICAgICAgICAgICAud2hlcmUoe1xuICAgICAgICAgICAgICAgICAgICB0aWQsXG4gICAgICAgICAgICAgICAgICAgIHBheV9zdGF0dXM6ICcwJyxcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIC5nZXQoICk7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGF3YWl0IFByb21pc2UuYWxsKCBvcmRlcnMkLmRhdGEubWFwKCBvcmRlciQgPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiBkYi5jb2xsZWN0aW9uKCdvcmRlcicpXG4gICAgICAgICAgICAgICAgICAgIC5kb2MoIFN0cmluZyggb3JkZXIkLl9pZCApKVxuICAgICAgICAgICAgICAgICAgICAudXBkYXRlKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBiYXNlX3N0YXR1czogJzUnXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICB9KSk7XG5cbiAgICAgICAgICAgIGNvbnN0IHRyaXAkID0gYXdhaXQgZGIuY29sbGVjdGlvbigndHJpcCcpXG4gICAgICAgICAgICAgICAgLmRvYyggdGlkIClcbiAgICAgICAgICAgICAgICAuZ2V0KCApO1xuXG4gICAgICAgICAgICAvLyDmjqjpgIHku6PotK3pgJrnn6VcbiAgICAgICAgICAgIGNvbnN0IG1lbWJlcnMgPSBhd2FpdCBkYi5jb2xsZWN0aW9uKCdtYW5hZ2VyLW1lbWJlcicpXG4gICAgICAgICAgICAgICAgLndoZXJlKHtcbiAgICAgICAgICAgICAgICAgICAgcHVzaDogdHJ1ZVxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLmdldCggKTtcbiAgICAgICAgXG4gICAgICAgICAgICBhd2FpdCBQcm9taXNlLmFsbChcbiAgICAgICAgICAgICAgICBtZW1iZXJzLmRhdGEubWFwKCBhc3luYyBtZW1iZXIgPT4ge1xuXG4gICAgICAgICAgICAgICAgICAgIC8vIDTjgIHosIPnlKjmjqjpgIFcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgcHVzaDEkID0gYXdhaXQgY2xvdWQuY2FsbEZ1bmN0aW9uKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6ICdjb21tb24nLFxuICAgICAgICAgICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICR1cmw6ICdwdXNoLXN1YnNjcmliZScsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvcGVuaWQ6IG1lbWJlci5vcGVuaWQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6ICdnZXRNb25leScsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhZ2U6IGBwYWdlcy9tYW5hZ2VyLXRyaXAtb3JkZXIvaW5kZXg/aWQ9JHt0aWR9JmFjPSR7MX1gLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZXh0czogW2Ake3RyaXAkLmRhdGEudGl0bGV9YCwgYOWFs+mXreaIkOWKn++8geS4gOmUruaUtuasvuWKn+iDveW3suW8gOWQr2BdXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgICAgICBjb25zdCBwdXNoMiQgPSBhd2FpdCBjbG91ZC5jYWxsRnVuY3Rpb24oe1xuICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogJ3RyaXAnLFxuICAgICAgICAgICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICR1cmw6ICdjbG9zZS10cmlwLWFuYWx5emUnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGlkXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICApO1xuXG4gICAgICAgICAgICByZXR1cm4gY3R4LmJvZHkgPSB7IHN0YXR1czogMjAwIH07XG5cbiAgICAgICAgfSBjYXRjaCAoIGUgKSB7XG4gICAgICAgICAgICByZXR1cm4gY3R4LmJvZHkgPSB7IHN0YXR1czogNTAwIH07XG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgIC8qKlxuICAgICAqIEBkZXNjcmlwdGlvblxuICAgICAqIOaJi+WKqC/oh6rliqjlhbPpl63ooYznqIvnmoTml7blgJnvvIzlj5HpgIHmlbTkuKrooYznqIvnmoTov5DokKXmlbDmja7nu5lhZG3jgIJcbiAgICAgKiDlkIzml7blj5HpgIHjgIznvqTmiqXjgI3nu5lhZG1cbiAgICAgKi9cbiAgICBhcHAucm91dGVyKCdjbG9zZS10cmlwLWFuYWx5emUnLCBhc3luYyggY3R4LCBuZXh0ICkgPT4ge1xuICAgICAgICB0cnkge1xuXG4gICAgICAgICAgICAvLyDmlLbnm4pcbiAgICAgICAgICAgIGxldCBpbmNvbWUgPSAwO1xuICAgICAgICAgICAgLy8g5oiQ5Yqf5LiL5Y2V55qE5ZWG5ZOBXG4gICAgICAgICAgICBsZXQgcGluR29vZHNOdW0gPSAwO1xuICAgICAgICAgICAgLy8g6KKr5p+l55yL55qE5ZWG5ZOBXG4gICAgICAgICAgICBsZXQgdmlzaXRHb29kc051bSA9IDA7XG4gICAgICAgICAgICAvLyDooYznqIvlpKnmlbBcbiAgICAgICAgICAgIGxldCBkYXlzTnVtID0gMDtcbiAgICAgICAgICAgIC8vIOa1j+iniOmHj1xuICAgICAgICAgICAgbGV0IHZpc2l0TnVtID0gMDtcbiAgICAgICAgICAgIC8vIOa1j+iniOS6uuaVsFxuICAgICAgICAgICAgbGV0IHZpc2l0b3JOdW0gPSAwO1xuICAgICAgICAgICAgLy8g5oiQ5Yqf5ou85Zui5Lq65pWwXG4gICAgICAgICAgICBsZXQgcGluTnVtID0gMDtcbiAgICBcbiAgICAgICAgICAgIGNvbnN0IHsgdGlkIH0gPSBldmVudC5kYXRhO1xuXG4gICAgICAgICAgICAvLyDojrflj5booYznqIvor6bmg4VcbiAgICAgICAgICAgIGNvbnN0IHRyaXAkID0gYXdhaXQgZGIuY29sbGVjdGlvbigndHJpcCcpXG4gICAgICAgICAgICAgICAgLmRvYyggU3RyaW5nKCB0aWQgKSlcbiAgICAgICAgICAgICAgICAuZmllbGQoe1xuICAgICAgICAgICAgICAgICAgICBlbmRfZGF0ZTogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgc3RhcnRfZGF0ZTogdHJ1ZVxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLmdldCggKVxuICAgICAgICAgICAgY29uc3QgdHJpcCA9IHRyaXAkLmRhdGE7XG5cbiAgICAgICAgICAgIC8vIOiOt+WPluihjOeoi+eahOa1j+iniOmHj1xuICAgICAgICAgICAgY29uc3QgdmlzaXRSZWNvcmRzJCA9IGF3YWl0IGRiLmNvbGxlY3Rpb24oJ2dvb2QtdmlzaXRpbmctcmVjb3JkJylcbiAgICAgICAgICAgICAgICAud2hlcmUoe1xuICAgICAgICAgICAgICAgICAgICB2aXNpdFRpbWU6IF8uZ3RlKCB0cmlwLnN0YXJ0X2RhdGUgKVxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLmdldCggKTtcbiAgICAgICAgICAgIGNvbnN0IHZpc2l0UmVjb3JkcyA9IHZpc2l0UmVjb3JkcyQuZGF0YTtcblxuICAgICAgICAgICAgLy8g6I635Y+W6KGM56iL55qE6LSt54mp5riF5Y2VXG4gICAgICAgICAgICBjb25zdCBzbCQgPSBhd2FpdCBkYi5jb2xsZWN0aW9uKCdzaG9wcGluZy1saXN0JylcbiAgICAgICAgICAgICAgICAud2hlcmUoe1xuICAgICAgICAgICAgICAgICAgICB0aWRcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIC5maWVsZCh7XG4gICAgICAgICAgICAgICAgICAgIHBpZDogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgb2lkczogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgdWlkczogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgYWRqdXN0UHJpY2U6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgIGFkanVzdEdyb3VwUHJpY2U6IHRydWVcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIC5nZXQoICk7XG4gICAgICAgICAgICBjb25zdCBzbCA9IHNsJC5kYXRhO1xuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgLy8g57uf6K6h5pS255uKXG4gICAgICAgICAgICBjb25zdCBzbE9yZGVycyQgPSBhd2FpdCBQcm9taXNlLmFsbChcbiAgICAgICAgICAgICAgICBzbC5tYXAoIGFzeW5jIHMgPT4ge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCB7IG9pZHMgfSA9IHM7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IG9yZGVyczogYW55ID0gYXdhaXQgUHJvbWlzZS5hbGwoXG4gICAgICAgICAgICAgICAgICAgICAgICBvaWRzLm1hcCggYXN5bmMgbyA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3Qgb3JkZXIkID0gYXdhaXQgZGIuY29sbGVjdGlvbignb3JkZXInKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAuZG9jKCBTdHJpbmcoIG8gKSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLmZpZWxkKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvdW50OiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYWxsb2NhdGVkQ291bnQ6IHRydWVcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLmdldCggKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gb3JkZXIkLmRhdGE7XG4gICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgLi4ucyxcbiAgICAgICAgICAgICAgICAgICAgICAgIG9yZGVyc1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICk7XG4gICAgICAgIFxuICAgICAgICAgICAgLy8g57uf6K6h5pS255uKXG4gICAgICAgICAgICBpbmNvbWUgPSBzbE9yZGVycyQucmVkdWNlKCggc3VtLCBzbDogYW55ICkgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IHsgb3JkZXJzLCB1aWRzLCBhZGp1c3RQcmljZSwgYWRqdXN0R3JvdXBQcmljZSB9ID0gc2w7XG4gICAgICAgICAgICAgICAgY29uc3Qgc2xJbm9tZSA9IG9yZGVycy5yZWR1Y2UoKCBsYXN0LCBvcmRlciApID0+IHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgeyBhbGxvY2F0ZWRDb3VudCwgY291bnQgfSA9IG9yZGVyO1xuICAgICAgICAgICAgICAgICAgICBsZXQgY291bnRfID0gYWxsb2NhdGVkQ291bnQgIT09IHVuZGVmaW5lZCA/IGFsbG9jYXRlZENvdW50IDogY291bnQ7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBsYXN0ICsgKCB1aWRzLmxlbmd0aCA+IDEgPyAoIGFkanVzdEdyb3VwUHJpY2UgPyBhZGp1c3RHcm91cFByaWNlIDogYWRqdXN0UHJpY2UgKSA6IGFkanVzdFByaWNlICkgKiBjb3VudF87XG4gICAgICAgICAgICAgICAgfSwgMCApO1xuICAgICAgICAgICAgICAgIHJldHVybiBzbElub21lICsgc3VtO1xuICAgICAgICAgICAgfSwgMCApO1xuXG4gICAgICAgICAgICAvLyDnu5/orqHmiJDlip/mi7zlm6JcbiAgICAgICAgICAgIGxldCBzbE9wZW5pZHM6IHN0cmluZ1sgXSA9IFsgXTtcbiAgICAgICAgICAgIHNsLm1hcCggcyA9PiB7XG4gICAgICAgICAgICAgICAgc2xPcGVuaWRzID0gWyAuLi5zbE9wZW5pZHMsIC4uLnMudWlkcyBdXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHBpbk51bSA9IEFycmF5LmZyb20oXG4gICAgICAgICAgICAgICAgbmV3IFNldCggc2xPcGVuaWRzIClcbiAgICAgICAgICAgICkubGVuZ3RoO1xuXG4gICAgICAgICAgICAvLyDnu5/orqHmiJDlip/kuIvljZXnmoTkuqflk4FcbiAgICAgICAgICAgIHBpbkdvb2RzTnVtID0gc2wubGVuZ3RoO1xuXG4gICAgICAgICAgICAvLyDnu5/orqHmn6XnnIvnmoTmlbDmja5cbiAgICAgICAgICAgIGxldCBnb29kSWRzOiBzdHJpbmdbIF0gPSBbIF07XG4gICAgICAgICAgICBsZXQgdmlzaXRPcGVuaWRzOiBzdHJpbmdbIF0gPSBbIF07XG5cbiAgICAgICAgICAgIHZpc2l0UmVjb3Jkcy5tYXAoIHYgPT4ge1xuICAgICAgICAgICAgICAgIGdvb2RJZHMgPSBbIC4uLmdvb2RJZHMsIHYucGlkIF1cbiAgICAgICAgICAgICAgICB2aXNpdE9wZW5pZHMgPSBbIC4uLnZpc2l0T3Blbmlkcywgdi5vcGVuaWQgXVxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHZpc2l0R29vZHNOdW0gPSBBcnJheS5mcm9tKFxuICAgICAgICAgICAgICAgIG5ldyBTZXQoIGdvb2RJZHMgKVxuICAgICAgICAgICAgKS5sZW5ndGg7XG5cbiAgICAgICAgICAgIHZpc2l0b3JOdW0gPSBBcnJheS5mcm9tKFxuICAgICAgICAgICAgICAgIG5ldyBTZXQoIHZpc2l0T3BlbmlkcyApXG4gICAgICAgICAgICApLmxlbmd0aDtcblxuICAgICAgICAgICAgLy8g5oyJ5Lq65Z2H5q+P5qy+5ZWG5ZOB6YO95omT5byAM+asoeiuoeeul1xuICAgICAgICAgICAgdmlzaXROdW0gPSB2aXNpdG9yTnVtICogdmlzaXRHb29kc051bSAqIDM7XG5cbiAgICAgICAgICAgIC8vIOe7n+iuoeWkqeaVsFxuICAgICAgICAgICAgZGF5c051bSA9IE1hdGguY2VpbCgoIHRyaXAuZW5kX2RhdGUgLSB0cmlwLnN0YXJ0X2RhdGUgKSAvICggMjQgKiA2MCAqIDYwICogMTAwMCkpXG5cbiAgICAgICAgICAgIGNvbnN0IHRleHQxID0gYCR7ZGF5c051bX3lpKnlhoXvvIxgO1xuICAgICAgICAgICAgY29uc3QgdGV4dDIgPSBgJHt2aXNpdEdvb2RzTnVtfeS7tuWVhuWTgeiiqyR7dmlzaXRvck51bX3kurrlm7Top4Ike3Zpc2l0TnVtfeasoWA7XG4gICAgICAgICAgICBjb25zdCB0ZXh0cyA9IFtcbiAgICAgICAgICAgICAgICBg5pS255uKJHtpbmNvbWV95YWD77yMJHtwaW5OdW195Lq65ou85ZuiJHtwaW5Hb29kc051bX3ku7bllYblk4FgLFxuICAgICAgICAgICAgICAgICh0ZXh0MSArIHRleHQyKS5sZW5ndGggPiAyMCA/IHRleHQyIDogdGV4dDEgKyB0ZXh0MlxuICAgICAgICAgICAgXTtcblxuICAgICAgICAgICAgLy8g6I635Y+W5omA5pyJ566h55CG5ZGYXG4gICAgICAgICAgICBjb25zdCBhZG1zJCA9IGF3YWl0IGRiLmNvbGxlY3Rpb24oJ21hbmFnZXItbWVtYmVyJylcbiAgICAgICAgICAgICAgICAud2hlcmUoeyB9KVxuICAgICAgICAgICAgICAgIC5nZXQoICk7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIC8vIOaOqOmAgVxuICAgICAgICAgICAgYXdhaXQgUHJvbWlzZS5hbGwoXG4gICAgICAgICAgICAgICAgYWRtcyQuZGF0YS5tYXAoIGFzeW5jIGFkbSA9PiB7XG5cbiAgICAgICAgICAgICAgICAgICAgLy8g6L+Q6JCl5pWw5o2uXG4gICAgICAgICAgICAgICAgICAgIGF3YWl0IGNsb3VkLmNhbGxGdW5jdGlvbih7XG4gICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiAnY29tbW9uJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkdXJsOiAncHVzaC1zdWJzY3JpYmUnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb3BlbmlkOiBhZG0ub3BlbmlkLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiAnd2FpdFBpbicsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhZ2U6IGBwYWdlcy9tYW5hZ2VyLXRyaXAtbGlzdC9pbmRleGAsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRleHRzXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgICAgICAvLyDnvqTmiqVcbiAgICAgICAgICAgICAgICAgICAgYXdhaXQgY2xvdWQuY2FsbEZ1bmN0aW9uKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6ICdjb21tb24nLFxuICAgICAgICAgICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICR1cmw6ICdwdXNoLXN1YnNjcmliZScsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvcGVuaWQ6IGFkbS5vcGVuaWQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6ICd0cmlwJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGFnZTogYHBhZ2VzL3RyaXAtcmV3YXJkL2luZGV4P3RpZD0ke3RpZH1gLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZXh0czogWyfnvqTmi7zlm6LmiqXlkYrlt7Llh7rvvIEnLCAn54K55Ye75bm25YiG5Lqr57uZ576k5Y+L5ZCn772eJ11cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgKTtcblxuICAgICAgICAgICAgcmV0dXJuIGN0eC5ib2R5ID0ge1xuICAgICAgICAgICAgICAgIHN0YXR1czogMjAwLFxuICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgdGV4dHMsXG4gICAgICAgICAgICAgICAgICAgIHBpbk51bSxcbiAgICAgICAgICAgICAgICAgICAgaW5jb21lLFxuICAgICAgICAgICAgICAgICAgICBwaW5Hb29kc051bSxcbiAgICAgICAgICAgICAgICAgICAgdmlzaXRvck51bSxcbiAgICAgICAgICAgICAgICAgICAgdmlzaXRHb29kc051bSxcbiAgICAgICAgICAgICAgICAgICAgdmlzaXROdW0sXG4gICAgICAgICAgICAgICAgICAgIGRheXNOdW0sXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgXG4gICAgICAgIH0gY2F0Y2ggKCBlICkge1xuICAgICAgICAgICAgY29uc29sZS5sb2coJz8/Pz8nLCBlIClcbiAgICAgICAgICAgIHJldHVybiBjdHguYm9keSA9IHtcbiAgICAgICAgICAgICAgICBzdGF0dXM6IDUwMCxcbiAgICAgICAgICAgICAgICBtZXNzYWdlOiBlXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgIHJldHVybiBhcHAuc2VydmUoICk7XG5cbn0iXX0=