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
var TcbRouter = require("tcb-router");
cloud.init({
    env: cloud.DYNAMIC_CURRENT_ENV
});
var db = cloud.database();
exports.main = function (event, context) { return __awaiter(void 0, void 0, void 0, function () {
    var app;
    return __generator(this, function (_a) {
        app = new TcbRouter({ event: event });
        app.router('adjust-fee', function (ctx, next) { return __awaiter(void 0, void 0, void 0, function () {
            var _a, _id, fee, tid, openid, e_1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 5, , 6]);
                        _a = event.data, _id = _a._id, fee = _a.fee, tid = _a.tid;
                        openid = event.data.openId || event.data.openid || event.userInfo.openId;
                        if (!!_id) return [3, 2];
                        return [4, db.collection('deliver-fee')
                                .add({
                                data: {
                                    fee: fee,
                                    tid: tid,
                                    openid: openid
                                }
                            })];
                    case 1:
                        _b.sent();
                        return [3, 4];
                    case 2: return [4, db.collection('deliver-fee')
                            .doc(_id)
                            .update({
                            data: {
                                fee: fee
                            }
                        })];
                    case 3:
                        _b.sent();
                        _b.label = 4;
                    case 4: return [2, ctx.body = {
                            status: 200,
                            data: null
                        }];
                    case 5:
                        e_1 = _b.sent();
                        return [2, ctx.body = { status: 500 }];
                    case 6: return [2];
                }
            });
        }); });
        app.router('trips-fee', function (ctx, next) { return __awaiter(void 0, void 0, void 0, function () {
            var tids, openid_1, fees$$, meta, e_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        tids = event.data.tids;
                        openid_1 = event.data.openId || event.data.openid || event.userInfo.openId;
                        return [4, Promise.all(tids.split(',')
                                .map(function (tid) {
                                return db.collection('deliver-fee')
                                    .where({
                                    tid: tid,
                                    openid: openid_1
                                })
                                    .get();
                            }))];
                    case 1:
                        fees$$ = _a.sent();
                        meta = fees$$
                            .filter(function (x) { return !!x.data[0]; })
                            .map(function (x) { return x.data[0]; });
                        return [2, ctx.body = {
                                status: 200,
                                data: meta
                            }];
                    case 2:
                        e_2 = _a.sent();
                        return [2, ctx.body = { status: 500 }];
                    case 3: return [2];
                }
            });
        }); });
        return [2, app.serve()];
    });
}); };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLHFDQUF1QztBQUN2QyxzQ0FBd0M7QUFFeEMsS0FBSyxDQUFDLElBQUksQ0FBQztJQUNQLEdBQUcsRUFBRSxLQUFLLENBQUMsbUJBQW1CO0NBQ2pDLENBQUMsQ0FBQztBQUVILElBQU0sRUFBRSxHQUFnQixLQUFLLENBQUMsUUFBUSxFQUFHLENBQUM7QUFXN0IsUUFBQSxJQUFJLEdBQUcsVUFBUSxLQUFLLEVBQUUsT0FBTzs7O1FBRWhDLEdBQUcsR0FBRyxJQUFJLFNBQVMsQ0FBQyxFQUFFLEtBQUssT0FBQSxFQUFFLENBQUMsQ0FBQztRQVlyQyxHQUFHLENBQUMsTUFBTSxDQUFDLFlBQVksRUFBRSxVQUFPLEdBQUcsRUFBRSxJQUFJOzs7Ozs7d0JBRzNCLEtBQW9CLEtBQUssQ0FBQyxJQUFJLEVBQTVCLEdBQUcsU0FBQSxFQUFFLEdBQUcsU0FBQSxFQUFFLEdBQUcsU0FBQSxDQUFnQjt3QkFDL0IsTUFBTSxHQUFHLEtBQUssQ0FBQyxJQUFJLENBQUMsTUFBTSxJQUFJLEtBQUssQ0FBQyxJQUFJLENBQUMsTUFBTSxJQUFJLEtBQUssQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDOzZCQUcxRSxDQUFDLEdBQUcsRUFBSixjQUFJO3dCQUNMLFdBQU0sRUFBRSxDQUFDLFVBQVUsQ0FBQyxhQUFhLENBQUM7aUNBQzdCLEdBQUcsQ0FBQztnQ0FDRCxJQUFJLEVBQUU7b0NBQ0YsR0FBRyxLQUFBO29DQUNILEdBQUcsS0FBQTtvQ0FDSCxNQUFNLFFBQUE7aUNBQ1Q7NkJBQ0osQ0FBQyxFQUFBOzt3QkFQTixTQU9NLENBQUE7OzRCQUdOLFdBQU0sRUFBRSxDQUFDLFVBQVUsQ0FBQyxhQUFhLENBQUM7NkJBQzdCLEdBQUcsQ0FBRSxHQUFHLENBQUU7NkJBQ1YsTUFBTSxDQUFDOzRCQUNKLElBQUksRUFBRTtnQ0FDRixHQUFHLEtBQUE7NkJBQ047eUJBQ0osQ0FBQyxFQUFBOzt3QkFOTixTQU1NLENBQUE7OzRCQUdWLFdBQU8sR0FBRyxDQUFDLElBQUksR0FBRzs0QkFDZCxNQUFNLEVBQUUsR0FBRzs0QkFDWCxJQUFJLEVBQUUsSUFBSTt5QkFDYixFQUFBOzs7d0JBQ1csV0FBTyxHQUFHLENBQUMsSUFBSSxHQUFHLEVBQUUsTUFBTSxFQUFFLEdBQUcsRUFBRSxFQUFDOzs7O2FBQ3JELENBQUMsQ0FBQztRQVNILEdBQUcsQ0FBQyxNQUFNLENBQUMsV0FBVyxFQUFFLFVBQU8sR0FBRyxFQUFFLElBQUk7Ozs7Ozt3QkFHeEIsSUFBSSxHQUFLLEtBQUssQ0FBQyxJQUFJLEtBQWYsQ0FBZ0I7d0JBQ3RCLFdBQVMsS0FBSyxDQUFDLElBQUksQ0FBQyxNQUFNLElBQUksS0FBSyxDQUFDLElBQUksQ0FBQyxNQUFNLElBQUksS0FBSyxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUM7d0JBRTNELFdBQU0sT0FBTyxDQUFDLEdBQUcsQ0FDakMsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUM7aUNBQ1YsR0FBRyxDQUFFLFVBQUEsR0FBRztnQ0FDTCxPQUFBLEVBQUUsQ0FBQyxVQUFVLENBQUMsYUFBYSxDQUFDO3FDQUN2QixLQUFLLENBQUM7b0NBQ0gsR0FBRyxLQUFBO29DQUNILE1BQU0sVUFBQTtpQ0FDVCxDQUFDO3FDQUNELEdBQUcsRUFBRzs0QkFMWCxDQUtXLENBQ2QsQ0FDUixFQUFBOzt3QkFWSyxNQUFNLEdBQVEsU0FVbkI7d0JBRUssSUFBSSxHQUFHLE1BQU07NkJBQ2QsTUFBTSxDQUFFLFVBQUEsQ0FBQyxJQUFJLE9BQUEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUUsQ0FBQyxDQUFFLEVBQWIsQ0FBYSxDQUFDOzZCQUMzQixHQUFHLENBQUUsVUFBQSxDQUFDLElBQUksT0FBQSxDQUFDLENBQUMsSUFBSSxDQUFFLENBQUMsQ0FBRSxFQUFYLENBQVcsQ0FBQyxDQUFBO3dCQUUzQixXQUFPLEdBQUcsQ0FBQyxJQUFJLEdBQUc7Z0NBQ2QsTUFBTSxFQUFFLEdBQUc7Z0NBQ1gsSUFBSSxFQUFFLElBQUk7NkJBQ2IsRUFBQTs7O3dCQUVELFdBQU8sR0FBRyxDQUFDLElBQUksR0FBRyxFQUFFLE1BQU0sRUFBRSxHQUFHLEVBQUUsRUFBQzs7OzthQUV6QyxDQUFDLENBQUM7UUFFSCxXQUFPLEdBQUcsQ0FBQyxLQUFLLEVBQUcsRUFBQzs7S0FDdkIsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIGNsb3VkIGZyb20gJ3d4LXNlcnZlci1zZGsnO1xuaW1wb3J0ICogYXMgVGNiUm91dGVyIGZyb20gJ3RjYi1yb3V0ZXInO1xuXG5jbG91ZC5pbml0KHtcbiAgICBlbnY6IGNsb3VkLkRZTkFNSUNfQ1VSUkVOVF9FTlZcbn0pO1xuXG5jb25zdCBkYjogREIuRGF0YWJhc2UgPSBjbG91ZC5kYXRhYmFzZSggKTtcblxuLyoqXG4gKlxuICogQGRlc2NyaXB0aW9uIOW/q+mAkui0ueeUqOaooeWdl1xuICogXG4gKiBfaWRcbiAqIG9wZW5pZFxuICogdGlkXG4gKiBmZWVcbiAqL1xuZXhwb3J0IGNvbnN0IG1haW4gPSBhc3luYyAoIGV2ZW50LCBjb250ZXh0ICkgPT4ge1xuXG4gICAgY29uc3QgYXBwID0gbmV3IFRjYlJvdXRlcih7IGV2ZW50IH0pO1xuXG4gICAgLyoqXG4gICAgICogQGRlc2NyaXB0aW9uIOiwg+aVtOW/q+mAkui0ueeUqFxuICAgICAqIC0tLS0tLS0tIOivt+axgiAtLS0tLS0tLS1cbiAgICAgKiB7XG4gICAgICogICAgICBfaWQ/XG4gICAgICogICAgICBvcGVuaWRcbiAgICAgKiAgICAgIGZlZVxuICAgICAqICAgICAgdGlkXG4gICAgICogfVxuICAgICAqL1xuICAgIGFwcC5yb3V0ZXIoJ2FkanVzdC1mZWUnLCBhc3luYyggY3R4LCBuZXh0ICkgPT4ge1xuICAgICAgICB0cnkge1xuXG4gICAgICAgICAgICBjb25zdCB7IF9pZCwgZmVlLCB0aWQgfSA9IGV2ZW50LmRhdGE7XG4gICAgICAgICAgICBjb25zdCBvcGVuaWQgPSBldmVudC5kYXRhLm9wZW5JZCB8fCBldmVudC5kYXRhLm9wZW5pZCB8fCBldmVudC51c2VySW5mby5vcGVuSWQ7XG5cbiAgICAgICAgICAgIC8vIOWIm+W7ulxuICAgICAgICAgICAgaWYgKCAhX2lkICkge1xuICAgICAgICAgICAgICAgIGF3YWl0IGRiLmNvbGxlY3Rpb24oJ2RlbGl2ZXItZmVlJylcbiAgICAgICAgICAgICAgICAgICAgLmFkZCh7XG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZmVlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRpZCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvcGVuaWRcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC8vIOabtOaWsFxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBhd2FpdCBkYi5jb2xsZWN0aW9uKCdkZWxpdmVyLWZlZScpXG4gICAgICAgICAgICAgICAgICAgIC5kb2MoIF9pZCApXG4gICAgICAgICAgICAgICAgICAgIC51cGRhdGUoe1xuICAgICAgICAgICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZlZVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gY3R4LmJvZHkgPSB7XG4gICAgICAgICAgICAgICAgc3RhdHVzOiAyMDAsXG4gICAgICAgICAgICAgICAgZGF0YTogbnVsbFxuICAgICAgICAgICAgfVxuICAgICAgICB9IGNhdGNoICggZSApIHsgcmV0dXJuIGN0eC5ib2R5ID0geyBzdGF0dXM6IDUwMCB9O31cbiAgICB9KTtcblxuICAgIC8qKiBcbiAgICAgKiBAZGVzY3JpcHRpb24g6I635Y+W5oyH5a6a5Yeg5Liq6KGM56iL55qE6YKu6LS55YiX6KGoXG4gICAgICoge1xuICAgICAqICAgICBvcGVuaWRcbiAgICAgKiAgICAgdGlkc1xuICAgICAqIH1cbiAgICAgKi9cbiAgICBhcHAucm91dGVyKCd0cmlwcy1mZWUnLCBhc3luYyggY3R4LCBuZXh0ICkgPT4ge1xuICAgICAgICB0cnkge1xuXG4gICAgICAgICAgICBjb25zdCB7IHRpZHMgfSA9IGV2ZW50LmRhdGE7XG4gICAgICAgICAgICBjb25zdCBvcGVuaWQgPSBldmVudC5kYXRhLm9wZW5JZCB8fCBldmVudC5kYXRhLm9wZW5pZCB8fCBldmVudC51c2VySW5mby5vcGVuSWQ7XG5cbiAgICAgICAgICAgIGNvbnN0IGZlZXMkJDogYW55ID0gYXdhaXQgUHJvbWlzZS5hbGwoIFxuICAgICAgICAgICAgICAgIHRpZHMuc3BsaXQoJywnKVxuICAgICAgICAgICAgICAgICAgICAubWFwKCB0aWQgPT4gXG4gICAgICAgICAgICAgICAgICAgICAgICBkYi5jb2xsZWN0aW9uKCdkZWxpdmVyLWZlZScpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLndoZXJlKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGlkLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvcGVuaWRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5nZXQoIClcbiAgICAgICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgKTtcblxuICAgICAgICAgICAgY29uc3QgbWV0YSA9IGZlZXMkJFxuICAgICAgICAgICAgICAgIC5maWx0ZXIoIHggPT4gISF4LmRhdGFbIDAgXSlcbiAgICAgICAgICAgICAgICAubWFwKCB4ID0+IHguZGF0YVsgMCBdKVxuXG4gICAgICAgICAgICByZXR1cm4gY3R4LmJvZHkgPSB7XG4gICAgICAgICAgICAgICAgc3RhdHVzOiAyMDAsXG4gICAgICAgICAgICAgICAgZGF0YTogbWV0YVxuICAgICAgICAgICAgfVxuICAgICAgICB9IGNhdGNoICggZSApIHsgXG4gICAgICAgICAgICByZXR1cm4gY3R4LmJvZHkgPSB7IHN0YXR1czogNTAwIH07XG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgIHJldHVybiBhcHAuc2VydmUoICk7XG59Il19