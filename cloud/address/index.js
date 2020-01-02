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
var TcbRouter = require("tcb-router");
var create_1 = require("./create");
var find_1 = require("./find");
cloud.init({
    env: process.env.cloud
});
var db = cloud.database();
exports.main = function (event, context) { return __awaiter(void 0, void 0, void 0, function () {
    var app;
    return __generator(this, function (_a) {
        app = new TcbRouter({ event: event });
        app.router('getAddressId', function (ctx, next) { return __awaiter(void 0, void 0, void 0, function () {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQ0EscUNBQXVDO0FBQ3ZDLHNDQUF3QztBQUN4QyxtQ0FBbUM7QUFDbkMsK0JBQStCO0FBRS9CLEtBQUssQ0FBQyxJQUFJLENBQUM7SUFDUCxHQUFHLEVBQUUsT0FBTyxDQUFDLEdBQUcsQ0FBQyxLQUFLO0NBQ3pCLENBQUMsQ0FBQztBQUVILElBQU0sRUFBRSxHQUFnQixLQUFLLENBQUMsUUFBUSxFQUFHLENBQUM7QUFjN0IsUUFBQSxJQUFJLEdBQUcsVUFBUSxLQUFLLEVBQUUsT0FBTzs7O1FBRWhDLEdBQUcsR0FBRyxJQUFJLFNBQVMsQ0FBQyxFQUFFLEtBQUssT0FBQSxFQUFFLENBQUMsQ0FBQztRQWVyQyxHQUFHLENBQUMsTUFBTSxDQUFDLGNBQWMsRUFBRSxVQUFPLEdBQUcsRUFBRSxJQUFJOzs7Ozs7d0JBSTdCLE1BQU0sR0FBRyxLQUFLLENBQUMsSUFBSSxDQUFDLE1BQU0sSUFBSSxLQUFLLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQzt3QkFDckMsV0FBTSxZQUFLLENBQUUsTUFBTSxFQUFFO2dDQUN0QyxPQUFPLEVBQUUsS0FBSyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsT0FBTzs2QkFDdEMsRUFBRSxFQUFFLEVBQUUsR0FBRyxDQUFFLEVBQUE7O3dCQUZOLFlBQVksR0FBRyxTQUVUO3dCQUdaLElBQUssWUFBWSxDQUFDLElBQUksSUFBSSxZQUFZLENBQUMsSUFBSSxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUc7NEJBQ3JELFdBQU8sR0FBRyxDQUFDLElBQUksR0FBRztvQ0FDZCxNQUFNLEVBQUUsR0FBRztvQ0FDWCxJQUFJLEVBQUUsWUFBWSxDQUFDLElBQUksQ0FBRSxDQUFDLENBQUUsQ0FBQyxHQUFHO2lDQUNuQyxFQUFBO3lCQUNKO3dCQUVLLFFBQVEsZ0JBQ1AsS0FBSyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQ3hCLENBQUM7d0JBR3FCLFdBQU0sZ0JBQU8sQ0FBRSxNQUFNLEVBQUUsUUFBUSxFQUFFLEVBQUUsRUFBRSxHQUFHLENBQUUsRUFBQTs7d0JBQTNELGNBQWMsR0FBRyxTQUEwQzt3QkFFakUsV0FBTyxHQUFHLENBQUMsSUFBSSxHQUFHO2dDQUNkLE1BQU0sRUFBRSxHQUFHO2dDQUNYLElBQUksRUFBRyxjQUFjLENBQUMsSUFBWSxDQUFDLEdBQUc7NkJBQ3pDLEVBQUE7Ozt3QkFHRCxXQUFPLEdBQUcsQ0FBQyxJQUFJLEdBQUc7Z0NBQ2QsTUFBTSxFQUFFLEdBQUc7Z0NBQ1gsT0FBTyxFQUFFLEdBQUM7NkJBQ2IsRUFBQTs7OzthQUVSLENBQUMsQ0FBQztRQUVILFdBQU8sR0FBRyxDQUFDLEtBQUssRUFBRyxFQUFDOztLQUV2QixDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiXG5pbXBvcnQgKiBhcyBjbG91ZCBmcm9tICd3eC1zZXJ2ZXItc2RrJztcbmltcG9ydCAqIGFzIFRjYlJvdXRlciBmcm9tICd0Y2Itcm91dGVyJztcbmltcG9ydCB7IGNyZWF0ZSQgfSBmcm9tICcuL2NyZWF0ZSc7XG5pbXBvcnQgeyBmaW5kJCB9IGZyb20gJy4vZmluZCc7XG5cbmNsb3VkLmluaXQoe1xuICAgIGVudjogcHJvY2Vzcy5lbnYuY2xvdWRcbn0pO1xuXG5jb25zdCBkYjogREIuRGF0YWJhc2UgPSBjbG91ZC5kYXRhYmFzZSggKTtcblxuLyoqXG4gKlxuICogQGRlc2NyaXB0aW9uIOWcsOWdgOaooeWdl1xuICogLS0tLS0tLS0g5a2X5q61IC0tLS0tLS0tLS1cbiAqICAgICAgX2lkXG4gKiAgICAgIG9wZW5pZFxuICAgICAgICB1c2VybmFtZSwg5pS26LSn5Lq6XG4gICAgICAgIHBvc3RhbGNvZGUsIOmCruaUv1xuICAgICAgICBwaG9uZSwg5pS26I6355S16K+dXG4gICAgICAgIGFkZHJlc3MsIOaUtuiOt+WcsOWdgFxuICogXG4gKi9cbmV4cG9ydCBjb25zdCBtYWluID0gYXN5bmMgKCBldmVudCwgY29udGV4dCApID0+IHtcblxuICAgIGNvbnN0IGFwcCA9IG5ldyBUY2JSb3V0ZXIoeyBldmVudCB9KTtcblxuICAgIC8qKlxuICAgICAqIEBAZGVzY3JpcHRpb24g5qC55o2u5Zyw5Z2A5a+56LGh77yM5ou/5Yiw5bey5pyJ55qE5Zyw5Z2AaWTmiJbogIXliJvlu7rkuIDkuKrmlrDnmoTlnLDlnYDlubbov5Tlm55pZFxuICAgICAqIC0tLS0tLS0tLS0g6K+35rGCIC0tLS0tLS0tLS0tXG4gICAgICoge1xuICAgICAqISAgICAgb3BlbmlkPzogc3RyaW5nXG4gICAgICAgICAgICBhZGRyZXNzOiB7XG4gICAgICAgICAgICAgICAgdXNlcm5hbWUsIOaUtui0p+S6ulxuICAgICAgICAgICAgICAgIHBvc3RhbGNvZGUsIOmCruaUv1xuICAgICAgICAgICAgICAgIHBob25lLCDmlLbojrfnlLXor51cbiAgICAgICAgICAgICAgICBhZGRyZXNzLCDmlLbojrflnLDlnYBcbiAgICAgICAgICAgIH1cbiAgICAgKiB9XG4gICAgICovXG4gICAgYXBwLnJvdXRlcignZ2V0QWRkcmVzc0lkJywgYXN5bmMoIGN0eCwgbmV4dCApID0+IHtcbiAgICAgICAgdHJ5IHtcblxuICAgICAgICAgICAgLy8g5q2k5aSEb3Blbklk5Y+v6KKr5Lyg5YC877yM55So5LqO5Luj6LSt5Li65a6i5oi35aKe5Yqg6Ieq5a6a5LmJ6K6i5Y2VXG4gICAgICAgICAgICBjb25zdCBvcGVuSWQgPSBldmVudC5kYXRhLm9wZW5JZCB8fCBldmVudC51c2VySW5mby5vcGVuSWQ7XG4gICAgICAgICAgICBjb25zdCBzYW1lQWRkcmVzcyQgPSBhd2FpdCBmaW5kJCggb3BlbklkLCB7IFxuICAgICAgICAgICAgICAgIGFkZHJlc3M6IGV2ZW50LmRhdGEuYWRkcmVzcy5hZGRyZXNzXG4gICAgICAgICAgICB9LCBkYiwgY3R4ICk7XG5cbiAgICAgICAgICAgIC8vIOafpeivouWIsOaXp+eahOebuOWQjOWcsOWdgFxuICAgICAgICAgICAgaWYgKCBzYW1lQWRkcmVzcyQuZGF0YSAmJiBzYW1lQWRkcmVzcyQuZGF0YS5sZW5ndGggPiAwICkge1xuICAgICAgICAgICAgICAgIHJldHVybiBjdHguYm9keSA9IHtcbiAgICAgICAgICAgICAgICAgICAgc3RhdHVzOiAyMDAsXG4gICAgICAgICAgICAgICAgICAgIGRhdGE6IHNhbWVBZGRyZXNzJC5kYXRhWyAwIF0uX2lkXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgXG4gICAgICAgICAgICBjb25zdCBzYXZlRGF0YSA9IHtcbiAgICAgICAgICAgICAgICAuLi5ldmVudC5kYXRhLmFkZHJlc3NcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIC8vIOWIm+W7uuaWsOeahOWcsOWdgFxuICAgICAgICAgICAgY29uc3QgY2VyYXRlQWRkcmVzcyQgPSBhd2FpdCBjcmVhdGUkKCBvcGVuSWQsIHNhdmVEYXRhLCBkYiwgY3R4ICk7XG5cbiAgICAgICAgICAgIHJldHVybiBjdHguYm9keSA9IHtcbiAgICAgICAgICAgICAgICBzdGF0dXM6IDIwMCxcbiAgICAgICAgICAgICAgICBkYXRhOiAoY2VyYXRlQWRkcmVzcyQuZGF0YSBhcyBhbnkpLl9pZFxuICAgICAgICAgICAgfVxuXG4gICAgICAgIH0gY2F0Y2ggKCBlICkge1xuICAgICAgICAgICAgcmV0dXJuIGN0eC5ib2R5ID0ge1xuICAgICAgICAgICAgICAgIHN0YXR1czogNTAwLFxuICAgICAgICAgICAgICAgIG1lc3NhZ2U6IGVcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgcmV0dXJuIGFwcC5zZXJ2ZSggKTtcblxufSJdfQ==