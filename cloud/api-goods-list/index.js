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
    var limit_1, search, total$_1, data$, metaList, standards_1, insertStandars_1, total$_2, data$, metaList, standards_2, insertStandars_2, e_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 9, , 10]);
                limit_1 = 20;
                if (!(!!event.title && !!event.title.trim())) return [3, 4];
                search = new RegExp(event.title.replace(/\s+/g, ""), 'i');
                return [4, db.collection('goods')
                        .where({
                        title: search
                    })
                        .count()];
            case 1:
                total$_1 = _a.sent();
                return [4, db.collection('goods')
                        .where({
                        title: search
                    })
                        .limit(limit_1)
                        .skip((event.page - 1) * limit_1)
                        .orderBy('updateTime', 'desc')
                        .get()];
            case 2:
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
            case 3:
                standards_1 = _a.sent();
                insertStandars_1 = metaList.map(function (x, k) { return Object.assign({}, x, {
                    standards: standards_1[k].data
                }); });
                return [2, new Promise(function (resolve) {
                        resolve({
                            status: 200,
                            data: {
                                search: event.title.replace(/\s+/g),
                                pageSize: limit_1,
                                page: event.page,
                                data: insertStandars_1,
                                total: total$_1.total,
                                totalPage: Math.ceil(total$_1.total / limit_1)
                            }
                        });
                    })];
            case 4: return [4, db.collection('goods')
                    .count()];
            case 5:
                total$_2 = _a.sent();
                return [4, db.collection('goods')
                        .limit(limit_1)
                        .skip((event.page - 1) * limit_1)
                        .orderBy('updateTime', 'desc')
                        .get()];
            case 6:
                data$ = _a.sent();
                metaList = data$.data;
                return [4, Promise.all(metaList.map(function (x) {
                        return db.collection('standards')
                            .where({
                            pid: x._id
                        })
                            .get();
                    }))];
            case 7:
                standards_2 = _a.sent();
                insertStandars_2 = metaList.map(function (x, k) { return Object.assign({}, x, {
                    standards: standards_2[k].data
                }); });
                return [2, new Promise(function (resolve) {
                        resolve({
                            status: 200,
                            data: {
                                search: null,
                                pageSize: limit_1,
                                page: event.page,
                                data: insertStandars_2,
                                total: total$_2.total,
                                totalPage: Math.ceil(total$_2.total / limit_1)
                            }
                        });
                    })];
            case 8: return [3, 10];
            case 9:
                e_1 = _a.sent();
                return [2, new Promise(function (resolve, reject) {
                        reject({
                            status: 500,
                            message: e_1
                        });
                    })];
            case 10: return [2];
        }
    });
}); };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFDQSxpQkE4SEM7O0FBOUhELHFDQUF1QztBQUV2QyxLQUFLLENBQUMsSUFBSSxFQUFFLENBQUM7QUFFYixJQUFNLEVBQUUsR0FBZ0IsS0FBSyxDQUFDLFFBQVEsRUFBRSxDQUFDO0FBa0I1QixRQUFBLElBQUksR0FBRyxVQUFPLEtBQUssRUFBRSxPQUFPOzs7Ozs7Z0JBSzdCLFVBQVEsRUFBRSxDQUFDO3FCQUNaLENBQUEsQ0FBQyxDQUFDLEtBQUssQ0FBQyxLQUFLLElBQUksQ0FBQyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFHLENBQUEsRUFBdEMsY0FBc0M7Z0JBRW5DLE1BQU0sR0FBRyxJQUFJLE1BQU0sQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxNQUFNLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUM7Z0JBRWpELFdBQU0sRUFBRSxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUM7eUJBQ3RDLEtBQUssQ0FBQzt3QkFDTCxLQUFLLEVBQUUsTUFBTTtxQkFDZCxDQUFDO3lCQUNELEtBQUssRUFBRyxFQUFBOztnQkFKUCxXQUFTLFNBSUY7Z0JBR0MsV0FBTSxFQUFFLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQzt5QkFDckMsS0FBSyxDQUFDO3dCQUNILEtBQUssRUFBRSxNQUFNO3FCQUNoQixDQUFDO3lCQUNELEtBQUssQ0FBRSxPQUFLLENBQUU7eUJBQ2QsSUFBSSxDQUFDLENBQUUsS0FBSyxDQUFDLElBQUksR0FBRyxDQUFDLENBQUUsR0FBRyxPQUFLLENBQUU7eUJBQ2pDLE9BQU8sQ0FBQyxZQUFZLEVBQUUsTUFBTSxDQUFDO3lCQUM3QixHQUFHLEVBQUcsRUFBQTs7Z0JBUEwsS0FBSyxHQUFHLFNBT0g7Z0JBRUws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QUFFLElBQUksQ0FBQyxJQUFJLENBQUUsUUFBTSxDQUFDLEtBQUssR0FBRyxPQUFLLENBQUU7NkJBQy9DO3lCQUNGLENBQUMsQ0FBQTtvQkFDSixDQUFDLENBQUMsRUFBQTs7OztnQkFLSixXQUFPLElBQUksT0FBTyxDQUFDLFVBQUUsT0FBTyxFQUFFLE1BQU07d0JBQ2hDLE1BQU0sQ0FBQzs0QkFDSCxNQUFNLEVBQUUsR0FBRzs0QkFDWCxPQUFPLEVBQUUsR0FBQzt5QkFDYixDQUFDLENBQUE7b0JBQ04sQ0FBQyxDQUFDLEVBQUE7Ozs7S0FHUCxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiLy8g5LqR5Ye95pWw5YWl5Y+j5paH5Lu2XG5pbXBvcnQgKiBhcyBjbG91ZCBmcm9tICd3eC1zZXJ2ZXItc2RrJztcblxuY2xvdWQuaW5pdCgpO1xuXG5jb25zdCBkYjogREIuRGF0YWJhc2UgPSBjbG91ZC5kYXRhYmFzZSgpO1xuXG4vKipcbiAqIEBkZXNjcmlwdGlvbiDllYblk4HliJfooahcbiAqIC0tLS0tLS0tIOivt+axgiAtLS0tLS0tLS0tXG4gKiB7XG4gKiAgICAgIHNlYXJjaDog5pCc57SiXG4gKiAgICAgIHBhZ2U6IOmhteaVsFxuICogfVxuICogLS0tLS0tLS0tLSDov5Tlm54gLS0tLS0tLS1cbiAqIHtcbiAqICAgICAgZGF0YTog5YiX6KGoXG4gKiAgICAgIHBhZ2U6IOmhteaVsFxuICogICAgICB0b3RhbDog5oC75pWwXG4gKiAgICAgIHRvdGFsUGFnZTog5oC76aG15pWwXG4gKiAgICAgIHBhZ2VTaXplOiAyMFxuICogfVxuICovXG5leHBvcnQgY29uc3QgbWFpbiA9IGFzeW5jIChldmVudCwgY29udGV4dCkgPT4ge1xuXG4gIHRyeSB7XG5cbiAgICAgIC8vIOafpeivouadoeaVsFxuICAgICAgY29uc3QgbGltaXQgPSAyMDtcbiAgICAgIGlmICggISFldmVudC50aXRsZSAmJiAhIWV2ZW50LnRpdGxlLnRyaW0oICkpIHtcblxuICAgICAgICBjb25zdCBzZWFyY2ggPSBuZXcgUmVnRXhwKGV2ZW50LnRpdGxlLnJlcGxhY2UoL1xccysvZywgXCJcIiksICdpJyk7XG4gICAgICAgIC8vIOiOt+WPluaAu+aVsFxuICAgICAgICBjb25zdCB0b3RhbCQgPSBhd2FpdCBkYi5jb2xsZWN0aW9uKCdnb29kcycpXG4gICAgICAgICAgICAud2hlcmUoe1xuICAgICAgICAgICAgICB0aXRsZTogc2VhcmNoXG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLmNvdW50KCApO1xuXG4gICAgICAgIC8vIOiOt+WPluaVsOaNrlxuICAgICAgICBjb25zdCBkYXRhJCA9IGF3YWl0IGRiLmNvbGxlY3Rpb24oJ2dvb2RzJylcbiAgICAgICAgICAgIC53aGVyZSh7XG4gICAgICAgICAgICAgICAgdGl0bGU6IHNlYXJjaFxuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC5saW1pdCggbGltaXQgKVxuICAgICAgICAgICAgLnNraXAoKCBldmVudC5wYWdlIC0gMSApICogbGltaXQgKVxuICAgICAgICAgICAgLm9yZGVyQnkoJ3VwZGF0ZVRpbWUnLCAnZGVzYycpXG4gICAgICAgICAgICAuZ2V0KCApO1xuXG4gICAgICAgIGNvbnN0IG1ldGFMaXN0ID0gZGF0YSQuZGF0YTtcbiAgICAgICAgY29uc3Qgc3RhbmRhcmRzID0gYXdhaXQgUHJvbWlzZS5hbGwoIG1ldGFMaXN0Lm1hcCggeCA9PiB7XG4gICAgICAgICAgICByZXR1cm4gZGIuY29sbGVjdGlvbignc3RhbmRhcmRzJylcbiAgICAgICAgICAgICAgICAud2hlcmUoe1xuICAgICAgICAgICAgICAgICAgICBwaWQ6IHguX2lkLFxuICAgICAgICAgICAgICAgICAgICBpc0RlbGV0ZTogZmFsc2VcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIC5nZXQoICk7XG4gICAgICAgIH0pKTtcblxuICAgICAgICBjb25zdCBpbnNlcnRTdGFuZGFycyA9IG1ldGFMaXN0Lm1hcCgoIHgsIGsgKSA9PiBPYmplY3QuYXNzaWduKHsgfSwgeCwge1xuICAgICAgICAgICAgc3RhbmRhcmRzOiBzdGFuZGFyZHNbIGsgXS5kYXRhXG4gICAgICAgIH0pKTtcblxuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoIHJlc29sdmUgPT4ge1xuICAgICAgICAgIHJlc29sdmUoe1xuICAgICAgICAgICAgc3RhdHVzOiAyMDAsXG4gICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgc2VhcmNoOiBldmVudC50aXRsZS5yZXBsYWNlKC9cXHMrL2cpLFxuICAgICAgICAgICAgICAgIHBhZ2VTaXplOiBsaW1pdCxcbiAgICAgICAgICAgICAgICBwYWdlOiBldmVudC5wYWdlLFxuICAgICAgICAgICAgICAgIGRhdGE6IGluc2VydFN0YW5kYXJzLFxuICAgICAgICAgICAgICAgIHRvdGFsOiB0b3RhbCQudG90YWwsXG4gICAgICAgICAgICAgICAgdG90YWxQYWdlOiBNYXRoLmNlaWwoIHRvdGFsJC50b3RhbCAvIGxpbWl0IClcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KVxuICAgICAgICB9KVxuICAgICAgfSBlbHNlIHtcblxuICAgICAgICAgIC8vIOiOt+WPluaAu+aVsFxuICAgICAgICBjb25zdCB0b3RhbCQgPSBhd2FpdCBkYi5jb2xsZWN0aW9uKCdnb29kcycpXG4gICAgICAgICAgLmNvdW50KCApO1xuXG4gICAgICAgIC8vIOiOt+WPluaVsOaNrlxuICAgICAgICBjb25zdCBkYXRhJCA9IGF3YWl0IGRiLmNvbGxlY3Rpb24oJ2dvb2RzJylcbiAgICAgICAgICAgIC5saW1pdCggbGltaXQgKVxuICAgICAgICAgICAgLnNraXAoKCBldmVudC5wYWdlIC0gMSApICogbGltaXQgKVxuICAgICAgICAgICAgLm9yZGVyQnkoJ3VwZGF0ZVRpbWUnLCAnZGVzYycpXG4gICAgICAgICAgICAuZ2V0KCApO1xuXG4gICAgICAgIGNvbnN0IG1ldGFMaXN0ID0gZGF0YSQuZGF0YTtcbiAgICAgICAgY29uc3Qgc3RhbmRhcmRzID0gYXdhaXQgUHJvbWlzZS5hbGwoIG1ldGFMaXN0Lm1hcCggeCA9PiB7XG4gICAgICAgICAgcmV0dXJuIGRiLmNvbGxlY3Rpb24oJ3N0YW5kYXJkcycpXG4gICAgICAgICAgICAgIC53aGVyZSh7XG4gICAgICAgICAgICAgICAgcGlkOiB4Ll9pZFxuICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAuZ2V0KCApO1xuICAgICAgICB9KSk7XG5cbiAgICAgICAgY29uc3QgaW5zZXJ0U3RhbmRhcnMgPSBtZXRhTGlzdC5tYXAoKCB4LCBrICkgPT4gT2JqZWN0LmFzc2lnbih7IH0sIHgsIHtcbiAgICAgICAgICAgIHN0YW5kYXJkczogc3RhbmRhcmRzWyBrIF0uZGF0YVxuICAgICAgICB9KSk7XG5cbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKCByZXNvbHZlID0+IHtcbiAgICAgICAgICByZXNvbHZlKHtcbiAgICAgICAgICAgIHN0YXR1czogMjAwLFxuICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgIHNlYXJjaDogbnVsbCxcbiAgICAgICAgICAgICAgICBwYWdlU2l6ZTogbGltaXQsXG4gICAgICAgICAgICAgICAgcGFnZTogZXZlbnQucGFnZSxcbiAgICAgICAgICAgICAgICBkYXRhOiBpbnNlcnRTdGFuZGFycyxcbiAgICAgICAgICAgICAgICB0b3RhbDogdG90YWwkLnRvdGFsLFxuICAgICAgICAgICAgICAgIHRvdGFsUGFnZTogTWF0aC5jZWlsKCB0b3RhbCQudG90YWwgLyBsaW1pdCApXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSlcbiAgICAgICAgfSlcblxuICAgICAgfVxuXG4gIH0gY2F0Y2ggKCBlICkge1xuICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKCggcmVzb2x2ZSwgcmVqZWN0ICkgPT4ge1xuICAgICAgICAgIHJlamVjdCh7XG4gICAgICAgICAgICAgIHN0YXR1czogNTAwLFxuICAgICAgICAgICAgICBtZXNzYWdlOiBlXG4gICAgICAgICAgfSlcbiAgICAgIH0pXG4gIH1cblxufSJdfQ==