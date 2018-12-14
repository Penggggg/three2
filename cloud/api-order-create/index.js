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
    var trips$_1, e_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4, cloud.callFunction({
                        data: {},
                        name: 'api-trip-enter'
                    })];
            case 1:
                trips$_1 = _a.sent();
                return [2, new Promise(function (resolve) {
                        resolve({
                            data: trips$_1,
                            status: 200
                        });
                    })];
            case 2:
                e_1 = _a.sent();
                return [2, new Promise(function (resolve, reject) {
                        resolve({
                            status: 500,
                            message: e_1
                        });
                    })];
            case 3: return [2];
        }
    });
}); };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFDQSxpQkFpRkM7O0FBakZELHFDQUF1QztBQUV2QyxLQUFLLENBQUMsSUFBSSxFQUFHLENBQUM7QUFFZCxJQUFNLEVBQUUsR0FBZ0IsS0FBSyxDQUFDLFFBQVEsRUFBRyxDQUFDO0FBb0Q3QixRQUFBLElBQUksR0FBRyxVQUFRLEtBQUssRUFBRSxPQUFPOzs7Ozs7Z0JBSXZCLFdBQU0sS0FBSyxDQUFDLFlBQVksQ0FBQzt3QkFDcEMsSUFBSSxFQUFFLEVBQUc7d0JBQ1QsSUFBSSxFQUFFLGdCQUFnQjtxQkFDekIsQ0FBQyxFQUFBOztnQkFISSxXQUFTLFNBR2I7Z0JBRUYsV0FBTyxJQUFJLE9BQU8sQ0FBRSxVQUFBLE9BQU87d0JBQ3ZCLE9BQU8sQ0FBQzs0QkFDSixJQUFJLEVBQUUsUUFBTTs0QkFDWixNQUFNLEVBQUUsR0FBRzt5QkFDZCxDQUFDLENBQUE7b0JBQ04sQ0FBQyxDQUFDLEVBQUE7OztnQkFHQSxXQUFPLElBQUksT0FBTyxDQUFDLFVBQUUsT0FBTyxFQUFFLE1BQU07d0JBQzlCLE9BQU8sQ0FBQzs0QkFDSixNQUFNLEVBQUUsR0FBRzs0QkFDWCxPQUFPLEVBQUUsR0FBQzt5QkFDYixDQUFDLENBQUE7b0JBQ1IsQ0FBQyxDQUFDLEVBQUE7Ozs7S0FHUCxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiLy8g5LqR5Ye95pWw5YWl5Y+j5paH5Lu2XG5pbXBvcnQgKiBhcyBjbG91ZCBmcm9tICd3eC1zZXJ2ZXItc2RrJztcblxuY2xvdWQuaW5pdCggKTtcblxuY29uc3QgZGI6IERCLkRhdGFiYXNlID0gY2xvdWQuZGF0YWJhc2UoICk7XG5cbi8qKlxuICogQGRlc2NyaXB0aW9uIOaJuemHj+WIm+W7uuiuouWNlVxuICogLS0tLS0tLS0g5a2X5q61IC0tLS0tLS0tLS1cbiAqIF9pZFxuICogb3BlbmlkLFxuICogY3JlYXRldGltZVxuICogdGlkLFxuICogcGlkLFxuICogc2lkLFxuICogY291bnQsXG4gKiBwcmljZSxcbiAqIHR5cGU6ICdjdXN0b20nIHwgJ25vcm1hbCcg6Ieq5a6a5LmJ5Yqg5Y2V44CB5pmu6YCa5Yqg5Y2VXG4gKiBpbWc6IEFycmF5WyBzdHJpbmcgXVxuICogZGVzYyxcbiAqIGFkZHJlc3NpZFxuICAgICAgICAqIHVzZXJuYW1lLCDmlLbotKfkurpcbiAgICAgICAgKiBwb3N0YWxjb2RlLCDpgq7mlL9cbiAgICAgICAgKiBwaG9uZSwg5pS26I6355S16K+dXG4gICAgICAgICogYWRkcmVzcywg5pS26I635Zyw5Z2AXG4gKiBiYXNlX3N0YXR1czogMCwxLDIsMyDlh4blpIfkuK3vvIzov5vooYzkuK3vvIzlt7LosIPmlbTvvIzlt7Lnu5PnrpdcbiAqIHBheV9zdGF0dXM6IDAsMSwyIOacquS7mOasvu+8jOW3suS7mOiuoumHke+8jOW3suS7mOWFqOasvlxuICogZGVsaXZlcl9zdGF0dXM6IDAsMSDmnKrlj5HluIPvvIzlt7Llj5HluIPjgIFcbiAqIFxuICogLS0tLS0tLS0g6K+35rGCIC0tLS0tLS0tLS1cbiAqIHtcbiAqICAgICAgZnJvbTogJ2NhcnQnIHwgJ2J1eScgfCAnY3VzdG9tJyB8ICdhZ2VudHMnXG4gKiAgICAgIGRhdGE6IEFycmF5PHtcbiAqICAgICAgICAgIHNpZFxuICogICAgICAgICAgcGlkXG4gKiAgICAgICAgICBwcmljZVxuICogICAgICAgICAgY291bnRcbiAqICAgICAgICAgIGRlc2NcbiAqICAgICAgICAgIGltZ1xuICogICAgICAgICAgdHlwZVxuICogICAgICAgICAgYWRkcmVzczoge1xuICogICAgICAgICAgICAgIG5hbWUsXG4gKiAgICAgICAgICAgICAgcGhvbmUsXG4gKiAgICAgICAgICAgICAgZGV0YWlsLFxuICogICAgICAgICAgICAgIHBvc3RhbGNvZGVcbiAqICAgICAgICAgIH1cbiAqICAgICAgfT5cbiAqIH1cbiAqIC0tLS0tLS0tLS0g6L+U5ZueIC0tLS0tLS0tXG4gKiB7XG4gKiAgICAgIHN0YXR1c1xuICogfVxuICogQGRlc2NyaXB0aW9uXG4gKiAhIOWFiOWIpOaWreacieayoeacieWPr+eUqOihjOeoi+OAglxuICogISDlnLDlnYDnrqHnkIbvvIzlhYjlr7nmr5TnlKjml6flnLDlnYBpZOaIluaWsOW7uueahOWcsOWdgGlkXG4gKi9cbmV4cG9ydCBjb25zdCBtYWluID0gYXN5bmMgKCBldmVudCwgY29udGV4dCApID0+IHtcblxuICB0cnkge1xuXG4gICAgY29uc3QgdHJpcHMkID0gYXdhaXQgY2xvdWQuY2FsbEZ1bmN0aW9uKHtcbiAgICAgICAgZGF0YTogeyB9LFxuICAgICAgICBuYW1lOiAnYXBpLXRyaXAtZW50ZXInXG4gICAgfSk7XG5cbiAgICByZXR1cm4gbmV3IFByb21pc2UoIHJlc29sdmUgPT4ge1xuICAgICAgICByZXNvbHZlKHtcbiAgICAgICAgICAgIGRhdGE6IHRyaXBzJCxcbiAgICAgICAgICAgIHN0YXR1czogMjAwXG4gICAgICAgIH0pXG4gICAgfSlcblxuICB9IGNhdGNoICggZSApIHtcbiAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgoIHJlc29sdmUsIHJlamVjdCApID0+IHtcbiAgICAgICAgICAgIHJlc29sdmUoe1xuICAgICAgICAgICAgICAgIHN0YXR1czogNTAwLFxuICAgICAgICAgICAgICAgIG1lc3NhZ2U6IGVcbiAgICAgICAgICAgIH0pXG4gICAgICB9KVxuICB9XG5cbn0iXX0=