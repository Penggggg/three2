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
exports.userGetExp = function () { return __awaiter(void 0, void 0, void 0, function () {
    var target$, e_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 6, , 7]);
                return [4, db.collection('push-timer')
                        .where({
                        type: 'user-exp-get',
                        pushtime: _.lte(getNow(true))
                    })
                        .get()];
            case 1:
                target$ = _a.sent();
                if (!(target$.data.length > 0)) return [3, 3];
                return [4, Promise.all(target$.data.map(function (target) { return __awaiter(void 0, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4, subscribe_push_1.subscribePush({
                                        openid: target.openid,
                                        type: 'hongbao',
                                        page: "pages/my/index",
                                        texts: target.texts
                                    })];
                                case 1:
                                    _a.sent();
                                    return [2];
                            }
                        });
                    }); }))];
            case 2:
                _a.sent();
                _a.label = 3;
            case 3:
                if (!(target$.data.length > 0)) return [3, 5];
                return [4, Promise.all(target$.data.map(function (target) { return __awaiter(void 0, void 0, void 0, function () {
                        var delete$;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4, db.collection('push-timer')
                                        .doc(String(target._id))
                                        .remove()];
                                case 1:
                                    delete$ = _a.sent();
                                    return [2];
                            }
                        });
                    }); }))];
            case 4:
                _a.sent();
                _a.label = 5;
            case 5: return [3, 7];
            case 6:
                e_1 = _a.sent();
                console.log('!!!!userGetExp');
                return [2, { status: 500 }];
            case 7: return [2];
        }
    });
}); };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLHFDQUF1QztBQUN2QyxvREFBa0Q7QUFFbEQsS0FBSyxDQUFDLElBQUksQ0FBQztJQUNQLEdBQUcsRUFBRSxPQUFPLENBQUMsR0FBRyxDQUFDLEtBQUs7Q0FDekIsQ0FBQyxDQUFDO0FBRUgsSUFBTSxFQUFFLEdBQWdCLEtBQUssQ0FBQyxRQUFRLEVBQUcsQ0FBQztBQUMxQyxJQUFNLENBQUMsR0FBRyxFQUFFLENBQUMsT0FBTyxDQUFDO0FBUXJCLElBQU0sTUFBTSxHQUFHLFVBQUUsRUFBVTtJQUFWLG1CQUFBLEVBQUEsVUFBVTtJQUN2QixJQUFLLEVBQUUsRUFBRztRQUNOLE9BQU8sSUFBSSxDQUFDLEdBQUcsRUFBRyxDQUFDO0tBQ3RCO0lBQ0QsSUFBTSxNQUFNLEdBQUcsSUFBSSxJQUFJLENBQUUsSUFBSSxJQUFJLEVBQUcsQ0FBQyxjQUFjLEVBQUcsQ0FBQyxDQUFDO0lBQ3hELE9BQU8sSUFBSSxJQUFJLENBQUUsTUFBTSxDQUFDLE9BQU8sRUFBRyxHQUFHLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLElBQUksQ0FBRSxDQUFBO0FBQzdELENBQUMsQ0FBQTtBQUtZLFFBQUEsVUFBVSxHQUFHOzs7Ozs7Z0JBR0YsV0FBTSxFQUFFLENBQUMsVUFBVSxDQUFDLFlBQVksQ0FBQzt5QkFDNUMsS0FBSyxDQUFDO3dCQUNILElBQUksRUFBRSxjQUFjO3dCQUNwQixRQUFRLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBRSxNQUFNLENBQUUsSUFBSSxDQUFFLENBQUM7cUJBQ25DLENBQUM7eUJBQ0QsR0FBRyxFQUFHLEVBQUE7O2dCQUxMLE9BQU8sR0FBRyxTQUtMO3FCQUVOLENBQUEsT0FBTyxDQUFDLElBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFBLEVBQXZCLGNBQXVCO2dCQUV4QixXQUFNLE9BQU8sQ0FBQyxHQUFHLENBQ2IsT0FBTyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUUsVUFBTSxNQUFNOzs7d0NBRTFCLFdBQU0sOEJBQWEsQ0FBQzt3Q0FDaEIsTUFBTSxFQUFFLE1BQU0sQ0FBQyxNQUFNO3dDQUNyQixJQUFJLEVBQUUsU0FBUzt3Q0FDZixJQUFJLEVBQUUsZ0JBQWdCO3dDQUN0QixLQUFLLEVBQUUsTUFBTSxDQUFDLEtBQUs7cUNBQ3RCLENBQUMsRUFBQTs7b0NBTEYsU0FLRSxDQUFBOzs7O3lCQUNMLENBQUMsQ0FDTCxFQUFBOztnQkFWRCxTQVVDLENBQUM7OztxQkFHRCxDQUFBLE9BQU8sQ0FBQyxJQUFJLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQSxFQUF2QixjQUF1QjtnQkFDeEIsV0FBTSxPQUFPLENBQUMsR0FBRyxDQUNiLE9BQU8sQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFFLFVBQU0sTUFBTTs7Ozt3Q0FDVixXQUFNLEVBQUUsQ0FBQyxVQUFVLENBQUMsWUFBWSxDQUFDO3lDQUM1QyxHQUFHLENBQUUsTUFBTSxDQUFFLE1BQU0sQ0FBQyxHQUFHLENBQUUsQ0FBQzt5Q0FDMUIsTUFBTSxFQUFHLEVBQUE7O29DQUZSLE9BQU8sR0FBRyxTQUVGOzs7O3lCQUNqQixDQUFDLENBQ0wsRUFBQTs7Z0JBTkQsU0FNQyxDQUFBOzs7OztnQkFJTCxPQUFPLENBQUMsR0FBRyxDQUFDLGdCQUFnQixDQUFDLENBQUE7Z0JBQzdCLFdBQU8sRUFBRSxNQUFNLEVBQUUsR0FBRyxFQUFFLEVBQUE7Ozs7S0FFN0IsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIGNsb3VkIGZyb20gJ3d4LXNlcnZlci1zZGsnO1xuaW1wb3J0IHsgc3Vic2NyaWJlUHVzaCB9IGZyb20gJy4uL3N1YnNjcmliZS1wdXNoJztcblxuY2xvdWQuaW5pdCh7XG4gICAgZW52OiBwcm9jZXNzLmVudi5jbG91ZFxufSk7XG5cbmNvbnN0IGRiOiBEQi5EYXRhYmFzZSA9IGNsb3VkLmRhdGFiYXNlKCApO1xuY29uc3QgXyA9IGRiLmNvbW1hbmQ7XG5cbi8qKiBcbiAqIOi9rOaNouagvOael+WwvOayu+aXtuWMuiArOOaXtuWMulxuICogRGF0ZSgpLm5vdygpIC8gbmV3IERhdGUoKS5nZXRUaW1lKCkg5piv5pe25LiN5pe25q2j5bi455qEKzhcbiAqIERhdGUudG9Mb2NhbFN0cmluZyggKSDlpb3lg4/mmK/kuIDnm7TmmK8rMOeahFxuICog5YWI5ou/5YiwICsw77yM54S25ZCOKzhcbiAqL1xuY29uc3QgZ2V0Tm93ID0gKCB0cyA9IGZhbHNlICk6IGFueSA9PiB7XG4gICAgaWYgKCB0cyApIHtcbiAgICAgICAgcmV0dXJuIERhdGUubm93KCApO1xuICAgIH1cbiAgICBjb25zdCB0aW1lXzAgPSBuZXcgRGF0ZSggbmV3IERhdGUoICkudG9Mb2NhbGVTdHJpbmcoICkpO1xuICAgIHJldHVybiBuZXcgRGF0ZSggdGltZV8wLmdldFRpbWUoICkgKyA4ICogNjAgKiA2MCAqIDEwMDAgKVxufVxuXG4vKipcbiAqIOetvuWIsO+8mueUqOaIt+e7j+mqjOmihuWPluaPkOmGklxuICovXG5leHBvcnQgY29uc3QgdXNlckdldEV4cCA9IGFzeW5jICggKSA9PiB7XG4gICAgdHJ5IHtcblxuICAgICAgICBjb25zdCB0YXJnZXQkID0gYXdhaXQgZGIuY29sbGVjdGlvbigncHVzaC10aW1lcicpXG4gICAgICAgICAgICAud2hlcmUoe1xuICAgICAgICAgICAgICAgIHR5cGU6ICd1c2VyLWV4cC1nZXQnLFxuICAgICAgICAgICAgICAgIHB1c2h0aW1lOiBfLmx0ZSggZ2V0Tm93KCB0cnVlICkpXG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLmdldCggKTtcblxuICAgICAgICBpZiAoIHRhcmdldCQuZGF0YS5sZW5ndGggPiAwICkge1xuXG4gICAgICAgICAgICBhd2FpdCBQcm9taXNlLmFsbChcbiAgICAgICAgICAgICAgICB0YXJnZXQkLmRhdGEubWFwKCBhc3luYyB0YXJnZXQgPT4ge1xuICAgICAgICAgICAgICAgICAgICAvLyA044CB6LCD55So5o6o6YCBXG4gICAgICAgICAgICAgICAgICAgIGF3YWl0IHN1YnNjcmliZVB1c2goe1xuICAgICAgICAgICAgICAgICAgICAgICAgb3BlbmlkOiB0YXJnZXQub3BlbmlkLFxuICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogJ2hvbmdiYW8nLFxuICAgICAgICAgICAgICAgICAgICAgICAgcGFnZTogYHBhZ2VzL215L2luZGV4YCxcbiAgICAgICAgICAgICAgICAgICAgICAgIHRleHRzOiB0YXJnZXQudGV4dHNcbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICggdGFyZ2V0JC5kYXRhLmxlbmd0aCA+IDAgKSB7XG4gICAgICAgICAgICBhd2FpdCBQcm9taXNlLmFsbChcbiAgICAgICAgICAgICAgICB0YXJnZXQkLmRhdGEubWFwKCBhc3luYyB0YXJnZXQgPT4ge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBkZWxldGUkID0gYXdhaXQgZGIuY29sbGVjdGlvbigncHVzaC10aW1lcicpXG4gICAgICAgICAgICAgICAgICAgICAgICAuZG9jKCBTdHJpbmcoIHRhcmdldC5faWQgKSlcbiAgICAgICAgICAgICAgICAgICAgICAgIC5yZW1vdmUoICk7XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIClcbiAgICAgICAgfVxuXG4gICAgfSBjYXRjaCAoIGUgKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKCchISEhdXNlckdldEV4cCcpXG4gICAgICAgIHJldHVybiB7IHN0YXR1czogNTAwIH1cbiAgICB9XG59Il19