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
    var data$, trips, tripOneProducts$, e_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 4, , 5]);
                return [4, db.collection('trip')
                        .where({
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
            case 3: return [2, {
                    status: 200,
                    data: trips
                }];
            case 4:
                e_1 = _a.sent();
                return [2, new Promise(function (resolve, reject) {
                        reject({
                            status: 500,
                            message: e_1
                        });
                    })];
            case 5: return [2];
        }
    });
}); };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFDQSxpQkFnRUM7O0FBaEVELHFDQUF1QztBQUV2QyxLQUFLLENBQUMsSUFBSSxFQUFHLENBQUM7QUFFZCxJQUFNLEVBQUUsR0FBZ0IsS0FBSyxDQUFDLFFBQVEsRUFBRyxDQUFDO0FBQzFDLElBQU0sQ0FBQyxHQUFHLEVBQUUsQ0FBQyxPQUFPLENBQUM7QUFjUixRQUFBLElBQUksR0FBRyxVQUFRLEtBQUssRUFBRSxPQUFPOzs7Ozs7Z0JBS3BCLFdBQU0sRUFBRSxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUM7eUJBQ3BDLEtBQUssQ0FBQzt3QkFDSCxTQUFTLEVBQUUsSUFBSTt3QkFDZixRQUFRLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBRSxJQUFJLElBQUksRUFBRyxDQUFDLE9BQU8sRUFBRyxDQUFDO3FCQUMxQyxDQUFDO3lCQUNELEtBQUssQ0FBRSxDQUFDLENBQUU7eUJBQ1YsT0FBTyxDQUFDLFlBQVksRUFBRSxLQUFLLENBQUM7eUJBQzVCLEdBQUcsRUFBRyxFQUFBOztnQkFQTCxLQUFLLEdBQUcsU0FPSDtnQkFFUCxLQUFLLEdBQUcsS0FBSyxDQUFDLElBQUksQ0FBQztxQkFFbEIsQ0FBQyxDQUFDLEtBQUssQ0FBRSxDQUFDLENBQUUsRUFBWixjQUFZO2dCQUNZLFdBQU0sT0FBTyxDQUFDLEdBQUcsQ0FBRSxLQUFLLENBQUUsQ0FBQyxDQUFFLENBQUMsa0JBQWtCLENBQUMsR0FBRyxDQUFFLFVBQUEsR0FBRzt3QkFDOUUsT0FBTyxLQUFLLENBQUMsWUFBWSxDQUFDOzRCQUN0QixJQUFJLEVBQUU7Z0NBQ0YsR0FBRyxFQUFFLEdBQUc7NkJBQ1g7NEJBQ0QsSUFBSSxFQUFFLGtCQUFrQjt5QkFDM0IsQ0FBQyxDQUFDLElBQUksQ0FBRSxVQUFBLEdBQUcsSUFBSSxPQUFBLEdBQUcsQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFmLENBQWUsQ0FBRSxDQUFDO29CQUN0QyxDQUFDLENBQUMsQ0FBQyxFQUFBOztnQkFQRyxnQkFBZ0IsR0FBRyxTQU90QjtnQkFDSCxLQUFLLENBQUUsQ0FBQyxDQUFFLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQyxFQUFHLEVBQUUsS0FBSyxDQUFFLENBQUMsQ0FBRSxFQUFFO29CQUN4QyxRQUFRLEVBQUUsZ0JBQWdCO2lCQUM3QixDQUFDLENBQUM7O29CQUlQLFdBQU87b0JBQ0gsTUFBTSxFQUFFLEdBQUc7b0JBQ1gsSUFBSSxFQUFFLEtBQUs7aUJBQ2QsRUFBQTs7O2dCQUdELFdBQU8sSUFBSSxPQUFPLENBQUMsVUFBRSxPQUFPLEVBQUUsTUFBTTt3QkFDaEMsTUFBTSxDQUFDOzRCQUNILE1BQU0sRUFBRSxHQUFHOzRCQUNYLE9BQU8sRUFBRSxHQUFDO3lCQUNiLENBQUMsQ0FBQTtvQkFDTixDQUFDLENBQUMsRUFBQTs7OztLQUdULENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyIvLyDkupHlh73mlbDlhaXlj6Pmlofku7ZcbmltcG9ydCAqIGFzIGNsb3VkIGZyb20gJ3d4LXNlcnZlci1zZGsnO1xuXG5jbG91ZC5pbml0KCApO1xuXG5jb25zdCBkYjogREIuRGF0YWJhc2UgPSBjbG91ZC5kYXRhYmFzZSggKTtcbmNvbnN0IF8gPSBkYi5jb21tYW5kO1xuXG4vKipcbiAqIEBkZXNjcmlwdGlvbiDov5Tlm57kuKTkuKrooYznqIvvvIzkuIDkuKrlnKjnlKgv5Y2z5bCG5Yiw5p2l77yM5Y+m5LiA5Liq5LiL5LiA6Laf5Y2z5bCG5Yiw5p2lXG4gKiAtLS0tLS0tLSDor7fmsYIgLS0tLS0tLS0tLVxuICoge1xuICogICAgICBfaWQ6IOihjOeoi2lkXG4gKiB9XG4gKiAtLS0tLS0tLS0tIOi/lOWbniAtLS0tLS0tLVxuICoge1xuICogICAgICBkYXRhOiDooYznqIvor6bmg4VcbiAqICAgICAgc3RhdHVzXG4gKiB9XG4gKi9cbmV4cG9ydCBjb25zdCBtYWluID0gYXN5bmMgKCBldmVudCwgY29udGV4dCkgPT4ge1xuXG4gICAgdHJ5IHtcblxuICAgICAgICAvLyDmjInlvIDlp4vml6XmnJ/mraPluo/vvIzojrflj5bmnIDlpJoy5p2h5bey5Y+R5biD77yM5pyq57uT5p2f55qE6KGM56iLXG4gICAgICAgIGNvbnN0IGRhdGEkID0gYXdhaXQgZGIuY29sbGVjdGlvbigndHJpcCcpXG4gICAgICAgICAgICAud2hlcmUoe1xuICAgICAgICAgICAgICAgIHB1Ymxpc2hlZDogdHJ1ZSxcbiAgICAgICAgICAgICAgICBlbmRfZGF0ZTogXy5ndCggbmV3IERhdGUoICkuZ2V0VGltZSggKSlcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAubGltaXQoIDIgKVxuICAgICAgICAgICAgLm9yZGVyQnkoJ3N0YXJ0X2RhdGUnLCAnYXNjJylcbiAgICAgICAgICAgIC5nZXQoICk7XG5cbiAgICAgICAgbGV0IHRyaXBzID0gZGF0YSQuZGF0YTtcbiAgICAgICAgLy8g5ouJ5Y+W5pyA5paw6KGM56iL55qE5o6o6I2Q5ZWG5ZOBXG4gICAgICAgIGlmICggISF0cmlwc1sgMCBdKSB7XG4gICAgICAgICAgICBjb25zdCB0cmlwT25lUHJvZHVjdHMkID0gYXdhaXQgUHJvbWlzZS5hbGwoIHRyaXBzWyAwIF0uc2VsZWN0ZWRQcm9kdWN0SWRzLm1hcCggcGlkID0+IHtcbiAgICAgICAgICAgICAgICByZXR1cm4gY2xvdWQuY2FsbEZ1bmN0aW9uKHtcbiAgICAgICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgICAgICAgX2lkOiBwaWRcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgbmFtZTogJ2FwaS1nb29kcy1kZXRhaWwnXG4gICAgICAgICAgICAgICAgfSkudGhlbiggcmVzID0+IHJlcy5yZXN1bHQuZGF0YSApO1xuICAgICAgICAgICAgfSkpO1xuICAgICAgICAgICAgdHJpcHNbIDAgXSA9IE9iamVjdC5hc3NpZ24oeyB9LCB0cmlwc1sgMCBdLCB7XG4gICAgICAgICAgICAgICAgcHJvZHVjdHM6IHRyaXBPbmVQcm9kdWN0cyRcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgc3RhdHVzOiAyMDAsXG4gICAgICAgICAgICBkYXRhOiB0cmlwc1xuICAgICAgICB9XG5cbiAgICB9IGNhdGNoICggZSApIHtcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKCggcmVzb2x2ZSwgcmVqZWN0ICkgPT4ge1xuICAgICAgICAgICAgcmVqZWN0KHtcbiAgICAgICAgICAgICAgICBzdGF0dXM6IDUwMCxcbiAgICAgICAgICAgICAgICBtZXNzYWdlOiBlXG4gICAgICAgICAgICB9KVxuICAgICAgICB9KVxuICAgIH1cblxufSJdfQ==