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
            var _a, list, openId_1, e_2;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        _a = event.data, list = _a.list, openId_1 = _a.openId;
                        return [4, Promise.all(list.map(function (orderMeta) { return __awaiter(_this, void 0, void 0, function () {
                                var tid, pid, sid, oid, price, groupPrice, query, find$, meta, creaet$, metaShoppingList, lastOids, lastUids, update$;
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
                                                uids: [openId_1],
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
                                            lastUids = metaShoppingList.uids;
                                            lastOids.unshift(oid);
                                            if (!lastUids.find(function (x) { return x === openId_1; })) {
                                                lastUids.unshift(openId_1);
                                            }
                                            return [4, db.collection('shopping-list').doc(String(find$.data[0]._id))
                                                    .update({
                                                    data: {
                                                        oids: lastOids,
                                                        uids: lastUids,
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
                        _b.sent();
                        return [2, ctx.body = {
                                status: 200
                            }];
                    case 2:
                        e_2 = _b.sent();
                        return [2, ctx.body = { status: 500 }];
                    case 3: return [2];
                }
            });
        }); });
        app.router('list', function (ctx, next) { return __awaiter(_this, void 0, void 0, function () {
            var orders$_1, _a, tid, needOrders_1, lists$, goods$_1, list, e_3;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 5, , 6]);
                        orders$_1 = [];
                        _a = event.data, tid = _a.tid, needOrders_1 = _a.needOrders;
                        return [4, db.collection('shopping-list')
                                .where({
                                tid: tid
                            })
                                .get()];
                    case 1:
                        lists$ = _b.sent();
                        if (!(needOrders_1 !== false)) return [3, 3];
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
                        orders$_1 = _b.sent();
                        _b.label = 3;
                    case 3: return [4, Promise.all(lists$.data.map(function (list) { return __awaiter(_this, void 0, void 0, function () {
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
                                            tag: good$.data.tag,
                                            title: good$.data.title,
                                            name: standar$ ? standar$.data.name : '',
                                            price: standar$ ? standar$.data.price : good$.data.price,
                                            img: standar$ ? standar$.data.img : good$.data.img[0],
                                            groupPrice: standar$ ? standar$.data.groupPrice : good$.data.groupPrice,
                                        }];
                                }
                            });
                        }); }))];
                    case 4:
                        goods$_1 = _b.sent();
                        list = lists$.data.map(function (l, k) {
                            var _a = goods$_1[k], img = _a.img, price = _a.price, groupPrice = _a.groupPrice, title = _a.title, name = _a.name, tag = _a.tag;
                            var meta = Object.assign({}, l, {
                                tag: tag,
                                img: img,
                                price: price,
                                groupPrice: groupPrice,
                                goodName: title,
                                standarName: name
                            });
                            if (needOrders_1 !== false) {
                                meta = Object.assign({}, meta, {
                                    order: orders$_1[k],
                                    total: orders$_1[k].reduce(function (x, y) {
                                        return x + y.count;
                                    }, 0)
                                });
                            }
                            return meta;
                        });
                        return [2, ctx.body = {
                                status: 200,
                                data: list,
                            }];
                    case 5:
                        e_3 = _b.sent();
                        return [2, ctx.body = { status: 500 }];
                    case 6: return [2];
                }
            });
        }); });
        app.router('adjust', function (ctx, next) { return __awaiter(_this, void 0, void 0, function () {
            var _a, shoppingId, adjustPrice_1, adjustGroupPrice_1, shopping$, orders$, lastAllocated_1, purchase_1, finishAdjustOrders, hasBeenAdjust, needBuyTotal, temp, sorredOrders, e_4;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 6, , 7]);
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
                        lastAllocated_1 = 0;
                        purchase_1 = event.data.purchase;
                        finishAdjustOrders = orders$
                            .map(function (x) { return x.data; })
                            .filter(function (o) { return o.base_status === '2'; });
                        hasBeenAdjust = finishAdjustOrders.reduce(function (x, y) {
                            return x + y.allocatedCount;
                        }, 0);
                        if (purchase_1 < hasBeenAdjust) {
                            return [2, ctx.body = {
                                    status: 500,
                                    message: "\u6709" + finishAdjustOrders.length + "\u4E2A\u8BA2\u5355\u5DF2\u786E\u8BA4\uFF0C\u6570\u91CF\u4E0D\u80FD\u5C11\u4E8E" + hasBeenAdjust + "\u4EF6"
                                }];
                        }
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
                            .filter(function (x) { return x.base_status === '0' || x.base_status === '1'; })
                            .sort(function (x, y) { return x.createTime - y.createTime; });
                        purchase_1 -= hasBeenAdjust;
                        return [4, Promise.all(sorredOrders.map(function (order) { return __awaiter(_this, void 0, void 0, function () {
                                var baseTemp, temp;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            baseTemp = {
                                                allocatedPrice: adjustPrice_1,
                                                allocatedGroupPrice: adjustGroupPrice_1,
                                                base_status: '1',
                                                allocatedCount: purchase_1 - order.count >= 0 ?
                                                    order.count :
                                                    purchase_1
                                            };
                                            if (purchase_1 - order.count >= 0) {
                                                lastAllocated_1 = purchase_1 - order.count;
                                                purchase_1 -= order.count;
                                            }
                                            else {
                                                lastAllocated_1 = 0;
                                                purchase_1 = 0;
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
        app.router('pin', function (ctx, next) { return __awaiter(_this, void 0, void 0, function () {
            var type_1, _a, tid, detail, shopping$, data, data$, data_1, e_6;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        type_1 = event.data.type || 'pin';
                        _a = event.data, tid = _a.tid, detail = _a.detail;
                        return [4, db.collection('shopping-list')
                                .where({
                                tid: tid,
                            })
                                .get()];
                    case 1:
                        shopping$ = _b.sent();
                        data = [];
                        data$ = shopping$.data.filter(function (s) {
                            if (type_1 === 'pin') {
                                return !!s.adjustGroupPrice && s.uids.length > 1;
                            }
                            else {
                                return !!s.adjustGroupPrice && s.uids.length === 1;
                            }
                        });
                        data = data$;
                        if (detail === undefined || !!detail) {
                            data_1 = data$.map(function (shopping) {
                                return Object.assign({}, shopping, {
                                    detail: {}
                                });
                            });
                        }
                        return [2, ctx.body = {
                                data: data,
                                status: 200
                            }];
                    case 2:
                        e_6 = _b.sent();
                        return [2, ctx.body = { status: 500 }];
                    case 3: return [2];
                }
            });
        }); });
        return [2, app.serve()];
    });
}); };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSxpQkF1b0JDOztBQXZvQkQscUNBQXVDO0FBQ3ZDLHNDQUF3QztBQUN4QywrQkFBK0I7QUFFL0IsS0FBSyxDQUFDLElBQUksRUFBRyxDQUFDO0FBRWQsSUFBTSxFQUFFLEdBQWdCLEtBQUssQ0FBQyxRQUFRLEVBQUcsQ0FBQztBQUMxQyxJQUFNLENBQUMsR0FBRyxFQUFFLENBQUMsT0FBTyxDQUFDO0FBbUJSLFFBQUEsSUFBSSxHQUFHLFVBQVEsS0FBSyxFQUFFLE9BQU87Ozs7UUFFaEMsR0FBRyxHQUFHLElBQUksU0FBUyxDQUFDLEVBQUUsS0FBSyxPQUFBLEVBQUUsQ0FBQyxDQUFDO1FBK0RyQyxHQUFHLENBQUMsTUFBTSxDQUFDLGVBQWUsRUFBRSxVQUFPLEdBQUcsRUFBRSxJQUFJOzs7Ozs7d0JBRzlCLEtBQWdCLEtBQUssQ0FBQyxJQUFJLEVBQXhCLEdBQUcsU0FBQSxFQUFFLElBQUksVUFBQSxDQUFnQjt3QkFDM0IsTUFBTSxHQUFHLEtBQUssQ0FBQyxJQUFJLENBQUMsTUFBTSxJQUFJLEtBQUssQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDO3dCQUduQyxXQUFNLE9BQU8sQ0FBQyxHQUFHLENBQUUsS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFFLFVBQUEsQ0FBQztnQ0FDNUQsT0FBTyxZQUFLLENBQUM7b0NBQ1QsR0FBRyxFQUFFLENBQUMsQ0FBQyxHQUFHO29DQUNWLEdBQUcsRUFBRSxDQUFDLENBQUMsR0FBRztvQ0FDVixHQUFHLEVBQUUsQ0FBQyxDQUFDLEdBQUc7b0NBQ1YsTUFBTSxFQUFFLEdBQUc7aUNBQ2QsRUFBRSxFQUFFLEVBQUUsR0FBRyxDQUFFLENBQUE7NEJBQ2hCLENBQUMsQ0FBQyxDQUFDLEVBQUE7O3dCQVBHLFNB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QyxDQUFDLElBQUksQ0FBQyxNQUFNLEtBQUssQ0FBQyxDQUFBOzZCQUNyRDt3QkFDTCxDQUFDLENBQUMsQ0FBQzt3QkFFSCxJQUFJLEdBQUcsS0FBSyxDQUFDO3dCQUdiLElBQUssTUFBTSxLQUFLLFNBQVMsSUFBSSxDQUFDLENBQUMsTUFBTSxFQUFHOzRCQUM5QixTQUFPLEtBQUssQ0FBQyxHQUFHLENBQUUsVUFBQSxRQUFRO2dDQUM1QixPQUFPLE1BQU0sQ0FBQyxNQUFNLENBQUMsRUFBRyxFQUFFLFFBQVEsRUFBRTtvQ0FDaEMsTUFBTSxFQUFFLEVBQUc7aUNBQ2QsQ0FBQyxDQUFBOzRCQUNOLENBQUMsQ0FBQyxDQUFDO3lCQUNOO3dCQUVELFdBQU8sR0FBRyxDQUFDLElBQUksR0FBRztnQ0FDZCxJQUFJLE1BQUE7Z0NBQ0osTUFBTSxFQUFFLEdBQUc7NkJBQ2QsRUFBQTs7O3dCQUdELFdBQU8sR0FBRyxDQUFDLElBQUksR0FBRyxFQUFFLE1BQU0sRUFBRSxHQUFHLEVBQUUsRUFBQzs7OzthQUV6QyxDQUFDLENBQUE7UUFFRixXQUFPLEdBQUcsQ0FBQyxLQUFLLEVBQUcsRUFBQzs7S0FFdkIsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIGNsb3VkIGZyb20gJ3d4LXNlcnZlci1zZGsnO1xuaW1wb3J0ICogYXMgVGNiUm91dGVyIGZyb20gJ3RjYi1yb3V0ZXInO1xuaW1wb3J0IHsgZmluZCQgfSBmcm9tICcuL2ZpbmQnO1xuXG5jbG91ZC5pbml0KCApO1xuXG5jb25zdCBkYjogREIuRGF0YWJhc2UgPSBjbG91ZC5kYXRhYmFzZSggKTtcbmNvbnN0IF8gPSBkYi5jb21tYW5kO1xuXG4vKipcbiAqIEBkZXNjcmlwdGlvbiDooYznqIvmuIXljZXmqKHlnZdcbiAqIC0tLS0tLS0tLSDlrZfmrrUgLS0tLS0tLS0tLVxuICogdGlkXG4gKiBwaWRcbiAqICEgc2lkICgg5Y+v5Li656m6IClcbiAqIG9pZHMgQXJyYXlcbiAqIHVpZHMgQXJyYXlcbiAqIGJ1eV9zdGF0dXMgMCwxLDIg5pyq6LSt5Lmw44CB5bey6LSt5Lmw44CB5Lmw5LiN5YWoXG4gKiBiYXNlX3N0YXR1czogMCwxIOacquiwg+aVtO+8jOW3suiwg+aVtFxuICogY3JlYXRlVGltZVxuICogdXBkYXRlVGltZVxuICogbGFzdEFsbG9jYXRlZCDliankvZnliIbphY3ph49cbiAqIHB1cmNoYXNlIOmHh+i0reaVsOmHj1xuICogYWRqdXN0UHJpY2Ug5YiG6YWN55qE5pWw5riF5Y2V5ZSu5Lu3XG4gKiBhZGp1c3RHcm91cFByaWNlIOWIhumFjeeahOaVsOa4heWNleWboui0reS7t1xuICovXG5leHBvcnQgY29uc3QgbWFpbiA9IGFzeW5jICggZXZlbnQsIGNvbnRleHQgKSA9PiB7XG5cbiAgICBjb25zdCBhcHAgPSBuZXcgVGNiUm91dGVyKHsgZXZlbnQgfSk7XG5cbiAgICAvKipcbiAgICAgKiBAZGVzY3JpcHRpb25cbiAgICAgKiDliKTmlq3or7fmsYLnmoRzaWQgKyB0aWQgKyBwaWQgKyBjb3VudOaVsOe7hO+8jOi/lOWbnuS4jeiDvei0reS5sOeahOWVhuWTgeWIl+ihqO+8iOa4heWNlemHjOmdouS5sOS4jeWIsOOAgeS5sOS4jeWFqO+8ieOAgei0p+WFqOS4jei2s+eahOWVhuWTge+8iOi/lOWbnuacgOaWsOi0p+WtmO+8iVxuICAgICAqIC0tLS0tLS0tIOivt+axgiAtLS0tLS0tLS0tXG4gICAgICoge1xuICAgICAqISAgICBmcm9tPzogJ2NhcnQnIHwgJ2J1eScgfCAnY3VzdG9tJyB8ICdhZ2VudHMnIHwgJ3N5c3RlbSdcbiAgICAgKiAgICAgdGlkOiBzdHJpbmdcbiAgICAgKiEgICAgb3BlbmlkPzogc3RyaW5nLFxuICAgICAqICAgIGxpc3Q6IHsgXG4gICAgICogICAgICB0aWRcbiAgICAgKiEgICAgIGNpZD86IHN0cmluZ1xuICAgICAgICAgICAgc2lkXG4gICAgICAgICAgICBwaWRcbiAgICAgICAgICAgIHByaWNlXG4gICAgICAgICAgICBncm91cFByaWNlXG4gICAgICAgICAgICBjb3VudFxuICAgICAqISAgICAgZGVzYz86IHN0cmluZ1xuICAgICAgICAgICAgbmFtZSxcbiAgICAgICAgICAgIHN0YW5kZXJuYW1lXG4gICAgICAgICAgICBpbWdcbiAgICAgICAgICAgIHR5cGVcbiAgICAgICAgICAgIGFkZHJlc3M6IHtcbiAgICAgICAgICAgICAgIG5hbWUsXG4gICAgICAgICAgICAgICBwaG9uZSxcbiAgICAgICAgICAgICAgIGRldGFpbCxcbiAgICAgICAgICAgICAgIHBvc3RhbGNvZGVcbiAgICAgICAgICAgIH1cbiAgICAgKiAgICAgfVsgXVxuICAgICAqIH1cbiAgICAgKiAtLS0tLS0tLSDov5Tlm54gLS0tLS0tLS0tLVxuICAgICAqIHtcbiAgICAgKiAgICAgICog5bey6LSt5LmwKCDpo47pmanljZUgKVxuICAgICAqICAgICAgaGFzQmVlbkJ1eToge1xuICAgICAqICAgICAgICAgIHRpZCwgXG4gICAgICogICAgICAgICAgcGlkLFxuICAgICAqICAgICAgICAgIHNpZFxuICAgICAqICAgICAgfVsgXVxuICAgICAqICAgICAgKiDkubDkuI3liLBcbiAgICAgKiAgICAgIGNhbm5vdEJ1eTogeyBcbiAgICAgKiAgICAgICAgICB0aWQsIFxuICAgICAqICAgICAgICAgIHBpZCxcbiAgICAgKiAgICAgICAgICBzaWRcbiAgICAgKiAgICAgIH1bIF1cbiAgICAgKiAgICAgICog6LSn5a2Y5LiN6LazXG4gICAgICogICAgICAgbG93U3RvY2s6IHsgXG4gICAgICogICAgICAgICAgdGlkLCBcbiAgICAgKiAgICAgICAgICBwaWQsXG4gICAgICogICAgICAgICAgc2lkLFxuICAgICAqICAgICAgICAgIGNvdW50LFxuICAgICAqICAgICAgICAgIHN0b2NrXG4gICAgICogICAgICB9WyBdXG4gICAgICogICAgICAqIOWei+WPt+W3suiiq+WIoOmZpCAvIOWVhuWTgeW3suS4i+aetlxuICAgICAqICAgICAgaGFzQmVlbkRlbGV0ZToge1xuICAgICAqICAgICAgICAgIHRpZCwgXG4gICAgICogICAgICAgICAgcGlkLFxuICAgICAqICAgICAgICAgIHNpZFxuICAgICAqICAgICAgfVsgXSxcbiAgICAgKiAgICAgICog6K6i5Y2V5Y+35YiX6KGoXG4gICAgICogICAgICBvcmRlcnNcbiAgICAgKiB9XG4gICAgICovXG4gICAgYXBwLnJvdXRlcignZmluZENhbm5vdEJ1eScsIGFzeW5jKCBjdHgsIG5leHQgKSA9PiB7XG4gICAgICAgIHRyeSB7XG5cbiAgICAgICAgICAgIGNvbnN0IHsgdGlkLCBsaXN0IH0gPSBldmVudC5kYXRhO1xuICAgICAgICAgICAgY29uc3Qgb3BlbklkID0gZXZlbnQuZGF0YS5vcGVuSWQgfHwgZXZlbnQudXNlckluZm8ub3BlbklkO1xuXG4gICAgICAgICAgICAvLyDkuI3og73otK3kubDnmoTllYblk4HliJfooajvvIjmuIXljZXph4zpnaLkubDkuI3lhajvvIlcbiAgICAgICAgICAgIGNvbnN0IGZpbmRpbmdzJDogYW55ID0gYXdhaXQgUHJvbWlzZS5hbGwoIGV2ZW50LmRhdGEubGlzdC5tYXAoIGkgPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiBmaW5kJCh7XG4gICAgICAgICAgICAgICAgICAgIHRpZDogaS50aWQsXG4gICAgICAgICAgICAgICAgICAgIHBpZDogaS5waWQsXG4gICAgICAgICAgICAgICAgICAgIHNpZDogaS5zaWQsXG4gICAgICAgICAgICAgICAgICAgIHN0YXR1czogJzInXG4gICAgICAgICAgICAgICAgfSwgZGIsIGN0eCApXG4gICAgICAgICAgICB9KSlcblxuICAgICAgICAgICAgaWYgKCBmaW5kaW5ncyQuc29tZSggeCA9PiB4LnN0YXR1cyAhPT0gMjAwICkpIHtcbiAgICAgICAgICAgICAgICB0aHJvdyAn5p+l6K+i6LSt54mp5riF5Y2V6ZSZ6K+vJztcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8g5bey5a6M5oiQ6LSt5Lmw55qE5ZWG5ZOB5YiX6KGoXG4gICAgICAgICAgICBjb25zdCBoYXNCZWVuQnV5JDogYW55ID0gYXdhaXQgUHJvbWlzZS5hbGwoIGV2ZW50LmRhdGEubGlzdC5tYXAoIGkgPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiBmaW5kJCh7XG4gICAgICAgICAgICAgICAgICAgIHRpZDogaS50aWQsXG4gICAgICAgICAgICAgICAgICAgIHBpZDogaS5waWQsXG4gICAgICAgICAgICAgICAgICAgIHNpZDogaS5zaWQsXG4gICAgICAgICAgICAgICAgICAgIHN0YXR1czogJzEnXG4gICAgICAgICAgICAgICAgfSwgZGIsIGN0eCApXG4gICAgICAgICAgICB9KSk7XG5cbiAgICAgICAgICAgIC8vIOafpeivouWVhuWTgeivpuaDheOAgeaIluiAheWei+WPt+ivpuaDhVxuICAgICAgICAgICAgY29uc3QgZ29vZERldGFpbHMkOiBhbnkgPSBhd2FpdCBQcm9taXNlLmFsbCggZXZlbnQuZGF0YS5saXN0Lm1hcCggaSA9PiB7XG5cbiAgICAgICAgICAgICAgICBpZiAoICEhaS5zaWQgKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBkYi5jb2xsZWN0aW9uKCdzdGFuZGFyZHMnKVxuICAgICAgICAgICAgICAgICAgICAgICAgLndoZXJlKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBfaWQ6IGkuc2lkXG4gICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAgICAgLmdldCggKVxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBkYi5jb2xsZWN0aW9uKCdnb29kcycpXG4gICAgICAgICAgICAgICAgICAgICAgICAud2hlcmUoe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIF9pZDogaS5waWRcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgICAgICAuZ2V0KCApXG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB9KSk7XG4gICAgICAgICAgIFxuICAgICAgICAgICAgY29uc3QgZ29vZHMgPSBnb29kRGV0YWlscyQubWFwKCB4ID0+IHguZGF0YVsgMCBdKS5maWx0ZXIoIHkgPT4gISF5ICkuZmlsdGVyKCB6ID0+ICF6LnBpZCApO1xuICAgICAgICAgICAgY29uc3Qgc3RhbmRhcmRzID0gZ29vZERldGFpbHMkLm1hcCggeCA9PiB4LmRhdGFbIDAgXSkuZmlsdGVyKCB5ID0+ICEheSApLmZpbHRlciggeiA9PiAhIXoucGlkICk7XG5cbiAgICAgICAgICAgIC8vIOW6k+WtmOS4jei2s1xuICAgICAgICAgICAgbGV0IGxvd1N0b2NrOiBhbnkgPSBbIF07XG5cbiAgICAgICAgICAgIC8vIOiiq+WIoOmZpFxuICAgICAgICAgICAgbGV0IGhhc0JlZW5EZWxldGU6IGFueSA9IFsgXTtcblxuICAgICAgICAgICAgLy8g5Lmw5LiN5YiwXG4gICAgICAgICAgICBjb25zdCBjYW5ub3RCdXkgPSBmaW5kaW5ncyQubWFwKCB4ID0+IHguZGF0YVsgMCBdKS5maWx0ZXIoIHkgPT4gISF5ICk7XG5cbiAgICAgICAgICAgIC8vIOW3sue7j+iiq+i0reS5sOS6hu+8iOmjjumZqeWNle+8iVxuICAgICAgICAgICAgY29uc3QgaGFzQmVlbkJ1eSA9IGhhc0JlZW5CdXkkLm1hcCggeCA9PiB4LmRhdGFbIDAgXSkuZmlsdGVyKCB5ID0+ICEheSApXG5cbiAgICAgICAgICAgIGV2ZW50LmRhdGEubGlzdC5tYXAoIGkgPT4ge1xuICAgICAgICAgICAgICAgIC8vIOWei+WPt1xuICAgICAgICAgICAgICAgIGlmICggISFpLnNpZCApIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3Qgc3RhbmRhcmQgPSBzdGFuZGFyZHMuZmluZCggeCA9PiB4Ll9pZCA9PT0gaS5zaWQgJiYgeC5waWQgPT09IGkucGlkICk7XG4gICAgICAgICAgICAgICAgICAgIGlmICggIXN0YW5kYXJkICkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaGFzQmVlbkRlbGV0ZS5wdXNoKCBpICk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoIHN0YW5kYXJkLnN0b2NrICE9PSB1bmRlZmluZWQgJiYgIHN0YW5kYXJkLnN0b2NrIDwgaS5jb3VudCApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxvd1N0b2NrLnB1c2goIE9iamVjdC5hc3NpZ24oeyB9LCBpLCB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc3RvY2s6IHN0YW5kYXJkLnN0b2NrLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGdvb2ROYW1lOiBpLm5hbWUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc3RhbmRlck5hbWU6IGkuc3RhbmRlcm5hbWVcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIC8vIOS4u+S9k+WVhuWTgVxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGdvb2QgPSBnb29kcy5maW5kKCB4ID0+IHguX2lkID09PSBpLnBpZCApO1xuICAgICAgICAgICAgICAgICAgICBpZiAoICFnb29kIHx8ICggISFnb29kICYmICFnb29kLnZpc2lhYmxlICkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGhhc0JlZW5EZWxldGUucHVzaCggaSApXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoIGdvb2Quc3RvY2sgIT09IHVuZGVmaW5lZCAmJiAgZ29vZC5zdG9jayA8IGkuY291bnQgKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBsb3dTdG9jay5wdXNoKCBPYmplY3QuYXNzaWduKHsgfSwgaSwge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0b2NrOiBnb29kLnN0b2NrLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGdvb2ROYW1lOiBpLm5hbWVcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIGxldCBvcmRlcnMgPSBbIF07XG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIOWmguaenOWPr+S7pei0reS5sFxuICAgICAgICAgICAgICogISDmibnph4/liJvlu7rpooTku5jorqLljZVcbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgaWYgKCBsb3dTdG9jay5sZW5ndGggPT09IDAgJiYgY2Fubm90QnV5Lmxlbmd0aCA9PT0gMCAmJiBoYXNCZWVuRGVsZXRlLmxlbmd0aCA9PT0gMCApIHtcblxuICAgICAgICAgICAgICAgIGNvbnN0IHJlcURhdGEgPSB7XG4gICAgICAgICAgICAgICAgICAgIHRpZCxcbiAgICAgICAgICAgICAgICAgICAgb3BlbklkLFxuICAgICAgICAgICAgICAgICAgICBmcm9tOiBldmVudC5kYXRhLmZyb20gfHwgJ3N5c3RlbScsXG4gICAgICAgICAgICAgICAgICAgIG9yZGVyczogZXZlbnQuZGF0YS5saXN0XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgY29uc3QgY3JlYXRlT3JkZXIkID0gYXdhaXQgY2xvdWQuY2FsbEZ1bmN0aW9uKHtcbiAgICAgICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgICAgICAgZGF0YTogcmVxRGF0YSxcbiAgICAgICAgICAgICAgICAgICAgICAgICR1cmw6ICdjcmVhdGUnXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIG5hbWU6ICdvcmRlcidcbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgIGlmICggY3JlYXRlT3JkZXIkLnJlc3VsdC5zdGF0dXMgIT09IDIwMCApIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGN0eC5ib2R5ID0ge1xuICAgICAgICAgICAgICAgICAgICAgICAgc3RhdHVzOiA1MDAsXG4gICAgICAgICAgICAgICAgICAgICAgICBtZXNzYWdlOiAn5Yib5bu66aKE5LuY6K6i5Y2V5aSx6LSl77yBJ1xuICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBvcmRlcnMgPSBjcmVhdGVPcmRlciQucmVzdWx0LmRhdGE7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiBjdHguYm9keSA9IHtcbiAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICAgIGxvd1N0b2NrLFxuICAgICAgICAgICAgICAgICAgICBoYXNCZWVuRGVsZXRlLFxuICAgICAgICAgICAgICAgICAgICBjYW5ub3RCdXksXG4gICAgICAgICAgICAgICAgICAgIGhhc0JlZW5CdXksXG4gICAgICAgICAgICAgICAgICAgIG9yZGVyc1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgc3RhdHVzOiAyMDBcbiAgICAgICAgICAgIH1cblxuICAgICAgICB9IGNhdGNoICggZSApIHtcbiAgICAgXG4gICAgICAgICAgICByZXR1cm4gY3R4LmJvZHkgPSB7XG4gICAgICAgICAgICAgICAgc3RhdHVzOiA1MDAsXG4gICAgICAgICAgICAgICAgbWVzc2FnZTogZVxuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgLyoqXG4gICAgICogQGRlc2NyaXB0aW9uXG4gICAgICog55Sx6K6i5Y2V5Yib5bu66LSt54mp5riF5Y2VXG4gICAgICogbGlzdDoge1xuICAgICAqICAgIHRpZCxcbiAgICAgKiAgICBwaWQsXG4gICAgICogICAgc2lkLFxuICAgICAqICAgIG9pZFxuICAgICAqIH1bIF1cbiAgICAgKi9cbiAgICBhcHAucm91dGVyKCdjcmVhdGUnLCBhc3luYyggY3R4LCBuZXh0ICkgPT4ge1xuICAgICAgICB0cnkge1xuXG4gICAgICAgICAgICBjb25zdCB7IGxpc3QsIG9wZW5JZCB9ID0gZXZlbnQuZGF0YTtcblxuICAgICAgICAgICAgYXdhaXQgUHJvbWlzZS5hbGwoIGxpc3QubWFwKCBhc3luYyBvcmRlck1ldGEgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IHsgdGlkLCBwaWQsIHNpZCwgb2lkLCBwcmljZSwgZ3JvdXBQcmljZSB9ID0gb3JkZXJNZXRhO1xuICAgICAgICAgICAgICAgIGxldCBxdWVyeSA9IHtcbiAgICAgICAgICAgICAgICAgICAgdGlkLFxuICAgICAgICAgICAgICAgICAgICBwaWRcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIGlmICggISFzaWQgKSB7XG4gICAgICAgICAgICAgICAgICAgIHF1ZXJ5WydzaWQnXSA9IHNpZDtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBjb25zdCBmaW5kJCA9IGF3YWl0IGRiLmNvbGxlY3Rpb24oJ3Nob3BwaW5nLWxpc3QnKVxuICAgICAgICAgICAgICAgICAgICAud2hlcmUoIHF1ZXJ5IClcbiAgICAgICAgICAgICAgICAgICAgLmdldCggKTtcblxuICAgICAgICAgICAgICAgIGlmICggZmluZCQuZGF0YS5sZW5ndGggPT09IDAgKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgY29uc3QgbWV0YSA9IE9iamVjdC5hc3NpZ24oeyB9LCBxdWVyeSwge1xuICAgICAgICAgICAgICAgICAgICAgICAgb2lkczogWyBvaWQgXSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHVpZHM6IFsgb3BlbklkIF0sXG4gICAgICAgICAgICAgICAgICAgICAgICBwdXJjaGFzZTogMCxcbiAgICAgICAgICAgICAgICAgICAgICAgIGJ1eV9zdGF0dXM6ICcwJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGJhc2Vfc3RhdHVzOiAnMCcsXG4gICAgICAgICAgICAgICAgICAgICAgICBhZGp1c3RQcmljZTogcHJpY2UsXG4gICAgICAgICAgICAgICAgICAgICAgICBhZGp1c3RHcm91cFByaWNlOiBncm91cFByaWNlLFxuICAgICAgICAgICAgICAgICAgICAgICAgY3JlYXRlVGltZTogbmV3IERhdGUoICkuZ2V0VGltZSggKVxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGNyZWFldCQgPSBhd2FpdCBkYi5jb2xsZWN0aW9uKCdzaG9wcGluZy1saXN0JylcbiAgICAgICAgICAgICAgICAgICAgICAgIC5hZGQoe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGE6IG1ldGFcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcblxuICAgICAgICAgICAgICAgIC8vIOabtOaWsOaPkuWFpVxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGxldCBtZXRhU2hvcHBpbmdMaXN0ID0gZmluZCQuZGF0YVsgMCBdO1xuICAgICAgICAgICAgICAgICAgICBpZiAoICFtZXRhU2hvcHBpbmdMaXN0Lm9pZHMuZmluZCggeCA9PiB4ID09PSBvaWQgKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgbGFzdE9pZHMgPSBtZXRhU2hvcHBpbmdMaXN0Lm9pZHM7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBsYXN0VWlkcyA9IG1ldGFTaG9wcGluZ0xpc3QudWlkcztcblxuICAgICAgICAgICAgICAgICAgICAgICAgLy8g5o+S5YWl5Yiw5aS06YOo77yM5pyA5paw55qE5bey5pSv5LuY6K6i5Y2V5bCx5Zyo5LiK6Z2iXG4gICAgICAgICAgICAgICAgICAgICAgICBsYXN0T2lkcy51bnNoaWZ0KCBvaWQgKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCAhbGFzdFVpZHMuZmluZCggeCA9PiB4ID09PSBvcGVuSWQgKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxhc3RVaWRzLnVuc2hpZnQoIG9wZW5JZCApO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCB1cGRhdGUkID0gYXdhaXQgZGIuY29sbGVjdGlvbignc2hvcHBpbmctbGlzdCcpLmRvYyggU3RyaW5nKCBmaW5kJC5kYXRhWyAwIF0uX2lkICkpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLnVwZGF0ZSh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9pZHM6IGxhc3RPaWRzLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdWlkczogbGFzdFVpZHMsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB1cGRhdGVUaW1lOiBuZXcgRGF0ZSggKS5nZXRUaW1lKCApXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIH0pKTtcblxuICAgICAgICAgICAgcmV0dXJuIGN0eC5ib2R5ID0ge1xuICAgICAgICAgICAgICAgIHN0YXR1czogMjAwXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfSBjYXRjaCAoIGUgKSB7IHJldHVybiBjdHguYm9keSA9IHsgc3RhdHVzOiA1MDAgfX1cbiAgICB9KTtcblxuICAgIC8qKlxuICAgICAqIEBkZXNjcmlwdGlvbiBcbiAgICAgKiB7XG4gICAgICogICAgIHRpZCwgXG4gICAgICogICAgIG5lZWRPcmRlcnMg5piv5ZCm6ZyA6KaB6L+U5Zue6K6i5Y2VXG4gICAgICogfVxuICAgICAqIOihjOeoi+eahOi0reeJqea4heWNle+8jOeUqOS6juiwg+aVtOWVhuWTgeS7t+agvOOAgei0reS5sOaVsOmHj1xuICAgICAqIFwi55yL55yL5LuW5Lq65Lmw5LqG5LuA5LmIXCJcbiAgICAgKi9cbiAgICBhcHAucm91dGVyKCdsaXN0JywgYXN5bmMoIGN0eCwgbmV4dCApID0+IHtcbiAgICAgICAgdHJ5IHtcblxuICAgICAgICAgICAgbGV0IG9yZGVycyQ6IGFueSA9IFsgXTtcbiAgICAgICAgICAgIGNvbnN0IHsgdGlkLCBuZWVkT3JkZXJzIH0gPSBldmVudC5kYXRhO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICBcbiAgICAgICAgICAgIC8vIOaLv+WIsOihjOeoi+S4i+aJgOacieeahOi0reeJqea4heWNlVxuICAgICAgICAgICAgY29uc3QgbGlzdHMkID0gYXdhaXQgZGIuY29sbGVjdGlvbignc2hvcHBpbmctbGlzdCcpXG4gICAgICAgICAgICAgICAgLndoZXJlKHtcbiAgICAgICAgICAgICAgICAgICAgdGlkXG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAuZ2V0KCApO1xuICAgICAgICAgICBcbiAgICAgICAgICAgIC8vIOafpeivouavj+adoea4heWNleW6leS4i+eahOavj+S4qm9yZGVy6K+m5oOF77yM6L+Z6YeM55qE5q+P5Liqb3JkZXLpg73mmK/lt7Lku5jorqLph5HnmoRcbiAgICAgICAgICAgIGlmICggbmVlZE9yZGVycyAhPT0gZmFsc2XCoCkge1xuICAgICAgICAgICAgICAgIG9yZGVycyQgPSBhd2FpdCBQcm9taXNlLmFsbCggbGlzdHMkLmRhdGEubWFwKCBsaXN0ID0+IHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFByb21pc2UuYWxsKCBsaXN0Lm9pZHMubWFwKCBhc3luYyBvaWQgPT4ge1xuICAgIFxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3Qgb3JkZXIkID0gYXdhaXQgZGIuY29sbGVjdGlvbignb3JkZXInKS5kb2MoIG9pZCApXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLmdldCggKTtcbiAgICBcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHVzZXIkID0gYXdhaXQgZGIuY29sbGVjdGlvbigndXNlcicpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLndoZXJlKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb3BlbmlkOiBvcmRlciQuZGF0YS5vcGVuaWRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5nZXQoICk7XG4gICAgXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gT2JqZWN0LmFzc2lnbih7IH0sIG9yZGVyJC5kYXRhLCB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdXNlcjogdXNlciQuZGF0YVsgMCBdXG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgfSkpO1xuICAgICAgICAgICAgICAgIH0pKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8g5p+l6K+i5q+P5p2h5riF5Y2V5bqV5LiL5q+P5Liq5ZWG5ZOB55qE6K+m5oOFXG4gICAgICAgICAgICBjb25zdCBnb29kcyQ6IGFueSA9IGF3YWl0IFByb21pc2UuYWxsKCBsaXN0cyQuZGF0YS5tYXAoIGFzeW5jIGxpc3QgPT4ge1xuXG4gICAgICAgICAgICAgICAgY29uc3QgeyBwaWQsIHNpZCB9ID0gbGlzdDtcbiAgICAgICAgICAgICAgICBjb25zdCBjb2xsZWN0aW9uTmFtZSA9ICEhc2lkID8gJ3N0YW5kYXJkcycgOiAnZ29vZHMnO1xuXG4gICAgICAgICAgICAgICAgLy8g5Z6L5Y+3XG4gICAgICAgICAgICAgICAgbGV0IHN0YW5kYXIkOiBhbnkgPSBudWxsO1xuXG4gICAgICAgICAgICAgICAgLy8g5ZWG5ZOBXG4gICAgICAgICAgICAgICAgY29uc3QgZ29vZCQgPSBhd2FpdCBkYi5jb2xsZWN0aW9uKCdnb29kcycpXG4gICAgICAgICAgICAgICAgICAgIC5kb2MoIHBpZCApXG4gICAgICAgICAgICAgICAgICAgIC5nZXQoICk7XG5cbiAgICAgICAgICAgICAgICBpZiAoICEhc2lkICkge1xuICAgICAgICAgICAgICAgICAgICBzdGFuZGFyJCA9IGF3YWl0IGRiLmNvbGxlY3Rpb24oJ3N0YW5kYXJkcycpXG4gICAgICAgICAgICAgICAgICAgICAgICAuZG9jKCBzaWQgKVxuICAgICAgICAgICAgICAgICAgICAgICAgLmdldCggKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgICAgICB0YWc6IGdvb2QkLmRhdGEudGFnLFxuICAgICAgICAgICAgICAgICAgICB0aXRsZTogZ29vZCQuZGF0YS50aXRsZSxcbiAgICAgICAgICAgICAgICAgICAgbmFtZTogc3RhbmRhciQgPyBzdGFuZGFyJC5kYXRhLm5hbWUgOiAnJyxcbiAgICAgICAgICAgICAgICAgICAgcHJpY2U6IHN0YW5kYXIkID8gc3RhbmRhciQuZGF0YS5wcmljZSA6IGdvb2QkLmRhdGEucHJpY2UsXG4gICAgICAgICAgICAgICAgICAgIGltZzogc3RhbmRhciQgPyBzdGFuZGFyJC5kYXRhLmltZyA6IGdvb2QkLmRhdGEuaW1nWyAwIF0sXG4gICAgICAgICAgICAgICAgICAgIGdyb3VwUHJpY2U6IHN0YW5kYXIkID8gc3RhbmRhciQuZGF0YS5ncm91cFByaWNlIDogZ29vZCQuZGF0YS5ncm91cFByaWNlLFxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pKTtcblxuICAgICAgICAgICAgY29uc3QgbGlzdCA9IGxpc3RzJC5kYXRhLm1hcCgoIGwsIGsgKSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3QgeyBpbWcsIHByaWNlLCBncm91cFByaWNlLCB0aXRsZSwgbmFtZSwgdGFnIH0gPSBnb29kcyRbIGsgXTtcbiAgICAgICAgICAgICAgICBsZXQgbWV0YSA9IE9iamVjdC5hc3NpZ24oeyB9LCBsLCB7XG4gICAgICAgICAgICAgICAgICAgIHRhZyxcbiAgICAgICAgICAgICAgICAgICAgaW1nLFxuICAgICAgICAgICAgICAgICAgICBwcmljZSxcbiAgICAgICAgICAgICAgICAgICAgZ3JvdXBQcmljZSxcbiAgICAgICAgICAgICAgICAgICAgZ29vZE5hbWU6IHRpdGxlLFxuICAgICAgICAgICAgICAgICAgICBzdGFuZGFyTmFtZTogbmFtZVxuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgaWYgKCBuZWVkT3JkZXJzICE9PSBmYWxzZSApIHtcbiAgICAgICAgICAgICAgICAgICAgbWV0YSA9IE9iamVjdC5hc3NpZ24oeyB9LCBtZXRhLCB7XG4gICAgICAgICAgICAgICAgICAgICAgICBvcmRlcjogb3JkZXJzJFsgayBdLFxuICAgICAgICAgICAgICAgICAgICAgICAgdG90YWw6IG9yZGVycyRbIGsgXS5yZWR1Y2UoKCB4LCB5ICkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB4ICsgeS5jb3VudDtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sIDAgKVxuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHJldHVybiBtZXRhO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHJldHVybiBjdHguYm9keSA9IHtcbiAgICAgICAgICAgICAgICBzdGF0dXM6IDIwMCxcbiAgICAgICAgICAgICAgICBkYXRhOiBsaXN0LFxuICAgICAgICAgICAgfVxuXG4gICAgICAgIH0gY2F0Y2ggKCBlICkgeyByZXR1cm4gY3R4LmJvZHkgPSB7IHN0YXR1czogNTAwIH07fVxuICAgIH0pXG5cbiAgICAvKipcbiAgICAgKiDotK3nianmuIXljZXosIPmlbRcbiAgICAgKiAtLS0tLS0tLSDor7fmsYJcbiAgICAgKiB7XG4gICAgICogICAgc2hvcHBpbmdJZCwgYWRqdXN0UHJpY2UsIHB1cmNoYXNlLCBhZGp1c3RHcm91cFByaWNlXG4gICAgICogfVxuICAgICAqL1xuICAgIGFwcC5yb3V0ZXIoJ2FkanVzdCcsIGFzeW5jKCBjdHgsIG5leHQgKSA9PiB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGNvbnN0IHsgc2hvcHBpbmdJZCwgYWRqdXN0UHJpY2UsIGFkanVzdEdyb3VwUHJpY2UgfSA9IGV2ZW50LmRhdGE7XG5cbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICog5riF5Y2V77yM5YWI5ou/5Yiw6K6i5Y2V6YeH6LSt5oC75pWwXG4gICAgICAgICAgICAgKiDpmo/lkI7mm7TmlrDvvJrph4fotK3ph4/jgIHmuIXljZXllK7ku7fjgIHmuIXljZXlm6LotK3ku7fjgIFiYXNlX3N0YXR1c+OAgWJ1eV9zdGF0dXNcbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgY29uc3Qgc2hvcHBpbmckID0gYXdhaXQgZGIuY29sbGVjdGlvbignc2hvcHBpbmctbGlzdCcpXG4gICAgICAgICAgICAgICAgLmRvYyggc2hvcHBpbmdJZCApXG4gICAgICAgICAgICAgICAgLmdldCggKTtcbiAgIFxuICAgICAgICAgICAgY29uc3Qgb3JkZXJzJCA9IGF3YWl0IFByb21pc2UuYWxsKCBzaG9wcGluZyQuZGF0YS5vaWRzLm1hcCggb2lkID0+IHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZGIuY29sbGVjdGlvbignb3JkZXInKVxuICAgICAgICAgICAgICAgICAgICAuZG9jKCBvaWQgKVxuICAgICAgICAgICAgICAgICAgICAuZ2V0KCApO1xuICAgICAgICAgICAgfSkpO1xuXG4gICAgICAgICAgICAvLyDmnIDlkI7liIbphY3ph49cbiAgICAgICAgICAgIGxldCBsYXN0QWxsb2NhdGVkID0gMDtcblxuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiDliankvZnliIbphY3ph49cbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgbGV0IHB1cmNoYXNlID0gZXZlbnQuZGF0YS5wdXJjaGFzZTtcblxuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiAhIOS8oOWFpeWIhumFjemHj+S4jeiDveWwkeS6juOAguW3suWujOaIkOWIhumFjeiuouWNleeahOaVsOmineS5i+WSjFxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICBjb25zdCBmaW5pc2hBZGp1c3RPcmRlcnMgPSBvcmRlcnMkXG4gICAgICAgICAgICAgICAgLm1hcCgoIHg6IGFueSApID0+IHguZGF0YSApXG4gICAgICAgICAgICAgICAgLmZpbHRlciggbyA9PiBvLmJhc2Vfc3RhdHVzID09PSAnMicgKTtcblxuICAgICAgICAgICAgLy8g5bey5YiG6YWN6YePXG4gICAgICAgICAgICBjb25zdCBoYXNCZWVuQWRqdXN0ID0gZmluaXNoQWRqdXN0T3JkZXJzLnJlZHVjZSgoIHgsIHkgKSA9PiB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHggKyB5LmFsbG9jYXRlZENvdW50O1xuICAgICAgICAgICAgfSwgMCApO1xuXG4gICAgICAgICAgICBpZiAoIHB1cmNoYXNlIDwgaGFzQmVlbkFkanVzdCApIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gY3R4LmJvZHkgPSB7XG4gICAgICAgICAgICAgICAgICAgIHN0YXR1czogNTAwLFxuICAgICAgICAgICAgICAgICAgICBtZXNzYWdlOiBg5pyJJHtmaW5pc2hBZGp1c3RPcmRlcnMubGVuZ3RofeS4quiuouWNleW3suehruiupO+8jOaVsOmHj+S4jeiDveWwkeS6jiR7aGFzQmVlbkFkanVzdH3ku7ZgXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgXG4gICAgICAgICAgICBsZXQgbmVlZEJ1eVRvdGFsID0gb3JkZXJzJC5yZWR1Y2UoKCB4LCB5ICkgPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiB4ICsgKHkgYXMgYW55KS5kYXRhLmNvdW50O1xuICAgICAgICAgICAgfSwgMCApO1xuXG4gICAgICAgICAgICBjb25zdCB0ZW1wID0gT2JqZWN0LmFzc2lnbih7IH0sIHNob3BwaW5nJC5kYXRhLCB7XG4gICAgICAgICAgICAgICAgcHVyY2hhc2UsXG4gICAgICAgICAgICAgICAgYWRqdXN0UHJpY2UsXG4gICAgICAgICAgICAgICAgYWRqdXN0R3JvdXBQcmljZSxcbiAgICAgICAgICAgICAgICBiYXNlX3N0YXR1czogJzEnLFxuICAgICAgICAgICAgICAgIGJ1eV9zdGF0dXM6IHB1cmNoYXNlIDwgbmVlZEJ1eVRvdGFsID8gJzInIDogJzEnLFxuICAgICAgICAgICAgICAgIHVwZGF0ZVRpbWU6IG5ldyBEYXRlKCApLmdldFRpbWUoIClcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBkZWxldGUgdGVtcFsnX2lkJ107XG5cbiAgICAgICAgICAgIC8vIOabtOaWsOa4heWNlVxuICAgICAgICAgICAgYXdhaXQgZGIuY29sbGVjdGlvbignc2hvcHBpbmctbGlzdCcpXG4gICAgICAgICAgICAgICAgLmRvYyggc2hvcHBpbmdJZCApXG4gICAgICAgICAgICAgICAgLnNldCh7XG4gICAgICAgICAgICAgICAgICAgIGRhdGE6IHRlbXBcbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiAh5Lul5LiL6K6i5Y2V6YO95piv5bey5LuY6K6i6YeR55qEXG4gICAgICAgICAgICAgKiDorqLljZXvvJrmibnph4/lr7norqLljZXnmoTku7fmoLzjgIHlm6LotK3ku7fjgIHotK3kubDnirbmgIHov5vooYzosIPmlbQo5bey6LSt5LmwL+i/m+ihjOS4re+8jOWFtuS7luW3sue7j+ehruWumuiwg+aVtOeahOiuouWNle+8jOS4jeWBmuWkhOeQhilcbiAgICAgICAgICAgICAqIOWFtuWunuW6lOivpeS5n+imgeiHquWKqOazqOWFpeiuouWNleaVsOmHj++8iOetlueVpe+8muWFiOWIsOWFiOW+l++8jOWQjuS4i+WNleS8muacieW+l+S4jeWIsOWNleeahOmjjumZqe+8iVxuICAgICAgICAgICAgICogIeWmguaenOW3sue7j+WIhumFjei/h+S6hu+8jOWImeS4jeWGjeiHquWKqOWIhumFjemHh+i0remHj1xuICAgICAgICAgICAgICovXG4gICAgICAgICAgICBjb25zdCBzb3JyZWRPcmRlcnMgPSBvcmRlcnMkXG4gICAgICAgICAgICAgICAgLm1hcCgoIHg6IGFueSApID0+IHguZGF0YSApXG4gICAgICAgICAgICAgICAgLmZpbHRlcigoIHg6IGFueSApID0+IHguYmFzZV9zdGF0dXMgPT09ICcwJyB8fCB4LmJhc2Vfc3RhdHVzID09PSAnMScgKVxuICAgICAgICAgICAgICAgIC5zb3J0KCggeDogYW55LCB5OiBhbnkgKSA9PiB4LmNyZWF0ZVRpbWUgLSB5LmNyZWF0ZVRpbWUgKTtcblxuICAgICAgICAgICAgLy8g5Ymp5L2Z5YiG6YWN6YePXG4gICAgICAgICAgICBwdXJjaGFzZSAtPSBoYXNCZWVuQWRqdXN0O1xuXG4gICAgICAgICAgICBhd2FpdCBQcm9taXNlLmFsbCggc29ycmVkT3JkZXJzLm1hcCggYXN5bmMgb3JkZXIgPT4ge1xuXG4gICAgICAgICAgICAgICAgY29uc3QgYmFzZVRlbXAgPSB7XG4gICAgICAgICAgICAgICAgICAgIGFsbG9jYXRlZFByaWNlOiBhZGp1c3RQcmljZSxcbiAgICAgICAgICAgICAgICAgICAgYWxsb2NhdGVkR3JvdXBQcmljZTogYWRqdXN0R3JvdXBQcmljZSxcbiAgICAgICAgICAgICAgICAgICAgLy8g5peg6K666Ieq5Yqo5YiG6YWN5piv5ZCm5oiQ5Yqf77yM6YO95piv6KKr4oCc5YiG6YWN4oCd5pON5L2c6L+H55qEXG4gICAgICAgICAgICAgICAgICAgIGJhc2Vfc3RhdHVzOiAnMScsXG4gICAgICAgICAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICAgICAgICAgKiAhIHYxOiDliankvZnliIbphY3ph4/kuI3otrPph4fotK3ph4/lsLHliIbphY0wXG4gICAgICAgICAgICAgICAgICAgICAqICEgdjI6IOWJqeS9meWIhumFjemHj+S4jei2s+mHh+i0remHj++8jOWwseWIhumFjeWJqeS9meeahOmHh+i0remHj1xuICAgICAgICAgICAgICAgICAgICAgKi9cbiAgICAgICAgICAgICAgICAgICAgLy8gYWxsb2NhdGVkQ291bnQ6IHB1cmNoYXNlIC0gb3JkZXIuY291bnQgPj0gMCA/IG9yZGVyLmNvdW50IDogMFxuICAgICAgICAgICAgICAgICAgICBhbGxvY2F0ZWRDb3VudDogcHVyY2hhc2UgLSBvcmRlci5jb3VudCA+PSAwID9cbiAgICAgICAgICAgICAgICAgICAgICAgIG9yZGVyLmNvdW50IDpcbiAgICAgICAgICAgICAgICAgICAgICAgIHB1cmNoYXNlXG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAvLyDliIbphY3miJDlip9cbiAgICAgICAgICAgICAgICBpZiAoIHB1cmNoYXNlIC0gb3JkZXIuY291bnQgPj0gMCApIHtcbiAgICAgICAgICAgICAgICAgICAgbGFzdEFsbG9jYXRlZCA9IHB1cmNoYXNlIC0gb3JkZXIuY291bnQ7XG4gICAgICAgICAgICAgICAgICAgIHB1cmNoYXNlIC09IG9yZGVyLmNvdW50O1xuXG4gICAgICAgICAgICAgICAgLy8g6LSn5rqQ5LiN6Laz77yM5YiG6YWN5pyA5ZCO55qE5Ymp5L2Z6YePXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgbGFzdEFsbG9jYXRlZCA9IDA7XG4gICAgICAgICAgICAgICAgICAgIHB1cmNoYXNlID0gMDtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBjb25zdCB0ZW1wID0gT2JqZWN0LmFzc2lnbih7IH0sIG9yZGVyLCBiYXNlVGVtcCApO1xuXG4gICAgICAgICAgICAgICAgZGVsZXRlIHRlbXBbJ19pZCddO1xuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIGF3YWl0IGRiLmNvbGxlY3Rpb24oJ29yZGVyJylcbiAgICAgICAgICAgICAgICAgICAgLmRvYyggb3JkZXIuX2lkIClcbiAgICAgICAgICAgICAgICAgICAgLnNldCh7XG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRhOiB0ZW1wXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIHJldHVybjtcblxuICAgICAgICAgICAgfSkpO1xuXG4gICAgICAgICAgICAvLyDmm7TmlrDmuIXljZXnmoTliankvZnliIbphY3mlbBcbiAgICAgICAgICAgIGF3YWl0IGRiLmNvbGxlY3Rpb24oJ3Nob3BwaW5nLWxpc3QnKVxuICAgICAgICAgICAgICAgIC5kb2MoIHNob3BwaW5nSWQgKVxuICAgICAgICAgICAgICAgIC51cGRhdGUoe1xuICAgICAgICAgICAgICAgICAgICBkYXRhOiB7IGxhc3RBbGxvY2F0ZWQgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICBcbiAgICAgICAgICAgIHJldHVybiBjdHguYm9keSA9IHtcbiAgICAgICAgICAgICAgICBzdGF0dXM6IDIwMFxuICAgICAgICAgICAgfVxuXG4gICAgICAgIH0gY2F0Y2ggKCBlICkgeyByZXR1cm4gY3R4LmJvZHkgPSB7IHN0YXR1czogNTAwIH07fVxuICAgIH0pXG5cbiAgICAvKipcbiAgICAgKiBAZGVzY3JpcHRpb25cbiAgICAgKiDojrflj5booYznqIvph4zmmK/lkKbov5jmnInmnKrosIPmlbTnmoTmuIXljZVcbiAgICAqL1xuICAgIGFwcC5yb3V0ZXIoJ2FkanVzdC1zdGF0dXMnLCBhc3luYyggY3R4LCBuZXh0ICkgPT4ge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgY29uc3QgeyB0aWQgfSA9IGV2ZW50LmRhdGE7XG4gICAgICAgICAgICBjb25zdCBjb3VudCA9IGF3YWl0IGRiLmNvbGxlY3Rpb24oJ3Nob3BwaW5nLWxpc3QnKVxuICAgICAgICAgICAgICAgIC53aGVyZSh7XG4gICAgICAgICAgICAgICAgICAgIHRpZCxcbiAgICAgICAgICAgICAgICAgICAgYmFzZV9zdGF0dXM6ICcwJ1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLmNvdW50KCApO1xuXG4gICAgICAgICAgICByZXR1cm4gY3R4LmJvZHkgPSB7XG4gICAgICAgICAgICAgICAgc3RhdHVzOiAyMDAsXG4gICAgICAgICAgICAgICAgZGF0YTogY291bnQudG90YWxcbiAgICAgICAgICAgIH1cblxuICAgICAgICB9IGNhdGNoICggZSApIHtcbiAgICAgICAgICAgIHJldHVybiBjdHguYm9keSA9IHsgc3RhdHVzOiA1MDAgfTtcbiAgICAgICAgfVxuICAgIH0pXG5cbiAgICAvKipcbiAgICAgKiBAZGVzY3JpcHRpb25cbiAgICAgKiDnrYnlvoXmi7zlm6LliJfooaggLyDlj6/mi7zlm6LliJfooahcbiAgICAgKiB7XG4gICAgICogICAgZGV0YWlsOiBib29sZWFuIOaYr+WQpuW4puWbnuWVhuWTgeivpuaDhVxuICAgICAqICAgIHR5cGU6ICd3YWl0JyB8ICdwaW4nIC8vIOetieW+heaLvOWbou+8jOW3sue7j+WPr+S7peaLvOWbolxuICAgICAqIH1cbiAgICAgKi9cbiAgICBhcHAucm91dGVyKCdwaW4nLCBhc3luYyggY3R4LCBuZXh0ICkgPT4ge1xuICAgICAgICB0cnkge1xuXG4gICAgICAgICAgICBjb25zdCB0eXBlID0gZXZlbnQuZGF0YS50eXBlIHx8ICdwaW4nO1xuICAgICAgICAgICAgY29uc3QgeyB0aWQsIGRldGFpbCB9ID0gZXZlbnQuZGF0YTtcbiAgICAgICAgICAgIGNvbnN0IHNob3BwaW5nJCA9IGF3YWl0IGRiLmNvbGxlY3Rpb24oJ3Nob3BwaW5nLWxpc3QnKVxuICAgICAgICAgICAgICAgIC53aGVyZSh7XG4gICAgICAgICAgICAgICAgICAgIHRpZCxcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIC5nZXQoICk7XG5cbiAgICAgICAgICAgIC8vIHVpZHPplb/luqbkuLox77yM5Li65b6F5ou85YiX6KGoICgg5bqU5LiN5bqU6K+l5pyJ6Ieq5bexIClcbiAgICAgICAgICAgIC8vIHVpZHPplb/luqbkuLoy77yM5Li65Y+v5Lul5ou85Zui5YiX6KGoXG4gICAgICAgICAgICBsZXQgZGF0YTogYW55ID0gWyBdO1xuICAgICAgICAgICAgY29uc3QgZGF0YSQgPSBzaG9wcGluZyQuZGF0YS5maWx0ZXIoIHMgPT4ge1xuICAgICAgICAgICAgICAgIGlmICggdHlwZSA9PT0gJ3BpbicgKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAhIXMuYWRqdXN0R3JvdXBQcmljZSAmJiBzLnVpZHMubGVuZ3RoID4gMVxuXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuICEhcy5hZGp1c3RHcm91cFByaWNlICYmIHMudWlkcy5sZW5ndGggPT09IDFcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgZGF0YSA9IGRhdGEkO1xuXG4gICAgICAgICAgICAvLyDms6jlhaXllYblk4Hor6bmg4VcbiAgICAgICAgICAgIGlmICggZGV0YWlsID09PSB1bmRlZmluZWQgfHwgISFkZXRhaWwgKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgZGF0YSA9IGRhdGEkLm1hcCggc2hvcHBpbmcgPT4ge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gT2JqZWN0LmFzc2lnbih7IH0sIHNob3BwaW5nLCB7XG4gICAgICAgICAgICAgICAgICAgICAgICBkZXRhaWw6IHsgfVxuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgXG4gICAgICAgICAgICByZXR1cm4gY3R4LmJvZHkgPSB7XG4gICAgICAgICAgICAgICAgZGF0YSxcbiAgICAgICAgICAgICAgICBzdGF0dXM6IDIwMFxuICAgICAgICAgICAgfVxuXG4gICAgICAgIH0gY2F0Y2ggKCBlICkge1xuICAgICAgICAgICAgcmV0dXJuIGN0eC5ib2R5ID0geyBzdGF0dXM6IDUwMCB9O1xuICAgICAgICB9XG4gICAgfSlcblxuICAgIHJldHVybiBhcHAuc2VydmUoICk7XG5cbn0iXX0=