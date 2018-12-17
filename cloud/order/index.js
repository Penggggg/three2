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
            var _a, from, orders, trips$, trip_1, openid_1, addressid$, aid_1, temp, e_1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 4, , 5]);
                        _a = event.data, from = _a.from, orders = _a.orders;
                        return [4, cloud.callFunction({
                                data: {},
                                name: 'api-trip-enter'
                            })];
                    case 1:
                        trips$ = _b.sent();
                        if (trips$.result.status !== 200 || !trips$.result.data || !trips$.result.data[0]) {
                            return [2, ctx.body = {
                                    status: 400,
                                    message: "\u6682\u65E0\u884C\u7A0B\u8BA1\u5212\uFF0C\u6682\u65F6\u4E0D\u80FD\u8D2D\u4E70\uFF5E"
                                }];
                        }
                        trip_1 = trips$.result.data[0];
                        addressid$ = {
                            result: {
                                data: null,
                                status: 500
                            }
                        };
                        if (!(event.data.from === 'cart')) return [3, 3];
                        openid_1 = event.data.openId;
                        return [4, cloud.callFunction({
                                data: {
                                    data: {
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
                        if (addressid$.result.status !== 200) {
                            return [2, ctx.body = {
                                    status: 500,
                                    message: '查询地址错误'
                                }];
                        }
                        aid_1 = addressid$.result.data;
                        temp = event.data.orders.map(function (meta) {
                            return Object.assign({}, meta, {
                                aid: aid_1,
                                tid: trip_1._id,
                                openid: openid_1,
                                createTime: new Date().getTime(),
                            });
                        });
                        return [2, ctx.body = {
                                status: 200,
                                data: temp,
                                message: '购买成功！'
                            }];
                    case 4:
                        e_1 = _b.sent();
                        return [2, ctx.body = {
                                status: 500,
                                message: e_1
                            }];
                    case 5: return [2];
                }
            });
        }); });
        return [2, app.serve()];
    });
}); };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFDQSxpQkEwSkM7O0FBMUpELHFDQUF1QztBQUN2QyxzQ0FBd0M7QUFFeEMsS0FBSyxDQUFDLElBQUksRUFBRyxDQUFDO0FBRWQsSUFBTSxFQUFFLEdBQWdCLEtBQUssQ0FBQyxRQUFRLEVBQUcsQ0FBQztBQTJCN0IsUUFBQSxJQUFJLEdBQUcsVUFBUSxLQUFLLEVBQUUsT0FBTzs7OztRQUVoQyxHQUFHLEdBQUcsSUFBSSxTQUFTLENBQUMsRUFBRSxLQUFLLE9BQUEsRUFBRSxDQUFDLENBQUM7UUEyQnJDLEdBQUcsQ0FBQyxNQUFNLENBQUMsUUFBUSxFQUFFLFVBQU8sR0FBRyxFQUFFLElBQUk7Ozs7Ozt3QkFHdkIsS0FBbUIsS0FBSyxDQUFDLElBQUksRUFBM0IsSUFBSSxVQUFBLEVBQUUsTUFBTSxZQUFBLENBQWdCO3dCQUNyQixXQUFNLEtBQUssQ0FBQyxZQUFZLENBQUM7Z0NBQ3BDLElBQUksRUFBRSxFQUFHO2dDQUNULElBQUksRUFBRSxnQkFBZ0I7NkJBQ3pCLENBQUMsRUFBQTs7d0JBSEksTUFBTSxHQUFHLFNBR2I7d0JBR0YsSUFBSyxNQUFNLENBQUMsTUFBTSxDQUFDLE1BQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLElBQUksSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFFLENBQUMsQ0FBRSxFQUFFOzRCQUNsRixXQUFPLEdBQUcsQ0FBQyxJQUFJLEdBQUc7b0NBQ2QsTUFBTSxFQUFFLEdBQUc7b0NBQ1gsT0FBTyxFQUFFLHNGQUFnQjtpQ0FDNUIsRUFBQzt5QkFDTDt3QkFHSyxTQUFPLE1BQU0sQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFFLENBQUMsQ0FBRSxDQUFDO3dCQVlqQyxVQUFVLEdBQUc7NEJBQ2IsTUFBTSxFQUFFO2dDQUNKLElBQUksRUFBRSxJQUFJO2dDQUNWLE1BQU0sRUFBRSxHQUFHOzZCQUNkO3lCQUNKLENBQUM7NkJBSUcsQ0FBQSxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksS0FBSyxNQUFNLENBQUEsRUFBMUIsY0FBMEI7d0JBQzNCLFFBQU0sR0FBRyxLQUFLLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQzt3QkFDZCxXQUFNLEtBQUssQ0FBQyxZQUFZLENBQUM7Z0NBQ2xDLElBQUksRUFBRTtvQ0FDRixJQUFJLEVBQUU7d0NBQ0YsT0FBTyxFQUFFLEtBQUssQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFFLENBQUMsQ0FBRSxDQUFDLE9BQU87cUNBQzFDO29DQUNELElBQUksRUFBRSxjQUFjO2lDQUN2QjtnQ0FDRCxJQUFJLEVBQUUsU0FBUzs2QkFDbEIsQ0FBQyxFQUFBOzt3QkFSRixVQUFVLEdBQUcsU0FRWCxDQUFDOzs7d0JBR1AsSUFBSyxVQUFVLENBQUMsTUFBTSxDQUFDLE1BQU0sS0FBSyxHQUFHLEVBQUc7NEJBQ3BDLFdBQU8sR0FBRyxDQUFDLElBQUksR0FBRztvQ0FDZCxNQUFNLEVBQUUsR0FBRztvQ0FDWCxPQUFPLEVBQUUsUUFBUTtpQ0FDcEIsRUFBQzt5QkFDTDt3QkFHSyxRQUFNLFVBQVUsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDO3dCQUc3QixJQUFJLEdBQUcsS0FBSyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFFLFVBQUEsSUFBSTs0QkFDcEMsT0FBTyxNQUFNLENBQUMsTUFBTSxDQUFDLEVBQUcsRUFBRSxJQUFJLEVBQUU7Z0NBQzVCLEdBQUcsT0FBQTtnQ0FDSCxHQUFHLEVBQUUsTUFBSSxDQUFDLEdBQUc7Z0NBQ2IsTUFBTSxFQUFFLFFBQU07Z0NBQ2QsVUFBVSxFQUFFLElBQUksSUFBSSxFQUFHLENBQUMsT0FBTyxFQUFHOzZCQUNyQyxDQUFDLENBQUM7d0JBQ1AsQ0FBQyxDQUFDLENBQUM7d0JBTUgsV0FBTyxHQUFHLENBQUMsSUFBSSxHQUFHO2dDQUNkLE1BQU0sRUFBRSxHQUFHO2dDQUNYLElBQUksRUFBRSxJQUFJO2dDQUNWLE9BQU8sRUFBRSxPQUFPOzZCQUNuQixFQUFDOzs7d0JBSUYsV0FBTyxHQUFHLENBQUMsSUFBSSxHQUFHO2dDQUNkLE1BQU0sRUFBRSxHQUFHO2dDQUNYLE9BQU8sRUFBRSxHQUFDOzZCQUNiLEVBQUM7Ozs7YUFFVCxDQUFDLENBQUM7UUFFSCxXQUFPLEdBQUcsQ0FBQyxLQUFLLEVBQUcsRUFBQzs7S0FFdkIsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbIlxuaW1wb3J0ICogYXMgY2xvdWQgZnJvbSAnd3gtc2VydmVyLXNkayc7XG5pbXBvcnQgKiBhcyBUY2JSb3V0ZXIgZnJvbSAndGNiLXJvdXRlcic7XG5cbmNsb3VkLmluaXQoICk7XG5cbmNvbnN0IGRiOiBEQi5EYXRhYmFzZSA9IGNsb3VkLmRhdGFiYXNlKCApO1xuXG4vKipcbiAqIFxuICogQGRlc2NyaXB0aW9uIOiuouWNleaooeWdl1xuICogLS0tLS0tLS0g5a2X5q61IC0tLS0tLS0tLS1cbiAqIF9pZFxuICogb3BlbmlkLFxuICogY3JlYXRldGltZVxuICogdGlkLFxuICogcGlkLFxuICogISBzaWQsICjlj6/kuLrnqbopXG4gKiBjb3VudCxcbiAqIHByaWNlLFxuICogISBncm91cF9wcmljZSAo5Y+v5Li656m6KVxuICogdHlwZTogJ2N1c3RvbScgfCAnbm9ybWFsJyDoh6rlrprkuYnliqDljZXjgIHmma7pgJrliqDljZVcbiAqIGltZzogQXJyYXlbIHN0cmluZyBdXG4gKiBkZXNjLFxuICogYWlkXG4gICAgICAgICogdXNlcm5hbWUsIOaUtui0p+S6ulxuICAgICAgICAqIHBvc3RhbGNvZGUsIOmCruaUv1xuICAgICAgICAqIHBob25lLCDmlLbojrfnlLXor51cbiAgICAgICAgKiBhZGRyZXNzLCDmlLbojrflnLDlnYBcbiAqIGJhc2Vfc3RhdHVzOiAwLDEsMiwzLDQg6L+b6KGM5Lit77yI5a6i5oi36L+Y5Y+v5Lul6LCD5pW06Ieq5bex55qE6K6i5Y2V77yJ77yM5bey6LSt5Lmw77yM5bey6LCD5pW077yM5bey57uT566X77yM5bey5Y+W5raIXG4gKiBwYXlfc3RhdHVzOiAwLDEsMiDmnKrku5jmrL7vvIzlt7Lku5jorqLph5HvvIzlt7Lku5jlhajmrL5cbiAqIGRlbGl2ZXJfc3RhdHVzOiAwLDEg5pyq5Y+R5biD77yM5bey5Y+R5biD44CBXG4gKi9cbmV4cG9ydCBjb25zdCBtYWluID0gYXN5bmMgKCBldmVudCwgY29udGV4dCApID0+IHtcblxuICAgIGNvbnN0IGFwcCA9IG5ldyBUY2JSb3V0ZXIoeyBldmVudCB9KTtcblxuICAgIC8qKlxuICAgICAqIEBkZXNjcmlwdGlvbiDliJvlu7rorqLljZVcbiAgICAgKiAtLS0tLS0tLSDor7fmsYIgLS0tLS0tLS0tLVxuICAgICAqIHtcbiAgICAgKiAgICAgIGZyb206ICdjYXJ0JyB8ICdidXknIHwgJ2N1c3RvbScgfCAnYWdlbnRzJyDmnaXmupDvvJrotK3nianovabjgIHnm7TmjqXotK3kubDjgIHoh6rlrprkuYnkuIvljZXjgIHku6PotK3kuIvljZVcbiAgICAgKiAgICAgIG9yZGVyczogQXJyYXk8eyBcbiAgICAgKiAgICAgICAgICBjaWRcbiAgICAgKiAgICAgICAgICBzaWRcbiAgICAgKiAgICAgICAgICBwaWRcbiAgICAgKiAgICAgICAgICBwcmljZVxuICAgICAqICAgICAgICAgIGdyb3VwX3ByaWNlXG4gICAgICogICAgICAgICAgY291bnRcbiAgICAgKiAgICAgICAgICBkZXNjXG4gICAgICogICAgICAgICAgaW1nXG4gICAgICogICAgICAgICAgdHlwZVxuICAgICAqICAgICAgICAgIHBheV9zdGF0dXMsXG4gICAgICogICAgICAgICAgYWRkcmVzczoge1xuICAgICAqICAgICAgICAgICAgICBuYW1lLFxuICAgICAqICAgICAgICAgICAgICBwaG9uZSxcbiAgICAgKiAgICAgICAgICAgICAgZGV0YWlsLFxuICAgICAqICAgICAgICAgICAgICBwb3N0YWxjb2RlXG4gICAgICogICAgICAgICAgfVxuICAgICAqICAgICAgfT5cbiAgICAgKiB9XG4gICAgICovXG4gICAgYXBwLnJvdXRlcignY3JlYXRlJywgYXN5bmMoIGN0eCwgbmV4dCApID0+IHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgY29uc3QgeyBmcm9tLCBvcmRlcnMgfSA9IGV2ZW50LmRhdGE7XG4gICAgICAgICAgICBjb25zdCB0cmlwcyQgPSBhd2FpdCBjbG91ZC5jYWxsRnVuY3Rpb24oe1xuICAgICAgICAgICAgICAgIGRhdGE6IHsgfSxcbiAgICAgICAgICAgICAgICBuYW1lOiAnYXBpLXRyaXAtZW50ZXInXG4gICAgICAgICAgICB9KTtcbiAgICBcbiAgICAgICAgICAgIC8vIDHjgIHliKTmlq3mnInmsqHmnInlj6/nlKjooYznqItcbiAgICAgICAgICAgIGlmICggdHJpcHMkLnJlc3VsdC5zdGF0dXMgIT09IDIwMCB8fCAhdHJpcHMkLnJlc3VsdC5kYXRhIHx8ICF0cmlwcyQucmVzdWx0LmRhdGFbIDAgXSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBjdHguYm9keSA9IHtcbiAgICAgICAgICAgICAgICAgICAgc3RhdHVzOiA0MDAsXG4gICAgICAgICAgICAgICAgICAgIG1lc3NhZ2U6IGDmmoLml6DooYznqIvorqHliJLvvIzmmoLml7bkuI3og73otK3kubDvvZ5gXG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8g5pyA5paw5Y+v55So6KGM56iLXG4gICAgICAgICAgICBjb25zdCB0cmlwID0gdHJpcHMkLnJlc3VsdC5kYXRhWyAwIF07XG5cbiAgICAgICAgICAgIC8vIDLjgIHliKTmlq3lnKjor6XooYznqIvotK3nianmuIXljZXvvIzov5nkupvllYblk4HmmK/lkKblrZjlnKjlt7Lnu4/kubDkuI3lhajjgIHkubDkuI3liLDvvIzkuI3mmK/nmoTor53vvIzliJnliJvlu7rooYznqIvotK3nianmuIXljZVcblxuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiAhIOiuouWNleS4u+S6uueahG9wZW5pZFxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICBsZXQgb3BlbmlkO1xuXG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqICEg5qC55o2u5Zyw5Z2A5a+56LGh77yM5ou/5Yiw5Zyw5Z2AaWRcbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgbGV0IGFkZHJlc3NpZCQgPSB7XG4gICAgICAgICAgICAgICAgcmVzdWx0OiB7XG4gICAgICAgICAgICAgICAgICAgIGRhdGE6IG51bGwsXG4gICAgICAgICAgICAgICAgICAgIHN0YXR1czogNTAwXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgLy8gM+OAgeagueaNruadpea6kO+8jOaVtOeQhuWcsOWdgGlkXG4gICAgICAgICAgICAvLyDorqLljZXmnaXmupDvvJrotK3nianovaZcbiAgICAgICAgICAgIGlmICggZXZlbnQuZGF0YS5mcm9tID09PSAnY2FydCcgKSB7XG4gICAgICAgICAgICAgICAgb3BlbmlkID0gZXZlbnQuZGF0YS5vcGVuSWQ7XG4gICAgICAgICAgICAgICAgYWRkcmVzc2lkJCA9IGF3YWl0IGNsb3VkLmNhbGxGdW5jdGlvbih7XG4gICAgICAgICAgICAgICAgICAgIGRhdGE6IHsgXG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYWRkcmVzczogZXZlbnQuZGF0YS5vcmRlcnNbIDAgXS5hZGRyZXNzXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgJHVybDogJ2dldEFkZHJlc3NJZCdcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgbmFtZTogJ2FkZHJlc3MnXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGlmICggYWRkcmVzc2lkJC5yZXN1bHQuc3RhdHVzICE9PSAyMDAgKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGN0eC5ib2R5ID0ge1xuICAgICAgICAgICAgICAgICAgICBzdGF0dXM6IDUwMCxcbiAgICAgICAgICAgICAgICAgICAgbWVzc2FnZTogJ+afpeivouWcsOWdgOmUmeivrydcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyDlj6/nlKjlnLDlnYBpZFxuICAgICAgICAgICAgY29uc3QgYWlkID0gYWRkcmVzc2lkJC5yZXN1bHQuZGF0YTtcblxuICAgICAgICAgICAgLy8gNOOAgeaJuemHj+WIm+W7uuiuouWNle+8jO+8iOi/h+a7pOaOieS4jeiDveWIm+W7uui0reeJqea4heWNleeahOWVhuWTge+8iVxuICAgICAgICAgICAgY29uc3QgdGVtcCA9IGV2ZW50LmRhdGEub3JkZXJzLm1hcCggbWV0YSA9PiB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIE9iamVjdC5hc3NpZ24oeyB9LCBtZXRhLCB7XG4gICAgICAgICAgICAgICAgICAgIGFpZCxcbiAgICAgICAgICAgICAgICAgICAgdGlkOiB0cmlwLl9pZCxcbiAgICAgICAgICAgICAgICAgICAgb3BlbmlkOiBvcGVuaWQsXG4gICAgICAgICAgICAgICAgICAgIGNyZWF0ZVRpbWU6IG5ldyBEYXRlKCApLmdldFRpbWUoICksXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgLy8gNeOAgeaJuemHj+WKoOWFpeaIluWIm+W7uui0reeJqea4heWNlVxuXG4gICAgICAgICAgICAvLyA244CB5om56YeP5Yig6Zmk5bey5Yqg5YWl6LSt54mp5riF5Y2V55qE6LSt54mp6L2m5ZWG5ZOBXG4gICAgXG4gICAgICAgICAgICByZXR1cm4gY3R4LmJvZHkgPSB7XG4gICAgICAgICAgICAgICAgc3RhdHVzOiAyMDAsXG4gICAgICAgICAgICAgICAgZGF0YTogdGVtcCxcbiAgICAgICAgICAgICAgICBtZXNzYWdlOiAn6LSt5Lmw5oiQ5Yqf77yBJ1xuICAgICAgICAgICAgfTtcblxuICAgICAgICB9IGNhdGNoICggZSApIHtcbiAgICAgXG4gICAgICAgICAgICByZXR1cm4gY3R4LmJvZHkgPSB7XG4gICAgICAgICAgICAgICAgc3RhdHVzOiA1MDAsXG4gICAgICAgICAgICAgICAgbWVzc2FnZTogZVxuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgcmV0dXJuIGFwcC5zZXJ2ZSggKTtcblxufSJdfQ==