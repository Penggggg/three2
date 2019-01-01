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
                                        data: {
                                            _id: cart.pid,
                                        },
                                        $url: 'detail'
                                    },
                                    name: 'good'
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSxpQkF5S0M7O0FBektELHFDQUF1QztBQUN2QyxzQ0FBd0M7QUFFeEMsS0FBSyxDQUFDLElBQUksRUFBRyxDQUFDO0FBRWQsSUFBTSxFQUFFLEdBQWdCLEtBQUssQ0FBQyxRQUFRLEVBQUcsQ0FBQztBQWM3QixRQUFBLElBQUksR0FBRyxVQUFRLEtBQUssRUFBRSxPQUFPOzs7O1FBRWhDLEdBQUcsR0FBRyxJQUFJLFNBQVMsQ0FBQyxFQUFFLEtBQUssT0FBQSxFQUFFLENBQUMsQ0FBQztRQUVyQyxHQUFHLENBQUMsTUFBTSxDQUFDLE1BQU0sRUFBRSxVQUFPLEdBQUcsRUFBRSxJQUFJOzs7Ozs7d0JBR3JCLE1BQU0sR0FBRyxLQUFLLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQzt3QkFDdkIsV0FBTSxFQUFFLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQztpQ0FDeEIsS0FBSyxDQUFDO2dDQUNILE1BQU0sUUFBQTs2QkFDVCxDQUFDO2lDQUNELEdBQUcsRUFBRyxFQUFBOzt3QkFKakIsS0FBSyxHQUFHLFNBSVM7d0JBR0QsV0FBTSxPQUFPLENBQUMsR0FBRyxDQUFFLEtBQUssQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFFLFVBQUEsSUFBSTtnQ0FDekQsT0FBTyxLQUFLLENBQUMsWUFBWSxDQUFDO29DQUN0QixJQUFJLEVBQUU7d0NBQ0YsSUFBSSxFQUFFOzRDQUNGLEdBQUcsRUFBRSxJQUFJLENBQUMsR0FBRzt5Q0FDaEI7d0NBQ0QsSUFBSSxFQUFFLFFBQVE7cUNBQ2pCO29DQUNELElBQUksRUFBRSxNQUFNO2lDQUNmLENBQUMsQ0FBQyxJQUFJLENBQUUsVUFBQSxHQUFHO29DQUNSLE9BQU87d0NBQ0gsSUFBSSxNQUFBO3dDQUNKLE1BQU0sRUFBRSxHQUFHLENBQUMs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LEtBQUssQ0FBQyxJQUFJLENBQUUsQ0FBQyxDQUFFLENBQUM7NkJBRzFCLENBQUMsTUFBTSxFQUFQLGNBQU87d0JBRVEsV0FBTSxFQUFFLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQyxDQUFDLEdBQUcsQ0FBQztnQ0FDNUMsSUFBSSxFQUFFLE1BQU0sQ0FBQyxNQUFNLENBQUMsRUFBRyxFQUFFLEtBQUssQ0FBQyxJQUFJLEVBQUU7b0NBQ2pDLE1BQU0sUUFBQTtpQ0FDVCxDQUFDOzZCQUNMLENBQUMsRUFBQTs7d0JBSkksT0FBTyxHQUFHLFNBSWQ7d0JBRUYsR0FBRyxHQUFHLE9BQU8sQ0FBQyxHQUFHLENBQUM7OzRCQUlsQixXQUFNLEVBQUUsQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDLENBQUMsR0FBRyxDQUFHLE1BQWMsQ0FBQyxHQUFHLENBQUUsQ0FBQyxNQUFNLENBQUM7NEJBQzFELElBQUksRUFBRSxLQUFLLENBQUMsSUFBSTt5QkFDbkIsQ0FBQyxFQUFBOzt3QkFGRixTQUVFLENBQUE7d0JBQ0YsR0FBRyxHQUFHLEtBQUssQ0FBQyxJQUFJLENBQUUsQ0FBQyxDQUFFLENBQUMsR0FBRyxDQUFDOzs0QkFHOUIsV0FBTyxHQUFHLENBQUMsSUFBSSxHQUFHOzRCQUNkLElBQUksRUFBRSxHQUFHOzRCQUNULE1BQU0sRUFBRSxHQUFHO3lCQUNkLEVBQUM7Ozt3QkFHRixXQUFPLEdBQUcsQ0FBQyxJQUFJLEdBQUc7Z0NBQ2QsTUFBTSxFQUFFLEdBQUc7Z0NBQ1gsT0FBTyxFQUFFLEdBQUM7NkJBQ2IsRUFBQTs7OzthQUVSLENBQUMsQ0FBQztRQUVILFdBQU8sR0FBRyxDQUFDLEtBQUssRUFBRyxFQUFDOztLQUV2QixDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgY2xvdWQgZnJvbSAnd3gtc2VydmVyLXNkayc7XG5pbXBvcnQgKiBhcyBUY2JSb3V0ZXIgZnJvbSAndGNiLXJvdXRlcic7XG5cbmNsb3VkLmluaXQoICk7XG5cbmNvbnN0IGRiOiBEQi5EYXRhYmFzZSA9IGNsb3VkLmRhdGFiYXNlKCApO1xuXG4vKipcbiAqXG4gKiBAZGVzY3JpcHRpb24g6LSt54mp6L2m5qih5Z2XXG4gKiAtLS0tLS0tLSDlrZfmrrUgLS0tLS0tLS0tLVxuICogICAgICBfaWRcbiAqICAgICAgb3BlbmlkXG4gKiAgICAgIHBpZDog5ZWG5ZOBaWRcbiAqICAgICAgY291bnQ6IOmAiei0reaVsOmHj1xuICogICAgICBzdGFuZGFyZF9pZDog5Z6L5Y+3aWRcbiAqICAgICAgY3VycmVudF9wcmljZTog5b2T5pe255qE5Lu35qC8XG5cbiAqL1xuZXhwb3J0IGNvbnN0IG1haW4gPSBhc3luYyAoIGV2ZW50LCBjb250ZXh0ICkgPT4ge1xuXG4gICAgY29uc3QgYXBwID0gbmV3IFRjYlJvdXRlcih7IGV2ZW50IH0pO1xuXG4gICAgYXBwLnJvdXRlcignbGlzdCcsIGFzeW5jKCBjdHgsIG5leHQgKSA9PiB7XG4gICAgICAgIHRyeSB7XG5cbiAgICAgICAgICAgIGNvbnN0IG9wZW5pZCA9IGV2ZW50LnVzZXJJbmZvLm9wZW5JZDtcbiAgICAgICAgICAgIGNvbnN0IG1ldGEkID0gYXdhaXQgZGIuY29sbGVjdGlvbignY2FydCcpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLndoZXJlKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb3BlbmlkXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAuZ2V0KCApO1xuXG4gICAgICAgICAgICAvLyDpnIDopoHmn6Xor6Ig5ZWG5ZOB6K+m5oOFXG4gICAgICAgICAgICBjb25zdCBnb29kc0RldGFpbHMkID0gYXdhaXQgUHJvbWlzZS5hbGwoIG1ldGEkLmRhdGEubWFwKCBjYXJ0ID0+IHtcbiAgICAgICAgICAgICAgICByZXR1cm4gY2xvdWQuY2FsbEZ1bmN0aW9uKHtcbiAgICAgICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIF9pZDogY2FydC5waWQsXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgJHVybDogJ2RldGFpbCdcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgbmFtZTogJ2dvb2QnXG4gICAgICAgICAgICAgICAgfSkudGhlbiggcmVzID0+IHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhcnQsXG4gICAgICAgICAgICAgICAgICAgICAgICBkZXRhaWw6IHJlcy5yZXN1bHQuZGF0YVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIH0pKTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgcmV0dXJuIGN0eC5ib2R5ID0ge1xuICAgICAgICAgICAgICAgIHN0YXR1czogMjAwLFxuICAgICAgICAgICAgICAgIGRhdGE6IGdvb2RzRGV0YWlscyRcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgfSBjYXRjaCAoIGUgKSB7XG4gICAgICAgICAgICByZXR1cm4gY3R4LmJvZHkgPSB7XG4gICAgICAgICAgICAgICAgc3RhdHVzOiA1MDAsXG4gICAgICAgICAgICAgICAgbWVzc2FnZTogZVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICBhcHAucm91dGVyKCdkZWxldGUnLCBhc3luYyggY3R4LCBuZXh0ICkgPT4ge1xuICAgICAgICB0cnkge1xuXG4gICAgICAgICAgICBjb25zdCBpZEFyciA9IGV2ZW50LmRhdGEuaWRzLnNwbGl0KCcsJylcbiAgICAgICAgICAgIGF3YWl0IFByb21pc2UuYWxsKCBpZEFyci5tYXAoIGlkID0+IHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZGIuY29sbGVjdGlvbignY2FydCcpXG4gICAgICAgICAgICAgICAgICAgICAgICAud2hlcmUoe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIF9pZDogaWRcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgICAgICAucmVtb3ZlKCApO1xuICAgICAgICAgICAgfSkpO1xuXG4gICAgICAgICAgICByZXR1cm4gY3R4LmJvZHkgPSB7XG4gICAgICAgICAgICAgICAgc3RhdHVzOiAyMDBcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgfSBjYXRjaCAoIGUgKSB7XG4gICAgICAgICAgICByZXR1cm4gY3R4LmJvZHkgPSB7XG4gICAgICAgICAgICAgICAgc3RhdHVzOiA1MDAsXG4gICAgICAgICAgICAgICAgbWVzc2FnZTogZVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICBhcHAucm91dGVyKCd1cGRhdGUnLCBhc3luYyggY3R4LCBuZXh0ICkgPT4ge1xuICAgICAgICB0cnkge1xuXG4gICAgICAgICAgICBjb25zdCBvcGVuaWQgPSBldmVudC51c2VySW5mby5vcGVuSWQ7XG4gICAgICAgICAgICBjb25zdCB7IF9pZCwgc3RhbmRhcmRfaWQsIGN1cnJlbnRfcHJpY2UsIGNvdW50LCBwaWQgfSA9IGV2ZW50LmRhdGE7XG4gICAgXG4gICAgICAgICAgICBhd2FpdCBkYi5jb2xsZWN0aW9uKCdjYXJ0JykuZG9jKCBfaWQgKVxuICAgICAgICAgICAgICAgICAgICAuc2V0KHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwaWQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY291bnQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb3BlbmlkLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0YW5kYXJkX2lkLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGN1cnJlbnRfcHJpY2VcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHJldHVybiBjdHguYm9keSA9IHtcbiAgICAgICAgICAgICAgICBfaWQsXG4gICAgICAgICAgICAgICAgc3RhdHVzOiAyMDBcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgfSBjYXRjaCAoIGUgKSB7XG4gICAgICAgICAgICByZXR1cm4gY3R4LmJvZHkgPSB7XG4gICAgICAgICAgICAgICAgc3RhdHVzOiA1MDAsXG4gICAgICAgICAgICAgICAgbWVzc2FnZTogZVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICBhcHAucm91dGVyKCdlZGl0JywgYXN5bmMoIGN0eCwgbmV4dCApID0+IHtcbiAgICAgICAgdHJ5IHtcblxuICAgICAgICAgICAgbGV0IF9pZDogYW55ID0gJyc7XG4gICAgICAgICAgICBsZXQgeyBwaWQsIHN0YW5kYXJkX2lkIH0gPSBldmVudC5kYXRhO1xuICAgICAgICAgICAgY29uc3Qgb3BlbmlkID0gZXZlbnQudXNlckluZm8ub3BlbklkO1xuXG4gICAgICAgICAgICAvLyDlhYjnlKhzaWQgKyBwaWTmn6Xor6LmnInmsqHmnInlt7LmnInnmoRjYXJ077yM5pyJ5YiZ5pu05paw77yM5peg5YiZ5Yib5bu6XG4gICAgICAgICAgICBjb25zdCBmaW5kJCA9IGF3YWl0IGRiLmNvbGxlY3Rpb24oJ2NhcnQnKVxuICAgICAgICAgICAgICAgICAgICAud2hlcmUoe1xuICAgICAgICAgICAgICAgICAgICAgICAgcGlkLFxuICAgICAgICAgICAgICAgICAgICAgICAgb3BlbmlkLFxuICAgICAgICAgICAgICAgICAgICAgICAgc3RhbmRhcmRfaWQsXG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgIC5nZXQoICk7XG4gICAgICAgICAgICBjb25zdCByZXN1bHQgPSBmaW5kJC5kYXRhWyAwIF07XG5cbiAgICAgICAgXG4gICAgICAgICAgICBpZiAoICFyZXN1bHQgKSB7XG4gICAgICAgICAgICAgICAgLy8g5Yib5bu6XG4gICAgICAgICAgICAgICAgY29uc3QgY3JlYXRlJCA9IGF3YWl0IGRiLmNvbGxlY3Rpb24oJ2NhcnQnKS5hZGQoe1xuICAgICAgICAgICAgICAgICAgICBkYXRhOiBPYmplY3QuYXNzaWduKHsgfSwgZXZlbnQuZGF0YSwge1xuICAgICAgICAgICAgICAgICAgICAgICAgb3BlbmlkXG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgXG4gICAgICAgICAgICAgICAgX2lkID0gY3JlYXRlJC5faWQ7XG4gICAgXG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIC8vIOe8lui+kVxuICAgICAgICAgICAgICAgIGF3YWl0IGRiLmNvbGxlY3Rpb24oJ2NhcnQnKS5kb2MoIChyZXN1bHQgYXMgYW55KS5faWQgKS51cGRhdGUoe1xuICAgICAgICAgICAgICAgICAgICBkYXRhOiBldmVudC5kYXRhXG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICBfaWQgPSBmaW5kJC5kYXRhWyAwIF0uX2lkO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gY3R4LmJvZHkgPSB7XG4gICAgICAgICAgICAgICAgZGF0YTogX2lkLFxuICAgICAgICAgICAgICAgIHN0YXR1czogMjAwXG4gICAgICAgICAgICB9O1xuXG4gICAgICAgIH0gY2F0Y2ggKCBlICkge1xuICAgICAgICAgICAgcmV0dXJuIGN0eC5ib2R5ID0ge1xuICAgICAgICAgICAgICAgIHN0YXR1czogNTAwLFxuICAgICAgICAgICAgICAgIG1lc3NhZ2U6IGVcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgcmV0dXJuIGFwcC5zZXJ2ZSggKTtcblxufSJdfQ==