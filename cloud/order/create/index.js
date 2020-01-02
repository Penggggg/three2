"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
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
Object.defineProperty(exports, "__esModule", { value: true });
var cloud = require("wx-server-sdk");
var create$ = function (openid, data, db, ctx) { return __awaiter(void 0, void 0, void 0, function () {
    var deal$, create$_1, e_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 6, , 7]);
                if (!data.isOccupied) return [3, 2];
                return [4, cloud.callFunction({
                        name: 'good',
                        data: {
                            $url: 'update-stock',
                            data: data
                        }
                    })];
            case 1:
                deal$ = _a.sent();
                if (deal$.result.status !== 200) {
                    throw '创建订单错误：整理库存失败';
                }
                _a.label = 2;
            case 2: return [4, db.collection('order')
                    .add({
                    data: Object.assign({}, data, {
                        openid: openid
                    })
                })];
            case 3:
                create$_1 = _a.sent();
                if (!!!data.cid) return [3, 5];
                return [4, db.collection('cart')
                        .doc(data.cid)
                        .remove()];
            case 4:
                _a.sent();
                _a.label = 5;
            case 5: return [2, {
                    status: 200,
                    data: create$_1
                }];
            case 6:
                e_1 = _a.sent();
                console.log("----\u3010Error-Order-Create\u3011----\uFF1A" + JSON.stringify(e_1));
                return [2, ctx.body = { status: 500, message: e_1 }];
            case 7: return [2];
        }
    });
}); };
exports.create$ = create$;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLHFDQUF1QztBQU92QyxJQUFNLE9BQU8sR0FBRyxVQUFPLE1BQU0sRUFBRSxJQUFJLEVBQUUsRUFBZSxFQUFFLEdBQUc7Ozs7OztxQkFJNUMsSUFBSSxDQUFDLFVBQVUsRUFBZixjQUFlO2dCQUNGLFdBQU0sS0FBSyxDQUFDLFlBQVksQ0FBQzt3QkFDbkMsSUFBSSxFQUFFLE1BQU07d0JBQ1osSUFBSSxFQUFFOzRCQUNGLElBQUksRUFBRSxjQUFjOzRCQUNwQixJQUFJLEVBQUUsSUFBSTt5QkFDYjtxQkFDSixDQUFDLEVBQUE7O2dCQU5JLEtBQUssR0FBRyxTQU1aO2dCQUVGLElBQUssS0FBSyxDQUFDLE1BQU0sQ0FBQyxNQUFNLEtBQUssR0FBRyxFQUFHO29CQUMvQixNQUFNLGVBQWUsQ0FBQTtpQkFDeEI7O29CQUdXLFdBQU0sRUFBRSxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUM7cUJBQ3ZDLEdBQUcsQ0FBQztvQkFDRCxJQUFJLEVBQUUsTUFBTSxDQUFDLE1BQU0sQ0FBQyxFQUFHLEVBQUUsSUFBSSxFQUFFO3dCQUMzQixNQUFNLFFBQUE7cUJBQ1QsQ0FBQztpQkFDTCxDQUFDLEVBQUE7O2dCQUxBLFlBQVUsU0FLVjtxQkFHRCxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBVixjQUFVO2dCQUNYLFdBQU0sRUFBRSxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUM7eUJBQ3RCLEdBQUcsQ0FBRSxJQUFJLENBQUMsR0FBRyxDQUFFO3lCQUNmLE1BQU0sRUFBRyxFQUFBOztnQkFGZCxTQUVjLENBQUM7O29CQUduQixXQUFPO29CQUNILE1BQU0sRUFBRSxHQUFHO29CQUNYLElBQUksRUFBRSxTQUFPO2lCQUNoQixFQUFBOzs7Z0JBRUQsT0FBTyxDQUFDLEdBQUcsQ0FBQyxpREFBZ0MsSUFBSSxDQUFDLFNBQVMsQ0FBRSxHQUFDLENBQUksQ0FBQyxDQUFDO2dCQUNuRSxXQUFPLEdBQUcsQ0FBQyxJQUFJLEdBQUcsRUFBRSxNQUFNLEVBQUUsR0FBRyxFQUFFLE9BQU8sRUFBRSxHQUFDLEVBQUUsRUFBQzs7OztLQUVyRCxDQUFBO0FBRVEsMEJBQU8iLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBjbG91ZCBmcm9tICd3eC1zZXJ2ZXItc2RrJztcbi8qKlxuICogc2lkXG4gKiBwaWRcbiAqIGNpZFxuICogY291bnRcbiAqL1xuY29uc3QgY3JlYXRlJCA9IGFzeW5jKCBvcGVuaWQsIGRhdGEsIGRiOiBEQi5EYXRhYmFzZSwgY3R4ICkgPT4ge1xuICAgIHRyeSB7XG5cbiAgICAgICAgLy8g5Yib5bu65LmL5YmN77yM5aSE55CG5Y2g6aKG6LSn5a2Y55qE6Zeu6aKYXG4gICAgICAgIGlmICggZGF0YS5pc09jY3VwaWVkICkge1xuICAgICAgICAgICAgY29uc3QgZGVhbCQgPSBhd2FpdCBjbG91ZC5jYWxsRnVuY3Rpb24oe1xuICAgICAgICAgICAgICAgIG5hbWU6ICdnb29kJyxcbiAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICAgICR1cmw6ICd1cGRhdGUtc3RvY2snLFxuICAgICAgICAgICAgICAgICAgICBkYXRhOiBkYXRhXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgXG4gICAgICAgICAgICBpZiAoIGRlYWwkLnJlc3VsdC5zdGF0dXMgIT09IDIwMCApIHtcbiAgICAgICAgICAgICAgICB0aHJvdyAn5Yib5bu66K6i5Y2V6ZSZ6K+v77ya5pW055CG5bqT5a2Y5aSx6LSlJ1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgY3JlYXRlJCA9IGF3YWl0IGRiLmNvbGxlY3Rpb24oJ29yZGVyJylcbiAgICAgICAgICAgIC5hZGQoe1xuICAgICAgICAgICAgICAgIGRhdGE6IE9iamVjdC5hc3NpZ24oeyB9LCBkYXRhLCB7XG4gICAgICAgICAgICAgICAgICAgIG9wZW5pZFxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAvLyDliKDpmaTlr7nlupTnmoTotK3nianovaZcbiAgICAgICAgaWYgKCAhIWRhdGEuY2lkICkge1xuICAgICAgICAgICAgYXdhaXQgZGIuY29sbGVjdGlvbignY2FydCcpXG4gICAgICAgICAgICAgICAgLmRvYyggZGF0YS5jaWQgKVxuICAgICAgICAgICAgICAgIC5yZW1vdmUoICk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgc3RhdHVzOiAyMDAsXG4gICAgICAgICAgICBkYXRhOiBjcmVhdGUkXG4gICAgICAgIH1cbiAgICB9IGNhdGNoICggZSApIHtcbiAgICAgICAgY29uc29sZS5sb2coYC0tLS3jgJBFcnJvci1PcmRlci1DcmVhdGXjgJEtLS0t77yaJHtKU09OLnN0cmluZ2lmeSggZSApfWApO1xuICAgICAgICByZXR1cm4gY3R4LmJvZHkgPSB7IHN0YXR1czogNTAwLCBtZXNzYWdlOiBlIH07XG4gICAgfVxufVxuXG5leHBvcnQgeyBjcmVhdGUkIH0iXX0=