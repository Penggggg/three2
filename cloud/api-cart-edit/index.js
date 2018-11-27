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
    var _id_1, _a, pid, standarad_id, openid, find$, result, create$, e_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 6, , 7]);
                _id_1 = '';
                _a = event.data, pid = _a.pid, standarad_id = _a.standarad_id;
                openid = event.userInfo.openId;
                return [4, db.collection('cart')
                        .where({
                        pid: pid,
                        openid: openid,
                        standarad_id: standarad_id,
                    })
                        .get()];
            case 1:
                find$ = _b.sent();
                result = find$.data[0];
                if (!!result) return [3, 3];
                return [4, db.collection('cart').add({
                        data: Object.assign({}, event.data, {
                            openid: openid
                        })
                    })];
            case 2:
                create$ = _b.sent();
                _id_1 = create$._id;
                return [3, 5];
            case 3: return [4, db.collection('cart').doc(result._id).update({
                    data: event.data
                })];
            case 4:
                _b.sent();
                _id_1 = find$.data[0]._id;
                _b.label = 5;
            case 5: return [2, new Promise(function (resolve) {
                    resolve({
                        data: _id_1,
                        status: 200
                    });
                })];
            case 6:
                e_1 = _b.sent();
                return [2, new Promise(function (resolve) {
                        resolve({
                            status: 500,
                            data: JSON.stringify(e_1)
                        });
                    })];
            case 7: return [2];
        }
    });
}); };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFDQSxpQkEwRUM7O0FBMUVELHFDQUF1QztBQUV2QyxLQUFLLENBQUMsSUFBSSxFQUFFLENBQUM7QUFFYixJQUFNLEVBQUUsR0FBZ0IsS0FBSyxDQUFDLFFBQVEsRUFBRSxDQUFDO0FBbUI1QixRQUFBLElBQUksR0FBRyxVQUFPLEtBQUssRUFBRSxPQUFPOzs7Ozs7Z0JBSTdCLFFBQVcsRUFBRSxDQUFDO2dCQUNkLEtBQXdCLEtBQUssQ0FBQyxJQUFJLEVBQWhDLEdBQUcsU0FBQSxFQUFFLFlBQVksa0JBQUEsQ0FBZ0I7Z0JBQ2pDLE1BQU0sR0FBRyxLQUFLLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQztnQkFHdkIsV0FBTSxFQUFFLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQzt5QkFDaEMsS0FBSyxDQUFDO3dCQUNILEdBQUcsS0FBQTt3QkFDSCxNQUFNLFFBQUE7d0JBQ04sWUFBWSxjQUFBO3FCQUNmLENBQUM7eUJBQ0QsR0FBRyxFQUFHLEVBQUE7O2dCQU5ULEtBQUssR0FBRyxTQU1DO2dCQUNULE1BQU0sR0FBRyxLQUFLLENBQUMsSUFBSSxDQUFFLENBQUMsQ0FBRSxDQUFDO3FCQUUxQixDQUFDLE1BQU0sRUFBUCxjQUFPO2dCQUVRLFdBQU0sRUFBRSxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUMsQ0FBQyxHQUFHLENBQUM7d0JBQzVDLElBQUksRUFBRSxNQUFNLENBQUMsTUFBTSxDQUFDLEVBQUcsRUFBRSxLQUFLLENBQUMsSUFBSSxFQUFFOzRCQUNqQyxNQUFNLFFBQUE7eUJBQ1QsQ0FBQztxQkFDTCxDQUFDLEVBQUE7O2dCQUpJLE9BQU8sR0FBRyxTQUlkO2dCQUVGLEtBQUcsR0FBRyxPQUFPLENBQUMsR0FBRyxDQUFDOztvQkFJbEIsV0FBTSxFQUFFLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQyxDQUFDLEdBQUcsQ0FBRyxNQUFjLENBQUMsR0FBRyxDQUFFLENBQUMsTUFBTSxDQUFDO29CQUMxRCxJQUFJLEVBQUUsS0FBSyxDQUFDLElBQUk7aUJBQ25CLENBQUMsRUFBQTs7Z0JBRkYsU0FFRSxDQUFBO2dCQUNGLEtBQUcsR0FBRyxLQUFLLENBQUMsSUFBSSxDQUFFLENBQUMsQ0FBRSxDQUFDLEdBQUcsQ0FBQzs7b0JBRzlCLFdBQU8sSUFBSSxPQUFPLENBQUUsVUFBQSxPQUFPO29CQUN2QixPQUFPLENBQUM7d0JBQ0osSUFBSSxFQUFFLEtBQUc7d0JBQ1QsTUFBTSxFQUFFLEdBQUc7cUJBQ2QsQ0FBQyxDQUFDO2dCQUNQLENBQUMsQ0FBQyxFQUFDOzs7Z0JBRUgsV0FBTyxJQUFJLE9BQU8sQ0FBRSxVQUFBLE9BQU87d0JBQ3ZCLE9BQU8sQ0FBQzs0QkFDSixNQUFNLEVBQUUsR0FBRzs0QkFDWCxJQUFJLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBRSxHQUFDLENBQUU7eUJBQzVCLENBQUMsQ0FBQztvQkFDUCxDQUFDLENBQUMsRUFBQzs7OztLQUdWLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyIvLyDkupHlh73mlbDlhaXlj6Pmlofku7ZcbmltcG9ydCAqIGFzIGNsb3VkIGZyb20gJ3d4LXNlcnZlci1zZGsnO1xuXG5jbG91ZC5pbml0KCk7XG5cbmNvbnN0IGRiOiBEQi5EYXRhYmFzZSA9IGNsb3VkLmRhdGFiYXNlKCk7XG5cblxuLyoqXG4gKiDliJvlu7rjgIHnvJbovpHljZXkuKrotK3nianovaZpdGVtXG4gKiByZXE6IHtcbiAqICAgICAgX2lkXG4gKiAgICAgIG9wZW5pZFxuICogICAgICBwaWQ6IOWVhuWTgWlkXG4gKiAgICAgIGNvdW50OiDpgInotK3mlbDph49cbiAqICAgICAgc3RhbmRhcmFkX2lkOiDlnovlj7dpZFxuICogICAgICBjdXJyZW50X3ByaWNlOiDlvZPml7bnmoTku7fmoLxcbiAqIH1cbiAqIFxuICogcmVzOiB7XG4gKiAgICAgIHN0YXR1czogMjAwLzUwMFxuICogICAgICBkYXRhOiDotK3nianovaZpZFxuICogfVxuICovXG5leHBvcnQgY29uc3QgbWFpbiA9IGFzeW5jIChldmVudCwgY29udGV4dCkgPT4ge1xuXG4gICAgdHJ5IHtcblxuICAgICAgICBsZXQgX2lkOiBhbnkgPSAnJztcbiAgICAgICAgbGV0IHsgcGlkLCBzdGFuZGFyYWRfaWQgfSA9IGV2ZW50LmRhdGE7XG4gICAgICAgIGNvbnN0IG9wZW5pZCA9IGV2ZW50LnVzZXJJbmZvLm9wZW5JZDtcblxuICAgICAgICAvLyDlhYjnlKhzaWQgKyBwaWTmn6Xor6LmnInmsqHmnInlt7LmnInnmoRjYXJ077yM5pyJ5YiZ5pu05paw77yM5peg5YiZ5Yib5bu6XG4gICAgICAgIGNvbnN0IGZpbmQkID0gYXdhaXQgZGIuY29sbGVjdGlvbignY2FydCcpXG4gICAgICAgICAgICAgICAgLndoZXJlKHtcbiAgICAgICAgICAgICAgICAgICAgcGlkLFxuICAgICAgICAgICAgICAgICAgICBvcGVuaWQsXG4gICAgICAgICAgICAgICAgICAgIHN0YW5kYXJhZF9pZCxcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIC5nZXQoICk7XG4gICAgICAgIGNvbnN0IHJlc3VsdCA9IGZpbmQkLmRhdGFbIDAgXTtcblxuICAgICAgICBpZiAoICFyZXN1bHQgKSB7XG4gICAgICAgICAgICAvLyDliJvlu7pcbiAgICAgICAgICAgIGNvbnN0IGNyZWF0ZSQgPSBhd2FpdCBkYi5jb2xsZWN0aW9uKCdjYXJ0JykuYWRkKHtcbiAgICAgICAgICAgICAgICBkYXRhOiBPYmplY3QuYXNzaWduKHsgfSwgZXZlbnQuZGF0YSwge1xuICAgICAgICAgICAgICAgICAgICBvcGVuaWRcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIF9pZCA9IGNyZWF0ZSQuX2lkO1xuXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAvLyDnvJbovpFcbiAgICAgICAgICAgIGF3YWl0IGRiLmNvbGxlY3Rpb24oJ2NhcnQnKS5kb2MoIChyZXN1bHQgYXMgYW55KS5faWQgKS51cGRhdGUoe1xuICAgICAgICAgICAgICAgIGRhdGE6IGV2ZW50LmRhdGFcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICBfaWQgPSBmaW5kJC5kYXRhWyAwIF0uX2lkO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKCByZXNvbHZlID0+IHtcbiAgICAgICAgICAgIHJlc29sdmUoe1xuICAgICAgICAgICAgICAgIGRhdGE6IF9pZCxcbiAgICAgICAgICAgICAgICBzdGF0dXM6IDIwMFxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH0gY2F0Y2goIGUgKSB7XG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSggcmVzb2x2ZSA9PiB7XG4gICAgICAgICAgICByZXNvbHZlKHtcbiAgICAgICAgICAgICAgICBzdGF0dXM6IDUwMCxcbiAgICAgICAgICAgICAgICBkYXRhOiBKU09OLnN0cmluZ2lmeSggZSApXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG59Il19