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
            var _a, tid_1, list, openId_1, getErr, trip$, findings$, hasBeenBuy$, goodDetails$, belongGoodIds, belongGoods$, goods_1, standards_1, belongGoods_1, hasLimitGood_1, lowStock_1, hasBeenDelete_1, cannotBuy, hasBeenBuy, limitGoods, orders, reqData, createOrder$, e_1;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 7, , 8]);
                        console.log('======>findCannotBuy');
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
                        if (trip$.data.isClosed || new Date().getTime() > trip$.data.end_date) {
                            return [2, ctx.body = getErr('暂无购物行程～')];
                        }
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
            var _a, list, openId_2, e_2;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        _a = event.data, list = _a.list, openId_2 = _a.openId;
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
                                                uids: [openId_2],
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
                                            if (!lastUids.find(function (x) { return x === openId_2; })) {
                                                lastUids.unshift(openId_2);
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
                                return (!!s.adjustGroupPrice || !!s.groupPrice) && s.uids.length > 1;
                            }
                            else if (type_1 === 'wait') {
                                return (!!s.adjustGroupPrice || !!s.groupPrice) && s.uids.length === 1;
                            }
                            else {
                                return (!!s.adjustGroupPrice || !!s.groupPrice);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSxpQkFvZ0NDOztBQXBnQ0QscUNBQXVDO0FBQ3ZDLHNDQUF3QztBQUd4QyxLQUFLLENBQUMsSUFBSSxDQUFDO0lBQ1AsR0FBRyxFQUFFLE9BQU8sQ0FBQyxHQUFHLENBQUMsS0FBSztDQUN6QixDQUFDLENBQUM7QUFFSCxJQUFNLEVBQUUsR0FBZ0IsS0FBSyxDQUFDLFFBQVEsRUFBRyxDQUFDO0FBQzFDLElBQU0sQ0FBQyxHQUFHLEVBQUUsQ0FBQyxPQUFPLENBQUM7QUFvQlIsUUFBQSxJQUFJLEdBQUcsVUFBUSxLQUFLLEVBQUUsT0FBTzs7OztRQUVoQyxHQUFHLEdBQUcsSUFBSSxTQUFTLENBQUMsRUFBRSxLQUFLLE9BQUEsRUFBRSxDQUFDLENBQUM7UUErRHJDLEdBQUcsQ0FBQyxNQUFNLENBQUMsZUFBZSxFQUFFLFVBQU8sR0FBRyxFQUFFLElBQUk7Ozs7Ozs7d0JBRXBDLE9BQU8sQ0FBQyxHQUFHLENBQUMsc0JBQXNCLENBQUMsQ0FBQTt3QkFDN0IsS0FBZ0IsS0FBSyxDQUFDLElBQUksRUFBeEIsY0FBRyxFQUFFLElBQUksVUFBQSxDQUFnQjt3QkFDM0IsV0FBUyxLQUFLLENBQUMsSUFBSSxDQUFDLE1BQU0sSUFBSSxLQUFLLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQzt3QkFFcEQsTUFBTSxHQUFHLFVBQUEsT0FBTyxJQUFJLE9BQUEsQ0FBQzs0QkFDdkIsT0FBTyxTQUFBOzRCQUNQLE1BQU0sRUFBRSxHQUFHO3lCQUNkLENBQUMsRUFId0IsQ0FHeEIsQ0FBQzt3QkFFSCxJQUFLLENBQUMsS0FBRyxFQUFHOzRCQUNSLFdBQU8sR0FBRyxDQUFDLElBQUksR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDLEVBQUM7eUJBQ3BDO3dCQUdhLFdBQU0sRUFBRSxDQUFD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QUFDLENBQUE7UUFFRixXQUFPLEdBQUcsQ0FBQyxLQUFLLEVBQUcsRUFBQzs7S0FFdkIsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIGNsb3VkIGZyb20gJ3d4LXNlcnZlci1zZGsnO1xuaW1wb3J0ICogYXMgVGNiUm91dGVyIGZyb20gJ3RjYi1yb3V0ZXInO1xuaW1wb3J0IHsgZmluZCQgfSBmcm9tICcuL2ZpbmQnO1xuXG5jbG91ZC5pbml0KHtcbiAgICBlbnY6IHByb2Nlc3MuZW52LmNsb3VkXG59KTtcblxuY29uc3QgZGI6IERCLkRhdGFiYXNlID0gY2xvdWQuZGF0YWJhc2UoICk7XG5jb25zdCBfID0gZGIuY29tbWFuZDtcblxuLyoqXG4gKiBAZGVzY3JpcHRpb24g6KGM56iL5riF5Y2V5qih5Z2XXG4gKiAtLS0tLS0tLS0g5a2X5q61IC0tLS0tLS0tLS1cbiAqIHRpZFxuICogcGlkXG4gKiBzaWQgKCDlj6/kuLrnqbogKVxuICogb2lkcyBBcnJheVxuICogdWlkcyBBcnJheVxuICogYnV5X3N0YXR1cyAwLDEsMiDmnKrotK3kubDjgIHlt7LotK3kubDjgIHkubDkuI3lhahcbiAqIGJhc2Vfc3RhdHVzOiAwLDEg5pyq6LCD5pW077yM5bey6LCD5pW0XG4gKiBjcmVhdGVUaW1lXG4gKiB1cGRhdGVUaW1lXG4gKiAhIGFjaWQg5rS75YqoaWRcbiAqIGxhc3RBbGxvY2F0ZWQg5Ymp5L2Z5YiG6YWN6YePXG4gKiBwdXJjaGFzZSDph4fotK3mlbDph49cbiAqIGFkanVzdFByaWNlIOWIhumFjeeahOaVsOa4heWNleWUruS7t1xuICogYWRqdXN0R3JvdXBQcmljZSDliIbphY3nmoTmlbDmuIXljZXlm6LotK3ku7dcbiAqL1xuZXhwb3J0IGNvbnN0IG1haW4gPSBhc3luYyAoIGV2ZW50LCBjb250ZXh0ICkgPT4ge1xuXG4gICAgY29uc3QgYXBwID0gbmV3IFRjYlJvdXRlcih7IGV2ZW50IH0pO1xuXG4gICAgLyoqXG4gICAgICogQGRlc2NyaXB0aW9uXG4gICAgICog5Yik5pat6K+35rGC55qEc2lkICsgdGlkICsgcGlkICsgY291bnTmlbDnu4TvvIzov5Tlm57kuI3og73otK3kubDnmoTllYblk4HliJfooajvvIjmuIXljZXph4zpnaLkubDkuI3liLDjgIHkubDkuI3lhajvvInjgIHotKflhajkuI3otrPnmoTllYblk4HvvIjov5Tlm57mnIDmlrDotKflrZjvvIlcbiAgICAgKiAtLS0tLS0tLSDor7fmsYIgLS0tLS0tLS0tLVxuICAgICAqIHtcbiAgICAgKiEgICAgZnJvbT86ICdjYXJ0JyB8ICdidXknIHwgJ2N1c3RvbScgfCAnYWdlbnRzJyB8ICdzeXN0ZW0nXG4gICAgICogICAgIHRpZDogc3RyaW5nXG4gICAgICohICAgIG9wZW5pZD86IHN0cmluZyxcbiAgICAgKiAgICBsaXN0OiB7IFxuICAgICAqICAgICAgdGlkXG4gICAgICohICAgICBjaWQ/OiBzdHJpbmdcbiAgICAgICAgICAgIHNpZFxuICAgICAgICAgICAgcGlkXG4gICAgICAgICAgICBwcmljZVxuICAgICAgICAgICAgZ3JvdXBQcmljZVxuICAgICAgICAgICAgY291bnRcbiAgICAgKiEgICAgIGRlc2M/OiBzdHJpbmdcbiAgICAgICAgICAgIG5hbWUsXG4gICAgICAgICAgICBzdGFuZGVybmFtZVxuICAgICAgICAgICAgaW1nXG4gICAgICAgICAgICB0eXBlXG4gICAgICAgICAgICBhZGRyZXNzOiB7XG4gICAgICAgICAgICAgICBuYW1lLFxuICAgICAgICAgICAgICAgcGhvbmUsXG4gICAgICAgICAgICAgICBkZXRhaWwsXG4gICAgICAgICAgICAgICBwb3N0YWxjb2RlXG4gICAgICAgICAgICB9XG4gICAgICogICAgIH1bIF1cbiAgICAgKiB9XG4gICAgICogLS0tLS0tLS0g6L+U5ZueIC0tLS0tLS0tLS1cbiAgICAgKiB7XG4gICAgICogICAgICAqIOW3sui0reS5sCgg6aOO6Zmp5Y2VIClcbiAgICAgKiAgICAgIGhhc0JlZW5CdXk6IHtcbiAgICAgKiAgICAgICAgICB0aWQsIFxuICAgICAqICAgICAgICAgIHBpZCxcbiAgICAgKiAgICAgICAgICBzaWRcbiAgICAgKiAgICAgIH1bIF1cbiAgICAgKiAgICAgICog5Lmw5LiN5YiwXG4gICAgICogICAgICBjYW5ub3RCdXk6IHsgXG4gICAgICogICAgICAgICAgdGlkLCBcbiAgICAgKiAgICAgICAgICBwaWQsXG4gICAgICogICAgICAgICAgc2lkXG4gICAgICogICAgICB9WyBdXG4gICAgICogICAgICAqIOi0p+WtmOS4jei2s1xuICAgICAqICAgICAgIGxvd1N0b2NrOiB7IFxuICAgICAqICAgICAgICAgIHRpZCwgXG4gICAgICogICAgICAgICAgcGlkLFxuICAgICAqICAgICAgICAgIHNpZCxcbiAgICAgKiAgICAgICAgICBjb3VudCxcbiAgICAgKiAgICAgICAgICBzdG9ja1xuICAgICAqICAgICAgfVsgXVxuICAgICAqICAgICAgKiDlnovlj7flt7LooqvliKDpmaQgLyDllYblk4Hlt7LkuIvmnrZcbiAgICAgKiAgICAgIGhhc0JlZW5EZWxldGU6IHtcbiAgICAgKiAgICAgICAgICB0aWQsIFxuICAgICAqICAgICAgICAgIHBpZCxcbiAgICAgKiAgICAgICAgICBzaWRcbiAgICAgKiAgICAgIH1bIF0sXG4gICAgICogICAgICAqIOiuouWNleWPt+WIl+ihqFxuICAgICAqICAgICAgb3JkZXJzXG4gICAgICogfVxuICAgICAqL1xuICAgIGFwcC5yb3V0ZXIoJ2ZpbmRDYW5ub3RCdXknLCBhc3luYyggY3R4LCBuZXh0ICkgPT4ge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgY29uc29sZS5sb2coJz09PT09PT5maW5kQ2Fubm90QnV5JylcbiAgICAgICAgICAgIGNvbnN0IHsgdGlkLCBsaXN0IH0gPSBldmVudC5kYXRhO1xuICAgICAgICAgICAgY29uc3Qgb3BlbklkID0gZXZlbnQuZGF0YS5vcGVuSWQgfHwgZXZlbnQudXNlckluZm8ub3BlbklkO1xuXG4gICAgICAgICAgICBjb25zdCBnZXRFcnIgPSBtZXNzYWdlID0+ICh7XG4gICAgICAgICAgICAgICAgbWVzc2FnZSwgXG4gICAgICAgICAgICAgICAgc3RhdHVzOiA1MDBcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBpZiAoICF0aWQgKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGN0eC5ib2R5ID0gZ2V0RXJyKCfml6DmlYjooYznqIsnKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8g5p+l6K+i6KGM56iL5piv5ZCm6L+Y5pyJ5pWIXG4gICAgICAgICAgICBjb25zdCB0cmlwJCA9IGF3YWl0IGRiLmNvbGxlY3Rpb24oJ3RyaXAnKVxuICAgICAgICAgICAgICAgIC5kb2MoIFN0cmluZyggdGlkICkpXG4gICAgICAgICAgICAgICAgLmdldCggKTtcblxuICAgICAgICAgICAgaWYgKCB0cmlwJC5kYXRhLmlzQ2xvc2VkIHx8IG5ldyBEYXRlKCApLmdldFRpbWUoICkgPiB0cmlwJC5kYXRhLmVuZF9kYXRlICkge1xuICAgICAgICAgICAgICAgIHJldHVybiBjdHguYm9keSA9IGdldEVycign5pqC5peg6LSt54mp6KGM56iL772eJyk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIOS4jeiDvei0reS5sOeahOWVhuWTgeWIl+ihqO+8iOa4heWNlemHjOmdouS5sOS4jeWFqO+8iVxuICAgICAgICAgICAgLy8gY29uc3QgZmluZGluZ3MkOiBhbnkgPSBhd2FpdCBQcm9taXNlLmFsbCggZXZlbnQuZGF0YS5saXN0Lm1hcCggaSA9PiB7XG4gICAgICAgICAgICAvLyAgICAgcmV0dXJuIGZpbmQkKHtcbiAgICAgICAgICAgIC8vICAgICAgICAgdGlkOiBpLnRpZCxcbiAgICAgICAgICAgIC8vICAgICAgICAgcGlkOiBpLnBpZCxcbiAgICAgICAgICAgIC8vICAgICAgICAgc2lkOiBpLnNpZCxcbiAgICAgICAgICAgIC8vICAgICAgICAgYnV5X3N0YXR1czogJzInXG4gICAgICAgICAgICAvLyAgICAgfSwgZGIsIGN0eCApXG4gICAgICAgICAgICAvLyB9KSlcbiAgICAgICAgICAgIGNvbnN0IGZpbmRpbmdzJCA9IFsgXTtcblxuICAgICAgICAgICAgLy8gaWYgKCBmaW5kaW5ncyQuc29tZSggeCA9PiB4LnN0YXR1cyAhPT0gMjAwICkpIHtcbiAgICAgICAgICAgIC8vICAgICB0aHJvdyAn5p+l6K+i6LSt54mp5riF5Y2V6ZSZ6K+vJztcbiAgICAgICAgICAgIC8vIH1cblxuICAgICAgICAgICAgLy8g5bey5a6M5oiQ6LSt5Lmw55qE5ZWG5ZOB5YiX6KGoXG4gICAgICAgICAgICAvLyBjb25zdCBoYXNCZWVuQnV5JDogYW55ID0gYXdhaXQgUHJvbWlzZS5hbGwoIGV2ZW50LmRhdGEubGlzdC5tYXAoIGkgPT4ge1xuICAgICAgICAgICAgLy8gICAgIHJldHVybiBmaW5kJCh7XG4gICAgICAgICAgICAvLyAgICAgICAgIHRpZDogaS50aWQsXG4gICAgICAgICAgICAvLyAgICAgICAgIHBpZDogaS5waWQsXG4gICAgICAgICAgICAvLyAgICAgICAgIHNpZDogaS5zaWQsXG4gICAgICAgICAgICAvLyAgICAgICAgIGJ1eV9zdGF0dXM6ICcxJ1xuICAgICAgICAgICAgLy8gICAgIH0sIGRiLCBjdHggKVxuICAgICAgICAgICAgLy8gfSkpO1xuICAgICAgICAgICAgY29uc3QgaGFzQmVlbkJ1eSQgPSBbIF07XG5cbiAgICAgICAgICAgIC8vIOafpeivouWVhuWTgeivpuaDheOAgeaIluiAheWei+WPt+ivpuaDhVxuICAgICAgICAgICAgY29uc3QgZ29vZERldGFpbHMkOiBhbnkgPSBhd2FpdCBQcm9taXNlLmFsbCggZXZlbnQuZGF0YS5saXN0Lm1hcCggaSA9PiB7XG5cbiAgICAgICAgICAgICAgICBpZiAoICEhaS5zaWQgKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBkYi5jb2xsZWN0aW9uKCdzdGFuZGFyZHMnKVxuICAgICAgICAgICAgICAgICAgICAgICAgLndoZXJlKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBfaWQ6IGkuc2lkXG4gICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAgICAgLmdldCggKVxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBkYi5jb2xsZWN0aW9uKCdnb29kcycpXG4gICAgICAgICAgICAgICAgICAgICAgICAud2hlcmUoe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIF9pZDogaS5waWRcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgICAgICAuZ2V0KCApXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSkpO1xuXG4gICAgICAgICAgICAvKiog5Z6L5Y+35omA5bGe5ZWG5ZOBICovXG4gICAgICAgICAgICBjb25zdCBiZWxvbmdHb29kSWRzID0gQXJyYXkuZnJvbSggXG4gICAgICAgICAgICAgICAgbmV3IFNldChcbiAgICAgICAgICAgICAgICAgICAgZXZlbnQuZGF0YS5saXN0XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyAuZmlsdGVyKCBpID0+ICEhaS5zaWQgKVxuICAgICAgICAgICAgICAgICAgICAgICAgLm1hcCggbyA9PiBvLnBpZCApXG4gICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgKTtcblxuICAgICAgICAgICAgY29uc3QgYmVsb25nR29vZHMkID0gYXdhaXQgUHJvbWlzZS5hbGwoIGJlbG9uZ0dvb2RJZHMubWFwKCBwaWQgPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiBkYi5jb2xsZWN0aW9uKCdnb29kcycpXG4gICAgICAgICAgICAgICAgICAgIC5kb2MoIFN0cmluZyggcGlkICkpXG4gICAgICAgICAgICAgICAgICAgIC5nZXQoICk7XG4gICAgICAgICAgICB9KSk7XG4gICAgICAgICAgIFxuICAgICAgICAgICAgY29uc3QgZ29vZHMgPSBnb29kRGV0YWlscyQubWFwKCB4ID0+IHguZGF0YVsgMCBdKS5maWx0ZXIoIHkgPT4gISF5ICkuZmlsdGVyKCB6ID0+ICF6LnBpZCApO1xuICAgICAgICAgICAgY29uc3Qgc3RhbmRhcmRzID0gZ29vZERldGFpbHMkLm1hcCggeCA9PiB4LmRhdGFbIDAgXSkuZmlsdGVyKCB5ID0+ICEheSApLmZpbHRlciggeiA9PiAhIXoucGlkICk7XG4gICAgICAgICAgICBjb25zdCBiZWxvbmdHb29kcyA9IGJlbG9uZ0dvb2RzJC5tYXAoIHggPT4geC5kYXRhICk7XG5cbiAgICAgICAgICAgIC8vIOmZkOi0rVxuICAgICAgICAgICAgbGV0IGhhc0xpbWl0R29vZDogYW55ID0gWyBdO1xuXG4gICAgICAgICAgICAvLyDlupPlrZjkuI3otrNcbiAgICAgICAgICAgIGxldCBsb3dTdG9jazogYW55ID0gWyBdO1xuXG4gICAgICAgICAgICAvLyDooqvliKDpmaRcbiAgICAgICAgICAgIGxldCBoYXNCZWVuRGVsZXRlOiBhbnkgPSBbIF07XG5cbiAgICAgICAgICAgIC8vIOS5sOS4jeWIsFxuICAgICAgICAgICAgLy8gY29uc3QgY2Fubm90QnV5ID0gZmluZGluZ3MkLm1hcCggeCA9PiB4LmRhdGFbIDAgXSkuZmlsdGVyKCB5ID0+ICEheSApO1xuICAgICAgICAgICAgY29uc3QgY2Fubm90QnV5ID0gWyBdO1xuXG4gICAgICAgICAgICAvLyDlt7Lnu4/ooqvotK3kubDkuobvvIjpo47pmanljZXvvIlcbiAgICAgICAgICAgIC8vIGNvbnN0IGhhc0JlZW5CdXkgPSBoYXNCZWVuQnV5JC5tYXAoIHggPT4geC5kYXRhWyAwIF0pLmZpbHRlciggeSA9PiAhIXkgKVxuICAgICAgICAgICAgY29uc3QgaGFzQmVlbkJ1eSA9IFsgXTtcblxuICAgICAgICAgICAgZXZlbnQuZGF0YS5saXN0Lm1hcCggaSA9PiB7XG4gICAgICAgICAgICAgICAgLy8g5Z6L5Y+3IC0g6K6h566X5bey6KKr5Yig6Zmk44CB5bqT5a2Y5LiN6Laz44CB5Li75L2T5pys6Lqr6KKr5LiL5p62L+WIoOmZpFxuICAgICAgICAgICAgICAgIGlmICggISFpLnNpZCApIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgYmVsb25nR29vZCA9IGJlbG9uZ0dvb2RzLmZpbmQoIHggPT4geC5faWQgPT09IGkucGlkICk7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHN0YW5kYXJkID0gc3RhbmRhcmRzLmZpbmQoIHggPT4geC5faWQgPT09IGkuc2lkICYmIHgucGlkID09PSBpLnBpZCApO1xuXG4gICAgICAgICAgICAgICAgICAgIC8vIOWei+WPt+acrOi6q+iiq+WIoOmZpOOAgeS4u+S9k+acrOi6q+iiq+S4i+aeti/liKDpmaRcbiAgICAgICAgICAgICAgICAgICAgaWYgKCAhc3RhbmRhcmQgfHwgKCAhIXN0YW5kYXJkICYmIHN0YW5kYXJkLmlzRGVsZXRlICkgfHwgKCAhIWJlbG9uZ0dvb2QgJiYgIWJlbG9uZ0dvb2QudmlzaWFibGUgKSB8fCAoICEhYmVsb25nR29vZCAmJiBiZWxvbmdHb29kLmlzRGVsZXRlICkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGhhc0JlZW5EZWxldGUucHVzaCggaSApO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKCBzdGFuZGFyZC5zdG9jayAhPT0gdW5kZWZpbmVkICYmICBzdGFuZGFyZC5zdG9jayA8IGkuY291bnQgKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBsb3dTdG9jay5wdXNoKCBPYmplY3QuYXNzaWduKHsgfSwgaSwge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0b2NrOiBzdGFuZGFyZC5zdG9jayxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBnb29kTmFtZTogaS5uYW1lLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0YW5kZXJOYW1lOiBpLnN0YW5kZXJuYW1lXG4gICAgICAgICAgICAgICAgICAgICAgICB9KSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAvLyDkuLvkvZPllYblk4EgLSDorqHnrpflt7LooqvliKDpmaTjgIHlupPlrZjkuI3otrNcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBnb29kID0gZ29vZHMuZmluZCggeCA9PiB4Ll9pZCA9PT0gaS5waWQgKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCAhZ29vZCB8fCAoICEhZ29vZCAmJiAhZ29vZC52aXNpYWJsZSApIHx8ICggISFnb29kICYmIGdvb2QuaXNEZWxldGUgKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaGFzQmVlbkRlbGV0ZS5wdXNoKCBpIClcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmICggZ29vZC5zdG9jayAhPT0gdW5kZWZpbmVkICYmICBnb29kLnN0b2NrIDwgaS5jb3VudCApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxvd1N0b2NrLnB1c2goIE9iamVjdC5hc3NpZ24oeyB9LCBpLCB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc3RvY2s6IGdvb2Quc3RvY2ssXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZ29vZE5hbWU6IGkubmFtZVxuICAgICAgICAgICAgICAgICAgICAgICAgfSkpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG5cblxuICAgICAgICAgICAgLy8g5p+l6K+i6ZmQ6LStXG4gICAgICAgICAgICBjb25zdCBsaW1pdEdvb2RzID0gYmVsb25nR29vZHMuZmlsdGVyKCB4ID0+ICEheC5saW1pdCApO1xuXG4gICAgICAgICAgICBhd2FpdCBQcm9taXNlLmFsbCggbGltaXRHb29kcy5tYXAoIGFzeW5jIGdvb2QgPT4ge1xuXG4gICAgICAgICAgICAgICAgY29uc3Qgb3JkZXJzID0gYXdhaXQgZGIuY29sbGVjdGlvbignb3JkZXInKVxuICAgICAgICAgICAgICAgICAgICAud2hlcmUoe1xuICAgICAgICAgICAgICAgICAgICAgICAgdGlkLFxuICAgICAgICAgICAgICAgICAgICAgICAgcGlkOiBnb29kLl9pZCxcbiAgICAgICAgICAgICAgICAgICAgICAgIG9wZW5pZDogb3BlbklkLFxuICAgICAgICAgICAgICAgICAgICAgICAgcGF5X3N0YXR1czogXy5vciggXy5lcSgnMScpLCBfLmVxKCcyJykpXG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgIC5nZXQoICk7XG5cbiAgICAgICAgICAgICAgICBjb25zdCBoYXNCZWVuQnV5Q291bnQgPSBvcmRlcnMuZGF0YS5yZWR1Y2UoKCB4LCB5ICkgPT4ge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4geCArIHkuY291bnRcbiAgICAgICAgICAgICAgICB9LCAwICk7XG5cbiAgICAgICAgICAgICAgICBjb25zdCB0aGlzVHJpcEJ1eUNvdW50ID0gZXZlbnQuZGF0YS5saXN0XG4gICAgICAgICAgICAgICAgICAgIC5maWx0ZXIoIHggPT4geC5waWQgPT09IGdvb2QuX2lkIClcbiAgICAgICAgICAgICAgICAgICAgLnJlZHVjZSgoIHgsIHkgKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4geCArIHkuY291bnRcbiAgICAgICAgICAgICAgICAgICAgfSwgMCApO1xuICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICBpZiAoIHRoaXNUcmlwQnV5Q291bnQgKyBoYXNCZWVuQnV5Q291bnQgPiBnb29kLmxpbWl0ICkge1xuICAgICAgICAgICAgICAgICAgICBoYXNMaW1pdEdvb2QucHVzaCggZ29vZCApO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pKTtcbiAgICAgICAgICAgIFxuXG4gICAgICAgICAgICBsZXQgb3JkZXJzID0gWyBdO1xuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiDlpoLmnpzlj6/ku6XotK3kubBcbiAgICAgICAgICAgICAqICEg5om56YeP5Yib5bu66aKE5LuY6K6i5Y2VXG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIGlmICggaGFzTGltaXRHb29kLmxlbmd0aCA9PT0gMCAmJiBsb3dTdG9jay5sZW5ndGggPT09IDAgJiYgY2Fubm90QnV5Lmxlbmd0aCA9PT0gMCAmJiBoYXNCZWVuRGVsZXRlLmxlbmd0aCA9PT0gMCApIHtcblxuICAgICAgICAgICAgICAgIGNvbnN0IHJlcURhdGEgPSB7XG4gICAgICAgICAgICAgICAgICAgIHRpZCxcbiAgICAgICAgICAgICAgICAgICAgb3BlbklkLFxuICAgICAgICAgICAgICAgICAgICBmcm9tOiBldmVudC5kYXRhLmZyb20gfHwgJ3N5c3RlbScsXG4gICAgICAgICAgICAgICAgICAgIG9yZGVyczogZXZlbnQuZGF0YS5saXN0XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgY29uc3QgY3JlYXRlT3JkZXIkID0gYXdhaXQgY2xvdWQuY2FsbEZ1bmN0aW9uKHtcbiAgICAgICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgICAgICAgZGF0YTogcmVxRGF0YSxcbiAgICAgICAgICAgICAgICAgICAgICAgICR1cmw6ICdjcmVhdGUnXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIG5hbWU6ICdvcmRlcidcbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgIGlmICggY3JlYXRlT3JkZXIkLnJlc3VsdC5zdGF0dXMgIT09IDIwMCApIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGN0eC5ib2R5ID0ge1xuICAgICAgICAgICAgICAgICAgICAgICAgc3RhdHVzOiA1MDAsXG4gICAgICAgICAgICAgICAgICAgICAgICBtZXNzYWdlOiAn5Yib5bu66aKE5LuY6K6i5Y2V5aSx6LSl77yBJ1xuICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBvcmRlcnMgPSBjcmVhdGVPcmRlciQucmVzdWx0LmRhdGE7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiBjdHguYm9keSA9IHtcbiAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICAgIG9yZGVycyxcbiAgICAgICAgICAgICAgICAgICAgbG93U3RvY2ssXG4gICAgICAgICAgICAgICAgICAgIGNhbm5vdEJ1eSxcbiAgICAgICAgICAgICAgICAgICAgaGFzTGltaXRHb29kLFxuICAgICAgICAgICAgICAgICAgICBoYXNCZWVuQnV5LFxuICAgICAgICAgICAgICAgICAgICBoYXNCZWVuRGVsZXRlLFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgc3RhdHVzOiAyMDBcbiAgICAgICAgICAgIH1cblxuICAgICAgICB9IGNhdGNoICggZSApIHtcbiAgICAgXG4gICAgICAgICAgICByZXR1cm4gY3R4LmJvZHkgPSB7XG4gICAgICAgICAgICAgICAgc3RhdHVzOiA1MDAsXG4gICAgICAgICAgICAgICAgbWVzc2FnZTogZVxuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgLyoqXG4gICAgICogQGRlc2NyaXB0aW9uXG4gICAgICog55Sx6K6i5Y2V5Yib5bu66LSt54mp5riF5Y2VXG4gICAgICogbGlzdDoge1xuICAgICAqICAgIHRpZCxcbiAgICAgKiAgICBwaWQsXG4gICAgICogICAgc2lkLFxuICAgICAqICAgIG9pZCxcbiAgICAgKiAgICBwcmljZSxcbiAgICAgKiAgICBncm91cFByaWNlLFxuICAgICAqISAgIGFjaWRcbiAgICAgKiB9WyBdXG4gICAgICovXG4gICAgYXBwLnJvdXRlcignY3JlYXRlJywgYXN5bmMoIGN0eCwgbmV4dCApID0+IHtcbiAgICAgICAgdHJ5IHtcblxuICAgICAgICAgICAgY29uc3QgeyBsaXN0LCBvcGVuSWQgfSA9IGV2ZW50LmRhdGE7XG4gXG4gICAgICAgICAgICBhd2FpdCBQcm9taXNlLmFsbCggbGlzdC5tYXAoIGFzeW5jIG9yZGVyTWV0YSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3QgeyB0aWQsIHBpZCwgc2lkLCBvaWQsIHByaWNlLCBncm91cFByaWNlLCBhY2lkIH0gPSBvcmRlck1ldGE7XG4gICAgICAgICAgICAgICAgbGV0IHF1ZXJ5ID0ge1xuICAgICAgICAgICAgICAgICAgICB0aWQsXG4gICAgICAgICAgICAgICAgICAgIHBpZFxuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgaWYgKCAhIXNpZCApIHtcbiAgICAgICAgICAgICAgICAgICAgcXVlcnlbJ3NpZCddID0gc2lkO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIC8vIOaPkuWFpea0u+WKqOeahOafpeivouadoeS7tlxuICAgICAgICAgICAgICAgIGlmICggISFhY2lkICkge1xuICAgICAgICAgICAgICAgICAgICBxdWVyeSA9IE9iamVjdC5hc3NpZ24oeyB9LCBxdWVyeSwge1xuICAgICAgICAgICAgICAgICAgICAgICAgYWNpZFxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBjb25zdCBmaW5kJCA9IGF3YWl0IGRiLmNvbGxlY3Rpb24oJ3Nob3BwaW5nLWxpc3QnKVxuICAgICAgICAgICAgICAgICAgICAud2hlcmUoIHF1ZXJ5IClcbiAgICAgICAgICAgICAgICAgICAgLmdldCggKTtcblxuICAgICAgICAgICAgICAgIGlmICggZmluZCQuZGF0YS5sZW5ndGggPT09IDAgKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgY29uc3QgbWV0YSA9IE9iamVjdC5hc3NpZ24oeyB9LCBxdWVyeSx7XG4gICAgICAgICAgICAgICAgICAgICAgICBhY2lkOiBhY2lkIHx8IHVuZGVmaW5lZFxuICAgICAgICAgICAgICAgICAgICB9LHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG9pZHM6IFsgb2lkIF0sXG4gICAgICAgICAgICAgICAgICAgICAgICB1aWRzOiBbIG9wZW5JZCBdLFxuICAgICAgICAgICAgICAgICAgICAgICAgcHVyY2hhc2U6IDAsXG4gICAgICAgICAgICAgICAgICAgICAgICBidXlfc3RhdHVzOiAnMCcsXG4gICAgICAgICAgICAgICAgICAgICAgICBiYXNlX3N0YXR1czogJzAnLFxuICAgICAgICAgICAgICAgICAgICAgICAgYWRqdXN0UHJpY2U6IHByaWNlLFxuICAgICAgICAgICAgICAgICAgICAgICAgYWRqdXN0R3JvdXBQcmljZTogZ3JvdXBQcmljZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGNyZWF0ZVRpbWU6IG5ldyBEYXRlKCApLmdldFRpbWUoIClcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgIFxuICAgICAgICAgICAgICAgICAgICBjb25zdCBjcmVhZXQkID0gYXdhaXQgZGIuY29sbGVjdGlvbignc2hvcHBpbmctbGlzdCcpXG4gICAgICAgICAgICAgICAgICAgICAgICAuYWRkKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhOiBtZXRhXG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG5cbiAgICAgICAgICAgICAgICAvLyDmm7TmlrDmj5LlhaVcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBsZXQgbWV0YVNob3BwaW5nTGlzdCA9IGZpbmQkLmRhdGFbIDAgXTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCAhbWV0YVNob3BwaW5nTGlzdC5vaWRzLmZpbmQoIHggPT4geCA9PT0gb2lkICkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGxhc3RPaWRzID0gbWV0YVNob3BwaW5nTGlzdC5vaWRzO1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgbGFzdFVpZHMgPSBtZXRhU2hvcHBpbmdMaXN0LnVpZHM7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIOaPkuWFpeWIsOWktOmDqO+8jOacgOaWsOeahOW3suaUr+S7mOiuouWNleWwseWcqOS4iumdolxuICAgICAgICAgICAgICAgICAgICAgICAgbGFzdE9pZHMudW5zaGlmdCggb2lkICk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICggIWxhc3RVaWRzLmZpbmQoIHggPT4geCA9PT0gb3BlbklkICkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsYXN0VWlkcy51bnNoaWZ0KCBvcGVuSWQgKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgdXBkYXRlJCA9IGF3YWl0IGRiLmNvbGxlY3Rpb24oJ3Nob3BwaW5nLWxpc3QnKS5kb2MoIFN0cmluZyggZmluZCQuZGF0YVsgMCBdLl9pZCApKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC51cGRhdGUoe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvaWRzOiBsYXN0T2lkcyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHVpZHM6IGxhc3RVaWRzLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdXBkYXRlVGltZTogbmV3IERhdGUoICkuZ2V0VGltZSggKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB9KSk7XG5cbiAgICAgICAgICAgIHJldHVybiBjdHguYm9keSA9IHtcbiAgICAgICAgICAgICAgICBzdGF0dXM6IDIwMFxuICAgICAgICAgICAgfVxuXG4gICAgICAgIH0gY2F0Y2ggKCBlICkgeyByZXR1cm4gY3R4LmJvZHkgPSB7IHN0YXR1czogNTAwIH19XG4gICAgfSk7XG5cbiAgICAvKipcbiAgICAgKiBAZGVzY3JpcHRpb24gXG4gICAgICoge1xuICAgICAqICAgICB0aWQsIFxuICAgICAqICAgICBuZWVkT3JkZXJzIOaYr+WQpumcgOimgei/lOWbnuiuouWNlVxuICAgICAqIH1cbiAgICAgKiDooYznqIvnmoTotK3nianmuIXljZXvvIznlKjkuo7osIPmlbTllYblk4Hku7fmoLzjgIHotK3kubDmlbDph49cbiAgICAgKi9cbiAgICBhcHAucm91dGVyKCdsaXN0JywgYXN5bmMoIGN0eCwgbmV4dCApID0+IHtcbiAgICAgICAgdHJ5IHtcblxuICAgICAgICAgICAgbGV0IG9yZGVycyQ6IGFueSA9IFsgXTtcblxuICAgICAgICAgICAgY29uc3QgeyB0aWQsIG5lZWRPcmRlcnMsICB9ID0gZXZlbnQuZGF0YTtcbiAgICAgICAgICAgIGNvbnN0IG9wZW5pZCA9IGV2ZW50LmRhdGEub3BlbklkIHx8IGV2ZW50LnVzZXJJbmZvLm9wZW5JZDtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgXG4gICAgICAgICAgICAvLyDmi7/liLDooYznqIvkuIvmiYDmnInnmoTotK3nianmuIXljZVcbiAgICAgICAgICAgIGNvbnN0IGxpc3RzJCA9IGF3YWl0IGRiLmNvbGxlY3Rpb24oJ3Nob3BwaW5nLWxpc3QnKVxuICAgICAgICAgICAgICAgIC53aGVyZSh7XG4gICAgICAgICAgICAgICAgICAgIHRpZFxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLmdldCggKTtcbiAgICAgICAgICAgXG4gICAgICAgICAgICAvLyDmn6Xor6Lmr4/mnaHmuIXljZXlupXkuIvnmoTmr4/kuKpvcmRlcuivpuaDhe+8jOi/memHjOeahOavj+S4qm9yZGVy6YO95piv5bey5LuY6K6i6YeR55qEXG4gICAgICAgICAgICBpZiAoIG5lZWRPcmRlcnMgIT09IGZhbHNlwqApIHtcbiAgICAgICAgICAgICAgICBvcmRlcnMkID0gYXdhaXQgUHJvbWlzZS5hbGwoIGxpc3RzJC5kYXRhLm1hcCggbGlzdCA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBQcm9taXNlLmFsbCggbGlzdC5vaWRzLm1hcCggYXN5bmMgb2lkID0+IHtcbiAgICBcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IG9yZGVyJCA9IGF3YWl0IGRiLmNvbGxlY3Rpb24oJ29yZGVyJykuZG9jKCBvaWQgKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5nZXQoICk7XG4gICAgXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCB1c2VyJCA9IGF3YWl0IGRiLmNvbGxlY3Rpb24oJ3VzZXInKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC53aGVyZSh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9wZW5pZDogb3JkZXIkLmRhdGEub3BlbmlkXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAuZ2V0KCApO1xuICAgIFxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIE9iamVjdC5hc3NpZ24oeyB9LCBvcmRlciQuZGF0YSwge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHVzZXI6IHVzZXIkLmRhdGFbIDAgXVxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIH0pKTtcbiAgICAgICAgICAgICAgICB9KSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIOafpeivouavj+adoea4heWNleW6leS4i+avj+S4quWVhuWTgeeahOivpuaDhVxuICAgICAgICAgICAgY29uc3QgZ29vZHMkOiBhbnkgPSBhd2FpdCBQcm9taXNlLmFsbCggbGlzdHMkLmRhdGEubWFwKCBhc3luYyBsaXN0ID0+IHtcblxuICAgICAgICAgICAgICAgIGNvbnN0IHsgcGlkLCBzaWQgfSA9IGxpc3Q7XG4gICAgICAgICAgICAgICAgY29uc3QgY29sbGVjdGlvbk5hbWUgPSAhIXNpZCA/ICdzdGFuZGFyZHMnIDogJ2dvb2RzJztcblxuICAgICAgICAgICAgICAgIC8vIOWei+WPt1xuICAgICAgICAgICAgICAgIGxldCBzdGFuZGFyJDogYW55ID0gbnVsbDtcblxuICAgICAgICAgICAgICAgIC8vIOWVhuWTgVxuICAgICAgICAgICAgICAgIGNvbnN0IGdvb2QkID0gYXdhaXQgZGIuY29sbGVjdGlvbignZ29vZHMnKVxuICAgICAgICAgICAgICAgICAgICAuZG9jKCBwaWQgKVxuICAgICAgICAgICAgICAgICAgICAuZ2V0KCApO1xuXG4gICAgICAgICAgICAgICAgaWYgKCAhIXNpZCApIHtcbiAgICAgICAgICAgICAgICAgICAgc3RhbmRhciQgPSBhd2FpdCBkYi5jb2xsZWN0aW9uKCdzdGFuZGFyZHMnKVxuICAgICAgICAgICAgICAgICAgICAgICAgLmRvYyggc2lkIClcbiAgICAgICAgICAgICAgICAgICAgICAgIC5nZXQoICk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICAgICAgdGFnOiBnb29kJC5kYXRhLnRhZyxcbiAgICAgICAgICAgICAgICAgICAgdGl0bGU6IGdvb2QkLmRhdGEudGl0bGUsXG4gICAgICAgICAgICAgICAgICAgIG5hbWU6IHN0YW5kYXIkID8gc3RhbmRhciQuZGF0YS5uYW1lIDogJycsXG4gICAgICAgICAgICAgICAgICAgIHByaWNlOiBzdGFuZGFyJCA/IHN0YW5kYXIkLmRhdGEucHJpY2UgOiBnb29kJC5kYXRhLnByaWNlLFxuICAgICAgICAgICAgICAgICAgICBpbWc6IHN0YW5kYXIkID8gc3RhbmRhciQuZGF0YS5pbWcgOiBnb29kJC5kYXRhLmltZ1sgMCBdLFxuICAgICAgICAgICAgICAgICAgICBncm91cFByaWNlOiBzdGFuZGFyJCA/IHN0YW5kYXIkLmRhdGEuZ3JvdXBQcmljZSA6IGdvb2QkLmRhdGEuZ3JvdXBQcmljZSxcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KSk7XG5cbiAgICAgICAgICAgIC8vIOafpeivoua4heWNleWvueW6lOeahOa0u+WKqOivpuaDhVxuICAgICAgICAgICAgY29uc3QgYWN0aXZpdGllcyQ6IGFueSA9IGF3YWl0IFByb21pc2UuYWxsKCBsaXN0cyQuZGF0YS5tYXAoIGFzeW5jIGxpc3QgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IHsgYWNpZCB9ID0gbGlzdDtcbiAgICAgICAgICAgICAgICBpZiAoICFhY2lkICkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgYWNfcHJpY2U6IG51bGwsXG4gICAgICAgICAgICAgICAgICAgICAgICBhY19ncm91cFByaWNlOiBudWxsXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBtZXRhID0gYXdhaXQgZGIuY29sbGVjdGlvbignYWN0aXZpdHknKVxuICAgICAgICAgICAgICAgICAgICAgICAgLmRvYyggU3RyaW5nKCBhY2lkICkpXG4gICAgICAgICAgICAgICAgICAgICAgICAuZ2V0KCApO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgYWNfcHJpY2U6IG1ldGEuZGF0YS5hY19wcmljZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGFjX2dyb3VwUHJpY2U6IG1ldGEuZGF0YS5hY19ncm91cFByaWNlLFxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSkpO1xuXG4gICAgICAgICAgICBjb25zdCBsaXN0ID0gbGlzdHMkLmRhdGEubWFwKCggbCwgayApID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCB7IGFjX2dyb3VwUHJpY2UsIGFjX3ByaWNlIH0gPSBhY3Rpdml0aWVzJFsgayBdO1xuICAgICAgICAgICAgICAgIGNvbnN0IHsgaW1nLCBwcmljZSwgZ3JvdXBQcmljZSwgdGl0bGUsIG5hbWUsIHRhZyB9ID0gZ29vZHMkWyBrIF07XG4gICAgICAgICAgICAgICAgbGV0IG1ldGEgPSBPYmplY3QuYXNzaWduKHsgfSwgbCwge1xuICAgICAgICAgICAgICAgICAgICB0YWcsXG4gICAgICAgICAgICAgICAgICAgIGltZyxcbiAgICAgICAgICAgICAgICAgICAgcHJpY2UsXG4gICAgICAgICAgICAgICAgICAgIGdyb3VwUHJpY2UsXG4gICAgICAgICAgICAgICAgICAgIGdvb2ROYW1lOiB0aXRsZSxcbiAgICAgICAgICAgICAgICAgICAgc3RhbmRhck5hbWU6IG5hbWUsXG4gICAgICAgICAgICAgICAgICAgIGFjX2dyb3VwUHJpY2UsXG4gICAgICAgICAgICAgICAgICAgIGFjX3ByaWNlXG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICBpZiAoIG5lZWRPcmRlcnMgIT09IGZhbHNlICkge1xuICAgICAgICAgICAgICAgICAgICBtZXRhID0gT2JqZWN0LmFzc2lnbih7IH0sIG1ldGEsIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG9yZGVyOiBvcmRlcnMkWyBrIF0sXG4gICAgICAgICAgICAgICAgICAgICAgICB0b3RhbDogb3JkZXJzJFsgayBdLnJlZHVjZSgoIHgsIHkgKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHggKyB5LmNvdW50O1xuICAgICAgICAgICAgICAgICAgICAgICAgfSwgMCApXG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgcmV0dXJuIG1ldGE7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgcmV0dXJuIGN0eC5ib2R5ID0ge1xuICAgICAgICAgICAgICAgIHN0YXR1czogMjAwLFxuICAgICAgICAgICAgICAgIGRhdGE6IGxpc3QsXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfSBjYXRjaCAoIGUgKSB7IHJldHVybiBjdHguYm9keSA9IHsgc3RhdHVzOiA1MDAgfTt9XG4gICAgfSlcblxuICAgIC8qKlxuICAgICAqIOi0reeJqea4heWNleiwg+aVtFxuICAgICAqIC0tLS0tLS0tIOivt+axglxuICAgICAqIHtcbiAgICAgKiAgICBzaG9wcGluZ0lkLCBhZGp1c3RQcmljZSwgcHVyY2hhc2UsIGFkanVzdEdyb3VwUHJpY2VcbiAgICAgKiB9XG4gICAgICovXG4gICAgYXBwLnJvdXRlcignYWRqdXN0JywgYXN5bmMoIGN0eCwgbmV4dCApID0+IHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgY29uc3QgeyBzaG9wcGluZ0lkLCBhZGp1c3RQcmljZSwgYWRqdXN0R3JvdXBQcmljZSB9ID0gZXZlbnQuZGF0YTtcblxuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiDmuIXljZXvvIzlhYjmi7/liLDorqLljZXph4fotK3mgLvmlbBcbiAgICAgICAgICAgICAqIOmaj+WQjuabtOaWsO+8mumHh+i0remHj+OAgea4heWNleWUruS7t+OAgea4heWNleWboui0reS7t+OAgWJhc2Vfc3RhdHVz44CBYnV5X3N0YXR1c1xuICAgICAgICAgICAgICovXG4gICAgICAgICAgICBjb25zdCBzaG9wcGluZyQgPSBhd2FpdCBkYi5jb2xsZWN0aW9uKCdzaG9wcGluZy1saXN0JylcbiAgICAgICAgICAgICAgICAuZG9jKCBzaG9wcGluZ0lkIClcbiAgICAgICAgICAgICAgICAuZ2V0KCApO1xuICAgXG4gICAgICAgICAgICBjb25zb2xlLmxvZygnMTExMTExJywgc2hvcHBpbmckICk7XG5cbiAgICAgICAgICAgIGNvbnN0IG9yZGVycyQgPSBhd2FpdCBQcm9taXNlLmFsbCggc2hvcHBpbmckLmRhdGEub2lkcy5tYXAoIG9pZCA9PiB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGRiLmNvbGxlY3Rpb24oJ29yZGVyJylcbiAgICAgICAgICAgICAgICAgICAgLmRvYyggb2lkIClcbiAgICAgICAgICAgICAgICAgICAgLmdldCggKTtcbiAgICAgICAgICAgIH0pKTtcblxuICAgICAgICAgICAgY29uc29sZS5sb2coJzIyMjIyMjInLCBvcmRlcnMkICk7XG5cbiAgICAgICAgICAgIC8vIOWJqeS9meWIhumFjemHj1xuICAgICAgICAgICAgbGV0IGxhc3RBbGxvY2F0ZWQgPSAwO1xuXG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIOaAu+WIhumFjemHj1xuICAgICAgICAgICAgICovXG4gICAgICAgICAgICBsZXQgcHVyY2hhc2UgPSBldmVudC5kYXRhLnB1cmNoYXNlO1xuXG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqICEg5Lyg5YWl5YiG6YWN6YeP5LiN6IO95bCR5LqO44CC5bey5a6M5oiQ5YiG6YWN6K6i5Y2V55qE5pWw6aKd5LmL5ZKMXG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIGNvbnN0IGZpbmlzaEFkanVzdE9yZGVycyA9IG9yZGVycyRcbiAgICAgICAgICAgICAgICAubWFwKCggeDogYW55ICkgPT4geC5kYXRhIClcbiAgICAgICAgICAgICAgICAuZmlsdGVyKCBvID0+IG8uYmFzZV9zdGF0dXMgPT09ICcyJyApO1xuXG4gICAgICAgICAgICBjb25zb2xlLmxvZygnMzMzMzMzJywgZmluaXNoQWRqdXN0T3JkZXJzKTtcblxuICAgICAgICAgICAgLy8g5bey5YiG6YWN6YePXG4gICAgICAgICAgICBjb25zdCBoYXNCZWVuQWRqdXN0ID0gZmluaXNoQWRqdXN0T3JkZXJzLnJlZHVjZSgoIHgsIHkgKSA9PiB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHggKyB5LmFsbG9jYXRlZENvdW50O1xuICAgICAgICAgICAgfSwgMCApO1xuXG4gICAgICAgICAgICBjb25zb2xlLmxvZygnNDQ0NDQ0JywgaGFzQmVlbkFkanVzdCApO1xuXG4gICAgICAgICAgICBpZiAoIHB1cmNoYXNlIDwgaGFzQmVlbkFkanVzdCApIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gY3R4LmJvZHkgPSB7XG4gICAgICAgICAgICAgICAgICAgIHN0YXR1czogNTAwLFxuICAgICAgICAgICAgICAgICAgICBtZXNzYWdlOiBg5pyJJHtmaW5pc2hBZGp1c3RPcmRlcnMubGVuZ3RofeS4quiuouWNleW3suehruiupO+8jOaVsOmHj+S4jeiDveWwkeS6jiR7aGFzQmVlbkFkanVzdH3ku7ZgXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgXG4gICAgICAgICAgICBsZXQgbmVlZEJ1eVRvdGFsID0gb3JkZXJzJC5yZWR1Y2UoKCB4LCB5ICkgPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiB4ICsgKHkgYXMgYW55KS5kYXRhLmNvdW50O1xuICAgICAgICAgICAgfSwgMCApO1xuXG4gICAgICAgICAgICBjb25zdCB0ZW1wID0gT2JqZWN0LmFzc2lnbih7IH0sIHNob3BwaW5nJC5kYXRhLCB7XG4gICAgICAgICAgICAgICAgcHVyY2hhc2UsXG4gICAgICAgICAgICAgICAgYWRqdXN0UHJpY2UsXG4gICAgICAgICAgICAgICAgYWRqdXN0R3JvdXBQcmljZSxcbiAgICAgICAgICAgICAgICBiYXNlX3N0YXR1czogJzEnLFxuICAgICAgICAgICAgICAgIGJ1eV9zdGF0dXM6IHB1cmNoYXNlIDwgbmVlZEJ1eVRvdGFsID8gJzInIDogJzEnLFxuICAgICAgICAgICAgICAgIHVwZGF0ZVRpbWU6IG5ldyBEYXRlKCApLmdldFRpbWUoIClcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBkZWxldGUgdGVtcFsnX2lkJ107XG5cbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCc1NTU1NTUnLCB0ZW1wKVxuXG4gICAgICAgICAgICAvLyDmm7TmlrDmuIXljZVcbiAgICAgICAgICAgIGF3YWl0IGRiLmNvbGxlY3Rpb24oJ3Nob3BwaW5nLWxpc3QnKVxuICAgICAgICAgICAgICAgIC5kb2MoIHNob3BwaW5nSWQgKVxuICAgICAgICAgICAgICAgIC5zZXQoe1xuICAgICAgICAgICAgICAgICAgICBkYXRhOiB0ZW1wXG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogIeS7peS4i+iuouWNlemDveaYr+W3suS7mOiuoumHkeeahFxuICAgICAgICAgICAgICog6K6i5Y2V77ya5om56YeP5a+56K6i5Y2V55qE5Lu35qC844CB5Zui6LSt5Lu344CB6LSt5Lmw54q25oCB6L+b6KGM6LCD5pW0KOW3sui0reS5sC/ov5vooYzkuK3vvIzlhbbku5blt7Lnu4/noa7lrprosIPmlbTnmoTorqLljZXvvIzkuI3lgZrlpITnkIYpXG4gICAgICAgICAgICAgKiDlhbblrp7lupTor6XkuZ/opoHoh6rliqjms6jlhaXorqLljZXmlbDph4/vvIjnrZbnlaXvvJrlhYjliLDlhYjlvpfvvIzlkI7kuIvljZXkvJrmnInlvpfkuI3liLDljZXnmoTpo47pmanvvIlcbiAgICAgICAgICAgICAqICHlpoLmnpzlt7Lnu4/liIbphY3ov4fkuobvvIzliJnkuI3lho3oh6rliqjliIbphY3ph4fotK3ph49cbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgY29uc3Qgc29ycmVkT3JkZXJzID0gb3JkZXJzJFxuICAgICAgICAgICAgICAgIC5tYXAoKCB4OiBhbnkgKSA9PiB4LmRhdGEgKVxuICAgICAgICAgICAgICAgIC5maWx0ZXIoKCB4OiBhbnkgKSA9PiB4LmJhc2Vfc3RhdHVzID09PSAnMCcgfHwgeC5iYXNlX3N0YXR1cyA9PT0gJzEnIClcbiAgICAgICAgICAgICAgICAuc29ydCgoIHg6IGFueSwgeTogYW55ICkgPT4geC5jcmVhdGVUaW1lIC0geS5jcmVhdGVUaW1lICk7XG5cbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCc2NjY2NjYnLCBzb3JyZWRPcmRlcnMgKTtcblxuICAgICAgICAgICAgLy8g5Ymp5L2Z5YiG6YWN6YePXG4gICAgICAgICAgICBwdXJjaGFzZSAtPSBoYXNCZWVuQWRqdXN0O1xuXG4gICAgICAgICAgICBjb25zb2xlLmxvZyggJzc3NycsIHB1cmNoYXNlICk7XG4gICAgICAgIFxuICAgICAgICAgICAgYXdhaXQgUHJvbWlzZS5hbGwoIHNvcnJlZE9yZGVycy5tYXAoIGFzeW5jIG9yZGVyID0+IHtcblxuICAgICAgICAgICAgICAgIGNvbnN0IGJhc2VUZW1wID0ge1xuICAgICAgICAgICAgICAgICAgICBhbGxvY2F0ZWRQcmljZTogYWRqdXN0UHJpY2UsXG4gICAgICAgICAgICAgICAgICAgIGFsbG9jYXRlZEdyb3VwUHJpY2U6IGFkanVzdEdyb3VwUHJpY2UsXG4gICAgICAgICAgICAgICAgICAgIC8vIOaXoOiuuuiHquWKqOWIhumFjeaYr+WQpuaIkOWKn++8jOmDveaYr+iiq+KAnOWIhumFjeKAneaTjeS9nOi/h+eahFxuICAgICAgICAgICAgICAgICAgICBiYXNlX3N0YXR1czogJzEnLFxuICAgICAgICAgICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAgICAgICAgICogISB2MTog5Ymp5L2Z5YiG6YWN6YeP5LiN6Laz6YeH6LSt6YeP5bCx5YiG6YWNMFxuICAgICAgICAgICAgICAgICAgICAgKiAhIHYyOiDliankvZnliIbphY3ph4/kuI3otrPph4fotK3ph4/vvIzlsLHliIbphY3liankvZnnmoTph4fotK3ph49cbiAgICAgICAgICAgICAgICAgICAgICovXG4gICAgICAgICAgICAgICAgICAgIC8vIGFsbG9jYXRlZENvdW50OiBwdXJjaGFzZSAtIG9yZGVyLmNvdW50ID49IDAgPyBvcmRlci5jb3VudCA6IDBcbiAgICAgICAgICAgICAgICAgICAgYWxsb2NhdGVkQ291bnQ6IHB1cmNoYXNlIC0gb3JkZXIuY291bnQgPj0gMCA/XG4gICAgICAgICAgICAgICAgICAgICAgICBvcmRlci5jb3VudCA6XG4gICAgICAgICAgICAgICAgICAgICAgICBwdXJjaGFzZVxuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgLy8g5YiG6YWN5oiQ5YqfXG4gICAgICAgICAgICAgICAgaWYgKCBwdXJjaGFzZSAtIG9yZGVyLmNvdW50ID49IDAgKSB7XG4gICAgICAgICAgICAgICAgICAgIGxhc3RBbGxvY2F0ZWQgPSBwdXJjaGFzZSAtIG9yZGVyLmNvdW50O1xuICAgICAgICAgICAgICAgICAgICBwdXJjaGFzZSAtPSBvcmRlci5jb3VudDtcblxuICAgICAgICAgICAgICAgIC8vIOi0p+a6kOS4jei2s++8jOWIhumFjeacgOWQjueahOWJqeS9memHj1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGxhc3RBbGxvY2F0ZWQgPSAwO1xuICAgICAgICAgICAgICAgICAgICBwdXJjaGFzZSA9IDA7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgY29uc3QgdGVtcCA9IE9iamVjdC5hc3NpZ24oeyB9LCBvcmRlciwgYmFzZVRlbXAgKTtcblxuICAgICAgICAgICAgICAgIGRlbGV0ZSB0ZW1wWydfaWQnXTtcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICBhd2FpdCBkYi5jb2xsZWN0aW9uKCdvcmRlcicpXG4gICAgICAgICAgICAgICAgICAgIC5kb2MoIG9yZGVyLl9pZCApXG4gICAgICAgICAgICAgICAgICAgIC5zZXQoe1xuICAgICAgICAgICAgICAgICAgICAgICAgZGF0YTogdGVtcFxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICByZXR1cm47XG5cbiAgICAgICAgICAgIH0pKTtcblxuICAgICAgICAgICAgLy8g5pu05paw5riF5Y2V55qE5Ymp5L2Z5YiG6YWN5pWwXG4gICAgICAgICAgICBhd2FpdCBkYi5jb2xsZWN0aW9uKCdzaG9wcGluZy1saXN0JylcbiAgICAgICAgICAgICAgICAuZG9jKCBzaG9wcGluZ0lkIClcbiAgICAgICAgICAgICAgICAudXBkYXRlKHtcbiAgICAgICAgICAgICAgICAgICAgZGF0YTogeyBsYXN0QWxsb2NhdGVkIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgXG4gICAgICAgICAgICByZXR1cm4gY3R4LmJvZHkgPSB7XG4gICAgICAgICAgICAgICAgc3RhdHVzOiAyMDBcbiAgICAgICAgICAgIH1cblxuICAgICAgICB9IGNhdGNoICggZSApIHsgcmV0dXJuIGN0eC5ib2R5ID0geyBzdGF0dXM6IDUwMCB9O31cbiAgICB9KVxuXG4gICAgLyoqXG4gICAgICogQGRlc2NyaXB0aW9uXG4gICAgICog6I635Y+W6KGM56iL6YeM5piv5ZCm6L+Y5pyJ5pyq6LCD5pW055qE5riF5Y2VXG4gICAgKi9cbiAgICBhcHAucm91dGVyKCdhZGp1c3Qtc3RhdHVzJywgYXN5bmMoIGN0eCwgbmV4dCApID0+IHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGNvbnN0IHsgdGlkIH0gPSBldmVudC5kYXRhO1xuICAgICAgICAgICAgY29uc3QgY291bnQgPSBhd2FpdCBkYi5jb2xsZWN0aW9uKCdzaG9wcGluZy1saXN0JylcbiAgICAgICAgICAgICAgICAud2hlcmUoe1xuICAgICAgICAgICAgICAgICAgICB0aWQsXG4gICAgICAgICAgICAgICAgICAgIGJhc2Vfc3RhdHVzOiAnMCdcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIC5jb3VudCggKTtcblxuICAgICAgICAgICAgcmV0dXJuIGN0eC5ib2R5ID0ge1xuICAgICAgICAgICAgICAgIHN0YXR1czogMjAwLFxuICAgICAgICAgICAgICAgIGRhdGE6IGNvdW50LnRvdGFsXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfSBjYXRjaCAoIGUgKSB7XG4gICAgICAgICAgICByZXR1cm4gY3R4LmJvZHkgPSB7IHN0YXR1czogNTAwIH07XG4gICAgICAgIH1cbiAgICB9KVxuXG4gICAgLyoqXG4gICAgICogQGRlc2NyaXB0aW9uXG4gICAgICog562J5b6F5ou85Zui5YiX6KGoIC8g5Y+v5ou85Zui5YiX6KGoICgg5Y+v5oyH5a6a5ZWG5ZOBOiDllYblk4Hor6bmg4XpobXpnaIgKVxuICAgICAqIHtcbiAgICAgKiAgICB0aWQsXG4gICAgICogICAgcGlkLFxuICAgICAqICAgIGxpbWl0XG4gICAgICogICAgZGV0YWlsOiBib29sZWFuIOaYr+WQpuW4puWbnuWVhuWTgeivpuaDhe+8iOm7mOiupOW4puWbnu+8iVxuICAgICAqICAgIHNob3dVc2VyOiBib29sZWFuIOaYr+WQpumcgOimgeeUqOaIt+WktOWDj+etieS/oeaBr++8iOm7mOiupOS4jeW4puWbnu+8iVxuICAgICAqICAgIHR5cGU6IHVuZGVmaW5lZCB8ICd3YWl0JyB8ICdwaW4nIC8vIOetieW+heaLvOWbou+8jOW3suaLvOWbou+8jOWdh+aciVxuICAgICAqIH1cbiAgICAgKi9cbiAgICBhcHAucm91dGVyKCdwaW4nLCBhc3luYyggY3R4LCBuZXh0ICkgPT4ge1xuICAgICAgICB0cnkge1xuXG4gICAgICAgICAgICBjb25zdCBvcGVuaWQgPSBldmVudC51c2VySW5mby5vcGVuSWQ7XG4gICAgICAgICAgICBjb25zdCB7IHRpZCwgZGV0YWlsLCBwaWQsIHR5cGUsIGxpbWl0IH0gPSBldmVudC5kYXRhO1xuICAgICAgICAgICAgY29uc3Qgc2hvd1VzZXIgPSBldmVudC5kYXRhLnNob3dVc2VyIHx8IGZhbHNlO1xuXG4gICAgICAgICAgICBjb25zdCBxdWVyeSA9IHBpZCA/IHtcbiAgICAgICAgICAgICAgICB0aWQsXG4gICAgICAgICAgICAgICAgcGlkXG4gICAgICAgICAgICB9IDoge1xuICAgICAgICAgICAgICAgIHRpZFxuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgbGV0IHNob3BwaW5nJDtcbiAgICAgICAgICAgIGlmICggbGltaXQgKSB7XG4gICAgICAgICAgICAgICAgc2hvcHBpbmckID0gYXdhaXQgZGIuY29sbGVjdGlvbignc2hvcHBpbmctbGlzdCcpXG4gICAgICAgICAgICAgICAgICAgIC53aGVyZSggcXVlcnkgKVxuICAgICAgICAgICAgICAgICAgICAubGltaXQoIGxpbWl0IClcbiAgICAgICAgICAgICAgICAgICAgLmdldCggKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgc2hvcHBpbmckID0gYXdhaXQgZGIuY29sbGVjdGlvbignc2hvcHBpbmctbGlzdCcpXG4gICAgICAgICAgICAgICAgICAgIC53aGVyZSggcXVlcnkgKVxuICAgICAgICAgICAgICAgICAgICAuZ2V0KCApO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgXG5cbiAgICAgICAgICAgIC8vIHVpZHPplb/luqbkuLox77yM5Li65b6F5ou85YiX6KGoICgg5p+l6K+i5b6F5ou85YiX6KGo5pe277yM5Y+v5Lul5pyJ6Ieq5bex77yM6K6p5a6i5oi355+l6YGT57O757uf5Lya5YiX5Ye65p2lIClcbiAgICAgICAgICAgIC8vIHVpZHPplb/luqbkuLoy77yM5Li65Y+v5Lul5ou85Zui5YiX6KGoXG4gICAgICAgICAgICBsZXQgZGF0YTogYW55ID0gWyBdO1xuICAgICAgICAgICAgbGV0IGRhdGEkID0gc2hvcHBpbmckLmRhdGEuZmlsdGVyKCBzID0+IHtcbiAgICAgICAgICAgICAgICBpZiAoIHR5cGUgPT09ICdwaW4nICkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gKCAhIXMuYWRqdXN0R3JvdXBQcmljZSB8fCAhIXMuZ3JvdXBQcmljZSApICYmIHMudWlkcy5sZW5ndGggPiAxO1xuXG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmICggdHlwZSA9PT0gJ3dhaXQnICkge1xuICAgICAgICAgICAgICAgICAgICAvLyByZXR1cm4gISFzLmFkanVzdEdyb3VwUHJpY2UgJiYgcy51aWRzLmxlbmd0aCA9PT0gMSAmJiBzLnVpZHNbIDAgXSAhPT0gb3BlbmlkXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAoICEhcy5hZGp1c3RHcm91cFByaWNlIHx8ICEhcy5ncm91cFByaWNlICkgJiYgcy51aWRzLmxlbmd0aCA9PT0gMTtcblxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIHJldHVybiAoICEhcy5hZGp1c3RHcm91cFByaWNlICYmIHMudWlkcy5sZW5ndGggPiAxICkgfHxcbiAgICAgICAgICAgICAgICAgICAgLy8gICAgICggISFzLmFkanVzdEdyb3VwUHJpY2UgJiYgcy51aWRzLmxlbmd0aCA9PT0gMSAmJiBzLnVpZHNbIDAgXSAhPT0gb3BlbmlkIClcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuICggISFzLmFkanVzdEdyb3VwUHJpY2UgfHwgISFzLmdyb3VwUHJpY2UgKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgZGF0YSQgPSBkYXRhJC5zb3J0KCggeCwgeSApID0+IHgudWlkcy5sZW5ndGggLSB5LnVpZHMubGVuZ3RoICk7XG4gICAgICAgICAgICBkYXRhID0gZGF0YSQ7XG5cbiAgICAgICAgICAgIC8vIOafpeivouavj+adoea4heWNleW6leS4i+avj+S4quWVhuWTgeeahOivpuaDhVxuICAgICAgICAgICAgaWYgKCBkZXRhaWwgPT09IHVuZGVmaW5lZCB8fCAhIWRldGFpbCApIHtcblxuICAgICAgICAgICAgICAgIC8vIOWVhuWTgVxuICAgICAgICAgICAgICAgIGNvbnN0IGdvb2RJZHMgPSBBcnJheS5mcm9tKFxuICAgICAgICAgICAgICAgICAgICBuZXcgU2V0KCBkYXRhJC5tYXAoIGxpc3QgPT4gXG4gICAgICAgICAgICAgICAgICAgICAgICBsaXN0LnBpZFxuICAgICAgICAgICAgICAgICAgICApKVxuICAgICAgICAgICAgICAgICk7XG5cbiAgICAgICAgICAgICAgICAvLyDlnovlj7dcbiAgICAgICAgICAgICAgICBjb25zdCBzdGFuZGFyc0lkcyA9IEFycmF5LmZyb20oXG4gICAgICAgICAgICAgICAgICAgIG5ldyBTZXQoIGRhdGEkLm1hcCggbGlzdCA9PiBcbiAgICAgICAgICAgICAgICAgICAgICAgIGxpc3Quc2lkXG4gICAgICAgICAgICAgICAgICAgICkpXG4gICAgICAgICAgICAgICAgKS5maWx0ZXIoIHggPT4gISF4ICk7XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgLy8g5ZWG5ZOBXG4gICAgICAgICAgICAgICAgbGV0IGFsbEdvb2RzJDogYW55ID0gYXdhaXQgUHJvbWlzZS5hbGwoIGdvb2RJZHMubWFwKCBnb29kSWQgPT4ge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZGIuY29sbGVjdGlvbignZ29vZHMnKVxuICAgICAgICAgICAgICAgICAgICAgICAgLmRvYyggU3RyaW5nKCBnb29kSWQgKSlcbiAgICAgICAgICAgICAgICAgICAgICAgIC5nZXQoICk7XG4gICAgICAgICAgICAgICAgfSkpO1xuXG4gICAgICAgICAgICAgICAgYWxsR29vZHMkID0gYWxsR29vZHMkLm1hcCggeCA9PiB4LmRhdGEgKTtcblxuICAgICAgICAgICAgICAgIC8vIOWei+WPt1xuICAgICAgICAgICAgICAgIGxldCBhbGxTdGFuZGFycyQ6IGFueSA9IGF3YWl0IFByb21pc2UuYWxsKCBzdGFuZGFyc0lkcy5tYXAoIHNpZCA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBkYi5jb2xsZWN0aW9uKCdzdGFuZGFyZHMnKVxuICAgICAgICAgICAgICAgICAgICAgICAgLmRvYyggU3RyaW5nKCBzaWQgKSlcbiAgICAgICAgICAgICAgICAgICAgICAgIC5nZXQoICk7XG4gICAgICAgICAgICAgICAgfSkpO1xuXG4gICAgICAgICAgICAgICAgYWxsU3RhbmRhcnMkID0gYWxsU3RhbmRhcnMkLm1hcCggeCA9PiB4LmRhdGEgKTtcblxuICAgICAgICAgICAgICAgIGNvbnN0IGdvb2QkID0gZGF0YSQubWFwKCBsaXN0ID0+IHtcblxuICAgICAgICAgICAgICAgICAgICBjb25zdCB7IHBpZCwgc2lkIH0gPSBsaXN0O1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBnb29kOiBhbnkgPSBhbGxHb29kcyQuZmluZCggeCA9PiB4Ll9pZCA9PT0gcGlkICk7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHN0YW5kYXIgPSBhbGxTdGFuZGFycyQuZmluZCggeCA9PiB4Ll9pZCA9PT0gc2lkICk7XG5cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGdvb2QsXG4gICAgICAgICAgICAgICAgICAgICAgICB0YWc6IGdvb2QudGFnLFxuICAgICAgICAgICAgICAgICAgICAgICAgdGl0bGU6IGdvb2QudGl0bGUsXG4gICAgICAgICAgICAgICAgICAgICAgICBzYWxlZDogZ29vZC5zYWxlZCxcbiAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6IHN0YW5kYXIgPyBzdGFuZGFyLm5hbWUgOiAnJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIHByaWNlOiBzdGFuZGFyID8gc3RhbmRhci5wcmljZSA6IGdvb2QucHJpY2UsXG4gICAgICAgICAgICAgICAgICAgICAgICBpbWc6IHN0YW5kYXIgPyBzdGFuZGFyLmltZyA6IGdvb2QuaW1nWyAwIF0sXG4gICAgICAgICAgICAgICAgICAgICAgICBncm91cFByaWNlOiBzdGFuZGFyID8gc3RhbmRhci5ncm91cFByaWNlIDogZ29vZC5ncm91cFByaWNlLFxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICAvLyDms6jlhaXllYblk4Hor6bmg4VcbiAgICAgICAgICAgICAgICBkYXRhID0gZGF0YSQubWFwKCggc2hvcHBpbmcsIGsgKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBPYmplY3QuYXNzaWduKHsgfSwgc2hvcHBpbmcsIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRldGFpbDogZ29vZCRbIGsgXVxuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyDlsZXnpLrnlKjmiLflpLTlg49cbiAgICAgICAgICAgIGlmICggc2hvd1VzZXIgKSB7XG5cbiAgICAgICAgICAgICAgICBsZXQgdWlkczogc3RyaW5nWyBdID0gWyBdO1xuICAgICAgICAgICAgICAgIGRhdGEkLm1hcCggbGlzdCA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHVpZHMgPSBbIC4uLnVpZHMsIC4uLmxpc3QudWlkcyBdO1xuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgdWlkcyA9IEFycmF5LmZyb20oXG4gICAgICAgICAgICAgICAgICAgIG5ldyBTZXQoIHVpZHMgKVxuICAgICAgICAgICAgICAgICk7XG4gXG4gICAgICAgICAgICAgICAgbGV0IHVzZXJzJDogYW55ID0gYXdhaXQgUHJvbWlzZS5hbGwoIHVpZHMubWFwKCB1aWQgPT4ge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZGIuY29sbGVjdGlvbigndXNlcicpXG4gICAgICAgICAgICAgICAgICAgICAgICAud2hlcmUoe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9wZW5pZDogdWlkXG4gICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAgICAgLmZpZWxkKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvcGVuaWQ6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYXZhdGFyVXJsOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5pY2tOYW1lOiB0cnVlXG4gICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAgICAgLmdldCggKTtcbiAgICAgICAgICAgICAgICB9KSk7XG5cbiAgICAgICAgICAgICAgICB1c2VycyQgPSB1c2VycyQubWFwKCB4ID0+IHguZGF0YVsgMCBdKTtcblxuICAgICAgICAgICAgICAgIGRhdGEgPSBkYXRhLm1hcCgoIHNob3BwaW5nLCBrICkgPT4ge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gT2JqZWN0LmFzc2lnbih7IH0sIHNob3BwaW5nLCB7XG4gICAgICAgICAgICAgICAgICAgICAgICB1c2Vyczogc2hvcHBpbmcudWlkcy5tYXAoIHVpZCA9PiB1c2VycyQuZmluZCggeCA9PiB4Lm9wZW5pZCA9PT0gdWlkICkpXG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIFxuICAgICAgICAgICAgcmV0dXJuIGN0eC5ib2R5ID0ge1xuICAgICAgICAgICAgICAgIGRhdGEsXG4gICAgICAgICAgICAgICAgc3RhdHVzOiAyMDBcbiAgICAgICAgICAgIH1cblxuICAgICAgICB9IGNhdGNoICggZSApIHtcbiAgICAgICAgICAgIHJldHVybiBjdHguYm9keSA9IHsgc3RhdHVzOiA1MDAgfTtcbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgLyoqIFxuICAgICAqIEBkZXNjcmlwdGlvblxuICAgICAqIOS7meWls+i0reeJqea4heWNlSAoIOS5sOS6huWkmuWwkeOAgeWNoeWIuOWkmuWwkeOAgeecgeS6huWkmuWwkSApXG4gICAgICovXG4gICAgYXBwLnJvdXRlcignZmFpcnktc2hvcHBpbmdsaXN0JywgYXN5bmMoIGN0eCwgbmV4dCApID0+IHtcbiAgICAgICAgdHJ5IHtcblxuICAgICAgICAgICAgY29uc3QgeyB0aWQgfSA9IGV2ZW50LmRhdGE7XG4gICAgICAgICAgICBjb25zdCBsaW1pdCA9IGV2ZW50LmRhdGEubGltaXQgfHwgNTtcblxuICAgICAgICAgICAgLyoqIOihjOeoi+i0reeJqea4heWNlSAqL1xuICAgICAgICAgICAgY29uc3Qgc2hvcHBpbmdNZXRhJCA9IGF3YWl0IGRiLmNvbGxlY3Rpb24oJ3Nob3BwaW5nLWxpc3QnKVxuICAgICAgICAgICAgICAgIC53aGVyZSh7XG4gICAgICAgICAgICAgICAgICAgIHRpZFxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLmdldCggKTtcbiAgICAgICAgICAgIFxuICAgICAgICBcbiAgICAgICAgICAgIC8qKiDmiYDmnIl1aWTvvIjlkKvph43lpI3vvIkgKi9cbiAgICAgICAgICAgIGxldCB1aWRzOiBhbnkgPSBbIF07XG4gICAgICAgICAgICBzaG9wcGluZ01ldGEkLmRhdGEubWFwKCBzbCA9PiB7XG4gICAgICAgICAgICAgICAgdWlkcyA9IFsgLi4udWlkcywgLi4uc2wudWlkcyBdO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIC8qKiDlpITnkIbkvJjljJZcbiAgICAgICAgICAgICAqIOiuqei0reS5sOmHj+abtOWkmueahOeUqOaIt++8jOWxleekuuWcqOWJjemdolxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICBsZXQgdWlkTWFwVGltZXM6IHtcbiAgICAgICAgICAgICAgICBbIGtleTogc3RyaW5nIF0gOiBudW1iZXJcbiAgICAgICAgICAgIH0gPSB7IH07XG4gICAgICAgICAgICB1aWRzLm1hcCggdWlkc3RyaW5nID0+IHtcbiAgICAgICAgICAgICAgICBpZiAoICF1aWRNYXBUaW1lc1sgdWlkc3RyaW5nIF0pIHtcbiAgICAgICAgICAgICAgICAgICAgdWlkTWFwVGltZXMgPSBPYmplY3QuYXNzaWduKHsgfSwgdWlkTWFwVGltZXMsIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIFsgdWlkc3RyaW5nIF06IDFcbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB1aWRNYXBUaW1lcyA9IE9iamVjdC5hc3NpZ24oeyB9LCB1aWRNYXBUaW1lcywge1xuICAgICAgICAgICAgICAgICAgICAgICAgWyB1aWRzdHJpbmcgXTogdWlkTWFwVGltZXNbIHVpZHN0cmluZyBdICsgMVxuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAvKiog5YmNNeWQjeeahOeUqOaIt2lkICovXG4gICAgICAgICAgICBjb25zdCB1c2VySWRzID0gT2JqZWN0LmVudHJpZXMoIHVpZE1hcFRpbWVzIClcbiAgICAgICAgICAgICAgICAuc29ydCgoIHgsIHkgKSA9PiBcbiAgICAgICAgICAgICAgICAgICAgeVsgMSBdIC0geFsgMSBdXG4gICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICAgIC5zbGljZSggMCwgbGltaXQgKVxuICAgICAgICAgICAgICAgIC5tYXAoIHggPT4geFsgMCBdKTtcblxuICAgICAgICAgICAgLyoqIOavj+S4queUqOaIt+eahOS/oeaBryAqL1xuICAgICAgICAgICAgY29uc3QgdXNlcnMkID0gYXdhaXQgUHJvbWlzZS5hbGwoIHVzZXJJZHMubWFwKCB1aWQgPT4gUHJvbWlzZS5hbGwoW1xuICAgICAgICAgICAgICAgIGRiLmNvbGxlY3Rpb24oJ3VzZXInKVxuICAgICAgICAgICAgICAgICAgICAud2hlcmUoe1xuICAgICAgICAgICAgICAgICAgICAgICAgb3BlbmlkOiB1aWRcbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgLmdldCggKVxuICAgICAgICAgICAgXSkpKTtcblxuICAgICAgICAgICAgLyoqIOWJjTXkurrnmoTljaHliLggKi9cbiAgICAgICAgICAgIGNvbnN0IGNvdXBvbnMkOiBhbnkgPSBhd2FpdCBQcm9taXNlLmFsbChcbiAgICAgICAgICAgICAgICB1c2VySWRzLm1hcCggdWlkID0+IFxuICAgICAgICAgICAgICAgICAgICBkYi5jb2xsZWN0aW9uKCdjb3Vwb24nKVxuICAgICAgICAgICAgICAgICAgICAgICAgLndoZXJlKF8ub3IoW1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGlkLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvcGVuaWQ6IHVpZFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb3BlbmlkOiB1aWQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhblVzZUluTmV4dDogdHJ1ZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIF0pKVxuICAgICAgICAgICAgICAgICAgICAgICAgLmZpZWxkKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9wZW5pZDogdHJ1ZVxuICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgICAgIC5nZXQoIClcbiAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICApXG5cbiAgICAgICAgICAgIC8qKiDliY015Liq5Lq65oC755qE6LSt54mp5riF5Y2VICovXG4gICAgICAgICAgICBjb25zdCBzaG9wcGluZ01ldGFGaWx0ZXIgPSBzaG9wcGluZ01ldGEkLmRhdGEuZmlsdGVyKCBzID0+IFxuICAgICAgICAgICAgICAgICEhdXNlcklkcy5maW5kKCB1aWQgPT4gXG4gICAgICAgICAgICAgICAgICAgIHMudWlkcy5maW5kKCBcbiAgICAgICAgICAgICAgICAgICAgICAgIHUgPT4gdSA9PT0gdWlkXG4gICAgICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICkpO1xuXG4gICAgICAgICAgICAvKiog5ZWG5ZOBaWQgKi9cbiAgICAgICAgICAgIGNvbnN0IHBJZHMgPSBBcnJheS5mcm9tKFxuICAgICAgICAgICAgICAgIG5ldyBTZXQoIFxuICAgICAgICAgICAgICAgICAgICBzaG9wcGluZ01ldGFGaWx0ZXJcbiAgICAgICAgICAgICAgICAgICAgICAgIC5tYXAoIHMgPT4gcy5waWQgKVxuICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICk7XG5cbiAgICAgICAgICAgIC8qKiDllYblk4Hor6bmg4UgKi8gICAgICAgICAgICBcbiAgICAgICAgICAgIGNvbnN0IGRldGFpbHMkID0gYXdhaXQgUHJvbWlzZS5hbGwoIHBJZHMubWFwKCBwaWQgPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiBkYi5jb2xsZWN0aW9uKCdnb29kcycpXG4gICAgICAgICAgICAgICAgICAgIC5kb2MoIHBpZCApXG4gICAgICAgICAgICAgICAgICAgIC5maWVsZCh7XG4gICAgICAgICAgICAgICAgICAgICAgICBfaWQ6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgICAgICB0YWc6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgICAgICBpbWc6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgICAgICB0aXRsZTogdHJ1ZVxuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAuZ2V0KCApXG4gICAgICAgICAgICB9KSk7XG5cbiAgICAgICAgICAgIC8qKiDotK3nianmuIXljZXms6jlhaXllYblk4Hor6bmg4UgKi9cbiAgICAgICAgICAgIGNvbnN0IHNob3BwaW5nSW5qZWN0ID0gc2hvcHBpbmdNZXRhRmlsdGVyLm1hcCggc2wgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IGRldGFpbCA9IGRldGFpbHMkLmZpbmQoIHggPT4geC5kYXRhLl9pZCA9PT0gc2wucGlkICk7XG4gICAgICAgICAgICAgICAgaWYgKCBkZXRhaWwgKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBPYmplY3QuYXNzaWduKHsgfSwgc2wsIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRldGFpbDogZGV0YWlsLmRhdGFcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIE9iamVjdC5hc3NpZ24oeyB9LCBzbCApO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAvKiog6L+U5Zue57uT5p6cICovXG4gICAgICAgICAgICBjb25zdCBtZXRhRGF0YSA9IHVzZXJzJC5tYXAoKCB4LCBrICkgPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgICAgIHVzZXI6IHhbIDAgXS5kYXRhWyAwIF0sXG4gICAgICAgICAgICAgICAgICAgIGNvdXBvbnM6IGNvdXBvbnMkWyBrIF0uZGF0YSwgXG4gICAgICAgICAgICAgICAgICAgIHNob3BwaW5nbGlzdDogc2hvcHBpbmdJbmplY3QuZmlsdGVyKCBzbCA9PiBzbC51aWRzLmZpbmQoIHVpZCA9PiB1aWQgPT09IHhbIDAgXS5kYXRhWyAwIF0ub3BlbmlkICkpXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHJldHVybiBjdHguYm9keSA9IHtcbiAgICAgICAgICAgICAgICBzdGF0dXM6IDIwMCxcbiAgICAgICAgICAgICAgICBkYXRhOiBtZXRhRGF0YVxuICAgICAgICAgICAgfVxuXG4gICAgICAgIH0gY2F0Y2ggKCBlICkge1xuICAgICAgICAgICAgcmV0dXJuIGN0eC5ib2R5ID0geyBzdGF0dXM6IDUwMCB9O1xuICAgICAgICB9XG4gICAgfSlcblxuICAgIHJldHVybiBhcHAuc2VydmUoICk7XG5cbn0iXX0=