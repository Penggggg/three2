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
    var _id_1, standards, create$, meta, title, category, depositPrice, detail, fadePrice, img, limit, saled, standards, tag, updateTime, visiable, price, groupPrice, stock, e_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 7, , 8]);
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
                                pid: _id_1
                            })
                        });
                    }))];
            case 2:
                _a.sent();
                _a.label = 3;
            case 3: return [3, 6];
            case 4:
                meta = Object.assign({}, event.data);
                delete meta[_id_1];
                title = meta.title, category = meta.category, depositPrice = meta.depositPrice, detail = meta.detail, fadePrice = meta.fadePrice, img = meta.img, limit = meta.limit, saled = meta.saled, standards = meta.standards, tag = meta.tag, updateTime = meta.updateTime, visiable = meta.visiable, price = meta.price, groupPrice = meta.groupPrice, stock = meta.stock;
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
                            standards: standards,
                            visiable: visiable,
                            updateTime: updateTime,
                            depositPrice: depositPrice
                        }
                    })];
            case 5:
                _a.sent();
                _a.label = 6;
            case 6: return [2, new Promise(function (resolve) {
                    resolve({
                        data: _id_1,
                        status: 200
                    });
                })];
            case 7:
                e_1 = _a.sent();
                return [2, new Promise(function (resolve, reject) {
                        reject({
                            status: 500,
                            message: e_1
                        });
                    })];
            case 8: return [2];
        }
    });
}); };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFDQSxpQkF5R0M7O0FBekdELHFDQUF1QztBQUV2QyxLQUFLLENBQUMsSUFBSSxFQUFFLENBQUM7QUFFYixJQUFNLEVBQUUsR0FBZ0IsS0FBSyxDQUFDLFFBQVEsRUFBRSxDQUFDO0FBaUM1QixRQUFBLElBQUksR0FBRyxVQUFRLEtBQUssRUFBRSxPQUFPOzs7Ozs7Z0JBRzlCLFFBQU0sS0FBSyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUM7cUJBQ3BCLENBQUMsS0FBRyxFQUFKLGNBQUk7Z0JBRUcsU0FBUyxHQUFLLEtBQUssQ0FBQyxJQUFJLFVBQWYsQ0FBZ0I7Z0JBRWpDLE9BQU8sS0FBSyxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQztnQkFFZixXQUFNLEVBQUUsQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLENBQUMsR0FBRyxDQUFDO3dCQUM3QyxJQUFJLEVBQUUsS0FBSyxDQUFDLElBQUk7cUJBQ25CLENBQUMsRUFBQTs7Z0JBRkksT0FBTyxHQUFHLFNBRWQ7Z0JBQ0YsS0FBRyxHQUFHLE9BQU8sQ0FBQyxHQUFHLENBQUM7cUJBR2IsQ0FBQSxDQUFDLENBQUMsU0FBUyxJQUFJLEtBQUssQ0FBQyxPQUFPLENBQUUsU0FBUyxDQUFFLENBQUEsRUFBekMsY0FBeUM7Z0JBQzFDLFdBQU0sT0FBTyxDQUFDLEdBQUcsQ0FBRSxTQUFTLENBQUMsR0FBRyxDQUFFLFVBQUEsQ0FBQzt3QkFDL0IsT0FBTyxFQUFFLENBQUMsVUFBVSxDQUFDLFdBQVcsQ0FBQyxDQUFDLEdBQUcsQ0FBQzs0QkFDbEMsSUFBSSxFQUFFLE1BQU0sQ0FBQyxNQUFNLENBQUMsRUFBRyxFQUFFLENBQUMsRUFBRTtnQ0FDeEIsR0FBRyxFQUFFLEtBQUc7NkJBQ1gsQ0FBQzt5QkFDTCxDQUFDLENBQUM7b0JBQ1AsQ0FBQyxDQUFDLENBQUMsRUFBQTs7Z0JBTkgsU0FNRyxDQUFBOzs7O2dCQUlELElBQUksR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDLEVBQUcsRUFBRSxLQUFLLENBQUMsSUFBSSxDQUFFLENBQUM7Z0JBQzdDLE9BQU8sSUFBSSxDQUFFLEtBQUcsQ0FBRSxDQUFDO2dCQUNYLEtBQUssR0FDMEQsSUFBSSxNQUQ5RCxFQUFFLFFBQVEsR0FDZ0QsSUFBSSxTQURwRCxFQUFFLFlBQVksR0FDa0MsSUFBSSxhQUR0QyxFQUFFLE1BQU0sR0FDMEIsSUFBSSxPQUQ5QixFQUFFLFNBQVMsR0FDZSxJQUFJLFVBRG5CLEVBQUUsR0FBRyxHQUNVLElBQUksSUFEZCxFQUFFLEtBQUssR0FDRyxJQUFJLE1BRFAsRUFBRSxLQUFLLEdBQ0osSUFBSSxNQURBLEVBQ3ZFLFNBQVMsR0FBMEQsSUFBSSxVQUE5RCxFQUFFLEdBQUcsR0FBcUQsSUFBSSxJQUF6RCxFQUFFLFVBQVUsR0FBeUMsSUFBSSxXQUE3QyxFQUFFLFFBQVEsR0FBK0IsSUFBSSxTQUFuQyxFQUFFLEtBQUssR0FBd0IsSUFBSSxNQUE1QixFQUFFLFVBQVUsR0FBWSxJQUFJLFdBQWhCLEVBQUUsS0FBSyxHQUFLLElBQUksTUFBVCxDQUFVO2dCQUM1RSxXQUFNLEVBQUUsQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLENBQUMsR0FBRyxDQUFFLEtBQUcsQ0FBRSxDQUFDLE1BQU0sQ0FBQzt3QkFDM0MsSUFBSSxFQUFFOzRCQUNGLEdBQUcsS0FBQTs0QkFDSCxHQUFHLEtBQUE7NEJBQ0gsS0FBSyxPQUFBOzRCQUNMLEtBQUssT0FBQTs0QkFDTCxLQUFLLE9BQUE7NEJBQ0wsS0FBSyxPQUFBOzRCQUNMLE1BQU0sUUFBQTs0QkFDTixLQUFLLE9BQUE7NEJBQ0wsVUFBVSxZQUFBOzRCQUNWLFFBQVEsVUFBQTs0QkFDUixTQUFTLFdBQUE7NEJBQ1QsU0FBUyxXQUFBOzRCQUNULFFBQVEsVUFBQTs0QkFDUixVQUFVLFlBQUE7NEJBQ1YsWUFBWSxjQUFBO3lCQUNmO3FCQUNKLENBQUMsRUFBQTs7Z0JBbEJGLFNBa0JFLENBQUM7O29CQUdQLFdBQU8sSUFBSSxPQUFPLENBQUUsVUFBQSxPQUFPO29CQUN2QixPQUFPLENBQUM7d0JBQ0osSUFBSSxFQUFFLEtBQUc7d0JBQ1QsTUFBTSxFQUFFLEdBQUc7cUJBQ2QsQ0FBQyxDQUFBO2dCQUNOLENBQUMsQ0FBQyxFQUFBOzs7Z0JBR0YsV0FBTyxJQUFJLE9BQU8sQ0FBQyxVQUFFLE9BQU8sRUFBRSxNQUFNO3dCQUNoQyxNQUFNLENBQUM7NEJBQ0gsTUFBTSxFQUFFLEdBQUc7NEJBQ1gsT0FBTyxFQUFFLEdBQUM7eUJBQ2IsQ0FBQyxDQUFBO29CQUNOLENBQUMsQ0FBQyxFQUFBOzs7O0tBR1QsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbIi8vIOS6keWHveaVsOWFpeWPo+aWh+S7tlxuaW1wb3J0ICogYXMgY2xvdWQgZnJvbSAnd3gtc2VydmVyLXNkayc7XG5cbmNsb3VkLmluaXQoKTtcblxuY29uc3QgZGI6IERCLkRhdGFiYXNlID0gY2xvdWQuZGF0YWJhc2UoKTtcblxuLyoqXG4gKiBAZGVzY3JpcHRpb24g5Yib5bu6L+e8lui+keWVhuWTgVxuICogLS0tLS0tLS0g6K+35rGCIC0tLS0tLS0tLS1cbiAqIHtcbiAqICAgICAgX2lkOiBpZFxuICogICAgICB0aXRsZTog5ZWG5ZOB5ZCN56ewIFN0cmluZ1xuICogICAgICBkZXRhaWwhOiDllYblk4Hmj4/ov7AgU3RyaW5nXG4gKiAgICAgIHRhZzog5ZWG5ZOB5qCH562+IEFycmF5PFN0cmluZz5cbiAqICAgICAgY2F0ZWdvcnk6IOWVhuWTgeexu+ebriBTdHJpbmdcbiAqICAgICAgaW1nOiDllYblk4Hlm77niYcgQXJyYXk8U3RyaW5nPlxuICogICAgICBwcmljZTog5Lu35qC8IE51bWJlclxuICogICAgICBmYWRlUHJpY2U6IOWIkue6v+S7tyBOdW1iZXJcbiAqICAgICAgZ3JvdXBQcmljZSE6IOWboui0reS7tyBOdW1iZXJcbiAqICAgICAgc3RvY2shOiDlupPlrZggTnVtYmVyXG4gKiAgICAgIGRlcG9zaXRQcmljZSE6IOWVhuWTgeiuoumHkSBOdW1iZXJcbiAqICAgICAgbGltaXQhOiDpmZDotK3mlbDph48gTnVtYmVyXG4gKiAgICAgIHZpc2lhYmxlOiDmmK/lkKbkuIrmnrYgQm9vbGVhblxuICogICAgICBzYWxlZDog6ZSA6YePIE51bWJlclxuICogICAgICBzdGFuZGFyZHMhOiDlnovlj7fop4TmoLwgQXJyYXk8eyBcbiAqICAgICAgICAgIG5hbWU6IFN0cmluZyxcbiAqICAgICAgICAgIHByaWNlOiBOdW1iZXIsXG4gKiAgICAgICAgICBncm91cFByaWNlITogTnVtYmVyLFxuICogICAgICAgICAgc3RvY2shOiBOdW1iZXI6XG4gKiAgICAgICAgICBpbWc6IFN0cmluZyBcbiAqICAgICAgfT5cbiAqIH1cbiAqIC0tLS0tLS0tIOivt+axgiAtLS0tLS0tLS0tXG4gKiB7XG4gKiAgICAgIHN0YXR1czogMjAwIC8gNTAwXG4gKiB9XG4gKi9cbmV4cG9ydCBjb25zdCBtYWluID0gYXN5bmMgKCBldmVudCwgY29udGV4dCkgPT4ge1xuXG4gICAgdHJ5IHtcbiAgICAgICAgbGV0IF9pZCA9IGV2ZW50LmRhdGEuX2lkO1xuICAgICAgICBpZiAoICFfaWQgKSB7XG4gICAgICAgICAgICAvLyDliJvlu7pcbiAgICAgICAgICAgIGNvbnN0IHsgc3RhbmRhcmRzIH0gPSBldmVudC5kYXRhO1xuXG4gICAgICAgICAgICBkZWxldGUgZXZlbnQuZGF0YVsnc3RhbmRhcmRzJ107XG5cbiAgICAgICAgICAgIGNvbnN0IGNyZWF0ZSQgPSBhd2FpdCBkYi5jb2xsZWN0aW9uKCdnb29kcycpLmFkZCh7XG4gICAgICAgICAgICAgICAgZGF0YTogZXZlbnQuZGF0YSxcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgX2lkID0gY3JlYXRlJC5faWQ7XG5cbiAgICAgICAgICAgIC8vIOaPkuWFpeWei+WPt1xuICAgICAgICAgICAgaWYgKCAhIXN0YW5kYXJkcyAmJiBBcnJheS5pc0FycmF5KCBzdGFuZGFyZHMgKSkge1xuICAgICAgICAgICAgICAgIGF3YWl0IFByb21pc2UuYWxsKCBzdGFuZGFyZHMubWFwKCB4ID0+IHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGRiLmNvbGxlY3Rpb24oJ3N0YW5kYXJkcycpLmFkZCh7XG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRhOiBPYmplY3QuYXNzaWduKHsgfSwgeCwge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBpZDogX2lkXG4gICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9KSlcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIC8vIOabtOaWsFxuICAgICAgICAgICAgY29uc3QgbWV0YSA9IE9iamVjdC5hc3NpZ24oeyB9LCBldmVudC5kYXRhICk7XG4gICAgICAgICAgICBkZWxldGUgbWV0YVsgX2lkIF07XG4gICAgICAgICAgICBjb25zdCB7IHRpdGxlLCBjYXRlZ29yeSwgZGVwb3NpdFByaWNlLCBkZXRhaWwsIGZhZGVQcmljZSwgaW1nLCBsaW1pdCwgc2FsZWQsIFxuICAgICAgICAgICAgICAgIHN0YW5kYXJkcywgdGFnLCB1cGRhdGVUaW1lLCB2aXNpYWJsZSwgcHJpY2UsIGdyb3VwUHJpY2UsIHN0b2NrIH0gPSBtZXRhO1xuICAgICAgICAgICAgYXdhaXQgZGIuY29sbGVjdGlvbignZ29vZHMnKS5kb2MoIF9pZCApLnVwZGF0ZSh7XG4gICAgICAgICAgICAgICAgZGF0YTogeyBcbiAgICAgICAgICAgICAgICAgICAgdGFnLFxuICAgICAgICAgICAgICAgICAgICBpbWcsXG4gICAgICAgICAgICAgICAgICAgIHN0b2NrLFxuICAgICAgICAgICAgICAgICAgICBwcmljZSxcbiAgICAgICAgICAgICAgICAgICAgbGltaXQsXG4gICAgICAgICAgICAgICAgICAgIHRpdGxlLFxuICAgICAgICAgICAgICAgICAgICBkZXRhaWwsXG4gICAgICAgICAgICAgICAgICAgIHNhbGVkLFxuICAgICAgICAgICAgICAgICAgICBncm91cFByaWNlLFxuICAgICAgICAgICAgICAgICAgICBjYXRlZ29yeSxcbiAgICAgICAgICAgICAgICAgICAgZmFkZVByaWNlLFxuICAgICAgICAgICAgICAgICAgICBzdGFuZGFyZHMsXG4gICAgICAgICAgICAgICAgICAgIHZpc2lhYmxlLFxuICAgICAgICAgICAgICAgICAgICB1cGRhdGVUaW1lLFxuICAgICAgICAgICAgICAgICAgICBkZXBvc2l0UHJpY2VcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSggcmVzb2x2ZSA9PiB7XG4gICAgICAgICAgICByZXNvbHZlKHtcbiAgICAgICAgICAgICAgICBkYXRhOiBfaWQsXG4gICAgICAgICAgICAgICAgc3RhdHVzOiAyMDBcbiAgICAgICAgICAgIH0pXG4gICAgICAgIH0pXG5cbiAgICB9IGNhdGNoICggZSApIHtcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKCggcmVzb2x2ZSwgcmVqZWN0ICkgPT4ge1xuICAgICAgICAgICAgcmVqZWN0KHtcbiAgICAgICAgICAgICAgICBzdGF0dXM6IDUwMCxcbiAgICAgICAgICAgICAgICBtZXNzYWdlOiBlXG4gICAgICAgICAgICB9KVxuICAgICAgICB9KVxuICAgIH1cblxufSJdfQ==