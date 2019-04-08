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
cloud.init({
    env: process.env.cloud
});
var db = cloud.database();
exports.main = function (event, context) { return __awaiter(_this, void 0, void 0, function () {
    var app;
    var _this = this;
    return __generator(this, function (_a) {
        app = new TcbRouter({ event: event });
        app.router('list', function (ctx, next) { return __awaiter(_this, void 0, void 0, function () {
            var openid, meta$, goodsIds, goodsDetails$_1, cartInjectGoods, e_1;
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
                        goodsIds = Array.from(new Set(meta$.data.map(function (x) { return x.pid; }))).filter(function (x) { return !!x; });
                        return [4, Promise.all(goodsIds.map(function (goodsId) {
                                return cloud.callFunction({
                                    data: {
                                        data: {
                                            _id: goodsId,
                                        },
                                        $url: 'detail'
                                    },
                                    name: 'good'
                                }).then(function (res) {
                                    return res.result.data;
                                });
                            }))];
                    case 2:
                        goodsDetails$_1 = _a.sent();
                        cartInjectGoods = meta$.data.map(function (x) {
                            return {
                                cart: x,
                                detail: goodsDetails$_1.find(function (y) { return y._id === x.pid; })
                            };
                        });
                        return [2, ctx.body = {
                                status: 200,
                                data: cartInjectGoods
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSxpQkFvTEM7O0FBcExELHFDQUF1QztBQUN2QyxzQ0FBd0M7QUFFeEMsS0FBSyxDQUFDLElBQUksQ0FBQztJQUNQLEdBQUcsRUFBRSxPQUFPLENBQUMsR0FBRyxDQUFDLEtBQUs7Q0FDekIsQ0FBQyxDQUFDO0FBRUgsSUFBTSxFQUFFLEdBQWdCLEtBQUssQ0FBQyxRQUFRLEVBQUcsQ0FBQztBQWM3QixRQUFBLElBQUksR0FBRyxVQUFRLEtBQUssRUFBRSxPQUFPOzs7O1FBRWhDLEdBQUcsR0FBRyxJQUFJLFNBQVMsQ0FBQyxFQUFFLEtBQUssT0FBQSxFQUFFLENBQUMsQ0FBQztRQUVyQyxHQUFHLENBQUMsTUFBTSxDQUFDLE1BQU0sRUFBRSxVQUFPLEdBQUcsRUFBRSxJQUFJOzs7Ozs7d0JBR3JCLE1BQU0sR0FBRyxLQUFLLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQzt3QkFDdkIsV0FBTSxFQUFFLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQztpQ0FDeEIsS0FBSyxDQUFDO2dDQUNILE1BQU0sUUFBQTs2QkFDVCxDQUFDO2lDQUNELEdBQUcsRUFBRyxFQUFBOzt3QkFKakIsS0FBSyxHQUFHLFNBSVM7d0JBR2pCLFFBQVEsR0FBRyxLQUFLLENBQUMsSUFBSSxDQUN2QixJQUFJLEdBQUcsQ0FBRSxLQUFLLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBRSxVQUFBLENBQUMsSUFBSSxPQUFBLENBQUMsQ0FBQyxHQUFHLEVBQUwsQ0FBSyxDQUFFLENBQUMsQ0FDekMsQ0FBQyxNQUFNLENBQUUsVUFBQSxDQUFDLElBQUksT0FBQSxDQUFDLENBQUMsQ0FBQyxFQUFILENBQUcsQ0FBRSxDQUFDO3dCQUdDLFdBQU0sT0FBTyxDQUFDLEdBQUcsQ0FBRSxRQUFRLENBQUMsR0FBRyxD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QUFDLElBQUksQ0FBRSxDQUFDLENBQUUsQ0FBQyxHQUFHLENBQUM7OzRCQUc5QixXQUFPLEdBQUcsQ0FBQyxJQUFJLEdBQUc7NEJBQ2QsSUFBSSxFQUFFLEdBQUc7NEJBQ1QsTUFBTSxFQUFFLEdBQUc7eUJBQ2QsRUFBQzs7O3dCQUdGLFdBQU8sR0FBRyxDQUFDLElBQUksR0FBRztnQ0FDZCxNQUFNLEVBQUUsR0FBRztnQ0FDWCxPQUFPLEVBQUUsR0FBQzs2QkFDYixFQUFBOzs7O2FBRVIsQ0FBQyxDQUFDO1FBRUgsV0FBTyxHQUFHLENBQUMsS0FBSyxFQUFHLEVBQUM7O0tBRXZCLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBjbG91ZCBmcm9tICd3eC1zZXJ2ZXItc2RrJztcbmltcG9ydCAqIGFzIFRjYlJvdXRlciBmcm9tICd0Y2Itcm91dGVyJztcblxuY2xvdWQuaW5pdCh7XG4gICAgZW52OiBwcm9jZXNzLmVudi5jbG91ZFxufSk7XG5cbmNvbnN0IGRiOiBEQi5EYXRhYmFzZSA9IGNsb3VkLmRhdGFiYXNlKCApO1xuXG4vKipcbiAqXG4gKiBAZGVzY3JpcHRpb24g6LSt54mp6L2m5qih5Z2XXG4gKiAtLS0tLS0tLSDlrZfmrrUgLS0tLS0tLS0tLVxuICogICAgICBfaWRcbiAqICAgICAgb3BlbmlkXG4gKiAgICAgIHBpZDog5ZWG5ZOBaWRcbiAqICAgICAgY291bnQ6IOmAiei0reaVsOmHj1xuICogICAgICBzdGFuZGFyZF9pZDog5Z6L5Y+3aWRcbiAqICAgICAgY3VycmVudF9wcmljZTog5b2T5pe255qE5Lu35qC8XG4gKiAgICAgIGFjaWQ6IOW9k+aXtuWVhuWTgeeahOS4gOWPo+S7t2lkXG4gKi9cbmV4cG9ydCBjb25zdCBtYWluID0gYXN5bmMgKCBldmVudCwgY29udGV4dCApID0+IHtcblxuICAgIGNvbnN0IGFwcCA9IG5ldyBUY2JSb3V0ZXIoeyBldmVudCB9KTtcblxuICAgIGFwcC5yb3V0ZXIoJ2xpc3QnLCBhc3luYyggY3R4LCBuZXh0ICkgPT4ge1xuICAgICAgICB0cnkge1xuXG4gICAgICAgICAgICBjb25zdCBvcGVuaWQgPSBldmVudC51c2VySW5mby5vcGVuSWQ7XG4gICAgICAgICAgICBjb25zdCBtZXRhJCA9IGF3YWl0IGRiLmNvbGxlY3Rpb24oJ2NhcnQnKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC53aGVyZSh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9wZW5pZFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLmdldCggKTtcblxuXG4gICAgICAgICAgICBjb25zdCBnb29kc0lkcyA9IEFycmF5LmZyb20oXG4gICAgICAgICAgICAgICAgbmV3IFNldCggbWV0YSQuZGF0YS5tYXAoIHggPT4geC5waWQgKSlcbiAgICAgICAgICAgICkuZmlsdGVyKCB4ID0+ICEheCApO1xuXG4gICAgICAgICAgICAvLyDpnIDopoHmn6Xor6Ig5ZWG5ZOB6K+m5oOFXG4gICAgICAgICAgICBjb25zdCBnb29kc0RldGFpbHMkID0gYXdhaXQgUHJvbWlzZS5hbGwoIGdvb2RzSWRzLm1hcCggZ29vZHNJZCA9PiB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGNsb3VkLmNhbGxGdW5jdGlvbih7XG4gICAgICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBfaWQ6IGdvb2RzSWQsXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgJHVybDogJ2RldGFpbCdcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgbmFtZTogJ2dvb2QnXG4gICAgICAgICAgICAgICAgfSkudGhlbiggcmVzID0+IHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHJlcy5yZXN1bHQuZGF0YTtcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgfSkpO1xuXG4gICAgICAgICAgICBjb25zdCBjYXJ0SW5qZWN0R29vZHMgPSBtZXRhJC5kYXRhLm1hcCggeCA9PiB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICAgICAgY2FydDogeCxcbiAgICAgICAgICAgICAgICAgICAgZGV0YWlsOiBnb29kc0RldGFpbHMkLmZpbmQoIHkgPT4gIHkuX2lkID09PSB4LnBpZCApXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIHJldHVybiBjdHguYm9keSA9IHtcbiAgICAgICAgICAgICAgICBzdGF0dXM6IDIwMCxcbiAgICAgICAgICAgICAgICBkYXRhOiBjYXJ0SW5qZWN0R29vZHNcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgfSBjYXRjaCAoIGUgKSB7XG4gICAgICAgICAgICByZXR1cm4gY3R4LmJvZHkgPSB7XG4gICAgICAgICAgICAgICAgc3RhdHVzOiA1MDAsXG4gICAgICAgICAgICAgICAgbWVzc2FnZTogZVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICBhcHAucm91dGVyKCdkZWxldGUnLCBhc3luYyggY3R4LCBuZXh0ICkgPT4ge1xuICAgICAgICB0cnkge1xuXG4gICAgICAgICAgICBjb25zdCBpZEFyciA9IGV2ZW50LmRhdGEuaWRzLnNwbGl0KCcsJylcbiAgICAgICAgICAgIGF3YWl0IFByb21pc2UuYWxsKCBpZEFyci5tYXAoIGlkID0+IHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZGIuY29sbGVjdGlvbignY2FydCcpXG4gICAgICAgICAgICAgICAgICAgICAgICAud2hlcmUoe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIF9pZDogaWRcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgICAgICAucmVtb3ZlKCApO1xuICAgICAgICAgICAgfSkpO1xuXG4gICAgICAgICAgICByZXR1cm4gY3R4LmJvZHkgPSB7XG4gICAgICAgICAgICAgICAgc3RhdHVzOiAyMDBcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgfSBjYXRjaCAoIGUgKSB7XG4gICAgICAgICAgICByZXR1cm4gY3R4LmJvZHkgPSB7XG4gICAgICAgICAgICAgICAgc3RhdHVzOiA1MDAsXG4gICAgICAgICAgICAgICAgbWVzc2FnZTogZVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICBhcHAucm91dGVyKCd1cGRhdGUnLCBhc3luYyggY3R4LCBuZXh0ICkgPT4ge1xuICAgICAgICB0cnkge1xuXG4gICAgICAgICAgICBjb25zdCBvcGVuaWQgPSBldmVudC51c2VySW5mby5vcGVuSWQ7XG4gICAgICAgICAgICBjb25zdCB7IF9pZCwgc3RhbmRhcmRfaWQsIGN1cnJlbnRfcHJpY2UsIGNvdW50LCBwaWQgfSA9IGV2ZW50LmRhdGE7XG4gICAgXG4gICAgICAgICAgICBhd2FpdCBkYi5jb2xsZWN0aW9uKCdjYXJ0JykuZG9jKCBfaWQgKVxuICAgICAgICAgICAgICAgICAgICAuc2V0KHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwaWQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY291bnQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb3BlbmlkLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0YW5kYXJkX2lkLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGN1cnJlbnRfcHJpY2VcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHJldHVybiBjdHguYm9keSA9IHtcbiAgICAgICAgICAgICAgICBfaWQsXG4gICAgICAgICAgICAgICAgc3RhdHVzOiAyMDBcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgfSBjYXRjaCAoIGUgKSB7XG4gICAgICAgICAgICByZXR1cm4gY3R4LmJvZHkgPSB7XG4gICAgICAgICAgICAgICAgc3RhdHVzOiA1MDAsXG4gICAgICAgICAgICAgICAgbWVzc2FnZTogZVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICBhcHAucm91dGVyKCdlZGl0JywgYXN5bmMoIGN0eCwgbmV4dCApID0+IHtcbiAgICAgICAgdHJ5IHtcblxuICAgICAgICAgICAgbGV0IF9pZDogYW55ID0gJyc7XG4gICAgICAgICAgICBsZXQgeyBwaWQsIHN0YW5kYXJkX2lkIH0gPSBldmVudC5kYXRhO1xuICAgICAgICAgICAgY29uc3Qgb3BlbmlkID0gZXZlbnQudXNlckluZm8ub3BlbklkO1xuXG4gICAgICAgICAgICAvLyDlhYjnlKhzaWQgKyBwaWTmn6Xor6LmnInmsqHmnInlt7LmnInnmoRjYXJ077yM5pyJ5YiZ5pu05paw77yM5peg5YiZ5Yib5bu6XG4gICAgICAgICAgICBjb25zdCBmaW5kJCA9IGF3YWl0IGRiLmNvbGxlY3Rpb24oJ2NhcnQnKVxuICAgICAgICAgICAgICAgICAgICAud2hlcmUoe1xuICAgICAgICAgICAgICAgICAgICAgICAgcGlkLFxuICAgICAgICAgICAgICAgICAgICAgICAgb3BlbmlkLFxuICAgICAgICAgICAgICAgICAgICAgICAgc3RhbmRhcmRfaWQsXG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgIC5nZXQoICk7XG4gICAgICAgICAgICBjb25zdCByZXN1bHQgPSBmaW5kJC5kYXRhWyAwIF07XG5cbiAgICAgICAgXG4gICAgICAgICAgICBpZiAoICFyZXN1bHQgKSB7XG4gICAgICAgICAgICAgICAgLy8g5Yib5bu6XG4gICAgICAgICAgICAgICAgY29uc3QgY3JlYXRlJCA9IGF3YWl0IGRiLmNvbGxlY3Rpb24oJ2NhcnQnKS5hZGQoe1xuICAgICAgICAgICAgICAgICAgICBkYXRhOiBPYmplY3QuYXNzaWduKHsgfSwgZXZlbnQuZGF0YSwge1xuICAgICAgICAgICAgICAgICAgICAgICAgb3BlbmlkXG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgXG4gICAgICAgICAgICAgICAgX2lkID0gY3JlYXRlJC5faWQ7XG4gICAgXG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIC8vIOe8lui+kVxuICAgICAgICAgICAgICAgIGF3YWl0IGRiLmNvbGxlY3Rpb24oJ2NhcnQnKS5kb2MoIChyZXN1bHQgYXMgYW55KS5faWQgKS51cGRhdGUoe1xuICAgICAgICAgICAgICAgICAgICBkYXRhOiBldmVudC5kYXRhXG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICBfaWQgPSBmaW5kJC5kYXRhWyAwIF0uX2lkO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gY3R4LmJvZHkgPSB7XG4gICAgICAgICAgICAgICAgZGF0YTogX2lkLFxuICAgICAgICAgICAgICAgIHN0YXR1czogMjAwXG4gICAgICAgICAgICB9O1xuXG4gICAgICAgIH0gY2F0Y2ggKCBlICkge1xuICAgICAgICAgICAgcmV0dXJuIGN0eC5ib2R5ID0ge1xuICAgICAgICAgICAgICAgIHN0YXR1czogNTAwLFxuICAgICAgICAgICAgICAgIG1lc3NhZ2U6IGVcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgcmV0dXJuIGFwcC5zZXJ2ZSggKTtcblxufSJdfQ==