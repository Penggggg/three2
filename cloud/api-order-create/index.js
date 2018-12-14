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
cloud.init();
var db = cloud.database();
exports.main = function (event, context) { return __awaiter(_this, void 0, void 0, function () {
    var _this = this;
    return __generator(this, function (_a) {
        return [2, new Promise(function (resolve) { return __awaiter(_this, void 0, void 0, function () {
                var trips$, trip, e_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            return [4, cloud.callFunction({
                                    data: {},
                                    name: 'api-trip-enter'
                                })];
                        case 1:
                            trips$ = _a.sent();
                            if (trips$.result.status !== 200 || !trips$.result.data || !trips$.result.data[0]) {
                                return [2, resolve({
                                        status: 400,
                                        message: "\u6CA1\u6709\u6700\u65B0\u884C\u7A0B\uFF0C\u6682\u65F6\u65E0\u6CD5\u7ED3\u7B97\uFF01"
                                    })];
                            }
                            trip = trips$.result.data[0];
                            return [2, resolve({
                                    status: 200,
                                    data: trip
                                })];
                        case 2:
                            e_1 = _a.sent();
                            return [2, resolve({
                                    status: 500,
                                    message: e_1
                                })];
                        case 3: return [2];
                    }
                });
            }); })];
    });
}); };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFDQSxpQkF1RkM7O0FBdkZELHFDQUF1QztBQUV2QyxLQUFLLENBQUMsSUFBSSxFQUFHLENBQUM7QUFFZCxJQUFNLEVBQUUsR0FBZ0IsS0FBSyxDQUFDLFFBQVEsRUFBRyxDQUFDO0FBb0Q3QixRQUFBLElBQUksR0FBRyxVQUFRLEtBQUssRUFBRSxPQUFPOzs7UUFDdEMsV0FBTyxJQUFJLE9BQU8sQ0FBRSxVQUFNLE9BQU87Ozs7Ozs0QkFHVixXQUFNLEtBQUssQ0FBQyxZQUFZLENBQUM7b0NBQ3BDLElBQUksRUFBRSxFQUFHO29DQUNULElBQUksRUFBRSxnQkFBZ0I7aUNBQ3pCLENBQUMsRUFBQTs7NEJBSEksTUFBTSxHQUFHLFNBR2I7NEJBRUYsSUFBSyxNQUFNLENBQUMsTUFBTSxDQUFDLE1BQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLElBQUksSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFFLENBQUMsQ0FBRSxFQUFFO2dDQUNsRixXQUFPLE9BQU8sQ0FBQzt3Q0FDWCxNQUFNLEVBQUUsR0FBRzt3Q0FDWCxPQUFPLEVBQUUsc0ZBQWdCO3FDQUM1QixDQUFDLEVBQUM7NkJBQ047NEJBRUssSUFBSSxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFFLENBQUMsQ0FBRSxDQUFDOzRCQUVyQyxXQUFPLE9BQU8sQ0FBQztvQ0FDWCxNQUFNLEVBQUUsR0FBRztvQ0FDWCxJQUFJLEVBQUUsSUFBSTtpQ0FDYixDQUFDLEVBQUM7Ozs0QkFHSCxXQUFPLE9BQU8sQ0FBQztvQ0FDWCxNQUFNLEVBQUUsR0FBRztvQ0FDWCxPQUFPLEVBQUUsR0FBQztpQ0FDYixDQUFDLEVBQUM7Ozs7aUJBRVYsQ0FBQyxFQUFDOztLQUVOLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyIvLyDkupHlh73mlbDlhaXlj6Pmlofku7ZcbmltcG9ydCAqIGFzIGNsb3VkIGZyb20gJ3d4LXNlcnZlci1zZGsnO1xuXG5jbG91ZC5pbml0KCApO1xuXG5jb25zdCBkYjogREIuRGF0YWJhc2UgPSBjbG91ZC5kYXRhYmFzZSggKTtcblxuLyoqXG4gKiBAZGVzY3JpcHRpb24g5om56YeP5Yib5bu66K6i5Y2VXG4gKiAtLS0tLS0tLSDlrZfmrrUgLS0tLS0tLS0tLVxuICogX2lkXG4gKiBvcGVuaWQsXG4gKiBjcmVhdGV0aW1lXG4gKiB0aWQsXG4gKiBwaWQsXG4gKiBzaWQsXG4gKiBjb3VudCxcbiAqIHByaWNlLFxuICogdHlwZTogJ2N1c3RvbScgfCAnbm9ybWFsJyDoh6rlrprkuYnliqDljZXjgIHmma7pgJrliqDljZVcbiAqIGltZzogQXJyYXlbIHN0cmluZyBdXG4gKiBkZXNjLFxuICogYWRkcmVzc2lkXG4gICAgICAgICogdXNlcm5hbWUsIOaUtui0p+S6ulxuICAgICAgICAqIHBvc3RhbGNvZGUsIOmCruaUv1xuICAgICAgICAqIHBob25lLCDmlLbojrfnlLXor51cbiAgICAgICAgKiBhZGRyZXNzLCDmlLbojrflnLDlnYBcbiAqIGJhc2Vfc3RhdHVzOiAwLDEsMiwzIOWHhuWkh+S4re+8jOi/m+ihjOS4re+8jOW3suiwg+aVtO+8jOW3sue7k+eul1xuICogcGF5X3N0YXR1czogMCwxLDIg5pyq5LuY5qy+77yM5bey5LuY6K6i6YeR77yM5bey5LuY5YWo5qy+XG4gKiBkZWxpdmVyX3N0YXR1czogMCwxIOacquWPkeW4g++8jOW3suWPkeW4g+OAgVxuICogXG4gKiAtLS0tLS0tLSDor7fmsYIgLS0tLS0tLS0tLVxuICoge1xuICogICAgICBmcm9tOiAnY2FydCcgfCAnYnV5JyB8ICdjdXN0b20nIHwgJ2FnZW50cydcbiAqICAgICAgZGF0YTogQXJyYXk8e1xuICogICAgICAgICAgc2lkXG4gKiAgICAgICAgICBwaWRcbiAqICAgICAgICAgIHByaWNlXG4gKiAgICAgICAgICBjb3VudFxuICogICAgICAgICAgZGVzY1xuICogICAgICAgICAgaW1nXG4gKiAgICAgICAgICB0eXBlXG4gKiAgICAgICAgICBhZGRyZXNzOiB7XG4gKiAgICAgICAgICAgICAgbmFtZSxcbiAqICAgICAgICAgICAgICBwaG9uZSxcbiAqICAgICAgICAgICAgICBkZXRhaWwsXG4gKiAgICAgICAgICAgICAgcG9zdGFsY29kZVxuICogICAgICAgICAgfVxuICogICAgICB9PlxuICogfVxuICogLS0tLS0tLS0tLSDov5Tlm54gLS0tLS0tLS1cbiAqIHtcbiAqICAgICAgc3RhdHVzXG4gKiB9XG4gKiBAZGVzY3JpcHRpb25cbiAqICEg5YWI5Yik5pat5pyJ5rKh5pyJ5Y+v55So6KGM56iL44CCXG4gKiAhIOWcsOWdgOeuoeeQhu+8jOWFiOWvueavlOeUqOaXp+WcsOWdgGlk5oiW5paw5bu655qE5Zyw5Z2AaWRcbiAqL1xuZXhwb3J0IGNvbnN0IG1haW4gPSBhc3luYyAoIGV2ZW50LCBjb250ZXh0ICkgPT4ge1xuICAgIHJldHVybiBuZXcgUHJvbWlzZSggYXN5bmMgcmVzb2x2ZSA9PiB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGNvbnN0IHRyaXBzJCA9IGF3YWl0IGNsb3VkLmNhbGxGdW5jdGlvbih7XG4gICAgICAgICAgICAgICAgZGF0YTogeyB9LFxuICAgICAgICAgICAgICAgIG5hbWU6ICdhcGktdHJpcC1lbnRlcidcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBpZiAoIHRyaXBzJC5yZXN1bHQuc3RhdHVzICE9PSAyMDAgfHwgIXRyaXBzJC5yZXN1bHQuZGF0YSB8fCAhdHJpcHMkLnJlc3VsdC5kYXRhWyAwIF0pIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVzb2x2ZSh7XG4gICAgICAgICAgICAgICAgICAgIHN0YXR1czogNDAwLFxuICAgICAgICAgICAgICAgICAgICBtZXNzYWdlOiBg5rKh5pyJ5pyA5paw6KGM56iL77yM5pqC5pe25peg5rOV57uT566X77yBYFxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBjb25zdCB0cmlwID0gdHJpcHMkLnJlc3VsdC5kYXRhWyAwIF07XG5cbiAgICAgICAgICAgIHJldHVybiByZXNvbHZlKHtcbiAgICAgICAgICAgICAgICBzdGF0dXM6IDIwMCxcbiAgICAgICAgICAgICAgICBkYXRhOiB0cmlwXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICB9IGNhdGNoICggZSApIHtcbiAgICAgICAgICAgIHJldHVybiByZXNvbHZlKHtcbiAgICAgICAgICAgICAgICBzdGF0dXM6IDUwMCxcbiAgICAgICAgICAgICAgICBtZXNzYWdlOiBlXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH0pO1xuXG59Il19