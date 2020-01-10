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
var subscribe_push_1 = require("../subscribe-push");
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
var checkIsInRange = function (now, range) {
    if (range === void 0) { range = [99]; }
    return range.some(function (x) {
        var h = now.getHours();
        return x === h && now.getMinutes() === 0;
    });
};
exports.overtime = function () { return __awaiter(void 0, void 0, void 0, function () {
    var orders$, e_1;
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
                if (orders$.data.length === 0) {
                    return [2, { status: 200 }];
                }
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
                return [4, Promise.all(orders$.data.map(function (order) { return __awaiter(void 0, void 0, void 0, function () {
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
exports.payedFix = function () { return __awaiter(void 0, void 0, void 0, function () {
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
                if (orders$.data.length === 0) {
                    return [2, { status: 200 }];
                }
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
exports.priceFix = function () { return __awaiter(void 0, void 0, void 0, function () {
    var trips$, currentTrip, tid_1, shoppinglists$, e_3;
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
                return [4, Promise.all(shoppinglists$.data.map(function (shoppingList) { return __awaiter(void 0, void 0, void 0, function () {
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
exports.payLastFix = function () { return __awaiter(void 0, void 0, void 0, function () {
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
                if (orders$.data.length === 0) {
                    return [2, { status: 200 }];
                }
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
exports.pushNew = function () { return __awaiter(void 0, void 0, void 0, function () {
    var nowDate, trips$, trips, trip_1, members, e_5;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 4, , 5]);
                nowDate = getNow();
                if (!checkIsInRange(nowDate, [12, 18, 0])) {
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
                return [4, Promise.all(members.data.map(function (member) { return __awaiter(void 0, void 0, void 0, function () {
                        var count, openid, config$, tripOrderVisitConfig, query, count$;
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
                                    return [4, subscribe_push_1.subscribePush({
                                            openid: openid,
                                            type: 'newOrder',
                                            page: "pages/manager-trip-order-all/index?tid=" + trip_1._id,
                                            texts: ["\u4F60\u6709" + count + "\u6761\u65B0\u8BA2\u5355", "\u70B9\u51FB\u67E5\u770B"]
                                        })];
                                case 3:
                                    _a.sent();
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
exports.pushLastPay = function () { return __awaiter(void 0, void 0, void 0, function () {
    var trip$, members;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (checkIsInRange(getNow(), [22])) {
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
                return [4, Promise.all(members.data.map(function (member) { return __awaiter(void 0, void 0, void 0, function () {
                        var openid, config$, config, query, orders$, count;
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
                                        query = __assign(__assign({}, query), { paytime: _.gte(config.value) });
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
                                    return [4, subscribe_push_1.subscribePush({
                                            openid: openid,
                                            type: 'getMoney',
                                            page: 'pages/manager-trip-list/index',
                                            texts: [count + "\u4EBA\u4ED8\u4E86\u5C3E\u6B3E", "\u70B9\u51FB\u67E5\u770B"]
                                        })];
                                case 3:
                                    _a.sent();
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEscUNBQXVDO0FBQ3ZDLG9EQUFrRDtBQUVsRCxLQUFLLENBQUMsSUFBSSxDQUFDO0lBQ1AsR0FBRyxFQUFFLE9BQU8sQ0FBQyxHQUFHLENBQUMsS0FBSztDQUN6QixDQUFDLENBQUM7QUFFSCxJQUFNLEVBQUUsR0FBZ0IsS0FBSyxDQUFDLFFBQVEsRUFBRyxDQUFDO0FBQzFDLElBQU0sQ0FBQyxHQUFHLEVBQUUsQ0FBQyxPQUFPLENBQUM7QUFRckIsSUFBTSxNQUFNLEdBQUcsVUFBRSxFQUFVO0lBQVYsbUJBQUEsRUFBQSxVQUFVO0lBQ3ZCLElBQUssRUFBRSxFQUFHO1FBQ04sT0FBTyxJQUFJLENBQUMsR0FBRyxFQUFHLENBQUM7S0FDdEI7SUFDRCxJQUFNLE1BQU0sR0FBRyxJQUFJLElBQUksQ0FBRSxJQUFJLElBQUksRUFBRyxDQUFDLGNBQWMsRUFBRyxDQUFDLENBQUM7SUFDeEQsT0FBTyxJQUFJLElBQUksQ0FBRSxNQUFNLENBQUMsT0FBTyxFQUFHLEdBQUcsQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsSUFBSSxDQUFFLENBQUE7QUFDN0QsQ0FBQyxDQUFBO0FBRUQsSUFBTSxjQUFjLEdBQUcsVUFBRSxHQUFTLEVBQUUsS0FBYztJQUFkLHNCQUFBLEVBQUEsU0FBVSxFQUFFLENBQUU7SUFDOUMsT0FBTyxLQUFLLENBQUMsSUFBSSxDQUFFLFVBQUEsQ0FBQztRQUNoQixJQUFNLENBQUMsR0FBRyxHQUFHLENBQUMsUUFBUSxFQUFHLENBQUM7UUFDMUIsT0FBTyxDQUFDLEtBQUssQ0FBQyxJQUFJLEdBQUcsQ0FBQyxVQUFVLEVBQUcsS0FBSyxDQUFDLENBQUM7SUFDOUMsQ0FBQyxDQUFDLENBQUM7QUFDUCxDQUFDLENBQUE7QUFLWSxRQUFBLFFBQVEsR0FBRzs7Ozs7O2dCQUdBLFdBQU0sRUFBRSxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUM7eUJBQ3ZDLEtBQUssQ0FBQzt3QkFDSCxVQUFVLEVBQUUsR0FBRzt3QkFDZixXQUFXLEVBQUUsR0FBRzt3QkFDaEIsVUFBVSxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUUsTUFBTSxDQUFFLElBQUksQ0FBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsSUFBSSxDQUFFO3FCQUN2RCxDQUFDO3lCQUNELEdBQUcsRUFBRyxFQUFBOztnQkFOTCxPQUFPLEdBQUcsU0FNTDtnQkFFWCxJQUFLLE9BQU8sQ0FBQyxJQUFJLENBQUMsTUFBTSxLQUFLLENBQUMsRUFBRztvQkFDN0IsV0FBTyxFQUFFLE1BQU0sRUFBRSxHQUFHLEVBQUUsRUFBQztpQkFDMUI7Z0JBR0QsV0FBTSxPQUFPLENBQUMsR0FBRyxDQUFFLE9BQU8sQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFFLFVBQUEsS0FBSzt3QkFDdEMsT0FBTyxFQUFFLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxDQUFDLEdBQUcsQ0FBRSxNQUFNLENBQUUsS0FBSyxDQUFDLEdBQUcsQ0FBRSxDQUFDOzZCQUNsRCxNQUFNLENBQUM7NEJBQ0osSUFBSSxFQUFFO2dDQUNGLFdBQVcsRUFBRSxHQUFHOzZCQUNuQjt5QkFDSixDQUFDLENBQUE7b0JBQ1YsQ0FBQyxDQUFDLENBQUMsRUFBQTs7Z0JBUEgsU0FPRyxDQUFDO2dCQUdKLFdBQU0sT0FBTyxDQUFDLEdBQUcsQ0FBRSxPQUFPLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBRSxVQUFNLEtBQUs7Ozs7O29DQUV0QyxRQUFRLEdBQUcsS0FBSyxDQUFDLEdBQUcsSUFBSSxLQUFLLENBQUMsR0FBRyxDQUFDO29DQUNsQyxVQUFVLEdBQUcsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUM7b0NBRXRDLFdBQU0sRUFBRSxDQUFDLFVBQVUsQ0FBRSxVQUFVLENBQUU7NkNBQzNDLEdBQUcsQ0FBRSxRQUFRLENBQUU7NkNBQ2YsR0FBRyxFQUFHLEVBQUE7O29DQUZMLE1BQU0sR0FBRyxTQUVKO29DQUVYLElBQUssTUFBTSxDQUFDLElBQUksQ0FBQyxLQUFLLEtBQUssU0FBUyxJQUFJLE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxLQUFLLElBQUksRUFBRzt3Q0FBRSxXQUFPO3FDQUFFO29DQUVoRixXQUFNLEVBQUUsQ0FBQyxVQUFVLENBQUUsVUFBVSxDQUFFLENBQUMsR0FBRyxDQUFFLFFBQVEsQ0FBRTs2Q0FDNUMsTUFBTSxDQUFDOzRDQUNKLElBQUksRUFBRTtnREFDRixLQUFLLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBRSxLQUFLLENBQUMsS0FBSyxDQUFFOzZDQUM5Qjt5Q0FDSixDQUFDLEVBQUE7O29DQUxOLFNBS00sQ0FBQzs7Ozt5QkFDVixDQUFDLENBQUMsRUFBQTs7Z0JBakJILFNBaUJHLENBQUM7Z0JBRUosV0FBTyxFQUFFLE1BQU0sRUFBRSxHQUFHLEVBQUUsRUFBQTs7O2dCQUV0QixPQUFPLENBQUMsR0FBRyxDQUFDLHFCQUFxQixDQUFFLENBQUE7Z0JBQ25DLFdBQU8sRUFBRSxNQUFNLEVBQUUsR0FBRyxFQUFFLEVBQUE7Ozs7S0FFN0IsQ0FBQztBQUtXLFFBQUEsUUFBUSxHQUFHOzs7Ozs7Z0JBR0EsV0FBTSxFQUFFLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQzt5QkFDdkMsS0FBSyxDQUFDO3dCQUNILElBQUksRUFBRSxLQUFLO3dCQUNYLFVBQVUsRUFBRSxHQUFHO3FCQUNsQixDQUFDO3lCQUNELEdBQUcsRUFBRyxFQUFBOztnQkFMTCxPQUFPLEdBQUcsU0FLTDtnQkFFWCxJQUFLLE9BQU8sQ0FBQyxJQUFJLENBQUMsTUFBTSxLQUFLLENBQUMsRUFBRztvQkFDN0IsV0FBTyxFQUFFLE1BQU0sRUFBRSxHQUFHLEVBQUUsRUFBQztpQkFDMUI7Z0JBR0QsV0FBTSxPQUFPLENBQUMsR0FBRyxDQUFFLE9BQU8sQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFFLFVBQUEsS0FBSzt3QkFDdEMsT0FBTyxFQUFFLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxDQUFDLEdBQUcsQ0FBRSxNQUFNLENBQUUsS0FBSyxDQUFDLEdBQUcsQ0FBRSxDQUFDOzZCQUNsRCxNQUFNLENBQUM7NEJBQ0osSUFBSSxFQUFFO2dDQUNGLElBQUksRUFBRSxRQUFROzZCQUNqQjt5QkFDSixDQUFDLENBQUE7b0JBQ1YsQ0FBQyxDQUFDLENBQUMsRUFBQTs7Z0JBUEgsU0FPRyxDQUFDO2dCQUdKLFdBQU0sT0FBTyxDQUFDLEdBQUcsQ0FDYixPQUFPLENBQUMsSUFBSTt5QkFDUCxNQUFNLENBQUUsVUFBQSxDQUFDLElBQUksT0FBQSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBUCxDQUFPLENBQUU7eUJBQ3RCLEdBQUcsQ0FBRSxVQUFBLEtBQUs7d0JBQ1AsT0FBTyxFQUFFLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQyxDQUFDLEdBQUcsQ0FBRSxLQUFLLENBQUMsR0FBRyxDQUFFOzZCQUN4QyxNQUFNLEVBQUcsQ0FBQTtvQkFDbEIsQ0FBQyxDQUFDLENBQ1QsRUFBQTs7Z0JBUEQsU0FPQyxDQUFDO2dCQUVGLFdBQU87d0JBQ0gsTUFBTSxFQUFFLEdBQUc7cUJBQ2QsRUFBQTs7O2dCQUlELE9BQU8sQ0FBQyxHQUFHLENBQUMscUJBQXFCLENBQUUsQ0FBQTtnQkFDbkMsV0FBTyxFQUFFLE1BQU0sRUFBRSxHQUFHLEVBQUUsRUFBQTs7OztLQUU3QixDQUFBO0FBTVksUUFBQSxRQUFRLEdBQUc7Ozs7OztnQkFJRCxXQUFNLEtBQUssQ0FBQyxZQUFZLENBQUM7d0JBQ3BDLElBQUksRUFBRSxNQUFNO3dCQUNaLElBQUksRUFBRTs0QkFDRixJQUFJLEVBQUUsT0FBTzt5QkFDaEI7cUJBQ0osQ0FBQyxFQUFBOztnQkFMSSxNQUFNLEdBQUcsU0FLYjtnQkFFSSxXQUFXLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUUsQ0FBQyxDQUFFLENBQUM7Z0JBRTVDLElBQUssQ0FBQyxXQUFXLEVBQUc7b0JBQ2hCLFdBQU87NEJBQ0gsTUFBTSxFQUFFLEdBQUc7eUJBQ2QsRUFBQTtpQkFDSjtnQkFFSyxRQUFNLFdBQVcsQ0FBQyxHQUFHLENBQUM7Z0JBR0wsV0FBTSxFQUFFLENBQUMsVUFBVSxDQUFDLGVBQWUsQ0FBQzt5QkFDdEQsS0FBSyxDQUFDO3dCQUNILEdBQUcsT0FBQTt3QkFDSCxXQUFXLEVBQUUsR0FBRztxQkFDbkIsQ0FBQzt5QkFDRCxHQUFHLEVBQUcsRUFBQTs7Z0JBTEwsY0FBYyxHQUFHLFNBS1o7Z0JBRVgsV0FBTSxPQUFPLENBQUMsR0FBRyxDQUFFLGNBQWMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFFLFVBQU0sWUFBWTs7Ozs7b0NBRWxELEdBQUcsR0FBeUMsWUFBWSxJQUFyRCxFQUFFLEdBQUcsR0FBb0MsWUFBWSxJQUFoRCxFQUFFLFdBQVcsR0FBdUIsWUFBWSxZQUFuQyxFQUFFLGdCQUFnQixHQUFLLFlBQVksaUJBQWpCLENBQWtCO29DQUdqRCxXQUFNLEVBQUUsQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDOzZDQUN2QyxLQUFLLENBQUM7NENBQ0gsR0FBRyxPQUFBOzRDQUNILEdBQUcsS0FBQTs0Q0FDSCxHQUFHLEtBQUE7NENBQ0gsV0FBVyxFQUFFLEdBQUc7eUNBQ25CLENBQUM7NkNBQ0QsR0FBRyxFQUFHLEVBQUE7O29DQVBMLE9BQU8sR0FBRyxTQU9MO29DQUdYLFdBQU0sT0FBTyxDQUFDLEdBQUcsQ0FBRSxPQUFPLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBRSxVQUFBLEtBQUs7NENBQ3RDLE9BQU8sRUFBRSxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUM7aURBQ3hCLEdBQUcsQ0FBRSxNQUFNLENBQUUsS0FBSyxDQUFDLEdBQUcsQ0FBRSxDQUFDO2lEQUN6QixNQUFNLENBQUM7Z0RBQ0osSUFBSSxFQUFFO29EQUNGLGNBQWMsRUFBRSxXQUFXO29EQUMzQixtQkFBbUIsRUFBRSxnQkFBZ0I7b0RBQ3JDLFdBQVcsRUFBRSxHQUFHO2lEQUNuQjs2Q0FDSixDQUFDLENBQUE7d0NBQ1YsQ0FBQyxDQUFDLENBQUMsRUFBQTs7b0NBVkgsU0FVRyxDQUFDOzs7O3lCQUVQLENBQUMsQ0FBQyxFQUFBOztnQkEzQkgsU0EyQkcsQ0FBQztnQkFFSixXQUFPLEVBQUUsTUFBTSxFQUFFLEdBQUcsRUFBRSxFQUFBOzs7Z0JBR3RCLE9BQU8sQ0FBQyxHQUFHLENBQUMscUJBQXFCLEVBQUUsR0FBQyxDQUFFLENBQUM7Z0JBQ3ZDLFdBQU8sRUFBRSxNQUFNLEVBQUUsR0FBRyxFQUFFLEVBQUE7Ozs7S0FFN0IsQ0FBQTtBQUtZLFFBQUEsVUFBVSxHQUFHOzs7Ozs7Z0JBR0YsV0FBTSxFQUFFLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQzt5QkFDdkMsS0FBSyxDQUFDO3dCQUNILFVBQVUsRUFBRSxHQUFHO3dCQUNmLFdBQVcsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsRUFBRyxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDO3FCQUN2RCxDQUFDO3lCQUNELEdBQUcsRUFBRyxFQUFBOztnQkFMTCxPQUFPLEdBQUcsU0FLTDtnQkFFWCxJQUFLLE9BQU8sQ0FBQyxJQUFJLENBQUMsTUFBTSxLQUFLLENBQUMsRUFBRztvQkFDN0IsV0FBTyxFQUFFLE1BQU0sRUFBRSxHQUFHLEVBQUUsRUFBQztpQkFDMUI7Z0JBRUQsV0FBTSxPQUFPLENBQUMsR0FBRyxDQUNiLE9BQU8sQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFFLFVBQUEsS0FBSzt3QkFDbkIsT0FBTyxFQUFFLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQzs2QkFDeEIsR0FBRyxDQUFFLE1BQU0sQ0FBRSxLQUFLLENBQUMsR0FBRyxDQUFFLENBQUM7NkJBQ3pCLE1BQU0sQ0FBQzs0QkFDSixJQUFJLEVBQUU7Z0NBQ0YsV0FBVyxFQUFFLEdBQUc7NkJBQ25CO3lCQUNKLENBQUMsQ0FBQTtvQkFDVixDQUFDLENBQUMsQ0FDTCxFQUFBOztnQkFWRCxTQVVDLENBQUE7Ozs7Z0JBR0QsT0FBTyxDQUFDLEdBQUcsQ0FBQyx1QkFBdUIsQ0FBRSxDQUFBO2dCQUNyQyxXQUFPLEVBQUUsTUFBTSxFQUFFLEdBQUcsRUFBRSxFQUFBOzs7O0tBRTdCLENBQUE7QUFNWSxRQUFBLE9BQU8sR0FBRzs7Ozs7O2dCQUdULE9BQU8sR0FBRyxNQUFNLEVBQUcsQ0FBQztnQkFHMUIsSUFBSyxDQUFDLGNBQWMsQ0FBRSxPQUFPLEVBQUUsQ0FBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLENBQUMsQ0FBRSxDQUFDLEVBQUU7b0JBQzNDLFdBQU8sRUFBRSxNQUFNLEVBQUUsR0FBRyxFQUFFLEVBQUM7aUJBQzFCO2dCQUdjLFdBQU0sS0FBSyxDQUFDLFlBQVksQ0FBQzt3QkFDcEMsSUFBSSxFQUFFOzRCQUNGLElBQUksRUFBRSxPQUFPO3lCQUNoQjt3QkFDRCxJQUFJLEVBQUUsTUFBTTtxQkFDZixDQUFDLEVBQUE7O2dCQUxJLE1BQU0sR0FBRyxTQUtiO2dCQUNJLEtBQUssR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQztnQkFDM0IsU0FBTyxLQUFLLENBQUUsQ0FBQyxDQUFFLENBQUM7Z0JBR1IsV0FBTSxFQUFFLENBQUMsVUFBVSxDQUFDLGdCQUFnQixDQUFDO3lCQUNoRCxLQUFLLENBQUM7d0JBQ0gsSUFBSSxFQUFFLElBQUk7cUJBQ2IsQ0FBQzt5QkFDRCxHQUFHLEVBQUcsRUFBQTs7Z0JBSkwsT0FBTyxHQUFHLFNBSUw7Z0JBRVgsSUFBSyxDQUFDLE1BQUksSUFBSSxPQUFPLENBQUMsSUFBSSxDQUFDLE1BQU0sS0FBSyxDQUFDLEVBQUc7b0JBQ3RDLFdBQU8sRUFBRSxNQUFNLEVBQUUsR0FBRyxFQUFFLEVBQUM7aUJBQzFCO2dCQUVELFdBQU0sT0FBTyxDQUFDLEdBQUcsQ0FDYixPQUFPLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBRSxVQUFNLE1BQU07Ozs7O29DQUN0QixLQUFLLEdBQUcsQ0FBQyxDQUFDO29DQUNOLE1BQU0sR0FBSyxNQUFNLE9BQVgsQ0FBVztvQ0FHVCxXQUFNLEVBQUUsQ0FBQyxVQUFVLENBQUMsY0FBYyxDQUFDOzZDQUM5QyxLQUFLLENBQUM7NENBQ0gsTUFBTSxRQUFBOzRDQUNOLEdBQUcsRUFBRSxNQUFJLENBQUMsR0FBRzs0Q0FDYixJQUFJLEVBQUUsMEJBQTBCO3lDQUNuQyxDQUFDOzZDQUNELEdBQUcsRUFBRyxFQUFBOztvQ0FOTCxPQUFPLEdBQUcsU0FNTDtvQ0FDTCxvQkFBb0IsR0FBRyxPQUFPLENBQUMsSUFBSSxDQUFFLENBQUMsQ0FBRSxDQUFDO29DQUUzQyxLQUFLLEdBQVE7d0NBQ2IsR0FBRyxFQUFFLE1BQUksQ0FBQyxHQUFHO3dDQUNiLFVBQVUsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQzt3Q0FDdEIsV0FBVyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUM7cUNBQ3RELENBQUM7b0NBRUYsSUFBSyxDQUFDLENBQUMsb0JBQW9CLEVBQUc7d0NBQzFCLEtBQUssR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDLEVBQUcsRUFBRSxLQUFLLEVBQUU7NENBQzlCLFVBQVUsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFFLG9CQUFvQixDQUFDLEtBQUssQ0FBRTt5Q0FDbEQsQ0FBQyxDQUFDO3FDQUNOO29DQUdjLFdBQU0sRUFBRSxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUM7NkNBQ2xDLEtBQUssQ0FBRSxLQUFLLENBQUU7NkNBQ2QsS0FBSyxFQUFHLEVBQUE7O29DQUZYLE1BQU0sR0FBRyxTQUVFO29DQUNqQixLQUFLLEdBQUcsTUFBTSxDQUFDLEtBQUssQ0FBQztvQ0FHckIsSUFBSyxLQUFLLEtBQUssQ0FBQyxFQUFHO3dDQUNmLFdBQU8sRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFFLEVBQUM7cUNBQ3pCO29DQUdELFdBQU0sOEJBQWEsQ0FBQzs0Q0FDaEIsTUFBTSxRQUFBOzRDQUNOLElBQUksRUFBRSxVQUFVOzRDQUNoQixJQUFJLEVBQUUsNENBQTBDLE1BQUksQ0FBQyxHQUFLOzRDQUMxRCxLQUFLLEVBQUUsQ0FBQyxpQkFBSyxLQUFLLDZCQUFNLEVBQUUsMEJBQU0sQ0FBQzt5Q0FDcEMsQ0FBQyxFQUFBOztvQ0FMRixTQUtFLENBQUM7eUNBR0UsQ0FBQyxDQUFDLG9CQUFvQixFQUF0QixjQUFzQjtvQ0FHdkIsV0FBTSxFQUFFLENBQUMsVUFBVSxDQUFDLGNBQWMsQ0FBQzs2Q0FDOUIsR0FBRyxDQUFFLE1BQU0sQ0FBRSxvQkFBb0IsQ0FBQyxHQUFHLENBQUUsQ0FBQzs2Q0FDeEMsTUFBTSxDQUFDOzRDQUNKLElBQUksRUFBRTtnREFDRixLQUFLLEVBQUUsTUFBTSxDQUFFLElBQUksQ0FBRTs2Q0FDeEI7eUNBQ0osQ0FBQyxFQUFBOztvQ0FOTixTQU1NLENBQUM7O3dDQUdQLFdBQU0sRUFBRSxDQUFDLFVBQVUsQ0FBQyxjQUFjLENBQUM7eUNBQzlCLEdBQUcsQ0FBQzt3Q0FDRCxJQUFJLEVBQUU7NENBQ0YsTUFBTSxRQUFBOzRDQUNOLEdBQUcsRUFBRSxNQUFJLENBQUMsR0FBRzs0Q0FDYixJQUFJLEVBQUUsMEJBQTBCOzRDQUNoQyxLQUFLLEVBQUUsTUFBTSxDQUFFLElBQUksQ0FBRTt5Q0FDeEI7cUNBQ0osQ0FBQyxFQUFBOztvQ0FSTixTQVFNLENBQUM7O3dDQUdYLFdBQU87Ozt5QkFFVixDQUFDLENBQ0wsRUFBQTs7Z0JBekVELFNBeUVDLENBQUM7Z0JBRUYsV0FBTzt3QkFDSCxNQUFNLEVBQUUsR0FBRztxQkFDZCxFQUFDOzs7Z0JBR0YsV0FBTzt3QkFDSCxNQUFNLEVBQUUsR0FBRzt3QkFDWCxPQUFPLEVBQUUsT0FBTyxHQUFDLEtBQUssUUFBUSxDQUFDLENBQUMsQ0FBQyxHQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUUsR0FBQyxDQUFFO3FCQUMzRCxFQUFBOzs7O0tBRVIsQ0FBQTtBQU1ZLFFBQUEsV0FBVyxHQUFHOzs7OztnQkFHdkIsSUFBSyxjQUFjLENBQUUsTUFBTSxFQUFHLEVBQUUsQ0FBRSxFQUFFLENBQUUsQ0FBQyxFQUFFO29CQUNyQyxXQUFPLEVBQUUsTUFBTSxFQUFFLEdBQUcsRUFBRSxFQUFBO2lCQUN6QjtnQkFJYSxXQUFNLEVBQUUsQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDO3lCQUNwQyxLQUFLLENBQUM7d0JBQ0gsUUFBUSxFQUFFLElBQUk7cUJBQ2pCLENBQUM7eUJBQ0QsS0FBSyxDQUFFLENBQUMsQ0FBRTt5QkFDVixPQUFPLENBQUMsVUFBVSxFQUFFLE1BQU0sQ0FBQzt5QkFDM0IsR0FBRyxFQUFHLEVBQUE7O2dCQU5MLEtBQUssR0FBRyxTQU1IO2dCQUdLLFdBQU0sRUFBRSxDQUFDLFVBQVUsQ0FBQyxnQkFBZ0IsQ0FBQzt5QkFDaEQsS0FBSyxDQUFDO3dCQUNILElBQUksRUFBRSxJQUFJO3FCQUNiLENBQUM7eUJBQ0QsR0FBRyxFQUFHLEVBQUE7O2dCQUpMLE9BQU8sR0FBRyxTQUlMO2dCQUVYLElBQUssS0FBSyxDQUFDLElBQUksQ0FBQyxNQUFNLEtBQUssQ0FBQyxJQUFJLE9BQU8sQ0FBQyxJQUFJLENBQUMsTUFBTSxLQUFLLENBQUMsRUFBRztvQkFDeEQsV0FBTyxFQUFFLE1BQU0sRUFBRSxHQUFHLEVBQUUsRUFBQztpQkFDMUI7Z0JBRUQsV0FBTSxPQUFPLENBQUMsR0FBRyxDQUNiLE9BQU8sQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFFLFVBQU0sTUFBTTs7Ozs7b0NBRWxCLE1BQU0sR0FBSyxNQUFNLE9BQVgsQ0FBWTtvQ0FHVixXQUFNLEVBQUUsQ0FBQyxVQUFVLENBQUMsY0FBYyxDQUFDOzZDQUMxQyxLQUFLLENBQUM7NENBQ0gsTUFBTSxRQUFBOzRDQUNOLEdBQUcsRUFBRSxLQUFLLENBQUMsSUFBSSxDQUFFLENBQUMsQ0FBRSxDQUFDLEdBQUc7NENBQ3hCLElBQUksRUFBRSx3QkFBd0I7eUNBQ2pDLENBQUM7NkNBQ0QsR0FBRyxFQUFHLEVBQUE7O29DQU5ULE9BQU8sR0FBRyxTQU1EO29DQUVULE1BQU0sR0FBRyxPQUFPLENBQUMsSUFBSSxDQUFFLENBQUMsQ0FBRSxDQUFDO29DQUc3QixLQUFLLEdBQVE7d0NBQ2IsVUFBVSxFQUFFLEdBQUc7d0NBQ2YsR0FBRyxFQUFFLEtBQUssQ0FBQyxJQUFJLENBQUUsQ0FBQyxDQUFFLENBQUMsR0FBRztxQ0FDM0IsQ0FBQztvQ0FFRixJQUFLLE1BQU0sRUFBRzt3Q0FDVixLQUFLLHlCQUNFLEtBQUssS0FDUixPQUFPLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBRSxNQUFNLENBQUMsS0FBSyxDQUFFLEdBQ2pDLENBQUM7cUNBQ0w7b0NBRWUsV0FBTSxFQUFFLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQzs2Q0FDdkMsS0FBSyxDQUFFLEtBQUssQ0FBRTs2Q0FDZCxHQUFHLEVBQUcsRUFBQTs7b0NBRkwsT0FBTyxHQUFHLFNBRUw7b0NBRUwsS0FBSyxHQUFHLEtBQUssQ0FBQyxJQUFJLENBQ3BCLElBQUksR0FBRyxDQUNILE9BQU8sQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFFLFVBQUEsQ0FBQyxJQUFJLE9BQUEsQ0FBQyxDQUFDLE1BQU0sRUFBUixDQUFRLENBQUUsQ0FDcEMsQ0FDSixDQUFDLE1BQU0sQ0FBQztvQ0FFVCxJQUFLLEtBQUssS0FBSyxDQUFDLEVBQUc7d0NBQ2YsV0FBTyxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUUsRUFBQztxQ0FDekI7b0NBR0QsV0FBTSw4QkFBYSxDQUFDOzRDQUNoQixNQUFNLFFBQUE7NENBQ04sSUFBSSxFQUFFLFVBQVU7NENBQ2hCLElBQUksRUFBRSwrQkFBK0I7NENBQ3JDLEtBQUssRUFBRSxDQUFJLEtBQUssbUNBQU8sRUFBRSwwQkFBTSxDQUFDO3lDQUNuQyxDQUFDLEVBQUE7O29DQUxGLFNBS0UsQ0FBQzt5Q0FHRSxDQUFDLENBQUMsTUFBTSxFQUFSLGNBQVE7b0NBR1QsV0FBTSxFQUFFLENBQUMsVUFBVSxDQUFDLGNBQWMsQ0FBQzs2Q0FDOUIsR0FBRyxDQUFFLE1BQU0sQ0FBRSxNQUFNLENBQUMsR0FBRyxDQUFFLENBQUM7NkNBQzFCLE1BQU0sQ0FBQzs0Q0FDSixJQUFJLEVBQUU7Z0RBQ0YsS0FBSyxFQUFFLE1BQU0sQ0FBRSxJQUFJLENBQUU7NkNBQ3hCO3lDQUNKLENBQUMsRUFBQTs7b0NBTk4sU0FNTSxDQUFDOzt3Q0FHUCxXQUFNLEVBQUUsQ0FBQyxVQUFVLENBQUMsY0FBYyxDQUFDO3lDQUM5QixHQUFHLENBQUM7d0NBQ0QsSUFBSSxFQUFFOzRDQUNGLE1BQU0sUUFBQTs0Q0FDTixHQUFHLEVBQUUsS0FBSyxDQUFDLElBQUksQ0FBRSxDQUFDLENBQUUsQ0FBQyxHQUFHOzRDQUN4QixJQUFJLEVBQUUsd0JBQXdCOzRDQUM5QixLQUFLLEVBQUUsTUFBTSxDQUFFLElBQUksQ0FBRTt5Q0FDeEI7cUNBQ0osQ0FBQyxFQUFBOztvQ0FSTixTQVFNLENBQUM7Ozs7O3lCQUVkLENBQUMsQ0FDTCxFQUFBOztnQkEzRUQsU0EyRUMsQ0FBQzs7OztLQUVMLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBjbG91ZCBmcm9tICd3eC1zZXJ2ZXItc2RrJztcbmltcG9ydCB7IHN1YnNjcmliZVB1c2ggfSBmcm9tICcuLi9zdWJzY3JpYmUtcHVzaCc7XG5cbmNsb3VkLmluaXQoe1xuICAgIGVudjogcHJvY2Vzcy5lbnYuY2xvdWRcbn0pO1xuXG5jb25zdCBkYjogREIuRGF0YWJhc2UgPSBjbG91ZC5kYXRhYmFzZSggKTtcbmNvbnN0IF8gPSBkYi5jb21tYW5kO1xuXG4vKiogXG4gKiDovazmjaLmoLzmnpflsLzmsrvml7bljLogKzjml7bljLpcbiAqIERhdGUoKS5ub3coKSAvIG5ldyBEYXRlKCkuZ2V0VGltZSgpIOaYr+aXtuS4jeaXtuato+W4uOeahCs4XG4gKiBEYXRlLnRvTG9jYWxTdHJpbmcoICkg5aW95YOP5piv5LiA55u05pivKzDnmoRcbiAqIOWFiOaLv+WIsCArMO+8jOeEtuWQjis4XG4gKi9cbmNvbnN0IGdldE5vdyA9ICggdHMgPSBmYWxzZSApOiBhbnkgPT4ge1xuICAgIGlmICggdHMgKSB7XG4gICAgICAgIHJldHVybiBEYXRlLm5vdyggKTtcbiAgICB9XG4gICAgY29uc3QgdGltZV8wID0gbmV3IERhdGUoIG5ldyBEYXRlKCApLnRvTG9jYWxlU3RyaW5nKCApKTtcbiAgICByZXR1cm4gbmV3IERhdGUoIHRpbWVfMC5nZXRUaW1lKCApICsgOCAqIDYwICogNjAgKiAxMDAwIClcbn1cblxuY29uc3QgY2hlY2tJc0luUmFuZ2UgPSAoIG5vdzogRGF0ZSwgcmFuZ2UgPSBbIDk5IF0pID0+IHtcbiAgICByZXR1cm4gcmFuZ2Uuc29tZSggeCA9PiB7XG4gICAgICAgIGNvbnN0IGggPSBub3cuZ2V0SG91cnMoICk7XG4gICAgICAgIHJldHVybiB4ID09PSBoICYmIG5vdy5nZXRNaW51dGVzKCApID09PSAwO1xuICAgIH0pO1xufVxuXG4vKipcbiAqIOiuouWNlTE6IOaJgOacieW6lOivpeaUr+S7mO+8jOS9huaYr+ayoeacieaUr+S7mO+8iOaUr+S7mOi2heaXtjMw5YiG6ZKf77yJ55qE6K6i5Y2V77yM6YeK5pS+5Y6f5p2l55qE5bqT5a2Y77yM6K6i5Y2V6YeN572u5Li65bey6L+H5pe2XG4gKi9cbmV4cG9ydCBjb25zdCBvdmVydGltZSA9IGFzeW5jICggKSA9PiB7XG4gICAgdHJ5IHtcblxuICAgICAgICBjb25zdCBvcmRlcnMkID0gYXdhaXQgZGIuY29sbGVjdGlvbignb3JkZXInKVxuICAgICAgICAgICAgLndoZXJlKHtcbiAgICAgICAgICAgICAgICBwYXlfc3RhdHVzOiAnMCcsXG4gICAgICAgICAgICAgICAgYmFzZV9zdGF0dXM6ICcwJyxcbiAgICAgICAgICAgICAgICBjcmVhdGVUaW1lOiBfLmx0ZSggZ2V0Tm93KCB0cnVlICkgLSAzMCAqIDYwICogMTAwMCApXG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLmdldCggKTtcblxuICAgICAgICBpZiAoIG9yZGVycyQuZGF0YS5sZW5ndGggPT09IDAgKSB7XG4gICAgICAgICAgICByZXR1cm4geyBzdGF0dXM6IDIwMCB9O1xuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICAvLyDorqLljZXmm7TmlrBcbiAgICAgICAgYXdhaXQgUHJvbWlzZS5hbGwoIG9yZGVycyQuZGF0YS5tYXAoIG9yZGVyID0+IHtcbiAgICAgICAgICAgIHJldHVybiBkYi5jb2xsZWN0aW9uKCdvcmRlcicpLmRvYyggU3RyaW5nKCBvcmRlci5faWQgKSlcbiAgICAgICAgICAgICAgICAudXBkYXRlKHtcbiAgICAgICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgICAgICAgYmFzZV9zdGF0dXM6ICc1J1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgfSkpO1xuXG4gICAgICAgIC8vIOW6k+WtmOmHiuaUviAoIOWmguaenOacieW6k+WtmOeahOivnSApXG4gICAgICAgIGF3YWl0IFByb21pc2UuYWxsKCBvcmRlcnMkLmRhdGEubWFwKCBhc3luYyBvcmRlciA9PiB7XG5cbiAgICAgICAgICAgIGNvbnN0IHRhcmdldElkID0gb3JkZXIuc2lkIHx8IG9yZGVyLnBpZDtcbiAgICAgICAgICAgIGNvbnN0IGNvbGxlY3Rpb24gPSBvcmRlci5zaWQgPyAnc3RhbmRhcmRzJyA6ICdnb29kcyc7XG5cbiAgICAgICAgICAgIGNvbnN0IHRhcmdldCA9IGF3YWl0IGRiLmNvbGxlY3Rpb24oIGNvbGxlY3Rpb24gKVxuICAgICAgICAgICAgICAgIC5kb2MoIHRhcmdldElkIClcbiAgICAgICAgICAgICAgICAuZ2V0KCApO1xuXG4gICAgICAgICAgICBpZiAoIHRhcmdldC5kYXRhLnN0b2NrID09PSB1bmRlZmluZWQgfHwgdGFyZ2V0LmRhdGEuc3RvY2sgPT09IG51bGwgKSB7IHJldHVybjsgfVxuXG4gICAgICAgICAgICBhd2FpdCBkYi5jb2xsZWN0aW9uKCBjb2xsZWN0aW9uICkuZG9jKCB0YXJnZXRJZCApXG4gICAgICAgICAgICAgICAgLnVwZGF0ZSh7XG4gICAgICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0b2NrOiBfLmluYyggb3JkZXIuY291bnQgKVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pKTtcbiAgICAgICAgXG4gICAgICAgIHJldHVybiB7IHN0YXR1czogMjAwIH1cbiAgICB9IGNhdGNoICggZSApIHtcbiAgICAgICAgY29uc29sZS5sb2coJyEhISHlrprml7blmajorqLljZVvdmVydGltZemUmeivrycsKVxuICAgICAgICByZXR1cm4geyBzdGF0dXM6IDUwMCB9XG4gICAgfVxufTtcblxuLyoqXG4gKiDorqLljZUy77ya5omA5pyJ5oiQ5Yqf5pSv5LuY55qE6K6i5Y2V77yM5qOA5p+l5pyJ5rKh5pyJIHR5cGXvvJpwcmXnmoTvvIzmnInnmoTor53pnIDopoHovazmiJB0eXBlOm5vcm1hbOexu+Wei+iuouWNle+8jOWIoOmZpOWvueW6lOeahOi0reeJqei9pu+8iOacieeahOivne+8iVxuICovXG5leHBvcnQgY29uc3QgcGF5ZWRGaXggPSBhc3luYyAoICkgPT4ge1xuICAgIHRyeSB7XG5cbiAgICAgICAgY29uc3Qgb3JkZXJzJCA9IGF3YWl0IGRiLmNvbGxlY3Rpb24oJ29yZGVyJylcbiAgICAgICAgICAgIC53aGVyZSh7XG4gICAgICAgICAgICAgICAgdHlwZTogJ3ByZScsXG4gICAgICAgICAgICAgICAgcGF5X3N0YXR1czogJzEnXG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLmdldCggKTtcblxuICAgICAgICBpZiAoIG9yZGVycyQuZGF0YS5sZW5ndGggPT09IDAgKSB7XG4gICAgICAgICAgICByZXR1cm4geyBzdGF0dXM6IDIwMCB9O1xuICAgICAgICB9XG5cbiAgICAgICAgLy8g6K6i5Y2V5pu05pawXG4gICAgICAgIGF3YWl0IFByb21pc2UuYWxsKCBvcmRlcnMkLmRhdGEubWFwKCBvcmRlciA9PiB7XG4gICAgICAgICAgICByZXR1cm4gZGIuY29sbGVjdGlvbignb3JkZXInKS5kb2MoIFN0cmluZyggb3JkZXIuX2lkICkpXG4gICAgICAgICAgICAgICAgLnVwZGF0ZSh7XG4gICAgICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6ICdub3JtYWwnXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICB9KSk7XG5cbiAgICAgICAgLy8g5Yig6Zmk5a+55bqU55qE6LSt54mp6L2mXG4gICAgICAgIGF3YWl0IFByb21pc2UuYWxsKFxuICAgICAgICAgICAgb3JkZXJzJC5kYXRhXG4gICAgICAgICAgICAgICAgLmZpbHRlciggeCA9PiAhIXguY2lkIClcbiAgICAgICAgICAgICAgICAubWFwKCBvcmRlciA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBkYi5jb2xsZWN0aW9uKCdjYXJ0JykuZG9jKCBvcmRlci5jaWQgKVxuICAgICAgICAgICAgICAgICAgICAgICAgLnJlbW92ZSggKVxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICk7XG5cbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHN0YXR1czogMjAwXG4gICAgICAgIH1cblxuXG4gICAgfSBjYXRjaCAoIGUgKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKCchISEh5a6a5pe25Zmo6K6i5Y2VcGF5ZWRGaXjplJnor68nLClcbiAgICAgICAgcmV0dXJuIHsgc3RhdHVzOiA1MDAgfVxuICAgIH1cbn1cblxuLyoqXG4gKiDorqLljZUz77ya5bey57uP6L+b6KGM6LSt54mp5riF5Y2V5Lu35qC86LCD5pW05ZCO77yM5paw5p2l55qE5ZWG5ZOB6K6i5Y2V5Lu35qC85aaC5p6c6Lef5riF5Y2V5Lu35qC85LiN5LiA6Ie077yM5bqU6K+l55So5a6a5pe25Zmo6L+b6KGM6LCD5pW0XG4gKiAh6L+Z57G76K6i5Y2V77yM5pqC5pe26L+Y5rKh5pyJ6IO96Ieq5Yqo5rOo5YWl5YiG6YWN5pWw6YePIGFsbG9jYXRlZENvdW50XG4gKi9cbmV4cG9ydCBjb25zdCBwcmljZUZpeCA9IGFzeW5jICggKSA9PiB7XG4gICAgdHJ5IHtcblxuICAgICAgICAvLyDojrflj5blvZPliY3ov5vooYzkuK3nmoTooYznqItcbiAgICAgICAgY29uc3QgdHJpcHMkID0gYXdhaXQgY2xvdWQuY2FsbEZ1bmN0aW9uKHtcbiAgICAgICAgICAgIG5hbWU6ICd0cmlwJyxcbiAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAkdXJsOiAnZW50ZXInXG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGNvbnN0IGN1cnJlbnRUcmlwID0gdHJpcHMkLnJlc3VsdC5kYXRhWyAwIF07XG5cbiAgICAgICAgaWYgKCAhY3VycmVudFRyaXAgKSB7IFxuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBzdGF0dXM6IDIwMFxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgdGlkID0gY3VycmVudFRyaXAuX2lkO1xuXG4gICAgICAgIC8vIOaJvuWIsOaJgOacieW3sue7j+iwg+aVtOWlveeahOa4heWNleWIl+ihqFxuICAgICAgICBjb25zdCBzaG9wcGluZ2xpc3RzJCA9IGF3YWl0IGRiLmNvbGxlY3Rpb24oJ3Nob3BwaW5nLWxpc3QnKVxuICAgICAgICAgICAgLndoZXJlKHtcbiAgICAgICAgICAgICAgICB0aWQsXG4gICAgICAgICAgICAgICAgYmFzZV9zdGF0dXM6ICcxJ1xuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC5nZXQoICk7XG4gICAgICAgIFxuICAgICAgICBhd2FpdCBQcm9taXNlLmFsbCggc2hvcHBpbmdsaXN0cyQuZGF0YS5tYXAoIGFzeW5jIHNob3BwaW5nTGlzdCA9PiB7XG5cbiAgICAgICAgICAgIGNvbnN0IHsgcGlkLCBzaWQsIGFkanVzdFByaWNlLCBhZGp1c3RHcm91cFByaWNlIH0gPSBzaG9wcGluZ0xpc3Q7XG5cbiAgICAgICAgICAgIC8vIOaJvuWIsGJhc2Vfc3RhdHVzOiAwIOeahOWQjOWVhuWTgeiuouWNlVxuICAgICAgICAgICAgY29uc3Qgb3JkZXJzJCA9IGF3YWl0IGRiLmNvbGxlY3Rpb24oJ29yZGVyJylcbiAgICAgICAgICAgICAgICAud2hlcmUoe1xuICAgICAgICAgICAgICAgICAgICB0aWQsXG4gICAgICAgICAgICAgICAgICAgIHBpZCxcbiAgICAgICAgICAgICAgICAgICAgc2lkLFxuICAgICAgICAgICAgICAgICAgICBiYXNlX3N0YXR1czogJzAnXG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAuZ2V0KCApO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICAvLyDorqLljZXmm7TmlrBcbiAgICAgICAgICAgIGF3YWl0IFByb21pc2UuYWxsKCBvcmRlcnMkLmRhdGEubWFwKCBvcmRlciA9PiB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGRiLmNvbGxlY3Rpb24oJ29yZGVyJylcbiAgICAgICAgICAgICAgICAgICAgLmRvYyggU3RyaW5nKCBvcmRlci5faWQgKSlcbiAgICAgICAgICAgICAgICAgICAgLnVwZGF0ZSh7XG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYWxsb2NhdGVkUHJpY2U6IGFkanVzdFByaWNlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFsbG9jYXRlZEdyb3VwUHJpY2U6IGFkanVzdEdyb3VwUHJpY2UsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYmFzZV9zdGF0dXM6ICcxJ1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgfSkpO1xuXG4gICAgICAgIH0pKTtcblxuICAgICAgICByZXR1cm4geyBzdGF0dXM6IDIwMCB9XG5cbiAgICB9IGNhdGNoICggZSApIHtcbiAgICAgICAgY29uc29sZS5sb2coJyEhISHlrprml7blmajorqLljZVwcmljZUZpeOmUmeivrycsIGUgKTtcbiAgICAgICAgcmV0dXJuIHsgc3RhdHVzOiA1MDAgfVxuICAgIH1cbn1cblxuLyoqXG4gKiDorqLljZU077ya5omA5pyJ5oiQ5Yqf5pSv5LuY5bC+5qy+55qE6K6i5Y2V77yM5oqKYmFzZV9zdGF0dXPorr7kuLozXG4gKi9cbmV4cG9ydCBjb25zdCBwYXlMYXN0Rml4ID0gYXN5bmMgKCApID0+IHtcbiAgICB0cnkge1xuICAgICAgICBcbiAgICAgICAgY29uc3Qgb3JkZXJzJCA9IGF3YWl0IGRiLmNvbGxlY3Rpb24oJ29yZGVyJylcbiAgICAgICAgICAgIC53aGVyZSh7XG4gICAgICAgICAgICAgICAgcGF5X3N0YXR1czogJzInLFxuICAgICAgICAgICAgICAgIGJhc2Vfc3RhdHVzOiBfLm9yKCBfLmVxKCcwJyksIF8uZXEoJzEnKSwgIF8uZXEoJzInKSlcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAuZ2V0KCApO1xuXG4gICAgICAgIGlmICggb3JkZXJzJC5kYXRhLmxlbmd0aCA9PT0gMCApIHtcbiAgICAgICAgICAgIHJldHVybiB7IHN0YXR1czogMjAwIH07XG4gICAgICAgIH1cblxuICAgICAgICBhd2FpdCBQcm9taXNlLmFsbChcbiAgICAgICAgICAgIG9yZGVycyQuZGF0YS5tYXAoIG9yZGVyID0+IHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZGIuY29sbGVjdGlvbignb3JkZXInKVxuICAgICAgICAgICAgICAgICAgICAuZG9jKCBTdHJpbmcoIG9yZGVyLl9pZCApKVxuICAgICAgICAgICAgICAgICAgICAudXBkYXRlKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBiYXNlX3N0YXR1czogJzMnXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICB9KVxuICAgICAgICApXG4gICAgICAgIFxuICAgIH0gY2F0Y2ggKCBlICkge1xuICAgICAgICBjb25zb2xlLmxvZygnISEhIeWumuaXtuWZqOiuouWNlXBheUxhc3RGaXjplJnor68nLClcbiAgICAgICAgcmV0dXJuIHsgc3RhdHVzOiA1MDAgfVxuICAgIH1cbn1cblxuLyoqXG4gKiDorqLljZU077ya5paw6K6i5Y2V5o6o6YCBXG4gKiDml7bpl7TvvJoxMiwgMTgsIDBcbiAqL1xuZXhwb3J0IGNvbnN0IHB1c2hOZXcgPSBhc3luYyAoICkgPT4ge1xuICAgIHRyeSB7XG4gICAgICAgIFxuICAgICAgICBjb25zdCBub3dEYXRlID0gZ2V0Tm93KCApO1xuICAgICAgICBcbiAgICAgICAgLy8gMOOAgeWIpOaWreaYr+WQpuWcqOmCo+WHoOS4quaXtumXtOaIs+S5i+WGhVxuICAgICAgICBpZiAoICFjaGVja0lzSW5SYW5nZSggbm93RGF0ZSwgWyAxMiwgMTgsIDAgXSkpIHsgXG4gICAgICAgICAgICByZXR1cm4geyBzdGF0dXM6IDIwMCB9O1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gMeOAgeiOt+WPlmN1cnJlbnQgdHJpcFxuICAgICAgICBjb25zdCB0cmlwcyQgPSBhd2FpdCBjbG91ZC5jYWxsRnVuY3Rpb24oe1xuICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICR1cmw6ICdlbnRlcidcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBuYW1lOiAndHJpcCdcbiAgICAgICAgfSk7XG4gICAgICAgIGNvbnN0IHRyaXBzID0gdHJpcHMkLnJlc3VsdC5kYXRhO1xuICAgICAgICBjb25zdCB0cmlwID0gdHJpcHNbIDAgXTtcblxuICAgICAgICAvLyAy44CB6I635Y+WIHB1c2g6IHRydWUg55qE566h55CG5ZGYXG4gICAgICAgIGNvbnN0IG1lbWJlcnMgPSBhd2FpdCBkYi5jb2xsZWN0aW9uKCdtYW5hZ2VyLW1lbWJlcicpXG4gICAgICAgICAgICAud2hlcmUoe1xuICAgICAgICAgICAgICAgIHB1c2g6IHRydWVcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAuZ2V0KCApO1xuXG4gICAgICAgIGlmICggIXRyaXAgfHwgbWVtYmVycy5kYXRhLmxlbmd0aCA9PT0gMCApIHtcbiAgICAgICAgICAgIHJldHVybiB7IHN0YXR1czogMjAwIH07XG4gICAgICAgIH1cblxuICAgICAgICBhd2FpdCBQcm9taXNlLmFsbChcbiAgICAgICAgICAgIG1lbWJlcnMuZGF0YS5tYXAoIGFzeW5jIG1lbWJlciA9PiB7XG4gICAgICAgICAgICAgICAgbGV0IGNvdW50ID0gMDtcbiAgICAgICAgICAgICAgICBjb25zdCB7IG9wZW5pZCB9ID0gbWVtYmVyXG5cbiAgICAgICAgICAgICAgICAvLyAz44CB6I635Y+W5LiK5qyh5rWP6KeI6K6i5Y2V55qE5pe26Ze05oizXG4gICAgICAgICAgICAgICAgY29uc3QgY29uZmlnJCA9IGF3YWl0IGRiLmNvbGxlY3Rpb24oJ2FuYWx5c2UtZGF0YScpXG4gICAgICAgICAgICAgICAgICAgIC53aGVyZSh7XG4gICAgICAgICAgICAgICAgICAgICAgICBvcGVuaWQsXG4gICAgICAgICAgICAgICAgICAgICAgICB0aWQ6IHRyaXAuX2lkLFxuICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogJ21hbmFnZXItdHJpcC1vcmRlci12aXNpdCdcbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgLmdldCggKTtcbiAgICAgICAgICAgICAgICBjb25zdCB0cmlwT3JkZXJWaXNpdENvbmZpZyA9IGNvbmZpZyQuZGF0YVsgMCBdO1xuXG4gICAgICAgICAgICAgICAgbGV0IHF1ZXJ5OiBhbnkgPSB7XG4gICAgICAgICAgICAgICAgICAgIHRpZDogdHJpcC5faWQsXG4gICAgICAgICAgICAgICAgICAgIHBheV9zdGF0dXM6IF8ubmVxKCcwJyksXG4gICAgICAgICAgICAgICAgICAgIGJhc2Vfc3RhdHVzOiBfLm9yKCBfLmVxKCcwJyksIF8uZXEoJzEnKSwgXy5lcSgnMicpKVxuICAgICAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgICAgICBpZiAoICEhdHJpcE9yZGVyVmlzaXRDb25maWcgKSB7XG4gICAgICAgICAgICAgICAgICAgIHF1ZXJ5ID0gT2JqZWN0LmFzc2lnbih7IH0sIHF1ZXJ5LCB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjcmVhdGVUaW1lOiBfLmd0ZSggdHJpcE9yZGVyVmlzaXRDb25maWcudmFsdWUgKVxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAvLyA044CB6LCD55So5o6o6YCBXG4gICAgICAgICAgICAgICAgY29uc3QgY291bnQkID0gYXdhaXQgZGIuY29sbGVjdGlvbignb3JkZXInKVxuICAgICAgICAgICAgICAgICAgICAgICAgLndoZXJlKCBxdWVyeSApXG4gICAgICAgICAgICAgICAgICAgICAgICAuY291bnQoICk7XG4gICAgICAgICAgICAgICAgY291bnQgPSBjb3VudCQudG90YWw7XG5cblxuICAgICAgICAgICAgICAgIGlmICggY291bnQgPT09IDAgKSB7IFxuICAgICAgICAgICAgICAgICAgICByZXR1cm4geyBzdGF1czogMjAwIH07XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgLy8gNOOAgeiwg+eUqOaOqOmAgVxuICAgICAgICAgICAgICAgIGF3YWl0IHN1YnNjcmliZVB1c2goe1xuICAgICAgICAgICAgICAgICAgICBvcGVuaWQsXG4gICAgICAgICAgICAgICAgICAgIHR5cGU6ICduZXdPcmRlcicsXG4gICAgICAgICAgICAgICAgICAgIHBhZ2U6IGBwYWdlcy9tYW5hZ2VyLXRyaXAtb3JkZXItYWxsL2luZGV4P3RpZD0ke3RyaXAuX2lkfWAsXG4gICAgICAgICAgICAgICAgICAgIHRleHRzOiBbYOS9oOaciSR7Y291bnR95p2h5paw6K6i5Y2VYCwgYOeCueWHu+afpeeci2BdXG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICAvLyA144CB5pu05paw44CB5Yib5bu66YWN572uXG4gICAgICAgICAgICAgICAgaWYgKCAhIXRyaXBPcmRlclZpc2l0Q29uZmlnICkge1xuXG4gICAgICAgICAgICAgICAgICAgIC8vIOabtOaWsOS4gOS4i+atpOadoemFjee9rlxuICAgICAgICAgICAgICAgICAgICBhd2FpdCBkYi5jb2xsZWN0aW9uKCdhbmFseXNlLWRhdGEnKVxuICAgICAgICAgICAgICAgICAgICAgICAgLmRvYyggU3RyaW5nKCB0cmlwT3JkZXJWaXNpdENvbmZpZy5faWQgKSlcbiAgICAgICAgICAgICAgICAgICAgICAgIC51cGRhdGUoe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU6IGdldE5vdyggdHJ1ZSApXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgLy8g5Yib5bu65LiA5LiL6YWN572uXG4gICAgICAgICAgICAgICAgICAgIGF3YWl0IGRiLmNvbGxlY3Rpb24oJ2FuYWx5c2UtZGF0YScpXG4gICAgICAgICAgICAgICAgICAgICAgICAuYWRkKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9wZW5pZCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGlkOiB0cmlwLl9pZCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogJ21hbmFnZXItdHJpcC1vcmRlci12aXNpdCcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlOiBnZXROb3coIHRydWUgKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHJldHVybjtcblxuICAgICAgICAgICAgfSlcbiAgICAgICAgKTtcbiAgICAgICAgXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBzdGF0dXM6IDIwMFxuICAgICAgICB9O1xuXG4gICAgfSBjYXRjaCAoIGUgKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBzdGF0dXM6IDUwMCxcbiAgICAgICAgICAgIG1lc3NhZ2U6IHR5cGVvZiBlID09PSAnc3RyaW5nJyA/IGUgOiBKU09OLnN0cmluZ2lmeSggZSApXG4gICAgICAgIH1cbiAgICB9XG59XG5cbi8qKiBcbiAqIOiuouWNlTU6IOWwvuasvuaOqOmAgVxuICogMjLngrnmiY3lpITnkIZcbiAqL1xuZXhwb3J0IGNvbnN0IHB1c2hMYXN0UGF5ID0gYXN5bmMgKCApID0+IHtcblxuICAgIC8vIDDjgIHmmK/lkKbkuLow54K5XG4gICAgaWYgKCBjaGVja0lzSW5SYW5nZSggZ2V0Tm93KCApLCBbIDIyIF0pKSB7XG4gICAgICAgIHJldHVybiB7IHN0YXR1czogMjAwIH1cbiAgICB9XG5cbiAgICAvLyAx44CB6I635Y+W5LiK5LiA6LafdHJpcFxuICAgIC8vIOaMiee7k+adn+aXpeacn+WAkuWPmeW6j++8jOiOt+WPluacgOWkmjHmnaEg5bey57uT5p2f55qE6KGM56iLXG4gICAgY29uc3QgdHJpcCQgPSBhd2FpdCBkYi5jb2xsZWN0aW9uKCd0cmlwJylcbiAgICAgICAgLndoZXJlKHtcbiAgICAgICAgICAgIGlzQ2xvc2VkOiB0cnVlXG4gICAgICAgIH0pXG4gICAgICAgIC5saW1pdCggMSApXG4gICAgICAgIC5vcmRlckJ5KCdlbmRfZGF0ZScsICdkZXNjJylcbiAgICAgICAgLmdldCggKTtcblxuICAgIC8vIDLjgIHojrflj5YgcHVzaDogdHJ1ZSDnmoTnrqHnkIblkZhcbiAgICBjb25zdCBtZW1iZXJzID0gYXdhaXQgZGIuY29sbGVjdGlvbignbWFuYWdlci1tZW1iZXInKVxuICAgICAgICAud2hlcmUoe1xuICAgICAgICAgICAgcHVzaDogdHJ1ZVxuICAgICAgICB9KVxuICAgICAgICAuZ2V0KCApO1xuICAgIFxuICAgIGlmICggdHJpcCQuZGF0YS5sZW5ndGggPT09IDAgfHwgbWVtYmVycy5kYXRhLmxlbmd0aCA9PT0gMCApIHtcbiAgICAgICAgcmV0dXJuIHsgc3RhdHVzOiAyMDAgfTtcbiAgICB9XG5cbiAgICBhd2FpdCBQcm9taXNlLmFsbChcbiAgICAgICAgbWVtYmVycy5kYXRhLm1hcCggYXN5bmMgbWVtYmVyID0+IHtcblxuICAgICAgICAgICAgY29uc3QgeyBvcGVuaWQgfSA9IG1lbWJlcjtcblxuICAgICAgICAgICAgLy8gM+OAgeiOt+WPluS4iuasoea1j+iniOWwvuasvueahOaXtumXtOaIs1xuICAgICAgICAgICAgY29uc3QgY29uZmlnJCA9IGF3YWl0IGRiLmNvbGxlY3Rpb24oJ2FuYWx5c2UtZGF0YScpXG4gICAgICAgICAgICAgICAgICAgIC53aGVyZSh7XG4gICAgICAgICAgICAgICAgICAgICAgICBvcGVuaWQsXG4gICAgICAgICAgICAgICAgICAgICAgICB0aWQ6IHRyaXAkLmRhdGFbIDAgXS5faWQsXG4gICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiAnbWFuYWdlci1wYXktbGFzdC12aXNpdCdcbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgLmdldCggKTtcblxuICAgICAgICAgICAgY29uc3QgY29uZmlnID0gY29uZmlnJC5kYXRhWyAwIF07XG5cbiAgICAgICAgICAgIC8vIDPjgIHmn6Xor6JcbiAgICAgICAgICAgIGxldCBxdWVyeTogYW55ID0ge1xuICAgICAgICAgICAgICAgIHBheV9zdGF0dXM6ICcyJyxcbiAgICAgICAgICAgICAgICB0aWQ6IHRyaXAkLmRhdGFbIDAgXS5faWQsXG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICBpZiAoIGNvbmZpZyApIHtcbiAgICAgICAgICAgICAgICBxdWVyeSA9IHtcbiAgICAgICAgICAgICAgICAgICAgLi4ucXVlcnksXG4gICAgICAgICAgICAgICAgICAgIHBheXRpbWU6IF8uZ3RlKCBjb25maWcudmFsdWUgKVxuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGNvbnN0IG9yZGVycyQgPSBhd2FpdCBkYi5jb2xsZWN0aW9uKCdvcmRlcicpXG4gICAgICAgICAgICAgICAgLndoZXJlKCBxdWVyeSApXG4gICAgICAgICAgICAgICAgLmdldCggKTtcblxuICAgICAgICAgICAgY29uc3QgY291bnQgPSBBcnJheS5mcm9tKFxuICAgICAgICAgICAgICAgIG5ldyBTZXQoXG4gICAgICAgICAgICAgICAgICAgIG9yZGVycyQuZGF0YS5tYXAoIHggPT4geC5vcGVuaWQgKVxuICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICkubGVuZ3RoO1xuXG4gICAgICAgICAgICBpZiAoIGNvdW50ID09PSAwICkge1xuICAgICAgICAgICAgICAgIHJldHVybiB7IHN0YXVzOiAyMDAgfTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gNOOAgeiwg+eUqOaOqOmAgVxuICAgICAgICAgICAgYXdhaXQgc3Vic2NyaWJlUHVzaCh7XG4gICAgICAgICAgICAgICAgb3BlbmlkLFxuICAgICAgICAgICAgICAgIHR5cGU6ICdnZXRNb25leScsXG4gICAgICAgICAgICAgICAgcGFnZTogJ3BhZ2VzL21hbmFnZXItdHJpcC1saXN0L2luZGV4JyxcbiAgICAgICAgICAgICAgICB0ZXh0czogW2Ake2NvdW50feS6uuS7mOS6huWwvuasvmAsIGDngrnlh7vmn6XnnItgXVxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIC8vIDXjgIHmm7TmlrDjgIHliJvlu7rphY3nva5cbiAgICAgICAgICAgIGlmICggISFjb25maWcgKSB7XG5cbiAgICAgICAgICAgICAgICAvLyDmm7TmlrDkuIDkuIvmraTmnaHphY3nva5cbiAgICAgICAgICAgICAgICBhd2FpdCBkYi5jb2xsZWN0aW9uKCdhbmFseXNlLWRhdGEnKVxuICAgICAgICAgICAgICAgICAgICAuZG9jKCBTdHJpbmcoIGNvbmZpZy5faWQgKSlcbiAgICAgICAgICAgICAgICAgICAgLnVwZGF0ZSh7XG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU6IGdldE5vdyggdHJ1ZSApXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAvLyDliJvlu7rkuIDkuIvphY3nva5cbiAgICAgICAgICAgICAgICBhd2FpdCBkYi5jb2xsZWN0aW9uKCdhbmFseXNlLWRhdGEnKVxuICAgICAgICAgICAgICAgICAgICAuYWRkKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvcGVuaWQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGlkOiB0cmlwJC5kYXRhWyAwIF0uX2lkLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6ICdtYW5hZ2VyLXBheS1sYXN0LXZpc2l0JyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZTogZ2V0Tm93KCB0cnVlIClcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgKTtcblxufSJdfQ==