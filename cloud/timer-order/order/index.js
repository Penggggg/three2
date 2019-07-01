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
exports.overtime = function () { return __awaiter(_this, void 0, void 0, function () {
    var orders$, e_1;
    var _this = this;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 4, , 5]);
                return [4, db.collection('order')
                        .where({
                        pay_status: '0',
                        base_status: '0',
                        createTime: _.lte(new Date().getTime() - 30 * 60 * 1000)
                    })
                        .get()];
            case 1:
                orders$ = _a.sent();
                return [4, Promise.all(orders$.data.map(function (order) {
                        return db.collection('order').doc(String(order._id))
                            .update({
                            data: {
                                base_status: '5'
                            }
                        });
                    }))];
            case 2:
                _a.sent();
                return [4, Promise.all(orders$.data.map(function (order) { return __awaiter(_this, void 0, void 0, function () {
                        var targetId, collection, target;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    targetId = order.sid || order.pid;
                                    collection = order.sid ? 'standards' : 'goods';
                                    return [4, db.collection(collection)
                                            .doc(targetId)
                                            .get()];
                                case 1:
                                    target = _a.sent();
                                    if (target.data.stock === undefined || target.data.stock === null) {
                                        return [2];
                                    }
                                    return [4, db.collection(collection).doc(targetId)
                                            .update({
                                            data: {
                                                stock: _.inc(order.count)
                                            }
                                        })];
                                case 2:
                                    _a.sent();
                                    return [2];
                            }
                        });
                    }); }))];
            case 3:
                _a.sent();
                return [2, { status: 200 }];
            case 4:
                e_1 = _a.sent();
                console.log('!!!!定时器订单overtime错误');
                return [2, { status: 500 }];
            case 5: return [2];
        }
    });
}); };
exports.payedFix = function () { return __awaiter(_this, void 0, void 0, function () {
    var orders$, e_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 4, , 5]);
                return [4, db.collection('order')
                        .where({
                        type: 'pre',
                        pay_status: '1'
                    })
                        .get()];
            case 1:
                orders$ = _a.sent();
                return [4, Promise.all(orders$.data.map(function (order) {
                        return db.collection('order').doc(String(order._id))
                            .update({
                            data: {
                                type: 'normal'
                            }
                        });
                    }))];
            case 2:
                _a.sent();
                return [4, Promise.all(orders$.data
                        .filter(function (x) { return !!x.cid; })
                        .map(function (order) {
                        return db.collection('cart').doc(order.cid)
                            .remove();
                    }))];
            case 3:
                _a.sent();
                return [2, {
                        status: 200
                    }];
            case 4:
                e_2 = _a.sent();
                console.log('!!!!定时器订单payedFix错误');
                return [2, { status: 500 }];
            case 5: return [2];
        }
    });
}); };
exports.priceFix = function () { return __awaiter(_this, void 0, void 0, function () {
    var trips$, currentTrip, tid_1, shoppinglists$, e_3;
    var _this = this;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 4, , 5]);
                return [4, cloud.callFunction({
                        name: 'trip',
                        data: {
                            $url: 'enter'
                        }
                    })];
            case 1:
                trips$ = _a.sent();
                currentTrip = trips$.result.data[0];
                if (!currentTrip) {
                    return [2, {
                            status: 200
                        }];
                }
                tid_1 = currentTrip._id;
                return [4, db.collection('shopping-list')
                        .where({
                        tid: tid_1,
                        base_status: '1'
                    })
                        .get()];
            case 2:
                shoppinglists$ = _a.sent();
                return [4, Promise.all(shoppinglists$.data.map(function (shoppingList) { return __awaiter(_this, void 0, void 0, function () {
                        var pid, sid, adjustPrice, adjustGroupPrice, orders$;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    pid = shoppingList.pid, sid = shoppingList.sid, adjustPrice = shoppingList.adjustPrice, adjustGroupPrice = shoppingList.adjustGroupPrice;
                                    return [4, db.collection('order')
                                            .where({
                                            tid: tid_1,
                                            pid: pid,
                                            sid: sid,
                                            base_status: '0'
                                        })
                                            .get()];
                                case 1:
                                    orders$ = _a.sent();
                                    return [4, Promise.all(orders$.data.map(function (order) {
                                            return db.collection('order')
                                                .doc(String(order._id))
                                                .update({
                                                data: {
                                                    allocatedPrice: adjustPrice,
                                                    allocatedGroupPrice: adjustGroupPrice,
                                                    base_status: '1'
                                                }
                                            });
                                        }))];
                                case 2:
                                    _a.sent();
                                    return [2];
                            }
                        });
                    }); }))];
            case 3:
                _a.sent();
                return [2, { status: 200 }];
            case 4:
                e_3 = _a.sent();
                console.log('!!!!定时器订单priceFix错误');
                return [2, { status: 500 }];
            case 5: return [2];
        }
    });
}); };
exports.payLastFix = function () { return __awaiter(_this, void 0, void 0, function () {
    var orders$, e_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                return [4, db.collection('order')
                        .where({
                        pay_status: '2',
                        base_status: _.or(_.eq('0'), _.eq('1'), _.eq('2'))
                    })
                        .get()];
            case 1:
                orders$ = _a.sent();
                return [4, Promise.all(orders$.data.map(function (order) {
                        return db.collection('order')
                            .doc(String(order._id))
                            .update({
                            data: {
                                base_status: '3'
                            }
                        });
                    }))];
            case 2:
                _a.sent();
                return [3, 4];
            case 3:
                e_4 = _a.sent();
                console.log('!!!!定时器订单payLastFix错误');
                return [2, { status: 500 }];
            case 4: return [2];
        }
    });
}); };
exports.pushNew = function () { return __awaiter(_this, void 0, void 0, function () {
    var checkIsInRange, trips$, trips, trip_1, members, e_5;
    var _this = this;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 4, , 5]);
                checkIsInRange = function (now) {
                    var y = now.getFullYear();
                    var m = now.getMonth() + 1;
                    var d = now.getDate();
                    var range = [
                        [
                            new Date(y + "/" + m + "/" + d + " 8:59:00"),
                            new Date(y + "/" + m + "/" + d + " 9:01:00"),
                        ], [
                            new Date(y + "/" + m + "/" + d + " 12:29:00"),
                            new Date(y + "/" + m + "/" + d + " 12:31:00"),
                        ], [
                            new Date(y + "/" + m + "/" + d + " 17:59:00"),
                            new Date(y + "/" + m + "/" + d + " 18:01:00"),
                        ], [
                            new Date(y + "/" + m + "/" + d + " 23:59:00"),
                            new Date(new Date(y + "/" + m + "/" + d + " 23:59:00").getTime() + 2 * 60 * 1000),
                        ]
                    ];
                    return range.some(function (x) {
                        var t = now.getTime();
                        if (x[0].getTime() <= t && x[1].getTime() >= t) {
                            return true;
                        }
                        else {
                            return false;
                        }
                    });
                };
                if (!checkIsInRange(new Date())) {
                    return [2, { status: 200 }];
                }
                return [4, cloud.callFunction({
                        data: {
                            $url: 'enter'
                        },
                        name: 'trip'
                    })];
            case 1:
                trips$ = _a.sent();
                trips = trips$.result.data;
                trip_1 = trips[0];
                return [4, db.collection('manager-member')
                        .where({
                        push: true
                    })
                        .get()];
            case 2:
                members = _a.sent();
                if (!trip_1 || members.data.length === 0) {
                    return [2, { status: 200 }];
                }
                return [4, Promise.all(members.data.map(function (member) { return __awaiter(_this, void 0, void 0, function () {
                        var count, openid, config$, config, query, count$, push$;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    count = 0;
                                    openid = member.openid;
                                    return [4, db.collection('analyse-data')
                                            .where({
                                            openid: openid,
                                            tid: trip_1._id,
                                            type: 'manager-trip-order-visit'
                                        })
                                            .get()];
                                case 1:
                                    config$ = _a.sent();
                                    config = config$.data[0];
                                    query = {
                                        tid: trip_1._id,
                                        pay_status: _.neq('0'),
                                        base_status: _.or(_.eq('0'), _.eq('1'), _.eq('2'))
                                    };
                                    if (!!config) {
                                        query = Object.assign({}, query, {
                                            createTime: _.gte(config.value)
                                        });
                                    }
                                    return [4, db.collection('order')
                                            .where(query)
                                            .count()];
                                case 2:
                                    count$ = _a.sent();
                                    count = count$.total;
                                    if (count === 0) {
                                        return [2];
                                    }
                                    return [4, cloud.callFunction({
                                            name: 'common',
                                            data: {
                                                $url: 'push-template',
                                                data: {
                                                    openid: openid,
                                                    type: 'newOrder',
                                                    page: 'pages/manager-trip-list/index',
                                                    texts: ["\u4F60\u6709" + count + "\u6761\u65B0\u8BA2\u5355", "\u70B9\u51FB\u67E5\u770B"]
                                                }
                                            }
                                        })];
                                case 3:
                                    push$ = _a.sent();
                                    if (!(push$.result.status === 200)) return [3, 7];
                                    if (!!!config) return [3, 5];
                                    return [4, db.collection('analyse-data')
                                            .doc(String(config._id))
                                            .update({
                                            data: {
                                                value: new Date().getTime()
                                            }
                                        })];
                                case 4:
                                    _a.sent();
                                    return [3, 7];
                                case 5: return [4, db.collection('analyse-data')
                                        .add({
                                        data: {
                                            openid: openid,
                                            tid: trip_1._id,
                                            type: 'manager-trip-order-visit',
                                            value: new Date().getTime()
                                        }
                                    })];
                                case 6:
                                    _a.sent();
                                    _a.label = 7;
                                case 7: return [2];
                            }
                        });
                    }); }))];
            case 3:
                _a.sent();
                return [2, {
                        status: 200
                    }];
            case 4:
                e_5 = _a.sent();
                return [2, {
                        status: 500,
                        message: typeof e_5 === 'string' ? e_5 : JSON.stringify(e_5)
                    }];
            case 5: return [2];
        }
    });
}); };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSxpQkE0V0M7O0FBNVdELHFDQUF1QztBQUV2QyxLQUFLLENBQUMsSUFBSSxDQUFDO0lBQ1AsR0FBRyxFQUFFLE9BQU8sQ0FBQyxHQUFHLENBQUMsS0FBSztDQUN6QixDQUFDLENBQUM7QUFFSCxJQUFNLEVBQUUsR0FBZ0IsS0FBSyxDQUFDLFFBQVEsRUFBRyxDQUFDO0FBQzFDLElBQU0sQ0FBQyxHQUFHLEVBQUUsQ0FBQyxPQUFPLENBQUM7QUFLUixRQUFBLFFBQVEsR0FBRzs7Ozs7OztnQkFHQSxXQUFNLEVBQUUsQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDO3lCQUN2QyxLQUFLLENBQUM7d0JBQ0gsVUFBVSxFQUFFLEdBQUc7d0JBQ2YsV0FBVyxFQUFFLEdBQUc7d0JBQ2hCLFVBQVUsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFFLElBQUksSUFBSSxFQUFHLENBQUMsT0FBTyxFQUFHLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxJQUFJLENBQUU7cUJBQy9ELENBQUM7eUJBQ0QsR0FBRyxFQUFHLEVBQUE7O2dCQU5MLE9BQU8sR0FBRyxTQU1MO2dCQUdYLFdBQU0sT0FBTyxDQUFDLEdBQUcsQ0FBRSxPQUFPLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBRSxVQUFBLEtBQUs7d0JBQ3RDLE9BQU8sRUFBRSxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUMsQ0FBQyxHQUFHLENBQUUsTUFBTSxDQUFFLEtBQUssQ0FBQyxHQUFHLENBQUUsQ0FBQzs2QkFDbEQsTUFBTSxDQUFDOzRCQUNKLElBQUksRUFBRTtnQ0FDRixXQUFXLEVBQUUsR0FBRzs2QkFDbkI7eUJBQ0osQ0FBQyxDQUFBO29CQUNWLENBQUMsQ0FBQyxDQUFDLEVBQUE7O2dCQVBILFNBT0csQ0FBQztnQkFHSixXQUFN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RUFBQTs7b0NBUk4sU0FRTSxDQUFDOzt3Q0FJZixXQUFPOzs7eUJBRVYsQ0FBQyxDQUNMLEVBQUE7O2dCQWhGRCxTQWdGQyxDQUFDO2dCQUVGLFdBQU87d0JBQ0gsTUFBTSxFQUFFLEdBQUc7cUJBQ2QsRUFBQzs7O2dCQUdGLFdBQU87d0JBQ0gsTUFBTSxFQUFFLEdBQUc7d0JBQ1gsT0FBTyxFQUFFLE9BQU8sR0FBQyxLQUFLLFFBQVEsQ0FBQyxDQUFDLENBQUMsR0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFFLEdBQUMsQ0FBRTtxQkFDM0QsRUFBQTs7OztLQUVSLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBjbG91ZCBmcm9tICd3eC1zZXJ2ZXItc2RrJztcblxuY2xvdWQuaW5pdCh7XG4gICAgZW52OiBwcm9jZXNzLmVudi5jbG91ZFxufSk7XG5cbmNvbnN0IGRiOiBEQi5EYXRhYmFzZSA9IGNsb3VkLmRhdGFiYXNlKCApO1xuY29uc3QgXyA9IGRiLmNvbW1hbmQ7XG5cbi8qKlxuICog6K6i5Y2VMTog5omA5pyJ5bqU6K+l5pSv5LuY77yM5L2G5piv5rKh5pyJ5pSv5LuY77yI5pSv5LuY6LaF5pe2MzDliIbpkp/vvInnmoTorqLljZXvvIzph4rmlL7ljp/mnaXnmoTlupPlrZjvvIzorqLljZXph43nva7kuLrlt7Lov4fml7ZcbiAqL1xuZXhwb3J0IGNvbnN0IG92ZXJ0aW1lID0gYXN5bmMgKCApID0+IHtcbiAgICB0cnkge1xuXG4gICAgICAgIGNvbnN0IG9yZGVycyQgPSBhd2FpdCBkYi5jb2xsZWN0aW9uKCdvcmRlcicpXG4gICAgICAgICAgICAud2hlcmUoe1xuICAgICAgICAgICAgICAgIHBheV9zdGF0dXM6ICcwJyxcbiAgICAgICAgICAgICAgICBiYXNlX3N0YXR1czogJzAnLFxuICAgICAgICAgICAgICAgIGNyZWF0ZVRpbWU6IF8ubHRlKCBuZXcgRGF0ZSggKS5nZXRUaW1lKCApIC0gMzAgKiA2MCAqIDEwMDAgKVxuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC5nZXQoICk7XG4gICAgICAgIFxuICAgICAgICAvLyDorqLljZXmm7TmlrBcbiAgICAgICAgYXdhaXQgUHJvbWlzZS5hbGwoIG9yZGVycyQuZGF0YS5tYXAoIG9yZGVyID0+IHtcbiAgICAgICAgICAgIHJldHVybiBkYi5jb2xsZWN0aW9uKCdvcmRlcicpLmRvYyggU3RyaW5nKCBvcmRlci5faWQgKSlcbiAgICAgICAgICAgICAgICAudXBkYXRlKHtcbiAgICAgICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgICAgICAgYmFzZV9zdGF0dXM6ICc1J1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgfSkpO1xuXG4gICAgICAgIC8vIOW6k+WtmOmHiuaUviAoIOWmguaenOacieW6k+WtmOeahOivnSApXG4gICAgICAgIGF3YWl0IFByb21pc2UuYWxsKCBvcmRlcnMkLmRhdGEubWFwKCBhc3luYyBvcmRlciA9PiB7XG5cbiAgICAgICAgICAgIGNvbnN0IHRhcmdldElkID0gb3JkZXIuc2lkIHx8IG9yZGVyLnBpZDtcbiAgICAgICAgICAgIGNvbnN0IGNvbGxlY3Rpb24gPSBvcmRlci5zaWQgPyAnc3RhbmRhcmRzJyA6ICdnb29kcyc7XG5cbiAgICAgICAgICAgIGNvbnN0IHRhcmdldCA9IGF3YWl0IGRiLmNvbGxlY3Rpb24oIGNvbGxlY3Rpb24gKVxuICAgICAgICAgICAgICAgIC5kb2MoIHRhcmdldElkIClcbiAgICAgICAgICAgICAgICAuZ2V0KCApO1xuXG4gICAgICAgICAgICBpZiAoIHRhcmdldC5kYXRhLnN0b2NrID09PSB1bmRlZmluZWQgfHwgdGFyZ2V0LmRhdGEuc3RvY2sgPT09IG51bGwgKSB7IHJldHVybjsgfVxuXG4gICAgICAgICAgICBhd2FpdCBkYi5jb2xsZWN0aW9uKCBjb2xsZWN0aW9uICkuZG9jKCB0YXJnZXRJZCApXG4gICAgICAgICAgICAgICAgLnVwZGF0ZSh7XG4gICAgICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0b2NrOiBfLmluYyggb3JkZXIuY291bnQgKVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pKTtcbiAgICAgICAgXG4gICAgICAgIHJldHVybiB7IHN0YXR1czogMjAwIH1cbiAgICB9IGNhdGNoICggZSApIHtcbiAgICAgICAgY29uc29sZS5sb2coJyEhISHlrprml7blmajorqLljZVvdmVydGltZemUmeivrycsKVxuICAgICAgICByZXR1cm4geyBzdGF0dXM6IDUwMCB9XG4gICAgfVxufTtcblxuLyoqXG4gKiDorqLljZUy77ya5omA5pyJ5oiQ5Yqf5pSv5LuY55qE6K6i5Y2V77yM5qOA5p+l5pyJ5rKh5pyJIHR5cGXvvJpwcmXnmoTvvIzmnInnmoTor53pnIDopoHovazmiJB0eXBlOm5vcm1hbOexu+Wei+iuouWNle+8jOWIoOmZpOWvueW6lOeahOi0reeJqei9pu+8iOacieeahOivne+8iVxuICovXG5leHBvcnQgY29uc3QgcGF5ZWRGaXggPSBhc3luYyAoICkgPT4ge1xuICAgIHRyeSB7XG5cbiAgICAgICAgY29uc3Qgb3JkZXJzJCA9IGF3YWl0IGRiLmNvbGxlY3Rpb24oJ29yZGVyJylcbiAgICAgICAgICAgIC53aGVyZSh7XG4gICAgICAgICAgICAgICAgdHlwZTogJ3ByZScsXG4gICAgICAgICAgICAgICAgcGF5X3N0YXR1czogJzEnXG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLmdldCggKTtcblxuICAgICAgICAvLyDorqLljZXmm7TmlrBcbiAgICAgICAgYXdhaXQgUHJvbWlzZS5hbGwoIG9yZGVycyQuZGF0YS5tYXAoIG9yZGVyID0+IHtcbiAgICAgICAgICAgIHJldHVybiBkYi5jb2xsZWN0aW9uKCdvcmRlcicpLmRvYyggU3RyaW5nKCBvcmRlci5faWQgKSlcbiAgICAgICAgICAgICAgICAudXBkYXRlKHtcbiAgICAgICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogJ25vcm1hbCdcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgIH0pKTtcblxuICAgICAgICAvLyDliKDpmaTlr7nlupTnmoTotK3nianovaZcbiAgICAgICAgYXdhaXQgUHJvbWlzZS5hbGwoXG4gICAgICAgICAgICBvcmRlcnMkLmRhdGFcbiAgICAgICAgICAgICAgICAuZmlsdGVyKCB4ID0+ICEheC5jaWQgKVxuICAgICAgICAgICAgICAgIC5tYXAoIG9yZGVyID0+IHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGRiLmNvbGxlY3Rpb24oJ2NhcnQnKS5kb2MoIG9yZGVyLmNpZCApXG4gICAgICAgICAgICAgICAgICAgICAgICAucmVtb3ZlKCApXG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgKTtcblxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgc3RhdHVzOiAyMDBcbiAgICAgICAgfVxuXG5cbiAgICB9IGNhdGNoICggZSApIHtcbiAgICAgICAgY29uc29sZS5sb2coJyEhISHlrprml7blmajorqLljZVwYXllZEZpeOmUmeivrycsKVxuICAgICAgICByZXR1cm4geyBzdGF0dXM6IDUwMCB9XG4gICAgfVxufVxuXG4vKipcbiAqIOiuouWNlTPvvJrlt7Lnu4/ov5vooYzotK3nianmuIXljZXku7fmoLzosIPmlbTlkI7vvIzmlrDmnaXnmoTllYblk4HorqLljZXku7fmoLzlpoLmnpzot5/muIXljZXku7fmoLzkuI3kuIDoh7TvvIzlupTor6XnlKjlrprml7blmajov5vooYzosIPmlbRcbiAqICHov5nnsbvorqLljZXvvIzmmoLml7bov5jmsqHmnInog73oh6rliqjms6jlhaXliIbphY3mlbDph48gYWxsb2NhdGVkQ291bnRcbiAqL1xuZXhwb3J0IGNvbnN0IHByaWNlRml4ID0gYXN5bmMgKCApID0+IHtcbiAgICB0cnkge1xuXG4gICAgICAgIC8vIOiOt+WPluW9k+WJjei/m+ihjOS4reeahOihjOeoi1xuICAgICAgICBjb25zdCB0cmlwcyQgPSBhd2FpdCBjbG91ZC5jYWxsRnVuY3Rpb24oe1xuICAgICAgICAgICAgbmFtZTogJ3RyaXAnLFxuICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICR1cmw6ICdlbnRlcidcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgY29uc3QgY3VycmVudFRyaXAgPSB0cmlwcyQucmVzdWx0LmRhdGFbIDAgXTtcblxuICAgICAgICBpZiAoICFjdXJyZW50VHJpcCApIHsgXG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIHN0YXR1czogMjAwXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCB0aWQgPSBjdXJyZW50VHJpcC5faWQ7XG5cbiAgICAgICAgLy8g5om+5Yiw5omA5pyJ5bey57uP6LCD5pW05aW955qE5riF5Y2V5YiX6KGoXG4gICAgICAgIGNvbnN0IHNob3BwaW5nbGlzdHMkID0gYXdhaXQgZGIuY29sbGVjdGlvbignc2hvcHBpbmctbGlzdCcpXG4gICAgICAgICAgICAud2hlcmUoe1xuICAgICAgICAgICAgICAgIHRpZCxcbiAgICAgICAgICAgICAgICBiYXNlX3N0YXR1czogJzEnXG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLmdldCggKTtcbiAgICAgICAgXG4gICAgICAgIGF3YWl0IFByb21pc2UuYWxsKCBzaG9wcGluZ2xpc3RzJC5kYXRhLm1hcCggYXN5bmMgc2hvcHBpbmdMaXN0ID0+IHtcblxuICAgICAgICAgICAgY29uc3QgeyBwaWQsIHNpZCwgYWRqdXN0UHJpY2UsIGFkanVzdEdyb3VwUHJpY2UgfSA9IHNob3BwaW5nTGlzdDtcblxuICAgICAgICAgICAgLy8g5om+5YiwYmFzZV9zdGF0dXM6IDAg55qE5ZCM5ZWG5ZOB6K6i5Y2VXG4gICAgICAgICAgICBjb25zdCBvcmRlcnMkID0gYXdhaXQgZGIuY29sbGVjdGlvbignb3JkZXInKVxuICAgICAgICAgICAgICAgIC53aGVyZSh7XG4gICAgICAgICAgICAgICAgICAgIHRpZCxcbiAgICAgICAgICAgICAgICAgICAgcGlkLFxuICAgICAgICAgICAgICAgICAgICBzaWQsXG4gICAgICAgICAgICAgICAgICAgIGJhc2Vfc3RhdHVzOiAnMCdcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIC5nZXQoICk7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIC8vIOiuouWNleabtOaWsFxuICAgICAgICAgICAgYXdhaXQgUHJvbWlzZS5hbGwoIG9yZGVycyQuZGF0YS5tYXAoIG9yZGVyID0+IHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZGIuY29sbGVjdGlvbignb3JkZXInKVxuICAgICAgICAgICAgICAgICAgICAuZG9jKCBTdHJpbmcoIG9yZGVyLl9pZCApKVxuICAgICAgICAgICAgICAgICAgICAudXBkYXRlKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhbGxvY2F0ZWRQcmljZTogYWRqdXN0UHJpY2UsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYWxsb2NhdGVkR3JvdXBQcmljZTogYWRqdXN0R3JvdXBQcmljZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBiYXNlX3N0YXR1czogJzEnXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICB9KSk7XG5cbiAgICAgICAgfSkpO1xuXG4gICAgICAgIHJldHVybiB7IHN0YXR1czogMjAwIH1cblxuICAgIH0gY2F0Y2ggKCBlICkge1xuICAgICAgICBjb25zb2xlLmxvZygnISEhIeWumuaXtuWZqOiuouWNlXByaWNlRml46ZSZ6K+vJywpXG4gICAgICAgIHJldHVybiB7IHN0YXR1czogNTAwIH1cbiAgICB9XG59XG5cbi8qKlxuICog6K6i5Y2VNO+8muaJgOacieaIkOWKn+aUr+S7mOWwvuasvueahOiuouWNle+8jOaKimJhc2Vfc3RhdHVz6K6+5Li6M1xuICovXG5leHBvcnQgY29uc3QgcGF5TGFzdEZpeCA9IGFzeW5jICggKSA9PiB7XG4gICAgdHJ5IHtcbiAgICAgICAgXG4gICAgICAgIGNvbnN0IG9yZGVycyQgPSBhd2FpdCBkYi5jb2xsZWN0aW9uKCdvcmRlcicpXG4gICAgICAgICAgICAud2hlcmUoe1xuICAgICAgICAgICAgICAgIHBheV9zdGF0dXM6ICcyJyxcbiAgICAgICAgICAgICAgICBiYXNlX3N0YXR1czogXy5vciggXy5lcSgnMCcpLCBfLmVxKCcxJyksICBfLmVxKCcyJykpXG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLmdldCggKTtcblxuICAgICAgICBhd2FpdCBQcm9taXNlLmFsbChcbiAgICAgICAgICAgIG9yZGVycyQuZGF0YS5tYXAoIG9yZGVyID0+IHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZGIuY29sbGVjdGlvbignb3JkZXInKVxuICAgICAgICAgICAgICAgICAgICAuZG9jKCBTdHJpbmcoIG9yZGVyLl9pZCApKVxuICAgICAgICAgICAgICAgICAgICAudXBkYXRlKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBiYXNlX3N0YXR1czogJzMnXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICB9KVxuICAgICAgICApXG4gICAgICAgIFxuICAgIH0gY2F0Y2ggKCBlICkge1xuICAgICAgICBjb25zb2xlLmxvZygnISEhIeWumuaXtuWZqOiuouWNlXBheUxhc3RGaXjplJnor68nLClcbiAgICAgICAgcmV0dXJuIHsgc3RhdHVzOiA1MDAgfVxuICAgIH1cbn1cblxuLyoqXG4gKiDorqLljZU077ya5paw6K6i5Y2V5o6o6YCBXG4gKi9cbmV4cG9ydCBjb25zdCBwdXNoTmV3ID0gYXN5bmMgKCApID0+IHtcbiAgICB0cnkge1xuXG4gICAgICAgIC8vIDDjgIHliKTmlq3mmK/lkKblnKjpgqPlh6DkuKrml7bpl7TmiLPkuYvlhoVcbiAgICAgICAgY29uc3QgY2hlY2tJc0luUmFuZ2UgPSBub3cgPT4ge1xuICAgICAgICAgICAgY29uc3QgeSA9IG5vdy5nZXRGdWxsWWVhciggKTtcbiAgICAgICAgICAgIGNvbnN0IG0gPSBub3cuZ2V0TW9udGgoICkgKyAxO1xuICAgICAgICAgICAgY29uc3QgZCA9IG5vdy5nZXREYXRlKCApO1xuXG4gICAgICAgICAgICBjb25zdCByYW5nZSA9IFtcbiAgICAgICAgICAgICAgICBbXG4gICAgICAgICAgICAgICAgICAgIC8vIDnngrlcbiAgICAgICAgICAgICAgICAgICAgbmV3IERhdGUoYCR7eX0vJHttfS8ke2R9IDg6NTk6MDBgKSxcbiAgICAgICAgICAgICAgICAgICAgbmV3IERhdGUoYCR7eX0vJHttfS8ke2R9IDk6MDE6MDBgKSxcbiAgICAgICAgICAgICAgICBdLCBbXG4gICAgICAgICAgICAgICAgICAgIC8vIDEy54K55Y2KXG4gICAgICAgICAgICAgICAgICAgIG5ldyBEYXRlKGAke3l9LyR7bX0vJHtkfSAxMjoyOTowMGApLFxuICAgICAgICAgICAgICAgICAgICBuZXcgRGF0ZShgJHt5fS8ke219LyR7ZH0gMTI6MzE6MDBgKSxcbiAgICAgICAgICAgICAgICBdLCBbXG4gICAgICAgICAgICAgICAgICAgIC8vIDE454K5XG4gICAgICAgICAgICAgICAgICAgIG5ldyBEYXRlKGAke3l9LyR7bX0vJHtkfSAxNzo1OTowMGApLFxuICAgICAgICAgICAgICAgICAgICBuZXcgRGF0ZShgJHt5fS8ke219LyR7ZH0gMTg6MDE6MDBgKSxcbiAgICAgICAgICAgICAgICBdLCBbXG4gICAgICAgICAgICAgICAgICAgIC8vIOWHjOaZqDEyXG4gICAgICAgICAgICAgICAgICAgIG5ldyBEYXRlKGAke3l9LyR7bX0vJHtkfSAyMzo1OTowMGApLFxuICAgICAgICAgICAgICAgICAgICBuZXcgRGF0ZSggbmV3IERhdGUoYCR7eX0vJHttfS8ke2R9IDIzOjU5OjAwYCkuZ2V0VGltZSggKSArIDIgKiA2MCAqIDEwMDAgKSxcbiAgICAgICAgICAgICAgICBdXG4gICAgICAgICAgICBdO1xuXG4gICAgICAgICAgICByZXR1cm4gcmFuZ2Uuc29tZSggeCA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3QgdCA9IG5vdy5nZXRUaW1lKCApO1xuICAgICAgICAgICAgICAgIGlmICggeFsgMCBdLmdldFRpbWUoICkgPD0gdCAmJiB4WyAxIF0uZ2V0VGltZSggKSA+PSB0ICkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoICFjaGVja0lzSW5SYW5nZSggbmV3IERhdGUoICkpKSB7IFxuICAgICAgICAgICAgcmV0dXJuIHsgc3RhdHVzOiAyMDAgfTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIDHjgIHojrflj5ZjdXJyZW50IHRyaXBcbiAgICAgICAgY29uc3QgdHJpcHMkID0gYXdhaXQgY2xvdWQuY2FsbEZ1bmN0aW9uKHtcbiAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAkdXJsOiAnZW50ZXInXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgbmFtZTogJ3RyaXAnXG4gICAgICAgIH0pO1xuICAgICAgICBjb25zdCB0cmlwcyA9IHRyaXBzJC5yZXN1bHQuZGF0YTtcbiAgICAgICAgY29uc3QgdHJpcCA9IHRyaXBzWyAwIF07XG5cbiAgICAgICAgLy8gMuOAgeiOt+WPliBwdXNoOiB0cnVlIOeahOeuoeeQhuWRmFxuICAgICAgICBjb25zdCBtZW1iZXJzID0gYXdhaXQgZGIuY29sbGVjdGlvbignbWFuYWdlci1tZW1iZXInKVxuICAgICAgICAgICAgLndoZXJlKHtcbiAgICAgICAgICAgICAgICBwdXNoOiB0cnVlXG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLmdldCggKTtcblxuICAgICAgICBpZiAoICF0cmlwIHx8IG1lbWJlcnMuZGF0YS5sZW5ndGggPT09IDAgKSB7XG4gICAgICAgICAgICByZXR1cm4geyBzdGF0dXM6IDIwMCB9O1xuICAgICAgICB9XG5cbiAgICAgICAgYXdhaXQgUHJvbWlzZS5hbGwoXG4gICAgICAgICAgICBtZW1iZXJzLmRhdGEubWFwKCBhc3luYyBtZW1iZXIgPT4ge1xuICAgICAgICAgICAgICAgIGxldCBjb3VudCA9IDA7XG4gICAgICAgICAgICAgICAgY29uc3QgeyBvcGVuaWQgfSA9IG1lbWJlclxuXG4gICAgICAgICAgICAgICAgLy8gM+OAgeiOt+WPluS4iuasoea1j+iniOiuouWNleeahOaXtumXtOaIs1xuICAgICAgICAgICAgICAgIGNvbnN0IGNvbmZpZyQgPSBhd2FpdCBkYi5jb2xsZWN0aW9uKCdhbmFseXNlLWRhdGEnKVxuICAgICAgICAgICAgICAgICAgICAud2hlcmUoe1xuICAgICAgICAgICAgICAgICAgICAgICAgb3BlbmlkLFxuICAgICAgICAgICAgICAgICAgICAgICAgdGlkOiB0cmlwLl9pZCxcbiAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6ICdtYW5hZ2VyLXRyaXAtb3JkZXItdmlzaXQnXG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgIC5nZXQoICk7XG4gICAgICAgICAgICAgICAgY29uc3QgY29uZmlnID0gY29uZmlnJC5kYXRhWyAwIF07XG5cbiAgICAgICAgICAgICAgICBsZXQgcXVlcnk6IGFueSA9IHtcbiAgICAgICAgICAgICAgICAgICAgdGlkOiB0cmlwLl9pZCxcbiAgICAgICAgICAgICAgICAgICAgcGF5X3N0YXR1czogXy5uZXEoJzAnKSxcbiAgICAgICAgICAgICAgICAgICAgYmFzZV9zdGF0dXM6IF8ub3IoIF8uZXEoJzAnKSwgXy5lcSgnMScpLCBfLmVxKCcyJykpXG4gICAgICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgICAgIGlmICggISFjb25maWcgKSB7XG4gICAgICAgICAgICAgICAgICAgIHF1ZXJ5ID0gT2JqZWN0LmFzc2lnbih7IH0sIHF1ZXJ5LCB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjcmVhdGVUaW1lOiBfLmd0ZSggY29uZmlnLnZhbHVlIClcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgLy8gNOOAgeiwg+eUqOaOqOmAgVxuICAgICAgICAgICAgICAgIGNvbnN0IGNvdW50JCA9IGF3YWl0IGRiLmNvbGxlY3Rpb24oJ29yZGVyJylcbiAgICAgICAgICAgICAgICAgICAgICAgIC53aGVyZSggcXVlcnkgKVxuICAgICAgICAgICAgICAgICAgICAgICAgLmNvdW50KCApO1xuICAgICAgICAgICAgICAgIGNvdW50ID0gY291bnQkLnRvdGFsO1xuXG4gICAgICAgICAgICAgICAgaWYgKCBjb3VudCA9PT0gMCApIHsgXG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAvLyA044CB6LCD55So5o6o6YCBXG4gICAgICAgICAgICAgICAgY29uc3QgcHVzaCQgPSBhd2FpdCBjbG91ZC5jYWxsRnVuY3Rpb24oe1xuICAgICAgICAgICAgICAgICAgICBuYW1lOiAnY29tbW9uJyxcbiAgICAgICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgICAgICAgJHVybDogJ3B1c2gtdGVtcGxhdGUnLFxuICAgICAgICAgICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9wZW5pZCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiAnbmV3T3JkZXInLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhZ2U6ICdwYWdlcy9tYW5hZ2VyLXRyaXAtbGlzdC9pbmRleCcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGV4dHM6IFtg5L2g5pyJJHtjb3VudH3mnaHmlrDorqLljZVgLCBg54K55Ye75p+l55yLYF1cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgLy8gNeOAgeabtOaWsOOAgeWIm+W7uumFjee9rlxuICAgICAgICAgICAgICAgIGlmICggcHVzaCQucmVzdWx0LnN0YXR1cyA9PT0gMjAwICkge1xuXG4gICAgICAgICAgICAgICAgICAgIGlmICggISFjb25maWcgKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyDmm7TmlrDkuIDkuIvmraTmnaHphY3nva5cbiAgICAgICAgICAgICAgICAgICAgICAgIGF3YWl0IGRiLmNvbGxlY3Rpb24oJ2FuYWx5c2UtZGF0YScpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLmRvYyggU3RyaW5nKCBjb25maWcuX2lkICkpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLnVwZGF0ZSh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlOiBuZXcgRGF0ZSggKS5nZXRUaW1lKCApXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIOWIm+W7uuS4gOS4i+mFjee9rlxuICAgICAgICAgICAgICAgICAgICAgICAgYXdhaXQgZGIuY29sbGVjdGlvbignYW5hbHlzZS1kYXRhJylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAuYWRkKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb3BlbmlkLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGlkOiB0cmlwLl9pZCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6ICdtYW5hZ2VyLXRyaXAtb3JkZXItdmlzaXQnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU6IG5ldyBEYXRlKCApLmdldFRpbWUoIClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuXG4gICAgICAgICAgICB9KVxuICAgICAgICApO1xuICAgICAgICBcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHN0YXR1czogMjAwXG4gICAgICAgIH07XG5cbiAgICB9IGNhdGNoICggZSApIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHN0YXR1czogNTAwLFxuICAgICAgICAgICAgbWVzc2FnZTogdHlwZW9mIGUgPT09ICdzdHJpbmcnID8gZSA6IEpTT04uc3RyaW5naWZ5KCBlIClcbiAgICAgICAgfVxuICAgIH1cbn0iXX0=