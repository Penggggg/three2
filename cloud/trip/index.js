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
                                end_date: _.gt(new Date().getTime())
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
                                    tid: x._id
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
                                    tid: x._id
                                })
                                    .get();
                            }))];
                    case 4:
                        salesVolume$ = _a.sent();
                        injectSalesVolume = salesVolume$.map(function (x, k) {
                            var salesVolume = x.data.reduce(function (n, m) {
                                var price = m.allocatedPrice || m.price;
                                var count = m.allocatedCount === undefined || m.allocatedCount === null ? m.count : m.allocatedCount;
                                return n + count * price;
                            }, 0);
                            return Object.assign({}, injectOrderCount_1[k], {
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
            var _id, tid, getErr, where$, rule1$, _a, start_date, end_date, create$, origin$, origin, temp, e_4;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 8, , 9]);
                        _id = event.data._id;
                        tid = event.data._id;
                        getErr = function (message) {
                            return ctx.body = {
                                status: 500,
                                message: message
                            };
                        };
                        if (!event.data.published) return [3, 2];
                        where$ = {
                            isClosed: false,
                            start_date: _.lt(new Date().getTime()),
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
                        _a = event.data, start_date = _a.start_date, end_date = _a.end_date;
                        if (start_date >= end_date) {
                            return [2, getErr('开始时间必须大于结束时间')];
                        }
                        if (!!_id) return [3, 4];
                        return [4, db.collection('trip').add({
                                data: Object.assign({}, event.data, {
                                    callMoneyTimes: 0
                                })
                            })];
                    case 3:
                        create$ = _b.sent();
                        _id = create$._id;
                        return [3, 7];
                    case 4: return [4, db.collection('trip')
                            .where({
                            _id: _id
                        })
                            .get()];
                    case 5:
                        origin$ = _b.sent();
                        origin = origin$.data[0];
                        delete origin['_id'];
                        delete event.data['_id'];
                        delete event.data['sales_volume'];
                        temp = Object.assign({}, origin, __assign({}, event.data, { callMoneyTimes: event.data['end_date'] > origin['end_date'] ? 0 : origin['callMoneyTimes'], isClosed: new Date().getTime() >= Number(end_date) }));
                        return [4, db.collection('trip')
                                .doc(_id)
                                .set({
                                data: temp
                            })];
                    case 6:
                        _b.sent();
                        _b.label = 7;
                    case 7: return [2, ctx.body = {
                            data: _id,
                            status: 200
                        }];
                    case 8:
                        e_4 = _b.sent();
                        return [2, ctx.body = {
                                status: 500,
                                message: e_4
                            }];
                    case 9: return [2];
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
                                tid: tid
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
            var tid, orders$, e_8;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 4, , 5]);
                        tid = event.data.tid;
                        return [4, db.collection('trip')
                                .doc(String(tid))
                                .update({
                                data: {
                                    isClosed: true
                                }
                            })];
                    case 1:
                        _a.sent();
                        return [4, db.collection('order')
                                .where({
                                tid: tid,
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
                        return [2, ctx.body = { status: 200 }];
                    case 4:
                        e_8 = _a.sent();
                        return [2, ctx.body = { status: 500 }];
                    case 5: return [2];
                }
            });
        }); });
        return [2, app.serve()];
    });
}); };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLGlCQW9nQkM7O0FBcGdCRCxxQ0FBdUM7QUFDdkMsc0NBQXdDO0FBRXhDLEtBQUssQ0FBQyxJQUFJLENBQUM7SUFDUCxHQUFHLEVBQUUsT0FBTyxDQUFDLEdBQUcsQ0FBQyxLQUFLO0NBQ3pCLENBQUMsQ0FBQztBQUVILElBQU0sRUFBRSxHQUFnQixLQUFLLENBQUMsUUFBUSxFQUFHLENBQUM7QUFDMUMsSUFBTSxDQUFDLEdBQUcsRUFBRSxDQUFDLE9BQU8sQ0FBQztBQTBCUixRQUFBLElBQUksR0FBRyxVQUFRLEtBQUssRUFBRSxPQUFPOzs7O1FBRWhDLEdBQUcsR0FBRyxJQUFJLFNBQVMsQ0FBQyxFQUFFLEtBQUssT0FBQSxFQUFFLENBQUMsQ0FBQztRQVFyQyxHQUFHLENBQUMsTUFBTSxDQUFDLE9BQU8sRUFBRSxVQUFPLEdBQUcsRUFBRSxJQUFJOzs7Ozs7d0JBRXRCLGNBQWMsR0FBRyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDO3dCQUc1RCxXQUFNLEVBQUUsQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDO2lDQUNwQyxLQUFLLENBQUM7Z0NBQ0gsUUFBUSxFQUFFLEtBQUs7Z0NBQ2YsU0FBUyxFQUFFLElBQUk7Z0NBQ2YsUUFBUSxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUUsSUFBSSxJQUFJLEVBQUcsQ0FBQyxPQUFPLEVBQUcsQ0FBQzs2QkFDMUMsQ0FBQztpQ0FDRCxLQUFLLENBQUUsQ0FBQyxDQUFFO2lDQUNWLE9BQU8sQ0FBQyxZQUFZLEVBQUUsS0FBSyxDQUFDO2lDQUM1QixHQUFHLEVBQUcsRUFBQTs7d0JBUkwsS0FBSyxHQUFHLFNB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QUFNLENBQUUsTUFBTSxDQUFDLEdBQUcsQ0FBRSxDQUFDO3FDQUMxQixNQUFNLENBQUM7b0NBQ0osSUFBSSxFQUFFO3dDQUNGLFdBQVcsRUFBRSxHQUFHO3FDQUNuQjtpQ0FDSixDQUFDLENBQUE7NEJBQ1YsQ0FBQyxDQUFDLENBQUMsRUFBQTs7d0JBUkgsU0FRRyxDQUFDO3dCQUVKLFdBQU8sR0FBRyxDQUFDLElBQUksR0FBRyxFQUFFLE1BQU0sRUFBRSxHQUFHLEVBQUUsRUFBQzs7O3dCQUdsQyxXQUFPLEdBQUcsQ0FBQyxJQUFJLEdBQUcsRUFBRSxNQUFNLEVBQUUsR0FBRyxFQUFFLEVBQUM7Ozs7YUFFekMsQ0FBQyxDQUFBO1FBRUYsV0FBTyxHQUFHLENBQUMsS0FBSyxFQUFHLEVBQUM7O0tBRXZCLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBjbG91ZCBmcm9tICd3eC1zZXJ2ZXItc2RrJztcbmltcG9ydCAqIGFzIFRjYlJvdXRlciBmcm9tICd0Y2Itcm91dGVyJztcblxuY2xvdWQuaW5pdCh7XG4gICAgZW52OiBwcm9jZXNzLmVudi5jbG91ZFxufSk7XG5cbmNvbnN0IGRiOiBEQi5EYXRhYmFzZSA9IGNsb3VkLmRhdGFiYXNlKCApO1xuY29uc3QgXyA9IGRiLmNvbW1hbmQ7XG5cblxuLyoqXG4gKlxuICogQGRlc2NyaXB0aW9uIOihjOeoi+aooeWdl1xuICogLS0tLS0tLS0g5a2X5q61IC0tLS0tLS0tLS1cbiAgICAgICAgdGl0bGUg5qCH6aKYIHN0cmluZ1xuICohICAgICBkZXN0aW5hdGlvbiDnm67nmoTlnLAgc3RyaW5nXG4gICAgICAgIHN0YXJ0X2RhdGUg5byA5aeL5pe26Ze0IG51bWJlclxuICAgICAgICBlbmRfZGF0ZSDnu5PmnZ/ml7bpl7QgbnVtYmVyXG4gICAgICAgIHJlZHVjZV9wcmljZSDooYznqIvnq4vlh48gbnVtYmVyXG4gICAgICAgIHNhbGVzX3ZvbHVtZSDplIDllK7mgLvpop1cbiAgICAgICAgZnVsbHJlZHVjZV9hdGxlYXN0IOihjOeoi+a7oeWHjyAtIOmXqOanmyBudW1iZXJcbiAgICAgICAgZnVsbHJlZHVjZV92YWx1ZXMg6KGM56iL5ruh5YePIC0g5YeP5aSa5bCRIG51bWJlclxuICAgICAgICBjYXNoY291cG9uX2F0bGVhc3Qg6KGM56iL5Luj6YeR5Yi4IC0g6Zeo5qebIG51bWJlclxuICAgICAgICBjYXNoY291cG9uX3ZhbHVlcyDooYznqIvku6Pph5HliLggLSDph5Hpop0gbnVtYmVyXG4qISAgICAgIHBvc3RhZ2Ug6YKu6LS557G75Z6LIGRpYyBcbiohICAgICAgcG9zdGFnZWZyZWVfYXRsZWFzdCAg5YWN6YKu6Zeo5qebIG51bWJlclxuICAgICAgICBwYXltZW50IOS7mOasvuexu+WeiyBkaWMgXG4gICAgICAgIHB1Ymxpc2hlZCDmmK/lkKblj5HluIMgYm9vbGVhblxuICAgICAgICBjcmVhdGVUaW1lIOWIm+W7uuaXtumXtFxuICAgICAgICB1cGRhdGVUaW1lIOabtOaWsOaXtumXtFxuICAgICAgICBpc0Nsb3NlZDog5piv5ZCm5bey57uP5omL5Yqo5YWz6ZetXG4gICAgICAgIGNhbGxNb25leVRpbWVzOiDlj5HotbflgqzmrL7mrKHmlbBcbiAqL1xuZXhwb3J0IGNvbnN0IG1haW4gPSBhc3luYyAoIGV2ZW50LCBjb250ZXh0ICkgPT4ge1xuXG4gICAgY29uc3QgYXBwID0gbmV3IFRjYlJvdXRlcih7IGV2ZW50IH0pO1xuXG4gICAgLyoqXG4gICAgICogLS0tLS0tIOivt+axgiAtLS0tLS0tLVxuICAgICAqIHtcbiAgICAgKiAgICBzaG91bGRHZXRHb29kczog6buY6K6kdHJ1Ze+8jOWPr+S7peS4jeWhq++8jOiOt+WPluihjOeoi+aOqOiNkOWVhuWTgVxuICAgICAqIH1cbiAgICAgKi9cbiAgICBhcHAucm91dGVyKCdlbnRlcicsIGFzeW5jKCBjdHgsIG5leHQgKSA9PiB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBjb25zdCBzaG91bGRHZXRHb29kcyA9IGV2ZW50LmRhdGEgPyBldmVudC5kYXRhLnNob3VsZEdldEdvb2RzIDogdW5kZWZpbmVkO1xuXG4gICAgICAgICAgICAvLyDmjInlvIDlp4vml6XmnJ/mraPluo/vvIzojrflj5bmnIDlpJoy5p2hIOW3suWPkeW4g+OAgeacque7k+adn+eahOihjOeoi1xuICAgICAgICAgICAgY29uc3QgZGF0YSQgPSBhd2FpdCBkYi5jb2xsZWN0aW9uKCd0cmlwJylcbiAgICAgICAgICAgICAgICAud2hlcmUoe1xuICAgICAgICAgICAgICAgICAgICBpc0Nsb3NlZDogZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgIHB1Ymxpc2hlZDogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgZW5kX2RhdGU6IF8uZ3QoIG5ldyBEYXRlKCApLmdldFRpbWUoICkpXG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAubGltaXQoIDIgKVxuICAgICAgICAgICAgICAgIC5vcmRlckJ5KCdzdGFydF9kYXRlJywgJ2FzYycpXG4gICAgICAgICAgICAgICAgLmdldCggKTtcblxuICAgICAgICAgICAgbGV0IHRyaXBzID0gZGF0YSQuZGF0YTtcblxuICAgICAgICAgICAgLy8g5ouJ5Y+W5pyA5paw6KGM56iL55qE5o6o6I2Q5ZWG5ZOBXG4gICAgICAgICAgICBpZiAoKCAhIXRyaXBzWyAwIF0gJiYgc2hvdWxkR2V0R29vZHMgPT09IHVuZGVmaW5lZCApIHx8IHNob3VsZEdldEdvb2RzID09PSB0cnVlICkge1xuICAgICAgICAgICAgICAgIGNvbnN0IHRyaXBPbmVQcm9kdWN0cyQgPSBhd2FpdCBQcm9taXNlLmFsbCggdHJpcHNbIDAgXS5zZWxlY3RlZFByb2R1Y3RJZHMubWFwKCBwaWQgPT4ge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gY2xvdWQuY2FsbEZ1bmN0aW9uKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIF9pZDogcGlkLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJHVybDogJ2RldGFpbCdcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiAnZ29vZCdcbiAgICAgICAgICAgICAgICAgICAgfSkudGhlbiggcmVzID0+IHJlcy5yZXN1bHQuZGF0YSApO1xuICAgICAgICAgICAgICAgIH0pKTtcbiAgICAgICAgICAgICAgICB0cmlwc1sgMCBdID0gT2JqZWN0LmFzc2lnbih7IH0sIHRyaXBzWyAwIF0sIHtcbiAgICAgICAgICAgICAgICAgICAgcHJvZHVjdHM6IHRyaXBPbmVQcm9kdWN0cyRcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIGN0eC5ib2R5ID0ge1xuICAgICAgICAgICAgICAgIHN0YXR1czogMjAwLFxuICAgICAgICAgICAgICAgIGRhdGE6IHRyaXBzXG4gICAgICAgICAgICB9O1xuXG4gICAgICAgIH0gY2F0Y2ggKCBlICkge1xuICAgICAgICAgICAgcmV0dXJuIGN0eC5ib2R5ID0ge1xuICAgICAgICAgICAgICAgIHN0YXR1czogNTAwLFxuICAgICAgICAgICAgICAgIG1lc3NhZ2U6IGVcbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgIGFwcC5yb3V0ZXIoJ2xpc3QnLCBhc3luYyggY3R4LCBuZXh0ICkgPT4ge1xuICAgICAgICB0cnkge1xuXG4gICAgICAgICAgICAvLyDmn6Xor6LmnaHmlbBcbiAgICAgICAgICAgIGNvbnN0IGxpbWl0ID0gMjA7XG4gICAgICAgICAgICBjb25zdCBzZWFyY2gkID0gZXZlbnQuZGF0YS50aXRsZSB8fCAnJztcbiAgICAgICAgICAgIGNvbnN0IHNlYXJjaCA9IG5ldyBSZWdFeHAoIHNlYXJjaCQucmVwbGFjZSgvXFxzKy9nLCBcIlwiKSwgJ2knKTtcblxuICAgICAgICAgICAgLy8g6I635Y+W5oC75pWwXG4gICAgICAgICAgICBjb25zdCB0b3RhbCQgPSBhd2FpdCBkYi5jb2xsZWN0aW9uKCd0cmlwJylcbiAgICAgICAgICAgICAgICAud2hlcmUoe1xuICAgICAgICAgICAgICAgICAgICB0aXRsZTogc2VhcmNoXG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAuY291bnQoICk7XG5cbiAgICAgICAgICAgIC8vIOiOt+WPluaVsOaNrlxuICAgICAgICAgICAgY29uc3QgZGF0YSQgPSBhd2FpdCBkYi5jb2xsZWN0aW9uKCd0cmlwJylcbiAgICAgICAgICAgICAgICAud2hlcmUoe1xuICAgICAgICAgICAgICAgICAgICB0aXRsZTogc2VhcmNoXG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAubGltaXQoIGxpbWl0IClcbiAgICAgICAgICAgICAgICAuc2tpcCgoIGV2ZW50LmRhdGEucGFnZSAtIDEgKSAqIGxpbWl0IClcbiAgICAgICAgICAgICAgICAub3JkZXJCeSgndXBkYXRlVGltZScsICdkZXNjJylcbiAgICAgICAgICAgICAgICAuZ2V0KCApO1xuXG4gICAgICAgICAgICAvLyDojrflj5bmr4/ourrooYznqIvnmoTorqLljZXmlbBcbiAgICAgICAgICAgIGNvbnN0IG9yZGVycyQgPSBhd2FpdCBQcm9taXNlLmFsbCggZGF0YSQuZGF0YS5tYXAoIHggPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiBkYi5jb2xsZWN0aW9uKCdvcmRlcicpXG4gICAgICAgICAgICAgICAgICAgIC53aGVyZSh7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aWQ6IHguX2lkXG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgIC5jb3VudCggKTtcbiAgICAgICAgICAgIH0pKTtcblxuICAgICAgICAgICAgY29uc3QgaW5qZWN0T3JkZXJDb3VudCA9IGRhdGEkLmRhdGEubWFwKCggeCwgayApID0+IHtcbiAgICAgICAgICAgICAgICByZXR1cm4gT2JqZWN0LmFzc2lnbih7IH0sIHgsIHtcbiAgICAgICAgICAgICAgICAgICAgb3JkZXJzOiBvcmRlcnMkWyBrIF0udG90YWxcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIC8vIOiOt+WPluavj+i6uuihjOeoi+eahOmUgOWUruminVxuICAgICAgICAgICAgY29uc3Qgc2FsZXNWb2x1bWUkID0gYXdhaXQgUHJvbWlzZS5hbGwoIGluamVjdE9yZGVyQ291bnQubWFwKCB4ID0+IHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZGIuY29sbGVjdGlvbignb3JkZXInKVxuICAgICAgICAgICAgICAgICAgICAud2hlcmUoe1xuICAgICAgICAgICAgICAgICAgICAgICAgdGlkOiB4Ll9pZFxuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAuZ2V0KCApO1xuICAgICAgICAgICAgfSkpXG5cbiAgICAgICAgICAgIGNvbnN0IGluamVjdFNhbGVzVm9sdW1lID0gc2FsZXNWb2x1bWUkLm1hcCgoIHgsIGsgKSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3Qgc2FsZXNWb2x1bWUgPSB4LmRhdGEucmVkdWNlKCggbiwgbSApID0+IHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgcHJpY2UgPSBtLmFsbG9jYXRlZFByaWNlIHx8IG0ucHJpY2U7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGNvdW50ID0gbS5hbGxvY2F0ZWRDb3VudCA9PT0gdW5kZWZpbmVkIHx8IG0uYWxsb2NhdGVkQ291bnQgPT09IG51bGwgPyBtLmNvdW50IDogbS5hbGxvY2F0ZWRDb3VudCA7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBuICsgY291bnQgKiBwcmljZTtcbiAgICAgICAgICAgICAgICB9LCAwICk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIE9iamVjdC5hc3NpZ24oeyB9LCBpbmplY3RPcmRlckNvdW50WyBrIF0sIHtcbiAgICAgICAgICAgICAgICAgICAgc2FsZXNfdm9sdW1lOiBzYWxlc1ZvbHVtZVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIHJldHVybiBjdHguYm9keSA9IHtcbiAgICAgICAgICAgICAgICBzdGF0dXM6IDIwMCxcbiAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICAgIHNlYXJjaDogZXZlbnQuZGF0YS50aXRsZS5yZXBsYWNlKC9cXHMrL2csICcnKSxcbiAgICAgICAgICAgICAgICAgICAgcGFnZVNpemU6IGxpbWl0LFxuICAgICAgICAgICAgICAgICAgICBwYWdlOiBldmVudC5kYXRhLnBhZ2UsXG4gICAgICAgICAgICAgICAgICAgIGRhdGE6IGluamVjdFNhbGVzVm9sdW1lLFxuICAgICAgICAgICAgICAgICAgICB0b3RhbDogdG90YWwkLnRvdGFsLFxuICAgICAgICAgICAgICAgICAgICB0b3RhbFBhZ2U6IE1hdGguY2VpbCggdG90YWwkLnRvdGFsIC8gbGltaXQgKVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgfSBjYXRjaCAoIGUgKSB7XG4gICAgICAgICAgICByZXR1cm4gY3R4LmJvZHkgPSB7XG4gICAgICAgICAgICAgICAgc3RhdHVzOiA1MDAsXG4gICAgICAgICAgICAgICAgbWVzc2FnZTogZVxuICAgICAgICAgICAgfTtcbiAgICAgICAgfSBcbiAgICB9KTtcbiAgICBcbiAgICAvKipcbiAgICAgKiBAZGVzY3JpcHRpb25cbiAgICAgKiDooYznqIvor6bmg4VcbiAgICAgKiB7XG4gICAgICogICAgICBtb3JlRGV0YWlsOiB1bmRlZmluZWQgfCBmYWxzZSB8IHRydWVcbiAgICAgKiB9XG4gICAgICovXG4gICAgYXBwLnJvdXRlcignZGV0YWlsJywgYXN5bmMoIGN0eCwgbmV4dCApID0+IHtcbiAgICAgICAgdHJ5IHtcblxuICAgICAgICAgICAgY29uc3QgeyBtb3JlRGV0YWlsIH0gPSBldmVudC5kYXRhO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICAvLyDojrflj5bln7rmnKzor6bmg4VcbiAgICAgICAgICAgIGNvbnN0IGRhdGEkID0gYXdhaXQgZGIuY29sbGVjdGlvbigndHJpcCcpXG4gICAgICAgICAgICAgICAgICAgIC53aGVyZSh7XG4gICAgICAgICAgICAgICAgICAgICAgICBfaWQ6IGV2ZW50LmRhdGEuX2lkIHx8IGV2ZW50LmRhdGEudGlkXG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgIC5nZXQoICk7XG4gICAgICAgICAgICBjb25zdCBtZXRhID0gZGF0YSQuZGF0YVsgMCBdO1xuXG4gICAgICAgICAgICBpZiAoIG1vcmVEZXRhaWwgIT09IGZhbHNlICkge1xuICAgICAgICAgICAgICAgIC8vIOmAmui/h+W3sumAieeahOWVhuWTgWlkcyzmi7/liLDlr7nlupTnmoTlm77niYfjgIF0aXRsZeOAgV9pZFxuICAgICAgICAgICAgICAgIGNvbnN0IHByb2R1Y3RzJDogYW55ID0gYXdhaXQgUHJvbWlzZS5hbGwoIG1ldGEuc2VsZWN0ZWRQcm9kdWN0SWRzLm1hcCggcGlkID0+IHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGRiLmNvbGxlY3Rpb24oJ2dvb2RzJylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAud2hlcmUoe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBfaWQ6IHBpZFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLmZpZWxkKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaW1nOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aXRsZTogdHJ1ZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLmdldCggKTtcbiAgICAgICAgICAgICAgICB9KSk7XG5cbiAgICAgICAgICAgICAgICBtZXRhLnNlbGVjdGVkUHJvZHVjdHMgPSBwcm9kdWN0cyQubWFwKCB4ID0+IHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHguZGF0YVsgMCBdO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBtZXRhLnNlbGVjdGVkUHJvZHVjdHMgPSBbIF07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBcblxuICAgICAgICAgICAgcmV0dXJuIGN0eC5ib2R5ID0ge1xuICAgICAgICAgICAgICAgIHN0YXR1czogMjAwLFxuICAgICAgICAgICAgICAgIGRhdGE6IGRhdGEkLmRhdGFbIDAgXVxuICAgICAgICAgICAgfTtcblxuICAgICAgICB9IGNhdGNoKCBlICkge1xuICAgICAgICAgICAgcmV0dXJuIGN0eC5ib2R5ID0ge1xuICAgICAgICAgICAgICAgIHN0YXR1czogNTAwLFxuICAgICAgICAgICAgICAgIG1lc3NhZ2U6IGVcbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgIC8qKlxuICAgICAqIEBkZXNjcmlwdGlvblxuICAgICAqIOWIm+W7uiAvIOe8lui+keW9k+WJjeihjOeoi1xuICAgICAqL1xuICAgIGFwcC5yb3V0ZXIoJ2VkaXQnLCBhc3luYyggY3R4LCBuZXh0ICkgPT4ge1xuICAgICAgICB0cnkge1xuXG4gICAgICAgICAgICBsZXQgX2lkID0gZXZlbnQuZGF0YS5faWQ7XG4gICAgICAgICAgICBjb25zdCB0aWQgPSBldmVudC5kYXRhLl9pZDtcblxuICAgICAgICAgICAgY29uc3QgZ2V0RXJyID0gbWVzc2FnZSA9PiB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGN0eC5ib2R5ID0ge1xuICAgICAgICAgICAgICAgICAgICBzdGF0dXM6IDUwMCxcbiAgICAgICAgICAgICAgICAgICAgbWVzc2FnZVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICog5qCh6aqMMe+8mlxuICAgICAgICAgICAgICog5aaC5p6c6KGM56iL6YCJ5oup4oCc5bey5Y+R5biD4oCdXG4gICAgICAgICAgICAgKiDpnIDopoHmo4Dmn6XmmK/lkKbmnIkg5bey5Y+R5biD6KGM56iL55qE57uT5p2f5pe26Ze0IOWkp+S6juetieS6jiDlvZPliY3ooYznqIvnmoTlvIDlp4vml7bpl7RcbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgaWYgKCBldmVudC5kYXRhLnB1Ymxpc2hlZCApIHtcblxuICAgICAgICAgICAgICAgIGxldCB3aGVyZSQgPSB7XG4gICAgICAgICAgICAgICAgICAgIGlzQ2xvc2VkOiBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgc3RhcnRfZGF0ZTogXy5sdCggbmV3IERhdGUoICkuZ2V0VGltZSggKSksXG4gICAgICAgICAgICAgICAgICAgIGVuZF9kYXRlOiBfLmd0ZSggZXZlbnQuZGF0YS5zdGFydF9kYXRlIClcbiAgICAgICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAgICAgaWYgKCAhIXRpZCApIHtcbiAgICAgICAgICAgICAgICAgICAgd2hlcmUkID0gT2JqZWN0LmFzc2lnbih7IH0sIHdoZXJlJCwge1xuICAgICAgICAgICAgICAgICAgICAgICAgX2lkOiBfLm5lcSggdGlkIClcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgY29uc3QgcnVsZTEkID0gYXdhaXQgZGIuY29sbGVjdGlvbigndHJpcCcpXG4gICAgICAgICAgICAgICAgICAgIC53aGVyZSggIHdoZXJlJCApXG4gICAgICAgICAgICAgICAgICAgIC5jb3VudCggKTtcbiAgICAgICAgXG4gICAgICAgICAgICAgICAgaWYgKCBydWxlMSQudG90YWwgPiAwICkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZ2V0RXJyKCflvIDlp4vml7bpl7Tlv4XpobvlpKfkuo7kuIrotp/ooYznqIvnmoTnu5PmnZ/ml7bpl7QnKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IFxuXG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIOagoemqjDI6XG4gICAgICAgICAgICAgKiDnu5PmnZ/ml7bpl7TkuI3og73lsI/kuo7lvIDlp4vml7bpl7RcbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgY29uc3QgeyBzdGFydF9kYXRlLCBlbmRfZGF0ZSB9ID0gZXZlbnQuZGF0YTtcbiAgICAgICAgICAgIGlmICggc3RhcnRfZGF0ZSA+PSBlbmRfZGF0ZSAgKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGdldEVycign5byA5aeL5pe26Ze05b+F6aG75aSn5LqO57uT5p2f5pe26Ze0Jyk7XG4gICAgICAgICAgICB9XG5cbiAgICBcbiAgICAgICAgICAgIC8vIOWIm+W7uiBcbiAgICAgICAgICAgIGlmICggIV9pZCApIHtcbiAgICBcbiAgICAgICAgICAgICAgICBjb25zdCBjcmVhdGUkID0gYXdhaXQgZGIuY29sbGVjdGlvbigndHJpcCcpLmFkZCh7XG4gICAgICAgICAgICAgICAgICAgIGRhdGE6IE9iamVjdC5hc3NpZ24oeyB9LCBldmVudC5kYXRhLCB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjYWxsTW9uZXlUaW1lczogMFxuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIF9pZCA9IGNyZWF0ZSQuX2lkO1xuICAgIFxuICAgICAgICAgICAgLy8g57yW6L6RXG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgIFxuICAgICAgICAgICAgICAgIGNvbnN0IG9yaWdpbiQgPSBhd2FpdCBkYi5jb2xsZWN0aW9uKCd0cmlwJylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC53aGVyZSh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgX2lkXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLmdldCggKTtcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICBjb25zdCBvcmlnaW4gPSBvcmlnaW4kLmRhdGFbIDAgXTtcbiAgICBcbiAgICAgICAgICAgICAgICBkZWxldGUgb3JpZ2luWydfaWQnXTtcbiAgICAgICAgICAgICAgICBkZWxldGUgZXZlbnQuZGF0YVsnX2lkJ107XG4gICAgICAgICAgICAgICAgZGVsZXRlIGV2ZW50LmRhdGFbJ3NhbGVzX3ZvbHVtZSddXG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgY29uc3QgdGVtcCA9IE9iamVjdC5hc3NpZ24oeyB9LCBvcmlnaW4sIHtcbiAgICAgICAgICAgICAgICAgICAgLi4uZXZlbnQuZGF0YSxcbiAgICAgICAgICAgICAgICAgICAgY2FsbE1vbmV5VGltZXM6IGV2ZW50LmRhdGFbJ2VuZF9kYXRlJ10gPiBvcmlnaW5bJ2VuZF9kYXRlJ10gPyAwIDogb3JpZ2luWydjYWxsTW9uZXlUaW1lcyddLFxuICAgICAgICAgICAgICAgICAgICBpc0Nsb3NlZDogbmV3IERhdGUoICkuZ2V0VGltZSggKSA+PSBOdW1iZXIoIGVuZF9kYXRlICkgXG4gICAgICAgICAgICAgICAgfSlcbiAgICBcbiAgICAgICAgICAgICAgICBhd2FpdCBkYi5jb2xsZWN0aW9uKCd0cmlwJylcbiAgICAgICAgICAgICAgICAgICAgICAgIC5kb2MoIF9pZCApXG4gICAgICAgICAgICAgICAgICAgICAgICAuc2V0KHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhOiB0ZW1wXG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIGN0eC5ib2R5ID0ge1xuICAgICAgICAgICAgICAgIGRhdGE6IF9pZCxcbiAgICAgICAgICAgICAgICBzdGF0dXM6IDIwMFxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICBcbiAgICAgICAgfSBjYXRjaCggZSApIHtcbiAgICAgICAgICAgIHJldHVybiBjdHguYm9keSA9IHtcbiAgICAgICAgICAgICAgICBzdGF0dXM6IDUwMCxcbiAgICAgICAgICAgICAgICBtZXNzYWdlOiBlXG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICAvKiogXG4gICAgICogQGRlc2NyaXB0aW9uXG4gICAgICog6I635Y+W6KGM56iL5bqV5LiL55qE5Z+65pys5Lia5Yqh5pWw5o2uXG4gICAgICog6ZSA5ZSu5oC76aKd44CBXG4gICAgICog5a6i5oi35oC75pWw44CBXG4gICAgICog5pyq5LuY5bC+5qy+5a6i5oi35pWw6YeP44CBXG4gICAgICog5oC76K6i5Y2V5pWw44CBXG4gICAgICog6KGM56iL5ZCN56ew44CBXG4gICAgICog5bey5Y+R6YCB5YKs5qy+5qyh5pWwXG4gICAgICovXG4gICAgYXBwLnJvdXRlcignb3JkZXItaW5mbycsIGFzeW5jKCBjdHgsIG5leHQgKSA9PiB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBjb25zdCB7IHRpZCB9ID0gZXZlbnQuZGF0YTtcblxuICAgICAgICAgICAgLyoqIOihjOeoi+ivpuaDhSAqL1xuICAgICAgICAgICAgY29uc3QgdHJpcCQgPSBhd2FpdCBkYi5jb2xsZWN0aW9uKCd0cmlwJylcbiAgICAgICAgICAgICAgICAuZG9jKCB0aWQgKVxuICAgICAgICAgICAgICAgIC5nZXQoICk7XG4gICAgICAgIFxuICAgICAgICAgICAgLy8g6I635Y+W6KGM56iL5bqV5LiL5omA5pyJ55qE6K6i5Y2VXG4gICAgICAgICAgICBjb25zdCBvcmRlcnMkID0gYXdhaXQgZGIuY29sbGVjdGlvbignb3JkZXInKVxuICAgICAgICAgICAgICAgIC53aGVyZSh7XG4gICAgICAgICAgICAgICAgICAgIHRpZFxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLmdldCggKTtcblxuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiDmgLvmlLbnm4pcbiAgICAgICAgICAgICAqICHoh7PlsJHlt7Lku5jorqLph5HvvIzoh7PlsJHlt7Lnu4/osIPoioLllK7ku7fjgIHmlbDph49cbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgY29uc3Qgc3VtID0gb3JkZXJzJC5kYXRhXG4gICAgICAgICAgICAgICAgLmZpbHRlciggeCA9PiB4LnBheV9zdGF0dXMgIT09ICcwJyAmJlxuICAgICAgICAgICAgICAgICAgICAoKCB4LmJhc2Vfc3RhdHVzID09PSAnMScgKSB8fCAoIHguYmFzZV9zdGF0dXMgPT09ICcyJyApIHx8ICggeC5iYXNlX3N0YXR1cyA9PT0gJzMnICkpXG4gICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICAgIC5yZWR1Y2UoKCB4LCB5ICkgPT4ge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4geCArICggeS5hbGxvY2F0ZWRQcmljZSAqICggeS5hbGxvY2F0ZWRDb3VudCB8fCAwICkpO1xuICAgICAgICAgICAgICAgIH0sIDAgKTtcblxuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiDmgLvlrqLmiLfmlbDph49cbiAgICAgICAgICAgICAqICHoh7PlsJHlt7Lku5jorqLph5FcbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgY29uc3QgY2xpZW50cyA9IEFycmF5LmZyb20oXG4gICAgICAgICAgICAgICAgbmV3IFNldCggb3JkZXJzJC5kYXRhXG4gICAgICAgICAgICAgICAgICAgIC5maWx0ZXIoIHggPT4geC5wYXlfc3RhdHVzICE9PSAnMCcgKVxuICAgICAgICAgICAgICAgICAgICAubWFwKCB4ID0+IHgub3BlbmlkIClcbiAgICAgICAgICAgICkpLmxlbmd0aDtcblxuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiDmgLvmnKrkuqTlsL7mrL7lrqLmiLfmlbDph49cbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgY29uc3Qgbm90UGF5QWxsQ2xpZW50cyA9IEFycmF5LmZyb20oXG4gICAgICAgICAgICAgICAgbmV3IFNldCggb3JkZXJzJC5kYXRhXG4gICAgICAgICAgICAgICAgICAgIC5maWx0ZXIoIHggPT4geC5wYXlfc3RhdHVzID09PSAnMScgKVxuICAgICAgICAgICAgICAgICAgICAubWFwKCB4ID0+IHgub3BlbmlkIClcbiAgICAgICAgICAgICkpLmxlbmd0aDtcblxuICAgICAgICAgICAgcmV0dXJuIGN0eC5ib2R5ID0ge1xuICAgICAgICAgICAgICAgIHN0YXR1czogMjAwLFxuICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgc3VtLCAvLyDplIDllK7mgLvpop1cbiAgICAgICAgICAgICAgICAgICAgY2xpZW50cywgLy8g5a6i5oi35oC75pWwXG4gICAgICAgICAgICAgICAgICAgIG5vdFBheUFsbENsaWVudHMsIC8vIOacquS7mOWwvuasvuWuouaIt+aVsOmHj1xuICAgICAgICAgICAgICAgICAgICBjb3VudDogb3JkZXJzJC5kYXRhLmxlbmd0aCwgLy8g5oC76K6i5Y2V5pWwLFxuICAgICAgICAgICAgICAgICAgICB0aXRsZTogdHJpcCQuZGF0YS50aXRsZSwgLy8g6KGM56iL5ZCN56ewXG4gICAgICAgICAgICAgICAgICAgIGNhbGxNb25leVRpbWVzOiB0cmlwJC5kYXRhLmNhbGxNb25leVRpbWVzIC8vIOW3suWPkemAgeWCrOasvuasoeaVsFxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgfSBjYXRjaCAoIGUgKSB7IHJldHVybiBjdHguYm9keSA9IHsgc3RhdHVzOiA1MDAgfTt9XG4gICAgfSlcblxuICAgIC8qKlxuICAgICAqIEBAZGVzY3JpcHRpb25cbiAgICAgKiDmm7TmlrDooYznqIvlupXkuIvnmoTlv6vpgJLlm77lhoxcbiAgICAgKi9cbiAgICBhcHAucm91dGVyKCd1cGRhdGUtZGVsaXZlcicsIGFzeW5jKCBjdHgsIG5leHQgKSA9PiB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBjb25zdCB7IHRpZCwgaW1ncyB9ID0gZXZlbnQuZGF0YTtcbiAgICAgICAgICAgIGNvbnN0IHRhcmdldCA9IGF3YWl0IGRiLmNvbGxlY3Rpb24oJ2RlbGl2ZXInKVxuICAgICAgICAgICAgICAgIC53aGVyZSh7XG4gICAgICAgICAgICAgICAgICAgIHRpZCxcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogJ2RlbGl2ZXItaW1nJ1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLmdldCggKTtcblxuICAgICAgICAgICAgLy8g5Yib5bu6XG4gICAgICAgICAgICBpZiAoICF0YXJnZXQuZGF0YVsgMCBdKSB7XG4gICAgICAgICAgICAgICAgYXdhaXQgZGIuY29sbGVjdGlvbignZGVsaXZlcicpXG4gICAgICAgICAgICAgICAgICAgIC5hZGQoe1xuICAgICAgICAgICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRpZCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbWdzLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6ICdkZWxpdmVyLWltZydcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAvLyDmm7TmlrBcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgYXdhaXQgZGIuY29sbGVjdGlvbignZGVsaXZlcicpXG4gICAgICAgICAgICAgICAgICAgIC5kb2MoIFN0cmluZyggdGFyZ2V0LmRhdGFbIDAgXS5faWQpKVxuICAgICAgICAgICAgICAgICAgICAudXBkYXRlKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbWdzXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiBjdHguYm9keSA9IHsgc3RhdHVzOiAyMDAgfTtcbiAgICAgICAgICAgIFxuICAgICAgICB9IGNhdGNoICggZSApIHsgcmV0dXJuIGN0eC5ib2R5ID0geyBzdGF0dXM6IDUwMCB9fVxuICAgIH0pXG5cbiAgICAvKipcbiAgICAgKiBAQGRlc2NyaXB0aW9uXG4gICAgICog6I635Y+W6KGM56iL5bqV5LiL55qE5b+r6YCS5Zu+5YaMXG4gICAgICovXG4gICAgYXBwLnJvdXRlcignZGVsaXZlcicsIGFzeW5jKCBjdHgsIG5leHQgKSA9PiB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBjb25zdCB7IHRpZCB9ID0gZXZlbnQuZGF0YTtcbiAgICAgICAgICAgIGNvbnN0IHRhcmdldCA9IGF3YWl0IGRiLmNvbGxlY3Rpb24oJ2RlbGl2ZXInKVxuICAgICAgICAgICAgICAgIC53aGVyZSh7XG4gICAgICAgICAgICAgICAgICAgIHRpZCxcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogJ2RlbGl2ZXItaW1nJ1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLmdldCggKTtcblxuICAgICAgICAgICAgcmV0dXJuIGN0eC5ib2R5ID0geyBcbiAgICAgICAgICAgICAgICBzdGF0dXM6IDIwMCxcbiAgICAgICAgICAgICAgICBkYXRhOiB0YXJnZXQuZGF0YVsgMCBdID8gdGFyZ2V0LmRhdGFbIDAgXS5pbWdzIDogWyBdXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfSBjYXRjaCAoIGUgKSB7XG4gICAgICAgICAgICByZXR1cm4gY3R4LmJvZHkgPSB7IHN0YXR1czogNTAwIH07XG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgIC8qKlxuICAgICAqIEBkZXNjcmlwdGlvblxuICAgICAqIOaJi+WKqOWFs+mXreW9k+WJjeihjOeoi1xuICAgICAqIHtcbiAgICAgKiAgICB0aWRcbiAgICAgKiB9XG4gICAgICovXG4gICAgYXBwLnJvdXRlcignY2xvc2UnLCBhc3luYyggY3R4LCBuZXh0ICkgPT4ge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgY29uc3QgeyB0aWQgfSA9IGV2ZW50LmRhdGE7XG5cbiAgICAgICAgICAgIC8vIOabtOaWsOihjOeoi2Nsb3Nl5a2X5q61XG4gICAgICAgICAgICBhd2FpdCBkYi5jb2xsZWN0aW9uKCd0cmlwJylcbiAgICAgICAgICAgICAgICAuZG9jKCBTdHJpbmcoIHRpZCApKVxuICAgICAgICAgICAgICAgIC51cGRhdGUoe1xuICAgICAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpc0Nsb3NlZDogdHJ1ZVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIC8vIOaJi+WKqOWPlua2iOihjOeoi+aXtu+8jOaKiuW+heaUr+S7mOiuouWNleiuvuS4uuWPlua2iFxuICAgICAgICAgICAgY29uc3Qgb3JkZXJzJCA9IGF3YWl0IGRiLmNvbGxlY3Rpb24oJ29yZGVyJylcbiAgICAgICAgICAgICAgICAud2hlcmUoe1xuICAgICAgICAgICAgICAgICAgICB0aWQsXG4gICAgICAgICAgICAgICAgICAgIHBheV9zdGF0dXM6ICcwJyxcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIC5nZXQoICk7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGF3YWl0IFByb21pc2UuYWxsKCBvcmRlcnMkLmRhdGEubWFwKCBvcmRlciQgPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiBkYi5jb2xsZWN0aW9uKCdvcmRlcicpXG4gICAgICAgICAgICAgICAgICAgIC5kb2MoIFN0cmluZyggb3JkZXIkLl9pZCApKVxuICAgICAgICAgICAgICAgICAgICAudXBkYXRlKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBiYXNlX3N0YXR1czogJzUnXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICB9KSk7XG5cbiAgICAgICAgICAgIHJldHVybiBjdHguYm9keSA9IHsgc3RhdHVzOiAyMDAgfTtcblxuICAgICAgICB9IGNhdGNoICggZSApIHtcbiAgICAgICAgICAgIHJldHVybiBjdHguYm9keSA9IHsgc3RhdHVzOiA1MDAgfTtcbiAgICAgICAgfVxuICAgIH0pXG5cbiAgICByZXR1cm4gYXBwLnNlcnZlKCApO1xuXG59Il19