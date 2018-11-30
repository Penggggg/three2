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
    var _id_1, create$, _a, title, destination, start_date, end_date, postage, postagefree_atleast, payment, origin$, origin, temp, e_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 6, , 7]);
                _id_1 = event.data._id;
                if (!!_id_1) return [3, 2];
                return [4, db.collection('trip').add({
                        data: event.data
                    })];
            case 1:
                create$ = _b.sent();
                _id_1 = create$._id;
                return [3, 5];
            case 2:
                _a = event.data, title = _a.title, destination = _a.destination, start_date = _a.start_date, end_date = _a.end_date, postage = _a.postage, postagefree_atleast = _a.postagefree_atleast, payment = _a.payment;
                return [4, db.collection('trip')
                        .where({
                        _id: _id_1
                    })
                        .get()];
            case 3:
                origin$ = _b.sent();
                origin = origin$.data[0];
                temp = Object.assign({}, origin, {
                    title: title,
                    destination: destination,
                    start_date: start_date,
                    end_date: end_date,
                    postage: postage,
                    payment: payment,
                    postagefree_atleast: postagefree_atleast
                });
                return [4, db.collection('trip')
                        .doc(_id_1)
                        .set({
                        data: temp
                    })];
            case 4:
                _b.sent();
                _b.label = 5;
            case 5: return [2, new Promise(function (resolve) {
                    resolve({
                        data: _id_1,
                        status: 200
                    });
                })];
            case 6:
                e_1 = _b.sent();
                return [2, new Promise(function (resolve, reject) {
                        reject({
                            status: 500,
                            message: e_1
                        });
                    })];
            case 7: return [2];
        }
    });
}); };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFDQSxpQkE4RkM7O0FBOUZELHFDQUF1QztBQUV2QyxLQUFLLENBQUMsSUFBSSxFQUFFLENBQUM7QUFFYixJQUFNLEVBQUUsR0FBZ0IsS0FBSyxDQUFDLFFBQVEsRUFBRSxDQUFDO0FBOEI1QixRQUFBLElBQUksR0FBRyxVQUFRLEtBQUssRUFBRSxPQUFPOzs7Ozs7Z0JBSTlCLFFBQU0sS0FBSyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUM7cUJBR3BCLENBQUMsS0FBRyxFQUFKLGNBQUk7Z0JBRVcsV0FBTSxFQUFFLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQyxDQUFDLEdBQUcsQ0FBQzt3QkFDNUMsSUFBSSxFQUFFLEtBQUssQ0FBQyxJQUFJO3FCQUNuQixDQUFDLEVBQUE7O2dCQUZJLE9BQU8sR0FBRyxTQUVkO2dCQUNGLEtBQUcsR0FBRyxPQUFPLENBQUMsR0FBRyxDQUFDOzs7Z0JBS1osS0FDd0MsS0FBSyxDQUFDLElBQUksRUFEaEQsS0FBSyxXQUFBLEVBQUUsV0FBVyxpQkFBQSxFQUFFLFVBQVUsZ0JBQUEsRUFBRSxRQUFRLGNBQUEsRUFDNUMsT0FBTyxhQUFBLEVBQUUsbUJBQW1CLHlCQUFBLEVBQUUsT0FBTyxhQUFBLENBQWdCO2dCQUN6QyxXQUFNLEVBQUUsQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDO3lCQUN0QixLQUFLLENBQUM7d0JBQ0gsR0FBRyxPQUFBO3FCQUNOLENBQUM7eUJBQ0QsR0FBRyxFQUFHLEVBQUE7O2dCQUpyQixPQUFPLEdBQUcsU0FJVztnQkFFckIsTUFBTSxHQUFHLE9BQU8sQ0FBQyxJQUFJLENBQUUsQ0FBQyxDQUFFLENBQUM7Z0JBQzNCLElBQUksR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDLEVBQUcsRUFBRSxNQUFNLEVBQUU7b0JBQ3BDLEtBQUssT0FBQTtvQkFDTCxXQUFXLGFBQUE7b0JBQ1gsVUFBVSxZQUFBO29CQUNWLFFBQVEsVUFBQTtvQkFDUixPQUFPLFNBQUE7b0JBQ1AsT0FBTyxTQUFBO29CQUNQLG1CQUFtQixxQkFBQTtpQkFDdEIsQ0FBQyxDQUFDO2dCQUVILFdBQU0sRUFBRSxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUM7eUJBQ2xCLEdBQUcsQ0FBRSxLQUFHLENBQUU7eUJBQ1YsR0FBRyxDQUFDO3dCQUNELElBQUksRUFBRSxJQUFJO3FCQUNiLENBQUMsRUFBQTs7Z0JBSlYsU0FJVSxDQUFDOztvQkFJZixXQUFPLElBQUksT0FBTyxDQUFFLFVBQUEsT0FBTztvQkFDdkIsT0FBTyxDQUFDO3dCQUNKLElBQUksRUFBRSxLQUFHO3dCQUNULE1BQU0sRUFBRSxHQUFHO3FCQUNkLENBQUMsQ0FBQTtnQkFDTixDQUFDLENBQUMsRUFBQTs7O2dCQUdGLFdBQU8sSUFBSSxPQUFPLENBQUMsVUFBRSxPQUFPLEVBQUUsTUFBTTt3QkFDaEMsTUFBTSxDQUFDOzRCQUNILE1BQU0sRUFBRSxHQUFHOzRCQUNYLE9BQU8sRUFBRSxHQUFDO3lCQUNiLENBQUMsQ0FBQTtvQkFDTixDQUFDLENBQUMsRUFBQTs7OztLQUdULENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyIvLyDkupHlh73mlbDlhaXlj6Pmlofku7ZcbmltcG9ydCAqIGFzIGNsb3VkIGZyb20gJ3d4LXNlcnZlci1zZGsnO1xuXG5jbG91ZC5pbml0KCk7XG5cbmNvbnN0IGRiOiBEQi5EYXRhYmFzZSA9IGNsb3VkLmRhdGFiYXNlKCk7XG5cbi8qKlxuICogQGRlc2NyaXB0aW9uIOWIm+W7ui/nvJbovpHllYblk4FcbiAqIC0tLS0tLS0tIOivt+axgiAtLS0tLS0tLS0tXG4gKiB7XG4gICAgICAgIHRpdGxlIOagh+mimCBzdHJpbmdcbiAgICAgICAgZGVzdGluYXRpb24g55uu55qE5ZywIHN0cmluZ1xuICAgICAgICBzdGFydF9kYXRlIOW8gOWni+aXtumXtCBudW1iZXJcbiAgICAgICAgZW5kX2RhdGUg57uT5p2f5pe26Ze0IG51bWJlclxuICAgICAgICByZWR1Y2VfcHJpY2Ug6KGM56iL56uL5YePIG51bWJlclxuICAgICAgICBzYWxlc192b2x1bWUg6ZSA5ZSu5oC76aKdXG4gICAgICAgIGZ1bGxyZWR1Y2VfYXRsZWFzdCDooYznqIvmu6Hlh48gLSDpl6jmp5sgbnVtYmVyXG4gICAgICAgIGZ1bGxyZWR1Y2VfdmFsdWVzIOihjOeoi+a7oeWHjyAtIOWHj+WkmuWwkSBudW1iZXJcbiAgICAgICAgY2FzaGNvdXBvbl9hdGxlYXN0IOihjOeoi+S7o+mHkeWIuCAtIOmXqOanmyBudW1iZXJcbiAgICAgICAgY2FzaGNvdXBvbl92YWx1ZXMg6KGM56iL5Luj6YeR5Yi4IC0g6YeR6aKdIG51bWJlclxuICAgICAgICBwb3N0YWdlIOmCrui0ueexu+WeiyBkaWMgXG4gICAgICAgIHBvc3RhZ2VmcmVlX2F0bGVhc3QgIOWFjemCrumXqOanmyBudW1iZXJcbiAgICAgICAgcGF5bWVudCDku5jmrL7nsbvlnosgZGljIFxuICAgICAgICBwdWJsaXNoZWQg5piv5ZCm5Y+R5biDIGJvb2xlYW5cbiAgICAgICAgaXNQYXNzZWQg5piv5ZCm6L+H5pyfXG4gICAgICAgIGNyZWF0ZVRpbWUg5Yib5bu65pe26Ze0XG4gICAgICAgIHVwZGF0ZVRpbWUg5pu05paw5pe26Ze0XG4gKiB9XG4gKiAtLS0tLS0tLSDor7fmsYIgLS0tLS0tLS0tLVxuICoge1xuICogICAgICBfaWQ6IHN0cmluZ1xuICogICAgICBzdGF0dXM6IDIwMCAvIDUwMFxuICogfVxuICovXG5leHBvcnQgY29uc3QgbWFpbiA9IGFzeW5jICggZXZlbnQsIGNvbnRleHQpID0+IHtcblxuICAgIHRyeSB7XG5cbiAgICAgICAgbGV0IF9pZCA9IGV2ZW50LmRhdGEuX2lkO1xuXG4gICAgICAgIC8vIOWIm+W7uiBcbiAgICAgICAgaWYgKCAhX2lkICkge1xuXG4gICAgICAgICAgICBjb25zdCBjcmVhdGUkID0gYXdhaXQgZGIuY29sbGVjdGlvbigndHJpcCcpLmFkZCh7XG4gICAgICAgICAgICAgICAgZGF0YTogZXZlbnQuZGF0YVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBfaWQgPSBjcmVhdGUkLl9pZDtcblxuICAgICAgICAvLyDnvJbovpFcbiAgICAgICAgfSBlbHNlIHtcblxuICAgICAgICAgICAgY29uc3QgeyB0aXRsZSwgZGVzdGluYXRpb24sIHN0YXJ0X2RhdGUsIGVuZF9kYXRlLCBcbiAgICAgICAgICAgICAgICBwb3N0YWdlLCBwb3N0YWdlZnJlZV9hdGxlYXN0LCBwYXltZW50IH0gPSBldmVudC5kYXRhO1xuICAgICAgICAgICAgY29uc3Qgb3JpZ2luJCA9IGF3YWl0IGRiLmNvbGxlY3Rpb24oJ3RyaXAnKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAud2hlcmUoe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgX2lkXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5nZXQoICk7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGNvbnN0IG9yaWdpbiA9IG9yaWdpbiQuZGF0YVsgMCBdO1xuICAgICAgICAgICAgY29uc3QgdGVtcCA9IE9iamVjdC5hc3NpZ24oeyB9LCBvcmlnaW4sIHtcbiAgICAgICAgICAgICAgICB0aXRsZSxcbiAgICAgICAgICAgICAgICBkZXN0aW5hdGlvbixcbiAgICAgICAgICAgICAgICBzdGFydF9kYXRlLFxuICAgICAgICAgICAgICAgIGVuZF9kYXRlLFxuICAgICAgICAgICAgICAgIHBvc3RhZ2UsXG4gICAgICAgICAgICAgICAgcGF5bWVudCxcbiAgICAgICAgICAgICAgICBwb3N0YWdlZnJlZV9hdGxlYXN0XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgYXdhaXQgZGIuY29sbGVjdGlvbigndHJpcCcpXG4gICAgICAgICAgICAgICAgICAgIC5kb2MoIF9pZCApXG4gICAgICAgICAgICAgICAgICAgIC5zZXQoe1xuICAgICAgICAgICAgICAgICAgICAgICAgZGF0YTogdGVtcFxuICAgICAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKCByZXNvbHZlID0+IHtcbiAgICAgICAgICAgIHJlc29sdmUoe1xuICAgICAgICAgICAgICAgIGRhdGE6IF9pZCxcbiAgICAgICAgICAgICAgICBzdGF0dXM6IDIwMFxuICAgICAgICAgICAgfSlcbiAgICAgICAgfSlcblxuICAgIH0gY2F0Y2ggKCBlICkge1xuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKCByZXNvbHZlLCByZWplY3QgKSA9PiB7XG4gICAgICAgICAgICByZWplY3Qoe1xuICAgICAgICAgICAgICAgIHN0YXR1czogNTAwLFxuICAgICAgICAgICAgICAgIG1lc3NhZ2U6IGVcbiAgICAgICAgICAgIH0pXG4gICAgICAgIH0pXG4gICAgfVxuXG59Il19