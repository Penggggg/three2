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
exports.main = function (event, context) { return __awaiter(_this, void 0, void 0, function () {
    var openid, meta$, goodsDetails$_1, e_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                openid = event.userInfo.openId;
                return [4, db.collection('cart')
                        .where({
                        openid: openid
                    })
                        .get()];
            case 1:
                meta$ = _a.sent();
                return [4, Promise.all(meta$.data.map(function (cart) {
                        return cloud.callFunction({
                            data: {
                                _id: cart.pid
                            },
                            name: 'api-goods-detail'
                        }).then(function (res) {
                            return {
                                cart: cart,
                                detail: res.result.data
                            };
                        });
                    }))];
            case 2:
                goodsDetails$_1 = _a.sent();
                return [2, new Promise(function (resolve) {
                        resolve({
                            status: 200,
                            data: goodsDetails$_1
                        });
                    })];
            case 3:
                e_1 = _a.sent();
                return [2, new Promise(function (resolve) {
                        resolve({
                            status: 500,
                            data: JSON.stringify(e_1)
                        });
                    })];
            case 4: return [2];
        }
    });
}); };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFDQSxpQkE4REM7O0FBOURELHFDQUF1QztBQUV2QyxLQUFLLENBQUMsSUFBSSxFQUFFLENBQUM7QUFFYixJQUFNLEVBQUUsR0FBZ0IsS0FBSyxDQUFDLFFBQVEsRUFBRSxDQUFDO0FBaUI1QixRQUFBLElBQUksR0FBRyxVQUFPLEtBQUssRUFBRSxPQUFPOzs7Ozs7Z0JBSTNCLE1BQU0sR0FBRyxLQUFLLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQztnQkFDdkIsV0FBTSxFQUFFLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQzt5QkFDeEIsS0FBSyxDQUFDO3dCQUNILE1BQU0sUUFBQTtxQkFDVCxDQUFDO3lCQUNELEdBQUcsRUFBRyxFQUFBOztnQkFKakIsS0FBSyxHQUFHLFNBSVM7Z0JBR0QsV0FBTSxPQUFPLENBQUMsR0FBRyxDQUFFLEtBQUssQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFFLFVBQUEsSUFBSTt3QkFDekQsT0FBTyxLQUFLLENBQUMsWUFBWSxDQUFDOzRCQUN0QixJQUFJLEVBQUU7Z0NBQ0YsR0FBRyxFQUFFLElBQUksQ0FBQyxHQUFHOzZCQUNoQjs0QkFDRCxJQUFJLEVBQUUsa0JBQWtCO3lCQUMzQixDQUFDLENBQUMsSUFBSSxDQUFFLFVBQUEsR0FBRzs0QkFDUixPQUFPO2dDQUNILElBQUksTUFBQTtnQ0FDSixNQUFNLEVBQUUsR0FBRyxDQUFDLE1BQU0sQ0FBQyxJQUFJOzZCQUMxQixDQUFBO3dCQUNMLENBQUMsQ0FBQyxDQUFBO29CQUNOLENBQUMsQ0FBQyxDQUFDLEVBQUE7O2dCQVpHLGtCQUFnQixTQVluQjtnQkFFSCxXQUFPLElBQUksT0FBTyxDQUFFLFVBQUEsT0FBTzt3QkFDdkIsT0FBTyxDQUFDOzRCQUNKLE1BQU0sRUFBRSxHQUFHOzRCQUNYLElBQUksRUFBRSxlQUFhO3lCQUN0QixDQUFDLENBQUM7b0JBQ1AsQ0FBQyxDQUFDLEVBQUM7OztnQkFFSCxXQUFPLElBQUksT0FBTyxDQUFFLFVBQUEsT0FBTzt3QkFDdkIsT0FBTyxDQUFDOzRCQUNKLE1BQU0sRUFBRSxHQUFHOzRCQUNYLElBQUksRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFFLEdBQUMsQ0FBRTt5QkFDNUIsQ0FBQyxDQUFDO29CQUNQLENBQUMsQ0FBQyxFQUFDOzs7O0tBR1YsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbIi8vIOS6keWHveaVsOWFpeWPo+aWh+S7tlxuaW1wb3J0ICogYXMgY2xvdWQgZnJvbSAnd3gtc2VydmVyLXNkayc7XG5cbmNsb3VkLmluaXQoKTtcblxuY29uc3QgZGI6IERCLkRhdGFiYXNlID0gY2xvdWQuZGF0YWJhc2UoKTtcblxuXG4vKipcbiAqIOi0reeJqei9pmxpZSDnmb3lk6ZcbiAqIHJlcToge1xuICogICAgICBvcGVuaWRcbiAqIH1cbiAqIFxuICogcmVzOiB7XG4gKiAgICAgIHN0YXR1czogMjAwLzUwMFxuICogICAgICBkYXRhOiBBcnJheTx7XG4gKiAgICAgICAgICBjYXJ0OiBjYXJ06K+m5oOF77yMXG4gKiAgICAgICAgICBkZXRhaWw6IHByb2R1Y3QgKyBzdGFuZGFyZHPor6bmg4VcbiAqICAgICAgfT5cbiAqIH1cbiAqL1xuZXhwb3J0IGNvbnN0IG1haW4gPSBhc3luYyAoZXZlbnQsIGNvbnRleHQpID0+IHtcblxuICAgIHRyeSB7XG5cbiAgICAgICAgY29uc3Qgb3BlbmlkID0gZXZlbnQudXNlckluZm8ub3BlbklkO1xuICAgICAgICBjb25zdCBtZXRhJCA9IGF3YWl0IGRiLmNvbGxlY3Rpb24oJ2NhcnQnKVxuICAgICAgICAgICAgICAgICAgICAgICAgLndoZXJlKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvcGVuaWRcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgICAgICAuZ2V0KCApO1xuICAgICAgICBcbiAgICAgICAgLy8g6ZyA6KaB5p+l6K+iIOWVhuWTgeivpuaDhVxuICAgICAgICBjb25zdCBnb29kc0RldGFpbHMkID0gYXdhaXQgUHJvbWlzZS5hbGwoIG1ldGEkLmRhdGEubWFwKCBjYXJ0ID0+IHtcbiAgICAgICAgICAgIHJldHVybiBjbG91ZC5jYWxsRnVuY3Rpb24oe1xuICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgX2lkOiBjYXJ0LnBpZFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgbmFtZTogJ2FwaS1nb29kcy1kZXRhaWwnXG4gICAgICAgICAgICB9KS50aGVuKCByZXMgPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgICAgIGNhcnQsXG4gICAgICAgICAgICAgICAgICAgIGRldGFpbDogcmVzLnJlc3VsdC5kYXRhXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSlcbiAgICAgICAgfSkpO1xuXG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSggcmVzb2x2ZSA9PiB7XG4gICAgICAgICAgICByZXNvbHZlKHtcbiAgICAgICAgICAgICAgICBzdGF0dXM6IDIwMCxcbiAgICAgICAgICAgICAgICBkYXRhOiBnb29kc0RldGFpbHMkXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfSBjYXRjaCggZSApIHtcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKCByZXNvbHZlID0+IHtcbiAgICAgICAgICAgIHJlc29sdmUoe1xuICAgICAgICAgICAgICAgIHN0YXR1czogNTAwLFxuICAgICAgICAgICAgICAgIGRhdGE6IEpTT04uc3RyaW5naWZ5KCBlIClcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9XG5cbn0iXX0=