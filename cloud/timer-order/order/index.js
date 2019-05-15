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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSxpQkE0S0M7O0FBNUtELHFDQUF1QztBQUV2QyxLQUFLLENBQUMsSUFBSSxDQUFDO0lBQ1AsR0FBRyxFQUFFLE9BQU8sQ0FBQyxHQUFHLENBQUMsS0FBSztDQUN6QixDQUFDLENBQUM7QUFFSCxJQUFNLEVBQUUsR0FBZ0IsS0FBSyxDQUFDLFFBQVEsRUFBRyxDQUFDO0FBQzFDLElBQU0sQ0FBQyxHQUFHLEVBQUUsQ0FBQyxPQUFPLENBQUM7QUFLUixRQUFBLFFBQVEsR0FBRzs7Ozs7OztnQkFHQSxXQUFNLEVBQUUsQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDO3lCQUN2QyxLQUFLLENBQUM7d0JBQ0gsVUFBVSxFQUFFLEdBQUc7d0JBQ2YsV0FBVyxFQUFFLEdBQUc7d0JBQ2hCLFVBQVUsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFFLElBQUksSUFBSSxFQUFHLENBQUMsT0FBTyxFQUFHLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxJQUFJLENBQUU7cUJBQy9ELENBQUM7eUJBQ0QsR0FBRyxFQUFHLEVBQUE7O2dCQU5MLE9BQU8sR0FBRyxTQU1MO2dCQUdYLFdBQU0sT0FBTyxDQUFDLEdBQUcsQ0FBRSxPQUFPLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBRSxVQUFBLEtBQUs7d0JBQ3RDLE9BQU8sRUFBRSxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUMsQ0FBQyxHQUFHLENBQUUsTUFBTSxDQUFFLEtBQUssQ0FBQyxHQUFHLENBQUUsQ0FBQzs2QkFDbEQsTUFBTSxDQUFDOzRCQUNKLElBQUksRUFBRTtnQ0FDRixXQUFXLEVBQUUsR0FBRzs2QkFDbkI7eUJBQ0osQ0FBQyxDQUFBO29CQUNWLENBQUMsQ0FBQyxDQUFDLEVBQUE7O2dCQVBILFNBT0csQ0FBQztnQkFHSixXQUFN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Q0FBQyxHQUFHLENBQUUsQ0FBQztpREFDekIsTUFBTSxDQUFDO2dEQUNKLElBQUksRUFBRTtvREFDRixjQUFjLEVBQUUsV0FBVztvREFDM0IsbUJBQW1CLEVBQUUsZ0JBQWdCO29EQUNyQyxXQUFXLEVBQUUsR0FBRztpREFDbkI7NkNBQ0osQ0FBQyxDQUFBO3dDQUNWLENBQUMsQ0FBQyxDQUFDLEVBQUE7O29DQVZILFNBVUcsQ0FBQzs7Ozt5QkFFUCxDQUFDLENBQUMsRUFBQTs7Z0JBM0JILFNBMkJHLENBQUM7Z0JBRUosV0FBTyxFQUFFLE1BQU0sRUFBRSxHQUFHLEVBQUUsRUFBQTs7O2dCQUd0QixPQUFPLENBQUMsR0FBRyxDQUFDLHFCQUFxQixDQUFFLENBQUE7Z0JBQ25DLFdBQU8sRUFBRSxNQUFNLEVBQUUsR0FBRyxFQUFFLEVBQUE7Ozs7S0FFN0IsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIGNsb3VkIGZyb20gJ3d4LXNlcnZlci1zZGsnO1xuXG5jbG91ZC5pbml0KHtcbiAgICBlbnY6IHByb2Nlc3MuZW52LmNsb3VkXG59KTtcblxuY29uc3QgZGI6IERCLkRhdGFiYXNlID0gY2xvdWQuZGF0YWJhc2UoICk7XG5jb25zdCBfID0gZGIuY29tbWFuZDtcblxuLyoqXG4gKiDorqLljZUxOiDmiYDmnInlupTor6XmlK/ku5jvvIzkvYbmmK/msqHmnInmlK/ku5jvvIjmlK/ku5jotoXml7YzMOWIhumSn++8ieeahOiuouWNle+8jOmHiuaUvuWOn+adpeeahOW6k+WtmO+8jOiuouWNlemHjee9ruS4uuW3sui/h+aXtlxuICovXG5leHBvcnQgY29uc3Qgb3ZlcnRpbWUgPSBhc3luYyAoICkgPT4ge1xuICAgIHRyeSB7XG5cbiAgICAgICAgY29uc3Qgb3JkZXJzJCA9IGF3YWl0IGRiLmNvbGxlY3Rpb24oJ29yZGVyJylcbiAgICAgICAgICAgIC53aGVyZSh7XG4gICAgICAgICAgICAgICAgcGF5X3N0YXR1czogJzAnLFxuICAgICAgICAgICAgICAgIGJhc2Vfc3RhdHVzOiAnMCcsXG4gICAgICAgICAgICAgICAgY3JlYXRlVGltZTogXy5sdGUoIG5ldyBEYXRlKCApLmdldFRpbWUoICkgLSAzMCAqIDYwICogMTAwMCApXG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLmdldCggKTtcbiAgICAgICAgXG4gICAgICAgIC8vIOiuouWNleabtOaWsFxuICAgICAgICBhd2FpdCBQcm9taXNlLmFsbCggb3JkZXJzJC5kYXRhLm1hcCggb3JkZXIgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIGRiLmNvbGxlY3Rpb24oJ29yZGVyJykuZG9jKCBTdHJpbmcoIG9yZGVyLl9pZCApKVxuICAgICAgICAgICAgICAgIC51cGRhdGUoe1xuICAgICAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBiYXNlX3N0YXR1czogJzUnXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICB9KSk7XG5cbiAgICAgICAgLy8g5bqT5a2Y6YeK5pS+ICgg5aaC5p6c5pyJ5bqT5a2Y55qE6K+dIClcbiAgICAgICAgYXdhaXQgUHJvbWlzZS5hbGwoIG9yZGVycyQuZGF0YS5tYXAoIGFzeW5jIG9yZGVyID0+IHtcblxuICAgICAgICAgICAgY29uc3QgdGFyZ2V0SWQgPSBvcmRlci5zaWQgfHwgb3JkZXIucGlkO1xuICAgICAgICAgICAgY29uc3QgY29sbGVjdGlvbiA9IG9yZGVyLnNpZCA/ICdzdGFuZGFyZHMnIDogJ2dvb2RzJztcblxuICAgICAgICAgICAgY29uc3QgdGFyZ2V0ID0gYXdhaXQgZGIuY29sbGVjdGlvbiggY29sbGVjdGlvbiApXG4gICAgICAgICAgICAgICAgLmRvYyggdGFyZ2V0SWQgKVxuICAgICAgICAgICAgICAgIC5nZXQoICk7XG5cbiAgICAgICAgICAgIGlmICggdGFyZ2V0LmRhdGEuc3RvY2sgPT09IHVuZGVmaW5lZCB8fCB0YXJnZXQuZGF0YS5zdG9jayA9PT0gbnVsbCApIHsgcmV0dXJuOyB9XG5cbiAgICAgICAgICAgIGF3YWl0IGRiLmNvbGxlY3Rpb24oIGNvbGxlY3Rpb24gKS5kb2MoIHRhcmdldElkIClcbiAgICAgICAgICAgICAgICAudXBkYXRlKHtcbiAgICAgICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgICAgICAgc3RvY2s6IF8uaW5jKCBvcmRlci5jb3VudCApXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgfSkpO1xuICAgICAgICBcbiAgICAgICAgcmV0dXJuIHsgc3RhdHVzOiAyMDAgfVxuICAgIH0gY2F0Y2ggKCBlICkge1xuICAgICAgICBjb25zb2xlLmxvZygnISEhIeWumuaXtuWZqOiuouWNlW92ZXJ0aW1l6ZSZ6K+vJywpXG4gICAgICAgIHJldHVybiB7IHN0YXR1czogNTAwIH1cbiAgICB9XG59O1xuXG4vKipcbiAqIOiuouWNlTLvvJrmiYDmnInmiJDlip/mlK/ku5jnmoTorqLljZXvvIzmo4Dmn6XmnInmsqHmnIkgdHlwZe+8mnByZeeahO+8jOacieeahOivnemcgOimgei9rOaIkHR5cGU6bm9ybWFs57G75Z6L6K6i5Y2V77yM5Yig6Zmk5a+55bqU55qE6LSt54mp6L2m77yI5pyJ55qE6K+d77yJXG4gKi9cbmV4cG9ydCBjb25zdCBwYXllZEZpeCA9IGFzeW5jICggKSA9PiB7XG4gICAgdHJ5IHtcblxuICAgICAgICBjb25zdCBvcmRlcnMkID0gYXdhaXQgZGIuY29sbGVjdGlvbignb3JkZXInKVxuICAgICAgICAgICAgLndoZXJlKHtcbiAgICAgICAgICAgICAgICB0eXBlOiAncHJlJyxcbiAgICAgICAgICAgICAgICBwYXlfc3RhdHVzOiAnMSdcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAuZ2V0KCApO1xuXG4gICAgICAgIC8vIOiuouWNleabtOaWsFxuICAgICAgICBhd2FpdCBQcm9taXNlLmFsbCggb3JkZXJzJC5kYXRhLm1hcCggb3JkZXIgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIGRiLmNvbGxlY3Rpb24oJ29yZGVyJykuZG9jKCBTdHJpbmcoIG9yZGVyLl9pZCApKVxuICAgICAgICAgICAgICAgIC51cGRhdGUoe1xuICAgICAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiAnbm9ybWFsJ1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgfSkpO1xuXG4gICAgICAgIC8vIOWIoOmZpOWvueW6lOeahOi0reeJqei9plxuICAgICAgICBhd2FpdCBQcm9taXNlLmFsbChcbiAgICAgICAgICAgIG9yZGVycyQuZGF0YVxuICAgICAgICAgICAgICAgIC5maWx0ZXIoIHggPT4gISF4LmNpZCApXG4gICAgICAgICAgICAgICAgLm1hcCggb3JkZXIgPT4ge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZGIuY29sbGVjdGlvbignY2FydCcpLmRvYyggb3JkZXIuY2lkIClcbiAgICAgICAgICAgICAgICAgICAgICAgIC5yZW1vdmUoIClcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICApO1xuXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBzdGF0dXM6IDIwMFxuICAgICAgICB9XG5cblxuICAgIH0gY2F0Y2ggKCBlICkge1xuICAgICAgICBjb25zb2xlLmxvZygnISEhIeWumuaXtuWZqOiuouWNlXBheWVkRml46ZSZ6K+vJywpXG4gICAgICAgIHJldHVybiB7IHN0YXR1czogNTAwIH1cbiAgICB9XG59XG5cbi8qKlxuICog6K6i5Y2VM++8muW3sue7j+i/m+ihjOi0reeJqea4heWNleS7t+agvOiwg+aVtOWQju+8jOaWsOadpeeahOWVhuWTgeiuouWNleS7t+agvOWmguaenOi3n+a4heWNleS7t+agvOS4jeS4gOiHtO+8jOW6lOivpeeUqOWumuaXtuWZqOi/m+ihjOiwg+aVtFxuICogIei/meexu+iuouWNle+8jOaaguaXtui/mOayoeacieiDveiHquWKqOazqOWFpeWIhumFjeaVsOmHjyBhbGxvY2F0ZWRDb3VudFxuICovXG5leHBvcnQgY29uc3QgcHJpY2VGaXggPSBhc3luYyAoICkgPT4ge1xuICAgIHRyeSB7XG5cbiAgICAgICAgLy8g6I635Y+W5b2T5YmN6L+b6KGM5Lit55qE6KGM56iLXG4gICAgICAgIGNvbnN0IHRyaXBzJCA9IGF3YWl0IGNsb3VkLmNhbGxGdW5jdGlvbih7XG4gICAgICAgICAgICBuYW1lOiAndHJpcCcsXG4gICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgJHVybDogJ2VudGVyJ1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICBjb25zdCBjdXJyZW50VHJpcCA9IHRyaXBzJC5yZXN1bHQuZGF0YVsgMCBdO1xuXG4gICAgICAgIGlmICggIWN1cnJlbnRUcmlwICkgeyBcbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgc3RhdHVzOiAyMDBcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IHRpZCA9IGN1cnJlbnRUcmlwLl9pZDtcblxuICAgICAgICAvLyDmib7liLDmiYDmnInlt7Lnu4/osIPmlbTlpb3nmoTmuIXljZXliJfooahcbiAgICAgICAgY29uc3Qgc2hvcHBpbmdsaXN0cyQgPSBhd2FpdCBkYi5jb2xsZWN0aW9uKCdzaG9wcGluZy1saXN0JylcbiAgICAgICAgICAgIC53aGVyZSh7XG4gICAgICAgICAgICAgICAgdGlkLFxuICAgICAgICAgICAgICAgIGJhc2Vfc3RhdHVzOiAnMSdcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAuZ2V0KCApO1xuICAgICAgICBcbiAgICAgICAgYXdhaXQgUHJvbWlzZS5hbGwoIHNob3BwaW5nbGlzdHMkLmRhdGEubWFwKCBhc3luYyBzaG9wcGluZ0xpc3QgPT4ge1xuXG4gICAgICAgICAgICBjb25zdCB7IHBpZCwgc2lkLCBhZGp1c3RQcmljZSwgYWRqdXN0R3JvdXBQcmljZSB9ID0gc2hvcHBpbmdMaXN0O1xuXG4gICAgICAgICAgICAvLyDmib7liLBiYXNlX3N0YXR1czogMCDnmoTlkIzllYblk4HorqLljZVcbiAgICAgICAgICAgIGNvbnN0IG9yZGVycyQgPSBhd2FpdCBkYi5jb2xsZWN0aW9uKCdvcmRlcicpXG4gICAgICAgICAgICAgICAgLndoZXJlKHtcbiAgICAgICAgICAgICAgICAgICAgdGlkLFxuICAgICAgICAgICAgICAgICAgICBwaWQsXG4gICAgICAgICAgICAgICAgICAgIHNpZCxcbiAgICAgICAgICAgICAgICAgICAgYmFzZV9zdGF0dXM6ICcwJ1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLmdldCggKTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgLy8g6K6i5Y2V5pu05pawXG4gICAgICAgICAgICBhd2FpdCBQcm9taXNlLmFsbCggb3JkZXJzJC5kYXRhLm1hcCggb3JkZXIgPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiBkYi5jb2xsZWN0aW9uKCdvcmRlcicpXG4gICAgICAgICAgICAgICAgICAgIC5kb2MoIFN0cmluZyggb3JkZXIuX2lkICkpXG4gICAgICAgICAgICAgICAgICAgIC51cGRhdGUoe1xuICAgICAgICAgICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFsbG9jYXRlZFByaWNlOiBhZGp1c3RQcmljZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhbGxvY2F0ZWRHcm91cFByaWNlOiBhZGp1c3RHcm91cFByaWNlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJhc2Vfc3RhdHVzOiAnMSdcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIH0pKTtcblxuICAgICAgICB9KSk7XG5cbiAgICAgICAgcmV0dXJuIHsgc3RhdHVzOiAyMDAgfVxuXG4gICAgfSBjYXRjaCAoIGUgKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKCchISEh5a6a5pe25Zmo6K6i5Y2VcHJpY2VGaXjplJnor68nLClcbiAgICAgICAgcmV0dXJuIHsgc3RhdHVzOiA1MDAgfVxuICAgIH1cbn0iXX0=