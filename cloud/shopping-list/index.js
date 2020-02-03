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
        app.router('findCannotBuy', function (ctx, next) { return __awaiter(void 0, void 0, void 0, function () {
            var _a, tid_1, list, openId_1, getErr, trip$, goodDetails$, belongGoodIds, belongGoods$, goods_1, standards_1, belongGoods_1, hasLimitGood_1, lowStock_1, hasBeenDelete_1, cannotBuy, hasBeenBuy, limitGoods, orders, reqData, createOrder$, e_1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 7, , 8]);
                        _a = event.data, tid_1 = _a.tid, list = _a.list;
                        openId_1 = event.data.openId || event.userInfo.openId;
                        getErr = function (message) { return ({
                            message: message,
                            status: 500
                        }); };
                        if (!tid_1) {
                            return [2, ctx.body = getErr('无效行程')];
                        }
                        return [4, db.collection('trip')
                                .doc(String(tid_1))
                                .get()];
                    case 1:
                        trip$ = _b.sent();
                        if (trip$.data.isClosed || getNow(true) > trip$.data.end_date) {
                            return [2, ctx.body = getErr('暂无购物行程～')];
                        }
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
                    case 2:
                        goodDetails$ = _b.sent();
                        belongGoodIds = Array.from(new Set(event.data.list
                            .map(function (o) { return o.pid; })));
                        return [4, Promise.all(belongGoodIds.map(function (pid) {
                                return db.collection('goods')
                                    .doc(String(pid))
                                    .get();
                            }))];
                    case 3:
                        belongGoods$ = _b.sent();
                        goods_1 = goodDetails$.map(function (x) { return x.data[0]; }).filter(function (y) { return !!y; }).filter(function (z) { return !z.pid; });
                        standards_1 = goodDetails$.map(function (x) { return x.data[0]; }).filter(function (y) { return !!y; }).filter(function (z) { return !!z.pid; });
                        belongGoods_1 = belongGoods$.map(function (x) { return x.data; });
                        hasLimitGood_1 = [];
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
                                else if (standard.stock !== undefined && standard.stock !== null && standard.stock < i.count) {
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
                                else if (good.stock !== undefined && good.stock !== null && good.stock < i.count) {
                                    lowStock_1.push(Object.assign({}, i, {
                                        stock: good.stock,
                                        goodName: i.name
                                    }));
                                }
                            }
                        });
                        limitGoods = belongGoods_1.filter(function (x) { return !!x.limit; });
                        return [4, Promise.all(limitGoods.map(function (good) { return __awaiter(void 0, void 0, void 0, function () {
                                var orders, hasBeenBuyCount, thisTripBuyCount;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4, db.collection('order')
                                                .where({
                                                tid: tid_1,
                                                pid: good._id,
                                                openid: openId_1,
                                                pay_status: _.or(_.eq('1'), _.eq('2'))
                                            })
                                                .get()];
                                        case 1:
                                            orders = _a.sent();
                                            hasBeenBuyCount = orders.data.reduce(function (x, y) {
                                                return x + y.count;
                                            }, 0);
                                            thisTripBuyCount = event.data.list
                                                .filter(function (x) { return x.pid === good._id; })
                                                .reduce(function (x, y) {
                                                return x + y.count;
                                            }, 0);
                                            if (thisTripBuyCount + hasBeenBuyCount > good.limit) {
                                                hasLimitGood_1.push(good);
                                            }
                                            return [2];
                                    }
                                });
                            }); }))];
                    case 4:
                        _b.sent();
                        orders = [];
                        if (!(hasLimitGood_1.length === 0 && lowStock_1.length === 0 && cannotBuy.length === 0 && hasBeenDelete_1.length === 0)) return [3, 6];
                        reqData = {
                            tid: tid_1,
                            openId: openId_1,
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
                    case 5:
                        createOrder$ = _b.sent();
                        if (createOrder$.result.status !== 200) {
                            return [2, ctx.body = {
                                    status: 500,
                                    message: '创建预付订单失败！'
                                }];
                        }
                        orders = createOrder$.result.data;
                        _b.label = 6;
                    case 6: return [2, ctx.body = {
                            data: {
                                orders: orders,
                                lowStock: lowStock_1,
                                cannotBuy: cannotBuy,
                                hasLimitGood: hasLimitGood_1,
                                hasBeenBuy: hasBeenBuy,
                                hasBeenDelete: hasBeenDelete_1,
                            },
                            status: 200
                        }];
                    case 7:
                        e_1 = _b.sent();
                        return [2, ctx.body = {
                                status: 500,
                                message: e_1
                            }];
                    case 8: return [2];
                }
            });
        }); });
        app.router('create', function (ctx, next) { return __awaiter(void 0, void 0, void 0, function () {
            var others_1, buyer_1, buyerBuyPinDelta_1, buyerWaitPinDelta_1, _a, list, openId_2, e_2;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        others_1 = [];
                        buyer_1 = null;
                        buyerBuyPinDelta_1 = 0;
                        buyerWaitPinDelta_1 = 0;
                        _a = event.data, list = _a.list, openId_2 = _a.openId;
                        return [4, Promise.all(list.map(function (orderMeta) { return __awaiter(void 0, void 0, void 0, function () {
                                var tid, pid, sid, oid, price, groupPrice, acid, query, find$, meta, create$, metaShoppingList, lastOids, lastUids, lastAdjustPrice, lastAdjustGroupPrice, currentDelta, update$;
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
                                            if (!buyer_1 && !groupPrice) {
                                                buyer_1 = {
                                                    openid: openId_2,
                                                    type: 'buy',
                                                    delta: 0
                                                };
                                            }
                                            else {
                                                buyerWaitPinDelta_1 += Number((price - groupPrice).toFixed(0));
                                                buyer_1 = {
                                                    openid: openId_2,
                                                    type: 'waitPin',
                                                    delta: buyerWaitPinDelta_1
                                                };
                                            }
                                            meta = Object.assign({}, query, {
                                                acid: acid || undefined
                                            }, {
                                                oids: [oid],
                                                uids: [openId_2],
                                                purchase: 0,
                                                buy_status: '0',
                                                base_status: '0',
                                                adjustPrice: price,
                                                adjustGroupPrice: groupPrice,
                                                createTime: getNow(true)
                                            });
                                            return [4, db.collection('shopping-list')
                                                    .add({
                                                    data: meta
                                                })];
                                        case 2:
                                            create$ = _a.sent();
                                            return [2];
                                        case 3:
                                            metaShoppingList = find$.data[0];
                                            if (!!metaShoppingList.oids.find(function (x) { return x === oid; })) return [3, 5];
                                            lastOids = metaShoppingList.oids;
                                            lastUids = metaShoppingList.uids;
                                            lastAdjustPrice = metaShoppingList.adjustPrice;
                                            lastAdjustGroupPrice = metaShoppingList.adjustGroupPrice;
                                            if (!!lastAdjustGroupPrice) {
                                                currentDelta = Number((lastAdjustPrice - lastAdjustGroupPrice).toFixed(0));
                                                if (lastUids.filter(function (x) { return x !== openId_2; }).length > 0) {
                                                    buyerBuyPinDelta_1 += currentDelta;
                                                    if (!buyer_1 || (!!buyer_1 && buyer_1.type === 'buy')) {
                                                        buyer_1 = {
                                                            openid: openId_2,
                                                            type: 'buyPin',
                                                            delta: buyerBuyPinDelta_1
                                                        };
                                                    }
                                                }
                                                else {
                                                    buyerWaitPinDelta_1 += currentDelta;
                                                    buyer_1 = {
                                                        openid: openId_2,
                                                        type: 'waitPin',
                                                        delta: buyerWaitPinDelta_1
                                                    };
                                                }
                                                if (!lastUids.find(function (x) { return x === openId_2; }) && lastUids.length === 1) {
                                                    others_1.push({
                                                        pid: pid,
                                                        tid: tid,
                                                        sid: sid || undefined,
                                                        acid: acid || undefined,
                                                        openid: lastUids[0],
                                                        delta: currentDelta,
                                                    });
                                                }
                                            }
                                            else {
                                                if (!buyer_1) {
                                                    buyer_1 = {
                                                        openid: openId_2,
                                                        type: 'buy',
                                                        delta: 0
                                                    };
                                                }
                                            }
                                            lastOids.unshift(oid);
                                            if (!lastUids.find(function (x) { return x === openId_2; })) {
                                                lastUids.unshift(openId_2);
                                            }
                                            return [4, db.collection('shopping-list').doc(String(find$.data[0]._id))
                                                    .update({
                                                    data: {
                                                        oids: lastOids,
                                                        uids: lastUids,
                                                        updateTime: getNow(true)
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
                                status: 200,
                                data: {
                                    buyer: buyer_1,
                                    others: others_1
                                }
                            }];
                    case 2:
                        e_2 = _b.sent();
                        return [2, ctx.body = { status: 500 }];
                    case 3: return [2];
                }
            });
        }); });
        app.router('list', function (ctx, next) { return __awaiter(void 0, void 0, void 0, function () {
            var orders$_1, _a, tid, needOrders_1, openid, lists$, goods$_1, activities$_1, list, e_3;
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
                                return Promise.all(list.oids.map(function (oid) { return __awaiter(void 0, void 0, void 0, function () {
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
                    case 3: return [4, Promise.all(lists$.data.map(function (list) { return __awaiter(void 0, void 0, void 0, function () {
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
                        return [4, Promise.all(lists$.data.map(function (list) { return __awaiter(void 0, void 0, void 0, function () {
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
        app.router('adjust', function (ctx, next) { return __awaiter(void 0, void 0, void 0, function () {
            var _a, shoppingId, adjustPrice_1, adjustGroupPrice_1, shopping$, orders$, lastAllocated_1, purchase_1, finishAdjustOrders, hasBeenAdjust, needBuyTotal, temp, sorredOrders, e_4;
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
                            updateTime: getNow(true)
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
                        return [4, Promise.all(sorredOrders.map(function (order) { return __awaiter(void 0, void 0, void 0, function () {
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
        app.router('adjust-status', function (ctx, next) { return __awaiter(void 0, void 0, void 0, function () {
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
        app.router('pin', function (ctx, next) { return __awaiter(void 0, void 0, void 0, function () {
            var bjpConfig, openid, _a, tid, detail, pid, type_1, limit, showUser, query, shopping$, bjpConfig$, data, data$, goodIds, standarsIds, allGoods$_1, allStandars$_1, good$_1, uids_1, users$_1, meta, e_6;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 11, , 12]);
                        bjpConfig = null;
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
                    case 4: return [4, db.collection('app-config')
                            .where({
                            type: 'app-bjp-visible'
                        })
                            .get()];
                    case 5:
                        bjpConfig$ = _b.sent();
                        bjpConfig = bjpConfig$.data[0];
                        data = [];
                        data$ = shopping$.data.filter(function (s) {
                            if (type_1 === 'pin') {
                                return (!!s.adjustGroupPrice || !!s.groupPrice) && s.uids.length > 1;
                            }
                            else if (type_1 === 'wait') {
                                return (!!s.adjustGroupPrice || !!s.groupPrice) && s.uids.length === 1;
                            }
                            else if (type_1 === undefined) {
                                return (!!s.adjustGroupPrice || !!s.groupPrice);
                            }
                            else {
                                return true;
                            }
                        });
                        data$ = data$.sort(function (x, y) { return y.uids.length - x.uids.length; });
                        data = data$;
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
                    case 6:
                        allGoods$_1 = _b.sent();
                        allGoods$_1 = allGoods$_1.map(function (x) { return x.data; });
                        if (!(detail === undefined || !!detail)) return [3, 8];
                        return [4, Promise.all(standarsIds.map(function (sid) {
                                return db.collection('standards')
                                    .doc(String(sid))
                                    .get();
                            }))];
                    case 7:
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
                            return __assign(__assign({}, shopping), { detail: good$_1[k] });
                        });
                        _b.label = 8;
                    case 8:
                        if (!showUser) return [3, 10];
                        uids_1 = [];
                        data$.map(function (list) {
                            uids_1 = __spreadArrays(uids_1, list.uids);
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
                    case 9:
                        users$_1 = _b.sent();
                        users$_1 = users$_1.map(function (x) { return x.data[0]; });
                        data = data.map(function (shopping, k) {
                            return __assign(__assign({}, shopping), { users: shopping.uids.map(function (uid) { return users$_1.find(function (x) { return x.openid === uid; }); }) });
                        });
                        _b.label = 10;
                    case 10:
                        if (!!bjpConfig && !bjpConfig.value) {
                            meta = data
                                .filter(function (x) {
                                var good = allGoods$_1.find(function (y) { return y._id === x.pid; });
                                return String(good.category) !== '4';
                            });
                            data = meta;
                        }
                        return [2, ctx.body = {
                                data: data,
                                status: 200
                            }];
                    case 11:
                        e_6 = _b.sent();
                        return [2, ctx.body = { status: 500 }];
                    case 12: return [2];
                }
            });
        }); });
        app.router('fairy-shoppinglist', function (ctx, next) { return __awaiter(void 0, void 0, void 0, function () {
            var tid_2, limit, shoppingMeta$, uids_2, uidMapTimes_1, userIds_1, users$, coupons$_1, shoppingMetaFilter, pIds, details$_1, shoppingInject_1, metaData, e_7;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 5, , 6]);
                        tid_2 = event.data.tid;
                        limit = event.data.limit || 5;
                        return [4, db.collection('shopping-list')
                                .where({
                                tid: tid_2
                            })
                                .get()];
                    case 1:
                        shoppingMeta$ = _a.sent();
                        uids_2 = [];
                        shoppingMeta$.data.map(function (sl) {
                            uids_2 = __spreadArrays(uids_2, sl.uids);
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
                                        tid: tid_2,
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
        app.router('pin-task', function (ctx, next) { return __awaiter(void 0, void 0, void 0, function () {
            var openid_1, trips$, trips, trip, shopping$, all$, reduce_price, lijian$, lijian, t_total, t_current, t_delta, e_8;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 5, , 6]);
                        openid_1 = event.data.openId || event.data.openid || event.userInfo.openId;
                        return [4, cloud.callFunction({
                                data: {
                                    $url: 'enter'
                                },
                                name: 'trip'
                            })];
                    case 1:
                        trips$ = _a.sent();
                        trips = trips$.result.data;
                        trip = trips[0];
                        if (!trip) {
                            return [2, ctx.body = {
                                    data: [],
                                    status: 200
                                }];
                        }
                        return [4, db.collection('shopping-list')
                                .where({
                                tid: trip._id,
                                uids: openid_1
                            })
                                .get()];
                    case 2:
                        shopping$ = _a.sent();
                        return [4, Promise.all(shopping$.data.map(function (shopping) { return __awaiter(void 0, void 0, void 0, function () {
                                var pid, sid, tid, allOrders$, count, groupMenOrders$, good$, standard, standard$;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            pid = shopping.pid, sid = shopping.sid, tid = shopping.tid;
                                            return [4, db.collection('order')
                                                    .where({
                                                    pid: pid,
                                                    sid: sid,
                                                    tid: tid,
                                                    openid: openid_1,
                                                    pay_status: _.or(_.eq('1'), _.eq('2')),
                                                    base_status: _.or(_.eq('0'), _.eq('1'), _.eq('2'))
                                                })
                                                    .get()];
                                        case 1:
                                            allOrders$ = _a.sent();
                                            count = allOrders$.data.reduce(function (x, y) {
                                                return x + y.count;
                                            }, 0);
                                            return [4, db.collection('order')
                                                    .where({
                                                    pid: pid,
                                                    sid: sid,
                                                    tid: tid,
                                                    openid: _.neq(openid_1),
                                                    pay_status: _.or(_.eq('1'), _.eq('2')),
                                                    base_status: _.or(_.eq('0'), _.eq('1'), _.eq('2'))
                                                })
                                                    .count()];
                                        case 2:
                                            groupMenOrders$ = _a.sent();
                                            return [4, db.collection('goods')
                                                    .doc(String(pid))
                                                    .field({
                                                    title: true,
                                                    img: true
                                                })
                                                    .get()];
                                        case 3:
                                            good$ = _a.sent();
                                            standard = undefined;
                                            if (!!!sid) return [3, 5];
                                            return [4, db.collection('standards')
                                                    .doc(String(sid))
                                                    .field({
                                                    name: true,
                                                    img: true
                                                })
                                                    .get()];
                                        case 4:
                                            standard$ = _a.sent();
                                            standard = standard$.data;
                                            _a.label = 5;
                                        case 5: return [2, __assign(__assign({ count: count }, shopping), { type: 'shoppinglist', isPin: groupMenOrders$.total > 0, detail: __assign(__assign({}, good$.data), { img: standard ? standard.img : good$.data.img[0], name: standard ? standard.name : '' }) })];
                                    }
                                });
                            }); }))];
                    case 3:
                        all$ = _a.sent();
                        reduce_price = trip.reduce_price;
                        return [4, db.collection('coupon')
                                .where({
                                openid: openid_1,
                                tid: trip._id,
                                type: 't_lijian'
                            })
                                .get()];
                    case 4:
                        lijian$ = _a.sent();
                        lijian = lijian$.data[0];
                        t_total = reduce_price;
                        t_current = !!lijian ?
                            lijian.value : 0;
                        t_delta = Number((reduce_price - t_current).toFixed(2));
                        return [2, ctx.body = {
                                status: 200,
                                data: __spreadArrays([
                                    {
                                        type: 't_lijian',
                                        t_total: t_total,
                                        t_current: t_current,
                                        t_delta: t_delta
                                    }
                                ], all$)
                            }];
                    case 5:
                        e_8 = _a.sent();
                        return [2, ctx.body = {
                                status: 500
                            }];
                    case 6: return [2];
                }
            });
        }); });
        return [2, app.serve()];
    });
}); };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLHFDQUF1QztBQUN2QyxzQ0FBd0M7QUFHeEMsS0FBSyxDQUFDLElBQUksQ0FBQztJQUNQLEdBQUcsRUFBRSxPQUFPLENBQUMsR0FBRyxDQUFDLEtBQUs7Q0FDekIsQ0FBQyxDQUFDO0FBRUgsSUFBTSxFQUFFLEdBQWdCLEtBQUssQ0FBQyxRQUFRLEVBQUcsQ0FBQztBQUMxQyxJQUFNLENBQUMsR0FBRyxFQUFFLENBQUMsT0FBTyxDQUFDO0FBUXJCLElBQU0sTUFBTSxHQUFHLFVBQUUsRUFBVTtJQUFWLG1CQUFBLEVBQUEsVUFBVTtJQUN2QixJQUFLLEVBQUUsRUFBRztRQUNOLE9BQU8sSUFBSSxDQUFDLEdBQUcsRUFBRyxDQUFDO0tBQ3RCO0lBQ0QsSUFBTSxNQUFNLEdBQUcsSUFBSSxJQUFJLENBQUUsSUFBSSxJQUFJLEVBQUcsQ0FBQyxjQUFjLEVBQUcsQ0FBQyxDQUFDO0lBQ3hELE9BQU8sSUFBSSxJQUFJLENBQUUsTUFBTSxDQUFDLE9BQU8sRUFBRyxHQUFHLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLElBQUksQ0FBRSxDQUFBO0FBQzdELENBQUMsQ0FBQTtBQW9CWSxRQUFBLElBQUksR0FBRyxVQUFRLEtBQUssRUFBRSxPQUFPOzs7UUFFaEMsR0FBRyxHQUFHLElBQUksU0FBUyxDQUFDLEVBQUUsS0FBSyxPQUFBLEVBQUUsQ0FBQyxDQUFDO1FBK0RyQyxHQUFHLENBQUMsTUFBTSxDQUFDLGVBQWUsRUFBRSxVQUFPLEdBQUcsRUFBRSxJQUFJOzs7Ozs7d0JBRzlCLEtBQWdCLEtBQUssQ0FBQyxJQUFJLEVBQXhCLGNBQUcsRUFBRSxJQUFJLFVBQUEsQ0FBZ0I7d0JBQzNCLFdBQVMsS0FBSyxDQUFDLElBQUksQ0FB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QUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO3dCQUNmLE9BQU8sR0FBRyxNQUFNLENBQUMsQ0FBRSxZQUFZLEdBQUcsU0FBUyxDQUFFLENBQUMsT0FBTyxDQUFFLENBQUMsQ0FBRSxDQUFDLENBQUM7d0JBRWxFLFdBQU8sR0FBRyxDQUFDLElBQUksR0FBRztnQ0FDZCxNQUFNLEVBQUUsR0FBRztnQ0FDWCxJQUFJO29DQUNBO3dDQUNJLElBQUksRUFBRSxVQUFVO3dDQUNoQixPQUFPLFNBQUE7d0NBQ1AsU0FBUyxXQUFBO3dDQUNULE9BQU8sU0FBQTtxQ0FDVjttQ0FDRSxJQUFJLENBQ1Y7NkJBQ0osRUFBQzs7O3dCQUdGLFdBQU8sR0FBRyxDQUFDLElBQUksR0FBRztnQ0FDZCxNQUFNLEVBQUUsR0FBRzs2QkFDZCxFQUFDOzs7O2FBRVQsQ0FBQyxDQUFBO1FBRUYsV0FBTyxHQUFHLENBQUMsS0FBSyxFQUFHLEVBQUM7O0tBRXZCLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBjbG91ZCBmcm9tICd3eC1zZXJ2ZXItc2RrJztcbmltcG9ydCAqIGFzIFRjYlJvdXRlciBmcm9tICd0Y2Itcm91dGVyJztcbmltcG9ydCB7IGZpbmQkIH0gZnJvbSAnLi9maW5kJztcblxuY2xvdWQuaW5pdCh7XG4gICAgZW52OiBwcm9jZXNzLmVudi5jbG91ZFxufSk7XG5cbmNvbnN0IGRiOiBEQi5EYXRhYmFzZSA9IGNsb3VkLmRhdGFiYXNlKCApO1xuY29uc3QgXyA9IGRiLmNvbW1hbmQ7XG5cbi8qKiBcbiAqIOi9rOaNouagvOael+WwvOayu+aXtuWMuiArOOaXtuWMulxuICogRGF0ZSgpLm5vdygpIC8gbmV3IERhdGUoKS5nZXRUaW1lKCkg5piv5pe25LiN5pe25q2j5bi455qEKzhcbiAqIERhdGUudG9Mb2NhbFN0cmluZyggKSDlpb3lg4/mmK/kuIDnm7TmmK8rMOeahFxuICog5YWI5ou/5YiwICsw77yM54S25ZCOKzhcbiAqL1xuY29uc3QgZ2V0Tm93ID0gKCB0cyA9IGZhbHNlICk6IGFueSA9PiB7XG4gICAgaWYgKCB0cyApIHtcbiAgICAgICAgcmV0dXJuIERhdGUubm93KCApO1xuICAgIH1cbiAgICBjb25zdCB0aW1lXzAgPSBuZXcgRGF0ZSggbmV3IERhdGUoICkudG9Mb2NhbGVTdHJpbmcoICkpO1xuICAgIHJldHVybiBuZXcgRGF0ZSggdGltZV8wLmdldFRpbWUoICkgKyA4ICogNjAgKiA2MCAqIDEwMDAgKVxufVxuXG4vKipcbiAqIEBkZXNjcmlwdGlvbiDooYznqIvmuIXljZXmqKHlnZdcbiAqIC0tLS0tLS0tLSDlrZfmrrUgLS0tLS0tLS0tLVxuICogdGlkXG4gKiBwaWRcbiAqIHNpZCAoIOWPr+S4uuepuiApXG4gKiBvaWRzIEFycmF5XG4gKiB1aWRzIEFycmF5XG4gKiBidXlfc3RhdHVzIDAsMSwyIOacqui0reS5sOOAgeW3sui0reS5sOOAgeS5sOS4jeWFqFxuICogYmFzZV9zdGF0dXM6IDAsMSDmnKrosIPmlbTvvIzlt7LosIPmlbRcbiAqIGNyZWF0ZVRpbWVcbiAqIHVwZGF0ZVRpbWVcbiAqICEgYWNpZCDmtLvliqhpZFxuICogbGFzdEFsbG9jYXRlZCDliankvZnliIbphY3ph49cbiAqIHB1cmNoYXNlIOmHh+i0reaVsOmHj1xuICogYWRqdXN0UHJpY2Ug5YiG6YWN55qE5pWw5riF5Y2V5ZSu5Lu3XG4gKiBhZGp1c3RHcm91cFByaWNlIOWIhumFjeeahOaVsOa4heWNleWboui0reS7t1xuICovXG5leHBvcnQgY29uc3QgbWFpbiA9IGFzeW5jICggZXZlbnQsIGNvbnRleHQgKSA9PiB7XG5cbiAgICBjb25zdCBhcHAgPSBuZXcgVGNiUm91dGVyKHsgZXZlbnQgfSk7XG5cbiAgICAvKipcbiAgICAgKiBAZGVzY3JpcHRpb25cbiAgICAgKiDliKTmlq3or7fmsYLnmoRzaWQgKyB0aWQgKyBwaWQgKyBjb3VudOaVsOe7hO+8jOi/lOWbnuS4jeiDvei0reS5sOeahOWVhuWTgeWIl+ihqO+8iOa4heWNlemHjOmdouS5sOS4jeWIsOOAgeS5sOS4jeWFqO+8ieOAgei0p+WFqOS4jei2s+eahOWVhuWTge+8iOi/lOWbnuacgOaWsOi0p+WtmO+8iVxuICAgICAqIC0tLS0tLS0tIOivt+axgiAtLS0tLS0tLS0tXG4gICAgICoge1xuICAgICAqISAgICBmcm9tPzogJ2NhcnQnIHwgJ2J1eScgfCAnY3VzdG9tJyB8ICdhZ2VudHMnIHwgJ3N5c3RlbSdcbiAgICAgKiAgICAgdGlkOiBzdHJpbmdcbiAgICAgKiEgICAgb3BlbmlkPzogc3RyaW5nLFxuICAgICAqICAgIGxpc3Q6IHsgXG4gICAgICogICAgICB0aWRcbiAgICAgKiEgICAgIGNpZD86IHN0cmluZ1xuICAgICAgICAgICAgc2lkXG4gICAgICAgICAgICBwaWRcbiAgICAgICAgICAgIHByaWNlXG4gICAgICAgICAgICBncm91cFByaWNlXG4gICAgICAgICAgICBjb3VudFxuICAgICAqISAgICAgZGVzYz86IHN0cmluZ1xuICAgICAgICAgICAgbmFtZSxcbiAgICAgICAgICAgIHN0YW5kZXJuYW1lXG4gICAgICAgICAgICBpbWdcbiAgICAgICAgICAgIHR5cGVcbiAgICAgICAgICAgIGFkZHJlc3M6IHtcbiAgICAgICAgICAgICAgIG5hbWUsXG4gICAgICAgICAgICAgICBwaG9uZSxcbiAgICAgICAgICAgICAgIGRldGFpbCxcbiAgICAgICAgICAgICAgIHBvc3RhbGNvZGVcbiAgICAgICAgICAgIH1cbiAgICAgKiAgICAgfVsgXVxuICAgICAqIH1cbiAgICAgKiAtLS0tLS0tLSDov5Tlm54gLS0tLS0tLS0tLVxuICAgICAqIHtcbiAgICAgKiAgICAgICog5bey6LSt5LmwKCDpo47pmanljZUgKVxuICAgICAqICAgICAgaGFzQmVlbkJ1eToge1xuICAgICAqICAgICAgICAgIHRpZCwgXG4gICAgICogICAgICAgICAgcGlkLFxuICAgICAqICAgICAgICAgIHNpZFxuICAgICAqICAgICAgfVsgXVxuICAgICAqICAgICAgKiDkubDkuI3liLBcbiAgICAgKiAgICAgIGNhbm5vdEJ1eTogeyBcbiAgICAgKiAgICAgICAgICB0aWQsIFxuICAgICAqICAgICAgICAgIHBpZCxcbiAgICAgKiAgICAgICAgICBzaWRcbiAgICAgKiAgICAgIH1bIF1cbiAgICAgKiAgICAgICog6LSn5a2Y5LiN6LazXG4gICAgICogICAgICAgbG93U3RvY2s6IHsgXG4gICAgICogICAgICAgICAgdGlkLCBcbiAgICAgKiAgICAgICAgICBwaWQsXG4gICAgICogICAgICAgICAgc2lkLFxuICAgICAqICAgICAgICAgIGNvdW50LFxuICAgICAqICAgICAgICAgIHN0b2NrXG4gICAgICogICAgICB9WyBdXG4gICAgICogICAgICAqIOWei+WPt+W3suiiq+WIoOmZpCAvIOWVhuWTgeW3suS4i+aetlxuICAgICAqICAgICAgaGFzQmVlbkRlbGV0ZToge1xuICAgICAqICAgICAgICAgIHRpZCwgXG4gICAgICogICAgICAgICAgcGlkLFxuICAgICAqICAgICAgICAgIHNpZFxuICAgICAqICAgICAgfVsgXSxcbiAgICAgKiAgICAgICog6K6i5Y2V5Y+35YiX6KGoXG4gICAgICogICAgICBvcmRlcnNcbiAgICAgKiB9XG4gICAgICovXG4gICAgYXBwLnJvdXRlcignZmluZENhbm5vdEJ1eScsIGFzeW5jKCBjdHgsIG5leHQgKSA9PiB7XG4gICAgICAgIHRyeSB7XG5cbiAgICAgICAgICAgIGNvbnN0IHsgdGlkLCBsaXN0IH0gPSBldmVudC5kYXRhO1xuICAgICAgICAgICAgY29uc3Qgb3BlbklkID0gZXZlbnQuZGF0YS5vcGVuSWQgfHwgZXZlbnQudXNlckluZm8ub3BlbklkO1xuXG4gICAgICAgICAgICBjb25zdCBnZXRFcnIgPSBtZXNzYWdlID0+ICh7XG4gICAgICAgICAgICAgICAgbWVzc2FnZSwgXG4gICAgICAgICAgICAgICAgc3RhdHVzOiA1MDBcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBpZiAoICF0aWQgKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGN0eC5ib2R5ID0gZ2V0RXJyKCfml6DmlYjooYznqIsnKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8g5p+l6K+i6KGM56iL5piv5ZCm6L+Y5pyJ5pWIXG4gICAgICAgICAgICBjb25zdCB0cmlwJCA9IGF3YWl0IGRiLmNvbGxlY3Rpb24oJ3RyaXAnKVxuICAgICAgICAgICAgICAgIC5kb2MoIFN0cmluZyggdGlkICkpXG4gICAgICAgICAgICAgICAgLmdldCggKTtcblxuICAgICAgICAgICAgaWYgKCB0cmlwJC5kYXRhLmlzQ2xvc2VkIHx8IGdldE5vdyggdHJ1ZSApID4gdHJpcCQuZGF0YS5lbmRfZGF0ZSApIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gY3R4LmJvZHkgPSBnZXRFcnIoJ+aaguaXoOi0reeJqeihjOeoi++9nicpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyDmn6Xor6LllYblk4Hor6bmg4XjgIHmiJbogIXlnovlj7for6bmg4VcbiAgICAgICAgICAgIGNvbnN0IGdvb2REZXRhaWxzJDogYW55ID0gYXdhaXQgUHJvbWlzZS5hbGwoIGV2ZW50LmRhdGEubGlzdC5tYXAoIGkgPT4ge1xuXG4gICAgICAgICAgICAgICAgaWYgKCAhIWkuc2lkICkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZGIuY29sbGVjdGlvbignc3RhbmRhcmRzJylcbiAgICAgICAgICAgICAgICAgICAgICAgIC53aGVyZSh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgX2lkOiBpLnNpZFxuICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgICAgIC5nZXQoIClcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZGIuY29sbGVjdGlvbignZ29vZHMnKVxuICAgICAgICAgICAgICAgICAgICAgICAgLndoZXJlKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBfaWQ6IGkucGlkXG4gICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAgICAgLmdldCggKVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pKTtcblxuICAgICAgICAgICAgLyoqIOWei+WPt+aJgOWxnuWVhuWTgSAqL1xuICAgICAgICAgICAgY29uc3QgYmVsb25nR29vZElkcyA9IEFycmF5LmZyb20oIFxuICAgICAgICAgICAgICAgIG5ldyBTZXQoXG4gICAgICAgICAgICAgICAgICAgIGV2ZW50LmRhdGEubGlzdFxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gLmZpbHRlciggaSA9PiAhIWkuc2lkIClcbiAgICAgICAgICAgICAgICAgICAgICAgIC5tYXAoIG8gPT4gby5waWQgKVxuICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICk7XG5cbiAgICAgICAgICAgIGNvbnN0IGJlbG9uZ0dvb2RzJCA9IGF3YWl0IFByb21pc2UuYWxsKCBiZWxvbmdHb29kSWRzLm1hcCggcGlkID0+IHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZGIuY29sbGVjdGlvbignZ29vZHMnKVxuICAgICAgICAgICAgICAgICAgICAuZG9jKCBTdHJpbmcoIHBpZCApKVxuICAgICAgICAgICAgICAgICAgICAuZ2V0KCApO1xuICAgICAgICAgICAgfSkpO1xuICAgICAgICAgICBcbiAgICAgICAgICAgIGNvbnN0IGdvb2RzID0gZ29vZERldGFpbHMkLm1hcCggeCA9PiB4LmRhdGFbIDAgXSkuZmlsdGVyKCB5ID0+ICEheSApLmZpbHRlciggeiA9PiAhei5waWQgKTtcbiAgICAgICAgICAgIGNvbnN0IHN0YW5kYXJkcyA9IGdvb2REZXRhaWxzJC5tYXAoIHggPT4geC5kYXRhWyAwIF0pLmZpbHRlciggeSA9PiAhIXkgKS5maWx0ZXIoIHogPT4gISF6LnBpZCApO1xuICAgICAgICAgICAgY29uc3QgYmVsb25nR29vZHMgPSBiZWxvbmdHb29kcyQubWFwKCB4ID0+IHguZGF0YSApO1xuXG4gICAgICAgICAgICAvLyDpmZDotK1cbiAgICAgICAgICAgIGxldCBoYXNMaW1pdEdvb2Q6IGFueSA9IFsgXTtcblxuICAgICAgICAgICAgLy8g5bqT5a2Y5LiN6LazXG4gICAgICAgICAgICBsZXQgbG93U3RvY2s6IGFueSA9IFsgXTtcblxuICAgICAgICAgICAgLy8g6KKr5Yig6ZmkXG4gICAgICAgICAgICBsZXQgaGFzQmVlbkRlbGV0ZTogYW55ID0gWyBdO1xuXG4gICAgICAgICAgICAvLyDkubDkuI3liLBcbiAgICAgICAgICAgIGNvbnN0IGNhbm5vdEJ1eSA9IFsgXTtcblxuICAgICAgICAgICAgLy8g5bey57uP6KKr6LSt5Lmw5LqG77yI6aOO6Zmp5Y2V77yJXG4gICAgICAgICAgICBjb25zdCBoYXNCZWVuQnV5ID0gWyBdO1xuXG4gICAgICAgICAgICBldmVudC5kYXRhLmxpc3QubWFwKCBpID0+IHtcbiAgICAgICAgICAgICAgICAvLyDlnovlj7cgLSDorqHnrpflt7LooqvliKDpmaTjgIHlupPlrZjkuI3otrPjgIHkuLvkvZPmnKzouqvooqvkuIvmnrYv5Yig6ZmkXG4gICAgICAgICAgICAgICAgaWYgKCAhIWkuc2lkICkge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBiZWxvbmdHb29kID0gYmVsb25nR29vZHMuZmluZCggeCA9PiB4Ll9pZCA9PT0gaS5waWQgKTtcbiAgICAgICAgICAgICAgICAgICAgY29uc3Qgc3RhbmRhcmQgPSBzdGFuZGFyZHMuZmluZCggeCA9PiB4Ll9pZCA9PT0gaS5zaWQgJiYgeC5waWQgPT09IGkucGlkICk7XG5cbiAgICAgICAgICAgICAgICAgICAgLy8g5Z6L5Y+35pys6Lqr6KKr5Yig6Zmk44CB5Li75L2T5pys6Lqr6KKr5LiL5p62L+WIoOmZpFxuICAgICAgICAgICAgICAgICAgICBpZiAoICFzdGFuZGFyZCB8fCAoICEhc3RhbmRhcmQgJiYgc3RhbmRhcmQuaXNEZWxldGUgKSB8fCAoICEhYmVsb25nR29vZCAmJiAhYmVsb25nR29vZC52aXNpYWJsZSApIHx8ICggISFiZWxvbmdHb29kICYmIGJlbG9uZ0dvb2QuaXNEZWxldGUgKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaGFzQmVlbkRlbGV0ZS5wdXNoKCBpICk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoIHN0YW5kYXJkLnN0b2NrICE9PSB1bmRlZmluZWQgJiYgc3RhbmRhcmQuc3RvY2sgIT09IG51bGwgJiYgIHN0YW5kYXJkLnN0b2NrIDwgaS5jb3VudCApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxvd1N0b2NrLnB1c2goIE9iamVjdC5hc3NpZ24oeyB9LCBpLCB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc3RvY2s6IHN0YW5kYXJkLnN0b2NrLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGdvb2ROYW1lOiBpLm5hbWUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc3RhbmRlck5hbWU6IGkuc3RhbmRlcm5hbWVcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIC8vIOS4u+S9k+WVhuWTgSAtIOiuoeeul+W3suiiq+WIoOmZpOOAgeW6k+WtmOS4jei2s1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGdvb2QgPSBnb29kcy5maW5kKCB4ID0+IHguX2lkID09PSBpLnBpZCApO1xuICAgICAgICAgICAgICAgICAgICBpZiAoICFnb29kIHx8ICggISFnb29kICYmICFnb29kLnZpc2lhYmxlICkgfHwgKCAhIWdvb2QgJiYgZ29vZC5pc0RlbGV0ZSApKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBoYXNCZWVuRGVsZXRlLnB1c2goIGkgKVxuICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKCBnb29kLnN0b2NrICE9PSB1bmRlZmluZWQgJiYgZ29vZC5zdG9jayAhPT0gbnVsbCAmJiBnb29kLnN0b2NrIDwgaS5jb3VudCApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxvd1N0b2NrLnB1c2goIE9iamVjdC5hc3NpZ24oeyB9LCBpLCB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc3RvY2s6IGdvb2Quc3RvY2ssXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZ29vZE5hbWU6IGkubmFtZVxuICAgICAgICAgICAgICAgICAgICAgICAgfSkpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG5cblxuICAgICAgICAgICAgLy8g5p+l6K+i6ZmQ6LStXG4gICAgICAgICAgICBjb25zdCBsaW1pdEdvb2RzID0gYmVsb25nR29vZHMuZmlsdGVyKCB4ID0+ICEheC5saW1pdCApO1xuXG4gICAgICAgICAgICBhd2FpdCBQcm9taXNlLmFsbCggbGltaXRHb29kcy5tYXAoIGFzeW5jIGdvb2QgPT4ge1xuXG4gICAgICAgICAgICAgICAgY29uc3Qgb3JkZXJzID0gYXdhaXQgZGIuY29sbGVjdGlvbignb3JkZXInKVxuICAgICAgICAgICAgICAgICAgICAud2hlcmUoe1xuICAgICAgICAgICAgICAgICAgICAgICAgdGlkLFxuICAgICAgICAgICAgICAgICAgICAgICAgcGlkOiBnb29kLl9pZCxcbiAgICAgICAgICAgICAgICAgICAgICAgIG9wZW5pZDogb3BlbklkLFxuICAgICAgICAgICAgICAgICAgICAgICAgcGF5X3N0YXR1czogXy5vciggXy5lcSgnMScpLCBfLmVxKCcyJykpXG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgIC5nZXQoICk7XG5cbiAgICAgICAgICAgICAgICBjb25zdCBoYXNCZWVuQnV5Q291bnQgPSBvcmRlcnMuZGF0YS5yZWR1Y2UoKCB4LCB5ICkgPT4ge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4geCArIHkuY291bnRcbiAgICAgICAgICAgICAgICB9LCAwICk7XG5cbiAgICAgICAgICAgICAgICBjb25zdCB0aGlzVHJpcEJ1eUNvdW50ID0gZXZlbnQuZGF0YS5saXN0XG4gICAgICAgICAgICAgICAgICAgIC5maWx0ZXIoIHggPT4geC5waWQgPT09IGdvb2QuX2lkIClcbiAgICAgICAgICAgICAgICAgICAgLnJlZHVjZSgoIHgsIHkgKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4geCArIHkuY291bnRcbiAgICAgICAgICAgICAgICAgICAgfSwgMCApO1xuICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICBpZiAoIHRoaXNUcmlwQnV5Q291bnQgKyBoYXNCZWVuQnV5Q291bnQgPiBnb29kLmxpbWl0ICkge1xuICAgICAgICAgICAgICAgICAgICBoYXNMaW1pdEdvb2QucHVzaCggZ29vZCApO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pKTtcbiAgICAgICAgICAgIFxuXG4gICAgICAgICAgICBsZXQgb3JkZXJzID0gWyBdO1xuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiDlpoLmnpzlj6/ku6XotK3kubBcbiAgICAgICAgICAgICAqICEg5om56YeP5Yib5bu66aKE5LuY6K6i5Y2VXG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIGlmICggaGFzTGltaXRHb29kLmxlbmd0aCA9PT0gMCAmJiBsb3dTdG9jay5sZW5ndGggPT09IDAgJiYgY2Fubm90QnV5Lmxlbmd0aCA9PT0gMCAmJiBoYXNCZWVuRGVsZXRlLmxlbmd0aCA9PT0gMCApIHtcblxuICAgICAgICAgICAgICAgIGNvbnN0IHJlcURhdGEgPSB7XG4gICAgICAgICAgICAgICAgICAgIHRpZCxcbiAgICAgICAgICAgICAgICAgICAgb3BlbklkLFxuICAgICAgICAgICAgICAgICAgICBmcm9tOiBldmVudC5kYXRhLmZyb20gfHwgJ3N5c3RlbScsXG4gICAgICAgICAgICAgICAgICAgIG9yZGVyczogZXZlbnQuZGF0YS5saXN0XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgY29uc3QgY3JlYXRlT3JkZXIkID0gYXdhaXQgY2xvdWQuY2FsbEZ1bmN0aW9uKHtcbiAgICAgICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgICAgICAgZGF0YTogcmVxRGF0YSxcbiAgICAgICAgICAgICAgICAgICAgICAgICR1cmw6ICdjcmVhdGUnXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIG5hbWU6ICdvcmRlcidcbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgIGlmICggY3JlYXRlT3JkZXIkLnJlc3VsdC5zdGF0dXMgIT09IDIwMCApIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGN0eC5ib2R5ID0ge1xuICAgICAgICAgICAgICAgICAgICAgICAgc3RhdHVzOiA1MDAsXG4gICAgICAgICAgICAgICAgICAgICAgICBtZXNzYWdlOiAn5Yib5bu66aKE5LuY6K6i5Y2V5aSx6LSl77yBJ1xuICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBvcmRlcnMgPSBjcmVhdGVPcmRlciQucmVzdWx0LmRhdGE7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiBjdHguYm9keSA9IHtcbiAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICAgIG9yZGVycyxcbiAgICAgICAgICAgICAgICAgICAgbG93U3RvY2ssXG4gICAgICAgICAgICAgICAgICAgIGNhbm5vdEJ1eSxcbiAgICAgICAgICAgICAgICAgICAgaGFzTGltaXRHb29kLFxuICAgICAgICAgICAgICAgICAgICBoYXNCZWVuQnV5LFxuICAgICAgICAgICAgICAgICAgICBoYXNCZWVuRGVsZXRlLFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgc3RhdHVzOiAyMDBcbiAgICAgICAgICAgIH1cblxuICAgICAgICB9IGNhdGNoICggZSApIHtcbiAgICAgXG4gICAgICAgICAgICByZXR1cm4gY3R4LmJvZHkgPSB7XG4gICAgICAgICAgICAgICAgc3RhdHVzOiA1MDAsXG4gICAgICAgICAgICAgICAgbWVzc2FnZTogZVxuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgLyoqXG4gICAgICogQGRlc2NyaXB0aW9uXG4gICAgICog55Sx6K6i5Y2V5Yib5bu66LSt54mp5riF5Y2VXG4gICAgICogb3BlbklkXG4gICAgICogbGlzdDoge1xuICAgICAqICAgIHRpZCxcbiAgICAgKiAgICBwaWQsXG4gICAgICogICAgc2lkLFxuICAgICAqICAgIG9pZCxcbiAgICAgKiAgICBwcmljZSxcbiAgICAgKiAgICBncm91cFByaWNlLFxuICAgICAqISAgIGFjaWRcbiAgICAgKiB9WyBdXG4gICAgICogXG4gICAgICog5bm26L+U5Zue6LSt5Lmw5o6o6YCB6YCa55+l55qE5pWw5o2u57uT5p6EXG4gICAgICoge1xuICAgICAqICAgICAg5b2T5YmN55qE5Lmw5a62XG4gICAgICogICAgICBidXllcjoge1xuICAgICAqICAgICAgICAgIGRlbHRhLFxuICAgICAqICAgICAgICAgIG9wZW5pZCxcbiAgICAgKiAgICAgICAgICB0eXBlOiAnYnV5JyB8ICdidXlQaW4nIHwgJ3dhaXRQaW4nICgg5p2D6YeN6LaK5p2l6LaK6auYIClcbiAgICAgKiAgICAgIH1cbiAgICAgKiAgICAgIOaLvOWbouaIkOWKn+eahOWFtuS7luS5sOWutlxuICAgICAqICAgICAgb3RoZXJzOiBbXG4gICAgICogICAgICAgICAgICBvcGVuaWRcbiAgICAgKiAgICAgICAgICAgIGFjaWRcbiAgICAgKiAgICAgICAgICAgIHNpZFxuICAgICAqICAgICAgICAgICAgcGlkXG4gICAgICogICAgICAgICAgICB0aWRcbiAgICAgKiAgICAgICAgICAgIGRlbHRhXG4gICAgICogICAgICBdXG4gICAgICogfVxuICAgICAqL1xuICAgIGFwcC5yb3V0ZXIoJ2NyZWF0ZScsIGFzeW5jKCBjdHgsIG5leHQgKSA9PiB7XG4gICAgICAgIHRyeSB7XG5cbiAgICAgICAgICAgIGxldCBvdGhlcnM6IGFueSA9IFsgXTtcbiAgICAgICAgICAgIGxldCBidXllcjogYW55ID0gbnVsbDtcbiAgICAgICAgICAgIGxldCBidXllckJ1eVBpbkRlbHRhID0gMDtcbiAgICAgICAgICAgIGxldCBidXllcldhaXRQaW5EZWx0YSA9IDA7XG5cbiAgICAgICAgICAgIGNvbnN0IHsgbGlzdCwgb3BlbklkIH0gPSBldmVudC5kYXRhO1xuIFxuICAgICAgICAgICAgYXdhaXQgUHJvbWlzZS5hbGwoIGxpc3QubWFwKCBhc3luYyBvcmRlck1ldGEgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IHsgdGlkLCBwaWQsIHNpZCwgb2lkLCBwcmljZSwgZ3JvdXBQcmljZSwgYWNpZCB9ID0gb3JkZXJNZXRhO1xuICAgICAgICAgICAgICAgIGxldCBxdWVyeSA9IHtcbiAgICAgICAgICAgICAgICAgICAgdGlkLFxuICAgICAgICAgICAgICAgICAgICBwaWRcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIGlmICggISFzaWQgKSB7XG4gICAgICAgICAgICAgICAgICAgIHF1ZXJ5WydzaWQnXSA9IHNpZDtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAvLyDmj5LlhaXmtLvliqjnmoTmn6Xor6LmnaHku7ZcbiAgICAgICAgICAgICAgICBpZiAoICEhYWNpZCApIHtcbiAgICAgICAgICAgICAgICAgICAgcXVlcnkgPSBPYmplY3QuYXNzaWduKHsgfSwgcXVlcnksIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGFjaWRcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgY29uc3QgZmluZCQgPSBhd2FpdCBkYi5jb2xsZWN0aW9uKCdzaG9wcGluZy1saXN0JylcbiAgICAgICAgICAgICAgICAgICAgLndoZXJlKCBxdWVyeSApXG4gICAgICAgICAgICAgICAgICAgIC5nZXQoICk7XG5cbiAgICAgICAgICAgICAgICAvLyDliJvlu7rph4fotK3ljZVcbiAgICAgICAgICAgICAgICBpZiAoIGZpbmQkLmRhdGEubGVuZ3RoID09PSAwICkge1xuXG4gICAgICAgICAgICAgICAgICAgIC8vIOWkhOeQhuaOqOmAge+8mmJ1eWVyXG4gICAgICAgICAgICAgICAgICAgIGlmICggIWJ1eWVyICYmICFncm91cFByaWNlICkge1xuICAgICAgICAgICAgICAgICAgICAgICAgYnV5ZXIgPSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb3BlbmlkOiBvcGVuSWQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogJ2J1eScsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVsdGE6IDBcbiAgICAgICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBidXllcldhaXRQaW5EZWx0YSArPSBOdW1iZXIoKCBwcmljZSAtIGdyb3VwUHJpY2UgKS50b0ZpeGVkKCAwICkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgYnV5ZXIgPSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb3BlbmlkOiBvcGVuSWQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogJ3dhaXRQaW4nLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlbHRhOiBidXllcldhaXRQaW5EZWx0YVxuICAgICAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IG1ldGEgPSBPYmplY3QuYXNzaWduKHsgfSwgcXVlcnksIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGFjaWQ6IGFjaWQgfHwgdW5kZWZpbmVkXG4gICAgICAgICAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG9pZHM6IFsgb2lkIF0sXG4gICAgICAgICAgICAgICAgICAgICAgICB1aWRzOiBbIG9wZW5JZCBdLFxuICAgICAgICAgICAgICAgICAgICAgICAgcHVyY2hhc2U6IDAsXG4gICAgICAgICAgICAgICAgICAgICAgICBidXlfc3RhdHVzOiAnMCcsXG4gICAgICAgICAgICAgICAgICAgICAgICBiYXNlX3N0YXR1czogJzAnLFxuICAgICAgICAgICAgICAgICAgICAgICAgYWRqdXN0UHJpY2U6IHByaWNlLFxuICAgICAgICAgICAgICAgICAgICAgICAgYWRqdXN0R3JvdXBQcmljZTogZ3JvdXBQcmljZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGNyZWF0ZVRpbWU6IGdldE5vdyggdHJ1ZSApXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICBcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgY3JlYXRlJCA9IGF3YWl0IGRiLmNvbGxlY3Rpb24oJ3Nob3BwaW5nLWxpc3QnKVxuICAgICAgICAgICAgICAgICAgICAgICAgLmFkZCh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YTogbWV0YVxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuXG4gICAgICAgICAgICAgICAgLy8g5pu05paw5o+S5YWlXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgbGV0IG1ldGFTaG9wcGluZ0xpc3QgPSBmaW5kJC5kYXRhWyAwIF07XG4gICAgICAgICAgICAgICAgICAgIGlmICggIW1ldGFTaG9wcGluZ0xpc3Qub2lkcy5maW5kKCB4ID0+IHggPT09IG9pZCApKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBsYXN0T2lkcyA9IG1ldGFTaG9wcGluZ0xpc3Qub2lkcztcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGxhc3RVaWRzID0gbWV0YVNob3BwaW5nTGlzdC51aWRzO1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgbGFzdEFkanVzdFByaWNlID0gbWV0YVNob3BwaW5nTGlzdC5hZGp1c3RQcmljZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGxhc3RBZGp1c3RHcm91cFByaWNlID0gbWV0YVNob3BwaW5nTGlzdC5hZGp1c3RHcm91cFByaWNlO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyDlpITnkIbmjqjpgIHvvJpidXllcuOAgW90aGVyc1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCAhIWxhc3RBZGp1c3RHcm91cFByaWNlICkge1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgY3VycmVudERlbHRhID0gTnVtYmVyKCggbGFzdEFkanVzdFByaWNlIC0gbGFzdEFkanVzdEdyb3VwUHJpY2UgKS50b0ZpeGVkKCAwICkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gYnV5ZXLmi7zlm6LmiJDlip9cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoIGxhc3RVaWRzLmZpbHRlciggeCA9PiB4ICE9PSBvcGVuSWQgKS5sZW5ndGggPiAwICkge1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJ1eWVyQnV5UGluRGVsdGEgKz0gY3VycmVudERlbHRhO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoICFidXllciB8fCAoICEhYnV5ZXIgJiYgYnV5ZXIudHlwZSA9PT0gJ2J1eScgKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnV5ZXIgPSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb3BlbmlkOiBvcGVuSWQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogJ2J1eVBpbicsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVsdGE6IGJ1eWVyQnV5UGluRGVsdGFcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGJ1eWVy5b6F5ou8XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnV5ZXJXYWl0UGluRGVsdGEgKz0gY3VycmVudERlbHRhO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBidXllciA9IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9wZW5pZDogb3BlbklkLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogJ3dhaXRQaW4nLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVsdGE6IGJ1eWVyV2FpdFBpbkRlbHRhXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIOWkhOeQhiBvdGhlclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICggIWxhc3RVaWRzLmZpbmQoIHggPT4geCA9PT0gb3BlbklkICkgJiYgbGFzdFVpZHMubGVuZ3RoID09PSAxICkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvdGhlcnMucHVzaCh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwaWQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aWQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzaWQ6IHNpZCB8fCB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhY2lkOiBhY2lkIHx8IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9wZW5pZDogbGFzdFVpZHNbIDAgXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlbHRhOiBjdXJyZW50RGVsdGEsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoICFidXllciApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnV5ZXIgPSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvcGVuaWQ6IG9wZW5JZCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6ICdidXknLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVsdGE6IDBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIOaPkuWFpeWIsOWktOmDqO+8jOacgOaWsOeahOW3suaUr+S7mOiuouWNleWwseWcqOS4iumdolxuICAgICAgICAgICAgICAgICAgICAgICAgbGFzdE9pZHMudW5zaGlmdCggb2lkICk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICggIWxhc3RVaWRzLmZpbmQoIHggPT4geCA9PT0gb3BlbklkICkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsYXN0VWlkcy51bnNoaWZ0KCBvcGVuSWQgKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgdXBkYXRlJCA9IGF3YWl0IGRiLmNvbGxlY3Rpb24oJ3Nob3BwaW5nLWxpc3QnKS5kb2MoIFN0cmluZyggZmluZCQuZGF0YVsgMCBdLl9pZCApKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC51cGRhdGUoe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvaWRzOiBsYXN0T2lkcyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHVpZHM6IGxhc3RVaWRzLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdXBkYXRlVGltZTogZ2V0Tm93KCB0cnVlIClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgfSkpO1xuXG4gICAgICAgICAgICByZXR1cm4gY3R4LmJvZHkgPSB7XG4gICAgICAgICAgICAgICAgc3RhdHVzOiAyMDAsXG4gICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgICBidXllcixcbiAgICAgICAgICAgICAgICAgICAgb3RoZXJzXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgIH0gY2F0Y2ggKCBlICkgeyByZXR1cm4gY3R4LmJvZHkgPSB7IHN0YXR1czogNTAwIH19XG4gICAgfSk7XG5cbiAgICAvKipcbiAgICAgKiBAZGVzY3JpcHRpb24gXG4gICAgICoge1xuICAgICAqICAgICB0aWQsIFxuICAgICAqICAgICBuZWVkT3JkZXJzIOaYr+WQpumcgOimgei/lOWbnuiuouWNlVxuICAgICAqIH1cbiAgICAgKiDooYznqIvnmoTotK3nianmuIXljZXvvIznlKjkuo7osIPmlbTllYblk4Hku7fmoLzjgIHotK3kubDmlbDph49cbiAgICAgKi9cbiAgICBhcHAucm91dGVyKCdsaXN0JywgYXN5bmMoIGN0eCwgbmV4dCApID0+IHtcbiAgICAgICAgdHJ5IHtcblxuICAgICAgICAgICAgbGV0IG9yZGVycyQ6IGFueSA9IFsgXTtcblxuICAgICAgICAgICAgY29uc3QgeyB0aWQsIG5lZWRPcmRlcnMsICB9ID0gZXZlbnQuZGF0YTtcbiAgICAgICAgICAgIGNvbnN0IG9wZW5pZCA9IGV2ZW50LmRhdGEub3BlbklkIHx8IGV2ZW50LnVzZXJJbmZvLm9wZW5JZDtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgXG4gICAgICAgICAgICAvLyDmi7/liLDooYznqIvkuIvmiYDmnInnmoTotK3nianmuIXljZVcbiAgICAgICAgICAgIGNvbnN0IGxpc3RzJCA9IGF3YWl0IGRiLmNvbGxlY3Rpb24oJ3Nob3BwaW5nLWxpc3QnKVxuICAgICAgICAgICAgICAgIC53aGVyZSh7XG4gICAgICAgICAgICAgICAgICAgIHRpZFxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLmdldCggKTtcbiAgICAgICAgICAgXG4gICAgICAgICAgICAvLyDmn6Xor6Lmr4/mnaHmuIXljZXlupXkuIvnmoTmr4/kuKpvcmRlcuivpuaDhe+8jOi/memHjOeahOavj+S4qm9yZGVy6YO95piv5bey5LuY6K6i6YeR55qEXG4gICAgICAgICAgICBpZiAoIG5lZWRPcmRlcnMgIT09IGZhbHNlwqApIHtcbiAgICAgICAgICAgICAgICBvcmRlcnMkID0gYXdhaXQgUHJvbWlzZS5hbGwoIGxpc3RzJC5kYXRhLm1hcCggbGlzdCA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBQcm9taXNlLmFsbCggbGlzdC5vaWRzLm1hcCggYXN5bmMgb2lkID0+IHtcbiAgICBcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IG9yZGVyJCA9IGF3YWl0IGRiLmNvbGxlY3Rpb24oJ29yZGVyJykuZG9jKCBvaWQgKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5nZXQoICk7XG4gICAgXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCB1c2VyJCA9IGF3YWl0IGRiLmNvbGxlY3Rpb24oJ3VzZXInKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC53aGVyZSh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9wZW5pZDogb3JkZXIkLmRhdGEub3BlbmlkXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAuZ2V0KCApO1xuICAgIFxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIE9iamVjdC5hc3NpZ24oeyB9LCBvcmRlciQuZGF0YSwge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHVzZXI6IHVzZXIkLmRhdGFbIDAgXVxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIH0pKTtcbiAgICAgICAgICAgICAgICB9KSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIOafpeivouavj+adoea4heWNleW6leS4i+avj+S4quWVhuWTgeeahOivpuaDhVxuICAgICAgICAgICAgY29uc3QgZ29vZHMkOiBhbnkgPSBhd2FpdCBQcm9taXNlLmFsbCggbGlzdHMkLmRhdGEubWFwKCBhc3luYyBsaXN0ID0+IHtcblxuICAgICAgICAgICAgICAgIGNvbnN0IHsgcGlkLCBzaWQgfSA9IGxpc3Q7XG4gICAgICAgICAgICAgICAgY29uc3QgY29sbGVjdGlvbk5hbWUgPSAhIXNpZCA/ICdzdGFuZGFyZHMnIDogJ2dvb2RzJztcblxuICAgICAgICAgICAgICAgIC8vIOWei+WPt1xuICAgICAgICAgICAgICAgIGxldCBzdGFuZGFyJDogYW55ID0gbnVsbDtcblxuICAgICAgICAgICAgICAgIC8vIOWVhuWTgVxuICAgICAgICAgICAgICAgIGNvbnN0IGdvb2QkID0gYXdhaXQgZGIuY29sbGVjdGlvbignZ29vZHMnKVxuICAgICAgICAgICAgICAgICAgICAuZG9jKCBwaWQgKVxuICAgICAgICAgICAgICAgICAgICAuZ2V0KCApO1xuXG4gICAgICAgICAgICAgICAgaWYgKCAhIXNpZCApIHtcbiAgICAgICAgICAgICAgICAgICAgc3RhbmRhciQgPSBhd2FpdCBkYi5jb2xsZWN0aW9uKCdzdGFuZGFyZHMnKVxuICAgICAgICAgICAgICAgICAgICAgICAgLmRvYyggc2lkIClcbiAgICAgICAgICAgICAgICAgICAgICAgIC5nZXQoICk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICAgICAgdGFnOiBnb29kJC5kYXRhLnRhZyxcbiAgICAgICAgICAgICAgICAgICAgdGl0bGU6IGdvb2QkLmRhdGEudGl0bGUsXG4gICAgICAgICAgICAgICAgICAgIG5hbWU6IHN0YW5kYXIkID8gc3RhbmRhciQuZGF0YS5uYW1lIDogJycsXG4gICAgICAgICAgICAgICAgICAgIHByaWNlOiBzdGFuZGFyJCA/IHN0YW5kYXIkLmRhdGEucHJpY2UgOiBnb29kJC5kYXRhLnByaWNlLFxuICAgICAgICAgICAgICAgICAgICBpbWc6IHN0YW5kYXIkID8gc3RhbmRhciQuZGF0YS5pbWcgOiBnb29kJC5kYXRhLmltZ1sgMCBdLFxuICAgICAgICAgICAgICAgICAgICBncm91cFByaWNlOiBzdGFuZGFyJCA/IHN0YW5kYXIkLmRhdGEuZ3JvdXBQcmljZSA6IGdvb2QkLmRhdGEuZ3JvdXBQcmljZSxcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KSk7XG5cbiAgICAgICAgICAgIC8vIOafpeivoua4heWNleWvueW6lOeahOa0u+WKqOivpuaDhVxuICAgICAgICAgICAgY29uc3QgYWN0aXZpdGllcyQ6IGFueSA9IGF3YWl0IFByb21pc2UuYWxsKCBsaXN0cyQuZGF0YS5tYXAoIGFzeW5jIGxpc3QgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IHsgYWNpZCB9ID0gbGlzdDtcbiAgICAgICAgICAgICAgICBpZiAoICFhY2lkICkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgYWNfcHJpY2U6IG51bGwsXG4gICAgICAgICAgICAgICAgICAgICAgICBhY19ncm91cFByaWNlOiBudWxsXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBtZXRhID0gYXdhaXQgZGIuY29sbGVjdGlvbignYWN0aXZpdHknKVxuICAgICAgICAgICAgICAgICAgICAgICAgLmRvYyggU3RyaW5nKCBhY2lkICkpXG4gICAgICAgICAgICAgICAgICAgICAgICAuZ2V0KCApO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgYWNfcHJpY2U6IG1ldGEuZGF0YS5hY19wcmljZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGFjX2dyb3VwUHJpY2U6IG1ldGEuZGF0YS5hY19ncm91cFByaWNlLFxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSkpO1xuXG4gICAgICAgICAgICBjb25zdCBsaXN0ID0gbGlzdHMkLmRhdGEubWFwKCggbCwgayApID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCB7IGFjX2dyb3VwUHJpY2UsIGFjX3ByaWNlIH0gPSBhY3Rpdml0aWVzJFsgayBdO1xuICAgICAgICAgICAgICAgIGNvbnN0IHsgaW1nLCBwcmljZSwgZ3JvdXBQcmljZSwgdGl0bGUsIG5hbWUsIHRhZyB9ID0gZ29vZHMkWyBrIF07XG4gICAgICAgICAgICAgICAgbGV0IG1ldGEgPSBPYmplY3QuYXNzaWduKHsgfSwgbCwge1xuICAgICAgICAgICAgICAgICAgICB0YWcsXG4gICAgICAgICAgICAgICAgICAgIGltZyxcbiAgICAgICAgICAgICAgICAgICAgcHJpY2UsXG4gICAgICAgICAgICAgICAgICAgIGdyb3VwUHJpY2UsXG4gICAgICAgICAgICAgICAgICAgIGdvb2ROYW1lOiB0aXRsZSxcbiAgICAgICAgICAgICAgICAgICAgc3RhbmRhck5hbWU6IG5hbWUsXG4gICAgICAgICAgICAgICAgICAgIGFjX2dyb3VwUHJpY2UsXG4gICAgICAgICAgICAgICAgICAgIGFjX3ByaWNlXG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICBpZiAoIG5lZWRPcmRlcnMgIT09IGZhbHNlICkge1xuICAgICAgICAgICAgICAgICAgICBtZXRhID0gT2JqZWN0LmFzc2lnbih7IH0sIG1ldGEsIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG9yZGVyOiBvcmRlcnMkWyBrIF0sXG4gICAgICAgICAgICAgICAgICAgICAgICB0b3RhbDogb3JkZXJzJFsgayBdLnJlZHVjZSgoIHgsIHkgKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHggKyB5LmNvdW50O1xuICAgICAgICAgICAgICAgICAgICAgICAgfSwgMCApXG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgcmV0dXJuIG1ldGE7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgcmV0dXJuIGN0eC5ib2R5ID0ge1xuICAgICAgICAgICAgICAgIHN0YXR1czogMjAwLFxuICAgICAgICAgICAgICAgIGRhdGE6IGxpc3QsXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfSBjYXRjaCAoIGUgKSB7IHJldHVybiBjdHguYm9keSA9IHsgc3RhdHVzOiA1MDAgfTt9XG4gICAgfSlcblxuICAgIC8qKlxuICAgICAqIOi0reeJqea4heWNleiwg+aVtFxuICAgICAqIC0tLS0tLS0tIOivt+axglxuICAgICAqIHtcbiAgICAgKiAgICBzaG9wcGluZ0lkLCBhZGp1c3RQcmljZSwgcHVyY2hhc2UsIGFkanVzdEdyb3VwUHJpY2VcbiAgICAgKiB9XG4gICAgICovXG4gICAgYXBwLnJvdXRlcignYWRqdXN0JywgYXN5bmMoIGN0eCwgbmV4dCApID0+IHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgY29uc3QgeyBzaG9wcGluZ0lkLCBhZGp1c3RQcmljZSwgYWRqdXN0R3JvdXBQcmljZSB9ID0gZXZlbnQuZGF0YTtcblxuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiDmuIXljZXvvIzlhYjmi7/liLDorqLljZXph4fotK3mgLvmlbBcbiAgICAgICAgICAgICAqIOmaj+WQjuabtOaWsO+8mumHh+i0remHj+OAgea4heWNleWUruS7t+OAgea4heWNleWboui0reS7t+OAgWJhc2Vfc3RhdHVz44CBYnV5X3N0YXR1c1xuICAgICAgICAgICAgICovXG4gICAgICAgICAgICBjb25zdCBzaG9wcGluZyQgPSBhd2FpdCBkYi5jb2xsZWN0aW9uKCdzaG9wcGluZy1saXN0JylcbiAgICAgICAgICAgICAgICAuZG9jKCBzaG9wcGluZ0lkIClcbiAgICAgICAgICAgICAgICAuZ2V0KCApO1xuICAgXG4gICAgICAgICAgICBjb25zb2xlLmxvZygnMTExMTExJywgc2hvcHBpbmckICk7XG5cbiAgICAgICAgICAgIGNvbnN0IG9yZGVycyQgPSBhd2FpdCBQcm9taXNlLmFsbCggc2hvcHBpbmckLmRhdGEub2lkcy5tYXAoIG9pZCA9PiB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGRiLmNvbGxlY3Rpb24oJ29yZGVyJylcbiAgICAgICAgICAgICAgICAgICAgLmRvYyggb2lkIClcbiAgICAgICAgICAgICAgICAgICAgLmdldCggKTtcbiAgICAgICAgICAgIH0pKTtcblxuICAgICAgICAgICAgY29uc29sZS5sb2coJzIyMjIyMjInLCBvcmRlcnMkICk7XG5cbiAgICAgICAgICAgIC8vIOWJqeS9meWIhumFjemHj1xuICAgICAgICAgICAgbGV0IGxhc3RBbGxvY2F0ZWQgPSAwO1xuXG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIOaAu+WIhumFjemHj1xuICAgICAgICAgICAgICovXG4gICAgICAgICAgICBsZXQgcHVyY2hhc2UgPSBldmVudC5kYXRhLnB1cmNoYXNlO1xuXG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqICEg5Lyg5YWl5YiG6YWN6YeP5LiN6IO95bCR5LqO44CC5bey5a6M5oiQ5YiG6YWN6K6i5Y2V55qE5pWw6aKd5LmL5ZKMXG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIGNvbnN0IGZpbmlzaEFkanVzdE9yZGVycyA9IG9yZGVycyRcbiAgICAgICAgICAgICAgICAubWFwKCggeDogYW55ICkgPT4geC5kYXRhIClcbiAgICAgICAgICAgICAgICAuZmlsdGVyKCBvID0+IG8uYmFzZV9zdGF0dXMgPT09ICcyJyApO1xuXG4gICAgICAgICAgICBjb25zb2xlLmxvZygnMzMzMzMzJywgZmluaXNoQWRqdXN0T3JkZXJzKTtcblxuICAgICAgICAgICAgLy8g5bey5YiG6YWN6YePXG4gICAgICAgICAgICBjb25zdCBoYXNCZWVuQWRqdXN0ID0gZmluaXNoQWRqdXN0T3JkZXJzLnJlZHVjZSgoIHgsIHkgKSA9PiB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHggKyB5LmFsbG9jYXRlZENvdW50O1xuICAgICAgICAgICAgfSwgMCApO1xuXG4gICAgICAgICAgICBjb25zb2xlLmxvZygnNDQ0NDQ0JywgaGFzQmVlbkFkanVzdCApO1xuXG4gICAgICAgICAgICBpZiAoIHB1cmNoYXNlIDwgaGFzQmVlbkFkanVzdCApIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gY3R4LmJvZHkgPSB7XG4gICAgICAgICAgICAgICAgICAgIHN0YXR1czogNTAwLFxuICAgICAgICAgICAgICAgICAgICBtZXNzYWdlOiBg5pyJJHtmaW5pc2hBZGp1c3RPcmRlcnMubGVuZ3RofeS4quiuouWNleW3suehruiupO+8jOaVsOmHj+S4jeiDveWwkeS6jiR7aGFzQmVlbkFkanVzdH3ku7ZgXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgXG4gICAgICAgICAgICBsZXQgbmVlZEJ1eVRvdGFsID0gb3JkZXJzJC5yZWR1Y2UoKCB4LCB5ICkgPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiB4ICsgKHkgYXMgYW55KS5kYXRhLmNvdW50O1xuICAgICAgICAgICAgfSwgMCApO1xuXG4gICAgICAgICAgICBjb25zdCB0ZW1wID0gT2JqZWN0LmFzc2lnbih7IH0sIHNob3BwaW5nJC5kYXRhLCB7XG4gICAgICAgICAgICAgICAgcHVyY2hhc2UsXG4gICAgICAgICAgICAgICAgYWRqdXN0UHJpY2UsXG4gICAgICAgICAgICAgICAgYWRqdXN0R3JvdXBQcmljZSxcbiAgICAgICAgICAgICAgICBiYXNlX3N0YXR1czogJzEnLFxuICAgICAgICAgICAgICAgIGJ1eV9zdGF0dXM6IHB1cmNoYXNlIDwgbmVlZEJ1eVRvdGFsID8gJzInIDogJzEnLFxuICAgICAgICAgICAgICAgIHVwZGF0ZVRpbWU6IGdldE5vdyggdHJ1ZSApXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgZGVsZXRlIHRlbXBbJ19pZCddO1xuXG4gICAgICAgICAgICBjb25zb2xlLmxvZygnNTU1NTU1JywgdGVtcClcblxuICAgICAgICAgICAgLy8g5pu05paw5riF5Y2VXG4gICAgICAgICAgICBhd2FpdCBkYi5jb2xsZWN0aW9uKCdzaG9wcGluZy1saXN0JylcbiAgICAgICAgICAgICAgICAuZG9jKCBzaG9wcGluZ0lkIClcbiAgICAgICAgICAgICAgICAuc2V0KHtcbiAgICAgICAgICAgICAgICAgICAgZGF0YTogdGVtcFxuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqICHku6XkuIvorqLljZXpg73mmK/lt7Lku5jorqLph5HnmoRcbiAgICAgICAgICAgICAqIOiuouWNle+8muaJuemHj+WvueiuouWNleeahOS7t+agvOOAgeWboui0reS7t+OAgei0reS5sOeKtuaAgei/m+ihjOiwg+aVtCjlt7LotK3kubAv6L+b6KGM5Lit77yM5YW25LuW5bey57uP56Gu5a6a6LCD5pW055qE6K6i5Y2V77yM5LiN5YGa5aSE55CGKVxuICAgICAgICAgICAgICog5YW25a6e5bqU6K+l5Lmf6KaB6Ieq5Yqo5rOo5YWl6K6i5Y2V5pWw6YeP77yI562W55Wl77ya5YWI5Yiw5YWI5b6X77yM5ZCO5LiL5Y2V5Lya5pyJ5b6X5LiN5Yiw5Y2V55qE6aOO6Zmp77yJXG4gICAgICAgICAgICAgKiAh5aaC5p6c5bey57uP5YiG6YWN6L+H5LqG77yM5YiZ5LiN5YaN6Ieq5Yqo5YiG6YWN6YeH6LSt6YePXG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIGNvbnN0IHNvcnJlZE9yZGVycyA9IG9yZGVycyRcbiAgICAgICAgICAgICAgICAubWFwKCggeDogYW55ICkgPT4geC5kYXRhIClcbiAgICAgICAgICAgICAgICAuZmlsdGVyKCggeDogYW55ICkgPT4geC5iYXNlX3N0YXR1cyA9PT0gJzAnIHx8IHguYmFzZV9zdGF0dXMgPT09ICcxJyApXG4gICAgICAgICAgICAgICAgLnNvcnQoKCB4OiBhbnksIHk6IGFueSApID0+IHguY3JlYXRlVGltZSAtIHkuY3JlYXRlVGltZSApO1xuXG4gICAgICAgICAgICBjb25zb2xlLmxvZygnNjY2NjY2Jywgc29ycmVkT3JkZXJzICk7XG5cbiAgICAgICAgICAgIC8vIOWJqeS9meWIhumFjemHj1xuICAgICAgICAgICAgcHVyY2hhc2UgLT0gaGFzQmVlbkFkanVzdDtcblxuICAgICAgICAgICAgY29uc29sZS5sb2coICc3NzcnLCBwdXJjaGFzZSApO1xuICAgICAgICBcbiAgICAgICAgICAgIGF3YWl0IFByb21pc2UuYWxsKCBzb3JyZWRPcmRlcnMubWFwKCBhc3luYyBvcmRlciA9PiB7XG5cbiAgICAgICAgICAgICAgICBjb25zdCBiYXNlVGVtcCA9IHtcbiAgICAgICAgICAgICAgICAgICAgYWxsb2NhdGVkUHJpY2U6IGFkanVzdFByaWNlLFxuICAgICAgICAgICAgICAgICAgICBhbGxvY2F0ZWRHcm91cFByaWNlOiBhZGp1c3RHcm91cFByaWNlLFxuICAgICAgICAgICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAgICAgICAgICog5peg6K666Ieq5Yqo5YiG6YWN5piv5ZCm5oiQ5Yqf77yM6YO95piv6KKr4oCc5YiG6YWN4oCd5pON5L2c6L+H55qEXG4gICAgICAgICAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgICAgICAgICBiYXNlX3N0YXR1czogJzEnLFxuICAgICAgICAgICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAgICAgICAgICogISEhIOWJqeS9meWIhumFjemHj+S4jei2s+mHh+i0remHj++8jOWwseWIhumFjeWJqeS9meeahOmHh+i0remHj1xuICAgICAgICAgICAgICAgICAgICAgKi9cbiAgICAgICAgICAgICAgICAgICAgYWxsb2NhdGVkQ291bnQ6IHB1cmNoYXNlIC0gb3JkZXIuY291bnQgPj0gMCA/XG4gICAgICAgICAgICAgICAgICAgICAgICBvcmRlci5jb3VudCA6XG4gICAgICAgICAgICAgICAgICAgICAgICBwdXJjaGFzZVxuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgLy8g5YiG6YWN5oiQ5YqfXG4gICAgICAgICAgICAgICAgaWYgKCBwdXJjaGFzZSAtIG9yZGVyLmNvdW50ID49IDAgKSB7XG4gICAgICAgICAgICAgICAgICAgIGxhc3RBbGxvY2F0ZWQgPSBwdXJjaGFzZSAtIG9yZGVyLmNvdW50O1xuICAgICAgICAgICAgICAgICAgICBwdXJjaGFzZSAtPSBvcmRlci5jb3VudDtcblxuICAgICAgICAgICAgICAgIC8vIOi0p+a6kOS4jei2s++8jOWIhumFjeacgOWQjueahOWJqeS9memHj1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGxhc3RBbGxvY2F0ZWQgPSAwO1xuICAgICAgICAgICAgICAgICAgICBwdXJjaGFzZSA9IDA7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgY29uc3QgdGVtcCA9IE9iamVjdC5hc3NpZ24oeyB9LCBvcmRlciwgYmFzZVRlbXAgKTtcblxuICAgICAgICAgICAgICAgIGRlbGV0ZSB0ZW1wWydfaWQnXTtcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICBhd2FpdCBkYi5jb2xsZWN0aW9uKCdvcmRlcicpXG4gICAgICAgICAgICAgICAgICAgIC5kb2MoIG9yZGVyLl9pZCApXG4gICAgICAgICAgICAgICAgICAgIC5zZXQoe1xuICAgICAgICAgICAgICAgICAgICAgICAgZGF0YTogdGVtcFxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICByZXR1cm47XG5cbiAgICAgICAgICAgIH0pKTtcblxuICAgICAgICAgICAgLy8g5pu05paw5riF5Y2V55qE5Ymp5L2Z5YiG6YWN5pWwXG4gICAgICAgICAgICBhd2FpdCBkYi5jb2xsZWN0aW9uKCdzaG9wcGluZy1saXN0JylcbiAgICAgICAgICAgICAgICAuZG9jKCBzaG9wcGluZ0lkIClcbiAgICAgICAgICAgICAgICAudXBkYXRlKHtcbiAgICAgICAgICAgICAgICAgICAgZGF0YTogeyBsYXN0QWxsb2NhdGVkIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgXG4gICAgICAgICAgICByZXR1cm4gY3R4LmJvZHkgPSB7XG4gICAgICAgICAgICAgICAgc3RhdHVzOiAyMDBcbiAgICAgICAgICAgIH1cblxuICAgICAgICB9IGNhdGNoICggZSApIHsgcmV0dXJuIGN0eC5ib2R5ID0geyBzdGF0dXM6IDUwMCB9O31cbiAgICB9KVxuXG4gICAgLyoqXG4gICAgICogQGRlc2NyaXB0aW9uXG4gICAgICog6I635Y+W6KGM56iL6YeM5piv5ZCm6L+Y5pyJ5pyq6LCD5pW055qE5riF5Y2VXG4gICAgKi9cbiAgICBhcHAucm91dGVyKCdhZGp1c3Qtc3RhdHVzJywgYXN5bmMoIGN0eCwgbmV4dCApID0+IHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGNvbnN0IHsgdGlkIH0gPSBldmVudC5kYXRhO1xuICAgICAgICAgICAgY29uc3QgY291bnQgPSBhd2FpdCBkYi5jb2xsZWN0aW9uKCdzaG9wcGluZy1saXN0JylcbiAgICAgICAgICAgICAgICAud2hlcmUoe1xuICAgICAgICAgICAgICAgICAgICB0aWQsXG4gICAgICAgICAgICAgICAgICAgIGJhc2Vfc3RhdHVzOiAnMCdcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIC5jb3VudCggKTtcblxuICAgICAgICAgICAgcmV0dXJuIGN0eC5ib2R5ID0ge1xuICAgICAgICAgICAgICAgIHN0YXR1czogMjAwLFxuICAgICAgICAgICAgICAgIGRhdGE6IGNvdW50LnRvdGFsXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfSBjYXRjaCAoIGUgKSB7XG4gICAgICAgICAgICByZXR1cm4gY3R4LmJvZHkgPSB7IHN0YXR1czogNTAwIH07XG4gICAgICAgIH1cbiAgICB9KVxuXG4gICAgLyoqXG4gICAgICogQGRlc2NyaXB0aW9uXG4gICAgICog562J5b6F5ou85Zui5YiX6KGoIC8g5Y+v5ou85Zui5YiX6KGoICgg5Y+v5oyH5a6a5ZWG5ZOBOiDllYblk4Hor6bmg4XpobXpnaIgKVxuICAgICAqIHtcbiAgICAgKiAgICB0aWQsXG4gICAgICogICAgcGlkLFxuICAgICAqICAgIGxpbWl0XG4gICAgICogICAgZGV0YWlsOiBib29sZWFuIOaYr+WQpuW4puWbnuWVhuWTgeivpuaDhe+8iOm7mOiupOW4puWbnu+8iVxuICAgICAqICAgIHNob3dVc2VyOiBib29sZWFuIOaYr+WQpumcgOimgeeUqOaIt+WktOWDj+etieS/oeaBr++8iOm7mOiupOS4jeW4puWbnu+8iVxuICAgICAqICAgIHR5cGU6ICAnd2FpdCcgfCAncGluJyB8ICdhbGwnIC8vIOetieW+heaLvOWbouOAgeW3suaLvOWbouOAgeetieW+heaLvOWboivlt7Lmi7zlm6LjgIHmiYDmnInotK3nianmuIXmt6FcbiAgICAgKiB9XG4gICAgICovXG4gICAgYXBwLnJvdXRlcigncGluJywgYXN5bmMoIGN0eCwgbmV4dCApID0+IHtcbiAgICAgICAgdHJ5IHtcblxuICAgICAgICAgICAgbGV0IGJqcENvbmZpZzogYW55ID0gbnVsbDtcbiAgICAgICAgICAgIGNvbnN0IG9wZW5pZCA9IGV2ZW50LnVzZXJJbmZvLm9wZW5JZDtcbiAgICAgICAgICAgIGNvbnN0IHsgdGlkLCBkZXRhaWwsIHBpZCwgdHlwZSwgbGltaXQgfSA9IGV2ZW50LmRhdGE7XG4gICAgICAgICAgICBjb25zdCBzaG93VXNlciA9IGV2ZW50LmRhdGEuc2hvd1VzZXIgfHwgZmFsc2U7XG5cbiAgICAgICAgICAgIGNvbnN0IHF1ZXJ5ID0gcGlkID8ge1xuICAgICAgICAgICAgICAgIHRpZCxcbiAgICAgICAgICAgICAgICBwaWRcbiAgICAgICAgICAgIH0gOiB7XG4gICAgICAgICAgICAgICAgdGlkXG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICBsZXQgc2hvcHBpbmckO1xuICAgICAgICAgICAgaWYgKCBsaW1pdCApIHtcbiAgICAgICAgICAgICAgICBzaG9wcGluZyQgPSBhd2FpdCBkYi5jb2xsZWN0aW9uKCdzaG9wcGluZy1saXN0JylcbiAgICAgICAgICAgICAgICAgICAgLndoZXJlKCBxdWVyeSApXG4gICAgICAgICAgICAgICAgICAgIC5saW1pdCggbGltaXQgKVxuICAgICAgICAgICAgICAgICAgICAuZ2V0KCApO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBzaG9wcGluZyQgPSBhd2FpdCBkYi5jb2xsZWN0aW9uKCdzaG9wcGluZy1saXN0JylcbiAgICAgICAgICAgICAgICAgICAgLndoZXJlKCBxdWVyeSApXG4gICAgICAgICAgICAgICAgICAgIC5nZXQoICk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIC8vIOS/neWBpeWTgemFjee9rlxuICAgICAgICAgICAgY29uc3QgYmpwQ29uZmlnJCA9IGF3YWl0IGRiLmNvbGxlY3Rpb24oJ2FwcC1jb25maWcnKVxuICAgICAgICAgICAgLndoZXJlKHtcbiAgICAgICAgICAgICAgICB0eXBlOiAnYXBwLWJqcC12aXNpYmxlJ1xuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC5nZXQoICk7XG4gICAgICAgICAgICBianBDb25maWcgPSBianBDb25maWckLmRhdGFbIDAgXTtcblxuICAgICAgICAgICAgLy8gdWlkc+mVv+W6puS4ujHvvIzkuLrlvoXmi7zliJfooaggKCDmn6Xor6LlvoXmi7zliJfooajml7bvvIzlj6/ku6XmnInoh6rlt7HvvIzorqnlrqLmiLfnn6XpgZPns7vnu5/kvJrliJflh7rmnaUgKVxuICAgICAgICAgICAgLy8gdWlkc+mVv+W6puS4ujLvvIzkuLrlj6/ku6Xmi7zlm6LliJfooahcbiAgICAgICAgICAgIGxldCBkYXRhOiBhbnkgPSBbIF07XG4gICAgICAgICAgICBsZXQgZGF0YSQgPSBzaG9wcGluZyQuZGF0YS5maWx0ZXIoIHMgPT4ge1xuICAgICAgICAgICAgICAgIGlmICggdHlwZSA9PT0gJ3BpbicgKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAoICEhcy5hZGp1c3RHcm91cFByaWNlIHx8ICEhcy5ncm91cFByaWNlICkgJiYgcy51aWRzLmxlbmd0aCA+IDE7XG5cbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKCB0eXBlID09PSAnd2FpdCcgKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAoICEhcy5hZGp1c3RHcm91cFByaWNlIHx8ICEhcy5ncm91cFByaWNlICkgJiYgcy51aWRzLmxlbmd0aCA9PT0gMTtcblxuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoIHR5cGUgPT09IHVuZGVmaW5lZCApIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuICggISFzLmFkanVzdEdyb3VwUHJpY2UgfHwgISFzLmdyb3VwUHJpY2UgKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgZGF0YSQgPSBkYXRhJC5zb3J0KCggeCwgeSApID0+IHkudWlkcy5sZW5ndGggLSB4LnVpZHMubGVuZ3RoICk7XG4gICAgICAgICAgICBkYXRhID0gZGF0YSQ7XG5cbiAgICAgICAgICAgIC8vIOWVhuWTgVxuICAgICAgICAgICAgY29uc3QgZ29vZElkcyA9IEFycmF5LmZyb20oXG4gICAgICAgICAgICAgICAgbmV3IFNldCggZGF0YSQubWFwKCBsaXN0ID0+IFxuICAgICAgICAgICAgICAgICAgICBsaXN0LnBpZFxuICAgICAgICAgICAgICAgICkpXG4gICAgICAgICAgICApO1xuXG4gICAgICAgICAgICAvLyDlnovlj7dcbiAgICAgICAgICAgIGNvbnN0IHN0YW5kYXJzSWRzID0gQXJyYXkuZnJvbShcbiAgICAgICAgICAgICAgICBuZXcgU2V0KCBkYXRhJC5tYXAoIGxpc3QgPT4gXG4gICAgICAgICAgICAgICAgICAgIGxpc3Quc2lkXG4gICAgICAgICAgICAgICAgKSlcbiAgICAgICAgICAgICkuZmlsdGVyKCB4ID0+ICEheCApO1xuXG4gICAgICAgICAgICAvLyDllYblk4FcbiAgICAgICAgICAgIGxldCBhbGxHb29kcyQ6IGFueSA9IGF3YWl0IFByb21pc2UuYWxsKCBnb29kSWRzLm1hcCggZ29vZElkID0+IHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZGIuY29sbGVjdGlvbignZ29vZHMnKVxuICAgICAgICAgICAgICAgICAgICAuZG9jKCBTdHJpbmcoIGdvb2RJZCApKVxuICAgICAgICAgICAgICAgICAgICAuZ2V0KCApO1xuICAgICAgICAgICAgfSkpO1xuXG4gICAgICAgICAgICBhbGxHb29kcyQgPSBhbGxHb29kcyQubWFwKCB4ID0+IHguZGF0YSApO1xuXG4gICAgICAgICAgICAvLyDmn6Xor6Lmr4/mnaHmuIXljZXlupXkuIvmr4/kuKrllYblk4HnmoTor6bmg4VcbiAgICAgICAgICAgIGlmICggZGV0YWlsID09PSB1bmRlZmluZWQgfHwgISFkZXRhaWwgKSB7XG5cbiAgICAgICAgICAgICAgICAvLyDlnovlj7dcbiAgICAgICAgICAgICAgICBsZXQgYWxsU3RhbmRhcnMkOiBhbnkgPSBhd2FpdCBQcm9taXNlLmFsbCggc3RhbmRhcnNJZHMubWFwKCBzaWQgPT4ge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZGIuY29sbGVjdGlvbignc3RhbmRhcmRzJylcbiAgICAgICAgICAgICAgICAgICAgICAgIC5kb2MoIFN0cmluZyggc2lkICkpXG4gICAgICAgICAgICAgICAgICAgICAgICAuZ2V0KCApO1xuICAgICAgICAgICAgICAgIH0pKTtcblxuICAgICAgICAgICAgICAgIGFsbFN0YW5kYXJzJCA9IGFsbFN0YW5kYXJzJC5tYXAoIHggPT4geC5kYXRhICk7XG5cbiAgICAgICAgICAgICAgICBjb25zdCBnb29kJCA9IGRhdGEkLm1hcCggbGlzdCA9PiB7XG5cbiAgICAgICAgICAgICAgICAgICAgY29uc3QgeyBwaWQsIHNpZCB9ID0gbGlzdDtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgZ29vZDogYW55ID0gYWxsR29vZHMkLmZpbmQoIHggPT4geC5faWQgPT09IHBpZCApO1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBzdGFuZGFyID0gYWxsU3RhbmRhcnMkLmZpbmQoIHggPT4geC5faWQgPT09IHNpZCApO1xuICAgIFxuICAgICAgICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgZ29vZCxcbiAgICAgICAgICAgICAgICAgICAgICAgIHRhZzogZ29vZC50YWcsXG4gICAgICAgICAgICAgICAgICAgICAgICB0aXRsZTogZ29vZC50aXRsZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHNhbGVkOiBnb29kLnNhbGVkLFxuICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogc3RhbmRhciA/IHN0YW5kYXIubmFtZSA6ICcnLFxuICAgICAgICAgICAgICAgICAgICAgICAgcHJpY2U6IHN0YW5kYXIgPyBzdGFuZGFyLnByaWNlIDogZ29vZC5wcmljZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGltZzogc3RhbmRhciA/IHN0YW5kYXIuaW1nIDogZ29vZC5pbWdbIDAgXSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGdyb3VwUHJpY2U6IHN0YW5kYXIgPyBzdGFuZGFyLmdyb3VwUHJpY2UgOiBnb29kLmdyb3VwUHJpY2UsXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICBcbiAgICAgICAgICAgICAgICAvLyDms6jlhaXllYblk4Hor6bmg4VcbiAgICAgICAgICAgICAgICBkYXRhID0gZGF0YSQubWFwKCggc2hvcHBpbmcsIGsgKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAuLi5zaG9wcGluZywgXG4gICAgICAgICAgICAgICAgICAgICAgICBkZXRhaWw6IGdvb2QkWyBrIF1cbiAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyDlsZXnpLrnlKjmiLflpLTlg49cbiAgICAgICAgICAgIGlmICggc2hvd1VzZXIgKSB7XG5cbiAgICAgICAgICAgICAgICBsZXQgdWlkczogc3RyaW5nWyBdID0gWyBdO1xuICAgICAgICAgICAgICAgIGRhdGEkLm1hcCggbGlzdCA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHVpZHMgPSBbIC4uLnVpZHMsIC4uLmxpc3QudWlkcyBdO1xuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgdWlkcyA9IEFycmF5LmZyb20oXG4gICAgICAgICAgICAgICAgICAgIG5ldyBTZXQoIHVpZHMgKVxuICAgICAgICAgICAgICAgICk7XG4gXG4gICAgICAgICAgICAgICAgbGV0IHVzZXJzJDogYW55ID0gYXdhaXQgUHJvbWlzZS5hbGwoIHVpZHMubWFwKCB1aWQgPT4ge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZGIuY29sbGVjdGlvbigndXNlcicpXG4gICAgICAgICAgICAgICAgICAgICAgICAud2hlcmUoe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9wZW5pZDogdWlkXG4gICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAgICAgLmZpZWxkKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvcGVuaWQ6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYXZhdGFyVXJsOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5pY2tOYW1lOiB0cnVlXG4gICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAgICAgLmdldCggKTtcbiAgICAgICAgICAgICAgICB9KSk7XG5cbiAgICAgICAgICAgICAgICB1c2VycyQgPSB1c2VycyQubWFwKCB4ID0+IHguZGF0YVsgMCBdKTtcblxuICAgICAgICAgICAgICAgIGRhdGEgPSBkYXRhLm1hcCgoIHNob3BwaW5nLCBrICkgPT4ge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgLi4uc2hvcHBpbmcsXG4gICAgICAgICAgICAgICAgICAgICAgICB1c2Vyczogc2hvcHBpbmcudWlkcy5tYXAoIHVpZCA9PiB1c2VycyQuZmluZCggeCA9PiB4Lm9wZW5pZCA9PT0gdWlkICkpXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgXG4gICAgICAgICAgICAvLyDmoLnmja7kv53lgaXlk4Horr7nva7ov5vooYznm7jlupTnmoTov4fmu6RcbiAgICAgICAgICAgIGlmICggISFianBDb25maWcgJiYgIWJqcENvbmZpZy52YWx1ZSApIHtcbiAgICAgICAgICAgICAgICBjb25zdCBtZXRhID0gZGF0YVxuICAgICAgICAgICAgICAgICAgICAuZmlsdGVyKCB4ID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGdvb2QgPSBhbGxHb29kcyQuZmluZCggeSA9PiB5Ll9pZCA9PT0geC5waWQgKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBTdHJpbmcoIGdvb2QuY2F0ZWdvcnkgKSAhPT0gJzQnXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIGRhdGEgPSBtZXRhO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gY3R4LmJvZHkgPSB7XG4gICAgICAgICAgICAgICAgZGF0YSxcbiAgICAgICAgICAgICAgICBzdGF0dXM6IDIwMFxuICAgICAgICAgICAgfVxuXG4gICAgICAgIH0gY2F0Y2ggKCBlICkge1xuICAgICAgICAgICAgcmV0dXJuIGN0eC5ib2R5ID0geyBzdGF0dXM6IDUwMCB9O1xuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICAvKiogXG4gICAgICogQGRlc2NyaXB0aW9uXG4gICAgICog5LuZ5aWz6LSt54mp5riF5Y2VICgg5Lmw5LqG5aSa5bCR44CB5Y2h5Yi45aSa5bCR44CB55yB5LqG5aSa5bCRIClcbiAgICAgKi9cbiAgICBhcHAucm91dGVyKCdmYWlyeS1zaG9wcGluZ2xpc3QnLCBhc3luYyggY3R4LCBuZXh0ICkgPT4ge1xuICAgICAgICB0cnkge1xuXG4gICAgICAgICAgICBjb25zdCB7IHRpZCB9ID0gZXZlbnQuZGF0YTtcbiAgICAgICAgICAgIGNvbnN0IGxpbWl0ID0gZXZlbnQuZGF0YS5saW1pdCB8fCA1O1xuXG4gICAgICAgICAgICAvKiog6KGM56iL6LSt54mp5riF5Y2VICovXG4gICAgICAgICAgICBjb25zdCBzaG9wcGluZ01ldGEkID0gYXdhaXQgZGIuY29sbGVjdGlvbignc2hvcHBpbmctbGlzdCcpXG4gICAgICAgICAgICAgICAgLndoZXJlKHtcbiAgICAgICAgICAgICAgICAgICAgdGlkXG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAuZ2V0KCApO1xuICAgICAgICAgICAgXG4gICAgICAgIFxuICAgICAgICAgICAgLyoqIOaJgOaciXVpZO+8iOWQq+mHjeWkje+8iSAqL1xuICAgICAgICAgICAgbGV0IHVpZHM6IGFueSA9IFsgXTtcbiAgICAgICAgICAgIHNob3BwaW5nTWV0YSQuZGF0YS5tYXAoIHNsID0+IHtcbiAgICAgICAgICAgICAgICB1aWRzID0gWyAuLi51aWRzLCAuLi5zbC51aWRzIF07XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgLyoqIOWkhOeQhuS8mOWMllxuICAgICAgICAgICAgICog6K6p6LSt5Lmw6YeP5pu05aSa55qE55So5oi377yM5bGV56S65Zyo5YmN6Z2iXG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIGxldCB1aWRNYXBUaW1lczoge1xuICAgICAgICAgICAgICAgIFsga2V5OiBzdHJpbmcgXSA6IG51bWJlclxuICAgICAgICAgICAgfSA9IHsgfTtcbiAgICAgICAgICAgIHVpZHMubWFwKCB1aWRzdHJpbmcgPT4ge1xuICAgICAgICAgICAgICAgIGlmICggIXVpZE1hcFRpbWVzWyB1aWRzdHJpbmcgXSkge1xuICAgICAgICAgICAgICAgICAgICB1aWRNYXBUaW1lcyA9IE9iamVjdC5hc3NpZ24oeyB9LCB1aWRNYXBUaW1lcywge1xuICAgICAgICAgICAgICAgICAgICAgICAgWyB1aWRzdHJpbmcgXTogMVxuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHVpZE1hcFRpbWVzID0gT2JqZWN0LmFzc2lnbih7IH0sIHVpZE1hcFRpbWVzLCB7XG4gICAgICAgICAgICAgICAgICAgICAgICBbIHVpZHN0cmluZyBdOiB1aWRNYXBUaW1lc1sgdWlkc3RyaW5nIF0gKyAxXG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIC8qKiDliY015ZCN55qE55So5oi3aWQgKi9cbiAgICAgICAgICAgIGNvbnN0IHVzZXJJZHMgPSBPYmplY3QuZW50cmllcyggdWlkTWFwVGltZXMgKVxuICAgICAgICAgICAgICAgIC5zb3J0KCggeCwgeSApID0+IFxuICAgICAgICAgICAgICAgICAgICB5WyAxIF0gLSB4WyAxIF1cbiAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgICAgLnNsaWNlKCAwLCBsaW1pdCApXG4gICAgICAgICAgICAgICAgLm1hcCggeCA9PiB4WyAwIF0pO1xuXG4gICAgICAgICAgICAvKiog5q+P5Liq55So5oi355qE5L+h5oGvICovXG4gICAgICAgICAgICBjb25zdCB1c2VycyQgPSBhd2FpdCBQcm9taXNlLmFsbCggdXNlcklkcy5tYXAoIHVpZCA9PiBQcm9taXNlLmFsbChbXG4gICAgICAgICAgICAgICAgZGIuY29sbGVjdGlvbigndXNlcicpXG4gICAgICAgICAgICAgICAgICAgIC53aGVyZSh7XG4gICAgICAgICAgICAgICAgICAgICAgICBvcGVuaWQ6IHVpZFxuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAuZ2V0KCApXG4gICAgICAgICAgICBdKSkpO1xuXG4gICAgICAgICAgICAvKiog5YmNNeS6uueahOWNoeWIuCAqL1xuICAgICAgICAgICAgY29uc3QgY291cG9ucyQ6IGFueSA9IGF3YWl0IFByb21pc2UuYWxsKFxuICAgICAgICAgICAgICAgIHVzZXJJZHMubWFwKCB1aWQgPT4gXG4gICAgICAgICAgICAgICAgICAgIGRiLmNvbGxlY3Rpb24oJ2NvdXBvbicpXG4gICAgICAgICAgICAgICAgICAgICAgICAud2hlcmUoXy5vcihbXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aWQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9wZW5pZDogdWlkXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvcGVuaWQ6IHVpZCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FuVXNlSW5OZXh0OiB0cnVlXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgXSkpXG4gICAgICAgICAgICAgICAgICAgICAgICAuZmllbGQoe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb3BlbmlkOiB0cnVlXG4gICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAgICAgLmdldCggKVxuICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgIClcblxuICAgICAgICAgICAgLyoqIOWJjTXkuKrkurrmgLvnmoTotK3nianmuIXljZUgKi9cbiAgICAgICAgICAgIGNvbnN0IHNob3BwaW5nTWV0YUZpbHRlciA9IHNob3BwaW5nTWV0YSQuZGF0YS5maWx0ZXIoIHMgPT4gXG4gICAgICAgICAgICAgICAgISF1c2VySWRzLmZpbmQoIHVpZCA9PiBcbiAgICAgICAgICAgICAgICAgICAgcy51aWRzLmZpbmQoIFxuICAgICAgICAgICAgICAgICAgICAgICAgdSA9PiB1ID09PSB1aWRcbiAgICAgICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgKSk7XG5cbiAgICAgICAgICAgIC8qKiDllYblk4FpZCAqL1xuICAgICAgICAgICAgY29uc3QgcElkcyA9IEFycmF5LmZyb20oXG4gICAgICAgICAgICAgICAgbmV3IFNldCggXG4gICAgICAgICAgICAgICAgICAgIHNob3BwaW5nTWV0YUZpbHRlclxuICAgICAgICAgICAgICAgICAgICAgICAgLm1hcCggcyA9PiBzLnBpZCApXG4gICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgKTtcblxuICAgICAgICAgICAgLyoqIOWVhuWTgeivpuaDhSAqLyAgICAgICAgICAgIFxuICAgICAgICAgICAgY29uc3QgZGV0YWlscyQgPSBhd2FpdCBQcm9taXNlLmFsbCggcElkcy5tYXAoIHBpZCA9PiB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGRiLmNvbGxlY3Rpb24oJ2dvb2RzJylcbiAgICAgICAgICAgICAgICAgICAgLmRvYyggcGlkIClcbiAgICAgICAgICAgICAgICAgICAgLmZpZWxkKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIF9pZDogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHRhZzogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGltZzogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHRpdGxlOiB0cnVlXG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgIC5nZXQoIClcbiAgICAgICAgICAgIH0pKTtcblxuICAgICAgICAgICAgLyoqIOi0reeJqea4heWNleazqOWFpeWVhuWTgeivpuaDhSAqL1xuICAgICAgICAgICAgY29uc3Qgc2hvcHBpbmdJbmplY3QgPSBzaG9wcGluZ01ldGFGaWx0ZXIubWFwKCBzbCA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3QgZGV0YWlsID0gZGV0YWlscyQuZmluZCggeCA9PiB4LmRhdGEuX2lkID09PSBzbC5waWQgKTtcbiAgICAgICAgICAgICAgICBpZiAoIGRldGFpbCApIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIE9iamVjdC5hc3NpZ24oeyB9LCBzbCwge1xuICAgICAgICAgICAgICAgICAgICAgICAgZGV0YWlsOiBkZXRhaWwuZGF0YVxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gT2JqZWN0LmFzc2lnbih7IH0sIHNsICk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIC8qKiDov5Tlm57nu5PmnpwgKi9cbiAgICAgICAgICAgIGNvbnN0IG1ldGFEYXRhID0gdXNlcnMkLm1hcCgoIHgsIGsgKSA9PiB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICAgICAgdXNlcjogeFsgMCBdLmRhdGFbIDAgXSxcbiAgICAgICAgICAgICAgICAgICAgY291cG9uczogY291cG9ucyRbIGsgXS5kYXRhLCBcbiAgICAgICAgICAgICAgICAgICAgc2hvcHBpbmdsaXN0OiBzaG9wcGluZ0luamVjdC5maWx0ZXIoIHNsID0+IHNsLnVpZHMuZmluZCggdWlkID0+IHVpZCA9PT0geFsgMCBdLmRhdGFbIDAgXS5vcGVuaWQgKSlcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgcmV0dXJuIGN0eC5ib2R5ID0ge1xuICAgICAgICAgICAgICAgIHN0YXR1czogMjAwLFxuICAgICAgICAgICAgICAgIGRhdGE6IG1ldGFEYXRhXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfSBjYXRjaCAoIGUgKSB7XG4gICAgICAgICAgICByZXR1cm4gY3R4LmJvZHkgPSB7IHN0YXR1czogNTAwIH07XG4gICAgICAgIH1cbiAgICB9KVxuXG4gICAgLyoqXG4gICAgICogQGRlc2NyaXB0aW9uXG4gICAgICog5Liq5Lq655qE562J5b6F5ou85Zui5Lu75Yqh5YiX6KGoXG4gICAgICoge1xuICAgICAqICAgIG9wZW5pZO+8n1xuICAgICAqIH1cbiAgICAgKi9cbiAgICBhcHAucm91dGVyKCdwaW4tdGFzaycsIGFzeW5jKCBjdHgsIG5leHQgKSA9PiB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBjb25zdCBvcGVuaWQgPSBldmVudC5kYXRhLm9wZW5JZCB8fCBldmVudC5kYXRhLm9wZW5pZCB8fCBldmVudC51c2VySW5mby5vcGVuSWQ7XG5cbiAgICAgICAgICAgIC8vIOWFiOaJvuWIsOW9k+WJjeeahOihjOeoi1xuICAgICAgICAgICAgY29uc3QgdHJpcHMkID0gYXdhaXQgY2xvdWQuY2FsbEZ1bmN0aW9uKHtcbiAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICAgICR1cmw6ICdlbnRlcidcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIG5hbWU6ICd0cmlwJ1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBjb25zdCB0cmlwcyA9IHRyaXBzJC5yZXN1bHQuZGF0YTtcbiAgICAgICAgICAgIGNvbnN0IHRyaXAgPSB0cmlwc1sgMCBdO1xuXG4gICAgICAgICAgICBpZiAoICF0cmlwICkge1xuICAgICAgICAgICAgICAgIHJldHVybiBjdHguYm9keSA9IHtcbiAgICAgICAgICAgICAgICAgICAgZGF0YTogWyBdLFxuICAgICAgICAgICAgICAgICAgICBzdGF0dXM6IDIwMFxuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIOiOt+WPluW9k+WJjeihjOeoi+eahOaLvOWbouWIl+ihqFxuICAgICAgICAgICAgY29uc3Qgc2hvcHBpbmckID0gYXdhaXQgZGIuY29sbGVjdGlvbignc2hvcHBpbmctbGlzdCcpXG4gICAgICAgICAgICAgICAgLndoZXJlKHtcbiAgICAgICAgICAgICAgICAgICAgdGlkOiB0cmlwLl9pZCxcbiAgICAgICAgICAgICAgICAgICAgdWlkczogb3BlbmlkXG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAuZ2V0KCApO1xuXG4gICAgICAgICAgICAvLyDmn6Xor6LmuIXljZXlupXkuIvnmoTkuKrkurrorqLljZVcbiAgICAgICAgICAgIGNvbnN0IGFsbCQgPSBhd2FpdCBQcm9taXNlLmFsbChcbiAgICAgICAgICAgICAgICBzaG9wcGluZyQuZGF0YS5tYXAoIGFzeW5jIHNob3BwaW5nID0+IHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgeyBwaWQsIHNpZCwgdGlkIH0gPSBzaG9wcGluZztcblxuICAgICAgICAgICAgICAgICAgICAvLyDojrflj5borqLljZVcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgYWxsT3JkZXJzJCA9IGF3YWl0IGRiLmNvbGxlY3Rpb24oJ29yZGVyJylcbiAgICAgICAgICAgICAgICAgICAgICAgIC53aGVyZSh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcGlkLCBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzaWQsIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRpZCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvcGVuaWQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcGF5X3N0YXR1czogXy5vciggXy5lcSgnMScpLCBfLmVxKCcyJykpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJhc2Vfc3RhdHVzOiBfLm9yKCBfLmVxKCcwJyksIF8uZXEoJzEnKSwgXy5lcSgnMicpKVxuICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgICAgIC5nZXQoICk7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGNvdW50ID0gYWxsT3JkZXJzJC5kYXRhLnJlZHVjZSgoIHgsIHkgKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4geCArIHkuY291bnQ7XG4gICAgICAgICAgICAgICAgICAgIH0sIDAgKTtcblxuICAgICAgICAgICAgICAgICAgICAvLyDmmK/lkKbmnInmi7zlm6LmiJDlip9cbiAgICAgICAgICAgICAgICAgICAgY29uc3QgZ3JvdXBNZW5PcmRlcnMkID0gYXdhaXQgZGIuY29sbGVjdGlvbignb3JkZXInKVxuICAgICAgICAgICAgICAgICAgICAgICAgLndoZXJlKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwaWQsIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNpZCwgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGlkLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9wZW5pZDogXy5uZXEoIG9wZW5pZCApLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBheV9zdGF0dXM6IF8ub3IoIF8uZXEoJzEnKSwgXy5lcSgnMicpKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBiYXNlX3N0YXR1czogXy5vciggXy5lcSgnMCcpLCBfLmVxKCcxJyksIF8uZXEoJzInKSlcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgICAgICAuY291bnQoICk7XG5cbiAgICAgICAgICAgICAgICAgICAgLy8g6I635Y+W5ZWG5ZOB6K+m5oOFXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGdvb2QkID0gYXdhaXQgZGIuY29sbGVjdGlvbignZ29vZHMnKVxuICAgICAgICAgICAgICAgICAgICAgICAgLmRvYyggU3RyaW5nKCBwaWQgKSlcbiAgICAgICAgICAgICAgICAgICAgICAgIC5maWVsZCh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGl0bGU6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaW1nOiB0cnVlXG4gICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAgICAgLmdldCggKTtcblxuICAgICAgICAgICAgICAgICAgICAvLyDojrflj5blnovlj7for6bmg4VcbiAgICAgICAgICAgICAgICAgICAgbGV0IHN0YW5kYXJkOiBhbnkgPSB1bmRlZmluZWQ7XG4gICAgICAgICAgICAgICAgICAgIGlmICggISFzaWQgKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBzdGFuZGFyZCQgPSBhd2FpdCBkYi5jb2xsZWN0aW9uKCdzdGFuZGFyZHMnKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5kb2MoIFN0cmluZyggc2lkICkpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLmZpZWxkKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaW1nOiB0cnVlXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAuZ2V0KCApO1xuICAgICAgICAgICAgICAgICAgICAgICAgc3RhbmRhcmQgPSBzdGFuZGFyZCQuZGF0YTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb3VudCxcbiAgICAgICAgICAgICAgICAgICAgICAgIC4uLnNob3BwaW5nLFxuICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogJ3Nob3BwaW5nbGlzdCcsXG4gICAgICAgICAgICAgICAgICAgICAgICBpc1BpbjogZ3JvdXBNZW5PcmRlcnMkLnRvdGFsID4gMCxcbiAgICAgICAgICAgICAgICAgICAgICAgIGRldGFpbDoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC4uLmdvb2QkLmRhdGEsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaW1nOiBzdGFuZGFyZCA/IHN0YW5kYXJkLmltZyA6IGdvb2QkLmRhdGEuaW1nWyAwIF0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogc3RhbmRhcmQgPyBzdGFuZGFyZC5uYW1lIDogJydcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICApO1xuXG4gICAgICAgICAgICAvLyDmn6Xor6LkvJjmg6DliLjpoobnlKjmg4XlhrVcbiAgICAgICAgICAgIC8vIOihjOeoi+eri+WHj+mHkeminS/ooYznqIvmu6Hlh4/ph5Hpop0v6KGM56iL5Luj6YeR5Yi46YeR6aKdXG4gICAgICAgICAgICBjb25zdCB7IHJlZHVjZV9wcmljZSB9ID0gdHJpcDtcblxuICAgICAgICAgICAgLy8g6KGM56iL56uL5YeP5Luj6YeR5Yi4XG4gICAgICAgICAgICBjb25zdCBsaWppYW4kID0gYXdhaXQgZGIuY29sbGVjdGlvbignY291cG9uJylcbiAgICAgICAgICAgICAgICAud2hlcmUoe1xuICAgICAgICAgICAgICAgICAgICBvcGVuaWQsXG4gICAgICAgICAgICAgICAgICAgIHRpZDogdHJpcC5faWQsXG4gICAgICAgICAgICAgICAgICAgIHR5cGU6ICd0X2xpamlhbidcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIC5nZXQoICk7XG4gICAgICAgICAgICBjb25zdCBsaWppYW4gPSBsaWppYW4kLmRhdGFbIDAgXTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgY29uc3QgdF90b3RhbCA9IHJlZHVjZV9wcmljZTtcbiAgICAgICAgICAgIGNvbnN0IHRfY3VycmVudCA9ICEhbGlqaWFuID9cbiAgICAgICAgICAgICAgICBsaWppYW4udmFsdWUgOiAwO1xuICAgICAgICAgICAgY29uc3QgdF9kZWx0YSA9IE51bWJlcigoIHJlZHVjZV9wcmljZSAtIHRfY3VycmVudCApLnRvRml4ZWQoIDIgKSk7XG5cbiAgICAgICAgICAgIHJldHVybiBjdHguYm9keSA9IHtcbiAgICAgICAgICAgICAgICBzdGF0dXM6IDIwMCxcbiAgICAgICAgICAgICAgICBkYXRhOiBbXG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6ICd0X2xpamlhbicsXG4gICAgICAgICAgICAgICAgICAgICAgICB0X3RvdGFsLFxuICAgICAgICAgICAgICAgICAgICAgICAgdF9jdXJyZW50LFxuICAgICAgICAgICAgICAgICAgICAgICAgdF9kZWx0YVxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAuLi5hbGwkXG4gICAgICAgICAgICAgICAgXVxuICAgICAgICAgICAgfTtcblxuICAgICAgICB9IGNhdGNoICggZSApIHtcbiAgICAgICAgICAgIHJldHVybiBjdHguYm9keSA9IHtcbiAgICAgICAgICAgICAgICBzdGF0dXM6IDUwMFxuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgIH0pXG5cbiAgICByZXR1cm4gYXBwLnNlcnZlKCApO1xuXG59Il19