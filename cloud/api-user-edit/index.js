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
    var openid, data$, meta, e_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 6, , 7]);
                openid = event.userInfo.openId;
                return [4, db.collection('user')
                        .where({
                        openid: openid
                    })
                        .get()
                        .catch(function (err) { throw "" + err; })];
            case 1:
                data$ = _a.sent();
                if (!(data$.data.length === 0)) return [3, 3];
                return [4, db.collection('user')
                        .add({
                        data: Object.assign({}, event.data, { openid: openid })
                    }).catch(function (err) { throw "" + err; })];
            case 2:
                _a.sent();
                return [3, 5];
            case 3:
                meta = Object.assign({}, data$.data[0], event.data);
                delete meta._id;
                return [4, db.collection('user').doc(data$.data[0]._id)
                        .set({
                        data: meta
                    }).catch(function (err) { throw "" + err; })];
            case 4:
                _a.sent();
                _a.label = 5;
            case 5: return [2, new Promise(function (resolve) {
                    resolve({
                        status: 200
                    });
                })];
            case 6:
                e_1 = _a.sent();
                return [2, new Promise(function (resolve, reject) {
                        resolve({
                            status: 500,
                            message: e_1
                        });
                    })];
            case 7: return [2];
        }
    });
}); };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFDQSxpQkFnRUM7O0FBaEVELHFDQUF1QztBQUV2QyxLQUFLLENBQUMsSUFBSSxFQUFFLENBQUM7QUFFYixJQUFNLEVBQUUsR0FBZ0IsS0FBSyxDQUFDLFFBQVEsRUFBRSxDQUFDO0FBYzVCLFFBQUEsSUFBSSxHQUFHLFVBQVEsS0FBSyxFQUFFLE9BQU87Ozs7OztnQkFJaEMsTUFBTSxHQUFHLEtBQUssQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDO2dCQUN2QixXQUFNLEVBQUUsQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDO3lCQUNwQyxLQUFLLENBQUM7d0JBQ0gsTUFBTSxRQUFBO3FCQUNULENBQUM7eUJBQ0QsR0FBRyxFQUFHO3lCQUNOLEtBQUssQ0FBRSxVQUFBLEdBQUcsSUFBTSxNQUFNLEtBQUcsR0FBSyxDQUFBLENBQUEsQ0FBQyxDQUFDLEVBQUE7O2dCQUwvQixLQUFLLEdBQUcsU0FLdUI7cUJBR2hDLENBQUEsS0FBSyxDQUFDLElBQUksQ0FBQyxNQUFNLEtBQUssQ0FBQyxDQUFBLEVBQXZCLGNBQXVCO2dCQUV4QixXQUFNLEVBQUUsQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDO3lCQUN0QixHQUFHLENBQUM7d0JBQ0QsSUFBSSxFQUFFLE1BQU0sQ0FBQyxNQUFNLENBQUMsRUFBRyxFQUFFLEtBQUssQ0FBQyxJQUFJLEVBQUUsRUFBRSxNQUFNLFFBQUEsRUFBRSxDQUFDO3FCQUNuRCxDQUFDLENBQUMsS0FBSyxDQUFFLFVBQUEsR0FBRyxJQUFNLE1BQU0sS0FBRyxHQUFLLENBQUEsQ0FBQSxDQUFDLENBQUMsRUFBQTs7Z0JBSHZDLFNBR3VDLENBQUM7OztnQkFJbEMsSUFBSSxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUMsRUFBRyxFQUFFLEtBQUssQ0FBQyxJQUFJLENBQUUsQ0FBQyxDQUFFLEVBQUUsS0FBSyxDQUFDLElBQUksQ0FBRSxDQUFDO2dCQUM5RCxPQUFPLElBQUksQ0FBQyxHQUFHLENBQUM7Z0JBRWhCLFdBQU0sRUFBRSxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUMsQ0FBQyxHQUFHLENBQUcsS0FBSyxDQUFDLElBQUksQ0FBRSxDQUFDLENBQVUsQ0FBQyxHQUFHLENBQUU7eUJBQzFELEdBQUcsQ0FBQzt3QkFDRCxJQUFJLEVBQUUsSUFBSTtxQkFDYixDQUFDLENBQUMsS0FBSyxDQUFFLFVBQUEsR0FBRyxJQUFNLE1BQU0sS0FBRyxHQUFLLENBQUEsQ0FBQSxDQUFDLENBQUMsRUFBQTs7Z0JBSHZDLFNBR3VDLENBQUM7O29CQUc1QyxXQUFPLElBQUksT0FBTyxDQUFFLFVBQUEsT0FBTztvQkFDdkIsT0FBTyxDQUFDO3dCQUNKLE1BQU0sRUFBRSxHQUFHO3FCQUNkLENBQUMsQ0FBQTtnQkFDTixDQUFDLENBQUMsRUFBQTs7O2dCQUdBLFdBQU8sSUFBSSxPQUFPLENBQUMsVUFBRSxPQUFPLEVBQUUsTUFBTTt3QkFDbEMsT0FBTyxDQUFDOzRCQUNGLE1BQU0sRUFBRSxHQUFHOzRCQUNYLE9BQU8sRUFBRSxHQUFDO3lCQUNiLENBQUMsQ0FBQTtvQkFDTixDQUFDLENBQUMsRUFBQTs7OztLQUdQLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyIvLyDkupHlh73mlbDlhaXlj6Pmlofku7ZcbmltcG9ydCAqIGFzIGNsb3VkIGZyb20gJ3d4LXNlcnZlci1zZGsnO1xuXG5jbG91ZC5pbml0KCk7XG5cbmNvbnN0IGRiOiBEQi5EYXRhYmFzZSA9IGNsb3VkLmRhdGFiYXNlKCk7XG5cbi8qKlxuICogQGRlc2NyaXB0aW9uIOWIm+W7uuOAgee8lui+ke+8jOW+ruS/oeeUqOaIt+S/oeaBr1xuICogLS0tLS0tLS0g6K+35rGCIC0tLS0tLS0tLS1cbiAqIHtcbiAqICAgICAgYXZhdGFyOiAuLi4sXG4gKiAgICAgIG5pY2tuYW1lOiAuLi5cbiAqIH1cbiAqIC0tLS0tLS0tLS0g6L+U5ZueIC0tLS0tLS0tXG4gKiB7XG4gKiAgICAgIHN0YXR1c1xuICogfVxuICovXG5leHBvcnQgY29uc3QgbWFpbiA9IGFzeW5jICggZXZlbnQsIGNvbnRleHQgKSA9PiB7XG5cbiAgdHJ5IHtcblxuICAgIGNvbnN0IG9wZW5pZCA9IGV2ZW50LnVzZXJJbmZvLm9wZW5JZDtcbiAgICBjb25zdCBkYXRhJCA9IGF3YWl0IGRiLmNvbGxlY3Rpb24oJ3VzZXInKVxuICAgICAgICAud2hlcmUoe1xuICAgICAgICAgICAgb3BlbmlkXG4gICAgICAgIH0pXG4gICAgICAgIC5nZXQoIClcbiAgICAgICAgLmNhdGNoKCBlcnIgPT4geyB0aHJvdyBgJHtlcnJ9YH0pO1xuXG4gICAgLy8g5aaC5p6c5LiN5a2Y5Zyo77yM5YiZ5Yib5bu6XG4gICAgaWYgKCBkYXRhJC5kYXRhLmxlbmd0aCA9PT0gMCApIHtcblxuICAgICAgICBhd2FpdCBkYi5jb2xsZWN0aW9uKCd1c2VyJylcbiAgICAgICAgICAgIC5hZGQoe1xuICAgICAgICAgICAgICAgIGRhdGE6IE9iamVjdC5hc3NpZ24oeyB9LCBldmVudC5kYXRhLCB7IG9wZW5pZCB9KVxuICAgICAgICAgICAgfSkuY2F0Y2goIGVyciA9PiB7IHRocm93IGAke2Vycn1gfSk7XG5cbiAgICAvLyDlpoLmnpzlrZjlnKjvvIzliJnmm7TmlrBcbiAgICB9IGVsc2Uge1xuICAgICAgICBjb25zdCBtZXRhID0gT2JqZWN0LmFzc2lnbih7IH0sIGRhdGEkLmRhdGFbIDAgXSwgZXZlbnQuZGF0YSApO1xuICAgICAgICBkZWxldGUgbWV0YS5faWQ7XG4gICAgICAgIFxuICAgICAgICBhd2FpdCBkYi5jb2xsZWN0aW9uKCd1c2VyJykuZG9jKCggZGF0YSQuZGF0YVsgMCBdIGFzIGFueSkuX2lkIClcbiAgICAgICAgICAgIC5zZXQoe1xuICAgICAgICAgICAgICAgIGRhdGE6IG1ldGFcbiAgICAgICAgICAgIH0pLmNhdGNoKCBlcnIgPT4geyB0aHJvdyBgJHtlcnJ9YH0pO1xuICAgIH0gICAgXG5cbiAgICByZXR1cm4gbmV3IFByb21pc2UoIHJlc29sdmUgPT4ge1xuICAgICAgICByZXNvbHZlKHtcbiAgICAgICAgICAgIHN0YXR1czogMjAwXG4gICAgICAgIH0pXG4gICAgfSlcblxuICB9IGNhdGNoICggZSApIHtcbiAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgoIHJlc29sdmUsIHJlamVjdCApID0+IHtcbiAgICAgICAgcmVzb2x2ZSh7XG4gICAgICAgICAgICAgIHN0YXR1czogNTAwLFxuICAgICAgICAgICAgICBtZXNzYWdlOiBlXG4gICAgICAgICAgfSlcbiAgICAgIH0pXG4gIH1cblxufSJdfQ==