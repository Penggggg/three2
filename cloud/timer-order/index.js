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
                _a.trys.push([0, 14, , 15]);
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
                return [4, trip_1.overtimeTrip()];
            case 8:
                _a.sent();
                return [4, trip_1.almostOver()];
            case 9:
                _a.sent();
                return [4, shopping_list_1.catchLostOrders()];
            case 10:
                _a.sent();
                return [4, shopping_list_1.removeUselessOrders()];
            case 11:
                _a.sent();
                return [4, share_record_1.clearShareRecord()];
            case 12:
                _a.sent();
                return [4, analyze_1.lastDayData()];
            case 13:
                _a.sent();
                return [2, {
                        status: 200
                    }];
            case 14:
                e_1 = _a.sent();
                return [2, {
                        status: 500
                    }];
            case 15: return [2];
        }
    });
}); };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLHFDQUF1QztBQUN2QywrQkFBNEQ7QUFDNUQsaURBQXVFO0FBQ3ZFLGlDQUF5RjtBQUN6RiwrQ0FBa0Q7QUFDbEQsMkNBQTBDO0FBQzFDLHFDQUF3QztBQU14QyxJQUFNLEVBQUUsR0FBZ0IsS0FBSyxDQUFDLFFBQVEsRUFBRyxDQUFDO0FBQzFDLElBQU0sQ0FBQyxHQUFHLEVBQUUsQ0FBQyxPQUFPLENBQUM7QUFLUixRQUFBLElBQUksR0FBRyxVQUFRLEtBQUssRUFBRSxPQUFPOzs7Ozs7Z0JBR2xDLFdBQU0sZUFBUSxFQUFHLEVBQUE7O2dCQUFqQixTQUFpQixDQUFDO2dCQUNsQixXQUFNLHVCQUFVLEVBQUcsRUFBQTs7Z0JBQW5CLFNBQW1CLENBQUM7Z0JBQ3BCLFdBQU0sZUFBTyxFQUFHLEVBQUE7O2dCQUFoQixTQUFnQixDQUFDO2dCQUNqQixXQUFNLG1CQUFXLEVBQUcsRUFBQTs7Z0JBQXBCLFNBQW9CLENBQUM7Z0JBQ3JCLFdBQU0sZ0JBQVEsRUFBRyxFQUFBOztnQkFBakIsU0FBaUIsQ0FBQztnQkFDbEIsV0FBTSxnQkFBUSxFQUFHLEVBQUE7O2dCQUFqQixTQUFpQixDQUFDO2dCQUNsQixXQUFNLGdCQUFRLEVBQUcsRUFBQTs7Z0JBQWpCLFNBQWlCLENBQUM7Z0JBRWxCLFdBQU0sbUJBQVksRUFBRyxFQUFBOztnQkFBckIsU0FBcUIsQ0FBQztnQkFDdEIsV0FBTSxpQkFBVSxFQUFHLEVBQUE7O2dCQUFuQixTQUFtQixDQUFDO2dCQUNwQixXQUFNLCtCQUFlLEVBQUcsRUFBQTs7Z0JBQXhCLFNBQXdCLENBQUM7Z0JBQ3pCLFdBQU0sbUNBQW1CLEVBQUcsRUFBQTs7Z0JBQTVCLFNBQTRCLENBQUM7Z0JBQzdCLFdBQU0sK0JBQWdCLEVBQUcsRUFBQTs7Z0JBQXpCLFNBQXlCLENBQUM7Z0JBQzFCLFdBQU0scUJBQVcsRUFBRyxFQUFBOztnQkFBcEIsU0FBb0IsQ0FBQztnQkFFckIsV0FBTzt3QkFDSCxNQUFNLEVBQUUsR0FBRztxQkFDZCxFQUFBOzs7Z0JBRUQsV0FBTzt3QkFDSCxNQUFNLEVBQUUsR0FBRztxQkFDZCxFQUFBOzs7O0tBRVIsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIGNsb3VkIGZyb20gJ3d4LXNlcnZlci1zZGsnO1xuaW1wb3J0IHsgb3ZlcnRpbWVUcmlwLCBhbG1vc3RPdmVyLCBhdXRvVHJpcCB9IGZyb20gJy4vdHJpcCc7XG5pbXBvcnQgeyBjYXRjaExvc3RPcmRlcnMsIHJlbW92ZVVzZWxlc3NPcmRlcnMgfSBmcm9tICcuL3Nob3BwaW5nLWxpc3QnO1xuaW1wb3J0IHsgb3ZlcnRpbWUsIHBheWVkRml4LCBwcmljZUZpeCwgcGF5TGFzdEZpeCwgcHVzaE5ldywgcHVzaExhc3RQYXkgfSBmcm9tICcuL29yZGVyJztcbmltcG9ydCB7IGNsZWFyU2hhcmVSZWNvcmQgfSBmcm9tICcuL3NoYXJlLXJlY29yZCc7XG5pbXBvcnQgeyB1c2VyR2V0RXhwIH0gZnJvbSAnLi9wdXNoLXRpbWVyJztcbmltcG9ydCB7IGxhc3REYXlEYXRhIH0gZnJvbSAnLi9hbmFseXplJztcblxuLy8gY2xvdWQuaW5pdCh7XG4vLyAgICAgZW52OiBwcm9jZXNzLmVudi5jbG91ZFxuLy8gfSk7XG5cbmNvbnN0IGRiOiBEQi5EYXRhYmFzZSA9IGNsb3VkLmRhdGFiYXNlKCApO1xuY29uc3QgXyA9IGRiLmNvbW1hbmQ7XG5cbi8qKiBcbiAqIOWumuaXtuWZqOaooeWdl1xuICovXG5leHBvcnQgY29uc3QgbWFpbiA9IGFzeW5jICggZXZlbnQsIGNvbnRleHQgKSA9PiB7XG4gICAgdHJ5IHtcbiAgICAgICAgXG4gICAgICAgIGF3YWl0IGF1dG9UcmlwKCApO1xuICAgICAgICBhd2FpdCB1c2VyR2V0RXhwKCApO1xuICAgICAgICBhd2FpdCBwdXNoTmV3KCApO1xuICAgICAgICBhd2FpdCBwdXNoTGFzdFBheSggKTtcbiAgICAgICAgYXdhaXQgb3ZlcnRpbWUoICk7XG4gICAgICAgIGF3YWl0IHBheWVkRml4KCApO1xuICAgICAgICBhd2FpdCBwcmljZUZpeCggKTtcbiAgICAgICAgLy8gYXdhaXQgcGF5TGFzdEZpeCggKTtcbiAgICAgICAgYXdhaXQgb3ZlcnRpbWVUcmlwKCApO1xuICAgICAgICBhd2FpdCBhbG1vc3RPdmVyKCApO1xuICAgICAgICBhd2FpdCBjYXRjaExvc3RPcmRlcnMoICk7XG4gICAgICAgIGF3YWl0IHJlbW92ZVVzZWxlc3NPcmRlcnMoICk7XG4gICAgICAgIGF3YWl0IGNsZWFyU2hhcmVSZWNvcmQoICk7XG4gICAgICAgIGF3YWl0IGxhc3REYXlEYXRhKCApO1xuICAgICAgICBcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHN0YXR1czogMjAwXG4gICAgICAgIH1cbiAgICB9IGNhdGNoICggZSApIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHN0YXR1czogNTAwXG4gICAgICAgIH1cbiAgICB9XG59Il19