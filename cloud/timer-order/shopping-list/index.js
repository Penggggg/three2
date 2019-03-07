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
cloud.init();
var db = cloud.database();
var _ = db.command;
exports.catchLostOrders = function () { return __awaiter(_this, void 0, void 0, function () {
    var lostOrders_1, trips$, currentTrip, tid_1, find1$, find2$, tripShoppingList_1, e_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 5, , 6]);
                lostOrders_1 = [];
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
                        pay_status: '1'
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
                find1$.data.map(function (order) {
                    var sid = order.sid, pid = order.pid, _id = order._id, acid = order.acid;
                    var currentGoodShoppingList = tripShoppingList_1.find(function (x) { return x.sid === sid && x.pid === pid; });
                    if (!currentGoodShoppingList) {
                        lostOrders_1.push({
                            tid: tid_1,
                            sid: sid,
                            pid: pid,
                            oid: _id
                        });
                    }
                    else {
                        var oids = currentGoodShoppingList.oids;
                        if (!oids.find(function (x) { return x === _id; })) {
                            lostOrders_1.push({
                                tid: tid_1,
                                sid: sid,
                                pid: pid,
                                oid: _id
                            });
                        }
                    }
                });
                if (lostOrders_1.length === 0) {
                    return [2, {
                            status: 200
                        }];
                }
                return [4, cloud.callFunction({
                        name: 'shopping-list',
                        data: {
                            $url: 'create',
                            data: {
                                list: lostOrders_1
                            }
                        }
                    })];
            case 4:
                _a.sent();
                return [2, {
                        status: 200,
                        data: lostOrders_1
                    }];
            case 5:
                e_1 = _a.sent();
                console.log('!!!!定时器订单catchLostOrders错误');
                return [2, { status: 500 }];
            case 6: return [2];
        }
    });
}); };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSxpQkE0SEM7O0FBNUhELHFDQUF1QztBQUV2QyxLQUFLLENBQUMsSUFBSSxFQUFHLENBQUM7QUFFZCxJQUFNLEVBQUUsR0FBZ0IsS0FBSyxDQUFDLFFBQVEsRUFBRyxDQUFDO0FBQzFDLElBQU0sQ0FBQyxHQUFHLEVBQUUsQ0FBQyxPQUFPLENBQUM7QUFLUixRQUFBLGVBQWUsR0FBRzs7Ozs7O2dCQU1qQixlQUtDLEVBQUcsQ0FBQztnQkFHSSxXQUFNLEtBQUssQ0FBQyxZQUFZLENBQUM7d0JBQ3BDLElBQUksRUFBRSxNQUFNO3dCQUNaLElBQUksRUFBRTs0QkFDRixJQUFJLEVBQUUsT0FBTzt5QkFDaEI7cUJBQ0osQ0FBQyxFQUFBOztnQkFMSSxNQUFNLEdBQUcsU0FLYjtnQkFFSSxXQUFXLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUUsQ0FBQyxDQUFFLENBQUM7Z0JBRTVDLElBQUssQ0FBQyxXQUFXLEVBQUc7b0JBQ2hCLFdBQU87NEJBQ0gsTUFBTSxFQUFFLEdBQUc7eUJBQ2QsRUFBQTtpQkFDSjtnQkFFSyxRQUFNLFdBQVcsQ0FBQyxHQUFHLENBQUM7Z0JBR2IsV0FBTSxFQUFFLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQzt5QkFDdEMsS0FBSyxDQUFDO3dCQUNILEdBQUcsT0FBQTt3QkFDSCxVQUFVLEVBQUUsR0FBRztxQkFDbEIsQ0FBQzt5QkFDRCxHQUFHLEVBQUcsRUFBQTs7Z0JBTEwsTUFBTSxHQUFHLFNBS0o7Z0JBRVgsSUFBSyxNQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sS0FBSyxDQUFDLEVBQUc7b0JBQzVCLFdBQU87NEJBQ0gsTUFBTSxFQUFFLEdBQUc7eUJBQ2QsRUFBQTtpQkFDSjtnQkFHYyxXQUFNLEVBQUUsQ0FBQyxVQUFVLENBQUMsZUFBZSxDQUFDO3lCQUM5QyxLQUFLLENBQUM7d0JBQ0gsR0FBRyxPQUFBO3FCQUNOLENBQUM7eUJBQ0QsR0FBRyxFQUFHLEVBQUE7O2dCQUpMLE1BQU0sR0FBRyxTQUlKO2dCQUVMLHFCQUFtQixNQUFNLENBQUMsSUFBSSxDQUFDO2dCQVFyQyxNQUFNLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBRSxVQUFBLEtBQUs7b0JBRVYsSUFBQSxlQUFHLEVBQUUsZUFBRyxFQUFFLGVBQUcsRUFBRSxpQkFBSSxDQUFXO29CQUN0QyxJQUFNLHVCQUF1QixHQUFHLGtCQUFnQixDQUFDLElBQUksQ0FBRSxVQUFBLENBQUMsSUFBSSxPQUFBLENBQUMsQ0FBQyxHQUFHLEtBQUssR0FBRyxJQUFJLENBQUMsQ0FBQyxHQUFHLEtBQUssR0FBRyxFQUE5QixDQUE4QixDQUFFLENBQUM7b0JBRzdGLElBQUssQ0FBQyx1QkFBdUIsRUFBRzt3QkFDNUIsWUFBVSxDQUFDLElBQUksQ0FBQzs0QkFDWixHQUFHLE9BQUE7NEJBQ0gsR0FBRyxLQUFBOzRCQUNILEdBQUcsS0FBQTs0QkFDSCxHQUFHLEVBQUUsR0FBRzt5QkFDWCxDQUFDLENBQUE7cUJBR0w7eUJBQU07d0JBQ0ssSUFBQSxtQ0FBSSxDQUE2Qjt3QkFDekMsSUFBSyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUUsVUFBQSxDQUFDLElBQUksT0FBQSxDQUFDLEtBQUssR0FBRyxFQUFULENBQVMsQ0FBRSxFQUFFOzRCQUMvQixZQUFVLENBQUMsSUFBSSxDQUFDO2dDQUNaLEdBQUcsT0FBQTtnQ0FDSCxHQUFHLEtBQUE7Z0NBQ0gsR0FBRyxLQUFBO2dDQUNILEdBQUcsRUFBRSxHQUFHOzZCQUNYLENBQUMsQ0FBQTt5QkFDTDtxQkFDSjtnQkFFTCxDQUFDLENBQUMsQ0FBQztnQkFFSCxJQUFLLFlBQVUsQ0FBQyxNQUFNLEtBQUssQ0FBQyxFQUFHO29CQUMzQixXQUFPOzRCQUNILE1BQU0sRUFBRSxHQUFHO3lCQUNkLEVBQUE7aUJBQ0o7Z0JBRUQsV0FBTSxLQUFLLENBQUMsWUFBWSxDQUFDO3dCQUNyQixJQUFJLEVBQUUsZUFBZTt3QkFDckIsSUFBSSxFQUFFOzRCQUNGLElBQUksRUFBRSxRQUFROzRCQUNkLElBQUksRUFBRTtnQ0FDRixJQUFJLEVBQUUsWUFBVTs2QkFDbkI7eUJBQ0o7cUJBQ0osQ0FBQyxFQUFBOztnQkFSRixTQVFFLENBQUM7Z0JBRUgsV0FBTzt3QkFDSCxNQUFNLEVBQUUsR0FBRzt3QkFDWCxJQUFJLEVBQUUsWUFBVTtxQkFDbkIsRUFBQTs7O2dCQUdELE9BQU8sQ0FBQyxHQUFHLENBQUMsNEJBQTRCLENBQUUsQ0FBQTtnQkFDMUMsV0FBTyxFQUFFLE1BQU0sRUFBRSxHQUFHLEVBQUUsRUFBQzs7OztLQUU5QixDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgY2xvdWQgZnJvbSAnd3gtc2VydmVyLXNkayc7XG5cbmNsb3VkLmluaXQoICk7XG5cbmNvbnN0IGRiOiBEQi5EYXRhYmFzZSA9IGNsb3VkLmRhdGFiYXNlKCApO1xuY29uc3QgXyA9IGRiLmNvbW1hbmQ7XG5cbi8qKlxuICog5riF5Y2VMe+8muafpeivouacquiiq+WuieaOkui/m+a4heWNleeahOiuouWNle+8iHBheV9zdGF0dXM6IDEg55qEb3JkZXLvvIlcbiAqL1xuZXhwb3J0IGNvbnN0IGNhdGNoTG9zdE9yZGVycyA9IGFzeW5jICggKSA9PiB7XG4gICAgdHJ5IHtcblxuICAgICAgICAvKipcbiAgICAgICAgICog5pyq6KKr5a6J5o6S55qE6K6i5Y2VXG4gICAgICAgICAqL1xuICAgICAgICBjb25zdCBsb3N0T3JkZXJzOiB7XG4gICAgICAgICAgICB0aWQsXG4gICAgICAgICAgICBwaWQsXG4gICAgICAgICAgICBzaWQsXG4gICAgICAgICAgICBvaWRcbiAgICAgICAgfVsgXSA9IFsgXTtcblxuICAgICAgICAvLyDojrflj5blvZPliY3ov5vooYzkuK3nmoTooYznqItcbiAgICAgICAgY29uc3QgdHJpcHMkID0gYXdhaXQgY2xvdWQuY2FsbEZ1bmN0aW9uKHtcbiAgICAgICAgICAgIG5hbWU6ICd0cmlwJyxcbiAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAkdXJsOiAnZW50ZXInXG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGNvbnN0IGN1cnJlbnRUcmlwID0gdHJpcHMkLnJlc3VsdC5kYXRhWyAwIF07XG4gICAgICAgIFxuICAgICAgICBpZiAoICFjdXJyZW50VHJpcCApIHsgXG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIHN0YXR1czogMjAwXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCB0aWQgPSBjdXJyZW50VHJpcC5faWQ7XG5cbiAgICAgICAgLy8g5ou/5Yiw5omA5pyJ6K+l6KGM56iL5LiL55qE5bey5LuY6K6i6YeR6K6i5Y2VXG4gICAgICAgIGNvbnN0IGZpbmQxJCA9IGF3YWl0IGRiLmNvbGxlY3Rpb24oJ29yZGVyJylcbiAgICAgICAgICAgIC53aGVyZSh7XG4gICAgICAgICAgICAgICAgdGlkLFxuICAgICAgICAgICAgICAgIHBheV9zdGF0dXM6ICcxJ1xuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC5nZXQoICk7XG5cbiAgICAgICAgaWYgKCBmaW5kMSQuZGF0YS5sZW5ndGggPT09IDAgKSB7IFxuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBzdGF0dXM6IDIwMFxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLy8g5ou/5Yiw6K+l6KGM56iL5LiL55qE6LSt54mp5riF5Y2VXG4gICAgICAgIGNvbnN0IGZpbmQyJCA9IGF3YWl0IGRiLmNvbGxlY3Rpb24oJ3Nob3BwaW5nLWxpc3QnKVxuICAgICAgICAgICAgLndoZXJlKHtcbiAgICAgICAgICAgICAgICB0aWRcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAuZ2V0KCApO1xuXG4gICAgICAgIGNvbnN0IHRyaXBTaG9wcGluZ0xpc3QgPSBmaW5kMiQuZGF0YTsgXG4gICAgICAgIFxuICAgICAgICAvKipcbiAgICAgICAgICog6Lef5riF5Y2V6L+b6KGM5Yy56YWNXG4gICAgICAgICAqIDEuIOivpeiuouWNleeahOWVhuWTgS/lnovlj7fov5jmsqHmnInku7vkvZXmuIXljZVcbiAgICAgICAgICogMi4g6K+l6K6i5Y2V5rKh5pyJ5Zyo5bey5pyJ5ZCM5qy+5ZWG5ZOBL+Wei+WPt+eahOa4heWNlemHjOmdolxuICAgICAgICAgKi9cblxuICAgICAgICBmaW5kMSQuZGF0YS5tYXAoIG9yZGVyID0+IHtcblxuICAgICAgICAgICAgY29uc3QgeyBzaWQsIHBpZCwgX2lkLCBhY2lkIH0gPSBvcmRlcjtcbiAgICAgICAgICAgIGNvbnN0IGN1cnJlbnRHb29kU2hvcHBpbmdMaXN0ID0gdHJpcFNob3BwaW5nTGlzdC5maW5kKCB4ID0+IHguc2lkID09PSBzaWQgJiYgeC5waWQgPT09IHBpZCApO1xuXG4gICAgICAgICAgICAvLyDlpoLmnpzmsqHmnInotK3nianmuIXljZXvvIzliJnliJvlu7pcbiAgICAgICAgICAgIGlmICggIWN1cnJlbnRHb29kU2hvcHBpbmdMaXN0ICkge1xuICAgICAgICAgICAgICAgIGxvc3RPcmRlcnMucHVzaCh7XG4gICAgICAgICAgICAgICAgICAgIHRpZCxcbiAgICAgICAgICAgICAgICAgICAgc2lkLFxuICAgICAgICAgICAgICAgICAgICBwaWQsXG4gICAgICAgICAgICAgICAgICAgIG9pZDogX2lkXG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgLy8g5aaC5p6c5pyJ6LSt54mp5riF5Y2V44CB5L2G5piv5riF5Y2V6YeM6Z2i55qEb2lkc+ayoeacieWug++8jOWwseaPkuWFpeW5tuabtOaWsFxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBjb25zdCB7IG9pZHMgfSA9IGN1cnJlbnRHb29kU2hvcHBpbmdMaXN0O1xuICAgICAgICAgICAgICAgIGlmICggIW9pZHMuZmluZCggeCA9PiB4ID09PSBfaWQgKSkge1xuICAgICAgICAgICAgICAgICAgICBsb3N0T3JkZXJzLnB1c2goe1xuICAgICAgICAgICAgICAgICAgICAgICAgdGlkLFxuICAgICAgICAgICAgICAgICAgICAgICAgc2lkLFxuICAgICAgICAgICAgICAgICAgICAgICAgcGlkLFxuICAgICAgICAgICAgICAgICAgICAgICAgb2lkOiBfaWRcbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfSk7XG5cbiAgICAgICAgaWYgKCBsb3N0T3JkZXJzLmxlbmd0aCA9PT0gMCApIHtcbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgc3RhdHVzOiAyMDBcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGF3YWl0IGNsb3VkLmNhbGxGdW5jdGlvbih7XG4gICAgICAgICAgICBuYW1lOiAnc2hvcHBpbmctbGlzdCcsXG4gICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgJHVybDogJ2NyZWF0ZScsXG4gICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgICBsaXN0OiBsb3N0T3JkZXJzXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBzdGF0dXM6IDIwMCxcbiAgICAgICAgICAgIGRhdGE6IGxvc3RPcmRlcnNcbiAgICAgICAgfVxuXG4gICAgfSBjYXRjaCAoIGUgKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKCchISEh5a6a5pe25Zmo6K6i5Y2VY2F0Y2hMb3N0T3JkZXJz6ZSZ6K+vJywpXG4gICAgICAgIHJldHVybiB7IHN0YXR1czogNTAwIH07XG4gICAgfVxufSJdfQ==