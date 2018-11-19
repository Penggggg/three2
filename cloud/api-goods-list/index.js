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
    var limit_1, total$_1, data$_1, total$_2, data$_2, e_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 7, , 8]);
                limit_1 = 20;
                if (!(!!event.title && !!event.title.trim())) return [3, 3];
                return [4, db.collection('goods')
                        .where({
                        title: new RegExp(event.title.replace(/\s+/g, ""), 'g')
                    })
                        .count()];
            case 1:
                total$_1 = _a.sent();
                return [4, db.collection('goods')
                        .where({
                        title: new RegExp(event.title.replace(/\s+/g, ""), 'g')
                    })
                        .limit(limit_1)
                        .skip((event.page - 1) * limit_1)
                        .orderBy('updateTime', 'desc')
                        .get()];
            case 2:
                data$_1 = _a.sent();
                return [2, new Promise(function (resolve) {
                        resolve({
                            status: 200,
                            data: {
                                pageSize: limit_1,
                                page: event.page,
                                data: data$_1.data,
                                total: total$_1.total,
                                totalPage: Math.ceil(total$_1.total / limit_1)
                            }
                        });
                    })];
            case 3: return [4, db.collection('goods')
                    .count()];
            case 4:
                total$_2 = _a.sent();
                return [4, db.collection('goods')
                        .limit(limit_1)
                        .skip((event.page - 1) * limit_1)
                        .orderBy('updateTime', 'desc')
                        .get()];
            case 5:
                data$_2 = _a.sent();
                return [2, new Promise(function (resolve) {
                        resolve({
                            status: 200,
                            data: {
                                pageSize: limit_1,
                                page: event.page,
                                data: data$_2.data,
                                total: total$_2.total,
                                totalPage: Math.ceil(total$_2.total / limit_1)
                            }
                        });
                    })];
            case 6: return [3, 8];
            case 7:
                e_1 = _a.sent();
                return [2, new Promise(function (resolve, reject) {
                        reject({
                            status: 500,
                            message: e_1
                        });
                    })];
            case 8: return [2];
        }
    });
}); };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFDQSxpQkErRkM7O0FBL0ZELHFDQUF1QztBQUV2QyxLQUFLLENBQUMsSUFBSSxFQUFFLENBQUM7QUFFYixJQUFNLEVBQUUsR0FBRyxLQUFLLENBQUMsUUFBUSxFQUFFLENBQUM7QUFrQmYsUUFBQSxJQUFJLEdBQUcsVUFBTyxLQUFLLEVBQUUsT0FBTzs7Ozs7O2dCQUsvQixVQUFRLEVBQUUsQ0FBQztxQkFDWixDQUFBLENBQUMsQ0FBQyxLQUFLLENBQUMsS0FBSyxJQUFJLENBQUMsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLElBQUksRUFBRyxDQUFBLEVBQXRDLGNBQXNDO2dCQUUxQixXQUFNLEVBQUUsQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDO3lCQUN0QyxLQUFLLENBQUM7d0JBQ0wsS0FBSyxFQUFFLElBQUksTUFBTSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLE1BQU0sRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLENBQUM7cUJBQ3hELENBQUM7eUJBQ0QsS0FBSyxFQUFHLEVBQUE7O2dCQUpQLFdBQVMsU0FJRjtnQkFHQyxXQUFNLEVBQUUsQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDO3lCQUNyQyxLQUFLLENBQUM7d0JBQ0wsS0FBSyxFQUFFLElBQUksTUFBTSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLE1BQU0sRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLENBQUM7cUJBQ3hELENBQUM7eUJBQ0QsS0FBSyxDQUFFLE9BQUssQ0FBRTt5QkFDZCxJQUFJLENBQUMsQ0FBRSxLQUFLLENBQUMsSUFBSSxHQUFHLENBQUMsQ0FBRSxHQUFHLE9BQUssQ0FBRTt5QkFDakMsT0FBTyxDQUFDLFlBQVksRUFBRSxNQUFNLENBQUM7eUJBQzdCLEdBQUcsRUFBRyxFQUFBOztnQkFQTCxVQUFRLFNBT0g7Z0JBRVgsV0FBTyxJQUFJLE9BQU8sQ0FBRSxVQUFBLE9BQU87d0JBQ3pCLE9BQU8sQ0FBQzs0QkFDTixNQUFNLEVBQUUsR0FBRzs0QkFDWCxJQUFJLEVBQUU7Z0NBQ0YsUUFBUSxFQUFFLE9BQUs7Z0NBQ2YsSUFBSSxFQUFFLEtBQUssQ0FBQyxJQUFJO2dDQUNoQixJQUFJLEVBQUUsT0FBSyxDQUFDLElBQUk7Z0NBQ2hCLEtBQUssRUFBRSxRQUFNLENBQUMsS0FBSztnQ0FDbkIsU0FBUyxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUUsUUFBTSxDQUFDLEtBQUssR0FBRyxPQUFLLENBQUU7NkJBQy9DO3lCQUNGLENBQUMsQ0FBQTtvQkFDSixDQUFDLENBQUMsRUFBQTtvQkFJYSxXQUFNLEVBQUUsQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDO3FCQUN4QyxLQUFLLEVBQUcsRUFBQTs7Z0JBREwsV0FBUyxTQUNKO2dCQUdHLFdBQU0sRUFBRSxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUM7eUJBQ3JDLEtBQUssQ0FBRSxPQUFLLENBQUU7eUJBQ2QsSUFBSSxDQUFDLENBQUUsS0FBSyxDQUFDLElBQUksR0FBRyxDQUFDLENBQUUsR0FBRyxPQUFLLENBQUU7eUJBQ2pDLE9BQU8sQ0FBQyxZQUFZLEVBQUUsTUFBTSxDQUFDO3lCQUM3QixHQUFHLEVBQUcsRUFBQTs7Z0JBSkwsVUFBUSxTQUlIO2dCQUVYLFdBQU8sSUFBSSxPQUFPLENBQUUsVUFBQSxPQUFPO3dCQUN6QixPQUFPLENBQUM7NEJBQ04sTUFBTSxFQUFFLEdBQUc7NEJBQ1gsSUFBSSxFQUFFO2dDQUNGLFFBQVEsRUFBRSxPQUFLO2dDQUNmLElBQUksRUFBRSxLQUFLLENBQUMsSUFBSTtnQ0FDaEIsSUFBSSxFQUFFLE9BQUssQ0FBQyxJQUFJO2dDQUNoQixLQUFLLEVBQUUsUUFBTSxDQUFDLEtBQUs7Z0NBQ25CLFNBQVMsRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFFLFFBQU0sQ0FBQyxLQUFLLEdBQUcsT0FBSyxDQUFFOzZCQUMvQzt5QkFDRixDQUFDLENBQUE7b0JBQ0osQ0FBQyxDQUFDLEVBQUE7Ozs7Z0JBS0osV0FBTyxJQUFJLE9BQU8sQ0FBQyxVQUFFLE9BQU8sRUFBRSxNQUFNO3dCQUNsQyxNQUFNLENBQUM7NEJBQ0wsTUFBTSxFQUFFLEdBQUc7NEJBQ1gsT0FBTyxFQUFFLEdBQUM7eUJBQ1gsQ0FBQyxDQUFBO29CQUNKLENBQUMsQ0FBQyxFQUFBOzs7O0tBR0wsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbIi8vIOS6keWHveaVsOWFpeWPo+aWh+S7tlxuaW1wb3J0ICogYXMgY2xvdWQgZnJvbSAnd3gtc2VydmVyLXNkayc7XG5cbmNsb3VkLmluaXQoKTtcblxuY29uc3QgZGIgPSBjbG91ZC5kYXRhYmFzZSgpO1xuXG4vKipcbiAqIEBkZXNjcmlwdGlvbiDllYblk4HliJfooahcbiAqIC0tLS0tLS0tIOivt+axgiAtLS0tLS0tLS0tXG4gKiB7XG4gKiAgICAgIHNlYXJjaDog5pCc57SiXG4gKiAgICAgIHBhZ2U6IOmhteaVsFxuICogfVxuICogLS0tLS0tLS0tLSDov5Tlm54gLS0tLS0tLS1cbiAqIHtcbiAqICAgICAgZGF0YTog5YiX6KGoXG4gKiAgICAgIHBhZ2U6IOmhteaVsFxuICogICAgICB0b3RhbDog5oC75pWwXG4gKiAgICAgIHRvdGFsUGFnZTog5oC76aG15pWwXG4gKiAgICAgIHBhZ2VTaXplOiAyMFxuICogfVxuICovXG5leHBvcnQgY29uc3QgbWFpbiA9IGFzeW5jIChldmVudCwgY29udGV4dCkgPT4ge1xuXG4gIHRyeSB7XG5cbiAgICAvLyDmn6Xor6LmnaHmlbBcbiAgICBjb25zdCBsaW1pdCA9IDIwO1xuICAgIGlmICggISFldmVudC50aXRsZSAmJiAhIWV2ZW50LnRpdGxlLnRyaW0oICkpIHtcbiAgICAgIC8vIOiOt+WPluaAu+aVsFxuICAgICAgY29uc3QgdG90YWwkID0gYXdhaXQgZGIuY29sbGVjdGlvbignZ29vZHMnKVxuICAgICAgICAgIC53aGVyZSh7XG4gICAgICAgICAgICB0aXRsZTogbmV3IFJlZ0V4cChldmVudC50aXRsZS5yZXBsYWNlKC9cXHMrL2csIFwiXCIpLCAnZycpXG4gICAgICAgICAgfSlcbiAgICAgICAgICAuY291bnQoICk7XG5cbiAgICAgIC8vIOiOt+WPluaVsOaNrlxuICAgICAgY29uc3QgZGF0YSQgPSBhd2FpdCBkYi5jb2xsZWN0aW9uKCdnb29kcycpXG4gICAgICAgICAgLndoZXJlKHtcbiAgICAgICAgICAgIHRpdGxlOiBuZXcgUmVnRXhwKGV2ZW50LnRpdGxlLnJlcGxhY2UoL1xccysvZywgXCJcIiksICdnJylcbiAgICAgICAgICB9KVxuICAgICAgICAgIC5saW1pdCggbGltaXQgKVxuICAgICAgICAgIC5za2lwKCggZXZlbnQucGFnZSAtIDEgKSAqIGxpbWl0IClcbiAgICAgICAgICAub3JkZXJCeSgndXBkYXRlVGltZScsICdkZXNjJylcbiAgICAgICAgICAuZ2V0KCApO1xuXG4gICAgICByZXR1cm4gbmV3IFByb21pc2UoIHJlc29sdmUgPT4ge1xuICAgICAgICByZXNvbHZlKHtcbiAgICAgICAgICBzdGF0dXM6IDIwMCxcbiAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgIHBhZ2VTaXplOiBsaW1pdCxcbiAgICAgICAgICAgICAgcGFnZTogZXZlbnQucGFnZSxcbiAgICAgICAgICAgICAgZGF0YTogZGF0YSQuZGF0YSxcbiAgICAgICAgICAgICAgdG90YWw6IHRvdGFsJC50b3RhbCxcbiAgICAgICAgICAgICAgdG90YWxQYWdlOiBNYXRoLmNlaWwoIHRvdGFsJC50b3RhbCAvIGxpbWl0IClcbiAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgICB9KVxuICAgIH0gZWxzZSB7XG5cbiAgICAgICAgLy8g6I635Y+W5oC75pWwXG4gICAgICBjb25zdCB0b3RhbCQgPSBhd2FpdCBkYi5jb2xsZWN0aW9uKCdnb29kcycpXG4gICAgICAgIC5jb3VudCggKTtcblxuICAgICAgLy8g6I635Y+W5pWw5o2uXG4gICAgICBjb25zdCBkYXRhJCA9IGF3YWl0IGRiLmNvbGxlY3Rpb24oJ2dvb2RzJylcbiAgICAgICAgICAubGltaXQoIGxpbWl0IClcbiAgICAgICAgICAuc2tpcCgoIGV2ZW50LnBhZ2UgLSAxICkgKiBsaW1pdCApXG4gICAgICAgICAgLm9yZGVyQnkoJ3VwZGF0ZVRpbWUnLCAnZGVzYycpXG4gICAgICAgICAgLmdldCggKTtcblxuICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKCByZXNvbHZlID0+IHtcbiAgICAgICAgcmVzb2x2ZSh7XG4gICAgICAgICAgc3RhdHVzOiAyMDAsXG4gICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICBwYWdlU2l6ZTogbGltaXQsXG4gICAgICAgICAgICAgIHBhZ2U6IGV2ZW50LnBhZ2UsXG4gICAgICAgICAgICAgIGRhdGE6IGRhdGEkLmRhdGEsXG4gICAgICAgICAgICAgIHRvdGFsOiB0b3RhbCQudG90YWwsXG4gICAgICAgICAgICAgIHRvdGFsUGFnZTogTWF0aC5jZWlsKCB0b3RhbCQudG90YWwgLyBsaW1pdCApXG4gICAgICAgICAgfVxuICAgICAgICB9KVxuICAgICAgfSlcblxuICAgIH1cblxuICB9IGNhdGNoICggZSApIHtcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKCByZXNvbHZlLCByZWplY3QgKSA9PiB7XG4gICAgICByZWplY3Qoe1xuICAgICAgICBzdGF0dXM6IDUwMCxcbiAgICAgICAgbWVzc2FnZTogZVxuICAgICAgfSlcbiAgICB9KVxuICB9XG5cbn0iXX0=