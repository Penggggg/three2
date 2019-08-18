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
exports.userGetExp = function () { return __awaiter(_this, void 0, void 0, function () {
    var target$, e_1;
    var _this = this;
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
                return [4, Promise.all(target$.data.map(function (target) { return __awaiter(_this, void 0, void 0, function () {
                        var push$;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4, cloud.callFunction({
                                        name: 'common',
                                        data: {
                                            $url: 'push-template-cloud',
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
                return [4, Promise.all(target$.data.map(function (target) { return __awaiter(_this, void 0, void 0, function () {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSxpQkF1RUM7O0FBdkVELHFDQUF1QztBQUV2QyxLQUFLLENBQUMsSUFBSSxDQUFDO0lBQ1AsR0FBRyxFQUFFLE9BQU8sQ0FBQyxHQUFHLENBQUMsS0FBSztDQUN6QixDQUFDLENBQUM7QUFFSCxJQUFNLEVBQUUsR0FBZ0IsS0FBSyxDQUFDLFFBQVEsRUFBRyxDQUFDO0FBQzFDLElBQU0sQ0FBQyxHQUFHLEVBQUUsQ0FBQyxPQUFPLENBQUM7QUFRckIsSUFBTSxNQUFNLEdBQUcsVUFBRSxFQUFVO0lBQVYsbUJBQUEsRUFBQSxVQUFVO0lBQ3ZCLElBQUssRUFBRSxFQUFHO1FBQ04sT0FBTyxJQUFJLENBQUMsR0FBRyxFQUFHLENBQUM7S0FDdEI7SUFDRCxJQUFNLE1BQU0sR0FBRyxJQUFJLElBQUksQ0FBRSxJQUFJLElBQUksRUFBRyxDQUFDLGNBQWMsRUFBRyxDQUFDLENBQUM7SUFDeEQsT0FBTyxJQUFJLElBQUksQ0FBRSxNQUFNLENBQUMsT0FBTyxFQUFHLEdBQUcsQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsSUFBSSxDQUFFLENBQUE7QUFDN0QsQ0FBQyxDQUFBO0FBS1ksUUFBQSxVQUFVLEdBQUc7Ozs7Ozs7Z0JBR0YsV0FBTSxFQUFFLENBQUMsVUFBVSxDQUFDLFlBQVksQ0FBQzt5QkFDNUMsS0FBSyxDQUFDO3dCQUNILElBQUksRUFBRSxjQUFjO3dCQUNwQixRQUFRLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBRSxNQUFNLENBQUUsSUFBSSxDQUFFLENBQUM7cUJBQ25DLENBQUM7eUJBQ0QsR0FBRyxFQUFHLEVBQUE7O2dCQUxMLE9BQU8sR0FBRyxTQUtMO3FCQUVOLENBQUEsT0FBTyxDQUFDLElBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFBLEVBQXZCLGNBQXVCO2dCQUV4QixXQUFNLE9BQU8sQ0FBQyxHQUFHLENBQ2IsT0FBTyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUUsVUFBTSxNQUFNOzs7O3dDQUVaLFdBQU0sS0FBSyxDQUFDLFlBQVksQ0FBQzt3Q0FDbkMsSUFBSSxFQUFFLFFBQVE7d0NBQ2QsSUFBSSxFQUFFOzRDQUNGLElBQUksRUFBRSxxQkFBcUI7NENBQzNCLElBQUksRUFBRTtnREFDRixNQUFNLEVBQUUsTUFBTSxDQUFDLE1BQU07Z0RBQ3JCLElBQUksRUFBRSxTQUFTO2dEQUNmLElBQUksRUFBRSx3QkFBd0I7Z0RBQzlCLEtBQUssRUFBRSxNQUFNLENBQUMsS0FBSzs2Q0FDdEI7eUNBQ0o7cUNBQ0osQ0FBQyxFQUFBOztvQ0FYSSxLQUFLLEdBQUcsU0FXWjs7Ozt5QkFDTCxDQUFDLENBQ0wsRUFBQTs7Z0JBaEJELFNBZ0JDLENBQUM7OztxQkFHRCxDQUFBLE9BQU8sQ0FBQyxJQUFJLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQSxFQUF2QixjQUF1QjtnQkFDeEIsV0FBTSxPQUFPLENBQUMsR0FBRyxDQUNiLE9BQU8sQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFFLFVBQU0sTUFBTTs7Ozt3Q0FDVixXQUFNLEVBQUUsQ0FBQyxVQUFVLENBQUMsWUFBWSxDQUFDO3lDQUM1QyxHQUFHLENBQUUsTUFBTSxDQUFFLE1BQU0sQ0FBQyxHQUFHLENBQUUsQ0FBQzt5Q0FDMUIsTUFBTSxFQUFHLEVBQUE7O29DQUZSLE9BQU8sR0FBRyxTQUVGOzs7O3lCQUNqQixDQUFDLENBQ0wsRUFBQTs7Z0JBTkQsU0FNQyxDQUFBOzs7OztnQkFJTCxPQUFPLENBQUMsR0FBRyxDQUFDLGdCQUFnQixDQUFDLENBQUE7Z0JBQzdCLFdBQU8sRUFBRSxNQUFNLEVBQUUsR0FBRyxFQUFFLEVBQUE7Ozs7S0FFN0IsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIGNsb3VkIGZyb20gJ3d4LXNlcnZlci1zZGsnO1xuXG5jbG91ZC5pbml0KHtcbiAgICBlbnY6IHByb2Nlc3MuZW52LmNsb3VkXG59KTtcblxuY29uc3QgZGI6IERCLkRhdGFiYXNlID0gY2xvdWQuZGF0YWJhc2UoICk7XG5jb25zdCBfID0gZGIuY29tbWFuZDtcblxuLyoqIFxuICog6L2s5o2i5qC85p6X5bC85rK75pe25Yy6ICs45pe25Yy6XG4gKiBEYXRlKCkubm93KCkgLyBuZXcgRGF0ZSgpLmdldFRpbWUoKSDmmK/ml7bkuI3ml7bmraPluLjnmoQrOFxuICogRGF0ZS50b0xvY2FsU3RyaW5nKCApIOWlveWDj+aYr+S4gOebtOaYrysw55qEXG4gKiDlhYjmi7/liLAgKzDvvIznhLblkI4rOFxuICovXG5jb25zdCBnZXROb3cgPSAoIHRzID0gZmFsc2UgKTogYW55ID0+IHtcbiAgICBpZiAoIHRzICkge1xuICAgICAgICByZXR1cm4gRGF0ZS5ub3coICk7XG4gICAgfVxuICAgIGNvbnN0IHRpbWVfMCA9IG5ldyBEYXRlKCBuZXcgRGF0ZSggKS50b0xvY2FsZVN0cmluZyggKSk7XG4gICAgcmV0dXJuIG5ldyBEYXRlKCB0aW1lXzAuZ2V0VGltZSggKSArIDggKiA2MCAqIDYwICogMTAwMCApXG59XG5cbi8qKlxuICog562+5Yiw77ya55So5oi357uP6aqM6aKG5Y+W5o+Q6YaSXG4gKi9cbmV4cG9ydCBjb25zdCB1c2VyR2V0RXhwID0gYXN5bmMgKCApID0+IHtcbiAgICB0cnkge1xuXG4gICAgICAgIGNvbnN0IHRhcmdldCQgPSBhd2FpdCBkYi5jb2xsZWN0aW9uKCdwdXNoLXRpbWVyJylcbiAgICAgICAgICAgIC53aGVyZSh7XG4gICAgICAgICAgICAgICAgdHlwZTogJ3VzZXItZXhwLWdldCcsXG4gICAgICAgICAgICAgICAgcHVzaHRpbWU6IF8ubHRlKCBnZXROb3coIHRydWUgKSlcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAuZ2V0KCApO1xuXG4gICAgICAgIGlmICggdGFyZ2V0JC5kYXRhLmxlbmd0aCA+IDAgKSB7XG5cbiAgICAgICAgICAgIGF3YWl0IFByb21pc2UuYWxsKFxuICAgICAgICAgICAgICAgIHRhcmdldCQuZGF0YS5tYXAoIGFzeW5jIHRhcmdldCA9PiB7XG4gICAgICAgICAgICAgICAgICAgIC8vIDTjgIHosIPnlKjmjqjpgIFcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgcHVzaCQgPSBhd2FpdCBjbG91ZC5jYWxsRnVuY3Rpb24oe1xuICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogJ2NvbW1vbicsXG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJHVybDogJ3B1c2gtdGVtcGxhdGUtY2xvdWQnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb3BlbmlkOiB0YXJnZXQub3BlbmlkLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiAnaG9uZ2JhbycsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhZ2U6IGBwYWdlcy90cmlwLWVudGVyL2luZGV4YCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGV4dHM6IHRhcmdldC50ZXh0c1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIHRhcmdldCQuZGF0YS5sZW5ndGggPiAwICkge1xuICAgICAgICAgICAgYXdhaXQgUHJvbWlzZS5hbGwoXG4gICAgICAgICAgICAgICAgdGFyZ2V0JC5kYXRhLm1hcCggYXN5bmMgdGFyZ2V0ID0+IHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgZGVsZXRlJCA9IGF3YWl0IGRiLmNvbGxlY3Rpb24oJ3B1c2gtdGltZXInKVxuICAgICAgICAgICAgICAgICAgICAgICAgLmRvYyggU3RyaW5nKCB0YXJnZXQuX2lkICkpXG4gICAgICAgICAgICAgICAgICAgICAgICAucmVtb3ZlKCApO1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICApXG4gICAgICAgIH1cblxuICAgIH0gY2F0Y2ggKCBlICkge1xuICAgICAgICBjb25zb2xlLmxvZygnISEhIXVzZXJHZXRFeHAnKVxuICAgICAgICByZXR1cm4geyBzdGF0dXM6IDUwMCB9XG4gICAgfVxufSJdfQ==