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
    var openid, _id_1, standard_id, current_price, count, pid, data, e_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                openid = event.userInfo.openId;
                _id_1 = event._id, standard_id = event.standard_id, current_price = event.current_price, count = event.count, pid = event.pid;
                data = {};
                return [4, db.collection('cart').doc(_id_1)
                        .set({
                        data: {
                            pid: pid,
                            count: count,
                            openid: openid,
                            standard_id: standard_id,
                            current_price: current_price
                        }
                    })];
            case 1:
                _a.sent();
                return [2, new Promise(function (resolve) {
                        resolve({
                            _id: _id_1,
                            status: 200
                        });
                    })];
            case 2:
                e_1 = _a.sent();
                return [2, new Promise(function (resolve) {
                        resolve({
                            status: 500,
                            data: JSON.stringify(e_1)
                        });
                    })];
            case 3: return [2];
        }
    });
}); };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFDQSxpQkE2REM7O0FBN0RELHFDQUF1QztBQUV2QyxLQUFLLENBQUMsSUFBSSxFQUFFLENBQUM7QUFFYixJQUFNLEVBQUUsR0FBZ0IsS0FBSyxDQUFDLFFBQVEsRUFBRSxDQUFDO0FBb0I1QixRQUFBLElBQUksR0FBRyxVQUFPLEtBQUssRUFBRSxPQUFPOzs7Ozs7Z0JBSTNCLE1BQU0sR0FBRyxLQUFLLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQztnQkFDN0IsUUFBZ0QsS0FBSyxJQUFsRCxFQUFFLFdBQVcsR0FBZ0MsS0FBSyxZQUFyQyxFQUFFLGFBQWEsR0FBaUIsS0FBSyxjQUF0QixFQUFFLEtBQUssR0FBVSxLQUFLLE1BQWYsRUFBRSxHQUFHLEdBQUssS0FBSyxJQUFWLENBQVc7Z0JBRXhELElBQUksR0FBRyxFQUVaLENBQUE7Z0JBRUQsV0FBTSxFQUFFLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQyxDQUFDLEdBQUcsQ0FBRSxLQUFHLENBQUU7eUJBQzdCLEdBQUcsQ0FBQzt3QkFDRCxJQUFJLEVBQUU7NEJBQ0YsR0FBRyxLQUFBOzRCQUNILEtBQUssT0FBQTs0QkFDTCxNQUFNLFFBQUE7NEJBQ04sV0FBVyxhQUFBOzRCQUNYLGFBQWEsZUFBQTt5QkFDaEI7cUJBQ0osQ0FBQyxFQUFBOztnQkFUVixTQVNVLENBQUM7Z0JBRVgsV0FBTyxJQUFJLE9BQU8sQ0FBRSxVQUFBLE9BQU87d0JBQ3ZCLE9BQU8sQ0FBQzs0QkFDSixHQUFHLE9BQUE7NEJBQ0gsTUFBTSxFQUFFLEdBQUc7eUJBQ2QsQ0FBQyxDQUFDO29CQUNQLENBQUMsQ0FBQyxFQUFDOzs7Z0JBRUgsV0FBTyxJQUFJLE9BQU8sQ0FBRSxVQUFBLE9BQU87d0JBQ3ZCLE9BQU8sQ0FBQzs0QkFDSixNQUFNLEVBQUUsR0FBRzs0QkFDWCxJQUFJLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBRSxHQUFDLENBQUU7eUJBQzVCLENBQUMsQ0FBQztvQkFDUCxDQUFDLENBQUMsRUFBQzs7OztLQUdWLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyIvLyDkupHlh73mlbDlhaXlj6Pmlofku7ZcbmltcG9ydCAqIGFzIGNsb3VkIGZyb20gJ3d4LXNlcnZlci1zZGsnO1xuXG5jbG91ZC5pbml0KCk7XG5cbmNvbnN0IGRiOiBEQi5EYXRhYmFzZSA9IGNsb3VkLmRhdGFiYXNlKCk7XG5cblxuLyoqXG4gKiDotK3nianovabmm7TmlrBza3XvvIzov57lkIzlj6/og73lj5jmm7TnmoRzdGFuZGFyZHNfaWTkuIDotbfmm7TmlrBcbiAqICEg5aSH5rOo77ya55Sx5LqO5byA5Y+R5pe277yM5LqR5byA5Y+R55qEZG9jLnVwZGF0ZeaciWJ1Z++8jHN0YW5kYXJkX2lk5peg5rOV5pu05paw5Li6IG51bGzjgIEnJ+OAgTDvvJvlm6DmraTmm7TmlrDnrKbmjaLnlKggLnNldFxuICogcmVxOiB7XG4gKiAgICAgIF9pZFxuICogICAgICBvcGVuaWRcbiAqICAgICAgcGlkOiDllYblk4FpZFxuICogICAgICBjb3VudDog6YCJ6LSt5pWw6YePXG4gKiAgICAgIHN0YW5kYXJkX2lkOiDlnovlj7dpZFxuICogICAgICBjdXJyZW50X3ByaWNlOiDlvZPml7bnmoTku7fmoLxcbiAqIH1cbiAqIFxuICogcmVzOiB7XG4gKiAgICAgIHN0YXR1czogMjAwLzUwMFxuICogICAgICBkYXRhOiDotK3nianovaZpZFxuICogfVxuICovXG5leHBvcnQgY29uc3QgbWFpbiA9IGFzeW5jIChldmVudCwgY29udGV4dCkgPT4ge1xuXG4gICAgdHJ5IHtcblxuICAgICAgICBjb25zdCBvcGVuaWQgPSBldmVudC51c2VySW5mby5vcGVuSWQ7XG4gICAgICAgIGNvbnN0IHsgX2lkLCBzdGFuZGFyZF9pZCwgY3VycmVudF9wcmljZSwgY291bnQsIHBpZCB9ID0gZXZlbnQ7XG5cbiAgICAgICAgY29uc3QgZGF0YSA9IHtcbiAgICAgICAgICAgIFxuICAgICAgICB9XG5cbiAgICAgICAgYXdhaXQgZGIuY29sbGVjdGlvbignY2FydCcpLmRvYyggX2lkIClcbiAgICAgICAgICAgICAgICAuc2V0KHtcbiAgICAgICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgICAgICAgcGlkLFxuICAgICAgICAgICAgICAgICAgICAgICAgY291bnQsXG4gICAgICAgICAgICAgICAgICAgICAgICBvcGVuaWQsXG4gICAgICAgICAgICAgICAgICAgICAgICBzdGFuZGFyZF9pZCxcbiAgICAgICAgICAgICAgICAgICAgICAgIGN1cnJlbnRfcHJpY2VcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIFxuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoIHJlc29sdmUgPT4ge1xuICAgICAgICAgICAgcmVzb2x2ZSh7XG4gICAgICAgICAgICAgICAgX2lkLFxuICAgICAgICAgICAgICAgIHN0YXR1czogMjAwXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfSBjYXRjaCggZSApIHtcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKCByZXNvbHZlID0+IHtcbiAgICAgICAgICAgIHJlc29sdmUoe1xuICAgICAgICAgICAgICAgIHN0YXR1czogNTAwLFxuICAgICAgICAgICAgICAgIGRhdGE6IEpTT04uc3RyaW5naWZ5KCBlIClcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9XG5cbn0iXX0=