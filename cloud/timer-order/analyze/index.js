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
    env: cloud.DYNAMIC_CURRENT_ENV
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
    var nowTime, y, m, d, lastNightTime, time, visitorRecords$, visitorRecords, maxPid_1, maxNum_1, order$, order_1, sl$, sl_1, adms$, good$_1, e_1;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLHFDQUF1QztBQUV2QyxLQUFLLENBQUMsSUFBSSxDQUFDO0lBQ1AsR0FBRyxFQUFFLEtBQUssQ0FBQyxtQkFBbUI7Q0FDakMsQ0FBQyxDQUFDO0FBRUgsSUFBTSxFQUFFLEdBQWdCLEtBQUssQ0FBQyxRQUFRLEVBQUcsQ0FBQztBQUMxQyxJQUFNLENBQUMsR0FBRyxFQUFFLENBQUMsT0FBTyxDQUFDO0FBUXJCLElBQU0sTUFBTSxHQUFHLFVBQUUsRUFBVTtJQUFWLG1CQUFBLEVBQUEsVUFBVTtJQUN2QixJQUFLLEVBQUUsRUFBRztRQUNOLE9BQU8sSUFBSSxDQUFDLEdBQUcsRUFBRyxDQUFDO0tBQ3RCO0lBQ0QsSUFBTSxNQUFNLEdBQUcsSUFBSSxJQUFJLENBQUUsSUFBSSxJQUFJLEVBQUcsQ0FBQyxjQUFjLEVBQUcsQ0FBQyxDQUFDO0lBQ3hELE9BQU8sSUFBSSxJQUFJLENBQUUsTUFBTSxDQUFDLE9BQU8sRUFBRyxHQUFHLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLElBQUksQ0FBRSxDQUFBO0FBQzdELENBQUMsQ0FBQTtBQUVELElBQU0sY0FBYyxHQUFHLFVBQUUsR0FBUyxFQUFFLEtBQWM7SUFBZCxzQkFBQSxFQUFBLFNBQVUsRUFBRSxDQUFFO0lBQzlDLE9BQU8sS0FBSyxDQUFDLElBQUksQ0FBRSxVQUFBLENBQUM7UUFDaEIsSUFBTSxDQUFDLEdBQUcsR0FBRyxDQUFDLFFBQVEsRUFBRyxDQUFDO1FBQzFCLE9BQU8sQ0FBQyxLQUFLLENBQUMsSUFBSSxHQUFHLENBQUMsVUFBVSxFQUFHLEtBQUssQ0FBQyxDQUFDO0lBQzlDLENBQUMsQ0FBQyxDQUFDO0FBQ1AsQ0FBQyxDQUFBO0FBTVksUUFBQSxXQUFXLEdBQUc7Ozs7OztnQkFHbkIsSUFB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QyxLQUFPLENBQUM7NkNBQzlHO3lDQUNKO3FDQUNKLENBQUMsRUFBQTs7b0NBWEYsU0FXRSxDQUFDO29DQUNILFdBQU07Ozt5QkFDVCxDQUFDLENBQ0wsRUFBQTs7Z0JBaEJELFNBZ0JDLENBQUM7Z0JBRUYsV0FBTzt3QkFDSCxNQUFNLEVBQUUsR0FBRztxQkFDZCxFQUFBOzs7Z0JBR0QsT0FBTyxDQUFDLEdBQUcsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFBO2dCQUNoQyxXQUFPLEVBQUUsTUFBTSxFQUFFLEdBQUcsRUFBRSxFQUFDOzs7O0tBRTlCLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBjbG91ZCBmcm9tICd3eC1zZXJ2ZXItc2RrJztcblxuY2xvdWQuaW5pdCh7XG4gICAgZW52OiBjbG91ZC5EWU5BTUlDX0NVUlJFTlRfRU5WXG59KTtcblxuY29uc3QgZGI6IERCLkRhdGFiYXNlID0gY2xvdWQuZGF0YWJhc2UoICk7XG5jb25zdCBfID0gZGIuY29tbWFuZDtcblxuLyoqIFxuICog6L2s5o2i5qC85p6X5bC85rK75pe25Yy6ICs45pe25Yy6XG4gKiBEYXRlKCkubm93KCkgLyBuZXcgRGF0ZSgpLmdldFRpbWUoKSDmmK/ml7bkuI3ml7bmraPluLjnmoQrOFxuICogRGF0ZS50b0xvY2FsU3RyaW5nKCApIOWlveWDj+aYr+S4gOebtOaYrysw55qEXG4gKiDlhYjmi7/liLAgKzDvvIznhLblkI4rOFxuICovXG5jb25zdCBnZXROb3cgPSAoIHRzID0gZmFsc2UgKTogYW55ID0+IHtcbiAgICBpZiAoIHRzICkge1xuICAgICAgICByZXR1cm4gRGF0ZS5ub3coICk7XG4gICAgfVxuICAgIGNvbnN0IHRpbWVfMCA9IG5ldyBEYXRlKCBuZXcgRGF0ZSggKS50b0xvY2FsZVN0cmluZyggKSk7XG4gICAgcmV0dXJuIG5ldyBEYXRlKCB0aW1lXzAuZ2V0VGltZSggKSArIDggKiA2MCAqIDYwICogMTAwMCApXG59XG5cbmNvbnN0IGNoZWNrSXNJblJhbmdlID0gKCBub3c6IERhdGUsIHJhbmdlID0gWyA5OSBdKSA9PiB7XG4gICAgcmV0dXJuIHJhbmdlLnNvbWUoIHggPT4ge1xuICAgICAgICBjb25zdCBoID0gbm93LmdldEhvdXJzKCApO1xuICAgICAgICByZXR1cm4geCA9PT0gaCAmJiBub3cuZ2V0TWludXRlcyggKSA9PT0gMDtcbiAgICB9KTtcbn1cblxuLyoqXG4gKiDov5DokKXmlbDmja7liIbkuqvvvJrkuIrkuIDkuKrov5DokKXmtLvliqjnmoTmlbDmja5cbiAqIOaXtumXtO+8muaXqeS4ijEw54K5XG4gKi9cbmV4cG9ydCBjb25zdCBsYXN0RGF5RGF0YSA9IGFzeW5jICggKSA9PiB7XG4gICAgdHJ5IHtcblxuICAgICAgICBpZiAoICFjaGVja0lzSW5SYW5nZSggZ2V0Tm93KCApLCBbIDEwIF0pKSB7XG4gICAgICAgICAgICByZXR1cm4geyBzdGF0dXM6IDIwMCB9O1xuICAgICAgICB9XG5cbiAgICAgICAgLy8g5om+5Yiw5pio5pma5LiL5Y2INueCueWQjueahOaXtumXtOaIs1xuICAgICAgICBjb25zdCBub3dUaW1lID0gZ2V0Tm93KCApO1xuICAgICAgICBjb25zdCB5ID0gbm93VGltZS5nZXRGdWxsWWVhciggKTtcbiAgICAgICAgY29uc3QgbSA9IG5vd1RpbWUuZ2V0TW9udGgoICkgKyAxO1xuICAgICAgICBjb25zdCBkID0gbm93VGltZS5nZXREYXRlKCApO1xuICAgICAgICBjb25zdCBsYXN0TmlnaHRUaW1lID0gbmV3IERhdGUoYCR7eX0vJHttfS8ke2R9IDAwOjAwOjAwYCk7XG4gICAgICAgIGNvbnN0IHRpbWUgPSBsYXN0TmlnaHRUaW1lLmdldFRpbWUoICkgLSA2ICogNjAgKiA2MCAqIDEwMDA7XG5cbiAgICAgICAgLy8g5oqK6L+Z5Liq5pe26Ze054K55Lul5ZCO55qE5p+l55yL5ZWG5ZOB6K6w5b2V6YO95ou/5Ye65p2lXG4gICAgICAgIGNvbnN0IHZpc2l0b3JSZWNvcmRzJCA9IGF3YWl0IGRiLmNvbGxlY3Rpb24oJ2dvb2QtdmlzaXRpbmctcmVjb3JkJylcbiAgICAgICAgICAgIC53aGVyZSh7XG4gICAgICAgICAgICAgICAgdmlzaXRUaW1lOiBfLmd0ZSggdGltZSApXG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLmZpZWxkKHtcbiAgICAgICAgICAgICAgICBwaWQ6IHRydWVcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAuZ2V0KCApO1xuICAgICAgICBjb25zdCB2aXNpdG9yUmVjb3JkcyA9IHZpc2l0b3JSZWNvcmRzJC5kYXRhO1xuXG4gICAgICAgIC8vIOaLv+WIsOa1j+iniOiusOW9leacgOmrmOeahOWVhuWTgVxuICAgICAgICBsZXQgbWF4UGlkID0gJyc7XG4gICAgICAgIGxldCBtYXhOdW0gPSAwO1xuICAgICAgICB2aXNpdG9yUmVjb3Jkcy5yZWR1Y2UoKCByZXMsIHJlY29yZCApID0+IHtcbiAgICAgICAgICAgIHJlc1sgcmVjb3JkLnBpZCBdID0gIXJlc1sgcmVjb3JkLnBpZCBdID8gMSA6IHJlc1sgcmVjb3JkLnBpZCBdICsgMTtcbiAgICAgICAgICAgIGlmICggcmVzWyByZWNvcmQucGlkIF0gPiBtYXhOdW0gKSB7XG4gICAgICAgICAgICAgICAgbWF4UGlkID0gcmVjb3JkLnBpZDtcbiAgICAgICAgICAgICAgICBtYXhOdW0gPSByZXNbIHJlY29yZC5waWQgXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiByZXM7XG4gICAgICAgIH0sIHsgfSk7XG5cbiAgICAgICAgLy8g6Iul5pyJ77yM6I635Y+W6L+Z5Liq5ZWG5ZOB55qE5oC75ou85Zui5Lq65pWwXG4gICAgICAgIGlmICggIW1heE51bSB8fCAhbWF4UGlkICkge1xuICAgICAgICAgICAgcmV0dXJuICB7IHN0YXR1czogMjAwIH1cbiAgICAgICAgfTtcblxuICAgICAgICAvLyDpgLvovpHvvJrpgJrov4dvcmRlcueahGNyZWF0ZXRpbWXmib7liLB0aWTvvIwg6YCa6L+HIHRpZCsgcGlkIOaJvuWIsHNob3BwaW5nbGlzdFxuICAgICAgICBjb25zdCBvcmRlciQgPSBhd2FpdCBkYi5jb2xsZWN0aW9uKCdvcmRlcicpXG4gICAgICAgICAgICAud2hlcmUoe1xuICAgICAgICAgICAgICAgIGNyZWF0ZVRpbWU6IF8uZ3RlKCB0aW1lIClcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAuZmllbGQoe1xuICAgICAgICAgICAgICAgIHRpZDogdHJ1ZVxuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC5saW1pdCggMSApXG4gICAgICAgICAgICAuZ2V0KCApO1xuICAgICAgICBjb25zdCBvcmRlciA9IG9yZGVyJC5kYXRhWyAwIF07XG5cbiAgICAgICAgaWYgKCBvcmRlciQuZGF0YS5sZW5ndGggPT09IDAgKSB7XG4gICAgICAgICAgICByZXR1cm4gIHsgc3RhdHVzOiAyMDAgfVxuICAgICAgICB9XG5cbiAgICAgICAgY29uc3Qgc2wkID0gYXdhaXQgZGIuY29sbGVjdGlvbignc2hvcHBpbmctbGlzdCcpXG4gICAgICAgICAgICAud2hlcmUoe1xuICAgICAgICAgICAgICAgIHBpZDogbWF4UGlkLFxuICAgICAgICAgICAgICAgIHRpZDogb3JkZXIudGlkXG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLmZpZWxkKHtcbiAgICAgICAgICAgICAgICB1aWRzOiB0cnVlXG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLmdldCggKTtcbiAgICAgICAgY29uc3Qgc2wgPSBzbCQuZGF0YVsgMCBdO1xuXG4gICAgICAgIGlmICggc2wkLmRhdGEubGVuZ3RoID09PSAwICkge1xuICAgICAgICAgICAgcmV0dXJuICB7IHN0YXR1czogMjAwIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC8vIOiOt+WPluaJgOacieeuoeeQhuWRmFxuICAgICAgICBjb25zdCBhZG1zJCA9IGF3YWl0IGRiLmNvbGxlY3Rpb24oJ21hbmFnZXItbWVtYmVyJylcbiAgICAgICAgICAgIC53aGVyZSh7IH0pXG4gICAgICAgICAgICAuZ2V0KCApO1xuXG4gICAgICAgIC8vIOiOt+WPluWVhuWTgeivpuaDhVxuICAgICAgICBjb25zdCBnb29kJCA9IGF3YWl0IGRiLmNvbGxlY3Rpb24oJ2dvb2RzJylcbiAgICAgICAgICAgIC5kb2MoIFN0cmluZyggbWF4UGlkICkpXG4gICAgICAgICAgICAuZmllbGQoe1xuICAgICAgICAgICAgICAgIHRpdGxlOiB0cnVlXG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLmdldCggKTtcblxuICAgICAgICAvLyDmjqjpgIFcbiAgICAgICAgYXdhaXQgUHJvbWlzZS5hbGwoXG4gICAgICAgICAgICBhZG1zJC5kYXRhLm1hcCggYXN5bmMgYWRtID0+IHtcbiAgICAgICAgICAgICAgICBhd2FpdCBjbG91ZC5jYWxsRnVuY3Rpb24oe1xuICAgICAgICAgICAgICAgICAgICBuYW1lOiAnY29tbW9uJyxcbiAgICAgICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgICAgICAgJHVybDogJ3B1c2gtc3Vic2NyaWJlLWNsb3VkJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvcGVuaWQ6IGFkbS5vcGVuaWQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogJ3dhaXRQaW4nLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhZ2U6IGBwYWdlcy9tYW5hZ2VyLXRyaXAtb3JkZXIvaW5kZXg/aWQ9JHtvcmRlci50aWR9YCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZXh0czogW2DmmKjlpKnmnIkke21heE51bX3kurrmtY/op4jvvIwke3NsLnVpZHMubGVuZ3RofeS6uuaIkOWKnyR7c2wudWlkcy5sZW5ndGggPiAxID8gJ+aLvOWbou+8gScgOiAn5LiL5Y2V77yBJ31gLCBgJHtnb29kJC5kYXRhLnRpdGxlfWBdXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICByZXR1cm4gXG4gICAgICAgICAgICB9KVxuICAgICAgICApO1xuXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBzdGF0dXM6IDIwMFxuICAgICAgICB9XG5cbiAgICB9IGNhdGNoICggZSApIHtcbiAgICAgICAgY29uc29sZS5sb2coJyEhISEhIWxhc3REYXlEYXRhJylcbiAgICAgICAgcmV0dXJuIHsgc3RhdHVzOiA1MDAgfTtcbiAgICB9XG59OyJdfQ==