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
exports.overtime = function () { return __awaiter(_this, void 0, void 0, function () {
    var orders$, e_1;
    var _this = this;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 4, , 5]);
                return [4, db.collection('order')
                        .where({
                        pay_status: '0',
                        base_status: '0',
                        createTime: _.lte(getNow(true) - 30 * 60 * 1000)
                    })
                        .get()];
            case 1:
                orders$ = _a.sent();
                return [4, Promise.all(orders$.data.map(function (order) {
                        return db.collection('order').doc(String(order._id))
                            .update({
                            data: {
                                base_status: '5'
                            }
                        });
                    }))];
            case 2:
                _a.sent();
                return [4, Promise.all(orders$.data.map(function (order) { return __awaiter(_this, void 0, void 0, function () {
                        var targetId, collection, target;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    targetId = order.sid || order.pid;
                                    collection = order.sid ? 'standards' : 'goods';
                                    return [4, db.collection(collection)
                                            .doc(targetId)
                                            .get()];
                                case 1:
                                    target = _a.sent();
                                    if (target.data.stock === undefined || target.data.stock === null) {
                                        return [2];
                                    }
                                    return [4, db.collection(collection).doc(targetId)
                                            .update({
                                            data: {
                                                stock: _.inc(order.count)
                                            }
                                        })];
                                case 2:
                                    _a.sent();
                                    return [2];
                            }
                        });
                    }); }))];
            case 3:
                _a.sent();
                return [2, { status: 200 }];
            case 4:
                e_1 = _a.sent();
                console.log('!!!!定时器订单overtime错误');
                return [2, { status: 500 }];
            case 5: return [2];
        }
    });
}); };
exports.payedFix = function () { return __awaiter(_this, void 0, void 0, function () {
    var orders$, e_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 4, , 5]);
                return [4, db.collection('order')
                        .where({
                        type: 'pre',
                        pay_status: '1'
                    })
                        .get()];
            case 1:
                orders$ = _a.sent();
                return [4, Promise.all(orders$.data.map(function (order) {
                        return db.collection('order').doc(String(order._id))
                            .update({
                            data: {
                                type: 'normal'
                            }
                        });
                    }))];
            case 2:
                _a.sent();
                return [4, Promise.all(orders$.data
                        .filter(function (x) { return !!x.cid; })
                        .map(function (order) {
                        return db.collection('cart').doc(order.cid)
                            .remove();
                    }))];
            case 3:
                _a.sent();
                return [2, {
                        status: 200
                    }];
            case 4:
                e_2 = _a.sent();
                console.log('!!!!定时器订单payedFix错误');
                return [2, { status: 500 }];
            case 5: return [2];
        }
    });
}); };
exports.priceFix = function () { return __awaiter(_this, void 0, void 0, function () {
    var trips$, currentTrip, tid_1, shoppinglists$, e_3;
    var _this = this;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 4, , 5]);
                return [4, cloud.callFunction({
                        name: 'trip',
                        data: {
                            $url: 'enter'
                        }
                    })];
            case 1:
                trips$ = _a.sent();
                currentTrip = trips$.result.data[0];
                if (!currentTrip) {
                    return [2, {
                            status: 200
                        }];
                }
                tid_1 = currentTrip._id;
                return [4, db.collection('shopping-list')
                        .where({
                        tid: tid_1,
                        base_status: '1'
                    })
                        .get()];
            case 2:
                shoppinglists$ = _a.sent();
                return [4, Promise.all(shoppinglists$.data.map(function (shoppingList) { return __awaiter(_this, void 0, void 0, function () {
                        var pid, sid, adjustPrice, adjustGroupPrice, orders$;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    pid = shoppingList.pid, sid = shoppingList.sid, adjustPrice = shoppingList.adjustPrice, adjustGroupPrice = shoppingList.adjustGroupPrice;
                                    return [4, db.collection('order')
                                            .where({
                                            tid: tid_1,
                                            pid: pid,
                                            sid: sid,
                                            base_status: '0'
                                        })
                                            .get()];
                                case 1:
                                    orders$ = _a.sent();
                                    return [4, Promise.all(orders$.data.map(function (order) {
                                            return db.collection('order')
                                                .doc(String(order._id))
                                                .update({
                                                data: {
                                                    allocatedPrice: adjustPrice,
                                                    allocatedGroupPrice: adjustGroupPrice,
                                                    base_status: '1'
                                                }
                                            });
                                        }))];
                                case 2:
                                    _a.sent();
                                    return [2];
                            }
                        });
                    }); }))];
            case 3:
                _a.sent();
                return [2, { status: 200 }];
            case 4:
                e_3 = _a.sent();
                console.log('!!!!定时器订单priceFix错误');
                return [2, { status: 500 }];
            case 5: return [2];
        }
    });
}); };
exports.payLastFix = function () { return __awaiter(_this, void 0, void 0, function () {
    var orders$, e_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                return [4, db.collection('order')
                        .where({
                        pay_status: '2',
                        base_status: _.or(_.eq('0'), _.eq('1'), _.eq('2'))
                    })
                        .get()];
            case 1:
                orders$ = _a.sent();
                return [4, Promise.all(orders$.data.map(function (order) {
                        return db.collection('order')
                            .doc(String(order._id))
                            .update({
                            data: {
                                base_status: '3'
                            }
                        });
                    }))];
            case 2:
                _a.sent();
                return [3, 4];
            case 3:
                e_4 = _a.sent();
                console.log('!!!!定时器订单payLastFix错误');
                return [2, { status: 500 }];
            case 4: return [2];
        }
    });
}); };
exports.pushNew = function () { return __awaiter(_this, void 0, void 0, function () {
    var nowDate, checkIsInRange, trips$, trips, trip_1, members, e_5;
    var _this = this;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 4, , 5]);
                nowDate = getNow();
                checkIsInRange = function (now) {
                    var range = [6, 12, 18, 0];
                    var result = range.some(function (x) {
                        var h = now.getHours();
                        return x === h && now.getMinutes() === 0;
                    });
                    return result;
                };
                if (!checkIsInRange(nowDate)) {
                    return [2, { status: 200 }];
                }
                return [4, cloud.callFunction({
                        data: {
                            $url: 'enter'
                        },
                        name: 'trip'
                    })];
            case 1:
                trips$ = _a.sent();
                trips = trips$.result.data;
                trip_1 = trips[0];
                return [4, db.collection('manager-member')
                        .where({
                        push: true
                    })
                        .get()];
            case 2:
                members = _a.sent();
                if (!trip_1 || members.data.length === 0) {
                    return [2, { status: 200 }];
                }
                return [4, Promise.all(members.data.map(function (member) { return __awaiter(_this, void 0, void 0, function () {
                        var count, openid, config$, tripOrderVisitConfig, query, count$, push$;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    count = 0;
                                    openid = member.openid;
                                    return [4, db.collection('analyse-data')
                                            .where({
                                            openid: openid,
                                            tid: trip_1._id,
                                            type: 'manager-trip-order-visit'
                                        })
                                            .get()];
                                case 1:
                                    config$ = _a.sent();
                                    tripOrderVisitConfig = config$.data[0];
                                    query = {
                                        tid: trip_1._id,
                                        pay_status: _.neq('0'),
                                        base_status: _.or(_.eq('0'), _.eq('1'), _.eq('2'))
                                    };
                                    if (!!tripOrderVisitConfig) {
                                        query = Object.assign({}, query, {
                                            createTime: _.gte(tripOrderVisitConfig.value)
                                        });
                                    }
                                    return [4, db.collection('order')
                                            .where(query)
                                            .count()];
                                case 2:
                                    count$ = _a.sent();
                                    count = count$.total;
                                    if (count === 0) {
                                        return [2, { staus: 200 }];
                                    }
                                    return [4, cloud.callFunction({
                                            name: 'common',
                                            data: {
                                                $url: 'push-subscribe-cloud',
                                                data: {
                                                    openid: openid,
                                                    type: 'newOrder',
                                                    page: 'pages/manager-trip-list/index',
                                                    texts: ["\u4F60\u6709" + count + "\u6761\u65B0\u8BA2\u5355", "\u70B9\u51FB\u67E5\u770B"]
                                                }
                                            }
                                        })];
                                case 3:
                                    push$ = _a.sent();
                                    console.log('==== push', push$.result);
                                    if (!(push$.result.status === 200)) return [3, 7];
                                    if (!!!tripOrderVisitConfig) return [3, 5];
                                    return [4, db.collection('analyse-data')
                                            .doc(String(tripOrderVisitConfig._id))
                                            .update({
                                            data: {
                                                value: getNow(true)
                                            }
                                        })];
                                case 4:
                                    _a.sent();
                                    return [3, 7];
                                case 5: return [4, db.collection('analyse-data')
                                        .add({
                                        data: {
                                            openid: openid,
                                            tid: trip_1._id,
                                            type: 'manager-trip-order-visit',
                                            value: getNow(true)
                                        }
                                    })];
                                case 6:
                                    _a.sent();
                                    _a.label = 7;
                                case 7: return [2];
                            }
                        });
                    }); }))];
            case 3:
                _a.sent();
                return [2, {
                        status: 200
                    }];
            case 4:
                e_5 = _a.sent();
                return [2, {
                        status: 500,
                        message: typeof e_5 === 'string' ? e_5 : JSON.stringify(e_5)
                    }];
            case 5: return [2];
        }
    });
}); };
exports.pushLastPay = function () { return __awaiter(_this, void 0, void 0, function () {
    var nowDate, trip$, members;
    var _this = this;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                nowDate = getNow();
                if (nowDate.getHours() !== 0 && nowDate.getMinutes() !== 0) {
                    return [2, { status: 200 }];
                }
                return [4, db.collection('trip')
                        .where({
                        isClosed: true
                    })
                        .limit(1)
                        .orderBy('end_date', 'desc')
                        .get()];
            case 1:
                trip$ = _a.sent();
                return [4, db.collection('manager-member')
                        .where({
                        push: true
                    })
                        .get()];
            case 2:
                members = _a.sent();
                if (trip$.data.length === 0 || members.data.length === 0) {
                    return [2, { status: 200 }];
                }
                return [4, Promise.all(members.data.map(function (member) { return __awaiter(_this, void 0, void 0, function () {
                        var openid, config$, config, query, orders$, count, push$;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    openid = member.openid;
                                    return [4, db.collection('analyse-data')
                                            .where({
                                            openid: openid,
                                            tid: trip$.data[0]._id,
                                            type: 'manager-pay-last-visit'
                                        })
                                            .get()];
                                case 1:
                                    config$ = _a.sent();
                                    config = config$.data[0];
                                    query = {
                                        pay_status: '2',
                                        tid: trip$.data[0]._id,
                                    };
                                    if (config) {
                                        query = __assign({}, query, { paytime: _.gte(config.value) });
                                    }
                                    return [4, db.collection('order')
                                            .where(query)
                                            .get()];
                                case 2:
                                    orders$ = _a.sent();
                                    count = Array.from(new Set(orders$.data.map(function (x) { return x.openid; }))).length;
                                    if (count === 0) {
                                        return [2, { staus: 200 }];
                                    }
                                    return [4, cloud.callFunction({
                                            name: 'common',
                                            data: {
                                                $url: 'push-subscribe-cloud',
                                                data: {
                                                    openid: openid,
                                                    type: 'getMoney',
                                                    page: 'pages/manager-trip-list/index',
                                                    texts: [count + "\u4EBA\u4ED8\u4E86\u5C3E\u6B3E", "\u4ECA\u5929"]
                                                }
                                            }
                                        })];
                                case 3:
                                    push$ = _a.sent();
                                    console.log('==== push', push$.result);
                                    if (!(push$.result.status === 200)) return [3, 7];
                                    if (!!!config) return [3, 5];
                                    return [4, db.collection('analyse-data')
                                            .doc(String(config._id))
                                            .update({
                                            data: {
                                                value: getNow(true)
                                            }
                                        })];
                                case 4:
                                    _a.sent();
                                    return [3, 7];
                                case 5: return [4, db.collection('analyse-data')
                                        .add({
                                        data: {
                                            openid: openid,
                                            tid: trip$.data[0]._id,
                                            type: 'manager-pay-last-visit',
                                            value: getNow(true)
                                        }
                                    })];
                                case 6:
                                    _a.sent();
                                    _a.label = 7;
                                case 7: return [2];
                            }
                        });
                    }); }))];
            case 3:
                _a.sent();
                return [2];
        }
    });
}); };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLGlCQWdlQzs7QUFoZUQscUNBQXVDO0FBRXZDLEtBQUssQ0FBQyxJQUFJLENBQUM7SUFDUCxHQUFHLEVBQUUsT0FBTyxDQUFDLEdBQUcsQ0FBQyxLQUFLO0NBQ3pCLENBQUMsQ0FBQztBQUVILElBQU0sRUFBRSxHQUFnQixLQUFLLENBQUMsUUFBUSxFQUFHLENBQUM7QUFDMUMsSUFBTSxDQUFDLEdBQUcsRUFBRSxDQUFDLE9BQU8sQ0FBQztBQVFyQixJQUFNLE1BQU0sR0FBRyxVQUFFLEVBQVU7SUFBVixtQkFBQSxFQUFBLFVBQVU7SUFDdkIsSUFBSyxFQUFFLEVBQUc7UUFDTixPQUFPLElBQUksQ0FBQyxHQUFHLEVBQUcsQ0FBQztLQUN0QjtJQUNELElBQU0sTUFBTSxHQUFHLElBQUksSUFBSSxDQUFFLElBQUksSUFBSSxFQUFHLENBQUMsY0FBYyxFQUFHLENBQUMsQ0FBQztJQUN4RCxPQUFPLElBQUksSUFBSSxDQUFFLE1BQU0sQ0FBQyxPQUFPLEVBQUcsR0FBRyxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxJQUFJLENBQUUsQ0FBQTtBQUM3RCxDQUFDLENBQUE7QUFLWSxRQUFBLFFBQVEsR0FBRzs7Ozs7OztnQkFHQSxXQUFNLEVBQUUsQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDO3lCQUN2QyxLQUFLLENBQUM7d0JBQ0gsVUFBVSxFQUFFLEdBQUc7d0JBQ2YsV0FBVyxFQUFFLEdBQUc7d0JBQ2hCLFVBQVUsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFFLE1BQU0sQ0FBRSxJQUFJLENBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLElBQUksQ0FBRTtxQkFDdkQsQ0FBQzt5QkFDRCxHQUFHLEVBQUcsRUFBQTs7Z0JBTkwsT0FBTyxH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LFNBV1o7b0NBRUYsT0FBTyxDQUFDLEdBQUcsQ0FBRSxXQUFXLEVBQUUsS0FBSyxDQUFDLE1BQU0sQ0FBRSxDQUFBO3lDQUVuQyxDQUFBLEtBQUssQ0FBQyxNQUFNLENBQUMsTUFBTSxLQUFLLEdBQUcsQ0FBQSxFQUEzQixjQUEyQjt5Q0FFdkIsQ0FBQyxDQUFDLE1BQU0sRUFBUixjQUFRO29DQUdULFdBQU0sRUFBRSxDQUFDLFVBQVUsQ0FBQyxjQUFjLENBQUM7NkNBQzlCLEdBQUcsQ0FBRSxNQUFNLENBQUUsTUFBTSxDQUFDLEdBQUcsQ0FBRSxDQUFDOzZDQUMxQixNQUFNLENBQUM7NENBQ0osSUFBSSxFQUFFO2dEQUNGLEtBQUssRUFBRSxNQUFNLENBQUUsSUFBSSxDQUFFOzZDQUN4Qjt5Q0FDSixDQUFDLEVBQUE7O29DQU5OLFNBTU0sQ0FBQzs7d0NBR1AsV0FBTSxFQUFFLENBQUMsVUFBVSxDQUFDLGNBQWMsQ0FBQzt5Q0FDOUIsR0FBRyxDQUFDO3dDQUNELElBQUksRUFBRTs0Q0FDRixNQUFNLFFBQUE7NENBQ04sR0FBRyxFQUFFLEtBQUssQ0FBQyxJQUFJLENBQUUsQ0FBQyxDQUFFLENBQUMsR0FBRzs0Q0FDeEIsSUFBSSxFQUFFLHdCQUF3Qjs0Q0FDOUIsS0FBSyxFQUFFLE1BQU0sQ0FBRSxJQUFJLENBQUU7eUNBQ3hCO3FDQUNKLENBQUMsRUFBQTs7b0NBUk4sU0FRTSxDQUFDOzs7Ozt5QkFHbEIsQ0FBQyxDQUNMLEVBQUE7O2dCQXJGRCxTQXFGQyxDQUFDOzs7O0tBRUwsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIGNsb3VkIGZyb20gJ3d4LXNlcnZlci1zZGsnO1xuXG5jbG91ZC5pbml0KHtcbiAgICBlbnY6IHByb2Nlc3MuZW52LmNsb3VkXG59KTtcblxuY29uc3QgZGI6IERCLkRhdGFiYXNlID0gY2xvdWQuZGF0YWJhc2UoICk7XG5jb25zdCBfID0gZGIuY29tbWFuZDtcblxuLyoqIFxuICog6L2s5o2i5qC85p6X5bC85rK75pe25Yy6ICs45pe25Yy6XG4gKiBEYXRlKCkubm93KCkgLyBuZXcgRGF0ZSgpLmdldFRpbWUoKSDmmK/ml7bkuI3ml7bmraPluLjnmoQrOFxuICogRGF0ZS50b0xvY2FsU3RyaW5nKCApIOWlveWDj+aYr+S4gOebtOaYrysw55qEXG4gKiDlhYjmi7/liLAgKzDvvIznhLblkI4rOFxuICovXG5jb25zdCBnZXROb3cgPSAoIHRzID0gZmFsc2UgKTogYW55ID0+IHtcbiAgICBpZiAoIHRzICkge1xuICAgICAgICByZXR1cm4gRGF0ZS5ub3coICk7XG4gICAgfVxuICAgIGNvbnN0IHRpbWVfMCA9IG5ldyBEYXRlKCBuZXcgRGF0ZSggKS50b0xvY2FsZVN0cmluZyggKSk7XG4gICAgcmV0dXJuIG5ldyBEYXRlKCB0aW1lXzAuZ2V0VGltZSggKSArIDggKiA2MCAqIDYwICogMTAwMCApXG59XG5cbi8qKlxuICog6K6i5Y2VMTog5omA5pyJ5bqU6K+l5pSv5LuY77yM5L2G5piv5rKh5pyJ5pSv5LuY77yI5pSv5LuY6LaF5pe2MzDliIbpkp/vvInnmoTorqLljZXvvIzph4rmlL7ljp/mnaXnmoTlupPlrZjvvIzorqLljZXph43nva7kuLrlt7Lov4fml7ZcbiAqL1xuZXhwb3J0IGNvbnN0IG92ZXJ0aW1lID0gYXN5bmMgKCApID0+IHtcbiAgICB0cnkge1xuXG4gICAgICAgIGNvbnN0IG9yZGVycyQgPSBhd2FpdCBkYi5jb2xsZWN0aW9uKCdvcmRlcicpXG4gICAgICAgICAgICAud2hlcmUoe1xuICAgICAgICAgICAgICAgIHBheV9zdGF0dXM6ICcwJyxcbiAgICAgICAgICAgICAgICBiYXNlX3N0YXR1czogJzAnLFxuICAgICAgICAgICAgICAgIGNyZWF0ZVRpbWU6IF8ubHRlKCBnZXROb3coIHRydWUgKSAtIDMwICogNjAgKiAxMDAwIClcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAuZ2V0KCApO1xuICAgICAgICBcbiAgICAgICAgLy8g6K6i5Y2V5pu05pawXG4gICAgICAgIGF3YWl0IFByb21pc2UuYWxsKCBvcmRlcnMkLmRhdGEubWFwKCBvcmRlciA9PiB7XG4gICAgICAgICAgICByZXR1cm4gZGIuY29sbGVjdGlvbignb3JkZXInKS5kb2MoIFN0cmluZyggb3JkZXIuX2lkICkpXG4gICAgICAgICAgICAgICAgLnVwZGF0ZSh7XG4gICAgICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJhc2Vfc3RhdHVzOiAnNSdcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgIH0pKTtcblxuICAgICAgICAvLyDlupPlrZjph4rmlL4gKCDlpoLmnpzmnInlupPlrZjnmoTor50gKVxuICAgICAgICBhd2FpdCBQcm9taXNlLmFsbCggb3JkZXJzJC5kYXRhLm1hcCggYXN5bmMgb3JkZXIgPT4ge1xuXG4gICAgICAgICAgICBjb25zdCB0YXJnZXRJZCA9IG9yZGVyLnNpZCB8fCBvcmRlci5waWQ7XG4gICAgICAgICAgICBjb25zdCBjb2xsZWN0aW9uID0gb3JkZXIuc2lkID8gJ3N0YW5kYXJkcycgOiAnZ29vZHMnO1xuXG4gICAgICAgICAgICBjb25zdCB0YXJnZXQgPSBhd2FpdCBkYi5jb2xsZWN0aW9uKCBjb2xsZWN0aW9uIClcbiAgICAgICAgICAgICAgICAuZG9jKCB0YXJnZXRJZCApXG4gICAgICAgICAgICAgICAgLmdldCggKTtcblxuICAgICAgICAgICAgaWYgKCB0YXJnZXQuZGF0YS5zdG9jayA9PT0gdW5kZWZpbmVkIHx8IHRhcmdldC5kYXRhLnN0b2NrID09PSBudWxsICkgeyByZXR1cm47IH1cblxuICAgICAgICAgICAgYXdhaXQgZGIuY29sbGVjdGlvbiggY29sbGVjdGlvbiApLmRvYyggdGFyZ2V0SWQgKVxuICAgICAgICAgICAgICAgIC51cGRhdGUoe1xuICAgICAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzdG9jazogXy5pbmMoIG9yZGVyLmNvdW50IClcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICB9KSk7XG4gICAgICAgIFxuICAgICAgICByZXR1cm4geyBzdGF0dXM6IDIwMCB9XG4gICAgfSBjYXRjaCAoIGUgKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKCchISEh5a6a5pe25Zmo6K6i5Y2Vb3ZlcnRpbWXplJnor68nLClcbiAgICAgICAgcmV0dXJuIHsgc3RhdHVzOiA1MDAgfVxuICAgIH1cbn07XG5cbi8qKlxuICog6K6i5Y2VMu+8muaJgOacieaIkOWKn+aUr+S7mOeahOiuouWNle+8jOajgOafpeacieayoeaciSB0eXBl77yacHJl55qE77yM5pyJ55qE6K+d6ZyA6KaB6L2s5oiQdHlwZTpub3JtYWznsbvlnovorqLljZXvvIzliKDpmaTlr7nlupTnmoTotK3nianovabvvIjmnInnmoTor53vvIlcbiAqL1xuZXhwb3J0IGNvbnN0IHBheWVkRml4ID0gYXN5bmMgKCApID0+IHtcbiAgICB0cnkge1xuXG4gICAgICAgIGNvbnN0IG9yZGVycyQgPSBhd2FpdCBkYi5jb2xsZWN0aW9uKCdvcmRlcicpXG4gICAgICAgICAgICAud2hlcmUoe1xuICAgICAgICAgICAgICAgIHR5cGU6ICdwcmUnLFxuICAgICAgICAgICAgICAgIHBheV9zdGF0dXM6ICcxJ1xuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC5nZXQoICk7XG5cbiAgICAgICAgLy8g6K6i5Y2V5pu05pawXG4gICAgICAgIGF3YWl0IFByb21pc2UuYWxsKCBvcmRlcnMkLmRhdGEubWFwKCBvcmRlciA9PiB7XG4gICAgICAgICAgICByZXR1cm4gZGIuY29sbGVjdGlvbignb3JkZXInKS5kb2MoIFN0cmluZyggb3JkZXIuX2lkICkpXG4gICAgICAgICAgICAgICAgLnVwZGF0ZSh7XG4gICAgICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6ICdub3JtYWwnXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICB9KSk7XG5cbiAgICAgICAgLy8g5Yig6Zmk5a+55bqU55qE6LSt54mp6L2mXG4gICAgICAgIGF3YWl0IFByb21pc2UuYWxsKFxuICAgICAgICAgICAgb3JkZXJzJC5kYXRhXG4gICAgICAgICAgICAgICAgLmZpbHRlciggeCA9PiAhIXguY2lkIClcbiAgICAgICAgICAgICAgICAubWFwKCBvcmRlciA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBkYi5jb2xsZWN0aW9uKCdjYXJ0JykuZG9jKCBvcmRlci5jaWQgKVxuICAgICAgICAgICAgICAgICAgICAgICAgLnJlbW92ZSggKVxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICk7XG5cbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHN0YXR1czogMjAwXG4gICAgICAgIH1cblxuXG4gICAgfSBjYXRjaCAoIGUgKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKCchISEh5a6a5pe25Zmo6K6i5Y2VcGF5ZWRGaXjplJnor68nLClcbiAgICAgICAgcmV0dXJuIHsgc3RhdHVzOiA1MDAgfVxuICAgIH1cbn1cblxuLyoqXG4gKiDorqLljZUz77ya5bey57uP6L+b6KGM6LSt54mp5riF5Y2V5Lu35qC86LCD5pW05ZCO77yM5paw5p2l55qE5ZWG5ZOB6K6i5Y2V5Lu35qC85aaC5p6c6Lef5riF5Y2V5Lu35qC85LiN5LiA6Ie077yM5bqU6K+l55So5a6a5pe25Zmo6L+b6KGM6LCD5pW0XG4gKiAh6L+Z57G76K6i5Y2V77yM5pqC5pe26L+Y5rKh5pyJ6IO96Ieq5Yqo5rOo5YWl5YiG6YWN5pWw6YePIGFsbG9jYXRlZENvdW50XG4gKi9cbmV4cG9ydCBjb25zdCBwcmljZUZpeCA9IGFzeW5jICggKSA9PiB7XG4gICAgdHJ5IHtcblxuICAgICAgICAvLyDojrflj5blvZPliY3ov5vooYzkuK3nmoTooYznqItcbiAgICAgICAgY29uc3QgdHJpcHMkID0gYXdhaXQgY2xvdWQuY2FsbEZ1bmN0aW9uKHtcbiAgICAgICAgICAgIG5hbWU6ICd0cmlwJyxcbiAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAkdXJsOiAnZW50ZXInXG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGNvbnN0IGN1cnJlbnRUcmlwID0gdHJpcHMkLnJlc3VsdC5kYXRhWyAwIF07XG5cbiAgICAgICAgaWYgKCAhY3VycmVudFRyaXAgKSB7IFxuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBzdGF0dXM6IDIwMFxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgdGlkID0gY3VycmVudFRyaXAuX2lkO1xuXG4gICAgICAgIC8vIOaJvuWIsOaJgOacieW3sue7j+iwg+aVtOWlveeahOa4heWNleWIl+ihqFxuICAgICAgICBjb25zdCBzaG9wcGluZ2xpc3RzJCA9IGF3YWl0IGRiLmNvbGxlY3Rpb24oJ3Nob3BwaW5nLWxpc3QnKVxuICAgICAgICAgICAgLndoZXJlKHtcbiAgICAgICAgICAgICAgICB0aWQsXG4gICAgICAgICAgICAgICAgYmFzZV9zdGF0dXM6ICcxJ1xuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC5nZXQoICk7XG4gICAgICAgIFxuICAgICAgICBhd2FpdCBQcm9taXNlLmFsbCggc2hvcHBpbmdsaXN0cyQuZGF0YS5tYXAoIGFzeW5jIHNob3BwaW5nTGlzdCA9PiB7XG5cbiAgICAgICAgICAgIGNvbnN0IHsgcGlkLCBzaWQsIGFkanVzdFByaWNlLCBhZGp1c3RHcm91cFByaWNlIH0gPSBzaG9wcGluZ0xpc3Q7XG5cbiAgICAgICAgICAgIC8vIOaJvuWIsGJhc2Vfc3RhdHVzOiAwIOeahOWQjOWVhuWTgeiuouWNlVxuICAgICAgICAgICAgY29uc3Qgb3JkZXJzJCA9IGF3YWl0IGRiLmNvbGxlY3Rpb24oJ29yZGVyJylcbiAgICAgICAgICAgICAgICAud2hlcmUoe1xuICAgICAgICAgICAgICAgICAgICB0aWQsXG4gICAgICAgICAgICAgICAgICAgIHBpZCxcbiAgICAgICAgICAgICAgICAgICAgc2lkLFxuICAgICAgICAgICAgICAgICAgICBiYXNlX3N0YXR1czogJzAnXG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAuZ2V0KCApO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICAvLyDorqLljZXmm7TmlrBcbiAgICAgICAgICAgIGF3YWl0IFByb21pc2UuYWxsKCBvcmRlcnMkLmRhdGEubWFwKCBvcmRlciA9PiB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGRiLmNvbGxlY3Rpb24oJ29yZGVyJylcbiAgICAgICAgICAgICAgICAgICAgLmRvYyggU3RyaW5nKCBvcmRlci5faWQgKSlcbiAgICAgICAgICAgICAgICAgICAgLnVwZGF0ZSh7XG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYWxsb2NhdGVkUHJpY2U6IGFkanVzdFByaWNlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFsbG9jYXRlZEdyb3VwUHJpY2U6IGFkanVzdEdyb3VwUHJpY2UsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYmFzZV9zdGF0dXM6ICcxJ1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgfSkpO1xuXG4gICAgICAgIH0pKTtcblxuICAgICAgICByZXR1cm4geyBzdGF0dXM6IDIwMCB9XG5cbiAgICB9IGNhdGNoICggZSApIHtcbiAgICAgICAgY29uc29sZS5sb2coJyEhISHlrprml7blmajorqLljZVwcmljZUZpeOmUmeivrycsKVxuICAgICAgICByZXR1cm4geyBzdGF0dXM6IDUwMCB9XG4gICAgfVxufVxuXG4vKipcbiAqIOiuouWNlTTvvJrmiYDmnInmiJDlip/mlK/ku5jlsL7mrL7nmoTorqLljZXvvIzmiopiYXNlX3N0YXR1c+iuvuS4ujNcbiAqL1xuZXhwb3J0IGNvbnN0IHBheUxhc3RGaXggPSBhc3luYyAoICkgPT4ge1xuICAgIHRyeSB7XG4gICAgICAgIFxuICAgICAgICBjb25zdCBvcmRlcnMkID0gYXdhaXQgZGIuY29sbGVjdGlvbignb3JkZXInKVxuICAgICAgICAgICAgLndoZXJlKHtcbiAgICAgICAgICAgICAgICBwYXlfc3RhdHVzOiAnMicsXG4gICAgICAgICAgICAgICAgYmFzZV9zdGF0dXM6IF8ub3IoIF8uZXEoJzAnKSwgXy5lcSgnMScpLCAgXy5lcSgnMicpKVxuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC5nZXQoICk7XG5cbiAgICAgICAgYXdhaXQgUHJvbWlzZS5hbGwoXG4gICAgICAgICAgICBvcmRlcnMkLmRhdGEubWFwKCBvcmRlciA9PiB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGRiLmNvbGxlY3Rpb24oJ29yZGVyJylcbiAgICAgICAgICAgICAgICAgICAgLmRvYyggU3RyaW5nKCBvcmRlci5faWQgKSlcbiAgICAgICAgICAgICAgICAgICAgLnVwZGF0ZSh7XG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYmFzZV9zdGF0dXM6ICczJ1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgfSlcbiAgICAgICAgKVxuICAgICAgICBcbiAgICB9IGNhdGNoICggZSApIHtcbiAgICAgICAgY29uc29sZS5sb2coJyEhISHlrprml7blmajorqLljZVwYXlMYXN0Rml46ZSZ6K+vJywpXG4gICAgICAgIHJldHVybiB7IHN0YXR1czogNTAwIH1cbiAgICB9XG59XG5cbi8qKlxuICog6K6i5Y2VNO+8muaWsOiuouWNleaOqOmAgVxuICovXG5leHBvcnQgY29uc3QgcHVzaE5ldyA9IGFzeW5jICggKSA9PiB7XG4gICAgdHJ5IHtcbiAgICAgICAgXG4gICAgICAgIGNvbnN0IG5vd0RhdGUgPSBnZXROb3coICk7XG4gICAgICAgIFxuICAgICAgICAvLyAw44CB5Yik5pat5piv5ZCm5Zyo6YKj5Yeg5Liq5pe26Ze05oiz5LmL5YaFXG4gICAgICAgIGNvbnN0IGNoZWNrSXNJblJhbmdlID0gKCBub3c6IERhdGUgKSA9PiB7XG5cbiAgICAgICAgICAgIGNvbnN0IHJhbmdlID0gWyA2LCAxMiwgMTgsIDAgXTtcbiAgICAgICAgICAgIGNvbnN0IHJlc3VsdCA9IHJhbmdlLnNvbWUoIHggPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IGggPSBub3cuZ2V0SG91cnMoICk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHggPT09IGggJiYgbm93LmdldE1pbnV0ZXMoICkgPT09IDA7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoICFjaGVja0lzSW5SYW5nZSggbm93RGF0ZSApKSB7IFxuICAgICAgICAgICAgcmV0dXJuIHsgc3RhdHVzOiAyMDAgfTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIDHjgIHojrflj5ZjdXJyZW50IHRyaXBcbiAgICAgICAgY29uc3QgdHJpcHMkID0gYXdhaXQgY2xvdWQuY2FsbEZ1bmN0aW9uKHtcbiAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAkdXJsOiAnZW50ZXInXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgbmFtZTogJ3RyaXAnXG4gICAgICAgIH0pO1xuICAgICAgICBjb25zdCB0cmlwcyA9IHRyaXBzJC5yZXN1bHQuZGF0YTtcbiAgICAgICAgY29uc3QgdHJpcCA9IHRyaXBzWyAwIF07XG5cbiAgICAgICAgLy8gMuOAgeiOt+WPliBwdXNoOiB0cnVlIOeahOeuoeeQhuWRmFxuICAgICAgICBjb25zdCBtZW1iZXJzID0gYXdhaXQgZGIuY29sbGVjdGlvbignbWFuYWdlci1tZW1iZXInKVxuICAgICAgICAgICAgLndoZXJlKHtcbiAgICAgICAgICAgICAgICBwdXNoOiB0cnVlXG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLmdldCggKTtcblxuICAgICAgICBpZiAoICF0cmlwIHx8IG1lbWJlcnMuZGF0YS5sZW5ndGggPT09IDAgKSB7XG4gICAgICAgICAgICByZXR1cm4geyBzdGF0dXM6IDIwMCB9O1xuICAgICAgICB9XG5cbiAgICAgICAgYXdhaXQgUHJvbWlzZS5hbGwoXG4gICAgICAgICAgICBtZW1iZXJzLmRhdGEubWFwKCBhc3luYyBtZW1iZXIgPT4ge1xuICAgICAgICAgICAgICAgIGxldCBjb3VudCA9IDA7XG4gICAgICAgICAgICAgICAgY29uc3QgeyBvcGVuaWQgfSA9IG1lbWJlclxuXG4gICAgICAgICAgICAgICAgLy8gM+OAgeiOt+WPluS4iuasoea1j+iniOiuouWNleeahOaXtumXtOaIs1xuICAgICAgICAgICAgICAgIGNvbnN0IGNvbmZpZyQgPSBhd2FpdCBkYi5jb2xsZWN0aW9uKCdhbmFseXNlLWRhdGEnKVxuICAgICAgICAgICAgICAgICAgICAud2hlcmUoe1xuICAgICAgICAgICAgICAgICAgICAgICAgb3BlbmlkLFxuICAgICAgICAgICAgICAgICAgICAgICAgdGlkOiB0cmlwLl9pZCxcbiAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6ICdtYW5hZ2VyLXRyaXAtb3JkZXItdmlzaXQnXG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgIC5nZXQoICk7XG4gICAgICAgICAgICAgICAgY29uc3QgdHJpcE9yZGVyVmlzaXRDb25maWcgPSBjb25maWckLmRhdGFbIDAgXTtcblxuICAgICAgICAgICAgICAgIGxldCBxdWVyeTogYW55ID0ge1xuICAgICAgICAgICAgICAgICAgICB0aWQ6IHRyaXAuX2lkLFxuICAgICAgICAgICAgICAgICAgICBwYXlfc3RhdHVzOiBfLm5lcSgnMCcpLFxuICAgICAgICAgICAgICAgICAgICBiYXNlX3N0YXR1czogXy5vciggXy5lcSgnMCcpLCBfLmVxKCcxJyksIF8uZXEoJzInKSlcbiAgICAgICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAgICAgaWYgKCAhIXRyaXBPcmRlclZpc2l0Q29uZmlnICkge1xuICAgICAgICAgICAgICAgICAgICBxdWVyeSA9IE9iamVjdC5hc3NpZ24oeyB9LCBxdWVyeSwge1xuICAgICAgICAgICAgICAgICAgICAgICAgY3JlYXRlVGltZTogXy5ndGUoIHRyaXBPcmRlclZpc2l0Q29uZmlnLnZhbHVlIClcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgLy8gNOOAgeiwg+eUqOaOqOmAgVxuICAgICAgICAgICAgICAgIGNvbnN0IGNvdW50JCA9IGF3YWl0IGRiLmNvbGxlY3Rpb24oJ29yZGVyJylcbiAgICAgICAgICAgICAgICAgICAgICAgIC53aGVyZSggcXVlcnkgKVxuICAgICAgICAgICAgICAgICAgICAgICAgLmNvdW50KCApO1xuICAgICAgICAgICAgICAgIGNvdW50ID0gY291bnQkLnRvdGFsO1xuXG5cbiAgICAgICAgICAgICAgICBpZiAoIGNvdW50ID09PSAwICkgeyBcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHsgc3RhdXM6IDIwMCB9O1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIC8vIDTjgIHosIPnlKjmjqjpgIFcbiAgICAgICAgICAgICAgICBjb25zdCBwdXNoJCA9IGF3YWl0IGNsb3VkLmNhbGxGdW5jdGlvbih7XG4gICAgICAgICAgICAgICAgICAgIG5hbWU6ICdjb21tb24nLFxuICAgICAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAkdXJsOiAncHVzaC1zdWJzY3JpYmUtY2xvdWQnLFxuICAgICAgICAgICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9wZW5pZCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiAnbmV3T3JkZXInLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhZ2U6ICdwYWdlcy9tYW5hZ2VyLXRyaXAtbGlzdC9pbmRleCcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGV4dHM6IFtg5L2g5pyJJHtjb3VudH3mnaHmlrDorqLljZVgLCBg54K55Ye75p+l55yLYF1cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coICc9PT09IHB1c2gnLCBwdXNoJC5yZXN1bHQgKVxuXG4gICAgICAgICAgICAgICAgLy8gNeOAgeabtOaWsOOAgeWIm+W7uumFjee9rlxuICAgICAgICAgICAgICAgIGlmICggcHVzaCQucmVzdWx0LnN0YXR1cyA9PT0gMjAwICkge1xuXG4gICAgICAgICAgICAgICAgICAgIGlmICggISF0cmlwT3JkZXJWaXNpdENvbmZpZyApIHtcblxuICAgICAgICAgICAgICAgICAgICAgICAgLy8g5pu05paw5LiA5LiL5q2k5p2h6YWN572uXG4gICAgICAgICAgICAgICAgICAgICAgICBhd2FpdCBkYi5jb2xsZWN0aW9uKCdhbmFseXNlLWRhdGEnKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5kb2MoIFN0cmluZyggdHJpcE9yZGVyVmlzaXRDb25maWcuX2lkICkpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLnVwZGF0ZSh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlOiBnZXROb3coIHRydWUgKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyDliJvlu7rkuIDkuIvphY3nva5cbiAgICAgICAgICAgICAgICAgICAgICAgIGF3YWl0IGRiLmNvbGxlY3Rpb24oJ2FuYWx5c2UtZGF0YScpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLmFkZCh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9wZW5pZCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRpZDogdHJpcC5faWQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiAnbWFuYWdlci10cmlwLW9yZGVyLXZpc2l0JyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlOiBnZXROb3coIHRydWUgKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICByZXR1cm47XG5cbiAgICAgICAgICAgIH0pXG4gICAgICAgICk7XG4gICAgICAgIFxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgc3RhdHVzOiAyMDBcbiAgICAgICAgfTtcblxuICAgIH0gY2F0Y2ggKCBlICkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgc3RhdHVzOiA1MDAsXG4gICAgICAgICAgICBtZXNzYWdlOiB0eXBlb2YgZSA9PT0gJ3N0cmluZycgPyBlIDogSlNPTi5zdHJpbmdpZnkoIGUgKVxuICAgICAgICB9XG4gICAgfVxufVxuXG4vKiogXG4gKiDorqLljZU1OiDlsL7mrL7mjqjpgIFcbiAqL1xuZXhwb3J0IGNvbnN0IHB1c2hMYXN0UGF5ID0gYXN5bmMgKCApID0+IHtcblxuICAgIC8vIDDjgIHmmK/lkKbkuLow54K5XG4gICAgY29uc3Qgbm93RGF0ZSA9IGdldE5vdyggKTtcbiAgICBpZiAoIG5vd0RhdGUuZ2V0SG91cnMoICkgIT09IDAgJiYgbm93RGF0ZS5nZXRNaW51dGVzKCApICE9PSAwICkge1xuICAgICAgICByZXR1cm4geyBzdGF0dXM6IDIwMCB9O1xuICAgIH1cblxuICAgIC8vIDHjgIHojrflj5bkuIrkuIDotp90cmlwXG4gICAgLy8g5oyJ57uT5p2f5pel5pyf5YCS5Y+Z5bqP77yM6I635Y+W5pyA5aSaMeadoSDlt7Lnu5PmnZ/nmoTooYznqItcbiAgICBjb25zdCB0cmlwJCA9IGF3YWl0IGRiLmNvbGxlY3Rpb24oJ3RyaXAnKVxuICAgICAgICAud2hlcmUoe1xuICAgICAgICAgICAgaXNDbG9zZWQ6IHRydWVcbiAgICAgICAgfSlcbiAgICAgICAgLmxpbWl0KCAxIClcbiAgICAgICAgLm9yZGVyQnkoJ2VuZF9kYXRlJywgJ2Rlc2MnKVxuICAgICAgICAuZ2V0KCApO1xuXG4gICAgLy8gMuOAgeiOt+WPliBwdXNoOiB0cnVlIOeahOeuoeeQhuWRmFxuICAgIGNvbnN0IG1lbWJlcnMgPSBhd2FpdCBkYi5jb2xsZWN0aW9uKCdtYW5hZ2VyLW1lbWJlcicpXG4gICAgICAgIC53aGVyZSh7XG4gICAgICAgICAgICBwdXNoOiB0cnVlXG4gICAgICAgIH0pXG4gICAgICAgIC5nZXQoICk7XG4gICAgXG4gICAgaWYgKCB0cmlwJC5kYXRhLmxlbmd0aCA9PT0gMCB8fCBtZW1iZXJzLmRhdGEubGVuZ3RoID09PSAwICkge1xuICAgICAgICByZXR1cm4geyBzdGF0dXM6IDIwMCB9O1xuICAgIH1cblxuICAgIGF3YWl0IFByb21pc2UuYWxsKFxuICAgICAgICBtZW1iZXJzLmRhdGEubWFwKCBhc3luYyBtZW1iZXIgPT4ge1xuXG4gICAgICAgICAgICBjb25zdCB7IG9wZW5pZCB9ID0gbWVtYmVyO1xuXG4gICAgICAgICAgICAvLyAz44CB6I635Y+W5LiK5qyh5rWP6KeI5bC+5qy+55qE5pe26Ze05oizXG4gICAgICAgICAgICBjb25zdCBjb25maWckID0gYXdhaXQgZGIuY29sbGVjdGlvbignYW5hbHlzZS1kYXRhJylcbiAgICAgICAgICAgICAgICAgICAgLndoZXJlKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG9wZW5pZCxcbiAgICAgICAgICAgICAgICAgICAgICAgIHRpZDogdHJpcCQuZGF0YVsgMCBdLl9pZCxcbiAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6ICdtYW5hZ2VyLXBheS1sYXN0LXZpc2l0J1xuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAuZ2V0KCApO1xuXG4gICAgICAgICAgICBjb25zdCBjb25maWcgPSBjb25maWckLmRhdGFbIDAgXTtcblxuICAgICAgICAgICAgLy8gM+OAgeafpeivolxuICAgICAgICAgICAgbGV0IHF1ZXJ5OiBhbnkgPSB7XG4gICAgICAgICAgICAgICAgcGF5X3N0YXR1czogJzInLFxuICAgICAgICAgICAgICAgIHRpZDogdHJpcCQuZGF0YVsgMCBdLl9pZCxcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIGlmICggY29uZmlnICkge1xuICAgICAgICAgICAgICAgIHF1ZXJ5ID0ge1xuICAgICAgICAgICAgICAgICAgICAuLi5xdWVyeSxcbiAgICAgICAgICAgICAgICAgICAgcGF5dGltZTogXy5ndGUoIGNvbmZpZy52YWx1ZSApXG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIFxuICAgICAgICAgICAgY29uc3Qgb3JkZXJzJCA9IGF3YWl0IGRiLmNvbGxlY3Rpb24oJ29yZGVyJylcbiAgICAgICAgICAgICAgICAud2hlcmUoIHF1ZXJ5IClcbiAgICAgICAgICAgICAgICAuZ2V0KCApO1xuXG4gICAgICAgICAgICBjb25zdCBjb3VudCA9IEFycmF5LmZyb20oXG4gICAgICAgICAgICAgICAgbmV3IFNldChcbiAgICAgICAgICAgICAgICAgICAgb3JkZXJzJC5kYXRhLm1hcCggeCA9PiB4Lm9wZW5pZCApXG4gICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgKS5sZW5ndGg7XG5cbiAgICAgICAgICAgIGlmICggY291bnQgPT09IDAgKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHsgc3RhdXM6IDIwMCB9O1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyA044CB6LCD55So5o6o6YCBXG4gICAgICAgICAgICBjb25zdCBwdXNoJCA9IGF3YWl0IGNsb3VkLmNhbGxGdW5jdGlvbih7XG4gICAgICAgICAgICAgICAgbmFtZTogJ2NvbW1vbicsXG4gICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgICAkdXJsOiAncHVzaC1zdWJzY3JpYmUtY2xvdWQnLFxuICAgICAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBvcGVuaWQsXG4gICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiAnZ2V0TW9uZXknLFxuICAgICAgICAgICAgICAgICAgICAgICAgcGFnZTogJ3BhZ2VzL21hbmFnZXItdHJpcC1saXN0L2luZGV4JyxcbiAgICAgICAgICAgICAgICAgICAgICAgIHRleHRzOiBbYCR7Y291bnR95Lq65LuY5LqG5bC+5qy+YCwgYOS7iuWkqWBdXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgY29uc29sZS5sb2coICc9PT09IHB1c2gnLCBwdXNoJC5yZXN1bHQgKVxuICAgICAgICAgICAgLy8gNeOAgeabtOaWsOOAgeWIm+W7uumFjee9rlxuICAgICAgICAgICAgaWYgKCBwdXNoJC5yZXN1bHQuc3RhdHVzID09PSAyMDAgKSB7XG5cbiAgICAgICAgICAgICAgICBpZiAoICEhY29uZmlnICkge1xuXG4gICAgICAgICAgICAgICAgICAgIC8vIOabtOaWsOS4gOS4i+atpOadoemFjee9rlxuICAgICAgICAgICAgICAgICAgICBhd2FpdCBkYi5jb2xsZWN0aW9uKCdhbmFseXNlLWRhdGEnKVxuICAgICAgICAgICAgICAgICAgICAgICAgLmRvYyggU3RyaW5nKCBjb25maWcuX2lkICkpXG4gICAgICAgICAgICAgICAgICAgICAgICAudXBkYXRlKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlOiBnZXROb3coIHRydWUgKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIOWIm+W7uuS4gOS4i+mFjee9rlxuICAgICAgICAgICAgICAgICAgICBhd2FpdCBkYi5jb2xsZWN0aW9uKCdhbmFseXNlLWRhdGEnKVxuICAgICAgICAgICAgICAgICAgICAgICAgLmFkZCh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvcGVuaWQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRpZDogdHJpcCQuZGF0YVsgMCBdLl9pZCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogJ21hbmFnZXItcGF5LWxhc3QtdmlzaXQnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZTogZ2V0Tm93KCB0cnVlIClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgKTtcblxufSJdfQ==