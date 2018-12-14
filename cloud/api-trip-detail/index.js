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
    var data$_1, meta, products$, e_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                return [4, db.collection('trip')
                        .where({
                        _id: event._id
                    })
                        .get()];
            case 1:
                data$_1 = _a.sent();
                meta = data$_1.data[0];
                return [4, Promise.all(meta.selectedProductIds.map(function (pid) {
                        return db.collection('goods')
                            .where({
                            _id: pid
                        })
                            .field({
                            img: true,
                            title: true
                        })
                            .get();
                    }))];
            case 2:
                products$ = _a.sent();
                meta.selectedProducts = products$.map(function (x) {
                    return x.data[0];
                });
                return [2, new Promise(function (resolve) {
                        resolve({
                            status: 200,
                            data: data$_1.data[0]
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFDQSxpQkErREM7O0FBL0RELHFDQUF1QztBQUV2QyxLQUFLLENBQUMsSUFBSSxFQUFHLENBQUM7QUFFZCxJQUFNLEVBQUUsR0FBZ0IsS0FBSyxDQUFDLFFBQVEsRUFBRSxDQUFDO0FBYzVCLFFBQUEsSUFBSSxHQUFHLFVBQVEsS0FBSyxFQUFFLE9BQU87Ozs7OztnQkFLcEIsV0FBTSxFQUFFLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQzt5QkFDbEMsS0FBSyxDQUFDO3dCQUNILEdBQUcsRUFBRSxLQUFLLENBQUMsR0FBRztxQkFDakIsQ0FBQzt5QkFDRCxHQUFHLEVBQUcsRUFBQTs7Z0JBSlAsVUFBUSxTQUlEO2dCQUNQLElBQUksR0FBRyxPQUFLLENBQUMsSUFBSSxDQUFFLENBQUMsQ0FBRSxDQUFDO2dCQUdOLFdBQU0sT0FBTyxDQUFDLEdBQUcsQ0FBRSxJQUFJLENBQUMsa0JBQWtCLENBQUMsR0FBRyxDQUFFLFVBQUEsR0FBRzt3QkFDdEUsT0FBTyxFQUFFLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQzs2QkFDcEIsS0FBSyxDQUFDOzRCQUNILEdBQUcsRUFBRSxHQUFHO3lCQUNYLENBQUM7NkJBQ0QsS0FBSyxDQUFDOzRCQUNILEdBQUcsRUFBRSxJQUFJOzRCQUNULEtBQUssRUFBRSxJQUFJO3lCQUNkLENBQUM7NkJBQ0QsR0FBRyxFQUFHLENBQUM7b0JBQ3BCLENBQUMsQ0FBQyxDQUFDLEVBQUE7O2dCQVZHLFNBQVMsR0FBUSxTQVVwQjtnQkFFSCxJQUFJLENBQUMsZ0JBQWdCLEdBQUcsU0FBUyxDQUFDLEdBQUcsQ0FBRSxVQUFBLENBQUM7b0JBQ3BDLE9BQU8sQ0FBQyxDQUFDLElBQUksQ0FBRSxDQUFDLENBQUUsQ0FBQztnQkFDdkIsQ0FBQyxDQUFDLENBQUM7Z0JBR0gsV0FBTyxJQUFJLE9BQU8sQ0FBRSxVQUFBLE9BQU87d0JBQ3JCLE9BQU8sQ0FBQzs0QkFDSixNQUFNLEVBQUUsR0FBRzs0QkFDWCxJQUFJLEVBQUUsT0FBSyxDQUFDLElBQUksQ0FBRSxDQUFDLENBQUU7eUJBQ3hCLENBQUMsQ0FBQztvQkFDVCxDQUFDLENBQUMsRUFBQzs7O2dCQUVILFdBQU8sSUFBSSxPQUFPLENBQUMsVUFBRSxPQUFPLEVBQUUsTUFBTTt3QkFDaEMsT0FBTyxDQUFDOzRCQUNKLE1BQU0sRUFBRSxHQUFHOzRCQUNYLE9BQU8sRUFBRSxHQUFDO3lCQUNiLENBQUMsQ0FBQTtvQkFDTixDQUFDLENBQUMsRUFBQTs7OztLQUdULENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyIvLyDkupHlh73mlbDlhaXlj6Pmlofku7ZcbmltcG9ydCAqIGFzIGNsb3VkIGZyb20gJ3d4LXNlcnZlci1zZGsnO1xuXG5jbG91ZC5pbml0KCApO1xuXG5jb25zdCBkYjogREIuRGF0YWJhc2UgPSBjbG91ZC5kYXRhYmFzZSgpO1xuXG4vKipcbiAqIEBkZXNjcmlwdGlvbiDooYznqIvor6bmg4VcbiAqIC0tLS0tLS0tIOivt+axgiAtLS0tLS0tLS0tXG4gKiB7XG4gKiAgICAgIF9pZDog6KGM56iLaWRcbiAqIH1cbiAqIC0tLS0tLS0tLS0g6L+U5ZueIC0tLS0tLS0tXG4gKiB7XG4gKiAgICAgIGRhdGE6IOihjOeoi+ivpuaDhVxuICogICAgICBzdGF0dXNcbiAqIH1cbiAqL1xuZXhwb3J0IGNvbnN0IG1haW4gPSBhc3luYyAoIGV2ZW50LCBjb250ZXh0KSA9PiB7XG5cbiAgICB0cnkge1xuXG4gICAgICAgIC8vIOiOt+WPluWfuuacrOivpuaDhVxuICAgICAgICBjb25zdCBkYXRhJCA9IGF3YWl0IGRiLmNvbGxlY3Rpb24oJ3RyaXAnKVxuICAgICAgICAgICAgICAud2hlcmUoe1xuICAgICAgICAgICAgICAgICAgX2lkOiBldmVudC5faWRcbiAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgLmdldCggKTtcbiAgICAgICAgY29uc3QgbWV0YSA9IGRhdGEkLmRhdGFbIDAgXTtcblxuICAgICAgICAvLyDpgJrov4flt7LpgInnmoTllYblk4FpZHMs5ou/5Yiw5a+55bqU55qE5Zu+54mH44CBdGl0bGXjgIFfaWRcbiAgICAgICAgY29uc3QgcHJvZHVjdHMkOiBhbnkgPSBhd2FpdCBQcm9taXNlLmFsbCggbWV0YS5zZWxlY3RlZFByb2R1Y3RJZHMubWFwKCBwaWQgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIGRiLmNvbGxlY3Rpb24oJ2dvb2RzJylcbiAgICAgICAgICAgICAgICAgICAgLndoZXJlKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIF9pZDogcGlkXG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgIC5maWVsZCh7XG4gICAgICAgICAgICAgICAgICAgICAgICBpbWc6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgICAgICB0aXRsZTogdHJ1ZVxuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAuZ2V0KCApO1xuICAgICAgICB9KSk7XG5cbiAgICAgICAgbWV0YS5zZWxlY3RlZFByb2R1Y3RzID0gcHJvZHVjdHMkLm1hcCggeCA9PiB7XG4gICAgICAgICAgICByZXR1cm4geC5kYXRhWyAwIF07XG4gICAgICAgIH0pO1xuICAgICAgICBcblxuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoIHJlc29sdmUgPT4ge1xuICAgICAgICAgICAgICByZXNvbHZlKHtcbiAgICAgICAgICAgICAgICAgIHN0YXR1czogMjAwLFxuICAgICAgICAgICAgICAgICAgZGF0YTogZGF0YSQuZGF0YVsgMCBdXG4gICAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9IGNhdGNoICggZSApIHtcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKCggcmVzb2x2ZSwgcmVqZWN0ICkgPT4ge1xuICAgICAgICAgICAgcmVzb2x2ZSh7XG4gICAgICAgICAgICAgICAgc3RhdHVzOiA1MDAsXG4gICAgICAgICAgICAgICAgbWVzc2FnZTogZVxuICAgICAgICAgICAgfSlcbiAgICAgICAgfSlcbiAgICB9XG5cbn0iXX0=