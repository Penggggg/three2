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
        app.router('detail', function (ctx, next) { return __awaiter(_this, void 0, void 0, function () {
            var _id, data$, metaList, standards_1, activities$_1, insert, e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 4, , 5]);
                        _id = event.data._id;
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
                                type: 'good_discount'
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
                        return [2, ctx.body = {
                                status: 200,
                                data: insert[0]
                            }];
                    case 4:
                        e_1 = _a.sent();
                        return [2, ctx.body = {
                                status: 500,
                                message: e_1
                            }];
                    case 5: return [2];
                }
            });
        }); });
        app.router('rank', function (ctx, next) { return __awaiter(_this, void 0, void 0, function () {
            var limit, _a, category, sort, search$, search, total$, data$, standards_2, insertStandars, activities$_2, insertActivity, e_2;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 5, , 6]);
                        limit = event.data.limit || 20;
                        _a = event.data, category = _a.category, sort = _a.sort;
                        search$ = event.data.search || '';
                        search = new RegExp(search$.replace(/\s+/g, ""), 'i');
                        return [4, db.collection('goods')
                                .where({
                                category: category,
                                title: search,
                                isDelete: _.neq(true)
                            })
                                .count()];
                    case 1:
                        total$ = _b.sent();
                        return [4, db.collection('goods')
                                .where({
                                category: category,
                                title: search,
                                isDelete: _.neq(true)
                            })
                                .limit(limit)
                                .skip((event.data.page - 1) * limit)
                                .orderBy(sort || 'saled', 'desc')
                                .get()];
                    case 2:
                        data$ = _b.sent();
                        return [4, Promise.all(data$.data.map(function (x) {
                                return db.collection('standards')
                                    .where({
                                    pid: x._id,
                                    isDelete: false
                                })
                                    .get();
                            }))];
                    case 3:
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
                                    endTime: _.gt(new Date().getTime())
                                })
                                    .get();
                            }))];
                    case 4:
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
                    case 5:
                        e_2 = _b.sent();
                        return [2, ctx.body = {
                                status: 500,
                                message: e_2
                            }];
                    case 6: return [2];
                }
            });
        }); });
        app.router('list', function (ctx, next) { return __awaiter(_this, void 0, void 0, function () {
            var limit, searchReq_1, temp_1, total$, data$, metaList, standards_3, insertStandars, carts_1, insertCart, e_3;
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
                        standards_3 = _a.sent();
                        insertStandars = metaList.map(function (x, k) { return Object.assign({}, x, {
                            standards: standards_3[k].data
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
                        e_3 = _a.sent();
                        return [2, ctx.body = {
                                status: 500,
                                message: e_3
                            }];
                    case 6: return [2];
                }
            });
        }); });
        app.router('edit', function (ctx, next) { return __awaiter(_this, void 0, void 0, function () {
            var _id_1, title, check1$, standards, create$, meta, title_1, category, depositPrice, detail, fadePrice, img, limit, standards_4, tag, updateTime, visiable, price, groupPrice, stock, saled, allStandards$, wouldSetDelete_1, wouldUpdate_1, wouldCreate, e_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 12, , 13]);
                        _id_1 = event.data._id;
                        title = event.data.title;
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
                        if (!!_id_1) return [3, 5];
                        standards = event.data.standards;
                        delete event.data['standards'];
                        return [4, db.collection('goods').add({
                                data: Object.assign({}, event.data, {
                                    isDelete: false
                                })
                            })];
                    case 2:
                        create$ = _a.sent();
                        _id_1 = create$._id;
                        if (!(!!standards && Array.isArray(standards))) return [3, 4];
                        return [4, Promise.all(standards.map(function (x) {
                                return db.collection('standards').add({
                                    data: Object.assign({}, x, {
                                        pid: _id_1,
                                        isDelete: false
                                    })
                                });
                            }))];
                    case 3:
                        _a.sent();
                        _a.label = 4;
                    case 4: return [3, 11];
                    case 5:
                        meta = Object.assign({}, event.data);
                        delete meta[_id_1];
                        title_1 = meta.title, category = meta.category, depositPrice = meta.depositPrice, detail = meta.detail, fadePrice = meta.fadePrice, img = meta.img, limit = meta.limit, standards_4 = meta.standards, tag = meta.tag, updateTime = meta.updateTime, visiable = meta.visiable, price = meta.price, groupPrice = meta.groupPrice, stock = meta.stock, saled = meta.saled;
                        return [4, db.collection('goods').doc(_id_1).update({
                                data: {
                                    tag: tag,
                                    img: img,
                                    stock: stock,
                                    price: price,
                                    limit: limit,
                                    title: title_1,
                                    detail: detail,
                                    saled: saled,
                                    groupPrice: groupPrice,
                                    category: category,
                                    fadePrice: fadePrice,
                                    visiable: visiable,
                                    updateTime: updateTime,
                                    depositPrice: depositPrice
                                }
                            })];
                    case 6:
                        _a.sent();
                        return [4, db.collection('standards')
                                .where({
                                pid: _id_1
                            })
                                .get()];
                    case 7:
                        allStandards$ = _a.sent();
                        wouldSetDelete_1 = [];
                        wouldUpdate_1 = [];
                        wouldCreate = standards_4.filter(function (x) { return !x._id; });
                        allStandards$.data.filter(function (x) {
                            if (!standards_4.find(function (y) { return y._id === x._id; })) {
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
                    case 8:
                        _a.sent();
                        return [4, Promise.all(wouldUpdate_1.map(function (x) {
                                var newTarget = standards_4.find(function (y) { return y._id === x._id; });
                                var name = newTarget.name, price = newTarget.price, groupPrice = newTarget.groupPrice, stock = newTarget.stock, img = newTarget.img;
                                return db.collection('standards')
                                    .doc(x._id)
                                    .update({
                                    data: {
                                        name: name, price: price, groupPrice: groupPrice, stock: stock, img: img
                                    }
                                });
                            }))];
                    case 9:
                        _a.sent();
                        return [4, Promise.all(wouldCreate.map(function (x) {
                                return db.collection('standards').add({
                                    data: Object.assign({}, x, {
                                        pid: _id_1,
                                        isDelete: false
                                    })
                                });
                            }))];
                    case 10:
                        _a.sent();
                        _a.label = 11;
                    case 11: return [2, ctx.body = {
                            data: _id_1,
                            status: 200
                        }];
                    case 12:
                        e_4 = _a.sent();
                        return [2, ctx.body = {
                                status: 500,
                                message: e_4
                            }];
                    case 13: return [2];
                }
            });
        }); });
        app.router('update-stock', function (ctx, next) { return __awaiter(_this, void 0, void 0, function () {
            var _a, sid, pid, count, target, targetId, collectionName, find$, e_5;
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
                        e_5 = _b.sent();
                        console.log("----\u3010Error-Good\u3011----\uFF1A" + JSON.stringify(e_5));
                        return [2, ctx.body = { status: 500, message: e_5 }];
                    case 4: return [2];
                }
            });
        }); });
        app.router('client-search', function (ctx, next) { return __awaiter(_this, void 0, void 0, function () {
            var limit, _a, search, page, category, query, total$, data$, activities$_3, insertActivities, e_6;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 4, , 5]);
                        limit = 10;
                        _a = event.data, search = _a.search, page = _a.page, category = _a.category;
                        query = null;
                        if (!!search) {
                            query = _.or([
                                {
                                    visiable: true,
                                    isDelete: _.neq(true),
                                    title: new RegExp(search.replace(/\s+/g, ''), 'i')
                                }, {
                                    visiable: true,
                                    isDelete: _.neq(true),
                                    detail: new RegExp(search.replace(/\s+/g, ''), 'i')
                                }
                            ]);
                        }
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
                        return [4, db.collection('goods')
                                .where(query)
                                .count()];
                    case 1:
                        total$ = _b.sent();
                        return [4, db.collection('goods')
                                .where(query)
                                .limit(limit)
                                .skip((page - 1) * limit)
                                .orderBy('saled', 'desc')
                                .get()];
                    case 2:
                        data$ = _b.sent();
                        return [4, Promise.all(data$.data.map(function (good) {
                                return db.collection('activity')
                                    .where({
                                    pid: good._id,
                                    isClosed: false,
                                    isDeleted: false,
                                    type: 'good_discount'
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
                    case 3:
                        activities$_3 = _b.sent();
                        insertActivities = data$.data.map(function (meta, k) {
                            return Object.assign({}, meta, {
                                activity: activities$_3[k].data.length === 0 ? null : activities$_3[k].data[0]
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
                    case 4:
                        e_6 = _b.sent();
                        return [2, ctx.body = { status: 500 }];
                    case 5: return [2];
                }
            });
        }); });
        app.router('set-visiable', function (ctx, next) { return __awaiter(_this, void 0, void 0, function () {
            var _a, pid, visiable, e_7;
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
                                    updateTime: new Date().getTime()
                                }
                            })];
                    case 1:
                        _b.sent();
                        return [2, ctx.body = { status: 200 }];
                    case 2:
                        e_7 = _b.sent();
                        return [2, ctx.body = { status: 500 }];
                    case 3: return [2];
                }
            });
        }); });
        app.router('delete', function (ctx, next) { return __awaiter(_this, void 0, void 0, function () {
            var pid, e_8;
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
                        e_8 = _a.sent();
                        return [2, ctx.body = { status: 500 }];
                    case 3: return [2];
                }
            });
        }); });
        return [2, app.serve()];
    });
}); };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSxpQkFvcUJFOztBQXBxQkYscUNBQXVDO0FBQ3ZDLHNDQUF3QztBQUV4QyxLQUFLLENBQUMsSUFBSSxDQUFDO0lBQ1AsR0FBRyxFQUFFLE9BQU8sQ0FBQyxHQUFHLENBQUMsS0FBSztDQUN6QixDQUFDLENBQUM7QUFFSCxJQUFNLEVBQUUsR0FBZ0IsS0FBSyxDQUFDLFFBQVEsRUFBRyxDQUFDO0FBQzFDLElBQU0sQ0FBQyxHQUFHLEVBQUUsQ0FBQyxPQUFPLENBQUM7QUFrQ1IsUUFBQSxJQUFJLEdBQUcsVUFBUSxLQUFLLEVBQUUsT0FBTzs7OztRQUVoQyxHQUFHLEdBQUcsSUFBSSxTQUFTLENBQUMsRUFBRSxLQUFLLE9BQUEsRUFBRSxDQUFDLENBQUM7UUFRckMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxRQUFRLEVBQUUsVUFBTyxHQUFHLEVBQUUsSUFBSTs7Ozs7O3dCQUd2QixHQUFHLEdBQUcsS0FBSyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUM7d0JBR2IsV0FBTSxFQUFFLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQztpQ0FDckMsS0FBSyxDQUFDO2dDQUNILEdBQUcsS0FBQTs2QkFDTixDQUFDO2lDQUNELEdBQUcsRUFBRyxFQUFBOzt3QkFKTCxLQUFLLEdBQUcsU0FJSDt3QkFHTCxRQUFRLEdBQUcsS0FBSyxDQUFDLElBQUksQ0FBQzt3QkFDVixXQUFNLE9BQU8sQ0FBQyxHQUFHLENBQUUsUUFBUSxDQUFDLEdBQUcsQ0FBRSxVQUFBLENBQUM7Z0NBQ2hELE9BQU8sRUFBRSxDQUFDLFVBQVUsQ0FBQyxXQUFXLENBQUM7cUNBQzVCLEtBQUssQ0FBQztvQ0FDSCxHQUFHLEVBQUUsQ0FBQyxDQUFDLEdBQUc7b0NBQ1YsUUFBUSxFQUFFLEtBQUs7aUNBQ2xCLENBQUM7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LEVBQUUsRUFBQzs7O3dCQUdsQyxXQUFPLEdBQUcsQ0FBQyxJQUFJLEdBQUcsRUFBRSxNQUFNLEVBQUUsR0FBRyxFQUFFLEVBQUM7Ozs7YUFFekMsQ0FBQyxDQUFDO1FBU0gsR0FBRyxDQUFDLE1BQU0sQ0FBQyxRQUFRLEVBQUUsVUFBTyxHQUFHLEVBQUUsSUFBSTs7Ozs7O3dCQUVyQixHQUFHLEdBQUssS0FBSyxDQUFDLElBQUksSUFBZixDQUFnQjt3QkFDM0IsV0FBTSxFQUFFLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQztpQ0FDdkIsR0FBRyxDQUFFLE1BQU0sQ0FBRSxHQUFHLENBQUUsQ0FBQztpQ0FDbkIsTUFBTSxDQUFDO2dDQUNKLElBQUksRUFBRTtvQ0FDRixRQUFRLEVBQUUsSUFBSTtpQ0FDakI7NkJBQ0osQ0FBQyxFQUFBOzt3QkFOTixTQU1NLENBQUM7d0JBQ1AsV0FBTyxHQUFHLENBQUMsSUFBSSxHQUFHO2dDQUNkLElBQUksRUFBRSxHQUFHO2dDQUNULE1BQU0sRUFBRSxHQUFHOzZCQUNkLEVBQUM7Ozt3QkFHRixXQUFPLEdBQUcsQ0FBQyxJQUFJLEdBQUcsRUFBRSxNQUFNLEVBQUUsR0FBRyxFQUFFLEVBQUM7Ozs7YUFFekMsQ0FBQyxDQUFBO1FBRUYsV0FBTyxHQUFHLENBQUMsS0FBSyxFQUFHLEVBQUM7O0tBRXZCLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBjbG91ZCBmcm9tICd3eC1zZXJ2ZXItc2RrJztcbmltcG9ydCAqIGFzIFRjYlJvdXRlciBmcm9tICd0Y2Itcm91dGVyJztcblxuY2xvdWQuaW5pdCh7XG4gICAgZW52OiBwcm9jZXNzLmVudi5jbG91ZFxufSk7XG5cbmNvbnN0IGRiOiBEQi5EYXRhYmFzZSA9IGNsb3VkLmRhdGFiYXNlKCApO1xuY29uc3QgXyA9IGRiLmNvbW1hbmQ7XG5cbi8qKlxuICogXG4gKiBAZGVzY3JpcHRpb24g5Yib5bu6L+e8lui+keWVhuWTgVxuICoge1xuICogICAgICBfaWQ6IGlkXG4gKiAgICAgIGlzRGVsZXRlOiDmmK/lkKbliKDpmaRcbiAqICAgICAgdGl0bGU6IOWVhuWTgeWQjeensCBTdHJpbmdcbiAqICAgICAgZGV0YWlsITog5ZWG5ZOB5o+P6L+wIFN0cmluZ1xuICogICAgICB0YWc6IOWVhuWTgeagh+etviBBcnJheTxTdHJpbmc+XG4gKiAgICAgIGNhdGVnb3J5OiDllYblk4Hnsbvnm64gU3RyaW5nXG4gKiAgICAgIGltZzog5ZWG5ZOB5Zu+54mHIEFycmF5PFN0cmluZz5cbiAqICAgICAgcHJpY2U6IOS7t+agvCBOdW1iZXJcbiAqICAgICAgZmFkZVByaWNlOiDliJLnur/ku7cgTnVtYmVyXG4gKiAgICAgIGdyb3VwUHJpY2UhOiDlm6LotK3ku7cgTnVtYmVyXG4gKiAgICAgIHN0b2NrITog5bqT5a2YIE51bWJlclxuICogICAgICBkZXBvc2l0UHJpY2UhOiDllYblk4HorqLph5EgTnVtYmVyXG4gKiAgICAgIGxpbWl0ITog6ZmQ6LSt5pWw6YePIE51bWJlclxuICogICAgICB2aXNpYWJsZTog5piv5ZCm5LiK5p62IEJvb2xlYW5cbiAqICAgICAgc2FsZWQ6IOmUgOmHjyBOdW1iZXJcbiAqICAgICAgdXBkYXRlVGltZVxuICohICAgICAgc3RhbmRhcmRzITog5Z6L5Y+36KeE5qC8IEFycmF5PHsgXG4gKiAgICAgICAgICBuYW1lOiBTdHJpbmcsXG4gKiAgICAgICAgICBwcmljZTogTnVtYmVyLFxuICogICAgICAgICAgZ3JvdXBQcmljZSE6IE51bWJlcixcbiAqICAgICAgICAgIHN0b2NrITogTnVtYmVyOlxuICogICAgICAgICAgaW1nOiBTdHJpbmcgLFxuICogICAgICAgICAgX2lkOiBzdHJpbmcsXG4gKiAgICAgICAgICBwaWQ6IHN0cmluZyxcbiAqICAgICAgICAgIGlzRGVsZXRlOiBib29sZWFuXG4gKiAgICAgIH0+XG4gKiB9XG4gKi9cbmV4cG9ydCBjb25zdCBtYWluID0gYXN5bmMgKCBldmVudCwgY29udGV4dCApID0+IHtcblxuICAgIGNvbnN0IGFwcCA9IG5ldyBUY2JSb3V0ZXIoeyBldmVudCB9KTtcblxuICAgIC8qKlxuICAgICAqIEBkZXNjcmlwdGlvblxuICAgICAqIOWVhuWTgeivpuaDhVxuICAgICAqIC0tLS0tIOivt+axgiAtLS0tLVxuICAgICAqIF9pZFxuICAgICAqL1xuICAgIGFwcC5yb3V0ZXIoJ2RldGFpbCcsIGFzeW5jKCBjdHgsIG5leHQgKSA9PiB7XG4gICAgICAgIHRyeSB7XG5cbiAgICAgICAgICAgIGNvbnN0IF9pZCA9IGV2ZW50LmRhdGEuX2lkO1xuXG4gICAgICAgICAgICAvLyDojrflj5bmlbDmja5cbiAgICAgICAgICAgIGNvbnN0IGRhdGEkID0gYXdhaXQgZGIuY29sbGVjdGlvbignZ29vZHMnKVxuICAgICAgICAgICAgICAgIC53aGVyZSh7XG4gICAgICAgICAgICAgICAgICAgIF9pZFxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLmdldCggKTtcblxuICAgICAgICAgICAgLy8g5ou85o6l5Z6L5Y+3XG4gICAgICAgICAgICBjb25zdCBtZXRhTGlzdCA9IGRhdGEkLmRhdGE7XG4gICAgICAgICAgICBjb25zdCBzdGFuZGFyZHMgPSBhd2FpdCBQcm9taXNlLmFsbCggbWV0YUxpc3QubWFwKCB4ID0+IHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZGIuY29sbGVjdGlvbignc3RhbmRhcmRzJylcbiAgICAgICAgICAgICAgICAgICAgLndoZXJlKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHBpZDogeC5faWQsXG4gICAgICAgICAgICAgICAgICAgICAgICBpc0RlbGV0ZTogZmFsc2VcbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgLmdldCggKTtcbiAgICAgICAgICAgIH0pKTtcblxuICAgICAgICAgICAgLy8g5ou85o6l5Z6L5Y+35oiW5ZWG5ZOB5rS75YqoXG4gICAgICAgICAgICBjb25zdCBhY3Rpdml0aWVzJCA9IGF3YWl0IGRiLmNvbGxlY3Rpb24oJ2FjdGl2aXR5JylcbiAgICAgICAgICAgICAgICAud2hlcmUoe1xuICAgICAgICAgICAgICAgICAgICBwaWQ6IF9pZCxcbiAgICAgICAgICAgICAgICAgICAgaXNDbG9zZWQ6IGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICBpc0RlbGV0ZWQ6IGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICB0eXBlOiAnZ29vZF9kaXNjb3VudCdcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIC5maWVsZCh7XG4gICAgICAgICAgICAgICAgICAgIHBpZDogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgc2lkOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICB0aXRsZTogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgYWNfcHJpY2U6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgIGVuZFRpbWU6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgIGFjX2dyb3VwUHJpY2U6IHRydWVcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIC5nZXQoICk7XG5cbiAgICAgICAgICAgIGNvbnN0IGluc2VydCA9IG1ldGFMaXN0Lm1hcCgoIHgsIGsgKSA9PiBPYmplY3QuYXNzaWduKHsgfSwgeCwge1xuICAgICAgICAgICAgICAgIGFjdGl2aXRpZXM6IGFjdGl2aXRpZXMkLmRhdGEsXG4gICAgICAgICAgICAgICAgc3RhbmRhcmRzOiBzdGFuZGFyZHNbIGsgXS5kYXRhXG4gICAgICAgICAgICB9KSk7XG5cbiAgICAgICAgICAgIHJldHVybiBjdHguYm9keSA9IHtcbiAgICAgICAgICAgICAgICBzdGF0dXM6IDIwMCxcbiAgICAgICAgICAgICAgICBkYXRhOiBpbnNlcnRbIDAgXVxuICAgICAgICAgICAgfTtcblxuICAgICAgICB9IGNhdGNoICggZSApIHtcbiAgICAgICAgICAgIHJldHVybiBjdHguYm9keSA9IHtcbiAgICAgICAgICAgICAgICBzdGF0dXM6IDUwMCxcbiAgICAgICAgICAgICAgICBtZXNzYWdlOiBlXG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICAvKipcbiAgICAgKiBAZGVzY3JpcHRpb24g5ZWG5ZOB6ZSA6YeP5o6S6KGM5qac5YiX6KGoXG4gICAgICogLS0tLS0tLS0g6K+35rGCIC0tLS0tLS0tLS1cbiAgICAgKiB7XG4gICAgICogICAgICBsaW1pdFxuICAgICAqICAgICAgc29ydDog5o6S5bqPXG4gICAgICogICAgICBwYWdlOiDpobXmlbBcbiAgICAgKiAgICAgIHNlYXJjaDog5pCc57SiXG4gICAgICogICAgICBjYXRlZ29yeTog5ZWG5ZOB57G755uuXG4gICAgICogfVxuICAgICAqIC0tLS0tLS0tLS0g6L+U5ZueIC0tLS0tLS0tXG4gICAgICoge1xuICAgICAqICAgICAgZGF0YTog5YiX6KGoXG4gICAgICogICAgICBwYWdlOiDpobXmlbBcbiAgICAgKiAgICAgIHRvdGFsOiDmgLvmlbBcbiAgICAgKiAgICAgIHRvdGFsUGFnZTog5oC76aG15pWwXG4gICAgICogICAgICBwYWdlU2l6ZTogMjBcbiAgICAgKiB9XG4gICAgICovXG4gICAgYXBwLnJvdXRlcigncmFuaycsIGFzeW5jKCBjdHgsIG5leHQgKSA9PiB7XG4gICAgICAgIHRyeSB7XG5cbiAgICAgICAgICAgIC8vIOafpeivouadoeaVsFxuICAgICAgICAgICAgY29uc3QgbGltaXQgPSBldmVudC5kYXRhLmxpbWl0IHx8IDIwO1xuICAgICAgICAgICAgY29uc3QgeyBjYXRlZ29yeSwgc29ydCB9ID0gZXZlbnQuZGF0YTtcbiAgICAgICAgICAgIGNvbnN0IHNlYXJjaCQgPSBldmVudC5kYXRhLnNlYXJjaCB8fCAnJztcbiAgICAgICAgICAgIGNvbnN0IHNlYXJjaCA9IG5ldyBSZWdFeHAoIHNlYXJjaCQucmVwbGFjZSgvXFxzKy9nLCBcIlwiKSwgJ2knKTtcblxuICAgICAgICAgICAgLy8g6I635Y+W5oC75pWwXG4gICAgICAgICAgICBjb25zdCB0b3RhbCQgPSBhd2FpdCBkYi5jb2xsZWN0aW9uKCdnb29kcycpXG4gICAgICAgICAgICAgICAgLndoZXJlKHtcbiAgICAgICAgICAgICAgICAgICAgY2F0ZWdvcnksXG4gICAgICAgICAgICAgICAgICAgIHRpdGxlOiBzZWFyY2gsXG4gICAgICAgICAgICAgICAgICAgIGlzRGVsZXRlOiBfLm5lcSggdHJ1ZSApXG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAuY291bnQoICk7XG5cbiAgICAgICAgICAgIC8vIOiOt+WPluWVhuWTgeaVsOaNrlxuICAgICAgICAgICAgY29uc3QgZGF0YSQgPSBhd2FpdCBkYi5jb2xsZWN0aW9uKCdnb29kcycpXG4gICAgICAgICAgICAgICAgLndoZXJlKHtcbiAgICAgICAgICAgICAgICAgICAgY2F0ZWdvcnksXG4gICAgICAgICAgICAgICAgICAgIHRpdGxlOiBzZWFyY2gsXG4gICAgICAgICAgICAgICAgICAgIGlzRGVsZXRlOiBfLm5lcSggdHJ1ZSApXG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAubGltaXQoIGxpbWl0IClcbiAgICAgICAgICAgICAgICAuc2tpcCgoIGV2ZW50LmRhdGEucGFnZSAtIDEgKSAqIGxpbWl0IClcbiAgICAgICAgICAgICAgICAub3JkZXJCeSggc29ydCB8fCAnc2FsZWQnLCAnZGVzYycpXG4gICAgICAgICAgICAgICAgLmdldCggKTtcblxuICAgICAgICAgICAgLy8g6I635Y+W5Z6L5Y+35pWw5o2uXG4gICAgICAgICAgICBjb25zdCBzdGFuZGFyZHMgPSBhd2FpdCBQcm9taXNlLmFsbCggZGF0YSQuZGF0YS5tYXAoIHggPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiBkYi5jb2xsZWN0aW9uKCdzdGFuZGFyZHMnKVxuICAgICAgICAgICAgICAgICAgICAud2hlcmUoe1xuICAgICAgICAgICAgICAgICAgICAgICAgcGlkOiB4Ll9pZCxcbiAgICAgICAgICAgICAgICAgICAgICAgIGlzRGVsZXRlOiBmYWxzZVxuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAuZ2V0KCApO1xuICAgICAgICAgICAgfSkpO1xuXG4gICAgICAgICAgICBjb25zdCBpbnNlcnRTdGFuZGFycyA9IGRhdGEkLmRhdGEubWFwKCggeCwgayApID0+IE9iamVjdC5hc3NpZ24oeyB9LCB4LCB7XG4gICAgICAgICAgICAgICAgc3RhbmRhcmRzOiBzdGFuZGFyZHNbIGsgXS5kYXRhXG4gICAgICAgICAgICB9KSk7XG5cbiAgICAgICAgICAgIC8vIOiOt+WPlua0u+WKqOaVsOaNruaVsOaNrlxuICAgICAgICAgICAgY29uc3QgYWN0aXZpdGllcyQgPSBhd2FpdCBQcm9taXNlLmFsbChcbiAgICAgICAgICAgICAgICBkYXRhJC5kYXRhLm1hcCggZ29vZCA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBkYi5jb2xsZWN0aW9uKCdhY3Rpdml0eScpXG4gICAgICAgICAgICAgICAgICAgICAgICAud2hlcmUoe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBpZDogZ29vZC5faWQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaXNDbG9zZWQ6IGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlzRGVsZXRlZDogZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogJ2dvb2RfZGlzY291bnQnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVuZFRpbWU6IF8uZ3QoIG5ldyBEYXRlKCApLmdldFRpbWUoICkpXG4gICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAgICAgLmdldCggKVxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICApO1xuXG4gICAgICAgICAgICBjb25zdCBpbnNlcnRBY3Rpdml0eSA9IGluc2VydFN0YW5kYXJzLm1hcCgoIHgsIGsgKSA9PiBPYmplY3QuYXNzaWduKHsgfSwgeCwge1xuICAgICAgICAgICAgICAgIGFjdGl2aXRpZXM6IGFjdGl2aXRpZXMkWyBrIF0uZGF0YVxuICAgICAgICAgICAgfSkpO1xuXG4gICAgICAgICAgICByZXR1cm4gY3R4LmJvZHkgPSB7XG4gICAgICAgICAgICAgICAgc3RhdHVzOiAyMDAsXG4gICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgICBkYXRhOiBpbnNlcnRBY3Rpdml0eSxcbiAgICAgICAgICAgICAgICAgICAgc2VhcmNoOiBzZWFyY2gkLnJlcGxhY2UoL1xccysvZywgJycpLFxuICAgICAgICAgICAgICAgICAgICBwYWdlbmF0aW9uOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBwYWdlU2l6ZTogbGltaXQsXG4gICAgICAgICAgICAgICAgICAgICAgICBwYWdlOiBldmVudC5kYXRhLnBhZ2UsXG4gICAgICAgICAgICAgICAgICAgICAgICB0b3RhbDogdG90YWwkLnRvdGFsLFxuICAgICAgICAgICAgICAgICAgICAgICAgdG90YWxQYWdlOiBNYXRoLmNlaWwoIHRvdGFsJC50b3RhbCAvIGxpbWl0IClcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICBcbiAgICAgICAgfSBjYXRjaCAoIGUgKSB7XG4gICAgICAgICAgICByZXR1cm4gY3R4LmJvZHkgPSB7XG4gICAgICAgICAgICAgICAgc3RhdHVzOiA1MDAsXG4gICAgICAgICAgICAgICAgbWVzc2FnZTogZVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICAvKipcbiAgICAgKiDllYblk4HliJfooajvvIgg5ZCrc3RhbmRhcmRz44CBYWN0aXZpdGllc+WtkOihqO+8iVxuICAgICAqIHtcbiAgICAgKiAgICB0aXRsZVxuICAgICAqICAgIHNlYXJjaCBcbiAgICAgKiAgICBwYWdlXG4gICAgICogfVxuICAgICAqL1xuICAgIGFwcC5yb3V0ZXIoJ2xpc3QnLCBhc3luYyggY3R4LCBuZXh0ICkgPT4ge1xuICAgICAgICB0cnkge1xuICAgICBcbiAgICAgICAgICAgIC8vIOafpeivouadoeaVsFxuICAgICAgICAgICAgY29uc3QgbGltaXQgPSBldmVudC5kYXRhLmxpbWl0IHx8IDIwO1xuXG4gICAgICAgICAgICAvLyDmn6Xor6LmnaHku7ZcbiAgICAgICAgICAgIGNvbnN0IHNlYXJjaFJlcSA9IHtcbiAgICAgICAgICAgICAgICB0aXRsZTogKCEhZXZlbnQuZGF0YS50aXRsZSAmJiAhIWV2ZW50LmRhdGEudGl0bGUudHJpbSggKSkgPyBcbiAgICAgICAgICAgICAgICAgICAgbmV3IFJlZ0V4cChldmVudC5kYXRhLnRpdGxlLnJlcGxhY2UoL1xccysvZywgXCJcIiksICdpJykgOiBudWxsXG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICBjb25zdCB0ZW1wID0ge1xuICAgICAgICAgICAgICAgIGlzRGVsZXRlOiBfLm5lcSggdHJ1ZSApXG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgT2JqZWN0LmtleXMoIHNlYXJjaFJlcSApLm1hcCgga2V5ID0+IHtcbiAgICAgICAgICAgICAgICBpZiAoICEhc2VhcmNoUmVxWyBrZXkgXSkge1xuICAgICAgICAgICAgICAgICAgICB0ZW1wWyBrZXkgXSA9IHNlYXJjaFJlcVsga2V5IF07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIC8vIOiOt+WPluaAu+aVsFxuICAgICAgICAgICAgY29uc3QgdG90YWwkID0gYXdhaXQgZGIuY29sbGVjdGlvbignZ29vZHMnKVxuICAgICAgICAgICAgICAgIC53aGVyZSggdGVtcCApXG4gICAgICAgICAgICAgICAgLmNvdW50KCApO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICAvLyDojrflj5bmlbDmja5cbiAgICAgICAgICAgIGNvbnN0IGRhdGEkID0gYXdhaXQgZGIuY29sbGVjdGlvbignZ29vZHMnKVxuICAgICAgICAgICAgICAgIC53aGVyZSggdGVtcCApXG4gICAgICAgICAgICAgICAgLmxpbWl0KCBsaW1pdCApXG4gICAgICAgICAgICAgICAgLnNraXAoKCBldmVudC5kYXRhLnBhZ2UgLSAxICkgKiBsaW1pdCApXG4gICAgICAgICAgICAgICAgLm9yZGVyQnkoJ3VwZGF0ZVRpbWUnLCAnZGVzYycpXG4gICAgICAgICAgICAgICAgLmdldCggKTtcblxuICAgICAgICAgICAgY29uc3QgbWV0YUxpc3QgPSBkYXRhJC5kYXRhO1xuICAgICAgICAgICAgY29uc3Qgc3RhbmRhcmRzID0gYXdhaXQgUHJvbWlzZS5hbGwoIG1ldGFMaXN0Lm1hcCggeCA9PiB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGRiLmNvbGxlY3Rpb24oJ3N0YW5kYXJkcycpXG4gICAgICAgICAgICAgICAgICAgIC53aGVyZSh7XG4gICAgICAgICAgICAgICAgICAgICAgICBwaWQ6IHguX2lkLFxuICAgICAgICAgICAgICAgICAgICAgICAgaXNEZWxldGU6IGZhbHNlXG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgIC5nZXQoICk7XG4gICAgICAgICAgICB9KSk7XG5cbiAgICAgICAgICAgIGNvbnN0IGluc2VydFN0YW5kYXJzID0gbWV0YUxpc3QubWFwKCggeCwgayApID0+IE9iamVjdC5hc3NpZ24oeyB9LCB4LCB7XG4gICAgICAgICAgICAgICAgc3RhbmRhcmRzOiBzdGFuZGFyZHNbIGsgXS5kYXRhXG4gICAgICAgICAgICB9KSk7XG4gICBcbiAgICAgICAgICAgIC8vIOafpeivouiiq+WKoOWFpei0reeJqei9puaVsOmHj1xuICAgICAgICAgICAgY29uc3QgY2FydHMgPSBhd2FpdCBQcm9taXNlLmFsbCggaW5zZXJ0U3RhbmRhcnMubWFwKCB4ID0+IHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZGIuY29sbGVjdGlvbignY2FydCcpXG4gICAgICAgICAgICAgICAgICAgICAgICAud2hlcmUoe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBpZDogeC5faWRcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgICAgICAuY291bnQoICk7XG4gICAgICAgICAgICB9KSk7XG5cbiAgICAgICAgICAgIGNvbnN0IGluc2VydENhcnQgPSBpbnNlcnRTdGFuZGFycy5tYXAoKCB4LCBrICkgPT4gT2JqZWN0LmFzc2lnbih7IH0sIHgsIHtcbiAgICAgICAgICAgICAgICBjYXJ0czogY2FydHNbIGsgXS50b3RhbFxuICAgICAgICAgICAgfSkpO1xuXG4gICAgICAgICAgICByZXR1cm4gY3R4LmJvZHkgPSB7XG4gICAgICAgICAgICAgICAgc3RhdHVzOiAyMDAsXG4gICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgICBzZWFyY2g6IGV2ZW50LmRhdGEudGl0bGUucmVwbGFjZSgvXFxzKy9nLCAnJyksXG4gICAgICAgICAgICAgICAgICAgIHBhZ2VTaXplOiBsaW1pdCxcbiAgICAgICAgICAgICAgICAgICAgcGFnZTogZXZlbnQuZGF0YS5wYWdlLFxuICAgICAgICAgICAgICAgICAgICBkYXRhOiBpbnNlcnRDYXJ0LFxuICAgICAgICAgICAgICAgICAgICB0b3RhbDogdG90YWwkLnRvdGFsLFxuICAgICAgICAgICAgICAgICAgICB0b3RhbFBhZ2U6IE1hdGguY2VpbCggdG90YWwkLnRvdGFsIC8gbGltaXQgKVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgfSBjYXRjaCAoIGUgKSB7XG4gICAgICAgICAgICByZXR1cm4gY3R4LmJvZHkgPSB7XG4gICAgICAgICAgICAgICAgc3RhdHVzOiA1MDAsXG4gICAgICAgICAgICAgICAgbWVzc2FnZTogZVxuICAgICAgICAgICAgfVxuICAgICAgICB9IFxuICAgIH0pO1xuXG4gICAgYXBwLnJvdXRlcignZWRpdCcsIGFzeW5jKCBjdHgsIG5leHQgKSA9PiB7XG4gICAgICAgIHRyeSB7XG5cbiAgICAgICAgICAgIGxldCBfaWQgPSBldmVudC5kYXRhLl9pZDtcblxuICAgICAgICAgICAgLy8g5Yik5pat5piv5ZCm5pyJ5ZCM5ZCN5ZWG5ZOBXG4gICAgICAgICAgICBjb25zdCB7IHRpdGxlIH0gPSBldmVudC5kYXRhO1xuICAgICAgICAgICAgY29uc3QgY2hlY2sxJCA9IGF3YWl0IGRiLmNvbGxlY3Rpb24oJ2dvb2RzJylcbiAgICAgICAgICAgICAgICAud2hlcmUoe1xuICAgICAgICAgICAgICAgICAgICB0aXRsZSxcbiAgICAgICAgICAgICAgICAgICAgaXNEZWxldGU6IF8ubmVxKCB0cnVlIClcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIC5jb3VudCggKTtcblxuICAgICAgICAgICAgaWYgKCBjaGVjazEkLnRvdGFsICE9PSAwICkge1xuICAgICAgICAgICAgICAgIHJldHVybiBjdHguYm9keSA9IHtcbiAgICAgICAgICAgICAgICAgICAgc3RhdHVzOiA1MDAsXG4gICAgICAgICAgICAgICAgICAgIG1lc3NhZ2U6ICflrZjlnKjlkIzlkI3llYblk4Es6K+35qOA5p+lJ1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIGlmICggIV9pZCApIHtcbiAgICAgICAgICAgICAgICAvLyDliJvlu7pcbiAgICAgICAgICAgICAgICBjb25zdCB7IHN0YW5kYXJkcyB9ID0gZXZlbnQuZGF0YTtcbiAgICBcbiAgICAgICAgICAgICAgICBkZWxldGUgZXZlbnQuZGF0YVsnc3RhbmRhcmRzJ107XG4gICAgXG4gICAgICAgICAgICAgICAgY29uc3QgY3JlYXRlJCA9IGF3YWl0IGRiLmNvbGxlY3Rpb24oJ2dvb2RzJykuYWRkKHtcbiAgICAgICAgICAgICAgICAgICAgZGF0YTogT2JqZWN0LmFzc2lnbih7IH0sIGV2ZW50LmRhdGEsIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlzRGVsZXRlOiBmYWxzZVxuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIF9pZCA9IGNyZWF0ZSQuX2lkO1xuICAgIFxuICAgICAgICAgICAgICAgIC8vIOaPkuWFpeWei+WPt1xuICAgICAgICAgICAgICAgIGlmICggISFzdGFuZGFyZHMgJiYgQXJyYXkuaXNBcnJheSggc3RhbmRhcmRzICkpIHtcbiAgICAgICAgICAgICAgICAgICAgYXdhaXQgUHJvbWlzZS5hbGwoIHN0YW5kYXJkcy5tYXAoIHggPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGRiLmNvbGxlY3Rpb24oJ3N0YW5kYXJkcycpLmFkZCh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YTogT2JqZWN0LmFzc2lnbih7IH0sIHgsIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGlkOiBfaWQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlzRGVsZXRlOiBmYWxzZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgfSkpXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICBcbiAgICAgICAgICAgICAgICAvLyDmm7TmlrBcbiAgICAgICAgICAgICAgICBjb25zdCBtZXRhID0gT2JqZWN0LmFzc2lnbih7IH0sIGV2ZW50LmRhdGEgKTtcbiAgICAgICAgICAgICAgICBkZWxldGUgbWV0YVsgX2lkIF07XG4gICAgICAgICAgICAgICAgY29uc3QgeyB0aXRsZSwgY2F0ZWdvcnksIGRlcG9zaXRQcmljZSwgZGV0YWlsLCBmYWRlUHJpY2UsIGltZywgbGltaXQsIFxuICAgICAgICAgICAgICAgICAgICBzdGFuZGFyZHMsIHRhZywgdXBkYXRlVGltZSwgdmlzaWFibGUsIHByaWNlLCBncm91cFByaWNlLCBzdG9jaywgc2FsZWQgfSA9IG1ldGE7XG4gICAgICAgICAgICAgICAgYXdhaXQgZGIuY29sbGVjdGlvbignZ29vZHMnKS5kb2MoIF9pZCApLnVwZGF0ZSh7XG4gICAgICAgICAgICAgICAgICAgIGRhdGE6IHsgXG4gICAgICAgICAgICAgICAgICAgICAgICB0YWcsXG4gICAgICAgICAgICAgICAgICAgICAgICBpbWcsXG4gICAgICAgICAgICAgICAgICAgICAgICBzdG9jayxcbiAgICAgICAgICAgICAgICAgICAgICAgIHByaWNlLFxuICAgICAgICAgICAgICAgICAgICAgICAgbGltaXQsXG4gICAgICAgICAgICAgICAgICAgICAgICB0aXRsZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGRldGFpbCxcbiAgICAgICAgICAgICAgICAgICAgICAgIHNhbGVkLFxuICAgICAgICAgICAgICAgICAgICAgICAgZ3JvdXBQcmljZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhdGVnb3J5LFxuICAgICAgICAgICAgICAgICAgICAgICAgZmFkZVByaWNlLFxuICAgICAgICAgICAgICAgICAgICAgICAgdmlzaWFibGUsXG4gICAgICAgICAgICAgICAgICAgICAgICB1cGRhdGVUaW1lLFxuICAgICAgICAgICAgICAgICAgICAgICAgZGVwb3NpdFByaWNlXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICBcbiAgICAgICAgICAgICAgICAvLyAwLiDmn6Xor6Lor6Xkuqflk4HlupXkuIvmiYDmnInnmoTlnovlj7dcbiAgICAgICAgICAgICAgICBjb25zdCBhbGxTdGFuZGFyZHMkID0gYXdhaXQgZGIuY29sbGVjdGlvbignc3RhbmRhcmRzJylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC53aGVyZSh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGlkOiBfaWRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAuZ2V0KCApO1xuICAgIFxuICAgICAgICAgICAgICAgIC8vIOmcgOimgeKAnOWIoOmZpOKAneeahOWei+WPt1xuICAgICAgICAgICAgICAgIGNvbnN0IHdvdWxkU2V0RGVsZXRlOiBhbnlbIF0gPSBbIF07XG4gICAgXG4gICAgICAgICAgICAgICAgLy8g6ZyA6KaB4oCc5pu05paw4oCd55qE5Z6L5Y+3XG4gICAgICAgICAgICAgICAgY29uc3Qgd291bGRVcGRhdGU6IGFueVsgXSA9IFsgXTtcbiAgICBcbiAgICAgICAgICAgICAgICAvLyDpnIDopoHigJzlop7liqDigJ3jgIHigJzmm7TmlrDigJ3nmoTlnovlj7dcbiAgICAgICAgICAgICAgICBjb25zdCB3b3VsZENyZWF0ZSA9IHN0YW5kYXJkcy5maWx0ZXIoIHggPT4gIXguX2lkICk7XG4gICAgXG4gICAgICAgICAgICAgICAgYWxsU3RhbmRhcmRzJC5kYXRhLmZpbHRlciggeCA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGlmICggIXN0YW5kYXJkcy5maW5kKCB5ID0+IHkuX2lkID09PSB4Ll9pZCApKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB3b3VsZFNldERlbGV0ZS5wdXNoKCB4IClcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHdvdWxkVXBkYXRlLnB1c2goIHggKVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgXG4gICAgICAgICAgICAgICAgLy8gMS4gIOKAnOWIoOmZpOKAnemDqOWIhuWei+WPt1xuICAgICAgICAgICAgICAgIGF3YWl0IFByb21pc2UuYWxsKCB3b3VsZFNldERlbGV0ZS5tYXAoIHggPT4ge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZGIuY29sbGVjdGlvbignc3RhbmRhcmRzJylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAuZG9jKCB4Ll9pZCApXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLnVwZGF0ZSh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlzRGVsZXRlOiB0cnVlXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIH0pKTtcbiAgICBcbiAgICAgICAgICAgICAgICAvLyAyLiDmm7TmlrDpg6jliIblnovlj7fkv6Hmga9cbiAgICAgICAgICAgICAgICBhd2FpdCBQcm9taXNlLmFsbCggd291bGRVcGRhdGUubWFwKCB4ID0+IHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgbmV3VGFyZ2V0ID0gc3RhbmRhcmRzLmZpbmQoIHkgPT4geS5faWQgPT09IHguX2lkICk7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHsgbmFtZSwgcHJpY2UsIGdyb3VwUHJpY2UsIHN0b2NrLCBpbWcgfSA9IG5ld1RhcmdldDtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGRiLmNvbGxlY3Rpb24oJ3N0YW5kYXJkcycpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLmRvYyggeC5faWQgKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC51cGRhdGUoe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuYW1lLCBwcmljZSwgZ3JvdXBQcmljZSwgc3RvY2ssIGltZ1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICB9KSk7XG4gICAgXG4gICAgICAgICAgICAgICAgLy8gMy4g5paw5aKe6YOo5YiG5Z6L5Y+3XG4gICAgICAgICAgICAgICAgYXdhaXQgUHJvbWlzZS5hbGwoIHdvdWxkQ3JlYXRlLm1hcCggeCA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBkYi5jb2xsZWN0aW9uKCdzdGFuZGFyZHMnKS5hZGQoe1xuICAgICAgICAgICAgICAgICAgICAgICAgZGF0YTogT2JqZWN0LmFzc2lnbih7IH0sIHgsIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwaWQ6IF9pZCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpc0RlbGV0ZTogZmFsc2VcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgfSkpO1xuICAgIFxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gY3R4LmJvZHkgPSB7XG4gICAgICAgICAgICAgICAgZGF0YTogX2lkLFxuICAgICAgICAgICAgICAgIHN0YXR1czogMjAwXG4gICAgICAgICAgICB9O1xuXG4gICAgICAgIH0gY2F0Y2ggKCBlICkge1xuICAgICAgICAgICAgcmV0dXJuIGN0eC5ib2R5ID0ge1xuICAgICAgICAgICAgICAgIHN0YXR1czogNTAwLFxuICAgICAgICAgICAgICAgIG1lc3NhZ2U6IGVcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0pXG5cbiAgICAvKipcbiAgICAgKiBAZGVzY3JpcHRpb25cbiAgICAgKiDmoLnmja7pooTku5jorqLljZXnmoTnm7jlhbPkv6Hmga/vvIzlh4/lsJHjgIHmm7TmlrDmjIflrprllYblk4HnmoTlupPlrZhcbiAgICAgKiAtLS0tLS0tLS0tIOivt+axgiAtLS0tLS0tLS0tLVxuICAgICAqIHtcbiAgICAgKiAgICAgIHNpZCxcbiAgICAgKiAgICAgIHBpZCxcbiAgICAgKiAgICAgIGNvdW50XG4gICAgICogfVxuICAgICAqL1xuICAgIGFwcC5yb3V0ZXIoJ3VwZGF0ZS1zdG9jaycsIGFzeW5jKCBjdHgsIG5leHQgKSA9PiB7XG4gICAgICAgIHRyeSB7XG5cbiAgICAgICAgICAgIGNvbnN0IHsgc2lkLCBwaWQsIGNvdW50IH0gPSBldmVudC5kYXRhO1xuXG4gICAgICAgICAgICBsZXQgdGFyZ2V0OiBhbnkgPSBudWxsO1xuICAgICAgICAgICAgY29uc3QgdGFyZ2V0SWQgPSBzaWQgfHwgcGlkO1xuICAgICAgICAgICAgY29uc3QgY29sbGVjdGlvbk5hbWUgPSAhIXNpZCA/ICdzdGFuZGFyZHMnIDogJ2dvb2RzJztcblxuICAgICAgICAgICAgY29uc3QgZmluZCQgPSBhd2FpdCBkYi5jb2xsZWN0aW9uKCBjb2xsZWN0aW9uTmFtZSApXG4gICAgICAgICAgICAgICAgLndoZXJlKHtcbiAgICAgICAgICAgICAgICAgICAgX2lkOiB0YXJnZXRJZFxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLmdldCggKTtcblxuICAgICAgICAgICAgaWYgKCBmaW5kJC5kYXRhLmxlbmd0aCA9PT0gMCApIHtcbiAgICAgICAgICAgICAgICB0aHJvdyAhIXNpZCA/ICfmm7TmlrDlupPlrZjlvILluLgsIOW9k+WJjeWei+WPt+S4jeWtmOWcqCcgOiAn5pu05paw5bqT5a2Y5byC5bi4LCDlvZPliY3llYblk4HkuI3lrZjlnKgnXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRhcmdldCA9IGZpbmQkLmRhdGFbIDAgXTtcblxuICAgICAgICAgICAgLy8g5peg6ZmQ5bqT5a2YXG4gICAgICAgICAgICBpZiAoIHRhcmdldC5zdG9jayA9PT0gbnVsbCB8fCB0YXJnZXQuc3RvY2sgPT09IHVuZGVmaW5lZCApIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gY3R4LmJvZHkgPSB7XG4gICAgICAgICAgICAgICAgICAgIHN0YXR1czogMjAwXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyDliKTmlq3lupPlrZjmmK/lkKbotrPlpJ9cbiAgICAgICAgICAgIGlmICggdGFyZ2V0LnN0b2NrIC0gY291bnQgPCAwICkge1xuICAgICAgICAgICAgICAgIHRocm93ICEhc2lkID8gJ+abtOaWsOW6k+WtmOW8guW4uCwg5b2T5YmN5Z6L5Y+35bqT5a2Y5LiN6LazJyA6ICfmm7TmlrDlupPlrZjlvILluLgsIOW9k+WJjeWVhuWTgeW6k+WtmOS4jei2syc7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIOabtOaWsFxuICAgICAgICAgICAgYXdhaXQgZGIuY29sbGVjdGlvbiggY29sbGVjdGlvbk5hbWUgKS5kb2MoIHRhcmdldElkIClcbiAgICAgICAgICAgICAgICAudXBkYXRlKHtcbiAgICAgICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgICAgICAgc3RvY2s6IF8uaW5jKCAtY291bnQgKVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSlcblxuICAgICAgICAgICAgcmV0dXJuIGN0eC5ib2R5ID0ge1xuICAgICAgICAgICAgICAgIHN0YXR1czogMjAwXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfSBjYXRjaCAoIGUgKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhgLS0tLeOAkEVycm9yLUdvb2TjgJEtLS0t77yaJHtKU09OLnN0cmluZ2lmeSggZSApfWApO1xuICAgICAgICAgICAgcmV0dXJuIGN0eC5ib2R5ID0geyBzdGF0dXM6IDUwMCwgbWVzc2FnZTogZSB9O1xuICAgICAgICB9XG4gICAgfSlcblxuICAgIC8qKlxuICAgICAqIEBkZXNjcmlwdGlvblxuICAgICAqIOWuouaIt+err+aQnOe0ouWVhuWTgeWIl+ihqO+8iCDliIbnsbvmkJzmkJzjgIHmiJbmloflrZfmkJzmkJwg77yJXG4gICAgICogISBzZWFyY2gg5LiN5Lya5piv56m65a2X56ym5LiyXG4gICAgICoge1xuICAgICAqICAgIHNlYXJjaCxcbiAgICAgKiAgICBwYWdlLFxuICAgICAqICAgIGNhdGVnb3J5XG4gICAgICogfVxuICAgICAqL1xuICAgIGFwcC5yb3V0ZXIoJ2NsaWVudC1zZWFyY2gnLCBhc3luYyggY3R4LCBuZXh0ICkgPT4ge1xuICAgICAgICB0cnkge1xuXG4gICAgICAgICAgICAvLyDmn6Xor6LmnaHmlbBcbiAgICAgICAgICAgIGNvbnN0IGxpbWl0ID0gMTA7XG4gICAgICAgICAgICBjb25zdCB7IHNlYXJjaCwgcGFnZSwgY2F0ZWdvcnkgfSA9IGV2ZW50LmRhdGE7XG5cbiAgICAgICAgICAgIGxldCBxdWVyeTogYW55ID0gbnVsbDtcblxuICAgICAgICAgICAgaWYgKCAhIXNlYXJjaCApIHtcblxuICAgICAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICAgICAqIOaQnOe0oue6rOW6pu+8mlxuICAgICAgICAgICAgICAgICAqIOWVhuWTgeagh+mimFxuICAgICAgICAgICAgICAgICAqIOivpuaDhVxuICAgICAgICAgICAgICAgICAqISDmoIfnrb7vvIjmnKrlrp7njrDvvIlcbiAgICAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgICAgIHF1ZXJ5ID0gXy5vcihbXG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZpc2lhYmxlOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICAgICAgaXNEZWxldGU6IF8ubmVxKCB0cnVlICksXG4gICAgICAgICAgICAgICAgICAgICAgICB0aXRsZTogbmV3IFJlZ0V4cCggc2VhcmNoLnJlcGxhY2UoIC9cXHMrL2csICcnICksICdpJyApXG4gICAgICAgICAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZpc2lhYmxlOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICAgICAgaXNEZWxldGU6IF8ubmVxKCB0cnVlICksXG4gICAgICAgICAgICAgICAgICAgICAgICBkZXRhaWw6IG5ldyBSZWdFeHAoIHNlYXJjaC5yZXBsYWNlKCAvXFxzKy9nLCAnJyApLCAnaScgKVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgXSk7XG5cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKCAhIWNhdGVnb3J5ICkge1xuICAgICAgICAgICAgICAgIHF1ZXJ5ID0gXy5vcihbXG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhdGVnb3J5LFxuICAgICAgICAgICAgICAgICAgICAgICAgdmlzaWFibGU6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgICAgICBpc0RlbGV0ZTogXy5uZXEoIHRydWUgKVxuICAgICAgICAgICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjYXRlZ29yeSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHZpc2lhYmxlOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICAgICAgaXNEZWxldGU6IF8ubmVxKCB0cnVlIClcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIF0pO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyDojrflj5bmgLvmlbBcbiAgICAgICAgICAgIGNvbnN0IHRvdGFsJCA9IGF3YWl0IGRiLmNvbGxlY3Rpb24oJ2dvb2RzJylcbiAgICAgICAgICAgICAgICAud2hlcmUoIHF1ZXJ5IClcbiAgICAgICAgICAgICAgICAuY291bnQoICk7XG5cbiAgICAgICAgICAgIC8vIOiOt+WPluaVsOaNrlxuICAgICAgICAgICAgY29uc3QgZGF0YSQgPSBhd2FpdCBkYi5jb2xsZWN0aW9uKCdnb29kcycpXG4gICAgICAgICAgICAgICAgLndoZXJlKCBxdWVyeSApXG4gICAgICAgICAgICAgICAgLmxpbWl0KCBsaW1pdCApXG4gICAgICAgICAgICAgICAgLnNraXAoKCBwYWdlIC0gMSApICogbGltaXQgKVxuICAgICAgICAgICAgICAgIC5vcmRlckJ5KCdzYWxlZCcsICdkZXNjJylcbiAgICAgICAgICAgICAgICAuZ2V0KCApO1xuXG4gICAgICAgICAgICAvLyDmi7zmjqXlnovlj7fmiJbllYblk4HmtLvliqhcbiAgICAgICAgICAgIGNvbnN0IGFjdGl2aXRpZXMkID0gYXdhaXQgUHJvbWlzZS5hbGwoIGRhdGEkLmRhdGEubWFwKCBnb29kID0+IHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZGIuY29sbGVjdGlvbignYWN0aXZpdHknKVxuICAgICAgICAgICAgICAgICAgICAud2hlcmUoe1xuICAgICAgICAgICAgICAgICAgICAgICAgcGlkOiBnb29kLl9pZCxcbiAgICAgICAgICAgICAgICAgICAgICAgIGlzQ2xvc2VkOiBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGlzRGVsZXRlZDogZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiAnZ29vZF9kaXNjb3VudCdcbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgLmZpZWxkKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHBpZDogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHNpZDogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHRpdGxlOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICAgICAgYWNfcHJpY2U6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgICAgICBlbmRUaW1lOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICAgICAgYWNfZ3JvdXBQcmljZTogdHJ1ZVxuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAuZ2V0KCApO1xuICAgICAgICAgICAgfSkpO1xuXG4gICAgICAgICAgICBjb25zdCBpbnNlcnRBY3Rpdml0aWVzID0gZGF0YSQuZGF0YS5tYXAoKCBtZXRhLCBrICkgPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiBPYmplY3QuYXNzaWduKHsgfSwgbWV0YSwge1xuICAgICAgICAgICAgICAgICAgICBhY3Rpdml0eTogYWN0aXZpdGllcyRbIGsgXS5kYXRhLmxlbmd0aCA9PT0gMCA/IG51bGwgOiBhY3Rpdml0aWVzJFsgayBdLmRhdGFbIDAgXVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSlcblxuICAgICAgICAgICAgcmV0dXJuIGN0eC5ib2R5ID0ge1xuICAgICAgICAgICAgICAgIHN0YXR1czogMjAwLFxuICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgcGFnZSxcbiAgICAgICAgICAgICAgICAgICAgcGFnZVNpemU6IGxpbWl0LFxuICAgICAgICAgICAgICAgICAgICBkYXRhOiBpbnNlcnRBY3Rpdml0aWVzLFxuICAgICAgICAgICAgICAgICAgICB0b3RhbDogdG90YWwkLnRvdGFsLFxuICAgICAgICAgICAgICAgICAgICB0b3RhbFBhZ2U6IE1hdGguY2VpbCggdG90YWwkLnRvdGFsIC8gbGltaXQgKSxcbiAgICAgICAgICAgICAgICAgICAgc2VhcmNoOiAhIXNlYXJjaCA/IHNlYXJjaC5yZXBsYWNlKCAvXFxzKy9nLCAnJyApIDogdW5kZWZpbmVkXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfTtcblxuICAgICAgICB9IGNhdGNoICggZSApIHtcbiAgICAgICAgICAgIHJldHVybiBjdHguYm9keSA9IHsgc3RhdHVzOiA1MDAgfTtcbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgLyoqXG4gICAgICogQGRlc2NyaXB0aW9uXG4gICAgICog566h55CG56uvIOS4iuS4i+aetuWVhuWTgVxuICAgICAqIHtcbiAgICAgKiAgICBwaWQsXG4gICAgICogICAgdmlzaWFibGVcbiAgICAgKiB9XG4gICAgICovXG4gICAgYXBwLnJvdXRlcignc2V0LXZpc2lhYmxlJywgYXN5bmMoIGN0eCwgbmV4dCApID0+IHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGNvbnN0IHsgcGlkLCB2aXNpYWJsZSB9ID0gZXZlbnQuZGF0YTtcbiAgICAgICAgICAgIGF3YWl0IGRiLmNvbGxlY3Rpb24oJ2dvb2RzJylcbiAgICAgICAgICAgICAgICAuZG9jKCBwaWQgKVxuICAgICAgICAgICAgICAgIC51cGRhdGUoe1xuICAgICAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2aXNpYWJsZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHVwZGF0ZVRpbWU6IG5ldyBEYXRlKCApLmdldFRpbWUoIClcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICByZXR1cm4gY3R4LmJvZHkgPSB7IHN0YXR1czogMjAwIH07XG4gICAgICAgICAgICBcbiAgICAgICAgfSBjYXRjaCAoIGUgKSB7XG4gICAgICAgICAgICByZXR1cm4gY3R4LmJvZHkgPSB7IHN0YXR1czogNTAwIH07XG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgIC8qKlxuICAgICAqIEBkZXNjcmlwdGlvblxuICAgICAqIOWIoOmZpOWVhuWTgVxuICAgICAqIHtcbiAgICAgKiAgICBwaWQgXG4gICAgICogfVxuICAgICAqL1xuICAgIGFwcC5yb3V0ZXIoJ2RlbGV0ZScsIGFzeW5jKCBjdHgsIG5leHQgKSA9PiB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBjb25zdCB7IHBpZCB9ID0gZXZlbnQuZGF0YTtcbiAgICAgICAgICAgIGF3YWl0IGRiLmNvbGxlY3Rpb24oJ2dvb2RzJylcbiAgICAgICAgICAgICAgICAuZG9jKCBTdHJpbmcoIHBpZCApKVxuICAgICAgICAgICAgICAgIC51cGRhdGUoe1xuICAgICAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpc0RlbGV0ZTogdHJ1ZVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICByZXR1cm4gY3R4LmJvZHkgPSB7XG4gICAgICAgICAgICAgICAgZGF0YTogcGlkLFxuICAgICAgICAgICAgICAgIHN0YXR1czogMjAwXG4gICAgICAgICAgICB9O1xuXG4gICAgICAgIH0gY2F0Y2ggKCBlICkge1xuICAgICAgICAgICAgcmV0dXJuIGN0eC5ib2R5ID0geyBzdGF0dXM6IDUwMCB9O1xuICAgICAgICB9XG4gICAgfSlcblxuICAgIHJldHVybiBhcHAuc2VydmUoICk7XG5cbn07Il19