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
                        return wx.cloud.callFunction({
                            data: {
                                _id: cart.pid
                            },
                            name: 'api-goods-detail'
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFDQSxpQkFzREM7O0FBdERELHFDQUF1QztBQUV2QyxLQUFLLENBQUMsSUFBSSxFQUFFLENBQUM7QUFFYixJQUFNLEVBQUUsR0FBZ0IsS0FBSyxDQUFDLFFBQVEsRUFBRSxDQUFDO0FBYzVCLFFBQUEsSUFBSSxHQUFHLFVBQU8sS0FBSyxFQUFFLE9BQU87Ozs7OztnQkFJM0IsTUFBTSxHQUFHLEtBQUssQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDO2dCQUN2QixXQUFNLEVBQUUsQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDO3lCQUN4QixLQUFLLENBQUM7d0JBQ0gsTUFBTSxRQUFBO3FCQUNULENBQUM7eUJBQ0QsR0FBRyxFQUFHLEVBQUE7O2dCQUpqQixLQUFLLEdBQUcsU0FJUztnQkFHRCxXQUFNLE9BQU8sQ0FBQyxHQUFHLENBQUUsS0FBSyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUUsVUFBQSxJQUFJO3dCQUN6RCxPQUFPLEVBQUUsQ0FBQyxLQUFLLENBQUMsWUFBWSxDQUFDOzRCQUN6QixJQUFJLEVBQUU7Z0NBQ0YsR0FBRyxFQUFFLElBQUksQ0FBQyxHQUFHOzZCQUNoQjs0QkFDRCxJQUFJLEVBQUUsa0JBQWtCO3lCQUMzQixDQUFDLENBQUE7b0JBQ04sQ0FBQyxDQUFDLENBQUMsRUFBQTs7Z0JBUEcsa0JBQWdCLFNBT25CO2dCQUVILFdBQU8sSUFBSSxPQUFPLENBQUUsVUFBQSxPQUFPO3dCQUN2QixPQUFPLENBQUM7NEJBQ0osTUFBTSxFQUFFLEdBQUc7NEJBQ1gsSUFBSSxFQUFFLGVBQWE7eUJBQ3RCLENBQUMsQ0FBQztvQkFDUCxDQUFDLENBQUMsRUFBQzs7O2dCQUVILFdBQU8sSUFBSSxPQUFPLENBQUUsVUFBQSxPQUFPO3dCQUN2QixPQUFPLENBQUM7NEJBQ0osTUFBTSxFQUFFLEdBQUc7NEJBQ1gsSUFBSSxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUUsR0FBQyxDQUFFO3lCQUM1QixDQUFDLENBQUM7b0JBQ1AsQ0FBQyxDQUFDLEVBQUM7Ozs7S0FHVixDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiLy8g5LqR5Ye95pWw5YWl5Y+j5paH5Lu2XG5pbXBvcnQgKiBhcyBjbG91ZCBmcm9tICd3eC1zZXJ2ZXItc2RrJztcblxuY2xvdWQuaW5pdCgpO1xuXG5jb25zdCBkYjogREIuRGF0YWJhc2UgPSBjbG91ZC5kYXRhYmFzZSgpO1xuXG5cbi8qKlxuICog6LSt54mp6L2mbGllIOeZveWTplxuICogcmVxOiB7XG4gKiAgICAgIG9wZW5pZFxuICogfVxuICogXG4gKiByZXM6IHtcbiAqICAgICAgc3RhdHVzOiAyMDAvNTAwXG4gKiAgICAgIGRhdGE6IOi0reeJqei9puWIl+ihqFxuICogfVxuICovXG5leHBvcnQgY29uc3QgbWFpbiA9IGFzeW5jIChldmVudCwgY29udGV4dCkgPT4ge1xuXG4gICAgdHJ5IHtcblxuICAgICAgICBjb25zdCBvcGVuaWQgPSBldmVudC51c2VySW5mby5vcGVuSWQ7XG4gICAgICAgIGNvbnN0IG1ldGEkID0gYXdhaXQgZGIuY29sbGVjdGlvbignY2FydCcpXG4gICAgICAgICAgICAgICAgICAgICAgICAud2hlcmUoe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9wZW5pZFxuICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgICAgIC5nZXQoICk7XG4gICAgICAgIFxuICAgICAgICAvLyDpnIDopoHmn6Xor6Ig5ZWG5ZOB6K+m5oOFXG4gICAgICAgIGNvbnN0IGdvb2RzRGV0YWlscyQgPSBhd2FpdCBQcm9taXNlLmFsbCggbWV0YSQuZGF0YS5tYXAoIGNhcnQgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIHd4LmNsb3VkLmNhbGxGdW5jdGlvbih7XG4gICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgICBfaWQ6IGNhcnQucGlkXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBuYW1lOiAnYXBpLWdvb2RzLWRldGFpbCdcbiAgICAgICAgICAgIH0pXG4gICAgICAgIH0pKTtcblxuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoIHJlc29sdmUgPT4ge1xuICAgICAgICAgICAgcmVzb2x2ZSh7XG4gICAgICAgICAgICAgICAgc3RhdHVzOiAyMDAsXG4gICAgICAgICAgICAgICAgZGF0YTogZ29vZHNEZXRhaWxzJFxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH0gY2F0Y2goIGUgKSB7XG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSggcmVzb2x2ZSA9PiB7XG4gICAgICAgICAgICByZXNvbHZlKHtcbiAgICAgICAgICAgICAgICBzdGF0dXM6IDUwMCxcbiAgICAgICAgICAgICAgICBkYXRhOiBKU09OLnN0cmluZ2lmeSggZSApXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG59Il19