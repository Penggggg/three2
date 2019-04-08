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
var order_1 = require("./order");
var shopping_list_1 = require("./shopping-list");
var trip_1 = require("./trip");
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
                _a.trys.push([0, 6, , 7]);
                return [4, order_1.overtime()];
            case 1:
                _a.sent();
                return [4, order_1.payedFix()];
            case 2:
                _a.sent();
                return [4, order_1.priceFix()];
            case 3:
                _a.sent();
                return [4, trip_1.overtimeTrip()];
            case 4:
                _a.sent();
                return [4, shopping_list_1.catchLostOrders()];
            case 5:
                _a.sent();
                return [2, {
                        status: 200
                    }];
            case 6:
                e_1 = _a.sent();
                return [2, {
                        status: 500
                    }];
            case 7: return [2];
        }
    });
}); };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSxpQkFvQ0M7O0FBcENELHFDQUF1QztBQUN2QyxpQ0FBdUQ7QUFDdkQsaURBQWtEO0FBQ2xELCtCQUFzQztBQUV0QyxLQUFLLENBQUMsSUFBSSxDQUFDO0lBQ1AsR0FBRyxFQUFFLE9BQU8sQ0FBQyxHQUFHLENBQUMsS0FBSztDQUN6QixDQUFDLENBQUM7QUFFSCxJQUFNLEVBQUUsR0FBZ0IsS0FBSyxDQUFDLFFBQVEsRUFBRyxDQUFDO0FBQzFDLElBQU0sQ0FBQyxHQUFHLEVBQUUsQ0FBQyxPQUFPLENBQUM7QUFTUixRQUFBLElBQUksR0FBRyxVQUFRLEtBQUssRUFBRSxPQUFPOzs7Ozs7Z0JBR2xDLFdBQU0sZ0JBQVEsRUFBRyxFQUFBOztnQkFBakIsU0FBaUIsQ0FBQztnQkFDbEIsV0FBTSxnQkFBUSxFQUFHLEVBQUE7O2dCQUFqQixTQUFpQixDQUFDO2dCQUNsQixXQUFNLGdCQUFRLEVBQUcsRUFBQTs7Z0JBQWpCLFNBQWlCLENBQUM7Z0JBQ2xCLFdBQU0sbUJBQVksRUFBRyxFQUFBOztnQkFBckIsU0FBcUIsQ0FBQztnQkFDdEIsV0FBTSwrQkFBZSxFQUFHLEVBQUE7O2dCQUF4QixTQUF3QixDQUFDO2dCQUV6QixXQUFPO3dCQUNILE1BQU0sRUFBRSxHQUFHO3FCQUNkLEVBQUE7OztnQkFFRCxXQUFPO3dCQUNILE1BQU0sRUFBRSxHQUFHO3FCQUNkLEVBQUE7Ozs7S0FFUixDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgY2xvdWQgZnJvbSAnd3gtc2VydmVyLXNkayc7XG5pbXBvcnQgeyBvdmVydGltZSwgcGF5ZWRGaXgsIHByaWNlRml4IH0gZnJvbSAnLi9vcmRlcic7XG5pbXBvcnQgeyBjYXRjaExvc3RPcmRlcnMgfSBmcm9tICcuL3Nob3BwaW5nLWxpc3QnO1xuaW1wb3J0IHsgb3ZlcnRpbWVUcmlwIH0gZnJvbSAnLi90cmlwJztcblxuY2xvdWQuaW5pdCh7XG4gICAgZW52OiBwcm9jZXNzLmVudi5jbG91ZFxufSk7XG5cbmNvbnN0IGRiOiBEQi5EYXRhYmFzZSA9IGNsb3VkLmRhdGFiYXNlKCApO1xuY29uc3QgXyA9IGRiLmNvbW1hbmQ7XG5cbi8qKiBcbiAqIOWumuaXtuWZqOaooeWdl1xuICogMeOAgeiuouWNlTHvvJrmiYDmnInlupTor6XmlK/ku5jvvIzkvYbmmK/mlK/ku5jotoXml7bvvIgzMOWIhumSn++8ieeahOiuouWNle+8jOmHiuaUvuWOn+adpeeahOW6k+WtmO+8jOiuouWNlemHjee9ruS4uuW3sui/h+aXtlxuICogMuOAgeiuouWNlTLvvJrmiYDmnInmiJDlip/mlK/ku5jnmoTorqLljZXvvIzmo4Dmn6XmnInmsqHmnIkgdHlwZSDov5jmmK8gcHJl55qE77yM5pyJ55qE6K+d6ZyA6KaB6L2s5oiQbm9ybWFs57G75Z6L6K6i5Y2V77yM5Yig6Zmk5a+55bqU55qE6LSt54mp6L2m77yI5pyJ55qE6K+d77yJXG4gKiAz44CB6K6i5Y2VM++8muW3sue7j+i/m+ihjOi0reeJqea4heWNleS7t+agvOiwg+aVtOWQju+8jOaWsOadpeeahOWVhuWTgeiuouWNleS7t+agvOWmguaenOi3n+a4heWNleS7t+agvOS4jeS4gOiHtO+8jOW6lOivpeeUqOWumuaXtuWZqOi/m+ihjOiwg+aVtFxuICogNOOAgea4heWNlTHvvJrmn6Xor6LmnKrooqvlronmjpLov5vmuIXljZXnmoTlt7LorqLph5HorqLljZXvvIhwYXlfc3RhdHVzOiAxIOeahG9yZGVy77yJXG4gKi9cbmV4cG9ydCBjb25zdCBtYWluID0gYXN5bmMgKCBldmVudCwgY29udGV4dCApID0+IHtcbiAgICB0cnkge1xuICAgICAgICBcbiAgICAgICAgYXdhaXQgb3ZlcnRpbWUoICk7XG4gICAgICAgIGF3YWl0IHBheWVkRml4KCApO1xuICAgICAgICBhd2FpdCBwcmljZUZpeCggKTtcbiAgICAgICAgYXdhaXQgb3ZlcnRpbWVUcmlwKCApO1xuICAgICAgICBhd2FpdCBjYXRjaExvc3RPcmRlcnMoICk7XG4gICAgICAgIFxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgc3RhdHVzOiAyMDBcbiAgICAgICAgfVxuICAgIH0gY2F0Y2ggKCBlICkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgc3RhdHVzOiA1MDBcbiAgICAgICAgfVxuICAgIH1cbn0iXX0=