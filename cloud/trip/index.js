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
cloud.init();
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
                        search$ = event.data.search || '';
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
            var data$, meta, products$, e_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4, db.collection('trip')
                                .where({
                                _id: event.data._id
                            })
                                .get()];
                    case 1:
                        data$ = _a.sent();
                        meta = data$.data[0];
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
                        return [2, ctx.body = {
                                status: 200,
                                data: data$.data[0]
                            }];
                    case 3:
                        e_3 = _a.sent();
                        return [2, ctx.body = {
                                status: 500,
                                message: e_3
                            }];
                    case 4: return [2];
                }
            });
        }); });
        app.router('edit', function (ctx, next) { return __awaiter(_this, void 0, void 0, function () {
            var _id, rule1$, create$, origin$, origin, temp, e_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 8, , 9]);
                        _id = event.data._id;
                        if (!(event.data.published && !_id)) return [3, 2];
                        return [4, db.collection('trip').where({
                                end_date: _.gte(event.data.start_date)
                            })
                                .count()];
                    case 1:
                        rule1$ = _a.sent();
                        if (rule1$.total > 0) {
                            return [2, new Promise(function (resolve) {
                                    resolve({
                                        data: null,
                                        status: 500,
                                        message: '开始时间必须大于上趟行程的结束时间'
                                    });
                                })];
                        }
                        _a.label = 2;
                    case 2:
                        if (!!_id) return [3, 4];
                        return [4, db.collection('trip').add({
                                data: Object.assign({}, event.data, {
                                    callMoneyTimes: 0
                                })
                            })];
                    case 3:
                        create$ = _a.sent();
                        _id = create$._id;
                        return [3, 7];
                    case 4: return [4, db.collection('trip')
                            .where({
                            _id: _id
                        })
                            .get()];
                    case 5:
                        origin$ = _a.sent();
                        origin = origin$.data[0];
                        delete origin['_id'];
                        delete event.data['_id'];
                        temp = Object.assign({}, origin, __assign({}, event.data));
                        return [4, db.collection('trip')
                                .doc(_id)
                                .set({
                                data: temp
                            })];
                    case 6:
                        _a.sent();
                        _a.label = 7;
                    case 7: return [2, ctx.body = {
                            data: _id,
                            status: 200
                        }];
                    case 8:
                        e_4 = _a.sent();
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
                            .filter(function (x) { return x.pay_status === '1' && !!x.allocatedCount; })
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
        return [2, app.serve()];
    });
}); };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLGlCQTJhQzs7QUEzYUQscUNBQXVDO0FBQ3ZDLHNDQUF3QztBQUV4QyxLQUFLLENBQUMsSUFBSSxFQUFHLENBQUM7QUFFZCxJQUFNLEVBQUUsR0FBZ0IsS0FBSyxDQUFDLFFBQVEsRUFBRyxDQUFDO0FBQzFDLElBQU0sQ0FBQyxHQUFHLEVBQUUsQ0FBQyxPQUFPLENBQUM7QUFzQ1IsUUFBQSxJQUFJLEdBQUcsVUFBUSxLQUFLLEVBQUUsT0FBTzs7OztRQUVoQyxHQUFHLEdBQUcsSUFBSSxTQUFTLENBQUMsRUFBRSxLQUFLLE9BQUEsRUFBRSxDQUFDLENBQUM7UUFRckMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxPQUFPLEVBQUUsVUFBTyxHQUFHLEVBQUUsSUFBSTs7Ozs7O3dCQUV0QixjQUFjLEdBQUcsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQzt3QkFHNUQsV0FBTSxFQUFFLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQztpQ0FDcEMsS0FBSyxDQUFDO2dDQUNILFFBQVEsRUFBRSxLQUFLO2dDQUNmLFNBQVMsRUFBRSxJQUFJO2dDQUNmLFFBQVEsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFFLElBQUksSUFBSSxFQUFHLENBQUMsT0FBTyxFQUFHLENBQUM7NkJBQzFDLENBQUM7aUNBQ0QsS0FBSyxDQUFFLENBQUMsQ0FBRTtpQ0FDVixPQUFPLENBQUMsWUFBWSxFQUFFLEtBQUssQ0FBQztpQ0FDNUIsR0FBRyxFQUFHLEVBQUE7O3dCQVJMLEtBQUssR0FBRyxTQVFIO3dCQUVQLEtBQUssR0FBRyxLQUFLLENBQUMsSUFBSSxDQUFDOzZCQUduQixDQUFBLENBQUUsQ0FBQyxDQUFDLEtBQUssQ0FBRSxDQUFDLENBQUUsSUFBSSxjQUFjLEtBQUssU0FBUyxDQUFFLElBQUksY0FBYyxLQUFLLElBQUksQ0FBQSxFQUEzRSxjQUEyRTt3QkFDbEQsV0FBTSxPQUFPLENBQUMsR0FBRyxDQUFFLEtBQUssQ0FBRSxDQUFDLENBQUUsQ0FBQyxrQkFBa0IsQ0FBQyxHQUFHLENBQUUsVUFBQSxHQUFHO2dDQUM5RSxPQUFPLEtBQUssQ0FBQyxZQUFZLENBQUM7b0NBQ3RCLElBQUksRUFBRTt3Q0FDRixJQUFJLEVBQUU7NENBQ0YsR0FBRyxFQUFFLEdBQUc7eUNBQ1g7d0NBQ0QsSUFBSSxFQUFFLFFBQVE7cUNBQ2pCO29DQUNELElBQUksRUFBRSxNQUFNO2lDQUNmLENBQUMsQ0FBQyxJQUFJLENBQUUsVUFBQSxHQUFHLElBQUksT0FBQSxHQUFHLENBQUMsTUFBTSxDQUFDLElBQUksRUFBZixDQUFlLENBQUUsQ0FBQzs0QkFDdEMsQ0FBQyxDQUFDLENBQUMsRUFBQTs7d0JBVkcsZ0JBQWdCLEdBQUcsU0FVdEI7d0JBQ0gsS0FBSyxDQUFFLENBQUMsQ0FBRSxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUMsRUFBRyxFQUFFLEtBQUssQ0FBRSxDQUFDLENBQUUsRUFBRTs0QkFDeEMsUUFBUSxFQUFFLGdCQUFnQjt5QkFDN0IsQ0FBQyxDQUFDOzs0QkFHUCxXQUFPLEdBQUcsQ0FBQyxJQUFJLEdBQUc7NEJBQ2QsTUFBTSxFQUFFLEdBQUc7NEJBQ1gsSUFBSSxFQUFFLEtBQUs7eUJBQ2QsRUFBQzs7O3dCQUdGLFdBQU8sR0FBRyxDQUFDLElBQUksR0FBRztnQ0FDZCxNQUFNLEVBQUUsR0FBRztnQ0FDWCxPQUFPLEVBQUUsR0FBQzs2QkFDYixFQUFDOzs7O2FBRVQsQ0FBQyxDQUFDO1FBRUgsR0FBRyxDQUFDLE1BQU0sQ0FBQyxNQUFNLEVBQUUsVUFBTyxHQUFHLEVBQUUsSUFBSTs7Ozs7O3dCQUlyQixLQUFLLEdBQUcsRUFBRSxDQUFDO3dCQUNYLE9BQU8sR0FBRyxLQUFLLENBQUMsSUFBSSxDQUFDLE1BQU0sSUFBSSxFQUFFLENBQUM7d0JBQ2xDLE1BQU0sR0FBRyxJQUFJLE1BQU0sQ0FBRSxPQUFPLENBQUMsT0FBTyxDQUFDLE1BQU0sRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQzt3QkFHOUMsV0FBTSxFQUFFLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQztpQ0FDckMsS0FBSyxDQUFDO2dDQUNILEtBQUssRUFBRSxNQUFNOzZCQUNoQixDQUFDO2lDQUNELEtBQUssRUFBRyxFQUFBOzt3QkFKUCxNQUFNLEdBQUcsU0FJRjt3QkFHQyxXQUFNLEVBQUUsQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDO2lDQUNwQyxLQUFLLENBQUM7Z0NBQ0gsS0FBSyxFQUFFLE1BQU07NkJBQ2hCLENBQUM7aUNBQ0QsS0FBSyxDQUFFLEtBQUssQ0FBRTtpQ0FDZCxJQUFJLENBQUMsQ0FBRSxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksR0FBRyxDQUFDLENBQUUsR0FBRyxLQUFLLENBQUU7aUNBQ3RDLE9BQU8sQ0FBQyxZQUFZLEVBQUUsTUFBTSxDQUFDO2lDQUM3QixHQUFHLEVBQUcsRUFBQTs7d0JBUEwsS0FBSyxHQUFHLFNBT0g7d0JBR0ssV0FBTSxPQUFPLENBQUMsR0FBRyxDQUFFLEtBQUssQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFFLFVBQUEsQ0FBQztnQ0FDaEQsT0FBTyxFQUFFLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQztxQ0FDeEIsS0FBSyxDQUFDO29DQUNILEdBQUcsRUFBRSxDQUFDLENBQUMsR0FBRztpQ0FDYixDQUFDO3FDQUNELEtBQUssRUFBRyxDQUFDOzRCQUNsQixDQUFDLENBQUMsQ0FBQyxFQUFBOzt3QkFORyxZQUFVLFNBTWI7d0JBRUcscUJBQW1CLEtBQUssQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLFVBQUUsQ0FBQyxFQUFFLENBQUM7NEJBQzFDLE9BQU8sTUFBTSxDQUFDLE1BQU0sQ0FBQyxFQUFHLEVBQUUsQ0FBQyxFQUFFO2dDQUN6QixNQUFNLEVBQUUsU0FBTyxDQUFFLENBQUMsQ0FBRSxDQUFDLEtBQUs7NkJBQzdCLENBQUMsQ0FBQTt3QkFDTixDQUFDLENBQUMsQ0FBQzt3QkFHa0IsV0FBTSxPQUFPLENBQUMsR0FBRyxDQUFFLGtCQUFnQixDQUFDLEdBQUcsQ0FBRSxVQUFBLENBQUM7Z0NBQzNELE9BQU8sRUFBRSxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUM7cUNBQ3hCLEtBQUssQ0FBQztvQ0FDSCxHQUFHLEVBQUUsQ0FBQyxDQUFDLEdBQUc7aUNBQ2IsQ0FBQztxQ0FDRCxHQUFHLEVBQUcsQ0FBQzs0QkFDaEIsQ0FBQyxDQUFDLENBQUMsRUFBQTs7d0JBTkcsWUFBWSxHQUFHLFNBTWxCO3dCQUVHLGlCQUFpQixHQUFHLFlBQVksQ0FBQyxHQUFHLENBQUMsVUFBRSxDQUFDLEVBQUUsQ0FBQzs0QkFDN0MsSUFBTSxXQUFXLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsVUFBRSxDQUFDLEVBQUUsQ0FBQztnQ0FDcEMsSUFBTSxLQUFLLEdBQUcsQ0FBQyxDQUFDLGNBQWMsSUFBSSxDQUFDLENBQUMsS0FBSyxDQUFDO2dDQUMxQyxJQUFNLEtBQUssR0FBRyxDQUFDLENBQUMsY0FBYyxLQUFLLFNBQVMsSUFBSSxDQUFDLENBQUMsY0FBYyxLQUFLLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLGNBQWMsQ0FBRTtnQ0FDeEcsT0FBTyxDQUFDLEdBQUcsS0FBSyxHQUFHLEtBQUssQ0FBQzs0QkFDN0IsQ0FBQyxFQUFFLENBQUMsQ0FBRSxDQUFDOzRCQUNQLE9BQU8sTUFBTSxDQUFDLE1BQU0sQ0FBQyxFQUFHLEVBQUUsa0JBQWdCLENBQUUsQ0FBQyxDQUFFLEVBQUU7Z0NBQzdDLFlBQVksRUFBRSxXQUFXOzZCQUM1QixDQUFDLENBQUM7d0JBQ1AsQ0FBQyxDQUFDLENBQUM7d0JBRUgsV0FBTyxHQUFHLENBQUMsSUFBSSxHQUFHO2dDQUNkLE1BQU0sRUFBRSxHQUFHO2dDQUNYLElBQUksRUFBRTtvQ0FDRixNQUFNLEVBQUUsS0FBSyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLE1BQU0sRUFBRSxFQUFFLENBQUM7b0NBQzVDLFFBQVEsRUFBRSxLQUFLO29DQUNmLElBQUksRUFBRSxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUk7b0NBQ3JCLElBQUksRUFBRSxpQkFBaUI7b0NBQ3ZCLEtBQUssRUFBRSxNQUFNLENBQUMsS0FBSztvQ0FDbkIsU0FBUyxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUUsTUFBTSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUU7aUNBQy9DOzZCQUNKLEVBQUM7Ozt3QkFHRixXQUFPLEdBQUcsQ0FBQyxJQUFJLEdBQUc7Z0NBQ2QsTUFBTSxFQUFFLEdBQUc7Z0NBQ1gsT0FBTyxFQUFFLEdBQUM7NkJBQ2IsRUFBQzs7OzthQUVULENBQUMsQ0FBQztRQUVILEdBQUcsQ0FBQyxNQUFNLENBQUMsUUFBUSxFQUFFLFVBQU8sR0FBRyxFQUFFLElBQUk7Ozs7Ozt3QkFJZixXQUFNLEVBQUUsQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDO2lDQUNoQyxLQUFLLENBQUM7Z0NBQ0gsR0FBRyxFQUFFLEtBQUssQ0FBQyxJQUFJLENBQUMsR0FBRzs2QkFDdEIsQ0FBQztpQ0FDRCxHQUFHLEVBQUcsRUFBQTs7d0JBSlQsS0FBSyxHQUFHLFNBSUM7d0JBQ1QsSUFBSSxHQUFHLEtBQUssQ0FBQyxJQUFJLENBQUUsQ0FBQyxDQUFFLENBQUM7d0JBR04sV0FBTSxPQUFPLENBQUMsR0FBRyxDQUFFLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxHQUFHLENBQUUsVUFBQSxHQUFHO2dDQUN0RSxPQUFPLEVBQUUsQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDO3FDQUNwQixLQUFLLENBQUM7b0NBQ0gsR0FBRyxFQUFFLEdBQUc7aUNBQ1gsQ0FBQztxQ0FDRCxLQUFLLENBQUM7b0NBQ0gsR0FBRyxFQUFFLElBQUk7b0NBQ1QsS0FBSyxFQUFFLElBQUk7aUNBQ2QsQ0FBQztxQ0FDRCxHQUFHLEVBQUcsQ0FBQzs0QkFDcEIsQ0FBQyxDQUFDLENBQUMsRUFBQTs7d0JBVkcsU0FBUyxHQUFRLFNBVXBCO3dCQUVILElBQUksQ0FBQyxnQkFBZ0IsR0FBRyxTQUFTLENBQUMsR0FBRyxDQUFFLFVBQUEsQ0FBQzs0QkFDcEMsT0FBTyxDQUFDLENBQUMsSUFBSSxDQUFFLENBQUMsQ0FBRSxDQUFDO3dCQUN2QixDQUFDLENBQUMsQ0FBQzt3QkFFSCxXQUFPLEdBQUcsQ0FBQyxJQUFJLEdBQUc7Z0NBQ2QsTUFBTSxFQUFFLEdBQUc7Z0NBQ1gsSUFBSSxFQUFFLEtBQUssQ0FBQyxJQUFJLENBQUUsQ0FBQyxDQUFFOzZCQUN4QixFQUFDOzs7d0JBR0YsV0FBTyxHQUFHLENBQUMsSUFBSSxHQUFHO2dDQUNkLE1BQU0sRUFBRSxHQUFHO2dDQUNYLE9BQU8sRUFBRSxHQUFDOzZCQUNiLEVBQUM7Ozs7YUFFVCxDQUFDLENBQUM7UUFFSCxHQUFHLENBQUMsTUFBTSxDQUFDLE1BQU0sRUFBRSxVQUFPLEdBQUcsRUFBRSxJQUFJOzs7Ozs7d0JBR3ZCLEdBQUcsR0FBRyxLQUFLLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQzs2QkFHcEIsQ0FBQSxLQUFLLENBQUMsSUFBSSxDQUFDLFNBQVMsSUFBSSxDQUFDLEdBQUcsQ0FBQSxFQUE1QixjQUE0Qjt3QkFDZCxXQUFNLEVBQUUsQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDLENBQUMsS0FBSyxDQUFDO2dDQUM3QyxRQUFRLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBRSxLQUFLLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBRTs2QkFDM0MsQ0FBQztpQ0FDRCxLQUFLLEVBQUcsRUFBQTs7d0JBSEgsTUFBTSxHQUFHLFNBR047d0JBRVQsSUFBSyxNQUFNLENBQUMsS0FBSyxHQUFHLENBQUMsRUFBRzs0QkFDcEIsV0FBTyxJQUFJLE9BQU8sQ0FBRSxVQUFBLE9BQU87b0NBQ3ZCLE9BQU8sQ0FBQzt3Q0FDSixJQUFJLEVBQUUsSUFBSTt3Q0FDVixNQUFNLEVBQUUsR0FBRzt3Q0FDWCxPQUFPLEVBQUUsbUJBQW1CO3FDQUMvQixDQUFDLENBQUE7Z0NBQ04sQ0FBQyxDQUFDLEVBQUM7eUJBQ047Ozs2QkFJQSxDQUFDLEdBQUcsRUFBSixjQUFJO3dCQUVXLFdBQU0sRUFBRSxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUMsQ0FBQyxHQUFHLENBQUM7Z0NBQzVDLElBQUksRUFBRSxNQUFNLENBQUMsTUFBTSxDQUFDLEVBQUcsRUFBRSxLQUFLLENBQUMsSUFBSSxFQUFFO29DQUNqQyxjQUFjLEVBQUUsQ0FBQztpQ0FDcEIsQ0FBQzs2QkFDTCxDQUFDLEVBQUE7O3dCQUpJLE9BQU8sR0FBRyxTQUlkO3dCQUNGLEdBQUcsR0FBRyxPQUFPLENBQUMsR0FBRyxDQUFDOzs0QkFLRixXQUFNLEVBQUUsQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDOzZCQUN0QixLQUFLLENBQUM7NEJBQ0gsR0FBRyxLQUFBO3lCQUNOLENBQUM7NkJBQ0QsR0FBRyxFQUFHLEVBQUE7O3dCQUpyQixPQUFPLEdBQUcsU0FJVzt3QkFFckIsTUFBTSxHQUFHLE9BQU8sQ0FBQyxJQUFJLENBQUUsQ0FBQyxDQUFFLENBQUM7d0JBRWpDLE9BQU8sTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDO3dCQUNyQixPQUFPLEtBQUssQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUE7d0JBRWxCLElBQUksR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDLEVBQUcsRUFBRSxNQUFNLGVBQy9CLEtBQUssQ0FBQyxJQUFJLEVBQ2YsQ0FBQTt3QkFFRixXQUFNLEVBQUUsQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDO2lDQUNsQixHQUFHLENBQUUsR0FBRyxDQUFFO2lDQUNWLEdBQUcsQ0FBQztnQ0FDRCxJQUFJLEVBQUUsSUFBSTs2QkFDYixDQUFDLEVBQUE7O3dCQUpWLFNBSVUsQ0FBQzs7NEJBSWYsV0FBTyxHQUFHLENBQUMsSUFBSSxHQUFHOzRCQUNkLElBQUksRUFBRSxHQUFHOzRCQUNULE1BQU0sRUFBRSxHQUFHO3lCQUNkLEVBQUM7Ozt3QkFHRixXQUFPLEdBQUcsQ0FBQyxJQUFJLEdBQUc7Z0NBQ2QsTUFBTSxFQUFFLEdBQUc7Z0NBQ1gsT0FBTyxFQUFFLEdBQUM7NkJBQ2IsRUFBQzs7OzthQUVULENBQUMsQ0FBQztRQU1ILEdBQUcsQ0FBQyxNQUFNLENBQUMsWUFBWSxFQUFFLFVBQU8sR0FBRyxFQUFFLElBQUk7Ozs7Ozt3QkFFekIsR0FBRyxHQUFLLEtBQUssQ0FBQyxJQUFJLElBQWYsQ0FBZ0I7d0JBR2IsV0FBTSxFQUFFLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQztpQ0FDcEMsR0FBRyxDQUFFLEdBQUcsQ0FBRTtpQ0FDVixHQUFHLEVBQUcsRUFBQTs7d0JBRkwsS0FBSyxHQUFHLFNBRUg7d0JBR0ssV0FBTSxFQUFFLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQztpQ0FDdkMsS0FBSyxDQUFDO2dDQUNILEdBQUcsS0FBQTs2QkFDTixDQUFDO2lDQUNELEdBQUcsRUFBRyxFQUFBOzt3QkFKTCxPQUFPLEdBQUcsU0FJTDt3QkFNTCxHQUFHLEdBQUcsT0FBTyxDQUFDLElBQUk7NkJBQ25CLE1BQU0sQ0FBRSxVQUFBLENBQUMsSUFBSSxPQUFBLENBQUMsQ0FBQyxVQUFVLEtBQUssR0FBRzs0QkFDOUIsQ0FBQyxDQUFFLENBQUMsQ0FBQyxXQUFXLEtBQUssR0FBRyxDQUFFLElBQUksQ0FBRSxDQUFDLENBQUMsV0FBVyxLQUFLLEdBQUcsQ0FBRSxJQUFJLENBQUUsQ0FBQyxDQUFDLFdBQVcsS0FBSyxHQUFHLENBQUUsQ0FBQyxFQUQzRSxDQUMyRSxDQUN4Rjs2QkFDQSxNQUFNLENBQUMsVUFBRSxDQUFDLEVBQUUsQ0FBQzs0QkFDVixPQUFPLENBQUMsR0FBRyxDQUFFLENBQUMsQ0FBQyxjQUFjLEdBQUcsQ0FBRSxDQUFDLENBQUMsY0FBYyxJQUFJLENBQUMsQ0FBRSxDQUFDLENBQUM7d0JBQy9ELENBQUMsRUFBRSxDQUFDLENBQUUsQ0FBQzt3QkFNTCxPQUFPLEdBQUcsS0FBSyxDQUFDLElBQUksQ0FDdEIsSUFBSSxHQUFHLENBQUUsT0FBTyxDQUFDLElBQUk7NkJBQ2hCLE1BQU0sQ0FBRSxVQUFBLENBQUMsSUFBSSxPQUFBLENBQUMsQ0FBQyxVQUFVLEtBQUssR0FBRyxFQUFwQixDQUFvQixDQUFFOzZCQUNuQyxHQUFHLENBQUUsVUFBQSxDQUFDLElBQUksT0FBQSxDQUFDLENBQUMsTUFBTSxFQUFSLENBQVEsQ0FBRSxDQUM1QixDQUFDLENBQUMsTUFBTSxDQUFDO3dCQUtKLGdCQUFnQixHQUFHLEtBQUssQ0FBQyxJQUFJLENBQy9CLElBQUksR0FBRyxDQUFFLE9BQU8sQ0FBQyxJQUFJOzZCQUNoQixNQUFNLENBQUUsVUFBQSxDQUFDLElBQUksT0FBQSxDQUFDLENBQUMsVUFBVSxLQUFLLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLGNBQWMsRUFBMUMsQ0FBMEMsQ0FBRTs2QkFDekQsR0FBRyxDQUFFLFVBQUEsQ0FBQyxJQUFJLE9BQUEsQ0FBQyxDQUFDLE1BQU0sRUFBUixDQUFRLENBQUUsQ0FDNUIsQ0FBQyxDQUFDLE1BQU0sQ0FBQzt3QkFFVixXQUFPLEdBQUcsQ0FBQyxJQUFJLEdBQUc7Z0NBQ2QsTUFBTSxFQUFFLEdBQUc7Z0NBQ1gsSUFBSSxFQUFFO29DQUNGLEdBQUcsS0FBQTtvQ0FDSCxPQUFPLFNBQUE7b0NBQ1AsZ0JBQWdCLGtCQUFBO29DQUNoQixLQUFLLEVBQUUsT0FBTyxDQUFDLElBQUksQ0FBQyxNQUFNO29DQUMxQixLQUFLLEVBQUUsS0FBSyxDQUFDLElBQUksQ0FBQyxLQUFLO29DQUN2QixjQUFjLEVBQUUsS0FBSyxDQUFDLElBQUksQ0FBQyxjQUFjO2lDQUM1Qzs2QkFDSixFQUFDOzs7d0JBRVUsV0FBTyxHQUFHLENBQUMsSUFBSSxHQUFHLEVBQUUsTUFBTSxFQUFFLEdBQUcsRUFBRSxFQUFDOzs7O2FBQ3JELENBQUMsQ0FBQTtRQU1GLEdBQUcsQ0FBQyxNQUFNLENBQUMsZ0JBQWdCLEVBQUUsVUFBTyxHQUFHLEVBQUUsSUFBSTs7Ozs7O3dCQUUvQixLQUFnQixLQUFLLENBQUMsSUFBSSxFQUF4QixHQUFHLFNBQUEsRUFBRSxJQUFJLFVBQUEsQ0FBZ0I7d0JBQ2xCLFdBQU0sRUFBRSxDQUFDLFVBQVUsQ0FBQyxTQUFTLENBQUM7aUNBQ3hDLEtBQUssQ0FBQztnQ0FDSCxHQUFHLEtBQUE7Z0NBQ0gsSUFBSSxFQUFFLGFBQWE7NkJBQ3RCLENBQUM7aUNBQ0QsR0FBRyxFQUFHLEVBQUE7O3dCQUxMLE1BQU0sR0FBRyxTQUtKOzZCQUdOLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBRSxDQUFDLENBQUUsRUFBakIsY0FBaUI7d0JBQ2xCLFdBQU0sRUFBRSxDQUFDLFVBQVUsQ0FBQyxTQUFTLENBQUM7aUNBQ3pCLEdBQUcsQ0FBQztnQ0FDRCxJQUFJLEVBQUU7b0NBQ0YsR0FBRyxLQUFBO29DQUNILElBQUksTUFBQTtvQ0FDSixJQUFJLEVBQUUsYUFBYTtpQ0FDdEI7NkJBQ0osQ0FBQyxFQUFBOzt3QkFQTixTQU9NLENBQUM7OzRCQUdQLFdBQU0sRUFBRSxDQUFDLFVBQVUsQ0FBQyxTQUFTLENBQUM7NkJBQ3pCLEdBQUcsQ0FBRSxNQUFNLENBQUUsTUFBTSxDQUFDLElBQUksQ0FBRSxDQUFDLENBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQzs2QkFDbkMsTUFBTSxDQUFDOzRCQUNKLElBQUksRUFBRTtnQ0FDRixJQUFJLE1BQUE7NkJBQ1A7eUJBQ0osQ0FBQyxFQUFBOzt3QkFOTixTQU1NLENBQUE7OzRCQUdWLFdBQU8sR0FBRyxDQUFDLElBQUksR0FBRyxFQUFFLE1BQU0sRUFBRSxHQUFHLEVBQUUsRUFBQzs7O3dCQUV0QixXQUFPLEdBQUcsQ0FBQyxJQUFJLEdBQUcsRUFBRSxNQUFNLEVBQUUsR0FBRyxFQUFFLEVBQUE7Ozs7YUFDcEQsQ0FBQyxDQUFBO1FBTUYsR0FBRyxDQUFDLE1BQU0sQ0FBQyxTQUFTLEVBQUUsVUFBTyxHQUFHLEVBQUUsSUFBSTs7Ozs7O3dCQUV0QixHQUFHLEdBQUssS0FBSyxDQUFDLElBQUksSUFBZixDQUFnQjt3QkFDWixXQUFNLEVBQUUsQ0FBQyxVQUFVLENBQUMsU0FBUyxDQUFDO2lDQUN4QyxLQUFLLENBQUM7Z0NBQ0gsR0FBRyxLQUFBO2dDQUNILElBQUksRUFBRSxhQUFhOzZCQUN0QixDQUFDO2lDQUNELEdBQUcsRUFBRyxFQUFBOzt3QkFMTCxNQUFNLEdBQUcsU0FLSjt3QkFFWCxXQUFPLEdBQUcsQ0FBQyxJQUFJLEdBQUc7Z0NBQ2QsTUFBTSxFQUFFLEdBQUc7Z0NBQ1gsSUFBSSxFQUFFLE1BQU0sQ0FBQyxJQUFJLENBQUUsQ0FBQyxDQUFFLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUUsQ0FBQyxDQUFFLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFHOzZCQUN2RCxFQUFBOzs7d0JBR0QsV0FBTyxHQUFHLENBQUMsSUFBSSxHQUFHLEVBQUUsTUFBTSxFQUFFLEdBQUcsRUFBRSxFQUFDOzs7O2FBRXpDLENBQUMsQ0FBQztRQUVILFdBQU8sR0FBRyxDQUFDLEtBQUssRUFBRyxFQUFDOztLQUV2QixDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgY2xvdWQgZnJvbSAnd3gtc2VydmVyLXNkayc7XG5pbXBvcnQgKiBhcyBUY2JSb3V0ZXIgZnJvbSAndGNiLXJvdXRlcic7XG5cbmNsb3VkLmluaXQoICk7XG5cbmNvbnN0IGRiOiBEQi5EYXRhYmFzZSA9IGNsb3VkLmRhdGFiYXNlKCApO1xuY29uc3QgXyA9IGRiLmNvbW1hbmQ7XG5cbi8qKlxuICogQGRlc2NyaXB0aW9uIHsgfVxuICogQGFyZ3VtZW50IHsgZGI6IGRlbGl2ZXIgfVxuICog5b+r6YCS5qih5Z2X5a2X5q61IFxuICovXG7jgIAvKipcbiAqIC0tLS0tLS0tIOWtl+autSAtLS0tLS0tLS0tXG4gKiB0aWQsXG4gKiBpbWdzLFxuICogdHlwZTogJ2RlbGl2ZXItaW1nJ1xuICovXG5cbi8qKlxuICpcbiAqIEBkZXNjcmlwdGlvbiDooYznqIvmqKHlnZdcbiAqIC0tLS0tLS0tIOWtl+autSAtLS0tLS0tLS0tXG4gICAgICAgIHRpdGxlIOagh+mimCBzdHJpbmdcbiAgICAgICAgZGVzdGluYXRpb24g55uu55qE5ZywIHN0cmluZ1xuICAgICAgICBzdGFydF9kYXRlIOW8gOWni+aXtumXtCBudW1iZXJcbiAgICAgICAgZW5kX2RhdGUg57uT5p2f5pe26Ze0IG51bWJlclxuICAgICAgICByZWR1Y2VfcHJpY2Ug6KGM56iL56uL5YePIG51bWJlclxuICAgICAgICBzYWxlc192b2x1bWUg6ZSA5ZSu5oC76aKdXG4gICAgICAgIGZ1bGxyZWR1Y2VfYXRsZWFzdCDooYznqIvmu6Hlh48gLSDpl6jmp5sgbnVtYmVyXG4gICAgICAgIGZ1bGxyZWR1Y2VfdmFsdWVzIOihjOeoi+a7oeWHjyAtIOWHj+WkmuWwkSBudW1iZXJcbiAgICAgICAgY2FzaGNvdXBvbl9hdGxlYXN0IOihjOeoi+S7o+mHkeWIuCAtIOmXqOanmyBudW1iZXJcbiAgICAgICAgY2FzaGNvdXBvbl92YWx1ZXMg6KGM56iL5Luj6YeR5Yi4IC0g6YeR6aKdIG51bWJlclxuICAgICAgICBwb3N0YWdlIOmCrui0ueexu+WeiyBkaWMgXG4gICAgICAgIHBvc3RhZ2VmcmVlX2F0bGVhc3QgIOWFjemCrumXqOanmyBudW1iZXJcbiAgICAgICAgcGF5bWVudCDku5jmrL7nsbvlnosgZGljIFxuICAgICAgICBwdWJsaXNoZWQg5piv5ZCm5Y+R5biDIGJvb2xlYW5cbiAgICAgICAgaXNQYXNzZWQg5piv5ZCm6L+H5pyfXG4gICAgICAgIGNyZWF0ZVRpbWUg5Yib5bu65pe26Ze0XG4gICAgICAgIHVwZGF0ZVRpbWUg5pu05paw5pe26Ze0XG4gICAgICAgIGlzQ2xvc2VkOiDmmK/lkKblt7Lnu4/miYvliqjlhbPpl61cbiAgICAgICAgY2FsbE1vbmV5VGltZXM6IOWPkei1t+WCrOasvuasoeaVsFxuICovXG5leHBvcnQgY29uc3QgbWFpbiA9IGFzeW5jICggZXZlbnQsIGNvbnRleHQgKSA9PiB7XG5cbiAgICBjb25zdCBhcHAgPSBuZXcgVGNiUm91dGVyKHsgZXZlbnQgfSk7XG5cbiAgICAvKipcbiAgICAgKiAtLS0tLS0g6K+35rGCIC0tLS0tLS0tXG4gICAgICoge1xuICAgICAqICAgIHNob3VsZEdldEdvb2RzOiDpu5jorqR0cnVl77yM5Y+v5Lul5LiN5aGr77yM6I635Y+W6KGM56iL5o6o6I2Q5ZWG5ZOBXG4gICAgICogfVxuICAgICAqL1xuICAgIGFwcC5yb3V0ZXIoJ2VudGVyJywgYXN5bmMoIGN0eCwgbmV4dCApID0+IHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGNvbnN0IHNob3VsZEdldEdvb2RzID0gZXZlbnQuZGF0YSA/IGV2ZW50LmRhdGEuc2hvdWxkR2V0R29vZHMgOiB1bmRlZmluZWQ7XG5cbiAgICAgICAgICAgIC8vIOaMieW8gOWni+aXpeacn+ato+W6j++8jOiOt+WPluacgOWkmjLmnaHlt7Llj5HluIPvvIzmnKrnu5PmnZ/nmoTooYznqItcbiAgICAgICAgICAgIGNvbnN0IGRhdGEkID0gYXdhaXQgZGIuY29sbGVjdGlvbigndHJpcCcpXG4gICAgICAgICAgICAgICAgLndoZXJlKHtcbiAgICAgICAgICAgICAgICAgICAgaXNDbG9zZWQ6IGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICBwdWJsaXNoZWQ6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgIGVuZF9kYXRlOiBfLmd0KCBuZXcgRGF0ZSggKS5nZXRUaW1lKCApKVxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLmxpbWl0KCAyIClcbiAgICAgICAgICAgICAgICAub3JkZXJCeSgnc3RhcnRfZGF0ZScsICdhc2MnKVxuICAgICAgICAgICAgICAgIC5nZXQoICk7XG5cbiAgICAgICAgICAgIGxldCB0cmlwcyA9IGRhdGEkLmRhdGE7XG5cbiAgICAgICAgICAgIC8vIOaLieWPluacgOaWsOihjOeoi+eahOaOqOiNkOWVhuWTgVxuICAgICAgICAgICAgaWYgKCggISF0cmlwc1sgMCBdICYmIHNob3VsZEdldEdvb2RzID09PSB1bmRlZmluZWQgKSB8fCBzaG91bGRHZXRHb29kcyA9PT0gdHJ1ZSApIHtcbiAgICAgICAgICAgICAgICBjb25zdCB0cmlwT25lUHJvZHVjdHMkID0gYXdhaXQgUHJvbWlzZS5hbGwoIHRyaXBzWyAwIF0uc2VsZWN0ZWRQcm9kdWN0SWRzLm1hcCggcGlkID0+IHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGNsb3VkLmNhbGxGdW5jdGlvbih7XG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBfaWQ6IHBpZCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICR1cmw6ICdkZXRhaWwnXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogJ2dvb2QnXG4gICAgICAgICAgICAgICAgICAgIH0pLnRoZW4oIHJlcyA9PiByZXMucmVzdWx0LmRhdGEgKTtcbiAgICAgICAgICAgICAgICB9KSk7XG4gICAgICAgICAgICAgICAgdHJpcHNbIDAgXSA9IE9iamVjdC5hc3NpZ24oeyB9LCB0cmlwc1sgMCBdLCB7XG4gICAgICAgICAgICAgICAgICAgIHByb2R1Y3RzOiB0cmlwT25lUHJvZHVjdHMkXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiBjdHguYm9keSA9IHtcbiAgICAgICAgICAgICAgICBzdGF0dXM6IDIwMCxcbiAgICAgICAgICAgICAgICBkYXRhOiB0cmlwc1xuICAgICAgICAgICAgfTtcblxuICAgICAgICB9IGNhdGNoICggZSApIHtcbiAgICAgICAgICAgIHJldHVybiBjdHguYm9keSA9IHtcbiAgICAgICAgICAgICAgICBzdGF0dXM6IDUwMCxcbiAgICAgICAgICAgICAgICBtZXNzYWdlOiBlXG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICBhcHAucm91dGVyKCdsaXN0JywgYXN5bmMoIGN0eCwgbmV4dCApID0+IHtcbiAgICAgICAgdHJ5IHtcblxuICAgICAgICAgICAgLy8g5p+l6K+i5p2h5pWwXG4gICAgICAgICAgICBjb25zdCBsaW1pdCA9IDIwO1xuICAgICAgICAgICAgY29uc3Qgc2VhcmNoJCA9IGV2ZW50LmRhdGEuc2VhcmNoIHx8ICcnO1xuICAgICAgICAgICAgY29uc3Qgc2VhcmNoID0gbmV3IFJlZ0V4cCggc2VhcmNoJC5yZXBsYWNlKC9cXHMrL2csIFwiXCIpLCAnaScpO1xuXG4gICAgICAgICAgICAvLyDojrflj5bmgLvmlbBcbiAgICAgICAgICAgIGNvbnN0IHRvdGFsJCA9IGF3YWl0IGRiLmNvbGxlY3Rpb24oJ3RyaXAnKVxuICAgICAgICAgICAgICAgIC53aGVyZSh7XG4gICAgICAgICAgICAgICAgICAgIHRpdGxlOiBzZWFyY2hcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIC5jb3VudCggKTtcblxuICAgICAgICAgICAgLy8g6I635Y+W5pWw5o2uXG4gICAgICAgICAgICBjb25zdCBkYXRhJCA9IGF3YWl0IGRiLmNvbGxlY3Rpb24oJ3RyaXAnKVxuICAgICAgICAgICAgICAgIC53aGVyZSh7XG4gICAgICAgICAgICAgICAgICAgIHRpdGxlOiBzZWFyY2hcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIC5saW1pdCggbGltaXQgKVxuICAgICAgICAgICAgICAgIC5za2lwKCggZXZlbnQuZGF0YS5wYWdlIC0gMSApICogbGltaXQgKVxuICAgICAgICAgICAgICAgIC5vcmRlckJ5KCd1cGRhdGVUaW1lJywgJ2Rlc2MnKVxuICAgICAgICAgICAgICAgIC5nZXQoICk7XG5cbiAgICAgICAgICAgIC8vIOiOt+WPluavj+i6uuihjOeoi+eahOiuouWNleaVsFxuICAgICAgICAgICAgY29uc3Qgb3JkZXJzJCA9IGF3YWl0IFByb21pc2UuYWxsKCBkYXRhJC5kYXRhLm1hcCggeCA9PiB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGRiLmNvbGxlY3Rpb24oJ29yZGVyJylcbiAgICAgICAgICAgICAgICAgICAgLndoZXJlKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRpZDogeC5faWRcbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgLmNvdW50KCApO1xuICAgICAgICAgICAgfSkpO1xuXG4gICAgICAgICAgICBjb25zdCBpbmplY3RPcmRlckNvdW50ID0gZGF0YSQuZGF0YS5tYXAoKCB4LCBrICkgPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiBPYmplY3QuYXNzaWduKHsgfSwgeCwge1xuICAgICAgICAgICAgICAgICAgICBvcmRlcnM6IG9yZGVycyRbIGsgXS50b3RhbFxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgLy8g6I635Y+W5q+P6Lq66KGM56iL55qE6ZSA5ZSu6aKdXG4gICAgICAgICAgICBjb25zdCBzYWxlc1ZvbHVtZSQgPSBhd2FpdCBQcm9taXNlLmFsbCggaW5qZWN0T3JkZXJDb3VudC5tYXAoIHggPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiBkYi5jb2xsZWN0aW9uKCdvcmRlcicpXG4gICAgICAgICAgICAgICAgICAgIC53aGVyZSh7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aWQ6IHguX2lkXG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgIC5nZXQoICk7XG4gICAgICAgICAgICB9KSlcblxuICAgICAgICAgICAgY29uc3QgaW5qZWN0U2FsZXNWb2x1bWUgPSBzYWxlc1ZvbHVtZSQubWFwKCggeCwgayApID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCBzYWxlc1ZvbHVtZSA9IHguZGF0YS5yZWR1Y2UoKCBuLCBtICkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBwcmljZSA9IG0uYWxsb2NhdGVkUHJpY2UgfHwgbS5wcmljZTtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgY291bnQgPSBtLmFsbG9jYXRlZENvdW50ID09PSB1bmRlZmluZWQgfHwgbS5hbGxvY2F0ZWRDb3VudCA9PT0gbnVsbCA/IG0uY291bnQgOiBtLmFsbG9jYXRlZENvdW50IDtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG4gKyBjb3VudCAqIHByaWNlO1xuICAgICAgICAgICAgICAgIH0sIDAgKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gT2JqZWN0LmFzc2lnbih7IH0sIGluamVjdE9yZGVyQ291bnRbIGsgXSwge1xuICAgICAgICAgICAgICAgICAgICBzYWxlc192b2x1bWU6IHNhbGVzVm9sdW1lXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgcmV0dXJuIGN0eC5ib2R5ID0ge1xuICAgICAgICAgICAgICAgIHN0YXR1czogMjAwLFxuICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgc2VhcmNoOiBldmVudC5kYXRhLnRpdGxlLnJlcGxhY2UoL1xccysvZywgJycpLFxuICAgICAgICAgICAgICAgICAgICBwYWdlU2l6ZTogbGltaXQsXG4gICAgICAgICAgICAgICAgICAgIHBhZ2U6IGV2ZW50LmRhdGEucGFnZSxcbiAgICAgICAgICAgICAgICAgICAgZGF0YTogaW5qZWN0U2FsZXNWb2x1bWUsXG4gICAgICAgICAgICAgICAgICAgIHRvdGFsOiB0b3RhbCQudG90YWwsXG4gICAgICAgICAgICAgICAgICAgIHRvdGFsUGFnZTogTWF0aC5jZWlsKCB0b3RhbCQudG90YWwgLyBsaW1pdCApXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfTtcblxuICAgICAgICB9IGNhdGNoICggZSApIHtcbiAgICAgICAgICAgIHJldHVybiBjdHguYm9keSA9IHtcbiAgICAgICAgICAgICAgICBzdGF0dXM6IDUwMCxcbiAgICAgICAgICAgICAgICBtZXNzYWdlOiBlXG4gICAgICAgICAgICB9O1xuICAgICAgICB9IFxuICAgIH0pO1xuICAgIFxuICAgIGFwcC5yb3V0ZXIoJ2RldGFpbCcsIGFzeW5jKCBjdHgsIG5leHQgKSA9PiB7XG4gICAgICAgIHRyeSB7XG5cbiAgICAgICAgICAgIC8vIOiOt+WPluWfuuacrOivpuaDhVxuICAgICAgICAgICAgY29uc3QgZGF0YSQgPSBhd2FpdCBkYi5jb2xsZWN0aW9uKCd0cmlwJylcbiAgICAgICAgICAgICAgICAgICAgLndoZXJlKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIF9pZDogZXZlbnQuZGF0YS5faWRcbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgLmdldCggKTtcbiAgICAgICAgICAgIGNvbnN0IG1ldGEgPSBkYXRhJC5kYXRhWyAwIF07XG5cbiAgICAgICAgICAgIC8vIOmAmui/h+W3sumAieeahOWVhuWTgWlkcyzmi7/liLDlr7nlupTnmoTlm77niYfjgIF0aXRsZeOAgV9pZFxuICAgICAgICAgICAgY29uc3QgcHJvZHVjdHMkOiBhbnkgPSBhd2FpdCBQcm9taXNlLmFsbCggbWV0YS5zZWxlY3RlZFByb2R1Y3RJZHMubWFwKCBwaWQgPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiBkYi5jb2xsZWN0aW9uKCdnb29kcycpXG4gICAgICAgICAgICAgICAgICAgICAgICAud2hlcmUoe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIF9pZDogcGlkXG4gICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAgICAgLmZpZWxkKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbWc6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGl0bGU6IHRydWVcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgICAgICAuZ2V0KCApO1xuICAgICAgICAgICAgfSkpO1xuXG4gICAgICAgICAgICBtZXRhLnNlbGVjdGVkUHJvZHVjdHMgPSBwcm9kdWN0cyQubWFwKCB4ID0+IHtcbiAgICAgICAgICAgICAgICByZXR1cm4geC5kYXRhWyAwIF07XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgcmV0dXJuIGN0eC5ib2R5ID0ge1xuICAgICAgICAgICAgICAgIHN0YXR1czogMjAwLFxuICAgICAgICAgICAgICAgIGRhdGE6IGRhdGEkLmRhdGFbIDAgXVxuICAgICAgICAgICAgfTtcblxuICAgICAgICB9IGNhdGNoKCBlICkge1xuICAgICAgICAgICAgcmV0dXJuIGN0eC5ib2R5ID0ge1xuICAgICAgICAgICAgICAgIHN0YXR1czogNTAwLFxuICAgICAgICAgICAgICAgIG1lc3NhZ2U6IGVcbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgIGFwcC5yb3V0ZXIoJ2VkaXQnLCBhc3luYyggY3R4LCBuZXh0ICkgPT4ge1xuICAgICAgICB0cnkge1xuXG4gICAgICAgICAgICBsZXQgX2lkID0gZXZlbnQuZGF0YS5faWQ7XG5cbiAgICAgICAgICAgIC8vIOagoemqjDHvvJrlpoLmnpzmmK/mg7PopoHlj5HluIPlvZPliY3ooYznqIvvvIzliJnmo4Dmn6XmmK/lkKbmnInigJzlt7Llj5HluIPooYznqIvnmoTnu5PmnZ/ml7bpl7TlpKfkuo7nrYnkuo7lvZPliY3mlrDlu7rooYznqIvnmoTlvIDlp4vml7bpl7TopoHigJ1cbiAgICAgICAgICAgIGlmICggZXZlbnQuZGF0YS5wdWJsaXNoZWQgJiYgIV9pZCApIHtcbiAgICAgICAgICAgICAgICBjb25zdCBydWxlMSQgPSBhd2FpdCBkYi5jb2xsZWN0aW9uKCd0cmlwJykud2hlcmUoe1xuICAgICAgICAgICAgICAgICAgICBlbmRfZGF0ZTogXy5ndGUoIGV2ZW50LmRhdGEuc3RhcnRfZGF0ZSApXG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAuY291bnQoICk7XG4gICAgICAgIFxuICAgICAgICAgICAgICAgIGlmICggcnVsZTEkLnRvdGFsID4gMCApIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKCByZXNvbHZlID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUoe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGE6IG51bGwsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc3RhdHVzOiA1MDAsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbWVzc2FnZTogJ+W8gOWni+aXtumXtOW/hemhu+Wkp+S6juS4iui2n+ihjOeoi+eahOe7k+adn+aXtumXtCdcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gXG4gICAgXG4gICAgICAgICAgICAvLyDliJvlu7ogXG4gICAgICAgICAgICBpZiAoICFfaWQgKSB7XG4gICAgXG4gICAgICAgICAgICAgICAgY29uc3QgY3JlYXRlJCA9IGF3YWl0IGRiLmNvbGxlY3Rpb24oJ3RyaXAnKS5hZGQoe1xuICAgICAgICAgICAgICAgICAgICBkYXRhOiBPYmplY3QuYXNzaWduKHsgfSwgZXZlbnQuZGF0YSwge1xuICAgICAgICAgICAgICAgICAgICAgICAgY2FsbE1vbmV5VGltZXM6IDBcbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICBfaWQgPSBjcmVhdGUkLl9pZDtcbiAgICBcbiAgICAgICAgICAgIC8vIOe8lui+kVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICBcbiAgICAgICAgICAgICAgICBjb25zdCBvcmlnaW4kID0gYXdhaXQgZGIuY29sbGVjdGlvbigndHJpcCcpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAud2hlcmUoe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIF9pZFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5nZXQoICk7XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgY29uc3Qgb3JpZ2luID0gb3JpZ2luJC5kYXRhWyAwIF07XG4gICAgXG4gICAgICAgICAgICAgICAgZGVsZXRlIG9yaWdpblsnX2lkJ107XG4gICAgICAgICAgICAgICAgZGVsZXRlIGV2ZW50LmRhdGFbJ19pZCddXG4gICAgXG4gICAgICAgICAgICAgICAgY29uc3QgdGVtcCA9IE9iamVjdC5hc3NpZ24oeyB9LCBvcmlnaW4sIHtcbiAgICAgICAgICAgICAgICAgICAgLi4uZXZlbnQuZGF0YVxuICAgICAgICAgICAgICAgIH0pXG4gICAgXG4gICAgICAgICAgICAgICAgYXdhaXQgZGIuY29sbGVjdGlvbigndHJpcCcpXG4gICAgICAgICAgICAgICAgICAgICAgICAuZG9jKCBfaWQgKVxuICAgICAgICAgICAgICAgICAgICAgICAgLnNldCh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YTogdGVtcFxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiBjdHguYm9keSA9IHtcbiAgICAgICAgICAgICAgICBkYXRhOiBfaWQsXG4gICAgICAgICAgICAgICAgc3RhdHVzOiAyMDBcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgXG4gICAgICAgIH0gY2F0Y2goIGUgKSB7XG4gICAgICAgICAgICByZXR1cm4gY3R4LmJvZHkgPSB7XG4gICAgICAgICAgICAgICAgc3RhdHVzOiA1MDAsXG4gICAgICAgICAgICAgICAgbWVzc2FnZTogZVxuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgLyoqIFxuICAgICAqIEBkZXNjcmlwdGlvblxuICAgICAqIOiOt+WPluihjOeoi+W6leS4i+eahOWfuuacrOS4muWKoeaVsOaNriDplIDllK7mgLvpop3jgIHlrqLmiLfmgLvmlbDjgIHmnKrku5jlsL7mrL7lrqLmiLfmlbDph4/jgIHmgLvorqLljZXmlbDjgIHooYznqIvlkI3np7DjgIHlt7Llj5HpgIHlgqzmrL7mrKHmlbBcbiAgICAgKi9cbiAgICBhcHAucm91dGVyKCdvcmRlci1pbmZvJywgYXN5bmMoIGN0eCwgbmV4dCApID0+IHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGNvbnN0IHsgdGlkIH0gPSBldmVudC5kYXRhO1xuXG4gICAgICAgICAgICAvKiog6KGM56iL6K+m5oOFICovXG4gICAgICAgICAgICBjb25zdCB0cmlwJCA9IGF3YWl0IGRiLmNvbGxlY3Rpb24oJ3RyaXAnKVxuICAgICAgICAgICAgICAgIC5kb2MoIHRpZCApXG4gICAgICAgICAgICAgICAgLmdldCggKTtcbiAgICAgICAgXG4gICAgICAgICAgICAvLyDojrflj5booYznqIvlupXkuIvmiYDmnInnmoTorqLljZVcbiAgICAgICAgICAgIGNvbnN0IG9yZGVycyQgPSBhd2FpdCBkYi5jb2xsZWN0aW9uKCdvcmRlcicpXG4gICAgICAgICAgICAgICAgLndoZXJlKHtcbiAgICAgICAgICAgICAgICAgICAgdGlkXG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAuZ2V0KCApO1xuXG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIOaAu+aUtuebilxuICAgICAgICAgICAgICogIeiHs+WwkeW3suS7mOiuoumHke+8jOiHs+WwkeW3sue7j+iwg+iKguWUruS7t+OAgeaVsOmHj1xuICAgICAgICAgICAgICovXG4gICAgICAgICAgICBjb25zdCBzdW0gPSBvcmRlcnMkLmRhdGFcbiAgICAgICAgICAgICAgICAuZmlsdGVyKCB4ID0+IHgucGF5X3N0YXR1cyAhPT0gJzAnICYmXG4gICAgICAgICAgICAgICAgICAgICgoIHguYmFzZV9zdGF0dXMgPT09ICcxJyApIHx8ICggeC5iYXNlX3N0YXR1cyA9PT0gJzInICkgfHwgKCB4LmJhc2Vfc3RhdHVzID09PSAnMycgKSlcbiAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgICAgLnJlZHVjZSgoIHgsIHkgKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB4ICsgKCB5LmFsbG9jYXRlZFByaWNlICogKCB5LmFsbG9jYXRlZENvdW50IHx8IDAgKSk7XG4gICAgICAgICAgICAgICAgfSwgMCApO1xuXG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIOaAu+WuouaIt+aVsOmHj1xuICAgICAgICAgICAgICogIeiHs+WwkeW3suS7mOiuoumHkVxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICBjb25zdCBjbGllbnRzID0gQXJyYXkuZnJvbShcbiAgICAgICAgICAgICAgICBuZXcgU2V0KCBvcmRlcnMkLmRhdGFcbiAgICAgICAgICAgICAgICAgICAgLmZpbHRlciggeCA9PiB4LnBheV9zdGF0dXMgIT09ICcwJyApXG4gICAgICAgICAgICAgICAgICAgIC5tYXAoIHggPT4geC5vcGVuaWQgKVxuICAgICAgICAgICAgKSkubGVuZ3RoO1xuXG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIOaAu+acquS6pOWwvuasvuWuouaIt+aVsOmHj1xuICAgICAgICAgICAgICovXG4gICAgICAgICAgICBjb25zdCBub3RQYXlBbGxDbGllbnRzID0gQXJyYXkuZnJvbShcbiAgICAgICAgICAgICAgICBuZXcgU2V0KCBvcmRlcnMkLmRhdGFcbiAgICAgICAgICAgICAgICAgICAgLmZpbHRlciggeCA9PiB4LnBheV9zdGF0dXMgPT09ICcxJyAmJiAhIXguYWxsb2NhdGVkQ291bnQgKVxuICAgICAgICAgICAgICAgICAgICAubWFwKCB4ID0+IHgub3BlbmlkIClcbiAgICAgICAgICAgICkpLmxlbmd0aDtcblxuICAgICAgICAgICAgcmV0dXJuIGN0eC5ib2R5ID0ge1xuICAgICAgICAgICAgICAgIHN0YXR1czogMjAwLFxuICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgc3VtLCAvLyDplIDllK7mgLvpop1cbiAgICAgICAgICAgICAgICAgICAgY2xpZW50cywgLy8g5a6i5oi35oC75pWwXG4gICAgICAgICAgICAgICAgICAgIG5vdFBheUFsbENsaWVudHMsIC8vIOacquS7mOWwvuasvuWuouaIt+aVsOmHj1xuICAgICAgICAgICAgICAgICAgICBjb3VudDogb3JkZXJzJC5kYXRhLmxlbmd0aCwgLy8g5oC76K6i5Y2V5pWwLFxuICAgICAgICAgICAgICAgICAgICB0aXRsZTogdHJpcCQuZGF0YS50aXRsZSwgLy8g6KGM56iL5ZCN56ewXG4gICAgICAgICAgICAgICAgICAgIGNhbGxNb25leVRpbWVzOiB0cmlwJC5kYXRhLmNhbGxNb25leVRpbWVzIC8vIOW3suWPkemAgeWCrOasvuasoeaVsFxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgfSBjYXRjaCAoIGUgKSB7IHJldHVybiBjdHguYm9keSA9IHsgc3RhdHVzOiA1MDAgfTt9XG4gICAgfSlcblxuICAgIC8qKlxuICAgICAqIEBAZGVzY3JpcHRpb25cbiAgICAgKiDmm7TmlrDooYznqIvlupXkuIvnmoTlv6vpgJLlm77lhoxcbiAgICAgKi9cbiAgICBhcHAucm91dGVyKCd1cGRhdGUtZGVsaXZlcicsIGFzeW5jKCBjdHgsIG5leHQgKSA9PiB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBjb25zdCB7IHRpZCwgaW1ncyB9ID0gZXZlbnQuZGF0YTtcbiAgICAgICAgICAgIGNvbnN0IHRhcmdldCA9IGF3YWl0IGRiLmNvbGxlY3Rpb24oJ2RlbGl2ZXInKVxuICAgICAgICAgICAgICAgIC53aGVyZSh7XG4gICAgICAgICAgICAgICAgICAgIHRpZCxcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogJ2RlbGl2ZXItaW1nJ1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLmdldCggKTtcblxuICAgICAgICAgICAgLy8g5Yib5bu6XG4gICAgICAgICAgICBpZiAoICF0YXJnZXQuZGF0YVsgMCBdKSB7XG4gICAgICAgICAgICAgICAgYXdhaXQgZGIuY29sbGVjdGlvbignZGVsaXZlcicpXG4gICAgICAgICAgICAgICAgICAgIC5hZGQoe1xuICAgICAgICAgICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRpZCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbWdzLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6ICdkZWxpdmVyLWltZydcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAvLyDmm7TmlrBcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgYXdhaXQgZGIuY29sbGVjdGlvbignZGVsaXZlcicpXG4gICAgICAgICAgICAgICAgICAgIC5kb2MoIFN0cmluZyggdGFyZ2V0LmRhdGFbIDAgXS5faWQpKVxuICAgICAgICAgICAgICAgICAgICAudXBkYXRlKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbWdzXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiBjdHguYm9keSA9IHsgc3RhdHVzOiAyMDAgfTtcbiAgICAgICAgICAgIFxuICAgICAgICB9IGNhdGNoICggZSApIHsgcmV0dXJuIGN0eC5ib2R5ID0geyBzdGF0dXM6IDUwMCB9fVxuICAgIH0pXG5cbiAgICAvKipcbiAgICAgKiBAQGRlc2NyaXB0aW9uXG4gICAgICog6I635Y+W6KGM56iL5bqV5LiL55qE5b+r6YCS5Zu+5YaMXG4gICAgICovXG4gICAgYXBwLnJvdXRlcignZGVsaXZlcicsIGFzeW5jKCBjdHgsIG5leHQgKSA9PiB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBjb25zdCB7IHRpZCB9ID0gZXZlbnQuZGF0YTtcbiAgICAgICAgICAgIGNvbnN0IHRhcmdldCA9IGF3YWl0IGRiLmNvbGxlY3Rpb24oJ2RlbGl2ZXInKVxuICAgICAgICAgICAgICAgIC53aGVyZSh7XG4gICAgICAgICAgICAgICAgICAgIHRpZCxcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogJ2RlbGl2ZXItaW1nJ1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLmdldCggKTtcblxuICAgICAgICAgICAgcmV0dXJuIGN0eC5ib2R5ID0geyBcbiAgICAgICAgICAgICAgICBzdGF0dXM6IDIwMCxcbiAgICAgICAgICAgICAgICBkYXRhOiB0YXJnZXQuZGF0YVsgMCBdID8gdGFyZ2V0LmRhdGFbIDAgXS5pbWdzIDogWyBdXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfSBjYXRjaCAoIGUgKSB7XG4gICAgICAgICAgICByZXR1cm4gY3R4LmJvZHkgPSB7IHN0YXR1czogNTAwIH07XG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgIHJldHVybiBhcHAuc2VydmUoICk7XG5cbn0iXX0=