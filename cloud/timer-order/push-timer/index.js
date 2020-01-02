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
                        var push$;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4, cloud.callFunction({
                                        name: 'common',
                                        data: {
                                            $url: 'push-subscribe-cloud',
                                            data: {
                                                openid: target.openid,
                                                type: 'hongbao',
                                                page: "pages/trip-enter/index",
                                                texts: target.texts
                                            }
                                        }
                                    })];
                                case 1:
                                    push$ = _a.sent();
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLHFDQUF1QztBQUV2QyxLQUFLLENBQUMsSUFBSSxDQUFDO0lBQ1AsR0FBRyxFQUFFLEtBQUssQ0FBQyxtQkFBbUI7Q0FDakMsQ0FBQyxDQUFDO0FBRUgsSUFBTSxFQUFFLEdBQWdCLEtBQUssQ0FBQyxRQUFRLEVBQUcsQ0FBQztBQUMxQyxJQUFNLENBQUMsR0FBRyxFQUFFLENBQUMsT0FBTyxDQUFDO0FBUXJCLElBQU0sTUFBTSxHQUFHLFVBQUUsRUFBVTtJQUFWLG1CQUFBLEVBQUEsVUFBVTtJQUN2QixJQUFLLEVBQUUsRUFBRztRQUNOLE9BQU8sSUFBSSxDQUFDLEdBQUcsRUFBRyxDQUFDO0tBQ3RCO0lBQ0QsSUFBTSxNQUFNLEdBQUcsSUFBSSxJQUFJLENBQUUsSUFBSSxJQUFJLEVBQUcsQ0FBQyxjQUFjLEVBQUcsQ0FBQyxDQUFDO0lBQ3hELE9BQU8sSUFBSSxJQUFJLENBQUUsTUFBTSxDQUFDLE9BQU8sRUFBRyxHQUFHLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLElBQUksQ0FBRSxDQUFBO0FBQzdELENBQUMsQ0FBQTtBQUtZLFFBQUEsVUFBVSxHQUFHOzs7Ozs7Z0JBR0YsV0FBTSxFQUFFLENBQUMsVUFBVSxDQUFDLFlBQVksQ0FBQzt5QkFDNUMsS0FBSyxDQUFDO3dCQUNILElBQUksRUFBRSxjQUFjO3dCQUNwQixRQUFRLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBRSxNQUFNLENBQUUsSUFBSSxDQUFFLENBQUM7cUJBQ25DLENBQUM7eUJBQ0QsR0FBRyxFQUFHLEVBQUE7O2dCQUxMLE9BQU8sR0FBRyxTQUtMO3FCQUVOLENBQUEsT0FBTyxDQUFDLElBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFBLEVBQXZCLGNBQXVCO2dCQUV4QixXQUFNLE9BQU8sQ0FBQyxHQUFHLENBQ2IsT0FBTyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUUsVUFBTSxNQUFNOzs7O3dDQUVaLFdBQU0sS0FBSyxDQUFDLFlBQVksQ0FBQzt3Q0FDbkMsSUFBSSxFQUFFLFFBQVE7d0NBQ2QsSUFBSSxFQUFFOzRDQUNGLElBQUksRUFBRSxzQkFBc0I7NENBQzVCLElBQUksRUFBRTtnREFDRixNQUFNLEVBQUUsTUFBTSxDQUFDLE1BQU07Z0RBQ3JCLElBQUksRUFBRSxTQUFTO2dEQUNmLElBQUksRUFBRSx3QkFBd0I7Z0RBQzlCLEtBQUssRUFBRSxNQUFNLENBQUMsS0FBSzs2Q0FDdEI7eUNBQ0o7cUNBQ0osQ0FBQyxFQUFBOztvQ0FYSSxLQUFLLEdBQUcsU0FXWjs7Ozt5QkFDTCxDQUFDLENBQ0wsRUFBQTs7Z0JBaEJELFNBZ0JDLENBQUM7OztxQkFHRCxDQUFBLE9BQU8sQ0FBQyxJQUFJLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQSxFQUF2QixjQUF1QjtnQkFDeEIsV0FBTSxPQUFPLENBQUMsR0FBRyxDQUNiLE9BQU8sQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFFLFVBQU0sTUFBTTs7Ozt3Q0FDVixXQUFNLEVBQUUsQ0FBQyxVQUFVLENBQUMsWUFBWSxDQUFDO3lDQUM1QyxHQUFHLENBQUUsTUFBTSxDQUFFLE1BQU0sQ0FBQyxHQUFHLENBQUUsQ0FBQzt5Q0FDMUIsTUFBTSxFQUFHLEVBQUE7O29DQUZSLE9BQU8sR0FBRyxTQUVGOzs7O3lCQUNqQixDQUFDLENBQ0wsRUFBQTs7Z0JBTkQsU0FNQyxDQUFBOzs7OztnQkFJTCxPQUFPLENBQUMsR0FBRyxDQUFDLGdCQUFnQixDQUFDLENBQUE7Z0JBQzdCLFdBQU8sRUFBRSxNQUFNLEVBQUUsR0FBRyxFQUFFLEVBQUE7Ozs7S0FFN0IsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIGNsb3VkIGZyb20gJ3d4LXNlcnZlci1zZGsnO1xuXG5jbG91ZC5pbml0KHtcbiAgICBlbnY6IGNsb3VkLkRZTkFNSUNfQ1VSUkVOVF9FTlZcbn0pO1xuXG5jb25zdCBkYjogREIuRGF0YWJhc2UgPSBjbG91ZC5kYXRhYmFzZSggKTtcbmNvbnN0IF8gPSBkYi5jb21tYW5kO1xuXG4vKiogXG4gKiDovazmjaLmoLzmnpflsLzmsrvml7bljLogKzjml7bljLpcbiAqIERhdGUoKS5ub3coKSAvIG5ldyBEYXRlKCkuZ2V0VGltZSgpIOaYr+aXtuS4jeaXtuato+W4uOeahCs4XG4gKiBEYXRlLnRvTG9jYWxTdHJpbmcoICkg5aW95YOP5piv5LiA55u05pivKzDnmoRcbiAqIOWFiOaLv+WIsCArMO+8jOeEtuWQjis4XG4gKi9cbmNvbnN0IGdldE5vdyA9ICggdHMgPSBmYWxzZSApOiBhbnkgPT4ge1xuICAgIGlmICggdHMgKSB7XG4gICAgICAgIHJldHVybiBEYXRlLm5vdyggKTtcbiAgICB9XG4gICAgY29uc3QgdGltZV8wID0gbmV3IERhdGUoIG5ldyBEYXRlKCApLnRvTG9jYWxlU3RyaW5nKCApKTtcbiAgICByZXR1cm4gbmV3IERhdGUoIHRpbWVfMC5nZXRUaW1lKCApICsgOCAqIDYwICogNjAgKiAxMDAwIClcbn1cblxuLyoqXG4gKiDnrb7liLDvvJrnlKjmiLfnu4/pqozpooblj5bmj5DphpJcbiAqL1xuZXhwb3J0IGNvbnN0IHVzZXJHZXRFeHAgPSBhc3luYyAoICkgPT4ge1xuICAgIHRyeSB7XG5cbiAgICAgICAgY29uc3QgdGFyZ2V0JCA9IGF3YWl0IGRiLmNvbGxlY3Rpb24oJ3B1c2gtdGltZXInKVxuICAgICAgICAgICAgLndoZXJlKHtcbiAgICAgICAgICAgICAgICB0eXBlOiAndXNlci1leHAtZ2V0JyxcbiAgICAgICAgICAgICAgICBwdXNodGltZTogXy5sdGUoIGdldE5vdyggdHJ1ZSApKVxuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC5nZXQoICk7XG5cbiAgICAgICAgaWYgKCB0YXJnZXQkLmRhdGEubGVuZ3RoID4gMCApIHtcblxuICAgICAgICAgICAgYXdhaXQgUHJvbWlzZS5hbGwoXG4gICAgICAgICAgICAgICAgdGFyZ2V0JC5kYXRhLm1hcCggYXN5bmMgdGFyZ2V0ID0+IHtcbiAgICAgICAgICAgICAgICAgICAgLy8gNOOAgeiwg+eUqOaOqOmAgVxuICAgICAgICAgICAgICAgICAgICBjb25zdCBwdXNoJCA9IGF3YWl0IGNsb3VkLmNhbGxGdW5jdGlvbih7XG4gICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiAnY29tbW9uJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkdXJsOiAncHVzaC1zdWJzY3JpYmUtY2xvdWQnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb3BlbmlkOiB0YXJnZXQub3BlbmlkLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiAnaG9uZ2JhbycsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhZ2U6IGBwYWdlcy90cmlwLWVudGVyL2luZGV4YCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGV4dHM6IHRhcmdldC50ZXh0c1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIHRhcmdldCQuZGF0YS5sZW5ndGggPiAwICkge1xuICAgICAgICAgICAgYXdhaXQgUHJvbWlzZS5hbGwoXG4gICAgICAgICAgICAgICAgdGFyZ2V0JC5kYXRhLm1hcCggYXN5bmMgdGFyZ2V0ID0+IHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgZGVsZXRlJCA9IGF3YWl0IGRiLmNvbGxlY3Rpb24oJ3B1c2gtdGltZXInKVxuICAgICAgICAgICAgICAgICAgICAgICAgLmRvYyggU3RyaW5nKCB0YXJnZXQuX2lkICkpXG4gICAgICAgICAgICAgICAgICAgICAgICAucmVtb3ZlKCApO1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICApXG4gICAgICAgIH1cblxuICAgIH0gY2F0Y2ggKCBlICkge1xuICAgICAgICBjb25zb2xlLmxvZygnISEhIXVzZXJHZXRFeHAnKVxuICAgICAgICByZXR1cm4geyBzdGF0dXM6IDUwMCB9XG4gICAgfVxufSJdfQ==