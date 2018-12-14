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
                            pid: x._id,
                            isDelete: false
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
                        resolve({
                            status: 500,
                            message: e_1
                        });
                    })];
            case 4: return [2];
        }
    });
}); };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFDQSxpQkF5REM7O0FBekRELHFDQUF1QztBQUV2QyxLQUFLLENBQUMsSUFBSSxFQUFFLENBQUM7QUFFYixJQUFNLEVBQUUsR0FBZ0IsS0FBSyxDQUFDLFFBQVEsRUFBRSxDQUFDO0FBYzVCLFFBQUEsSUFBSSxHQUFHLFVBQVEsS0FBSyxFQUFFLE9BQU87Ozs7OztnQkFJcEIsV0FBTSxFQUFFLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQzt5QkFDbkMsS0FBSyxDQUFDO3dCQUNILEdBQUcsRUFBRSxLQUFLLENBQUMsR0FBRztxQkFDakIsQ0FBQzt5QkFDRCxHQUFHLEVBQUcsRUFBQTs7Z0JBSlAsS0FBSyxHQUFHLFNBSUQ7Z0JBRVAsUUFBUSxHQUFHLEtBQUssQ0FBQyxJQUFJLENBQUM7Z0JBQ1YsV0FBTSxPQUFPLENBQUMsR0FBRyxDQUFFLFFBQVEsQ0FBQyxHQUFHLENBQUUsVUFBQSxDQUFDO3dCQUNoRCxPQUFPLEVBQUUsQ0FBQyxVQUFVLENBQUMsV0FBVyxDQUFDOzZCQUM1QixLQUFLLENBQUM7NEJBQ0gsR0FBRyxFQUFFLENBQUMsQ0FBQyxHQUFHOzRCQUNWLFFBQVEsRUFBRSxLQUFLO3lCQUNsQixDQUFDOzZCQUNELEdBQUcsRUFBRyxDQUFDO29CQUNoQixDQUFDLENBQUMsQ0FBQyxFQUFBOztnQkFQRyxjQUFZLFNBT2Y7Z0JBRUcsbUJBQWlCLFFBQVEsQ0FBQyxHQUFHLENBQUMsVUFBRSxDQUFDLEVBQUUsQ0FBQyxJQUFNLE9BQUEsTUFBTSxDQUFDLE1BQU0sQ0FBQyxFQUFHLEVBQUUsQ0FBQyxFQUFFO29CQUNsRSxTQUFTLEVBQUUsV0FBUyxDQUFFLENBQUMsQ0FBRSxDQUFDLElBQUk7aUJBQ2pDLENBQUMsRUFGOEMsQ0FFOUMsQ0FBQyxDQUFDO2dCQUVKLFdBQU8sSUFBSSxPQUFPLENBQUUsVUFBQSxPQUFPO3dCQUNyQixPQUFPLENBQUM7NEJBQ0osTUFBTSxFQUFFLEdBQUc7NEJBQ1gsSUFBSSxFQUFFLGdCQUFjLENBQUUsQ0FBQyxDQUFFO3lCQUM1QixDQUFDLENBQUM7b0JBQ1QsQ0FBQyxDQUFDLEVBQUM7OztnQkFFSCxXQUFPLElBQUksT0FBTyxDQUFDLFVBQUUsT0FBTyxFQUFFLE1BQU07d0JBQ2hDLE9BQU8sQ0FBQzs0QkFDSixNQUFNLEVBQUUsR0FBRzs0QkFDWCxPQUFPLEVBQUUsR0FBQzt5QkFDYixDQUFDLENBQUE7b0JBQ04sQ0FBQyxDQUFDLEVBQUE7Ozs7S0FHVCxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiLy8g5LqR5Ye95pWw5YWl5Y+j5paH5Lu2XG5pbXBvcnQgKiBhcyBjbG91ZCBmcm9tICd3eC1zZXJ2ZXItc2RrJztcblxuY2xvdWQuaW5pdCgpO1xuXG5jb25zdCBkYjogREIuRGF0YWJhc2UgPSBjbG91ZC5kYXRhYmFzZSgpO1xuXG4vKipcbiAqIEBkZXNjcmlwdGlvbiDllYblk4Hor6bmg4VcbiAqIC0tLS0tLS0tIOivt+axgiAtLS0tLS0tLS0tXG4gKiB7XG4gKiAgICAgIF9pZDog5ZWG5ZOBaWRcbiAqIH1cbiAqIC0tLS0tLS0tLS0g6L+U5ZueIC0tLS0tLS0tXG4gKiB7XG4gKiAgICAgIGRhdGE6IOWVhuWTgeivpuaDhVxuICogICAgICBzdGF0dXNcbiAqIH1cbiAqL1xuZXhwb3J0IGNvbnN0IG1haW4gPSBhc3luYyAoIGV2ZW50LCBjb250ZXh0KSA9PiB7XG5cbiAgICB0cnkge1xuICAgICAgLy8g6I635Y+W5pWw5o2uXG4gICAgICAgIGNvbnN0IGRhdGEkID0gYXdhaXQgZGIuY29sbGVjdGlvbignZ29vZHMnKVxuICAgICAgICAgICAgICAud2hlcmUoe1xuICAgICAgICAgICAgICAgICAgX2lkOiBldmVudC5faWRcbiAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgLmdldCggKTtcblxuICAgICAgICBjb25zdCBtZXRhTGlzdCA9IGRhdGEkLmRhdGE7XG4gICAgICAgIGNvbnN0IHN0YW5kYXJkcyA9IGF3YWl0IFByb21pc2UuYWxsKCBtZXRhTGlzdC5tYXAoIHggPT4ge1xuICAgICAgICAgICAgcmV0dXJuIGRiLmNvbGxlY3Rpb24oJ3N0YW5kYXJkcycpXG4gICAgICAgICAgICAgICAgLndoZXJlKHtcbiAgICAgICAgICAgICAgICAgICAgcGlkOiB4Ll9pZCxcbiAgICAgICAgICAgICAgICAgICAgaXNEZWxldGU6IGZhbHNlXG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAuZ2V0KCApO1xuICAgICAgICB9KSk7XG5cbiAgICAgICAgY29uc3QgaW5zZXJ0U3RhbmRhcnMgPSBtZXRhTGlzdC5tYXAoKCB4LCBrICkgPT4gT2JqZWN0LmFzc2lnbih7IH0sIHgsIHtcbiAgICAgICAgICAgIHN0YW5kYXJkczogc3RhbmRhcmRzWyBrIF0uZGF0YVxuICAgICAgICB9KSk7XG5cbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKCByZXNvbHZlID0+IHtcbiAgICAgICAgICAgICAgcmVzb2x2ZSh7XG4gICAgICAgICAgICAgICAgICBzdGF0dXM6IDIwMCxcbiAgICAgICAgICAgICAgICAgIGRhdGE6IGluc2VydFN0YW5kYXJzWyAwIF1cbiAgICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH0gY2F0Y2ggKCBlICkge1xuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKCByZXNvbHZlLCByZWplY3QgKSA9PiB7XG4gICAgICAgICAgICByZXNvbHZlKHtcbiAgICAgICAgICAgICAgICBzdGF0dXM6IDUwMCxcbiAgICAgICAgICAgICAgICBtZXNzYWdlOiBlXG4gICAgICAgICAgICB9KVxuICAgICAgICB9KVxuICAgIH1cblxufSJdfQ==