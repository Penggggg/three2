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
cloud.init();
var db = cloud.database();
var _ = db.command;
exports.main = function (event, context) { return __awaiter(_this, void 0, void 0, function () {
    var e_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 5, , 6]);
                return [4, order_1.overtime()];
            case 1:
                _a.sent();
                return [4, order_1.payedFix()];
            case 2:
                _a.sent();
                return [4, order_1.priceFix()];
            case 3:
                _a.sent();
                return [4, shopping_list_1.catchLostOrders()];
            case 4:
                _a.sent();
                return [2, {
                        status: 200
                    }];
            case 5:
                e_1 = _a.sent();
                return [2, {
                        status: 500
                    }];
            case 6: return [2];
        }
    });
}); };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSxpQkFnQ0M7O0FBaENELHFDQUF1QztBQUN2QyxpQ0FBdUQ7QUFDdkQsaURBQWtEO0FBRWxELEtBQUssQ0FBQyxJQUFJLEVBQUcsQ0FBQztBQUVkLElBQU0sRUFBRSxHQUFnQixLQUFLLENBQUMsUUFBUSxFQUFHLENBQUM7QUFDMUMsSUFBTSxDQUFDLEdBQUcsRUFBRSxDQUFDLE9BQU8sQ0FBQztBQVNSLFFBQUEsSUFBSSxHQUFHLFVBQVEsS0FBSyxFQUFFLE9BQU87Ozs7OztnQkFHbEMsV0FBTSxnQkFBUSxFQUFHLEVBQUE7O2dCQUFqQixTQUFpQixDQUFDO2dCQUNsQixXQUFNLGdCQUFRLEVBQUcsRUFBQTs7Z0JBQWpCLFNBQWlCLENBQUM7Z0JBQ2xCLFdBQU0sZ0JBQVEsRUFBRyxFQUFBOztnQkFBakIsU0FBaUIsQ0FBQztnQkFDbEIsV0FBTSwrQkFBZSxFQUFHLEVBQUE7O2dCQUF4QixTQUF3QixDQUFDO2dCQUV6QixXQUFPO3dCQUNILE1BQU0sRUFBRSxHQUFHO3FCQUNkLEVBQUE7OztnQkFFRCxXQUFPO3dCQUNILE1BQU0sRUFBRSxHQUFHO3FCQUNkLEVBQUE7Ozs7S0FFUixDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgY2xvdWQgZnJvbSAnd3gtc2VydmVyLXNkayc7XG5pbXBvcnQgeyBvdmVydGltZSwgcGF5ZWRGaXgsIHByaWNlRml4IH0gZnJvbSAnLi9vcmRlcic7XG5pbXBvcnQgeyBjYXRjaExvc3RPcmRlcnMgfSBmcm9tICcuL3Nob3BwaW5nLWxpc3QnO1xuXG5jbG91ZC5pbml0KCApO1xuXG5jb25zdCBkYjogREIuRGF0YWJhc2UgPSBjbG91ZC5kYXRhYmFzZSggKTtcbmNvbnN0IF8gPSBkYi5jb21tYW5kO1xuXG4vKiogXG4gKiDlrprml7blmajmqKHlnZdcbiAqIDHjgIHorqLljZUx77ya5omA5pyJ5bqU6K+l5pSv5LuY77yM5L2G5piv5pSv5LuY6LaF5pe277yIMzDliIbpkp/vvInnmoTorqLljZXvvIzph4rmlL7ljp/mnaXnmoTlupPlrZjvvIzorqLljZXph43nva7kuLrlt7Lov4fml7ZcbiAqIDLjgIHorqLljZUy77ya5omA5pyJ5oiQ5Yqf5pSv5LuY55qE6K6i5Y2V77yM5qOA5p+l5pyJ5rKh5pyJIHR5cGUg6L+Y5pivIHByZeeahO+8jOacieeahOivnemcgOimgei9rOaIkG5vcm1hbOexu+Wei+iuouWNle+8jOWIoOmZpOWvueW6lOeahOi0reeJqei9pu+8iOacieeahOivne+8iVxuICogM+OAgeiuouWNlTPvvJrlt7Lnu4/ov5vooYzotK3nianmuIXljZXku7fmoLzosIPmlbTlkI7vvIzmlrDmnaXnmoTllYblk4HorqLljZXku7fmoLzlpoLmnpzot5/muIXljZXku7fmoLzkuI3kuIDoh7TvvIzlupTor6XnlKjlrprml7blmajov5vooYzosIPmlbRcbiAqIDTjgIHmuIXljZUx77ya5p+l6K+i5pyq6KKr5a6J5o6S6L+b5riF5Y2V55qE5bey6K6i6YeR6K6i5Y2V77yIcGF5X3N0YXR1czogMSDnmoRvcmRlcu+8iVxuICovXG5leHBvcnQgY29uc3QgbWFpbiA9IGFzeW5jICggZXZlbnQsIGNvbnRleHQgKSA9PiB7XG4gICAgdHJ5IHtcbiAgICAgICAgXG4gICAgICAgIGF3YWl0IG92ZXJ0aW1lKCApO1xuICAgICAgICBhd2FpdCBwYXllZEZpeCggKTtcbiAgICAgICAgYXdhaXQgcHJpY2VGaXgoICk7XG4gICAgICAgIGF3YWl0IGNhdGNoTG9zdE9yZGVycyggKTtcbiAgICAgICAgXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBzdGF0dXM6IDIwMFxuICAgICAgICB9XG4gICAgfSBjYXRjaCAoIGUgKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBzdGF0dXM6IDUwMFxuICAgICAgICB9XG4gICAgfVxufSJdfQ==