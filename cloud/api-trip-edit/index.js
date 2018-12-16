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
                _a.trys.push([0, 8, , 9]);
                _id_1 = event.data._id;
                if (!(event.data.published && !_id_1)) return [3, 2];
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
                _a.label = 2;
            case 2:
                if (!!_id_1) return [3, 4];
                return [4, db.collection('trip').add({
                        data: event.data
                    })];
            case 3:
                create$ = _a.sent();
                _id_1 = create$._id;
                return [3, 7];
            case 4: return [4, db.collection('trip')
                    .where({
                    _id: _id_1
                })
                    .get()];
            case 5:
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
            case 6:
                _a.sent();
                _a.label = 7;
            case 7: return [2, new Promise(function (resolve) {
                    resolve({
                        data: _id_1,
                        status: 200
                    });
                })];
            case 8:
                e_1 = _a.sent();
                return [2, new Promise(function (resolve, reject) {
                        resolve({
                            status: 500,
                            message: e_1
                        });
                    })];
            case 9: return [2];
        }
    });
}); };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUNBLGlCQStHQzs7QUEvR0QscUNBQXVDO0FBRXZDLEtBQUssQ0FBQyxJQUFJLEVBQUUsQ0FBQztBQUViLElBQU0sRUFBRSxHQUFnQixLQUFLLENBQUMsUUFBUSxFQUFHLENBQUM7QUFDMUMsSUFBTSxDQUFDLEdBQUcsRUFBRSxDQUFDLE9BQU8sQ0FBQztBQWdDUixRQUFBLElBQUksR0FBRyxVQUFRLEtBQUssRUFBRSxPQUFPOzs7Ozs7Z0JBSTlCLFFBQU0sS0FBSyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUM7cUJBR3BCLENBQUEsS0FBSyxDQUFDLElBQUksQ0FBQyxTQUFTLElBQUksQ0FBQyxLQUFHLENBQUEsRUFBNUIsY0FBNEI7Z0JBQ2QsV0FBTSxFQUFFLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQyxDQUFDLEtBQUssQ0FBQzt3QkFDN0MsUUFBUSxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUUsS0FBSyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUU7cUJBQzNDLENBQUM7eUJBQ0QsS0FBSyxFQUFHLEVBQUE7O2dCQUhILE1BQU0sR0FBRyxTQUdOO2dCQUVULElBQUssTUFBTSxDQUFDLEtBQUssR0FBRyxDQUFDLEVBQUc7b0JBQ3BCLFdBQU8sSUFBSSxPQUFPLENBQUUsVUFBQSxPQUFPOzRCQUN2QixPQUFPLENBQUM7Z0NBQ0osSUFBSSxFQUFFLElBQUk7Z0NBQ1YsTUFBTSxFQUFFLEdBQUc7Z0NBQ1gsT0FBTyxFQUFFLG1CQUFtQjs2QkFDL0IsQ0FBQyxDQUFBO3dCQUNOLENBQUMsQ0FBQyxFQUFDO2lCQUNOOzs7cUJBSUEsQ0FBQyxLQUFHLEVBQUosY0FBSTtnQkFFVyxXQUFNLEVBQUUsQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDLENBQUMsR0FBRyxDQUFDO3dCQUM1QyxJQUFJLEVBQUUsS0FBSyxDQUFDLElBQUk7cUJBQ25CLENBQUMsRUFBQTs7Z0JBRkksT0FBTyxHQUFHLFNBRWQ7Z0JBQ0YsS0FBRyxHQUFHLE9BQU8sQ0FBQyxHQUFHLENBQUM7O29CQUtGLFdBQU0sRUFBRSxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUM7cUJBQ3RCLEtBQUssQ0FBQztvQkFDSCxHQUFHLE9BQUE7aUJBQ04sQ0FBQztxQkFDRCxHQUFHLEVBQUcsRUFBQTs7Z0JBSnJCLE9BQU8sR0FBRyxTQUlXO2dCQUVyQixNQUFNLEdBQUcsT0FBTyxDQUFDLElBQUksQ0FBRSxDQUFDLENBQUUsQ0FBQztnQkFFakMsT0FBTyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUM7Z0JBQ3JCLE9BQU8sS0FBSyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQTtnQkFFbEIsSUFBSSxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUMsRUFBRyxFQUFFLE1BQU0sZUFDL0IsS0FBSyxDQUFDLElBQUksRUFDZixDQUFBO2dCQUVGLFdBQU0sRUFBRSxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUM7eUJBQ2xCLEdBQUcsQ0FBRSxLQUFHLENBQUU7eUJBQ1YsR0FBRyxDQUFDO3dCQUNELElBQUksRUFBRSxJQUFJO3FCQUNiLENBQUMsRUFBQTs7Z0JBSlYsU0FJVSxDQUFDOztvQkFJZixXQUFPLElBQUksT0FBTyxDQUFFLFVBQUEsT0FBTztvQkFDdkIsT0FBTyxDQUFDO3dCQUNKLElBQUksRUFBRSxLQUFHO3dCQUNULE1BQU0sRUFBRSxHQUFHO3FCQUNkLENBQUMsQ0FBQTtnQkFDTixDQUFDLENBQUMsRUFBQzs7O2dCQUdILFdBQU8sSUFBSSxPQUFPLENBQUMsVUFBRSxPQUFPLEVBQUUsTUFBTTt3QkFDaEMsT0FBTyxDQUFDOzRCQUNKLE1BQU0sRUFBRSxHQUFHOzRCQUNYLE9BQU8sRUFBRSxHQUFDO3lCQUNiLENBQUMsQ0FBQTtvQkFDTixDQUFDLENBQUMsRUFBQTs7OztLQUdULENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyIvLyDkupHlh73mlbDlhaXlj6Pmlofku7ZcbmltcG9ydCAqIGFzIGNsb3VkIGZyb20gJ3d4LXNlcnZlci1zZGsnO1xuXG5jbG91ZC5pbml0KCk7XG5cbmNvbnN0IGRiOiBEQi5EYXRhYmFzZSA9IGNsb3VkLmRhdGFiYXNlKCApO1xuY29uc3QgXyA9IGRiLmNvbW1hbmQ7XG5cbi8qKlxuICogQGRlc2NyaXB0aW9uIOWIm+W7ui/nvJbovpHooYznqItcbiAqICEg5qCh6aqM6KeE5YiZMTog5Y+R5biD6KGM56iL5pe277yM6KaB5Yik5pat5byA5aeL5pel5pyf5aSn5LqO5LiK5LiA6Laf6KGM56iL55qE57uT5p2f6KGM56iLXG4gKiAtLS0tLS0tLSDor7fmsYIgLS0tLS0tLS0tLVxuICoge1xuICAgICAgICB0aXRsZSDmoIfpopggc3RyaW5nXG4gICAgICAgIGRlc3RpbmF0aW9uIOebrueahOWcsCBzdHJpbmdcbiAgICAgICAgc3RhcnRfZGF0ZSDlvIDlp4vml7bpl7QgbnVtYmVyXG4gICAgICAgIGVuZF9kYXRlIOe7k+adn+aXtumXtCBudW1iZXJcbiAgICAgICAgcmVkdWNlX3ByaWNlIOihjOeoi+eri+WHjyBudW1iZXJcbiAgICAgICAgc2FsZXNfdm9sdW1lIOmUgOWUruaAu+minVxuICAgICAgICBmdWxscmVkdWNlX2F0bGVhc3Qg6KGM56iL5ruh5YePIC0g6Zeo5qebIG51bWJlclxuICAgICAgICBmdWxscmVkdWNlX3ZhbHVlcyDooYznqIvmu6Hlh48gLSDlh4/lpJrlsJEgbnVtYmVyXG4gICAgICAgIGNhc2hjb3Vwb25fYXRsZWFzdCDooYznqIvku6Pph5HliLggLSDpl6jmp5sgbnVtYmVyXG4gICAgICAgIGNhc2hjb3Vwb25fdmFsdWVzIOihjOeoi+S7o+mHkeWIuCAtIOmHkeminSBudW1iZXJcbiAgICAgICAgcG9zdGFnZSDpgq7otLnnsbvlnosgZGljIFxuICAgICAgICBwb3N0YWdlZnJlZV9hdGxlYXN0ICDlhY3pgq7pl6jmp5sgbnVtYmVyXG4gICAgICAgIHBheW1lbnQg5LuY5qy+57G75Z6LIGRpYyBcbiAgICAgICAgcHVibGlzaGVkIOaYr+WQpuWPkeW4gyBib29sZWFuXG4gICAgICAgIGlzUGFzc2VkIOaYr+WQpui/h+acn1xuICAgICAgICBjcmVhdGVUaW1lIOWIm+W7uuaXtumXtFxuICAgICAgICB1cGRhdGVUaW1lIOabtOaWsOaXtumXtFxuICAgICAgICBpc0Nsb3NlZDog5piv5ZCm5bey57uP5omL5Yqo5YWz6ZetXG4gKiB9XG4gKiAtLS0tLS0tLSDor7fmsYIgLS0tLS0tLS0tLVxuICoge1xuICogICAgICBfaWQ6IHN0cmluZ1xuICogICAgICBzdGF0dXM6IDIwMCAvIDUwMFxuICogfVxuICovXG5leHBvcnQgY29uc3QgbWFpbiA9IGFzeW5jICggZXZlbnQsIGNvbnRleHQpID0+IHtcblxuICAgIHRyeSB7XG5cbiAgICAgICAgbGV0IF9pZCA9IGV2ZW50LmRhdGEuX2lkO1xuXG4gICAgICAgIC8vIOagoemqjDHvvJrlpoLmnpzmmK/mg7PopoHlj5HluIPlvZPliY3ooYznqIvvvIzliJnmo4Dmn6XmmK/lkKbmnInigJzlt7Llj5HluIPooYznqIvnmoTnu5PmnZ/ml7bpl7TlpKfkuo7nrYnkuo7lvZPliY3mlrDlu7rooYznqIvnmoTlvIDlp4vml7bpl7TopoHigJ1cbiAgICAgICAgaWYgKCBldmVudC5kYXRhLnB1Ymxpc2hlZCAmJiAhX2lkICkge1xuICAgICAgICAgICAgY29uc3QgcnVsZTEkID0gYXdhaXQgZGIuY29sbGVjdGlvbigndHJpcCcpLndoZXJlKHtcbiAgICAgICAgICAgICAgICBlbmRfZGF0ZTogXy5ndGUoIGV2ZW50LmRhdGEuc3RhcnRfZGF0ZSApXG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLmNvdW50KCApO1xuICAgIFxuICAgICAgICAgICAgaWYgKCBydWxlMSQudG90YWwgPiAwICkge1xuICAgICAgICAgICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSggcmVzb2x2ZSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHJlc29sdmUoe1xuICAgICAgICAgICAgICAgICAgICAgICAgZGF0YTogbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0YXR1czogNTAwLFxuICAgICAgICAgICAgICAgICAgICAgICAgbWVzc2FnZTogJ+W8gOWni+aXtumXtOW/hemhu+Wkp+S6juS4iui2n+ihjOeoi+eahOe7k+adn+aXtumXtCdcbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBcblxuICAgICAgICAvLyDliJvlu7ogXG4gICAgICAgIGlmICggIV9pZCApIHtcblxuICAgICAgICAgICAgY29uc3QgY3JlYXRlJCA9IGF3YWl0IGRiLmNvbGxlY3Rpb24oJ3RyaXAnKS5hZGQoe1xuICAgICAgICAgICAgICAgIGRhdGE6IGV2ZW50LmRhdGFcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgX2lkID0gY3JlYXRlJC5faWQ7XG5cbiAgICAgICAgLy8g57yW6L6RXG4gICAgICAgIH0gZWxzZSB7XG5cbiAgICAgICAgICAgIGNvbnN0IG9yaWdpbiQgPSBhd2FpdCBkYi5jb2xsZWN0aW9uKCd0cmlwJylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLndoZXJlKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIF9pZFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAuZ2V0KCApO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICBjb25zdCBvcmlnaW4gPSBvcmlnaW4kLmRhdGFbIDAgXTtcblxuICAgICAgICAgICAgZGVsZXRlIG9yaWdpblsnX2lkJ107XG4gICAgICAgICAgICBkZWxldGUgZXZlbnQuZGF0YVsnX2lkJ11cblxuICAgICAgICAgICAgY29uc3QgdGVtcCA9IE9iamVjdC5hc3NpZ24oeyB9LCBvcmlnaW4sIHtcbiAgICAgICAgICAgICAgICAuLi5ldmVudC5kYXRhXG4gICAgICAgICAgICB9KVxuXG4gICAgICAgICAgICBhd2FpdCBkYi5jb2xsZWN0aW9uKCd0cmlwJylcbiAgICAgICAgICAgICAgICAgICAgLmRvYyggX2lkIClcbiAgICAgICAgICAgICAgICAgICAgLnNldCh7XG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRhOiB0ZW1wXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoIHJlc29sdmUgPT4ge1xuICAgICAgICAgICAgcmVzb2x2ZSh7XG4gICAgICAgICAgICAgICAgZGF0YTogX2lkLFxuICAgICAgICAgICAgICAgIHN0YXR1czogMjAwXG4gICAgICAgICAgICB9KVxuICAgICAgICB9KTtcblxuICAgIH0gY2F0Y2ggKCBlICkge1xuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKCByZXNvbHZlLCByZWplY3QgKSA9PiB7XG4gICAgICAgICAgICByZXNvbHZlKHtcbiAgICAgICAgICAgICAgICBzdGF0dXM6IDUwMCxcbiAgICAgICAgICAgICAgICBtZXNzYWdlOiBlXG4gICAgICAgICAgICB9KVxuICAgICAgICB9KVxuICAgIH1cblxufSJdfQ==