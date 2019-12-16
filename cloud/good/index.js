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
            var _a, page, visitTime_1, limit, filterGoodIds, search$, search, where$, bjpConfig$, bjpConfig, total$, data$, standards_3, insertStandars, activities$_3, insertActivity, visitRecord_1, insertVisitRecord, e_3;
            var _this = this;
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
                            isDelete: _.neq(true),
                            _id: _.nor(filterGoodIds.map(function (x) { return _.eq(x); }))
                        };
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
                        return [4, Promise.all(insertActivity.map(function (x, k) { return __awaiter(_this, void 0, void 0, function () {
                                var pid, where$, goodVisitTotal$, goodVisitRecord$, users;
                                var _this = this;
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
                                                    .limit(5)
                                                    .get()];
                                        case 2:
                                            goodVisitRecord$ = _a.sent();
                                            return [4, Promise.all(goodVisitRecord$.data.map(function (record) { return __awaiter(_this, void 0, void 0, function () {
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
                                                    avatar: users
                                                }];
                                    }
                                });
                            }); }))];
                    case 6:
                        visitRecord_1 = _b.sent();
                        _b.label = 7;
                    case 7:
                        insertVisitRecord = insertActivity.map(function (x, k) { return (__assign({}, x, { visitRecord: visitRecord_1[k] })); });
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
                        return [2, ctx.body = { status: 500 }];
                    case 9: return [2];
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLGlCQXVtQ0U7O0FBdm1DRixxQ0FBdUM7QUFDdkMsc0NBQXdDO0FBRXhDLEtBQUssQ0FBQyxJQUFJLENBQUM7SUFDUCxHQUFHLEVBQUUsT0FBTyxDQUFDLEdBQUcsQ0FBQyxLQUFLO0NBQ3pCLENBQUMsQ0FBQztBQUVILElBQU0sRUFBRSxHQUFnQixLQUFLLENBQUMsUUFBUSxFQUFHLENBQUM7QUFDMUMsSUFBTSxDQUFDLEdBQUcsRUFBRSxDQUFDLE9BQU8sQ0FBQztBQVFyQixJQUFNLE1BQU0sR0FBRyxVQUFFLEVBQVU7SUFBVixtQkFBQSxFQUFBLFVBQVU7SUFDdkIsSUFBSyxFQUFFLEVBQUc7UUFDTixPQUFPLElBQUksQ0FBQyxHQUFHLEVBQUcsQ0FBQztLQUN0QjtJQUNELElBQU0sTUFBTSxHQUFHLElBQUksSUFBSSxDQUFFLElBQUksSUFBSSxFQUFHLENBQUMsY0FBYyxFQUFHLENBQUMsQ0FBQztJQUN4RCxPQUFPLElBQUksSUFBSSxDQUFFLE1BQU0sQ0FBQyxPQUFPLEVBQUcsR0FBRyxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxJQUFJLENBQUUsQ0FBQTtBQUM3RCxDQUFDLENBQUE7QUE2Q1ksUUFBQSxJQUFJLEdBQUcsVUFBUSxLQUFLLEVBQUUsT0FBTzs7OztRQUVoQyxHQUFHLEdBQUcsSUFBSSxTQUFTLENBQUMsRUFBRSxLQUFLLE9BQUEsRUFBRSxDQUFDLENBQUM7UUFRckMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxRQUFRLEVBQUUsVUFBTyxHQUFHLEVBQUUsSUFBSTs7Ozs7O3dCQUd2QixHQUFHLEdBQUcsS0FBSyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUM7d0JBQ3JCLE1BQU0sR0FBRyxLQUFLLENBQUMsUUFBUSxDQUFD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QU8sQ0FBQyxNQUFNOzZDQUN6QixDQUFDO2lEQUNELEtBQUssQ0FBQztnREFDSCxNQUFNLEVBQUUsSUFBSTtnREFDWixRQUFRLEVBQUUsSUFBSTtnREFDZCxTQUFTLEVBQUUsSUFBSTs2Q0FDbEIsQ0FBQztpREFDRCxHQUFHLEVBQUcsRUFBQTs7NENBVEwsS0FBSyxHQUFHLFNBU0g7NENBQ0wsSUFBSSxHQUFHLEtBQUssQ0FBQyxJQUFJLENBQUUsQ0FBQyxDQUFFLENBQUM7NENBQzdCLFdBQU8sQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUM7OztpQ0FDL0IsQ0FBQyxDQUFDLEVBQUE7O3dCQWJHLE1BQU0sR0FBRyxTQWFaO3dCQUVHLEtBQUssR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFFLFVBQUEsQ0FBQyxJQUFJLE9BQUEsQ0FBQyxDQUFDLENBQUMsRUFBSCxDQUFHLENBQUUsQ0FBQzt3QkFDeEMsV0FBTyxHQUFHLENBQUMsSUFBSSxHQUFHO2dDQUNkLE1BQU0sRUFBRSxHQUFHO2dDQUNYLElBQUksRUFBRSxLQUFLOzZCQUNkLEVBQUM7Ozt3QkFFRixXQUFPLEdBQUcsQ0FBQyxJQUFJLEdBQUc7Z0NBQ2QsTUFBTSxFQUFFLEdBQUc7NkJBQ2QsRUFBQzs7OzthQUVULENBQUMsQ0FBQztRQUdILFdBQU8sR0FBRyxDQUFDLEtBQUssRUFBRyxFQUFDOztLQUV2QixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgY2xvdWQgZnJvbSAnd3gtc2VydmVyLXNkayc7XG5pbXBvcnQgKiBhcyBUY2JSb3V0ZXIgZnJvbSAndGNiLXJvdXRlcic7XG5cbmNsb3VkLmluaXQoe1xuICAgIGVudjogcHJvY2Vzcy5lbnYuY2xvdWRcbn0pO1xuXG5jb25zdCBkYjogREIuRGF0YWJhc2UgPSBjbG91ZC5kYXRhYmFzZSggKTtcbmNvbnN0IF8gPSBkYi5jb21tYW5kO1xuXG4vKiogXG4gKiDovazmjaLmoLzmnpflsLzmsrvml7bljLogKzjml7bljLpcbiAqIERhdGUoKS5ub3coKSAvIG5ldyBEYXRlKCkuZ2V0VGltZSgpIOaYr+aXtuS4jeaXtuato+W4uOeahCs4XG4gKiBEYXRlLnRvTG9jYWxTdHJpbmcoICkg5aW95YOP5piv5LiA55u05pivKzDnmoRcbiAqIOWFiOaLv+WIsCArMO+8jOeEtuWQjis4XG4gKi9cbmNvbnN0IGdldE5vdyA9ICggdHMgPSBmYWxzZSApOiBhbnkgPT4ge1xuICAgIGlmICggdHMgKSB7XG4gICAgICAgIHJldHVybiBEYXRlLm5vdyggKTtcbiAgICB9XG4gICAgY29uc3QgdGltZV8wID0gbmV3IERhdGUoIG5ldyBEYXRlKCApLnRvTG9jYWxlU3RyaW5nKCApKTtcbiAgICByZXR1cm4gbmV3IERhdGUoIHRpbWVfMC5nZXRUaW1lKCApICsgOCAqIDYwICogNjAgKiAxMDAwIClcbn1cblxuLyoqXG4gKiBcbiAqIEBkZXNjcmlwdGlvbiBcbiAqIOWIm+W7ui/nvJbovpHllYblk4FcbiAqIHtcbiAqICAgICAgX2lkOiBpZFxuICogICAgICBpc0RlbGV0ZTog5piv5ZCm5Yig6ZmkXG4gKiAgICAgIHRpdGxlOiDllYblk4HlkI3np7AgU3RyaW5nXG4gKiAgICAgIGRldGFpbCE6IOWVhuWTgeaPj+i/sCBTdHJpbmdcbiAqICAgICAgdGFnOiDllYblk4HmoIfnrb4gQXJyYXk8U3RyaW5nPlxuICogICAgICBjYXRlZ29yeTog5ZWG5ZOB57G755uuIFN0cmluZ1xuICogICAgICBpbWc6IOWVhuWTgeWbvueJhyBBcnJheTxTdHJpbmc+XG4gKiAgICAgIHByaWNlOiDku7fmoLwgTnVtYmVyXG4gKiAgICAgIGZhZGVQcmljZTog5YiS57q/5Lu3IE51bWJlclxuICogICAgICBncm91cFByaWNlITog5Zui6LSt5Lu3IE51bWJlclxuICogICAgICBzdG9jayE6IOW6k+WtmCBOdW1iZXJcbiAqICAgICAgZGVwb3NpdFByaWNlITog5ZWG5ZOB6K6i6YeRIE51bWJlclxuICogICAgICBsaW1pdCE6IOmZkOi0reaVsOmHjyBOdW1iZXJcbiAqICAgICAgdmlzaWFibGU6IOaYr+WQpuS4iuaetiBCb29sZWFuXG4gKiAgICAgIHNhbGVkOiDplIDph48gTnVtYmVyXG4gKiAgICAgIHVwZGF0ZVRpbWVcbiAqISAgICAgIHN0YW5kYXJkcyE6IOWei+WPt+inhOagvCBBcnJheTx7IFxuICogICAgICAgICAgbmFtZTogU3RyaW5nLFxuICogICAgICAgICAgcHJpY2U6IE51bWJlcixcbiAqICAgICAgICAgIGdyb3VwUHJpY2UhOiBOdW1iZXIsXG4gKiAgICAgICAgICBzdG9jayE6IE51bWJlcjpcbiAqICAgICAgICAgIGltZzogU3RyaW5nICxcbiAqICAgICAgICAgIF9pZDogc3RyaW5nLFxuICogICAgICAgICAgcGlkOiBzdHJpbmcsXG4gKiAgICAgICAgICBpc0RlbGV0ZTogYm9vbGVhblxuICogICAgICB9PlxuICogfVxuICogXG4gKiBcbiAqIEBkZXNjcmlwdGlvblxuICog5ZWG5ZOB5rWP6KeI6K6w5b2VXG4gKiBcbiAqIHtcbiAqICAgcGlkXG4gKiAgIG9wZW5pZFxuICogICB2aXNpdFRpbWVcbiAqIH1cbiAqL1xuZXhwb3J0IGNvbnN0IG1haW4gPSBhc3luYyAoIGV2ZW50LCBjb250ZXh0ICkgPT4ge1xuXG4gICAgY29uc3QgYXBwID0gbmV3IFRjYlJvdXRlcih7IGV2ZW50IH0pO1xuXG4gICAgLyoqXG4gICAgICogQGRlc2NyaXB0aW9uXG4gICAgICog5ZWG5ZOB6K+m5oOFXG4gICAgICogLS0tLS0g6K+35rGCIC0tLS0tXG4gICAgICogX2lkXG4gICAgICovXG4gICAgYXBwLnJvdXRlcignZGV0YWlsJywgYXN5bmMoIGN0eCwgbmV4dCApID0+IHtcbiAgICAgICAgdHJ5IHtcblxuICAgICAgICAgICAgY29uc3QgX2lkID0gZXZlbnQuZGF0YS5faWQ7XG4gICAgICAgICAgICBjb25zdCBvcGVuaWQgPSBldmVudC51c2VySW5mby5vcGVuSWQ7XG5cbiAgICAgICAgICAgIC8vIOiOt+WPluaVsOaNrlxuICAgICAgICAgICAgY29uc3QgZGF0YSQgPSBhd2FpdCBkYi5jb2xsZWN0aW9uKCdnb29kcycpXG4gICAgICAgICAgICAgICAgLndoZXJlKHtcbiAgICAgICAgICAgICAgICAgICAgX2lkXG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAuZ2V0KCApO1xuXG4gICAgICAgICAgICAvLyDmi7zmjqXlnovlj7dcbiAgICAgICAgICAgIGNvbnN0IG1ldGFMaXN0ID0gZGF0YSQuZGF0YTtcbiAgICAgICAgICAgIGNvbnN0IHN0YW5kYXJkcyA9IGF3YWl0IFByb21pc2UuYWxsKCBtZXRhTGlzdC5tYXAoIHggPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiBkYi5jb2xsZWN0aW9uKCdzdGFuZGFyZHMnKVxuICAgICAgICAgICAgICAgICAgICAud2hlcmUoe1xuICAgICAgICAgICAgICAgICAgICAgICAgcGlkOiB4Ll9pZCxcbiAgICAgICAgICAgICAgICAgICAgICAgIGlzRGVsZXRlOiBmYWxzZVxuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAuZ2V0KCApO1xuICAgICAgICAgICAgfSkpO1xuXG4gICAgICAgICAgICAvLyDmi7zmjqXlnovlj7fmiJbllYblk4HmtLvliqhcbiAgICAgICAgICAgIGNvbnN0IGFjdGl2aXRpZXMkID0gYXdhaXQgZGIuY29sbGVjdGlvbignYWN0aXZpdHknKVxuICAgICAgICAgICAgICAgIC53aGVyZSh7XG4gICAgICAgICAgICAgICAgICAgIHBpZDogX2lkLFxuICAgICAgICAgICAgICAgICAgICBpc0Nsb3NlZDogZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgIGlzRGVsZXRlZDogZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgIHR5cGU6ICdnb29kX2Rpc2NvdW50JyxcbiAgICAgICAgICAgICAgICAgICAgZW5kVGltZTogXy5ndCggZ2V0Tm93KCB0cnVlICkpXG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAuZmllbGQoe1xuICAgICAgICAgICAgICAgICAgICBwaWQ6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgIHNpZDogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgdGl0bGU6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgIGFjX3ByaWNlOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICBlbmRUaW1lOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICBhY19ncm91cFByaWNlOiB0cnVlXG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAuZ2V0KCApO1xuXG4gICAgICAgICAgICBjb25zdCBpbnNlcnQgPSBtZXRhTGlzdC5tYXAoKCB4LCBrICkgPT4gT2JqZWN0LmFzc2lnbih7IH0sIHgsIHtcbiAgICAgICAgICAgICAgICBhY3Rpdml0aWVzOiBhY3Rpdml0aWVzJC5kYXRhLFxuICAgICAgICAgICAgICAgIHN0YW5kYXJkczogc3RhbmRhcmRzWyBrIF0uZGF0YVxuICAgICAgICAgICAgfSkpO1xuXG4gICAgICAgICAgICAvLyDliJvlu7rmtY/op4hcbiAgICAgICAgICAgIGF3YWl0IGNsb3VkLmNhbGxGdW5jdGlvbih7XG4gICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBvcGVuaWQsXG4gICAgICAgICAgICAgICAgICAgICAgICBwaWQ6IF9pZCxcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgJHVybDogJ3VwZGF0ZS1nb29kLXZpc2l0LXJlY29yZCdcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIG5hbWU6ICdnb29kJ1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHJldHVybiBjdHguYm9keSA9IHtcbiAgICAgICAgICAgICAgICBzdGF0dXM6IDIwMCxcbiAgICAgICAgICAgICAgICBkYXRhOiBpbnNlcnRbIDAgXVxuICAgICAgICAgICAgfTtcblxuICAgICAgICB9IGNhdGNoICggZSApIHtcbiAgICAgICAgICAgIHJldHVybiBjdHguYm9keSA9IHtcbiAgICAgICAgICAgICAgICBzdGF0dXM6IDUwMCxcbiAgICAgICAgICAgICAgICBtZXNzYWdlOiBlXG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICAvKipcbiAgICAgKiBAZGVzY3JpcHRpb24g5ZWG5ZOB6ZSA6YeP5o6S6KGM5qac5YiX6KGoXG4gICAgICogLS0tLS0tLS0g6K+35rGCIC0tLS0tLS0tLS1cbiAgICAgKiB7XG4gICAgICogICAgICBsaW1pdFxuICAgICAqICAgICAgc29ydDog5o6S5bqPXG4gICAgICogICAgICBwYWdlOiDpobXmlbBcbiAgICAgKiAgICAgIHNlYXJjaDog5pCc57SiXG4gICAgICogICAgICBjYXRlZ29yeTog5ZWG5ZOB57G755uuXG4gICAgICogfVxuICAgICAqIC0tLS0tLS0tLS0g6L+U5ZueIC0tLS0tLS0tXG4gICAgICoge1xuICAgICAqICAgICAgZGF0YTog5YiX6KGoXG4gICAgICogICAgICBwYWdlOiDpobXmlbBcbiAgICAgKiAgICAgIHRvdGFsOiDmgLvmlbBcbiAgICAgKiAgICAgIHRvdGFsUGFnZTog5oC76aG15pWwXG4gICAgICogICAgICBwYWdlU2l6ZTogMjBcbiAgICAgKiB9XG4gICAgICovXG4gICAgYXBwLnJvdXRlcigncmFuaycsIGFzeW5jKCBjdHgsIG5leHQgKSA9PiB7XG4gICAgICAgIHRyeSB7XG5cbiAgICAgICAgICAgIGxldCBianBDb25maWc6IGFueSA9IG51bGw7XG4gICAgICAgICAgICAvLyDmn6Xor6LmnaHmlbBcbiAgICAgICAgICAgIGNvbnN0IGxpbWl0ID0gZXZlbnQuZGF0YS5saW1pdCB8fCAyMDtcbiAgICAgICAgICAgIGNvbnN0IHsgY2F0ZWdvcnksIHNvcnQgfSA9IGV2ZW50LmRhdGE7XG4gICAgICAgICAgICBjb25zdCBzZWFyY2gkID0gZXZlbnQuZGF0YS5zZWFyY2ggfHwgJyc7XG4gICAgICAgICAgICBjb25zdCBzZWFyY2ggPSBuZXcgUmVnRXhwKCBzZWFyY2gkLnJlcGxhY2UoL1xccysvZywgXCJcIiksICdpJyk7XG5cbiAgICAgICAgICAgIGxldCB3aGVyZSQgPSB7XG4gICAgICAgICAgICAgICAgY2F0ZWdvcnksXG4gICAgICAgICAgICAgICAgdGl0bGU6IHNlYXJjaCxcbiAgICAgICAgICAgICAgICB2aXNpYWJsZTogdHJ1ZSxcbiAgICAgICAgICAgICAgICBpc0RlbGV0ZTogXy5uZXEoIHRydWUgKVxuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgLy8g5L+d5YGl5ZOB6YWN572uXG4gICAgICAgICAgICBjb25zdCBianBDb25maWckID0gYXdhaXQgZGIuY29sbGVjdGlvbignYXBwLWNvbmZpZycpXG4gICAgICAgICAgICAgICAgICAgIC53aGVyZSh7XG4gICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiAnYXBwLWJqcC12aXNpYmxlJ1xuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAuZ2V0KCApO1xuICAgICAgICAgICAgYmpwQ29uZmlnID0gYmpwQ29uZmlnJC5kYXRhWyAwIF07XG5cbiAgICAgICAgICAgIGlmICggIWNhdGVnb3J5ICYmICEhYmpwQ29uZmlnICYmICFianBDb25maWcudmFsdWUgKSB7XG4gICAgICAgICAgICAgICAgd2hlcmUkID0gT2JqZWN0LmFzc2lnbih7IH0sIHdoZXJlJCwge1xuICAgICAgICAgICAgICAgICAgICBjYXRlZ29yeTogXy5uZXEoJzQnKVxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIOiOt+WPluaAu+aVsFxuICAgICAgICAgICAgY29uc3QgdG90YWwkID0gYXdhaXQgZGIuY29sbGVjdGlvbignZ29vZHMnKVxuICAgICAgICAgICAgICAgIC53aGVyZSggd2hlcmUkIClcbiAgICAgICAgICAgICAgICAuY291bnQoICk7XG5cbiAgICAgICAgICAgIC8vIOiOt+WPluWVhuWTgeaVsOaNrlxuICAgICAgICAgICAgY29uc3QgZGF0YSQgPSBhd2FpdCBkYi5jb2xsZWN0aW9uKCdnb29kcycpXG4gICAgICAgICAgICAgICAgLndoZXJlKCB3aGVyZSQgKVxuICAgICAgICAgICAgICAgIC5saW1pdCggbGltaXQgKVxuICAgICAgICAgICAgICAgIC5za2lwKCggZXZlbnQuZGF0YS5wYWdlIC0gMSApICogbGltaXQgKVxuICAgICAgICAgICAgICAgIC5vcmRlckJ5KCBzb3J0IHx8ICdzYWxlZCcsICdkZXNjJylcbiAgICAgICAgICAgICAgICAuZ2V0KCApO1xuXG4gICAgICAgICAgICAvLyDojrflj5blnovlj7fmlbDmja5cbiAgICAgICAgICAgIGNvbnN0IHN0YW5kYXJkcyA9IGF3YWl0IFByb21pc2UuYWxsKCBkYXRhJC5kYXRhLm1hcCggeCA9PiB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGRiLmNvbGxlY3Rpb24oJ3N0YW5kYXJkcycpXG4gICAgICAgICAgICAgICAgICAgIC53aGVyZSh7XG4gICAgICAgICAgICAgICAgICAgICAgICBwaWQ6IHguX2lkLFxuICAgICAgICAgICAgICAgICAgICAgICAgaXNEZWxldGU6IGZhbHNlXG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgIC5nZXQoICk7XG4gICAgICAgICAgICB9KSk7XG5cbiAgICAgICAgICAgIGNvbnN0IGluc2VydFN0YW5kYXJzID0gZGF0YSQuZGF0YS5tYXAoKCB4LCBrICkgPT4gT2JqZWN0LmFzc2lnbih7IH0sIHgsIHtcbiAgICAgICAgICAgICAgICBzdGFuZGFyZHM6IHN0YW5kYXJkc1sgayBdLmRhdGFcbiAgICAgICAgICAgIH0pKTtcblxuICAgICAgICAgICAgLy8g6I635Y+W5rS75Yqo5pWw5o2u5pWw5o2uXG4gICAgICAgICAgICBjb25zdCBhY3Rpdml0aWVzJCA9IGF3YWl0IFByb21pc2UuYWxsKFxuICAgICAgICAgICAgICAgIGRhdGEkLmRhdGEubWFwKCBnb29kID0+IHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGRiLmNvbGxlY3Rpb24oJ2FjdGl2aXR5JylcbiAgICAgICAgICAgICAgICAgICAgICAgIC53aGVyZSh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcGlkOiBnb29kLl9pZCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpc0Nsb3NlZDogZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaXNEZWxldGVkOiBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiAnZ29vZF9kaXNjb3VudCcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZW5kVGltZTogXy5ndCggZ2V0Tm93KCB0cnVlICkpXG4gICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAgICAgLmdldCggKVxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICApO1xuXG4gICAgICAgICAgICBjb25zdCBpbnNlcnRBY3Rpdml0eSA9IGluc2VydFN0YW5kYXJzLm1hcCgoIHgsIGsgKSA9PiBPYmplY3QuYXNzaWduKHsgfSwgeCwge1xuICAgICAgICAgICAgICAgIGFjdGl2aXRpZXM6IGFjdGl2aXRpZXMkWyBrIF0uZGF0YVxuICAgICAgICAgICAgfSkpO1xuXG4gICAgICAgICAgICByZXR1cm4gY3R4LmJvZHkgPSB7XG4gICAgICAgICAgICAgICAgc3RhdHVzOiAyMDAsXG4gICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgICBkYXRhOiBpbnNlcnRBY3Rpdml0eSxcbiAgICAgICAgICAgICAgICAgICAgc2VhcmNoOiBzZWFyY2gkLnJlcGxhY2UoL1xccysvZywgJycpLFxuICAgICAgICAgICAgICAgICAgICBwYWdlbmF0aW9uOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBwYWdlU2l6ZTogbGltaXQsXG4gICAgICAgICAgICAgICAgICAgICAgICBwYWdlOiBldmVudC5kYXRhLnBhZ2UsXG4gICAgICAgICAgICAgICAgICAgICAgICB0b3RhbDogdG90YWwkLnRvdGFsLFxuICAgICAgICAgICAgICAgICAgICAgICAgdG90YWxQYWdlOiBNYXRoLmNlaWwoIHRvdGFsJC50b3RhbCAvIGxpbWl0IClcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICBcbiAgICAgICAgfSBjYXRjaCAoIGUgKSB7XG4gICAgICAgICAgICByZXR1cm4gY3R4LmJvZHkgPSB7XG4gICAgICAgICAgICAgICAgc3RhdHVzOiA1MDAsXG4gICAgICAgICAgICAgICAgbWVzc2FnZTogZVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICAvKiogXG4gICAgICogQGRlc2NyaXB0aW9uXG4gICAgICog5ou85Zui5bm/5Zy655qE5Y+v5ou85Zui5YiX6KGoXG4gICAgICogIC0tLS0tLS0tIOivt+axgiAtLS0tLS0tLS0tXG4gICAgICoge1xuICAgICAqICAgICAgcGFnZTog6aG15pWwXG4gICAgICogICAgICBzZWFyY2g6IOaQnOe0oixcbiAgICAgKiAgICAgIHZpc2l0VGltZTog5rWP6KeI5byA5aeL5pe26Ze077yM55So5LqO6I635Y+W6K6/5a6i5YiX6KGo77yMIOWPr+aXoFxuICAgICAqICAgICAgZmlsdGVyR29vZElkczog6L+H5ruk5oyH5a6a55qE5ZWG5ZOBIHN0cmluZyB8IHN0cmluZ1td77yM5Y+v5pegXG4gICAgICogfVxuICAgICAqL1xuICAgIGFwcC5yb3V0ZXIoJ3Bpbi1ncm91bmQnLCBhc3luYyggY3R4LCBuZXh0ICkgPT4ge1xuICAgICAgICB0cnkge1xuXG4gICAgICAgICAgICBjb25zdCB7IHBhZ2UsIHZpc2l0VGltZSB9ID0gZXZlbnQuZGF0YTtcbiAgICAgICAgICAgIGNvbnN0IGxpbWl0ID0gZXZlbnQuZGF0YS5saW1pdCB8fCAxMDtcbiAgICAgICAgICAgIGNvbnN0IGZpbHRlckdvb2RJZHMgPSBldmVudC5kYXRhLmZpbHRlckdvb2RJZHMgfHwgWyBdO1xuXG4gICAgICAgICAgICBjb25zdCBzZWFyY2gkID0gZXZlbnQuZGF0YS5zZWFyY2ggfHwgJyc7XG4gICAgICAgICAgICBjb25zdCBzZWFyY2ggPSBuZXcgUmVnRXhwKCBzZWFyY2gkLnJlcGxhY2UoL1xccysvZywgXCJcIiksICdpJyk7XG5cbiAgICAgICAgICAgIGxldCB3aGVyZSQgPSB7XG4gICAgICAgICAgICAgICAgdGl0bGU6IHNlYXJjaCxcbiAgICAgICAgICAgICAgICB2aXNpYWJsZTogdHJ1ZSxcbiAgICAgICAgICAgICAgICBpc0RlbGV0ZTogXy5uZXEoIHRydWUgKSxcbiAgICAgICAgICAgICAgICBfaWQ6IChfIGFzIGFueSkubm9yKCBmaWx0ZXJHb29kSWRzLm1hcCggeCA9PiBfLmVxKCB4ICkpKVxuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgLy8g5L+d5YGl5ZOB6YWN572uXG4gICAgICAgICAgICBjb25zdCBianBDb25maWckID0gYXdhaXQgZGIuY29sbGVjdGlvbignYXBwLWNvbmZpZycpXG4gICAgICAgICAgICAgICAgLndoZXJlKHtcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogJ2FwcC1ianAtdmlzaWJsZSdcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIC5nZXQoICk7XG4gICAgICAgICAgICBjb25zdCBianBDb25maWcgPSBianBDb25maWckLmRhdGFbIDAgXTtcblxuICAgICAgICAgICAgaWYgKCAhIWJqcENvbmZpZyAmJiAhYmpwQ29uZmlnLnZhbHVlICkge1xuICAgICAgICAgICAgICAgIHdoZXJlJCA9IE9iamVjdC5hc3NpZ24oeyB9LCB3aGVyZSQsIHtcbiAgICAgICAgICAgICAgICAgICAgY2F0ZWdvcnk6IF8ubmVxKCc0JylcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyDojrflj5bmgLvmlbBcbiAgICAgICAgICAgIGNvbnN0IHRvdGFsJCA9IGF3YWl0IGRiLmNvbGxlY3Rpb24oJ2dvb2RzJylcbiAgICAgICAgICAgICAgICAud2hlcmUoIHdoZXJlJCApXG4gICAgICAgICAgICAgICAgLmNvdW50KCApO1xuXG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIOi/memHjOayoeWvueWVhuWTgeOAgeWei+WPt1xuICAgICAgICAgICAgICog6L+b6KGMIGdyb3VwUHJpY2U6IF8uZ3QoIDAgKSBcbiAgICAgICAgICAgICAqIOeahOmZkOWItlxuICAgICAgICAgICAgICog5Y6f5Zug5piv5pyJ5Y+v6IO9YWN0aXZl5piv5pyJ5Zui6LSt5Lu355qEXG4gICAgICAgICAgICAgKi9cblxuICAgICAgICAgICAgLy8g6I635Y+W5ZWG5ZOB5pWw5o2uXG4gICAgICAgICAgICBjb25zdCBkYXRhJCA9IGF3YWl0IGRiLmNvbGxlY3Rpb24oJ2dvb2RzJylcbiAgICAgICAgICAgICAgICAud2hlcmUoIHdoZXJlJCApXG4gICAgICAgICAgICAgICAgLmxpbWl0KCBsaW1pdCApXG4gICAgICAgICAgICAgICAgLnNraXAoKCBwYWdlIC0gMSApICogbGltaXQgKVxuICAgICAgICAgICAgICAgIC5vcmRlckJ5KCAnc2FsZWQnLCAnZGVzYycpXG4gICAgICAgICAgICAgICAgLmdldCggKTtcblxuICAgICAgICAgICAgLy8g6I635Y+W5Z6L5Y+35pWw5o2uXG4gICAgICAgICAgICBjb25zdCBzdGFuZGFyZHMgPSBhd2FpdCBQcm9taXNlLmFsbCggZGF0YSQuZGF0YS5tYXAoIHggPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiBkYi5jb2xsZWN0aW9uKCdzdGFuZGFyZHMnKVxuICAgICAgICAgICAgICAgICAgICAud2hlcmUoe1xuICAgICAgICAgICAgICAgICAgICAgICAgcGlkOiB4Ll9pZCxcbiAgICAgICAgICAgICAgICAgICAgICAgIGlzRGVsZXRlOiBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgLmdldCggKTtcbiAgICAgICAgICAgIH0pKTtcblxuICAgICAgICAgICAgY29uc3QgaW5zZXJ0U3RhbmRhcnMgPSBkYXRhJC5kYXRhLm1hcCgoIHgsIGsgKSA9PiBPYmplY3QuYXNzaWduKHsgfSwgeCwge1xuICAgICAgICAgICAgICAgIHN0YW5kYXJkczogc3RhbmRhcmRzWyBrIF0uZGF0YVxuICAgICAgICAgICAgfSkpO1xuXG4gICAgICAgICAgICAvLyDojrflj5bmtLvliqjmlbDmja7mlbDmja5cbiAgICAgICAgICAgIGNvbnN0IGFjdGl2aXRpZXMkID0gYXdhaXQgUHJvbWlzZS5hbGwoXG4gICAgICAgICAgICAgICAgZGF0YSQuZGF0YS5tYXAoIGdvb2QgPT4ge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZGIuY29sbGVjdGlvbignYWN0aXZpdHknKVxuICAgICAgICAgICAgICAgICAgICAgICAgLndoZXJlKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwaWQ6IGdvb2QuX2lkLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlzQ2xvc2VkOiBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpc0RlbGV0ZWQ6IGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6ICdnb29kX2Rpc2NvdW50JyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbmRUaW1lOiBfLmd0KCBnZXROb3coIHRydWUgKSksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYWNfZ3JvdXBQcmljZTogXy5ndCggMCApXG4gICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAgICAgLmdldCggKVxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICApO1xuXG4gICAgICAgICAgICBjb25zdCBpbnNlcnRBY3Rpdml0eSA9IGluc2VydFN0YW5kYXJzLm1hcCgoIHgsIGsgKSA9PiBPYmplY3QuYXNzaWduKHsgfSwgeCwge1xuICAgICAgICAgICAgICAgIGFjdGl2aXRpZXM6IGFjdGl2aXRpZXMkWyBrIF0uZGF0YVxuICAgICAgICAgICAgfSkpO1xuXG4gICAgICAgICAgICAvLyDojrflj5bllYblk4Horr/lrqLorrDlvZVcbiAgICAgICAgICAgIGxldCB2aXNpdFJlY29yZDogYW55ID0gWyBdO1xuICAgICAgICAgICAgaWYgKCAhIXZpc2l0VGltZSApIHtcbiAgICAgICAgICAgICAgICB2aXNpdFJlY29yZCA9IGF3YWl0IFByb21pc2UuYWxsKFxuICAgICAgICAgICAgICAgICAgICBpbnNlcnRBY3Rpdml0eS5tYXAoIGFzeW5jICggeCwgayApID0+IHtcblxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgcGlkID0geC5faWQ7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHdoZXJlJCA9IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwaWQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmlzaXRUaW1lOiBfLmd0ZSggdmlzaXRUaW1lIClcbiAgICAgICAgICAgICAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGdvb2RWaXNpdFRvdGFsJCA9IGF3YWl0IGRiLmNvbGxlY3Rpb24oJ2dvb2QtdmlzaXRpbmctcmVjb3JkJylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAud2hlcmUoIHdoZXJlJCApXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLmNvdW50KCApO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBnb29kVmlzaXRSZWNvcmQkID0gYXdhaXQgZGIuY29sbGVjdGlvbignZ29vZC12aXNpdGluZy1yZWNvcmQnKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC53aGVyZSggd2hlcmUkIClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAubGltaXQoIDUgKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5nZXQoICk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHVzZXJzID0gYXdhaXQgUHJvbWlzZS5hbGwoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZ29vZFZpc2l0UmVjb3JkJC5kYXRhLm1hcCggYXN5bmMgcmVjb3JkID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgeyBvcGVuaWQgfSA9IHJlY29yZDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgdXNlciQgPSBhd2FpdCBkYi5jb2xsZWN0aW9uKCd1c2VyJylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC53aGVyZSh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb3BlbmlkXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLmZpZWxkKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhdmF0YXJVcmw6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmlja05hbWU6IHRydWVcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAuZ2V0KCApO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdXNlciQuZGF0YVsgMCBdXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZpc2l0b3JTdW06IGdvb2RWaXNpdFRvdGFsJC50b3RhbCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhdmF0YXI6IHVzZXJzXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgXG4gICAgICAgICAgICBjb25zdCBpbnNlcnRWaXNpdFJlY29yZCA9IGluc2VydEFjdGl2aXR5Lm1hcCgoIHgsIGsgKSA9PiAoe1xuICAgICAgICAgICAgICAgIC4uLngsXG4gICAgICAgICAgICAgICAgdmlzaXRSZWNvcmQ6IHZpc2l0UmVjb3JkWyBrIF1cbiAgICAgICAgICAgIH0pKVxuXG4gICAgICAgICAgICByZXR1cm4gY3R4LmJvZHkgPSB7XG4gICAgICAgICAgICAgICAgc3RhdHVzOiAyMDAsXG4gICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgICBkYXRhOiBpbnNlcnRWaXNpdFJlY29yZCxcbiAgICAgICAgICAgICAgICAgICAgcGFnZW5hdGlvbjoge1xuICAgICAgICAgICAgICAgICAgICAgICAgcGFnZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHBhZ2VTaXplOiBsaW1pdCxcbiAgICAgICAgICAgICAgICAgICAgICAgIHRvdGFsOiB0b3RhbCQudG90YWwsXG4gICAgICAgICAgICAgICAgICAgICAgICB0b3RhbFBhZ2U6IE1hdGguY2VpbCggdG90YWwkLnRvdGFsIC8gbGltaXQgKVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgIH0gY2F0Y2ggKCBlICkge1xuICAgICAgICAgICAgcmV0dXJuIGN0eC5ib2R5ID0geyBzdGF0dXM6IDUwMCB9O1xuICAgICAgICB9XG4gICAgfSlcblxuICAgIC8qKlxuICAgICAqIOWVhuWTgeWIl+ihqO+8iCDlkKtzdGFuZGFyZHPjgIFhY3Rpdml0aWVz5a2Q6KGo77yJXG4gICAgICoge1xuICAgICAqICAgIHRpdGxlXG4gICAgICogICAgc2VhcmNoIFxuICAgICAqICAgIHBhZ2VcbiAgICAgKiB9XG4gICAgICovXG4gICAgYXBwLnJvdXRlcignbGlzdCcsIGFzeW5jKCBjdHgsIG5leHQgKSA9PiB7XG4gICAgICAgIHRyeSB7XG4gICAgIFxuICAgICAgICAgICAgLy8g5p+l6K+i5p2h5pWwXG4gICAgICAgICAgICBjb25zdCBsaW1pdCA9IGV2ZW50LmRhdGEubGltaXQgfHwgMjA7XG5cbiAgICAgICAgICAgIC8vIOafpeivouadoeS7tlxuICAgICAgICAgICAgY29uc3Qgc2VhcmNoUmVxID0ge1xuICAgICAgICAgICAgICAgIHRpdGxlOiAoISFldmVudC5kYXRhLnRpdGxlICYmICEhZXZlbnQuZGF0YS50aXRsZS50cmltKCApKSA/IFxuICAgICAgICAgICAgICAgICAgICBuZXcgUmVnRXhwKGV2ZW50LmRhdGEudGl0bGUucmVwbGFjZSgvXFxzKy9nLCBcIlwiKSwgJ2knKSA6IG51bGxcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIGNvbnN0IHRlbXAgPSB7XG4gICAgICAgICAgICAgICAgaXNEZWxldGU6IF8ubmVxKCB0cnVlIClcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICBPYmplY3Qua2V5cyggc2VhcmNoUmVxICkubWFwKCBrZXkgPT4ge1xuICAgICAgICAgICAgICAgIGlmICggISFzZWFyY2hSZXFbIGtleSBdKSB7XG4gICAgICAgICAgICAgICAgICAgIHRlbXBbIGtleSBdID0gc2VhcmNoUmVxWyBrZXkgXTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgLy8g6I635Y+W5oC75pWwXG4gICAgICAgICAgICBjb25zdCB0b3RhbCQgPSBhd2FpdCBkYi5jb2xsZWN0aW9uKCdnb29kcycpXG4gICAgICAgICAgICAgICAgLndoZXJlKCB0ZW1wIClcbiAgICAgICAgICAgICAgICAuY291bnQoICk7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIC8vIOiOt+WPluaVsOaNrlxuICAgICAgICAgICAgY29uc3QgZGF0YSQgPSBhd2FpdCBkYi5jb2xsZWN0aW9uKCdnb29kcycpXG4gICAgICAgICAgICAgICAgLndoZXJlKCB0ZW1wIClcbiAgICAgICAgICAgICAgICAubGltaXQoIGxpbWl0IClcbiAgICAgICAgICAgICAgICAuc2tpcCgoIGV2ZW50LmRhdGEucGFnZSAtIDEgKSAqIGxpbWl0IClcbiAgICAgICAgICAgICAgICAub3JkZXJCeSgndXBkYXRlVGltZScsICdkZXNjJylcbiAgICAgICAgICAgICAgICAuZ2V0KCApO1xuXG4gICAgICAgICAgICBjb25zdCBtZXRhTGlzdCA9IGRhdGEkLmRhdGE7XG4gICAgICAgICAgICBjb25zdCBzdGFuZGFyZHMgPSBhd2FpdCBQcm9taXNlLmFsbCggbWV0YUxpc3QubWFwKCB4ID0+IHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZGIuY29sbGVjdGlvbignc3RhbmRhcmRzJylcbiAgICAgICAgICAgICAgICAgICAgLndoZXJlKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHBpZDogeC5faWQsXG4gICAgICAgICAgICAgICAgICAgICAgICBpc0RlbGV0ZTogZmFsc2VcbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgLmdldCggKTtcbiAgICAgICAgICAgIH0pKTtcblxuICAgICAgICAgICAgY29uc3QgaW5zZXJ0U3RhbmRhcnMgPSBtZXRhTGlzdC5tYXAoKCB4LCBrICkgPT4gT2JqZWN0LmFzc2lnbih7IH0sIHgsIHtcbiAgICAgICAgICAgICAgICBzdGFuZGFyZHM6IHN0YW5kYXJkc1sgayBdLmRhdGFcbiAgICAgICAgICAgIH0pKTtcbiAgIFxuICAgICAgICAgICAgLy8g5p+l6K+i6KKr5Yqg5YWl6LSt54mp6L2m5pWw6YePXG4gICAgICAgICAgICBjb25zdCBjYXJ0cyA9IGF3YWl0IFByb21pc2UuYWxsKCBpbnNlcnRTdGFuZGFycy5tYXAoIHggPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiBkYi5jb2xsZWN0aW9uKCdjYXJ0JylcbiAgICAgICAgICAgICAgICAgICAgICAgIC53aGVyZSh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcGlkOiB4Ll9pZFxuICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgICAgIC5jb3VudCggKTtcbiAgICAgICAgICAgIH0pKTtcblxuICAgICAgICAgICAgY29uc3QgaW5zZXJ0Q2FydCA9IGluc2VydFN0YW5kYXJzLm1hcCgoIHgsIGsgKSA9PiBPYmplY3QuYXNzaWduKHsgfSwgeCwge1xuICAgICAgICAgICAgICAgIGNhcnRzOiBjYXJ0c1sgayBdLnRvdGFsXG4gICAgICAgICAgICB9KSk7XG5cbiAgICAgICAgICAgIHJldHVybiBjdHguYm9keSA9IHtcbiAgICAgICAgICAgICAgICBzdGF0dXM6IDIwMCxcbiAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICAgIHNlYXJjaDogZXZlbnQuZGF0YS50aXRsZS5yZXBsYWNlKC9cXHMrL2csICcnKSxcbiAgICAgICAgICAgICAgICAgICAgcGFnZVNpemU6IGxpbWl0LFxuICAgICAgICAgICAgICAgICAgICBwYWdlOiBldmVudC5kYXRhLnBhZ2UsXG4gICAgICAgICAgICAgICAgICAgIGRhdGE6IGluc2VydENhcnQsXG4gICAgICAgICAgICAgICAgICAgIHRvdGFsOiB0b3RhbCQudG90YWwsXG4gICAgICAgICAgICAgICAgICAgIHRvdGFsUGFnZTogTWF0aC5jZWlsKCB0b3RhbCQudG90YWwgLyBsaW1pdCApXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfTtcblxuICAgICAgICB9IGNhdGNoICggZSApIHtcbiAgICAgICAgICAgIHJldHVybiBjdHguYm9keSA9IHtcbiAgICAgICAgICAgICAgICBzdGF0dXM6IDUwMCxcbiAgICAgICAgICAgICAgICBtZXNzYWdlOiBlXG4gICAgICAgICAgICB9XG4gICAgICAgIH0gXG4gICAgfSk7XG5cbiAgICBhcHAucm91dGVyKCdlZGl0JywgYXN5bmMoIGN0eCwgbmV4dCApID0+IHtcbiAgICAgICAgdHJ5IHtcblxuICAgICAgICAgICAgbGV0IF9pZCA9IGV2ZW50LmRhdGEuX2lkO1xuXG4gICAgICAgICAgICAvLyDliKTmlq3mmK/lkKbmnInlkIzlkI3llYblk4FcbiAgICAgICAgICAgIGNvbnN0IHsgdGl0bGUgfSA9IGV2ZW50LmRhdGE7XG4gICAgICAgICAgICBpZiAoICFfaWQgKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgY2hlY2sxJCA9IGF3YWl0IGRiLmNvbGxlY3Rpb24oJ2dvb2RzJylcbiAgICAgICAgICAgICAgICAud2hlcmUoe1xuICAgICAgICAgICAgICAgICAgICB0aXRsZSxcbiAgICAgICAgICAgICAgICAgICAgaXNEZWxldGU6IF8ubmVxKCB0cnVlIClcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIC5jb3VudCggKTtcblxuICAgICAgICAgICAgICAgIGlmICggY2hlY2sxJC50b3RhbCAhPT0gMCApIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGN0eC5ib2R5ID0ge1xuICAgICAgICAgICAgICAgICAgICAgICAgc3RhdHVzOiA1MDAsXG4gICAgICAgICAgICAgICAgICAgICAgICBtZXNzYWdlOiAn5a2Y5Zyo5ZCM5ZCN5ZWG5ZOBLOivt+ajgOafpSdcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICggIV9pZCApIHtcbiAgICAgICAgICAgICAgICAvLyDliJvlu7pcbiAgICAgICAgICAgICAgICBjb25zdCB7IHN0YW5kYXJkcyB9ID0gZXZlbnQuZGF0YTtcbiAgICBcbiAgICAgICAgICAgICAgICBkZWxldGUgZXZlbnQuZGF0YVsnc3RhbmRhcmRzJ107XG4gICAgXG4gICAgICAgICAgICAgICAgY29uc3QgY3JlYXRlJCA9IGF3YWl0IGRiLmNvbGxlY3Rpb24oJ2dvb2RzJykuYWRkKHtcbiAgICAgICAgICAgICAgICAgICAgZGF0YTogT2JqZWN0LmFzc2lnbih7IH0sIGV2ZW50LmRhdGEsIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlzRGVsZXRlOiBmYWxzZVxuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIF9pZCA9IGNyZWF0ZSQuX2lkO1xuICAgIFxuICAgICAgICAgICAgICAgIC8vIOaPkuWFpeWei+WPt1xuICAgICAgICAgICAgICAgIGlmICggISFzdGFuZGFyZHMgJiYgQXJyYXkuaXNBcnJheSggc3RhbmRhcmRzICkpIHtcbiAgICAgICAgICAgICAgICAgICAgYXdhaXQgUHJvbWlzZS5hbGwoIHN0YW5kYXJkcy5tYXAoIHggPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGRiLmNvbGxlY3Rpb24oJ3N0YW5kYXJkcycpLmFkZCh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YTogT2JqZWN0LmFzc2lnbih7IH0sIHgsIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGlkOiBfaWQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlzRGVsZXRlOiBmYWxzZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgfSkpXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICBcbiAgICAgICAgICAgICAgICAvLyDmm7TmlrBcbiAgICAgICAgICAgICAgICBjb25zdCBtZXRhID0geyAuLi5ldmVudC5kYXRhIH07XG4gICAgICAgICAgICAgICAgY29uc3Qgc3RhbmRhcmRzID0gbWV0YS5zdGFuZGFyZHM7XG5cbiAgICAgICAgICAgICAgICBkZWxldGUgbWV0YS5faWQ7XG4gICAgICAgICAgICAgICAgZGVsZXRlIGV2ZW50LmRhdGEuX2lkO1xuICAgICAgICAgICAgICAgIGRlbGV0ZSBldmVudC5kYXRhLnN0YW5kYXJkcztcblxuICAgICAgICAgICAgICAgIGF3YWl0IGRiLmNvbGxlY3Rpb24oJ2dvb2RzJylcbiAgICAgICAgICAgICAgICAgICAgLmRvYyggX2lkIClcbiAgICAgICAgICAgICAgICAgICAgLnNldCh7XG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLi4uZXZlbnQuZGF0YVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9KVxuICAgIFxuICAgICAgICAgICAgICAgIC8vIDAuIOafpeivouivpeS6p+WTgeW6leS4i+aJgOacieeahOWei+WPt1xuICAgICAgICAgICAgICAgIGNvbnN0IGFsbFN0YW5kYXJkcyQgPSBhd2FpdCBkYi5jb2xsZWN0aW9uKCdzdGFuZGFyZHMnKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLndoZXJlKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwaWQ6IF9pZFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5nZXQoICk7XG4gICAgXG4gICAgICAgICAgICAgICAgLy8g6ZyA6KaB4oCc5Yig6Zmk4oCd55qE5Z6L5Y+3XG4gICAgICAgICAgICAgICAgY29uc3Qgd291bGRTZXREZWxldGU6IGFueVsgXSA9IFsgXTtcbiAgICBcbiAgICAgICAgICAgICAgICAvLyDpnIDopoHigJzmm7TmlrDigJ3nmoTlnovlj7dcbiAgICAgICAgICAgICAgICBjb25zdCB3b3VsZFVwZGF0ZTogYW55WyBdID0gWyBdO1xuICAgIFxuICAgICAgICAgICAgICAgIC8vIOmcgOimgeKAnOWinuWKoOKAneOAgeKAnOabtOaWsOKAneeahOWei+WPt1xuICAgICAgICAgICAgICAgIGNvbnN0IHdvdWxkQ3JlYXRlID0gc3RhbmRhcmRzLmZpbHRlciggeCA9PiAheC5faWQgKTtcbiAgICBcbiAgICAgICAgICAgICAgICBhbGxTdGFuZGFyZHMkLmRhdGEuZmlsdGVyKCB4ID0+IHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCAhc3RhbmRhcmRzLmZpbmQoIHkgPT4geS5faWQgPT09IHguX2lkICkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHdvdWxkU2V0RGVsZXRlLnB1c2goIHggKVxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgd291bGRVcGRhdGUucHVzaCggeCApXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICBcbiAgICAgICAgICAgICAgICAvLyAxLiAg4oCc5Yig6Zmk4oCd6YOo5YiG5Z6L5Y+3XG4gICAgICAgICAgICAgICAgYXdhaXQgUHJvbWlzZS5hbGwoIHdvdWxkU2V0RGVsZXRlLm1hcCggeCA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBkYi5jb2xsZWN0aW9uKCdzdGFuZGFyZHMnKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5kb2MoIHguX2lkIClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAudXBkYXRlKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaXNEZWxldGU6IHRydWVcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgfSkpO1xuICAgIFxuICAgICAgICAgICAgICAgIC8vIDIuIOabtOaWsOmDqOWIhuWei+WPt+S/oeaBr1xuICAgICAgICAgICAgICAgIGF3YWl0IFByb21pc2UuYWxsKCB3b3VsZFVwZGF0ZS5tYXAoIHggPT4ge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBuZXdUYXJnZXQgPSBzdGFuZGFyZHMuZmluZCggeSA9PiB5Ll9pZCA9PT0geC5faWQgKTtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgeyBuYW1lLCBwcmljZSwgZ3JvdXBQcmljZSwgc3RvY2ssIGltZyB9ID0gbmV3VGFyZ2V0O1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZGIuY29sbGVjdGlvbignc3RhbmRhcmRzJylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAuZG9jKCB4Ll9pZCApXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLnVwZGF0ZSh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5hbWUsIHByaWNlLCBncm91cFByaWNlLCBzdG9jaywgaW1nXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIH0pKTtcbiAgICBcbiAgICAgICAgICAgICAgICAvLyAzLiDmlrDlop7pg6jliIblnovlj7dcbiAgICAgICAgICAgICAgICBhd2FpdCBQcm9taXNlLmFsbCggd291bGRDcmVhdGUubWFwKCB4ID0+IHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGRiLmNvbGxlY3Rpb24oJ3N0YW5kYXJkcycpLmFkZCh7XG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLi4ueCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwaWQ6IF9pZCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpc0RlbGV0ZTogZmFsc2VcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICB9KSk7XG4gICAgXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiBjdHguYm9keSA9IHtcbiAgICAgICAgICAgICAgICBkYXRhOiBfaWQsXG4gICAgICAgICAgICAgICAgc3RhdHVzOiAyMDBcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgfSBjYXRjaCAoIGUgKSB7XG4gICAgICAgICAgICByZXR1cm4gY3R4LmJvZHkgPSB7XG4gICAgICAgICAgICAgICAgc3RhdHVzOiA1MDAsXG4gICAgICAgICAgICAgICAgbWVzc2FnZTogZVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSlcblxuICAgIC8qKlxuICAgICAqIEBkZXNjcmlwdGlvblxuICAgICAqIOagueaNrumihOS7mOiuouWNleeahOebuOWFs+S/oeaBr++8jOWHj+WwkeOAgeabtOaWsOaMh+WumuWVhuWTgeeahOW6k+WtmFxuICAgICAqIC0tLS0tLS0tLS0g6K+35rGCIC0tLS0tLS0tLS0tXG4gICAgICoge1xuICAgICAqICAgICAgc2lkLFxuICAgICAqICAgICAgcGlkLFxuICAgICAqICAgICAgY291bnRcbiAgICAgKiB9XG4gICAgICovXG4gICAgYXBwLnJvdXRlcigndXBkYXRlLXN0b2NrJywgYXN5bmMoIGN0eCwgbmV4dCApID0+IHtcbiAgICAgICAgdHJ5IHtcblxuICAgICAgICAgICAgY29uc3QgeyBzaWQsIHBpZCwgY291bnQgfSA9IGV2ZW50LmRhdGE7XG5cbiAgICAgICAgICAgIGxldCB0YXJnZXQ6IGFueSA9IG51bGw7XG4gICAgICAgICAgICBjb25zdCB0YXJnZXRJZCA9IHNpZCB8fCBwaWQ7XG4gICAgICAgICAgICBjb25zdCBjb2xsZWN0aW9uTmFtZSA9ICEhc2lkID8gJ3N0YW5kYXJkcycgOiAnZ29vZHMnO1xuXG4gICAgICAgICAgICBjb25zdCBmaW5kJCA9IGF3YWl0IGRiLmNvbGxlY3Rpb24oIGNvbGxlY3Rpb25OYW1lIClcbiAgICAgICAgICAgICAgICAud2hlcmUoe1xuICAgICAgICAgICAgICAgICAgICBfaWQ6IHRhcmdldElkXG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAuZ2V0KCApO1xuXG4gICAgICAgICAgICBpZiAoIGZpbmQkLmRhdGEubGVuZ3RoID09PSAwICkge1xuICAgICAgICAgICAgICAgIHRocm93ICEhc2lkID8gJ+abtOaWsOW6k+WtmOW8guW4uCwg5b2T5YmN5Z6L5Y+35LiN5a2Y5ZyoJyA6ICfmm7TmlrDlupPlrZjlvILluLgsIOW9k+WJjeWVhuWTgeS4jeWtmOWcqCdcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGFyZ2V0ID0gZmluZCQuZGF0YVsgMCBdO1xuXG4gICAgICAgICAgICAvLyDml6DpmZDlupPlrZhcbiAgICAgICAgICAgIGlmICggdGFyZ2V0LnN0b2NrID09PSBudWxsIHx8IHRhcmdldC5zdG9jayA9PT0gdW5kZWZpbmVkICkge1xuICAgICAgICAgICAgICAgIHJldHVybiBjdHguYm9keSA9IHtcbiAgICAgICAgICAgICAgICAgICAgc3RhdHVzOiAyMDBcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIOWIpOaWreW6k+WtmOaYr+WQpui2s+Wkn1xuICAgICAgICAgICAgaWYgKCB0YXJnZXQuc3RvY2sgLSBjb3VudCA8IDAgKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgISFzaWQgPyAn5pu05paw5bqT5a2Y5byC5bi4LCDlvZPliY3lnovlj7flupPlrZjkuI3otrMnIDogJ+abtOaWsOW6k+WtmOW8guW4uCwg5b2T5YmN5ZWG5ZOB5bqT5a2Y5LiN6LazJztcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8g5pu05pawXG4gICAgICAgICAgICBhd2FpdCBkYi5jb2xsZWN0aW9uKCBjb2xsZWN0aW9uTmFtZSApLmRvYyggdGFyZ2V0SWQgKVxuICAgICAgICAgICAgICAgIC51cGRhdGUoe1xuICAgICAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzdG9jazogXy5pbmMoIC1jb3VudCApXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KVxuXG4gICAgICAgICAgICByZXR1cm4gY3R4LmJvZHkgPSB7XG4gICAgICAgICAgICAgICAgc3RhdHVzOiAyMDBcbiAgICAgICAgICAgIH1cblxuICAgICAgICB9IGNhdGNoICggZSApIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGAtLS0t44CQRXJyb3ItR29vZOOAkS0tLS3vvJoke0pTT04uc3RyaW5naWZ5KCBlICl9YCk7XG4gICAgICAgICAgICByZXR1cm4gY3R4LmJvZHkgPSB7IHN0YXR1czogNTAwLCBtZXNzYWdlOiBlIH07XG4gICAgICAgIH1cbiAgICB9KVxuXG4gICAgLyoqXG4gICAgICogQGRlc2NyaXB0aW9uXG4gICAgICog5a6i5oi356uv5pCc57Si5ZWG5ZOB5YiX6KGo77yIIOWIhuexu+aQnOaQnOOAgeaIluaWh+Wtl+aQnOaQnCDvvIlcbiAgICAgKiAhIHNlYXJjaCDkuI3kvJrmmK/nqbrlrZfnrKbkuLJcbiAgICAgKiB7XG4gICAgICogICAgc2VhcmNoLFxuICAgICAqICAgIHBhZ2UsXG4gICAgICogICAgY2F0ZWdvcnlcbiAgICAgKiB9XG4gICAgICovXG4gICAgYXBwLnJvdXRlcignY2xpZW50LXNlYXJjaCcsIGFzeW5jKCBjdHgsIG5leHQgKSA9PiB7XG4gICAgICAgIHRyeSB7XG5cbiAgICAgICAgICAgIC8vIOafpeivouadoeaVsFxuICAgICAgICAgICAgY29uc3QgbGltaXQgPSAxMDtcbiAgICAgICAgICAgIGxldCBianBDb25maWc6IGFueSA9IG51bGw7XG4gICAgICAgICAgICBjb25zdCBvcGVuaWQgPSBldmVudC51c2VySW5mby5vcGVuSWQ7XG4gICAgICAgICAgICBjb25zdCB7IHNlYXJjaCwgcGFnZSwgY2F0ZWdvcnkgfSA9IGV2ZW50LmRhdGE7XG5cbiAgICAgICAgICAgIGxldCBxdWVyeTogYW55ID0gbnVsbDtcblxuXG4gICAgICAgICAgICBpZiAoICEhY2F0ZWdvcnkgKSB7XG4gICAgICAgICAgICAgICAgcXVlcnkgPSBfLm9yKFtcbiAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgY2F0ZWdvcnksXG4gICAgICAgICAgICAgICAgICAgICAgICB2aXNpYWJsZTogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGlzRGVsZXRlOiBfLm5lcSggdHJ1ZSApXG4gICAgICAgICAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhdGVnb3J5LFxuICAgICAgICAgICAgICAgICAgICAgICAgdmlzaWFibGU6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgICAgICBpc0RlbGV0ZTogXy5uZXEoIHRydWUgKVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgXSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIOS/neWBpeWTgemFjee9rlxuICAgICAgICAgICAgY29uc3QgYmpwQ29uZmlnJCA9IGF3YWl0IGRiLmNvbGxlY3Rpb24oJ2FwcC1jb25maWcnKVxuICAgICAgICAgICAgICAgICAgICAud2hlcmUoe1xuICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogJ2FwcC1ianAtdmlzaWJsZSdcbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgLmdldCggKTtcbiAgICAgICAgICAgIGJqcENvbmZpZyA9IGJqcENvbmZpZyQuZGF0YVsgMCBdO1xuXG4gICAgICAgICAgICAvLyDmkJzntKLkuZ/opoHlsY/olL3kv53lgaXlk4FcbiAgICAgICAgICAgIC8vIOmdnueuoeeQhuS6uuWRmOaJjeWxj+iUvVxuICAgICAgICAgICAgaWYgKCAhIXNlYXJjaCApIHtcblxuICAgICAgICAgICAgICAgIGNvbnN0IGFkbWluQ2hlY2sgPSBhd2FpdCBkYi5jb2xsZWN0aW9uKCdtYW5hZ2VyLW1lbWJlcicpXG4gICAgICAgICAgICAgICAgICAgIC53aGVyZSh7XG4gICAgICAgICAgICAgICAgICAgICAgICBvcGVuaWRcbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgLmNvdW50KCApO1xuXG4gICAgICAgICAgICAgICAgbGV0IGNhdGVnb3J5RmlsdGVyID0gXy5uZXEoJzk5OTknKTtcblxuICAgICAgICAgICAgICAgIGlmICggISFianBDb25maWcgJiYgIWJqcENvbmZpZy52YWx1ZSAmJiBhZG1pbkNoZWNrLnRvdGFsID09PSAwICkge1xuICAgICAgICAgICAgICAgICAgICBjYXRlZ29yeUZpbHRlciA9IF8ubmVxKCc0JylcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAgICAgKiDmkJzntKLnuqzluqbvvJpcbiAgICAgICAgICAgICAgICAgKiDllYblk4HmoIfpophcbiAgICAgICAgICAgICAgICAgKiDor6bmg4VcbiAgICAgICAgICAgICAgICAgKiEg5qCH562+77yI5pyq5a6e546w77yJXG4gICAgICAgICAgICAgICAgKi9cbiAgICAgICAgICAgICAgICBxdWVyeSA9IF8ub3IoW1xuICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2aXNpYWJsZTogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGlzRGVsZXRlOiBfLm5lcSggdHJ1ZSApLFxuICAgICAgICAgICAgICAgICAgICAgICAgY2F0ZWdvcnk6IGNhdGVnb3J5RmlsdGVyLFxuICAgICAgICAgICAgICAgICAgICAgICAgdGl0bGU6IG5ldyBSZWdFeHAoIHNlYXJjaC5yZXBsYWNlKCAvXFxzKy9nLCAnJyApLCAnaScgKVxuICAgICAgICAgICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2aXNpYWJsZTogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGlzRGVsZXRlOiBfLm5lcSggdHJ1ZSApLFxuICAgICAgICAgICAgICAgICAgICAgICAgY2F0ZWdvcnk6IGNhdGVnb3J5RmlsdGVyLFxuICAgICAgICAgICAgICAgICAgICAgICAgZGV0YWlsOiBuZXcgUmVnRXhwKCBzZWFyY2gucmVwbGFjZSggL1xccysvZywgJycgKSwgJ2knIClcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIF0pO1xuXG4gICAgICAgICAgICB9XG5cblxuICAgICAgICAgICAgLy8g6I635Y+W5oC75pWwXG4gICAgICAgICAgICBjb25zdCB0b3RhbCQgPSBhd2FpdCBkYi5jb2xsZWN0aW9uKCdnb29kcycpXG4gICAgICAgICAgICAgICAgLndoZXJlKCBxdWVyeSApXG4gICAgICAgICAgICAgICAgLmNvdW50KCApO1xuXG4gICAgICAgICAgICAvLyDojrflj5bmlbDmja5cbiAgICAgICAgICAgIGNvbnN0IGRhdGEkID0gYXdhaXQgZGIuY29sbGVjdGlvbignZ29vZHMnKVxuICAgICAgICAgICAgICAgIC53aGVyZSggcXVlcnkgKVxuICAgICAgICAgICAgICAgIC5saW1pdCggbGltaXQgKVxuICAgICAgICAgICAgICAgIC5za2lwKCggcGFnZSAtIDEgKSAqIGxpbWl0IClcbiAgICAgICAgICAgICAgICAub3JkZXJCeSgnc2FsZWQnLCAnZGVzYycpXG4gICAgICAgICAgICAgICAgLmdldCggKTtcblxuICAgICAgICAgICAgLy8g5ou85o6l5Z6L5Y+35ZKM5ZWG5ZOB5rS75YqoXG4gICAgICAgICAgICBjb25zdCBhY3Rpdml0aWVzJCA9IGF3YWl0IFByb21pc2UuYWxsKCBkYXRhJC5kYXRhLm1hcCggZ29vZCA9PiB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGRiLmNvbGxlY3Rpb24oJ2FjdGl2aXR5JylcbiAgICAgICAgICAgICAgICAgICAgLndoZXJlKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHBpZDogZ29vZC5faWQsXG4gICAgICAgICAgICAgICAgICAgICAgICBpc0Nsb3NlZDogZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgICAgICBpc0RlbGV0ZWQ6IGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogJ2dvb2RfZGlzY291bnQnLFxuICAgICAgICAgICAgICAgICAgICAgICAgZW5kVGltZTogXy5ndCggZ2V0Tm93KCB0cnVlICkpXG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgIC5maWVsZCh7XG4gICAgICAgICAgICAgICAgICAgICAgICBwaWQ6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgICAgICBzaWQ6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgICAgICB0aXRsZTogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGFjX3ByaWNlOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICAgICAgZW5kVGltZTogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGFjX2dyb3VwUHJpY2U6IHRydWVcbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgLmdldCggKTtcbiAgICAgICAgICAgIH0pKTtcblxuICAgICAgICAgICAgY29uc3Qgc3RhbmRhcmRzJCA9IGF3YWl0IFByb21pc2UuYWxsKCBkYXRhJC5kYXRhLm1hcCggZ29vZCA9PiB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGRiLmNvbGxlY3Rpb24oJ3N0YW5kYXJkcycpXG4gICAgICAgICAgICAgICAgICAgIC53aGVyZSh7XG4gICAgICAgICAgICAgICAgICAgICAgICBwaWQ6IGdvb2QuX2lkLFxuICAgICAgICAgICAgICAgICAgICAgICAgaXNEZWxldGU6IGZhbHNlXG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgIC5nZXQoICk7XG4gICAgICAgICAgICB9KSk7XG5cbiAgICAgICAgICAgIGNvbnN0IGluc2VydEFjdGl2aXRpZXMgPSBkYXRhJC5kYXRhLm1hcCgoIG1ldGEsIGsgKSA9PiB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIE9iamVjdC5hc3NpZ24oeyB9LCBtZXRhLCB7XG4gICAgICAgICAgICAgICAgICAgIHN0YW5kYXJkczogc3RhbmRhcmRzJFsgayBdLmRhdGEsIFxuICAgICAgICAgICAgICAgICAgICBhY3Rpdml0eTogYWN0aXZpdGllcyRbIGsgXS5kYXRhLmxlbmd0aCA9PT0gMCA/IG51bGwgOiBhY3Rpdml0aWVzJFsgayBdLmRhdGFbIDAgXVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSlcblxuICAgICAgICAgICAgcmV0dXJuIGN0eC5ib2R5ID0ge1xuICAgICAgICAgICAgICAgIHN0YXR1czogMjAwLFxuICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgcGFnZSxcbiAgICAgICAgICAgICAgICAgICAgcGFnZVNpemU6IGxpbWl0LFxuICAgICAgICAgICAgICAgICAgICBkYXRhOiBpbnNlcnRBY3Rpdml0aWVzLFxuICAgICAgICAgICAgICAgICAgICB0b3RhbDogdG90YWwkLnRvdGFsLFxuICAgICAgICAgICAgICAgICAgICB0b3RhbFBhZ2U6IE1hdGguY2VpbCggdG90YWwkLnRvdGFsIC8gbGltaXQgKSxcbiAgICAgICAgICAgICAgICAgICAgc2VhcmNoOiAhIXNlYXJjaCA/IHNlYXJjaC5yZXBsYWNlKCAvXFxzKy9nLCAnJyApIDogdW5kZWZpbmVkXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfTtcblxuICAgICAgICB9IGNhdGNoICggZSApIHtcbiAgICAgICAgICAgIHJldHVybiBjdHguYm9keSA9IHsgc3RhdHVzOiA1MDAgfTtcbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgLyoqXG4gICAgICogQGRlc2NyaXB0aW9uXG4gICAgICog566h55CG56uvIOS4iuS4i+aetuWVhuWTgVxuICAgICAqIHtcbiAgICAgKiAgICBwaWQsXG4gICAgICogICAgdmlzaWFibGVcbiAgICAgKiB9XG4gICAgICovXG4gICAgYXBwLnJvdXRlcignc2V0LXZpc2lhYmxlJywgYXN5bmMoIGN0eCwgbmV4dCApID0+IHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGNvbnN0IHsgcGlkLCB2aXNpYWJsZSB9ID0gZXZlbnQuZGF0YTtcbiAgICAgICAgICAgIGF3YWl0IGRiLmNvbGxlY3Rpb24oJ2dvb2RzJylcbiAgICAgICAgICAgICAgICAuZG9jKCBwaWQgKVxuICAgICAgICAgICAgICAgIC51cGRhdGUoe1xuICAgICAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2aXNpYWJsZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHVwZGF0ZVRpbWU6IGdldE5vdyggdHJ1ZSApXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgcmV0dXJuIGN0eC5ib2R5ID0geyBzdGF0dXM6IDIwMCB9O1xuICAgICAgICAgICAgXG4gICAgICAgIH0gY2F0Y2ggKCBlICkge1xuICAgICAgICAgICAgcmV0dXJuIGN0eC5ib2R5ID0geyBzdGF0dXM6IDUwMCB9O1xuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICAvKipcbiAgICAgKiBAZGVzY3JpcHRpb25cbiAgICAgKiDliKDpmaTllYblk4FcbiAgICAgKiB7XG4gICAgICogICAgcGlkIFxuICAgICAqIH1cbiAgICAgKi9cbiAgICBhcHAucm91dGVyKCdkZWxldGUnLCBhc3luYyggY3R4LCBuZXh0ICkgPT4ge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgY29uc3QgeyBwaWQgfSA9IGV2ZW50LmRhdGE7XG4gICAgICAgICAgICBhd2FpdCBkYi5jb2xsZWN0aW9uKCdnb29kcycpXG4gICAgICAgICAgICAgICAgLmRvYyggU3RyaW5nKCBwaWQgKSlcbiAgICAgICAgICAgICAgICAudXBkYXRlKHtcbiAgICAgICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgICAgICAgaXNEZWxldGU6IHRydWVcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgcmV0dXJuIGN0eC5ib2R5ID0ge1xuICAgICAgICAgICAgICAgIGRhdGE6IHBpZCxcbiAgICAgICAgICAgICAgICBzdGF0dXM6IDIwMFxuICAgICAgICAgICAgfTtcblxuICAgICAgICB9IGNhdGNoICggZSApIHtcbiAgICAgICAgICAgIHJldHVybiBjdHguYm9keSA9IHsgc3RhdHVzOiA1MDAgfTtcbiAgICAgICAgfVxuICAgIH0pXG5cbiAgICAvKipcbiAgICAgKiBAZGVzY3JpcHRpb25cbiAgICAgKiDmjqjlub/np6/liIbllYblk4HnmoTmjpLooYzmppxcbiAgICAgKiB7XG4gICAgICogICAgICBwYWdlXG4gICAgICogfVxuICAgICAqL1xuICAgIGFwcC5yb3V0ZXIoJ3B1c2gtaW50ZWdyYWwtcmFuaycsIGFzeW5jKCBjdHgsIG5leHQgKSA9PiB7XG4gICAgICAgIHRyeSB7XG5cbiAgICAgICAgICAgIC8vIOafpeivouadoeaVsFxuICAgICAgICAgICAgY29uc3QgeyBwYWdlIH0gPSBldmVudC5kYXRhO1xuICAgICAgICAgICAgY29uc3QgbGltaXQgPSBldmVudC5kYXRhLmxpbWl0IHx8IDIwO1xuXG4gICAgICAgICAgICBjb25zdCB3aGVyZSQgPSB7XG4gICAgICAgICAgICAgICAgaXNEZWxldGU6IF8ubmVxKCB0cnVlICksXG4gICAgICAgICAgICAgICAgY2F0ZWdvcnk6IF8ub3IoIF8uZXEoJzAnKSwgXy5lcSgnMScpKVxuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgY29uc3QgdG90YWwkID0gYXdhaXQgZGIuY29sbGVjdGlvbignZ29vZHMnKVxuICAgICAgICAgICAgICAgIC53aGVyZSggd2hlcmUkIClcbiAgICAgICAgICAgICAgICAuY291bnQoICk7XG5cbiAgICAgICAgICAgIGNvbnN0IGRhdGEkID0gYXdhaXQgZGIuY29sbGVjdGlvbignZ29vZHMnKVxuICAgICAgICAgICAgICAgIC53aGVyZSggd2hlcmUkIClcbiAgICAgICAgICAgICAgICAubGltaXQoIGxpbWl0IClcbiAgICAgICAgICAgICAgICAuc2tpcCgoIHBhZ2UgLSAxICkgKiBsaW1pdCApXG4gICAgICAgICAgICAgICAgLm9yZGVyQnkoICdzYWxlZCcsICdkZXNjJylcbiAgICAgICAgICAgICAgICAub3JkZXJCeSggJ2ZhZGVQcmljZScsICdkZXNjJylcbiAgICAgICAgICAgICAgICAuZ2V0KCApO1xuXG4gICAgICAgICAgICAgICAgLy8g6I635Y+W5Z6L5Y+35pWw5o2uXG4gICAgICAgICAgICBjb25zdCBzdGFuZGFyZHMgPSBhd2FpdCBQcm9taXNlLmFsbCggZGF0YSQuZGF0YS5tYXAoIHggPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiBkYi5jb2xsZWN0aW9uKCdzdGFuZGFyZHMnKVxuICAgICAgICAgICAgICAgICAgICAud2hlcmUoe1xuICAgICAgICAgICAgICAgICAgICAgICAgcGlkOiB4Ll9pZCxcbiAgICAgICAgICAgICAgICAgICAgICAgIGlzRGVsZXRlOiBmYWxzZVxuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAuZ2V0KCApO1xuICAgICAgICAgICAgfSkpO1xuXG4gICAgICAgICAgICBjb25zdCBpbnNlcnRTdGFuZGFycyA9IGRhdGEkLmRhdGEubWFwKCggeCwgayApID0+IE9iamVjdC5hc3NpZ24oeyB9LCB4LCB7XG4gICAgICAgICAgICAgICAgc3RhbmRhcmRzOiBzdGFuZGFyZHNbIGsgXS5kYXRhXG4gICAgICAgICAgICB9KSk7XG5cbiAgICAgICAgICAgIC8vIOiOt+WPlua0u+WKqOaVsOaNruaVsOaNrlxuICAgICAgICAgICAgY29uc3QgYWN0aXZpdGllcyQgPSBhd2FpdCBQcm9taXNlLmFsbChcbiAgICAgICAgICAgICAgICBkYXRhJC5kYXRhLm1hcCggZ29vZCA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBkYi5jb2xsZWN0aW9uKCdhY3Rpdml0eScpXG4gICAgICAgICAgICAgICAgICAgICAgICAud2hlcmUoe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBpZDogZ29vZC5faWQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaXNDbG9zZWQ6IGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlzRGVsZXRlZDogZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogJ2dvb2RfZGlzY291bnQnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVuZFRpbWU6IF8uZ3QoIGdldE5vdyggdHJ1ZSApKVxuICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgICAgIC5nZXQoIClcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgKTtcblxuICAgICAgICAgICAgY29uc3QgaW5zZXJ0QWN0aXZpdHkgPSBpbnNlcnRTdGFuZGFycy5tYXAoKCB4LCBrICkgPT4gT2JqZWN0LmFzc2lnbih7IH0sIHgsIHtcbiAgICAgICAgICAgICAgICBhY3Rpdml0aWVzOiBhY3Rpdml0aWVzJFsgayBdLmRhdGFcbiAgICAgICAgICAgIH0pKTtcblxuICAgICAgICAgICAgcmV0dXJuIGN0eC5ib2R5ID0ge1xuICAgICAgICAgICAgICAgIHN0YXR1czogMjAwLFxuICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgZGF0YTogaW5zZXJ0QWN0aXZpdHksXG4gICAgICAgICAgICAgICAgICAgIHBhZ2VuYXRpb246IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHBhZ2UsXG4gICAgICAgICAgICAgICAgICAgICAgICBwYWdlU2l6ZTogbGltaXQsXG4gICAgICAgICAgICAgICAgICAgICAgICB0b3RhbDogdG90YWwkLnRvdGFsLFxuICAgICAgICAgICAgICAgICAgICAgICAgdG90YWxQYWdlOiBNYXRoLmNlaWwoIHRvdGFsJC50b3RhbCAvIGxpbWl0IClcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgfSBjYXRjaCAoIGUgKSB7XG4gICAgICAgICAgICByZXR1cm4gY3R4LmJvZHkgPSB7XG4gICAgICAgICAgICAgICAgc3RhdHVzOiA1MDBcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0pXG5cbiAgICAvKipcbiAgICAgKiBAZGVzY3JpcHRpb25cbiAgICAgKiDmm7TmlrDlvZPliY3nlKjmiLfnmoTllYblk4HmtY/op4jljoblj7JcbiAgICAgKiBcbiAgICAgKiBAYm9keSB7b3BlbmlkfVxuICAgICAqIEBib2R5IHtwaWR9IOWVhuWTgUlEXG4gICAgICovXG4gICAgYXBwLnJvdXRlcigndXBkYXRlLWdvb2QtdmlzaXQtcmVjb3JkJywgYXN5bmMoIGN0eCwgbmV4dCApID0+IHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGNvbnN0IHsgcGlkIH0gPSBldmVudC5kYXRhO1xuICAgICAgICAgICAgY29uc3Qgb3BlbmlkID0gZXZlbnQuZGF0YS5vcGVuSWQgfHwgZXZlbnQuZGF0YS5vcGVuaWQgfHwgZXZlbnQudXNlckluZm8ub3BlbklkO1xuXG4gICAgICAgICAgICAvLyDmn6Xmib7ml6fnmoTorrDlvZVcbiAgICAgICAgICAgIGNvbnN0IHJlY29yZCQgPSBhd2FpdCBkYi5jb2xsZWN0aW9uKCdnb29kLXZpc2l0aW5nLXJlY29yZCcpXG4gICAgICAgICAgICAgICAgLndoZXJlKHtcbiAgICAgICAgICAgICAgICAgICAgcGlkLFxuICAgICAgICAgICAgICAgICAgICBvcGVuaWRcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIC5nZXQoICk7XG4gICAgICAgICAgICBjb25zdCByZWNvcmQgPSByZWNvcmQkLmRhdGFbIDAgXTtcblxuICAgICAgICAgICAgLy8g5pyJ5YiZ5pu05pawXG4gICAgICAgICAgICBpZiAoICEhcmVjb3JkICkge1xuICAgICAgICAgICAgICAgIGF3YWl0IGRiLmNvbGxlY3Rpb24oJ2dvb2QtdmlzaXRpbmctcmVjb3JkJylcbiAgICAgICAgICAgICAgICAgICAgLmRvYyggU3RyaW5nKCByZWNvcmQuX2lkICkpXG4gICAgICAgICAgICAgICAgICAgIC51cGRhdGUoe1xuICAgICAgICAgICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZpc2l0VGltZTogZ2V0Tm93KCB0cnVlIClcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC8vIOaXoOWImeaPkuWFpVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBhd2FpdCBkYi5jb2xsZWN0aW9uKCdnb29kLXZpc2l0aW5nLXJlY29yZCcpXG4gICAgICAgICAgICAgICAgICAgIC5hZGQoe1xuICAgICAgICAgICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBpZCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvcGVuaWQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmlzaXRUaW1lOiBnZXROb3coIHRydWUgKVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIGN0eC5ib2R5ID0ge1xuICAgICAgICAgICAgICAgIHN0YXR1czogMjAwXG4gICAgICAgICAgICB9XG4gICAgICAgIH0gY2F0Y2goIGUgKSB7XG4gICAgICAgICAgICByZXR1cm4gY3R4LmJvZHkgPSB7XG4gICAgICAgICAgICAgICAgc3RhdHVzOiA1MDBcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0pXG5cbiAgICAvKiogXG4gICAgICogQGRlc2NyaXB0aW9uXG4gICAgICog6I635Y+W5ZWG5ZOB5rWP6KeI6K6w5b2V77yI55So5oi35YiX6KGoICsg5aS05YOP77yJXG4gICAgICogXG4gICAgICoge3N0YXJ0fSDml7bpl7TmiLPvvIzlnKjmraTkuYvlkI7nmoTorr/pl67orrDlvZVcbiAgICAgKiB7YmVmb3JlfSDml7bpl7TmiLPvvIzlnKjmraTkuYvliY3nmoTorr/pl67orrDlvZVcbiAgICAgKiB7cGlkfSDllYblk4FpZFxuICAgICAqIFxuICAgICAqL1xuICAgIGFwcC5yb3V0ZXIoJ2dvb2QtdmlzaXRvcnMnLCBhc3luYyggY3R4LCBuZXh0ICkgPT4ge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgY29uc3QgeyBwaWQsIGJlZm9yZSwgc3RhcnQgfSA9IGV2ZW50LmRhdGE7XG4gICAgICAgICAgICBsZXQgc2VhcmNoOiBhbnkgPSB7IHBpZCB9O1xuICAgICAgICAgICAgXG4gICAgICAgICAgICBpZiAoICEhc3RhcnQgJiYgISFiZWZvcmUgKSB7XG4gICAgICAgICAgICAgICAgc2VhcmNoID0ge1xuICAgICAgICAgICAgICAgICAgICAuLi5zZWFyY2gsXG4gICAgICAgICAgICAgICAgICAgIHZpc2l0VGltZTogXy5hbmQoIF8uZ3RlKCBzdGFydCApLCBfLmx0KCBiZWZvcmUgKSlcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfSBlbHNlIGlmICggISFzdGFydCAmJiAhYmVmb3JlICkge1xuICAgICAgICAgICAgICAgIHNlYXJjaCA9IHtcbiAgICAgICAgICAgICAgICAgICAgLi4uc2VhcmNoLFxuICAgICAgICAgICAgICAgICAgICB2aXNpdFRpbWU6IF8uZ3RlKCBzdGFydCApXG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoICFzdGFydCAmJiAhIWJlZm9yZSApIHtcbiAgICAgICAgICAgICAgICBzZWFyY2ggPSB7XG4gICAgICAgICAgICAgICAgICAgIC4uLnNlYXJjaCxcbiAgICAgICAgICAgICAgICAgICAgdmlzaXRUaW1lOiBfLmx0KCBiZWZvcmUgKVxuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGNvbnN0IHZpc2l0b3JzJCA9IGF3YWl0IGRiLmNvbGxlY3Rpb24oJ2dvb2QtdmlzaXRpbmctcmVjb3JkJylcbiAgICAgICAgICAgICAgICAud2hlcmUoIHNlYXJjaCApXG4gICAgICAgICAgICAgICAgLmdldCggKTtcbiAgICBcbiAgICAgICAgICAgIGNvbnN0IHZpc2l0b3JzID0gdmlzaXRvcnMkLmRhdGE7XG4gICAgXG4gICAgICAgICAgICBjb25zdCB1c2VycyQgPSBhd2FpdCBQcm9taXNlLmFsbCggdmlzaXRvcnMubWFwKCBhc3luYyB2aXNpdG9yID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCB1c2VyJCA9IGF3YWl0IGRiLmNvbGxlY3Rpb24oJ3VzZXInKVxuICAgICAgICAgICAgICAgICAgICAud2hlcmUoe1xuICAgICAgICAgICAgICAgICAgICAgICAgb3BlbmlkOiB2aXNpdG9yLm9wZW5pZFxuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAuZmllbGQoe1xuICAgICAgICAgICAgICAgICAgICAgICAgb3BlbmlkOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICAgICAgbmlja05hbWU6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgICAgICBhdmF0YXJVcmw6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgIC5nZXQoICk7XG4gICAgICAgICAgICAgICAgY29uc3QgdXNlciA9IHVzZXIkLmRhdGFbIDAgXTtcbiAgICAgICAgICAgICAgICByZXR1cm4gISF1c2VyID8gdXNlciA6IG51bGw7XG4gICAgICAgICAgICB9KSk7XG4gICAgXG4gICAgICAgICAgICBjb25zdCB1c2VycyA9IHVzZXJzJC5maWx0ZXIoIHggPT4gISF4ICk7XG4gICAgICAgICAgICByZXR1cm4gY3R4LmJvZHkgPSB7XG4gICAgICAgICAgICAgICAgc3RhdHVzOiAyMDAsXG4gICAgICAgICAgICAgICAgZGF0YTogdXNlcnNcbiAgICAgICAgICAgIH07XG4gICAgICAgIH0gY2F0Y2goIGUgKSB7XG4gICAgICAgICAgICByZXR1cm4gY3R4LmJvZHkgPSB7XG4gICAgICAgICAgICAgICAgc3RhdHVzOiA1MDBcbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICB9KTtcblxuXG4gICAgcmV0dXJuIGFwcC5zZXJ2ZSggKTtcblxufTsiXX0=