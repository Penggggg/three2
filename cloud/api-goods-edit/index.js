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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFDQSxpQkF5S0M7O0FBektELHFDQUF1QztBQUV2QyxLQUFLLENBQUMsSUFBSSxFQUFFLENBQUM7QUFFYixJQUFNLEVBQUUsR0FBZ0IsS0FBSyxDQUFDLFFBQVEsRUFBRSxDQUFDO0FBcUM1QixRQUFBLElBQUksR0FBRyxVQUFRLEtBQUssRUFBRSxPQUFPOzs7Ozs7Z0JBRzlCLFFBQU0sS0FBSyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUM7cUJBQ3BCLENBQUMsS0FBRyxFQUFKLGNBQUk7Z0JBRUcsU0FBUyxHQUFLLEtBQUssQ0FBQyxJQUFJLFVBQWYsQ0FBZ0I7Z0JBRWpDLE9BQU8sS0FBSyxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQztnQkFFZixXQUFNLEVBQUUsQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLENBQUMsR0FBRyxDQUFDO3dCQUM3QyxJQUFJLEVBQUUsS0FBSyxDQUFDLElBQUk7cUJBQ25CLENBQUMsRUFBQTs7Z0JBRkksT0FBTyxHQUFHLFNBRWQ7Z0JBQ0YsS0FBRyxHQUFHLE9BQU8sQ0FBQyxHQUFHLENBQUM7cUJBR2IsQ0FBQSxDQUFDLENBQUMsU0FBUyxJQUFJLEtBQUssQ0FBQyxPQUFPLENBQUUsU0FBUyxDQUFFLENBQUEsRUFBekMsY0FBeUM7Z0JBQzFDLFdBQU0sT0FBTyxDQUFDLEdBQUcsQ0FBRSxTQUFTLENBQUMsR0FBRyxDQUFFLFVBQUEsQ0FBQzt3QkFDL0IsT0FBTyxFQUFFLENBQUMsVUFBVSxDQUFDLFdBQVcsQ0FBQyxDQUFDLEdBQUcsQ0FBQzs0QkFDbEMsSUFBSSxFQUFFLE1BQU0sQ0FBQyxNQUFNLENBQUMsRUFBRyxFQUFFLENBQUMsRUFBRTtnQ0FDeEIsR0FBRyxFQUFFLEtBQUc7Z0NBQ1IsUUFBUSxFQUFFLEtBQUs7NkJB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QUksT0FBTyxDQUFDLFVBQUUsT0FBTyxFQUFFLE1BQU07d0JBQ2hDLE1BQU0sQ0FBQzs0QkFDSCxNQUFNLEVBQUUsR0FBRzs0QkFDWCxPQUFPLEVBQUUsR0FBQzt5QkFDYixDQUFDLENBQUE7b0JBQ04sQ0FBQyxDQUFDLEVBQUE7Ozs7S0FHVCxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiLy8g5LqR5Ye95pWw5YWl5Y+j5paH5Lu2XG5pbXBvcnQgKiBhcyBjbG91ZCBmcm9tICd3eC1zZXJ2ZXItc2RrJztcblxuY2xvdWQuaW5pdCgpO1xuXG5jb25zdCBkYjogREIuRGF0YWJhc2UgPSBjbG91ZC5kYXRhYmFzZSgpO1xuXG4vKipcbiAqIEBkZXNjcmlwdGlvbiDliJvlu7ov57yW6L6R5ZWG5ZOBXG4gKiAtLS0tLS0tLSDor7fmsYIgLS0tLS0tLS0tLVxuICoge1xuICogICAgICBfaWQ6IGlkXG4gKiAgICAgIHRpdGxlOiDllYblk4HlkI3np7AgU3RyaW5nXG4gKiAgICAgIGRldGFpbCE6IOWVhuWTgeaPj+i/sCBTdHJpbmdcbiAqICAgICAgdGFnOiDllYblk4HmoIfnrb4gQXJyYXk8U3RyaW5nPlxuICogICAgICBjYXRlZ29yeTog5ZWG5ZOB57G755uuIFN0cmluZ1xuICogICAgICBpbWc6IOWVhuWTgeWbvueJhyBBcnJheTxTdHJpbmc+XG4gKiAgICAgIHByaWNlOiDku7fmoLwgTnVtYmVyXG4gKiAgICAgIGZhZGVQcmljZTog5YiS57q/5Lu3IE51bWJlclxuICogICAgICBncm91cFByaWNlITog5Zui6LSt5Lu3IE51bWJlclxuICogICAgICBzdG9jayE6IOW6k+WtmCBOdW1iZXJcbiAqICAgICAgZGVwb3NpdFByaWNlITog5ZWG5ZOB6K6i6YeRIE51bWJlclxuICogICAgICBsaW1pdCE6IOmZkOi0reaVsOmHjyBOdW1iZXJcbiAqICAgICAgdmlzaWFibGU6IOaYr+WQpuS4iuaetiBCb29sZWFuXG4gKiAgICAgIHNhbGVkOiDplIDph48gTnVtYmVyXG4gKiAgICAgIHN0YW5kYXJkcyE6IOWei+WPt+inhOagvCBBcnJheTx7IFxuICogICAgICAgICAgbmFtZTogU3RyaW5nLFxuICogICAgICAgICAgcHJpY2U6IE51bWJlcixcbiAqICAgICAgICAgIGdyb3VwUHJpY2UhOiBOdW1iZXIsXG4gKiAgICAgICAgICBzdG9jayE6IE51bWJlcjpcbiAqICAgICAgICAgIGltZzogU3RyaW5nICxcbiAqICAgICAgICAgIF9pZDogc3RyaW5nLFxuICogICAgICAgICAgcGlkOiBzdHJpbmcsXG4gKiAgICAgICAgICBpc0RlbGV0ZTogYm9vbGVhblxuICogICAgICB9PlxuICogfVxuICogLS0tLS0tLS0g6K+35rGCIC0tLS0tLS0tLS1cbiAqIHtcbiAqICAgICAgc3RhdHVzOiAyMDAgLyA1MDBcbiAqIH1cbiAqICEg5pu05paw55qE5pe25YCZ77yM5YWI5Yik5pat5Z6L5Y+35pyJ5rKh5pyJ6KKr5byV55SoXG4gKi9cbmV4cG9ydCBjb25zdCBtYWluID0gYXN5bmMgKCBldmVudCwgY29udGV4dCkgPT4ge1xuXG4gICAgdHJ5IHtcbiAgICAgICAgbGV0IF9pZCA9IGV2ZW50LmRhdGEuX2lkO1xuICAgICAgICBpZiAoICFfaWQgKSB7XG4gICAgICAgICAgICAvLyDliJvlu7pcbiAgICAgICAgICAgIGNvbnN0IHsgc3RhbmRhcmRzIH0gPSBldmVudC5kYXRhO1xuXG4gICAgICAgICAgICBkZWxldGUgZXZlbnQuZGF0YVsnc3RhbmRhcmRzJ107XG5cbiAgICAgICAgICAgIGNvbnN0IGNyZWF0ZSQgPSBhd2FpdCBkYi5jb2xsZWN0aW9uKCdnb29kcycpLmFkZCh7XG4gICAgICAgICAgICAgICAgZGF0YTogZXZlbnQuZGF0YSxcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgX2lkID0gY3JlYXRlJC5faWQ7XG5cbiAgICAgICAgICAgIC8vIOaPkuWFpeWei+WPt1xuICAgICAgICAgICAgaWYgKCAhIXN0YW5kYXJkcyAmJiBBcnJheS5pc0FycmF5KCBzdGFuZGFyZHMgKSkge1xuICAgICAgICAgICAgICAgIGF3YWl0IFByb21pc2UuYWxsKCBzdGFuZGFyZHMubWFwKCB4ID0+IHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGRiLmNvbGxlY3Rpb24oJ3N0YW5kYXJkcycpLmFkZCh7XG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRhOiBPYmplY3QuYXNzaWduKHsgfSwgeCwge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBpZDogX2lkLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlzRGVsZXRlOiBmYWxzZVxuICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfSkpXG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG5cbiAgICAgICAgICAgIC8vIOabtOaWsFxuICAgICAgICAgICAgY29uc3QgbWV0YSA9IE9iamVjdC5hc3NpZ24oeyB9LCBldmVudC5kYXRhICk7XG4gICAgICAgICAgICBkZWxldGUgbWV0YVsgX2lkIF07XG4gICAgICAgICAgICBjb25zdCB7IHRpdGxlLCBjYXRlZ29yeSwgZGVwb3NpdFByaWNlLCBkZXRhaWwsIGZhZGVQcmljZSwgaW1nLCBsaW1pdCwgc2FsZWQsIFxuICAgICAgICAgICAgICAgIHN0YW5kYXJkcywgdGFnLCB1cGRhdGVUaW1lLCB2aXNpYWJsZSwgcHJpY2UsIGdyb3VwUHJpY2UsIHN0b2NrIH0gPSBtZXRhO1xuICAgICAgICAgICAgYXdhaXQgZGIuY29sbGVjdGlvbignZ29vZHMnKS5kb2MoIF9pZCApLnVwZGF0ZSh7XG4gICAgICAgICAgICAgICAgZGF0YTogeyBcbiAgICAgICAgICAgICAgICAgICAgdGFnLFxuICAgICAgICAgICAgICAgICAgICBpbWcsXG4gICAgICAgICAgICAgICAgICAgIHN0b2NrLFxuICAgICAgICAgICAgICAgICAgICBwcmljZSxcbiAgICAgICAgICAgICAgICAgICAgbGltaXQsXG4gICAgICAgICAgICAgICAgICAgIHRpdGxlLFxuICAgICAgICAgICAgICAgICAgICBkZXRhaWwsXG4gICAgICAgICAgICAgICAgICAgIHNhbGVkLFxuICAgICAgICAgICAgICAgICAgICBncm91cFByaWNlLFxuICAgICAgICAgICAgICAgICAgICBjYXRlZ29yeSxcbiAgICAgICAgICAgICAgICAgICAgZmFkZVByaWNlLFxuICAgICAgICAgICAgICAgICAgICB2aXNpYWJsZSxcbiAgICAgICAgICAgICAgICAgICAgdXBkYXRlVGltZSxcbiAgICAgICAgICAgICAgICAgICAgZGVwb3NpdFByaWNlXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIC8vIDAuIOafpeivouivpeS6p+WTgeW6leS4i+aJgOacieeahOWei+WPt1xuICAgICAgICAgICAgY29uc3QgYWxsU3RhbmRhcmRzJCA9IGF3YWl0IGRiLmNvbGxlY3Rpb24oJ3N0YW5kYXJkcycpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC53aGVyZSh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwaWQ6IF9pZFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAuZ2V0KCApO1xuXG4gICAgICAgICAgICAvLyDpnIDopoHigJzliKDpmaTigJ3nmoTlnovlj7dcbiAgICAgICAgICAgIGNvbnN0IHdvdWxkU2V0RGVsZXRlOiBhbnlbIF0gPSBbIF07XG5cbiAgICAgICAgICAgIC8vIOmcgOimgeKAnOabtOaWsOKAneeahOWei+WPt1xuICAgICAgICAgICAgY29uc3Qgd291bGRVcGRhdGU6IGFueVsgXSA9IFsgXTtcblxuICAgICAgICAgICAgLy8g6ZyA6KaB4oCc5aKe5Yqg4oCd44CB4oCc5pu05paw4oCd55qE5Z6L5Y+3XG4gICAgICAgICAgICBjb25zdCB3b3VsZENyZWF0ZSA9IHN0YW5kYXJkcy5maWx0ZXIoIHggPT4gIXguX2lkICk7XG5cbiAgICAgICAgICAgIGFsbFN0YW5kYXJkcyQuZGF0YS5maWx0ZXIoIHggPT4ge1xuICAgICAgICAgICAgICAgIGlmICggIXN0YW5kYXJkcy5maW5kKCB5ID0+IHkuX2lkID09PSB4Ll9pZCApKSB7XG4gICAgICAgICAgICAgICAgICAgIHdvdWxkU2V0RGVsZXRlLnB1c2goIHggKVxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHdvdWxkVXBkYXRlLnB1c2goIHggKVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAvLyAxLiAg4oCc5Yig6Zmk4oCd6YOo5YiG5Z6L5Y+3XG4gICAgICAgICAgICBhd2FpdCBQcm9taXNlLmFsbCggd291bGRTZXREZWxldGUubWFwKCB4ID0+IHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZGIuY29sbGVjdGlvbignc3RhbmRhcmRzJylcbiAgICAgICAgICAgICAgICAgICAgICAgIC5kb2MoIHguX2lkIClcbiAgICAgICAgICAgICAgICAgICAgICAgIC51cGRhdGUoe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaXNEZWxldGU6IHRydWVcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgfSkpO1xuXG4gICAgICAgICAgICAvLyAyLiDmm7TmlrDpg6jliIblnovlj7fkv6Hmga9cbiAgICAgICAgICAgIGF3YWl0IFByb21pc2UuYWxsKCB3b3VsZFVwZGF0ZS5tYXAoIHggPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IG5ld1RhcmdldCA9IHN0YW5kYXJkcy5maW5kKCB5ID0+IHkuX2lkID09PSB4Ll9pZCApO1xuICAgICAgICAgICAgICAgIGNvbnN0IHsgbmFtZSwgcHJpY2UsIGdyb3VwUHJpY2UsIHN0b2NrLCBpbWcgfSA9IG5ld1RhcmdldDtcbiAgICAgICAgICAgICAgICByZXR1cm4gZGIuY29sbGVjdGlvbignc3RhbmRhcmRzJylcbiAgICAgICAgICAgICAgICAgICAgICAgIC5kb2MoIHguX2lkIClcbiAgICAgICAgICAgICAgICAgICAgICAgIC51cGRhdGUoe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmFtZSwgcHJpY2UsIGdyb3VwUHJpY2UsIHN0b2NrLCBpbWdcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgfSkpO1xuXG4gICAgICAgICAgICAvLyAzLiDmlrDlop7pg6jliIblnovlj7dcbiAgICAgICAgICAgIGF3YWl0IFByb21pc2UuYWxsKCB3b3VsZENyZWF0ZS5tYXAoIHggPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiBkYi5jb2xsZWN0aW9uKCdzdGFuZGFyZHMnKS5hZGQoe1xuICAgICAgICAgICAgICAgICAgICBkYXRhOiBPYmplY3QuYXNzaWduKHsgfSwgeCwge1xuICAgICAgICAgICAgICAgICAgICAgICAgcGlkOiBfaWQsXG4gICAgICAgICAgICAgICAgICAgICAgICBpc0RlbGV0ZTogZmFsc2VcbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgfSkpO1xuXG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoIHJlc29sdmUgPT4ge1xuICAgICAgICAgICAgcmVzb2x2ZSh7XG4gICAgICAgICAgICAgICAgZGF0YTogX2lkLFxuICAgICAgICAgICAgICAgIHN0YXR1czogMjAwXG4gICAgICAgICAgICB9KVxuICAgICAgICB9KVxuXG4gICAgfSBjYXRjaCAoIGUgKSB7XG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgoIHJlc29sdmUsIHJlamVjdCApID0+IHtcbiAgICAgICAgICAgIHJlamVjdCh7XG4gICAgICAgICAgICAgICAgc3RhdHVzOiA1MDAsXG4gICAgICAgICAgICAgICAgbWVzc2FnZTogZVxuICAgICAgICAgICAgfSlcbiAgICAgICAgfSlcbiAgICB9XG5cbn0iXX0=