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
var TcbRouter = require("tcb-router");
cloud.init();
var db = cloud.database();
exports.main = function (event, context) { return __awaiter(_this, void 0, void 0, function () {
    var app;
    var _this = this;
    return __generator(this, function (_a) {
        app = new TcbRouter({ event: event });
        app.router('list', function (ctx, next) { return __awaiter(_this, void 0, void 0, function () {
            var openid, meta$, goodsDetails$, e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        openid = event.userInfo.openId;
                        return [4, db.collection('cart')
                                .where({
                                openid: openid
                            })
                                .get()];
                    case 1:
                        meta$ = _a.sent();
                        return [4, Promise.all(meta$.data.map(function (cart) {
                                return cloud.callFunction({
                                    data: {
                                        _id: cart.pid
                                    },
                                    name: 'api-goods-detail'
                                }).then(function (res) {
                                    return {
                                        cart: cart,
                                        detail: res.result.data
                                    };
                                });
                            }))];
                    case 2:
                        goodsDetails$ = _a.sent();
                        return [2, ctx.body = {
                                status: 200,
                                data: goodsDetails$
                            }];
                    case 3:
                        e_1 = _a.sent();
                        return [2, ctx.body = {
                                status: 500,
                                message: e_1
                            }];
                    case 4: return [2];
                }
            });
        }); });
        app.router('delete', function (ctx, next) { return __awaiter(_this, void 0, void 0, function () {
            var idArr, e_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        idArr = event.data.ids.split(',');
                        return [4, Promise.all(idArr.map(function (id) {
                                return db.collection('cart')
                                    .where({
                                    _id: id
                                })
                                    .remove();
                            }))];
                    case 1:
                        _a.sent();
                        return [2, ctx.body = {
                                status: 200
                            }];
                    case 2:
                        e_2 = _a.sent();
                        return [2, ctx.body = {
                                status: 500,
                                message: e_2
                            }];
                    case 3: return [2];
                }
            });
        }); });
        app.router('update', function (ctx, next) { return __awaiter(_this, void 0, void 0, function () {
            var openid, _a, _id, standard_id, current_price, count, pid, e_3;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        openid = event.userInfo.openId;
                        _a = event.data, _id = _a._id, standard_id = _a.standard_id, current_price = _a.current_price, count = _a.count, pid = _a.pid;
                        return [4, db.collection('cart').doc(_id)
                                .set({
                                data: {
                                    pid: pid,
                                    count: count,
                                    openid: openid,
                                    standard_id: standard_id,
                                    current_price: current_price
                                }
                            })];
                    case 1:
                        _b.sent();
                        return [2, ctx.body = {
                                _id: _id,
                                status: 200
                            }];
                    case 2:
                        e_3 = _b.sent();
                        return [2, ctx.body = {
                                status: 500,
                                message: e_3
                            }];
                    case 3: return [2];
                }
            });
        }); });
        app.router('edit', function (ctx, next) { return __awaiter(_this, void 0, void 0, function () {
            var _id, _a, pid, standard_id, openid, find$, result, create$, e_4;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 6, , 7]);
                        _id = '';
                        _a = event.data, pid = _a.pid, standard_id = _a.standard_id;
                        openid = event.userInfo.openId;
                        return [4, db.collection('cart')
                                .where({
                                pid: pid,
                                openid: openid,
                                standard_id: standard_id,
                            })
                                .get()];
                    case 1:
                        find$ = _b.sent();
                        result = find$.data[0];
                        if (!!result) return [3, 3];
                        return [4, db.collection('cart').add({
                                data: Object.assign({}, event.data, {
                                    openid: openid
                                })
                            })];
                    case 2:
                        create$ = _b.sent();
                        _id = create$._id;
                        return [3, 5];
                    case 3: return [4, db.collection('cart').doc(result._id).update({
                            data: event.data
                        })];
                    case 4:
                        _b.sent();
                        _id = find$.data[0]._id;
                        _b.label = 5;
                    case 5: return [2, ctx.body = {
                            data: _id,
                            status: 200
                        }];
                    case 6:
                        e_4 = _b.sent();
                        return [2, ctx.body = {
                                status: 500,
                                message: e_4
                            }];
                    case 7: return [2];
                }
            });
        }); });
        return [2, app.serve()];
    });
}); };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSxpQkFzS0M7O0FBdEtELHFDQUF1QztBQUN2QyxzQ0FBd0M7QUFFeEMsS0FBSyxDQUFDLElBQUksRUFBRyxDQUFDO0FBRWQsSUFBTSxFQUFFLEdBQWdCLEtBQUssQ0FBQyxRQUFRLEVBQUcsQ0FBQztBQWM3QixRQUFBLElBQUksR0FBRyxVQUFRLEtBQUssRUFBRSxPQUFPOzs7O1FBRWhDLEdBQUcsR0FBRyxJQUFJLFNBQVMsQ0FBQyxFQUFFLEtBQUssT0FBQSxFQUFFLENBQUMsQ0FBQztRQUVyQyxHQUFHLENBQUMsTUFBTSxDQUFDLE1BQU0sRUFBRSxVQUFPLEdBQUcsRUFBRSxJQUFJOzs7Ozs7d0JBR3JCLE1BQU0sR0FBRyxLQUFLLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQzt3QkFDdkIsV0FBTSxFQUFFLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQztpQ0FDeEIsS0FBSyxDQUFDO2dDQUNILE1BQU0sUUFBQTs2QkFDVCxDQUFDO2lDQUNELEdBQUcsRUFBRyxFQUFBOzt3QkFKakIsS0FBSyxHQUFHLFNBSVM7d0JBR0QsV0FBTSxPQUFPLENBQUMsR0FBRyxDQUFFLEtBQUssQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFFLFVBQUEsSUFBSTtnQ0FDekQsT0FBTyxLQUFLLENBQUMsWUFBWSxDQUFDO29DQUN0QixJQUFJLEVBQUU7d0NBQ0YsR0FBRyxFQUFFLElBQUksQ0FBQyxHQUFHO3FDQUNoQjtvQ0FDRCxJQUFJLEVBQUUsa0JBQWtCO2lDQUMzQixDQUFDLENBQUMsSUFBSSxDQUFFLFVBQUEsR0FBRztvQ0FDUixPQUFPO3dDQUNILElBQUksTUFBQTt3Q0FDSixNQUFNLEVBQUUsR0FBRyxDQUFDLE1BQU0sQ0FBQyxJQUFJO3FDQUMxQixDQUFBO2dDQUNMLENBQUMsQ0FB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QixDQUFDLE1BQU0sRUFBUCxjQUFPO3dCQUVRLFdBQU0sRUFBRSxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUMsQ0FBQyxHQUFHLENBQUM7Z0NBQzVDLElBQUksRUFBRSxNQUFNLENBQUMsTUFBTSxDQUFDLEVBQUcsRUFBRSxLQUFLLENBQUMsSUFBSSxFQUFFO29DQUNqQyxNQUFNLFFBQUE7aUNBQ1QsQ0FBQzs2QkFDTCxDQUFDLEVBQUE7O3dCQUpJLE9BQU8sR0FBRyxTQUlkO3dCQUVGLEdBQUcsR0FBRyxPQUFPLENBQUMsR0FBRyxDQUFDOzs0QkFJbEIsV0FBTSxFQUFFLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQyxDQUFDLEdBQUcsQ0FBRyxNQUFjLENBQUMsR0FBRyxDQUFFLENBQUMsTUFBTSxDQUFDOzRCQUMxRCxJQUFJLEVBQUUsS0FBSyxDQUFDLElBQUk7eUJBQ25CLENBQUMsRUFBQTs7d0JBRkYsU0FFRSxDQUFBO3dCQUNGLEdBQUcsR0FBRyxLQUFLLENBQUMsSUFBSSxDQUFFLENBQUMsQ0FBRSxDQUFDLEdBQUcsQ0FBQzs7NEJBRzlCLFdBQU8sR0FBRyxDQUFDLElBQUksR0FBRzs0QkFDZCxJQUFJLEVBQUUsR0FBRzs0QkFDVCxNQUFNLEVBQUUsR0FBRzt5QkFDZCxFQUFDOzs7d0JBR0YsV0FBTyxHQUFHLENBQUMsSUFBSSxHQUFHO2dDQUNkLE1BQU0sRUFBRSxHQUFHO2dDQUNYLE9BQU8sRUFBRSxHQUFDOzZCQUNiLEVBQUE7Ozs7YUFFUixDQUFDLENBQUM7UUFFSCxXQUFPLEdBQUcsQ0FBQyxLQUFLLEVBQUcsRUFBQzs7S0FFdkIsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIGNsb3VkIGZyb20gJ3d4LXNlcnZlci1zZGsnO1xuaW1wb3J0ICogYXMgVGNiUm91dGVyIGZyb20gJ3RjYi1yb3V0ZXInO1xuXG5jbG91ZC5pbml0KCApO1xuXG5jb25zdCBkYjogREIuRGF0YWJhc2UgPSBjbG91ZC5kYXRhYmFzZSggKTtcblxuLyoqXG4gKlxuICogQGRlc2NyaXB0aW9uIOi0reeJqei9puaooeWdl1xuICogLS0tLS0tLS0g5a2X5q61IC0tLS0tLS0tLS1cbiAqICAgICAgX2lkXG4gKiAgICAgIG9wZW5pZFxuICogICAgICBwaWQ6IOWVhuWTgWlkXG4gKiAgICAgIGNvdW50OiDpgInotK3mlbDph49cbiAqICAgICAgc3RhbmRhcmRfaWQ6IOWei+WPt2lkXG4gKiAgICAgIGN1cnJlbnRfcHJpY2U6IOW9k+aXtueahOS7t+agvFxuXG4gKi9cbmV4cG9ydCBjb25zdCBtYWluID0gYXN5bmMgKCBldmVudCwgY29udGV4dCApID0+IHtcblxuICAgIGNvbnN0IGFwcCA9IG5ldyBUY2JSb3V0ZXIoeyBldmVudCB9KTtcblxuICAgIGFwcC5yb3V0ZXIoJ2xpc3QnLCBhc3luYyggY3R4LCBuZXh0ICkgPT4ge1xuICAgICAgICB0cnkge1xuXG4gICAgICAgICAgICBjb25zdCBvcGVuaWQgPSBldmVudC51c2VySW5mby5vcGVuSWQ7XG4gICAgICAgICAgICBjb25zdCBtZXRhJCA9IGF3YWl0IGRiLmNvbGxlY3Rpb24oJ2NhcnQnKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC53aGVyZSh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9wZW5pZFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLmdldCggKTtcblxuICAgICAgICAgICAgLy8g6ZyA6KaB5p+l6K+iIOWVhuWTgeivpuaDhVxuICAgICAgICAgICAgY29uc3QgZ29vZHNEZXRhaWxzJCA9IGF3YWl0IFByb21pc2UuYWxsKCBtZXRhJC5kYXRhLm1hcCggY2FydCA9PiB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGNsb3VkLmNhbGxGdW5jdGlvbih7XG4gICAgICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIF9pZDogY2FydC5waWRcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgbmFtZTogJ2FwaS1nb29kcy1kZXRhaWwnXG4gICAgICAgICAgICAgICAgfSkudGhlbiggcmVzID0+IHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhcnQsXG4gICAgICAgICAgICAgICAgICAgICAgICBkZXRhaWw6IHJlcy5yZXN1bHQuZGF0YVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIH0pKTtcblxuICAgICAgICAgICAgcmV0dXJuIGN0eC5ib2R5ID0ge1xuICAgICAgICAgICAgICAgIHN0YXR1czogMjAwLFxuICAgICAgICAgICAgICAgIGRhdGE6IGdvb2RzRGV0YWlscyRcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgfSBjYXRjaCAoIGUgKSB7XG4gICAgICAgICAgICByZXR1cm4gY3R4LmJvZHkgPSB7XG4gICAgICAgICAgICAgICAgc3RhdHVzOiA1MDAsXG4gICAgICAgICAgICAgICAgbWVzc2FnZTogZVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICBhcHAucm91dGVyKCdkZWxldGUnLCBhc3luYyggY3R4LCBuZXh0ICkgPT4ge1xuICAgICAgICB0cnkge1xuXG4gICAgICAgICAgICBjb25zdCBpZEFyciA9IGV2ZW50LmRhdGEuaWRzLnNwbGl0KCcsJylcbiAgICAgICAgICAgIGF3YWl0IFByb21pc2UuYWxsKCBpZEFyci5tYXAoIGlkID0+IHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZGIuY29sbGVjdGlvbignY2FydCcpXG4gICAgICAgICAgICAgICAgICAgICAgICAud2hlcmUoe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIF9pZDogaWRcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgICAgICAucmVtb3ZlKCApO1xuICAgICAgICAgICAgfSkpO1xuXG4gICAgICAgICAgICByZXR1cm4gY3R4LmJvZHkgPSB7XG4gICAgICAgICAgICAgICAgc3RhdHVzOiAyMDBcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgfSBjYXRjaCAoIGUgKSB7XG4gICAgICAgICAgICByZXR1cm4gY3R4LmJvZHkgPSB7XG4gICAgICAgICAgICAgICAgc3RhdHVzOiA1MDAsXG4gICAgICAgICAgICAgICAgbWVzc2FnZTogZVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICBhcHAucm91dGVyKCd1cGRhdGUnLCBhc3luYyggY3R4LCBuZXh0ICkgPT4ge1xuICAgICAgICB0cnkge1xuXG4gICAgICAgICAgICBjb25zdCBvcGVuaWQgPSBldmVudC51c2VySW5mby5vcGVuSWQ7XG4gICAgICAgICAgICBjb25zdCB7IF9pZCwgc3RhbmRhcmRfaWQsIGN1cnJlbnRfcHJpY2UsIGNvdW50LCBwaWQgfSA9IGV2ZW50LmRhdGE7XG4gICAgXG4gICAgICAgICAgICBhd2FpdCBkYi5jb2xsZWN0aW9uKCdjYXJ0JykuZG9jKCBfaWQgKVxuICAgICAgICAgICAgICAgICAgICAuc2V0KHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwaWQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY291bnQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb3BlbmlkLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0YW5kYXJkX2lkLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGN1cnJlbnRfcHJpY2VcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHJldHVybiBjdHguYm9keSA9IHtcbiAgICAgICAgICAgICAgICBfaWQsXG4gICAgICAgICAgICAgICAgc3RhdHVzOiAyMDBcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgfSBjYXRjaCAoIGUgKSB7XG4gICAgICAgICAgICByZXR1cm4gY3R4LmJvZHkgPSB7XG4gICAgICAgICAgICAgICAgc3RhdHVzOiA1MDAsXG4gICAgICAgICAgICAgICAgbWVzc2FnZTogZVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICBhcHAucm91dGVyKCdlZGl0JywgYXN5bmMoIGN0eCwgbmV4dCApID0+IHtcbiAgICAgICAgdHJ5IHtcblxuICAgICAgICAgICAgbGV0IF9pZDogYW55ID0gJyc7XG4gICAgICAgICAgICBsZXQgeyBwaWQsIHN0YW5kYXJkX2lkIH0gPSBldmVudC5kYXRhO1xuICAgICAgICAgICAgY29uc3Qgb3BlbmlkID0gZXZlbnQudXNlckluZm8ub3BlbklkO1xuXG4gICAgICAgICAgICAvLyDlhYjnlKhzaWQgKyBwaWTmn6Xor6LmnInmsqHmnInlt7LmnInnmoRjYXJ077yM5pyJ5YiZ5pu05paw77yM5peg5YiZ5Yib5bu6XG4gICAgICAgICAgICBjb25zdCBmaW5kJCA9IGF3YWl0IGRiLmNvbGxlY3Rpb24oJ2NhcnQnKVxuICAgICAgICAgICAgICAgICAgICAud2hlcmUoe1xuICAgICAgICAgICAgICAgICAgICAgICAgcGlkLFxuICAgICAgICAgICAgICAgICAgICAgICAgb3BlbmlkLFxuICAgICAgICAgICAgICAgICAgICAgICAgc3RhbmRhcmRfaWQsXG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgIC5nZXQoICk7XG4gICAgICAgICAgICBjb25zdCByZXN1bHQgPSBmaW5kJC5kYXRhWyAwIF07XG5cbiAgICAgICAgXG4gICAgICAgICAgICBpZiAoICFyZXN1bHQgKSB7XG4gICAgICAgICAgICAgICAgLy8g5Yib5bu6XG4gICAgICAgICAgICAgICAgY29uc3QgY3JlYXRlJCA9IGF3YWl0IGRiLmNvbGxlY3Rpb24oJ2NhcnQnKS5hZGQoe1xuICAgICAgICAgICAgICAgICAgICBkYXRhOiBPYmplY3QuYXNzaWduKHsgfSwgZXZlbnQuZGF0YSwge1xuICAgICAgICAgICAgICAgICAgICAgICAgb3BlbmlkXG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgXG4gICAgICAgICAgICAgICAgX2lkID0gY3JlYXRlJC5faWQ7XG4gICAgXG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIC8vIOe8lui+kVxuICAgICAgICAgICAgICAgIGF3YWl0IGRiLmNvbGxlY3Rpb24oJ2NhcnQnKS5kb2MoIChyZXN1bHQgYXMgYW55KS5faWQgKS51cGRhdGUoe1xuICAgICAgICAgICAgICAgICAgICBkYXRhOiBldmVudC5kYXRhXG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICBfaWQgPSBmaW5kJC5kYXRhWyAwIF0uX2lkO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gY3R4LmJvZHkgPSB7XG4gICAgICAgICAgICAgICAgZGF0YTogX2lkLFxuICAgICAgICAgICAgICAgIHN0YXR1czogMjAwXG4gICAgICAgICAgICB9O1xuXG4gICAgICAgIH0gY2F0Y2ggKCBlICkge1xuICAgICAgICAgICAgcmV0dXJuIGN0eC5ib2R5ID0ge1xuICAgICAgICAgICAgICAgIHN0YXR1czogNTAwLFxuICAgICAgICAgICAgICAgIG1lc3NhZ2U6IGVcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgcmV0dXJuIGFwcC5zZXJ2ZSggKTtcblxufSJdfQ==