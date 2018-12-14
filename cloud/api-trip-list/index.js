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
    var limit_1, search$, search, total$_1, data$_1, e_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                limit_1 = 20;
                search$ = event.search || '';
                search = new RegExp(search$.replace(/\s+/g, ""), 'i');
                return [4, db.collection('trip')
                        .where({
                        title: search
                    })
                        .count()];
            case 1:
                total$_1 = _a.sent();
                return [4, db.collection('trip')
                        .where({
                        title: search
                    })
                        .limit(limit_1)
                        .skip((event.page - 1) * limit_1)
                        .orderBy('updateTime', 'desc')
                        .get()];
            case 2:
                data$_1 = _a.sent();
                return [2, new Promise(function (resolve) {
                        resolve({
                            status: 200,
                            data: {
                                search: event.title.replace(/\s+/g),
                                pageSize: limit_1,
                                page: event.page,
                                data: data$_1.data,
                                total: total$_1.total,
                                totalPage: Math.ceil(total$_1.total / limit_1)
                            }
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFDQSxpQkF3RUM7O0FBeEVELHFDQUF1QztBQUV2QyxLQUFLLENBQUMsSUFBSSxFQUFFLENBQUM7QUFFYixJQUFNLEVBQUUsR0FBZ0IsS0FBSyxDQUFDLFFBQVEsRUFBRSxDQUFDO0FBa0I1QixRQUFBLElBQUksR0FBRyxVQUFPLEtBQUssRUFBRSxPQUFPOzs7Ozs7Z0JBSy9CLFVBQVEsRUFBRSxDQUFDO2dCQUNYLE9BQU8sR0FBRyxLQUFLLENBQUMsTUFBTSxJQUFJLEVBQUUsQ0FBQztnQkFDN0IsTUFBTSxHQUFHLElBQUksTUFBTSxDQUFFLE9BQU8sQ0FBQyxPQUFPLENBQUMsTUFBTSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDO2dCQUc5QyxXQUFNLEVBQUUsQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDO3lCQUNyQyxLQUFLLENBQUM7d0JBQ0gsS0FBSyxFQUFFLE1BQU07cUJBQ2hCLENBQUM7eUJBQ0QsS0FBSyxFQUFHLEVBQUE7O2dCQUpQLFdBQVMsU0FJRjtnQkFHQyxXQUFNLEVBQUUsQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDO3lCQUNwQyxLQUFLLENBQUM7d0JBQ0gsS0FBSyxFQUFFLE1BQU07cUJBQ2hCLENBQUM7eUJBQ0QsS0FBSyxDQUFFLE9BQUssQ0FBRTt5QkFDZCxJQUFJLENBQUMsQ0FBRSxLQUFLLENBQUMsSUFBSSxHQUFHLENBQUMsQ0FBRSxHQUFHLE9BQUssQ0FBRTt5QkFDakMsT0FBTyxDQUFDLFlBQVksRUFBRSxNQUFNLENBQUM7eUJBQzdCLEdBQUcsRUFBRyxFQUFBOztnQkFQTCxVQUFRLFNBT0g7Z0JBR1gsV0FBTyxJQUFJLE9BQU8sQ0FBRSxVQUFBLE9BQU87d0JBQ3ZCLE9BQU8sQ0FBQzs0QkFDSixNQUFNLEVBQUUsR0FBRzs0QkFDWCxJQUFJLEVBQUU7Z0NBQ0YsTUFBTSxFQUFFLEtBQUssQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQztnQ0FDbkMsUUFBUSxFQUFFLE9BQUs7Z0NBQ2YsSUFBSSxFQUFFLEtBQUssQ0FBQyxJQUFJO2dDQUNoQixJQUFJLEVBQUUsT0FBSyxDQUFDLElBQUk7Z0NBQ2hCLEtBQUssRUFBRSxRQUFNLENBQUMsS0FBSztnQ0FDbkIsU0FBUyxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUUsUUFBTSxDQUFDLEtBQUssR0FBRyxPQUFLLENBQUU7NkJBQy9DO3lCQUNKLENBQUMsQ0FBQTtvQkFDTixDQUFDLENBQUMsRUFBQTs7O2dCQUdBLFdBQU8sSUFBSSxPQUFPLENBQUMsVUFBRSxPQUFPLEVBQUUsTUFBTTt3QkFDbEMsT0FBTyxDQUFDOzRCQUNGLE1BQU0sRUFBRSxHQUFHOzRCQUNYLE9BQU8sRUFBRSxHQUFDO3lCQUNiLENBQUMsQ0FBQTtvQkFDTixDQUFDLENBQUMsRUFBQTs7OztLQUdQLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyIvLyDkupHlh73mlbDlhaXlj6Pmlofku7ZcbmltcG9ydCAqIGFzIGNsb3VkIGZyb20gJ3d4LXNlcnZlci1zZGsnO1xuXG5jbG91ZC5pbml0KCk7XG5cbmNvbnN0IGRiOiBEQi5EYXRhYmFzZSA9IGNsb3VkLmRhdGFiYXNlKCk7XG5cbi8qKlxuICogQGRlc2NyaXB0aW9uIOeuoeeQhuerr+eahOWVhuWTgeWIl+ihqFxuICogLS0tLS0tLS0g6K+35rGCIC0tLS0tLS0tLS1cbiAqIHtcbiAqICAgICAgc2VhcmNoOiDmkJzntKJcbiAqICAgICAgcGFnZTog6aG15pWwXG4gKiB9XG4gKiAtLS0tLS0tLS0tIOi/lOWbniAtLS0tLS0tLVxuICoge1xuICogICAgICBkYXRhOiDliJfooahcbiAqICAgICAgcGFnZTog6aG15pWwXG4gKiAgICAgIHRvdGFsOiDmgLvmlbBcbiAqICAgICAgdG90YWxQYWdlOiDmgLvpobXmlbBcbiAqICAgICAgcGFnZVNpemU6IDIwXG4gKiB9XG4gKi9cbmV4cG9ydCBjb25zdCBtYWluID0gYXN5bmMgKGV2ZW50LCBjb250ZXh0KSA9PiB7XG5cbiAgdHJ5IHtcblxuICAgIC8vIOafpeivouadoeaVsFxuICAgIGNvbnN0IGxpbWl0ID0gMjA7XG4gICAgY29uc3Qgc2VhcmNoJCA9IGV2ZW50LnNlYXJjaCB8fCAnJztcbiAgICBjb25zdCBzZWFyY2ggPSBuZXcgUmVnRXhwKCBzZWFyY2gkLnJlcGxhY2UoL1xccysvZywgXCJcIiksICdpJyk7XG5cbiAgICAvLyDojrflj5bmgLvmlbBcbiAgICBjb25zdCB0b3RhbCQgPSBhd2FpdCBkYi5jb2xsZWN0aW9uKCd0cmlwJylcbiAgICAgICAgLndoZXJlKHtcbiAgICAgICAgICAgIHRpdGxlOiBzZWFyY2hcbiAgICAgICAgfSlcbiAgICAgICAgLmNvdW50KCApO1xuXG4gICAgLy8g6I635Y+W5pWw5o2uXG4gICAgY29uc3QgZGF0YSQgPSBhd2FpdCBkYi5jb2xsZWN0aW9uKCd0cmlwJylcbiAgICAgICAgLndoZXJlKHtcbiAgICAgICAgICAgIHRpdGxlOiBzZWFyY2hcbiAgICAgICAgfSlcbiAgICAgICAgLmxpbWl0KCBsaW1pdCApXG4gICAgICAgIC5za2lwKCggZXZlbnQucGFnZSAtIDEgKSAqIGxpbWl0IClcbiAgICAgICAgLm9yZGVyQnkoJ3VwZGF0ZVRpbWUnLCAnZGVzYycpXG4gICAgICAgIC5nZXQoICk7XG5cblxuICAgIHJldHVybiBuZXcgUHJvbWlzZSggcmVzb2x2ZSA9PiB7XG4gICAgICAgIHJlc29sdmUoe1xuICAgICAgICAgICAgc3RhdHVzOiAyMDAsXG4gICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgc2VhcmNoOiBldmVudC50aXRsZS5yZXBsYWNlKC9cXHMrL2cpLFxuICAgICAgICAgICAgICAgIHBhZ2VTaXplOiBsaW1pdCxcbiAgICAgICAgICAgICAgICBwYWdlOiBldmVudC5wYWdlLFxuICAgICAgICAgICAgICAgIGRhdGE6IGRhdGEkLmRhdGEsXG4gICAgICAgICAgICAgICAgdG90YWw6IHRvdGFsJC50b3RhbCxcbiAgICAgICAgICAgICAgICB0b3RhbFBhZ2U6IE1hdGguY2VpbCggdG90YWwkLnRvdGFsIC8gbGltaXQgKVxuICAgICAgICAgICAgfVxuICAgICAgICB9KVxuICAgIH0pXG5cbiAgfSBjYXRjaCAoIGUgKSB7XG4gICAgICByZXR1cm4gbmV3IFByb21pc2UoKCByZXNvbHZlLCByZWplY3QgKSA9PiB7XG4gICAgICAgIHJlc29sdmUoe1xuICAgICAgICAgICAgICBzdGF0dXM6IDUwMCxcbiAgICAgICAgICAgICAgbWVzc2FnZTogZVxuICAgICAgICAgIH0pXG4gICAgICB9KVxuICB9XG5cbn0iXX0=