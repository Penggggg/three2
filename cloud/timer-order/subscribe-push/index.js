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
var CONFIG = require("./config");
exports.subscribePush = function (data) { return __awaiter(void 0, void 0, void 0, function () {
    var type, texts, openid, page, template_1, textData_1, subscribeData, send$, e_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                type = data.type, texts = data.texts, openid = data.openid;
                page = data.page || 'pages/trip-enter/index';
                template_1 = CONFIG.subscribe_templates[type];
                textData_1 = {};
                texts.map(function (text, k) {
                    var _a;
                    textData_1 = __assign(__assign({}, textData_1), (_a = {}, _a[template_1.textKeys[k]] = {
                        value: text
                    }, _a));
                });
                subscribeData = {
                    page: page,
                    data: textData_1,
                    touser: openid,
                    templateId: template_1.id
                };
                console.log('==== 订阅推送 定时器 ====', subscribeData);
                return [4, cloud.openapi.subscribeMessage.send(subscribeData)];
            case 1:
                send$ = _a.sent();
                console.log('==== 订阅推送 定时器 ====', send$);
                return [3, 3];
            case 2:
                e_1 = _a.sent();
                return [3, 3];
            case 3: return [2];
        }
    });
}); };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEscUNBQXVDO0FBQ3ZDLGlDQUFtQztBQUV0QixRQUFBLGFBQWEsR0FBRyxVQUFNLElBQUk7Ozs7OztnQkFFdkIsSUFBSSxHQUFvQixJQUFJLEtBQXhCLEVBQUUsS0FBSyxHQUFhLElBQUksTUFBakIsRUFBRSxNQUFNLEdBQUssSUFBSSxPQUFULENBQVU7Z0JBQy9CLElBQUksR0FBRyxJQUFJLENBQUMsSUFBSSxJQUFJLHdCQUF3QixDQUFDO2dCQUM3QyxhQUFXLE1BQU0sQ0FBQyxtQkFBbUIsQ0FBRSxJQUFJLENBQUUsQ0FBQztnQkFFaEQsYUFBVyxFQUFHLENBQUM7Z0JBQ25CLEtBQUssQ0FBQyxHQUFHLENBQUMsVUFBRSxJQUFJLEVBQUUsQ0FBQzs7b0JBQ2YsVUFBUSx5QkFDRCxVQUFRLGdCQUNULFVBQVEsQ0FBQyxRQUFRLENBQUUsQ0FBQyxDQUFFLElBQUc7d0JBQ3ZCLEtBQUssRUFBRSxJQUFJO3FCQUNkLE1BQ0osQ0FBQztnQkFDTixDQUFDLENBQUMsQ0FBQztnQkFFRyxhQUFhLEdBQUc7b0JBQ2xCLElBQUksTUFBQTtvQkFDSixJQUFJLEVBQUUsVUFBUTtvQkFDZCxNQUFNLEVBQUUsTUFBTTtvQkFDZCxVQUFVLEVBQUUsVUFBUSxDQUFDLEVBQUU7aUJBQzFCLENBQUM7Z0JBRUYsT0FBTyxDQUFDLEdBQUcsQ0FBQyxvQkFBb0IsRUFBRSxhQUFhLENBQUUsQ0FBQztnQkFDcEMsV0FBTSxLQUFLLENBQUMsT0FBTyxDQUFDLGdCQUFnQixDQUFDLElBQUksQ0FBRSxhQUFhLENBQUUsRUFBQTs7Z0JBQWxFLEtBQUssR0FBRyxTQUEwRDtnQkFDeEUsT0FBTyxDQUFDLEdBQUcsQ0FBQyxvQkFBb0IsRUFBRSxLQUFLLENBQUUsQ0FBQzs7Ozs7Ozs7S0FFakQsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIGNsb3VkIGZyb20gJ3d4LXNlcnZlci1zZGsnO1xuaW1wb3J0ICogYXMgQ09ORklHIGZyb20gJy4vY29uZmlnJztcblxuZXhwb3J0IGNvbnN0IHN1YnNjcmliZVB1c2ggPSBhc3luYyBkYXRhID0+IHtcbiAgICB0cnkge1xuICAgICAgICBjb25zdCB7IHR5cGUsIHRleHRzLCBvcGVuaWQgfSA9IGRhdGE7XG4gICAgICAgIGNvbnN0IHBhZ2UgPSBkYXRhLnBhZ2UgfHwgJ3BhZ2VzL3RyaXAtZW50ZXIvaW5kZXgnO1xuICAgICAgICBjb25zdCB0ZW1wbGF0ZSA9IENPTkZJRy5zdWJzY3JpYmVfdGVtcGxhdGVzWyB0eXBlIF07XG4gICAgXG4gICAgICAgIGxldCB0ZXh0RGF0YSA9IHsgfTtcbiAgICAgICAgdGV4dHMubWFwKCggdGV4dCwgayApID0+IHtcbiAgICAgICAgICAgIHRleHREYXRhID0ge1xuICAgICAgICAgICAgICAgIC4uLnRleHREYXRhLFxuICAgICAgICAgICAgICAgIFsgdGVtcGxhdGUudGV4dEtleXNbIGsgXV06IHtcbiAgICAgICAgICAgICAgICAgICAgdmFsdWU6IHRleHRcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9O1xuICAgICAgICB9KTtcbiAgICBcbiAgICAgICAgY29uc3Qgc3Vic2NyaWJlRGF0YSA9IHtcbiAgICAgICAgICAgIHBhZ2UsXG4gICAgICAgICAgICBkYXRhOiB0ZXh0RGF0YSxcbiAgICAgICAgICAgIHRvdXNlcjogb3BlbmlkLFxuICAgICAgICAgICAgdGVtcGxhdGVJZDogdGVtcGxhdGUuaWRcbiAgICAgICAgfTtcbiAgICBcbiAgICAgICAgY29uc29sZS5sb2coJz09PT0g6K6i6ZiF5o6o6YCBIOWumuaXtuWZqCA9PT09Jywgc3Vic2NyaWJlRGF0YSApO1xuICAgICAgICBjb25zdCBzZW5kJCA9IGF3YWl0IGNsb3VkLm9wZW5hcGkuc3Vic2NyaWJlTWVzc2FnZS5zZW5kKCBzdWJzY3JpYmVEYXRhICk7XG4gICAgICAgIGNvbnNvbGUubG9nKCc9PT09IOiuoumYheaOqOmAgSDlrprml7blmaggPT09PScsIHNlbmQkICk7XG4gICAgfSBjYXRjaCAoIGUgKSB7IH1cbn07Il19