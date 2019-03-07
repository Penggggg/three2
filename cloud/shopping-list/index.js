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
                                            query = Object.assign({}, query, {
                                                acid: acid || _.eq(undefined)
                                            });
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
            var openid_1, type_1, _a, tid, detail, pid, query, shopping$, data, data$, data_1, e_6;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        openid_1 = event.userInfo.openId;
                        type_1 = event.data.type || 'pin';
                        _a = event.data, tid = _a.tid, detail = _a.detail, pid = _a.pid;
                        query = pid ? {
                            tid: tid,
                            pid: pid
                        } : {
                            tid: tid
                        };
                        return [4, db.collection('shopping-list')
                                .where(query)
                                .get()];
                    case 1:
                        shopping$ = _b.sent();
                        data = [];
                        data$ = shopping$.data.filter(function (s) {
                            if (type_1 === 'pin') {
                                return !!s.adjustGroupPrice && s.uids.length > 1;
                            }
                            else if (type_1 === 'wait') {
                                return !!s.adjustGroupPrice && s.uids.length === 1 && s.uids[0] !== openid_1;
                            }
                            else {
                                return (!!s.adjustGroupPrice && s.uids.length > 1) ||
                                    (!!s.adjustGroupPrice && s.uids.length === 1 && s.uids[0] !== openid_1);
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
        app.router('fairy-shoppinglist', function (ctx, next) { return __awaiter(_this, void 0, void 0, function () {
            var tid_1, limit, shoppingMeta$, uids_1, uidMapTimes_1, userIds_1, users$, coupons$_1, shoppingMetaFilter, pIds, details$_1, shoppingInject_1, metaData, e_7;
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
                        uids_1 = [];
                        shoppingMeta$.data.map(function (sl) {
                            uids_1 = uids_1.concat(sl.uids);
                        });
                        uidMapTimes_1 = {};
                        uids_1.map(function (uidstring) {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSxpQkE0ekJDOztBQTV6QkQscUNBQXVDO0FBQ3ZDLHNDQUF3QztBQUN4QywrQkFBK0I7QUFFL0IsS0FBSyxDQUFDLElBQUksRUFBRyxDQUFDO0FBRWQsSUFBTSxFQUFFLEdBQWdCLEtBQUssQ0FBQyxRQUFRLEVBQUcsQ0FBQztBQUMxQyxJQUFNLENBQUMsR0FBRyxFQUFFLENBQUMsT0FBTyxDQUFDO0FBb0JSLFFBQUEsSUFBSSxHQUFHLFVBQVEsS0FBSyxFQUFFLE9BQU87Ozs7UUFFaEMsR0FBRyxHQUFHLElBQUksU0FBUyxDQUFDLEVBQUUsS0FBSyxPQUFBLEVBQUUsQ0FBQyxDQUFDO1FBK0RyQyxHQUFHLENBQUMsTUFBTSxDQUFDLGVBQWUsRUFBRSxVQUFPLEdBQUcsRUFBRSxJQUFJOzs7Ozs7d0JBRzlCLEtBQWdCLEtBQUssQ0FBQyxJQUFJLEVBQXhCLEdBQUcsU0FBQSxFQUFFLElBQUksVUFBQSxDQUFnQjt3QkFDM0IsTUFBTSxHQUFHLEtBQUssQ0FBQyxJQUFJLENBQUMsTUFBTSxJQUFJLEtBQUssQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDO3dCQUduQyxXQUFNLE9BQU8sQ0FBQyxHQUFHLENBQUUsS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFFLFVBQUEsQ0FBQztnQ0FDNUQsT0FBTyxZQUFLLENBQUM7b0NBQ1QsR0FBRyxFQUFFLENBQUMsQ0FBQyxHQUFHO29DQUNWLEdBQUcsRUFBRSxDQUFDLENBQUMsR0FBRztvQ0FDVixHQUFHLEVBQUUsQ0FBQyxDQUFDLEdBQUc7b0NBQ1YsVUFBVSxFQUFFLEdBQUc7aUNBQ2xCLEVBQUUsRUFBRSxFQUFFLEdBQUcsQ0FBRSxDQUFBOzRCQUNoQixDQUFDLENBQUMsQ0FBQyxFQUFBOzt3QkFQRyxT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LE9BQUEsRUFBRSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUUsVUFBQSxHQUFHLElBQUksT0FBQSxHQUFHLEtBQUssQ0FBQyxDQUFFLENBQUMsQ0FBRSxDQUFDLElBQUksQ0FBRSxDQUFDLENBQUUsQ0FBQyxNQUFNLEVBQS9CLENBQStCLENBQUUsRUFBdEQsQ0FBc0QsQ0FBQzs2QkFDckcsQ0FBQTt3QkFDTCxDQUFDLENBQUMsQ0FBQzt3QkFFSCxXQUFPLEdBQUcsQ0FBQyxJQUFJLEdBQUc7Z0NBQ2QsTUFBTSxFQUFFLEdBQUc7Z0NBQ1gsSUFBSSxFQUFFLFFBQVE7NkJBQ2pCLEVBQUE7Ozt3QkFHRCxXQUFPLEdBQUcsQ0FBQyxJQUFJLEdBQUcsRUFBRSxNQUFNLEVBQUUsR0FBRyxFQUFFLEVBQUM7Ozs7YUFFekMsQ0FBQyxDQUFBO1FBSUYsV0FBTyxHQUFHLENBQUMsS0FBSyxFQUFHLEVBQUM7O0tBRXZCLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBjbG91ZCBmcm9tICd3eC1zZXJ2ZXItc2RrJztcbmltcG9ydCAqIGFzIFRjYlJvdXRlciBmcm9tICd0Y2Itcm91dGVyJztcbmltcG9ydCB7IGZpbmQkIH0gZnJvbSAnLi9maW5kJztcblxuY2xvdWQuaW5pdCggKTtcblxuY29uc3QgZGI6IERCLkRhdGFiYXNlID0gY2xvdWQuZGF0YWJhc2UoICk7XG5jb25zdCBfID0gZGIuY29tbWFuZDtcblxuLyoqXG4gKiBAZGVzY3JpcHRpb24g6KGM56iL5riF5Y2V5qih5Z2XXG4gKiAtLS0tLS0tLS0g5a2X5q61IC0tLS0tLS0tLS1cbiAqIHRpZFxuICogcGlkXG4gKiBzaWQgKCDlj6/kuLrnqbogKVxuICogb2lkcyBBcnJheVxuICogdWlkcyBBcnJheVxuICogYnV5X3N0YXR1cyAwLDEsMiDmnKrotK3kubDjgIHlt7LotK3kubDjgIHkubDkuI3lhahcbiAqIGJhc2Vfc3RhdHVzOiAwLDEg5pyq6LCD5pW077yM5bey6LCD5pW0XG4gKiBjcmVhdGVUaW1lXG4gKiB1cGRhdGVUaW1lXG4gKiAhIGFjaWQg5rS75YqoaWRcbiAqIGxhc3RBbGxvY2F0ZWQg5Ymp5L2Z5YiG6YWN6YePXG4gKiBwdXJjaGFzZSDph4fotK3mlbDph49cbiAqIGFkanVzdFByaWNlIOWIhumFjeeahOaVsOa4heWNleWUruS7t1xuICogYWRqdXN0R3JvdXBQcmljZSDliIbphY3nmoTmlbDmuIXljZXlm6LotK3ku7dcbiAqL1xuZXhwb3J0IGNvbnN0IG1haW4gPSBhc3luYyAoIGV2ZW50LCBjb250ZXh0ICkgPT4ge1xuXG4gICAgY29uc3QgYXBwID0gbmV3IFRjYlJvdXRlcih7IGV2ZW50IH0pO1xuXG4gICAgLyoqXG4gICAgICogQGRlc2NyaXB0aW9uXG4gICAgICog5Yik5pat6K+35rGC55qEc2lkICsgdGlkICsgcGlkICsgY291bnTmlbDnu4TvvIzov5Tlm57kuI3og73otK3kubDnmoTllYblk4HliJfooajvvIjmuIXljZXph4zpnaLkubDkuI3liLDjgIHkubDkuI3lhajvvInjgIHotKflhajkuI3otrPnmoTllYblk4HvvIjov5Tlm57mnIDmlrDotKflrZjvvIlcbiAgICAgKiAtLS0tLS0tLSDor7fmsYIgLS0tLS0tLS0tLVxuICAgICAqIHtcbiAgICAgKiEgICAgZnJvbT86ICdjYXJ0JyB8ICdidXknIHwgJ2N1c3RvbScgfCAnYWdlbnRzJyB8ICdzeXN0ZW0nXG4gICAgICogICAgIHRpZDogc3RyaW5nXG4gICAgICohICAgIG9wZW5pZD86IHN0cmluZyxcbiAgICAgKiAgICBsaXN0OiB7IFxuICAgICAqICAgICAgdGlkXG4gICAgICohICAgICBjaWQ/OiBzdHJpbmdcbiAgICAgICAgICAgIHNpZFxuICAgICAgICAgICAgcGlkXG4gICAgICAgICAgICBwcmljZVxuICAgICAgICAgICAgZ3JvdXBQcmljZVxuICAgICAgICAgICAgY291bnRcbiAgICAgKiEgICAgIGRlc2M/OiBzdHJpbmdcbiAgICAgICAgICAgIG5hbWUsXG4gICAgICAgICAgICBzdGFuZGVybmFtZVxuICAgICAgICAgICAgaW1nXG4gICAgICAgICAgICB0eXBlXG4gICAgICAgICAgICBhZGRyZXNzOiB7XG4gICAgICAgICAgICAgICBuYW1lLFxuICAgICAgICAgICAgICAgcGhvbmUsXG4gICAgICAgICAgICAgICBkZXRhaWwsXG4gICAgICAgICAgICAgICBwb3N0YWxjb2RlXG4gICAgICAgICAgICB9XG4gICAgICogICAgIH1bIF1cbiAgICAgKiB9XG4gICAgICogLS0tLS0tLS0g6L+U5ZueIC0tLS0tLS0tLS1cbiAgICAgKiB7XG4gICAgICogICAgICAqIOW3sui0reS5sCgg6aOO6Zmp5Y2VIClcbiAgICAgKiAgICAgIGhhc0JlZW5CdXk6IHtcbiAgICAgKiAgICAgICAgICB0aWQsIFxuICAgICAqICAgICAgICAgIHBpZCxcbiAgICAgKiAgICAgICAgICBzaWRcbiAgICAgKiAgICAgIH1bIF1cbiAgICAgKiAgICAgICog5Lmw5LiN5YiwXG4gICAgICogICAgICBjYW5ub3RCdXk6IHsgXG4gICAgICogICAgICAgICAgdGlkLCBcbiAgICAgKiAgICAgICAgICBwaWQsXG4gICAgICogICAgICAgICAgc2lkXG4gICAgICogICAgICB9WyBdXG4gICAgICogICAgICAqIOi0p+WtmOS4jei2s1xuICAgICAqICAgICAgIGxvd1N0b2NrOiB7IFxuICAgICAqICAgICAgICAgIHRpZCwgXG4gICAgICogICAgICAgICAgcGlkLFxuICAgICAqICAgICAgICAgIHNpZCxcbiAgICAgKiAgICAgICAgICBjb3VudCxcbiAgICAgKiAgICAgICAgICBzdG9ja1xuICAgICAqICAgICAgfVsgXVxuICAgICAqICAgICAgKiDlnovlj7flt7LooqvliKDpmaQgLyDllYblk4Hlt7LkuIvmnrZcbiAgICAgKiAgICAgIGhhc0JlZW5EZWxldGU6IHtcbiAgICAgKiAgICAgICAgICB0aWQsIFxuICAgICAqICAgICAgICAgIHBpZCxcbiAgICAgKiAgICAgICAgICBzaWRcbiAgICAgKiAgICAgIH1bIF0sXG4gICAgICogICAgICAqIOiuouWNleWPt+WIl+ihqFxuICAgICAqICAgICAgb3JkZXJzXG4gICAgICogfVxuICAgICAqL1xuICAgIGFwcC5yb3V0ZXIoJ2ZpbmRDYW5ub3RCdXknLCBhc3luYyggY3R4LCBuZXh0ICkgPT4ge1xuICAgICAgICB0cnkge1xuXG4gICAgICAgICAgICBjb25zdCB7IHRpZCwgbGlzdCB9ID0gZXZlbnQuZGF0YTtcbiAgICAgICAgICAgIGNvbnN0IG9wZW5JZCA9IGV2ZW50LmRhdGEub3BlbklkIHx8IGV2ZW50LnVzZXJJbmZvLm9wZW5JZDtcblxuICAgICAgICAgICAgLy8g5LiN6IO96LSt5Lmw55qE5ZWG5ZOB5YiX6KGo77yI5riF5Y2V6YeM6Z2i5Lmw5LiN5YWo77yJXG4gICAgICAgICAgICBjb25zdCBmaW5kaW5ncyQ6IGFueSA9IGF3YWl0IFByb21pc2UuYWxsKCBldmVudC5kYXRhLmxpc3QubWFwKCBpID0+IHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZmluZCQoe1xuICAgICAgICAgICAgICAgICAgICB0aWQ6IGkudGlkLFxuICAgICAgICAgICAgICAgICAgICBwaWQ6IGkucGlkLFxuICAgICAgICAgICAgICAgICAgICBzaWQ6IGkuc2lkLFxuICAgICAgICAgICAgICAgICAgICBidXlfc3RhdHVzOiAnMidcbiAgICAgICAgICAgICAgICB9LCBkYiwgY3R4IClcbiAgICAgICAgICAgIH0pKVxuXG4gICAgICAgICAgICBpZiAoIGZpbmRpbmdzJC5zb21lKCB4ID0+IHguc3RhdHVzICE9PSAyMDAgKSkge1xuICAgICAgICAgICAgICAgIHRocm93ICfmn6Xor6LotK3nianmuIXljZXplJnor68nO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyDlt7LlrozmiJDotK3kubDnmoTllYblk4HliJfooahcbiAgICAgICAgICAgIGNvbnN0IGhhc0JlZW5CdXkkOiBhbnkgPSBhd2FpdCBQcm9taXNlLmFsbCggZXZlbnQuZGF0YS5saXN0Lm1hcCggaSA9PiB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZpbmQkKHtcbiAgICAgICAgICAgICAgICAgICAgdGlkOiBpLnRpZCxcbiAgICAgICAgICAgICAgICAgICAgcGlkOiBpLnBpZCxcbiAgICAgICAgICAgICAgICAgICAgc2lkOiBpLnNpZCxcbiAgICAgICAgICAgICAgICAgICAgYnV5X3N0YXR1czogJzEnXG4gICAgICAgICAgICAgICAgfSwgZGIsIGN0eCApXG4gICAgICAgICAgICB9KSk7XG5cbiAgICAgICAgICAgIC8vIOafpeivouWVhuWTgeivpuaDheOAgeaIluiAheWei+WPt+ivpuaDhVxuICAgICAgICAgICAgY29uc3QgZ29vZERldGFpbHMkOiBhbnkgPSBhd2FpdCBQcm9taXNlLmFsbCggZXZlbnQuZGF0YS5saXN0Lm1hcCggaSA9PiB7XG5cbiAgICAgICAgICAgICAgICBpZiAoICEhaS5zaWQgKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBkYi5jb2xsZWN0aW9uKCdzdGFuZGFyZHMnKVxuICAgICAgICAgICAgICAgICAgICAgICAgLndoZXJlKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBfaWQ6IGkuc2lkXG4gICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAgICAgLmdldCggKVxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBkYi5jb2xsZWN0aW9uKCdnb29kcycpXG4gICAgICAgICAgICAgICAgICAgICAgICAud2hlcmUoe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIF9pZDogaS5waWRcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgICAgICAuZ2V0KCApXG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB9KSk7XG4gICAgICAgICAgIFxuICAgICAgICAgICAgY29uc3QgZ29vZHMgPSBnb29kRGV0YWlscyQubWFwKCB4ID0+IHguZGF0YVsgMCBdKS5maWx0ZXIoIHkgPT4gISF5ICkuZmlsdGVyKCB6ID0+ICF6LnBpZCApO1xuICAgICAgICAgICAgY29uc3Qgc3RhbmRhcmRzID0gZ29vZERldGFpbHMkLm1hcCggeCA9PiB4LmRhdGFbIDAgXSkuZmlsdGVyKCB5ID0+ICEheSApLmZpbHRlciggeiA9PiAhIXoucGlkICk7XG5cbiAgICAgICAgICAgIC8vIOW6k+WtmOS4jei2s1xuICAgICAgICAgICAgbGV0IGxvd1N0b2NrOiBhbnkgPSBbIF07XG5cbiAgICAgICAgICAgIC8vIOiiq+WIoOmZpFxuICAgICAgICAgICAgbGV0IGhhc0JlZW5EZWxldGU6IGFueSA9IFsgXTtcblxuICAgICAgICAgICAgLy8g5Lmw5LiN5YiwXG4gICAgICAgICAgICBjb25zdCBjYW5ub3RCdXkgPSBmaW5kaW5ncyQubWFwKCB4ID0+IHguZGF0YVsgMCBdKS5maWx0ZXIoIHkgPT4gISF5ICk7XG5cbiAgICAgICAgICAgIC8vIOW3sue7j+iiq+i0reS5sOS6hu+8iOmjjumZqeWNle+8iVxuICAgICAgICAgICAgY29uc3QgaGFzQmVlbkJ1eSA9IGhhc0JlZW5CdXkkLm1hcCggeCA9PiB4LmRhdGFbIDAgXSkuZmlsdGVyKCB5ID0+ICEheSApXG5cbiAgICAgICAgICAgIGV2ZW50LmRhdGEubGlzdC5tYXAoIGkgPT4ge1xuICAgICAgICAgICAgICAgIC8vIOWei+WPt1xuICAgICAgICAgICAgICAgIGlmICggISFpLnNpZCApIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3Qgc3RhbmRhcmQgPSBzdGFuZGFyZHMuZmluZCggeCA9PiB4Ll9pZCA9PT0gaS5zaWQgJiYgeC5waWQgPT09IGkucGlkICk7XG4gICAgICAgICAgICAgICAgICAgIGlmICggIXN0YW5kYXJkICkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaGFzQmVlbkRlbGV0ZS5wdXNoKCBpICk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoIHN0YW5kYXJkLnN0b2NrICE9PSB1bmRlZmluZWQgJiYgIHN0YW5kYXJkLnN0b2NrIDwgaS5jb3VudCApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxvd1N0b2NrLnB1c2goIE9iamVjdC5hc3NpZ24oeyB9LCBpLCB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc3RvY2s6IHN0YW5kYXJkLnN0b2NrLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGdvb2ROYW1lOiBpLm5hbWUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc3RhbmRlck5hbWU6IGkuc3RhbmRlcm5hbWVcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIC8vIOS4u+S9k+WVhuWTgVxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGdvb2QgPSBnb29kcy5maW5kKCB4ID0+IHguX2lkID09PSBpLnBpZCApO1xuICAgICAgICAgICAgICAgICAgICBpZiAoICFnb29kIHx8ICggISFnb29kICYmICFnb29kLnZpc2lhYmxlICkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGhhc0JlZW5EZWxldGUucHVzaCggaSApXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoIGdvb2Quc3RvY2sgIT09IHVuZGVmaW5lZCAmJiAgZ29vZC5zdG9jayA8IGkuY291bnQgKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBsb3dTdG9jay5wdXNoKCBPYmplY3QuYXNzaWduKHsgfSwgaSwge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0b2NrOiBnb29kLnN0b2NrLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGdvb2ROYW1lOiBpLm5hbWVcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIGxldCBvcmRlcnMgPSBbIF07XG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIOWmguaenOWPr+S7pei0reS5sFxuICAgICAgICAgICAgICogISDmibnph4/liJvlu7rpooTku5jorqLljZVcbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgaWYgKCBsb3dTdG9jay5sZW5ndGggPT09IDAgJiYgY2Fubm90QnV5Lmxlbmd0aCA9PT0gMCAmJiBoYXNCZWVuRGVsZXRlLmxlbmd0aCA9PT0gMCApIHtcblxuICAgICAgICAgICAgICAgIGNvbnN0IHJlcURhdGEgPSB7XG4gICAgICAgICAgICAgICAgICAgIHRpZCxcbiAgICAgICAgICAgICAgICAgICAgb3BlbklkLFxuICAgICAgICAgICAgICAgICAgICBmcm9tOiBldmVudC5kYXRhLmZyb20gfHwgJ3N5c3RlbScsXG4gICAgICAgICAgICAgICAgICAgIG9yZGVyczogZXZlbnQuZGF0YS5saXN0XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgY29uc3QgY3JlYXRlT3JkZXIkID0gYXdhaXQgY2xvdWQuY2FsbEZ1bmN0aW9uKHtcbiAgICAgICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgICAgICAgZGF0YTogcmVxRGF0YSxcbiAgICAgICAgICAgICAgICAgICAgICAgICR1cmw6ICdjcmVhdGUnXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIG5hbWU6ICdvcmRlcidcbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgIGlmICggY3JlYXRlT3JkZXIkLnJlc3VsdC5zdGF0dXMgIT09IDIwMCApIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGN0eC5ib2R5ID0ge1xuICAgICAgICAgICAgICAgICAgICAgICAgc3RhdHVzOiA1MDAsXG4gICAgICAgICAgICAgICAgICAgICAgICBtZXNzYWdlOiAn5Yib5bu66aKE5LuY6K6i5Y2V5aSx6LSl77yBJ1xuICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBvcmRlcnMgPSBjcmVhdGVPcmRlciQucmVzdWx0LmRhdGE7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiBjdHguYm9keSA9IHtcbiAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICAgIGxvd1N0b2NrLFxuICAgICAgICAgICAgICAgICAgICBoYXNCZWVuRGVsZXRlLFxuICAgICAgICAgICAgICAgICAgICBjYW5ub3RCdXksXG4gICAgICAgICAgICAgICAgICAgIGhhc0JlZW5CdXksXG4gICAgICAgICAgICAgICAgICAgIG9yZGVyc1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgc3RhdHVzOiAyMDBcbiAgICAgICAgICAgIH1cblxuICAgICAgICB9IGNhdGNoICggZSApIHtcbiAgICAgXG4gICAgICAgICAgICByZXR1cm4gY3R4LmJvZHkgPSB7XG4gICAgICAgICAgICAgICAgc3RhdHVzOiA1MDAsXG4gICAgICAgICAgICAgICAgbWVzc2FnZTogZVxuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgLyoqXG4gICAgICogQGRlc2NyaXB0aW9uXG4gICAgICog55Sx6K6i5Y2V5Yib5bu66LSt54mp5riF5Y2VXG4gICAgICogbGlzdDoge1xuICAgICAqICAgIHRpZCxcbiAgICAgKiAgICBwaWQsXG4gICAgICogICAgc2lkLFxuICAgICAqICAgIG9pZCxcbiAgICAgKiAgICBwcmljZSxcbiAgICAgKiAgICBncm91cFByaWNlLFxuICAgICAqICAgIGFjaWRcbiAgICAgKiB9WyBdXG4gICAgICovXG4gICAgYXBwLnJvdXRlcignY3JlYXRlJywgYXN5bmMoIGN0eCwgbmV4dCApID0+IHtcbiAgICAgICAgdHJ5IHtcblxuICAgICAgICAgICAgY29uc3QgeyBsaXN0LCBvcGVuSWQgfSA9IGV2ZW50LmRhdGE7XG4gXG4gICAgICAgICAgICBhd2FpdCBQcm9taXNlLmFsbCggbGlzdC5tYXAoIGFzeW5jIG9yZGVyTWV0YSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3QgeyB0aWQsIHBpZCwgc2lkLCBvaWQsIHByaWNlLCBncm91cFByaWNlLCBhY2lkIH0gPSBvcmRlck1ldGE7XG4gICAgICAgICAgICAgICAgbGV0IHF1ZXJ5ID0ge1xuICAgICAgICAgICAgICAgICAgICB0aWQsXG4gICAgICAgICAgICAgICAgICAgIHBpZFxuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgaWYgKCAhIXNpZCApIHtcbiAgICAgICAgICAgICAgICAgICAgcXVlcnlbJ3NpZCddID0gc2lkO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIC8vIOaPkuWFpea0u+WKqOeahOafpeivouadoeS7tlxuICAgICAgICAgICAgICAgIHF1ZXJ5ID0gT2JqZWN0LmFzc2lnbih7IH0sIHF1ZXJ5LCB7XG4gICAgICAgICAgICAgICAgICAgIGFjaWQ6IGFjaWQgfHwgXy5lcSggdW5kZWZpbmVkIClcbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgIGNvbnN0IGZpbmQkID0gYXdhaXQgZGIuY29sbGVjdGlvbignc2hvcHBpbmctbGlzdCcpXG4gICAgICAgICAgICAgICAgICAgIC53aGVyZSggcXVlcnkgKVxuICAgICAgICAgICAgICAgICAgICAuZ2V0KCApO1xuXG4gICAgICAgICAgICAgICAgaWYgKCBmaW5kJC5kYXRhLmxlbmd0aCA9PT0gMCApIHtcblxuICAgICAgICAgICAgICAgICAgICBjb25zdCBtZXRhID0gT2JqZWN0LmFzc2lnbih7IH0sIHF1ZXJ5LHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGFjaWQ6IGFjaWQgfHwgdW5kZWZpbmVkXG4gICAgICAgICAgICAgICAgICAgIH0se1xuICAgICAgICAgICAgICAgICAgICAgICAgb2lkczogWyBvaWQgXSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHVpZHM6IFsgb3BlbklkIF0sXG4gICAgICAgICAgICAgICAgICAgICAgICBwdXJjaGFzZTogMCxcbiAgICAgICAgICAgICAgICAgICAgICAgIGJ1eV9zdGF0dXM6ICcwJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGJhc2Vfc3RhdHVzOiAnMCcsXG4gICAgICAgICAgICAgICAgICAgICAgICBhZGp1c3RQcmljZTogcHJpY2UsXG4gICAgICAgICAgICAgICAgICAgICAgICBhZGp1c3RHcm91cFByaWNlOiBncm91cFByaWNlLFxuICAgICAgICAgICAgICAgICAgICAgICAgY3JlYXRlVGltZTogbmV3IERhdGUoICkuZ2V0VGltZSggKVxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGNyZWFldCQgPSBhd2FpdCBkYi5jb2xsZWN0aW9uKCdzaG9wcGluZy1saXN0JylcbiAgICAgICAgICAgICAgICAgICAgICAgIC5hZGQoe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGE6IG1ldGFcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcblxuICAgICAgICAgICAgICAgIC8vIOabtOaWsOaPkuWFpVxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGxldCBtZXRhU2hvcHBpbmdMaXN0ID0gZmluZCQuZGF0YVsgMCBdO1xuICAgICAgICAgICAgICAgICAgICBpZiAoICFtZXRhU2hvcHBpbmdMaXN0Lm9pZHMuZmluZCggeCA9PiB4ID09PSBvaWQgKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgbGFzdE9pZHMgPSBtZXRhU2hvcHBpbmdMaXN0Lm9pZHM7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBsYXN0VWlkcyA9IG1ldGFTaG9wcGluZ0xpc3QudWlkcztcblxuICAgICAgICAgICAgICAgICAgICAgICAgLy8g5o+S5YWl5Yiw5aS06YOo77yM5pyA5paw55qE5bey5pSv5LuY6K6i5Y2V5bCx5Zyo5LiK6Z2iXG4gICAgICAgICAgICAgICAgICAgICAgICBsYXN0T2lkcy51bnNoaWZ0KCBvaWQgKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCAhbGFzdFVpZHMuZmluZCggeCA9PiB4ID09PSBvcGVuSWQgKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxhc3RVaWRzLnVuc2hpZnQoIG9wZW5JZCApO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCB1cGRhdGUkID0gYXdhaXQgZGIuY29sbGVjdGlvbignc2hvcHBpbmctbGlzdCcpLmRvYyggU3RyaW5nKCBmaW5kJC5kYXRhWyAwIF0uX2lkICkpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLnVwZGF0ZSh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9pZHM6IGxhc3RPaWRzLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdWlkczogbGFzdFVpZHMsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB1cGRhdGVUaW1lOiBuZXcgRGF0ZSggKS5nZXRUaW1lKCApXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIH0pKTtcblxuICAgICAgICAgICAgcmV0dXJuIGN0eC5ib2R5ID0ge1xuICAgICAgICAgICAgICAgIHN0YXR1czogMjAwXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfSBjYXRjaCAoIGUgKSB7IHJldHVybiBjdHguYm9keSA9IHsgc3RhdHVzOiA1MDAgfX1cbiAgICB9KTtcblxuICAgIC8qKlxuICAgICAqIEBkZXNjcmlwdGlvbiBcbiAgICAgKiB7XG4gICAgICogICAgIHRpZCwgXG4gICAgICogICAgIG5lZWRPcmRlcnMg5piv5ZCm6ZyA6KaB6L+U5Zue6K6i5Y2VXG4gICAgICogfVxuICAgICAqIOihjOeoi+eahOi0reeJqea4heWNle+8jOeUqOS6juiwg+aVtOWVhuWTgeS7t+agvOOAgei0reS5sOaVsOmHj1xuICAgICAqIFwi55yL55yL5LuW5Lq65Lmw5LqG5LuA5LmIXCJcbiAgICAgKi9cbiAgICBhcHAucm91dGVyKCdsaXN0JywgYXN5bmMoIGN0eCwgbmV4dCApID0+IHtcbiAgICAgICAgdHJ5IHtcblxuICAgICAgICAgICAgbGV0IG9yZGVycyQ6IGFueSA9IFsgXTtcbiAgICAgICAgICAgIGNvbnN0IHsgdGlkLCBuZWVkT3JkZXJzIH0gPSBldmVudC5kYXRhO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICBcbiAgICAgICAgICAgIC8vIOaLv+WIsOihjOeoi+S4i+aJgOacieeahOi0reeJqea4heWNlVxuICAgICAgICAgICAgY29uc3QgbGlzdHMkID0gYXdhaXQgZGIuY29sbGVjdGlvbignc2hvcHBpbmctbGlzdCcpXG4gICAgICAgICAgICAgICAgLndoZXJlKHtcbiAgICAgICAgICAgICAgICAgICAgdGlkXG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAuZ2V0KCApO1xuICAgICAgICAgICBcbiAgICAgICAgICAgIC8vIOafpeivouavj+adoea4heWNleW6leS4i+eahOavj+S4qm9yZGVy6K+m5oOF77yM6L+Z6YeM55qE5q+P5Liqb3JkZXLpg73mmK/lt7Lku5jorqLph5HnmoRcbiAgICAgICAgICAgIGlmICggbmVlZE9yZGVycyAhPT0gZmFsc2XCoCkge1xuICAgICAgICAgICAgICAgIG9yZGVycyQgPSBhd2FpdCBQcm9taXNlLmFsbCggbGlzdHMkLmRhdGEubWFwKCBsaXN0ID0+IHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFByb21pc2UuYWxsKCBsaXN0Lm9pZHMubWFwKCBhc3luYyBvaWQgPT4ge1xuICAgIFxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3Qgb3JkZXIkID0gYXdhaXQgZGIuY29sbGVjdGlvbignb3JkZXInKS5kb2MoIG9pZCApXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLmdldCggKTtcbiAgICBcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHVzZXIkID0gYXdhaXQgZGIuY29sbGVjdGlvbigndXNlcicpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLndoZXJlKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb3BlbmlkOiBvcmRlciQuZGF0YS5vcGVuaWRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5nZXQoICk7XG4gICAgXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gT2JqZWN0LmFzc2lnbih7IH0sIG9yZGVyJC5kYXRhLCB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdXNlcjogdXNlciQuZGF0YVsgMCBdXG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgfSkpO1xuICAgICAgICAgICAgICAgIH0pKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8g5p+l6K+i5q+P5p2h5riF5Y2V5bqV5LiL5q+P5Liq5ZWG5ZOB55qE6K+m5oOFXG4gICAgICAgICAgICBjb25zdCBnb29kcyQ6IGFueSA9IGF3YWl0IFByb21pc2UuYWxsKCBsaXN0cyQuZGF0YS5tYXAoIGFzeW5jIGxpc3QgPT4ge1xuXG4gICAgICAgICAgICAgICAgY29uc3QgeyBwaWQsIHNpZCB9ID0gbGlzdDtcbiAgICAgICAgICAgICAgICBjb25zdCBjb2xsZWN0aW9uTmFtZSA9ICEhc2lkID8gJ3N0YW5kYXJkcycgOiAnZ29vZHMnO1xuXG4gICAgICAgICAgICAgICAgLy8g5Z6L5Y+3XG4gICAgICAgICAgICAgICAgbGV0IHN0YW5kYXIkOiBhbnkgPSBudWxsO1xuXG4gICAgICAgICAgICAgICAgLy8g5ZWG5ZOBXG4gICAgICAgICAgICAgICAgY29uc3QgZ29vZCQgPSBhd2FpdCBkYi5jb2xsZWN0aW9uKCdnb29kcycpXG4gICAgICAgICAgICAgICAgICAgIC5kb2MoIHBpZCApXG4gICAgICAgICAgICAgICAgICAgIC5nZXQoICk7XG5cbiAgICAgICAgICAgICAgICBpZiAoICEhc2lkICkge1xuICAgICAgICAgICAgICAgICAgICBzdGFuZGFyJCA9IGF3YWl0IGRiLmNvbGxlY3Rpb24oJ3N0YW5kYXJkcycpXG4gICAgICAgICAgICAgICAgICAgICAgICAuZG9jKCBzaWQgKVxuICAgICAgICAgICAgICAgICAgICAgICAgLmdldCggKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgICAgICB0YWc6IGdvb2QkLmRhdGEudGFnLFxuICAgICAgICAgICAgICAgICAgICB0aXRsZTogZ29vZCQuZGF0YS50aXRsZSxcbiAgICAgICAgICAgICAgICAgICAgbmFtZTogc3RhbmRhciQgPyBzdGFuZGFyJC5kYXRhLm5hbWUgOiAnJyxcbiAgICAgICAgICAgICAgICAgICAgcHJpY2U6IHN0YW5kYXIkID8gc3RhbmRhciQuZGF0YS5wcmljZSA6IGdvb2QkLmRhdGEucHJpY2UsXG4gICAgICAgICAgICAgICAgICAgIGltZzogc3RhbmRhciQgPyBzdGFuZGFyJC5kYXRhLmltZyA6IGdvb2QkLmRhdGEuaW1nWyAwIF0sXG4gICAgICAgICAgICAgICAgICAgIGdyb3VwUHJpY2U6IHN0YW5kYXIkID8gc3RhbmRhciQuZGF0YS5ncm91cFByaWNlIDogZ29vZCQuZGF0YS5ncm91cFByaWNlLFxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pKTtcblxuICAgICAgICAgICAgY29uc3QgbGlzdCA9IGxpc3RzJC5kYXRhLm1hcCgoIGwsIGsgKSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3QgeyBpbWcsIHByaWNlLCBncm91cFByaWNlLCB0aXRsZSwgbmFtZSwgdGFnIH0gPSBnb29kcyRbIGsgXTtcbiAgICAgICAgICAgICAgICBsZXQgbWV0YSA9IE9iamVjdC5hc3NpZ24oeyB9LCBsLCB7XG4gICAgICAgICAgICAgICAgICAgIHRhZyxcbiAgICAgICAgICAgICAgICAgICAgaW1nLFxuICAgICAgICAgICAgICAgICAgICBwcmljZSxcbiAgICAgICAgICAgICAgICAgICAgZ3JvdXBQcmljZSxcbiAgICAgICAgICAgICAgICAgICAgZ29vZE5hbWU6IHRpdGxlLFxuICAgICAgICAgICAgICAgICAgICBzdGFuZGFyTmFtZTogbmFtZVxuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgaWYgKCBuZWVkT3JkZXJzICE9PSBmYWxzZSApIHtcbiAgICAgICAgICAgICAgICAgICAgbWV0YSA9IE9iamVjdC5hc3NpZ24oeyB9LCBtZXRhLCB7XG4gICAgICAgICAgICAgICAgICAgICAgICBvcmRlcjogb3JkZXJzJFsgayBdLFxuICAgICAgICAgICAgICAgICAgICAgICAgdG90YWw6IG9yZGVycyRbIGsgXS5yZWR1Y2UoKCB4LCB5ICkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB4ICsgeS5jb3VudDtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sIDAgKVxuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHJldHVybiBtZXRhO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHJldHVybiBjdHguYm9keSA9IHtcbiAgICAgICAgICAgICAgICBzdGF0dXM6IDIwMCxcbiAgICAgICAgICAgICAgICBkYXRhOiBsaXN0LFxuICAgICAgICAgICAgfVxuXG4gICAgICAgIH0gY2F0Y2ggKCBlICkgeyByZXR1cm4gY3R4LmJvZHkgPSB7IHN0YXR1czogNTAwIH07fVxuICAgIH0pXG5cbiAgICAvKipcbiAgICAgKiDotK3nianmuIXljZXosIPmlbRcbiAgICAgKiAtLS0tLS0tLSDor7fmsYJcbiAgICAgKiB7XG4gICAgICogICAgc2hvcHBpbmdJZCwgYWRqdXN0UHJpY2UsIHB1cmNoYXNlLCBhZGp1c3RHcm91cFByaWNlXG4gICAgICogfVxuICAgICAqL1xuICAgIGFwcC5yb3V0ZXIoJ2FkanVzdCcsIGFzeW5jKCBjdHgsIG5leHQgKSA9PiB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGNvbnN0IHsgc2hvcHBpbmdJZCwgYWRqdXN0UHJpY2UsIGFkanVzdEdyb3VwUHJpY2UgfSA9IGV2ZW50LmRhdGE7XG5cbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICog5riF5Y2V77yM5YWI5ou/5Yiw6K6i5Y2V6YeH6LSt5oC75pWwXG4gICAgICAgICAgICAgKiDpmo/lkI7mm7TmlrDvvJrph4fotK3ph4/jgIHmuIXljZXllK7ku7fjgIHmuIXljZXlm6LotK3ku7fjgIFiYXNlX3N0YXR1c+OAgWJ1eV9zdGF0dXNcbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgY29uc3Qgc2hvcHBpbmckID0gYXdhaXQgZGIuY29sbGVjdGlvbignc2hvcHBpbmctbGlzdCcpXG4gICAgICAgICAgICAgICAgLmRvYyggc2hvcHBpbmdJZCApXG4gICAgICAgICAgICAgICAgLmdldCggKTtcbiAgIFxuICAgICAgICAgICAgY29uc29sZS5sb2coJzExMTExMScsIHNob3BwaW5nJCApO1xuXG4gICAgICAgICAgICBjb25zdCBvcmRlcnMkID0gYXdhaXQgUHJvbWlzZS5hbGwoIHNob3BwaW5nJC5kYXRhLm9pZHMubWFwKCBvaWQgPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiBkYi5jb2xsZWN0aW9uKCdvcmRlcicpXG4gICAgICAgICAgICAgICAgICAgIC5kb2MoIG9pZCApXG4gICAgICAgICAgICAgICAgICAgIC5nZXQoICk7XG4gICAgICAgICAgICB9KSk7XG5cbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCcyMjIyMjIyJywgb3JkZXJzJCApO1xuXG4gICAgICAgICAgICAvLyDliankvZnliIbphY3ph49cbiAgICAgICAgICAgIGxldCBsYXN0QWxsb2NhdGVkID0gMDtcblxuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiDmgLvliIbphY3ph49cbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgbGV0IHB1cmNoYXNlID0gZXZlbnQuZGF0YS5wdXJjaGFzZTtcblxuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiAhIOS8oOWFpeWIhumFjemHj+S4jeiDveWwkeS6juOAguW3suWujOaIkOWIhumFjeiuouWNleeahOaVsOmineS5i+WSjFxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICBjb25zdCBmaW5pc2hBZGp1c3RPcmRlcnMgPSBvcmRlcnMkXG4gICAgICAgICAgICAgICAgLm1hcCgoIHg6IGFueSApID0+IHguZGF0YSApXG4gICAgICAgICAgICAgICAgLmZpbHRlciggbyA9PiBvLmJhc2Vfc3RhdHVzID09PSAnMicgKTtcblxuICAgICAgICAgICAgY29uc29sZS5sb2coJzMzMzMzMycsIGZpbmlzaEFkanVzdE9yZGVycyk7XG5cbiAgICAgICAgICAgIC8vIOW3suWIhumFjemHj1xuICAgICAgICAgICAgY29uc3QgaGFzQmVlbkFkanVzdCA9IGZpbmlzaEFkanVzdE9yZGVycy5yZWR1Y2UoKCB4LCB5ICkgPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiB4ICsgeS5hbGxvY2F0ZWRDb3VudDtcbiAgICAgICAgICAgIH0sIDAgKTtcblxuICAgICAgICAgICAgY29uc29sZS5sb2coJzQ0NDQ0NCcsIGhhc0JlZW5BZGp1c3QgKTtcblxuICAgICAgICAgICAgaWYgKCBwdXJjaGFzZSA8IGhhc0JlZW5BZGp1c3QgKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGN0eC5ib2R5ID0ge1xuICAgICAgICAgICAgICAgICAgICBzdGF0dXM6IDUwMCxcbiAgICAgICAgICAgICAgICAgICAgbWVzc2FnZTogYOaciSR7ZmluaXNoQWRqdXN0T3JkZXJzLmxlbmd0aH3kuKrorqLljZXlt7Lnoa7orqTvvIzmlbDph4/kuI3og73lsJHkuo4ke2hhc0JlZW5BZGp1c3R95Lu2YFxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIFxuICAgICAgICAgICAgbGV0IG5lZWRCdXlUb3RhbCA9IG9yZGVycyQucmVkdWNlKCggeCwgeSApID0+IHtcbiAgICAgICAgICAgICAgICByZXR1cm4geCArICh5IGFzIGFueSkuZGF0YS5jb3VudDtcbiAgICAgICAgICAgIH0sIDAgKTtcblxuICAgICAgICAgICAgY29uc3QgdGVtcCA9IE9iamVjdC5hc3NpZ24oeyB9LCBzaG9wcGluZyQuZGF0YSwge1xuICAgICAgICAgICAgICAgIHB1cmNoYXNlLFxuICAgICAgICAgICAgICAgIGFkanVzdFByaWNlLFxuICAgICAgICAgICAgICAgIGFkanVzdEdyb3VwUHJpY2UsXG4gICAgICAgICAgICAgICAgYmFzZV9zdGF0dXM6ICcxJyxcbiAgICAgICAgICAgICAgICBidXlfc3RhdHVzOiBwdXJjaGFzZSA8IG5lZWRCdXlUb3RhbCA/ICcyJyA6ICcxJyxcbiAgICAgICAgICAgICAgICB1cGRhdGVUaW1lOiBuZXcgRGF0ZSggKS5nZXRUaW1lKCApXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgZGVsZXRlIHRlbXBbJ19pZCddO1xuXG4gICAgICAgICAgICBjb25zb2xlLmxvZygnNTU1NTU1JywgdGVtcClcblxuICAgICAgICAgICAgLy8g5pu05paw5riF5Y2VXG4gICAgICAgICAgICBhd2FpdCBkYi5jb2xsZWN0aW9uKCdzaG9wcGluZy1saXN0JylcbiAgICAgICAgICAgICAgICAuZG9jKCBzaG9wcGluZ0lkIClcbiAgICAgICAgICAgICAgICAuc2V0KHtcbiAgICAgICAgICAgICAgICAgICAgZGF0YTogdGVtcFxuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqICHku6XkuIvorqLljZXpg73mmK/lt7Lku5jorqLph5HnmoRcbiAgICAgICAgICAgICAqIOiuouWNle+8muaJuemHj+WvueiuouWNleeahOS7t+agvOOAgeWboui0reS7t+OAgei0reS5sOeKtuaAgei/m+ihjOiwg+aVtCjlt7LotK3kubAv6L+b6KGM5Lit77yM5YW25LuW5bey57uP56Gu5a6a6LCD5pW055qE6K6i5Y2V77yM5LiN5YGa5aSE55CGKVxuICAgICAgICAgICAgICog5YW25a6e5bqU6K+l5Lmf6KaB6Ieq5Yqo5rOo5YWl6K6i5Y2V5pWw6YeP77yI562W55Wl77ya5YWI5Yiw5YWI5b6X77yM5ZCO5LiL5Y2V5Lya5pyJ5b6X5LiN5Yiw5Y2V55qE6aOO6Zmp77yJXG4gICAgICAgICAgICAgKiAh5aaC5p6c5bey57uP5YiG6YWN6L+H5LqG77yM5YiZ5LiN5YaN6Ieq5Yqo5YiG6YWN6YeH6LSt6YePXG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIGNvbnN0IHNvcnJlZE9yZGVycyA9IG9yZGVycyRcbiAgICAgICAgICAgICAgICAubWFwKCggeDogYW55ICkgPT4geC5kYXRhIClcbiAgICAgICAgICAgICAgICAuZmlsdGVyKCggeDogYW55ICkgPT4geC5iYXNlX3N0YXR1cyA9PT0gJzAnIHx8IHguYmFzZV9zdGF0dXMgPT09ICcxJyApXG4gICAgICAgICAgICAgICAgLnNvcnQoKCB4OiBhbnksIHk6IGFueSApID0+IHguY3JlYXRlVGltZSAtIHkuY3JlYXRlVGltZSApO1xuXG4gICAgICAgICAgICBjb25zb2xlLmxvZygnNjY2NjY2Jywgc29ycmVkT3JkZXJzICk7XG5cbiAgICAgICAgICAgIC8vIOWJqeS9meWIhumFjemHj1xuICAgICAgICAgICAgcHVyY2hhc2UgLT0gaGFzQmVlbkFkanVzdDtcblxuICAgICAgICAgICAgY29uc29sZS5sb2coICc3NzcnLCBwdXJjaGFzZSApO1xuICAgICAgICBcbiAgICAgICAgICAgIGF3YWl0IFByb21pc2UuYWxsKCBzb3JyZWRPcmRlcnMubWFwKCBhc3luYyBvcmRlciA9PiB7XG5cbiAgICAgICAgICAgICAgICBjb25zdCBiYXNlVGVtcCA9IHtcbiAgICAgICAgICAgICAgICAgICAgYWxsb2NhdGVkUHJpY2U6IGFkanVzdFByaWNlLFxuICAgICAgICAgICAgICAgICAgICBhbGxvY2F0ZWRHcm91cFByaWNlOiBhZGp1c3RHcm91cFByaWNlLFxuICAgICAgICAgICAgICAgICAgICAvLyDml6Dorrroh6rliqjliIbphY3mmK/lkKbmiJDlip/vvIzpg73mmK/ooqvigJzliIbphY3igJ3mk43kvZzov4fnmoRcbiAgICAgICAgICAgICAgICAgICAgYmFzZV9zdGF0dXM6ICcxJyxcbiAgICAgICAgICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgICAgICAgICAqICEgdjE6IOWJqeS9meWIhumFjemHj+S4jei2s+mHh+i0remHj+WwseWIhumFjTBcbiAgICAgICAgICAgICAgICAgICAgICogISB2Mjog5Ymp5L2Z5YiG6YWN6YeP5LiN6Laz6YeH6LSt6YeP77yM5bCx5YiG6YWN5Ymp5L2Z55qE6YeH6LSt6YePXG4gICAgICAgICAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgICAgICAgICAvLyBhbGxvY2F0ZWRDb3VudDogcHVyY2hhc2UgLSBvcmRlci5jb3VudCA+PSAwID8gb3JkZXIuY291bnQgOiAwXG4gICAgICAgICAgICAgICAgICAgIGFsbG9jYXRlZENvdW50OiBwdXJjaGFzZSAtIG9yZGVyLmNvdW50ID49IDAgP1xuICAgICAgICAgICAgICAgICAgICAgICAgb3JkZXIuY291bnQgOlxuICAgICAgICAgICAgICAgICAgICAgICAgcHVyY2hhc2VcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIC8vIOWIhumFjeaIkOWKn1xuICAgICAgICAgICAgICAgIGlmICggcHVyY2hhc2UgLSBvcmRlci5jb3VudCA+PSAwICkge1xuICAgICAgICAgICAgICAgICAgICBsYXN0QWxsb2NhdGVkID0gcHVyY2hhc2UgLSBvcmRlci5jb3VudDtcbiAgICAgICAgICAgICAgICAgICAgcHVyY2hhc2UgLT0gb3JkZXIuY291bnQ7XG5cbiAgICAgICAgICAgICAgICAvLyDotKfmupDkuI3otrPvvIzliIbphY3mnIDlkI7nmoTliankvZnph49cbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBsYXN0QWxsb2NhdGVkID0gMDtcbiAgICAgICAgICAgICAgICAgICAgcHVyY2hhc2UgPSAwO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGNvbnN0IHRlbXAgPSBPYmplY3QuYXNzaWduKHsgfSwgb3JkZXIsIGJhc2VUZW1wICk7XG5cbiAgICAgICAgICAgICAgICBkZWxldGUgdGVtcFsnX2lkJ107XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgYXdhaXQgZGIuY29sbGVjdGlvbignb3JkZXInKVxuICAgICAgICAgICAgICAgICAgICAuZG9jKCBvcmRlci5faWQgKVxuICAgICAgICAgICAgICAgICAgICAuc2V0KHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRhdGE6IHRlbXBcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuXG4gICAgICAgICAgICB9KSk7XG5cbiAgICAgICAgICAgIC8vIOabtOaWsOa4heWNleeahOWJqeS9meWIhumFjeaVsFxuICAgICAgICAgICAgYXdhaXQgZGIuY29sbGVjdGlvbignc2hvcHBpbmctbGlzdCcpXG4gICAgICAgICAgICAgICAgLmRvYyggc2hvcHBpbmdJZCApXG4gICAgICAgICAgICAgICAgLnVwZGF0ZSh7XG4gICAgICAgICAgICAgICAgICAgIGRhdGE6IHsgbGFzdEFsbG9jYXRlZCB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgIFxuICAgICAgICAgICAgcmV0dXJuIGN0eC5ib2R5ID0ge1xuICAgICAgICAgICAgICAgIHN0YXR1czogMjAwXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfSBjYXRjaCAoIGUgKSB7IHJldHVybiBjdHguYm9keSA9IHsgc3RhdHVzOiA1MDAgfTt9XG4gICAgfSlcblxuICAgIC8qKlxuICAgICAqIEBkZXNjcmlwdGlvblxuICAgICAqIOiOt+WPluihjOeoi+mHjOaYr+WQpui/mOacieacquiwg+aVtOeahOa4heWNlVxuICAgICovXG4gICAgYXBwLnJvdXRlcignYWRqdXN0LXN0YXR1cycsIGFzeW5jKCBjdHgsIG5leHQgKSA9PiB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBjb25zdCB7IHRpZCB9ID0gZXZlbnQuZGF0YTtcbiAgICAgICAgICAgIGNvbnN0IGNvdW50ID0gYXdhaXQgZGIuY29sbGVjdGlvbignc2hvcHBpbmctbGlzdCcpXG4gICAgICAgICAgICAgICAgLndoZXJlKHtcbiAgICAgICAgICAgICAgICAgICAgdGlkLFxuICAgICAgICAgICAgICAgICAgICBiYXNlX3N0YXR1czogJzAnXG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAuY291bnQoICk7XG5cbiAgICAgICAgICAgIHJldHVybiBjdHguYm9keSA9IHtcbiAgICAgICAgICAgICAgICBzdGF0dXM6IDIwMCxcbiAgICAgICAgICAgICAgICBkYXRhOiBjb3VudC50b3RhbFxuICAgICAgICAgICAgfVxuXG4gICAgICAgIH0gY2F0Y2ggKCBlICkge1xuICAgICAgICAgICAgcmV0dXJuIGN0eC5ib2R5ID0geyBzdGF0dXM6IDUwMCB9O1xuICAgICAgICB9XG4gICAgfSlcblxuICAgIC8qKlxuICAgICAqIEBkZXNjcmlwdGlvblxuICAgICAqIOetieW+heaLvOWbouWIl+ihqCAvIOWPr+aLvOWbouWIl+ihqFxuICAgICAqIHtcbiAgICAgKiAgICB0aWQsXG4gICAgICogICAgcGlkLFxuICAgICAqICAgIGRldGFpbDogYm9vbGVhbiDmmK/lkKbluKblm57llYblk4Hor6bmg4VcbiAgICAgKiAgICAh77yI5Y+v5peg77yJdHlwZTogJ3dhaXQnIHwgJ3BpbicgLy8g562J5b6F5ou85Zui77yM5bey57uP5Y+v5Lul5ou85ZuiXG4gICAgICogfVxuICAgICAqL1xuICAgIGFwcC5yb3V0ZXIoJ3BpbicsIGFzeW5jKCBjdHgsIG5leHQgKSA9PiB7XG4gICAgICAgIHRyeSB7XG5cbiAgICAgICAgICAgIGNvbnN0IG9wZW5pZCA9IGV2ZW50LnVzZXJJbmZvLm9wZW5JZDtcbiAgICAgICAgICAgIGNvbnN0IHR5cGUgPSBldmVudC5kYXRhLnR5cGUgfHwgJ3Bpbic7XG4gICAgICAgICAgICBjb25zdCB7IHRpZCwgZGV0YWlsLCBwaWQgfSA9IGV2ZW50LmRhdGE7XG5cbiAgICAgICAgICAgIGNvbnN0IHF1ZXJ5ID0gcGlkID8ge1xuICAgICAgICAgICAgICAgIHRpZCxcbiAgICAgICAgICAgICAgICBwaWRcbiAgICAgICAgICAgIH0gOiB7XG4gICAgICAgICAgICAgICAgdGlkXG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICBjb25zdCBzaG9wcGluZyQgPSBhd2FpdCBkYi5jb2xsZWN0aW9uKCdzaG9wcGluZy1saXN0JylcbiAgICAgICAgICAgICAgICAud2hlcmUoIHF1ZXJ5IClcbiAgICAgICAgICAgICAgICAuZ2V0KCApO1xuXG4gICAgICAgICAgICAvLyB1aWRz6ZW/5bqm5Li6Me+8jOS4uuW+heaLvOWIl+ihqCAoIOS4jeW6lOivpeacieiHquW3sSApXG4gICAgICAgICAgICAvLyB1aWRz6ZW/5bqm5Li6Mu+8jOS4uuWPr+S7peaLvOWbouWIl+ihqFxuICAgICAgICAgICAgLy8g5ou85Zui44CB562J5b6F5ou85ZuiXG4gICAgICAgICAgICBsZXQgZGF0YTogYW55ID0gWyBdO1xuICAgICAgICAgICAgY29uc3QgZGF0YSQgPSBzaG9wcGluZyQuZGF0YS5maWx0ZXIoIHMgPT4ge1xuICAgICAgICAgICAgICAgIGlmICggdHlwZSA9PT0gJ3BpbicgKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAhIXMuYWRqdXN0R3JvdXBQcmljZSAmJiBzLnVpZHMubGVuZ3RoID4gMVxuXG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmICggdHlwZSA9PT0gJ3dhaXQnICkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gISFzLmFkanVzdEdyb3VwUHJpY2UgJiYgcy51aWRzLmxlbmd0aCA9PT0gMSAmJiBzLnVpZHNbIDAgXSAhPT0gb3BlbmlkXG5cbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gKCAhIXMuYWRqdXN0R3JvdXBQcmljZSAmJiBzLnVpZHMubGVuZ3RoID4gMSApIHx8XG4gICAgICAgICAgICAgICAgICAgICAgICAoICEhcy5hZGp1c3RHcm91cFByaWNlICYmIHMudWlkcy5sZW5ndGggPT09IDEgJiYgcy51aWRzWyAwIF0gIT09IG9wZW5pZCApXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIGRhdGEgPSBkYXRhJDtcblxuICAgICAgICAgICAgLy8g5rOo5YWl5ZWG5ZOB6K+m5oOFXG4gICAgICAgICAgICBpZiAoIGRldGFpbCA9PT0gdW5kZWZpbmVkIHx8ICEhZGV0YWlsICkge1xuICAgICAgICAgICAgICAgIGNvbnN0IGRhdGEgPSBkYXRhJC5tYXAoIHNob3BwaW5nID0+IHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIE9iamVjdC5hc3NpZ24oeyB9LCBzaG9wcGluZywge1xuICAgICAgICAgICAgICAgICAgICAgICAgZGV0YWlsOiB7IH1cbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIFxuICAgICAgICAgICAgcmV0dXJuIGN0eC5ib2R5ID0ge1xuICAgICAgICAgICAgICAgIGRhdGEsXG4gICAgICAgICAgICAgICAgc3RhdHVzOiAyMDBcbiAgICAgICAgICAgIH1cblxuICAgICAgICB9IGNhdGNoICggZSApIHtcbiAgICAgICAgICAgIHJldHVybiBjdHguYm9keSA9IHsgc3RhdHVzOiA1MDAgfTtcbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgLyoqIEBkZXNjcmlwdGlvblxuICAgICAqIOS7meWls+i0reeJqea4heWNlVxuICAgICAqL1xuICAgIGFwcC5yb3V0ZXIoJ2ZhaXJ5LXNob3BwaW5nbGlzdCcsIGFzeW5jKCBjdHgsIG5leHQgKSA9PiB7XG4gICAgICAgIHRyeSB7XG5cbiAgICAgICAgICAgIGNvbnN0IHsgdGlkIH0gPSBldmVudC5kYXRhO1xuICAgICAgICAgICAgY29uc3QgbGltaXQgPSBldmVudC5kYXRhLmxpbWl0IHx8IDU7XG5cbiAgICAgICAgICAgIC8qKiDooYznqIvotK3nianmuIXljZUgKi9cbiAgICAgICAgICAgIGNvbnN0IHNob3BwaW5nTWV0YSQgPSBhd2FpdCBkYi5jb2xsZWN0aW9uKCdzaG9wcGluZy1saXN0JylcbiAgICAgICAgICAgICAgICAud2hlcmUoe1xuICAgICAgICAgICAgICAgICAgICB0aWRcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIC5nZXQoICk7XG4gICAgICAgICAgICBcbiAgICAgICAgXG4gICAgICAgICAgICAvKiog5omA5pyJdWlk77yI5ZCr6YeN5aSN77yJICovXG4gICAgICAgICAgICBsZXQgdWlkczogYW55ID0gWyBdO1xuICAgICAgICAgICAgc2hvcHBpbmdNZXRhJC5kYXRhLm1hcCggc2wgPT4ge1xuICAgICAgICAgICAgICAgIHVpZHMgPSBbIC4uLnVpZHMsIC4uLnNsLnVpZHMgXTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAvKiog5aSE55CG5LyY5YyWXG4gICAgICAgICAgICAgKiDorqnotK3kubDph4/mm7TlpJrnmoTnlKjmiLfvvIzlsZXnpLrlnKjliY3pnaJcbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgbGV0IHVpZE1hcFRpbWVzOiB7XG4gICAgICAgICAgICAgICAgWyBrZXk6IHN0cmluZyBdIDogbnVtYmVyXG4gICAgICAgICAgICB9ID0geyB9O1xuICAgICAgICAgICAgdWlkcy5tYXAoIHVpZHN0cmluZyA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKCAhdWlkTWFwVGltZXNbIHVpZHN0cmluZyBdKSB7XG4gICAgICAgICAgICAgICAgICAgIHVpZE1hcFRpbWVzID0gT2JqZWN0LmFzc2lnbih7IH0sIHVpZE1hcFRpbWVzLCB7XG4gICAgICAgICAgICAgICAgICAgICAgICBbIHVpZHN0cmluZyBdOiAxXG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdWlkTWFwVGltZXMgPSBPYmplY3QuYXNzaWduKHsgfSwgdWlkTWFwVGltZXMsIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIFsgdWlkc3RyaW5nIF06IHVpZE1hcFRpbWVzWyB1aWRzdHJpbmcgXSArIDFcbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgLyoqIOWJjTXlkI3nmoTnlKjmiLdpZCAqL1xuICAgICAgICAgICAgY29uc3QgdXNlcklkcyA9IE9iamVjdC5lbnRyaWVzKCB1aWRNYXBUaW1lcyApXG4gICAgICAgICAgICAgICAgLnNvcnQoKCB4LCB5ICkgPT4gXG4gICAgICAgICAgICAgICAgICAgIHlbIDEgXSAtIHhbIDEgXVxuICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgICAuc2xpY2UoIDAsIGxpbWl0IClcbiAgICAgICAgICAgICAgICAubWFwKCB4ID0+IHhbIDAgXSk7XG5cbiAgICAgICAgICAgIC8qKiDmr4/kuKrnlKjmiLfnmoTkv6Hmga8gKi9cbiAgICAgICAgICAgIGNvbnN0IHVzZXJzJCA9IGF3YWl0IFByb21pc2UuYWxsKCB1c2VySWRzLm1hcCggdWlkID0+IFByb21pc2UuYWxsKFtcbiAgICAgICAgICAgICAgICBkYi5jb2xsZWN0aW9uKCd1c2VyJylcbiAgICAgICAgICAgICAgICAgICAgLndoZXJlKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG9wZW5pZDogdWlkXG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgIC5nZXQoIClcbiAgICAgICAgICAgIF0pKSk7XG5cbiAgICAgICAgICAgIC8qKiDliY015Lq655qE5Y2h5Yi4ICovXG4gICAgICAgICAgICBjb25zdCBjb3Vwb25zJDogYW55ID0gYXdhaXQgUHJvbWlzZS5hbGwoXG4gICAgICAgICAgICAgICAgdXNlcklkcy5tYXAoIHVpZCA9PiBcbiAgICAgICAgICAgICAgICAgICAgZGIuY29sbGVjdGlvbignY291cG9uJylcbiAgICAgICAgICAgICAgICAgICAgICAgIC53aGVyZShfLm9yKFtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRpZCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb3BlbmlkOiB1aWRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9wZW5pZDogdWlkLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYW5Vc2VJbk5leHQ6IHRydWVcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBdKSlcbiAgICAgICAgICAgICAgICAgICAgICAgIC5maWVsZCh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZTogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvcGVuaWQ6IHRydWVcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgICAgICAuZ2V0KCApXG4gICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgKVxuXG4gICAgICAgICAgICAvKiog5YmNNeS4quS6uuaAu+eahOi0reeJqea4heWNlSAqL1xuICAgICAgICAgICAgY29uc3Qgc2hvcHBpbmdNZXRhRmlsdGVyID0gc2hvcHBpbmdNZXRhJC5kYXRhLmZpbHRlciggcyA9PiBcbiAgICAgICAgICAgICAgICAhIXVzZXJJZHMuZmluZCggdWlkID0+IFxuICAgICAgICAgICAgICAgICAgICBzLnVpZHMuZmluZCggXG4gICAgICAgICAgICAgICAgICAgICAgICB1ID0+IHUgPT09IHVpZFxuICAgICAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICApKTtcblxuICAgICAgICAgICAgLyoqIOWVhuWTgWlkICovXG4gICAgICAgICAgICBjb25zdCBwSWRzID0gQXJyYXkuZnJvbShcbiAgICAgICAgICAgICAgICBuZXcgU2V0KCBcbiAgICAgICAgICAgICAgICAgICAgc2hvcHBpbmdNZXRhRmlsdGVyXG4gICAgICAgICAgICAgICAgICAgICAgICAubWFwKCBzID0+IHMucGlkIClcbiAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICApO1xuXG4gICAgICAgICAgICAvKiog5ZWG5ZOB6K+m5oOFICovICAgICAgICAgICAgXG4gICAgICAgICAgICBjb25zdCBkZXRhaWxzJCA9IGF3YWl0IFByb21pc2UuYWxsKCBwSWRzLm1hcCggcGlkID0+IHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZGIuY29sbGVjdGlvbignZ29vZHMnKVxuICAgICAgICAgICAgICAgICAgICAuZG9jKCBwaWQgKVxuICAgICAgICAgICAgICAgICAgICAuZmllbGQoe1xuICAgICAgICAgICAgICAgICAgICAgICAgX2lkOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICAgICAgdGFnOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICAgICAgaW1nOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICAgICAgdGl0bGU6IHRydWVcbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgLmdldCggKVxuICAgICAgICAgICAgfSkpO1xuXG4gICAgICAgICAgICAvKiog6LSt54mp5riF5Y2V5rOo5YWl5ZWG5ZOB6K+m5oOFICovXG4gICAgICAgICAgICBjb25zdCBzaG9wcGluZ0luamVjdCA9IHNob3BwaW5nTWV0YUZpbHRlci5tYXAoIHNsID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCBkZXRhaWwgPSBkZXRhaWxzJC5maW5kKCB4ID0+IHguZGF0YS5faWQgPT09IHNsLnBpZCApO1xuICAgICAgICAgICAgICAgIGlmICggZGV0YWlsICkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gT2JqZWN0LmFzc2lnbih7IH0sIHNsLCB7XG4gICAgICAgICAgICAgICAgICAgICAgICBkZXRhaWw6IGRldGFpbC5kYXRhXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBPYmplY3QuYXNzaWduKHsgfSwgc2wgKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgLyoqIOi/lOWbnue7k+aenCAqL1xuICAgICAgICAgICAgY29uc3QgbWV0YURhdGEgPSB1c2VycyQubWFwKCggeCwgayApID0+IHtcbiAgICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgICAgICB1c2VyOiB4WyAwIF0uZGF0YVsgMCBdLFxuICAgICAgICAgICAgICAgICAgICBjb3Vwb25zOiBjb3Vwb25zJFsgayBdLmRhdGEsIFxuICAgICAgICAgICAgICAgICAgICBzaG9wcGluZ2xpc3Q6IHNob3BwaW5nSW5qZWN0LmZpbHRlciggc2wgPT4gc2wudWlkcy5maW5kKCB1aWQgPT4gdWlkID09PSB4WyAwIF0uZGF0YVsgMCBdLm9wZW5pZCApKVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICByZXR1cm4gY3R4LmJvZHkgPSB7XG4gICAgICAgICAgICAgICAgc3RhdHVzOiAyMDAsXG4gICAgICAgICAgICAgICAgZGF0YTogbWV0YURhdGFcbiAgICAgICAgICAgIH1cblxuICAgICAgICB9IGNhdGNoICggZSApIHtcbiAgICAgICAgICAgIHJldHVybiBjdHguYm9keSA9IHsgc3RhdHVzOiA1MDAgfTtcbiAgICAgICAgfVxuICAgIH0pXG5cblxuXG4gICAgcmV0dXJuIGFwcC5zZXJ2ZSggKTtcblxufSJdfQ==