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
var find_1 = require("./find");
cloud.init();
var db = cloud.database();
var _ = db.command;
exports.main = function (event, context) { return __awaiter(_this, void 0, void 0, function () {
    var app;
    var _this = this;
    return __generator(this, function (_a) {
        app = new TcbRouter({ event: event });
        app.router('findCannotBuy', function (ctx, next) { return __awaiter(_this, void 0, void 0, function () {
            var _a, tid, list, openId, findings$, hasBeenBuy$, goodDetails$, goods_1, standards_1, lowStock_1, hasBeenDelete_1, cannotBuy, hasBeenBuy, orders, reqData, createOrder$, e_1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 6, , 7]);
                        _a = event.data, tid = _a.tid, list = _a.list;
                        openId = event.data.openId || event.userInfo.openId;
                        return [4, Promise.all(event.data.list.map(function (i) {
                                return find_1.find$({
                                    tid: i.tid,
                                    pid: i.pid,
                                    sid: i.sid,
                                    status: '2'
                                }, db, ctx);
                            }))];
                    case 1:
                        findings$ = _b.sent();
                        if (findings$.some(function (x) { return x.status !== 200; })) {
                            throw '查询购物清单错误';
                        }
                        return [4, Promise.all(event.data.list.map(function (i) {
                                return find_1.find$({
                                    tid: i.tid,
                                    pid: i.pid,
                                    sid: i.sid,
                                    status: '1'
                                }, db, ctx);
                            }))];
                    case 2:
                        hasBeenBuy$ = _b.sent();
                        return [4, Promise.all(event.data.list.map(function (i) {
                                if (!!i.sid) {
                                    return db.collection('standards')
                                        .where({
                                        _id: i.sid
                                    })
                                        .get();
                                }
                                else {
                                    return db.collection('goods')
                                        .where({
                                        _id: i.pid
                                    })
                                        .get();
                                }
                            }))];
                    case 3:
                        goodDetails$ = _b.sent();
                        goods_1 = goodDetails$.map(function (x) { return x.data[0]; }).filter(function (y) { return !!y; }).filter(function (z) { return !z.pid; });
                        standards_1 = goodDetails$.map(function (x) { return x.data[0]; }).filter(function (y) { return !!y; }).filter(function (z) { return !!z.pid; });
                        lowStock_1 = [];
                        hasBeenDelete_1 = [];
                        cannotBuy = findings$.map(function (x) { return x.data[0]; }).filter(function (y) { return !!y; });
                        hasBeenBuy = hasBeenBuy$.map(function (x) { return x.data[0]; }).filter(function (y) { return !!y; });
                        event.data.list.map(function (i) {
                            if (!!i.sid) {
                                var standard = standards_1.find(function (x) { return x._id === i.sid && x.pid === i.pid; });
                                if (!standard) {
                                    hasBeenDelete_1.push(i);
                                }
                                else if (standard.stock !== undefined && standard.stock < i.count) {
                                    lowStock_1.push(Object.assign({}, i, {
                                        stock: standard.stock,
                                        goodName: i.name,
                                        standerName: i.standername
                                    }));
                                }
                            }
                            else {
                                var good = goods_1.find(function (x) { return x._id === i.pid; });
                                if (!good || (!!good && !good.visiable)) {
                                    hasBeenDelete_1.push(i);
                                }
                                else if (good.stock !== undefined && good.stock < i.count) {
                                    lowStock_1.push(Object.assign({}, i, {
                                        stock: good.stock,
                                        goodName: i.name
                                    }));
                                }
                            }
                        });
                        orders = [];
                        if (!(lowStock_1.length === 0 && cannotBuy.length === 0 && hasBeenDelete_1.length === 0)) return [3, 5];
                        reqData = {
                            tid: tid,
                            openId: openId,
                            from: event.data.from || 'system',
                            orders: event.data.list
                        };
                        return [4, cloud.callFunction({
                                data: {
                                    data: reqData,
                                    $url: 'create'
                                },
                                name: 'order'
                            })];
                    case 4:
                        createOrder$ = _b.sent();
                        if (createOrder$.result.status !== 200) {
                            return [2, ctx.body = {
                                    status: 500,
                                    message: '创建预付订单失败！'
                                }];
                        }
                        orders = createOrder$.result.data;
                        _b.label = 5;
                    case 5: return [2, ctx.body = {
                            data: {
                                lowStock: lowStock_1,
                                hasBeenDelete: hasBeenDelete_1,
                                cannotBuy: cannotBuy,
                                hasBeenBuy: hasBeenBuy,
                                orders: orders
                            },
                            status: 200
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
        app.router('create', function (ctx, next) { return __awaiter(_this, void 0, void 0, function () {
            var list, e_2;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        list = event.data.list;
                        return [4, Promise.all(list.map(function (orderMeta) { return __awaiter(_this, void 0, void 0, function () {
                                var tid, pid, sid, oid, price, groupPrice, query, find$, meta, creaet$, metaShoppingList, lastOids, update$;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            tid = orderMeta.tid, pid = orderMeta.pid, sid = orderMeta.sid, oid = orderMeta.oid, price = orderMeta.price, groupPrice = orderMeta.groupPrice;
                                            query = {
                                                tid: tid,
                                                pid: pid
                                            };
                                            if (!!sid) {
                                                query['sid'] = sid;
                                            }
                                            return [4, db.collection('shopping-list')
                                                    .where(query)
                                                    .get()];
                                        case 1:
                                            find$ = _a.sent();
                                            if (!(find$.data.length === 0)) return [3, 3];
                                            meta = Object.assign({}, query, {
                                                oids: [oid],
                                                purchase: 0,
                                                buy_status: '0',
                                                base_status: '0',
                                                adjustPrice: price,
                                                adjustGroupPrice: groupPrice,
                                                createTime: new Date().getTime()
                                            });
                                            return [4, db.collection('shopping-list')
                                                    .add({
                                                    data: meta
                                                })];
                                        case 2:
                                            creaet$ = _a.sent();
                                            return [2];
                                        case 3:
                                            metaShoppingList = find$.data[0];
                                            if (!!metaShoppingList.oids.find(function (x) { return x === oid; })) return [3, 5];
                                            lastOids = metaShoppingList.oids;
                                            lastOids.unshift(oid);
                                            metaShoppingList = Object.assign({}, metaShoppingList, {
                                                oids: lastOids,
                                                updateTime: new Date().getTime()
                                            });
                                            return [4, db.collection('shopping-list').doc(String(find$.data[0]._id))
                                                    .update({
                                                    data: {
                                                        oids: lastOids,
                                                        updateTime: new Date().getTime()
                                                    }
                                                })];
                                        case 4:
                                            update$ = _a.sent();
                                            _a.label = 5;
                                        case 5: return [2];
                                    }
                                });
                            }); }))];
                    case 1:
                        _a.sent();
                        return [2, ctx.body = {
                                status: 200
                            }];
                    case 2:
                        e_2 = _a.sent();
                        return [2, ctx.body = { status: 500 }];
                    case 3: return [2];
                }
            });
        }); });
        app.router('list', function (ctx, next) { return __awaiter(_this, void 0, void 0, function () {
            var tid, lists$, orders$_1, goods$_1, list, e_3;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 4, , 5]);
                        tid = event.data.tid;
                        return [4, db.collection('shopping-list')
                                .where({
                                tid: tid
                            })
                                .get()];
                    case 1:
                        lists$ = _a.sent();
                        return [4, Promise.all(lists$.data.map(function (list) {
                                return Promise.all(list.oids.map(function (oid) { return __awaiter(_this, void 0, void 0, function () {
                                    var order$, user$;
                                    return __generator(this, function (_a) {
                                        switch (_a.label) {
                                            case 0: return [4, db.collection('order').doc(oid)
                                                    .get()];
                                            case 1:
                                                order$ = _a.sent();
                                                return [4, db.collection('user')
                                                        .where({
                                                        openid: order$.data.openid
                                                    })
                                                        .get()];
                                            case 2:
                                                user$ = _a.sent();
                                                return [2, Object.assign({}, order$.data, {
                                                        user: user$.data[0]
                                                    })];
                                        }
                                    });
                                }); }));
                            }))];
                    case 2:
                        orders$_1 = _a.sent();
                        return [4, Promise.all(lists$.data.map(function (list) { return __awaiter(_this, void 0, void 0, function () {
                                var pid, sid, collectionName, standar$, good$;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            pid = list.pid, sid = list.sid;
                                            collectionName = !!sid ? 'standards' : 'goods';
                                            standar$ = null;
                                            return [4, db.collection('goods')
                                                    .doc(pid)
                                                    .get()];
                                        case 1:
                                            good$ = _a.sent();
                                            if (!!!sid) return [3, 3];
                                            return [4, db.collection('standards')
                                                    .doc(sid)
                                                    .get()];
                                        case 2:
                                            standar$ = _a.sent();
                                            _a.label = 3;
                                        case 3: return [2, {
                                                title: good$.data.title,
                                                name: standar$ ? standar$.data.name : '',
                                                price: standar$ ? standar$.data.price : good$.data.price,
                                                img: standar$ ? standar$.data.img : good$.data.img[0],
                                                groupPrice: standar$ ? standar$.data.groupPrice : good$.data.groupPrice,
                                            }];
                                    }
                                });
                            }); }))];
                    case 3:
                        goods$_1 = _a.sent();
                        list = lists$.data.map(function (l, k) {
                            var _a = goods$_1[k], img = _a.img, price = _a.price, groupPrice = _a.groupPrice, title = _a.title, name = _a.name;
                            return Object.assign({}, l, {
                                img: img,
                                price: price,
                                groupPrice: groupPrice,
                                goodName: title,
                                standarName: name,
                                order: orders$_1[k],
                                total: orders$_1[k].reduce(function (x, y) {
                                    return x + y.count;
                                }, 0)
                            });
                        });
                        return [2, ctx.body = {
                                status: 200,
                                data: list,
                            }];
                    case 4:
                        e_3 = _a.sent();
                        return [2, ctx.body = { status: 500 }];
                    case 5: return [2];
                }
            });
        }); });
        app.router('adjust', function (ctx, next) { return __awaiter(_this, void 0, void 0, function () {
            var lastAllocated_1, purchase_1, _a, shoppingId, adjustPrice_1, adjustGroupPrice_1, shopping$, orders$, needBuyTotal, temp, sorredOrders, e_4;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 6, , 7]);
                        lastAllocated_1 = 0;
                        purchase_1 = event.data.purchase;
                        _a = event.data, shoppingId = _a.shoppingId, adjustPrice_1 = _a.adjustPrice, adjustGroupPrice_1 = _a.adjustGroupPrice;
                        return [4, db.collection('shopping-list')
                                .doc(shoppingId)
                                .get()];
                    case 1:
                        shopping$ = _b.sent();
                        return [4, Promise.all(shopping$.data.oids.map(function (oid) {
                                return db.collection('order')
                                    .doc(oid)
                                    .get();
                            }))];
                    case 2:
                        orders$ = _b.sent();
                        needBuyTotal = orders$.reduce(function (x, y) {
                            return x + y.data.count;
                        }, 0);
                        temp = Object.assign({}, shopping$.data, {
                            purchase: purchase_1,
                            adjustPrice: adjustPrice_1,
                            adjustGroupPrice: adjustGroupPrice_1,
                            base_status: '1',
                            buy_status: purchase_1 < needBuyTotal ? '2' : '1',
                            updateTime: new Date().getTime()
                        });
                        delete temp['_id'];
                        return [4, db.collection('shopping-list')
                                .doc(shoppingId)
                                .set({
                                data: temp
                            })];
                    case 3:
                        _b.sent();
                        sorredOrders = orders$
                            .map(function (x) { return x.data; })
                            .filter(function (x) { return x.base_status !== '3' && x.base_status !== '5'; })
                            .sort(function (x, y) { return x.createTime - y.createTime; });
                        return [4, Promise.all(sorredOrders.map(function (order) { return __awaiter(_this, void 0, void 0, function () {
                                var baseTemp, temp;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            baseTemp = {
                                                allocatedPrice: adjustPrice_1,
                                                allocatedGroupPrice: adjustGroupPrice_1,
                                                base_status: purchase_1 - order.count >= 0 ? '1' : '0',
                                                allocatedCount: purchase_1 - order.count >= 0 ? order.count : 0
                                            };
                                            purchase_1 = purchase_1 - order.count;
                                            if (purchase_1 >= 0) {
                                                lastAllocated_1 = purchase_1;
                                            }
                                            temp = Object.assign({}, order, baseTemp);
                                            delete temp['_id'];
                                            return [4, db.collection('order')
                                                    .doc(order._id)
                                                    .set({
                                                    data: temp
                                                })];
                                        case 1:
                                            _a.sent();
                                            return [2];
                                    }
                                });
                            }); }))];
                    case 4:
                        _b.sent();
                        return [4, db.collection('shopping-list')
                                .doc(shoppingId)
                                .update({
                                data: { lastAllocated: lastAllocated_1 }
                            })];
                    case 5:
                        _b.sent();
                        return [2, ctx.body = {
                                status: 200
                            }];
                    case 6:
                        e_4 = _b.sent();
                        return [2, ctx.body = { status: 500 }];
                    case 7: return [2];
                }
            });
        }); });
        app.router('adjust-status', function (ctx, next) { return __awaiter(_this, void 0, void 0, function () {
            var tid, count, e_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        tid = event.data.tid;
                        return [4, db.collection('shopping-list')
                                .where({
                                tid: tid,
                                base_status: '0'
                            })
                                .count()];
                    case 1:
                        count = _a.sent();
                        return [2, ctx.body = {
                                status: 200,
                                data: count.total
                            }];
                    case 2:
                        e_5 = _a.sent();
                        return [2, ctx.body = { status: 500 }];
                    case 3: return [2];
                }
            });
        }); });
        return [2, app.serve()];
    });
}); };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSxpQkF1aEJDOztBQXZoQkQscUNBQXVDO0FBQ3ZDLHNDQUF3QztBQUN4QywrQkFBK0I7QUFFL0IsS0FBSyxDQUFDLElBQUksRUFBRyxDQUFDO0FBRWQsSUFBTSxFQUFFLEdBQWdCLEtBQUssQ0FBQyxRQUFRLEVBQUcsQ0FBQztBQUMxQyxJQUFNLENBQUMsR0FBRyxFQUFFLENBQUMsT0FBTyxDQUFDO0FBbUJSLFFBQUEsSUFBSSxHQUFHLFVBQVEsS0FBSyxFQUFFLE9BQU87Ozs7UUFFaEMsR0FBRyxHQUFHLElBQUksU0FBUyxDQUFDLEVBQUUsS0FBSyxPQUFBLEVBQUUsQ0FBQyxDQUFDO1FBK0RyQyxHQUFHLENBQUMsTUFBTSxDQUFDLGVBQWUsRUFBRSxVQUFPLEdBQUcsRUFBRSxJQUFJOzs7Ozs7d0JBRzlCLEtBQWdCLEtBQUssQ0FBQyxJQUFJLEVBQXhCLEdBQUcsU0FBQSxFQUFFLElBQUksVUFBQSxDQUFnQjt3QkFDM0IsTUFBTSxHQUFHLEtBQUssQ0FBQyxJQUFJLENBQUMsTUFBTSxJQUFJLEtBQUssQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDO3dCQUduQyxXQUFNLE9BQU8sQ0FBQyxHQUFHLENBQUUsS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFFLFVBQUEsQ0FBQztnQ0FDNUQsT0FBTyxZQUFLLENBQUM7b0NBQ1QsR0FBRyxFQUFFLENBQUMsQ0FBQyxHQUFHO29DQUNWLEdBQUcsRUFBRSxDQUFDLENBQUMsR0FBRztvQ0FDVixHQUFHLEVBQUUsQ0FBQyxDQUFDLEdBQUc7b0NBQ1YsTUFBTSxFQUFFLEdBQUc7aUNBQ2QsRUFBRSxFQUFFLEVBQUUsR0FBRyxDQUFFLENBQUE7NEJBQ2hCLENBQUMsQ0FBQyxDQUFDLEVBQUE7O3dCQVBHLFNB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QUMsVUFBVSxDQUFDLGVBQWUsQ0FBQztpQ0FDN0MsS0FBSyxDQUFDO2dDQUNILEdBQUcsS0FBQTtnQ0FDSCxXQUFXLEVBQUUsR0FBRzs2QkFDbkIsQ0FBQztpQ0FDRCxLQUFLLEVBQUcsRUFBQTs7d0JBTFAsS0FBSyxHQUFHLFNBS0Q7d0JBRWIsV0FBTyxHQUFHLENBQUMsSUFBSSxHQUFHO2dDQUNkLE1BQU0sRUFBRSxHQUFHO2dDQUNYLElBQUksRUFBRSxLQUFLLENBQUMsS0FBSzs2QkFDcEIsRUFBQTs7O3dCQUdFLFdBQU8sR0FBRyxDQUFDLElBQUksR0FBRyxFQUFFLE1BQU0sRUFBRSxHQUFHLEVBQUUsRUFBQzs7OzthQUV6QyxDQUFDLENBQUE7UUFFRCxXQUFPLEdBQUcsQ0FBQyxLQUFLLEVBQUcsRUFBQzs7S0FFdkIsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIGNsb3VkIGZyb20gJ3d4LXNlcnZlci1zZGsnO1xuaW1wb3J0ICogYXMgVGNiUm91dGVyIGZyb20gJ3RjYi1yb3V0ZXInO1xuaW1wb3J0IHsgZmluZCQgfSBmcm9tICcuL2ZpbmQnO1xuXG5jbG91ZC5pbml0KCApO1xuXG5jb25zdCBkYjogREIuRGF0YWJhc2UgPSBjbG91ZC5kYXRhYmFzZSggKTtcbmNvbnN0IF8gPSBkYi5jb21tYW5kO1xuXG4vKipcbiAqIEBkZXNjcmlwdGlvbiDooYznqIvmuIXljZXmqKHlnZdcbiAqIC0tLS0tLS0tLSDlrZfmrrUgLS0tLS0tLS0tLVxuICogdGlkXG4gKiBwaWRcbiAqICEgc2lkICgg5Y+v5Li656m6IClcbiAqIG9pZHMgQXJyYXlcbiAqISBwdXJjaGFzZSDph4fotK3mlbDph49cbiAqIGJ1eV9zdGF0dXMgMCwxLDIg5pyq6LSt5Lmw44CB5bey6LSt5Lmw44CB5Lmw5LiN5YWoXG4gKiBiYXNlX3N0YXR1czogMCwxIOacquiwg+aVtO+8jOW3suiwg+aVtFxuICogY3JlYXRlVGltZVxuICogdXBkYXRlVGltZVxuICogbGFzdEFsbG9jYXRlZCDliankvZnliIbphY3ph49cbiAqIGFkanVzdFByaWNlIOWIhumFjeeahOaVsOa4heWNleWUruS7t1xuICogYWRqdXN0R3JvdXBQcmljZSDliIbphY3nmoTmlbDmuIXljZXlm6LotK3ku7dcbiAqIGFsbG9jYXRlZENvdW50IOWIhumFjeeahOaVsOmHj1xuICovXG5leHBvcnQgY29uc3QgbWFpbiA9IGFzeW5jICggZXZlbnQsIGNvbnRleHQgKSA9PiB7XG5cbiAgICBjb25zdCBhcHAgPSBuZXcgVGNiUm91dGVyKHsgZXZlbnQgfSk7XG5cbiAgICAvKipcbiAgICAgKiBAZGVzY3JpcHRpb25cbiAgICAgKiDliKTmlq3or7fmsYLnmoRzaWQgKyB0aWQgKyBwaWQgKyBjb3VudOaVsOe7hO+8jOi/lOWbnuS4jeiDvei0reS5sOeahOWVhuWTgeWIl+ihqO+8iOa4heWNlemHjOmdouS5sOS4jeWIsOOAgeS5sOS4jeWFqO+8ieOAgei0p+WFqOS4jei2s+eahOWVhuWTge+8iOi/lOWbnuacgOaWsOi0p+WtmO+8iVxuICAgICAqIC0tLS0tLS0tIOivt+axgiAtLS0tLS0tLS0tXG4gICAgICoge1xuICAgICAqISAgICBmcm9tPzogJ2NhcnQnIHwgJ2J1eScgfCAnY3VzdG9tJyB8ICdhZ2VudHMnIHwgJ3N5c3RlbSdcbiAgICAgKiAgICAgdGlkOiBzdHJpbmdcbiAgICAgKiEgICAgb3BlbmlkPzogc3RyaW5nLFxuICAgICAqICAgIGxpc3Q6IHsgXG4gICAgICogICAgICB0aWRcbiAgICAgKiEgICAgIGNpZD86IHN0cmluZ1xuICAgICAgICAgICAgc2lkXG4gICAgICAgICAgICBwaWRcbiAgICAgICAgICAgIHByaWNlXG4gICAgICAgICAgICBncm91cFByaWNlXG4gICAgICAgICAgICBjb3VudFxuICAgICAqISAgICAgZGVzYz86IHN0cmluZ1xuICAgICAgICAgICAgbmFtZSxcbiAgICAgICAgICAgIHN0YW5kZXJuYW1lXG4gICAgICAgICAgICBpbWdcbiAgICAgICAgICAgIHR5cGVcbiAgICAgICAgICAgIGFkZHJlc3M6IHtcbiAgICAgICAgICAgICAgIG5hbWUsXG4gICAgICAgICAgICAgICBwaG9uZSxcbiAgICAgICAgICAgICAgIGRldGFpbCxcbiAgICAgICAgICAgICAgIHBvc3RhbGNvZGVcbiAgICAgICAgICAgIH1cbiAgICAgKiAgICAgfVsgXVxuICAgICAqIH1cbiAgICAgKiAtLS0tLS0tLSDov5Tlm54gLS0tLS0tLS0tLVxuICAgICAqIHtcbiAgICAgKiAgICAgICog5bey6LSt5LmwKCDpo47pmanljZUgKVxuICAgICAqICAgICAgaGFzQmVlbkJ1eToge1xuICAgICAqICAgICAgICAgIHRpZCwgXG4gICAgICogICAgICAgICAgcGlkLFxuICAgICAqICAgICAgICAgIHNpZFxuICAgICAqICAgICAgfVsgXVxuICAgICAqICAgICAgKiDkubDkuI3liLBcbiAgICAgKiAgICAgIGNhbm5vdEJ1eTogeyBcbiAgICAgKiAgICAgICAgICB0aWQsIFxuICAgICAqICAgICAgICAgIHBpZCxcbiAgICAgKiAgICAgICAgICBzaWRcbiAgICAgKiAgICAgIH1bIF1cbiAgICAgKiAgICAgICog6LSn5a2Y5LiN6LazXG4gICAgICogICAgICAgbG93U3RvY2s6IHsgXG4gICAgICogICAgICAgICAgdGlkLCBcbiAgICAgKiAgICAgICAgICBwaWQsXG4gICAgICogICAgICAgICAgc2lkLFxuICAgICAqICAgICAgICAgIGNvdW50LFxuICAgICAqICAgICAgICAgIHN0b2NrXG4gICAgICogICAgICB9WyBdXG4gICAgICogICAgICAqIOWei+WPt+W3suiiq+WIoOmZpCAvIOWVhuWTgeW3suS4i+aetlxuICAgICAqICAgICAgaGFzQmVlbkRlbGV0ZToge1xuICAgICAqICAgICAgICAgIHRpZCwgXG4gICAgICogICAgICAgICAgcGlkLFxuICAgICAqICAgICAgICAgIHNpZFxuICAgICAqICAgICAgfVsgXSxcbiAgICAgKiAgICAgICog6K6i5Y2V5Y+35YiX6KGoXG4gICAgICogICAgICBvcmRlcnNcbiAgICAgKiB9XG4gICAgICovXG4gICAgYXBwLnJvdXRlcignZmluZENhbm5vdEJ1eScsIGFzeW5jKCBjdHgsIG5leHQgKSA9PiB7XG4gICAgICAgIHRyeSB7XG5cbiAgICAgICAgICAgIGNvbnN0IHsgdGlkLCBsaXN0IH0gPSBldmVudC5kYXRhO1xuICAgICAgICAgICAgY29uc3Qgb3BlbklkID0gZXZlbnQuZGF0YS5vcGVuSWQgfHwgZXZlbnQudXNlckluZm8ub3BlbklkO1xuXG4gICAgICAgICAgICAvLyDkuI3og73otK3kubDnmoTllYblk4HliJfooajvvIjmuIXljZXph4zpnaLkubDkuI3lhajvvIlcbiAgICAgICAgICAgIGNvbnN0IGZpbmRpbmdzJDogYW55ID0gYXdhaXQgUHJvbWlzZS5hbGwoIGV2ZW50LmRhdGEubGlzdC5tYXAoIGkgPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiBmaW5kJCh7XG4gICAgICAgICAgICAgICAgICAgIHRpZDogaS50aWQsXG4gICAgICAgICAgICAgICAgICAgIHBpZDogaS5waWQsXG4gICAgICAgICAgICAgICAgICAgIHNpZDogaS5zaWQsXG4gICAgICAgICAgICAgICAgICAgIHN0YXR1czogJzInXG4gICAgICAgICAgICAgICAgfSwgZGIsIGN0eCApXG4gICAgICAgICAgICB9KSlcblxuICAgICAgICAgICAgaWYgKCBmaW5kaW5ncyQuc29tZSggeCA9PiB4LnN0YXR1cyAhPT0gMjAwICkpIHtcbiAgICAgICAgICAgICAgICB0aHJvdyAn5p+l6K+i6LSt54mp5riF5Y2V6ZSZ6K+vJztcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8g5bey5a6M5oiQ6LSt5Lmw55qE5ZWG5ZOB5YiX6KGoXG4gICAgICAgICAgICBjb25zdCBoYXNCZWVuQnV5JDogYW55ID0gYXdhaXQgUHJvbWlzZS5hbGwoIGV2ZW50LmRhdGEubGlzdC5tYXAoIGkgPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiBmaW5kJCh7XG4gICAgICAgICAgICAgICAgICAgIHRpZDogaS50aWQsXG4gICAgICAgICAgICAgICAgICAgIHBpZDogaS5waWQsXG4gICAgICAgICAgICAgICAgICAgIHNpZDogaS5zaWQsXG4gICAgICAgICAgICAgICAgICAgIHN0YXR1czogJzEnXG4gICAgICAgICAgICAgICAgfSwgZGIsIGN0eCApXG4gICAgICAgICAgICB9KSk7XG5cbiAgICAgICAgICAgIC8vIOafpeivouWVhuWTgeivpuaDheOAgeaIluiAheWei+WPt+ivpuaDhVxuICAgICAgICAgICAgY29uc3QgZ29vZERldGFpbHMkOiBhbnkgPSBhd2FpdCBQcm9taXNlLmFsbCggZXZlbnQuZGF0YS5saXN0Lm1hcCggaSA9PiB7XG5cbiAgICAgICAgICAgICAgICBpZiAoICEhaS5zaWQgKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBkYi5jb2xsZWN0aW9uKCdzdGFuZGFyZHMnKVxuICAgICAgICAgICAgICAgICAgICAgICAgLndoZXJlKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBfaWQ6IGkuc2lkXG4gICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAgICAgLmdldCggKVxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBkYi5jb2xsZWN0aW9uKCdnb29kcycpXG4gICAgICAgICAgICAgICAgICAgICAgICAud2hlcmUoe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIF9pZDogaS5waWRcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgICAgICAuZ2V0KCApXG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB9KSk7XG4gICAgICAgICAgIFxuICAgICAgICAgICAgY29uc3QgZ29vZHMgPSBnb29kRGV0YWlscyQubWFwKCB4ID0+IHguZGF0YVsgMCBdKS5maWx0ZXIoIHkgPT4gISF5ICkuZmlsdGVyKCB6ID0+ICF6LnBpZCApO1xuICAgICAgICAgICAgY29uc3Qgc3RhbmRhcmRzID0gZ29vZERldGFpbHMkLm1hcCggeCA9PiB4LmRhdGFbIDAgXSkuZmlsdGVyKCB5ID0+ICEheSApLmZpbHRlciggeiA9PiAhIXoucGlkICk7XG5cbiAgICAgICAgICAgIC8vIOW6k+WtmOS4jei2s1xuICAgICAgICAgICAgbGV0IGxvd1N0b2NrOiBhbnkgPSBbIF07XG5cbiAgICAgICAgICAgIC8vIOiiq+WIoOmZpFxuICAgICAgICAgICAgbGV0IGhhc0JlZW5EZWxldGU6IGFueSA9IFsgXTtcblxuICAgICAgICAgICAgLy8g5Lmw5LiN5YiwXG4gICAgICAgICAgICBjb25zdCBjYW5ub3RCdXkgPSBmaW5kaW5ncyQubWFwKCB4ID0+IHguZGF0YVsgMCBdKS5maWx0ZXIoIHkgPT4gISF5ICk7XG5cbiAgICAgICAgICAgIC8vIOW3sue7j+iiq+i0reS5sOS6hu+8iOmjjumZqeWNle+8iVxuICAgICAgICAgICAgY29uc3QgaGFzQmVlbkJ1eSA9IGhhc0JlZW5CdXkkLm1hcCggeCA9PiB4LmRhdGFbIDAgXSkuZmlsdGVyKCB5ID0+ICEheSApXG5cbiAgICAgICAgICAgIGV2ZW50LmRhdGEubGlzdC5tYXAoIGkgPT4ge1xuICAgICAgICAgICAgICAgIC8vIOWei+WPt1xuICAgICAgICAgICAgICAgIGlmICggISFpLnNpZCApIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3Qgc3RhbmRhcmQgPSBzdGFuZGFyZHMuZmluZCggeCA9PiB4Ll9pZCA9PT0gaS5zaWQgJiYgeC5waWQgPT09IGkucGlkICk7XG4gICAgICAgICAgICAgICAgICAgIGlmICggIXN0YW5kYXJkICkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaGFzQmVlbkRlbGV0ZS5wdXNoKCBpICk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoIHN0YW5kYXJkLnN0b2NrICE9PSB1bmRlZmluZWQgJiYgIHN0YW5kYXJkLnN0b2NrIDwgaS5jb3VudCApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxvd1N0b2NrLnB1c2goIE9iamVjdC5hc3NpZ24oeyB9LCBpLCB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc3RvY2s6IHN0YW5kYXJkLnN0b2NrLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGdvb2ROYW1lOiBpLm5hbWUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc3RhbmRlck5hbWU6IGkuc3RhbmRlcm5hbWVcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIC8vIOS4u+S9k+WVhuWTgVxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGdvb2QgPSBnb29kcy5maW5kKCB4ID0+IHguX2lkID09PSBpLnBpZCApO1xuICAgICAgICAgICAgICAgICAgICBpZiAoICFnb29kIHx8ICggISFnb29kICYmICFnb29kLnZpc2lhYmxlICkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGhhc0JlZW5EZWxldGUucHVzaCggaSApXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoIGdvb2Quc3RvY2sgIT09IHVuZGVmaW5lZCAmJiAgZ29vZC5zdG9jayA8IGkuY291bnQgKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBsb3dTdG9jay5wdXNoKCBPYmplY3QuYXNzaWduKHsgfSwgaSwge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0b2NrOiBnb29kLnN0b2NrLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGdvb2ROYW1lOiBpLm5hbWVcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIGxldCBvcmRlcnMgPSBbIF07XG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIOWmguaenOWPr+S7pei0reS5sFxuICAgICAgICAgICAgICogISDmibnph4/liJvlu7rpooTku5jorqLljZVcbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgaWYgKCBsb3dTdG9jay5sZW5ndGggPT09IDAgJiYgY2Fubm90QnV5Lmxlbmd0aCA9PT0gMCAmJiBoYXNCZWVuRGVsZXRlLmxlbmd0aCA9PT0gMCApIHtcblxuICAgICAgICAgICAgICAgIGNvbnN0IHJlcURhdGEgPSB7XG4gICAgICAgICAgICAgICAgICAgIHRpZCxcbiAgICAgICAgICAgICAgICAgICAgb3BlbklkLFxuICAgICAgICAgICAgICAgICAgICBmcm9tOiBldmVudC5kYXRhLmZyb20gfHwgJ3N5c3RlbScsXG4gICAgICAgICAgICAgICAgICAgIG9yZGVyczogZXZlbnQuZGF0YS5saXN0XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgY29uc3QgY3JlYXRlT3JkZXIkID0gYXdhaXQgY2xvdWQuY2FsbEZ1bmN0aW9uKHtcbiAgICAgICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgICAgICAgZGF0YTogcmVxRGF0YSxcbiAgICAgICAgICAgICAgICAgICAgICAgICR1cmw6ICdjcmVhdGUnXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIG5hbWU6ICdvcmRlcidcbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgIGlmICggY3JlYXRlT3JkZXIkLnJlc3VsdC5zdGF0dXMgIT09IDIwMCApIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGN0eC5ib2R5ID0ge1xuICAgICAgICAgICAgICAgICAgICAgICAgc3RhdHVzOiA1MDAsXG4gICAgICAgICAgICAgICAgICAgICAgICBtZXNzYWdlOiAn5Yib5bu66aKE5LuY6K6i5Y2V5aSx6LSl77yBJ1xuICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBvcmRlcnMgPSBjcmVhdGVPcmRlciQucmVzdWx0LmRhdGE7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiBjdHguYm9keSA9IHtcbiAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICAgIGxvd1N0b2NrLFxuICAgICAgICAgICAgICAgICAgICBoYXNCZWVuRGVsZXRlLFxuICAgICAgICAgICAgICAgICAgICBjYW5ub3RCdXksXG4gICAgICAgICAgICAgICAgICAgIGhhc0JlZW5CdXksXG4gICAgICAgICAgICAgICAgICAgIG9yZGVyc1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgc3RhdHVzOiAyMDBcbiAgICAgICAgICAgIH1cblxuICAgICAgICB9IGNhdGNoICggZSApIHtcbiAgICAgXG4gICAgICAgICAgICByZXR1cm4gY3R4LmJvZHkgPSB7XG4gICAgICAgICAgICAgICAgc3RhdHVzOiA1MDAsXG4gICAgICAgICAgICAgICAgbWVzc2FnZTogZVxuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgLyoqXG4gICAgICogQGRlc2NyaXB0aW9uXG4gICAgICog55Sx6K6i5Y2V5Yib5bu66LSt54mp5riF5Y2VXG4gICAgICogbGlzdDoge1xuICAgICAqICAgIHRpZCxcbiAgICAgKiAgICBwaWQsXG4gICAgICogICAgc2lkLFxuICAgICAqICAgIG9pZFxuICAgICAqIH1bIF1cbiAgICAgKi9cbiAgICBhcHAucm91dGVyKCdjcmVhdGUnLCBhc3luYyggY3R4LCBuZXh0ICkgPT4ge1xuICAgICAgICB0cnkge1xuXG4gICAgICAgICAgICBjb25zdCB7IGxpc3QgfSA9IGV2ZW50LmRhdGE7XG5cbiAgICAgICAgICAgIGF3YWl0IFByb21pc2UuYWxsKCBsaXN0Lm1hcCggYXN5bmMgb3JkZXJNZXRhID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCB7IHRpZCwgcGlkLCBzaWQsIG9pZCwgcHJpY2UsIGdyb3VwUHJpY2UgfSA9IG9yZGVyTWV0YTtcbiAgICAgICAgICAgICAgICBsZXQgcXVlcnkgPSB7XG4gICAgICAgICAgICAgICAgICAgIHRpZCxcbiAgICAgICAgICAgICAgICAgICAgcGlkXG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICBpZiAoICEhc2lkICkge1xuICAgICAgICAgICAgICAgICAgICBxdWVyeVsnc2lkJ10gPSBzaWQ7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgY29uc3QgZmluZCQgPSBhd2FpdCBkYi5jb2xsZWN0aW9uKCdzaG9wcGluZy1saXN0JylcbiAgICAgICAgICAgICAgICAgICAgLndoZXJlKCBxdWVyeSApXG4gICAgICAgICAgICAgICAgICAgIC5nZXQoICk7XG5cbiAgICAgICAgICAgICAgICBpZiAoIGZpbmQkLmRhdGEubGVuZ3RoID09PSAwICkge1xuXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IG1ldGEgPSBPYmplY3QuYXNzaWduKHsgfSwgcXVlcnksIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG9pZHM6IFsgb2lkIF0sXG4gICAgICAgICAgICAgICAgICAgICAgICBwdXJjaGFzZTogMCxcbiAgICAgICAgICAgICAgICAgICAgICAgIGJ1eV9zdGF0dXM6ICcwJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGJhc2Vfc3RhdHVzOiAnMCcsXG4gICAgICAgICAgICAgICAgICAgICAgICBhZGp1c3RQcmljZTogcHJpY2UsXG4gICAgICAgICAgICAgICAgICAgICAgICBhZGp1c3RHcm91cFByaWNlOiBncm91cFByaWNlLFxuICAgICAgICAgICAgICAgICAgICAgICAgY3JlYXRlVGltZTogbmV3IERhdGUoICkuZ2V0VGltZSggKVxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGNyZWFldCQgPSBhd2FpdCBkYi5jb2xsZWN0aW9uKCdzaG9wcGluZy1saXN0JylcbiAgICAgICAgICAgICAgICAgICAgICAgIC5hZGQoe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGE6IG1ldGFcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcblxuICAgICAgICAgICAgICAgIC8vIOabtOaWsOaPkuWFpVxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGxldCBtZXRhU2hvcHBpbmdMaXN0ID0gZmluZCQuZGF0YVsgMCBdO1xuICAgICAgICAgICAgICAgICAgICBpZiAoICFtZXRhU2hvcHBpbmdMaXN0Lm9pZHMuZmluZCggeCA9PiB4ID09PSBvaWQgKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgbGFzdE9pZHMgPSBtZXRhU2hvcHBpbmdMaXN0Lm9pZHM7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIOaPkuWFpeWIsOWktOmDqO+8jOacgOaWsOeahOW3suaUr+S7mOiuouWNleWwseWcqOS4iumdolxuICAgICAgICAgICAgICAgICAgICAgICAgbGFzdE9pZHMudW5zaGlmdCggb2lkICk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIG1ldGFTaG9wcGluZ0xpc3QgPSBPYmplY3QuYXNzaWduKHsgfSwgbWV0YVNob3BwaW5nTGlzdCwge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9pZHM6IGxhc3RPaWRzLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHVwZGF0ZVRpbWU6IG5ldyBEYXRlKCApLmdldFRpbWUoIClcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCB1cGRhdGUkID0gYXdhaXQgZGIuY29sbGVjdGlvbignc2hvcHBpbmctbGlzdCcpLmRvYyggU3RyaW5nKCBmaW5kJC5kYXRhWyAwIF0uX2lkICkpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLnVwZGF0ZSh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9pZHM6IGxhc3RPaWRzLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdXBkYXRlVGltZTogbmV3IERhdGUoICkuZ2V0VGltZSggKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB9KSk7XG5cbiAgICAgICAgICAgIHJldHVybiBjdHguYm9keSA9IHtcbiAgICAgICAgICAgICAgICBzdGF0dXM6IDIwMFxuICAgICAgICAgICAgfVxuXG4gICAgICAgIH0gY2F0Y2ggKCBlICkgeyByZXR1cm4gY3R4LmJvZHkgPSB7IHN0YXR1czogNTAwIH19XG4gICAgfSk7XG5cbiAgICAvKipcbiAgICAgKiBAZGVzY3JpcHRpb24gXG4gICAgICog6KGM56iL55qE6LSt54mp5riF5Y2V77yM55So5LqO6LCD5pW05ZWG5ZOB5Lu35qC844CB6LSt5Lmw5pWw6YePXG4gICAgICovXG4gICAgYXBwLnJvdXRlcignbGlzdCcsIGFzeW5jKCBjdHgsIG5leHQgKSA9PiB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBjb25zdCB7IHRpZCB9ID0gZXZlbnQuZGF0YTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgLy8g5ou/5Yiw6KGM56iL5LiL5omA5pyJ55qE6LSt54mp5riF5Y2VXG4gICAgICAgICAgICBjb25zdCBsaXN0cyQgPSBhd2FpdCBkYi5jb2xsZWN0aW9uKCdzaG9wcGluZy1saXN0JylcbiAgICAgICAgICAgICAgICAud2hlcmUoe1xuICAgICAgICAgICAgICAgICAgICB0aWRcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIC5nZXQoICk7XG4gICAgICAgICAgIFxuICAgICAgICAgICAgLy8g5p+l6K+i5q+P5p2h5riF5Y2V5bqV5LiL55qE5q+P5Liqb3JkZXLor6bmg4XvvIzov5nph4znmoTmr4/kuKpvcmRlcumDveaYr+W3suS7mOiuoumHkeeahFxuICAgICAgICAgICAgY29uc3Qgb3JkZXJzJDogYW55ID0gYXdhaXQgUHJvbWlzZS5hbGwoIGxpc3RzJC5kYXRhLm1hcCggbGlzdCA9PiB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFByb21pc2UuYWxsKCBsaXN0Lm9pZHMubWFwKCBhc3luYyBvaWQgPT4ge1xuXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IG9yZGVyJCA9IGF3YWl0IGRiLmNvbGxlY3Rpb24oJ29yZGVyJykuZG9jKCBvaWQgKVxuICAgICAgICAgICAgICAgICAgICAgICAgLmdldCggKTtcblxuICAgICAgICAgICAgICAgICAgICBjb25zdCB1c2VyJCA9IGF3YWl0IGRiLmNvbGxlY3Rpb24oJ3VzZXInKVxuICAgICAgICAgICAgICAgICAgICAgICAgLndoZXJlKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvcGVuaWQ6IG9yZGVyJC5kYXRhLm9wZW5pZFxuICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgICAgIC5nZXQoICk7XG5cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIE9iamVjdC5hc3NpZ24oeyB9LCBvcmRlciQuZGF0YSwge1xuICAgICAgICAgICAgICAgICAgICAgICAgdXNlcjogdXNlciQuZGF0YVsgMCBdXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH0pKTtcbiAgICAgICAgICAgIH0pKTtcblxuICAgICAgICAgICAgLy8g5p+l6K+i5q+P5p2h5riF5Y2V5bqV5LiL5q+P5Liq5ZWG5ZOB55qE6K+m5oOFXG4gICAgICAgICAgICBjb25zdCBnb29kcyQ6IGFueSA9IGF3YWl0IFByb21pc2UuYWxsKCBsaXN0cyQuZGF0YS5tYXAoIGFzeW5jIGxpc3QgPT4ge1xuXG4gICAgICAgICAgICAgICAgY29uc3QgeyBwaWQsIHNpZCB9ID0gbGlzdDtcbiAgICAgICAgICAgICAgICBjb25zdCBjb2xsZWN0aW9uTmFtZSA9ICEhc2lkID8gJ3N0YW5kYXJkcycgOiAnZ29vZHMnO1xuXG4gICAgICAgICAgICAgICAgLy8g5Z6L5Y+3XG4gICAgICAgICAgICAgICAgbGV0IHN0YW5kYXIkOiBhbnkgPSBudWxsO1xuXG4gICAgICAgICAgICAgICAgLy8g5ZWG5ZOBXG4gICAgICAgICAgICAgICAgY29uc3QgZ29vZCQgPSBhd2FpdCBkYi5jb2xsZWN0aW9uKCdnb29kcycpXG4gICAgICAgICAgICAgICAgICAgIC5kb2MoIHBpZCApXG4gICAgICAgICAgICAgICAgICAgIC5nZXQoICk7XG5cbiAgICAgICAgICAgICAgICBpZiAoICEhc2lkICkge1xuICAgICAgICAgICAgICAgICAgICBzdGFuZGFyJCA9IGF3YWl0IGRiLmNvbGxlY3Rpb24oJ3N0YW5kYXJkcycpXG4gICAgICAgICAgICAgICAgICAgICAgICAuZG9jKCBzaWQgKVxuICAgICAgICAgICAgICAgICAgICAgICAgLmdldCggKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgICAgICB0aXRsZTogZ29vZCQuZGF0YS50aXRsZSxcbiAgICAgICAgICAgICAgICAgICAgbmFtZTogc3RhbmRhciQgPyBzdGFuZGFyJC5kYXRhLm5hbWUgOiAnJyxcbiAgICAgICAgICAgICAgICAgICAgcHJpY2U6IHN0YW5kYXIkID8gc3RhbmRhciQuZGF0YS5wcmljZSA6IGdvb2QkLmRhdGEucHJpY2UsXG4gICAgICAgICAgICAgICAgICAgIGltZzogc3RhbmRhciQgPyBzdGFuZGFyJC5kYXRhLmltZyA6IGdvb2QkLmRhdGEuaW1nWyAwIF0sXG4gICAgICAgICAgICAgICAgICAgIGdyb3VwUHJpY2U6IHN0YW5kYXIkID8gc3RhbmRhciQuZGF0YS5ncm91cFByaWNlIDogZ29vZCQuZGF0YS5ncm91cFByaWNlLFxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pKTtcblxuICAgICAgICAgICAgY29uc3QgbGlzdCA9IGxpc3RzJC5kYXRhLm1hcCgoIGwsIGsgKSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3QgeyBpbWcsIHByaWNlLCBncm91cFByaWNlLCB0aXRsZSwgbmFtZSB9ID0gZ29vZHMkWyBrIF07XG4gICAgICAgICAgICAgICAgcmV0dXJuIE9iamVjdC5hc3NpZ24oeyB9LCBsLCB7XG4gICAgICAgICAgICAgICAgICAgIGltZyxcbiAgICAgICAgICAgICAgICAgICAgcHJpY2UsXG4gICAgICAgICAgICAgICAgICAgIGdyb3VwUHJpY2UsXG4gICAgICAgICAgICAgICAgICAgIGdvb2ROYW1lOiB0aXRsZSxcbiAgICAgICAgICAgICAgICAgICAgc3RhbmRhck5hbWU6IG5hbWUsXG4gICAgICAgICAgICAgICAgICAgIG9yZGVyOiBvcmRlcnMkWyBrIF0sXG4gICAgICAgICAgICAgICAgICAgIHRvdGFsOiBvcmRlcnMkWyBrIF0ucmVkdWNlKCggeCwgeSApID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB4ICsgeS5jb3VudDtcbiAgICAgICAgICAgICAgICAgICAgfSwgMCApXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgcmV0dXJuIGN0eC5ib2R5ID0ge1xuICAgICAgICAgICAgICAgIHN0YXR1czogMjAwLFxuICAgICAgICAgICAgICAgIGRhdGE6IGxpc3QsXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfSBjYXRjaCAoIGUgKSB7IHJldHVybiBjdHguYm9keSA9IHsgc3RhdHVzOiA1MDAgfTt9XG4gICAgfSlcblxuICAgIC8qKlxuICAgICAqIOi0reeJqea4heWNleiwg+aVtFxuICAgICAqIC0tLS0tLS0tIOivt+axglxuICAgICAqIHtcbiAgICAgKiAgICBzaG9wcGluZ0lkLCBhZGp1c3RQcmljZSwgcHVyY2hhc2UsIGFkanVzdEdyb3VwUHJpY2VcbiAgICAgKiB9XG4gICAgICovXG4gICAgYXBwLnJvdXRlcignYWRqdXN0JywgYXN5bmMoIGN0eCwgbmV4dCApID0+IHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgLy8g5pyA5ZCO5YiG6YWN6YePXG4gICAgICAgICAgICBsZXQgbGFzdEFsbG9jYXRlZCA9IDA7XG5cbiAgICAgICAgICAgIGxldCBwdXJjaGFzZSA9IGV2ZW50LmRhdGEucHVyY2hhc2U7XG4gICAgICAgICAgICBjb25zdCB7IHNob3BwaW5nSWQsIGFkanVzdFByaWNlLCBhZGp1c3RHcm91cFByaWNlIH0gPSBldmVudC5kYXRhO1xuXG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIOa4heWNle+8jOWFiOaLv+WIsOiuouWNlemHh+i0reaAu+aVsFxuICAgICAgICAgICAgICog6ZqP5ZCO5pu05paw77ya6YeH6LSt6YeP44CB5riF5Y2V5ZSu5Lu344CB5riF5Y2V5Zui6LSt5Lu344CBYmFzZV9zdGF0dXPjgIFidXlfc3RhdHVzXG4gICAgICAgICAgICAgKi9cblxuICAgICAgICAgICAgY29uc3Qgc2hvcHBpbmckID0gYXdhaXQgZGIuY29sbGVjdGlvbignc2hvcHBpbmctbGlzdCcpXG4gICAgICAgICAgICAgICAgLmRvYyggc2hvcHBpbmdJZCApXG4gICAgICAgICAgICAgICAgLmdldCggKTtcbiAgIFxuICAgICAgICAgICAgY29uc3Qgb3JkZXJzJCA9IGF3YWl0IFByb21pc2UuYWxsKCBzaG9wcGluZyQuZGF0YS5vaWRzLm1hcCggb2lkID0+IHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZGIuY29sbGVjdGlvbignb3JkZXInKVxuICAgICAgICAgICAgICAgICAgICAuZG9jKCBvaWQgKVxuICAgICAgICAgICAgICAgICAgICAuZ2V0KCApO1xuICAgICAgICAgICAgfSkpO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICBsZXQgbmVlZEJ1eVRvdGFsID0gb3JkZXJzJC5yZWR1Y2UoKCB4LCB5ICkgPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiB4ICsgKHkgYXMgYW55KS5kYXRhLmNvdW50O1xuICAgICAgICAgICAgfSwgMCApO1xuXG4gICAgICAgICAgICBjb25zdCB0ZW1wID0gT2JqZWN0LmFzc2lnbih7IH0sIHNob3BwaW5nJC5kYXRhLCB7XG4gICAgICAgICAgICAgICAgcHVyY2hhc2UsXG4gICAgICAgICAgICAgICAgYWRqdXN0UHJpY2UsXG4gICAgICAgICAgICAgICAgYWRqdXN0R3JvdXBQcmljZSxcbiAgICAgICAgICAgICAgICBiYXNlX3N0YXR1czogJzEnLFxuICAgICAgICAgICAgICAgIGJ1eV9zdGF0dXM6IHB1cmNoYXNlIDwgbmVlZEJ1eVRvdGFsID8gJzInIDogJzEnLFxuICAgICAgICAgICAgICAgIHVwZGF0ZVRpbWU6IG5ldyBEYXRlKCApLmdldFRpbWUoIClcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBkZWxldGUgdGVtcFsnX2lkJ107XG5cbiAgICAgICAgICAgIGF3YWl0IGRiLmNvbGxlY3Rpb24oJ3Nob3BwaW5nLWxpc3QnKVxuICAgICAgICAgICAgICAgIC5kb2MoIHNob3BwaW5nSWQgKVxuICAgICAgICAgICAgICAgIC5zZXQoe1xuICAgICAgICAgICAgICAgICAgICBkYXRhOiB0ZW1wXG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogIeS7peS4i+iuouWNlemDveaYr+W3suS7mOiuoumHkeeahFxuICAgICAgICAgICAgICog6K6i5Y2V77ya5om56YeP5a+56K6i5Y2V55qE5Lu35qC844CB5Zui6LSt5Lu344CB6LSt5Lmw54q25oCB6L+b6KGM6LCD5pW0KOW3sui0reS5sC/ov5vooYzkuK0pXG4gICAgICAgICAgICAgKiDlhbblrp7lupTor6XkuZ/opoHoh6rliqjms6jlhaXorqLljZXmlbDph4/vvIjnrZbnlaXlhYjliLDlhYjlvpfvvIzvvIlcbiAgICAgICAgICAgICAqICHlpoLmnpzlt7Lnu4/liIbphY3ov4fkuobvvIzliJnkuI3lho3liIbphY3ph4fotK3ph49cbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgY29uc3Qgc29ycmVkT3JkZXJzID0gb3JkZXJzJFxuICAgICAgICAgICAgICAgIC5tYXAoKCB4OiBhbnkgKSA9PiB4LmRhdGEgKVxuICAgICAgICAgICAgICAgIC5maWx0ZXIoKCB4OiBhbnkgKSA9PiB4LmJhc2Vfc3RhdHVzICE9PSAnMycgJiYgeC5iYXNlX3N0YXR1cyAhPT0gJzUnIClcbiAgICAgICAgICAgICAgICAuc29ydCgoIHg6IGFueSwgeTogYW55ICkgPT4geC5jcmVhdGVUaW1lIC0geS5jcmVhdGVUaW1lICk7XG5cbiAgICAgICAgICAgIGF3YWl0IFByb21pc2UuYWxsKCBzb3JyZWRPcmRlcnMubWFwKCBhc3luYyBvcmRlciA9PiB7XG5cbiAgICAgICAgICAgICAgICBjb25zdCBiYXNlVGVtcCA9IHtcbiAgICAgICAgICAgICAgICAgICAgYWxsb2NhdGVkUHJpY2U6IGFkanVzdFByaWNlLFxuICAgICAgICAgICAgICAgICAgICBhbGxvY2F0ZWRHcm91cFByaWNlOiBhZGp1c3RHcm91cFByaWNlLFxuICAgICAgICAgICAgICAgICAgICBiYXNlX3N0YXR1czogcHVyY2hhc2UgLSBvcmRlci5jb3VudCA+PSAwID8gJzEnIDogJzAnLFxuICAgICAgICAgICAgICAgICAgICBhbGxvY2F0ZWRDb3VudDogcHVyY2hhc2UgLSBvcmRlci5jb3VudCA+PSAwID8gb3JkZXIuY291bnQgOiAwXG4gICAgICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgICAgIHB1cmNoYXNlID0gcHVyY2hhc2UgLSBvcmRlci5jb3VudDtcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICBpZiAoIHB1cmNoYXNlID49IDAgKSB7XG4gICAgICAgICAgICAgICAgICAgIGxhc3RBbGxvY2F0ZWQgPSBwdXJjaGFzZTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBjb25zdCB0ZW1wID0gT2JqZWN0LmFzc2lnbih7IH0sIG9yZGVyLCBiYXNlVGVtcCApO1xuXG4gICAgICAgICAgICAgICAgZGVsZXRlIHRlbXBbJ19pZCddO1xuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIGF3YWl0IGRiLmNvbGxlY3Rpb24oJ29yZGVyJylcbiAgICAgICAgICAgICAgICAgICAgLmRvYyggb3JkZXIuX2lkIClcbiAgICAgICAgICAgICAgICAgICAgLnNldCh7XG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRhOiB0ZW1wXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIHJldHVybjtcblxuICAgICAgICAgICAgfSkpO1xuXG4gICAgICAgICAgICAvLyDmm7TmlrDmuIXljZXnmoTliankvZnliIbphY3mlbBcbiAgICAgICAgICAgIGF3YWl0IGRiLmNvbGxlY3Rpb24oJ3Nob3BwaW5nLWxpc3QnKVxuICAgICAgICAgICAgICAgIC5kb2MoIHNob3BwaW5nSWQgKVxuICAgICAgICAgICAgICAgIC51cGRhdGUoe1xuICAgICAgICAgICAgICAgICAgICBkYXRhOiB7IGxhc3RBbGxvY2F0ZWQgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICBcbiAgICAgICAgICAgIHJldHVybiBjdHguYm9keSA9IHtcbiAgICAgICAgICAgICAgICBzdGF0dXM6IDIwMFxuICAgICAgICAgICAgfVxuXG4gICAgICAgIH0gY2F0Y2ggKCBlICkgeyByZXR1cm4gY3R4LmJvZHkgPSB7IHN0YXR1czogNTAwIH07fVxuICAgIH0pXG5cbiAgICAvKipcbiAgICAgKiBAZGVzY3JpcHRpb25cbiAgICAgKiDojrflj5booYznqIvph4zmmK/lkKbov5jmnInmnKrosIPmlbTnmoTmuIXljZVcbiAgICAqL1xuICAgYXBwLnJvdXRlcignYWRqdXN0LXN0YXR1cycsIGFzeW5jKCBjdHgsIG5leHQgKSA9PiB7XG4gICAgICAgdHJ5IHtcbiAgICAgICAgY29uc3QgeyB0aWQgfSA9IGV2ZW50LmRhdGE7XG4gICAgICAgIGNvbnN0IGNvdW50ID0gYXdhaXQgZGIuY29sbGVjdGlvbignc2hvcHBpbmctbGlzdCcpXG4gICAgICAgICAgICAud2hlcmUoe1xuICAgICAgICAgICAgICAgIHRpZCxcbiAgICAgICAgICAgICAgICBiYXNlX3N0YXR1czogJzAnXG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLmNvdW50KCApO1xuXG4gICAgICAgIHJldHVybiBjdHguYm9keSA9IHtcbiAgICAgICAgICAgIHN0YXR1czogMjAwLFxuICAgICAgICAgICAgZGF0YTogY291bnQudG90YWxcbiAgICAgICAgfVxuXG4gICAgICAgfSBjYXRjaCAoIGUgKSB7XG4gICAgICAgICAgIHJldHVybiBjdHguYm9keSA9IHsgc3RhdHVzOiA1MDAgfTtcbiAgICAgICB9XG4gICB9KVxuXG4gICAgcmV0dXJuIGFwcC5zZXJ2ZSggKTtcblxufSJdfQ==