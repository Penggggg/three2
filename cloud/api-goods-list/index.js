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
    var limit_1, search, total$_1, data$, metaList, standards_1, insertStandars, carts_1, insertCart_1, total$_2, data$, metaList, standards_2, insertStandars, carts_2, insertCart_2, e_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 11, , 12]);
                limit_1 = 20;
                if (!(!!event.title && !!event.title.trim())) return [3, 5];
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
                insertStandars = metaList.map(function (x, k) { return Object.assign({}, x, {
                    standards: standards_1[k].data
                }); });
                return [4, Promise.all(insertStandars.map(function (x) {
                        return db.collection('cart')
                            .where({
                            pid: x._id
                        })
                            .count();
                    }))];
            case 4:
                carts_1 = _a.sent();
                insertCart_1 = insertStandars.map(function (x, k) { return Object.assign({}, x, {
                    carts: carts_1[k].total
                }); });
                return [2, new Promise(function (resolve) {
                        resolve({
                            status: 200,
                            data: {
                                search: event.title.replace(/\s+/g),
                                pageSize: limit_1,
                                page: event.page,
                                data: insertCart_1,
                                total: total$_1.total,
                                totalPage: Math.ceil(total$_1.total / limit_1)
                            }
                        });
                    })];
            case 5: return [4, db.collection('goods')
                    .count()];
            case 6:
                total$_2 = _a.sent();
                return [4, db.collection('goods')
                        .limit(limit_1)
                        .skip((event.page - 1) * limit_1)
                        .orderBy('updateTime', 'desc')
                        .get()];
            case 7:
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
            case 8:
                standards_2 = _a.sent();
                insertStandars = metaList.map(function (x, k) { return Object.assign({}, x, {
                    standards: standards_2[k].data
                }); });
                return [4, Promise.all(insertStandars.map(function (x) {
                        return db.collection('cart')
                            .where({
                            pid: x._id
                        })
                            .count();
                    }))];
            case 9:
                carts_2 = _a.sent();
                insertCart_2 = insertStandars.map(function (x, k) { return Object.assign({}, x, {
                    carts: carts_2[k].total
                }); });
                return [2, new Promise(function (resolve) {
                        resolve({
                            status: 200,
                            data: {
                                search: null,
                                pageSize: limit_1,
                                page: event.page,
                                data: insertCart_2,
                                total: total$_2.total,
                                totalPage: Math.ceil(total$_2.total / limit_1)
                            }
                        });
                    })];
            case 10: return [3, 12];
            case 11:
                e_1 = _a.sent();
                return [2, new Promise(function (resolve, reject) {
                        resolve({
                            status: 500,
                            message: e_1
                        });
                    })];
            case 12: return [2];
        }
    });
}); };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFDQSxpQkEwSkM7O0FBMUpELHFDQUF1QztBQUV2QyxLQUFLLENBQUMsSUFBSSxFQUFFLENBQUM7QUFFYixJQUFNLEVBQUUsR0FBZ0IsS0FBSyxDQUFDLFFBQVEsRUFBRSxDQUFDO0FBa0I1QixRQUFBLElBQUksR0FBRyxVQUFPLEtBQUssRUFBRSxPQUFPOzs7Ozs7Z0JBSzdCLFVBQVEsRUFBRSxDQUFDO3FCQUNaLENBQUEsQ0FBQyxDQUFDLEtBQUssQ0FBQyxLQUFLLElBQUksQ0FBQyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFHLENBQUEsRUFBdEMsY0FBc0M7Z0JBRW5DLE1BQU0sR0FBRyxJQUFJLE1BQU0sQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxNQUFNLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUM7Z0JBRWpELFdBQU0sRUFBRSxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUM7eUJBQ3RDLEtBQUssQ0FBQzt3QkFDTCxLQUFLLEVBQUUsTUFBTTtxQkFDZCxDQUFDO3lCQUNELEtBQUssRUFBRyxFQUFBOztnQkFKUCxXQUFTLFNBSUY7Z0JBR0MsV0FBTSxFQUFFLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQzt5QkFDckMsS0FBSyxDQUFDO3dCQUNILEtBQUssRUFBRSxNQUFNO3FCQUNoQixDQUFDO3lCQUNELEtBQUssQ0FBRSxPQUFLLENBQUU7eUJBQ2QsSUFBSSxDQUFDLENBQUUsS0FBSyxDQUFDLElBQUksR0FBRyxDQUFDLENBQUUsR0FBRyxPQUFLLENBQUU7eUJBQ2pDLE9BQU8sQ0FBQyxZQUFZLEVBQUUsTUFBTSxDQUFDO3lCQUM3QixHQUFHLEVBQUcsRUFBQTs7Z0JBUEwsS0FBSyxHQUFHLFNBT0g7Z0JBRUws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QUMvQzt5QkFDRixDQUFDLENBQUE7b0JBQ0osQ0FBQyxDQUFDLEVBQUE7Ozs7Z0JBS0osV0FBTyxJQUFJLE9BQU8sQ0FBQyxVQUFFLE9BQU8sRUFBRSxNQUFNO3dCQUNsQyxPQUFPLENBQUM7NEJBQ0YsTUFBTSxFQUFFLEdBQUc7NEJBQ1gsT0FBTyxFQUFFLEdBQUM7eUJBQ2IsQ0FBQyxDQUFBO29CQUNOLENBQUMsQ0FBQyxFQUFBOzs7O0tBR1AsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbIi8vIOS6keWHveaVsOWFpeWPo+aWh+S7tlxuaW1wb3J0ICogYXMgY2xvdWQgZnJvbSAnd3gtc2VydmVyLXNkayc7XG5cbmNsb3VkLmluaXQoKTtcblxuY29uc3QgZGI6IERCLkRhdGFiYXNlID0gY2xvdWQuZGF0YWJhc2UoKTtcblxuLyoqXG4gKiBAZGVzY3JpcHRpb24g566h55CG56uv55qE5ZWG5ZOB5YiX6KGoXG4gKiAtLS0tLS0tLSDor7fmsYIgLS0tLS0tLS0tLVxuICoge1xuICogICAgICBzZWFyY2g6IOaQnOe0olxuICogICAgICBwYWdlOiDpobXmlbBcbiAqIH1cbiAqIC0tLS0tLS0tLS0g6L+U5ZueIC0tLS0tLS0tXG4gKiB7XG4gKiAgICAgIGRhdGE6IOWIl+ihqFxuICogICAgICBwYWdlOiDpobXmlbBcbiAqICAgICAgdG90YWw6IOaAu+aVsFxuICogICAgICB0b3RhbFBhZ2U6IOaAu+mhteaVsFxuICogICAgICBwYWdlU2l6ZTogMjBcbiAqIH1cbiAqL1xuZXhwb3J0IGNvbnN0IG1haW4gPSBhc3luYyAoZXZlbnQsIGNvbnRleHQpID0+IHtcblxuICB0cnkge1xuXG4gICAgICAvLyDmn6Xor6LmnaHmlbBcbiAgICAgIGNvbnN0IGxpbWl0ID0gMjA7XG4gICAgICBpZiAoICEhZXZlbnQudGl0bGUgJiYgISFldmVudC50aXRsZS50cmltKCApKSB7XG5cbiAgICAgICAgY29uc3Qgc2VhcmNoID0gbmV3IFJlZ0V4cChldmVudC50aXRsZS5yZXBsYWNlKC9cXHMrL2csIFwiXCIpLCAnaScpO1xuICAgICAgICAvLyDojrflj5bmgLvmlbBcbiAgICAgICAgY29uc3QgdG90YWwkID0gYXdhaXQgZGIuY29sbGVjdGlvbignZ29vZHMnKVxuICAgICAgICAgICAgLndoZXJlKHtcbiAgICAgICAgICAgICAgdGl0bGU6IHNlYXJjaFxuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC5jb3VudCggKTtcblxuICAgICAgICAvLyDojrflj5bmlbDmja5cbiAgICAgICAgY29uc3QgZGF0YSQgPSBhd2FpdCBkYi5jb2xsZWN0aW9uKCdnb29kcycpXG4gICAgICAgICAgICAud2hlcmUoe1xuICAgICAgICAgICAgICAgIHRpdGxlOiBzZWFyY2hcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAubGltaXQoIGxpbWl0IClcbiAgICAgICAgICAgIC5za2lwKCggZXZlbnQucGFnZSAtIDEgKSAqIGxpbWl0IClcbiAgICAgICAgICAgIC5vcmRlckJ5KCd1cGRhdGVUaW1lJywgJ2Rlc2MnKVxuICAgICAgICAgICAgLmdldCggKTtcblxuICAgICAgICBjb25zdCBtZXRhTGlzdCA9IGRhdGEkLmRhdGE7XG4gICAgICAgIGNvbnN0IHN0YW5kYXJkcyA9IGF3YWl0IFByb21pc2UuYWxsKCBtZXRhTGlzdC5tYXAoIHggPT4ge1xuICAgICAgICAgICAgcmV0dXJuIGRiLmNvbGxlY3Rpb24oJ3N0YW5kYXJkcycpXG4gICAgICAgICAgICAgICAgLndoZXJlKHtcbiAgICAgICAgICAgICAgICAgICAgcGlkOiB4Ll9pZCxcbiAgICAgICAgICAgICAgICAgICAgaXNEZWxldGU6IGZhbHNlXG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAuZ2V0KCApO1xuICAgICAgICB9KSk7XG5cbiAgICAgICAgY29uc3QgaW5zZXJ0U3RhbmRhcnMgPSBtZXRhTGlzdC5tYXAoKCB4LCBrICkgPT4gT2JqZWN0LmFzc2lnbih7IH0sIHgsIHtcbiAgICAgICAgICAgIHN0YW5kYXJkczogc3RhbmRhcmRzWyBrIF0uZGF0YVxuICAgICAgICB9KSk7XG5cbiAgICAgICAgLy8g5p+l6K+i6KKr5Yqg5YWl6LSt54mp6L2m5pWw6YePXG4gICAgICAgIGNvbnN0IGNhcnRzID0gYXdhaXQgUHJvbWlzZS5hbGwoIGluc2VydFN0YW5kYXJzLm1hcCggeCA9PiB7XG4gICAgICAgICAgICByZXR1cm4gZGIuY29sbGVjdGlvbignY2FydCcpXG4gICAgICAgICAgICAgICAgICAgIC53aGVyZSh7XG4gICAgICAgICAgICAgICAgICAgICAgICBwaWQ6IHguX2lkXG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgIC5jb3VudCggKTtcbiAgICAgICAgfSkpXG5cbiAgICAgICAgY29uc3QgaW5zZXJ0Q2FydCA9IGluc2VydFN0YW5kYXJzLm1hcCgoIHgsIGsgKSA9PiBPYmplY3QuYXNzaWduKHsgfSwgeCwge1xuICAgICAgICAgICAgY2FydHM6IGNhcnRzWyBrIF0udG90YWxcbiAgICAgICAgfSkpO1xuXG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSggcmVzb2x2ZSA9PiB7XG4gICAgICAgICAgcmVzb2x2ZSh7XG4gICAgICAgICAgICBzdGF0dXM6IDIwMCxcbiAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICBzZWFyY2g6IGV2ZW50LnRpdGxlLnJlcGxhY2UoL1xccysvZyksXG4gICAgICAgICAgICAgICAgcGFnZVNpemU6IGxpbWl0LFxuICAgICAgICAgICAgICAgIHBhZ2U6IGV2ZW50LnBhZ2UsXG4gICAgICAgICAgICAgICAgZGF0YTogaW5zZXJ0Q2FydCxcbiAgICAgICAgICAgICAgICB0b3RhbDogdG90YWwkLnRvdGFsLFxuICAgICAgICAgICAgICAgIHRvdGFsUGFnZTogTWF0aC5jZWlsKCB0b3RhbCQudG90YWwgLyBsaW1pdCApXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSlcbiAgICAgICAgfSlcbiAgICAgIH0gZWxzZSB7XG5cbiAgICAgICAgLy8g6I635Y+W5oC75pWwXG4gICAgICAgIGNvbnN0IHRvdGFsJCA9IGF3YWl0IGRiLmNvbGxlY3Rpb24oJ2dvb2RzJylcbiAgICAgICAgICAuY291bnQoICk7XG5cbiAgICAgICAgLy8g6I635Y+W5pWw5o2uXG4gICAgICAgIGNvbnN0IGRhdGEkID0gYXdhaXQgZGIuY29sbGVjdGlvbignZ29vZHMnKVxuICAgICAgICAgICAgLmxpbWl0KCBsaW1pdCApXG4gICAgICAgICAgICAuc2tpcCgoIGV2ZW50LnBhZ2UgLSAxICkgKiBsaW1pdCApXG4gICAgICAgICAgICAub3JkZXJCeSgndXBkYXRlVGltZScsICdkZXNjJylcbiAgICAgICAgICAgIC5nZXQoICk7XG5cbiAgICAgICAgLy8g5p+l6K+i5Z6L5Y+3XG4gICAgICAgIGNvbnN0IG1ldGFMaXN0ID0gZGF0YSQuZGF0YTtcbiAgICAgICAgY29uc3Qgc3RhbmRhcmRzID0gYXdhaXQgUHJvbWlzZS5hbGwoIG1ldGFMaXN0Lm1hcCggeCA9PiB7XG4gICAgICAgICAgcmV0dXJuIGRiLmNvbGxlY3Rpb24oJ3N0YW5kYXJkcycpXG4gICAgICAgICAgICAgIC53aGVyZSh7XG4gICAgICAgICAgICAgICAgcGlkOiB4Ll9pZCxcbiAgICAgICAgICAgICAgICBpc0RlbGV0ZTogZmFsc2VcbiAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgLmdldCggKTtcbiAgICAgICAgfSkpO1xuXG4gICAgICAgIGNvbnN0IGluc2VydFN0YW5kYXJzID0gbWV0YUxpc3QubWFwKCggeCwgayApID0+IE9iamVjdC5hc3NpZ24oeyB9LCB4LCB7XG4gICAgICAgICAgICBzdGFuZGFyZHM6IHN0YW5kYXJkc1sgayBdLmRhdGFcbiAgICAgICAgfSkpO1xuXG4gICAgICAgIC8vIOafpeivouiiq+WKoOWFpei0reeJqei9puaVsOmHj1xuICAgICAgICBjb25zdCBjYXJ0cyA9IGF3YWl0IFByb21pc2UuYWxsKCBpbnNlcnRTdGFuZGFycy5tYXAoIHggPT4ge1xuICAgICAgICAgICAgcmV0dXJuIGRiLmNvbGxlY3Rpb24oJ2NhcnQnKVxuICAgICAgICAgICAgICAgICAgICAud2hlcmUoe1xuICAgICAgICAgICAgICAgICAgICAgICAgcGlkOiB4Ll9pZFxuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAuY291bnQoICk7XG4gICAgICAgIH0pKVxuXG4gICAgICAgIGNvbnN0IGluc2VydENhcnQgPSBpbnNlcnRTdGFuZGFycy5tYXAoKCB4LCBrICkgPT4gT2JqZWN0LmFzc2lnbih7IH0sIHgsIHtcbiAgICAgICAgICAgIGNhcnRzOiBjYXJ0c1sgayBdLnRvdGFsXG4gICAgICAgIH0pKTtcblxuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoIHJlc29sdmUgPT4ge1xuICAgICAgICAgIHJlc29sdmUoe1xuICAgICAgICAgICAgc3RhdHVzOiAyMDAsXG4gICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgc2VhcmNoOiBudWxsLFxuICAgICAgICAgICAgICAgIHBhZ2VTaXplOiBsaW1pdCxcbiAgICAgICAgICAgICAgICBwYWdlOiBldmVudC5wYWdlLFxuICAgICAgICAgICAgICAgIGRhdGE6IGluc2VydENhcnQsXG4gICAgICAgICAgICAgICAgdG90YWw6IHRvdGFsJC50b3RhbCxcbiAgICAgICAgICAgICAgICB0b3RhbFBhZ2U6IE1hdGguY2VpbCggdG90YWwkLnRvdGFsIC8gbGltaXQgKVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pXG4gICAgICAgIH0pXG5cbiAgICAgIH1cblxuICB9IGNhdGNoICggZSApIHtcbiAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgoIHJlc29sdmUsIHJlamVjdCApID0+IHtcbiAgICAgICAgcmVzb2x2ZSh7XG4gICAgICAgICAgICAgIHN0YXR1czogNTAwLFxuICAgICAgICAgICAgICBtZXNzYWdlOiBlXG4gICAgICAgICAgfSlcbiAgICAgIH0pXG4gIH1cblxufSJdfQ==