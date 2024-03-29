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
var create$ = function (openid, data, db, ctx) { return __awaiter(void 0, void 0, void 0, function () {
    var create$_1, e_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4, db.collection('address')
                        .add({
                        data: Object.assign({}, data, {
                            openid: openid
                        })
                    })];
            case 1:
                create$_1 = _a.sent();
                return [2, {
                        status: 200,
                        data: create$_1
                    }];
            case 2:
                e_1 = _a.sent();
                return [2, ctx.body = { status: 500, message: e_1 }];
            case 3: return [2];
        }
    });
}); };
exports.create$ = create$;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLElBQU0sT0FBTyxHQUFHLFVBQU8sTUFBTSxFQUFFLElBQUksRUFBRSxFQUFlLEVBQUUsR0FBRzs7Ozs7O2dCQUVqQyxXQUFNLEVBQUUsQ0FBQyxVQUFVLENBQUMsU0FBUyxDQUFDO3lCQUN6QyxHQUFHLENBQUM7d0JBQ0QsSUFBSSxFQUFFLE1BQU0sQ0FBQyxNQUFNLENBQUMsRUFBRyxFQUFFLElBQUksRUFBRTs0QkFDM0IsTUFBTSxRQUFBO3lCQUNULENBQUM7cUJBQ0wsQ0FBQyxFQUFBOztnQkFMQSxZQUFVLFNBS1Y7Z0JBRU4sV0FBTzt3QkFDSCxNQUFNLEVBQUUsR0FBRzt3QkFDWCxJQUFJLEVBQUUsU0FBTztxQkFDaEIsRUFBQTs7O2dCQUVELFdBQU8sR0FBRyxDQUFDLElBQUksR0FBRyxFQUFFLE1BQU0sRUFBRSxHQUFHLEVBQUUsT0FBTyxFQUFFLEdBQUMsRUFBRSxFQUFDOzs7O0tBRXJELENBQUE7QUFFUSwwQkFBTyIsInNvdXJjZXNDb250ZW50IjpbImNvbnN0IGNyZWF0ZSQgPSBhc3luYyggb3BlbmlkLCBkYXRhLCBkYjogREIuRGF0YWJhc2UsIGN0eCApID0+IHtcbiAgICB0cnkge1xuICAgICAgICBjb25zdCBjcmVhdGUkID0gYXdhaXQgZGIuY29sbGVjdGlvbignYWRkcmVzcycpXG4gICAgICAgICAgICAuYWRkKHtcbiAgICAgICAgICAgICAgICBkYXRhOiBPYmplY3QuYXNzaWduKHsgfSwgZGF0YSwge1xuICAgICAgICAgICAgICAgICAgICBvcGVuaWRcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHN0YXR1czogMjAwLFxuICAgICAgICAgICAgZGF0YTogY3JlYXRlJFxuICAgICAgICB9XG4gICAgfSBjYXRjaCAoIGUgKSB7XG4gICAgICAgIHJldHVybiBjdHguYm9keSA9IHsgc3RhdHVzOiA1MDAsIG1lc3NhZ2U6IGUgfTtcbiAgICB9XG59XG5cbmV4cG9ydCB7IGNyZWF0ZSQgfSJdfQ==