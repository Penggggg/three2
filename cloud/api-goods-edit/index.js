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
    var _id, meta, title, category, depositPrice, detail, fadePrice, img, limit, saled, standards, tag, updateTime, visiable, price, groupPrice, stock, e_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 5, , 6]);
                _id = event.data._id;
                if (!!_id) return [3, 2];
                return [4, db.collection('goods').add({
                        data: event.data,
                    })];
            case 1:
                _a.sent();
                return [3, 4];
            case 2:
                meta = Object.assign({}, event.data);
                delete meta[_id];
                title = meta.title, category = meta.category, depositPrice = meta.depositPrice, detail = meta.detail, fadePrice = meta.fadePrice, img = meta.img, limit = meta.limit, saled = meta.saled, standards = meta.standards, tag = meta.tag, updateTime = meta.updateTime, visiable = meta.visiable, price = meta.price, groupPrice = meta.groupPrice, stock = meta.stock;
                return [4, db.collection('goods').doc(_id).update({
                        data: {
                            tag: tag,
                            img: img,
                            stock: stock,
                            price: price,
                            limit: limit,
                            title: title,
                            detail: detail,
                            saled: saled,
                            groupPrice: groupPrice,
                            category: category,
                            fadePrice: fadePrice,
                            standards: standards,
                            visiable: visiable,
                            updateTime: updateTime,
                            depositPrice: depositPrice
                        }
                    })];
            case 3:
                _a.sent();
                _a.label = 4;
            case 4: return [2, new Promise(function (resolve) {
                    resolve({
                        status: 200
                    });
                })];
            case 5:
                e_1 = _a.sent();
                return [2, new Promise(function (resolve, reject) {
                        reject({
                            status: 500,
                            message: e_1
                        });
                    })];
            case 6: return [2];
        }
    });
}); };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFDQSxpQkFzRkM7O0FBdEZELHFDQUF1QztBQUV2QyxLQUFLLENBQUMsSUFBSSxFQUFFLENBQUM7QUFFYixJQUFNLEVBQUUsR0FBZ0IsS0FBSyxDQUFDLFFBQVEsRUFBRSxDQUFDO0FBaUM1QixRQUFBLElBQUksR0FBRyxVQUFRLEtBQUssRUFBRSxPQUFPOzs7Ozs7Z0JBRzVCLEdBQUcsR0FBRyxLQUFLLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQztxQkFDdEIsQ0FBQyxHQUFHLEVBQUosY0FBSTtnQkFDTCxXQUFNLEVBQUUsQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLENBQUMsR0FBRyxDQUFDO3dCQUM3QixJQUFJLEVBQUUsS0FBSyxDQUFDLElBQUk7cUJBQ25CLENBQUMsRUFBQTs7Z0JBRkYsU0FFRSxDQUFDOzs7Z0JBRUcsSUFBSSxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUMsRUFBRyxFQUFFLEtBQUssQ0FBQyxJQUFJLENBQUUsQ0FBQztnQkFDN0MsT0FBTyxJQUFJLENBQUUsR0FBRyxDQUFFLENBQUM7Z0JBQ1gsS0FBSyxHQUMwRCxJQUFJLE1BRDlELEVBQUUsUUFBUSxHQUNnRCxJQUFJLFNBRHBELEVBQUUsWUFBWSxHQUNrQyxJQUFJLGFBRHRDLEVBQUUsTUFBTSxHQUMwQixJQUFJLE9BRDlCLEVBQUUsU0FBUyxHQUNlLElBQUksVUFEbkIsRUFBRSxHQUFHLEdBQ1UsSUFBSSxJQURkLEVBQUUsS0FBSyxHQUNHLElBQUksTUFEUCxFQUFFLEtBQUssR0FDSixJQUFJLE1BREEsRUFDdkUsU0FBUyxHQUEwRCxJQUFJLFVBQTlELEVBQUUsR0FBRyxHQUFxRCxJQUFJLElBQXpELEVBQUUsVUFBVSxHQUF5QyxJQUFJLFdBQTdDLEVBQUUsUUFBUSxHQUErQixJQUFJLFNBQW5DLEVBQUUsS0FBSyxHQUF3QixJQUFJLE1BQTVCLEVBQUUsVUFBVSxHQUFZLElBQUksV0FBaEIsRUFBRSxLQUFLLEdBQUssSUFBSSxNQUFULENBQVU7Z0JBQzVFLFdBQU0sRUFBRSxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUMsQ0FBQyxHQUFHLENBQUUsR0FBRyxDQUFFLENBQUMsTUFBTSxDQUFDO3dCQUMzQyxJQUFJLEVBQUU7NEJBQ0YsR0FBRyxLQUFBOzRCQUNILEdBQUcsS0FBQTs0QkFDSCxLQUFLLE9BQUE7NEJBQ0wsS0FBSyxPQUFBOzRCQUNMLEtBQUssT0FBQTs0QkFDTCxLQUFLLE9BQUE7NEJBQ0wsTUFBTSxRQUFBOzRCQUNOLEtBQUssT0FBQTs0QkFDTCxVQUFVLFlBQUE7NEJBQ1YsUUFBUSxVQUFBOzRCQUNSLFNBQVMsV0FBQTs0QkFDVCxTQUFTLFdBQUE7NEJBQ1QsUUFBUSxVQUFBOzRCQUNSLFVBQVUsWUFBQTs0QkFDVixZQUFZLGNBQUE7eUJBQ2Y7cUJBQ0osQ0FBQyxFQUFBOztnQkFsQkYsU0FrQkUsQ0FBQzs7b0JBR1AsV0FBTyxJQUFJLE9BQU8sQ0FBRSxVQUFBLE9BQU87b0JBQ3ZCLE9BQU8sQ0FBQzt3QkFDSixNQUFNLEVBQUUsR0FBRztxQkFDZCxDQUFDLENBQUE7Z0JBQ04sQ0FBQyxDQUFDLEVBQUE7OztnQkFHRixXQUFPLElBQUksT0FBTyxDQUFDLFVBQUUsT0FBTyxFQUFFLE1BQU07d0JBQ2hDLE1BQU0sQ0FBQzs0QkFDSCxNQUFNLEVBQUUsR0FBRzs0QkFDWCxPQUFPLEVBQUUsR0FBQzt5QkFDYixDQUFDLENBQUE7b0JBQ04sQ0FBQyxDQUFDLEVBQUE7Ozs7S0FHVCxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiLy8g5LqR5Ye95pWw5YWl5Y+j5paH5Lu2XG5pbXBvcnQgKiBhcyBjbG91ZCBmcm9tICd3eC1zZXJ2ZXItc2RrJztcblxuY2xvdWQuaW5pdCgpO1xuXG5jb25zdCBkYjogREIuRGF0YWJhc2UgPSBjbG91ZC5kYXRhYmFzZSgpO1xuXG4vKipcbiAqIEBkZXNjcmlwdGlvbiDliJvlu7ov57yW6L6R5ZWG5ZOBXG4gKiAtLS0tLS0tLSDor7fmsYIgLS0tLS0tLS0tLVxuICoge1xuICogICAgICBfaWQ6IGlkXG4gKiAgICAgIHRpdGxlOiDllYblk4HlkI3np7AgU3RyaW5nXG4gKiAgICAgIGRldGFpbCE6IOWVhuWTgeaPj+i/sCBTdHJpbmdcbiAqICAgICAgdGFnOiDllYblk4HmoIfnrb4gQXJyYXk8U3RyaW5nPlxuICogICAgICBjYXRlZ29yeTog5ZWG5ZOB57G755uuIFN0cmluZ1xuICogICAgICBpbWc6IOWVhuWTgeWbvueJhyBBcnJheTxTdHJpbmc+XG4gKiAgICAgIHByaWNlOiDku7fmoLwgTnVtYmVyXG4gKiAgICAgIGZhZGVQcmljZTog5YiS57q/5Lu3IE51bWJlclxuICogICAgICBncm91cFByaWNlITog5Zui6LSt5Lu3IE51bWJlclxuICogICAgICBzdG9jayE6IOW6k+WtmCBOdW1iZXJcbiAqICAgICAgZGVwb3NpdFByaWNlITog5ZWG5ZOB6K6i6YeRIE51bWJlclxuICogICAgICBsaW1pdCE6IOmZkOi0reaVsOmHjyBOdW1iZXJcbiAqICAgICAgdmlzaWFibGU6IOaYr+WQpuS4iuaetiBCb29sZWFuXG4gKiAgICAgIHNhbGVkOiDplIDph48gTnVtYmVyXG4gKiAgICAgIHN0YW5kYXJkcyE6IOWei+WPt+inhOagvCBBcnJheTx7IFxuICogICAgICAgICAgbmFtZTogU3RyaW5nLFxuICogICAgICAgICAgcHJpY2U6IE51bWJlcixcbiAqICAgICAgICAgIGdyb3VwUHJpY2UhOiBOdW1iZXIsXG4gKiAgICAgICAgICBzdG9jayE6IE51bWJlcjpcbiAqICAgICAgICAgIGltZzogU3RyaW5nIFxuICogICAgICB9PlxuICogfVxuICogLS0tLS0tLS0g6K+35rGCIC0tLS0tLS0tLS1cbiAqIHtcbiAqICAgICAgc3RhdHVzOiAyMDAgLyA1MDBcbiAqIH1cbiAqL1xuZXhwb3J0IGNvbnN0IG1haW4gPSBhc3luYyAoIGV2ZW50LCBjb250ZXh0KSA9PiB7XG5cbiAgICB0cnkge1xuICAgICAgICBjb25zdCBfaWQgPSBldmVudC5kYXRhLl9pZDtcbiAgICAgICAgaWYgKCAhX2lkICkge1xuICAgICAgICAgICAgYXdhaXQgZGIuY29sbGVjdGlvbignZ29vZHMnKS5hZGQoe1xuICAgICAgICAgICAgICAgIGRhdGE6IGV2ZW50LmRhdGEsXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNvbnN0IG1ldGEgPSBPYmplY3QuYXNzaWduKHsgfSwgZXZlbnQuZGF0YSApO1xuICAgICAgICAgICAgZGVsZXRlIG1ldGFbIF9pZCBdO1xuICAgICAgICAgICAgY29uc3QgeyB0aXRsZSwgY2F0ZWdvcnksIGRlcG9zaXRQcmljZSwgZGV0YWlsLCBmYWRlUHJpY2UsIGltZywgbGltaXQsIHNhbGVkLCBcbiAgICAgICAgICAgICAgICBzdGFuZGFyZHMsIHRhZywgdXBkYXRlVGltZSwgdmlzaWFibGUsIHByaWNlLCBncm91cFByaWNlLCBzdG9jayB9ID0gbWV0YTtcbiAgICAgICAgICAgIGF3YWl0IGRiLmNvbGxlY3Rpb24oJ2dvb2RzJykuZG9jKCBfaWQgKS51cGRhdGUoe1xuICAgICAgICAgICAgICAgIGRhdGE6IHsgXG4gICAgICAgICAgICAgICAgICAgIHRhZyxcbiAgICAgICAgICAgICAgICAgICAgaW1nLFxuICAgICAgICAgICAgICAgICAgICBzdG9jayxcbiAgICAgICAgICAgICAgICAgICAgcHJpY2UsXG4gICAgICAgICAgICAgICAgICAgIGxpbWl0LFxuICAgICAgICAgICAgICAgICAgICB0aXRsZSxcbiAgICAgICAgICAgICAgICAgICAgZGV0YWlsLFxuICAgICAgICAgICAgICAgICAgICBzYWxlZCxcbiAgICAgICAgICAgICAgICAgICAgZ3JvdXBQcmljZSxcbiAgICAgICAgICAgICAgICAgICAgY2F0ZWdvcnksXG4gICAgICAgICAgICAgICAgICAgIGZhZGVQcmljZSxcbiAgICAgICAgICAgICAgICAgICAgc3RhbmRhcmRzLFxuICAgICAgICAgICAgICAgICAgICB2aXNpYWJsZSxcbiAgICAgICAgICAgICAgICAgICAgdXBkYXRlVGltZSxcbiAgICAgICAgICAgICAgICAgICAgZGVwb3NpdFByaWNlXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoIHJlc29sdmUgPT4ge1xuICAgICAgICAgICAgcmVzb2x2ZSh7XG4gICAgICAgICAgICAgICAgc3RhdHVzOiAyMDBcbiAgICAgICAgICAgIH0pXG4gICAgICAgIH0pXG5cbiAgICB9IGNhdGNoICggZSApIHtcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKCggcmVzb2x2ZSwgcmVqZWN0ICkgPT4ge1xuICAgICAgICAgICAgcmVqZWN0KHtcbiAgICAgICAgICAgICAgICBzdGF0dXM6IDUwMCxcbiAgICAgICAgICAgICAgICBtZXNzYWdlOiBlXG4gICAgICAgICAgICB9KVxuICAgICAgICB9KVxuICAgIH1cblxufSJdfQ==