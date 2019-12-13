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
        app.router('detail', function (ctx, next) { return __awaiter(_this, void 0, void 0, function () {
            var _id, openid, data$, metaList, standards_1, activities$_1, insert, e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 5, , 6]);
                        _id = event.data._id;
                        openid = event.userInfo.openId;
                        return [4, db.collection('goods')
                                .where({
                                _id: _id
                            })
                                .get()];
                    case 1:
                        data$ = _a.sent();
                        metaList = data$.data;
                        return [4, Promise.all(metaList.map(function (x) {
                                return db.collection('standards')
                                    .where({
                                    pid: x._id,
                                    isDelete: false
                                })
                                    .get();
                            }))];
                    case 2:
                        standards_1 = _a.sent();
                        return [4, db.collection('activity')
                                .where({
                                pid: _id,
                                isClosed: false,
                                isDeleted: false,
                                type: 'good_discount',
                                endTime: _.gt(getNow(true))
                            })
                                .field({
                                pid: true,
                                sid: true,
                                title: true,
                                ac_price: true,
                                endTime: true,
                                ac_groupPrice: true
                            })
                                .get()];
                    case 3:
                        activities$_1 = _a.sent();
                        insert = metaList.map(function (x, k) { return Object.assign({}, x, {
                            activities: activities$_1.data,
                            standards: standards_1[k].data
                        }); });
                        return [4, cloud.callFunction({
                                data: {
                                    data: {
                                        openid: openid,
                                        pid: _id,
                                    },
                                    $url: 'update-good-visit-record'
                                },
                                name: 'good'
                            })];
                    case 4:
                        _a.sent();
                        return [2, ctx.body = {
                                status: 200,
                                data: insert[0]
                            }];
                    case 5:
                        e_1 = _a.sent();
                        return [2, ctx.body = {
                                status: 500,
                                message: e_1
                            }];
                    case 6: return [2];
                }
            });
        }); });
        app.router('rank', function (ctx, next) { return __awaiter(_this, void 0, void 0, function () {
            var bjpConfig, limit, _a, category, sort, search$, search, where$, bjpConfig$, total$, data$, standards_2, insertStandars, activities$_2, insertActivity, e_2;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 6, , 7]);
                        bjpConfig = null;
                        limit = event.data.limit || 20;
                        _a = event.data, category = _a.category, sort = _a.sort;
                        search$ = event.data.search || '';
                        search = new RegExp(search$.replace(/\s+/g, ""), 'i');
                        where$ = {
                            category: category,
                            title: search,
                            visiable: true,
                            isDelete: _.neq(true)
                        };
                        return [4, db.collection('app-config')
                                .where({
                                type: 'app-bjp-visible'
                            })
                                .get()];
                    case 1:
                        bjpConfig$ = _b.sent();
                        bjpConfig = bjpConfig$.data[0];
                        if (!category && !!bjpConfig && !bjpConfig.value) {
                            where$ = Object.assign({}, where$, {
                                category: _.neq('4')
                            });
                        }
                        return [4, db.collection('goods')
                                .where(where$)
                                .count()];
                    case 2:
                        total$ = _b.sent();
                        return [4, db.collection('goods')
                                .where(where$)
                                .limit(limit)
                                .skip((event.data.page - 1) * limit)
                                .orderBy(sort || 'saled', 'desc')
                                .get()];
                    case 3:
                        data$ = _b.sent();
                        return [4, Promise.all(data$.data.map(function (x) {
                                return db.collection('standards')
                                    .where({
                                    pid: x._id,
                                    isDelete: false
                                })
                                    .get();
                            }))];
                    case 4:
                        standards_2 = _b.sent();
                        insertStandars = data$.data.map(function (x, k) { return Object.assign({}, x, {
                            standards: standards_2[k].data
                        }); });
                        return [4, Promise.all(data$.data.map(function (good) {
                                return db.collection('activity')
                                    .where({
                                    pid: good._id,
                                    isClosed: false,
                                    isDeleted: false,
                                    type: 'good_discount',
                                    endTime: _.gt(getNow(true))
                                })
                                    .get();
                            }))];
                    case 5:
                        activities$_2 = _b.sent();
                        insertActivity = insertStandars.map(function (x, k) { return Object.assign({}, x, {
                            activities: activities$_2[k].data
                        }); });
                        return [2, ctx.body = {
                                status: 200,
                                data: {
                                    data: insertActivity,
                                    search: search$.replace(/\s+/g, ''),
                                    pagenation: {
                                        pageSize: limit,
                                        page: event.data.page,
                                        total: total$.total,
                                        totalPage: Math.ceil(total$.total / limit)
                                    }
                                }
                            }];
                    case 6:
                        e_2 = _b.sent();
                        return [2, ctx.body = {
                                status: 500,
                                message: e_2
                            }];
                    case 7: return [2];
                }
            });
        }); });
        app.router('pin-ground', function (ctx, next) { return __awaiter(_this, void 0, void 0, function () {
            var page, limit, search$, search, where$, bjpConfig$, bjpConfig, total$, data$, standards_3, insertStandars, activities$_3, insertActivity, e_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 6, , 7]);
                        page = event.data.page;
                        limit = event.data.limit || 10;
                        search$ = event.data.search || '';
                        search = new RegExp(search$.replace(/\s+/g, ""), 'i');
                        where$ = {
                            title: search,
                            visiable: true,
                            isDelete: _.neq(true)
                        };
                        return [4, db.collection('app-config')
                                .where({
                                type: 'app-bjp-visible'
                            })
                                .get()];
                    case 1:
                        bjpConfig$ = _a.sent();
                        bjpConfig = bjpConfig$.data[0];
                        if (!!bjpConfig && !bjpConfig.value) {
                            where$ = Object.assign({}, where$, {
                                category: _.neq('4')
                            });
                        }
                        return [4, db.collection('goods')
                                .where(where$)
                                .count()];
                    case 2:
                        total$ = _a.sent();
                        return [4, db.collection('goods')
                                .where(where$)
                                .limit(limit)
                                .skip((page - 1) * limit)
                                .orderBy('saled', 'desc')
                                .get()];
                    case 3:
                        data$ = _a.sent();
                        return [4, Promise.all(data$.data.map(function (x) {
                                return db.collection('standards')
                                    .where({
                                    pid: x._id,
                                    isDelete: false,
                                })
                                    .get();
                            }))];
                    case 4:
                        standards_3 = _a.sent();
                        insertStandars = data$.data.map(function (x, k) { return Object.assign({}, x, {
                            standards: standards_3[k].data
                        }); });
                        return [4, Promise.all(data$.data.map(function (good) {
                                return db.collection('activity')
                                    .where({
                                    pid: good._id,
                                    isClosed: false,
                                    isDeleted: false,
                                    type: 'good_discount',
                                    endTime: _.gt(getNow(true)),
                                    ac_groupPrice: _.gt(0)
                                })
                                    .get();
                            }))];
                    case 5:
                        activities$_3 = _a.sent();
                        insertActivity = insertStandars.map(function (x, k) { return Object.assign({}, x, {
                            activities: activities$_3[k].data
                        }); });
                        return [2, ctx.body = {
                                status: 200,
                                data: {
                                    data: insertActivity,
                                    pagenation: {
                                        page: page,
                                        pageSize: limit,
                                        total: total$.total,
                                        totalPage: Math.ceil(total$.total / limit)
                                    }
                                }
                            }];
                    case 6:
                        e_3 = _a.sent();
                        return [2, ctx.body = { status: 500 }];
                    case 7: return [2];
                }
            });
        }); });
        app.router('list', function (ctx, next) { return __awaiter(_this, void 0, void 0, function () {
            var limit, searchReq_1, temp_1, total$, data$, metaList, standards_4, insertStandars, carts_1, insertCart, e_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 5, , 6]);
                        limit = event.data.limit || 20;
                        searchReq_1 = {
                            title: (!!event.data.title && !!event.data.title.trim()) ?
                                new RegExp(event.data.title.replace(/\s+/g, ""), 'i') : null
                        };
                        temp_1 = {
                            isDelete: _.neq(true)
                        };
                        Object.keys(searchReq_1).map(function (key) {
                            if (!!searchReq_1[key]) {
                                temp_1[key] = searchReq_1[key];
                            }
                        });
                        return [4, db.collection('goods')
                                .where(temp_1)
                                .count()];
                    case 1:
                        total$ = _a.sent();
                        return [4, db.collection('goods')
                                .where(temp_1)
                                .limit(limit)
                                .skip((event.data.page - 1) * limit)
                                .orderBy('updateTime', 'desc')
                                .get()];
                    case 2:
                        data$ = _a.sent();
                        metaList = data$.data;
                        return [4, Promise.all(metaList.map(function (x) {
                                return db.collection('standards')
                                    .where({
                                    pid: x._id,
                                    isDelete: false
                                })
                                    .get();
                            }))];
                    case 3:
                        standards_4 = _a.sent();
                        insertStandars = metaList.map(function (x, k) { return Object.assign({}, x, {
                            standards: standards_4[k].data
                        }); });
                        return [4, Promise.all(insertStandars.map(function (x) {
                                return db.collection('cart')
                                    .where({
                                    pid: x._id
                                })
                                    .count();
                            }))];
                    case 4:
                        carts_1 = _a.sent();
                        insertCart = insertStandars.map(function (x, k) { return Object.assign({}, x, {
                            carts: carts_1[k].total
                        }); });
                        return [2, ctx.body = {
                                status: 200,
                                data: {
                                    search: event.data.title.replace(/\s+/g, ''),
                                    pageSize: limit,
                                    page: event.data.page,
                                    data: insertCart,
                                    total: total$.total,
                                    totalPage: Math.ceil(total$.total / limit)
                                }
                            }];
                    case 5:
                        e_4 = _a.sent();
                        return [2, ctx.body = {
                                status: 500,
                                message: e_4
                            }];
                    case 6: return [2];
                }
            });
        }); });
        app.router('edit', function (ctx, next) { return __awaiter(_this, void 0, void 0, function () {
            var _id_1, title, check1$, standards, create$, meta, standards_5, allStandards$, wouldSetDelete_1, wouldUpdate_1, wouldCreate, e_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 13, , 14]);
                        _id_1 = event.data._id;
                        title = event.data.title;
                        if (!!_id_1) return [3, 2];
                        return [4, db.collection('goods')
                                .where({
                                title: title,
                                isDelete: _.neq(true)
                            })
                                .count()];
                    case 1:
                        check1$ = _a.sent();
                        if (check1$.total !== 0) {
                            return [2, ctx.body = {
                                    status: 500,
                                    message: '存在同名商品,请检查'
                                }];
                        }
                        ;
                        _a.label = 2;
                    case 2:
                        if (!!_id_1) return [3, 6];
                        standards = event.data.standards;
                        delete event.data['standards'];
                        return [4, db.collection('goods').add({
                                data: Object.assign({}, event.data, {
                                    isDelete: false
                                })
                            })];
                    case 3:
                        create$ = _a.sent();
                        _id_1 = create$._id;
                        if (!(!!standards && Array.isArray(standards))) return [3, 5];
                        return [4, Promise.all(standards.map(function (x) {
                                return db.collection('standards').add({
                                    data: Object.assign({}, x, {
                                        pid: _id_1,
                                        isDelete: false
                                    })
                                });
                            }))];
                    case 4:
                        _a.sent();
                        _a.label = 5;
                    case 5: return [3, 12];
                    case 6:
                        meta = __assign({}, event.data);
                        standards_5 = meta.standards;
                        delete meta._id;
                        delete event.data._id;
                        delete event.data.standards;
                        return [4, db.collection('goods')
                                .doc(_id_1)
                                .set({
                                data: __assign({}, event.data)
                            })];
                    case 7:
                        _a.sent();
                        return [4, db.collection('standards')
                                .where({
                                pid: _id_1
                            })
                                .get()];
                    case 8:
                        allStandards$ = _a.sent();
                        wouldSetDelete_1 = [];
                        wouldUpdate_1 = [];
                        wouldCreate = standards_5.filter(function (x) { return !x._id; });
                        allStandards$.data.filter(function (x) {
                            if (!standards_5.find(function (y) { return y._id === x._id; })) {
                                wouldSetDelete_1.push(x);
                            }
                            else {
                                wouldUpdate_1.push(x);
                            }
                        });
                        return [4, Promise.all(wouldSetDelete_1.map(function (x) {
                                return db.collection('standards')
                                    .doc(x._id)
                                    .update({
                                    data: {
                                        isDelete: true
                                    }
                                });
                            }))];
                    case 9:
                        _a.sent();
                        return [4, Promise.all(wouldUpdate_1.map(function (x) {
                                var newTarget = standards_5.find(function (y) { return y._id === x._id; });
                                var name = newTarget.name, price = newTarget.price, groupPrice = newTarget.groupPrice, stock = newTarget.stock, img = newTarget.img;
                                return db.collection('standards')
                                    .doc(x._id)
                                    .update({
                                    data: {
                                        name: name, price: price, groupPrice: groupPrice, stock: stock, img: img
                                    }
                                });
                            }))];
                    case 10:
                        _a.sent();
                        return [4, Promise.all(wouldCreate.map(function (x) {
                                return db.collection('standards').add({
                                    data: __assign({}, x, { pid: _id_1, isDelete: false })
                                });
                            }))];
                    case 11:
                        _a.sent();
                        _a.label = 12;
                    case 12: return [2, ctx.body = {
                            data: _id_1,
                            status: 200
                        }];
                    case 13:
                        e_5 = _a.sent();
                        return [2, ctx.body = {
                                status: 500,
                                message: e_5
                            }];
                    case 14: return [2];
                }
            });
        }); });
        app.router('update-stock', function (ctx, next) { return __awaiter(_this, void 0, void 0, function () {
            var _a, sid, pid, count, target, targetId, collectionName, find$, e_6;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 3, , 4]);
                        _a = event.data, sid = _a.sid, pid = _a.pid, count = _a.count;
                        target = null;
                        targetId = sid || pid;
                        collectionName = !!sid ? 'standards' : 'goods';
                        return [4, db.collection(collectionName)
                                .where({
                                _id: targetId
                            })
                                .get()];
                    case 1:
                        find$ = _b.sent();
                        if (find$.data.length === 0) {
                            throw !!sid ? '更新库存异常, 当前型号不存在' : '更新库存异常, 当前商品不存在';
                        }
                        target = find$.data[0];
                        if (target.stock === null || target.stock === undefined) {
                            return [2, ctx.body = {
                                    status: 200
                                }];
                        }
                        if (target.stock - count < 0) {
                            throw !!sid ? '更新库存异常, 当前型号库存不足' : '更新库存异常, 当前商品库存不足';
                        }
                        return [4, db.collection(collectionName).doc(targetId)
                                .update({
                                data: {
                                    stock: _.inc(-count)
                                }
                            })];
                    case 2:
                        _b.sent();
                        return [2, ctx.body = {
                                status: 200
                            }];
                    case 3:
                        e_6 = _b.sent();
                        console.log("----\u3010Error-Good\u3011----\uFF1A" + JSON.stringify(e_6));
                        return [2, ctx.body = { status: 500, message: e_6 }];
                    case 4: return [2];
                }
            });
        }); });
        app.router('client-search', function (ctx, next) { return __awaiter(_this, void 0, void 0, function () {
            var limit, bjpConfig, openid, _a, search, page, category, query, bjpConfig$, adminCheck, categoryFilter, total$, data$, activities$_4, standards$_1, insertActivities, e_7;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 8, , 9]);
                        limit = 10;
                        bjpConfig = null;
                        openid = event.userInfo.openId;
                        _a = event.data, search = _a.search, page = _a.page, category = _a.category;
                        query = null;
                        if (!!category) {
                            query = _.or([
                                {
                                    category: category,
                                    visiable: true,
                                    isDelete: _.neq(true)
                                }, {
                                    category: category,
                                    visiable: true,
                                    isDelete: _.neq(true)
                                }
                            ]);
                        }
                        return [4, db.collection('app-config')
                                .where({
                                type: 'app-bjp-visible'
                            })
                                .get()];
                    case 1:
                        bjpConfig$ = _b.sent();
                        bjpConfig = bjpConfig$.data[0];
                        if (!!!search) return [3, 3];
                        return [4, db.collection('manager-member')
                                .where({
                                openid: openid
                            })
                                .count()];
                    case 2:
                        adminCheck = _b.sent();
                        categoryFilter = _.neq('9999');
                        if (!!bjpConfig && !bjpConfig.value && adminCheck.total === 0) {
                            categoryFilter = _.neq('4');
                        }
                        query = _.or([
                            {
                                visiable: true,
                                isDelete: _.neq(true),
                                category: categoryFilter,
                                title: new RegExp(search.replace(/\s+/g, ''), 'i')
                            }, {
                                visiable: true,
                                isDelete: _.neq(true),
                                category: categoryFilter,
                                detail: new RegExp(search.replace(/\s+/g, ''), 'i')
                            }
                        ]);
                        _b.label = 3;
                    case 3: return [4, db.collection('goods')
                            .where(query)
                            .count()];
                    case 4:
                        total$ = _b.sent();
                        return [4, db.collection('goods')
                                .where(query)
                                .limit(limit)
                                .skip((page - 1) * limit)
                                .orderBy('saled', 'desc')
                                .get()];
                    case 5:
                        data$ = _b.sent();
                        return [4, Promise.all(data$.data.map(function (good) {
                                return db.collection('activity')
                                    .where({
                                    pid: good._id,
                                    isClosed: false,
                                    isDeleted: false,
                                    type: 'good_discount',
                                    endTime: _.gt(getNow(true))
                                })
                                    .field({
                                    pid: true,
                                    sid: true,
                                    title: true,
                                    ac_price: true,
                                    endTime: true,
                                    ac_groupPrice: true
                                })
                                    .get();
                            }))];
                    case 6:
                        activities$_4 = _b.sent();
                        return [4, Promise.all(data$.data.map(function (good) {
                                return db.collection('standards')
                                    .where({
                                    pid: good._id,
                                    isDelete: false
                                })
                                    .get();
                            }))];
                    case 7:
                        standards$_1 = _b.sent();
                        insertActivities = data$.data.map(function (meta, k) {
                            return Object.assign({}, meta, {
                                standards: standards$_1[k].data,
                                activity: activities$_4[k].data.length === 0 ? null : activities$_4[k].data[0]
                            });
                        });
                        return [2, ctx.body = {
                                status: 200,
                                data: {
                                    page: page,
                                    pageSize: limit,
                                    data: insertActivities,
                                    total: total$.total,
                                    totalPage: Math.ceil(total$.total / limit),
                                    search: !!search ? search.replace(/\s+/g, '') : undefined
                                }
                            }];
                    case 8:
                        e_7 = _b.sent();
                        return [2, ctx.body = { status: 500 }];
                    case 9: return [2];
                }
            });
        }); });
        app.router('set-visiable', function (ctx, next) { return __awaiter(_this, void 0, void 0, function () {
            var _a, pid, visiable, e_8;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        _a = event.data, pid = _a.pid, visiable = _a.visiable;
                        return [4, db.collection('goods')
                                .doc(pid)
                                .update({
                                data: {
                                    visiable: visiable,
                                    updateTime: getNow(true)
                                }
                            })];
                    case 1:
                        _b.sent();
                        return [2, ctx.body = { status: 200 }];
                    case 2:
                        e_8 = _b.sent();
                        return [2, ctx.body = { status: 500 }];
                    case 3: return [2];
                }
            });
        }); });
        app.router('delete', function (ctx, next) { return __awaiter(_this, void 0, void 0, function () {
            var pid, e_9;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        pid = event.data.pid;
                        return [4, db.collection('goods')
                                .doc(String(pid))
                                .update({
                                data: {
                                    isDelete: true
                                }
                            })];
                    case 1:
                        _a.sent();
                        return [2, ctx.body = {
                                data: pid,
                                status: 200
                            }];
                    case 2:
                        e_9 = _a.sent();
                        return [2, ctx.body = { status: 500 }];
                    case 3: return [2];
                }
            });
        }); });
        app.router('push-integral-rank', function (ctx, next) { return __awaiter(_this, void 0, void 0, function () {
            var page, limit, where$, total$, data$, standards_6, insertStandars, activities$_5, insertActivity, e_10;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 5, , 6]);
                        page = event.data.page;
                        limit = event.data.limit || 20;
                        where$ = {
                            isDelete: _.neq(true),
                            category: _.or(_.eq('0'), _.eq('1'))
                        };
                        return [4, db.collection('goods')
                                .where(where$)
                                .count()];
                    case 1:
                        total$ = _a.sent();
                        return [4, db.collection('goods')
                                .where(where$)
                                .limit(limit)
                                .skip((page - 1) * limit)
                                .orderBy('saled', 'desc')
                                .orderBy('fadePrice', 'desc')
                                .get()];
                    case 2:
                        data$ = _a.sent();
                        return [4, Promise.all(data$.data.map(function (x) {
                                return db.collection('standards')
                                    .where({
                                    pid: x._id,
                                    isDelete: false
                                })
                                    .get();
                            }))];
                    case 3:
                        standards_6 = _a.sent();
                        insertStandars = data$.data.map(function (x, k) { return Object.assign({}, x, {
                            standards: standards_6[k].data
                        }); });
                        return [4, Promise.all(data$.data.map(function (good) {
                                return db.collection('activity')
                                    .where({
                                    pid: good._id,
                                    isClosed: false,
                                    isDeleted: false,
                                    type: 'good_discount',
                                    endTime: _.gt(getNow(true))
                                })
                                    .get();
                            }))];
                    case 4:
                        activities$_5 = _a.sent();
                        insertActivity = insertStandars.map(function (x, k) { return Object.assign({}, x, {
                            activities: activities$_5[k].data
                        }); });
                        return [2, ctx.body = {
                                status: 200,
                                data: {
                                    data: insertActivity,
                                    pagenation: {
                                        page: page,
                                        pageSize: limit,
                                        total: total$.total,
                                        totalPage: Math.ceil(total$.total / limit)
                                    }
                                }
                            }];
                    case 5:
                        e_10 = _a.sent();
                        return [2, ctx.body = {
                                status: 500
                            }];
                    case 6: return [2];
                }
            });
        }); });
        app.router('update-good-visit-record', function (ctx, next) { return __awaiter(_this, void 0, void 0, function () {
            var pid, openid, record$, record, e_11;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 6, , 7]);
                        pid = event.data.pid;
                        openid = event.data.openId || event.data.openid || event.userInfo.openId;
                        return [4, db.collection('good-visiting-record')
                                .where({
                                pid: pid,
                                openid: openid
                            })
                                .get()];
                    case 1:
                        record$ = _a.sent();
                        record = record$.data[0];
                        if (!!!record) return [3, 3];
                        return [4, db.collection('good-visiting-record')
                                .doc(String(record._id))
                                .update({
                                data: {
                                    visitTime: getNow(true)
                                }
                            })];
                    case 2:
                        _a.sent();
                        return [3, 5];
                    case 3: return [4, db.collection('good-visiting-record')
                            .add({
                            data: {
                                pid: pid,
                                openid: openid,
                                visitTime: getNow(true)
                            }
                        })];
                    case 4:
                        _a.sent();
                        _a.label = 5;
                    case 5: return [2, ctx.body = {
                            status: 200
                        }];
                    case 6:
                        e_11 = _a.sent();
                        return [2, ctx.body = {
                                status: 500
                            }];
                    case 7: return [2];
                }
            });
        }); });
        app.router('good-visitors', function (ctx, next) { return __awaiter(_this, void 0, void 0, function () {
            var _a, pid, before, start, search, visitors$, visitors, users$, users, e_12;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 3, , 4]);
                        _a = event.data, pid = _a.pid, before = _a.before, start = _a.start;
                        search = { pid: pid };
                        if (!!start && !!before) {
                            search = __assign({}, search, { visitTime: _.and(_.gte(start), _.lt(before)) });
                        }
                        else if (!!start && !before) {
                            search = __assign({}, search, { visitTime: _.gte(start) });
                        }
                        else if (!start && !!before) {
                            search = __assign({}, search, { visitTime: _.lt(before) });
                        }
                        return [4, db.collection('good-visiting-record')
                                .where(search)
                                .get()];
                    case 1:
                        visitors$ = _b.sent();
                        visitors = visitors$.data;
                        return [4, Promise.all(visitors.map(function (visitor) { return __awaiter(_this, void 0, void 0, function () {
                                var user$, user;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4, db.collection('user')
                                                .where({
                                                openid: visitor.openid
                                            })
                                                .field({
                                                openid: true,
                                                nickName: true,
                                                avatarUrl: true,
                                            })
                                                .get()];
                                        case 1:
                                            user$ = _a.sent();
                                            user = user$.data[0];
                                            return [2, !!user ? user : null];
                                    }
                                });
                            }); }))];
                    case 2:
                        users$ = _b.sent();
                        users = users$.filter(function (x) { return !!x; });
                        return [2, ctx.body = {
                                status: 200,
                                data: users
                            }];
                    case 3:
                        e_12 = _b.sent();
                        return [2, ctx.body = {
                                status: 500
                            }];
                    case 4: return [2];
                }
            });
        }); });
        return [2, app.serve()];
    });
}); };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLGlCQWlqQ0U7O0FBampDRixxQ0FBdUM7QUFDdkMsc0NBQXdDO0FBRXhDLEtBQUssQ0FBQyxJQUFJLENBQUM7SUFDUCxHQUFHLEVBQUUsT0FBTyxDQUFDLEdBQUcsQ0FBQyxLQUFLO0NBQ3pCLENBQUMsQ0FBQztBQUVILElBQU0sRUFBRSxHQUFnQixLQUFLLENBQUMsUUFBUSxFQUFHLENBQUM7QUFDMUMsSUFBTSxDQUFDLEdBQUcsRUFBRSxDQUFDLE9BQU8sQ0FBQztBQVFyQixJQUFNLE1BQU0sR0FBRyxVQUFFLEVBQVU7SUFBVixtQkFBQSxFQUFBLFVBQVU7SUFDdkIsSUFBSyxFQUFFLEVBQUc7UUFDTixPQUFPLElBQUksQ0FBQyxHQUFHLEVBQUcsQ0FBQztLQUN0QjtJQUNELElBQU0sTUFBTSxHQUFHLElBQUksSUFBSSxDQUFFLElBQUksSUFBSSxFQUFHLENBQUMsY0FBYyxFQUFHLENBQUMsQ0FBQztJQUN4RCxPQUFPLElBQUksSUFBSSxDQUFFLE1BQU0sQ0FBQyxPQUFPLEVBQUcsR0FBRyxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxJQUFJLENBQUUsQ0FBQTtBQUM3RCxDQUFDLENBQUE7QUE2Q1ksUUFBQSxJQUFJLEdBQUcsVUFBUSxLQUFLLEVBQUUsT0FBTzs7OztRQUVoQyxHQUFHLEdBQUcsSUFBSSxTQUFTLENBQUMsRUFBRSxLQUFLLE9BQUEsRUFBRSxDQUFDLENBQUM7UUFRckMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxRQUFRLEVBQUUsVUFBTyxHQUFHLEVBQUUsSUFBSTs7Ozs7O3dCQUd2QixHQUFHLEdBQUcsS0FBSyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUM7d0JBQ3JCLE1BQU0sR0FBRyxLQUFLLENBQUMsUUFBUSxDQUFD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Szs2QkFDZCxFQUFDOzs7d0JBRUYsV0FBTyxHQUFHLENBQUMsSUFBSSxHQUFHO2dDQUNkLE1BQU0sRUFBRSxHQUFHOzZCQUNkLEVBQUM7Ozs7YUFFVCxDQUFDLENBQUM7UUFHSCxXQUFPLEdBQUcsQ0FBQyxLQUFLLEVBQUcsRUFBQzs7S0FFdkIsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIGNsb3VkIGZyb20gJ3d4LXNlcnZlci1zZGsnO1xuaW1wb3J0ICogYXMgVGNiUm91dGVyIGZyb20gJ3RjYi1yb3V0ZXInO1xuXG5jbG91ZC5pbml0KHtcbiAgICBlbnY6IHByb2Nlc3MuZW52LmNsb3VkXG59KTtcblxuY29uc3QgZGI6IERCLkRhdGFiYXNlID0gY2xvdWQuZGF0YWJhc2UoICk7XG5jb25zdCBfID0gZGIuY29tbWFuZDtcblxuLyoqIFxuICog6L2s5o2i5qC85p6X5bC85rK75pe25Yy6ICs45pe25Yy6XG4gKiBEYXRlKCkubm93KCkgLyBuZXcgRGF0ZSgpLmdldFRpbWUoKSDmmK/ml7bkuI3ml7bmraPluLjnmoQrOFxuICogRGF0ZS50b0xvY2FsU3RyaW5nKCApIOWlveWDj+aYr+S4gOebtOaYrysw55qEXG4gKiDlhYjmi7/liLAgKzDvvIznhLblkI4rOFxuICovXG5jb25zdCBnZXROb3cgPSAoIHRzID0gZmFsc2UgKTogYW55ID0+IHtcbiAgICBpZiAoIHRzICkge1xuICAgICAgICByZXR1cm4gRGF0ZS5ub3coICk7XG4gICAgfVxuICAgIGNvbnN0IHRpbWVfMCA9IG5ldyBEYXRlKCBuZXcgRGF0ZSggKS50b0xvY2FsZVN0cmluZyggKSk7XG4gICAgcmV0dXJuIG5ldyBEYXRlKCB0aW1lXzAuZ2V0VGltZSggKSArIDggKiA2MCAqIDYwICogMTAwMCApXG59XG5cbi8qKlxuICogXG4gKiBAZGVzY3JpcHRpb24gXG4gKiDliJvlu7ov57yW6L6R5ZWG5ZOBXG4gKiB7XG4gKiAgICAgIF9pZDogaWRcbiAqICAgICAgaXNEZWxldGU6IOaYr+WQpuWIoOmZpFxuICogICAgICB0aXRsZTog5ZWG5ZOB5ZCN56ewIFN0cmluZ1xuICogICAgICBkZXRhaWwhOiDllYblk4Hmj4/ov7AgU3RyaW5nXG4gKiAgICAgIHRhZzog5ZWG5ZOB5qCH562+IEFycmF5PFN0cmluZz5cbiAqICAgICAgY2F0ZWdvcnk6IOWVhuWTgeexu+ebriBTdHJpbmdcbiAqICAgICAgaW1nOiDllYblk4Hlm77niYcgQXJyYXk8U3RyaW5nPlxuICogICAgICBwcmljZTog5Lu35qC8IE51bWJlclxuICogICAgICBmYWRlUHJpY2U6IOWIkue6v+S7tyBOdW1iZXJcbiAqICAgICAgZ3JvdXBQcmljZSE6IOWboui0reS7tyBOdW1iZXJcbiAqICAgICAgc3RvY2shOiDlupPlrZggTnVtYmVyXG4gKiAgICAgIGRlcG9zaXRQcmljZSE6IOWVhuWTgeiuoumHkSBOdW1iZXJcbiAqICAgICAgbGltaXQhOiDpmZDotK3mlbDph48gTnVtYmVyXG4gKiAgICAgIHZpc2lhYmxlOiDmmK/lkKbkuIrmnrYgQm9vbGVhblxuICogICAgICBzYWxlZDog6ZSA6YePIE51bWJlclxuICogICAgICB1cGRhdGVUaW1lXG4gKiEgICAgICBzdGFuZGFyZHMhOiDlnovlj7fop4TmoLwgQXJyYXk8eyBcbiAqICAgICAgICAgIG5hbWU6IFN0cmluZyxcbiAqICAgICAgICAgIHByaWNlOiBOdW1iZXIsXG4gKiAgICAgICAgICBncm91cFByaWNlITogTnVtYmVyLFxuICogICAgICAgICAgc3RvY2shOiBOdW1iZXI6XG4gKiAgICAgICAgICBpbWc6IFN0cmluZyAsXG4gKiAgICAgICAgICBfaWQ6IHN0cmluZyxcbiAqICAgICAgICAgIHBpZDogc3RyaW5nLFxuICogICAgICAgICAgaXNEZWxldGU6IGJvb2xlYW5cbiAqICAgICAgfT5cbiAqIH1cbiAqIFxuICogXG4gKiBAZGVzY3JpcHRpb25cbiAqIOWVhuWTgea1j+iniOiusOW9lVxuICogXG4gKiB7XG4gKiAgIHBpZFxuICogICBvcGVuaWRcbiAqICAgdmlzaXRUaW1lXG4gKiB9XG4gKi9cbmV4cG9ydCBjb25zdCBtYWluID0gYXN5bmMgKCBldmVudCwgY29udGV4dCApID0+IHtcblxuICAgIGNvbnN0IGFwcCA9IG5ldyBUY2JSb3V0ZXIoeyBldmVudCB9KTtcblxuICAgIC8qKlxuICAgICAqIEBkZXNjcmlwdGlvblxuICAgICAqIOWVhuWTgeivpuaDhVxuICAgICAqIC0tLS0tIOivt+axgiAtLS0tLVxuICAgICAqIF9pZFxuICAgICAqL1xuICAgIGFwcC5yb3V0ZXIoJ2RldGFpbCcsIGFzeW5jKCBjdHgsIG5leHQgKSA9PiB7XG4gICAgICAgIHRyeSB7XG5cbiAgICAgICAgICAgIGNvbnN0IF9pZCA9IGV2ZW50LmRhdGEuX2lkO1xuICAgICAgICAgICAgY29uc3Qgb3BlbmlkID0gZXZlbnQudXNlckluZm8ub3BlbklkO1xuXG4gICAgICAgICAgICAvLyDojrflj5bmlbDmja5cbiAgICAgICAgICAgIGNvbnN0IGRhdGEkID0gYXdhaXQgZGIuY29sbGVjdGlvbignZ29vZHMnKVxuICAgICAgICAgICAgICAgIC53aGVyZSh7XG4gICAgICAgICAgICAgICAgICAgIF9pZFxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLmdldCggKTtcblxuICAgICAgICAgICAgLy8g5ou85o6l5Z6L5Y+3XG4gICAgICAgICAgICBjb25zdCBtZXRhTGlzdCA9IGRhdGEkLmRhdGE7XG4gICAgICAgICAgICBjb25zdCBzdGFuZGFyZHMgPSBhd2FpdCBQcm9taXNlLmFsbCggbWV0YUxpc3QubWFwKCB4ID0+IHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZGIuY29sbGVjdGlvbignc3RhbmRhcmRzJylcbiAgICAgICAgICAgICAgICAgICAgLndoZXJlKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHBpZDogeC5faWQsXG4gICAgICAgICAgICAgICAgICAgICAgICBpc0RlbGV0ZTogZmFsc2VcbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgLmdldCggKTtcbiAgICAgICAgICAgIH0pKTtcblxuICAgICAgICAgICAgLy8g5ou85o6l5Z6L5Y+35oiW5ZWG5ZOB5rS75YqoXG4gICAgICAgICAgICBjb25zdCBhY3Rpdml0aWVzJCA9IGF3YWl0IGRiLmNvbGxlY3Rpb24oJ2FjdGl2aXR5JylcbiAgICAgICAgICAgICAgICAud2hlcmUoe1xuICAgICAgICAgICAgICAgICAgICBwaWQ6IF9pZCxcbiAgICAgICAgICAgICAgICAgICAgaXNDbG9zZWQ6IGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICBpc0RlbGV0ZWQ6IGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICB0eXBlOiAnZ29vZF9kaXNjb3VudCcsXG4gICAgICAgICAgICAgICAgICAgIGVuZFRpbWU6IF8uZ3QoIGdldE5vdyggdHJ1ZSApKVxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLmZpZWxkKHtcbiAgICAgICAgICAgICAgICAgICAgcGlkOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICBzaWQ6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgIHRpdGxlOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICBhY19wcmljZTogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgZW5kVGltZTogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgYWNfZ3JvdXBQcmljZTogdHJ1ZVxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLmdldCggKTtcblxuICAgICAgICAgICAgY29uc3QgaW5zZXJ0ID0gbWV0YUxpc3QubWFwKCggeCwgayApID0+IE9iamVjdC5hc3NpZ24oeyB9LCB4LCB7XG4gICAgICAgICAgICAgICAgYWN0aXZpdGllczogYWN0aXZpdGllcyQuZGF0YSxcbiAgICAgICAgICAgICAgICBzdGFuZGFyZHM6IHN0YW5kYXJkc1sgayBdLmRhdGFcbiAgICAgICAgICAgIH0pKTtcblxuICAgICAgICAgICAgLy8g5Yib5bu65rWP6KeIXG4gICAgICAgICAgICBhd2FpdCBjbG91ZC5jYWxsRnVuY3Rpb24oe1xuICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgICAgICAgb3BlbmlkLFxuICAgICAgICAgICAgICAgICAgICAgICAgcGlkOiBfaWQsXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICR1cmw6ICd1cGRhdGUtZ29vZC12aXNpdC1yZWNvcmQnXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBuYW1lOiAnZ29vZCdcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICByZXR1cm4gY3R4LmJvZHkgPSB7XG4gICAgICAgICAgICAgICAgc3RhdHVzOiAyMDAsXG4gICAgICAgICAgICAgICAgZGF0YTogaW5zZXJ0WyAwIF1cbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgfSBjYXRjaCAoIGUgKSB7XG4gICAgICAgICAgICByZXR1cm4gY3R4LmJvZHkgPSB7XG4gICAgICAgICAgICAgICAgc3RhdHVzOiA1MDAsXG4gICAgICAgICAgICAgICAgbWVzc2FnZTogZVxuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgLyoqXG4gICAgICogQGRlc2NyaXB0aW9uIOWVhuWTgemUgOmHj+aOkuihjOamnOWIl+ihqFxuICAgICAqIC0tLS0tLS0tIOivt+axgiAtLS0tLS0tLS0tXG4gICAgICoge1xuICAgICAqICAgICAgbGltaXRcbiAgICAgKiAgICAgIHNvcnQ6IOaOkuW6j1xuICAgICAqICAgICAgcGFnZTog6aG15pWwXG4gICAgICogICAgICBzZWFyY2g6IOaQnOe0olxuICAgICAqICAgICAgY2F0ZWdvcnk6IOWVhuWTgeexu+ebrlxuICAgICAqIH1cbiAgICAgKiAtLS0tLS0tLS0tIOi/lOWbniAtLS0tLS0tLVxuICAgICAqIHtcbiAgICAgKiAgICAgIGRhdGE6IOWIl+ihqFxuICAgICAqICAgICAgcGFnZTog6aG15pWwXG4gICAgICogICAgICB0b3RhbDog5oC75pWwXG4gICAgICogICAgICB0b3RhbFBhZ2U6IOaAu+mhteaVsFxuICAgICAqICAgICAgcGFnZVNpemU6IDIwXG4gICAgICogfVxuICAgICAqL1xuICAgIGFwcC5yb3V0ZXIoJ3JhbmsnLCBhc3luYyggY3R4LCBuZXh0ICkgPT4ge1xuICAgICAgICB0cnkge1xuXG4gICAgICAgICAgICBsZXQgYmpwQ29uZmlnOiBhbnkgPSBudWxsO1xuICAgICAgICAgICAgLy8g5p+l6K+i5p2h5pWwXG4gICAgICAgICAgICBjb25zdCBsaW1pdCA9IGV2ZW50LmRhdGEubGltaXQgfHwgMjA7XG4gICAgICAgICAgICBjb25zdCB7IGNhdGVnb3J5LCBzb3J0IH0gPSBldmVudC5kYXRhO1xuICAgICAgICAgICAgY29uc3Qgc2VhcmNoJCA9IGV2ZW50LmRhdGEuc2VhcmNoIHx8ICcnO1xuICAgICAgICAgICAgY29uc3Qgc2VhcmNoID0gbmV3IFJlZ0V4cCggc2VhcmNoJC5yZXBsYWNlKC9cXHMrL2csIFwiXCIpLCAnaScpO1xuXG4gICAgICAgICAgICBsZXQgd2hlcmUkID0ge1xuICAgICAgICAgICAgICAgIGNhdGVnb3J5LFxuICAgICAgICAgICAgICAgIHRpdGxlOiBzZWFyY2gsXG4gICAgICAgICAgICAgICAgdmlzaWFibGU6IHRydWUsXG4gICAgICAgICAgICAgICAgaXNEZWxldGU6IF8ubmVxKCB0cnVlIClcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIC8vIOS/neWBpeWTgemFjee9rlxuICAgICAgICAgICAgY29uc3QgYmpwQ29uZmlnJCA9IGF3YWl0IGRiLmNvbGxlY3Rpb24oJ2FwcC1jb25maWcnKVxuICAgICAgICAgICAgICAgICAgICAud2hlcmUoe1xuICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogJ2FwcC1ianAtdmlzaWJsZSdcbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgLmdldCggKTtcbiAgICAgICAgICAgIGJqcENvbmZpZyA9IGJqcENvbmZpZyQuZGF0YVsgMCBdO1xuXG4gICAgICAgICAgICBpZiAoICFjYXRlZ29yeSAmJiAhIWJqcENvbmZpZyAmJiAhYmpwQ29uZmlnLnZhbHVlICkge1xuICAgICAgICAgICAgICAgIHdoZXJlJCA9IE9iamVjdC5hc3NpZ24oeyB9LCB3aGVyZSQsIHtcbiAgICAgICAgICAgICAgICAgICAgY2F0ZWdvcnk6IF8ubmVxKCc0JylcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyDojrflj5bmgLvmlbBcbiAgICAgICAgICAgIGNvbnN0IHRvdGFsJCA9IGF3YWl0IGRiLmNvbGxlY3Rpb24oJ2dvb2RzJylcbiAgICAgICAgICAgICAgICAud2hlcmUoIHdoZXJlJCApXG4gICAgICAgICAgICAgICAgLmNvdW50KCApO1xuXG4gICAgICAgICAgICAvLyDojrflj5bllYblk4HmlbDmja5cbiAgICAgICAgICAgIGNvbnN0IGRhdGEkID0gYXdhaXQgZGIuY29sbGVjdGlvbignZ29vZHMnKVxuICAgICAgICAgICAgICAgIC53aGVyZSggd2hlcmUkIClcbiAgICAgICAgICAgICAgICAubGltaXQoIGxpbWl0IClcbiAgICAgICAgICAgICAgICAuc2tpcCgoIGV2ZW50LmRhdGEucGFnZSAtIDEgKSAqIGxpbWl0IClcbiAgICAgICAgICAgICAgICAub3JkZXJCeSggc29ydCB8fCAnc2FsZWQnLCAnZGVzYycpXG4gICAgICAgICAgICAgICAgLmdldCggKTtcblxuICAgICAgICAgICAgLy8g6I635Y+W5Z6L5Y+35pWw5o2uXG4gICAgICAgICAgICBjb25zdCBzdGFuZGFyZHMgPSBhd2FpdCBQcm9taXNlLmFsbCggZGF0YSQuZGF0YS5tYXAoIHggPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiBkYi5jb2xsZWN0aW9uKCdzdGFuZGFyZHMnKVxuICAgICAgICAgICAgICAgICAgICAud2hlcmUoe1xuICAgICAgICAgICAgICAgICAgICAgICAgcGlkOiB4Ll9pZCxcbiAgICAgICAgICAgICAgICAgICAgICAgIGlzRGVsZXRlOiBmYWxzZVxuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAuZ2V0KCApO1xuICAgICAgICAgICAgfSkpO1xuXG4gICAgICAgICAgICBjb25zdCBpbnNlcnRTdGFuZGFycyA9IGRhdGEkLmRhdGEubWFwKCggeCwgayApID0+IE9iamVjdC5hc3NpZ24oeyB9LCB4LCB7XG4gICAgICAgICAgICAgICAgc3RhbmRhcmRzOiBzdGFuZGFyZHNbIGsgXS5kYXRhXG4gICAgICAgICAgICB9KSk7XG5cbiAgICAgICAgICAgIC8vIOiOt+WPlua0u+WKqOaVsOaNruaVsOaNrlxuICAgICAgICAgICAgY29uc3QgYWN0aXZpdGllcyQgPSBhd2FpdCBQcm9taXNlLmFsbChcbiAgICAgICAgICAgICAgICBkYXRhJC5kYXRhLm1hcCggZ29vZCA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBkYi5jb2xsZWN0aW9uKCdhY3Rpdml0eScpXG4gICAgICAgICAgICAgICAgICAgICAgICAud2hlcmUoe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBpZDogZ29vZC5faWQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaXNDbG9zZWQ6IGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlzRGVsZXRlZDogZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogJ2dvb2RfZGlzY291bnQnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVuZFRpbWU6IF8uZ3QoIGdldE5vdyggdHJ1ZSApKVxuICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgICAgIC5nZXQoIClcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgKTtcblxuICAgICAgICAgICAgY29uc3QgaW5zZXJ0QWN0aXZpdHkgPSBpbnNlcnRTdGFuZGFycy5tYXAoKCB4LCBrICkgPT4gT2JqZWN0LmFzc2lnbih7IH0sIHgsIHtcbiAgICAgICAgICAgICAgICBhY3Rpdml0aWVzOiBhY3Rpdml0aWVzJFsgayBdLmRhdGFcbiAgICAgICAgICAgIH0pKTtcblxuICAgICAgICAgICAgcmV0dXJuIGN0eC5ib2R5ID0ge1xuICAgICAgICAgICAgICAgIHN0YXR1czogMjAwLFxuICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgZGF0YTogaW5zZXJ0QWN0aXZpdHksXG4gICAgICAgICAgICAgICAgICAgIHNlYXJjaDogc2VhcmNoJC5yZXBsYWNlKC9cXHMrL2csICcnKSxcbiAgICAgICAgICAgICAgICAgICAgcGFnZW5hdGlvbjoge1xuICAgICAgICAgICAgICAgICAgICAgICAgcGFnZVNpemU6IGxpbWl0LFxuICAgICAgICAgICAgICAgICAgICAgICAgcGFnZTogZXZlbnQuZGF0YS5wYWdlLFxuICAgICAgICAgICAgICAgICAgICAgICAgdG90YWw6IHRvdGFsJC50b3RhbCxcbiAgICAgICAgICAgICAgICAgICAgICAgIHRvdGFsUGFnZTogTWF0aC5jZWlsKCB0b3RhbCQudG90YWwgLyBsaW1pdCApXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgXG4gICAgICAgIH0gY2F0Y2ggKCBlICkge1xuICAgICAgICAgICAgcmV0dXJuIGN0eC5ib2R5ID0ge1xuICAgICAgICAgICAgICAgIHN0YXR1czogNTAwLFxuICAgICAgICAgICAgICAgIG1lc3NhZ2U6IGVcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgLyoqIFxuICAgICAqIEBkZXNjcmlwdGlvblxuICAgICAqIOaLvOWbouW5v+WcuueahOWPr+aLvOWbouWIl+ihqFxuICAgICAqICAtLS0tLS0tLSDor7fmsYIgLS0tLS0tLS0tLVxuICAgICAqIHtcbiAgICAgKiAgICAgIHBhZ2U6IOmhteaVsFxuICAgICAqICAgICAgc2VhcmNoOiDmkJzntKJcbiAgICAgKiB9XG4gICAgICovXG4gICAgYXBwLnJvdXRlcigncGluLWdyb3VuZCcsIGFzeW5jKCBjdHgsIG5leHQgKSA9PiB7XG4gICAgICAgIHRyeSB7XG5cbiAgICAgICAgICAgIGNvbnN0IHsgcGFnZSB9ID0gZXZlbnQuZGF0YTtcbiAgICAgICAgICAgIGNvbnN0IGxpbWl0ID0gZXZlbnQuZGF0YS5saW1pdCB8fCAxMDtcblxuICAgICAgICAgICAgY29uc3Qgc2VhcmNoJCA9IGV2ZW50LmRhdGEuc2VhcmNoIHx8ICcnO1xuICAgICAgICAgICAgY29uc3Qgc2VhcmNoID0gbmV3IFJlZ0V4cCggc2VhcmNoJC5yZXBsYWNlKC9cXHMrL2csIFwiXCIpLCAnaScpO1xuXG4gICAgICAgICAgICBsZXQgd2hlcmUkID0ge1xuICAgICAgICAgICAgICAgIHRpdGxlOiBzZWFyY2gsXG4gICAgICAgICAgICAgICAgdmlzaWFibGU6IHRydWUsXG4gICAgICAgICAgICAgICAgaXNEZWxldGU6IF8ubmVxKCB0cnVlIClcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIC8vIOS/neWBpeWTgemFjee9rlxuICAgICAgICAgICAgY29uc3QgYmpwQ29uZmlnJCA9IGF3YWl0IGRiLmNvbGxlY3Rpb24oJ2FwcC1jb25maWcnKVxuICAgICAgICAgICAgICAgIC53aGVyZSh7XG4gICAgICAgICAgICAgICAgICAgIHR5cGU6ICdhcHAtYmpwLXZpc2libGUnXG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAuZ2V0KCApO1xuICAgICAgICAgICAgY29uc3QgYmpwQ29uZmlnID0gYmpwQ29uZmlnJC5kYXRhWyAwIF07XG5cbiAgICAgICAgICAgIGlmICggISFianBDb25maWcgJiYgIWJqcENvbmZpZy52YWx1ZSApIHtcbiAgICAgICAgICAgICAgICB3aGVyZSQgPSBPYmplY3QuYXNzaWduKHsgfSwgd2hlcmUkLCB7XG4gICAgICAgICAgICAgICAgICAgIGNhdGVnb3J5OiBfLm5lcSgnNCcpXG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8g6I635Y+W5oC75pWwXG4gICAgICAgICAgICBjb25zdCB0b3RhbCQgPSBhd2FpdCBkYi5jb2xsZWN0aW9uKCdnb29kcycpXG4gICAgICAgICAgICAgICAgLndoZXJlKCB3aGVyZSQgKVxuICAgICAgICAgICAgICAgIC5jb3VudCggKTtcblxuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiDov5nph4zmsqHlr7nllYblk4HjgIHlnovlj7dcbiAgICAgICAgICAgICAqIOi/m+ihjCBncm91cFByaWNlOiBfLmd0KCAwICkgXG4gICAgICAgICAgICAgKiDnmoTpmZDliLZcbiAgICAgICAgICAgICAqIOWOn+WboOaYr+acieWPr+iDvWFjdGl2ZeaYr+acieWboui0reS7t+eahFxuICAgICAgICAgICAgICovXG5cbiAgICAgICAgICAgIC8vIOiOt+WPluWVhuWTgeaVsOaNrlxuICAgICAgICAgICAgY29uc3QgZGF0YSQgPSBhd2FpdCBkYi5jb2xsZWN0aW9uKCdnb29kcycpXG4gICAgICAgICAgICAgICAgLndoZXJlKCB3aGVyZSQgKVxuICAgICAgICAgICAgICAgIC5saW1pdCggbGltaXQgKVxuICAgICAgICAgICAgICAgIC5za2lwKCggcGFnZSAtIDEgKSAqIGxpbWl0IClcbiAgICAgICAgICAgICAgICAub3JkZXJCeSggJ3NhbGVkJywgJ2Rlc2MnKVxuICAgICAgICAgICAgICAgIC5nZXQoICk7XG5cbiAgICAgICAgICAgIC8vIOiOt+WPluWei+WPt+aVsOaNrlxuICAgICAgICAgICAgY29uc3Qgc3RhbmRhcmRzID0gYXdhaXQgUHJvbWlzZS5hbGwoIGRhdGEkLmRhdGEubWFwKCB4ID0+IHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZGIuY29sbGVjdGlvbignc3RhbmRhcmRzJylcbiAgICAgICAgICAgICAgICAgICAgLndoZXJlKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHBpZDogeC5faWQsXG4gICAgICAgICAgICAgICAgICAgICAgICBpc0RlbGV0ZTogZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgIC5nZXQoICk7XG4gICAgICAgICAgICB9KSk7XG5cbiAgICAgICAgICAgIGNvbnN0IGluc2VydFN0YW5kYXJzID0gZGF0YSQuZGF0YS5tYXAoKCB4LCBrICkgPT4gT2JqZWN0LmFzc2lnbih7IH0sIHgsIHtcbiAgICAgICAgICAgICAgICBzdGFuZGFyZHM6IHN0YW5kYXJkc1sgayBdLmRhdGFcbiAgICAgICAgICAgIH0pKTtcblxuICAgICAgICAgICAgLy8g6I635Y+W5rS75Yqo5pWw5o2u5pWw5o2uXG4gICAgICAgICAgICBjb25zdCBhY3Rpdml0aWVzJCA9IGF3YWl0IFByb21pc2UuYWxsKFxuICAgICAgICAgICAgICAgIGRhdGEkLmRhdGEubWFwKCBnb29kID0+IHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGRiLmNvbGxlY3Rpb24oJ2FjdGl2aXR5JylcbiAgICAgICAgICAgICAgICAgICAgICAgIC53aGVyZSh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcGlkOiBnb29kLl9pZCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpc0Nsb3NlZDogZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaXNEZWxldGVkOiBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiAnZ29vZF9kaXNjb3VudCcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZW5kVGltZTogXy5ndCggZ2V0Tm93KCB0cnVlICkpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFjX2dyb3VwUHJpY2U6IF8uZ3QoIDAgKVxuICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgICAgIC5nZXQoIClcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgKTtcblxuICAgICAgICAgICAgY29uc3QgaW5zZXJ0QWN0aXZpdHkgPSBpbnNlcnRTdGFuZGFycy5tYXAoKCB4LCBrICkgPT4gT2JqZWN0LmFzc2lnbih7IH0sIHgsIHtcbiAgICAgICAgICAgICAgICBhY3Rpdml0aWVzOiBhY3Rpdml0aWVzJFsgayBdLmRhdGFcbiAgICAgICAgICAgIH0pKTtcblxuICAgICAgICAgICAgcmV0dXJuIGN0eC5ib2R5ID0ge1xuICAgICAgICAgICAgICAgIHN0YXR1czogMjAwLFxuICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgZGF0YTogaW5zZXJ0QWN0aXZpdHksXG4gICAgICAgICAgICAgICAgICAgIHBhZ2VuYXRpb246IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHBhZ2UsXG4gICAgICAgICAgICAgICAgICAgICAgICBwYWdlU2l6ZTogbGltaXQsXG4gICAgICAgICAgICAgICAgICAgICAgICB0b3RhbDogdG90YWwkLnRvdGFsLFxuICAgICAgICAgICAgICAgICAgICAgICAgdG90YWxQYWdlOiBNYXRoLmNlaWwoIHRvdGFsJC50b3RhbCAvIGxpbWl0IClcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICB9IGNhdGNoICggZSApIHtcbiAgICAgICAgICAgIHJldHVybiBjdHguYm9keSA9IHsgc3RhdHVzOiA1MDAgfTtcbiAgICAgICAgfVxuICAgIH0pXG5cbiAgICAvKipcbiAgICAgKiDllYblk4HliJfooajvvIgg5ZCrc3RhbmRhcmRz44CBYWN0aXZpdGllc+WtkOihqO+8iVxuICAgICAqIHtcbiAgICAgKiAgICB0aXRsZVxuICAgICAqICAgIHNlYXJjaCBcbiAgICAgKiAgICBwYWdlXG4gICAgICogfVxuICAgICAqL1xuICAgIGFwcC5yb3V0ZXIoJ2xpc3QnLCBhc3luYyggY3R4LCBuZXh0ICkgPT4ge1xuICAgICAgICB0cnkge1xuICAgICBcbiAgICAgICAgICAgIC8vIOafpeivouadoeaVsFxuICAgICAgICAgICAgY29uc3QgbGltaXQgPSBldmVudC5kYXRhLmxpbWl0IHx8IDIwO1xuXG4gICAgICAgICAgICAvLyDmn6Xor6LmnaHku7ZcbiAgICAgICAgICAgIGNvbnN0IHNlYXJjaFJlcSA9IHtcbiAgICAgICAgICAgICAgICB0aXRsZTogKCEhZXZlbnQuZGF0YS50aXRsZSAmJiAhIWV2ZW50LmRhdGEudGl0bGUudHJpbSggKSkgPyBcbiAgICAgICAgICAgICAgICAgICAgbmV3IFJlZ0V4cChldmVudC5kYXRhLnRpdGxlLnJlcGxhY2UoL1xccysvZywgXCJcIiksICdpJykgOiBudWxsXG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICBjb25zdCB0ZW1wID0ge1xuICAgICAgICAgICAgICAgIGlzRGVsZXRlOiBfLm5lcSggdHJ1ZSApXG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgT2JqZWN0LmtleXMoIHNlYXJjaFJlcSApLm1hcCgga2V5ID0+IHtcbiAgICAgICAgICAgICAgICBpZiAoICEhc2VhcmNoUmVxWyBrZXkgXSkge1xuICAgICAgICAgICAgICAgICAgICB0ZW1wWyBrZXkgXSA9IHNlYXJjaFJlcVsga2V5IF07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIC8vIOiOt+WPluaAu+aVsFxuICAgICAgICAgICAgY29uc3QgdG90YWwkID0gYXdhaXQgZGIuY29sbGVjdGlvbignZ29vZHMnKVxuICAgICAgICAgICAgICAgIC53aGVyZSggdGVtcCApXG4gICAgICAgICAgICAgICAgLmNvdW50KCApO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICAvLyDojrflj5bmlbDmja5cbiAgICAgICAgICAgIGNvbnN0IGRhdGEkID0gYXdhaXQgZGIuY29sbGVjdGlvbignZ29vZHMnKVxuICAgICAgICAgICAgICAgIC53aGVyZSggdGVtcCApXG4gICAgICAgICAgICAgICAgLmxpbWl0KCBsaW1pdCApXG4gICAgICAgICAgICAgICAgLnNraXAoKCBldmVudC5kYXRhLnBhZ2UgLSAxICkgKiBsaW1pdCApXG4gICAgICAgICAgICAgICAgLm9yZGVyQnkoJ3VwZGF0ZVRpbWUnLCAnZGVzYycpXG4gICAgICAgICAgICAgICAgLmdldCggKTtcblxuICAgICAgICAgICAgY29uc3QgbWV0YUxpc3QgPSBkYXRhJC5kYXRhO1xuICAgICAgICAgICAgY29uc3Qgc3RhbmRhcmRzID0gYXdhaXQgUHJvbWlzZS5hbGwoIG1ldGFMaXN0Lm1hcCggeCA9PiB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGRiLmNvbGxlY3Rpb24oJ3N0YW5kYXJkcycpXG4gICAgICAgICAgICAgICAgICAgIC53aGVyZSh7XG4gICAgICAgICAgICAgICAgICAgICAgICBwaWQ6IHguX2lkLFxuICAgICAgICAgICAgICAgICAgICAgICAgaXNEZWxldGU6IGZhbHNlXG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgIC5nZXQoICk7XG4gICAgICAgICAgICB9KSk7XG5cbiAgICAgICAgICAgIGNvbnN0IGluc2VydFN0YW5kYXJzID0gbWV0YUxpc3QubWFwKCggeCwgayApID0+IE9iamVjdC5hc3NpZ24oeyB9LCB4LCB7XG4gICAgICAgICAgICAgICAgc3RhbmRhcmRzOiBzdGFuZGFyZHNbIGsgXS5kYXRhXG4gICAgICAgICAgICB9KSk7XG4gICBcbiAgICAgICAgICAgIC8vIOafpeivouiiq+WKoOWFpei0reeJqei9puaVsOmHj1xuICAgICAgICAgICAgY29uc3QgY2FydHMgPSBhd2FpdCBQcm9taXNlLmFsbCggaW5zZXJ0U3RhbmRhcnMubWFwKCB4ID0+IHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZGIuY29sbGVjdGlvbignY2FydCcpXG4gICAgICAgICAgICAgICAgICAgICAgICAud2hlcmUoe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBpZDogeC5faWRcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgICAgICAuY291bnQoICk7XG4gICAgICAgICAgICB9KSk7XG5cbiAgICAgICAgICAgIGNvbnN0IGluc2VydENhcnQgPSBpbnNlcnRTdGFuZGFycy5tYXAoKCB4LCBrICkgPT4gT2JqZWN0LmFzc2lnbih7IH0sIHgsIHtcbiAgICAgICAgICAgICAgICBjYXJ0czogY2FydHNbIGsgXS50b3RhbFxuICAgICAgICAgICAgfSkpO1xuXG4gICAgICAgICAgICByZXR1cm4gY3R4LmJvZHkgPSB7XG4gICAgICAgICAgICAgICAgc3RhdHVzOiAyMDAsXG4gICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgICBzZWFyY2g6IGV2ZW50LmRhdGEudGl0bGUucmVwbGFjZSgvXFxzKy9nLCAnJyksXG4gICAgICAgICAgICAgICAgICAgIHBhZ2VTaXplOiBsaW1pdCxcbiAgICAgICAgICAgICAgICAgICAgcGFnZTogZXZlbnQuZGF0YS5wYWdlLFxuICAgICAgICAgICAgICAgICAgICBkYXRhOiBpbnNlcnRDYXJ0LFxuICAgICAgICAgICAgICAgICAgICB0b3RhbDogdG90YWwkLnRvdGFsLFxuICAgICAgICAgICAgICAgICAgICB0b3RhbFBhZ2U6IE1hdGguY2VpbCggdG90YWwkLnRvdGFsIC8gbGltaXQgKVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgfSBjYXRjaCAoIGUgKSB7XG4gICAgICAgICAgICByZXR1cm4gY3R4LmJvZHkgPSB7XG4gICAgICAgICAgICAgICAgc3RhdHVzOiA1MDAsXG4gICAgICAgICAgICAgICAgbWVzc2FnZTogZVxuICAgICAgICAgICAgfVxuICAgICAgICB9IFxuICAgIH0pO1xuXG4gICAgYXBwLnJvdXRlcignZWRpdCcsIGFzeW5jKCBjdHgsIG5leHQgKSA9PiB7XG4gICAgICAgIHRyeSB7XG5cbiAgICAgICAgICAgIGxldCBfaWQgPSBldmVudC5kYXRhLl9pZDtcblxuICAgICAgICAgICAgLy8g5Yik5pat5piv5ZCm5pyJ5ZCM5ZCN5ZWG5ZOBXG4gICAgICAgICAgICBjb25zdCB7IHRpdGxlIH0gPSBldmVudC5kYXRhO1xuICAgICAgICAgICAgaWYgKCAhX2lkICkge1xuICAgICAgICAgICAgICAgIGNvbnN0IGNoZWNrMSQgPSBhd2FpdCBkYi5jb2xsZWN0aW9uKCdnb29kcycpXG4gICAgICAgICAgICAgICAgLndoZXJlKHtcbiAgICAgICAgICAgICAgICAgICAgdGl0bGUsXG4gICAgICAgICAgICAgICAgICAgIGlzRGVsZXRlOiBfLm5lcSggdHJ1ZSApXG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAuY291bnQoICk7XG5cbiAgICAgICAgICAgICAgICBpZiAoIGNoZWNrMSQudG90YWwgIT09IDAgKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBjdHguYm9keSA9IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0YXR1czogNTAwLFxuICAgICAgICAgICAgICAgICAgICAgICAgbWVzc2FnZTogJ+WtmOWcqOWQjOWQjeWVhuWTgSzor7fmo4Dmn6UnXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoICFfaWQgKSB7XG4gICAgICAgICAgICAgICAgLy8g5Yib5bu6XG4gICAgICAgICAgICAgICAgY29uc3QgeyBzdGFuZGFyZHMgfSA9IGV2ZW50LmRhdGE7XG4gICAgXG4gICAgICAgICAgICAgICAgZGVsZXRlIGV2ZW50LmRhdGFbJ3N0YW5kYXJkcyddO1xuICAgIFxuICAgICAgICAgICAgICAgIGNvbnN0IGNyZWF0ZSQgPSBhd2FpdCBkYi5jb2xsZWN0aW9uKCdnb29kcycpLmFkZCh7XG4gICAgICAgICAgICAgICAgICAgIGRhdGE6IE9iamVjdC5hc3NpZ24oeyB9LCBldmVudC5kYXRhLCB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpc0RlbGV0ZTogZmFsc2VcbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICBfaWQgPSBjcmVhdGUkLl9pZDtcbiAgICBcbiAgICAgICAgICAgICAgICAvLyDmj5LlhaXlnovlj7dcbiAgICAgICAgICAgICAgICBpZiAoICEhc3RhbmRhcmRzICYmIEFycmF5LmlzQXJyYXkoIHN0YW5kYXJkcyApKSB7XG4gICAgICAgICAgICAgICAgICAgIGF3YWl0IFByb21pc2UuYWxsKCBzdGFuZGFyZHMubWFwKCB4ID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBkYi5jb2xsZWN0aW9uKCdzdGFuZGFyZHMnKS5hZGQoe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGE6IE9iamVjdC5hc3NpZ24oeyB9LCB4LCB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBpZDogX2lkLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpc0RlbGV0ZTogZmFsc2VcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIH0pKVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgXG4gICAgICAgICAgICAgICAgLy8g5pu05pawXG4gICAgICAgICAgICAgICAgY29uc3QgbWV0YSA9IHsgLi4uZXZlbnQuZGF0YSB9O1xuICAgICAgICAgICAgICAgIGNvbnN0IHN0YW5kYXJkcyA9IG1ldGEuc3RhbmRhcmRzO1xuXG4gICAgICAgICAgICAgICAgZGVsZXRlIG1ldGEuX2lkO1xuICAgICAgICAgICAgICAgIGRlbGV0ZSBldmVudC5kYXRhLl9pZDtcbiAgICAgICAgICAgICAgICBkZWxldGUgZXZlbnQuZGF0YS5zdGFuZGFyZHM7XG5cbiAgICAgICAgICAgICAgICBhd2FpdCBkYi5jb2xsZWN0aW9uKCdnb29kcycpXG4gICAgICAgICAgICAgICAgICAgIC5kb2MoIF9pZCApXG4gICAgICAgICAgICAgICAgICAgIC5zZXQoe1xuICAgICAgICAgICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC4uLmV2ZW50LmRhdGFcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICBcbiAgICAgICAgICAgICAgICAvLyAwLiDmn6Xor6Lor6Xkuqflk4HlupXkuIvmiYDmnInnmoTlnovlj7dcbiAgICAgICAgICAgICAgICBjb25zdCBhbGxTdGFuZGFyZHMkID0gYXdhaXQgZGIuY29sbGVjdGlvbignc3RhbmRhcmRzJylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC53aGVyZSh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGlkOiBfaWRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAuZ2V0KCApO1xuICAgIFxuICAgICAgICAgICAgICAgIC8vIOmcgOimgeKAnOWIoOmZpOKAneeahOWei+WPt1xuICAgICAgICAgICAgICAgIGNvbnN0IHdvdWxkU2V0RGVsZXRlOiBhbnlbIF0gPSBbIF07XG4gICAgXG4gICAgICAgICAgICAgICAgLy8g6ZyA6KaB4oCc5pu05paw4oCd55qE5Z6L5Y+3XG4gICAgICAgICAgICAgICAgY29uc3Qgd291bGRVcGRhdGU6IGFueVsgXSA9IFsgXTtcbiAgICBcbiAgICAgICAgICAgICAgICAvLyDpnIDopoHigJzlop7liqDigJ3jgIHigJzmm7TmlrDigJ3nmoTlnovlj7dcbiAgICAgICAgICAgICAgICBjb25zdCB3b3VsZENyZWF0ZSA9IHN0YW5kYXJkcy5maWx0ZXIoIHggPT4gIXguX2lkICk7XG4gICAgXG4gICAgICAgICAgICAgICAgYWxsU3RhbmRhcmRzJC5kYXRhLmZpbHRlciggeCA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGlmICggIXN0YW5kYXJkcy5maW5kKCB5ID0+IHkuX2lkID09PSB4Ll9pZCApKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB3b3VsZFNldERlbGV0ZS5wdXNoKCB4IClcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHdvdWxkVXBkYXRlLnB1c2goIHggKVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgXG4gICAgICAgICAgICAgICAgLy8gMS4gIOKAnOWIoOmZpOKAnemDqOWIhuWei+WPt1xuICAgICAgICAgICAgICAgIGF3YWl0IFByb21pc2UuYWxsKCB3b3VsZFNldERlbGV0ZS5tYXAoIHggPT4ge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZGIuY29sbGVjdGlvbignc3RhbmRhcmRzJylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAuZG9jKCB4Ll9pZCApXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLnVwZGF0ZSh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlzRGVsZXRlOiB0cnVlXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIH0pKTtcbiAgICBcbiAgICAgICAgICAgICAgICAvLyAyLiDmm7TmlrDpg6jliIblnovlj7fkv6Hmga9cbiAgICAgICAgICAgICAgICBhd2FpdCBQcm9taXNlLmFsbCggd291bGRVcGRhdGUubWFwKCB4ID0+IHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgbmV3VGFyZ2V0ID0gc3RhbmRhcmRzLmZpbmQoIHkgPT4geS5faWQgPT09IHguX2lkICk7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHsgbmFtZSwgcHJpY2UsIGdyb3VwUHJpY2UsIHN0b2NrLCBpbWcgfSA9IG5ld1RhcmdldDtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGRiLmNvbGxlY3Rpb24oJ3N0YW5kYXJkcycpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLmRvYyggeC5faWQgKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC51cGRhdGUoe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuYW1lLCBwcmljZSwgZ3JvdXBQcmljZSwgc3RvY2ssIGltZ1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICB9KSk7XG4gICAgXG4gICAgICAgICAgICAgICAgLy8gMy4g5paw5aKe6YOo5YiG5Z6L5Y+3XG4gICAgICAgICAgICAgICAgYXdhaXQgUHJvbWlzZS5hbGwoIHdvdWxkQ3JlYXRlLm1hcCggeCA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBkYi5jb2xsZWN0aW9uKCdzdGFuZGFyZHMnKS5hZGQoe1xuICAgICAgICAgICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC4uLngsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcGlkOiBfaWQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaXNEZWxldGU6IGZhbHNlXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgfSkpO1xuICAgIFxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gY3R4LmJvZHkgPSB7XG4gICAgICAgICAgICAgICAgZGF0YTogX2lkLFxuICAgICAgICAgICAgICAgIHN0YXR1czogMjAwXG4gICAgICAgICAgICB9O1xuXG4gICAgICAgIH0gY2F0Y2ggKCBlICkge1xuICAgICAgICAgICAgcmV0dXJuIGN0eC5ib2R5ID0ge1xuICAgICAgICAgICAgICAgIHN0YXR1czogNTAwLFxuICAgICAgICAgICAgICAgIG1lc3NhZ2U6IGVcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0pXG5cbiAgICAvKipcbiAgICAgKiBAZGVzY3JpcHRpb25cbiAgICAgKiDmoLnmja7pooTku5jorqLljZXnmoTnm7jlhbPkv6Hmga/vvIzlh4/lsJHjgIHmm7TmlrDmjIflrprllYblk4HnmoTlupPlrZhcbiAgICAgKiAtLS0tLS0tLS0tIOivt+axgiAtLS0tLS0tLS0tLVxuICAgICAqIHtcbiAgICAgKiAgICAgIHNpZCxcbiAgICAgKiAgICAgIHBpZCxcbiAgICAgKiAgICAgIGNvdW50XG4gICAgICogfVxuICAgICAqL1xuICAgIGFwcC5yb3V0ZXIoJ3VwZGF0ZS1zdG9jaycsIGFzeW5jKCBjdHgsIG5leHQgKSA9PiB7XG4gICAgICAgIHRyeSB7XG5cbiAgICAgICAgICAgIGNvbnN0IHsgc2lkLCBwaWQsIGNvdW50IH0gPSBldmVudC5kYXRhO1xuXG4gICAgICAgICAgICBsZXQgdGFyZ2V0OiBhbnkgPSBudWxsO1xuICAgICAgICAgICAgY29uc3QgdGFyZ2V0SWQgPSBzaWQgfHwgcGlkO1xuICAgICAgICAgICAgY29uc3QgY29sbGVjdGlvbk5hbWUgPSAhIXNpZCA/ICdzdGFuZGFyZHMnIDogJ2dvb2RzJztcblxuICAgICAgICAgICAgY29uc3QgZmluZCQgPSBhd2FpdCBkYi5jb2xsZWN0aW9uKCBjb2xsZWN0aW9uTmFtZSApXG4gICAgICAgICAgICAgICAgLndoZXJlKHtcbiAgICAgICAgICAgICAgICAgICAgX2lkOiB0YXJnZXRJZFxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLmdldCggKTtcblxuICAgICAgICAgICAgaWYgKCBmaW5kJC5kYXRhLmxlbmd0aCA9PT0gMCApIHtcbiAgICAgICAgICAgICAgICB0aHJvdyAhIXNpZCA/ICfmm7TmlrDlupPlrZjlvILluLgsIOW9k+WJjeWei+WPt+S4jeWtmOWcqCcgOiAn5pu05paw5bqT5a2Y5byC5bi4LCDlvZPliY3llYblk4HkuI3lrZjlnKgnXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRhcmdldCA9IGZpbmQkLmRhdGFbIDAgXTtcblxuICAgICAgICAgICAgLy8g5peg6ZmQ5bqT5a2YXG4gICAgICAgICAgICBpZiAoIHRhcmdldC5zdG9jayA9PT0gbnVsbCB8fCB0YXJnZXQuc3RvY2sgPT09IHVuZGVmaW5lZCApIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gY3R4LmJvZHkgPSB7XG4gICAgICAgICAgICAgICAgICAgIHN0YXR1czogMjAwXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyDliKTmlq3lupPlrZjmmK/lkKbotrPlpJ9cbiAgICAgICAgICAgIGlmICggdGFyZ2V0LnN0b2NrIC0gY291bnQgPCAwICkge1xuICAgICAgICAgICAgICAgIHRocm93ICEhc2lkID8gJ+abtOaWsOW6k+WtmOW8guW4uCwg5b2T5YmN5Z6L5Y+35bqT5a2Y5LiN6LazJyA6ICfmm7TmlrDlupPlrZjlvILluLgsIOW9k+WJjeWVhuWTgeW6k+WtmOS4jei2syc7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIOabtOaWsFxuICAgICAgICAgICAgYXdhaXQgZGIuY29sbGVjdGlvbiggY29sbGVjdGlvbk5hbWUgKS5kb2MoIHRhcmdldElkIClcbiAgICAgICAgICAgICAgICAudXBkYXRlKHtcbiAgICAgICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgICAgICAgc3RvY2s6IF8uaW5jKCAtY291bnQgKVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSlcblxuICAgICAgICAgICAgcmV0dXJuIGN0eC5ib2R5ID0ge1xuICAgICAgICAgICAgICAgIHN0YXR1czogMjAwXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfSBjYXRjaCAoIGUgKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhgLS0tLeOAkEVycm9yLUdvb2TjgJEtLS0t77yaJHtKU09OLnN0cmluZ2lmeSggZSApfWApO1xuICAgICAgICAgICAgcmV0dXJuIGN0eC5ib2R5ID0geyBzdGF0dXM6IDUwMCwgbWVzc2FnZTogZSB9O1xuICAgICAgICB9XG4gICAgfSlcblxuICAgIC8qKlxuICAgICAqIEBkZXNjcmlwdGlvblxuICAgICAqIOWuouaIt+err+aQnOe0ouWVhuWTgeWIl+ihqO+8iCDliIbnsbvmkJzmkJzjgIHmiJbmloflrZfmkJzmkJwg77yJXG4gICAgICogISBzZWFyY2gg5LiN5Lya5piv56m65a2X56ym5LiyXG4gICAgICoge1xuICAgICAqICAgIHNlYXJjaCxcbiAgICAgKiAgICBwYWdlLFxuICAgICAqICAgIGNhdGVnb3J5XG4gICAgICogfVxuICAgICAqL1xuICAgIGFwcC5yb3V0ZXIoJ2NsaWVudC1zZWFyY2gnLCBhc3luYyggY3R4LCBuZXh0ICkgPT4ge1xuICAgICAgICB0cnkge1xuXG4gICAgICAgICAgICAvLyDmn6Xor6LmnaHmlbBcbiAgICAgICAgICAgIGNvbnN0IGxpbWl0ID0gMTA7XG4gICAgICAgICAgICBsZXQgYmpwQ29uZmlnOiBhbnkgPSBudWxsO1xuICAgICAgICAgICAgY29uc3Qgb3BlbmlkID0gZXZlbnQudXNlckluZm8ub3BlbklkO1xuICAgICAgICAgICAgY29uc3QgeyBzZWFyY2gsIHBhZ2UsIGNhdGVnb3J5IH0gPSBldmVudC5kYXRhO1xuXG4gICAgICAgICAgICBsZXQgcXVlcnk6IGFueSA9IG51bGw7XG5cblxuICAgICAgICAgICAgaWYgKCAhIWNhdGVnb3J5ICkge1xuICAgICAgICAgICAgICAgIHF1ZXJ5ID0gXy5vcihbXG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhdGVnb3J5LFxuICAgICAgICAgICAgICAgICAgICAgICAgdmlzaWFibGU6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgICAgICBpc0RlbGV0ZTogXy5uZXEoIHRydWUgKVxuICAgICAgICAgICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjYXRlZ29yeSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHZpc2lhYmxlOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICAgICAgaXNEZWxldGU6IF8ubmVxKCB0cnVlIClcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIF0pO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyDkv53lgaXlk4HphY3nva5cbiAgICAgICAgICAgIGNvbnN0IGJqcENvbmZpZyQgPSBhd2FpdCBkYi5jb2xsZWN0aW9uKCdhcHAtY29uZmlnJylcbiAgICAgICAgICAgICAgICAgICAgLndoZXJlKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6ICdhcHAtYmpwLXZpc2libGUnXG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgIC5nZXQoICk7XG4gICAgICAgICAgICBianBDb25maWcgPSBianBDb25maWckLmRhdGFbIDAgXTtcblxuICAgICAgICAgICAgLy8g5pCc57Si5Lmf6KaB5bGP6JS95L+d5YGl5ZOBXG4gICAgICAgICAgICAvLyDpnZ7nrqHnkIbkurrlkZjmiY3lsY/olL1cbiAgICAgICAgICAgIGlmICggISFzZWFyY2ggKSB7XG5cbiAgICAgICAgICAgICAgICBjb25zdCBhZG1pbkNoZWNrID0gYXdhaXQgZGIuY29sbGVjdGlvbignbWFuYWdlci1tZW1iZXInKVxuICAgICAgICAgICAgICAgICAgICAud2hlcmUoe1xuICAgICAgICAgICAgICAgICAgICAgICAgb3BlbmlkXG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgIC5jb3VudCggKTtcblxuICAgICAgICAgICAgICAgIGxldCBjYXRlZ29yeUZpbHRlciA9IF8ubmVxKCc5OTk5Jyk7XG5cbiAgICAgICAgICAgICAgICBpZiAoICEhYmpwQ29uZmlnICYmICFianBDb25maWcudmFsdWUgJiYgYWRtaW5DaGVjay50b3RhbCA9PT0gMCApIHtcbiAgICAgICAgICAgICAgICAgICAgY2F0ZWdvcnlGaWx0ZXIgPSBfLm5lcSgnNCcpXG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgICAgICog5pCc57Si57qs5bqm77yaXG4gICAgICAgICAgICAgICAgICog5ZWG5ZOB5qCH6aKYXG4gICAgICAgICAgICAgICAgICog6K+m5oOFXG4gICAgICAgICAgICAgICAgICohIOagh+etvu+8iOacquWunueOsO+8iVxuICAgICAgICAgICAgICAgICovXG4gICAgICAgICAgICAgICAgcXVlcnkgPSBfLm9yKFtcbiAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmlzaWFibGU6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgICAgICBpc0RlbGV0ZTogXy5uZXEoIHRydWUgKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhdGVnb3J5OiBjYXRlZ29yeUZpbHRlcixcbiAgICAgICAgICAgICAgICAgICAgICAgIHRpdGxlOiBuZXcgUmVnRXhwKCBzZWFyY2gucmVwbGFjZSggL1xccysvZywgJycgKSwgJ2knIClcbiAgICAgICAgICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmlzaWFibGU6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgICAgICBpc0RlbGV0ZTogXy5uZXEoIHRydWUgKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhdGVnb3J5OiBjYXRlZ29yeUZpbHRlcixcbiAgICAgICAgICAgICAgICAgICAgICAgIGRldGFpbDogbmV3IFJlZ0V4cCggc2VhcmNoLnJlcGxhY2UoIC9cXHMrL2csICcnICksICdpJyApXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBdKTtcblxuICAgICAgICAgICAgfVxuXG5cbiAgICAgICAgICAgIC8vIOiOt+WPluaAu+aVsFxuICAgICAgICAgICAgY29uc3QgdG90YWwkID0gYXdhaXQgZGIuY29sbGVjdGlvbignZ29vZHMnKVxuICAgICAgICAgICAgICAgIC53aGVyZSggcXVlcnkgKVxuICAgICAgICAgICAgICAgIC5jb3VudCggKTtcblxuICAgICAgICAgICAgLy8g6I635Y+W5pWw5o2uXG4gICAgICAgICAgICBjb25zdCBkYXRhJCA9IGF3YWl0IGRiLmNvbGxlY3Rpb24oJ2dvb2RzJylcbiAgICAgICAgICAgICAgICAud2hlcmUoIHF1ZXJ5IClcbiAgICAgICAgICAgICAgICAubGltaXQoIGxpbWl0IClcbiAgICAgICAgICAgICAgICAuc2tpcCgoIHBhZ2UgLSAxICkgKiBsaW1pdCApXG4gICAgICAgICAgICAgICAgLm9yZGVyQnkoJ3NhbGVkJywgJ2Rlc2MnKVxuICAgICAgICAgICAgICAgIC5nZXQoICk7XG5cbiAgICAgICAgICAgIC8vIOaLvOaOpeWei+WPt+WSjOWVhuWTgea0u+WKqFxuICAgICAgICAgICAgY29uc3QgYWN0aXZpdGllcyQgPSBhd2FpdCBQcm9taXNlLmFsbCggZGF0YSQuZGF0YS5tYXAoIGdvb2QgPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiBkYi5jb2xsZWN0aW9uKCdhY3Rpdml0eScpXG4gICAgICAgICAgICAgICAgICAgIC53aGVyZSh7XG4gICAgICAgICAgICAgICAgICAgICAgICBwaWQ6IGdvb2QuX2lkLFxuICAgICAgICAgICAgICAgICAgICAgICAgaXNDbG9zZWQ6IGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICAgICAgaXNEZWxldGVkOiBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6ICdnb29kX2Rpc2NvdW50JyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGVuZFRpbWU6IF8uZ3QoIGdldE5vdyggdHJ1ZSApKVxuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAuZmllbGQoe1xuICAgICAgICAgICAgICAgICAgICAgICAgcGlkOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICAgICAgc2lkOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICAgICAgdGl0bGU6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgICAgICBhY19wcmljZTogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGVuZFRpbWU6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgICAgICBhY19ncm91cFByaWNlOiB0cnVlXG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgIC5nZXQoICk7XG4gICAgICAgICAgICB9KSk7XG5cbiAgICAgICAgICAgIGNvbnN0IHN0YW5kYXJkcyQgPSBhd2FpdCBQcm9taXNlLmFsbCggZGF0YSQuZGF0YS5tYXAoIGdvb2QgPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiBkYi5jb2xsZWN0aW9uKCdzdGFuZGFyZHMnKVxuICAgICAgICAgICAgICAgICAgICAud2hlcmUoe1xuICAgICAgICAgICAgICAgICAgICAgICAgcGlkOiBnb29kLl9pZCxcbiAgICAgICAgICAgICAgICAgICAgICAgIGlzRGVsZXRlOiBmYWxzZVxuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAuZ2V0KCApO1xuICAgICAgICAgICAgfSkpO1xuXG4gICAgICAgICAgICBjb25zdCBpbnNlcnRBY3Rpdml0aWVzID0gZGF0YSQuZGF0YS5tYXAoKCBtZXRhLCBrICkgPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiBPYmplY3QuYXNzaWduKHsgfSwgbWV0YSwge1xuICAgICAgICAgICAgICAgICAgICBzdGFuZGFyZHM6IHN0YW5kYXJkcyRbIGsgXS5kYXRhLCBcbiAgICAgICAgICAgICAgICAgICAgYWN0aXZpdHk6IGFjdGl2aXRpZXMkWyBrIF0uZGF0YS5sZW5ndGggPT09IDAgPyBudWxsIDogYWN0aXZpdGllcyRbIGsgXS5kYXRhWyAwIF1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0pXG5cbiAgICAgICAgICAgIHJldHVybiBjdHguYm9keSA9IHtcbiAgICAgICAgICAgICAgICBzdGF0dXM6IDIwMCxcbiAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICAgIHBhZ2UsXG4gICAgICAgICAgICAgICAgICAgIHBhZ2VTaXplOiBsaW1pdCxcbiAgICAgICAgICAgICAgICAgICAgZGF0YTogaW5zZXJ0QWN0aXZpdGllcyxcbiAgICAgICAgICAgICAgICAgICAgdG90YWw6IHRvdGFsJC50b3RhbCxcbiAgICAgICAgICAgICAgICAgICAgdG90YWxQYWdlOiBNYXRoLmNlaWwoIHRvdGFsJC50b3RhbCAvIGxpbWl0ICksXG4gICAgICAgICAgICAgICAgICAgIHNlYXJjaDogISFzZWFyY2ggPyBzZWFyY2gucmVwbGFjZSggL1xccysvZywgJycgKSA6IHVuZGVmaW5lZFxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgfSBjYXRjaCAoIGUgKSB7XG4gICAgICAgICAgICByZXR1cm4gY3R4LmJvZHkgPSB7IHN0YXR1czogNTAwIH07XG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgIC8qKlxuICAgICAqIEBkZXNjcmlwdGlvblxuICAgICAqIOeuoeeQhuerryDkuIrkuIvmnrbllYblk4FcbiAgICAgKiB7XG4gICAgICogICAgcGlkLFxuICAgICAqICAgIHZpc2lhYmxlXG4gICAgICogfVxuICAgICAqL1xuICAgIGFwcC5yb3V0ZXIoJ3NldC12aXNpYWJsZScsIGFzeW5jKCBjdHgsIG5leHQgKSA9PiB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBjb25zdCB7IHBpZCwgdmlzaWFibGUgfSA9IGV2ZW50LmRhdGE7XG4gICAgICAgICAgICBhd2FpdCBkYi5jb2xsZWN0aW9uKCdnb29kcycpXG4gICAgICAgICAgICAgICAgLmRvYyggcGlkIClcbiAgICAgICAgICAgICAgICAudXBkYXRlKHtcbiAgICAgICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmlzaWFibGUsXG4gICAgICAgICAgICAgICAgICAgICAgICB1cGRhdGVUaW1lOiBnZXROb3coIHRydWUgKVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHJldHVybiBjdHguYm9keSA9IHsgc3RhdHVzOiAyMDAgfTtcbiAgICAgICAgICAgIFxuICAgICAgICB9IGNhdGNoICggZSApIHtcbiAgICAgICAgICAgIHJldHVybiBjdHguYm9keSA9IHsgc3RhdHVzOiA1MDAgfTtcbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgLyoqXG4gICAgICogQGRlc2NyaXB0aW9uXG4gICAgICog5Yig6Zmk5ZWG5ZOBXG4gICAgICoge1xuICAgICAqICAgIHBpZCBcbiAgICAgKiB9XG4gICAgICovXG4gICAgYXBwLnJvdXRlcignZGVsZXRlJywgYXN5bmMoIGN0eCwgbmV4dCApID0+IHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGNvbnN0IHsgcGlkIH0gPSBldmVudC5kYXRhO1xuICAgICAgICAgICAgYXdhaXQgZGIuY29sbGVjdGlvbignZ29vZHMnKVxuICAgICAgICAgICAgICAgIC5kb2MoIFN0cmluZyggcGlkICkpXG4gICAgICAgICAgICAgICAgLnVwZGF0ZSh7XG4gICAgICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlzRGVsZXRlOiB0cnVlXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHJldHVybiBjdHguYm9keSA9IHtcbiAgICAgICAgICAgICAgICBkYXRhOiBwaWQsXG4gICAgICAgICAgICAgICAgc3RhdHVzOiAyMDBcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgfSBjYXRjaCAoIGUgKSB7XG4gICAgICAgICAgICByZXR1cm4gY3R4LmJvZHkgPSB7IHN0YXR1czogNTAwIH07XG4gICAgICAgIH1cbiAgICB9KVxuXG4gICAgLyoqXG4gICAgICogQGRlc2NyaXB0aW9uXG4gICAgICog5o6o5bm/56ev5YiG5ZWG5ZOB55qE5o6S6KGM5qacXG4gICAgICoge1xuICAgICAqICAgICAgcGFnZVxuICAgICAqIH1cbiAgICAgKi9cbiAgICBhcHAucm91dGVyKCdwdXNoLWludGVncmFsLXJhbmsnLCBhc3luYyggY3R4LCBuZXh0ICkgPT4ge1xuICAgICAgICB0cnkge1xuXG4gICAgICAgICAgICAvLyDmn6Xor6LmnaHmlbBcbiAgICAgICAgICAgIGNvbnN0IHsgcGFnZSB9ID0gZXZlbnQuZGF0YTtcbiAgICAgICAgICAgIGNvbnN0IGxpbWl0ID0gZXZlbnQuZGF0YS5saW1pdCB8fCAyMDtcblxuICAgICAgICAgICAgY29uc3Qgd2hlcmUkID0ge1xuICAgICAgICAgICAgICAgIGlzRGVsZXRlOiBfLm5lcSggdHJ1ZSApLFxuICAgICAgICAgICAgICAgIGNhdGVnb3J5OiBfLm9yKCBfLmVxKCcwJyksIF8uZXEoJzEnKSlcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIGNvbnN0IHRvdGFsJCA9IGF3YWl0IGRiLmNvbGxlY3Rpb24oJ2dvb2RzJylcbiAgICAgICAgICAgICAgICAud2hlcmUoIHdoZXJlJCApXG4gICAgICAgICAgICAgICAgLmNvdW50KCApO1xuXG4gICAgICAgICAgICBjb25zdCBkYXRhJCA9IGF3YWl0IGRiLmNvbGxlY3Rpb24oJ2dvb2RzJylcbiAgICAgICAgICAgICAgICAud2hlcmUoIHdoZXJlJCApXG4gICAgICAgICAgICAgICAgLmxpbWl0KCBsaW1pdCApXG4gICAgICAgICAgICAgICAgLnNraXAoKCBwYWdlIC0gMSApICogbGltaXQgKVxuICAgICAgICAgICAgICAgIC5vcmRlckJ5KCAnc2FsZWQnLCAnZGVzYycpXG4gICAgICAgICAgICAgICAgLm9yZGVyQnkoICdmYWRlUHJpY2UnLCAnZGVzYycpXG4gICAgICAgICAgICAgICAgLmdldCggKTtcblxuICAgICAgICAgICAgICAgIC8vIOiOt+WPluWei+WPt+aVsOaNrlxuICAgICAgICAgICAgY29uc3Qgc3RhbmRhcmRzID0gYXdhaXQgUHJvbWlzZS5hbGwoIGRhdGEkLmRhdGEubWFwKCB4ID0+IHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZGIuY29sbGVjdGlvbignc3RhbmRhcmRzJylcbiAgICAgICAgICAgICAgICAgICAgLndoZXJlKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHBpZDogeC5faWQsXG4gICAgICAgICAgICAgICAgICAgICAgICBpc0RlbGV0ZTogZmFsc2VcbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgLmdldCggKTtcbiAgICAgICAgICAgIH0pKTtcblxuICAgICAgICAgICAgY29uc3QgaW5zZXJ0U3RhbmRhcnMgPSBkYXRhJC5kYXRhLm1hcCgoIHgsIGsgKSA9PiBPYmplY3QuYXNzaWduKHsgfSwgeCwge1xuICAgICAgICAgICAgICAgIHN0YW5kYXJkczogc3RhbmRhcmRzWyBrIF0uZGF0YVxuICAgICAgICAgICAgfSkpO1xuXG4gICAgICAgICAgICAvLyDojrflj5bmtLvliqjmlbDmja7mlbDmja5cbiAgICAgICAgICAgIGNvbnN0IGFjdGl2aXRpZXMkID0gYXdhaXQgUHJvbWlzZS5hbGwoXG4gICAgICAgICAgICAgICAgZGF0YSQuZGF0YS5tYXAoIGdvb2QgPT4ge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZGIuY29sbGVjdGlvbignYWN0aXZpdHknKVxuICAgICAgICAgICAgICAgICAgICAgICAgLndoZXJlKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwaWQ6IGdvb2QuX2lkLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlzQ2xvc2VkOiBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpc0RlbGV0ZWQ6IGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6ICdnb29kX2Rpc2NvdW50JyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbmRUaW1lOiBfLmd0KCBnZXROb3coIHRydWUgKSlcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgICAgICAuZ2V0KCApXG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICk7XG5cbiAgICAgICAgICAgIGNvbnN0IGluc2VydEFjdGl2aXR5ID0gaW5zZXJ0U3RhbmRhcnMubWFwKCggeCwgayApID0+IE9iamVjdC5hc3NpZ24oeyB9LCB4LCB7XG4gICAgICAgICAgICAgICAgYWN0aXZpdGllczogYWN0aXZpdGllcyRbIGsgXS5kYXRhXG4gICAgICAgICAgICB9KSk7XG5cbiAgICAgICAgICAgIHJldHVybiBjdHguYm9keSA9IHtcbiAgICAgICAgICAgICAgICBzdGF0dXM6IDIwMCxcbiAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICAgIGRhdGE6IGluc2VydEFjdGl2aXR5LFxuICAgICAgICAgICAgICAgICAgICBwYWdlbmF0aW9uOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBwYWdlLFxuICAgICAgICAgICAgICAgICAgICAgICAgcGFnZVNpemU6IGxpbWl0LFxuICAgICAgICAgICAgICAgICAgICAgICAgdG90YWw6IHRvdGFsJC50b3RhbCxcbiAgICAgICAgICAgICAgICAgICAgICAgIHRvdGFsUGFnZTogTWF0aC5jZWlsKCB0b3RhbCQudG90YWwgLyBsaW1pdCApXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgIH0gY2F0Y2ggKCBlICkge1xuICAgICAgICAgICAgcmV0dXJuIGN0eC5ib2R5ID0ge1xuICAgICAgICAgICAgICAgIHN0YXR1czogNTAwXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9KVxuXG4gICAgLyoqXG4gICAgICogQGRlc2NyaXB0aW9uXG4gICAgICog5pu05paw5b2T5YmN55So5oi355qE5ZWG5ZOB5rWP6KeI5Y6G5Y+yXG4gICAgICogXG4gICAgICogQGJvZHkge29wZW5pZH1cbiAgICAgKiBAYm9keSB7cGlkfSDllYblk4FJRFxuICAgICAqL1xuICAgIGFwcC5yb3V0ZXIoJ3VwZGF0ZS1nb29kLXZpc2l0LXJlY29yZCcsIGFzeW5jKCBjdHgsIG5leHQgKSA9PiB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBjb25zdCB7IHBpZCB9ID0gZXZlbnQuZGF0YTtcbiAgICAgICAgICAgIGNvbnN0IG9wZW5pZCA9IGV2ZW50LmRhdGEub3BlbklkIHx8IGV2ZW50LmRhdGEub3BlbmlkIHx8IGV2ZW50LnVzZXJJbmZvLm9wZW5JZDtcblxuICAgICAgICAgICAgLy8g5p+l5om+5pen55qE6K6w5b2VXG4gICAgICAgICAgICBjb25zdCByZWNvcmQkID0gYXdhaXQgZGIuY29sbGVjdGlvbignZ29vZC12aXNpdGluZy1yZWNvcmQnKVxuICAgICAgICAgICAgICAgIC53aGVyZSh7XG4gICAgICAgICAgICAgICAgICAgIHBpZCxcbiAgICAgICAgICAgICAgICAgICAgb3BlbmlkXG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAuZ2V0KCApO1xuICAgICAgICAgICAgY29uc3QgcmVjb3JkID0gcmVjb3JkJC5kYXRhWyAwIF07XG5cbiAgICAgICAgICAgIC8vIOacieWImeabtOaWsFxuICAgICAgICAgICAgaWYgKCAhIXJlY29yZCApIHtcbiAgICAgICAgICAgICAgICBhd2FpdCBkYi5jb2xsZWN0aW9uKCdnb29kLXZpc2l0aW5nLXJlY29yZCcpXG4gICAgICAgICAgICAgICAgICAgIC5kb2MoIFN0cmluZyggcmVjb3JkLl9pZCApKVxuICAgICAgICAgICAgICAgICAgICAudXBkYXRlKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2aXNpdFRpbWU6IGdldE5vdyggdHJ1ZSApXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAvLyDml6DliJnmj5LlhaVcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgYXdhaXQgZGIuY29sbGVjdGlvbignZ29vZC12aXNpdGluZy1yZWNvcmQnKVxuICAgICAgICAgICAgICAgICAgICAuYWRkKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwaWQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb3BlbmlkLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZpc2l0VGltZTogZ2V0Tm93KCB0cnVlIClcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBjdHguYm9keSA9IHtcbiAgICAgICAgICAgICAgICBzdGF0dXM6IDIwMFxuICAgICAgICAgICAgfVxuICAgICAgICB9IGNhdGNoKCBlICkge1xuICAgICAgICAgICAgcmV0dXJuIGN0eC5ib2R5ID0ge1xuICAgICAgICAgICAgICAgIHN0YXR1czogNTAwXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9KVxuXG4gICAgLyoqIFxuICAgICAqIEBkZXNjcmlwdGlvblxuICAgICAqIOiOt+WPluWVhuWTgea1j+iniOiusOW9le+8iOeUqOaIt+WIl+ihqCArIOWktOWDj++8iVxuICAgICAqIFxuICAgICAqIHtzdGFydH0g5pe26Ze05oiz77yM5Zyo5q2k5LmL5ZCO55qE6K6/6Zeu6K6w5b2VXG4gICAgICoge2JlZm9yZX0g5pe26Ze05oiz77yM5Zyo5q2k5LmL5YmN55qE6K6/6Zeu6K6w5b2VXG4gICAgICoge3BpZH0g5ZWG5ZOBaWRcbiAgICAgKiBcbiAgICAgKi9cbiAgICBhcHAucm91dGVyKCdnb29kLXZpc2l0b3JzJywgYXN5bmMoIGN0eCwgbmV4dCApID0+IHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGNvbnN0IHsgcGlkLCBiZWZvcmUsIHN0YXJ0IH0gPSBldmVudC5kYXRhO1xuICAgICAgICAgICAgbGV0IHNlYXJjaDogYW55ID0geyBwaWQgfTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgaWYgKCAhIXN0YXJ0ICYmICEhYmVmb3JlICkge1xuICAgICAgICAgICAgICAgIHNlYXJjaCA9IHtcbiAgICAgICAgICAgICAgICAgICAgLi4uc2VhcmNoLFxuICAgICAgICAgICAgICAgICAgICB2aXNpdFRpbWU6IF8uYW5kKCBfLmd0ZSggc3RhcnQgKSwgXy5sdCggYmVmb3JlICkpXG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoICEhc3RhcnQgJiYgIWJlZm9yZSApIHtcbiAgICAgICAgICAgICAgICBzZWFyY2ggPSB7XG4gICAgICAgICAgICAgICAgICAgIC4uLnNlYXJjaCxcbiAgICAgICAgICAgICAgICAgICAgdmlzaXRUaW1lOiBfLmd0ZSggc3RhcnQgKVxuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9IGVsc2UgaWYgKCAhc3RhcnQgJiYgISFiZWZvcmUgKSB7XG4gICAgICAgICAgICAgICAgc2VhcmNoID0ge1xuICAgICAgICAgICAgICAgICAgICAuLi5zZWFyY2gsXG4gICAgICAgICAgICAgICAgICAgIHZpc2l0VGltZTogXy5sdCggYmVmb3JlIClcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgXG4gICAgICAgICAgICBjb25zdCB2aXNpdG9ycyQgPSBhd2FpdCBkYi5jb2xsZWN0aW9uKCdnb29kLXZpc2l0aW5nLXJlY29yZCcpXG4gICAgICAgICAgICAgICAgLndoZXJlKCBzZWFyY2ggKVxuICAgICAgICAgICAgICAgIC5nZXQoICk7XG4gICAgXG4gICAgICAgICAgICBjb25zdCB2aXNpdG9ycyA9IHZpc2l0b3JzJC5kYXRhO1xuICAgIFxuICAgICAgICAgICAgY29uc3QgdXNlcnMkID0gYXdhaXQgUHJvbWlzZS5hbGwoIHZpc2l0b3JzLm1hcCggYXN5bmMgdmlzaXRvciA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3QgdXNlciQgPSBhd2FpdCBkYi5jb2xsZWN0aW9uKCd1c2VyJylcbiAgICAgICAgICAgICAgICAgICAgLndoZXJlKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG9wZW5pZDogdmlzaXRvci5vcGVuaWRcbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgLmZpZWxkKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG9wZW5pZDogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIG5pY2tOYW1lOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICAgICAgYXZhdGFyVXJsOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAuZ2V0KCApO1xuICAgICAgICAgICAgICAgIGNvbnN0IHVzZXIgPSB1c2VyJC5kYXRhWyAwIF07XG4gICAgICAgICAgICAgICAgcmV0dXJuICEhdXNlciA/IHVzZXIgOiBudWxsO1xuICAgICAgICAgICAgfSkpO1xuICAgIFxuICAgICAgICAgICAgY29uc3QgdXNlcnMgPSB1c2VycyQuZmlsdGVyKCB4ID0+ICEheCApO1xuICAgICAgICAgICAgcmV0dXJuIGN0eC5ib2R5ID0ge1xuICAgICAgICAgICAgICAgIHN0YXR1czogMjAwLFxuICAgICAgICAgICAgICAgIGRhdGE6IHVzZXJzXG4gICAgICAgICAgICB9O1xuICAgICAgICB9IGNhdGNoKCBlICkge1xuICAgICAgICAgICAgcmV0dXJuIGN0eC5ib2R5ID0ge1xuICAgICAgICAgICAgICAgIHN0YXR1czogNTAwXG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgfSk7XG5cblxuICAgIHJldHVybiBhcHAuc2VydmUoICk7XG5cbn07Il19