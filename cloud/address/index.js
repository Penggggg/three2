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
var TcbRouter = require("tcb-router");
var create_1 = require("./create");
var find_1 = require("./find");
cloud.init({
    env: cloud.DYNAMIC_CURRENT_ENV
});
var db = cloud.database();
exports.main = function (event, context) { return __awaiter(_this, void 0, void 0, function () {
    var app;
    var _this = this;
    return __generator(this, function (_a) {
        app = new TcbRouter({ event: event });
        app.router('getAddressId', function (ctx, next) { return __awaiter(_this, void 0, void 0, function () {
            var openId, sameAddress$, saveData, cerateAddress$, e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        openId = event.data.openId || event.userInfo.openId;
                        return [4, find_1.find$(openId, {
                                address: event.data.address.address
                            }, db, ctx)];
                    case 1:
                        sameAddress$ = _a.sent();
                        if (sameAddress$.data && sameAddress$.data.length > 0) {
                            return [2, ctx.body = {
                                    status: 200,
                                    data: sameAddress$.data[0]._id
                                }];
                        }
                        saveData = __assign({}, event.data.address);
                        return [4, create_1.create$(openId, saveData, db, ctx)];
                    case 2:
                        cerateAddress$ = _a.sent();
                        return [2, ctx.body = {
                                status: 200,
                                data: cerateAddress$.data._id
                            }];
                    case 3:
                        e_1 = _a.sent();
                        return [2, ctx.body = {
                                status: 500,
                                message: e_1
                            }];
                    case 4: return [2];
                }
            });
        }); });
        return [2, app.serve()];
    });
}); };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUNBLGlCQStFQzs7QUEvRUQscUNBQXVDO0FBQ3ZDLHNDQUF3QztBQUN4QyxtQ0FBbUM7QUFDbkMsK0JBQStCO0FBRS9CLEtBQUssQ0FBQyxJQUFJLENBQUM7SUFDUCxHQUFHLEVBQUUsS0FBSyxDQUFDLG1CQUFtQjtDQUNqQyxDQUFDLENBQUM7QUFFSCxJQUFNLEVBQUUsR0FBZ0IsS0FBSyxDQUFDLFFBQVEsRUFBRyxDQUFDO0FBYzdCLFFBQUEsSUFBSSxHQUFHLFVBQVEsS0FBSyxFQUFFLE9BQU87Ozs7UUFFaEMsR0FBRyxHQUFHLElBQUksU0FBUyxDQUFDLEVBQUUsS0FBSyxPQUFBLEVBQUUsQ0FBQyxDQUFDO1FBZXJDLEdBQUcsQ0FBQyxNQUFNLENBQUMsY0FBYyxFQUFFLFVBQU8sR0FBRyxFQUFFLElBQUk7Ozs7Ozt3QkFJN0IsTUFBTSxHQUFHLEtBQUssQ0FBQyxJQUFJLENBQUMsTUFBTSxJQUFJLEtBQUssQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDO3dCQUNyQyxXQUFNLFlBQUssQ0FBRSxNQUFNLEVBQUU7Z0NBQ3RDLE9BQU8sRUFBRSxLQUFLLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxPQUFPOzZCQUN0QyxFQUFFLEVBQUUsRUFBRSxHQUFHLENBQUUsRUFBQTs7d0JBRk4sWUFBWSxHQUFHLFNBRVQ7d0JBR1osSUFBSyxZQUFZLENBQUMsSUFBSSxJQUFJLFlBQVksQ0FBQyxJQUFJLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRzs0QkFDckQsV0FBTyxHQUFHLENBQUMsSUFBSSxHQUFHO29DQUNkLE1BQU0sRUFBRSxHQUFHO29DQUNYLElBQUksRUFBRSxZQUFZLENBQUMsSUFBSSxDQUFFLENBQUMsQ0FBRSxDQUFDLEdBQUc7aUNBQ25DLEVBQUE7eUJBQ0o7d0JBRUssUUFBUSxnQkFDUCxLQUFLLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FDeEIsQ0FBQzt3QkFHcUIsV0FBTSxnQkFBTyxDQUFFLE1BQU0sRUFBRSxRQUFRLEVBQUUsRUFBRSxFQUFFLEdBQUcsQ0FBRSxFQUFBOzt3QkFBM0QsY0FBYyxHQUFHLFNBQTBDO3dCQUVqRSxXQUFPLEdBQUcsQ0FBQyxJQUFJLEdBQUc7Z0NBQ2QsTUFBTSxFQUFFLEdBQUc7Z0NBQ1gsSUFBSSxFQUFHLGNBQWMsQ0FBQyxJQUFZLENBQUMsR0FBRzs2QkFDekMsRUFBQTs7O3dCQUdELFdBQU8sR0FBRyxDQUFDLElBQUksR0FBRztnQ0FDZCxNQUFNLEVBQUUsR0FBRztnQ0FDWCxPQUFPLEVBQUUsR0FBQzs2QkFDYixFQUFBOzs7O2FBRVIsQ0FBQyxDQUFDO1FBRUgsV0FBTyxHQUFHLENBQUMsS0FBSyxFQUFHLEVBQUM7O0tBRXZCLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJcbmltcG9ydCAqIGFzIGNsb3VkIGZyb20gJ3d4LXNlcnZlci1zZGsnO1xuaW1wb3J0ICogYXMgVGNiUm91dGVyIGZyb20gJ3RjYi1yb3V0ZXInO1xuaW1wb3J0IHsgY3JlYXRlJCB9IGZyb20gJy4vY3JlYXRlJztcbmltcG9ydCB7IGZpbmQkIH0gZnJvbSAnLi9maW5kJztcblxuY2xvdWQuaW5pdCh7XG4gICAgZW52OiBjbG91ZC5EWU5BTUlDX0NVUlJFTlRfRU5WXG59KTtcblxuY29uc3QgZGI6IERCLkRhdGFiYXNlID0gY2xvdWQuZGF0YWJhc2UoICk7XG5cbi8qKlxuICpcbiAqIEBkZXNjcmlwdGlvbiDlnLDlnYDmqKHlnZdcbiAqIC0tLS0tLS0tIOWtl+autSAtLS0tLS0tLS0tXG4gKiAgICAgIF9pZFxuICogICAgICBvcGVuaWRcbiAgICAgICAgdXNlcm5hbWUsIOaUtui0p+S6ulxuICAgICAgICBwb3N0YWxjb2RlLCDpgq7mlL9cbiAgICAgICAgcGhvbmUsIOaUtuiOt+eUteivnVxuICAgICAgICBhZGRyZXNzLCDmlLbojrflnLDlnYBcbiAqIFxuICovXG5leHBvcnQgY29uc3QgbWFpbiA9IGFzeW5jICggZXZlbnQsIGNvbnRleHQgKSA9PiB7XG5cbiAgICBjb25zdCBhcHAgPSBuZXcgVGNiUm91dGVyKHsgZXZlbnQgfSk7XG5cbiAgICAvKipcbiAgICAgKiBAQGRlc2NyaXB0aW9uIOagueaNruWcsOWdgOWvueixoe+8jOaLv+WIsOW3suacieeahOWcsOWdgGlk5oiW6ICF5Yib5bu65LiA5Liq5paw55qE5Zyw5Z2A5bm26L+U5ZueaWRcbiAgICAgKiAtLS0tLS0tLS0tIOivt+axgiAtLS0tLS0tLS0tLVxuICAgICAqIHtcbiAgICAgKiEgICAgIG9wZW5pZD86IHN0cmluZ1xuICAgICAgICAgICAgYWRkcmVzczoge1xuICAgICAgICAgICAgICAgIHVzZXJuYW1lLCDmlLbotKfkurpcbiAgICAgICAgICAgICAgICBwb3N0YWxjb2RlLCDpgq7mlL9cbiAgICAgICAgICAgICAgICBwaG9uZSwg5pS26I6355S16K+dXG4gICAgICAgICAgICAgICAgYWRkcmVzcywg5pS26I635Zyw5Z2AXG4gICAgICAgICAgICB9XG4gICAgICogfVxuICAgICAqL1xuICAgIGFwcC5yb3V0ZXIoJ2dldEFkZHJlc3NJZCcsIGFzeW5jKCBjdHgsIG5leHQgKSA9PiB7XG4gICAgICAgIHRyeSB7XG5cbiAgICAgICAgICAgIC8vIOatpOWkhG9wZW5JZOWPr+iiq+S8oOWAvO+8jOeUqOS6juS7o+i0reS4uuWuouaIt+WinuWKoOiHquWumuS5ieiuouWNlVxuICAgICAgICAgICAgY29uc3Qgb3BlbklkID0gZXZlbnQuZGF0YS5vcGVuSWQgfHwgZXZlbnQudXNlckluZm8ub3BlbklkO1xuICAgICAgICAgICAgY29uc3Qgc2FtZUFkZHJlc3MkID0gYXdhaXQgZmluZCQoIG9wZW5JZCwgeyBcbiAgICAgICAgICAgICAgICBhZGRyZXNzOiBldmVudC5kYXRhLmFkZHJlc3MuYWRkcmVzc1xuICAgICAgICAgICAgfSwgZGIsIGN0eCApO1xuXG4gICAgICAgICAgICAvLyDmn6Xor6LliLDml6fnmoTnm7jlkIzlnLDlnYBcbiAgICAgICAgICAgIGlmICggc2FtZUFkZHJlc3MkLmRhdGEgJiYgc2FtZUFkZHJlc3MkLmRhdGEubGVuZ3RoID4gMCApIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gY3R4LmJvZHkgPSB7XG4gICAgICAgICAgICAgICAgICAgIHN0YXR1czogMjAwLFxuICAgICAgICAgICAgICAgICAgICBkYXRhOiBzYW1lQWRkcmVzcyQuZGF0YVsgMCBdLl9pZFxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIFxuICAgICAgICAgICAgY29uc3Qgc2F2ZURhdGEgPSB7XG4gICAgICAgICAgICAgICAgLi4uZXZlbnQuZGF0YS5hZGRyZXNzXG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAvLyDliJvlu7rmlrDnmoTlnLDlnYBcbiAgICAgICAgICAgIGNvbnN0IGNlcmF0ZUFkZHJlc3MkID0gYXdhaXQgY3JlYXRlJCggb3BlbklkLCBzYXZlRGF0YSwgZGIsIGN0eCApO1xuXG4gICAgICAgICAgICByZXR1cm4gY3R4LmJvZHkgPSB7XG4gICAgICAgICAgICAgICAgc3RhdHVzOiAyMDAsXG4gICAgICAgICAgICAgICAgZGF0YTogKGNlcmF0ZUFkZHJlc3MkLmRhdGEgYXMgYW55KS5faWRcbiAgICAgICAgICAgIH1cblxuICAgICAgICB9IGNhdGNoICggZSApIHtcbiAgICAgICAgICAgIHJldHVybiBjdHguYm9keSA9IHtcbiAgICAgICAgICAgICAgICBzdGF0dXM6IDUwMCxcbiAgICAgICAgICAgICAgICBtZXNzYWdlOiBlXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgIHJldHVybiBhcHAuc2VydmUoICk7XG5cbn0iXX0=