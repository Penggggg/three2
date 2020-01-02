"use strict";
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
exports.catchLostOrders = function () { return __awaiter(void 0, void 0, void 0, function () {
    var trips$, currentTrip, tid_1, find1$, find2$, tripShoppingList_1, e_1;
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
                    return [2, { status: 200 }];
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
                        return new Promise(function (resolve, reject) { return __awaiter(void 0, void 0, void 0, function () {
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
exports.removeUselessOrders = function () { return __awaiter(void 0, void 0, void 0, function () {
    var trips$, currentTrip, tid, uselessOrders$, e_3;
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
                return [4, Promise.all(uselessOrders$.data.map(function (order) { return __awaiter(void 0, void 0, void 0, function () {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLHFDQUF1QztBQUV2QyxLQUFLLENBQUMsSUFBSSxDQUFDO0lBQ1AsR0FBRyxFQUFFLE9BQU8sQ0FBQyxHQUFHLENBQUMsS0FBSztDQUN6QixDQUFDLENBQUM7QUFFSCxJQUFNLEVBQUUsR0FBZ0IsS0FBSyxDQUFDLFFBQVEsRUFBRyxDQUFDO0FBQzFDLElBQU0sQ0FBQyxHQUFHLEVBQUUsQ0FBQyxPQUFPLENBQUM7QUFRckIsSUFBTSxNQUFNLEdBQUcsVUFBRSxFQUFVO0lBQVYsbUJBQUEsRUFBQSxVQUFVO0lBQ3ZCLElBQUssRUFBRSxFQUFHO1FBQ04sT0FBTyxJQUFJLENBQUMsR0FBRyxFQUFHLENBQUM7S0FDdEI7SUFDRCxJQUFNLE1BQU0sR0FBRyxJQUFJLElBQUksQ0FBRSxJQUFJLElBQUksRUFBRyxDQUFDLGNBQWMsRUFBRyxDQUFDLENBQUM7SUFDeEQsT0FBTyxJQUFJLElBQUksQ0FBRSxNQUFNLENBQUMsT0FBTyxFQUFHLEdBQUcsQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsSUFBSSxDQUFFLENBQUE7QUFDN0QsQ0FBQyxDQUFBO0FBRUQsSUFBTSxjQUFjLEdBQUcsVUFBRSxHQUFTLEVBQUUsS0FBYztJQUFkLHNCQUFBLEVBQUEsU0FBVSxFQUFFLENBQUU7SUFDOUMsT0FBTyxLQUFLLENBQUMsSUFBSSxDQUFFLFVBQUEsQ0FBQztRQUNoQixJQUFNLENBQUMsR0FBRyxHQUFHLENBQUMsUUFBUSxFQUFHLENBQUM7UUFDMUIsT0FBTyxDQUFDLEtBQUssQ0FBQyxJQUFJLEdBQUcsQ0FBQyxVQUFVLEVBQUcsS0FBSyxDQUFDLENBQUM7SUFDOUMsQ0FBQyxDQUFDLENBQUM7QUFDUCxDQUFDLENBQUE7QUFLWSxRQUFBLGVBQWUsR0FBRzs7Ozs7O2dCQUlSLFdBQU0sS0FBSyxDQUFDLFlBQVksQ0FBQzt3QkFDcEMsSUFBSSxFQUFFLE1BQU07d0JBQ1osSUFBSSxFQUFFOzRCQUNGLElBQUksRUFBRSxPQUFPO3lCQUNoQjtxQkFDSixDQUFDLEVBQUE7O2dCQUxJLE1BQU0sR0FBRyxTQUtiO2dCQUNJLFdBQVcsR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBRSxDQUFDLENBQUUsQ0FBQztnQkFFNUMsSUFBSyxDQUFDLFdBQVcsRUFBRztvQkFDaEIsV0FBTyxFQUFFLE1BQU0sRUFBRSxHQUFHLEVBQUUsRUFBQztpQkFDMUI7Z0JBRUssUUFBTSxXQUFXLENBQUMsR0FBRyxDQUFDO2dCQUdiLFdBQU0sRUFBRSxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUM7eUJBQ3RDLEtBQUssQ0FBQzt3QkFDSCxHQUFHLE9BQUE7d0JBQ0gsVUFBVSxFQUFFLEdBQUc7d0JBQ2YsV0FBVyxFQUFFLEdBQUc7cUJBQ25CLENBQUM7eUJBQ0QsR0FBRyxFQUFHLEVBQUE7O2dCQU5MLE1BQU0sR0FBRyxTQU1KO2dCQUVYLElBQUssTUFBTSxDQUFDLElBQUksQ0FBQyxNQUFNLEtBQUssQ0FBQyxFQUFHO29CQUM1QixXQUFPOzRCQUNILE1BQU0sRUFBRSxHQUFHO3lCQUNkLEVBQUE7aUJBQ0o7Z0JBR2MsV0FBTSxFQUFFLENBQUMsVUFBVSxDQUFDLGVBQWUsQ0FBQzt5QkFDOUMsS0FBSyxDQUFDO3dCQUNILEdBQUcsT0FBQTtxQkFDTixDQUFDO3lCQUNELEdBQUcsRUFBRyxFQUFBOztnQkFKTCxNQUFNLEdBQUcsU0FJSjtnQkFFTCxxQkFBbUIsTUFBTSxDQUFDLElBQUksQ0FBQztnQkFRckMsV0FBTSxPQUFPLENBQUMsR0FBRyxDQUFFLE1BQU0sQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFFLFVBQUEsS0FBSzt3QkFDckMsT0FBTyxJQUFJLE9BQU8sQ0FBRSxVQUFRLE9BQU8sRUFBRSxNQUFNOzs7Ozs7d0NBRTNCLFFBQW1ELEtBQUssSUFBckQsRUFBRSxRQUE4QyxLQUFLLElBQWhELEVBQUUsUUFBeUMsS0FBSyxJQUEzQyxFQUFFLFNBQW9DLEtBQUssS0FBckMsRUFBRSxNQUFNLEdBQXdCLEtBQUssT0FBN0IsRUFBRSxLQUFLLEdBQWlCLEtBQUssTUFBdEIsRUFBRSxVQUFVLEdBQUssS0FBSyxXQUFWLENBQVc7d0NBQzNELHVCQUF1QixHQUFHLGtCQUFnQixDQUFDLElBQUksQ0FBRSxVQUFBLENBQUM7NENBQ3BELE9BQUEsQ0FBQyxDQUFDLEdBQUcsS0FBSyxLQUFHO2dEQUNiLENBQUMsQ0FBQyxHQUFHLEtBQUssS0FBRztnREFDYixDQUFDLENBQUMsSUFBSSxLQUFLLE1BQUk7d0NBRmYsQ0FFZSxDQUNsQixDQUFDOzZDQUlFLENBQUEsQ0FBRSxDQUFDLHVCQUF1QixDQUFFOzRDQUM1QixDQUFFLENBQUMsQ0FBQyx1QkFBdUIsSUFBSSxDQUFDLHVCQUF1QixDQUFDLElBQUksQ0FBQyxJQUFJLENBQUUsVUFBQSxDQUFDLElBQUksT0FBQSxDQUFDLEtBQUssS0FBRyxFQUFULENBQVMsQ0FBRSxDQUFFLENBQUEsRUFEckYsY0FDcUY7d0NBRXJGLFdBQU0sS0FBSyxDQUFDLFlBQVksQ0FBQztnREFDckIsSUFBSSxFQUFFLGVBQWU7Z0RBQ3JCLElBQUksRUFBRTtvREFDRixJQUFJLEVBQUUsUUFBUTtvREFDZCxJQUFJLEVBQUU7d0RBQ0YsTUFBTSxFQUFFLE1BQU07d0RBQ2QsSUFBSSxFQUFFLENBQUM7Z0VBQ0gsR0FBRyxPQUFBO2dFQUNILEdBQUcsT0FBQTtnRUFDSCxHQUFHLE9BQUE7Z0VBQ0gsSUFBSSxRQUFBO2dFQUNKLEtBQUssT0FBQTtnRUFDTCxVQUFVLFlBQUE7Z0VBQ1YsR0FBRyxFQUFFLEtBQUc7NkRBQ1gsQ0FBQztxREFDTDtpREFDSjs2Q0FDSixDQUFDLEVBQUE7O3dDQWpCRixTQWlCRSxDQUFDO3dDQUNILE9BQU8sRUFBRyxDQUFDOzs7d0NBR2YsT0FBTyxFQUFHLENBQUM7Ozs7d0NBRVgsT0FBTyxFQUFHLENBQUM7Ozs7OzZCQUVsQixDQUFDLENBQUM7b0JBQ1AsQ0FBQyxDQUFDLENBQUMsRUFBQTs7Z0JBekNILFNBeUNHLENBQUM7Z0JBRUosV0FBTzt3QkFDSCxNQUFNLEVBQUUsR0FBRztxQkFDZCxFQUFBOzs7Z0JBR0QsT0FBTyxDQUFDLEdBQUcsQ0FBQyw0QkFBNEIsRUFBRSxHQUFDLENBQUUsQ0FBQztnQkFDOUMsV0FBTyxFQUFFLE1BQU0sRUFBRSxHQUFHLEVBQUUsRUFBQzs7OztLQUU5QixDQUFBO0FBR1ksUUFBQSxtQkFBbUIsR0FBRzs7Ozs7O2dCQUlaLFdBQU0sS0FBSyxDQUFDLFlBQVksQ0FBQzt3QkFDcEMsSUFBSSxFQUFFLE1BQU07d0JBQ1osSUFBSSxFQUFFOzRCQUNGLElBQUksRUFBRSxPQUFPO3lCQUNoQjtxQkFDSixDQUFDLEVBQUE7O2dCQUxJLE1BQU0sR0FBRyxTQUtiO2dCQUVJLFdBQVcsR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBRSxDQUFDLENBQUUsQ0FBQztnQkFFNUMsSUFBSyxDQUFDLFdBQVcsRUFBRztvQkFDaEIsV0FBTzs0QkFDSCxNQUFNLEVBQUUsR0FBRzt5QkFDZCxFQUFBO2lCQUNKO2dCQUVLLEdBQUcsR0FBRyxXQUFXLENBQUMsR0FBRyxDQUFDO2dCQUVMLFdBQU0sRUFBRSxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUM7eUJBQzlDLEtBQUssQ0FBQzt3QkFDSCxHQUFHLEtBQUE7d0JBQ0gsV0FBVyxFQUFFLEdBQUc7cUJBQ25CLENBQUM7eUJBQ0QsR0FBRyxFQUFHLEVBQUE7O2dCQUxMLGNBQWMsR0FBRyxTQUtaO2dCQUVYLFdBQU0sT0FBTyxDQUFDLEdBQUcsQ0FBRSxjQUFjLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBRSxVQUFNLEtBQUs7Ozs7O29DQUM3QyxPQUFPLEdBQUcsS0FBSyxDQUFDLEdBQUcsQ0FBQztvQ0FDbEIsR0FBRyxHQUFlLEtBQUssSUFBcEIsRUFBRSxHQUFHLEdBQVUsS0FBSyxJQUFmLEVBQUUsR0FBRyxHQUFLLEtBQUssSUFBVixDQUFXO29DQUU1QixNQUFNLEdBQUc7d0NBQ1QsR0FBRyxLQUFBO3dDQUNILEdBQUcsS0FBQTtxQ0FDTixDQUFDO29DQUVGLElBQUssQ0FBQyxDQUFDLEdBQUcsRUFBRzt3Q0FDVCxNQUFNLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQyxFQUFHLEVBQUUsTUFBTSxFQUFFOzRDQUNoQyxHQUFHLEtBQUE7eUNBQ04sQ0FBQyxDQUFDO3FDQUNOO29DQUVxQixXQUFNLEVBQUUsQ0FBQyxVQUFVLENBQUMsZUFBZSxDQUFDOzZDQUNyRCxLQUFLLENBQUUsTUFBTSxDQUFFOzZDQUNmLEdBQUcsRUFBRyxFQUFBOztvQ0FGTCxhQUFhLEdBQUcsU0FFWDtvQ0FDTCxlQUFlLEdBQUcsYUFBYSxDQUFDLElBQUksQ0FBRSxDQUFDLENBQUUsQ0FBQztvQ0FFaEQsSUFBSyxDQUFDLGVBQWUsRUFBRzt3Q0FBRSxXQUFPO3FDQUFFO29DQUUzQixJQUFJLEdBQUssZUFBZSxLQUFwQixDQUFxQjtvQ0FDM0IsVUFBVSxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUUsVUFBQSxDQUFDLElBQUksT0FBQSxDQUFDLEtBQUssT0FBTyxFQUFiLENBQWEsQ0FBRSxDQUFDO3lDQUVuRCxDQUFBLFVBQVUsS0FBSyxDQUFDLENBQUMsQ0FBQSxFQUFqQixjQUFpQjtvQ0FDbEIsSUFBSSxDQUFDLE1BQU0sQ0FBRSxVQUFVLEVBQUUsQ0FBQyxDQUFFLENBQUE7b0NBQzVCLFdBQU0sRUFBRSxDQUFDLFVBQVUsQ0FBRSxlQUFlLENBQUU7NkNBQ2pDLEdBQUcsQ0FBRSxNQUFNLENBQUUsZUFBZSxDQUFDLEdBQUcsQ0FBRSxDQUFDOzZDQUNuQyxNQUFNLENBQUM7NENBQ0osSUFBSSxFQUFFO2dEQUNGLElBQUksTUFBQTs2Q0FDUDt5Q0FDSixDQUFDLEVBQUE7O29DQU5OLFNBTU0sQ0FBQTtvQ0FDTixXQUFPO3dDQUVYLFdBQU87Ozt5QkFDVixDQUFDLENBQUMsRUFBQTs7Z0JBckNILFNBcUNHLENBQUM7Ozs7Z0JBSUosV0FBTyxFQUFFLE1BQU0sRUFBRSxHQUFHLEVBQUUsRUFBQTs7OztLQUU3QixDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgY2xvdWQgZnJvbSAnd3gtc2VydmVyLXNkayc7XG5cbmNsb3VkLmluaXQoe1xuICAgIGVudjogcHJvY2Vzcy5lbnYuY2xvdWRcbn0pO1xuXG5jb25zdCBkYjogREIuRGF0YWJhc2UgPSBjbG91ZC5kYXRhYmFzZSggKTtcbmNvbnN0IF8gPSBkYi5jb21tYW5kO1xuXG4vKiogXG4gKiDovazmjaLmoLzmnpflsLzmsrvml7bljLogKzjml7bljLpcbiAqIERhdGUoKS5ub3coKSAvIG5ldyBEYXRlKCkuZ2V0VGltZSgpIOaYr+aXtuS4jeaXtuato+W4uOeahCs4XG4gKiBEYXRlLnRvTG9jYWxTdHJpbmcoICkg5aW95YOP5piv5LiA55u05pivKzDnmoRcbiAqIOWFiOaLv+WIsCArMO+8jOeEtuWQjis4XG4gKi9cbmNvbnN0IGdldE5vdyA9ICggdHMgPSBmYWxzZSApOiBhbnkgPT4ge1xuICAgIGlmICggdHMgKSB7XG4gICAgICAgIHJldHVybiBEYXRlLm5vdyggKTtcbiAgICB9XG4gICAgY29uc3QgdGltZV8wID0gbmV3IERhdGUoIG5ldyBEYXRlKCApLnRvTG9jYWxlU3RyaW5nKCApKTtcbiAgICByZXR1cm4gbmV3IERhdGUoIHRpbWVfMC5nZXRUaW1lKCApICsgOCAqIDYwICogNjAgKiAxMDAwIClcbn1cblxuY29uc3QgY2hlY2tJc0luUmFuZ2UgPSAoIG5vdzogRGF0ZSwgcmFuZ2UgPSBbIDk5IF0pID0+IHtcbiAgICByZXR1cm4gcmFuZ2Uuc29tZSggeCA9PiB7XG4gICAgICAgIGNvbnN0IGggPSBub3cuZ2V0SG91cnMoICk7XG4gICAgICAgIHJldHVybiB4ID09PSBoICYmIG5vdy5nZXRNaW51dGVzKCApID09PSAwO1xuICAgIH0pO1xufVxuXG4vKipcbiAqIOa4heWNlTHvvJrmn6Xor6LmnKrooqvlronmjpLov5vmuIXljZXnmoTorqLljZXvvIggcGF5X3N0YXR1czogMSDnmoRvcmRlciDvvIlcbiAqL1xuZXhwb3J0IGNvbnN0IGNhdGNoTG9zdE9yZGVycyA9IGFzeW5jICggKSA9PiB7XG4gICAgdHJ5IHtcblxuICAgICAgICAvLyDojrflj5blvZPliY3ov5vooYzkuK3nmoTooYznqItcbiAgICAgICAgY29uc3QgdHJpcHMkID0gYXdhaXQgY2xvdWQuY2FsbEZ1bmN0aW9uKHtcbiAgICAgICAgICAgIG5hbWU6ICd0cmlwJyxcbiAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAkdXJsOiAnZW50ZXInXG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICBjb25zdCBjdXJyZW50VHJpcCA9IHRyaXBzJC5yZXN1bHQuZGF0YVsgMCBdO1xuICAgICAgICBcbiAgICAgICAgaWYgKCAhY3VycmVudFRyaXAgKSB7IFxuICAgICAgICAgICAgcmV0dXJuIHsgc3RhdHVzOiAyMDAgfTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IHRpZCA9IGN1cnJlbnRUcmlwLl9pZDtcblxuICAgICAgICAvLyDmi7/liLDmiYDmnInor6XooYznqIvkuIvnmoTlt7Lku5jorqLph5HorqLljZXjgIHln7rmnKznirbmgIHkuLow55qE6K6i5Y2VXG4gICAgICAgIGNvbnN0IGZpbmQxJCA9IGF3YWl0IGRiLmNvbGxlY3Rpb24oJ29yZGVyJylcbiAgICAgICAgICAgIC53aGVyZSh7XG4gICAgICAgICAgICAgICAgdGlkLFxuICAgICAgICAgICAgICAgIHBheV9zdGF0dXM6ICcxJyxcbiAgICAgICAgICAgICAgICBiYXNlX3N0YXR1czogJzAnXG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLmdldCggKTtcblxuICAgICAgICBpZiAoIGZpbmQxJC5kYXRhLmxlbmd0aCA9PT0gMCApIHsgXG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIHN0YXR1czogMjAwXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvLyDmi7/liLDor6XooYznqIvkuIvnmoTotK3nianmuIXljZVcbiAgICAgICAgY29uc3QgZmluZDIkID0gYXdhaXQgZGIuY29sbGVjdGlvbignc2hvcHBpbmctbGlzdCcpXG4gICAgICAgICAgICAud2hlcmUoe1xuICAgICAgICAgICAgICAgIHRpZFxuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC5nZXQoICk7XG5cbiAgICAgICAgY29uc3QgdHJpcFNob3BwaW5nTGlzdCA9IGZpbmQyJC5kYXRhOyBcbiAgICAgICAgXG4gICAgICAgIC8qKlxuICAgICAgICAgKiDot5/muIXljZXov5vooYzljLnphY1cbiAgICAgICAgICogMS4g6K+l6K6i5Y2V55qE5ZWG5ZOBL+Wei+WPt+i/mOayoeacieS7u+S9lea4heWNlVxuICAgICAgICAgKiAyLiDor6XorqLljZXmsqHmnInlnKjlt7LmnInlkIzmrL7llYblk4Ev5Z6L5Y+355qE5riF5Y2V6YeM6Z2iXG4gICAgICAgICAqL1xuXG4gICAgICAgIGF3YWl0IFByb21pc2UuYWxsKCBmaW5kMSQuZGF0YS5tYXAoIG9yZGVyID0+IHtcbiAgICAgICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSggYXN5bmMgKCByZXNvbHZlLCByZWplY3QgKSA9PiB7XG4gICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgeyBzaWQsIHBpZCwgX2lkLCBhY2lkLCBvcGVuaWQsIHByaWNlLCBncm91cFByaWNlIH0gPSBvcmRlcjtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgY3VycmVudEdvb2RTaG9wcGluZ0xpc3QgPSB0cmlwU2hvcHBpbmdMaXN0LmZpbmQoIHggPT4gXG4gICAgICAgICAgICAgICAgICAgICAgICB4LnNpZCA9PT0gc2lkICYmXG4gICAgICAgICAgICAgICAgICAgICAgICB4LnBpZCA9PT0gcGlkICYmXG4gICAgICAgICAgICAgICAgICAgICAgICB4LmFjaWQgPT09IGFjaWRcbiAgICAgICAgICAgICAgICAgICAgKTtcblxuICAgICAgICAgICAgICAgICAgICAvLyDlpoLmnpzmsqHmnInotK3nianmuIXljZXvvIzliJnliJvlu7pcbiAgICAgICAgICAgICAgICAgICAgLy8g5aaC5p6c5pyJ6LSt54mp5riF5Y2V44CB5L2G5piv5riF5Y2V6YeM6Z2i55qEb2lkc+ayoeacieWug++8jOWwseaPkuWFpeW5tuabtOaWsFxuICAgICAgICAgICAgICAgICAgICBpZiAoKCAhY3VycmVudEdvb2RTaG9wcGluZ0xpc3QgKSB8fFxuICAgICAgICAgICAgICAgICAgICAgICAgKCAhIWN1cnJlbnRHb29kU2hvcHBpbmdMaXN0ICYmICFjdXJyZW50R29vZFNob3BwaW5nTGlzdC5vaWRzLmZpbmQoIHggPT4geCA9PT0gX2lkICkgKSkge1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBhd2FpdCBjbG91ZC5jYWxsRnVuY3Rpb24oe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6ICdzaG9wcGluZy1saXN0JyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICR1cmw6ICdjcmVhdGUnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvcGVuSWQ6IG9wZW5pZCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxpc3Q6IFt7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGlkLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNpZCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwaWQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYWNpZCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcmljZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBncm91cFByaWNlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9pZDogX2lkXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXNvbHZlKCApO1xuICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgfSBcbiAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZSggKTtcbiAgICAgICAgICAgICAgICB9IGNhdGNoICggZSApIHtcbiAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZSggKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSkpO1xuICAgICAgICBcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHN0YXR1czogMjAwXG4gICAgICAgIH1cblxuICAgIH0gY2F0Y2ggKCBlICkge1xuICAgICAgICBjb25zb2xlLmxvZygnISEhIeWumuaXtuWZqOiuouWNlWNhdGNoTG9zdE9yZGVyc+mUmeivrycsIGUgKTtcbiAgICAgICAgcmV0dXJuIHsgc3RhdHVzOiA1MDAgfTtcbiAgICB9XG59XG5cbi8qKiDmuIXljZUyOiDmn6Xor6LmlK/ku5jorqLph5HotoXml7bnmoTorqLljZXvvIzlubbmiorlhbbku47otK3nianmuIXljZXkuK3ljrvmjokgKi9cbmV4cG9ydCBjb25zdCByZW1vdmVVc2VsZXNzT3JkZXJzID0gYXN5bmMgKCApID0+IHtcbiAgICB0cnkge1xuXG4gICAgICAgIC8vIOiOt+WPluW9k+WJjei/m+ihjOS4reeahOihjOeoi1xuICAgICAgICBjb25zdCB0cmlwcyQgPSBhd2FpdCBjbG91ZC5jYWxsRnVuY3Rpb24oe1xuICAgICAgICAgICAgbmFtZTogJ3RyaXAnLFxuICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICR1cmw6ICdlbnRlcidcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgY29uc3QgY3VycmVudFRyaXAgPSB0cmlwcyQucmVzdWx0LmRhdGFbIDAgXTtcbiAgICAgICAgXG4gICAgICAgIGlmICggIWN1cnJlbnRUcmlwICkgeyBcbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgc3RhdHVzOiAyMDBcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IHRpZCA9IGN1cnJlbnRUcmlwLl9pZDtcblxuICAgICAgICBjb25zdCB1c2VsZXNzT3JkZXJzJCA9IGF3YWl0IGRiLmNvbGxlY3Rpb24oJ29yZGVyJylcbiAgICAgICAgICAgIC53aGVyZSh7XG4gICAgICAgICAgICAgICAgdGlkLFxuICAgICAgICAgICAgICAgIGJhc2Vfc3RhdHVzOiAnNSdcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAuZ2V0KCApO1xuXG4gICAgICAgIGF3YWl0IFByb21pc2UuYWxsKCB1c2VsZXNzT3JkZXJzJC5kYXRhLm1hcCggYXN5bmMgb3JkZXIgPT4ge1xuICAgICAgICAgICAgY29uc3Qgb3JkZXJJZCA9IG9yZGVyLl9pZDtcbiAgICAgICAgICAgIGNvbnN0IHsgcGlkLCBzaWQsIHRpZCB9ID0gb3JkZXI7XG5cbiAgICAgICAgICAgIGxldCB3aGVyZSQgPSB7XG4gICAgICAgICAgICAgICAgcGlkLFxuICAgICAgICAgICAgICAgIHRpZFxuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgaWYgKCAhIXNpZCApIHtcbiAgICAgICAgICAgICAgICB3aGVyZSQgPSBPYmplY3QuYXNzaWduKHsgfSwgd2hlcmUkLCB7XG4gICAgICAgICAgICAgICAgICAgIHNpZFxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBjb25zdCBzaG9wcGluZ0xpc3QkID0gYXdhaXQgZGIuY29sbGVjdGlvbignc2hvcHBpbmctbGlzdCcpXG4gICAgICAgICAgICAgICAgLndoZXJlKCB3aGVyZSQgKVxuICAgICAgICAgICAgICAgIC5nZXQoICk7XG4gICAgICAgICAgICBjb25zdCB0aGVTaG9wcGluZ0xpc3QgPSBzaG9wcGluZ0xpc3QkLmRhdGFbIDAgXTtcblxuICAgICAgICAgICAgaWYgKCAhdGhlU2hvcHBpbmdMaXN0ICkgeyByZXR1cm47IH1cblxuICAgICAgICAgICAgY29uc3QgeyBvaWRzIH0gPSB0aGVTaG9wcGluZ0xpc3Q7XG4gICAgICAgICAgICBjb25zdCBvcmRlckluZGV4ID0gb2lkcy5maW5kSW5kZXgoIHggPT4geCA9PT0gb3JkZXJJZCApO1xuXG4gICAgICAgICAgICBpZiAoIG9yZGVySW5kZXggIT09IC0xICkge1xuICAgICAgICAgICAgICAgIG9pZHMuc3BsaWNlKCBvcmRlckluZGV4LCAxIClcbiAgICAgICAgICAgICAgICBhd2FpdCBkYi5jb2xsZWN0aW9uKCAnc2hvcHBpbmctbGlzdCcgKVxuICAgICAgICAgICAgICAgICAgICAuZG9jKCBTdHJpbmcoIHRoZVNob3BwaW5nTGlzdC5faWQgKSlcbiAgICAgICAgICAgICAgICAgICAgLnVwZGF0ZSh7XG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb2lkc1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfSkpO1xuXG5cbiAgICB9IGNhdGNoICggZSApIHtcbiAgICAgICAgcmV0dXJuIHsgc3RhdHVzOiA1MDAgfVxuICAgIH1cbn0iXX0=