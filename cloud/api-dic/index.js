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
cloud.init();
var db = cloud.database();
exports.main = function (event, context) { return __awaiter(_this, void 0, void 0, function () {
    var dbRes, result;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4, db.collection('dic')
                    .where({
                    belong: db.RegExp({
                        regexp: event.dicName.replace(/\,/g, '|'),
                        optiond: 'i'
                    })
                })
                    .get()];
            case 1:
                dbRes = _a.sent();
                result = {};
                dbRes.data.map(function (dic) {
                    var _a;
                    result = Object.assign({}, result, (_a = {},
                        _a[dic.belong] = dic[dic.belong],
                        _a));
                });
                return [2, new Promise(function (resolve) {
                        resolve(__assign({}, result));
                    })];
        }
    });
}); };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUNBLGlCQXFDQzs7QUFyQ0QscUNBQXVDO0FBRXZDLEtBQUssQ0FBQyxJQUFJLEVBQUUsQ0FBQztBQUViLElBQU0sRUFBRSxHQUFnQixLQUFLLENBQUMsUUFBUSxFQUFFLENBQUM7QUFTNUIsUUFBQSxJQUFJLEdBQUcsVUFBTyxLQUFLLEVBQUUsT0FBTzs7OztvQkFFekIsV0FBTSxFQUFFLENBQUMsVUFBVSxDQUFDLEtBQUssQ0FBQztxQkFDckMsS0FBSyxDQUFDO29CQUNMLE1BQU0sRUFBRSxFQUFFLENBQUMsTUFBTSxDQUFDO3dCQUNoQixNQUFNLEVBQUUsS0FBSyxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsS0FBSyxFQUFFLEdBQUcsQ0FBQzt3QkFDekMsT0FBTyxFQUFFLEdBQUc7cUJBQ2IsQ0FBQztpQkFDSCxDQUFDO3FCQUNELEdBQUcsRUFBRyxFQUFBOztnQkFQSCxLQUFLLEdBQUcsU0FPTDtnQkFFTCxNQUFNLEdBQUcsRUFBRyxDQUFDO2dCQUNqQixLQUFLLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBRSxVQUFBLEdBQUc7O29CQUNqQixNQUFNLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQyxFQUFHLEVBQUUsTUFBTTt3QkFDaEMsR0FBRSxHQUFHLENBQUMsTUFBTSxJQUFJLEdBQUcsQ0FBRSxHQUFHLENBQUMsTUFBTSxDQUFFOzRCQUNqQyxDQUFDO2dCQUNMLENBQUMsQ0FBQyxDQUFDO2dCQUVILFdBQU8sSUFBSSxPQUFPLENBQUUsVUFBQSxPQUFPO3dCQUN6QixPQUFPLGNBQ0YsTUFBTSxFQUNULENBQUM7b0JBQ0wsQ0FBQyxDQUFDLEVBQUM7OztLQUVKLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyIvLyDkupHlh73mlbDlhaXlj6Pmlofku7ZcbmltcG9ydCAqIGFzIGNsb3VkIGZyb20gJ3d4LXNlcnZlci1zZGsnO1xuXG5jbG91ZC5pbml0KCk7XG5cbmNvbnN0IGRiOiBEQi5EYXRhYmFzZSA9IGNsb3VkLmRhdGFiYXNlKCk7XG5cbi8vIOS6keWHveaVsOWFpeWPo+WHveaVsFxuLy8g6I635Y+W5pWw5o2u5a2X5YW45YC8XG4vKipcbiAqIGRhdGE6IHtcbiAgICAgZGljTmFtZTogJ2dvb2RzX2NhdGVnb3J5LHh4eCcsXG4gICB9LFxuICovXG5leHBvcnQgY29uc3QgbWFpbiA9IGFzeW5jIChldmVudCwgY29udGV4dCkgPT4ge1xuXG4gIGNvbnN0IGRiUmVzID0gYXdhaXQgZGIuY29sbGVjdGlvbignZGljJylcbiAgICAud2hlcmUoe1xuICAgICAgYmVsb25nOiBkYi5SZWdFeHAoe1xuICAgICAgICByZWdleHA6IGV2ZW50LmRpY05hbWUucmVwbGFjZSgvXFwsL2csICd8JyksXG4gICAgICAgIG9wdGlvbmQ6ICdpJ1xuICAgICAgfSlcbiAgICB9KVxuICAgIC5nZXQoICk7XG5cbiAgbGV0IHJlc3VsdCA9IHsgfTtcbiAgZGJSZXMuZGF0YS5tYXAoIGRpYyA9PiB7XG4gICAgcmVzdWx0ID0gT2JqZWN0LmFzc2lnbih7IH0sIHJlc3VsdCwge1xuICAgICAgWyBkaWMuYmVsb25nIF06IGRpY1sgZGljLmJlbG9uZyBdXG4gICAgfSk7XG4gIH0pO1xuXG4gIHJldHVybiBuZXcgUHJvbWlzZSggcmVzb2x2ZSA9PiB7XG4gICAgcmVzb2x2ZSh7XG4gICAgICAuLi5yZXN1bHRcbiAgICB9KTtcbiAgfSk7XG5cbn0iXX0=