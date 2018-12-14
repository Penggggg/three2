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
    var openid, _id_1, standard_id, current_price, count, pid, e_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                openid = event.userInfo.openId;
                _id_1 = event._id, standard_id = event.standard_id, current_price = event.current_price, count = event.count, pid = event.pid;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFDQSxpQkF5REM7O0FBekRELHFDQUF1QztBQUV2QyxLQUFLLENBQUMsSUFBSSxFQUFFLENBQUM7QUFFYixJQUFNLEVBQUUsR0FBZ0IsS0FBSyxDQUFDLFFBQVEsRUFBRSxDQUFDO0FBb0I1QixRQUFBLElBQUksR0FBRyxVQUFPLEtBQUssRUFBRSxPQUFPOzs7Ozs7Z0JBSTNCLE1BQU0sR0FBRyxLQUFLLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQztnQkFDN0IsUUFBZ0QsS0FBSyxJQUFsRCxFQUFFLFdBQVcsR0FBZ0MsS0FBSyxZQUFyQyxFQUFFLGFBQWEsR0FBaUIsS0FBSyxjQUF0QixFQUFFLEtBQUssR0FBVSxLQUFLLE1BQWYsRUFBRSxHQUFHLEdBQUssS0FBSyxJQUFWLENBQVc7Z0JBRTlELFdBQU0sRUFBRSxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUMsQ0FBQyxHQUFHLENBQUUsS0FBRyxDQUFFO3lCQUM3QixHQUFHLENBQUM7d0JBQ0QsSUFBSSxFQUFFOzRCQUNGLEdBQUcsS0FBQTs0QkFDSCxLQUFLLE9BQUE7NEJBQ0wsTUFBTSxRQUFBOzRCQUNOLFdBQVcsYUFBQTs0QkFDWCxhQUFhLGVBQUE7eUJBQ2hCO3FCQUNKLENBQUMsRUFBQTs7Z0JBVFYsU0FTVSxDQUFDO2dCQUVYLFdBQU8sSUFBSSxPQUFPLENBQUUsVUFBQSxPQUFPO3dCQUN2QixPQUFPLENBQUM7NEJBQ0osR0FBRyxPQUFBOzRCQUNILE1BQU0sRUFBRSxHQUFHO3lCQUNkLENBQUMsQ0FBQztvQkFDUCxDQUFDLENBQUMsRUFBQzs7O2dCQUVILFdBQU8sSUFBSSxPQUFPLENBQUUsVUFBQSxPQUFPO3dCQUN2QixPQUFPLENBQUM7NEJBQ0osTUFBTSxFQUFFLEdBQUc7NEJBQ1gsSUFBSSxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUUsR0FBQyxDQUFFO3lCQUM1QixDQUFDLENBQUM7b0JBQ1AsQ0FBQyxDQUFDLEVBQUM7Ozs7S0FHVixDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiLy8g5LqR5Ye95pWw5YWl5Y+j5paH5Lu2XG5pbXBvcnQgKiBhcyBjbG91ZCBmcm9tICd3eC1zZXJ2ZXItc2RrJztcblxuY2xvdWQuaW5pdCgpO1xuXG5jb25zdCBkYjogREIuRGF0YWJhc2UgPSBjbG91ZC5kYXRhYmFzZSgpO1xuXG5cbi8qKlxuICog6LSt54mp6L2m5pu05pawc2t177yM6L+e5ZCM5Y+v6IO95Y+Y5pu055qEc3RhbmRhcmRzX2lk5LiA6LW35pu05pawXG4gKiAhIOWkh+azqO+8mueUseS6juW8gOWPkeaXtu+8jOS6keW8gOWPkeeahGRvYy51cGRhdGXmnIlidWfvvIxzdGFuZGFyZF9pZOaXoOazleabtOaWsOS4uiBudWxs44CBJyfjgIEw77yb5Zug5q2k5pu05paw56ym5o2i55SoIC5zZXRcbiAqIHJlcToge1xuICogICAgICBfaWRcbiAqICAgICAgb3BlbmlkXG4gKiAgICAgIHBpZDog5ZWG5ZOBaWRcbiAqICAgICAgY291bnQ6IOmAiei0reaVsOmHj1xuICogICAgICBzdGFuZGFyZF9pZDog5Z6L5Y+3aWRcbiAqICAgICAgY3VycmVudF9wcmljZTog5b2T5pe255qE5Lu35qC8XG4gKiB9XG4gKiBcbiAqIHJlczoge1xuICogICAgICBzdGF0dXM6IDIwMC81MDBcbiAqICAgICAgZGF0YTog6LSt54mp6L2maWRcbiAqIH1cbiAqL1xuZXhwb3J0IGNvbnN0IG1haW4gPSBhc3luYyAoZXZlbnQsIGNvbnRleHQpID0+IHtcblxuICAgIHRyeSB7XG5cbiAgICAgICAgY29uc3Qgb3BlbmlkID0gZXZlbnQudXNlckluZm8ub3BlbklkO1xuICAgICAgICBjb25zdCB7IF9pZCwgc3RhbmRhcmRfaWQsIGN1cnJlbnRfcHJpY2UsIGNvdW50LCBwaWQgfSA9IGV2ZW50O1xuXG4gICAgICAgIGF3YWl0IGRiLmNvbGxlY3Rpb24oJ2NhcnQnKS5kb2MoIF9pZCApXG4gICAgICAgICAgICAgICAgLnNldCh7XG4gICAgICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHBpZCxcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvdW50LFxuICAgICAgICAgICAgICAgICAgICAgICAgb3BlbmlkLFxuICAgICAgICAgICAgICAgICAgICAgICAgc3RhbmRhcmRfaWQsXG4gICAgICAgICAgICAgICAgICAgICAgICBjdXJyZW50X3ByaWNlXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKCByZXNvbHZlID0+IHtcbiAgICAgICAgICAgIHJlc29sdmUoe1xuICAgICAgICAgICAgICAgIF9pZCxcbiAgICAgICAgICAgICAgICBzdGF0dXM6IDIwMFxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH0gY2F0Y2goIGUgKSB7XG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSggcmVzb2x2ZSA9PiB7XG4gICAgICAgICAgICByZXNvbHZlKHtcbiAgICAgICAgICAgICAgICBzdGF0dXM6IDUwMCxcbiAgICAgICAgICAgICAgICBkYXRhOiBKU09OLnN0cmluZ2lmeSggZSApXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG59Il19