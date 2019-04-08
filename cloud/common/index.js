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
            var e_11, result, salt, openid, _a, psw, content, getErr, decipher, decrypted, _b, c_timestamp, c_appid, c_content, c_max, check$, target, checkManager$, targetManager, e_12;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _c.trys.push([0, 17, , 18]);
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
                    case 15: return [4, initDB()];
                    case 16:
                        _c.sent();
                        return [2, ctx.body = {
                                status: 200
                            }];
                    case 17:
                        e_12 = _c.sent();
                        return [2, ctx.body = {
                                status: 500,
                                message: '密钥检查发生错误'
                            }];
                    case 18: return [2];
                }
            });
        }); });
        return [2, app.serve()];
    });
}); };
var initDB = function () { return new Promise(function (resolve) { return __awaiter(_this, void 0, void 0, function () {
    var collections, e_13;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                collections = CONFIG.collections;
                return [4, Promise.all(collections.map(function (collectionName) { return db.createCollection(collectionName); }))];
            case 1:
                _a.sent();
                resolve();
                return [3, 3];
            case 2:
                e_13 = _a.sent();
                resolve();
                return [3, 3];
            case 3: return [2];
        }
    });
}); }); };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSxpQkFtbkJHOztBQW5uQkgscUNBQXVDO0FBQ3ZDLHNDQUF3QztBQUN4Qyw2QkFBK0I7QUFDL0IsK0JBQWlDO0FBQ2pDLG9DQUFzQztBQUN0QyxpQ0FBbUM7QUFFbkMsS0FBSyxDQUFDLElBQUksQ0FBQztJQUNQLEdBQUcsRUFBRSxPQUFPLENBQUMsR0FBRyxDQUFDLEtBQUs7Q0FDekIsQ0FBQyxDQUFDO0FBRUgsSUFBTSxFQUFFLEdBQWdCLEtBQUssQ0FBQyxRQUFRLEVBQUcsQ0FBQztBQUMxQyxJQUFNLENBQUMsR0FBRyxFQUFFLENBQUMsT0FBTyxDQUFDO0FBTVIsUUFBQSxJQUFJLEdBQUcsVUFBUSxLQUFLLEVBQUUsT0FBTzs7OztRQUVoQyxHQUFHLEdBQUcsSUFBSSxTQUFTLENBQUMsRUFBRSxLQUFLLE9BQUEsRUFBRSxDQUFDLENBQUM7UUFNckMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxNQUFNLEVBQUUsVUFBTyxHQUFHLEVBQUUsSUFBSTs7Ozs7O3dCQUVyQixXQUFXLEdBQUcsTUFBTSxDQUFDLFdBQVcsQ0FBQzt3QkFDdkMsV0FBTSxPQUFPLENBQUMsR0FBRyxDQUFDO2dDQUNkLFdBQVcsQ0FBQyxHQUFHLENBQUUsVUFBQSxjQUFjLElBQUksT0FBQyxFQUFVLENBQUMsZ0JBQWdCLENBQUUsY0FBYyxDQUFFLEVBQTlDLENBQThDLENBQUM7NkJBQ3JGLENBQUMsRUFBQTs7d0JBRkYsU0FFRSxDQUFBO3dCQUVGLFdBQU8sR0FBRyxDQUFDLElBQUksR0FBRyxFQUFFLE1BQU0sRUFBRSxHQUFHLEVBQUUsRUFBQTs7O3dCQUVqQyxXQUFPLEdBQUcsQ0FBQyxJQUFJLEdBQUcsRUFBRSxNQUFNLEVBQUUsR0FBRyxFQUFFLE9BQU8sRUFBRSxHQUFDLEVB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QUE7O3dCQVBOLFNBT00sQ0FBQTs7NkJBSVYsV0FBTSxNQUFNLEVBQUcsRUFBQTs7d0JBQWYsU0FBZSxDQUFDO3dCQUVoQixXQUFPLEdBQUcsQ0FBQyxJQUFJLEdBQUc7Z0NBQ2QsTUFBTSxFQUFFLEdBQUc7NkJBQ2QsRUFBQTs7O3dCQUdELFdBQU8sR0FBRyxDQUFDLElBQUksR0FBRztnQ0FDZCxNQUFNLEVBQUUsR0FBRztnQ0FDWCxPQUFPLEVBQUUsVUFBVTs2QkFDdEIsRUFBQTs7OzthQUVSLENBQUMsQ0FBQztRQUVILFdBQU8sR0FBRyxDQUFDLEtBQUssRUFBRyxFQUFDOztLQUV2QixDQUFBO0FBS0QsSUFBTSxNQUFNLEdBQUcsY0FBTyxPQUFBLElBQUksT0FBTyxDQUFFLFVBQU0sT0FBTzs7Ozs7O2dCQUlsQyxXQUFXLEdBQUcsTUFBTSxDQUFDLFdBQVcsQ0FBQztnQkFDdkMsV0FBTSxPQUFPLENBQUMsR0FBRyxDQUNiLFdBQVcsQ0FBQyxHQUFHLENBQUUsVUFBQSxjQUFjLElBQUksT0FBQyxFQUFVLENBQUMsZ0JBQWdCLENBQUUsY0FBYyxDQUFFLEVBQTlDLENBQThDLENBQUMsQ0FDckYsRUFBQTs7Z0JBRkQsU0FFQyxDQUFDO2dCQUtGLE9BQU8sRUFBRyxDQUFDOzs7O2dCQUVDLE9BQU8sRUFBRyxDQUFDOzs7OztLQUM5QixDQUFDLEVBZm9CLENBZXBCLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBjbG91ZCBmcm9tICd3eC1zZXJ2ZXItc2RrJztcbmltcG9ydCAqIGFzIFRjYlJvdXRlciBmcm9tICd0Y2Itcm91dGVyJztcbmltcG9ydCAqIGFzIGF4aW9zIGZyb20gJ2F4aW9zJztcbmltcG9ydCAqIGFzIGNyeXB0byBmcm9tICdjcnlwdG8nO1xuaW1wb3J0ICogYXMgcnAgZnJvbSAncmVxdWVzdC1wcm9taXNlJztcbmltcG9ydCAqIGFzIENPTkZJRyBmcm9tICcuL2NvbmZpZyc7XG5cbmNsb3VkLmluaXQoe1xuICAgIGVudjogcHJvY2Vzcy5lbnYuY2xvdWRcbn0pO1xuXG5jb25zdCBkYjogREIuRGF0YWJhc2UgPSBjbG91ZC5kYXRhYmFzZSggKTtcbmNvbnN0IF8gPSBkYi5jb21tYW5kO1xuXG4vKipcbiAqIEBkZXNjcmlwdGlvbiBcbiAqIOWFrOWFseaooeWdl1xuICovXG5leHBvcnQgY29uc3QgbWFpbiA9IGFzeW5jICggZXZlbnQsIGNvbnRleHQgKSA9PiB7XG5cbiAgICBjb25zdCBhcHAgPSBuZXcgVGNiUm91dGVyKHsgZXZlbnQgfSk7XG5cbiAgICAvKipcbiAgICAgKiBAZGVzY3JpcHRpb25cbiAgICAgKiDliJ3lp4vljJblkITkuKrmlbDmja7lupNcbiAgICAgKi9cbiAgICBhcHAucm91dGVyKCdpbml0JywgYXN5bmMoIGN0eCwgbmV4dCApID0+IHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGNvbnN0IGNvbGxlY3Rpb25zID0gQ09ORklHLmNvbGxlY3Rpb25zO1xuICAgICAgICAgICAgYXdhaXQgUHJvbWlzZS5hbGwoW1xuICAgICAgICAgICAgICAgIGNvbGxlY3Rpb25zLm1hcCggY29sbGVjdGlvbk5hbWUgPT4gKGRiIGFzIGFueSkuY3JlYXRlQ29sbGVjdGlvbiggY29sbGVjdGlvbk5hbWUgKSlcbiAgICAgICAgICAgIF0pXG5cbiAgICAgICAgICAgIHJldHVybiBjdHguYm9keSA9IHsgc3RhdHVzOiAyMDAgfVxuICAgICAgICB9IGNhdGNoICggZSApIHtcbiAgICAgICAgICAgIHJldHVybiBjdHguYm9keSA9IHsgc3RhdHVzOiA1MDAsIG1lc3NhZ2U6IGUgfVxuICAgICAgICB9XG4gICAgfSlcblxuICAgIC8qKlxuICAgICAqIEBkZXNjcmlwdGlvbiBcbiAgICAgKiDmlbDmja7lrZflhbhcbiAgICAgKi9cbiAgICBhcHAucm91dGVyKCdkaWMnLCBhc3luYyggY3R4LCBuZXh0ICkgPT4ge1xuICAgICAgICB0cnkge1xuXG4gICAgICAgICAgICBjb25zdCBkYlJlcyA9IGF3YWl0IGRiLmNvbGxlY3Rpb24oJ2RpYycpXG4gICAgICAgICAgICAgICAgLndoZXJlKHtcbiAgICAgICAgICAgICAgICAgICAgYmVsb25nOiBkYi5SZWdFeHAoe1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVnZXhwOiBldmVudC5kYXRhLmRpY05hbWUucmVwbGFjZSgvXFwsL2csICd8JyksXG4gICAgICAgICAgICAgICAgICAgICAgICBvcHRpb25kOiAnaSdcbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIC5nZXQoICk7XG4gICAgICAgIFxuICAgICAgICAgICAgbGV0IHJlc3VsdCA9IHsgfTtcbiAgICAgICAgICAgIGRiUmVzLmRhdGEubWFwKCBkaWMgPT4ge1xuICAgICAgICAgICAgICAgIHJlc3VsdCA9IE9iamVjdC5hc3NpZ24oeyB9LCByZXN1bHQsIHtcbiAgICAgICAgICAgICAgICAgICAgWyBkaWMuYmVsb25nIF06IGRpY1sgZGljLmJlbG9uZyBdLmZpbHRlciggeCA9PiAhIXggKVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHJldHVybiBjdHguYm9keSA9IHtcbiAgICAgICAgICAgICAgICBzdGF0dXM6IDIwMCxcbiAgICAgICAgICAgICAgICBkYXRhOiByZXN1bHRcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgfSBjYXRjaCAoIGUgKSB7XG4gICAgICAgICAgICByZXR1cm4gY3R4LmJvZHkgPSB7XG4gICAgICAgICAgICAgICAgc3RhdHVzOiA1MDAsXG4gICAgICAgICAgICAgICAgbWVzc2FnZTogZVxuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgLyoqXG4gICAgICogQGRlc2NyaXB0aW9uXG4gICAgICog5b6u5L+h55So5oi35L+h5oGv5a2Y5YKoXG4gICAgICovXG4gICAgYXBwLnJvdXRlcigndXNlckVkaXQnLCBhc3luYyggY3R4LCBuZXh0ICkgPT4ge1xuICAgICAgICB0cnkge1xuXG4gICAgICAgICAgICBjb25zdCBvcGVuaWQgPSBldmVudC51c2VySW5mby5vcGVuSWQ7XG4gICAgICAgICAgICBjb25zdCBkYXRhJCA9IGF3YWl0IGRiLmNvbGxlY3Rpb24oJ3VzZXInKVxuICAgICAgICAgICAgICAgIC53aGVyZSh7XG4gICAgICAgICAgICAgICAgICAgIG9wZW5pZFxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLmdldCggKVxuICAgICAgICAgICAgICAgIC5jYXRjaCggZXJyID0+IHsgdGhyb3cgYCR7ZXJyfWB9KTtcbiAgICAgICAgXG4gICAgICAgICAgICAvLyDlpoLmnpzkuI3lrZjlnKjvvIzliJnliJvlu7pcbiAgICAgICAgICAgIGlmICggZGF0YSQuZGF0YS5sZW5ndGggPT09IDAgKSB7XG4gICAgICAgIFxuICAgICAgICAgICAgICAgIGF3YWl0IGRiLmNvbGxlY3Rpb24oJ3VzZXInKVxuICAgICAgICAgICAgICAgICAgICAuYWRkKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRhdGE6IE9iamVjdC5hc3NpZ24oeyB9LCBldmVudC5kYXRhLCB7IFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9wZW5pZCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbnRlZ3JhbDogMFxuICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgfSkuY2F0Y2goIGVyciA9PiB7IHRocm93IGAke2Vycn1gfSk7XG4gICAgICAgIFxuICAgICAgICAgICAgLy8g5aaC5p6c5a2Y5Zyo77yM5YiZ5pu05pawXG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGNvbnN0IG1ldGEgPSBPYmplY3QuYXNzaWduKHsgfSwgZGF0YSQuZGF0YVsgMCBdLCBldmVudC5kYXRhICk7XG4gICAgICAgICAgICAgICAgZGVsZXRlIG1ldGEuX2lkO1xuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIGF3YWl0IGRiLmNvbGxlY3Rpb24oJ3VzZXInKS5kb2MoKCBkYXRhJC5kYXRhWyAwIF0gYXMgYW55KS5faWQgKVxuICAgICAgICAgICAgICAgICAgICAuc2V0KHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRhdGE6IE9iamVjdC5hc3NpZ24oeyB9LCBtZXRhLCB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaW50ZWdyYWw6IGRhdGEkLmRhdGFbIDAgXS5pbnRlZ3JhbFxuICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgfSkuY2F0Y2goIGVyciA9PiB7IHRocm93IGAke2Vycn1gfSk7XG4gICAgICAgICAgICB9ICAgIFxuXG4gICAgICAgICAgICByZXR1cm4gY3R4LmJvZHkgPSB7XG4gICAgICAgICAgICAgICAgc3RhdHVzOiAyMDBcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgfSBjYXRjaCAoIGUgKSB7XG4gICAgICAgICAgICByZXR1cm4gY3R4LmJvZHkgPSB7XG4gICAgICAgICAgICAgICAgc3RhdHVzOiA1MDAsXG4gICAgICAgICAgICAgICAgbWVzc2FnZTogZVxuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgLyoqXG4gICAgICog5piv5paw5a6i6L+Y5piv5pen5a6iXG4gICAgICog5paw5a6i77yM5oiQ5Yqf5pSv5LuY6K6i5Y2VIDw9IDNcbiAgICAqL1xuICAgIGFwcC5yb3V0ZXIoJ2lzLW5ldy1jdXN0b21lcicsIGFzeW5jKCBjdHgsIG5leHQgKSA9PiB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGNvbnN0IG9wZW5pZCA9IGV2ZW50LmRhdGEub3BlbklkIHx8IGV2ZW50LnVzZXJJbmZvLm9wZW5JZDtcbiAgICAgICAgICAgIGNvbnN0IGZpbmQkID0gYXdhaXQgZGIuY29sbGVjdGlvbignb3JkZXInKVxuICAgICAgICAgICAgICAgIC53aGVyZSh7XG4gICAgICAgICAgICAgICAgICAgIG9wZW5pZCxcbiAgICAgICAgICAgICAgICAgICAgYmFzZV9zdGF0dXM6ICczJ1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLmNvdW50KCApO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICByZXR1cm4gY3R4LmJvZHkgPSB7XG4gICAgICAgICAgICAgICAgc3RhdHVzOiAyMDAsXG4gICAgICAgICAgICAgICAgZGF0YTogZmluZCQudG90YWwgPCAzXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfSBjYXRjaCAoIGUgKSB7XG4gICAgICAgICAgICByZXR1cm4gY3R4LmJvZHkgPSB7XG4gICAgICAgICAgICAgICAgc3RhdHVzOiAyMDAsXG4gICAgICAgICAgICAgICAgZGF0YTogdHJ1ZVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICAvKipcbiAgICAgKiDlvq7kv6HmlK/ku5jvvIzov5Tlm57mlK/ku5hhcGnlv4XopoHlj4LmlbBcbiAgICAgKiAtLS0tLS0tLS0tLSDor7fmsYIgLS0tLS0tLS0tLVxuICAgICAqIHtcbiAgICAgKiAgICAgIHRvdGFsX2ZlZVxuICAgICAqIH1cbiAgICAgKi9cbiAgICBhcHAucm91dGVyKCd3eHBheScsIGFzeW5jKCBjdHgsIG5leHQgKSA9PiB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBjb25zdCB7IGtleSwgYm9keSwgbWNoX2lkLCBhdHRhY2gsIG5vdGlmeV91cmwsIHNwYmlsbF9jcmVhdGVfaXAgfSA9IENPTkZJRy53eFBheTtcbiAgICAgICAgICAgIGNvbnN0IGFwcGlkID0gQ09ORklHLmFwcC5pZDtcbiAgICAgICAgICAgIGNvbnN0IHRvdGFsX2ZlZSA9IGV2ZW50LmRhdGEudG90YWxfZmVlO1xuICAgICAgICAgICAgY29uc3Qgb3BlbmlkID0gZXZlbnQudXNlckluZm8ub3BlbklkO1xuICAgICAgICAgICAgY29uc3Qgbm9uY2Vfc3RyID0gTWF0aC5yYW5kb20oICkudG9TdHJpbmcoIDM2ICkuc3Vic3RyKCAyLCAxNSApO1xuICAgICAgICAgICAgY29uc3QgdGltZVN0YW1wID0gcGFyc2VJbnQoU3RyaW5nKCBEYXRlLm5vdygpIC8gMTAwMCApKSArICcnO1xuICAgICAgICAgICAgY29uc3Qgb3V0X3RyYWRlX25vID0gXCJvdG5cIiArIG5vbmNlX3N0ciArIHRpbWVTdGFtcDtcblxuICAgICAgICAgICAgLy8gY29uc3QgYm9keSA9ICfpppnnjKrmtYvor5UnO1xuICAgICAgICAgICAgLy8gY29uc3QgbWNoX2lkID0gJzE1MjE1MjI3ODEnO1xuICAgICAgICAgICAgLy8gY29uc3QgYXR0YWNoID0gJ2FueXRoaW5nJztcbiAgICAgICAgICAgIC8vIGNvbnN0IGFwcGlkID0gZXZlbnQudXNlckluZm8uYXBwSWQ7XG4gICAgICAgICAgICAvLyBjb25zdCBub3RpZnlfdXJsID0gJ2h0dHBzOi8vd2hhdGV2ZXIuY29tL25vdGlmeSc7XG4gICAgICAgICAgICAvLyBjb25zdCBrZXkgPSAnYTkyMDA2MjUwYjRjYTkyNDdjMDJlZGNlNjlmNmEyMWEnO1xuICAgICAgICAgICAgLy8gY29uc3QgdG90YWxfZmVlID0gZXZlbnQuZGF0YS50b3RhbF9mZWU7XG4gICAgICAgICAgICAvLyBjb25zdCBzcGJpbGxfY3JlYXRlX2lwID0gJzExOC44OS40MC4yMDAnO1xuICAgICAgICAgICAgLy8gY29uc3Qgb3BlbmlkID0gZXZlbnQudXNlckluZm8ub3BlbklkO1xuICAgICAgICAgICAgLy8gY29uc3Qgbm9uY2Vfc3RyID0gTWF0aC5yYW5kb20oKS50b1N0cmluZygzNikuc3Vic3RyKDIsIDE1KTtcbiAgICAgICAgICAgIC8vIGNvbnN0IHRpbWVTdGFtcCA9IHBhcnNlSW50KFN0cmluZyggRGF0ZS5ub3coKSAvIDEwMDAgKSkgKyAnJztcbiAgICAgICAgICAgIC8vIGNvbnN0IG91dF90cmFkZV9ubyA9IFwib3RuXCIgKyBub25jZV9zdHIgKyB0aW1lU3RhbXA7XG5cbiAgICAgICAgICAgIGNvbnN0IHBheXNpZ24gPSAoeyAuLi5hcmdzIH0pID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCBzYTogYW55ID0gWyBdXG4gICAgICAgICAgICAgICAgZm9yICggbGV0IGsgaW4gYXJncyApIHtcbiAgICAgICAgICAgICAgICAgICAgc2EucHVzaCggayArICc9JyArIGFyZ3NbIGsgXSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHNhLnB1c2goJ2tleT0nICsga2V5ICk7XG4gICAgICAgICAgICAgICAgY29uc3QgcyA9ICBjcnlwdG8uY3JlYXRlSGFzaCgnbWQ1JykudXBkYXRlKHNhLmpvaW4oJyYnKSwgJ3V0ZjgnKS5kaWdlc3QoJ2hleCcpO1xuICAgICAgICAgICAgICAgIHJldHVybiBzLnRvVXBwZXJDYXNlKCApO1xuICAgICAgICAgICAgfVxuICAgIFxuICAgICAgICAgICAgbGV0IGZvcm1EYXRhID0gXCI8eG1sPlwiO1xuICAgIFxuICAgICAgICAgICAgZm9ybURhdGEgKz0gXCI8YXBwaWQ+XCIgKyBhcHBpZCArIFwiPC9hcHBpZD5cIlxuICAgICAgICBcbiAgICAgICAgICAgIGZvcm1EYXRhICs9IFwiPGF0dGFjaD5cIiArIGF0dGFjaCArIFwiPC9hdHRhY2g+XCJcbiAgICAgICAgXG4gICAgICAgICAgICBmb3JtRGF0YSArPSBcIjxib2R5PlwiICsgYm9keSArIFwiPC9ib2R5PlwiXG4gICAgICAgIFxuICAgICAgICAgICAgZm9ybURhdGEgKz0gXCI8bWNoX2lkPlwiICsgbWNoX2lkICsgXCI8L21jaF9pZD5cIlxuICAgICAgICBcbiAgICAgICAgICAgIGZvcm1EYXRhICs9IFwiPG5vbmNlX3N0cj5cIiArIG5vbmNlX3N0ciArIFwiPC9ub25jZV9zdHI+XCJcbiAgICAgICAgXG4gICAgICAgICAgICBmb3JtRGF0YSArPSBcIjxub3RpZnlfdXJsPlwiICsgbm90aWZ5X3VybCArIFwiPC9ub3RpZnlfdXJsPlwiXG4gICAgICAgIFxuICAgICAgICAgICAgZm9ybURhdGEgKz0gXCI8b3BlbmlkPlwiICsgb3BlbmlkICsgXCI8L29wZW5pZD5cIlxuICAgICAgICBcbiAgICAgICAgICAgIGZvcm1EYXRhICs9IFwiPG91dF90cmFkZV9ubz5cIiArIG91dF90cmFkZV9ubyArIFwiPC9vdXRfdHJhZGVfbm8+XCJcbiAgICAgICAgXG4gICAgICAgICAgICBmb3JtRGF0YSArPSBcIjxzcGJpbGxfY3JlYXRlX2lwPlwiICsgc3BiaWxsX2NyZWF0ZV9pcCArIFwiPC9zcGJpbGxfY3JlYXRlX2lwPlwiXG4gICAgICAgIFxuICAgICAgICAgICAgZm9ybURhdGEgKz0gXCI8dG90YWxfZmVlPlwiICsgdG90YWxfZmVlICsgXCI8L3RvdGFsX2ZlZT5cIlxuICAgICAgICBcbiAgICAgICAgICAgIGZvcm1EYXRhICs9IFwiPHRyYWRlX3R5cGU+SlNBUEk8L3RyYWRlX3R5cGU+XCJcbiAgICAgICAgXG4gICAgICAgICAgICBmb3JtRGF0YSArPSBcIjxzaWduPlwiICsgcGF5c2lnbih7IGFwcGlkLCBhdHRhY2gsIGJvZHksIG1jaF9pZCwgbm9uY2Vfc3RyLCBub3RpZnlfdXJsLCBvcGVuaWQsIG91dF90cmFkZV9ubywgc3BiaWxsX2NyZWF0ZV9pcCwgdG90YWxfZmVlLCB0cmFkZV90eXBlOiAnSlNBUEknIH0pICsgXCI8L3NpZ24+XCJcbiAgICAgICAgXG4gICAgICAgICAgICBmb3JtRGF0YSArPSBcIjwveG1sPlwiO1xuICAgIFxuICAgICAgICAgICAgbGV0IHJlcyA9IGF3YWl0IHJwKHsgdXJsOiBcImh0dHBzOi8vYXBpLm1jaC53ZWl4aW4ucXEuY29tL3BheS91bmlmaWVkb3JkZXJcIiwgbWV0aG9kOiAnUE9TVCcsYm9keTogZm9ybURhdGEgfSk7XG4gICAgXG4gICAgICAgICAgICBsZXQgeG1sID0gcmVzLnRvU3RyaW5nKFwidXRmLThcIik7XG4gICAgICAgICAgXG4gICAgICAgICAgICBpZiAoIHhtbC5pbmRleE9mKCdwcmVwYXlfaWQnKSA8IDAgKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGN0eC5ib2R5ID0ge1xuICAgICAgICAgICAgICAgICAgICBzdGF0dXM6IDUwMFxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdlZWVlZScsIGZvcm1EYXRhLCB4bWwgKTtcbiAgICAgICAgICAgIGxldCBwcmVwYXlfaWQgPSB4bWwuc3BsaXQoXCI8cHJlcGF5X2lkPlwiKVsxXS5zcGxpdChcIjwvcHJlcGF5X2lkPlwiKVswXS5zcGxpdCgnWycpWzJdLnNwbGl0KCddJylbMF1cbiAgICBcbiAgICAgICAgICAgIGxldCBwYXlTaWduID0gcGF5c2lnbih7IGFwcElkOiBhcHBpZCwgbm9uY2VTdHI6IG5vbmNlX3N0ciwgcGFja2FnZTogKCdwcmVwYXlfaWQ9JyArIHByZXBheV9pZCksIHNpZ25UeXBlOiAnTUQ1JywgdGltZVN0YW1wOiB0aW1lU3RhbXAgfSlcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgcmV0dXJuIGN0eC5ib2R5ID0ge1xuICAgICAgICAgICAgICAgIHN0YXR1czogMjAwLFxuICAgICAgICAgICAgICAgIGRhdGE6IHsgYXBwaWQsIG5vbmNlX3N0ciwgdGltZVN0YW1wLCBwcmVwYXlfaWQsIHBheVNpZ24gfSBcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgfSBjYXRjaCAoIGUgKSB7XG4gICAgICAgICAgICByZXR1cm4gY3R4LmJvZHkgPSB7XG4gICAgICAgICAgICAgICAgc3RhdHVzOiA1MDBcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgLyoqXG4gICAgICog5Luj6LSt5Liq5Lq65b6u5L+h5LqM57u056CB44CB576k5LqM57u056CBXG4gICAgICogLS0tLS0tIOivt+axgiAtLS0tLS1cbiAgICAgKiB7XG4gICAgICogICAgICB3eF9xcmNvZGU6IHN0cmluZ1tdXG4gICAgICogICAgICBncm91cF9xcmNvZGU6IHN0cmluZ1tdXG4gICAgICogfVxuICAgICAqL1xuICAgIGFwcC5yb3V0ZXIoJ3d4aW5mby1lZGl0JywgYXN5bmMoIGN0eCwgbmV4dCApID0+IHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgY29uc3QgdGVtcDogYW55ID0gWyBdO1xuICAgICAgICAgICAgT2JqZWN0LmtleXMoIGV2ZW50LmRhdGEgKS5tYXAoIGtleSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKCAhIWV2ZW50LmRhdGFbIGtleSBdKSB7XG4gICAgICAgICAgICAgICAgICAgIHRlbXAucHVzaCh7XG4gICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiBrZXksXG4gICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZTogZXZlbnQuZGF0YVsga2V5IF1cbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgYXdhaXQgUHJvbWlzZS5hbGwoIHRlbXAubWFwKCBhc3luYyB4ID0+IHtcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICBjb25zdCBmaW5kJCA9IGF3YWl0IGRiLmNvbGxlY3Rpb24oJ21hbmFnZXItd3gtaW5mbycpXG4gICAgICAgICAgICAgICAgICAgIC53aGVyZSh7XG4gICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiB4LnR5cGVcbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgLmdldCggKTtcblxuICAgICAgICAgICAgICAgIGlmICggZmluZCQuZGF0YS5sZW5ndGggPiAwICkge1xuICAgICAgICAgICAgICAgICAgICBhd2FpdCBkYi5jb2xsZWN0aW9uKCdtYW5hZ2VyLXd4LWluZm8nKS5kb2MoIChmaW5kJC5kYXRhWyAwIF0gYXMgYW55KS5faWQgKVxuICAgICAgICAgICAgICAgICAgICAgICAgLnNldCh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YTogeFxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGF3YWl0IGRiLmNvbGxlY3Rpb24oJ21hbmFnZXItd3gtaW5mbycpXG4gICAgICAgICAgICAgICAgICAgICAgICAuYWRkKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhOiB4XG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIH0pKTtcblxuICAgICAgICAgICAgcmV0dXJuIGN0eC5ib2R5ID0ge1xuICAgICAgICAgICAgICAgIHN0YXR1czogMjAwXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfSBjYXRjaCAoIGUgKSB7XG4gICAgICAgICAgICByZXR1cm4gY3R4LmJvZHkgPSB7IHN0YXR1czogNTAwIH07XG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgIC8qKlxuICAgICAqIEBkZXNjcmlwdGlvblxuICAgICAqIOafpeivouS7o+i0reS4quS6uuS6jOe7tOeggeS/oeaBr1xuICAgICAqL1xuICAgIGFwcC5yb3V0ZXIoJ3d4aW5mbycsIGFzeW5jKCBjdHgsIG5leHQgKSA9PiB7XG4gICAgICAgIHRyeSB7XG5cbiAgICAgICAgICAgIGNvbnN0IHRhcmdldCA9IFsnd3hfcXJjb2RlJywgJ2dyb3VwX3FyY29kZSddO1xuICAgICAgICAgICAgY29uc3QgZmluZHMkID0gYXdhaXQgUHJvbWlzZS5hbGwoIHRhcmdldC5tYXAoIHR5cGUgPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiBkYi5jb2xsZWN0aW9uKCdtYW5hZ2VyLXd4LWluZm8nKVxuICAgICAgICAgICAgICAgICAgICAud2hlcmUoe1xuICAgICAgICAgICAgICAgICAgICAgICAgdHlwZVxuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAuZ2V0KCApO1xuICAgICAgICAgICAgfSkpO1xuXG4gICAgICAgICAgICBjb25zdCB0ZW1wID0geyB9O1xuICAgICAgICAgICAgZmluZHMkLm1hcCgoIGZpbmQkLCBpbmRleCApID0+IHtcbiAgICAgICAgICAgICAgICBpZiAoIGZpbmQkLmRhdGEubGVuZ3RoID4gMCApIHtcbiAgICAgICAgICAgICAgICAgICAgdGVtcFsgdGFyZ2V0WyBpbmRleCBdXSA9IGZpbmQkLmRhdGFbIDAgXS52YWx1ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgcmV0dXJuIGN0eC5ib2R5ID0ge1xuICAgICAgICAgICAgICAgIHN0YXR1czogMjAwLFxuICAgICAgICAgICAgICAgIGRhdGE6IHRlbXBcbiAgICAgICAgICAgIH1cblxuICAgICAgICB9IGNhdGNoICggZSApIHtcbiAgICAgICAgICAgIHJldHVybiBjdHguYm9keSA9IHsgc3RhdHVzOiA1MDAgfTtcbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgLyoqIFxuICAgICAqIEBkZXNjcmlwdGlvblxuICAgICAqIOiOt+WPluKAnOaIkeeahOmhtemdouKAneeahOWfuuacrOS/oeaBr++8jOivuOWmguiuouWNleOAgeWNoeWIuOaVsOmHj1xuICAgICAqL1xuICAgIGFwcC5yb3V0ZXIoJ215cGFnZS1pbmZvJywgYXN5bmMoIGN0eCwgbmV4dCApID0+IHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgLy8g6K6i5Y2V5pWwXG4gICAgICAgICAgICBjb25zdCBvcmRlcnMkID0gYXdhaXQgZGIuY29sbGVjdGlvbignb3JkZXInKVxuICAgICAgICAgICAgICAgIC53aGVyZSh7XG4gICAgICAgICAgICAgICAgICAgIG9wZW5pZDogZXZlbnQudXNlckluZm8ub3BlbklkXG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAuY291bnQoICk7XG5cbiAgICAgICAgICAgIC8vIOWNoeWIuOaVsFxuICAgICAgICAgICAgY29uc3QgY291cG9ucyQgPSBhd2FpdCBkYi5jb2xsZWN0aW9uKCdjb3Vwb24nKVxuICAgICAgICAgICAgICAgIC53aGVyZSh7XG4gICAgICAgICAgICAgICAgICAgIG9wZW5pZDogZXZlbnQudXNlckluZm8ub3BlbklkXG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAuY291bnQoICk7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIHJldHVybiBjdHguYm9keSA9IHtcbiAgICAgICAgICAgICAgICBzdGF0dXM6IDIwMCxcbiAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICAgIGNvdXBvbnM6IGNvdXBvbnMkLnRvdGFsLFxuICAgICAgICAgICAgICAgICAgICBvcmRlcnM6IG9yZGVycyQudG90YWxcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfSBjYXRjaCAoIGUgKSB7IHJldHVybiBjdHguYm9keSA9IHsgc3RhdHVzOiA1MDAgfTt9XG4gICAgfSk7XG5cbiAgICAvKiogXG4gICAgICogQGRlc2NyaXB0aW9uXG4gICAgICog6KGM56iL5LiL77yM5Y+C5Yqg5LqG6LSt5Lmw55qE5a6i5oi377yI6K6i5Y2V77yJXG4gICAgICogeyBcbiAgICAgKiAgICB0aWRcbiAgICAgKiB9XG4gICAgICovXG4gICAgYXBwLnJvdXRlcignY3VzdG9tZXItaW4tdHJpcCcsIGFzeW5jKCBjdHgsIG5leHQgKSA9PiB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBjb25zdCBsaW1pdCA9IDEwMDtcbiAgICAgICAgICAgIGNvbnN0IGFsbE9yZGVyVXNlcnMkID0gYXdhaXQgZGIuY29sbGVjdGlvbignb3JkZXInKVxuICAgICAgICAgICAgICAgIC53aGVyZSh7XG4gICAgICAgICAgICAgICAgICAgIHRpZDogZXZlbnQuZGF0YS50aWRcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIC5vcmRlckJ5KCdjcmVhdGVUaW1lJywgJ2Rlc2MnKVxuICAgICAgICAgICAgICAgIC5saW1pdCggbGltaXQgKVxuICAgICAgICAgICAgICAgIC5maWVsZCh7XG4gICAgICAgICAgICAgICAgICAgIG9wZW5pZDogdHJ1ZVxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLmdldCggKTtcblxuICAgICAgICAgICAgY29uc3Qgb3BlbmlkcyA9IEFycmF5LmZyb20oIG5ldyBTZXQoIGFsbE9yZGVyVXNlcnMkLmRhdGEubWFwKCB4ID0+IHgub3BlbmlkICkpKTtcblxuICAgICAgICAgICAgY29uc3QgYXZhdGF0cyQgPSBhd2FpdCBQcm9taXNlLmFsbCggb3Blbmlkcy5tYXAoIG9pZCA9PiB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGRiLmNvbGxlY3Rpb24oJ3VzZXInKVxuICAgICAgICAgICAgICAgICAgICAud2hlcmUoe1xuICAgICAgICAgICAgICAgICAgICAgICAgb3BlbmlkOiBvaWRcbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgLmZpZWxkKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGF2YXRhclVybDogdHJ1ZVxuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAuZ2V0KCApO1xuICAgICAgICAgICAgfSkpXG4gICAgICAgICAgICBcbiAgICAgICAgICAgIHJldHVybiBjdHguYm9keSA9IHtcbiAgICAgICAgICAgICAgICBzdGF0dXM6IDIwMCxcbiAgICAgICAgICAgICAgICBkYXRhOiBhdmF0YXRzJC5tYXAoIHggPT4geC5kYXRhWyAwIF0uYXZhdGFyVXJsIClcbiAgICAgICAgICAgIH1cblxuICAgICAgICB9IGNhdGNoICggZSApIHtcbiAgICAgICAgICAgIHJldHVybiBjdHguYm9keSA9IHsgc3RhdHVzOiA1MDAgfTtcbiAgICAgICAgfVxuICAgIH0pXG5cbiAgICAvKipcbiAgICAgKiDmtojmga/mjqjpgIEgLSDlgqzmrL5cbiAgICAgKiB7XG4gICAgICogICAgIHRvdXNlciAoIG9wZW5pZCApXG4gICAgICogICAgIGZvcm1faWRcbiAgICAgKiAgICAgcGFnZT86IHN0cmluZ1xuICAgICAqICAgICBkYXRhOiB7IFxuICAgICAqICAgICAgICAgXG4gICAgICogICAgIH1cbiAgICAgKiB9XG4gICAgICovXG4gICAgYXBwLnJvdXRlcignbm90aWZpY2F0aW9uLWdldG1vbmV5JywgYXN5bmMoIGN0eCwgbmV4dCApID0+IHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgY29uc3QgcGFnZSA9IGV2ZW50LmRhdGEucGFnZSB8fCAncGFnZXMvb3JkZXItbGlzdC9pbmRleCc7XG4gICAgICAgICAgICBjb25zdCB7IHRvdXNlciwgZm9ybV9pZCwgZGF0YSwgcHJlcGF5X2lkIH0gPSBldmVudC5kYXRhO1xuXG4gICAgICAgICAgICAvLyDojrflj5Z0b2tlblxuICAgICAgICAgICAgY29uc3QgcmVzdWx0ID0gYXdhaXQgKGF4aW9zIGFzIGFueSkoe1xuICAgICAgICAgICAgICAgIG1ldGhvZDogJ2dldCcsXG4gICAgICAgICAgICAgICAgdXJsOiBgaHR0cHM6Ly9hcGkud2VpeGluLnFxLmNvbS9jZ2ktYmluL3Rva2VuP2dyYW50X3R5cGU9Y2xpZW50X2NyZWRlbnRpYWwmYXBwaWQ9JHtDT05GSUcuYXBwLmlkfSZzZWNyZXQ9JHtDT05GSUcuYXBwLnNlY3JlY3R9YFxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGNvbnN0IHsgYWNjZXNzX3Rva2VuLCBlcnJjb2RlIH0gPSByZXN1bHQuZGF0YTtcblxuICAgICAgICAgICAgaWYgKCBlcnJjb2RlICkge1xuICAgICAgICAgICAgICAgIHRocm93ICfnlJ/miJBhY2Nlc3NfdG9rZW7plJnor68nXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGNvbnN0IHJlcURhdGEgPSB7IH07XG4gICAgICAgICAgICBjb25zdCByZXFEYXRhJCA9IHtcbiAgICAgICAgICAgICAgICBwYWdlLFxuICAgICAgICAgICAgICAgIHRvdXNlcixcbiAgICAgICAgICAgICAgICBwcmVwYXlfaWQsXG4gICAgICAgICAgICAgICAgZm9ybV9pZCxcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZV9pZDogQ09ORklHLm5vdGlmaWNhdGlvbl90ZW1wbGF0ZS5nZXRNb25leTMsXG4gICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgICAvLyDotK3kubDml7bpl7RcbiAgICAgICAgICAgICAgICAgICAgXCJrZXl3b3JkMVwiOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBcInZhbHVlXCI6IGRhdGEudGl0bGVcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgLy8g6K6i5Y2V5oC75Lu3XG4gICAgICAgICAgICAgICAgICAgIFwia2V5d29yZDJcIjoge1xuICAgICAgICAgICAgICAgICAgICAgICAgXCJ2YWx1ZVwiOiBkYXRhLnRpbWVcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIE9iamVjdC5rZXlzKCByZXFEYXRhJCApLm1hcCgga2V5ID0+IHtcbiAgICAgICAgICAgICAgICBpZiAoICEhcmVxRGF0YSRbIGtleSBdKSB7XG4gICAgICAgICAgICAgICAgICAgIHJlcURhdGFbIGtleSBdID0gcmVxRGF0YSRbIGtleSBdO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAvLyDlj5HpgIHmjqjpgIFcbiAgICAgICAgICAgIGNvbnN0IHNlbmQgPSBhd2FpdCAoYXhpb3MgYXMgYW55KSh7XG4gICAgICAgICAgICAgICAgZGF0YTogcmVxRGF0YSxcbiAgICAgICAgICAgICAgICBtZXRob2Q6ICdwb3N0JyxcbiAgICAgICAgICAgICAgICB1cmw6IGBodHRwczovL2FwaS53ZWl4aW4ucXEuY29tL2NnaS1iaW4vbWVzc2FnZS93eG9wZW4vdGVtcGxhdGUvc2VuZD9hY2Nlc3NfdG9rZW49JHthY2Nlc3NfdG9rZW59YFxuICAgICAgICAgICAgfSk7XG4gICAgICAgIFxuICAgICAgICAgICAgcmV0dXJuIGN0eC5ib2R5ID0ge1xuICAgICAgICAgICAgICAgIGRhdGE6IHNlbmQuZGF0YSxcbiAgICAgICAgICAgICAgICBzdGF0dXM6IDIwMFxuICAgICAgICAgICAgfVxuXG4gICAgICAgIH0gY2F0Y2ggKCBlICkge1xuICAgICAgICAgICAgcmV0dXJuIGN0eC5ib2R5ID0geyBtZXNzYWdlOiBlLCBzdGF0dXM6IDUwMCB9XG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgIC8qKlxuICAgICAqIEBkZXNjcmlwdGlvblxuICAgICAqIOmAmui/h+WKoOino+WvhuWuouacjee7meeahOWvhuegge+8jOadpeWinuWKoOadg+mZkOOAgeWIneWni+WMluaVsOaNruW6k1xuICAgICAqL1xuICAgIGFwcC5yb3V0ZXIoJ2FkZC1hdXRoLWJ5LXBzdycsIGFzeW5jKCBjdHgsIG5leHQgKSA9PiB7XG4gICAgICAgIHRyeSB7XG5cbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgYXdhaXQgKGRiIGFzIGFueSkuY3JlYXRlQ29sbGVjdGlvbignbWFuYWdlci1tZW1iZXInKTtcbiAgICAgICAgICAgICAgICBhd2FpdCAoZGIgYXMgYW55KS5jcmVhdGVDb2xsZWN0aW9uKCdhdXRocHN3Jyk7XG4gICAgICAgICAgICB9IGNhdGNoICggZSApIHsgfVxuXG4gICAgICAgICAgICBsZXQgcmVzdWx0ID0gJyc7XG4gICAgICAgICAgICBjb25zdCB7IHNhbHQgfSA9IENPTkZJRy5hdXRoO1xuICAgICAgICAgICAgY29uc3Qgb3BlbmlkID0gZXZlbnQudXNlckluZm8ub3BlbklkO1xuICAgICAgICAgICAgY29uc3QgeyBwc3csIGNvbnRlbnQgfSA9IGV2ZW50LmRhdGE7XG5cbiAgICAgICAgICAgIGNvbnN0IGdldEVyciA9IG1lc3NhZ2UgPT4gKHtcbiAgICAgICAgICAgICAgICBtZXNzYWdlLFxuICAgICAgICAgICAgICAgIHN0YXR1czogNTAwLFxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgY29uc3QgZGVjaXBoZXIgPSBjcnlwdG8uY3JlYXRlRGVjaXBoZXIoJ2FlczE5MicsIHNhbHQgKTtcbiAgICAgICAgICAgICAgICBjb25zdCBkZWNyeXB0ZWQgPSBkZWNpcGhlci51cGRhdGUoIHBzdywgJ2hleCcsICd1dGY4JyApO1xuICAgICAgICAgICAgICAgIHJlc3VsdCA9IGRlY3J5cHRlZCArIGRlY2lwaGVyLmZpbmFsKCd1dGY4Jyk7XG4gICAgICAgICAgICB9IGNhdGNoICggZSApIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gY3R4LmJvZHkgPSBnZXRFcnIoJ+WvhumSpemUmeivr++8jOivt+aguOWvuScpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgXG4gICAgICAgICAgICBjb25zdCBbIGNfdGltZXN0YW1wLCBjX2FwcGlkLCBjX2NvbnRlbnQsIGNfbWF4IF0gPSByZXN1bHQuc3BsaXQoJy0nKTtcblxuICAgICAgICAgICAgaWYgKCBuZXcgRGF0ZSggKS5nZXRUaW1lKCApIC0gTnVtYmVyKCBjX3RpbWVzdGFtcCApID4gMzAgKiA2MCAqIDEwMDAgKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGN0eC5ib2R5ID0gZ2V0RXJyKCflr4bpkqXlt7Lov4fmnJ/vvIzor7fogZTns7vlrqLmnI0nKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKCBjX2FwcGlkICE9PSBDT05GSUcuYXBwLmlkICkge1xuICAgICAgICAgICAgICAgIHJldHVybiBjdHguYm9keSA9IGdldEVycign5a+G6ZKl5LiO5bCP56iL5bqP5LiN5YWz6IGUJyk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICggY19jb250ZW50LnJlcGxhY2UoL1xccysvZywgJycpICE9PSBjb250ZW50LnJlcGxhY2UoL1xccysvZywgJycpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGN0eC5ib2R5ID0gZ2V0RXJyKCfmj5DnpLror43plJnor6/vvIzor7fogZTns7vlrqLmnI0nKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiBhdXRocHN3IOihqFxuICAgICAgICAgICAgICogXG4gICAgICAgICAgICAgKiB7XG4gICAgICAgICAgICAgKiAgICBhcHBJZCxcbiAgICAgICAgICAgICAqICAgIHRpbWVzdGFtcCxcbiAgICAgICAgICAgICAqICAgIGNvdW50XG4gICAgICAgICAgICAgKiB9XG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIGNvbnN0IGNoZWNrJCA9IGF3YWl0IGRiLmNvbGxlY3Rpb24oJ2F1dGhwc3cnKSBcbiAgICAgICAgICAgICAgICAud2hlcmUoe1xuICAgICAgICAgICAgICAgICAgICBhcHBJZDogY19hcHBpZCxcbiAgICAgICAgICAgICAgICAgICAgdGltZXN0YW1wOiBjX3RpbWVzdGFtcFxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLmdldCggKTtcbiAgICAgICAgICAgIGNvbnN0IHRhcmdldCA9IGNoZWNrJC5kYXRhWyAwIF07XG5cbiAgICAgICAgICAgIC8vIOWvhumSpeW3suiiq+S9v+eUqFxuICAgICAgICAgICAgaWYgKCAhIXRhcmdldCApIHtcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAvLyDmrKHmlbDkuI3og73lpJrkuo4yXG4gICAgICAgICAgICAgICAgaWYgKCB0YXJnZXQuY291bnQgPj0gMiApIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGN0eC5ib2R5ID0gZ2V0RXJyKCflr4bpkqXlt7Looqvkvb/nlKjvvIzor7fogZTns7vlrqLmnI0nKTtcblxuICAgICAgICAgICAgICAgIC8vIOabtOaWsOWvhumSpeS/oeaBr1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGF3YWl0IGRiLmNvbGxlY3Rpb24oJ2F1dGhwc3cnKVxuICAgICAgICAgICAgICAgICAgICAgICAgLmRvYyggU3RyaW5nKCB0YXJnZXQuX2lkICkpXG4gICAgICAgICAgICAgICAgICAgICAgICAudXBkYXRlKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvdW50OiBfLmluYyggMSApXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8g5Yib5bu65a+G6ZKl5L+h5oGvXG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGF3YWl0IGRiLmNvbGxlY3Rpb24oJ2F1dGhwc3cnKVxuICAgICAgICAgICAgICAgICAgICAuYWRkKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb3VudDogMSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhcHBJZDogY19hcHBpZCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aW1lc3RhbXA6IGNfdGltZXN0YW1wXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIOaKiuW9k+WJjeS6uu+8jOWKoOWFpeWIsOeuoeeQhuWRmFxuICAgICAgICAgICAgY29uc3QgY2hlY2tNYW5hZ2VyJCA9IGF3YWl0IGRiLmNvbGxlY3Rpb24oJ21hbmFnZXItbWVtYmVyJylcbiAgICAgICAgICAgICAgICAud2hlcmUoe1xuICAgICAgICAgICAgICAgICAgICBvcGVuaWRcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIC5nZXQoICk7XG4gICAgICAgICAgICBjb25zdCB0YXJnZXRNYW5hZ2VyID0gY2hlY2tNYW5hZ2VyJC5kYXRhWyAwIF07XG5cbiAgICAgICAgICAgIGlmICggIXRhcmdldE1hbmFnZXIgKSB7XG4gICAgICAgICAgICAgICAgYXdhaXQgZGIuY29sbGVjdGlvbignbWFuYWdlci1tZW1iZXInKVxuICAgICAgICAgICAgICAgICAgICAuYWRkKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvcGVuaWQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29udGVudDogY19jb250ZW50LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNyZWF0ZVRpbWU6IG5ldyBEYXRlKCApLmdldFRpbWUoIClcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8g5Yid5aeL5YyW5ZCE5Liq6KGoXG4gICAgICAgICAgICBhd2FpdCBpbml0REIoICk7XG5cbiAgICAgICAgICAgIHJldHVybiBjdHguYm9keSA9IHtcbiAgICAgICAgICAgICAgICBzdGF0dXM6IDIwMFxuICAgICAgICAgICAgfVxuXG4gICAgICAgIH0gY2F0Y2ggKCBlICkge1xuICAgICAgICAgICAgcmV0dXJuIGN0eC5ib2R5ID0ge1xuICAgICAgICAgICAgICAgIHN0YXR1czogNTAwLFxuICAgICAgICAgICAgICAgIG1lc3NhZ2U6ICflr4bpkqXmo4Dmn6Xlj5HnlJ/plJnor68nXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgIHJldHVybiBhcHAuc2VydmUoICk7XG5cbn1cblxuLyoqXG4gKiDliJ3lp4vljJbmlbDmja7lupPjgIHln7rnoYDmlbDmja5cbiAqL1xuY29uc3QgaW5pdERCID0gKCApID0+IG5ldyBQcm9taXNlKCBhc3luYyByZXNvbHZlID0+IHtcbiAgICB0cnkge1xuXG4gICAgICAgIC8qKiDliJ3lp4vljJbooaggKi9cbiAgICAgICAgY29uc3QgY29sbGVjdGlvbnMgPSBDT05GSUcuY29sbGVjdGlvbnM7XG4gICAgICAgIGF3YWl0IFByb21pc2UuYWxsKFxuICAgICAgICAgICAgY29sbGVjdGlvbnMubWFwKCBjb2xsZWN0aW9uTmFtZSA9PiAoZGIgYXMgYW55KS5jcmVhdGVDb2xsZWN0aW9uKCBjb2xsZWN0aW9uTmFtZSApKVxuICAgICAgICApO1xuXG4gICAgICAgIC8qKiDliJ3lp4vljJbmlbDmja7lrZflhbggKi9cbiAgICAgICAgXG5cbiAgICAgICAgcmVzb2x2ZSggKTtcblxuICAgIH0gY2F0Y2ggKCBlICkgeyByZXNvbHZlKCApO31cbn0pOyJdfQ==