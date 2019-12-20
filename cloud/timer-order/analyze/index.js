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
exports.lastDayData = function () { return __awaiter(_this, void 0, void 0, function () {
    var nowTime, y, m, d, lastNightTime, time, visitorRecords$, visitorRecords, maxPid_1, maxNum_1, order$, order_1, sl$, sl_1, adms$, good$_1, e_1;
    var _this = this;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 7, , 8]);
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
                        pid: true
                    })
                        .get()];
            case 1:
                visitorRecords$ = _a.sent();
                visitorRecords = visitorRecords$.data;
                maxPid_1 = '';
                maxNum_1 = 0;
                visitorRecords.reduce(function (res, record) {
                    res[record.pid] = !res[record.pid] ? 1 : res[record.pid] + 1;
                    if (res[record.pid] > maxNum_1) {
                        maxPid_1 = record.pid;
                        maxNum_1 = res[record.pid];
                    }
                    return res;
                }, {});
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
                if (order$.data.length === 0) {
                    return [2, { status: 200 }];
                }
                return [4, db.collection('shopping-list')
                        .where({
                        pid: maxPid_1,
                        tid: order_1.tid
                    })
                        .field({
                        uids: true
                    })
                        .get()];
            case 3:
                sl$ = _a.sent();
                sl_1 = sl$.data[0];
                if (sl$.data.length === 0) {
                    return [2, { status: 200 }];
                }
                return [4, db.collection('manager-member')
                        .where({})
                        .get()];
            case 4:
                adms$ = _a.sent();
                return [4, db.collection('goods')
                        .doc(String(maxPid_1))
                        .field({
                        title: true
                    })
                        .get()];
            case 5:
                good$_1 = _a.sent();
                return [4, Promise.all(adms$.data.map(function (adm) { return __awaiter(_this, void 0, void 0, function () {
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
            case 6:
                _a.sent();
                return [2, {
                        status: 200
                    }];
            case 7:
                e_1 = _a.sent();
                console.log('!!!!!!lastDayData');
                return [2, { status: 500 }];
            case 8: return [2];
        }
    });
}); };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSxpQkFvSkU7O0FBcEpGLHFDQUF1QztBQUV2QyxLQUFLLENBQUMsSUFBSSxDQUFDO0lBQ1AsR0FBRyxFQUFFLE9BQU8sQ0FBQyxHQUFHLENBQUMsS0FBSztDQUN6QixDQUFDLENBQUM7QUFFSCxJQUFNLEVBQUUsR0FBZ0IsS0FBSyxDQUFDLFFBQVEsRUFBRyxDQUFDO0FBQzFDLElBQU0sQ0FBQyxHQUFHLEVBQUUsQ0FBQyxPQUFPLENBQUM7QUFRckIsSUFBTSxNQUFNLEdBQUcsVUFBRSxFQUFVO0lBQVYsbUJBQUEsRUFBQSxVQUFVO0lBQ3ZCLElBQUssRUFBRSxFQUFHO1FBQ04sT0FBTyxJQUFJLENBQUMsR0FBRyxFQUFHLENBQUM7S0FDdEI7SUFDRCxJQUFNLE1BQU0sR0FBRyxJQUFJLElBQUksQ0FBRSxJQUFJLElBQUksRUFBRyxDQUFDLGNBQWMsRUFBRyxDQUFDLENBQUM7SUFDeEQsT0FBTyxJQUFJLElBQUksQ0FBRSxNQUFNLENBQUMsT0FBTyxFQUFHLEdBQUcsQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsSUFBSSxDQUFFLENBQUE7QUFDN0QsQ0FBQyxDQUFBO0FBRUQsSUFBTSxjQUFjLEdBQUcsVUFBRSxHQUFTLEVBQUUsS0FBYztJQUFkLHNCQUFBLEVBQUEsU0FBVSxFQUFFLENBQUU7SUFDOUMsT0FBTyxLQUFLLENBQUMsSUFBSSxDQUFFLFVBQUEsQ0FBQztRQUNoQixJQUFNLENBQUMsR0FBRyxHQUFHLENBQUMsUUFBUSxFQUFHLENBQUM7UUFDMUIsT0FBTyxDQUFDLEtBQUssQ0FBQyxJQUFJLEdBQUcsQ0FBQyxVQUFVLEVBQUcsS0FBSyxDQUFDLENBQUM7SUFDOUMsQ0FBQyxDQUFDLENBQUM7QUFDUCxDQUFDLENBQUE7QUFNWSxRQUFBLFdBQVcs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QUcsT0FBSyxDQUFDLElBQUksQ0FBQyxLQUFPLENBQUM7NkNBQzlHO3lDQUNKO3FDQUNKLENBQUMsRUFBQTs7b0NBWEYsU0FXRSxDQUFDO29DQUNILFdBQU07Ozt5QkFDVCxDQUFDLENBQ0wsRUFBQTs7Z0JBaEJELFNBZ0JDLENBQUM7Z0JBRUYsV0FBTzt3QkFDSCxNQUFNLEVBQUUsR0FBRztxQkFDZCxFQUFBOzs7Z0JBR0QsT0FBTyxDQUFDLEdBQUcsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFBO2dCQUNoQyxXQUFPLEVBQUUsTUFBTSxFQUFFLEdBQUcsRUFBRSxFQUFDOzs7O0tBRTlCLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBjbG91ZCBmcm9tICd3eC1zZXJ2ZXItc2RrJztcblxuY2xvdWQuaW5pdCh7XG4gICAgZW52OiBwcm9jZXNzLmVudi5jbG91ZFxufSk7XG5cbmNvbnN0IGRiOiBEQi5EYXRhYmFzZSA9IGNsb3VkLmRhdGFiYXNlKCApO1xuY29uc3QgXyA9IGRiLmNvbW1hbmQ7XG5cbi8qKiBcbiAqIOi9rOaNouagvOael+WwvOayu+aXtuWMuiArOOaXtuWMulxuICogRGF0ZSgpLm5vdygpIC8gbmV3IERhdGUoKS5nZXRUaW1lKCkg5piv5pe25LiN5pe25q2j5bi455qEKzhcbiAqIERhdGUudG9Mb2NhbFN0cmluZyggKSDlpb3lg4/mmK/kuIDnm7TmmK8rMOeahFxuICog5YWI5ou/5YiwICsw77yM54S25ZCOKzhcbiAqL1xuY29uc3QgZ2V0Tm93ID0gKCB0cyA9IGZhbHNlICk6IGFueSA9PiB7XG4gICAgaWYgKCB0cyApIHtcbiAgICAgICAgcmV0dXJuIERhdGUubm93KCApO1xuICAgIH1cbiAgICBjb25zdCB0aW1lXzAgPSBuZXcgRGF0ZSggbmV3IERhdGUoICkudG9Mb2NhbGVTdHJpbmcoICkpO1xuICAgIHJldHVybiBuZXcgRGF0ZSggdGltZV8wLmdldFRpbWUoICkgKyA4ICogNjAgKiA2MCAqIDEwMDAgKVxufVxuXG5jb25zdCBjaGVja0lzSW5SYW5nZSA9ICggbm93OiBEYXRlLCByYW5nZSA9IFsgOTkgXSkgPT4ge1xuICAgIHJldHVybiByYW5nZS5zb21lKCB4ID0+IHtcbiAgICAgICAgY29uc3QgaCA9IG5vdy5nZXRIb3VycyggKTtcbiAgICAgICAgcmV0dXJuIHggPT09IGggJiYgbm93LmdldE1pbnV0ZXMoICkgPT09IDA7XG4gICAgfSk7XG59XG5cbi8qKlxuICog6L+Q6JCl5pWw5o2u5YiG5Lqr77ya5LiK5LiA5Liq6L+Q6JCl5rS75Yqo55qE5pWw5o2uXG4gKiDml7bpl7TvvJrml6nkuIoxMOeCuVxuICovXG5leHBvcnQgY29uc3QgbGFzdERheURhdGEgPSBhc3luYyAoICkgPT4ge1xuICAgIHRyeSB7XG5cbiAgICAgICAgaWYgKCAhY2hlY2tJc0luUmFuZ2UoIGdldE5vdyggKSwgWyAxMCBdKSkge1xuICAgICAgICAgICAgcmV0dXJuIHsgc3RhdHVzOiAyMDAgfTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIOaJvuWIsOaYqOaZmuS4i+WNiDbngrnlkI7nmoTml7bpl7TmiLNcbiAgICAgICAgY29uc3Qgbm93VGltZSA9IGdldE5vdyggKTtcbiAgICAgICAgY29uc3QgeSA9IG5vd1RpbWUuZ2V0RnVsbFllYXIoICk7XG4gICAgICAgIGNvbnN0IG0gPSBub3dUaW1lLmdldE1vbnRoKCApICsgMTtcbiAgICAgICAgY29uc3QgZCA9IG5vd1RpbWUuZ2V0RGF0ZSggKTtcbiAgICAgICAgY29uc3QgbGFzdE5pZ2h0VGltZSA9IG5ldyBEYXRlKGAke3l9LyR7bX0vJHtkfSAwMDowMDowMGApO1xuICAgICAgICBjb25zdCB0aW1lID0gbGFzdE5pZ2h0VGltZS5nZXRUaW1lKCApIC0gNiAqIDYwICogNjAgKiAxMDAwO1xuXG4gICAgICAgIC8vIOaKiui/meS4quaXtumXtOeCueS7peWQjueahOafpeeci+WVhuWTgeiusOW9lemDveaLv+WHuuadpVxuICAgICAgICBjb25zdCB2aXNpdG9yUmVjb3JkcyQgPSBhd2FpdCBkYi5jb2xsZWN0aW9uKCdnb29kLXZpc2l0aW5nLXJlY29yZCcpXG4gICAgICAgICAgICAud2hlcmUoe1xuICAgICAgICAgICAgICAgIHZpc2l0VGltZTogXy5ndGUoIHRpbWUgKVxuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC5maWVsZCh7XG4gICAgICAgICAgICAgICAgcGlkOiB0cnVlXG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLmdldCggKTtcbiAgICAgICAgY29uc3QgdmlzaXRvclJlY29yZHMgPSB2aXNpdG9yUmVjb3JkcyQuZGF0YTtcblxuICAgICAgICAvLyDmi7/liLDmtY/op4jorrDlvZXmnIDpq5jnmoTllYblk4FcbiAgICAgICAgbGV0IG1heFBpZCA9ICcnO1xuICAgICAgICBsZXQgbWF4TnVtID0gMDtcbiAgICAgICAgdmlzaXRvclJlY29yZHMucmVkdWNlKCggcmVzLCByZWNvcmQgKSA9PiB7XG4gICAgICAgICAgICByZXNbIHJlY29yZC5waWQgXSA9ICFyZXNbIHJlY29yZC5waWQgXSA/IDEgOiByZXNbIHJlY29yZC5waWQgXSArIDE7XG4gICAgICAgICAgICBpZiAoIHJlc1sgcmVjb3JkLnBpZCBdID4gbWF4TnVtICkge1xuICAgICAgICAgICAgICAgIG1heFBpZCA9IHJlY29yZC5waWQ7XG4gICAgICAgICAgICAgICAgbWF4TnVtID0gcmVzWyByZWNvcmQucGlkIF07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gcmVzO1xuICAgICAgICB9LCB7IH0pO1xuXG4gICAgICAgIC8vIOiLpeacie+8jOiOt+WPlui/meS4quWVhuWTgeeahOaAu+aLvOWbouS6uuaVsFxuICAgICAgICBpZiAoICFtYXhOdW0gfHwgIW1heFBpZCApIHtcbiAgICAgICAgICAgIHJldHVybiAgeyBzdGF0dXM6IDIwMCB9XG4gICAgICAgIH07XG5cbiAgICAgICAgLy8g6YC76L6R77ya6YCa6L+Hb3JkZXLnmoRjcmVhdGV0aW1l5om+5YiwdGlk77yMIOmAmui/hyB0aWQrIHBpZCDmib7liLBzaG9wcGluZ2xpc3RcbiAgICAgICAgY29uc3Qgb3JkZXIkID0gYXdhaXQgZGIuY29sbGVjdGlvbignb3JkZXInKVxuICAgICAgICAgICAgLndoZXJlKHtcbiAgICAgICAgICAgICAgICBjcmVhdGVUaW1lOiBfLmd0ZSggdGltZSApXG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLmZpZWxkKHtcbiAgICAgICAgICAgICAgICB0aWQ6IHRydWVcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAubGltaXQoIDEgKVxuICAgICAgICAgICAgLmdldCggKTtcbiAgICAgICAgY29uc3Qgb3JkZXIgPSBvcmRlciQuZGF0YVsgMCBdO1xuXG4gICAgICAgIGlmICggb3JkZXIkLmRhdGEubGVuZ3RoID09PSAwICkge1xuICAgICAgICAgICAgcmV0dXJuICB7IHN0YXR1czogMjAwIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IHNsJCA9IGF3YWl0IGRiLmNvbGxlY3Rpb24oJ3Nob3BwaW5nLWxpc3QnKVxuICAgICAgICAgICAgLndoZXJlKHtcbiAgICAgICAgICAgICAgICBwaWQ6IG1heFBpZCxcbiAgICAgICAgICAgICAgICB0aWQ6IG9yZGVyLnRpZFxuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC5maWVsZCh7XG4gICAgICAgICAgICAgICAgdWlkczogdHJ1ZVxuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC5nZXQoICk7XG4gICAgICAgIGNvbnN0IHNsID0gc2wkLmRhdGFbIDAgXTtcblxuICAgICAgICBpZiAoIHNsJC5kYXRhLmxlbmd0aCA9PT0gMCApIHtcbiAgICAgICAgICAgIHJldHVybiAgeyBzdGF0dXM6IDIwMCB9XG4gICAgICAgIH1cblxuICAgICAgICAvLyDojrflj5bmiYDmnInnrqHnkIblkZhcbiAgICAgICAgY29uc3QgYWRtcyQgPSBhd2FpdCBkYi5jb2xsZWN0aW9uKCdtYW5hZ2VyLW1lbWJlcicpXG4gICAgICAgICAgICAud2hlcmUoeyB9KVxuICAgICAgICAgICAgLmdldCggKTtcblxuICAgICAgICAvLyDojrflj5bllYblk4Hor6bmg4VcbiAgICAgICAgY29uc3QgZ29vZCQgPSBhd2FpdCBkYi5jb2xsZWN0aW9uKCdnb29kcycpXG4gICAgICAgICAgICAuZG9jKCBTdHJpbmcoIG1heFBpZCApKVxuICAgICAgICAgICAgLmZpZWxkKHtcbiAgICAgICAgICAgICAgICB0aXRsZTogdHJ1ZVxuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC5nZXQoICk7XG5cbiAgICAgICAgLy8g5o6o6YCBXG4gICAgICAgIGF3YWl0IFByb21pc2UuYWxsKFxuICAgICAgICAgICAgYWRtcyQuZGF0YS5tYXAoIGFzeW5jIGFkbSA9PiB7XG4gICAgICAgICAgICAgICAgYXdhaXQgY2xvdWQuY2FsbEZ1bmN0aW9uKHtcbiAgICAgICAgICAgICAgICAgICAgbmFtZTogJ2NvbW1vbicsXG4gICAgICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICR1cmw6ICdwdXNoLXN1YnNjcmliZS1jbG91ZCcsXG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb3BlbmlkOiBhZG0ub3BlbmlkLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6ICd3YWl0UGluJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYWdlOiBgcGFnZXMvbWFuYWdlci10cmlwLW9yZGVyL2luZGV4P2lkPSR7b3JkZXIudGlkfWAsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGV4dHM6IFtg5pio5aSp5pyJJHttYXhOdW195Lq65rWP6KeI77yMJHtzbC51aWRzLmxlbmd0aH3kurrmiJDlip8ke3NsLnVpZHMubGVuZ3RoID4gMSA/ICfmi7zlm6LvvIEnIDogJ+S4i+WNle+8gSd9YCwgYCR7Z29vZCQuZGF0YS50aXRsZX1gXVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFxuICAgICAgICAgICAgfSlcbiAgICAgICAgKTtcblxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgc3RhdHVzOiAyMDBcbiAgICAgICAgfVxuXG4gICAgfSBjYXRjaCAoIGUgKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKCchISEhISFsYXN0RGF5RGF0YScpXG4gICAgICAgIHJldHVybiB7IHN0YXR1czogNTAwIH07XG4gICAgfVxufTsiXX0=