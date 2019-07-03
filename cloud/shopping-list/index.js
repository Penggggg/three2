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
        app.router('findCannotBuy', function (ctx, next) { return __awaiter(_this, void 0, void 0, function () {
            var _a, tid_1, list, openId_1, getErr, trip$, goodDetails$, belongGoodIds, belongGoods$, goods_1, standards_1, belongGoods_1, hasLimitGood_1, lowStock_1, hasBeenDelete_1, cannotBuy, hasBeenBuy, limitGoods, orders, reqData, createOrder$, e_1;
            var _this = this;
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
                        return [4, Promise.all(limitGoods.map(function (good) { return __awaiter(_this, void 0, void 0, function () {
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
        app.router('create', function (ctx, next) { return __awaiter(_this, void 0, void 0, function () {
            var others_1, buyer_1, buyerBuyPinDelta_1, buyerWaitPinDelta_1, _a, list, openId_2, e_2;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        others_1 = [];
                        buyer_1 = null;
                        buyerBuyPinDelta_1 = 0;
                        buyerWaitPinDelta_1 = 0;
                        _a = event.data, list = _a.list, openId_2 = _a.openId;
                        return [4, Promise.all(list.map(function (orderMeta) { return __awaiter(_this, void 0, void 0, function () {
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
                                                if (lastUids.length > 0 && !lastUids.find(function (x) { return x === openId_2; })) {
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
            var bjpConfig, openid, _a, tid, detail, pid, type_1, limit, showUser, query, shopping$, bjpConfig$, data, data$, goodIds, standarsIds, allGoods$_1, allStandars$_1, good$_1, uids_1, users$_1, meta, e_6;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 10, , 11]);
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
                        return [4, Promise.all(standarsIds.map(function (sid) {
                                return db.collection('standards')
                                    .doc(String(sid))
                                    .get();
                            }))];
                    case 7:
                        allStandars$_1 = _b.sent();
                        allStandars$_1 = allStandars$_1.map(function (x) { return x.data; });
                        if (detail === undefined || !!detail) {
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
                        }
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
                    case 9:
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
                    case 10:
                        e_6 = _b.sent();
                        return [2, ctx.body = { status: 500 }];
                    case 11: return [2];
                }
            });
        }); });
        app.router('fairy-shoppinglist', function (ctx, next) { return __awaiter(_this, void 0, void 0, function () {
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
        return [2, app.serve()];
    });
}); };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSxpQkF5bUNDOztBQXptQ0QscUNBQXVDO0FBQ3ZDLHNDQUF3QztBQUd4QyxLQUFLLENBQUMsSUFBSSxDQUFDO0lBQ1AsR0FBRyxFQUFFLE9BQU8sQ0FBQyxHQUFHLENBQUMsS0FBSztDQUN6QixDQUFDLENBQUM7QUFFSCxJQUFNLEVBQUUsR0FBZ0IsS0FBSyxDQUFDLFFBQVEsRUFBRyxDQUFDO0FBQzFDLElBQU0sQ0FBQyxHQUFHLEVBQUUsQ0FBQyxPQUFPLENBQUM7QUFRckIsSUFBTSxNQUFNLEdBQUcsVUFBRSxFQUFVO0lBQVYsbUJBQUEsRUFBQSxVQUFVO0lBQ3ZCLElBQUssRUFBRSxFQUFHO1FBQ04sT0FBTyxJQUFJLENBQUMsR0FBRyxFQUFHLENBQUM7S0FDdEI7SUFDRCxJQUFNLE1BQU0sR0FBRyxJQUFJLElBQUksQ0FBRSxJQUFJLElBQUksRUFBRyxDQUFDLGNBQWMsRUFBRyxDQUFDLENBQUM7SUFDeEQsT0FBTyxJQUFJLElBQUksQ0FBRSxNQUFNLENBQUMsT0FBTyxFQUFHLEdBQUcsQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsSUFBSSxDQUFFLENBQUE7QUFDN0QsQ0FBQyxDQUFBO0FBb0JZLFFBQUEsSUFBSSxHQUFHLFVBQVEsS0FBSyxFQUFFLE9BQU87Ozs7UUFFaEMsR0FBRyxHQUFHLElBQUksU0FBUyxDQUFDLEVBQUUsS0FBSyxPQUFBLEVBQUUsQ0FBQyxDQUFDO1FBK0RyQyxHQUFHLENBQUMsTUFBTSxDQUFDLGVBQWUsRUFBRSxVQUFPLEdBQUcsRUFBRSxJQUFJOzs7Ozs7O3dCQUc5QixLQUFnQixLQUFLLENBQUMsSUFBSSxFQUF4QixjQUFHLEVBQUUsSUFBSSxVQUFBLENBQWdCO3dCQUMzQixXQUFTLEtBQUssQ0FBQyxJQUFJLENBQUMs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LE1BQU0sQ0FBQyxNQUFNLENBQUMsRUFBRyxFQUFFLEVBQUUsQ0FBRSxDQUFDOzZCQUNsQzt3QkFDTCxDQUFDLENBQUMsQ0FBQzt3QkFHRyxRQUFRLEdBQUcsTUFBTSxDQUFDLEdBQUcsQ0FBQyxVQUFFLENBQUMsRUFBRSxDQUFDOzRCQUM5QixPQUFPO2dDQUNILElBQUksRUFBRSxDQUFDLENBQUUsQ0FBQyxDQUFFLENBQUMsSUFBSSxDQUFFLENBQUMsQ0FBRTtnQ0FDdEIsT0FBTyxFQUFFLFVBQVEsQ0FBRSxDQUFDLENBQUUsQ0FBQyxJQUFJO2dDQUMzQixZQUFZLEVBQUUsZ0JBQWMsQ0FBQyxNQUFNLENBQUUsVUFBQSxFQUFFLElBQUksT0FBQSxFQUFFLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBRSxVQUFBLEdBQUcsSUFBSSxPQUFBLEdBQUcsS0FBSyxDQUFDLENBQUUsQ0FBQyxDQUFFLENBQUMsSUFBSSxDQUFFLENBQUMsQ0FBRSxDQUFDLE1BQU0sRUFBL0IsQ0FBK0IsQ0FBRSxFQUF0RCxDQUFzRCxDQUFDOzZCQUNyRyxDQUFBO3dCQUNMLENBQUMsQ0FBQyxDQUFDO3dCQUVILFdBQU8sR0FBRyxDQUFDLElBQUksR0FBRztnQ0FDZCxNQUFNLEVBQUUsR0FBRztnQ0FDWCxJQUFJLEVBQUUsUUFBUTs2QkFDakIsRUFBQTs7O3dCQUdELFdBQU8sR0FBRyxDQUFDLElBQUksR0FBRyxFQUFFLE1BQU0sRUFBRSxHQUFHLEVBQUUsRUFBQzs7OzthQUV6QyxDQUFDLENBQUE7UUFFRixXQUFPLEdBQUcsQ0FBQyxLQUFLLEVBQUcsRUFBQzs7S0FFdkIsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIGNsb3VkIGZyb20gJ3d4LXNlcnZlci1zZGsnO1xuaW1wb3J0ICogYXMgVGNiUm91dGVyIGZyb20gJ3RjYi1yb3V0ZXInO1xuaW1wb3J0IHsgZmluZCQgfSBmcm9tICcuL2ZpbmQnO1xuXG5jbG91ZC5pbml0KHtcbiAgICBlbnY6IHByb2Nlc3MuZW52LmNsb3VkXG59KTtcblxuY29uc3QgZGI6IERCLkRhdGFiYXNlID0gY2xvdWQuZGF0YWJhc2UoICk7XG5jb25zdCBfID0gZGIuY29tbWFuZDtcblxuLyoqIFxuICog6L2s5o2i5qC85p6X5bC85rK75pe25Yy6ICs45pe25Yy6XG4gKiBEYXRlKCkubm93KCkgLyBuZXcgRGF0ZSgpLmdldFRpbWUoKSDmmK/ml7bkuI3ml7bmraPluLjnmoQrOFxuICogRGF0ZS50b0xvY2FsU3RyaW5nKCApIOWlveWDj+aYr+S4gOebtOaYrysw55qEXG4gKiDlhYjmi7/liLAgKzDvvIznhLblkI4rOFxuICovXG5jb25zdCBnZXROb3cgPSAoIHRzID0gZmFsc2UgKTogYW55ID0+IHtcbiAgICBpZiAoIHRzICkge1xuICAgICAgICByZXR1cm4gRGF0ZS5ub3coICk7XG4gICAgfVxuICAgIGNvbnN0IHRpbWVfMCA9IG5ldyBEYXRlKCBuZXcgRGF0ZSggKS50b0xvY2FsZVN0cmluZyggKSk7XG4gICAgcmV0dXJuIG5ldyBEYXRlKCB0aW1lXzAuZ2V0VGltZSggKSArIDggKiA2MCAqIDYwICogMTAwMCApXG59XG5cbi8qKlxuICogQGRlc2NyaXB0aW9uIOihjOeoi+a4heWNleaooeWdl1xuICogLS0tLS0tLS0tIOWtl+autSAtLS0tLS0tLS0tXG4gKiB0aWRcbiAqIHBpZFxuICogc2lkICgg5Y+v5Li656m6IClcbiAqIG9pZHMgQXJyYXlcbiAqIHVpZHMgQXJyYXlcbiAqIGJ1eV9zdGF0dXMgMCwxLDIg5pyq6LSt5Lmw44CB5bey6LSt5Lmw44CB5Lmw5LiN5YWoXG4gKiBiYXNlX3N0YXR1czogMCwxIOacquiwg+aVtO+8jOW3suiwg+aVtFxuICogY3JlYXRlVGltZVxuICogdXBkYXRlVGltZVxuICogISBhY2lkIOa0u+WKqGlkXG4gKiBsYXN0QWxsb2NhdGVkIOWJqeS9meWIhumFjemHj1xuICogcHVyY2hhc2Ug6YeH6LSt5pWw6YePXG4gKiBhZGp1c3RQcmljZSDliIbphY3nmoTmlbDmuIXljZXllK7ku7dcbiAqIGFkanVzdEdyb3VwUHJpY2Ug5YiG6YWN55qE5pWw5riF5Y2V5Zui6LSt5Lu3XG4gKi9cbmV4cG9ydCBjb25zdCBtYWluID0gYXN5bmMgKCBldmVudCwgY29udGV4dCApID0+IHtcblxuICAgIGNvbnN0IGFwcCA9IG5ldyBUY2JSb3V0ZXIoeyBldmVudCB9KTtcblxuICAgIC8qKlxuICAgICAqIEBkZXNjcmlwdGlvblxuICAgICAqIOWIpOaWreivt+axgueahHNpZCArIHRpZCArIHBpZCArIGNvdW505pWw57uE77yM6L+U5Zue5LiN6IO96LSt5Lmw55qE5ZWG5ZOB5YiX6KGo77yI5riF5Y2V6YeM6Z2i5Lmw5LiN5Yiw44CB5Lmw5LiN5YWo77yJ44CB6LSn5YWo5LiN6Laz55qE5ZWG5ZOB77yI6L+U5Zue5pyA5paw6LSn5a2Y77yJXG4gICAgICogLS0tLS0tLS0g6K+35rGCIC0tLS0tLS0tLS1cbiAgICAgKiB7XG4gICAgICohICAgIGZyb20/OiAnY2FydCcgfCAnYnV5JyB8ICdjdXN0b20nIHwgJ2FnZW50cycgfCAnc3lzdGVtJ1xuICAgICAqICAgICB0aWQ6IHN0cmluZ1xuICAgICAqISAgICBvcGVuaWQ/OiBzdHJpbmcsXG4gICAgICogICAgbGlzdDogeyBcbiAgICAgKiAgICAgIHRpZFxuICAgICAqISAgICAgY2lkPzogc3RyaW5nXG4gICAgICAgICAgICBzaWRcbiAgICAgICAgICAgIHBpZFxuICAgICAgICAgICAgcHJpY2VcbiAgICAgICAgICAgIGdyb3VwUHJpY2VcbiAgICAgICAgICAgIGNvdW50XG4gICAgICohICAgICBkZXNjPzogc3RyaW5nXG4gICAgICAgICAgICBuYW1lLFxuICAgICAgICAgICAgc3RhbmRlcm5hbWVcbiAgICAgICAgICAgIGltZ1xuICAgICAgICAgICAgdHlwZVxuICAgICAgICAgICAgYWRkcmVzczoge1xuICAgICAgICAgICAgICAgbmFtZSxcbiAgICAgICAgICAgICAgIHBob25lLFxuICAgICAgICAgICAgICAgZGV0YWlsLFxuICAgICAgICAgICAgICAgcG9zdGFsY29kZVxuICAgICAgICAgICAgfVxuICAgICAqICAgICB9WyBdXG4gICAgICogfVxuICAgICAqIC0tLS0tLS0tIOi/lOWbniAtLS0tLS0tLS0tXG4gICAgICoge1xuICAgICAqICAgICAgKiDlt7LotK3kubAoIOmjjumZqeWNlSApXG4gICAgICogICAgICBoYXNCZWVuQnV5OiB7XG4gICAgICogICAgICAgICAgdGlkLCBcbiAgICAgKiAgICAgICAgICBwaWQsXG4gICAgICogICAgICAgICAgc2lkXG4gICAgICogICAgICB9WyBdXG4gICAgICogICAgICAqIOS5sOS4jeWIsFxuICAgICAqICAgICAgY2Fubm90QnV5OiB7IFxuICAgICAqICAgICAgICAgIHRpZCwgXG4gICAgICogICAgICAgICAgcGlkLFxuICAgICAqICAgICAgICAgIHNpZFxuICAgICAqICAgICAgfVsgXVxuICAgICAqICAgICAgKiDotKflrZjkuI3otrNcbiAgICAgKiAgICAgICBsb3dTdG9jazogeyBcbiAgICAgKiAgICAgICAgICB0aWQsIFxuICAgICAqICAgICAgICAgIHBpZCxcbiAgICAgKiAgICAgICAgICBzaWQsXG4gICAgICogICAgICAgICAgY291bnQsXG4gICAgICogICAgICAgICAgc3RvY2tcbiAgICAgKiAgICAgIH1bIF1cbiAgICAgKiAgICAgICog5Z6L5Y+35bey6KKr5Yig6ZmkIC8g5ZWG5ZOB5bey5LiL5p62XG4gICAgICogICAgICBoYXNCZWVuRGVsZXRlOiB7XG4gICAgICogICAgICAgICAgdGlkLCBcbiAgICAgKiAgICAgICAgICBwaWQsXG4gICAgICogICAgICAgICAgc2lkXG4gICAgICogICAgICB9WyBdLFxuICAgICAqICAgICAgKiDorqLljZXlj7fliJfooahcbiAgICAgKiAgICAgIG9yZGVyc1xuICAgICAqIH1cbiAgICAgKi9cbiAgICBhcHAucm91dGVyKCdmaW5kQ2Fubm90QnV5JywgYXN5bmMoIGN0eCwgbmV4dCApID0+IHtcbiAgICAgICAgdHJ5IHtcblxuICAgICAgICAgICAgY29uc3QgeyB0aWQsIGxpc3QgfSA9IGV2ZW50LmRhdGE7XG4gICAgICAgICAgICBjb25zdCBvcGVuSWQgPSBldmVudC5kYXRhLm9wZW5JZCB8fCBldmVudC51c2VySW5mby5vcGVuSWQ7XG5cbiAgICAgICAgICAgIGNvbnN0IGdldEVyciA9IG1lc3NhZ2UgPT4gKHtcbiAgICAgICAgICAgICAgICBtZXNzYWdlLCBcbiAgICAgICAgICAgICAgICBzdGF0dXM6IDUwMFxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIGlmICggIXRpZCApIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gY3R4LmJvZHkgPSBnZXRFcnIoJ+aXoOaViOihjOeoiycpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyDmn6Xor6LooYznqIvmmK/lkKbov5jmnInmlYhcbiAgICAgICAgICAgIGNvbnN0IHRyaXAkID0gYXdhaXQgZGIuY29sbGVjdGlvbigndHJpcCcpXG4gICAgICAgICAgICAgICAgLmRvYyggU3RyaW5nKCB0aWQgKSlcbiAgICAgICAgICAgICAgICAuZ2V0KCApO1xuXG4gICAgICAgICAgICBpZiAoIHRyaXAkLmRhdGEuaXNDbG9zZWQgfHwgZ2V0Tm93KCB0cnVlICkgPiB0cmlwJC5kYXRhLmVuZF9kYXRlICkge1xuICAgICAgICAgICAgICAgIHJldHVybiBjdHguYm9keSA9IGdldEVycign5pqC5peg6LSt54mp6KGM56iL772eJyk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIOafpeivouWVhuWTgeivpuaDheOAgeaIluiAheWei+WPt+ivpuaDhVxuICAgICAgICAgICAgY29uc3QgZ29vZERldGFpbHMkOiBhbnkgPSBhd2FpdCBQcm9taXNlLmFsbCggZXZlbnQuZGF0YS5saXN0Lm1hcCggaSA9PiB7XG5cbiAgICAgICAgICAgICAgICBpZiAoICEhaS5zaWQgKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBkYi5jb2xsZWN0aW9uKCdzdGFuZGFyZHMnKVxuICAgICAgICAgICAgICAgICAgICAgICAgLndoZXJlKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBfaWQ6IGkuc2lkXG4gICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAgICAgLmdldCggKVxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBkYi5jb2xsZWN0aW9uKCdnb29kcycpXG4gICAgICAgICAgICAgICAgICAgICAgICAud2hlcmUoe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIF9pZDogaS5waWRcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgICAgICAuZ2V0KCApXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSkpO1xuXG4gICAgICAgICAgICAvKiog5Z6L5Y+35omA5bGe5ZWG5ZOBICovXG4gICAgICAgICAgICBjb25zdCBiZWxvbmdHb29kSWRzID0gQXJyYXkuZnJvbSggXG4gICAgICAgICAgICAgICAgbmV3IFNldChcbiAgICAgICAgICAgICAgICAgICAgZXZlbnQuZGF0YS5saXN0XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyAuZmlsdGVyKCBpID0+ICEhaS5zaWQgKVxuICAgICAgICAgICAgICAgICAgICAgICAgLm1hcCggbyA9PiBvLnBpZCApXG4gICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgKTtcblxuICAgICAgICAgICAgY29uc3QgYmVsb25nR29vZHMkID0gYXdhaXQgUHJvbWlzZS5hbGwoIGJlbG9uZ0dvb2RJZHMubWFwKCBwaWQgPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiBkYi5jb2xsZWN0aW9uKCdnb29kcycpXG4gICAgICAgICAgICAgICAgICAgIC5kb2MoIFN0cmluZyggcGlkICkpXG4gICAgICAgICAgICAgICAgICAgIC5nZXQoICk7XG4gICAgICAgICAgICB9KSk7XG4gICAgICAgICAgIFxuICAgICAgICAgICAgY29uc3QgZ29vZHMgPSBnb29kRGV0YWlscyQubWFwKCB4ID0+IHguZGF0YVsgMCBdKS5maWx0ZXIoIHkgPT4gISF5ICkuZmlsdGVyKCB6ID0+ICF6LnBpZCApO1xuICAgICAgICAgICAgY29uc3Qgc3RhbmRhcmRzID0gZ29vZERldGFpbHMkLm1hcCggeCA9PiB4LmRhdGFbIDAgXSkuZmlsdGVyKCB5ID0+ICEheSApLmZpbHRlciggeiA9PiAhIXoucGlkICk7XG4gICAgICAgICAgICBjb25zdCBiZWxvbmdHb29kcyA9IGJlbG9uZ0dvb2RzJC5tYXAoIHggPT4geC5kYXRhICk7XG5cbiAgICAgICAgICAgIC8vIOmZkOi0rVxuICAgICAgICAgICAgbGV0IGhhc0xpbWl0R29vZDogYW55ID0gWyBdO1xuXG4gICAgICAgICAgICAvLyDlupPlrZjkuI3otrNcbiAgICAgICAgICAgIGxldCBsb3dTdG9jazogYW55ID0gWyBdO1xuXG4gICAgICAgICAgICAvLyDooqvliKDpmaRcbiAgICAgICAgICAgIGxldCBoYXNCZWVuRGVsZXRlOiBhbnkgPSBbIF07XG5cbiAgICAgICAgICAgIC8vIOS5sOS4jeWIsFxuICAgICAgICAgICAgY29uc3QgY2Fubm90QnV5ID0gWyBdO1xuXG4gICAgICAgICAgICAvLyDlt7Lnu4/ooqvotK3kubDkuobvvIjpo47pmanljZXvvIlcbiAgICAgICAgICAgIGNvbnN0IGhhc0JlZW5CdXkgPSBbIF07XG5cbiAgICAgICAgICAgIGV2ZW50LmRhdGEubGlzdC5tYXAoIGkgPT4ge1xuICAgICAgICAgICAgICAgIC8vIOWei+WPtyAtIOiuoeeul+W3suiiq+WIoOmZpOOAgeW6k+WtmOS4jei2s+OAgeS4u+S9k+acrOi6q+iiq+S4i+aeti/liKDpmaRcbiAgICAgICAgICAgICAgICBpZiAoICEhaS5zaWQgKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGJlbG9uZ0dvb2QgPSBiZWxvbmdHb29kcy5maW5kKCB4ID0+IHguX2lkID09PSBpLnBpZCApO1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBzdGFuZGFyZCA9IHN0YW5kYXJkcy5maW5kKCB4ID0+IHguX2lkID09PSBpLnNpZCAmJiB4LnBpZCA9PT0gaS5waWQgKTtcblxuICAgICAgICAgICAgICAgICAgICAvLyDlnovlj7fmnKzouqvooqvliKDpmaTjgIHkuLvkvZPmnKzouqvooqvkuIvmnrYv5Yig6ZmkXG4gICAgICAgICAgICAgICAgICAgIGlmICggIXN0YW5kYXJkIHx8ICggISFzdGFuZGFyZCAmJiBzdGFuZGFyZC5pc0RlbGV0ZSApIHx8ICggISFiZWxvbmdHb29kICYmICFiZWxvbmdHb29kLnZpc2lhYmxlICkgfHwgKCAhIWJlbG9uZ0dvb2QgJiYgYmVsb25nR29vZC5pc0RlbGV0ZSApKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBoYXNCZWVuRGVsZXRlLnB1c2goIGkgKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmICggc3RhbmRhcmQuc3RvY2sgIT09IHVuZGVmaW5lZCAmJiBzdGFuZGFyZC5zdG9jayAhPT0gbnVsbCAmJiAgc3RhbmRhcmQuc3RvY2sgPCBpLmNvdW50ICkge1xuICAgICAgICAgICAgICAgICAgICAgICAgbG93U3RvY2sucHVzaCggT2JqZWN0LmFzc2lnbih7IH0sIGksIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdG9jazogc3RhbmRhcmQuc3RvY2ssXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZ29vZE5hbWU6IGkubmFtZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdGFuZGVyTmFtZTogaS5zdGFuZGVybmFtZVxuICAgICAgICAgICAgICAgICAgICAgICAgfSkpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgLy8g5Li75L2T5ZWG5ZOBIC0g6K6h566X5bey6KKr5Yig6Zmk44CB5bqT5a2Y5LiN6LazXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgZ29vZCA9IGdvb2RzLmZpbmQoIHggPT4geC5faWQgPT09IGkucGlkICk7XG4gICAgICAgICAgICAgICAgICAgIGlmICggIWdvb2QgfHwgKCAhIWdvb2QgJiYgIWdvb2QudmlzaWFibGUgKSB8fCAoICEhZ29vZCAmJiBnb29kLmlzRGVsZXRlICkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGhhc0JlZW5EZWxldGUucHVzaCggaSApXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoIGdvb2Quc3RvY2sgIT09IHVuZGVmaW5lZCAmJiBnb29kLnN0b2NrICE9PSBudWxsICYmIGdvb2Quc3RvY2sgPCBpLmNvdW50ICkge1xuICAgICAgICAgICAgICAgICAgICAgICAgbG93U3RvY2sucHVzaCggT2JqZWN0LmFzc2lnbih7IH0sIGksIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdG9jazogZ29vZC5zdG9jayxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBnb29kTmFtZTogaS5uYW1lXG4gICAgICAgICAgICAgICAgICAgICAgICB9KSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcblxuXG4gICAgICAgICAgICAvLyDmn6Xor6LpmZDotK1cbiAgICAgICAgICAgIGNvbnN0IGxpbWl0R29vZHMgPSBiZWxvbmdHb29kcy5maWx0ZXIoIHggPT4gISF4LmxpbWl0ICk7XG5cbiAgICAgICAgICAgIGF3YWl0IFByb21pc2UuYWxsKCBsaW1pdEdvb2RzLm1hcCggYXN5bmMgZ29vZCA9PiB7XG5cbiAgICAgICAgICAgICAgICBjb25zdCBvcmRlcnMgPSBhd2FpdCBkYi5jb2xsZWN0aW9uKCdvcmRlcicpXG4gICAgICAgICAgICAgICAgICAgIC53aGVyZSh7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aWQsXG4gICAgICAgICAgICAgICAgICAgICAgICBwaWQ6IGdvb2QuX2lkLFxuICAgICAgICAgICAgICAgICAgICAgICAgb3BlbmlkOiBvcGVuSWQsXG4gICAgICAgICAgICAgICAgICAgICAgICBwYXlfc3RhdHVzOiBfLm9yKCBfLmVxKCcxJyksIF8uZXEoJzInKSlcbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgLmdldCggKTtcblxuICAgICAgICAgICAgICAgIGNvbnN0IGhhc0JlZW5CdXlDb3VudCA9IG9yZGVycy5kYXRhLnJlZHVjZSgoIHgsIHkgKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB4ICsgeS5jb3VudFxuICAgICAgICAgICAgICAgIH0sIDAgKTtcblxuICAgICAgICAgICAgICAgIGNvbnN0IHRoaXNUcmlwQnV5Q291bnQgPSBldmVudC5kYXRhLmxpc3RcbiAgICAgICAgICAgICAgICAgICAgLmZpbHRlciggeCA9PiB4LnBpZCA9PT0gZ29vZC5faWQgKVxuICAgICAgICAgICAgICAgICAgICAucmVkdWNlKCggeCwgeSApID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB4ICsgeS5jb3VudFxuICAgICAgICAgICAgICAgICAgICB9LCAwICk7XG4gICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIGlmICggdGhpc1RyaXBCdXlDb3VudCArIGhhc0JlZW5CdXlDb3VudCA+IGdvb2QubGltaXQgKSB7XG4gICAgICAgICAgICAgICAgICAgIGhhc0xpbWl0R29vZC5wdXNoKCBnb29kICk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSkpO1xuICAgICAgICAgICAgXG5cbiAgICAgICAgICAgIGxldCBvcmRlcnMgPSBbIF07XG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIOWmguaenOWPr+S7pei0reS5sFxuICAgICAgICAgICAgICogISDmibnph4/liJvlu7rpooTku5jorqLljZVcbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgaWYgKCBoYXNMaW1pdEdvb2QubGVuZ3RoID09PSAwICYmIGxvd1N0b2NrLmxlbmd0aCA9PT0gMCAmJiBjYW5ub3RCdXkubGVuZ3RoID09PSAwICYmIGhhc0JlZW5EZWxldGUubGVuZ3RoID09PSAwICkge1xuXG4gICAgICAgICAgICAgICAgY29uc3QgcmVxRGF0YSA9IHtcbiAgICAgICAgICAgICAgICAgICAgdGlkLFxuICAgICAgICAgICAgICAgICAgICBvcGVuSWQsXG4gICAgICAgICAgICAgICAgICAgIGZyb206IGV2ZW50LmRhdGEuZnJvbSB8fCAnc3lzdGVtJyxcbiAgICAgICAgICAgICAgICAgICAgb3JkZXJzOiBldmVudC5kYXRhLmxpc3RcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBjb25zdCBjcmVhdGVPcmRlciQgPSBhd2FpdCBjbG91ZC5jYWxsRnVuY3Rpb24oe1xuICAgICAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRhOiByZXFEYXRhLFxuICAgICAgICAgICAgICAgICAgICAgICAgJHVybDogJ2NyZWF0ZSdcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgbmFtZTogJ29yZGVyJ1xuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgaWYgKCBjcmVhdGVPcmRlciQucmVzdWx0LnN0YXR1cyAhPT0gMjAwICkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gY3R4LmJvZHkgPSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzdGF0dXM6IDUwMCxcbiAgICAgICAgICAgICAgICAgICAgICAgIG1lc3NhZ2U6ICfliJvlu7rpooTku5jorqLljZXlpLHotKXvvIEnXG4gICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIG9yZGVycyA9IGNyZWF0ZU9yZGVyJC5yZXN1bHQuZGF0YTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIGN0eC5ib2R5ID0ge1xuICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgb3JkZXJzLFxuICAgICAgICAgICAgICAgICAgICBsb3dTdG9jayxcbiAgICAgICAgICAgICAgICAgICAgY2Fubm90QnV5LFxuICAgICAgICAgICAgICAgICAgICBoYXNMaW1pdEdvb2QsXG4gICAgICAgICAgICAgICAgICAgIGhhc0JlZW5CdXksXG4gICAgICAgICAgICAgICAgICAgIGhhc0JlZW5EZWxldGUsXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBzdGF0dXM6IDIwMFxuICAgICAgICAgICAgfVxuXG4gICAgICAgIH0gY2F0Y2ggKCBlICkge1xuICAgICBcbiAgICAgICAgICAgIHJldHVybiBjdHguYm9keSA9IHtcbiAgICAgICAgICAgICAgICBzdGF0dXM6IDUwMCxcbiAgICAgICAgICAgICAgICBtZXNzYWdlOiBlXG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICAvKipcbiAgICAgKiBAZGVzY3JpcHRpb25cbiAgICAgKiDnlLHorqLljZXliJvlu7rotK3nianmuIXljZVcbiAgICAgKiBvcGVuSWRcbiAgICAgKiBsaXN0OiB7XG4gICAgICogICAgdGlkLFxuICAgICAqICAgIHBpZCxcbiAgICAgKiAgICBzaWQsXG4gICAgICogICAgb2lkLFxuICAgICAqICAgIHByaWNlLFxuICAgICAqICAgIGdyb3VwUHJpY2UsXG4gICAgICohICAgYWNpZFxuICAgICAqIH1bIF1cbiAgICAgKiBcbiAgICAgKiDlubbov5Tlm57otK3kubDmjqjpgIHpgJrnn6XnmoTmlbDmja7nu5PmnoRcbiAgICAgKiB7XG4gICAgICogICAgICDlvZPliY3nmoTkubDlrrZcbiAgICAgKiAgICAgIGJ1eWVyOiB7XG4gICAgICogICAgICAgICAgZGVsdGEsXG4gICAgICogICAgICAgICAgb3BlbmlkLFxuICAgICAqICAgICAgICAgIHR5cGU6ICdidXknIHwgJ2J1eVBpbicgfCAnd2FpdFBpbicgKCDmnYPph43otormnaXotorpq5ggKVxuICAgICAqICAgICAgfVxuICAgICAqICAgICAg5ou85Zui5oiQ5Yqf55qE5YW25LuW5Lmw5a62XG4gICAgICogICAgICBvdGhlcnM6IFtcbiAgICAgKiAgICAgICAgICAgIG9wZW5pZFxuICAgICAqICAgICAgICAgICAgYWNpZFxuICAgICAqICAgICAgICAgICAgc2lkXG4gICAgICogICAgICAgICAgICBwaWRcbiAgICAgKiAgICAgICAgICAgIHRpZFxuICAgICAqICAgICAgICAgICAgZGVsdGFcbiAgICAgKiAgICAgIF1cbiAgICAgKiB9XG4gICAgICovXG4gICAgYXBwLnJvdXRlcignY3JlYXRlJywgYXN5bmMoIGN0eCwgbmV4dCApID0+IHtcbiAgICAgICAgdHJ5IHtcblxuICAgICAgICAgICAgbGV0IG90aGVyczogYW55ID0gWyBdO1xuICAgICAgICAgICAgbGV0IGJ1eWVyOiBhbnkgPSBudWxsO1xuICAgICAgICAgICAgbGV0IGJ1eWVyQnV5UGluRGVsdGEgPSAwO1xuICAgICAgICAgICAgbGV0IGJ1eWVyV2FpdFBpbkRlbHRhID0gMDtcblxuICAgICAgICAgICAgY29uc3QgeyBsaXN0LCBvcGVuSWQgfSA9IGV2ZW50LmRhdGE7XG4gXG4gICAgICAgICAgICBhd2FpdCBQcm9taXNlLmFsbCggbGlzdC5tYXAoIGFzeW5jIG9yZGVyTWV0YSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3QgeyB0aWQsIHBpZCwgc2lkLCBvaWQsIHByaWNlLCBncm91cFByaWNlLCBhY2lkIH0gPSBvcmRlck1ldGE7XG4gICAgICAgICAgICAgICAgbGV0IHF1ZXJ5ID0ge1xuICAgICAgICAgICAgICAgICAgICB0aWQsXG4gICAgICAgICAgICAgICAgICAgIHBpZFxuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgaWYgKCAhIXNpZCApIHtcbiAgICAgICAgICAgICAgICAgICAgcXVlcnlbJ3NpZCddID0gc2lkO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIC8vIOaPkuWFpea0u+WKqOeahOafpeivouadoeS7tlxuICAgICAgICAgICAgICAgIGlmICggISFhY2lkICkge1xuICAgICAgICAgICAgICAgICAgICBxdWVyeSA9IE9iamVjdC5hc3NpZ24oeyB9LCBxdWVyeSwge1xuICAgICAgICAgICAgICAgICAgICAgICAgYWNpZFxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBjb25zdCBmaW5kJCA9IGF3YWl0IGRiLmNvbGxlY3Rpb24oJ3Nob3BwaW5nLWxpc3QnKVxuICAgICAgICAgICAgICAgICAgICAud2hlcmUoIHF1ZXJ5IClcbiAgICAgICAgICAgICAgICAgICAgLmdldCggKTtcblxuICAgICAgICAgICAgICAgIC8vIOWIm+W7uumHh+i0reWNlVxuICAgICAgICAgICAgICAgIGlmICggZmluZCQuZGF0YS5sZW5ndGggPT09IDAgKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgLy8g5aSE55CG5o6o6YCB77yaYnV5ZXJcbiAgICAgICAgICAgICAgICAgICAgaWYgKCAhYnV5ZXIgJiYgIWdyb3VwUHJpY2UgKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBidXllciA9IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvcGVuaWQ6IG9wZW5JZCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiAnYnV5JyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZWx0YTogMFxuICAgICAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJ1eWVyV2FpdFBpbkRlbHRhICs9IE51bWJlcigoIHByaWNlIC0gZ3JvdXBQcmljZSApLnRvRml4ZWQoIDAgKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBidXllciA9IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvcGVuaWQ6IG9wZW5JZCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiAnd2FpdFBpbicsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVsdGE6IGJ1eWVyV2FpdFBpbkRlbHRhXG4gICAgICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgY29uc3QgbWV0YSA9IE9iamVjdC5hc3NpZ24oeyB9LCBxdWVyeSwge1xuICAgICAgICAgICAgICAgICAgICAgICAgYWNpZDogYWNpZCB8fCB1bmRlZmluZWRcbiAgICAgICAgICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICAgICAgICAgICAgb2lkczogWyBvaWQgXSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHVpZHM6IFsgb3BlbklkIF0sXG4gICAgICAgICAgICAgICAgICAgICAgICBwdXJjaGFzZTogMCxcbiAgICAgICAgICAgICAgICAgICAgICAgIGJ1eV9zdGF0dXM6ICcwJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGJhc2Vfc3RhdHVzOiAnMCcsXG4gICAgICAgICAgICAgICAgICAgICAgICBhZGp1c3RQcmljZTogcHJpY2UsXG4gICAgICAgICAgICAgICAgICAgICAgICBhZGp1c3RHcm91cFByaWNlOiBncm91cFByaWNlLFxuICAgICAgICAgICAgICAgICAgICAgICAgY3JlYXRlVGltZTogZ2V0Tm93KCB0cnVlIClcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgIFxuICAgICAgICAgICAgICAgICAgICBjb25zdCBjcmVhdGUkID0gYXdhaXQgZGIuY29sbGVjdGlvbignc2hvcHBpbmctbGlzdCcpXG4gICAgICAgICAgICAgICAgICAgICAgICAuYWRkKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhOiBtZXRhXG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG5cbiAgICAgICAgICAgICAgICAvLyDmm7TmlrDmj5LlhaVcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBsZXQgbWV0YVNob3BwaW5nTGlzdCA9IGZpbmQkLmRhdGFbIDAgXTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCAhbWV0YVNob3BwaW5nTGlzdC5vaWRzLmZpbmQoIHggPT4geCA9PT0gb2lkICkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGxhc3RPaWRzID0gbWV0YVNob3BwaW5nTGlzdC5vaWRzO1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgbGFzdFVpZHMgPSBtZXRhU2hvcHBpbmdMaXN0LnVpZHM7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBsYXN0QWRqdXN0UHJpY2UgPSBtZXRhU2hvcHBpbmdMaXN0LmFkanVzdFByaWNlO1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgbGFzdEFkanVzdEdyb3VwUHJpY2UgPSBtZXRhU2hvcHBpbmdMaXN0LmFkanVzdEdyb3VwUHJpY2U7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIOWkhOeQhuaOqOmAge+8mmJ1eWVy44CBb3RoZXJzXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoICEhbGFzdEFkanVzdEdyb3VwUHJpY2UgKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBjdXJyZW50RGVsdGEgPSBOdW1iZXIoKCBsYXN0QWRqdXN0UHJpY2UgLSBsYXN0QWRqdXN0R3JvdXBQcmljZSApLnRvRml4ZWQoIDAgKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBidXllcuaLvOWbouaIkOWKn1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICggbGFzdFVpZHMubGVuZ3RoID4gMCAmJiAgIWxhc3RVaWRzLmZpbmQoIHggPT4geCA9PT0gb3BlbklkICkpIHtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBidXllckJ1eVBpbkRlbHRhICs9IGN1cnJlbnREZWx0YTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCAhYnV5ZXIgfHwgKCAhIWJ1eWVyICYmIGJ1eWVyLnR5cGUgPT09ICdidXknICkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJ1eWVyID0ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9wZW5pZDogb3BlbklkLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6ICdidXlQaW4nLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlbHRhOiBidXllckJ1eVBpbkRlbHRhXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBidXllcuW+heaLvFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJ1eWVyV2FpdFBpbkRlbHRhICs9IGN1cnJlbnREZWx0YTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnV5ZXIgPSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvcGVuaWQ6IG9wZW5JZCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6ICd3YWl0UGluJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlbHRhOiBidXllcldhaXRQaW5EZWx0YVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyDlpITnkIYgb3RoZXJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoICFsYXN0VWlkcy5maW5kKCB4ID0+IHggPT09IG9wZW5JZCApICYmIGxhc3RVaWRzLmxlbmd0aCA9PT0gMSApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb3RoZXJzLnB1c2goe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGlkLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGlkLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2lkOiBzaWQgfHwgdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYWNpZDogYWNpZCB8fCB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvcGVuaWQ6IGxhc3RVaWRzWyAwIF0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZWx0YTogY3VycmVudERlbHRhLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCAhYnV5ZXIgKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJ1eWVyID0ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb3BlbmlkOiBvcGVuSWQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiAnYnV5JyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlbHRhOiAwXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyDmj5LlhaXliLDlpLTpg6jvvIzmnIDmlrDnmoTlt7LmlK/ku5jorqLljZXlsLHlnKjkuIrpnaJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxhc3RPaWRzLnVuc2hpZnQoIG9pZCApO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoICFsYXN0VWlkcy5maW5kKCB4ID0+IHggPT09IG9wZW5JZCApKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGFzdFVpZHMudW5zaGlmdCggb3BlbklkICk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHVwZGF0ZSQgPSBhd2FpdCBkYi5jb2xsZWN0aW9uKCdzaG9wcGluZy1saXN0JykuZG9jKCBTdHJpbmcoIGZpbmQkLmRhdGFbIDAgXS5faWQgKSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAudXBkYXRlKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb2lkczogbGFzdE9pZHMsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB1aWRzOiBsYXN0VWlkcyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHVwZGF0ZVRpbWU6IGdldE5vdyggdHJ1ZSApXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIH0pKTtcblxuICAgICAgICAgICAgcmV0dXJuIGN0eC5ib2R5ID0ge1xuICAgICAgICAgICAgICAgIHN0YXR1czogMjAwLFxuICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgYnV5ZXIsXG4gICAgICAgICAgICAgICAgICAgIG90aGVyc1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICB9IGNhdGNoICggZSApIHsgcmV0dXJuIGN0eC5ib2R5ID0geyBzdGF0dXM6IDUwMCB9fVxuICAgIH0pO1xuXG4gICAgLyoqXG4gICAgICogQGRlc2NyaXB0aW9uIFxuICAgICAqIHtcbiAgICAgKiAgICAgdGlkLCBcbiAgICAgKiAgICAgbmVlZE9yZGVycyDmmK/lkKbpnIDopoHov5Tlm57orqLljZVcbiAgICAgKiB9XG4gICAgICog6KGM56iL55qE6LSt54mp5riF5Y2V77yM55So5LqO6LCD5pW05ZWG5ZOB5Lu35qC844CB6LSt5Lmw5pWw6YePXG4gICAgICovXG4gICAgYXBwLnJvdXRlcignbGlzdCcsIGFzeW5jKCBjdHgsIG5leHQgKSA9PiB7XG4gICAgICAgIHRyeSB7XG5cbiAgICAgICAgICAgIGxldCBvcmRlcnMkOiBhbnkgPSBbIF07XG5cbiAgICAgICAgICAgIGNvbnN0IHsgdGlkLCBuZWVkT3JkZXJzLCAgfSA9IGV2ZW50LmRhdGE7XG4gICAgICAgICAgICBjb25zdCBvcGVuaWQgPSBldmVudC5kYXRhLm9wZW5JZCB8fCBldmVudC51c2VySW5mby5vcGVuSWQ7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgLy8g5ou/5Yiw6KGM56iL5LiL5omA5pyJ55qE6LSt54mp5riF5Y2VXG4gICAgICAgICAgICBjb25zdCBsaXN0cyQgPSBhd2FpdCBkYi5jb2xsZWN0aW9uKCdzaG9wcGluZy1saXN0JylcbiAgICAgICAgICAgICAgICAud2hlcmUoe1xuICAgICAgICAgICAgICAgICAgICB0aWRcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIC5nZXQoICk7XG4gICAgICAgICAgIFxuICAgICAgICAgICAgLy8g5p+l6K+i5q+P5p2h5riF5Y2V5bqV5LiL55qE5q+P5Liqb3JkZXLor6bmg4XvvIzov5nph4znmoTmr4/kuKpvcmRlcumDveaYr+W3suS7mOiuoumHkeeahFxuICAgICAgICAgICAgaWYgKCBuZWVkT3JkZXJzICE9PSBmYWxzZcKgKSB7XG4gICAgICAgICAgICAgICAgb3JkZXJzJCA9IGF3YWl0IFByb21pc2UuYWxsKCBsaXN0cyQuZGF0YS5tYXAoIGxpc3QgPT4ge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gUHJvbWlzZS5hbGwoIGxpc3Qub2lkcy5tYXAoIGFzeW5jIG9pZCA9PiB7XG4gICAgXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBvcmRlciQgPSBhd2FpdCBkYi5jb2xsZWN0aW9uKCdvcmRlcicpLmRvYyggb2lkIClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAuZ2V0KCApO1xuICAgIFxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgdXNlciQgPSBhd2FpdCBkYi5jb2xsZWN0aW9uKCd1c2VyJylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAud2hlcmUoe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvcGVuaWQ6IG9yZGVyJC5kYXRhLm9wZW5pZFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLmdldCggKTtcbiAgICBcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBPYmplY3QuYXNzaWduKHsgfSwgb3JkZXIkLmRhdGEsIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB1c2VyOiB1c2VyJC5kYXRhWyAwIF1cbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICB9KSk7XG4gICAgICAgICAgICAgICAgfSkpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyDmn6Xor6Lmr4/mnaHmuIXljZXlupXkuIvmr4/kuKrllYblk4HnmoTor6bmg4VcbiAgICAgICAgICAgIGNvbnN0IGdvb2RzJDogYW55ID0gYXdhaXQgUHJvbWlzZS5hbGwoIGxpc3RzJC5kYXRhLm1hcCggYXN5bmMgbGlzdCA9PiB7XG5cbiAgICAgICAgICAgICAgICBjb25zdCB7IHBpZCwgc2lkIH0gPSBsaXN0O1xuICAgICAgICAgICAgICAgIGNvbnN0IGNvbGxlY3Rpb25OYW1lID0gISFzaWQgPyAnc3RhbmRhcmRzJyA6ICdnb29kcyc7XG5cbiAgICAgICAgICAgICAgICAvLyDlnovlj7dcbiAgICAgICAgICAgICAgICBsZXQgc3RhbmRhciQ6IGFueSA9IG51bGw7XG5cbiAgICAgICAgICAgICAgICAvLyDllYblk4FcbiAgICAgICAgICAgICAgICBjb25zdCBnb29kJCA9IGF3YWl0IGRiLmNvbGxlY3Rpb24oJ2dvb2RzJylcbiAgICAgICAgICAgICAgICAgICAgLmRvYyggcGlkIClcbiAgICAgICAgICAgICAgICAgICAgLmdldCggKTtcblxuICAgICAgICAgICAgICAgIGlmICggISFzaWQgKSB7XG4gICAgICAgICAgICAgICAgICAgIHN0YW5kYXIkID0gYXdhaXQgZGIuY29sbGVjdGlvbignc3RhbmRhcmRzJylcbiAgICAgICAgICAgICAgICAgICAgICAgIC5kb2MoIHNpZCApXG4gICAgICAgICAgICAgICAgICAgICAgICAuZ2V0KCApO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgICAgIHRhZzogZ29vZCQuZGF0YS50YWcsXG4gICAgICAgICAgICAgICAgICAgIHRpdGxlOiBnb29kJC5kYXRhLnRpdGxlLFxuICAgICAgICAgICAgICAgICAgICBuYW1lOiBzdGFuZGFyJCA/IHN0YW5kYXIkLmRhdGEubmFtZSA6ICcnLFxuICAgICAgICAgICAgICAgICAgICBwcmljZTogc3RhbmRhciQgPyBzdGFuZGFyJC5kYXRhLnByaWNlIDogZ29vZCQuZGF0YS5wcmljZSxcbiAgICAgICAgICAgICAgICAgICAgaW1nOiBzdGFuZGFyJCA/IHN0YW5kYXIkLmRhdGEuaW1nIDogZ29vZCQuZGF0YS5pbWdbIDAgXSxcbiAgICAgICAgICAgICAgICAgICAgZ3JvdXBQcmljZTogc3RhbmRhciQgPyBzdGFuZGFyJC5kYXRhLmdyb3VwUHJpY2UgOiBnb29kJC5kYXRhLmdyb3VwUHJpY2UsXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSkpO1xuXG4gICAgICAgICAgICAvLyDmn6Xor6LmuIXljZXlr7nlupTnmoTmtLvliqjor6bmg4VcbiAgICAgICAgICAgIGNvbnN0IGFjdGl2aXRpZXMkOiBhbnkgPSBhd2FpdCBQcm9taXNlLmFsbCggbGlzdHMkLmRhdGEubWFwKCBhc3luYyBsaXN0ID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCB7IGFjaWQgfSA9IGxpc3Q7XG4gICAgICAgICAgICAgICAgaWYgKCAhYWNpZCApIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGFjX3ByaWNlOiBudWxsLFxuICAgICAgICAgICAgICAgICAgICAgICAgYWNfZ3JvdXBQcmljZTogbnVsbFxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgbWV0YSA9IGF3YWl0IGRiLmNvbGxlY3Rpb24oJ2FjdGl2aXR5JylcbiAgICAgICAgICAgICAgICAgICAgICAgIC5kb2MoIFN0cmluZyggYWNpZCApKVxuICAgICAgICAgICAgICAgICAgICAgICAgLmdldCggKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGFjX3ByaWNlOiBtZXRhLmRhdGEuYWNfcHJpY2UsXG4gICAgICAgICAgICAgICAgICAgICAgICBhY19ncm91cFByaWNlOiBtZXRhLmRhdGEuYWNfZ3JvdXBQcmljZSxcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pKTtcblxuICAgICAgICAgICAgY29uc3QgbGlzdCA9IGxpc3RzJC5kYXRhLm1hcCgoIGwsIGsgKSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3QgeyBhY19ncm91cFByaWNlLCBhY19wcmljZSB9ID0gYWN0aXZpdGllcyRbIGsgXTtcbiAgICAgICAgICAgICAgICBjb25zdCB7IGltZywgcHJpY2UsIGdyb3VwUHJpY2UsIHRpdGxlLCBuYW1lLCB0YWcgfSA9IGdvb2RzJFsgayBdO1xuICAgICAgICAgICAgICAgIGxldCBtZXRhID0gT2JqZWN0LmFzc2lnbih7IH0sIGwsIHtcbiAgICAgICAgICAgICAgICAgICAgdGFnLFxuICAgICAgICAgICAgICAgICAgICBpbWcsXG4gICAgICAgICAgICAgICAgICAgIHByaWNlLFxuICAgICAgICAgICAgICAgICAgICBncm91cFByaWNlLFxuICAgICAgICAgICAgICAgICAgICBnb29kTmFtZTogdGl0bGUsXG4gICAgICAgICAgICAgICAgICAgIHN0YW5kYXJOYW1lOiBuYW1lLFxuICAgICAgICAgICAgICAgICAgICBhY19ncm91cFByaWNlLFxuICAgICAgICAgICAgICAgICAgICBhY19wcmljZVxuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgaWYgKCBuZWVkT3JkZXJzICE9PSBmYWxzZSApIHtcbiAgICAgICAgICAgICAgICAgICAgbWV0YSA9IE9iamVjdC5hc3NpZ24oeyB9LCBtZXRhLCB7XG4gICAgICAgICAgICAgICAgICAgICAgICBvcmRlcjogb3JkZXJzJFsgayBdLFxuICAgICAgICAgICAgICAgICAgICAgICAgdG90YWw6IG9yZGVycyRbIGsgXS5yZWR1Y2UoKCB4LCB5ICkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB4ICsgeS5jb3VudDtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sIDAgKVxuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHJldHVybiBtZXRhO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHJldHVybiBjdHguYm9keSA9IHtcbiAgICAgICAgICAgICAgICBzdGF0dXM6IDIwMCxcbiAgICAgICAgICAgICAgICBkYXRhOiBsaXN0LFxuICAgICAgICAgICAgfVxuXG4gICAgICAgIH0gY2F0Y2ggKCBlICkgeyByZXR1cm4gY3R4LmJvZHkgPSB7IHN0YXR1czogNTAwIH07fVxuICAgIH0pXG5cbiAgICAvKipcbiAgICAgKiDotK3nianmuIXljZXosIPmlbRcbiAgICAgKiAtLS0tLS0tLSDor7fmsYJcbiAgICAgKiB7XG4gICAgICogICAgc2hvcHBpbmdJZCwgYWRqdXN0UHJpY2UsIHB1cmNoYXNlLCBhZGp1c3RHcm91cFByaWNlXG4gICAgICogfVxuICAgICAqL1xuICAgIGFwcC5yb3V0ZXIoJ2FkanVzdCcsIGFzeW5jKCBjdHgsIG5leHQgKSA9PiB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGNvbnN0IHsgc2hvcHBpbmdJZCwgYWRqdXN0UHJpY2UsIGFkanVzdEdyb3VwUHJpY2UgfSA9IGV2ZW50LmRhdGE7XG5cbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICog5riF5Y2V77yM5YWI5ou/5Yiw6K6i5Y2V6YeH6LSt5oC75pWwXG4gICAgICAgICAgICAgKiDpmo/lkI7mm7TmlrDvvJrph4fotK3ph4/jgIHmuIXljZXllK7ku7fjgIHmuIXljZXlm6LotK3ku7fjgIFiYXNlX3N0YXR1c+OAgWJ1eV9zdGF0dXNcbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgY29uc3Qgc2hvcHBpbmckID0gYXdhaXQgZGIuY29sbGVjdGlvbignc2hvcHBpbmctbGlzdCcpXG4gICAgICAgICAgICAgICAgLmRvYyggc2hvcHBpbmdJZCApXG4gICAgICAgICAgICAgICAgLmdldCggKTtcbiAgIFxuICAgICAgICAgICAgY29uc29sZS5sb2coJzExMTExMScsIHNob3BwaW5nJCApO1xuXG4gICAgICAgICAgICBjb25zdCBvcmRlcnMkID0gYXdhaXQgUHJvbWlzZS5hbGwoIHNob3BwaW5nJC5kYXRhLm9pZHMubWFwKCBvaWQgPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiBkYi5jb2xsZWN0aW9uKCdvcmRlcicpXG4gICAgICAgICAgICAgICAgICAgIC5kb2MoIG9pZCApXG4gICAgICAgICAgICAgICAgICAgIC5nZXQoICk7XG4gICAgICAgICAgICB9KSk7XG5cbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCcyMjIyMjIyJywgb3JkZXJzJCApO1xuXG4gICAgICAgICAgICAvLyDliankvZnliIbphY3ph49cbiAgICAgICAgICAgIGxldCBsYXN0QWxsb2NhdGVkID0gMDtcblxuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiDmgLvliIbphY3ph49cbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgbGV0IHB1cmNoYXNlID0gZXZlbnQuZGF0YS5wdXJjaGFzZTtcblxuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiAhIOS8oOWFpeWIhumFjemHj+S4jeiDveWwkeS6juOAguW3suWujOaIkOWIhumFjeiuouWNleeahOaVsOmineS5i+WSjFxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICBjb25zdCBmaW5pc2hBZGp1c3RPcmRlcnMgPSBvcmRlcnMkXG4gICAgICAgICAgICAgICAgLm1hcCgoIHg6IGFueSApID0+IHguZGF0YSApXG4gICAgICAgICAgICAgICAgLmZpbHRlciggbyA9PiBvLmJhc2Vfc3RhdHVzID09PSAnMicgKTtcblxuICAgICAgICAgICAgY29uc29sZS5sb2coJzMzMzMzMycsIGZpbmlzaEFkanVzdE9yZGVycyk7XG5cbiAgICAgICAgICAgIC8vIOW3suWIhumFjemHj1xuICAgICAgICAgICAgY29uc3QgaGFzQmVlbkFkanVzdCA9IGZpbmlzaEFkanVzdE9yZGVycy5yZWR1Y2UoKCB4LCB5ICkgPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiB4ICsgeS5hbGxvY2F0ZWRDb3VudDtcbiAgICAgICAgICAgIH0sIDAgKTtcblxuICAgICAgICAgICAgY29uc29sZS5sb2coJzQ0NDQ0NCcsIGhhc0JlZW5BZGp1c3QgKTtcblxuICAgICAgICAgICAgaWYgKCBwdXJjaGFzZSA8IGhhc0JlZW5BZGp1c3QgKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGN0eC5ib2R5ID0ge1xuICAgICAgICAgICAgICAgICAgICBzdGF0dXM6IDUwMCxcbiAgICAgICAgICAgICAgICAgICAgbWVzc2FnZTogYOaciSR7ZmluaXNoQWRqdXN0T3JkZXJzLmxlbmd0aH3kuKrorqLljZXlt7Lnoa7orqTvvIzmlbDph4/kuI3og73lsJHkuo4ke2hhc0JlZW5BZGp1c3R95Lu2YFxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIFxuICAgICAgICAgICAgbGV0IG5lZWRCdXlUb3RhbCA9IG9yZGVycyQucmVkdWNlKCggeCwgeSApID0+IHtcbiAgICAgICAgICAgICAgICByZXR1cm4geCArICh5IGFzIGFueSkuZGF0YS5jb3VudDtcbiAgICAgICAgICAgIH0sIDAgKTtcblxuICAgICAgICAgICAgY29uc3QgdGVtcCA9IE9iamVjdC5hc3NpZ24oeyB9LCBzaG9wcGluZyQuZGF0YSwge1xuICAgICAgICAgICAgICAgIHB1cmNoYXNlLFxuICAgICAgICAgICAgICAgIGFkanVzdFByaWNlLFxuICAgICAgICAgICAgICAgIGFkanVzdEdyb3VwUHJpY2UsXG4gICAgICAgICAgICAgICAgYmFzZV9zdGF0dXM6ICcxJyxcbiAgICAgICAgICAgICAgICBidXlfc3RhdHVzOiBwdXJjaGFzZSA8IG5lZWRCdXlUb3RhbCA/ICcyJyA6ICcxJyxcbiAgICAgICAgICAgICAgICB1cGRhdGVUaW1lOiBnZXROb3coIHRydWUgKVxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIGRlbGV0ZSB0ZW1wWydfaWQnXTtcblxuICAgICAgICAgICAgY29uc29sZS5sb2coJzU1NTU1NScsIHRlbXApXG5cbiAgICAgICAgICAgIC8vIOabtOaWsOa4heWNlVxuICAgICAgICAgICAgYXdhaXQgZGIuY29sbGVjdGlvbignc2hvcHBpbmctbGlzdCcpXG4gICAgICAgICAgICAgICAgLmRvYyggc2hvcHBpbmdJZCApXG4gICAgICAgICAgICAgICAgLnNldCh7XG4gICAgICAgICAgICAgICAgICAgIGRhdGE6IHRlbXBcbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiAh5Lul5LiL6K6i5Y2V6YO95piv5bey5LuY6K6i6YeR55qEXG4gICAgICAgICAgICAgKiDorqLljZXvvJrmibnph4/lr7norqLljZXnmoTku7fmoLzjgIHlm6LotK3ku7fjgIHotK3kubDnirbmgIHov5vooYzosIPmlbQo5bey6LSt5LmwL+i/m+ihjOS4re+8jOWFtuS7luW3sue7j+ehruWumuiwg+aVtOeahOiuouWNle+8jOS4jeWBmuWkhOeQhilcbiAgICAgICAgICAgICAqIOWFtuWunuW6lOivpeS5n+imgeiHquWKqOazqOWFpeiuouWNleaVsOmHj++8iOetlueVpe+8muWFiOWIsOWFiOW+l++8jOWQjuS4i+WNleS8muacieW+l+S4jeWIsOWNleeahOmjjumZqe+8iVxuICAgICAgICAgICAgICogIeWmguaenOW3sue7j+WIhumFjei/h+S6hu+8jOWImeS4jeWGjeiHquWKqOWIhumFjemHh+i0remHj1xuICAgICAgICAgICAgICovXG4gICAgICAgICAgICBjb25zdCBzb3JyZWRPcmRlcnMgPSBvcmRlcnMkXG4gICAgICAgICAgICAgICAgLm1hcCgoIHg6IGFueSApID0+IHguZGF0YSApXG4gICAgICAgICAgICAgICAgLmZpbHRlcigoIHg6IGFueSApID0+IHguYmFzZV9zdGF0dXMgPT09ICcwJyB8fCB4LmJhc2Vfc3RhdHVzID09PSAnMScgKVxuICAgICAgICAgICAgICAgIC5zb3J0KCggeDogYW55LCB5OiBhbnkgKSA9PiB4LmNyZWF0ZVRpbWUgLSB5LmNyZWF0ZVRpbWUgKTtcblxuICAgICAgICAgICAgY29uc29sZS5sb2coJzY2NjY2NicsIHNvcnJlZE9yZGVycyApO1xuXG4gICAgICAgICAgICAvLyDliankvZnliIbphY3ph49cbiAgICAgICAgICAgIHB1cmNoYXNlIC09IGhhc0JlZW5BZGp1c3Q7XG5cbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCAnNzc3JywgcHVyY2hhc2UgKTtcbiAgICAgICAgXG4gICAgICAgICAgICBhd2FpdCBQcm9taXNlLmFsbCggc29ycmVkT3JkZXJzLm1hcCggYXN5bmMgb3JkZXIgPT4ge1xuXG4gICAgICAgICAgICAgICAgY29uc3QgYmFzZVRlbXAgPSB7XG4gICAgICAgICAgICAgICAgICAgIGFsbG9jYXRlZFByaWNlOiBhZGp1c3RQcmljZSxcbiAgICAgICAgICAgICAgICAgICAgYWxsb2NhdGVkR3JvdXBQcmljZTogYWRqdXN0R3JvdXBQcmljZSxcbiAgICAgICAgICAgICAgICAgICAgLy8g5peg6K666Ieq5Yqo5YiG6YWN5piv5ZCm5oiQ5Yqf77yM6YO95piv6KKr4oCc5YiG6YWN4oCd5pON5L2c6L+H55qEXG4gICAgICAgICAgICAgICAgICAgIGJhc2Vfc3RhdHVzOiAnMScsXG4gICAgICAgICAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICAgICAgICAgKiAhIHYxOiDliankvZnliIbphY3ph4/kuI3otrPph4fotK3ph4/lsLHliIbphY0wXG4gICAgICAgICAgICAgICAgICAgICAqICEgdjI6IOWJqeS9meWIhumFjemHj+S4jei2s+mHh+i0remHj++8jOWwseWIhumFjeWJqeS9meeahOmHh+i0remHj1xuICAgICAgICAgICAgICAgICAgICAgKi9cbiAgICAgICAgICAgICAgICAgICAgLy8gYWxsb2NhdGVkQ291bnQ6IHB1cmNoYXNlIC0gb3JkZXIuY291bnQgPj0gMCA/IG9yZGVyLmNvdW50IDogMFxuICAgICAgICAgICAgICAgICAgICBhbGxvY2F0ZWRDb3VudDogcHVyY2hhc2UgLSBvcmRlci5jb3VudCA+PSAwID9cbiAgICAgICAgICAgICAgICAgICAgICAgIG9yZGVyLmNvdW50IDpcbiAgICAgICAgICAgICAgICAgICAgICAgIHB1cmNoYXNlXG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAvLyDliIbphY3miJDlip9cbiAgICAgICAgICAgICAgICBpZiAoIHB1cmNoYXNlIC0gb3JkZXIuY291bnQgPj0gMCApIHtcbiAgICAgICAgICAgICAgICAgICAgbGFzdEFsbG9jYXRlZCA9IHB1cmNoYXNlIC0gb3JkZXIuY291bnQ7XG4gICAgICAgICAgICAgICAgICAgIHB1cmNoYXNlIC09IG9yZGVyLmNvdW50O1xuXG4gICAgICAgICAgICAgICAgLy8g6LSn5rqQ5LiN6Laz77yM5YiG6YWN5pyA5ZCO55qE5Ymp5L2Z6YePXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgbGFzdEFsbG9jYXRlZCA9IDA7XG4gICAgICAgICAgICAgICAgICAgIHB1cmNoYXNlID0gMDtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBjb25zdCB0ZW1wID0gT2JqZWN0LmFzc2lnbih7IH0sIG9yZGVyLCBiYXNlVGVtcCApO1xuXG4gICAgICAgICAgICAgICAgZGVsZXRlIHRlbXBbJ19pZCddO1xuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIGF3YWl0IGRiLmNvbGxlY3Rpb24oJ29yZGVyJylcbiAgICAgICAgICAgICAgICAgICAgLmRvYyggb3JkZXIuX2lkIClcbiAgICAgICAgICAgICAgICAgICAgLnNldCh7XG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRhOiB0ZW1wXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIHJldHVybjtcblxuICAgICAgICAgICAgfSkpO1xuXG4gICAgICAgICAgICAvLyDmm7TmlrDmuIXljZXnmoTliankvZnliIbphY3mlbBcbiAgICAgICAgICAgIGF3YWl0IGRiLmNvbGxlY3Rpb24oJ3Nob3BwaW5nLWxpc3QnKVxuICAgICAgICAgICAgICAgIC5kb2MoIHNob3BwaW5nSWQgKVxuICAgICAgICAgICAgICAgIC51cGRhdGUoe1xuICAgICAgICAgICAgICAgICAgICBkYXRhOiB7IGxhc3RBbGxvY2F0ZWQgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICBcbiAgICAgICAgICAgIHJldHVybiBjdHguYm9keSA9IHtcbiAgICAgICAgICAgICAgICBzdGF0dXM6IDIwMFxuICAgICAgICAgICAgfVxuXG4gICAgICAgIH0gY2F0Y2ggKCBlICkgeyByZXR1cm4gY3R4LmJvZHkgPSB7IHN0YXR1czogNTAwIH07fVxuICAgIH0pXG5cbiAgICAvKipcbiAgICAgKiBAZGVzY3JpcHRpb25cbiAgICAgKiDojrflj5booYznqIvph4zmmK/lkKbov5jmnInmnKrosIPmlbTnmoTmuIXljZVcbiAgICAqL1xuICAgIGFwcC5yb3V0ZXIoJ2FkanVzdC1zdGF0dXMnLCBhc3luYyggY3R4LCBuZXh0ICkgPT4ge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgY29uc3QgeyB0aWQgfSA9IGV2ZW50LmRhdGE7XG4gICAgICAgICAgICBjb25zdCBjb3VudCA9IGF3YWl0IGRiLmNvbGxlY3Rpb24oJ3Nob3BwaW5nLWxpc3QnKVxuICAgICAgICAgICAgICAgIC53aGVyZSh7XG4gICAgICAgICAgICAgICAgICAgIHRpZCxcbiAgICAgICAgICAgICAgICAgICAgYmFzZV9zdGF0dXM6ICcwJ1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLmNvdW50KCApO1xuXG4gICAgICAgICAgICByZXR1cm4gY3R4LmJvZHkgPSB7XG4gICAgICAgICAgICAgICAgc3RhdHVzOiAyMDAsXG4gICAgICAgICAgICAgICAgZGF0YTogY291bnQudG90YWxcbiAgICAgICAgICAgIH1cblxuICAgICAgICB9IGNhdGNoICggZSApIHtcbiAgICAgICAgICAgIHJldHVybiBjdHguYm9keSA9IHsgc3RhdHVzOiA1MDAgfTtcbiAgICAgICAgfVxuICAgIH0pXG5cbiAgICAvKipcbiAgICAgKiBAZGVzY3JpcHRpb25cbiAgICAgKiDnrYnlvoXmi7zlm6LliJfooaggLyDlj6/mi7zlm6LliJfooaggKCDlj6/mjIflrprllYblk4E6IOWVhuWTgeivpuaDhemhtemdoiApXG4gICAgICoge1xuICAgICAqICAgIHRpZCxcbiAgICAgKiAgICBwaWQsXG4gICAgICogICAgbGltaXRcbiAgICAgKiAgICBkZXRhaWw6IGJvb2xlYW4g5piv5ZCm5bim5Zue5ZWG5ZOB6K+m5oOF77yI6buY6K6k5bim5Zue77yJXG4gICAgICogICAgc2hvd1VzZXI6IGJvb2xlYW4g5piv5ZCm6ZyA6KaB55So5oi35aS05YOP562J5L+h5oGv77yI6buY6K6k5LiN5bim5Zue77yJXG4gICAgICogICAgdHlwZTogICd3YWl0JyB8ICdwaW4nIHwgJ2FsbCcgLy8g562J5b6F5ou85Zui44CB5bey5ou85Zui44CB562J5b6F5ou85ZuiK+W3suaLvOWbouOAgeaJgOaciei0reeJqea4hea3oVxuICAgICAqIH1cbiAgICAgKi9cbiAgICBhcHAucm91dGVyKCdwaW4nLCBhc3luYyggY3R4LCBuZXh0ICkgPT4ge1xuICAgICAgICB0cnkge1xuXG4gICAgICAgICAgICBsZXQgYmpwQ29uZmlnOiBhbnkgPSBudWxsO1xuICAgICAgICAgICAgY29uc3Qgb3BlbmlkID0gZXZlbnQudXNlckluZm8ub3BlbklkO1xuICAgICAgICAgICAgY29uc3QgeyB0aWQsIGRldGFpbCwgcGlkLCB0eXBlLCBsaW1pdCB9ID0gZXZlbnQuZGF0YTtcbiAgICAgICAgICAgIGNvbnN0IHNob3dVc2VyID0gZXZlbnQuZGF0YS5zaG93VXNlciB8fCBmYWxzZTtcblxuICAgICAgICAgICAgY29uc3QgcXVlcnkgPSBwaWQgPyB7XG4gICAgICAgICAgICAgICAgdGlkLFxuICAgICAgICAgICAgICAgIHBpZFxuICAgICAgICAgICAgfSA6IHtcbiAgICAgICAgICAgICAgICB0aWRcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIGxldCBzaG9wcGluZyQ7XG4gICAgICAgICAgICBpZiAoIGxpbWl0ICkge1xuICAgICAgICAgICAgICAgIHNob3BwaW5nJCA9IGF3YWl0IGRiLmNvbGxlY3Rpb24oJ3Nob3BwaW5nLWxpc3QnKVxuICAgICAgICAgICAgICAgICAgICAud2hlcmUoIHF1ZXJ5IClcbiAgICAgICAgICAgICAgICAgICAgLmxpbWl0KCBsaW1pdCApXG4gICAgICAgICAgICAgICAgICAgIC5nZXQoICk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHNob3BwaW5nJCA9IGF3YWl0IGRiLmNvbGxlY3Rpb24oJ3Nob3BwaW5nLWxpc3QnKVxuICAgICAgICAgICAgICAgICAgICAud2hlcmUoIHF1ZXJ5IClcbiAgICAgICAgICAgICAgICAgICAgLmdldCggKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIFxuICAgICAgICAgICAgLy8g5L+d5YGl5ZOB6YWN572uXG4gICAgICAgICAgICBjb25zdCBianBDb25maWckID0gYXdhaXQgZGIuY29sbGVjdGlvbignYXBwLWNvbmZpZycpXG4gICAgICAgICAgICAud2hlcmUoe1xuICAgICAgICAgICAgICAgIHR5cGU6ICdhcHAtYmpwLXZpc2libGUnXG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLmdldCggKTtcbiAgICAgICAgICAgIGJqcENvbmZpZyA9IGJqcENvbmZpZyQuZGF0YVsgMCBdO1xuXG4gICAgICAgICAgICAvLyB1aWRz6ZW/5bqm5Li6Me+8jOS4uuW+heaLvOWIl+ihqCAoIOafpeivouW+heaLvOWIl+ihqOaXtu+8jOWPr+S7peacieiHquW3se+8jOiuqeWuouaIt+efpemBk+ezu+e7n+S8muWIl+WHuuadpSApXG4gICAgICAgICAgICAvLyB1aWRz6ZW/5bqm5Li6Mu+8jOS4uuWPr+S7peaLvOWbouWIl+ihqFxuICAgICAgICAgICAgbGV0IGRhdGE6IGFueSA9IFsgXTtcbiAgICAgICAgICAgIGxldCBkYXRhJCA9IHNob3BwaW5nJC5kYXRhLmZpbHRlciggcyA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKCB0eXBlID09PSAncGluJyApIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuICggISFzLmFkanVzdEdyb3VwUHJpY2UgfHwgISFzLmdyb3VwUHJpY2UgKSAmJiBzLnVpZHMubGVuZ3RoID4gMTtcblxuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoIHR5cGUgPT09ICd3YWl0JyApIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuICggISFzLmFkanVzdEdyb3VwUHJpY2UgfHwgISFzLmdyb3VwUHJpY2UgKSAmJiBzLnVpZHMubGVuZ3RoID09PSAxO1xuXG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmICggdHlwZSA9PT0gdW5kZWZpbmVkICkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gKCAhIXMuYWRqdXN0R3JvdXBQcmljZSB8fCAhIXMuZ3JvdXBQcmljZSApO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBkYXRhJCA9IGRhdGEkLnNvcnQoKCB4LCB5ICkgPT4geS51aWRzLmxlbmd0aCAtIHgudWlkcy5sZW5ndGggKTtcbiAgICAgICAgICAgIGRhdGEgPSBkYXRhJDtcblxuICAgICAgICAgICAgLy8g5ZWG5ZOBXG4gICAgICAgICAgICBjb25zdCBnb29kSWRzID0gQXJyYXkuZnJvbShcbiAgICAgICAgICAgICAgICBuZXcgU2V0KCBkYXRhJC5tYXAoIGxpc3QgPT4gXG4gICAgICAgICAgICAgICAgICAgIGxpc3QucGlkXG4gICAgICAgICAgICAgICAgKSlcbiAgICAgICAgICAgICk7XG5cbiAgICAgICAgICAgIC8vIOWei+WPt1xuICAgICAgICAgICAgY29uc3Qgc3RhbmRhcnNJZHMgPSBBcnJheS5mcm9tKFxuICAgICAgICAgICAgICAgIG5ldyBTZXQoIGRhdGEkLm1hcCggbGlzdCA9PiBcbiAgICAgICAgICAgICAgICAgICAgbGlzdC5zaWRcbiAgICAgICAgICAgICAgICApKVxuICAgICAgICAgICAgKS5maWx0ZXIoIHggPT4gISF4ICk7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIC8vIOWVhuWTgVxuICAgICAgICAgICAgbGV0IGFsbEdvb2RzJDogYW55ID0gYXdhaXQgUHJvbWlzZS5hbGwoIGdvb2RJZHMubWFwKCBnb29kSWQgPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiBkYi5jb2xsZWN0aW9uKCdnb29kcycpXG4gICAgICAgICAgICAgICAgICAgIC5kb2MoIFN0cmluZyggZ29vZElkICkpXG4gICAgICAgICAgICAgICAgICAgIC5nZXQoICk7XG4gICAgICAgICAgICB9KSk7XG5cbiAgICAgICAgICAgIGFsbEdvb2RzJCA9IGFsbEdvb2RzJC5tYXAoIHggPT4geC5kYXRhICk7XG5cbiAgICAgICAgICAgIC8vIOWei+WPt1xuICAgICAgICAgICAgbGV0IGFsbFN0YW5kYXJzJDogYW55ID0gYXdhaXQgUHJvbWlzZS5hbGwoIHN0YW5kYXJzSWRzLm1hcCggc2lkID0+IHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZGIuY29sbGVjdGlvbignc3RhbmRhcmRzJylcbiAgICAgICAgICAgICAgICAgICAgLmRvYyggU3RyaW5nKCBzaWQgKSlcbiAgICAgICAgICAgICAgICAgICAgLmdldCggKTtcbiAgICAgICAgICAgIH0pKTtcblxuICAgICAgICAgICAgYWxsU3RhbmRhcnMkID0gYWxsU3RhbmRhcnMkLm1hcCggeCA9PiB4LmRhdGEgKTtcblxuICAgICAgICAgICAgLy8g5p+l6K+i5q+P5p2h5riF5Y2V5bqV5LiL5q+P5Liq5ZWG5ZOB55qE6K+m5oOFXG4gICAgICAgICAgICBpZiAoIGRldGFpbCA9PT0gdW5kZWZpbmVkIHx8ICEhZGV0YWlsICkge1xuXG4gICAgICAgICAgICAgICAgY29uc3QgZ29vZCQgPSBkYXRhJC5tYXAoIGxpc3QgPT4ge1xuXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHsgcGlkLCBzaWQgfSA9IGxpc3Q7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGdvb2Q6IGFueSA9IGFsbEdvb2RzJC5maW5kKCB4ID0+IHguX2lkID09PSBwaWQgKTtcbiAgICAgICAgICAgICAgICAgICAgY29uc3Qgc3RhbmRhciA9IGFsbFN0YW5kYXJzJC5maW5kKCB4ID0+IHguX2lkID09PSBzaWQgKTtcbiAgICBcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGdvb2QsXG4gICAgICAgICAgICAgICAgICAgICAgICB0YWc6IGdvb2QudGFnLFxuICAgICAgICAgICAgICAgICAgICAgICAgdGl0bGU6IGdvb2QudGl0bGUsXG4gICAgICAgICAgICAgICAgICAgICAgICBzYWxlZDogZ29vZC5zYWxlZCxcbiAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6IHN0YW5kYXIgPyBzdGFuZGFyLm5hbWUgOiAnJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIHByaWNlOiBzdGFuZGFyID8gc3RhbmRhci5wcmljZSA6IGdvb2QucHJpY2UsXG4gICAgICAgICAgICAgICAgICAgICAgICBpbWc6IHN0YW5kYXIgPyBzdGFuZGFyLmltZyA6IGdvb2QuaW1nWyAwIF0sXG4gICAgICAgICAgICAgICAgICAgICAgICBncm91cFByaWNlOiBzdGFuZGFyID8gc3RhbmRhci5ncm91cFByaWNlIDogZ29vZC5ncm91cFByaWNlLFxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgXG4gICAgICAgICAgICAgICAgLy8g5rOo5YWl5ZWG5ZOB6K+m5oOFXG4gICAgICAgICAgICAgICAgZGF0YSA9IGRhdGEkLm1hcCgoIHNob3BwaW5nLCBrICkgPT4ge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gT2JqZWN0LmFzc2lnbih7IH0sIHNob3BwaW5nLCB7XG4gICAgICAgICAgICAgICAgICAgICAgICBkZXRhaWw6IGdvb2QkWyBrIF1cbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyDlsZXnpLrnlKjmiLflpLTlg49cbiAgICAgICAgICAgIGlmICggc2hvd1VzZXIgKSB7XG5cbiAgICAgICAgICAgICAgICBsZXQgdWlkczogc3RyaW5nWyBdID0gWyBdO1xuICAgICAgICAgICAgICAgIGRhdGEkLm1hcCggbGlzdCA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHVpZHMgPSBbIC4uLnVpZHMsIC4uLmxpc3QudWlkcyBdO1xuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgdWlkcyA9IEFycmF5LmZyb20oXG4gICAgICAgICAgICAgICAgICAgIG5ldyBTZXQoIHVpZHMgKVxuICAgICAgICAgICAgICAgICk7XG4gXG4gICAgICAgICAgICAgICAgbGV0IHVzZXJzJDogYW55ID0gYXdhaXQgUHJvbWlzZS5hbGwoIHVpZHMubWFwKCB1aWQgPT4ge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZGIuY29sbGVjdGlvbigndXNlcicpXG4gICAgICAgICAgICAgICAgICAgICAgICAud2hlcmUoe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9wZW5pZDogdWlkXG4gICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAgICAgLmZpZWxkKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvcGVuaWQ6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYXZhdGFyVXJsOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5pY2tOYW1lOiB0cnVlXG4gICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAgICAgLmdldCggKTtcbiAgICAgICAgICAgICAgICB9KSk7XG5cbiAgICAgICAgICAgICAgICB1c2VycyQgPSB1c2VycyQubWFwKCB4ID0+IHguZGF0YVsgMCBdKTtcblxuICAgICAgICAgICAgICAgIGRhdGEgPSBkYXRhLm1hcCgoIHNob3BwaW5nLCBrICkgPT4ge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gT2JqZWN0LmFzc2lnbih7IH0sIHNob3BwaW5nLCB7XG4gICAgICAgICAgICAgICAgICAgICAgICB1c2Vyczogc2hvcHBpbmcudWlkcy5tYXAoIHVpZCA9PiB1c2VycyQuZmluZCggeCA9PiB4Lm9wZW5pZCA9PT0gdWlkICkpXG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIFxuICAgICAgICAgICAgLy8g5qC55o2u5L+d5YGl5ZOB6K6+572u6L+b6KGM55u45bqU55qE6L+H5rukXG4gICAgICAgICAgICBpZiAoICEhYmpwQ29uZmlnICYmICFianBDb25maWcudmFsdWUgKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgbWV0YSA9IGRhdGFcbiAgICAgICAgICAgICAgICAgICAgLmZpbHRlciggeCA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBnb29kID0gYWxsR29vZHMkLmZpbmQoIHkgPT4geS5faWQgPT09IHgucGlkICk7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gU3RyaW5nKCBnb29kLmNhdGVnb3J5ICkgIT09ICc0J1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICBkYXRhID0gbWV0YTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIGN0eC5ib2R5ID0ge1xuICAgICAgICAgICAgICAgIGRhdGEsXG4gICAgICAgICAgICAgICAgc3RhdHVzOiAyMDBcbiAgICAgICAgICAgIH1cblxuICAgICAgICB9IGNhdGNoICggZSApIHtcbiAgICAgICAgICAgIHJldHVybiBjdHguYm9keSA9IHsgc3RhdHVzOiA1MDAgfTtcbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgLyoqIFxuICAgICAqIEBkZXNjcmlwdGlvblxuICAgICAqIOS7meWls+i0reeJqea4heWNlSAoIOS5sOS6huWkmuWwkeOAgeWNoeWIuOWkmuWwkeOAgeecgeS6huWkmuWwkSApXG4gICAgICovXG4gICAgYXBwLnJvdXRlcignZmFpcnktc2hvcHBpbmdsaXN0JywgYXN5bmMoIGN0eCwgbmV4dCApID0+IHtcbiAgICAgICAgdHJ5IHtcblxuICAgICAgICAgICAgY29uc3QgeyB0aWQgfSA9IGV2ZW50LmRhdGE7XG4gICAgICAgICAgICBjb25zdCBsaW1pdCA9IGV2ZW50LmRhdGEubGltaXQgfHwgNTtcblxuICAgICAgICAgICAgLyoqIOihjOeoi+i0reeJqea4heWNlSAqL1xuICAgICAgICAgICAgY29uc3Qgc2hvcHBpbmdNZXRhJCA9IGF3YWl0IGRiLmNvbGxlY3Rpb24oJ3Nob3BwaW5nLWxpc3QnKVxuICAgICAgICAgICAgICAgIC53aGVyZSh7XG4gICAgICAgICAgICAgICAgICAgIHRpZFxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLmdldCggKTtcbiAgICAgICAgICAgIFxuICAgICAgICBcbiAgICAgICAgICAgIC8qKiDmiYDmnIl1aWTvvIjlkKvph43lpI3vvIkgKi9cbiAgICAgICAgICAgIGxldCB1aWRzOiBhbnkgPSBbIF07XG4gICAgICAgICAgICBzaG9wcGluZ01ldGEkLmRhdGEubWFwKCBzbCA9PiB7XG4gICAgICAgICAgICAgICAgdWlkcyA9IFsgLi4udWlkcywgLi4uc2wudWlkcyBdO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIC8qKiDlpITnkIbkvJjljJZcbiAgICAgICAgICAgICAqIOiuqei0reS5sOmHj+abtOWkmueahOeUqOaIt++8jOWxleekuuWcqOWJjemdolxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICBsZXQgdWlkTWFwVGltZXM6IHtcbiAgICAgICAgICAgICAgICBbIGtleTogc3RyaW5nIF0gOiBudW1iZXJcbiAgICAgICAgICAgIH0gPSB7IH07XG4gICAgICAgICAgICB1aWRzLm1hcCggdWlkc3RyaW5nID0+IHtcbiAgICAgICAgICAgICAgICBpZiAoICF1aWRNYXBUaW1lc1sgdWlkc3RyaW5nIF0pIHtcbiAgICAgICAgICAgICAgICAgICAgdWlkTWFwVGltZXMgPSBPYmplY3QuYXNzaWduKHsgfSwgdWlkTWFwVGltZXMsIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIFsgdWlkc3RyaW5nIF06IDFcbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB1aWRNYXBUaW1lcyA9IE9iamVjdC5hc3NpZ24oeyB9LCB1aWRNYXBUaW1lcywge1xuICAgICAgICAgICAgICAgICAgICAgICAgWyB1aWRzdHJpbmcgXTogdWlkTWFwVGltZXNbIHVpZHN0cmluZyBdICsgMVxuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAvKiog5YmNNeWQjeeahOeUqOaIt2lkICovXG4gICAgICAgICAgICBjb25zdCB1c2VySWRzID0gT2JqZWN0LmVudHJpZXMoIHVpZE1hcFRpbWVzIClcbiAgICAgICAgICAgICAgICAuc29ydCgoIHgsIHkgKSA9PiBcbiAgICAgICAgICAgICAgICAgICAgeVsgMSBdIC0geFsgMSBdXG4gICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICAgIC5zbGljZSggMCwgbGltaXQgKVxuICAgICAgICAgICAgICAgIC5tYXAoIHggPT4geFsgMCBdKTtcblxuICAgICAgICAgICAgLyoqIOavj+S4queUqOaIt+eahOS/oeaBryAqL1xuICAgICAgICAgICAgY29uc3QgdXNlcnMkID0gYXdhaXQgUHJvbWlzZS5hbGwoIHVzZXJJZHMubWFwKCB1aWQgPT4gUHJvbWlzZS5hbGwoW1xuICAgICAgICAgICAgICAgIGRiLmNvbGxlY3Rpb24oJ3VzZXInKVxuICAgICAgICAgICAgICAgICAgICAud2hlcmUoe1xuICAgICAgICAgICAgICAgICAgICAgICAgb3BlbmlkOiB1aWRcbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgLmdldCggKVxuICAgICAgICAgICAgXSkpKTtcblxuICAgICAgICAgICAgLyoqIOWJjTXkurrnmoTljaHliLggKi9cbiAgICAgICAgICAgIGNvbnN0IGNvdXBvbnMkOiBhbnkgPSBhd2FpdCBQcm9taXNlLmFsbChcbiAgICAgICAgICAgICAgICB1c2VySWRzLm1hcCggdWlkID0+IFxuICAgICAgICAgICAgICAgICAgICBkYi5jb2xsZWN0aW9uKCdjb3Vwb24nKVxuICAgICAgICAgICAgICAgICAgICAgICAgLndoZXJlKF8ub3IoW1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGlkLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvcGVuaWQ6IHVpZFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb3BlbmlkOiB1aWQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhblVzZUluTmV4dDogdHJ1ZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIF0pKVxuICAgICAgICAgICAgICAgICAgICAgICAgLmZpZWxkKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9wZW5pZDogdHJ1ZVxuICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgICAgIC5nZXQoIClcbiAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICApXG5cbiAgICAgICAgICAgIC8qKiDliY015Liq5Lq65oC755qE6LSt54mp5riF5Y2VICovXG4gICAgICAgICAgICBjb25zdCBzaG9wcGluZ01ldGFGaWx0ZXIgPSBzaG9wcGluZ01ldGEkLmRhdGEuZmlsdGVyKCBzID0+IFxuICAgICAgICAgICAgICAgICEhdXNlcklkcy5maW5kKCB1aWQgPT4gXG4gICAgICAgICAgICAgICAgICAgIHMudWlkcy5maW5kKCBcbiAgICAgICAgICAgICAgICAgICAgICAgIHUgPT4gdSA9PT0gdWlkXG4gICAgICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICkpO1xuXG4gICAgICAgICAgICAvKiog5ZWG5ZOBaWQgKi9cbiAgICAgICAgICAgIGNvbnN0IHBJZHMgPSBBcnJheS5mcm9tKFxuICAgICAgICAgICAgICAgIG5ldyBTZXQoIFxuICAgICAgICAgICAgICAgICAgICBzaG9wcGluZ01ldGFGaWx0ZXJcbiAgICAgICAgICAgICAgICAgICAgICAgIC5tYXAoIHMgPT4gcy5waWQgKVxuICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICk7XG5cbiAgICAgICAgICAgIC8qKiDllYblk4Hor6bmg4UgKi8gICAgICAgICAgICBcbiAgICAgICAgICAgIGNvbnN0IGRldGFpbHMkID0gYXdhaXQgUHJvbWlzZS5hbGwoIHBJZHMubWFwKCBwaWQgPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiBkYi5jb2xsZWN0aW9uKCdnb29kcycpXG4gICAgICAgICAgICAgICAgICAgIC5kb2MoIHBpZCApXG4gICAgICAgICAgICAgICAgICAgIC5maWVsZCh7XG4gICAgICAgICAgICAgICAgICAgICAgICBfaWQ6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgICAgICB0YWc6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgICAgICBpbWc6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgICAgICB0aXRsZTogdHJ1ZVxuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAuZ2V0KCApXG4gICAgICAgICAgICB9KSk7XG5cbiAgICAgICAgICAgIC8qKiDotK3nianmuIXljZXms6jlhaXllYblk4Hor6bmg4UgKi9cbiAgICAgICAgICAgIGNvbnN0IHNob3BwaW5nSW5qZWN0ID0gc2hvcHBpbmdNZXRhRmlsdGVyLm1hcCggc2wgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IGRldGFpbCA9IGRldGFpbHMkLmZpbmQoIHggPT4geC5kYXRhLl9pZCA9PT0gc2wucGlkICk7XG4gICAgICAgICAgICAgICAgaWYgKCBkZXRhaWwgKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBPYmplY3QuYXNzaWduKHsgfSwgc2wsIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRldGFpbDogZGV0YWlsLmRhdGFcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIE9iamVjdC5hc3NpZ24oeyB9LCBzbCApO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAvKiog6L+U5Zue57uT5p6cICovXG4gICAgICAgICAgICBjb25zdCBtZXRhRGF0YSA9IHVzZXJzJC5tYXAoKCB4LCBrICkgPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgICAgIHVzZXI6IHhbIDAgXS5kYXRhWyAwIF0sXG4gICAgICAgICAgICAgICAgICAgIGNvdXBvbnM6IGNvdXBvbnMkWyBrIF0uZGF0YSwgXG4gICAgICAgICAgICAgICAgICAgIHNob3BwaW5nbGlzdDogc2hvcHBpbmdJbmplY3QuZmlsdGVyKCBzbCA9PiBzbC51aWRzLmZpbmQoIHVpZCA9PiB1aWQgPT09IHhbIDAgXS5kYXRhWyAwIF0ub3BlbmlkICkpXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHJldHVybiBjdHguYm9keSA9IHtcbiAgICAgICAgICAgICAgICBzdGF0dXM6IDIwMCxcbiAgICAgICAgICAgICAgICBkYXRhOiBtZXRhRGF0YVxuICAgICAgICAgICAgfVxuXG4gICAgICAgIH0gY2F0Y2ggKCBlICkge1xuICAgICAgICAgICAgcmV0dXJuIGN0eC5ib2R5ID0geyBzdGF0dXM6IDUwMCB9O1xuICAgICAgICB9XG4gICAgfSlcblxuICAgIHJldHVybiBhcHAuc2VydmUoICk7XG5cbn0iXX0=