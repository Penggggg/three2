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
var _ = db.command;
exports.main = function (event, context) { return __awaiter(_this, void 0, void 0, function () {
    var app;
    var _this = this;
    return __generator(this, function (_a) {
        app = new TcbRouter({ event: event });
        app.router('create', function (ctx, next) { return __awaiter(_this, void 0, void 0, function () {
            var _a, tid, from, orders, openid_1, trips$$, trips$, trip, addressid$, aid_1, isNew$, isNew, pay_status_1, p, temp_1, save$, order_result, e_1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 6, , 7]);
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
                        return [4, cloud.callFunction({
                                name: 'common',
                                data: {
                                    $url: 'is-new-customer',
                                    data: {
                                        openId: openid_1
                                    }
                                }
                            })];
                    case 4:
                        isNew$ = _b.sent();
                        isNew = isNew$.result.data;
                        pay_status_1 = '0';
                        p = trip.payment;
                        if (isNew && p === '0') {
                            pay_status_1 = '0';
                        }
                        else if (isNew && p === '1') {
                            pay_status_1 = '0';
                        }
                        else if (isNew && p === '2') {
                            pay_status_1 = '1';
                        }
                        else if (!isNew && p === '0') {
                            pay_status_1 = '1';
                        }
                        else if (!isNew && p === '1') {
                            pay_status_1 = '0';
                        }
                        else if (!isNew && p === '2') {
                            pay_status_1 = '1';
                        }
                        else {
                            pay_status_1 = '0';
                        }
                        temp_1 = event.data.orders.map(function (meta) {
                            var t = Object.assign({}, meta, {
                                aid: aid_1,
                                isOccupied: true,
                                openid: openid_1,
                                deliver_status: '0',
                                base_status: '0',
                                pay_status: meta.depositPrice === 0 ? '1' : pay_status_1,
                                createTime: new Date().getTime(),
                                type: !!meta.depositPrice ? meta.type : 'normal'
                            });
                            delete t['address'];
                            return t;
                        });
                        return [4, Promise.all(temp_1.map(function (o) {
                                return create_1.create$(openid_1, o, db, ctx);
                            }))];
                    case 5:
                        save$ = _b.sent();
                        if (save$.some(function (x) { return x.status !== 200; })) {
                            throw '创建订单错误！';
                        }
                        order_result = save$.map(function (x, k) {
                            var _a = temp_1[k], price = _a.price, count = _a.count, pay_status = _a.pay_status, depositPrice = _a.depositPrice;
                            return {
                                oid: x.data._id,
                                price: price,
                                count: count,
                                pay_status: pay_status,
                                depositPrice: depositPrice
                            };
                        });
                        return [2, ctx.body = {
                                status: 200,
                                data: order_result
                            }];
                    case 6:
                        e_1 = _b.sent();
                        return [2, ctx.body = {
                                status: 500,
                                message: e_1
                            }];
                    case 7: return [2];
                }
            });
        }); });
        app.router('list', function (ctx, next) { return __awaiter(_this, void 0, void 0, function () {
            var limit, where$, type, openid, total$, data$, last, fix$, meta, trips$_1, meta2, e_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 6, , 7]);
                        limit = 2;
                        where$ = {};
                        type = event.data.type;
                        openid = event.userInfo.openId;
                        if (type === 'my-all') {
                            where$ = {
                                openid: openid
                            };
                        }
                        else if (type === 'my-notpay') {
                            where$ = _.and({
                                openid: openid,
                                base_status: '2'
                            }, _.or([
                                {
                                    type: 'pre'
                                }, {
                                    pay_status: _.or(_.eq('0'), _.eq('1'))
                                }
                            ]));
                        }
                        else if (type === 'my-delive') {
                            where$ = {
                                openid: openid,
                                pay_status: '2',
                                deliver_status: '0'
                            };
                        }
                        else if (type === 'my-finish') {
                            where$ = {
                                openid: openid,
                                pay_status: '2',
                                deliver_status: '1'
                            };
                        }
                        return [4, db.collection('order')
                                .where(where$)
                                .count()];
                    case 1:
                        total$ = _a.sent();
                        return [4, db.collection('order')
                                .where(where$)
                                .orderBy('createTime', 'desc')
                                .limit(limit)
                                .skip(event.data.skip || (event.data.page - 1) * limit)
                                .get()];
                    case 2:
                        data$ = _a.sent();
                        last = data$.data[data$.data.length - 1];
                        fix$ = {
                            data: []
                        };
                        if (!last) return [3, 4];
                        return [4, db.collection('order')
                                .where({
                                openid: openid,
                                tid: last.tid
                            })
                                .orderBy('createTime', 'desc')
                                .skip(event.data.skip ? event.data.skip + data$.data.length : (event.data.page - 1) * limit + data$.data.length)
                                .get()];
                    case 3:
                        fix$ = _a.sent();
                        _a.label = 4;
                    case 4:
                        meta = data$.data.concat(fix$.data);
                        return [4, Promise.all(meta.map(function (x) {
                                return db.collection('trip')
                                    .where({
                                    _id: x.tid
                                })
                                    .field({
                                    title: true,
                                    start_date: true,
                                    payment: true,
                                    postage: true,
                                    postagefree_atleast: true
                                })
                                    .get();
                            }))];
                    case 5:
                        trips$_1 = _a.sent();
                        meta2 = meta.map(function (x, i) { return Object.assign({}, x, {
                            trip: trips$_1[i].data[0]
                        }); });
                        return [2, ctx.body = {
                                status: 200,
                                data: {
                                    data: meta2,
                                    pageSize: limit,
                                    total: total$.total,
                                    page: fix$.data.length === 0 ? event.data.page : event.data.page + Math.ceil(fix$.data.length / limit),
                                    current: event.data.skip ? event.data.skip + meta.length : (event.data.page - 1) * limit + meta.length,
                                    totalPage: Math.ceil(total$.total / limit)
                                }
                            }];
                    case 6:
                        e_2 = _a.sent();
                        return [2, ctx.body = { status: 500 }];
                    case 7: return [2];
                }
            });
        }); });
        app.router('upadte-to-payed', function (ctx, next) { return __awaiter(_this, void 0, void 0, function () {
            var orderIds, e_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        orderIds = event.data.orderIds;
                        return [4, Promise.all(orderIds.split(',').map(function (oid) {
                                return db.collection('order').doc(oid)
                                    .update({
                                    data: {
                                        pay_status: '1'
                                    }
                                });
                            }))];
                    case 1:
                        _a.sent();
                        return [2, ctx.body = {
                                status: 200
                            }];
                    case 2:
                        e_3 = _a.sent();
                        return [2, ctx.body = { status: 500 }];
                    case 3: return [2];
                }
            });
        }); });
        return [2, app.serve()];
    });
}); };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFDQSxpQkFxWUM7O0FBcllELHFDQUF1QztBQUN2QyxzQ0FBd0M7QUFDeEMsbUNBQW1DO0FBRW5DLEtBQUssQ0FBQyxJQUFJLEVBQUcsQ0FBQztBQUVkLElBQU0sRUFBRSxHQUFnQixLQUFLLENBQUMsUUFBUSxFQUFHLENBQUM7QUFFMUMsSUFBTSxDQUFDLEdBQUcsRUFBRSxDQUFDLE9BQU8sQ0FBQztBQTBCUixRQUFBLElBQUksR0FBRyxVQUFRLEtBQUssRUFBRSxPQUFPOzs7O1FBRWhDLEdBQUcsR0FBRyxJQUFJLFNBQVMsQ0FBQyxFQUFFLEtBQUssT0FBQSxFQUFFLENBQUMsQ0FBQztRQWdDckMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxRQUFRLEVBQUUsVUFBTyxHQUFHLEVBQUUsSUFBSTs7Ozs7O3dCQUd2QixLQUF3QixLQUFLLENBQUMsSUFBSSxFQUFoQyxHQUFHLFNBQUEsRUFBRSxJQUFJLFVBQUEsRUFBRSxNQUFNLFlBQUEsQ0FBZ0I7d0JBQ25DLFdBQVMsS0FBSyxDQUFDLElBQUksQ0FBQyxNQUFNLElBQUksS0FBSyxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUM7d0JBRzFDLFdBQU0sS0FBSyxDQUFDLFlBQVksQ0FBQztnQ0FDckMsSUFBSSxFQUFFO29DQUNGLElBQUksRUFBRTt3Q0FDRixHQUFHLEVBQUUsR0FBRztxQ0FDWDtvQ0FDRCxJQUFJLEVBQUUsUUFBUTtpQ0FDakI7Z0NBQ0QsSUFBSSxFQUFFLE1BQU07NkJBQ2YsQ0FBQyxFQUFBOzt3QkFSSSxPQUFPLEdBQUcsU0FRZDt3QkFFSSxNQUFNLEdBQUcsT0FBTyxDQUFDLE1BQU0sQ0FBQzt3QkFDOUIsSUFBSyxNQUFNLENBQUMsTUFBTSxLQUFLLEdBQUc7K0JBQ2YsQ0FBQyxNQUFNLENBQUMsSUFBSTsrQkFD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QUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUUsVUFBQSxHQUFHO2dDQUMzQyxPQUFPLEVBQUUsQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLENBQUMsR0FBRyxDQUFFLEdBQUcsQ0FBRTtxQ0FDbkMsTUFBTSxDQUFDO29DQUNKLElBQUksRUFBRTt3Q0FDRixVQUFVLEVBQUUsR0FBRztxQ0FDbEI7aUNBQ0osQ0FBQyxDQUFDOzRCQUNYLENBQUMsQ0FBQyxDQUFDLEVBQUE7O3dCQVBILFNBT0csQ0FBQzt3QkFFSixXQUFPLEdBQUcsQ0FBQyxJQUFJLEdBQUc7Z0NBQ2QsTUFBTSxFQUFFLEdBQUc7NkJBQ2QsRUFBQTs7O3dCQUdELFdBQU8sR0FBRyxDQUFDLElBQUksR0FBRyxFQUFFLE1BQU0sRUFBRSxHQUFHLEVBQUUsRUFBQzs7OzthQUV6QyxDQUFDLENBQUE7UUFFSCxXQUFPLEdBQUcsQ0FBQyxLQUFLLEVBQUcsRUFBQzs7S0FFdEIsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbIlxuaW1wb3J0ICogYXMgY2xvdWQgZnJvbSAnd3gtc2VydmVyLXNkayc7XG5pbXBvcnQgKiBhcyBUY2JSb3V0ZXIgZnJvbSAndGNiLXJvdXRlcic7XG5pbXBvcnQgeyBjcmVhdGUkIH0gZnJvbSAnLi9jcmVhdGUnO1xuXG5jbG91ZC5pbml0KCApO1xuXG5jb25zdCBkYjogREIuRGF0YWJhc2UgPSBjbG91ZC5kYXRhYmFzZSggKTtcblxuY29uc3QgXyA9IGRiLmNvbW1hbmQ7XG5cbi8qKlxuICogXG4gKiBAZGVzY3JpcHRpb24g6K6i5Y2V5qih5Z2XXG4gKiAtLS0tLS0tLSDlrZfmrrUgLS0tLS0tLS0tLVxuICogX2lkXG4gKiBvcGVuaWQsXG4gKiBjcmVhdGV0aW1lXG4gKiB0aWQsXG4gKiBwaWQsXG4gKiAhIGNpZCAo5Y+v5Li656m6KVxuICogISBzaWQsICjlj6/kuLrnqbopXG4gKiBjb3VudCxcbiAqIHByaWNlLFxuICogZGVwb3NpdF9wcmljZTog5ZWG5ZOB6K6i6YeRICjlj6/kuLrnqbopXG4gKiEgaXNPY2N1cGllZCwg5piv5ZCm5Y2g5bqT5a2YXG4gKiAhIGdyb3VwX3ByaWNlICjlj6/kuLrnqbopXG4gKiB0eXBlOiAnY3VzdG9tJyB8ICdub3JtYWwnIHwgJ3ByZScg6Ieq5a6a5LmJ5Yqg5Y2V44CB5pmu6YCa5Yqg5Y2V44CB6aKE6K6i5Y2VXG4gKiBpbWc6IEFycmF5WyBzdHJpbmcgXVxuICogISBkZXNj77yI5Y+v5Li656m677yJLFxuICogYWlkXG4gKiAhIGJhc2Vfc3RhdHVzOiAwLDEsMiwzLDQsNSDov5vooYzkuK3vvIjlrqLmiLfov5jlj6/ku6XosIPmlbToh6rlt7HnmoTorqLljZXvvInvvIzku6PotK3lt7LotK3kubDvvIzlt7LosIPmlbTvvIzlt7Lnu5PnrpfvvIzlt7Llj5bmtojvvIjkubDkuI3liLDvvInvvIzlt7Lov4fmnJ/vvIjmlK/ku5jov4fmnJ/vvIlcbiAqICEgcGF5X3N0YXR1czogMCwxLDIg5pyq5LuY5qy+77yM5bey5LuY6K6i6YeR77yM5bey5LuY5YWo5qy+XG4gKiAhIGRlbGl2ZXJfc3RhdHVzOiAwLDEg5pyq5Y+R5biD77yM5bey5Y+R5biD44CBXG4gKi9cbmV4cG9ydCBjb25zdCBtYWluID0gYXN5bmMgKCBldmVudCwgY29udGV4dCApID0+IHtcblxuICAgIGNvbnN0IGFwcCA9IG5ldyBUY2JSb3V0ZXIoeyBldmVudCB9KTtcblxuICAgIC8qKlxuICAgICAqIEBkZXNjcmlwdGlvbiDliJvlu7rorqLljZVcbiAgICAgKiAtLS0tLS0tLSDor7fmsYIgLS0tLS0tLS0tLVxuICAgICAqIHtcbiAgICAgKiAgICAgIHRpZCxcbiAgICAgKiAgICAgIG9wZW5JZCAvLyDorqLljZXkuLvkurpcbiAgICAgKiAgICAgIGZyb206ICdjYXJ0JyB8ICdidXknIHwgJ2N1c3RvbScgfCAnYWdlbnRzJyB8ICdzeXN0ZW0nIOadpea6kO+8mui0reeJqei9puOAgeebtOaOpei0reS5sOOAgeiHquWumuS5ieS4i+WNleOAgeS7o+i0reS4i+WNleOAgeezu+e7n+WPkei1t+mihOS7mOiuouWNlVxuICAgICAqICAgICAgb3JkZXJzOiBBcnJheTx7IFxuICAgICAqICAgICAgICAgIHRpZFxuICAgICAqICAgICAgICAgIGNpZFxuICAgICAqICAgICAgICAgIHNpZFxuICAgICAqICAgICAgICAgIHBpZFxuICAgICAqICAgICAgICAgIHByaWNlXG4gICAgICogICAgICAgICAgbmFtZVxuICAgICAqICAgICAgICAgIHN0YW5kZXJuYW1lXG4gICAgICogICAgICAgICAgZ3JvdXBQcmljZVxuICAgICAqICAgICAgICAgIGNvdW50XG4gICAgICogICAgICAgICAgZGVzY1xuICAgICAqICAgICAgICAgIGltZ1xuICAgICAqICAgICAgICAgIHR5cGVcbiAgICAgKiAgICAgICAgICBwYXlfc3RhdHVzLFxuICAgICAqICAgICAgICAgIGFkZHJlc3M6IHtcbiAgICAgKiAgICAgICAgICAgICAgbmFtZSxcbiAgICAgKiAgICAgICAgICAgICAgcGhvbmUsXG4gICAgICogICAgICAgICAgICAgIGRldGFpbCxcbiAgICAgKiAgICAgICAgICAgICAgcG9zdGFsY29kZVxuICAgICAqICAgICAgICAgIH1cbiAgICAgKiAgICAgIH0+XG4gICAgICogfVxuICAgICAqL1xuICAgIGFwcC5yb3V0ZXIoJ2NyZWF0ZScsIGFzeW5jKCBjdHgsIG5leHQgKSA9PiB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGNvbnN0IHsgdGlkLCBmcm9tLCBvcmRlcnMgfSA9IGV2ZW50LmRhdGE7XG4gICAgICAgICAgICBjb25zdCBvcGVuaWQgPSBldmVudC5kYXRhLm9wZW5JZCB8fCBldmVudC51c2VySW5mby5vcGVuSWQ7XG5cbiAgICAgICAgICAgIC8vIDHjgIHliKTmlq3or6XooYznqIvmmK/lkKblj6/ku6XnlKhcbiAgICAgICAgICAgIGNvbnN0IHRyaXBzJCQgPSBhd2FpdCBjbG91ZC5jYWxsRnVuY3Rpb24oe1xuICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgICAgICAgX2lkOiB0aWRcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgJHVybDogJ2RldGFpbCdcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIG5hbWU6ICd0cmlwJ1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIGNvbnN0IHRyaXBzJCA9IHRyaXBzJCQucmVzdWx0OyAgICAgICAgXG4gICAgICAgICAgICBpZiAoIHRyaXBzJC5zdGF0dXMgIT09IDIwMFxuICAgICAgICAgICAgICAgICAgICB8fCAhdHJpcHMkLmRhdGEgXG4gICAgICAgICAgICAgICAgICAgIHx8ICggISF0cmlwcyQuZGF0YSAmJiB0cmlwcyQuZGF0YS5pc0Nsb3NlZCApIFxuICAgICAgICAgICAgICAgICAgICB8fCAoICEhdHJpcHMkLmRhdGEgJiYgbmV3IERhdGUoICkuZ2V0VGltZSggKSA+PSB0cmlwcyQuZGF0YS5lbmRfZGF0ZSApKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgJ+aaguaXoOihjOeoi+iuoeWIku+8jOaaguaXtuS4jeiDvei0reS5sO+9nidcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8g5pyA5paw5Y+v55So6KGM56iLXG4gICAgICAgICAgICBjb25zdCB0cmlwID0gdHJpcHMkLmRhdGE7XG5cbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICog5qC55o2u5Zyw5Z2A5a+56LGh77yM5ou/5Yiw5Zyw5Z2AaWRcbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgbGV0IGFkZHJlc3NpZCQgPSB7XG4gICAgICAgICAgICAgICAgcmVzdWx0OiB7XG4gICAgICAgICAgICAgICAgICAgIGRhdGE6IG51bGwsXG4gICAgICAgICAgICAgICAgICAgIHN0YXR1czogNTAwXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgLy8g6K6i5Y2V5p2l5rqQ77ya6LSt54mp6L2m44CB57O757uf5Yqg5Y2VXG4gICAgICAgICAgICBpZiAoIGV2ZW50LmRhdGEuZnJvbSA9PT0gJ2NhcnQnIHx8IGV2ZW50LmRhdGEuZnJvbSA9PT0gJ3N5c3RlbScgKSB7XG4gICAgICAgICAgICAgICAgYWRkcmVzc2lkJCA9IGF3YWl0IGNsb3VkLmNhbGxGdW5jdGlvbih7XG4gICAgICAgICAgICAgICAgICAgIGRhdGE6IHsgXG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb3BlbklkOiBvcGVuaWQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYWRkcmVzczogZXZlbnQuZGF0YS5vcmRlcnNbIDAgXS5hZGRyZXNzXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgJHVybDogJ2dldEFkZHJlc3NJZCdcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgbmFtZTogJ2FkZHJlc3MnXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIC8vIOiuouWNleadpea6kO+8mui0reeJqei9puOAgeezu+e7n+WKoOWNlVxuICAgICAgICAgICAgaWYgKCggZXZlbnQuZGF0YS5mcm9tID09PSAnY2FydCcgfHwgZXZlbnQuZGF0YS5mcm9tID09PSAnc3lzdGVtJyApICYmIGFkZHJlc3NpZCQucmVzdWx0LnN0YXR1cyAhPT0gMjAwICkge1xuICAgICAgICAgICAgICAgIHRocm93ICfmn6Xor6LlnLDlnYDplJnor68nO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyDlj6/nlKjlnLDlnYBpZFxuICAgICAgICAgICAgY29uc3QgYWlkID0gYWRkcmVzc2lkJC5yZXN1bHQuZGF0YTtcblxuICAgICAgICAgICAgLy8g5piv5ZCm5paw5a6i5oi3XG4gICAgICAgICAgICBjb25zdCBpc05ldyQgPSBhd2FpdCBjbG91ZC5jYWxsRnVuY3Rpb24oe1xuICAgICAgICAgICAgICAgIG5hbWU6ICdjb21tb24nLFxuICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgJHVybDogJ2lzLW5ldy1jdXN0b21lcicsXG4gICAgICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG9wZW5JZDogb3BlbmlkXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KVxuXG4gICAgICAgICAgICBjb25zdCBpc05ldyA9IGlzTmV3JC5yZXN1bHQuZGF0YTtcblxuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiDmlrDlrqIgKyDmlrDlrqLopoHorqLph5EgPSAnMCcsXG4gICAgICAgICAgICAgKiDmlrDlrqIgKyDopoHorqLph5EgPSAnMCcsXG4gICAgICAgICAgICAgKiDmlrDlrqIgKyDlhY3orqLph5EgPSAnMScsXG4gICAgICAgICAgICAgKiDml6flrqIgKyDml6flrqLlhY3orqLph5EgPSAnMScsXG4gICAgICAgICAgICAgKiDml6flrqIgKyDopoHorqLph5EgPSAnMCcsXG4gICAgICAgICAgICAgKiDml6flrqIgKyDlhY3orqLph5EgPSAnMScsXG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIGxldCBwYXlfc3RhdHVzID0gJzAnO1xuICAgICAgICAgICAgY29uc3QgcCA9IHRyaXAucGF5bWVudDtcblxuICAgICAgICAgICAgaWYgKCBpc05ldyAmJiBwID09PSAnMCcgKSB7XG4gICAgICAgICAgICAgICAgcGF5X3N0YXR1cyA9ICcwJ1xuXG4gICAgICAgICAgICB9IGVsc2UgaWYgKCBpc05ldyAmJiBwID09PSAnMScgKSB7XG4gICAgICAgICAgICAgICAgcGF5X3N0YXR1cyA9ICcwJ1xuXG4gICAgICAgICAgICB9IGVsc2UgaWYgKCBpc05ldyAmJiBwID09PSAnMicgKSB7XG4gICAgICAgICAgICAgICAgcGF5X3N0YXR1cyA9ICcxJ1xuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgfSBlbHNlIGlmICggIWlzTmV3ICYmIHAgPT09ICcwJyApIHtcbiAgICAgICAgICAgICAgICBwYXlfc3RhdHVzID0gJzEnXG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICB9IGVsc2UgaWYgKCAhaXNOZXcgJiYgcCA9PT0gJzEnICkge1xuICAgICAgICAgICAgICAgIHBheV9zdGF0dXMgPSAnMCdcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoICFpc05ldyAmJiBwID09PSAnMicgKSB7XG4gICAgICAgICAgICAgICAgcGF5X3N0YXR1cyA9ICcxJ1xuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBwYXlfc3RhdHVzID0gJzAnXG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIDPjgIHmibnph4/liJvlu7rorqLljZXvvIzvvIjov4fmu6TmjonkuI3og73liJvlu7rotK3nianmuIXljZXnmoTllYblk4HvvIlcbiAgICAgICAgICAgIGNvbnN0IHRlbXAgPSBldmVudC5kYXRhLm9yZGVycy5tYXAoIG1ldGEgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IHQgPSBPYmplY3QuYXNzaWduKHsgfSwgbWV0YSwge1xuICAgICAgICAgICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAgICAgICAgICogISBkZWxpdmVyX3N0YXR1c+S4uuacquWPkeW4gyDlj6/og73mnInpl67pophcbiAgICAgICAgICAgICAgICAgICAgICovXG4gICAgICAgICAgICAgICAgICAgIGFpZCxcbiAgICAgICAgICAgICAgICAgICAgaXNPY2N1cGllZDogdHJ1ZSwgLy8g5Y2g6aKG5bqT5a2Y5qCH5b+XXG4gICAgICAgICAgICAgICAgICAgIG9wZW5pZDogb3BlbmlkLFxuICAgICAgICAgICAgICAgICAgICBkZWxpdmVyX3N0YXR1czogJzAnLCBcbiAgICAgICAgICAgICAgICAgICAgYmFzZV9zdGF0dXM6ICcwJyxcbiAgICAgICAgICAgICAgICAgICAgcGF5X3N0YXR1czogbWV0YS5kZXBvc2l0UHJpY2UgPT09IDAgPyAnMScgOiBwYXlfc3RhdHVzICwgLy8g5ZWG5ZOB6K6i6YeR6aKd5bqm5Li6MFxuICAgICAgICAgICAgICAgICAgICBjcmVhdGVUaW1lOiBuZXcgRGF0ZSggKS5nZXRUaW1lKCApLFxuICAgICAgICAgICAgICAgICAgICB0eXBlOiAhIW1ldGEuZGVwb3NpdFByaWNlID8gbWV0YS50eXBlIDogJ25vcm1hbCdcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICBkZWxldGUgdFsnYWRkcmVzcyddO1xuICAgICAgICAgICAgICAgIHJldHVybiB0O1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIC8vIDTjgIHmibnph4/liJvlu7rorqLljZUgKCDlkIzml7blpITnkIbljaDpoobotKflrZjnmoTpl67popggKVxuICAgICAgICAgICAgY29uc3Qgc2F2ZSQ6IGFueSA9IGF3YWl0IFByb21pc2UuYWxsKCB0ZW1wLm1hcCggbyA9PiB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGNyZWF0ZSQoIG9wZW5pZCwgbywgZGIsIGN0eCApO1xuICAgICAgICAgICAgfSkpO1xuICAgICAgICBcbiAgICAgICAgICAgIGlmICggc2F2ZSQuc29tZSggeCA9PiB4LnN0YXR1cyAhPT0gMjAwICkpIHtcbiAgICAgICAgICAgICAgICB0aHJvdyAn5Yib5bu66K6i5Y2V6ZSZ6K+v77yBJ1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyDov5Tlm57orqLljZXkv6Hmga9cbiAgICAgICAgICAgIGNvbnN0IG9yZGVyX3Jlc3VsdCA9IHNhdmUkLm1hcCgoIHgsIGsgKSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3QgeyBwcmljZSwgY291bnQsIHBheV9zdGF0dXMsIGRlcG9zaXRQcmljZSB9ID0gdGVtcFsgayBdO1xuICAgICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgICAgIG9pZDogeC5kYXRhLl9pZCxcbiAgICAgICAgICAgICAgICAgICAgcHJpY2UsXG4gICAgICAgICAgICAgICAgICAgIGNvdW50LFxuICAgICAgICAgICAgICAgICAgICBwYXlfc3RhdHVzLFxuICAgICAgICAgICAgICAgICAgICBkZXBvc2l0UHJpY2VcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgcmV0dXJuIGN0eC5ib2R5ID0ge1xuICAgICAgICAgICAgICAgIHN0YXR1czogMjAwLFxuICAgICAgICAgICAgICAgIGRhdGE6IG9yZGVyX3Jlc3VsdFxuICAgICAgICAgICAgfTtcblxuICAgICAgICB9IGNhdGNoICggZSApIHtcbiAgICAgXG4gICAgICAgICAgICByZXR1cm4gY3R4LmJvZHkgPSB7XG4gICAgICAgICAgICAgICAgc3RhdHVzOiA1MDAsXG4gICAgICAgICAgICAgICAgbWVzc2FnZTogZVxuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgLyoqXG4gICAgICog5YiG6aG1ICsgcXVlcnkg5p+l6K+i6K6i5Y2V5YiX6KGo77yI5pyq6IGa5ZCI77yJXG4gICAgICogLS0tLS0g6K+35rGCIC0tLS0tLVxuICAgICAqIHtcbiAgICAgKiAgICAgcGFnZTogbnVtYmVyXG4gICAgICogICAgIHNraXA6IG51bWJlclxuICAgICAqICAgICB0eXBlOiDmiJHnmoTlhajpg6ggfCDmnKrku5jmrL7orqLljZUgfCDlvoXlj5HotKcgfCDlt7LlrozmiJAgfCDnrqHnkIblkZjvvIjooYznqIvorqLljZXvvIl8IOeuoeeQhuWRmO+8iOaJgOacieiuouWNle+8iVxuICAgICAqICAgICB0eXBlOiBteS1hbGwgfCBteS1ub3RwYXkgfCBteS1kZWxpdmVyIHwgbXktZmluaXNoIHwgbWFuYWdlci10cmlwIHwgbWFuYWdlci1hbGxcbiAgICAgKiB9XG4gICAgICogISDmnKrku5jmrL7orqLljZXvvJpwYXlfc3RhdHVzOiDmnKrku5jmrL4v5bey5LuY6K6i6YeRIOaIliB0eXBlOiBwcmVcbiAgICAgKiAhIOW+heWPkei0p++8mmRlbGl2ZXJfc3RhdHVz77ya5pyq5Y+R6LSnIOS4lCBwYXlfc3RhdHVzIOW3suS7mOasvlxuICAgICAqICEg5bey5a6M5oiQ77yaZGVsaXZlcl9zdGF0dXPvvJrlt7Llj5HotKcg5LiUIHBheV9zdGF0dXMg5bey5LuY5YWo5qy+XG4gICAgICovXG4gICAgYXBwLnJvdXRlcignbGlzdCcsIGFzeW5jKCBjdHgsIG5leHQgKSA9PiB7XG4gICAgICAgIHRyeSB7XG5cbiAgICAgICAgICAgIC8vIOafpeivouadoeaVsFxuICAgICAgICAgICAgY29uc3QgbGltaXQgPSAyO1xuXG4gICAgICAgICAgICBsZXQgd2hlcmUkID0geyB9O1xuICAgICAgICAgICAgY29uc3QgeyB0eXBlIH0gPSBldmVudC5kYXRhO1xuICAgICAgICAgICAgY29uc3Qgb3BlbmlkID0gZXZlbnQudXNlckluZm8ub3BlbklkO1xuXG4gICAgICAgICAgICAvLyDmiJHnmoTlhajpg6hcbiAgICAgICAgICAgIGlmICggdHlwZSA9PT0gJ215LWFsbCcgKSB7XG4gICAgICAgICAgICAgICAgd2hlcmUkID0ge1xuICAgICAgICAgICAgICAgICAgICBvcGVuaWQ6IG9wZW5pZFxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8g5pyq5LuY5qy+XG4gICAgICAgICAgICB9IGVsc2UgaWYgKCB0eXBlID09PSAnbXktbm90cGF5JyApIHtcbiAgICAgICAgICAgICAgICB3aGVyZSQgPSBfLmFuZCh7XG4gICAgICAgICAgICAgICAgICAgIG9wZW5pZCxcbiAgICAgICAgICAgICAgICAgICAgYmFzZV9zdGF0dXM6ICcyJ1xuICAgICAgICAgICAgICAgIH0sIF8ub3IoW1xuICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiAncHJlJ1xuICAgICAgICAgICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgICAgICAgICBwYXlfc3RhdHVzOiBfLm9yKCBfLmVxKCcwJyksIF8uZXEoJzEnKSlcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIF0pKTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgLy8g5pyq5Y+R6LSnXG4gICAgICAgICAgICB9IGVsc2UgaWYgKCB0eXBlID09PSAnbXktZGVsaXZlJyApIHtcbiAgICAgICAgICAgICAgICB3aGVyZSQgPSB7XG4gICAgICAgICAgICAgICAgICAgIG9wZW5pZCxcbiAgICAgICAgICAgICAgICAgICAgcGF5X3N0YXR1czogJzInLFxuICAgICAgICAgICAgICAgICAgICBkZWxpdmVyX3N0YXR1czogJzAnXG4gICAgICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgLy8g5bey5a6M5oiQXG4gICAgICAgICAgICB9IGVsc2UgaWYgKCB0eXBlID09PSAnbXktZmluaXNoJyApIHtcbiAgICAgICAgICAgICAgICB3aGVyZSQgPSB7XG4gICAgICAgICAgICAgICAgICAgIG9wZW5pZCxcbiAgICAgICAgICAgICAgICAgICAgcGF5X3N0YXR1czogJzInLFxuICAgICAgICAgICAgICAgICAgICBkZWxpdmVyX3N0YXR1czogJzEnXG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8g6I635Y+W5oC75pWwXG4gICAgICAgICAgICBjb25zdCB0b3RhbCQgPSBhd2FpdCBkYi5jb2xsZWN0aW9uKCdvcmRlcicpXG4gICAgICAgICAgICAgICAgLndoZXJlKCB3aGVyZSQgKVxuICAgICAgICAgICAgICAgIC5jb3VudCggKTtcblxuICAgICAgICAgICAgLy8g6I635Y+W5pWw5o2uXG4gICAgICAgICAgICBjb25zdCBkYXRhJCA9IGF3YWl0IGRiLmNvbGxlY3Rpb24oJ29yZGVyJylcbiAgICAgICAgICAgICAgICAud2hlcmUoIHdoZXJlJCApXG4gICAgICAgICAgICAgICAgLm9yZGVyQnkoJ2NyZWF0ZVRpbWUnLCAnZGVzYycpXG4gICAgICAgICAgICAgICAgLmxpbWl0KCBsaW1pdCApXG4gICAgICAgICAgICAgICAgLnNraXAoIGV2ZW50LmRhdGEuc2tpcCB8fCAoIGV2ZW50LmRhdGEucGFnZSAtIDEgKSAqIGxpbWl0IClcbiAgICAgICAgICAgICAgICAuZ2V0KCApO1xuXG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqICEg55Sx5LqO5p+l6K+i5piv5oyJ5YiG6aG177yM5L2G5piv5pi+56S65piv5oyJ6KGM56iL5p2l6IGa5ZCI5pi+56S6XG4gICAgICAgICAgICAgKiAhIOWboOatpOacieWPr+iDve+8jE7pobXmnIDlkI7kuIDkvY3vvIzot59OKzHpobXnrKzkuIDkvY3kvp3nhLblsZ7kuo7lkIzkuIDooYznqItcbiAgICAgICAgICAgICAqICEg5aaC5LiN6L+b6KGM5aSE55CG77yM5a6i5oi35p+l6K+i6K6i5Y2V5YiX6KGo5pi+56S66KGM56iL6K6i5Y2V5pe277yM5Lya4oCc5pyJ5Y+v6IO94oCd5pi+56S65LiN5YWoXG4gICAgICAgICAgICAgKiAhIOeJueauiuWkhOeQhu+8mueUqOacgOWQjuS4gOS9jeeahHRpZO+8jOafpeivouacgOWQjuS4gOS9jeS7peWQjuWQjHRpZOeahG9yZGVy77yM54S25ZCO5L+u5q2j5omA6L+U5Zue55qEcGFnZVxuICAgICAgICAgICAgICovXG5cbiAgICAgICAgICAgIGNvbnN0IGxhc3QgPSBkYXRhJC5kYXRhWyBkYXRhJC5kYXRhLmxlbmd0aCAtIDEgXTtcblxuICAgICAgICAgICAgbGV0IGZpeCQ6IGFueSA9IHtcbiAgICAgICAgICAgICAgICBkYXRhOiBbIF1cbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIGlmICggbGFzdCApIHsgXG4gICAgICAgICAgICAgICAgZml4JCA9IGF3YWl0IGRiLmNvbGxlY3Rpb24oJ29yZGVyJylcbiAgICAgICAgICAgICAgICAgICAgLndoZXJlKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG9wZW5pZCxcbiAgICAgICAgICAgICAgICAgICAgICAgIHRpZDogbGFzdC50aWRcbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgLm9yZGVyQnkoJ2NyZWF0ZVRpbWUnLCAnZGVzYycpXG4gICAgICAgICAgICAgICAgICAgIC5za2lwKCBldmVudC5kYXRhLnNraXAgPyBldmVudC5kYXRhLnNraXAgKyBkYXRhJC5kYXRhLmxlbmd0aCA6ICggZXZlbnQuZGF0YS5wYWdlIC0gMSApICogbGltaXQgKyBkYXRhJC5kYXRhLmxlbmd0aCApXG4gICAgICAgICAgICAgICAgICAgIC5nZXQoICk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGNvbnN0IG1ldGEgPSBbIC4uLmRhdGEkLmRhdGEsIC4uLmZpeCQuZGF0YSBdO1xuICAgICAgICAgICAgY29uc3QgdHJpcHMkID0gYXdhaXQgUHJvbWlzZS5hbGwoIG1ldGEubWFwKCB4ID0+IHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZGIuY29sbGVjdGlvbigndHJpcCcpXG4gICAgICAgICAgICAgICAgICAgIC53aGVyZSh7XG4gICAgICAgICAgICAgICAgICAgICAgICBfaWQ6IHgudGlkXG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgIC5maWVsZCh7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aXRsZTogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0YXJ0X2RhdGU6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgICAgICBwYXltZW50OiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICAgICAgcG9zdGFnZTogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHBvc3RhZ2VmcmVlX2F0bGVhc3Q6IHRydWVcbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgLmdldCggKTtcbiAgICAgICAgICAgIH0pKTtcbiAgICAgXG4gICAgICAgICAgICAvLyDogZrlkIjooYznqIvmlbDmja5cbiAgICAgICAgICAgIGNvbnN0IG1ldGEyID0gbWV0YS5tYXAoKCB4LCBpICkgPT4gT2JqZWN0LmFzc2lnbih7IH0sIHgsIHtcbiAgICAgICAgICAgICAgICB0cmlwOiB0cmlwcyRbIGkgXS5kYXRhWyAwIF1cbiAgICAgICAgICAgIH0pKTtcblxuICAgICAgICAgICAgcmV0dXJuIGN0eC5ib2R5ID0ge1xuICAgICAgICAgICAgICAgIHN0YXR1czogMjAwLFxuICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgZGF0YTogbWV0YTIsXG4gICAgICAgICAgICAgICAgICAgIHBhZ2VTaXplOiBsaW1pdCxcbiAgICAgICAgICAgICAgICAgICAgdG90YWw6IHRvdGFsJC50b3RhbCxcbiAgICAgICAgICAgICAgICAgICAgcGFnZTogZml4JC5kYXRhLmxlbmd0aCA9PT0gMCA/IGV2ZW50LmRhdGEucGFnZSA6IGV2ZW50LmRhdGEucGFnZSArIE1hdGguY2VpbCggZml4JC5kYXRhLmxlbmd0aCAvIGxpbWl0ICksXG4gICAgICAgICAgICAgICAgICAgIGN1cnJlbnQ6IGV2ZW50LmRhdGEuc2tpcCA/IGV2ZW50LmRhdGEuc2tpcCArIG1ldGEubGVuZ3RoIDogKCBldmVudC5kYXRhLnBhZ2UgLSAxICkgKiBsaW1pdCArIG1ldGEubGVuZ3RoLFxuICAgICAgICAgICAgICAgICAgICB0b3RhbFBhZ2U6IE1hdGguY2VpbCggdG90YWwkLnRvdGFsIC8gbGltaXQgKVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIFxuICAgICAgICB9IGNhdGNoICggZSApIHsgcmV0dXJuIGN0eC5ib2R5ID0geyBzdGF0dXM6IDUwMH07fVxuICAgIH0pXG5cbiAgICAvKipcbiAgICAgKiDmibnph4/mm7TmlrDvvIzorqLljZXkuLrlt7LmlK/ku5hcbiAgICAgKiBvcmRlcklkczogXCIxMjMsMjM0LDM0NVwiXG4gICAgICovXG4gICAgYXBwLnJvdXRlcigndXBhZHRlLXRvLXBheWVkJywgYXN5bmMoIGN0eCwgbmV4dCApID0+IHtcbiAgICAgICAgdHJ5IHtcblxuICAgICAgICAgICAgY29uc3QgeyBvcmRlcklkcyB9ID0gZXZlbnQuZGF0YTtcbiAgICAgICAgICAgIGF3YWl0IFByb21pc2UuYWxsKCBvcmRlcklkcy5zcGxpdCgnLCcpLm1hcCggb2lkID0+IHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZGIuY29sbGVjdGlvbignb3JkZXInKS5kb2MoIG9pZCApXG4gICAgICAgICAgICAgICAgICAgIC51cGRhdGUoe1xuICAgICAgICAgICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBheV9zdGF0dXM6ICcxJ1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0pKTtcblxuICAgICAgICAgICAgcmV0dXJuIGN0eC5ib2R5ID0ge1xuICAgICAgICAgICAgICAgIHN0YXR1czogMjAwXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfSBjYXRjaCAoIGUgKSB7IFxuICAgICAgICAgICAgcmV0dXJuIGN0eC5ib2R5ID0geyBzdGF0dXM6IDUwMCB9O1xuICAgICAgICB9IFxuICAgIH0pXG4gXG4gICByZXR1cm4gYXBwLnNlcnZlKCApO1xuXG59Il19