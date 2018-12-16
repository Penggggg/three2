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
var TcbRouter = require("tcb-router");
cloud.init();
var db = cloud.database();
exports.main = function (event, context) { return __awaiter(_this, void 0, void 0, function () {
    var app;
    var _this = this;
    return __generator(this, function (_a) {
        app = new TcbRouter({ event: event });
        app.router('create', function (ctx, next) { return __awaiter(_this, void 0, void 0, function () {
            var _a, from, orders, trips$, trip_1, openid_1, addressid$, base_status, deliver_status, aid_1, temp, e_1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 4, , 5]);
                        _a = event.data, from = _a.from, orders = _a.orders;
                        return [4, cloud.callFunction({
                                data: {},
                                name: 'api-trip-enter'
                            })];
                    case 1:
                        trips$ = _b.sent();
                        if (trips$.result.status !== 200 || !trips$.result.data || !trips$.result.data[0]) {
                            return [2, ctx.body = {
                                    status: 400,
                                    message: "\u6CA1\u6709\u6700\u65B0\u884C\u7A0B\uFF0C\u6682\u65F6\u65E0\u6CD5\u7ED3\u7B97\uFF01"
                                }];
                        }
                        trip_1 = trips$.result.data[0];
                        openid_1 = event.data.openId;
                        addressid$ = {
                            result: {
                                data: null,
                                status: 500
                            }
                        };
                        base_status = '0';
                        deliver_status = '0';
                        if (!(event.data.from === 'cart')) return [3, 3];
                        return [4, cloud.callFunction({
                                data: {
                                    data: {
                                        address: event.data.orders[0].address
                                    },
                                    $url: 'getAddressId'
                                },
                                name: 'address'
                            })];
                    case 2:
                        addressid$ = _b.sent();
                        _b.label = 3;
                    case 3:
                        if (addressid$.result.status !== 200) {
                            return [2, ctx.body = {
                                    status: 500,
                                    message: '查询地址错误'
                                }];
                        }
                        aid_1 = addressid$.result.data;
                        temp = event.data.orders.map(function (meta) {
                            return Object.assign({}, meta, {
                                aid: aid_1,
                                tid: trip_1._id,
                                openid: openid_1,
                                createTime: new Date().getTime(),
                            });
                        });
                        return [2, ctx.body = {
                                status: 200,
                                data: aid_1
                            }];
                    case 4:
                        e_1 = _b.sent();
                        return [2, ctx.body = {
                                status: 500,
                                message: e_1
                            }];
                    case 5: return [2];
                }
            });
        }); });
        return [2, app.serve()];
    });
}); };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFDQSxpQkE2SUM7O0FBN0lELHFDQUF1QztBQUN2QyxzQ0FBd0M7QUFFeEMsS0FBSyxDQUFDLElBQUksRUFBRyxDQUFDO0FBRWQsSUFBTSxFQUFFLEdBQWdCLEtBQUssQ0FBQyxRQUFRLEVBQUcsQ0FBQztBQTBCN0IsUUFBQSxJQUFJLEdBQUcsVUFBUSxLQUFLLEVBQUUsT0FBTzs7OztRQUVoQyxHQUFHLEdBQUcsSUFBSSxTQUFTLENBQUMsRUFBRSxLQUFLLE9BQUEsRUFBRSxDQUFDLENBQUM7UUF5QnJDLEdBQUcsQ0FBQyxNQUFNLENBQUMsUUFBUSxFQUFFLFVBQU8sR0FBRyxFQUFFLElBQUk7Ozs7Ozt3QkFHdkIsS0FBbUIsS0FBSyxDQUFDLElBQUksRUFBM0IsSUFBSSxVQUFBLEVBQUUsTUFBTSxZQUFBLENBQWdCO3dCQUNyQixXQUFNLEtBQUssQ0FBQyxZQUFZLENBQUM7Z0NBQ3BDLElBQUksRUFBRSxFQUFHO2dDQUNULElBQUksRUFBRSxnQkFBZ0I7NkJBQ3pCLENBQUMsRUFBQTs7d0JBSEksTUFBTSxHQUFHLFNBR2I7d0JBR0YsSUFBSyxNQUFNLENBQUMsTUFBTSxDQUFDLE1BQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLElBQUksSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFFLENBQUMsQ0FBRSxFQUFFOzRCQUNsRixXQUFPLEdBQUcsQ0FBQyxJQUFJLEdBQUc7b0NBQ2QsTUFBTSxFQUFFLEdBQUc7b0NBQ1gsT0FBTyxFQUFFLHNGQUFnQjtpQ0FDNUIsRUFBQzt5QkFDTDt3QkFHSyxTQUFPLE1BQU0sQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFFLENBQUMsQ0FBRSxDQUFDO3dCQUVqQyxXQUFTLEtBQUssQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDO3dCQUczQixVQUFVLEdBQUc7NEJBQ2IsTUFBTSxFQUFFO2dDQUNKLElBQUksRUFBRSxJQUFJO2dDQUNWLE1BQU0sRUFBRSxHQUFHOzZCQUNkO3lCQUNKLENBQUM7d0JBQ0UsV0FBVyxHQUFHLEdBQUcsQ0FBQzt3QkFDbEIsY0FBYyxHQUFHLEdBQUcsQ0FBQTs2QkFLbkIsQ0FBQSxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksS0FBSyxNQUFNLENBQUEsRUFBMUIsY0FBMEI7d0JBQ2QsV0FBTSxLQUFLLENBQUMsWUFBWSxDQUFDO2dDQUNsQyxJQUFJLEVBQUU7b0NBQ0YsSUFBSSxFQUFFO3dDQUNGLE9BQU8sRUFBRSxLQUFLLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBRSxDQUFDLENBQUUsQ0FBQyxPQUFPO3FDQUMxQztvQ0FDRCxJQUFJLEVBQUUsY0FBYztpQ0FDdkI7Z0NBQ0QsSUFBSSxFQUFFLFNBQVM7NkJBQ2xCLENBQUMsRUFBQTs7d0JBUkYsVUFBVSxHQUFHLFNBUVgsQ0FBQzs7O3dCQUdQLElBQUssVUFBVSxDQUFDLE1BQU0sQ0FBQyxNQUFNLEtBQUssR0FBRyxFQUFHOzRCQUNwQyxXQUFPLEdBQUcsQ0FBQyxJQUFJLEdBQUc7b0NBQ2QsTUFBTSxFQUFFLEdBQUc7b0NBQ1gsT0FBTyxFQUFFLFFBQVE7aUNBQ3BCLEVBQUM7eUJBQ0w7d0JBR0ssUUFBTSxVQUFVLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQzt3QkFHN0IsSUFBSSxHQUFHLEtBQUssQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBRSxVQUFBLElBQUk7NEJBQ3BDLE9BQU8sTUFBTSxDQUFDLE1BQU0sQ0FBQyxFQUFHLEVBQUUsSUFBSSxFQUFFO2dDQUM1QixHQUFHLE9BQUE7Z0NBQ0gsR0FBRyxFQUFFLE1BQUksQ0FBQyxHQUFHO2dDQUNiLE1BQU0sRUFBRSxRQUFNO2dDQUNkLFVBQVUsRUFBRSxJQUFJLElBQUksRUFBRyxDQUFDLE9BQU8sRUFBRzs2QkFDckMsQ0FBQyxDQUFDO3dCQUNQLENBQUMsQ0FBQyxDQUFDO3dCQUVILFdBQU8sR0FBRyxDQUFDLElBQUksR0FBRztnQ0FDZCxNQUFNLEVBQUUsR0FBRztnQ0FDWCxJQUFJLEVBQUUsS0FBRzs2QkFDWixFQUFDOzs7d0JBSUYsV0FBTyxHQUFHLENBQUMsSUFBSSxHQUFHO2dDQUNkLE1BQU0sRUFBRSxHQUFHO2dDQUNYLE9BQU8sRUFBRSxHQUFDOzZCQUNiLEVBQUM7Ozs7YUFFVCxDQUFDLENBQUM7UUFFSCxXQUFPLEdBQUcsQ0FBQyxLQUFLLEVBQUcsRUFBQzs7S0FFdkIsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbIlxuaW1wb3J0ICogYXMgY2xvdWQgZnJvbSAnd3gtc2VydmVyLXNkayc7XG5pbXBvcnQgKiBhcyBUY2JSb3V0ZXIgZnJvbSAndGNiLXJvdXRlcic7XG5cbmNsb3VkLmluaXQoICk7XG5cbmNvbnN0IGRiOiBEQi5EYXRhYmFzZSA9IGNsb3VkLmRhdGFiYXNlKCApO1xuXG4vKipcbiAqIFxuICogQGRlc2NyaXB0aW9uIOiuouWNleaooeWdl1xuICogLS0tLS0tLS0g5a2X5q61IC0tLS0tLS0tLS1cbiAqIF9pZFxuICogb3BlbmlkLFxuICogY3JlYXRldGltZVxuICogdGlkLFxuICogcGlkLFxuICogISBzaWQsICjlj6/kuLrnqbopXG4gKiBjb3VudCxcbiAqIHByaWNlLFxuICogdHlwZTogJ2N1c3RvbScgfCAnbm9ybWFsJyDoh6rlrprkuYnliqDljZXjgIHmma7pgJrliqDljZVcbiAqIGltZzogQXJyYXlbIHN0cmluZyBdXG4gKiBkZXNjLFxuICogYWlkXG4gICAgICAgICogdXNlcm5hbWUsIOaUtui0p+S6ulxuICAgICAgICAqIHBvc3RhbGNvZGUsIOmCruaUv1xuICAgICAgICAqIHBob25lLCDmlLbojrfnlLXor51cbiAgICAgICAgKiBhZGRyZXNzLCDmlLbojrflnLDlnYBcbiAqIGJhc2Vfc3RhdHVzOiAwLDEsMiwzIOWHhuWkh+S4re+8jOi/m+ihjOS4re+8jOW3suiwg+aVtO+8jOW3sue7k+eul1xuICogcGF5X3N0YXR1czogMCwxLDIg5pyq5LuY5qy+77yM5bey5LuY6K6i6YeR77yM5bey5LuY5YWo5qy+XG4gKiBkZWxpdmVyX3N0YXR1czogMCwxIOacquWPkeW4g++8jOW3suWPkeW4g+OAgVxuICovXG5leHBvcnQgY29uc3QgbWFpbiA9IGFzeW5jICggZXZlbnQsIGNvbnRleHQgKSA9PiB7XG5cbiAgICBjb25zdCBhcHAgPSBuZXcgVGNiUm91dGVyKHsgZXZlbnQgfSk7XG5cbiAgICAvKipcbiAgICAgKiBAZGVzY3JpcHRpb24g5Yib5bu66K6i5Y2VXG4gICAgICogLS0tLS0tLS0g6K+35rGCIC0tLS0tLS0tLS1cbiAgICAgKiB7XG4gICAgICogICAgICBmcm9tOiAnY2FydCcgfCAnYnV5JyB8ICdjdXN0b20nIHwgJ2FnZW50cycg5p2l5rqQ77ya6LSt54mp6L2m44CB55u05o6l6LSt5Lmw44CB6Ieq5a6a5LmJ5LiL5Y2V44CB5Luj6LSt5LiL5Y2VXG4gICAgICogICAgICBvcmRlcnM6IEFycmF5PHtcbiAgICAgKiAgICAgICAgICBzaWRcbiAgICAgKiAgICAgICAgICBwaWRcbiAgICAgKiAgICAgICAgICBwcmljZVxuICAgICAqICAgICAgICAgIGNvdW50XG4gICAgICogICAgICAgICAgZGVzY1xuICAgICAqICAgICAgICAgIGltZ1xuICAgICAqICAgICAgICAgIHR5cGVcbiAgICAgKiAgICAgICAgICBwYXlfc3RhdHVzLFxuICAgICAqICAgICAgICAgIGFkZHJlc3M6IHtcbiAgICAgKiAgICAgICAgICAgICAgbmFtZSxcbiAgICAgKiAgICAgICAgICAgICAgcGhvbmUsXG4gICAgICogICAgICAgICAgICAgIGRldGFpbCxcbiAgICAgKiAgICAgICAgICAgICAgcG9zdGFsY29kZVxuICAgICAqICAgICAgICAgIH1cbiAgICAgKiAgICAgIH0+XG4gICAgICogfVxuICAgICAqL1xuICAgIGFwcC5yb3V0ZXIoJ2NyZWF0ZScsIGFzeW5jKCBjdHgsIG5leHQgKSA9PiB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGNvbnN0IHsgZnJvbSwgb3JkZXJzIH0gPSBldmVudC5kYXRhO1xuICAgICAgICAgICAgY29uc3QgdHJpcHMkID0gYXdhaXQgY2xvdWQuY2FsbEZ1bmN0aW9uKHtcbiAgICAgICAgICAgICAgICBkYXRhOiB7IH0sXG4gICAgICAgICAgICAgICAgbmFtZTogJ2FwaS10cmlwLWVudGVyJ1xuICAgICAgICAgICAgfSk7XG4gICAgXG4gICAgICAgICAgICAvLyDliKTmlq3mnInmsqHmnInlj6/nlKjooYznqItcbiAgICAgICAgICAgIGlmICggdHJpcHMkLnJlc3VsdC5zdGF0dXMgIT09IDIwMCB8fCAhdHJpcHMkLnJlc3VsdC5kYXRhIHx8ICF0cmlwcyQucmVzdWx0LmRhdGFbIDAgXSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBjdHguYm9keSA9IHtcbiAgICAgICAgICAgICAgICAgICAgc3RhdHVzOiA0MDAsXG4gICAgICAgICAgICAgICAgICAgIG1lc3NhZ2U6IGDmsqHmnInmnIDmlrDooYznqIvvvIzmmoLml7bml6Dms5Xnu5PnrpfvvIFgXG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8g5pyA5paw5Y+v55So6KGM56iLXG4gICAgICAgICAgICBjb25zdCB0cmlwID0gdHJpcHMkLnJlc3VsdC5kYXRhWyAwIF07XG4gICAgICAgICAgICAvLyDorqLljZXkuLvkurrnmoRvcGVuaWRcbiAgICAgICAgICAgIGxldCBvcGVuaWQgPSBldmVudC5kYXRhLm9wZW5JZDtcblxuICAgICAgICAgICAgLy8g5qC55o2u5Zyw5Z2A5a+56LGh77yM5ou/5Yiw5Zyw5Z2AaWRcbiAgICAgICAgICAgIGxldCBhZGRyZXNzaWQkID0ge1xuICAgICAgICAgICAgICAgIHJlc3VsdDoge1xuICAgICAgICAgICAgICAgICAgICBkYXRhOiBudWxsLFxuICAgICAgICAgICAgICAgICAgICBzdGF0dXM6IDUwMFxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICBsZXQgYmFzZV9zdGF0dXMgPSAnMCc7XG4gICAgICAgICAgICBsZXQgZGVsaXZlcl9zdGF0dXMgPSAnMCdcblxuXG4gICAgICAgICAgICAvLyDmoLnmja7mnaXmupDvvIzmlbTnkIblnLDlnYBpZOOAgeWfuuacrOeKtuaAgeOAgeW/q+mAkueKtuaAgVxuICAgICAgICAgICAgLy8g6K6i5Y2V5p2l5rqQ77ya6LSt54mp6L2mXG4gICAgICAgICAgICBpZiAoIGV2ZW50LmRhdGEuZnJvbSA9PT0gJ2NhcnQnICkge1xuICAgICAgICAgICAgICAgIGFkZHJlc3NpZCQgPSBhd2FpdCBjbG91ZC5jYWxsRnVuY3Rpb24oe1xuICAgICAgICAgICAgICAgICAgICBkYXRhOiB7IFxuICAgICAgICAgICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFkZHJlc3M6IGV2ZW50LmRhdGEub3JkZXJzWyAwIF0uYWRkcmVzc1xuICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICR1cmw6ICdnZXRBZGRyZXNzSWQnXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIG5hbWU6ICdhZGRyZXNzJ1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgXG4gICAgICAgICAgICBpZiAoIGFkZHJlc3NpZCQucmVzdWx0LnN0YXR1cyAhPT0gMjAwICkge1xuICAgICAgICAgICAgICAgIHJldHVybiBjdHguYm9keSA9IHtcbiAgICAgICAgICAgICAgICAgICAgc3RhdHVzOiA1MDAsXG4gICAgICAgICAgICAgICAgICAgIG1lc3NhZ2U6ICfmn6Xor6LlnLDlnYDplJnor68nXG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8g5Y+v55So5Zyw5Z2AaWRcbiAgICAgICAgICAgIGNvbnN0IGFpZCA9IGFkZHJlc3NpZCQucmVzdWx0LmRhdGE7XG5cbiAgICAgICAgICAgIC8vIOaJuemHj+WtmOWCqOWvueixoeWtmOWCqFxuICAgICAgICAgICAgY29uc3QgdGVtcCA9IGV2ZW50LmRhdGEub3JkZXJzLm1hcCggbWV0YSA9PiB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIE9iamVjdC5hc3NpZ24oeyB9LCBtZXRhLCB7XG4gICAgICAgICAgICAgICAgICAgIGFpZCxcbiAgICAgICAgICAgICAgICAgICAgdGlkOiB0cmlwLl9pZCxcbiAgICAgICAgICAgICAgICAgICAgb3BlbmlkOiBvcGVuaWQsXG4gICAgICAgICAgICAgICAgICAgIGNyZWF0ZVRpbWU6IG5ldyBEYXRlKCApLmdldFRpbWUoICksXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9KTtcbiAgICBcbiAgICAgICAgICAgIHJldHVybiBjdHguYm9keSA9IHtcbiAgICAgICAgICAgICAgICBzdGF0dXM6IDIwMCxcbiAgICAgICAgICAgICAgICBkYXRhOiBhaWRcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgfSBjYXRjaCAoIGUgKSB7XG4gICAgIFxuICAgICAgICAgICAgcmV0dXJuIGN0eC5ib2R5ID0ge1xuICAgICAgICAgICAgICAgIHN0YXR1czogNTAwLFxuICAgICAgICAgICAgICAgIG1lc3NhZ2U6IGVcbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgIHJldHVybiBhcHAuc2VydmUoICk7XG5cbn0iXX0=