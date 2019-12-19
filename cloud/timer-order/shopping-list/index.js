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
var getNow = function (ts) {
    if (ts === void 0) { ts = false; }
    if (ts) {
        return Date.now();
    }
    var time_0 = new Date(new Date().toLocaleString());
    return new Date(time_0.getTime() + 8 * 60 * 60 * 1000);
};
var checkIsInRange = function (now, range) {
    if (range === void 0) { range = [99]; }
    return range.some(function (x) {
        var h = now.getHours();
        return x === h && now.getMinutes() === 0;
    });
};
exports.catchLostOrders = function () { return __awaiter(_this, void 0, void 0, function () {
    var trips$, currentTrip, tid_1, find1$, find2$, tripShoppingList_1, e_1;
    var _this = this;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 5, , 6]);
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
                    return [2, { status: 200 }];
                }
                tid_1 = currentTrip._id;
                return [4, db.collection('order')
                        .where({
                        tid: tid_1,
                        pay_status: '1',
                        base_status: '0'
                    })
                        .get()];
            case 2:
                find1$ = _a.sent();
                if (find1$.data.length === 0) {
                    return [2, {
                            status: 200
                        }];
                }
                return [4, db.collection('shopping-list')
                        .where({
                        tid: tid_1
                    })
                        .get()];
            case 3:
                find2$ = _a.sent();
                tripShoppingList_1 = find2$.data;
                return [4, Promise.all(find1$.data.map(function (order) {
                        return new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
                            var sid_1, pid_1, _id_1, acid_1, openid, price, groupPrice, currentGoodShoppingList, e_2;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        _a.trys.push([0, 3, , 4]);
                                        sid_1 = order.sid, pid_1 = order.pid, _id_1 = order._id, acid_1 = order.acid, openid = order.openid, price = order.price, groupPrice = order.groupPrice;
                                        currentGoodShoppingList = tripShoppingList_1.find(function (x) {
                                            return x.sid === sid_1 &&
                                                x.pid === pid_1 &&
                                                x.acid === acid_1;
                                        });
                                        if (!((!currentGoodShoppingList) ||
                                            (!!currentGoodShoppingList && !currentGoodShoppingList.oids.find(function (x) { return x === _id_1; })))) return [3, 2];
                                        return [4, cloud.callFunction({
                                                name: 'shopping-list',
                                                data: {
                                                    $url: 'create',
                                                    data: {
                                                        openId: openid,
                                                        list: [{
                                                                tid: tid_1,
                                                                sid: sid_1,
                                                                pid: pid_1,
                                                                acid: acid_1,
                                                                price: price,
                                                                groupPrice: groupPrice,
                                                                oid: _id_1
                                                            }]
                                                    }
                                                }
                                            })];
                                    case 1:
                                        _a.sent();
                                        resolve();
                                        _a.label = 2;
                                    case 2:
                                        resolve();
                                        return [3, 4];
                                    case 3:
                                        e_2 = _a.sent();
                                        resolve();
                                        return [3, 4];
                                    case 4: return [2];
                                }
                            });
                        }); });
                    }))];
            case 4:
                _a.sent();
                return [2, {
                        status: 200
                    }];
            case 5:
                e_1 = _a.sent();
                console.log('!!!!定时器订单catchLostOrders错误', e_1);
                return [2, { status: 500 }];
            case 6: return [2];
        }
    });
}); };
exports.removeUselessOrders = function () { return __awaiter(_this, void 0, void 0, function () {
    var trips$, currentTrip, tid, uselessOrders$, e_3;
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
                tid = currentTrip._id;
                return [4, db.collection('order')
                        .where({
                        tid: tid,
                        base_status: '5'
                    })
                        .get()];
            case 2:
                uselessOrders$ = _a.sent();
                return [4, Promise.all(uselessOrders$.data.map(function (order) { return __awaiter(_this, void 0, void 0, function () {
                        var orderId, pid, sid, tid, where$, shoppingList$, theShoppingList, oids, orderIndex;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    orderId = order._id;
                                    pid = order.pid, sid = order.sid, tid = order.tid;
                                    where$ = {
                                        pid: pid,
                                        tid: tid
                                    };
                                    if (!!sid) {
                                        where$ = Object.assign({}, where$, {
                                            sid: sid
                                        });
                                    }
                                    return [4, db.collection('shopping-list')
                                            .where(where$)
                                            .get()];
                                case 1:
                                    shoppingList$ = _a.sent();
                                    theShoppingList = shoppingList$.data[0];
                                    if (!theShoppingList) {
                                        return [2];
                                    }
                                    oids = theShoppingList.oids;
                                    orderIndex = oids.findIndex(function (x) { return x === orderId; });
                                    if (!(orderIndex !== -1)) return [3, 3];
                                    oids.splice(orderIndex, 1);
                                    return [4, db.collection('shopping-list')
                                            .doc(String(theShoppingList._id))
                                            .update({
                                            data: {
                                                oids: oids
                                            }
                                        })];
                                case 2:
                                    _a.sent();
                                    return [2];
                                case 3: return [2];
                            }
                        });
                    }); }))];
            case 3:
                _a.sent();
                return [3, 5];
            case 4:
                e_3 = _a.sent();
                return [2, { status: 500 }];
            case 5: return [2];
        }
    });
}); };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSxpQkE4TUM7O0FBOU1ELHFDQUF1QztBQUV2QyxLQUFLLENBQUMsSUFBSSxDQUFDO0lBQ1AsR0FBRyxFQUFFLE9BQU8sQ0FBQyxHQUFHLENBQUMsS0FBSztDQUN6QixDQUFDLENBQUM7QUFFSCxJQUFNLEVBQUUsR0FBZ0IsS0FBSyxDQUFDLFFBQVEsRUFBRyxDQUFDO0FBQzFDLElBQU0sQ0FBQyxHQUFHLEVBQUUsQ0FBQyxPQUFPLENBQUM7QUFRckIsSUFBTSxNQUFNLEdBQUcsVUFBRSxFQUFVO0lBQVYsbUJBQUEsRUFBQSxVQUFVO0lBQ3ZCLElBQUssRUFBRSxFQUFHO1FBQ04sT0FBTyxJQUFJLENBQUMsR0FBRyxFQUFHLENBQUM7S0FDdEI7SUFDRCxJQUFNLE1BQU0sR0FBRyxJQUFJLElBQUksQ0FBRSxJQUFJLElBQUksRUFBRyxDQUFDLGNBQWMsRUFBRyxDQUFDLENBQUM7SUFDeEQsT0FBTyxJQUFJLElBQUksQ0FBRSxNQUFNLENBQUMsT0FBTyxFQUFHLEdBQUcsQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsSUFBSSxDQUFFLENBQUE7QUFDN0QsQ0FBQyxDQUFBO0FBRUQsSUFBTSxjQUFjLEdBQUcsVUFBRSxHQUFTLEVBQUUsS0FBYztJQUFkLHNCQUFBLEVBQUEsU0FBVSxFQUFFLENBQUU7SUFDOUMsT0FBTyxLQUFLLENBQUMsSUFBSSxDQUFFLFVBQUEsQ0FBQztRQUNoQixJQUFNLENBQUMsR0FBRyxHQUFHLENBQUMsUUFBUSxFQUFHLENBQUM7UUFDMUIsT0FBTyxDQUFDLEtBQUssQ0FBQyxJQUFJLEdBQUcsQ0FBQyxVQUFVLEVBQUcsS0FBSyxDQUFDLENBQUM7SUFDOUMsQ0FBQyxDQUFDLENBQUM7QUFDUCxDQUFDLENBQUE7QUFLWSxRQUFBLGVBQWUs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O0tBRTdCLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBjbG91ZCBmcm9tICd3eC1zZXJ2ZXItc2RrJztcblxuY2xvdWQuaW5pdCh7XG4gICAgZW52OiBwcm9jZXNzLmVudi5jbG91ZFxufSk7XG5cbmNvbnN0IGRiOiBEQi5EYXRhYmFzZSA9IGNsb3VkLmRhdGFiYXNlKCApO1xuY29uc3QgXyA9IGRiLmNvbW1hbmQ7XG5cbi8qKiBcbiAqIOi9rOaNouagvOael+WwvOayu+aXtuWMuiArOOaXtuWMulxuICogRGF0ZSgpLm5vdygpIC8gbmV3IERhdGUoKS5nZXRUaW1lKCkg5piv5pe25LiN5pe25q2j5bi455qEKzhcbiAqIERhdGUudG9Mb2NhbFN0cmluZyggKSDlpb3lg4/mmK/kuIDnm7TmmK8rMOeahFxuICog5YWI5ou/5YiwICsw77yM54S25ZCOKzhcbiAqL1xuY29uc3QgZ2V0Tm93ID0gKCB0cyA9IGZhbHNlICk6IGFueSA9PiB7XG4gICAgaWYgKCB0cyApIHtcbiAgICAgICAgcmV0dXJuIERhdGUubm93KCApO1xuICAgIH1cbiAgICBjb25zdCB0aW1lXzAgPSBuZXcgRGF0ZSggbmV3IERhdGUoICkudG9Mb2NhbGVTdHJpbmcoICkpO1xuICAgIHJldHVybiBuZXcgRGF0ZSggdGltZV8wLmdldFRpbWUoICkgKyA4ICogNjAgKiA2MCAqIDEwMDAgKVxufVxuXG5jb25zdCBjaGVja0lzSW5SYW5nZSA9ICggbm93OiBEYXRlLCByYW5nZSA9IFsgOTkgXSkgPT4ge1xuICAgIHJldHVybiByYW5nZS5zb21lKCB4ID0+IHtcbiAgICAgICAgY29uc3QgaCA9IG5vdy5nZXRIb3VycyggKTtcbiAgICAgICAgcmV0dXJuIHggPT09IGggJiYgbm93LmdldE1pbnV0ZXMoICkgPT09IDA7XG4gICAgfSk7XG59XG5cbi8qKlxuICog5riF5Y2VMe+8muafpeivouacquiiq+WuieaOkui/m+a4heWNleeahOiuouWNle+8iCBwYXlfc3RhdHVzOiAxIOeahG9yZGVyIO+8iVxuICovXG5leHBvcnQgY29uc3QgY2F0Y2hMb3N0T3JkZXJzID0gYXN5bmMgKCApID0+IHtcbiAgICB0cnkge1xuXG4gICAgICAgIC8vIOiOt+WPluW9k+WJjei/m+ihjOS4reeahOihjOeoi1xuICAgICAgICBjb25zdCB0cmlwcyQgPSBhd2FpdCBjbG91ZC5jYWxsRnVuY3Rpb24oe1xuICAgICAgICAgICAgbmFtZTogJ3RyaXAnLFxuICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICR1cmw6ICdlbnRlcidcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIGNvbnN0IGN1cnJlbnRUcmlwID0gdHJpcHMkLnJlc3VsdC5kYXRhWyAwIF07XG4gICAgICAgIFxuICAgICAgICBpZiAoICFjdXJyZW50VHJpcCApIHsgXG4gICAgICAgICAgICByZXR1cm4geyBzdGF0dXM6IDIwMCB9O1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgdGlkID0gY3VycmVudFRyaXAuX2lkO1xuXG4gICAgICAgIC8vIOaLv+WIsOaJgOacieivpeihjOeoi+S4i+eahOW3suS7mOiuoumHkeiuouWNleOAgeWfuuacrOeKtuaAgeS4ujDnmoTorqLljZVcbiAgICAgICAgY29uc3QgZmluZDEkID0gYXdhaXQgZGIuY29sbGVjdGlvbignb3JkZXInKVxuICAgICAgICAgICAgLndoZXJlKHtcbiAgICAgICAgICAgICAgICB0aWQsXG4gICAgICAgICAgICAgICAgcGF5X3N0YXR1czogJzEnLFxuICAgICAgICAgICAgICAgIGJhc2Vfc3RhdHVzOiAnMCdcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAuZ2V0KCApO1xuXG4gICAgICAgIGlmICggZmluZDEkLmRhdGEubGVuZ3RoID09PSAwICkgeyBcbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgc3RhdHVzOiAyMDBcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC8vIOaLv+WIsOivpeihjOeoi+S4i+eahOi0reeJqea4heWNlVxuICAgICAgICBjb25zdCBmaW5kMiQgPSBhd2FpdCBkYi5jb2xsZWN0aW9uKCdzaG9wcGluZy1saXN0JylcbiAgICAgICAgICAgIC53aGVyZSh7XG4gICAgICAgICAgICAgICAgdGlkXG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLmdldCggKTtcblxuICAgICAgICBjb25zdCB0cmlwU2hvcHBpbmdMaXN0ID0gZmluZDIkLmRhdGE7IFxuICAgICAgICBcbiAgICAgICAgLyoqXG4gICAgICAgICAqIOi3n+a4heWNlei/m+ihjOWMuemFjVxuICAgICAgICAgKiAxLiDor6XorqLljZXnmoTllYblk4Ev5Z6L5Y+36L+Y5rKh5pyJ5Lu75L2V5riF5Y2VXG4gICAgICAgICAqIDIuIOivpeiuouWNleayoeacieWcqOW3suacieWQjOasvuWVhuWTgS/lnovlj7fnmoTmuIXljZXph4zpnaJcbiAgICAgICAgICovXG5cbiAgICAgICAgYXdhaXQgUHJvbWlzZS5hbGwoIGZpbmQxJC5kYXRhLm1hcCggb3JkZXIgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKCBhc3luYyAoIHJlc29sdmUsIHJlamVjdCApID0+IHtcbiAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCB7IHNpZCwgcGlkLCBfaWQsIGFjaWQsIG9wZW5pZCwgcHJpY2UsIGdyb3VwUHJpY2UgfSA9IG9yZGVyO1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBjdXJyZW50R29vZFNob3BwaW5nTGlzdCA9IHRyaXBTaG9wcGluZ0xpc3QuZmluZCggeCA9PiBcbiAgICAgICAgICAgICAgICAgICAgICAgIHguc2lkID09PSBzaWQgJiZcbiAgICAgICAgICAgICAgICAgICAgICAgIHgucGlkID09PSBwaWQgJiZcbiAgICAgICAgICAgICAgICAgICAgICAgIHguYWNpZCA9PT0gYWNpZFxuICAgICAgICAgICAgICAgICAgICApO1xuXG4gICAgICAgICAgICAgICAgICAgIC8vIOWmguaenOayoeaciei0reeJqea4heWNle+8jOWImeWIm+W7ulxuICAgICAgICAgICAgICAgICAgICAvLyDlpoLmnpzmnInotK3nianmuIXljZXjgIHkvYbmmK/muIXljZXph4zpnaLnmoRvaWRz5rKh5pyJ5a6D77yM5bCx5o+S5YWl5bm25pu05pawXG4gICAgICAgICAgICAgICAgICAgIGlmICgoICFjdXJyZW50R29vZFNob3BwaW5nTGlzdCApIHx8XG4gICAgICAgICAgICAgICAgICAgICAgICAoICEhY3VycmVudEdvb2RTaG9wcGluZ0xpc3QgJiYgIWN1cnJlbnRHb29kU2hvcHBpbmdMaXN0Lm9pZHMuZmluZCggeCA9PiB4ID09PSBfaWQgKSApKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGF3YWl0IGNsb3VkLmNhbGxGdW5jdGlvbih7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogJ3Nob3BwaW5nLWxpc3QnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJHVybDogJ2NyZWF0ZScsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9wZW5JZDogb3BlbmlkLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGlzdDogW3tcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aWQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2lkLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBpZCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhY2lkLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHByaWNlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGdyb3VwUHJpY2UsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb2lkOiBfaWRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1dXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUoICk7XG4gICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICB9IFxuICAgICAgICAgICAgICAgICAgICByZXNvbHZlKCApO1xuICAgICAgICAgICAgICAgIH0gY2F0Y2ggKCBlICkge1xuICAgICAgICAgICAgICAgICAgICByZXNvbHZlKCApO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KSk7XG4gICAgICAgIFxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgc3RhdHVzOiAyMDBcbiAgICAgICAgfVxuXG4gICAgfSBjYXRjaCAoIGUgKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKCchISEh5a6a5pe25Zmo6K6i5Y2VY2F0Y2hMb3N0T3JkZXJz6ZSZ6K+vJywgZSApO1xuICAgICAgICByZXR1cm4geyBzdGF0dXM6IDUwMCB9O1xuICAgIH1cbn1cblxuLyoqIOa4heWNlTI6IOafpeivouaUr+S7mOiuoumHkei2heaXtueahOiuouWNle+8jOW5tuaKiuWFtuS7jui0reeJqea4heWNleS4reWOu+aOiSAqL1xuZXhwb3J0IGNvbnN0IHJlbW92ZVVzZWxlc3NPcmRlcnMgPSBhc3luYyAoICkgPT4ge1xuICAgIHRyeSB7XG5cbiAgICAgICAgLy8g6I635Y+W5b2T5YmN6L+b6KGM5Lit55qE6KGM56iLXG4gICAgICAgIGNvbnN0IHRyaXBzJCA9IGF3YWl0IGNsb3VkLmNhbGxGdW5jdGlvbih7XG4gICAgICAgICAgICBuYW1lOiAndHJpcCcsXG4gICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgJHVybDogJ2VudGVyJ1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICBjb25zdCBjdXJyZW50VHJpcCA9IHRyaXBzJC5yZXN1bHQuZGF0YVsgMCBdO1xuICAgICAgICBcbiAgICAgICAgaWYgKCAhY3VycmVudFRyaXAgKSB7IFxuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBzdGF0dXM6IDIwMFxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgdGlkID0gY3VycmVudFRyaXAuX2lkO1xuXG4gICAgICAgIGNvbnN0IHVzZWxlc3NPcmRlcnMkID0gYXdhaXQgZGIuY29sbGVjdGlvbignb3JkZXInKVxuICAgICAgICAgICAgLndoZXJlKHtcbiAgICAgICAgICAgICAgICB0aWQsXG4gICAgICAgICAgICAgICAgYmFzZV9zdGF0dXM6ICc1J1xuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC5nZXQoICk7XG5cbiAgICAgICAgYXdhaXQgUHJvbWlzZS5hbGwoIHVzZWxlc3NPcmRlcnMkLmRhdGEubWFwKCBhc3luYyBvcmRlciA9PiB7XG4gICAgICAgICAgICBjb25zdCBvcmRlcklkID0gb3JkZXIuX2lkO1xuICAgICAgICAgICAgY29uc3QgeyBwaWQsIHNpZCwgdGlkIH0gPSBvcmRlcjtcblxuICAgICAgICAgICAgbGV0IHdoZXJlJCA9IHtcbiAgICAgICAgICAgICAgICBwaWQsXG4gICAgICAgICAgICAgICAgdGlkXG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICBpZiAoICEhc2lkICkge1xuICAgICAgICAgICAgICAgIHdoZXJlJCA9IE9iamVjdC5hc3NpZ24oeyB9LCB3aGVyZSQsIHtcbiAgICAgICAgICAgICAgICAgICAgc2lkXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGNvbnN0IHNob3BwaW5nTGlzdCQgPSBhd2FpdCBkYi5jb2xsZWN0aW9uKCdzaG9wcGluZy1saXN0JylcbiAgICAgICAgICAgICAgICAud2hlcmUoIHdoZXJlJCApXG4gICAgICAgICAgICAgICAgLmdldCggKTtcbiAgICAgICAgICAgIGNvbnN0IHRoZVNob3BwaW5nTGlzdCA9IHNob3BwaW5nTGlzdCQuZGF0YVsgMCBdO1xuXG4gICAgICAgICAgICBpZiAoICF0aGVTaG9wcGluZ0xpc3QgKSB7IHJldHVybjsgfVxuXG4gICAgICAgICAgICBjb25zdCB7IG9pZHMgfSA9IHRoZVNob3BwaW5nTGlzdDtcbiAgICAgICAgICAgIGNvbnN0IG9yZGVySW5kZXggPSBvaWRzLmZpbmRJbmRleCggeCA9PiB4ID09PSBvcmRlcklkICk7XG5cbiAgICAgICAgICAgIGlmICggb3JkZXJJbmRleCAhPT0gLTEgKSB7XG4gICAgICAgICAgICAgICAgb2lkcy5zcGxpY2UoIG9yZGVySW5kZXgsIDEgKVxuICAgICAgICAgICAgICAgIGF3YWl0IGRiLmNvbGxlY3Rpb24oICdzaG9wcGluZy1saXN0JyApXG4gICAgICAgICAgICAgICAgICAgIC5kb2MoIFN0cmluZyggdGhlU2hvcHBpbmdMaXN0Ll9pZCApKVxuICAgICAgICAgICAgICAgICAgICAudXBkYXRlKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvaWRzXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9KSk7XG5cblxuICAgIH0gY2F0Y2ggKCBlICkge1xuICAgICAgICByZXR1cm4geyBzdGF0dXM6IDUwMCB9XG4gICAgfVxufSJdfQ==