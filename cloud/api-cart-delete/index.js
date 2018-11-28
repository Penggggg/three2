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
    var idArr, e_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                idArr = event.ids.split(',');
                return [4, Promise.all(idArr.map(function (id) {
                        return db.collection('cart')
                            .where({
                            _id: id
                        })
                            .remove();
                    }))];
            case 1:
                _a.sent();
                return [2, new Promise(function (resolve) {
                        resolve({
                            status: 200
                        });
                    })];
            case 2:
                e_1 = _a.sent();
                return [2, new Promise(function (resolve) {
                        resolve({
                            status: 500,
                            data: JSON.stringify(e_1)
                        });
                    })];
            case 3: return [2];
        }
    });
}); };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFDQSxpQkE0Q0M7O0FBNUNELHFDQUF1QztBQUV2QyxLQUFLLENBQUMsSUFBSSxFQUFFLENBQUM7QUFFYixJQUFNLEVBQUUsR0FBZ0IsS0FBSyxDQUFDLFFBQVEsRUFBRSxDQUFDO0FBYTVCLFFBQUEsSUFBSSxHQUFHLFVBQU8sS0FBSyxFQUFFLE9BQU87Ozs7OztnQkFJM0IsS0FBSyxHQUFHLEtBQUssQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFBO2dCQUNsQyxXQUFNLE9BQU8sQ0FBQyxHQUFHLENBQUUsS0FBSyxDQUFDLEdBQUcsQ0FBRSxVQUFBLEVBQUU7d0JBQzVCLE9BQU8sRUFBRSxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUM7NkJBQ25CLEtBQUssQ0FBQzs0QkFDSCxHQUFHLEVBQUUsRUFBRTt5QkFDVixDQUFDOzZCQUNELE1BQU0sRUFBRyxDQUFDO29CQUN2QixDQUFDLENBQUMsQ0FBQyxFQUFBOztnQkFOSCxTQU1HLENBQUM7Z0JBRUosV0FBTyxJQUFJLE9BQU8sQ0FBRSxVQUFBLE9BQU87d0JBQ3ZCLE9BQU8sQ0FBQzs0QkFDSixNQUFNLEVBQUUsR0FBRzt5QkFDZCxDQUFDLENBQUM7b0JBQ1AsQ0FBQyxDQUFDLEVBQUM7OztnQkFFSCxXQUFPLElBQUksT0FBTyxDQUFFLFVBQUEsT0FBTzt3QkFDdkIsT0FBTyxDQUFDOzRCQUNKLE1BQU0sRUFBRSxHQUFHOzRCQUNYLElBQUksRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFFLEdBQUMsQ0FBRTt5QkFDNUIsQ0FBQyxDQUFDO29CQUNQLENBQUMsQ0FBQyxFQUFDOzs7O0tBR1YsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbIi8vIOS6keWHveaVsOWFpeWPo+aWh+S7tlxuaW1wb3J0ICogYXMgY2xvdWQgZnJvbSAnd3gtc2VydmVyLXNkayc7XG5cbmNsb3VkLmluaXQoKTtcblxuY29uc3QgZGI6IERCLkRhdGFiYXNlID0gY2xvdWQuZGF0YWJhc2UoKTtcblxuXG4vKipcbiAqIOi0reeJqei9puaJuemHj+WIoOmZpHNrdVxuICogcmVxOiB7XG4gKiAgICAgIGlkczogJ2lkMSxpZDIsaWQzJ1xuICogfVxuICogXG4gKiByZXM6IHtcbiAqICAgICAgZGF0YTog6LSt54mp6L2maWRcbiAqIH1cbiAqL1xuZXhwb3J0IGNvbnN0IG1haW4gPSBhc3luYyAoZXZlbnQsIGNvbnRleHQpID0+IHtcblxuICAgIHRyeSB7XG5cbiAgICAgICAgY29uc3QgaWRBcnIgPSBldmVudC5pZHMuc3BsaXQoJywnKVxuICAgICAgICBhd2FpdCBQcm9taXNlLmFsbCggaWRBcnIubWFwKCBpZCA9PiB7XG4gICAgICAgICAgICByZXR1cm4gZGIuY29sbGVjdGlvbignY2FydCcpXG4gICAgICAgICAgICAgICAgICAgIC53aGVyZSh7XG4gICAgICAgICAgICAgICAgICAgICAgICBfaWQ6IGlkXG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgIC5yZW1vdmUoICk7XG4gICAgICAgIH0pKTtcbiAgICAgICAgXG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSggcmVzb2x2ZSA9PiB7XG4gICAgICAgICAgICByZXNvbHZlKHtcbiAgICAgICAgICAgICAgICBzdGF0dXM6IDIwMFxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH0gY2F0Y2goIGUgKSB7XG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSggcmVzb2x2ZSA9PiB7XG4gICAgICAgICAgICByZXNvbHZlKHtcbiAgICAgICAgICAgICAgICBzdGF0dXM6IDUwMCxcbiAgICAgICAgICAgICAgICBkYXRhOiBKU09OLnN0cmluZ2lmeSggZSApXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG59Il19