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
            return [2, new Promise(function (resolve) {
                    resolve({
                        status: 200,
                        data: []
                    });
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFDQSxpQkF1Q0M7O0FBdkNELHFDQUF1QztBQUV2QyxLQUFLLENBQUMsSUFBSSxFQUFHLENBQUM7QUFFZCxJQUFNLEVBQUUsR0FBZ0IsS0FBSyxDQUFDLFFBQVEsRUFBRyxDQUFDO0FBQzFDLElBQU0sQ0FBQyxHQUFHLEVBQUUsQ0FBQyxPQUFPLENBQUM7QUFjUixRQUFBLElBQUksR0FBRyxVQUFRLEtBQUssRUFBRSxPQUFPOztRQUV0QyxJQUFJO1lBR0EsV0FBTyxJQUFJLE9BQU8sQ0FBRSxVQUFBLE9BQU87b0JBQ3JCLE9BQU8sQ0FBQzt3QkFDSixNQUFNLEVBQUUsR0FBRzt3QkFDWCxJQUFJLEVBQUUsRUFBRztxQkFDWixDQUFDLENBQUM7Z0JBQ1QsQ0FBQyxDQUFDLEVBQUM7U0FDTjtRQUFDLE9BQVEsQ0FBQyxFQUFHO1lBQ1YsV0FBTyxJQUFJLE9BQU8sQ0FBQyxVQUFFLE9BQU8sRUFBRSxNQUFNO29CQUNoQyxNQUFNLENBQUM7d0JBQ0gsTUFBTSxFQUFFLEdBQUc7d0JBQ1gsT0FBTyxFQUFFLENBQUM7cUJBQ2IsQ0FBQyxDQUFBO2dCQUNOLENBQUMsQ0FBQyxFQUFBO1NBQ0w7OztLQUVKLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyIvLyDkupHlh73mlbDlhaXlj6Pmlofku7ZcbmltcG9ydCAqIGFzIGNsb3VkIGZyb20gJ3d4LXNlcnZlci1zZGsnO1xuXG5jbG91ZC5pbml0KCApO1xuXG5jb25zdCBkYjogREIuRGF0YWJhc2UgPSBjbG91ZC5kYXRhYmFzZSggKTtcbmNvbnN0IF8gPSBkYi5jb21tYW5kO1xuXG4vKipcbiAqIEBkZXNjcmlwdGlvbiDov5Tlm57kuKTkuKrooYznqIvvvIzkuIDkuKrlnKjnlKgv5Y2z5bCG5Yiw5p2l77yM5Y+m5LiA5Liq5LiL5LiA6Laf5Y2z5bCG5Yiw5p2lXG4gKiAtLS0tLS0tLSDor7fmsYIgLS0tLS0tLS0tLVxuICoge1xuICogICAgICBfaWQ6IOihjOeoi2lkXG4gKiB9XG4gKiAtLS0tLS0tLS0tIOi/lOWbniAtLS0tLS0tLVxuICoge1xuICogICAgICBkYXRhOiDooYznqIvor6bmg4VcbiAqICAgICAgc3RhdHVzXG4gKiB9XG4gKi9cbmV4cG9ydCBjb25zdCBtYWluID0gYXN5bmMgKCBldmVudCwgY29udGV4dCkgPT4ge1xuXG4gICAgdHJ5IHtcbiAgICAgICAgXG5cbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKCByZXNvbHZlID0+IHtcbiAgICAgICAgICAgICAgcmVzb2x2ZSh7XG4gICAgICAgICAgICAgICAgICBzdGF0dXM6IDIwMCxcbiAgICAgICAgICAgICAgICAgIGRhdGE6IFsgXVxuICAgICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfSBjYXRjaCAoIGUgKSB7XG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgoIHJlc29sdmUsIHJlamVjdCApID0+IHtcbiAgICAgICAgICAgIHJlamVjdCh7XG4gICAgICAgICAgICAgICAgc3RhdHVzOiA1MDAsXG4gICAgICAgICAgICAgICAgbWVzc2FnZTogZVxuICAgICAgICAgICAgfSlcbiAgICAgICAgfSlcbiAgICB9XG5cbn0iXX0=