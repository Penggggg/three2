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
    var pid, openid, history$_1, e_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                pid = event.pid;
                openid = event.userInfo.openId;
                return [4, db.collection('like-collection')
                        .where({
                        pid: pid,
                        openid: openid
                    })
                        .count()];
            case 1:
                history$_1 = _a.sent();
                return [2, new Promise(function (resolve) {
                        resolve({
                            status: 200,
                            data: history$_1.total > 0
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFDQSxpQkFnREM7O0FBaERELHFDQUF1QztBQUV2QyxLQUFLLENBQUMsSUFBSSxFQUFFLENBQUM7QUFFYixJQUFNLEVBQUUsR0FBZ0IsS0FBSyxDQUFDLFFBQVEsRUFBRSxDQUFDO0FBYzVCLFFBQUEsSUFBSSxHQUFHLFVBQVEsS0FBSyxFQUFFLE9BQU87Ozs7OztnQkFJaEMsR0FBRyxHQUFHLEtBQUssQ0FBQyxHQUFHLENBQUM7Z0JBQ2hCLE1BQU0sR0FBRyxLQUFLLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQztnQkFHcEIsV0FBTSxFQUFFLENBQUMsVUFBVSxDQUFDLGlCQUFpQixDQUFDO3lCQUNsRCxLQUFLLENBQUM7d0JBQ0gsR0FBRyxLQUFBO3dCQUNILE1BQU0sUUFBQTtxQkFDVCxDQUFDO3lCQUNELEtBQUssRUFBRyxFQUFBOztnQkFMUCxhQUFXLFNBS0o7Z0JBRWIsV0FBTyxJQUFJLE9BQU8sQ0FBRSxVQUFBLE9BQU87d0JBQ3ZCLE9BQU8sQ0FBQzs0QkFDSixNQUFNLEVBQUUsR0FBRzs0QkFDWCxJQUFJLEVBQUUsVUFBUSxDQUFDLEtBQUssR0FBRyxDQUFDO3lCQUMzQixDQUFDLENBQUM7b0JBQ1AsQ0FBQyxDQUFDLEVBQUM7OztnQkFFSCxXQUFPLElBQUksT0FBTyxDQUFDLFVBQUUsT0FBTyxFQUFFLE1BQU07d0JBQ2xDLE1BQU0sQ0FBQzs0QkFDTCxNQUFNLEVBQUUsR0FBRzs0QkFDWCxPQUFPLEVBQUUsR0FBQzt5QkFDWCxDQUFDLENBQUE7b0JBQ0osQ0FBQyxDQUFDLEVBQUE7Ozs7S0FHTCxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiLy8g5LqR5Ye95pWw5YWl5Y+j5paH5Lu2XG5pbXBvcnQgKiBhcyBjbG91ZCBmcm9tICd3eC1zZXJ2ZXItc2RrJztcblxuY2xvdWQuaW5pdCgpO1xuXG5jb25zdCBkYjogREIuRGF0YWJhc2UgPSBjbG91ZC5kYXRhYmFzZSgpO1xuXG4vKipcbiAqIEBkZXNjcmlwdGlvbiDnlKjmiLflr7nmmK/lkKbllYblk4HnmoTmlLbol49cbiAqIC0tLS0tLS0tIOivt+axgiAtLS0tLS0tLS0tXG4gKiB7XG4gKiAgICAgIHBpZDog5ZWG5ZOBaWRcbiAqIH1cbiAqIC0tLS0tLS0tLS0g6L+U5ZueIC0tLS0tLS0tXG4gKiB7XG4gKiAgICAgIHN0YXR1c1xuICogICAgICBkYXRhOiBib29sZWFuXG4gKiB9XG4gKi9cbmV4cG9ydCBjb25zdCBtYWluID0gYXN5bmMgKCBldmVudCwgY29udGV4dCkgPT4ge1xuXG4gIHRyeSB7XG5cbiAgICBjb25zdCBwaWQgPSBldmVudC5waWQ7XG4gICAgY29uc3Qgb3BlbmlkID0gZXZlbnQudXNlckluZm8ub3BlbklkO1xuXG4gICAgLy8g5p+l5om+5pyJ5rKh5pyJ6K+l6K6w5b2VXG4gICAgY29uc3QgaGlzdG9yeSQgPSBhd2FpdCBkYi5jb2xsZWN0aW9uKCdsaWtlLWNvbGxlY3Rpb24nKVxuICAgICAgICAud2hlcmUoe1xuICAgICAgICAgICAgcGlkLFxuICAgICAgICAgICAgb3BlbmlkXG4gICAgICAgIH0pXG4gICAgICAgIC5jb3VudCggKTtcblxuICAgIHJldHVybiBuZXcgUHJvbWlzZSggcmVzb2x2ZSA9PiB7XG4gICAgICAgIHJlc29sdmUoe1xuICAgICAgICAgICAgc3RhdHVzOiAyMDAsXG4gICAgICAgICAgICBkYXRhOiBoaXN0b3J5JC50b3RhbCA+IDBcbiAgICAgICAgfSk7XG4gICAgfSk7XG4gIH0gY2F0Y2ggKCBlICkge1xuICAgIHJldHVybiBuZXcgUHJvbWlzZSgoIHJlc29sdmUsIHJlamVjdCApID0+IHtcbiAgICAgIHJlamVjdCh7XG4gICAgICAgIHN0YXR1czogNTAwLFxuICAgICAgICBtZXNzYWdlOiBlXG4gICAgICB9KVxuICAgIH0pXG4gIH1cblxufSJdfQ==