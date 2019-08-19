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
            var trip, _id, tid, _a, published, title_1, start_date, reduce_price_1, getErr, fixEndDate, end_date, where$, rule1$, result$, create$, origin$, origin, temp, time_1, members_1, users, e_4;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 15, , 16]);
                        trip = null;
                        _id = event.data._id;
                        tid = event.data._id;
                        _a = event.data, published = _a.published, title_1 = _a.title, start_date = _a.start_date, reduce_price_1 = _a.reduce_price;
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
                            return new Date(y + "/" + m + "/" + d + " 20:00:00").getTime();
                        };
                        end_date = fixEndDate(Number(event.data.end_date));
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
                                    end_date: end_date,
                                    warning: false,
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
                        temp = Object.assign({}, origin, __assign({}, event.data, { callMoneyTimes: end_date > origin['end_date'] ? 0 : origin['callMoneyTimes'], isClosed: getNow(true) >= Number(end_date) }));
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
                                pay_status: _.neq('0'),
                                base_status: _.neq('5')
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLGlCQXFxQkM7O0FBcnFCRCxxQ0FBdUM7QUFDdkMsc0NBQXdDO0FBRXhDLEtBQUssQ0FBQyxJQUFJLENBQUM7SUFDUCxHQUFHLEVBQUUsT0FBTyxDQUFDLEdBQUcsQ0FBQyxLQUFLO0NBQ3pCLENBQUMsQ0FBQztBQUVILElBQU0sRUFBRSxHQUFnQixLQUFLLENBQUMsUUFBUSxFQUFHLENBQUM7QUFDMUMsSUFBTSxDQUFDLEdBQUcsRUFBRSxDQUFDLE9BQU8sQ0FBQztBQVFyQixJQUFNLE1BQU0sR0FBRyxVQUFFLEVBQVU7SUFBVixtQkFBQSxFQUFBLFVBQVU7SUFDdkIsSUFBSyxFQUFFLEVBQUc7UUFDTixPQUFPLElBQUksQ0FBQyxHQUFHLEVBQUcsQ0FBQztLQUN0QjtJQUNELElBQU0sTUFBTSxHQUFHLElBQUksSUFBSSxDQUFFLElBQUksSUFBSSxFQUFHLENBQUMsY0FBYyxFQUFHLENBQUMsQ0FBQztJQUN4RCxPQUFPLElBQUksSUFBSSxDQUFFLE1BQU0sQ0FBQyxPQUFPLEVBQUcsR0FBRyxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxJQUFJLENBQUUsQ0FBQTtBQUM3RCxDQUFDLENBQUE7QUEwQlksUUFBQSxJQUFJLEdBQUcsVUFBUSxLQUFLLEVBQUUsT0FBTzs7OztRQUVoQyxHQUFHLEdBQUcsSUFBSSxTQUFTLENBQUMsRUFBRSxLQUFLLE9BQUEsRUFBRSxDQUFDLENBQUM7UUFRckMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxPQUFPLEVBQUUsVUFBTyxHQUFHLEVBQUUsSUFBSTs7Ozs7O3dCQUV0QixjQUFjLEdBQUcsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQzt3QkFHNUQsV0FBTSxFQUFFLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQztpQ0FDcEMsS0FBSyxDQUFDO2dDQUNILFFBQVEsRUFBRSxLQUFLO2dDQUNmLFNBQVMsRUFBRSxJQUFJO2dDQUNmLFFBQVEsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFFLE1BQU0sQ0FBRSxJQUFJLENBQUUsQ0FBQzs2QkFDbEMsQ0FBQztpQ0FDRCxLQUFLLENBQUUsQ0FBQyxDQUFFO2lDQUNWLE9BQU8sQ0FBQyxZQUFZLEVBQUUsS0FBSyxDQUFDO2lDQUM1QixHQUFHLEVBQUcsRUFBQTs7d0JBUkwsS0FBSyxHQUFHLFNBUUg7d0JBRVAsS0FBSyxHQUFHLEtBQUssQ0FBQyxJQUFJLENBQUM7NkJBR25CLENBQUEsQ0FBRSxDQUFDLENBQUMsS0FBSyxDQUFFLENBQUMsQ0FBRSxJQUFJLGNBQWMsS0FBSyxTQUFTLENBQUUsSUFBSSxjQUFjLEtBQUssSUFBSSxDQUFBLEVBQTNFLGNBQTJFO3dCQUNsRCxXQUFNLE9BQU8sQ0FBQyxHQUFHLENBQUUsS0FBSyxDQUFFLENBQUMsQ0FBRSxDQUFDLGtCQUFrQixDQUFDLEdBQUcsQ0FBRSxVQUFBLEdBQUc7Z0NBQzlFLE9BQU8sS0FBSyxDQUFDLFlBQVksQ0FBQztvQ0FDdEIsSUFBSSxFQUFFO3dDQUNGLElBQUksRUFBRTs0Q0FDRixHQUFHLEVBQUUsR0FBRzt5Q0FDWDt3Q0FDRCxJQUFJLEVBQUUsUUFBUTtxQ0FDakI7b0NBQ0QsSUFBSSxFQUFFLE1BQU07aUNBQ2YsQ0FBQyxDQUFDLElBQUksQ0FBRSxVQUFBLEdBQUcsSUFBSSxPQUFBLEdBQUcsQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFmLENBQWUsQ0FBRSxDQUFDOzRCQUN0QyxDQUFDLENBQUMsQ0FBQyxFQUFBOzt3QkFWRyxnQkFBZ0IsR0FBRyxTQVV0Qjt3QkFDSCxLQUFLLENBQUUsQ0FBQyxDQUFFLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQyxFQUFHLEVBQUUsS0FBSyxDQUFFLENBQUMsQ0FBRSxFQUFFOzRCQUN4QyxRQUFRLEVBQUUsZ0JBQWdCO3lCQUM3QixDQUFDLENBQUM7OzRCQUdQLFdBQU8sR0FBRyxDQUFDLElBQUksR0FBRzs0QkFDZCxNQUFNLEVBQUUsR0FBRzs0QkFDWCxJQUFJLEVBQUUsS0FBSzt5QkFDZCxFQUFDOzs7d0JBR0YsV0FBTyxHQUFHLENBQUMsSUFBSSxHQUFHO2dDQUNkLE1BQU0sRUFBRSxHQUFHO2dDQUNYLE9BQU8sRUFBRSxHQUFDOzZCQUNiLEVBQUM7Ozs7YUFFVCxDQUFDLENBQUM7UUFFSCxHQUFHLENBQUMsTUFBTSxDQUFDLE1BQU0sRUFBRSxVQUFPLEdBQUcsRUFBRSxJQUFJOzs7Ozs7d0JBSXJCLEtBQUssR0FBRyxFQUFFLENBQUM7d0JBQ1gsT0FBTyxHQUFHLEtBQUssQ0FBQyxJQUFJLENBQUMsS0FBSyxJQUFJLEVBQUUsQ0FBQzt3QkFDakMsTUFBTSxHQUFHLElBQUksTUFBTSxDQUFFLE9BQU8sQ0FBQyxPQUFPLENBQUMsTUFBTSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDO3dCQUc5QyxXQUFNLEVBQUUsQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDO2lDQUNyQyxLQUFLLENBQUM7Z0NBQ0gsS0FBSyxFQUFFLE1BQU07NkJBQ2hCLENBQUM7aUNBQ0QsS0FBSyxFQUFHLEVBQUE7O3dCQUpQLE1BQU0sR0FBRyxTQUlGO3dCQUdDLFdBQU0sRUFBRSxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUM7aUNBQ3BDLEtBQUssQ0FBQztnQ0FDSCxLQUFLLEVBQUUsTUFBTTs2QkFDaEIsQ0FBQztpQ0FDRCxLQUFLLENBQUUsS0FBSyxDQUFFO2lDQUNkLElBQUksQ0FBQyxDQUFFLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxHQUFHLENBQUMsQ0FBRSxHQUFHLEtBQUssQ0FBRTtpQ0FDdEMsT0FBTyxDQUFDLFlBQVksRUFBRSxNQUFNLENBQUM7aUNBQzdCLEdBQUcsRUFBRyxFQUFBOzt3QkFQTCxLQUFLLEdBQUcsU0FPSDt3QkFHSyxXQUFNLE9BQU8sQ0FBQyxHQUFHLENBQUUsS0FBSyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUUsVUFBQSxDQUFDO2dDQUNoRCxPQUFPLEVBQUUsQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDO3FDQUN4QixLQUFLLENBQUM7b0NBQ0gsR0FBRyxFQUFFLENBQUMsQ0FBQyxHQUFHO29DQUNWLFVBQVUsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQztpQ0FDekIsQ0FBQztxQ0FDRCxLQUFLLEVBQUcsQ0FBQzs0QkFDbEIsQ0FBQyxDQUFDLENBQUMsRUFBQTs7d0JBUEcsWUFBVSxTQU9iO3dCQUVHLHFCQUFtQixLQUFLLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxVQUFFLENBQUMsRUFBRSxDQUFDOzRCQUMxQyxPQUFPLE1BQU0sQ0FBQyxNQUFNLENBQUMsRUFBRyxFQUFFLENBQUMsRUFBRTtnQ0FDekIsTUFBTSxFQUFFLFNBQU8sQ0FBRSxDQUFDLENBQUUsQ0FBQyxLQUFLOzZCQUM3QixDQUFDLENBQUE7d0JBQ04sQ0FBQyxDQUFDLENBQUM7d0JBR2tCLFdBQU0sT0FBTyxDQUFDLEdBQUcsQ0FBRSxrQkFBZ0IsQ0FBQyxHQUFHLENBQUUsVUFBQSxDQUFDO2dDQUMzRCxPQUFPLEVBQUUsQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDO3FDQUN4QixLQUFLLENBQUM7b0NBQ0gsR0FBRyxFQUFFLENBQUMsQ0FBQyxHQUFHO29DQUNWLFVBQVUsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQztvQ0FDdEIsV0FBVyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsRUFBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQztpQ0FDaEUsQ0FBQztxQ0FDRCxHQUFHLEVBQUcsQ0FBQzs0QkFDaEIsQ0FBQyxDQUFDLENBQUMsRUFBQTs7d0JBUkcsWUFBWSxHQUFHLFNBUWxCO3dCQUVHLGlCQUFpQixHQUFHLFlBQVksQ0FBQyxHQUFHLENBQUMsVUFBRSxDQUFDLEVBQUUsQ0FBQzs0QkFHN0MsSUFBTSxXQUFXLEdBQUcsQ0FBQyxDQUFDLElBQUk7aUNBQ3JCLE1BQU0sQ0FBRSxVQUFBLENBQUMsSUFBSSxPQUFBLENBQUMsQ0FBQyxVQUFVLEtBQUssR0FBRztnQ0FDOUIsQ0FBQyxDQUFFLENBQUMsQ0FBQyxXQUFXLEtBQUssR0FBRyxDQUFFLElBQUksQ0FBRSxDQUFDLENBQUMsV0FBVyxLQUFLLEdBQUcsQ0FBRSxJQUFJLENBQUUsQ0FBQyxDQUFDLFdBQVcsS0FBSyxHQUFHLENBQUUsQ0FBQyxFQUQzRSxDQUMyRSxDQUN4RjtpQ0FDQSxNQUFNLENBQUMsVUFBRSxDQUFDLEVBQUUsQ0FBQztnQ0FDVixPQUFPLENBQUMsR0FBRyxDQUFFLENBQUMsQ0FBQyxjQUFjLEdBQUcsQ0FBRSxDQUFDLENBQUMsY0FBYyxJQUFJLENBQUMsQ0FBRSxDQUFDLENBQUM7NEJBQy9ELENBQUMsRUFBRSxDQUFDLENBQUUsQ0FBQzs0QkFHWCxJQUFNLE9BQU8sR0FBRyxLQUFLLENBQUMsSUFBSSxDQUN0QixJQUFJLEdBQUcsQ0FBRSxDQUFDLENBQUMsSUFBSTtpQ0FDVixNQUFNLENBQUUsVUFBQSxDQUFDO2dDQUNOLE9BQUEsQ0FBQyxDQUFDLFVBQVUsS0FBSyxHQUFHO29DQUNwQixDQUFDLENBQUMsV0FBVyxLQUFLLEdBQUc7b0NBQ3JCLENBQUMsQ0FBQyxXQUFXLEtBQUssR0FBRzs0QkFGckIsQ0FFcUIsQ0FDeEI7aUNBQ0EsR0FBRyxDQUFFLFVBQUEsQ0FBQyxJQUFJLE9BQUEsQ0FBQyxDQUFDLE1BQU0sRUFBUixDQUFRLENBQUUsQ0FDNUIsQ0FBQyxDQUFDLE1BQU0sQ0FBQzs0QkFHVixJQUFNLGdCQUFnQixHQUFHLEtBQUssQ0FBQyxJQUFJLENBQy9CLElBQUksR0FBRyxDQUFFLENBQUMsQ0FBQyxJQUFJO2lDQUNWLE1BQU0sQ0FBRSxVQUFBLENBQUMsSUFBSSxPQUFBLENBQUMsQ0FBQyxVQUFVLEtBQUssR0FBRyxFQUFwQixDQUFvQixDQUFFO2lDQUNuQyxHQUFHLENBQUUsVUFBQSxDQUFDLElBQUksT0FBQSxDQUFDLENBQUMsTUFBTSxFQUFSLENBQVEsQ0FBRSxDQUM1QixDQUFDLENBQUMsTUFBTSxDQUFDOzRCQUdWLE9BQU8sTUFBTSxDQUFDLE1BQU0sQ0FBQyxFQUFHLEVBQUUsa0JBQWdCLENBQUUsQ0FBQyxDQUFFLEVBQUU7Z0NBQzdDLE9BQU8sU0FBQTtnQ0FDUCxnQkFBZ0Isa0JBQUE7Z0NBQ2hCLFlBQVksRUFBRSxXQUFXOzZCQUM1QixDQUFDLENBQUM7d0JBQ1AsQ0FBQyxDQUFDLENBQUM7d0JBRUgsV0FBTyxHQUFHLENBQUMsSUFBSSxHQUFHO2dDQUNkLE1BQU0sRUFBRSxHQUFHO2dDQUNYLElBQUksRUFBRTtvQ0FDRixNQUFNLEVBQUUsS0FBSyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLE1BQU0sRUFBRSxFQUFFLENBQUM7b0NBQzVDLFFBQVEsRUFBRSxLQUFLO29DQUNmLElBQUksRUFBRSxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUk7b0NBQ3JCLElBQUksRUFBRSxpQkFBaUI7b0NBQ3ZCLEtBQUssRUFBRSxNQUFNLENBQUMsS0FBSztvQ0FDbkIsU0FBUyxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUUsTUFBTSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUU7aUNBQy9DOzZCQUNKLEVBQUM7Ozt3QkFHRixXQUFPLEdBQUcsQ0FBQyxJQUFJLEdBQUc7Z0NBQ2QsTUFBTSxFQUFFLEdBQUc7Z0NBQ1gsT0FBTyxFQUFFLEdBQUM7NkJBQ2IsRUFBQzs7OzthQUVULENBQUMsQ0FBQztRQVNILEdBQUcsQ0FBQyxNQUFNLENBQUMsUUFBUSxFQUFFLFVBQU8sR0FBRyxFQUFFLElBQUk7Ozs7Ozt3QkFHckIsVUFBVSxHQUFLLEtBQUssQ0FBQyxJQUFJLFdBQWYsQ0FBZ0I7d0JBR3BCLFdBQU0sRUFBRSxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUM7aUNBQ2hDLEtBQUssQ0FBQztnQ0FDSCxHQUFHLEVBQUUsS0FBSyxDQUFDLElBQUksQ0FBQyxHQUFHLElBQUksS0FBSyxDQUFDLElBQUksQ0FBQyxHQUFHOzZCQUN4QyxDQUFDO2lDQUNELEdBQUcsRUFBRyxFQUFBOzt3QkFKVCxLQUFLLEdBQUcsU0FJQzt3QkFDVCxJQUFJLEdBQUcsS0FBSyxDQUFDLElBQUksQ0FBRSxDQUFDLENBQUUsQ0FBQzs2QkFFeEIsQ0FBQSxVQUFVLEtBQUssS0FBSyxDQUFBLEVBQXBCLGNBQW9CO3dCQUVFLFdBQU0sT0FBTyxDQUFDLEdBQUcsQ0FBRSxJQUFJLENBQUMsa0JBQWtCLENBQUMsR0FBRyxDQUFFLFVBQUEsR0FBRztnQ0FDdEUsT0FBTyxFQUFFLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQztxQ0FDcEIsS0FBSyxDQUFDO29DQUNILEdBQUcsRUFBRSxHQUFHO2lDQUNYLENBQUM7cUNBQ0QsS0FBSyxDQUFDO29DQUNILEdBQUcsRUFBRSxJQUFJO29DQUNULEtBQUssRUFBRSxJQUFJO2lDQUNkLENBQUM7cUNBQ0QsR0FBRyxFQUFHLENBQUM7NEJBQ3BCLENBQUMsQ0FBQyxDQUFDLEVBQUE7O3dCQVZHLFNBQVMsR0FBUSxTQVVwQjt3QkFFSCxJQUFJLENBQUMsZ0JBQWdCLEdBQUcsU0FBUyxDQUFDLEdBQUcsQ0FBRSxVQUFBLENBQUM7NEJBQ3BDLE9BQU8sQ0FBQyxDQUFDLElBQUksQ0FBRSxDQUFDLENBQUUsQ0FBQzt3QkFDdkIsQ0FBQyxDQUFDLENBQUM7Ozt3QkFFSCxJQUFJLENBQUMsZ0JBQWdCLEdBQUcsRUFBRyxDQUFDOzs0QkFJaEMsV0FBTyxHQUFHLENBQUMsSUFBSSxHQUFHOzRCQUNkLE1BQU0sRUFBRSxHQUFHOzRCQUNYLElBQUksRUFBRSxLQUFLLENBQUMsSUFBSSxDQUFFLENBQUMsQ0FBRTt5QkFDeEIsRUFBQzs7O3dCQUdGLFdBQU8sR0FBRyxDQUFDLElBQUksR0FBRztnQ0FDZCxNQUFNLEVBQUUsR0FBRztnQ0FDWCxPQUFPLEVBQUUsR0FBQzs2QkFDYixFQUFDOzs7O2FBRVQsQ0FBQyxDQUFDO1FBTUgsR0FBRyxDQUFDLE1BQU0sQ0FBQyxNQUFNLEVBQUUsVUFBTyxHQUFHLEVBQUUsSUFBSTs7Ozs7Ozt3QkFHdkIsSUFBSSxHQUFRLElBQUksQ0FBQzt3QkFDakIsR0FBRyxHQUFHLEtBQUssQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDO3dCQUNuQixHQUFHLEdBQUcsS0FBSyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUM7d0JBQ3JCLEtBQWlELEtBQUssQ0FBQyxJQUFJLEVBQXpELFNBQVMsZUFBQSxFQUFFLGtCQUFLLEVBQUUsVUFBVSxnQkFBQSxFQUFFLGdDQUFZLENBQWdCO3dCQUU1RCxNQUFNLEdBQUcsVUFBQSxPQUFPOzRCQUNsQixPQUFPLEdBQUcsQ0FBQyxJQUFJLEdBQUc7Z0NBQ2QsTUFBTSxFQUFFLEdBQUc7Z0NBQ1gsT0FBTyxTQUFBOzZCQUNWLENBQUE7d0JBQ0wsQ0FBQyxDQUFDO3dCQUVJLFVBQVUsR0FBRyxVQUFBLE9BQU87NEJBQ3RCLElBQU0sQ0FBQyxHQUFHLElBQUksSUFBSSxDQUFFLE9BQU8sQ0FBRSxDQUFDOzRCQUM5QixJQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsV0FBVyxFQUFHLENBQUM7NEJBQzNCLElBQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxRQUFRLEVBQUcsR0FBRyxDQUFDLENBQUM7NEJBQzVCLElBQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxPQUFPLEVBQUcsQ0FBQzs0QkFFdkIsT0FBTyxJQUFJLElBQUksQ0FBSSxDQUFDLFNBQUksQ0FBQyxTQUFJLENBQUMsY0FBVyxDQUFDLENBQUMsT0FBTyxFQUFHLENBQUM7d0JBQzFELENBQUMsQ0FBQzt3QkFFSSxRQUFRLEdBQUcsVUFBVSxDQUFFLE1BQU0sQ0FBRSxLQUFLLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBRSxDQUFDLENBQUM7NkJBT3ZELFNBQVMsRUFBVCxjQUFTO3dCQUVOLE1BQU0sR0FBRzs0QkFDVCxRQUFRLEVBQUUsS0FBSzs0QkFDZixVQUFVLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBRSxNQUFNLENBQUUsSUFBSSxDQUFFLENBQUM7NEJBQ2pDLFFBQVEsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFFLEtBQUssQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFFO3lCQUMzQyxDQUFDO3dCQUVGLElBQUssQ0FBQyxDQUFDLEdBQUcsRUFBRzs0QkFDVCxNQUFNLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQyxFQUFHLEVBQUUsTUFBTSxFQUFFO2dDQUNoQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBRSxHQUFHLENBQUU7NkJBQ3BCLENBQUMsQ0FBQzt5QkFDTjt3QkFFYyxXQUFNLEVBQUUsQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDO2lDQUNyQyxLQUFLLENBQUcsTUFBTSxDQUFFO2lDQUNoQixLQUFLLEVBQUcsRUFBQTs7d0JBRlAsTUFBTSxHQUFHLFNBRUY7d0JBRWIsSUFBSyxNQUFNLENBQUMsS0FBSyxHQUFHLENBQUMsRUFBRzs0QkFDcEIsV0FBTyxNQUFNLENBQUMsbUJBQW1CLENBQUMsRUFBQzt5QkFDdEM7Ozt3QkFPTCxJQUFLLFVBQVUsSUFBSSxRQUFRLEVBQUk7NEJBQzNCLFdBQU8sTUFBTSxDQUFDLGNBQWMsQ0FBQyxFQUFDO3lCQUNqQzs2QkFHSSxDQUFDLENBQUMsR0FBRyxFQUFMLGNBQUs7d0JBQ1UsV0FBTSxFQUFFLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQztpQ0FDdEMsR0FBRyxDQUFFLEdBQUcsQ0FBRTtpQ0FDVixHQUFHLEVBQUcsRUFBQTs7d0JBRkwsT0FBTyxHQUFHLFNBRUw7d0JBQ1gsSUFBSSxHQUFHLE9BQU8sQ0FBQyxJQUFJLENBQUM7Ozs2QkFJbkIsQ0FBQyxHQUFHLEVBQUosY0FBSTt3QkFFVyxXQUFNLEVBQUUsQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDO2lDQUN0QyxHQUFHLENBQUM7Z0NBQ0QsSUFBSSxFQUFFLE1BQU0sQ0FBQyxNQUFNLENBQUMsRUFBRyxFQUFFLEtBQUssQ0FBQyxJQUFJLEVBQUU7b0NBQ2pDLFFBQVEsVUFBQTtvQ0FDUixPQUFPLEVBQUUsS0FBSztvQ0FDZCxjQUFjLEVBQUUsQ0FBQztpQ0FDcEIsQ0FBQzs2QkFDTCxDQUFDLEVBQUE7O3dCQVBBLE9BQU8sR0FBRyxTQU9WO3dCQUNOLEdBQUcsR0FBRyxPQUFPLENBQUMsR0FBRyxDQUFDOzs0QkFLRixXQUFNLEVBQUUsQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDOzZCQUN0QixLQUFLLENBQUM7NEJBQ0gsR0FBRyxLQUFBO3lCQUNOLENBQUM7NkJBQ0QsR0FBRyxFQUFHLEVBQUE7O3dCQUpyQixPQUFPLEdBQUcsU0FJVzt3QkFFckIsTUFBTSxHQUFHLE9BQU8sQ0FBQyxJQUFJLENBQUUsQ0FBQyxDQUFFLENBQUM7d0JBRWpDLE9BQU8sTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDO3dCQUNyQixPQUFPLEtBQUssQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7d0JBQ3pCLE9BQU8sS0FBSyxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsQ0FBQTt3QkFFM0IsSUFBSSxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUMsRUFBRyxFQUFFLE1BQU0sZUFDL0IsS0FBSyxDQUFDLElBQUksSUFDYixjQUFjLEVBQUUsUUFBUSxHQUFHLE1BQU0sQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsZ0JBQWdCLENBQUMsRUFDNUUsUUFBUSxFQUFFLE1BQU0sQ0FBRSxJQUFJLENBQUUsSUFBSSxNQUFNLENBQUUsUUFBUSxDQUFFLElBQ2hELENBQUE7d0JBRUYsV0FBTSxFQUFFLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQztpQ0FDbEIsR0FBRyxDQUFFLEdBQUcsQ0FBRTtpQ0FDVixHQUFHLENBQUM7Z0NBQ0QsSUFBSSxFQUFFLElBQUk7NkJBQ2IsQ0FBQyxFQUFBOzt3QkFKVixTQUlVLENBQUM7Ozs2QkFRWCxDQUFBLENBQUMsQ0FBQyxHQUFHLElBQUksU0FBUyxDQUFFLElBQUksQ0FBRSxDQUFDLENBQUMsSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsSUFBSSxDQUFDLENBQUMsU0FBUyxDQUFFLENBQUEsRUFBcEUsZUFBb0U7d0JBRTlELFNBQU8sSUFBSSxJQUFJLENBQUUsVUFBVSxDQUFFLENBQUM7d0JBR3BCLFdBQU0sRUFBRSxDQUFDLFVBQVUsQ0FBQyxnQkFBZ0IsQ0FBQztpQ0FDcEQsS0FBSyxDQUFDO2dDQUNILElBQUksRUFBRSxJQUFJOzZCQUNiLENBQUM7aUNBQ0QsR0FBRyxFQUFHLEVBQUE7O3dCQUpELFlBQVUsU0FJVDt3QkFFUCxXQUFNLE9BQU8sQ0FBQyxHQUFHLENBQ2IsU0FBTyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUUsVUFBTSxNQUFNOzs7O2dEQUVaLFdBQU0sS0FBSyxDQUFDLFlBQVksQ0FBQztnREFDbkMsSUFBSSxFQUFFLFFBQVE7Z0RBQ2QsSUFBSSxFQUFFO29EQUNGLElBQUksRUFBRSxxQkFBcUI7b0RBQzNCLElBQUksRUFBRTt3REFDRixNQUFNLEVBQUUsTUFBTSxDQUFDLE1BQU07d0RBQ3JCLElBQUksRUFBRSxNQUFNO3dEQUNaLElBQUksRUFBRSwrQkFBK0I7d0RBQ3JDLEtBQUssRUFBRSxDQUFDLEtBQUcsT0FBTyxFQUFFLHlHQUFvQixDQUFDO3FEQUM1QztpREFDSjs2Q0FDSixDQUFDLEVBQUE7OzRDQVhJLEtBQUssR0FBRyxTQVdaOzs7O2lDQUNMLENBQUMsQ0FDTCxFQUFBOzt3QkFoQkQsU0FnQkMsQ0FBQzt3QkFHWSxXQUFNLEVBQUUsQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDO2lDQUNwQyxLQUFLLENBQUMsRUFFTixDQUFDO2lDQUNELEdBQUcsRUFBRyxFQUFBOzt3QkFKTCxLQUFLLEdBQUcsU0FJSDt3QkFFWCxXQUFNLE9BQU8sQ0FBQyxHQUFHLENBQ2IsS0FBSyxDQUFDLElBQUk7aUNBQ0wsTUFBTSxDQUFFLFVBQUEsSUFBSTtnQ0FDVCxPQUFPLENBQUMsU0FBTyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUUsVUFBQSxNQUFNLElBQUksT0FBQSxNQUFNLENBQUMsTUFBTSxLQUFLLElBQUksQ0FBQyxNQUFNLEVBQTdCLENBQTZCLENBQUUsQ0FBQTs0QkFDeEUsQ0FBQyxDQUFDO2lDQUNELEdBQUcsQ0FBRSxVQUFNLElBQUk7Ozs7Z0RBRUUsV0FBTSxLQUFLLENBQUMsWUFBWSxDQUFDO2dEQUNuQyxJQUFJLEVBQUUsUUFBUTtnREFDZCxJQUFJLEVBQUU7b0RBQ0YsSUFBSSxFQUFFLHFCQUFxQjtvREFDM0IsSUFBSSxFQUFFO3dEQUNGLE1BQU0sRUFBRSxJQUFJLENBQUMsTUFBTTt3REFDbkIsSUFBSSxFQUFFLE1BQU07d0RBQ1osSUFBSSxFQUFFLHdCQUF3Qjt3REFDOUIsS0FBSyxFQUFFLENBQUMsS0FBRyxPQUFPLEVBQUUsd0JBQU0sTUFBSSxDQUFDLFFBQVEsRUFBRyxHQUFDLENBQUMsZUFBSSxNQUFJLENBQUMsT0FBTyxFQUFHLDhEQUFZLGNBQVksaUJBQUksQ0FBQztxREFDL0Y7aURBQ0o7NkNBQ0osQ0FBQyxFQUFBOzs0Q0FYSSxLQUFLLEdBQUcsU0FXWjs7OztpQ0FDTCxDQUFDLENBQ1QsRUFBQTs7d0JBcEJELFNBb0JDLENBQUM7OzZCQUlOLFdBQU8sR0FBRyxDQUFDLElBQUksR0FBRzs0QkFDZCxJQUFJLEVBQUUsR0FBRzs0QkFDVCxNQUFNLEVBQUUsR0FBRzt5QkFDZCxFQUFDOzs7d0JBR0YsV0FBTyxHQUFHLENBQUMsSUFBSSxHQUFHO2dDQUNkLE1BQU0sRUFBRSxHQUFHO2dDQUNYLE9BQU8sRUFBRSxHQUFDOzZCQUNiLEVBQUM7Ozs7YUFFVCxDQUFDLENBQUM7UUFZSCxHQUFHLENBQUMsTUFBTSxDQUFDLFlBQVksRUFBRSxVQUFPLEdBQUcsRUFBRSxJQUFJOzs7Ozs7d0JBRXpCLEdBQUcsR0FBSyxLQUFLLENBQUMsSUFBSSxJQUFmLENBQWdCO3dCQUdiLFdBQU0sRUFBRSxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUM7aUNBQ3BDLEdBQUcsQ0FBRSxHQUFHLENBQUU7aUNBQ1YsR0FBRyxFQUFHLEVBQUE7O3dCQUZMLEtBQUssR0FBRyxTQUVIO3dCQUdLLFdBQU0sRUFBRSxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUM7aUNBQ3ZDLEtBQUssQ0FBQztnQ0FDSCxHQUFHLEtBQUE7Z0NBQ0gsVUFBVSxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDO2dDQUN0QixXQUFXLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUM7NkJBQzFCLENBQUM7aUNBQ0QsR0FBRyxFQUFHLEVBQUE7O3dCQU5MLE9BQU8sR0FBRyxTQU1MO3dCQU1MLEdBQUcsR0FBRyxPQUFPLENBQUMsSUFBSTs2QkFDbkIsTUFBTSxDQUFFLFVBQUEsQ0FBQyxJQUFJLE9BQUEsQ0FBQyxDQUFDLFVBQVUsS0FBSyxHQUFHOzRCQUM5QixDQUFDLENBQUUsQ0FBQyxDQUFDLFdBQVcsS0FBSyxHQUFHLENBQUUsSUFBSSxDQUFFLENBQUMsQ0FBQyxXQUFXLEtBQUssR0FBRyxDQUFFLElBQUksQ0FBRSxDQUFDLENBQUMsV0FBVyxLQUFLLEdBQUcsQ0FBRSxDQUFDLEVBRDNFLENBQzJFLENBQ3hGOzZCQUNBLE1BQU0sQ0FBQyxVQUFFLENBQUMsRUFBRSxDQUFDOzRCQUNWLE9BQU8sQ0FBQyxHQUFHLENBQUUsQ0FBQyxDQUFDLGNBQWMsR0FBRyxDQUFFLENBQUMsQ0FBQyxjQUFjLElBQUksQ0FBQyxDQUFFLENBQUMsQ0FBQzt3QkFDL0QsQ0FBQyxFQUFFLENBQUMsQ0FBRSxDQUFDO3dCQU1MLE9BQU8sR0FBRyxLQUFLLENBQUMsSUFBSSxDQUN0QixJQUFJLEdBQUcsQ0FBRSxPQUFPLENBQUMsSUFBSTs2QkFDaEIsTUFBTSxDQUFFLFVBQUEsQ0FBQyxJQUFJLE9BQUEsQ0FBQyxDQUFDLFVBQVUsS0FBSyxHQUFHLEVBQXBCLENBQW9CLENBQUU7NkJBQ25DLEdBQUcsQ0FBRSxVQUFBLENBQUMsSUFBSSxPQUFBLENBQUMsQ0FBQyxNQUFNLEVBQVIsQ0FBUSxDQUFFLENBQzVCLENBQUMsQ0FBQyxNQUFNLENBQUM7d0JBS0osZ0JBQWdCLEdBQUcsS0FBSyxDQUFDLElBQUksQ0FDL0IsSUFBSSxHQUFHLENBQUUsT0FBTyxDQUFDLElBQUk7NkJBQ2hCLE1BQU0sQ0FBRSxVQUFBLENBQUMsSUFBSSxPQUFBLENBQUMsQ0FBQyxVQUFVLEtBQUssR0FBRyxFQUFwQixDQUFvQixDQUFFOzZCQUNuQyxHQUFHLENBQUUsVUFBQSxDQUFDLElBQUksT0FBQSxDQUFDLENBQUMsTUFBTSxFQUFSLENBQVEsQ0FBRSxDQUM1QixDQUFDLENBQUMsTUFBTSxDQUFDO3dCQUVWLFdBQU8sR0FBRyxDQUFDLElBQUksR0FBRztnQ0FDZCxNQUFNLEVBQUUsR0FBRztnQ0FDWCxJQUFJLEVBQUU7b0NBQ0YsR0FBRyxLQUFBO29DQUNILE9BQU8sU0FBQTtvQ0FDUCxnQkFBZ0Isa0JBQUE7b0NBQ2hCLEtBQUssRUFBRSxPQUFPLENBQUMsSUFBSSxDQUFDLE1BQU07b0NBQzFCLEtBQUssRUFBRSxLQUFLLENBQUMsSUFBSSxDQUFDLEtBQUs7b0NBQ3ZCLGNBQWMsRUFBRSxLQUFLLENBQUMsSUFBSSxDQUFDLGNBQWM7aUNBQzVDOzZCQUNKLEVBQUM7Ozt3QkFFVSxXQUFPLEdBQUcsQ0FBQyxJQUFJLEdBQUcsRUFBRSxNQUFNLEVBQUUsR0FBRyxFQUFFLEVBQUM7Ozs7YUFDckQsQ0FBQyxDQUFBO1FBTUYsR0FBRyxDQUFDLE1BQU0sQ0FBQyxnQkFBZ0IsRUFBRSxVQUFPLEdBQUcsRUFBRSxJQUFJOzs7Ozs7d0JBRS9CLEtBQWdCLEtBQUssQ0FBQyxJQUFJLEVBQXhCLEdBQUcsU0FBQSxFQUFFLElBQUksVUFBQSxDQUFnQjt3QkFDbEIsV0FBTSxFQUFFLENBQUMsVUFBVSxDQUFDLFNBQVMsQ0FBQztpQ0FDeEMsS0FBSyxDQUFDO2dDQUNILEdBQUcsS0FBQTtnQ0FDSCxJQUFJLEVBQUUsYUFBYTs2QkFDdEIsQ0FBQztpQ0FDRCxHQUFHLEVBQUcsRUFBQTs7d0JBTEwsTUFBTSxHQUFHLFNBS0o7NkJBR04sQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFFLENBQUMsQ0FBRSxFQUFqQixjQUFpQjt3QkFDbEIsV0FBTSxFQUFFLENBQUMsVUFBVSxDQUFDLFNBQVMsQ0FBQztpQ0FDekIsR0FBRyxDQUFDO2dDQUNELElBQUksRUFBRTtvQ0FDRixHQUFHLEtBQUE7b0NBQ0gsSUFBSSxNQUFBO29DQUNKLElBQUksRUFBRSxhQUFhO2lDQUN0Qjs2QkFDSixDQUFDLEVBQUE7O3dCQVBOLFNBT00sQ0FBQzs7NEJBR1AsV0FBTSxFQUFFLENBQUMsVUFBVSxDQUFDLFNBQVMsQ0FBQzs2QkFDekIsR0FBRyxDQUFFLE1BQU0sQ0FBRSxNQUFNLENBQUMsSUFBSSxDQUFFLENBQUMsQ0FBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDOzZCQUNuQyxNQUFNLENBQUM7NEJBQ0osSUFBSSxFQUFFO2dDQUNGLElBQUksTUFBQTs2QkFDUDt5QkFDSixDQUFDLEVBQUE7O3dCQU5OLFNBTU0sQ0FBQTs7NEJBR1YsV0FBTyxHQUFHLENBQUMsSUFBSSxHQUFHLEVBQUUsTUFBTSxFQUFFLEdBQUcsRUFBRSxFQUFDOzs7d0JBRXRCLFdBQU8sR0FBRyxDQUFDLElBQUksR0FBRyxFQUFFLE1BQU0sRUFBRSxHQUFHLEVBQUUsRUFBQTs7OzthQUNwRCxDQUFDLENBQUE7UUFNRixHQUFHLENBQUMsTUFBTSxDQUFDLFNBQVMsRUFBRSxVQUFPLEdBQUcsRUFBRSxJQUFJOzs7Ozs7d0JBRXRCLEdBQUcsR0FBSyxLQUFLLENBQUMsSUFBSSxJQUFmLENBQWdCO3dCQUNaLFdBQU0sRUFBRSxDQUFDLFVBQVUsQ0FBQyxTQUFTLENBQUM7aUNBQ3hDLEtBQUssQ0FBQztnQ0FDSCxHQUFHLEtBQUE7Z0NBQ0gsSUFBSSxFQUFFLGFBQWE7NkJBQ3RCLENBQUM7aUNBQ0QsR0FBRyxFQUFHLEVBQUE7O3dCQUxMLE1BQU0sR0FBRyxTQUtKO3dCQUVYLFdBQU8sR0FBRyxDQUFDLElBQUksR0FBRztnQ0FDZCxNQUFNLEVBQUUsR0FBRztnQ0FDWCxJQUFJLEVBQUUsTUFBTSxDQUFDLElBQUksQ0FBRSxDQUFDLENBQUUsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBRSxDQUFDLENBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUc7NkJBQ3ZELEVBQUE7Ozt3QkFHRCxXQUFPLEdBQUcsQ0FBQyxJQUFJLEdBQUcsRUFBRSxNQUFNLEVBQUUsR0FBRyxFQUFFLEVBQUM7Ozs7YUFFekMsQ0FBQyxDQUFDO1FBU0gsR0FBRyxDQUFDLE1BQU0sQ0FBQyxPQUFPLEVBQUUsVUFBTyxHQUFHLEVBQUUsSUFBSTs7Ozs7Ozt3QkFFcEIsUUFBUSxLQUFLLENBQUMsSUFBSSxJQUFmLENBQWdCO3dCQUczQixXQUFNLEVBQUUsQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDO2lDQUN0QixHQUFHLENBQUUsTUFBTSxDQUFFLEtBQUcsQ0FBRSxDQUFDO2lDQUNuQixNQUFNLENBQUM7Z0NBQ0osSUFBSSxFQUFFO29DQUNGLFFBQVEsRUFBRSxJQUFJO2lDQUNqQjs2QkFDSixDQUFDLEVBQUE7O3dCQU5OLFNBTU0sQ0FBQzt3QkFHUyxXQUFNLEVBQUUsQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDO2lDQUN2QyxLQUFLLENBQUM7Z0NBQ0gsR0FBRyxPQUFBO2dDQUNILFVBQVUsRUFBRSxHQUFHOzZCQUNsQixDQUFDO2lDQUNELEdBQUcsRUFBRyxFQUFBOzt3QkFMTCxPQUFPLEdBQUcsU0FLTDt3QkFFWCxXQUFNLE9BQU8sQ0FBQyxHQUFHLENBQUUsT0FBTyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUUsVUFBQSxNQUFNO2dDQUN2QyxPQUFPLEVBQUUsQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDO3FDQUN4QixHQUFHLENBQUUsTUFBTSxDQUFFLE1BQU0sQ0FBQyxHQUFHLENBQUUsQ0FBQztxQ0FDMUIsTUFBTSxDQUFDO29DQUNKLElBQUksRUFBRTt3Q0FDRixXQUFXLEVBQUUsR0FBRztxQ0FDbkI7aUNBQ0osQ0FBQyxDQUFBOzRCQUNWLENBQUMsQ0FBQyxDQUFDLEVBQUE7O3dCQVJILFNBUUcsQ0FBQzt3QkFFVSxXQUFNLEVBQUUsQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDO2lDQUNwQyxHQUFHLENBQUUsS0FBRyxDQUFFO2lDQUNWLEdBQUcsRUFBRyxFQUFBOzt3QkFGTCxVQUFRLFNBRUg7d0JBR0ssV0FBTSxFQUFFLENBQUMsVUFBVSxDQUFDLGdCQUFnQixDQUFDO2lDQUNoRCxLQUFLLENBQUM7Z0NBQ0gsSUFBSSxFQUFFLElBQUk7NkJBQ2IsQ0FBQztpQ0FDRCxHQUFHLEVBQUcsRUFBQTs7d0JBSkwsT0FBTyxHQUFHLFNBSUw7d0JBRVgsV0FBTSxPQUFPLENBQUMsR0FBRyxDQUNiLE9BQU8sQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFFLFVBQU0sTUFBTTs7OztnREFFWixXQUFNLEtBQUssQ0FBQyxZQUFZLENBQUM7Z0RBQ25DLElBQUksRUFBRSxRQUFRO2dEQUNkLElBQUksRUFBRTtvREFDRixJQUFJLEVBQUUscUJBQXFCO29EQUMzQixJQUFJLEVBQUU7d0RBQ0YsTUFBTSxFQUFFLE1BQU0sQ0FBQyxNQUFNO3dEQUNyQixJQUFJLEVBQUUsTUFBTTt3REFDWixJQUFJLEVBQUUsdUNBQXFDLEtBQUcsWUFBTyxDQUFHO3dEQUN4RCxLQUFLLEVBQUUsQ0FBQyxLQUFHLE9BQUssQ0FBQyxJQUFJLENBQUMsS0FBTyxFQUFFLHNGQUFnQixDQUFDO3FEQUNuRDtpREFDSjs2Q0FDSixDQUFDLEVBQUE7OzRDQVhJLEtBQUssR0FBRyxTQVdaOzs7O2lDQUNMLENBQUMsQ0FDTCxFQUFBOzt3QkFoQkQsU0FnQkMsQ0FBQzt3QkFFRixXQUFPLEdBQUcsQ0FBQyxJQUFJLEdBQUcsRUFBRSxNQUFNLEVBQUUsR0FBRyxFQUFFLEVBQUM7Ozt3QkFHbEMsV0FBTyxHQUFHLENBQUMsSUFBSSxHQUFHLEVBQUUsTUFBTSxFQUFFLEdBQUcsRUFBRSxFQUFDOzs7O2FBRXpDLENBQUMsQ0FBQTtRQUVGLFdBQU8sR0FBRyxDQUFDLEtBQUssRUFBRyxFQUFDOztLQUV2QixDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgY2xvdWQgZnJvbSAnd3gtc2VydmVyLXNkayc7XG5pbXBvcnQgKiBhcyBUY2JSb3V0ZXIgZnJvbSAndGNiLXJvdXRlcic7XG5cbmNsb3VkLmluaXQoe1xuICAgIGVudjogcHJvY2Vzcy5lbnYuY2xvdWRcbn0pO1xuXG5jb25zdCBkYjogREIuRGF0YWJhc2UgPSBjbG91ZC5kYXRhYmFzZSggKTtcbmNvbnN0IF8gPSBkYi5jb21tYW5kO1xuXG4vKiogXG4gKiDovazmjaLmoLzmnpflsLzmsrvml7bljLogKzjml7bljLpcbiAqIERhdGUoKS5ub3coKSAvIG5ldyBEYXRlKCkuZ2V0VGltZSgpIOaYr+aXtuS4jeaXtuato+W4uOeahCs4XG4gKiBEYXRlLnRvTG9jYWxTdHJpbmcoICkg5aW95YOP5piv5LiA55u05pivKzDnmoRcbiAqIOWFiOaLv+WIsCArMO+8jOeEtuWQjis4XG4gKi9cbmNvbnN0IGdldE5vdyA9ICggdHMgPSBmYWxzZSApOiBhbnkgPT4ge1xuICAgIGlmICggdHMgKSB7XG4gICAgICAgIHJldHVybiBEYXRlLm5vdyggKTtcbiAgICB9XG4gICAgY29uc3QgdGltZV8wID0gbmV3IERhdGUoIG5ldyBEYXRlKCApLnRvTG9jYWxlU3RyaW5nKCApKTtcbiAgICByZXR1cm4gbmV3IERhdGUoIHRpbWVfMC5nZXRUaW1lKCApICsgOCAqIDYwICogNjAgKiAxMDAwIClcbn1cblxuLyoqXG4gKlxuICogQGRlc2NyaXB0aW9uIOihjOeoi+aooeWdl1xuICogLS0tLS0tLS0g5a2X5q61IC0tLS0tLS0tLS1cbiAgICAgICAgdGl0bGUg5qCH6aKYIHN0cmluZ1xuICohICAgICBkZXN0aW5hdGlvbiDnm67nmoTlnLAgc3RyaW5nXG4gICAgICAgIHdhcm5pbmc6IOaYr+WQpuWPkemAgei/h+acn+itpuWRiixcbiAgICAgICAgc3RhcnRfZGF0ZSDlvIDlp4vml7bpl7QgbnVtYmVyXG4gICAgICAgIGVuZF9kYXRlIOe7k+adn+aXtumXtCBudW1iZXJcbiAgICAgICAgcmVkdWNlX3ByaWNlIOihjOeoi+eri+WHjyBudW1iZXJcbiAgICAgICAgc2FsZXNfdm9sdW1lIOmUgOWUruaAu+minVxuICAgICAgICBmdWxscmVkdWNlX2F0bGVhc3Qg6KGM56iL5ruh5YePIC0g6Zeo5qebIG51bWJlclxuICAgICAgICBmdWxscmVkdWNlX3ZhbHVlcyDooYznqIvmu6Hlh48gLSDlh4/lpJrlsJEgbnVtYmVyXG4gICAgICAgIGNhc2hjb3Vwb25fYXRsZWFzdCDooYznqIvku6Pph5HliLggLSDpl6jmp5sgbnVtYmVyXG4gICAgICAgIGNhc2hjb3Vwb25fdmFsdWVzIOihjOeoi+S7o+mHkeWIuCAtIOmHkeminSBudW1iZXJcbiohICAgICAgcG9zdGFnZSDpgq7otLnnsbvlnosgZGljIFxuKiEgICAgICBwb3N0YWdlZnJlZV9hdGxlYXN0ICDlhY3pgq7pl6jmp5sgbnVtYmVyXG4gICAgICAgIHBheW1lbnQg5LuY5qy+57G75Z6LIGRpYyBcbiAgICAgICAgcHVibGlzaGVkIOaYr+WQpuWPkeW4gyBib29sZWFuXG4gICAgICAgIGNyZWF0ZVRpbWUg5Yib5bu65pe26Ze0XG4gICAgICAgIHVwZGF0ZVRpbWUg5pu05paw5pe26Ze0XG4gICAgICAgIGlzQ2xvc2VkOiDmmK/lkKblt7Lnu4/miYvliqjlhbPpl61cbiAgICAgICAgY2FsbE1vbmV5VGltZXM6IOWPkei1t+WCrOasvuasoeaVsFxuICovXG5leHBvcnQgY29uc3QgbWFpbiA9IGFzeW5jICggZXZlbnQsIGNvbnRleHQgKSA9PiB7XG5cbiAgICBjb25zdCBhcHAgPSBuZXcgVGNiUm91dGVyKHsgZXZlbnQgfSk7XG5cbiAgICAvKipcbiAgICAgKiAtLS0tLS0g6K+35rGCIC0tLS0tLS0tXG4gICAgICoge1xuICAgICAqICAgIHNob3VsZEdldEdvb2RzOiDpu5jorqR0cnVl77yM5Y+v5Lul5LiN5aGr77yM6I635Y+W6KGM56iL5o6o6I2Q5ZWG5ZOBXG4gICAgICogfVxuICAgICAqL1xuICAgIGFwcC5yb3V0ZXIoJ2VudGVyJywgYXN5bmMoIGN0eCwgbmV4dCApID0+IHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGNvbnN0IHNob3VsZEdldEdvb2RzID0gZXZlbnQuZGF0YSA/IGV2ZW50LmRhdGEuc2hvdWxkR2V0R29vZHMgOiB1bmRlZmluZWQ7XG5cbiAgICAgICAgICAgIC8vIOaMieW8gOWni+aXpeacn+ato+W6j++8jOiOt+WPluacgOWkmjLmnaEg5bey5Y+R5biD44CB5pyq57uT5p2f55qE6KGM56iLXG4gICAgICAgICAgICBjb25zdCBkYXRhJCA9IGF3YWl0IGRiLmNvbGxlY3Rpb24oJ3RyaXAnKVxuICAgICAgICAgICAgICAgIC53aGVyZSh7XG4gICAgICAgICAgICAgICAgICAgIGlzQ2xvc2VkOiBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgcHVibGlzaGVkOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICBlbmRfZGF0ZTogXy5ndCggZ2V0Tm93KCB0cnVlICkpXG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAubGltaXQoIDIgKVxuICAgICAgICAgICAgICAgIC5vcmRlckJ5KCdzdGFydF9kYXRlJywgJ2FzYycpXG4gICAgICAgICAgICAgICAgLmdldCggKTtcblxuICAgICAgICAgICAgbGV0IHRyaXBzID0gZGF0YSQuZGF0YTtcblxuICAgICAgICAgICAgLy8g5ouJ5Y+W5pyA5paw6KGM56iL55qE5o6o6I2Q5ZWG5ZOBXG4gICAgICAgICAgICBpZiAoKCAhIXRyaXBzWyAwIF0gJiYgc2hvdWxkR2V0R29vZHMgPT09IHVuZGVmaW5lZCApIHx8IHNob3VsZEdldEdvb2RzID09PSB0cnVlICkge1xuICAgICAgICAgICAgICAgIGNvbnN0IHRyaXBPbmVQcm9kdWN0cyQgPSBhd2FpdCBQcm9taXNlLmFsbCggdHJpcHNbIDAgXS5zZWxlY3RlZFByb2R1Y3RJZHMubWFwKCBwaWQgPT4ge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gY2xvdWQuY2FsbEZ1bmN0aW9uKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIF9pZDogcGlkLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJHVybDogJ2RldGFpbCdcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiAnZ29vZCdcbiAgICAgICAgICAgICAgICAgICAgfSkudGhlbiggcmVzID0+IHJlcy5yZXN1bHQuZGF0YSApO1xuICAgICAgICAgICAgICAgIH0pKTtcbiAgICAgICAgICAgICAgICB0cmlwc1sgMCBdID0gT2JqZWN0LmFzc2lnbih7IH0sIHRyaXBzWyAwIF0sIHtcbiAgICAgICAgICAgICAgICAgICAgcHJvZHVjdHM6IHRyaXBPbmVQcm9kdWN0cyRcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIGN0eC5ib2R5ID0ge1xuICAgICAgICAgICAgICAgIHN0YXR1czogMjAwLFxuICAgICAgICAgICAgICAgIGRhdGE6IHRyaXBzXG4gICAgICAgICAgICB9O1xuXG4gICAgICAgIH0gY2F0Y2ggKCBlICkge1xuICAgICAgICAgICAgcmV0dXJuIGN0eC5ib2R5ID0ge1xuICAgICAgICAgICAgICAgIHN0YXR1czogNTAwLFxuICAgICAgICAgICAgICAgIG1lc3NhZ2U6IGVcbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgIGFwcC5yb3V0ZXIoJ2xpc3QnLCBhc3luYyggY3R4LCBuZXh0ICkgPT4ge1xuICAgICAgICB0cnkge1xuXG4gICAgICAgICAgICAvLyDmn6Xor6LmnaHmlbBcbiAgICAgICAgICAgIGNvbnN0IGxpbWl0ID0gMjA7XG4gICAgICAgICAgICBjb25zdCBzZWFyY2gkID0gZXZlbnQuZGF0YS50aXRsZSB8fCAnJztcbiAgICAgICAgICAgIGNvbnN0IHNlYXJjaCA9IG5ldyBSZWdFeHAoIHNlYXJjaCQucmVwbGFjZSgvXFxzKy9nLCBcIlwiKSwgJ2knKTtcblxuICAgICAgICAgICAgLy8g6I635Y+W5oC75pWwXG4gICAgICAgICAgICBjb25zdCB0b3RhbCQgPSBhd2FpdCBkYi5jb2xsZWN0aW9uKCd0cmlwJylcbiAgICAgICAgICAgICAgICAud2hlcmUoe1xuICAgICAgICAgICAgICAgICAgICB0aXRsZTogc2VhcmNoXG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAuY291bnQoICk7XG5cbiAgICAgICAgICAgIC8vIOiOt+WPluaVsOaNrlxuICAgICAgICAgICAgY29uc3QgZGF0YSQgPSBhd2FpdCBkYi5jb2xsZWN0aW9uKCd0cmlwJylcbiAgICAgICAgICAgICAgICAud2hlcmUoe1xuICAgICAgICAgICAgICAgICAgICB0aXRsZTogc2VhcmNoXG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAubGltaXQoIGxpbWl0IClcbiAgICAgICAgICAgICAgICAuc2tpcCgoIGV2ZW50LmRhdGEucGFnZSAtIDEgKSAqIGxpbWl0IClcbiAgICAgICAgICAgICAgICAub3JkZXJCeSgndXBkYXRlVGltZScsICdkZXNjJylcbiAgICAgICAgICAgICAgICAuZ2V0KCApO1xuXG4gICAgICAgICAgICAvLyDojrflj5bmr4/ourrooYznqIvnmoTorqLljZXmlbBcbiAgICAgICAgICAgIGNvbnN0IG9yZGVycyQgPSBhd2FpdCBQcm9taXNlLmFsbCggZGF0YSQuZGF0YS5tYXAoIHggPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiBkYi5jb2xsZWN0aW9uKCdvcmRlcicpXG4gICAgICAgICAgICAgICAgICAgIC53aGVyZSh7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aWQ6IHguX2lkLFxuICAgICAgICAgICAgICAgICAgICAgICAgcGF5X3N0YXR1czogXy5uZXEoJzAnKVxuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAuY291bnQoICk7XG4gICAgICAgICAgICB9KSk7XG5cbiAgICAgICAgICAgIGNvbnN0IGluamVjdE9yZGVyQ291bnQgPSBkYXRhJC5kYXRhLm1hcCgoIHgsIGsgKSA9PiB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIE9iamVjdC5hc3NpZ24oeyB9LCB4LCB7XG4gICAgICAgICAgICAgICAgICAgIG9yZGVyczogb3JkZXJzJFsgayBdLnRvdGFsXG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAvLyDojrflj5bmr4/ourrooYznqIvnmoTplIDllK7pop1cbiAgICAgICAgICAgIGNvbnN0IHNhbGVzVm9sdW1lJCA9IGF3YWl0IFByb21pc2UuYWxsKCBpbmplY3RPcmRlckNvdW50Lm1hcCggeCA9PiB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGRiLmNvbGxlY3Rpb24oJ29yZGVyJylcbiAgICAgICAgICAgICAgICAgICAgLndoZXJlKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRpZDogeC5faWQsXG4gICAgICAgICAgICAgICAgICAgICAgICBwYXlfc3RhdHVzOiBfLm5lcSgnMCcpLFxuICAgICAgICAgICAgICAgICAgICAgICAgYmFzZV9zdGF0dXM6IF8ub3IoIF8uZXEoJzAnKSxfLmVxKCcxJyksIF8uZXEoJzInKSwgXy5lcSgnMycpKVxuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAuZ2V0KCApO1xuICAgICAgICAgICAgfSkpXG5cbiAgICAgICAgICAgIGNvbnN0IGluamVjdFNhbGVzVm9sdW1lID0gc2FsZXNWb2x1bWUkLm1hcCgoIG8sIGsgKSA9PiB7XG5cbiAgICAgICAgICAgICAgICAvLyDplIDph49cbiAgICAgICAgICAgICAgICBjb25zdCBzYWxlc1ZvbHVtZSA9IG8uZGF0YVxuICAgICAgICAgICAgICAgICAgICAuZmlsdGVyKCB4ID0+IHgucGF5X3N0YXR1cyAhPT0gJzAnICYmXG4gICAgICAgICAgICAgICAgICAgICAgICAoKCB4LmJhc2Vfc3RhdHVzID09PSAnMScgKSB8fCAoIHguYmFzZV9zdGF0dXMgPT09ICcyJyApIHx8ICggeC5iYXNlX3N0YXR1cyA9PT0gJzMnICkpXG4gICAgICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgICAgICAgLnJlZHVjZSgoIHgsIHkgKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4geCArICggeS5hbGxvY2F0ZWRQcmljZSAqICggeS5hbGxvY2F0ZWRDb3VudCB8fCAwICkpO1xuICAgICAgICAgICAgICAgICAgICB9LCAwICk7XG5cbiAgICAgICAgICAgICAgICAvLyDmgLvkubDlrrZcbiAgICAgICAgICAgICAgICBjb25zdCBjbGllbnRzID0gQXJyYXkuZnJvbShcbiAgICAgICAgICAgICAgICAgICAgbmV3IFNldCggby5kYXRhXG4gICAgICAgICAgICAgICAgICAgICAgICAuZmlsdGVyKCB4ID0+IFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHgucGF5X3N0YXR1cyAhPT0gJzAnICYmXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgeC5iYXNlX3N0YXR1cyAhPT0gJzQnICYmIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHguYmFzZV9zdGF0dXMgIT09ICc1J1xuICAgICAgICAgICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICAgICAgICAgICAgLm1hcCggeCA9PiB4Lm9wZW5pZCApXG4gICAgICAgICAgICAgICAgKSkubGVuZ3RoO1xuXG4gICAgICAgICAgICAgICAgLy8g5pyq5LuY5qy+5Lmw5a62XG4gICAgICAgICAgICAgICAgY29uc3Qgbm90UGF5QWxsQ2xpZW50cyA9IEFycmF5LmZyb20oXG4gICAgICAgICAgICAgICAgICAgIG5ldyBTZXQoIG8uZGF0YVxuICAgICAgICAgICAgICAgICAgICAgICAgLmZpbHRlciggeCA9PiB4LnBheV9zdGF0dXMgPT09ICcxJyApXG4gICAgICAgICAgICAgICAgICAgICAgICAubWFwKCB4ID0+IHgub3BlbmlkIClcbiAgICAgICAgICAgICAgICApKS5sZW5ndGg7XG5cblxuICAgICAgICAgICAgICAgIHJldHVybiBPYmplY3QuYXNzaWduKHsgfSwgaW5qZWN0T3JkZXJDb3VudFsgayBdLCB7XG4gICAgICAgICAgICAgICAgICAgIGNsaWVudHMsXG4gICAgICAgICAgICAgICAgICAgIG5vdFBheUFsbENsaWVudHMsXG4gICAgICAgICAgICAgICAgICAgIHNhbGVzX3ZvbHVtZTogc2FsZXNWb2x1bWVcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICByZXR1cm4gY3R4LmJvZHkgPSB7XG4gICAgICAgICAgICAgICAgc3RhdHVzOiAyMDAsXG4gICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgICBzZWFyY2g6IGV2ZW50LmRhdGEudGl0bGUucmVwbGFjZSgvXFxzKy9nLCAnJyksXG4gICAgICAgICAgICAgICAgICAgIHBhZ2VTaXplOiBsaW1pdCxcbiAgICAgICAgICAgICAgICAgICAgcGFnZTogZXZlbnQuZGF0YS5wYWdlLFxuICAgICAgICAgICAgICAgICAgICBkYXRhOiBpbmplY3RTYWxlc1ZvbHVtZSxcbiAgICAgICAgICAgICAgICAgICAgdG90YWw6IHRvdGFsJC50b3RhbCxcbiAgICAgICAgICAgICAgICAgICAgdG90YWxQYWdlOiBNYXRoLmNlaWwoIHRvdGFsJC50b3RhbCAvIGxpbWl0IClcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgIH0gY2F0Y2ggKCBlICkge1xuICAgICAgICAgICAgcmV0dXJuIGN0eC5ib2R5ID0ge1xuICAgICAgICAgICAgICAgIHN0YXR1czogNTAwLFxuICAgICAgICAgICAgICAgIG1lc3NhZ2U6IGVcbiAgICAgICAgICAgIH07XG4gICAgICAgIH0gXG4gICAgfSk7XG4gICAgXG4gICAgLyoqXG4gICAgICogQGRlc2NyaXB0aW9uXG4gICAgICog6KGM56iL6K+m5oOFXG4gICAgICoge1xuICAgICAqICAgICAgbW9yZURldGFpbDogdW5kZWZpbmVkIHwgZmFsc2UgfCB0cnVlXG4gICAgICogfVxuICAgICAqL1xuICAgIGFwcC5yb3V0ZXIoJ2RldGFpbCcsIGFzeW5jKCBjdHgsIG5leHQgKSA9PiB7XG4gICAgICAgIHRyeSB7XG5cbiAgICAgICAgICAgIGNvbnN0IHsgbW9yZURldGFpbCB9ID0gZXZlbnQuZGF0YTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgLy8g6I635Y+W5Z+65pys6K+m5oOFXG4gICAgICAgICAgICBjb25zdCBkYXRhJCA9IGF3YWl0IGRiLmNvbGxlY3Rpb24oJ3RyaXAnKVxuICAgICAgICAgICAgICAgICAgICAud2hlcmUoe1xuICAgICAgICAgICAgICAgICAgICAgICAgX2lkOiBldmVudC5kYXRhLl9pZCB8fCBldmVudC5kYXRhLnRpZFxuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAuZ2V0KCApO1xuICAgICAgICAgICAgY29uc3QgbWV0YSA9IGRhdGEkLmRhdGFbIDAgXTtcblxuICAgICAgICAgICAgaWYgKCBtb3JlRGV0YWlsICE9PSBmYWxzZSApIHtcbiAgICAgICAgICAgICAgICAvLyDpgJrov4flt7LpgInnmoTllYblk4FpZHMs5ou/5Yiw5a+55bqU55qE5Zu+54mH44CBdGl0bGXjgIFfaWRcbiAgICAgICAgICAgICAgICBjb25zdCBwcm9kdWN0cyQ6IGFueSA9IGF3YWl0IFByb21pc2UuYWxsKCBtZXRhLnNlbGVjdGVkUHJvZHVjdElkcy5tYXAoIHBpZCA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBkYi5jb2xsZWN0aW9uKCdnb29kcycpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLndoZXJlKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgX2lkOiBwaWRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5maWVsZCh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGltZzogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGl0bGU6IHRydWVcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5nZXQoICk7XG4gICAgICAgICAgICAgICAgfSkpO1xuXG4gICAgICAgICAgICAgICAgbWV0YS5zZWxlY3RlZFByb2R1Y3RzID0gcHJvZHVjdHMkLm1hcCggeCA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB4LmRhdGFbIDAgXTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgbWV0YS5zZWxlY3RlZFByb2R1Y3RzID0gWyBdO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgXG5cbiAgICAgICAgICAgIHJldHVybiBjdHguYm9keSA9IHtcbiAgICAgICAgICAgICAgICBzdGF0dXM6IDIwMCxcbiAgICAgICAgICAgICAgICBkYXRhOiBkYXRhJC5kYXRhWyAwIF1cbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgfSBjYXRjaCggZSApIHtcbiAgICAgICAgICAgIHJldHVybiBjdHguYm9keSA9IHtcbiAgICAgICAgICAgICAgICBzdGF0dXM6IDUwMCxcbiAgICAgICAgICAgICAgICBtZXNzYWdlOiBlXG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICAvKipcbiAgICAgKiBAZGVzY3JpcHRpb25cbiAgICAgKiDliJvlu7ogLyDnvJbovpHlvZPliY3ooYznqItcbiAgICAgKi9cbiAgICBhcHAucm91dGVyKCdlZGl0JywgYXN5bmMoIGN0eCwgbmV4dCApID0+IHtcbiAgICAgICAgdHJ5IHtcblxuICAgICAgICAgICAgbGV0IHRyaXA6IGFueSA9IG51bGw7XG4gICAgICAgICAgICBsZXQgX2lkID0gZXZlbnQuZGF0YS5faWQ7XG4gICAgICAgICAgICBjb25zdCB0aWQgPSBldmVudC5kYXRhLl9pZDtcbiAgICAgICAgICAgIGNvbnN0IHsgcHVibGlzaGVkLCB0aXRsZSwgc3RhcnRfZGF0ZSwgcmVkdWNlX3ByaWNlIH0gPSBldmVudC5kYXRhO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICBjb25zdCBnZXRFcnIgPSBtZXNzYWdlID0+IHtcbiAgICAgICAgICAgICAgICByZXR1cm4gY3R4LmJvZHkgPSB7XG4gICAgICAgICAgICAgICAgICAgIHN0YXR1czogNTAwLFxuICAgICAgICAgICAgICAgICAgICBtZXNzYWdlXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgY29uc3QgZml4RW5kRGF0ZSA9IGVuZERhdGUgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IHQgPSBuZXcgRGF0ZSggZW5kRGF0ZSApO1xuICAgICAgICAgICAgICAgIGNvbnN0IHkgPSB0LmdldEZ1bGxZZWFyKCApO1xuICAgICAgICAgICAgICAgIGNvbnN0IG0gPSB0LmdldE1vbnRoKCApICsgMTtcbiAgICAgICAgICAgICAgICBjb25zdCBkID0gdC5nZXREYXRlKCApO1xuXG4gICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBEYXRlKGAke3l9LyR7bX0vJHtkfSAyMDowMDowMGApLmdldFRpbWUoICk7XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICBjb25zdCBlbmRfZGF0ZSA9IGZpeEVuZERhdGUoIE51bWJlciggZXZlbnQuZGF0YS5lbmRfZGF0ZSApKTtcblxuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiDmoKHpqowx77yaXG4gICAgICAgICAgICAgKiDlpoLmnpzooYznqIvpgInmi6nigJzlt7Llj5HluIPigJ1cbiAgICAgICAgICAgICAqIOmcgOimgeajgOafpeaYr+WQpuaciSDlt7Llj5HluIPooYznqIvnmoTnu5PmnZ/ml7bpl7Qg5aSn5LqO562J5LqOIOW9k+WJjeihjOeoi+eahOW8gOWni+aXtumXtFxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICBpZiAoIHB1Ymxpc2hlZCApIHtcblxuICAgICAgICAgICAgICAgIGxldCB3aGVyZSQgPSB7XG4gICAgICAgICAgICAgICAgICAgIGlzQ2xvc2VkOiBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgc3RhcnRfZGF0ZTogXy5sdCggZ2V0Tm93KCB0cnVlICkpLFxuICAgICAgICAgICAgICAgICAgICBlbmRfZGF0ZTogXy5ndGUoIGV2ZW50LmRhdGEuc3RhcnRfZGF0ZSApXG4gICAgICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgICAgIGlmICggISF0aWQgKSB7XG4gICAgICAgICAgICAgICAgICAgIHdoZXJlJCA9IE9iamVjdC5hc3NpZ24oeyB9LCB3aGVyZSQsIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIF9pZDogXy5uZXEoIHRpZCApXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGNvbnN0IHJ1bGUxJCA9IGF3YWl0IGRiLmNvbGxlY3Rpb24oJ3RyaXAnKVxuICAgICAgICAgICAgICAgICAgICAud2hlcmUoICB3aGVyZSQgKVxuICAgICAgICAgICAgICAgICAgICAuY291bnQoICk7XG4gICAgICAgIFxuICAgICAgICAgICAgICAgIGlmICggcnVsZTEkLnRvdGFsID4gMCApIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGdldEVycign5byA5aeL5pe26Ze05b+F6aG75aSn5LqO5LiK6Laf6KGM56iL55qE57uT5p2f5pe26Ze0Jyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBcblxuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiDmoKHpqowyOlxuICAgICAgICAgICAgICog57uT5p2f5pe26Ze05LiN6IO95bCP5LqO5byA5aeL5pe26Ze0XG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIGlmICggc3RhcnRfZGF0ZSA+PSBlbmRfZGF0ZSAgKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGdldEVycign5byA5aeL5pe26Ze05b+F6aG75aSn5LqO57uT5p2f5pe26Ze0Jyk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8qKiDojrflj5bnm67moId0cmlwICovXG4gICAgICAgICAgICBpZiAoICEhX2lkICkge1xuICAgICAgICAgICAgICAgIGNvbnN0IHJlc3VsdCQgPSBhd2FpdCBkYi5jb2xsZWN0aW9uKCd0cmlwJylcbiAgICAgICAgICAgICAgICAgICAgLmRvYyggX2lkIClcbiAgICAgICAgICAgICAgICAgICAgLmdldCggKTtcbiAgICAgICAgICAgICAgICB0cmlwID0gcmVzdWx0JC5kYXRhO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyDliJvlu7ogXG4gICAgICAgICAgICBpZiAoICFfaWQgKSB7XG4gICAgXG4gICAgICAgICAgICAgICAgY29uc3QgY3JlYXRlJCA9IGF3YWl0IGRiLmNvbGxlY3Rpb24oJ3RyaXAnKVxuICAgICAgICAgICAgICAgICAgICAuYWRkKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRhdGE6IE9iamVjdC5hc3NpZ24oeyB9LCBldmVudC5kYXRhLCB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZW5kX2RhdGUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgd2FybmluZzogZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FsbE1vbmV5VGltZXM6IDBcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIF9pZCA9IGNyZWF0ZSQuX2lkO1xuICAgIFxuICAgICAgICAgICAgLy8g57yW6L6RXG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgIFxuICAgICAgICAgICAgICAgIGNvbnN0IG9yaWdpbiQgPSBhd2FpdCBkYi5jb2xsZWN0aW9uKCd0cmlwJylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC53aGVyZSh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgX2lkXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLmdldCggKTtcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICBjb25zdCBvcmlnaW4gPSBvcmlnaW4kLmRhdGFbIDAgXTtcbiAgICBcbiAgICAgICAgICAgICAgICBkZWxldGUgb3JpZ2luWydfaWQnXTtcbiAgICAgICAgICAgICAgICBkZWxldGUgZXZlbnQuZGF0YVsnX2lkJ107XG4gICAgICAgICAgICAgICAgZGVsZXRlIGV2ZW50LmRhdGFbJ3NhbGVzX3ZvbHVtZSddXG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgY29uc3QgdGVtcCA9IE9iamVjdC5hc3NpZ24oeyB9LCBvcmlnaW4sIHtcbiAgICAgICAgICAgICAgICAgICAgLi4uZXZlbnQuZGF0YSxcbiAgICAgICAgICAgICAgICAgICAgY2FsbE1vbmV5VGltZXM6IGVuZF9kYXRlID4gb3JpZ2luWydlbmRfZGF0ZSddID8gMCA6IG9yaWdpblsnY2FsbE1vbmV5VGltZXMnXSxcbiAgICAgICAgICAgICAgICAgICAgaXNDbG9zZWQ6IGdldE5vdyggdHJ1ZSApID49IE51bWJlciggZW5kX2RhdGUgKSBcbiAgICAgICAgICAgICAgICB9KVxuICAgIFxuICAgICAgICAgICAgICAgIGF3YWl0IGRiLmNvbGxlY3Rpb24oJ3RyaXAnKVxuICAgICAgICAgICAgICAgICAgICAgICAgLmRvYyggX2lkIClcbiAgICAgICAgICAgICAgICAgICAgICAgIC5zZXQoe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGE6IHRlbXBcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIOaOqOmAgVxuICAgICAgICAgICAgICog5Yib5bu65pe25YCZ55qE5Y+R5biD44CBXG4gICAgICAgICAgICAgKiDnvJbovpHnmoTml7blgJnlj5HluINcbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgaWYgKCghdGlkICYmIHB1Ymxpc2hlZCApIHx8ICggISF0cmlwICYmICF0cmlwLnB1Ymxpc2hlZCAmJiAhIXB1Ymxpc2hlZCApKSB7XG5cbiAgICAgICAgICAgICAgICBjb25zdCB0aW1lID0gbmV3IERhdGUoIHN0YXJ0X2RhdGUgKTtcblxuICAgICAgICAgICAgICAgIC8vIOaOqOmAgeS7o+i0remAmuefpVxuICAgICAgICAgICAgICAgIGNvbnN0IG1lbWJlcnMgPSBhd2FpdCBkYi5jb2xsZWN0aW9uKCdtYW5hZ2VyLW1lbWJlcicpXG4gICAgICAgICAgICAgICAgLndoZXJlKHtcbiAgICAgICAgICAgICAgICAgICAgcHVzaDogdHJ1ZVxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLmdldCggKTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIGF3YWl0IFByb21pc2UuYWxsKFxuICAgICAgICAgICAgICAgICAgICBtZW1iZXJzLmRhdGEubWFwKCBhc3luYyBtZW1iZXIgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gNOOAgeiwg+eUqOaOqOmAgVxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgcHVzaCQgPSBhd2FpdCBjbG91ZC5jYWxsRnVuY3Rpb24oe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6ICdjb21tb24nLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJHVybDogJ3B1c2gtdGVtcGxhdGUtY2xvdWQnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvcGVuaWQ6IG1lbWJlci5vcGVuaWQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiAndHJpcCcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYWdlOiAncGFnZXMvbWFuYWdlci10cmlwLWxpc3QvaW5kZXgnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGV4dHM6IFtgJHt0aXRsZX1gLCBg5paw6KGM56iL5bey5o6o6YCB5a6i5oi3LOS4uuS9oOW8gOmAmuS6huiuouWNleaOqOmAgWBdXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICApO1xuXG4gICAgICAgICAgICAgICAgLy8g5o6o6YCB5a6i5oi36YCa55+lXG4gICAgICAgICAgICAgICAgY29uc3QgdXNlcnMgPSBhd2FpdCBkYi5jb2xsZWN0aW9uKCd1c2VyJylcbiAgICAgICAgICAgICAgICAgICAgLndoZXJlKHtcblxuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAuZ2V0KCApO1xuXG4gICAgICAgICAgICAgICAgYXdhaXQgUHJvbWlzZS5hbGwoXG4gICAgICAgICAgICAgICAgICAgIHVzZXJzLmRhdGFcbiAgICAgICAgICAgICAgICAgICAgICAgIC5maWx0ZXIoIHVzZXIgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiAhbWVtYmVycy5kYXRhLmZpbmQoIG1lbWJlciA9PiBtZW1iZXIub3BlbmlkID09PSB1c2VyLm9wZW5pZCApXG4gICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAgICAgLm1hcCggYXN5bmMgdXNlciA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gNOOAgeiwg+eUqOaOqOmAgSBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBwdXNoJCA9IGF3YWl0IGNsb3VkLmNhbGxGdW5jdGlvbih7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6ICdjb21tb24nLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAkdXJsOiAncHVzaC10ZW1wbGF0ZS1jbG91ZCcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb3BlbmlkOiB1c2VyLm9wZW5pZCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiAndHJpcCcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGFnZTogJ3BhZ2VzL3RyaXAtZW50ZXIvaW5kZXgnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRleHRzOiBbYCR7dGl0bGV9YCwgYOS7o+i0reWcqCR7dGltZS5nZXRNb250aCggKSsxfeaciCR7dGltZS5nZXREYXRlKCApfeaXpeW8gOWni++8geaXoOmXqOanm+eri+WHjyR7cmVkdWNlX3ByaWNlfeWFg++8gWBdXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgKTtcblxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gY3R4LmJvZHkgPSB7XG4gICAgICAgICAgICAgICAgZGF0YTogX2lkLFxuICAgICAgICAgICAgICAgIHN0YXR1czogMjAwXG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgIFxuICAgICAgICB9IGNhdGNoKCBlICkge1xuICAgICAgICAgICAgcmV0dXJuIGN0eC5ib2R5ID0ge1xuICAgICAgICAgICAgICAgIHN0YXR1czogNTAwLFxuICAgICAgICAgICAgICAgIG1lc3NhZ2U6IGVcbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgIC8qKiBcbiAgICAgKiBAZGVzY3JpcHRpb25cbiAgICAgKiDojrflj5booYznqIvlupXkuIvnmoTln7rmnKzkuJrliqHmlbDmja5cbiAgICAgKiDplIDllK7mgLvpop3jgIFcbiAgICAgKiDlrqLmiLfmgLvmlbDjgIFcbiAgICAgKiDmnKrku5jlsL7mrL7lrqLmiLfmlbDph4/jgIFcbiAgICAgKiDmgLvorqLljZXmlbDjgIFcbiAgICAgKiDooYznqIvlkI3np7DjgIFcbiAgICAgKiDlt7Llj5HpgIHlgqzmrL7mrKHmlbBcbiAgICAgKi9cbiAgICBhcHAucm91dGVyKCdvcmRlci1pbmZvJywgYXN5bmMoIGN0eCwgbmV4dCApID0+IHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGNvbnN0IHsgdGlkIH0gPSBldmVudC5kYXRhO1xuXG4gICAgICAgICAgICAvKiog6KGM56iL6K+m5oOFICovXG4gICAgICAgICAgICBjb25zdCB0cmlwJCA9IGF3YWl0IGRiLmNvbGxlY3Rpb24oJ3RyaXAnKVxuICAgICAgICAgICAgICAgIC5kb2MoIHRpZCApXG4gICAgICAgICAgICAgICAgLmdldCggKTtcbiAgICAgICAgXG4gICAgICAgICAgICAvLyDojrflj5booYznqIvlupXkuIvmiYDmnInnmoTorqLljZVcbiAgICAgICAgICAgIGNvbnN0IG9yZGVycyQgPSBhd2FpdCBkYi5jb2xsZWN0aW9uKCdvcmRlcicpXG4gICAgICAgICAgICAgICAgLndoZXJlKHtcbiAgICAgICAgICAgICAgICAgICAgdGlkLFxuICAgICAgICAgICAgICAgICAgICBwYXlfc3RhdHVzOiBfLm5lcSgnMCcpLFxuICAgICAgICAgICAgICAgICAgICBiYXNlX3N0YXR1czogXy5uZXEoJzUnKVxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLmdldCggKTtcblxuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiDmgLvmlLbnm4pcbiAgICAgICAgICAgICAqICHoh7PlsJHlt7Lku5jorqLph5HvvIzoh7PlsJHlt7Lnu4/osIPoioLllK7ku7fjgIHmlbDph49cbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgY29uc3Qgc3VtID0gb3JkZXJzJC5kYXRhXG4gICAgICAgICAgICAgICAgLmZpbHRlciggeCA9PiB4LnBheV9zdGF0dXMgIT09ICcwJyAmJlxuICAgICAgICAgICAgICAgICAgICAoKCB4LmJhc2Vfc3RhdHVzID09PSAnMScgKSB8fCAoIHguYmFzZV9zdGF0dXMgPT09ICcyJyApIHx8ICggeC5iYXNlX3N0YXR1cyA9PT0gJzMnICkpXG4gICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICAgIC5yZWR1Y2UoKCB4LCB5ICkgPT4ge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4geCArICggeS5hbGxvY2F0ZWRQcmljZSAqICggeS5hbGxvY2F0ZWRDb3VudCB8fCAwICkpO1xuICAgICAgICAgICAgICAgIH0sIDAgKTtcblxuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiDmgLvlrqLmiLfmlbDph49cbiAgICAgICAgICAgICAqICHoh7PlsJHlt7Lku5jorqLph5FcbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgY29uc3QgY2xpZW50cyA9IEFycmF5LmZyb20oXG4gICAgICAgICAgICAgICAgbmV3IFNldCggb3JkZXJzJC5kYXRhXG4gICAgICAgICAgICAgICAgICAgIC5maWx0ZXIoIHggPT4geC5wYXlfc3RhdHVzICE9PSAnMCcgKVxuICAgICAgICAgICAgICAgICAgICAubWFwKCB4ID0+IHgub3BlbmlkIClcbiAgICAgICAgICAgICkpLmxlbmd0aDtcblxuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiDmgLvmnKrkuqTlsL7mrL7lrqLmiLfmlbDph49cbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgY29uc3Qgbm90UGF5QWxsQ2xpZW50cyA9IEFycmF5LmZyb20oXG4gICAgICAgICAgICAgICAgbmV3IFNldCggb3JkZXJzJC5kYXRhXG4gICAgICAgICAgICAgICAgICAgIC5maWx0ZXIoIHggPT4geC5wYXlfc3RhdHVzID09PSAnMScgKVxuICAgICAgICAgICAgICAgICAgICAubWFwKCB4ID0+IHgub3BlbmlkIClcbiAgICAgICAgICAgICkpLmxlbmd0aDtcblxuICAgICAgICAgICAgcmV0dXJuIGN0eC5ib2R5ID0ge1xuICAgICAgICAgICAgICAgIHN0YXR1czogMjAwLFxuICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgc3VtLCAvLyDplIDllK7mgLvpop1cbiAgICAgICAgICAgICAgICAgICAgY2xpZW50cywgLy8g5a6i5oi35oC75pWwXG4gICAgICAgICAgICAgICAgICAgIG5vdFBheUFsbENsaWVudHMsIC8vIOacquS7mOWwvuasvuWuouaIt+aVsOmHj1xuICAgICAgICAgICAgICAgICAgICBjb3VudDogb3JkZXJzJC5kYXRhLmxlbmd0aCwgLy8g5oC76K6i5Y2V5pWwLFxuICAgICAgICAgICAgICAgICAgICB0aXRsZTogdHJpcCQuZGF0YS50aXRsZSwgLy8g6KGM56iL5ZCN56ewXG4gICAgICAgICAgICAgICAgICAgIGNhbGxNb25leVRpbWVzOiB0cmlwJC5kYXRhLmNhbGxNb25leVRpbWVzIC8vIOW3suWPkemAgeWCrOasvuasoeaVsFxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgfSBjYXRjaCAoIGUgKSB7IHJldHVybiBjdHguYm9keSA9IHsgc3RhdHVzOiA1MDAgfTt9XG4gICAgfSlcblxuICAgIC8qKlxuICAgICAqIEBAZGVzY3JpcHRpb25cbiAgICAgKiDmm7TmlrDooYznqIvlupXkuIvnmoTlv6vpgJLlm77lhoxcbiAgICAgKi9cbiAgICBhcHAucm91dGVyKCd1cGRhdGUtZGVsaXZlcicsIGFzeW5jKCBjdHgsIG5leHQgKSA9PiB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBjb25zdCB7IHRpZCwgaW1ncyB9ID0gZXZlbnQuZGF0YTtcbiAgICAgICAgICAgIGNvbnN0IHRhcmdldCA9IGF3YWl0IGRiLmNvbGxlY3Rpb24oJ2RlbGl2ZXInKVxuICAgICAgICAgICAgICAgIC53aGVyZSh7XG4gICAgICAgICAgICAgICAgICAgIHRpZCxcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogJ2RlbGl2ZXItaW1nJ1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLmdldCggKTtcblxuICAgICAgICAgICAgLy8g5Yib5bu6XG4gICAgICAgICAgICBpZiAoICF0YXJnZXQuZGF0YVsgMCBdKSB7XG4gICAgICAgICAgICAgICAgYXdhaXQgZGIuY29sbGVjdGlvbignZGVsaXZlcicpXG4gICAgICAgICAgICAgICAgICAgIC5hZGQoe1xuICAgICAgICAgICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRpZCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbWdzLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6ICdkZWxpdmVyLWltZydcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAvLyDmm7TmlrBcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgYXdhaXQgZGIuY29sbGVjdGlvbignZGVsaXZlcicpXG4gICAgICAgICAgICAgICAgICAgIC5kb2MoIFN0cmluZyggdGFyZ2V0LmRhdGFbIDAgXS5faWQpKVxuICAgICAgICAgICAgICAgICAgICAudXBkYXRlKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbWdzXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiBjdHguYm9keSA9IHsgc3RhdHVzOiAyMDAgfTtcbiAgICAgICAgICAgIFxuICAgICAgICB9IGNhdGNoICggZSApIHsgcmV0dXJuIGN0eC5ib2R5ID0geyBzdGF0dXM6IDUwMCB9fVxuICAgIH0pXG5cbiAgICAvKipcbiAgICAgKiBAQGRlc2NyaXB0aW9uXG4gICAgICog6I635Y+W6KGM56iL5bqV5LiL55qE5b+r6YCS5Zu+5YaMXG4gICAgICovXG4gICAgYXBwLnJvdXRlcignZGVsaXZlcicsIGFzeW5jKCBjdHgsIG5leHQgKSA9PiB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBjb25zdCB7IHRpZCB9ID0gZXZlbnQuZGF0YTtcbiAgICAgICAgICAgIGNvbnN0IHRhcmdldCA9IGF3YWl0IGRiLmNvbGxlY3Rpb24oJ2RlbGl2ZXInKVxuICAgICAgICAgICAgICAgIC53aGVyZSh7XG4gICAgICAgICAgICAgICAgICAgIHRpZCxcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogJ2RlbGl2ZXItaW1nJ1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLmdldCggKTtcblxuICAgICAgICAgICAgcmV0dXJuIGN0eC5ib2R5ID0geyBcbiAgICAgICAgICAgICAgICBzdGF0dXM6IDIwMCxcbiAgICAgICAgICAgICAgICBkYXRhOiB0YXJnZXQuZGF0YVsgMCBdID8gdGFyZ2V0LmRhdGFbIDAgXS5pbWdzIDogWyBdXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfSBjYXRjaCAoIGUgKSB7XG4gICAgICAgICAgICByZXR1cm4gY3R4LmJvZHkgPSB7IHN0YXR1czogNTAwIH07XG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgIC8qKlxuICAgICAqIEBkZXNjcmlwdGlvblxuICAgICAqIOaJi+WKqOWFs+mXreW9k+WJjeihjOeoi1xuICAgICAqIHtcbiAgICAgKiAgICB0aWRcbiAgICAgKiB9XG4gICAgICovXG4gICAgYXBwLnJvdXRlcignY2xvc2UnLCBhc3luYyggY3R4LCBuZXh0ICkgPT4ge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgY29uc3QgeyB0aWQgfSA9IGV2ZW50LmRhdGE7XG5cbiAgICAgICAgICAgIC8vIOabtOaWsOihjOeoi2Nsb3Nl5a2X5q61XG4gICAgICAgICAgICBhd2FpdCBkYi5jb2xsZWN0aW9uKCd0cmlwJylcbiAgICAgICAgICAgICAgICAuZG9jKCBTdHJpbmcoIHRpZCApKVxuICAgICAgICAgICAgICAgIC51cGRhdGUoe1xuICAgICAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpc0Nsb3NlZDogdHJ1ZVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIC8vIOaJi+WKqOWPlua2iOihjOeoi+aXtu+8jOaKiuW+heaUr+S7mOiuouWNleiuvuS4uuWPlua2iFxuICAgICAgICAgICAgY29uc3Qgb3JkZXJzJCA9IGF3YWl0IGRiLmNvbGxlY3Rpb24oJ29yZGVyJylcbiAgICAgICAgICAgICAgICAud2hlcmUoe1xuICAgICAgICAgICAgICAgICAgICB0aWQsXG4gICAgICAgICAgICAgICAgICAgIHBheV9zdGF0dXM6ICcwJyxcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIC5nZXQoICk7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGF3YWl0IFByb21pc2UuYWxsKCBvcmRlcnMkLmRhdGEubWFwKCBvcmRlciQgPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiBkYi5jb2xsZWN0aW9uKCdvcmRlcicpXG4gICAgICAgICAgICAgICAgICAgIC5kb2MoIFN0cmluZyggb3JkZXIkLl9pZCApKVxuICAgICAgICAgICAgICAgICAgICAudXBkYXRlKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBiYXNlX3N0YXR1czogJzUnXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICB9KSk7XG5cbiAgICAgICAgICAgIGNvbnN0IHRyaXAkID0gYXdhaXQgZGIuY29sbGVjdGlvbigndHJpcCcpXG4gICAgICAgICAgICAgICAgLmRvYyggdGlkIClcbiAgICAgICAgICAgICAgICAuZ2V0KCApO1xuXG4gICAgICAgICAgICAvLyDmjqjpgIHku6PotK3pgJrnn6VcbiAgICAgICAgICAgIGNvbnN0IG1lbWJlcnMgPSBhd2FpdCBkYi5jb2xsZWN0aW9uKCdtYW5hZ2VyLW1lbWJlcicpXG4gICAgICAgICAgICAgICAgLndoZXJlKHtcbiAgICAgICAgICAgICAgICAgICAgcHVzaDogdHJ1ZVxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLmdldCggKTtcbiAgICAgICAgXG4gICAgICAgICAgICBhd2FpdCBQcm9taXNlLmFsbChcbiAgICAgICAgICAgICAgICBtZW1iZXJzLmRhdGEubWFwKCBhc3luYyBtZW1iZXIgPT4ge1xuICAgICAgICAgICAgICAgICAgICAvLyA044CB6LCD55So5o6o6YCBXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHB1c2gkID0gYXdhaXQgY2xvdWQuY2FsbEZ1bmN0aW9uKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6ICdjb21tb24nLFxuICAgICAgICAgICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICR1cmw6ICdwdXNoLXRlbXBsYXRlLWNsb3VkJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9wZW5pZDogbWVtYmVyLm9wZW5pZCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogJ3RyaXAnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYWdlOiBgcGFnZXMvbWFuYWdlci10cmlwLW9yZGVyL2luZGV4P2lkPSR7dGlkfSZhYz0kezF9YCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGV4dHM6IFtgJHt0cmlwJC5kYXRhLnRpdGxlfWAsIGDlhbPpl63miJDlip/vvIHkuIDplK7mlLbmrL7lip/og73lt7LlvIDlkK9gXVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICk7XG5cbiAgICAgICAgICAgIHJldHVybiBjdHguYm9keSA9IHsgc3RhdHVzOiAyMDAgfTtcblxuICAgICAgICB9IGNhdGNoICggZSApIHtcbiAgICAgICAgICAgIHJldHVybiBjdHguYm9keSA9IHsgc3RhdHVzOiA1MDAgfTtcbiAgICAgICAgfVxuICAgIH0pXG5cbiAgICByZXR1cm4gYXBwLnNlcnZlKCApO1xuXG59Il19