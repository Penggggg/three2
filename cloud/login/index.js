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
cloud.init({
    env: process.env.cloud
});
var db = cloud.database();
exports.main = function (event, context) { return __awaiter(void 0, void 0, void 0, function () {
    var openid, dbRes;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                openid = event.userInfo.openId;
                return [4, db.collection('manager-member')
                        .where({
                        openid: openid
                    })
                        .get()];
            case 1:
                dbRes = _a.sent();
                return [2, new Promise(function (resolve) {
                        resolve({
                            openid: openid,
                            role: dbRes.data.length > 0 ? 1 : 0
                        });
                    })];
        }
    });
}); };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUVBLHFDQUF1QztBQUV2QyxLQUFLLENBQUMsSUFBSSxDQUFDO0lBQ1QsR0FBRyxFQUFFLE9BQU8sQ0FBQyxHQUFHLENBQUMsS0FBSztDQUN2QixDQUFDLENBQUM7QUFFSCxJQUFNLEVBQUUsR0FBZ0IsS0FBSyxDQUFDLFFBQVEsRUFBRSxDQUFDO0FBTTVCLFFBQUEsSUFBSSxHQUFHLFVBQU8sS0FBSyxFQUFFLE9BQU87Ozs7O2dCQUVqQyxNQUFNLEdBQUcsS0FBSyxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUM7Z0JBQ3ZCLFdBQU0sRUFBRSxDQUFDLFVBQVUsQ0FBQyxnQkFBZ0IsQ0FBQzt5QkFDaEQsS0FBSyxDQUFDO3dCQUNMLE1BQU0sUUFBQTtxQkFDUCxDQUFDO3lCQUNELEdBQUcsRUFBRyxFQUFBOztnQkFKSCxLQUFLLEdBQUcsU0FJTDtnQkFFVCxXQUFPLElBQUksT0FBTyxDQUFFLFVBQUEsT0FBTzt3QkFDekIsT0FBTyxDQUFDOzRCQUNOLE1BQU0sUUFBQTs0QkFDTixJQUFJLEVBQUUsS0FBSyxDQUFDLElBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7eUJBQ3BDLENBQUMsQ0FBQztvQkFDTCxDQUFDLENBQUMsRUFBQzs7O0tBQ0osQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbIi8vIOS6keWHveaVsOWFpeWPo+aWh+S7tlxuLy8gY29uc3QgY2xvdWQgPSByZXF1aXJlKCd3eC1zZXJ2ZXItc2RrJyk7XG5pbXBvcnQgKiBhcyBjbG91ZCBmcm9tICd3eC1zZXJ2ZXItc2RrJztcblxuY2xvdWQuaW5pdCh7XG4gIGVudjogcHJvY2Vzcy5lbnYuY2xvdWRcbn0pO1xuXG5jb25zdCBkYjogREIuRGF0YWJhc2UgPSBjbG91ZC5kYXRhYmFzZSgpO1xuXG4vKiogXG4gKiDkupHlh73mlbDlhaXlj6Plh73mlbBcbiAqIOi/lOWbnm9wZW5pZOOAgeaYr+WQpueuoeeQhuWRmFxuICovXG5leHBvcnQgY29uc3QgbWFpbiA9IGFzeW5jIChldmVudCwgY29udGV4dCkgPT4ge1xuXG4gIGNvbnN0IG9wZW5pZCA9IGV2ZW50LnVzZXJJbmZvLm9wZW5JZDtcbiAgY29uc3QgZGJSZXMgPSBhd2FpdCBkYi5jb2xsZWN0aW9uKCdtYW5hZ2VyLW1lbWJlcicpXG4gICAgLndoZXJlKHtcbiAgICAgIG9wZW5pZFxuICAgIH0pXG4gICAgLmdldCggKTtcblxuICByZXR1cm4gbmV3IFByb21pc2UoIHJlc29sdmUgPT4ge1xuICAgIHJlc29sdmUoe1xuICAgICAgb3BlbmlkLFxuICAgICAgcm9sZTogZGJSZXMuZGF0YS5sZW5ndGggPiAwID8gMSA6IDBcbiAgICB9KTtcbiAgfSk7XG59Il19