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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) if (e.indexOf(p[i]) < 0)
            t[p[i]] = s[p[i]];
    return t;
};
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
var cloud = require("wx-server-sdk");
var TcbRouter = require("tcb-router");
var axios = require("axios");
var crypto = require("crypto");
var rp = require("request-promise");
var CONFIG = require("./config");
cloud.init({
    env: process.env.cloud
});
var db = cloud.database();
var _ = db.command;
exports.main = function (event, context) { return __awaiter(_this, void 0, void 0, function () {
    var app;
    var _this = this;
    return __generator(this, function (_a) {
        app = new TcbRouter({ event: event });
        app.router('init', function (ctx, next) { return __awaiter(_this, void 0, void 0, function () {
            var collections, e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        collections = CONFIG.collections;
                        return [4, Promise.all([
                                collections.map(function (collectionName) { return db.createCollection(collectionName); })
                            ])];
                    case 1:
                        _a.sent();
                        return [2, ctx.body = { status: 200 }];
                    case 2:
                        e_1 = _a.sent();
                        return [2, ctx.body = { status: 500, message: e_1 }];
                    case 3: return [2];
                }
            });
        }); });
        app.router('dic', function (ctx, next) { return __awaiter(_this, void 0, void 0, function () {
            var dbRes, result_1, e_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4, db.collection('dic')
                                .where({
                                belong: db.RegExp({
                                    regexp: event.data.dicName.replace(/\,/g, '|'),
                                    optiond: 'i'
                                })
                            })
                                .get()];
                    case 1:
                        dbRes = _a.sent();
                        result_1 = {};
                        dbRes.data.map(function (dic) {
                            var _a;
                            result_1 = Object.assign({}, result_1, (_a = {},
                                _a[dic.belong] = dic[dic.belong].filter(function (x) { return !!x; }),
                                _a));
                        });
                        return [2, ctx.body = {
                                status: 200,
                                data: result_1
                            }];
                    case 2:
                        e_2 = _a.sent();
                        return [2, ctx.body = {
                                status: 500,
                                message: e_2
                            }];
                    case 3: return [2];
                }
            });
        }); });
        app.router('userEdit', function (ctx, next) { return __awaiter(_this, void 0, void 0, function () {
            var openid, data$, meta, e_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 6, , 7]);
                        openid = event.userInfo.openId;
                        return [4, db.collection('user')
                                .where({
                                openid: openid
                            })
                                .get()
                                .catch(function (err) { throw "" + err; })];
                    case 1:
                        data$ = _a.sent();
                        if (!(data$.data.length === 0)) return [3, 3];
                        return [4, db.collection('user')
                                .add({
                                data: Object.assign({}, event.data, {
                                    openid: openid,
                                    integral: 0
                                })
                            }).catch(function (err) { throw "" + err; })];
                    case 2:
                        _a.sent();
                        return [3, 5];
                    case 3:
                        meta = Object.assign({}, data$.data[0], event.data);
                        delete meta._id;
                        return [4, db.collection('user').doc(data$.data[0]._id)
                                .set({
                                data: Object.assign({}, meta, {
                                    integral: data$.data[0].integral
                                })
                            }).catch(function (err) { throw "" + err; })];
                    case 4:
                        _a.sent();
                        _a.label = 5;
                    case 5: return [2, ctx.body = {
                            status: 200
                        }];
                    case 6:
                        e_3 = _a.sent();
                        return [2, ctx.body = {
                                status: 500,
                                message: e_3
                            }];
                    case 7: return [2];
                }
            });
        }); });
        app.router('is-new-customer', function (ctx, next) { return __awaiter(_this, void 0, void 0, function () {
            var openid, find$, e_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        openid = event.data.openId || event.userInfo.openId;
                        return [4, db.collection('order')
                                .where({
                                openid: openid,
                                base_status: '3'
                            })
                                .count()];
                    case 1:
                        find$ = _a.sent();
                        return [2, ctx.body = {
                                status: 200,
                                data: find$.total < 3
                            }];
                    case 2:
                        e_4 = _a.sent();
                        return [2, ctx.body = {
                                status: 200,
                                data: true
                            }];
                    case 3: return [2];
                }
            });
        }); });
        app.router('wxpay', function (ctx, next) { return __awaiter(_this, void 0, void 0, function () {
            var _a, key_1, body, mch_id, attach, notify_url, spbill_create_ip, appid, total_fee, openid, nonce_str, timeStamp, out_trade_no, paysign, formData, res, xml, prepay_id, paySign, e_5;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        _a = CONFIG.wxPay, key_1 = _a.key, body = _a.body, mch_id = _a.mch_id, attach = _a.attach, notify_url = _a.notify_url, spbill_create_ip = _a.spbill_create_ip;
                        appid = CONFIG.app.id;
                        total_fee = event.data.total_fee;
                        openid = event.userInfo.openId;
                        nonce_str = Math.random().toString(36).substr(2, 15);
                        timeStamp = parseInt(String(Date.now() / 1000)) + '';
                        out_trade_no = "otn" + nonce_str + timeStamp;
                        paysign = function (_a) {
                            var args = __rest(_a, []);
                            var sa = [];
                            for (var k in args) {
                                sa.push(k + '=' + args[k]);
                            }
                            sa.push('key=' + key_1);
                            var s = crypto.createHash('md5').update(sa.join('&'), 'utf8').digest('hex');
                            return s.toUpperCase();
                        };
                        formData = "<xml>";
                        formData += "<appid>" + appid + "</appid>";
                        formData += "<attach>" + attach + "</attach>";
                        formData += "<body>" + body + "</body>";
                        formData += "<mch_id>" + mch_id + "</mch_id>";
                        formData += "<nonce_str>" + nonce_str + "</nonce_str>";
                        formData += "<notify_url>" + notify_url + "</notify_url>";
                        formData += "<openid>" + openid + "</openid>";
                        formData += "<out_trade_no>" + out_trade_no + "</out_trade_no>";
                        formData += "<spbill_create_ip>" + spbill_create_ip + "</spbill_create_ip>";
                        formData += "<total_fee>" + total_fee + "</total_fee>";
                        formData += "<trade_type>JSAPI</trade_type>";
                        formData += "<sign>" + paysign({ appid: appid, attach: attach, body: body, mch_id: mch_id, nonce_str: nonce_str, notify_url: notify_url, openid: openid, out_trade_no: out_trade_no, spbill_create_ip: spbill_create_ip, total_fee: total_fee, trade_type: 'JSAPI' }) + "</sign>";
                        formData += "</xml>";
                        return [4, rp({ url: "https://api.mch.weixin.qq.com/pay/unifiedorder", method: 'POST', body: formData })];
                    case 1:
                        res = _b.sent();
                        xml = res.toString("utf-8");
                        if (xml.indexOf('prepay_id') < 0) {
                            return [2, ctx.body = {
                                    status: 500
                                }];
                        }
                        console.log('eeeee', formData, xml);
                        prepay_id = xml.split("<prepay_id>")[1].split("</prepay_id>")[0].split('[')[2].split(']')[0];
                        paySign = paysign({ appId: appid, nonceStr: nonce_str, package: ('prepay_id=' + prepay_id), signType: 'MD5', timeStamp: timeStamp });
                        return [2, ctx.body = {
                                status: 200,
                                data: { appid: appid, nonce_str: nonce_str, timeStamp: timeStamp, prepay_id: prepay_id, paySign: paySign }
                            }];
                    case 2:
                        e_5 = _b.sent();
                        return [2, ctx.body = {
                                status: 500
                            }];
                    case 3: return [2];
                }
            });
        }); });
        app.router('wxinfo-edit', function (ctx, next) { return __awaiter(_this, void 0, void 0, function () {
            var temp_1, e_6;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        temp_1 = [];
                        Object.keys(event.data).map(function (key) {
                            if (!!event.data[key]) {
                                temp_1.push({
                                    type: key,
                                    value: event.data[key]
                                });
                            }
                        });
                        return [4, Promise.all(temp_1.map(function (x) { return __awaiter(_this, void 0, void 0, function () {
                                var find$;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4, db.collection('manager-wx-info')
                                                .where({
                                                type: x.type
                                            })
                                                .get()];
                                        case 1:
                                            find$ = _a.sent();
                                            if (!(find$.data.length > 0)) return [3, 3];
                                            return [4, db.collection('manager-wx-info').doc(find$.data[0]._id)
                                                    .set({
                                                    data: x
                                                })];
                                        case 2:
                                            _a.sent();
                                            return [3, 5];
                                        case 3: return [4, db.collection('manager-wx-info')
                                                .add({
                                                data: x
                                            })];
                                        case 4:
                                            _a.sent();
                                            _a.label = 5;
                                        case 5: return [2];
                                    }
                                });
                            }); }))];
                    case 1:
                        _a.sent();
                        return [2, ctx.body = {
                                status: 200
                            }];
                    case 2:
                        e_6 = _a.sent();
                        return [2, ctx.body = { status: 500 }];
                    case 3: return [2];
                }
            });
        }); });
        app.router('wxinfo', function (ctx, next) { return __awaiter(_this, void 0, void 0, function () {
            var target_1, finds$, temp_2, e_7;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        target_1 = ['wx_qrcode', 'group_qrcode'];
                        return [4, Promise.all(target_1.map(function (type) {
                                return db.collection('manager-wx-info')
                                    .where({
                                    type: type
                                })
                                    .get();
                            }))];
                    case 1:
                        finds$ = _a.sent();
                        temp_2 = {};
                        finds$.map(function (find$, index) {
                            if (find$.data.length > 0) {
                                temp_2[target_1[index]] = find$.data[0].value;
                            }
                        });
                        return [2, ctx.body = {
                                status: 200,
                                data: temp_2
                            }];
                    case 2:
                        e_7 = _a.sent();
                        return [2, ctx.body = { status: 500 }];
                    case 3: return [2];
                }
            });
        }); });
        app.router('mypage-info', function (ctx, next) { return __awaiter(_this, void 0, void 0, function () {
            var orders$, coupons$, e_8;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4, db.collection('order')
                                .where({
                                openid: event.userInfo.openId
                            })
                                .count()];
                    case 1:
                        orders$ = _a.sent();
                        return [4, db.collection('coupon')
                                .where({
                                openid: event.userInfo.openId
                            })
                                .count()];
                    case 2:
                        coupons$ = _a.sent();
                        return [2, ctx.body = {
                                status: 200,
                                data: {
                                    coupons: coupons$.total,
                                    orders: orders$.total
                                }
                            }];
                    case 3:
                        e_8 = _a.sent();
                        return [2, ctx.body = { status: 500 }];
                    case 4: return [2];
                }
            });
        }); });
        app.router('customer-in-trip', function (ctx, next) { return __awaiter(_this, void 0, void 0, function () {
            var limit, allOrderUsers$, openids, avatats$, e_9;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        limit = 100;
                        return [4, db.collection('order')
                                .where({
                                tid: event.data.tid
                            })
                                .orderBy('createTime', 'desc')
                                .limit(limit)
                                .field({
                                openid: true
                            })
                                .get()];
                    case 1:
                        allOrderUsers$ = _a.sent();
                        openids = Array.from(new Set(allOrderUsers$.data.map(function (x) { return x.openid; })));
                        return [4, Promise.all(openids.map(function (oid) {
                                return db.collection('user')
                                    .where({
                                    openid: oid
                                })
                                    .field({
                                    avatarUrl: true
                                })
                                    .get();
                            }))];
                    case 2:
                        avatats$ = _a.sent();
                        return [2, ctx.body = {
                                status: 200,
                                data: avatats$.map(function (x) { return x.data[0].avatarUrl; })
                            }];
                    case 3:
                        e_9 = _a.sent();
                        return [2, ctx.body = { status: 500 }];
                    case 4: return [2];
                }
            });
        }); });
        app.router('notification-getmoney', function (ctx, next) { return __awaiter(_this, void 0, void 0, function () {
            var page, _a, touser, form_id, data, prepay_id, result, _b, access_token, errcode, reqData_1, reqData$_1, send, e_10;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _c.trys.push([0, 3, , 4]);
                        page = event.data.page || 'pages/order-list/index';
                        _a = event.data, touser = _a.touser, form_id = _a.form_id, data = _a.data, prepay_id = _a.prepay_id;
                        return [4, axios({
                                method: 'get',
                                url: "https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=" + CONFIG.app.id + "&secret=" + CONFIG.app.secrect
                            })];
                    case 1:
                        result = _c.sent();
                        _b = result.data, access_token = _b.access_token, errcode = _b.errcode;
                        if (errcode) {
                            throw '生成access_token错误';
                        }
                        reqData_1 = {};
                        reqData$_1 = {
                            page: page,
                            touser: touser,
                            prepay_id: prepay_id,
                            form_id: form_id,
                            template_id: CONFIG.notification_template.getMoney3,
                            data: {
                                "keyword1": {
                                    "value": data.title
                                },
                                "keyword2": {
                                    "value": data.time
                                }
                            }
                        };
                        Object.keys(reqData$_1).map(function (key) {
                            if (!!reqData$_1[key]) {
                                reqData_1[key] = reqData$_1[key];
                            }
                        });
                        return [4, axios({
                                data: reqData_1,
                                method: 'post',
                                url: "https://api.weixin.qq.com/cgi-bin/message/wxopen/template/send?access_token=" + access_token
                            })];
                    case 2:
                        send = _c.sent();
                        return [2, ctx.body = {
                                data: send.data,
                                status: 200
                            }];
                    case 3:
                        e_10 = _c.sent();
                        return [2, ctx.body = { message: e_10, status: 500 }];
                    case 4: return [2];
                }
            });
        }); });
        app.router('add-auth-by-psw', function (ctx, next) { return __awaiter(_this, void 0, void 0, function () {
            var e_11, result, salt, openid, _a, psw, content, getErr, decipher, decrypted, _b, c_timestamp, c_appid, c_content, c_max, check$, target, checkManager$, targetManager, collections, e_12, e_13;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _c.trys.push([0, 19, , 20]);
                        _c.label = 1;
                    case 1:
                        _c.trys.push([1, 4, , 5]);
                        return [4, db.createCollection('manager-member')];
                    case 2:
                        _c.sent();
                        return [4, db.createCollection('authpsw')];
                    case 3:
                        _c.sent();
                        return [3, 5];
                    case 4:
                        e_11 = _c.sent();
                        return [3, 5];
                    case 5:
                        result = '';
                        salt = CONFIG.auth.salt;
                        openid = event.userInfo.openId;
                        _a = event.data, psw = _a.psw, content = _a.content;
                        getErr = function (message) { return ({
                            message: message,
                            status: 500,
                        }); };
                        try {
                            decipher = crypto.createDecipher('aes192', salt);
                            decrypted = decipher.update(psw, 'hex', 'utf8');
                            result = decrypted + decipher.final('utf8');
                        }
                        catch (e) {
                            return [2, ctx.body = getErr('密钥错误，请核对')];
                        }
                        _b = result.split('-'), c_timestamp = _b[0], c_appid = _b[1], c_content = _b[2], c_max = _b[3];
                        if (new Date().getTime() - Number(c_timestamp) > 30 * 60 * 1000) {
                            return [2, ctx.body = getErr('密钥已过期，请联系客服')];
                        }
                        if (c_appid !== CONFIG.app.id) {
                            return [2, ctx.body = getErr('密钥与小程序不关联')];
                        }
                        if (c_content.replace(/\s+/g, '') !== content.replace(/\s+/g, '')) {
                            return [2, ctx.body = getErr('提示词错误，请联系客服')];
                        }
                        return [4, db.collection('authpsw')
                                .where({
                                appId: c_appid,
                                timestamp: c_timestamp
                            })
                                .get()];
                    case 6:
                        check$ = _c.sent();
                        target = check$.data[0];
                        if (!!!target) return [3, 10];
                        if (!(target.count >= 2)) return [3, 7];
                        return [2, ctx.body = getErr('密钥已被使用，请联系客服')];
                    case 7: return [4, db.collection('authpsw')
                            .doc(String(target._id))
                            .update({
                            data: {
                                count: _.inc(1)
                            }
                        })];
                    case 8:
                        _c.sent();
                        _c.label = 9;
                    case 9: return [3, 12];
                    case 10: return [4, db.collection('authpsw')
                            .add({
                            data: {
                                count: 1,
                                appId: c_appid,
                                timestamp: c_timestamp
                            }
                        })];
                    case 11:
                        _c.sent();
                        _c.label = 12;
                    case 12: return [4, db.collection('manager-member')
                            .where({
                            openid: openid
                        })
                            .get()];
                    case 13:
                        checkManager$ = _c.sent();
                        targetManager = checkManager$.data[0];
                        if (!!targetManager) return [3, 15];
                        return [4, db.collection('manager-member')
                                .add({
                                data: {
                                    openid: openid,
                                    content: c_content,
                                    createTime: new Date().getTime()
                                }
                            })];
                    case 14:
                        _c.sent();
                        _c.label = 15;
                    case 15:
                        _c.trys.push([15, 17, , 18]);
                        collections = CONFIG.collections;
                        return [4, Promise.all(collections.map(function (collectionName) { return db.createCollection(collectionName); }))];
                    case 16:
                        _c.sent();
                        return [3, 18];
                    case 17:
                        e_12 = _c.sent();
                        return [3, 18];
                    case 18: return [2, ctx.body = {
                            status: 200
                        }];
                    case 19:
                        e_13 = _c.sent();
                        return [2, ctx.body = {
                                status: 500,
                                message: '密钥检查发生错误'
                            }];
                    case 20: return [2];
                }
            });
        }); });
        return [2, app.serve()];
    });
}); };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSxpQkFvbUJDOztBQXBtQkQscUNBQXVDO0FBQ3ZDLHNDQUF3QztBQUN4Qyw2QkFBK0I7QUFDL0IsK0JBQWlDO0FBQ2pDLG9DQUFzQztBQUN0QyxpQ0FBbUM7QUFFbkMsS0FBSyxDQUFDLElBQUksQ0FBQztJQUNQLEdBQUcsRUFBRSxPQUFPLENBQUMsR0FBRyxDQUFDLEtBQUs7Q0FDekIsQ0FBQyxDQUFDO0FBRUgsSUFBTSxFQUFFLEdBQWdCLEtBQUssQ0FBQyxRQUFRLEVBQUcsQ0FBQztBQUMxQyxJQUFNLENBQUMsR0FBRyxFQUFFLENBQUMsT0FBTyxDQUFDO0FBTVIsUUFBQSxJQUFJLEdBQUcsVUFBUSxLQUFLLEVBQUUsT0FBTzs7OztRQUVoQyxHQUFHLEdBQUcsSUFBSSxTQUFTLENBQUMsRUFBRSxLQUFLLE9BQUEsRUFBRSxDQUFDLENBQUM7UUFNckMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxNQUFNLEVBQUUsVUFBTyxHQUFHLEVBQUUsSUFBSTs7Ozs7O3dCQUVyQixXQUFXLEdBQUcsTUFBTSxDQUFDLFdBQVcsQ0FBQzt3QkFDdkMsV0FBTSxPQUFPLENBQUMsR0FBRyxDQUFDO2dDQUNkLFdBQVcsQ0FBQyxHQUFHLENBQUUsVUFBQSxjQUFjLElBQUksT0FBQyxFQUFVLENBQUMsZ0JBQWdCLENBQUUsY0FBYyxDQUFFLEVBQTlDLENBQThDLENBQUM7NkJBQ3JGLENBQUMsRUFBQTs7d0JBRkYsU0FFRSxDQUFBO3dCQUVGLFdBQU8sR0FBRyxDQUFDLElBQUksR0FBRyxFQUFFLE1BQU0sRUFBRSxHQUFHLEVBQUUsRUFBQTs7O3dCQUVqQyxXQUFPLEdBQUcsQ0FBQyxJQUFJLEdBQUcsRUFBRSxNQUFNLEVBQUUsR0FBRyxFQUFFLE9BQU8sRUFBRSxHQUFDLEVB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QUE7O3dCQVBOLFNBT00sQ0FBQTs7Ozt3QkFLQSxXQUFXLEdBQUcsTUFBTSxDQUFDLFdBQVcsQ0FBQzt3QkFDdkMsV0FBTSxPQUFPLENBQUMsR0FBRyxDQUNiLFdBQVcsQ0FBQyxHQUFHLENBQUUsVUFBQSxjQUFjLElBQUksT0FBQyxFQUFVLENBQUMsZ0JBQWdCLENBQUUsY0FBYyxDQUFFLEVBQTlDLENBQThDLENBQUMsQ0FDckYsRUFBQTs7d0JBRkQsU0FFQyxDQUFDOzs7Ozs2QkFHTixXQUFPLEdBQUcsQ0FBQyxJQUFJLEdBQUc7NEJBQ2QsTUFBTSxFQUFFLEdBQUc7eUJBQ2QsRUFBQTs7O3dCQUdELFdBQU8sR0FBRyxDQUFDLElBQUksR0FBRztnQ0FDZCxNQUFNLEVBQUUsR0FBRztnQ0FDWCxPQUFPLEVBQUUsVUFBVTs2QkFDdEIsRUFBQTs7OzthQUVSLENBQUMsQ0FBQztRQUVILFdBQU8sR0FBRyxDQUFDLEtBQUssRUFBRyxFQUFDOztLQUV2QixDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgY2xvdWQgZnJvbSAnd3gtc2VydmVyLXNkayc7XG5pbXBvcnQgKiBhcyBUY2JSb3V0ZXIgZnJvbSAndGNiLXJvdXRlcic7XG5pbXBvcnQgKiBhcyBheGlvcyBmcm9tICdheGlvcyc7XG5pbXBvcnQgKiBhcyBjcnlwdG8gZnJvbSAnY3J5cHRvJztcbmltcG9ydCAqIGFzIHJwIGZyb20gJ3JlcXVlc3QtcHJvbWlzZSc7XG5pbXBvcnQgKiBhcyBDT05GSUcgZnJvbSAnLi9jb25maWcnO1xuXG5jbG91ZC5pbml0KHtcbiAgICBlbnY6IHByb2Nlc3MuZW52LmNsb3VkXG59KTtcblxuY29uc3QgZGI6IERCLkRhdGFiYXNlID0gY2xvdWQuZGF0YWJhc2UoICk7XG5jb25zdCBfID0gZGIuY29tbWFuZDtcblxuLyoqXG4gKiBAZGVzY3JpcHRpb24gXG4gKiDlhazlhbHmqKHlnZdcbiAqL1xuZXhwb3J0IGNvbnN0IG1haW4gPSBhc3luYyAoIGV2ZW50LCBjb250ZXh0ICkgPT4ge1xuXG4gICAgY29uc3QgYXBwID0gbmV3IFRjYlJvdXRlcih7IGV2ZW50IH0pO1xuXG4gICAgLyoqXG4gICAgICogQGRlc2NyaXB0aW9uXG4gICAgICog5Yid5aeL5YyW5ZCE5Liq5pWw5o2u5bqTXG4gICAgICovXG4gICAgYXBwLnJvdXRlcignaW5pdCcsIGFzeW5jKCBjdHgsIG5leHQgKSA9PiB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBjb25zdCBjb2xsZWN0aW9ucyA9IENPTkZJRy5jb2xsZWN0aW9ucztcbiAgICAgICAgICAgIGF3YWl0IFByb21pc2UuYWxsKFtcbiAgICAgICAgICAgICAgICBjb2xsZWN0aW9ucy5tYXAoIGNvbGxlY3Rpb25OYW1lID0+IChkYiBhcyBhbnkpLmNyZWF0ZUNvbGxlY3Rpb24oIGNvbGxlY3Rpb25OYW1lICkpXG4gICAgICAgICAgICBdKVxuXG4gICAgICAgICAgICByZXR1cm4gY3R4LmJvZHkgPSB7IHN0YXR1czogMjAwIH1cbiAgICAgICAgfSBjYXRjaCAoIGUgKSB7XG4gICAgICAgICAgICByZXR1cm4gY3R4LmJvZHkgPSB7IHN0YXR1czogNTAwLCBtZXNzYWdlOiBlIH1cbiAgICAgICAgfVxuICAgIH0pXG5cbiAgICAvKipcbiAgICAgKiBAZGVzY3JpcHRpb24gXG4gICAgICog5pWw5o2u5a2X5YW4XG4gICAgICovXG4gICAgYXBwLnJvdXRlcignZGljJywgYXN5bmMoIGN0eCwgbmV4dCApID0+IHtcbiAgICAgICAgdHJ5IHtcblxuICAgICAgICAgICAgY29uc3QgZGJSZXMgPSBhd2FpdCBkYi5jb2xsZWN0aW9uKCdkaWMnKVxuICAgICAgICAgICAgICAgIC53aGVyZSh7XG4gICAgICAgICAgICAgICAgICAgIGJlbG9uZzogZGIuUmVnRXhwKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlZ2V4cDogZXZlbnQuZGF0YS5kaWNOYW1lLnJlcGxhY2UoL1xcLC9nLCAnfCcpLFxuICAgICAgICAgICAgICAgICAgICAgICAgb3B0aW9uZDogJ2knXG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAuZ2V0KCApO1xuICAgICAgICBcbiAgICAgICAgICAgIGxldCByZXN1bHQgPSB7IH07XG4gICAgICAgICAgICBkYlJlcy5kYXRhLm1hcCggZGljID0+IHtcbiAgICAgICAgICAgICAgICByZXN1bHQgPSBPYmplY3QuYXNzaWduKHsgfSwgcmVzdWx0LCB7XG4gICAgICAgICAgICAgICAgICAgIFsgZGljLmJlbG9uZyBdOiBkaWNbIGRpYy5iZWxvbmcgXS5maWx0ZXIoIHggPT4gISF4IClcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICByZXR1cm4gY3R4LmJvZHkgPSB7XG4gICAgICAgICAgICAgICAgc3RhdHVzOiAyMDAsXG4gICAgICAgICAgICAgICAgZGF0YTogcmVzdWx0XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgIH0gY2F0Y2ggKCBlICkge1xuICAgICAgICAgICAgcmV0dXJuIGN0eC5ib2R5ID0ge1xuICAgICAgICAgICAgICAgIHN0YXR1czogNTAwLFxuICAgICAgICAgICAgICAgIG1lc3NhZ2U6IGVcbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgIC8qKlxuICAgICAqIEBkZXNjcmlwdGlvblxuICAgICAqIOW+ruS/oeeUqOaIt+S/oeaBr+WtmOWCqFxuICAgICAqL1xuICAgIGFwcC5yb3V0ZXIoJ3VzZXJFZGl0JywgYXN5bmMoIGN0eCwgbmV4dCApID0+IHtcbiAgICAgICAgdHJ5IHtcblxuICAgICAgICAgICAgY29uc3Qgb3BlbmlkID0gZXZlbnQudXNlckluZm8ub3BlbklkO1xuICAgICAgICAgICAgY29uc3QgZGF0YSQgPSBhd2FpdCBkYi5jb2xsZWN0aW9uKCd1c2VyJylcbiAgICAgICAgICAgICAgICAud2hlcmUoe1xuICAgICAgICAgICAgICAgICAgICBvcGVuaWRcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIC5nZXQoIClcbiAgICAgICAgICAgICAgICAuY2F0Y2goIGVyciA9PiB7IHRocm93IGAke2Vycn1gfSk7XG4gICAgICAgIFxuICAgICAgICAgICAgLy8g5aaC5p6c5LiN5a2Y5Zyo77yM5YiZ5Yib5bu6XG4gICAgICAgICAgICBpZiAoIGRhdGEkLmRhdGEubGVuZ3RoID09PSAwICkge1xuICAgICAgICBcbiAgICAgICAgICAgICAgICBhd2FpdCBkYi5jb2xsZWN0aW9uKCd1c2VyJylcbiAgICAgICAgICAgICAgICAgICAgLmFkZCh7XG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRhOiBPYmplY3QuYXNzaWduKHsgfSwgZXZlbnQuZGF0YSwgeyBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvcGVuaWQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaW50ZWdyYWw6IDBcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgIH0pLmNhdGNoKCBlcnIgPT4geyB0aHJvdyBgJHtlcnJ9YH0pO1xuICAgICAgICBcbiAgICAgICAgICAgIC8vIOWmguaenOWtmOWcqO+8jOWImeabtOaWsFxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBjb25zdCBtZXRhID0gT2JqZWN0LmFzc2lnbih7IH0sIGRhdGEkLmRhdGFbIDAgXSwgZXZlbnQuZGF0YSApO1xuICAgICAgICAgICAgICAgIGRlbGV0ZSBtZXRhLl9pZDtcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICBhd2FpdCBkYi5jb2xsZWN0aW9uKCd1c2VyJykuZG9jKCggZGF0YSQuZGF0YVsgMCBdIGFzIGFueSkuX2lkIClcbiAgICAgICAgICAgICAgICAgICAgLnNldCh7XG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRhOiBPYmplY3QuYXNzaWduKHsgfSwgbWV0YSwge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGludGVncmFsOiBkYXRhJC5kYXRhWyAwIF0uaW50ZWdyYWxcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgIH0pLmNhdGNoKCBlcnIgPT4geyB0aHJvdyBgJHtlcnJ9YH0pO1xuICAgICAgICAgICAgfSAgICBcblxuICAgICAgICAgICAgcmV0dXJuIGN0eC5ib2R5ID0ge1xuICAgICAgICAgICAgICAgIHN0YXR1czogMjAwXG4gICAgICAgICAgICB9O1xuXG4gICAgICAgIH0gY2F0Y2ggKCBlICkge1xuICAgICAgICAgICAgcmV0dXJuIGN0eC5ib2R5ID0ge1xuICAgICAgICAgICAgICAgIHN0YXR1czogNTAwLFxuICAgICAgICAgICAgICAgIG1lc3NhZ2U6IGVcbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgIC8qKlxuICAgICAqIOaYr+aWsOWuoui/mOaYr+aXp+WuolxuICAgICAqIOaWsOWuou+8jOaIkOWKn+aUr+S7mOiuouWNlSA8PSAzXG4gICAgKi9cbiAgICBhcHAucm91dGVyKCdpcy1uZXctY3VzdG9tZXInLCBhc3luYyggY3R4LCBuZXh0ICkgPT4ge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgXG4gICAgICAgICAgICBjb25zdCBvcGVuaWQgPSBldmVudC5kYXRhLm9wZW5JZCB8fCBldmVudC51c2VySW5mby5vcGVuSWQ7XG4gICAgICAgICAgICBjb25zdCBmaW5kJCA9IGF3YWl0IGRiLmNvbGxlY3Rpb24oJ29yZGVyJylcbiAgICAgICAgICAgICAgICAud2hlcmUoe1xuICAgICAgICAgICAgICAgICAgICBvcGVuaWQsXG4gICAgICAgICAgICAgICAgICAgIGJhc2Vfc3RhdHVzOiAnMydcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIC5jb3VudCggKTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgcmV0dXJuIGN0eC5ib2R5ID0ge1xuICAgICAgICAgICAgICAgIHN0YXR1czogMjAwLFxuICAgICAgICAgICAgICAgIGRhdGE6IGZpbmQkLnRvdGFsIDwgM1xuICAgICAgICAgICAgfVxuXG4gICAgICAgIH0gY2F0Y2ggKCBlICkge1xuICAgICAgICAgICAgcmV0dXJuIGN0eC5ib2R5ID0ge1xuICAgICAgICAgICAgICAgIHN0YXR1czogMjAwLFxuICAgICAgICAgICAgICAgIGRhdGE6IHRydWVcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgLyoqXG4gICAgICog5b6u5L+h5pSv5LuY77yM6L+U5Zue5pSv5LuYYXBp5b+F6KaB5Y+C5pWwXG4gICAgICogLS0tLS0tLS0tLS0g6K+35rGCIC0tLS0tLS0tLS1cbiAgICAgKiB7XG4gICAgICogICAgICB0b3RhbF9mZWVcbiAgICAgKiB9XG4gICAgICovXG4gICAgYXBwLnJvdXRlcignd3hwYXknLCBhc3luYyggY3R4LCBuZXh0ICkgPT4ge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgY29uc3QgeyBrZXksIGJvZHksIG1jaF9pZCwgYXR0YWNoLCBub3RpZnlfdXJsLCBzcGJpbGxfY3JlYXRlX2lwIH0gPSBDT05GSUcud3hQYXk7XG4gICAgICAgICAgICBjb25zdCBhcHBpZCA9IENPTkZJRy5hcHAuaWQ7XG4gICAgICAgICAgICBjb25zdCB0b3RhbF9mZWUgPSBldmVudC5kYXRhLnRvdGFsX2ZlZTtcbiAgICAgICAgICAgIGNvbnN0IG9wZW5pZCA9IGV2ZW50LnVzZXJJbmZvLm9wZW5JZDtcbiAgICAgICAgICAgIGNvbnN0IG5vbmNlX3N0ciA9IE1hdGgucmFuZG9tKCApLnRvU3RyaW5nKCAzNiApLnN1YnN0ciggMiwgMTUgKTtcbiAgICAgICAgICAgIGNvbnN0IHRpbWVTdGFtcCA9IHBhcnNlSW50KFN0cmluZyggRGF0ZS5ub3coKSAvIDEwMDAgKSkgKyAnJztcbiAgICAgICAgICAgIGNvbnN0IG91dF90cmFkZV9ubyA9IFwib3RuXCIgKyBub25jZV9zdHIgKyB0aW1lU3RhbXA7XG5cbiAgICAgICAgICAgIC8vIGNvbnN0IGJvZHkgPSAn6aaZ54yq5rWL6K+VJztcbiAgICAgICAgICAgIC8vIGNvbnN0IG1jaF9pZCA9ICcxNTIxNTIyNzgxJztcbiAgICAgICAgICAgIC8vIGNvbnN0IGF0dGFjaCA9ICdhbnl0aGluZyc7XG4gICAgICAgICAgICAvLyBjb25zdCBhcHBpZCA9IGV2ZW50LnVzZXJJbmZvLmFwcElkO1xuICAgICAgICAgICAgLy8gY29uc3Qgbm90aWZ5X3VybCA9ICdodHRwczovL3doYXRldmVyLmNvbS9ub3RpZnknO1xuICAgICAgICAgICAgLy8gY29uc3Qga2V5ID0gJ2E5MjAwNjI1MGI0Y2E5MjQ3YzAyZWRjZTY5ZjZhMjFhJztcbiAgICAgICAgICAgIC8vIGNvbnN0IHRvdGFsX2ZlZSA9IGV2ZW50LmRhdGEudG90YWxfZmVlO1xuICAgICAgICAgICAgLy8gY29uc3Qgc3BiaWxsX2NyZWF0ZV9pcCA9ICcxMTguODkuNDAuMjAwJztcbiAgICAgICAgICAgIC8vIGNvbnN0IG9wZW5pZCA9IGV2ZW50LnVzZXJJbmZvLm9wZW5JZDtcbiAgICAgICAgICAgIC8vIGNvbnN0IG5vbmNlX3N0ciA9IE1hdGgucmFuZG9tKCkudG9TdHJpbmcoMzYpLnN1YnN0cigyLCAxNSk7XG4gICAgICAgICAgICAvLyBjb25zdCB0aW1lU3RhbXAgPSBwYXJzZUludChTdHJpbmcoIERhdGUubm93KCkgLyAxMDAwICkpICsgJyc7XG4gICAgICAgICAgICAvLyBjb25zdCBvdXRfdHJhZGVfbm8gPSBcIm90blwiICsgbm9uY2Vfc3RyICsgdGltZVN0YW1wO1xuXG4gICAgICAgICAgICBjb25zdCBwYXlzaWduID0gKHsgLi4uYXJncyB9KSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3Qgc2E6IGFueSA9IFsgXVxuICAgICAgICAgICAgICAgIGZvciAoIGxldCBrIGluIGFyZ3MgKSB7XG4gICAgICAgICAgICAgICAgICAgIHNhLnB1c2goIGsgKyAnPScgKyBhcmdzWyBrIF0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBzYS5wdXNoKCdrZXk9JyArIGtleSApO1xuICAgICAgICAgICAgICAgIGNvbnN0IHMgPSAgY3J5cHRvLmNyZWF0ZUhhc2goJ21kNScpLnVwZGF0ZShzYS5qb2luKCcmJyksICd1dGY4JykuZGlnZXN0KCdoZXgnKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gcy50b1VwcGVyQ2FzZSggKTtcbiAgICAgICAgICAgIH1cbiAgICBcbiAgICAgICAgICAgIGxldCBmb3JtRGF0YSA9IFwiPHhtbD5cIjtcbiAgICBcbiAgICAgICAgICAgIGZvcm1EYXRhICs9IFwiPGFwcGlkPlwiICsgYXBwaWQgKyBcIjwvYXBwaWQ+XCJcbiAgICAgICAgXG4gICAgICAgICAgICBmb3JtRGF0YSArPSBcIjxhdHRhY2g+XCIgKyBhdHRhY2ggKyBcIjwvYXR0YWNoPlwiXG4gICAgICAgIFxuICAgICAgICAgICAgZm9ybURhdGEgKz0gXCI8Ym9keT5cIiArIGJvZHkgKyBcIjwvYm9keT5cIlxuICAgICAgICBcbiAgICAgICAgICAgIGZvcm1EYXRhICs9IFwiPG1jaF9pZD5cIiArIG1jaF9pZCArIFwiPC9tY2hfaWQ+XCJcbiAgICAgICAgXG4gICAgICAgICAgICBmb3JtRGF0YSArPSBcIjxub25jZV9zdHI+XCIgKyBub25jZV9zdHIgKyBcIjwvbm9uY2Vfc3RyPlwiXG4gICAgICAgIFxuICAgICAgICAgICAgZm9ybURhdGEgKz0gXCI8bm90aWZ5X3VybD5cIiArIG5vdGlmeV91cmwgKyBcIjwvbm90aWZ5X3VybD5cIlxuICAgICAgICBcbiAgICAgICAgICAgIGZvcm1EYXRhICs9IFwiPG9wZW5pZD5cIiArIG9wZW5pZCArIFwiPC9vcGVuaWQ+XCJcbiAgICAgICAgXG4gICAgICAgICAgICBmb3JtRGF0YSArPSBcIjxvdXRfdHJhZGVfbm8+XCIgKyBvdXRfdHJhZGVfbm8gKyBcIjwvb3V0X3RyYWRlX25vPlwiXG4gICAgICAgIFxuICAgICAgICAgICAgZm9ybURhdGEgKz0gXCI8c3BiaWxsX2NyZWF0ZV9pcD5cIiArIHNwYmlsbF9jcmVhdGVfaXAgKyBcIjwvc3BiaWxsX2NyZWF0ZV9pcD5cIlxuICAgICAgICBcbiAgICAgICAgICAgIGZvcm1EYXRhICs9IFwiPHRvdGFsX2ZlZT5cIiArIHRvdGFsX2ZlZSArIFwiPC90b3RhbF9mZWU+XCJcbiAgICAgICAgXG4gICAgICAgICAgICBmb3JtRGF0YSArPSBcIjx0cmFkZV90eXBlPkpTQVBJPC90cmFkZV90eXBlPlwiXG4gICAgICAgIFxuICAgICAgICAgICAgZm9ybURhdGEgKz0gXCI8c2lnbj5cIiArIHBheXNpZ24oeyBhcHBpZCwgYXR0YWNoLCBib2R5LCBtY2hfaWQsIG5vbmNlX3N0ciwgbm90aWZ5X3VybCwgb3BlbmlkLCBvdXRfdHJhZGVfbm8sIHNwYmlsbF9jcmVhdGVfaXAsIHRvdGFsX2ZlZSwgdHJhZGVfdHlwZTogJ0pTQVBJJyB9KSArIFwiPC9zaWduPlwiXG4gICAgICAgIFxuICAgICAgICAgICAgZm9ybURhdGEgKz0gXCI8L3htbD5cIjtcbiAgICBcbiAgICAgICAgICAgIGxldCByZXMgPSBhd2FpdCBycCh7IHVybDogXCJodHRwczovL2FwaS5tY2gud2VpeGluLnFxLmNvbS9wYXkvdW5pZmllZG9yZGVyXCIsIG1ldGhvZDogJ1BPU1QnLGJvZHk6IGZvcm1EYXRhIH0pO1xuICAgIFxuICAgICAgICAgICAgbGV0IHhtbCA9IHJlcy50b1N0cmluZyhcInV0Zi04XCIpO1xuICAgICAgICAgIFxuICAgICAgICAgICAgaWYgKCB4bWwuaW5kZXhPZigncHJlcGF5X2lkJykgPCAwICkge1xuICAgICAgICAgICAgICAgIHJldHVybiBjdHguYm9keSA9IHtcbiAgICAgICAgICAgICAgICAgICAgc3RhdHVzOiA1MDBcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb25zb2xlLmxvZygnZWVlZWUnLCBmb3JtRGF0YSwgeG1sICk7XG4gICAgICAgICAgICBsZXQgcHJlcGF5X2lkID0geG1sLnNwbGl0KFwiPHByZXBheV9pZD5cIilbMV0uc3BsaXQoXCI8L3ByZXBheV9pZD5cIilbMF0uc3BsaXQoJ1snKVsyXS5zcGxpdCgnXScpWzBdXG4gICAgXG4gICAgICAgICAgICBsZXQgcGF5U2lnbiA9IHBheXNpZ24oeyBhcHBJZDogYXBwaWQsIG5vbmNlU3RyOiBub25jZV9zdHIsIHBhY2thZ2U6ICgncHJlcGF5X2lkPScgKyBwcmVwYXlfaWQpLCBzaWduVHlwZTogJ01ENScsIHRpbWVTdGFtcDogdGltZVN0YW1wIH0pXG4gICAgICAgICAgICBcbiAgICAgICAgICAgIHJldHVybiBjdHguYm9keSA9IHtcbiAgICAgICAgICAgICAgICBzdGF0dXM6IDIwMCxcbiAgICAgICAgICAgICAgICBkYXRhOiB7IGFwcGlkLCBub25jZV9zdHIsIHRpbWVTdGFtcCwgcHJlcGF5X2lkLCBwYXlTaWduIH0gXG4gICAgICAgICAgICB9O1xuXG4gICAgICAgIH0gY2F0Y2ggKCBlICkge1xuICAgICAgICAgICAgcmV0dXJuIGN0eC5ib2R5ID0ge1xuICAgICAgICAgICAgICAgIHN0YXR1czogNTAwXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgIC8qKlxuICAgICAqIOS7o+i0reS4quS6uuW+ruS/oeS6jOe7tOeggeOAgee+pOS6jOe7tOeggVxuICAgICAqIC0tLS0tLSDor7fmsYIgLS0tLS0tXG4gICAgICoge1xuICAgICAqICAgICAgd3hfcXJjb2RlOiBzdHJpbmdbXVxuICAgICAqICAgICAgZ3JvdXBfcXJjb2RlOiBzdHJpbmdbXVxuICAgICAqIH1cbiAgICAgKi9cbiAgICBhcHAucm91dGVyKCd3eGluZm8tZWRpdCcsIGFzeW5jKCBjdHgsIG5leHQgKSA9PiB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGNvbnN0IHRlbXA6IGFueSA9IFsgXTtcbiAgICAgICAgICAgIE9iamVjdC5rZXlzKCBldmVudC5kYXRhICkubWFwKCBrZXkgPT4ge1xuICAgICAgICAgICAgICAgIGlmICggISFldmVudC5kYXRhWyBrZXkgXSkge1xuICAgICAgICAgICAgICAgICAgICB0ZW1wLnB1c2goe1xuICAgICAgICAgICAgICAgICAgICAgICAgdHlwZToga2V5LFxuICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU6IGV2ZW50LmRhdGFbIGtleSBdXG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIGF3YWl0IFByb21pc2UuYWxsKCB0ZW1wLm1hcCggYXN5bmMgeCA9PiB7XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgY29uc3QgZmluZCQgPSBhd2FpdCBkYi5jb2xsZWN0aW9uKCdtYW5hZ2VyLXd4LWluZm8nKVxuICAgICAgICAgICAgICAgICAgICAud2hlcmUoe1xuICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogeC50eXBlXG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgIC5nZXQoICk7XG5cbiAgICAgICAgICAgICAgICBpZiAoIGZpbmQkLmRhdGEubGVuZ3RoID4gMCApIHtcbiAgICAgICAgICAgICAgICAgICAgYXdhaXQgZGIuY29sbGVjdGlvbignbWFuYWdlci13eC1pbmZvJykuZG9jKCAoZmluZCQuZGF0YVsgMCBdIGFzIGFueSkuX2lkIClcbiAgICAgICAgICAgICAgICAgICAgICAgIC5zZXQoe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGE6IHhcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBhd2FpdCBkYi5jb2xsZWN0aW9uKCdtYW5hZ2VyLXd4LWluZm8nKVxuICAgICAgICAgICAgICAgICAgICAgICAgLmFkZCh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YTogeFxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB9KSk7XG5cbiAgICAgICAgICAgIHJldHVybiBjdHguYm9keSA9IHtcbiAgICAgICAgICAgICAgICBzdGF0dXM6IDIwMFxuICAgICAgICAgICAgfVxuXG4gICAgICAgIH0gY2F0Y2ggKCBlICkge1xuICAgICAgICAgICAgcmV0dXJuIGN0eC5ib2R5ID0geyBzdGF0dXM6IDUwMCB9O1xuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICAvKipcbiAgICAgKiBAZGVzY3JpcHRpb25cbiAgICAgKiDmn6Xor6Lku6PotK3kuKrkurrkuoznu7TnoIHkv6Hmga9cbiAgICAgKi9cbiAgICBhcHAucm91dGVyKCd3eGluZm8nLCBhc3luYyggY3R4LCBuZXh0ICkgPT4ge1xuICAgICAgICB0cnkge1xuXG4gICAgICAgICAgICBjb25zdCB0YXJnZXQgPSBbJ3d4X3FyY29kZScsICdncm91cF9xcmNvZGUnXTtcbiAgICAgICAgICAgIGNvbnN0IGZpbmRzJCA9IGF3YWl0IFByb21pc2UuYWxsKCB0YXJnZXQubWFwKCB0eXBlID0+IHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZGIuY29sbGVjdGlvbignbWFuYWdlci13eC1pbmZvJylcbiAgICAgICAgICAgICAgICAgICAgLndoZXJlKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHR5cGVcbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgLmdldCggKTtcbiAgICAgICAgICAgIH0pKTtcblxuICAgICAgICAgICAgY29uc3QgdGVtcCA9IHsgfTtcbiAgICAgICAgICAgIGZpbmRzJC5tYXAoKCBmaW5kJCwgaW5kZXggKSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKCBmaW5kJC5kYXRhLmxlbmd0aCA+IDAgKSB7XG4gICAgICAgICAgICAgICAgICAgIHRlbXBbIHRhcmdldFsgaW5kZXggXV0gPSBmaW5kJC5kYXRhWyAwIF0udmFsdWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHJldHVybiBjdHguYm9keSA9IHtcbiAgICAgICAgICAgICAgICBzdGF0dXM6IDIwMCxcbiAgICAgICAgICAgICAgICBkYXRhOiB0ZW1wXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfSBjYXRjaCAoIGUgKSB7XG4gICAgICAgICAgICByZXR1cm4gY3R4LmJvZHkgPSB7IHN0YXR1czogNTAwIH07XG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgIC8qKiBcbiAgICAgKiBAZGVzY3JpcHRpb25cbiAgICAgKiDojrflj5bigJzmiJHnmoTpobXpnaLigJ3nmoTln7rmnKzkv6Hmga/vvIzor7jlpoLorqLljZXjgIHljaHliLjmlbDph49cbiAgICAgKi9cbiAgICBhcHAucm91dGVyKCdteXBhZ2UtaW5mbycsIGFzeW5jKCBjdHgsIG5leHQgKSA9PiB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIC8vIOiuouWNleaVsFxuICAgICAgICAgICAgY29uc3Qgb3JkZXJzJCA9IGF3YWl0IGRiLmNvbGxlY3Rpb24oJ29yZGVyJylcbiAgICAgICAgICAgICAgICAud2hlcmUoe1xuICAgICAgICAgICAgICAgICAgICBvcGVuaWQ6IGV2ZW50LnVzZXJJbmZvLm9wZW5JZFxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLmNvdW50KCApO1xuXG4gICAgICAgICAgICAvLyDljaHliLjmlbBcbiAgICAgICAgICAgIGNvbnN0IGNvdXBvbnMkID0gYXdhaXQgZGIuY29sbGVjdGlvbignY291cG9uJylcbiAgICAgICAgICAgICAgICAud2hlcmUoe1xuICAgICAgICAgICAgICAgICAgICBvcGVuaWQ6IGV2ZW50LnVzZXJJbmZvLm9wZW5JZFxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLmNvdW50KCApO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICByZXR1cm4gY3R4LmJvZHkgPSB7XG4gICAgICAgICAgICAgICAgc3RhdHVzOiAyMDAsXG4gICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgICBjb3Vwb25zOiBjb3Vwb25zJC50b3RhbCxcbiAgICAgICAgICAgICAgICAgICAgb3JkZXJzOiBvcmRlcnMkLnRvdGFsXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgIH0gY2F0Y2ggKCBlICkgeyByZXR1cm4gY3R4LmJvZHkgPSB7IHN0YXR1czogNTAwIH07fVxuICAgIH0pO1xuXG4gICAgLyoqIFxuICAgICAqIEBkZXNjcmlwdGlvblxuICAgICAqIOihjOeoi+S4i++8jOWPguWKoOS6hui0reS5sOeahOWuouaIt++8iOiuouWNle+8iVxuICAgICAqIHsgXG4gICAgICogICAgdGlkXG4gICAgICogfVxuICAgICAqL1xuICAgIGFwcC5yb3V0ZXIoJ2N1c3RvbWVyLWluLXRyaXAnLCBhc3luYyggY3R4LCBuZXh0ICkgPT4ge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgY29uc3QgbGltaXQgPSAxMDA7XG4gICAgICAgICAgICBjb25zdCBhbGxPcmRlclVzZXJzJCA9IGF3YWl0IGRiLmNvbGxlY3Rpb24oJ29yZGVyJylcbiAgICAgICAgICAgICAgICAud2hlcmUoe1xuICAgICAgICAgICAgICAgICAgICB0aWQ6IGV2ZW50LmRhdGEudGlkXG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAub3JkZXJCeSgnY3JlYXRlVGltZScsICdkZXNjJylcbiAgICAgICAgICAgICAgICAubGltaXQoIGxpbWl0IClcbiAgICAgICAgICAgICAgICAuZmllbGQoe1xuICAgICAgICAgICAgICAgICAgICBvcGVuaWQ6IHRydWVcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIC5nZXQoICk7XG5cbiAgICAgICAgICAgIGNvbnN0IG9wZW5pZHMgPSBBcnJheS5mcm9tKCBuZXcgU2V0KCBhbGxPcmRlclVzZXJzJC5kYXRhLm1hcCggeCA9PiB4Lm9wZW5pZCApKSk7XG5cbiAgICAgICAgICAgIGNvbnN0IGF2YXRhdHMkID0gYXdhaXQgUHJvbWlzZS5hbGwoIG9wZW5pZHMubWFwKCBvaWQgPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiBkYi5jb2xsZWN0aW9uKCd1c2VyJylcbiAgICAgICAgICAgICAgICAgICAgLndoZXJlKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG9wZW5pZDogb2lkXG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgIC5maWVsZCh7XG4gICAgICAgICAgICAgICAgICAgICAgICBhdmF0YXJVcmw6IHRydWVcbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgLmdldCggKTtcbiAgICAgICAgICAgIH0pKVxuICAgICAgICAgICAgXG4gICAgICAgICAgICByZXR1cm4gY3R4LmJvZHkgPSB7XG4gICAgICAgICAgICAgICAgc3RhdHVzOiAyMDAsXG4gICAgICAgICAgICAgICAgZGF0YTogYXZhdGF0cyQubWFwKCB4ID0+IHguZGF0YVsgMCBdLmF2YXRhclVybCApXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfSBjYXRjaCAoIGUgKSB7XG4gICAgICAgICAgICByZXR1cm4gY3R4LmJvZHkgPSB7IHN0YXR1czogNTAwIH07XG4gICAgICAgIH1cbiAgICB9KVxuXG4gICAgLyoqXG4gICAgICog5raI5oGv5o6o6YCBIC0g5YKs5qy+XG4gICAgICoge1xuICAgICAqICAgICB0b3VzZXIgKCBvcGVuaWQgKVxuICAgICAqICAgICBmb3JtX2lkXG4gICAgICogICAgIHBhZ2U/OiBzdHJpbmdcbiAgICAgKiAgICAgZGF0YTogeyBcbiAgICAgKiAgICAgICAgIFxuICAgICAqICAgICB9XG4gICAgICogfVxuICAgICAqL1xuICAgIGFwcC5yb3V0ZXIoJ25vdGlmaWNhdGlvbi1nZXRtb25leScsIGFzeW5jKCBjdHgsIG5leHQgKSA9PiB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGNvbnN0IHBhZ2UgPSBldmVudC5kYXRhLnBhZ2UgfHwgJ3BhZ2VzL29yZGVyLWxpc3QvaW5kZXgnO1xuICAgICAgICAgICAgY29uc3QgeyB0b3VzZXIsIGZvcm1faWQsIGRhdGEsIHByZXBheV9pZCB9ID0gZXZlbnQuZGF0YTtcblxuICAgICAgICAgICAgLy8g6I635Y+WdG9rZW5cbiAgICAgICAgICAgIGNvbnN0IHJlc3VsdCA9IGF3YWl0IChheGlvcyBhcyBhbnkpKHtcbiAgICAgICAgICAgICAgICBtZXRob2Q6ICdnZXQnLFxuICAgICAgICAgICAgICAgIHVybDogYGh0dHBzOi8vYXBpLndlaXhpbi5xcS5jb20vY2dpLWJpbi90b2tlbj9ncmFudF90eXBlPWNsaWVudF9jcmVkZW50aWFsJmFwcGlkPSR7Q09ORklHLmFwcC5pZH0mc2VjcmV0PSR7Q09ORklHLmFwcC5zZWNyZWN0fWBcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICBjb25zdCB7IGFjY2Vzc190b2tlbiwgZXJyY29kZSB9ID0gcmVzdWx0LmRhdGE7XG5cbiAgICAgICAgICAgIGlmICggZXJyY29kZSApIHtcbiAgICAgICAgICAgICAgICB0aHJvdyAn55Sf5oiQYWNjZXNzX3Rva2Vu6ZSZ6K+vJ1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBjb25zdCByZXFEYXRhID0geyB9O1xuICAgICAgICAgICAgY29uc3QgcmVxRGF0YSQgPSB7XG4gICAgICAgICAgICAgICAgcGFnZSxcbiAgICAgICAgICAgICAgICB0b3VzZXIsXG4gICAgICAgICAgICAgICAgcHJlcGF5X2lkLFxuICAgICAgICAgICAgICAgIGZvcm1faWQsXG4gICAgICAgICAgICAgICAgdGVtcGxhdGVfaWQ6IENPTkZJRy5ub3RpZmljYXRpb25fdGVtcGxhdGUuZ2V0TW9uZXkzLFxuICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgLy8g6LSt5Lmw5pe26Ze0XG4gICAgICAgICAgICAgICAgICAgIFwia2V5d29yZDFcIjoge1xuICAgICAgICAgICAgICAgICAgICAgICAgXCJ2YWx1ZVwiOiBkYXRhLnRpdGxlXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIC8vIOiuouWNleaAu+S7t1xuICAgICAgICAgICAgICAgICAgICBcImtleXdvcmQyXCI6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIFwidmFsdWVcIjogZGF0YS50aW1lXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICBPYmplY3Qua2V5cyggcmVxRGF0YSQgKS5tYXAoIGtleSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKCAhIXJlcURhdGEkWyBrZXkgXSkge1xuICAgICAgICAgICAgICAgICAgICByZXFEYXRhWyBrZXkgXSA9IHJlcURhdGEkWyBrZXkgXTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgLy8g5Y+R6YCB5o6o6YCBXG4gICAgICAgICAgICBjb25zdCBzZW5kID0gYXdhaXQgKGF4aW9zIGFzIGFueSkoe1xuICAgICAgICAgICAgICAgIGRhdGE6IHJlcURhdGEsXG4gICAgICAgICAgICAgICAgbWV0aG9kOiAncG9zdCcsXG4gICAgICAgICAgICAgICAgdXJsOiBgaHR0cHM6Ly9hcGkud2VpeGluLnFxLmNvbS9jZ2ktYmluL21lc3NhZ2Uvd3hvcGVuL3RlbXBsYXRlL3NlbmQ/YWNjZXNzX3Rva2VuPSR7YWNjZXNzX3Rva2VufWBcbiAgICAgICAgICAgIH0pO1xuICAgICAgICBcbiAgICAgICAgICAgIHJldHVybiBjdHguYm9keSA9IHtcbiAgICAgICAgICAgICAgICBkYXRhOiBzZW5kLmRhdGEsXG4gICAgICAgICAgICAgICAgc3RhdHVzOiAyMDBcbiAgICAgICAgICAgIH1cblxuICAgICAgICB9IGNhdGNoICggZSApIHtcbiAgICAgICAgICAgIHJldHVybiBjdHguYm9keSA9IHsgbWVzc2FnZTogZSwgc3RhdHVzOiA1MDAgfVxuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICAvKipcbiAgICAgKiBAZGVzY3JpcHRpb25cbiAgICAgKiDpgJrov4fliqDop6Plr4blrqLmnI3nu5nnmoTlr4bnoIHvvIzmnaXlop7liqDmnYPpmZDjgIHliJ3lp4vljJbmlbDmja7lupNcbiAgICAgKi9cbiAgICBhcHAucm91dGVyKCdhZGQtYXV0aC1ieS1wc3cnLCBhc3luYyggY3R4LCBuZXh0ICkgPT4ge1xuICAgICAgICB0cnkge1xuXG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIGF3YWl0IChkYiBhcyBhbnkpLmNyZWF0ZUNvbGxlY3Rpb24oJ21hbmFnZXItbWVtYmVyJyk7XG4gICAgICAgICAgICAgICAgYXdhaXQgKGRiIGFzIGFueSkuY3JlYXRlQ29sbGVjdGlvbignYXV0aHBzdycpO1xuICAgICAgICAgICAgfSBjYXRjaCAoIGUgKSB7IH1cblxuICAgICAgICAgICAgbGV0IHJlc3VsdCA9ICcnO1xuICAgICAgICAgICAgY29uc3QgeyBzYWx0IH0gPSBDT05GSUcuYXV0aDtcbiAgICAgICAgICAgIGNvbnN0IG9wZW5pZCA9IGV2ZW50LnVzZXJJbmZvLm9wZW5JZDtcbiAgICAgICAgICAgIGNvbnN0IHsgcHN3LCBjb250ZW50IH0gPSBldmVudC5kYXRhO1xuXG4gICAgICAgICAgICBjb25zdCBnZXRFcnIgPSBtZXNzYWdlID0+ICh7XG4gICAgICAgICAgICAgICAgbWVzc2FnZSxcbiAgICAgICAgICAgICAgICBzdGF0dXM6IDUwMCxcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIGNvbnN0IGRlY2lwaGVyID0gY3J5cHRvLmNyZWF0ZURlY2lwaGVyKCdhZXMxOTInLCBzYWx0ICk7XG4gICAgICAgICAgICAgICAgY29uc3QgZGVjcnlwdGVkID0gZGVjaXBoZXIudXBkYXRlKCBwc3csICdoZXgnLCAndXRmOCcgKTtcbiAgICAgICAgICAgICAgICByZXN1bHQgPSBkZWNyeXB0ZWQgKyBkZWNpcGhlci5maW5hbCgndXRmOCcpO1xuICAgICAgICAgICAgfSBjYXRjaCAoIGUgKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGN0eC5ib2R5ID0gZ2V0RXJyKCflr4bpkqXplJnor6/vvIzor7fmoLjlr7knKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIFxuICAgICAgICAgICAgY29uc3QgWyBjX3RpbWVzdGFtcCwgY19hcHBpZCwgY19jb250ZW50LCBjX21heCBdID0gcmVzdWx0LnNwbGl0KCctJyk7XG5cbiAgICAgICAgICAgIGlmICggbmV3IERhdGUoICkuZ2V0VGltZSggKSAtIE51bWJlciggY190aW1lc3RhbXAgKSA+IDMwICogNjAgKiAxMDAwICkge1xuICAgICAgICAgICAgICAgIHJldHVybiBjdHguYm9keSA9IGdldEVycign5a+G6ZKl5bey6L+H5pyf77yM6K+36IGU57O75a6i5pyNJyk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICggY19hcHBpZCAhPT0gQ09ORklHLmFwcC5pZCApIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gY3R4LmJvZHkgPSBnZXRFcnIoJ+WvhumSpeS4juWwj+eoi+W6j+S4jeWFs+iBlCcpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoIGNfY29udGVudC5yZXBsYWNlKC9cXHMrL2csICcnKSAhPT0gY29udGVudC5yZXBsYWNlKC9cXHMrL2csICcnKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBjdHguYm9keSA9IGdldEVycign5o+Q56S66K+N6ZSZ6K+v77yM6K+36IGU57O75a6i5pyNJyk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogYXV0aHBzdyDooahcbiAgICAgICAgICAgICAqIFxuICAgICAgICAgICAgICoge1xuICAgICAgICAgICAgICogICAgYXBwSWQsXG4gICAgICAgICAgICAgKiAgICB0aW1lc3RhbXAsXG4gICAgICAgICAgICAgKiAgICBjb3VudFxuICAgICAgICAgICAgICogfVxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICBjb25zdCBjaGVjayQgPSBhd2FpdCBkYi5jb2xsZWN0aW9uKCdhdXRocHN3JykgXG4gICAgICAgICAgICAgICAgLndoZXJlKHtcbiAgICAgICAgICAgICAgICAgICAgYXBwSWQ6IGNfYXBwaWQsXG4gICAgICAgICAgICAgICAgICAgIHRpbWVzdGFtcDogY190aW1lc3RhbXBcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIC5nZXQoICk7XG4gICAgICAgICAgICBjb25zdCB0YXJnZXQgPSBjaGVjayQuZGF0YVsgMCBdO1xuXG4gICAgICAgICAgICAvLyDlr4bpkqXlt7Looqvkvb/nlKhcbiAgICAgICAgICAgIGlmICggISF0YXJnZXQgKSB7XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgLy8g5qyh5pWw5LiN6IO95aSa5LqOMlxuICAgICAgICAgICAgICAgIGlmICggdGFyZ2V0LmNvdW50ID49IDIgKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBjdHguYm9keSA9IGdldEVycign5a+G6ZKl5bey6KKr5L2/55So77yM6K+36IGU57O75a6i5pyNJyk7XG5cbiAgICAgICAgICAgICAgICAvLyDmm7TmlrDlr4bpkqXkv6Hmga9cbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBhd2FpdCBkYi5jb2xsZWN0aW9uKCdhdXRocHN3JylcbiAgICAgICAgICAgICAgICAgICAgICAgIC5kb2MoIFN0cmluZyggdGFyZ2V0Ll9pZCApKVxuICAgICAgICAgICAgICAgICAgICAgICAgLnVwZGF0ZSh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb3VudDogXy5pbmMoIDEgKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIOWIm+W7uuWvhumSpeS/oeaBr1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBhd2FpdCBkYi5jb2xsZWN0aW9uKCdhdXRocHN3JylcbiAgICAgICAgICAgICAgICAgICAgLmFkZCh7XG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY291bnQ6IDEsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYXBwSWQ6IGNfYXBwaWQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGltZXN0YW1wOiBjX3RpbWVzdGFtcFxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyDmiorlvZPliY3kurrvvIzliqDlhaXliLDnrqHnkIblkZhcbiAgICAgICAgICAgIGNvbnN0IGNoZWNrTWFuYWdlciQgPSBhd2FpdCBkYi5jb2xsZWN0aW9uKCdtYW5hZ2VyLW1lbWJlcicpXG4gICAgICAgICAgICAgICAgLndoZXJlKHtcbiAgICAgICAgICAgICAgICAgICAgb3BlbmlkXG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAuZ2V0KCApO1xuICAgICAgICAgICAgY29uc3QgdGFyZ2V0TWFuYWdlciA9IGNoZWNrTWFuYWdlciQuZGF0YVsgMCBdO1xuXG4gICAgICAgICAgICBpZiAoICF0YXJnZXRNYW5hZ2VyICkge1xuICAgICAgICAgICAgICAgIGF3YWl0IGRiLmNvbGxlY3Rpb24oJ21hbmFnZXItbWVtYmVyJylcbiAgICAgICAgICAgICAgICAgICAgLmFkZCh7XG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb3BlbmlkLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRlbnQ6IGNfY29udGVudCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjcmVhdGVUaW1lOiBuZXcgRGF0ZSggKS5nZXRUaW1lKCApXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIOWIneWni+WMluWQhOS4quihqFxuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICBjb25zdCBjb2xsZWN0aW9ucyA9IENPTkZJRy5jb2xsZWN0aW9ucztcbiAgICAgICAgICAgICAgICBhd2FpdCBQcm9taXNlLmFsbChcbiAgICAgICAgICAgICAgICAgICAgY29sbGVjdGlvbnMubWFwKCBjb2xsZWN0aW9uTmFtZSA9PiAoZGIgYXMgYW55KS5jcmVhdGVDb2xsZWN0aW9uKCBjb2xsZWN0aW9uTmFtZSApKVxuICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICB9IGNhdGNoICggZSApIHsgfVxuXG4gICAgICAgICAgICByZXR1cm4gY3R4LmJvZHkgPSB7XG4gICAgICAgICAgICAgICAgc3RhdHVzOiAyMDBcbiAgICAgICAgICAgIH1cblxuICAgICAgICB9IGNhdGNoICggZSApIHtcbiAgICAgICAgICAgIHJldHVybiBjdHguYm9keSA9IHtcbiAgICAgICAgICAgICAgICBzdGF0dXM6IDUwMCxcbiAgICAgICAgICAgICAgICBtZXNzYWdlOiAn5a+G6ZKl5qOA5p+l5Y+R55Sf6ZSZ6K+vJ1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICByZXR1cm4gYXBwLnNlcnZlKCApO1xuXG59Il19