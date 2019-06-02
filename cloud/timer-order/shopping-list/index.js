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
                console.log('!!!!定时器订单catchLostOrders错误');
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSxpQkE0TEM7O0FBNUxELHFDQUF1QztBQUV2QyxLQUFLLENBQUMsSUFBSSxDQUFDO0lBQ1AsR0FBRyxFQUFFLE9BQU8sQ0FBQyxHQUFHLENBQUMsS0FBSztDQUN6QixDQUFDLENBQUM7QUFFSCxJQUFNLEVBQUUsR0FBZ0IsS0FBSyxDQUFDLFFBQVEsRUFBRyxDQUFDO0FBQzFDLElBQU0sQ0FBQyxHQUFHLEVBQUUsQ0FBQyxPQUFPLENBQUM7QUFLUixRQUFBLGVBQWUsR0FBRzs7Ozs7OztnQkFJUixXQUFNLEtBQUssQ0FBQyxZQUFZLENBQUM7d0JBQ3BDLElBQUksRUFBRSxNQUFNO3dCQUNaLElBQUksRUFBRTs0QkFDRixJQUFJLEVBQUUsT0FBTzt5QkFDaEI7cUJBQ0osQ0FBQyxFQUFBOztnQkFMSSxNQUFNLEdBQUcsU0FLYjtnQkFFSSxXQUFXLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUUsQ0FBQyxDQUFFLENBQUM7Z0JBRTVDLElBQUssQ0FBQyxXQUFXLEVBQUc7b0JBQ2hCLFdBQU87NEJBQ0gsTUFBTSxFQUFFLEdBQUc7eUJBQ2QsRUFBQTtpQkFDSjtnQkFFSyxRQUFNLFdBQVcsQ0FBQyxHQUFHLENBQUM7Z0JBR2IsV0FBTSxFQUFFLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQzt5QkFDdEMsS0FBSyxDQUFDO3dCQUNILEdBQUcsT0FBQTt3QkFDSCxVQUFVLEVBQUUsR0FBRzt3QkFDZixXQUFXLEVBQUUsR0FBRztxQkFDbkIsQ0FBQzt5QkFDRCxHQUFHLEVBQUcsRUFBQTs7Z0JBTkwsTUFBTSxHQUFHLFNBTUo7Z0JBRVgsSUFBSyxNQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sS0FBSyxDQUFDLEVBQUc7b0JBQzVCLFdBQU87NEJBQ0gsTUFBTSxF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QUMsTUFBTSxDQUFFLFVBQVUsRUFBRSxDQUFDLENBQUUsQ0FBQTtvQ0FDNUIsV0FBTSxFQUFFLENBQUMsVUFBVSxDQUFFLGVBQWUsQ0FBRTs2Q0FDakMsR0FBRyxDQUFFLE1BQU0sQ0FBRSxlQUFlLENBQUMsR0FBRyxDQUFFLENBQUM7NkNBQ25DLE1BQU0sQ0FBQzs0Q0FDSixJQUFJLEVBQUU7Z0RBQ0YsSUFBSSxNQUFBOzZDQUNQO3lDQUNKLENBQUMsRUFBQTs7b0NBTk4sU0FNTSxDQUFBO29DQUNOLFdBQU87d0NBRVgsV0FBTzs7O3lCQUNWLENBQUMsQ0FBQyxFQUFBOztnQkFyQ0gsU0FxQ0csQ0FBQzs7OztnQkFJSixXQUFPLEVBQUUsTUFBTSxFQUFFLEdBQUcsRUFBRSxFQUFBOzs7O0tBRTdCLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBjbG91ZCBmcm9tICd3eC1zZXJ2ZXItc2RrJztcblxuY2xvdWQuaW5pdCh7XG4gICAgZW52OiBwcm9jZXNzLmVudi5jbG91ZFxufSk7XG5cbmNvbnN0IGRiOiBEQi5EYXRhYmFzZSA9IGNsb3VkLmRhdGFiYXNlKCApO1xuY29uc3QgXyA9IGRiLmNvbW1hbmQ7XG5cbi8qKlxuICog5riF5Y2VMe+8muafpeivouacquiiq+WuieaOkui/m+a4heWNleeahOiuouWNle+8iHBheV9zdGF0dXM6IDEg55qEb3JkZXLvvIlcbiAqL1xuZXhwb3J0IGNvbnN0IGNhdGNoTG9zdE9yZGVycyA9IGFzeW5jICggKSA9PiB7XG4gICAgdHJ5IHtcblxuICAgICAgICAvLyDojrflj5blvZPliY3ov5vooYzkuK3nmoTooYznqItcbiAgICAgICAgY29uc3QgdHJpcHMkID0gYXdhaXQgY2xvdWQuY2FsbEZ1bmN0aW9uKHtcbiAgICAgICAgICAgIG5hbWU6ICd0cmlwJyxcbiAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAkdXJsOiAnZW50ZXInXG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGNvbnN0IGN1cnJlbnRUcmlwID0gdHJpcHMkLnJlc3VsdC5kYXRhWyAwIF07XG4gICAgICAgIFxuICAgICAgICBpZiAoICFjdXJyZW50VHJpcCApIHsgXG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIHN0YXR1czogMjAwXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCB0aWQgPSBjdXJyZW50VHJpcC5faWQ7XG5cbiAgICAgICAgLy8g5ou/5Yiw5omA5pyJ6K+l6KGM56iL5LiL55qE5bey5LuY6K6i6YeR6K6i5Y2V44CB5Z+65pys54q25oCB5Li6MOeahOiuouWNlVxuICAgICAgICBjb25zdCBmaW5kMSQgPSBhd2FpdCBkYi5jb2xsZWN0aW9uKCdvcmRlcicpXG4gICAgICAgICAgICAud2hlcmUoe1xuICAgICAgICAgICAgICAgIHRpZCxcbiAgICAgICAgICAgICAgICBwYXlfc3RhdHVzOiAnMScsXG4gICAgICAgICAgICAgICAgYmFzZV9zdGF0dXM6ICcwJ1xuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC5nZXQoICk7XG5cbiAgICAgICAgaWYgKCBmaW5kMSQuZGF0YS5sZW5ndGggPT09IDAgKSB7IFxuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBzdGF0dXM6IDIwMFxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLy8g5ou/5Yiw6K+l6KGM56iL5LiL55qE6LSt54mp5riF5Y2VXG4gICAgICAgIGNvbnN0IGZpbmQyJCA9IGF3YWl0IGRiLmNvbGxlY3Rpb24oJ3Nob3BwaW5nLWxpc3QnKVxuICAgICAgICAgICAgLndoZXJlKHtcbiAgICAgICAgICAgICAgICB0aWRcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAuZ2V0KCApO1xuXG4gICAgICAgIGNvbnN0IHRyaXBTaG9wcGluZ0xpc3QgPSBmaW5kMiQuZGF0YTsgXG4gICAgICAgIFxuICAgICAgICAvKipcbiAgICAgICAgICog6Lef5riF5Y2V6L+b6KGM5Yy56YWNXG4gICAgICAgICAqIDEuIOivpeiuouWNleeahOWVhuWTgS/lnovlj7fov5jmsqHmnInku7vkvZXmuIXljZVcbiAgICAgICAgICogMi4g6K+l6K6i5Y2V5rKh5pyJ5Zyo5bey5pyJ5ZCM5qy+5ZWG5ZOBL+Wei+WPt+eahOa4heWNlemHjOmdolxuICAgICAgICAgKi9cblxuICAgICAgICBhd2FpdCBQcm9taXNlLmFsbCggZmluZDEkLmRhdGEubWFwKCBvcmRlciA9PiB7XG4gICAgICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoIGFzeW5jICggcmVzb2x2ZSwgcmVqZWN0ICkgPT4ge1xuICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHsgc2lkLCBwaWQsIF9pZCwgYWNpZCwgb3BlbmlkLCBwcmljZSwgZ3JvdXBQcmljZSB9ID0gb3JkZXI7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGN1cnJlbnRHb29kU2hvcHBpbmdMaXN0ID0gdHJpcFNob3BwaW5nTGlzdC5maW5kKCB4ID0+IFxuICAgICAgICAgICAgICAgICAgICAgICAgeC5zaWQgPT09IHNpZCAmJlxuICAgICAgICAgICAgICAgICAgICAgICAgeC5waWQgPT09IHBpZCAmJlxuICAgICAgICAgICAgICAgICAgICAgICAgeC5hY2lkID09PSBhY2lkXG4gICAgICAgICAgICAgICAgICAgICk7XG5cbiAgICAgICAgICAgICAgICAgICAgLy8g5aaC5p6c5rKh5pyJ6LSt54mp5riF5Y2V77yM5YiZ5Yib5bu6XG4gICAgICAgICAgICAgICAgICAgIC8vIOWmguaenOaciei0reeJqea4heWNleOAgeS9huaYr+a4heWNlemHjOmdoueahG9pZHPmsqHmnInlroPvvIzlsLHmj5LlhaXlubbmm7TmlrBcbiAgICAgICAgICAgICAgICAgICAgaWYgKCggIWN1cnJlbnRHb29kU2hvcHBpbmdMaXN0ICkgfHxcbiAgICAgICAgICAgICAgICAgICAgICAgICggISFjdXJyZW50R29vZFNob3BwaW5nTGlzdCAmJiAhY3VycmVudEdvb2RTaG9wcGluZ0xpc3Qub2lkcy5maW5kKCB4ID0+IHggPT09IF9pZCApICkpIHtcblxuICAgICAgICAgICAgICAgICAgICAgICAgYXdhaXQgY2xvdWQuY2FsbEZ1bmN0aW9uKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiAnc2hvcHBpbmctbGlzdCcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAkdXJsOiAnY3JlYXRlJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb3BlbklkOiBvcGVuaWQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsaXN0OiBbe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRpZCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzaWQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGlkLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFjaWQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJpY2UsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZ3JvdXBQcmljZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvaWQ6IF9pZFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfV1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZSggKTtcbiAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgIH0gXG4gICAgICAgICAgICAgICAgICAgIHJlc29sdmUoICk7XG4gICAgICAgICAgICAgICAgfSBjYXRjaCAoIGUgKSB7XG4gICAgICAgICAgICAgICAgICAgIHJlc29sdmUoICk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pKTtcbiAgICAgICAgXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBzdGF0dXM6IDIwMFxuICAgICAgICB9XG5cbiAgICB9IGNhdGNoICggZSApIHtcbiAgICAgICAgY29uc29sZS5sb2coJyEhISHlrprml7blmajorqLljZVjYXRjaExvc3RPcmRlcnPplJnor68nLClcbiAgICAgICAgcmV0dXJuIHsgc3RhdHVzOiA1MDAgfTtcbiAgICB9XG59XG5cbi8qKiDmuIXljZUyOiDmn6Xor6LmlK/ku5jorqLph5HotoXml7bnmoTorqLljZXvvIzlubbmiorlhbbku47otK3nianmuIXljZXkuK3ljrvmjokgKi9cbmV4cG9ydCBjb25zdCByZW1vdmVVc2VsZXNzT3JkZXJzID0gYXN5bmMgKCApID0+IHtcbiAgICB0cnkge1xuXG4gICAgICAgIC8vIOiOt+WPluW9k+WJjei/m+ihjOS4reeahOihjOeoi1xuICAgICAgICBjb25zdCB0cmlwcyQgPSBhd2FpdCBjbG91ZC5jYWxsRnVuY3Rpb24oe1xuICAgICAgICAgICAgbmFtZTogJ3RyaXAnLFxuICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICR1cmw6ICdlbnRlcidcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgY29uc3QgY3VycmVudFRyaXAgPSB0cmlwcyQucmVzdWx0LmRhdGFbIDAgXTtcbiAgICAgICAgXG4gICAgICAgIGlmICggIWN1cnJlbnRUcmlwICkgeyBcbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgc3RhdHVzOiAyMDBcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IHRpZCA9IGN1cnJlbnRUcmlwLl9pZDtcblxuICAgICAgICBjb25zdCB1c2VsZXNzT3JkZXJzJCA9IGF3YWl0IGRiLmNvbGxlY3Rpb24oJ29yZGVyJylcbiAgICAgICAgICAgIC53aGVyZSh7XG4gICAgICAgICAgICAgICAgdGlkLFxuICAgICAgICAgICAgICAgIGJhc2Vfc3RhdHVzOiAnNSdcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAuZ2V0KCApO1xuXG4gICAgICAgIGF3YWl0IFByb21pc2UuYWxsKCB1c2VsZXNzT3JkZXJzJC5kYXRhLm1hcCggYXN5bmMgb3JkZXIgPT4ge1xuICAgICAgICAgICAgY29uc3Qgb3JkZXJJZCA9IG9yZGVyLl9pZDtcbiAgICAgICAgICAgIGNvbnN0IHsgcGlkLCBzaWQsIHRpZCB9ID0gb3JkZXI7XG5cbiAgICAgICAgICAgIGxldCB3aGVyZSQgPSB7XG4gICAgICAgICAgICAgICAgcGlkLFxuICAgICAgICAgICAgICAgIHRpZFxuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgaWYgKCAhIXNpZCApIHtcbiAgICAgICAgICAgICAgICB3aGVyZSQgPSBPYmplY3QuYXNzaWduKHsgfSwgd2hlcmUkLCB7XG4gICAgICAgICAgICAgICAgICAgIHNpZFxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBjb25zdCBzaG9wcGluZ0xpc3QkID0gYXdhaXQgZGIuY29sbGVjdGlvbignc2hvcHBpbmctbGlzdCcpXG4gICAgICAgICAgICAgICAgLndoZXJlKCB3aGVyZSQgKVxuICAgICAgICAgICAgICAgIC5nZXQoICk7XG4gICAgICAgICAgICBjb25zdCB0aGVTaG9wcGluZ0xpc3QgPSBzaG9wcGluZ0xpc3QkLmRhdGFbIDAgXTtcblxuICAgICAgICAgICAgaWYgKCAhdGhlU2hvcHBpbmdMaXN0ICkgeyByZXR1cm47IH1cblxuICAgICAgICAgICAgY29uc3QgeyBvaWRzIH0gPSB0aGVTaG9wcGluZ0xpc3Q7XG4gICAgICAgICAgICBjb25zdCBvcmRlckluZGV4ID0gb2lkcy5maW5kSW5kZXgoIHggPT4geCA9PT0gb3JkZXJJZCApO1xuXG4gICAgICAgICAgICBpZiAoIG9yZGVySW5kZXggIT09IC0xICkge1xuICAgICAgICAgICAgICAgIG9pZHMuc3BsaWNlKCBvcmRlckluZGV4LCAxIClcbiAgICAgICAgICAgICAgICBhd2FpdCBkYi5jb2xsZWN0aW9uKCAnc2hvcHBpbmctbGlzdCcgKVxuICAgICAgICAgICAgICAgICAgICAuZG9jKCBTdHJpbmcoIHRoZVNob3BwaW5nTGlzdC5faWQgKSlcbiAgICAgICAgICAgICAgICAgICAgLnVwZGF0ZSh7XG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb2lkc1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfSkpO1xuXG5cbiAgICB9IGNhdGNoICggZSApIHtcbiAgICAgICAgcmV0dXJuIHsgc3RhdHVzOiA1MDAgfVxuICAgIH1cbn0iXX0=