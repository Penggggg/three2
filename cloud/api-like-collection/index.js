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
exports.main = function (event, context) { return __awaiter(_this, void 0, void 0, function () {
    var pid, openid, history$, e_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 6, , 7]);
                pid = event.pid;
                openid = event.userInfo.openId;
                return [4, db.collection('like-collection')
                        .where({
                        pid: pid,
                        openid: openid
                    })
                        .count()];
            case 1:
                history$ = _a.sent();
                if (!(history$.total === 0)) return [3, 3];
                return [4, db.collection('like-collection')
                        .add({
                        data: {
                            pid: pid,
                            openid: openid
                        }
                    })];
            case 2:
                _a.sent();
                return [3, 5];
            case 3: return [4, db.collection('like-collection')
                    .where({
                    pid: pid,
                    openid: openid
                })
                    .remove()];
            case 4:
                _a.sent();
                _a.label = 5;
            case 5: return [2, new Promise(function (resolve) {
                    resolve({
                        status: 200
                    });
                })];
            case 6:
                e_1 = _a.sent();
                return [2, new Promise(function (resolve, reject) {
                        reject({
                            status: 500,
                            message: e_1
                        });
                    })];
            case 7: return [2];
        }
    });
}); };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFDQSxpQkFpRUM7O0FBakVELHFDQUF1QztBQUV2QyxLQUFLLENBQUMsSUFBSSxFQUFFLENBQUM7QUFFYixJQUFNLEVBQUUsR0FBZ0IsS0FBSyxDQUFDLFFBQVEsRUFBRSxDQUFDO0FBYTVCLFFBQUEsSUFBSSxHQUFHLFVBQVEsS0FBSyxFQUFFLE9BQU87Ozs7OztnQkFJaEMsR0FBRyxHQUFHLEtBQUssQ0FBQyxHQUFHLENBQUM7Z0JBQ2hCLE1BQU0sR0FBRyxLQUFLLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQztnQkFHcEIsV0FBTSxFQUFFLENBQUMsVUFBVSxDQUFDLGlCQUFpQixDQUFDO3lCQUNsRCxLQUFLLENBQUM7d0JBQ0gsR0FBRyxLQUFBO3dCQUNILE1BQU0sUUFBQTtxQkFDVCxDQUFDO3lCQUNELEtBQUssRUFBRyxFQUFBOztnQkFMUCxRQUFRLEdBQUcsU0FLSjtxQkFHUixDQUFBLFFBQVEsQ0FBQyxLQUFLLEtBQUssQ0FBQyxDQUFBLEVBQXBCLGNBQW9CO2dCQUNyQixXQUFNLEVBQUUsQ0FBQyxVQUFVLENBQUMsaUJBQWlCLENBQUM7eUJBQ2pDLEdBQUcsQ0FBQzt3QkFDRCxJQUFJLEVBQUU7NEJBQ0YsR0FBRyxLQUFBOzRCQUNILE1BQU0sUUFBQTt5QkFDVDtxQkFDSixDQUFDLEVBQUE7O2dCQU5OLFNBTU0sQ0FBQzs7b0JBR1AsV0FBTSxFQUFFLENBQUMsVUFBVSxDQUFDLGlCQUFpQixDQUFDO3FCQUNqQyxLQUFLLENBQUM7b0JBQ0gsR0FBRyxLQUFBO29CQUNILE1BQU0sUUFBQTtpQkFDVCxDQUFDO3FCQUNELE1BQU0sRUFBRyxFQUFBOztnQkFMZCxTQUtjLENBQUM7O29CQUduQixXQUFPLElBQUksT0FBTyxDQUFFLFVBQUEsT0FBTztvQkFDdkIsT0FBTyxDQUFDO3dCQUNKLE1BQU0sRUFBRSxHQUFHO3FCQUNkLENBQUMsQ0FBQztnQkFDUCxDQUFDLENBQUMsRUFBQzs7O2dCQUVILFdBQU8sSUFBSSxPQUFPLENBQUMsVUFBRSxPQUFPLEVBQUUsTUFBTTt3QkFDbEMsTUFBTSxDQUFDOzRCQUNMLE1BQU0sRUFBRSxHQUFHOzRCQUNYLE9BQU8sRUFBRSxHQUFDO3lCQUNYLENBQUMsQ0FBQTtvQkFDSixDQUFDLENBQUMsRUFBQTs7OztLQUdMLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyIvLyDkupHlh73mlbDlhaXlj6Pmlofku7ZcbmltcG9ydCAqIGFzIGNsb3VkIGZyb20gJ3d4LXNlcnZlci1zZGsnO1xuXG5jbG91ZC5pbml0KCk7XG5cbmNvbnN0IGRiOiBEQi5EYXRhYmFzZSA9IGNsb3VkLmRhdGFiYXNlKCk7XG5cbi8qKlxuICogQGRlc2NyaXB0aW9uIOaPkuWFpS/liKDpmaQg55So5oi35a+55ZWG5ZOB55qE5pS26JePXG4gKiAtLS0tLS0tLSDor7fmsYIgLS0tLS0tLS0tLVxuICoge1xuICogICAgICBwaWQ6IOWVhuWTgWlkXG4gKiB9XG4gKiAtLS0tLS0tLS0tIOi/lOWbniAtLS0tLS0tLVxuICoge1xuICogICAgICBzdGF0dXNcbiAqIH1cbiAqL1xuZXhwb3J0IGNvbnN0IG1haW4gPSBhc3luYyAoIGV2ZW50LCBjb250ZXh0KSA9PiB7XG5cbiAgdHJ5IHtcblxuICAgIGNvbnN0IHBpZCA9IGV2ZW50LnBpZDtcbiAgICBjb25zdCBvcGVuaWQgPSBldmVudC51c2VySW5mby5vcGVuSWQ7XG5cbiAgICAvLyDmn6Xmib7mnInmsqHmnInor6XorrDlvZVcbiAgICBjb25zdCBoaXN0b3J5JCA9IGF3YWl0IGRiLmNvbGxlY3Rpb24oJ2xpa2UtY29sbGVjdGlvbicpXG4gICAgICAgIC53aGVyZSh7XG4gICAgICAgICAgICBwaWQsXG4gICAgICAgICAgICBvcGVuaWRcbiAgICAgICAgfSlcbiAgICAgICAgLmNvdW50KCApO1xuXG4gICAgLy8g5paw5aKeXG4gICAgaWYgKCBoaXN0b3J5JC50b3RhbCA9PT0gMCApIHtcbiAgICAgICAgYXdhaXQgZGIuY29sbGVjdGlvbignbGlrZS1jb2xsZWN0aW9uJylcbiAgICAgICAgICAgIC5hZGQoe1xuICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgcGlkLFxuICAgICAgICAgICAgICAgICAgICBvcGVuaWRcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAvLyDliKDpmaRcbiAgICB9IGVsc2Uge1xuICAgICAgICBhd2FpdCBkYi5jb2xsZWN0aW9uKCdsaWtlLWNvbGxlY3Rpb24nKVxuICAgICAgICAgICAgLndoZXJlKHtcbiAgICAgICAgICAgICAgICBwaWQsXG4gICAgICAgICAgICAgICAgb3BlbmlkXG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLnJlbW92ZSggKTtcbiAgICB9XG5cbiAgICByZXR1cm4gbmV3IFByb21pc2UoIHJlc29sdmUgPT4ge1xuICAgICAgICByZXNvbHZlKHtcbiAgICAgICAgICAgIHN0YXR1czogMjAwXG4gICAgICAgIH0pO1xuICAgIH0pO1xuICB9IGNhdGNoICggZSApIHtcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKCByZXNvbHZlLCByZWplY3QgKSA9PiB7XG4gICAgICByZWplY3Qoe1xuICAgICAgICBzdGF0dXM6IDUwMCxcbiAgICAgICAgbWVzc2FnZTogZVxuICAgICAgfSlcbiAgICB9KVxuICB9XG5cbn0iXX0=