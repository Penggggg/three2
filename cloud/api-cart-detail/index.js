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
    var find$_1, _a, sid, pid, openid, e_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 5, , 6]);
                find$_1 = null;
                _a = event.data, sid = _a.sid, pid = _a.pid;
                openid = event.userInfo.openId;
                if (!!!sid) return [3, 2];
                return [4, db.collection('cart')
                        .where({
                        pid: pid,
                        openid: openid,
                        standarad_id: sid
                    })
                        .get()];
            case 1:
                find$_1 = _b.sent();
                return [3, 4];
            case 2: return [4, db.collection('cart')
                    .where({
                    pid: pid,
                    openid: openid,
                    standarad_id: null
                })
                    .get()];
            case 3:
                find$_1 = _b.sent();
                _b.label = 4;
            case 4: return [2, new Promise(function (resolve) {
                    resolve({
                        status: 200,
                        data: find$_1.data[0]
                    });
                })];
            case 5:
                e_1 = _b.sent();
                return [2, new Promise(function (resolve) {
                        resolve({
                            status: 500,
                            data: JSON.stringify(e_1)
                        });
                    })];
            case 6: return [2];
        }
    });
}); };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFDQSxpQkE2REM7O0FBN0RELHFDQUF1QztBQUV2QyxLQUFLLENBQUMsSUFBSSxFQUFFLENBQUM7QUFFYixJQUFNLEVBQUUsR0FBZ0IsS0FBSyxDQUFDLFFBQVEsRUFBRSxDQUFDO0FBZ0I1QixRQUFBLElBQUksR0FBRyxVQUFPLEtBQUssRUFBRSxPQUFPOzs7Ozs7Z0JBSTdCLFVBQWEsSUFBSSxDQUFDO2dCQUNoQixLQUFlLEtBQUssQ0FBQyxJQUFJLEVBQXZCLEdBQUcsU0FBQSxFQUFFLEdBQUcsU0FBQSxDQUFnQjtnQkFDMUIsTUFBTSxHQUFHLEtBQUssQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDO3FCQUVoQyxDQUFDLENBQUMsR0FBRyxFQUFMLGNBQUs7Z0JBQ0UsV0FBTSxFQUFFLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQzt5QkFDbEIsS0FBSyxDQUFDO3dCQUNILEdBQUcsS0FBQTt3QkFDSCxNQUFNLFFBQUE7d0JBQ04sWUFBWSxFQUFFLEdBQUc7cUJBQ3BCLENBQUM7eUJBQ0QsR0FBRyxFQUFHLEVBQUE7O2dCQU52QixPQUFLLEdBQUcsU0FNZSxDQUFDOztvQkFFaEIsV0FBTSxFQUFFLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQztxQkFDbEIsS0FBSyxDQUFDO29CQUNILEdBQUcsS0FBQTtvQkFDSCxNQUFNLFFBQUE7b0JBQ04sWUFBWSxFQUFFLElBQUk7aUJBQ3JCLENBQUM7cUJBQ0QsR0FBRyxFQUFHLEVBQUE7O2dCQU52QixPQUFLLEdBQUcsU0FNZSxDQUFDOztvQkFHNUIsV0FBTyxJQUFJLE9BQU8sQ0FBRSxVQUFBLE9BQU87b0JBQ3ZCLE9BQU8sQ0FBQzt3QkFDSixNQUFNLEVBQUUsR0FBRzt3QkFDWCxJQUFJLEVBQUUsT0FBSyxDQUFDLElBQUksQ0FBRSxDQUFDLENBQUU7cUJBQ3hCLENBQUMsQ0FBQztnQkFDUCxDQUFDLENBQUMsRUFBQzs7O2dCQUVILFdBQU8sSUFBSSxPQUFPLENBQUUsVUFBQSxPQUFPO3dCQUN2QixPQUFPLENBQUM7NEJBQ0osTUFBTSxFQUFFLEdBQUc7NEJBQ1gsSUFBSSxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUUsR0FBQyxDQUFFO3lCQUM1QixDQUFDLENBQUM7b0JBQ1AsQ0FBQyxDQUFDLEVBQUM7Ozs7S0FHVixDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiLy8g5LqR5Ye95pWw5YWl5Y+j5paH5Lu2XG5pbXBvcnQgKiBhcyBjbG91ZCBmcm9tICd3eC1zZXJ2ZXItc2RrJztcblxuY2xvdWQuaW5pdCgpO1xuXG5jb25zdCBkYjogREIuRGF0YWJhc2UgPSBjbG91ZC5kYXRhYmFzZSgpO1xuXG5cbi8qKlxuICog5qC55o2u5ZWG5ZOBaWTjgIHlnovlj7dpZOafpeivoui0reeJqei9pue7k+aenFxuICogcmVxOiB7XG4gKiAgICAgIHNpZFxuICogICAgICBwaWRcbiAqICAgICAgb3BlbmlkXG4gKiB9XG4gKiBcbiAqIHJlczoge1xuICogICAgICBzdGF0dXM6IDIwMC81MDAsXG4gKiAgICAgIGRhdGE6IOi0reeJqei9pmRldGFpbFxuICogfVxuICovXG5leHBvcnQgY29uc3QgbWFpbiA9IGFzeW5jIChldmVudCwgY29udGV4dCkgPT4ge1xuXG4gICAgdHJ5IHtcbiAgXG4gICAgICAgIGxldCBmaW5kJDogYW55ID0gbnVsbDtcbiAgICAgICAgY29uc3QgeyBzaWQsIHBpZCB9ID0gZXZlbnQuZGF0YTtcbiAgICAgICAgY29uc3Qgb3BlbmlkID0gZXZlbnQudXNlckluZm8ub3BlbklkO1xuXG4gICAgICAgIGlmICggISFzaWQgKSB7XG4gICAgICAgICAgICBmaW5kJCA9IGF3YWl0IGRiLmNvbGxlY3Rpb24oJ2NhcnQnKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC53aGVyZSh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBpZCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb3BlbmlkLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdGFuZGFyYWRfaWQ6IHNpZFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLmdldCggKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGZpbmQkID0gYXdhaXQgZGIuY29sbGVjdGlvbignY2FydCcpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLndoZXJlKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGlkLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvcGVuaWQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0YW5kYXJhZF9pZDogbnVsbFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLmdldCggKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSggcmVzb2x2ZSA9PiB7XG4gICAgICAgICAgICByZXNvbHZlKHtcbiAgICAgICAgICAgICAgICBzdGF0dXM6IDIwMCxcbiAgICAgICAgICAgICAgICBkYXRhOiBmaW5kJC5kYXRhWyAwIF1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9IGNhdGNoICggZSApIHtcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKCByZXNvbHZlID0+IHtcbiAgICAgICAgICAgIHJlc29sdmUoe1xuICAgICAgICAgICAgICAgIHN0YXR1czogNTAwLFxuICAgICAgICAgICAgICAgIGRhdGE6IEpTT04uc3RyaW5naWZ5KCBlIClcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9XG5cbn0iXX0=