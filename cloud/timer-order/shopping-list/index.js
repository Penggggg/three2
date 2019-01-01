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
                    var sid = order.sid, pid = order.pid, _id = order._id;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSxpQkF5SEM7O0FBekhELHFDQUF1QztBQUV2QyxLQUFLLENBQUMsSUFBSSxFQUFHLENBQUM7QUFFZCxJQUFNLEVBQUUsR0FBZ0IsS0FBSyxDQUFDLFFBQVEsRUFBRyxDQUFDO0FBQzFDLElBQU0sQ0FBQyxHQUFHLEVBQUUsQ0FBQyxPQUFPLENBQUM7QUFLUixRQUFBLGVBQWUsR0FBRzs7Ozs7O2dCQU1qQixlQUtDLEVBQUcsQ0FBQztnQkFHSSxXQUFNLEtBQUssQ0FBQyxZQUFZLENBQUM7d0JBQ3BDLElBQUksRUFBRSxNQUFNO3dCQUNaLElBQUksRUFBRTs0QkFDRixJQUFJLEVBQUUsT0FBTzt5QkFDaEI7cUJBQ0osQ0FBQyxFQUFBOztnQkFMSSxNQUFNLEdBQUcsU0FLYjtnQkFFSSxXQUFXLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUUsQ0FBQyxDQUFFLENBQUM7Z0JBRTVDLElBQUssQ0FBQyxXQUFXLEVBQUc7b0JBQ2hCLFdBQU87NEJBQ0gsTUFBTSxFQUFFLEdBQUc7eUJBQ2QsRUFBQTtpQkFDSjtnQkFFSyxRQUFNLFdBQVcsQ0FBQyxHQUFHLENBQUM7Z0JBR2IsV0FBTSxFQUFFLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQzt5QkFDdEMsS0FBSyxDQUFDO3dCQUNILEdBQUcsT0FBQTt3QkFDSCxVQUFVLEVBQUUsR0FBRztxQkFDbEIsQ0FBQzt5QkFDRCxHQUFHLEVBQUcsRUFBQTs7Z0JBTEwsTUFBTSxHQUFHLFNBS0o7Z0JBRVgsSUFBSyxNQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sS0FBSyxDQUFDLEVBQUc7b0JBQzVCLFdBQU87NEJBQ0gsTUFBTSxFQUFFLEdBQUc7eUJBQ2QsRUFBQTtpQkFDSjtnQkFHYyxXQUFNLEVBQUUsQ0FBQyxVQUFVLENBQUMsZUFBZSxDQUFDO3lCQUM5QyxLQUFLLENBQUM7d0JBQ0gsR0FBRyxPQUFBO3FCQUNOLENBQUM7eUJBQ0QsR0FBRyxFQUFHLEVBQUE7O2dCQUpMLE1BQU0sR0FBRyxTQUlKO2dCQUVMLHFCQUFtQixNQUFNLENBQUMsSUFBSSxDQUFDO2dCQVFyQyxNQUFNLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBRSxVQUFBLEtBQUs7b0JBRVYsSUFBQSxlQUFHLEVBQUUsZUFBRyxFQUFFLGVBQUcsQ0FBVztvQkFDaEMsSUFBTSx1QkFBdUIsR0FBRyxrQkFBZ0IsQ0FBQyxJQUFJLENBQUUsVUFBQSxDQUFDLElBQUksT0FBQSxDQUFDLENBQUMsR0FBRyxLQUFLLEdBQUcsSUFBSSxDQUFDLENBQUMsR0FBRyxLQUFLLEdBQUcsRUFBOUIsQ0FBOEIsQ0FBRSxDQUFDO29CQUU3RixJQUFLLENBQUMsdUJBQXVCLEVBQUc7d0JBQzVCLFlBQVUsQ0FBQyxJQUFJLENBQUM7NEJBQ1osR0FBRyxPQUFBOzRCQUNILEdBQUcsS0FBQTs0QkFDSCxHQUFHLEtBQUE7NEJBQ0gsR0FBRyxFQUFFLEdBQUc7eUJBQ1gsQ0FBQyxDQUFBO3FCQUNMO3lCQUFNO3dCQUNLLElBQUEsbUNBQUksQ0FBNkI7d0JBQ3pDLElBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFFLFVBQUEsQ0FBQyxJQUFJLE9BQUEsQ0FBQyxLQUFLLEdBQUcsRUFBVCxDQUFTLENBQUUsRUFBRTs0QkFDL0IsWUFBVSxDQUFDLElBQUksQ0FBQztnQ0FDWixHQUFHLE9BQUE7Z0NBQ0gsR0FBRyxLQUFBO2dDQUNILEdBQUcsS0FBQTtnQ0FDSCxHQUFHLEVBQUUsR0FBRzs2QkFDWCxDQUFDLENBQUE7eUJBQ0w7cUJBQ0o7Z0JBRUwsQ0FBQyxDQUFDLENBQUM7Z0JBRUgsSUFBSyxZQUFVLENBQUMsTUFBTSxLQUFLLENBQUMsRUFBRztvQkFDM0IsV0FBTzs0QkFDSCxNQUFNLEVBQUUsR0FBRzt5QkFDZCxFQUFBO2lCQUNKO2dCQUVELFdBQU0sS0FBSyxDQUFDLFlBQVksQ0FBQzt3QkFDckIsSUFBSSxFQUFFLGVBQWU7d0JBQ3JCLElBQUksRUFBRTs0QkFDRixJQUFJLEVBQUUsUUFBUTs0QkFDZCxJQUFJLEVBQUU7Z0NBQ0YsSUFBSSxFQUFFLFlBQVU7NkJBQ25CO3lCQUNKO3FCQUNKLENBQUMsRUFBQTs7Z0JBUkYsU0FRRSxDQUFDO2dCQUVILFdBQU87d0JBQ0gsTUFBTSxFQUFFLEdBQUc7d0JBQ1gsSUFBSSxFQUFFLFlBQVU7cUJBQ25CLEVBQUE7OztnQkFHRCxPQUFPLENBQUMsR0FBRyxDQUFDLDRCQUE0QixDQUFFLENBQUE7Z0JBQzFDLFdBQU8sRUFBRSxNQUFNLEVBQUUsR0FBRyxFQUFFLEVBQUM7Ozs7S0FFOUIsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIGNsb3VkIGZyb20gJ3d4LXNlcnZlci1zZGsnO1xuXG5jbG91ZC5pbml0KCApO1xuXG5jb25zdCBkYjogREIuRGF0YWJhc2UgPSBjbG91ZC5kYXRhYmFzZSggKTtcbmNvbnN0IF8gPSBkYi5jb21tYW5kO1xuXG4vKipcbiAqIOa4heWNlTHvvJrmn6Xor6LmnKrooqvlronmjpLov5vmuIXljZXnmoTorqLljZXvvIhwYXlfc3RhdHVzOiAxIOeahG9yZGVy77yJXG4gKi9cbmV4cG9ydCBjb25zdCBjYXRjaExvc3RPcmRlcnMgPSBhc3luYyAoICkgPT4ge1xuICAgIHRyeSB7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIOacquiiq+WuieaOkueahOiuouWNlVxuICAgICAgICAgKi9cbiAgICAgICAgY29uc3QgbG9zdE9yZGVyczoge1xuICAgICAgICAgICAgdGlkLFxuICAgICAgICAgICAgcGlkLFxuICAgICAgICAgICAgc2lkLFxuICAgICAgICAgICAgb2lkXG4gICAgICAgIH1bIF0gPSBbIF07XG5cbiAgICAgICAgLy8g6I635Y+W5b2T5YmN6L+b6KGM5Lit55qE6KGM56iLXG4gICAgICAgIGNvbnN0IHRyaXBzJCA9IGF3YWl0IGNsb3VkLmNhbGxGdW5jdGlvbih7XG4gICAgICAgICAgICBuYW1lOiAndHJpcCcsXG4gICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgJHVybDogJ2VudGVyJ1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICBjb25zdCBjdXJyZW50VHJpcCA9IHRyaXBzJC5yZXN1bHQuZGF0YVsgMCBdO1xuICAgICAgICBcbiAgICAgICAgaWYgKCAhY3VycmVudFRyaXAgKSB7IFxuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBzdGF0dXM6IDIwMFxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgdGlkID0gY3VycmVudFRyaXAuX2lkO1xuXG4gICAgICAgIC8vIOaLv+WIsOaJgOacieivpeihjOeoi+S4i+eahOW3suS7mOiuoumHkeiuouWNlVxuICAgICAgICBjb25zdCBmaW5kMSQgPSBhd2FpdCBkYi5jb2xsZWN0aW9uKCdvcmRlcicpXG4gICAgICAgICAgICAud2hlcmUoe1xuICAgICAgICAgICAgICAgIHRpZCxcbiAgICAgICAgICAgICAgICBwYXlfc3RhdHVzOiAnMSdcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAuZ2V0KCApO1xuXG4gICAgICAgIGlmICggZmluZDEkLmRhdGEubGVuZ3RoID09PSAwICkgeyBcbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgc3RhdHVzOiAyMDBcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC8vIOaLv+WIsOivpeihjOeoi+S4i+eahOi0reeJqea4heWNlVxuICAgICAgICBjb25zdCBmaW5kMiQgPSBhd2FpdCBkYi5jb2xsZWN0aW9uKCdzaG9wcGluZy1saXN0JylcbiAgICAgICAgICAgIC53aGVyZSh7XG4gICAgICAgICAgICAgICAgdGlkXG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLmdldCggKTtcblxuICAgICAgICBjb25zdCB0cmlwU2hvcHBpbmdMaXN0ID0gZmluZDIkLmRhdGE7IFxuICAgICAgICBcbiAgICAgICAgLyoqXG4gICAgICAgICAqIOi3n+a4heWNlei/m+ihjOWMuemFjVxuICAgICAgICAgKiAxLiDor6XorqLljZXnmoTllYblk4Ev5Z6L5Y+36L+Y5rKh5pyJ5Lu75L2V5riF5Y2VXG4gICAgICAgICAqIDIuIOivpeiuouWNleayoeacieWcqOW3suacieWQjOasvuWVhuWTgS/lnovlj7fnmoTmuIXljZXph4zpnaJcbiAgICAgICAgICovXG5cbiAgICAgICAgZmluZDEkLmRhdGEubWFwKCBvcmRlciA9PiB7XG5cbiAgICAgICAgICAgIGNvbnN0IHsgc2lkLCBwaWQsIF9pZCB9ID0gb3JkZXI7XG4gICAgICAgICAgICBjb25zdCBjdXJyZW50R29vZFNob3BwaW5nTGlzdCA9IHRyaXBTaG9wcGluZ0xpc3QuZmluZCggeCA9PiB4LnNpZCA9PT0gc2lkICYmIHgucGlkID09PSBwaWQgKTtcblxuICAgICAgICAgICAgaWYgKCAhY3VycmVudEdvb2RTaG9wcGluZ0xpc3QgKSB7XG4gICAgICAgICAgICAgICAgbG9zdE9yZGVycy5wdXNoKHtcbiAgICAgICAgICAgICAgICAgICAgdGlkLFxuICAgICAgICAgICAgICAgICAgICBzaWQsXG4gICAgICAgICAgICAgICAgICAgIHBpZCxcbiAgICAgICAgICAgICAgICAgICAgb2lkOiBfaWRcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBjb25zdCB7IG9pZHMgfSA9IGN1cnJlbnRHb29kU2hvcHBpbmdMaXN0O1xuICAgICAgICAgICAgICAgIGlmICggIW9pZHMuZmluZCggeCA9PiB4ID09PSBfaWQgKSkge1xuICAgICAgICAgICAgICAgICAgICBsb3N0T3JkZXJzLnB1c2goe1xuICAgICAgICAgICAgICAgICAgICAgICAgdGlkLFxuICAgICAgICAgICAgICAgICAgICAgICAgc2lkLFxuICAgICAgICAgICAgICAgICAgICAgICAgcGlkLFxuICAgICAgICAgICAgICAgICAgICAgICAgb2lkOiBfaWRcbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfSk7XG5cbiAgICAgICAgaWYgKCBsb3N0T3JkZXJzLmxlbmd0aCA9PT0gMCApIHtcbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgc3RhdHVzOiAyMDBcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGF3YWl0IGNsb3VkLmNhbGxGdW5jdGlvbih7XG4gICAgICAgICAgICBuYW1lOiAnc2hvcHBpbmctbGlzdCcsXG4gICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgJHVybDogJ2NyZWF0ZScsXG4gICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgICBsaXN0OiBsb3N0T3JkZXJzXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBzdGF0dXM6IDIwMCxcbiAgICAgICAgICAgIGRhdGE6IGxvc3RPcmRlcnNcbiAgICAgICAgfVxuXG4gICAgfSBjYXRjaCAoIGUgKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKCchISEh5a6a5pe25Zmo6K6i5Y2VY2F0Y2hMb3N0T3JkZXJz6ZSZ6K+vJywpXG4gICAgICAgIHJldHVybiB7IHN0YXR1czogNTAwIH07XG4gICAgfVxufSJdfQ==