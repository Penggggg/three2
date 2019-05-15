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
                    return [2, {
                            status: 200
                        }];
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
                console.log('!!!!定时器订单catchLostOrders错误');
                return [2, { status: 500 }];
            case 6: return [2];
        }
    });
}); };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSxpQkFrSEM7O0FBbEhELHFDQUF1QztBQUV2QyxLQUFLLENBQUMsSUFBSSxDQUFDO0lBQ1AsR0FBRyxFQUFFLE9BQU8sQ0FBQyxHQUFHLENBQUMsS0FBSztDQUN6QixDQUFDLENBQUM7QUFFSCxJQUFNLEVBQUUsR0FBZ0IsS0FBSyxDQUFDLFFBQVEsRUFBRyxDQUFDO0FBQzFDLElBQU0sQ0FBQyxHQUFHLEVBQUUsQ0FBQyxPQUFPLENBQUM7QUFLUixRQUFBLGVBQWUsR0FBRzs7Ozs7OztnQkFJUixXQUFNLEtBQUssQ0FBQyxZQUFZLENBQUM7d0JBQ3BDLElBQUksRUFBRSxNQUFNO3dCQUNaLElBQUksRUFBRTs0QkFDRixJQUFJLEVBQUUsT0FBTzt5QkFDaEI7cUJBQ0osQ0FBQyxFQUFBOztnQkFMSSxNQUFNLEdBQUcsU0FLYjtnQkFFSSxXQUFXLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUUsQ0FBQyxDQUFFLENBQUM7Z0JBRTVDLElBQUssQ0FBQyxXQUFXLEVBQUc7b0JBQ2hCLFdBQU87NEJBQ0gsTUFBTSxFQUFFLEdBQUc7eUJBQ2QsRUFBQTtpQkFDSjtnQkFFSyxRQUFNLFdBQVcsQ0FBQyxHQUFHLENBQUM7Z0JBR2IsV0FBTSxFQUFFLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQzt5QkFDdEMsS0FBSyxDQUFDO3dCQUNILEdBQUcsT0FBQTt3QkFDSCxVQUFVLEVBQUUsR0FBRzt3QkFDZixXQUFXLEVBQUUsR0FBRztxQkFDbkIsQ0FBQzt5QkFDRCxHQUFHLEVBQUcsRUFBQTs7Z0JBTkwsTUFBTSxHQUFHLFNBTUo7Z0JBRVgsSUFBSyxNQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sS0FBSyxDQUFDLEVBQUc7b0JBQzVCLFdBQU87NEJBQ0gsTUFBTSxFQUFFLEdBQUc7eUJBQ2QsRUFBQTtpQkFDSjtnQkFHYyxXQUFNLEVBQUUsQ0FBQyxVQUFVLENBQUMsZUFBZSxDQUFDO3lCQUM5QyxLQUFLLENBQUM7d0JBQ0gsR0FBRyxPQUFBO3FCQUNOLENBQUM7eUJBQ0QsR0FBRyxFQUFHLEVBQUE7O2dCQUpMLE1BQU0sR0FBRyxTQUlKO2dCQUVMLHFCQUFtQixNQUFNLENBQUMsSUFBSSxDQUFDO2dCQVFyQyxXQUFNLE9BQU8sQ0FBQyxHQUFHLENBQUUsTUFBTSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUUsVUFBQSxLQUFLO3dCQUNyQyxPQUFPLElBQUksT0FBTyxDQUFFLFVBQVEsT0FBTyxFQUFFLE1BQU07Ozs7Ozt3Q0FFM0IsUUFBbUQsS0FBSyxJQUFyRCxFQUFFLFFBQThDLEtBQUssSUFBaEQsRUFBRSxRQUF5QyxLQUFLLElBQTNDLEVBQUUsU0FBb0MsS0FBSyxLQUFyQyxFQUFFLE1BQU0sR0FBd0IsS0FBSyxPQUE3QixFQUFFLEtBQUssR0FBaUIsS0FBSyxNQUF0QixFQUFFLFVBQVUsR0FBSyxLQUFLLFdBQVYsQ0FBVzt3Q0FDM0QsdUJBQXVCLEdBQUcsa0JBQWdCLENBQUMsSUFBSSxDQUFFLFVBQUEsQ0FBQzs0Q0FDcEQsT0FBQSxDQUFDLENBQUMsR0FBRyxLQUFLLEtBQUc7Z0RBQ2IsQ0FBQyxDQUFDLEdBQUcsS0FBSyxLQUFHO2dEQUNiLENBQUMsQ0FBQyxJQUFJLEtBQUssTUFBSTt3Q0FGZixDQUVlLENBQ2xCLENBQUM7NkNBSUUsQ0FBQSxDQUFFLENBQUMsdUJBQXVCLENBQUU7NENBQzVCLENBQUUsQ0FBQyxDQUFDLHVCQUF1QixJQUFJLENBQUMsdUJBQXVCLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBRSxVQUFBLENBQUMsSUFBSSxPQUFBLENBQUMsS0FBSyxLQUFHLEVBQVQsQ0FBUyxDQUFFLENBQUUsQ0FBQSxFQURyRixjQUNxRjt3Q0FFckYsV0FBTSxLQUFLLENBQUMsWUFBWSxDQUFDO2dEQUNyQixJQUFJLEVBQUUsZUFBZTtnREFDckIsSUFBSSxFQUFFO29EQUNGLElBQUksRUFBRSxRQUFRO29EQUNkLElBQUksRUFBRTt3REFDRixNQUFNLEVBQUUsTUFBTTt3REFDZCxJQUFJLEVBQUUsQ0FBQztnRUFDSCxHQUFHLE9BQUE7Z0VBQ0gsR0FBRyxPQUFBO2dFQUNILEdBQUcsT0FBQTtnRUFDSCxJQUFJLFFBQUE7Z0VBQ0osS0FBSyxPQUFBO2dFQUNMLFVBQVUsWUFBQTtnRUFDVixHQUFHLEVBQUUsS0FBRzs2REFDWCxDQUFDO3FEQUNMO2lEQUNKOzZDQUNKLENBQUMsRUFBQTs7d0NBakJGLFNBaUJFLENBQUM7d0NBQ0gsT0FBTyxFQUFHLENBQUM7Ozt3Q0FHZixPQUFPLEVBQUcsQ0FBQzs7Ozt3Q0FFWCxPQUFPLEVBQUcsQ0FBQzs7Ozs7NkJBRWxCLENBQUMsQ0FBQztvQkFDUCxDQUFDLENBQUMsQ0FBQyxFQUFBOztnQkF6Q0gsU0F5Q0csQ0FBQztnQkFFSixXQUFPO3dCQUNILE1BQU0sRUFBRSxHQUFHO3FCQUNkLEVBQUE7OztnQkFHRCxPQUFPLENBQUMsR0FBRyxDQUFDLDRCQUE0QixDQUFFLENBQUE7Z0JBQzFDLFdBQU8sRUFBRSxNQUFNLEVBQUUsR0FBRyxFQUFFLEVBQUM7Ozs7S0FFOUIsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIGNsb3VkIGZyb20gJ3d4LXNlcnZlci1zZGsnO1xuXG5jbG91ZC5pbml0KHtcbiAgICBlbnY6IHByb2Nlc3MuZW52LmNsb3VkXG59KTtcblxuY29uc3QgZGI6IERCLkRhdGFiYXNlID0gY2xvdWQuZGF0YWJhc2UoICk7XG5jb25zdCBfID0gZGIuY29tbWFuZDtcblxuLyoqXG4gKiDmuIXljZUx77ya5p+l6K+i5pyq6KKr5a6J5o6S6L+b5riF5Y2V55qE6K6i5Y2V77yIcGF5X3N0YXR1czogMSDnmoRvcmRlcu+8iVxuICovXG5leHBvcnQgY29uc3QgY2F0Y2hMb3N0T3JkZXJzID0gYXN5bmMgKCApID0+IHtcbiAgICB0cnkge1xuXG4gICAgICAgIC8vIOiOt+WPluW9k+WJjei/m+ihjOS4reeahOihjOeoi1xuICAgICAgICBjb25zdCB0cmlwcyQgPSBhd2FpdCBjbG91ZC5jYWxsRnVuY3Rpb24oe1xuICAgICAgICAgICAgbmFtZTogJ3RyaXAnLFxuICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICR1cmw6ICdlbnRlcidcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgY29uc3QgY3VycmVudFRyaXAgPSB0cmlwcyQucmVzdWx0LmRhdGFbIDAgXTtcbiAgICAgICAgXG4gICAgICAgIGlmICggIWN1cnJlbnRUcmlwICkgeyBcbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgc3RhdHVzOiAyMDBcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IHRpZCA9IGN1cnJlbnRUcmlwLl9pZDtcblxuICAgICAgICAvLyDmi7/liLDmiYDmnInor6XooYznqIvkuIvnmoTlt7Lku5jorqLph5HorqLljZXjgIHln7rmnKznirbmgIHkuLow55qE6K6i5Y2VXG4gICAgICAgIGNvbnN0IGZpbmQxJCA9IGF3YWl0IGRiLmNvbGxlY3Rpb24oJ29yZGVyJylcbiAgICAgICAgICAgIC53aGVyZSh7XG4gICAgICAgICAgICAgICAgdGlkLFxuICAgICAgICAgICAgICAgIHBheV9zdGF0dXM6ICcxJyxcbiAgICAgICAgICAgICAgICBiYXNlX3N0YXR1czogJzAnXG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLmdldCggKTtcblxuICAgICAgICBpZiAoIGZpbmQxJC5kYXRhLmxlbmd0aCA9PT0gMCApIHsgXG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIHN0YXR1czogMjAwXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvLyDmi7/liLDor6XooYznqIvkuIvnmoTotK3nianmuIXljZVcbiAgICAgICAgY29uc3QgZmluZDIkID0gYXdhaXQgZGIuY29sbGVjdGlvbignc2hvcHBpbmctbGlzdCcpXG4gICAgICAgICAgICAud2hlcmUoe1xuICAgICAgICAgICAgICAgIHRpZFxuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC5nZXQoICk7XG5cbiAgICAgICAgY29uc3QgdHJpcFNob3BwaW5nTGlzdCA9IGZpbmQyJC5kYXRhOyBcbiAgICAgICAgXG4gICAgICAgIC8qKlxuICAgICAgICAgKiDot5/muIXljZXov5vooYzljLnphY1cbiAgICAgICAgICogMS4g6K+l6K6i5Y2V55qE5ZWG5ZOBL+Wei+WPt+i/mOayoeacieS7u+S9lea4heWNlVxuICAgICAgICAgKiAyLiDor6XorqLljZXmsqHmnInlnKjlt7LmnInlkIzmrL7llYblk4Ev5Z6L5Y+355qE5riF5Y2V6YeM6Z2iXG4gICAgICAgICAqL1xuXG4gICAgICAgIGF3YWl0IFByb21pc2UuYWxsKCBmaW5kMSQuZGF0YS5tYXAoIG9yZGVyID0+IHtcbiAgICAgICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSggYXN5bmMgKCByZXNvbHZlLCByZWplY3QgKSA9PiB7XG4gICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgeyBzaWQsIHBpZCwgX2lkLCBhY2lkLCBvcGVuaWQsIHByaWNlLCBncm91cFByaWNlIH0gPSBvcmRlcjtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgY3VycmVudEdvb2RTaG9wcGluZ0xpc3QgPSB0cmlwU2hvcHBpbmdMaXN0LmZpbmQoIHggPT4gXG4gICAgICAgICAgICAgICAgICAgICAgICB4LnNpZCA9PT0gc2lkICYmXG4gICAgICAgICAgICAgICAgICAgICAgICB4LnBpZCA9PT0gcGlkICYmXG4gICAgICAgICAgICAgICAgICAgICAgICB4LmFjaWQgPT09IGFjaWRcbiAgICAgICAgICAgICAgICAgICAgKTtcblxuICAgICAgICAgICAgICAgICAgICAvLyDlpoLmnpzmsqHmnInotK3nianmuIXljZXvvIzliJnliJvlu7pcbiAgICAgICAgICAgICAgICAgICAgLy8g5aaC5p6c5pyJ6LSt54mp5riF5Y2V44CB5L2G5piv5riF5Y2V6YeM6Z2i55qEb2lkc+ayoeacieWug++8jOWwseaPkuWFpeW5tuabtOaWsFxuICAgICAgICAgICAgICAgICAgICBpZiAoKCAhY3VycmVudEdvb2RTaG9wcGluZ0xpc3QgKSB8fFxuICAgICAgICAgICAgICAgICAgICAgICAgKCAhIWN1cnJlbnRHb29kU2hvcHBpbmdMaXN0ICYmICFjdXJyZW50R29vZFNob3BwaW5nTGlzdC5vaWRzLmZpbmQoIHggPT4geCA9PT0gX2lkICkgKSkge1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBhd2FpdCBjbG91ZC5jYWxsRnVuY3Rpb24oe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6ICdzaG9wcGluZy1saXN0JyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICR1cmw6ICdjcmVhdGUnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvcGVuSWQ6IG9wZW5pZCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxpc3Q6IFt7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGlkLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNpZCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwaWQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYWNpZCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcmljZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBncm91cFByaWNlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9pZDogX2lkXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXNvbHZlKCApO1xuICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgfSBcbiAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZSggKTtcbiAgICAgICAgICAgICAgICB9IGNhdGNoICggZSApIHtcbiAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZSggKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSkpO1xuICAgICAgICBcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHN0YXR1czogMjAwXG4gICAgICAgIH1cblxuICAgIH0gY2F0Y2ggKCBlICkge1xuICAgICAgICBjb25zb2xlLmxvZygnISEhIeWumuaXtuWZqOiuouWNlWNhdGNoTG9zdE9yZGVyc+mUmeivrycsKVxuICAgICAgICByZXR1cm4geyBzdGF0dXM6IDUwMCB9O1xuICAgIH1cbn0iXX0=