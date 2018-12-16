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
cloud.init();
var db = cloud.database();
var _ = db.command;
exports.main = function (event, context) { return __awaiter(_this, void 0, void 0, function () {
    var _this = this;
    return __generator(this, function (_a) {
        return [2, new Promise(function (resolve) { return __awaiter(_this, void 0, void 0, function () {
                var data$, trips, tripOneProducts$, e_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 4, , 5]);
                            return [4, db.collection('trip')
                                    .where({
                                    isClosed: false,
                                    published: true,
                                    end_date: _.gt(new Date().getTime())
                                })
                                    .limit(2)
                                    .orderBy('start_date', 'asc')
                                    .get()];
                        case 1:
                            data$ = _a.sent();
                            trips = data$.data;
                            if (!!!trips[0]) return [3, 3];
                            return [4, Promise.all(trips[0].selectedProductIds.map(function (pid) {
                                    return cloud.callFunction({
                                        data: {
                                            _id: pid
                                        },
                                        name: 'api-goods-detail'
                                    }).then(function (res) { return res.result.data; });
                                }))];
                        case 2:
                            tripOneProducts$ = _a.sent();
                            trips[0] = Object.assign({}, trips[0], {
                                products: tripOneProducts$
                            });
                            _a.label = 3;
                        case 3: return [2, resolve({
                                status: 200,
                                data: trips
                            })];
                        case 4:
                            e_1 = _a.sent();
                            return [2, resolve({
                                    status: 500,
                                    message: e_1
                                })];
                        case 5: return [2];
                    }
                });
            }); })];
    });
}); };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFDQSxpQkFnRUM7O0FBaEVELHFDQUF1QztBQUV2QyxLQUFLLENBQUMsSUFBSSxFQUFHLENBQUM7QUFFZCxJQUFNLEVBQUUsR0FBZ0IsS0FBSyxDQUFDLFFBQVEsRUFBRyxDQUFDO0FBQzFDLElBQU0sQ0FBQyxHQUFHLEVBQUUsQ0FBQyxPQUFPLENBQUM7QUFjUixRQUFBLElBQUksR0FBRyxVQUFRLEtBQUssRUFBRSxPQUFPOzs7UUFDdEMsV0FBTyxJQUFJLE9BQU8sQ0FBRSxVQUFNLE9BQU87Ozs7Ozs0QkFJWCxXQUFNLEVBQUUsQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDO3FDQUNwQyxLQUFLLENBQUM7b0NBQ0gsUUFBUSxFQUFFLEtBQUs7b0NBQ2YsU0FBUyxFQUFFLElBQUk7b0NBQ2YsUUFBUSxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUUsSUFBSSxJQUFJLEVBQUcsQ0FBQyxPQUFPLEVBQUcsQ0FBQztpQ0FDMUMsQ0FBQztxQ0FDRCxLQUFLLENBQUUsQ0FBQyxDQUFFO3FDQUNWLE9BQU8sQ0FBQyxZQUFZLEVBQUUsS0FBSyxDQUFDO3FDQUM1QixHQUFHLEVBQUcsRUFBQTs7NEJBUkwsS0FBSyxHQUFHLFNBUUg7NEJBRVAsS0FBSyxHQUFHLEtBQUssQ0FBQyxJQUFJLENBQUM7aUNBRWxCLENBQUMsQ0FBQyxLQUFLLENBQUUsQ0FBQyxDQUFFLEVBQVosY0FBWTs0QkFDWSxXQUFNLE9BQU8sQ0FBQyxHQUFHLENBQUUsS0FBSyxDQUFFLENBQUMsQ0FBRSxDQUFDLGtCQUFrQixDQUFDLEdBQUcsQ0FBRSxVQUFBLEdBQUc7b0NBQzlFLE9BQU8sS0FBSyxDQUFDLFlBQVksQ0FBQzt3Q0FDdEIsSUFBSSxFQUFFOzRDQUNGLEdBQUcsRUFBRSxHQUFHO3lDQUNYO3dDQUNELElBQUksRUFBRSxrQkFBa0I7cUNBQzNCLENBQUMsQ0FBQyxJQUFJLENBQUUsVUFBQSxHQUFHLElBQUksT0FBQSxHQUFHLENBQUMsTUFBTSxDQUFDLElBQUksRUFBZixDQUFlLENBQUUsQ0FBQztnQ0FDdEMsQ0FBQyxDQUFDLENBQUMsRUFBQTs7NEJBUEcsZ0JBQWdCLEdBQUcsU0FPdEI7NEJBQ0gsS0FBSyxDQUFFLENBQUMsQ0FBRSxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUMsRUFBRyxFQUFFLEtBQUssQ0FBRSxDQUFDLENBQUUsRUFBRTtnQ0FDeEMsUUFBUSxFQUFFLGdCQUFnQjs2QkFDN0IsQ0FBQyxDQUFDOztnQ0FJUCxXQUFPLE9BQU8sQ0FBQztnQ0FDWCxNQUFNLEVBQUUsR0FBRztnQ0FDWCxJQUFJLEVBQUUsS0FBSzs2QkFDZCxDQUFDLEVBQUE7Ozs0QkFHRixXQUFPLE9BQU8sQ0FBQztvQ0FDWCxNQUFNLEVBQUUsR0FBRztvQ0FDWCxPQUFPLEVBQUUsR0FBQztpQ0FDYixDQUFDLEVBQUM7Ozs7aUJBRVYsQ0FBQyxFQUFDOztLQUVOLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyIvLyDkupHlh73mlbDlhaXlj6Pmlofku7ZcbmltcG9ydCAqIGFzIGNsb3VkIGZyb20gJ3d4LXNlcnZlci1zZGsnO1xuXG5jbG91ZC5pbml0KCApO1xuXG5jb25zdCBkYjogREIuRGF0YWJhc2UgPSBjbG91ZC5kYXRhYmFzZSggKTtcbmNvbnN0IF8gPSBkYi5jb21tYW5kO1xuXG4vKipcbiAqIEBkZXNjcmlwdGlvbiDov5Tlm57kuKTkuKrooYznqIvvvIzkuIDkuKrlnKjnlKgv5Y2z5bCG5Yiw5p2l77yM5Y+m5LiA5Liq5LiL5LiA6Laf5Y2z5bCG5Yiw5p2lXG4gKiAtLS0tLS0tLSDor7fmsYIgLS0tLS0tLS0tLVxuICoge1xuICogICAgICBfaWQ6IOihjOeoi2lkXG4gKiB9XG4gKiAtLS0tLS0tLS0tIOi/lOWbniAtLS0tLS0tLVxuICoge1xuICogICAgICBkYXRhOiDooYznqIvor6bmg4VcbiAqICAgICAgc3RhdHVzXG4gKiB9XG4gKi9cbmV4cG9ydCBjb25zdCBtYWluID0gYXN5bmMgKCBldmVudCwgY29udGV4dCkgPT4ge1xuICAgIHJldHVybiBuZXcgUHJvbWlzZSggYXN5bmMgcmVzb2x2ZSA9PiB7XG4gICAgICAgIHRyeSB7XG5cbiAgICAgICAgICAgIC8vIOaMieW8gOWni+aXpeacn+ato+W6j++8jOiOt+WPluacgOWkmjLmnaHlt7Llj5HluIPvvIzmnKrnu5PmnZ/nmoTooYznqItcbiAgICAgICAgICAgIGNvbnN0IGRhdGEkID0gYXdhaXQgZGIuY29sbGVjdGlvbigndHJpcCcpXG4gICAgICAgICAgICAgICAgLndoZXJlKHtcbiAgICAgICAgICAgICAgICAgICAgaXNDbG9zZWQ6IGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICBwdWJsaXNoZWQ6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgIGVuZF9kYXRlOiBfLmd0KCBuZXcgRGF0ZSggKS5nZXRUaW1lKCApKVxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLmxpbWl0KCAyIClcbiAgICAgICAgICAgICAgICAub3JkZXJCeSgnc3RhcnRfZGF0ZScsICdhc2MnKVxuICAgICAgICAgICAgICAgIC5nZXQoICk7XG5cbiAgICAgICAgICAgIGxldCB0cmlwcyA9IGRhdGEkLmRhdGE7XG4gICAgICAgICAgICAvLyDmi4nlj5bmnIDmlrDooYznqIvnmoTmjqjojZDllYblk4FcbiAgICAgICAgICAgIGlmICggISF0cmlwc1sgMCBdKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgdHJpcE9uZVByb2R1Y3RzJCA9IGF3YWl0IFByb21pc2UuYWxsKCB0cmlwc1sgMCBdLnNlbGVjdGVkUHJvZHVjdElkcy5tYXAoIHBpZCA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBjbG91ZC5jYWxsRnVuY3Rpb24oe1xuICAgICAgICAgICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIF9pZDogcGlkXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogJ2FwaS1nb29kcy1kZXRhaWwnXG4gICAgICAgICAgICAgICAgICAgIH0pLnRoZW4oIHJlcyA9PiByZXMucmVzdWx0LmRhdGEgKTtcbiAgICAgICAgICAgICAgICB9KSk7XG4gICAgICAgICAgICAgICAgdHJpcHNbIDAgXSA9IE9iamVjdC5hc3NpZ24oeyB9LCB0cmlwc1sgMCBdLCB7XG4gICAgICAgICAgICAgICAgICAgIHByb2R1Y3RzOiB0cmlwT25lUHJvZHVjdHMkXG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIHJlc29sdmUoe1xuICAgICAgICAgICAgICAgIHN0YXR1czogMjAwLFxuICAgICAgICAgICAgICAgIGRhdGE6IHRyaXBzXG4gICAgICAgICAgICB9KVxuXG4gICAgICAgIH0gY2F0Y2ggKCBlICkge1xuICAgICAgICAgICAgcmV0dXJuIHJlc29sdmUoe1xuICAgICAgICAgICAgICAgIHN0YXR1czogNTAwLFxuICAgICAgICAgICAgICAgIG1lc3NhZ2U6IGVcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfSk7XG5cbn0iXX0=