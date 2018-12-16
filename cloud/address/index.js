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
cloud.init();
var db = cloud.database();
exports.main = function (event, context) { return __awaiter(_this, void 0, void 0, function () {
    var app;
    var _this = this;
    return __generator(this, function (_a) {
        app = new TcbRouter({ event: event });
        app.router('getAddressId', function (ctx, next) { return __awaiter(_this, void 0, void 0, function () {
            var openId, sameAddress$, cerateAddress$, e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        openId = event.data.openId || event.userInfo.openId;
                        return [4, find_1.find$(openId, {
                                address: event.data.address
                            }, db, ctx)];
                    case 1:
                        sameAddress$ = _a.sent();
                        if (sameAddress$.data && sameAddress$.data.length > 0) {
                            return [2, ctx.body = {
                                    status: 200,
                                    data: sameAddress$.data[0]._id
                                }];
                        }
                        return [4, create_1.create$(openId, __assign({}, event.data), db, ctx)];
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUNBLGlCQWtFQzs7QUFsRUQscUNBQXVDO0FBQ3ZDLHNDQUF3QztBQUN4QyxtQ0FBbUM7QUFDbkMsK0JBQStCO0FBRS9CLEtBQUssQ0FBQyxJQUFJLEVBQUcsQ0FBQztBQUVkLElBQU0sRUFBRSxHQUFnQixLQUFLLENBQUMsUUFBUSxFQUFHLENBQUM7QUFjN0IsUUFBQSxJQUFJLEdBQUcsVUFBUSxLQUFLLEVBQUUsT0FBTzs7OztRQUVoQyxHQUFHLEdBQUcsSUFBSSxTQUFTLENBQUMsRUFBRSxLQUFLLE9BQUEsRUFBRSxDQUFDLENBQUM7UUFLckMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxjQUFjLEVBQUUsVUFBTyxHQUFHLEVBQUUsSUFBSTs7Ozs7O3dCQUk3QixNQUFNLEdBQUcsS0FBSyxDQUFDLElBQUksQ0FBQyxNQUFNLElBQUksS0FBSyxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUM7d0JBRXJDLFdBQU0sWUFBSyxDQUFFLE1BQU0sRUFBRTtnQ0FDdEMsT0FBTyxFQUFFLEtBQUssQ0FBQyxJQUFJLENBQUMsT0FBTzs2QkFDOUIsRUFBRSxFQUFFLEVBQUUsR0FBRyxDQUFFLEVBQUE7O3dCQUZOLFlBQVksR0FBRyxTQUVUO3dCQUdaLElBQUssWUFBWSxDQUFDLElBQUksSUFBSSxZQUFZLENBQUMsSUFBSSxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUc7NEJBQ3JELFdBQU8sR0FBRyxDQUFDLElBQUksR0FBRztvQ0FDZCxNQUFNLEVBQUUsR0FBRztvQ0FDWCxJQUFJLEVBQUUsWUFBWSxDQUFDLElBQUksQ0FBRSxDQUFDLENBQUUsQ0FBQyxHQUFHO2lDQUNuQyxFQUFBO3lCQUNKO3dCQUdzQixXQUFNLGdCQUFPLENBQUUsTUFBTSxlQUNyQyxLQUFLLENBQUMsSUFBSSxHQUNkLEVBQUUsRUFBRSxHQUFHLENBQUUsRUFBQTs7d0JBRk4sY0FBYyxHQUFHLFNBRVg7d0JBRVosV0FBTyxHQUFHLENBQUMsSUFBSSxHQUFHO2dDQUNkLE1BQU0sRUFBRSxHQUFHO2dDQUNYLElBQUksRUFBRyxjQUFjLENBQUMsSUFBWSxDQUFDLEdBQUc7NkJBQ3pDLEVBQUE7Ozt3QkFHRCxXQUFPLEdBQUcsQ0FBQyxJQUFJLEdBQUc7Z0NBQ2QsTUFBTSxFQUFFLEdBQUc7Z0NBQ1gsT0FBTyxFQUFFLEdBQUM7NkJBQ2IsRUFBQTs7OzthQUVSLENBQUMsQ0FBQztRQUVILFdBQU8sR0FBRyxDQUFDLEtBQUssRUFBRyxFQUFDOztLQUV2QixDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiXG5pbXBvcnQgKiBhcyBjbG91ZCBmcm9tICd3eC1zZXJ2ZXItc2RrJztcbmltcG9ydCAqIGFzIFRjYlJvdXRlciBmcm9tICd0Y2Itcm91dGVyJztcbmltcG9ydCB7IGNyZWF0ZSQgfSBmcm9tICcuL2NyZWF0ZSc7XG5pbXBvcnQgeyBmaW5kJCB9IGZyb20gJy4vZmluZCc7XG5cbmNsb3VkLmluaXQoICk7XG5cbmNvbnN0IGRiOiBEQi5EYXRhYmFzZSA9IGNsb3VkLmRhdGFiYXNlKCApO1xuXG4vKipcbiAqXG4gKiBAZGVzY3JpcHRpb24g5Zyw5Z2A5qih5Z2XXG4gKiAtLS0tLS0tLSDlrZfmrrUgLS0tLS0tLS0tLVxuICogICAgICBfaWRcbiAqICAgICAgb3BlbmlkXG4gICAgICAgIHVzZXJuYW1lLCDmlLbotKfkurpcbiAgICAgICAgcG9zdGFsY29kZSwg6YKu5pS/XG4gICAgICAgIHBob25lLCDmlLbojrfnlLXor51cbiAgICAgICAgYWRkcmVzcywg5pS26I635Zyw5Z2AXG4gKiBcbiAqL1xuZXhwb3J0IGNvbnN0IG1haW4gPSBhc3luYyAoIGV2ZW50LCBjb250ZXh0ICkgPT4ge1xuXG4gICAgY29uc3QgYXBwID0gbmV3IFRjYlJvdXRlcih7IGV2ZW50IH0pO1xuXG4gICAgLyoqXG4gICAgICogQEBkZXNjcmlwdGlvbiDmoLnmja7lnLDlnYDlr7nosaHvvIzmi7/liLDlt7LmnInnmoTlnLDlnYBpZOaIluiAheWIm+W7uuS4gOS4quaWsOeahOWcsOWdgOW5tui/lOWbnmlkXG4gICAgICovXG4gICAgYXBwLnJvdXRlcignZ2V0QWRkcmVzc0lkJywgYXN5bmMoIGN0eCwgbmV4dCApID0+IHtcbiAgICAgICAgdHJ5IHtcblxuICAgICAgICAgICAgLy8g5q2k5aSEb3Blbklk5Y+v6KKr5Lyg5YC877yM55So5LqO5Luj6LSt5Li65a6i5oi35aKe5Yqg6Ieq5a6a5LmJ6K6i5Y2VXG4gICAgICAgICAgICBjb25zdCBvcGVuSWQgPSBldmVudC5kYXRhLm9wZW5JZCB8fCBldmVudC51c2VySW5mby5vcGVuSWQ7XG5cbiAgICAgICAgICAgIGNvbnN0IHNhbWVBZGRyZXNzJCA9IGF3YWl0IGZpbmQkKCBvcGVuSWQsIHsgXG4gICAgICAgICAgICAgICAgYWRkcmVzczogZXZlbnQuZGF0YS5hZGRyZXNzXG4gICAgICAgICAgICB9LCBkYiwgY3R4ICk7XG5cbiAgICAgICAgICAgIC8vIOafpeivouWIsOaXp+eahOebuOWQjOWcsOWdgFxuICAgICAgICAgICAgaWYgKCBzYW1lQWRkcmVzcyQuZGF0YSAmJiBzYW1lQWRkcmVzcyQuZGF0YS5sZW5ndGggPiAwICkge1xuICAgICAgICAgICAgICAgIHJldHVybiBjdHguYm9keSA9IHtcbiAgICAgICAgICAgICAgICAgICAgc3RhdHVzOiAyMDAsXG4gICAgICAgICAgICAgICAgICAgIGRhdGE6IHNhbWVBZGRyZXNzJC5kYXRhWyAwIF0uX2lkXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgXG4gICAgICAgICAgICAvLyDliJvlu7rmlrDnmoTlnLDlnYBcbiAgICAgICAgICAgIGNvbnN0IGNlcmF0ZUFkZHJlc3MkID0gYXdhaXQgY3JlYXRlJCggb3BlbklkLCB7XG4gICAgICAgICAgICAgICAgLi4uZXZlbnQuZGF0YVxuICAgICAgICAgICAgfSwgZGIsIGN0eCApO1xuXG4gICAgICAgICAgICByZXR1cm4gY3R4LmJvZHkgPSB7XG4gICAgICAgICAgICAgICAgc3RhdHVzOiAyMDAsXG4gICAgICAgICAgICAgICAgZGF0YTogKGNlcmF0ZUFkZHJlc3MkLmRhdGEgYXMgYW55KS5faWRcbiAgICAgICAgICAgIH1cblxuICAgICAgICB9IGNhdGNoICggZSApIHtcbiAgICAgICAgICAgIHJldHVybiBjdHguYm9keSA9IHtcbiAgICAgICAgICAgICAgICBzdGF0dXM6IDUwMCxcbiAgICAgICAgICAgICAgICBtZXNzYWdlOiBlXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgIHJldHVybiBhcHAuc2VydmUoICk7XG5cbn0iXX0=