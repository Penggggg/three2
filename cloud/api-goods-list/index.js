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
    var limit_1, search, total$_1, data$_1, total$_2, data$_2, e_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 7, , 8]);
                limit_1 = 20;
                if (!(!!event.title && !!event.title.trim())) return [3, 3];
                search = new RegExp(event.title.replace(/\s+/g, ""), 'i');
                return [4, db.collection('goods')
                        .where({
                        title: search
                    })
                        .count()];
            case 1:
                total$_1 = _a.sent();
                return [4, db.collection('goods')
                        .where({
                        title: search
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
                                search: event.title.replace(/\s+/g),
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
                                search: null,
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFDQSxpQkFtR0M7O0FBbkdELHFDQUF1QztBQUV2QyxLQUFLLENBQUMsSUFBSSxFQUFFLENBQUM7QUFFYixJQUFNLEVBQUUsR0FBZ0IsS0FBSyxDQUFDLFFBQVEsRUFBRSxDQUFDO0FBa0I1QixRQUFBLElBQUksR0FBRyxVQUFPLEtBQUssRUFBRSxPQUFPOzs7Ozs7Z0JBSy9CLFVBQVEsRUFBRSxDQUFDO3FCQUNaLENBQUEsQ0FBQyxDQUFDLEtBQUssQ0FBQyxLQUFLLElBQUksQ0FBQyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFHLENBQUEsRUFBdEMsY0FBc0M7Z0JBRW5DLE1BQU0sR0FBRyxJQUFJLE1BQU0sQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxNQUFNLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUM7Z0JBRWpELFdBQU0sRUFBRSxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUM7eUJBQ3RDLEtBQUssQ0FBQzt3QkFDTCxLQUFLLEVBQUUsTUFBTTtxQkFDZCxDQUFDO3lCQUNELEtBQUssRUFBRyxFQUFBOztnQkFKUCxXQUFTLFNBSUY7Z0JBR0MsV0FBTSxFQUFFLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQzt5QkFDckMsS0FBSyxDQUFDO3dCQUNMLEtBQUssRUFBRSxNQUFNO3FCQUNkLENBQUM7eUJBQ0QsS0FBSyxDQUFFLE9BQUssQ0FBRTt5QkFDZCxJQUFJLENBQUMsQ0FBRSxLQUFLLENBQUMsSUFBSSxHQUFHLENBQUMsQ0FBRSxHQUFHLE9BQUssQ0FBRTt5QkFDakMsT0FBTyxDQUFDLFlBQVksRUFBRSxNQUFNLENBQUM7eUJBQzdCLEdBQUcsRUFBRyxFQUFBOztnQkFQTCxVQUFRLFNBT0g7Z0JBRVgsV0FBTyxJQUFJLE9BQU8sQ0FBRSxVQUFBLE9BQU87d0JBQ3pCLE9BQU8sQ0FBQzs0QkFDTixNQUFNLEVBQUUsR0FBRzs0QkFDWCxJQUFJLEVBQUU7Z0NBQ0YsTUFBTSxFQUFFLEtBQUssQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQztnQ0FDbkMsUUFBUSxFQUFFLE9BQUs7Z0NBQ2YsSUFBSSxFQUFFLEtBQUssQ0FBQyxJQUFJO2dDQUNoQixJQUFJLEVBQUUsT0FBSyxDQUFDLElBQUk7Z0NBQ2hCLEtBQUssRUFBRSxRQUFNLENBQUMsS0FBSztnQ0FDbkIsU0FBUyxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUUsUUFBTSxDQUFDLEtBQUssR0FBRyxPQUFLLENBQUU7NkJBQy9DO3lCQUNGLENBQUMsQ0FBQTtvQkFDSixDQUFDLENBQUMsRUFBQTtvQkFJYSxXQUFNLEVBQUUsQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDO3FCQUN4QyxLQUFLLEVBQUcsRUFBQTs7Z0JBREwsV0FBUyxTQUNKO2dCQUdHLFdBQU0sRUFBRSxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUM7eUJBQ3JDLEtBQUssQ0FBRSxPQUFLLENBQUU7eUJBQ2QsSUFBSSxDQUFDLENBQUUsS0FBSyxDQUFDLElBQUksR0FBRyxDQUFDLENBQUUsR0FBRyxPQUFLLENBQUU7eUJBQ2pDLE9BQU8sQ0FBQyxZQUFZLEVBQUUsTUFBTSxDQUFDO3lCQUM3QixHQUFHLEVBQUcsRUFBQTs7Z0JBSkwsVUFBUSxTQUlIO2dCQUVYLFdBQU8sSUFBSSxPQUFPLENBQUUsVUFBQSxPQUFPO3dCQUN6QixPQUFPLENBQUM7NEJBQ04sTUFBTSxFQUFFLEdBQUc7NEJBQ1gsSUFBSSxFQUFFO2dDQUNGLE1BQU0sRUFBRSxJQUFJO2dDQUNaLFFBQVEsRUFBRSxPQUFLO2dDQUNmLElBQUksRUFBRSxLQUFLLENBQUMsSUFBSTtnQ0FDaEIsSUFBSSxFQUFFLE9BQUssQ0FBQyxJQUFJO2dDQUNoQixLQUFLLEVBQUUsUUFBTSxDQUFDLEtBQUs7Z0NBQ25CLFNBQVMsRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFFLFFBQU0sQ0FBQyxLQUFLLEdBQUcsT0FBSyxDQUFFOzZCQUMvQzt5QkFDRixDQUFDLENBQUE7b0JBQ0osQ0FBQyxDQUFDLEVBQUE7Ozs7Z0JBS0osV0FBTyxJQUFJLE9BQU8sQ0FBQyxVQUFFLE9BQU8sRUFBRSxNQUFNO3dCQUNsQyxNQUFNLENBQUM7NEJBQ0wsTUFBTSxFQUFFLEdBQUc7NEJBQ1gsT0FBTyxFQUFFLEdBQUM7eUJBQ1gsQ0FBQyxDQUFBO29CQUNKLENBQUMsQ0FBQyxFQUFBOzs7O0tBR0wsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbIi8vIOS6keWHveaVsOWFpeWPo+aWh+S7tlxuaW1wb3J0ICogYXMgY2xvdWQgZnJvbSAnd3gtc2VydmVyLXNkayc7XG5cbmNsb3VkLmluaXQoKTtcblxuY29uc3QgZGI6IERCLkRhdGFiYXNlID0gY2xvdWQuZGF0YWJhc2UoKTtcblxuLyoqXG4gKiBAZGVzY3JpcHRpb24g5ZWG5ZOB5YiX6KGoXG4gKiAtLS0tLS0tLSDor7fmsYIgLS0tLS0tLS0tLVxuICoge1xuICogICAgICBzZWFyY2g6IOaQnOe0olxuICogICAgICBwYWdlOiDpobXmlbBcbiAqIH1cbiAqIC0tLS0tLS0tLS0g6L+U5ZueIC0tLS0tLS0tXG4gKiB7XG4gKiAgICAgIGRhdGE6IOWIl+ihqFxuICogICAgICBwYWdlOiDpobXmlbBcbiAqICAgICAgdG90YWw6IOaAu+aVsFxuICogICAgICB0b3RhbFBhZ2U6IOaAu+mhteaVsFxuICogICAgICBwYWdlU2l6ZTogMjBcbiAqIH1cbiAqL1xuZXhwb3J0IGNvbnN0IG1haW4gPSBhc3luYyAoZXZlbnQsIGNvbnRleHQpID0+IHtcblxuICB0cnkge1xuXG4gICAgLy8g5p+l6K+i5p2h5pWwXG4gICAgY29uc3QgbGltaXQgPSAyMDtcbiAgICBpZiAoICEhZXZlbnQudGl0bGUgJiYgISFldmVudC50aXRsZS50cmltKCApKSB7XG5cbiAgICAgIGNvbnN0IHNlYXJjaCA9IG5ldyBSZWdFeHAoZXZlbnQudGl0bGUucmVwbGFjZSgvXFxzKy9nLCBcIlwiKSwgJ2knKTtcbiAgICAgIC8vIOiOt+WPluaAu+aVsFxuICAgICAgY29uc3QgdG90YWwkID0gYXdhaXQgZGIuY29sbGVjdGlvbignZ29vZHMnKVxuICAgICAgICAgIC53aGVyZSh7XG4gICAgICAgICAgICB0aXRsZTogc2VhcmNoXG4gICAgICAgICAgfSlcbiAgICAgICAgICAuY291bnQoICk7XG5cbiAgICAgIC8vIOiOt+WPluaVsOaNrlxuICAgICAgY29uc3QgZGF0YSQgPSBhd2FpdCBkYi5jb2xsZWN0aW9uKCdnb29kcycpXG4gICAgICAgICAgLndoZXJlKHtcbiAgICAgICAgICAgIHRpdGxlOiBzZWFyY2hcbiAgICAgICAgICB9KVxuICAgICAgICAgIC5saW1pdCggbGltaXQgKVxuICAgICAgICAgIC5za2lwKCggZXZlbnQucGFnZSAtIDEgKSAqIGxpbWl0IClcbiAgICAgICAgICAub3JkZXJCeSgndXBkYXRlVGltZScsICdkZXNjJylcbiAgICAgICAgICAuZ2V0KCApO1xuXG4gICAgICByZXR1cm4gbmV3IFByb21pc2UoIHJlc29sdmUgPT4ge1xuICAgICAgICByZXNvbHZlKHtcbiAgICAgICAgICBzdGF0dXM6IDIwMCxcbiAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgIHNlYXJjaDogZXZlbnQudGl0bGUucmVwbGFjZSgvXFxzKy9nKSxcbiAgICAgICAgICAgICAgcGFnZVNpemU6IGxpbWl0LFxuICAgICAgICAgICAgICBwYWdlOiBldmVudC5wYWdlLFxuICAgICAgICAgICAgICBkYXRhOiBkYXRhJC5kYXRhLFxuICAgICAgICAgICAgICB0b3RhbDogdG90YWwkLnRvdGFsLFxuICAgICAgICAgICAgICB0b3RhbFBhZ2U6IE1hdGguY2VpbCggdG90YWwkLnRvdGFsIC8gbGltaXQgKVxuICAgICAgICAgIH1cbiAgICAgICAgfSlcbiAgICAgIH0pXG4gICAgfSBlbHNlIHtcblxuICAgICAgICAvLyDojrflj5bmgLvmlbBcbiAgICAgIGNvbnN0IHRvdGFsJCA9IGF3YWl0IGRiLmNvbGxlY3Rpb24oJ2dvb2RzJylcbiAgICAgICAgLmNvdW50KCApO1xuXG4gICAgICAvLyDojrflj5bmlbDmja5cbiAgICAgIGNvbnN0IGRhdGEkID0gYXdhaXQgZGIuY29sbGVjdGlvbignZ29vZHMnKVxuICAgICAgICAgIC5saW1pdCggbGltaXQgKVxuICAgICAgICAgIC5za2lwKCggZXZlbnQucGFnZSAtIDEgKSAqIGxpbWl0IClcbiAgICAgICAgICAub3JkZXJCeSgndXBkYXRlVGltZScsICdkZXNjJylcbiAgICAgICAgICAuZ2V0KCApO1xuXG4gICAgICByZXR1cm4gbmV3IFByb21pc2UoIHJlc29sdmUgPT4ge1xuICAgICAgICByZXNvbHZlKHtcbiAgICAgICAgICBzdGF0dXM6IDIwMCxcbiAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgIHNlYXJjaDogbnVsbCxcbiAgICAgICAgICAgICAgcGFnZVNpemU6IGxpbWl0LFxuICAgICAgICAgICAgICBwYWdlOiBldmVudC5wYWdlLFxuICAgICAgICAgICAgICBkYXRhOiBkYXRhJC5kYXRhLFxuICAgICAgICAgICAgICB0b3RhbDogdG90YWwkLnRvdGFsLFxuICAgICAgICAgICAgICB0b3RhbFBhZ2U6IE1hdGguY2VpbCggdG90YWwkLnRvdGFsIC8gbGltaXQgKVxuICAgICAgICAgIH1cbiAgICAgICAgfSlcbiAgICAgIH0pXG5cbiAgICB9XG5cbiAgfSBjYXRjaCAoIGUgKSB7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKCggcmVzb2x2ZSwgcmVqZWN0ICkgPT4ge1xuICAgICAgcmVqZWN0KHtcbiAgICAgICAgc3RhdHVzOiA1MDAsXG4gICAgICAgIG1lc3NhZ2U6IGVcbiAgICAgIH0pXG4gICAgfSlcbiAgfVxuXG59Il19