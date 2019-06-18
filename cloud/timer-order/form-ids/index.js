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
var FORM_ID_OVERTIME = 7 * 24 * 60 * 60 * 1000;
exports.clearFormIds = function () { return __awaiter(_this, void 0, void 0, function () {
    var find$, e_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                return [4, db.collection('form-ids')
                        .where({
                        creatTime: _.lte(new Date().getTime() - FORM_ID_OVERTIME)
                    })
                        .get()];
            case 1:
                find$ = _a.sent();
                return [4, Promise.all(find$.data.map(function (x) {
                        return db.collection('form-ids')
                            .doc(String(x._id))
                            .remove();
                    }))];
            case 2:
                _a.sent();
                return [2, { status: 200 }];
            case 3:
                e_1 = _a.sent();
                console.log('!!!!定时器clearFormIds错误');
                return [2, { status: 500 }];
            case 4: return [2];
        }
    });
}); };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSxpQkFvQ0U7O0FBcENGLHFDQUF1QztBQUV2QyxLQUFLLENBQUMsSUFBSSxDQUFDO0lBQ1AsR0FBRyxFQUFFLE9BQU8sQ0FBQyxHQUFHLENBQUMsS0FBSztDQUN6QixDQUFDLENBQUM7QUFFSCxJQUFNLEVBQUUsR0FBZ0IsS0FBSyxDQUFDLFFBQVEsRUFBRyxDQUFDO0FBQzFDLElBQU0sQ0FBQyxHQUFHLEVBQUUsQ0FBQyxPQUFPLENBQUM7QUFFckIsSUFBTSxnQkFBZ0IsR0FBRyxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsSUFBSSxDQUFDO0FBTXBDLFFBQUEsWUFBWSxHQUFHOzs7Ozs7Z0JBR04sV0FBTSxFQUFFLENBQUMsVUFBVSxDQUFDLFVBQVUsQ0FBQzt5QkFDeEMsS0FBSyxDQUFDO3dCQUNILFNBQVMsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFFLElBQUksSUFBSSxFQUFHLENBQUMsT0FBTyxFQUFHLEdBQUcsZ0JBQWdCLENBQUU7cUJBQ2hFLENBQUM7eUJBQ0QsR0FBRyxFQUFHLEVBQUE7O2dCQUpMLEtBQUssR0FBRyxTQUlIO2dCQUVYLFdBQU0sT0FBTyxDQUFDLEdBQUcsQ0FDYixLQUFLLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBRSxVQUFBLENBQUM7d0JBQ2IsT0FBQSxFQUFFLENBQUMsVUFBVSxDQUFDLFVBQVUsQ0FBQzs2QkFDcEIsR0FBRyxDQUFFLE1BQU0sQ0FBRSxDQUFDLENBQUMsR0FBRyxDQUFFLENBQUM7NkJBQ3JCLE1BQU0sRUFBRztvQkFGZCxDQUVjLENBQ2pCLENBQ0osRUFBQTs7Z0JBTkQsU0FNQyxDQUFDO2dCQUNGLFdBQU8sRUFBRSxNQUFNLEVBQUUsR0FBRyxFQUFFLEVBQUE7OztnQkFFdEIsT0FBTyxDQUFDLEdBQUcsQ0FBQyx1QkFBdUIsQ0FBRSxDQUFBO2dCQUNyQyxXQUFPLEVBQUUsTUFBTSxFQUFFLEdBQUcsRUFBRSxFQUFBOzs7O0tBRTdCLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBjbG91ZCBmcm9tICd3eC1zZXJ2ZXItc2RrJztcblxuY2xvdWQuaW5pdCh7XG4gICAgZW52OiBwcm9jZXNzLmVudi5jbG91ZFxufSk7XG5cbmNvbnN0IGRiOiBEQi5EYXRhYmFzZSA9IGNsb3VkLmRhdGFiYXNlKCApO1xuY29uc3QgXyA9IGRiLmNvbW1hbmQ7XG5cbmNvbnN0IEZPUk1fSURfT1ZFUlRJTUUgPSA3ICogMjQgKiA2MCAqIDYwICogMTAwMDtcblxuLyoqXG4gKiBAZGVzY3JpcHRpb25cbiAqIGZvcm0taWRzMTog5omA5pyJ6LaF6L+HN+WkqeeahGZvcm1pZOaYr+aXoOaViOeahO+8jOiHquWKqOWIoOmZpOaOiVxuICovXG5leHBvcnQgY29uc3QgY2xlYXJGb3JtSWRzID0gYXN5bmMgKCApID0+IHtcbiAgICB0cnkge1xuXG4gICAgICAgIGNvbnN0IGZpbmQkID0gYXdhaXQgZGIuY29sbGVjdGlvbignZm9ybS1pZHMnKVxuICAgICAgICAgICAgLndoZXJlKHtcbiAgICAgICAgICAgICAgICBjcmVhdFRpbWU6IF8ubHRlKCBuZXcgRGF0ZSggKS5nZXRUaW1lKCApIC0gRk9STV9JRF9PVkVSVElNRSApXG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLmdldCggKTtcblxuICAgICAgICBhd2FpdCBQcm9taXNlLmFsbChcbiAgICAgICAgICAgIGZpbmQkLmRhdGEubWFwKCB4ID0+IFxuICAgICAgICAgICAgICAgIGRiLmNvbGxlY3Rpb24oJ2Zvcm0taWRzJylcbiAgICAgICAgICAgICAgICAgICAgLmRvYyggU3RyaW5nKCB4Ll9pZCApKVxuICAgICAgICAgICAgICAgICAgICAucmVtb3ZlKCApXG4gICAgICAgICAgICApXG4gICAgICAgICk7XG4gICAgICAgIHJldHVybiB7IHN0YXR1czogMjAwIH1cbiAgICB9IGNhdGNoICggZSApIHtcbiAgICAgICAgY29uc29sZS5sb2coJyEhISHlrprml7blmahjbGVhckZvcm1JZHPplJnor68nLClcbiAgICAgICAgcmV0dXJuIHsgc3RhdHVzOiA1MDAgfVxuICAgIH1cbn07Il19