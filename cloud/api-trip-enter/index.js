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
exports.main = function (event, context) { return __awaiter(_this, void 0, void 0, function () {
    return __generator(this, function (_a) {
        try {
            return [2, db.collection('trip')
                    .where({
                    published: true
                })
                    .limit(2)
                    .orderBy('start_date', 'asc')
                    .get()
                    .then(function (data$) {
                    return {
                        status: 200,
                        data: data$.data
                    };
                }).catch(function (e) {
                    return {
                        status: 500
                    };
                })];
        }
        catch (e) {
            return [2, new Promise(function (resolve, reject) {
                    reject({
                        status: 500,
                        message: e
                    });
                })];
        }
        return [2];
    });
}); };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFDQSxpQkFrREM7O0FBbERELHFDQUF1QztBQUV2QyxLQUFLLENBQUMsSUFBSSxFQUFHLENBQUM7QUFFZCxJQUFNLEVBQUUsR0FBZ0IsS0FBSyxDQUFDLFFBQVEsRUFBRyxDQUFDO0FBQzFDLElBQU0sQ0FBQyxHQUFHLEVBQUUsQ0FBQyxPQUFPLENBQUM7QUFjUixRQUFBLElBQUksR0FBRyxVQUFRLEtBQUssRUFBRSxPQUFPOztRQUV0QyxJQUFJO1lBRUEsV0FBTyxFQUFFLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQztxQkFDdkIsS0FBSyxDQUFDO29CQUNILFNBQVMsRUFBRSxJQUFJO2lCQUNsQixDQUFDO3FCQUNELEtBQUssQ0FBRSxDQUFDLENBQUU7cUJBQ1YsT0FBTyxDQUFDLFlBQVksRUFBRSxLQUFLLENBQUM7cUJBQzVCLEdBQUcsRUFBRztxQkFDTixJQUFJLENBQUUsVUFBQSxLQUFLO29CQUNSLE9BQU87d0JBQ0gsTUFBTSxFQUFFLEdBQUc7d0JBQ1gsSUFBSSxFQUFFLEtBQUssQ0FBQyxJQUFJO3FCQUNuQixDQUFBO2dCQUNMLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBRSxVQUFBLENBQUM7b0JBQ1AsT0FBTzt3QkFDSCxNQUFNLEVBQUUsR0FBRztxQkFDZCxDQUFBO2dCQUNMLENBQUMsQ0FBQyxFQUFBO1NBRVQ7UUFBQyxPQUFRLENBQUMsRUFBRztZQUNWLFdBQU8sSUFBSSxPQUFPLENBQUMsVUFBRSxPQUFPLEVBQUUsTUFBTTtvQkFDaEMsTUFBTSxDQUFDO3dCQUNILE1BQU0sRUFBRSxHQUFHO3dCQUNYLE9BQU8sRUFBRSxDQUFDO3FCQUNiLENBQUMsQ0FBQTtnQkFDTixDQUFDLENBQUMsRUFBQTtTQUNMOzs7S0FFSixDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiLy8g5LqR5Ye95pWw5YWl5Y+j5paH5Lu2XG5pbXBvcnQgKiBhcyBjbG91ZCBmcm9tICd3eC1zZXJ2ZXItc2RrJztcblxuY2xvdWQuaW5pdCggKTtcblxuY29uc3QgZGI6IERCLkRhdGFiYXNlID0gY2xvdWQuZGF0YWJhc2UoICk7XG5jb25zdCBfID0gZGIuY29tbWFuZDtcblxuLyoqXG4gKiBAZGVzY3JpcHRpb24g6L+U5Zue5Lik5Liq6KGM56iL77yM5LiA5Liq5Zyo55SoL+WNs+WwhuWIsOadpe+8jOWPpuS4gOS4quS4i+S4gOi2n+WNs+WwhuWIsOadpVxuICogLS0tLS0tLS0g6K+35rGCIC0tLS0tLS0tLS1cbiAqIHtcbiAqICAgICAgX2lkOiDooYznqItpZFxuICogfVxuICogLS0tLS0tLS0tLSDov5Tlm54gLS0tLS0tLS1cbiAqIHtcbiAqICAgICAgZGF0YTog6KGM56iL6K+m5oOFXG4gKiAgICAgIHN0YXR1c1xuICogfVxuICovXG5leHBvcnQgY29uc3QgbWFpbiA9IGFzeW5jICggZXZlbnQsIGNvbnRleHQpID0+IHtcblxuICAgIHRyeSB7XG5cbiAgICAgICAgcmV0dXJuIGRiLmNvbGxlY3Rpb24oJ3RyaXAnKVxuICAgICAgICAgICAgLndoZXJlKHtcbiAgICAgICAgICAgICAgICBwdWJsaXNoZWQ6IHRydWVcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAubGltaXQoIDIgKVxuICAgICAgICAgICAgLm9yZGVyQnkoJ3N0YXJ0X2RhdGUnLCAnYXNjJylcbiAgICAgICAgICAgIC5nZXQoIClcbiAgICAgICAgICAgIC50aGVuKCBkYXRhJCA9PiB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICAgICAgc3RhdHVzOiAyMDAsXG4gICAgICAgICAgICAgICAgICAgIGRhdGE6IGRhdGEkLmRhdGFcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KS5jYXRjaCggZSA9PiB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICAgICAgc3RhdHVzOiA1MDBcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KVxuXG4gICAgfSBjYXRjaCAoIGUgKSB7XG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgoIHJlc29sdmUsIHJlamVjdCApID0+IHtcbiAgICAgICAgICAgIHJlamVjdCh7XG4gICAgICAgICAgICAgICAgc3RhdHVzOiA1MDAsXG4gICAgICAgICAgICAgICAgbWVzc2FnZTogZVxuICAgICAgICAgICAgfSlcbiAgICAgICAgfSlcbiAgICB9XG5cbn0iXX0=