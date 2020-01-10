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
                if (!checkIsInRange(getNow(), [15])) {
                    return [2, { status: 200 }];
                }
                nowTime = getNow();
                y = nowTime.getFullYear();
                m = nowTime.getMonth() + 1;
                d = nowTime.getDate();
                lastNightTime = new Date(y + "/" + m + "/" + d + " 00:00:00");
                time = lastNightTime.getTime() - 6 * 60 * 60 * 1000;
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
                                        texts: ["\u6628\u5929" + totalPids_1 + "\u6B3E\u5546\u54C1\u88AB" + totalOpenids_1 + "\u4EBA\u56F4\u89C2\u4E86" + totalPids_1 * totalOpenids_1 * 2 + "\u6B21", "\u6682\u65E0\u8BA2\u5355\uFF0C\u8BF7\u5C3D\u5FEB\u53D1\u8D77\u7FA4\u62FC\u56E2\uFF5E"]
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
                                case 0: return [4, cloud.callFunction({
                                        name: 'common',
                                        data: {
                                            $url: 'push-subscribe',
                                            data: {
                                                openid: adm.openid,
                                                type: 'waitPin',
                                                page: "pages/manager-trip-order/index?id=" + order_1.tid,
                                                texts: ["\u6628\u5929\u6709" + maxNum_1 + "\u4EBA\u6D4F\u89C8\uFF0C" + sl_1.uids.length + "\u4EBA\u6210\u529F" + (sl_1.uids.length > 1 ? '拼团！' : '下单！'), "" + good$_1.data.title]
                                            }
                                        }
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLHFDQUF1QztBQUN2QyxvREFBa0Q7QUFFbEQsS0FBSyxDQUFDLElBQUksQ0FBQztJQUNQLEdBQUcsRUFBRSxPQUFPLENBQUMsR0FBRyxDQUFDLEtBQUs7Q0FDekIsQ0FBQyxDQUFDO0FBRUgsSUFBTSxFQUFFLEdBQWdCLEtBQUssQ0FBQyxRQUFRLEVBQUcsQ0FBQztBQUMxQyxJQUFNLENBQUMsR0FBRyxFQUFFLENBQUMsT0FBTyxDQUFDO0FBUXJCLElBQU0sTUFBTSxHQUFHLFVBQUUsRUFBVTtJQUFWLG1CQUFBLEVBQUEsVUFBVTtJQUN2QixJQUFLLEVBQUUsRUFBRztRQUNOLE9BQU8sSUFBSSxDQUFDLEdBQUcsRUFBRyxDQUFDO0tBQ3RCO0lBQ0QsSUFBTSxNQUFNLEdBQUcsSUFBSSxJQUFJLENBQUUsSUFBSSxJQUFJLEVBQUcsQ0FBQyxjQUFjLEVBQUcsQ0FBQyxDQUFDO0lBQ3hELE9BQU8sSUFBSSxJQUFJLENBQUUsTUFBTSxDQUFDLE9BQU8sRUFBRyxHQUFHLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLElBQUksQ0FBRSxDQUFBO0FBQzdELENBQUMsQ0FBQTtBQUVELElBQU0sY0FBYyxHQUFHLFVBQUUsR0FBUyxFQUFFLEtBQWM7SUFBZCxzQkFBQSxFQUFBLFNBQVUsRUFBRSxDQUFFO0lBQzlDLE9BQU8sS0FBSyxDQUFDLElBQUksQ0FBRSxVQUFBLENBQUM7UUFDaEIsSUFBTSxDQUFDLEdBQUcsR0FBRyxDQUFDLFFBQVEsRUFBRyxDQUFDO1FBQzFCLE9BQU8sQ0FBQyxLQUFLLENBQUMsSUFBSSxHQUFHLENBQUMsVUFBVSxFQUFHLEtBQUssQ0FBQyxDQUFDO0lBQzlDLENBQUMsQ0FBQyxDQUFDO0FBQ1AsQ0FBQyxDQUFBO0FBTVksUUFBQSxXQUFX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QTtnQkFDaEMsV0FBTyxFQUFFLE1BQU0sRUFBRSxHQUFHLEVBQUUsRUFBQzs7OztLQUU5QixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgY2xvdWQgZnJvbSAnd3gtc2VydmVyLXNkayc7XG5pbXBvcnQgeyBzdWJzY3JpYmVQdXNoIH0gZnJvbSAnLi4vc3Vic2NyaWJlLXB1c2gnO1xuXG5jbG91ZC5pbml0KHtcbiAgICBlbnY6IHByb2Nlc3MuZW52LmNsb3VkXG59KTtcblxuY29uc3QgZGI6IERCLkRhdGFiYXNlID0gY2xvdWQuZGF0YWJhc2UoICk7XG5jb25zdCBfID0gZGIuY29tbWFuZDtcblxuLyoqIFxuICog6L2s5o2i5qC85p6X5bC85rK75pe25Yy6ICs45pe25Yy6XG4gKiBEYXRlKCkubm93KCkgLyBuZXcgRGF0ZSgpLmdldFRpbWUoKSDmmK/ml7bkuI3ml7bmraPluLjnmoQrOFxuICogRGF0ZS50b0xvY2FsU3RyaW5nKCApIOWlveWDj+aYr+S4gOebtOaYrysw55qEXG4gKiDlhYjmi7/liLAgKzDvvIznhLblkI4rOFxuICovXG5jb25zdCBnZXROb3cgPSAoIHRzID0gZmFsc2UgKTogYW55ID0+IHtcbiAgICBpZiAoIHRzICkge1xuICAgICAgICByZXR1cm4gRGF0ZS5ub3coICk7XG4gICAgfVxuICAgIGNvbnN0IHRpbWVfMCA9IG5ldyBEYXRlKCBuZXcgRGF0ZSggKS50b0xvY2FsZVN0cmluZyggKSk7XG4gICAgcmV0dXJuIG5ldyBEYXRlKCB0aW1lXzAuZ2V0VGltZSggKSArIDggKiA2MCAqIDYwICogMTAwMCApXG59XG5cbmNvbnN0IGNoZWNrSXNJblJhbmdlID0gKCBub3c6IERhdGUsIHJhbmdlID0gWyA5OSBdKSA9PiB7XG4gICAgcmV0dXJuIHJhbmdlLnNvbWUoIHggPT4ge1xuICAgICAgICBjb25zdCBoID0gbm93LmdldEhvdXJzKCApO1xuICAgICAgICByZXR1cm4geCA9PT0gaCAmJiBub3cuZ2V0TWludXRlcyggKSA9PT0gMDtcbiAgICB9KTtcbn1cblxuLyoqXG4gKiDov5DokKXmlbDmja7liIbkuqvvvJrkuIrkuIDkuKrov5DokKXmtLvliqjnmoTmlbDmja5cbiAqIOaXtumXtO+8muaXqeS4ijnngrlcbiAqL1xuZXhwb3J0IGNvbnN0IGxhc3REYXlEYXRhID0gYXN5bmMgKCApID0+IHtcbiAgICB0cnkge1xuXG4gICAgICAgIGlmICggIWNoZWNrSXNJblJhbmdlKCBnZXROb3coICksIFsgMTUgXSkpIHtcbiAgICAgICAgICAgIHJldHVybiB7IHN0YXR1czogMjAwIH07XG4gICAgICAgIH1cblxuICAgICAgICAvLyDmib7liLDmmKjmmZrkuIvljYg254K55ZCO55qE5pe26Ze05oizXG4gICAgICAgIGNvbnN0IG5vd1RpbWUgPSBnZXROb3coICk7XG4gICAgICAgIGNvbnN0IHkgPSBub3dUaW1lLmdldEZ1bGxZZWFyKCApO1xuICAgICAgICBjb25zdCBtID0gbm93VGltZS5nZXRNb250aCggKSArIDE7XG4gICAgICAgIGNvbnN0IGQgPSBub3dUaW1lLmdldERhdGUoICk7XG4gICAgICAgIGNvbnN0IGxhc3ROaWdodFRpbWUgPSBuZXcgRGF0ZShgJHt5fS8ke219LyR7ZH0gMDA6MDA6MDBgKTtcbiAgICAgICAgY29uc3QgdGltZSA9IGxhc3ROaWdodFRpbWUuZ2V0VGltZSggKSAtIDYgKiA2MCAqIDYwICogMTAwMDtcblxuICAgICAgICAvLyDmiorov5nkuKrml7bpl7Tngrnku6XlkI7nmoTmn6XnnIvllYblk4HorrDlvZXpg73mi7/lh7rmnaVcbiAgICAgICAgY29uc3QgdmlzaXRvclJlY29yZHMkID0gYXdhaXQgZGIuY29sbGVjdGlvbignZ29vZC12aXNpdGluZy1yZWNvcmQnKVxuICAgICAgICAgICAgLndoZXJlKHtcbiAgICAgICAgICAgICAgICB2aXNpdFRpbWU6IF8uZ3RlKCB0aW1lIClcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAuZmllbGQoe1xuICAgICAgICAgICAgICAgIHBpZDogdHJ1ZSxcbiAgICAgICAgICAgICAgICBvcGVuaWQ6IHRydWVcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAuZ2V0KCApO1xuICAgICAgICBjb25zdCB2aXNpdG9yUmVjb3JkcyA9IHZpc2l0b3JSZWNvcmRzJC5kYXRhO1xuXG4gICAgICAgIC8vIOaLv+WIsOa1j+iniOiusOW9leacgOmrmOeahOWVhuWTgVxuICAgICAgICBsZXQgbWF4UGlkID0gJyc7XG4gICAgICAgIGxldCBtYXhOdW0gPSAwO1xuXG4gICAgICAgIGxldCBwaWRBcnI6IHN0cmluZ1sgXSA9IFsgXTtcbiAgICAgICAgbGV0IG9wZW5pZEFycjogc3RyaW5nWyBdID0gWyBdO1xuXG4gICAgICAgIHZpc2l0b3JSZWNvcmRzLnJlZHVjZSgoIHJlcywgcmVjb3JkICkgPT4ge1xuXG4gICAgICAgICAgICBwaWRBcnIucHVzaCggcmVjb3JkLnBpZCApO1xuICAgICAgICAgICAgb3BlbmlkQXJyLnB1c2goIHJlY29yZC5vcGVuaWQgKTtcblxuICAgICAgICAgICAgcmVzWyByZWNvcmQucGlkIF0gPSAhcmVzWyByZWNvcmQucGlkIF0gPyAxIDogcmVzWyByZWNvcmQucGlkIF0gKyAxO1xuICAgICAgICAgICAgaWYgKCByZXNbIHJlY29yZC5waWQgXSA+IG1heE51bSApIHtcbiAgICAgICAgICAgICAgICBtYXhQaWQgPSByZWNvcmQucGlkO1xuICAgICAgICAgICAgICAgIG1heE51bSA9IHJlc1sgcmVjb3JkLnBpZCBdO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHJlcztcbiAgICAgICAgfSwgeyB9KTtcblxuICAgICAgICAvKiog6KKr5rWB6YeP6YePICovXG4gICAgICAgIGNvbnN0IHRvdGFsUGlkcyA9IEFycmF5LmZyb20oXG4gICAgICAgICAgICBuZXcgU2V0KCBwaWRBcnIgKVxuICAgICAgICApLmxlbmd0aDtcblxuICAgICAgICAvKiog55So5oi36K6/6Zeu6YePICovXG4gICAgICAgIGNvbnN0IHRvdGFsT3BlbmlkcyA9IEFycmF5LmZyb20oXG4gICAgICAgICAgICBuZXcgU2V0KCBvcGVuaWRBcnIgKVxuICAgICAgICApLmxlbmd0aDtcblxuICAgICAgICAvLyDoi6XmnInvvIzojrflj5bov5nkuKrllYblk4HnmoTmgLvmi7zlm6LkurrmlbBcbiAgICAgICAgaWYgKCAhbWF4TnVtIHx8ICFtYXhQaWQgKSB7XG4gICAgICAgICAgICByZXR1cm4gIHsgc3RhdHVzOiAyMDAgfVxuICAgICAgICB9O1xuXG4gICAgICAgIC8vIOmAu+i+ke+8mumAmui/h29yZGVy55qEY3JlYXRldGltZeaJvuWIsHRpZO+8jCDpgJrov4cgdGlkKyBwaWQg5om+5Yiwc2hvcHBpbmdsaXN0XG4gICAgICAgIGNvbnN0IG9yZGVyJCA9IGF3YWl0IGRiLmNvbGxlY3Rpb24oJ29yZGVyJylcbiAgICAgICAgICAgIC53aGVyZSh7XG4gICAgICAgICAgICAgICAgY3JlYXRlVGltZTogXy5ndGUoIHRpbWUgKVxuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC5maWVsZCh7XG4gICAgICAgICAgICAgICAgdGlkOiB0cnVlXG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLmxpbWl0KCAxIClcbiAgICAgICAgICAgIC5nZXQoICk7XG4gICAgICAgIGNvbnN0IG9yZGVyID0gb3JkZXIkLmRhdGFbIDAgXTtcblxuICAgICAgICAvLyDojrflj5bmiYDmnInnrqHnkIblkZhcbiAgICAgICAgY29uc3QgYWRtcyQgPSBhd2FpdCBkYi5jb2xsZWN0aW9uKCdtYW5hZ2VyLW1lbWJlcicpXG4gICAgICAgICAgICAud2hlcmUoeyB9KVxuICAgICAgICAgICAgLmdldCggKTtcblxuICAgICAgICAvLyDlpoLmnpzmsqHmnInorqLljZXvvIzliJnlj5HpgIHnmoTpg6jliIbmlbDmja5cbiAgICAgICAgaWYgKCBvcmRlciQuZGF0YS5sZW5ndGggPT09IDAgKSB7XG4gICAgICAgICAgICAvLyDmjqjpgIFcbiAgICAgICAgICAgIGF3YWl0IFByb21pc2UuYWxsKFxuICAgICAgICAgICAgICAgIGFkbXMkLmRhdGEubWFwKCBhc3luYyBhZG0gPT4ge1xuICAgICAgICAgICAgICAgICAgICBhd2FpdCBzdWJzY3JpYmVQdXNoKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG9wZW5pZDogYWRtLm9wZW5pZCxcbiAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6ICd3YWl0UGluJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIHBhZ2U6IGBwYWdlcy9ncm91bmQtcGluL2luZGV4YCxcbiAgICAgICAgICAgICAgICAgICAgICAgIHRleHRzOiBbYOaYqOWkqSR7dG90YWxQaWRzfeasvuWVhuWTgeiiqyR7dG90YWxPcGVuaWRzfeS6uuWbtOinguS6hiR7IHRvdGFsUGlkcyAqIHRvdGFsT3BlbmlkcyAqIDIgfeasoWAsIGDmmoLml6DorqLljZXvvIzor7flsL3lv6vlj5HotbfnvqTmi7zlm6LvvZ5gXVxuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAvLyBhd2FpdCBjbG91ZC5jYWxsRnVuY3Rpb24oe1xuICAgICAgICAgICAgICAgICAgICAvLyAgICAgbmFtZTogJ2NvbW1vbicsXG4gICAgICAgICAgICAgICAgICAgIC8vICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICAgIC8vICAgICAgICAgJHVybDogJ3B1c2gtc3Vic2NyaWJlJyxcbiAgICAgICAgICAgICAgICAgICAgLy8gICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICAgIC8vICAgICAgICAgICAgIG9wZW5pZDogYWRtLm9wZW5pZCxcbiAgICAgICAgICAgICAgICAgICAgLy8gICAgICAgICAgICAgdHlwZTogJ3dhaXRQaW4nLFxuICAgICAgICAgICAgICAgICAgICAvLyAgICAgICAgICAgICBwYWdlOiBgcGFnZXMvZ3JvdW5kLXBpbi9pbmRleGAsXG4gICAgICAgICAgICAgICAgICAgIC8vICAgICAgICAgICAgIHRleHRzOiBbYOaYqOWkqSR7dG90YWxQaWRzfeasvuWVhuWTgeiiqyR7dG90YWxPcGVuaWRzfeS6uuWbtOinguS6hiR7IHRvdGFsUGlkcyAqIHRvdGFsT3BlbmlkcyAqIDIgfeasoWAsIGDmmoLml6DorqLljZXvvIzor7flsL3lv6vlj5HotbfnvqTmi7zlm6LvvZ5gXVxuICAgICAgICAgICAgICAgICAgICAvLyAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgLy8gICAgIH1cbiAgICAgICAgICAgICAgICAgICAgLy8gfSk7XG4gICAgICAgICAgICAgICAgICAgIC8vIHJldHVybiBcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgKTtcblxuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBzdGF0dXM6IDIwMFxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgY29uc3Qgc2wkID0gYXdhaXQgZGIuY29sbGVjdGlvbignc2hvcHBpbmctbGlzdCcpXG4gICAgICAgICAgICAud2hlcmUoe1xuICAgICAgICAgICAgICAgIHBpZDogbWF4UGlkLFxuICAgICAgICAgICAgICAgIHRpZDogb3JkZXIudGlkXG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLmZpZWxkKHtcbiAgICAgICAgICAgICAgICB1aWRzOiB0cnVlXG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLmdldCggKTtcbiAgICAgICAgY29uc3Qgc2wgPSBzbCQuZGF0YVsgMCBdO1xuXG4gICAgICAgIGlmICggc2wkLmRhdGEubGVuZ3RoID09PSAwICkge1xuICAgICAgICAgICAgcmV0dXJuICB7IHN0YXR1czogMjAwIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC8vIOiOt+WPluWVhuWTgeivpuaDhVxuICAgICAgICBjb25zdCBnb29kJCA9IGF3YWl0IGRiLmNvbGxlY3Rpb24oJ2dvb2RzJylcbiAgICAgICAgICAgIC5kb2MoIFN0cmluZyggbWF4UGlkICkpXG4gICAgICAgICAgICAuZmllbGQoe1xuICAgICAgICAgICAgICAgIHRpdGxlOiB0cnVlXG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLmdldCggKTtcblxuICAgICAgICAvLyDmjqjpgIFcbiAgICAgICAgYXdhaXQgUHJvbWlzZS5hbGwoXG4gICAgICAgICAgICBhZG1zJC5kYXRhLm1hcCggYXN5bmMgYWRtID0+IHtcbiAgICAgICAgICAgICAgICBhd2FpdCBjbG91ZC5jYWxsRnVuY3Rpb24oe1xuICAgICAgICAgICAgICAgICAgICBuYW1lOiAnY29tbW9uJyxcbiAgICAgICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgICAgICAgJHVybDogJ3B1c2gtc3Vic2NyaWJlJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvcGVuaWQ6IGFkbS5vcGVuaWQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogJ3dhaXRQaW4nLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhZ2U6IGBwYWdlcy9tYW5hZ2VyLXRyaXAtb3JkZXIvaW5kZXg/aWQ9JHtvcmRlci50aWR9YCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZXh0czogW2DmmKjlpKnmnIkke21heE51bX3kurrmtY/op4jvvIwke3NsLnVpZHMubGVuZ3RofeS6uuaIkOWKnyR7c2wudWlkcy5sZW5ndGggPiAxID8gJ+aLvOWbou+8gScgOiAn5LiL5Y2V77yBJ31gLCBgJHtnb29kJC5kYXRhLnRpdGxlfWBdXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICByZXR1cm4gXG4gICAgICAgICAgICB9KVxuICAgICAgICApO1xuXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBzdGF0dXM6IDIwMFxuICAgICAgICB9XG5cbiAgICB9IGNhdGNoICggZSApIHtcbiAgICAgICAgY29uc29sZS5sb2coJyEhISEhIWxhc3REYXlEYXRhJylcbiAgICAgICAgcmV0dXJuIHsgc3RhdHVzOiA1MDAgfTtcbiAgICB9XG59OyJdfQ==