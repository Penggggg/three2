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
var create$ = function (openid, data, db, ctx) { return __awaiter(_this, void 0, void 0, function () {
    var deal$, create$_1, e_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 4, , 5]);
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
                return [2, {
                        status: 200,
                        data: create$_1
                    }];
            case 4:
                e_1 = _a.sent();
                console.log("----\u3010Error-Order-Create\u3011----\uFF1A" + JSON.stringify(e_1));
                return [2, ctx.body = { status: 500, message: e_1 }];
            case 5: return [2];
        }
    });
}); };
exports.create$ = create$;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSxpQkF5Q2tCOztBQXpDbEIscUNBQXVDO0FBTXZDLElBQU0sT0FBTyxHQUFHLFVBQU8sTUFBTSxFQUFFLElBQUksRUFBRSxFQUFlLEVBQUUsR0FBRzs7Ozs7O3FCQUk1QyxJQUFJLENBQUMsVUFBVSxFQUFmLGNBQWU7Z0JBQ0YsV0FBTSxLQUFLLENBQUMsWUFBWSxDQUFDO3dCQUNuQyxJQUFJLEVBQUUsTUFBTTt3QkFDWixJQUFJLEVBQUU7NEJBQ0YsSUFBSSxFQUFFLGNBQWM7NEJBQ3BCLElBQUksRUFBRSxJQUFJO3lCQUNiO3FCQUNKLENBQUMsRUFBQTs7Z0JBTkksS0FBSyxHQUFHLFNBTVo7Z0JBRUYsSUFBSyxLQUFLLENBQUMsTUFBTSxDQUFDLE1BQU0sS0FBSyxHQUFHLEVBQUc7b0JBQy9CLE1BQU0sZUFBZSxDQUFBO2lCQUN4Qjs7b0JBR1csV0FBTSxFQUFFLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQztxQkFDdkMsR0FBRyxDQUFDO29CQUNELElBQUksRUFBRSxNQUFNLENBQUMsTUFBTSxDQUFDLEVBQUcsRUFBRSxJQUFJLEVBQUU7d0JBQzNCLE1BQU0sUUFBQTtxQkFDVCxDQUFDO2lCQUNMLENBQUMsRUFBQTs7Z0JBTEEsWUFBVSxTQUtWO2dCQUVOLFdBQU87d0JBQ0gsTUFBTSxFQUFFLEdBQUc7d0JBQ1gsSUFBSSxFQUFFLFNBQU87cUJBQ2hCLEVBQUE7OztnQkFFRCxPQUFPLENBQUMsR0FBRyxDQUFDLGlEQUFnQyxJQUFJLENBQUMsU0FBUyxDQUFFLEdBQUMsQ0FBSSxDQUFDLENBQUM7Z0JBQ25FLFdBQU8sR0FBRyxDQUFDLElBQUksR0FBRyxFQUFFLE1BQU0sRUFBRSxHQUFHLEVBQUUsT0FBTyxFQUFFLEdBQUMsRUFBRSxFQUFDOzs7O0tBRXJELENBQUE7QUFFUSwwQkFBTyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIGNsb3VkIGZyb20gJ3d4LXNlcnZlci1zZGsnO1xuLyoqXG4gKiBzaWRcbiAqIHBpZFxuICogY291bnRcbiAqL1xuY29uc3QgY3JlYXRlJCA9IGFzeW5jKCBvcGVuaWQsIGRhdGEsIGRiOiBEQi5EYXRhYmFzZSwgY3R4ICkgPT4ge1xuICAgIHRyeSB7XG5cbiAgICAgICAgLy8g5Yib5bu65LmL5YmN77yM5aSE55CG5Y2g6aKG6LSn5a2Y55qE6Zeu6aKYXG4gICAgICAgIGlmICggZGF0YS5pc09jY3VwaWVkICkge1xuICAgICAgICAgICAgY29uc3QgZGVhbCQgPSBhd2FpdCBjbG91ZC5jYWxsRnVuY3Rpb24oe1xuICAgICAgICAgICAgICAgIG5hbWU6ICdnb29kJyxcbiAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICAgICR1cmw6ICd1cGRhdGUtc3RvY2snLFxuICAgICAgICAgICAgICAgICAgICBkYXRhOiBkYXRhXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgXG4gICAgICAgICAgICBpZiAoIGRlYWwkLnJlc3VsdC5zdGF0dXMgIT09IDIwMCApIHtcbiAgICAgICAgICAgICAgICB0aHJvdyAn5Yib5bu66K6i5Y2V6ZSZ6K+v77ya5pW055CG5bqT5a2Y5aSx6LSlJ1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgY3JlYXRlJCA9IGF3YWl0IGRiLmNvbGxlY3Rpb24oJ29yZGVyJylcbiAgICAgICAgICAgIC5hZGQoe1xuICAgICAgICAgICAgICAgIGRhdGE6IE9iamVjdC5hc3NpZ24oeyB9LCBkYXRhLCB7XG4gICAgICAgICAgICAgICAgICAgIG9wZW5pZFxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgc3RhdHVzOiAyMDAsXG4gICAgICAgICAgICBkYXRhOiBjcmVhdGUkXG4gICAgICAgIH1cbiAgICB9IGNhdGNoICggZSApIHtcbiAgICAgICAgY29uc29sZS5sb2coYC0tLS3jgJBFcnJvci1PcmRlci1DcmVhdGXjgJEtLS0t77yaJHtKU09OLnN0cmluZ2lmeSggZSApfWApO1xuICAgICAgICByZXR1cm4gY3R4LmJvZHkgPSB7IHN0YXR1czogNTAwLCBtZXNzYWdlOiBlIH07XG4gICAgfVxufVxuXG5leHBvcnQgeyBjcmVhdGUkIH0iXX0=