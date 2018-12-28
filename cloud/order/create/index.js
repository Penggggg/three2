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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSxpQkFpRGtCOztBQWpEbEIscUNBQXVDO0FBT3ZDLElBQU0sT0FBTyxHQUFHLFVBQU8sTUFBTSxFQUFFLElBQUksRUFBRSxFQUFlLEVBQUUsR0FBRzs7Ozs7O3FCQUk1QyxJQUFJLENBQUMsVUFBVSxFQUFmLGNBQWU7Z0JBQ0YsV0FBTSxLQUFLLENBQUMsWUFBWSxDQUFDO3dCQUNuQyxJQUFJLEVBQUUsTUFBTTt3QkFDWixJQUFJLEVBQUU7NEJBQ0YsSUFBSSxFQUFFLGNBQWM7NEJBQ3BCLElBQUksRUFBRSxJQUFJO3lCQUNiO3FCQUNKLENBQUMsRUFBQTs7Z0JBTkksS0FBSyxHQUFHLFNBTVo7Z0JBRUYsSUFBSyxLQUFLLENBQUMsTUFBTSxDQUFDLE1BQU0sS0FBSyxHQUFHLEVBQUc7b0JBQy9CLE1BQU0sZUFBZSxDQUFBO2lCQUN4Qjs7b0JBR1csV0FBTSxFQUFFLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQztxQkFDdkMsR0FBRyxDQUFDO29CQUNELElBQUksRUFBRSxNQUFNLENBQUMsTUFBTSxDQUFDLEVBQUcsRUFBRSxJQUFJLEVBQUU7d0JBQzNCLE1BQU0sUUFBQTtxQkFDVCxDQUFDO2lCQUNMLENBQUMsRUFBQTs7Z0JBTEEsWUFBVSxTQUtWO3FCQUdELENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFWLGNBQVU7Z0JBQ1gsV0FBTSxFQUFFLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQzt5QkFDdEIsR0FBRyxDQUFFLElBQUksQ0FBQyxHQUFHLENBQUU7eUJBQ2YsTUFBTSxFQUFHLEVBQUE7O2dCQUZkLFNBRWMsQ0FBQzs7b0JBR25CLFdBQU87b0JBQ0gsTUFBTSxFQUFFLEdBQUc7b0JBQ1gsSUFBSSxFQUFFLFNBQU87aUJBQ2hCLEVBQUE7OztnQkFFRCxPQUFPLENBQUMsR0FBRyxDQUFDLGlEQUFnQyxJQUFJLENBQUMsU0FBUyxDQUFFLEdBQUMsQ0FBSSxDQUFDLENBQUM7Z0JBQ25FLFdBQU8sR0FBRyxDQUFDLElBQUksR0FBRyxFQUFFLE1BQU0sRUFBRSxHQUFHLEVBQUUsT0FBTyxFQUFFLEdBQUMsRUFBRSxFQUFDOzs7O0tBRXJELENBQUE7QUFFUSwwQkFBTyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIGNsb3VkIGZyb20gJ3d4LXNlcnZlci1zZGsnO1xuLyoqXG4gKiBzaWRcbiAqIHBpZFxuICogY2lkXG4gKiBjb3VudFxuICovXG5jb25zdCBjcmVhdGUkID0gYXN5bmMoIG9wZW5pZCwgZGF0YSwgZGI6IERCLkRhdGFiYXNlLCBjdHggKSA9PiB7XG4gICAgdHJ5IHtcblxuICAgICAgICAvLyDliJvlu7rkuYvliY3vvIzlpITnkIbljaDpoobotKflrZjnmoTpl67pophcbiAgICAgICAgaWYgKCBkYXRhLmlzT2NjdXBpZWQgKSB7XG4gICAgICAgICAgICBjb25zdCBkZWFsJCA9IGF3YWl0IGNsb3VkLmNhbGxGdW5jdGlvbih7XG4gICAgICAgICAgICAgICAgbmFtZTogJ2dvb2QnLFxuICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgJHVybDogJ3VwZGF0ZS1zdG9jaycsXG4gICAgICAgICAgICAgICAgICAgIGRhdGE6IGRhdGFcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICBcbiAgICAgICAgICAgIGlmICggZGVhbCQucmVzdWx0LnN0YXR1cyAhPT0gMjAwICkge1xuICAgICAgICAgICAgICAgIHRocm93ICfliJvlu7rorqLljZXplJnor6/vvJrmlbTnkIblupPlrZjlpLHotKUnXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBjcmVhdGUkID0gYXdhaXQgZGIuY29sbGVjdGlvbignb3JkZXInKVxuICAgICAgICAgICAgLmFkZCh7XG4gICAgICAgICAgICAgICAgZGF0YTogT2JqZWN0LmFzc2lnbih7IH0sIGRhdGEsIHtcbiAgICAgICAgICAgICAgICAgICAgb3BlbmlkXG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgIC8vIOWIoOmZpOWvueW6lOeahOi0reeJqei9plxuICAgICAgICBpZiAoICEhZGF0YS5jaWQgKSB7XG4gICAgICAgICAgICBhd2FpdCBkYi5jb2xsZWN0aW9uKCdjYXJ0JylcbiAgICAgICAgICAgICAgICAuZG9jKCBkYXRhLmNpZCApXG4gICAgICAgICAgICAgICAgLnJlbW92ZSggKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBzdGF0dXM6IDIwMCxcbiAgICAgICAgICAgIGRhdGE6IGNyZWF0ZSRcbiAgICAgICAgfVxuICAgIH0gY2F0Y2ggKCBlICkge1xuICAgICAgICBjb25zb2xlLmxvZyhgLS0tLeOAkEVycm9yLU9yZGVyLUNyZWF0ZeOAkS0tLS3vvJoke0pTT04uc3RyaW5naWZ5KCBlICl9YCk7XG4gICAgICAgIHJldHVybiBjdHguYm9keSA9IHsgc3RhdHVzOiA1MDAsIG1lc3NhZ2U6IGUgfTtcbiAgICB9XG59XG5cbmV4cG9ydCB7IGNyZWF0ZSQgfSJdfQ==