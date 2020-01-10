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
                                        texts: ["\u6628\u5929" + totalPids_1 + "\u6B3E\u5546\u54C1\u88AB" + totalOpenids_1 + "\u4EBA\u56F4\u89C2\u4E86" + totalPids_1 * totalOpenids_1 * 2 + "\u6B21", "\u8BF7\u5C3D\u5FEB\u4F7F\u7528\u7FA4\u62FC\u56E2\uFF01\u6BCF\u6708\u591A\u8D5A30%\uFF5E"]
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLHFDQUF1QztBQUN2QyxvREFBa0Q7QUFFbEQsS0FBSyxDQUFDLElBQUksQ0FBQztJQUNQLEdBQUcsRUFBRSxPQUFPLENBQUMsR0FBRyxDQUFDLEtBQUs7Q0FDekIsQ0FBQyxDQUFDO0FBRUgsSUFBTSxFQUFFLEdBQWdCLEtBQUssQ0FBQyxRQUFRLEVBQUcsQ0FBQztBQUMxQyxJQUFNLENBQUMsR0FBRyxFQUFFLENBQUMsT0FBTyxDQUFDO0FBUXJCLElBQU0sTUFBTSxHQUFHLFVBQUUsRUFBVTtJQUFWLG1CQUFBLEVBQUEsVUFBVTtJQUN2QixJQUFLLEVBQUUsRUFBRztRQUNOLE9BQU8sSUFBSSxDQUFDLEdBQUcsRUFBRyxDQUFDO0tBQ3RCO0lBQ0QsSUFBTSxNQUFNLEdBQUcsSUFBSSxJQUFJLENBQUUsSUFBSSxJQUFJLEVBQUcsQ0FBQyxjQUFjLEVBQUcsQ0FBQyxDQUFDO0lBQ3hELE9BQU8sSUFBSSxJQUFJLENBQUUsTUFBTSxDQUFDLE9BQU8sRUFBRyxHQUFHLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLElBQUksQ0FBRSxDQUFBO0FBQzdELENBQUMsQ0FBQTtBQUVELElBQU0sY0FBYyxHQUFHLFVBQUUsR0FBUyxFQUFFLEtBQWM7SUFBZCxzQkFBQSxFQUFBLFNBQVUsRUFBRSxDQUFFO0lBQzlDLE9BQU8sS0FBSyxDQUFDLElBQUksQ0FBRSxVQUFBLENBQUM7UUFDaEIsSUFBTSxDQUFDLEdBQUcsR0FBRyxDQUFDLFFBQVEsRUFBRyxDQUFDO1FBQzFCLE9BQU8sQ0FBQyxLQUFLLENBQUMsSUFBSSxHQUFHLENBQUMsVUFBVSxFQUFHLEtBQUssQ0FBQyxDQUFDO0lBQzlDLENBQUMsQ0FBQyxDQUFDO0FBQ1AsQ0FBQyxDQUFBO0FBTVksUUFBQSxXQUFX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c2RrJztcbmltcG9ydCB7IHN1YnNjcmliZVB1c2ggfSBmcm9tICcuLi9zdWJzY3JpYmUtcHVzaCc7XG5cbmNsb3VkLmluaXQoe1xuICAgIGVudjogcHJvY2Vzcy5lbnYuY2xvdWRcbn0pO1xuXG5jb25zdCBkYjogREIuRGF0YWJhc2UgPSBjbG91ZC5kYXRhYmFzZSggKTtcbmNvbnN0IF8gPSBkYi5jb21tYW5kO1xuXG4vKiogXG4gKiDovazmjaLmoLzmnpflsLzmsrvml7bljLogKzjml7bljLpcbiAqIERhdGUoKS5ub3coKSAvIG5ldyBEYXRlKCkuZ2V0VGltZSgpIOaYr+aXtuS4jeaXtuato+W4uOeahCs4XG4gKiBEYXRlLnRvTG9jYWxTdHJpbmcoICkg5aW95YOP5piv5LiA55u05pivKzDnmoRcbiAqIOWFiOaLv+WIsCArMO+8jOeEtuWQjis4XG4gKi9cbmNvbnN0IGdldE5vdyA9ICggdHMgPSBmYWxzZSApOiBhbnkgPT4ge1xuICAgIGlmICggdHMgKSB7XG4gICAgICAgIHJldHVybiBEYXRlLm5vdyggKTtcbiAgICB9XG4gICAgY29uc3QgdGltZV8wID0gbmV3IERhdGUoIG5ldyBEYXRlKCApLnRvTG9jYWxlU3RyaW5nKCApKTtcbiAgICByZXR1cm4gbmV3IERhdGUoIHRpbWVfMC5nZXRUaW1lKCApICsgOCAqIDYwICogNjAgKiAxMDAwIClcbn1cblxuY29uc3QgY2hlY2tJc0luUmFuZ2UgPSAoIG5vdzogRGF0ZSwgcmFuZ2UgPSBbIDk5IF0pID0+IHtcbiAgICByZXR1cm4gcmFuZ2Uuc29tZSggeCA9PiB7XG4gICAgICAgIGNvbnN0IGggPSBub3cuZ2V0SG91cnMoICk7XG4gICAgICAgIHJldHVybiB4ID09PSBoICYmIG5vdy5nZXRNaW51dGVzKCApID09PSAwO1xuICAgIH0pO1xufVxuXG4vKipcbiAqIOi/kOiQpeaVsOaNruWIhuS6q++8muS4iuS4gOS4qui/kOiQpea0u+WKqOeahOaVsOaNrlxuICog5pe26Ze077ya5pep5LiKOeeCuVxuICovXG5leHBvcnQgY29uc3QgbGFzdERheURhdGEgPSBhc3luYyAoICkgPT4ge1xuICAgIHRyeSB7XG5cbiAgICAgICAgaWYgKCAhY2hlY2tJc0luUmFuZ2UoIGdldE5vdyggKSwgWyA5IF0pKSB7XG4gICAgICAgICAgICByZXR1cm4geyBzdGF0dXM6IDIwMCB9O1xuICAgICAgICB9XG5cbiAgICAgICAgLy8g5om+5Yiw5pio5pma5LiL5Y2INueCueWQjueahOaXtumXtOaIs1xuICAgICAgICBjb25zdCBub3dUaW1lID0gZ2V0Tm93KCApO1xuICAgICAgICBjb25zdCB5ID0gbm93VGltZS5nZXRGdWxsWWVhciggKTtcbiAgICAgICAgY29uc3QgbSA9IG5vd1RpbWUuZ2V0TW9udGgoICkgKyAxO1xuICAgICAgICBjb25zdCBkID0gbm93VGltZS5nZXREYXRlKCApO1xuICAgICAgICBjb25zdCBsYXN0TmlnaHRUaW1lID0gbmV3IERhdGUoYCR7eX0vJHttfS8ke2R9IDAwOjAwOjAwYCk7XG4gICAgICAgIGNvbnN0IHRpbWUgPSBsYXN0TmlnaHRUaW1lLmdldFRpbWUoICkgLSA2ICogNjAgKiA2MCAqIDEwMDA7XG5cbiAgICAgICAgLy8g5oqK6L+Z5Liq5pe26Ze054K55Lul5ZCO55qE5p+l55yL5ZWG5ZOB6K6w5b2V6YO95ou/5Ye65p2lXG4gICAgICAgIGNvbnN0IHZpc2l0b3JSZWNvcmRzJCA9IGF3YWl0IGRiLmNvbGxlY3Rpb24oJ2dvb2QtdmlzaXRpbmctcmVjb3JkJylcbiAgICAgICAgICAgIC53aGVyZSh7XG4gICAgICAgICAgICAgICAgdmlzaXRUaW1lOiBfLmd0ZSggdGltZSApXG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLmZpZWxkKHtcbiAgICAgICAgICAgICAgICBwaWQ6IHRydWUsXG4gICAgICAgICAgICAgICAgb3BlbmlkOiB0cnVlXG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLmdldCggKTtcbiAgICAgICAgY29uc3QgdmlzaXRvclJlY29yZHMgPSB2aXNpdG9yUmVjb3JkcyQuZGF0YTtcblxuICAgICAgICAvLyDmi7/liLDmtY/op4jorrDlvZXmnIDpq5jnmoTllYblk4FcbiAgICAgICAgbGV0IG1heFBpZCA9ICcnO1xuICAgICAgICBsZXQgbWF4TnVtID0gMDtcblxuICAgICAgICBsZXQgcGlkQXJyOiBzdHJpbmdbIF0gPSBbIF07XG4gICAgICAgIGxldCBvcGVuaWRBcnI6IHN0cmluZ1sgXSA9IFsgXTtcblxuICAgICAgICB2aXNpdG9yUmVjb3Jkcy5yZWR1Y2UoKCByZXMsIHJlY29yZCApID0+IHtcblxuICAgICAgICAgICAgcGlkQXJyLnB1c2goIHJlY29yZC5waWQgKTtcbiAgICAgICAgICAgIG9wZW5pZEFyci5wdXNoKCByZWNvcmQub3BlbmlkICk7XG5cbiAgICAgICAgICAgIHJlc1sgcmVjb3JkLnBpZCBdID0gIXJlc1sgcmVjb3JkLnBpZCBdID8gMSA6IHJlc1sgcmVjb3JkLnBpZCBdICsgMTtcbiAgICAgICAgICAgIGlmICggcmVzWyByZWNvcmQucGlkIF0gPiBtYXhOdW0gKSB7XG4gICAgICAgICAgICAgICAgbWF4UGlkID0gcmVjb3JkLnBpZDtcbiAgICAgICAgICAgICAgICBtYXhOdW0gPSByZXNbIHJlY29yZC5waWQgXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiByZXM7XG4gICAgICAgIH0sIHsgfSk7XG5cbiAgICAgICAgLyoqIOiiq+a1gemHj+mHjyAqL1xuICAgICAgICBjb25zdCB0b3RhbFBpZHMgPSBBcnJheS5mcm9tKFxuICAgICAgICAgICAgbmV3IFNldCggcGlkQXJyIClcbiAgICAgICAgKS5sZW5ndGg7XG5cbiAgICAgICAgLyoqIOeUqOaIt+iuv+mXrumHjyAqL1xuICAgICAgICBjb25zdCB0b3RhbE9wZW5pZHMgPSBBcnJheS5mcm9tKFxuICAgICAgICAgICAgbmV3IFNldCggb3BlbmlkQXJyIClcbiAgICAgICAgKS5sZW5ndGg7XG5cbiAgICAgICAgLy8g6Iul5pyJ77yM6I635Y+W6L+Z5Liq5ZWG5ZOB55qE5oC75ou85Zui5Lq65pWwXG4gICAgICAgIGlmICggIW1heE51bSB8fCAhbWF4UGlkICkge1xuICAgICAgICAgICAgcmV0dXJuICB7IHN0YXR1czogMjAwIH1cbiAgICAgICAgfTtcblxuICAgICAgICAvLyDpgLvovpHvvJrpgJrov4dvcmRlcueahGNyZWF0ZXRpbWXmib7liLB0aWTvvIwg6YCa6L+HIHRpZCsgcGlkIOaJvuWIsHNob3BwaW5nbGlzdFxuICAgICAgICBjb25zdCBvcmRlciQgPSBhd2FpdCBkYi5jb2xsZWN0aW9uKCdvcmRlcicpXG4gICAgICAgICAgICAud2hlcmUoe1xuICAgICAgICAgICAgICAgIGNyZWF0ZVRpbWU6IF8uZ3RlKCB0aW1lIClcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAuZmllbGQoe1xuICAgICAgICAgICAgICAgIHRpZDogdHJ1ZVxuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC5saW1pdCggMSApXG4gICAgICAgICAgICAuZ2V0KCApO1xuICAgICAgICBjb25zdCBvcmRlciA9IG9yZGVyJC5kYXRhWyAwIF07XG5cbiAgICAgICAgLy8g6I635Y+W5omA5pyJ566h55CG5ZGYXG4gICAgICAgIGNvbnN0IGFkbXMkID0gYXdhaXQgZGIuY29sbGVjdGlvbignbWFuYWdlci1tZW1iZXInKVxuICAgICAgICAgICAgLndoZXJlKHsgfSlcbiAgICAgICAgICAgIC5nZXQoICk7XG5cbiAgICAgICAgLy8g5aaC5p6c5rKh5pyJ6K6i5Y2V77yM5YiZ5Y+R6YCB55qE6YOo5YiG5pWw5o2uXG4gICAgICAgIGlmICggb3JkZXIkLmRhdGEubGVuZ3RoID09PSAwICkge1xuICAgICAgICAgICAgLy8g5o6o6YCBXG4gICAgICAgICAgICBhd2FpdCBQcm9taXNlLmFsbChcbiAgICAgICAgICAgICAgICBhZG1zJC5kYXRhLm1hcCggYXN5bmMgYWRtID0+IHtcbiAgICAgICAgICAgICAgICAgICAgYXdhaXQgc3Vic2NyaWJlUHVzaCh7XG4gICAgICAgICAgICAgICAgICAgICAgICBvcGVuaWQ6IGFkbS5vcGVuaWQsXG4gICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiAnd2FpdFBpbicsXG4gICAgICAgICAgICAgICAgICAgICAgICBwYWdlOiBgcGFnZXMvZ3JvdW5kLXBpbi9pbmRleGAsXG4gICAgICAgICAgICAgICAgICAgICAgICB0ZXh0czogW2DmmKjlpKkke3RvdGFsUGlkc33mrL7llYblk4Hooqske3RvdGFsT3Blbmlkc33kurrlm7Top4LkuoYkeyB0b3RhbFBpZHMgKiB0b3RhbE9wZW5pZHMgKiAyIH3mrKFgLCBg6K+35bC95b+r5L2/55So576k5ou85Zui77yB5q+P5pyI5aSa6LWaMzAl772eYF1cbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgKTtcblxuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBzdGF0dXM6IDIwMFxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgY29uc3Qgc2wkID0gYXdhaXQgZGIuY29sbGVjdGlvbignc2hvcHBpbmctbGlzdCcpXG4gICAgICAgICAgICAud2hlcmUoe1xuICAgICAgICAgICAgICAgIHBpZDogbWF4UGlkLFxuICAgICAgICAgICAgICAgIHRpZDogb3JkZXIudGlkXG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLmZpZWxkKHtcbiAgICAgICAgICAgICAgICB1aWRzOiB0cnVlXG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLmdldCggKTtcbiAgICAgICAgY29uc3Qgc2wgPSBzbCQuZGF0YVsgMCBdO1xuXG4gICAgICAgIGlmICggc2wkLmRhdGEubGVuZ3RoID09PSAwICkge1xuICAgICAgICAgICAgcmV0dXJuICB7IHN0YXR1czogMjAwIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC8vIOiOt+WPluWVhuWTgeivpuaDhVxuICAgICAgICBjb25zdCBnb29kJCA9IGF3YWl0IGRiLmNvbGxlY3Rpb24oJ2dvb2RzJylcbiAgICAgICAgICAgIC5kb2MoIFN0cmluZyggbWF4UGlkICkpXG4gICAgICAgICAgICAuZmllbGQoe1xuICAgICAgICAgICAgICAgIHRpdGxlOiB0cnVlXG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLmdldCggKTtcblxuICAgICAgICAvLyDmjqjpgIFcbiAgICAgICAgYXdhaXQgUHJvbWlzZS5hbGwoXG4gICAgICAgICAgICBhZG1zJC5kYXRhLm1hcCggYXN5bmMgYWRtID0+IHtcbiAgICAgICAgICAgICAgICBhd2FpdCBzdWJzY3JpYmVQdXNoKHtcbiAgICAgICAgICAgICAgICAgICAgb3BlbmlkOiBhZG0ub3BlbmlkLFxuICAgICAgICAgICAgICAgICAgICB0eXBlOiAnd2FpdFBpbicsXG4gICAgICAgICAgICAgICAgICAgIHBhZ2U6IGBwYWdlcy9tYW5hZ2VyLXRyaXAtb3JkZXIvaW5kZXg/aWQ9JHtvcmRlci50aWR9YCxcbiAgICAgICAgICAgICAgICAgICAgdGV4dHM6IFtg5pio5aSp5pyJJHttYXhOdW195Lq65rWP6KeI77yMJHtzbC51aWRzLmxlbmd0aH3kurrmiJDlip8ke3NsLnVpZHMubGVuZ3RoID4gMSA/ICfmi7zlm6LvvIEnIDogJ+S4i+WNle+8gSd9YCwgYCR7Z29vZCQuZGF0YS50aXRsZX1gXVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSlcbiAgICAgICAgKTtcblxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgc3RhdHVzOiAyMDBcbiAgICAgICAgfVxuXG4gICAgfSBjYXRjaCAoIGUgKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKCchISEhISFsYXN0RGF5RGF0YScpXG4gICAgICAgIHJldHVybiB7IHN0YXR1czogNTAwIH07XG4gICAgfVxufTsiXX0=