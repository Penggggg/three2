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
            var bjpConfig_1, _a, dicName, filterBjp, dbRes, bjpConfig$, result_1, e_2;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 4, , 5]);
                        bjpConfig_1 = null;
                        _a = event.data, dicName = _a.dicName, filterBjp = _a.filterBjp;
                        return [4, db.collection('dic')
                                .where({
                                belong: db.RegExp({
                                    regexp: dicName.replace(/\,/g, '|'),
                                    optiond: 'i'
                                })
                            })
                                .get()];
                    case 1:
                        dbRes = _b.sent();
                        if (!!!filterBjp) return [3, 3];
                        return [4, db.collection('app-config')
                                .where({
                                type: 'app-bjp-visible'
                            })
                                .get()];
                    case 2:
                        bjpConfig$ = _b.sent();
                        bjpConfig_1 = bjpConfig$.data[0];
                        _b.label = 3;
                    case 3:
                        result_1 = {};
                        dbRes.data.map(function (dic) {
                            var _a;
                            result_1 = Object.assign({}, result_1, (_a = {},
                                _a[dic.belong] = dic[dic.belong]
                                    .filter(function (x) { return !!x; })
                                    .filter(function (x) {
                                    if (!!bjpConfig_1 && !bjpConfig_1.value) {
                                        return String(x.value) !== '4';
                                    }
                                    return true;
                                }),
                                _a));
                        });
                        return [2, ctx.body = {
                                status: 200,
                                data: result_1
                            }];
                    case 4:
                        e_2 = _b.sent();
                        return [2, ctx.body = {
                                status: 500,
                                message: e_2
                            }];
                    case 5: return [2];
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
        app.router('should-prepay', function (ctx, next) { return __awaiter(_this, void 0, void 0, function () {
            var tid, openid, find$, trip$, trip, isNew, judge, e_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        tid = event.data.tid;
                        openid = event.data.openId || event.userInfo.openId;
                        return [4, db.collection('order')
                                .where({
                                openid: openid,
                                base_status: '3'
                            })
                                .count()];
                    case 1:
                        find$ = _a.sent();
                        return [4, db.collection('trip')
                                .doc(String(tid))
                                .get()];
                    case 2:
                        trip$ = _a.sent();
                        trip = trip$.data;
                        isNew = find$.total < 3;
                        judge = function (isNew, trip) {
                            if (!trip) {
                                return true;
                            }
                            if (isNew && trip.payment === '0') {
                                return true;
                            }
                            else if (isNew && trip.payment === '1') {
                                return true;
                            }
                            else if (isNew && trip.payment === '2') {
                                return false;
                            }
                            else if (!isNew && trip.payment === '0') {
                                return false;
                            }
                            else if (!isNew && trip.payment === '1') {
                                return true;
                            }
                            else if (isNew && trip.payment === '2') {
                                return false;
                            }
                            else {
                                return true;
                            }
                        };
                        return [2, ctx.body = {
                                status: 200,
                                data: {
                                    isNew: isNew,
                                    shouldPrepay: judge(isNew, trip)
                                }
                            }];
                    case 3:
                        e_5 = _a.sent();
                        return [2, ctx.body = { status: 500 }];
                    case 4: return [2];
                }
            });
        }); });
        app.router('wxpay', function (ctx, next) { return __awaiter(_this, void 0, void 0, function () {
            var _a, key_1, body, mch_id, attach, notify_url, spbill_create_ip, appid, total_fee, openid, nonce_str, timeStamp, out_trade_no, paysign, formData, res, xml, prepay_id, paySign, e_6;
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
                        e_6 = _b.sent();
                        return [2, ctx.body = {
                                status: 500
                            }];
                    case 3: return [2];
                }
            });
        }); });
        app.router('wxinfo-edit', function (ctx, next) { return __awaiter(_this, void 0, void 0, function () {
            var temp_1, e_7;
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
                        e_7 = _a.sent();
                        return [2, ctx.body = { status: 500 }];
                    case 3: return [2];
                }
            });
        }); });
        app.router('wxinfo', function (ctx, next) { return __awaiter(_this, void 0, void 0, function () {
            var target_1, finds$, temp_2, e_8;
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
                        e_8 = _a.sent();
                        return [2, ctx.body = { status: 500 }];
                    case 3: return [2];
                }
            });
        }); });
        app.router('mypage-info', function (ctx, next) { return __awaiter(_this, void 0, void 0, function () {
            var coupons, trips$, trips, trip, orders$, coupons$, e_9;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 5, , 6]);
                        coupons = 0;
                        return [4, cloud.callFunction({
                                data: {
                                    $url: 'enter'
                                },
                                name: 'trip'
                            })];
                    case 1:
                        trips$ = _a.sent();
                        trips = trips$.result.data;
                        trip = trips[0];
                        return [4, db.collection('order')
                                .where({
                                openid: event.userInfo.openId,
                                base_status: _.neq('5')
                            })
                                .count()];
                    case 2:
                        orders$ = _a.sent();
                        if (!!!trip) return [3, 4];
                        return [4, db.collection('coupon')
                                .where({
                                tid: trip._id,
                                openid: event.userInfo.openId
                            })
                                .count()];
                    case 3:
                        coupons$ = _a.sent();
                        coupons = coupons$.total;
                        _a.label = 4;
                    case 4: return [2, ctx.body = {
                            status: 200,
                            data: {
                                coupons: coupons,
                                orders: orders$.total
                            }
                        }];
                    case 5:
                        e_9 = _a.sent();
                        return [2, ctx.body = { status: 500 }];
                    case 6: return [2];
                }
            });
        }); });
        app.router('customer-in-trip', function (ctx, next) { return __awaiter(_this, void 0, void 0, function () {
            var limit, allOrderUsers$, openids, avatats$, e_10;
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
                        e_10 = _a.sent();
                        return [2, ctx.body = { status: 500 }];
                    case 4: return [2];
                }
            });
        }); });
        app.router('notification-getmoney', function (ctx, next) { return __awaiter(_this, void 0, void 0, function () {
            var page, _a, touser, form_id, data, prepay_id, result, _b, access_token, errcode, reqData_1, reqData$_1, send, e_11;
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
                        e_11 = _c.sent();
                        return [2, ctx.body = { message: e_11, status: 500 }];
                    case 4: return [2];
                }
            });
        }); });
        app.router('add-auth-by-psw', function (ctx, next) { return __awaiter(_this, void 0, void 0, function () {
            var e_12, result, salt, openid, _a, psw, content, getErr, decipher, decrypted, _b, c_timestamp, c_appid, c_content, c_max, check$, target, checkManager$, targetManager, e_13;
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
                        e_12 = _c.sent();
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
                        e_13 = _c.sent();
                        return [2, ctx.body = {
                                status: 500,
                                message: '密钥检查发生错误'
                            }];
                    case 18: return [2];
                }
            });
        }); });
        app.router('check-app-config', function (ctx, next) { return __awaiter(_this, void 0, void 0, function () {
            var configObj_1, config$, meta, e_14;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        configObj_1 = {};
                        return [4, db.collection('app-config')
                                .where({})
                                .get()];
                    case 1:
                        config$ = _a.sent();
                        meta = config$.data.map(function (conf) {
                            var _a;
                            configObj_1 = Object.assign({}, configObj_1, (_a = {},
                                _a[conf.type] = conf.value,
                                _a));
                        });
                        return [2, ctx.body = {
                                data: configObj_1,
                                status: 200
                            }];
                    case 2:
                        e_14 = _a.sent();
                        return [2, ctx.body = {
                                status: 500
                            }];
                    case 3: return [2];
                }
            });
        }); });
        app.router('update-app-config', function (ctx, next) { return __awaiter(_this, void 0, void 0, function () {
            var configs_1, e_15;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        configs_1 = event.data.configs;
                        return [4, Promise.all(Object.keys(configs_1)
                                .map(function (configKey) { return __awaiter(_this, void 0, void 0, function () {
                                var target$;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4, db.collection('app-config')
                                                .where({
                                                type: configKey
                                            })
                                                .get()];
                                        case 1:
                                            target$ = _a.sent();
                                            if (!target$.data[0]) {
                                                return [2];
                                            }
                                            return [4, db.collection('app-config')
                                                    .doc(String(target$.data[0]._id))
                                                    .update({
                                                    data: {
                                                        value: configs_1[configKey]
                                                    }
                                                })];
                                        case 2:
                                            _a.sent();
                                            return [2];
                                    }
                                });
                            }); }))];
                    case 1:
                        _a.sent();
                        return [2, ctx.body = {
                                status: 200
                            }];
                    case 2:
                        e_15 = _a.sent();
                        return [2, ctx.body = {
                                status: 500
                            }];
                    case 3: return [2];
                }
            });
        }); });
        app.router('create-qrcode', function (ctx, next) { return __awaiter(_this, void 0, void 0, function () {
            var _a, page, scene, result, e_16;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        _a = event.data, page = _a.page, scene = _a.scene;
                        return [4, cloud.openapi.wxacode.getUnlimited({
                                page: page,
                                scene: scene || ''
                            })];
                    case 1:
                        result = _b.sent();
                        if (result.errCode !== 0) {
                            throw result.errMsg;
                        }
                        return [2, ctx.body = {
                                status: 200,
                                data: result.buffer
                            }];
                    case 2:
                        e_16 = _b.sent();
                        return [2, ctx.body = {
                                status: 500,
                                message: typeof e_16 === 'string' ? e_16 : JSON.stringify(e_16)
                            }];
                    case 3: return [2];
                }
            });
        }); });
        app.router('create-formid', function (ctx, next) { return __awaiter(_this, void 0, void 0, function () {
            var openid, formid, find$, create$, e_17;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        openid = event.userInfo.openId;
                        formid = event.data.formid;
                        return [4, db.collection('manager-member')
                                .where({
                                openid: openid,
                                createTime: new Date().getTime()
                            })
                                .count()];
                    case 1:
                        find$ = _a.sent();
                        return [4, db.collection('form-ids')
                                .add({
                                data: {
                                    openid: openid,
                                    formid: formid,
                                    type: find$.total > 0 ? 'manager' : 'normal'
                                }
                            })];
                    case 2:
                        create$ = _a.sent();
                        ctx.body = {
                            status: 200
                        };
                        return [3, 4];
                    case 3:
                        e_17 = _a.sent();
                        ctx.body = {
                            status: 200
                        };
                        return [3, 4];
                    case 4: return [2];
                }
            });
        }); });
        return [2, app.serve()];
    });
}); };
var time = function (ts) { return new Promise(function (resovle) {
    setTimeout(function () { return resovle(); }, ts);
}); };
var initDB = function () { return new Promise(function (resolve) { return __awaiter(_this, void 0, void 0, function () {
    var collections, e_18, dics, e_19, appConf, e_20, e_21;
    var _this = this;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 13, , 14]);
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                collections = CONFIG.collections;
                return [4, Promise.all(collections.map(function (collectionName) { return db.createCollection(collectionName); }))];
            case 2:
                _a.sent();
                return [3, 4];
            case 3:
                e_18 = _a.sent();
                return [3, 4];
            case 4: return [4, time(800)];
            case 5:
                _a.sent();
                _a.label = 6;
            case 6:
                _a.trys.push([6, 8, , 9]);
                dics = CONFIG.dic;
                return [4, Promise.all(dics.map(function (dicSet) { return __awaiter(_this, void 0, void 0, function () {
                        var targetDic$, targetDic;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4, db.collection('dic')
                                        .where({
                                        belong: dicSet.belong
                                    })
                                        .get()];
                                case 1:
                                    targetDic$ = _a.sent();
                                    targetDic = targetDic$.data[0];
                                    if (!!!targetDic) return [3, 3];
                                    return [4, db.collection('dic')
                                            .doc(String(targetDic._id))
                                            .set({
                                            data: dicSet
                                        })];
                                case 2:
                                    _a.sent();
                                    return [3, 5];
                                case 3: return [4, db.collection('dic')
                                        .add({
                                        data: dicSet
                                    })];
                                case 4:
                                    _a.sent();
                                    _a.label = 5;
                                case 5: return [2];
                            }
                        });
                    }); }))];
            case 7:
                _a.sent();
                return [3, 9];
            case 8:
                e_19 = _a.sent();
                console.log('eee', e_19);
                return [3, 9];
            case 9:
                _a.trys.push([9, 11, , 12]);
                appConf = CONFIG.appConfs;
                return [4, Promise.all(appConf.map(function (conf) { return __awaiter(_this, void 0, void 0, function () {
                        var targetConf$, targetConf;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4, db.collection('app-config')
                                        .where({
                                        type: conf.type
                                    })
                                        .get()];
                                case 1:
                                    targetConf$ = _a.sent();
                                    targetConf = targetConf$.data[0];
                                    if (!!!targetConf) return [3, 2];
                                    return [3, 4];
                                case 2: return [4, db.collection('app-config')
                                        .add({
                                        data: conf
                                    })];
                                case 3:
                                    _a.sent();
                                    _a.label = 4;
                                case 4: return [2];
                            }
                        });
                    }); }))];
            case 10:
                _a.sent();
                return [3, 12];
            case 11:
                e_20 = _a.sent();
                console.log('eee', e_20);
                return [3, 12];
            case 12:
                resolve();
                return [3, 14];
            case 13:
                e_21 = _a.sent();
                resolve();
                return [3, 14];
            case 14: return [2];
        }
    });
}); }); };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSxpQkFxNkJHOztBQXI2QkgscUNBQXVDO0FBQ3ZDLHNDQUF3QztBQUN4Qyw2QkFBK0I7QUFDL0IsK0JBQWlDO0FBQ2pDLG9DQUFzQztBQUN0QyxpQ0FBbUM7QUFFbkMsS0FBSyxDQUFDLElBQUksQ0FBQztJQUNQLEdBQUcsRUFBRSxPQUFPLENBQUMsR0FBRyxDQUFDLEtBQUs7Q0FDekIsQ0FBQyxDQUFDO0FBRUgsSUFBTSxFQUFFLEdBQWdCLEtBQUssQ0FBQyxRQUFRLEVBQUcsQ0FBQztBQUMxQyxJQUFNLENBQUMsR0FBRyxFQUFFLENBQUMsT0FBTyxDQUFDO0FBTVIsUUFBQSxJQUFJLEdBQUcsVUFBUSxLQUFLLEVBQUUsT0FBTzs7OztRQUVoQyxHQUFHLEdBQUcsSUFBSSxTQUFTLENBQUMsRUFBRSxLQUFLLE9BQUEsRUFBRSxDQUFDLENBQUM7UUFNckMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxNQUFNLEVBQUUsVUFBTyxHQUFHLEVBQUUsSUFBSTs7Ozs7O3dCQUVyQixXQUFXLEdBQUcsTUFBTSxDQUFDLFdBQVcsQ0FBQzt3QkFDdkMsV0FBTSxPQUFPLENBQUMsR0FBRyxDQUFDO2dDQUNkLFdBQVcsQ0FBQyxHQUFHLENBQUUsVUFBQSxjQUFjLElBQUksT0FBQyxFQUFVLENBQUMsZ0JBQWdCLENBQUUsY0FBYyxDQUFFLEVBQTlDLENBQThDLENBQUM7NkJBQ3JGLENBQUMsRUFBQTs7d0JBRkYsU0FFRSxDQUFBO3dCQUVGLFdBQU8sR0FBRyxDQUFDLElBQUksR0FBRyxFQUFFLE1BQU0sRUFBRSxHQUFHLEVBQUUsRUFBQTs7O3dCQUVqQyxXQUFPLEdBQUcsQ0FBQyxJQUFJLEdBQUcsRUFBRSxNQUFNLEVBQUUsR0FBRyxFQUFFLE9BQU8sRUFBRSxHQUFDLEVB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Ozs7Ozt5QkFFZCxDQUFDLENBQ0wsRUFBQTs7Z0JBeEJELFNBd0JDLENBQUM7Ozs7Z0JBRUYsT0FBTyxDQUFDLEdBQUcsQ0FBQyxLQUFLLEVBQUUsSUFBQyxDQUFFLENBQUM7Ozs7Z0JBS2pCLE9BQU8sR0FBRyxNQUFNLENBQUMsUUFBUSxDQUFDO2dCQUNoQyxXQUFNLE9BQU8sQ0FBQyxHQUFHLENBQ2IsT0FBTyxDQUFDLEdBQUcsQ0FBRSxVQUFNLElBQUk7Ozs7d0NBQ0MsV0FBTSxFQUFFLENBQUMsVUFBVSxDQUFDLFlBQVksQ0FBQzt5Q0FDaEQsS0FBSyxDQUFDO3dDQUNILElBQUksRUFBRSxJQUFJLENBQUMsSUFBSTtxQ0FDbEIsQ0FBQzt5Q0FDRCxHQUFHLEVBQUcsRUFBQTs7b0NBSkwsV0FBVyxHQUFHLFNBSVQ7b0NBRUwsVUFBVSxHQUFHLFdBQVcsQ0FBQyxJQUFJLENBQUUsQ0FBQyxDQUFFLENBQUM7eUNBQ3BDLENBQUMsQ0FBQyxVQUFVLEVBQVosY0FBWTs7d0NBU2IsV0FBTSxFQUFFLENBQUMsVUFBVSxDQUFDLFlBQVksQ0FBQzt5Q0FDNUIsR0FBRyxDQUFDO3dDQUNELElBQUksRUFBRSxJQUFJO3FDQUNiLENBQUMsRUFBQTs7b0NBSE4sU0FHTSxDQUFDOzs7Ozt5QkFFZCxDQUFDLENBQ0wsRUFBQTs7Z0JBeEJELFNBd0JDLENBQUM7Ozs7Z0JBRUYsT0FBTyxDQUFDLEdBQUcsQ0FBQyxLQUFLLEVBQUUsSUFBQyxDQUFFLENBQUM7OztnQkFHM0IsT0FBTyxFQUFHLENBQUM7Ozs7Z0JBRUMsT0FBTyxFQUFHLENBQUM7Ozs7O0tBQzlCLENBQUMsRUFoRm9CLENBZ0ZwQixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgY2xvdWQgZnJvbSAnd3gtc2VydmVyLXNkayc7XG5pbXBvcnQgKiBhcyBUY2JSb3V0ZXIgZnJvbSAndGNiLXJvdXRlcic7XG5pbXBvcnQgKiBhcyBheGlvcyBmcm9tICdheGlvcyc7XG5pbXBvcnQgKiBhcyBjcnlwdG8gZnJvbSAnY3J5cHRvJztcbmltcG9ydCAqIGFzIHJwIGZyb20gJ3JlcXVlc3QtcHJvbWlzZSc7XG5pbXBvcnQgKiBhcyBDT05GSUcgZnJvbSAnLi9jb25maWcnO1xuXG5jbG91ZC5pbml0KHtcbiAgICBlbnY6IHByb2Nlc3MuZW52LmNsb3VkXG59KTtcblxuY29uc3QgZGI6IERCLkRhdGFiYXNlID0gY2xvdWQuZGF0YWJhc2UoICk7XG5jb25zdCBfID0gZGIuY29tbWFuZDtcblxuLyoqXG4gKiBAZGVzY3JpcHRpb24gXG4gKiDlhazlhbHmqKHlnZdcbiAqL1xuZXhwb3J0IGNvbnN0IG1haW4gPSBhc3luYyAoIGV2ZW50LCBjb250ZXh0ICkgPT4ge1xuXG4gICAgY29uc3QgYXBwID0gbmV3IFRjYlJvdXRlcih7IGV2ZW50IH0pO1xuXG4gICAgLyoqXG4gICAgICogQGRlc2NyaXB0aW9uXG4gICAgICog5Yid5aeL5YyW5ZCE5Liq5pWw5o2u5bqTXG4gICAgICovXG4gICAgYXBwLnJvdXRlcignaW5pdCcsIGFzeW5jKCBjdHgsIG5leHQgKSA9PiB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBjb25zdCBjb2xsZWN0aW9ucyA9IENPTkZJRy5jb2xsZWN0aW9ucztcbiAgICAgICAgICAgIGF3YWl0IFByb21pc2UuYWxsKFtcbiAgICAgICAgICAgICAgICBjb2xsZWN0aW9ucy5tYXAoIGNvbGxlY3Rpb25OYW1lID0+IChkYiBhcyBhbnkpLmNyZWF0ZUNvbGxlY3Rpb24oIGNvbGxlY3Rpb25OYW1lICkpXG4gICAgICAgICAgICBdKVxuXG4gICAgICAgICAgICByZXR1cm4gY3R4LmJvZHkgPSB7IHN0YXR1czogMjAwIH1cbiAgICAgICAgfSBjYXRjaCAoIGUgKSB7XG4gICAgICAgICAgICByZXR1cm4gY3R4LmJvZHkgPSB7IHN0YXR1czogNTAwLCBtZXNzYWdlOiBlIH1cbiAgICAgICAgfVxuICAgIH0pXG5cbiAgICAvKipcbiAgICAgKiBAZGVzY3JpcHRpb24gXG4gICAgICog5pWw5o2u5a2X5YW4XG4gICAgICoge1xuICAgICAqICAgICAgZGljTmFtZTogJ3h4eCx5eXksenp6J1xuICAgICAqICAgICAgZmlsdGVyQmpwOiBmYWxzZSB8IHRydWUgfCB1bmRlZmluZWQg77yIIOaYr+WQpui/h+a7pOS/neWBpeWTgSDvvIlcbiAgICAgKiB9XG4gICAgICovXG4gICAgYXBwLnJvdXRlcignZGljJywgYXN5bmMoIGN0eCwgbmV4dCApID0+IHtcbiAgICAgICAgdHJ5IHtcblxuICAgICAgICAgICAgLy8g5L+d5YGl5ZOB6YWN572uXG4gICAgICAgICAgICBsZXQgYmpwQ29uZmlnOiBhbnkgPSBudWxsO1xuICAgICAgICAgICAgY29uc3QgeyBkaWNOYW1lLCBmaWx0ZXJCanAgfSA9IGV2ZW50LmRhdGE7XG4gICAgICAgICAgICBjb25zdCBkYlJlcyA9IGF3YWl0IGRiLmNvbGxlY3Rpb24oJ2RpYycpXG4gICAgICAgICAgICAgICAgLndoZXJlKHtcbiAgICAgICAgICAgICAgICAgICAgYmVsb25nOiBkYi5SZWdFeHAoe1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVnZXhwOiBkaWNOYW1lLnJlcGxhY2UoL1xcLC9nLCAnfCcpLFxuICAgICAgICAgICAgICAgICAgICAgICAgb3B0aW9uZDogJ2knXG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAuZ2V0KCApO1xuXG4gICAgICAgICAgICAvLyDkv53lgaXlk4HphY3nva5cbiAgICAgICAgICAgIGlmICggISFmaWx0ZXJCanAgKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgYmpwQ29uZmlnJCA9IGF3YWl0IGRiLmNvbGxlY3Rpb24oJ2FwcC1jb25maWcnKVxuICAgICAgICAgICAgICAgICAgICAud2hlcmUoe1xuICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogJ2FwcC1ianAtdmlzaWJsZSdcbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgLmdldCggKTtcbiAgICAgICAgICAgICAgICBianBDb25maWcgPSBianBDb25maWckLmRhdGFbIDAgXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgICAgICBsZXQgcmVzdWx0ID0geyB9O1xuICAgICAgICAgICAgZGJSZXMuZGF0YS5tYXAoIGRpYyA9PiB7XG4gICAgICAgICAgICAgICAgcmVzdWx0ID0gT2JqZWN0LmFzc2lnbih7IH0sIHJlc3VsdCwge1xuICAgICAgICAgICAgICAgICAgICBbIGRpYy5iZWxvbmcgXTogZGljWyBkaWMuYmVsb25nIF1cbiAgICAgICAgICAgICAgICAgICAgICAgIC5maWx0ZXIoIHggPT4gISF4IClcbiAgICAgICAgICAgICAgICAgICAgICAgIC5maWx0ZXIoIHggPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICggISFianBDb25maWcgJiYgIWJqcENvbmZpZy52YWx1ZSApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFN0cmluZyggeC52YWx1ZSApICE9PSAnNCdcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHJldHVybiBjdHguYm9keSA9IHtcbiAgICAgICAgICAgICAgICBzdGF0dXM6IDIwMCxcbiAgICAgICAgICAgICAgICBkYXRhOiByZXN1bHRcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgfSBjYXRjaCAoIGUgKSB7XG4gICAgICAgICAgICByZXR1cm4gY3R4LmJvZHkgPSB7XG4gICAgICAgICAgICAgICAgc3RhdHVzOiA1MDAsXG4gICAgICAgICAgICAgICAgbWVzc2FnZTogZVxuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgLyoqXG4gICAgICogQGRlc2NyaXB0aW9uXG4gICAgICog5b6u5L+h55So5oi35L+h5oGv5a2Y5YKoXG4gICAgICovXG4gICAgYXBwLnJvdXRlcigndXNlckVkaXQnLCBhc3luYyggY3R4LCBuZXh0ICkgPT4ge1xuICAgICAgICB0cnkge1xuXG4gICAgICAgICAgICBjb25zdCBvcGVuaWQgPSBldmVudC51c2VySW5mby5vcGVuSWQ7XG4gICAgICAgICAgICBjb25zdCBkYXRhJCA9IGF3YWl0IGRiLmNvbGxlY3Rpb24oJ3VzZXInKVxuICAgICAgICAgICAgICAgIC53aGVyZSh7XG4gICAgICAgICAgICAgICAgICAgIG9wZW5pZFxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLmdldCggKVxuICAgICAgICAgICAgICAgIC5jYXRjaCggZXJyID0+IHsgdGhyb3cgYCR7ZXJyfWB9KTtcbiAgICAgICAgXG4gICAgICAgICAgICAvLyDlpoLmnpzkuI3lrZjlnKjvvIzliJnliJvlu7pcbiAgICAgICAgICAgIGlmICggZGF0YSQuZGF0YS5sZW5ndGggPT09IDAgKSB7XG4gICAgICAgIFxuICAgICAgICAgICAgICAgIGF3YWl0IGRiLmNvbGxlY3Rpb24oJ3VzZXInKVxuICAgICAgICAgICAgICAgICAgICAuYWRkKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRhdGE6IE9iamVjdC5hc3NpZ24oeyB9LCBldmVudC5kYXRhLCB7IFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9wZW5pZCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbnRlZ3JhbDogMFxuICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgfSkuY2F0Y2goIGVyciA9PiB7IHRocm93IGAke2Vycn1gfSk7XG4gICAgICAgIFxuICAgICAgICAgICAgLy8g5aaC5p6c5a2Y5Zyo77yM5YiZ5pu05pawXG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGNvbnN0IG1ldGEgPSBPYmplY3QuYXNzaWduKHsgfSwgZGF0YSQuZGF0YVsgMCBdLCBldmVudC5kYXRhICk7XG4gICAgICAgICAgICAgICAgZGVsZXRlIG1ldGEuX2lkO1xuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIGF3YWl0IGRiLmNvbGxlY3Rpb24oJ3VzZXInKS5kb2MoKCBkYXRhJC5kYXRhWyAwIF0gYXMgYW55KS5faWQgKVxuICAgICAgICAgICAgICAgICAgICAuc2V0KHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRhdGE6IE9iamVjdC5hc3NpZ24oeyB9LCBtZXRhLCB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaW50ZWdyYWw6IGRhdGEkLmRhdGFbIDAgXS5pbnRlZ3JhbFxuICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgfSkuY2F0Y2goIGVyciA9PiB7IHRocm93IGAke2Vycn1gfSk7XG4gICAgICAgICAgICB9ICAgIFxuXG4gICAgICAgICAgICByZXR1cm4gY3R4LmJvZHkgPSB7XG4gICAgICAgICAgICAgICAgc3RhdHVzOiAyMDBcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgfSBjYXRjaCAoIGUgKSB7XG4gICAgICAgICAgICByZXR1cm4gY3R4LmJvZHkgPSB7XG4gICAgICAgICAgICAgICAgc3RhdHVzOiA1MDAsXG4gICAgICAgICAgICAgICAgbWVzc2FnZTogZVxuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgLyoqXG4gICAgICogQGRlc2NyaXB0aW9uXG4gICAgICog5piv5paw5a6i6L+Y5piv5pen5a6iXG4gICAgICog5paw5a6i77yM5oiQ5Yqf5pSv5LuY6K6i5Y2VIDw9IDNcbiAgICAqL1xuICAgIGFwcC5yb3V0ZXIoJ2lzLW5ldy1jdXN0b21lcicsIGFzeW5jKCBjdHgsIG5leHQgKSA9PiB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGNvbnN0IG9wZW5pZCA9IGV2ZW50LmRhdGEub3BlbklkIHx8IGV2ZW50LnVzZXJJbmZvLm9wZW5JZDtcbiAgICAgICAgICAgIGNvbnN0IGZpbmQkID0gYXdhaXQgZGIuY29sbGVjdGlvbignb3JkZXInKVxuICAgICAgICAgICAgICAgIC53aGVyZSh7XG4gICAgICAgICAgICAgICAgICAgIG9wZW5pZCxcbiAgICAgICAgICAgICAgICAgICAgYmFzZV9zdGF0dXM6ICczJ1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLmNvdW50KCApO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICByZXR1cm4gY3R4LmJvZHkgPSB7XG4gICAgICAgICAgICAgICAgc3RhdHVzOiAyMDAsXG4gICAgICAgICAgICAgICAgZGF0YTogZmluZCQudG90YWwgPCAzXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfSBjYXRjaCAoIGUgKSB7XG4gICAgICAgICAgICByZXR1cm4gY3R4LmJvZHkgPSB7XG4gICAgICAgICAgICAgICAgc3RhdHVzOiAyMDAsXG4gICAgICAgICAgICAgICAgZGF0YTogdHJ1ZVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICAvKiogXG4gICAgICogQGRlc2NyaXB0aW9uXG4gICAgICog5a6i5oi35Zyo6K+l6Lq66KGM56iL77yM5piv5ZCm6ZyA6KaB5LuY6K6i6YeRXG4gICAgICoge1xuICAgICAqICAgIHRpZFxuICAgICAqIH1cbiAgICAgKi9cbiAgICBhcHAucm91dGVyKCdzaG91bGQtcHJlcGF5JywgYXN5bmMoIGN0eCwgbmV4dCApID0+IHtcbiAgICAgICAgdHJ5IHtcblxuICAgICAgICAgICAgY29uc3QgeyB0aWQgfSA9IGV2ZW50LmRhdGE7XG4gICAgICAgICAgICBjb25zdCBvcGVuaWQgPSBldmVudC5kYXRhLm9wZW5JZCB8fCBldmVudC51c2VySW5mby5vcGVuSWQ7XG5cbiAgICAgICAgICAgIGNvbnN0IGZpbmQkID0gYXdhaXQgZGIuY29sbGVjdGlvbignb3JkZXInKVxuICAgICAgICAgICAgICAgIC53aGVyZSh7XG4gICAgICAgICAgICAgICAgICAgIG9wZW5pZCxcbiAgICAgICAgICAgICAgICAgICAgYmFzZV9zdGF0dXM6ICczJ1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLmNvdW50KCApO1xuXG4gICAgICAgICAgICBjb25zdCB0cmlwJCA9IGF3YWl0IGRiLmNvbGxlY3Rpb24oJ3RyaXAnKVxuICAgICAgICAgICAgICAgIC5kb2MoIFN0cmluZyggdGlkICkpXG4gICAgICAgICAgICAgICAgLmdldCggKTtcbiAgICAgICAgICAgIGNvbnN0IHRyaXAgPSB0cmlwJC5kYXRhO1xuXG4gICAgICAgICAgICBjb25zdCBpc05ldyA9IGZpbmQkLnRvdGFsIDwgMztcblxuICAgICAgICAgICAgY29uc3QganVkZ2UgPSAoIGlzTmV3LCB0cmlwICkgPT4ge1xuICAgICAgICAgICAgICAgIGlmICggIXRyaXAgKSB7IHJldHVybiB0cnVlOyB9XG4gICAgICAgICAgICAgICAgaWYgKCBpc05ldyAmJiB0cmlwLnBheW1lbnQgPT09ICcwJyApIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG5cbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKCBpc05ldyAmJiB0cmlwLnBheW1lbnQgPT09ICcxJyApIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG5cbiAgICAgICAgICAgICAgICB9ICBlbHNlIGlmICggaXNOZXcgJiYgdHJpcC5wYXltZW50ID09PSAnMicgKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmICggIWlzTmV3ICYmIHRyaXAucGF5bWVudCA9PT0gJzAnICkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIH0gIGVsc2UgaWYgKCAhaXNOZXcgJiYgdHJpcC5wYXltZW50ID09PSAnMScgKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKCBpc05ldyAmJiB0cmlwLnBheW1lbnQgPT09ICcyJyApIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiBjdHguYm9keSA9IHtcbiAgICAgICAgICAgICAgICBzdGF0dXM6IDIwMCxcbiAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICAgIGlzTmV3LFxuICAgICAgICAgICAgICAgICAgICBzaG91bGRQcmVwYXk6IGp1ZGdlKCBpc05ldywgdHJpcCApXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgIH0gY2F0Y2ggKCBlICkgeyByZXR1cm4gY3R4LmJvZHkgPSB7IHN0YXR1czogNTAwIH07fVxuICAgIH0pXG5cbiAgICAvKipcbiAgICAgKiDlvq7kv6HmlK/ku5jvvIzov5Tlm57mlK/ku5hhcGnlv4XopoHlj4LmlbBcbiAgICAgKiAtLS0tLS0tLS0tLSDor7fmsYIgLS0tLS0tLS0tLVxuICAgICAqIHtcbiAgICAgKiAgICAgIHRvdGFsX2ZlZVxuICAgICAqIH1cbiAgICAgKi9cbiAgICBhcHAucm91dGVyKCd3eHBheScsIGFzeW5jKCBjdHgsIG5leHQgKSA9PiB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBjb25zdCB7IGtleSwgYm9keSwgbWNoX2lkLCBhdHRhY2gsIG5vdGlmeV91cmwsIHNwYmlsbF9jcmVhdGVfaXAgfSA9IENPTkZJRy53eFBheTtcbiAgICAgICAgICAgIGNvbnN0IGFwcGlkID0gQ09ORklHLmFwcC5pZDtcbiAgICAgICAgICAgIGNvbnN0IHRvdGFsX2ZlZSA9IGV2ZW50LmRhdGEudG90YWxfZmVlO1xuICAgICAgICAgICAgY29uc3Qgb3BlbmlkID0gZXZlbnQudXNlckluZm8ub3BlbklkO1xuICAgICAgICAgICAgY29uc3Qgbm9uY2Vfc3RyID0gTWF0aC5yYW5kb20oICkudG9TdHJpbmcoIDM2ICkuc3Vic3RyKCAyLCAxNSApO1xuICAgICAgICAgICAgY29uc3QgdGltZVN0YW1wID0gcGFyc2VJbnQoU3RyaW5nKCBEYXRlLm5vdygpIC8gMTAwMCApKSArICcnO1xuICAgICAgICAgICAgY29uc3Qgb3V0X3RyYWRlX25vID0gXCJvdG5cIiArIG5vbmNlX3N0ciArIHRpbWVTdGFtcDtcblxuICAgICAgICAgICAgY29uc3QgcGF5c2lnbiA9ICh7IC4uLmFyZ3MgfSkgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IHNhOiBhbnkgPSBbIF1cbiAgICAgICAgICAgICAgICBmb3IgKCBsZXQgayBpbiBhcmdzICkge1xuICAgICAgICAgICAgICAgICAgICBzYS5wdXNoKCBrICsgJz0nICsgYXJnc1sgayBdKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgc2EucHVzaCgna2V5PScgKyBrZXkgKTtcbiAgICAgICAgICAgICAgICBjb25zdCBzID0gIGNyeXB0by5jcmVhdGVIYXNoKCdtZDUnKS51cGRhdGUoc2Euam9pbignJicpLCAndXRmOCcpLmRpZ2VzdCgnaGV4Jyk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHMudG9VcHBlckNhc2UoICk7XG4gICAgICAgICAgICB9XG4gICAgXG4gICAgICAgICAgICBsZXQgZm9ybURhdGEgPSBcIjx4bWw+XCI7XG4gICAgXG4gICAgICAgICAgICBmb3JtRGF0YSArPSBcIjxhcHBpZD5cIiArIGFwcGlkICsgXCI8L2FwcGlkPlwiXG4gICAgICAgIFxuICAgICAgICAgICAgZm9ybURhdGEgKz0gXCI8YXR0YWNoPlwiICsgYXR0YWNoICsgXCI8L2F0dGFjaD5cIlxuICAgICAgICBcbiAgICAgICAgICAgIGZvcm1EYXRhICs9IFwiPGJvZHk+XCIgKyBib2R5ICsgXCI8L2JvZHk+XCJcbiAgICAgICAgXG4gICAgICAgICAgICBmb3JtRGF0YSArPSBcIjxtY2hfaWQ+XCIgKyBtY2hfaWQgKyBcIjwvbWNoX2lkPlwiXG4gICAgICAgIFxuICAgICAgICAgICAgZm9ybURhdGEgKz0gXCI8bm9uY2Vfc3RyPlwiICsgbm9uY2Vfc3RyICsgXCI8L25vbmNlX3N0cj5cIlxuICAgICAgICBcbiAgICAgICAgICAgIGZvcm1EYXRhICs9IFwiPG5vdGlmeV91cmw+XCIgKyBub3RpZnlfdXJsICsgXCI8L25vdGlmeV91cmw+XCJcbiAgICAgICAgXG4gICAgICAgICAgICBmb3JtRGF0YSArPSBcIjxvcGVuaWQ+XCIgKyBvcGVuaWQgKyBcIjwvb3BlbmlkPlwiXG4gICAgICAgIFxuICAgICAgICAgICAgZm9ybURhdGEgKz0gXCI8b3V0X3RyYWRlX25vPlwiICsgb3V0X3RyYWRlX25vICsgXCI8L291dF90cmFkZV9ubz5cIlxuICAgICAgICBcbiAgICAgICAgICAgIGZvcm1EYXRhICs9IFwiPHNwYmlsbF9jcmVhdGVfaXA+XCIgKyBzcGJpbGxfY3JlYXRlX2lwICsgXCI8L3NwYmlsbF9jcmVhdGVfaXA+XCJcbiAgICAgICAgXG4gICAgICAgICAgICBmb3JtRGF0YSArPSBcIjx0b3RhbF9mZWU+XCIgKyB0b3RhbF9mZWUgKyBcIjwvdG90YWxfZmVlPlwiXG4gICAgICAgIFxuICAgICAgICAgICAgZm9ybURhdGEgKz0gXCI8dHJhZGVfdHlwZT5KU0FQSTwvdHJhZGVfdHlwZT5cIlxuICAgICAgICBcbiAgICAgICAgICAgIGZvcm1EYXRhICs9IFwiPHNpZ24+XCIgKyBwYXlzaWduKHsgYXBwaWQsIGF0dGFjaCwgYm9keSwgbWNoX2lkLCBub25jZV9zdHIsIG5vdGlmeV91cmwsIG9wZW5pZCwgb3V0X3RyYWRlX25vLCBzcGJpbGxfY3JlYXRlX2lwLCB0b3RhbF9mZWUsIHRyYWRlX3R5cGU6ICdKU0FQSScgfSkgKyBcIjwvc2lnbj5cIlxuICAgICAgICBcbiAgICAgICAgICAgIGZvcm1EYXRhICs9IFwiPC94bWw+XCI7XG4gICAgXG4gICAgICAgICAgICBsZXQgcmVzID0gYXdhaXQgcnAoeyB1cmw6IFwiaHR0cHM6Ly9hcGkubWNoLndlaXhpbi5xcS5jb20vcGF5L3VuaWZpZWRvcmRlclwiLCBtZXRob2Q6ICdQT1NUJyxib2R5OiBmb3JtRGF0YSB9KTtcbiAgICBcbiAgICAgICAgICAgIGxldCB4bWwgPSByZXMudG9TdHJpbmcoXCJ1dGYtOFwiKTtcbiAgICAgICAgICBcbiAgICAgICAgICAgIGlmICggeG1sLmluZGV4T2YoJ3ByZXBheV9pZCcpIDwgMCApIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gY3R4LmJvZHkgPSB7XG4gICAgICAgICAgICAgICAgICAgIHN0YXR1czogNTAwXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY29uc29sZS5sb2coJ2VlZWVlJywgZm9ybURhdGEsIHhtbCApO1xuICAgICAgICAgICAgbGV0IHByZXBheV9pZCA9IHhtbC5zcGxpdChcIjxwcmVwYXlfaWQ+XCIpWzFdLnNwbGl0KFwiPC9wcmVwYXlfaWQ+XCIpWzBdLnNwbGl0KCdbJylbMl0uc3BsaXQoJ10nKVswXVxuICAgIFxuICAgICAgICAgICAgbGV0IHBheVNpZ24gPSBwYXlzaWduKHsgYXBwSWQ6IGFwcGlkLCBub25jZVN0cjogbm9uY2Vfc3RyLCBwYWNrYWdlOiAoJ3ByZXBheV9pZD0nICsgcHJlcGF5X2lkKSwgc2lnblR5cGU6ICdNRDUnLCB0aW1lU3RhbXA6IHRpbWVTdGFtcCB9KVxuICAgICAgICAgICAgXG4gICAgICAgICAgICByZXR1cm4gY3R4LmJvZHkgPSB7XG4gICAgICAgICAgICAgICAgc3RhdHVzOiAyMDAsXG4gICAgICAgICAgICAgICAgZGF0YTogeyBhcHBpZCwgbm9uY2Vfc3RyLCB0aW1lU3RhbXAsIHByZXBheV9pZCwgcGF5U2lnbiB9IFxuICAgICAgICAgICAgfTtcblxuICAgICAgICB9IGNhdGNoICggZSApIHtcbiAgICAgICAgICAgIHJldHVybiBjdHguYm9keSA9IHtcbiAgICAgICAgICAgICAgICBzdGF0dXM6IDUwMFxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICAvKipcbiAgICAgKiDku6PotK3kuKrkurrlvq7kv6Hkuoznu7TnoIHjgIHnvqTkuoznu7TnoIFcbiAgICAgKiAtLS0tLS0g6K+35rGCIC0tLS0tLVxuICAgICAqIHtcbiAgICAgKiAgICAgIHd4X3FyY29kZTogc3RyaW5nW11cbiAgICAgKiAgICAgIGdyb3VwX3FyY29kZTogc3RyaW5nW11cbiAgICAgKiB9XG4gICAgICovXG4gICAgYXBwLnJvdXRlcignd3hpbmZvLWVkaXQnLCBhc3luYyggY3R4LCBuZXh0ICkgPT4ge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgXG4gICAgICAgICAgICBjb25zdCB0ZW1wOiBhbnkgPSBbIF07XG4gICAgICAgICAgICBPYmplY3Qua2V5cyggZXZlbnQuZGF0YSApLm1hcCgga2V5ID0+IHtcbiAgICAgICAgICAgICAgICBpZiAoICEhZXZlbnQuZGF0YVsga2V5IF0pIHtcbiAgICAgICAgICAgICAgICAgICAgdGVtcC5wdXNoKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6IGtleSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlOiBldmVudC5kYXRhWyBrZXkgXVxuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBhd2FpdCBQcm9taXNlLmFsbCggdGVtcC5tYXAoIGFzeW5jIHggPT4ge1xuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIGNvbnN0IGZpbmQkID0gYXdhaXQgZGIuY29sbGVjdGlvbignbWFuYWdlci13eC1pbmZvJylcbiAgICAgICAgICAgICAgICAgICAgLndoZXJlKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6IHgudHlwZVxuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAuZ2V0KCApO1xuXG4gICAgICAgICAgICAgICAgaWYgKCBmaW5kJC5kYXRhLmxlbmd0aCA+IDAgKSB7XG4gICAgICAgICAgICAgICAgICAgIGF3YWl0IGRiLmNvbGxlY3Rpb24oJ21hbmFnZXItd3gtaW5mbycpLmRvYyggKGZpbmQkLmRhdGFbIDAgXSBhcyBhbnkpLl9pZCApXG4gICAgICAgICAgICAgICAgICAgICAgICAuc2V0KHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhOiB4XG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgYXdhaXQgZGIuY29sbGVjdGlvbignbWFuYWdlci13eC1pbmZvJylcbiAgICAgICAgICAgICAgICAgICAgICAgIC5hZGQoe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGE6IHhcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgfSkpO1xuXG4gICAgICAgICAgICByZXR1cm4gY3R4LmJvZHkgPSB7XG4gICAgICAgICAgICAgICAgc3RhdHVzOiAyMDBcbiAgICAgICAgICAgIH1cblxuICAgICAgICB9IGNhdGNoICggZSApIHtcbiAgICAgICAgICAgIHJldHVybiBjdHguYm9keSA9IHsgc3RhdHVzOiA1MDAgfTtcbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgLyoqXG4gICAgICogQGRlc2NyaXB0aW9uXG4gICAgICog5p+l6K+i5Luj6LSt5Liq5Lq65LqM57u056CB5L+h5oGvXG4gICAgICovXG4gICAgYXBwLnJvdXRlcignd3hpbmZvJywgYXN5bmMoIGN0eCwgbmV4dCApID0+IHtcbiAgICAgICAgdHJ5IHtcblxuICAgICAgICAgICAgY29uc3QgdGFyZ2V0ID0gWyd3eF9xcmNvZGUnLCAnZ3JvdXBfcXJjb2RlJ107XG4gICAgICAgICAgICBjb25zdCBmaW5kcyQgPSBhd2FpdCBQcm9taXNlLmFsbCggdGFyZ2V0Lm1hcCggdHlwZSA9PiB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGRiLmNvbGxlY3Rpb24oJ21hbmFnZXItd3gtaW5mbycpXG4gICAgICAgICAgICAgICAgICAgIC53aGVyZSh7XG4gICAgICAgICAgICAgICAgICAgICAgICB0eXBlXG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgIC5nZXQoICk7XG4gICAgICAgICAgICB9KSk7XG5cbiAgICAgICAgICAgIGNvbnN0IHRlbXAgPSB7IH07XG4gICAgICAgICAgICBmaW5kcyQubWFwKCggZmluZCQsIGluZGV4ICkgPT4ge1xuICAgICAgICAgICAgICAgIGlmICggZmluZCQuZGF0YS5sZW5ndGggPiAwICkge1xuICAgICAgICAgICAgICAgICAgICB0ZW1wWyB0YXJnZXRbIGluZGV4IF1dID0gZmluZCQuZGF0YVsgMCBdLnZhbHVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICByZXR1cm4gY3R4LmJvZHkgPSB7XG4gICAgICAgICAgICAgICAgc3RhdHVzOiAyMDAsXG4gICAgICAgICAgICAgICAgZGF0YTogdGVtcFxuICAgICAgICAgICAgfVxuXG4gICAgICAgIH0gY2F0Y2ggKCBlICkge1xuICAgICAgICAgICAgcmV0dXJuIGN0eC5ib2R5ID0geyBzdGF0dXM6IDUwMCB9O1xuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICAvKiogXG4gICAgICogQGRlc2NyaXB0aW9uXG4gICAgICog6I635Y+W4oCc5oiR55qE6aG16Z2i4oCd55qE5Z+65pys5L+h5oGv77yM6K+45aaC6K6i5Y2V44CB5Y2h5Yi45pWw6YePXG4gICAgICovXG4gICAgYXBwLnJvdXRlcignbXlwYWdlLWluZm8nLCBhc3luYyggY3R4LCBuZXh0ICkgPT4ge1xuICAgICAgICB0cnkge1xuXG4gICAgICAgICAgICBsZXQgY291cG9ucyA9IDA7XG4gICAgICAgICAgICBjb25zdCB0cmlwcyQgPSBhd2FpdCBjbG91ZC5jYWxsRnVuY3Rpb24oe1xuICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgJHVybDogJ2VudGVyJ1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgbmFtZTogJ3RyaXAnXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGNvbnN0IHRyaXBzID0gdHJpcHMkLnJlc3VsdC5kYXRhO1xuICAgICAgICAgICAgY29uc3QgdHJpcCA9IHRyaXBzWyAwIF07XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIC8vIOiuouWNleaVsFxuICAgICAgICAgICAgY29uc3Qgb3JkZXJzJCA9IGF3YWl0IGRiLmNvbGxlY3Rpb24oJ29yZGVyJylcbiAgICAgICAgICAgICAgICAud2hlcmUoe1xuICAgICAgICAgICAgICAgICAgICBvcGVuaWQ6IGV2ZW50LnVzZXJJbmZvLm9wZW5JZCxcbiAgICAgICAgICAgICAgICAgICAgYmFzZV9zdGF0dXM6IF8ubmVxKCc1JylcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIC5jb3VudCggKTtcblxuICAgICAgICAgICAgaWYgKCAhIXRyaXAgKSB7XG4gICAgICAgICAgICAgICAgLy8g5Y2h5Yi45pWwKCDov4fmu6Tmjonlj6rlianlvZPliY3nmoR0cmlw5Y2h5Yi4IClcbiAgICAgICAgICAgICAgICBjb25zdCBjb3Vwb25zJCA9IGF3YWl0IGRiLmNvbGxlY3Rpb24oJ2NvdXBvbicpXG4gICAgICAgICAgICAgICAgICAgIC53aGVyZSh7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aWQ6IHRyaXAuX2lkLFxuICAgICAgICAgICAgICAgICAgICAgICAgb3BlbmlkOiBldmVudC51c2VySW5mby5vcGVuSWRcbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgLmNvdW50KCApO1xuICAgICAgICAgICAgICAgIGNvdXBvbnMgPSBjb3Vwb25zJC50b3RhbDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIFxuICAgICAgICAgICAgcmV0dXJuIGN0eC5ib2R5ID0ge1xuICAgICAgICAgICAgICAgIHN0YXR1czogMjAwLFxuICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgY291cG9ucyxcbiAgICAgICAgICAgICAgICAgICAgb3JkZXJzOiBvcmRlcnMkLnRvdGFsXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgIH0gY2F0Y2ggKCBlICkgeyByZXR1cm4gY3R4LmJvZHkgPSB7IHN0YXR1czogNTAwIH07fVxuICAgIH0pO1xuXG4gICAgLyoqIFxuICAgICAqIEBkZXNjcmlwdGlvblxuICAgICAqIOihjOeoi+S4i++8jOWPguWKoOS6hui0reS5sOeahOWuouaIt++8iOiuouWNle+8iVxuICAgICAqIHsgXG4gICAgICogICAgdGlkXG4gICAgICogfVxuICAgICAqL1xuICAgIGFwcC5yb3V0ZXIoJ2N1c3RvbWVyLWluLXRyaXAnLCBhc3luYyggY3R4LCBuZXh0ICkgPT4ge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgY29uc3QgbGltaXQgPSAxMDA7XG4gICAgICAgICAgICBjb25zdCBhbGxPcmRlclVzZXJzJCA9IGF3YWl0IGRiLmNvbGxlY3Rpb24oJ29yZGVyJylcbiAgICAgICAgICAgICAgICAud2hlcmUoe1xuICAgICAgICAgICAgICAgICAgICB0aWQ6IGV2ZW50LmRhdGEudGlkXG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAub3JkZXJCeSgnY3JlYXRlVGltZScsICdkZXNjJylcbiAgICAgICAgICAgICAgICAubGltaXQoIGxpbWl0IClcbiAgICAgICAgICAgICAgICAuZmllbGQoe1xuICAgICAgICAgICAgICAgICAgICBvcGVuaWQ6IHRydWVcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIC5nZXQoICk7XG5cbiAgICAgICAgICAgIGNvbnN0IG9wZW5pZHMgPSBBcnJheS5mcm9tKCBuZXcgU2V0KCBhbGxPcmRlclVzZXJzJC5kYXRhLm1hcCggeCA9PiB4Lm9wZW5pZCApKSk7XG5cbiAgICAgICAgICAgIGNvbnN0IGF2YXRhdHMkID0gYXdhaXQgUHJvbWlzZS5hbGwoIG9wZW5pZHMubWFwKCBvaWQgPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiBkYi5jb2xsZWN0aW9uKCd1c2VyJylcbiAgICAgICAgICAgICAgICAgICAgLndoZXJlKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG9wZW5pZDogb2lkXG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgIC5maWVsZCh7XG4gICAgICAgICAgICAgICAgICAgICAgICBhdmF0YXJVcmw6IHRydWVcbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgLmdldCggKTtcbiAgICAgICAgICAgIH0pKVxuICAgICAgICAgICAgXG4gICAgICAgICAgICByZXR1cm4gY3R4LmJvZHkgPSB7XG4gICAgICAgICAgICAgICAgc3RhdHVzOiAyMDAsXG4gICAgICAgICAgICAgICAgZGF0YTogYXZhdGF0cyQubWFwKCB4ID0+IHguZGF0YVsgMCBdLmF2YXRhclVybCApXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfSBjYXRjaCAoIGUgKSB7XG4gICAgICAgICAgICByZXR1cm4gY3R4LmJvZHkgPSB7IHN0YXR1czogNTAwIH07XG4gICAgICAgIH1cbiAgICB9KVxuXG4gICAgLyoqXG4gICAgICog5raI5oGv5o6o6YCBIC0g5YKs5qy+XG4gICAgICoge1xuICAgICAqICAgICB0b3VzZXIgKCBvcGVuaWQgKVxuICAgICAqICAgICBmb3JtX2lkXG4gICAgICogICAgIHBhZ2U/OiBzdHJpbmdcbiAgICAgKiAgICAgZGF0YTogeyBcbiAgICAgKiAgICAgICAgIFxuICAgICAqICAgICB9XG4gICAgICogfVxuICAgICAqL1xuICAgIGFwcC5yb3V0ZXIoJ25vdGlmaWNhdGlvbi1nZXRtb25leScsIGFzeW5jKCBjdHgsIG5leHQgKSA9PiB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGNvbnN0IHBhZ2UgPSBldmVudC5kYXRhLnBhZ2UgfHwgJ3BhZ2VzL29yZGVyLWxpc3QvaW5kZXgnO1xuICAgICAgICAgICAgY29uc3QgeyB0b3VzZXIsIGZvcm1faWQsIGRhdGEsIHByZXBheV9pZCB9ID0gZXZlbnQuZGF0YTtcblxuICAgICAgICAgICAgLy8g6I635Y+WdG9rZW5cbiAgICAgICAgICAgIGNvbnN0IHJlc3VsdCA9IGF3YWl0IChheGlvcyBhcyBhbnkpKHtcbiAgICAgICAgICAgICAgICBtZXRob2Q6ICdnZXQnLFxuICAgICAgICAgICAgICAgIHVybDogYGh0dHBzOi8vYXBpLndlaXhpbi5xcS5jb20vY2dpLWJpbi90b2tlbj9ncmFudF90eXBlPWNsaWVudF9jcmVkZW50aWFsJmFwcGlkPSR7Q09ORklHLmFwcC5pZH0mc2VjcmV0PSR7Q09ORklHLmFwcC5zZWNyZWN0fWBcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICBjb25zdCB7IGFjY2Vzc190b2tlbiwgZXJyY29kZSB9ID0gcmVzdWx0LmRhdGE7XG5cbiAgICAgICAgICAgIGlmICggZXJyY29kZSApIHtcbiAgICAgICAgICAgICAgICB0aHJvdyAn55Sf5oiQYWNjZXNzX3Rva2Vu6ZSZ6K+vJ1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBjb25zdCByZXFEYXRhID0geyB9O1xuICAgICAgICAgICAgY29uc3QgcmVxRGF0YSQgPSB7XG4gICAgICAgICAgICAgICAgcGFnZSxcbiAgICAgICAgICAgICAgICB0b3VzZXIsXG4gICAgICAgICAgICAgICAgcHJlcGF5X2lkLFxuICAgICAgICAgICAgICAgIGZvcm1faWQsXG4gICAgICAgICAgICAgICAgdGVtcGxhdGVfaWQ6IENPTkZJRy5ub3RpZmljYXRpb25fdGVtcGxhdGUuZ2V0TW9uZXkzLFxuICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgLy8g6LSt5Lmw5pe26Ze0XG4gICAgICAgICAgICAgICAgICAgIFwia2V5d29yZDFcIjoge1xuICAgICAgICAgICAgICAgICAgICAgICAgXCJ2YWx1ZVwiOiBkYXRhLnRpdGxlXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIC8vIOiuouWNleaAu+S7t1xuICAgICAgICAgICAgICAgICAgICBcImtleXdvcmQyXCI6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIFwidmFsdWVcIjogZGF0YS50aW1lXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICBPYmplY3Qua2V5cyggcmVxRGF0YSQgKS5tYXAoIGtleSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKCAhIXJlcURhdGEkWyBrZXkgXSkge1xuICAgICAgICAgICAgICAgICAgICByZXFEYXRhWyBrZXkgXSA9IHJlcURhdGEkWyBrZXkgXTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgLy8g5Y+R6YCB5o6o6YCBXG4gICAgICAgICAgICBjb25zdCBzZW5kID0gYXdhaXQgKGF4aW9zIGFzIGFueSkoe1xuICAgICAgICAgICAgICAgIGRhdGE6IHJlcURhdGEsXG4gICAgICAgICAgICAgICAgbWV0aG9kOiAncG9zdCcsXG4gICAgICAgICAgICAgICAgdXJsOiBgaHR0cHM6Ly9hcGkud2VpeGluLnFxLmNvbS9jZ2ktYmluL21lc3NhZ2Uvd3hvcGVuL3RlbXBsYXRlL3NlbmQ/YWNjZXNzX3Rva2VuPSR7YWNjZXNzX3Rva2VufWBcbiAgICAgICAgICAgIH0pO1xuICAgICAgICBcbiAgICAgICAgICAgIHJldHVybiBjdHguYm9keSA9IHtcbiAgICAgICAgICAgICAgICBkYXRhOiBzZW5kLmRhdGEsXG4gICAgICAgICAgICAgICAgc3RhdHVzOiAyMDBcbiAgICAgICAgICAgIH1cblxuICAgICAgICB9IGNhdGNoICggZSApIHtcbiAgICAgICAgICAgIHJldHVybiBjdHguYm9keSA9IHsgbWVzc2FnZTogZSwgc3RhdHVzOiA1MDAgfVxuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICAvKipcbiAgICAgKiBAZGVzY3JpcHRpb25cbiAgICAgKiDpgJrov4fliqDop6Plr4blrqLmnI3nu5nnmoTlr4bnoIHvvIzmnaXlop7liqDmnYPpmZDjgIHliJ3lp4vljJbmlbDmja7lupNcbiAgICAgKi9cbiAgICBhcHAucm91dGVyKCdhZGQtYXV0aC1ieS1wc3cnLCBhc3luYyggY3R4LCBuZXh0ICkgPT4ge1xuICAgICAgICB0cnkge1xuXG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIGF3YWl0IChkYiBhcyBhbnkpLmNyZWF0ZUNvbGxlY3Rpb24oJ21hbmFnZXItbWVtYmVyJyk7XG4gICAgICAgICAgICAgICAgYXdhaXQgKGRiIGFzIGFueSkuY3JlYXRlQ29sbGVjdGlvbignYXV0aHBzdycpO1xuICAgICAgICAgICAgfSBjYXRjaCAoIGUgKSB7IH1cblxuICAgICAgICAgICAgbGV0IHJlc3VsdCA9ICcnO1xuICAgICAgICAgICAgY29uc3QgeyBzYWx0IH0gPSBDT05GSUcuYXV0aDtcbiAgICAgICAgICAgIGNvbnN0IG9wZW5pZCA9IGV2ZW50LnVzZXJJbmZvLm9wZW5JZDtcbiAgICAgICAgICAgIGNvbnN0IHsgcHN3LCBjb250ZW50IH0gPSBldmVudC5kYXRhO1xuXG4gICAgICAgICAgICBjb25zdCBnZXRFcnIgPSBtZXNzYWdlID0+ICh7XG4gICAgICAgICAgICAgICAgbWVzc2FnZSxcbiAgICAgICAgICAgICAgICBzdGF0dXM6IDUwMCxcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIGNvbnN0IGRlY2lwaGVyID0gY3J5cHRvLmNyZWF0ZURlY2lwaGVyKCdhZXMxOTInLCBzYWx0ICk7XG4gICAgICAgICAgICAgICAgY29uc3QgZGVjcnlwdGVkID0gZGVjaXBoZXIudXBkYXRlKCBwc3csICdoZXgnLCAndXRmOCcgKTtcbiAgICAgICAgICAgICAgICByZXN1bHQgPSBkZWNyeXB0ZWQgKyBkZWNpcGhlci5maW5hbCgndXRmOCcpO1xuICAgICAgICAgICAgfSBjYXRjaCAoIGUgKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGN0eC5ib2R5ID0gZ2V0RXJyKCflr4bpkqXplJnor6/vvIzor7fmoLjlr7knKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIFxuICAgICAgICAgICAgY29uc3QgWyBjX3RpbWVzdGFtcCwgY19hcHBpZCwgY19jb250ZW50LCBjX21heCBdID0gcmVzdWx0LnNwbGl0KCctJyk7XG5cbiAgICAgICAgICAgIGlmICggbmV3IERhdGUoICkuZ2V0VGltZSggKSAtIE51bWJlciggY190aW1lc3RhbXAgKSA+IDMwICogNjAgKiAxMDAwICkge1xuICAgICAgICAgICAgICAgIHJldHVybiBjdHguYm9keSA9IGdldEVycign5a+G6ZKl5bey6L+H5pyf77yM6K+36IGU57O75a6i5pyNJyk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICggY19hcHBpZCAhPT0gQ09ORklHLmFwcC5pZCApIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gY3R4LmJvZHkgPSBnZXRFcnIoJ+WvhumSpeS4juWwj+eoi+W6j+S4jeWFs+iBlCcpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoIGNfY29udGVudC5yZXBsYWNlKC9cXHMrL2csICcnKSAhPT0gY29udGVudC5yZXBsYWNlKC9cXHMrL2csICcnKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBjdHguYm9keSA9IGdldEVycign5o+Q56S66K+N6ZSZ6K+v77yM6K+36IGU57O75a6i5pyNJyk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogYXV0aHBzdyDooahcbiAgICAgICAgICAgICAqIFxuICAgICAgICAgICAgICoge1xuICAgICAgICAgICAgICogICAgYXBwSWQsXG4gICAgICAgICAgICAgKiAgICB0aW1lc3RhbXAsXG4gICAgICAgICAgICAgKiAgICBjb3VudFxuICAgICAgICAgICAgICogfVxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICBjb25zdCBjaGVjayQgPSBhd2FpdCBkYi5jb2xsZWN0aW9uKCdhdXRocHN3JykgXG4gICAgICAgICAgICAgICAgLndoZXJlKHtcbiAgICAgICAgICAgICAgICAgICAgYXBwSWQ6IGNfYXBwaWQsXG4gICAgICAgICAgICAgICAgICAgIHRpbWVzdGFtcDogY190aW1lc3RhbXBcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIC5nZXQoICk7XG4gICAgICAgICAgICBjb25zdCB0YXJnZXQgPSBjaGVjayQuZGF0YVsgMCBdO1xuXG4gICAgICAgICAgICAvLyDlr4bpkqXlt7Looqvkvb/nlKhcbiAgICAgICAgICAgIGlmICggISF0YXJnZXQgKSB7XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgLy8g5qyh5pWw5LiN6IO95aSa5LqOMlxuICAgICAgICAgICAgICAgIGlmICggdGFyZ2V0LmNvdW50ID49IDIgKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBjdHguYm9keSA9IGdldEVycign5a+G6ZKl5bey6KKr5L2/55So77yM6K+36IGU57O75a6i5pyNJyk7XG5cbiAgICAgICAgICAgICAgICAvLyDmm7TmlrDlr4bpkqXkv6Hmga9cbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBhd2FpdCBkYi5jb2xsZWN0aW9uKCdhdXRocHN3JylcbiAgICAgICAgICAgICAgICAgICAgICAgIC5kb2MoIFN0cmluZyggdGFyZ2V0Ll9pZCApKVxuICAgICAgICAgICAgICAgICAgICAgICAgLnVwZGF0ZSh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb3VudDogXy5pbmMoIDEgKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIOWIm+W7uuWvhumSpeS/oeaBr1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBhd2FpdCBkYi5jb2xsZWN0aW9uKCdhdXRocHN3JylcbiAgICAgICAgICAgICAgICAgICAgLmFkZCh7XG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY291bnQ6IDEsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYXBwSWQ6IGNfYXBwaWQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGltZXN0YW1wOiBjX3RpbWVzdGFtcFxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyDmiorlvZPliY3kurrvvIzliqDlhaXliLDnrqHnkIblkZhcbiAgICAgICAgICAgIGNvbnN0IGNoZWNrTWFuYWdlciQgPSBhd2FpdCBkYi5jb2xsZWN0aW9uKCdtYW5hZ2VyLW1lbWJlcicpXG4gICAgICAgICAgICAgICAgLndoZXJlKHtcbiAgICAgICAgICAgICAgICAgICAgb3BlbmlkXG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAuZ2V0KCApO1xuICAgICAgICAgICAgY29uc3QgdGFyZ2V0TWFuYWdlciA9IGNoZWNrTWFuYWdlciQuZGF0YVsgMCBdO1xuXG4gICAgICAgICAgICBpZiAoICF0YXJnZXRNYW5hZ2VyICkge1xuICAgICAgICAgICAgICAgIGF3YWl0IGRiLmNvbGxlY3Rpb24oJ21hbmFnZXItbWVtYmVyJylcbiAgICAgICAgICAgICAgICAgICAgLmFkZCh7XG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb3BlbmlkLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRlbnQ6IGNfY29udGVudCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjcmVhdGVUaW1lOiBuZXcgRGF0ZSggKS5nZXRUaW1lKCApXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIOWIneWni+WMluWQhOS4quihqFxuICAgICAgICAgICAgYXdhaXQgaW5pdERCKCApO1xuXG4gICAgICAgICAgICByZXR1cm4gY3R4LmJvZHkgPSB7XG4gICAgICAgICAgICAgICAgc3RhdHVzOiAyMDBcbiAgICAgICAgICAgIH1cblxuICAgICAgICB9IGNhdGNoICggZSApIHtcbiAgICAgICAgICAgIHJldHVybiBjdHguYm9keSA9IHtcbiAgICAgICAgICAgICAgICBzdGF0dXM6IDUwMCxcbiAgICAgICAgICAgICAgICBtZXNzYWdlOiAn5a+G6ZKl5qOA5p+l5Y+R55Sf6ZSZ6K+vJ1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICAvKipcbiAgICAgKiBAZGVzY3JpcHRpb25cbiAgICAgKiDmn6Xor6LlupTnlKjphY3nva5cbiAgICAgKi9cbiAgICBhcHAucm91dGVyKCdjaGVjay1hcHAtY29uZmlnJywgYXN5bmMoIGN0eCwgbmV4dCApID0+IHtcbiAgICAgICAgdHJ5IHtcblxuICAgICAgICAgICAgbGV0IGNvbmZpZ09iaiA9IHsgfTtcbiAgICAgICAgICAgIGNvbnN0IGNvbmZpZyQgPSBhd2FpdCBkYi5jb2xsZWN0aW9uKCdhcHAtY29uZmlnJylcbiAgICAgICAgICAgICAgICAud2hlcmUoeyB9KVxuICAgICAgICAgICAgICAgIC5nZXQoICk7XG5cbiAgICAgICAgICAgIGNvbnN0IG1ldGEgPSBjb25maWckLmRhdGEubWFwKCBjb25mID0+IHtcbiAgICAgICAgICAgICAgICBjb25maWdPYmogPSBPYmplY3QuYXNzaWduKHsgfSwgY29uZmlnT2JqLCB7XG4gICAgICAgICAgICAgICAgICAgIFsgY29uZi50eXBlIF06IGNvbmYudmFsdWVcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHJldHVybiBjdHguYm9keSA9IHtcbiAgICAgICAgICAgICAgICBkYXRhOiBjb25maWdPYmosXG4gICAgICAgICAgICAgICAgc3RhdHVzOiAyMDBcbiAgICAgICAgICAgIH1cblxuICAgICAgICB9IGNhdGNoICggZSApIHtcbiAgICAgICAgICAgIHJldHVybiBjdHguYm9keSA9IHtcbiAgICAgICAgICAgICAgICBzdGF0dXM6IDUwMFxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICAvKipcbiAgICAgKiBAZGVzY3JpcHRpb25cbiAgICAgKiDmm7TmlrDlupTnlKjphY3nva5cbiAgICAgKiAtLS0tLS0tLS0tLS0tLVxuICAgICAqIGNvbmZpZ3M6IHtcbiAgICAgKiAgICBbIGtleTogc3RyaW5nIF06IGFueSBcbiAgICAgKiB9XG4gICAgICovXG4gICAgYXBwLnJvdXRlcigndXBkYXRlLWFwcC1jb25maWcnLCBhc3luYyggY3R4LCBuZXh0ICkgPT4ge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgY29uc3QgeyBjb25maWdzIH0gPSBldmVudC5kYXRhO1xuXG4gICAgICAgICAgICBhd2FpdCBQcm9taXNlLmFsbChcbiAgICAgICAgICAgICAgICBPYmplY3Qua2V5cyggY29uZmlncyApXG4gICAgICAgICAgICAgICAgICAgIC5tYXAoIGFzeW5jIGNvbmZpZ0tleSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCB0YXJnZXQkID0gYXdhaXQgZGIuY29sbGVjdGlvbignYXBwLWNvbmZpZycpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLndoZXJlKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogY29uZmlnS2V5XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAuZ2V0KCApXG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICggIXRhcmdldCQuZGF0YVsgMCBdKSB7IHJldHVybjsgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICBhd2FpdCBkYi5jb2xsZWN0aW9uKCdhcHAtY29uZmlnJylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAuZG9jKCBTdHJpbmcoIHRhcmdldCQuZGF0YVsgMCBdLl9pZCApKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC51cGRhdGUoe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZTogY29uZmlnc1sgY29uZmlnS2V5IF1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICApO1xuXG4gICAgICAgICAgICByZXR1cm4gY3R4LmJvZHkgPSB7XG4gICAgICAgICAgICAgICAgc3RhdHVzOiAyMDBcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBjYXRjaCAoIGUgKSB7XG4gICAgICAgICAgICByZXR1cm4gY3R4LmJvZHkgPSB7XG4gICAgICAgICAgICAgICAgc3RhdHVzOiA1MDBcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0pXG5cbiAgICAvKiogXG4gICAgICogQGRlc2NyaXB0aW9uXG4gICAgICog55Sf5oiQ5LqM57u056CBXG4gICAgICoge1xuICAgICAqICAgICBwYWdlXG4gICAgICogICAgIHNjZW5lXG4gICAgICogfVxuICAgICAqL1xuICAgIGFwcC5yb3V0ZXIoJ2NyZWF0ZS1xcmNvZGUnLCBhc3luYyggY3R4LCBuZXh0ICkgPT4ge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgY29uc3QgeyBwYWdlLCBzY2VuZSB9ID0gZXZlbnQuZGF0YTtcbiAgICAgICAgICAgIGNvbnN0IHJlc3VsdCA9IGF3YWl0IGNsb3VkLm9wZW5hcGkud3hhY29kZS5nZXRVbmxpbWl0ZWQoe1xuICAgICAgICAgICAgICAgIHBhZ2UsXG4gICAgICAgICAgICAgICAgc2NlbmU6IHNjZW5lIHx8ICcnXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgaWYgKCByZXN1bHQuZXJyQ29kZSAhPT0gMCApIHtcbiAgICAgICAgICAgICAgICB0aHJvdyByZXN1bHQuZXJyTXNnXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiBjdHguYm9keSA9IHtcbiAgICAgICAgICAgICAgICBzdGF0dXM6IDIwMCxcbiAgICAgICAgICAgICAgICBkYXRhOiByZXN1bHQuYnVmZmVyXG4gICAgICAgICAgICB9XG4gICAgICAgIH0gY2F0Y2ggKCBlICkge1xuICAgICAgICAgICAgcmV0dXJuIGN0eC5ib2R5ID0ge1xuICAgICAgICAgICAgICAgIHN0YXR1czogNTAwLFxuICAgICAgICAgICAgICAgIG1lc3NhZ2U6IHR5cGVvZiBlID09PSAnc3RyaW5nJyA/IGUgOiBKU09OLnN0cmluZ2lmeSggZSApXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgIC8qKiBcbiAgICAgKiBAZGVzY3JpcHRpb25cbiAgICAgKiDliJvlu7rkuIDkuKpmb3JtLWlkXG4gICAgICoge1xuICAgICAqICAgICBmb3JtaWRcbiAgICAgKiB9XG4gICAgICogZm9ybS1pZHM6IHtcbiAgICAgKiAgICAgIG9wZW5pZCxcbiAgICAgKiAgICAgIGZvcm1pZCxcbiAgICAgKiAgICAgIGNyZWF0ZVRpbWUsXG4gICAgICogICAgICB0eXBlOiAnbWFuYWdlcicgfCAnbm9ybWFsJ1xuICAgICAqIH1cbiAgICAgKi9cbiAgICBhcHAucm91dGVyKCdjcmVhdGUtZm9ybWlkJywgYXN5bmMoIGN0eCwgbmV4dCApID0+IHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGNvbnN0IG9wZW5pZCA9IGV2ZW50LnVzZXJJbmZvLm9wZW5JZDtcbiAgICAgICAgICAgIGNvbnN0IHsgZm9ybWlkIH0gPSBldmVudC5kYXRhOyBcbiAgICAgICAgICAgIGNvbnN0IGZpbmQkID0gYXdhaXQgZGIuY29sbGVjdGlvbignbWFuYWdlci1tZW1iZXInKVxuICAgICAgICAgICAgICAgIC53aGVyZSh7XG4gICAgICAgICAgICAgICAgICAgIG9wZW5pZCxcbiAgICAgICAgICAgICAgICAgICAgY3JlYXRlVGltZTogbmV3IERhdGUoICkuZ2V0VGltZSggKVxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLmNvdW50KCApO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICBjb25zdCBjcmVhdGUkID0gYXdhaXQgZGIuY29sbGVjdGlvbignZm9ybS1pZHMnKVxuICAgICAgICAgICAgICAgIC5hZGQoe1xuICAgICAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBvcGVuaWQsXG4gICAgICAgICAgICAgICAgICAgICAgICBmb3JtaWQsXG4gICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiBmaW5kJC50b3RhbCA+IDAgPyAnbWFuYWdlcicgOiAnbm9ybWFsJ1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBjdHguYm9keSA9IHtcbiAgICAgICAgICAgICAgICBzdGF0dXM6IDIwMFxuICAgICAgICAgICAgfVxuICAgICAgICB9IGNhdGNoICggZSApIHtcbiAgICAgICAgICAgIGN0eC5ib2R5ID0ge1xuICAgICAgICAgICAgICAgIHN0YXR1czogMjAwXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgIHJldHVybiBhcHAuc2VydmUoICk7XG5cbn1cblxuY29uc3QgdGltZSA9IHRzID0+IG5ldyBQcm9taXNlKCByZXNvdmxlID0+IHtcbiAgICBzZXRUaW1lb3V0KCggKSA9PiByZXNvdmxlKCApLCB0cyApO1xufSlcblxuLyoqXG4gKiDliJ3lp4vljJbmlbDmja7lupPjgIHln7rnoYDmlbDmja5cbiAqL1xuY29uc3QgaW5pdERCID0gKCApID0+IG5ldyBQcm9taXNlKCBhc3luYyByZXNvbHZlID0+IHtcbiAgICB0cnkge1xuXG4gICAgICAgIC8qKiDliJ3lp4vljJbooaggKi9cbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGNvbnN0IGNvbGxlY3Rpb25zID0gQ09ORklHLmNvbGxlY3Rpb25zO1xuICAgICAgICAgICAgYXdhaXQgUHJvbWlzZS5hbGwoXG4gICAgICAgICAgICAgICAgY29sbGVjdGlvbnMubWFwKCBjb2xsZWN0aW9uTmFtZSA9PiAoZGIgYXMgYW55KS5jcmVhdGVDb2xsZWN0aW9uKCBjb2xsZWN0aW9uTmFtZSApKVxuICAgICAgICAgICAgKTtcbiAgICAgICAgfSBjYXRjaCAoIGUgKSB7IH1cblxuICAgICAgICBhd2FpdCB0aW1lKCA4MDAgKTtcblxuICAgICAgICAvKiog5Yid5aeL5YyW5pWw5o2u5a2X5YW4ICovXG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBjb25zdCBkaWNzID0gQ09ORklHLmRpYztcbiAgICAgICAgICAgIGF3YWl0IFByb21pc2UuYWxsKFxuICAgICAgICAgICAgICAgIGRpY3MubWFwKCBhc3luYyBkaWNTZXQgPT4ge1xuXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHRhcmdldERpYyQgPSBhd2FpdCBkYi5jb2xsZWN0aW9uKCdkaWMnKVxuICAgICAgICAgICAgICAgICAgICAgICAgLndoZXJlKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBiZWxvbmc6IGRpY1NldC5iZWxvbmdcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgICAgICAuZ2V0KCApO1xuXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHRhcmdldERpYyA9IHRhcmdldERpYyQuZGF0YVsgMCBdO1xuICAgICAgICAgICAgICAgICAgICBpZiAoICEhdGFyZ2V0RGljICkge1xuICAgICAgICAgICAgICAgICAgICAgICAgYXdhaXQgZGIuY29sbGVjdGlvbignZGljJylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAuZG9jKCBTdHJpbmcoIHRhcmdldERpYy5faWQgKSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAuc2V0KHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YTogZGljU2V0XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGF3YWl0IGRiLmNvbGxlY3Rpb24oJ2RpYycpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLmFkZCh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGE6IGRpY1NldFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICk7XG4gICAgICAgIH0gY2F0Y2ggKCBlICkge1xuICAgICAgICAgICAgY29uc29sZS5sb2coJ2VlZScsIGUgKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8qKiDliJ3lp4vljJblupTnlKjphY3nva4gKi9cbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGNvbnN0IGFwcENvbmYgPSBDT05GSUcuYXBwQ29uZnM7XG4gICAgICAgICAgICBhd2FpdCBQcm9taXNlLmFsbChcbiAgICAgICAgICAgICAgICBhcHBDb25mLm1hcCggYXN5bmMgY29uZiA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHRhcmdldENvbmYkID0gYXdhaXQgZGIuY29sbGVjdGlvbignYXBwLWNvbmZpZycpXG4gICAgICAgICAgICAgICAgICAgICAgICAud2hlcmUoe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6IGNvbmYudHlwZVxuICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgICAgIC5nZXQoICk7XG5cbiAgICAgICAgICAgICAgICAgICAgY29uc3QgdGFyZ2V0Q29uZiA9IHRhcmdldENvbmYkLmRhdGFbIDAgXTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCAhIXRhcmdldENvbmYgKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyDnlLHkuo7phY3nva7lt7Lnu4/nlJ/mlYjkuJTmipXlhaXkvb/nlKjvvIzov5nph4zkuI3og73nm7TmjqXmm7TmlLnlt7LmnInnmoTnur/kuIrphY3nva5cbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGF3YWl0IGRiLmNvbGxlY3Rpb24oJ2FwcC1jb25maWcnKVxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gICAgIC5kb2MoIFN0cmluZyggdGFyZ2V0Q29uZi5faWQgKSlcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vICAgICAuc2V0KHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vICAgICAgICAgZGF0YTogY29uZlxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBhd2FpdCBkYi5jb2xsZWN0aW9uKCdhcHAtY29uZmlnJylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAuYWRkKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YTogY29uZlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICk7XG4gICAgICAgIH0gY2F0Y2ggKCBlICkge1xuICAgICAgICAgICAgY29uc29sZS5sb2coJ2VlZScsIGUgKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJlc29sdmUoICk7XG5cbiAgICB9IGNhdGNoICggZSApIHsgcmVzb2x2ZSggKTt9XG59KTsiXX0=