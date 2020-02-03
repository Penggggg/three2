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
        app.router('detail', function (ctx, next) { return __awaiter(void 0, void 0, void 0, function () {
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
        app.router('rank', function (ctx, next) { return __awaiter(void 0, void 0, void 0, function () {
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
        app.router('pin-ground', function (ctx, next) { return __awaiter(void 0, void 0, void 0, function () {
            var _a, page, visitTime_1, limit, filterGoodIds, search$, search, where$, bjpConfig$, bjpConfig, total$, data$, standards_3, insertStandars, activities$_3, insertActivity, visitRecord_1, insertVisitRecord, e_3;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 8, , 9]);
                        _a = event.data, page = _a.page, visitTime_1 = _a.visitTime;
                        limit = event.data.limit || 10;
                        filterGoodIds = event.data.filterGoodIds || [];
                        search$ = event.data.search || '';
                        search = new RegExp(search$.replace(/\s+/g, ""), 'i');
                        where$ = {
                            title: search,
                            visiable: true,
                            isDelete: _.neq(true)
                        };
                        if (filterGoodIds.length > 0) {
                            where$ = __assign(__assign({}, where$), { _id: _.nor(filterGoodIds.map(function (x) { return _.eq(x); })) });
                        }
                        return [4, db.collection('app-config')
                                .where({
                                type: 'app-bjp-visible'
                            })
                                .get()];
                    case 1:
                        bjpConfig$ = _b.sent();
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
                        total$ = _b.sent();
                        return [4, db.collection('goods')
                                .where(where$)
                                .limit(limit)
                                .skip((page - 1) * limit)
                                .orderBy('saled', 'desc')
                                .get()];
                    case 3:
                        data$ = _b.sent();
                        return [4, Promise.all(data$.data.map(function (x) {
                                return db.collection('standards')
                                    .where({
                                    pid: x._id,
                                    isDelete: false,
                                })
                                    .get();
                            }))];
                    case 4:
                        standards_3 = _b.sent();
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
                        activities$_3 = _b.sent();
                        insertActivity = insertStandars.map(function (x, k) { return Object.assign({}, x, {
                            activities: activities$_3[k].data
                        }); });
                        visitRecord_1 = [];
                        if (!!!visitTime_1) return [3, 7];
                        return [4, Promise.all(insertActivity.map(function (x, k) { return __awaiter(void 0, void 0, void 0, function () {
                                var pid, where$, goodVisitTotal$, goodVisitRecord$, users;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            pid = x._id;
                                            where$ = {
                                                pid: pid,
                                                visitTime: _.gte(visitTime_1)
                                            };
                                            return [4, db.collection('good-visiting-record')
                                                    .where(where$)
                                                    .count()];
                                        case 1:
                                            goodVisitTotal$ = _a.sent();
                                            return [4, db.collection('good-visiting-record')
                                                    .where(where$)
                                                    .orderBy('visitTime', 'desc')
                                                    .limit(5)
                                                    .get()];
                                        case 2:
                                            goodVisitRecord$ = _a.sent();
                                            return [4, Promise.all(goodVisitRecord$.data.map(function (record) { return __awaiter(void 0, void 0, void 0, function () {
                                                    var openid, user$;
                                                    return __generator(this, function (_a) {
                                                        switch (_a.label) {
                                                            case 0:
                                                                openid = record.openid;
                                                                return [4, db.collection('user')
                                                                        .where({
                                                                        openid: openid
                                                                    })
                                                                        .field({
                                                                        avatarUrl: true,
                                                                        nickName: true
                                                                    })
                                                                        .get()];
                                                            case 1:
                                                                user$ = _a.sent();
                                                                return [2, user$.data[0]];
                                                        }
                                                    });
                                                }); }))];
                                        case 3:
                                            users = _a.sent();
                                            return [2, {
                                                    visitorSum: goodVisitTotal$.total,
                                                    avatars: users
                                                }];
                                    }
                                });
                            }); }))];
                    case 6:
                        visitRecord_1 = _b.sent();
                        _b.label = 7;
                    case 7:
                        insertVisitRecord = insertActivity.map(function (x, k) { return (__assign(__assign({}, x), { visitRecord: visitRecord_1[k] })); });
                        return [2, ctx.body = {
                                status: 200,
                                data: {
                                    data: insertVisitRecord,
                                    pagenation: {
                                        page: page,
                                        pageSize: limit,
                                        total: total$.total,
                                        totalPage: Math.ceil(total$.total / limit)
                                    }
                                }
                            }];
                    case 8:
                        e_3 = _b.sent();
                        console.log('???', e_3);
                        return [2, ctx.body = { status: 500 }];
                    case 9: return [2];
                }
            });
        }); });
        app.router('list', function (ctx, next) { return __awaiter(void 0, void 0, void 0, function () {
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
        app.router('edit', function (ctx, next) { return __awaiter(void 0, void 0, void 0, function () {
            var _id_1, title, check1$, standards, create$, meta, standards_5, allStandards$, wouldSetDelete_1, wouldUpdate_1, wouldCreate, e_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 14, , 15]);
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
                                    data: __assign(__assign({}, x), { pid: _id_1, isDelete: false })
                                });
                            }))];
                    case 11:
                        _a.sent();
                        _a.label = 12;
                    case 12: return [4, cloud.callFunction({
                            data: {
                                data: {
                                    pid: _id_1,
                                },
                                $url: 'create-recommand'
                            },
                            name: 'trip'
                        })];
                    case 13:
                        _a.sent();
                        return [2, ctx.body = {
                                data: _id_1,
                                status: 200
                            }];
                    case 14:
                        e_5 = _a.sent();
                        return [2, ctx.body = {
                                status: 500,
                                message: e_5
                            }];
                    case 15: return [2];
                }
            });
        }); });
        app.router('update-stock', function (ctx, next) { return __awaiter(void 0, void 0, void 0, function () {
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
        app.router('client-search', function (ctx, next) { return __awaiter(void 0, void 0, void 0, function () {
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
        app.router('set-visiable', function (ctx, next) { return __awaiter(void 0, void 0, void 0, function () {
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
        app.router('delete', function (ctx, next) { return __awaiter(void 0, void 0, void 0, function () {
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
        app.router('push-integral-rank', function (ctx, next) { return __awaiter(void 0, void 0, void 0, function () {
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
        app.router('update-good-visit-record', function (ctx, next) { return __awaiter(void 0, void 0, void 0, function () {
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
        app.router('good-visitors', function (ctx, next) { return __awaiter(void 0, void 0, void 0, function () {
            var _a, pid, before, start, search, visitors$, visitors, users$, users, e_12;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 3, , 4]);
                        _a = event.data, pid = _a.pid, before = _a.before, start = _a.start;
                        search = { pid: pid };
                        if (!!start && !!before) {
                            search = __assign(__assign({}, search), { visitTime: _.and(_.gte(start), _.lt(before)) });
                        }
                        else if (!!start && !before) {
                            search = __assign(__assign({}, search), { visitTime: _.gte(start) });
                        }
                        else if (!start && !!before) {
                            search = __assign(__assign({}, search), { visitTime: _.lt(before) });
                        }
                        return [4, db.collection('good-visiting-record')
                                .where(search)
                                .orderBy('visitTime', 'desc')
                                .get()];
                    case 1:
                        visitors$ = _b.sent();
                        visitors = visitors$.data;
                        return [4, Promise.all(visitors.map(function (visitor) { return __awaiter(void 0, void 0, void 0, function () {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEscUNBQXVDO0FBQ3ZDLHNDQUF3QztBQUV4QyxLQUFLLENBQUMsSUFBSSxDQUFDO0lBQ1AsR0FBRyxFQUFFLE9BQU8sQ0FBQyxHQUFHLENBQUMsS0FBSztDQUN6QixDQUFDLENBQUM7QUFFSCxJQUFNLEVBQUUsR0FBZ0IsS0FBSyxDQUFDLFFBQVEsRUFBRyxDQUFDO0FBQzFDLElBQU0sQ0FBQyxHQUFHLEVBQUUsQ0FBQyxPQUFPLENBQUM7QUFRckIsSUFBTSxNQUFNLEdBQUcsVUFBRSxFQUFVO0lBQVYsbUJBQUEsRUFBQSxVQUFVO0lBQ3ZCLElBQUssRUFBRSxFQUFHO1FBQ04sT0FBTyxJQUFJLENBQUMsR0FBRyxFQUFHLENBQUM7S0FDdEI7SUFDRCxJQUFNLE1BQU0sR0FBRyxJQUFJLElBQUksQ0FBRSxJQUFJLElBQUksRUFBRyxDQUFDLGNBQWMsRUFBRyxDQUFDLENBQUM7SUFDeEQsT0FBTyxJQUFJLElBQUksQ0FBRSxNQUFNLENBQUMsT0FBTyxFQUFHLEdBQUcsQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsSUFBSSxDQUFFLENBQUE7QUFDN0QsQ0FBQyxDQUFBO0FBNkNZLFFBQUEsSUFBSSxHQUFHLFVBQVEsS0FBSyxFQUFFLE9BQU87OztRQUVoQyxHQUFHLEdBQUcsSUFBSSxTQUFTLENBQUMsRUFBRSxLQUFLLE9BQUEsRUFBRSxDQUFDLENBQUM7UUFRckMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxRQUFRLEVBQUUsVUFBTyxHQUFHLEVBQUUsSUFBSTs7Ozs7O3dCQUd2QixHQUFHLEdBQUcsS0FBSyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUM7d0JBQ3JCLE1BQU0sR0FBRyxLQUFLLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQzt3QkFH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O2dDQUNkLE1BQU0sRUFBRSxHQUFHOzZCQUNkLEVBQUM7Ozs7YUFFVCxDQUFDLENBQUM7UUFHSCxXQUFPLEdBQUcsQ0FBQyxLQUFLLEVBQUcsRUFBQzs7S0FFdkIsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIGNsb3VkIGZyb20gJ3d4LXNlcnZlci1zZGsnO1xuaW1wb3J0ICogYXMgVGNiUm91dGVyIGZyb20gJ3RjYi1yb3V0ZXInO1xuXG5jbG91ZC5pbml0KHtcbiAgICBlbnY6IHByb2Nlc3MuZW52LmNsb3VkXG59KTtcblxuY29uc3QgZGI6IERCLkRhdGFiYXNlID0gY2xvdWQuZGF0YWJhc2UoICk7XG5jb25zdCBfID0gZGIuY29tbWFuZDtcblxuLyoqIFxuICog6L2s5o2i5qC85p6X5bC85rK75pe25Yy6ICs45pe25Yy6XG4gKiBEYXRlKCkubm93KCkgLyBuZXcgRGF0ZSgpLmdldFRpbWUoKSDmmK/ml7bkuI3ml7bmraPluLjnmoQrOFxuICogRGF0ZS50b0xvY2FsU3RyaW5nKCApIOWlveWDj+aYr+S4gOebtOaYrysw55qEXG4gKiDlhYjmi7/liLAgKzDvvIznhLblkI4rOFxuICovXG5jb25zdCBnZXROb3cgPSAoIHRzID0gZmFsc2UgKTogYW55ID0+IHtcbiAgICBpZiAoIHRzICkge1xuICAgICAgICByZXR1cm4gRGF0ZS5ub3coICk7XG4gICAgfVxuICAgIGNvbnN0IHRpbWVfMCA9IG5ldyBEYXRlKCBuZXcgRGF0ZSggKS50b0xvY2FsZVN0cmluZyggKSk7XG4gICAgcmV0dXJuIG5ldyBEYXRlKCB0aW1lXzAuZ2V0VGltZSggKSArIDggKiA2MCAqIDYwICogMTAwMCApXG59XG5cbi8qKlxuICogXG4gKiBAZGVzY3JpcHRpb24gXG4gKiDliJvlu7ov57yW6L6R5ZWG5ZOBXG4gKiB7XG4gKiAgICAgIF9pZDogaWRcbiAqICAgICAgaXNEZWxldGU6IOaYr+WQpuWIoOmZpFxuICogICAgICB0aXRsZTog5ZWG5ZOB5ZCN56ewIFN0cmluZ1xuICogICAgICBkZXRhaWwhOiDllYblk4Hmj4/ov7AgU3RyaW5nXG4gKiAgICAgIHRhZzog5ZWG5ZOB5qCH562+IEFycmF5PFN0cmluZz5cbiAqICAgICAgY2F0ZWdvcnk6IOWVhuWTgeexu+ebriBTdHJpbmdcbiAqICAgICAgaW1nOiDllYblk4Hlm77niYcgQXJyYXk8U3RyaW5nPlxuICogICAgICBwcmljZTog5Lu35qC8IE51bWJlclxuICogICAgICBmYWRlUHJpY2U6IOWIkue6v+S7tyBOdW1iZXJcbiAqICAgICAgZ3JvdXBQcmljZSE6IOWboui0reS7tyBOdW1iZXJcbiAqICAgICAgc3RvY2shOiDlupPlrZggTnVtYmVyXG4gKiAgICAgIGRlcG9zaXRQcmljZSE6IOWVhuWTgeiuoumHkSBOdW1iZXJcbiAqICAgICAgbGltaXQhOiDpmZDotK3mlbDph48gTnVtYmVyXG4gKiAgICAgIHZpc2lhYmxlOiDmmK/lkKbkuIrmnrYgQm9vbGVhblxuICogICAgICBzYWxlZDog6ZSA6YePIE51bWJlclxuICogICAgICB1cGRhdGVUaW1lXG4gKiEgICAgICBzdGFuZGFyZHMhOiDlnovlj7fop4TmoLwgQXJyYXk8eyBcbiAqICAgICAgICAgIG5hbWU6IFN0cmluZyxcbiAqICAgICAgICAgIHByaWNlOiBOdW1iZXIsXG4gKiAgICAgICAgICBncm91cFByaWNlITogTnVtYmVyLFxuICogICAgICAgICAgc3RvY2shOiBOdW1iZXI6XG4gKiAgICAgICAgICBpbWc6IFN0cmluZyAsXG4gKiAgICAgICAgICBfaWQ6IHN0cmluZyxcbiAqICAgICAgICAgIHBpZDogc3RyaW5nLFxuICogICAgICAgICAgaXNEZWxldGU6IGJvb2xlYW5cbiAqICAgICAgfT5cbiAqIH1cbiAqIFxuICogXG4gKiBAZGVzY3JpcHRpb25cbiAqIOWVhuWTgea1j+iniOiusOW9lVxuICogXG4gKiB7XG4gKiAgIHBpZFxuICogICBvcGVuaWRcbiAqICAgdmlzaXRUaW1lXG4gKiB9XG4gKi9cbmV4cG9ydCBjb25zdCBtYWluID0gYXN5bmMgKCBldmVudCwgY29udGV4dCApID0+IHtcblxuICAgIGNvbnN0IGFwcCA9IG5ldyBUY2JSb3V0ZXIoeyBldmVudCB9KTtcblxuICAgIC8qKlxuICAgICAqIEBkZXNjcmlwdGlvblxuICAgICAqIOWVhuWTgeivpuaDhVxuICAgICAqIC0tLS0tIOivt+axgiAtLS0tLVxuICAgICAqIF9pZFxuICAgICAqL1xuICAgIGFwcC5yb3V0ZXIoJ2RldGFpbCcsIGFzeW5jKCBjdHgsIG5leHQgKSA9PiB7XG4gICAgICAgIHRyeSB7XG5cbiAgICAgICAgICAgIGNvbnN0IF9pZCA9IGV2ZW50LmRhdGEuX2lkO1xuICAgICAgICAgICAgY29uc3Qgb3BlbmlkID0gZXZlbnQudXNlckluZm8ub3BlbklkO1xuXG4gICAgICAgICAgICAvLyDojrflj5bmlbDmja5cbiAgICAgICAgICAgIGNvbnN0IGRhdGEkID0gYXdhaXQgZGIuY29sbGVjdGlvbignZ29vZHMnKVxuICAgICAgICAgICAgICAgIC53aGVyZSh7XG4gICAgICAgICAgICAgICAgICAgIF9pZFxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLmdldCggKTtcblxuICAgICAgICAgICAgLy8g5ou85o6l5Z6L5Y+3XG4gICAgICAgICAgICBjb25zdCBtZXRhTGlzdCA9IGRhdGEkLmRhdGE7XG4gICAgICAgICAgICBjb25zdCBzdGFuZGFyZHMgPSBhd2FpdCBQcm9taXNlLmFsbCggbWV0YUxpc3QubWFwKCB4ID0+IHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZGIuY29sbGVjdGlvbignc3RhbmRhcmRzJylcbiAgICAgICAgICAgICAgICAgICAgLndoZXJlKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHBpZDogeC5faWQsXG4gICAgICAgICAgICAgICAgICAgICAgICBpc0RlbGV0ZTogZmFsc2VcbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgLmdldCggKTtcbiAgICAgICAgICAgIH0pKTtcblxuICAgICAgICAgICAgLy8g5ou85o6l5Z6L5Y+35oiW5ZWG5ZOB5rS75YqoXG4gICAgICAgICAgICBjb25zdCBhY3Rpdml0aWVzJCA9IGF3YWl0IGRiLmNvbGxlY3Rpb24oJ2FjdGl2aXR5JylcbiAgICAgICAgICAgICAgICAud2hlcmUoe1xuICAgICAgICAgICAgICAgICAgICBwaWQ6IF9pZCxcbiAgICAgICAgICAgICAgICAgICAgaXNDbG9zZWQ6IGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICBpc0RlbGV0ZWQ6IGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICB0eXBlOiAnZ29vZF9kaXNjb3VudCcsXG4gICAgICAgICAgICAgICAgICAgIGVuZFRpbWU6IF8uZ3QoIGdldE5vdyggdHJ1ZSApKVxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLmZpZWxkKHtcbiAgICAgICAgICAgICAgICAgICAgcGlkOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICBzaWQ6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgIHRpdGxlOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICBhY19wcmljZTogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgZW5kVGltZTogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgYWNfZ3JvdXBQcmljZTogdHJ1ZVxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLmdldCggKTtcblxuICAgICAgICAgICAgY29uc3QgaW5zZXJ0ID0gbWV0YUxpc3QubWFwKCggeCwgayApID0+IE9iamVjdC5hc3NpZ24oeyB9LCB4LCB7XG4gICAgICAgICAgICAgICAgYWN0aXZpdGllczogYWN0aXZpdGllcyQuZGF0YSxcbiAgICAgICAgICAgICAgICBzdGFuZGFyZHM6IHN0YW5kYXJkc1sgayBdLmRhdGFcbiAgICAgICAgICAgIH0pKTtcblxuICAgICAgICAgICAgLy8g5Yib5bu65rWP6KeIXG4gICAgICAgICAgICBhd2FpdCBjbG91ZC5jYWxsRnVuY3Rpb24oe1xuICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgICAgICAgb3BlbmlkLFxuICAgICAgICAgICAgICAgICAgICAgICAgcGlkOiBfaWQsXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICR1cmw6ICd1cGRhdGUtZ29vZC12aXNpdC1yZWNvcmQnXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBuYW1lOiAnZ29vZCdcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICByZXR1cm4gY3R4LmJvZHkgPSB7XG4gICAgICAgICAgICAgICAgc3RhdHVzOiAyMDAsXG4gICAgICAgICAgICAgICAgZGF0YTogaW5zZXJ0WyAwIF1cbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgfSBjYXRjaCAoIGUgKSB7XG4gICAgICAgICAgICByZXR1cm4gY3R4LmJvZHkgPSB7XG4gICAgICAgICAgICAgICAgc3RhdHVzOiA1MDAsXG4gICAgICAgICAgICAgICAgbWVzc2FnZTogZVxuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgLyoqXG4gICAgICogQGRlc2NyaXB0aW9uIOWVhuWTgemUgOmHj+aOkuihjOamnOWIl+ihqFxuICAgICAqIC0tLS0tLS0tIOivt+axgiAtLS0tLS0tLS0tXG4gICAgICoge1xuICAgICAqICAgICAgbGltaXRcbiAgICAgKiAgICAgIHNvcnQ6IOaOkuW6j1xuICAgICAqICAgICAgcGFnZTog6aG15pWwXG4gICAgICogICAgICBzZWFyY2g6IOaQnOe0olxuICAgICAqICAgICAgY2F0ZWdvcnk6IOWVhuWTgeexu+ebrlxuICAgICAqIH1cbiAgICAgKiAtLS0tLS0tLS0tIOi/lOWbniAtLS0tLS0tLVxuICAgICAqIHtcbiAgICAgKiAgICAgIGRhdGE6IOWIl+ihqFxuICAgICAqICAgICAgcGFnZTog6aG15pWwXG4gICAgICogICAgICB0b3RhbDog5oC75pWwXG4gICAgICogICAgICB0b3RhbFBhZ2U6IOaAu+mhteaVsFxuICAgICAqICAgICAgcGFnZVNpemU6IDIwXG4gICAgICogfVxuICAgICAqL1xuICAgIGFwcC5yb3V0ZXIoJ3JhbmsnLCBhc3luYyggY3R4LCBuZXh0ICkgPT4ge1xuICAgICAgICB0cnkge1xuXG4gICAgICAgICAgICBsZXQgYmpwQ29uZmlnOiBhbnkgPSBudWxsO1xuICAgICAgICAgICAgLy8g5p+l6K+i5p2h5pWwXG4gICAgICAgICAgICBjb25zdCBsaW1pdCA9IGV2ZW50LmRhdGEubGltaXQgfHwgMjA7XG4gICAgICAgICAgICBjb25zdCB7IGNhdGVnb3J5LCBzb3J0IH0gPSBldmVudC5kYXRhO1xuICAgICAgICAgICAgY29uc3Qgc2VhcmNoJCA9IGV2ZW50LmRhdGEuc2VhcmNoIHx8ICcnO1xuICAgICAgICAgICAgY29uc3Qgc2VhcmNoID0gbmV3IFJlZ0V4cCggc2VhcmNoJC5yZXBsYWNlKC9cXHMrL2csIFwiXCIpLCAnaScpO1xuXG4gICAgICAgICAgICBsZXQgd2hlcmUkID0ge1xuICAgICAgICAgICAgICAgIGNhdGVnb3J5LFxuICAgICAgICAgICAgICAgIHRpdGxlOiBzZWFyY2gsXG4gICAgICAgICAgICAgICAgdmlzaWFibGU6IHRydWUsXG4gICAgICAgICAgICAgICAgaXNEZWxldGU6IF8ubmVxKCB0cnVlIClcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIC8vIOS/neWBpeWTgemFjee9rlxuICAgICAgICAgICAgY29uc3QgYmpwQ29uZmlnJCA9IGF3YWl0IGRiLmNvbGxlY3Rpb24oJ2FwcC1jb25maWcnKVxuICAgICAgICAgICAgICAgICAgICAud2hlcmUoe1xuICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogJ2FwcC1ianAtdmlzaWJsZSdcbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgLmdldCggKTtcbiAgICAgICAgICAgIGJqcENvbmZpZyA9IGJqcENvbmZpZyQuZGF0YVsgMCBdO1xuXG4gICAgICAgICAgICBpZiAoICFjYXRlZ29yeSAmJiAhIWJqcENvbmZpZyAmJiAhYmpwQ29uZmlnLnZhbHVlICkge1xuICAgICAgICAgICAgICAgIHdoZXJlJCA9IE9iamVjdC5hc3NpZ24oeyB9LCB3aGVyZSQsIHtcbiAgICAgICAgICAgICAgICAgICAgY2F0ZWdvcnk6IF8ubmVxKCc0JylcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyDojrflj5bmgLvmlbBcbiAgICAgICAgICAgIGNvbnN0IHRvdGFsJCA9IGF3YWl0IGRiLmNvbGxlY3Rpb24oJ2dvb2RzJylcbiAgICAgICAgICAgICAgICAud2hlcmUoIHdoZXJlJCApXG4gICAgICAgICAgICAgICAgLmNvdW50KCApO1xuXG4gICAgICAgICAgICAvLyDojrflj5bllYblk4HmlbDmja5cbiAgICAgICAgICAgIGNvbnN0IGRhdGEkID0gYXdhaXQgZGIuY29sbGVjdGlvbignZ29vZHMnKVxuICAgICAgICAgICAgICAgIC53aGVyZSggd2hlcmUkIClcbiAgICAgICAgICAgICAgICAubGltaXQoIGxpbWl0IClcbiAgICAgICAgICAgICAgICAuc2tpcCgoIGV2ZW50LmRhdGEucGFnZSAtIDEgKSAqIGxpbWl0IClcbiAgICAgICAgICAgICAgICAub3JkZXJCeSggc29ydCB8fCAnc2FsZWQnLCAnZGVzYycpXG4gICAgICAgICAgICAgICAgLmdldCggKTtcblxuICAgICAgICAgICAgLy8g6I635Y+W5Z6L5Y+35pWw5o2uXG4gICAgICAgICAgICBjb25zdCBzdGFuZGFyZHMgPSBhd2FpdCBQcm9taXNlLmFsbCggZGF0YSQuZGF0YS5tYXAoIHggPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiBkYi5jb2xsZWN0aW9uKCdzdGFuZGFyZHMnKVxuICAgICAgICAgICAgICAgICAgICAud2hlcmUoe1xuICAgICAgICAgICAgICAgICAgICAgICAgcGlkOiB4Ll9pZCxcbiAgICAgICAgICAgICAgICAgICAgICAgIGlzRGVsZXRlOiBmYWxzZVxuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAuZ2V0KCApO1xuICAgICAgICAgICAgfSkpO1xuXG4gICAgICAgICAgICBjb25zdCBpbnNlcnRTdGFuZGFycyA9IGRhdGEkLmRhdGEubWFwKCggeCwgayApID0+IE9iamVjdC5hc3NpZ24oeyB9LCB4LCB7XG4gICAgICAgICAgICAgICAgc3RhbmRhcmRzOiBzdGFuZGFyZHNbIGsgXS5kYXRhXG4gICAgICAgICAgICB9KSk7XG5cbiAgICAgICAgICAgIC8vIOiOt+WPlua0u+WKqOaVsOaNruaVsOaNrlxuICAgICAgICAgICAgY29uc3QgYWN0aXZpdGllcyQgPSBhd2FpdCBQcm9taXNlLmFsbChcbiAgICAgICAgICAgICAgICBkYXRhJC5kYXRhLm1hcCggZ29vZCA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBkYi5jb2xsZWN0aW9uKCdhY3Rpdml0eScpXG4gICAgICAgICAgICAgICAgICAgICAgICAud2hlcmUoe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBpZDogZ29vZC5faWQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaXNDbG9zZWQ6IGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlzRGVsZXRlZDogZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogJ2dvb2RfZGlzY291bnQnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVuZFRpbWU6IF8uZ3QoIGdldE5vdyggdHJ1ZSApKVxuICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgICAgIC5nZXQoIClcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgKTtcblxuICAgICAgICAgICAgY29uc3QgaW5zZXJ0QWN0aXZpdHkgPSBpbnNlcnRTdGFuZGFycy5tYXAoKCB4LCBrICkgPT4gT2JqZWN0LmFzc2lnbih7IH0sIHgsIHtcbiAgICAgICAgICAgICAgICBhY3Rpdml0aWVzOiBhY3Rpdml0aWVzJFsgayBdLmRhdGFcbiAgICAgICAgICAgIH0pKTtcblxuICAgICAgICAgICAgcmV0dXJuIGN0eC5ib2R5ID0ge1xuICAgICAgICAgICAgICAgIHN0YXR1czogMjAwLFxuICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgZGF0YTogaW5zZXJ0QWN0aXZpdHksXG4gICAgICAgICAgICAgICAgICAgIHNlYXJjaDogc2VhcmNoJC5yZXBsYWNlKC9cXHMrL2csICcnKSxcbiAgICAgICAgICAgICAgICAgICAgcGFnZW5hdGlvbjoge1xuICAgICAgICAgICAgICAgICAgICAgICAgcGFnZVNpemU6IGxpbWl0LFxuICAgICAgICAgICAgICAgICAgICAgICAgcGFnZTogZXZlbnQuZGF0YS5wYWdlLFxuICAgICAgICAgICAgICAgICAgICAgICAgdG90YWw6IHRvdGFsJC50b3RhbCxcbiAgICAgICAgICAgICAgICAgICAgICAgIHRvdGFsUGFnZTogTWF0aC5jZWlsKCB0b3RhbCQudG90YWwgLyBsaW1pdCApXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgXG4gICAgICAgIH0gY2F0Y2ggKCBlICkge1xuICAgICAgICAgICAgcmV0dXJuIGN0eC5ib2R5ID0ge1xuICAgICAgICAgICAgICAgIHN0YXR1czogNTAwLFxuICAgICAgICAgICAgICAgIG1lc3NhZ2U6IGVcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgLyoqIFxuICAgICAqIEBkZXNjcmlwdGlvblxuICAgICAqIOaLvOWbouW5v+WcuueahOWPr+aLvOWbouWIl+ihqFxuICAgICAqICAtLS0tLS0tLSDor7fmsYIgLS0tLS0tLS0tLVxuICAgICAqIHtcbiAgICAgKiAgICAgIHBhZ2U6IOmhteaVsFxuICAgICAqICAgICAgc2VhcmNoOiDmkJzntKIsXG4gICAgICogICAgICB2aXNpdFRpbWU6IOa1j+iniOW8gOWni+aXtumXtO+8jOeUqOS6juiOt+WPluiuv+WuouWIl+ihqO+8jCDlj6/ml6BcbiAgICAgKiAgICAgIGZpbHRlckdvb2RJZHM6IOi/h+a7pOaMh+WumueahOWVhuWTgSBzdHJpbmcgfCBzdHJpbmdbXe+8jOWPr+aXoFxuICAgICAqIH1cbiAgICAgKi9cbiAgICBhcHAucm91dGVyKCdwaW4tZ3JvdW5kJywgYXN5bmMoIGN0eCwgbmV4dCApID0+IHtcbiAgICAgICAgdHJ5IHtcblxuICAgICAgICAgICAgY29uc3QgeyBwYWdlLCB2aXNpdFRpbWUgfSA9IGV2ZW50LmRhdGE7XG4gICAgICAgICAgICBjb25zdCBsaW1pdCA9IGV2ZW50LmRhdGEubGltaXQgfHwgMTA7XG4gICAgICAgICAgICBjb25zdCBmaWx0ZXJHb29kSWRzID0gZXZlbnQuZGF0YS5maWx0ZXJHb29kSWRzIHx8IFsgXTtcblxuICAgICAgICAgICAgY29uc3Qgc2VhcmNoJCA9IGV2ZW50LmRhdGEuc2VhcmNoIHx8ICcnO1xuICAgICAgICAgICAgY29uc3Qgc2VhcmNoID0gbmV3IFJlZ0V4cCggc2VhcmNoJC5yZXBsYWNlKC9cXHMrL2csIFwiXCIpLCAnaScpO1xuXG4gICAgICAgICAgICBsZXQgd2hlcmUkOiBhbnkgPSB7XG4gICAgICAgICAgICAgICAgdGl0bGU6IHNlYXJjaCxcbiAgICAgICAgICAgICAgICB2aXNpYWJsZTogdHJ1ZSxcbiAgICAgICAgICAgICAgICBpc0RlbGV0ZTogXy5uZXEoIHRydWUgKVxuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgaWYgKCBmaWx0ZXJHb29kSWRzLmxlbmd0aCA+IDAgKSB7XG4gICAgICAgICAgICAgICAgd2hlcmUkID0ge1xuICAgICAgICAgICAgICAgICAgICAuLi53aGVyZSQsXG4gICAgICAgICAgICAgICAgICAgIF9pZDogKF8gYXMgYW55KS5ub3IoIGZpbHRlckdvb2RJZHMubWFwKCB4ID0+IF8uZXEoIHggKSkpXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyDkv53lgaXlk4HphY3nva5cbiAgICAgICAgICAgIGNvbnN0IGJqcENvbmZpZyQgPSBhd2FpdCBkYi5jb2xsZWN0aW9uKCdhcHAtY29uZmlnJylcbiAgICAgICAgICAgICAgICAud2hlcmUoe1xuICAgICAgICAgICAgICAgICAgICB0eXBlOiAnYXBwLWJqcC12aXNpYmxlJ1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLmdldCggKTtcbiAgICAgICAgICAgIGNvbnN0IGJqcENvbmZpZyA9IGJqcENvbmZpZyQuZGF0YVsgMCBdO1xuXG4gICAgICAgICAgICBpZiAoICEhYmpwQ29uZmlnICYmICFianBDb25maWcudmFsdWUgKSB7XG4gICAgICAgICAgICAgICAgd2hlcmUkID0gT2JqZWN0LmFzc2lnbih7IH0sIHdoZXJlJCwge1xuICAgICAgICAgICAgICAgICAgICBjYXRlZ29yeTogXy5uZXEoJzQnKVxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIOiOt+WPluaAu+aVsFxuICAgICAgICAgICAgY29uc3QgdG90YWwkID0gYXdhaXQgZGIuY29sbGVjdGlvbignZ29vZHMnKVxuICAgICAgICAgICAgICAgIC53aGVyZSggd2hlcmUkIClcbiAgICAgICAgICAgICAgICAuY291bnQoICk7XG5cbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICog6L+Z6YeM5rKh5a+55ZWG5ZOB44CB5Z6L5Y+3XG4gICAgICAgICAgICAgKiDov5vooYwgZ3JvdXBQcmljZTogXy5ndCggMCApIFxuICAgICAgICAgICAgICog55qE6ZmQ5Yi2XG4gICAgICAgICAgICAgKiDljp/lm6DmmK/mnInlj6/og71hY3RpdmXmmK/mnInlm6LotK3ku7fnmoRcbiAgICAgICAgICAgICAqL1xuXG4gICAgICAgICAgICAvLyDojrflj5bllYblk4HmlbDmja5cbiAgICAgICAgICAgIGNvbnN0IGRhdGEkID0gYXdhaXQgZGIuY29sbGVjdGlvbignZ29vZHMnKVxuICAgICAgICAgICAgICAgIC53aGVyZSggd2hlcmUkIClcbiAgICAgICAgICAgICAgICAubGltaXQoIGxpbWl0IClcbiAgICAgICAgICAgICAgICAuc2tpcCgoIHBhZ2UgLSAxICkgKiBsaW1pdCApXG4gICAgICAgICAgICAgICAgLm9yZGVyQnkoICdzYWxlZCcsICdkZXNjJylcbiAgICAgICAgICAgICAgICAuZ2V0KCApO1xuXG4gICAgICAgICAgICAvLyDojrflj5blnovlj7fmlbDmja5cbiAgICAgICAgICAgIGNvbnN0IHN0YW5kYXJkcyA9IGF3YWl0IFByb21pc2UuYWxsKCBkYXRhJC5kYXRhLm1hcCggeCA9PiB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGRiLmNvbGxlY3Rpb24oJ3N0YW5kYXJkcycpXG4gICAgICAgICAgICAgICAgICAgIC53aGVyZSh7XG4gICAgICAgICAgICAgICAgICAgICAgICBwaWQ6IHguX2lkLFxuICAgICAgICAgICAgICAgICAgICAgICAgaXNEZWxldGU6IGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAuZ2V0KCApO1xuICAgICAgICAgICAgfSkpO1xuXG4gICAgICAgICAgICBjb25zdCBpbnNlcnRTdGFuZGFycyA9IGRhdGEkLmRhdGEubWFwKCggeCwgayApID0+IE9iamVjdC5hc3NpZ24oeyB9LCB4LCB7XG4gICAgICAgICAgICAgICAgc3RhbmRhcmRzOiBzdGFuZGFyZHNbIGsgXS5kYXRhXG4gICAgICAgICAgICB9KSk7XG5cbiAgICAgICAgICAgIC8vIOiOt+WPlua0u+WKqOaVsOaNruaVsOaNrlxuICAgICAgICAgICAgY29uc3QgYWN0aXZpdGllcyQgPSBhd2FpdCBQcm9taXNlLmFsbChcbiAgICAgICAgICAgICAgICBkYXRhJC5kYXRhLm1hcCggZ29vZCA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBkYi5jb2xsZWN0aW9uKCdhY3Rpdml0eScpXG4gICAgICAgICAgICAgICAgICAgICAgICAud2hlcmUoe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBpZDogZ29vZC5faWQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaXNDbG9zZWQ6IGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlzRGVsZXRlZDogZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogJ2dvb2RfZGlzY291bnQnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVuZFRpbWU6IF8uZ3QoIGdldE5vdyggdHJ1ZSApKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhY19ncm91cFByaWNlOiBfLmd0KCAwIClcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgICAgICAuZ2V0KCApXG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICk7XG5cbiAgICAgICAgICAgIGNvbnN0IGluc2VydEFjdGl2aXR5ID0gaW5zZXJ0U3RhbmRhcnMubWFwKCggeCwgayApID0+IE9iamVjdC5hc3NpZ24oeyB9LCB4LCB7XG4gICAgICAgICAgICAgICAgYWN0aXZpdGllczogYWN0aXZpdGllcyRbIGsgXS5kYXRhXG4gICAgICAgICAgICB9KSk7XG5cbiAgICAgICAgICAgIC8vIOiOt+WPluWVhuWTgeiuv+WuouiusOW9lVxuICAgICAgICAgICAgbGV0IHZpc2l0UmVjb3JkOiBhbnkgPSBbIF07XG4gICAgICAgICAgICBpZiAoICEhdmlzaXRUaW1lICkge1xuICAgICAgICAgICAgICAgIHZpc2l0UmVjb3JkID0gYXdhaXQgUHJvbWlzZS5hbGwoXG4gICAgICAgICAgICAgICAgICAgIGluc2VydEFjdGl2aXR5Lm1hcCggYXN5bmMgKCB4LCBrICkgPT4ge1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBwaWQgPSB4Ll9pZDtcblxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3Qgd2hlcmUkID0ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBpZCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2aXNpdFRpbWU6IF8uZ3RlKCB2aXNpdFRpbWUgKVxuICAgICAgICAgICAgICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgZ29vZFZpc2l0VG90YWwkID0gYXdhaXQgZGIuY29sbGVjdGlvbignZ29vZC12aXNpdGluZy1yZWNvcmQnKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC53aGVyZSggd2hlcmUkIClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAuY291bnQoICk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGdvb2RWaXNpdFJlY29yZCQgPSBhd2FpdCBkYi5jb2xsZWN0aW9uKCdnb29kLXZpc2l0aW5nLXJlY29yZCcpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLndoZXJlKCB3aGVyZSQgKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5vcmRlckJ5KCd2aXNpdFRpbWUnLCAnZGVzYycpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLmxpbWl0KCA1IClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAuZ2V0KCApO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCB1c2VycyA9IGF3YWl0IFByb21pc2UuYWxsKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGdvb2RWaXNpdFJlY29yZCQuZGF0YS5tYXAoIGFzeW5jIHJlY29yZCA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHsgb3BlbmlkIH0gPSByZWNvcmQ7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHVzZXIkID0gYXdhaXQgZGIuY29sbGVjdGlvbigndXNlcicpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAud2hlcmUoe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9wZW5pZFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5maWVsZCh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYXZhdGFyVXJsOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5pY2tOYW1lOiB0cnVlXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLmdldCggKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHVzZXIkLmRhdGFbIDAgXVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2aXNpdG9yU3VtOiBnb29kVmlzaXRUb3RhbCQudG90YWwsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYXZhdGFyczogdXNlcnNcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGNvbnN0IGluc2VydFZpc2l0UmVjb3JkID0gaW5zZXJ0QWN0aXZpdHkubWFwKCggeCwgayApID0+ICh7XG4gICAgICAgICAgICAgICAgLi4ueCxcbiAgICAgICAgICAgICAgICB2aXNpdFJlY29yZDogdmlzaXRSZWNvcmRbIGsgXVxuICAgICAgICAgICAgfSkpXG5cbiAgICAgICAgICAgIHJldHVybiBjdHguYm9keSA9IHtcbiAgICAgICAgICAgICAgICBzdGF0dXM6IDIwMCxcbiAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICAgIGRhdGE6IGluc2VydFZpc2l0UmVjb3JkLFxuICAgICAgICAgICAgICAgICAgICBwYWdlbmF0aW9uOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBwYWdlLFxuICAgICAgICAgICAgICAgICAgICAgICAgcGFnZVNpemU6IGxpbWl0LFxuICAgICAgICAgICAgICAgICAgICAgICAgdG90YWw6IHRvdGFsJC50b3RhbCxcbiAgICAgICAgICAgICAgICAgICAgICAgIHRvdGFsUGFnZTogTWF0aC5jZWlsKCB0b3RhbCQudG90YWwgLyBsaW1pdCApXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfSBjYXRjaCAoIGUgKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZygnPz8/JywgZSApO1xuICAgICAgICAgICAgcmV0dXJuIGN0eC5ib2R5ID0geyBzdGF0dXM6IDUwMCB9O1xuICAgICAgICB9XG4gICAgfSlcblxuICAgIC8qKlxuICAgICAqIOWVhuWTgeWIl+ihqO+8iCDlkKtzdGFuZGFyZHPjgIFhY3Rpdml0aWVz5a2Q6KGo77yJXG4gICAgICoge1xuICAgICAqICAgIHRpdGxlXG4gICAgICogICAgc2VhcmNoIFxuICAgICAqICAgIHBhZ2VcbiAgICAgKiB9XG4gICAgICovXG4gICAgYXBwLnJvdXRlcignbGlzdCcsIGFzeW5jKCBjdHgsIG5leHQgKSA9PiB7XG4gICAgICAgIHRyeSB7XG4gICAgIFxuICAgICAgICAgICAgLy8g5p+l6K+i5p2h5pWwXG4gICAgICAgICAgICBjb25zdCBsaW1pdCA9IGV2ZW50LmRhdGEubGltaXQgfHwgMjA7XG5cbiAgICAgICAgICAgIC8vIOafpeivouadoeS7tlxuICAgICAgICAgICAgY29uc3Qgc2VhcmNoUmVxID0ge1xuICAgICAgICAgICAgICAgIHRpdGxlOiAoISFldmVudC5kYXRhLnRpdGxlICYmICEhZXZlbnQuZGF0YS50aXRsZS50cmltKCApKSA/IFxuICAgICAgICAgICAgICAgICAgICBuZXcgUmVnRXhwKGV2ZW50LmRhdGEudGl0bGUucmVwbGFjZSgvXFxzKy9nLCBcIlwiKSwgJ2knKSA6IG51bGxcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIGNvbnN0IHRlbXAgPSB7XG4gICAgICAgICAgICAgICAgaXNEZWxldGU6IF8ubmVxKCB0cnVlIClcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICBPYmplY3Qua2V5cyggc2VhcmNoUmVxICkubWFwKCBrZXkgPT4ge1xuICAgICAgICAgICAgICAgIGlmICggISFzZWFyY2hSZXFbIGtleSBdKSB7XG4gICAgICAgICAgICAgICAgICAgIHRlbXBbIGtleSBdID0gc2VhcmNoUmVxWyBrZXkgXTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgLy8g6I635Y+W5oC75pWwXG4gICAgICAgICAgICBjb25zdCB0b3RhbCQgPSBhd2FpdCBkYi5jb2xsZWN0aW9uKCdnb29kcycpXG4gICAgICAgICAgICAgICAgLndoZXJlKCB0ZW1wIClcbiAgICAgICAgICAgICAgICAuY291bnQoICk7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIC8vIOiOt+WPluaVsOaNrlxuICAgICAgICAgICAgY29uc3QgZGF0YSQgPSBhd2FpdCBkYi5jb2xsZWN0aW9uKCdnb29kcycpXG4gICAgICAgICAgICAgICAgLndoZXJlKCB0ZW1wIClcbiAgICAgICAgICAgICAgICAubGltaXQoIGxpbWl0IClcbiAgICAgICAgICAgICAgICAuc2tpcCgoIGV2ZW50LmRhdGEucGFnZSAtIDEgKSAqIGxpbWl0IClcbiAgICAgICAgICAgICAgICAub3JkZXJCeSgndXBkYXRlVGltZScsICdkZXNjJylcbiAgICAgICAgICAgICAgICAuZ2V0KCApO1xuXG4gICAgICAgICAgICBjb25zdCBtZXRhTGlzdCA9IGRhdGEkLmRhdGE7XG4gICAgICAgICAgICBjb25zdCBzdGFuZGFyZHMgPSBhd2FpdCBQcm9taXNlLmFsbCggbWV0YUxpc3QubWFwKCB4ID0+IHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZGIuY29sbGVjdGlvbignc3RhbmRhcmRzJylcbiAgICAgICAgICAgICAgICAgICAgLndoZXJlKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHBpZDogeC5faWQsXG4gICAgICAgICAgICAgICAgICAgICAgICBpc0RlbGV0ZTogZmFsc2VcbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgLmdldCggKTtcbiAgICAgICAgICAgIH0pKTtcblxuICAgICAgICAgICAgY29uc3QgaW5zZXJ0U3RhbmRhcnMgPSBtZXRhTGlzdC5tYXAoKCB4LCBrICkgPT4gT2JqZWN0LmFzc2lnbih7IH0sIHgsIHtcbiAgICAgICAgICAgICAgICBzdGFuZGFyZHM6IHN0YW5kYXJkc1sgayBdLmRhdGFcbiAgICAgICAgICAgIH0pKTtcbiAgIFxuICAgICAgICAgICAgLy8g5p+l6K+i6KKr5Yqg5YWl6LSt54mp6L2m5pWw6YePXG4gICAgICAgICAgICBjb25zdCBjYXJ0cyA9IGF3YWl0IFByb21pc2UuYWxsKCBpbnNlcnRTdGFuZGFycy5tYXAoIHggPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiBkYi5jb2xsZWN0aW9uKCdjYXJ0JylcbiAgICAgICAgICAgICAgICAgICAgICAgIC53aGVyZSh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcGlkOiB4Ll9pZFxuICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgICAgIC5jb3VudCggKTtcbiAgICAgICAgICAgIH0pKTtcblxuICAgICAgICAgICAgY29uc3QgaW5zZXJ0Q2FydCA9IGluc2VydFN0YW5kYXJzLm1hcCgoIHgsIGsgKSA9PiBPYmplY3QuYXNzaWduKHsgfSwgeCwge1xuICAgICAgICAgICAgICAgIGNhcnRzOiBjYXJ0c1sgayBdLnRvdGFsXG4gICAgICAgICAgICB9KSk7XG5cbiAgICAgICAgICAgIHJldHVybiBjdHguYm9keSA9IHtcbiAgICAgICAgICAgICAgICBzdGF0dXM6IDIwMCxcbiAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICAgIHNlYXJjaDogZXZlbnQuZGF0YS50aXRsZS5yZXBsYWNlKC9cXHMrL2csICcnKSxcbiAgICAgICAgICAgICAgICAgICAgcGFnZVNpemU6IGxpbWl0LFxuICAgICAgICAgICAgICAgICAgICBwYWdlOiBldmVudC5kYXRhLnBhZ2UsXG4gICAgICAgICAgICAgICAgICAgIGRhdGE6IGluc2VydENhcnQsXG4gICAgICAgICAgICAgICAgICAgIHRvdGFsOiB0b3RhbCQudG90YWwsXG4gICAgICAgICAgICAgICAgICAgIHRvdGFsUGFnZTogTWF0aC5jZWlsKCB0b3RhbCQudG90YWwgLyBsaW1pdCApXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfTtcblxuICAgICAgICB9IGNhdGNoICggZSApIHtcbiAgICAgICAgICAgIHJldHVybiBjdHguYm9keSA9IHtcbiAgICAgICAgICAgICAgICBzdGF0dXM6IDUwMCxcbiAgICAgICAgICAgICAgICBtZXNzYWdlOiBlXG4gICAgICAgICAgICB9XG4gICAgICAgIH0gXG4gICAgfSk7XG5cbiAgICBhcHAucm91dGVyKCdlZGl0JywgYXN5bmMoIGN0eCwgbmV4dCApID0+IHtcbiAgICAgICAgdHJ5IHtcblxuICAgICAgICAgICAgbGV0IF9pZCA9IGV2ZW50LmRhdGEuX2lkO1xuXG4gICAgICAgICAgICAvLyDliKTmlq3mmK/lkKbmnInlkIzlkI3llYblk4FcbiAgICAgICAgICAgIGNvbnN0IHsgdGl0bGUgfSA9IGV2ZW50LmRhdGE7XG4gICAgICAgICAgICBpZiAoICFfaWQgKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgY2hlY2sxJCA9IGF3YWl0IGRiLmNvbGxlY3Rpb24oJ2dvb2RzJylcbiAgICAgICAgICAgICAgICAud2hlcmUoe1xuICAgICAgICAgICAgICAgICAgICB0aXRsZSxcbiAgICAgICAgICAgICAgICAgICAgaXNEZWxldGU6IF8ubmVxKCB0cnVlIClcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIC5jb3VudCggKTtcblxuICAgICAgICAgICAgICAgIGlmICggY2hlY2sxJC50b3RhbCAhPT0gMCApIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGN0eC5ib2R5ID0ge1xuICAgICAgICAgICAgICAgICAgICAgICAgc3RhdHVzOiA1MDAsXG4gICAgICAgICAgICAgICAgICAgICAgICBtZXNzYWdlOiAn5a2Y5Zyo5ZCM5ZCN5ZWG5ZOBLOivt+ajgOafpSdcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICggIV9pZCApIHtcbiAgICAgICAgICAgICAgICAvLyDliJvlu7pcbiAgICAgICAgICAgICAgICBjb25zdCB7IHN0YW5kYXJkcyB9ID0gZXZlbnQuZGF0YTtcbiAgICBcbiAgICAgICAgICAgICAgICBkZWxldGUgZXZlbnQuZGF0YVsnc3RhbmRhcmRzJ107XG4gICAgXG4gICAgICAgICAgICAgICAgY29uc3QgY3JlYXRlJCA9IGF3YWl0IGRiLmNvbGxlY3Rpb24oJ2dvb2RzJykuYWRkKHtcbiAgICAgICAgICAgICAgICAgICAgZGF0YTogT2JqZWN0LmFzc2lnbih7IH0sIGV2ZW50LmRhdGEsIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlzRGVsZXRlOiBmYWxzZVxuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIF9pZCA9IGNyZWF0ZSQuX2lkO1xuICAgIFxuICAgICAgICAgICAgICAgIC8vIOaPkuWFpeWei+WPt1xuICAgICAgICAgICAgICAgIGlmICggISFzdGFuZGFyZHMgJiYgQXJyYXkuaXNBcnJheSggc3RhbmRhcmRzICkpIHtcbiAgICAgICAgICAgICAgICAgICAgYXdhaXQgUHJvbWlzZS5hbGwoIHN0YW5kYXJkcy5tYXAoIHggPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGRiLmNvbGxlY3Rpb24oJ3N0YW5kYXJkcycpLmFkZCh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YTogT2JqZWN0LmFzc2lnbih7IH0sIHgsIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGlkOiBfaWQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlzRGVsZXRlOiBmYWxzZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgfSkpXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICBcbiAgICAgICAgICAgICAgICAvLyDmm7TmlrBcbiAgICAgICAgICAgICAgICBjb25zdCBtZXRhID0geyAuLi5ldmVudC5kYXRhIH07XG4gICAgICAgICAgICAgICAgY29uc3Qgc3RhbmRhcmRzID0gbWV0YS5zdGFuZGFyZHM7XG5cbiAgICAgICAgICAgICAgICBkZWxldGUgbWV0YS5faWQ7XG4gICAgICAgICAgICAgICAgZGVsZXRlIGV2ZW50LmRhdGEuX2lkO1xuICAgICAgICAgICAgICAgIGRlbGV0ZSBldmVudC5kYXRhLnN0YW5kYXJkcztcblxuICAgICAgICAgICAgICAgIGF3YWl0IGRiLmNvbGxlY3Rpb24oJ2dvb2RzJylcbiAgICAgICAgICAgICAgICAgICAgLmRvYyggX2lkIClcbiAgICAgICAgICAgICAgICAgICAgLnNldCh7XG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLi4uZXZlbnQuZGF0YVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9KVxuICAgIFxuICAgICAgICAgICAgICAgIC8vIDAuIOafpeivouivpeS6p+WTgeW6leS4i+aJgOacieeahOWei+WPt1xuICAgICAgICAgICAgICAgIGNvbnN0IGFsbFN0YW5kYXJkcyQgPSBhd2FpdCBkYi5jb2xsZWN0aW9uKCdzdGFuZGFyZHMnKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLndoZXJlKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwaWQ6IF9pZFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5nZXQoICk7XG4gICAgXG4gICAgICAgICAgICAgICAgLy8g6ZyA6KaB4oCc5Yig6Zmk4oCd55qE5Z6L5Y+3XG4gICAgICAgICAgICAgICAgY29uc3Qgd291bGRTZXREZWxldGU6IGFueVsgXSA9IFsgXTtcbiAgICBcbiAgICAgICAgICAgICAgICAvLyDpnIDopoHigJzmm7TmlrDigJ3nmoTlnovlj7dcbiAgICAgICAgICAgICAgICBjb25zdCB3b3VsZFVwZGF0ZTogYW55WyBdID0gWyBdO1xuICAgIFxuICAgICAgICAgICAgICAgIC8vIOmcgOimgeKAnOWinuWKoOKAneOAgeKAnOabtOaWsOKAneeahOWei+WPt1xuICAgICAgICAgICAgICAgIGNvbnN0IHdvdWxkQ3JlYXRlID0gc3RhbmRhcmRzLmZpbHRlciggeCA9PiAheC5faWQgKTtcbiAgICBcbiAgICAgICAgICAgICAgICBhbGxTdGFuZGFyZHMkLmRhdGEuZmlsdGVyKCB4ID0+IHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCAhc3RhbmRhcmRzLmZpbmQoIHkgPT4geS5faWQgPT09IHguX2lkICkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHdvdWxkU2V0RGVsZXRlLnB1c2goIHggKVxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgd291bGRVcGRhdGUucHVzaCggeCApXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICBcbiAgICAgICAgICAgICAgICAvLyAxLiAg4oCc5Yig6Zmk4oCd6YOo5YiG5Z6L5Y+3XG4gICAgICAgICAgICAgICAgYXdhaXQgUHJvbWlzZS5hbGwoIHdvdWxkU2V0RGVsZXRlLm1hcCggeCA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBkYi5jb2xsZWN0aW9uKCdzdGFuZGFyZHMnKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5kb2MoIHguX2lkIClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAudXBkYXRlKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaXNEZWxldGU6IHRydWVcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgfSkpO1xuICAgIFxuICAgICAgICAgICAgICAgIC8vIDIuIOabtOaWsOmDqOWIhuWei+WPt+S/oeaBr1xuICAgICAgICAgICAgICAgIGF3YWl0IFByb21pc2UuYWxsKCB3b3VsZFVwZGF0ZS5tYXAoIHggPT4ge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBuZXdUYXJnZXQgPSBzdGFuZGFyZHMuZmluZCggeSA9PiB5Ll9pZCA9PT0geC5faWQgKTtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgeyBuYW1lLCBwcmljZSwgZ3JvdXBQcmljZSwgc3RvY2ssIGltZyB9ID0gbmV3VGFyZ2V0O1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZGIuY29sbGVjdGlvbignc3RhbmRhcmRzJylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAuZG9jKCB4Ll9pZCApXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLnVwZGF0ZSh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5hbWUsIHByaWNlLCBncm91cFByaWNlLCBzdG9jaywgaW1nXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIH0pKTtcbiAgICBcbiAgICAgICAgICAgICAgICAvLyAzLiDmlrDlop7pg6jliIblnovlj7dcbiAgICAgICAgICAgICAgICBhd2FpdCBQcm9taXNlLmFsbCggd291bGRDcmVhdGUubWFwKCB4ID0+IHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGRiLmNvbGxlY3Rpb24oJ3N0YW5kYXJkcycpLmFkZCh7XG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLi4ueCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwaWQ6IF9pZCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpc0RlbGV0ZTogZmFsc2VcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICB9KSk7XG4gICAgXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIOWwhuatpOWVhuWTgWlk77yM5o+S5YWl5Yiw6KGM56iL5o6o6I2QXG4gICAgICAgICAgICBhd2FpdCBjbG91ZC5jYWxsRnVuY3Rpb24oe1xuICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgICAgICAgcGlkOiBfaWQsXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICR1cmw6ICdjcmVhdGUtcmVjb21tYW5kJ1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgbmFtZTogJ3RyaXAnXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgcmV0dXJuIGN0eC5ib2R5ID0ge1xuICAgICAgICAgICAgICAgIGRhdGE6IF9pZCxcbiAgICAgICAgICAgICAgICBzdGF0dXM6IDIwMFxuICAgICAgICAgICAgfTtcblxuICAgICAgICB9IGNhdGNoICggZSApIHtcbiAgICAgICAgICAgIHJldHVybiBjdHguYm9keSA9IHtcbiAgICAgICAgICAgICAgICBzdGF0dXM6IDUwMCxcbiAgICAgICAgICAgICAgICBtZXNzYWdlOiBlXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9KVxuXG4gICAgLyoqXG4gICAgICogQGRlc2NyaXB0aW9uXG4gICAgICog5qC55o2u6aKE5LuY6K6i5Y2V55qE55u45YWz5L+h5oGv77yM5YeP5bCR44CB5pu05paw5oyH5a6a5ZWG5ZOB55qE5bqT5a2YXG4gICAgICogLS0tLS0tLS0tLSDor7fmsYIgLS0tLS0tLS0tLS1cbiAgICAgKiB7XG4gICAgICogICAgICBzaWQsXG4gICAgICogICAgICBwaWQsXG4gICAgICogICAgICBjb3VudFxuICAgICAqIH1cbiAgICAgKi9cbiAgICBhcHAucm91dGVyKCd1cGRhdGUtc3RvY2snLCBhc3luYyggY3R4LCBuZXh0ICkgPT4ge1xuICAgICAgICB0cnkge1xuXG4gICAgICAgICAgICBjb25zdCB7IHNpZCwgcGlkLCBjb3VudCB9ID0gZXZlbnQuZGF0YTtcblxuICAgICAgICAgICAgbGV0IHRhcmdldDogYW55ID0gbnVsbDtcbiAgICAgICAgICAgIGNvbnN0IHRhcmdldElkID0gc2lkIHx8IHBpZDtcbiAgICAgICAgICAgIGNvbnN0IGNvbGxlY3Rpb25OYW1lID0gISFzaWQgPyAnc3RhbmRhcmRzJyA6ICdnb29kcyc7XG5cbiAgICAgICAgICAgIGNvbnN0IGZpbmQkID0gYXdhaXQgZGIuY29sbGVjdGlvbiggY29sbGVjdGlvbk5hbWUgKVxuICAgICAgICAgICAgICAgIC53aGVyZSh7XG4gICAgICAgICAgICAgICAgICAgIF9pZDogdGFyZ2V0SWRcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIC5nZXQoICk7XG5cbiAgICAgICAgICAgIGlmICggZmluZCQuZGF0YS5sZW5ndGggPT09IDAgKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgISFzaWQgPyAn5pu05paw5bqT5a2Y5byC5bi4LCDlvZPliY3lnovlj7fkuI3lrZjlnKgnIDogJ+abtOaWsOW6k+WtmOW8guW4uCwg5b2T5YmN5ZWG5ZOB5LiN5a2Y5ZyoJ1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0YXJnZXQgPSBmaW5kJC5kYXRhWyAwIF07XG5cbiAgICAgICAgICAgIC8vIOaXoOmZkOW6k+WtmFxuICAgICAgICAgICAgaWYgKCB0YXJnZXQuc3RvY2sgPT09IG51bGwgfHwgdGFyZ2V0LnN0b2NrID09PSB1bmRlZmluZWQgKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGN0eC5ib2R5ID0ge1xuICAgICAgICAgICAgICAgICAgICBzdGF0dXM6IDIwMFxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8g5Yik5pat5bqT5a2Y5piv5ZCm6Laz5aSfXG4gICAgICAgICAgICBpZiAoIHRhcmdldC5zdG9jayAtIGNvdW50IDwgMCApIHtcbiAgICAgICAgICAgICAgICB0aHJvdyAhIXNpZCA/ICfmm7TmlrDlupPlrZjlvILluLgsIOW9k+WJjeWei+WPt+W6k+WtmOS4jei2sycgOiAn5pu05paw5bqT5a2Y5byC5bi4LCDlvZPliY3llYblk4HlupPlrZjkuI3otrMnO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyDmm7TmlrBcbiAgICAgICAgICAgIGF3YWl0IGRiLmNvbGxlY3Rpb24oIGNvbGxlY3Rpb25OYW1lICkuZG9jKCB0YXJnZXRJZCApXG4gICAgICAgICAgICAgICAgLnVwZGF0ZSh7XG4gICAgICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0b2NrOiBfLmluYyggLWNvdW50IClcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pXG5cbiAgICAgICAgICAgIHJldHVybiBjdHguYm9keSA9IHtcbiAgICAgICAgICAgICAgICBzdGF0dXM6IDIwMFxuICAgICAgICAgICAgfVxuXG4gICAgICAgIH0gY2F0Y2ggKCBlICkge1xuICAgICAgICAgICAgY29uc29sZS5sb2coYC0tLS3jgJBFcnJvci1Hb29k44CRLS0tLe+8miR7SlNPTi5zdHJpbmdpZnkoIGUgKX1gKTtcbiAgICAgICAgICAgIHJldHVybiBjdHguYm9keSA9IHsgc3RhdHVzOiA1MDAsIG1lc3NhZ2U6IGUgfTtcbiAgICAgICAgfVxuICAgIH0pXG5cbiAgICAvKipcbiAgICAgKiBAZGVzY3JpcHRpb25cbiAgICAgKiDlrqLmiLfnq6/mkJzntKLllYblk4HliJfooajvvIgg5YiG57G75pCc5pCc44CB5oiW5paH5a2X5pCc5pCcIO+8iVxuICAgICAqICEgc2VhcmNoIOS4jeS8muaYr+epuuWtl+espuS4slxuICAgICAqIHtcbiAgICAgKiAgICBzZWFyY2gsXG4gICAgICogICAgcGFnZSxcbiAgICAgKiAgICBjYXRlZ29yeVxuICAgICAqIH1cbiAgICAgKi9cbiAgICBhcHAucm91dGVyKCdjbGllbnQtc2VhcmNoJywgYXN5bmMoIGN0eCwgbmV4dCApID0+IHtcbiAgICAgICAgdHJ5IHtcblxuICAgICAgICAgICAgLy8g5p+l6K+i5p2h5pWwXG4gICAgICAgICAgICBjb25zdCBsaW1pdCA9IDEwO1xuICAgICAgICAgICAgbGV0IGJqcENvbmZpZzogYW55ID0gbnVsbDtcbiAgICAgICAgICAgIGNvbnN0IG9wZW5pZCA9IGV2ZW50LnVzZXJJbmZvLm9wZW5JZDtcbiAgICAgICAgICAgIGNvbnN0IHsgc2VhcmNoLCBwYWdlLCBjYXRlZ29yeSB9ID0gZXZlbnQuZGF0YTtcblxuICAgICAgICAgICAgbGV0IHF1ZXJ5OiBhbnkgPSBudWxsO1xuXG5cbiAgICAgICAgICAgIGlmICggISFjYXRlZ29yeSApIHtcbiAgICAgICAgICAgICAgICBxdWVyeSA9IF8ub3IoW1xuICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjYXRlZ29yeSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHZpc2lhYmxlOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICAgICAgaXNEZWxldGU6IF8ubmVxKCB0cnVlIClcbiAgICAgICAgICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICAgICAgICAgICAgY2F0ZWdvcnksXG4gICAgICAgICAgICAgICAgICAgICAgICB2aXNpYWJsZTogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGlzRGVsZXRlOiBfLm5lcSggdHJ1ZSApXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBdKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8g5L+d5YGl5ZOB6YWN572uXG4gICAgICAgICAgICBjb25zdCBianBDb25maWckID0gYXdhaXQgZGIuY29sbGVjdGlvbignYXBwLWNvbmZpZycpXG4gICAgICAgICAgICAgICAgICAgIC53aGVyZSh7XG4gICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiAnYXBwLWJqcC12aXNpYmxlJ1xuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAuZ2V0KCApO1xuICAgICAgICAgICAgYmpwQ29uZmlnID0gYmpwQ29uZmlnJC5kYXRhWyAwIF07XG5cbiAgICAgICAgICAgIC8vIOaQnOe0ouS5n+imgeWxj+iUveS/neWBpeWTgVxuICAgICAgICAgICAgLy8g6Z2e566h55CG5Lq65ZGY5omN5bGP6JS9XG4gICAgICAgICAgICBpZiAoICEhc2VhcmNoICkge1xuXG4gICAgICAgICAgICAgICAgY29uc3QgYWRtaW5DaGVjayA9IGF3YWl0IGRiLmNvbGxlY3Rpb24oJ21hbmFnZXItbWVtYmVyJylcbiAgICAgICAgICAgICAgICAgICAgLndoZXJlKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG9wZW5pZFxuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAuY291bnQoICk7XG5cbiAgICAgICAgICAgICAgICBsZXQgY2F0ZWdvcnlGaWx0ZXIgPSBfLm5lcSgnOTk5OScpO1xuXG4gICAgICAgICAgICAgICAgaWYgKCAhIWJqcENvbmZpZyAmJiAhYmpwQ29uZmlnLnZhbHVlICYmIGFkbWluQ2hlY2sudG90YWwgPT09IDAgKSB7XG4gICAgICAgICAgICAgICAgICAgIGNhdGVnb3J5RmlsdGVyID0gXy5uZXEoJzQnKVxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICAgICAqIOaQnOe0oue6rOW6pu+8mlxuICAgICAgICAgICAgICAgICAqIOWVhuWTgeagh+mimFxuICAgICAgICAgICAgICAgICAqIOivpuaDhVxuICAgICAgICAgICAgICAgICAqISDmoIfnrb7vvIjmnKrlrp7njrDvvIlcbiAgICAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgICAgIHF1ZXJ5ID0gXy5vcihbXG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZpc2lhYmxlOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICAgICAgaXNEZWxldGU6IF8ubmVxKCB0cnVlICksXG4gICAgICAgICAgICAgICAgICAgICAgICBjYXRlZ29yeTogY2F0ZWdvcnlGaWx0ZXIsXG4gICAgICAgICAgICAgICAgICAgICAgICB0aXRsZTogbmV3IFJlZ0V4cCggc2VhcmNoLnJlcGxhY2UoIC9cXHMrL2csICcnICksICdpJyApXG4gICAgICAgICAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZpc2lhYmxlOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICAgICAgaXNEZWxldGU6IF8ubmVxKCB0cnVlICksXG4gICAgICAgICAgICAgICAgICAgICAgICBjYXRlZ29yeTogY2F0ZWdvcnlGaWx0ZXIsXG4gICAgICAgICAgICAgICAgICAgICAgICBkZXRhaWw6IG5ldyBSZWdFeHAoIHNlYXJjaC5yZXBsYWNlKCAvXFxzKy9nLCAnJyApLCAnaScgKVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgXSk7XG5cbiAgICAgICAgICAgIH1cblxuXG4gICAgICAgICAgICAvLyDojrflj5bmgLvmlbBcbiAgICAgICAgICAgIGNvbnN0IHRvdGFsJCA9IGF3YWl0IGRiLmNvbGxlY3Rpb24oJ2dvb2RzJylcbiAgICAgICAgICAgICAgICAud2hlcmUoIHF1ZXJ5IClcbiAgICAgICAgICAgICAgICAuY291bnQoICk7XG5cbiAgICAgICAgICAgIC8vIOiOt+WPluaVsOaNrlxuICAgICAgICAgICAgY29uc3QgZGF0YSQgPSBhd2FpdCBkYi5jb2xsZWN0aW9uKCdnb29kcycpXG4gICAgICAgICAgICAgICAgLndoZXJlKCBxdWVyeSApXG4gICAgICAgICAgICAgICAgLmxpbWl0KCBsaW1pdCApXG4gICAgICAgICAgICAgICAgLnNraXAoKCBwYWdlIC0gMSApICogbGltaXQgKVxuICAgICAgICAgICAgICAgIC5vcmRlckJ5KCdzYWxlZCcsICdkZXNjJylcbiAgICAgICAgICAgICAgICAuZ2V0KCApO1xuXG4gICAgICAgICAgICAvLyDmi7zmjqXlnovlj7flkozllYblk4HmtLvliqhcbiAgICAgICAgICAgIGNvbnN0IGFjdGl2aXRpZXMkID0gYXdhaXQgUHJvbWlzZS5hbGwoIGRhdGEkLmRhdGEubWFwKCBnb29kID0+IHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZGIuY29sbGVjdGlvbignYWN0aXZpdHknKVxuICAgICAgICAgICAgICAgICAgICAud2hlcmUoe1xuICAgICAgICAgICAgICAgICAgICAgICAgcGlkOiBnb29kLl9pZCxcbiAgICAgICAgICAgICAgICAgICAgICAgIGlzQ2xvc2VkOiBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGlzRGVsZXRlZDogZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiAnZ29vZF9kaXNjb3VudCcsXG4gICAgICAgICAgICAgICAgICAgICAgICBlbmRUaW1lOiBfLmd0KCBnZXROb3coIHRydWUgKSlcbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgLmZpZWxkKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHBpZDogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHNpZDogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHRpdGxlOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICAgICAgYWNfcHJpY2U6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgICAgICBlbmRUaW1lOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICAgICAgYWNfZ3JvdXBQcmljZTogdHJ1ZVxuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAuZ2V0KCApO1xuICAgICAgICAgICAgfSkpO1xuXG4gICAgICAgICAgICBjb25zdCBzdGFuZGFyZHMkID0gYXdhaXQgUHJvbWlzZS5hbGwoIGRhdGEkLmRhdGEubWFwKCBnb29kID0+IHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZGIuY29sbGVjdGlvbignc3RhbmRhcmRzJylcbiAgICAgICAgICAgICAgICAgICAgLndoZXJlKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHBpZDogZ29vZC5faWQsXG4gICAgICAgICAgICAgICAgICAgICAgICBpc0RlbGV0ZTogZmFsc2VcbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgLmdldCggKTtcbiAgICAgICAgICAgIH0pKTtcblxuICAgICAgICAgICAgY29uc3QgaW5zZXJ0QWN0aXZpdGllcyA9IGRhdGEkLmRhdGEubWFwKCggbWV0YSwgayApID0+IHtcbiAgICAgICAgICAgICAgICByZXR1cm4gT2JqZWN0LmFzc2lnbih7IH0sIG1ldGEsIHtcbiAgICAgICAgICAgICAgICAgICAgc3RhbmRhcmRzOiBzdGFuZGFyZHMkWyBrIF0uZGF0YSwgXG4gICAgICAgICAgICAgICAgICAgIGFjdGl2aXR5OiBhY3Rpdml0aWVzJFsgayBdLmRhdGEubGVuZ3RoID09PSAwID8gbnVsbCA6IGFjdGl2aXRpZXMkWyBrIF0uZGF0YVsgMCBdXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9KVxuXG4gICAgICAgICAgICByZXR1cm4gY3R4LmJvZHkgPSB7XG4gICAgICAgICAgICAgICAgc3RhdHVzOiAyMDAsXG4gICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgICBwYWdlLFxuICAgICAgICAgICAgICAgICAgICBwYWdlU2l6ZTogbGltaXQsXG4gICAgICAgICAgICAgICAgICAgIGRhdGE6IGluc2VydEFjdGl2aXRpZXMsXG4gICAgICAgICAgICAgICAgICAgIHRvdGFsOiB0b3RhbCQudG90YWwsXG4gICAgICAgICAgICAgICAgICAgIHRvdGFsUGFnZTogTWF0aC5jZWlsKCB0b3RhbCQudG90YWwgLyBsaW1pdCApLFxuICAgICAgICAgICAgICAgICAgICBzZWFyY2g6ICEhc2VhcmNoID8gc2VhcmNoLnJlcGxhY2UoIC9cXHMrL2csICcnICkgOiB1bmRlZmluZWRcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgIH0gY2F0Y2ggKCBlICkge1xuICAgICAgICAgICAgcmV0dXJuIGN0eC5ib2R5ID0geyBzdGF0dXM6IDUwMCB9O1xuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICAvKipcbiAgICAgKiBAZGVzY3JpcHRpb25cbiAgICAgKiDnrqHnkIbnq68g5LiK5LiL5p625ZWG5ZOBXG4gICAgICoge1xuICAgICAqICAgIHBpZCxcbiAgICAgKiAgICB2aXNpYWJsZVxuICAgICAqIH1cbiAgICAgKi9cbiAgICBhcHAucm91dGVyKCdzZXQtdmlzaWFibGUnLCBhc3luYyggY3R4LCBuZXh0ICkgPT4ge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgY29uc3QgeyBwaWQsIHZpc2lhYmxlIH0gPSBldmVudC5kYXRhO1xuICAgICAgICAgICAgYXdhaXQgZGIuY29sbGVjdGlvbignZ29vZHMnKVxuICAgICAgICAgICAgICAgIC5kb2MoIHBpZCApXG4gICAgICAgICAgICAgICAgLnVwZGF0ZSh7XG4gICAgICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZpc2lhYmxlLFxuICAgICAgICAgICAgICAgICAgICAgICAgdXBkYXRlVGltZTogZ2V0Tm93KCB0cnVlIClcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICByZXR1cm4gY3R4LmJvZHkgPSB7IHN0YXR1czogMjAwIH07XG4gICAgICAgICAgICBcbiAgICAgICAgfSBjYXRjaCAoIGUgKSB7XG4gICAgICAgICAgICByZXR1cm4gY3R4LmJvZHkgPSB7IHN0YXR1czogNTAwIH07XG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgIC8qKlxuICAgICAqIEBkZXNjcmlwdGlvblxuICAgICAqIOWIoOmZpOWVhuWTgVxuICAgICAqIHtcbiAgICAgKiAgICBwaWQgXG4gICAgICogfVxuICAgICAqL1xuICAgIGFwcC5yb3V0ZXIoJ2RlbGV0ZScsIGFzeW5jKCBjdHgsIG5leHQgKSA9PiB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBjb25zdCB7IHBpZCB9ID0gZXZlbnQuZGF0YTtcbiAgICAgICAgICAgIGF3YWl0IGRiLmNvbGxlY3Rpb24oJ2dvb2RzJylcbiAgICAgICAgICAgICAgICAuZG9jKCBTdHJpbmcoIHBpZCApKVxuICAgICAgICAgICAgICAgIC51cGRhdGUoe1xuICAgICAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpc0RlbGV0ZTogdHJ1ZVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICByZXR1cm4gY3R4LmJvZHkgPSB7XG4gICAgICAgICAgICAgICAgZGF0YTogcGlkLFxuICAgICAgICAgICAgICAgIHN0YXR1czogMjAwXG4gICAgICAgICAgICB9O1xuXG4gICAgICAgIH0gY2F0Y2ggKCBlICkge1xuICAgICAgICAgICAgcmV0dXJuIGN0eC5ib2R5ID0geyBzdGF0dXM6IDUwMCB9O1xuICAgICAgICB9XG4gICAgfSlcblxuICAgIC8qKlxuICAgICAqIEBkZXNjcmlwdGlvblxuICAgICAqIOaOqOW5v+enr+WIhuWVhuWTgeeahOaOkuihjOamnFxuICAgICAqIHtcbiAgICAgKiAgICAgIHBhZ2VcbiAgICAgKiB9XG4gICAgICovXG4gICAgYXBwLnJvdXRlcigncHVzaC1pbnRlZ3JhbC1yYW5rJywgYXN5bmMoIGN0eCwgbmV4dCApID0+IHtcbiAgICAgICAgdHJ5IHtcblxuICAgICAgICAgICAgLy8g5p+l6K+i5p2h5pWwXG4gICAgICAgICAgICBjb25zdCB7IHBhZ2UgfSA9IGV2ZW50LmRhdGE7XG4gICAgICAgICAgICBjb25zdCBsaW1pdCA9IGV2ZW50LmRhdGEubGltaXQgfHwgMjA7XG5cbiAgICAgICAgICAgIGNvbnN0IHdoZXJlJCA9IHtcbiAgICAgICAgICAgICAgICBpc0RlbGV0ZTogXy5uZXEoIHRydWUgKSxcbiAgICAgICAgICAgICAgICBjYXRlZ29yeTogXy5vciggXy5lcSgnMCcpLCBfLmVxKCcxJykpXG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICBjb25zdCB0b3RhbCQgPSBhd2FpdCBkYi5jb2xsZWN0aW9uKCdnb29kcycpXG4gICAgICAgICAgICAgICAgLndoZXJlKCB3aGVyZSQgKVxuICAgICAgICAgICAgICAgIC5jb3VudCggKTtcblxuICAgICAgICAgICAgY29uc3QgZGF0YSQgPSBhd2FpdCBkYi5jb2xsZWN0aW9uKCdnb29kcycpXG4gICAgICAgICAgICAgICAgLndoZXJlKCB3aGVyZSQgKVxuICAgICAgICAgICAgICAgIC5saW1pdCggbGltaXQgKVxuICAgICAgICAgICAgICAgIC5za2lwKCggcGFnZSAtIDEgKSAqIGxpbWl0IClcbiAgICAgICAgICAgICAgICAub3JkZXJCeSggJ3NhbGVkJywgJ2Rlc2MnKVxuICAgICAgICAgICAgICAgIC5vcmRlckJ5KCAnZmFkZVByaWNlJywgJ2Rlc2MnKVxuICAgICAgICAgICAgICAgIC5nZXQoICk7XG5cbiAgICAgICAgICAgICAgICAvLyDojrflj5blnovlj7fmlbDmja5cbiAgICAgICAgICAgIGNvbnN0IHN0YW5kYXJkcyA9IGF3YWl0IFByb21pc2UuYWxsKCBkYXRhJC5kYXRhLm1hcCggeCA9PiB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGRiLmNvbGxlY3Rpb24oJ3N0YW5kYXJkcycpXG4gICAgICAgICAgICAgICAgICAgIC53aGVyZSh7XG4gICAgICAgICAgICAgICAgICAgICAgICBwaWQ6IHguX2lkLFxuICAgICAgICAgICAgICAgICAgICAgICAgaXNEZWxldGU6IGZhbHNlXG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgIC5nZXQoICk7XG4gICAgICAgICAgICB9KSk7XG5cbiAgICAgICAgICAgIGNvbnN0IGluc2VydFN0YW5kYXJzID0gZGF0YSQuZGF0YS5tYXAoKCB4LCBrICkgPT4gT2JqZWN0LmFzc2lnbih7IH0sIHgsIHtcbiAgICAgICAgICAgICAgICBzdGFuZGFyZHM6IHN0YW5kYXJkc1sgayBdLmRhdGFcbiAgICAgICAgICAgIH0pKTtcblxuICAgICAgICAgICAgLy8g6I635Y+W5rS75Yqo5pWw5o2u5pWw5o2uXG4gICAgICAgICAgICBjb25zdCBhY3Rpdml0aWVzJCA9IGF3YWl0IFByb21pc2UuYWxsKFxuICAgICAgICAgICAgICAgIGRhdGEkLmRhdGEubWFwKCBnb29kID0+IHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGRiLmNvbGxlY3Rpb24oJ2FjdGl2aXR5JylcbiAgICAgICAgICAgICAgICAgICAgICAgIC53aGVyZSh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcGlkOiBnb29kLl9pZCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpc0Nsb3NlZDogZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaXNEZWxldGVkOiBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiAnZ29vZF9kaXNjb3VudCcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZW5kVGltZTogXy5ndCggZ2V0Tm93KCB0cnVlICkpXG4gICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAgICAgLmdldCggKVxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICApO1xuXG4gICAgICAgICAgICBjb25zdCBpbnNlcnRBY3Rpdml0eSA9IGluc2VydFN0YW5kYXJzLm1hcCgoIHgsIGsgKSA9PiBPYmplY3QuYXNzaWduKHsgfSwgeCwge1xuICAgICAgICAgICAgICAgIGFjdGl2aXRpZXM6IGFjdGl2aXRpZXMkWyBrIF0uZGF0YVxuICAgICAgICAgICAgfSkpO1xuXG4gICAgICAgICAgICByZXR1cm4gY3R4LmJvZHkgPSB7XG4gICAgICAgICAgICAgICAgc3RhdHVzOiAyMDAsXG4gICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgICBkYXRhOiBpbnNlcnRBY3Rpdml0eSxcbiAgICAgICAgICAgICAgICAgICAgcGFnZW5hdGlvbjoge1xuICAgICAgICAgICAgICAgICAgICAgICAgcGFnZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHBhZ2VTaXplOiBsaW1pdCxcbiAgICAgICAgICAgICAgICAgICAgICAgIHRvdGFsOiB0b3RhbCQudG90YWwsXG4gICAgICAgICAgICAgICAgICAgICAgICB0b3RhbFBhZ2U6IE1hdGguY2VpbCggdG90YWwkLnRvdGFsIC8gbGltaXQgKVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfTtcblxuICAgICAgICB9IGNhdGNoICggZSApIHtcbiAgICAgICAgICAgIHJldHVybiBjdHguYm9keSA9IHtcbiAgICAgICAgICAgICAgICBzdGF0dXM6IDUwMFxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSlcblxuICAgIC8qKlxuICAgICAqIEBkZXNjcmlwdGlvblxuICAgICAqIOabtOaWsOW9k+WJjeeUqOaIt+eahOWVhuWTgea1j+iniOWOhuWPslxuICAgICAqIFxuICAgICAqIEBib2R5IHtvcGVuaWR9XG4gICAgICogQGJvZHkge3BpZH0g5ZWG5ZOBSURcbiAgICAgKi9cbiAgICBhcHAucm91dGVyKCd1cGRhdGUtZ29vZC12aXNpdC1yZWNvcmQnLCBhc3luYyggY3R4LCBuZXh0ICkgPT4ge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgY29uc3QgeyBwaWQgfSA9IGV2ZW50LmRhdGE7XG4gICAgICAgICAgICBjb25zdCBvcGVuaWQgPSBldmVudC5kYXRhLm9wZW5JZCB8fCBldmVudC5kYXRhLm9wZW5pZCB8fCBldmVudC51c2VySW5mby5vcGVuSWQ7XG5cbiAgICAgICAgICAgIC8vIOafpeaJvuaXp+eahOiusOW9lVxuICAgICAgICAgICAgY29uc3QgcmVjb3JkJCA9IGF3YWl0IGRiLmNvbGxlY3Rpb24oJ2dvb2QtdmlzaXRpbmctcmVjb3JkJylcbiAgICAgICAgICAgICAgICAud2hlcmUoe1xuICAgICAgICAgICAgICAgICAgICBwaWQsXG4gICAgICAgICAgICAgICAgICAgIG9wZW5pZFxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLmdldCggKTtcbiAgICAgICAgICAgIGNvbnN0IHJlY29yZCA9IHJlY29yZCQuZGF0YVsgMCBdO1xuXG4gICAgICAgICAgICAvLyDmnInliJnmm7TmlrBcbiAgICAgICAgICAgIGlmICggISFyZWNvcmQgKSB7XG4gICAgICAgICAgICAgICAgYXdhaXQgZGIuY29sbGVjdGlvbignZ29vZC12aXNpdGluZy1yZWNvcmQnKVxuICAgICAgICAgICAgICAgICAgICAuZG9jKCBTdHJpbmcoIHJlY29yZC5faWQgKSlcbiAgICAgICAgICAgICAgICAgICAgLnVwZGF0ZSh7XG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmlzaXRUaW1lOiBnZXROb3coIHRydWUgKVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgLy8g5peg5YiZ5o+S5YWlXG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGF3YWl0IGRiLmNvbGxlY3Rpb24oJ2dvb2QtdmlzaXRpbmctcmVjb3JkJylcbiAgICAgICAgICAgICAgICAgICAgLmFkZCh7XG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcGlkLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9wZW5pZCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2aXNpdFRpbWU6IGdldE5vdyggdHJ1ZSApXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gY3R4LmJvZHkgPSB7XG4gICAgICAgICAgICAgICAgc3RhdHVzOiAyMDBcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBjYXRjaCggZSApIHtcbiAgICAgICAgICAgIHJldHVybiBjdHguYm9keSA9IHtcbiAgICAgICAgICAgICAgICBzdGF0dXM6IDUwMFxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSlcblxuICAgIC8qKiBcbiAgICAgKiBAZGVzY3JpcHRpb25cbiAgICAgKiDojrflj5bllYblk4HmtY/op4jorrDlvZXvvIjnlKjmiLfliJfooaggKyDlpLTlg4/vvIlcbiAgICAgKiBcbiAgICAgKiB7c3RhcnR9IOaXtumXtOaIs++8jOWcqOatpOS5i+WQjueahOiuv+mXruiusOW9lVxuICAgICAqIHtiZWZvcmV9IOaXtumXtOaIs++8jOWcqOatpOS5i+WJjeeahOiuv+mXruiusOW9lVxuICAgICAqIHtwaWR9IOWVhuWTgWlkXG4gICAgICogXG4gICAgICovXG4gICAgYXBwLnJvdXRlcignZ29vZC12aXNpdG9ycycsIGFzeW5jKCBjdHgsIG5leHQgKSA9PiB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBjb25zdCB7IHBpZCwgYmVmb3JlLCBzdGFydCB9ID0gZXZlbnQuZGF0YTtcbiAgICAgICAgICAgIGxldCBzZWFyY2g6IGFueSA9IHsgcGlkIH07XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGlmICggISFzdGFydCAmJiAhIWJlZm9yZSApIHtcbiAgICAgICAgICAgICAgICBzZWFyY2ggPSB7XG4gICAgICAgICAgICAgICAgICAgIC4uLnNlYXJjaCxcbiAgICAgICAgICAgICAgICAgICAgdmlzaXRUaW1lOiBfLmFuZCggXy5ndGUoIHN0YXJ0ICksIF8ubHQoIGJlZm9yZSApKVxuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9IGVsc2UgaWYgKCAhIXN0YXJ0ICYmICFiZWZvcmUgKSB7XG4gICAgICAgICAgICAgICAgc2VhcmNoID0ge1xuICAgICAgICAgICAgICAgICAgICAuLi5zZWFyY2gsXG4gICAgICAgICAgICAgICAgICAgIHZpc2l0VGltZTogXy5ndGUoIHN0YXJ0IClcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfSBlbHNlIGlmICggIXN0YXJ0ICYmICEhYmVmb3JlICkge1xuICAgICAgICAgICAgICAgIHNlYXJjaCA9IHtcbiAgICAgICAgICAgICAgICAgICAgLi4uc2VhcmNoLFxuICAgICAgICAgICAgICAgICAgICB2aXNpdFRpbWU6IF8ubHQoIGJlZm9yZSApXG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIFxuICAgICAgICAgICAgY29uc3QgdmlzaXRvcnMkID0gYXdhaXQgZGIuY29sbGVjdGlvbignZ29vZC12aXNpdGluZy1yZWNvcmQnKVxuICAgICAgICAgICAgICAgIC53aGVyZSggc2VhcmNoIClcbiAgICAgICAgICAgICAgICAub3JkZXJCeSgndmlzaXRUaW1lJywgJ2Rlc2MnKVxuICAgICAgICAgICAgICAgIC5nZXQoICk7XG4gICAgXG4gICAgICAgICAgICBjb25zdCB2aXNpdG9ycyA9IHZpc2l0b3JzJC5kYXRhO1xuICAgIFxuICAgICAgICAgICAgY29uc3QgdXNlcnMkID0gYXdhaXQgUHJvbWlzZS5hbGwoIHZpc2l0b3JzLm1hcCggYXN5bmMgdmlzaXRvciA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3QgdXNlciQgPSBhd2FpdCBkYi5jb2xsZWN0aW9uKCd1c2VyJylcbiAgICAgICAgICAgICAgICAgICAgLndoZXJlKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG9wZW5pZDogdmlzaXRvci5vcGVuaWRcbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgLmZpZWxkKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG9wZW5pZDogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIG5pY2tOYW1lOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICAgICAgYXZhdGFyVXJsOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAuZ2V0KCApO1xuICAgICAgICAgICAgICAgIGNvbnN0IHVzZXIgPSB1c2VyJC5kYXRhWyAwIF07XG4gICAgICAgICAgICAgICAgcmV0dXJuICEhdXNlciA/IHVzZXIgOiBudWxsO1xuICAgICAgICAgICAgfSkpO1xuICAgIFxuICAgICAgICAgICAgY29uc3QgdXNlcnMgPSB1c2VycyQuZmlsdGVyKCB4ID0+ICEheCApO1xuICAgICAgICAgICAgcmV0dXJuIGN0eC5ib2R5ID0ge1xuICAgICAgICAgICAgICAgIHN0YXR1czogMjAwLFxuICAgICAgICAgICAgICAgIGRhdGE6IHVzZXJzXG4gICAgICAgICAgICB9O1xuICAgICAgICB9IGNhdGNoKCBlICkge1xuICAgICAgICAgICAgcmV0dXJuIGN0eC5ib2R5ID0ge1xuICAgICAgICAgICAgICAgIHN0YXR1czogNTAwXG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgfSk7XG5cblxuICAgIHJldHVybiBhcHAuc2VydmUoICk7XG5cbn07Il19