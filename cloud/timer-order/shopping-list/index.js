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
                console.log('...', lostOrders_1);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSxpQkEySEM7O0FBM0hELHFDQUF1QztBQUV2QyxLQUFLLENBQUMsSUFBSSxFQUFHLENBQUM7QUFFZCxJQUFNLEVBQUUsR0FBZ0IsS0FBSyxDQUFDLFFBQVEsRUFBRyxDQUFDO0FBQzFDLElBQU0sQ0FBQyxHQUFHLEVBQUUsQ0FBQyxPQUFPLENBQUM7QUFLUixRQUFBLGVBQWUsR0FBRzs7Ozs7O2dCQU1qQixlQUtDLEVBQUcsQ0FBQztnQkFHSSxXQUFNLEtBQUssQ0FBQyxZQUFZLENBQUM7d0JBQ3BDLElBQUksRUFBRSxNQUFNO3dCQUNaLElBQUksRUFBRTs0QkFDRixJQUFJLEVBQUUsT0FBTzt5QkFDaEI7cUJBQ0osQ0FBQyxFQUFBOztnQkFMSSxNQUFNLEdBQUcsU0FLYjtnQkFFSSxXQUFXLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUUsQ0FBQyxDQUFFLENBQUM7Z0JBRTVDLElBQUssQ0FBQyxXQUFXLEVBQUc7b0JBQ2hCLFdBQU87NEJBQ0gsTUFBTSxFQUFFLEdBQUc7eUJBQ2QsRUFBQTtpQkFDSjtnQkFFSyxRQUFNLFdBQVcsQ0FBQyxHQUFHLENBQUM7Z0JBR2IsV0FBTSxFQUFFLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQzt5QkFDdEMsS0FBSyxDQUFDO3dCQUNILEdBQUcsT0FBQTt3QkFDSCxVQUFVLEVBQUUsR0FBRztxQkFDbEIsQ0FBQzt5QkFDRCxHQUFHLEVBQUcsRUFBQTs7Z0JBTEwsTUFBTSxHQUFHLFNBS0o7Z0JBRVgsSUFBSyxNQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sS0FBSyxDQUFDLEVBQUc7b0JBQzVCLFdBQU87NEJBQ0gsTUFBTSxFQUFFLEdBQUc7eUJBQ2QsRUFBQTtpQkFDSjtnQkFHYyxXQUFNLEVBQUUsQ0FBQyxVQUFVLENBQUMsZUFBZSxDQUFDO3lCQUM5QyxLQUFLLENBQUM7d0JBQ0gsR0FBRyxPQUFBO3FCQUNOLENBQUM7eUJBQ0QsR0FBRyxFQUFHLEVBQUE7O2dCQUpMLE1BQU0sR0FBRyxTQUlKO2dCQUVMLHFCQUFtQixNQUFNLENBQUMsSUFBSSxDQUFDO2dCQVFyQyxNQUFNLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBRSxVQUFBLEtBQUs7b0JBRVYsSUFBQSxlQUFHLEVBQUUsZUFBRyxFQUFFLGVBQUcsQ0FBVztvQkFDaEMsSUFBTSx1QkFBdUIsR0FBRyxrQkFBZ0IsQ0FBQyxJQUFJLENBQUUsVUFBQSxDQUFDLElBQUksT0FBQSxDQUFDLENBQUMsR0FBRyxLQUFLLEdBQUcsSUFBSSxDQUFDLENBQUMsR0FBRyxLQUFLLEdBQUcsRUFBOUIsQ0FBOEIsQ0FBRSxDQUFDO29CQUU3RixJQUFLLENBQUMsdUJBQXVCLEVBQUc7d0JBQzVCLFlBQVUsQ0FBQyxJQUFJLENBQUM7NEJBQ1osR0FBRyxPQUFBOzRCQUNILEdBQUcsS0FBQTs0QkFDSCxHQUFHLEtBQUE7NEJBQ0gsR0FBRyxFQUFFLEdBQUc7eUJBQ1gsQ0FBQyxDQUFBO3FCQUNMO3lCQUFNO3dCQUNLLElBQUEsbUNBQUksQ0FBNkI7d0JBQ3pDLElBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFFLFVBQUEsQ0FBQyxJQUFJLE9BQUEsQ0FBQyxLQUFLLEdBQUcsRUFBVCxDQUFTLENBQUUsRUFBRTs0QkFDL0IsWUFBVSxDQUFDLElBQUksQ0FBQztnQ0FDWixHQUFHLE9BQUE7Z0NBQ0gsR0FBRyxLQUFBO2dDQUNILEdBQUcsS0FBQTtnQ0FDSCxHQUFHLEVBQUUsR0FBRzs2QkFDWCxDQUFDLENBQUE7eUJBQ0w7cUJBQ0o7Z0JBRUwsQ0FBQyxDQUFDLENBQUM7Z0JBRUgsSUFBSyxZQUFVLENBQUMsTUFBTSxLQUFLLENBQUMsRUFBRztvQkFDM0IsV0FBTzs0QkFDSCxNQUFNLEVBQUUsR0FBRzt5QkFDZCxFQUFBO2lCQUNKO2dCQUVELFdBQU0sS0FBSyxDQUFDLFlBQVksQ0FBQzt3QkFDckIsSUFBSSxFQUFFLGVBQWU7d0JBQ3JCLElBQUksRUFBRTs0QkFDRixJQUFJLEVBQUUsUUFBUTs0QkFDZCxJQUFJLEVBQUU7Z0NBQ0YsSUFBSSxFQUFFLFlBQVU7NkJBQ25CO3lCQUNKO3FCQUNKLENBQUMsRUFBQTs7Z0JBUkYsU0FRRSxDQUFDO2dCQUVILE9BQU8sQ0FBQyxHQUFHLENBQUMsS0FBSyxFQUFFLFlBQVUsQ0FBRSxDQUFBO2dCQUUvQixXQUFPO3dCQUNILE1BQU0sRUFBRSxHQUFHO3dCQUNYLElBQUksRUFBRSxZQUFVO3FCQUNuQixFQUFBOzs7Z0JBR0QsT0FBTyxDQUFDLEdBQUcsQ0FBQyw0QkFBNEIsQ0FBRSxDQUFBO2dCQUMxQyxXQUFPLEVBQUUsTUFBTSxFQUFFLEdBQUcsRUFBRSxFQUFDOzs7O0tBRTlCLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBjbG91ZCBmcm9tICd3eC1zZXJ2ZXItc2RrJztcblxuY2xvdWQuaW5pdCggKTtcblxuY29uc3QgZGI6IERCLkRhdGFiYXNlID0gY2xvdWQuZGF0YWJhc2UoICk7XG5jb25zdCBfID0gZGIuY29tbWFuZDtcblxuLyoqXG4gKiDmuIXljZUx77ya5p+l6K+i5pyq6KKr5a6J5o6S6L+b5riF5Y2V55qE6K6i5Y2V77yIcGF5X3N0YXR1czogMSDnmoRvcmRlcu+8iVxuICovXG5leHBvcnQgY29uc3QgY2F0Y2hMb3N0T3JkZXJzID0gYXN5bmMgKCApID0+IHtcbiAgICB0cnkge1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiDmnKrooqvlronmjpLnmoTorqLljZVcbiAgICAgICAgICovXG4gICAgICAgIGNvbnN0IGxvc3RPcmRlcnM6IHtcbiAgICAgICAgICAgIHRpZCxcbiAgICAgICAgICAgIHBpZCxcbiAgICAgICAgICAgIHNpZCxcbiAgICAgICAgICAgIG9pZFxuICAgICAgICB9WyBdID0gWyBdO1xuXG4gICAgICAgIC8vIOiOt+WPluW9k+WJjei/m+ihjOS4reeahOihjOeoi1xuICAgICAgICBjb25zdCB0cmlwcyQgPSBhd2FpdCBjbG91ZC5jYWxsRnVuY3Rpb24oe1xuICAgICAgICAgICAgbmFtZTogJ3RyaXAnLFxuICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICR1cmw6ICdlbnRlcidcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgY29uc3QgY3VycmVudFRyaXAgPSB0cmlwcyQucmVzdWx0LmRhdGFbIDAgXTtcbiAgICAgICAgXG4gICAgICAgIGlmICggIWN1cnJlbnRUcmlwICkgeyBcbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgc3RhdHVzOiAyMDBcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IHRpZCA9IGN1cnJlbnRUcmlwLl9pZDtcblxuICAgICAgICAvLyDmi7/liLDmiYDmnInor6XooYznqIvkuIvnmoTlt7Lku5jorqLph5HorqLljZVcbiAgICAgICAgY29uc3QgZmluZDEkID0gYXdhaXQgZGIuY29sbGVjdGlvbignb3JkZXInKVxuICAgICAgICAgICAgLndoZXJlKHtcbiAgICAgICAgICAgICAgICB0aWQsXG4gICAgICAgICAgICAgICAgcGF5X3N0YXR1czogJzEnXG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLmdldCggKTtcblxuICAgICAgICBpZiAoIGZpbmQxJC5kYXRhLmxlbmd0aCA9PT0gMCApIHsgXG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIHN0YXR1czogMjAwXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvLyDmi7/liLDor6XooYznqIvkuIvnmoTotK3nianmuIXljZVcbiAgICAgICAgY29uc3QgZmluZDIkID0gYXdhaXQgZGIuY29sbGVjdGlvbignc2hvcHBpbmctbGlzdCcpXG4gICAgICAgICAgICAud2hlcmUoe1xuICAgICAgICAgICAgICAgIHRpZFxuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC5nZXQoICk7XG5cbiAgICAgICAgY29uc3QgdHJpcFNob3BwaW5nTGlzdCA9IGZpbmQyJC5kYXRhOyBcbiAgICAgICAgXG4gICAgICAgIC8qKlxuICAgICAgICAgKiDot5/muIXljZXov5vooYzljLnphY1cbiAgICAgICAgICogMS4g6K+l6K6i5Y2V55qE5ZWG5ZOBL+Wei+WPt+i/mOayoeacieS7u+S9lea4heWNlVxuICAgICAgICAgKiAyLiDor6XorqLljZXmsqHmnInlnKjlt7LmnInlkIzmrL7llYblk4Ev5Z6L5Y+355qE5riF5Y2V6YeM6Z2iXG4gICAgICAgICAqL1xuXG4gICAgICAgIGZpbmQxJC5kYXRhLm1hcCggb3JkZXIgPT4ge1xuXG4gICAgICAgICAgICBjb25zdCB7IHNpZCwgcGlkLCBfaWQgfSA9IG9yZGVyO1xuICAgICAgICAgICAgY29uc3QgY3VycmVudEdvb2RTaG9wcGluZ0xpc3QgPSB0cmlwU2hvcHBpbmdMaXN0LmZpbmQoIHggPT4geC5zaWQgPT09IHNpZCAmJiB4LnBpZCA9PT0gcGlkICk7XG5cbiAgICAgICAgICAgIGlmICggIWN1cnJlbnRHb29kU2hvcHBpbmdMaXN0ICkge1xuICAgICAgICAgICAgICAgIGxvc3RPcmRlcnMucHVzaCh7XG4gICAgICAgICAgICAgICAgICAgIHRpZCxcbiAgICAgICAgICAgICAgICAgICAgc2lkLFxuICAgICAgICAgICAgICAgICAgICBwaWQsXG4gICAgICAgICAgICAgICAgICAgIG9pZDogX2lkXG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgY29uc3QgeyBvaWRzIH0gPSBjdXJyZW50R29vZFNob3BwaW5nTGlzdDtcbiAgICAgICAgICAgICAgICBpZiAoICFvaWRzLmZpbmQoIHggPT4geCA9PT0gX2lkICkpIHtcbiAgICAgICAgICAgICAgICAgICAgbG9zdE9yZGVycy5wdXNoKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRpZCxcbiAgICAgICAgICAgICAgICAgICAgICAgIHNpZCxcbiAgICAgICAgICAgICAgICAgICAgICAgIHBpZCxcbiAgICAgICAgICAgICAgICAgICAgICAgIG9pZDogX2lkXG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgIH0pO1xuXG4gICAgICAgIGlmICggbG9zdE9yZGVycy5sZW5ndGggPT09IDAgKSB7XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIHN0YXR1czogMjAwXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBhd2FpdCBjbG91ZC5jYWxsRnVuY3Rpb24oe1xuICAgICAgICAgICAgbmFtZTogJ3Nob3BwaW5nLWxpc3QnLFxuICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICR1cmw6ICdjcmVhdGUnLFxuICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgbGlzdDogbG9zdE9yZGVyc1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIFxuICAgICAgICBjb25zb2xlLmxvZygnLi4uJywgbG9zdE9yZGVycyApXG5cbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHN0YXR1czogMjAwLFxuICAgICAgICAgICAgZGF0YTogbG9zdE9yZGVyc1xuICAgICAgICB9XG5cbiAgICB9IGNhdGNoICggZSApIHtcbiAgICAgICAgY29uc29sZS5sb2coJyEhISHlrprml7blmajorqLljZVjYXRjaExvc3RPcmRlcnPplJnor68nLClcbiAgICAgICAgcmV0dXJuIHsgc3RhdHVzOiA1MDAgfTtcbiAgICB9XG59Il19