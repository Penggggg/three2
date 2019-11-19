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
exports.catchLostOrders = function () { return __awaiter(_this, void 0, void 0, function () {
    var trips$, currentTrip, tid_1, find1$, find2$, tripShoppingList_1, e_1;
    var _this = this;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 5, , 6]);
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
                return [4, db.collection('order')
                        .where({
                        tid: tid_1,
                        pay_status: '1',
                        base_status: '0'
                    })
                        .get()];
            case 2:
                find1$ = _a.sent();
                if (find1$.data.length === 0) {
                    return [2, {
                            status: 200
                        }];
                }
                return [4, db.collection('shopping-list')
                        .where({
                        tid: tid_1
                    })
                        .get()];
            case 3:
                find2$ = _a.sent();
                tripShoppingList_1 = find2$.data;
                return [4, Promise.all(find1$.data.map(function (order) {
                        return new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
                            var sid_1, pid_1, _id_1, acid_1, openid, price, groupPrice, currentGoodShoppingList, e_2;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        _a.trys.push([0, 3, , 4]);
                                        sid_1 = order.sid, pid_1 = order.pid, _id_1 = order._id, acid_1 = order.acid, openid = order.openid, price = order.price, groupPrice = order.groupPrice;
                                        currentGoodShoppingList = tripShoppingList_1.find(function (x) {
                                            return x.sid === sid_1 &&
                                                x.pid === pid_1 &&
                                                x.acid === acid_1;
                                        });
                                        if (!((!currentGoodShoppingList) ||
                                            (!!currentGoodShoppingList && !currentGoodShoppingList.oids.find(function (x) { return x === _id_1; })))) return [3, 2];
                                        return [4, cloud.callFunction({
                                                name: 'shopping-list',
                                                data: {
                                                    $url: 'create',
                                                    data: {
                                                        openId: openid,
                                                        list: [{
                                                                tid: tid_1,
                                                                sid: sid_1,
                                                                pid: pid_1,
                                                                acid: acid_1,
                                                                price: price,
                                                                groupPrice: groupPrice,
                                                                oid: _id_1
                                                            }]
                                                    }
                                                }
                                            })];
                                    case 1:
                                        _a.sent();
                                        resolve();
                                        _a.label = 2;
                                    case 2:
                                        resolve();
                                        return [3, 4];
                                    case 3:
                                        e_2 = _a.sent();
                                        resolve();
                                        return [3, 4];
                                    case 4: return [2];
                                }
                            });
                        }); });
                    }))];
            case 4:
                _a.sent();
                return [2, {
                        status: 200
                    }];
            case 5:
                e_1 = _a.sent();
                console.log('!!!!定时器订单catchLostOrders错误', e_1);
                return [2, { status: 500 }];
            case 6: return [2];
        }
    });
}); };
exports.removeUselessOrders = function () { return __awaiter(_this, void 0, void 0, function () {
    var trips$, currentTrip, tid, uselessOrders$, e_3;
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
                tid = currentTrip._id;
                return [4, db.collection('order')
                        .where({
                        tid: tid,
                        base_status: '5'
                    })
                        .get()];
            case 2:
                uselessOrders$ = _a.sent();
                return [4, Promise.all(uselessOrders$.data.map(function (order) { return __awaiter(_this, void 0, void 0, function () {
                        var orderId, pid, sid, tid, where$, shoppingList$, theShoppingList, oids, orderIndex;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    orderId = order._id;
                                    pid = order.pid, sid = order.sid, tid = order.tid;
                                    where$ = {
                                        pid: pid,
                                        tid: tid
                                    };
                                    if (!!sid) {
                                        where$ = Object.assign({}, where$, {
                                            sid: sid
                                        });
                                    }
                                    return [4, db.collection('shopping-list')
                                            .where(where$)
                                            .get()];
                                case 1:
                                    shoppingList$ = _a.sent();
                                    theShoppingList = shoppingList$.data[0];
                                    if (!theShoppingList) {
                                        return [2];
                                    }
                                    oids = theShoppingList.oids;
                                    orderIndex = oids.findIndex(function (x) { return x === orderId; });
                                    if (!(orderIndex !== -1)) return [3, 3];
                                    oids.splice(orderIndex, 1);
                                    return [4, db.collection('shopping-list')
                                            .doc(String(theShoppingList._id))
                                            .update({
                                            data: {
                                                oids: oids
                                            }
                                        })];
                                case 2:
                                    _a.sent();
                                    return [2];
                                case 3: return [2];
                            }
                        });
                    }); }))];
            case 3:
                _a.sent();
                return [3, 5];
            case 4:
                e_3 = _a.sent();
                return [2, { status: 500 }];
            case 5: return [2];
        }
    });
}); };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSxpQkE0TEM7O0FBNUxELHFDQUF1QztBQUV2QyxLQUFLLENBQUMsSUFBSSxDQUFDO0lBQ1AsR0FBRyxFQUFFLE9BQU8sQ0FBQyxHQUFHLENBQUMsS0FBSztDQUN6QixDQUFDLENBQUM7QUFFSCxJQUFNLEVBQUUsR0FBZ0IsS0FBSyxDQUFDLFFBQVEsRUFBRyxDQUFDO0FBQzFDLElBQU0sQ0FBQyxHQUFHLEVBQUUsQ0FBQyxPQUFPLENBQUM7QUFLUixRQUFBLGVBQWUsR0FBRzs7Ozs7OztnQkFJUixXQUFNLEtBQUssQ0FBQyxZQUFZLENBQUM7d0JBQ3BDLElBQUksRUFBRSxNQUFNO3dCQUNaLElBQUksRUFBRTs0QkFDRixJQUFJLEVBQUUsT0FBTzt5QkFDaEI7cUJBQ0osQ0FBQyxFQUFBOztnQkFMSSxNQUFNLEdBQUcsU0FLYjtnQkFFSSxXQUFXLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUUsQ0FBQyxDQUFFLENBQUM7Z0JBRTVDLElBQUssQ0FBQyxXQUFXLEVBQUc7b0JBQ2hCLFdBQU87NEJBQ0gsTUFBTSxFQUFFLEdBQUc7eUJBQ2QsRUFBQTtpQkFDSjtnQkFFSyxRQUFNLFdBQVcsQ0FBQyxHQUFHLENBQUM7Z0JBR2IsV0FBTSxFQUFFLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQzt5QkFDdEMsS0FBSyxDQUFDO3dCQUNILEdBQUcsT0FBQTt3QkFDSCxVQUFVLEVBQUUsR0FBRzt3QkFDZixXQUFXLEVBQUUsR0FBRztxQkFDbkIsQ0FBQzt5QkFDRCxHQUFHLEVBQUcsRUFBQTs7Z0JBTkwsTUFBTSxHQUFHLFNBTUo7Z0JBRVgsSUFBSyxNQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sS0FBSyxDQUFDLEVBQUc7b0JBQzVCLFdBQU87NEJBQ0gsTUFBTSxFQUFFLEdBQUc7eUJBQ2QsRUFBQTtpQkFDSjtnQkFHYyxXQUFNLEVBQUUsQ0FBQyxVQUFVLENBQUMsZUFBZSxDQUFDO3lCQUM5QyxLQUFLLENBQUM7d0JBQ0gsR0FBRyxPQUFBO3FCQUNOLENBQUM7eUJBQ0QsR0FBRyxFQUFHLEVBQUE7O2dCQUpMLE1BQU0sR0FBRyxTQUlKO2dCQUVMLHFCQUFtQixNQUFNLENBQUMsSUFBSSxDQUFDO2dCQVFyQyxXQUFNLE9BQU8sQ0FBQyxHQUFHLENBQUUsTUFBTSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUUsVUFBQSxLQUFLO3dCQUNyQyxPQUFPLElBQUksT0FBTyxDQUFFLFVBQVEsT0FBTyxFQUFFLE1BQU07Ozs7Ozt3Q0FFM0IsUUFBbUQsS0FBSyxJQUFyRCxFQUFFLFFBQThDLEtBQUssSUFBaEQsRUFBRSxRQUF5QyxLQUFLLElBQTNDLEVBQUUsU0FBb0MsS0FBSyxLQUFyQyxFQUFFLE1BQU0sR0FBd0IsS0FBSyxPQUE3QixFQUFFLEtBQUssR0FBaUIsS0FBSyxNQUF0QixFQUFFLFVBQVUsR0FBSyxLQUFLLFdBQVYsQ0FBVzt3Q0FDM0QsdUJBQXVCLEdBQUcsa0JBQWdCLENBQUMsSUFBSSxDQUFFLFVBQUEsQ0FBQzs0Q0FDcEQsT0FBQSxDQUFDLENBQUMsR0FBRyxLQUFLLEtBQUc7Z0RBQ2IsQ0FBQyxDQUFDLEdBQUcsS0FBSyxLQUFHO2dEQUNiLENBQUMsQ0FBQyxJQUFJLEtBQUssTUFBSTt3Q0FGZixDQUVlLENBQ2xCLENBQUM7NkNBSUUsQ0FBQSxDQUFFLENBQUMsdUJBQXVCLENBQUU7NENBQzVCLENBQUUsQ0FBQyxDQUFDLHVCQUF1QixJQUFJLENBQUMsdUJBQXVCLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBRSxVQUFBLENBQUMsSUFBSSxPQUFBLENBQUMsS0FBSyxLQUFHLEVBQVQsQ0FBUyxDQUFFLENBQUUsQ0FBQSxFQURyRixjQUNxRjt3Q0FFckYsV0FBTSxLQUFLLENBQUMsWUFBWSxDQUFDO2dEQUNyQixJQUFJLEVBQUUsZUFBZTtnREFDckIsSUFBSSxFQUFFO29EQUNGLElBQUksRUFBRSxRQUFRO29EQUNkLElBQUksRUFBRTt3REFDRixNQUFNLEVBQUUsTUFBTTt3REFDZCxJQUFJLEVBQUUsQ0FBQztnRUFDSCxHQUFHLE9BQUE7Z0VBQ0gsR0FBRyxPQUFBO2dFQUNILEdBQUcsT0FBQTtnRUFDSCxJQUFJLFFBQUE7Z0VBQ0osS0FBSyxPQUFBO2dFQUNMLFVBQVUsWUFBQTtnRUFDVixHQUFHLEVBQUUsS0FBRzs2REFDWCxDQUFDO3FEQUNMO2lEQUNKOzZDQUNKLENBQUMsRUFBQTs7d0NBakJGLFNBaUJFLENBQUM7d0NBQ0gsT0FBTyxFQUFHLENBQUM7Ozt3Q0FHZixPQUFPLEVBQUcsQ0FBQzs7Ozt3Q0FFWCxPQUFPLEVBQUcsQ0FBQzs7Ozs7NkJBRWxCLENBQUMsQ0FBQztvQkFDUCxDQUFDLENBQUMsQ0FBQyxFQUFBOztnQkF6Q0gsU0F5Q0csQ0FBQztnQkFFSixXQUFPO3dCQUNILE1BQU0sRUFBRSxHQUFHO3FCQUNkLEVBQUE7OztnQkFHRCxPQUFPLENBQUMsR0FBRyxDQUFDLDRCQUE0QixFQUFFLEdBQUMsQ0FBRSxDQUFDO2dCQUM5QyxXQUFPLEVBQUUsTUFBTSxFQUFFLEdBQUcsRUFBRSxFQUFDOzs7O0tBRTlCLENBQUE7QUFHWSxRQUFBLG1CQUFtQixHQUFHOzs7Ozs7O2dCQUlaLFdBQU0sS0FBSyxDQUFDLFlBQVksQ0FBQzt3QkFDcEMsSUFBSSxFQUFFLE1BQU07d0JBQ1osSUFBSSxFQUFFOzRCQUNGLElBQUksRUFBRSxPQUFPO3lCQUNoQjtxQkFDSixDQUFDLEVBQUE7O2dCQUxJLE1BQU0sR0FBRyxTQUtiO2dCQUVJLFdBQVcsR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBRSxDQUFDLENBQUUsQ0FBQztnQkFFNUMsSUFBSyxDQUFDLFdBQVcsRUFBRztvQkFDaEIsV0FBTzs0QkFDSCxNQUFNLEVBQUUsR0FBRzt5QkFDZCxFQUFBO2lCQUNKO2dCQUVLLEdBQUcsR0FBRyxXQUFXLENBQUMsR0FBRyxDQUFDO2dCQUVMLFdBQU0sRUFBRSxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUM7eUJBQzlDLEtBQUssQ0FBQzt3QkFDSCxHQUFHLEtBQUE7d0JBQ0gsV0FBVyxFQUFFLEdBQUc7cUJBQ25CLENBQUM7eUJBQ0QsR0FBRyxFQUFHLEVBQUE7O2dCQUxMLGNBQWMsR0FBRyxTQUtaO2dCQUVYLFdBQU0sT0FBTyxDQUFDLEdBQUcsQ0FBRSxjQUFjLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBRSxVQUFNLEtBQUs7Ozs7O29DQUM3QyxPQUFPLEdBQUcsS0FBSyxDQUFDLEdBQUcsQ0FBQztvQ0FDbEIsR0FBRyxHQUFlLEtBQUssSUFBcEIsRUFBRSxHQUFHLEdBQVUsS0FBSyxJQUFmLEVBQUUsR0FBRyxHQUFLLEtBQUssSUFBVixDQUFXO29DQUU1QixNQUFNLEdBQUc7d0NBQ1QsR0FBRyxLQUFBO3dDQUNILEdBQUcsS0FBQTtxQ0FDTixDQUFDO29DQUVGLElBQUssQ0FBQyxDQUFDLEdBQUcsRUFBRzt3Q0FDVCxNQUFNLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQyxFQUFHLEVBQUUsTUFBTSxFQUFFOzRDQUNoQyxHQUFHLEtBQUE7eUNBQ04sQ0FBQyxDQUFDO3FDQUNOO29DQUVxQixXQUFNLEVBQUUsQ0FBQyxVQUFVLENBQUMsZUFBZSxDQUFDOzZDQUNyRCxLQUFLLENBQUUsTUFBTSxDQUFFOzZDQUNmLEdBQUcsRUFBRyxFQUFBOztvQ0FGTCxhQUFhLEdBQUcsU0FFWDtvQ0FDTCxlQUFlLEdBQUcsYUFBYSxDQUFDLElBQUksQ0FBRSxDQUFDLENBQUUsQ0FBQztvQ0FFaEQsSUFBSyxDQUFDLGVBQWUsRUFBRzt3Q0FBRSxXQUFPO3FDQUFFO29DQUUzQixJQUFJLEdBQUssZUFBZSxLQUFwQixDQUFxQjtvQ0FDM0IsVUFBVSxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUUsVUFBQSxDQUFDLElBQUksT0FBQSxDQUFDLEtBQUssT0FBTyxFQUFiLENBQWEsQ0FBRSxDQUFDO3lDQUVuRCxDQUFBLFVBQVUsS0FBSyxDQUFDLENBQUMsQ0FBQSxFQUFqQixjQUFpQjtvQ0FDbEIsSUFBSSxDQUFDLE1BQU0sQ0FBRSxVQUFVLEVBQUUsQ0FBQyxDQUFFLENBQUE7b0NBQzVCLFdBQU0sRUFBRSxDQUFDLFVBQVUsQ0FBRSxlQUFlLENBQUU7NkNBQ2pDLEdBQUcsQ0FBRSxNQUFNLENBQUUsZUFBZSxDQUFDLEdBQUcsQ0FBRSxDQUFDOzZDQUNuQyxNQUFNLENBQUM7NENBQ0osSUFBSSxFQUFFO2dEQUNGLElBQUksTUFBQTs2Q0FDUDt5Q0FDSixDQUFDLEVBQUE7O29DQU5OLFNBTU0sQ0FBQTtvQ0FDTixXQUFPO3dDQUVYLFdBQU87Ozt5QkFDVixDQUFDLENBQUMsRUFBQTs7Z0JBckNILFNBcUNHLENBQUM7Ozs7Z0JBSUosV0FBTyxFQUFFLE1BQU0sRUFBRSxHQUFHLEVBQUUsRUFBQTs7OztLQUU3QixDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgY2xvdWQgZnJvbSAnd3gtc2VydmVyLXNkayc7XG5cbmNsb3VkLmluaXQoe1xuICAgIGVudjogcHJvY2Vzcy5lbnYuY2xvdWRcbn0pO1xuXG5jb25zdCBkYjogREIuRGF0YWJhc2UgPSBjbG91ZC5kYXRhYmFzZSggKTtcbmNvbnN0IF8gPSBkYi5jb21tYW5kO1xuXG4vKipcbiAqIOa4heWNlTHvvJrmn6Xor6LmnKrooqvlronmjpLov5vmuIXljZXnmoTorqLljZXvvIhwYXlfc3RhdHVzOiAxIOeahG9yZGVy77yJXG4gKi9cbmV4cG9ydCBjb25zdCBjYXRjaExvc3RPcmRlcnMgPSBhc3luYyAoICkgPT4ge1xuICAgIHRyeSB7XG5cbiAgICAgICAgLy8g6I635Y+W5b2T5YmN6L+b6KGM5Lit55qE6KGM56iLXG4gICAgICAgIGNvbnN0IHRyaXBzJCA9IGF3YWl0IGNsb3VkLmNhbGxGdW5jdGlvbih7XG4gICAgICAgICAgICBuYW1lOiAndHJpcCcsXG4gICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgJHVybDogJ2VudGVyJ1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICBjb25zdCBjdXJyZW50VHJpcCA9IHRyaXBzJC5yZXN1bHQuZGF0YVsgMCBdO1xuICAgICAgICBcbiAgICAgICAgaWYgKCAhY3VycmVudFRyaXAgKSB7IFxuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBzdGF0dXM6IDIwMFxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgdGlkID0gY3VycmVudFRyaXAuX2lkO1xuXG4gICAgICAgIC8vIOaLv+WIsOaJgOacieivpeihjOeoi+S4i+eahOW3suS7mOiuoumHkeiuouWNleOAgeWfuuacrOeKtuaAgeS4ujDnmoTorqLljZVcbiAgICAgICAgY29uc3QgZmluZDEkID0gYXdhaXQgZGIuY29sbGVjdGlvbignb3JkZXInKVxuICAgICAgICAgICAgLndoZXJlKHtcbiAgICAgICAgICAgICAgICB0aWQsXG4gICAgICAgICAgICAgICAgcGF5X3N0YXR1czogJzEnLFxuICAgICAgICAgICAgICAgIGJhc2Vfc3RhdHVzOiAnMCdcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAuZ2V0KCApO1xuXG4gICAgICAgIGlmICggZmluZDEkLmRhdGEubGVuZ3RoID09PSAwICkgeyBcbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgc3RhdHVzOiAyMDBcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC8vIOaLv+WIsOivpeihjOeoi+S4i+eahOi0reeJqea4heWNlVxuICAgICAgICBjb25zdCBmaW5kMiQgPSBhd2FpdCBkYi5jb2xsZWN0aW9uKCdzaG9wcGluZy1saXN0JylcbiAgICAgICAgICAgIC53aGVyZSh7XG4gICAgICAgICAgICAgICAgdGlkXG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLmdldCggKTtcblxuICAgICAgICBjb25zdCB0cmlwU2hvcHBpbmdMaXN0ID0gZmluZDIkLmRhdGE7IFxuICAgICAgICBcbiAgICAgICAgLyoqXG4gICAgICAgICAqIOi3n+a4heWNlei/m+ihjOWMuemFjVxuICAgICAgICAgKiAxLiDor6XorqLljZXnmoTllYblk4Ev5Z6L5Y+36L+Y5rKh5pyJ5Lu75L2V5riF5Y2VXG4gICAgICAgICAqIDIuIOivpeiuouWNleayoeacieWcqOW3suacieWQjOasvuWVhuWTgS/lnovlj7fnmoTmuIXljZXph4zpnaJcbiAgICAgICAgICovXG5cbiAgICAgICAgYXdhaXQgUHJvbWlzZS5hbGwoIGZpbmQxJC5kYXRhLm1hcCggb3JkZXIgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKCBhc3luYyAoIHJlc29sdmUsIHJlamVjdCApID0+IHtcbiAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCB7IHNpZCwgcGlkLCBfaWQsIGFjaWQsIG9wZW5pZCwgcHJpY2UsIGdyb3VwUHJpY2UgfSA9IG9yZGVyO1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBjdXJyZW50R29vZFNob3BwaW5nTGlzdCA9IHRyaXBTaG9wcGluZ0xpc3QuZmluZCggeCA9PiBcbiAgICAgICAgICAgICAgICAgICAgICAgIHguc2lkID09PSBzaWQgJiZcbiAgICAgICAgICAgICAgICAgICAgICAgIHgucGlkID09PSBwaWQgJiZcbiAgICAgICAgICAgICAgICAgICAgICAgIHguYWNpZCA9PT0gYWNpZFxuICAgICAgICAgICAgICAgICAgICApO1xuXG4gICAgICAgICAgICAgICAgICAgIC8vIOWmguaenOayoeaciei0reeJqea4heWNle+8jOWImeWIm+W7ulxuICAgICAgICAgICAgICAgICAgICAvLyDlpoLmnpzmnInotK3nianmuIXljZXjgIHkvYbmmK/muIXljZXph4zpnaLnmoRvaWRz5rKh5pyJ5a6D77yM5bCx5o+S5YWl5bm25pu05pawXG4gICAgICAgICAgICAgICAgICAgIGlmICgoICFjdXJyZW50R29vZFNob3BwaW5nTGlzdCApIHx8XG4gICAgICAgICAgICAgICAgICAgICAgICAoICEhY3VycmVudEdvb2RTaG9wcGluZ0xpc3QgJiYgIWN1cnJlbnRHb29kU2hvcHBpbmdMaXN0Lm9pZHMuZmluZCggeCA9PiB4ID09PSBfaWQgKSApKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGF3YWl0IGNsb3VkLmNhbGxGdW5jdGlvbih7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogJ3Nob3BwaW5nLWxpc3QnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJHVybDogJ2NyZWF0ZScsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9wZW5JZDogb3BlbmlkLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGlzdDogW3tcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aWQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2lkLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBpZCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhY2lkLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHByaWNlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGdyb3VwUHJpY2UsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb2lkOiBfaWRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1dXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUoICk7XG4gICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICB9IFxuICAgICAgICAgICAgICAgICAgICByZXNvbHZlKCApO1xuICAgICAgICAgICAgICAgIH0gY2F0Y2ggKCBlICkge1xuICAgICAgICAgICAgICAgICAgICByZXNvbHZlKCApO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KSk7XG4gICAgICAgIFxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgc3RhdHVzOiAyMDBcbiAgICAgICAgfVxuXG4gICAgfSBjYXRjaCAoIGUgKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKCchISEh5a6a5pe25Zmo6K6i5Y2VY2F0Y2hMb3N0T3JkZXJz6ZSZ6K+vJywgZSApO1xuICAgICAgICByZXR1cm4geyBzdGF0dXM6IDUwMCB9O1xuICAgIH1cbn1cblxuLyoqIOa4heWNlTI6IOafpeivouaUr+S7mOiuoumHkei2heaXtueahOiuouWNle+8jOW5tuaKiuWFtuS7jui0reeJqea4heWNleS4reWOu+aOiSAqL1xuZXhwb3J0IGNvbnN0IHJlbW92ZVVzZWxlc3NPcmRlcnMgPSBhc3luYyAoICkgPT4ge1xuICAgIHRyeSB7XG5cbiAgICAgICAgLy8g6I635Y+W5b2T5YmN6L+b6KGM5Lit55qE6KGM56iLXG4gICAgICAgIGNvbnN0IHRyaXBzJCA9IGF3YWl0IGNsb3VkLmNhbGxGdW5jdGlvbih7XG4gICAgICAgICAgICBuYW1lOiAndHJpcCcsXG4gICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgJHVybDogJ2VudGVyJ1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICBjb25zdCBjdXJyZW50VHJpcCA9IHRyaXBzJC5yZXN1bHQuZGF0YVsgMCBdO1xuICAgICAgICBcbiAgICAgICAgaWYgKCAhY3VycmVudFRyaXAgKSB7IFxuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBzdGF0dXM6IDIwMFxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgdGlkID0gY3VycmVudFRyaXAuX2lkO1xuXG4gICAgICAgIGNvbnN0IHVzZWxlc3NPcmRlcnMkID0gYXdhaXQgZGIuY29sbGVjdGlvbignb3JkZXInKVxuICAgICAgICAgICAgLndoZXJlKHtcbiAgICAgICAgICAgICAgICB0aWQsXG4gICAgICAgICAgICAgICAgYmFzZV9zdGF0dXM6ICc1J1xuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC5nZXQoICk7XG5cbiAgICAgICAgYXdhaXQgUHJvbWlzZS5hbGwoIHVzZWxlc3NPcmRlcnMkLmRhdGEubWFwKCBhc3luYyBvcmRlciA9PiB7XG4gICAgICAgICAgICBjb25zdCBvcmRlcklkID0gb3JkZXIuX2lkO1xuICAgICAgICAgICAgY29uc3QgeyBwaWQsIHNpZCwgdGlkIH0gPSBvcmRlcjtcblxuICAgICAgICAgICAgbGV0IHdoZXJlJCA9IHtcbiAgICAgICAgICAgICAgICBwaWQsXG4gICAgICAgICAgICAgICAgdGlkXG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICBpZiAoICEhc2lkICkge1xuICAgICAgICAgICAgICAgIHdoZXJlJCA9IE9iamVjdC5hc3NpZ24oeyB9LCB3aGVyZSQsIHtcbiAgICAgICAgICAgICAgICAgICAgc2lkXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGNvbnN0IHNob3BwaW5nTGlzdCQgPSBhd2FpdCBkYi5jb2xsZWN0aW9uKCdzaG9wcGluZy1saXN0JylcbiAgICAgICAgICAgICAgICAud2hlcmUoIHdoZXJlJCApXG4gICAgICAgICAgICAgICAgLmdldCggKTtcbiAgICAgICAgICAgIGNvbnN0IHRoZVNob3BwaW5nTGlzdCA9IHNob3BwaW5nTGlzdCQuZGF0YVsgMCBdO1xuXG4gICAgICAgICAgICBpZiAoICF0aGVTaG9wcGluZ0xpc3QgKSB7IHJldHVybjsgfVxuXG4gICAgICAgICAgICBjb25zdCB7IG9pZHMgfSA9IHRoZVNob3BwaW5nTGlzdDtcbiAgICAgICAgICAgIGNvbnN0IG9yZGVySW5kZXggPSBvaWRzLmZpbmRJbmRleCggeCA9PiB4ID09PSBvcmRlcklkICk7XG5cbiAgICAgICAgICAgIGlmICggb3JkZXJJbmRleCAhPT0gLTEgKSB7XG4gICAgICAgICAgICAgICAgb2lkcy5zcGxpY2UoIG9yZGVySW5kZXgsIDEgKVxuICAgICAgICAgICAgICAgIGF3YWl0IGRiLmNvbGxlY3Rpb24oICdzaG9wcGluZy1saXN0JyApXG4gICAgICAgICAgICAgICAgICAgIC5kb2MoIFN0cmluZyggdGhlU2hvcHBpbmdMaXN0Ll9pZCApKVxuICAgICAgICAgICAgICAgICAgICAudXBkYXRlKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvaWRzXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9KSk7XG5cblxuICAgIH0gY2F0Y2ggKCBlICkge1xuICAgICAgICByZXR1cm4geyBzdGF0dXM6IDUwMCB9XG4gICAgfVxufSJdfQ==