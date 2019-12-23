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
            var tid, trip$, orders$, sum, clients, notPayAllClients, e_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
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
                        sum = orders$.data
                            .filter(function (x) { return x.pay_status !== '0' &&
                            ((x.base_status === '1') || (x.base_status === '2') || (x.base_status === '3')); })
                            .reduce(function (x, y) {
                            return x + (y.allocatedPrice * (y.allocatedCount || 0));
                        }, 0);
                        clients = Array.from(new Set(orders$.data
                            .filter(function (x) { return x.pay_status !== '0'; })
                            .map(function (x) { return x.openid; }))).length;
                        notPayAllClients = Array.from(new Set(orders$.data
                            .filter(function (x) { return x.pay_status === '1'; })
                            .map(function (x) { return x.openid; }))).length;
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
                    case 3:
                        e_5 = _a.sent();
                        return [2, ctx.body = { status: 500 }];
                    case 4: return [2];
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
            var income, pinGoodsNum, visitGoodsNum, daysNum, visitNum, visitorNum, pinNum, tid, trip$, trip, visitRecords$, visitRecords, sl$, sl, slOrders$, slOpenids_1, goodIds_1, visitOpenids_1, text1, text2, texts_1, adms$, e_9;
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
                        tid = event.data.tid;
                        return [4, db.collection('trip')
                                .doc(String(tid))
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLGlCQTQyQkM7O0FBNTJCRCxxQ0FBdUM7QUFDdkMsc0NBQXdDO0FBRXhDLEtBQUssQ0FBQyxJQUFJLENBQUM7SUFDUCxHQUFHLEVBQUUsT0FBTyxDQUFDLEdBQUcsQ0FBQyxLQUFLO0NBQ3pCLENBQUMsQ0FBQztBQUVILElBQU0sRUFBRSxHQUFnQixLQUFLLENBQUMsUUFBUSxFQUFHLENBQUM7QUFDMUMsSUFBTSxDQUFDLEdBQUcsRUFBRSxDQUFDLE9BQU8sQ0FBQztBQVFyQixJQUFNLE1BQU0sR0FBRyxVQUFFLEVBQVU7SUFBVixtQkFBQSxFQUFBLFVBQVU7SUFDdkIsSUFBSyxFQUFFLEVBQUc7UUFDTixPQUFPLElBQUksQ0FBQyxHQUFHLEVBQUcsQ0FBQztLQUN0QjtJQUNELElBQU0sTUFBTSxHQUFHLElBQUksSUFBSSxDQUFFLElBQUksSUFBSSxFQUFHLENBQUMsY0FBYyxFQUFHLENBQUMsQ0FBQztJQUN4RCxPQUFPLElBQUksSUFBSSxDQUFFLE1BQU0sQ0FBQyxPQUFPLEVBQUcsR0FBRyxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxJQUFJLENBQUUsQ0FBQTtBQUM3RCxDQUFDLENBQUE7QUEwQlksUUFBQSxJQUFJLEdBQUcsVUFBUSxLQUFLLEVBQUUsT0FBTzs7OztRQUVoQyxHQUFHLEdBQUcsSUFBSSxTQUFTLENBQUMsRUFBRSxLQUFLLE9BQUEsRUFBRSxDQUFDLENBQUM7UUFRckMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxPQUFPLEVBQUUsVUFBTyxHQUFHLEVBQUUsSUFBSTs7Ozs7O3dCQUV0QixjQUFjLEdBQUcsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsQ0FBQyxD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QUFBO29DQUNWLGFBQWEsZUFBQTtvQ0FDYixRQUFRLFVBQUE7b0NBQ1IsT0FBTyxTQUFBO2lDQUNWOzZCQUNKLEVBQUE7Ozt3QkFHRCxPQUFPLENBQUMsR0FBRyxDQUFDLE1BQU0sRUFBRSxHQUFDLENBQUUsQ0FBQTt3QkFDdkIsV0FBTyxHQUFHLENBQUMsSUFBSSxHQUFHO2dDQUNkLE1BQU0sRUFBRSxHQUFHO2dDQUNYLE9BQU8sRUFBRSxHQUFDOzZCQUNiLEVBQUE7Ozs7YUFFUixDQUFDLENBQUE7UUFFRixXQUFPLEdBQUcsQ0FBQyxLQUFLLEVBQUcsRUFBQzs7S0FFdkIsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIGNsb3VkIGZyb20gJ3d4LXNlcnZlci1zZGsnO1xuaW1wb3J0ICogYXMgVGNiUm91dGVyIGZyb20gJ3RjYi1yb3V0ZXInO1xuXG5jbG91ZC5pbml0KHtcbiAgICBlbnY6IHByb2Nlc3MuZW52LmNsb3VkXG59KTtcblxuY29uc3QgZGI6IERCLkRhdGFiYXNlID0gY2xvdWQuZGF0YWJhc2UoICk7XG5jb25zdCBfID0gZGIuY29tbWFuZDtcblxuLyoqIFxuICog6L2s5o2i5qC85p6X5bC85rK75pe25Yy6ICs45pe25Yy6XG4gKiBEYXRlKCkubm93KCkgLyBuZXcgRGF0ZSgpLmdldFRpbWUoKSDmmK/ml7bkuI3ml7bmraPluLjnmoQrOFxuICogRGF0ZS50b0xvY2FsU3RyaW5nKCApIOWlveWDj+aYr+S4gOebtOaYrysw55qEXG4gKiDlhYjmi7/liLAgKzDvvIznhLblkI4rOFxuICovXG5jb25zdCBnZXROb3cgPSAoIHRzID0gZmFsc2UgKTogYW55ID0+IHtcbiAgICBpZiAoIHRzICkge1xuICAgICAgICByZXR1cm4gRGF0ZS5ub3coICk7XG4gICAgfVxuICAgIGNvbnN0IHRpbWVfMCA9IG5ldyBEYXRlKCBuZXcgRGF0ZSggKS50b0xvY2FsZVN0cmluZyggKSk7XG4gICAgcmV0dXJuIG5ldyBEYXRlKCB0aW1lXzAuZ2V0VGltZSggKSArIDggKiA2MCAqIDYwICogMTAwMCApXG59XG5cbi8qKlxuICpcbiAqIEBkZXNjcmlwdGlvbiDooYznqIvmqKHlnZdcbiAqIC0tLS0tLS0tIOWtl+autSAtLS0tLS0tLS0tXG4gICAgICAgIHRpdGxlIOagh+mimCBzdHJpbmdcbiAgICAgICAgd2FybmluZzog5piv5ZCm5Y+R6YCB6L+H5pyf6K2m5ZGK57uZYWRtLFxuICAgICAgICBzdGFydF9kYXRlIOW8gOWni+aXtumXtCBudW1iZXJcbiAgICAgICAgZW5kX2RhdGUg57uT5p2f5pe26Ze0IG51bWJlclxuICAgICAgICByZWR1Y2VfcHJpY2Ug6KGM56iL56uL5YePIG51bWJlclxuICAgICAgICBzYWxlc192b2x1bWUg6ZSA5ZSu5oC76aKdXG4gICAgICAgIGZ1bGxyZWR1Y2VfYXRsZWFzdCDooYznqIvmu6Hlh48gLSDpl6jmp5sgbnVtYmVyXG4gICAgICAgIGZ1bGxyZWR1Y2VfdmFsdWVzIOihjOeoi+a7oeWHjyAtIOWHj+WkmuWwkSBudW1iZXJcbiAgICAgICAgY2FzaGNvdXBvbl9hdGxlYXN0IOihjOeoi+S7o+mHkeWIuCAtIOmXqOanmyBudW1iZXJcbiAgICAgICAgY2FzaGNvdXBvbl92YWx1ZXMg6KGM56iL5Luj6YeR5Yi4IC0g6YeR6aKdIG51bWJlclxuKiEgICAgICBwb3N0YWdlIOmCrui0ueexu+WeiyBkaWMgXG4qISAgICAgIHBvc3RhZ2VmcmVlX2F0bGVhc3QgIOWFjemCrumXqOanmyBudW1iZXJcbiAgICAgICAgcGF5bWVudCDku5jmrL7nsbvlnosgZGljIFxuICAgICAgICBwdWJsaXNoZWQg5piv5ZCm5Y+R5biDIGJvb2xlYW5cbiAgICAgICAgY3JlYXRlVGltZSDliJvlu7rml7bpl7RcbiAgICAgICAgdXBkYXRlVGltZSDmm7TmlrDml7bpl7RcbiAgICAgICAgaXNDbG9zZWQ6IOaYr+WQpuW3sue7j+aJi+WKqOWFs+mXrVxuICAgICAgICBjYWxsTW9uZXlUaW1lczog5Y+R6LW35YKs5qy+5qyh5pWwXG4qISAgICAgIHR5cGU6IOexu+Wei++8jHN5c++8iOezu+e7n+iHquWKqOWPkei1t++8ieOAgXVuZGVmaW5lZO+8iOaJi+WKqOWIm+W7uu+8iVxuICovXG5leHBvcnQgY29uc3QgbWFpbiA9IGFzeW5jICggZXZlbnQsIGNvbnRleHQgKSA9PiB7XG5cbiAgICBjb25zdCBhcHAgPSBuZXcgVGNiUm91dGVyKHsgZXZlbnQgfSk7XG5cbiAgICAvKipcbiAgICAgKiAtLS0tLS0g6K+35rGCIC0tLS0tLS0tXG4gICAgICoge1xuICAgICAqICAgIHNob3VsZEdldEdvb2RzOiDpu5jorqR0cnVl77yM5Y+v5Lul5LiN5aGr77yM6I635Y+W6KGM56iL5o6o6I2Q5ZWG5ZOBXG4gICAgICogfVxuICAgICAqL1xuICAgIGFwcC5yb3V0ZXIoJ2VudGVyJywgYXN5bmMoIGN0eCwgbmV4dCApID0+IHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGNvbnN0IHNob3VsZEdldEdvb2RzID0gZXZlbnQuZGF0YSA/IGV2ZW50LmRhdGEuc2hvdWxkR2V0R29vZHMgOiB1bmRlZmluZWQ7XG5cbiAgICAgICAgICAgIC8vIOaMieW8gOWni+aXpeacn+ato+W6j++8jOiOt+WPluacgOWkmjLmnaEg5bey5Y+R5biD44CB5pyq57uT5p2f55qE6KGM56iLXG4gICAgICAgICAgICBjb25zdCBkYXRhJCA9IGF3YWl0IGRiLmNvbGxlY3Rpb24oJ3RyaXAnKVxuICAgICAgICAgICAgICAgIC53aGVyZSh7XG4gICAgICAgICAgICAgICAgICAgIGlzQ2xvc2VkOiBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgcHVibGlzaGVkOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICBlbmRfZGF0ZTogXy5ndCggZ2V0Tm93KCB0cnVlICkpXG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAubGltaXQoIDIgKVxuICAgICAgICAgICAgICAgIC5vcmRlckJ5KCdzdGFydF9kYXRlJywgJ2FzYycpXG4gICAgICAgICAgICAgICAgLmdldCggKTtcblxuICAgICAgICAgICAgbGV0IHRyaXBzID0gZGF0YSQuZGF0YTtcblxuICAgICAgICAgICAgLy8g5ouJ5Y+W5pyA5paw6KGM56iL55qE5o6o6I2Q5ZWG5ZOBXG4gICAgICAgICAgICBpZiAoKCAhIXRyaXBzWyAwIF0gJiYgc2hvdWxkR2V0R29vZHMgPT09IHVuZGVmaW5lZCApIHx8IHNob3VsZEdldEdvb2RzID09PSB0cnVlICkge1xuICAgICAgICAgICAgICAgIGNvbnN0IHRyaXBPbmVQcm9kdWN0cyQgPSBhd2FpdCBQcm9taXNlLmFsbCggdHJpcHNbIDAgXS5zZWxlY3RlZFByb2R1Y3RJZHMubWFwKCBwaWQgPT4ge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gY2xvdWQuY2FsbEZ1bmN0aW9uKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIF9pZDogcGlkLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJHVybDogJ2RldGFpbCdcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiAnZ29vZCdcbiAgICAgICAgICAgICAgICAgICAgfSkudGhlbiggcmVzID0+IHJlcy5yZXN1bHQuZGF0YSApO1xuICAgICAgICAgICAgICAgIH0pKTtcbiAgICAgICAgICAgICAgICB0cmlwc1sgMCBdID0gT2JqZWN0LmFzc2lnbih7IH0sIHRyaXBzWyAwIF0sIHtcbiAgICAgICAgICAgICAgICAgICAgcHJvZHVjdHM6IHRyaXBPbmVQcm9kdWN0cyRcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIGN0eC5ib2R5ID0ge1xuICAgICAgICAgICAgICAgIHN0YXR1czogMjAwLFxuICAgICAgICAgICAgICAgIGRhdGE6IHRyaXBzXG4gICAgICAgICAgICB9O1xuXG4gICAgICAgIH0gY2F0Y2ggKCBlICkge1xuICAgICAgICAgICAgcmV0dXJuIGN0eC5ib2R5ID0ge1xuICAgICAgICAgICAgICAgIHN0YXR1czogNTAwLFxuICAgICAgICAgICAgICAgIG1lc3NhZ2U6IGVcbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgIGFwcC5yb3V0ZXIoJ2xpc3QnLCBhc3luYyggY3R4LCBuZXh0ICkgPT4ge1xuICAgICAgICB0cnkge1xuXG4gICAgICAgICAgICAvLyDmn6Xor6LmnaHmlbBcbiAgICAgICAgICAgIGNvbnN0IGxpbWl0ID0gMjA7XG4gICAgICAgICAgICBjb25zdCBzZWFyY2gkID0gZXZlbnQuZGF0YS50aXRsZSB8fCAnJztcbiAgICAgICAgICAgIGNvbnN0IHNlYXJjaCA9IG5ldyBSZWdFeHAoIHNlYXJjaCQucmVwbGFjZSgvXFxzKy9nLCBcIlwiKSwgJ2knKTtcblxuICAgICAgICAgICAgLy8g6I635Y+W5oC75pWwXG4gICAgICAgICAgICBjb25zdCB0b3RhbCQgPSBhd2FpdCBkYi5jb2xsZWN0aW9uKCd0cmlwJylcbiAgICAgICAgICAgICAgICAud2hlcmUoe1xuICAgICAgICAgICAgICAgICAgICB0aXRsZTogc2VhcmNoXG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAuY291bnQoICk7XG5cbiAgICAgICAgICAgIC8vIOiOt+WPluaVsOaNrlxuICAgICAgICAgICAgY29uc3QgdHJpcHMkID0gYXdhaXQgZGIuY29sbGVjdGlvbigndHJpcCcpXG4gICAgICAgICAgICAgICAgLndoZXJlKHtcbiAgICAgICAgICAgICAgICAgICAgdGl0bGU6IHNlYXJjaFxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLmxpbWl0KCBsaW1pdCApXG4gICAgICAgICAgICAgICAgLnNraXAoKCBldmVudC5kYXRhLnBhZ2UgLSAxICkgKiBsaW1pdCApXG4gICAgICAgICAgICAgICAgLm9yZGVyQnkoJ3VwZGF0ZVRpbWUnLCAnZGVzYycpXG4gICAgICAgICAgICAgICAgLmdldCggKTtcblxuICAgICAgICAgICAgY29uc3QgbW9yZSA9IGF3YWl0IFByb21pc2UuYWxsKFxuICAgICAgICAgICAgICAgIHRyaXBzJC5kYXRhLm1hcCggYXN5bmMgdHJpcCA9PiB7XG5cbiAgICAgICAgICAgICAgICAgICAgLy8g6I635Y+W6KGM56iL55qE6LSt54mp5riF5Y2VXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHNsJCA9IGF3YWl0IGRiLmNvbGxlY3Rpb24oJ3Nob3BwaW5nLWxpc3QnKVxuICAgICAgICAgICAgICAgICAgICAgICAgLndoZXJlKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aWQ6IHRyaXAuX2lkXG4gICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAgICAgLmZpZWxkKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwaWQ6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb2lkczogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB1aWRzOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFkanVzdFByaWNlOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFkanVzdEdyb3VwUHJpY2U6IHRydWVcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgICAgICAuZ2V0KCApO1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBzbCA9IHNsJC5kYXRhO1xuXG4gICAgICAgICAgICAgICAgICAgIC8vIOe7n+iuoeaUtuebilxuICAgICAgICAgICAgICAgICAgICBjb25zdCBzbE9yZGVycyQgPSBhd2FpdCBQcm9taXNlLmFsbChcbiAgICAgICAgICAgICAgICAgICAgICAgIHNsLm1hcCggYXN5bmMgcyA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgeyBvaWRzIH0gPSBzO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IG9yZGVyczogYW55ID0gYXdhaXQgUHJvbWlzZS5hbGwoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9pZHMubWFwKCBhc3luYyBvID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IG9yZGVyJCA9IGF3YWl0IGRiLmNvbGxlY3Rpb24oJ29yZGVyJylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAuZG9jKCBTdHJpbmcoIG8gKSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAuZmllbGQoe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb3VudDogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYWxsb2NhdGVkQ291bnQ6IHRydWVcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5nZXQoICk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gb3JkZXIkLmRhdGE7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAuLi5zLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvcmRlcnNcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICApO1xuXG4gICAgICAgICAgICAgICAgICAgIC8vIOe7n+iuoeaUtuebilxuICAgICAgICAgICAgICAgICAgICBjb25zdCBpbmNvbWUgPSBzbE9yZGVycyQucmVkdWNlKCggc3VtLCBzbDogYW55ICkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgeyBvcmRlcnMsIHVpZHMsIGFkanVzdFByaWNlLCBhZGp1c3RHcm91cFByaWNlIH0gPSBzbDtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHNsSW5vbWUgPSBvcmRlcnMucmVkdWNlKCggbGFzdCwgb3JkZXIgKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgeyBhbGxvY2F0ZWRDb3VudCwgY291bnQgfSA9IG9yZGVyO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCBjb3VudF8gPSBhbGxvY2F0ZWRDb3VudCAhPT0gdW5kZWZpbmVkID8gYWxsb2NhdGVkQ291bnQgOiBjb3VudDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gbGFzdCArICggdWlkcy5sZW5ndGggPiAxID8gKCBhZGp1c3RHcm91cFByaWNlID8gYWRqdXN0R3JvdXBQcmljZSA6IGFkanVzdFByaWNlICkgOiBhZGp1c3RQcmljZSApICogY291bnRfO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSwgMCApO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHNsSW5vbWUgKyBzdW07XG4gICAgICAgICAgICAgICAgICAgIH0sIDAgKTtcblxuICAgICAgICAgICAgICAgICAgICBjb25zdCBvcmRlcnMkID0gYXdhaXQgZGIuY29sbGVjdGlvbignb3JkZXInKVxuICAgICAgICAgICAgICAgICAgICAgICAgLndoZXJlKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aWQ6IHRyaXAuX2lkLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBheV9zdGF0dXM6IF8uZXEoJzEnKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBiYXNlX3N0YXR1czogXy5vciggXy5lcSgnMCcpLF8uZXEoJzEnKSwgXy5lcSgnMicpLCBfLmVxKCczJykpXG4gICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAgICAgLmZpZWxkKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvcGVuaWQ6IHRydWVcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgICAgICAuZ2V0KCApO1xuXG4gICAgICAgICAgICAgICAgICAgIC8vIOacquS7mOasvuS5sOWutlxuICAgICAgICAgICAgICAgICAgICBjb25zdCBub3RQYXlBbGxDbGllbnRzID0gQXJyYXkuZnJvbShcbiAgICAgICAgICAgICAgICAgICAgICAgIG5ldyBTZXQoIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9yZGVycyQuZGF0YVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAubWFwKCB4ID0+IHgub3BlbmlkIClcbiAgICAgICAgICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgICAgICAgKS5sZW5ndGg7XG5cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG5vdFBheUFsbENsaWVudHMsXG4gICAgICAgICAgICAgICAgICAgICAgICBzYWxlc192b2x1bWU6IGluY29tZVxuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgKTtcblxuICAgICAgICAgICAgY29uc3QgaW5qZWN0ID0gdHJpcHMkLmRhdGEubWFwKCggdHJpcCwga2V5ICkgPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgICAgIC4uLnRyaXAsXG4gICAgICAgICAgICAgICAgICAgIC4uLm1vcmVbIGtleSBdXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgcmV0dXJuIGN0eC5ib2R5ID0ge1xuICAgICAgICAgICAgICAgIHN0YXR1czogMjAwLFxuICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgc2VhcmNoOiBldmVudC5kYXRhLnRpdGxlLnJlcGxhY2UoL1xccysvZywgJycpLFxuICAgICAgICAgICAgICAgICAgICBwYWdlU2l6ZTogbGltaXQsXG4gICAgICAgICAgICAgICAgICAgIHBhZ2U6IGV2ZW50LmRhdGEucGFnZSxcbiAgICAgICAgICAgICAgICAgICAgZGF0YTogaW5qZWN0LFxuICAgICAgICAgICAgICAgICAgICB0b3RhbDogdG90YWwkLnRvdGFsLFxuICAgICAgICAgICAgICAgICAgICB0b3RhbFBhZ2U6IE1hdGguY2VpbCggdG90YWwkLnRvdGFsIC8gbGltaXQgKVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgfSBjYXRjaCAoIGUgKSB7XG4gICAgICAgICAgICByZXR1cm4gY3R4LmJvZHkgPSB7XG4gICAgICAgICAgICAgICAgc3RhdHVzOiA1MDAsXG4gICAgICAgICAgICAgICAgbWVzc2FnZTogZVxuICAgICAgICAgICAgfTtcbiAgICAgICAgfSBcbiAgICB9KTtcbiAgICBcbiAgICAvKipcbiAgICAgKiBAZGVzY3JpcHRpb25cbiAgICAgKiDooYznqIvor6bmg4VcbiAgICAgKiB7XG4gICAgICogICAgICBtb3JlRGV0YWlsOiB1bmRlZmluZWQgfCBmYWxzZSB8IHRydWVcbiAgICAgKiB9XG4gICAgICovXG4gICAgYXBwLnJvdXRlcignZGV0YWlsJywgYXN5bmMoIGN0eCwgbmV4dCApID0+IHtcbiAgICAgICAgdHJ5IHtcblxuICAgICAgICAgICAgY29uc3QgeyBtb3JlRGV0YWlsIH0gPSBldmVudC5kYXRhO1xuICAgICAgICAgICAgY29uc3QgdGlkID0gZXZlbnQuZGF0YS5faWQgfHwgZXZlbnQuZGF0YS50aWQ7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIC8vIOiOt+WPluWfuuacrOivpuaDhVxuICAgICAgICAgICAgY29uc3QgZGF0YSQgPSBhd2FpdCBkYi5jb2xsZWN0aW9uKCd0cmlwJylcbiAgICAgICAgICAgICAgICAuZG9jKCB0aWQgKVxuICAgICAgICAgICAgICAgIC5nZXQoICk7XG4gICAgICAgICAgICBjb25zdCBtZXRhID0gZGF0YSQuZGF0YTtcblxuICAgICAgICAgICAgaWYgKCBtb3JlRGV0YWlsICE9PSBmYWxzZSApIHtcbiAgICAgICAgICAgICAgICAvLyDpgJrov4flt7LpgInnmoTllYblk4FpZHMs5ou/5Yiw5a+55bqU55qE5Zu+54mH44CBdGl0bGXjgIFfaWRcbiAgICAgICAgICAgICAgICBjb25zdCBwcm9kdWN0cyQ6IGFueSA9IGF3YWl0IFByb21pc2UuYWxsKCBtZXRhLnNlbGVjdGVkUHJvZHVjdElkcy5tYXAoIHBpZCA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBkYi5jb2xsZWN0aW9uKCdnb29kcycpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLndoZXJlKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgX2lkOiBwaWRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5maWVsZCh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGltZzogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGl0bGU6IHRydWVcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5nZXQoICk7XG4gICAgICAgICAgICAgICAgfSkpO1xuXG4gICAgICAgICAgICAgICAgbWV0YS5zZWxlY3RlZFByb2R1Y3RzID0gcHJvZHVjdHMkLm1hcCggeCA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB4LmRhdGFbIDAgXTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgbWV0YS5zZWxlY3RlZFByb2R1Y3RzID0gWyBdO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgXG4gICAgICAgICAgICBjb25zdCBjYW5FZGl0JCA9IGF3YWl0IGRiLmNvbGxlY3Rpb24oJ2NvdXBvbicpXG4gICAgICAgICAgICAgICAgLndoZXJlKHtcbiAgICAgICAgICAgICAgICAgICAgdGlkXG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAuY291bnQoICk7XG5cbiAgICAgICAgICAgIC8vIG1ldGEuY2FuRWRpdENvdXBvbnMgPSBjYW5FZGl0JC50b3RhbCA9PT0gMDtcbiAgICAgICAgICAgIC8vIOi/meS4queJiOacrOWPquaciSDnq4vlh49cbiAgICAgICAgICAgIG1ldGEuY2FuRWRpdENvdXBvbnMgPSB0cnVlO1xuXG4gICAgICAgICAgICByZXR1cm4gY3R4LmJvZHkgPSB7XG4gICAgICAgICAgICAgICAgc3RhdHVzOiAyMDAsXG4gICAgICAgICAgICAgICAgZGF0YTogbWV0YVxuICAgICAgICAgICAgfTtcblxuICAgICAgICB9IGNhdGNoKCBlICkge1xuICAgICAgICAgICAgcmV0dXJuIGN0eC5ib2R5ID0ge1xuICAgICAgICAgICAgICAgIHN0YXR1czogNTAwLFxuICAgICAgICAgICAgICAgIG1lc3NhZ2U6IGVcbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgIC8qKlxuICAgICAqIEBkZXNjcmlwdGlvblxuICAgICAqIOWIm+W7uiAvIOe8lui+keW9k+WJjeihjOeoi1xuICAgICAqL1xuICAgIGFwcC5yb3V0ZXIoJ2VkaXQnLCBhc3luYyggY3R4LCBuZXh0ICkgPT4ge1xuICAgICAgICB0cnkge1xuXG4gICAgICAgICAgICBsZXQgbGFzdFRyaXA6IGFueSA9IG51bGw7XG4gICAgICAgICAgICBsZXQgc3RhcnRfZGF0ZSA9IGdldE5vdyggdHJ1ZSApO1xuICAgICAgICAgICAgbGV0IF9pZCA9IGV2ZW50LmRhdGEuX2lkO1xuICAgICAgICAgICAgY29uc3QgdGlkID0gZXZlbnQuZGF0YS5faWQ7XG4gICAgICAgICAgICBjb25zdCB7IHB1Ymxpc2hlZCwgdGl0bGUsIHJlZHVjZV9wcmljZSB9ID0gZXZlbnQuZGF0YTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgY29uc3QgZ2V0RXJyID0gbWVzc2FnZSA9PiB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGN0eC5ib2R5ID0ge1xuICAgICAgICAgICAgICAgICAgICBzdGF0dXM6IDUwMCxcbiAgICAgICAgICAgICAgICAgICAgbWVzc2FnZVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIC8vIOihjOeoi+m7mOiupOWcqOW9k+WkqeaZmuS4ijIz54K557uT5p2fXG4gICAgICAgICAgICBjb25zdCBmaXhFbmREYXRlID0gZW5kRGF0ZSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3QgdCA9IG5ldyBEYXRlKCBlbmREYXRlICk7XG4gICAgICAgICAgICAgICAgY29uc3QgeSA9IHQuZ2V0RnVsbFllYXIoICk7XG4gICAgICAgICAgICAgICAgY29uc3QgbSA9IHQuZ2V0TW9udGgoICkgKyAxO1xuICAgICAgICAgICAgICAgIGNvbnN0IGQgPSB0LmdldERhdGUoICk7XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gbmV3IERhdGUoYCR7eX0vJHttfS8ke2R9IDIzOjAwOjAwYCkuZ2V0VGltZSggKTtcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIGNvbnN0IGVuZF9kYXRlID0gZml4RW5kRGF0ZSggTnVtYmVyKCBldmVudC5kYXRhLmVuZF9kYXRlICkpO1xuXG4gICAgICAgICAgICBpZiAoIHJlZHVjZV9wcmljZSA8IDEgKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGdldEVycign56uL5YeP6YeR6aKd5LiN6IO95bCR5LqOMeWFgycpXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIOWIm+W7uuihjOeoi1xuICAgICAgICAgICAgaWYgKCAhX2lkICkge1xuXG4gICAgICAgICAgICAgICAgY29uc3QgY291bnQkID0gYXdhaXQgZGIuY29sbGVjdGlvbigndHJpcCcpXG4gICAgICAgICAgICAgICAgICAgIC53aGVyZSh7XG4gICAgICAgICAgICAgICAgICAgICAgICBpc0Nsb3NlZDogZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgICAgICBwdWJsaXNoZWQ6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgIC5jb3VudCggKTtcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICBpZiAoIGNvdW50JC50b3RhbCApIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGdldEVycign5pyJ5pyq57uT5p2f6KGM56iLLOivt+e7k+adn+ihjOeoi+WQjuWGjeWIm+W7uicpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGNvbnN0IGNyZWF0ZURhdGEgPSB7XG4gICAgICAgICAgICAgICAgICAgIC4uLmV2ZW50LmRhdGEsXG4gICAgICAgICAgICAgICAgICAgIGVuZF9kYXRlLFxuICAgICAgICAgICAgICAgICAgICBzdGFydF9kYXRlOiBnZXROb3coIHRydWUgKSxcbiAgICAgICAgICAgICAgICAgICAgd2FybmluZzogZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgIGNhbGxNb25leVRpbWVzOiAwXG4gICAgICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgICAgIGNvbnN0IGNyZWF0ZSQgPSBhd2FpdCBkYi5jb2xsZWN0aW9uKCd0cmlwJylcbiAgICAgICAgICAgICAgICAgICAgLmFkZCh7XG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRhOiBjcmVhdGVEYXRhXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIF9pZCA9IGNyZWF0ZSQuX2lkO1xuICAgICAgICAgICAgLy8g57yW6L6R6KGM56iL44CB6KaG55uWc3lzVHJpcFxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICBcbiAgICAgICAgICAgICAgICBjb25zdCBvcmlnaW4kID0gYXdhaXQgZGIuY29sbGVjdGlvbigndHJpcCcpXG4gICAgICAgICAgICAgICAgICAgIC53aGVyZSh7XG4gICAgICAgICAgICAgICAgICAgICAgICBfaWRcbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgLmdldCggKTtcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICBjb25zdCBvcmlnaW4gPSBvcmlnaW4kLmRhdGFbIDAgXTtcbiAgICAgICAgICAgICAgICBjb25zdCBpc0Nsb3NlZCA9IGdldE5vdyggdHJ1ZSApID49IE51bWJlciggZW5kX2RhdGUgKTtcbiAgICBcbiAgICAgICAgICAgICAgICBkZWxldGUgb3JpZ2luWydfaWQnXTtcbiAgICAgICAgICAgICAgICBkZWxldGUgZXZlbnQuZGF0YVsnX2lkJ107XG4gICAgICAgICAgICAgICAgZGVsZXRlIGV2ZW50LmRhdGFbJ2NyZWF0ZVRpbWUnXTtcbiAgICAgICAgICAgICAgICBkZWxldGUgZXZlbnQuZGF0YVsnc2FsZXNfdm9sdW1lJ11cbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICBjb25zdCB0ZW1wID0gT2JqZWN0LmFzc2lnbih7IH0sIG9yaWdpbiwge1xuICAgICAgICAgICAgICAgICAgICAuLi5ldmVudC5kYXRhLFxuICAgICAgICAgICAgICAgICAgICBpc0Nsb3NlZCxcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogJ2N1c3RvbScsXG4gICAgICAgICAgICAgICAgICAgIGNhbGxNb25leVRpbWVzOiBlbmRfZGF0ZSA+IG9yaWdpblsnZW5kX2RhdGUnXSA/IDAgOiBvcmlnaW5bJ2NhbGxNb25leVRpbWVzJ11cbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgIGF3YWl0IGRiLmNvbGxlY3Rpb24oJ3RyaXAnKVxuICAgICAgICAgICAgICAgICAgICAuZG9jKCBfaWQgKVxuICAgICAgICAgICAgICAgICAgICAuc2V0KHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRhdGE6IHRlbXBcbiAgICAgICAgICAgICAgICAgICAgfSk7ICAgXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICog5o6o6YCBXG4gICAgICAgICAgICAgKiDliJvlu7rml7blgJnnmoTmjqjpgIFcbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgaWYgKCggIXRpZCAmJiBwdWJsaXNoZWQgKSkge1xuXG4gICAgICAgICAgICAgICAgY29uc3QgdGltZSA9IG5ldyBEYXRlKCBzdGFydF9kYXRlICk7XG5cbiAgICAgICAgICAgICAgICAvLyDmjqjpgIHku6PotK3pgJrnn6VcbiAgICAgICAgICAgICAgICBjb25zdCBtZW1iZXJzID0gYXdhaXQgZGIuY29sbGVjdGlvbignbWFuYWdlci1tZW1iZXInKVxuICAgICAgICAgICAgICAgICAgICAud2hlcmUoe1xuICAgICAgICAgICAgICAgICAgICAgICAgcHVzaDogdHJ1ZVxuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAuZ2V0KCApO1xuXG4gICAgICAgICAgICAgICAgYXdhaXQgUHJvbWlzZS5hbGwoXG4gICAgICAgICAgICAgICAgICAgIG1lbWJlcnMuZGF0YS5tYXAoIGFzeW5jIG1lbWJlciA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyA044CB6LCD55So5o6o6YCBXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBwdXNoJCA9IGF3YWl0IGNsb3VkLmNhbGxGdW5jdGlvbih7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogJ2NvbW1vbicsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAkdXJsOiAncHVzaC1zdWJzY3JpYmUtY2xvdWQnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvcGVuaWQ6IG1lbWJlci5vcGVuaWQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiAndHJpcCcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYWdlOiAncGFnZXMvbWFuYWdlci10cmlwLWxpc3QvaW5kZXgnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGV4dHM6IFtgJHt0aXRsZX1gLCBg5Luj6LSt6KGM56iL5o6o6YCB5Yiw5a6i5oi377yM5LiU5byA6YCa5LqG6K6i5Y2V5o6o6YCBYF1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICk7XG5cbiAgICAgICAgICAgICAgICAvLyDmjqjpgIHlrqLmiLfpgJrnn6VcbiAgICAgICAgICAgICAgICBjb25zdCB1c2VycyA9IGF3YWl0IGRiLmNvbGxlY3Rpb24oJ3VzZXInKVxuICAgICAgICAgICAgICAgICAgICAud2hlcmUoe1xuXG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgIC5nZXQoICk7XG5cbiAgICAgICAgICAgICAgICBhd2FpdCBQcm9taXNlLmFsbChcbiAgICAgICAgICAgICAgICAgICAgdXNlcnMuZGF0YVxuICAgICAgICAgICAgICAgICAgICAgICAgLmZpbHRlciggdXNlciA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuICFtZW1iZXJzLmRhdGEuZmluZCggbWVtYmVyID0+IG1lbWJlci5vcGVuaWQgPT09IHVzZXIub3BlbmlkIClcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgICAgICAubWFwKCBhc3luYyB1c2VyID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyA044CB6LCD55So5o6o6YCBXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgcHVzaCQgPSBhd2FpdCBjbG91ZC5jYWxsRnVuY3Rpb24oe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiAnY29tbW9uJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJHVybDogJ3B1c2gtc3Vic2NyaWJlLWNsb3VkJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvcGVuaWQ6IHVzZXIub3BlbmlkLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6ICd0cmlwJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYWdlOiAncGFnZXMvdHJpcC1lbnRlci9pbmRleCcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGV4dHM6IFtgJHt0aXRsZX1gLCBg5Luj6LSt5ZyoJHt0aW1lLmdldE1vbnRoKCApKzF95pyIJHt0aW1lLmdldERhdGUoICl95pel5byA5aeL77yB5peg6Zeo5qeb56uL5YePJHtyZWR1Y2VfcHJpY2V95YWD77yBYF1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICApO1xuXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiBjdHguYm9keSA9IHtcbiAgICAgICAgICAgICAgICBkYXRhOiBfaWQsXG4gICAgICAgICAgICAgICAgc3RhdHVzOiAyMDBcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgXG4gICAgICAgIH0gY2F0Y2goIGUgKSB7XG4gICAgICAgICAgICByZXR1cm4gY3R4LmJvZHkgPSB7XG4gICAgICAgICAgICAgICAgc3RhdHVzOiA1MDAsXG4gICAgICAgICAgICAgICAgbWVzc2FnZTogZVxuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgLyoqIFxuICAgICAqIEBkZXNjcmlwdGlvblxuICAgICAqIOiOt+WPluihjOeoi+W6leS4i+eahOWfuuacrOS4muWKoeaVsOaNrlxuICAgICAqIOmUgOWUruaAu+mineOAgVxuICAgICAqIOWuouaIt+aAu+aVsOOAgVxuICAgICAqIOacquS7mOWwvuasvuWuouaIt+aVsOmHj+OAgVxuICAgICAqIOaAu+iuouWNleaVsOOAgVxuICAgICAqIOihjOeoi+WQjeensOOAgVxuICAgICAqIOW3suWPkemAgeWCrOasvuasoeaVsFxuICAgICAqL1xuICAgIGFwcC5yb3V0ZXIoJ29yZGVyLWluZm8nLCBhc3luYyggY3R4LCBuZXh0ICkgPT4ge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgY29uc3QgeyB0aWQgfSA9IGV2ZW50LmRhdGE7XG5cbiAgICAgICAgICAgIC8qKiDooYznqIvor6bmg4UgKi9cbiAgICAgICAgICAgIGNvbnN0IHRyaXAkID0gYXdhaXQgZGIuY29sbGVjdGlvbigndHJpcCcpXG4gICAgICAgICAgICAgICAgLmRvYyggdGlkIClcbiAgICAgICAgICAgICAgICAuZ2V0KCApO1xuICAgICAgICBcbiAgICAgICAgICAgIC8vIOiOt+WPluihjOeoi+W6leS4i+aJgOacieeahOiuouWNlVxuICAgICAgICAgICAgY29uc3Qgb3JkZXJzJCA9IGF3YWl0IGRiLmNvbGxlY3Rpb24oJ29yZGVyJylcbiAgICAgICAgICAgICAgICAud2hlcmUoe1xuICAgICAgICAgICAgICAgICAgICB0aWQsXG4gICAgICAgICAgICAgICAgICAgIHBheV9zdGF0dXM6IF8ubmVxKCcwJylcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIC5nZXQoICk7XG5cbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICog5oC75pS255uKXG4gICAgICAgICAgICAgKiAh6Iez5bCR5bey5LuY6K6i6YeR77yM6Iez5bCR5bey57uP6LCD6IqC5ZSu5Lu344CB5pWw6YePXG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIGNvbnN0IHN1bSA9IG9yZGVycyQuZGF0YVxuICAgICAgICAgICAgICAgIC5maWx0ZXIoIHggPT4geC5wYXlfc3RhdHVzICE9PSAnMCcgJiZcbiAgICAgICAgICAgICAgICAgICAgKCggeC5iYXNlX3N0YXR1cyA9PT0gJzEnICkgfHwgKCB4LmJhc2Vfc3RhdHVzID09PSAnMicgKSB8fCAoIHguYmFzZV9zdGF0dXMgPT09ICczJyApKVxuICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgICAucmVkdWNlKCggeCwgeSApID0+IHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHggKyAoIHkuYWxsb2NhdGVkUHJpY2UgKiAoIHkuYWxsb2NhdGVkQ291bnQgfHwgMCApKTtcbiAgICAgICAgICAgICAgICB9LCAwICk7XG5cbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICog5oC75a6i5oi35pWw6YePXG4gICAgICAgICAgICAgKiAh6Iez5bCR5bey5LuY6K6i6YeRXG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIGNvbnN0IGNsaWVudHMgPSBBcnJheS5mcm9tKFxuICAgICAgICAgICAgICAgIG5ldyBTZXQoIG9yZGVycyQuZGF0YVxuICAgICAgICAgICAgICAgICAgICAuZmlsdGVyKCB4ID0+IHgucGF5X3N0YXR1cyAhPT0gJzAnIClcbiAgICAgICAgICAgICAgICAgICAgLm1hcCggeCA9PiB4Lm9wZW5pZCApXG4gICAgICAgICAgICApKS5sZW5ndGg7XG5cbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICog5oC75pyq5Lqk5bC+5qy+5a6i5oi35pWw6YePXG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIGNvbnN0IG5vdFBheUFsbENsaWVudHMgPSBBcnJheS5mcm9tKFxuICAgICAgICAgICAgICAgIG5ldyBTZXQoIG9yZGVycyQuZGF0YVxuICAgICAgICAgICAgICAgICAgICAuZmlsdGVyKCB4ID0+IHgucGF5X3N0YXR1cyA9PT0gJzEnIClcbiAgICAgICAgICAgICAgICAgICAgLm1hcCggeCA9PiB4Lm9wZW5pZCApXG4gICAgICAgICAgICApKS5sZW5ndGg7XG5cbiAgICAgICAgICAgIHJldHVybiBjdHguYm9keSA9IHtcbiAgICAgICAgICAgICAgICBzdGF0dXM6IDIwMCxcbiAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICAgIHN1bSwgLy8g6ZSA5ZSu5oC76aKdXG4gICAgICAgICAgICAgICAgICAgIGNsaWVudHMsIC8vIOWuouaIt+aAu+aVsFxuICAgICAgICAgICAgICAgICAgICBub3RQYXlBbGxDbGllbnRzLCAvLyDmnKrku5jlsL7mrL7lrqLmiLfmlbDph49cbiAgICAgICAgICAgICAgICAgICAgY291bnQ6IG9yZGVycyQuZGF0YS5sZW5ndGgsIC8vIOaAu+iuouWNleaVsCxcbiAgICAgICAgICAgICAgICAgICAgdGl0bGU6IHRyaXAkLmRhdGEudGl0bGUsIC8vIOihjOeoi+WQjeensFxuICAgICAgICAgICAgICAgICAgICBjYWxsTW9uZXlUaW1lczogdHJpcCQuZGF0YS5jYWxsTW9uZXlUaW1lcyAvLyDlt7Llj5HpgIHlgqzmrL7mrKHmlbBcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgIH0gY2F0Y2ggKCBlICkgeyByZXR1cm4gY3R4LmJvZHkgPSB7IHN0YXR1czogNTAwIH07fVxuICAgIH0pXG5cbiAgICAvKipcbiAgICAgKiBAQGRlc2NyaXB0aW9uXG4gICAgICog5pu05paw6KGM56iL5bqV5LiL55qE5b+r6YCS5Zu+5YaMXG4gICAgICovXG4gICAgYXBwLnJvdXRlcigndXBkYXRlLWRlbGl2ZXInLCBhc3luYyggY3R4LCBuZXh0ICkgPT4ge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgY29uc3QgeyB0aWQsIGltZ3MgfSA9IGV2ZW50LmRhdGE7XG4gICAgICAgICAgICBjb25zdCB0YXJnZXQgPSBhd2FpdCBkYi5jb2xsZWN0aW9uKCdkZWxpdmVyJylcbiAgICAgICAgICAgICAgICAud2hlcmUoe1xuICAgICAgICAgICAgICAgICAgICB0aWQsXG4gICAgICAgICAgICAgICAgICAgIHR5cGU6ICdkZWxpdmVyLWltZydcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIC5nZXQoICk7XG5cbiAgICAgICAgICAgIC8vIOWIm+W7ulxuICAgICAgICAgICAgaWYgKCAhdGFyZ2V0LmRhdGFbIDAgXSkge1xuICAgICAgICAgICAgICAgIGF3YWl0IGRiLmNvbGxlY3Rpb24oJ2RlbGl2ZXInKVxuICAgICAgICAgICAgICAgICAgICAuYWRkKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aWQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaW1ncyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiAnZGVsaXZlci1pbWcnXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgLy8g5pu05pawXG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGF3YWl0IGRiLmNvbGxlY3Rpb24oJ2RlbGl2ZXInKVxuICAgICAgICAgICAgICAgICAgICAuZG9jKCBTdHJpbmcoIHRhcmdldC5kYXRhWyAwIF0uX2lkKSlcbiAgICAgICAgICAgICAgICAgICAgLnVwZGF0ZSh7XG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaW1nc1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gY3R4LmJvZHkgPSB7IHN0YXR1czogMjAwIH07XG4gICAgICAgICAgICBcbiAgICAgICAgfSBjYXRjaCAoIGUgKSB7IHJldHVybiBjdHguYm9keSA9IHsgc3RhdHVzOiA1MDAgfX1cbiAgICB9KVxuXG4gICAgLyoqXG4gICAgICogQEBkZXNjcmlwdGlvblxuICAgICAqIOiOt+WPluihjOeoi+W6leS4i+eahOW/q+mAkuWbvuWGjFxuICAgICAqL1xuICAgIGFwcC5yb3V0ZXIoJ2RlbGl2ZXInLCBhc3luYyggY3R4LCBuZXh0ICkgPT4ge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgY29uc3QgeyB0aWQgfSA9IGV2ZW50LmRhdGE7XG4gICAgICAgICAgICBjb25zdCB0YXJnZXQgPSBhd2FpdCBkYi5jb2xsZWN0aW9uKCdkZWxpdmVyJylcbiAgICAgICAgICAgICAgICAud2hlcmUoe1xuICAgICAgICAgICAgICAgICAgICB0aWQsXG4gICAgICAgICAgICAgICAgICAgIHR5cGU6ICdkZWxpdmVyLWltZydcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIC5nZXQoICk7XG5cbiAgICAgICAgICAgIHJldHVybiBjdHguYm9keSA9IHsgXG4gICAgICAgICAgICAgICAgc3RhdHVzOiAyMDAsXG4gICAgICAgICAgICAgICAgZGF0YTogdGFyZ2V0LmRhdGFbIDAgXSA/IHRhcmdldC5kYXRhWyAwIF0uaW1ncyA6IFsgXVxuICAgICAgICAgICAgfVxuXG4gICAgICAgIH0gY2F0Y2ggKCBlICkge1xuICAgICAgICAgICAgcmV0dXJuIGN0eC5ib2R5ID0geyBzdGF0dXM6IDUwMCB9O1xuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICAvKipcbiAgICAgKiBAZGVzY3JpcHRpb25cbiAgICAgKiDmiYvliqjlhbPpl63lvZPliY3ooYznqItcbiAgICAgKiB7XG4gICAgICogICAgdGlkXG4gICAgICogfVxuICAgICAqL1xuICAgIGFwcC5yb3V0ZXIoJ2Nsb3NlJywgYXN5bmMoIGN0eCwgbmV4dCApID0+IHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGNvbnN0IHsgdGlkIH0gPSBldmVudC5kYXRhO1xuXG4gICAgICAgICAgICAvLyDmm7TmlrDooYznqItjbG9zZeWtl+autVxuICAgICAgICAgICAgYXdhaXQgZGIuY29sbGVjdGlvbigndHJpcCcpXG4gICAgICAgICAgICAgICAgLmRvYyggU3RyaW5nKCB0aWQgKSlcbiAgICAgICAgICAgICAgICAudXBkYXRlKHtcbiAgICAgICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgICAgICAgaXNDbG9zZWQ6IHRydWVcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICAvLyDmiYvliqjlj5bmtojooYznqIvml7bvvIzmiorlvoXmlK/ku5jorqLljZXorr7kuLrlj5bmtohcbiAgICAgICAgICAgIGNvbnN0IG9yZGVycyQgPSBhd2FpdCBkYi5jb2xsZWN0aW9uKCdvcmRlcicpXG4gICAgICAgICAgICAgICAgLndoZXJlKHtcbiAgICAgICAgICAgICAgICAgICAgdGlkLFxuICAgICAgICAgICAgICAgICAgICBwYXlfc3RhdHVzOiAnMCcsXG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAuZ2V0KCApO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICBhd2FpdCBQcm9taXNlLmFsbCggb3JkZXJzJC5kYXRhLm1hcCggb3JkZXIkID0+IHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZGIuY29sbGVjdGlvbignb3JkZXInKVxuICAgICAgICAgICAgICAgICAgICAuZG9jKCBTdHJpbmcoIG9yZGVyJC5faWQgKSlcbiAgICAgICAgICAgICAgICAgICAgLnVwZGF0ZSh7XG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYmFzZV9zdGF0dXM6ICc1J1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgfSkpO1xuXG4gICAgICAgICAgICBjb25zdCB0cmlwJCA9IGF3YWl0IGRiLmNvbGxlY3Rpb24oJ3RyaXAnKVxuICAgICAgICAgICAgICAgIC5kb2MoIHRpZCApXG4gICAgICAgICAgICAgICAgLmdldCggKTtcblxuICAgICAgICAgICAgLy8g5o6o6YCB5Luj6LSt6YCa55+lXG4gICAgICAgICAgICBjb25zdCBtZW1iZXJzID0gYXdhaXQgZGIuY29sbGVjdGlvbignbWFuYWdlci1tZW1iZXInKVxuICAgICAgICAgICAgICAgIC53aGVyZSh7XG4gICAgICAgICAgICAgICAgICAgIHB1c2g6IHRydWVcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIC5nZXQoICk7XG4gICAgICAgIFxuICAgICAgICAgICAgYXdhaXQgUHJvbWlzZS5hbGwoXG4gICAgICAgICAgICAgICAgbWVtYmVycy5kYXRhLm1hcCggYXN5bmMgbWVtYmVyID0+IHtcblxuICAgICAgICAgICAgICAgICAgICAvLyA044CB6LCD55So5o6o6YCBXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHB1c2gxJCA9IGF3YWl0IGNsb3VkLmNhbGxGdW5jdGlvbih7XG4gICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiAnY29tbW9uJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkdXJsOiAncHVzaC1zdWJzY3JpYmUtY2xvdWQnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb3BlbmlkOiBtZW1iZXIub3BlbmlkLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiAnZ2V0TW9uZXknLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYWdlOiBgcGFnZXMvbWFuYWdlci10cmlwLW9yZGVyL2luZGV4P2lkPSR7dGlkfSZhYz0kezF9YCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGV4dHM6IFtgJHt0cmlwJC5kYXRhLnRpdGxlfWAsIGDlhbPpl63miJDlip/vvIHkuIDplK7mlLbmrL7lip/og73lt7LlvIDlkK9gXVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICAgICAgY29uc3QgcHVzaDIkID0gYXdhaXQgY2xvdWQuY2FsbEZ1bmN0aW9uKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6ICd0cmlwJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkdXJsOiAnY2xvc2UtdHJpcC1hbmFseXplJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRpZFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgKTtcblxuICAgICAgICAgICAgcmV0dXJuIGN0eC5ib2R5ID0geyBzdGF0dXM6IDIwMCB9O1xuXG4gICAgICAgIH0gY2F0Y2ggKCBlICkge1xuICAgICAgICAgICAgcmV0dXJuIGN0eC5ib2R5ID0geyBzdGF0dXM6IDUwMCB9O1xuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICAvKipcbiAgICAgKiBAZGVzY3JpcHRpb25cbiAgICAgKiDmiYvliqgv6Ieq5Yqo5YWz6Zet6KGM56iL55qE5pe25YCZ77yM5Y+R6YCB5pW05Liq6KGM56iL55qE6L+Q6JCl5pWw5o2u57uZYWRtXG4gICAgICovXG4gICAgYXBwLnJvdXRlcignY2xvc2UtdHJpcC1hbmFseXplJywgYXN5bmMoIGN0eCwgbmV4dCApID0+IHtcbiAgICAgICAgdHJ5IHtcblxuICAgICAgICAgICAgLy8g5pS255uKXG4gICAgICAgICAgICBsZXQgaW5jb21lID0gMDtcbiAgICAgICAgICAgIC8vIOaIkOWKn+S4i+WNleeahOWVhuWTgVxuICAgICAgICAgICAgbGV0IHBpbkdvb2RzTnVtID0gMDtcbiAgICAgICAgICAgIC8vIOiiq+afpeeci+eahOWVhuWTgVxuICAgICAgICAgICAgbGV0IHZpc2l0R29vZHNOdW0gPSAwO1xuICAgICAgICAgICAgLy8g6KGM56iL5aSp5pWwXG4gICAgICAgICAgICBsZXQgZGF5c051bSA9IDA7XG4gICAgICAgICAgICAvLyDmtY/op4jph49cbiAgICAgICAgICAgIGxldCB2aXNpdE51bSA9IDA7XG4gICAgICAgICAgICAvLyDmtY/op4jkurrmlbBcbiAgICAgICAgICAgIGxldCB2aXNpdG9yTnVtID0gMDtcbiAgICAgICAgICAgIC8vIOaIkOWKn+aLvOWbouS6uuaVsFxuICAgICAgICAgICAgbGV0IHBpbk51bSA9IDA7XG4gICAgXG4gICAgICAgICAgICBjb25zdCB7IHRpZCB9ID0gZXZlbnQuZGF0YTtcblxuICAgICAgICAgICAgLy8g6I635Y+W6KGM56iL6K+m5oOFXG4gICAgICAgICAgICBjb25zdCB0cmlwJCA9IGF3YWl0IGRiLmNvbGxlY3Rpb24oJ3RyaXAnKVxuICAgICAgICAgICAgICAgIC5kb2MoIFN0cmluZyggdGlkICkpXG4gICAgICAgICAgICAgICAgLmZpZWxkKHtcbiAgICAgICAgICAgICAgICAgICAgZW5kX2RhdGU6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgIHN0YXJ0X2RhdGU6IHRydWVcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIC5nZXQoIClcbiAgICAgICAgICAgIGNvbnN0IHRyaXAgPSB0cmlwJC5kYXRhO1xuXG4gICAgICAgICAgICAvLyDojrflj5booYznqIvnmoTmtY/op4jph49cbiAgICAgICAgICAgIGNvbnN0IHZpc2l0UmVjb3JkcyQgPSBhd2FpdCBkYi5jb2xsZWN0aW9uKCdnb29kLXZpc2l0aW5nLXJlY29yZCcpXG4gICAgICAgICAgICAgICAgLndoZXJlKHtcbiAgICAgICAgICAgICAgICAgICAgdmlzaXRUaW1lOiBfLmd0ZSggdHJpcC5zdGFydF9kYXRlIClcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIC5nZXQoICk7XG4gICAgICAgICAgICBjb25zdCB2aXNpdFJlY29yZHMgPSB2aXNpdFJlY29yZHMkLmRhdGE7XG5cbiAgICAgICAgICAgIC8vIOiOt+WPluihjOeoi+eahOi0reeJqea4heWNlVxuICAgICAgICAgICAgY29uc3Qgc2wkID0gYXdhaXQgZGIuY29sbGVjdGlvbignc2hvcHBpbmctbGlzdCcpXG4gICAgICAgICAgICAgICAgLndoZXJlKHtcbiAgICAgICAgICAgICAgICAgICAgdGlkXG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAuZmllbGQoe1xuICAgICAgICAgICAgICAgICAgICBwaWQ6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgIG9pZHM6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgIHVpZHM6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgIGFkanVzdFByaWNlOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICBhZGp1c3RHcm91cFByaWNlOiB0cnVlXG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAuZ2V0KCApO1xuICAgICAgICAgICAgY29uc3Qgc2wgPSBzbCQuZGF0YTtcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgIC8vIOe7n+iuoeaUtuebilxuICAgICAgICAgICAgY29uc3Qgc2xPcmRlcnMkID0gYXdhaXQgUHJvbWlzZS5hbGwoXG4gICAgICAgICAgICAgICAgc2wubWFwKCBhc3luYyBzID0+IHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgeyBvaWRzIH0gPSBzO1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBvcmRlcnM6IGFueSA9IGF3YWl0IFByb21pc2UuYWxsKFxuICAgICAgICAgICAgICAgICAgICAgICAgb2lkcy5tYXAoIGFzeW5jIG8gPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IG9yZGVyJCA9IGF3YWl0IGRiLmNvbGxlY3Rpb24oJ29yZGVyJylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLmRvYyggU3RyaW5nKCBvICkpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5maWVsZCh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb3VudDogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFsbG9jYXRlZENvdW50OiB0cnVlXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5nZXQoICk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG9yZGVyJC5kYXRhO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC4uLnMsXG4gICAgICAgICAgICAgICAgICAgICAgICBvcmRlcnNcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICApO1xuICAgICAgICBcbiAgICAgICAgICAgIC8vIOe7n+iuoeaUtuebilxuICAgICAgICAgICAgaW5jb21lID0gc2xPcmRlcnMkLnJlZHVjZSgoIHN1bSwgc2w6IGFueSApID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCB7IG9yZGVycywgdWlkcywgYWRqdXN0UHJpY2UsIGFkanVzdEdyb3VwUHJpY2UgfSA9IHNsO1xuICAgICAgICAgICAgICAgIGNvbnN0IHNsSW5vbWUgPSBvcmRlcnMucmVkdWNlKCggbGFzdCwgb3JkZXIgKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHsgYWxsb2NhdGVkQ291bnQsIGNvdW50IH0gPSBvcmRlcjtcbiAgICAgICAgICAgICAgICAgICAgbGV0IGNvdW50XyA9IGFsbG9jYXRlZENvdW50ICE9PSB1bmRlZmluZWQgPyBhbGxvY2F0ZWRDb3VudCA6IGNvdW50O1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gbGFzdCArICggdWlkcy5sZW5ndGggPiAxID8gKCBhZGp1c3RHcm91cFByaWNlID8gYWRqdXN0R3JvdXBQcmljZSA6IGFkanVzdFByaWNlICkgOiBhZGp1c3RQcmljZSApICogY291bnRfO1xuICAgICAgICAgICAgICAgIH0sIDAgKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gc2xJbm9tZSArIHN1bTtcbiAgICAgICAgICAgIH0sIDAgKTtcblxuICAgICAgICAgICAgLy8g57uf6K6h5oiQ5Yqf5ou85ZuiXG4gICAgICAgICAgICBsZXQgc2xPcGVuaWRzOiBzdHJpbmdbIF0gPSBbIF07XG4gICAgICAgICAgICBzbC5tYXAoIHMgPT4ge1xuICAgICAgICAgICAgICAgIHNsT3BlbmlkcyA9IFsgLi4uc2xPcGVuaWRzLCAuLi5zLnVpZHMgXVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBwaW5OdW0gPSBBcnJheS5mcm9tKFxuICAgICAgICAgICAgICAgIG5ldyBTZXQoIHNsT3BlbmlkcyApXG4gICAgICAgICAgICApLmxlbmd0aDtcblxuICAgICAgICAgICAgLy8g57uf6K6h5oiQ5Yqf5LiL5Y2V55qE5Lqn5ZOBXG4gICAgICAgICAgICBwaW5Hb29kc051bSA9IHNsLmxlbmd0aDtcblxuICAgICAgICAgICAgLy8g57uf6K6h5p+l55yL55qE5pWw5o2uXG4gICAgICAgICAgICBsZXQgZ29vZElkczogc3RyaW5nWyBdID0gWyBdO1xuICAgICAgICAgICAgbGV0IHZpc2l0T3Blbmlkczogc3RyaW5nWyBdID0gWyBdO1xuXG4gICAgICAgICAgICB2aXNpdFJlY29yZHMubWFwKCB2ID0+IHtcbiAgICAgICAgICAgICAgICBnb29kSWRzID0gWyAuLi5nb29kSWRzLCB2LnBpZCBdXG4gICAgICAgICAgICAgICAgdmlzaXRPcGVuaWRzID0gWyAuLi52aXNpdE9wZW5pZHMsIHYub3BlbmlkIF1cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICB2aXNpdEdvb2RzTnVtID0gQXJyYXkuZnJvbShcbiAgICAgICAgICAgICAgICBuZXcgU2V0KCBnb29kSWRzIClcbiAgICAgICAgICAgICkubGVuZ3RoO1xuXG4gICAgICAgICAgICB2aXNpdG9yTnVtID0gQXJyYXkuZnJvbShcbiAgICAgICAgICAgICAgICBuZXcgU2V0KCB2aXNpdE9wZW5pZHMgKVxuICAgICAgICAgICAgKS5sZW5ndGg7XG5cbiAgICAgICAgICAgIC8vIOaMieS6uuWdh+avj+asvuWVhuWTgemDveaJk+W8gDPmrKHorqHnrpdcbiAgICAgICAgICAgIHZpc2l0TnVtID0gdmlzaXRvck51bSAqIHZpc2l0R29vZHNOdW0gKiAzO1xuXG4gICAgICAgICAgICAvLyDnu5/orqHlpKnmlbBcbiAgICAgICAgICAgIGRheXNOdW0gPSBNYXRoLmNlaWwoKCB0cmlwLmVuZF9kYXRlIC0gdHJpcC5zdGFydF9kYXRlICkgLyAoIDI0ICogNjAgKiA2MCAqIDEwMDApKVxuXG4gICAgICAgICAgICBjb25zdCB0ZXh0MSA9IGAke2RheXNOdW195aSp5YaF77yMYDtcbiAgICAgICAgICAgIGNvbnN0IHRleHQyID0gYCR7dmlzaXRHb29kc051bX3ku7bllYblk4Hooqske3Zpc2l0b3JOdW195Lq65Zu06KeCJHt2aXNpdE51bX3mrKFgO1xuICAgICAgICAgICAgY29uc3QgdGV4dHMgPSBbXG4gICAgICAgICAgICAgICAgYOaUtuebiiR7aW5jb21lfeWFg++8jCR7cGluTnVtfeS6uuaLvOWboiR7cGluR29vZHNOdW195Lu25ZWG5ZOBYCxcbiAgICAgICAgICAgICAgICAodGV4dDEgKyB0ZXh0MikubGVuZ3RoID4gMjAgPyB0ZXh0MiA6IHRleHQxICsgdGV4dDJcbiAgICAgICAgICAgIF07XG5cbiAgICAgICAgICAgIC8vIOiOt+WPluaJgOacieeuoeeQhuWRmFxuICAgICAgICAgICAgY29uc3QgYWRtcyQgPSBhd2FpdCBkYi5jb2xsZWN0aW9uKCdtYW5hZ2VyLW1lbWJlcicpXG4gICAgICAgICAgICAgICAgLndoZXJlKHsgfSlcbiAgICAgICAgICAgICAgICAuZ2V0KCApO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICAvLyDmjqjpgIFcbiAgICAgICAgICAgIGF3YWl0IFByb21pc2UuYWxsKFxuICAgICAgICAgICAgICAgIGFkbXMkLmRhdGEubWFwKCBhc3luYyBhZG0gPT4ge1xuICAgICAgICAgICAgICAgICAgICBhd2FpdCBjbG91ZC5jYWxsRnVuY3Rpb24oe1xuICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogJ2NvbW1vbicsXG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJHVybDogJ3B1c2gtc3Vic2NyaWJlLWNsb3VkJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9wZW5pZDogYWRtLm9wZW5pZCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogJ3dhaXRQaW4nLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYWdlOiBgcGFnZXMvbWFuYWdlci10cmlwLWxpc3QvaW5kZXhgLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZXh0c1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgKTtcblxuICAgICAgICAgICAgcmV0dXJuIGN0eC5ib2R5ID0ge1xuICAgICAgICAgICAgICAgIHN0YXR1czogMjAwLFxuICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgdGV4dHMsXG4gICAgICAgICAgICAgICAgICAgIHBpbk51bSxcbiAgICAgICAgICAgICAgICAgICAgaW5jb21lLFxuICAgICAgICAgICAgICAgICAgICBwaW5Hb29kc051bSxcbiAgICAgICAgICAgICAgICAgICAgdmlzaXRvck51bSxcbiAgICAgICAgICAgICAgICAgICAgdmlzaXRHb29kc051bSxcbiAgICAgICAgICAgICAgICAgICAgdmlzaXROdW0sXG4gICAgICAgICAgICAgICAgICAgIGRheXNOdW0sXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgXG4gICAgICAgIH0gY2F0Y2ggKCBlICkge1xuICAgICAgICAgICAgY29uc29sZS5sb2coJz8/Pz8nLCBlIClcbiAgICAgICAgICAgIHJldHVybiBjdHguYm9keSA9IHtcbiAgICAgICAgICAgICAgICBzdGF0dXM6IDUwMCxcbiAgICAgICAgICAgICAgICBtZXNzYWdlOiBlXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9KVxuXG4gICAgcmV0dXJuIGFwcC5zZXJ2ZSggKTtcblxufSJdfQ==