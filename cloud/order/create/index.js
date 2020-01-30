"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
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
Object.defineProperty(exports, "__esModule", { value: true });
var cloud = require("wx-server-sdk");
var create$ = function (openid, data, db, ctx) { return __awaiter(void 0, void 0, void 0, function () {
    var isOccupied, cid, tid, sid, pid, deal$, find$, shouldPayAll, sl$, uids, create$_1, e_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 7, , 8]);
                isOccupied = data.isOccupied, cid = data.cid, tid = data.tid, sid = data.sid, pid = data.pid;
                if (!isOccupied) return [3, 2];
                return [4, cloud.callFunction({
                        name: 'good',
                        data: {
                            data: data,
                            $url: 'update-stock',
                        }
                    })];
            case 1:
                deal$ = _a.sent();
                if (deal$.result.status !== 200) {
                    throw '创建订单错误：整理库存失败';
                }
                _a.label = 2;
            case 2: return [4, db.collection('shopping-list')
                    .where({
                    tid: tid,
                    pid: pid,
                    sid: sid
                })
                    .get()];
            case 3:
                find$ = _a.sent();
                shouldPayAll = false;
                sl$ = find$.data[0];
                if (!!sl$) {
                    uids = sl$.uids;
                    if (uids.length === 1 && uids.includes(openid)) {
                        shouldPayAll = false;
                    }
                    else {
                        shouldPayAll = true;
                    }
                }
                else {
                    shouldPayAll = false;
                }
                return [4, db.collection('order')
                        .add({
                        data: __assign(__assign({}, data), { openid: openid })
                    })];
            case 4:
                create$_1 = _a.sent();
                if (!!!cid) return [3, 6];
                return [4, db.collection('cart')
                        .doc(cid)
                        .remove()];
            case 5:
                _a.sent();
                _a.label = 6;
            case 6: return [2, {
                    status: 200,
                    data: {
                        oid: create$_1._id,
                        shouldPayAll: shouldPayAll
                    }
                }];
            case 7:
                e_1 = _a.sent();
                console.log("----\u3010Error-Order-Create\u3011----\uFF1A" + JSON.stringify(e_1));
                return [2, ctx.body = { status: 500, message: e_1 }];
            case 8: return [2];
        }
    });
}); };
exports.create$ = create$;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEscUNBQXVDO0FBYXZDLElBQU0sT0FBTyxHQUFHLFVBQU8sTUFBTSxFQUFFLElBQUksRUFBRSxFQUFlLEVBQUUsR0FBRzs7Ozs7O2dCQUd6QyxVQUFVLEdBQXlCLElBQUksV0FBN0IsRUFBRSxHQUFHLEdBQW9CLElBQUksSUFBeEIsRUFBRSxHQUFHLEdBQWUsSUFBSSxJQUFuQixFQUFFLEdBQUcsR0FBVSxJQUFJLElBQWQsRUFBRSxHQUFHLEdBQUssSUFBSSxJQUFULENBQVU7cUJBRTNDLFVBQVUsRUFBVixjQUFVO2dCQUNHLFdBQU0sS0FBSyxDQUFDLFlBQVksQ0FBQzt3QkFDbkMsSUFBSSxFQUFFLE1BQU07d0JBQ1osSUFBSSxFQUFFOzRCQUNGLElBQUksTUFBQTs0QkFDSixJQUFJLEVBQUUsY0FBYzt5QkFDdkI7cUJBQ0osQ0FBQyxFQUFBOztnQkFOSSxLQUFLLEdBQUcsU0FNWjtnQkFFRixJQUFLLEtBQUssQ0FBQyxNQUFNLENBQUMsTUFBTSxLQUFLLEdBQUcsRUFBRztvQkFDL0IsTUFBTSxlQUFlLENBQUE7aUJBQ3hCOztvQkFJUyxXQUFNLEVBQUUsQ0FBQyxVQUFVLENBQUMsZUFBZSxDQUFDO3FCQUM3QyxLQUFLLENBQUM7b0JBQ0gsR0FBRyxLQUFBO29CQUNILEdBQUcsS0FBQTtvQkFDSCxHQUFHLEtBQUE7aUJBQ04sQ0FBQztxQkFDRCxHQUFHLEVBQUcsRUFBQTs7Z0JBTkwsS0FBSyxHQUFHLFNBTUg7Z0JBRVAsWUFBWSxHQUFHLEtBQUssQ0FBQztnQkFDbkIsR0FBRyxHQUFHLEtBQUssQ0FBQyxJQUFJLENBQUUsQ0FBQyxDQUFFLENBQUM7Z0JBRTVCLElBQUssQ0FBQyxDQUFDLEdBQUcsRUFBRztvQkFDRCxJQUFJLEdBQUssR0FBRyxLQUFSLENBQVM7b0JBRXJCLElBQUssSUFBSSxDQUFDLE1BQU0sS0FBSyxDQUFDLElBQUksSUFBSSxDQUFDLFFBQVEsQ0FBRSxNQUFNLENBQUUsRUFBRTt3QkFDL0MsWUFBWSxHQUFHLEtBQUssQ0FBQztxQkFDeEI7eUJBQU07d0JBQ0gsWUFBWSxHQUFHLElBQUksQ0FBQztxQkFDdkI7aUJBRUo7cUJBQU07b0JBQ0gsWUFBWSxHQUFHLEtBQUssQ0FBQztpQkFDeEI7Z0JBRWUsV0FBTSxFQUFFLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQzt5QkFDdkMsR0FBRyxDQUFDO3dCQUNELElBQUksd0JBQ0csSUFBSSxLQUNQLE1BQU0sUUFBQSxHQUNUO3FCQUNKLENBQUMsRUFBQTs7Z0JBTkEsWUFBVSxTQU1WO3FCQUdELENBQUMsQ0FBQyxHQUFHLEVBQUwsY0FBSztnQkFDTixXQUFNLEVBQUUsQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDO3lCQUN0QixHQUFHLENBQUUsR0FBRyxDQUFFO3lCQUNWLE1BQU0sRUFBRyxFQUFBOztnQkFGZCxTQUVjLENBQUM7O29CQUduQixXQUFPO29CQUNILE1BQU0sRUFBRSxHQUFHO29CQUNYLElBQUksRUFBRTt3QkFDRixHQUFHLEVBQUUsU0FBTyxDQUFDLEdBQUc7d0JBQ2hCLFlBQVksY0FBQTtxQkFDZjtpQkFDSixFQUFBOzs7Z0JBRUQsT0FBTyxDQUFDLEdBQUcsQ0FBQyxpREFBZ0MsSUFBSSxDQUFDLFNBQVMsQ0FBRSxHQUFDLENBQUksQ0FBQyxDQUFDO2dCQUNuRSxXQUFPLEdBQUcsQ0FBQyxJQUFJLEdBQUcsRUFBRSxNQUFNLEVBQUUsR0FBRyxFQUFFLE9BQU8sRUFBRSxHQUFDLEVBQUUsRUFBQzs7OztLQUVyRCxDQUFBO0FBRVEsMEJBQU8iLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBjbG91ZCBmcm9tICd3eC1zZXJ2ZXItc2RrJztcbi8qKlxuICogXG4gKiDliJvlu7rjgIzpooTku5jmrL7jgI3orqLljZXvvIHvvIHvvIFcbiAqIFxuICogZGF0YToge1xuICogICB0aWRcbiAqICAgc2lkXG4gKiAgIHBpZFxuICogICBjaWRcbiAqICAgY291bnRcbiAqIH1cbiAqL1xuY29uc3QgY3JlYXRlJCA9IGFzeW5jKCBvcGVuaWQsIGRhdGEsIGRiOiBEQi5EYXRhYmFzZSwgY3R4ICkgPT4ge1xuICAgIHRyeSB7XG5cbiAgICAgICAgY29uc3QgeyBpc09jY3VwaWVkLCBjaWQsIHRpZCwgc2lkLCBwaWQgfSA9IGRhdGE7XG4gICAgICAgIC8vIOWIm+W7uuS5i+WJje+8jOWkhOeQhuWNoOmihui0p+WtmOeahOmXrumimFxuICAgICAgICBpZiAoIGlzT2NjdXBpZWQgKSB7XG4gICAgICAgICAgICBjb25zdCBkZWFsJCA9IGF3YWl0IGNsb3VkLmNhbGxGdW5jdGlvbih7XG4gICAgICAgICAgICAgICAgbmFtZTogJ2dvb2QnLFxuICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgZGF0YSxcbiAgICAgICAgICAgICAgICAgICAgJHVybDogJ3VwZGF0ZS1zdG9jaycsXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgXG4gICAgICAgICAgICBpZiAoIGRlYWwkLnJlc3VsdC5zdGF0dXMgIT09IDIwMCApIHtcbiAgICAgICAgICAgICAgICB0aHJvdyAn5Yib5bu66K6i5Y2V6ZSZ6K+v77ya5pW055CG5bqT5a2Y5aSx6LSlJ1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLy8g5Yik5pat5piv5ZCm5bey57uP5pyJ5a+55bqU55qE6YeH6LSt5Y2V77yM5peg55qE6K+d5LuY6K6i6YeR77yM5pyJ55qE6K+d5LuY5YWo5qy+77yI5ou85Zui5Lu377yJXG4gICAgICAgIGNvbnN0IGZpbmQkID0gYXdhaXQgZGIuY29sbGVjdGlvbignc2hvcHBpbmctbGlzdCcpXG4gICAgICAgICAgICAud2hlcmUoe1xuICAgICAgICAgICAgICAgIHRpZCxcbiAgICAgICAgICAgICAgICBwaWQsXG4gICAgICAgICAgICAgICAgc2lkXG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLmdldCggKTtcblxuICAgICAgICBsZXQgc2hvdWxkUGF5QWxsID0gZmFsc2U7XG4gICAgICAgIGNvbnN0IHNsJCA9IGZpbmQkLmRhdGFbIDAgXTtcblxuICAgICAgICBpZiAoICEhc2wkICkge1xuICAgICAgICAgICAgY29uc3QgeyB1aWRzIH0gPSBzbCQ7XG5cbiAgICAgICAgICAgIGlmICggdWlkcy5sZW5ndGggPT09IDEgJiYgdWlkcy5pbmNsdWRlcyggb3BlbmlkICkpIHtcbiAgICAgICAgICAgICAgICBzaG91bGRQYXlBbGwgPSBmYWxzZTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgc2hvdWxkUGF5QWxsID0gdHJ1ZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgc2hvdWxkUGF5QWxsID0gZmFsc2U7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBjcmVhdGUkID0gYXdhaXQgZGIuY29sbGVjdGlvbignb3JkZXInKVxuICAgICAgICAgICAgLmFkZCh7XG4gICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgICAuLi5kYXRhLCBcbiAgICAgICAgICAgICAgICAgICAgb3BlbmlkXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgLy8g5Yig6Zmk5a+55bqU55qE6LSt54mp6L2mXG4gICAgICAgIGlmICggISFjaWQgKSB7XG4gICAgICAgICAgICBhd2FpdCBkYi5jb2xsZWN0aW9uKCdjYXJ0JylcbiAgICAgICAgICAgICAgICAuZG9jKCBjaWQgKVxuICAgICAgICAgICAgICAgIC5yZW1vdmUoICk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgc3RhdHVzOiAyMDAsXG4gICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgb2lkOiBjcmVhdGUkLl9pZCxcbiAgICAgICAgICAgICAgICBzaG91bGRQYXlBbGxcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0gY2F0Y2ggKCBlICkge1xuICAgICAgICBjb25zb2xlLmxvZyhgLS0tLeOAkEVycm9yLU9yZGVyLUNyZWF0ZeOAkS0tLS3vvJoke0pTT04uc3RyaW5naWZ5KCBlICl9YCk7XG4gICAgICAgIHJldHVybiBjdHguYm9keSA9IHsgc3RhdHVzOiA1MDAsIG1lc3NhZ2U6IGUgfTtcbiAgICB9XG59XG5cbmV4cG9ydCB7IGNyZWF0ZSQgfSJdfQ==