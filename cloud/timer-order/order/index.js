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
var checkIsInRange = function (now, range) {
    if (range === void 0) { range = [99]; }
    return range.some(function (x) {
        var h = now.getHours();
        return x === h && now.getMinutes() === 0;
    });
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
exports.pushNew = function () { return __awaiter(_this, void 0, void 0, function () {
    var nowDate, trips$, trips, trip_1, members, e_5;
    var _this = this;
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
                                                    page: "pages/manager-trip-order-all/index?tid=" + trip_1._id,
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
    var trip$, members;
    var _this = this;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLGlCQTBlQzs7QUExZUQscUNBQXVDO0FBRXZDLEtBQUssQ0FBQyxJQUFJLENBQUM7SUFDUCxHQUFHLEVBQUUsT0FBTyxDQUFDLEdBQUcsQ0FBQyxLQUFLO0NBQ3pCLENBQUMsQ0FBQztBQUVILElBQU0sRUFBRSxHQUFnQixLQUFLLENBQUMsUUFBUSxFQUFHLENBQUM7QUFDMUMsSUFBTSxDQUFDLEdBQUcsRUFBRSxDQUFDLE9BQU8sQ0FBQztBQVFyQixJQUFNLE1BQU0sR0FBRyxVQUFFLEVBQVU7SUFBVixtQkFBQSxFQUFBLFVBQVU7SUFDdkIsSUFBSyxFQUFFLEVBQUc7UUFDTixPQUFPLElBQUksQ0FBQyxHQUFHLEVBQUcsQ0FBQztLQUN0QjtJQUNELElBQU0sTUFBTSxHQUFHLElBQUksSUFBSSxDQUFFLElBQUksSUFBSSxFQUFHLENBQUMsY0FBYyxFQUFHLENBQUMsQ0FBQztJQUN4RCxPQUFPLElBQUksSUFBSSxDQUFFLE1BQU0sQ0FBQyxPQUFPLEVBQUcsR0FBRyxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxJQUFJLENBQUUsQ0FBQTtBQUM3RCxDQUFDLENBQUE7QUFFRCxJQUFNLGNBQWMsR0FBRyxVQUFFLEdBQVMsRUFBRSxLQUFjO0lBQWQsc0JBQUEsRUFBQSxTQUFVLEVBQUUsQ0FBRTtJQUM5QyxPQUFPLEtBQUssQ0FBQyxJQUFJLENBQUUsVUFBQSxDQUFDO1FBQ2hCLElBQU0sQ0FBQyxHQUFHLEdBQUcsQ0FBQyxRQUFRLEVBQUcsQ0FBQztRQUMxQixPQUFPLENBQUMsS0FBSyxDQUFDLElBQUksR0FBRyxDQUFDLFVBQVUsRUFBRyxLQUFLLENBQUMsQ0FBQztJQUM5QyxDQUFDLENBQUMsQ0FBQztBQUNQLENBQUMsQ0FBQTtBQUtZ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QyxDQUFDOzs7O0tBRUwsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIGNsb3VkIGZyb20gJ3d4LXNlcnZlci1zZGsnO1xuXG5jbG91ZC5pbml0KHtcbiAgICBlbnY6IHByb2Nlc3MuZW52LmNsb3VkXG59KTtcblxuY29uc3QgZGI6IERCLkRhdGFiYXNlID0gY2xvdWQuZGF0YWJhc2UoICk7XG5jb25zdCBfID0gZGIuY29tbWFuZDtcblxuLyoqIFxuICog6L2s5o2i5qC85p6X5bC85rK75pe25Yy6ICs45pe25Yy6XG4gKiBEYXRlKCkubm93KCkgLyBuZXcgRGF0ZSgpLmdldFRpbWUoKSDmmK/ml7bkuI3ml7bmraPluLjnmoQrOFxuICogRGF0ZS50b0xvY2FsU3RyaW5nKCApIOWlveWDj+aYr+S4gOebtOaYrysw55qEXG4gKiDlhYjmi7/liLAgKzDvvIznhLblkI4rOFxuICovXG5jb25zdCBnZXROb3cgPSAoIHRzID0gZmFsc2UgKTogYW55ID0+IHtcbiAgICBpZiAoIHRzICkge1xuICAgICAgICByZXR1cm4gRGF0ZS5ub3coICk7XG4gICAgfVxuICAgIGNvbnN0IHRpbWVfMCA9IG5ldyBEYXRlKCBuZXcgRGF0ZSggKS50b0xvY2FsZVN0cmluZyggKSk7XG4gICAgcmV0dXJuIG5ldyBEYXRlKCB0aW1lXzAuZ2V0VGltZSggKSArIDggKiA2MCAqIDYwICogMTAwMCApXG59XG5cbmNvbnN0IGNoZWNrSXNJblJhbmdlID0gKCBub3c6IERhdGUsIHJhbmdlID0gWyA5OSBdKSA9PiB7XG4gICAgcmV0dXJuIHJhbmdlLnNvbWUoIHggPT4ge1xuICAgICAgICBjb25zdCBoID0gbm93LmdldEhvdXJzKCApO1xuICAgICAgICByZXR1cm4geCA9PT0gaCAmJiBub3cuZ2V0TWludXRlcyggKSA9PT0gMDtcbiAgICB9KTtcbn1cblxuLyoqXG4gKiDorqLljZUxOiDmiYDmnInlupTor6XmlK/ku5jvvIzkvYbmmK/msqHmnInmlK/ku5jvvIjmlK/ku5jotoXml7YzMOWIhumSn++8ieeahOiuouWNle+8jOmHiuaUvuWOn+adpeeahOW6k+WtmO+8jOiuouWNlemHjee9ruS4uuW3sui/h+aXtlxuICovXG5leHBvcnQgY29uc3Qgb3ZlcnRpbWUgPSBhc3luYyAoICkgPT4ge1xuICAgIHRyeSB7XG5cbiAgICAgICAgY29uc3Qgb3JkZXJzJCA9IGF3YWl0IGRiLmNvbGxlY3Rpb24oJ29yZGVyJylcbiAgICAgICAgICAgIC53aGVyZSh7XG4gICAgICAgICAgICAgICAgcGF5X3N0YXR1czogJzAnLFxuICAgICAgICAgICAgICAgIGJhc2Vfc3RhdHVzOiAnMCcsXG4gICAgICAgICAgICAgICAgY3JlYXRlVGltZTogXy5sdGUoIGdldE5vdyggdHJ1ZSApIC0gMzAgKiA2MCAqIDEwMDAgKVxuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC5nZXQoICk7XG5cbiAgICAgICAgaWYgKCBvcmRlcnMkLmRhdGEubGVuZ3RoID09PSAwICkge1xuICAgICAgICAgICAgcmV0dXJuIHsgc3RhdHVzOiAyMDAgfTtcbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgLy8g6K6i5Y2V5pu05pawXG4gICAgICAgIGF3YWl0IFByb21pc2UuYWxsKCBvcmRlcnMkLmRhdGEubWFwKCBvcmRlciA9PiB7XG4gICAgICAgICAgICByZXR1cm4gZGIuY29sbGVjdGlvbignb3JkZXInKS5kb2MoIFN0cmluZyggb3JkZXIuX2lkICkpXG4gICAgICAgICAgICAgICAgLnVwZGF0ZSh7XG4gICAgICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJhc2Vfc3RhdHVzOiAnNSdcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgIH0pKTtcblxuICAgICAgICAvLyDlupPlrZjph4rmlL4gKCDlpoLmnpzmnInlupPlrZjnmoTor50gKVxuICAgICAgICBhd2FpdCBQcm9taXNlLmFsbCggb3JkZXJzJC5kYXRhLm1hcCggYXN5bmMgb3JkZXIgPT4ge1xuXG4gICAgICAgICAgICBjb25zdCB0YXJnZXRJZCA9IG9yZGVyLnNpZCB8fCBvcmRlci5waWQ7XG4gICAgICAgICAgICBjb25zdCBjb2xsZWN0aW9uID0gb3JkZXIuc2lkID8gJ3N0YW5kYXJkcycgOiAnZ29vZHMnO1xuXG4gICAgICAgICAgICBjb25zdCB0YXJnZXQgPSBhd2FpdCBkYi5jb2xsZWN0aW9uKCBjb2xsZWN0aW9uIClcbiAgICAgICAgICAgICAgICAuZG9jKCB0YXJnZXRJZCApXG4gICAgICAgICAgICAgICAgLmdldCggKTtcblxuICAgICAgICAgICAgaWYgKCB0YXJnZXQuZGF0YS5zdG9jayA9PT0gdW5kZWZpbmVkIHx8IHRhcmdldC5kYXRhLnN0b2NrID09PSBudWxsICkgeyByZXR1cm47IH1cblxuICAgICAgICAgICAgYXdhaXQgZGIuY29sbGVjdGlvbiggY29sbGVjdGlvbiApLmRvYyggdGFyZ2V0SWQgKVxuICAgICAgICAgICAgICAgIC51cGRhdGUoe1xuICAgICAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzdG9jazogXy5pbmMoIG9yZGVyLmNvdW50IClcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICB9KSk7XG4gICAgICAgIFxuICAgICAgICByZXR1cm4geyBzdGF0dXM6IDIwMCB9XG4gICAgfSBjYXRjaCAoIGUgKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKCchISEh5a6a5pe25Zmo6K6i5Y2Vb3ZlcnRpbWXplJnor68nLClcbiAgICAgICAgcmV0dXJuIHsgc3RhdHVzOiA1MDAgfVxuICAgIH1cbn07XG5cbi8qKlxuICog6K6i5Y2VMu+8muaJgOacieaIkOWKn+aUr+S7mOeahOiuouWNle+8jOajgOafpeacieayoeaciSB0eXBl77yacHJl55qE77yM5pyJ55qE6K+d6ZyA6KaB6L2s5oiQdHlwZTpub3JtYWznsbvlnovorqLljZXvvIzliKDpmaTlr7nlupTnmoTotK3nianovabvvIjmnInnmoTor53vvIlcbiAqL1xuZXhwb3J0IGNvbnN0IHBheWVkRml4ID0gYXN5bmMgKCApID0+IHtcbiAgICB0cnkge1xuXG4gICAgICAgIGNvbnN0IG9yZGVycyQgPSBhd2FpdCBkYi5jb2xsZWN0aW9uKCdvcmRlcicpXG4gICAgICAgICAgICAud2hlcmUoe1xuICAgICAgICAgICAgICAgIHR5cGU6ICdwcmUnLFxuICAgICAgICAgICAgICAgIHBheV9zdGF0dXM6ICcxJ1xuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC5nZXQoICk7XG5cbiAgICAgICAgaWYgKCBvcmRlcnMkLmRhdGEubGVuZ3RoID09PSAwICkge1xuICAgICAgICAgICAgcmV0dXJuIHsgc3RhdHVzOiAyMDAgfTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIOiuouWNleabtOaWsFxuICAgICAgICBhd2FpdCBQcm9taXNlLmFsbCggb3JkZXJzJC5kYXRhLm1hcCggb3JkZXIgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIGRiLmNvbGxlY3Rpb24oJ29yZGVyJykuZG9jKCBTdHJpbmcoIG9yZGVyLl9pZCApKVxuICAgICAgICAgICAgICAgIC51cGRhdGUoe1xuICAgICAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiAnbm9ybWFsJ1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgfSkpO1xuXG4gICAgICAgIC8vIOWIoOmZpOWvueW6lOeahOi0reeJqei9plxuICAgICAgICBhd2FpdCBQcm9taXNlLmFsbChcbiAgICAgICAgICAgIG9yZGVycyQuZGF0YVxuICAgICAgICAgICAgICAgIC5maWx0ZXIoIHggPT4gISF4LmNpZCApXG4gICAgICAgICAgICAgICAgLm1hcCggb3JkZXIgPT4ge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZGIuY29sbGVjdGlvbignY2FydCcpLmRvYyggb3JkZXIuY2lkIClcbiAgICAgICAgICAgICAgICAgICAgICAgIC5yZW1vdmUoIClcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICApO1xuXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBzdGF0dXM6IDIwMFxuICAgICAgICB9XG5cblxuICAgIH0gY2F0Y2ggKCBlICkge1xuICAgICAgICBjb25zb2xlLmxvZygnISEhIeWumuaXtuWZqOiuouWNlXBheWVkRml46ZSZ6K+vJywpXG4gICAgICAgIHJldHVybiB7IHN0YXR1czogNTAwIH1cbiAgICB9XG59XG5cbi8qKlxuICog6K6i5Y2VM++8muW3sue7j+i/m+ihjOi0reeJqea4heWNleS7t+agvOiwg+aVtOWQju+8jOaWsOadpeeahOWVhuWTgeiuouWNleS7t+agvOWmguaenOi3n+a4heWNleS7t+agvOS4jeS4gOiHtO+8jOW6lOivpeeUqOWumuaXtuWZqOi/m+ihjOiwg+aVtFxuICogIei/meexu+iuouWNle+8jOaaguaXtui/mOayoeacieiDveiHquWKqOazqOWFpeWIhumFjeaVsOmHjyBhbGxvY2F0ZWRDb3VudFxuICovXG5leHBvcnQgY29uc3QgcHJpY2VGaXggPSBhc3luYyAoICkgPT4ge1xuICAgIHRyeSB7XG5cbiAgICAgICAgLy8g6I635Y+W5b2T5YmN6L+b6KGM5Lit55qE6KGM56iLXG4gICAgICAgIGNvbnN0IHRyaXBzJCA9IGF3YWl0IGNsb3VkLmNhbGxGdW5jdGlvbih7XG4gICAgICAgICAgICBuYW1lOiAndHJpcCcsXG4gICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgJHVybDogJ2VudGVyJ1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICBjb25zdCBjdXJyZW50VHJpcCA9IHRyaXBzJC5yZXN1bHQuZGF0YVsgMCBdO1xuXG4gICAgICAgIGlmICggIWN1cnJlbnRUcmlwICkgeyBcbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgc3RhdHVzOiAyMDBcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IHRpZCA9IGN1cnJlbnRUcmlwLl9pZDtcblxuICAgICAgICAvLyDmib7liLDmiYDmnInlt7Lnu4/osIPmlbTlpb3nmoTmuIXljZXliJfooahcbiAgICAgICAgY29uc3Qgc2hvcHBpbmdsaXN0cyQgPSBhd2FpdCBkYi5jb2xsZWN0aW9uKCdzaG9wcGluZy1saXN0JylcbiAgICAgICAgICAgIC53aGVyZSh7XG4gICAgICAgICAgICAgICAgdGlkLFxuICAgICAgICAgICAgICAgIGJhc2Vfc3RhdHVzOiAnMSdcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAuZ2V0KCApO1xuICAgICAgICBcbiAgICAgICAgYXdhaXQgUHJvbWlzZS5hbGwoIHNob3BwaW5nbGlzdHMkLmRhdGEubWFwKCBhc3luYyBzaG9wcGluZ0xpc3QgPT4ge1xuXG4gICAgICAgICAgICBjb25zdCB7IHBpZCwgc2lkLCBhZGp1c3RQcmljZSwgYWRqdXN0R3JvdXBQcmljZSB9ID0gc2hvcHBpbmdMaXN0O1xuXG4gICAgICAgICAgICAvLyDmib7liLBiYXNlX3N0YXR1czogMCDnmoTlkIzllYblk4HorqLljZVcbiAgICAgICAgICAgIGNvbnN0IG9yZGVycyQgPSBhd2FpdCBkYi5jb2xsZWN0aW9uKCdvcmRlcicpXG4gICAgICAgICAgICAgICAgLndoZXJlKHtcbiAgICAgICAgICAgICAgICAgICAgdGlkLFxuICAgICAgICAgICAgICAgICAgICBwaWQsXG4gICAgICAgICAgICAgICAgICAgIHNpZCxcbiAgICAgICAgICAgICAgICAgICAgYmFzZV9zdGF0dXM6ICcwJ1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLmdldCggKTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgLy8g6K6i5Y2V5pu05pawXG4gICAgICAgICAgICBhd2FpdCBQcm9taXNlLmFsbCggb3JkZXJzJC5kYXRhLm1hcCggb3JkZXIgPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiBkYi5jb2xsZWN0aW9uKCdvcmRlcicpXG4gICAgICAgICAgICAgICAgICAgIC5kb2MoIFN0cmluZyggb3JkZXIuX2lkICkpXG4gICAgICAgICAgICAgICAgICAgIC51cGRhdGUoe1xuICAgICAgICAgICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFsbG9jYXRlZFByaWNlOiBhZGp1c3RQcmljZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhbGxvY2F0ZWRHcm91cFByaWNlOiBhZGp1c3RHcm91cFByaWNlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJhc2Vfc3RhdHVzOiAnMSdcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIH0pKTtcblxuICAgICAgICB9KSk7XG5cbiAgICAgICAgcmV0dXJuIHsgc3RhdHVzOiAyMDAgfVxuXG4gICAgfSBjYXRjaCAoIGUgKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKCchISEh5a6a5pe25Zmo6K6i5Y2VcHJpY2VGaXjplJnor68nLCBlICk7XG4gICAgICAgIHJldHVybiB7IHN0YXR1czogNTAwIH1cbiAgICB9XG59XG5cbi8qKlxuICog6K6i5Y2VNO+8muaJgOacieaIkOWKn+aUr+S7mOWwvuasvueahOiuouWNle+8jOaKimJhc2Vfc3RhdHVz6K6+5Li6M1xuICovXG5leHBvcnQgY29uc3QgcGF5TGFzdEZpeCA9IGFzeW5jICggKSA9PiB7XG4gICAgdHJ5IHtcbiAgICAgICAgXG4gICAgICAgIGNvbnN0IG9yZGVycyQgPSBhd2FpdCBkYi5jb2xsZWN0aW9uKCdvcmRlcicpXG4gICAgICAgICAgICAud2hlcmUoe1xuICAgICAgICAgICAgICAgIHBheV9zdGF0dXM6ICcyJyxcbiAgICAgICAgICAgICAgICBiYXNlX3N0YXR1czogXy5vciggXy5lcSgnMCcpLCBfLmVxKCcxJyksICBfLmVxKCcyJykpXG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLmdldCggKTtcblxuICAgICAgICBpZiAoIG9yZGVycyQuZGF0YS5sZW5ndGggPT09IDAgKSB7XG4gICAgICAgICAgICByZXR1cm4geyBzdGF0dXM6IDIwMCB9O1xuICAgICAgICB9XG5cbiAgICAgICAgYXdhaXQgUHJvbWlzZS5hbGwoXG4gICAgICAgICAgICBvcmRlcnMkLmRhdGEubWFwKCBvcmRlciA9PiB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGRiLmNvbGxlY3Rpb24oJ29yZGVyJylcbiAgICAgICAgICAgICAgICAgICAgLmRvYyggU3RyaW5nKCBvcmRlci5faWQgKSlcbiAgICAgICAgICAgICAgICAgICAgLnVwZGF0ZSh7XG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYmFzZV9zdGF0dXM6ICczJ1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgfSlcbiAgICAgICAgKVxuICAgICAgICBcbiAgICB9IGNhdGNoICggZSApIHtcbiAgICAgICAgY29uc29sZS5sb2coJyEhISHlrprml7blmajorqLljZVwYXlMYXN0Rml46ZSZ6K+vJywpXG4gICAgICAgIHJldHVybiB7IHN0YXR1czogNTAwIH1cbiAgICB9XG59XG5cbi8qKlxuICog6K6i5Y2VNO+8muaWsOiuouWNleaOqOmAgVxuICog5pe26Ze077yaMTIsIDE4LCAwXG4gKi9cbmV4cG9ydCBjb25zdCBwdXNoTmV3ID0gYXN5bmMgKCApID0+IHtcbiAgICB0cnkge1xuICAgICAgICBcbiAgICAgICAgY29uc3Qgbm93RGF0ZSA9IGdldE5vdyggKTtcbiAgICAgICAgXG4gICAgICAgIC8vIDDjgIHliKTmlq3mmK/lkKblnKjpgqPlh6DkuKrml7bpl7TmiLPkuYvlhoVcbiAgICAgICAgaWYgKCAhY2hlY2tJc0luUmFuZ2UoIG5vd0RhdGUsIFsgMTIsIDE4LCAwIF0pKSB7IFxuICAgICAgICAgICAgcmV0dXJuIHsgc3RhdHVzOiAyMDAgfTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIDHjgIHojrflj5ZjdXJyZW50IHRyaXBcbiAgICAgICAgY29uc3QgdHJpcHMkID0gYXdhaXQgY2xvdWQuY2FsbEZ1bmN0aW9uKHtcbiAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAkdXJsOiAnZW50ZXInXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgbmFtZTogJ3RyaXAnXG4gICAgICAgIH0pO1xuICAgICAgICBjb25zdCB0cmlwcyA9IHRyaXBzJC5yZXN1bHQuZGF0YTtcbiAgICAgICAgY29uc3QgdHJpcCA9IHRyaXBzWyAwIF07XG5cbiAgICAgICAgLy8gMuOAgeiOt+WPliBwdXNoOiB0cnVlIOeahOeuoeeQhuWRmFxuICAgICAgICBjb25zdCBtZW1iZXJzID0gYXdhaXQgZGIuY29sbGVjdGlvbignbWFuYWdlci1tZW1iZXInKVxuICAgICAgICAgICAgLndoZXJlKHtcbiAgICAgICAgICAgICAgICBwdXNoOiB0cnVlXG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLmdldCggKTtcblxuICAgICAgICBpZiAoICF0cmlwIHx8IG1lbWJlcnMuZGF0YS5sZW5ndGggPT09IDAgKSB7XG4gICAgICAgICAgICByZXR1cm4geyBzdGF0dXM6IDIwMCB9O1xuICAgICAgICB9XG5cbiAgICAgICAgYXdhaXQgUHJvbWlzZS5hbGwoXG4gICAgICAgICAgICBtZW1iZXJzLmRhdGEubWFwKCBhc3luYyBtZW1iZXIgPT4ge1xuICAgICAgICAgICAgICAgIGxldCBjb3VudCA9IDA7XG4gICAgICAgICAgICAgICAgY29uc3QgeyBvcGVuaWQgfSA9IG1lbWJlclxuXG4gICAgICAgICAgICAgICAgLy8gM+OAgeiOt+WPluS4iuasoea1j+iniOiuouWNleeahOaXtumXtOaIs1xuICAgICAgICAgICAgICAgIGNvbnN0IGNvbmZpZyQgPSBhd2FpdCBkYi5jb2xsZWN0aW9uKCdhbmFseXNlLWRhdGEnKVxuICAgICAgICAgICAgICAgICAgICAud2hlcmUoe1xuICAgICAgICAgICAgICAgICAgICAgICAgb3BlbmlkLFxuICAgICAgICAgICAgICAgICAgICAgICAgdGlkOiB0cmlwLl9pZCxcbiAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6ICdtYW5hZ2VyLXRyaXAtb3JkZXItdmlzaXQnXG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgIC5nZXQoICk7XG4gICAgICAgICAgICAgICAgY29uc3QgdHJpcE9yZGVyVmlzaXRDb25maWcgPSBjb25maWckLmRhdGFbIDAgXTtcblxuICAgICAgICAgICAgICAgIGxldCBxdWVyeTogYW55ID0ge1xuICAgICAgICAgICAgICAgICAgICB0aWQ6IHRyaXAuX2lkLFxuICAgICAgICAgICAgICAgICAgICBwYXlfc3RhdHVzOiBfLm5lcSgnMCcpLFxuICAgICAgICAgICAgICAgICAgICBiYXNlX3N0YXR1czogXy5vciggXy5lcSgnMCcpLCBfLmVxKCcxJyksIF8uZXEoJzInKSlcbiAgICAgICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAgICAgaWYgKCAhIXRyaXBPcmRlclZpc2l0Q29uZmlnICkge1xuICAgICAgICAgICAgICAgICAgICBxdWVyeSA9IE9iamVjdC5hc3NpZ24oeyB9LCBxdWVyeSwge1xuICAgICAgICAgICAgICAgICAgICAgICAgY3JlYXRlVGltZTogXy5ndGUoIHRyaXBPcmRlclZpc2l0Q29uZmlnLnZhbHVlIClcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgLy8gNOOAgeiwg+eUqOaOqOmAgVxuICAgICAgICAgICAgICAgIGNvbnN0IGNvdW50JCA9IGF3YWl0IGRiLmNvbGxlY3Rpb24oJ29yZGVyJylcbiAgICAgICAgICAgICAgICAgICAgICAgIC53aGVyZSggcXVlcnkgKVxuICAgICAgICAgICAgICAgICAgICAgICAgLmNvdW50KCApO1xuICAgICAgICAgICAgICAgIGNvdW50ID0gY291bnQkLnRvdGFsO1xuXG5cbiAgICAgICAgICAgICAgICBpZiAoIGNvdW50ID09PSAwICkgeyBcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHsgc3RhdXM6IDIwMCB9O1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIC8vIDTjgIHosIPnlKjmjqjpgIFcbiAgICAgICAgICAgICAgICBjb25zdCBwdXNoJCA9IGF3YWl0IGNsb3VkLmNhbGxGdW5jdGlvbih7XG4gICAgICAgICAgICAgICAgICAgIG5hbWU6ICdjb21tb24nLFxuICAgICAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAkdXJsOiAncHVzaC1zdWJzY3JpYmUtY2xvdWQnLFxuICAgICAgICAgICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9wZW5pZCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiAnbmV3T3JkZXInLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhZ2U6IGBwYWdlcy9tYW5hZ2VyLXRyaXAtb3JkZXItYWxsL2luZGV4P3RpZD0ke3RyaXAuX2lkfWAsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGV4dHM6IFtg5L2g5pyJJHtjb3VudH3mnaHmlrDorqLljZVgLCBg54K55Ye75p+l55yLYF1cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coICc9PT09IHB1c2gnLCBwdXNoJC5yZXN1bHQgKVxuXG4gICAgICAgICAgICAgICAgLy8gNeOAgeabtOaWsOOAgeWIm+W7uumFjee9rlxuICAgICAgICAgICAgICAgIGlmICggcHVzaCQucmVzdWx0LnN0YXR1cyA9PT0gMjAwICkge1xuXG4gICAgICAgICAgICAgICAgICAgIGlmICggISF0cmlwT3JkZXJWaXNpdENvbmZpZyApIHtcblxuICAgICAgICAgICAgICAgICAgICAgICAgLy8g5pu05paw5LiA5LiL5q2k5p2h6YWN572uXG4gICAgICAgICAgICAgICAgICAgICAgICBhd2FpdCBkYi5jb2xsZWN0aW9uKCdhbmFseXNlLWRhdGEnKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5kb2MoIFN0cmluZyggdHJpcE9yZGVyVmlzaXRDb25maWcuX2lkICkpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLnVwZGF0ZSh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlOiBnZXROb3coIHRydWUgKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyDliJvlu7rkuIDkuIvphY3nva5cbiAgICAgICAgICAgICAgICAgICAgICAgIGF3YWl0IGRiLmNvbGxlY3Rpb24oJ2FuYWx5c2UtZGF0YScpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLmFkZCh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9wZW5pZCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRpZDogdHJpcC5faWQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiAnbWFuYWdlci10cmlwLW9yZGVyLXZpc2l0JyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlOiBnZXROb3coIHRydWUgKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICByZXR1cm47XG5cbiAgICAgICAgICAgIH0pXG4gICAgICAgICk7XG4gICAgICAgIFxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgc3RhdHVzOiAyMDBcbiAgICAgICAgfTtcblxuICAgIH0gY2F0Y2ggKCBlICkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgc3RhdHVzOiA1MDAsXG4gICAgICAgICAgICBtZXNzYWdlOiB0eXBlb2YgZSA9PT0gJ3N0cmluZycgPyBlIDogSlNPTi5zdHJpbmdpZnkoIGUgKVxuICAgICAgICB9XG4gICAgfVxufVxuXG4vKiogXG4gKiDorqLljZU1OiDlsL7mrL7mjqjpgIFcbiAqIDIy54K55omN5aSE55CGXG4gKi9cbmV4cG9ydCBjb25zdCBwdXNoTGFzdFBheSA9IGFzeW5jICggKSA9PiB7XG5cbiAgICAvLyAw44CB5piv5ZCm5Li6MOeCuVxuICAgIGlmICggY2hlY2tJc0luUmFuZ2UoIGdldE5vdyggKSwgWyAyMiBdKSkge1xuICAgICAgICByZXR1cm4geyBzdGF0dXM6IDIwMCB9XG4gICAgfVxuXG4gICAgLy8gMeOAgeiOt+WPluS4iuS4gOi2n3RyaXBcbiAgICAvLyDmjInnu5PmnZ/ml6XmnJ/lgJLlj5nluo/vvIzojrflj5bmnIDlpJox5p2hIOW3sue7k+adn+eahOihjOeoi1xuICAgIGNvbnN0IHRyaXAkID0gYXdhaXQgZGIuY29sbGVjdGlvbigndHJpcCcpXG4gICAgICAgIC53aGVyZSh7XG4gICAgICAgICAgICBpc0Nsb3NlZDogdHJ1ZVxuICAgICAgICB9KVxuICAgICAgICAubGltaXQoIDEgKVxuICAgICAgICAub3JkZXJCeSgnZW5kX2RhdGUnLCAnZGVzYycpXG4gICAgICAgIC5nZXQoICk7XG5cbiAgICAvLyAy44CB6I635Y+WIHB1c2g6IHRydWUg55qE566h55CG5ZGYXG4gICAgY29uc3QgbWVtYmVycyA9IGF3YWl0IGRiLmNvbGxlY3Rpb24oJ21hbmFnZXItbWVtYmVyJylcbiAgICAgICAgLndoZXJlKHtcbiAgICAgICAgICAgIHB1c2g6IHRydWVcbiAgICAgICAgfSlcbiAgICAgICAgLmdldCggKTtcbiAgICBcbiAgICBpZiAoIHRyaXAkLmRhdGEubGVuZ3RoID09PSAwIHx8IG1lbWJlcnMuZGF0YS5sZW5ndGggPT09IDAgKSB7XG4gICAgICAgIHJldHVybiB7IHN0YXR1czogMjAwIH07XG4gICAgfVxuXG4gICAgYXdhaXQgUHJvbWlzZS5hbGwoXG4gICAgICAgIG1lbWJlcnMuZGF0YS5tYXAoIGFzeW5jIG1lbWJlciA9PiB7XG5cbiAgICAgICAgICAgIGNvbnN0IHsgb3BlbmlkIH0gPSBtZW1iZXI7XG5cbiAgICAgICAgICAgIC8vIDPjgIHojrflj5bkuIrmrKHmtY/op4jlsL7mrL7nmoTml7bpl7TmiLNcbiAgICAgICAgICAgIGNvbnN0IGNvbmZpZyQgPSBhd2FpdCBkYi5jb2xsZWN0aW9uKCdhbmFseXNlLWRhdGEnKVxuICAgICAgICAgICAgICAgICAgICAud2hlcmUoe1xuICAgICAgICAgICAgICAgICAgICAgICAgb3BlbmlkLFxuICAgICAgICAgICAgICAgICAgICAgICAgdGlkOiB0cmlwJC5kYXRhWyAwIF0uX2lkLFxuICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogJ21hbmFnZXItcGF5LWxhc3QtdmlzaXQnXG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgIC5nZXQoICk7XG5cbiAgICAgICAgICAgIGNvbnN0IGNvbmZpZyA9IGNvbmZpZyQuZGF0YVsgMCBdO1xuXG4gICAgICAgICAgICAvLyAz44CB5p+l6K+iXG4gICAgICAgICAgICBsZXQgcXVlcnk6IGFueSA9IHtcbiAgICAgICAgICAgICAgICBwYXlfc3RhdHVzOiAnMicsXG4gICAgICAgICAgICAgICAgdGlkOiB0cmlwJC5kYXRhWyAwIF0uX2lkLFxuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgaWYgKCBjb25maWcgKSB7XG4gICAgICAgICAgICAgICAgcXVlcnkgPSB7XG4gICAgICAgICAgICAgICAgICAgIC4uLnF1ZXJ5LFxuICAgICAgICAgICAgICAgICAgICBwYXl0aW1lOiBfLmd0ZSggY29uZmlnLnZhbHVlIClcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgXG4gICAgICAgICAgICBjb25zdCBvcmRlcnMkID0gYXdhaXQgZGIuY29sbGVjdGlvbignb3JkZXInKVxuICAgICAgICAgICAgICAgIC53aGVyZSggcXVlcnkgKVxuICAgICAgICAgICAgICAgIC5nZXQoICk7XG5cbiAgICAgICAgICAgIGNvbnN0IGNvdW50ID0gQXJyYXkuZnJvbShcbiAgICAgICAgICAgICAgICBuZXcgU2V0KFxuICAgICAgICAgICAgICAgICAgICBvcmRlcnMkLmRhdGEubWFwKCB4ID0+IHgub3BlbmlkIClcbiAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICApLmxlbmd0aDtcblxuICAgICAgICAgICAgaWYgKCBjb3VudCA9PT0gMCApIHtcbiAgICAgICAgICAgICAgICByZXR1cm4geyBzdGF1czogMjAwIH07XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIDTjgIHosIPnlKjmjqjpgIFcbiAgICAgICAgICAgIGNvbnN0IHB1c2gkID0gYXdhaXQgY2xvdWQuY2FsbEZ1bmN0aW9uKHtcbiAgICAgICAgICAgICAgICBuYW1lOiAnY29tbW9uJyxcbiAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICAgICR1cmw6ICdwdXNoLXN1YnNjcmliZS1jbG91ZCcsXG4gICAgICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG9wZW5pZCxcbiAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6ICdnZXRNb25leScsXG4gICAgICAgICAgICAgICAgICAgICAgICBwYWdlOiAncGFnZXMvbWFuYWdlci10cmlwLWxpc3QvaW5kZXgnLFxuICAgICAgICAgICAgICAgICAgICAgICAgdGV4dHM6IFtgJHtjb3VudH3kurrku5jkuoblsL7mrL5gLCBg5LuK5aSpYF1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBjb25zb2xlLmxvZyggJz09PT0gcHVzaCcsIHB1c2gkLnJlc3VsdCApXG4gICAgICAgICAgICAvLyA144CB5pu05paw44CB5Yib5bu66YWN572uXG4gICAgICAgICAgICBpZiAoIHB1c2gkLnJlc3VsdC5zdGF0dXMgPT09IDIwMCApIHtcblxuICAgICAgICAgICAgICAgIGlmICggISFjb25maWcgKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgLy8g5pu05paw5LiA5LiL5q2k5p2h6YWN572uXG4gICAgICAgICAgICAgICAgICAgIGF3YWl0IGRiLmNvbGxlY3Rpb24oJ2FuYWx5c2UtZGF0YScpXG4gICAgICAgICAgICAgICAgICAgICAgICAuZG9jKCBTdHJpbmcoIGNvbmZpZy5faWQgKSlcbiAgICAgICAgICAgICAgICAgICAgICAgIC51cGRhdGUoe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU6IGdldE5vdyggdHJ1ZSApXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgLy8g5Yib5bu65LiA5LiL6YWN572uXG4gICAgICAgICAgICAgICAgICAgIGF3YWl0IGRiLmNvbGxlY3Rpb24oJ2FuYWx5c2UtZGF0YScpXG4gICAgICAgICAgICAgICAgICAgICAgICAuYWRkKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9wZW5pZCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGlkOiB0cmlwJC5kYXRhWyAwIF0uX2lkLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiAnbWFuYWdlci1wYXktbGFzdC12aXNpdCcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlOiBnZXROb3coIHRydWUgKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSlcbiAgICApO1xuXG59Il19