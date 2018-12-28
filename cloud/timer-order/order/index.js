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
var _ = db.command;
exports.overtime = function () { return __awaiter(_this, void 0, void 0, function () {
    var orders$, e_1;
    var _this = this;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 4, , 5]);
                return [4, db.collection('order')
                        .where({
                        pay_status: '0',
                        base_status: '0',
                        createTime: _.lte(new Date().getTime() - 30 * 60 * 1000)
                    })
                        .get()];
            case 1:
                orders$ = _a.sent();
                return [4, Promise.all(orders$.data.map(function (order) {
                        return db.collection('order').doc(String(order._id))
                            .update({
                            data: {
                                base_status: '5'
                            }
                        });
                    }))];
            case 2:
                _a.sent();
                return [4, Promise.all(orders$.data.map(function (order) { return __awaiter(_this, void 0, void 0, function () {
                        var targetId, collection, target;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    targetId = order.sid || order.pid;
                                    collection = order.sid ? 'standards' : 'goods';
                                    return [4, db.collection(collection).doc(targetId)
                                            .get()];
                                case 1:
                                    target = _a.sent();
                                    if (target.data.stock === undefined || target.data.stock === null) {
                                        return [2];
                                    }
                                    return [4, db.collection(collection).doc(targetId)
                                            .update({
                                            data: {
                                                stock: _.inc(order.count)
                                            }
                                        })];
                                case 2:
                                    _a.sent();
                                    return [2];
                            }
                        });
                    }); }))];
            case 3:
                _a.sent();
                return [2, { status: 200 }];
            case 4:
                e_1 = _a.sent();
                console.log('!!!!定时器错误');
                return [2, { status: 500 }];
            case 5: return [2];
        }
    });
}); };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSxpQkF3REU7O0FBeERGLHFDQUF1QztBQUV2QyxLQUFLLENBQUMsSUFBSSxFQUFHLENBQUM7QUFFZCxJQUFNLEVBQUUsR0FBZ0IsS0FBSyxDQUFDLFFBQVEsRUFBRyxDQUFDO0FBQzFDLElBQU0sQ0FBQyxHQUFHLEVBQUUsQ0FBQyxPQUFPLENBQUM7QUFLUixRQUFBLFFBQVEsR0FBRzs7Ozs7OztnQkFHQSxXQUFNLEVBQUUsQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDO3lCQUN2QyxLQUFLLENBQUM7d0JBQ0gsVUFBVSxFQUFFLEdBQUc7d0JBQ2YsV0FBVyxFQUFFLEdBQUc7d0JBQ2hCLFVBQVUsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFFLElBQUksSUFBSSxFQUFHLENBQUMsT0FBTyxFQUFHLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxJQUFJLENBQUU7cUJBQy9ELENBQUM7eUJBQ0QsR0FBRyxFQUFHLEVBQUE7O2dCQU5MLE9BQU8sR0FBRyxTQU1MO2dCQUdYLFdBQU0sT0FBTyxDQUFDLEdBQUcsQ0FBRSxPQUFPLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBRSxVQUFBLEtBQUs7d0JBQ3RDLE9BQU8sRUFBRSxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUMsQ0FBQyxHQUFHLENBQUUsTUFBTSxDQUFFLEtBQUssQ0FBQyxHQUFHLENBQUUsQ0FBQzs2QkFDbEQsTUFBTSxDQUFDOzRCQUNKLElBQUksRUFBRTtnQ0FDRixXQUFXLEVBQUUsR0FBRzs2QkFDbkI7eUJBQ0osQ0FBQyxDQUFBO29CQUNWLENBQUMsQ0FBQyxDQUFDLEVBQUE7O2dCQVBILFNBT0csQ0FBQztnQkFHSixXQUFNLE9BQU8sQ0FBQyxHQUFHLENBQUUsT0FBTyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUUsVUFBTSxLQUFLOzs7OztvQ0FFdEMsUUFBUSxHQUFHLEtBQUssQ0FBQyxHQUFHLElBQUksS0FBSyxDQUFDLEdBQUcsQ0FBQztvQ0FDbEMsVUFBVSxHQUFHLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDO29DQUV0QyxXQUFNLEVBQUUsQ0FBQyxVQUFVLENBQUUsVUFBVSxDQUFFLENBQUMsR0FBRyxDQUFFLFFBQVEsQ0FBRTs2Q0FDM0QsR0FBRyxFQUFHLEVBQUE7O29DQURMLE1BQU0sR0FBRyxTQUNKO29DQUVYLElBQUssTUFBTSxDQUFDLElBQUksQ0FBQyxLQUFLLEtBQUssU0FBUyxJQUFJLE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxLQUFLLElBQUksRUFBRzt3Q0FBRSxXQUFPO3FDQUFFO29DQUdoRixXQUFNLEVBQUUsQ0FBQyxVQUFVLENBQUUsVUFBVSxDQUFFLENBQUMsR0FBRyxDQUFFLFFBQVEsQ0FBRTs2Q0FDNUMsTUFBTSxDQUFDOzRDQUNKLElBQUksRUFBRTtnREFDRixLQUFLLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBRSxLQUFLLENBQUMsS0FBSyxDQUFFOzZDQUM5Qjt5Q0FDSixDQUFDLEVBQUE7O29DQUxOLFNBS00sQ0FBQzs7Ozt5QkFDVixDQUFDLENBQUMsRUFBQTs7Z0JBakJILFNBaUJHLENBQUM7Z0JBRUosV0FBTyxFQUFFLE1BQU0sRUFBRSxHQUFHLEVBQUUsRUFBQTs7O2dCQUV0QixPQUFPLENBQUMsR0FBRyxDQUFDLFdBQVcsQ0FBRSxDQUFBO2dCQUN6QixXQUFPLEVBQUUsTUFBTSxFQUFFLEdBQUcsRUFBRSxFQUFBOzs7O0tBRTdCLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBjbG91ZCBmcm9tICd3eC1zZXJ2ZXItc2RrJztcblxuY2xvdWQuaW5pdCggKTtcblxuY29uc3QgZGI6IERCLkRhdGFiYXNlID0gY2xvdWQuZGF0YWJhc2UoICk7XG5jb25zdCBfID0gZGIuY29tbWFuZDtcblxuLyoqXG4gKiDmiYDmnInlupTor6XmlK/ku5jvvIzkvYbmmK/mlK/ku5jotoXml7bvvIgzMOWIhumSn++8ieeahOiuouWNle+8jOmHiuaUvuWOn+adpeeahOW6k+WtmO+8jOiuouWNlemHjee9ruS4uuW3sui/h+aXtlxuICovXG5leHBvcnQgY29uc3Qgb3ZlcnRpbWUgPSBhc3luYyAoICkgPT4ge1xuICAgIHRyeSB7XG5cbiAgICAgICAgY29uc3Qgb3JkZXJzJCA9IGF3YWl0IGRiLmNvbGxlY3Rpb24oJ29yZGVyJylcbiAgICAgICAgICAgIC53aGVyZSh7XG4gICAgICAgICAgICAgICAgcGF5X3N0YXR1czogJzAnLFxuICAgICAgICAgICAgICAgIGJhc2Vfc3RhdHVzOiAnMCcsXG4gICAgICAgICAgICAgICAgY3JlYXRlVGltZTogXy5sdGUoIG5ldyBEYXRlKCApLmdldFRpbWUoICkgLSAzMCAqIDYwICogMTAwMCApXG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLmdldCggKTtcblxuICAgICAgICAvLyDorqLljZXmm7TmlrBcbiAgICAgICAgYXdhaXQgUHJvbWlzZS5hbGwoIG9yZGVycyQuZGF0YS5tYXAoIG9yZGVyID0+IHtcbiAgICAgICAgICAgIHJldHVybiBkYi5jb2xsZWN0aW9uKCdvcmRlcicpLmRvYyggU3RyaW5nKCBvcmRlci5faWQgKSlcbiAgICAgICAgICAgICAgICAudXBkYXRlKHtcbiAgICAgICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgICAgICAgYmFzZV9zdGF0dXM6ICc1J1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgfSkpO1xuXG4gICAgICAgIC8vIOW6k+WtmOmHiuaUviAoIOWmguaenOacieW6k+WtmOeahOivnSApXG4gICAgICAgIGF3YWl0IFByb21pc2UuYWxsKCBvcmRlcnMkLmRhdGEubWFwKCBhc3luYyBvcmRlciA9PiB7XG5cbiAgICAgICAgICAgIGNvbnN0IHRhcmdldElkID0gb3JkZXIuc2lkIHx8IG9yZGVyLnBpZDtcbiAgICAgICAgICAgIGNvbnN0IGNvbGxlY3Rpb24gPSBvcmRlci5zaWQgPyAnc3RhbmRhcmRzJyA6ICdnb29kcyc7XG5cbiAgICAgICAgICAgIGNvbnN0IHRhcmdldCA9IGF3YWl0IGRiLmNvbGxlY3Rpb24oIGNvbGxlY3Rpb24gKS5kb2MoIHRhcmdldElkIClcbiAgICAgICAgICAgICAgICAuZ2V0KCApO1xuXG4gICAgICAgICAgICBpZiAoIHRhcmdldC5kYXRhLnN0b2NrID09PSB1bmRlZmluZWQgfHwgdGFyZ2V0LmRhdGEuc3RvY2sgPT09IG51bGwgKSB7IHJldHVybjsgfVxuXG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGF3YWl0IGRiLmNvbGxlY3Rpb24oIGNvbGxlY3Rpb24gKS5kb2MoIHRhcmdldElkIClcbiAgICAgICAgICAgICAgICAudXBkYXRlKHtcbiAgICAgICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgICAgICAgc3RvY2s6IF8uaW5jKCBvcmRlci5jb3VudCApXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgfSkpO1xuICAgICAgICBcbiAgICAgICAgcmV0dXJuIHsgc3RhdHVzOiAyMDAgfVxuICAgIH0gY2F0Y2ggKCBlICkge1xuICAgICAgICBjb25zb2xlLmxvZygnISEhIeWumuaXtuWZqOmUmeivrycsKVxuICAgICAgICByZXR1cm4geyBzdGF0dXM6IDUwMCB9XG4gICAgfVxufTsiXX0=