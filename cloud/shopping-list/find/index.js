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
var find$ = function (data, db, ctx) { return __awaiter(void 0, void 0, void 0, function () {
    var filterData_1, data$, e_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                filterData_1 = {};
                Object.keys(data).map(function (dataKey) {
                    if (!!data[dataKey]) {
                        filterData_1[dataKey] = data[dataKey];
                    }
                });
                return [4, db.collection('shopping-list')
                        .where(filterData_1)
                        .get()];
            case 1:
                data$ = _a.sent();
                return [2, {
                        status: 200,
                        data: data$.data
                    }];
            case 2:
                e_1 = _a.sent();
                return [2, ctx.body = { status: 500, message: e_1 }];
            case 3: return [2];
        }
    });
}); };
exports.find$ = find$;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUdBLElBQU0sS0FBSyxHQUFHLFVBQU8sSUFBb0UsRUFBRSxFQUFlLEVBQUUsR0FBRzs7Ozs7O2dCQUduRyxlQUFhLEVBQUcsQ0FBQztnQkFDckIsTUFBTSxDQUFDLElBQUksQ0FBRSxJQUFJLENBQUUsQ0FBQyxHQUFHLENBQUUsVUFBQSxPQUFPO29CQUM1QixJQUFLLENBQUMsQ0FBQyxJQUFJLENBQUUsT0FBTyxDQUFFLEVBQUU7d0JBQ3BCLFlBQVUsQ0FBRSxPQUFPLENBQUUsR0FBRyxJQUFJLENBQUUsT0FBTyxDQUFFLENBQUM7cUJBQzNDO2dCQUNMLENBQUMsQ0FBQyxDQUFDO2dCQUVXLFdBQU0sRUFBRSxDQUFDLFVBQVUsQ0FBQyxlQUFlLENBQUM7eUJBQzdDLEtBQUssQ0FBRSxZQUFVLENBQUU7eUJBQ25CLEdBQUcsRUFBRyxFQUFBOztnQkFGTCxLQUFLLEdBQUcsU0FFSDtnQkFFWCxXQUFPO3dCQUNILE1BQU0sRUFBRSxHQUFHO3dCQUNYLElBQUksRUFBRSxLQUFLLENBQUMsSUFBSTtxQkFDbkIsRUFBQTs7O2dCQUdELFdBQU8sR0FBRyxDQUFDLElBQUksR0FBRyxFQUFFLE1BQU0sRUFBRSxHQUFHLEVBQUUsT0FBTyxFQUFFLEdBQUMsRUFBRSxFQUFDOzs7O0tBRXJELENBQUE7QUFFUSxzQkFBSyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQHBhcmFtIFxuICovXG5jb25zdCBmaW5kJCA9IGFzeW5jKCBkYXRhOiB7IHRpZD86IHN0cmluZywgcGlkPzogc3RyaW5nLCBzaWQ/OiBzdHJpbmcsIGJ1eV9zdGF0dXM/OiBhbnkgfSwgZGI6IERCLkRhdGFiYXNlLCBjdHggKSA9PiB7XG4gICAgdHJ5IHtcbiAgICAgICAgXG4gICAgICAgIGxldCBmaWx0ZXJEYXRhID0geyB9O1xuICAgICAgICBPYmplY3Qua2V5cyggZGF0YSApLm1hcCggZGF0YUtleSA9PiB7XG4gICAgICAgICAgICBpZiAoICEhZGF0YVsgZGF0YUtleSBdKSB7XG4gICAgICAgICAgICAgICAgZmlsdGVyRGF0YVsgZGF0YUtleSBdID0gZGF0YVsgZGF0YUtleSBdO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICBjb25zdCBkYXRhJCA9IGF3YWl0IGRiLmNvbGxlY3Rpb24oJ3Nob3BwaW5nLWxpc3QnKVxuICAgICAgICAgICAgLndoZXJlKCBmaWx0ZXJEYXRhIClcbiAgICAgICAgICAgIC5nZXQoICk7XG4gICAgICAgICAgICBcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHN0YXR1czogMjAwLFxuICAgICAgICAgICAgZGF0YTogZGF0YSQuZGF0YVxuICAgICAgICB9XG5cbiAgICB9IGNhdGNoICggZSApIHtcbiAgICAgICAgcmV0dXJuIGN0eC5ib2R5ID0geyBzdGF0dXM6IDUwMCwgbWVzc2FnZTogZSB9O1xuICAgIH1cbn1cblxuZXhwb3J0IHsgZmluZCQgfSJdfQ==