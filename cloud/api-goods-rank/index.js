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
    var limit_1, category, search$_1, search, total$_1, data$, standards_1, insertStandars_1, e_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 4, , 5]);
                limit_1 = 20;
                category = event.category;
                search$_1 = event.search || '';
                search = new RegExp(search$_1.replace(/\s+/g, ""), 'i');
                return [4, db.collection('goods')
                        .where({
                        category: category,
                        title: search
                    })
                        .count()];
            case 1:
                total$_1 = _a.sent();
                return [4, db.collection('goods')
                        .where({
                        category: category,
                        title: search
                    })
                        .limit(limit_1)
                        .skip((event.page - 1) * limit_1)
                        .orderBy('saled', 'desc')
                        .get()];
            case 2:
                data$ = _a.sent();
                return [4, Promise.all(data$.data.map(function (x) {
                        return db.collection('standards')
                            .where({
                            pid: x._id,
                            isDelete: false
                        })
                            .get();
                    }))];
            case 3:
                standards_1 = _a.sent();
                insertStandars_1 = data$.data.map(function (x, k) { return Object.assign({}, x, {
                    standards: standards_1[k].data
                }); });
                return [2, new Promise(function (resolve) {
                        resolve({
                            status: 200,
                            data: {
                                search: search$_1.replace(/\s+/g),
                                pageSize: limit_1,
                                page: event.page,
                                data: insertStandars_1,
                                total: total$_1.total,
                                totalPage: Math.ceil(total$_1.total / limit_1)
                            }
                        });
                    })];
            case 4:
                e_1 = _a.sent();
                return [2, new Promise(function (resolve, reject) {
                        reject({
                            status: 500,
                            message: e_1
                        });
                    })];
            case 5: return [2];
        }
    });
}); };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFDQSxpQkF3RkM7O0FBeEZELHFDQUF1QztBQUV2QyxLQUFLLENBQUMsSUFBSSxFQUFFLENBQUM7QUFFYixJQUFNLEVBQUUsR0FBZ0IsS0FBSyxDQUFDLFFBQVEsRUFBRSxDQUFDO0FBbUI1QixRQUFBLElBQUksR0FBRyxVQUFPLEtBQUssRUFBRSxPQUFPOzs7Ozs7Z0JBSy9CLFVBQVEsRUFBRSxDQUFDO2dCQUNULFFBQVEsR0FBSyxLQUFLLFNBQVYsQ0FBVztnQkFDckIsWUFBVSxLQUFLLENBQUMsTUFBTSxJQUFJLEVBQUUsQ0FBQztnQkFDN0IsTUFBTSxHQUFHLElBQUksTUFBTSxDQUFFLFNBQU8sQ0FBQyxPQUFPLENBQUMsTUFBTSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDO2dCQUc5QyxXQUFNLEVBQUUsQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDO3lCQUN0QyxLQUFLLENBQUM7d0JBQ0gsUUFBUSxVQUFBO3dCQUNSLEtBQUssRUFBRSxNQUFNO3FCQUNoQixDQUFDO3lCQUNELEtBQUssRUFBRyxFQUFBOztnQkFMUCxXQUFTLFNBS0Y7Z0JBR0MsV0FBTSxFQUFFLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQzt5QkFDckMsS0FBSyxDQUFDO3dCQUNILFFBQVEsVUFBQTt3QkFDUixLQUFLLEVBQUUsTUFBTTtxQkFDaEIsQ0FBQzt5QkFDRCxLQUFLLENBQUUsT0FBSyxDQUFFO3lCQUNkLElBQUksQ0FBQyxDQUFFLEtBQUssQ0FBQyxJQUFJLEdBQUcsQ0FBQyxDQUFFLEdBQUcsT0FBSyxDQUFFO3lCQUNqQyxPQUFPLENBQUMsT0FBTyxFQUFFLE1BQU0sQ0FBQzt5QkFDeEIsR0FBRyxFQUFHLEVBQUE7O2dCQVJMLEtBQUssR0FBRyxTQVFIO2dCQUVPLFdBQU0sT0FBTyxDQUFDLEdBQUcsQ0FBRSxLQUFLLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBRSxVQUFBLENBQUM7d0JBQ2xELE9BQU8sRUFBRSxDQUFDLFVBQVUsQ0FBQyxXQUFXLENBQUM7NkJBQzVCLEtBQUssQ0FBQzs0QkFDSCxHQUFHLEVBQUUsQ0FBQyxDQUFDLEdBQUc7NEJBQ1YsUUFBUSxFQUFFLEtBQUs7eUJBQ2xCLENBQUM7NkJBQ0QsR0FBRyxFQUFHLENBQUM7b0JBQ2hCLENBQUMsQ0FBQyxDQUFDLEVBQUE7O2dCQVBHLGNBQVksU0FPZjtnQkFFRyxtQkFBaUIsS0FBSyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsVUFBRSxDQUFDLEVBQUUsQ0FBQyxJQUFNLE9BQUEsTUFBTSxDQUFDLE1BQU0sQ0FBQyxFQUFHLEVBQUUsQ0FBQyxFQUFFO29CQUNwRSxTQUFTLEVBQUUsV0FBUyxDQUFFLENBQUMsQ0FBRSxDQUFDLElBQUk7aUJBQ2pDLENBQUMsRUFGZ0QsQ0FFaEQsQ0FBQyxDQUFDO2dCQUVKLFdBQU8sSUFBSSxPQUFPLENBQUUsVUFBQSxPQUFPO3dCQUN2QixPQUFPLENBQUM7NEJBQ0osTUFBTSxFQUFFLEdBQUc7NEJBQ1gsSUFBSSxFQUFFO2dDQUNGLE1BQU0sRUFBRSxTQUFPLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQztnQ0FDL0IsUUFBUSxFQUFFLE9BQUs7Z0NBQ2YsSUFBSSxFQUFFLEtBQUssQ0FBQyxJQUFJO2dDQUNoQixJQUFJLEVBQUUsZ0JBQWM7Z0NBQ3BCLEtBQUssRUFBRSxRQUFNLENBQUMsS0FBSztnQ0FDbkIsU0FBUyxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUUsUUFBTSxDQUFDLEtBQUssR0FBRyxPQUFLLENBQUU7NkJBQy9DO3lCQUNKLENBQUMsQ0FBQTtvQkFDTixDQUFDLENBQUMsRUFBQTs7O2dCQUdBLFdBQU8sSUFBSSxPQUFPLENBQUMsVUFBRSxPQUFPLEVBQUUsTUFBTTt3QkFDaEMsTUFBTSxDQUFDOzRCQUNILE1BQU0sRUFBRSxHQUFHOzRCQUNYLE9BQU8sRUFBRSxHQUFDO3lCQUNiLENBQUMsQ0FBQTtvQkFDTixDQUFDLENBQUMsRUFBQTs7OztLQUdQLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyIvLyDkupHlh73mlbDlhaXlj6Pmlofku7ZcbmltcG9ydCAqIGFzIGNsb3VkIGZyb20gJ3d4LXNlcnZlci1zZGsnO1xuXG5jbG91ZC5pbml0KCk7XG5cbmNvbnN0IGRiOiBEQi5EYXRhYmFzZSA9IGNsb3VkLmRhdGFiYXNlKCk7XG5cbi8qKlxuICogQGRlc2NyaXB0aW9uIOWVhuWTgemUgOmHj+aOkuihjOamnOWIl+ihqFxuICogLS0tLS0tLS0g6K+35rGCIC0tLS0tLS0tLS1cbiAqIHtcbiAqICAgICAgcGFnZTog6aG15pWwXG4gKiAgICAgIHNlYXJjaDog5pCc57SiXG4gKiAgICAgIGNhdGVnb3J5OiDllYblk4Hnsbvnm65cbiAqIH1cbiAqIC0tLS0tLS0tLS0g6L+U5ZueIC0tLS0tLS0tXG4gKiB7XG4gKiAgICAgIGRhdGE6IOWIl+ihqFxuICogICAgICBwYWdlOiDpobXmlbBcbiAqICAgICAgdG90YWw6IOaAu+aVsFxuICogICAgICB0b3RhbFBhZ2U6IOaAu+mhteaVsFxuICogICAgICBwYWdlU2l6ZTogMjBcbiAqIH1cbiAqL1xuZXhwb3J0IGNvbnN0IG1haW4gPSBhc3luYyAoZXZlbnQsIGNvbnRleHQpID0+IHtcblxuICB0cnkge1xuXG4gICAgLy8g5p+l6K+i5p2h5pWwXG4gICAgY29uc3QgbGltaXQgPSAyMDtcbiAgICBjb25zdCB7IGNhdGVnb3J5IH0gPSBldmVudDtcbiAgICBjb25zdCBzZWFyY2gkID0gZXZlbnQuc2VhcmNoIHx8ICcnO1xuICAgIGNvbnN0IHNlYXJjaCA9IG5ldyBSZWdFeHAoIHNlYXJjaCQucmVwbGFjZSgvXFxzKy9nLCBcIlwiKSwgJ2knKTtcblxuICAgIC8vIOiOt+WPluaAu+aVsFxuICAgIGNvbnN0IHRvdGFsJCA9IGF3YWl0IGRiLmNvbGxlY3Rpb24oJ2dvb2RzJylcbiAgICAgICAgLndoZXJlKHtcbiAgICAgICAgICAgIGNhdGVnb3J5LFxuICAgICAgICAgICAgdGl0bGU6IHNlYXJjaFxuICAgICAgICB9KVxuICAgICAgICAuY291bnQoICk7XG5cbiAgICAvLyDojrflj5bmlbDmja5cbiAgICBjb25zdCBkYXRhJCA9IGF3YWl0IGRiLmNvbGxlY3Rpb24oJ2dvb2RzJylcbiAgICAgICAgLndoZXJlKHtcbiAgICAgICAgICAgIGNhdGVnb3J5LFxuICAgICAgICAgICAgdGl0bGU6IHNlYXJjaFxuICAgICAgICB9KVxuICAgICAgICAubGltaXQoIGxpbWl0IClcbiAgICAgICAgLnNraXAoKCBldmVudC5wYWdlIC0gMSApICogbGltaXQgKVxuICAgICAgICAub3JkZXJCeSgnc2FsZWQnLCAnZGVzYycpXG4gICAgICAgIC5nZXQoICk7XG5cbiAgICBjb25zdCBzdGFuZGFyZHMgPSBhd2FpdCBQcm9taXNlLmFsbCggZGF0YSQuZGF0YS5tYXAoIHggPT4ge1xuICAgICAgICByZXR1cm4gZGIuY29sbGVjdGlvbignc3RhbmRhcmRzJylcbiAgICAgICAgICAgIC53aGVyZSh7XG4gICAgICAgICAgICAgICAgcGlkOiB4Ll9pZCxcbiAgICAgICAgICAgICAgICBpc0RlbGV0ZTogZmFsc2VcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAuZ2V0KCApO1xuICAgIH0pKTtcblxuICAgIGNvbnN0IGluc2VydFN0YW5kYXJzID0gZGF0YSQuZGF0YS5tYXAoKCB4LCBrICkgPT4gT2JqZWN0LmFzc2lnbih7IH0sIHgsIHtcbiAgICAgICAgc3RhbmRhcmRzOiBzdGFuZGFyZHNbIGsgXS5kYXRhXG4gICAgfSkpO1xuXG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKCByZXNvbHZlID0+IHtcbiAgICAgICAgcmVzb2x2ZSh7XG4gICAgICAgICAgICBzdGF0dXM6IDIwMCxcbiAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICBzZWFyY2g6IHNlYXJjaCQucmVwbGFjZSgvXFxzKy9nKSxcbiAgICAgICAgICAgICAgICBwYWdlU2l6ZTogbGltaXQsXG4gICAgICAgICAgICAgICAgcGFnZTogZXZlbnQucGFnZSxcbiAgICAgICAgICAgICAgICBkYXRhOiBpbnNlcnRTdGFuZGFycyxcbiAgICAgICAgICAgICAgICB0b3RhbDogdG90YWwkLnRvdGFsLFxuICAgICAgICAgICAgICAgIHRvdGFsUGFnZTogTWF0aC5jZWlsKCB0b3RhbCQudG90YWwgLyBsaW1pdCApXG4gICAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgfSlcblxuICB9IGNhdGNoICggZSApIHtcbiAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgoIHJlc29sdmUsIHJlamVjdCApID0+IHtcbiAgICAgICAgICByZWplY3Qoe1xuICAgICAgICAgICAgICBzdGF0dXM6IDUwMCxcbiAgICAgICAgICAgICAgbWVzc2FnZTogZVxuICAgICAgICAgIH0pXG4gICAgICB9KVxuICB9XG5cbn0iXX0=