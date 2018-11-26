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
    var _id_1, standards, create$, meta, title, category, depositPrice, detail, fadePrice, img, limit, saled, standards_1, tag, updateTime, visiable, price, groupPrice, stock, allStandards$, wouldSetDelete_1, wouldUpdate_1, wouldCreate, e_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 11, , 12]);
                _id_1 = event.data._id;
                if (!!_id_1) return [3, 4];
                standards = event.data.standards;
                delete event.data['standards'];
                return [4, db.collection('goods').add({
                        data: event.data,
                    })];
            case 1:
                create$ = _a.sent();
                _id_1 = create$._id;
                if (!(!!standards && Array.isArray(standards))) return [3, 3];
                return [4, Promise.all(standards.map(function (x) {
                        return db.collection('standards').add({
                            data: Object.assign({}, x, {
                                pid: _id_1,
                                isDelete: false
                            })
                        });
                    }))];
            case 2:
                _a.sent();
                _a.label = 3;
            case 3: return [3, 10];
            case 4:
                meta = Object.assign({}, event.data);
                delete meta[_id_1];
                title = meta.title, category = meta.category, depositPrice = meta.depositPrice, detail = meta.detail, fadePrice = meta.fadePrice, img = meta.img, limit = meta.limit, saled = meta.saled, standards_1 = meta.standards, tag = meta.tag, updateTime = meta.updateTime, visiable = meta.visiable, price = meta.price, groupPrice = meta.groupPrice, stock = meta.stock;
                return [4, db.collection('goods').doc(_id_1).update({
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
                            visiable: visiable,
                            updateTime: updateTime,
                            depositPrice: depositPrice
                        }
                    })];
            case 5:
                _a.sent();
                return [4, db.collection('standards')
                        .where({
                        pid: _id_1
                    })
                        .get()];
            case 6:
                allStandards$ = _a.sent();
                wouldSetDelete_1 = [];
                wouldUpdate_1 = [];
                wouldCreate = standards_1.filter(function (x) { return !x._id; });
                allStandards$.data.filter(function (x) {
                    if (!standards_1.find(function (y) { return y._id === x._id; })) {
                        wouldSetDelete_1.push(x);
                    }
                    else {
                        wouldUpdate_1.push(x);
                    }
                });
                return [4, Promise.all(wouldSetDelete_1.map(function (x) {
                        return db.collection('standards')
                            .doc(x._id)
                            .update({
                            data: {
                                isDelete: true
                            }
                        });
                    }))];
            case 7:
                _a.sent();
                return [4, Promise.all(wouldUpdate_1.map(function (x) {
                        var newTarget = standards_1.find(function (y) { return y._id === x._id; });
                        var name = newTarget.name, price = newTarget.price, groupPrice = newTarget.groupPrice, stock = newTarget.stock, img = newTarget.img;
                        return db.collection('standards')
                            .doc(x._id)
                            .update({
                            data: {
                                name: name, price: price, groupPrice: groupPrice, stock: stock, img: img
                            }
                        });
                    }))];
            case 8:
                _a.sent();
                return [4, Promise.all(wouldCreate.map(function (x) {
                        return db.collection('standards').add({
                            data: Object.assign({}, x, {
                                pid: _id_1,
                                isDelete: false
                            })
                        });
                    }))];
            case 9:
                _a.sent();
                _a.label = 10;
            case 10: return [2, new Promise(function (resolve) {
                    resolve({
                        data: _id_1,
                        status: 200
                    });
                })];
            case 11:
                e_1 = _a.sent();
                return [2, new Promise(function (resolve, reject) {
                        reject({
                            status: 500,
                            message: e_1
                        });
                    })];
            case 12: return [2];
        }
    });
}); };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFDQSxpQkEwS0M7O0FBMUtELHFDQUF1QztBQUV2QyxLQUFLLENBQUMsSUFBSSxFQUFFLENBQUM7QUFFYixJQUFNLEVBQUUsR0FBZ0IsS0FBSyxDQUFDLFFBQVEsRUFBRSxDQUFDO0FBc0M1QixRQUFBLElBQUksR0FBRyxVQUFRLEtBQUssRUFBRSxPQUFPOzs7Ozs7Z0JBRzlCLFFBQU0sS0FBSyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUM7cUJBQ3BCLENBQUMsS0FBRyxFQUFKLGNBQUk7Z0JBRUcsU0FBUyxHQUFLLEtBQUssQ0FBQyxJQUFJLFVBQWYsQ0FBZ0I7Z0JBRWpDLE9BQU8sS0FBSyxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQztnQkFFZixXQUFNLEVBQUUsQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLENBQUMsR0FBRyxDQUFDO3dCQUM3QyxJQUFJLEVBQUUsS0FBSyxDQUFDLElBQUk7cUJBQ25CLENBQUMsRUFBQTs7Z0JBRkksT0FBTyxHQUFHLFNBRWQ7Z0JBQ0YsS0FBRyxHQUFHLE9BQU8sQ0FBQyxHQUFHLENBQUM7cUJBR2IsQ0FBQSxDQUFDLENBQUMsU0FBUyxJQUFJLEtBQUssQ0FBQyxPQUFPLENBQUUsU0FBUyxDQUFFLENBQUEsRUFBekMsY0FBeUM7Z0JBQzFDLFdBQU0sT0FBTyxDQUFDLEdBQUcsQ0FBRSxTQUFTLENBQUMsR0FBRyxDQUFFLFVBQUEsQ0FBQzt3QkFDL0IsT0FBTyxFQUFFLENBQUMsVUFBVSxDQUFDLFdBQVcsQ0FBQyxDQUFDLEdBQUcsQ0FBQzs0QkFDbEMsSUFBSSxFQUFFLE1BQU0sQ0FBQyxNQUFNLENBQUMsRUFBRyxFQUFFLENBQUMsRUFBRTtnQ0FDeEIsR0FBRyxFQUFFLEtBQUc7Z0NBQ1IsUUFBUSxFQUFFLEtBQUs7NkJBQ2xCLENBQUM7eUJBQ0wsQ0FBQyxDQUFDO29CQUNQLENBQUMsQ0FBQyxDQUFDLEVBQUE7O2dCQVBILFNBT0csQ0FBQTs7OztnQkFLRCxJQUFJLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQyxFQUFHLEVBQUUsS0FBSyxDQUFDLElBQUksQ0FBRSxDQUFDO2dCQUM3QyxPQUFPLElBQUksQ0FBRSxLQUFHLENBQUUsQ0FBQztnQkFDWCxLQUFLLEdBQzBELElBQUksTUFEOUQsRUFBRSxRQUFRLEdBQ2dELElBQUksU0FEcEQsRUFBRSxZQUFZLEdBQ2tDLElBQUksYUFEdEMsRUFBRSxNQUFNLEdBQzBCLElBQUksT0FEOUIsRUFBRSxTQUFTLEdBQ2UsSUFBSSxVQURuQixFQUFFLEdBQUcsR0FDVSxJQUFJLElBRGQsRUFBRSxLQUFLLEdBQ0csSUFBSSxNQURQLEVBQUUsS0FBSyxHQUNKLElBQUksTUFEQSxFQUN2RSxjQUFtRSxJQUFJLFVBQTlELEVBQUUsR0FBRyxHQUFxRCxJQUFJLElBQXpELEVBQUUsVUFBVSxHQUF5QyxJQUFJLFdBQTdDLEVBQUUsUUFBUSxHQUErQixJQUFJLFNBQW5DLEVBQUUsS0FBSyxHQUF3QixJQUFJLE1BQTVCLEVBQUUsVUFBVSxHQUFZLElBQUksV0FBaEIsRUFBRSxLQUFLLEdBQUssSUFBSSxNQUFULENBQVU7Z0JBQzVFLFdBQU0sRUFBRSxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUMsQ0FBQyxHQUFHLENBQUUsS0FBRyxDQUFFLENBQUMsTUFBTSxDQUFDO3dCQUMzQyxJQUFJLEVBQUU7NEJBQ0YsR0FBRyxLQUFBOzRCQUNILEdBQUcsS0FBQTs0QkFDSCxLQUFLLE9BQUE7NEJBQ0wsS0FBSyxPQUFBOzRCQUNMLEtBQUssT0FBQTs0QkFDTCxLQUFLLE9BQUE7NEJBQ0wsTUFBTSxRQUFBOzRCQUNOLEtBQUssT0FBQTs0QkFDTCxVQUFVLFlBQUE7NEJBQ1YsUUFBUSxVQUFBOzRCQUNSLFNBQVMsV0FBQTs0QkFDVCxRQUFRLFVBQUE7NEJBQ1IsVUFBVSxZQUFBOzRCQUNWLFlBQVksY0FBQTt5QkFDZjtxQkFDSixDQUFDLEVBQUE7O2dCQWpCRixTQWlCRSxDQUFDO2dCQUdtQixXQUFNLEVBQUUsQ0FBQyxVQUFVLENBQUMsV0FBVyxDQUFDO3lCQUNyQixLQUFLLENBQUM7d0JBQ0gsR0FBRyxFQUFFLEtBQUc7cUJBQ1gsQ0FBQzt5QkFDRCxHQUFHLEVBQUcsRUFBQTs7Z0JBSmpDLGFBQWEsR0FBRyxTQUlpQjtnQkFHakMsbUJBQXlCLEVBQUcsQ0FBQztnQkFHN0IsZ0JBQXNCLEVBQUcsQ0FBQztnQkFHMUIsV0FBVyxHQUFHLFdBQVMsQ0FBQyxNQUFNLENBQUUsVUFBQSxDQUFDLElBQUksT0FBQSxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQU4sQ0FBTSxDQUFFLENBQUM7Z0JBRXBELGFBQWEsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFFLFVBQUEsQ0FBQztvQkFDeEIsSUFBSyxDQUFDLFdBQVMsQ0FBQyxJQUFJLENBQUUsVUFBQSxDQUFDLElBQUksT0FBQSxDQUFDLENBQUMsR0FBRyxLQUFLLENBQUMsQ0FBQyxHQUFHLEVBQWYsQ0FBZSxDQUFFLEVBQUU7d0JBQzFDLGdCQUFjLENBQUMsSUFBSSxDQUFFLENBQUMsQ0FBRSxDQUFBO3FCQUMzQjt5QkFBTTt3QkFDSCxhQUFXLENBQUMsSUFBSSxDQUFFLENBQUMsQ0FBRSxDQUFBO3FCQUN4QjtnQkFDTCxDQUFDLENBQUMsQ0FBQztnQkFHSCxXQUFNLE9BQU8sQ0FBQyxHQUFHLENBQUUsZ0JBQWMsQ0FBQyxHQUFHLENBQUUsVUFBQSxDQUFDO3dCQUNwQyxPQUFPLEVBQUUsQ0FBQyxVQUFVLENBQUMsV0FBVyxDQUFDOzZCQUN4QixHQUFHLENBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBRTs2QkFDWixNQUFNLENBQUM7NEJBQ0osSUFBSSxFQUFFO2dDQUNGLFFBQVEsRUFBRSxJQUFJOzZCQUNqQjt5QkFDSixDQUFDLENBQUE7b0JBQ2QsQ0FBQyxDQUFDLENBQUMsRUFBQTs7Z0JBUkgsU0FRRyxDQUFDO2dCQUdKLFdBQU0sT0FBTyxDQUFDLEdBQUcsQ0FBRSxhQUFXLENBQUMsR0FBRyxDQUFFLFVBQUEsQ0FBQzt3QkFDakMsSUFBTSxTQUFTLEdBQUcsV0FBUyxDQUFDLElBQUksQ0FBRSxVQUFBLENBQUMsSUFBSSxPQUFBLENBQUMsQ0FBQyxHQUFHLEtBQUssQ0FBQyxDQUFDLEdBQUcsRUFBZixDQUFlLENBQUUsQ0FBQzt3QkFDakQsSUFBQSxxQkFBSSxFQUFFLHVCQUFLLEVBQUUsaUNBQVUsRUFBRSx1QkFBSyxFQUFFLG1CQUFHLENBQWU7d0JBQzFELE9BQU8sRUFBRSxDQUFDLFVBQVUsQ0FBQyxXQUFXLENBQUM7NkJBQ3hCLEdBQUcsQ0FBRSxDQUFDLENBQUMsR0FBRyxDQUFFOzZCQUNaLE1BQU0sQ0FBQzs0QkFDSixJQUFJLEVBQUU7Z0NBQ0YsSUFBSSxNQUFBLEVBQUUsS0FBSyxPQUFBLEVBQUUsVUFBVSxZQUFBLEVBQUUsS0FBSyxPQUFBLEVBQUUsR0FBRyxLQUFBOzZCQUN0Qzt5QkFDSixDQUFDLENBQUE7b0JBQ2QsQ0FBQyxDQUFDLENBQUMsRUFBQTs7Z0JBVkgsU0FVRyxDQUFDO2dCQUdKLFdBQU0sT0FBTyxDQUFDLEdBQUcsQ0FBRSxXQUFXLENBQUMsR0FBRyxDQUFFLFVBQUEsQ0FBQzt3QkFDakMsT0FBTyxFQUFFLENBQUMsVUFBVSxDQUFDLFdBQVcsQ0FBQyxDQUFDLEdBQUcsQ0FBQzs0QkFDbEMsSUFBSSxFQUFFLE1BQU0sQ0FBQyxNQUFNLENBQUMsRUFBRyxFQUFFLENBQUMsRUFBRTtnQ0FDeEIsR0FBRyxFQUFFLEtBQUc7Z0NBQ1IsUUFBUSxFQUFFLEtBQUs7NkJBQ2xCLENBQUM7eUJBQ0wsQ0FBQyxDQUFBO29CQUNOLENBQUMsQ0FBQyxDQUFDLEVBQUE7O2dCQVBILFNBT0csQ0FBQzs7cUJBSVIsV0FBTyxJQUFJLE9BQU8sQ0FBRSxVQUFBLE9BQU87b0JBQ3ZCLE9BQU8sQ0FBQzt3QkFDSixJQUFJLEVBQUUsS0FBRzt3QkFDVCxNQUFNLEVBQUUsR0FBRztxQkFDZCxDQUFDLENBQUE7Z0JBQ04sQ0FBQyxDQUFDLEVBQUE7OztnQkFHRixXQUFPLElBQUksT0FBTyxDQUFDLFVBQUUsT0FBTyxFQUFFLE1BQU07d0JBQ2hDLE1BQU0sQ0FBQzs0QkFDSCxNQUFNLEVBQUUsR0FBRzs0QkFDWCxPQUFPLEVBQUUsR0FBQzt5QkFDYixDQUFDLENBQUE7b0JBQ04sQ0FBQyxDQUFDLEVBQUE7Ozs7S0FHVCxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiLy8g5LqR5Ye95pWw5YWl5Y+j5paH5Lu2XG5pbXBvcnQgKiBhcyBjbG91ZCBmcm9tICd3eC1zZXJ2ZXItc2RrJztcblxuY2xvdWQuaW5pdCgpO1xuXG5jb25zdCBkYjogREIuRGF0YWJhc2UgPSBjbG91ZC5kYXRhYmFzZSgpO1xuXG4vKipcbiAqIEBkZXNjcmlwdGlvbiDliJvlu7ov57yW6L6R5ZWG5ZOBXG4gKiAtLS0tLS0tLSDor7fmsYIgLS0tLS0tLS0tLVxuICoge1xuICogICAgICBfaWQ6IGlkXG4gKiAgICAgIGlzRGVsZXRlOiDmmK/lkKbliKDpmaRcbiAqICAgICAgdGl0bGU6IOWVhuWTgeWQjeensCBTdHJpbmdcbiAqICAgICAgZGV0YWlsITog5ZWG5ZOB5o+P6L+wIFN0cmluZ1xuICogICAgICB0YWc6IOWVhuWTgeagh+etviBBcnJheTxTdHJpbmc+XG4gKiAgICAgIGNhdGVnb3J5OiDllYblk4Hnsbvnm64gU3RyaW5nXG4gKiAgICAgIGltZzog5ZWG5ZOB5Zu+54mHIEFycmF5PFN0cmluZz5cbiAqICAgICAgcHJpY2U6IOS7t+agvCBOdW1iZXJcbiAqICAgICAgZmFkZVByaWNlOiDliJLnur/ku7cgTnVtYmVyXG4gKiAgICAgIGdyb3VwUHJpY2UhOiDlm6LotK3ku7cgTnVtYmVyXG4gKiAgICAgIHN0b2NrITog5bqT5a2YIE51bWJlclxuICogICAgICBkZXBvc2l0UHJpY2UhOiDllYblk4HorqLph5EgTnVtYmVyXG4gKiAgICAgIGxpbWl0ITog6ZmQ6LSt5pWw6YePIE51bWJlclxuICogICAgICB2aXNpYWJsZTog5piv5ZCm5LiK5p62IEJvb2xlYW5cbiAqICAgICAgc2FsZWQ6IOmUgOmHjyBOdW1iZXJcbiAqICAgICAgc3RhbmRhcmRzITog5Z6L5Y+36KeE5qC8IEFycmF5PHsgXG4gKiAgICAgICAgICBuYW1lOiBTdHJpbmcsXG4gKiAgICAgICAgICBwcmljZTogTnVtYmVyLFxuICogICAgICAgICAgZ3JvdXBQcmljZSE6IE51bWJlcixcbiAqICAgICAgICAgIHN0b2NrITogTnVtYmVyOlxuICogICAgICAgICAgaW1nOiBTdHJpbmcgLFxuICogICAgICAgICAgX2lkOiBzdHJpbmcsXG4gKiAgICAgICAgICBwaWQ6IHN0cmluZyxcbiAqICAgICAgICAgIGlzRGVsZXRlOiBib29sZWFuXG4gKiAgICAgIH0+XG4gKiB9XG4gKiAtLS0tLS0tLSDor7fmsYIgLS0tLS0tLS0tLVxuICoge1xuICogICAgICBzdGF0dXM6IDIwMCAvIDUwMFxuICogfVxuICogISDmm7TmlrDnmoTml7blgJnvvIzlhYjliKTmlq3lnovlj7fmnInmsqHmnInooqvlvJXnlKhcbiAqL1xuZXhwb3J0IGNvbnN0IG1haW4gPSBhc3luYyAoIGV2ZW50LCBjb250ZXh0KSA9PiB7XG5cbiAgICB0cnkge1xuICAgICAgICBsZXQgX2lkID0gZXZlbnQuZGF0YS5faWQ7XG4gICAgICAgIGlmICggIV9pZCApIHtcbiAgICAgICAgICAgIC8vIOWIm+W7ulxuICAgICAgICAgICAgY29uc3QgeyBzdGFuZGFyZHMgfSA9IGV2ZW50LmRhdGE7XG5cbiAgICAgICAgICAgIGRlbGV0ZSBldmVudC5kYXRhWydzdGFuZGFyZHMnXTtcblxuICAgICAgICAgICAgY29uc3QgY3JlYXRlJCA9IGF3YWl0IGRiLmNvbGxlY3Rpb24oJ2dvb2RzJykuYWRkKHtcbiAgICAgICAgICAgICAgICBkYXRhOiBldmVudC5kYXRhLFxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBfaWQgPSBjcmVhdGUkLl9pZDtcblxuICAgICAgICAgICAgLy8g5o+S5YWl5Z6L5Y+3XG4gICAgICAgICAgICBpZiAoICEhc3RhbmRhcmRzICYmIEFycmF5LmlzQXJyYXkoIHN0YW5kYXJkcyApKSB7XG4gICAgICAgICAgICAgICAgYXdhaXQgUHJvbWlzZS5hbGwoIHN0YW5kYXJkcy5tYXAoIHggPT4ge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZGIuY29sbGVjdGlvbignc3RhbmRhcmRzJykuYWRkKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRhdGE6IE9iamVjdC5hc3NpZ24oeyB9LCB4LCB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcGlkOiBfaWQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaXNEZWxldGU6IGZhbHNlXG4gICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9KSlcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcblxuICAgICAgICAgICAgLy8g5pu05pawXG4gICAgICAgICAgICBjb25zdCBtZXRhID0gT2JqZWN0LmFzc2lnbih7IH0sIGV2ZW50LmRhdGEgKTtcbiAgICAgICAgICAgIGRlbGV0ZSBtZXRhWyBfaWQgXTtcbiAgICAgICAgICAgIGNvbnN0IHsgdGl0bGUsIGNhdGVnb3J5LCBkZXBvc2l0UHJpY2UsIGRldGFpbCwgZmFkZVByaWNlLCBpbWcsIGxpbWl0LCBzYWxlZCwgXG4gICAgICAgICAgICAgICAgc3RhbmRhcmRzLCB0YWcsIHVwZGF0ZVRpbWUsIHZpc2lhYmxlLCBwcmljZSwgZ3JvdXBQcmljZSwgc3RvY2sgfSA9IG1ldGE7XG4gICAgICAgICAgICBhd2FpdCBkYi5jb2xsZWN0aW9uKCdnb29kcycpLmRvYyggX2lkICkudXBkYXRlKHtcbiAgICAgICAgICAgICAgICBkYXRhOiB7IFxuICAgICAgICAgICAgICAgICAgICB0YWcsXG4gICAgICAgICAgICAgICAgICAgIGltZyxcbiAgICAgICAgICAgICAgICAgICAgc3RvY2ssXG4gICAgICAgICAgICAgICAgICAgIHByaWNlLFxuICAgICAgICAgICAgICAgICAgICBsaW1pdCxcbiAgICAgICAgICAgICAgICAgICAgdGl0bGUsXG4gICAgICAgICAgICAgICAgICAgIGRldGFpbCxcbiAgICAgICAgICAgICAgICAgICAgc2FsZWQsXG4gICAgICAgICAgICAgICAgICAgIGdyb3VwUHJpY2UsXG4gICAgICAgICAgICAgICAgICAgIGNhdGVnb3J5LFxuICAgICAgICAgICAgICAgICAgICBmYWRlUHJpY2UsXG4gICAgICAgICAgICAgICAgICAgIHZpc2lhYmxlLFxuICAgICAgICAgICAgICAgICAgICB1cGRhdGVUaW1lLFxuICAgICAgICAgICAgICAgICAgICBkZXBvc2l0UHJpY2VcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgLy8gMC4g5p+l6K+i6K+l5Lqn5ZOB5bqV5LiL5omA5pyJ55qE5Z6L5Y+3XG4gICAgICAgICAgICBjb25zdCBhbGxTdGFuZGFyZHMkID0gYXdhaXQgZGIuY29sbGVjdGlvbignc3RhbmRhcmRzJylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLndoZXJlKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBpZDogX2lkXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5nZXQoICk7XG5cbiAgICAgICAgICAgIC8vIOmcgOimgeKAnOWIoOmZpOKAneeahOWei+WPt1xuICAgICAgICAgICAgY29uc3Qgd291bGRTZXREZWxldGU6IGFueVsgXSA9IFsgXTtcblxuICAgICAgICAgICAgLy8g6ZyA6KaB4oCc5pu05paw4oCd55qE5Z6L5Y+3XG4gICAgICAgICAgICBjb25zdCB3b3VsZFVwZGF0ZTogYW55WyBdID0gWyBdO1xuXG4gICAgICAgICAgICAvLyDpnIDopoHigJzlop7liqDigJ3jgIHigJzmm7TmlrDigJ3nmoTlnovlj7dcbiAgICAgICAgICAgIGNvbnN0IHdvdWxkQ3JlYXRlID0gc3RhbmRhcmRzLmZpbHRlciggeCA9PiAheC5faWQgKTtcblxuICAgICAgICAgICAgYWxsU3RhbmRhcmRzJC5kYXRhLmZpbHRlciggeCA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKCAhc3RhbmRhcmRzLmZpbmQoIHkgPT4geS5faWQgPT09IHguX2lkICkpIHtcbiAgICAgICAgICAgICAgICAgICAgd291bGRTZXREZWxldGUucHVzaCggeCApXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgd291bGRVcGRhdGUucHVzaCggeCApXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIC8vIDEuICDigJzliKDpmaTigJ3pg6jliIblnovlj7dcbiAgICAgICAgICAgIGF3YWl0IFByb21pc2UuYWxsKCB3b3VsZFNldERlbGV0ZS5tYXAoIHggPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiBkYi5jb2xsZWN0aW9uKCdzdGFuZGFyZHMnKVxuICAgICAgICAgICAgICAgICAgICAgICAgLmRvYyggeC5faWQgKVxuICAgICAgICAgICAgICAgICAgICAgICAgLnVwZGF0ZSh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpc0RlbGV0ZTogdHJ1ZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICB9KSk7XG5cbiAgICAgICAgICAgIC8vIDIuIOabtOaWsOmDqOWIhuWei+WPt+S/oeaBr1xuICAgICAgICAgICAgYXdhaXQgUHJvbWlzZS5hbGwoIHdvdWxkVXBkYXRlLm1hcCggeCA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3QgbmV3VGFyZ2V0ID0gc3RhbmRhcmRzLmZpbmQoIHkgPT4geS5faWQgPT09IHguX2lkICk7XG4gICAgICAgICAgICAgICAgY29uc3QgeyBuYW1lLCBwcmljZSwgZ3JvdXBQcmljZSwgc3RvY2ssIGltZyB9ID0gbmV3VGFyZ2V0O1xuICAgICAgICAgICAgICAgIHJldHVybiBkYi5jb2xsZWN0aW9uKCdzdGFuZGFyZHMnKVxuICAgICAgICAgICAgICAgICAgICAgICAgLmRvYyggeC5faWQgKVxuICAgICAgICAgICAgICAgICAgICAgICAgLnVwZGF0ZSh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuYW1lLCBwcmljZSwgZ3JvdXBQcmljZSwgc3RvY2ssIGltZ1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICB9KSk7XG5cbiAgICAgICAgICAgIC8vIDMuIOaWsOWinumDqOWIhuWei+WPt1xuICAgICAgICAgICAgYXdhaXQgUHJvbWlzZS5hbGwoIHdvdWxkQ3JlYXRlLm1hcCggeCA9PiB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGRiLmNvbGxlY3Rpb24oJ3N0YW5kYXJkcycpLmFkZCh7XG4gICAgICAgICAgICAgICAgICAgIGRhdGE6IE9iamVjdC5hc3NpZ24oeyB9LCB4LCB7XG4gICAgICAgICAgICAgICAgICAgICAgICBwaWQ6IF9pZCxcbiAgICAgICAgICAgICAgICAgICAgICAgIGlzRGVsZXRlOiBmYWxzZVxuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICB9KSk7XG5cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSggcmVzb2x2ZSA9PiB7XG4gICAgICAgICAgICByZXNvbHZlKHtcbiAgICAgICAgICAgICAgICBkYXRhOiBfaWQsXG4gICAgICAgICAgICAgICAgc3RhdHVzOiAyMDBcbiAgICAgICAgICAgIH0pXG4gICAgICAgIH0pXG5cbiAgICB9IGNhdGNoICggZSApIHtcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKCggcmVzb2x2ZSwgcmVqZWN0ICkgPT4ge1xuICAgICAgICAgICAgcmVqZWN0KHtcbiAgICAgICAgICAgICAgICBzdGF0dXM6IDUwMCxcbiAgICAgICAgICAgICAgICBtZXNzYWdlOiBlXG4gICAgICAgICAgICB9KVxuICAgICAgICB9KVxuICAgIH1cblxufSJdfQ==