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
var create_1 = require("./create");
cloud.init();
var db = cloud.database();
exports.main = function (event, context) { return __awaiter(_this, void 0, void 0, function () {
    var app;
    var _this = this;
    return __generator(this, function (_a) {
        app = new TcbRouter({ event: event });
        app.router('create', function (ctx, next) { return __awaiter(_this, void 0, void 0, function () {
            var _a, tid, from, orders, openid_1, trips$$, trips$, trip, addressid$, aid_1, temp, save$, orderIds, e_1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 5, , 6]);
                        _a = event.data, tid = _a.tid, from = _a.from, orders = _a.orders;
                        openid_1 = event.data.openId || event.userInfo.openId;
                        return [4, cloud.callFunction({
                                data: {
                                    data: {
                                        _id: tid
                                    },
                                    $url: 'detail'
                                },
                                name: 'trip'
                            })];
                    case 1:
                        trips$$ = _b.sent();
                        trips$ = trips$$.result;
                        if (trips$.status !== 200
                            || !trips$.data
                            || (!!trips$.data && trips$.data.isClosed)
                            || (!!trips$.data && new Date().getTime() >= trips$.data.end_date)) {
                            throw '暂无行程计划，暂时不能购买～';
                        }
                        trip = trips$.data;
                        addressid$ = {
                            result: {
                                data: null,
                                status: 500
                            }
                        };
                        if (!(event.data.from === 'cart' || event.data.from === 'system')) return [3, 3];
                        return [4, cloud.callFunction({
                                data: {
                                    data: {
                                        openId: openid_1,
                                        address: event.data.orders[0].address
                                    },
                                    $url: 'getAddressId'
                                },
                                name: 'address'
                            })];
                    case 2:
                        addressid$ = _b.sent();
                        _b.label = 3;
                    case 3:
                        if ((event.data.from === 'cart' || event.data.from === 'system') && addressid$.result.status !== 200) {
                            throw '查询地址错误';
                        }
                        aid_1 = addressid$.result.data;
                        temp = event.data.orders.map(function (meta) {
                            var t = Object.assign({}, meta, {
                                aid: aid_1,
                                isOccupied: true,
                                openid: openid_1,
                                deliver_status: '0',
                                base_status: '0',
                                createTime: new Date().getTime(),
                            });
                            delete t['address'];
                            return t;
                        });
                        return [4, Promise.all(temp.map(function (o) {
                                return create_1.create$(openid_1, o, db, ctx);
                            }))];
                    case 4:
                        save$ = _b.sent();
                        if (save$.some(function (x) { return x.status !== 200; })) {
                            throw '创建订单错误！';
                        }
                        orderIds = save$.map(function (x) { return x.data._id; });
                        return [2, ctx.body = {
                                status: 200,
                                data: orderIds
                            }];
                    case 5:
                        e_1 = _b.sent();
                        return [2, ctx.body = {
                                status: 500,
                                message: e_1
                            }];
                    case 6: return [2];
                }
            });
        }); });
        return [2, app.serve()];
    });
}); };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFDQSxpQkEwS0M7O0FBMUtELHFDQUF1QztBQUN2QyxzQ0FBd0M7QUFDeEMsbUNBQW1DO0FBRW5DLEtBQUssQ0FBQyxJQUFJLEVBQUcsQ0FBQztBQUVkLElBQU0sRUFBRSxHQUFnQixLQUFLLENBQUMsUUFBUSxFQUFHLENBQUM7QUF3QjdCLFFBQUEsSUFBSSxHQUFHLFVBQVEsS0FBSyxFQUFFLE9BQU87Ozs7UUFFaEMsR0FBRyxHQUFHLElBQUksU0FBUyxDQUFDLEVBQUUsS0FBSyxPQUFBLEVBQUUsQ0FBQyxDQUFDO1FBK0JyQyxHQUFHLENBQUMsTUFBTSxDQUFDLFFBQVEsRUFBRSxVQUFPLEdBQUcsRUFBRSxJQUFJOzs7Ozs7d0JBR3ZCLEtBQXdCLEtBQUssQ0FBQyxJQUFJLEVBQWhDLEdBQUcsU0FBQSxFQUFFLElBQUksVUFBQSxFQUFFLE1BQU0sWUFBQSxDQUFnQjt3QkFDbkMsV0FBUyxLQUFLLENBQUMsSUFBSSxDQUFDLE1BQU0sSUFBSSxLQUFLLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQzt3QkFHMUMsV0FBTSxLQUFLLENBQUMsWUFBWSxDQUFDO2dDQUNyQyxJQUFJLEVBQUU7b0NBQ0YsSUFBSSxFQUFFO3dDQUNGLEdBQUcsRUFBRSxHQUFHO3FDQUNYO29DQUNELElBQUksRUFBRSxRQUFRO2lDQUNqQjtnQ0FDRCxJQUFJLEVBQUUsTUFBTTs2QkFDZixDQUFDLEVBQUE7O3dCQVJJLE9BQU8sR0FBRyxTQVFkO3dCQUVJLE1BQU0sR0FBRyxPQUFPLENBQUMsTUFBTSxDQUFDO3dCQUM5QixJQUFLLE1BQU0sQ0FBQyxNQUFNLEtBQUssR0FBRzsrQkFDZixDQUFDLE1BQU0sQ0FBQyxJQUFJOytCQUNaLENBQUUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxJQUFJLElBQUksTUFB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RUFBRSxHQUFDOzZCQUNiLEVBQUM7Ozs7YUFFVCxDQUFDLENBQUM7UUFFSCxXQUFPLEdBQUcsQ0FBQyxLQUFLLEVBQUcsRUFBQzs7S0FFdkIsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbIlxuaW1wb3J0ICogYXMgY2xvdWQgZnJvbSAnd3gtc2VydmVyLXNkayc7XG5pbXBvcnQgKiBhcyBUY2JSb3V0ZXIgZnJvbSAndGNiLXJvdXRlcic7XG5pbXBvcnQgeyBjcmVhdGUkIH0gZnJvbSAnLi9jcmVhdGUnO1xuXG5jbG91ZC5pbml0KCApO1xuXG5jb25zdCBkYjogREIuRGF0YWJhc2UgPSBjbG91ZC5kYXRhYmFzZSggKTtcblxuLyoqXG4gKiBcbiAqIEBkZXNjcmlwdGlvbiDorqLljZXmqKHlnZdcbiAqIC0tLS0tLS0tIOWtl+autSAtLS0tLS0tLS0tXG4gKiBfaWRcbiAqIG9wZW5pZCxcbiAqIGNyZWF0ZXRpbWVcbiAqIHRpZCxcbiAqIHBpZCxcbiAqICEgc2lkLCAo5Y+v5Li656m6KVxuICogY291bnQsXG4gKiBwcmljZSxcbiAqISBpc09jY3VwaWVkLCDmmK/lkKbljaDlupPlrZhcbiAqICEgZ3JvdXBfcHJpY2UgKOWPr+S4uuepuilcbiAqIHR5cGU6ICdjdXN0b20nIHwgJ25vcm1hbCcgfCAncHJlJyDoh6rlrprkuYnliqDljZXjgIHmma7pgJrliqDljZXjgIHpooTorqLljZVcbiAqIGltZzogQXJyYXlbIHN0cmluZyBdXG4gKiAhIGRlc2PvvIjlj6/kuLrnqbrvvIksXG4gKiBhaWRcbiAqICEgYmFzZV9zdGF0dXM6IDAsMSwyLDMsNCDov5vooYzkuK3vvIjlrqLmiLfov5jlj6/ku6XosIPmlbToh6rlt7HnmoTorqLljZXvvInvvIzlt7LotK3kubDvvIzlt7LosIPmlbTvvIzlt7Lnu5PnrpfvvIzlt7Llj5bmtohcbiAqICEgcGF5X3N0YXR1czogMCwxLDIg5pyq5LuY5qy+77yM5bey5LuY6K6i6YeR77yM5bey5LuY5YWo5qy+XG4gKiAhIGRlbGl2ZXJfc3RhdHVzOiAwLDEg5pyq5Y+R5biD77yM5bey5Y+R5biD44CBXG4gKi9cbmV4cG9ydCBjb25zdCBtYWluID0gYXN5bmMgKCBldmVudCwgY29udGV4dCApID0+IHtcblxuICAgIGNvbnN0IGFwcCA9IG5ldyBUY2JSb3V0ZXIoeyBldmVudCB9KTtcblxuICAgIC8qKlxuICAgICAqIEBkZXNjcmlwdGlvbiDliJvlu7rorqLljZVcbiAgICAgKiAtLS0tLS0tLSDor7fmsYIgLS0tLS0tLS0tLVxuICAgICAqIHtcbiAgICAgKiAgICAgIHRpZCxcbiAgICAgKiAgICAgIG9wZW5JZCAvLyDorqLljZXkuLvkurpcbiAgICAgKiAgICAgIGZyb206ICdjYXJ0JyB8ICdidXknIHwgJ2N1c3RvbScgfCAnYWdlbnRzJyB8ICdzeXN0ZW0nIOadpea6kO+8mui0reeJqei9puOAgeebtOaOpei0reS5sOOAgeiHquWumuS5ieS4i+WNleOAgeS7o+i0reS4i+WNleOAgeezu+e7n+WPkei1t+mihOS7mOiuouWNlVxuICAgICAqICAgICAgb3JkZXJzOiBBcnJheTx7IFxuICAgICAqICAgICAgICAgIHRpZFxuICAgICAqICAgICAgICAgIGNpZFxuICAgICAqICAgICAgICAgIHNpZFxuICAgICAqICAgICAgICAgIHBpZFxuICAgICAqICAgICAgICAgIHByaWNlXG4gICAgICogICAgICAgICAgbmFtZVxuICAgICAqICAgICAgICAgIGdyb3VwUHJpY2VcbiAgICAgKiAgICAgICAgICBjb3VudFxuICAgICAqICAgICAgICAgIGRlc2NcbiAgICAgKiAgICAgICAgICBpbWdcbiAgICAgKiAgICAgICAgICB0eXBlXG4gICAgICogICAgICAgICAgcGF5X3N0YXR1cyxcbiAgICAgKiAgICAgICAgICBhZGRyZXNzOiB7XG4gICAgICogICAgICAgICAgICAgIG5hbWUsXG4gICAgICogICAgICAgICAgICAgIHBob25lLFxuICAgICAqICAgICAgICAgICAgICBkZXRhaWwsXG4gICAgICogICAgICAgICAgICAgIHBvc3RhbGNvZGVcbiAgICAgKiAgICAgICAgICB9XG4gICAgICogICAgICB9PlxuICAgICAqIH1cbiAgICAgKi9cbiAgICBhcHAucm91dGVyKCdjcmVhdGUnLCBhc3luYyggY3R4LCBuZXh0ICkgPT4ge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgXG4gICAgICAgICAgICBjb25zdCB7IHRpZCwgZnJvbSwgb3JkZXJzIH0gPSBldmVudC5kYXRhO1xuICAgICAgICAgICAgY29uc3Qgb3BlbmlkID0gZXZlbnQuZGF0YS5vcGVuSWQgfHwgZXZlbnQudXNlckluZm8ub3BlbklkO1xuXG4gICAgICAgICAgICAvLyAx44CB5Yik5pat6K+l6KGM56iL5piv5ZCm5Y+v5Lul55SoXG4gICAgICAgICAgICBjb25zdCB0cmlwcyQkID0gYXdhaXQgY2xvdWQuY2FsbEZ1bmN0aW9uKHtcbiAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIF9pZDogdGlkXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICR1cmw6ICdkZXRhaWwnXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBuYW1lOiAndHJpcCdcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBjb25zdCB0cmlwcyQgPSB0cmlwcyQkLnJlc3VsdDsgICAgICAgIFxuICAgICAgICAgICAgaWYgKCB0cmlwcyQuc3RhdHVzICE9PSAyMDBcbiAgICAgICAgICAgICAgICAgICAgfHwgIXRyaXBzJC5kYXRhIFxuICAgICAgICAgICAgICAgICAgICB8fCAoICEhdHJpcHMkLmRhdGEgJiYgdHJpcHMkLmRhdGEuaXNDbG9zZWQgKSBcbiAgICAgICAgICAgICAgICAgICAgfHwgKCAhIXRyaXBzJC5kYXRhICYmIG5ldyBEYXRlKCApLmdldFRpbWUoICkgPj0gdHJpcHMkLmRhdGEuZW5kX2RhdGUgKSkge1xuICAgICAgICAgICAgICAgIHRocm93ICfmmoLml6DooYznqIvorqHliJLvvIzmmoLml7bkuI3og73otK3kubDvvZ4nXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIOacgOaWsOWPr+eUqOihjOeoi1xuICAgICAgICAgICAgY29uc3QgdHJpcCA9IHRyaXBzJC5kYXRhO1xuXG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIOagueaNruWcsOWdgOWvueixoe+8jOaLv+WIsOWcsOWdgGlkXG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIGxldCBhZGRyZXNzaWQkID0ge1xuICAgICAgICAgICAgICAgIHJlc3VsdDoge1xuICAgICAgICAgICAgICAgICAgICBkYXRhOiBudWxsLFxuICAgICAgICAgICAgICAgICAgICBzdGF0dXM6IDUwMFxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIC8vIOiuouWNleadpea6kO+8mui0reeJqei9puOAgeezu+e7n+WKoOWNlVxuICAgICAgICAgICAgaWYgKCBldmVudC5kYXRhLmZyb20gPT09ICdjYXJ0JyB8fCBldmVudC5kYXRhLmZyb20gPT09ICdzeXN0ZW0nICkge1xuICAgICAgICAgICAgICAgIGFkZHJlc3NpZCQgPSBhd2FpdCBjbG91ZC5jYWxsRnVuY3Rpb24oe1xuICAgICAgICAgICAgICAgICAgICBkYXRhOiB7IFxuICAgICAgICAgICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9wZW5JZDogb3BlbmlkLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFkZHJlc3M6IGV2ZW50LmRhdGEub3JkZXJzWyAwIF0uYWRkcmVzc1xuICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICR1cmw6ICdnZXRBZGRyZXNzSWQnXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIG5hbWU6ICdhZGRyZXNzJ1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgXG4gICAgICAgICAgICAvLyDorqLljZXmnaXmupDvvJrotK3nianovabjgIHns7vnu5/liqDljZVcbiAgICAgICAgICAgIGlmICgoIGV2ZW50LmRhdGEuZnJvbSA9PT0gJ2NhcnQnIHx8IGV2ZW50LmRhdGEuZnJvbSA9PT0gJ3N5c3RlbScgKSAmJiBhZGRyZXNzaWQkLnJlc3VsdC5zdGF0dXMgIT09IDIwMCApIHtcbiAgICAgICAgICAgICAgICB0aHJvdyAn5p+l6K+i5Zyw5Z2A6ZSZ6K+vJztcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8g5Y+v55So5Zyw5Z2AaWRcbiAgICAgICAgICAgIGNvbnN0IGFpZCA9IGFkZHJlc3NpZCQucmVzdWx0LmRhdGE7XG5cbiAgICAgICAgICAgIC8vIDPjgIHmibnph4/liJvlu7rorqLljZXvvIzvvIjov4fmu6TmjonkuI3og73liJvlu7rotK3nianmuIXljZXnmoTllYblk4HvvIlcbiAgICAgICAgICAgIGNvbnN0IHRlbXAgPSBldmVudC5kYXRhLm9yZGVycy5tYXAoIG1ldGEgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IHQgPSBPYmplY3QuYXNzaWduKHsgfSwgbWV0YSwge1xuICAgICAgICAgICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAgICAgICAgICogISBkZWxpdmVyX3N0YXR1c+S4uuacquWPkeW4gyDlj6/og73mnInpl67pophcbiAgICAgICAgICAgICAgICAgICAgICovXG4gICAgICAgICAgICAgICAgICAgIGFpZCxcbiAgICAgICAgICAgICAgICAgICAgaXNPY2N1cGllZDogdHJ1ZSwgLy8g5Y2g6aKG5bqT5a2Y5qCH5b+XXG4gICAgICAgICAgICAgICAgICAgIG9wZW5pZDogb3BlbmlkLFxuICAgICAgICAgICAgICAgICAgICBkZWxpdmVyX3N0YXR1czogJzAnLCBcbiAgICAgICAgICAgICAgICAgICAgYmFzZV9zdGF0dXM6ICcwJywgLy8g57uf5LiA5Li65pyq5LuY5qy+77yM6K6i5Y2V5pSv5LuY5ZCO5YaN5Y675pu05pawXG4gICAgICAgICAgICAgICAgICAgIGNyZWF0ZVRpbWU6IG5ldyBEYXRlKCApLmdldFRpbWUoICksXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgZGVsZXRlIHRbJ2FkZHJlc3MnXTtcbiAgICAgICAgICAgICAgICByZXR1cm4gdDtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAvLyA044CB5om56YeP5Yib5bu66K6i5Y2VICgg5ZCM5pe25aSE55CG5Y2g6aKG6LSn5a2Y55qE6Zeu6aKYIClcbiAgICAgICAgICAgIGNvbnN0IHNhdmUkOiBhbnkgPSBhd2FpdCBQcm9taXNlLmFsbCggdGVtcC5tYXAoIG8gPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiBjcmVhdGUkKCBvcGVuaWQsIG8sIGRiLCBjdHggKTtcbiAgICAgICAgICAgIH0pKTtcbiAgICAgICAgXG4gICAgICAgICAgICBpZiAoIHNhdmUkLnNvbWUoIHggPT4geC5zdGF0dXMgIT09IDIwMCApKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgJ+WIm+W7uuiuouWNlemUmeivr++8gSdcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgY29uc3Qgb3JkZXJJZHMgPSBzYXZlJC5tYXAoIHggPT4geC5kYXRhLl9pZCApO1xuICAgICAgICAgICAgLy8gNOOAgeabtOaWsOiuouWNleeKtuaAgVxuICAgICAgICAgICAgLy8gNeOAgeaJuemHj+WKoOWFpeaIluWIm+W7uui0reeJqea4heWNlVxuICAgICAgICAgICAgLy8gNuOAgeaJuemHj+WIoOmZpOW3suWKoOWFpei0reeJqea4heWNleaIlumihOS7mOiuouWNleeahOi0reeJqei9puWVhuWTge+8jOWmguaenOaciWNpZOeahOivnVxuICAgIFxuICAgICAgICAgICAgcmV0dXJuIGN0eC5ib2R5ID0ge1xuICAgICAgICAgICAgICAgIHN0YXR1czogMjAwLFxuICAgICAgICAgICAgICAgIGRhdGE6IG9yZGVySWRzXG4gICAgICAgICAgICB9O1xuXG4gICAgICAgIH0gY2F0Y2ggKCBlICkge1xuICAgICBcbiAgICAgICAgICAgIHJldHVybiBjdHguYm9keSA9IHtcbiAgICAgICAgICAgICAgICBzdGF0dXM6IDUwMCxcbiAgICAgICAgICAgICAgICBtZXNzYWdlOiBlXG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICByZXR1cm4gYXBwLnNlcnZlKCApO1xuXG59Il19