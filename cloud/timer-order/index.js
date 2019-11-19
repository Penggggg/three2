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
var trip_1 = require("./trip");
var form_ids_1 = require("./form-ids");
var shopping_list_1 = require("./shopping-list");
var order_1 = require("./order");
var share_record_1 = require("./share-record");
var push_timer_1 = require("./push-timer");
cloud.init({
    env: process.env.cloud
});
var db = cloud.database();
var _ = db.command;
exports.main = function (event, context) { return __awaiter(_this, void 0, void 0, function () {
    var e_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 16, , 17]);
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
                return [4, form_ids_1.clearFormIds()];
            case 13:
                _a.sent();
                return [4, form_ids_1.clearUseless()];
            case 14:
                _a.sent();
                return [4, share_record_1.clearShareRecord()];
            case 15:
                _a.sent();
                return [2, {
                        status: 200
                    }];
            case 16:
                e_1 = _a.sent();
                return [2, {
                        status: 500
                    }];
            case 17: return [2];
        }
    });
}); };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSxpQkFpREM7O0FBakRELHFDQUF1QztBQUN2QywrQkFBNEQ7QUFDNUQsdUNBQXdEO0FBQ3hELGlEQUF1RTtBQUN2RSxpQ0FBeUY7QUFDekYsK0NBQWtEO0FBQ2xELDJDQUEwQztBQUUxQyxLQUFLLENBQUMsSUFBSSxDQUFDO0lBQ1AsR0FBRyxFQUFFLE9BQU8sQ0FBQyxHQUFHLENBQUMsS0FBSztDQUN6QixDQUFDLENBQUM7QUFFSCxJQUFNLEVBQUUsR0FBZ0IsS0FBSyxDQUFDLFFBQVEsRUFBRyxDQUFDO0FBQzFDLElBQU0sQ0FBQyxHQUFHLEVBQUUsQ0FBQyxPQUFPLENBQUM7QUFTUixRQUFBLElBQUksR0FBRyxVQUFRLEtBQUssRUFBRSxPQUFPOzs7Ozs7Z0JBR2xDLFdBQU0sZUFBUSxFQUFHLEVBQUE7O2dCQUFqQixTQUFpQixDQUFDO2dCQUNsQixXQUFNLHVCQUFVLEVBQUcsRUFBQTs7Z0JBQW5CLFNBQW1CLENBQUM7Z0JBQ3BCLFdBQU0sZUFBTyxFQUFHLEVBQUE7O2dCQUFoQixTQUFnQixDQUFDO2dCQUNqQixXQUFNLG1CQUFXLEVBQUcsRUFBQTs7Z0JBQXBCLFNBQW9CLENBQUM7Z0JBQ3JCLFdBQU0sZ0JBQVEsRUFBRyxFQUFBOztnQkFBakIsU0FBaUIsQ0FBQztnQkFDbEIsV0FBTSxnQkFBUSxFQUFHLEVBQUE7O2dCQUFqQixTQUFpQixDQUFDO2dCQUNsQixXQUFNLGdCQUFRLEVBQUcsRUFBQTs7Z0JBQWpCLFNBQWlCLENBQUM7Z0JBQ2xCLFdBQU0sa0JBQVUsRUFBRyxFQUFBOztnQkFBbkIsU0FBbUIsQ0FBQztnQkFDcEIsV0FBTSxtQkFBWSxFQUFHLEVBQUE7O2dCQUFyQixTQUFxQixDQUFDO2dCQUN0QixXQUFNLGlCQUFVLEVBQUcsRUFBQTs7Z0JBQW5CLFNBQW1CLENBQUM7Z0JBQ3BCLFdBQU0sK0JBQWUsRUFBRyxFQUFBOztnQkFBeEIsU0FBd0IsQ0FBQztnQkFDekIsV0FBTSxtQ0FBbUIsRUFBRyxFQUFBOztnQkFBNUIsU0FBNEIsQ0FBQztnQkFDN0IsV0FBTSx1QkFBWSxFQUFHLEVBQUE7O2dCQUFyQixTQUFxQixDQUFDO2dCQUN0QixXQUFNLHVCQUFZLEVBQUcsRUFBQTs7Z0JBQXJCLFNBQXFCLENBQUM7Z0JBQ3RCLFdBQU0sK0JBQWdCLEVBQUcsRUFBQTs7Z0JBQXpCLFNBQXlCLENBQUM7Z0JBRTFCLFdBQU87d0JBQ0gsTUFBTSxFQUFFLEdBQUc7cUJBQ2QsRUFBQTs7O2dCQUVELFdBQU87d0JBQ0gsTUFBTSxFQUFFLEdBQUc7cUJBQ2QsRUFBQTs7OztLQUVSLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBjbG91ZCBmcm9tICd3eC1zZXJ2ZXItc2RrJztcbmltcG9ydCB7IG92ZXJ0aW1lVHJpcCwgYWxtb3N0T3ZlciwgYXV0b1RyaXAgfSBmcm9tICcuL3RyaXAnO1xuaW1wb3J0IHsgY2xlYXJGb3JtSWRzLCBjbGVhclVzZWxlc3MgfSBmcm9tICcuL2Zvcm0taWRzJztcbmltcG9ydCB7IGNhdGNoTG9zdE9yZGVycywgcmVtb3ZlVXNlbGVzc09yZGVycyB9IGZyb20gJy4vc2hvcHBpbmctbGlzdCc7XG5pbXBvcnQgeyBvdmVydGltZSwgcGF5ZWRGaXgsIHByaWNlRml4LCBwYXlMYXN0Rml4LCBwdXNoTmV3LCBwdXNoTGFzdFBheSB9IGZyb20gJy4vb3JkZXInO1xuaW1wb3J0IHsgY2xlYXJTaGFyZVJlY29yZCB9IGZyb20gJy4vc2hhcmUtcmVjb3JkJztcbmltcG9ydCB7IHVzZXJHZXRFeHAgfSBmcm9tICcuL3B1c2gtdGltZXInO1xuXG5jbG91ZC5pbml0KHtcbiAgICBlbnY6IHByb2Nlc3MuZW52LmNsb3VkXG59KTtcblxuY29uc3QgZGI6IERCLkRhdGFiYXNlID0gY2xvdWQuZGF0YWJhc2UoICk7XG5jb25zdCBfID0gZGIuY29tbWFuZDtcblxuLyoqIFxuICog5a6a5pe25Zmo5qih5Z2XXG4gKiAx44CB6K6i5Y2VMe+8muaJgOacieW6lOivpeaUr+S7mO+8jOS9huaYr+aUr+S7mOi2heaXtu+8iDMw5YiG6ZKf77yJ55qE6K6i5Y2V77yM6YeK5pS+5Y6f5p2l55qE5bqT5a2Y77yM6K6i5Y2V6YeN572u5Li65bey6L+H5pe2XG4gKiAy44CB6K6i5Y2VMu+8muaJgOacieaIkOWKn+aUr+S7mOeahOiuouWNle+8jOajgOafpeacieayoeaciSB0eXBlIOi/mOaYryBwcmXnmoTvvIzmnInnmoTor53pnIDopoHovazmiJBub3JtYWznsbvlnovorqLljZXvvIzliKDpmaTlr7nlupTnmoTotK3nianovabvvIjmnInnmoTor53vvIlcbiAqIDPjgIHorqLljZUz77ya5bey57uP6L+b6KGM6LSt54mp5riF5Y2V5Lu35qC86LCD5pW05ZCO77yM5paw5p2l55qE5ZWG5ZOB6K6i5Y2V5Lu35qC85aaC5p6c6Lef5riF5Y2V5Lu35qC85LiN5LiA6Ie077yM5bqU6K+l55So5a6a5pe25Zmo6L+b6KGM6LCD5pW0XG4gKiA044CB5riF5Y2VMe+8muafpeivouacquiiq+WuieaOkui/m+a4heWNleeahOW3suiuoumHkeiuouWNle+8iHBheV9zdGF0dXM6IDEg55qEb3JkZXLvvIlcbiAqL1xuZXhwb3J0IGNvbnN0IG1haW4gPSBhc3luYyAoIGV2ZW50LCBjb250ZXh0ICkgPT4ge1xuICAgIHRyeSB7XG4gICAgICAgIFxuICAgICAgICBhd2FpdCBhdXRvVHJpcCggKTtcbiAgICAgICAgYXdhaXQgdXNlckdldEV4cCggKTtcbiAgICAgICAgYXdhaXQgcHVzaE5ldyggKTtcbiAgICAgICAgYXdhaXQgcHVzaExhc3RQYXkoICk7XG4gICAgICAgIGF3YWl0IG92ZXJ0aW1lKCApO1xuICAgICAgICBhd2FpdCBwYXllZEZpeCggKTtcbiAgICAgICAgYXdhaXQgcHJpY2VGaXgoICk7XG4gICAgICAgIGF3YWl0IHBheUxhc3RGaXgoICk7XG4gICAgICAgIGF3YWl0IG92ZXJ0aW1lVHJpcCggKTtcbiAgICAgICAgYXdhaXQgYWxtb3N0T3ZlciggKTtcbiAgICAgICAgYXdhaXQgY2F0Y2hMb3N0T3JkZXJzKCApO1xuICAgICAgICBhd2FpdCByZW1vdmVVc2VsZXNzT3JkZXJzKCApO1xuICAgICAgICBhd2FpdCBjbGVhckZvcm1JZHMoICk7XG4gICAgICAgIGF3YWl0IGNsZWFyVXNlbGVzcyggKTtcbiAgICAgICAgYXdhaXQgY2xlYXJTaGFyZVJlY29yZCggKTtcbiAgICAgICAgXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBzdGF0dXM6IDIwMFxuICAgICAgICB9XG4gICAgfSBjYXRjaCAoIGUgKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBzdGF0dXM6IDUwMFxuICAgICAgICB9XG4gICAgfVxufSJdfQ==