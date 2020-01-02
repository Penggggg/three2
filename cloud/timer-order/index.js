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
var trip_1 = require("./trip");
var shopping_list_1 = require("./shopping-list");
var order_1 = require("./order");
var share_record_1 = require("./share-record");
var push_timer_1 = require("./push-timer");
var analyze_1 = require("./analyze");
var db = cloud.database();
var _ = db.command;
exports.main = function (event, context) { return __awaiter(void 0, void 0, void 0, function () {
    var e_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 15, , 16]);
                return [4, trip_1.autoTrip()];
            case 1:
                _a.sent();
                return [4, push_timer_1.userGetExp()];
            case 2:
                _a.sent();
                return [4, order_1.pushNew()];
            case 3:
                _a.sent();
                return [4, order_1.pushLastPay()];
            case 4:
                _a.sent();
                return [4, order_1.overtime()];
            case 5:
                _a.sent();
                return [4, order_1.payedFix()];
            case 6:
                _a.sent();
                return [4, order_1.priceFix()];
            case 7:
                _a.sent();
                return [4, order_1.payLastFix()];
            case 8:
                _a.sent();
                return [4, trip_1.overtimeTrip()];
            case 9:
                _a.sent();
                return [4, trip_1.almostOver()];
            case 10:
                _a.sent();
                return [4, shopping_list_1.catchLostOrders()];
            case 11:
                _a.sent();
                return [4, shopping_list_1.removeUselessOrders()];
            case 12:
                _a.sent();
                return [4, share_record_1.clearShareRecord()];
            case 13:
                _a.sent();
                return [4, analyze_1.lastDayData()];
            case 14:
                _a.sent();
                return [2, {
                        status: 200
                    }];
            case 15:
                e_1 = _a.sent();
                return [2, {
                        status: 500
                    }];
            case 16: return [2];
        }
    });
}); };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLHFDQUF1QztBQUN2QywrQkFBNEQ7QUFDNUQsaURBQXVFO0FBQ3ZFLGlDQUF5RjtBQUN6RiwrQ0FBa0Q7QUFDbEQsMkNBQTBDO0FBQzFDLHFDQUF3QztBQU14QyxJQUFNLEVBQUUsR0FBZ0IsS0FBSyxDQUFDLFFBQVEsRUFBRyxDQUFDO0FBQzFDLElBQU0sQ0FBQyxHQUFHLEVBQUUsQ0FBQyxPQUFPLENBQUM7QUFLUixRQUFBLElBQUksR0FBRyxVQUFRLEtBQUssRUFBRSxPQUFPOzs7Ozs7Z0JBR2xDLFdBQU0sZUFBUSxFQUFHLEVBQUE7O2dCQUFqQixTQUFpQixDQUFDO2dCQUNsQixXQUFNLHVCQUFVLEVBQUcsRUFBQTs7Z0JBQW5CLFNBQW1CLENBQUM7Z0JBQ3BCLFdBQU0sZUFBTyxFQUFHLEVBQUE7O2dCQUFoQixTQUFnQixDQUFDO2dCQUNqQixXQUFNLG1CQUFXLEVBQUcsRUFBQTs7Z0JBQXBCLFNBQW9CLENBQUM7Z0JBQ3JCLFdBQU0sZ0JBQVEsRUFBRyxFQUFBOztnQkFBakIsU0FBaUIsQ0FBQztnQkFDbEIsV0FBTSxnQkFBUSxFQUFHLEVBQUE7O2dCQUFqQixTQUFpQixDQUFDO2dCQUNsQixXQUFNLGdCQUFRLEVBQUcsRUFBQTs7Z0JBQWpCLFNBQWlCLENBQUM7Z0JBQ2xCLFdBQU0sa0JBQVUsRUFBRyxFQUFBOztnQkFBbkIsU0FBbUIsQ0FBQztnQkFDcEIsV0FBTSxtQkFBWSxFQUFHLEVBQUE7O2dCQUFyQixTQUFxQixDQUFDO2dCQUN0QixXQUFNLGlCQUFVLEVBQUcsRUFBQTs7Z0JBQW5CLFNBQW1CLENBQUM7Z0JBQ3BCLFdBQU0sK0JBQWUsRUFBRyxFQUFBOztnQkFBeEIsU0FBd0IsQ0FBQztnQkFDekIsV0FBTSxtQ0FBbUIsRUFBRyxFQUFBOztnQkFBNUIsU0FBNEIsQ0FBQztnQkFDN0IsV0FBTSwrQkFBZ0IsRUFBRyxFQUFBOztnQkFBekIsU0FBeUIsQ0FBQztnQkFDMUIsV0FBTSxxQkFBVyxFQUFHLEVBQUE7O2dCQUFwQixTQUFvQixDQUFDO2dCQUVyQixXQUFPO3dCQUNILE1BQU0sRUFBRSxHQUFHO3FCQUNkLEVBQUE7OztnQkFFRCxXQUFPO3dCQUNILE1BQU0sRUFBRSxHQUFHO3FCQUNkLEVBQUE7Ozs7S0FFUixDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgY2xvdWQgZnJvbSAnd3gtc2VydmVyLXNkayc7XG5pbXBvcnQgeyBvdmVydGltZVRyaXAsIGFsbW9zdE92ZXIsIGF1dG9UcmlwIH0gZnJvbSAnLi90cmlwJztcbmltcG9ydCB7IGNhdGNoTG9zdE9yZGVycywgcmVtb3ZlVXNlbGVzc09yZGVycyB9IGZyb20gJy4vc2hvcHBpbmctbGlzdCc7XG5pbXBvcnQgeyBvdmVydGltZSwgcGF5ZWRGaXgsIHByaWNlRml4LCBwYXlMYXN0Rml4LCBwdXNoTmV3LCBwdXNoTGFzdFBheSB9IGZyb20gJy4vb3JkZXInO1xuaW1wb3J0IHsgY2xlYXJTaGFyZVJlY29yZCB9IGZyb20gJy4vc2hhcmUtcmVjb3JkJztcbmltcG9ydCB7IHVzZXJHZXRFeHAgfSBmcm9tICcuL3B1c2gtdGltZXInO1xuaW1wb3J0IHsgbGFzdERheURhdGEgfSBmcm9tICcuL2FuYWx5emUnO1xuXG4vLyBjbG91ZC5pbml0KHtcbi8vICAgICBlbnY6IHByb2Nlc3MuZW52LmNsb3VkXG4vLyB9KTtcblxuY29uc3QgZGI6IERCLkRhdGFiYXNlID0gY2xvdWQuZGF0YWJhc2UoICk7XG5jb25zdCBfID0gZGIuY29tbWFuZDtcblxuLyoqIFxuICog5a6a5pe25Zmo5qih5Z2XXG4gKi9cbmV4cG9ydCBjb25zdCBtYWluID0gYXN5bmMgKCBldmVudCwgY29udGV4dCApID0+IHtcbiAgICB0cnkge1xuICAgICAgICBcbiAgICAgICAgYXdhaXQgYXV0b1RyaXAoICk7XG4gICAgICAgIGF3YWl0IHVzZXJHZXRFeHAoICk7XG4gICAgICAgIGF3YWl0IHB1c2hOZXcoICk7XG4gICAgICAgIGF3YWl0IHB1c2hMYXN0UGF5KCApO1xuICAgICAgICBhd2FpdCBvdmVydGltZSggKTtcbiAgICAgICAgYXdhaXQgcGF5ZWRGaXgoICk7XG4gICAgICAgIGF3YWl0IHByaWNlRml4KCApO1xuICAgICAgICBhd2FpdCBwYXlMYXN0Rml4KCApO1xuICAgICAgICBhd2FpdCBvdmVydGltZVRyaXAoICk7XG4gICAgICAgIGF3YWl0IGFsbW9zdE92ZXIoICk7XG4gICAgICAgIGF3YWl0IGNhdGNoTG9zdE9yZGVycyggKTtcbiAgICAgICAgYXdhaXQgcmVtb3ZlVXNlbGVzc09yZGVycyggKTtcbiAgICAgICAgYXdhaXQgY2xlYXJTaGFyZVJlY29yZCggKTtcbiAgICAgICAgYXdhaXQgbGFzdERheURhdGEoICk7XG4gICAgICAgIFxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgc3RhdHVzOiAyMDBcbiAgICAgICAgfVxuICAgIH0gY2F0Y2ggKCBlICkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgc3RhdHVzOiA1MDBcbiAgICAgICAgfVxuICAgIH1cbn0iXX0=