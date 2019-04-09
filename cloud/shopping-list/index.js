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
            var _a, tid, list, openId, findings$, hasBeenBuy$, goodDetails$, belongGoodIds, belongGoods$, goods_1, standards_1, belongGoods_1, lowStock_1, hasBeenDelete_1, cannotBuy, hasBeenBuy, orders, reqData, createOrder$, e_1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 5, , 6]);
                        _a = event.data, tid = _a.tid, list = _a.list;
                        openId = event.data.openId || event.userInfo.openId;
                        findings$ = [];
                        hasBeenBuy$ = [];
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
                    case 1:
                        goodDetails$ = _b.sent();
                        belongGoodIds = Array.from(new Set(event.data.list
                            .filter(function (i) { return !!i.sid; })
                            .map(function (o) { return o.pid; })));
                        return [4, Promise.all(belongGoodIds.map(function (pid) {
                                return db.collection('goods')
                                    .doc(String(pid))
                                    .get();
                            }))];
                    case 2:
                        belongGoods$ = _b.sent();
                        goods_1 = goodDetails$.map(function (x) { return x.data[0]; }).filter(function (y) { return !!y; }).filter(function (z) { return !z.pid; });
                        standards_1 = goodDetails$.map(function (x) { return x.data[0]; }).filter(function (y) { return !!y; }).filter(function (z) { return !!z.pid; });
                        belongGoods_1 = belongGoods$.map(function (x) { return x.data; });
                        lowStock_1 = [];
                        hasBeenDelete_1 = [];
                        cannotBuy = [];
                        hasBeenBuy = [];
                        event.data.list.map(function (i) {
                            if (!!i.sid) {
                                var belongGood = belongGoods_1.find(function (x) { return x._id === i.pid; });
                                var standard = standards_1.find(function (x) { return x._id === i.sid && x.pid === i.pid; });
                                if (!standard || (!!standard && standard.isDelete) || (!!belongGood && !belongGood.visiable) || (!!belongGood && belongGood.isDelete)) {
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
                                if (!good || (!!good && !good.visiable) || (!!good && good.isDelete)) {
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
                        if (!(lowStock_1.length === 0 && cannotBuy.length === 0 && hasBeenDelete_1.length === 0)) return [3, 4];
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
                    case 3:
                        createOrder$ = _b.sent();
                        if (createOrder$.result.status !== 200) {
                            return [2, ctx.body = {
                                    status: 500,
                                    message: '创建预付订单失败！'
                                }];
                        }
                        orders = createOrder$.result.data;
                        _b.label = 4;
                    case 4: return [2, ctx.body = {
                            data: {
                                lowStock: lowStock_1,
                                hasBeenDelete: hasBeenDelete_1,
                                cannotBuy: cannotBuy,
                                hasBeenBuy: hasBeenBuy,
                                orders: orders
                            },
                            status: 200
                        }];
                    case 5:
                        e_1 = _b.sent();
                        return [2, ctx.body = {
                                status: 500,
                                message: e_1
                            }];
                    case 6: return [2];
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
                                    .doc(String(goodId))
                                    .get();
                            }))];
                    case 5:
                        allGoods$_1 = _b.sent();
                        allGoods$_1 = allGoods$_1.map(function (x) { return x.data; });
                        return [4, Promise.all(standarsIds.map(function (sid) {
                                return db.collection('standards')
                                    .doc(String(sid))
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSxpQkFnOUJDOztBQWg5QkQscUNBQXVDO0FBQ3ZDLHNDQUF3QztBQUd4QyxLQUFLLENBQUMsSUFBSSxDQUFDO0lBQ1AsR0FBRyxFQUFFLE9BQU8sQ0FBQyxHQUFHLENBQUMsS0FBSztDQUN6QixDQUFDLENBQUM7QUFFSCxJQUFNLEVBQUUsR0FBZ0IsS0FBSyxDQUFDLFFBQVEsRUFBRyxDQUFDO0FBQzFDLElBQU0sQ0FBQyxHQUFHLEVBQUUsQ0FBQyxPQUFPLENBQUM7QUFvQlIsUUFBQSxJQUFJLEdBQUcsVUFBUSxLQUFLLEVBQUUsT0FBTzs7OztRQUVoQyxHQUFHLEdBQUcsSUFBSSxTQUFTLENBQUMsRUFBRSxLQUFLLE9BQUEsRUFBRSxDQUFDLENBQUM7UUErRHJDLEdBQUcsQ0FBQyxNQUFNLENBQUMsZUFBZSxFQUFFLFVBQU8sR0FBRyxFQUFFLElBQUk7Ozs7Ozt3QkFHOUIsS0FBZ0IsS0FBSyxDQUFDLElBQUksRUFBeEIsR0FBRyxTQUFBLEVBQUUsSUFBSSxVQUFBLENBQWdCO3dCQUMzQixNQUFNLEdBQUcsS0FBSyxDQUFDLElBQUksQ0FBQyxNQUFNLElBQUksS0FBSyxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUM7d0JBV3BELFNBQVMsR0FBRyxFQUFHLENBQUM7d0JBZWhCLFdBQVcsR0FBRyxFQUFHLENBQUM7d0JBR0UsV0FBTSxPQUFPLENBQUMsR0FBRyxDQUFFLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBRSxVQUFBLENBQUM7Z0NBRS9ELElBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUc7b0NBQ1gsT0FBTyxFQUFFLENBQUMsVUFBVSxDQUFDLFdBQVcsQ0FBQzt5Q0FDNUIsS0FBSyxDQUFDO3dDQUNILEdBQUcsRUFBRSxD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Q0wsQ0FBQyxDQUFDLENBQUM7d0JBRUgsV0FBTyxHQUFHLENBQUMsSUFBSSxHQUFHO2dDQUNkLE1BQU0sRUFBRSxHQUFHO2dDQUNYLElBQUksRUFBRSxRQUFROzZCQUNqQixFQUFBOzs7d0JBR0QsV0FBTyxHQUFHLENBQUMsSUFBSSxHQUFHLEVBQUUsTUFBTSxFQUFFLEdBQUcsRUFBRSxFQUFDOzs7O2FBRXpDLENBQUMsQ0FBQTtRQUVGLFdBQU8sR0FBRyxDQUFDLEtBQUssRUFBRyxFQUFDOztLQUV2QixDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgY2xvdWQgZnJvbSAnd3gtc2VydmVyLXNkayc7XG5pbXBvcnQgKiBhcyBUY2JSb3V0ZXIgZnJvbSAndGNiLXJvdXRlcic7XG5pbXBvcnQgeyBmaW5kJCB9IGZyb20gJy4vZmluZCc7XG5cbmNsb3VkLmluaXQoe1xuICAgIGVudjogcHJvY2Vzcy5lbnYuY2xvdWRcbn0pO1xuXG5jb25zdCBkYjogREIuRGF0YWJhc2UgPSBjbG91ZC5kYXRhYmFzZSggKTtcbmNvbnN0IF8gPSBkYi5jb21tYW5kO1xuXG4vKipcbiAqIEBkZXNjcmlwdGlvbiDooYznqIvmuIXljZXmqKHlnZdcbiAqIC0tLS0tLS0tLSDlrZfmrrUgLS0tLS0tLS0tLVxuICogdGlkXG4gKiBwaWRcbiAqIHNpZCAoIOWPr+S4uuepuiApXG4gKiBvaWRzIEFycmF5XG4gKiB1aWRzIEFycmF5XG4gKiBidXlfc3RhdHVzIDAsMSwyIOacqui0reS5sOOAgeW3sui0reS5sOOAgeS5sOS4jeWFqFxuICogYmFzZV9zdGF0dXM6IDAsMSDmnKrosIPmlbTvvIzlt7LosIPmlbRcbiAqIGNyZWF0ZVRpbWVcbiAqIHVwZGF0ZVRpbWVcbiAqICEgYWNpZCDmtLvliqhpZFxuICogbGFzdEFsbG9jYXRlZCDliankvZnliIbphY3ph49cbiAqIHB1cmNoYXNlIOmHh+i0reaVsOmHj1xuICogYWRqdXN0UHJpY2Ug5YiG6YWN55qE5pWw5riF5Y2V5ZSu5Lu3XG4gKiBhZGp1c3RHcm91cFByaWNlIOWIhumFjeeahOaVsOa4heWNleWboui0reS7t1xuICovXG5leHBvcnQgY29uc3QgbWFpbiA9IGFzeW5jICggZXZlbnQsIGNvbnRleHQgKSA9PiB7XG5cbiAgICBjb25zdCBhcHAgPSBuZXcgVGNiUm91dGVyKHsgZXZlbnQgfSk7XG5cbiAgICAvKipcbiAgICAgKiBAZGVzY3JpcHRpb25cbiAgICAgKiDliKTmlq3or7fmsYLnmoRzaWQgKyB0aWQgKyBwaWQgKyBjb3VudOaVsOe7hO+8jOi/lOWbnuS4jeiDvei0reS5sOeahOWVhuWTgeWIl+ihqO+8iOa4heWNlemHjOmdouS5sOS4jeWIsOOAgeS5sOS4jeWFqO+8ieOAgei0p+WFqOS4jei2s+eahOWVhuWTge+8iOi/lOWbnuacgOaWsOi0p+WtmO+8iVxuICAgICAqIC0tLS0tLS0tIOivt+axgiAtLS0tLS0tLS0tXG4gICAgICoge1xuICAgICAqISAgICBmcm9tPzogJ2NhcnQnIHwgJ2J1eScgfCAnY3VzdG9tJyB8ICdhZ2VudHMnIHwgJ3N5c3RlbSdcbiAgICAgKiAgICAgdGlkOiBzdHJpbmdcbiAgICAgKiEgICAgb3BlbmlkPzogc3RyaW5nLFxuICAgICAqICAgIGxpc3Q6IHsgXG4gICAgICogICAgICB0aWRcbiAgICAgKiEgICAgIGNpZD86IHN0cmluZ1xuICAgICAgICAgICAgc2lkXG4gICAgICAgICAgICBwaWRcbiAgICAgICAgICAgIHByaWNlXG4gICAgICAgICAgICBncm91cFByaWNlXG4gICAgICAgICAgICBjb3VudFxuICAgICAqISAgICAgZGVzYz86IHN0cmluZ1xuICAgICAgICAgICAgbmFtZSxcbiAgICAgICAgICAgIHN0YW5kZXJuYW1lXG4gICAgICAgICAgICBpbWdcbiAgICAgICAgICAgIHR5cGVcbiAgICAgICAgICAgIGFkZHJlc3M6IHtcbiAgICAgICAgICAgICAgIG5hbWUsXG4gICAgICAgICAgICAgICBwaG9uZSxcbiAgICAgICAgICAgICAgIGRldGFpbCxcbiAgICAgICAgICAgICAgIHBvc3RhbGNvZGVcbiAgICAgICAgICAgIH1cbiAgICAgKiAgICAgfVsgXVxuICAgICAqIH1cbiAgICAgKiAtLS0tLS0tLSDov5Tlm54gLS0tLS0tLS0tLVxuICAgICAqIHtcbiAgICAgKiAgICAgICog5bey6LSt5LmwKCDpo47pmanljZUgKVxuICAgICAqICAgICAgaGFzQmVlbkJ1eToge1xuICAgICAqICAgICAgICAgIHRpZCwgXG4gICAgICogICAgICAgICAgcGlkLFxuICAgICAqICAgICAgICAgIHNpZFxuICAgICAqICAgICAgfVsgXVxuICAgICAqICAgICAgKiDkubDkuI3liLBcbiAgICAgKiAgICAgIGNhbm5vdEJ1eTogeyBcbiAgICAgKiAgICAgICAgICB0aWQsIFxuICAgICAqICAgICAgICAgIHBpZCxcbiAgICAgKiAgICAgICAgICBzaWRcbiAgICAgKiAgICAgIH1bIF1cbiAgICAgKiAgICAgICog6LSn5a2Y5LiN6LazXG4gICAgICogICAgICAgbG93U3RvY2s6IHsgXG4gICAgICogICAgICAgICAgdGlkLCBcbiAgICAgKiAgICAgICAgICBwaWQsXG4gICAgICogICAgICAgICAgc2lkLFxuICAgICAqICAgICAgICAgIGNvdW50LFxuICAgICAqICAgICAgICAgIHN0b2NrXG4gICAgICogICAgICB9WyBdXG4gICAgICogICAgICAqIOWei+WPt+W3suiiq+WIoOmZpCAvIOWVhuWTgeW3suS4i+aetlxuICAgICAqICAgICAgaGFzQmVlbkRlbGV0ZToge1xuICAgICAqICAgICAgICAgIHRpZCwgXG4gICAgICogICAgICAgICAgcGlkLFxuICAgICAqICAgICAgICAgIHNpZFxuICAgICAqICAgICAgfVsgXSxcbiAgICAgKiAgICAgICog6K6i5Y2V5Y+35YiX6KGoXG4gICAgICogICAgICBvcmRlcnNcbiAgICAgKiB9XG4gICAgICovXG4gICAgYXBwLnJvdXRlcignZmluZENhbm5vdEJ1eScsIGFzeW5jKCBjdHgsIG5leHQgKSA9PiB7XG4gICAgICAgIHRyeSB7XG5cbiAgICAgICAgICAgIGNvbnN0IHsgdGlkLCBsaXN0IH0gPSBldmVudC5kYXRhO1xuICAgICAgICAgICAgY29uc3Qgb3BlbklkID0gZXZlbnQuZGF0YS5vcGVuSWQgfHwgZXZlbnQudXNlckluZm8ub3BlbklkO1xuXG4gICAgICAgICAgICAvLyDkuI3og73otK3kubDnmoTllYblk4HliJfooajvvIjmuIXljZXph4zpnaLkubDkuI3lhajvvIlcbiAgICAgICAgICAgIC8vIGNvbnN0IGZpbmRpbmdzJDogYW55ID0gYXdhaXQgUHJvbWlzZS5hbGwoIGV2ZW50LmRhdGEubGlzdC5tYXAoIGkgPT4ge1xuICAgICAgICAgICAgLy8gICAgIHJldHVybiBmaW5kJCh7XG4gICAgICAgICAgICAvLyAgICAgICAgIHRpZDogaS50aWQsXG4gICAgICAgICAgICAvLyAgICAgICAgIHBpZDogaS5waWQsXG4gICAgICAgICAgICAvLyAgICAgICAgIHNpZDogaS5zaWQsXG4gICAgICAgICAgICAvLyAgICAgICAgIGJ1eV9zdGF0dXM6ICcyJ1xuICAgICAgICAgICAgLy8gICAgIH0sIGRiLCBjdHggKVxuICAgICAgICAgICAgLy8gfSkpXG4gICAgICAgICAgICBjb25zdCBmaW5kaW5ncyQgPSBbIF07XG5cbiAgICAgICAgICAgIC8vIGlmICggZmluZGluZ3MkLnNvbWUoIHggPT4geC5zdGF0dXMgIT09IDIwMCApKSB7XG4gICAgICAgICAgICAvLyAgICAgdGhyb3cgJ+afpeivoui0reeJqea4heWNlemUmeivryc7XG4gICAgICAgICAgICAvLyB9XG5cbiAgICAgICAgICAgIC8vIOW3suWujOaIkOi0reS5sOeahOWVhuWTgeWIl+ihqFxuICAgICAgICAgICAgLy8gY29uc3QgaGFzQmVlbkJ1eSQ6IGFueSA9IGF3YWl0IFByb21pc2UuYWxsKCBldmVudC5kYXRhLmxpc3QubWFwKCBpID0+IHtcbiAgICAgICAgICAgIC8vICAgICByZXR1cm4gZmluZCQoe1xuICAgICAgICAgICAgLy8gICAgICAgICB0aWQ6IGkudGlkLFxuICAgICAgICAgICAgLy8gICAgICAgICBwaWQ6IGkucGlkLFxuICAgICAgICAgICAgLy8gICAgICAgICBzaWQ6IGkuc2lkLFxuICAgICAgICAgICAgLy8gICAgICAgICBidXlfc3RhdHVzOiAnMSdcbiAgICAgICAgICAgIC8vICAgICB9LCBkYiwgY3R4IClcbiAgICAgICAgICAgIC8vIH0pKTtcbiAgICAgICAgICAgIGNvbnN0IGhhc0JlZW5CdXkkID0gWyBdO1xuXG4gICAgICAgICAgICAvLyDmn6Xor6LllYblk4Hor6bmg4XjgIHmiJbogIXlnovlj7for6bmg4VcbiAgICAgICAgICAgIGNvbnN0IGdvb2REZXRhaWxzJDogYW55ID0gYXdhaXQgUHJvbWlzZS5hbGwoIGV2ZW50LmRhdGEubGlzdC5tYXAoIGkgPT4ge1xuXG4gICAgICAgICAgICAgICAgaWYgKCAhIWkuc2lkICkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZGIuY29sbGVjdGlvbignc3RhbmRhcmRzJylcbiAgICAgICAgICAgICAgICAgICAgICAgIC53aGVyZSh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgX2lkOiBpLnNpZFxuICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgICAgIC5nZXQoIClcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZGIuY29sbGVjdGlvbignZ29vZHMnKVxuICAgICAgICAgICAgICAgICAgICAgICAgLndoZXJlKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBfaWQ6IGkucGlkXG4gICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAgICAgLmdldCggKVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pKTtcblxuICAgICAgICAgICAgLyoqIOWei+WPt+aJgOWxnuWVhuWTgSAqL1xuICAgICAgICAgICAgY29uc3QgYmVsb25nR29vZElkcyA9IEFycmF5LmZyb20oIFxuICAgICAgICAgICAgICAgIG5ldyBTZXQoXG4gICAgICAgICAgICAgICAgICAgIGV2ZW50LmRhdGEubGlzdFxuICAgICAgICAgICAgICAgICAgICAgICAgLmZpbHRlciggaSA9PiAhIWkuc2lkIClcbiAgICAgICAgICAgICAgICAgICAgICAgIC5tYXAoIG8gPT4gby5waWQgKVxuICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICk7XG5cbiAgICAgICAgICAgIGNvbnN0IGJlbG9uZ0dvb2RzJCA9IGF3YWl0IFByb21pc2UuYWxsKCBiZWxvbmdHb29kSWRzLm1hcCggcGlkID0+IHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZGIuY29sbGVjdGlvbignZ29vZHMnKVxuICAgICAgICAgICAgICAgICAgICAuZG9jKCBTdHJpbmcoIHBpZCApKVxuICAgICAgICAgICAgICAgICAgICAuZ2V0KCApO1xuICAgICAgICAgICAgfSkpO1xuICAgICAgICAgICBcbiAgICAgICAgICAgIGNvbnN0IGdvb2RzID0gZ29vZERldGFpbHMkLm1hcCggeCA9PiB4LmRhdGFbIDAgXSkuZmlsdGVyKCB5ID0+ICEheSApLmZpbHRlciggeiA9PiAhei5waWQgKTtcbiAgICAgICAgICAgIGNvbnN0IHN0YW5kYXJkcyA9IGdvb2REZXRhaWxzJC5tYXAoIHggPT4geC5kYXRhWyAwIF0pLmZpbHRlciggeSA9PiAhIXkgKS5maWx0ZXIoIHogPT4gISF6LnBpZCApO1xuICAgICAgICAgICAgY29uc3QgYmVsb25nR29vZHMgPSBiZWxvbmdHb29kcyQubWFwKCB4ID0+IHguZGF0YSApO1xuXG4gICAgICAgICAgICAvLyDlupPlrZjkuI3otrNcbiAgICAgICAgICAgIGxldCBsb3dTdG9jazogYW55ID0gWyBdO1xuXG4gICAgICAgICAgICAvLyDooqvliKDpmaRcbiAgICAgICAgICAgIGxldCBoYXNCZWVuRGVsZXRlOiBhbnkgPSBbIF07XG5cbiAgICAgICAgICAgIC8vIOS5sOS4jeWIsFxuICAgICAgICAgICAgLy8gY29uc3QgY2Fubm90QnV5ID0gZmluZGluZ3MkLm1hcCggeCA9PiB4LmRhdGFbIDAgXSkuZmlsdGVyKCB5ID0+ICEheSApO1xuICAgICAgICAgICAgY29uc3QgY2Fubm90QnV5ID0gWyBdO1xuXG4gICAgICAgICAgICAvLyDlt7Lnu4/ooqvotK3kubDkuobvvIjpo47pmanljZXvvIlcbiAgICAgICAgICAgIC8vIGNvbnN0IGhhc0JlZW5CdXkgPSBoYXNCZWVuQnV5JC5tYXAoIHggPT4geC5kYXRhWyAwIF0pLmZpbHRlciggeSA9PiAhIXkgKVxuICAgICAgICAgICAgY29uc3QgaGFzQmVlbkJ1eSA9IFsgXTtcblxuICAgICAgICAgICAgZXZlbnQuZGF0YS5saXN0Lm1hcCggaSA9PiB7XG4gICAgICAgICAgICAgICAgLy8g5Z6L5Y+3XG4gICAgICAgICAgICAgICAgaWYgKCAhIWkuc2lkICkge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBiZWxvbmdHb29kID0gYmVsb25nR29vZHMuZmluZCggeCA9PiB4Ll9pZCA9PT0gaS5waWQgKTtcbiAgICAgICAgICAgICAgICAgICAgY29uc3Qgc3RhbmRhcmQgPSBzdGFuZGFyZHMuZmluZCggeCA9PiB4Ll9pZCA9PT0gaS5zaWQgJiYgeC5waWQgPT09IGkucGlkICk7XG5cbiAgICAgICAgICAgICAgICAgICAgLy8g5Z6L5Y+35pys6Lqr6KKr5Yig6Zmk44CB5Li75L2T5pys6Lqr6KKr5LiL5p62L+WIoOmZpFxuICAgICAgICAgICAgICAgICAgICBpZiAoICFzdGFuZGFyZCB8fCAoICEhc3RhbmRhcmQgJiYgc3RhbmRhcmQuaXNEZWxldGUgKSB8fCAoICEhYmVsb25nR29vZCAmJiAhYmVsb25nR29vZC52aXNpYWJsZSApIHx8ICggISFiZWxvbmdHb29kICYmIGJlbG9uZ0dvb2QuaXNEZWxldGUgKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaGFzQmVlbkRlbGV0ZS5wdXNoKCBpICk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoIHN0YW5kYXJkLnN0b2NrICE9PSB1bmRlZmluZWQgJiYgIHN0YW5kYXJkLnN0b2NrIDwgaS5jb3VudCApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxvd1N0b2NrLnB1c2goIE9iamVjdC5hc3NpZ24oeyB9LCBpLCB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc3RvY2s6IHN0YW5kYXJkLnN0b2NrLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGdvb2ROYW1lOiBpLm5hbWUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc3RhbmRlck5hbWU6IGkuc3RhbmRlcm5hbWVcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIC8vIOS4u+S9k+WVhuWTgVxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGdvb2QgPSBnb29kcy5maW5kKCB4ID0+IHguX2lkID09PSBpLnBpZCApO1xuICAgICAgICAgICAgICAgICAgICBpZiAoICFnb29kIHx8ICggISFnb29kICYmICFnb29kLnZpc2lhYmxlICkgfHwgKCAhIWdvb2QgJiYgZ29vZC5pc0RlbGV0ZSApKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBoYXNCZWVuRGVsZXRlLnB1c2goIGkgKVxuICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKCBnb29kLnN0b2NrICE9PSB1bmRlZmluZWQgJiYgIGdvb2Quc3RvY2sgPCBpLmNvdW50ICkge1xuICAgICAgICAgICAgICAgICAgICAgICAgbG93U3RvY2sucHVzaCggT2JqZWN0LmFzc2lnbih7IH0sIGksIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdG9jazogZ29vZC5zdG9jayxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBnb29kTmFtZTogaS5uYW1lXG4gICAgICAgICAgICAgICAgICAgICAgICB9KSk7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBsZXQgb3JkZXJzID0gWyBdO1xuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiDlpoLmnpzlj6/ku6XotK3kubBcbiAgICAgICAgICAgICAqICEg5om56YeP5Yib5bu66aKE5LuY6K6i5Y2VXG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIGlmICggbG93U3RvY2subGVuZ3RoID09PSAwICYmIGNhbm5vdEJ1eS5sZW5ndGggPT09IDAgJiYgaGFzQmVlbkRlbGV0ZS5sZW5ndGggPT09IDAgKSB7XG5cbiAgICAgICAgICAgICAgICBjb25zdCByZXFEYXRhID0ge1xuICAgICAgICAgICAgICAgICAgICB0aWQsXG4gICAgICAgICAgICAgICAgICAgIG9wZW5JZCxcbiAgICAgICAgICAgICAgICAgICAgZnJvbTogZXZlbnQuZGF0YS5mcm9tIHx8ICdzeXN0ZW0nLFxuICAgICAgICAgICAgICAgICAgICBvcmRlcnM6IGV2ZW50LmRhdGEubGlzdFxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGNvbnN0IGNyZWF0ZU9yZGVyJCA9IGF3YWl0IGNsb3VkLmNhbGxGdW5jdGlvbih7XG4gICAgICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRhdGE6IHJlcURhdGEsXG4gICAgICAgICAgICAgICAgICAgICAgICAkdXJsOiAnY3JlYXRlJ1xuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICBuYW1lOiAnb3JkZXInXG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICBpZiAoIGNyZWF0ZU9yZGVyJC5yZXN1bHQuc3RhdHVzICE9PSAyMDAgKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBjdHguYm9keSA9IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0YXR1czogNTAwLFxuICAgICAgICAgICAgICAgICAgICAgICAgbWVzc2FnZTogJ+WIm+W7uumihOS7mOiuouWNleWksei0pe+8gSdcbiAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgb3JkZXJzID0gY3JlYXRlT3JkZXIkLnJlc3VsdC5kYXRhO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gY3R4LmJvZHkgPSB7XG4gICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgICBsb3dTdG9jayxcbiAgICAgICAgICAgICAgICAgICAgaGFzQmVlbkRlbGV0ZSxcbiAgICAgICAgICAgICAgICAgICAgY2Fubm90QnV5LFxuICAgICAgICAgICAgICAgICAgICBoYXNCZWVuQnV5LFxuICAgICAgICAgICAgICAgICAgICBvcmRlcnNcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHN0YXR1czogMjAwXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfSBjYXRjaCAoIGUgKSB7XG4gICAgIFxuICAgICAgICAgICAgcmV0dXJuIGN0eC5ib2R5ID0ge1xuICAgICAgICAgICAgICAgIHN0YXR1czogNTAwLFxuICAgICAgICAgICAgICAgIG1lc3NhZ2U6IGVcbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgIC8qKlxuICAgICAqIEBkZXNjcmlwdGlvblxuICAgICAqIOeUseiuouWNleWIm+W7uui0reeJqea4heWNlVxuICAgICAqIGxpc3Q6IHtcbiAgICAgKiAgICB0aWQsXG4gICAgICogICAgcGlkLFxuICAgICAqICAgIHNpZCxcbiAgICAgKiAgICBvaWQsXG4gICAgICogICAgcHJpY2UsXG4gICAgICogICAgZ3JvdXBQcmljZSxcbiAgICAgKiEgICBhY2lkXG4gICAgICogfVsgXVxuICAgICAqL1xuICAgIGFwcC5yb3V0ZXIoJ2NyZWF0ZScsIGFzeW5jKCBjdHgsIG5leHQgKSA9PiB7XG4gICAgICAgIHRyeSB7XG5cbiAgICAgICAgICAgIGNvbnN0IHsgbGlzdCwgb3BlbklkIH0gPSBldmVudC5kYXRhO1xuIFxuICAgICAgICAgICAgYXdhaXQgUHJvbWlzZS5hbGwoIGxpc3QubWFwKCBhc3luYyBvcmRlck1ldGEgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IHsgdGlkLCBwaWQsIHNpZCwgb2lkLCBwcmljZSwgZ3JvdXBQcmljZSwgYWNpZCB9ID0gb3JkZXJNZXRhO1xuICAgICAgICAgICAgICAgIGxldCBxdWVyeSA9IHtcbiAgICAgICAgICAgICAgICAgICAgdGlkLFxuICAgICAgICAgICAgICAgICAgICBwaWRcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIGlmICggISFzaWQgKSB7XG4gICAgICAgICAgICAgICAgICAgIHF1ZXJ5WydzaWQnXSA9IHNpZDtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAvLyDmj5LlhaXmtLvliqjnmoTmn6Xor6LmnaHku7ZcbiAgICAgICAgICAgICAgICBpZiAoICEhYWNpZCApIHtcbiAgICAgICAgICAgICAgICAgICAgcXVlcnkgPSBPYmplY3QuYXNzaWduKHsgfSwgcXVlcnksIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGFjaWRcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgY29uc3QgZmluZCQgPSBhd2FpdCBkYi5jb2xsZWN0aW9uKCdzaG9wcGluZy1saXN0JylcbiAgICAgICAgICAgICAgICAgICAgLndoZXJlKCBxdWVyeSApXG4gICAgICAgICAgICAgICAgICAgIC5nZXQoICk7XG5cbiAgICAgICAgICAgICAgICBpZiAoIGZpbmQkLmRhdGEubGVuZ3RoID09PSAwICkge1xuXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IG1ldGEgPSBPYmplY3QuYXNzaWduKHsgfSwgcXVlcnkse1xuICAgICAgICAgICAgICAgICAgICAgICAgYWNpZDogYWNpZCB8fCB1bmRlZmluZWRcbiAgICAgICAgICAgICAgICAgICAgfSx7XG4gICAgICAgICAgICAgICAgICAgICAgICBvaWRzOiBbIG9pZCBdLFxuICAgICAgICAgICAgICAgICAgICAgICAgdWlkczogWyBvcGVuSWQgXSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHB1cmNoYXNlOiAwLFxuICAgICAgICAgICAgICAgICAgICAgICAgYnV5X3N0YXR1czogJzAnLFxuICAgICAgICAgICAgICAgICAgICAgICAgYmFzZV9zdGF0dXM6ICcwJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGFkanVzdFByaWNlOiBwcmljZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGFkanVzdEdyb3VwUHJpY2U6IGdyb3VwUHJpY2UsXG4gICAgICAgICAgICAgICAgICAgICAgICBjcmVhdGVUaW1lOiBuZXcgRGF0ZSggKS5nZXRUaW1lKCApXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICBcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgY3JlYWV0JCA9IGF3YWl0IGRiLmNvbGxlY3Rpb24oJ3Nob3BwaW5nLWxpc3QnKVxuICAgICAgICAgICAgICAgICAgICAgICAgLmFkZCh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YTogbWV0YVxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuXG4gICAgICAgICAgICAgICAgLy8g5pu05paw5o+S5YWlXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgbGV0IG1ldGFTaG9wcGluZ0xpc3QgPSBmaW5kJC5kYXRhWyAwIF07XG4gICAgICAgICAgICAgICAgICAgIGlmICggIW1ldGFTaG9wcGluZ0xpc3Qub2lkcy5maW5kKCB4ID0+IHggPT09IG9pZCApKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBsYXN0T2lkcyA9IG1ldGFTaG9wcGluZ0xpc3Qub2lkcztcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGxhc3RVaWRzID0gbWV0YVNob3BwaW5nTGlzdC51aWRzO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyDmj5LlhaXliLDlpLTpg6jvvIzmnIDmlrDnmoTlt7LmlK/ku5jorqLljZXlsLHlnKjkuIrpnaJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxhc3RPaWRzLnVuc2hpZnQoIG9pZCApO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoICFsYXN0VWlkcy5maW5kKCB4ID0+IHggPT09IG9wZW5JZCApKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGFzdFVpZHMudW5zaGlmdCggb3BlbklkICk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHVwZGF0ZSQgPSBhd2FpdCBkYi5jb2xsZWN0aW9uKCdzaG9wcGluZy1saXN0JykuZG9jKCBTdHJpbmcoIGZpbmQkLmRhdGFbIDAgXS5faWQgKSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAudXBkYXRlKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb2lkczogbGFzdE9pZHMsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB1aWRzOiBsYXN0VWlkcyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHVwZGF0ZVRpbWU6IG5ldyBEYXRlKCApLmdldFRpbWUoIClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgfSkpO1xuXG4gICAgICAgICAgICByZXR1cm4gY3R4LmJvZHkgPSB7XG4gICAgICAgICAgICAgICAgc3RhdHVzOiAyMDBcbiAgICAgICAgICAgIH1cblxuICAgICAgICB9IGNhdGNoICggZSApIHsgcmV0dXJuIGN0eC5ib2R5ID0geyBzdGF0dXM6IDUwMCB9fVxuICAgIH0pO1xuXG4gICAgLyoqXG4gICAgICogQGRlc2NyaXB0aW9uIFxuICAgICAqIHtcbiAgICAgKiAgICAgdGlkLCBcbiAgICAgKiAgICAgbmVlZE9yZGVycyDmmK/lkKbpnIDopoHov5Tlm57orqLljZVcbiAgICAgKiB9XG4gICAgICog6KGM56iL55qE6LSt54mp5riF5Y2V77yM55So5LqO6LCD5pW05ZWG5ZOB5Lu35qC844CB6LSt5Lmw5pWw6YePXG4gICAgICovXG4gICAgYXBwLnJvdXRlcignbGlzdCcsIGFzeW5jKCBjdHgsIG5leHQgKSA9PiB7XG4gICAgICAgIHRyeSB7XG5cbiAgICAgICAgICAgIGxldCBvcmRlcnMkOiBhbnkgPSBbIF07XG5cbiAgICAgICAgICAgIGNvbnN0IHsgdGlkLCBuZWVkT3JkZXJzLCAgfSA9IGV2ZW50LmRhdGE7XG4gICAgICAgICAgICBjb25zdCBvcGVuaWQgPSBldmVudC5kYXRhLm9wZW5JZCB8fCBldmVudC51c2VySW5mby5vcGVuSWQ7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgLy8g5ou/5Yiw6KGM56iL5LiL5omA5pyJ55qE6LSt54mp5riF5Y2VXG4gICAgICAgICAgICBjb25zdCBsaXN0cyQgPSBhd2FpdCBkYi5jb2xsZWN0aW9uKCdzaG9wcGluZy1saXN0JylcbiAgICAgICAgICAgICAgICAud2hlcmUoe1xuICAgICAgICAgICAgICAgICAgICB0aWRcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIC5nZXQoICk7XG4gICAgICAgICAgIFxuICAgICAgICAgICAgLy8g5p+l6K+i5q+P5p2h5riF5Y2V5bqV5LiL55qE5q+P5Liqb3JkZXLor6bmg4XvvIzov5nph4znmoTmr4/kuKpvcmRlcumDveaYr+W3suS7mOiuoumHkeeahFxuICAgICAgICAgICAgaWYgKCBuZWVkT3JkZXJzICE9PSBmYWxzZcKgKSB7XG4gICAgICAgICAgICAgICAgb3JkZXJzJCA9IGF3YWl0IFByb21pc2UuYWxsKCBsaXN0cyQuZGF0YS5tYXAoIGxpc3QgPT4ge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gUHJvbWlzZS5hbGwoIGxpc3Qub2lkcy5tYXAoIGFzeW5jIG9pZCA9PiB7XG4gICAgXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBvcmRlciQgPSBhd2FpdCBkYi5jb2xsZWN0aW9uKCdvcmRlcicpLmRvYyggb2lkIClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAuZ2V0KCApO1xuICAgIFxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgdXNlciQgPSBhd2FpdCBkYi5jb2xsZWN0aW9uKCd1c2VyJylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAud2hlcmUoe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvcGVuaWQ6IG9yZGVyJC5kYXRhLm9wZW5pZFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLmdldCggKTtcbiAgICBcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBPYmplY3QuYXNzaWduKHsgfSwgb3JkZXIkLmRhdGEsIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB1c2VyOiB1c2VyJC5kYXRhWyAwIF1cbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICB9KSk7XG4gICAgICAgICAgICAgICAgfSkpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyDmn6Xor6Lmr4/mnaHmuIXljZXlupXkuIvmr4/kuKrllYblk4HnmoTor6bmg4VcbiAgICAgICAgICAgIGNvbnN0IGdvb2RzJDogYW55ID0gYXdhaXQgUHJvbWlzZS5hbGwoIGxpc3RzJC5kYXRhLm1hcCggYXN5bmMgbGlzdCA9PiB7XG5cbiAgICAgICAgICAgICAgICBjb25zdCB7IHBpZCwgc2lkIH0gPSBsaXN0O1xuICAgICAgICAgICAgICAgIGNvbnN0IGNvbGxlY3Rpb25OYW1lID0gISFzaWQgPyAnc3RhbmRhcmRzJyA6ICdnb29kcyc7XG5cbiAgICAgICAgICAgICAgICAvLyDlnovlj7dcbiAgICAgICAgICAgICAgICBsZXQgc3RhbmRhciQ6IGFueSA9IG51bGw7XG5cbiAgICAgICAgICAgICAgICAvLyDllYblk4FcbiAgICAgICAgICAgICAgICBjb25zdCBnb29kJCA9IGF3YWl0IGRiLmNvbGxlY3Rpb24oJ2dvb2RzJylcbiAgICAgICAgICAgICAgICAgICAgLmRvYyggcGlkIClcbiAgICAgICAgICAgICAgICAgICAgLmdldCggKTtcblxuICAgICAgICAgICAgICAgIGlmICggISFzaWQgKSB7XG4gICAgICAgICAgICAgICAgICAgIHN0YW5kYXIkID0gYXdhaXQgZGIuY29sbGVjdGlvbignc3RhbmRhcmRzJylcbiAgICAgICAgICAgICAgICAgICAgICAgIC5kb2MoIHNpZCApXG4gICAgICAgICAgICAgICAgICAgICAgICAuZ2V0KCApO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgICAgIHRhZzogZ29vZCQuZGF0YS50YWcsXG4gICAgICAgICAgICAgICAgICAgIHRpdGxlOiBnb29kJC5kYXRhLnRpdGxlLFxuICAgICAgICAgICAgICAgICAgICBuYW1lOiBzdGFuZGFyJCA/IHN0YW5kYXIkLmRhdGEubmFtZSA6ICcnLFxuICAgICAgICAgICAgICAgICAgICBwcmljZTogc3RhbmRhciQgPyBzdGFuZGFyJC5kYXRhLnByaWNlIDogZ29vZCQuZGF0YS5wcmljZSxcbiAgICAgICAgICAgICAgICAgICAgaW1nOiBzdGFuZGFyJCA/IHN0YW5kYXIkLmRhdGEuaW1nIDogZ29vZCQuZGF0YS5pbWdbIDAgXSxcbiAgICAgICAgICAgICAgICAgICAgZ3JvdXBQcmljZTogc3RhbmRhciQgPyBzdGFuZGFyJC5kYXRhLmdyb3VwUHJpY2UgOiBnb29kJC5kYXRhLmdyb3VwUHJpY2UsXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSkpO1xuXG4gICAgICAgICAgICAvLyDmn6Xor6LmuIXljZXlr7nlupTnmoTmtLvliqjor6bmg4VcbiAgICAgICAgICAgIGNvbnN0IGFjdGl2aXRpZXMkOiBhbnkgPSBhd2FpdCBQcm9taXNlLmFsbCggbGlzdHMkLmRhdGEubWFwKCBhc3luYyBsaXN0ID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCB7IGFjaWQgfSA9IGxpc3Q7XG4gICAgICAgICAgICAgICAgaWYgKCAhYWNpZCApIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGFjX3ByaWNlOiBudWxsLFxuICAgICAgICAgICAgICAgICAgICAgICAgYWNfZ3JvdXBQcmljZTogbnVsbFxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgbWV0YSA9IGF3YWl0IGRiLmNvbGxlY3Rpb24oJ2FjdGl2aXR5JylcbiAgICAgICAgICAgICAgICAgICAgICAgIC5kb2MoIFN0cmluZyggYWNpZCApKVxuICAgICAgICAgICAgICAgICAgICAgICAgLmdldCggKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGFjX3ByaWNlOiBtZXRhLmRhdGEuYWNfcHJpY2UsXG4gICAgICAgICAgICAgICAgICAgICAgICBhY19ncm91cFByaWNlOiBtZXRhLmRhdGEuYWNfZ3JvdXBQcmljZSxcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pKTtcblxuICAgICAgICAgICAgY29uc3QgbGlzdCA9IGxpc3RzJC5kYXRhLm1hcCgoIGwsIGsgKSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3QgeyBhY19ncm91cFByaWNlLCBhY19wcmljZSB9ID0gYWN0aXZpdGllcyRbIGsgXTtcbiAgICAgICAgICAgICAgICBjb25zdCB7IGltZywgcHJpY2UsIGdyb3VwUHJpY2UsIHRpdGxlLCBuYW1lLCB0YWcgfSA9IGdvb2RzJFsgayBdO1xuICAgICAgICAgICAgICAgIGxldCBtZXRhID0gT2JqZWN0LmFzc2lnbih7IH0sIGwsIHtcbiAgICAgICAgICAgICAgICAgICAgdGFnLFxuICAgICAgICAgICAgICAgICAgICBpbWcsXG4gICAgICAgICAgICAgICAgICAgIHByaWNlLFxuICAgICAgICAgICAgICAgICAgICBncm91cFByaWNlLFxuICAgICAgICAgICAgICAgICAgICBnb29kTmFtZTogdGl0bGUsXG4gICAgICAgICAgICAgICAgICAgIHN0YW5kYXJOYW1lOiBuYW1lLFxuICAgICAgICAgICAgICAgICAgICBhY19ncm91cFByaWNlLFxuICAgICAgICAgICAgICAgICAgICBhY19wcmljZVxuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgaWYgKCBuZWVkT3JkZXJzICE9PSBmYWxzZSApIHtcbiAgICAgICAgICAgICAgICAgICAgbWV0YSA9IE9iamVjdC5hc3NpZ24oeyB9LCBtZXRhLCB7XG4gICAgICAgICAgICAgICAgICAgICAgICBvcmRlcjogb3JkZXJzJFsgayBdLFxuICAgICAgICAgICAgICAgICAgICAgICAgdG90YWw6IG9yZGVycyRbIGsgXS5yZWR1Y2UoKCB4LCB5ICkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB4ICsgeS5jb3VudDtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sIDAgKVxuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHJldHVybiBtZXRhO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHJldHVybiBjdHguYm9keSA9IHtcbiAgICAgICAgICAgICAgICBzdGF0dXM6IDIwMCxcbiAgICAgICAgICAgICAgICBkYXRhOiBsaXN0LFxuICAgICAgICAgICAgfVxuXG4gICAgICAgIH0gY2F0Y2ggKCBlICkgeyByZXR1cm4gY3R4LmJvZHkgPSB7IHN0YXR1czogNTAwIH07fVxuICAgIH0pXG5cbiAgICAvKipcbiAgICAgKiDotK3nianmuIXljZXosIPmlbRcbiAgICAgKiAtLS0tLS0tLSDor7fmsYJcbiAgICAgKiB7XG4gICAgICogICAgc2hvcHBpbmdJZCwgYWRqdXN0UHJpY2UsIHB1cmNoYXNlLCBhZGp1c3RHcm91cFByaWNlXG4gICAgICogfVxuICAgICAqL1xuICAgIGFwcC5yb3V0ZXIoJ2FkanVzdCcsIGFzeW5jKCBjdHgsIG5leHQgKSA9PiB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGNvbnN0IHsgc2hvcHBpbmdJZCwgYWRqdXN0UHJpY2UsIGFkanVzdEdyb3VwUHJpY2UgfSA9IGV2ZW50LmRhdGE7XG5cbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICog5riF5Y2V77yM5YWI5ou/5Yiw6K6i5Y2V6YeH6LSt5oC75pWwXG4gICAgICAgICAgICAgKiDpmo/lkI7mm7TmlrDvvJrph4fotK3ph4/jgIHmuIXljZXllK7ku7fjgIHmuIXljZXlm6LotK3ku7fjgIFiYXNlX3N0YXR1c+OAgWJ1eV9zdGF0dXNcbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgY29uc3Qgc2hvcHBpbmckID0gYXdhaXQgZGIuY29sbGVjdGlvbignc2hvcHBpbmctbGlzdCcpXG4gICAgICAgICAgICAgICAgLmRvYyggc2hvcHBpbmdJZCApXG4gICAgICAgICAgICAgICAgLmdldCggKTtcbiAgIFxuICAgICAgICAgICAgY29uc29sZS5sb2coJzExMTExMScsIHNob3BwaW5nJCApO1xuXG4gICAgICAgICAgICBjb25zdCBvcmRlcnMkID0gYXdhaXQgUHJvbWlzZS5hbGwoIHNob3BwaW5nJC5kYXRhLm9pZHMubWFwKCBvaWQgPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiBkYi5jb2xsZWN0aW9uKCdvcmRlcicpXG4gICAgICAgICAgICAgICAgICAgIC5kb2MoIG9pZCApXG4gICAgICAgICAgICAgICAgICAgIC5nZXQoICk7XG4gICAgICAgICAgICB9KSk7XG5cbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCcyMjIyMjIyJywgb3JkZXJzJCApO1xuXG4gICAgICAgICAgICAvLyDliankvZnliIbphY3ph49cbiAgICAgICAgICAgIGxldCBsYXN0QWxsb2NhdGVkID0gMDtcblxuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiDmgLvliIbphY3ph49cbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgbGV0IHB1cmNoYXNlID0gZXZlbnQuZGF0YS5wdXJjaGFzZTtcblxuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiAhIOS8oOWFpeWIhumFjemHj+S4jeiDveWwkeS6juOAguW3suWujOaIkOWIhumFjeiuouWNleeahOaVsOmineS5i+WSjFxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICBjb25zdCBmaW5pc2hBZGp1c3RPcmRlcnMgPSBvcmRlcnMkXG4gICAgICAgICAgICAgICAgLm1hcCgoIHg6IGFueSApID0+IHguZGF0YSApXG4gICAgICAgICAgICAgICAgLmZpbHRlciggbyA9PiBvLmJhc2Vfc3RhdHVzID09PSAnMicgKTtcblxuICAgICAgICAgICAgY29uc29sZS5sb2coJzMzMzMzMycsIGZpbmlzaEFkanVzdE9yZGVycyk7XG5cbiAgICAgICAgICAgIC8vIOW3suWIhumFjemHj1xuICAgICAgICAgICAgY29uc3QgaGFzQmVlbkFkanVzdCA9IGZpbmlzaEFkanVzdE9yZGVycy5yZWR1Y2UoKCB4LCB5ICkgPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiB4ICsgeS5hbGxvY2F0ZWRDb3VudDtcbiAgICAgICAgICAgIH0sIDAgKTtcblxuICAgICAgICAgICAgY29uc29sZS5sb2coJzQ0NDQ0NCcsIGhhc0JlZW5BZGp1c3QgKTtcblxuICAgICAgICAgICAgaWYgKCBwdXJjaGFzZSA8IGhhc0JlZW5BZGp1c3QgKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGN0eC5ib2R5ID0ge1xuICAgICAgICAgICAgICAgICAgICBzdGF0dXM6IDUwMCxcbiAgICAgICAgICAgICAgICAgICAgbWVzc2FnZTogYOaciSR7ZmluaXNoQWRqdXN0T3JkZXJzLmxlbmd0aH3kuKrorqLljZXlt7Lnoa7orqTvvIzmlbDph4/kuI3og73lsJHkuo4ke2hhc0JlZW5BZGp1c3R95Lu2YFxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIFxuICAgICAgICAgICAgbGV0IG5lZWRCdXlUb3RhbCA9IG9yZGVycyQucmVkdWNlKCggeCwgeSApID0+IHtcbiAgICAgICAgICAgICAgICByZXR1cm4geCArICh5IGFzIGFueSkuZGF0YS5jb3VudDtcbiAgICAgICAgICAgIH0sIDAgKTtcblxuICAgICAgICAgICAgY29uc3QgdGVtcCA9IE9iamVjdC5hc3NpZ24oeyB9LCBzaG9wcGluZyQuZGF0YSwge1xuICAgICAgICAgICAgICAgIHB1cmNoYXNlLFxuICAgICAgICAgICAgICAgIGFkanVzdFByaWNlLFxuICAgICAgICAgICAgICAgIGFkanVzdEdyb3VwUHJpY2UsXG4gICAgICAgICAgICAgICAgYmFzZV9zdGF0dXM6ICcxJyxcbiAgICAgICAgICAgICAgICBidXlfc3RhdHVzOiBwdXJjaGFzZSA8IG5lZWRCdXlUb3RhbCA/ICcyJyA6ICcxJyxcbiAgICAgICAgICAgICAgICB1cGRhdGVUaW1lOiBuZXcgRGF0ZSggKS5nZXRUaW1lKCApXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgZGVsZXRlIHRlbXBbJ19pZCddO1xuXG4gICAgICAgICAgICBjb25zb2xlLmxvZygnNTU1NTU1JywgdGVtcClcblxuICAgICAgICAgICAgLy8g5pu05paw5riF5Y2VXG4gICAgICAgICAgICBhd2FpdCBkYi5jb2xsZWN0aW9uKCdzaG9wcGluZy1saXN0JylcbiAgICAgICAgICAgICAgICAuZG9jKCBzaG9wcGluZ0lkIClcbiAgICAgICAgICAgICAgICAuc2V0KHtcbiAgICAgICAgICAgICAgICAgICAgZGF0YTogdGVtcFxuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqICHku6XkuIvorqLljZXpg73mmK/lt7Lku5jorqLph5HnmoRcbiAgICAgICAgICAgICAqIOiuouWNle+8muaJuemHj+WvueiuouWNleeahOS7t+agvOOAgeWboui0reS7t+OAgei0reS5sOeKtuaAgei/m+ihjOiwg+aVtCjlt7LotK3kubAv6L+b6KGM5Lit77yM5YW25LuW5bey57uP56Gu5a6a6LCD5pW055qE6K6i5Y2V77yM5LiN5YGa5aSE55CGKVxuICAgICAgICAgICAgICog5YW25a6e5bqU6K+l5Lmf6KaB6Ieq5Yqo5rOo5YWl6K6i5Y2V5pWw6YeP77yI562W55Wl77ya5YWI5Yiw5YWI5b6X77yM5ZCO5LiL5Y2V5Lya5pyJ5b6X5LiN5Yiw5Y2V55qE6aOO6Zmp77yJXG4gICAgICAgICAgICAgKiAh5aaC5p6c5bey57uP5YiG6YWN6L+H5LqG77yM5YiZ5LiN5YaN6Ieq5Yqo5YiG6YWN6YeH6LSt6YePXG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIGNvbnN0IHNvcnJlZE9yZGVycyA9IG9yZGVycyRcbiAgICAgICAgICAgICAgICAubWFwKCggeDogYW55ICkgPT4geC5kYXRhIClcbiAgICAgICAgICAgICAgICAuZmlsdGVyKCggeDogYW55ICkgPT4geC5iYXNlX3N0YXR1cyA9PT0gJzAnIHx8IHguYmFzZV9zdGF0dXMgPT09ICcxJyApXG4gICAgICAgICAgICAgICAgLnNvcnQoKCB4OiBhbnksIHk6IGFueSApID0+IHguY3JlYXRlVGltZSAtIHkuY3JlYXRlVGltZSApO1xuXG4gICAgICAgICAgICBjb25zb2xlLmxvZygnNjY2NjY2Jywgc29ycmVkT3JkZXJzICk7XG5cbiAgICAgICAgICAgIC8vIOWJqeS9meWIhumFjemHj1xuICAgICAgICAgICAgcHVyY2hhc2UgLT0gaGFzQmVlbkFkanVzdDtcblxuICAgICAgICAgICAgY29uc29sZS5sb2coICc3NzcnLCBwdXJjaGFzZSApO1xuICAgICAgICBcbiAgICAgICAgICAgIGF3YWl0IFByb21pc2UuYWxsKCBzb3JyZWRPcmRlcnMubWFwKCBhc3luYyBvcmRlciA9PiB7XG5cbiAgICAgICAgICAgICAgICBjb25zdCBiYXNlVGVtcCA9IHtcbiAgICAgICAgICAgICAgICAgICAgYWxsb2NhdGVkUHJpY2U6IGFkanVzdFByaWNlLFxuICAgICAgICAgICAgICAgICAgICBhbGxvY2F0ZWRHcm91cFByaWNlOiBhZGp1c3RHcm91cFByaWNlLFxuICAgICAgICAgICAgICAgICAgICAvLyDml6Dorrroh6rliqjliIbphY3mmK/lkKbmiJDlip/vvIzpg73mmK/ooqvigJzliIbphY3igJ3mk43kvZzov4fnmoRcbiAgICAgICAgICAgICAgICAgICAgYmFzZV9zdGF0dXM6ICcxJyxcbiAgICAgICAgICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgICAgICAgICAqICEgdjE6IOWJqeS9meWIhumFjemHj+S4jei2s+mHh+i0remHj+WwseWIhumFjTBcbiAgICAgICAgICAgICAgICAgICAgICogISB2Mjog5Ymp5L2Z5YiG6YWN6YeP5LiN6Laz6YeH6LSt6YeP77yM5bCx5YiG6YWN5Ymp5L2Z55qE6YeH6LSt6YePXG4gICAgICAgICAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgICAgICAgICAvLyBhbGxvY2F0ZWRDb3VudDogcHVyY2hhc2UgLSBvcmRlci5jb3VudCA+PSAwID8gb3JkZXIuY291bnQgOiAwXG4gICAgICAgICAgICAgICAgICAgIGFsbG9jYXRlZENvdW50OiBwdXJjaGFzZSAtIG9yZGVyLmNvdW50ID49IDAgP1xuICAgICAgICAgICAgICAgICAgICAgICAgb3JkZXIuY291bnQgOlxuICAgICAgICAgICAgICAgICAgICAgICAgcHVyY2hhc2VcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIC8vIOWIhumFjeaIkOWKn1xuICAgICAgICAgICAgICAgIGlmICggcHVyY2hhc2UgLSBvcmRlci5jb3VudCA+PSAwICkge1xuICAgICAgICAgICAgICAgICAgICBsYXN0QWxsb2NhdGVkID0gcHVyY2hhc2UgLSBvcmRlci5jb3VudDtcbiAgICAgICAgICAgICAgICAgICAgcHVyY2hhc2UgLT0gb3JkZXIuY291bnQ7XG5cbiAgICAgICAgICAgICAgICAvLyDotKfmupDkuI3otrPvvIzliIbphY3mnIDlkI7nmoTliankvZnph49cbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBsYXN0QWxsb2NhdGVkID0gMDtcbiAgICAgICAgICAgICAgICAgICAgcHVyY2hhc2UgPSAwO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGNvbnN0IHRlbXAgPSBPYmplY3QuYXNzaWduKHsgfSwgb3JkZXIsIGJhc2VUZW1wICk7XG5cbiAgICAgICAgICAgICAgICBkZWxldGUgdGVtcFsnX2lkJ107XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgYXdhaXQgZGIuY29sbGVjdGlvbignb3JkZXInKVxuICAgICAgICAgICAgICAgICAgICAuZG9jKCBvcmRlci5faWQgKVxuICAgICAgICAgICAgICAgICAgICAuc2V0KHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRhdGE6IHRlbXBcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuXG4gICAgICAgICAgICB9KSk7XG5cbiAgICAgICAgICAgIC8vIOabtOaWsOa4heWNleeahOWJqeS9meWIhumFjeaVsFxuICAgICAgICAgICAgYXdhaXQgZGIuY29sbGVjdGlvbignc2hvcHBpbmctbGlzdCcpXG4gICAgICAgICAgICAgICAgLmRvYyggc2hvcHBpbmdJZCApXG4gICAgICAgICAgICAgICAgLnVwZGF0ZSh7XG4gICAgICAgICAgICAgICAgICAgIGRhdGE6IHsgbGFzdEFsbG9jYXRlZCB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgIFxuICAgICAgICAgICAgcmV0dXJuIGN0eC5ib2R5ID0ge1xuICAgICAgICAgICAgICAgIHN0YXR1czogMjAwXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfSBjYXRjaCAoIGUgKSB7IHJldHVybiBjdHguYm9keSA9IHsgc3RhdHVzOiA1MDAgfTt9XG4gICAgfSlcblxuICAgIC8qKlxuICAgICAqIEBkZXNjcmlwdGlvblxuICAgICAqIOiOt+WPluihjOeoi+mHjOaYr+WQpui/mOacieacquiwg+aVtOeahOa4heWNlVxuICAgICovXG4gICAgYXBwLnJvdXRlcignYWRqdXN0LXN0YXR1cycsIGFzeW5jKCBjdHgsIG5leHQgKSA9PiB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBjb25zdCB7IHRpZCB9ID0gZXZlbnQuZGF0YTtcbiAgICAgICAgICAgIGNvbnN0IGNvdW50ID0gYXdhaXQgZGIuY29sbGVjdGlvbignc2hvcHBpbmctbGlzdCcpXG4gICAgICAgICAgICAgICAgLndoZXJlKHtcbiAgICAgICAgICAgICAgICAgICAgdGlkLFxuICAgICAgICAgICAgICAgICAgICBiYXNlX3N0YXR1czogJzAnXG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAuY291bnQoICk7XG5cbiAgICAgICAgICAgIHJldHVybiBjdHguYm9keSA9IHtcbiAgICAgICAgICAgICAgICBzdGF0dXM6IDIwMCxcbiAgICAgICAgICAgICAgICBkYXRhOiBjb3VudC50b3RhbFxuICAgICAgICAgICAgfVxuXG4gICAgICAgIH0gY2F0Y2ggKCBlICkge1xuICAgICAgICAgICAgcmV0dXJuIGN0eC5ib2R5ID0geyBzdGF0dXM6IDUwMCB9O1xuICAgICAgICB9XG4gICAgfSlcblxuICAgIC8qKlxuICAgICAqIEBkZXNjcmlwdGlvblxuICAgICAqIOetieW+heaLvOWbouWIl+ihqCAvIOWPr+aLvOWbouWIl+ihqCAoIOWPr+aMh+WumuWVhuWTgTog5ZWG5ZOB6K+m5oOF6aG16Z2iIClcbiAgICAgKiB7XG4gICAgICogICAgdGlkLFxuICAgICAqICAgIHBpZCxcbiAgICAgKiAgICBsaW1pdFxuICAgICAqICAgIGRldGFpbDogYm9vbGVhbiDmmK/lkKbluKblm57llYblk4Hor6bmg4XvvIjpu5jorqTluKblm57vvIlcbiAgICAgKiAgICBzaG93VXNlcjogYm9vbGVhbiDmmK/lkKbpnIDopoHnlKjmiLflpLTlg4/nrYnkv6Hmga/vvIjpu5jorqTkuI3luKblm57vvIlcbiAgICAgKiAgICB0eXBlOiB1bmRlZmluZWQgfCAnd2FpdCcgfCAncGluJyAvLyDnrYnlvoXmi7zlm6LvvIzlt7Lmi7zlm6LvvIzlnYfmnIlcbiAgICAgKiB9XG4gICAgICovXG4gICAgYXBwLnJvdXRlcigncGluJywgYXN5bmMoIGN0eCwgbmV4dCApID0+IHtcbiAgICAgICAgdHJ5IHtcblxuICAgICAgICAgICAgY29uc3Qgb3BlbmlkID0gZXZlbnQudXNlckluZm8ub3BlbklkO1xuICAgICAgICAgICAgY29uc3QgeyB0aWQsIGRldGFpbCwgcGlkLCB0eXBlLCBsaW1pdCB9ID0gZXZlbnQuZGF0YTtcbiAgICAgICAgICAgIGNvbnN0IHNob3dVc2VyID0gZXZlbnQuZGF0YS5zaG93VXNlciB8fCBmYWxzZTtcblxuICAgICAgICAgICAgY29uc3QgcXVlcnkgPSBwaWQgPyB7XG4gICAgICAgICAgICAgICAgdGlkLFxuICAgICAgICAgICAgICAgIHBpZFxuICAgICAgICAgICAgfSA6IHtcbiAgICAgICAgICAgICAgICB0aWRcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIGxldCBzaG9wcGluZyQ7XG4gICAgICAgICAgICBpZiAoIGxpbWl0ICkge1xuICAgICAgICAgICAgICAgIHNob3BwaW5nJCA9IGF3YWl0IGRiLmNvbGxlY3Rpb24oJ3Nob3BwaW5nLWxpc3QnKVxuICAgICAgICAgICAgICAgICAgICAud2hlcmUoIHF1ZXJ5IClcbiAgICAgICAgICAgICAgICAgICAgLmxpbWl0KCBsaW1pdCApXG4gICAgICAgICAgICAgICAgICAgIC5nZXQoICk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHNob3BwaW5nJCA9IGF3YWl0IGRiLmNvbGxlY3Rpb24oJ3Nob3BwaW5nLWxpc3QnKVxuICAgICAgICAgICAgICAgICAgICAud2hlcmUoIHF1ZXJ5IClcbiAgICAgICAgICAgICAgICAgICAgLmdldCggKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIFxuXG4gICAgICAgICAgICAvLyB1aWRz6ZW/5bqm5Li6Me+8jOS4uuW+heaLvOWIl+ihqCAoIOafpeivouW+heaLvOWIl+ihqOaXtu+8jOWPr+S7peacieiHquW3se+8jOiuqeWuouaIt+efpemBk+ezu+e7n+S8muWIl+WHuuadpSApXG4gICAgICAgICAgICAvLyB1aWRz6ZW/5bqm5Li6Mu+8jOS4uuWPr+S7peaLvOWbouWIl+ihqFxuICAgICAgICAgICAgbGV0IGRhdGE6IGFueSA9IFsgXTtcbiAgICAgICAgICAgIGxldCBkYXRhJCA9IHNob3BwaW5nJC5kYXRhLmZpbHRlciggcyA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKCB0eXBlID09PSAncGluJyApIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuICEhcy5hZGp1c3RHcm91cFByaWNlICYmIHMudWlkcy5sZW5ndGggPiAxO1xuXG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmICggdHlwZSA9PT0gJ3dhaXQnICkge1xuICAgICAgICAgICAgICAgICAgICAvLyByZXR1cm4gISFzLmFkanVzdEdyb3VwUHJpY2UgJiYgcy51aWRzLmxlbmd0aCA9PT0gMSAmJiBzLnVpZHNbIDAgXSAhPT0gb3BlbmlkXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAhIXMuYWRqdXN0R3JvdXBQcmljZSAmJiBzLnVpZHMubGVuZ3RoID09PSAxO1xuXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gcmV0dXJuICggISFzLmFkanVzdEdyb3VwUHJpY2UgJiYgcy51aWRzLmxlbmd0aCA+IDEgKSB8fFxuICAgICAgICAgICAgICAgICAgICAvLyAgICAgKCAhIXMuYWRqdXN0R3JvdXBQcmljZSAmJiBzLnVpZHMubGVuZ3RoID09PSAxICYmIHMudWlkc1sgMCBdICE9PSBvcGVuaWQgKVxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gISFzLmFkanVzdEdyb3VwUHJpY2U7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIGRhdGEkID0gZGF0YSQuc29ydCgoIHgsIHkgKSA9PiB4LnVpZHMubGVuZ3RoIC0geS51aWRzLmxlbmd0aCApO1xuICAgICAgICAgICAgZGF0YSA9IGRhdGEkO1xuXG4gICAgICAgICAgICAvLyDmn6Xor6Lmr4/mnaHmuIXljZXlupXkuIvmr4/kuKrllYblk4HnmoTor6bmg4VcbiAgICAgICAgICAgIGlmICggZGV0YWlsID09PSB1bmRlZmluZWQgfHwgISFkZXRhaWwgKSB7XG5cbiAgICAgICAgICAgICAgICAvLyDllYblk4FcbiAgICAgICAgICAgICAgICBjb25zdCBnb29kSWRzID0gQXJyYXkuZnJvbShcbiAgICAgICAgICAgICAgICAgICAgbmV3IFNldCggZGF0YSQubWFwKCBsaXN0ID0+IFxuICAgICAgICAgICAgICAgICAgICAgICAgbGlzdC5waWRcbiAgICAgICAgICAgICAgICAgICAgKSlcbiAgICAgICAgICAgICAgICApO1xuXG4gICAgICAgICAgICAgICAgLy8g5Z6L5Y+3XG4gICAgICAgICAgICAgICAgY29uc3Qgc3RhbmRhcnNJZHMgPSBBcnJheS5mcm9tKFxuICAgICAgICAgICAgICAgICAgICBuZXcgU2V0KCBkYXRhJC5tYXAoIGxpc3QgPT4gXG4gICAgICAgICAgICAgICAgICAgICAgICBsaXN0LnNpZFxuICAgICAgICAgICAgICAgICAgICApKVxuICAgICAgICAgICAgICAgICkuZmlsdGVyKCB4ID0+ICEheCApO1xuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIC8vIOWVhuWTgVxuICAgICAgICAgICAgICAgIGxldCBhbGxHb29kcyQ6IGFueSA9IGF3YWl0IFByb21pc2UuYWxsKCBnb29kSWRzLm1hcCggZ29vZElkID0+IHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGRiLmNvbGxlY3Rpb24oJ2dvb2RzJylcbiAgICAgICAgICAgICAgICAgICAgICAgIC5kb2MoIFN0cmluZyggZ29vZElkICkpXG4gICAgICAgICAgICAgICAgICAgICAgICAuZ2V0KCApO1xuICAgICAgICAgICAgICAgIH0pKTtcblxuICAgICAgICAgICAgICAgIGFsbEdvb2RzJCA9IGFsbEdvb2RzJC5tYXAoIHggPT4geC5kYXRhICk7XG5cbiAgICAgICAgICAgICAgICAvLyDlnovlj7dcbiAgICAgICAgICAgICAgICBsZXQgYWxsU3RhbmRhcnMkOiBhbnkgPSBhd2FpdCBQcm9taXNlLmFsbCggc3RhbmRhcnNJZHMubWFwKCBzaWQgPT4ge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZGIuY29sbGVjdGlvbignc3RhbmRhcmRzJylcbiAgICAgICAgICAgICAgICAgICAgICAgIC5kb2MoIFN0cmluZyggc2lkICkpXG4gICAgICAgICAgICAgICAgICAgICAgICAuZ2V0KCApO1xuICAgICAgICAgICAgICAgIH0pKTtcblxuICAgICAgICAgICAgICAgIGFsbFN0YW5kYXJzJCA9IGFsbFN0YW5kYXJzJC5tYXAoIHggPT4geC5kYXRhICk7XG5cbiAgICAgICAgICAgICAgICBjb25zdCBnb29kJCA9IGRhdGEkLm1hcCggbGlzdCA9PiB7XG5cbiAgICAgICAgICAgICAgICAgICAgY29uc3QgeyBwaWQsIHNpZCB9ID0gbGlzdDtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgZ29vZDogYW55ID0gYWxsR29vZHMkLmZpbmQoIHggPT4geC5faWQgPT09IHBpZCApO1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBzdGFuZGFyID0gYWxsU3RhbmRhcnMkLmZpbmQoIHggPT4geC5faWQgPT09IHNpZCApO1xuXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBnb29kLFxuICAgICAgICAgICAgICAgICAgICAgICAgdGFnOiBnb29kLnRhZyxcbiAgICAgICAgICAgICAgICAgICAgICAgIHRpdGxlOiBnb29kLnRpdGxlLFxuICAgICAgICAgICAgICAgICAgICAgICAgc2FsZWQ6IGdvb2Quc2FsZWQsXG4gICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiBzdGFuZGFyID8gc3RhbmRhci5uYW1lIDogJycsXG4gICAgICAgICAgICAgICAgICAgICAgICBwcmljZTogc3RhbmRhciA/IHN0YW5kYXIucHJpY2UgOiBnb29kLnByaWNlLFxuICAgICAgICAgICAgICAgICAgICAgICAgaW1nOiBzdGFuZGFyID8gc3RhbmRhci5pbWcgOiBnb29kLmltZ1sgMCBdLFxuICAgICAgICAgICAgICAgICAgICAgICAgZ3JvdXBQcmljZTogc3RhbmRhciA/IHN0YW5kYXIuZ3JvdXBQcmljZSA6IGdvb2QuZ3JvdXBQcmljZSxcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgLy8g5rOo5YWl5ZWG5ZOB6K+m5oOFXG4gICAgICAgICAgICAgICAgZGF0YSA9IGRhdGEkLm1hcCgoIHNob3BwaW5nLCBrICkgPT4ge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gT2JqZWN0LmFzc2lnbih7IH0sIHNob3BwaW5nLCB7XG4gICAgICAgICAgICAgICAgICAgICAgICBkZXRhaWw6IGdvb2QkWyBrIF1cbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8g5bGV56S655So5oi35aS05YOPXG4gICAgICAgICAgICBpZiAoIHNob3dVc2VyICkge1xuXG4gICAgICAgICAgICAgICAgbGV0IHVpZHM6IHN0cmluZ1sgXSA9IFsgXTtcbiAgICAgICAgICAgICAgICBkYXRhJC5tYXAoIGxpc3QgPT4ge1xuICAgICAgICAgICAgICAgICAgICB1aWRzID0gWyAuLi51aWRzLCAuLi5saXN0LnVpZHMgXTtcbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgIHVpZHMgPSBBcnJheS5mcm9tKFxuICAgICAgICAgICAgICAgICAgICBuZXcgU2V0KCB1aWRzIClcbiAgICAgICAgICAgICAgICApO1xuIFxuICAgICAgICAgICAgICAgIGxldCB1c2VycyQ6IGFueSA9IGF3YWl0IFByb21pc2UuYWxsKCB1aWRzLm1hcCggdWlkID0+IHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGRiLmNvbGxlY3Rpb24oJ3VzZXInKVxuICAgICAgICAgICAgICAgICAgICAgICAgLndoZXJlKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvcGVuaWQ6IHVpZFxuICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgICAgIC5maWVsZCh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb3BlbmlkOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGF2YXRhclVybDogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBuaWNrTmFtZTogdHJ1ZVxuICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgICAgIC5nZXQoICk7XG4gICAgICAgICAgICAgICAgfSkpO1xuXG4gICAgICAgICAgICAgICAgdXNlcnMkID0gdXNlcnMkLm1hcCggeCA9PiB4LmRhdGFbIDAgXSk7XG5cbiAgICAgICAgICAgICAgICBkYXRhID0gZGF0YS5tYXAoKCBzaG9wcGluZywgayApID0+IHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIE9iamVjdC5hc3NpZ24oeyB9LCBzaG9wcGluZywge1xuICAgICAgICAgICAgICAgICAgICAgICAgdXNlcnM6IHNob3BwaW5nLnVpZHMubWFwKCB1aWQgPT4gdXNlcnMkLmZpbmQoIHggPT4geC5vcGVuaWQgPT09IHVpZCApKVxuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIHJldHVybiBjdHguYm9keSA9IHtcbiAgICAgICAgICAgICAgICBkYXRhLFxuICAgICAgICAgICAgICAgIHN0YXR1czogMjAwXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfSBjYXRjaCAoIGUgKSB7XG4gICAgICAgICAgICByZXR1cm4gY3R4LmJvZHkgPSB7IHN0YXR1czogNTAwIH07XG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgIC8qKiBcbiAgICAgKiBAZGVzY3JpcHRpb25cbiAgICAgKiDku5nlpbPotK3nianmuIXljZUgKCDkubDkuoblpJrlsJHjgIHljaHliLjlpJrlsJHjgIHnnIHkuoblpJrlsJEgKVxuICAgICAqL1xuICAgIGFwcC5yb3V0ZXIoJ2ZhaXJ5LXNob3BwaW5nbGlzdCcsIGFzeW5jKCBjdHgsIG5leHQgKSA9PiB7XG4gICAgICAgIHRyeSB7XG5cbiAgICAgICAgICAgIGNvbnN0IHsgdGlkIH0gPSBldmVudC5kYXRhO1xuICAgICAgICAgICAgY29uc3QgbGltaXQgPSBldmVudC5kYXRhLmxpbWl0IHx8IDU7XG5cbiAgICAgICAgICAgIC8qKiDooYznqIvotK3nianmuIXljZUgKi9cbiAgICAgICAgICAgIGNvbnN0IHNob3BwaW5nTWV0YSQgPSBhd2FpdCBkYi5jb2xsZWN0aW9uKCdzaG9wcGluZy1saXN0JylcbiAgICAgICAgICAgICAgICAud2hlcmUoe1xuICAgICAgICAgICAgICAgICAgICB0aWRcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIC5nZXQoICk7XG4gICAgICAgICAgICBcbiAgICAgICAgXG4gICAgICAgICAgICAvKiog5omA5pyJdWlk77yI5ZCr6YeN5aSN77yJICovXG4gICAgICAgICAgICBsZXQgdWlkczogYW55ID0gWyBdO1xuICAgICAgICAgICAgc2hvcHBpbmdNZXRhJC5kYXRhLm1hcCggc2wgPT4ge1xuICAgICAgICAgICAgICAgIHVpZHMgPSBbIC4uLnVpZHMsIC4uLnNsLnVpZHMgXTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAvKiog5aSE55CG5LyY5YyWXG4gICAgICAgICAgICAgKiDorqnotK3kubDph4/mm7TlpJrnmoTnlKjmiLfvvIzlsZXnpLrlnKjliY3pnaJcbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgbGV0IHVpZE1hcFRpbWVzOiB7XG4gICAgICAgICAgICAgICAgWyBrZXk6IHN0cmluZyBdIDogbnVtYmVyXG4gICAgICAgICAgICB9ID0geyB9O1xuICAgICAgICAgICAgdWlkcy5tYXAoIHVpZHN0cmluZyA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKCAhdWlkTWFwVGltZXNbIHVpZHN0cmluZyBdKSB7XG4gICAgICAgICAgICAgICAgICAgIHVpZE1hcFRpbWVzID0gT2JqZWN0LmFzc2lnbih7IH0sIHVpZE1hcFRpbWVzLCB7XG4gICAgICAgICAgICAgICAgICAgICAgICBbIHVpZHN0cmluZyBdOiAxXG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdWlkTWFwVGltZXMgPSBPYmplY3QuYXNzaWduKHsgfSwgdWlkTWFwVGltZXMsIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIFsgdWlkc3RyaW5nIF06IHVpZE1hcFRpbWVzWyB1aWRzdHJpbmcgXSArIDFcbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgLyoqIOWJjTXlkI3nmoTnlKjmiLdpZCAqL1xuICAgICAgICAgICAgY29uc3QgdXNlcklkcyA9IE9iamVjdC5lbnRyaWVzKCB1aWRNYXBUaW1lcyApXG4gICAgICAgICAgICAgICAgLnNvcnQoKCB4LCB5ICkgPT4gXG4gICAgICAgICAgICAgICAgICAgIHlbIDEgXSAtIHhbIDEgXVxuICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgICAuc2xpY2UoIDAsIGxpbWl0IClcbiAgICAgICAgICAgICAgICAubWFwKCB4ID0+IHhbIDAgXSk7XG5cbiAgICAgICAgICAgIC8qKiDmr4/kuKrnlKjmiLfnmoTkv6Hmga8gKi9cbiAgICAgICAgICAgIGNvbnN0IHVzZXJzJCA9IGF3YWl0IFByb21pc2UuYWxsKCB1c2VySWRzLm1hcCggdWlkID0+IFByb21pc2UuYWxsKFtcbiAgICAgICAgICAgICAgICBkYi5jb2xsZWN0aW9uKCd1c2VyJylcbiAgICAgICAgICAgICAgICAgICAgLndoZXJlKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG9wZW5pZDogdWlkXG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgIC5nZXQoIClcbiAgICAgICAgICAgIF0pKSk7XG5cbiAgICAgICAgICAgIC8qKiDliY015Lq655qE5Y2h5Yi4ICovXG4gICAgICAgICAgICBjb25zdCBjb3Vwb25zJDogYW55ID0gYXdhaXQgUHJvbWlzZS5hbGwoXG4gICAgICAgICAgICAgICAgdXNlcklkcy5tYXAoIHVpZCA9PiBcbiAgICAgICAgICAgICAgICAgICAgZGIuY29sbGVjdGlvbignY291cG9uJylcbiAgICAgICAgICAgICAgICAgICAgICAgIC53aGVyZShfLm9yKFtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRpZCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb3BlbmlkOiB1aWRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9wZW5pZDogdWlkLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYW5Vc2VJbk5leHQ6IHRydWVcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBdKSlcbiAgICAgICAgICAgICAgICAgICAgICAgIC5maWVsZCh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZTogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvcGVuaWQ6IHRydWVcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgICAgICAuZ2V0KCApXG4gICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgKVxuXG4gICAgICAgICAgICAvKiog5YmNNeS4quS6uuaAu+eahOi0reeJqea4heWNlSAqL1xuICAgICAgICAgICAgY29uc3Qgc2hvcHBpbmdNZXRhRmlsdGVyID0gc2hvcHBpbmdNZXRhJC5kYXRhLmZpbHRlciggcyA9PiBcbiAgICAgICAgICAgICAgICAhIXVzZXJJZHMuZmluZCggdWlkID0+IFxuICAgICAgICAgICAgICAgICAgICBzLnVpZHMuZmluZCggXG4gICAgICAgICAgICAgICAgICAgICAgICB1ID0+IHUgPT09IHVpZFxuICAgICAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICApKTtcblxuICAgICAgICAgICAgLyoqIOWVhuWTgWlkICovXG4gICAgICAgICAgICBjb25zdCBwSWRzID0gQXJyYXkuZnJvbShcbiAgICAgICAgICAgICAgICBuZXcgU2V0KCBcbiAgICAgICAgICAgICAgICAgICAgc2hvcHBpbmdNZXRhRmlsdGVyXG4gICAgICAgICAgICAgICAgICAgICAgICAubWFwKCBzID0+IHMucGlkIClcbiAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICApO1xuXG4gICAgICAgICAgICAvKiog5ZWG5ZOB6K+m5oOFICovICAgICAgICAgICAgXG4gICAgICAgICAgICBjb25zdCBkZXRhaWxzJCA9IGF3YWl0IFByb21pc2UuYWxsKCBwSWRzLm1hcCggcGlkID0+IHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZGIuY29sbGVjdGlvbignZ29vZHMnKVxuICAgICAgICAgICAgICAgICAgICAuZG9jKCBwaWQgKVxuICAgICAgICAgICAgICAgICAgICAuZmllbGQoe1xuICAgICAgICAgICAgICAgICAgICAgICAgX2lkOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICAgICAgdGFnOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICAgICAgaW1nOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICAgICAgdGl0bGU6IHRydWVcbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgLmdldCggKVxuICAgICAgICAgICAgfSkpO1xuXG4gICAgICAgICAgICAvKiog6LSt54mp5riF5Y2V5rOo5YWl5ZWG5ZOB6K+m5oOFICovXG4gICAgICAgICAgICBjb25zdCBzaG9wcGluZ0luamVjdCA9IHNob3BwaW5nTWV0YUZpbHRlci5tYXAoIHNsID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCBkZXRhaWwgPSBkZXRhaWxzJC5maW5kKCB4ID0+IHguZGF0YS5faWQgPT09IHNsLnBpZCApO1xuICAgICAgICAgICAgICAgIGlmICggZGV0YWlsICkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gT2JqZWN0LmFzc2lnbih7IH0sIHNsLCB7XG4gICAgICAgICAgICAgICAgICAgICAgICBkZXRhaWw6IGRldGFpbC5kYXRhXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBPYmplY3QuYXNzaWduKHsgfSwgc2wgKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgLyoqIOi/lOWbnue7k+aenCAqL1xuICAgICAgICAgICAgY29uc3QgbWV0YURhdGEgPSB1c2VycyQubWFwKCggeCwgayApID0+IHtcbiAgICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgICAgICB1c2VyOiB4WyAwIF0uZGF0YVsgMCBdLFxuICAgICAgICAgICAgICAgICAgICBjb3Vwb25zOiBjb3Vwb25zJFsgayBdLmRhdGEsIFxuICAgICAgICAgICAgICAgICAgICBzaG9wcGluZ2xpc3Q6IHNob3BwaW5nSW5qZWN0LmZpbHRlciggc2wgPT4gc2wudWlkcy5maW5kKCB1aWQgPT4gdWlkID09PSB4WyAwIF0uZGF0YVsgMCBdLm9wZW5pZCApKVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICByZXR1cm4gY3R4LmJvZHkgPSB7XG4gICAgICAgICAgICAgICAgc3RhdHVzOiAyMDAsXG4gICAgICAgICAgICAgICAgZGF0YTogbWV0YURhdGFcbiAgICAgICAgICAgIH1cblxuICAgICAgICB9IGNhdGNoICggZSApIHtcbiAgICAgICAgICAgIHJldHVybiBjdHguYm9keSA9IHsgc3RhdHVzOiA1MDAgfTtcbiAgICAgICAgfVxuICAgIH0pXG5cbiAgICByZXR1cm4gYXBwLnNlcnZlKCApO1xuXG59Il19