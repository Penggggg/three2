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
    var data$, metaList, standards_1, insertStandars_1, e_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                return [4, db.collection('goods')
                        .where({
                        _id: event._id
                    })
                        .get()];
            case 1:
                data$ = _a.sent();
                metaList = data$.data;
                return [4, Promise.all(metaList.map(function (x) {
                        return db.collection('standards')
                            .where({
                            pid: x._id
                        })
                            .get();
                    }))];
            case 2:
                standards_1 = _a.sent();
                insertStandars_1 = metaList.map(function (x, k) { return Object.assign({}, x, {
                    standards: standards_1[k].data
                }); });
                return [2, new Promise(function (resolve) {
                        resolve({
                            status: 200,
                            data: insertStandars_1[0]
                        });
                    })];
            case 3:
                e_1 = _a.sent();
                return [2, new Promise(function (resolve, reject) {
                        reject({
                            status: 500,
                            message: e_1
                        });
                    })];
            case 4: return [2];
        }
    });
}); };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFDQSxpQkF3REM7O0FBeERELHFDQUF1QztBQUV2QyxLQUFLLENBQUMsSUFBSSxFQUFFLENBQUM7QUFFYixJQUFNLEVBQUUsR0FBZ0IsS0FBSyxDQUFDLFFBQVEsRUFBRSxDQUFDO0FBYzVCLFFBQUEsSUFBSSxHQUFHLFVBQVEsS0FBSyxFQUFFLE9BQU87Ozs7OztnQkFJcEIsV0FBTSxFQUFFLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQzt5QkFDbkMsS0FBSyxDQUFDO3dCQUNILEdBQUcsRUFBRSxLQUFLLENBQUMsR0FBRztxQkFDakIsQ0FBQzt5QkFDRCxHQUFHLEVBQUcsRUFBQTs7Z0JBSlAsS0FBSyxHQUFHLFNBSUQ7Z0JBRVAsUUFBUSxHQUFHLEtBQUssQ0FBQyxJQUFJLENBQUM7Z0JBQ1YsV0FBTSxPQUFPLENBQUMsR0FBRyxDQUFFLFFBQVEsQ0FBQyxHQUFHLENBQUUsVUFBQSxDQUFDO3dCQUNoRCxPQUFPLEVBQUUsQ0FBQyxVQUFVLENBQUMsV0FBVyxDQUFDOzZCQUM1QixLQUFLLENBQUM7NEJBQ1AsR0FBRyxFQUFFLENBQUMsQ0FBQyxHQUFHO3lCQUNULENBQUM7NkJBQ0QsR0FBRyxFQUFHLENBQUM7b0JBQ2hCLENBQUMsQ0FBQyxDQUFDLEVBQUE7O2dCQU5HLGNBQVksU0FNZjtnQkFFRyxtQkFBaUIsUUFBUSxDQUFDLEdBQUcsQ0FBQyxVQUFFLENBQUMsRUFBRSxDQUFDLElBQU0sT0FBQSxNQUFNLENBQUMsTUFBTSxDQUFDLEVBQUcsRUFBRSxDQUFDLEVBQUU7b0JBQ2xFLFNBQVMsRUFBRSxXQUFTLENBQUUsQ0FBQyxDQUFFLENBQUMsSUFBSTtpQkFDakMsQ0FBQyxFQUY4QyxDQUU5QyxDQUFDLENBQUM7Z0JBRUosV0FBTyxJQUFJLE9BQU8sQ0FBRSxVQUFBLE9BQU87d0JBQ3JCLE9BQU8sQ0FBQzs0QkFDSixNQUFNLEVBQUUsR0FBRzs0QkFDWCxJQUFJLEVBQUUsZ0JBQWMsQ0FBRSxDQUFDLENBQUU7eUJBQzVCLENBQUMsQ0FBQztvQkFDVCxDQUFDLENBQUMsRUFBQzs7O2dCQUVILFdBQU8sSUFBSSxPQUFPLENBQUMsVUFBRSxPQUFPLEVBQUUsTUFBTTt3QkFDaEMsTUFBTSxDQUFDOzRCQUNILE1BQU0sRUFBRSxHQUFHOzRCQUNYLE9BQU8sRUFBRSxHQUFDO3lCQUNiLENBQUMsQ0FBQTtvQkFDTixDQUFDLENBQUMsRUFBQTs7OztLQUdULENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyIvLyDkupHlh73mlbDlhaXlj6Pmlofku7ZcbmltcG9ydCAqIGFzIGNsb3VkIGZyb20gJ3d4LXNlcnZlci1zZGsnO1xuXG5jbG91ZC5pbml0KCk7XG5cbmNvbnN0IGRiOiBEQi5EYXRhYmFzZSA9IGNsb3VkLmRhdGFiYXNlKCk7XG5cbi8qKlxuICogQGRlc2NyaXB0aW9uIOWVhuWTgeivpuaDhVxuICogLS0tLS0tLS0g6K+35rGCIC0tLS0tLS0tLS1cbiAqIHtcbiAqICAgICAgX2lkOiDllYblk4FpZFxuICogfVxuICogLS0tLS0tLS0tLSDov5Tlm54gLS0tLS0tLS1cbiAqIHtcbiAqICAgICAgZGF0YTog5ZWG5ZOB6K+m5oOFXG4gKiAgICAgIHN0YXR1c1xuICogfVxuICovXG5leHBvcnQgY29uc3QgbWFpbiA9IGFzeW5jICggZXZlbnQsIGNvbnRleHQpID0+IHtcblxuICAgIHRyeSB7XG4gICAgICAvLyDojrflj5bmlbDmja5cbiAgICAgICAgY29uc3QgZGF0YSQgPSBhd2FpdCBkYi5jb2xsZWN0aW9uKCdnb29kcycpXG4gICAgICAgICAgICAgIC53aGVyZSh7XG4gICAgICAgICAgICAgICAgICBfaWQ6IGV2ZW50Ll9pZFxuICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAuZ2V0KCApO1xuXG4gICAgICAgIGNvbnN0IG1ldGFMaXN0ID0gZGF0YSQuZGF0YTtcbiAgICAgICAgY29uc3Qgc3RhbmRhcmRzID0gYXdhaXQgUHJvbWlzZS5hbGwoIG1ldGFMaXN0Lm1hcCggeCA9PiB7XG4gICAgICAgICAgICByZXR1cm4gZGIuY29sbGVjdGlvbignc3RhbmRhcmRzJylcbiAgICAgICAgICAgICAgICAud2hlcmUoe1xuICAgICAgICAgICAgICAgIHBpZDogeC5faWRcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIC5nZXQoICk7XG4gICAgICAgIH0pKTtcblxuICAgICAgICBjb25zdCBpbnNlcnRTdGFuZGFycyA9IG1ldGFMaXN0Lm1hcCgoIHgsIGsgKSA9PiBPYmplY3QuYXNzaWduKHsgfSwgeCwge1xuICAgICAgICAgICAgc3RhbmRhcmRzOiBzdGFuZGFyZHNbIGsgXS5kYXRhXG4gICAgICAgIH0pKTtcblxuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoIHJlc29sdmUgPT4ge1xuICAgICAgICAgICAgICByZXNvbHZlKHtcbiAgICAgICAgICAgICAgICAgIHN0YXR1czogMjAwLFxuICAgICAgICAgICAgICAgICAgZGF0YTogaW5zZXJ0U3RhbmRhcnNbIDAgXVxuICAgICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfSBjYXRjaCAoIGUgKSB7XG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgoIHJlc29sdmUsIHJlamVjdCApID0+IHtcbiAgICAgICAgICAgIHJlamVjdCh7XG4gICAgICAgICAgICAgICAgc3RhdHVzOiA1MDAsXG4gICAgICAgICAgICAgICAgbWVzc2FnZTogZVxuICAgICAgICAgICAgfSlcbiAgICAgICAgfSlcbiAgICB9XG5cbn0iXX0=