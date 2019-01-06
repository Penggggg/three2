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
        app.router('create', function (ctx, next) { return __awaiter(_this, void 0, void 0, function () {
            var openid, temp, add$, e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        openid = event.data.openId || event.userInfo.openId;
                        temp = Object.assign({}, event.data, {
                            openid: openid,
                            isUsed: false,
                            createTime: new Date().getTime()
                        });
                        return [4, db.collection('coupon')
                                .add({
                                data: temp
                            })];
                    case 1:
                        add$ = _a.sent();
                        return [2, ctx.body = {
                                status: 200,
                                data: add$._id
                            }];
                    case 2:
                        e_1 = _a.sent();
                        return [2, ctx.body = { status: 500 }];
                    case 3: return [2];
                }
            });
        }); });
        app.router('isget', function (ctx, next) { return __awaiter(_this, void 0, void 0, function () {
            var _a, tid, check, openid, trip$, trip, reduce_price_1, fullreduce_values_1, cashcoupon_values_1, lijain$_1, manjian$_1, daijin$_1, temp_1, e_2;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 5, , 6]);
                        _a = event.data, tid = _a.tid, check = _a.check;
                        openid = event.data.openId || event.userInfo.openId;
                        return [4, db.collection('trip')
                                .doc(tid)
                                .get()];
                    case 1:
                        trip$ = _b.sent();
                        trip = trip$.data;
                        reduce_price_1 = trip.reduce_price, fullreduce_values_1 = trip.fullreduce_values, cashcoupon_values_1 = trip.cashcoupon_values;
                        return [4, db.collection('coupon')
                                .where({
                                tid: tid,
                                openid: openid,
                                type: 't_lijain'
                            })
                                .get()];
                    case 2:
                        lijain$_1 = _b.sent();
                        return [4, db.collection('coupon')
                                .where({
                                tid: tid,
                                openid: openid,
                                type: 't_manjian'
                            })
                                .get()];
                    case 3:
                        manjian$_1 = _b.sent();
                        return [4, db.collection('coupon')
                                .where({
                                tid: tid,
                                openid: openid,
                                type: 't_daijin'
                            })
                                .get()];
                    case 4:
                        daijin$_1 = _b.sent();
                        temp_1 = {};
                        check.split(',').map(function (checkType) {
                            if (checkType === 't_manjian') {
                                temp_1[checkType] = !!fullreduce_values_1 ?
                                    manjian$_1.data.length === 0 ?
                                        false :
                                        true :
                                    null;
                            }
                            else if (checkType === 't_daijin') {
                                temp_1[checkType] = !!cashcoupon_values_1 ?
                                    daijin$_1.data.length === 0 ?
                                        false :
                                        true :
                                    null;
                            }
                            else if (checkType === 't_lijain') {
                                temp_1[checkType] = !!reduce_price_1 ?
                                    lijain$_1.data.length === 0 ?
                                        false :
                                        lijain$_1.data[0].value < reduce_price_1 ?
                                            'half' :
                                            true :
                                    null;
                            }
                        });
                        return [2, ctx.body = {
                                status: 200,
                                data: temp_1
                            }];
                    case 5:
                        e_2 = _b.sent();
                        return [2, ctx.body = { status: 500 }];
                    case 6: return [2];
                }
            });
        }); });
        return [2, app.serve()];
    });
}); };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSxpQkE4SkU7O0FBOUpGLHFDQUF1QztBQUN2QyxzQ0FBd0M7QUFFeEMsS0FBSyxDQUFDLElBQUksRUFBRyxDQUFDO0FBRWQsSUFBTSxFQUFFLEdBQWdCLEtBQUssQ0FBQyxRQUFRLEVBQUcsQ0FBQztBQWlCN0IsUUFBQSxJQUFJLEdBQUcsVUFBUSxLQUFLLEVBQUUsT0FBTzs7OztRQUVoQyxHQUFHLEdBQUcsSUFBSSxTQUFTLENBQUMsRUFBRSxLQUFLLE9BQUEsRUFBRSxDQUFDLENBQUM7UUFnQnJDLEdBQUcsQ0FBQyxNQUFNLENBQUMsUUFBUSxFQUFFLFVBQU8sR0FBRyxFQUFFLElBQUk7Ozs7Ozt3QkFHdkIsTUFBTSxHQUFHLEtBQUssQ0FBQyxJQUFJLENBQUMsTUFBTSxJQUFJLEtBQUssQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDO3dCQUNwRCxJQUFJLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQyxFQUFHLEVBQUUsS0FBSyxDQUFDLElBQUksRUFBRTs0QkFDeEMsTUFBTSxRQUFBOzRCQUNOLE1BQU0sRUFBRSxLQUFLOzRCQUNiLFVBQVUsRUFBRSxJQUFJLElBQUksRUFBRyxDQUFDLE9BQU8sRUFBRzt5QkFDckMsQ0FBQyxDQUFDO3dCQUVVLFdBQU0sRUFBRSxDQUFDLFVBQVUsQ0FBQyxRQUFRLENBQUM7aUNBQ3JDLEdBQUcsQ0FBQztnQ0FDRCxJQUFJLEVBQUUsSUFBSTs2QkFDYixDQUFDLEVBQUE7O3dCQUhBLElBQUksR0FBRyxTQUdQO3dCQUVOLFdBQU8sR0FBRyxDQUFDLElBQUksR0FBRztnQ0FDZCxNQUFNLEVBQUUsR0FBRztnQ0FDWCxJQUFJLEVBQUUsSUFBSSxDQUFDLEdBQUc7NkJBQ2pCLEVBQUE7Ozt3QkFDVyxXQUFPLEdBQUcsQ0FBQyxJQUFJLEdB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SSxHQUFHO2dDQUNkLE1BQU0sRUFBRSxHQUFHO2dDQUNYLElBQUksRUFBRSxNQUFJOzZCQUNiLEVBQUE7Ozt3QkFDVyxXQUFPLEdBQUcsQ0FBQyxJQUFJLEdBQUcsRUFBRSxNQUFNLEVBQUUsR0FBRyxFQUFFLEVBQUM7Ozs7YUFDckQsQ0FBQyxDQUFBO1FBR0YsV0FBTyxHQUFHLENBQUMsS0FBSyxFQUFHLEVBQUM7O0tBQ3ZCLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBjbG91ZCBmcm9tICd3eC1zZXJ2ZXItc2RrJztcbmltcG9ydCAqIGFzIFRjYlJvdXRlciBmcm9tICd0Y2Itcm91dGVyJztcblxuY2xvdWQuaW5pdCggKTtcblxuY29uc3QgZGI6IERCLkRhdGFiYXNlID0gY2xvdWQuZGF0YWJhc2UoICk7XG5cbi8qKlxuICpcbiAqIEBkZXNjcmlwdGlvbiDljaHliLjmqKHlnZdcbiAqIC0tLS0tLS0tIOWtl+autSAtLS0tLS0tLS0tXG4gKiB0aWQg6aKG5Y+W6K+l5LyY5oOg5Yi455qE5omA5bGe6KGM56iLXG4gKiB0eXBlOiAndF9saWphaW4nIHwgJ3RfbWFuamlhbicgfCAndF9kYWlqaW4nIOWIuOexu+Wei++8muihjOeoi+eri+WHj+OAgeihjOeoi+a7oeWHj+OAgeihjOeoi+S7o+mHkeWIuFxuICogaXNVc2VkOiDmmK/lkKblt7LnlKhcbiAqIG9wZW5pZFxuICogY2FuVXNlSW5OZXh0OiDmmK/lkKbkuIvotp/lj6/nlKhcbiAqIGF0bGVhc3Q6IOa2iOi0uemXqOanm1xuICogdmFsdWXvvJrmtojotLnkvJjmg6Dpop3luqZcbiAqISB2YWxpdGVybTog5pyJ5pWI5pyf5pel5pyfKOWPr+aXoClcbiAqIGNyZWF0ZVRpbWUg5Yib5bu65pel5pyfXG4gKiByZWR1Y2VfdHlwZTogJ3l1YW4nIHwgJ3BlcmNlbnQnIOS8mOaDoOexu+Wei++8muWFg+OAgeaKmOaJo1xuICovXG5leHBvcnQgY29uc3QgbWFpbiA9IGFzeW5jICggZXZlbnQsIGNvbnRleHQgKSA9PiB7XG5cbiAgICBjb25zdCBhcHAgPSBuZXcgVGNiUm91dGVyKHsgZXZlbnQgfSk7XG5cbiAgICAvKipcbiAgICAgKiBAZGVzY3JpcHRpb24g5Yib5bu65LyY5oOg5Yi4XG4gICAgICogLS0tLS0tLS0g6K+35rGCIC0tLS0tLS0tLVxuICAgICAqIHtcbiAgICAgKiAgIHRpZFxuICAgICAqICAgb3BlbmlkICBcbiAgICAgKiAgIHR5cGVcbiAgICAgKiAgIGNhblVzZUluTmV4dFxuICAgICAqICAgZnVsbHJlZHVjZV9hdGxlYXN0XG4gICAgICogICBmdWxscmVkdWNlX3ZhbHVlc1xuICAgICAqICAgdmFsaXRlcm1cbiAgICAgKiAgIHJlZHVjZV90eXBlXG4gICAgICogfVxuICAgICAqL1xuICAgIGFwcC5yb3V0ZXIoJ2NyZWF0ZScsIGFzeW5jKCBjdHgsIG5leHQgKSA9PiB7XG4gICAgICAgIHRyeSB7XG5cbiAgICAgICAgICAgIGNvbnN0IG9wZW5pZCA9IGV2ZW50LmRhdGEub3BlbklkIHx8IGV2ZW50LnVzZXJJbmZvLm9wZW5JZDtcbiAgICAgICAgICAgIGNvbnN0IHRlbXAgPSBPYmplY3QuYXNzaWduKHsgfSwgZXZlbnQuZGF0YSwge1xuICAgICAgICAgICAgICAgIG9wZW5pZCxcbiAgICAgICAgICAgICAgICBpc1VzZWQ6IGZhbHNlLFxuICAgICAgICAgICAgICAgIGNyZWF0ZVRpbWU6IG5ldyBEYXRlKCApLmdldFRpbWUoIClcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBjb25zdCBhZGQkID0gYXdhaXQgZGIuY29sbGVjdGlvbignY291cG9uJylcbiAgICAgICAgICAgICAgICAuYWRkKHtcbiAgICAgICAgICAgICAgICAgICAgZGF0YTogdGVtcFxuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICByZXR1cm4gY3R4LmJvZHkgPSB7XG4gICAgICAgICAgICAgICAgc3RhdHVzOiAyMDAsXG4gICAgICAgICAgICAgICAgZGF0YTogYWRkJC5faWRcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBjYXRjaCAoIGUgKSB7IHJldHVybiBjdHguYm9keSA9IHsgc3RhdHVzOiA1MDAgfTt9XG4gICAgfSk7XG5cbiAgICAvKipcbiAgICAgKiBAZGVzY3JpcHRpb24g5qOA5rWL6KGM56iL6YeM6Z2i77yM5a6i5oi35piv5ZCm5bey57uP6aKG5Y+W6L+Z5Yeg57G755qE5LyY5oOg5Yi4LCBudWxs5Li65rKh5pyJ6K+l57G75Z6L5LyY5oOg77yMdHJ1ZeS4uuW3sue7j+mihuWPlu+8jGZhbHNl5Li65pyq6aKG5Y+WXG4gICAgICogLS0tLS0tLS0g6K+35rGCIC0tLS0tLS1cbiAgICAgKiB7XG4gICAgICogICB0aWQ6IFxuICAgICAqICAgb3BlbmlkOiBcbiAgICAgKiAgIGNoZWNrOiAndF9saWphaW4sdF9tYW5qaWFuLHRfZGFpamluJ1xuICAgICAqIH1cbiAgICAgKiAtLS0tLSDov5Tlm54gLS0tLS1cbiAgICAgKiB7XG4gICAgICogICBzdGF0dXMsXG4gICAgICogICBkYXRhOiB7XG4gICAgICogICAgIHRfbGlqYWluOiBudWxsL3RydWUvZmFsc2UvaGFsZlxuICAgICAqICAgICB0X21hbmppYW46IG51bGwvdHJ1ZS9mYWxzZVxuICAgICAqICAgICB0X2RhaWppbjogbnVsbC90cnVlL2ZhbHNlXG4gICAgICogICB9IFxuICAgICAqIH1cbiAgICAgKi9cbiAgICBhcHAucm91dGVyKCdpc2dldCcsIGFzeW5jKCBjdHgsIG5leHQgKSA9PiB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGNvbnN0IHsgdGlkLCBjaGVjayB9ID0gZXZlbnQuZGF0YTtcbiAgICAgICAgICAgIGNvbnN0IG9wZW5pZCA9IGV2ZW50LmRhdGEub3BlbklkIHx8IGV2ZW50LnVzZXJJbmZvLm9wZW5JZDtcblxuICAgICAgICAgICAgLy8g5YWI5qOA5p+l77yM6K+l6KGM56iL5pyJ5rKh5pyJ6K+l56eN5LyY5oOgXG4gICAgICAgICAgICBjb25zdCB0cmlwJCA9IGF3YWl0IGRiLmNvbGxlY3Rpb24oJ3RyaXAnKVxuICAgICAgICAgICAgICAgIC5kb2MoIHRpZCApXG4gICAgICAgICAgICAgICAgLmdldCggKTtcblxuICAgICAgICAgICAgY29uc3QgdHJpcCA9IHRyaXAkLmRhdGE7XG4gICAgICAgICAgICAvLyDooYznqIvnq4vlh4/ph5Hpop0v6KGM56iL5ruh5YeP6YeR6aKdL+ihjOeoi+S7o+mHkeWIuOmHkeminVxuICAgICAgICAgICAgY29uc3QgeyByZWR1Y2VfcHJpY2UsIGZ1bGxyZWR1Y2VfdmFsdWVzLCBjYXNoY291cG9uX3ZhbHVlcyB9ID0gdHJpcDtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgLy8g6KGM56iL56uL5YeP5Luj6YeR5Yi4XG4gICAgICAgICAgICBjb25zdCBsaWphaW4kID0gYXdhaXQgZGIuY29sbGVjdGlvbignY291cG9uJylcbiAgICAgICAgICAgICAgICAud2hlcmUoe1xuICAgICAgICAgICAgICAgICAgICB0aWQsXG4gICAgICAgICAgICAgICAgICAgIG9wZW5pZCxcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogJ3RfbGlqYWluJ1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLmdldCggKTtcblxuICAgICAgICAgICAgLy8g6KGM56iL5ruh5YeP5Yi4XG4gICAgICAgICAgICBjb25zdCBtYW5qaWFuJCA9IGF3YWl0IGRiLmNvbGxlY3Rpb24oJ2NvdXBvbicpXG4gICAgICAgICAgICAgICAgLndoZXJlKHtcbiAgICAgICAgICAgICAgICAgICAgdGlkLFxuICAgICAgICAgICAgICAgICAgICBvcGVuaWQsXG4gICAgICAgICAgICAgICAgICAgIHR5cGU6ICd0X21hbmppYW4nXG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAuZ2V0KCApO1xuXG4gICAgICAgICAgICAvLyDooYznqIvnq4vlh4/liLhcbiAgICAgICAgICAgIGNvbnN0IGRhaWppbiQgPSBhd2FpdCBkYi5jb2xsZWN0aW9uKCdjb3Vwb24nKVxuICAgICAgICAgICAgICAgIC53aGVyZSh7XG4gICAgICAgICAgICAgICAgICAgIHRpZCxcbiAgICAgICAgICAgICAgICAgICAgb3BlbmlkLFxuICAgICAgICAgICAgICAgICAgICB0eXBlOiAndF9kYWlqaW4nXG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAuZ2V0KCApO1xuXG4gICAgICAgICAgICBjb25zdCB0ZW1wID0geyB9O1xuICAgICAgICAgICAgY2hlY2suc3BsaXQoJywnKS5tYXAoIGNoZWNrVHlwZSA9PiB7XG5cbiAgICAgICAgICAgICAgICBpZiAoIGNoZWNrVHlwZSA9PT0gJ3RfbWFuamlhbicgKSB7XG4gICAgICAgICAgICAgICAgICAgIHRlbXBbIGNoZWNrVHlwZSBdID0gISFmdWxscmVkdWNlX3ZhbHVlcyA/XG4gICAgICAgICAgICAgICAgICAgICAgICBtYW5qaWFuJC5kYXRhLmxlbmd0aCA9PT0gMCA/IFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZhbHNlIDpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0cnVlIDpcbiAgICAgICAgICAgICAgICAgICAgICAgIG51bGxcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKCBjaGVja1R5cGUgPT09ICd0X2RhaWppbicgKSB7XG4gICAgICAgICAgICAgICAgICAgIHRlbXBbIGNoZWNrVHlwZSBdID0gISFjYXNoY291cG9uX3ZhbHVlcyA/XG4gICAgICAgICAgICAgICAgICAgICAgICBkYWlqaW4kLmRhdGEubGVuZ3RoID09PSAwID8gXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZmFsc2UgOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRydWUgOlxuICAgICAgICAgICAgICAgICAgICAgICAgbnVsbFxuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoIGNoZWNrVHlwZSA9PT0gJ3RfbGlqYWluJyApIHtcbiAgICAgICAgICAgICAgICAgICAgdGVtcFsgY2hlY2tUeXBlIF0gPSAhIXJlZHVjZV9wcmljZSA/XG4gICAgICAgICAgICAgICAgICAgICAgICBsaWphaW4kLmRhdGEubGVuZ3RoID09PSAwID8gXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZmFsc2UgOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxpamFpbiQuZGF0YVsgMCBdLnZhbHVlIDwgcmVkdWNlX3ByaWNlID9cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ2hhbGYnIDpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdHJ1ZSA6XG4gICAgICAgICAgICAgICAgICAgICAgICBudWxsXG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgcmV0dXJuIGN0eC5ib2R5ID0ge1xuICAgICAgICAgICAgICAgIHN0YXR1czogMjAwLFxuICAgICAgICAgICAgICAgIGRhdGE6IHRlbXBcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBjYXRjaCAoIGUgKSB7IHJldHVybiBjdHguYm9keSA9IHsgc3RhdHVzIDo1MDAgfTt9XG4gICAgfSlcbiAgICBcblxuICAgIHJldHVybiBhcHAuc2VydmUoICk7XG59OyJdfQ==