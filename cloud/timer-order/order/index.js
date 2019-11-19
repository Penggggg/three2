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
                console.log('!!!!定时器订单priceFix错误', e_3);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLGlCQWdlQzs7QUFoZUQscUNBQXVDO0FBRXZDLEtBQUssQ0FBQyxJQUFJLENBQUM7SUFDUCxHQUFHLEVBQUUsT0FBTyxDQUFDLEdBQUcsQ0FBQyxLQUFLO0NBQ3pCLENBQUMsQ0FBQztBQUVILElBQU0sRUFBRSxHQUFnQixLQUFLLENBQUMsUUFBUSxFQUFHLENBQUM7QUFDMUMsSUFBTSxDQUFDLEdBQUcsRUFBRSxDQUFDLE9BQU8sQ0FBQztBQVFyQixJQUFNLE1BQU0sR0FBRyxVQUFFLEVBQVU7SUFBVixtQkFBQSxFQUFBLFVBQVU7SUFDdkIsSUFBSyxFQUFFLEVBQUc7UUFDTixPQUFPLElBQUksQ0FBQyxHQUFHLEVBQUcsQ0FBQztLQUN0QjtJQUNELElBQU0sTUFBTSxHQUFHLElBQUksSUFBSSxDQUFFLElBQUksSUFBSSxFQUFHLENBQUMsY0FBYyxFQUFHLENBQUMsQ0FBQztJQUN4RCxPQUFPLElBQUksSUFBSSxDQUFFLE1BQU0sQ0FBQyxPQUFPLEVBQUcsR0FBRyxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxJQUFJLENBQUUsQ0FBQTtBQUM3RCxDQUFDLENBQUE7QUFLWSxRQUFBLFFBQVEsR0FBRzs7Ozs7OztnQkFHQSxXQUFNLEVBQUUsQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDO3lCQUN2QyxLQUFLLENBQUM7d0JBQ0gsVUFBVSxFQUFFLEdBQUc7d0JBQ2YsV0FBVyxFQUFFLEdBQUc7d0JBQ2hCLFVBQVUsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFFLE1BQU0sQ0FBRSxJQUFJLENBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLElBQUksQ0FBRTtxQkFDdkQsQ0FBQzt5QkFDRCxHQUFHLEVBQUcsRUFBQTs7Z0JBTkwsT0FBTyxH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LEtBQUssR0FBRyxTQVdaO29DQUVGLE9BQU8sQ0FBQyxHQUFHLENBQUUsV0FBVyxFQUFFLEtBQUssQ0FBQyxNQUFNLENBQUUsQ0FBQTt5Q0FFbkMsQ0FBQSxLQUFLLENBQUMsTUFBTSxDQUFDLE1BQU0sS0FBSyxHQUFHLENBQUEsRUFBM0IsY0FBMkI7eUNBRXZCLENBQUMsQ0FBQyxNQUFNLEVBQVIsY0FBUTtvQ0FHVCxXQUFNLEVBQUUsQ0FBQyxVQUFVLENBQUMsY0FBYyxDQUFDOzZDQUM5QixHQUFHLENBQUUsTUFBTSxDQUFFLE1BQU0sQ0FBQyxHQUFHLENBQUUsQ0FBQzs2Q0FDMUIsTUFBTSxDQUFDOzRDQUNKLElBQUksRUFBRTtnREFDRixLQUFLLEVBQUUsTUFBTSxDQUFFLElBQUksQ0FBRTs2Q0FDeEI7eUNBQ0osQ0FBQyxFQUFBOztvQ0FOTixTQU1NLENBQUM7O3dDQUdQLFdBQU0sRUFBRSxDQUFDLFVBQVUsQ0FBQyxjQUFjLENBQUM7eUNBQzlCLEdBQUcsQ0FBQzt3Q0FDRCxJQUFJLEVBQUU7NENBQ0YsTUFBTSxRQUFBOzRDQUNOLEdBQUcsRUFBRSxLQUFLLENBQUMsSUFBSSxDQUFFLENBQUMsQ0FBRSxDQUFDLEdBQUc7NENBQ3hCLElBQUksRUFBRSx3QkFBd0I7NENBQzlCLEtBQUssRUFBRSxNQUFNLENBQUUsSUFBSSxDQUFFO3lDQUN4QjtxQ0FDSixDQUFDLEVBQUE7O29DQVJOLFNBUU0sQ0FBQzs7Ozs7eUJBR2xCLENBQUMsQ0FDTCxFQUFBOztnQkFyRkQsU0FxRkMsQ0FBQzs7OztLQUVMLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBjbG91ZCBmcm9tICd3eC1zZXJ2ZXItc2RrJztcblxuY2xvdWQuaW5pdCh7XG4gICAgZW52OiBwcm9jZXNzLmVudi5jbG91ZFxufSk7XG5cbmNvbnN0IGRiOiBEQi5EYXRhYmFzZSA9IGNsb3VkLmRhdGFiYXNlKCApO1xuY29uc3QgXyA9IGRiLmNvbW1hbmQ7XG5cbi8qKiBcbiAqIOi9rOaNouagvOael+WwvOayu+aXtuWMuiArOOaXtuWMulxuICogRGF0ZSgpLm5vdygpIC8gbmV3IERhdGUoKS5nZXRUaW1lKCkg5piv5pe25LiN5pe25q2j5bi455qEKzhcbiAqIERhdGUudG9Mb2NhbFN0cmluZyggKSDlpb3lg4/mmK/kuIDnm7TmmK8rMOeahFxuICog5YWI5ou/5YiwICsw77yM54S25ZCOKzhcbiAqL1xuY29uc3QgZ2V0Tm93ID0gKCB0cyA9IGZhbHNlICk6IGFueSA9PiB7XG4gICAgaWYgKCB0cyApIHtcbiAgICAgICAgcmV0dXJuIERhdGUubm93KCApO1xuICAgIH1cbiAgICBjb25zdCB0aW1lXzAgPSBuZXcgRGF0ZSggbmV3IERhdGUoICkudG9Mb2NhbGVTdHJpbmcoICkpO1xuICAgIHJldHVybiBuZXcgRGF0ZSggdGltZV8wLmdldFRpbWUoICkgKyA4ICogNjAgKiA2MCAqIDEwMDAgKVxufVxuXG4vKipcbiAqIOiuouWNlTE6IOaJgOacieW6lOivpeaUr+S7mO+8jOS9huaYr+ayoeacieaUr+S7mO+8iOaUr+S7mOi2heaXtjMw5YiG6ZKf77yJ55qE6K6i5Y2V77yM6YeK5pS+5Y6f5p2l55qE5bqT5a2Y77yM6K6i5Y2V6YeN572u5Li65bey6L+H5pe2XG4gKi9cbmV4cG9ydCBjb25zdCBvdmVydGltZSA9IGFzeW5jICggKSA9PiB7XG4gICAgdHJ5IHtcblxuICAgICAgICBjb25zdCBvcmRlcnMkID0gYXdhaXQgZGIuY29sbGVjdGlvbignb3JkZXInKVxuICAgICAgICAgICAgLndoZXJlKHtcbiAgICAgICAgICAgICAgICBwYXlfc3RhdHVzOiAnMCcsXG4gICAgICAgICAgICAgICAgYmFzZV9zdGF0dXM6ICcwJyxcbiAgICAgICAgICAgICAgICBjcmVhdGVUaW1lOiBfLmx0ZSggZ2V0Tm93KCB0cnVlICkgLSAzMCAqIDYwICogMTAwMCApXG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLmdldCggKTtcbiAgICAgICAgXG4gICAgICAgIC8vIOiuouWNleabtOaWsFxuICAgICAgICBhd2FpdCBQcm9taXNlLmFsbCggb3JkZXJzJC5kYXRhLm1hcCggb3JkZXIgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIGRiLmNvbGxlY3Rpb24oJ29yZGVyJykuZG9jKCBTdHJpbmcoIG9yZGVyLl9pZCApKVxuICAgICAgICAgICAgICAgIC51cGRhdGUoe1xuICAgICAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBiYXNlX3N0YXR1czogJzUnXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICB9KSk7XG5cbiAgICAgICAgLy8g5bqT5a2Y6YeK5pS+ICgg5aaC5p6c5pyJ5bqT5a2Y55qE6K+dIClcbiAgICAgICAgYXdhaXQgUHJvbWlzZS5hbGwoIG9yZGVycyQuZGF0YS5tYXAoIGFzeW5jIG9yZGVyID0+IHtcblxuICAgICAgICAgICAgY29uc3QgdGFyZ2V0SWQgPSBvcmRlci5zaWQgfHwgb3JkZXIucGlkO1xuICAgICAgICAgICAgY29uc3QgY29sbGVjdGlvbiA9IG9yZGVyLnNpZCA/ICdzdGFuZGFyZHMnIDogJ2dvb2RzJztcblxuICAgICAgICAgICAgY29uc3QgdGFyZ2V0ID0gYXdhaXQgZGIuY29sbGVjdGlvbiggY29sbGVjdGlvbiApXG4gICAgICAgICAgICAgICAgLmRvYyggdGFyZ2V0SWQgKVxuICAgICAgICAgICAgICAgIC5nZXQoICk7XG5cbiAgICAgICAgICAgIGlmICggdGFyZ2V0LmRhdGEuc3RvY2sgPT09IHVuZGVmaW5lZCB8fCB0YXJnZXQuZGF0YS5zdG9jayA9PT0gbnVsbCApIHsgcmV0dXJuOyB9XG5cbiAgICAgICAgICAgIGF3YWl0IGRiLmNvbGxlY3Rpb24oIGNvbGxlY3Rpb24gKS5kb2MoIHRhcmdldElkIClcbiAgICAgICAgICAgICAgICAudXBkYXRlKHtcbiAgICAgICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgICAgICAgc3RvY2s6IF8uaW5jKCBvcmRlci5jb3VudCApXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgfSkpO1xuICAgICAgICBcbiAgICAgICAgcmV0dXJuIHsgc3RhdHVzOiAyMDAgfVxuICAgIH0gY2F0Y2ggKCBlICkge1xuICAgICAgICBjb25zb2xlLmxvZygnISEhIeWumuaXtuWZqOiuouWNlW92ZXJ0aW1l6ZSZ6K+vJywpXG4gICAgICAgIHJldHVybiB7IHN0YXR1czogNTAwIH1cbiAgICB9XG59O1xuXG4vKipcbiAqIOiuouWNlTLvvJrmiYDmnInmiJDlip/mlK/ku5jnmoTorqLljZXvvIzmo4Dmn6XmnInmsqHmnIkgdHlwZe+8mnByZeeahO+8jOacieeahOivnemcgOimgei9rOaIkHR5cGU6bm9ybWFs57G75Z6L6K6i5Y2V77yM5Yig6Zmk5a+55bqU55qE6LSt54mp6L2m77yI5pyJ55qE6K+d77yJXG4gKi9cbmV4cG9ydCBjb25zdCBwYXllZEZpeCA9IGFzeW5jICggKSA9PiB7XG4gICAgdHJ5IHtcblxuICAgICAgICBjb25zdCBvcmRlcnMkID0gYXdhaXQgZGIuY29sbGVjdGlvbignb3JkZXInKVxuICAgICAgICAgICAgLndoZXJlKHtcbiAgICAgICAgICAgICAgICB0eXBlOiAncHJlJyxcbiAgICAgICAgICAgICAgICBwYXlfc3RhdHVzOiAnMSdcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAuZ2V0KCApO1xuXG4gICAgICAgIC8vIOiuouWNleabtOaWsFxuICAgICAgICBhd2FpdCBQcm9taXNlLmFsbCggb3JkZXJzJC5kYXRhLm1hcCggb3JkZXIgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIGRiLmNvbGxlY3Rpb24oJ29yZGVyJykuZG9jKCBTdHJpbmcoIG9yZGVyLl9pZCApKVxuICAgICAgICAgICAgICAgIC51cGRhdGUoe1xuICAgICAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiAnbm9ybWFsJ1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgfSkpO1xuXG4gICAgICAgIC8vIOWIoOmZpOWvueW6lOeahOi0reeJqei9plxuICAgICAgICBhd2FpdCBQcm9taXNlLmFsbChcbiAgICAgICAgICAgIG9yZGVycyQuZGF0YVxuICAgICAgICAgICAgICAgIC5maWx0ZXIoIHggPT4gISF4LmNpZCApXG4gICAgICAgICAgICAgICAgLm1hcCggb3JkZXIgPT4ge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZGIuY29sbGVjdGlvbignY2FydCcpLmRvYyggb3JkZXIuY2lkIClcbiAgICAgICAgICAgICAgICAgICAgICAgIC5yZW1vdmUoIClcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICApO1xuXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBzdGF0dXM6IDIwMFxuICAgICAgICB9XG5cblxuICAgIH0gY2F0Y2ggKCBlICkge1xuICAgICAgICBjb25zb2xlLmxvZygnISEhIeWumuaXtuWZqOiuouWNlXBheWVkRml46ZSZ6K+vJywpXG4gICAgICAgIHJldHVybiB7IHN0YXR1czogNTAwIH1cbiAgICB9XG59XG5cbi8qKlxuICog6K6i5Y2VM++8muW3sue7j+i/m+ihjOi0reeJqea4heWNleS7t+agvOiwg+aVtOWQju+8jOaWsOadpeeahOWVhuWTgeiuouWNleS7t+agvOWmguaenOi3n+a4heWNleS7t+agvOS4jeS4gOiHtO+8jOW6lOivpeeUqOWumuaXtuWZqOi/m+ihjOiwg+aVtFxuICogIei/meexu+iuouWNle+8jOaaguaXtui/mOayoeacieiDveiHquWKqOazqOWFpeWIhumFjeaVsOmHjyBhbGxvY2F0ZWRDb3VudFxuICovXG5leHBvcnQgY29uc3QgcHJpY2VGaXggPSBhc3luYyAoICkgPT4ge1xuICAgIHRyeSB7XG5cbiAgICAgICAgLy8g6I635Y+W5b2T5YmN6L+b6KGM5Lit55qE6KGM56iLXG4gICAgICAgIGNvbnN0IHRyaXBzJCA9IGF3YWl0IGNsb3VkLmNhbGxGdW5jdGlvbih7XG4gICAgICAgICAgICBuYW1lOiAndHJpcCcsXG4gICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgJHVybDogJ2VudGVyJ1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICBjb25zdCBjdXJyZW50VHJpcCA9IHRyaXBzJC5yZXN1bHQuZGF0YVsgMCBdO1xuXG4gICAgICAgIGlmICggIWN1cnJlbnRUcmlwICkgeyBcbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgc3RhdHVzOiAyMDBcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IHRpZCA9IGN1cnJlbnRUcmlwLl9pZDtcblxuICAgICAgICAvLyDmib7liLDmiYDmnInlt7Lnu4/osIPmlbTlpb3nmoTmuIXljZXliJfooahcbiAgICAgICAgY29uc3Qgc2hvcHBpbmdsaXN0cyQgPSBhd2FpdCBkYi5jb2xsZWN0aW9uKCdzaG9wcGluZy1saXN0JylcbiAgICAgICAgICAgIC53aGVyZSh7XG4gICAgICAgICAgICAgICAgdGlkLFxuICAgICAgICAgICAgICAgIGJhc2Vfc3RhdHVzOiAnMSdcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAuZ2V0KCApO1xuICAgICAgICBcbiAgICAgICAgYXdhaXQgUHJvbWlzZS5hbGwoIHNob3BwaW5nbGlzdHMkLmRhdGEubWFwKCBhc3luYyBzaG9wcGluZ0xpc3QgPT4ge1xuXG4gICAgICAgICAgICBjb25zdCB7IHBpZCwgc2lkLCBhZGp1c3RQcmljZSwgYWRqdXN0R3JvdXBQcmljZSB9ID0gc2hvcHBpbmdMaXN0O1xuXG4gICAgICAgICAgICAvLyDmib7liLBiYXNlX3N0YXR1czogMCDnmoTlkIzllYblk4HorqLljZVcbiAgICAgICAgICAgIGNvbnN0IG9yZGVycyQgPSBhd2FpdCBkYi5jb2xsZWN0aW9uKCdvcmRlcicpXG4gICAgICAgICAgICAgICAgLndoZXJlKHtcbiAgICAgICAgICAgICAgICAgICAgdGlkLFxuICAgICAgICAgICAgICAgICAgICBwaWQsXG4gICAgICAgICAgICAgICAgICAgIHNpZCxcbiAgICAgICAgICAgICAgICAgICAgYmFzZV9zdGF0dXM6ICcwJ1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLmdldCggKTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgLy8g6K6i5Y2V5pu05pawXG4gICAgICAgICAgICBhd2FpdCBQcm9taXNlLmFsbCggb3JkZXJzJC5kYXRhLm1hcCggb3JkZXIgPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiBkYi5jb2xsZWN0aW9uKCdvcmRlcicpXG4gICAgICAgICAgICAgICAgICAgIC5kb2MoIFN0cmluZyggb3JkZXIuX2lkICkpXG4gICAgICAgICAgICAgICAgICAgIC51cGRhdGUoe1xuICAgICAgICAgICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFsbG9jYXRlZFByaWNlOiBhZGp1c3RQcmljZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhbGxvY2F0ZWRHcm91cFByaWNlOiBhZGp1c3RHcm91cFByaWNlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJhc2Vfc3RhdHVzOiAnMSdcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIH0pKTtcblxuICAgICAgICB9KSk7XG5cbiAgICAgICAgcmV0dXJuIHsgc3RhdHVzOiAyMDAgfVxuXG4gICAgfSBjYXRjaCAoIGUgKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKCchISEh5a6a5pe25Zmo6K6i5Y2VcHJpY2VGaXjplJnor68nLCBlICk7XG4gICAgICAgIHJldHVybiB7IHN0YXR1czogNTAwIH1cbiAgICB9XG59XG5cbi8qKlxuICog6K6i5Y2VNO+8muaJgOacieaIkOWKn+aUr+S7mOWwvuasvueahOiuouWNle+8jOaKimJhc2Vfc3RhdHVz6K6+5Li6M1xuICovXG5leHBvcnQgY29uc3QgcGF5TGFzdEZpeCA9IGFzeW5jICggKSA9PiB7XG4gICAgdHJ5IHtcbiAgICAgICAgXG4gICAgICAgIGNvbnN0IG9yZGVycyQgPSBhd2FpdCBkYi5jb2xsZWN0aW9uKCdvcmRlcicpXG4gICAgICAgICAgICAud2hlcmUoe1xuICAgICAgICAgICAgICAgIHBheV9zdGF0dXM6ICcyJyxcbiAgICAgICAgICAgICAgICBiYXNlX3N0YXR1czogXy5vciggXy5lcSgnMCcpLCBfLmVxKCcxJyksICBfLmVxKCcyJykpXG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLmdldCggKTtcblxuICAgICAgICBhd2FpdCBQcm9taXNlLmFsbChcbiAgICAgICAgICAgIG9yZGVycyQuZGF0YS5tYXAoIG9yZGVyID0+IHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZGIuY29sbGVjdGlvbignb3JkZXInKVxuICAgICAgICAgICAgICAgICAgICAuZG9jKCBTdHJpbmcoIG9yZGVyLl9pZCApKVxuICAgICAgICAgICAgICAgICAgICAudXBkYXRlKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBiYXNlX3N0YXR1czogJzMnXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICB9KVxuICAgICAgICApXG4gICAgICAgIFxuICAgIH0gY2F0Y2ggKCBlICkge1xuICAgICAgICBjb25zb2xlLmxvZygnISEhIeWumuaXtuWZqOiuouWNlXBheUxhc3RGaXjplJnor68nLClcbiAgICAgICAgcmV0dXJuIHsgc3RhdHVzOiA1MDAgfVxuICAgIH1cbn1cblxuLyoqXG4gKiDorqLljZU077ya5paw6K6i5Y2V5o6o6YCBXG4gKi9cbmV4cG9ydCBjb25zdCBwdXNoTmV3ID0gYXN5bmMgKCApID0+IHtcbiAgICB0cnkge1xuICAgICAgICBcbiAgICAgICAgY29uc3Qgbm93RGF0ZSA9IGdldE5vdyggKTtcbiAgICAgICAgXG4gICAgICAgIC8vIDDjgIHliKTmlq3mmK/lkKblnKjpgqPlh6DkuKrml7bpl7TmiLPkuYvlhoVcbiAgICAgICAgY29uc3QgY2hlY2tJc0luUmFuZ2UgPSAoIG5vdzogRGF0ZSApID0+IHtcblxuICAgICAgICAgICAgY29uc3QgcmFuZ2UgPSBbIDYsIDEyLCAxOCwgMCBdO1xuICAgICAgICAgICAgY29uc3QgcmVzdWx0ID0gcmFuZ2Uuc29tZSggeCA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3QgaCA9IG5vdy5nZXRIb3VycyggKTtcbiAgICAgICAgICAgICAgICByZXR1cm4geCA9PT0gaCAmJiBub3cuZ2V0TWludXRlcyggKSA9PT0gMDtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICggIWNoZWNrSXNJblJhbmdlKCBub3dEYXRlICkpIHsgXG4gICAgICAgICAgICByZXR1cm4geyBzdGF0dXM6IDIwMCB9O1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gMeOAgeiOt+WPlmN1cnJlbnQgdHJpcFxuICAgICAgICBjb25zdCB0cmlwcyQgPSBhd2FpdCBjbG91ZC5jYWxsRnVuY3Rpb24oe1xuICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICR1cmw6ICdlbnRlcidcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBuYW1lOiAndHJpcCdcbiAgICAgICAgfSk7XG4gICAgICAgIGNvbnN0IHRyaXBzID0gdHJpcHMkLnJlc3VsdC5kYXRhO1xuICAgICAgICBjb25zdCB0cmlwID0gdHJpcHNbIDAgXTtcblxuICAgICAgICAvLyAy44CB6I635Y+WIHB1c2g6IHRydWUg55qE566h55CG5ZGYXG4gICAgICAgIGNvbnN0IG1lbWJlcnMgPSBhd2FpdCBkYi5jb2xsZWN0aW9uKCdtYW5hZ2VyLW1lbWJlcicpXG4gICAgICAgICAgICAud2hlcmUoe1xuICAgICAgICAgICAgICAgIHB1c2g6IHRydWVcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAuZ2V0KCApO1xuXG4gICAgICAgIGlmICggIXRyaXAgfHwgbWVtYmVycy5kYXRhLmxlbmd0aCA9PT0gMCApIHtcbiAgICAgICAgICAgIHJldHVybiB7IHN0YXR1czogMjAwIH07XG4gICAgICAgIH1cblxuICAgICAgICBhd2FpdCBQcm9taXNlLmFsbChcbiAgICAgICAgICAgIG1lbWJlcnMuZGF0YS5tYXAoIGFzeW5jIG1lbWJlciA9PiB7XG4gICAgICAgICAgICAgICAgbGV0IGNvdW50ID0gMDtcbiAgICAgICAgICAgICAgICBjb25zdCB7IG9wZW5pZCB9ID0gbWVtYmVyXG5cbiAgICAgICAgICAgICAgICAvLyAz44CB6I635Y+W5LiK5qyh5rWP6KeI6K6i5Y2V55qE5pe26Ze05oizXG4gICAgICAgICAgICAgICAgY29uc3QgY29uZmlnJCA9IGF3YWl0IGRiLmNvbGxlY3Rpb24oJ2FuYWx5c2UtZGF0YScpXG4gICAgICAgICAgICAgICAgICAgIC53aGVyZSh7XG4gICAgICAgICAgICAgICAgICAgICAgICBvcGVuaWQsXG4gICAgICAgICAgICAgICAgICAgICAgICB0aWQ6IHRyaXAuX2lkLFxuICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogJ21hbmFnZXItdHJpcC1vcmRlci12aXNpdCdcbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgLmdldCggKTtcbiAgICAgICAgICAgICAgICBjb25zdCB0cmlwT3JkZXJWaXNpdENvbmZpZyA9IGNvbmZpZyQuZGF0YVsgMCBdO1xuXG4gICAgICAgICAgICAgICAgbGV0IHF1ZXJ5OiBhbnkgPSB7XG4gICAgICAgICAgICAgICAgICAgIHRpZDogdHJpcC5faWQsXG4gICAgICAgICAgICAgICAgICAgIHBheV9zdGF0dXM6IF8ubmVxKCcwJyksXG4gICAgICAgICAgICAgICAgICAgIGJhc2Vfc3RhdHVzOiBfLm9yKCBfLmVxKCcwJyksIF8uZXEoJzEnKSwgXy5lcSgnMicpKVxuICAgICAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgICAgICBpZiAoICEhdHJpcE9yZGVyVmlzaXRDb25maWcgKSB7XG4gICAgICAgICAgICAgICAgICAgIHF1ZXJ5ID0gT2JqZWN0LmFzc2lnbih7IH0sIHF1ZXJ5LCB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjcmVhdGVUaW1lOiBfLmd0ZSggdHJpcE9yZGVyVmlzaXRDb25maWcudmFsdWUgKVxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAvLyA044CB6LCD55So5o6o6YCBXG4gICAgICAgICAgICAgICAgY29uc3QgY291bnQkID0gYXdhaXQgZGIuY29sbGVjdGlvbignb3JkZXInKVxuICAgICAgICAgICAgICAgICAgICAgICAgLndoZXJlKCBxdWVyeSApXG4gICAgICAgICAgICAgICAgICAgICAgICAuY291bnQoICk7XG4gICAgICAgICAgICAgICAgY291bnQgPSBjb3VudCQudG90YWw7XG5cblxuICAgICAgICAgICAgICAgIGlmICggY291bnQgPT09IDAgKSB7IFxuICAgICAgICAgICAgICAgICAgICByZXR1cm4geyBzdGF1czogMjAwIH07XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgLy8gNOOAgeiwg+eUqOaOqOmAgVxuICAgICAgICAgICAgICAgIGNvbnN0IHB1c2gkID0gYXdhaXQgY2xvdWQuY2FsbEZ1bmN0aW9uKHtcbiAgICAgICAgICAgICAgICAgICAgbmFtZTogJ2NvbW1vbicsXG4gICAgICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICR1cmw6ICdwdXNoLXN1YnNjcmliZS1jbG91ZCcsXG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb3BlbmlkLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6ICduZXdPcmRlcicsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcGFnZTogJ3BhZ2VzL21hbmFnZXItdHJpcC1saXN0L2luZGV4JyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZXh0czogW2DkvaDmnIkke2NvdW50feadoeaWsOiuouWNlWAsIGDngrnlh7vmn6XnnItgXVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyggJz09PT0gcHVzaCcsIHB1c2gkLnJlc3VsdCApXG5cbiAgICAgICAgICAgICAgICAvLyA144CB5pu05paw44CB5Yib5bu66YWN572uXG4gICAgICAgICAgICAgICAgaWYgKCBwdXNoJC5yZXN1bHQuc3RhdHVzID09PSAyMDAgKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKCAhIXRyaXBPcmRlclZpc2l0Q29uZmlnICkge1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyDmm7TmlrDkuIDkuIvmraTmnaHphY3nva5cbiAgICAgICAgICAgICAgICAgICAgICAgIGF3YWl0IGRiLmNvbGxlY3Rpb24oJ2FuYWx5c2UtZGF0YScpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLmRvYyggU3RyaW5nKCB0cmlwT3JkZXJWaXNpdENvbmZpZy5faWQgKSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAudXBkYXRlKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU6IGdldE5vdyggdHJ1ZSApXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIOWIm+W7uuS4gOS4i+mFjee9rlxuICAgICAgICAgICAgICAgICAgICAgICAgYXdhaXQgZGIuY29sbGVjdGlvbignYW5hbHlzZS1kYXRhJylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAuYWRkKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb3BlbmlkLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGlkOiB0cmlwLl9pZCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6ICdtYW5hZ2VyLXRyaXAtb3JkZXItdmlzaXQnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU6IGdldE5vdyggdHJ1ZSApXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHJldHVybjtcblxuICAgICAgICAgICAgfSlcbiAgICAgICAgKTtcbiAgICAgICAgXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBzdGF0dXM6IDIwMFxuICAgICAgICB9O1xuXG4gICAgfSBjYXRjaCAoIGUgKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBzdGF0dXM6IDUwMCxcbiAgICAgICAgICAgIG1lc3NhZ2U6IHR5cGVvZiBlID09PSAnc3RyaW5nJyA/IGUgOiBKU09OLnN0cmluZ2lmeSggZSApXG4gICAgICAgIH1cbiAgICB9XG59XG5cbi8qKiBcbiAqIOiuouWNlTU6IOWwvuasvuaOqOmAgVxuICovXG5leHBvcnQgY29uc3QgcHVzaExhc3RQYXkgPSBhc3luYyAoICkgPT4ge1xuXG4gICAgLy8gMOOAgeaYr+WQpuS4ujDngrlcbiAgICBjb25zdCBub3dEYXRlID0gZ2V0Tm93KCApO1xuICAgIGlmICggbm93RGF0ZS5nZXRIb3VycyggKSAhPT0gMCAmJiBub3dEYXRlLmdldE1pbnV0ZXMoICkgIT09IDAgKSB7XG4gICAgICAgIHJldHVybiB7IHN0YXR1czogMjAwIH07XG4gICAgfVxuXG4gICAgLy8gMeOAgeiOt+WPluS4iuS4gOi2n3RyaXBcbiAgICAvLyDmjInnu5PmnZ/ml6XmnJ/lgJLlj5nluo/vvIzojrflj5bmnIDlpJox5p2hIOW3sue7k+adn+eahOihjOeoi1xuICAgIGNvbnN0IHRyaXAkID0gYXdhaXQgZGIuY29sbGVjdGlvbigndHJpcCcpXG4gICAgICAgIC53aGVyZSh7XG4gICAgICAgICAgICBpc0Nsb3NlZDogdHJ1ZVxuICAgICAgICB9KVxuICAgICAgICAubGltaXQoIDEgKVxuICAgICAgICAub3JkZXJCeSgnZW5kX2RhdGUnLCAnZGVzYycpXG4gICAgICAgIC5nZXQoICk7XG5cbiAgICAvLyAy44CB6I635Y+WIHB1c2g6IHRydWUg55qE566h55CG5ZGYXG4gICAgY29uc3QgbWVtYmVycyA9IGF3YWl0IGRiLmNvbGxlY3Rpb24oJ21hbmFnZXItbWVtYmVyJylcbiAgICAgICAgLndoZXJlKHtcbiAgICAgICAgICAgIHB1c2g6IHRydWVcbiAgICAgICAgfSlcbiAgICAgICAgLmdldCggKTtcbiAgICBcbiAgICBpZiAoIHRyaXAkLmRhdGEubGVuZ3RoID09PSAwIHx8IG1lbWJlcnMuZGF0YS5sZW5ndGggPT09IDAgKSB7XG4gICAgICAgIHJldHVybiB7IHN0YXR1czogMjAwIH07XG4gICAgfVxuXG4gICAgYXdhaXQgUHJvbWlzZS5hbGwoXG4gICAgICAgIG1lbWJlcnMuZGF0YS5tYXAoIGFzeW5jIG1lbWJlciA9PiB7XG5cbiAgICAgICAgICAgIGNvbnN0IHsgb3BlbmlkIH0gPSBtZW1iZXI7XG5cbiAgICAgICAgICAgIC8vIDPjgIHojrflj5bkuIrmrKHmtY/op4jlsL7mrL7nmoTml7bpl7TmiLNcbiAgICAgICAgICAgIGNvbnN0IGNvbmZpZyQgPSBhd2FpdCBkYi5jb2xsZWN0aW9uKCdhbmFseXNlLWRhdGEnKVxuICAgICAgICAgICAgICAgICAgICAud2hlcmUoe1xuICAgICAgICAgICAgICAgICAgICAgICAgb3BlbmlkLFxuICAgICAgICAgICAgICAgICAgICAgICAgdGlkOiB0cmlwJC5kYXRhWyAwIF0uX2lkLFxuICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogJ21hbmFnZXItcGF5LWxhc3QtdmlzaXQnXG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgIC5nZXQoICk7XG5cbiAgICAgICAgICAgIGNvbnN0IGNvbmZpZyA9IGNvbmZpZyQuZGF0YVsgMCBdO1xuXG4gICAgICAgICAgICAvLyAz44CB5p+l6K+iXG4gICAgICAgICAgICBsZXQgcXVlcnk6IGFueSA9IHtcbiAgICAgICAgICAgICAgICBwYXlfc3RhdHVzOiAnMicsXG4gICAgICAgICAgICAgICAgdGlkOiB0cmlwJC5kYXRhWyAwIF0uX2lkLFxuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgaWYgKCBjb25maWcgKSB7XG4gICAgICAgICAgICAgICAgcXVlcnkgPSB7XG4gICAgICAgICAgICAgICAgICAgIC4uLnF1ZXJ5LFxuICAgICAgICAgICAgICAgICAgICBwYXl0aW1lOiBfLmd0ZSggY29uZmlnLnZhbHVlIClcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgXG4gICAgICAgICAgICBjb25zdCBvcmRlcnMkID0gYXdhaXQgZGIuY29sbGVjdGlvbignb3JkZXInKVxuICAgICAgICAgICAgICAgIC53aGVyZSggcXVlcnkgKVxuICAgICAgICAgICAgICAgIC5nZXQoICk7XG5cbiAgICAgICAgICAgIGNvbnN0IGNvdW50ID0gQXJyYXkuZnJvbShcbiAgICAgICAgICAgICAgICBuZXcgU2V0KFxuICAgICAgICAgICAgICAgICAgICBvcmRlcnMkLmRhdGEubWFwKCB4ID0+IHgub3BlbmlkIClcbiAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICApLmxlbmd0aDtcblxuICAgICAgICAgICAgaWYgKCBjb3VudCA9PT0gMCApIHtcbiAgICAgICAgICAgICAgICByZXR1cm4geyBzdGF1czogMjAwIH07XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIDTjgIHosIPnlKjmjqjpgIFcbiAgICAgICAgICAgIGNvbnN0IHB1c2gkID0gYXdhaXQgY2xvdWQuY2FsbEZ1bmN0aW9uKHtcbiAgICAgICAgICAgICAgICBuYW1lOiAnY29tbW9uJyxcbiAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICAgICR1cmw6ICdwdXNoLXN1YnNjcmliZS1jbG91ZCcsXG4gICAgICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG9wZW5pZCxcbiAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6ICdnZXRNb25leScsXG4gICAgICAgICAgICAgICAgICAgICAgICBwYWdlOiAncGFnZXMvbWFuYWdlci10cmlwLWxpc3QvaW5kZXgnLFxuICAgICAgICAgICAgICAgICAgICAgICAgdGV4dHM6IFtgJHtjb3VudH3kurrku5jkuoblsL7mrL5gLCBg5LuK5aSpYF1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBjb25zb2xlLmxvZyggJz09PT0gcHVzaCcsIHB1c2gkLnJlc3VsdCApXG4gICAgICAgICAgICAvLyA144CB5pu05paw44CB5Yib5bu66YWN572uXG4gICAgICAgICAgICBpZiAoIHB1c2gkLnJlc3VsdC5zdGF0dXMgPT09IDIwMCApIHtcblxuICAgICAgICAgICAgICAgIGlmICggISFjb25maWcgKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgLy8g5pu05paw5LiA5LiL5q2k5p2h6YWN572uXG4gICAgICAgICAgICAgICAgICAgIGF3YWl0IGRiLmNvbGxlY3Rpb24oJ2FuYWx5c2UtZGF0YScpXG4gICAgICAgICAgICAgICAgICAgICAgICAuZG9jKCBTdHJpbmcoIGNvbmZpZy5faWQgKSlcbiAgICAgICAgICAgICAgICAgICAgICAgIC51cGRhdGUoe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU6IGdldE5vdyggdHJ1ZSApXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgLy8g5Yib5bu65LiA5LiL6YWN572uXG4gICAgICAgICAgICAgICAgICAgIGF3YWl0IGRiLmNvbGxlY3Rpb24oJ2FuYWx5c2UtZGF0YScpXG4gICAgICAgICAgICAgICAgICAgICAgICAuYWRkKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9wZW5pZCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGlkOiB0cmlwJC5kYXRhWyAwIF0uX2lkLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiAnbWFuYWdlci1wYXktbGFzdC12aXNpdCcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlOiBnZXROb3coIHRydWUgKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSlcbiAgICApO1xuXG59Il19