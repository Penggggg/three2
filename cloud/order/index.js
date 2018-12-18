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
            var _a, tid, from, orders, openid_1, trips$$, trips$, trip, addressid$, aid_1, temp, e_1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 4, , 5]);
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
                            return [2, ctx.body = {
                                    status: 400,
                                    message: "\u6682\u65E0\u884C\u7A0B\u8BA1\u5212\uFF0C\u6682\u65F6\u4E0D\u80FD\u8D2D\u4E70\uFF5E"
                                }];
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
                            return [2, ctx.body = {
                                    status: 500,
                                    message: '查询地址错误'
                                }];
                        }
                        aid_1 = addressid$.result.data;
                        temp = event.data.orders.map(function (meta) {
                            var t = Object.assign({}, meta, {
                                aid: aid_1,
                                openid: openid_1,
                                deliver_status: '0',
                                base_status: '0',
                                createTime: new Date().getTime(),
                            });
                            delete t['address'];
                            return t;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFDQSxpQkFzS0M7O0FBdEtELHFDQUF1QztBQUN2QyxzQ0FBd0M7QUFFeEMsS0FBSyxDQUFDLElBQUksRUFBRyxDQUFDO0FBRWQsSUFBTSxFQUFFLEdBQWdCLEtBQUssQ0FBQyxRQUFRLEVBQUcsQ0FBQztBQXVCN0IsUUFBQSxJQUFJLEdBQUcsVUFBUSxLQUFLLEVBQUUsT0FBTzs7OztRQUVoQyxHQUFHLEdBQUcsSUFBSSxTQUFTLENBQUMsRUFBRSxLQUFLLE9BQUEsRUFBRSxDQUFDLENBQUM7UUE4QnJDLEdBQUcsQ0FBQyxNQUFNLENBQUMsUUFBUSxFQUFFLFVBQU8sR0FBRyxFQUFFLElBQUk7Ozs7Ozt3QkFHdkIsS0FBd0IsS0FBSyxDQUFDLElBQUksRUFBaEMsR0FBRyxTQUFBLEVBQUUsSUFBSSxVQUFBLEVBQUUsTUFBTSxZQUFBLENBQWdCO3dCQUNuQyxXQUFTLEtBQUssQ0FBQyxJQUFJLENBQUMsTUFBTSxJQUFJLEtBQUssQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDO3dCQUcxQyxXQUFNLEtBQUssQ0FBQyxZQUFZLENBQUM7Z0NBQ3JDLElBQUksRUFBRTtvQ0FDRixJQUFJLEVBQUU7d0NBQ0YsR0FBRyxFQUFFLEdBQUc7cUNBQ1g7b0NBQ0QsSUFBSSxFQUFFLFFBQVE7aUNBQ2pCO2dDQUNELElBQUksRUFBRSxNQUFNOzZCQUNmLENBQUMsRUFBQTs7d0JBUkksT0FBTyxHQUFHLFNBUWQ7d0JBRUksTUFBTSxHQUFHLE9BQU8sQ0FBQyxNQUFNLENBQUM7d0JBQzlCLElBQUssTUFBTSxDQUFDLE1BQU0sS0FBSyxHQUFHOytCQUNmLENBQUMsTUFBTSxDQUFDLElBQUk7K0JBQ1osQ0FBRSxDQUFDLENBQUMsTUFBTSxDQUFDLElBQUksSUFBSSxNQUFNLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBRTsrQkFDekMsQ0FBRSxDQUFDLENBQUMsTUFBTSxDQUFDLElBQUksSUFBSSxJQUFJLElBQUksRUFBRyxDQUFDLE9BQU8sRUFBRyxJQUFJLE1BQU0sQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFFLEVBQUU7NEJBQzVFLFdBQU8sR0FBRyxDQUFDLElBQUksR0FBRztvQ0FDZCxNQUFNLEVBQUUsR0FBRztvQ0FDWCxPQUFPLEVBQUUsc0ZBQWdCO2lDQUM1QixFQUFDO3lCQUNMO3dCQUdLLElBQUksR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDO3dCQU1yQixVQUFVLEdBQUc7NEJBQ2IsTUFBTSxFQUFFO2dDQUNKLElBQUksRUFBRSxJQUFJO2dDQUNWLE1BQU0sRUFBRSxHQUFHOzZCQUNkO3lCQUNKLENBQUM7NkJBR0csQ0FBQSxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksS0FBSyxNQUFNLElBQUksS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLEtBQUssUUFBUSxDQUFBLEVBQTFELGNBQTBEO3dCQUM5QyxXQUFNLEtBQUssQ0FBQyxZQUFZLENBQUM7Z0NBQ2xDLElBQUksRUFBRTtvQ0FDRixJQUFJLEVBQUU7d0NBQ0YsTUFBTSxFQUFFLFFBQU07d0NBQ2QsT0FBTyxFQUFFLEtBQUssQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFFLENBQUMsQ0FBRSxDQUFDLE9BQU87cUNBQzFDO29DQUNELElBQUksRUFBRSxjQUFjO2lDQUN2QjtnQ0FDRCxJQUFJLEVBQUUsU0FBUzs2QkFDbEIsQ0FBQyxFQUFBOzt3QkFURixVQUFVLEdBQUcsU0FTWCxDQUFDOzs7d0JBSVAsSUFBSSxDQUFFLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxLQUFLLE1BQU0sSUFBSSxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksS0FBSyxRQUFRLENBQUUsSUFBSSxVQUFVLENBQUMsTUFBTSxDQUFDLE1BQU0sS0FBSyxHQUFHLEVBQUc7NEJBQ3JHLFdBQU8sR0FBRyxDQUFDLElBQUksR0FBRztvQ0FDZCxNQUFNLEVBQUUsR0FBRztvQ0FDWCxPQUFPLEVBQUUsUUFBUTtpQ0FDcEIsRUFBQzt5QkFDTDt3QkFHSyxRQUFNLFVBQVUsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDO3dCQUc3QixJQUFJLEdBQUcsS0FBSyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFFLFVBQUEsSUFBSTs0QkFDcEMsSUFBTSxDQUFDLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQyxFQUFHLEVBQUUsSUFBSSxFQUFFO2dDQUkvQixHQUFHLE9BQUE7Z0NBQ0gsTUFBTSxFQUFFLFFBQU07Z0NBQ2QsY0FBYyxFQUFFLEdBQUc7Z0NBQ25CLFdBQVcsRUFBRSxHQUFHO2dDQUNoQixVQUFVLEVBQUUsSUFBSSxJQUFJLEVBQUcsQ0FBQyxPQUFPLEVBQUc7NkJBQ3JDLENBQUMsQ0FBQzs0QkFDSCxPQUFPLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQzs0QkFDcEIsT0FBTyxDQUFDLENBQUM7d0JBQ2IsQ0FBQyxDQUFDLENBQUM7d0JBUUgsV0FBTyxHQUFHLENBQUMsSUFBSSxHQUFHO2dDQUNkLE1BQU0sRUFBRSxHQUFHO2dDQUNYLElBQUksRUFBRSxJQUFJO2dDQUNWLE9BQU8sRUFBRSxPQUFPOzZCQUNuQixFQUFDOzs7d0JBSUYsV0FBTyxHQUFHLENBQUMsSUFBSSxHQUFHO2dDQUNkLE1BQU0sRUFBRSxHQUFHO2dDQUNYLE9BQU8sRUFBRSxHQUFDOzZCQUNiLEVBQUM7Ozs7YUFFVCxDQUFDLENBQUM7UUFFSCxXQUFPLEdBQUcsQ0FBQyxLQUFLLEVBQUcsRUFBQzs7S0FFdkIsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbIlxuaW1wb3J0ICogYXMgY2xvdWQgZnJvbSAnd3gtc2VydmVyLXNkayc7XG5pbXBvcnQgKiBhcyBUY2JSb3V0ZXIgZnJvbSAndGNiLXJvdXRlcic7XG5cbmNsb3VkLmluaXQoICk7XG5cbmNvbnN0IGRiOiBEQi5EYXRhYmFzZSA9IGNsb3VkLmRhdGFiYXNlKCApO1xuXG4vKipcbiAqIFxuICogQGRlc2NyaXB0aW9uIOiuouWNleaooeWdl1xuICogLS0tLS0tLS0g5a2X5q61IC0tLS0tLS0tLS1cbiAqIF9pZFxuICogb3BlbmlkLFxuICogY3JlYXRldGltZVxuICogdGlkLFxuICogcGlkLFxuICogISBzaWQsICjlj6/kuLrnqbopXG4gKiBjb3VudCxcbiAqIHByaWNlLFxuICogISBncm91cF9wcmljZSAo5Y+v5Li656m6KVxuICogdHlwZTogJ2N1c3RvbScgfCAnbm9ybWFsJyB8ICdwcmUnIOiHquWumuS5ieWKoOWNleOAgeaZrumAmuWKoOWNleOAgemihOiuouWNlVxuICogaW1nOiBBcnJheVsgc3RyaW5nIF1cbiAqICEgZGVzY++8iOWPr+S4uuepuu+8iSxcbiAqIGFpZFxuICogISBiYXNlX3N0YXR1czogMCwxLDIsMyw0IOi/m+ihjOS4re+8iOWuouaIt+i/mOWPr+S7peiwg+aVtOiHquW3seeahOiuouWNle+8ie+8jOW3sui0reS5sO+8jOW3suiwg+aVtO+8jOW3sue7k+eul++8jOW3suWPlua2iFxuICogISBwYXlfc3RhdHVzOiAwLDEsMiDmnKrku5jmrL7vvIzlt7Lku5jorqLph5HvvIzlt7Lku5jlhajmrL5cbiAqICEgZGVsaXZlcl9zdGF0dXM6IDAsMSDmnKrlj5HluIPvvIzlt7Llj5HluIPjgIFcbiAqL1xuZXhwb3J0IGNvbnN0IG1haW4gPSBhc3luYyAoIGV2ZW50LCBjb250ZXh0ICkgPT4ge1xuXG4gICAgY29uc3QgYXBwID0gbmV3IFRjYlJvdXRlcih7IGV2ZW50IH0pO1xuXG4gICAgLyoqXG4gICAgICogQGRlc2NyaXB0aW9uIOWIm+W7uuiuouWNlVxuICAgICAqIC0tLS0tLS0tIOivt+axgiAtLS0tLS0tLS0tXG4gICAgICoge1xuICAgICAqICAgICAgdGlkLFxuICAgICAqICAgICAgb3BlbklkIC8vIOiuouWNleS4u+S6ulxuICAgICAqICAgICAgZnJvbTogJ2NhcnQnIHwgJ2J1eScgfCAnY3VzdG9tJyB8ICdhZ2VudHMnIHwgJ3N5c3RlbScg5p2l5rqQ77ya6LSt54mp6L2m44CB55u05o6l6LSt5Lmw44CB6Ieq5a6a5LmJ5LiL5Y2V44CB5Luj6LSt5LiL5Y2V44CB57O757uf5Y+R6LW36aKE5LuY6K6i5Y2VXG4gICAgICogICAgICBvcmRlcnM6IEFycmF5PHsgXG4gICAgICogICAgICAgICAgdGlkXG4gICAgICogICAgICAgICAgY2lkXG4gICAgICogICAgICAgICAgc2lkXG4gICAgICogICAgICAgICAgcGlkXG4gICAgICogICAgICAgICAgcHJpY2VcbiAgICAgKiAgICAgICAgICBncm91cFByaWNlXG4gICAgICogICAgICAgICAgY291bnRcbiAgICAgKiAgICAgICAgICBkZXNjXG4gICAgICogICAgICAgICAgaW1nXG4gICAgICogICAgICAgICAgdHlwZVxuICAgICAqICAgICAgICAgIHBheV9zdGF0dXMsXG4gICAgICogICAgICAgICAgYWRkcmVzczoge1xuICAgICAqICAgICAgICAgICAgICBuYW1lLFxuICAgICAqICAgICAgICAgICAgICBwaG9uZSxcbiAgICAgKiAgICAgICAgICAgICAgZGV0YWlsLFxuICAgICAqICAgICAgICAgICAgICBwb3N0YWxjb2RlXG4gICAgICogICAgICAgICAgfVxuICAgICAqICAgICAgfT5cbiAgICAgKiB9XG4gICAgICovXG4gICAgYXBwLnJvdXRlcignY3JlYXRlJywgYXN5bmMoIGN0eCwgbmV4dCApID0+IHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgY29uc3QgeyB0aWQsIGZyb20sIG9yZGVycyB9ID0gZXZlbnQuZGF0YTtcbiAgICAgICAgICAgIGNvbnN0IG9wZW5pZCA9IGV2ZW50LmRhdGEub3BlbklkIHx8IGV2ZW50LnVzZXJJbmZvLm9wZW5JZDtcblxuICAgICAgICAgICAgLy8gMeOAgeWIpOaWreivpeihjOeoi+aYr+WQpuWPr+S7peeUqFxuICAgICAgICAgICAgY29uc3QgdHJpcHMkJCA9IGF3YWl0IGNsb3VkLmNhbGxGdW5jdGlvbih7XG4gICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBfaWQ6IHRpZFxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAkdXJsOiAnZGV0YWlsJ1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgbmFtZTogJ3RyaXAnXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgY29uc3QgdHJpcHMkID0gdHJpcHMkJC5yZXN1bHQ7ICAgICAgICBcbiAgICAgICAgICAgIGlmICggdHJpcHMkLnN0YXR1cyAhPT0gMjAwXG4gICAgICAgICAgICAgICAgICAgIHx8ICF0cmlwcyQuZGF0YSBcbiAgICAgICAgICAgICAgICAgICAgfHwgKCAhIXRyaXBzJC5kYXRhICYmIHRyaXBzJC5kYXRhLmlzQ2xvc2VkICkgXG4gICAgICAgICAgICAgICAgICAgIHx8ICggISF0cmlwcyQuZGF0YSAmJiBuZXcgRGF0ZSggKS5nZXRUaW1lKCApID49IHRyaXBzJC5kYXRhLmVuZF9kYXRlICkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gY3R4LmJvZHkgPSB7XG4gICAgICAgICAgICAgICAgICAgIHN0YXR1czogNDAwLFxuICAgICAgICAgICAgICAgICAgICBtZXNzYWdlOiBg5pqC5peg6KGM56iL6K6h5YiS77yM5pqC5pe25LiN6IO96LSt5Lmw772eYFxuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIOacgOaWsOWPr+eUqOihjOeoi1xuICAgICAgICAgICAgY29uc3QgdHJpcCA9IHRyaXBzJC5kYXRhO1xuXG5cbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICog5qC55o2u5Zyw5Z2A5a+56LGh77yM5ou/5Yiw5Zyw5Z2AaWRcbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgbGV0IGFkZHJlc3NpZCQgPSB7XG4gICAgICAgICAgICAgICAgcmVzdWx0OiB7XG4gICAgICAgICAgICAgICAgICAgIGRhdGE6IG51bGwsXG4gICAgICAgICAgICAgICAgICAgIHN0YXR1czogNTAwXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgLy8g6K6i5Y2V5p2l5rqQ77ya6LSt54mp6L2m44CB57O757uf5Yqg5Y2VXG4gICAgICAgICAgICBpZiAoIGV2ZW50LmRhdGEuZnJvbSA9PT0gJ2NhcnQnIHx8IGV2ZW50LmRhdGEuZnJvbSA9PT0gJ3N5c3RlbScgKSB7XG4gICAgICAgICAgICAgICAgYWRkcmVzc2lkJCA9IGF3YWl0IGNsb3VkLmNhbGxGdW5jdGlvbih7XG4gICAgICAgICAgICAgICAgICAgIGRhdGE6IHsgXG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb3BlbklkOiBvcGVuaWQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYWRkcmVzczogZXZlbnQuZGF0YS5vcmRlcnNbIDAgXS5hZGRyZXNzXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgJHVybDogJ2dldEFkZHJlc3NJZCdcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgbmFtZTogJ2FkZHJlc3MnXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIC8vIOiuouWNleadpea6kO+8mui0reeJqei9puOAgeezu+e7n+WKoOWNlVxuICAgICAgICAgICAgaWYgKCggZXZlbnQuZGF0YS5mcm9tID09PSAnY2FydCcgfHwgZXZlbnQuZGF0YS5mcm9tID09PSAnc3lzdGVtJyApICYmIGFkZHJlc3NpZCQucmVzdWx0LnN0YXR1cyAhPT0gMjAwICkge1xuICAgICAgICAgICAgICAgIHJldHVybiBjdHguYm9keSA9IHtcbiAgICAgICAgICAgICAgICAgICAgc3RhdHVzOiA1MDAsXG4gICAgICAgICAgICAgICAgICAgIG1lc3NhZ2U6ICfmn6Xor6LlnLDlnYDplJnor68nXG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8g5Y+v55So5Zyw5Z2AaWRcbiAgICAgICAgICAgIGNvbnN0IGFpZCA9IGFkZHJlc3NpZCQucmVzdWx0LmRhdGE7XG5cbiAgICAgICAgICAgIC8vIDPjgIHmibnph4/liJvlu7rorqLljZXvvIzvvIjov4fmu6TmjonkuI3og73liJvlu7rotK3nianmuIXljZXnmoTllYblk4HvvIlcbiAgICAgICAgICAgIGNvbnN0IHRlbXAgPSBldmVudC5kYXRhLm9yZGVycy5tYXAoIG1ldGEgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IHQgPSBPYmplY3QuYXNzaWduKHsgfSwgbWV0YSwge1xuICAgICAgICAgICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAgICAgICAgICogISBkZWxpdmVyX3N0YXR1c+S4uuacquWPkeW4gyDlj6/og73mnInpl67pophcbiAgICAgICAgICAgICAgICAgICAgICovXG4gICAgICAgICAgICAgICAgICAgIGFpZCxcbiAgICAgICAgICAgICAgICAgICAgb3BlbmlkOiBvcGVuaWQsXG4gICAgICAgICAgICAgICAgICAgIGRlbGl2ZXJfc3RhdHVzOiAnMCcsIFxuICAgICAgICAgICAgICAgICAgICBiYXNlX3N0YXR1czogJzAnLCAvLyDnu5/kuIDkuLrmnKrku5jmrL7vvIzorqLljZXmlK/ku5jlkI7lho3ljrvmm7TmlrBcbiAgICAgICAgICAgICAgICAgICAgY3JlYXRlVGltZTogbmV3IERhdGUoICkuZ2V0VGltZSggKSxcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICBkZWxldGUgdFsnYWRkcmVzcyddO1xuICAgICAgICAgICAgICAgIHJldHVybiB0O1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIC8vIDTjgIHmibnph4/liJvlu7rorqLljZVcblxuICAgICAgICAgICAgLy8gNeOAgeaJuemHj+WKoOWFpeaIluWIm+W7uui0reeJqea4heWNlVxuXG4gICAgICAgICAgICAvLyA244CB5om56YeP5Yig6Zmk5bey5Yqg5YWl6LSt54mp5riF5Y2V5oiW6aKE5LuY6K6i5Y2V55qE6LSt54mp6L2m5ZWG5ZOB77yM5aaC5p6c5pyJY2lk55qE6K+dXG4gICAgXG4gICAgICAgICAgICByZXR1cm4gY3R4LmJvZHkgPSB7XG4gICAgICAgICAgICAgICAgc3RhdHVzOiAyMDAsXG4gICAgICAgICAgICAgICAgZGF0YTogdGVtcCxcbiAgICAgICAgICAgICAgICBtZXNzYWdlOiAn6LSt5Lmw5oiQ5Yqf77yBJ1xuICAgICAgICAgICAgfTtcblxuICAgICAgICB9IGNhdGNoICggZSApIHtcbiAgICAgXG4gICAgICAgICAgICByZXR1cm4gY3R4LmJvZHkgPSB7XG4gICAgICAgICAgICAgICAgc3RhdHVzOiA1MDAsXG4gICAgICAgICAgICAgICAgbWVzc2FnZTogZVxuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgcmV0dXJuIGFwcC5zZXJ2ZSggKTtcblxufSJdfQ==