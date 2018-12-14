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
                if (!event.data.published) return [3, 2];
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUNBLGlCQThHQzs7QUE5R0QscUNBQXVDO0FBRXZDLEtBQUssQ0FBQyxJQUFJLEVBQUUsQ0FBQztBQUViLElBQU0sRUFBRSxHQUFnQixLQUFLLENBQUMsUUFBUSxFQUFHLENBQUM7QUFDMUMsSUFBTSxDQUFDLEdBQUcsRUFBRSxDQUFDLE9BQU8sQ0FBQztBQStCUixRQUFBLElBQUksR0FBRyxVQUFRLEtBQUssRUFBRSxPQUFPOzs7Ozs7Z0JBSTlCLFFBQU0sS0FBSyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUM7cUJBR3BCLEtBQUssQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFwQixjQUFvQjtnQkFDTixXQUFNLEVBQUUsQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDLENBQUMsS0FBSyxDQUFDO3dCQUM3QyxRQUFRLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBRSxLQUFLLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBRTtxQkFDM0MsQ0FBQzt5QkFDRCxLQUFLLEVBQUcsRUFBQTs7Z0JBSEgsTUFBTSxHQUFHLFNBR047Z0JBRVQsSUFBSyxNQUFNLENBQUMsS0FBSyxHQUFHLENBQUMsRUFBRztvQkFDcEIsV0FBTyxJQUFJLE9BQU8sQ0FBRSxVQUFBLE9BQU87NEJBQ3ZCLE9BQU8sQ0FBQztnQ0FDSixJQUFJLEVBQUUsSUFBSTtnQ0FDVixNQUFNLEVBQUUsR0FBRztnQ0FDWCxPQUFPLEVBQUUsbUJBQW1COzZCQUMvQixDQUFDLENBQUE7d0JBQ04sQ0FBQyxDQUFDLEVBQUM7aUJBQ047OztxQkFJQSxDQUFDLEtBQUcsRUFBSixjQUFJO2dCQUVXLFdBQU0sRUFBRSxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUMsQ0FBQyxHQUFHLENBQUM7d0JBQzVDLElBQUksRUFBRSxLQUFLLENBQUMsSUFBSTtxQkFDbkIsQ0FBQyxFQUFBOztnQkFGSSxPQUFPLEdBQUcsU0FFZDtnQkFDRixLQUFHLEdBQUcsT0FBTyxDQUFDLEdBQUcsQ0FBQzs7b0JBS0YsV0FBTSxFQUFFLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQztxQkFDdEIsS0FBSyxDQUFDO29CQUNILEdBQUcsT0FBQTtpQkFDTixDQUFDO3FCQUNELEdBQUcsRUFBRyxFQUFBOztnQkFKckIsT0FBTyxHQUFHLFNBSVc7Z0JBRXJCLE1BQU0sR0FBRyxPQUFPLENBQUMsSUFBSSxDQUFFLENBQUMsQ0FBRSxDQUFDO2dCQUVqQyxPQUFPLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQztnQkFDckIsT0FBTyxLQUFLLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFBO2dCQUVsQixJQUFJLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQyxFQUFHLEVBQUUsTUFBTSxlQUMvQixLQUFLLENBQUMsSUFBSSxFQUNmLENBQUE7Z0JBRUYsV0FBTSxFQUFFLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQzt5QkFDbEIsR0FBRyxDQUFFLEtBQUcsQ0FBRTt5QkFDVixHQUFHLENBQUM7d0JBQ0QsSUFBSSxFQUFFLElBQUk7cUJBQ2IsQ0FBQyxFQUFBOztnQkFKVixTQUlVLENBQUM7O29CQUlmLFdBQU8sSUFBSSxPQUFPLENBQUUsVUFBQSxPQUFPO29CQUN2QixPQUFPLENBQUM7d0JBQ0osSUFBSSxFQUFFLEtBQUc7d0JBQ1QsTUFBTSxFQUFFLEdBQUc7cUJBQ2QsQ0FBQyxDQUFBO2dCQUNOLENBQUMsQ0FBQyxFQUFDOzs7Z0JBR0gsV0FBTyxJQUFJLE9BQU8sQ0FBQyxVQUFFLE9BQU8sRUFBRSxNQUFNO3dCQUNoQyxPQUFPLENBQUM7NEJBQ0osTUFBTSxFQUFFLEdBQUc7NEJBQ1gsT0FBTyxFQUFFLEdBQUM7eUJBQ2IsQ0FBQyxDQUFBO29CQUNOLENBQUMsQ0FBQyxFQUFBOzs7O0tBR1QsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbIi8vIOS6keWHveaVsOWFpeWPo+aWh+S7tlxuaW1wb3J0ICogYXMgY2xvdWQgZnJvbSAnd3gtc2VydmVyLXNkayc7XG5cbmNsb3VkLmluaXQoKTtcblxuY29uc3QgZGI6IERCLkRhdGFiYXNlID0gY2xvdWQuZGF0YWJhc2UoICk7XG5jb25zdCBfID0gZGIuY29tbWFuZDtcblxuLyoqXG4gKiBAZGVzY3JpcHRpb24g5Yib5bu6L+e8lui+keihjOeoi1xuICogISDmoKHpqozop4TliJkxOiDlj5HluIPooYznqIvml7bvvIzopoHliKTmlq3lvIDlp4vml6XmnJ/lpKfkuo7kuIrkuIDotp/ooYznqIvnmoTnu5PmnZ/ooYznqItcbiAqIC0tLS0tLS0tIOivt+axgiAtLS0tLS0tLS0tXG4gKiB7XG4gICAgICAgIHRpdGxlIOagh+mimCBzdHJpbmdcbiAgICAgICAgZGVzdGluYXRpb24g55uu55qE5ZywIHN0cmluZ1xuICAgICAgICBzdGFydF9kYXRlIOW8gOWni+aXtumXtCBudW1iZXJcbiAgICAgICAgZW5kX2RhdGUg57uT5p2f5pe26Ze0IG51bWJlclxuICAgICAgICByZWR1Y2VfcHJpY2Ug6KGM56iL56uL5YePIG51bWJlclxuICAgICAgICBzYWxlc192b2x1bWUg6ZSA5ZSu5oC76aKdXG4gICAgICAgIGZ1bGxyZWR1Y2VfYXRsZWFzdCDooYznqIvmu6Hlh48gLSDpl6jmp5sgbnVtYmVyXG4gICAgICAgIGZ1bGxyZWR1Y2VfdmFsdWVzIOihjOeoi+a7oeWHjyAtIOWHj+WkmuWwkSBudW1iZXJcbiAgICAgICAgY2FzaGNvdXBvbl9hdGxlYXN0IOihjOeoi+S7o+mHkeWIuCAtIOmXqOanmyBudW1iZXJcbiAgICAgICAgY2FzaGNvdXBvbl92YWx1ZXMg6KGM56iL5Luj6YeR5Yi4IC0g6YeR6aKdIG51bWJlclxuICAgICAgICBwb3N0YWdlIOmCrui0ueexu+WeiyBkaWMgXG4gICAgICAgIHBvc3RhZ2VmcmVlX2F0bGVhc3QgIOWFjemCrumXqOanmyBudW1iZXJcbiAgICAgICAgcGF5bWVudCDku5jmrL7nsbvlnosgZGljIFxuICAgICAgICBwdWJsaXNoZWQg5piv5ZCm5Y+R5biDIGJvb2xlYW5cbiAgICAgICAgaXNQYXNzZWQg5piv5ZCm6L+H5pyfXG4gICAgICAgIGNyZWF0ZVRpbWUg5Yib5bu65pe26Ze0XG4gICAgICAgIHVwZGF0ZVRpbWUg5pu05paw5pe26Ze0XG4gKiB9XG4gKiAtLS0tLS0tLSDor7fmsYIgLS0tLS0tLS0tLVxuICoge1xuICogICAgICBfaWQ6IHN0cmluZ1xuICogICAgICBzdGF0dXM6IDIwMCAvIDUwMFxuICogfVxuICovXG5leHBvcnQgY29uc3QgbWFpbiA9IGFzeW5jICggZXZlbnQsIGNvbnRleHQpID0+IHtcblxuICAgIHRyeSB7XG5cbiAgICAgICAgbGV0IF9pZCA9IGV2ZW50LmRhdGEuX2lkO1xuXG4gICAgICAgIC8vIOagoemqjDHvvJrlpoLmnpzmmK/mg7PopoHlj5HluIPlvZPliY3ooYznqIvvvIzliJnmo4Dmn6XmmK/lkKbmnInigJzlt7Llj5HluIPooYznqIvnmoTnu5PmnZ/ml7bpl7TlpKfkuo7nrYnkuo7lvZPliY3mlrDlu7rooYznqIvnmoTlvIDlp4vml7bpl7TopoHigJ1cbiAgICAgICAgaWYgKCBldmVudC5kYXRhLnB1Ymxpc2hlZCApIHtcbiAgICAgICAgICAgIGNvbnN0IHJ1bGUxJCA9IGF3YWl0IGRiLmNvbGxlY3Rpb24oJ3RyaXAnKS53aGVyZSh7XG4gICAgICAgICAgICAgICAgZW5kX2RhdGU6IF8uZ3RlKCBldmVudC5kYXRhLnN0YXJ0X2RhdGUgKVxuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC5jb3VudCggKTtcbiAgICBcbiAgICAgICAgICAgIGlmICggcnVsZTEkLnRvdGFsID4gMCApIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoIHJlc29sdmUgPT4ge1xuICAgICAgICAgICAgICAgICAgICByZXNvbHZlKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRhdGE6IG51bGwsXG4gICAgICAgICAgICAgICAgICAgICAgICBzdGF0dXM6IDUwMCxcbiAgICAgICAgICAgICAgICAgICAgICAgIG1lc3NhZ2U6ICflvIDlp4vml7bpl7Tlv4XpobvlpKfkuo7kuIrotp/ooYznqIvnmoTnu5PmnZ/ml7bpl7QnXG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gXG5cbiAgICAgICAgLy8g5Yib5bu6IFxuICAgICAgICBpZiAoICFfaWQgKSB7XG5cbiAgICAgICAgICAgIGNvbnN0IGNyZWF0ZSQgPSBhd2FpdCBkYi5jb2xsZWN0aW9uKCd0cmlwJykuYWRkKHtcbiAgICAgICAgICAgICAgICBkYXRhOiBldmVudC5kYXRhXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIF9pZCA9IGNyZWF0ZSQuX2lkO1xuXG4gICAgICAgIC8vIOe8lui+kVxuICAgICAgICB9IGVsc2Uge1xuXG4gICAgICAgICAgICBjb25zdCBvcmlnaW4kID0gYXdhaXQgZGIuY29sbGVjdGlvbigndHJpcCcpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC53aGVyZSh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBfaWRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLmdldCggKTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgY29uc3Qgb3JpZ2luID0gb3JpZ2luJC5kYXRhWyAwIF07XG5cbiAgICAgICAgICAgIGRlbGV0ZSBvcmlnaW5bJ19pZCddO1xuICAgICAgICAgICAgZGVsZXRlIGV2ZW50LmRhdGFbJ19pZCddXG5cbiAgICAgICAgICAgIGNvbnN0IHRlbXAgPSBPYmplY3QuYXNzaWduKHsgfSwgb3JpZ2luLCB7XG4gICAgICAgICAgICAgICAgLi4uZXZlbnQuZGF0YVxuICAgICAgICAgICAgfSlcblxuICAgICAgICAgICAgYXdhaXQgZGIuY29sbGVjdGlvbigndHJpcCcpXG4gICAgICAgICAgICAgICAgICAgIC5kb2MoIF9pZCApXG4gICAgICAgICAgICAgICAgICAgIC5zZXQoe1xuICAgICAgICAgICAgICAgICAgICAgICAgZGF0YTogdGVtcFxuICAgICAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKCByZXNvbHZlID0+IHtcbiAgICAgICAgICAgIHJlc29sdmUoe1xuICAgICAgICAgICAgICAgIGRhdGE6IF9pZCxcbiAgICAgICAgICAgICAgICBzdGF0dXM6IDIwMFxuICAgICAgICAgICAgfSlcbiAgICAgICAgfSk7XG5cbiAgICB9IGNhdGNoICggZSApIHtcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKCggcmVzb2x2ZSwgcmVqZWN0ICkgPT4ge1xuICAgICAgICAgICAgcmVzb2x2ZSh7XG4gICAgICAgICAgICAgICAgc3RhdHVzOiA1MDAsXG4gICAgICAgICAgICAgICAgbWVzc2FnZTogZVxuICAgICAgICAgICAgfSlcbiAgICAgICAgfSlcbiAgICB9XG5cbn0iXX0=