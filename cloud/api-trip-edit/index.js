"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
    var _id_1, rule1$, create$, origin$, origin, temp, e_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 7, , 8]);
                _id_1 = event.data._id;
                return [4, db.collection('trip').where({
                        end_date: _.gte(event.data.start_date)
                    })
                        .count()];
            case 1:
                rule1$ = _a.sent();
                if (rule1$.total > 0) {
                    return [2, new Promise(function (resolve) {
                            resolve({
                                data: null,
                                status: 500,
                                message: '开始时间必须大于上趟行程的结束时间'
                            });
                        })];
                }
                if (!!_id_1) return [3, 3];
                return [4, db.collection('trip').add({
                        data: event.data
                    })];
            case 2:
                create$ = _a.sent();
                _id_1 = create$._id;
                return [3, 6];
            case 3: return [4, db.collection('trip')
                    .where({
                    _id: _id_1
                })
                    .get()];
            case 4:
                origin$ = _a.sent();
                origin = origin$.data[0];
                delete origin['_id'];
                delete event.data['_id'];
                temp = Object.assign({}, origin, __assign({}, event.data));
                return [4, db.collection('trip')
                        .doc(_id_1)
                        .set({
                        data: temp
                    })];
            case 5:
                _a.sent();
                _a.label = 6;
            case 6: return [2, new Promise(function (resolve) {
                    resolve({
                        data: _id_1,
                        status: 200
                    });
                })];
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUNBLGlCQTRHQzs7QUE1R0QscUNBQXVDO0FBRXZDLEtBQUssQ0FBQyxJQUFJLEVBQUUsQ0FBQztBQUViLElBQU0sRUFBRSxHQUFnQixLQUFLLENBQUMsUUFBUSxFQUFHLENBQUM7QUFDMUMsSUFBTSxDQUFDLEdBQUcsRUFBRSxDQUFDLE9BQU8sQ0FBQztBQStCUixRQUFBLElBQUksR0FBRyxVQUFRLEtBQUssRUFBRSxPQUFPOzs7Ozs7Z0JBSTlCLFFBQU0sS0FBSyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUM7Z0JBR1YsV0FBTSxFQUFFLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQyxDQUFDLEtBQUssQ0FBQzt3QkFDN0MsUUFBUSxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUUsS0FBSyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUU7cUJBQzNDLENBQUM7eUJBQ0QsS0FBSyxFQUFHLEVBQUE7O2dCQUhILE1BQU0sR0FBRyxTQUdOO2dCQUVULElBQUssTUFBTSxDQUFDLEtBQUssR0FBRyxDQUFDLEVBQUc7b0JBQ3BCLFdBQU8sSUFBSSxPQUFPLENBQUUsVUFBQSxPQUFPOzRCQUN2QixPQUFPLENBQUM7Z0NBQ0osSUFBSSxFQUFFLElBQUk7Z0NBQ1YsTUFBTSxFQUFFLEdBQUc7Z0NBQ1gsT0FBTyxFQUFFLG1CQUFtQjs2QkFDL0IsQ0FBQyxDQUFBO3dCQUNOLENBQUMsQ0FBQyxFQUFDO2lCQUNOO3FCQUdJLENBQUMsS0FBRyxFQUFKLGNBQUk7Z0JBRVcsV0FBTSxFQUFFLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQyxDQUFDLEdBQUcsQ0FBQzt3QkFDNUMsSUFBSSxFQUFFLEtBQUssQ0FBQyxJQUFJO3FCQUNuQixDQUFDLEVBQUE7O2dCQUZJLE9BQU8sR0FBRyxTQUVkO2dCQUNGLEtBQUcsR0FBRyxPQUFPLENBQUMsR0FBRyxDQUFDOztvQkFLRixXQUFNLEVBQUUsQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDO3FCQUN0QixLQUFLLENBQUM7b0JBQ0gsR0FBRyxPQUFBO2lCQUNOLENBQUM7cUJBQ0QsR0FBRyxFQUFHLEVBQUE7O2dCQUpyQixPQUFPLEdBQUcsU0FJVztnQkFFckIsTUFBTSxHQUFHLE9BQU8sQ0FBQyxJQUFJLENBQUUsQ0FBQyxDQUFFLENBQUM7Z0JBRWpDLE9BQU8sTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDO2dCQUNyQixPQUFPLEtBQUssQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUE7Z0JBRWxCLElBQUksR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDLEVBQUcsRUFBRSxNQUFNLGVBQy9CLEtBQUssQ0FBQyxJQUFJLEVBQ2YsQ0FBQTtnQkFFRixXQUFNLEVBQUUsQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDO3lCQUNsQixHQUFHLENBQUUsS0FBRyxDQUFFO3lCQUNWLEdBQUcsQ0FBQzt3QkFDRCxJQUFJLEVBQUUsSUFBSTtxQkFDYixDQUFDLEVBQUE7O2dCQUpWLFNBSVUsQ0FBQzs7b0JBSWYsV0FBTyxJQUFJLE9BQU8sQ0FBRSxVQUFBLE9BQU87b0JBQ3ZCLE9BQU8sQ0FBQzt3QkFDSixJQUFJLEVBQUUsS0FBRzt3QkFDVCxNQUFNLEVBQUUsR0FBRztxQkFDZCxDQUFDLENBQUE7Z0JBQ04sQ0FBQyxDQUFDLEVBQUM7OztnQkFHSCxXQUFPLElBQUksT0FBTyxDQUFDLFVBQUUsT0FBTyxFQUFFLE1BQU07d0JBQ2hDLE1BQU0sQ0FBQzs0QkFDSCxNQUFNLEVBQUUsR0FBRzs0QkFDWCxPQUFPLEVBQUUsR0FBQzt5QkFDYixDQUFDLENBQUE7b0JBQ04sQ0FBQyxDQUFDLEVBQUE7Ozs7S0FHVCxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiLy8g5LqR5Ye95pWw5YWl5Y+j5paH5Lu2XG5pbXBvcnQgKiBhcyBjbG91ZCBmcm9tICd3eC1zZXJ2ZXItc2RrJztcblxuY2xvdWQuaW5pdCgpO1xuXG5jb25zdCBkYjogREIuRGF0YWJhc2UgPSBjbG91ZC5kYXRhYmFzZSggKTtcbmNvbnN0IF8gPSBkYi5jb21tYW5kO1xuXG4vKipcbiAqIEBkZXNjcmlwdGlvbiDliJvlu7ov57yW6L6R6KGM56iLXG4gKiAhIOWIm+W7uuihjOeoi++8jOimgeWIpOaWreW8gOWni+aXpeacn+Wkp+S6juS4iuS4gOi2n+ihjOeoi+eahOe7k+adn+ihjOeoi1xuICogLS0tLS0tLS0g6K+35rGCIC0tLS0tLS0tLS1cbiAqIHtcbiAgICAgICAgdGl0bGUg5qCH6aKYIHN0cmluZ1xuICAgICAgICBkZXN0aW5hdGlvbiDnm67nmoTlnLAgc3RyaW5nXG4gICAgICAgIHN0YXJ0X2RhdGUg5byA5aeL5pe26Ze0IG51bWJlclxuICAgICAgICBlbmRfZGF0ZSDnu5PmnZ/ml7bpl7QgbnVtYmVyXG4gICAgICAgIHJlZHVjZV9wcmljZSDooYznqIvnq4vlh48gbnVtYmVyXG4gICAgICAgIHNhbGVzX3ZvbHVtZSDplIDllK7mgLvpop1cbiAgICAgICAgZnVsbHJlZHVjZV9hdGxlYXN0IOihjOeoi+a7oeWHjyAtIOmXqOanmyBudW1iZXJcbiAgICAgICAgZnVsbHJlZHVjZV92YWx1ZXMg6KGM56iL5ruh5YePIC0g5YeP5aSa5bCRIG51bWJlclxuICAgICAgICBjYXNoY291cG9uX2F0bGVhc3Qg6KGM56iL5Luj6YeR5Yi4IC0g6Zeo5qebIG51bWJlclxuICAgICAgICBjYXNoY291cG9uX3ZhbHVlcyDooYznqIvku6Pph5HliLggLSDph5Hpop0gbnVtYmVyXG4gICAgICAgIHBvc3RhZ2Ug6YKu6LS557G75Z6LIGRpYyBcbiAgICAgICAgcG9zdGFnZWZyZWVfYXRsZWFzdCAg5YWN6YKu6Zeo5qebIG51bWJlclxuICAgICAgICBwYXltZW50IOS7mOasvuexu+WeiyBkaWMgXG4gICAgICAgIHB1Ymxpc2hlZCDmmK/lkKblj5HluIMgYm9vbGVhblxuICAgICAgICBpc1Bhc3NlZCDmmK/lkKbov4fmnJ9cbiAgICAgICAgY3JlYXRlVGltZSDliJvlu7rml7bpl7RcbiAgICAgICAgdXBkYXRlVGltZSDmm7TmlrDml7bpl7RcbiAqIH1cbiAqIC0tLS0tLS0tIOivt+axgiAtLS0tLS0tLS0tXG4gKiB7XG4gKiAgICAgIF9pZDogc3RyaW5nXG4gKiAgICAgIHN0YXR1czogMjAwIC8gNTAwXG4gKiB9XG4gKi9cbmV4cG9ydCBjb25zdCBtYWluID0gYXN5bmMgKCBldmVudCwgY29udGV4dCkgPT4ge1xuXG4gICAgdHJ5IHtcblxuICAgICAgICBsZXQgX2lkID0gZXZlbnQuZGF0YS5faWQ7XG5cbiAgICAgICAgLy8g5qCh6aqMXG4gICAgICAgIGNvbnN0IHJ1bGUxJCA9IGF3YWl0IGRiLmNvbGxlY3Rpb24oJ3RyaXAnKS53aGVyZSh7XG4gICAgICAgICAgICBlbmRfZGF0ZTogXy5ndGUoIGV2ZW50LmRhdGEuc3RhcnRfZGF0ZSApXG4gICAgICAgIH0pXG4gICAgICAgIC5jb3VudCggKTtcblxuICAgICAgICBpZiAoIHJ1bGUxJC50b3RhbCA+IDAgKSB7XG4gICAgICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoIHJlc29sdmUgPT4ge1xuICAgICAgICAgICAgICAgIHJlc29sdmUoe1xuICAgICAgICAgICAgICAgICAgICBkYXRhOiBudWxsLFxuICAgICAgICAgICAgICAgICAgICBzdGF0dXM6IDUwMCxcbiAgICAgICAgICAgICAgICAgICAgbWVzc2FnZTogJ+W8gOWni+aXtumXtOW/hemhu+Wkp+S6juS4iui2n+ihjOeoi+eahOe7k+adn+aXtumXtCdcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0gXG5cbiAgICAgICAgLy8g5Yib5bu6IFxuICAgICAgICBpZiAoICFfaWQgKSB7XG5cbiAgICAgICAgICAgIGNvbnN0IGNyZWF0ZSQgPSBhd2FpdCBkYi5jb2xsZWN0aW9uKCd0cmlwJykuYWRkKHtcbiAgICAgICAgICAgICAgICBkYXRhOiBldmVudC5kYXRhXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIF9pZCA9IGNyZWF0ZSQuX2lkO1xuXG4gICAgICAgIC8vIOe8lui+kVxuICAgICAgICB9IGVsc2Uge1xuXG4gICAgICAgICAgICBjb25zdCBvcmlnaW4kID0gYXdhaXQgZGIuY29sbGVjdGlvbigndHJpcCcpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC53aGVyZSh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBfaWRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLmdldCggKTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgY29uc3Qgb3JpZ2luID0gb3JpZ2luJC5kYXRhWyAwIF07XG5cbiAgICAgICAgICAgIGRlbGV0ZSBvcmlnaW5bJ19pZCddO1xuICAgICAgICAgICAgZGVsZXRlIGV2ZW50LmRhdGFbJ19pZCddXG5cbiAgICAgICAgICAgIGNvbnN0IHRlbXAgPSBPYmplY3QuYXNzaWduKHsgfSwgb3JpZ2luLCB7XG4gICAgICAgICAgICAgICAgLi4uZXZlbnQuZGF0YVxuICAgICAgICAgICAgfSlcblxuICAgICAgICAgICAgYXdhaXQgZGIuY29sbGVjdGlvbigndHJpcCcpXG4gICAgICAgICAgICAgICAgICAgIC5kb2MoIF9pZCApXG4gICAgICAgICAgICAgICAgICAgIC5zZXQoe1xuICAgICAgICAgICAgICAgICAgICAgICAgZGF0YTogdGVtcFxuICAgICAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKCByZXNvbHZlID0+IHtcbiAgICAgICAgICAgIHJlc29sdmUoe1xuICAgICAgICAgICAgICAgIGRhdGE6IF9pZCxcbiAgICAgICAgICAgICAgICBzdGF0dXM6IDIwMFxuICAgICAgICAgICAgfSlcbiAgICAgICAgfSk7XG5cbiAgICB9IGNhdGNoICggZSApIHtcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKCggcmVzb2x2ZSwgcmVqZWN0ICkgPT4ge1xuICAgICAgICAgICAgcmVqZWN0KHtcbiAgICAgICAgICAgICAgICBzdGF0dXM6IDUwMCxcbiAgICAgICAgICAgICAgICBtZXNzYWdlOiBlXG4gICAgICAgICAgICB9KVxuICAgICAgICB9KVxuICAgIH1cblxufSJdfQ==