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
            var limit, search$, search, total$, data$, orders$_1, injectOrderCount_1, salesVolume$, injectSalesVolume, e_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 5, , 6]);
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
                        data$ = _a.sent();
                        return [4, Promise.all(data$.data.map(function (x) {
                                return db.collection('order')
                                    .where({
                                    tid: x._id,
                                    pay_status: _.neq('0')
                                })
                                    .count();
                            }))];
                    case 3:
                        orders$_1 = _a.sent();
                        injectOrderCount_1 = data$.data.map(function (x, k) {
                            return Object.assign({}, x, {
                                orders: orders$_1[k].total
                            });
                        });
                        return [4, Promise.all(injectOrderCount_1.map(function (x) {
                                return db.collection('order')
                                    .where({
                                    tid: x._id,
                                    pay_status: _.neq('0'),
                                    base_status: _.or(_.eq('0'), _.eq('1'), _.eq('2'), _.eq('3'))
                                })
                                    .get();
                            }))];
                    case 4:
                        salesVolume$ = _a.sent();
                        injectSalesVolume = salesVolume$.map(function (o, k) {
                            var salesVolume = o.data
                                .filter(function (x) { return x.pay_status !== '0' &&
                                ((x.base_status === '1') || (x.base_status === '2') || (x.base_status === '3')); })
                                .reduce(function (x, y) {
                                return x + (y.allocatedPrice * (y.allocatedCount || 0));
                            }, 0);
                            var clients = Array.from(new Set(o.data
                                .filter(function (x) {
                                return x.pay_status !== '0' &&
                                    x.base_status !== '4' &&
                                    x.base_status !== '5';
                            })
                                .map(function (x) { return x.openid; }))).length;
                            var notPayAllClients = Array.from(new Set(o.data
                                .filter(function (x) { return x.pay_status === '1'; })
                                .map(function (x) { return x.openid; }))).length;
                            return Object.assign({}, injectOrderCount_1[k], {
                                clients: clients,
                                notPayAllClients: notPayAllClients,
                                sales_volume: salesVolume
                            });
                        });
                        return [2, ctx.body = {
                                status: 200,
                                data: {
                                    search: event.data.title.replace(/\s+/g, ''),
                                    pageSize: limit,
                                    page: event.data.page,
                                    data: injectSalesVolume,
                                    total: total$.total,
                                    totalPage: Math.ceil(total$.total / limit)
                                }
                            }];
                    case 5:
                        e_2 = _a.sent();
                        return [2, ctx.body = {
                                status: 500,
                                message: e_2
                            }];
                    case 6: return [2];
                }
            });
        }); });
        app.router('detail', function (ctx, next) { return __awaiter(_this, void 0, void 0, function () {
            var moreDetail, data$, meta, products$, e_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 5, , 6]);
                        moreDetail = event.data.moreDetail;
                        return [4, db.collection('trip')
                                .where({
                                _id: event.data._id || event.data.tid
                            })
                                .get()];
                    case 1:
                        data$ = _a.sent();
                        meta = data$.data[0];
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
                    case 4: return [2, ctx.body = {
                            status: 200,
                            data: data$.data[0]
                        }];
                    case 5:
                        e_3 = _a.sent();
                        return [2, ctx.body = {
                                status: 500,
                                message: e_3
                            }];
                    case 6: return [2];
                }
            });
        }); });
        app.router('edit', function (ctx, next) { return __awaiter(_this, void 0, void 0, function () {
            var trip, _id, tid, _a, published, title_1, start_date, end_date, reduce_price_1, getErr, where$, rule1$, result$, create$, origin$, origin, temp, time_1, members_1, users, e_4;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 15, , 16]);
                        trip = null;
                        _id = event.data._id;
                        tid = event.data._id;
                        _a = event.data, published = _a.published, title_1 = _a.title, start_date = _a.start_date, end_date = _a.end_date, reduce_price_1 = _a.reduce_price;
                        getErr = function (message) {
                            return ctx.body = {
                                status: 500,
                                message: message
                            };
                        };
                        if (!published) return [3, 2];
                        where$ = {
                            isClosed: false,
                            start_date: _.lt(getNow(true)),
                            end_date: _.gte(event.data.start_date)
                        };
                        if (!!tid) {
                            where$ = Object.assign({}, where$, {
                                _id: _.neq(tid)
                            });
                        }
                        return [4, db.collection('trip')
                                .where(where$)
                                .count()];
                    case 1:
                        rule1$ = _b.sent();
                        if (rule1$.total > 0) {
                            return [2, getErr('开始时间必须大于上趟行程的结束时间')];
                        }
                        _b.label = 2;
                    case 2:
                        if (start_date >= end_date) {
                            return [2, getErr('开始时间必须大于结束时间')];
                        }
                        if (!!!_id) return [3, 4];
                        return [4, db.collection('trip')
                                .doc(_id)
                                .get()];
                    case 3:
                        result$ = _b.sent();
                        trip = result$.data;
                        _b.label = 4;
                    case 4:
                        if (!!_id) return [3, 6];
                        return [4, db.collection('trip')
                                .add({
                                data: Object.assign({}, event.data, {
                                    callMoneyTimes: 0
                                })
                            })];
                    case 5:
                        create$ = _b.sent();
                        _id = create$._id;
                        return [3, 9];
                    case 6: return [4, db.collection('trip')
                            .where({
                            _id: _id
                        })
                            .get()];
                    case 7:
                        origin$ = _b.sent();
                        origin = origin$.data[0];
                        delete origin['_id'];
                        delete event.data['_id'];
                        delete event.data['sales_volume'];
                        temp = Object.assign({}, origin, __assign({}, event.data, { callMoneyTimes: event.data['end_date'] > origin['end_date'] ? 0 : origin['callMoneyTimes'], isClosed: getNow(true) >= Number(end_date) }));
                        return [4, db.collection('trip')
                                .doc(_id)
                                .set({
                                data: temp
                            })];
                    case 8:
                        _b.sent();
                        _b.label = 9;
                    case 9:
                        if (!((!tid && published) || (!!trip && !trip.published && !!published))) return [3, 14];
                        time_1 = new Date(start_date);
                        return [4, db.collection('manager-member')
                                .where({
                                push: true
                            })
                                .get()];
                    case 10:
                        members_1 = _b.sent();
                        return [4, Promise.all(members_1.data.map(function (member) { return __awaiter(_this, void 0, void 0, function () {
                                var push$;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4, cloud.callFunction({
                                                name: 'common',
                                                data: {
                                                    $url: 'push-template-cloud',
                                                    data: {
                                                        openid: member.openid,
                                                        type: 'trip',
                                                        page: 'pages/manager-trip-list/index',
                                                        texts: ["" + title_1, "\u65B0\u884C\u7A0B\u5DF2\u63A8\u9001\u5BA2\u6237,\u4E3A\u4F60\u5F00\u901A\u4E86\u8BA2\u5355\u63A8\u9001"]
                                                    }
                                                }
                                            })];
                                        case 1:
                                            push$ = _a.sent();
                                            return [2];
                                    }
                                });
                            }); }))];
                    case 11:
                        _b.sent();
                        return [4, db.collection('user')
                                .where({})
                                .get()];
                    case 12:
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
                                                    $url: 'push-template-cloud',
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
                    case 13:
                        _b.sent();
                        _b.label = 14;
                    case 14: return [2, ctx.body = {
                            data: _id,
                            status: 200
                        }];
                    case 15:
                        e_4 = _b.sent();
                        return [2, ctx.body = {
                                status: 500,
                                message: e_4
                            }];
                    case 16: return [2];
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
                                var push$;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4, cloud.callFunction({
                                                name: 'common',
                                                data: {
                                                    $url: 'push-template-cloud',
                                                    data: {
                                                        openid: member.openid,
                                                        type: 'trip',
                                                        page: "pages/manager-trip-order/index?id=" + tid_1 + "&ac=" + 1,
                                                        texts: ["" + trip$_1.data.title, "\u5173\u95ED\u6210\u529F\uFF01\u4E00\u952E\u6536\u6B3E\u529F\u80FD\u5DF2\u5F00\u542F"]
                                                    }
                                                }
                                            })];
                                        case 1:
                                            push$ = _a.sent();
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
        return [2, app.serve()];
    });
}); };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLGlCQXNwQkM7O0FBdHBCRCxxQ0FBdUM7QUFDdkMsc0NBQXdDO0FBRXhDLEtBQUssQ0FBQyxJQUFJLENBQUM7SUFDUCxHQUFHLEVBQUUsT0FBTyxDQUFDLEdBQUcsQ0FBQyxLQUFLO0NBQ3pCLENBQUMsQ0FBQztBQUVILElBQU0sRUFBRSxHQUFnQixLQUFLLENBQUMsUUFBUSxFQUFHLENBQUM7QUFDMUMsSUFBTSxDQUFDLEdBQUcsRUFBRSxDQUFDLE9BQU8sQ0FBQztBQVFyQixJQUFNLE1BQU0sR0FBRyxVQUFFLEVBQVU7SUFBVixtQkFBQSxFQUFBLFVBQVU7SUFDdkIsSUFBSyxFQUFFLEVBQUc7UUFDTixPQUFPLElBQUksQ0FBQyxHQUFHLEVBQUcsQ0FBQztLQUN0QjtJQUNELElBQU0sTUFBTSxHQUFHLElBQUksSUFBSSxDQUFFLElBQUksSUFBSSxFQUFHLENBQUMsY0FBYyxFQUFHLENBQUMsQ0FBQztJQUN4RCxPQUFPLElBQUksSUFBSSxDQUFFLE1BQU0sQ0FBQyxPQUFPLEVBQUcsR0FBRyxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxJQUFJLENBQUUsQ0FBQTtBQUM3RCxDQUFDLENBQUE7QUF5QlksUUFBQSxJQUFJLEdBQUcsVUFBUSxLQUFLLEVBQUUsT0FBTzs7OztRQUVoQyxHQUFHLEdBQUcsSUFBSSxTQUFTLENBQUMsRUFBRSxLQUFLLE9BQUEsRUFBRSxDQUFDLENBQUM7UUFRckMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxPQUFPLEVBQUUsVUFBTyxHQUFHLEVBQUUsSUFBSTs7Ozs7O3dCQUV0QixjQUFjLEdBQUcsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsQ0FBQyxD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QUFFLENBQUMsS0FBRyxPQUFLLENBQUMsSUFBSSxDQUFDLEtBQU8sRUFBRSxzRkFBZ0IsQ0FBQztxREFDbkQ7aURBQ0o7NkNBQ0osQ0FBQyxFQUFBOzs0Q0FYSSxLQUFLLEdBQUcsU0FXWjs7OztpQ0FDTCxDQUFDLENBQ0wsRUFBQTs7d0JBaEJELFNBZ0JDLENBQUM7d0JBRUYsV0FBTyxHQUFHLENBQUMsSUFBSSxHQUFHLEVBQUUsTUFBTSxFQUFFLEdBQUcsRUFBRSxFQUFDOzs7d0JBR2xDLFdBQU8sR0FBRyxDQUFDLElBQUksR0FBRyxFQUFFLE1BQU0sRUFBRSxHQUFHLEVBQUUsRUFBQzs7OzthQUV6QyxDQUFDLENBQUE7UUFFRixXQUFPLEdBQUcsQ0FBQyxLQUFLLEVBQUcsRUFBQzs7S0FFdkIsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIGNsb3VkIGZyb20gJ3d4LXNlcnZlci1zZGsnO1xuaW1wb3J0ICogYXMgVGNiUm91dGVyIGZyb20gJ3RjYi1yb3V0ZXInO1xuXG5jbG91ZC5pbml0KHtcbiAgICBlbnY6IHByb2Nlc3MuZW52LmNsb3VkXG59KTtcblxuY29uc3QgZGI6IERCLkRhdGFiYXNlID0gY2xvdWQuZGF0YWJhc2UoICk7XG5jb25zdCBfID0gZGIuY29tbWFuZDtcblxuLyoqIFxuICog6L2s5o2i5qC85p6X5bC85rK75pe25Yy6ICs45pe25Yy6XG4gKiBEYXRlKCkubm93KCkgLyBuZXcgRGF0ZSgpLmdldFRpbWUoKSDmmK/ml7bkuI3ml7bmraPluLjnmoQrOFxuICogRGF0ZS50b0xvY2FsU3RyaW5nKCApIOWlveWDj+aYr+S4gOebtOaYrysw55qEXG4gKiDlhYjmi7/liLAgKzDvvIznhLblkI4rOFxuICovXG5jb25zdCBnZXROb3cgPSAoIHRzID0gZmFsc2UgKTogYW55ID0+IHtcbiAgICBpZiAoIHRzICkge1xuICAgICAgICByZXR1cm4gRGF0ZS5ub3coICk7XG4gICAgfVxuICAgIGNvbnN0IHRpbWVfMCA9IG5ldyBEYXRlKCBuZXcgRGF0ZSggKS50b0xvY2FsZVN0cmluZyggKSk7XG4gICAgcmV0dXJuIG5ldyBEYXRlKCB0aW1lXzAuZ2V0VGltZSggKSArIDggKiA2MCAqIDYwICogMTAwMCApXG59XG5cbi8qKlxuICpcbiAqIEBkZXNjcmlwdGlvbiDooYznqIvmqKHlnZdcbiAqIC0tLS0tLS0tIOWtl+autSAtLS0tLS0tLS0tXG4gICAgICAgIHRpdGxlIOagh+mimCBzdHJpbmdcbiAqISAgICAgZGVzdGluYXRpb24g55uu55qE5ZywIHN0cmluZ1xuICAgICAgICBzdGFydF9kYXRlIOW8gOWni+aXtumXtCBudW1iZXJcbiAgICAgICAgZW5kX2RhdGUg57uT5p2f5pe26Ze0IG51bWJlclxuICAgICAgICByZWR1Y2VfcHJpY2Ug6KGM56iL56uL5YePIG51bWJlclxuICAgICAgICBzYWxlc192b2x1bWUg6ZSA5ZSu5oC76aKdXG4gICAgICAgIGZ1bGxyZWR1Y2VfYXRsZWFzdCDooYznqIvmu6Hlh48gLSDpl6jmp5sgbnVtYmVyXG4gICAgICAgIGZ1bGxyZWR1Y2VfdmFsdWVzIOihjOeoi+a7oeWHjyAtIOWHj+WkmuWwkSBudW1iZXJcbiAgICAgICAgY2FzaGNvdXBvbl9hdGxlYXN0IOihjOeoi+S7o+mHkeWIuCAtIOmXqOanmyBudW1iZXJcbiAgICAgICAgY2FzaGNvdXBvbl92YWx1ZXMg6KGM56iL5Luj6YeR5Yi4IC0g6YeR6aKdIG51bWJlclxuKiEgICAgICBwb3N0YWdlIOmCrui0ueexu+WeiyBkaWMgXG4qISAgICAgIHBvc3RhZ2VmcmVlX2F0bGVhc3QgIOWFjemCrumXqOanmyBudW1iZXJcbiAgICAgICAgcGF5bWVudCDku5jmrL7nsbvlnosgZGljIFxuICAgICAgICBwdWJsaXNoZWQg5piv5ZCm5Y+R5biDIGJvb2xlYW5cbiAgICAgICAgY3JlYXRlVGltZSDliJvlu7rml7bpl7RcbiAgICAgICAgdXBkYXRlVGltZSDmm7TmlrDml7bpl7RcbiAgICAgICAgaXNDbG9zZWQ6IOaYr+WQpuW3sue7j+aJi+WKqOWFs+mXrVxuICAgICAgICBjYWxsTW9uZXlUaW1lczog5Y+R6LW35YKs5qy+5qyh5pWwXG4gKi9cbmV4cG9ydCBjb25zdCBtYWluID0gYXN5bmMgKCBldmVudCwgY29udGV4dCApID0+IHtcblxuICAgIGNvbnN0IGFwcCA9IG5ldyBUY2JSb3V0ZXIoeyBldmVudCB9KTtcblxuICAgIC8qKlxuICAgICAqIC0tLS0tLSDor7fmsYIgLS0tLS0tLS1cbiAgICAgKiB7XG4gICAgICogICAgc2hvdWxkR2V0R29vZHM6IOm7mOiupHRydWXvvIzlj6/ku6XkuI3loavvvIzojrflj5booYznqIvmjqjojZDllYblk4FcbiAgICAgKiB9XG4gICAgICovXG4gICAgYXBwLnJvdXRlcignZW50ZXInLCBhc3luYyggY3R4LCBuZXh0ICkgPT4ge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgY29uc3Qgc2hvdWxkR2V0R29vZHMgPSBldmVudC5kYXRhID8gZXZlbnQuZGF0YS5zaG91bGRHZXRHb29kcyA6IHVuZGVmaW5lZDtcblxuICAgICAgICAgICAgLy8g5oyJ5byA5aeL5pel5pyf5q2j5bqP77yM6I635Y+W5pyA5aSaMuadoSDlt7Llj5HluIPjgIHmnKrnu5PmnZ/nmoTooYznqItcbiAgICAgICAgICAgIGNvbnN0IGRhdGEkID0gYXdhaXQgZGIuY29sbGVjdGlvbigndHJpcCcpXG4gICAgICAgICAgICAgICAgLndoZXJlKHtcbiAgICAgICAgICAgICAgICAgICAgaXNDbG9zZWQ6IGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICBwdWJsaXNoZWQ6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgIGVuZF9kYXRlOiBfLmd0KCBnZXROb3coIHRydWUgKSlcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIC5saW1pdCggMiApXG4gICAgICAgICAgICAgICAgLm9yZGVyQnkoJ3N0YXJ0X2RhdGUnLCAnYXNjJylcbiAgICAgICAgICAgICAgICAuZ2V0KCApO1xuXG4gICAgICAgICAgICBsZXQgdHJpcHMgPSBkYXRhJC5kYXRhO1xuXG4gICAgICAgICAgICAvLyDmi4nlj5bmnIDmlrDooYznqIvnmoTmjqjojZDllYblk4FcbiAgICAgICAgICAgIGlmICgoICEhdHJpcHNbIDAgXSAmJiBzaG91bGRHZXRHb29kcyA9PT0gdW5kZWZpbmVkICkgfHwgc2hvdWxkR2V0R29vZHMgPT09IHRydWUgKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgdHJpcE9uZVByb2R1Y3RzJCA9IGF3YWl0IFByb21pc2UuYWxsKCB0cmlwc1sgMCBdLnNlbGVjdGVkUHJvZHVjdElkcy5tYXAoIHBpZCA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBjbG91ZC5jYWxsRnVuY3Rpb24oe1xuICAgICAgICAgICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgX2lkOiBwaWQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkdXJsOiAnZGV0YWlsJ1xuICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6ICdnb29kJ1xuICAgICAgICAgICAgICAgICAgICB9KS50aGVuKCByZXMgPT4gcmVzLnJlc3VsdC5kYXRhICk7XG4gICAgICAgICAgICAgICAgfSkpO1xuICAgICAgICAgICAgICAgIHRyaXBzWyAwIF0gPSBPYmplY3QuYXNzaWduKHsgfSwgdHJpcHNbIDAgXSwge1xuICAgICAgICAgICAgICAgICAgICBwcm9kdWN0czogdHJpcE9uZVByb2R1Y3RzJFxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gY3R4LmJvZHkgPSB7XG4gICAgICAgICAgICAgICAgc3RhdHVzOiAyMDAsXG4gICAgICAgICAgICAgICAgZGF0YTogdHJpcHNcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgfSBjYXRjaCAoIGUgKSB7XG4gICAgICAgICAgICByZXR1cm4gY3R4LmJvZHkgPSB7XG4gICAgICAgICAgICAgICAgc3RhdHVzOiA1MDAsXG4gICAgICAgICAgICAgICAgbWVzc2FnZTogZVxuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgYXBwLnJvdXRlcignbGlzdCcsIGFzeW5jKCBjdHgsIG5leHQgKSA9PiB7XG4gICAgICAgIHRyeSB7XG5cbiAgICAgICAgICAgIC8vIOafpeivouadoeaVsFxuICAgICAgICAgICAgY29uc3QgbGltaXQgPSAyMDtcbiAgICAgICAgICAgIGNvbnN0IHNlYXJjaCQgPSBldmVudC5kYXRhLnRpdGxlIHx8ICcnO1xuICAgICAgICAgICAgY29uc3Qgc2VhcmNoID0gbmV3IFJlZ0V4cCggc2VhcmNoJC5yZXBsYWNlKC9cXHMrL2csIFwiXCIpLCAnaScpO1xuXG4gICAgICAgICAgICAvLyDojrflj5bmgLvmlbBcbiAgICAgICAgICAgIGNvbnN0IHRvdGFsJCA9IGF3YWl0IGRiLmNvbGxlY3Rpb24oJ3RyaXAnKVxuICAgICAgICAgICAgICAgIC53aGVyZSh7XG4gICAgICAgICAgICAgICAgICAgIHRpdGxlOiBzZWFyY2hcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIC5jb3VudCggKTtcblxuICAgICAgICAgICAgLy8g6I635Y+W5pWw5o2uXG4gICAgICAgICAgICBjb25zdCBkYXRhJCA9IGF3YWl0IGRiLmNvbGxlY3Rpb24oJ3RyaXAnKVxuICAgICAgICAgICAgICAgIC53aGVyZSh7XG4gICAgICAgICAgICAgICAgICAgIHRpdGxlOiBzZWFyY2hcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIC5saW1pdCggbGltaXQgKVxuICAgICAgICAgICAgICAgIC5za2lwKCggZXZlbnQuZGF0YS5wYWdlIC0gMSApICogbGltaXQgKVxuICAgICAgICAgICAgICAgIC5vcmRlckJ5KCd1cGRhdGVUaW1lJywgJ2Rlc2MnKVxuICAgICAgICAgICAgICAgIC5nZXQoICk7XG5cbiAgICAgICAgICAgIC8vIOiOt+WPluavj+i6uuihjOeoi+eahOiuouWNleaVsFxuICAgICAgICAgICAgY29uc3Qgb3JkZXJzJCA9IGF3YWl0IFByb21pc2UuYWxsKCBkYXRhJC5kYXRhLm1hcCggeCA9PiB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGRiLmNvbGxlY3Rpb24oJ29yZGVyJylcbiAgICAgICAgICAgICAgICAgICAgLndoZXJlKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRpZDogeC5faWQsXG4gICAgICAgICAgICAgICAgICAgICAgICBwYXlfc3RhdHVzOiBfLm5lcSgnMCcpXG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgIC5jb3VudCggKTtcbiAgICAgICAgICAgIH0pKTtcblxuICAgICAgICAgICAgY29uc3QgaW5qZWN0T3JkZXJDb3VudCA9IGRhdGEkLmRhdGEubWFwKCggeCwgayApID0+IHtcbiAgICAgICAgICAgICAgICByZXR1cm4gT2JqZWN0LmFzc2lnbih7IH0sIHgsIHtcbiAgICAgICAgICAgICAgICAgICAgb3JkZXJzOiBvcmRlcnMkWyBrIF0udG90YWxcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIC8vIOiOt+WPluavj+i6uuihjOeoi+eahOmUgOWUruminVxuICAgICAgICAgICAgY29uc3Qgc2FsZXNWb2x1bWUkID0gYXdhaXQgUHJvbWlzZS5hbGwoIGluamVjdE9yZGVyQ291bnQubWFwKCB4ID0+IHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZGIuY29sbGVjdGlvbignb3JkZXInKVxuICAgICAgICAgICAgICAgICAgICAud2hlcmUoe1xuICAgICAgICAgICAgICAgICAgICAgICAgdGlkOiB4Ll9pZCxcbiAgICAgICAgICAgICAgICAgICAgICAgIHBheV9zdGF0dXM6IF8ubmVxKCcwJyksXG4gICAgICAgICAgICAgICAgICAgICAgICBiYXNlX3N0YXR1czogXy5vciggXy5lcSgnMCcpLF8uZXEoJzEnKSwgXy5lcSgnMicpLCBfLmVxKCczJykpXG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgIC5nZXQoICk7XG4gICAgICAgICAgICB9KSlcblxuICAgICAgICAgICAgY29uc3QgaW5qZWN0U2FsZXNWb2x1bWUgPSBzYWxlc1ZvbHVtZSQubWFwKCggbywgayApID0+IHtcblxuICAgICAgICAgICAgICAgIC8vIOmUgOmHj1xuICAgICAgICAgICAgICAgIGNvbnN0IHNhbGVzVm9sdW1lID0gby5kYXRhXG4gICAgICAgICAgICAgICAgICAgIC5maWx0ZXIoIHggPT4geC5wYXlfc3RhdHVzICE9PSAnMCcgJiZcbiAgICAgICAgICAgICAgICAgICAgICAgICgoIHguYmFzZV9zdGF0dXMgPT09ICcxJyApIHx8ICggeC5iYXNlX3N0YXR1cyA9PT0gJzInICkgfHwgKCB4LmJhc2Vfc3RhdHVzID09PSAnMycgKSlcbiAgICAgICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICAgICAgICAucmVkdWNlKCggeCwgeSApID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB4ICsgKCB5LmFsbG9jYXRlZFByaWNlICogKCB5LmFsbG9jYXRlZENvdW50IHx8IDAgKSk7XG4gICAgICAgICAgICAgICAgICAgIH0sIDAgKTtcblxuICAgICAgICAgICAgICAgIC8vIOaAu+S5sOWutlxuICAgICAgICAgICAgICAgIGNvbnN0IGNsaWVudHMgPSBBcnJheS5mcm9tKFxuICAgICAgICAgICAgICAgICAgICBuZXcgU2V0KCBvLmRhdGFcbiAgICAgICAgICAgICAgICAgICAgICAgIC5maWx0ZXIoIHggPT4gXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgeC5wYXlfc3RhdHVzICE9PSAnMCcgJiZcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB4LmJhc2Vfc3RhdHVzICE9PSAnNCcgJiYgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgeC5iYXNlX3N0YXR1cyAhPT0gJzUnXG4gICAgICAgICAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgICAgICAgICAgICAubWFwKCB4ID0+IHgub3BlbmlkIClcbiAgICAgICAgICAgICAgICApKS5sZW5ndGg7XG5cbiAgICAgICAgICAgICAgICAvLyDmnKrku5jmrL7kubDlrrZcbiAgICAgICAgICAgICAgICBjb25zdCBub3RQYXlBbGxDbGllbnRzID0gQXJyYXkuZnJvbShcbiAgICAgICAgICAgICAgICAgICAgbmV3IFNldCggby5kYXRhXG4gICAgICAgICAgICAgICAgICAgICAgICAuZmlsdGVyKCB4ID0+IHgucGF5X3N0YXR1cyA9PT0gJzEnIClcbiAgICAgICAgICAgICAgICAgICAgICAgIC5tYXAoIHggPT4geC5vcGVuaWQgKVxuICAgICAgICAgICAgICAgICkpLmxlbmd0aDtcblxuXG4gICAgICAgICAgICAgICAgcmV0dXJuIE9iamVjdC5hc3NpZ24oeyB9LCBpbmplY3RPcmRlckNvdW50WyBrIF0sIHtcbiAgICAgICAgICAgICAgICAgICAgY2xpZW50cyxcbiAgICAgICAgICAgICAgICAgICAgbm90UGF5QWxsQ2xpZW50cyxcbiAgICAgICAgICAgICAgICAgICAgc2FsZXNfdm9sdW1lOiBzYWxlc1ZvbHVtZVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIHJldHVybiBjdHguYm9keSA9IHtcbiAgICAgICAgICAgICAgICBzdGF0dXM6IDIwMCxcbiAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICAgIHNlYXJjaDogZXZlbnQuZGF0YS50aXRsZS5yZXBsYWNlKC9cXHMrL2csICcnKSxcbiAgICAgICAgICAgICAgICAgICAgcGFnZVNpemU6IGxpbWl0LFxuICAgICAgICAgICAgICAgICAgICBwYWdlOiBldmVudC5kYXRhLnBhZ2UsXG4gICAgICAgICAgICAgICAgICAgIGRhdGE6IGluamVjdFNhbGVzVm9sdW1lLFxuICAgICAgICAgICAgICAgICAgICB0b3RhbDogdG90YWwkLnRvdGFsLFxuICAgICAgICAgICAgICAgICAgICB0b3RhbFBhZ2U6IE1hdGguY2VpbCggdG90YWwkLnRvdGFsIC8gbGltaXQgKVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgfSBjYXRjaCAoIGUgKSB7XG4gICAgICAgICAgICByZXR1cm4gY3R4LmJvZHkgPSB7XG4gICAgICAgICAgICAgICAgc3RhdHVzOiA1MDAsXG4gICAgICAgICAgICAgICAgbWVzc2FnZTogZVxuICAgICAgICAgICAgfTtcbiAgICAgICAgfSBcbiAgICB9KTtcbiAgICBcbiAgICAvKipcbiAgICAgKiBAZGVzY3JpcHRpb25cbiAgICAgKiDooYznqIvor6bmg4VcbiAgICAgKiB7XG4gICAgICogICAgICBtb3JlRGV0YWlsOiB1bmRlZmluZWQgfCBmYWxzZSB8IHRydWVcbiAgICAgKiB9XG4gICAgICovXG4gICAgYXBwLnJvdXRlcignZGV0YWlsJywgYXN5bmMoIGN0eCwgbmV4dCApID0+IHtcbiAgICAgICAgdHJ5IHtcblxuICAgICAgICAgICAgY29uc3QgeyBtb3JlRGV0YWlsIH0gPSBldmVudC5kYXRhO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICAvLyDojrflj5bln7rmnKzor6bmg4VcbiAgICAgICAgICAgIGNvbnN0IGRhdGEkID0gYXdhaXQgZGIuY29sbGVjdGlvbigndHJpcCcpXG4gICAgICAgICAgICAgICAgICAgIC53aGVyZSh7XG4gICAgICAgICAgICAgICAgICAgICAgICBfaWQ6IGV2ZW50LmRhdGEuX2lkIHx8IGV2ZW50LmRhdGEudGlkXG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgIC5nZXQoICk7XG4gICAgICAgICAgICBjb25zdCBtZXRhID0gZGF0YSQuZGF0YVsgMCBdO1xuXG4gICAgICAgICAgICBpZiAoIG1vcmVEZXRhaWwgIT09IGZhbHNlICkge1xuICAgICAgICAgICAgICAgIC8vIOmAmui/h+W3sumAieeahOWVhuWTgWlkcyzmi7/liLDlr7nlupTnmoTlm77niYfjgIF0aXRsZeOAgV9pZFxuICAgICAgICAgICAgICAgIGNvbnN0IHByb2R1Y3RzJDogYW55ID0gYXdhaXQgUHJvbWlzZS5hbGwoIG1ldGEuc2VsZWN0ZWRQcm9kdWN0SWRzLm1hcCggcGlkID0+IHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGRiLmNvbGxlY3Rpb24oJ2dvb2RzJylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAud2hlcmUoe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBfaWQ6IHBpZFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLmZpZWxkKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaW1nOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aXRsZTogdHJ1ZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLmdldCggKTtcbiAgICAgICAgICAgICAgICB9KSk7XG5cbiAgICAgICAgICAgICAgICBtZXRhLnNlbGVjdGVkUHJvZHVjdHMgPSBwcm9kdWN0cyQubWFwKCB4ID0+IHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHguZGF0YVsgMCBdO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBtZXRhLnNlbGVjdGVkUHJvZHVjdHMgPSBbIF07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBcblxuICAgICAgICAgICAgcmV0dXJuIGN0eC5ib2R5ID0ge1xuICAgICAgICAgICAgICAgIHN0YXR1czogMjAwLFxuICAgICAgICAgICAgICAgIGRhdGE6IGRhdGEkLmRhdGFbIDAgXVxuICAgICAgICAgICAgfTtcblxuICAgICAgICB9IGNhdGNoKCBlICkge1xuICAgICAgICAgICAgcmV0dXJuIGN0eC5ib2R5ID0ge1xuICAgICAgICAgICAgICAgIHN0YXR1czogNTAwLFxuICAgICAgICAgICAgICAgIG1lc3NhZ2U6IGVcbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgIC8qKlxuICAgICAqIEBkZXNjcmlwdGlvblxuICAgICAqIOWIm+W7uiAvIOe8lui+keW9k+WJjeihjOeoi1xuICAgICAqL1xuICAgIGFwcC5yb3V0ZXIoJ2VkaXQnLCBhc3luYyggY3R4LCBuZXh0ICkgPT4ge1xuICAgICAgICB0cnkge1xuXG4gICAgICAgICAgICBsZXQgdHJpcDogYW55ID0gbnVsbDtcbiAgICAgICAgICAgIGxldCBfaWQgPSBldmVudC5kYXRhLl9pZDtcbiAgICAgICAgICAgIGNvbnN0IHRpZCA9IGV2ZW50LmRhdGEuX2lkO1xuICAgICAgICAgICAgY29uc3QgeyBwdWJsaXNoZWQsIHRpdGxlLCBzdGFydF9kYXRlLCBlbmRfZGF0ZSwgcmVkdWNlX3ByaWNlIH0gPSBldmVudC5kYXRhO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICBjb25zdCBnZXRFcnIgPSBtZXNzYWdlID0+IHtcbiAgICAgICAgICAgICAgICByZXR1cm4gY3R4LmJvZHkgPSB7XG4gICAgICAgICAgICAgICAgICAgIHN0YXR1czogNTAwLFxuICAgICAgICAgICAgICAgICAgICBtZXNzYWdlXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiDmoKHpqowx77yaXG4gICAgICAgICAgICAgKiDlpoLmnpzooYznqIvpgInmi6nigJzlt7Llj5HluIPigJ1cbiAgICAgICAgICAgICAqIOmcgOimgeajgOafpeaYr+WQpuaciSDlt7Llj5HluIPooYznqIvnmoTnu5PmnZ/ml7bpl7Qg5aSn5LqO562J5LqOIOW9k+WJjeihjOeoi+eahOW8gOWni+aXtumXtFxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICBpZiAoIHB1Ymxpc2hlZCApIHtcblxuICAgICAgICAgICAgICAgIGxldCB3aGVyZSQgPSB7XG4gICAgICAgICAgICAgICAgICAgIGlzQ2xvc2VkOiBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgc3RhcnRfZGF0ZTogXy5sdCggZ2V0Tm93KCB0cnVlICkpLFxuICAgICAgICAgICAgICAgICAgICBlbmRfZGF0ZTogXy5ndGUoIGV2ZW50LmRhdGEuc3RhcnRfZGF0ZSApXG4gICAgICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgICAgIGlmICggISF0aWQgKSB7XG4gICAgICAgICAgICAgICAgICAgIHdoZXJlJCA9IE9iamVjdC5hc3NpZ24oeyB9LCB3aGVyZSQsIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIF9pZDogXy5uZXEoIHRpZCApXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGNvbnN0IHJ1bGUxJCA9IGF3YWl0IGRiLmNvbGxlY3Rpb24oJ3RyaXAnKVxuICAgICAgICAgICAgICAgICAgICAud2hlcmUoICB3aGVyZSQgKVxuICAgICAgICAgICAgICAgICAgICAuY291bnQoICk7XG4gICAgICAgIFxuICAgICAgICAgICAgICAgIGlmICggcnVsZTEkLnRvdGFsID4gMCApIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGdldEVycign5byA5aeL5pe26Ze05b+F6aG75aSn5LqO5LiK6Laf6KGM56iL55qE57uT5p2f5pe26Ze0Jyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBcblxuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiDmoKHpqowyOlxuICAgICAgICAgICAgICog57uT5p2f5pe26Ze05LiN6IO95bCP5LqO5byA5aeL5pe26Ze0XG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIGlmICggc3RhcnRfZGF0ZSA+PSBlbmRfZGF0ZSAgKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGdldEVycign5byA5aeL5pe26Ze05b+F6aG75aSn5LqO57uT5p2f5pe26Ze0Jyk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8qKiDojrflj5bnm67moId0cmlwICovXG4gICAgICAgICAgICBpZiAoICEhX2lkICkge1xuICAgICAgICAgICAgICAgIGNvbnN0IHJlc3VsdCQgPSBhd2FpdCBkYi5jb2xsZWN0aW9uKCd0cmlwJylcbiAgICAgICAgICAgICAgICAgICAgLmRvYyggX2lkIClcbiAgICAgICAgICAgICAgICAgICAgLmdldCggKTtcbiAgICAgICAgICAgICAgICB0cmlwID0gcmVzdWx0JC5kYXRhO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyDliJvlu7ogXG4gICAgICAgICAgICBpZiAoICFfaWQgKSB7XG4gICAgXG4gICAgICAgICAgICAgICAgY29uc3QgY3JlYXRlJCA9IGF3YWl0IGRiLmNvbGxlY3Rpb24oJ3RyaXAnKVxuICAgICAgICAgICAgICAgICAgICAuYWRkKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRhdGE6IE9iamVjdC5hc3NpZ24oeyB9LCBldmVudC5kYXRhLCB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FsbE1vbmV5VGltZXM6IDBcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIF9pZCA9IGNyZWF0ZSQuX2lkO1xuICAgIFxuICAgICAgICAgICAgLy8g57yW6L6RXG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgIFxuICAgICAgICAgICAgICAgIGNvbnN0IG9yaWdpbiQgPSBhd2FpdCBkYi5jb2xsZWN0aW9uKCd0cmlwJylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC53aGVyZSh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgX2lkXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLmdldCggKTtcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICBjb25zdCBvcmlnaW4gPSBvcmlnaW4kLmRhdGFbIDAgXTtcbiAgICBcbiAgICAgICAgICAgICAgICBkZWxldGUgb3JpZ2luWydfaWQnXTtcbiAgICAgICAgICAgICAgICBkZWxldGUgZXZlbnQuZGF0YVsnX2lkJ107XG4gICAgICAgICAgICAgICAgZGVsZXRlIGV2ZW50LmRhdGFbJ3NhbGVzX3ZvbHVtZSddXG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgY29uc3QgdGVtcCA9IE9iamVjdC5hc3NpZ24oeyB9LCBvcmlnaW4sIHtcbiAgICAgICAgICAgICAgICAgICAgLi4uZXZlbnQuZGF0YSxcbiAgICAgICAgICAgICAgICAgICAgY2FsbE1vbmV5VGltZXM6IGV2ZW50LmRhdGFbJ2VuZF9kYXRlJ10gPiBvcmlnaW5bJ2VuZF9kYXRlJ10gPyAwIDogb3JpZ2luWydjYWxsTW9uZXlUaW1lcyddLFxuICAgICAgICAgICAgICAgICAgICBpc0Nsb3NlZDogZ2V0Tm93KCB0cnVlICkgPj0gTnVtYmVyKCBlbmRfZGF0ZSApIFxuICAgICAgICAgICAgICAgIH0pXG4gICAgXG4gICAgICAgICAgICAgICAgYXdhaXQgZGIuY29sbGVjdGlvbigndHJpcCcpXG4gICAgICAgICAgICAgICAgICAgICAgICAuZG9jKCBfaWQgKVxuICAgICAgICAgICAgICAgICAgICAgICAgLnNldCh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YTogdGVtcFxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICog5o6o6YCBXG4gICAgICAgICAgICAgKiDliJvlu7rml7blgJnnmoTlj5HluIPjgIFcbiAgICAgICAgICAgICAqIOe8lui+keeahOaXtuWAmeWPkeW4g1xuICAgICAgICAgICAgICovXG4gICAgICAgICAgICBpZiAoKCF0aWQgJiYgcHVibGlzaGVkICkgfHwgKCAhIXRyaXAgJiYgIXRyaXAucHVibGlzaGVkICYmICEhcHVibGlzaGVkICkpIHtcblxuICAgICAgICAgICAgICAgIGNvbnN0IHRpbWUgPSBuZXcgRGF0ZSggc3RhcnRfZGF0ZSApO1xuXG4gICAgICAgICAgICAgICAgLy8g5o6o6YCB5Luj6LSt6YCa55+lXG4gICAgICAgICAgICAgICAgY29uc3QgbWVtYmVycyA9IGF3YWl0IGRiLmNvbGxlY3Rpb24oJ21hbmFnZXItbWVtYmVyJylcbiAgICAgICAgICAgICAgICAud2hlcmUoe1xuICAgICAgICAgICAgICAgICAgICBwdXNoOiB0cnVlXG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAuZ2V0KCApO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgYXdhaXQgUHJvbWlzZS5hbGwoXG4gICAgICAgICAgICAgICAgICAgIG1lbWJlcnMuZGF0YS5tYXAoIGFzeW5jIG1lbWJlciA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyA044CB6LCD55So5o6o6YCBXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBwdXNoJCA9IGF3YWl0IGNsb3VkLmNhbGxGdW5jdGlvbih7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogJ2NvbW1vbicsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAkdXJsOiAncHVzaC10ZW1wbGF0ZS1jbG91ZCcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9wZW5pZDogbWVtYmVyLm9wZW5pZCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6ICd0cmlwJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhZ2U6ICdwYWdlcy9tYW5hZ2VyLXRyaXAtbGlzdC9pbmRleCcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZXh0czogW2Ake3RpdGxlfWAsIGDmlrDooYznqIvlt7LmjqjpgIHlrqLmiLcs5Li65L2g5byA6YCa5LqG6K6i5Y2V5o6o6YCBYF1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICk7XG5cbiAgICAgICAgICAgICAgICAvLyDmjqjpgIHlrqLmiLfpgJrnn6VcbiAgICAgICAgICAgICAgICBjb25zdCB1c2VycyA9IGF3YWl0IGRiLmNvbGxlY3Rpb24oJ3VzZXInKVxuICAgICAgICAgICAgICAgICAgICAud2hlcmUoe1xuXG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgIC5nZXQoICk7XG5cbiAgICAgICAgICAgICAgICBhd2FpdCBQcm9taXNlLmFsbChcbiAgICAgICAgICAgICAgICAgICAgdXNlcnMuZGF0YVxuICAgICAgICAgICAgICAgICAgICAgICAgLmZpbHRlciggdXNlciA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuICFtZW1iZXJzLmRhdGEuZmluZCggbWVtYmVyID0+IG1lbWJlci5vcGVuaWQgPT09IHVzZXIub3BlbmlkIClcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgICAgICAubWFwKCBhc3luYyB1c2VyID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyA044CB6LCD55So5o6o6YCBXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgcHVzaCQgPSBhd2FpdCBjbG91ZC5jYWxsRnVuY3Rpb24oe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiAnY29tbW9uJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJHVybDogJ3B1c2gtdGVtcGxhdGUtY2xvdWQnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9wZW5pZDogdXNlci5vcGVuaWQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogJ3RyaXAnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhZ2U6ICdwYWdlcy90cmlwLWVudGVyL2luZGV4JyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZXh0czogW2Ake3RpdGxlfWAsIGDku6PotK3lnKgke3RpbWUuZ2V0TW9udGgoICkrMX3mnIgke3RpbWUuZ2V0RGF0ZSggKX3ml6XlvIDlp4vvvIHml6Dpl6jmp5vnq4vlh48ke3JlZHVjZV9wcmljZX3lhYPvvIFgXVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICk7XG5cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIGN0eC5ib2R5ID0ge1xuICAgICAgICAgICAgICAgIGRhdGE6IF9pZCxcbiAgICAgICAgICAgICAgICBzdGF0dXM6IDIwMFxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICBcbiAgICAgICAgfSBjYXRjaCggZSApIHtcbiAgICAgICAgICAgIHJldHVybiBjdHguYm9keSA9IHtcbiAgICAgICAgICAgICAgICBzdGF0dXM6IDUwMCxcbiAgICAgICAgICAgICAgICBtZXNzYWdlOiBlXG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICAvKiogXG4gICAgICogQGRlc2NyaXB0aW9uXG4gICAgICog6I635Y+W6KGM56iL5bqV5LiL55qE5Z+65pys5Lia5Yqh5pWw5o2uXG4gICAgICog6ZSA5ZSu5oC76aKd44CBXG4gICAgICog5a6i5oi35oC75pWw44CBXG4gICAgICog5pyq5LuY5bC+5qy+5a6i5oi35pWw6YeP44CBXG4gICAgICog5oC76K6i5Y2V5pWw44CBXG4gICAgICog6KGM56iL5ZCN56ew44CBXG4gICAgICog5bey5Y+R6YCB5YKs5qy+5qyh5pWwXG4gICAgICovXG4gICAgYXBwLnJvdXRlcignb3JkZXItaW5mbycsIGFzeW5jKCBjdHgsIG5leHQgKSA9PiB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBjb25zdCB7IHRpZCB9ID0gZXZlbnQuZGF0YTtcblxuICAgICAgICAgICAgLyoqIOihjOeoi+ivpuaDhSAqL1xuICAgICAgICAgICAgY29uc3QgdHJpcCQgPSBhd2FpdCBkYi5jb2xsZWN0aW9uKCd0cmlwJylcbiAgICAgICAgICAgICAgICAuZG9jKCB0aWQgKVxuICAgICAgICAgICAgICAgIC5nZXQoICk7XG4gICAgICAgIFxuICAgICAgICAgICAgLy8g6I635Y+W6KGM56iL5bqV5LiL5omA5pyJ55qE6K6i5Y2VXG4gICAgICAgICAgICBjb25zdCBvcmRlcnMkID0gYXdhaXQgZGIuY29sbGVjdGlvbignb3JkZXInKVxuICAgICAgICAgICAgICAgIC53aGVyZSh7XG4gICAgICAgICAgICAgICAgICAgIHRpZCxcbiAgICAgICAgICAgICAgICAgICAgcGF5X3N0YXR1czogXy5uZXEoJzAnKVxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLmdldCggKTtcblxuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiDmgLvmlLbnm4pcbiAgICAgICAgICAgICAqICHoh7PlsJHlt7Lku5jorqLph5HvvIzoh7PlsJHlt7Lnu4/osIPoioLllK7ku7fjgIHmlbDph49cbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgY29uc3Qgc3VtID0gb3JkZXJzJC5kYXRhXG4gICAgICAgICAgICAgICAgLmZpbHRlciggeCA9PiB4LnBheV9zdGF0dXMgIT09ICcwJyAmJlxuICAgICAgICAgICAgICAgICAgICAoKCB4LmJhc2Vfc3RhdHVzID09PSAnMScgKSB8fCAoIHguYmFzZV9zdGF0dXMgPT09ICcyJyApIHx8ICggeC5iYXNlX3N0YXR1cyA9PT0gJzMnICkpXG4gICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICAgIC5yZWR1Y2UoKCB4LCB5ICkgPT4ge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4geCArICggeS5hbGxvY2F0ZWRQcmljZSAqICggeS5hbGxvY2F0ZWRDb3VudCB8fCAwICkpO1xuICAgICAgICAgICAgICAgIH0sIDAgKTtcblxuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiDmgLvlrqLmiLfmlbDph49cbiAgICAgICAgICAgICAqICHoh7PlsJHlt7Lku5jorqLph5FcbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgY29uc3QgY2xpZW50cyA9IEFycmF5LmZyb20oXG4gICAgICAgICAgICAgICAgbmV3IFNldCggb3JkZXJzJC5kYXRhXG4gICAgICAgICAgICAgICAgICAgIC5maWx0ZXIoIHggPT4geC5wYXlfc3RhdHVzICE9PSAnMCcgKVxuICAgICAgICAgICAgICAgICAgICAubWFwKCB4ID0+IHgub3BlbmlkIClcbiAgICAgICAgICAgICkpLmxlbmd0aDtcblxuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiDmgLvmnKrkuqTlsL7mrL7lrqLmiLfmlbDph49cbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgY29uc3Qgbm90UGF5QWxsQ2xpZW50cyA9IEFycmF5LmZyb20oXG4gICAgICAgICAgICAgICAgbmV3IFNldCggb3JkZXJzJC5kYXRhXG4gICAgICAgICAgICAgICAgICAgIC5maWx0ZXIoIHggPT4geC5wYXlfc3RhdHVzID09PSAnMScgKVxuICAgICAgICAgICAgICAgICAgICAubWFwKCB4ID0+IHgub3BlbmlkIClcbiAgICAgICAgICAgICkpLmxlbmd0aDtcblxuICAgICAgICAgICAgcmV0dXJuIGN0eC5ib2R5ID0ge1xuICAgICAgICAgICAgICAgIHN0YXR1czogMjAwLFxuICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgc3VtLCAvLyDplIDllK7mgLvpop1cbiAgICAgICAgICAgICAgICAgICAgY2xpZW50cywgLy8g5a6i5oi35oC75pWwXG4gICAgICAgICAgICAgICAgICAgIG5vdFBheUFsbENsaWVudHMsIC8vIOacquS7mOWwvuasvuWuouaIt+aVsOmHj1xuICAgICAgICAgICAgICAgICAgICBjb3VudDogb3JkZXJzJC5kYXRhLmxlbmd0aCwgLy8g5oC76K6i5Y2V5pWwLFxuICAgICAgICAgICAgICAgICAgICB0aXRsZTogdHJpcCQuZGF0YS50aXRsZSwgLy8g6KGM56iL5ZCN56ewXG4gICAgICAgICAgICAgICAgICAgIGNhbGxNb25leVRpbWVzOiB0cmlwJC5kYXRhLmNhbGxNb25leVRpbWVzIC8vIOW3suWPkemAgeWCrOasvuasoeaVsFxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgfSBjYXRjaCAoIGUgKSB7IHJldHVybiBjdHguYm9keSA9IHsgc3RhdHVzOiA1MDAgfTt9XG4gICAgfSlcblxuICAgIC8qKlxuICAgICAqIEBAZGVzY3JpcHRpb25cbiAgICAgKiDmm7TmlrDooYznqIvlupXkuIvnmoTlv6vpgJLlm77lhoxcbiAgICAgKi9cbiAgICBhcHAucm91dGVyKCd1cGRhdGUtZGVsaXZlcicsIGFzeW5jKCBjdHgsIG5leHQgKSA9PiB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBjb25zdCB7IHRpZCwgaW1ncyB9ID0gZXZlbnQuZGF0YTtcbiAgICAgICAgICAgIGNvbnN0IHRhcmdldCA9IGF3YWl0IGRiLmNvbGxlY3Rpb24oJ2RlbGl2ZXInKVxuICAgICAgICAgICAgICAgIC53aGVyZSh7XG4gICAgICAgICAgICAgICAgICAgIHRpZCxcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogJ2RlbGl2ZXItaW1nJ1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLmdldCggKTtcblxuICAgICAgICAgICAgLy8g5Yib5bu6XG4gICAgICAgICAgICBpZiAoICF0YXJnZXQuZGF0YVsgMCBdKSB7XG4gICAgICAgICAgICAgICAgYXdhaXQgZGIuY29sbGVjdGlvbignZGVsaXZlcicpXG4gICAgICAgICAgICAgICAgICAgIC5hZGQoe1xuICAgICAgICAgICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRpZCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbWdzLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6ICdkZWxpdmVyLWltZydcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAvLyDmm7TmlrBcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgYXdhaXQgZGIuY29sbGVjdGlvbignZGVsaXZlcicpXG4gICAgICAgICAgICAgICAgICAgIC5kb2MoIFN0cmluZyggdGFyZ2V0LmRhdGFbIDAgXS5faWQpKVxuICAgICAgICAgICAgICAgICAgICAudXBkYXRlKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbWdzXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiBjdHguYm9keSA9IHsgc3RhdHVzOiAyMDAgfTtcbiAgICAgICAgICAgIFxuICAgICAgICB9IGNhdGNoICggZSApIHsgcmV0dXJuIGN0eC5ib2R5ID0geyBzdGF0dXM6IDUwMCB9fVxuICAgIH0pXG5cbiAgICAvKipcbiAgICAgKiBAQGRlc2NyaXB0aW9uXG4gICAgICog6I635Y+W6KGM56iL5bqV5LiL55qE5b+r6YCS5Zu+5YaMXG4gICAgICovXG4gICAgYXBwLnJvdXRlcignZGVsaXZlcicsIGFzeW5jKCBjdHgsIG5leHQgKSA9PiB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBjb25zdCB7IHRpZCB9ID0gZXZlbnQuZGF0YTtcbiAgICAgICAgICAgIGNvbnN0IHRhcmdldCA9IGF3YWl0IGRiLmNvbGxlY3Rpb24oJ2RlbGl2ZXInKVxuICAgICAgICAgICAgICAgIC53aGVyZSh7XG4gICAgICAgICAgICAgICAgICAgIHRpZCxcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogJ2RlbGl2ZXItaW1nJ1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLmdldCggKTtcblxuICAgICAgICAgICAgcmV0dXJuIGN0eC5ib2R5ID0geyBcbiAgICAgICAgICAgICAgICBzdGF0dXM6IDIwMCxcbiAgICAgICAgICAgICAgICBkYXRhOiB0YXJnZXQuZGF0YVsgMCBdID8gdGFyZ2V0LmRhdGFbIDAgXS5pbWdzIDogWyBdXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfSBjYXRjaCAoIGUgKSB7XG4gICAgICAgICAgICByZXR1cm4gY3R4LmJvZHkgPSB7IHN0YXR1czogNTAwIH07XG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgIC8qKlxuICAgICAqIEBkZXNjcmlwdGlvblxuICAgICAqIOaJi+WKqOWFs+mXreW9k+WJjeihjOeoi1xuICAgICAqIHtcbiAgICAgKiAgICB0aWRcbiAgICAgKiB9XG4gICAgICovXG4gICAgYXBwLnJvdXRlcignY2xvc2UnLCBhc3luYyggY3R4LCBuZXh0ICkgPT4ge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgY29uc3QgeyB0aWQgfSA9IGV2ZW50LmRhdGE7XG5cbiAgICAgICAgICAgIC8vIOabtOaWsOihjOeoi2Nsb3Nl5a2X5q61XG4gICAgICAgICAgICBhd2FpdCBkYi5jb2xsZWN0aW9uKCd0cmlwJylcbiAgICAgICAgICAgICAgICAuZG9jKCBTdHJpbmcoIHRpZCApKVxuICAgICAgICAgICAgICAgIC51cGRhdGUoe1xuICAgICAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpc0Nsb3NlZDogdHJ1ZVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIC8vIOaJi+WKqOWPlua2iOihjOeoi+aXtu+8jOaKiuW+heaUr+S7mOiuouWNleiuvuS4uuWPlua2iFxuICAgICAgICAgICAgY29uc3Qgb3JkZXJzJCA9IGF3YWl0IGRiLmNvbGxlY3Rpb24oJ29yZGVyJylcbiAgICAgICAgICAgICAgICAud2hlcmUoe1xuICAgICAgICAgICAgICAgICAgICB0aWQsXG4gICAgICAgICAgICAgICAgICAgIHBheV9zdGF0dXM6ICcwJyxcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIC5nZXQoICk7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGF3YWl0IFByb21pc2UuYWxsKCBvcmRlcnMkLmRhdGEubWFwKCBvcmRlciQgPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiBkYi5jb2xsZWN0aW9uKCdvcmRlcicpXG4gICAgICAgICAgICAgICAgICAgIC5kb2MoIFN0cmluZyggb3JkZXIkLl9pZCApKVxuICAgICAgICAgICAgICAgICAgICAudXBkYXRlKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBiYXNlX3N0YXR1czogJzUnXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICB9KSk7XG5cbiAgICAgICAgICAgIGNvbnN0IHRyaXAkID0gYXdhaXQgZGIuY29sbGVjdGlvbigndHJpcCcpXG4gICAgICAgICAgICAgICAgLmRvYyggdGlkIClcbiAgICAgICAgICAgICAgICAuZ2V0KCApO1xuXG4gICAgICAgICAgICAvLyDmjqjpgIHku6PotK3pgJrnn6VcbiAgICAgICAgICAgIGNvbnN0IG1lbWJlcnMgPSBhd2FpdCBkYi5jb2xsZWN0aW9uKCdtYW5hZ2VyLW1lbWJlcicpXG4gICAgICAgICAgICAgICAgLndoZXJlKHtcbiAgICAgICAgICAgICAgICAgICAgcHVzaDogdHJ1ZVxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLmdldCggKTtcbiAgICAgICAgXG4gICAgICAgICAgICBhd2FpdCBQcm9taXNlLmFsbChcbiAgICAgICAgICAgICAgICBtZW1iZXJzLmRhdGEubWFwKCBhc3luYyBtZW1iZXIgPT4ge1xuICAgICAgICAgICAgICAgICAgICAvLyA044CB6LCD55So5o6o6YCBXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHB1c2gkID0gYXdhaXQgY2xvdWQuY2FsbEZ1bmN0aW9uKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6ICdjb21tb24nLFxuICAgICAgICAgICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICR1cmw6ICdwdXNoLXRlbXBsYXRlLWNsb3VkJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9wZW5pZDogbWVtYmVyLm9wZW5pZCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogJ3RyaXAnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYWdlOiBgcGFnZXMvbWFuYWdlci10cmlwLW9yZGVyL2luZGV4P2lkPSR7dGlkfSZhYz0kezF9YCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGV4dHM6IFtgJHt0cmlwJC5kYXRhLnRpdGxlfWAsIGDlhbPpl63miJDlip/vvIHkuIDplK7mlLbmrL7lip/og73lt7LlvIDlkK9gXVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICk7XG5cbiAgICAgICAgICAgIHJldHVybiBjdHguYm9keSA9IHsgc3RhdHVzOiAyMDAgfTtcblxuICAgICAgICB9IGNhdGNoICggZSApIHtcbiAgICAgICAgICAgIHJldHVybiBjdHguYm9keSA9IHsgc3RhdHVzOiA1MDAgfTtcbiAgICAgICAgfVxuICAgIH0pXG5cbiAgICByZXR1cm4gYXBwLnNlcnZlKCApO1xuXG59Il19