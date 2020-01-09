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
                if (!checkIsInRange(getNow(), [10])) {
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
                                case 0: return [4, cloud.callFunction({
                                        name: 'common',
                                        data: {
                                            $url: 'push-subscribe-cloud',
                                            data: {
                                                openid: adm.openid,
                                                type: 'waitPin',
                                                page: "pages/ground-pin/index",
                                                texts: ["\u6628\u5929" + totalPids_1 + "\u6B3E\u5546\u54C1\u88AB" + totalOpenids_1 + "\u4EBA\u56F4\u89C2\u4E86" + totalPids_1 * totalOpenids_1 * 2 + "\u6B21", "\u6682\u65E0\u8BA2\u5355\uFF0C\u8BF7\u5C3D\u5FEB\u53D1\u8D77\u7FA4\u62FC\u56E2\uFF5E"]
                                            }
                                        }
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
                                            $url: 'push-subscribe-cloud',
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLHFDQUF1QztBQUV2QyxLQUFLLENBQUMsSUFBSSxDQUFDO0lBQ1AsR0FBRyxFQUFFLE9BQU8sQ0FBQyxHQUFHLENBQUMsS0FBSztDQUN6QixDQUFDLENBQUM7QUFFSCxJQUFNLEVBQUUsR0FBZ0IsS0FBSyxDQUFDLFFBQVEsRUFBRyxDQUFDO0FBQzFDLElBQU0sQ0FBQyxHQUFHLEVBQUUsQ0FBQyxPQUFPLENBQUM7QUFRckIsSUFBTSxNQUFNLEdBQUcsVUFBRSxFQUFVO0lBQVYsbUJBQUEsRUFBQSxVQUFVO0lBQ3ZCLElBQUssRUFBRSxFQUFHO1FBQ04sT0FBTyxJQUFJLENBQUMsR0FBRyxFQUFHLENBQUM7S0FDdEI7SUFDRCxJQUFNLE1BQU0sR0FBRyxJQUFJLElBQUksQ0FBRSxJQUFJLElBQUksRUFBRyxDQUFDLGNBQWMsRUFBRyxDQUFDLENBQUM7SUFDeEQsT0FBTyxJQUFJLElBQUksQ0FBRSxNQUFNLENBQUMsT0FBTyxFQUFHLEdBQUcsQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsSUFBSSxDQUFFLENBQUE7QUFDN0QsQ0FBQyxDQUFBO0FBRUQsSUFBTSxjQUFjLEdBQUcsVUFBRSxHQUFTLEVBQUUsS0FBYztJQUFkLHNCQUFBLEVBQUEsU0FBVSxFQUFFLENBQUU7SUFDOUMsT0FBTyxLQUFLLENBQUMsSUFBSSxDQUFFLFVBQUEsQ0FBQztRQUNoQixJQUFNLENBQUMsR0FBRyxHQUFHLENBQUMsUUFBUSxFQUFHLENBQUM7UUFDMUIsT0FBTyxDQUFDLEtBQUssQ0FBQyxJQUFJLEdBQUcsQ0FBQyxVQUFVLEVBQUcsS0FBSyxDQUFDLENBQUM7SUFDOUMsQ0FBQyxDQUFDLENBQUM7QUFDUCxDQUFDLENBQUE7QUFNWSxRQUFBLFdBQVcsR0FBRzs7Ozs7O2dC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Z0JDLENBQUM7Z0JBRUYsV0FBTzt3QkFDSCxNQUFNLEVBQUUsR0FBRztxQkFDZCxFQUFBOzs7Z0JBR0QsT0FBTyxDQUFDLEdBQUcsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFBO2dCQUNoQyxXQUFPLEVBQUUsTUFBTSxFQUFFLEdBQUcsRUFBRSxFQUFDOzs7O0tBRTlCLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBjbG91ZCBmcm9tICd3eC1zZXJ2ZXItc2RrJztcblxuY2xvdWQuaW5pdCh7XG4gICAgZW52OiBwcm9jZXNzLmVudi5jbG91ZFxufSk7XG5cbmNvbnN0IGRiOiBEQi5EYXRhYmFzZSA9IGNsb3VkLmRhdGFiYXNlKCApO1xuY29uc3QgXyA9IGRiLmNvbW1hbmQ7XG5cbi8qKiBcbiAqIOi9rOaNouagvOael+WwvOayu+aXtuWMuiArOOaXtuWMulxuICogRGF0ZSgpLm5vdygpIC8gbmV3IERhdGUoKS5nZXRUaW1lKCkg5piv5pe25LiN5pe25q2j5bi455qEKzhcbiAqIERhdGUudG9Mb2NhbFN0cmluZyggKSDlpb3lg4/mmK/kuIDnm7TmmK8rMOeahFxuICog5YWI5ou/5YiwICsw77yM54S25ZCOKzhcbiAqL1xuY29uc3QgZ2V0Tm93ID0gKCB0cyA9IGZhbHNlICk6IGFueSA9PiB7XG4gICAgaWYgKCB0cyApIHtcbiAgICAgICAgcmV0dXJuIERhdGUubm93KCApO1xuICAgIH1cbiAgICBjb25zdCB0aW1lXzAgPSBuZXcgRGF0ZSggbmV3IERhdGUoICkudG9Mb2NhbGVTdHJpbmcoICkpO1xuICAgIHJldHVybiBuZXcgRGF0ZSggdGltZV8wLmdldFRpbWUoICkgKyA4ICogNjAgKiA2MCAqIDEwMDAgKVxufVxuXG5jb25zdCBjaGVja0lzSW5SYW5nZSA9ICggbm93OiBEYXRlLCByYW5nZSA9IFsgOTkgXSkgPT4ge1xuICAgIHJldHVybiByYW5nZS5zb21lKCB4ID0+IHtcbiAgICAgICAgY29uc3QgaCA9IG5vdy5nZXRIb3VycyggKTtcbiAgICAgICAgcmV0dXJuIHggPT09IGggJiYgbm93LmdldE1pbnV0ZXMoICkgPT09IDA7XG4gICAgfSk7XG59XG5cbi8qKlxuICog6L+Q6JCl5pWw5o2u5YiG5Lqr77ya5LiK5LiA5Liq6L+Q6JCl5rS75Yqo55qE5pWw5o2uXG4gKiDml7bpl7TvvJrml6nkuIo554K5XG4gKi9cbmV4cG9ydCBjb25zdCBsYXN0RGF5RGF0YSA9IGFzeW5jICggKSA9PiB7XG4gICAgdHJ5IHtcblxuICAgICAgICBpZiAoICFjaGVja0lzSW5SYW5nZSggZ2V0Tm93KCApLCBbIDEwIF0pKSB7XG4gICAgICAgICAgICByZXR1cm4geyBzdGF0dXM6IDIwMCB9O1xuICAgICAgICB9XG5cbiAgICAgICAgLy8g5om+5Yiw5pio5pma5LiL5Y2INueCueWQjueahOaXtumXtOaIs1xuICAgICAgICBjb25zdCBub3dUaW1lID0gZ2V0Tm93KCApO1xuICAgICAgICBjb25zdCB5ID0gbm93VGltZS5nZXRGdWxsWWVhciggKTtcbiAgICAgICAgY29uc3QgbSA9IG5vd1RpbWUuZ2V0TW9udGgoICkgKyAxO1xuICAgICAgICBjb25zdCBkID0gbm93VGltZS5nZXREYXRlKCApO1xuICAgICAgICBjb25zdCBsYXN0TmlnaHRUaW1lID0gbmV3IERhdGUoYCR7eX0vJHttfS8ke2R9IDAwOjAwOjAwYCk7XG4gICAgICAgIGNvbnN0IHRpbWUgPSBsYXN0TmlnaHRUaW1lLmdldFRpbWUoICkgLSA2ICogNjAgKiA2MCAqIDEwMDA7XG5cbiAgICAgICAgLy8g5oqK6L+Z5Liq5pe26Ze054K55Lul5ZCO55qE5p+l55yL5ZWG5ZOB6K6w5b2V6YO95ou/5Ye65p2lXG4gICAgICAgIGNvbnN0IHZpc2l0b3JSZWNvcmRzJCA9IGF3YWl0IGRiLmNvbGxlY3Rpb24oJ2dvb2QtdmlzaXRpbmctcmVjb3JkJylcbiAgICAgICAgICAgIC53aGVyZSh7XG4gICAgICAgICAgICAgICAgdmlzaXRUaW1lOiBfLmd0ZSggdGltZSApXG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLmZpZWxkKHtcbiAgICAgICAgICAgICAgICBwaWQ6IHRydWUsXG4gICAgICAgICAgICAgICAgb3BlbmlkOiB0cnVlXG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLmdldCggKTtcbiAgICAgICAgY29uc3QgdmlzaXRvclJlY29yZHMgPSB2aXNpdG9yUmVjb3JkcyQuZGF0YTtcblxuICAgICAgICAvLyDmi7/liLDmtY/op4jorrDlvZXmnIDpq5jnmoTllYblk4FcbiAgICAgICAgbGV0IG1heFBpZCA9ICcnO1xuICAgICAgICBsZXQgbWF4TnVtID0gMDtcblxuICAgICAgICBsZXQgcGlkQXJyOiBzdHJpbmdbIF0gPSBbIF07XG4gICAgICAgIGxldCBvcGVuaWRBcnI6IHN0cmluZ1sgXSA9IFsgXTtcblxuICAgICAgICB2aXNpdG9yUmVjb3Jkcy5yZWR1Y2UoKCByZXMsIHJlY29yZCApID0+IHtcblxuICAgICAgICAgICAgcGlkQXJyLnB1c2goIHJlY29yZC5waWQgKTtcbiAgICAgICAgICAgIG9wZW5pZEFyci5wdXNoKCByZWNvcmQub3BlbmlkICk7XG5cbiAgICAgICAgICAgIHJlc1sgcmVjb3JkLnBpZCBdID0gIXJlc1sgcmVjb3JkLnBpZCBdID8gMSA6IHJlc1sgcmVjb3JkLnBpZCBdICsgMTtcbiAgICAgICAgICAgIGlmICggcmVzWyByZWNvcmQucGlkIF0gPiBtYXhOdW0gKSB7XG4gICAgICAgICAgICAgICAgbWF4UGlkID0gcmVjb3JkLnBpZDtcbiAgICAgICAgICAgICAgICBtYXhOdW0gPSByZXNbIHJlY29yZC5waWQgXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiByZXM7XG4gICAgICAgIH0sIHsgfSk7XG5cbiAgICAgICAgLyoqIOiiq+a1gemHj+mHjyAqL1xuICAgICAgICBjb25zdCB0b3RhbFBpZHMgPSBBcnJheS5mcm9tKFxuICAgICAgICAgICAgbmV3IFNldCggcGlkQXJyIClcbiAgICAgICAgKS5sZW5ndGg7XG5cbiAgICAgICAgLyoqIOeUqOaIt+iuv+mXrumHjyAqL1xuICAgICAgICBjb25zdCB0b3RhbE9wZW5pZHMgPSBBcnJheS5mcm9tKFxuICAgICAgICAgICAgbmV3IFNldCggb3BlbmlkQXJyIClcbiAgICAgICAgKS5sZW5ndGg7XG5cbiAgICAgICAgLy8g6Iul5pyJ77yM6I635Y+W6L+Z5Liq5ZWG5ZOB55qE5oC75ou85Zui5Lq65pWwXG4gICAgICAgIGlmICggIW1heE51bSB8fCAhbWF4UGlkICkge1xuICAgICAgICAgICAgcmV0dXJuICB7IHN0YXR1czogMjAwIH1cbiAgICAgICAgfTtcblxuICAgICAgICAvLyDpgLvovpHvvJrpgJrov4dvcmRlcueahGNyZWF0ZXRpbWXmib7liLB0aWTvvIwg6YCa6L+HIHRpZCsgcGlkIOaJvuWIsHNob3BwaW5nbGlzdFxuICAgICAgICBjb25zdCBvcmRlciQgPSBhd2FpdCBkYi5jb2xsZWN0aW9uKCdvcmRlcicpXG4gICAgICAgICAgICAud2hlcmUoe1xuICAgICAgICAgICAgICAgIGNyZWF0ZVRpbWU6IF8uZ3RlKCB0aW1lIClcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAuZmllbGQoe1xuICAgICAgICAgICAgICAgIHRpZDogdHJ1ZVxuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC5saW1pdCggMSApXG4gICAgICAgICAgICAuZ2V0KCApO1xuICAgICAgICBjb25zdCBvcmRlciA9IG9yZGVyJC5kYXRhWyAwIF07XG5cbiAgICAgICAgLy8g6I635Y+W5omA5pyJ566h55CG5ZGYXG4gICAgICAgIGNvbnN0IGFkbXMkID0gYXdhaXQgZGIuY29sbGVjdGlvbignbWFuYWdlci1tZW1iZXInKVxuICAgICAgICAgICAgLndoZXJlKHsgfSlcbiAgICAgICAgICAgIC5nZXQoICk7XG5cbiAgICAgICAgLy8g5aaC5p6c5rKh5pyJ6K6i5Y2V77yM5YiZ5Y+R6YCB55qE6YOo5YiG5pWw5o2uXG4gICAgICAgIGlmICggb3JkZXIkLmRhdGEubGVuZ3RoID09PSAwICkge1xuICAgICAgICAgICAgLy8g5o6o6YCBXG4gICAgICAgICAgICBhd2FpdCBQcm9taXNlLmFsbChcbiAgICAgICAgICAgICAgICBhZG1zJC5kYXRhLm1hcCggYXN5bmMgYWRtID0+IHtcbiAgICAgICAgICAgICAgICAgICAgYXdhaXQgY2xvdWQuY2FsbEZ1bmN0aW9uKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6ICdjb21tb24nLFxuICAgICAgICAgICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICR1cmw6ICdwdXNoLXN1YnNjcmliZS1jbG91ZCcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvcGVuaWQ6IGFkbS5vcGVuaWQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6ICd3YWl0UGluJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGFnZTogYHBhZ2VzL2dyb3VuZC1waW4vaW5kZXhgLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZXh0czogW2DmmKjlpKkke3RvdGFsUGlkc33mrL7llYblk4Hooqske3RvdGFsT3Blbmlkc33kurrlm7Top4LkuoYkeyB0b3RhbFBpZHMgKiB0b3RhbE9wZW5pZHMgKiAyIH3mrKFgLCBg5pqC5peg6K6i5Y2V77yM6K+35bC95b+r5Y+R6LW3576k5ou85Zui772eYF1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gXG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICk7XG5cbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgc3RhdHVzOiAyMDBcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IHNsJCA9IGF3YWl0IGRiLmNvbGxlY3Rpb24oJ3Nob3BwaW5nLWxpc3QnKVxuICAgICAgICAgICAgLndoZXJlKHtcbiAgICAgICAgICAgICAgICBwaWQ6IG1heFBpZCxcbiAgICAgICAgICAgICAgICB0aWQ6IG9yZGVyLnRpZFxuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC5maWVsZCh7XG4gICAgICAgICAgICAgICAgdWlkczogdHJ1ZVxuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC5nZXQoICk7XG4gICAgICAgIGNvbnN0IHNsID0gc2wkLmRhdGFbIDAgXTtcblxuICAgICAgICBpZiAoIHNsJC5kYXRhLmxlbmd0aCA9PT0gMCApIHtcbiAgICAgICAgICAgIHJldHVybiAgeyBzdGF0dXM6IDIwMCB9XG4gICAgICAgIH1cblxuICAgICAgICAvLyDojrflj5bllYblk4Hor6bmg4VcbiAgICAgICAgY29uc3QgZ29vZCQgPSBhd2FpdCBkYi5jb2xsZWN0aW9uKCdnb29kcycpXG4gICAgICAgICAgICAuZG9jKCBTdHJpbmcoIG1heFBpZCApKVxuICAgICAgICAgICAgLmZpZWxkKHtcbiAgICAgICAgICAgICAgICB0aXRsZTogdHJ1ZVxuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC5nZXQoICk7XG5cbiAgICAgICAgLy8g5o6o6YCBXG4gICAgICAgIGF3YWl0IFByb21pc2UuYWxsKFxuICAgICAgICAgICAgYWRtcyQuZGF0YS5tYXAoIGFzeW5jIGFkbSA9PiB7XG4gICAgICAgICAgICAgICAgYXdhaXQgY2xvdWQuY2FsbEZ1bmN0aW9uKHtcbiAgICAgICAgICAgICAgICAgICAgbmFtZTogJ2NvbW1vbicsXG4gICAgICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICR1cmw6ICdwdXNoLXN1YnNjcmliZS1jbG91ZCcsXG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb3BlbmlkOiBhZG0ub3BlbmlkLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6ICd3YWl0UGluJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYWdlOiBgcGFnZXMvbWFuYWdlci10cmlwLW9yZGVyL2luZGV4P2lkPSR7b3JkZXIudGlkfWAsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGV4dHM6IFtg5pio5aSp5pyJJHttYXhOdW195Lq65rWP6KeI77yMJHtzbC51aWRzLmxlbmd0aH3kurrmiJDlip8ke3NsLnVpZHMubGVuZ3RoID4gMSA/ICfmi7zlm6LvvIEnIDogJ+S4i+WNle+8gSd9YCwgYCR7Z29vZCQuZGF0YS50aXRsZX1gXVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFxuICAgICAgICAgICAgfSlcbiAgICAgICAgKTtcblxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgc3RhdHVzOiAyMDBcbiAgICAgICAgfVxuXG4gICAgfSBjYXRjaCAoIGUgKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKCchISEhISFsYXN0RGF5RGF0YScpXG4gICAgICAgIHJldHVybiB7IHN0YXR1czogNTAwIH07XG4gICAgfVxufTsiXX0=