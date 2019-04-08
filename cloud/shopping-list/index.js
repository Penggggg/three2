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
                                    buy_status: '2'
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
                                    buy_status: '1'
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
                                var tid, pid, sid, oid, price, groupPrice, acid, query, find$, meta, creaet$, metaShoppingList, lastOids, lastUids, update$;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            tid = orderMeta.tid, pid = orderMeta.pid, sid = orderMeta.sid, oid = orderMeta.oid, price = orderMeta.price, groupPrice = orderMeta.groupPrice, acid = orderMeta.acid;
                                            query = {
                                                tid: tid,
                                                pid: pid
                                            };
                                            if (!!sid) {
                                                query['sid'] = sid;
                                            }
                                            if (!!acid) {
                                                query = Object.assign({}, query, {
                                                    acid: acid
                                                });
                                            }
                                            return [4, db.collection('shopping-list')
                                                    .where(query)
                                                    .get()];
                                        case 1:
                                            find$ = _a.sent();
                                            if (!(find$.data.length === 0)) return [3, 3];
                                            meta = Object.assign({}, query, {
                                                acid: acid || undefined
                                            }, {
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
            var orders$_1, _a, tid, needOrders_1, openid, lists$, goods$_1, activities$_1, list, e_3;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 6, , 7]);
                        orders$_1 = [];
                        _a = event.data, tid = _a.tid, needOrders_1 = _a.needOrders;
                        openid = event.data.openId || event.userInfo.openId;
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
                        return [4, Promise.all(lists$.data.map(function (list) { return __awaiter(_this, void 0, void 0, function () {
                                var acid, meta;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            acid = list.acid;
                                            if (!!acid) return [3, 1];
                                            return [2, {
                                                    ac_price: null,
                                                    ac_groupPrice: null
                                                }];
                                        case 1: return [4, db.collection('activity')
                                                .doc(String(acid))
                                                .get()];
                                        case 2:
                                            meta = _a.sent();
                                            return [2, {
                                                    ac_price: meta.data.ac_price,
                                                    ac_groupPrice: meta.data.ac_groupPrice,
                                                }];
                                    }
                                });
                            }); }))];
                    case 5:
                        activities$_1 = _b.sent();
                        list = lists$.data.map(function (l, k) {
                            var _a = activities$_1[k], ac_groupPrice = _a.ac_groupPrice, ac_price = _a.ac_price;
                            var _b = goods$_1[k], img = _b.img, price = _b.price, groupPrice = _b.groupPrice, title = _b.title, name = _b.name, tag = _b.tag;
                            var meta = Object.assign({}, l, {
                                tag: tag,
                                img: img,
                                price: price,
                                groupPrice: groupPrice,
                                goodName: title,
                                standarName: name,
                                ac_groupPrice: ac_groupPrice,
                                ac_price: ac_price
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
                    case 6:
                        e_3 = _b.sent();
                        return [2, ctx.body = { status: 500 }];
                    case 7: return [2];
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
                        console.log('111111', shopping$);
                        return [4, Promise.all(shopping$.data.oids.map(function (oid) {
                                return db.collection('order')
                                    .doc(oid)
                                    .get();
                            }))];
                    case 2:
                        orders$ = _b.sent();
                        console.log('2222222', orders$);
                        lastAllocated_1 = 0;
                        purchase_1 = event.data.purchase;
                        finishAdjustOrders = orders$
                            .map(function (x) { return x.data; })
                            .filter(function (o) { return o.base_status === '2'; });
                        console.log('333333', finishAdjustOrders);
                        hasBeenAdjust = finishAdjustOrders.reduce(function (x, y) {
                            return x + y.allocatedCount;
                        }, 0);
                        console.log('444444', hasBeenAdjust);
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
                        console.log('555555', temp);
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
                        console.log('666666', sorredOrders);
                        purchase_1 -= hasBeenAdjust;
                        console.log('777', purchase_1);
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
            var openid, _a, tid, detail, pid, type_1, limit, showUser, query, shopping$, data, data$, goodIds, standarsIds, allGoods$_1, allStandars$_1, good$_1, uids_1, users$_1, e_6;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 10, , 11]);
                        openid = event.userInfo.openId;
                        _a = event.data, tid = _a.tid, detail = _a.detail, pid = _a.pid, type_1 = _a.type, limit = _a.limit;
                        showUser = event.data.showUser || false;
                        query = pid ? {
                            tid: tid,
                            pid: pid
                        } : {
                            tid: tid
                        };
                        shopping$ = void 0;
                        if (!limit) return [3, 2];
                        return [4, db.collection('shopping-list')
                                .where(query)
                                .limit(limit)
                                .get()];
                    case 1:
                        shopping$ = _b.sent();
                        return [3, 4];
                    case 2: return [4, db.collection('shopping-list')
                            .where(query)
                            .get()];
                    case 3:
                        shopping$ = _b.sent();
                        _b.label = 4;
                    case 4:
                        data = [];
                        data$ = shopping$.data.filter(function (s) {
                            if (type_1 === 'pin') {
                                return !!s.adjustGroupPrice && s.uids.length > 1;
                            }
                            else if (type_1 === 'wait') {
                                return !!s.adjustGroupPrice && s.uids.length === 1;
                            }
                            else {
                                return !!s.adjustGroupPrice;
                            }
                        });
                        data$ = data$.sort(function (x, y) { return x.uids.length - y.uids.length; });
                        data = data$;
                        if (!(detail === undefined || !!detail)) return [3, 7];
                        goodIds = Array.from(new Set(data$.map(function (list) {
                            return list.pid;
                        })));
                        standarsIds = Array.from(new Set(data$.map(function (list) {
                            return list.sid;
                        }))).filter(function (x) { return !!x; });
                        return [4, Promise.all(goodIds.map(function (goodId) {
                                return db.collection('goods')
                                    .doc(goodId)
                                    .get();
                            }))];
                    case 5:
                        allGoods$_1 = _b.sent();
                        allGoods$_1 = allGoods$_1.map(function (x) { return x.data; });
                        return [4, Promise.all(standarsIds.map(function (sid) {
                                return db.collection('standards')
                                    .doc(sid)
                                    .get();
                            }))];
                    case 6:
                        allStandars$_1 = _b.sent();
                        allStandars$_1 = allStandars$_1.map(function (x) { return x.data; });
                        good$_1 = data$.map(function (list) {
                            var pid = list.pid, sid = list.sid;
                            var good = allGoods$_1.find(function (x) { return x._id === pid; });
                            var standar = allStandars$_1.find(function (x) { return x._id === sid; });
                            return {
                                good: good,
                                tag: good.tag,
                                title: good.title,
                                saled: good.saled,
                                name: standar ? standar.name : '',
                                price: standar ? standar.price : good.price,
                                img: standar ? standar.img : good.img[0],
                                groupPrice: standar ? standar.groupPrice : good.groupPrice,
                            };
                        });
                        data = data$.map(function (shopping, k) {
                            return Object.assign({}, shopping, {
                                detail: good$_1[k]
                            });
                        });
                        _b.label = 7;
                    case 7:
                        if (!showUser) return [3, 9];
                        uids_1 = [];
                        data$.map(function (list) {
                            uids_1 = uids_1.concat(list.uids);
                        });
                        uids_1 = Array.from(new Set(uids_1));
                        return [4, Promise.all(uids_1.map(function (uid) {
                                return db.collection('user')
                                    .where({
                                    openid: uid
                                })
                                    .field({
                                    openid: true,
                                    avatarUrl: true,
                                    nickName: true
                                })
                                    .get();
                            }))];
                    case 8:
                        users$_1 = _b.sent();
                        users$_1 = users$_1.map(function (x) { return x.data[0]; });
                        data = data.map(function (shopping, k) {
                            return Object.assign({}, shopping, {
                                users: shopping.uids.map(function (uid) { return users$_1.find(function (x) { return x.openid === uid; }); })
                            });
                        });
                        _b.label = 9;
                    case 9: return [2, ctx.body = {
                            data: data,
                            status: 200
                        }];
                    case 10:
                        e_6 = _b.sent();
                        return [2, ctx.body = { status: 500 }];
                    case 11: return [2];
                }
            });
        }); });
        app.router('fairy-shoppinglist', function (ctx, next) { return __awaiter(_this, void 0, void 0, function () {
            var tid_1, limit, shoppingMeta$, uids_2, uidMapTimes_1, userIds_1, users$, coupons$_1, shoppingMetaFilter, pIds, details$_1, shoppingInject_1, metaData, e_7;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 5, , 6]);
                        tid_1 = event.data.tid;
                        limit = event.data.limit || 5;
                        return [4, db.collection('shopping-list')
                                .where({
                                tid: tid_1
                            })
                                .get()];
                    case 1:
                        shoppingMeta$ = _a.sent();
                        uids_2 = [];
                        shoppingMeta$.data.map(function (sl) {
                            uids_2 = uids_2.concat(sl.uids);
                        });
                        uidMapTimes_1 = {};
                        uids_2.map(function (uidstring) {
                            var _a, _b;
                            if (!uidMapTimes_1[uidstring]) {
                                uidMapTimes_1 = Object.assign({}, uidMapTimes_1, (_a = {},
                                    _a[uidstring] = 1,
                                    _a));
                            }
                            else {
                                uidMapTimes_1 = Object.assign({}, uidMapTimes_1, (_b = {},
                                    _b[uidstring] = uidMapTimes_1[uidstring] + 1,
                                    _b));
                            }
                        });
                        userIds_1 = Object.entries(uidMapTimes_1)
                            .sort(function (x, y) {
                            return y[1] - x[1];
                        })
                            .slice(0, limit)
                            .map(function (x) { return x[0]; });
                        return [4, Promise.all(userIds_1.map(function (uid) { return Promise.all([
                                db.collection('user')
                                    .where({
                                    openid: uid
                                })
                                    .get()
                            ]); }))];
                    case 2:
                        users$ = _a.sent();
                        return [4, Promise.all(userIds_1.map(function (uid) {
                                return db.collection('coupon')
                                    .where(_.or([
                                    {
                                        tid: tid_1,
                                        openid: uid
                                    }, {
                                        openid: uid,
                                        canUseInNext: true
                                    }
                                ]))
                                    .field({
                                    type: true,
                                    value: true,
                                    openid: true
                                })
                                    .get();
                            }))];
                    case 3:
                        coupons$_1 = _a.sent();
                        shoppingMetaFilter = shoppingMeta$.data.filter(function (s) {
                            return !!userIds_1.find(function (uid) {
                                return s.uids.find(function (u) { return u === uid; });
                            });
                        });
                        pIds = Array.from(new Set(shoppingMetaFilter
                            .map(function (s) { return s.pid; })));
                        return [4, Promise.all(pIds.map(function (pid) {
                                return db.collection('goods')
                                    .doc(pid)
                                    .field({
                                    _id: true,
                                    tag: true,
                                    img: true,
                                    title: true
                                })
                                    .get();
                            }))];
                    case 4:
                        details$_1 = _a.sent();
                        shoppingInject_1 = shoppingMetaFilter.map(function (sl) {
                            var detail = details$_1.find(function (x) { return x.data._id === sl.pid; });
                            if (detail) {
                                return Object.assign({}, sl, {
                                    detail: detail.data
                                });
                            }
                            else {
                                return Object.assign({}, sl);
                            }
                        });
                        metaData = users$.map(function (x, k) {
                            return {
                                user: x[0].data[0],
                                coupons: coupons$_1[k].data,
                                shoppinglist: shoppingInject_1.filter(function (sl) { return sl.uids.find(function (uid) { return uid === x[0].data[0].openid; }); })
                            };
                        });
                        return [2, ctx.body = {
                                status: 200,
                                data: metaData
                            }];
                    case 5:
                        e_7 = _a.sent();
                        return [2, ctx.body = { status: 500 }];
                    case 6: return [2];
                }
            });
        }); });
        return [2, app.serve()];
    });
}); };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSxpQkEwN0JDOztBQTE3QkQscUNBQXVDO0FBQ3ZDLHNDQUF3QztBQUN4QywrQkFBK0I7QUFFL0IsS0FBSyxDQUFDLElBQUksQ0FBQztJQUNQLEdBQUcsRUFBRSxPQUFPLENBQUMsR0FBRyxDQUFDLEtBQUs7Q0FDekIsQ0FBQyxDQUFDO0FBRUgsSUFBTSxFQUFFLEdBQWdCLEtBQUssQ0FBQyxRQUFRLEVBQUcsQ0FBQztBQUMxQyxJQUFNLENBQUMsR0FBRyxFQUFFLENBQUMsT0FBTyxDQUFDO0FBb0JSLFFBQUEsSUFBSSxHQUFHLFVBQVEsS0FBSyxFQUFFLE9BQU87Ozs7UUFFaEMsR0FBRyxHQUFHLElBQUksU0FBUyxDQUFDLEVBQUUsS0FBSyxPQUFBLEVBQUUsQ0FBQyxDQUFDO1FBK0RyQyxHQUFHLENBQUMsTUFBTSxDQUFDLGVBQWUsRUFBRSxVQUFPLEdBQUcsRUFBRSxJQUFJOzs7Ozs7d0JBRzlCLEtBQWdCLEtBQUssQ0FBQyxJQUFJLEVBQXhCLEdBQUcsU0FBQSxFQUFFLElBQUksVUFBQSxDQUFnQjt3QkFDM0IsTUFBTSxHQUFHLEtBQUssQ0FBQyxJQUFJLENBQUMsTUFBTSxJQUFJLEtBQUssQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDO3dCQUduQyxXQUFNLE9BQU8sQ0FBQyxHQUFHLENBQUUsS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFFLFVBQUEsQ0FBQztnQ0FDNUQsT0FBTyxZQUFLLENBQUM7b0NBQ1QsR0FBRyxFQUFFLENBQUMsQ0FBQyxHQUFHO29DQUNWLEdBQUcsRUFBRSxDQUFDLENBQUMsR0FBRztvQ0FDVixHQUFHLEVBQUUsQ0FBQyxDQUFDLEdBQUc7b0NBQ1YsVUFBVSxFQUFFLEdBQUc7aUNBQ2xCLEVBQUUsRUFBRSxFQUFFLEdBQUcsQ0FBRSxDQUFBOzRCQUNoQixDQUFDLENBQUMsQ0FBQyxFQUFBOzt3QkFQRyxTQUFTLEdBQVEsU0FPcEI7d0JBRUgsSUFBSyxTQUFTLENBQUMsSUFBSSxDQUFFLFVBQUEsQ0FBQyxJQUFJLE9BQUEsQ0FBQyxDQUFDLE1BQU0sS0FBSyxHQUFHLEVBQWhCLENBQWdCLENBQUUsRUFBRTs0QkFDMUMsTUFBTSxVQUFVLENBQUM7eUJBQ3BCO3dCQUd3QixXQUFNLE9BQU8sQ0FBQyxHQUFHLENBQUUsS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFFLFVBQUEsQ0FBQztnQ0FDOUQsT0FBTyxZQUFLLENBQUM7b0NBQ1QsR0FBRyxFQUFFLENBQUMsQ0FBQyxHQUFHO29DQUNWLEdBQUcsRUFBRSxDQUFDLENBQUMsR0FBRztvQ0FDVixHQUFHLEVBQUUsQ0FBQyxDQUFDLEdBQUc7b0NBQ1YsVUFBVSxFQUFFLEdBQUc7aUNBQ2xCLEVBQUUsRUFBRSxFQUFFLEdBQUcsQ0FBRSxDQUFBOzRCQUNoQixDQUFDLENBQUMsQ0FBQyxFQUFBOzt3QkFQRyxXQUFXLEdBQVEsU0FPdEI7d0JBR3VCLFdBQU0sT0FBTyxDQUFDLEdBQUcsQ0FBRSxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUUsVUFBQSxDQUFDO2dDQUUvRCxJQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFHO29DQUNYLE9BQU8sRUFBRSxDQUFDLFVBQVUsQ0FBQyxXQUFXLENBQUM7eUNBQzVCLEtBQUssQ0FBQzt3Q0FDSCxHQUFHLEVBQUUsQ0FBQyxDQUFDLEdBQUc7cUNBQ2IsQ0FBQzt5Q0FDRCxHQUFHLEVBQUcsQ0FBQTtpQ0FDZDtxQ0FBTTtvQ0FDSCxPQUFPLEVBQUUsQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDO3lDQUN4QixLQUFLLENBQUM7d0NBQ0gsR0FBRyxFQUFFLENBQUMsQ0FBQyxHQUFHO3FDQUNiLENBQUM7eUNBQ0QsR0FBRyxFQUFHLENBQUE7aUNBQ2Q7NEJBRUwsQ0FBQyxDQUFDLENBQUMsRUFBQTs7d0JBaEJHLFlBQVksR0FBUSxTQWdCdkI7d0JBRUcsVUFBUSxZQUFZLENBQUMsR0FBRyxDQUFFLFVBQUEsQ0FBQyxJQUFJLE9BQUEsQ0FBQyxDQUFDLElBQUksQ0FBRSxDQUFDLENBQUUsRUFBWCxDQUFXLENBQUMsQ0FBQyxNQUFNLENBQUUsVUFBQSxDQUFDLElBQUksT0FBQSxDQUFDLENBQUMsQ0FBQyxFQUFILENBQUcsQ0FBRSxDQUFDLE1BQU0sQ0FBRSxVQUFBLENBQUMsSUFBSSxPQUFBLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBTixDQUFNLENBQUUsQ0FBQzt3QkFDckYsY0FBWSxZQUFZLENBQUMsR0FBRyxDQUFFLFVBQUEsQ0FBQyxJQUFJLE9BQUEsQ0FBQyxDQUFDLElBQUksQ0FBRSxDQUFDLENBQUUsRUFBWCxDQUFXLENBQUMsQ0FBQyxNQUFNLENBQUUsVUFBQSxDQUFDLElBQUksT0FBQSxDQUFDLENBQUMsQ0FBQyxFQUFILENBQUcsQ0FBRSxDQUFDLE1BQU0sQ0FBRSxVQUFBLENBQUMsSUFBSSxPQUFBLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFQLENBQU8sQ0FBRSxDQUFDO3dCQUc1RixhQUFnQixFQUFHLENBQUM7d0JBR3BCLGtCQUFxQixFQUFHLENBQUM7d0JBR3ZCLFNBQVMsR0FBRyxTQUFTLENBQUMsR0FBRyxDQUFFLFVBQUEsQ0FBQyxJQUFJLE9BQUEsQ0FBQyxDQUFDLElBQUksQ0FBRSxDQUFDLENBQUUsRUFBWCxDQUFXLENBQUMsQ0FBQyxNQUFNLENBQUUsVUFBQSxDQUFDLElBQUksT0FBQSxDQUFDLENBQUMsQ0FBQyxFQUFILENBQUcsQ0FBRSxDQUFDO3dCQUdoRSxVQUFVLEdBQUcsV0FBVyxDQUFDLEdBQUcsQ0FBRSxVQUFBLENBQUMsSUFBSSxPQUFBLENBQUMsQ0FBQyxJQUFJLENBQUUsQ0FBQyxDQUFFLEVBQVgsQ0FBVyxDQUFDLENBQUMsTUFBTSxDQUFFLFVBQUEsQ0FBQyxJQUFJLE9BQUEsQ0FBQyxDQUFDLENBQUMsRUFBSCxDQUFHLENBQUUsQ0FBQTt3QkFFeEUsS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFFLFVBQUEsQ0FBQzs0QkFFbEIsSUFBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRztnQ0FDWCxJQUFNLFFBQVEsR0FBRyxXQUFTLENBQUMsSUFBSSxDQUFFLFVBQUEsQ0FBQyxJQUFJLE9BQUEsQ0FBQyxDQUFDLEdBQUcsS0FBSyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxHQUFHLEtBQUssQ0FBQyxDQUFDLEdBQUcsRUFBbEMsQ0FBa0MsQ0FBRSxDQUFDO2dDQUMzRSxJQUFLLENBQUMsUUFBUSxFQUFHO29DQUNiLGVBQWEsQ0FBQyxJQUFJLENBQUUsQ0FBQyxDQUFFLENBQUM7aUNBQzNCO3FDQUFNLElBQUssUUFBUSxDQUFDLEtBQUssS0FBSyxTQUFTLElBQUssUUFBUSxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUMsS0FBSyxFQUFHO29DQUNwRSxVQUFRLENBQUMsSUFBSSxDQUFFLE1BQU0sQ0FBQyxNQUFNLENBQUMsRUFBRyxFQUFFLENBQUMsRUFBRTt3Q0FDakMsS0FBSyxFQUFFLFFBQVEsQ0FBQyxLQUFLO3dDQUNyQixRQUFRLEVBQUUsQ0FBQyxDQUFDLElBQUk7d0NBQ2hCLFdBQVcsRUFBRSxDQUFDLENBQUMsV0FBVztxQ0FDN0IsQ0FBQyxDQUFDLENBQUM7aUNBQ1A7NkJBRUo7aUNBQU07Z0NBQ0gsSUFBTSxJQUFJLEdBQUcsT0FBSyxDQUFDLElBQUksQ0FBRSxVQUFBLENBQUMsSUFBSSxPQUFBLENBQUMsQ0FBQyxHQUFHLEtBQUssQ0FBQyxDQUFDLEdBQUcsRUFBZixDQUFlLENBQUUsQ0FBQztnQ0FDaEQsSUFBSyxDQUFDLElBQUksSUFBSSxDQUFFLENBQUMsQ0FBQyxJQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFFLEVBQUU7b0NBQ3hDLGVBQWEsQ0FBQyxJQUFJLENBQUUsQ0FBQyxDQUFFLENBQUE7aUNBQzFCO3FDQUFNLElBQUssSUFBSSxDQUFDLEtBQUssS0FBSyxTQUFTLElBQUssSUFBSSxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUMsS0FBSyxFQUFHO29DQUM1RCxVQUFRLENBQUMsSUFBSSxDQUFFLE1BQU0sQ0FBQyxNQUFNLENBQUMsRUFBRyxFQUFFLENBQUMsRUFBRTt3Q0FDakMsS0FBSyxFQUFFLElBQUksQ0FBQyxLQUFLO3dDQUNqQixRQUFRLEVBQUUsQ0FBQyxDQUFDLElBQUk7cUNBQ25CLENBQUMsQ0FBQyxDQUFDO2lDQUNQOzZCQUVKO3dCQUNMLENBQUMsQ0FBQyxDQUFDO3dCQUVDLE1BQU0sR0FBRyxFQUFHLENBQUM7NkJBS1osQ0FBQSxVQUFRLENBQUMsTUFBTSxLQUFLLENBQUMsSUFBSSxTQUFTLENBQUMsTUFBTSxLQUFLLENBQUMsSUFBSSxlQUFhLENBQUMsTUFBTSxLQUFLLENBQUMsQ0FBQSxFQUE3RSxjQUE2RTt3QkFFeEUsT0FBTyxHQUFHOzRCQUNaLEdBQUcsS0FBQTs0QkFDSCxNQUFNLFFBQUE7NEJBQ04sSUFBSSxFQUFFLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxJQUFJLFFBQVE7NEJBQ2pDLE1BQU0sRUFBRSxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUk7eUJBQzFCLENBQUE7d0JBRW9CLFdBQU0sS0FBSyxDQUFDLFlBQVksQ0FBQztnQ0FDMUMsSUFBSSxFQUFFO29DQUNGLElBQUksRUFBRSxPQUFPO29DQUNiLElBQUksRUFBRSxRQUFRO2lDQUNqQjtnQ0FDRCxJQUFJLEVBQUUsT0FBTzs2QkFDaEIsQ0FBQyxFQUFBOzt3QkFOSSxZQUFZLEdBQUcsU0FNbkI7d0JBRUYsSUFBSyxZQUFZLENBQUMsTUFBTSxDQUFDLE1BQU0sS0FBSyxHQUFHLEVBQUc7NEJBQ3RDLFdBQU8sR0FBRyxDQUFDLElBQUksR0FBRztvQ0FDZCxNQUFNLEVBQUUsR0FBRztvQ0FDWCxPQUFPLEVBQUUsV0FBVztpQ0FDdkIsRUFBQzt5QkFDTDt3QkFDRCxNQUFNLEdBQUcsWUFBWSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUM7OzRCQUd0QyxXQUFPLEdBQUcsQ0FBQyxJQUFJLEdBQUc7NEJBQ2QsSUFBSSxFQUFFO2dDQUNGLFFBQVEsWUFBQTtnQ0FDUixhQUFhLGlCQUFBO2dDQUNiLFNBQVMsV0FBQTtnQ0FDVCxVQUFVLFlBQUE7Z0NBQ1YsTUFBTSxRQUFBOzZCQUNUOzRCQUNELE1BQU0sRUFBRSxHQUFHO3lCQUNkLEVBQUE7Ozt3QkFJRCxXQUFPLEdBQUcsQ0FBQyxJQUFJLEdBQUc7Z0NBQ2QsTUFBTSxFQUFFLEdBQUc7Z0NBQ1gsT0FBTyxFQUFFLEdBQUM7NkJBQ2IsRUFBQzs7OzthQUVULENBQUMsQ0FBQztRQWVILEdBQUcsQ0FBQyxNQUFNLENBQUMsUUFBUSxFQUFFLFVBQU8sR0FBRyxFQUFFLElBQUk7Ozs7Ozs7d0JBR3ZCLEtBQW1CLEtBQUssQ0FBQyxJQUFJLEVBQTNCLElBQUksVUFBQSxFQUFFLG9CQUFNLENBQWdCO3dCQUVwQyxXQUFNLE9BQU8sQ0FBQyxHQUFHLENBQUUsSUFBSSxDQUFDLEdBQUcsQ0FBRSxVQUFNLFNBQVM7Ozs7OzRDQUNoQyxHQUFHLEdBQTZDLFNBQVMsSUFBdEQsRUFBRSxHQUFHLEdBQXdDLFNBQVMsSUFBakQsRUFBRSxHQUFHLEdBQW1DLFNBQVMsSUFBNUMsRUFBRSxHQUFHLEdBQThCLFNBQVMsSUFBdkMsRUFBRSxLQUFLLEdBQXVCLFNBQVMsTUFBaEMsRUFBRSxVQUFVLEdBQVcsU0FBUyxXQUFwQixFQUFFLElBQUksR0FBSyxTQUFTLEtBQWQsQ0FBZTs0Q0FDOUQsS0FBSyxHQUFHO2dEQUNSLEdBQUcsS0FBQTtnREFDSCxHQUFHLEtBQUE7NkNBQ04sQ0FBQzs0Q0FFRixJQUFLLENBQUMsQ0FBQyxHQUFHLEVBQUc7Z0RBQ1QsS0FBSyxDQUFDLEtBQUssQ0FBQyxHQUFHLEdBQUcsQ0FBQzs2Q0FDdEI7NENBR0QsSUFBSyxDQUFDLENBQUMsSUFBSSxFQUFHO2dEQUNWLEtBQUssR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDLEVBQUcsRUFBRSxLQUFLLEVBQUU7b0RBQzlCLElBQUksTUFBQTtpREFDUCxDQUFDLENBQUM7NkNBQ047NENBRWEsV0FBTSxFQUFFLENBQUMsVUFBVSxDQUFDLGVBQWUsQ0FBQztxREFDN0MsS0FBSyxDQUFFLEtBQUssQ0FBRTtxREFDZCxHQUFHLEVBQUcsRUFBQTs7NENBRkwsS0FBSyxHQUFHLFNBRUg7aURBRU4sQ0FBQSxLQUFLLENBQUMsSUFBSSxDQUFDLE1BQU0sS0FBSyxDQUFDLENBQUEsRUFBdkIsY0FBdUI7NENBRWxCLElBQUksR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDLEVBQUcsRUFBRSxLQUFLLEVBQUM7Z0RBQ2xDLElBQUksRUFBRSxJQUFJLElBQUksU0FBUzs2Q0FDMUIsRUFBQztnREFDRSxJQUFJLEVBQUUsQ0FBRSxHQUFHLENBQUU7Z0RBQ2IsSUFBSSxFQUFFLENBQUUsUUFBTSxDQUFFO2dEQUNoQixRQUFRLEVBQUUsQ0FBQztnREFDWCxVQUFVLEVBQUUsR0FBRztnREFDZixXQUFXLEVBQUUsR0FBRztnREFDaEIsV0FBVyxFQUFFLEtBQUs7Z0RBQ2xCLGdCQUFnQixFQUFFLFVBQVU7Z0RBQzVCLFVBQVUsRUFBRSxJQUFJLElBQUksRUFBRyxDQUFDLE9BQU8sRUFBRzs2Q0FDckMsQ0FBQyxDQUFDOzRDQUVhLFdBQU0sRUFBRSxDQUFDLFVBQVUsQ0FBQyxlQUFlLENBQUM7cURBQy9DLEdBQUcsQ0FBQztvREFDRCxJQUFJLEVBQUUsSUFBSTtpREFDYixDQUFDLEVBQUE7OzRDQUhBLE9BQU8sR0FBRyxTQUdWOzRDQUVOLFdBQU87OzRDQUlILGdCQUFnQixHQUFHLEtBQUssQ0FBQyxJQUFJLENBQUUsQ0FBQyxDQUFFLENBQUM7aURBQ2xDLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBRSxVQUFBLENBQUMsSUFBSSxPQUFBLENBQUMsS0FBSyxHQUFHLEVBQVQsQ0FBUyxDQUFFLEVBQTdDLGNBQTZDOzRDQUN4QyxRQUFRLEdBQUcsZ0JBQWdCLENBQUMsSUFBSSxDQUFDOzRDQUNqQyxRQUFRLEdBQUcsZ0JBQWdCLENBQUMsSUFBSSxDQUFDOzRDQUd2QyxRQUFRLENBQUMsT0FBTyxDQUFFLEdBQUcsQ0FBRSxDQUFDOzRDQUV4QixJQUFLLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBRSxVQUFBLENBQUMsSUFBSSxPQUFBLENBQUMsS0FBSyxRQUFNLEVBQVosQ0FBWSxDQUFFLEVBQUU7Z0RBQ3RDLFFBQVEsQ0FBQyxPQUFPLENBQUUsUUFBTSxDQUFFLENBQUM7NkNBQzlCOzRDQUVlLFdBQU0sRUFBRSxDQUFDLFVBQVUsQ0FBQyxlQUFlLENBQUMsQ0FBQyxHQUFHLENBQUUsTUFBTSxDQUFFLEtBQUssQ0FBQyxJQUFJLENBQUUsQ0FBQyxDQUFFLENBQUMsR0FBRyxDQUFFLENBQUM7cURBQ25GLE1BQU0sQ0FBQztvREFDSixJQUFJLEVBQUU7d0RBQ0YsSUFBSSxFQUFFLFFBQVE7d0RBQ2QsSUFBSSxFQUFFLFFBQVE7d0RBQ2QsVUFBVSxFQUFFLElBQUksSUFBSSxFQUFHLENBQUMsT0FBTyxFQUFHO3FEQUNyQztpREFDSixDQUFDLEVBQUE7OzRDQVBBLE9BQU8sR0FBRyxTQU9WOztnREFFVixXQUFPOzs7aUNBR2QsQ0FBQyxDQUFDLEVBQUE7O3dCQXRFSCxTQXNFRyxDQUFDO3dCQUVKLFdBQU8sR0FBRyxDQUFDLElBQUksR0FBRztnQ0FDZCxNQUFNLEVBQUUsR0FBRzs2QkFDZCxFQUFBOzs7d0JBRVcsV0FBTyxHQUFHLENBQUMsSUFBSSxHQUFHLEVBQUUsTUFBTSxFQUFFLEdBQUcsRUFBRSxFQUFBOzs7O2FBQ3BELENBQUMsQ0FBQztRQVVILEdBQUcsQ0FBQyxNQUFNLENBQUMsTUFBTSxFQUFFLFVBQU8sR0FBRyxFQUFFLElBQUk7Ozs7Ozs7d0JBR3ZCLFlBQWUsRUFBRyxDQUFDO3dCQUVqQixLQUF3QixLQUFLLENBQUMsSUFBSSxFQUFoQyxHQUFHLFNBQUEsRUFBRSw0QkFBVSxDQUFrQjt3QkFDbkMsTUFBTSxHQUFHLEtBQUssQ0FBQyxJQUFJLENBQUMsTUFBTSxJQUFJLEtBQUssQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDO3dCQUkzQyxXQUFNLEVBQUUsQ0FBQyxVQUFVLENBQUMsZUFBZSxDQUFDO2lDQUM5QyxLQUFLLENBQUM7Z0NBQ0gsR0FBRyxLQUFBOzZCQUNOLENBQUM7aUNBQ0QsR0FBRyxFQUFHLEVBQUE7O3dCQUpMLE1BQU0sR0FBRyxTQUlKOzZCQUdOLENBQUEsWUFBVSxLQUFLLEtBQUssQ0FBQSxFQUFwQixjQUFvQjt3QkFDWCxXQUFNLE9BQU8sQ0FBQyxHQUFHLENBQUUsTUFBTSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUUsVUFBQSxJQUFJO2dDQUM5QyxPQUFPLE9BQU8sQ0FBQyxHQUFHLENBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUUsVUFBTSxHQUFHOzs7O29EQUV6QixXQUFNLEVBQUUsQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLENBQUMsR0FBRyxDQUFFLEdBQUcsQ0FBRTtxREFDakQsR0FBRyxFQUFHLEVBQUE7O2dEQURMLE1BQU0sR0FBRyxTQUNKO2dEQUVHLFdBQU0sRUFBRSxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUM7eURBQ3BDLEtBQUssQ0FBQzt3REFDSCxNQUFNLEVBQUUsTUFBTSxDQUFDLElBQUksQ0FBQyxNQUFNO3FEQUM3QixDQUFDO3lEQUNELEdBQUcsRUFBRyxFQUFBOztnREFKTCxLQUFLLEdBQUcsU0FJSDtnREFFWCxXQUFPLE1BQU0sQ0FBQyxNQUFNLENBQUMsRUFBRyxFQUFFLE1BQU0sQ0FBQyxJQUFJLEVBQUU7d0RBQ25DLElBQUksRUFBRSxLQUFLLENBQUMsSUFBSSxDQUFFLENBQUMsQ0FBRTtxREFDeEIsQ0FBQyxFQUFDOzs7cUNBQ04sQ0FBQyxDQUFDLENBQUM7NEJBQ1IsQ0FBQyxDQUFDLENBQUMsRUFBQTs7d0JBaEJILFNBQU8sR0FBRyxTQWdCUCxDQUFDOzs0QkFJWSxXQUFNLE9BQU8sQ0FBQyxHQUFHLENBQUUsTUFBTSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUUsVUFBTSxJQUFJOzs7Ozt3Q0FFdEQsR0FBRyxHQUFVLElBQUksSUFBZCxFQUFFLEdBQUcsR0FBSyxJQUFJLElBQVQsQ0FBVTt3Q0FDcEIsY0FBYyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDO3dDQUdqRCxRQUFRLEdBQVEsSUFBSSxDQUFDO3dDQUdYLFdBQU0sRUFBRSxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUM7aURBQ3JDLEdBQUcsQ0FBRSxHQUFHLENBQUU7aURBQ1YsR0FBRyxFQUFHLEVBQUE7O3dDQUZMLEtBQUssR0FBRyxTQUVIOzZDQUVOLENBQUMsQ0FBQyxHQUFHLEVBQUwsY0FBSzt3Q0FDSyxXQUFNLEVBQUUsQ0FBQyxVQUFVLENBQUMsV0FBVyxDQUFDO2lEQUN0QyxHQUFHLENBQUUsR0FBRyxDQUFFO2lEQUNWLEdBQUcsRUFBRyxFQUFBOzt3Q0FGWCxRQUFRLEdBQUcsU0FFQSxDQUFDOzs0Q0FHaEIsV0FBTzs0Q0FDSCxHQUFHLEVBQUUsS0FBSyxDQUFDLElBQUksQ0FBQyxHQUFHOzRDQUNuQixLQUFLLEVBQUUsS0FBSyxDQUFDLElBQUksQ0FBQyxLQUFLOzRDQUN2QixJQUFJLEVBQUUsUUFBUSxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRTs0Q0FDeEMsS0FBSyxFQUFFLFFBQVEsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsS0FBSzs0Q0FDeEQsR0FBRyxFQUFFLFFBQVEsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFFLENBQUMsQ0FBRTs0Q0FDdkQsVUFBVSxFQUFFLFFBQVEsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsVUFBVTt5Q0FDMUUsRUFBQTs7OzZCQUNKLENBQUMsQ0FBQyxFQUFBOzt3QkEzQkcsV0FBYyxTQTJCakI7d0JBR3NCLFdBQU0sT0FBTyxDQUFDLEdBQUcsQ0FBRSxNQUFNLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBRSxVQUFNLElBQUk7Ozs7OzRDQUMzRCxJQUFJLEdBQUssSUFBSSxLQUFULENBQVU7aURBQ2pCLENBQUMsSUFBSSxFQUFMLGNBQUs7NENBQ04sV0FBTztvREFDSCxRQUFRLEVBQUUsSUFBSTtvREFDZCxhQUFhLEVBQUUsSUFBSTtpREFDdEIsRUFBQTtnREFFWSxXQUFNLEVBQUUsQ0FBQyxVQUFVLENBQUMsVUFBVSxDQUFDO2lEQUN2QyxHQUFHLENBQUUsTUFBTSxDQUFFLElBQUksQ0FBRSxDQUFDO2lEQUNwQixHQUFHLEVBQUcsRUFBQTs7NENBRkwsSUFBSSxHQUFHLFNBRUY7NENBQ1gsV0FBTztvREFDSCxRQUFRLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRO29EQUM1QixhQUFhLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxhQUFhO2lEQUN6QyxFQUFBOzs7aUNBRVIsQ0FBQyxDQUFDLEVBQUE7O3dCQWhCRyxnQkFBbUIsU0FnQnRCO3dCQUVHLElBQUksR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxVQUFFLENBQUMsRUFBRSxDQUFDOzRCQUN6QixJQUFBLHFCQUE4QyxFQUE1QyxnQ0FBYSxFQUFFLHNCQUE2QixDQUFDOzRCQUMvQyxJQUFBLGdCQUEwRCxFQUF4RCxZQUFHLEVBQUUsZ0JBQUssRUFBRSwwQkFBVSxFQUFFLGdCQUFLLEVBQUUsY0FBSSxFQUFFLFlBQW1CLENBQUM7NEJBQ2pFLElBQUksSUFBSSxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUMsRUFBRyxFQUFFLENBQUMsRUFBRTtnQ0FDN0IsR0FBRyxLQUFBO2dDQUNILEdBQUcsS0FBQTtnQ0FDSCxLQUFLLE9BQUE7Z0NBQ0wsVUFBVSxZQUFBO2dDQUNWLFFBQVEsRUFBRSxLQUFLO2dDQUNmLFdBQVcsRUFBRSxJQUFJO2dDQUNqQixhQUFhLGVBQUE7Z0NBQ2IsUUFBUSxVQUFBOzZCQUNYLENBQUMsQ0FBQzs0QkFFSCxJQUFLLFlBQVUsS0FBSyxLQUFLLEVBQUc7Z0NBQ3hCLElBQUksR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDLEVBQUcsRUFBRSxJQUFJLEVBQUU7b0NBQzVCLEtBQUssRUFBRSxTQUFPLENBQUUsQ0FBQyxDQUFFO29DQUNuQixLQUFLLEVBQUUsU0FBTyxDQUFFLENBQUMsQ0FBRSxDQUFDLE1BQU0sQ0FBQyxVQUFFLENBQUMsRUFBRSxDQUFDO3dDQUM3QixPQUFPLENBQUMsR0FBRyxDQUFDLENBQUMsS0FBSyxDQUFDO29DQUN2QixDQUFDLEVBQUUsQ0FBQyxDQUFFO2lDQUNULENBQUMsQ0FBQTs2QkFDTDs0QkFFRCxPQUFPLElBQUksQ0FBQzt3QkFDaEIsQ0FBQyxDQUFDLENBQUM7d0JBRUgsV0FBTyxHQUFHLENBQUMsSUFBSSxHQUFHO2dDQUNkLE1BQU0sRUFBRSxHQUFHO2dDQUNYLElBQUksRUFBRSxJQUFJOzZCQUNiLEVBQUE7Ozt3QkFFVyxXQUFPLEdBQUcsQ0FBQyxJQUFJLEdBQUcsRUFBRSxNQUFNLEVBQUUsR0FBRyxFQUFFLEVBQUM7Ozs7YUFDckQsQ0FBQyxDQUFBO1FBU0YsR0FBRyxDQUFDLE1BQU0sQ0FBQyxRQUFRLEVBQUUsVUFBTyxHQUFHLEVBQUUsSUFBSTs7Ozs7Ozt3QkFHdkIsS0FBZ0QsS0FBSyxDQUFDLElBQUksRUFBeEQsVUFBVSxnQkFBQSxFQUFFLDhCQUFXLEVBQUUsd0NBQWdCLENBQWdCO3dCQU0vQyxXQUFNLEVBQUUsQ0FBQyxVQUFVLENBQUMsZUFBZSxDQUFDO2lDQUNqRCxHQUFHLENBQUUsVUFBVSxDQUFFO2lDQUNqQixHQUFHLEVBQUcsRUFBQTs7d0JBRkwsU0FBUyxHQUFHLFNBRVA7d0JBRVgsT0FBTyxDQUFDLEdBQUcsQ0FBQyxRQUFRLEVBQUUsU0FBUyxDQUFFLENBQUM7d0JBRWxCLFdBQU0sT0FBTyxDQUFDLEdBQUcsQ0FBRSxTQUFTLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUUsVUFBQSxHQUFHO2dDQUMzRCxPQUFPLEVBQUUsQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDO3FDQUN4QixHQUFHLENBQUUsR0FBRyxDQUFFO3FDQUNWLEdBQUcsRUFBRyxDQUFDOzRCQUNoQixDQUFDLENBQUMsQ0FBQyxFQUFBOzt3QkFKRyxPQUFPLEdBQUcsU0FJYjt3QkFFSCxPQUFPLENBQUMsR0FBRyxDQUFDLFNBQVMsRUFBRSxPQUFPLENBQUUsQ0FBQzt3QkFHN0Isa0JBQWdCLENBQUMsQ0FBQzt3QkFLbEIsYUFBVyxLQUFLLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQzt3QkFLN0Isa0JBQWtCLEdBQUcsT0FBTzs2QkFDN0IsR0FBRyxDQUFDLFVBQUUsQ0FBTSxJQUFNLE9BQUEsQ0FBQyxDQUFDLElBQUksRUFBTixDQUFNLENBQUU7NkJBQzFCLE1BQU0sQ0FBRSxVQUFBLENBQUMsSUFBSSxPQUFBLENBQUMsQ0FBQyxXQUFXLEtBQUssR0FBRyxFQUFyQixDQUFxQixDQUFFLENBQUM7d0JBRTFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsUUFBUSxFQUFFLGtCQUFrQixDQUFDLENBQUM7d0JBR3BDLGFBQWEsR0FBRyxrQkFBa0IsQ0FBQyxNQUFNLENBQUMsVUFBRSxDQUFDLEVBQUUsQ0FBQzs0QkFDbEQsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDLGNBQWMsQ0FBQzt3QkFDaEMsQ0FBQyxFQUFFLENBQUMsQ0FBRSxDQUFDO3dCQUVQLE9BQU8sQ0FBQyxHQUFHLENBQUMsUUFBUSxFQUFFLGFBQWEsQ0FBRSxDQUFDO3dCQUV0QyxJQUFLLFVBQVEsR0FBRyxhQUFhLEVBQUc7NEJBQzVCLFdBQU8sR0FBRyxDQUFDLElBQUksR0FBRztvQ0FDZCxNQUFNLEVBQUUsR0FBRztvQ0FDWCxPQUFPLEVBQUUsV0FBSSxrQkFBa0IsQ0FBQyxNQUFNLHNGQUFnQixhQUFhLFdBQUc7aUNBQ3pFLEVBQUE7eUJBQ0o7d0JBRUcsWUFBWSxHQUFHLE9BQU8sQ0FBQyxNQUFNLENBQUMsVUFBRSxDQUFDLEVBQUUsQ0FBQzs0QkFDcEMsT0FBTyxDQUFDLEdBQUksQ0FBUyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUM7d0JBQ3JDLENBQUMsRUFBRSxDQUFDLENBQUUsQ0FBQzt3QkFFRCxJQUFJLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQyxFQUFHLEVBQUUsU0FBUyxDQUFDLElBQUksRUFBRTs0QkFDNUMsUUFBUSxZQUFBOzRCQUNSLFdBQVcsZUFBQTs0QkFDWCxnQkFBZ0Isb0JBQUE7NEJBQ2hCLFdBQVcsRUFBRSxHQUFHOzRCQUNoQixVQUFVLEVBQUUsVUFBUSxHQUFHLFlBQVksQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHOzRCQUMvQyxVQUFVLEVBQUUsSUFBSSxJQUFJLEVBQUcsQ0FBQyxPQUFPLEVBQUc7eUJBQ3JDLENBQUMsQ0FBQzt3QkFFSCxPQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQzt3QkFFbkIsT0FBTyxDQUFDLEdBQUcsQ0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLENBQUE7d0JBRzNCLFdBQU0sRUFBRSxDQUFDLFVBQVUsQ0FBQyxlQUFlLENBQUM7aUNBQy9CLEdBQUcsQ0FBRSxVQUFVLENBQUU7aUNBQ2pCLEdBQUcsQ0FBQztnQ0FDRCxJQUFJLEVBQUUsSUFBSTs2QkFDYixDQUFDLEVBQUE7O3dCQUpOLFNBSU0sQ0FBQzt3QkFRRCxZQUFZLEdBQUcsT0FBTzs2QkFDdkIsR0FBRyxDQUFDLFVBQUUsQ0FBTSxJQUFNLE9BQUEsQ0FBQyxDQUFDLElBQUksRUFBTixDQUFNLENBQUU7NkJBQzFCLE1BQU0sQ0FBQyxVQUFFLENBQU0sSUFBTSxPQUFBLENBQUMsQ0FBQyxXQUFXLEtBQUssR0FBRyxJQUFJLENBQUMsQ0FBQyxXQUFXLEtBQUssR0FBRyxFQUE5QyxDQUE4QyxDQUFFOzZCQUNyRSxJQUFJLENBQUMsVUFBRSxDQUFNLEVBQUUsQ0FBTSxJQUFNLE9BQUEsQ0FBQyxDQUFDLFVBQVUsR0FBRyxDQUFDLENBQUMsVUFBVSxFQUEzQixDQUEyQixDQUFFLENBQUM7d0JBRTlELE9BQU8sQ0FBQyxHQUFHLENBQUMsUUFBUSxFQUFFLFlBQVksQ0FBRSxDQUFDO3dCQUdyQyxVQUFRLElBQUksYUFBYSxDQUFDO3dCQUUxQixPQUFPLENBQUMsR0FBRyxDQUFFLEtBQUssRUFBRSxVQUFRLENBQUUsQ0FBQzt3QkFFL0IsV0FBTSxPQUFPLENBQUMsR0FBRyxDQUFFLFlBQVksQ0FBQyxHQUFHLENBQUUsVUFBTSxLQUFLOzs7Ozs0Q0FFdEMsUUFBUSxHQUFHO2dEQUNiLGNBQWMsRUFBRSxhQUFXO2dEQUMzQixtQkFBbUIsRUFBRSxrQkFBZ0I7Z0RBRXJDLFdBQVcsRUFBRSxHQUFHO2dEQU1oQixjQUFjLEVBQUUsVUFBUSxHQUFHLEtBQUssQ0FBQyxLQUFLLElBQUksQ0FBQyxDQUFDLENBQUM7b0RBQ3pDLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQztvREFDYixVQUFROzZDQUNmLENBQUM7NENBR0YsSUFBSyxVQUFRLEdBQUcsS0FBSyxDQUFDLEtBQUssSUFBSSxDQUFDLEVBQUc7Z0RBQy9CLGVBQWEsR0FBRyxVQUFRLEdBQUcsS0FBSyxDQUFDLEtBQUssQ0FBQztnREFDdkMsVUFBUSxJQUFJLEtBQUssQ0FBQyxLQUFLLENBQUM7NkNBRzNCO2lEQUFNO2dEQUNILGVBQWEsR0FBRyxDQUFDLENBQUM7Z0RBQ2xCLFVBQVEsR0FBRyxDQUFDLENBQUM7NkNBQ2hCOzRDQUVLLElBQUksR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDLEVBQUcsRUFBRSxLQUFLLEVBQUUsUUFBUSxDQUFFLENBQUM7NENBRWxELE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDOzRDQUVuQixXQUFNLEVBQUUsQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDO3FEQUN2QixHQUFHLENBQUUsS0FBSyxDQUFDLEdBQUcsQ0FBRTtxREFDaEIsR0FBRyxDQUFDO29EQUNELElBQUksRUFBRSxJQUFJO2lEQUNiLENBQUMsRUFBQTs7NENBSk4sU0FJTSxDQUFDOzRDQUVQLFdBQU87OztpQ0FFVixDQUFDLENBQUMsRUFBQTs7d0JBeENILFNBd0NHLENBQUM7d0JBR0osV0FBTSxFQUFFLENBQUMsVUFBVSxDQUFDLGVBQWUsQ0FBQztpQ0FDL0IsR0FBRyxDQUFFLFVBQVUsQ0FBRTtpQ0FDakIsTUFBTSxDQUFDO2dDQUNKLElBQUksRUFBRSxFQUFFLGFBQWEsaUJBQUEsRUFBRTs2QkFDMUIsQ0FBQyxFQUFBOzt3QkFKTixTQUlNLENBQUM7d0JBRVAsV0FBTyxHQUFHLENBQUMsSUFBSSxHQUFHO2dDQUNkLE1BQU0sRUFBRSxHQUFHOzZCQUNkLEVBQUE7Ozt3QkFFVyxXQUFPLEdBQUcsQ0FBQyxJQUFJLEdBQUcsRUFBRSxNQUFNLEVBQUUsR0FBRyxFQUFFLEVBQUM7Ozs7YUFDckQsQ0FBQyxDQUFBO1FBTUYsR0FBRyxDQUFDLE1BQU0sQ0FBQyxlQUFlLEVBQUUsVUFBTyxHQUFHLEVBQUUsSUFBSTs7Ozs7O3dCQUU1QixHQUFHLEdBQUssS0FBSyxDQUFDLElBQUksSUFBZixDQUFnQjt3QkFDYixXQUFNLEVBQUUsQ0FBQyxVQUFVLENBQUMsZUFBZSxDQUFDO2lDQUM3QyxLQUFLLENBQUM7Z0NBQ0gsR0FBRyxLQUFBO2dDQUNILFdBQVcsRUFBRSxHQUFHOzZCQUNuQixDQUFDO2lDQUNELEtBQUssRUFBRyxFQUFBOzt3QkFMUCxLQUFLLEdBQUcsU0FLRDt3QkFFYixXQUFPLEdBQUcsQ0FBQyxJQUFJLEdBQUc7Z0NBQ2QsTUFBTSxFQUFFLEdBQUc7Z0NBQ1gsSUFBSSxFQUFFLEtBQUssQ0FBQyxLQUFLOzZCQUNwQixFQUFBOzs7d0JBR0QsV0FBTyxHQUFHLENBQUMsSUFBSSxHQUFHLEVBQUUsTUFBTSxFQUFFLEdBQUcsRUFBRSxFQUFDOzs7O2FBRXpDLENBQUMsQ0FBQTtRQWNGLEdBQUcsQ0FBQyxNQUFNLENBQUMsS0FBSyxFQUFFLFVBQU8sR0FBRyxFQUFFLElBQUk7Ozs7Ozt3QkFHcEIsTUFBTSxHQUFHLEtBQUssQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDO3dCQUMvQixLQUFvQyxLQUFLLENBQUMsSUFBSSxFQUE1QyxHQUFHLFNBQUEsRUFBRSxNQUFNLFlBQUEsRUFBRSxHQUFHLFNBQUEsRUFBRSxnQkFBSSxFQUFFLEtBQUssV0FBQSxDQUFnQjt3QkFDL0MsUUFBUSxHQUFHLEtBQUssQ0FBQyxJQUFJLENBQUMsUUFBUSxJQUFJLEtBQUssQ0FBQzt3QkFFeEMsS0FBSyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUM7NEJBQ2hCLEdBQUcsS0FBQTs0QkFDSCxHQUFHLEtBQUE7eUJBQ04sQ0FBQyxDQUFDLENBQUM7NEJBQ0EsR0FBRyxLQUFBO3lCQUNOLENBQUM7d0JBRUUsU0FBUyxTQUFBLENBQUM7NkJBQ1QsS0FBSyxFQUFMLGNBQUs7d0JBQ00sV0FBTSxFQUFFLENBQUMsVUFBVSxDQUFDLGVBQWUsQ0FBQztpQ0FDM0MsS0FBSyxDQUFFLEtBQUssQ0FBRTtpQ0FDZCxLQUFLLENBQUUsS0FBSyxDQUFFO2lDQUNkLEdBQUcsRUFBRyxFQUFBOzt3QkFIWCxTQUFTLEdBQUcsU0FHRCxDQUFDOzs0QkFFQSxXQUFNLEVBQUUsQ0FBQyxVQUFVLENBQUMsZUFBZSxDQUFDOzZCQUMzQyxLQUFLLENBQUUsS0FBSyxDQUFFOzZCQUNkLEdBQUcsRUFBRyxFQUFBOzt3QkFGWCxTQUFTLEdBQUcsU0FFRCxDQUFDOzs7d0JBTVosSUFBSSxHQUFRLEVBQUcsQ0FBQzt3QkFDaEIsS0FBSyxHQUFHLFNBQVMsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFFLFVBQUEsQ0FBQzs0QkFDaEMsSUFBSyxNQUFJLEtBQUssS0FBSyxFQUFHO2dDQUNsQixPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsZ0JBQWdCLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDOzZCQUVwRDtpQ0FBTSxJQUFLLE1BQUksS0FBSyxNQUFNLEVBQUc7Z0NBRTFCLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxnQkFBZ0IsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sS0FBSyxDQUFDLENBQUM7NkJBRXREO2lDQUFNO2dDQUdILE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxnQkFBZ0IsQ0FBQzs2QkFDL0I7d0JBQ0wsQ0FBQyxDQUFDLENBQUM7d0JBRUgsS0FBSyxHQUFHLEtBQUssQ0FBQyxJQUFJLENBQUMsVUFBRSxDQUFDLEVBQUUsQ0FBQyxJQUFNLE9BQUEsQ0FBQyxDQUFDLElBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQTdCLENBQTZCLENBQUUsQ0FBQzt3QkFDL0QsSUFBSSxHQUFHLEtBQUssQ0FBQzs2QkFHUixDQUFBLE1BQU0sS0FBSyxTQUFTLElBQUksQ0FBQyxDQUFDLE1BQU0sQ0FBQSxFQUFoQyxjQUFnQzt3QkFHM0IsT0FBTyxHQUFHLEtBQUssQ0FBQyxJQUFJLENBQ3RCLElBQUksR0FBRyxDQUFFLEtBQUssQ0FBQyxHQUFHLENBQUUsVUFBQSxJQUFJOzRCQUNwQixPQUFBLElBQUksQ0FBQyxHQUFHO3dCQUFSLENBQVEsQ0FDWCxDQUFDLENBQ0wsQ0FBQzt3QkFHSSxXQUFXLEdBQUcsS0FBSyxDQUFDLElBQUksQ0FDMUIsSUFBSSxHQUFHLENBQUUsS0FBSyxDQUFDLEdBQUcsQ0FBRSxVQUFBLElBQUk7NEJBQ3BCLE9BQUEsSUFBSSxDQUFDLEdBQUc7d0JBQVIsQ0FBUSxDQUNYLENBQUMsQ0FDTCxDQUFDLE1BQU0sQ0FBRSxVQUFBLENBQUMsSUFBSSxPQUFBLENBQUMsQ0FBQyxDQUFDLEVBQUgsQ0FBRyxDQUFFLENBQUM7d0JBR0EsV0FBTSxPQUFPLENBQUMsR0FBRyxDQUFFLE9BQU8sQ0FBQyxHQUFHLENBQUUsVUFBQSxNQUFNO2dDQUN2RCxPQUFPLEVBQUUsQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDO3FDQUN4QixHQUFHLENBQUUsTUFBTSxDQUFFO3FDQUNiLEdBQUcsRUFBRyxDQUFDOzRCQUNoQixDQUFDLENBQUMsQ0FBQyxFQUFBOzt3QkFKQyxjQUFpQixTQUlsQjt3QkFFSCxXQUFTLEdBQUcsV0FBUyxDQUFDLEdBQUcsQ0FBRSxVQUFBLENBQUMsSUFBSSxPQUFBLENBQUMsQ0FBQyxJQUFJLEVBQU4sQ0FBTSxDQUFFLENBQUM7d0JBR2pCLFdBQU0sT0FBTyxDQUFDLEdBQUcsQ0FBRSxXQUFXLENBQUMsR0FBRyxDQUFFLFVBQUEsR0FBRztnQ0FDM0QsT0FBTyxFQUFFLENBQUMsVUFBVSxDQUFDLFdBQVcsQ0FBQztxQ0FDNUIsR0FBRyxDQUFFLEdBQUcsQ0FBRTtxQ0FDVixHQUFHLEVBQUcsQ0FBQzs0QkFDaEIsQ0FBQyxDQUFDLENBQUMsRUFBQTs7d0JBSkMsaUJBQW9CLFNBSXJCO3dCQUVILGNBQVksR0FBRyxjQUFZLENBQUMsR0FBRyxDQUFFLFVBQUEsQ0FBQyxJQUFJLE9BQUEsQ0FBQyxDQUFDLElBQUksRUFBTixDQUFNLENBQUUsQ0FBQzt3QkFFekMsVUFBUSxLQUFLLENBQUMsR0FBRyxDQUFFLFVBQUEsSUFBSTs0QkFFakIsSUFBQSxjQUFHLEVBQUUsY0FBRyxDQUFVOzRCQUMxQixJQUFNLElBQUksR0FBUSxXQUFTLENBQUMsSUFBSSxDQUFFLFVBQUEsQ0FBQyxJQUFJLE9BQUEsQ0FBQyxDQUFDLEdBQUcsS0FBSyxHQUFHLEVBQWIsQ0FBYSxDQUFFLENBQUM7NEJBQ3ZELElBQU0sT0FBTyxHQUFHLGNBQVksQ0FBQyxJQUFJLENBQUUsVUFBQSxDQUFDLElBQUksT0FBQSxDQUFDLENBQUMsR0FBRyxLQUFLLEdBQUcsRUFBYixDQUFhLENBQUUsQ0FBQzs0QkFFeEQsT0FBTztnQ0FDSCxJQUFJLE1BQUE7Z0NBQ0osR0FBRyxFQUFFLElBQUksQ0FBQyxHQUFHO2dDQUNiLEtBQUssRUFBRSxJQUFJLENBQUMsS0FBSztnQ0FDakIsS0FBSyxFQUFFLElBQUksQ0FBQyxLQUFLO2dDQUNqQixJQUFJLEVBQUUsT0FBTyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFO2dDQUNqQyxLQUFLLEVBQUUsT0FBTyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSztnQ0FDM0MsR0FBRyxFQUFFLE9BQU8sQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBRSxDQUFDLENBQUU7Z0NBQzFDLFVBQVUsRUFBRSxPQUFPLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFVOzZCQUM3RCxDQUFBO3dCQUNMLENBQUMsQ0FBQyxDQUFDO3dCQUdILElBQUksR0FBRyxLQUFLLENBQUMsR0FBRyxDQUFDLFVBQUUsUUFBUSxFQUFFLENBQUM7NEJBQzFCLE9BQU8sTUFBTSxDQUFDLE1BQU0sQ0FBQyxFQUFHLEVBQUUsUUFBUSxFQUFFO2dDQUNoQyxNQUFNLEVBQUUsT0FBSyxDQUFFLENBQUMsQ0FBRTs2QkFDckIsQ0FBQyxDQUFBO3dCQUNOLENBQUMsQ0FBQyxDQUFDOzs7NkJBSUYsUUFBUSxFQUFSLGNBQVE7d0JBRUwsU0FBa0IsRUFBRyxDQUFDO3dCQUMxQixLQUFLLENBQUMsR0FBRyxDQUFFLFVBQUEsSUFBSTs0QkFDWCxNQUFJLEdBQVEsTUFBSSxRQUFLLElBQUksQ0FBQyxJQUFJLENBQUUsQ0FBQzt3QkFDckMsQ0FBQyxDQUFDLENBQUM7d0JBRUgsTUFBSSxHQUFHLEtBQUssQ0FBQyxJQUFJLENBQ2IsSUFBSSxHQUFHLENBQUUsTUFBSSxDQUFFLENBQ2xCLENBQUM7d0JBRWdCLFdBQU0sT0FBTyxDQUFDLEdBQUcsQ0FBRSxNQUFJLENBQUMsR0FBRyxDQUFFLFVBQUEsR0FBRztnQ0FDOUMsT0FBTyxFQUFFLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQztxQ0FDdkIsS0FBSyxDQUFDO29DQUNILE1BQU0sRUFBRSxHQUFHO2lDQUNkLENBQUM7cUNBQ0QsS0FBSyxDQUFDO29DQUNILE1BQU0sRUFBRSxJQUFJO29DQUNaLFNBQVMsRUFBRSxJQUFJO29DQUNmLFFBQVEsRUFBRSxJQUFJO2lDQUNqQixDQUFDO3FDQUNELEdBQUcsRUFBRyxDQUFDOzRCQUNoQixDQUFDLENBQUMsQ0FBQyxFQUFBOzt3QkFYQyxXQUFjLFNBV2Y7d0JBRUgsUUFBTSxHQUFHLFFBQU0sQ0FBQyxHQUFHLENBQUUsVUFBQSxDQUFDLElBQUksT0FBQSxDQUFDLENBQUMsSUFBSSxDQUFFLENBQUMsQ0FBRSxFQUFYLENBQVcsQ0FBQyxDQUFDO3dCQUV2QyxJQUFJLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxVQUFFLFFBQVEsRUFBRSxDQUFDOzRCQUN6QixPQUFPLE1BQU0sQ0FBQyxNQUFNLENBQUMsRUFBRyxFQUFFLFFBQVEsRUFBRTtnQ0FDaEMsS0FBSyxFQUFFLFFBQVEsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFFLFVBQUEsR0FBRyxJQUFJLE9BQUEsUUFBTSxDQUFDLElBQUksQ0FBRSxVQUFBLENBQUMsSUFBSSxPQUFBLENBQUMsQ0FBQyxNQUFNLEtBQUssR0FBRyxFQUFoQixDQUFnQixDQUFFLEVBQXBDLENBQW9DLENBQUM7NkJBQ3pFLENBQUMsQ0FBQTt3QkFDTixDQUFDLENBQUMsQ0FBQzs7NEJBSVAsV0FBTyxHQUFHLENBQUMsSUFBSSxHQUFHOzRCQUNkLElBQUksTUFBQTs0QkFDSixNQUFNLEVBQUUsR0FBRzt5QkFDZCxFQUFBOzs7d0JBR0QsV0FBTyxHQUFHLENBQUMsSUFBSSxHQUFHLEVBQUUsTUFBTSxFQUFFLEdBQUcsRUFBRSxFQUFDOzs7O2FBRXpDLENBQUMsQ0FBQztRQU1ILEdBQUcsQ0FBQyxNQUFNLENBQUMsb0JBQW9CLEVBQUUsVUFBTyxHQUFHLEVBQUUsSUFBSTs7Ozs7O3dCQUdqQyxRQUFRLEtBQUssQ0FBQyxJQUFJLElBQWYsQ0FBZ0I7d0JBQ3JCLEtBQUssR0FBRyxLQUFLLENBQUMsSUFBSSxDQUFDLEtBQUssSUFBSSxDQUFDLENBQUM7d0JBR2QsV0FBTSxFQUFFLENBQUMsVUFBVSxDQUFDLGVBQWUsQ0FBQztpQ0FDckQsS0FBSyxDQUFDO2dDQUNILEdBQUcsT0FBQTs2QkFDTixDQUFDO2lDQUNELEdBQUcsRUFBRyxFQUFBOzt3QkFKTCxhQUFhLEdBQUcsU0FJWDt3QkFJUCxTQUFZLEVBQUcsQ0FBQzt3QkFDcEIsYUFBYSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUUsVUFBQSxFQUFFOzRCQUN0QixNQUFJLEdBQVEsTUFBSSxRQUFLLEVBQUUsQ0FBQyxJQUFJLENBQUUsQ0FBQzt3QkFDbkMsQ0FBQyxDQUFDLENBQUM7d0JBS0MsZ0JBRUEsRUFBRyxDQUFDO3dCQUNSLE1BQUksQ0FBQyxHQUFHLENBQUUsVUFBQSxTQUFTOzs0QkFDZixJQUFLLENBQUMsYUFBVyxDQUFFLFNBQVMsQ0FBRSxFQUFFO2dDQUM1QixhQUFXLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQyxFQUFHLEVBQUUsYUFBVztvQ0FDeEMsR0FBRSxTQUFTLElBQUksQ0FBQzt3Q0FDbEIsQ0FBQTs2QkFDTDtpQ0FBTTtnQ0FDSCxhQUFXLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQyxFQUFHLEVBQUUsYUFBVztvQ0FDeEMsR0FBRSxTQUFTLElBQUksYUFBVyxDQUFFLFNBQVMsQ0FBRSxHQUFHLENBQUM7d0NBQzdDLENBQUE7NkJBQ0w7d0JBQ0wsQ0FBQyxDQUFDLENBQUM7d0JBR0csWUFBVSxNQUFNLENBQUMsT0FBTyxDQUFFLGFBQVcsQ0FBRTs2QkFDeEMsSUFBSSxDQUFDLFVBQUUsQ0FBQyxFQUFFLENBQUM7NEJBQ1IsT0FBQSxDQUFDLENBQUUsQ0FBQyxDQUFFLEdBQUcsQ0FBQyxDQUFFLENBQUMsQ0FBRTt3QkFBZixDQUFlLENBQ2xCOzZCQUNBLEtBQUssQ0FBRSxDQUFDLEVBQUUsS0FBSyxDQUFFOzZCQUNqQixHQUFHLENBQUUsVUFBQSxDQUFDLElBQUksT0FBQSxDQUFDLENBQUUsQ0FBQyxDQUFFLEVBQU4sQ0FBTSxDQUFDLENBQUM7d0JBR1IsV0FBTSxPQUFPLENBQUMsR0FBRyxDQUFFLFNBQU8sQ0FBQyxHQUFHLENBQUUsVUFBQSxHQUFHLElBQUksT0FBQSxPQUFPLENBQUMsR0FBRyxDQUFDO2dDQUM5RCxFQUFFLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQztxQ0FDaEIsS0FBSyxDQUFDO29DQUNILE1BQU0sRUFBRSxHQUFHO2lDQUNkLENBQUM7cUNBQ0QsR0FBRyxFQUFHOzZCQUNkLENBQUMsRUFOb0QsQ0FNcEQsQ0FBQyxDQUFDLEVBQUE7O3dCQU5FLE1BQU0sR0FBRyxTQU1YO3dCQUdrQixXQUFNLE9BQU8sQ0FBQyxHQUFHLENBQ25DLFNBQU8sQ0FBQyxHQUFHLENBQUUsVUFBQSxHQUFHO2dDQUNaLE9BQUEsRUFBRSxDQUFDLFVBQVUsQ0FBQyxRQUFRLENBQUM7cUNBQ2xCLEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDO29DQUNSO3dDQUNJLEdBQUcsT0FBQTt3Q0FDSCxNQUFNLEVBQUUsR0FBRztxQ0FDZCxFQUFFO3dDQUNDLE1BQU0sRUFBRSxHQUFHO3dDQUNYLFlBQVksRUFBRSxJQUFJO3FDQUNyQjtpQ0FDSixDQUFDLENBQUM7cUNBQ0YsS0FBSyxDQUFDO29DQUNILElBQUksRUFBRSxJQUFJO29DQUNWLEtBQUssRUFBRSxJQUFJO29DQUNYLE1BQU0sRUFBRSxJQUFJO2lDQUNmLENBQUM7cUNBQ0QsR0FBRyxFQUFHOzRCQWZYLENBZVcsQ0FDZCxDQUNKLEVBQUE7O3dCQW5CSyxhQUFnQixTQW1CckI7d0JBR0ssa0JBQWtCLEdBQUcsYUFBYSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUUsVUFBQSxDQUFDOzRCQUNuRCxPQUFBLENBQUMsQ0FBQyxTQUFPLENBQUMsSUFBSSxDQUFFLFVBQUEsR0FBRztnQ0FDZixPQUFBLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUNQLFVBQUEsQ0FBQyxJQUFJLE9BQUEsQ0FBQyxLQUFLLEdBQUcsRUFBVCxDQUFTLENBQ2pCOzRCQUZELENBRUMsQ0FDUjt3QkFKRyxDQUlILENBQUMsQ0FBQzt3QkFHRyxJQUFJLEdBQUcsS0FBSyxDQUFDLElBQUksQ0FDbkIsSUFBSSxHQUFHLENBQ0gsa0JBQWtCOzZCQUNiLEdBQUcsQ0FBRSxVQUFBLENBQUMsSUFBSSxPQUFBLENBQUMsQ0FBQyxHQUFHLEVBQUwsQ0FBSyxDQUFFLENBQ3pCLENBQ0osQ0FBQzt3QkFHZSxXQUFNLE9BQU8sQ0FBQyxHQUFHLENBQUUsSUFBSSxDQUFDLEdBQUcsQ0FBRSxVQUFBLEdBQUc7Z0NBQzdDLE9BQU8sRUFBRSxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUM7cUNBQ3hCLEdBQUcsQ0FBRSxHQUFHLENBQUU7cUNBQ1YsS0FBSyxDQUFDO29DQUNILEdBQUcsRUFBRSxJQUFJO29DQUNULEdBQUcsRUFBRSxJQUFJO29DQUNULEdBQUcsRUFBRSxJQUFJO29DQUNULEtBQUssRUFBRSxJQUFJO2lDQUNkLENBQUM7cUNBQ0QsR0FBRyxFQUFHLENBQUE7NEJBQ2YsQ0FBQyxDQUFDLENBQUMsRUFBQTs7d0JBVkcsYUFBVyxTQVVkO3dCQUdHLG1CQUFpQixrQkFBa0IsQ0FBQyxHQUFHLENBQUUsVUFBQSxFQUFFOzRCQUM3QyxJQUFNLE1BQU0sR0FBRyxVQUFRLENBQUMsSUFBSSxDQUFFLFVBQUEsQ0FBQyxJQUFJLE9BQUEsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLEtBQUssRUFBRSxDQUFDLEdBQUcsRUFBckIsQ0FBcUIsQ0FBRSxDQUFDOzRCQUMzRCxJQUFLLE1BQU0sRUFBRztnQ0FDVixPQUFPLE1BQU0sQ0FBQyxNQUFNLENBQUMsRUFBRyxFQUFFLEVBQUUsRUFBRTtvQ0FDMUIsTUFBTSxFQUFFLE1BQU0sQ0FBQyxJQUFJO2lDQUN0QixDQUFDLENBQUM7NkJBQ047aUNBQU07Z0NBQ0gsT0FBTyxNQUFNLENBQUMsTUFBTSxDQUFDLEVBQUcsRUFBRSxFQUFFLENBQUUsQ0FBQzs2QkFDbEM7d0JBQ0wsQ0FBQyxDQUFDLENBQUM7d0JBR0csUUFBUSxHQUFHLE1BQU0sQ0FBQyxHQUFHLENBQUMsVUFBRSxDQUFDLEVBQUUsQ0FBQzs0QkFDOUIsT0FBTztnQ0FDSCxJQUFJLEVBQUUsQ0FBQyxDQUFFLENBQUMsQ0FBRSxDQUFDLElBQUksQ0FBRSxDQUFDLENBQUU7Z0NBQ3RCLE9BQU8sRUFBRSxVQUFRLENBQUUsQ0FBQyxDQUFFLENBQUMsSUFBSTtnQ0FDM0IsWUFBWSxFQUFFLGdCQUFjLENBQUMsTUFBTSxDQUFFLFVBQUEsRUFBRSxJQUFJLE9BQUEsRUFBRSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUUsVUFBQSxHQUFHLElBQUksT0FBQSxHQUFHLEtBQUssQ0FBQyxDQUFFLENBQUMsQ0FBRSxDQUFDLElBQUksQ0FBRSxDQUFDLENBQUUsQ0FBQyxNQUFNLEVBQS9CLENBQStCLENBQUUsRUFBdEQsQ0FBc0QsQ0FBQzs2QkFDckcsQ0FBQTt3QkFDTCxDQUFDLENBQUMsQ0FBQzt3QkFFSCxXQUFPLEdBQUcsQ0FBQyxJQUFJLEdBQUc7Z0NBQ2QsTUFBTSxFQUFFLEdBQUc7Z0NBQ1gsSUFBSSxFQUFFLFFBQVE7NkJBQ2pCLEVBQUE7Ozt3QkFHRCxXQUFPLEdBQUcsQ0FBQyxJQUFJLEdBQUcsRUFBRSxNQUFNLEVBQUUsR0FBRyxFQUFFLEVBQUM7Ozs7YUFFekMsQ0FBQyxDQUFBO1FBRUYsV0FBTyxHQUFHLENBQUMsS0FBSyxFQUFHLEVBQUM7O0tBRXZCLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBjbG91ZCBmcm9tICd3eC1zZXJ2ZXItc2RrJztcbmltcG9ydCAqIGFzIFRjYlJvdXRlciBmcm9tICd0Y2Itcm91dGVyJztcbmltcG9ydCB7IGZpbmQkIH0gZnJvbSAnLi9maW5kJztcblxuY2xvdWQuaW5pdCh7XG4gICAgZW52OiBwcm9jZXNzLmVudi5jbG91ZFxufSk7XG5cbmNvbnN0IGRiOiBEQi5EYXRhYmFzZSA9IGNsb3VkLmRhdGFiYXNlKCApO1xuY29uc3QgXyA9IGRiLmNvbW1hbmQ7XG5cbi8qKlxuICogQGRlc2NyaXB0aW9uIOihjOeoi+a4heWNleaooeWdl1xuICogLS0tLS0tLS0tIOWtl+autSAtLS0tLS0tLS0tXG4gKiB0aWRcbiAqIHBpZFxuICogc2lkICgg5Y+v5Li656m6IClcbiAqIG9pZHMgQXJyYXlcbiAqIHVpZHMgQXJyYXlcbiAqIGJ1eV9zdGF0dXMgMCwxLDIg5pyq6LSt5Lmw44CB5bey6LSt5Lmw44CB5Lmw5LiN5YWoXG4gKiBiYXNlX3N0YXR1czogMCwxIOacquiwg+aVtO+8jOW3suiwg+aVtFxuICogY3JlYXRlVGltZVxuICogdXBkYXRlVGltZVxuICogISBhY2lkIOa0u+WKqGlkXG4gKiBsYXN0QWxsb2NhdGVkIOWJqeS9meWIhumFjemHj1xuICogcHVyY2hhc2Ug6YeH6LSt5pWw6YePXG4gKiBhZGp1c3RQcmljZSDliIbphY3nmoTmlbDmuIXljZXllK7ku7dcbiAqIGFkanVzdEdyb3VwUHJpY2Ug5YiG6YWN55qE5pWw5riF5Y2V5Zui6LSt5Lu3XG4gKi9cbmV4cG9ydCBjb25zdCBtYWluID0gYXN5bmMgKCBldmVudCwgY29udGV4dCApID0+IHtcblxuICAgIGNvbnN0IGFwcCA9IG5ldyBUY2JSb3V0ZXIoeyBldmVudCB9KTtcblxuICAgIC8qKlxuICAgICAqIEBkZXNjcmlwdGlvblxuICAgICAqIOWIpOaWreivt+axgueahHNpZCArIHRpZCArIHBpZCArIGNvdW505pWw57uE77yM6L+U5Zue5LiN6IO96LSt5Lmw55qE5ZWG5ZOB5YiX6KGo77yI5riF5Y2V6YeM6Z2i5Lmw5LiN5Yiw44CB5Lmw5LiN5YWo77yJ44CB6LSn5YWo5LiN6Laz55qE5ZWG5ZOB77yI6L+U5Zue5pyA5paw6LSn5a2Y77yJXG4gICAgICogLS0tLS0tLS0g6K+35rGCIC0tLS0tLS0tLS1cbiAgICAgKiB7XG4gICAgICohICAgIGZyb20/OiAnY2FydCcgfCAnYnV5JyB8ICdjdXN0b20nIHwgJ2FnZW50cycgfCAnc3lzdGVtJ1xuICAgICAqICAgICB0aWQ6IHN0cmluZ1xuICAgICAqISAgICBvcGVuaWQ/OiBzdHJpbmcsXG4gICAgICogICAgbGlzdDogeyBcbiAgICAgKiAgICAgIHRpZFxuICAgICAqISAgICAgY2lkPzogc3RyaW5nXG4gICAgICAgICAgICBzaWRcbiAgICAgICAgICAgIHBpZFxuICAgICAgICAgICAgcHJpY2VcbiAgICAgICAgICAgIGdyb3VwUHJpY2VcbiAgICAgICAgICAgIGNvdW50XG4gICAgICohICAgICBkZXNjPzogc3RyaW5nXG4gICAgICAgICAgICBuYW1lLFxuICAgICAgICAgICAgc3RhbmRlcm5hbWVcbiAgICAgICAgICAgIGltZ1xuICAgICAgICAgICAgdHlwZVxuICAgICAgICAgICAgYWRkcmVzczoge1xuICAgICAgICAgICAgICAgbmFtZSxcbiAgICAgICAgICAgICAgIHBob25lLFxuICAgICAgICAgICAgICAgZGV0YWlsLFxuICAgICAgICAgICAgICAgcG9zdGFsY29kZVxuICAgICAgICAgICAgfVxuICAgICAqICAgICB9WyBdXG4gICAgICogfVxuICAgICAqIC0tLS0tLS0tIOi/lOWbniAtLS0tLS0tLS0tXG4gICAgICoge1xuICAgICAqICAgICAgKiDlt7LotK3kubAoIOmjjumZqeWNlSApXG4gICAgICogICAgICBoYXNCZWVuQnV5OiB7XG4gICAgICogICAgICAgICAgdGlkLCBcbiAgICAgKiAgICAgICAgICBwaWQsXG4gICAgICogICAgICAgICAgc2lkXG4gICAgICogICAgICB9WyBdXG4gICAgICogICAgICAqIOS5sOS4jeWIsFxuICAgICAqICAgICAgY2Fubm90QnV5OiB7IFxuICAgICAqICAgICAgICAgIHRpZCwgXG4gICAgICogICAgICAgICAgcGlkLFxuICAgICAqICAgICAgICAgIHNpZFxuICAgICAqICAgICAgfVsgXVxuICAgICAqICAgICAgKiDotKflrZjkuI3otrNcbiAgICAgKiAgICAgICBsb3dTdG9jazogeyBcbiAgICAgKiAgICAgICAgICB0aWQsIFxuICAgICAqICAgICAgICAgIHBpZCxcbiAgICAgKiAgICAgICAgICBzaWQsXG4gICAgICogICAgICAgICAgY291bnQsXG4gICAgICogICAgICAgICAgc3RvY2tcbiAgICAgKiAgICAgIH1bIF1cbiAgICAgKiAgICAgICog5Z6L5Y+35bey6KKr5Yig6ZmkIC8g5ZWG5ZOB5bey5LiL5p62XG4gICAgICogICAgICBoYXNCZWVuRGVsZXRlOiB7XG4gICAgICogICAgICAgICAgdGlkLCBcbiAgICAgKiAgICAgICAgICBwaWQsXG4gICAgICogICAgICAgICAgc2lkXG4gICAgICogICAgICB9WyBdLFxuICAgICAqICAgICAgKiDorqLljZXlj7fliJfooahcbiAgICAgKiAgICAgIG9yZGVyc1xuICAgICAqIH1cbiAgICAgKi9cbiAgICBhcHAucm91dGVyKCdmaW5kQ2Fubm90QnV5JywgYXN5bmMoIGN0eCwgbmV4dCApID0+IHtcbiAgICAgICAgdHJ5IHtcblxuICAgICAgICAgICAgY29uc3QgeyB0aWQsIGxpc3QgfSA9IGV2ZW50LmRhdGE7XG4gICAgICAgICAgICBjb25zdCBvcGVuSWQgPSBldmVudC5kYXRhLm9wZW5JZCB8fCBldmVudC51c2VySW5mby5vcGVuSWQ7XG5cbiAgICAgICAgICAgIC8vIOS4jeiDvei0reS5sOeahOWVhuWTgeWIl+ihqO+8iOa4heWNlemHjOmdouS5sOS4jeWFqO+8iVxuICAgICAgICAgICAgY29uc3QgZmluZGluZ3MkOiBhbnkgPSBhd2FpdCBQcm9taXNlLmFsbCggZXZlbnQuZGF0YS5saXN0Lm1hcCggaSA9PiB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZpbmQkKHtcbiAgICAgICAgICAgICAgICAgICAgdGlkOiBpLnRpZCxcbiAgICAgICAgICAgICAgICAgICAgcGlkOiBpLnBpZCxcbiAgICAgICAgICAgICAgICAgICAgc2lkOiBpLnNpZCxcbiAgICAgICAgICAgICAgICAgICAgYnV5X3N0YXR1czogJzInXG4gICAgICAgICAgICAgICAgfSwgZGIsIGN0eCApXG4gICAgICAgICAgICB9KSlcblxuICAgICAgICAgICAgaWYgKCBmaW5kaW5ncyQuc29tZSggeCA9PiB4LnN0YXR1cyAhPT0gMjAwICkpIHtcbiAgICAgICAgICAgICAgICB0aHJvdyAn5p+l6K+i6LSt54mp5riF5Y2V6ZSZ6K+vJztcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8g5bey5a6M5oiQ6LSt5Lmw55qE5ZWG5ZOB5YiX6KGoXG4gICAgICAgICAgICBjb25zdCBoYXNCZWVuQnV5JDogYW55ID0gYXdhaXQgUHJvbWlzZS5hbGwoIGV2ZW50LmRhdGEubGlzdC5tYXAoIGkgPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiBmaW5kJCh7XG4gICAgICAgICAgICAgICAgICAgIHRpZDogaS50aWQsXG4gICAgICAgICAgICAgICAgICAgIHBpZDogaS5waWQsXG4gICAgICAgICAgICAgICAgICAgIHNpZDogaS5zaWQsXG4gICAgICAgICAgICAgICAgICAgIGJ1eV9zdGF0dXM6ICcxJ1xuICAgICAgICAgICAgICAgIH0sIGRiLCBjdHggKVxuICAgICAgICAgICAgfSkpO1xuXG4gICAgICAgICAgICAvLyDmn6Xor6LllYblk4Hor6bmg4XjgIHmiJbogIXlnovlj7for6bmg4VcbiAgICAgICAgICAgIGNvbnN0IGdvb2REZXRhaWxzJDogYW55ID0gYXdhaXQgUHJvbWlzZS5hbGwoIGV2ZW50LmRhdGEubGlzdC5tYXAoIGkgPT4ge1xuXG4gICAgICAgICAgICAgICAgaWYgKCAhIWkuc2lkICkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZGIuY29sbGVjdGlvbignc3RhbmRhcmRzJylcbiAgICAgICAgICAgICAgICAgICAgICAgIC53aGVyZSh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgX2lkOiBpLnNpZFxuICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgICAgIC5nZXQoIClcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZGIuY29sbGVjdGlvbignZ29vZHMnKVxuICAgICAgICAgICAgICAgICAgICAgICAgLndoZXJlKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBfaWQ6IGkucGlkXG4gICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAgICAgLmdldCggKVxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgfSkpO1xuICAgICAgICAgICBcbiAgICAgICAgICAgIGNvbnN0IGdvb2RzID0gZ29vZERldGFpbHMkLm1hcCggeCA9PiB4LmRhdGFbIDAgXSkuZmlsdGVyKCB5ID0+ICEheSApLmZpbHRlciggeiA9PiAhei5waWQgKTtcbiAgICAgICAgICAgIGNvbnN0IHN0YW5kYXJkcyA9IGdvb2REZXRhaWxzJC5tYXAoIHggPT4geC5kYXRhWyAwIF0pLmZpbHRlciggeSA9PiAhIXkgKS5maWx0ZXIoIHogPT4gISF6LnBpZCApO1xuXG4gICAgICAgICAgICAvLyDlupPlrZjkuI3otrNcbiAgICAgICAgICAgIGxldCBsb3dTdG9jazogYW55ID0gWyBdO1xuXG4gICAgICAgICAgICAvLyDooqvliKDpmaRcbiAgICAgICAgICAgIGxldCBoYXNCZWVuRGVsZXRlOiBhbnkgPSBbIF07XG5cbiAgICAgICAgICAgIC8vIOS5sOS4jeWIsFxuICAgICAgICAgICAgY29uc3QgY2Fubm90QnV5ID0gZmluZGluZ3MkLm1hcCggeCA9PiB4LmRhdGFbIDAgXSkuZmlsdGVyKCB5ID0+ICEheSApO1xuXG4gICAgICAgICAgICAvLyDlt7Lnu4/ooqvotK3kubDkuobvvIjpo47pmanljZXvvIlcbiAgICAgICAgICAgIGNvbnN0IGhhc0JlZW5CdXkgPSBoYXNCZWVuQnV5JC5tYXAoIHggPT4geC5kYXRhWyAwIF0pLmZpbHRlciggeSA9PiAhIXkgKVxuXG4gICAgICAgICAgICBldmVudC5kYXRhLmxpc3QubWFwKCBpID0+IHtcbiAgICAgICAgICAgICAgICAvLyDlnovlj7dcbiAgICAgICAgICAgICAgICBpZiAoICEhaS5zaWQgKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHN0YW5kYXJkID0gc3RhbmRhcmRzLmZpbmQoIHggPT4geC5faWQgPT09IGkuc2lkICYmIHgucGlkID09PSBpLnBpZCApO1xuICAgICAgICAgICAgICAgICAgICBpZiAoICFzdGFuZGFyZCApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGhhc0JlZW5EZWxldGUucHVzaCggaSApO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKCBzdGFuZGFyZC5zdG9jayAhPT0gdW5kZWZpbmVkICYmICBzdGFuZGFyZC5zdG9jayA8IGkuY291bnQgKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBsb3dTdG9jay5wdXNoKCBPYmplY3QuYXNzaWduKHsgfSwgaSwge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0b2NrOiBzdGFuZGFyZC5zdG9jayxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBnb29kTmFtZTogaS5uYW1lLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0YW5kZXJOYW1lOiBpLnN0YW5kZXJuYW1lXG4gICAgICAgICAgICAgICAgICAgICAgICB9KSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAvLyDkuLvkvZPllYblk4FcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBnb29kID0gZ29vZHMuZmluZCggeCA9PiB4Ll9pZCA9PT0gaS5waWQgKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCAhZ29vZCB8fCAoICEhZ29vZCAmJiAhZ29vZC52aXNpYWJsZSApKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBoYXNCZWVuRGVsZXRlLnB1c2goIGkgKVxuICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKCBnb29kLnN0b2NrICE9PSB1bmRlZmluZWQgJiYgIGdvb2Quc3RvY2sgPCBpLmNvdW50ICkge1xuICAgICAgICAgICAgICAgICAgICAgICAgbG93U3RvY2sucHVzaCggT2JqZWN0LmFzc2lnbih7IH0sIGksIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdG9jazogZ29vZC5zdG9jayxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBnb29kTmFtZTogaS5uYW1lXG4gICAgICAgICAgICAgICAgICAgICAgICB9KSk7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBsZXQgb3JkZXJzID0gWyBdO1xuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiDlpoLmnpzlj6/ku6XotK3kubBcbiAgICAgICAgICAgICAqICEg5om56YeP5Yib5bu66aKE5LuY6K6i5Y2VXG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIGlmICggbG93U3RvY2subGVuZ3RoID09PSAwICYmIGNhbm5vdEJ1eS5sZW5ndGggPT09IDAgJiYgaGFzQmVlbkRlbGV0ZS5sZW5ndGggPT09IDAgKSB7XG5cbiAgICAgICAgICAgICAgICBjb25zdCByZXFEYXRhID0ge1xuICAgICAgICAgICAgICAgICAgICB0aWQsXG4gICAgICAgICAgICAgICAgICAgIG9wZW5JZCxcbiAgICAgICAgICAgICAgICAgICAgZnJvbTogZXZlbnQuZGF0YS5mcm9tIHx8ICdzeXN0ZW0nLFxuICAgICAgICAgICAgICAgICAgICBvcmRlcnM6IGV2ZW50LmRhdGEubGlzdFxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGNvbnN0IGNyZWF0ZU9yZGVyJCA9IGF3YWl0IGNsb3VkLmNhbGxGdW5jdGlvbih7XG4gICAgICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRhdGE6IHJlcURhdGEsXG4gICAgICAgICAgICAgICAgICAgICAgICAkdXJsOiAnY3JlYXRlJ1xuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICBuYW1lOiAnb3JkZXInXG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICBpZiAoIGNyZWF0ZU9yZGVyJC5yZXN1bHQuc3RhdHVzICE9PSAyMDAgKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBjdHguYm9keSA9IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0YXR1czogNTAwLFxuICAgICAgICAgICAgICAgICAgICAgICAgbWVzc2FnZTogJ+WIm+W7uumihOS7mOiuouWNleWksei0pe+8gSdcbiAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgb3JkZXJzID0gY3JlYXRlT3JkZXIkLnJlc3VsdC5kYXRhO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gY3R4LmJvZHkgPSB7XG4gICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgICBsb3dTdG9jayxcbiAgICAgICAgICAgICAgICAgICAgaGFzQmVlbkRlbGV0ZSxcbiAgICAgICAgICAgICAgICAgICAgY2Fubm90QnV5LFxuICAgICAgICAgICAgICAgICAgICBoYXNCZWVuQnV5LFxuICAgICAgICAgICAgICAgICAgICBvcmRlcnNcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHN0YXR1czogMjAwXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfSBjYXRjaCAoIGUgKSB7XG4gICAgIFxuICAgICAgICAgICAgcmV0dXJuIGN0eC5ib2R5ID0ge1xuICAgICAgICAgICAgICAgIHN0YXR1czogNTAwLFxuICAgICAgICAgICAgICAgIG1lc3NhZ2U6IGVcbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgIC8qKlxuICAgICAqIEBkZXNjcmlwdGlvblxuICAgICAqIOeUseiuouWNleWIm+W7uui0reeJqea4heWNlVxuICAgICAqIGxpc3Q6IHtcbiAgICAgKiAgICB0aWQsXG4gICAgICogICAgcGlkLFxuICAgICAqICAgIHNpZCxcbiAgICAgKiAgICBvaWQsXG4gICAgICogICAgcHJpY2UsXG4gICAgICogICAgZ3JvdXBQcmljZSxcbiAgICAgKiEgICBhY2lkXG4gICAgICogfVsgXVxuICAgICAqL1xuICAgIGFwcC5yb3V0ZXIoJ2NyZWF0ZScsIGFzeW5jKCBjdHgsIG5leHQgKSA9PiB7XG4gICAgICAgIHRyeSB7XG5cbiAgICAgICAgICAgIGNvbnN0IHsgbGlzdCwgb3BlbklkIH0gPSBldmVudC5kYXRhO1xuIFxuICAgICAgICAgICAgYXdhaXQgUHJvbWlzZS5hbGwoIGxpc3QubWFwKCBhc3luYyBvcmRlck1ldGEgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IHsgdGlkLCBwaWQsIHNpZCwgb2lkLCBwcmljZSwgZ3JvdXBQcmljZSwgYWNpZCB9ID0gb3JkZXJNZXRhO1xuICAgICAgICAgICAgICAgIGxldCBxdWVyeSA9IHtcbiAgICAgICAgICAgICAgICAgICAgdGlkLFxuICAgICAgICAgICAgICAgICAgICBwaWRcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIGlmICggISFzaWQgKSB7XG4gICAgICAgICAgICAgICAgICAgIHF1ZXJ5WydzaWQnXSA9IHNpZDtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAvLyDmj5LlhaXmtLvliqjnmoTmn6Xor6LmnaHku7ZcbiAgICAgICAgICAgICAgICBpZiAoICEhYWNpZCApIHtcbiAgICAgICAgICAgICAgICAgICAgcXVlcnkgPSBPYmplY3QuYXNzaWduKHsgfSwgcXVlcnksIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGFjaWRcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgY29uc3QgZmluZCQgPSBhd2FpdCBkYi5jb2xsZWN0aW9uKCdzaG9wcGluZy1saXN0JylcbiAgICAgICAgICAgICAgICAgICAgLndoZXJlKCBxdWVyeSApXG4gICAgICAgICAgICAgICAgICAgIC5nZXQoICk7XG5cbiAgICAgICAgICAgICAgICBpZiAoIGZpbmQkLmRhdGEubGVuZ3RoID09PSAwICkge1xuXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IG1ldGEgPSBPYmplY3QuYXNzaWduKHsgfSwgcXVlcnkse1xuICAgICAgICAgICAgICAgICAgICAgICAgYWNpZDogYWNpZCB8fCB1bmRlZmluZWRcbiAgICAgICAgICAgICAgICAgICAgfSx7XG4gICAgICAgICAgICAgICAgICAgICAgICBvaWRzOiBbIG9pZCBdLFxuICAgICAgICAgICAgICAgICAgICAgICAgdWlkczogWyBvcGVuSWQgXSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHB1cmNoYXNlOiAwLFxuICAgICAgICAgICAgICAgICAgICAgICAgYnV5X3N0YXR1czogJzAnLFxuICAgICAgICAgICAgICAgICAgICAgICAgYmFzZV9zdGF0dXM6ICcwJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGFkanVzdFByaWNlOiBwcmljZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGFkanVzdEdyb3VwUHJpY2U6IGdyb3VwUHJpY2UsXG4gICAgICAgICAgICAgICAgICAgICAgICBjcmVhdGVUaW1lOiBuZXcgRGF0ZSggKS5nZXRUaW1lKCApXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICBcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgY3JlYWV0JCA9IGF3YWl0IGRiLmNvbGxlY3Rpb24oJ3Nob3BwaW5nLWxpc3QnKVxuICAgICAgICAgICAgICAgICAgICAgICAgLmFkZCh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YTogbWV0YVxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuXG4gICAgICAgICAgICAgICAgLy8g5pu05paw5o+S5YWlXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgbGV0IG1ldGFTaG9wcGluZ0xpc3QgPSBmaW5kJC5kYXRhWyAwIF07XG4gICAgICAgICAgICAgICAgICAgIGlmICggIW1ldGFTaG9wcGluZ0xpc3Qub2lkcy5maW5kKCB4ID0+IHggPT09IG9pZCApKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBsYXN0T2lkcyA9IG1ldGFTaG9wcGluZ0xpc3Qub2lkcztcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGxhc3RVaWRzID0gbWV0YVNob3BwaW5nTGlzdC51aWRzO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyDmj5LlhaXliLDlpLTpg6jvvIzmnIDmlrDnmoTlt7LmlK/ku5jorqLljZXlsLHlnKjkuIrpnaJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxhc3RPaWRzLnVuc2hpZnQoIG9pZCApO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoICFsYXN0VWlkcy5maW5kKCB4ID0+IHggPT09IG9wZW5JZCApKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGFzdFVpZHMudW5zaGlmdCggb3BlbklkICk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHVwZGF0ZSQgPSBhd2FpdCBkYi5jb2xsZWN0aW9uKCdzaG9wcGluZy1saXN0JykuZG9jKCBTdHJpbmcoIGZpbmQkLmRhdGFbIDAgXS5faWQgKSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAudXBkYXRlKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb2lkczogbGFzdE9pZHMsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB1aWRzOiBsYXN0VWlkcyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHVwZGF0ZVRpbWU6IG5ldyBEYXRlKCApLmdldFRpbWUoIClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgfSkpO1xuXG4gICAgICAgICAgICByZXR1cm4gY3R4LmJvZHkgPSB7XG4gICAgICAgICAgICAgICAgc3RhdHVzOiAyMDBcbiAgICAgICAgICAgIH1cblxuICAgICAgICB9IGNhdGNoICggZSApIHsgcmV0dXJuIGN0eC5ib2R5ID0geyBzdGF0dXM6IDUwMCB9fVxuICAgIH0pO1xuXG4gICAgLyoqXG4gICAgICogQGRlc2NyaXB0aW9uIFxuICAgICAqIHtcbiAgICAgKiAgICAgdGlkLCBcbiAgICAgKiAgICAgbmVlZE9yZGVycyDmmK/lkKbpnIDopoHov5Tlm57orqLljZVcbiAgICAgKiB9XG4gICAgICog6KGM56iL55qE6LSt54mp5riF5Y2V77yM55So5LqO6LCD5pW05ZWG5ZOB5Lu35qC844CB6LSt5Lmw5pWw6YePXG4gICAgICovXG4gICAgYXBwLnJvdXRlcignbGlzdCcsIGFzeW5jKCBjdHgsIG5leHQgKSA9PiB7XG4gICAgICAgIHRyeSB7XG5cbiAgICAgICAgICAgIGxldCBvcmRlcnMkOiBhbnkgPSBbIF07XG5cbiAgICAgICAgICAgIGNvbnN0IHsgdGlkLCBuZWVkT3JkZXJzLCAgfSA9IGV2ZW50LmRhdGE7XG4gICAgICAgICAgICBjb25zdCBvcGVuaWQgPSBldmVudC5kYXRhLm9wZW5JZCB8fCBldmVudC51c2VySW5mby5vcGVuSWQ7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgLy8g5ou/5Yiw6KGM56iL5LiL5omA5pyJ55qE6LSt54mp5riF5Y2VXG4gICAgICAgICAgICBjb25zdCBsaXN0cyQgPSBhd2FpdCBkYi5jb2xsZWN0aW9uKCdzaG9wcGluZy1saXN0JylcbiAgICAgICAgICAgICAgICAud2hlcmUoe1xuICAgICAgICAgICAgICAgICAgICB0aWRcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIC5nZXQoICk7XG4gICAgICAgICAgIFxuICAgICAgICAgICAgLy8g5p+l6K+i5q+P5p2h5riF5Y2V5bqV5LiL55qE5q+P5Liqb3JkZXLor6bmg4XvvIzov5nph4znmoTmr4/kuKpvcmRlcumDveaYr+W3suS7mOiuoumHkeeahFxuICAgICAgICAgICAgaWYgKCBuZWVkT3JkZXJzICE9PSBmYWxzZcKgKSB7XG4gICAgICAgICAgICAgICAgb3JkZXJzJCA9IGF3YWl0IFByb21pc2UuYWxsKCBsaXN0cyQuZGF0YS5tYXAoIGxpc3QgPT4ge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gUHJvbWlzZS5hbGwoIGxpc3Qub2lkcy5tYXAoIGFzeW5jIG9pZCA9PiB7XG4gICAgXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBvcmRlciQgPSBhd2FpdCBkYi5jb2xsZWN0aW9uKCdvcmRlcicpLmRvYyggb2lkIClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAuZ2V0KCApO1xuICAgIFxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgdXNlciQgPSBhd2FpdCBkYi5jb2xsZWN0aW9uKCd1c2VyJylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAud2hlcmUoe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvcGVuaWQ6IG9yZGVyJC5kYXRhLm9wZW5pZFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLmdldCggKTtcbiAgICBcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBPYmplY3QuYXNzaWduKHsgfSwgb3JkZXIkLmRhdGEsIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB1c2VyOiB1c2VyJC5kYXRhWyAwIF1cbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICB9KSk7XG4gICAgICAgICAgICAgICAgfSkpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyDmn6Xor6Lmr4/mnaHmuIXljZXlupXkuIvmr4/kuKrllYblk4HnmoTor6bmg4VcbiAgICAgICAgICAgIGNvbnN0IGdvb2RzJDogYW55ID0gYXdhaXQgUHJvbWlzZS5hbGwoIGxpc3RzJC5kYXRhLm1hcCggYXN5bmMgbGlzdCA9PiB7XG5cbiAgICAgICAgICAgICAgICBjb25zdCB7IHBpZCwgc2lkIH0gPSBsaXN0O1xuICAgICAgICAgICAgICAgIGNvbnN0IGNvbGxlY3Rpb25OYW1lID0gISFzaWQgPyAnc3RhbmRhcmRzJyA6ICdnb29kcyc7XG5cbiAgICAgICAgICAgICAgICAvLyDlnovlj7dcbiAgICAgICAgICAgICAgICBsZXQgc3RhbmRhciQ6IGFueSA9IG51bGw7XG5cbiAgICAgICAgICAgICAgICAvLyDllYblk4FcbiAgICAgICAgICAgICAgICBjb25zdCBnb29kJCA9IGF3YWl0IGRiLmNvbGxlY3Rpb24oJ2dvb2RzJylcbiAgICAgICAgICAgICAgICAgICAgLmRvYyggcGlkIClcbiAgICAgICAgICAgICAgICAgICAgLmdldCggKTtcblxuICAgICAgICAgICAgICAgIGlmICggISFzaWQgKSB7XG4gICAgICAgICAgICAgICAgICAgIHN0YW5kYXIkID0gYXdhaXQgZGIuY29sbGVjdGlvbignc3RhbmRhcmRzJylcbiAgICAgICAgICAgICAgICAgICAgICAgIC5kb2MoIHNpZCApXG4gICAgICAgICAgICAgICAgICAgICAgICAuZ2V0KCApO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgICAgIHRhZzogZ29vZCQuZGF0YS50YWcsXG4gICAgICAgICAgICAgICAgICAgIHRpdGxlOiBnb29kJC5kYXRhLnRpdGxlLFxuICAgICAgICAgICAgICAgICAgICBuYW1lOiBzdGFuZGFyJCA/IHN0YW5kYXIkLmRhdGEubmFtZSA6ICcnLFxuICAgICAgICAgICAgICAgICAgICBwcmljZTogc3RhbmRhciQgPyBzdGFuZGFyJC5kYXRhLnByaWNlIDogZ29vZCQuZGF0YS5wcmljZSxcbiAgICAgICAgICAgICAgICAgICAgaW1nOiBzdGFuZGFyJCA/IHN0YW5kYXIkLmRhdGEuaW1nIDogZ29vZCQuZGF0YS5pbWdbIDAgXSxcbiAgICAgICAgICAgICAgICAgICAgZ3JvdXBQcmljZTogc3RhbmRhciQgPyBzdGFuZGFyJC5kYXRhLmdyb3VwUHJpY2UgOiBnb29kJC5kYXRhLmdyb3VwUHJpY2UsXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSkpO1xuXG4gICAgICAgICAgICAvLyDmn6Xor6LmuIXljZXlr7nlupTnmoTmtLvliqjor6bmg4VcbiAgICAgICAgICAgIGNvbnN0IGFjdGl2aXRpZXMkOiBhbnkgPSBhd2FpdCBQcm9taXNlLmFsbCggbGlzdHMkLmRhdGEubWFwKCBhc3luYyBsaXN0ID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCB7IGFjaWQgfSA9IGxpc3Q7XG4gICAgICAgICAgICAgICAgaWYgKCAhYWNpZCApIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGFjX3ByaWNlOiBudWxsLFxuICAgICAgICAgICAgICAgICAgICAgICAgYWNfZ3JvdXBQcmljZTogbnVsbFxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgbWV0YSA9IGF3YWl0IGRiLmNvbGxlY3Rpb24oJ2FjdGl2aXR5JylcbiAgICAgICAgICAgICAgICAgICAgICAgIC5kb2MoIFN0cmluZyggYWNpZCApKVxuICAgICAgICAgICAgICAgICAgICAgICAgLmdldCggKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGFjX3ByaWNlOiBtZXRhLmRhdGEuYWNfcHJpY2UsXG4gICAgICAgICAgICAgICAgICAgICAgICBhY19ncm91cFByaWNlOiBtZXRhLmRhdGEuYWNfZ3JvdXBQcmljZSxcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pKTtcblxuICAgICAgICAgICAgY29uc3QgbGlzdCA9IGxpc3RzJC5kYXRhLm1hcCgoIGwsIGsgKSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3QgeyBhY19ncm91cFByaWNlLCBhY19wcmljZSB9ID0gYWN0aXZpdGllcyRbIGsgXTtcbiAgICAgICAgICAgICAgICBjb25zdCB7IGltZywgcHJpY2UsIGdyb3VwUHJpY2UsIHRpdGxlLCBuYW1lLCB0YWcgfSA9IGdvb2RzJFsgayBdO1xuICAgICAgICAgICAgICAgIGxldCBtZXRhID0gT2JqZWN0LmFzc2lnbih7IH0sIGwsIHtcbiAgICAgICAgICAgICAgICAgICAgdGFnLFxuICAgICAgICAgICAgICAgICAgICBpbWcsXG4gICAgICAgICAgICAgICAgICAgIHByaWNlLFxuICAgICAgICAgICAgICAgICAgICBncm91cFByaWNlLFxuICAgICAgICAgICAgICAgICAgICBnb29kTmFtZTogdGl0bGUsXG4gICAgICAgICAgICAgICAgICAgIHN0YW5kYXJOYW1lOiBuYW1lLFxuICAgICAgICAgICAgICAgICAgICBhY19ncm91cFByaWNlLFxuICAgICAgICAgICAgICAgICAgICBhY19wcmljZVxuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgaWYgKCBuZWVkT3JkZXJzICE9PSBmYWxzZSApIHtcbiAgICAgICAgICAgICAgICAgICAgbWV0YSA9IE9iamVjdC5hc3NpZ24oeyB9LCBtZXRhLCB7XG4gICAgICAgICAgICAgICAgICAgICAgICBvcmRlcjogb3JkZXJzJFsgayBdLFxuICAgICAgICAgICAgICAgICAgICAgICAgdG90YWw6IG9yZGVycyRbIGsgXS5yZWR1Y2UoKCB4LCB5ICkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB4ICsgeS5jb3VudDtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sIDAgKVxuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHJldHVybiBtZXRhO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHJldHVybiBjdHguYm9keSA9IHtcbiAgICAgICAgICAgICAgICBzdGF0dXM6IDIwMCxcbiAgICAgICAgICAgICAgICBkYXRhOiBsaXN0LFxuICAgICAgICAgICAgfVxuXG4gICAgICAgIH0gY2F0Y2ggKCBlICkgeyByZXR1cm4gY3R4LmJvZHkgPSB7IHN0YXR1czogNTAwIH07fVxuICAgIH0pXG5cbiAgICAvKipcbiAgICAgKiDotK3nianmuIXljZXosIPmlbRcbiAgICAgKiAtLS0tLS0tLSDor7fmsYJcbiAgICAgKiB7XG4gICAgICogICAgc2hvcHBpbmdJZCwgYWRqdXN0UHJpY2UsIHB1cmNoYXNlLCBhZGp1c3RHcm91cFByaWNlXG4gICAgICogfVxuICAgICAqL1xuICAgIGFwcC5yb3V0ZXIoJ2FkanVzdCcsIGFzeW5jKCBjdHgsIG5leHQgKSA9PiB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGNvbnN0IHsgc2hvcHBpbmdJZCwgYWRqdXN0UHJpY2UsIGFkanVzdEdyb3VwUHJpY2UgfSA9IGV2ZW50LmRhdGE7XG5cbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICog5riF5Y2V77yM5YWI5ou/5Yiw6K6i5Y2V6YeH6LSt5oC75pWwXG4gICAgICAgICAgICAgKiDpmo/lkI7mm7TmlrDvvJrph4fotK3ph4/jgIHmuIXljZXllK7ku7fjgIHmuIXljZXlm6LotK3ku7fjgIFiYXNlX3N0YXR1c+OAgWJ1eV9zdGF0dXNcbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgY29uc3Qgc2hvcHBpbmckID0gYXdhaXQgZGIuY29sbGVjdGlvbignc2hvcHBpbmctbGlzdCcpXG4gICAgICAgICAgICAgICAgLmRvYyggc2hvcHBpbmdJZCApXG4gICAgICAgICAgICAgICAgLmdldCggKTtcbiAgIFxuICAgICAgICAgICAgY29uc29sZS5sb2coJzExMTExMScsIHNob3BwaW5nJCApO1xuXG4gICAgICAgICAgICBjb25zdCBvcmRlcnMkID0gYXdhaXQgUHJvbWlzZS5hbGwoIHNob3BwaW5nJC5kYXRhLm9pZHMubWFwKCBvaWQgPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiBkYi5jb2xsZWN0aW9uKCdvcmRlcicpXG4gICAgICAgICAgICAgICAgICAgIC5kb2MoIG9pZCApXG4gICAgICAgICAgICAgICAgICAgIC5nZXQoICk7XG4gICAgICAgICAgICB9KSk7XG5cbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCcyMjIyMjIyJywgb3JkZXJzJCApO1xuXG4gICAgICAgICAgICAvLyDliankvZnliIbphY3ph49cbiAgICAgICAgICAgIGxldCBsYXN0QWxsb2NhdGVkID0gMDtcblxuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiDmgLvliIbphY3ph49cbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgbGV0IHB1cmNoYXNlID0gZXZlbnQuZGF0YS5wdXJjaGFzZTtcblxuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiAhIOS8oOWFpeWIhumFjemHj+S4jeiDveWwkeS6juOAguW3suWujOaIkOWIhumFjeiuouWNleeahOaVsOmineS5i+WSjFxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICBjb25zdCBmaW5pc2hBZGp1c3RPcmRlcnMgPSBvcmRlcnMkXG4gICAgICAgICAgICAgICAgLm1hcCgoIHg6IGFueSApID0+IHguZGF0YSApXG4gICAgICAgICAgICAgICAgLmZpbHRlciggbyA9PiBvLmJhc2Vfc3RhdHVzID09PSAnMicgKTtcblxuICAgICAgICAgICAgY29uc29sZS5sb2coJzMzMzMzMycsIGZpbmlzaEFkanVzdE9yZGVycyk7XG5cbiAgICAgICAgICAgIC8vIOW3suWIhumFjemHj1xuICAgICAgICAgICAgY29uc3QgaGFzQmVlbkFkanVzdCA9IGZpbmlzaEFkanVzdE9yZGVycy5yZWR1Y2UoKCB4LCB5ICkgPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiB4ICsgeS5hbGxvY2F0ZWRDb3VudDtcbiAgICAgICAgICAgIH0sIDAgKTtcblxuICAgICAgICAgICAgY29uc29sZS5sb2coJzQ0NDQ0NCcsIGhhc0JlZW5BZGp1c3QgKTtcblxuICAgICAgICAgICAgaWYgKCBwdXJjaGFzZSA8IGhhc0JlZW5BZGp1c3QgKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGN0eC5ib2R5ID0ge1xuICAgICAgICAgICAgICAgICAgICBzdGF0dXM6IDUwMCxcbiAgICAgICAgICAgICAgICAgICAgbWVzc2FnZTogYOaciSR7ZmluaXNoQWRqdXN0T3JkZXJzLmxlbmd0aH3kuKrorqLljZXlt7Lnoa7orqTvvIzmlbDph4/kuI3og73lsJHkuo4ke2hhc0JlZW5BZGp1c3R95Lu2YFxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIFxuICAgICAgICAgICAgbGV0IG5lZWRCdXlUb3RhbCA9IG9yZGVycyQucmVkdWNlKCggeCwgeSApID0+IHtcbiAgICAgICAgICAgICAgICByZXR1cm4geCArICh5IGFzIGFueSkuZGF0YS5jb3VudDtcbiAgICAgICAgICAgIH0sIDAgKTtcblxuICAgICAgICAgICAgY29uc3QgdGVtcCA9IE9iamVjdC5hc3NpZ24oeyB9LCBzaG9wcGluZyQuZGF0YSwge1xuICAgICAgICAgICAgICAgIHB1cmNoYXNlLFxuICAgICAgICAgICAgICAgIGFkanVzdFByaWNlLFxuICAgICAgICAgICAgICAgIGFkanVzdEdyb3VwUHJpY2UsXG4gICAgICAgICAgICAgICAgYmFzZV9zdGF0dXM6ICcxJyxcbiAgICAgICAgICAgICAgICBidXlfc3RhdHVzOiBwdXJjaGFzZSA8IG5lZWRCdXlUb3RhbCA/ICcyJyA6ICcxJyxcbiAgICAgICAgICAgICAgICB1cGRhdGVUaW1lOiBuZXcgRGF0ZSggKS5nZXRUaW1lKCApXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgZGVsZXRlIHRlbXBbJ19pZCddO1xuXG4gICAgICAgICAgICBjb25zb2xlLmxvZygnNTU1NTU1JywgdGVtcClcblxuICAgICAgICAgICAgLy8g5pu05paw5riF5Y2VXG4gICAgICAgICAgICBhd2FpdCBkYi5jb2xsZWN0aW9uKCdzaG9wcGluZy1saXN0JylcbiAgICAgICAgICAgICAgICAuZG9jKCBzaG9wcGluZ0lkIClcbiAgICAgICAgICAgICAgICAuc2V0KHtcbiAgICAgICAgICAgICAgICAgICAgZGF0YTogdGVtcFxuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqICHku6XkuIvorqLljZXpg73mmK/lt7Lku5jorqLph5HnmoRcbiAgICAgICAgICAgICAqIOiuouWNle+8muaJuemHj+WvueiuouWNleeahOS7t+agvOOAgeWboui0reS7t+OAgei0reS5sOeKtuaAgei/m+ihjOiwg+aVtCjlt7LotK3kubAv6L+b6KGM5Lit77yM5YW25LuW5bey57uP56Gu5a6a6LCD5pW055qE6K6i5Y2V77yM5LiN5YGa5aSE55CGKVxuICAgICAgICAgICAgICog5YW25a6e5bqU6K+l5Lmf6KaB6Ieq5Yqo5rOo5YWl6K6i5Y2V5pWw6YeP77yI562W55Wl77ya5YWI5Yiw5YWI5b6X77yM5ZCO5LiL5Y2V5Lya5pyJ5b6X5LiN5Yiw5Y2V55qE6aOO6Zmp77yJXG4gICAgICAgICAgICAgKiAh5aaC5p6c5bey57uP5YiG6YWN6L+H5LqG77yM5YiZ5LiN5YaN6Ieq5Yqo5YiG6YWN6YeH6LSt6YePXG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIGNvbnN0IHNvcnJlZE9yZGVycyA9IG9yZGVycyRcbiAgICAgICAgICAgICAgICAubWFwKCggeDogYW55ICkgPT4geC5kYXRhIClcbiAgICAgICAgICAgICAgICAuZmlsdGVyKCggeDogYW55ICkgPT4geC5iYXNlX3N0YXR1cyA9PT0gJzAnIHx8IHguYmFzZV9zdGF0dXMgPT09ICcxJyApXG4gICAgICAgICAgICAgICAgLnNvcnQoKCB4OiBhbnksIHk6IGFueSApID0+IHguY3JlYXRlVGltZSAtIHkuY3JlYXRlVGltZSApO1xuXG4gICAgICAgICAgICBjb25zb2xlLmxvZygnNjY2NjY2Jywgc29ycmVkT3JkZXJzICk7XG5cbiAgICAgICAgICAgIC8vIOWJqeS9meWIhumFjemHj1xuICAgICAgICAgICAgcHVyY2hhc2UgLT0gaGFzQmVlbkFkanVzdDtcblxuICAgICAgICAgICAgY29uc29sZS5sb2coICc3NzcnLCBwdXJjaGFzZSApO1xuICAgICAgICBcbiAgICAgICAgICAgIGF3YWl0IFByb21pc2UuYWxsKCBzb3JyZWRPcmRlcnMubWFwKCBhc3luYyBvcmRlciA9PiB7XG5cbiAgICAgICAgICAgICAgICBjb25zdCBiYXNlVGVtcCA9IHtcbiAgICAgICAgICAgICAgICAgICAgYWxsb2NhdGVkUHJpY2U6IGFkanVzdFByaWNlLFxuICAgICAgICAgICAgICAgICAgICBhbGxvY2F0ZWRHcm91cFByaWNlOiBhZGp1c3RHcm91cFByaWNlLFxuICAgICAgICAgICAgICAgICAgICAvLyDml6Dorrroh6rliqjliIbphY3mmK/lkKbmiJDlip/vvIzpg73mmK/ooqvigJzliIbphY3igJ3mk43kvZzov4fnmoRcbiAgICAgICAgICAgICAgICAgICAgYmFzZV9zdGF0dXM6ICcxJyxcbiAgICAgICAgICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgICAgICAgICAqICEgdjE6IOWJqeS9meWIhumFjemHj+S4jei2s+mHh+i0remHj+WwseWIhumFjTBcbiAgICAgICAgICAgICAgICAgICAgICogISB2Mjog5Ymp5L2Z5YiG6YWN6YeP5LiN6Laz6YeH6LSt6YeP77yM5bCx5YiG6YWN5Ymp5L2Z55qE6YeH6LSt6YePXG4gICAgICAgICAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgICAgICAgICAvLyBhbGxvY2F0ZWRDb3VudDogcHVyY2hhc2UgLSBvcmRlci5jb3VudCA+PSAwID8gb3JkZXIuY291bnQgOiAwXG4gICAgICAgICAgICAgICAgICAgIGFsbG9jYXRlZENvdW50OiBwdXJjaGFzZSAtIG9yZGVyLmNvdW50ID49IDAgP1xuICAgICAgICAgICAgICAgICAgICAgICAgb3JkZXIuY291bnQgOlxuICAgICAgICAgICAgICAgICAgICAgICAgcHVyY2hhc2VcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIC8vIOWIhumFjeaIkOWKn1xuICAgICAgICAgICAgICAgIGlmICggcHVyY2hhc2UgLSBvcmRlci5jb3VudCA+PSAwICkge1xuICAgICAgICAgICAgICAgICAgICBsYXN0QWxsb2NhdGVkID0gcHVyY2hhc2UgLSBvcmRlci5jb3VudDtcbiAgICAgICAgICAgICAgICAgICAgcHVyY2hhc2UgLT0gb3JkZXIuY291bnQ7XG5cbiAgICAgICAgICAgICAgICAvLyDotKfmupDkuI3otrPvvIzliIbphY3mnIDlkI7nmoTliankvZnph49cbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBsYXN0QWxsb2NhdGVkID0gMDtcbiAgICAgICAgICAgICAgICAgICAgcHVyY2hhc2UgPSAwO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGNvbnN0IHRlbXAgPSBPYmplY3QuYXNzaWduKHsgfSwgb3JkZXIsIGJhc2VUZW1wICk7XG5cbiAgICAgICAgICAgICAgICBkZWxldGUgdGVtcFsnX2lkJ107XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgYXdhaXQgZGIuY29sbGVjdGlvbignb3JkZXInKVxuICAgICAgICAgICAgICAgICAgICAuZG9jKCBvcmRlci5faWQgKVxuICAgICAgICAgICAgICAgICAgICAuc2V0KHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRhdGE6IHRlbXBcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuXG4gICAgICAgICAgICB9KSk7XG5cbiAgICAgICAgICAgIC8vIOabtOaWsOa4heWNleeahOWJqeS9meWIhumFjeaVsFxuICAgICAgICAgICAgYXdhaXQgZGIuY29sbGVjdGlvbignc2hvcHBpbmctbGlzdCcpXG4gICAgICAgICAgICAgICAgLmRvYyggc2hvcHBpbmdJZCApXG4gICAgICAgICAgICAgICAgLnVwZGF0ZSh7XG4gICAgICAgICAgICAgICAgICAgIGRhdGE6IHsgbGFzdEFsbG9jYXRlZCB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgIFxuICAgICAgICAgICAgcmV0dXJuIGN0eC5ib2R5ID0ge1xuICAgICAgICAgICAgICAgIHN0YXR1czogMjAwXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfSBjYXRjaCAoIGUgKSB7IHJldHVybiBjdHguYm9keSA9IHsgc3RhdHVzOiA1MDAgfTt9XG4gICAgfSlcblxuICAgIC8qKlxuICAgICAqIEBkZXNjcmlwdGlvblxuICAgICAqIOiOt+WPluihjOeoi+mHjOaYr+WQpui/mOacieacquiwg+aVtOeahOa4heWNlVxuICAgICovXG4gICAgYXBwLnJvdXRlcignYWRqdXN0LXN0YXR1cycsIGFzeW5jKCBjdHgsIG5leHQgKSA9PiB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBjb25zdCB7IHRpZCB9ID0gZXZlbnQuZGF0YTtcbiAgICAgICAgICAgIGNvbnN0IGNvdW50ID0gYXdhaXQgZGIuY29sbGVjdGlvbignc2hvcHBpbmctbGlzdCcpXG4gICAgICAgICAgICAgICAgLndoZXJlKHtcbiAgICAgICAgICAgICAgICAgICAgdGlkLFxuICAgICAgICAgICAgICAgICAgICBiYXNlX3N0YXR1czogJzAnXG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAuY291bnQoICk7XG5cbiAgICAgICAgICAgIHJldHVybiBjdHguYm9keSA9IHtcbiAgICAgICAgICAgICAgICBzdGF0dXM6IDIwMCxcbiAgICAgICAgICAgICAgICBkYXRhOiBjb3VudC50b3RhbFxuICAgICAgICAgICAgfVxuXG4gICAgICAgIH0gY2F0Y2ggKCBlICkge1xuICAgICAgICAgICAgcmV0dXJuIGN0eC5ib2R5ID0geyBzdGF0dXM6IDUwMCB9O1xuICAgICAgICB9XG4gICAgfSlcblxuICAgIC8qKlxuICAgICAqIEBkZXNjcmlwdGlvblxuICAgICAqIOetieW+heaLvOWbouWIl+ihqCAvIOWPr+aLvOWbouWIl+ihqCAoIOWPr+aMh+WumuWVhuWTgTog5ZWG5ZOB6K+m5oOF6aG16Z2iIClcbiAgICAgKiB7XG4gICAgICogICAgdGlkLFxuICAgICAqICAgIHBpZCxcbiAgICAgKiAgICBsaW1pdFxuICAgICAqICAgIGRldGFpbDogYm9vbGVhbiDmmK/lkKbluKblm57llYblk4Hor6bmg4XvvIjpu5jorqTluKblm57vvIlcbiAgICAgKiAgICBzaG93VXNlcjogYm9vbGVhbiDmmK/lkKbpnIDopoHnlKjmiLflpLTlg4/nrYnkv6Hmga/vvIjpu5jorqTkuI3luKblm57vvIlcbiAgICAgKiAgICB0eXBlOiB1bmRlZmluZWQgfCAnd2FpdCcgfCAncGluJyAvLyDnrYnlvoXmi7zlm6LvvIzlt7Lmi7zlm6LvvIzlnYfmnIlcbiAgICAgKiB9XG4gICAgICovXG4gICAgYXBwLnJvdXRlcigncGluJywgYXN5bmMoIGN0eCwgbmV4dCApID0+IHtcbiAgICAgICAgdHJ5IHtcblxuICAgICAgICAgICAgY29uc3Qgb3BlbmlkID0gZXZlbnQudXNlckluZm8ub3BlbklkO1xuICAgICAgICAgICAgY29uc3QgeyB0aWQsIGRldGFpbCwgcGlkLCB0eXBlLCBsaW1pdCB9ID0gZXZlbnQuZGF0YTtcbiAgICAgICAgICAgIGNvbnN0IHNob3dVc2VyID0gZXZlbnQuZGF0YS5zaG93VXNlciB8fCBmYWxzZTtcblxuICAgICAgICAgICAgY29uc3QgcXVlcnkgPSBwaWQgPyB7XG4gICAgICAgICAgICAgICAgdGlkLFxuICAgICAgICAgICAgICAgIHBpZFxuICAgICAgICAgICAgfSA6IHtcbiAgICAgICAgICAgICAgICB0aWRcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIGxldCBzaG9wcGluZyQ7XG4gICAgICAgICAgICBpZiAoIGxpbWl0ICkge1xuICAgICAgICAgICAgICAgIHNob3BwaW5nJCA9IGF3YWl0IGRiLmNvbGxlY3Rpb24oJ3Nob3BwaW5nLWxpc3QnKVxuICAgICAgICAgICAgICAgICAgICAud2hlcmUoIHF1ZXJ5IClcbiAgICAgICAgICAgICAgICAgICAgLmxpbWl0KCBsaW1pdCApXG4gICAgICAgICAgICAgICAgICAgIC5nZXQoICk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHNob3BwaW5nJCA9IGF3YWl0IGRiLmNvbGxlY3Rpb24oJ3Nob3BwaW5nLWxpc3QnKVxuICAgICAgICAgICAgICAgICAgICAud2hlcmUoIHF1ZXJ5IClcbiAgICAgICAgICAgICAgICAgICAgLmdldCggKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIFxuXG4gICAgICAgICAgICAvLyB1aWRz6ZW/5bqm5Li6Me+8jOS4uuW+heaLvOWIl+ihqCAoIOafpeivouW+heaLvOWIl+ihqOaXtu+8jOWPr+S7peacieiHquW3se+8jOiuqeWuouaIt+efpemBk+ezu+e7n+S8muWIl+WHuuadpSApXG4gICAgICAgICAgICAvLyB1aWRz6ZW/5bqm5Li6Mu+8jOS4uuWPr+S7peaLvOWbouWIl+ihqFxuICAgICAgICAgICAgbGV0IGRhdGE6IGFueSA9IFsgXTtcbiAgICAgICAgICAgIGxldCBkYXRhJCA9IHNob3BwaW5nJC5kYXRhLmZpbHRlciggcyA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKCB0eXBlID09PSAncGluJyApIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuICEhcy5hZGp1c3RHcm91cFByaWNlICYmIHMudWlkcy5sZW5ndGggPiAxO1xuXG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmICggdHlwZSA9PT0gJ3dhaXQnICkge1xuICAgICAgICAgICAgICAgICAgICAvLyByZXR1cm4gISFzLmFkanVzdEdyb3VwUHJpY2UgJiYgcy51aWRzLmxlbmd0aCA9PT0gMSAmJiBzLnVpZHNbIDAgXSAhPT0gb3BlbmlkXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAhIXMuYWRqdXN0R3JvdXBQcmljZSAmJiBzLnVpZHMubGVuZ3RoID09PSAxO1xuXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gcmV0dXJuICggISFzLmFkanVzdEdyb3VwUHJpY2UgJiYgcy51aWRzLmxlbmd0aCA+IDEgKSB8fFxuICAgICAgICAgICAgICAgICAgICAvLyAgICAgKCAhIXMuYWRqdXN0R3JvdXBQcmljZSAmJiBzLnVpZHMubGVuZ3RoID09PSAxICYmIHMudWlkc1sgMCBdICE9PSBvcGVuaWQgKVxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gISFzLmFkanVzdEdyb3VwUHJpY2U7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIGRhdGEkID0gZGF0YSQuc29ydCgoIHgsIHkgKSA9PiB4LnVpZHMubGVuZ3RoIC0geS51aWRzLmxlbmd0aCApO1xuICAgICAgICAgICAgZGF0YSA9IGRhdGEkO1xuXG4gICAgICAgICAgICAvLyDmn6Xor6Lmr4/mnaHmuIXljZXlupXkuIvmr4/kuKrllYblk4HnmoTor6bmg4VcbiAgICAgICAgICAgIGlmICggZGV0YWlsID09PSB1bmRlZmluZWQgfHwgISFkZXRhaWwgKSB7XG5cbiAgICAgICAgICAgICAgICAvLyDllYblk4FcbiAgICAgICAgICAgICAgICBjb25zdCBnb29kSWRzID0gQXJyYXkuZnJvbShcbiAgICAgICAgICAgICAgICAgICAgbmV3IFNldCggZGF0YSQubWFwKCBsaXN0ID0+IFxuICAgICAgICAgICAgICAgICAgICAgICAgbGlzdC5waWRcbiAgICAgICAgICAgICAgICAgICAgKSlcbiAgICAgICAgICAgICAgICApO1xuXG4gICAgICAgICAgICAgICAgLy8g5Z6L5Y+3XG4gICAgICAgICAgICAgICAgY29uc3Qgc3RhbmRhcnNJZHMgPSBBcnJheS5mcm9tKFxuICAgICAgICAgICAgICAgICAgICBuZXcgU2V0KCBkYXRhJC5tYXAoIGxpc3QgPT4gXG4gICAgICAgICAgICAgICAgICAgICAgICBsaXN0LnNpZFxuICAgICAgICAgICAgICAgICAgICApKVxuICAgICAgICAgICAgICAgICkuZmlsdGVyKCB4ID0+ICEheCApO1xuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIC8vIOWVhuWTgVxuICAgICAgICAgICAgICAgIGxldCBhbGxHb29kcyQ6IGFueSA9IGF3YWl0IFByb21pc2UuYWxsKCBnb29kSWRzLm1hcCggZ29vZElkID0+IHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGRiLmNvbGxlY3Rpb24oJ2dvb2RzJylcbiAgICAgICAgICAgICAgICAgICAgICAgIC5kb2MoIGdvb2RJZCApXG4gICAgICAgICAgICAgICAgICAgICAgICAuZ2V0KCApO1xuICAgICAgICAgICAgICAgIH0pKTtcblxuICAgICAgICAgICAgICAgIGFsbEdvb2RzJCA9IGFsbEdvb2RzJC5tYXAoIHggPT4geC5kYXRhICk7XG5cbiAgICAgICAgICAgICAgICAvLyDlnovlj7dcbiAgICAgICAgICAgICAgICBsZXQgYWxsU3RhbmRhcnMkOiBhbnkgPSBhd2FpdCBQcm9taXNlLmFsbCggc3RhbmRhcnNJZHMubWFwKCBzaWQgPT4ge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZGIuY29sbGVjdGlvbignc3RhbmRhcmRzJylcbiAgICAgICAgICAgICAgICAgICAgICAgIC5kb2MoIHNpZCApXG4gICAgICAgICAgICAgICAgICAgICAgICAuZ2V0KCApO1xuICAgICAgICAgICAgICAgIH0pKTtcblxuICAgICAgICAgICAgICAgIGFsbFN0YW5kYXJzJCA9IGFsbFN0YW5kYXJzJC5tYXAoIHggPT4geC5kYXRhICk7XG5cbiAgICAgICAgICAgICAgICBjb25zdCBnb29kJCA9IGRhdGEkLm1hcCggbGlzdCA9PiB7XG5cbiAgICAgICAgICAgICAgICAgICAgY29uc3QgeyBwaWQsIHNpZCB9ID0gbGlzdDtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgZ29vZDogYW55ID0gYWxsR29vZHMkLmZpbmQoIHggPT4geC5faWQgPT09IHBpZCApO1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBzdGFuZGFyID0gYWxsU3RhbmRhcnMkLmZpbmQoIHggPT4geC5faWQgPT09IHNpZCApO1xuXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBnb29kLFxuICAgICAgICAgICAgICAgICAgICAgICAgdGFnOiBnb29kLnRhZyxcbiAgICAgICAgICAgICAgICAgICAgICAgIHRpdGxlOiBnb29kLnRpdGxlLFxuICAgICAgICAgICAgICAgICAgICAgICAgc2FsZWQ6IGdvb2Quc2FsZWQsXG4gICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiBzdGFuZGFyID8gc3RhbmRhci5uYW1lIDogJycsXG4gICAgICAgICAgICAgICAgICAgICAgICBwcmljZTogc3RhbmRhciA/IHN0YW5kYXIucHJpY2UgOiBnb29kLnByaWNlLFxuICAgICAgICAgICAgICAgICAgICAgICAgaW1nOiBzdGFuZGFyID8gc3RhbmRhci5pbWcgOiBnb29kLmltZ1sgMCBdLFxuICAgICAgICAgICAgICAgICAgICAgICAgZ3JvdXBQcmljZTogc3RhbmRhciA/IHN0YW5kYXIuZ3JvdXBQcmljZSA6IGdvb2QuZ3JvdXBQcmljZSxcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgLy8g5rOo5YWl5ZWG5ZOB6K+m5oOFXG4gICAgICAgICAgICAgICAgZGF0YSA9IGRhdGEkLm1hcCgoIHNob3BwaW5nLCBrICkgPT4ge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gT2JqZWN0LmFzc2lnbih7IH0sIHNob3BwaW5nLCB7XG4gICAgICAgICAgICAgICAgICAgICAgICBkZXRhaWw6IGdvb2QkWyBrIF1cbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8g5bGV56S655So5oi35aS05YOPXG4gICAgICAgICAgICBpZiAoIHNob3dVc2VyICkge1xuXG4gICAgICAgICAgICAgICAgbGV0IHVpZHM6IHN0cmluZ1sgXSA9IFsgXTtcbiAgICAgICAgICAgICAgICBkYXRhJC5tYXAoIGxpc3QgPT4ge1xuICAgICAgICAgICAgICAgICAgICB1aWRzID0gWyAuLi51aWRzLCAuLi5saXN0LnVpZHMgXTtcbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgIHVpZHMgPSBBcnJheS5mcm9tKFxuICAgICAgICAgICAgICAgICAgICBuZXcgU2V0KCB1aWRzIClcbiAgICAgICAgICAgICAgICApO1xuIFxuICAgICAgICAgICAgICAgIGxldCB1c2VycyQ6IGFueSA9IGF3YWl0IFByb21pc2UuYWxsKCB1aWRzLm1hcCggdWlkID0+IHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGRiLmNvbGxlY3Rpb24oJ3VzZXInKVxuICAgICAgICAgICAgICAgICAgICAgICAgLndoZXJlKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvcGVuaWQ6IHVpZFxuICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgICAgIC5maWVsZCh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb3BlbmlkOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGF2YXRhclVybDogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBuaWNrTmFtZTogdHJ1ZVxuICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgICAgIC5nZXQoICk7XG4gICAgICAgICAgICAgICAgfSkpO1xuXG4gICAgICAgICAgICAgICAgdXNlcnMkID0gdXNlcnMkLm1hcCggeCA9PiB4LmRhdGFbIDAgXSk7XG5cbiAgICAgICAgICAgICAgICBkYXRhID0gZGF0YS5tYXAoKCBzaG9wcGluZywgayApID0+IHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIE9iamVjdC5hc3NpZ24oeyB9LCBzaG9wcGluZywge1xuICAgICAgICAgICAgICAgICAgICAgICAgdXNlcnM6IHNob3BwaW5nLnVpZHMubWFwKCB1aWQgPT4gdXNlcnMkLmZpbmQoIHggPT4geC5vcGVuaWQgPT09IHVpZCApKVxuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIHJldHVybiBjdHguYm9keSA9IHtcbiAgICAgICAgICAgICAgICBkYXRhLFxuICAgICAgICAgICAgICAgIHN0YXR1czogMjAwXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfSBjYXRjaCAoIGUgKSB7XG4gICAgICAgICAgICByZXR1cm4gY3R4LmJvZHkgPSB7IHN0YXR1czogNTAwIH07XG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgIC8qKiBcbiAgICAgKiBAZGVzY3JpcHRpb25cbiAgICAgKiDku5nlpbPotK3nianmuIXljZUgKCDkubDkuoblpJrlsJHjgIHljaHliLjlpJrlsJHjgIHnnIHkuoblpJrlsJEgKVxuICAgICAqL1xuICAgIGFwcC5yb3V0ZXIoJ2ZhaXJ5LXNob3BwaW5nbGlzdCcsIGFzeW5jKCBjdHgsIG5leHQgKSA9PiB7XG4gICAgICAgIHRyeSB7XG5cbiAgICAgICAgICAgIGNvbnN0IHsgdGlkIH0gPSBldmVudC5kYXRhO1xuICAgICAgICAgICAgY29uc3QgbGltaXQgPSBldmVudC5kYXRhLmxpbWl0IHx8IDU7XG5cbiAgICAgICAgICAgIC8qKiDooYznqIvotK3nianmuIXljZUgKi9cbiAgICAgICAgICAgIGNvbnN0IHNob3BwaW5nTWV0YSQgPSBhd2FpdCBkYi5jb2xsZWN0aW9uKCdzaG9wcGluZy1saXN0JylcbiAgICAgICAgICAgICAgICAud2hlcmUoe1xuICAgICAgICAgICAgICAgICAgICB0aWRcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIC5nZXQoICk7XG4gICAgICAgICAgICBcbiAgICAgICAgXG4gICAgICAgICAgICAvKiog5omA5pyJdWlk77yI5ZCr6YeN5aSN77yJICovXG4gICAgICAgICAgICBsZXQgdWlkczogYW55ID0gWyBdO1xuICAgICAgICAgICAgc2hvcHBpbmdNZXRhJC5kYXRhLm1hcCggc2wgPT4ge1xuICAgICAgICAgICAgICAgIHVpZHMgPSBbIC4uLnVpZHMsIC4uLnNsLnVpZHMgXTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAvKiog5aSE55CG5LyY5YyWXG4gICAgICAgICAgICAgKiDorqnotK3kubDph4/mm7TlpJrnmoTnlKjmiLfvvIzlsZXnpLrlnKjliY3pnaJcbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgbGV0IHVpZE1hcFRpbWVzOiB7XG4gICAgICAgICAgICAgICAgWyBrZXk6IHN0cmluZyBdIDogbnVtYmVyXG4gICAgICAgICAgICB9ID0geyB9O1xuICAgICAgICAgICAgdWlkcy5tYXAoIHVpZHN0cmluZyA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKCAhdWlkTWFwVGltZXNbIHVpZHN0cmluZyBdKSB7XG4gICAgICAgICAgICAgICAgICAgIHVpZE1hcFRpbWVzID0gT2JqZWN0LmFzc2lnbih7IH0sIHVpZE1hcFRpbWVzLCB7XG4gICAgICAgICAgICAgICAgICAgICAgICBbIHVpZHN0cmluZyBdOiAxXG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdWlkTWFwVGltZXMgPSBPYmplY3QuYXNzaWduKHsgfSwgdWlkTWFwVGltZXMsIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIFsgdWlkc3RyaW5nIF06IHVpZE1hcFRpbWVzWyB1aWRzdHJpbmcgXSArIDFcbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgLyoqIOWJjTXlkI3nmoTnlKjmiLdpZCAqL1xuICAgICAgICAgICAgY29uc3QgdXNlcklkcyA9IE9iamVjdC5lbnRyaWVzKCB1aWRNYXBUaW1lcyApXG4gICAgICAgICAgICAgICAgLnNvcnQoKCB4LCB5ICkgPT4gXG4gICAgICAgICAgICAgICAgICAgIHlbIDEgXSAtIHhbIDEgXVxuICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgICAuc2xpY2UoIDAsIGxpbWl0IClcbiAgICAgICAgICAgICAgICAubWFwKCB4ID0+IHhbIDAgXSk7XG5cbiAgICAgICAgICAgIC8qKiDmr4/kuKrnlKjmiLfnmoTkv6Hmga8gKi9cbiAgICAgICAgICAgIGNvbnN0IHVzZXJzJCA9IGF3YWl0IFByb21pc2UuYWxsKCB1c2VySWRzLm1hcCggdWlkID0+IFByb21pc2UuYWxsKFtcbiAgICAgICAgICAgICAgICBkYi5jb2xsZWN0aW9uKCd1c2VyJylcbiAgICAgICAgICAgICAgICAgICAgLndoZXJlKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG9wZW5pZDogdWlkXG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgIC5nZXQoIClcbiAgICAgICAgICAgIF0pKSk7XG5cbiAgICAgICAgICAgIC8qKiDliY015Lq655qE5Y2h5Yi4ICovXG4gICAgICAgICAgICBjb25zdCBjb3Vwb25zJDogYW55ID0gYXdhaXQgUHJvbWlzZS5hbGwoXG4gICAgICAgICAgICAgICAgdXNlcklkcy5tYXAoIHVpZCA9PiBcbiAgICAgICAgICAgICAgICAgICAgZGIuY29sbGVjdGlvbignY291cG9uJylcbiAgICAgICAgICAgICAgICAgICAgICAgIC53aGVyZShfLm9yKFtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRpZCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb3BlbmlkOiB1aWRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9wZW5pZDogdWlkLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYW5Vc2VJbk5leHQ6IHRydWVcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBdKSlcbiAgICAgICAgICAgICAgICAgICAgICAgIC5maWVsZCh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZTogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvcGVuaWQ6IHRydWVcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgICAgICAuZ2V0KCApXG4gICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgKVxuXG4gICAgICAgICAgICAvKiog5YmNNeS4quS6uuaAu+eahOi0reeJqea4heWNlSAqL1xuICAgICAgICAgICAgY29uc3Qgc2hvcHBpbmdNZXRhRmlsdGVyID0gc2hvcHBpbmdNZXRhJC5kYXRhLmZpbHRlciggcyA9PiBcbiAgICAgICAgICAgICAgICAhIXVzZXJJZHMuZmluZCggdWlkID0+IFxuICAgICAgICAgICAgICAgICAgICBzLnVpZHMuZmluZCggXG4gICAgICAgICAgICAgICAgICAgICAgICB1ID0+IHUgPT09IHVpZFxuICAgICAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICApKTtcblxuICAgICAgICAgICAgLyoqIOWVhuWTgWlkICovXG4gICAgICAgICAgICBjb25zdCBwSWRzID0gQXJyYXkuZnJvbShcbiAgICAgICAgICAgICAgICBuZXcgU2V0KCBcbiAgICAgICAgICAgICAgICAgICAgc2hvcHBpbmdNZXRhRmlsdGVyXG4gICAgICAgICAgICAgICAgICAgICAgICAubWFwKCBzID0+IHMucGlkIClcbiAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICApO1xuXG4gICAgICAgICAgICAvKiog5ZWG5ZOB6K+m5oOFICovICAgICAgICAgICAgXG4gICAgICAgICAgICBjb25zdCBkZXRhaWxzJCA9IGF3YWl0IFByb21pc2UuYWxsKCBwSWRzLm1hcCggcGlkID0+IHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZGIuY29sbGVjdGlvbignZ29vZHMnKVxuICAgICAgICAgICAgICAgICAgICAuZG9jKCBwaWQgKVxuICAgICAgICAgICAgICAgICAgICAuZmllbGQoe1xuICAgICAgICAgICAgICAgICAgICAgICAgX2lkOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICAgICAgdGFnOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICAgICAgaW1nOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICAgICAgdGl0bGU6IHRydWVcbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgLmdldCggKVxuICAgICAgICAgICAgfSkpO1xuXG4gICAgICAgICAgICAvKiog6LSt54mp5riF5Y2V5rOo5YWl5ZWG5ZOB6K+m5oOFICovXG4gICAgICAgICAgICBjb25zdCBzaG9wcGluZ0luamVjdCA9IHNob3BwaW5nTWV0YUZpbHRlci5tYXAoIHNsID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCBkZXRhaWwgPSBkZXRhaWxzJC5maW5kKCB4ID0+IHguZGF0YS5faWQgPT09IHNsLnBpZCApO1xuICAgICAgICAgICAgICAgIGlmICggZGV0YWlsICkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gT2JqZWN0LmFzc2lnbih7IH0sIHNsLCB7XG4gICAgICAgICAgICAgICAgICAgICAgICBkZXRhaWw6IGRldGFpbC5kYXRhXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBPYmplY3QuYXNzaWduKHsgfSwgc2wgKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgLyoqIOi/lOWbnue7k+aenCAqL1xuICAgICAgICAgICAgY29uc3QgbWV0YURhdGEgPSB1c2VycyQubWFwKCggeCwgayApID0+IHtcbiAgICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgICAgICB1c2VyOiB4WyAwIF0uZGF0YVsgMCBdLFxuICAgICAgICAgICAgICAgICAgICBjb3Vwb25zOiBjb3Vwb25zJFsgayBdLmRhdGEsIFxuICAgICAgICAgICAgICAgICAgICBzaG9wcGluZ2xpc3Q6IHNob3BwaW5nSW5qZWN0LmZpbHRlciggc2wgPT4gc2wudWlkcy5maW5kKCB1aWQgPT4gdWlkID09PSB4WyAwIF0uZGF0YVsgMCBdLm9wZW5pZCApKVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICByZXR1cm4gY3R4LmJvZHkgPSB7XG4gICAgICAgICAgICAgICAgc3RhdHVzOiAyMDAsXG4gICAgICAgICAgICAgICAgZGF0YTogbWV0YURhdGFcbiAgICAgICAgICAgIH1cblxuICAgICAgICB9IGNhdGNoICggZSApIHtcbiAgICAgICAgICAgIHJldHVybiBjdHguYm9keSA9IHsgc3RhdHVzOiA1MDAgfTtcbiAgICAgICAgfVxuICAgIH0pXG5cbiAgICByZXR1cm4gYXBwLnNlcnZlKCApO1xuXG59Il19