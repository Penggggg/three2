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
cloud.init();
var db = cloud.database();
var _ = db.command;
exports.main = function (event, context) { return __awaiter(_this, void 0, void 0, function () {
    var app;
    var _this = this;
    return __generator(this, function (_a) {
        app = new TcbRouter({ event: event });
        app.router('detail', function (ctx, next) { return __awaiter(_this, void 0, void 0, function () {
            var data$, metaList, standards_1, insertStandars, e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4, db.collection('goods')
                                .where({
                                _id: event.data._id
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
                        insertStandars = metaList.map(function (x, k) { return Object.assign({}, x, {
                            standards: standards_1[k].data
                        }); });
                        return [2, ctx.body = {
                                status: 200,
                                data: insertStandars[0]
                            }];
                    case 3:
                        e_1 = _a.sent();
                        return [2, ctx.body = {
                                status: 500,
                                message: e_1
                            }];
                    case 4: return [2];
                }
            });
        }); });
        app.router('rank', function (ctx, next) { return __awaiter(_this, void 0, void 0, function () {
            var limit, category, search$, search, total$, data$, standards_2, insertStandars, e_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 4, , 5]);
                        limit = 20;
                        category = event.data.category;
                        search$ = event.data.search || '';
                        search = new RegExp(search$.replace(/\s+/g, ""), 'i');
                        return [4, db.collection('goods')
                                .where({
                                category: category,
                                title: search
                            })
                                .count()];
                    case 1:
                        total$ = _a.sent();
                        return [4, db.collection('goods')
                                .where({
                                category: category,
                                title: search
                            })
                                .limit(limit)
                                .skip((event.data.page - 1) * limit)
                                .orderBy('saled', 'desc')
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
                        standards_2 = _a.sent();
                        insertStandars = data$.data.map(function (x, k) { return Object.assign({}, x, {
                            standards: standards_2[k].data
                        }); });
                        return [2, ctx.body = {
                                status: 200,
                                data: {
                                    search: search$.replace(/\s+/g),
                                    pageSize: limit,
                                    page: event.data.page,
                                    data: insertStandars,
                                    total: total$.total,
                                    totalPage: Math.ceil(total$.total / limit)
                                }
                            }];
                    case 4:
                        e_2 = _a.sent();
                        return [2, ctx.body = {
                                status: 500,
                                message: e_2
                            }];
                    case 5: return [2];
                }
            });
        }); });
        app.router('list', function (ctx, next) { return __awaiter(_this, void 0, void 0, function () {
            var limit, searchReq_1, temp_1, total$, data$, metaList, standards_3, insertStandars, carts_1, insertCart, e_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 5, , 6]);
                        limit = 20;
                        searchReq_1 = {
                            title: (!!event.data.title && !!event.data.title.trim()) ?
                                new RegExp(event.data.title.replace(/\s+/g, ""), 'i') : null
                        };
                        temp_1 = {};
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
                                    search: event.data.title.replace(/\s+/g),
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
            var _id_1, standards, create$, meta, title, category, depositPrice, detail, fadePrice, img, limit, saled, standards_4, tag, updateTime, visiable, price, groupPrice, stock, allStandards$, wouldSetDelete_1, wouldUpdate_1, wouldCreate, e_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 11, , 12]);
                        _id_1 = event.data._id;
                        if (!!_id_1) return [3, 4];
                        standards = event.data.standards;
                        delete event.data['standards'];
                        return [4, db.collection('goods').add({
                                data: event.data,
                            })];
                    case 1:
                        create$ = _a.sent();
                        _id_1 = create$._id;
                        if (!(!!standards && Array.isArray(standards))) return [3, 3];
                        return [4, Promise.all(standards.map(function (x) {
                                return db.collection('standards').add({
                                    data: Object.assign({}, x, {
                                        pid: _id_1,
                                        isDelete: false
                                    })
                                });
                            }))];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3: return [3, 10];
                    case 4:
                        meta = Object.assign({}, event.data);
                        delete meta[_id_1];
                        title = meta.title, category = meta.category, depositPrice = meta.depositPrice, detail = meta.detail, fadePrice = meta.fadePrice, img = meta.img, limit = meta.limit, saled = meta.saled, standards_4 = meta.standards, tag = meta.tag, updateTime = meta.updateTime, visiable = meta.visiable, price = meta.price, groupPrice = meta.groupPrice, stock = meta.stock;
                        return [4, db.collection('goods').doc(_id_1).update({
                                data: {
                                    tag: tag,
                                    img: img,
                                    stock: stock,
                                    price: price,
                                    limit: limit,
                                    title: title,
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
                    case 5:
                        _a.sent();
                        return [4, db.collection('standards')
                                .where({
                                pid: _id_1
                            })
                                .get()];
                    case 6:
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
                    case 7:
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
                    case 8:
                        _a.sent();
                        return [4, Promise.all(wouldCreate.map(function (x) {
                                return db.collection('standards').add({
                                    data: Object.assign({}, x, {
                                        pid: _id_1,
                                        isDelete: false
                                    })
                                });
                            }))];
                    case 9:
                        _a.sent();
                        _a.label = 10;
                    case 10: return [2, ctx.body = {
                            data: _id_1,
                            status: 200
                        }];
                    case 11:
                        e_4 = _a.sent();
                        return [2, ctx.body = {
                                status: 500,
                                message: e_4
                            }];
                    case 12: return [2];
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
        return [2, app.serve()];
    });
}); };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSxpQkEyYUU7O0FBM2FGLHFDQUF1QztBQUN2QyxzQ0FBd0M7QUFFeEMsS0FBSyxDQUFDLElBQUksRUFBRyxDQUFDO0FBRWQsSUFBTSxFQUFFLEdBQWdCLEtBQUssQ0FBQyxRQUFRLEVBQUcsQ0FBQztBQUMxQyxJQUFNLENBQUMsR0FBRyxFQUFFLENBQUMsT0FBTyxDQUFDO0FBaUNSLFFBQUEsSUFBSSxHQUFHLFVBQVEsS0FBSyxFQUFFLE9BQU87Ozs7UUFFaEMsR0FBRyxHQUFHLElBQUksU0FBUyxDQUFDLEVBQUUsS0FBSyxPQUFBLEVBQUUsQ0FBQyxDQUFDO1FBRXJDLEdBQUcsQ0FBQyxNQUFNLENBQUMsUUFBUSxFQUFFLFVBQU8sR0FBRyxFQUFFLElBQUk7Ozs7Ozt3QkFJZixXQUFNLEVBQUUsQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDO2lDQUNyQyxLQUFLLENBQUM7Z0NBQ0gsR0FBRyxFQUFFLEtBQUssQ0FBQyxJQUFJLENBQUMsR0FBRzs2QkFDdEIsQ0FBQztpQ0FDRCxHQUFHLEVBQUcsRUFBQTs7d0JBSkwsS0FBSyxHQUFHLFNBSUg7d0JBRUwsUUFBUSxHQUFHLEtBQUssQ0FBQyxJQUFJLENBQUM7d0JBQ1YsV0FBTSxPQUFPLENBQUMsR0FBRyxDQUFFLFFBQVEsQ0FBQyxHQUFHLENBQUUsVUFBQSxDQUFDO2dDQUNoRCxPQUFPLEVBQUUsQ0FBQyxVQUFVLENBQUMsV0FBVyxDQUFDO3FDQUM1QixLQUFLLENBQUM7b0NBQ0gsR0FBRyxFQUFFLENBQUMsQ0FBQyxHQUFHO29DQUNWLFFBQVEsRUFBRSxLQUFLO2lDQUNsQixDQUFDO3FDQUNELEdBQUcsRUFBRyxDQUFDOzRCQUNoQixDQUFDLENBQUMsQ0FBQyxFQUFBOzt3QkFQRyxjQUFZLFNBT2Y7d0JBRUcsY0FB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RXZCLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBjbG91ZCBmcm9tICd3eC1zZXJ2ZXItc2RrJztcbmltcG9ydCAqIGFzIFRjYlJvdXRlciBmcm9tICd0Y2Itcm91dGVyJztcblxuY2xvdWQuaW5pdCggKTtcblxuY29uc3QgZGI6IERCLkRhdGFiYXNlID0gY2xvdWQuZGF0YWJhc2UoICk7XG5jb25zdCBfID0gZGIuY29tbWFuZDtcblxuLyoqXG4gKiBcbiAqIEBkZXNjcmlwdGlvbiDliJvlu7ov57yW6L6R5ZWG5ZOBXG4gKiB7XG4gKiAgICAgIF9pZDogaWRcbiAqICAgICAgaXNEZWxldGU6IOaYr+WQpuWIoOmZpFxuICogICAgICB0aXRsZTog5ZWG5ZOB5ZCN56ewIFN0cmluZ1xuICogICAgICBkZXRhaWwhOiDllYblk4Hmj4/ov7AgU3RyaW5nXG4gKiAgICAgIHRhZzog5ZWG5ZOB5qCH562+IEFycmF5PFN0cmluZz5cbiAqICAgICAgY2F0ZWdvcnk6IOWVhuWTgeexu+ebriBTdHJpbmdcbiAqICAgICAgaW1nOiDllYblk4Hlm77niYcgQXJyYXk8U3RyaW5nPlxuICogICAgICBwcmljZTog5Lu35qC8IE51bWJlclxuICogICAgICBmYWRlUHJpY2U6IOWIkue6v+S7tyBOdW1iZXJcbiAqICAgICAgZ3JvdXBQcmljZSE6IOWboui0reS7tyBOdW1iZXJcbiAqICAgICAgc3RvY2shOiDlupPlrZggTnVtYmVyXG4gKiAgICAgIGRlcG9zaXRQcmljZSE6IOWVhuWTgeiuoumHkSBOdW1iZXJcbiAqICAgICAgbGltaXQhOiDpmZDotK3mlbDph48gTnVtYmVyXG4gKiAgICAgIHZpc2lhYmxlOiDmmK/lkKbkuIrmnrYgQm9vbGVhblxuICogICAgICBzYWxlZDog6ZSA6YePIE51bWJlclxuICohICAgICAgc3RhbmRhcmRzITog5Z6L5Y+36KeE5qC8IEFycmF5PHsgXG4gKiAgICAgICAgICBuYW1lOiBTdHJpbmcsXG4gKiAgICAgICAgICBwcmljZTogTnVtYmVyLFxuICogICAgICAgICAgZ3JvdXBQcmljZSE6IE51bWJlcixcbiAqICAgICAgICAgIHN0b2NrITogTnVtYmVyOlxuICogICAgICAgICAgaW1nOiBTdHJpbmcgLFxuICogICAgICAgICAgX2lkOiBzdHJpbmcsXG4gKiAgICAgICAgICBwaWQ6IHN0cmluZyxcbiAqICAgICAgICAgIGlzRGVsZXRlOiBib29sZWFuXG4gKiAgICAgIH0+XG4gKiB9XG4gKi9cbmV4cG9ydCBjb25zdCBtYWluID0gYXN5bmMgKCBldmVudCwgY29udGV4dCApID0+IHtcblxuICAgIGNvbnN0IGFwcCA9IG5ldyBUY2JSb3V0ZXIoeyBldmVudCB9KTtcblxuICAgIGFwcC5yb3V0ZXIoJ2RldGFpbCcsIGFzeW5jKCBjdHgsIG5leHQgKSA9PiB7XG4gICAgICAgIHRyeSB7XG5cbiAgICAgICAgICAgIC8vIOiOt+WPluaVsOaNrlxuICAgICAgICAgICAgY29uc3QgZGF0YSQgPSBhd2FpdCBkYi5jb2xsZWN0aW9uKCdnb29kcycpXG4gICAgICAgICAgICAgICAgLndoZXJlKHtcbiAgICAgICAgICAgICAgICAgICAgX2lkOiBldmVudC5kYXRhLl9pZFxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLmdldCggKTtcblxuICAgICAgICAgICAgY29uc3QgbWV0YUxpc3QgPSBkYXRhJC5kYXRhO1xuICAgICAgICAgICAgY29uc3Qgc3RhbmRhcmRzID0gYXdhaXQgUHJvbWlzZS5hbGwoIG1ldGFMaXN0Lm1hcCggeCA9PiB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGRiLmNvbGxlY3Rpb24oJ3N0YW5kYXJkcycpXG4gICAgICAgICAgICAgICAgICAgIC53aGVyZSh7XG4gICAgICAgICAgICAgICAgICAgICAgICBwaWQ6IHguX2lkLFxuICAgICAgICAgICAgICAgICAgICAgICAgaXNEZWxldGU6IGZhbHNlXG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgIC5nZXQoICk7XG4gICAgICAgICAgICB9KSk7XG5cbiAgICAgICAgICAgIGNvbnN0IGluc2VydFN0YW5kYXJzID0gbWV0YUxpc3QubWFwKCggeCwgayApID0+IE9iamVjdC5hc3NpZ24oeyB9LCB4LCB7XG4gICAgICAgICAgICAgICAgc3RhbmRhcmRzOiBzdGFuZGFyZHNbIGsgXS5kYXRhXG4gICAgICAgICAgICB9KSk7XG5cbiAgICAgICAgICAgIHJldHVybiBjdHguYm9keSA9IHtcbiAgICAgICAgICAgICAgICBzdGF0dXM6IDIwMCxcbiAgICAgICAgICAgICAgICBkYXRhOiBpbnNlcnRTdGFuZGFyc1sgMCBdXG4gICAgICAgICAgICB9O1xuXG4gICAgICAgIH0gY2F0Y2ggKCBlICkge1xuICAgICAgICAgICAgcmV0dXJuIGN0eC5ib2R5ID0ge1xuICAgICAgICAgICAgICAgIHN0YXR1czogNTAwLFxuICAgICAgICAgICAgICAgIG1lc3NhZ2U6IGVcbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgIC8qKlxuICAgICAqIEBkZXNjcmlwdGlvbiDllYblk4HplIDph4/mjpLooYzmppzliJfooahcbiAgICAgKiAtLS0tLS0tLSDor7fmsYIgLS0tLS0tLS0tLVxuICAgICAqIHtcbiAgICAgKiAgICAgIHBhZ2U6IOmhteaVsFxuICAgICAqICAgICAgc2VhcmNoOiDmkJzntKJcbiAgICAgKiAgICAgIGNhdGVnb3J5OiDllYblk4Hnsbvnm65cbiAgICAgKiB9XG4gICAgICogLS0tLS0tLS0tLSDov5Tlm54gLS0tLS0tLS1cbiAgICAgKiB7XG4gICAgICogICAgICBkYXRhOiDliJfooahcbiAgICAgKiAgICAgIHBhZ2U6IOmhteaVsFxuICAgICAqICAgICAgdG90YWw6IOaAu+aVsFxuICAgICAqICAgICAgdG90YWxQYWdlOiDmgLvpobXmlbBcbiAgICAgKiAgICAgIHBhZ2VTaXplOiAyMFxuICAgICAqIH1cbiAgICAgKi9cbiAgICBhcHAucm91dGVyKCdyYW5rJywgYXN5bmMoIGN0eCwgbmV4dCApID0+IHtcbiAgICAgICAgdHJ5IHtcblxuICAgICAgICAgICAgLy8g5p+l6K+i5p2h5pWwXG4gICAgICAgICAgICBjb25zdCBsaW1pdCA9IDIwO1xuICAgICAgICAgICAgY29uc3QgeyBjYXRlZ29yeSB9ID0gZXZlbnQuZGF0YTtcbiAgICAgICAgICAgIGNvbnN0IHNlYXJjaCQgPSBldmVudC5kYXRhLnNlYXJjaCB8fCAnJztcbiAgICAgICAgICAgIGNvbnN0IHNlYXJjaCA9IG5ldyBSZWdFeHAoIHNlYXJjaCQucmVwbGFjZSgvXFxzKy9nLCBcIlwiKSwgJ2knKTtcblxuICAgICAgICAgICAgLy8g6I635Y+W5oC75pWwXG4gICAgICAgICAgICBjb25zdCB0b3RhbCQgPSBhd2FpdCBkYi5jb2xsZWN0aW9uKCdnb29kcycpXG4gICAgICAgICAgICAgICAgLndoZXJlKHtcbiAgICAgICAgICAgICAgICAgICAgY2F0ZWdvcnksXG4gICAgICAgICAgICAgICAgICAgIHRpdGxlOiBzZWFyY2hcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIC5jb3VudCggKTtcblxuICAgICAgICAgICAgLy8g6I635Y+W5pWw5o2uXG4gICAgICAgICAgICBjb25zdCBkYXRhJCA9IGF3YWl0IGRiLmNvbGxlY3Rpb24oJ2dvb2RzJylcbiAgICAgICAgICAgICAgICAud2hlcmUoe1xuICAgICAgICAgICAgICAgICAgICBjYXRlZ29yeSxcbiAgICAgICAgICAgICAgICAgICAgdGl0bGU6IHNlYXJjaFxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLmxpbWl0KCBsaW1pdCApXG4gICAgICAgICAgICAgICAgLnNraXAoKCBldmVudC5kYXRhLnBhZ2UgLSAxICkgKiBsaW1pdCApXG4gICAgICAgICAgICAgICAgLm9yZGVyQnkoJ3NhbGVkJywgJ2Rlc2MnKVxuICAgICAgICAgICAgICAgIC5nZXQoICk7XG5cbiAgICAgICAgICAgIGNvbnN0IHN0YW5kYXJkcyA9IGF3YWl0IFByb21pc2UuYWxsKCBkYXRhJC5kYXRhLm1hcCggeCA9PiB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGRiLmNvbGxlY3Rpb24oJ3N0YW5kYXJkcycpXG4gICAgICAgICAgICAgICAgICAgIC53aGVyZSh7XG4gICAgICAgICAgICAgICAgICAgICAgICBwaWQ6IHguX2lkLFxuICAgICAgICAgICAgICAgICAgICAgICAgaXNEZWxldGU6IGZhbHNlXG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgIC5nZXQoICk7XG4gICAgICAgICAgICB9KSk7XG5cbiAgICAgICAgICAgIGNvbnN0IGluc2VydFN0YW5kYXJzID0gZGF0YSQuZGF0YS5tYXAoKCB4LCBrICkgPT4gT2JqZWN0LmFzc2lnbih7IH0sIHgsIHtcbiAgICAgICAgICAgICAgICBzdGFuZGFyZHM6IHN0YW5kYXJkc1sgayBdLmRhdGFcbiAgICAgICAgICAgIH0pKTtcblxuICAgICAgICAgICAgcmV0dXJuIGN0eC5ib2R5ID0ge1xuICAgICAgICAgICAgICAgIHN0YXR1czogMjAwLFxuICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgc2VhcmNoOiBzZWFyY2gkLnJlcGxhY2UoL1xccysvZyksXG4gICAgICAgICAgICAgICAgICAgIHBhZ2VTaXplOiBsaW1pdCxcbiAgICAgICAgICAgICAgICAgICAgcGFnZTogZXZlbnQuZGF0YS5wYWdlLFxuICAgICAgICAgICAgICAgICAgICBkYXRhOiBpbnNlcnRTdGFuZGFycyxcbiAgICAgICAgICAgICAgICAgICAgdG90YWw6IHRvdGFsJC50b3RhbCxcbiAgICAgICAgICAgICAgICAgICAgdG90YWxQYWdlOiBNYXRoLmNlaWwoIHRvdGFsJC50b3RhbCAvIGxpbWl0IClcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgXG4gICAgICAgIH0gY2F0Y2ggKCBlICkge1xuICAgICAgICAgICAgcmV0dXJuIGN0eC5ib2R5ID0ge1xuICAgICAgICAgICAgICAgIHN0YXR1czogNTAwLFxuICAgICAgICAgICAgICAgIG1lc3NhZ2U6IGVcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgYXBwLnJvdXRlcignbGlzdCcsIGFzeW5jKCBjdHgsIG5leHQgKSA9PiB7XG4gICAgICAgIHRyeSB7XG4gICAgIFxuICAgICAgICAgICAgLy8g5p+l6K+i5p2h5pWwXG4gICAgICAgICAgICBjb25zdCBsaW1pdCA9IDIwO1xuXG4gICAgICAgICAgICAvLyDmn6Xor6LmnaHku7ZcbiAgICAgICAgICAgIGNvbnN0IHNlYXJjaFJlcSA9IHtcbiAgICAgICAgICAgICAgICB0aXRsZTogKCEhZXZlbnQuZGF0YS50aXRsZSAmJiAhIWV2ZW50LmRhdGEudGl0bGUudHJpbSggKSkgPyBcbiAgICAgICAgICAgICAgICAgICAgbmV3IFJlZ0V4cChldmVudC5kYXRhLnRpdGxlLnJlcGxhY2UoL1xccysvZywgXCJcIiksICdpJykgOiBudWxsXG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICBjb25zdCB0ZW1wID0geyB9O1xuICAgICAgICAgICAgT2JqZWN0LmtleXMoIHNlYXJjaFJlcSApLm1hcCgga2V5ID0+IHtcbiAgICAgICAgICAgICAgICBpZiAoICEhc2VhcmNoUmVxWyBrZXkgXSkge1xuICAgICAgICAgICAgICAgICAgICB0ZW1wWyBrZXkgXSA9IHNlYXJjaFJlcVsga2V5IF07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIC8vIOiOt+WPluaAu+aVsFxuICAgICAgICAgICAgY29uc3QgdG90YWwkID0gYXdhaXQgZGIuY29sbGVjdGlvbignZ29vZHMnKVxuICAgICAgICAgICAgICAgIC53aGVyZSggdGVtcCApXG4gICAgICAgICAgICAgICAgLmNvdW50KCApO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICAvLyDojrflj5bmlbDmja5cbiAgICAgICAgICAgIGNvbnN0IGRhdGEkID0gYXdhaXQgZGIuY29sbGVjdGlvbignZ29vZHMnKVxuICAgICAgICAgICAgICAgIC53aGVyZSggdGVtcCApXG4gICAgICAgICAgICAgICAgLmxpbWl0KCBsaW1pdCApXG4gICAgICAgICAgICAgICAgLnNraXAoKCBldmVudC5kYXRhLnBhZ2UgLSAxICkgKiBsaW1pdCApXG4gICAgICAgICAgICAgICAgLm9yZGVyQnkoJ3VwZGF0ZVRpbWUnLCAnZGVzYycpXG4gICAgICAgICAgICAgICAgLmdldCggKTtcblxuIFxuXG4gICAgICAgICAgICBjb25zdCBtZXRhTGlzdCA9IGRhdGEkLmRhdGE7XG4gICAgICAgICAgICBjb25zdCBzdGFuZGFyZHMgPSBhd2FpdCBQcm9taXNlLmFsbCggbWV0YUxpc3QubWFwKCB4ID0+IHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZGIuY29sbGVjdGlvbignc3RhbmRhcmRzJylcbiAgICAgICAgICAgICAgICAgICAgLndoZXJlKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHBpZDogeC5faWQsXG4gICAgICAgICAgICAgICAgICAgICAgICBpc0RlbGV0ZTogZmFsc2VcbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgLmdldCggKTtcbiAgICAgICAgICAgIH0pKTtcblxuICAgICAgICAgICAgY29uc3QgaW5zZXJ0U3RhbmRhcnMgPSBtZXRhTGlzdC5tYXAoKCB4LCBrICkgPT4gT2JqZWN0LmFzc2lnbih7IH0sIHgsIHtcbiAgICAgICAgICAgICAgICBzdGFuZGFyZHM6IHN0YW5kYXJkc1sgayBdLmRhdGFcbiAgICAgICAgICAgIH0pKTtcbiAgIFxuICAgICAgICAgICAgLy8g5p+l6K+i6KKr5Yqg5YWl6LSt54mp6L2m5pWw6YePXG4gICAgICAgICAgICBjb25zdCBjYXJ0cyA9IGF3YWl0IFByb21pc2UuYWxsKCBpbnNlcnRTdGFuZGFycy5tYXAoIHggPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiBkYi5jb2xsZWN0aW9uKCdjYXJ0JylcbiAgICAgICAgICAgICAgICAgICAgICAgIC53aGVyZSh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcGlkOiB4Ll9pZFxuICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgICAgIC5jb3VudCggKTtcbiAgICAgICAgICAgIH0pKTtcblxuICAgICAgICAgICAgY29uc3QgaW5zZXJ0Q2FydCA9IGluc2VydFN0YW5kYXJzLm1hcCgoIHgsIGsgKSA9PiBPYmplY3QuYXNzaWduKHsgfSwgeCwge1xuICAgICAgICAgICAgICAgIGNhcnRzOiBjYXJ0c1sgayBdLnRvdGFsXG4gICAgICAgICAgICB9KSk7XG5cbiAgICAgICAgICAgIHJldHVybiBjdHguYm9keSA9IHtcbiAgICAgICAgICAgICAgICBzdGF0dXM6IDIwMCxcbiAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICAgIHNlYXJjaDogZXZlbnQuZGF0YS50aXRsZS5yZXBsYWNlKC9cXHMrL2cpLFxuICAgICAgICAgICAgICAgICAgICBwYWdlU2l6ZTogbGltaXQsXG4gICAgICAgICAgICAgICAgICAgIHBhZ2U6IGV2ZW50LmRhdGEucGFnZSxcbiAgICAgICAgICAgICAgICAgICAgZGF0YTogaW5zZXJ0Q2FydCxcbiAgICAgICAgICAgICAgICAgICAgdG90YWw6IHRvdGFsJC50b3RhbCxcbiAgICAgICAgICAgICAgICAgICAgdG90YWxQYWdlOiBNYXRoLmNlaWwoIHRvdGFsJC50b3RhbCAvIGxpbWl0IClcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgIH0gY2F0Y2ggKCBlICkge1xuICAgICAgICAgICAgcmV0dXJuIGN0eC5ib2R5ID0ge1xuICAgICAgICAgICAgICAgIHN0YXR1czogNTAwLFxuICAgICAgICAgICAgICAgIG1lc3NhZ2U6IGVcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBcbiAgICB9KTtcblxuICAgIGFwcC5yb3V0ZXIoJ2VkaXQnLCBhc3luYyggY3R4LCBuZXh0ICkgPT4ge1xuICAgICAgICB0cnkge1xuXG4gICAgICAgICAgICBsZXQgX2lkID0gZXZlbnQuZGF0YS5faWQ7XG4gICAgICAgICAgICBpZiAoICFfaWQgKSB7XG4gICAgICAgICAgICAgICAgLy8g5Yib5bu6XG4gICAgICAgICAgICAgICAgY29uc3QgeyBzdGFuZGFyZHMgfSA9IGV2ZW50LmRhdGE7XG4gICAgXG4gICAgICAgICAgICAgICAgZGVsZXRlIGV2ZW50LmRhdGFbJ3N0YW5kYXJkcyddO1xuICAgIFxuICAgICAgICAgICAgICAgIGNvbnN0IGNyZWF0ZSQgPSBhd2FpdCBkYi5jb2xsZWN0aW9uKCdnb29kcycpLmFkZCh7XG4gICAgICAgICAgICAgICAgICAgIGRhdGE6IGV2ZW50LmRhdGEsXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgX2lkID0gY3JlYXRlJC5faWQ7XG4gICAgXG4gICAgICAgICAgICAgICAgLy8g5o+S5YWl5Z6L5Y+3XG4gICAgICAgICAgICAgICAgaWYgKCAhIXN0YW5kYXJkcyAmJiBBcnJheS5pc0FycmF5KCBzdGFuZGFyZHMgKSkge1xuICAgICAgICAgICAgICAgICAgICBhd2FpdCBQcm9taXNlLmFsbCggc3RhbmRhcmRzLm1hcCggeCA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gZGIuY29sbGVjdGlvbignc3RhbmRhcmRzJykuYWRkKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhOiBPYmplY3QuYXNzaWduKHsgfSwgeCwge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwaWQ6IF9pZCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaXNEZWxldGU6IGZhbHNlXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICB9KSlcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgIFxuICAgICAgICAgICAgICAgIC8vIOabtOaWsFxuICAgICAgICAgICAgICAgIGNvbnN0IG1ldGEgPSBPYmplY3QuYXNzaWduKHsgfSwgZXZlbnQuZGF0YSApO1xuICAgICAgICAgICAgICAgIGRlbGV0ZSBtZXRhWyBfaWQgXTtcbiAgICAgICAgICAgICAgICBjb25zdCB7IHRpdGxlLCBjYXRlZ29yeSwgZGVwb3NpdFByaWNlLCBkZXRhaWwsIGZhZGVQcmljZSwgaW1nLCBsaW1pdCwgc2FsZWQsIFxuICAgICAgICAgICAgICAgICAgICBzdGFuZGFyZHMsIHRhZywgdXBkYXRlVGltZSwgdmlzaWFibGUsIHByaWNlLCBncm91cFByaWNlLCBzdG9jayB9ID0gbWV0YTtcbiAgICAgICAgICAgICAgICBhd2FpdCBkYi5jb2xsZWN0aW9uKCdnb29kcycpLmRvYyggX2lkICkudXBkYXRlKHtcbiAgICAgICAgICAgICAgICAgICAgZGF0YTogeyBcbiAgICAgICAgICAgICAgICAgICAgICAgIHRhZyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGltZyxcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0b2NrLFxuICAgICAgICAgICAgICAgICAgICAgICAgcHJpY2UsXG4gICAgICAgICAgICAgICAgICAgICAgICBsaW1pdCxcbiAgICAgICAgICAgICAgICAgICAgICAgIHRpdGxlLFxuICAgICAgICAgICAgICAgICAgICAgICAgZGV0YWlsLFxuICAgICAgICAgICAgICAgICAgICAgICAgc2FsZWQsXG4gICAgICAgICAgICAgICAgICAgICAgICBncm91cFByaWNlLFxuICAgICAgICAgICAgICAgICAgICAgICAgY2F0ZWdvcnksXG4gICAgICAgICAgICAgICAgICAgICAgICBmYWRlUHJpY2UsXG4gICAgICAgICAgICAgICAgICAgICAgICB2aXNpYWJsZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHVwZGF0ZVRpbWUsXG4gICAgICAgICAgICAgICAgICAgICAgICBkZXBvc2l0UHJpY2VcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgIFxuICAgICAgICAgICAgICAgIC8vIDAuIOafpeivouivpeS6p+WTgeW6leS4i+aJgOacieeahOWei+WPt1xuICAgICAgICAgICAgICAgIGNvbnN0IGFsbFN0YW5kYXJkcyQgPSBhd2FpdCBkYi5jb2xsZWN0aW9uKCdzdGFuZGFyZHMnKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLndoZXJlKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwaWQ6IF9pZFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5nZXQoICk7XG4gICAgXG4gICAgICAgICAgICAgICAgLy8g6ZyA6KaB4oCc5Yig6Zmk4oCd55qE5Z6L5Y+3XG4gICAgICAgICAgICAgICAgY29uc3Qgd291bGRTZXREZWxldGU6IGFueVsgXSA9IFsgXTtcbiAgICBcbiAgICAgICAgICAgICAgICAvLyDpnIDopoHigJzmm7TmlrDigJ3nmoTlnovlj7dcbiAgICAgICAgICAgICAgICBjb25zdCB3b3VsZFVwZGF0ZTogYW55WyBdID0gWyBdO1xuICAgIFxuICAgICAgICAgICAgICAgIC8vIOmcgOimgeKAnOWinuWKoOKAneOAgeKAnOabtOaWsOKAneeahOWei+WPt1xuICAgICAgICAgICAgICAgIGNvbnN0IHdvdWxkQ3JlYXRlID0gc3RhbmRhcmRzLmZpbHRlciggeCA9PiAheC5faWQgKTtcbiAgICBcbiAgICAgICAgICAgICAgICBhbGxTdGFuZGFyZHMkLmRhdGEuZmlsdGVyKCB4ID0+IHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCAhc3RhbmRhcmRzLmZpbmQoIHkgPT4geS5faWQgPT09IHguX2lkICkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHdvdWxkU2V0RGVsZXRlLnB1c2goIHggKVxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgd291bGRVcGRhdGUucHVzaCggeCApXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICBcbiAgICAgICAgICAgICAgICAvLyAxLiAg4oCc5Yig6Zmk4oCd6YOo5YiG5Z6L5Y+3XG4gICAgICAgICAgICAgICAgYXdhaXQgUHJvbWlzZS5hbGwoIHdvdWxkU2V0RGVsZXRlLm1hcCggeCA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBkYi5jb2xsZWN0aW9uKCdzdGFuZGFyZHMnKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5kb2MoIHguX2lkIClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAudXBkYXRlKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaXNEZWxldGU6IHRydWVcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgfSkpO1xuICAgIFxuICAgICAgICAgICAgICAgIC8vIDIuIOabtOaWsOmDqOWIhuWei+WPt+S/oeaBr1xuICAgICAgICAgICAgICAgIGF3YWl0IFByb21pc2UuYWxsKCB3b3VsZFVwZGF0ZS5tYXAoIHggPT4ge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBuZXdUYXJnZXQgPSBzdGFuZGFyZHMuZmluZCggeSA9PiB5Ll9pZCA9PT0geC5faWQgKTtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgeyBuYW1lLCBwcmljZSwgZ3JvdXBQcmljZSwgc3RvY2ssIGltZyB9ID0gbmV3VGFyZ2V0O1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZGIuY29sbGVjdGlvbignc3RhbmRhcmRzJylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAuZG9jKCB4Ll9pZCApXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLnVwZGF0ZSh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5hbWUsIHByaWNlLCBncm91cFByaWNlLCBzdG9jaywgaW1nXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIH0pKTtcbiAgICBcbiAgICAgICAgICAgICAgICAvLyAzLiDmlrDlop7pg6jliIblnovlj7dcbiAgICAgICAgICAgICAgICBhd2FpdCBQcm9taXNlLmFsbCggd291bGRDcmVhdGUubWFwKCB4ID0+IHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGRiLmNvbGxlY3Rpb24oJ3N0YW5kYXJkcycpLmFkZCh7XG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRhOiBPYmplY3QuYXNzaWduKHsgfSwgeCwge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBpZDogX2lkLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlzRGVsZXRlOiBmYWxzZVxuICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICB9KSk7XG4gICAgXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiBjdHguYm9keSA9IHtcbiAgICAgICAgICAgICAgICBkYXRhOiBfaWQsXG4gICAgICAgICAgICAgICAgc3RhdHVzOiAyMDBcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgfSBjYXRjaCAoIGUgKSB7XG4gICAgICAgICAgICByZXR1cm4gY3R4LmJvZHkgPSB7XG4gICAgICAgICAgICAgICAgc3RhdHVzOiA1MDAsXG4gICAgICAgICAgICAgICAgbWVzc2FnZTogZVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSlcblxuICAgIC8qKlxuICAgICAqIEBkZXNjcmlwdGlvblxuICAgICAqIOagueaNrumihOS7mOiuouWNleeahOebuOWFs+S/oeaBr++8jOWHj+WwkeOAgeabtOaWsOaMh+WumuWVhuWTgeeahOW6k+WtmFxuICAgICAqIC0tLS0tLS0tLS0g6K+35rGCIC0tLS0tLS0tLS0tXG4gICAgICoge1xuICAgICAqICAgICAgc2lkLFxuICAgICAqICAgICAgcGlkLFxuICAgICAqICAgICAgY291bnRcbiAgICAgKiB9XG4gICAgICovXG4gICAgYXBwLnJvdXRlcigndXBkYXRlLXN0b2NrJywgYXN5bmMoIGN0eCwgbmV4dCApID0+IHtcbiAgICAgICAgdHJ5IHtcblxuICAgICAgICAgICAgY29uc3QgeyBzaWQsIHBpZCwgY291bnQgfSA9IGV2ZW50LmRhdGE7XG5cbiAgICAgICAgICAgIGxldCB0YXJnZXQ6IGFueSA9IG51bGw7XG4gICAgICAgICAgICBjb25zdCB0YXJnZXRJZCA9IHNpZCB8fCBwaWQ7XG4gICAgICAgICAgICBjb25zdCBjb2xsZWN0aW9uTmFtZSA9ICEhc2lkID8gJ3N0YW5kYXJkcycgOiAnZ29vZHMnO1xuXG4gICAgICAgICAgICBjb25zdCBmaW5kJCA9IGF3YWl0IGRiLmNvbGxlY3Rpb24oIGNvbGxlY3Rpb25OYW1lIClcbiAgICAgICAgICAgICAgICAud2hlcmUoe1xuICAgICAgICAgICAgICAgICAgICBfaWQ6IHRhcmdldElkXG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAuZ2V0KCApO1xuXG4gICAgICAgICAgICBpZiAoIGZpbmQkLmRhdGEubGVuZ3RoID09PSAwICkge1xuICAgICAgICAgICAgICAgIHRocm93ICEhc2lkID8gJ+abtOaWsOW6k+WtmOW8guW4uCwg5b2T5YmN5Z6L5Y+35LiN5a2Y5ZyoJyA6ICfmm7TmlrDlupPlrZjlvILluLgsIOW9k+WJjeWVhuWTgeS4jeWtmOWcqCdcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGFyZ2V0ID0gZmluZCQuZGF0YVsgMCBdO1xuXG4gICAgICAgICAgICAvLyDml6DpmZDlupPlrZhcbiAgICAgICAgICAgIGlmICggdGFyZ2V0LnN0b2NrID09PSBudWxsIHx8IHRhcmdldC5zdG9jayA9PT0gdW5kZWZpbmVkICkge1xuICAgICAgICAgICAgICAgIHJldHVybiBjdHguYm9keSA9IHtcbiAgICAgICAgICAgICAgICAgICAgc3RhdHVzOiAyMDBcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIOWIpOaWreW6k+WtmOaYr+WQpui2s+Wkn1xuICAgICAgICAgICAgaWYgKCB0YXJnZXQuc3RvY2sgLSBjb3VudCA8IDAgKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgISFzaWQgPyAn5pu05paw5bqT5a2Y5byC5bi4LCDlvZPliY3lnovlj7flupPlrZjkuI3otrMnIDogJ+abtOaWsOW6k+WtmOW8guW4uCwg5b2T5YmN5ZWG5ZOB5bqT5a2Y5LiN6LazJztcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8g5pu05pawXG4gICAgICAgICAgICBhd2FpdCBkYi5jb2xsZWN0aW9uKCBjb2xsZWN0aW9uTmFtZSApLmRvYyggdGFyZ2V0SWQgKVxuICAgICAgICAgICAgICAgIC51cGRhdGUoe1xuICAgICAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzdG9jazogXy5pbmMoIC1jb3VudCApXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KVxuXG4gICAgICAgICAgICByZXR1cm4gY3R4LmJvZHkgPSB7XG4gICAgICAgICAgICAgICAgc3RhdHVzOiAyMDBcbiAgICAgICAgICAgIH1cblxuICAgICAgICB9IGNhdGNoICggZSApIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGAtLS0t44CQRXJyb3ItR29vZOOAkS0tLS3vvJoke0pTT04uc3RyaW5naWZ5KCBlICl9YCk7XG4gICAgICAgICAgICByZXR1cm4gY3R4LmJvZHkgPSB7IHN0YXR1czogNTAwLCBtZXNzYWdlOiBlIH07XG4gICAgICAgIH1cbiAgICB9KVxuXG4gICAgcmV0dXJuIGFwcC5zZXJ2ZSggKTtcblxufTsiXX0=