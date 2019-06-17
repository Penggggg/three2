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
                        if (trip$.data.isClosed || new Date().getTime() > trip$.data.end_date) {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSxpQkEyL0JDOztBQTMvQkQscUNBQXVDO0FBQ3ZDLHNDQUF3QztBQUd4QyxLQUFLLENBQUMsSUFBSSxDQUFDO0lBQ1AsR0FBRyxFQUFFLE9BQU8sQ0FBQyxHQUFHLENBQUMsS0FBSztDQUN6QixDQUFDLENBQUM7QUFFSCxJQUFNLEVBQUUsR0FBZ0IsS0FBSyxDQUFDLFFBQVEsRUFBRyxDQUFDO0FBQzFDLElBQU0sQ0FBQyxHQUFHLEVBQUUsQ0FBQyxPQUFPLENBQUM7QUFvQlIsUUFBQSxJQUFJLEdBQUcsVUFBUSxLQUFLLEVBQUUsT0FBTzs7OztRQUVoQyxHQUFHLEdBQUcsSUFBSSxTQUFTLENBQUMsRUFBRSxLQUFLLE9BQUEsRUFBRSxDQUFDLENBQUM7UUErRHJDLEdBQUcsQ0FBQyxNQUFNLENBQUMsZUFBZSxFQUFFLFVBQU8sR0FBRyxFQUFFLElBQUk7Ozs7Ozs7d0JBRzlCLEtBQWdCLEtBQUssQ0FBQyxJQUFJLEVBQXhCLGNBQUcsRUFBRSxJQUFJLFVBQUEsQ0FBZ0I7d0JBQzNCLFdBQVMsS0FBSyxDQUFDLElBQUksQ0FBQyxNQUFNLElBQUksS0FBSyxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUM7d0JBRXBELE1BQU0sR0FBRyxVQUFBLE9BQU8sSUFBSSxPQUFBLENBQUM7NEJBQ3ZCLE9BQU8sU0FBQTs0QkFDUCxNQUFNLEVBQUUsR0FBRzt5QkFDZCxDQUFDLEVBSHdCLENBR3hCLENBQUM7d0JBRUgsSUFBSyxDQUFDLEtBQUcsRUFBRzs0QkFDUixXQUFPLEdBQUcsQ0FBQyxJQUFJLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQyxFQUFDO3lCQUNwQzt3QkFHYSxXQUFNLEVBQUUsQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDO2lDQUNwQyxHQUFHLENBQUUsTUFBTSxD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QUFHLE1BQU0sQ0FBQyxHQUFHLENBQUMsVUFBRSxDQUFDLEVBQUUsQ0FBQzs0QkFDOUIsT0FBTztnQ0FDSCxJQUFJLEVBQUUsQ0FBQyxDQUFFLENBQUMsQ0FBRSxDQUFDLElBQUksQ0FBRSxDQUFDLENBQUU7Z0NBQ3RCLE9BQU8sRUFBRSxVQUFRLENBQUUsQ0FBQyxDQUFFLENBQUMsSUFBSTtnQ0FDM0IsWUFBWSxFQUFFLGdCQUFjLENBQUMsTUFBTSxDQUFFLFVBQUEsRUFBRSxJQUFJLE9BQUEsRUFBRSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUUsVUFBQSxHQUFHLElBQUksT0FBQSxHQUFHLEtBQUssQ0FBQyxDQUFFLENBQUMsQ0FBRSxDQUFDLElBQUksQ0FBRSxDQUFDLENBQUUsQ0FBQyxNQUFNLEVBQS9CLENBQStCLENBQUUsRUFBdEQsQ0FBc0QsQ0FBQzs2QkFDckcsQ0FBQTt3QkFDTCxDQUFDLENBQUMsQ0FBQzt3QkFFSCxXQUFPLEdBQUcsQ0FBQyxJQUFJLEdBQUc7Z0NBQ2QsTUFBTSxFQUFFLEdBQUc7Z0NBQ1gsSUFBSSxFQUFFLFFBQVE7NkJBQ2pCLEVBQUE7Ozt3QkFHRCxXQUFPLEdBQUcsQ0FBQyxJQUFJLEdBQUcsRUFBRSxNQUFNLEVBQUUsR0FBRyxFQUFFLEVBQUM7Ozs7YUFFekMsQ0FBQyxDQUFBO1FBRUYsV0FBTyxHQUFHLENBQUMsS0FBSyxFQUFHLEVBQUM7O0tBRXZCLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBjbG91ZCBmcm9tICd3eC1zZXJ2ZXItc2RrJztcbmltcG9ydCAqIGFzIFRjYlJvdXRlciBmcm9tICd0Y2Itcm91dGVyJztcbmltcG9ydCB7IGZpbmQkIH0gZnJvbSAnLi9maW5kJztcblxuY2xvdWQuaW5pdCh7XG4gICAgZW52OiBwcm9jZXNzLmVudi5jbG91ZFxufSk7XG5cbmNvbnN0IGRiOiBEQi5EYXRhYmFzZSA9IGNsb3VkLmRhdGFiYXNlKCApO1xuY29uc3QgXyA9IGRiLmNvbW1hbmQ7XG5cbi8qKlxuICogQGRlc2NyaXB0aW9uIOihjOeoi+a4heWNleaooeWdl1xuICogLS0tLS0tLS0tIOWtl+autSAtLS0tLS0tLS0tXG4gKiB0aWRcbiAqIHBpZFxuICogc2lkICgg5Y+v5Li656m6IClcbiAqIG9pZHMgQXJyYXlcbiAqIHVpZHMgQXJyYXlcbiAqIGJ1eV9zdGF0dXMgMCwxLDIg5pyq6LSt5Lmw44CB5bey6LSt5Lmw44CB5Lmw5LiN5YWoXG4gKiBiYXNlX3N0YXR1czogMCwxIOacquiwg+aVtO+8jOW3suiwg+aVtFxuICogY3JlYXRlVGltZVxuICogdXBkYXRlVGltZVxuICogISBhY2lkIOa0u+WKqGlkXG4gKiBsYXN0QWxsb2NhdGVkIOWJqeS9meWIhumFjemHj1xuICogcHVyY2hhc2Ug6YeH6LSt5pWw6YePXG4gKiBhZGp1c3RQcmljZSDliIbphY3nmoTmlbDmuIXljZXllK7ku7dcbiAqIGFkanVzdEdyb3VwUHJpY2Ug5YiG6YWN55qE5pWw5riF5Y2V5Zui6LSt5Lu3XG4gKi9cbmV4cG9ydCBjb25zdCBtYWluID0gYXN5bmMgKCBldmVudCwgY29udGV4dCApID0+IHtcblxuICAgIGNvbnN0IGFwcCA9IG5ldyBUY2JSb3V0ZXIoeyBldmVudCB9KTtcblxuICAgIC8qKlxuICAgICAqIEBkZXNjcmlwdGlvblxuICAgICAqIOWIpOaWreivt+axgueahHNpZCArIHRpZCArIHBpZCArIGNvdW505pWw57uE77yM6L+U5Zue5LiN6IO96LSt5Lmw55qE5ZWG5ZOB5YiX6KGo77yI5riF5Y2V6YeM6Z2i5Lmw5LiN5Yiw44CB5Lmw5LiN5YWo77yJ44CB6LSn5YWo5LiN6Laz55qE5ZWG5ZOB77yI6L+U5Zue5pyA5paw6LSn5a2Y77yJXG4gICAgICogLS0tLS0tLS0g6K+35rGCIC0tLS0tLS0tLS1cbiAgICAgKiB7XG4gICAgICohICAgIGZyb20/OiAnY2FydCcgfCAnYnV5JyB8ICdjdXN0b20nIHwgJ2FnZW50cycgfCAnc3lzdGVtJ1xuICAgICAqICAgICB0aWQ6IHN0cmluZ1xuICAgICAqISAgICBvcGVuaWQ/OiBzdHJpbmcsXG4gICAgICogICAgbGlzdDogeyBcbiAgICAgKiAgICAgIHRpZFxuICAgICAqISAgICAgY2lkPzogc3RyaW5nXG4gICAgICAgICAgICBzaWRcbiAgICAgICAgICAgIHBpZFxuICAgICAgICAgICAgcHJpY2VcbiAgICAgICAgICAgIGdyb3VwUHJpY2VcbiAgICAgICAgICAgIGNvdW50XG4gICAgICohICAgICBkZXNjPzogc3RyaW5nXG4gICAgICAgICAgICBuYW1lLFxuICAgICAgICAgICAgc3RhbmRlcm5hbWVcbiAgICAgICAgICAgIGltZ1xuICAgICAgICAgICAgdHlwZVxuICAgICAgICAgICAgYWRkcmVzczoge1xuICAgICAgICAgICAgICAgbmFtZSxcbiAgICAgICAgICAgICAgIHBob25lLFxuICAgICAgICAgICAgICAgZGV0YWlsLFxuICAgICAgICAgICAgICAgcG9zdGFsY29kZVxuICAgICAgICAgICAgfVxuICAgICAqICAgICB9WyBdXG4gICAgICogfVxuICAgICAqIC0tLS0tLS0tIOi/lOWbniAtLS0tLS0tLS0tXG4gICAgICoge1xuICAgICAqICAgICAgKiDlt7LotK3kubAoIOmjjumZqeWNlSApXG4gICAgICogICAgICBoYXNCZWVuQnV5OiB7XG4gICAgICogICAgICAgICAgdGlkLCBcbiAgICAgKiAgICAgICAgICBwaWQsXG4gICAgICogICAgICAgICAgc2lkXG4gICAgICogICAgICB9WyBdXG4gICAgICogICAgICAqIOS5sOS4jeWIsFxuICAgICAqICAgICAgY2Fubm90QnV5OiB7IFxuICAgICAqICAgICAgICAgIHRpZCwgXG4gICAgICogICAgICAgICAgcGlkLFxuICAgICAqICAgICAgICAgIHNpZFxuICAgICAqICAgICAgfVsgXVxuICAgICAqICAgICAgKiDotKflrZjkuI3otrNcbiAgICAgKiAgICAgICBsb3dTdG9jazogeyBcbiAgICAgKiAgICAgICAgICB0aWQsIFxuICAgICAqICAgICAgICAgIHBpZCxcbiAgICAgKiAgICAgICAgICBzaWQsXG4gICAgICogICAgICAgICAgY291bnQsXG4gICAgICogICAgICAgICAgc3RvY2tcbiAgICAgKiAgICAgIH1bIF1cbiAgICAgKiAgICAgICog5Z6L5Y+35bey6KKr5Yig6ZmkIC8g5ZWG5ZOB5bey5LiL5p62XG4gICAgICogICAgICBoYXNCZWVuRGVsZXRlOiB7XG4gICAgICogICAgICAgICAgdGlkLCBcbiAgICAgKiAgICAgICAgICBwaWQsXG4gICAgICogICAgICAgICAgc2lkXG4gICAgICogICAgICB9WyBdLFxuICAgICAqICAgICAgKiDorqLljZXlj7fliJfooahcbiAgICAgKiAgICAgIG9yZGVyc1xuICAgICAqIH1cbiAgICAgKi9cbiAgICBhcHAucm91dGVyKCdmaW5kQ2Fubm90QnV5JywgYXN5bmMoIGN0eCwgbmV4dCApID0+IHtcbiAgICAgICAgdHJ5IHtcblxuICAgICAgICAgICAgY29uc3QgeyB0aWQsIGxpc3QgfSA9IGV2ZW50LmRhdGE7XG4gICAgICAgICAgICBjb25zdCBvcGVuSWQgPSBldmVudC5kYXRhLm9wZW5JZCB8fCBldmVudC51c2VySW5mby5vcGVuSWQ7XG5cbiAgICAgICAgICAgIGNvbnN0IGdldEVyciA9IG1lc3NhZ2UgPT4gKHtcbiAgICAgICAgICAgICAgICBtZXNzYWdlLCBcbiAgICAgICAgICAgICAgICBzdGF0dXM6IDUwMFxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIGlmICggIXRpZCApIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gY3R4LmJvZHkgPSBnZXRFcnIoJ+aXoOaViOihjOeoiycpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyDmn6Xor6LooYznqIvmmK/lkKbov5jmnInmlYhcbiAgICAgICAgICAgIGNvbnN0IHRyaXAkID0gYXdhaXQgZGIuY29sbGVjdGlvbigndHJpcCcpXG4gICAgICAgICAgICAgICAgLmRvYyggU3RyaW5nKCB0aWQgKSlcbiAgICAgICAgICAgICAgICAuZ2V0KCApO1xuXG4gICAgICAgICAgICBpZiAoIHRyaXAkLmRhdGEuaXNDbG9zZWQgfHwgbmV3IERhdGUoICkuZ2V0VGltZSggKSA+IHRyaXAkLmRhdGEuZW5kX2RhdGUgKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGN0eC5ib2R5ID0gZ2V0RXJyKCfmmoLml6DotK3nianooYznqIvvvZ4nKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8g5p+l6K+i5ZWG5ZOB6K+m5oOF44CB5oiW6ICF5Z6L5Y+36K+m5oOFXG4gICAgICAgICAgICBjb25zdCBnb29kRGV0YWlscyQ6IGFueSA9IGF3YWl0IFByb21pc2UuYWxsKCBldmVudC5kYXRhLmxpc3QubWFwKCBpID0+IHtcblxuICAgICAgICAgICAgICAgIGlmICggISFpLnNpZCApIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGRiLmNvbGxlY3Rpb24oJ3N0YW5kYXJkcycpXG4gICAgICAgICAgICAgICAgICAgICAgICAud2hlcmUoe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIF9pZDogaS5zaWRcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgICAgICAuZ2V0KCApXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGRiLmNvbGxlY3Rpb24oJ2dvb2RzJylcbiAgICAgICAgICAgICAgICAgICAgICAgIC53aGVyZSh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgX2lkOiBpLnBpZFxuICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgICAgIC5nZXQoIClcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KSk7XG5cbiAgICAgICAgICAgIC8qKiDlnovlj7fmiYDlsZ7llYblk4EgKi9cbiAgICAgICAgICAgIGNvbnN0IGJlbG9uZ0dvb2RJZHMgPSBBcnJheS5mcm9tKCBcbiAgICAgICAgICAgICAgICBuZXcgU2V0KFxuICAgICAgICAgICAgICAgICAgICBldmVudC5kYXRhLmxpc3RcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIC5maWx0ZXIoIGkgPT4gISFpLnNpZCApXG4gICAgICAgICAgICAgICAgICAgICAgICAubWFwKCBvID0+IG8ucGlkIClcbiAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICApO1xuXG4gICAgICAgICAgICBjb25zdCBiZWxvbmdHb29kcyQgPSBhd2FpdCBQcm9taXNlLmFsbCggYmVsb25nR29vZElkcy5tYXAoIHBpZCA9PiB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGRiLmNvbGxlY3Rpb24oJ2dvb2RzJylcbiAgICAgICAgICAgICAgICAgICAgLmRvYyggU3RyaW5nKCBwaWQgKSlcbiAgICAgICAgICAgICAgICAgICAgLmdldCggKTtcbiAgICAgICAgICAgIH0pKTtcbiAgICAgICAgICAgXG4gICAgICAgICAgICBjb25zdCBnb29kcyA9IGdvb2REZXRhaWxzJC5tYXAoIHggPT4geC5kYXRhWyAwIF0pLmZpbHRlciggeSA9PiAhIXkgKS5maWx0ZXIoIHogPT4gIXoucGlkICk7XG4gICAgICAgICAgICBjb25zdCBzdGFuZGFyZHMgPSBnb29kRGV0YWlscyQubWFwKCB4ID0+IHguZGF0YVsgMCBdKS5maWx0ZXIoIHkgPT4gISF5ICkuZmlsdGVyKCB6ID0+ICEhei5waWQgKTtcbiAgICAgICAgICAgIGNvbnN0IGJlbG9uZ0dvb2RzID0gYmVsb25nR29vZHMkLm1hcCggeCA9PiB4LmRhdGEgKTtcblxuICAgICAgICAgICAgLy8g6ZmQ6LStXG4gICAgICAgICAgICBsZXQgaGFzTGltaXRHb29kOiBhbnkgPSBbIF07XG5cbiAgICAgICAgICAgIC8vIOW6k+WtmOS4jei2s1xuICAgICAgICAgICAgbGV0IGxvd1N0b2NrOiBhbnkgPSBbIF07XG5cbiAgICAgICAgICAgIC8vIOiiq+WIoOmZpFxuICAgICAgICAgICAgbGV0IGhhc0JlZW5EZWxldGU6IGFueSA9IFsgXTtcblxuICAgICAgICAgICAgLy8g5Lmw5LiN5YiwXG4gICAgICAgICAgICBjb25zdCBjYW5ub3RCdXkgPSBbIF07XG5cbiAgICAgICAgICAgIC8vIOW3sue7j+iiq+i0reS5sOS6hu+8iOmjjumZqeWNle+8iVxuICAgICAgICAgICAgY29uc3QgaGFzQmVlbkJ1eSA9IFsgXTtcblxuICAgICAgICAgICAgZXZlbnQuZGF0YS5saXN0Lm1hcCggaSA9PiB7XG4gICAgICAgICAgICAgICAgLy8g5Z6L5Y+3IC0g6K6h566X5bey6KKr5Yig6Zmk44CB5bqT5a2Y5LiN6Laz44CB5Li75L2T5pys6Lqr6KKr5LiL5p62L+WIoOmZpFxuICAgICAgICAgICAgICAgIGlmICggISFpLnNpZCApIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgYmVsb25nR29vZCA9IGJlbG9uZ0dvb2RzLmZpbmQoIHggPT4geC5faWQgPT09IGkucGlkICk7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHN0YW5kYXJkID0gc3RhbmRhcmRzLmZpbmQoIHggPT4geC5faWQgPT09IGkuc2lkICYmIHgucGlkID09PSBpLnBpZCApO1xuXG4gICAgICAgICAgICAgICAgICAgIC8vIOWei+WPt+acrOi6q+iiq+WIoOmZpOOAgeS4u+S9k+acrOi6q+iiq+S4i+aeti/liKDpmaRcbiAgICAgICAgICAgICAgICAgICAgaWYgKCAhc3RhbmRhcmQgfHwgKCAhIXN0YW5kYXJkICYmIHN0YW5kYXJkLmlzRGVsZXRlICkgfHwgKCAhIWJlbG9uZ0dvb2QgJiYgIWJlbG9uZ0dvb2QudmlzaWFibGUgKSB8fCAoICEhYmVsb25nR29vZCAmJiBiZWxvbmdHb29kLmlzRGVsZXRlICkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGhhc0JlZW5EZWxldGUucHVzaCggaSApO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKCBzdGFuZGFyZC5zdG9jayAhPT0gdW5kZWZpbmVkICYmIHN0YW5kYXJkLnN0b2NrICE9PSBudWxsICYmICBzdGFuZGFyZC5zdG9jayA8IGkuY291bnQgKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBsb3dTdG9jay5wdXNoKCBPYmplY3QuYXNzaWduKHsgfSwgaSwge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0b2NrOiBzdGFuZGFyZC5zdG9jayxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBnb29kTmFtZTogaS5uYW1lLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0YW5kZXJOYW1lOiBpLnN0YW5kZXJuYW1lXG4gICAgICAgICAgICAgICAgICAgICAgICB9KSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAvLyDkuLvkvZPllYblk4EgLSDorqHnrpflt7LooqvliKDpmaTjgIHlupPlrZjkuI3otrNcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBnb29kID0gZ29vZHMuZmluZCggeCA9PiB4Ll9pZCA9PT0gaS5waWQgKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCAhZ29vZCB8fCAoICEhZ29vZCAmJiAhZ29vZC52aXNpYWJsZSApIHx8ICggISFnb29kICYmIGdvb2QuaXNEZWxldGUgKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaGFzQmVlbkRlbGV0ZS5wdXNoKCBpIClcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmICggZ29vZC5zdG9jayAhPT0gdW5kZWZpbmVkICYmIGdvb2Quc3RvY2sgIT09IG51bGwgJiYgZ29vZC5zdG9jayA8IGkuY291bnQgKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBsb3dTdG9jay5wdXNoKCBPYmplY3QuYXNzaWduKHsgfSwgaSwge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0b2NrOiBnb29kLnN0b2NrLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGdvb2ROYW1lOiBpLm5hbWVcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuXG5cbiAgICAgICAgICAgIC8vIOafpeivoumZkOi0rVxuICAgICAgICAgICAgY29uc3QgbGltaXRHb29kcyA9IGJlbG9uZ0dvb2RzLmZpbHRlciggeCA9PiAhIXgubGltaXQgKTtcblxuICAgICAgICAgICAgYXdhaXQgUHJvbWlzZS5hbGwoIGxpbWl0R29vZHMubWFwKCBhc3luYyBnb29kID0+IHtcblxuICAgICAgICAgICAgICAgIGNvbnN0IG9yZGVycyA9IGF3YWl0IGRiLmNvbGxlY3Rpb24oJ29yZGVyJylcbiAgICAgICAgICAgICAgICAgICAgLndoZXJlKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRpZCxcbiAgICAgICAgICAgICAgICAgICAgICAgIHBpZDogZ29vZC5faWQsXG4gICAgICAgICAgICAgICAgICAgICAgICBvcGVuaWQ6IG9wZW5JZCxcbiAgICAgICAgICAgICAgICAgICAgICAgIHBheV9zdGF0dXM6IF8ub3IoIF8uZXEoJzEnKSwgXy5lcSgnMicpKVxuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAuZ2V0KCApO1xuXG4gICAgICAgICAgICAgICAgY29uc3QgaGFzQmVlbkJ1eUNvdW50ID0gb3JkZXJzLmRhdGEucmVkdWNlKCggeCwgeSApID0+IHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHggKyB5LmNvdW50XG4gICAgICAgICAgICAgICAgfSwgMCApO1xuXG4gICAgICAgICAgICAgICAgY29uc3QgdGhpc1RyaXBCdXlDb3VudCA9IGV2ZW50LmRhdGEubGlzdFxuICAgICAgICAgICAgICAgICAgICAuZmlsdGVyKCB4ID0+IHgucGlkID09PSBnb29kLl9pZCApXG4gICAgICAgICAgICAgICAgICAgIC5yZWR1Y2UoKCB4LCB5ICkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHggKyB5LmNvdW50XG4gICAgICAgICAgICAgICAgICAgIH0sIDAgKTtcbiAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgaWYgKCB0aGlzVHJpcEJ1eUNvdW50ICsgaGFzQmVlbkJ1eUNvdW50ID4gZ29vZC5saW1pdCApIHtcbiAgICAgICAgICAgICAgICAgICAgaGFzTGltaXRHb29kLnB1c2goIGdvb2QgKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KSk7XG4gICAgICAgICAgICBcblxuICAgICAgICAgICAgbGV0IG9yZGVycyA9IFsgXTtcbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICog5aaC5p6c5Y+v5Lul6LSt5LmwXG4gICAgICAgICAgICAgKiAhIOaJuemHj+WIm+W7uumihOS7mOiuouWNlVxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICBpZiAoIGhhc0xpbWl0R29vZC5sZW5ndGggPT09IDAgJiYgbG93U3RvY2subGVuZ3RoID09PSAwICYmIGNhbm5vdEJ1eS5sZW5ndGggPT09IDAgJiYgaGFzQmVlbkRlbGV0ZS5sZW5ndGggPT09IDAgKSB7XG5cbiAgICAgICAgICAgICAgICBjb25zdCByZXFEYXRhID0ge1xuICAgICAgICAgICAgICAgICAgICB0aWQsXG4gICAgICAgICAgICAgICAgICAgIG9wZW5JZCxcbiAgICAgICAgICAgICAgICAgICAgZnJvbTogZXZlbnQuZGF0YS5mcm9tIHx8ICdzeXN0ZW0nLFxuICAgICAgICAgICAgICAgICAgICBvcmRlcnM6IGV2ZW50LmRhdGEubGlzdFxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGNvbnN0IGNyZWF0ZU9yZGVyJCA9IGF3YWl0IGNsb3VkLmNhbGxGdW5jdGlvbih7XG4gICAgICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRhdGE6IHJlcURhdGEsXG4gICAgICAgICAgICAgICAgICAgICAgICAkdXJsOiAnY3JlYXRlJ1xuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICBuYW1lOiAnb3JkZXInXG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICBpZiAoIGNyZWF0ZU9yZGVyJC5yZXN1bHQuc3RhdHVzICE9PSAyMDAgKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBjdHguYm9keSA9IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0YXR1czogNTAwLFxuICAgICAgICAgICAgICAgICAgICAgICAgbWVzc2FnZTogJ+WIm+W7uumihOS7mOiuouWNleWksei0pe+8gSdcbiAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgb3JkZXJzID0gY3JlYXRlT3JkZXIkLnJlc3VsdC5kYXRhO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gY3R4LmJvZHkgPSB7XG4gICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgICBvcmRlcnMsXG4gICAgICAgICAgICAgICAgICAgIGxvd1N0b2NrLFxuICAgICAgICAgICAgICAgICAgICBjYW5ub3RCdXksXG4gICAgICAgICAgICAgICAgICAgIGhhc0xpbWl0R29vZCxcbiAgICAgICAgICAgICAgICAgICAgaGFzQmVlbkJ1eSxcbiAgICAgICAgICAgICAgICAgICAgaGFzQmVlbkRlbGV0ZSxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHN0YXR1czogMjAwXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfSBjYXRjaCAoIGUgKSB7XG4gICAgIFxuICAgICAgICAgICAgcmV0dXJuIGN0eC5ib2R5ID0ge1xuICAgICAgICAgICAgICAgIHN0YXR1czogNTAwLFxuICAgICAgICAgICAgICAgIG1lc3NhZ2U6IGVcbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgIC8qKlxuICAgICAqIEBkZXNjcmlwdGlvblxuICAgICAqIOeUseiuouWNleWIm+W7uui0reeJqea4heWNlVxuICAgICAqIG9wZW5JZFxuICAgICAqIGxpc3Q6IHtcbiAgICAgKiAgICB0aWQsXG4gICAgICogICAgcGlkLFxuICAgICAqICAgIHNpZCxcbiAgICAgKiAgICBvaWQsXG4gICAgICogICAgcHJpY2UsXG4gICAgICogICAgZ3JvdXBQcmljZSxcbiAgICAgKiEgICBhY2lkXG4gICAgICogfVsgXVxuICAgICAqL1xuICAgIGFwcC5yb3V0ZXIoJ2NyZWF0ZScsIGFzeW5jKCBjdHgsIG5leHQgKSA9PiB7XG4gICAgICAgIHRyeSB7XG5cbiAgICAgICAgICAgIGNvbnN0IHsgbGlzdCwgb3BlbklkIH0gPSBldmVudC5kYXRhO1xuIFxuICAgICAgICAgICAgYXdhaXQgUHJvbWlzZS5hbGwoIGxpc3QubWFwKCBhc3luYyBvcmRlck1ldGEgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IHsgdGlkLCBwaWQsIHNpZCwgb2lkLCBwcmljZSwgZ3JvdXBQcmljZSwgYWNpZCB9ID0gb3JkZXJNZXRhO1xuICAgICAgICAgICAgICAgIGxldCBxdWVyeSA9IHtcbiAgICAgICAgICAgICAgICAgICAgdGlkLFxuICAgICAgICAgICAgICAgICAgICBwaWRcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIGlmICggISFzaWQgKSB7XG4gICAgICAgICAgICAgICAgICAgIHF1ZXJ5WydzaWQnXSA9IHNpZDtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAvLyDmj5LlhaXmtLvliqjnmoTmn6Xor6LmnaHku7ZcbiAgICAgICAgICAgICAgICBpZiAoICEhYWNpZCApIHtcbiAgICAgICAgICAgICAgICAgICAgcXVlcnkgPSBPYmplY3QuYXNzaWduKHsgfSwgcXVlcnksIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGFjaWRcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgY29uc3QgZmluZCQgPSBhd2FpdCBkYi5jb2xsZWN0aW9uKCdzaG9wcGluZy1saXN0JylcbiAgICAgICAgICAgICAgICAgICAgLndoZXJlKCBxdWVyeSApXG4gICAgICAgICAgICAgICAgICAgIC5nZXQoICk7XG5cbiAgICAgICAgICAgICAgICBpZiAoIGZpbmQkLmRhdGEubGVuZ3RoID09PSAwICkge1xuXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IG1ldGEgPSBPYmplY3QuYXNzaWduKHsgfSwgcXVlcnkse1xuICAgICAgICAgICAgICAgICAgICAgICAgYWNpZDogYWNpZCB8fCB1bmRlZmluZWRcbiAgICAgICAgICAgICAgICAgICAgfSx7XG4gICAgICAgICAgICAgICAgICAgICAgICBvaWRzOiBbIG9pZCBdLFxuICAgICAgICAgICAgICAgICAgICAgICAgdWlkczogWyBvcGVuSWQgXSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHB1cmNoYXNlOiAwLFxuICAgICAgICAgICAgICAgICAgICAgICAgYnV5X3N0YXR1czogJzAnLFxuICAgICAgICAgICAgICAgICAgICAgICAgYmFzZV9zdGF0dXM6ICcwJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGFkanVzdFByaWNlOiBwcmljZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGFkanVzdEdyb3VwUHJpY2U6IGdyb3VwUHJpY2UsXG4gICAgICAgICAgICAgICAgICAgICAgICBjcmVhdGVUaW1lOiBuZXcgRGF0ZSggKS5nZXRUaW1lKCApXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICBcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgY3JlYWV0JCA9IGF3YWl0IGRiLmNvbGxlY3Rpb24oJ3Nob3BwaW5nLWxpc3QnKVxuICAgICAgICAgICAgICAgICAgICAgICAgLmFkZCh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YTogbWV0YVxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuXG4gICAgICAgICAgICAgICAgLy8g5pu05paw5o+S5YWlXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgbGV0IG1ldGFTaG9wcGluZ0xpc3QgPSBmaW5kJC5kYXRhWyAwIF07XG4gICAgICAgICAgICAgICAgICAgIGlmICggIW1ldGFTaG9wcGluZ0xpc3Qub2lkcy5maW5kKCB4ID0+IHggPT09IG9pZCApKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBsYXN0T2lkcyA9IG1ldGFTaG9wcGluZ0xpc3Qub2lkcztcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGxhc3RVaWRzID0gbWV0YVNob3BwaW5nTGlzdC51aWRzO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyDmj5LlhaXliLDlpLTpg6jvvIzmnIDmlrDnmoTlt7LmlK/ku5jorqLljZXlsLHlnKjkuIrpnaJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxhc3RPaWRzLnVuc2hpZnQoIG9pZCApO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoICFsYXN0VWlkcy5maW5kKCB4ID0+IHggPT09IG9wZW5JZCApKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGFzdFVpZHMudW5zaGlmdCggb3BlbklkICk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHVwZGF0ZSQgPSBhd2FpdCBkYi5jb2xsZWN0aW9uKCdzaG9wcGluZy1saXN0JykuZG9jKCBTdHJpbmcoIGZpbmQkLmRhdGFbIDAgXS5faWQgKSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAudXBkYXRlKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb2lkczogbGFzdE9pZHMsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB1aWRzOiBsYXN0VWlkcyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHVwZGF0ZVRpbWU6IG5ldyBEYXRlKCApLmdldFRpbWUoIClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgfSkpO1xuXG4gICAgICAgICAgICByZXR1cm4gY3R4LmJvZHkgPSB7XG4gICAgICAgICAgICAgICAgc3RhdHVzOiAyMDBcbiAgICAgICAgICAgIH1cblxuICAgICAgICB9IGNhdGNoICggZSApIHsgcmV0dXJuIGN0eC5ib2R5ID0geyBzdGF0dXM6IDUwMCB9fVxuICAgIH0pO1xuXG4gICAgLyoqXG4gICAgICogQGRlc2NyaXB0aW9uIFxuICAgICAqIHtcbiAgICAgKiAgICAgdGlkLCBcbiAgICAgKiAgICAgbmVlZE9yZGVycyDmmK/lkKbpnIDopoHov5Tlm57orqLljZVcbiAgICAgKiB9XG4gICAgICog6KGM56iL55qE6LSt54mp5riF5Y2V77yM55So5LqO6LCD5pW05ZWG5ZOB5Lu35qC844CB6LSt5Lmw5pWw6YePXG4gICAgICovXG4gICAgYXBwLnJvdXRlcignbGlzdCcsIGFzeW5jKCBjdHgsIG5leHQgKSA9PiB7XG4gICAgICAgIHRyeSB7XG5cbiAgICAgICAgICAgIGxldCBvcmRlcnMkOiBhbnkgPSBbIF07XG5cbiAgICAgICAgICAgIGNvbnN0IHsgdGlkLCBuZWVkT3JkZXJzLCAgfSA9IGV2ZW50LmRhdGE7XG4gICAgICAgICAgICBjb25zdCBvcGVuaWQgPSBldmVudC5kYXRhLm9wZW5JZCB8fCBldmVudC51c2VySW5mby5vcGVuSWQ7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgLy8g5ou/5Yiw6KGM56iL5LiL5omA5pyJ55qE6LSt54mp5riF5Y2VXG4gICAgICAgICAgICBjb25zdCBsaXN0cyQgPSBhd2FpdCBkYi5jb2xsZWN0aW9uKCdzaG9wcGluZy1saXN0JylcbiAgICAgICAgICAgICAgICAud2hlcmUoe1xuICAgICAgICAgICAgICAgICAgICB0aWRcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIC5nZXQoICk7XG4gICAgICAgICAgIFxuICAgICAgICAgICAgLy8g5p+l6K+i5q+P5p2h5riF5Y2V5bqV5LiL55qE5q+P5Liqb3JkZXLor6bmg4XvvIzov5nph4znmoTmr4/kuKpvcmRlcumDveaYr+W3suS7mOiuoumHkeeahFxuICAgICAgICAgICAgaWYgKCBuZWVkT3JkZXJzICE9PSBmYWxzZcKgKSB7XG4gICAgICAgICAgICAgICAgb3JkZXJzJCA9IGF3YWl0IFByb21pc2UuYWxsKCBsaXN0cyQuZGF0YS5tYXAoIGxpc3QgPT4ge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gUHJvbWlzZS5hbGwoIGxpc3Qub2lkcy5tYXAoIGFzeW5jIG9pZCA9PiB7XG4gICAgXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBvcmRlciQgPSBhd2FpdCBkYi5jb2xsZWN0aW9uKCdvcmRlcicpLmRvYyggb2lkIClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAuZ2V0KCApO1xuICAgIFxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgdXNlciQgPSBhd2FpdCBkYi5jb2xsZWN0aW9uKCd1c2VyJylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAud2hlcmUoe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvcGVuaWQ6IG9yZGVyJC5kYXRhLm9wZW5pZFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLmdldCggKTtcbiAgICBcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBPYmplY3QuYXNzaWduKHsgfSwgb3JkZXIkLmRhdGEsIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB1c2VyOiB1c2VyJC5kYXRhWyAwIF1cbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICB9KSk7XG4gICAgICAgICAgICAgICAgfSkpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyDmn6Xor6Lmr4/mnaHmuIXljZXlupXkuIvmr4/kuKrllYblk4HnmoTor6bmg4VcbiAgICAgICAgICAgIGNvbnN0IGdvb2RzJDogYW55ID0gYXdhaXQgUHJvbWlzZS5hbGwoIGxpc3RzJC5kYXRhLm1hcCggYXN5bmMgbGlzdCA9PiB7XG5cbiAgICAgICAgICAgICAgICBjb25zdCB7IHBpZCwgc2lkIH0gPSBsaXN0O1xuICAgICAgICAgICAgICAgIGNvbnN0IGNvbGxlY3Rpb25OYW1lID0gISFzaWQgPyAnc3RhbmRhcmRzJyA6ICdnb29kcyc7XG5cbiAgICAgICAgICAgICAgICAvLyDlnovlj7dcbiAgICAgICAgICAgICAgICBsZXQgc3RhbmRhciQ6IGFueSA9IG51bGw7XG5cbiAgICAgICAgICAgICAgICAvLyDllYblk4FcbiAgICAgICAgICAgICAgICBjb25zdCBnb29kJCA9IGF3YWl0IGRiLmNvbGxlY3Rpb24oJ2dvb2RzJylcbiAgICAgICAgICAgICAgICAgICAgLmRvYyggcGlkIClcbiAgICAgICAgICAgICAgICAgICAgLmdldCggKTtcblxuICAgICAgICAgICAgICAgIGlmICggISFzaWQgKSB7XG4gICAgICAgICAgICAgICAgICAgIHN0YW5kYXIkID0gYXdhaXQgZGIuY29sbGVjdGlvbignc3RhbmRhcmRzJylcbiAgICAgICAgICAgICAgICAgICAgICAgIC5kb2MoIHNpZCApXG4gICAgICAgICAgICAgICAgICAgICAgICAuZ2V0KCApO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgICAgIHRhZzogZ29vZCQuZGF0YS50YWcsXG4gICAgICAgICAgICAgICAgICAgIHRpdGxlOiBnb29kJC5kYXRhLnRpdGxlLFxuICAgICAgICAgICAgICAgICAgICBuYW1lOiBzdGFuZGFyJCA/IHN0YW5kYXIkLmRhdGEubmFtZSA6ICcnLFxuICAgICAgICAgICAgICAgICAgICBwcmljZTogc3RhbmRhciQgPyBzdGFuZGFyJC5kYXRhLnByaWNlIDogZ29vZCQuZGF0YS5wcmljZSxcbiAgICAgICAgICAgICAgICAgICAgaW1nOiBzdGFuZGFyJCA/IHN0YW5kYXIkLmRhdGEuaW1nIDogZ29vZCQuZGF0YS5pbWdbIDAgXSxcbiAgICAgICAgICAgICAgICAgICAgZ3JvdXBQcmljZTogc3RhbmRhciQgPyBzdGFuZGFyJC5kYXRhLmdyb3VwUHJpY2UgOiBnb29kJC5kYXRhLmdyb3VwUHJpY2UsXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSkpO1xuXG4gICAgICAgICAgICAvLyDmn6Xor6LmuIXljZXlr7nlupTnmoTmtLvliqjor6bmg4VcbiAgICAgICAgICAgIGNvbnN0IGFjdGl2aXRpZXMkOiBhbnkgPSBhd2FpdCBQcm9taXNlLmFsbCggbGlzdHMkLmRhdGEubWFwKCBhc3luYyBsaXN0ID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCB7IGFjaWQgfSA9IGxpc3Q7XG4gICAgICAgICAgICAgICAgaWYgKCAhYWNpZCApIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGFjX3ByaWNlOiBudWxsLFxuICAgICAgICAgICAgICAgICAgICAgICAgYWNfZ3JvdXBQcmljZTogbnVsbFxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgbWV0YSA9IGF3YWl0IGRiLmNvbGxlY3Rpb24oJ2FjdGl2aXR5JylcbiAgICAgICAgICAgICAgICAgICAgICAgIC5kb2MoIFN0cmluZyggYWNpZCApKVxuICAgICAgICAgICAgICAgICAgICAgICAgLmdldCggKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGFjX3ByaWNlOiBtZXRhLmRhdGEuYWNfcHJpY2UsXG4gICAgICAgICAgICAgICAgICAgICAgICBhY19ncm91cFByaWNlOiBtZXRhLmRhdGEuYWNfZ3JvdXBQcmljZSxcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pKTtcblxuICAgICAgICAgICAgY29uc3QgbGlzdCA9IGxpc3RzJC5kYXRhLm1hcCgoIGwsIGsgKSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3QgeyBhY19ncm91cFByaWNlLCBhY19wcmljZSB9ID0gYWN0aXZpdGllcyRbIGsgXTtcbiAgICAgICAgICAgICAgICBjb25zdCB7IGltZywgcHJpY2UsIGdyb3VwUHJpY2UsIHRpdGxlLCBuYW1lLCB0YWcgfSA9IGdvb2RzJFsgayBdO1xuICAgICAgICAgICAgICAgIGxldCBtZXRhID0gT2JqZWN0LmFzc2lnbih7IH0sIGwsIHtcbiAgICAgICAgICAgICAgICAgICAgdGFnLFxuICAgICAgICAgICAgICAgICAgICBpbWcsXG4gICAgICAgICAgICAgICAgICAgIHByaWNlLFxuICAgICAgICAgICAgICAgICAgICBncm91cFByaWNlLFxuICAgICAgICAgICAgICAgICAgICBnb29kTmFtZTogdGl0bGUsXG4gICAgICAgICAgICAgICAgICAgIHN0YW5kYXJOYW1lOiBuYW1lLFxuICAgICAgICAgICAgICAgICAgICBhY19ncm91cFByaWNlLFxuICAgICAgICAgICAgICAgICAgICBhY19wcmljZVxuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgaWYgKCBuZWVkT3JkZXJzICE9PSBmYWxzZSApIHtcbiAgICAgICAgICAgICAgICAgICAgbWV0YSA9IE9iamVjdC5hc3NpZ24oeyB9LCBtZXRhLCB7XG4gICAgICAgICAgICAgICAgICAgICAgICBvcmRlcjogb3JkZXJzJFsgayBdLFxuICAgICAgICAgICAgICAgICAgICAgICAgdG90YWw6IG9yZGVycyRbIGsgXS5yZWR1Y2UoKCB4LCB5ICkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB4ICsgeS5jb3VudDtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sIDAgKVxuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHJldHVybiBtZXRhO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHJldHVybiBjdHguYm9keSA9IHtcbiAgICAgICAgICAgICAgICBzdGF0dXM6IDIwMCxcbiAgICAgICAgICAgICAgICBkYXRhOiBsaXN0LFxuICAgICAgICAgICAgfVxuXG4gICAgICAgIH0gY2F0Y2ggKCBlICkgeyByZXR1cm4gY3R4LmJvZHkgPSB7IHN0YXR1czogNTAwIH07fVxuICAgIH0pXG5cbiAgICAvKipcbiAgICAgKiDotK3nianmuIXljZXosIPmlbRcbiAgICAgKiAtLS0tLS0tLSDor7fmsYJcbiAgICAgKiB7XG4gICAgICogICAgc2hvcHBpbmdJZCwgYWRqdXN0UHJpY2UsIHB1cmNoYXNlLCBhZGp1c3RHcm91cFByaWNlXG4gICAgICogfVxuICAgICAqL1xuICAgIGFwcC5yb3V0ZXIoJ2FkanVzdCcsIGFzeW5jKCBjdHgsIG5leHQgKSA9PiB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGNvbnN0IHsgc2hvcHBpbmdJZCwgYWRqdXN0UHJpY2UsIGFkanVzdEdyb3VwUHJpY2UgfSA9IGV2ZW50LmRhdGE7XG5cbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICog5riF5Y2V77yM5YWI5ou/5Yiw6K6i5Y2V6YeH6LSt5oC75pWwXG4gICAgICAgICAgICAgKiDpmo/lkI7mm7TmlrDvvJrph4fotK3ph4/jgIHmuIXljZXllK7ku7fjgIHmuIXljZXlm6LotK3ku7fjgIFiYXNlX3N0YXR1c+OAgWJ1eV9zdGF0dXNcbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgY29uc3Qgc2hvcHBpbmckID0gYXdhaXQgZGIuY29sbGVjdGlvbignc2hvcHBpbmctbGlzdCcpXG4gICAgICAgICAgICAgICAgLmRvYyggc2hvcHBpbmdJZCApXG4gICAgICAgICAgICAgICAgLmdldCggKTtcbiAgIFxuICAgICAgICAgICAgY29uc29sZS5sb2coJzExMTExMScsIHNob3BwaW5nJCApO1xuXG4gICAgICAgICAgICBjb25zdCBvcmRlcnMkID0gYXdhaXQgUHJvbWlzZS5hbGwoIHNob3BwaW5nJC5kYXRhLm9pZHMubWFwKCBvaWQgPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiBkYi5jb2xsZWN0aW9uKCdvcmRlcicpXG4gICAgICAgICAgICAgICAgICAgIC5kb2MoIG9pZCApXG4gICAgICAgICAgICAgICAgICAgIC5nZXQoICk7XG4gICAgICAgICAgICB9KSk7XG5cbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCcyMjIyMjIyJywgb3JkZXJzJCApO1xuXG4gICAgICAgICAgICAvLyDliankvZnliIbphY3ph49cbiAgICAgICAgICAgIGxldCBsYXN0QWxsb2NhdGVkID0gMDtcblxuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiDmgLvliIbphY3ph49cbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgbGV0IHB1cmNoYXNlID0gZXZlbnQuZGF0YS5wdXJjaGFzZTtcblxuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiAhIOS8oOWFpeWIhumFjemHj+S4jeiDveWwkeS6juOAguW3suWujOaIkOWIhumFjeiuouWNleeahOaVsOmineS5i+WSjFxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICBjb25zdCBmaW5pc2hBZGp1c3RPcmRlcnMgPSBvcmRlcnMkXG4gICAgICAgICAgICAgICAgLm1hcCgoIHg6IGFueSApID0+IHguZGF0YSApXG4gICAgICAgICAgICAgICAgLmZpbHRlciggbyA9PiBvLmJhc2Vfc3RhdHVzID09PSAnMicgKTtcblxuICAgICAgICAgICAgY29uc29sZS5sb2coJzMzMzMzMycsIGZpbmlzaEFkanVzdE9yZGVycyk7XG5cbiAgICAgICAgICAgIC8vIOW3suWIhumFjemHj1xuICAgICAgICAgICAgY29uc3QgaGFzQmVlbkFkanVzdCA9IGZpbmlzaEFkanVzdE9yZGVycy5yZWR1Y2UoKCB4LCB5ICkgPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiB4ICsgeS5hbGxvY2F0ZWRDb3VudDtcbiAgICAgICAgICAgIH0sIDAgKTtcblxuICAgICAgICAgICAgY29uc29sZS5sb2coJzQ0NDQ0NCcsIGhhc0JlZW5BZGp1c3QgKTtcblxuICAgICAgICAgICAgaWYgKCBwdXJjaGFzZSA8IGhhc0JlZW5BZGp1c3QgKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGN0eC5ib2R5ID0ge1xuICAgICAgICAgICAgICAgICAgICBzdGF0dXM6IDUwMCxcbiAgICAgICAgICAgICAgICAgICAgbWVzc2FnZTogYOaciSR7ZmluaXNoQWRqdXN0T3JkZXJzLmxlbmd0aH3kuKrorqLljZXlt7Lnoa7orqTvvIzmlbDph4/kuI3og73lsJHkuo4ke2hhc0JlZW5BZGp1c3R95Lu2YFxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIFxuICAgICAgICAgICAgbGV0IG5lZWRCdXlUb3RhbCA9IG9yZGVycyQucmVkdWNlKCggeCwgeSApID0+IHtcbiAgICAgICAgICAgICAgICByZXR1cm4geCArICh5IGFzIGFueSkuZGF0YS5jb3VudDtcbiAgICAgICAgICAgIH0sIDAgKTtcblxuICAgICAgICAgICAgY29uc3QgdGVtcCA9IE9iamVjdC5hc3NpZ24oeyB9LCBzaG9wcGluZyQuZGF0YSwge1xuICAgICAgICAgICAgICAgIHB1cmNoYXNlLFxuICAgICAgICAgICAgICAgIGFkanVzdFByaWNlLFxuICAgICAgICAgICAgICAgIGFkanVzdEdyb3VwUHJpY2UsXG4gICAgICAgICAgICAgICAgYmFzZV9zdGF0dXM6ICcxJyxcbiAgICAgICAgICAgICAgICBidXlfc3RhdHVzOiBwdXJjaGFzZSA8IG5lZWRCdXlUb3RhbCA/ICcyJyA6ICcxJyxcbiAgICAgICAgICAgICAgICB1cGRhdGVUaW1lOiBuZXcgRGF0ZSggKS5nZXRUaW1lKCApXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgZGVsZXRlIHRlbXBbJ19pZCddO1xuXG4gICAgICAgICAgICBjb25zb2xlLmxvZygnNTU1NTU1JywgdGVtcClcblxuICAgICAgICAgICAgLy8g5pu05paw5riF5Y2VXG4gICAgICAgICAgICBhd2FpdCBkYi5jb2xsZWN0aW9uKCdzaG9wcGluZy1saXN0JylcbiAgICAgICAgICAgICAgICAuZG9jKCBzaG9wcGluZ0lkIClcbiAgICAgICAgICAgICAgICAuc2V0KHtcbiAgICAgICAgICAgICAgICAgICAgZGF0YTogdGVtcFxuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqICHku6XkuIvorqLljZXpg73mmK/lt7Lku5jorqLph5HnmoRcbiAgICAgICAgICAgICAqIOiuouWNle+8muaJuemHj+WvueiuouWNleeahOS7t+agvOOAgeWboui0reS7t+OAgei0reS5sOeKtuaAgei/m+ihjOiwg+aVtCjlt7LotK3kubAv6L+b6KGM5Lit77yM5YW25LuW5bey57uP56Gu5a6a6LCD5pW055qE6K6i5Y2V77yM5LiN5YGa5aSE55CGKVxuICAgICAgICAgICAgICog5YW25a6e5bqU6K+l5Lmf6KaB6Ieq5Yqo5rOo5YWl6K6i5Y2V5pWw6YeP77yI562W55Wl77ya5YWI5Yiw5YWI5b6X77yM5ZCO5LiL5Y2V5Lya5pyJ5b6X5LiN5Yiw5Y2V55qE6aOO6Zmp77yJXG4gICAgICAgICAgICAgKiAh5aaC5p6c5bey57uP5YiG6YWN6L+H5LqG77yM5YiZ5LiN5YaN6Ieq5Yqo5YiG6YWN6YeH6LSt6YePXG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIGNvbnN0IHNvcnJlZE9yZGVycyA9IG9yZGVycyRcbiAgICAgICAgICAgICAgICAubWFwKCggeDogYW55ICkgPT4geC5kYXRhIClcbiAgICAgICAgICAgICAgICAuZmlsdGVyKCggeDogYW55ICkgPT4geC5iYXNlX3N0YXR1cyA9PT0gJzAnIHx8IHguYmFzZV9zdGF0dXMgPT09ICcxJyApXG4gICAgICAgICAgICAgICAgLnNvcnQoKCB4OiBhbnksIHk6IGFueSApID0+IHguY3JlYXRlVGltZSAtIHkuY3JlYXRlVGltZSApO1xuXG4gICAgICAgICAgICBjb25zb2xlLmxvZygnNjY2NjY2Jywgc29ycmVkT3JkZXJzICk7XG5cbiAgICAgICAgICAgIC8vIOWJqeS9meWIhumFjemHj1xuICAgICAgICAgICAgcHVyY2hhc2UgLT0gaGFzQmVlbkFkanVzdDtcblxuICAgICAgICAgICAgY29uc29sZS5sb2coICc3NzcnLCBwdXJjaGFzZSApO1xuICAgICAgICBcbiAgICAgICAgICAgIGF3YWl0IFByb21pc2UuYWxsKCBzb3JyZWRPcmRlcnMubWFwKCBhc3luYyBvcmRlciA9PiB7XG5cbiAgICAgICAgICAgICAgICBjb25zdCBiYXNlVGVtcCA9IHtcbiAgICAgICAgICAgICAgICAgICAgYWxsb2NhdGVkUHJpY2U6IGFkanVzdFByaWNlLFxuICAgICAgICAgICAgICAgICAgICBhbGxvY2F0ZWRHcm91cFByaWNlOiBhZGp1c3RHcm91cFByaWNlLFxuICAgICAgICAgICAgICAgICAgICAvLyDml6Dorrroh6rliqjliIbphY3mmK/lkKbmiJDlip/vvIzpg73mmK/ooqvigJzliIbphY3igJ3mk43kvZzov4fnmoRcbiAgICAgICAgICAgICAgICAgICAgYmFzZV9zdGF0dXM6ICcxJyxcbiAgICAgICAgICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgICAgICAgICAqICEgdjE6IOWJqeS9meWIhumFjemHj+S4jei2s+mHh+i0remHj+WwseWIhumFjTBcbiAgICAgICAgICAgICAgICAgICAgICogISB2Mjog5Ymp5L2Z5YiG6YWN6YeP5LiN6Laz6YeH6LSt6YeP77yM5bCx5YiG6YWN5Ymp5L2Z55qE6YeH6LSt6YePXG4gICAgICAgICAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgICAgICAgICAvLyBhbGxvY2F0ZWRDb3VudDogcHVyY2hhc2UgLSBvcmRlci5jb3VudCA+PSAwID8gb3JkZXIuY291bnQgOiAwXG4gICAgICAgICAgICAgICAgICAgIGFsbG9jYXRlZENvdW50OiBwdXJjaGFzZSAtIG9yZGVyLmNvdW50ID49IDAgP1xuICAgICAgICAgICAgICAgICAgICAgICAgb3JkZXIuY291bnQgOlxuICAgICAgICAgICAgICAgICAgICAgICAgcHVyY2hhc2VcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIC8vIOWIhumFjeaIkOWKn1xuICAgICAgICAgICAgICAgIGlmICggcHVyY2hhc2UgLSBvcmRlci5jb3VudCA+PSAwICkge1xuICAgICAgICAgICAgICAgICAgICBsYXN0QWxsb2NhdGVkID0gcHVyY2hhc2UgLSBvcmRlci5jb3VudDtcbiAgICAgICAgICAgICAgICAgICAgcHVyY2hhc2UgLT0gb3JkZXIuY291bnQ7XG5cbiAgICAgICAgICAgICAgICAvLyDotKfmupDkuI3otrPvvIzliIbphY3mnIDlkI7nmoTliankvZnph49cbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBsYXN0QWxsb2NhdGVkID0gMDtcbiAgICAgICAgICAgICAgICAgICAgcHVyY2hhc2UgPSAwO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGNvbnN0IHRlbXAgPSBPYmplY3QuYXNzaWduKHsgfSwgb3JkZXIsIGJhc2VUZW1wICk7XG5cbiAgICAgICAgICAgICAgICBkZWxldGUgdGVtcFsnX2lkJ107XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgYXdhaXQgZGIuY29sbGVjdGlvbignb3JkZXInKVxuICAgICAgICAgICAgICAgICAgICAuZG9jKCBvcmRlci5faWQgKVxuICAgICAgICAgICAgICAgICAgICAuc2V0KHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRhdGE6IHRlbXBcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuXG4gICAgICAgICAgICB9KSk7XG5cbiAgICAgICAgICAgIC8vIOabtOaWsOa4heWNleeahOWJqeS9meWIhumFjeaVsFxuICAgICAgICAgICAgYXdhaXQgZGIuY29sbGVjdGlvbignc2hvcHBpbmctbGlzdCcpXG4gICAgICAgICAgICAgICAgLmRvYyggc2hvcHBpbmdJZCApXG4gICAgICAgICAgICAgICAgLnVwZGF0ZSh7XG4gICAgICAgICAgICAgICAgICAgIGRhdGE6IHsgbGFzdEFsbG9jYXRlZCB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgIFxuICAgICAgICAgICAgcmV0dXJuIGN0eC5ib2R5ID0ge1xuICAgICAgICAgICAgICAgIHN0YXR1czogMjAwXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfSBjYXRjaCAoIGUgKSB7IHJldHVybiBjdHguYm9keSA9IHsgc3RhdHVzOiA1MDAgfTt9XG4gICAgfSlcblxuICAgIC8qKlxuICAgICAqIEBkZXNjcmlwdGlvblxuICAgICAqIOiOt+WPluihjOeoi+mHjOaYr+WQpui/mOacieacquiwg+aVtOeahOa4heWNlVxuICAgICovXG4gICAgYXBwLnJvdXRlcignYWRqdXN0LXN0YXR1cycsIGFzeW5jKCBjdHgsIG5leHQgKSA9PiB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBjb25zdCB7IHRpZCB9ID0gZXZlbnQuZGF0YTtcbiAgICAgICAgICAgIGNvbnN0IGNvdW50ID0gYXdhaXQgZGIuY29sbGVjdGlvbignc2hvcHBpbmctbGlzdCcpXG4gICAgICAgICAgICAgICAgLndoZXJlKHtcbiAgICAgICAgICAgICAgICAgICAgdGlkLFxuICAgICAgICAgICAgICAgICAgICBiYXNlX3N0YXR1czogJzAnXG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAuY291bnQoICk7XG5cbiAgICAgICAgICAgIHJldHVybiBjdHguYm9keSA9IHtcbiAgICAgICAgICAgICAgICBzdGF0dXM6IDIwMCxcbiAgICAgICAgICAgICAgICBkYXRhOiBjb3VudC50b3RhbFxuICAgICAgICAgICAgfVxuXG4gICAgICAgIH0gY2F0Y2ggKCBlICkge1xuICAgICAgICAgICAgcmV0dXJuIGN0eC5ib2R5ID0geyBzdGF0dXM6IDUwMCB9O1xuICAgICAgICB9XG4gICAgfSlcblxuICAgIC8qKlxuICAgICAqIEBkZXNjcmlwdGlvblxuICAgICAqIOetieW+heaLvOWbouWIl+ihqCAvIOWPr+aLvOWbouWIl+ihqCAoIOWPr+aMh+WumuWVhuWTgTog5ZWG5ZOB6K+m5oOF6aG16Z2iIClcbiAgICAgKiB7XG4gICAgICogICAgdGlkLFxuICAgICAqICAgIHBpZCxcbiAgICAgKiAgICBsaW1pdFxuICAgICAqICAgIGRldGFpbDogYm9vbGVhbiDmmK/lkKbluKblm57llYblk4Hor6bmg4XvvIjpu5jorqTluKblm57vvIlcbiAgICAgKiAgICBzaG93VXNlcjogYm9vbGVhbiDmmK/lkKbpnIDopoHnlKjmiLflpLTlg4/nrYnkv6Hmga/vvIjpu5jorqTkuI3luKblm57vvIlcbiAgICAgKiAgICB0eXBlOiAgJ3dhaXQnIHwgJ3BpbicgfCAnYWxsJyAvLyDnrYnlvoXmi7zlm6LjgIHlt7Lmi7zlm6LjgIHnrYnlvoXmi7zlm6Ir5bey5ou85Zui44CB5omA5pyJ6LSt54mp5riF5rehXG4gICAgICogfVxuICAgICAqL1xuICAgIGFwcC5yb3V0ZXIoJ3BpbicsIGFzeW5jKCBjdHgsIG5leHQgKSA9PiB7XG4gICAgICAgIHRyeSB7XG5cbiAgICAgICAgICAgIGxldCBianBDb25maWc6IGFueSA9IG51bGw7XG4gICAgICAgICAgICBjb25zdCBvcGVuaWQgPSBldmVudC51c2VySW5mby5vcGVuSWQ7XG4gICAgICAgICAgICBjb25zdCB7IHRpZCwgZGV0YWlsLCBwaWQsIHR5cGUsIGxpbWl0IH0gPSBldmVudC5kYXRhO1xuICAgICAgICAgICAgY29uc3Qgc2hvd1VzZXIgPSBldmVudC5kYXRhLnNob3dVc2VyIHx8IGZhbHNlO1xuXG4gICAgICAgICAgICBjb25zdCBxdWVyeSA9IHBpZCA/IHtcbiAgICAgICAgICAgICAgICB0aWQsXG4gICAgICAgICAgICAgICAgcGlkXG4gICAgICAgICAgICB9IDoge1xuICAgICAgICAgICAgICAgIHRpZFxuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgbGV0IHNob3BwaW5nJDtcbiAgICAgICAgICAgIGlmICggbGltaXQgKSB7XG4gICAgICAgICAgICAgICAgc2hvcHBpbmckID0gYXdhaXQgZGIuY29sbGVjdGlvbignc2hvcHBpbmctbGlzdCcpXG4gICAgICAgICAgICAgICAgICAgIC53aGVyZSggcXVlcnkgKVxuICAgICAgICAgICAgICAgICAgICAubGltaXQoIGxpbWl0IClcbiAgICAgICAgICAgICAgICAgICAgLmdldCggKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgc2hvcHBpbmckID0gYXdhaXQgZGIuY29sbGVjdGlvbignc2hvcHBpbmctbGlzdCcpXG4gICAgICAgICAgICAgICAgICAgIC53aGVyZSggcXVlcnkgKVxuICAgICAgICAgICAgICAgICAgICAuZ2V0KCApO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgXG4gICAgICAgICAgICAvLyDkv53lgaXlk4HphY3nva5cbiAgICAgICAgICAgIGNvbnN0IGJqcENvbmZpZyQgPSBhd2FpdCBkYi5jb2xsZWN0aW9uKCdhcHAtY29uZmlnJylcbiAgICAgICAgICAgIC53aGVyZSh7XG4gICAgICAgICAgICAgICAgdHlwZTogJ2FwcC1ianAtdmlzaWJsZSdcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAuZ2V0KCApO1xuICAgICAgICAgICAgYmpwQ29uZmlnID0gYmpwQ29uZmlnJC5kYXRhWyAwIF07XG5cbiAgICAgICAgICAgIC8vIHVpZHPplb/luqbkuLox77yM5Li65b6F5ou85YiX6KGoICgg5p+l6K+i5b6F5ou85YiX6KGo5pe277yM5Y+v5Lul5pyJ6Ieq5bex77yM6K6p5a6i5oi355+l6YGT57O757uf5Lya5YiX5Ye65p2lIClcbiAgICAgICAgICAgIC8vIHVpZHPplb/luqbkuLoy77yM5Li65Y+v5Lul5ou85Zui5YiX6KGoXG4gICAgICAgICAgICBsZXQgZGF0YTogYW55ID0gWyBdO1xuICAgICAgICAgICAgbGV0IGRhdGEkID0gc2hvcHBpbmckLmRhdGEuZmlsdGVyKCBzID0+IHtcbiAgICAgICAgICAgICAgICBpZiAoIHR5cGUgPT09ICdwaW4nICkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gKCAhIXMuYWRqdXN0R3JvdXBQcmljZSB8fCAhIXMuZ3JvdXBQcmljZSApICYmIHMudWlkcy5sZW5ndGggPiAxO1xuXG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmICggdHlwZSA9PT0gJ3dhaXQnICkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gKCAhIXMuYWRqdXN0R3JvdXBQcmljZSB8fCAhIXMuZ3JvdXBQcmljZSApICYmIHMudWlkcy5sZW5ndGggPT09IDE7XG5cbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKCB0eXBlID09PSB1bmRlZmluZWQgKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAoICEhcy5hZGp1c3RHcm91cFByaWNlIHx8ICEhcy5ncm91cFByaWNlICk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIGRhdGEkID0gZGF0YSQuc29ydCgoIHgsIHkgKSA9PiB5LnVpZHMubGVuZ3RoIC0geC51aWRzLmxlbmd0aCApO1xuICAgICAgICAgICAgZGF0YSA9IGRhdGEkO1xuXG4gICAgICAgICAgICAvLyDllYblk4FcbiAgICAgICAgICAgIGNvbnN0IGdvb2RJZHMgPSBBcnJheS5mcm9tKFxuICAgICAgICAgICAgICAgIG5ldyBTZXQoIGRhdGEkLm1hcCggbGlzdCA9PiBcbiAgICAgICAgICAgICAgICAgICAgbGlzdC5waWRcbiAgICAgICAgICAgICAgICApKVxuICAgICAgICAgICAgKTtcblxuICAgICAgICAgICAgLy8g5Z6L5Y+3XG4gICAgICAgICAgICBjb25zdCBzdGFuZGFyc0lkcyA9IEFycmF5LmZyb20oXG4gICAgICAgICAgICAgICAgbmV3IFNldCggZGF0YSQubWFwKCBsaXN0ID0+IFxuICAgICAgICAgICAgICAgICAgICBsaXN0LnNpZFxuICAgICAgICAgICAgICAgICkpXG4gICAgICAgICAgICApLmZpbHRlciggeCA9PiAhIXggKTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgLy8g5ZWG5ZOBXG4gICAgICAgICAgICBsZXQgYWxsR29vZHMkOiBhbnkgPSBhd2FpdCBQcm9taXNlLmFsbCggZ29vZElkcy5tYXAoIGdvb2RJZCA9PiB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGRiLmNvbGxlY3Rpb24oJ2dvb2RzJylcbiAgICAgICAgICAgICAgICAgICAgLmRvYyggU3RyaW5nKCBnb29kSWQgKSlcbiAgICAgICAgICAgICAgICAgICAgLmdldCggKTtcbiAgICAgICAgICAgIH0pKTtcblxuICAgICAgICAgICAgYWxsR29vZHMkID0gYWxsR29vZHMkLm1hcCggeCA9PiB4LmRhdGEgKTtcblxuICAgICAgICAgICAgLy8g5Z6L5Y+3XG4gICAgICAgICAgICBsZXQgYWxsU3RhbmRhcnMkOiBhbnkgPSBhd2FpdCBQcm9taXNlLmFsbCggc3RhbmRhcnNJZHMubWFwKCBzaWQgPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiBkYi5jb2xsZWN0aW9uKCdzdGFuZGFyZHMnKVxuICAgICAgICAgICAgICAgICAgICAuZG9jKCBTdHJpbmcoIHNpZCApKVxuICAgICAgICAgICAgICAgICAgICAuZ2V0KCApO1xuICAgICAgICAgICAgfSkpO1xuXG4gICAgICAgICAgICBhbGxTdGFuZGFycyQgPSBhbGxTdGFuZGFycyQubWFwKCB4ID0+IHguZGF0YSApO1xuXG4gICAgICAgICAgICAvLyDmn6Xor6Lmr4/mnaHmuIXljZXlupXkuIvmr4/kuKrllYblk4HnmoTor6bmg4VcbiAgICAgICAgICAgIGlmICggZGV0YWlsID09PSB1bmRlZmluZWQgfHwgISFkZXRhaWwgKSB7XG5cbiAgICAgICAgICAgICAgICBjb25zdCBnb29kJCA9IGRhdGEkLm1hcCggbGlzdCA9PiB7XG5cbiAgICAgICAgICAgICAgICAgICAgY29uc3QgeyBwaWQsIHNpZCB9ID0gbGlzdDtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgZ29vZDogYW55ID0gYWxsR29vZHMkLmZpbmQoIHggPT4geC5faWQgPT09IHBpZCApO1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBzdGFuZGFyID0gYWxsU3RhbmRhcnMkLmZpbmQoIHggPT4geC5faWQgPT09IHNpZCApO1xuICAgIFxuICAgICAgICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgZ29vZCxcbiAgICAgICAgICAgICAgICAgICAgICAgIHRhZzogZ29vZC50YWcsXG4gICAgICAgICAgICAgICAgICAgICAgICB0aXRsZTogZ29vZC50aXRsZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHNhbGVkOiBnb29kLnNhbGVkLFxuICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogc3RhbmRhciA/IHN0YW5kYXIubmFtZSA6ICcnLFxuICAgICAgICAgICAgICAgICAgICAgICAgcHJpY2U6IHN0YW5kYXIgPyBzdGFuZGFyLnByaWNlIDogZ29vZC5wcmljZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGltZzogc3RhbmRhciA/IHN0YW5kYXIuaW1nIDogZ29vZC5pbWdbIDAgXSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGdyb3VwUHJpY2U6IHN0YW5kYXIgPyBzdGFuZGFyLmdyb3VwUHJpY2UgOiBnb29kLmdyb3VwUHJpY2UsXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICBcbiAgICAgICAgICAgICAgICAvLyDms6jlhaXllYblk4Hor6bmg4VcbiAgICAgICAgICAgICAgICBkYXRhID0gZGF0YSQubWFwKCggc2hvcHBpbmcsIGsgKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBPYmplY3QuYXNzaWduKHsgfSwgc2hvcHBpbmcsIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRldGFpbDogZ29vZCRbIGsgXVxuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIOWxleekuueUqOaIt+WktOWDj1xuICAgICAgICAgICAgaWYgKCBzaG93VXNlciApIHtcblxuICAgICAgICAgICAgICAgIGxldCB1aWRzOiBzdHJpbmdbIF0gPSBbIF07XG4gICAgICAgICAgICAgICAgZGF0YSQubWFwKCBsaXN0ID0+IHtcbiAgICAgICAgICAgICAgICAgICAgdWlkcyA9IFsgLi4udWlkcywgLi4ubGlzdC51aWRzIF07XG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICB1aWRzID0gQXJyYXkuZnJvbShcbiAgICAgICAgICAgICAgICAgICAgbmV3IFNldCggdWlkcyApXG4gICAgICAgICAgICAgICAgKTtcbiBcbiAgICAgICAgICAgICAgICBsZXQgdXNlcnMkOiBhbnkgPSBhd2FpdCBQcm9taXNlLmFsbCggdWlkcy5tYXAoIHVpZCA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBkYi5jb2xsZWN0aW9uKCd1c2VyJylcbiAgICAgICAgICAgICAgICAgICAgICAgIC53aGVyZSh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb3BlbmlkOiB1aWRcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgICAgICAuZmllbGQoe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9wZW5pZDogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhdmF0YXJVcmw6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbmlja05hbWU6IHRydWVcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgICAgICAuZ2V0KCApO1xuICAgICAgICAgICAgICAgIH0pKTtcblxuICAgICAgICAgICAgICAgIHVzZXJzJCA9IHVzZXJzJC5tYXAoIHggPT4geC5kYXRhWyAwIF0pO1xuXG4gICAgICAgICAgICAgICAgZGF0YSA9IGRhdGEubWFwKCggc2hvcHBpbmcsIGsgKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBPYmplY3QuYXNzaWduKHsgfSwgc2hvcHBpbmcsIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHVzZXJzOiBzaG9wcGluZy51aWRzLm1hcCggdWlkID0+IHVzZXJzJC5maW5kKCB4ID0+IHgub3BlbmlkID09PSB1aWQgKSlcbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgXG4gICAgICAgICAgICAvLyDmoLnmja7kv53lgaXlk4Horr7nva7ov5vooYznm7jlupTnmoTov4fmu6RcbiAgICAgICAgICAgIGlmICggISFianBDb25maWcgJiYgIWJqcENvbmZpZy52YWx1ZSApIHtcbiAgICAgICAgICAgICAgICBjb25zdCBtZXRhID0gZGF0YVxuICAgICAgICAgICAgICAgICAgICAuZmlsdGVyKCB4ID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGdvb2QgPSBhbGxHb29kcyQuZmluZCggeSA9PiB5Ll9pZCA9PT0geC5waWQgKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBTdHJpbmcoIGdvb2QuY2F0ZWdvcnkgKSAhPT0gJzQnXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIGRhdGEgPSBtZXRhO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gY3R4LmJvZHkgPSB7XG4gICAgICAgICAgICAgICAgZGF0YSxcbiAgICAgICAgICAgICAgICBzdGF0dXM6IDIwMFxuICAgICAgICAgICAgfVxuXG4gICAgICAgIH0gY2F0Y2ggKCBlICkge1xuICAgICAgICAgICAgcmV0dXJuIGN0eC5ib2R5ID0geyBzdGF0dXM6IDUwMCB9O1xuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICAvKiogXG4gICAgICogQGRlc2NyaXB0aW9uXG4gICAgICog5LuZ5aWz6LSt54mp5riF5Y2VICgg5Lmw5LqG5aSa5bCR44CB5Y2h5Yi45aSa5bCR44CB55yB5LqG5aSa5bCRIClcbiAgICAgKi9cbiAgICBhcHAucm91dGVyKCdmYWlyeS1zaG9wcGluZ2xpc3QnLCBhc3luYyggY3R4LCBuZXh0ICkgPT4ge1xuICAgICAgICB0cnkge1xuXG4gICAgICAgICAgICBjb25zdCB7IHRpZCB9ID0gZXZlbnQuZGF0YTtcbiAgICAgICAgICAgIGNvbnN0IGxpbWl0ID0gZXZlbnQuZGF0YS5saW1pdCB8fCA1O1xuXG4gICAgICAgICAgICAvKiog6KGM56iL6LSt54mp5riF5Y2VICovXG4gICAgICAgICAgICBjb25zdCBzaG9wcGluZ01ldGEkID0gYXdhaXQgZGIuY29sbGVjdGlvbignc2hvcHBpbmctbGlzdCcpXG4gICAgICAgICAgICAgICAgLndoZXJlKHtcbiAgICAgICAgICAgICAgICAgICAgdGlkXG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAuZ2V0KCApO1xuICAgICAgICAgICAgXG4gICAgICAgIFxuICAgICAgICAgICAgLyoqIOaJgOaciXVpZO+8iOWQq+mHjeWkje+8iSAqL1xuICAgICAgICAgICAgbGV0IHVpZHM6IGFueSA9IFsgXTtcbiAgICAgICAgICAgIHNob3BwaW5nTWV0YSQuZGF0YS5tYXAoIHNsID0+IHtcbiAgICAgICAgICAgICAgICB1aWRzID0gWyAuLi51aWRzLCAuLi5zbC51aWRzIF07XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgLyoqIOWkhOeQhuS8mOWMllxuICAgICAgICAgICAgICog6K6p6LSt5Lmw6YeP5pu05aSa55qE55So5oi377yM5bGV56S65Zyo5YmN6Z2iXG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIGxldCB1aWRNYXBUaW1lczoge1xuICAgICAgICAgICAgICAgIFsga2V5OiBzdHJpbmcgXSA6IG51bWJlclxuICAgICAgICAgICAgfSA9IHsgfTtcbiAgICAgICAgICAgIHVpZHMubWFwKCB1aWRzdHJpbmcgPT4ge1xuICAgICAgICAgICAgICAgIGlmICggIXVpZE1hcFRpbWVzWyB1aWRzdHJpbmcgXSkge1xuICAgICAgICAgICAgICAgICAgICB1aWRNYXBUaW1lcyA9IE9iamVjdC5hc3NpZ24oeyB9LCB1aWRNYXBUaW1lcywge1xuICAgICAgICAgICAgICAgICAgICAgICAgWyB1aWRzdHJpbmcgXTogMVxuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHVpZE1hcFRpbWVzID0gT2JqZWN0LmFzc2lnbih7IH0sIHVpZE1hcFRpbWVzLCB7XG4gICAgICAgICAgICAgICAgICAgICAgICBbIHVpZHN0cmluZyBdOiB1aWRNYXBUaW1lc1sgdWlkc3RyaW5nIF0gKyAxXG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIC8qKiDliY015ZCN55qE55So5oi3aWQgKi9cbiAgICAgICAgICAgIGNvbnN0IHVzZXJJZHMgPSBPYmplY3QuZW50cmllcyggdWlkTWFwVGltZXMgKVxuICAgICAgICAgICAgICAgIC5zb3J0KCggeCwgeSApID0+IFxuICAgICAgICAgICAgICAgICAgICB5WyAxIF0gLSB4WyAxIF1cbiAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgICAgLnNsaWNlKCAwLCBsaW1pdCApXG4gICAgICAgICAgICAgICAgLm1hcCggeCA9PiB4WyAwIF0pO1xuXG4gICAgICAgICAgICAvKiog5q+P5Liq55So5oi355qE5L+h5oGvICovXG4gICAgICAgICAgICBjb25zdCB1c2VycyQgPSBhd2FpdCBQcm9taXNlLmFsbCggdXNlcklkcy5tYXAoIHVpZCA9PiBQcm9taXNlLmFsbChbXG4gICAgICAgICAgICAgICAgZGIuY29sbGVjdGlvbigndXNlcicpXG4gICAgICAgICAgICAgICAgICAgIC53aGVyZSh7XG4gICAgICAgICAgICAgICAgICAgICAgICBvcGVuaWQ6IHVpZFxuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAuZ2V0KCApXG4gICAgICAgICAgICBdKSkpO1xuXG4gICAgICAgICAgICAvKiog5YmNNeS6uueahOWNoeWIuCAqL1xuICAgICAgICAgICAgY29uc3QgY291cG9ucyQ6IGFueSA9IGF3YWl0IFByb21pc2UuYWxsKFxuICAgICAgICAgICAgICAgIHVzZXJJZHMubWFwKCB1aWQgPT4gXG4gICAgICAgICAgICAgICAgICAgIGRiLmNvbGxlY3Rpb24oJ2NvdXBvbicpXG4gICAgICAgICAgICAgICAgICAgICAgICAud2hlcmUoXy5vcihbXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aWQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9wZW5pZDogdWlkXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvcGVuaWQ6IHVpZCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FuVXNlSW5OZXh0OiB0cnVlXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgXSkpXG4gICAgICAgICAgICAgICAgICAgICAgICAuZmllbGQoe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb3BlbmlkOiB0cnVlXG4gICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAgICAgLmdldCggKVxuICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgIClcblxuICAgICAgICAgICAgLyoqIOWJjTXkuKrkurrmgLvnmoTotK3nianmuIXljZUgKi9cbiAgICAgICAgICAgIGNvbnN0IHNob3BwaW5nTWV0YUZpbHRlciA9IHNob3BwaW5nTWV0YSQuZGF0YS5maWx0ZXIoIHMgPT4gXG4gICAgICAgICAgICAgICAgISF1c2VySWRzLmZpbmQoIHVpZCA9PiBcbiAgICAgICAgICAgICAgICAgICAgcy51aWRzLmZpbmQoIFxuICAgICAgICAgICAgICAgICAgICAgICAgdSA9PiB1ID09PSB1aWRcbiAgICAgICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgKSk7XG5cbiAgICAgICAgICAgIC8qKiDllYblk4FpZCAqL1xuICAgICAgICAgICAgY29uc3QgcElkcyA9IEFycmF5LmZyb20oXG4gICAgICAgICAgICAgICAgbmV3IFNldCggXG4gICAgICAgICAgICAgICAgICAgIHNob3BwaW5nTWV0YUZpbHRlclxuICAgICAgICAgICAgICAgICAgICAgICAgLm1hcCggcyA9PiBzLnBpZCApXG4gICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgKTtcblxuICAgICAgICAgICAgLyoqIOWVhuWTgeivpuaDhSAqLyAgICAgICAgICAgIFxuICAgICAgICAgICAgY29uc3QgZGV0YWlscyQgPSBhd2FpdCBQcm9taXNlLmFsbCggcElkcy5tYXAoIHBpZCA9PiB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGRiLmNvbGxlY3Rpb24oJ2dvb2RzJylcbiAgICAgICAgICAgICAgICAgICAgLmRvYyggcGlkIClcbiAgICAgICAgICAgICAgICAgICAgLmZpZWxkKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIF9pZDogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHRhZzogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGltZzogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHRpdGxlOiB0cnVlXG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgIC5nZXQoIClcbiAgICAgICAgICAgIH0pKTtcblxuICAgICAgICAgICAgLyoqIOi0reeJqea4heWNleazqOWFpeWVhuWTgeivpuaDhSAqL1xuICAgICAgICAgICAgY29uc3Qgc2hvcHBpbmdJbmplY3QgPSBzaG9wcGluZ01ldGFGaWx0ZXIubWFwKCBzbCA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3QgZGV0YWlsID0gZGV0YWlscyQuZmluZCggeCA9PiB4LmRhdGEuX2lkID09PSBzbC5waWQgKTtcbiAgICAgICAgICAgICAgICBpZiAoIGRldGFpbCApIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIE9iamVjdC5hc3NpZ24oeyB9LCBzbCwge1xuICAgICAgICAgICAgICAgICAgICAgICAgZGV0YWlsOiBkZXRhaWwuZGF0YVxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gT2JqZWN0LmFzc2lnbih7IH0sIHNsICk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIC8qKiDov5Tlm57nu5PmnpwgKi9cbiAgICAgICAgICAgIGNvbnN0IG1ldGFEYXRhID0gdXNlcnMkLm1hcCgoIHgsIGsgKSA9PiB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICAgICAgdXNlcjogeFsgMCBdLmRhdGFbIDAgXSxcbiAgICAgICAgICAgICAgICAgICAgY291cG9uczogY291cG9ucyRbIGsgXS5kYXRhLCBcbiAgICAgICAgICAgICAgICAgICAgc2hvcHBpbmdsaXN0OiBzaG9wcGluZ0luamVjdC5maWx0ZXIoIHNsID0+IHNsLnVpZHMuZmluZCggdWlkID0+IHVpZCA9PT0geFsgMCBdLmRhdGFbIDAgXS5vcGVuaWQgKSlcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgcmV0dXJuIGN0eC5ib2R5ID0ge1xuICAgICAgICAgICAgICAgIHN0YXR1czogMjAwLFxuICAgICAgICAgICAgICAgIGRhdGE6IG1ldGFEYXRhXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfSBjYXRjaCAoIGUgKSB7XG4gICAgICAgICAgICByZXR1cm4gY3R4LmJvZHkgPSB7IHN0YXR1czogNTAwIH07XG4gICAgICAgIH1cbiAgICB9KVxuXG4gICAgcmV0dXJuIGFwcC5zZXJ2ZSggKTtcblxufSJdfQ==