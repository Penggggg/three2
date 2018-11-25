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
                            pid: x._id
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFDQSxpQkE2SEM7O0FBN0hELHFDQUF1QztBQUV2QyxLQUFLLENBQUMsSUFBSSxFQUFFLENBQUM7QUFFYixJQUFNLEVBQUUsR0FBZ0IsS0FBSyxDQUFDLFFBQVEsRUFBRSxDQUFDO0FBa0I1QixRQUFBLElBQUksR0FBRyxVQUFPLEtBQUssRUFBRSxPQUFPOzs7Ozs7Z0JBSzdCLFVBQVEsRUFBRSxDQUFDO3FCQUNaLENBQUEsQ0FBQyxDQUFDLEtBQUssQ0FBQyxLQUFLLElBQUksQ0FBQyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFHLENBQUEsRUFBdEMsY0FBc0M7Z0JBRW5DLE1BQU0sR0FBRyxJQUFJLE1BQU0sQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxNQUFNLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUM7Z0JBRWpELFdBQU0sRUFBRSxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUM7eUJBQ3RDLEtBQUssQ0FBQzt3QkFDTCxLQUFLLEVBQUUsTUFBTTtxQkFDZCxDQUFDO3lCQUNELEtBQUssRUFBRyxFQUFBOztnQkFKUCxXQUFTLFNBSUY7Z0JBR0MsV0FBTSxFQUFFLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQzt5QkFDckMsS0FBSyxDQUFDO3dCQUNILEtBQUssRUFBRSxNQUFNO3FCQUNoQixDQUFDO3lCQUNELEtBQUssQ0FBRSxPQUFLLENBQUU7eUJBQ2QsSUFBSSxDQUFDLENBQUUsS0FBSyxDQUFDLElBQUksR0FBRyxDQUFDLENBQUUsR0FBRyxPQUFLLENBQUU7eUJBQ2pDLE9BQU8sQ0FBQyxZQUFZLEVBQUUsTUFBTSxDQUFDO3lCQUM3QixHQUFHLEVBQUcsRUFBQTs7Z0JBUEwsS0FBSyxHQUFHLFNBT0g7Z0JBRUws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RSxRQUFNLENBQUMsS0FBSyxHQUFHLE9BQUssQ0FBRTs2QkFDL0M7eUJBQ0YsQ0FBQyxDQUFBO29CQUNKLENBQUMsQ0FBQyxFQUFBOzs7O2dCQUtKLFdBQU8sSUFBSSxPQUFPLENBQUMsVUFBRSxPQUFPLEVBQUUsTUFBTTt3QkFDaEMsTUFBTSxDQUFDOzRCQUNILE1BQU0sRUFBRSxHQUFHOzRCQUNYLE9BQU8sRUFBRSxHQUFDO3lCQUNiLENBQUMsQ0FBQTtvQkFDTixDQUFDLENBQUMsRUFBQTs7OztLQUdQLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyIvLyDkupHlh73mlbDlhaXlj6Pmlofku7ZcbmltcG9ydCAqIGFzIGNsb3VkIGZyb20gJ3d4LXNlcnZlci1zZGsnO1xuXG5jbG91ZC5pbml0KCk7XG5cbmNvbnN0IGRiOiBEQi5EYXRhYmFzZSA9IGNsb3VkLmRhdGFiYXNlKCk7XG5cbi8qKlxuICogQGRlc2NyaXB0aW9uIOWVhuWTgeWIl+ihqFxuICogLS0tLS0tLS0g6K+35rGCIC0tLS0tLS0tLS1cbiAqIHtcbiAqICAgICAgc2VhcmNoOiDmkJzntKJcbiAqICAgICAgcGFnZTog6aG15pWwXG4gKiB9XG4gKiAtLS0tLS0tLS0tIOi/lOWbniAtLS0tLS0tLVxuICoge1xuICogICAgICBkYXRhOiDliJfooahcbiAqICAgICAgcGFnZTog6aG15pWwXG4gKiAgICAgIHRvdGFsOiDmgLvmlbBcbiAqICAgICAgdG90YWxQYWdlOiDmgLvpobXmlbBcbiAqICAgICAgcGFnZVNpemU6IDIwXG4gKiB9XG4gKi9cbmV4cG9ydCBjb25zdCBtYWluID0gYXN5bmMgKGV2ZW50LCBjb250ZXh0KSA9PiB7XG5cbiAgdHJ5IHtcblxuICAgICAgLy8g5p+l6K+i5p2h5pWwXG4gICAgICBjb25zdCBsaW1pdCA9IDIwO1xuICAgICAgaWYgKCAhIWV2ZW50LnRpdGxlICYmICEhZXZlbnQudGl0bGUudHJpbSggKSkge1xuXG4gICAgICAgIGNvbnN0IHNlYXJjaCA9IG5ldyBSZWdFeHAoZXZlbnQudGl0bGUucmVwbGFjZSgvXFxzKy9nLCBcIlwiKSwgJ2knKTtcbiAgICAgICAgLy8g6I635Y+W5oC75pWwXG4gICAgICAgIGNvbnN0IHRvdGFsJCA9IGF3YWl0IGRiLmNvbGxlY3Rpb24oJ2dvb2RzJylcbiAgICAgICAgICAgIC53aGVyZSh7XG4gICAgICAgICAgICAgIHRpdGxlOiBzZWFyY2hcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAuY291bnQoICk7XG5cbiAgICAgICAgLy8g6I635Y+W5pWw5o2uXG4gICAgICAgIGNvbnN0IGRhdGEkID0gYXdhaXQgZGIuY29sbGVjdGlvbignZ29vZHMnKVxuICAgICAgICAgICAgLndoZXJlKHtcbiAgICAgICAgICAgICAgICB0aXRsZTogc2VhcmNoXG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLmxpbWl0KCBsaW1pdCApXG4gICAgICAgICAgICAuc2tpcCgoIGV2ZW50LnBhZ2UgLSAxICkgKiBsaW1pdCApXG4gICAgICAgICAgICAub3JkZXJCeSgndXBkYXRlVGltZScsICdkZXNjJylcbiAgICAgICAgICAgIC5nZXQoICk7XG5cbiAgICAgICAgY29uc3QgbWV0YUxpc3QgPSBkYXRhJC5kYXRhO1xuICAgICAgICBjb25zdCBzdGFuZGFyZHMgPSBhd2FpdCBQcm9taXNlLmFsbCggbWV0YUxpc3QubWFwKCB4ID0+IHtcbiAgICAgICAgICAgIHJldHVybiBkYi5jb2xsZWN0aW9uKCdzdGFuZGFyZHMnKVxuICAgICAgICAgICAgICAgIC53aGVyZSh7XG4gICAgICAgICAgICAgICAgcGlkOiB4Ll9pZFxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLmdldCggKTtcbiAgICAgICAgfSkpO1xuXG4gICAgICAgIGNvbnN0IGluc2VydFN0YW5kYXJzID0gbWV0YUxpc3QubWFwKCggeCwgayApID0+IE9iamVjdC5hc3NpZ24oeyB9LCB4LCB7XG4gICAgICAgICAgICBzdGFuZGFyZHM6IHN0YW5kYXJkc1sgayBdLmRhdGFcbiAgICAgICAgfSkpO1xuXG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSggcmVzb2x2ZSA9PiB7XG4gICAgICAgICAgcmVzb2x2ZSh7XG4gICAgICAgICAgICBzdGF0dXM6IDIwMCxcbiAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICBzZWFyY2g6IGV2ZW50LnRpdGxlLnJlcGxhY2UoL1xccysvZyksXG4gICAgICAgICAgICAgICAgcGFnZVNpemU6IGxpbWl0LFxuICAgICAgICAgICAgICAgIHBhZ2U6IGV2ZW50LnBhZ2UsXG4gICAgICAgICAgICAgICAgZGF0YTogaW5zZXJ0U3RhbmRhcnMsXG4gICAgICAgICAgICAgICAgdG90YWw6IHRvdGFsJC50b3RhbCxcbiAgICAgICAgICAgICAgICB0b3RhbFBhZ2U6IE1hdGguY2VpbCggdG90YWwkLnRvdGFsIC8gbGltaXQgKVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pXG4gICAgICAgIH0pXG4gICAgICB9IGVsc2Uge1xuXG4gICAgICAgICAgLy8g6I635Y+W5oC75pWwXG4gICAgICAgIGNvbnN0IHRvdGFsJCA9IGF3YWl0IGRiLmNvbGxlY3Rpb24oJ2dvb2RzJylcbiAgICAgICAgICAuY291bnQoICk7XG5cbiAgICAgICAgLy8g6I635Y+W5pWw5o2uXG4gICAgICAgIGNvbnN0IGRhdGEkID0gYXdhaXQgZGIuY29sbGVjdGlvbignZ29vZHMnKVxuICAgICAgICAgICAgLmxpbWl0KCBsaW1pdCApXG4gICAgICAgICAgICAuc2tpcCgoIGV2ZW50LnBhZ2UgLSAxICkgKiBsaW1pdCApXG4gICAgICAgICAgICAub3JkZXJCeSgndXBkYXRlVGltZScsICdkZXNjJylcbiAgICAgICAgICAgIC5nZXQoICk7XG5cbiAgICAgICAgY29uc3QgbWV0YUxpc3QgPSBkYXRhJC5kYXRhO1xuICAgICAgICBjb25zdCBzdGFuZGFyZHMgPSBhd2FpdCBQcm9taXNlLmFsbCggbWV0YUxpc3QubWFwKCB4ID0+IHtcbiAgICAgICAgICByZXR1cm4gZGIuY29sbGVjdGlvbignc3RhbmRhcmRzJylcbiAgICAgICAgICAgICAgLndoZXJlKHtcbiAgICAgICAgICAgICAgICBwaWQ6IHguX2lkXG4gICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgIC5nZXQoICk7XG4gICAgICAgIH0pKTtcblxuICAgICAgICBjb25zdCBpbnNlcnRTdGFuZGFycyA9IG1ldGFMaXN0Lm1hcCgoIHgsIGsgKSA9PiBPYmplY3QuYXNzaWduKHsgfSwgeCwge1xuICAgICAgICAgICAgc3RhbmRhcmRzOiBzdGFuZGFyZHNbIGsgXS5kYXRhXG4gICAgICAgIH0pKTtcblxuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoIHJlc29sdmUgPT4ge1xuICAgICAgICAgIHJlc29sdmUoe1xuICAgICAgICAgICAgc3RhdHVzOiAyMDAsXG4gICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgc2VhcmNoOiBudWxsLFxuICAgICAgICAgICAgICAgIHBhZ2VTaXplOiBsaW1pdCxcbiAgICAgICAgICAgICAgICBwYWdlOiBldmVudC5wYWdlLFxuICAgICAgICAgICAgICAgIGRhdGE6IGluc2VydFN0YW5kYXJzLFxuICAgICAgICAgICAgICAgIHRvdGFsOiB0b3RhbCQudG90YWwsXG4gICAgICAgICAgICAgICAgdG90YWxQYWdlOiBNYXRoLmNlaWwoIHRvdGFsJC50b3RhbCAvIGxpbWl0IClcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KVxuICAgICAgICB9KVxuXG4gICAgICB9XG5cbiAgfSBjYXRjaCAoIGUgKSB7XG4gICAgICByZXR1cm4gbmV3IFByb21pc2UoKCByZXNvbHZlLCByZWplY3QgKSA9PiB7XG4gICAgICAgICAgcmVqZWN0KHtcbiAgICAgICAgICAgICAgc3RhdHVzOiA1MDAsXG4gICAgICAgICAgICAgIG1lc3NhZ2U6IGVcbiAgICAgICAgICB9KVxuICAgICAgfSlcbiAgfVxuXG59Il19