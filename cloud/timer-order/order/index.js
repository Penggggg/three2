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
cloud.init({
    env: process.env.cloud
});
var db = cloud.database();
var _ = db.command;
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
                        createTime: _.lte(new Date().getTime() - 30 * 60 * 1000)
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
    var checkIsInRange, trips$, trips, trip_1, members, e_5;
    var _this = this;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 4, , 5]);
                checkIsInRange = function (ts) {
                    console.log(ts);
                    var now = new Date(ts);
                    var range = [
                        7,
                        12,
                        22,
                        0,
                    ];
                    console.log('===', ts, now.getTime(), now.toLocaleString());
                    return range.some(function (x) {
                        var h = now.getHours();
                        console.log(x, h, now.getMinutes());
                        return x === h && now.getMinutes() === 30;
                    });
                };
                console.log('!!!!! 新订单推送');
                if (!checkIsInRange(Date.now())) {
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
                console.log('!!!!! trip', trip_1);
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
                console.log('!!!!! members.data', members.data);
                return [4, Promise.all(members.data.map(function (member) { return __awaiter(_this, void 0, void 0, function () {
                        var count, openid, config$, config, query, count$, push$;
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
                                    config = config$.data[0];
                                    console.log('!!!!! config', config);
                                    query = {
                                        tid: trip_1._id,
                                        pay_status: _.neq('0'),
                                        base_status: _.or(_.eq('0'), _.eq('1'), _.eq('2'))
                                    };
                                    if (!!config) {
                                        query = Object.assign({}, query, {
                                            createTime: _.gte(config.value)
                                        });
                                    }
                                    return [4, db.collection('order')
                                            .where(query)
                                            .count()];
                                case 2:
                                    count$ = _a.sent();
                                    count = count$.total;
                                    console.log('!!!!! count', count);
                                    if (count === 0) {
                                        return [2];
                                    }
                                    return [4, cloud.callFunction({
                                            name: 'common',
                                            data: {
                                                $url: 'push-template',
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
                                    if (!!!config) return [3, 5];
                                    console.log('=======');
                                    return [4, db.collection('analyse-data')
                                            .doc(String(config._id))
                                            .update({
                                            data: {
                                                value: new Date().getTime()
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
                                            value: new Date().getTime()
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSxpQkF3V0M7O0FBeFdELHFDQUF1QztBQUV2QyxLQUFLLENBQUMsSUFBSSxDQUFDO0lBQ1AsR0FBRyxFQUFFLE9BQU8sQ0FBQyxHQUFHLENBQUMsS0FBSztDQUN6QixDQUFDLENBQUM7QUFFSCxJQUFNLEVBQUUsR0FBZ0IsS0FBSyxDQUFDLFFBQVEsRUFBRyxDQUFDO0FBQzFDLElBQU0sQ0FBQyxHQUFHLEVBQUUsQ0FBQyxPQUFPLENBQUM7QUFLUixRQUFBLFFBQVEsR0FBRzs7Ozs7OztnQkFHQSxXQUFNLEVBQUUsQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDO3lCQUN2QyxLQUFLLENBQUM7d0JBQ0gsVUFBVSxFQUFFLEdBQUc7d0JBQ2YsV0FBVyxFQUFFLEdBQUc7d0JBQ2hCLFVBQVUsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFFLElBQUksSUFBSSxFQUFHLENBQUMsT0FBTyxFQUFHLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxJQUFJLENBQUU7cUJBQy9ELENBQUM7eUJBQ0QsR0FBRyxFQUFHLEVBQUE7O2dCQU5MLE9BQU8sR0FBRyxTQU1MO2dCQUdYLFdBQU0sT0FBTyxDQUFDLEdBQUcsQ0FBRSxPQUFPLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBRSxVQUFBLEtBQUs7d0JBQ3RDLE9BQU8sRUFBRSxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUMsQ0FBQyxHQUFHLENBQUUsTUFBTSxDQUFFLEtBQUssQ0FBQyxHQUFHLENBQUUsQ0FBQzs2QkFDbEQsTUFBTSxDQUFDOzRCQUNKLElBQUksRUFBRTtnQ0FDRixXQUFXLEVBQUUsR0FBRzs2QkFDbkI7eUJBQ0osQ0FBQyxDQUFBO29CQUNWLENBQUMsQ0FBQyxDQUFDLEVBQUE7O2dCQVBILFNBT0csQ0FBQztnQkFHSixXQUFNLE9BQU8sQ0FBQyxHQUFHLENBQUUsT0FBTyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUUsVUFBTSxLQUFLOzs7OztvQ0FFdEMsUUFBUSxHQUFHLEtBQUssQ0FBQyxHQUFHLElBQUksS0FBSyxDQUFDLEdBQUcsQ0FBQztvQ0FDbEMsVUFBVSxHQUFHLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDO29DQUV0QyxXQUFNLEVBQUUsQ0FBQyxVQUFVLENBQUUsVUFBVSxDQUFFOzZDQUMzQyxHQUFHLENBQUUsUUFBUSxDQUFFOzZDQUNmLEdBQUcsRUFBRyxFQUFBOztvQ0FGTCxNQUFNLEdBQUcsU0FFSjtvQ0FFWCxJQUFLLE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxLQUFLLFNBQVMsSUFBSSxNQUFNLENBQUMsSUFBSSxDQUFDLEtBQUssS0FBSyxJQUFJLEVBQUc7d0NBQUUsV0FBTztxQ0FBRTtvQ0FFaEYsV0FBTSxFQUFFLENBQUMsVUFBVSxDQUFFLFVBQVUsQ0FBRSxDQUFDLEdBQUcsQ0FBRSxRQUFRLENBQUU7NkNBQzVDLE1BQU0sQ0FBQzs0Q0FDSixJQUFJLEVBQUU7Z0RBQ0YsS0FBSyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUUsS0FBSyxDQUFDLEtBQUssQ0FBRTs2Q0FDOUI7eUNBQ0osQ0FBQyxFQUFBOztvQ0FMTixTQUtNLENBQUM7Ozs7eUJBQ1YsQ0FBQyxDQUFDLEVBQUE7O2dCQWpCSCxTQWlCRyxDQUFDO2dCQUVKLFdBQU8sRUFBRSxNQUFNLEVBQUUsR0FBRyxFQUFFLEVBQUE7OztnQkFFdEIsT0FBTyxDQUFDLEdBQUcsQ0FBQyxxQkFBcUIsQ0FBRSxDQUFBO2dCQUNuQyxXQUFPLEVBQUUsTUFBTSxFQUFFLEdBQUcsRUFBRSxFQUFBOzs7O0tBRTdCLENBQUM7QUFLVyxRQUFBLFFBQVEsR0FBRzs7Ozs7O2dCQUdBLFdBQU0sRUFBRSxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUM7eUJBQ3ZDLEtBQUssQ0FBQzt3QkFDSCxJQUFJLEVBQUUsS0FBSzt3QkFDWCxVQUFVLEVBQUUsR0FBRztxQkFDbEIsQ0FBQzt5QkFDRCxHQUFHLEVBQUcsRUFBQTs7Z0JBTEwsT0FBTyxHQUFHLFNBS0w7Z0JBR1gsV0FBTSxPQUFPLENBQUMsR0FBRyxDQUFFLE9BQU8sQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFFLFVBQUEsS0FBSzt3QkFDdEMsT0FBTyxFQUFFLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxDQUFDLEdBQUcsQ0FBRSxNQUFNLENBQUUsS0FBSyxDQUFDLEdBQUcsQ0FBRSxDQUFDOzZCQUNsRCxNQUFNLENBQUM7NEJBQ0osSUFBSSxFQUFFO2dDQUNGLElBQUksRUFBRSxRQUFROzZCQUNqQjt5QkFDSixDQUFDLENBQUE7b0JBQ1YsQ0FBQyxDQUFDLENBQUMsRUFBQTs7Z0JBUEgsU0FPRyxDQUFDO2dCQUdKLFdBQU0sT0FBTyxDQUFDLEdBQUcsQ0FDYixPQUFPLENBQUMsSUFBSTt5QkFDUCxNQUFNLENBQUUsVUFBQSxDQUFDLElBQUksT0FBQSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBUCxDQUFPLENBQUU7eUJBQ3RCLEdBQUcsQ0FBRSxVQUFBLEtBQUs7d0JBQ1AsT0FBTyxFQUFFLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQyxDQUFDLEdBQUcsQ0FBRSxLQUFLLENBQUMsR0FBRyxDQUFFOzZCQUN4QyxNQUFNLEVBQUcsQ0FBQTtvQkFDbEIsQ0FBQyxDQUFDLENBQ1QsRUFBQTs7Z0JBUEQsU0FPQyxDQUFDO2dCQUVGLFdBQU87d0JBQ0gsTUFBTSxFQUFFLEdBQUc7cUJBQ2QsRUFBQTs7O2dCQUlELE9BQU8sQ0FBQyxHQUFHLENBQUMscUJBQXFCLENBQUUsQ0FBQTtnQkFDbkMsV0FBTyxFQUFFLE1BQU0sRUFBRSxHQUFHLEVBQUUsRUFBQTs7OztLQUU3QixDQUFBO0FBTVksUUFBQSxRQUFRLEdBQUc7Ozs7Ozs7Z0JBSUQsV0FBTSxLQUFLLENBQUMsWUFBWSxDQUFDO3dCQUNwQyxJQUFJLEVBQUUsTUFBTTt3QkFDWixJQUFJLEVBQUU7NEJBQ0YsSUFBSSxFQUFFLE9BQU87eUJBQ2hCO3FCQUNKLENBQUMsRUFBQTs7Z0JBTEksTUFBTSxHQUFHLFNBS2I7Z0JBRUksV0FBVyxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFFLENBQUMsQ0FBRSxDQUFDO2dCQUU1QyxJQUFLLENBQUMsV0FBVyxFQUFHO29CQUNoQixXQUFPOzRCQUNILE1BQU0sRUFBRSxHQUFHO3lCQUNkLEVBQUE7aUJBQ0o7Z0JBRUssUUFBTSxXQUFXLENBQUMsR0FBRyxDQUFDO2dCQUdMLFdBQU0sRUFBRSxDQUFDLFVBQVUsQ0FBQyxlQUFlLENBQUM7eUJBQ3RELEtBQUssQ0FBQzt3QkFDSCxHQUFHLE9BQUE7d0JBQ0gsV0FBVyxFQUFFLEdBQUc7cUJBQ25CLENBQUM7eUJBQ0QsR0FBRyxFQUFHLEVBQUE7O2dCQUxMLGNBQWMsR0FBRyxTQUtaO2dCQUVYLFdBQU0sT0FBTyxDQUFDLEdBQUcsQ0FBRSxjQUFjLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBRSxVQUFNLFlBQVk7Ozs7O29DQUVsRCxHQUFHLEdBQXlDLFlBQVksSUFBckQsRUFBRSxHQUFHLEdBQW9DLFlBQVksSUFBaEQsRUFBRSxXQUFXLEdBQXVCLFlBQVksWUFBbkMsRUFBRSxnQkFBZ0IsR0FBSyxZQUFZLGlCQUFqQixDQUFrQjtvQ0FHakQsV0FBTSxFQUFFLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQzs2Q0FDdkMsS0FBSyxDQUFDOzRDQUNILEdBQUcsT0FBQTs0Q0FDSCxHQUFHLEtBQUE7NENBQ0gsR0FBRyxLQUFBOzRDQUNILFdBQVcsRUFBRSxHQUFHO3lDQUNuQixDQUFDOzZDQUNELEdBQUcsRUFBRyxFQUFBOztvQ0FQTCxPQUFPLEdBQUcsU0FPTDtvQ0FHWCxXQUFNLE9BQU8sQ0FBQyxHQUFHLENBQUUsT0FBTyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUUsVUFBQSxLQUFLOzRDQUN0QyxPQUFPLEVBQUUsQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDO2lEQUN4QixHQUFHLENBQUUsTUFBTSxDQUFFLEtBQUssQ0FBQyxHQUFHLENBQUUsQ0FBQztpREFDekIsTUFBTSxDQUFDO2dEQUNKLElBQUksRUFBRTtvREFDRixjQUFjLEVBQUUsV0FBVztvREFDM0IsbUJBQW1CLEVBQUUsZ0JBQWdCO29EQUNyQyxXQUFXLEVBQUUsR0FBRztpREFDbkI7NkNBQ0osQ0FBQyxDQUFBO3dDQUNWLENBQUMsQ0FBQyxDQUFDLEVBQUE7O29DQVZILFNBVUcsQ0FBQzs7Ozt5QkFFUCxDQUFDLENBQUMsRUFBQTs7Z0JBM0JILFNBMkJHLENBQUM7Z0JBRUosV0FBTyxFQUFFLE1BQU0sRUFBRSxHQUFHLEVBQUUsRUFBQTs7O2dCQUd0QixPQUFPLENBQUMsR0FBRyxDQUFDLHFCQUFxQixDQUFFLENBQUE7Z0JBQ25DLFdBQU8sRUFBRSxNQUFNLEVBQUUsR0FBRyxFQUFFLEVBQUE7Ozs7S0FFN0IsQ0FBQTtBQUtZLFFBQUEsVUFBVSxHQUFHOzs7Ozs7Z0JBR0YsV0FBTSxFQUFFLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQzt5QkFDdkMsS0FBSyxDQUFDO3dCQUNILFVBQVUsRUFBRSxHQUFHO3dCQUNmLFdBQVcsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsRUFBRyxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDO3FCQUN2RCxDQUFDO3lCQUNELEdBQUcsRUFBRyxFQUFBOztnQkFMTCxPQUFPLEdBQUcsU0FLTDtnQkFFWCxXQUFNLE9BQU8sQ0FBQyxHQUFHLENBQ2IsT0FBTyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUUsVUFBQSxLQUFLO3dCQUNuQixPQUFPLEVBQUUsQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDOzZCQUN4QixHQUFHLENBQUUsTUFBTSxDQUFFLEtBQUssQ0FBQyxHQUFHLENBQUUsQ0FBQzs2QkFDekIsTUFBTSxDQUFDOzRCQUNKLElBQUksRUFBRTtnQ0FDRixXQUFXLEVBQUUsR0FBRzs2QkFDbkI7eUJBQ0osQ0FBQyxDQUFBO29CQUNWLENBQUMsQ0FBQyxDQUNMLEVBQUE7O2dCQVZELFNBVUMsQ0FBQTs7OztnQkFHRCxPQUFPLENBQUMsR0FBRyxDQUFDLHVCQUF1QixDQUFFLENBQUE7Z0JBQ3JDLFdBQU8sRUFBRSxNQUFNLEVBQUUsR0FBRyxFQUFFLEVBQUE7Ozs7S0FFN0IsQ0FBQTtBQUtZLFFBQUEsT0FBTyxHQUFHOzs7Ozs7O2dCQUlULGNBQWMsR0FBRyxVQUFFLEVBQVU7b0JBQy9CLE9BQU8sQ0FBQyxHQUFHLENBQUUsRUFBRSxDQUFFLENBQUM7b0JBQ2xCLElBQU0sR0FBRyxHQUFHLElBQUksSUFBSSxDQUFFLEVBQUUsQ0FBRSxDQUFDO29CQUMzQixJQUFNLEtBQUssR0FBRzt3QkFDVixDQUFDO3dCQUNELEVBQUU7d0JBQ0YsRUFBRTt3QkFDRixDQUFDO3FCQUNKLENBQUM7b0JBRUYsT0FBTyxDQUFDLEdBQUcsQ0FBQyxLQUFLLEVBQUUsRUFBRSxFQUFFLEdBQUcsQ0FBQyxPQUFPLEVBQUcsRUFBRSxHQUFHLENBQUMsY0FBYyxFQUFHLENBQUMsQ0FBQztvQkFDOUQsT0FBTyxLQUFLLENBQUMsSUFBSSxDQUFFLFVBQUEsQ0FBQzt3QkFDaEIsSUFBTSxDQUFDLEdBQUcsR0FBRyxDQUFDLFFBQVEsRUFBRyxDQUFDO3dCQUMxQixPQUFPLENBQUMsR0FBRyxDQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxDQUFDLFVBQVUsRUFBRyxDQUFDLENBQUE7d0JBQ3JDLE9BQU8sQ0FBQyxLQUFLLENBQUMsSUFBSSxHQUFHLENBQUMsVUFBVSxFQUFHLEtBQUssRUFBRSxDQUFDO29CQUMvQyxDQUFDLENBQUMsQ0FBQztnQkFDUCxDQUFDLENBQUE7Z0JBRUQsT0FBTyxDQUFDLEdBQUcsQ0FBQyxhQUFhLENBQUUsQ0FBQztnQkFDNUIsSUFBSyxDQUFDLGNBQWMsQ0FBRSxJQUFJLENBQUMsR0FBRyxFQUFHLENBQUMsRUFBRTtvQkFDaEMsV0FBTyxFQUFFLE1BQU0sRUFBRSxHQUFHLEVBQUUsRUFBQztpQkFDMUI7Z0JBR2MsV0FBTSxLQUFLLENBQUMsWUFBWSxDQUFDO3dCQUNwQyxJQUFJLEVBQUU7NEJBQ0YsSUFBSSxFQUFFLE9BQU87eUJBQ2hCO3dCQUNELElBQUksRUFBRSxNQUFNO3FCQUNmLENBQUMsRUFBQTs7Z0JBTEksTUFBTSxHQUFHLFNBS2I7Z0JBQ0ksS0FBSyxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDO2dCQUMzQixTQUFPLEtBQUssQ0FBRSxDQUFDLENBQUUsQ0FBQztnQkFFeEIsT0FBTyxDQUFDLEdBQUcsQ0FBQyxZQUFZLEVBQUUsTUFBSSxDQUFFLENBQUM7Z0JBR2pCLFdBQU0sRUFBRSxDQUFDLFVBQVUsQ0FBQyxnQkFBZ0IsQ0FBQzt5QkFDaEQsS0FBSyxDQUFDO3dCQUNILElBQUksRUFBRSxJQUFJO3FCQUNiLENBQUM7eUJBQ0QsR0FBRyxFQUFHLEVBQUE7O2dCQUpMLE9BQU8sR0FBRyxTQUlMO2dCQUVYLElBQUssQ0FBQyxNQUFJLElBQUksT0FBTyxDQUFDLElBQUksQ0FBQyxNQUFNLEtBQUssQ0FBQyxFQUFHO29CQUN0QyxXQUFPLEVBQUUsTUFBTSxFQUFFLEdBQUcsRUFBRSxFQUFDO2lCQUMxQjtnQkFFRCxPQUFPLENBQUMsR0FBRyxDQUFDLG9CQUFvQixFQUFFLE9BQU8sQ0FBQyxJQUFJLENBQUUsQ0FBQztnQkFFakQsV0FBTSxPQUFPLENBQUMsR0FBRyxDQUNiLE9BQU8sQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFFLFVBQU0sTUFBTTs7Ozs7b0NBQ3RCLEtBQUssR0FBRyxDQUFDLENBQUM7b0NBQ04sTUFBTSxHQUFLLE1BQU0sT0FBWCxDQUFXO29DQUdULFdBQU0sRUFBRSxDQUFDLFVBQVUsQ0FBQyxjQUFjLENBQUM7NkNBQzlDLEtBQUssQ0FBQzs0Q0FDSCxNQUFNLFFBQUE7NENBQ04sR0FBRyxFQUFFLE1BQUksQ0FBQyxHQUFHOzRDQUNiLElBQUksRUFBRSwwQkFBMEI7eUNBQ25DLENBQUM7NkNBQ0QsR0FBRyxFQUFHLEVBQUE7O29DQU5MLE9BQU8sR0FBRyxTQU1MO29DQUNMLE1BQU0sR0FBRyxPQUFPLENBQUMsSUFBSSxDQUFFLENBQUMsQ0FBRSxDQUFDO29DQUVqQyxPQUFPLENBQUMsR0FBRyxDQUFDLGNBQWMsRUFBRSxNQUFNLENBQUUsQ0FBQztvQ0FFakMsS0FBSyxHQUFRO3dDQUNiLEdBQUcsRUFBRSxNQUFJLENBQUMsR0FBRzt3Q0FDYixVQUFVLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUM7d0NBQ3RCLFdBQVcsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDO3FDQUN0RCxDQUFDO29DQUVGLElBQUssQ0FBQyxDQUFDLE1BQU0sRUFBRzt3Q0FDWixLQUFLLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQyxFQUFHLEVBQUUsS0FBSyxFQUFFOzRDQUM5QixVQUFVLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBRSxNQUFNLENBQUMsS0FBSyxDQUFFO3lDQUNwQyxDQUFDLENBQUM7cUNBQ047b0NBR2MsV0FBTSxFQUFFLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQzs2Q0FDbEMsS0FBSyxDQUFFLEtBQUssQ0FBRTs2Q0FDZCxLQUFLLEVBQUcsRUFBQTs7b0NBRlgsTUFBTSxHQUFHLFNBRUU7b0NBQ2pCLEtBQUssR0FBRyxNQUFNLENBQUMsS0FBSyxDQUFDO29DQUVyQixPQUFPLENBQUMsR0FBRyxDQUFDLGFBQWEsRUFBRSxLQUFLLENBQUUsQ0FBQztvQ0FFbkMsSUFBSyxLQUFLLEtBQUssQ0FBQyxFQUFHO3dDQUNmLFdBQU87cUNBQ1Y7b0NBR2EsV0FBTSxLQUFLLENBQUMsWUFBWSxDQUFDOzRDQUNuQyxJQUFJLEVBQUUsUUFBUTs0Q0FDZCxJQUFJLEVBQUU7Z0RBQ0YsSUFBSSxFQUFFLGVBQWU7Z0RBQ3JCLElBQUksRUFBRTtvREFDRixNQUFNLFFBQUE7b0RBQ04sSUFBSSxFQUFFLFVBQVU7b0RBQ2hCLElBQUksRUFBRSwrQkFBK0I7b0RBQ3JDLEtBQUssRUFBRSxDQUFDLGlCQUFLLEtBQUssNkJBQU0sRUFBRSwwQkFBTSxDQUFDO2lEQUNwQzs2Q0FDSjt5Q0FDSixDQUFDLEVBQUE7O29DQVhJLEtBQUssR0FBRyxTQVdaO29DQUVGLE9BQU8sQ0FBQyxHQUFHLENBQUUsV0FBVyxFQUFFLEtBQUssQ0FBQyxNQUFNLENBQUUsQ0FBQTt5Q0FHbkMsQ0FBQSxLQUFLLENBQUMsTUFBTSxDQUFDLE1BQU0sS0FBSyxHQUFHLENBQUEsRUFBM0IsY0FBMkI7eUNBRXZCLENBQUMsQ0FBQyxNQUFNLEVBQVIsY0FBUTtvQ0FFVCxPQUFPLENBQUMsR0FBRyxDQUFFLFNBQVMsQ0FBRSxDQUFBO29DQUV4QixXQUFNLEVBQUUsQ0FBQyxVQUFVLENBQUMsY0FBYyxDQUFDOzZDQUM5QixHQUFHLENBQUUsTUFBTSxDQUFFLE1BQU0sQ0FBQyxHQUFHLENBQUUsQ0FBQzs2Q0FDMUIsTUFBTSxDQUFDOzRDQUNKLElBQUksRUFBRTtnREFDRixLQUFLLEVBQUUsSUFBSSxJQUFJLEVBQUcsQ0FBQyxPQUFPLEVBQUc7NkNBQ2hDO3lDQUNKLENBQUMsRUFBQTs7b0NBTk4sU0FNTSxDQUFDOzt3Q0FHUCxXQUFNLEVBQUUsQ0FBQyxVQUFVLENBQUMsY0FBYyxDQUFDO3lDQUM5QixHQUFHLENBQUM7d0NBQ0QsSUFBSSxFQUFFOzRDQUNGLE1BQU0sUUFBQTs0Q0FDTixHQUFHLEVBQUUsTUFBSSxDQUFDLEdBQUc7NENBQ2IsSUFBSSxFQUFFLDBCQUEwQjs0Q0FDaEMsS0FBSyxFQUFFLElBQUksSUFBSSxFQUFHLENBQUMsT0FBTyxFQUFHO3lDQUNoQztxQ0FDSixDQUFDLEVBQUE7O29DQVJOLFNBUU0sQ0FBQzs7d0NBSWYsV0FBTzs7O3lCQUVWLENBQUMsQ0FDTCxFQUFBOztnQkF4RkQsU0F3RkMsQ0FBQztnQkFFRixXQUFPO3dCQUNILE1BQU0sRUFBRSxHQUFHO3FCQUNkLEVBQUM7OztnQkFHRixXQUFPO3dCQUNILE1BQU0sRUFBRSxHQUFHO3dCQUNYLE9BQU8sRUFBRSxPQUFPLEdBQUMsS0FBSyxRQUFRLENBQUMsQ0FBQyxDQUFDLEdBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBRSxHQUFDLENBQUU7cUJBQzNELEVBQUE7Ozs7S0FFUixDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgY2xvdWQgZnJvbSAnd3gtc2VydmVyLXNkayc7XG5cbmNsb3VkLmluaXQoe1xuICAgIGVudjogcHJvY2Vzcy5lbnYuY2xvdWRcbn0pO1xuXG5jb25zdCBkYjogREIuRGF0YWJhc2UgPSBjbG91ZC5kYXRhYmFzZSggKTtcbmNvbnN0IF8gPSBkYi5jb21tYW5kO1xuXG4vKipcbiAqIOiuouWNlTE6IOaJgOacieW6lOivpeaUr+S7mO+8jOS9huaYr+ayoeacieaUr+S7mO+8iOaUr+S7mOi2heaXtjMw5YiG6ZKf77yJ55qE6K6i5Y2V77yM6YeK5pS+5Y6f5p2l55qE5bqT5a2Y77yM6K6i5Y2V6YeN572u5Li65bey6L+H5pe2XG4gKi9cbmV4cG9ydCBjb25zdCBvdmVydGltZSA9IGFzeW5jICggKSA9PiB7XG4gICAgdHJ5IHtcblxuICAgICAgICBjb25zdCBvcmRlcnMkID0gYXdhaXQgZGIuY29sbGVjdGlvbignb3JkZXInKVxuICAgICAgICAgICAgLndoZXJlKHtcbiAgICAgICAgICAgICAgICBwYXlfc3RhdHVzOiAnMCcsXG4gICAgICAgICAgICAgICAgYmFzZV9zdGF0dXM6ICcwJyxcbiAgICAgICAgICAgICAgICBjcmVhdGVUaW1lOiBfLmx0ZSggbmV3IERhdGUoICkuZ2V0VGltZSggKSAtIDMwICogNjAgKiAxMDAwIClcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAuZ2V0KCApO1xuICAgICAgICBcbiAgICAgICAgLy8g6K6i5Y2V5pu05pawXG4gICAgICAgIGF3YWl0IFByb21pc2UuYWxsKCBvcmRlcnMkLmRhdGEubWFwKCBvcmRlciA9PiB7XG4gICAgICAgICAgICByZXR1cm4gZGIuY29sbGVjdGlvbignb3JkZXInKS5kb2MoIFN0cmluZyggb3JkZXIuX2lkICkpXG4gICAgICAgICAgICAgICAgLnVwZGF0ZSh7XG4gICAgICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJhc2Vfc3RhdHVzOiAnNSdcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgIH0pKTtcblxuICAgICAgICAvLyDlupPlrZjph4rmlL4gKCDlpoLmnpzmnInlupPlrZjnmoTor50gKVxuICAgICAgICBhd2FpdCBQcm9taXNlLmFsbCggb3JkZXJzJC5kYXRhLm1hcCggYXN5bmMgb3JkZXIgPT4ge1xuXG4gICAgICAgICAgICBjb25zdCB0YXJnZXRJZCA9IG9yZGVyLnNpZCB8fCBvcmRlci5waWQ7XG4gICAgICAgICAgICBjb25zdCBjb2xsZWN0aW9uID0gb3JkZXIuc2lkID8gJ3N0YW5kYXJkcycgOiAnZ29vZHMnO1xuXG4gICAgICAgICAgICBjb25zdCB0YXJnZXQgPSBhd2FpdCBkYi5jb2xsZWN0aW9uKCBjb2xsZWN0aW9uIClcbiAgICAgICAgICAgICAgICAuZG9jKCB0YXJnZXRJZCApXG4gICAgICAgICAgICAgICAgLmdldCggKTtcblxuICAgICAgICAgICAgaWYgKCB0YXJnZXQuZGF0YS5zdG9jayA9PT0gdW5kZWZpbmVkIHx8IHRhcmdldC5kYXRhLnN0b2NrID09PSBudWxsICkgeyByZXR1cm47IH1cblxuICAgICAgICAgICAgYXdhaXQgZGIuY29sbGVjdGlvbiggY29sbGVjdGlvbiApLmRvYyggdGFyZ2V0SWQgKVxuICAgICAgICAgICAgICAgIC51cGRhdGUoe1xuICAgICAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzdG9jazogXy5pbmMoIG9yZGVyLmNvdW50IClcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICB9KSk7XG4gICAgICAgIFxuICAgICAgICByZXR1cm4geyBzdGF0dXM6IDIwMCB9XG4gICAgfSBjYXRjaCAoIGUgKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKCchISEh5a6a5pe25Zmo6K6i5Y2Vb3ZlcnRpbWXplJnor68nLClcbiAgICAgICAgcmV0dXJuIHsgc3RhdHVzOiA1MDAgfVxuICAgIH1cbn07XG5cbi8qKlxuICog6K6i5Y2VMu+8muaJgOacieaIkOWKn+aUr+S7mOeahOiuouWNle+8jOajgOafpeacieayoeaciSB0eXBl77yacHJl55qE77yM5pyJ55qE6K+d6ZyA6KaB6L2s5oiQdHlwZTpub3JtYWznsbvlnovorqLljZXvvIzliKDpmaTlr7nlupTnmoTotK3nianovabvvIjmnInnmoTor53vvIlcbiAqL1xuZXhwb3J0IGNvbnN0IHBheWVkRml4ID0gYXN5bmMgKCApID0+IHtcbiAgICB0cnkge1xuXG4gICAgICAgIGNvbnN0IG9yZGVycyQgPSBhd2FpdCBkYi5jb2xsZWN0aW9uKCdvcmRlcicpXG4gICAgICAgICAgICAud2hlcmUoe1xuICAgICAgICAgICAgICAgIHR5cGU6ICdwcmUnLFxuICAgICAgICAgICAgICAgIHBheV9zdGF0dXM6ICcxJ1xuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC5nZXQoICk7XG5cbiAgICAgICAgLy8g6K6i5Y2V5pu05pawXG4gICAgICAgIGF3YWl0IFByb21pc2UuYWxsKCBvcmRlcnMkLmRhdGEubWFwKCBvcmRlciA9PiB7XG4gICAgICAgICAgICByZXR1cm4gZGIuY29sbGVjdGlvbignb3JkZXInKS5kb2MoIFN0cmluZyggb3JkZXIuX2lkICkpXG4gICAgICAgICAgICAgICAgLnVwZGF0ZSh7XG4gICAgICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6ICdub3JtYWwnXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICB9KSk7XG5cbiAgICAgICAgLy8g5Yig6Zmk5a+55bqU55qE6LSt54mp6L2mXG4gICAgICAgIGF3YWl0IFByb21pc2UuYWxsKFxuICAgICAgICAgICAgb3JkZXJzJC5kYXRhXG4gICAgICAgICAgICAgICAgLmZpbHRlciggeCA9PiAhIXguY2lkIClcbiAgICAgICAgICAgICAgICAubWFwKCBvcmRlciA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBkYi5jb2xsZWN0aW9uKCdjYXJ0JykuZG9jKCBvcmRlci5jaWQgKVxuICAgICAgICAgICAgICAgICAgICAgICAgLnJlbW92ZSggKVxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICk7XG5cbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHN0YXR1czogMjAwXG4gICAgICAgIH1cblxuXG4gICAgfSBjYXRjaCAoIGUgKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKCchISEh5a6a5pe25Zmo6K6i5Y2VcGF5ZWRGaXjplJnor68nLClcbiAgICAgICAgcmV0dXJuIHsgc3RhdHVzOiA1MDAgfVxuICAgIH1cbn1cblxuLyoqXG4gKiDorqLljZUz77ya5bey57uP6L+b6KGM6LSt54mp5riF5Y2V5Lu35qC86LCD5pW05ZCO77yM5paw5p2l55qE5ZWG5ZOB6K6i5Y2V5Lu35qC85aaC5p6c6Lef5riF5Y2V5Lu35qC85LiN5LiA6Ie077yM5bqU6K+l55So5a6a5pe25Zmo6L+b6KGM6LCD5pW0XG4gKiAh6L+Z57G76K6i5Y2V77yM5pqC5pe26L+Y5rKh5pyJ6IO96Ieq5Yqo5rOo5YWl5YiG6YWN5pWw6YePIGFsbG9jYXRlZENvdW50XG4gKi9cbmV4cG9ydCBjb25zdCBwcmljZUZpeCA9IGFzeW5jICggKSA9PiB7XG4gICAgdHJ5IHtcblxuICAgICAgICAvLyDojrflj5blvZPliY3ov5vooYzkuK3nmoTooYznqItcbiAgICAgICAgY29uc3QgdHJpcHMkID0gYXdhaXQgY2xvdWQuY2FsbEZ1bmN0aW9uKHtcbiAgICAgICAgICAgIG5hbWU6ICd0cmlwJyxcbiAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAkdXJsOiAnZW50ZXInXG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGNvbnN0IGN1cnJlbnRUcmlwID0gdHJpcHMkLnJlc3VsdC5kYXRhWyAwIF07XG5cbiAgICAgICAgaWYgKCAhY3VycmVudFRyaXAgKSB7IFxuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBzdGF0dXM6IDIwMFxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgdGlkID0gY3VycmVudFRyaXAuX2lkO1xuXG4gICAgICAgIC8vIOaJvuWIsOaJgOacieW3sue7j+iwg+aVtOWlveeahOa4heWNleWIl+ihqFxuICAgICAgICBjb25zdCBzaG9wcGluZ2xpc3RzJCA9IGF3YWl0IGRiLmNvbGxlY3Rpb24oJ3Nob3BwaW5nLWxpc3QnKVxuICAgICAgICAgICAgLndoZXJlKHtcbiAgICAgICAgICAgICAgICB0aWQsXG4gICAgICAgICAgICAgICAgYmFzZV9zdGF0dXM6ICcxJ1xuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC5nZXQoICk7XG4gICAgICAgIFxuICAgICAgICBhd2FpdCBQcm9taXNlLmFsbCggc2hvcHBpbmdsaXN0cyQuZGF0YS5tYXAoIGFzeW5jIHNob3BwaW5nTGlzdCA9PiB7XG5cbiAgICAgICAgICAgIGNvbnN0IHsgcGlkLCBzaWQsIGFkanVzdFByaWNlLCBhZGp1c3RHcm91cFByaWNlIH0gPSBzaG9wcGluZ0xpc3Q7XG5cbiAgICAgICAgICAgIC8vIOaJvuWIsGJhc2Vfc3RhdHVzOiAwIOeahOWQjOWVhuWTgeiuouWNlVxuICAgICAgICAgICAgY29uc3Qgb3JkZXJzJCA9IGF3YWl0IGRiLmNvbGxlY3Rpb24oJ29yZGVyJylcbiAgICAgICAgICAgICAgICAud2hlcmUoe1xuICAgICAgICAgICAgICAgICAgICB0aWQsXG4gICAgICAgICAgICAgICAgICAgIHBpZCxcbiAgICAgICAgICAgICAgICAgICAgc2lkLFxuICAgICAgICAgICAgICAgICAgICBiYXNlX3N0YXR1czogJzAnXG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAuZ2V0KCApO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICAvLyDorqLljZXmm7TmlrBcbiAgICAgICAgICAgIGF3YWl0IFByb21pc2UuYWxsKCBvcmRlcnMkLmRhdGEubWFwKCBvcmRlciA9PiB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGRiLmNvbGxlY3Rpb24oJ29yZGVyJylcbiAgICAgICAgICAgICAgICAgICAgLmRvYyggU3RyaW5nKCBvcmRlci5faWQgKSlcbiAgICAgICAgICAgICAgICAgICAgLnVwZGF0ZSh7XG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYWxsb2NhdGVkUHJpY2U6IGFkanVzdFByaWNlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFsbG9jYXRlZEdyb3VwUHJpY2U6IGFkanVzdEdyb3VwUHJpY2UsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYmFzZV9zdGF0dXM6ICcxJ1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgfSkpO1xuXG4gICAgICAgIH0pKTtcblxuICAgICAgICByZXR1cm4geyBzdGF0dXM6IDIwMCB9XG5cbiAgICB9IGNhdGNoICggZSApIHtcbiAgICAgICAgY29uc29sZS5sb2coJyEhISHlrprml7blmajorqLljZVwcmljZUZpeOmUmeivrycsKVxuICAgICAgICByZXR1cm4geyBzdGF0dXM6IDUwMCB9XG4gICAgfVxufVxuXG4vKipcbiAqIOiuouWNlTTvvJrmiYDmnInmiJDlip/mlK/ku5jlsL7mrL7nmoTorqLljZXvvIzmiopiYXNlX3N0YXR1c+iuvuS4ujNcbiAqL1xuZXhwb3J0IGNvbnN0IHBheUxhc3RGaXggPSBhc3luYyAoICkgPT4ge1xuICAgIHRyeSB7XG4gICAgICAgIFxuICAgICAgICBjb25zdCBvcmRlcnMkID0gYXdhaXQgZGIuY29sbGVjdGlvbignb3JkZXInKVxuICAgICAgICAgICAgLndoZXJlKHtcbiAgICAgICAgICAgICAgICBwYXlfc3RhdHVzOiAnMicsXG4gICAgICAgICAgICAgICAgYmFzZV9zdGF0dXM6IF8ub3IoIF8uZXEoJzAnKSwgXy5lcSgnMScpLCAgXy5lcSgnMicpKVxuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC5nZXQoICk7XG5cbiAgICAgICAgYXdhaXQgUHJvbWlzZS5hbGwoXG4gICAgICAgICAgICBvcmRlcnMkLmRhdGEubWFwKCBvcmRlciA9PiB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGRiLmNvbGxlY3Rpb24oJ29yZGVyJylcbiAgICAgICAgICAgICAgICAgICAgLmRvYyggU3RyaW5nKCBvcmRlci5faWQgKSlcbiAgICAgICAgICAgICAgICAgICAgLnVwZGF0ZSh7XG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYmFzZV9zdGF0dXM6ICczJ1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgfSlcbiAgICAgICAgKVxuICAgICAgICBcbiAgICB9IGNhdGNoICggZSApIHtcbiAgICAgICAgY29uc29sZS5sb2coJyEhISHlrprml7blmajorqLljZVwYXlMYXN0Rml46ZSZ6K+vJywpXG4gICAgICAgIHJldHVybiB7IHN0YXR1czogNTAwIH1cbiAgICB9XG59XG5cbi8qKlxuICog6K6i5Y2VNO+8muaWsOiuouWNleaOqOmAgVxuICovXG5leHBvcnQgY29uc3QgcHVzaE5ldyA9IGFzeW5jICggKSA9PiB7XG4gICAgdHJ5IHtcbiAgICAgICAgXG4gICAgICAgIC8vIDDjgIHliKTmlq3mmK/lkKblnKjpgqPlh6DkuKrml7bpl7TmiLPkuYvlhoVcbiAgICAgICAgY29uc3QgY2hlY2tJc0luUmFuZ2UgPSAoIHRzOiBudW1iZXIgKSA9PiB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyggdHMgKTtcbiAgICAgICAgICAgIGNvbnN0IG5vdyA9IG5ldyBEYXRlKCB0cyApO1xuICAgICAgICAgICAgY29uc3QgcmFuZ2UgPSBbXG4gICAgICAgICAgICAgICAgNyxcbiAgICAgICAgICAgICAgICAxMixcbiAgICAgICAgICAgICAgICAyMixcbiAgICAgICAgICAgICAgICAwLFxuICAgICAgICAgICAgXTtcblxuICAgICAgICAgICAgY29uc29sZS5sb2coJz09PScsIHRzLCBub3cuZ2V0VGltZSggKSwgbm93LnRvTG9jYWxlU3RyaW5nKCApKTtcbiAgICAgICAgICAgIHJldHVybiByYW5nZS5zb21lKCB4ID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCBoID0gbm93LmdldEhvdXJzKCApO1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCB4LCBoLCBub3cuZ2V0TWludXRlcyggKSlcbiAgICAgICAgICAgICAgICByZXR1cm4geCA9PT0gaCAmJiBub3cuZ2V0TWludXRlcyggKSA9PT0gMzA7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnNvbGUubG9nKCchISEhISDmlrDorqLljZXmjqjpgIEnICk7XG4gICAgICAgIGlmICggIWNoZWNrSXNJblJhbmdlKCBEYXRlLm5vdyggKSkpIHsgXG4gICAgICAgICAgICByZXR1cm4geyBzdGF0dXM6IDIwMCB9O1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gMeOAgeiOt+WPlmN1cnJlbnQgdHJpcFxuICAgICAgICBjb25zdCB0cmlwcyQgPSBhd2FpdCBjbG91ZC5jYWxsRnVuY3Rpb24oe1xuICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICR1cmw6ICdlbnRlcidcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBuYW1lOiAndHJpcCdcbiAgICAgICAgfSk7XG4gICAgICAgIGNvbnN0IHRyaXBzID0gdHJpcHMkLnJlc3VsdC5kYXRhO1xuICAgICAgICBjb25zdCB0cmlwID0gdHJpcHNbIDAgXTtcblxuICAgICAgICBjb25zb2xlLmxvZygnISEhISEgdHJpcCcsIHRyaXAgKTtcblxuICAgICAgICAvLyAy44CB6I635Y+WIHB1c2g6IHRydWUg55qE566h55CG5ZGYXG4gICAgICAgIGNvbnN0IG1lbWJlcnMgPSBhd2FpdCBkYi5jb2xsZWN0aW9uKCdtYW5hZ2VyLW1lbWJlcicpXG4gICAgICAgICAgICAud2hlcmUoe1xuICAgICAgICAgICAgICAgIHB1c2g6IHRydWVcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAuZ2V0KCApO1xuXG4gICAgICAgIGlmICggIXRyaXAgfHwgbWVtYmVycy5kYXRhLmxlbmd0aCA9PT0gMCApIHtcbiAgICAgICAgICAgIHJldHVybiB7IHN0YXR1czogMjAwIH07XG4gICAgICAgIH1cblxuICAgICAgICBjb25zb2xlLmxvZygnISEhISEgbWVtYmVycy5kYXRhJywgbWVtYmVycy5kYXRhICk7XG5cbiAgICAgICAgYXdhaXQgUHJvbWlzZS5hbGwoXG4gICAgICAgICAgICBtZW1iZXJzLmRhdGEubWFwKCBhc3luYyBtZW1iZXIgPT4ge1xuICAgICAgICAgICAgICAgIGxldCBjb3VudCA9IDA7XG4gICAgICAgICAgICAgICAgY29uc3QgeyBvcGVuaWQgfSA9IG1lbWJlclxuXG4gICAgICAgICAgICAgICAgLy8gM+OAgeiOt+WPluS4iuasoea1j+iniOiuouWNleeahOaXtumXtOaIs1xuICAgICAgICAgICAgICAgIGNvbnN0IGNvbmZpZyQgPSBhd2FpdCBkYi5jb2xsZWN0aW9uKCdhbmFseXNlLWRhdGEnKVxuICAgICAgICAgICAgICAgICAgICAud2hlcmUoe1xuICAgICAgICAgICAgICAgICAgICAgICAgb3BlbmlkLFxuICAgICAgICAgICAgICAgICAgICAgICAgdGlkOiB0cmlwLl9pZCxcbiAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6ICdtYW5hZ2VyLXRyaXAtb3JkZXItdmlzaXQnXG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgIC5nZXQoICk7XG4gICAgICAgICAgICAgICAgY29uc3QgY29uZmlnID0gY29uZmlnJC5kYXRhWyAwIF07XG5cbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnISEhISEgY29uZmlnJywgY29uZmlnICk7XG5cbiAgICAgICAgICAgICAgICBsZXQgcXVlcnk6IGFueSA9IHtcbiAgICAgICAgICAgICAgICAgICAgdGlkOiB0cmlwLl9pZCxcbiAgICAgICAgICAgICAgICAgICAgcGF5X3N0YXR1czogXy5uZXEoJzAnKSxcbiAgICAgICAgICAgICAgICAgICAgYmFzZV9zdGF0dXM6IF8ub3IoIF8uZXEoJzAnKSwgXy5lcSgnMScpLCBfLmVxKCcyJykpXG4gICAgICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgICAgIGlmICggISFjb25maWcgKSB7XG4gICAgICAgICAgICAgICAgICAgIHF1ZXJ5ID0gT2JqZWN0LmFzc2lnbih7IH0sIHF1ZXJ5LCB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjcmVhdGVUaW1lOiBfLmd0ZSggY29uZmlnLnZhbHVlIClcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgLy8gNOOAgeiwg+eUqOaOqOmAgVxuICAgICAgICAgICAgICAgIGNvbnN0IGNvdW50JCA9IGF3YWl0IGRiLmNvbGxlY3Rpb24oJ29yZGVyJylcbiAgICAgICAgICAgICAgICAgICAgICAgIC53aGVyZSggcXVlcnkgKVxuICAgICAgICAgICAgICAgICAgICAgICAgLmNvdW50KCApO1xuICAgICAgICAgICAgICAgIGNvdW50ID0gY291bnQkLnRvdGFsO1xuXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coJyEhISEhIGNvdW50JywgY291bnQgKTtcblxuICAgICAgICAgICAgICAgIGlmICggY291bnQgPT09IDAgKSB7IFxuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgLy8gNOOAgeiwg+eUqOaOqOmAgVxuICAgICAgICAgICAgICAgIGNvbnN0IHB1c2gkID0gYXdhaXQgY2xvdWQuY2FsbEZ1bmN0aW9uKHtcbiAgICAgICAgICAgICAgICAgICAgbmFtZTogJ2NvbW1vbicsXG4gICAgICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICR1cmw6ICdwdXNoLXRlbXBsYXRlJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvcGVuaWQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogJ25ld09yZGVyJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYWdlOiAncGFnZXMvbWFuYWdlci10cmlwLWxpc3QvaW5kZXgnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRleHRzOiBbYOS9oOaciSR7Y291bnR95p2h5paw6K6i5Y2VYCwgYOeCueWHu+afpeeci2BdXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCAnPT09PSBwdXNoJywgcHVzaCQucmVzdWx0IClcblxuICAgICAgICAgICAgICAgIC8vIDXjgIHmm7TmlrDjgIHliJvlu7rphY3nva5cbiAgICAgICAgICAgICAgICBpZiAoIHB1c2gkLnJlc3VsdC5zdGF0dXMgPT09IDIwMCApIHtcblxuICAgICAgICAgICAgICAgICAgICBpZiAoICEhY29uZmlnICkge1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyggJz09PT09PT0nIClcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIOabtOaWsOS4gOS4i+atpOadoemFjee9rlxuICAgICAgICAgICAgICAgICAgICAgICAgYXdhaXQgZGIuY29sbGVjdGlvbignYW5hbHlzZS1kYXRhJylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAuZG9jKCBTdHJpbmcoIGNvbmZpZy5faWQgKSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAudXBkYXRlKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU6IG5ldyBEYXRlKCApLmdldFRpbWUoIClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8g5Yib5bu65LiA5LiL6YWN572uXG4gICAgICAgICAgICAgICAgICAgICAgICBhd2FpdCBkYi5jb2xsZWN0aW9uKCdhbmFseXNlLWRhdGEnKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5hZGQoe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvcGVuaWQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aWQ6IHRyaXAuX2lkLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogJ21hbmFnZXItdHJpcC1vcmRlci12aXNpdCcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZTogbmV3IERhdGUoICkuZ2V0VGltZSggKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICByZXR1cm47XG5cbiAgICAgICAgICAgIH0pXG4gICAgICAgICk7XG4gICAgICAgIFxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgc3RhdHVzOiAyMDBcbiAgICAgICAgfTtcblxuICAgIH0gY2F0Y2ggKCBlICkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgc3RhdHVzOiA1MDAsXG4gICAgICAgICAgICBtZXNzYWdlOiB0eXBlb2YgZSA9PT0gJ3N0cmluZycgPyBlIDogSlNPTi5zdHJpbmdpZnkoIGUgKVxuICAgICAgICB9XG4gICAgfVxufSJdfQ==