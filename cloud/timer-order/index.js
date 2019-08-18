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
var trip_1 = require("./trip");
var form_ids_1 = require("./form-ids");
var shopping_list_1 = require("./shopping-list");
var order_1 = require("./order");
var share_record_1 = require("./share-record");
var push_timer_1 = require("./push-timer");
cloud.init({
    env: process.env.cloud
});
var db = cloud.database();
var _ = db.command;
exports.main = function (event, context) { return __awaiter(_this, void 0, void 0, function () {
    var e_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 15, , 16]);
                return [4, push_timer_1.userGetExp()];
            case 1:
                _a.sent();
                return [4, order_1.pushNew()];
            case 2:
                _a.sent();
                return [4, order_1.pushLastPay()];
            case 3:
                _a.sent();
                return [4, order_1.overtime()];
            case 4:
                _a.sent();
                return [4, order_1.payedFix()];
            case 5:
                _a.sent();
                return [4, order_1.priceFix()];
            case 6:
                _a.sent();
                return [4, order_1.payLastFix()];
            case 7:
                _a.sent();
                return [4, trip_1.overtimeTrip()];
            case 8:
                _a.sent();
                return [4, trip_1.almostOver()];
            case 9:
                _a.sent();
                return [4, shopping_list_1.catchLostOrders()];
            case 10:
                _a.sent();
                return [4, shopping_list_1.removeUselessOrders()];
            case 11:
                _a.sent();
                return [4, form_ids_1.clearFormIds()];
            case 12:
                _a.sent();
                return [4, form_ids_1.clearUseless()];
            case 13:
                _a.sent();
                return [4, share_record_1.clearShareRecord()];
            case 14:
                _a.sent();
                return [2, {
                        status: 200
                    }];
            case 15:
                e_1 = _a.sent();
                return [2, {
                        status: 500
                    }];
            case 16: return [2];
        }
    });
}); };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSxpQkFnREM7O0FBaERELHFDQUF1QztBQUN2QywrQkFBa0Q7QUFDbEQsdUNBQXdEO0FBQ3hELGlEQUF1RTtBQUN2RSxpQ0FBeUY7QUFDekYsK0NBQWtEO0FBQ2xELDJDQUEwQztBQUUxQyxLQUFLLENBQUMsSUFBSSxDQUFDO0lBQ1AsR0FBRyxFQUFFLE9BQU8sQ0FBQyxHQUFHLENBQUMsS0FBSztDQUN6QixDQUFDLENBQUM7QUFFSCxJQUFNLEVBQUUsR0FBZ0IsS0FBSyxDQUFDLFFBQVEsRUFBRyxDQUFDO0FBQzFDLElBQU0sQ0FBQyxHQUFHLEVBQUUsQ0FBQyxPQUFPLENBQUM7QUFTUixRQUFBLElBQUksR0FBRyxVQUFRLEtBQUssRUFBRSxPQUFPOzs7Ozs7Z0JBR2xDLFdBQU0sdUJBQVUsRUFBRyxFQUFBOztnQkFBbkIsU0FBbUIsQ0FBQztnQkFDcEIsV0FBTSxlQUFPLEVBQUcsRUFBQTs7Z0JBQWhCLFNBQWdCLENBQUM7Z0JBQ2pCLFdBQU0sbUJBQVcsRUFBRyxFQUFBOztnQkFBcEIsU0FBb0IsQ0FBQztnQkFDckIsV0FBTSxnQkFBUSxFQUFHLEVBQUE7O2dCQUFqQixTQUFpQixDQUFDO2dCQUNsQixXQUFNLGdCQUFRLEVBQUcsRUFBQTs7Z0JBQWpCLFNBQWlCLENBQUM7Z0JBQ2xCLFdBQU0sZ0JBQVEsRUFBRyxFQUFBOztnQkFBakIsU0FBaUIsQ0FBQztnQkFDbEIsV0FBTSxrQkFBVSxFQUFHLEVBQUE7O2dCQUFuQixTQUFtQixDQUFDO2dCQUNwQixXQUFNLG1CQUFZLEVBQUcsRUFBQTs7Z0JBQXJCLFNBQXFCLENBQUM7Z0JBQ3RCLFdBQU0saUJBQVUsRUFBRyxFQUFBOztnQkFBbkIsU0FBbUIsQ0FBQztnQkFDcEIsV0FBTSwrQkFBZSxFQUFHLEVBQUE7O2dCQUF4QixTQUF3QixDQUFDO2dCQUN6QixXQUFNLG1DQUFtQixFQUFHLEVBQUE7O2dCQUE1QixTQUE0QixDQUFDO2dCQUM3QixXQUFNLHVCQUFZLEVBQUcsRUFBQTs7Z0JBQXJCLFNBQXFCLENBQUM7Z0JBQ3RCLFdBQU0sdUJBQVksRUFBRyxFQUFBOztnQkFBckIsU0FBcUIsQ0FBQztnQkFDdEIsV0FBTSwrQkFBZ0IsRUFBRyxFQUFBOztnQkFBekIsU0FBeUIsQ0FBQztnQkFFMUIsV0FBTzt3QkFDSCxNQUFNLEVBQUUsR0FBRztxQkFDZCxFQUFBOzs7Z0JBRUQsV0FBTzt3QkFDSCxNQUFNLEVBQUUsR0FBRztxQkFDZCxFQUFBOzs7O0tBRVIsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIGNsb3VkIGZyb20gJ3d4LXNlcnZlci1zZGsnO1xuaW1wb3J0IHsgb3ZlcnRpbWVUcmlwLCBhbG1vc3RPdmVyIH0gZnJvbSAnLi90cmlwJztcbmltcG9ydCB7IGNsZWFyRm9ybUlkcywgY2xlYXJVc2VsZXNzIH0gZnJvbSAnLi9mb3JtLWlkcyc7XG5pbXBvcnQgeyBjYXRjaExvc3RPcmRlcnMsIHJlbW92ZVVzZWxlc3NPcmRlcnMgfSBmcm9tICcuL3Nob3BwaW5nLWxpc3QnO1xuaW1wb3J0IHsgb3ZlcnRpbWUsIHBheWVkRml4LCBwcmljZUZpeCwgcGF5TGFzdEZpeCwgcHVzaE5ldywgcHVzaExhc3RQYXkgfSBmcm9tICcuL29yZGVyJztcbmltcG9ydCB7IGNsZWFyU2hhcmVSZWNvcmQgfSBmcm9tICcuL3NoYXJlLXJlY29yZCc7XG5pbXBvcnQgeyB1c2VyR2V0RXhwIH0gZnJvbSAnLi9wdXNoLXRpbWVyJztcblxuY2xvdWQuaW5pdCh7XG4gICAgZW52OiBwcm9jZXNzLmVudi5jbG91ZFxufSk7XG5cbmNvbnN0IGRiOiBEQi5EYXRhYmFzZSA9IGNsb3VkLmRhdGFiYXNlKCApO1xuY29uc3QgXyA9IGRiLmNvbW1hbmQ7XG5cbi8qKiBcbiAqIOWumuaXtuWZqOaooeWdl1xuICogMeOAgeiuouWNlTHvvJrmiYDmnInlupTor6XmlK/ku5jvvIzkvYbmmK/mlK/ku5jotoXml7bvvIgzMOWIhumSn++8ieeahOiuouWNle+8jOmHiuaUvuWOn+adpeeahOW6k+WtmO+8jOiuouWNlemHjee9ruS4uuW3sui/h+aXtlxuICogMuOAgeiuouWNlTLvvJrmiYDmnInmiJDlip/mlK/ku5jnmoTorqLljZXvvIzmo4Dmn6XmnInmsqHmnIkgdHlwZSDov5jmmK8gcHJl55qE77yM5pyJ55qE6K+d6ZyA6KaB6L2s5oiQbm9ybWFs57G75Z6L6K6i5Y2V77yM5Yig6Zmk5a+55bqU55qE6LSt54mp6L2m77yI5pyJ55qE6K+d77yJXG4gKiAz44CB6K6i5Y2VM++8muW3sue7j+i/m+ihjOi0reeJqea4heWNleS7t+agvOiwg+aVtOWQju+8jOaWsOadpeeahOWVhuWTgeiuouWNleS7t+agvOWmguaenOi3n+a4heWNleS7t+agvOS4jeS4gOiHtO+8jOW6lOivpeeUqOWumuaXtuWZqOi/m+ihjOiwg+aVtFxuICogNOOAgea4heWNlTHvvJrmn6Xor6LmnKrooqvlronmjpLov5vmuIXljZXnmoTlt7LorqLph5HorqLljZXvvIhwYXlfc3RhdHVzOiAxIOeahG9yZGVy77yJXG4gKi9cbmV4cG9ydCBjb25zdCBtYWluID0gYXN5bmMgKCBldmVudCwgY29udGV4dCApID0+IHtcbiAgICB0cnkge1xuICAgICAgICBcbiAgICAgICAgYXdhaXQgdXNlckdldEV4cCggKTtcbiAgICAgICAgYXdhaXQgcHVzaE5ldyggKTtcbiAgICAgICAgYXdhaXQgcHVzaExhc3RQYXkoICk7XG4gICAgICAgIGF3YWl0IG92ZXJ0aW1lKCApO1xuICAgICAgICBhd2FpdCBwYXllZEZpeCggKTtcbiAgICAgICAgYXdhaXQgcHJpY2VGaXgoICk7XG4gICAgICAgIGF3YWl0IHBheUxhc3RGaXgoICk7XG4gICAgICAgIGF3YWl0IG92ZXJ0aW1lVHJpcCggKTtcbiAgICAgICAgYXdhaXQgYWxtb3N0T3ZlciggKTtcbiAgICAgICAgYXdhaXQgY2F0Y2hMb3N0T3JkZXJzKCApO1xuICAgICAgICBhd2FpdCByZW1vdmVVc2VsZXNzT3JkZXJzKCApO1xuICAgICAgICBhd2FpdCBjbGVhckZvcm1JZHMoICk7XG4gICAgICAgIGF3YWl0IGNsZWFyVXNlbGVzcyggKTtcbiAgICAgICAgYXdhaXQgY2xlYXJTaGFyZVJlY29yZCggKTtcbiAgICAgICAgXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBzdGF0dXM6IDIwMFxuICAgICAgICB9XG4gICAgfSBjYXRjaCAoIGUgKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBzdGF0dXM6IDUwMFxuICAgICAgICB9XG4gICAgfVxufSJdfQ==