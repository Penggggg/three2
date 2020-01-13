"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
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
Object.defineProperty(exports, "__esModule", { value: true });
var cloud = require("wx-server-sdk");
var subscribe_push_1 = require("../subscribe-push");
cloud.init({
    env: process.env.cloud
});
var db = cloud.database();
var _ = db.command;
var getNow = function (ts) {
    if (ts === void 0) { ts = false; }
    if (ts) {
        return Date.now();
    }
    var time_0 = new Date(new Date().toLocaleString());
    return new Date(time_0.getTime() + 8 * 60 * 60 * 1000);
};
var checkIsInRange = function (now, range) {
    if (range === void 0) { range = [99]; }
    return range.some(function (x) {
        var h = now.getHours();
        return x === h && now.getMinutes() === 0;
    });
};
exports.lastDayData = function () { return __awaiter(void 0, void 0, void 0, function () {
    var nowTime, y, m, d, lastNightTime, time, visitorRecords$, visitorRecords, maxPid_1, maxNum_1, pidArr_1, openidArr_1, totalPids_1, totalOpenids_1, order$, order_1, adms$, sl$, sl_1, good$_1, e_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 9, , 10]);
                if (!checkIsInRange(getNow(), [9])) {
                    return [2, { status: 200 }];
                }
                nowTime = getNow();
                y = nowTime.getFullYear();
                m = nowTime.getMonth() + 1;
                d = nowTime.getDate();
                lastNightTime = new Date(y + "/" + m + "/" + d + " 00:00:00").getTime() - 8 * 60 * 60 * 1000;
                time = lastNightTime - 6 * 60 * 60 * 1000;
                return [4, db.collection('good-visiting-record')
                        .where({
                        visitTime: _.gte(time)
                    })
                        .field({
                        pid: true,
                        openid: true
                    })
                        .get()];
            case 1:
                visitorRecords$ = _a.sent();
                visitorRecords = visitorRecords$.data;
                maxPid_1 = '';
                maxNum_1 = 0;
                pidArr_1 = [];
                openidArr_1 = [];
                visitorRecords.reduce(function (res, record) {
                    pidArr_1.push(record.pid);
                    openidArr_1.push(record.openid);
                    res[record.pid] = !res[record.pid] ? 1 : res[record.pid] + 1;
                    if (res[record.pid] > maxNum_1) {
                        maxPid_1 = record.pid;
                        maxNum_1 = res[record.pid];
                    }
                    return res;
                }, {});
                totalPids_1 = Array.from(new Set(pidArr_1)).length;
                totalOpenids_1 = Array.from(new Set(openidArr_1)).length;
                if (!maxNum_1 || !maxPid_1) {
                    return [2, { status: 200 }];
                }
                ;
                return [4, db.collection('order')
                        .where({
                        createTime: _.gte(time)
                    })
                        .field({
                        tid: true
                    })
                        .limit(1)
                        .get()];
            case 2:
                order$ = _a.sent();
                order_1 = order$.data[0];
                return [4, db.collection('manager-member')
                        .where({})
                        .get()];
            case 3:
                adms$ = _a.sent();
                if (!(order$.data.length === 0)) return [3, 5];
                return [4, Promise.all(adms$.data.map(function (adm) { return __awaiter(void 0, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4, subscribe_push_1.subscribePush({
                                        openid: adm.openid,
                                        type: 'waitPin',
                                        page: "pages/ground-pin/index",
                                        texts: ["\u6628\u5929" + totalPids_1 + "\u6B3E\u5546\u54C1\u88AB" + totalOpenids_1 + "\u4EBA\u56F4\u89C2\u4E86" + Math.ceil(totalPids_1 * totalOpenids_1 * 0.5) + "\u6B21", "\u8BF7\u5C3D\u5FEB\u4F7F\u7528\u7FA4\u62FC\u56E2\uFF01\u6BCF\u6708\u591A\u8D5A30%\uFF5E"]
                                    })];
                                case 1:
                                    _a.sent();
                                    return [2];
                            }
                        });
                    }); }))];
            case 4:
                _a.sent();
                return [2, {
                        status: 200
                    }];
            case 5: return [4, db.collection('shopping-list')
                    .where({
                    pid: maxPid_1,
                    tid: order_1.tid
                })
                    .field({
                    uids: true
                })
                    .get()];
            case 6:
                sl$ = _a.sent();
                sl_1 = sl$.data[0];
                if (sl$.data.length === 0) {
                    return [2, { status: 200 }];
                }
                return [4, db.collection('goods')
                        .doc(String(maxPid_1))
                        .field({
                        title: true
                    })
                        .get()];
            case 7:
                good$_1 = _a.sent();
                return [4, Promise.all(adms$.data.map(function (adm) { return __awaiter(void 0, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4, subscribe_push_1.subscribePush({
                                        openid: adm.openid,
                                        type: 'waitPin',
                                        page: "pages/manager-trip-order/index?id=" + order_1.tid,
                                        texts: ["\u6628\u5929\u6709" + maxNum_1 + "\u4EBA\u6D4F\u89C8\uFF0C" + sl_1.uids.length + "\u4EBA\u6210\u529F" + (sl_1.uids.length > 1 ? '拼团！' : '下单！'), "" + good$_1.data.title]
                                    })];
                                case 1:
                                    _a.sent();
                                    return [2];
                            }
                        });
                    }); }))];
            case 8:
                _a.sent();
                return [2, {
                        status: 200
                    }];
            case 9:
                e_1 = _a.sent();
                console.log('!!!!!!lastDayData');
                return [2, { status: 500 }];
            case 10: return [2];
        }
    });
}); };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLHFDQUF1QztBQUN2QyxvREFBa0Q7QUFFbEQsS0FBSyxDQUFDLElBQUksQ0FBQztJQUNQLEdBQUcsRUFBRSxPQUFPLENBQUMsR0FBRyxDQUFDLEtBQUs7Q0FDekIsQ0FBQyxDQUFDO0FBRUgsSUFBTSxFQUFFLEdBQWdCLEtBQUssQ0FBQyxRQUFRLEVBQUcsQ0FBQztBQUMxQyxJQUFNLENBQUMsR0FBRyxFQUFFLENBQUMsT0FBTyxDQUFDO0FBUXJCLElBQU0sTUFBTSxHQUFHLFVBQUUsRUFBVTtJQUFWLG1CQUFBLEVBQUEsVUFBVTtJQUN2QixJQUFLLEVBQUUsRUFBRztRQUNOLE9BQU8sSUFBSSxDQUFDLEdBQUcsRUFBRyxDQUFDO0tBQ3RCO0lBQ0QsSUFBTSxNQUFNLEdBQUcsSUFBSSxJQUFJLENBQUUsSUFBSSxJQUFJLEVBQUcsQ0FBQyxjQUFjLEVBQUcsQ0FBQyxDQUFDO0lBQ3hELE9BQU8sSUFBSSxJQUFJLENBQUUsTUFBTSxDQUFDLE9BQU8sRUFBRyxHQUFHLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLElBQUksQ0FBRSxDQUFBO0FBQzdELENBQUMsQ0FBQTtBQUVELElBQU0sY0FBYyxHQUFHLFVBQUUsR0FBUyxFQUFFLEtBQWM7SUFBZCxzQkFBQSxFQUFBLFNBQVUsRUFBRSxDQUFFO0lBQzlDLE9BQU8sS0FBSyxDQUFDLElBQUksQ0FBRSxVQUFBLENBQUM7UUFDaEIsSUFBTSxDQUFDLEdBQUcsR0FBRyxDQUFDLFFBQVEsRUFBRyxDQUFDO1FBQzFCLE9BQU8sQ0FBQyxLQUFLLENBQUMsSUFBSSxHQUFHLENBQUMsVUFBVSxFQUFHLEtBQUssQ0FBQyxDQUFDO0lBQzlDLENBQUMsQ0FBQyxDQUFDO0FBQ1AsQ0FBQyxDQUFBO0FBTVksUUFBQSxXQUFXLEdBQUc7Ozs7OztnQkFHbkIsSUFBSyxDQUFDLGNBQWMsQ0FBRSxNQUFNLEVBQUcsRUFBRSxDQUFFLENBQUMsQ0FBRSxDQUFDLEVBQUU7b0JBQ3JDLFdBQU8sRUFBRSxNQUFNLEVBQUUsR0FBRyxFQUFFLEVBQUM7aUJBQzFCO2dCQUdLLE9BQU8sR0FBRyxNQUFNLEVBQUcsQ0FBQztnQkFDcEIsQ0FBQyxHQUFHLE9BQU8sQ0FBQyxXQUFXLEVBQUcsQ0FBQztnQkFDM0IsQ0FBQyxHQUFHLE9BQU8sQ0FBQyxRQUFRLEVBQUcsR0FBRyxDQUFDLENBQUM7Z0JBQzVCLENBQUMsR0FBRyxPQUFPLENBQUMsT0FBTyxFQUFHLENBQUM7Z0JBQ3ZCLGFBQWEsR0FBRyxJQUFJLElBQUksQ0FBSSxDQUFDLFNBQUksQ0FBQyxTQUFJLENBQUMsY0FBVyxDQUFDLENBQUMsT0FBTyxFQUFHLEdBQUcsQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsSUFBSSxDQUFDO2dCQUNwRixJQUFJLEdBQUcsYUFBYSxHQUFHLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLElBQUksQ0FBQztnQkFHeEIsV0FBTSxFQUFFLENBQUMsVUFBVSxDQUFDLHNCQUFzQixDQUFDO3lCQUM5RCxLQUFLLENBQUM7d0JBQ0gsU0FBUyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUUsSUFBSSxDQUFFO3FCQUMzQixDQUFDO3lCQUNELEtBQUssQ0FBQzt3QkFDSCxHQUFHLEVBQUUsSUFBSTt3QkFDVCxNQUFNLEVBQUUsSUFBSTtxQkFDZixDQUFDO3lCQUNELEdBQUcsRUFBRyxFQUFBOztnQkFSTCxlQUFlLEdBQUcsU0FRYjtnQkFDTCxjQUFjLEdBQUcsZUFBZSxDQUFDLElBQUksQ0FBQztnQkFHeEMsV0FBUyxFQUFFLENBQUM7Z0JBQ1osV0FBUyxDQUFDLENBQUM7Z0JBRVgsV0FBb0IsRUFBRyxDQUFDO2dCQUN4QixjQUF1QixFQUFHLENBQUM7Z0JBRS9CLGNBQWMsQ0FBQyxNQUFNLENBQUMsVUFBRSxHQUFHLEVBQUUsTUFBTTtvQkFFL0IsUUFBTSxDQUFDLElBQUksQ0FBRSxNQUFNLENBQUMsR0FBRyxDQUFFLENBQUM7b0JBQzFCLFdBQVMsQ0FBQyxJQUFJLENBQUUsTUFBTSxDQUFDLE1BQU0sQ0FBRSxDQUFDO29CQUVoQyxHQUFHLENBQUUsTUFBTSxDQUFDLEdBQUcsQ0FBRSxHQUFHLENBQUMsR0FBRyxDQUFFLE1BQU0sQ0FBQyxHQUFHLENBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUUsTUFBTSxDQUFDLEdBQUcsQ0FBRSxHQUFHLENBQUMsQ0FBQztvQkFDbkUsSUFBSyxHQUFHLENBQUUsTUFBTSxDQUFDLEdBQUcsQ0FBRSxHQUFHLFFBQU0sRUFBRzt3QkFDOUIsUUFBTSxHQUFHLE1BQU0sQ0FBQyxHQUFHLENBQUM7d0JBQ3BCLFFBQU0sR0FBRyxHQUFHLENBQUUsTUFBTSxDQUFDLEdBQUcsQ0FBRSxDQUFDO3FCQUM5QjtvQkFDRCxPQUFPLEdBQUcsQ0FBQztnQkFDZixDQUFDLEVBQUUsRUFBRyxDQUFDLENBQUM7Z0JBR0YsY0FBWSxLQUFLLENBQUMsSUFBSSxDQUN4QixJQUFJLEdBQUcsQ0FBRSxRQUFNLENBQUUsQ0FDcEIsQ0FBQyxNQUFNLENBQUM7Z0JBR0gsaUJBQWUsS0FBSyxDQUFDLElBQUksQ0FDM0IsSUFBSSxHQUFHLENBQUUsV0FBUyxDQUFFLENBQ3ZCLENBQUMsTUFBTSxDQUFDO2dCQUdULElBQUssQ0FBQyxRQUFNLElBQUksQ0FBQyxRQUFNLEVBQUc7b0JBQ3RCLFdBQVEsRUFBRSxNQUFNLEVBQUUsR0FBRyxFQUFFLEVBQUE7aUJBQzFCO2dCQUFBLENBQUM7Z0JBR2EsV0FBTSxFQUFFLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQzt5QkFDdEMsS0FBSyxDQUFDO3dCQUNILFVBQVUsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFFLElBQUksQ0FBRTtxQkFDNUIsQ0FBQzt5QkFDRCxLQUFLLENBQUM7d0JBQ0gsR0FBRyxFQUFFLElBQUk7cUJBQ1osQ0FBQzt5QkFDRCxLQUFLLENBQUUsQ0FBQyxDQUFFO3lCQUNWLEdBQUcsRUFBRyxFQUFBOztnQkFSTCxNQUFNLEdBQUcsU0FRSjtnQkFDTCxVQUFRLE1BQU0sQ0FBQyxJQUFJLENBQUUsQ0FBQyxDQUFFLENBQUM7Z0JBR2pCLFdBQU0sRUFBRSxDQUFDLFVBQVUsQ0FBQyxnQkFBZ0IsQ0FBQzt5QkFDOUMsS0FBSyxDQUFDLEVBQUcsQ0FBQzt5QkFDVixHQUFHLEVBQUcsRUFBQTs7Z0JBRkwsS0FBSyxHQUFHLFNBRUg7cUJBR04sQ0FBQSxNQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sS0FBSyxDQUFDLENBQUEsRUFBeEIsY0FBd0I7Z0JBRXpCLFdBQU0sT0FBTyxDQUFDLEdBQUcsQ0FDYixLQUFLLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBRSxVQUFNLEdBQUc7Ozt3Q0FDckIsV0FBTSw4QkFBYSxDQUFDO3dDQUNoQixNQUFNLEVBQUUsR0FBRyxDQUFDLE1BQU07d0NBQ2xCLElBQUksRUFBRSxTQUFTO3dDQUNmLElBQUksRUFBRSx3QkFBd0I7d0NBQzlCLEtBQUssRUFBRSxDQUFDLGlCQUFLLFdBQVMsZ0NBQU8sY0FBWSxnQ0FBUSxJQUFJLENBQUMsSUFBSSxDQUFFLFdBQVMsR0FBRyxjQUFZLEdBQUcsR0FBRyxDQUFFLFdBQUcsRUFBRSx5RkFBbUIsQ0FBQztxQ0FDeEgsQ0FBQyxFQUFBOztvQ0FMRixTQUtFLENBQUE7Ozs7eUJBQ0wsQ0FBQyxDQUNMLEVBQUE7O2dCQVRELFNBU0MsQ0FBQztnQkFFRixXQUFPO3dCQUNILE1BQU0sRUFBRSxHQUFHO3FCQUNkLEVBQUE7b0JBR08sV0FBTSxFQUFFLENBQUMsVUFBVSxDQUFDLGVBQWUsQ0FBQztxQkFDM0MsS0FBSyxDQUFDO29CQUNILEdBQUcsRUFBRSxRQUFNO29CQUNYLEdBQUcsRUFBRSxPQUFLLENBQUMsR0FBRztpQkFDakIsQ0FBQztxQkFDRCxLQUFLLENBQUM7b0JBQ0gsSUFBSSxFQUFFLElBQUk7aUJBQ2IsQ0FBQztxQkFDRCxHQUFHLEVBQUcsRUFBQTs7Z0JBUkwsR0FBRyxHQUFHLFNBUUQ7Z0JBQ0wsT0FBSyxHQUFHLENBQUMsSUFBSSxDQUFFLENBQUMsQ0FBRSxDQUFDO2dCQUV6QixJQUFLLEdBQUcsQ0FBQyxJQUFJLENBQUMsTUFBTSxLQUFLLENBQUMsRUFBRztvQkFDekIsV0FBUSxFQUFFLE1BQU0sRUFBRSxHQUFHLEVBQUUsRUFBQTtpQkFDMUI7Z0JBR2EsV0FBTSxFQUFFLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQzt5QkFDckMsR0FBRyxDQUFFLE1BQU0sQ0FBRSxRQUFNLENBQUUsQ0FBQzt5QkFDdEIsS0FBSyxDQUFDO3dCQUNILEtBQUssRUFBRSxJQUFJO3FCQUNkLENBQUM7eUJBQ0QsR0FBRyxFQUFHLEVBQUE7O2dCQUxMLFVBQVEsU0FLSDtnQkFHWCxXQUFNLE9BQU8sQ0FBQyxHQUFHLENBQ2IsS0FBSyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUUsVUFBTSxHQUFHOzs7d0NBQ3JCLFdBQU0sOEJBQWEsQ0FBQzt3Q0FDaEIsTUFBTSxFQUFFLEdBQUcsQ0FBQyxNQUFNO3dDQUNsQixJQUFJLEVBQUUsU0FBUzt3Q0FDZixJQUFJLEVBQUUsdUNBQXFDLE9BQUssQ0FBQyxHQUFLO3dDQUN0RCxLQUFLLEVBQUUsQ0FBQyx1QkFBTSxRQUFNLGdDQUFPLElBQUUsQ0FBQyxJQUFJLENBQUMsTUFBTSwyQkFBTSxJQUFFLENBQUMsSUFBSSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFFLEVBQUUsS0FBRyxPQUFLLENBQUMsSUFBSSxDQUFDLEtBQU8sQ0FBQztxQ0FDOUcsQ0FBQyxFQUFBOztvQ0FMRixTQUtFLENBQUM7Ozs7eUJBQ04sQ0FBQyxDQUNMLEVBQUE7O2dCQVRELFNBU0MsQ0FBQztnQkFFRixXQUFPO3dCQUNILE1BQU0sRUFBRSxHQUFHO3FCQUNkLEVBQUE7OztnQkFHRCxPQUFPLENBQUMsR0FBRyxDQUFDLG1CQUFtQixDQUFDLENBQUE7Z0JBQ2hDLFdBQU8sRUFBRSxNQUFNLEVBQUUsR0FBRyxFQUFFLEVBQUM7Ozs7S0FFOUIsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIGNsb3VkIGZyb20gJ3d4LXNlcnZlci1zZGsnO1xuaW1wb3J0IHsgc3Vic2NyaWJlUHVzaCB9IGZyb20gJy4uL3N1YnNjcmliZS1wdXNoJztcblxuY2xvdWQuaW5pdCh7XG4gICAgZW52OiBwcm9jZXNzLmVudi5jbG91ZFxufSk7XG5cbmNvbnN0IGRiOiBEQi5EYXRhYmFzZSA9IGNsb3VkLmRhdGFiYXNlKCApO1xuY29uc3QgXyA9IGRiLmNvbW1hbmQ7XG5cbi8qKiBcbiAqIOi9rOaNouagvOael+WwvOayu+aXtuWMuiArOOaXtuWMulxuICogRGF0ZSgpLm5vdygpIC8gbmV3IERhdGUoKS5nZXRUaW1lKCkg5piv5pe25LiN5pe25q2j5bi455qEKzhcbiAqIERhdGUudG9Mb2NhbFN0cmluZyggKSDlpb3lg4/mmK/kuIDnm7TmmK8rMOeahFxuICog5YWI5ou/5YiwICsw77yM54S25ZCOKzhcbiAqL1xuY29uc3QgZ2V0Tm93ID0gKCB0cyA9IGZhbHNlICk6IGFueSA9PiB7XG4gICAgaWYgKCB0cyApIHtcbiAgICAgICAgcmV0dXJuIERhdGUubm93KCApO1xuICAgIH1cbiAgICBjb25zdCB0aW1lXzAgPSBuZXcgRGF0ZSggbmV3IERhdGUoICkudG9Mb2NhbGVTdHJpbmcoICkpO1xuICAgIHJldHVybiBuZXcgRGF0ZSggdGltZV8wLmdldFRpbWUoICkgKyA4ICogNjAgKiA2MCAqIDEwMDAgKVxufVxuXG5jb25zdCBjaGVja0lzSW5SYW5nZSA9ICggbm93OiBEYXRlLCByYW5nZSA9IFsgOTkgXSkgPT4ge1xuICAgIHJldHVybiByYW5nZS5zb21lKCB4ID0+IHtcbiAgICAgICAgY29uc3QgaCA9IG5vdy5nZXRIb3VycyggKTtcbiAgICAgICAgcmV0dXJuIHggPT09IGggJiYgbm93LmdldE1pbnV0ZXMoICkgPT09IDA7XG4gICAgfSk7XG59XG5cbi8qKlxuICog6L+Q6JCl5pWw5o2u5YiG5Lqr77ya5LiK5LiA5Liq6L+Q6JCl5rS75Yqo55qE5pWw5o2uXG4gKiDml7bpl7TvvJrml6nkuIo554K5XG4gKi9cbmV4cG9ydCBjb25zdCBsYXN0RGF5RGF0YSA9IGFzeW5jICggKSA9PiB7XG4gICAgdHJ5IHtcblxuICAgICAgICBpZiAoICFjaGVja0lzSW5SYW5nZSggZ2V0Tm93KCApLCBbIDkgXSkpIHtcbiAgICAgICAgICAgIHJldHVybiB7IHN0YXR1czogMjAwIH07XG4gICAgICAgIH1cblxuICAgICAgICAvLyDmib7liLDmmKjmmZrkuIvljYg254K55ZCO55qE5pe26Ze05oizXG4gICAgICAgIGNvbnN0IG5vd1RpbWUgPSBnZXROb3coICk7XG4gICAgICAgIGNvbnN0IHkgPSBub3dUaW1lLmdldEZ1bGxZZWFyKCApO1xuICAgICAgICBjb25zdCBtID0gbm93VGltZS5nZXRNb250aCggKSArIDE7XG4gICAgICAgIGNvbnN0IGQgPSBub3dUaW1lLmdldERhdGUoICk7XG4gICAgICAgIGNvbnN0IGxhc3ROaWdodFRpbWUgPSBuZXcgRGF0ZShgJHt5fS8ke219LyR7ZH0gMDA6MDA6MDBgKS5nZXRUaW1lKCApIC0gOCAqIDYwICogNjAgKiAxMDAwO1xuICAgICAgICBjb25zdCB0aW1lID0gbGFzdE5pZ2h0VGltZSAtIDYgKiA2MCAqIDYwICogMTAwMDtcblxuICAgICAgICAvLyDmiorov5nkuKrml7bpl7Tngrnku6XlkI7nmoTmn6XnnIvllYblk4HorrDlvZXpg73mi7/lh7rmnaVcbiAgICAgICAgY29uc3QgdmlzaXRvclJlY29yZHMkID0gYXdhaXQgZGIuY29sbGVjdGlvbignZ29vZC12aXNpdGluZy1yZWNvcmQnKVxuICAgICAgICAgICAgLndoZXJlKHtcbiAgICAgICAgICAgICAgICB2aXNpdFRpbWU6IF8uZ3RlKCB0aW1lIClcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAuZmllbGQoe1xuICAgICAgICAgICAgICAgIHBpZDogdHJ1ZSxcbiAgICAgICAgICAgICAgICBvcGVuaWQ6IHRydWVcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAuZ2V0KCApO1xuICAgICAgICBjb25zdCB2aXNpdG9yUmVjb3JkcyA9IHZpc2l0b3JSZWNvcmRzJC5kYXRhO1xuXG4gICAgICAgIC8vIOaLv+WIsOa1j+iniOiusOW9leacgOmrmOeahOWVhuWTgVxuICAgICAgICBsZXQgbWF4UGlkID0gJyc7XG4gICAgICAgIGxldCBtYXhOdW0gPSAwO1xuXG4gICAgICAgIGxldCBwaWRBcnI6IHN0cmluZ1sgXSA9IFsgXTtcbiAgICAgICAgbGV0IG9wZW5pZEFycjogc3RyaW5nWyBdID0gWyBdO1xuXG4gICAgICAgIHZpc2l0b3JSZWNvcmRzLnJlZHVjZSgoIHJlcywgcmVjb3JkICkgPT4ge1xuXG4gICAgICAgICAgICBwaWRBcnIucHVzaCggcmVjb3JkLnBpZCApO1xuICAgICAgICAgICAgb3BlbmlkQXJyLnB1c2goIHJlY29yZC5vcGVuaWQgKTtcblxuICAgICAgICAgICAgcmVzWyByZWNvcmQucGlkIF0gPSAhcmVzWyByZWNvcmQucGlkIF0gPyAxIDogcmVzWyByZWNvcmQucGlkIF0gKyAxO1xuICAgICAgICAgICAgaWYgKCByZXNbIHJlY29yZC5waWQgXSA+IG1heE51bSApIHtcbiAgICAgICAgICAgICAgICBtYXhQaWQgPSByZWNvcmQucGlkO1xuICAgICAgICAgICAgICAgIG1heE51bSA9IHJlc1sgcmVjb3JkLnBpZCBdO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHJlcztcbiAgICAgICAgfSwgeyB9KTtcblxuICAgICAgICAvKiog6KKr5rWB6YeP6YePICovXG4gICAgICAgIGNvbnN0IHRvdGFsUGlkcyA9IEFycmF5LmZyb20oXG4gICAgICAgICAgICBuZXcgU2V0KCBwaWRBcnIgKVxuICAgICAgICApLmxlbmd0aDtcblxuICAgICAgICAvKiog55So5oi36K6/6Zeu6YePICovXG4gICAgICAgIGNvbnN0IHRvdGFsT3BlbmlkcyA9IEFycmF5LmZyb20oXG4gICAgICAgICAgICBuZXcgU2V0KCBvcGVuaWRBcnIgKVxuICAgICAgICApLmxlbmd0aDtcblxuICAgICAgICAvLyDoi6XmnInvvIzojrflj5bov5nkuKrllYblk4HnmoTmgLvmi7zlm6LkurrmlbBcbiAgICAgICAgaWYgKCAhbWF4TnVtIHx8ICFtYXhQaWQgKSB7XG4gICAgICAgICAgICByZXR1cm4gIHsgc3RhdHVzOiAyMDAgfVxuICAgICAgICB9O1xuXG4gICAgICAgIC8vIOmAu+i+ke+8mumAmui/h29yZGVy55qEY3JlYXRldGltZeaJvuWIsHRpZO+8jCDpgJrov4cgdGlkKyBwaWQg5om+5Yiwc2hvcHBpbmdsaXN0XG4gICAgICAgIGNvbnN0IG9yZGVyJCA9IGF3YWl0IGRiLmNvbGxlY3Rpb24oJ29yZGVyJylcbiAgICAgICAgICAgIC53aGVyZSh7XG4gICAgICAgICAgICAgICAgY3JlYXRlVGltZTogXy5ndGUoIHRpbWUgKVxuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC5maWVsZCh7XG4gICAgICAgICAgICAgICAgdGlkOiB0cnVlXG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLmxpbWl0KCAxIClcbiAgICAgICAgICAgIC5nZXQoICk7XG4gICAgICAgIGNvbnN0IG9yZGVyID0gb3JkZXIkLmRhdGFbIDAgXTtcblxuICAgICAgICAvLyDojrflj5bmiYDmnInnrqHnkIblkZhcbiAgICAgICAgY29uc3QgYWRtcyQgPSBhd2FpdCBkYi5jb2xsZWN0aW9uKCdtYW5hZ2VyLW1lbWJlcicpXG4gICAgICAgICAgICAud2hlcmUoeyB9KVxuICAgICAgICAgICAgLmdldCggKTtcblxuICAgICAgICAvLyDlpoLmnpzmsqHmnInorqLljZXvvIzliJnlj5HpgIHnmoTpg6jliIbmlbDmja5cbiAgICAgICAgaWYgKCBvcmRlciQuZGF0YS5sZW5ndGggPT09IDAgKSB7XG4gICAgICAgICAgICAvLyDmjqjpgIFcbiAgICAgICAgICAgIGF3YWl0IFByb21pc2UuYWxsKFxuICAgICAgICAgICAgICAgIGFkbXMkLmRhdGEubWFwKCBhc3luYyBhZG0gPT4ge1xuICAgICAgICAgICAgICAgICAgICBhd2FpdCBzdWJzY3JpYmVQdXNoKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG9wZW5pZDogYWRtLm9wZW5pZCxcbiAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6ICd3YWl0UGluJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIHBhZ2U6IGBwYWdlcy9ncm91bmQtcGluL2luZGV4YCxcbiAgICAgICAgICAgICAgICAgICAgICAgIHRleHRzOiBbYOaYqOWkqSR7dG90YWxQaWRzfeasvuWVhuWTgeiiqyR7dG90YWxPcGVuaWRzfeS6uuWbtOinguS6hiR7IE1hdGguY2VpbCggdG90YWxQaWRzICogdG90YWxPcGVuaWRzICogMC41ICl95qyhYCwgYOivt+WwveW/q+S9v+eUqOe+pOaLvOWbou+8geavj+aciOWkmui1mjMwJe+9nmBdXG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICk7XG5cbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgc3RhdHVzOiAyMDBcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IHNsJCA9IGF3YWl0IGRiLmNvbGxlY3Rpb24oJ3Nob3BwaW5nLWxpc3QnKVxuICAgICAgICAgICAgLndoZXJlKHtcbiAgICAgICAgICAgICAgICBwaWQ6IG1heFBpZCxcbiAgICAgICAgICAgICAgICB0aWQ6IG9yZGVyLnRpZFxuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC5maWVsZCh7XG4gICAgICAgICAgICAgICAgdWlkczogdHJ1ZVxuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC5nZXQoICk7XG4gICAgICAgIGNvbnN0IHNsID0gc2wkLmRhdGFbIDAgXTtcblxuICAgICAgICBpZiAoIHNsJC5kYXRhLmxlbmd0aCA9PT0gMCApIHtcbiAgICAgICAgICAgIHJldHVybiAgeyBzdGF0dXM6IDIwMCB9XG4gICAgICAgIH1cblxuICAgICAgICAvLyDojrflj5bllYblk4Hor6bmg4VcbiAgICAgICAgY29uc3QgZ29vZCQgPSBhd2FpdCBkYi5jb2xsZWN0aW9uKCdnb29kcycpXG4gICAgICAgICAgICAuZG9jKCBTdHJpbmcoIG1heFBpZCApKVxuICAgICAgICAgICAgLmZpZWxkKHtcbiAgICAgICAgICAgICAgICB0aXRsZTogdHJ1ZVxuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC5nZXQoICk7XG5cbiAgICAgICAgLy8g5o6o6YCBXG4gICAgICAgIGF3YWl0IFByb21pc2UuYWxsKFxuICAgICAgICAgICAgYWRtcyQuZGF0YS5tYXAoIGFzeW5jIGFkbSA9PiB7XG4gICAgICAgICAgICAgICAgYXdhaXQgc3Vic2NyaWJlUHVzaCh7XG4gICAgICAgICAgICAgICAgICAgIG9wZW5pZDogYWRtLm9wZW5pZCxcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogJ3dhaXRQaW4nLFxuICAgICAgICAgICAgICAgICAgICBwYWdlOiBgcGFnZXMvbWFuYWdlci10cmlwLW9yZGVyL2luZGV4P2lkPSR7b3JkZXIudGlkfWAsXG4gICAgICAgICAgICAgICAgICAgIHRleHRzOiBbYOaYqOWkqeaciSR7bWF4TnVtfeS6uua1j+iniO+8jCR7c2wudWlkcy5sZW5ndGh95Lq65oiQ5YqfJHtzbC51aWRzLmxlbmd0aCA+IDEgPyAn5ou85Zui77yBJyA6ICfkuIvljZXvvIEnfWAsIGAke2dvb2QkLmRhdGEudGl0bGV9YF1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0pXG4gICAgICAgICk7XG5cbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHN0YXR1czogMjAwXG4gICAgICAgIH1cblxuICAgIH0gY2F0Y2ggKCBlICkge1xuICAgICAgICBjb25zb2xlLmxvZygnISEhISEhbGFzdERheURhdGEnKVxuICAgICAgICByZXR1cm4geyBzdGF0dXM6IDUwMCB9O1xuICAgIH1cbn07Il19