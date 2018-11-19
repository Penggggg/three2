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
    var e_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4, db.collection('goods').add({
                        data: event.data,
                    })];
            case 1:
                _a.sent();
                return [2, new Promise(function (resolve) {
                        resolve({
                            status: 200
                        });
                    })];
            case 2:
                e_1 = _a.sent();
                return [2, new Promise(function (resolve, reject) {
                        reject({
                            status: 500,
                            message: e_1
                        });
                    })];
            case 3: return [2];
        }
    });
}); };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFDQSxpQkEyREM7O0FBM0RELHFDQUF1QztBQUV2QyxLQUFLLENBQUMsSUFBSSxFQUFFLENBQUM7QUFFYixJQUFNLEVBQUUsR0FBRyxLQUFLLENBQUMsUUFBUSxFQUFFLENBQUM7QUFnQ2YsUUFBQSxJQUFJLEdBQUcsVUFBTyxLQUFLLEVBQUUsT0FBTzs7Ozs7O2dCQUlyQyxXQUFNLEVBQUUsQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLENBQUMsR0FBRyxDQUFDO3dCQUMvQixJQUFJLEVBQUUsS0FBSyxDQUFDLElBQUk7cUJBQ2pCLENBQUMsRUFBQTs7Z0JBRkYsU0FFRSxDQUFDO2dCQUVILFdBQU8sSUFBSSxPQUFPLENBQUUsVUFBQSxPQUFPO3dCQUN6QixPQUFPLENBQUM7NEJBQ04sTUFBTSxFQUFFLEdBQUc7eUJBQ1osQ0FBQyxDQUFBO29CQUNKLENBQUMsQ0FBQyxFQUFBOzs7Z0JBR0YsV0FBTyxJQUFJLE9BQU8sQ0FBQyxVQUFFLE9BQU8sRUFBRSxNQUFNO3dCQUNsQyxNQUFNLENBQUM7NEJBQ0wsTUFBTSxFQUFFLEdBQUc7NEJBQ1gsT0FBTyxFQUFFLEdBQUM7eUJBQ1gsQ0FBQyxDQUFBO29CQUNKLENBQUMsQ0FBQyxFQUFBOzs7O0tBR0wsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbIi8vIOS6keWHveaVsOWFpeWPo+aWh+S7tlxuaW1wb3J0ICogYXMgY2xvdWQgZnJvbSAnd3gtc2VydmVyLXNkayc7XG5cbmNsb3VkLmluaXQoKTtcblxuY29uc3QgZGIgPSBjbG91ZC5kYXRhYmFzZSgpO1xuXG4vKipcbiAqIEBkZXNjcmlwdGlvbiDliJvlu7rllYblk4FcbiAqIC0tLS0tLS0tIOivt+axgiAtLS0tLS0tLS0tXG4gKiB7XG4gKiAgICAgIHRpdGxlOiDllYblk4HlkI3np7AgU3RyaW5nXG4gKiAgICAgIGRldGFpbCE6IOWVhuWTgeaPj+i/sCBTdHJpbmdcbiAqICAgICAgdGFnOiDllYblk4HmoIfnrb4gQXJyYXk8U3RyaW5nPlxuICogICAgICBjYXRlZ29yeTog5ZWG5ZOB57G755uuIFN0cmluZ1xuICogICAgICBpbWc6IOWVhuWTgeWbvueJhyBBcnJheTxTdHJpbmc+XG4gKiAgICAgIHByaWNlOiDku7fmoLwgTnVtYmVyXG4gKiAgICAgIGZhZGVQcmljZTog5YiS57q/5Lu3IE51bWJlclxuICogICAgICBncm91cFByaWNlITog5Zui6LSt5Lu3IE51bWJlclxuICogICAgICBzdG9jayE6IOW6k+WtmCBOdW1iZXJcbiAqICAgICAgZGVwb3NpdFByaWNlITog5ZWG5ZOB6K6i6YeRIE51bWJlclxuICogICAgICBsaW1pdCE6IOmZkOi0reaVsOmHjyBOdW1iZXJcbiAqICAgICAgdmlzaWFibGU6IOaYr+WQpuS4iuaetiBCb29sZWFuXG4gKiAgICAgIHNhbGVkOiDplIDph48gTnVtYmVyXG4gKiAgICAgIHN0YW5kYXJkcyE6IOWei+WPt+inhOagvCBBcnJheTx7IFxuICogICAgICAgICAgbmFtZTogU3RyaW5nLFxuICogICAgICAgICAgcHJpY2U6IE51bWJlcixcbiAqICAgICAgICAgIGdyb3VwUHJpY2UhOiBOdW1iZXIsXG4gKiAgICAgICAgICBzdG9jayE6IE51bWJlcjpcbiAqICAgICAgICAgIGltZzogU3RyaW5nIFxuICogICAgICB9PlxuICogfVxuICogLS0tLS0tLS0g6K+35rGCIC0tLS0tLS0tLS1cbiAqIHtcbiAqICAgICAgc3RhdHVzOiAyMDAgLyA1MDBcbiAqIH1cbiAqL1xuZXhwb3J0IGNvbnN0IG1haW4gPSBhc3luYyAoZXZlbnQsIGNvbnRleHQpID0+IHtcblxuICB0cnkge1xuICAgIFxuICAgIGF3YWl0IGRiLmNvbGxlY3Rpb24oJ2dvb2RzJykuYWRkKHtcbiAgICAgIGRhdGE6IGV2ZW50LmRhdGEsXG4gICAgfSk7XG5cbiAgICByZXR1cm4gbmV3IFByb21pc2UoIHJlc29sdmUgPT4ge1xuICAgICAgcmVzb2x2ZSh7XG4gICAgICAgIHN0YXR1czogMjAwXG4gICAgICB9KVxuICAgIH0pXG5cbiAgfSBjYXRjaCAoIGUgKSB7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKCggcmVzb2x2ZSwgcmVqZWN0ICkgPT4ge1xuICAgICAgcmVqZWN0KHtcbiAgICAgICAgc3RhdHVzOiA1MDAsXG4gICAgICAgIG1lc3NhZ2U6IGVcbiAgICAgIH0pXG4gICAgfSlcbiAgfVxuXG59Il19