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
var getNow = function (ts) {
    if (ts === void 0) { ts = false; }
    if (ts) {
        return Date.now();
    }
    var time_0 = new Date(new Date().toLocaleString());
    return new Date(time_0.getTime() + 8 * 60 * 60 * 1000);
};
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
                        if (getNow(true) - Number(c_timestamp) > 30 * 60 * 1000) {
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
                                    createTime: getNow(true)
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
                                openid: openid
                            })
                                .count()];
                    case 1:
                        find$ = _a.sent();
                        return [4, db.collection('form-ids')
                                .add({
                                data: {
                                    openid: openid,
                                    formid: formid,
                                    createTime: getNow(true),
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
        app.router('push-template', function (ctx, next) { return __awaiter(_this, void 0, void 0, function () {
            var formid_id, formid, _a, type, texts, openid, page, find$, textData_1, weappTemplateMsg, send$, e_18, e_19;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 8, , 9]);
                        formid_id = '';
                        formid = event.data.prepay_id;
                        _a = event.data, type = _a.type, texts = _a.texts;
                        openid = event.data.openId || event.data.openid || event.userInfo.openId;
                        page = event.data.page || 'pages/order-list/index';
                        if (!!formid) return [3, 2];
                        return [4, db.collection('form-ids')
                                .where({
                                openid: openid
                            })
                                .limit(1)
                                .get()];
                    case 1:
                        find$ = _b.sent();
                        if (!find$.data[0]) {
                            throw "\u8BE5\u7528\u6237" + openid + "\u6CA1\u6709formid\u3001prepay_id";
                        }
                        formid = find$.data[0].formid;
                        formid_id = find$.data[0]._id;
                        _b.label = 2;
                    case 2:
                        textData_1 = {};
                        texts.map(function (text, index) {
                            var _a;
                            var keyText = "keyword" + (index + 1);
                            textData_1 = Object.assign({}, textData_1, (_a = {},
                                _a[keyText] = {
                                    value: text
                                },
                                _a));
                        });
                        weappTemplateMsg = {
                            page: page,
                            data: textData_1,
                            formId: formid,
                            templateId: CONFIG.push_template[type].value
                        };
                        console.log('===推送', weappTemplateMsg);
                        return [4, cloud.openapi.uniformMessage.send({
                                touser: openid,
                                weappTemplateMsg: weappTemplateMsg
                            })];
                    case 3:
                        send$ = _b.sent();
                        if (String(send$.errCode) !== '0') {
                            throw send$.errMsg;
                        }
                        if (!!!formid_id) return [3, 7];
                        _b.label = 4;
                    case 4:
                        _b.trys.push([4, 6, , 7]);
                        return [4, db.collection('form-ids')
                                .doc(formid_id)
                                .remove()];
                    case 5:
                        _b.sent();
                        return [3, 7];
                    case 6:
                        e_18 = _b.sent();
                        return [3, 7];
                    case 7: return [2, ctx.body = {
                            status: 200
                        }];
                    case 8:
                        e_19 = _b.sent();
                        return [2, ctx.body = {
                                status: 500,
                                message: typeof e_19 === 'string' ? e_19 : JSON.stringify(e_19)
                            }];
                    case 9: return [2];
                }
            });
        }); });
        app.router('push-template-cloud', function (ctx, next) { return __awaiter(_this, void 0, void 0, function () {
            var result, _a, access_token, errcode, formid_id, formid, _b, type, texts, openid, page, find$, textData_2, weapp_template_msg, reqData, send, e_20, e_21;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _c.trys.push([0, 9, , 10]);
                        console.log('===========>push-template-cloud');
                        return [4, axios({
                                method: 'get',
                                url: "https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=" + CONFIG.app.id + "&secret=" + CONFIG.app.secrect
                            })];
                    case 1:
                        result = _c.sent();
                        _a = result.data, access_token = _a.access_token, errcode = _a.errcode;
                        if (errcode) {
                            throw '生成access_token错误';
                        }
                        formid_id = '';
                        formid = event.data.prepay_id;
                        _b = event.data, type = _b.type, texts = _b.texts;
                        openid = event.data.openId || event.data.openid || event.userInfo.openId;
                        page = event.data.page || 'pages/order-list/index';
                        if (!!formid) return [3, 3];
                        return [4, db.collection('form-ids')
                                .where({
                                openid: openid,
                                formid: _.neq('the formId is a mock one')
                            })
                                .orderBy('createTime', 'asc')
                                .limit(1)
                                .get()];
                    case 2:
                        find$ = _c.sent();
                        if (!find$.data[0]) {
                            throw "\u8BE5\u7528\u6237" + openid + "\u6CA1\u6709formid\u3001prepay_id";
                        }
                        formid = find$.data[0].formid;
                        formid_id = find$.data[0]._id;
                        _c.label = 3;
                    case 3:
                        textData_2 = {};
                        texts.map(function (text, index) {
                            var _a;
                            var keyText = "keyword" + (index + 1);
                            textData_2 = Object.assign({}, textData_2, (_a = {},
                                _a[keyText] = {
                                    value: text
                                },
                                _a));
                        });
                        weapp_template_msg = {
                            page: page,
                            data: textData_2,
                            form_id: formid,
                            template_id: CONFIG.push_template[type].value
                        };
                        console.log('===推送', weapp_template_msg);
                        reqData = {
                            touser: openid,
                            weapp_template_msg: weapp_template_msg
                        };
                        return [4, axios({
                                data: reqData,
                                method: 'post',
                                url: "https://api.weixin.qq.com/cgi-bin/message/wxopen/template/uniform_send?access_token=" + access_token
                            })];
                    case 4:
                        send = _c.sent();
                        if (String(send.data.errcode) !== '0') {
                            throw send.data.errmsg;
                        }
                        if (!!!formid_id) return [3, 8];
                        _c.label = 5;
                    case 5:
                        _c.trys.push([5, 7, , 8]);
                        return [4, db.collection('form-ids')
                                .doc(formid_id)
                                .remove()];
                    case 6:
                        _c.sent();
                        return [3, 8];
                    case 7:
                        e_20 = _c.sent();
                        return [3, 8];
                    case 8: return [2, ctx.body = {
                            data: send.data,
                            status: 200
                        }];
                    case 9:
                        e_21 = _c.sent();
                        return [2, ctx.body = {
                                status: 500,
                                message: typeof e_21 === 'string' ? e_21 : JSON.stringify(e_21)
                            }];
                    case 10: return [2];
                }
            });
        }); });
        app.router('create-share', function (ctx, next) { return __awaiter(_this, void 0, void 0, function () {
            var openid, _a, from, pid, count$, count2$, create$, e_22;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 4, , 5]);
                        openid = event.userInfo.openId;
                        _a = event.data, from = _a.from, pid = _a.pid;
                        return [4, db.collection('share-record')
                                .where({
                                pid: pid,
                                openid: openid,
                                isSuccess: false
                            })
                                .count()];
                    case 1:
                        count$ = _b.sent();
                        if (count$.total > 0) {
                            return [2, ctx.body = { status: 200 }];
                        }
                        if (openid === from) {
                            return [2, ctx.body = { status: 200 }];
                        }
                        return [4, db.collection('share-record')
                                .where({
                                pid: pid,
                                openid: openid,
                                isSuccess: true,
                                successTime: _.gte(getNow(true) - 24 * 60 * 60 * 1000)
                            })
                                .count()];
                    case 2:
                        count2$ = _b.sent();
                        if (count2$.total > 0) {
                            return [2, ctx.body = { status: 200 }];
                        }
                        return [4, db.collection('share-record')
                                .add({
                                data: {
                                    pid: pid,
                                    from: from,
                                    openid: openid,
                                    isSuccess: false,
                                    createTime: getNow(true)
                                }
                            })];
                    case 3:
                        create$ = _b.sent();
                        return [2, ctx.body = { status: 200 }];
                    case 4:
                        e_22 = _b.sent();
                        return [2, ctx.body = {
                                status: 500
                            }];
                    case 5: return [2];
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
    var collections, e_23, dics, e_24, appConf, e_25, e_26;
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
                e_23 = _a.sent();
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
                e_24 = _a.sent();
                console.log('eee', e_24);
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
                e_25 = _a.sent();
                console.log('eee', e_25);
                return [3, 12];
            case 12:
                resolve();
                return [3, 14];
            case 13:
                e_26 = _a.sent();
                resolve();
                return [3, 14];
            case 14: return [2];
        }
    });
}); }); };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSxpQkEwckNHOztBQTFyQ0gscUNBQXVDO0FBQ3ZDLHNDQUF3QztBQUN4Qyw2QkFBK0I7QUFDL0IsK0JBQWlDO0FBQ2pDLG9DQUFzQztBQUN0QyxpQ0FBbUM7QUFFbkMsS0FBSyxDQUFDLElBQUksQ0FBQztJQUNQLEdBQUcsRUFBRSxPQUFPLENBQUMsR0FBRyxDQUFDLEtBQUs7Q0FDekIsQ0FBQyxDQUFDO0FBRUgsSUFBTSxFQUFFLEdBQWdCLEtBQUssQ0FBQyxRQUFRLEVBQUcsQ0FBQztBQUMxQyxJQUFNLENBQUMsR0FBRyxFQUFFLENBQUMsT0FBTyxDQUFDO0FBUXJCLElBQU0sTUFBTSxHQUFHLFVBQUUsRUFBVTtJQUFWLG1CQUFBLEVBQUEsVUFBVTtJQUN2QixJQUFLLEVBQUUsRUFBRztRQUNOLE9BQU8sSUFBSSxDQUFDLEdBQUcsRUFBRyxDQUFDO0tBQ3RCO0lBQ0QsSUFBTSxNQUFNLEdBQUcsSUFBSSxJQUFJLENBQUUsSUFBSSxJQUFJLEVBQUcsQ0FBQyxjQUFjLEVBQUcsQ0FBQyxDQUFDO0lBQ3hELE9BQU8sSUFBSSxJQUFJLENBQUUsTUFBTSxDQUFDLE9BQU8sRUFBRyxHQUFHLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLElBQUksQ0FBRSxDQUFBO0FBQzdELENBQUMsQ0FBQTtBQUtZLFFBQUEsSUFBSSxHQUFHLFVBQVEsS0FBSyxFQUFFLE9BQU87Ozs7UUFFaEMsR0FBRyxHQUFHLElBQUksU0FBUyxDQUFDLEVBQUUsS0FBSyxPQUFBLEVBQUUsQ0FBQyxDQUFDO1FBTXJDLEdBQUcsQ0FBQyxNQUFNLENBQUMsTUFBTSxFQUFFLFVBQU8sR0FBRyxFQUFFLElBQUk7Ozs7Ozt3QkFFckIsV0FBVyxHQUFHLE1BQU0sQ0FBQyxXQUFXLENB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O29DQUhOLFNBR00sQ0FBQzs7Ozs7eUJBRWQsQ0FBQyxDQUNMLEVBQUE7O2dCQXhCRCxTQXdCQyxDQUFDOzs7O2dCQUVGLE9BQU8sQ0FBQyxHQUFHLENBQUMsS0FBSyxFQUFFLElBQUMsQ0FBRSxDQUFDOzs7Z0JBRzNCLE9BQU8sRUFBRyxDQUFDOzs7O2dCQUVDLE9BQU8sRUFBRyxDQUFDOzs7OztLQUM5QixDQUFDLEVBaEZvQixDQWdGcEIsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIGNsb3VkIGZyb20gJ3d4LXNlcnZlci1zZGsnO1xuaW1wb3J0ICogYXMgVGNiUm91dGVyIGZyb20gJ3RjYi1yb3V0ZXInO1xuaW1wb3J0ICogYXMgYXhpb3MgZnJvbSAnYXhpb3MnO1xuaW1wb3J0ICogYXMgY3J5cHRvIGZyb20gJ2NyeXB0byc7XG5pbXBvcnQgKiBhcyBycCBmcm9tICdyZXF1ZXN0LXByb21pc2UnO1xuaW1wb3J0ICogYXMgQ09ORklHIGZyb20gJy4vY29uZmlnJztcblxuY2xvdWQuaW5pdCh7XG4gICAgZW52OiBwcm9jZXNzLmVudi5jbG91ZFxufSk7XG5cbmNvbnN0IGRiOiBEQi5EYXRhYmFzZSA9IGNsb3VkLmRhdGFiYXNlKCApO1xuY29uc3QgXyA9IGRiLmNvbW1hbmQ7XG5cbi8qKiBcbiAqIOi9rOaNouagvOael+WwvOayu+aXtuWMuiArOOaXtuWMulxuICogRGF0ZSgpLm5vdygpIC8gbmV3IERhdGUoKS5nZXRUaW1lKCkg5piv5pe25LiN5pe25q2j5bi455qEKzhcbiAqIERhdGUudG9Mb2NhbFN0cmluZyggKSDlpb3lg4/mmK/kuIDnm7TmmK8rMOeahFxuICog5YWI5ou/5YiwICsw77yM54S25ZCOKzhcbiAqL1xuY29uc3QgZ2V0Tm93ID0gKCB0cyA9IGZhbHNlICk6IGFueSA9PiB7XG4gICAgaWYgKCB0cyApIHtcbiAgICAgICAgcmV0dXJuIERhdGUubm93KCApO1xuICAgIH1cbiAgICBjb25zdCB0aW1lXzAgPSBuZXcgRGF0ZSggbmV3IERhdGUoICkudG9Mb2NhbGVTdHJpbmcoICkpO1xuICAgIHJldHVybiBuZXcgRGF0ZSggdGltZV8wLmdldFRpbWUoICkgKyA4ICogNjAgKiA2MCAqIDEwMDAgKVxufVxuLyoqXG4gKiBAZGVzY3JpcHRpb24gXG4gKiDlhazlhbHmqKHlnZdcbiAqL1xuZXhwb3J0IGNvbnN0IG1haW4gPSBhc3luYyAoIGV2ZW50LCBjb250ZXh0ICkgPT4ge1xuXG4gICAgY29uc3QgYXBwID0gbmV3IFRjYlJvdXRlcih7IGV2ZW50IH0pO1xuXG4gICAgLyoqXG4gICAgICogQGRlc2NyaXB0aW9uXG4gICAgICog5Yid5aeL5YyW5ZCE5Liq5pWw5o2u5bqTXG4gICAgICovXG4gICAgYXBwLnJvdXRlcignaW5pdCcsIGFzeW5jKCBjdHgsIG5leHQgKSA9PiB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBjb25zdCBjb2xsZWN0aW9ucyA9IENPTkZJRy5jb2xsZWN0aW9ucztcbiAgICAgICAgICAgIGF3YWl0IFByb21pc2UuYWxsKFtcbiAgICAgICAgICAgICAgICBjb2xsZWN0aW9ucy5tYXAoIGNvbGxlY3Rpb25OYW1lID0+IChkYiBhcyBhbnkpLmNyZWF0ZUNvbGxlY3Rpb24oIGNvbGxlY3Rpb25OYW1lICkpXG4gICAgICAgICAgICBdKVxuXG4gICAgICAgICAgICByZXR1cm4gY3R4LmJvZHkgPSB7IHN0YXR1czogMjAwIH1cbiAgICAgICAgfSBjYXRjaCAoIGUgKSB7XG4gICAgICAgICAgICByZXR1cm4gY3R4LmJvZHkgPSB7IHN0YXR1czogNTAwLCBtZXNzYWdlOiBlIH1cbiAgICAgICAgfVxuICAgIH0pXG5cbiAgICAvKipcbiAgICAgKiBAZGVzY3JpcHRpb24gXG4gICAgICog5pWw5o2u5a2X5YW4XG4gICAgICoge1xuICAgICAqICAgICAgZGljTmFtZTogJ3h4eCx5eXksenp6J1xuICAgICAqICAgICAgZmlsdGVyQmpwOiBmYWxzZSB8IHRydWUgfCB1bmRlZmluZWQg77yIIOaYr+WQpui/h+a7pOS/neWBpeWTgSDvvIlcbiAgICAgKiB9XG4gICAgICovXG4gICAgYXBwLnJvdXRlcignZGljJywgYXN5bmMoIGN0eCwgbmV4dCApID0+IHtcbiAgICAgICAgdHJ5IHtcblxuICAgICAgICAgICAgLy8g5L+d5YGl5ZOB6YWN572uXG4gICAgICAgICAgICBsZXQgYmpwQ29uZmlnOiBhbnkgPSBudWxsO1xuICAgICAgICAgICAgY29uc3QgeyBkaWNOYW1lLCBmaWx0ZXJCanAgfSA9IGV2ZW50LmRhdGE7XG4gICAgICAgICAgICBjb25zdCBkYlJlcyA9IGF3YWl0IGRiLmNvbGxlY3Rpb24oJ2RpYycpXG4gICAgICAgICAgICAgICAgLndoZXJlKHtcbiAgICAgICAgICAgICAgICAgICAgYmVsb25nOiBkYi5SZWdFeHAoe1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVnZXhwOiBkaWNOYW1lLnJlcGxhY2UoL1xcLC9nLCAnfCcpLFxuICAgICAgICAgICAgICAgICAgICAgICAgb3B0aW9uZDogJ2knXG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAuZ2V0KCApO1xuXG4gICAgICAgICAgICAvLyDkv53lgaXlk4HphY3nva5cbiAgICAgICAgICAgIGlmICggISFmaWx0ZXJCanAgKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgYmpwQ29uZmlnJCA9IGF3YWl0IGRiLmNvbGxlY3Rpb24oJ2FwcC1jb25maWcnKVxuICAgICAgICAgICAgICAgICAgICAud2hlcmUoe1xuICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogJ2FwcC1ianAtdmlzaWJsZSdcbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgLmdldCggKTtcbiAgICAgICAgICAgICAgICBianBDb25maWcgPSBianBDb25maWckLmRhdGFbIDAgXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgICAgICBsZXQgcmVzdWx0ID0geyB9O1xuICAgICAgICAgICAgZGJSZXMuZGF0YS5tYXAoIGRpYyA9PiB7XG4gICAgICAgICAgICAgICAgcmVzdWx0ID0gT2JqZWN0LmFzc2lnbih7IH0sIHJlc3VsdCwge1xuICAgICAgICAgICAgICAgICAgICBbIGRpYy5iZWxvbmcgXTogZGljWyBkaWMuYmVsb25nIF1cbiAgICAgICAgICAgICAgICAgICAgICAgIC5maWx0ZXIoIHggPT4gISF4IClcbiAgICAgICAgICAgICAgICAgICAgICAgIC5maWx0ZXIoIHggPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICggISFianBDb25maWcgJiYgIWJqcENvbmZpZy52YWx1ZSApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFN0cmluZyggeC52YWx1ZSApICE9PSAnNCdcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHJldHVybiBjdHguYm9keSA9IHtcbiAgICAgICAgICAgICAgICBzdGF0dXM6IDIwMCxcbiAgICAgICAgICAgICAgICBkYXRhOiByZXN1bHRcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgfSBjYXRjaCAoIGUgKSB7XG4gICAgICAgICAgICByZXR1cm4gY3R4LmJvZHkgPSB7XG4gICAgICAgICAgICAgICAgc3RhdHVzOiA1MDAsXG4gICAgICAgICAgICAgICAgbWVzc2FnZTogZVxuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgLyoqXG4gICAgICogQGRlc2NyaXB0aW9uXG4gICAgICog5b6u5L+h55So5oi35L+h5oGv5a2Y5YKoXG4gICAgICovXG4gICAgYXBwLnJvdXRlcigndXNlckVkaXQnLCBhc3luYyggY3R4LCBuZXh0ICkgPT4ge1xuICAgICAgICB0cnkge1xuXG4gICAgICAgICAgICBjb25zdCBvcGVuaWQgPSBldmVudC51c2VySW5mby5vcGVuSWQ7XG4gICAgICAgICAgICBjb25zdCBkYXRhJCA9IGF3YWl0IGRiLmNvbGxlY3Rpb24oJ3VzZXInKVxuICAgICAgICAgICAgICAgIC53aGVyZSh7XG4gICAgICAgICAgICAgICAgICAgIG9wZW5pZFxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLmdldCggKVxuICAgICAgICAgICAgICAgIC5jYXRjaCggZXJyID0+IHsgdGhyb3cgYCR7ZXJyfWB9KTtcbiAgICAgICAgXG4gICAgICAgICAgICAvLyDlpoLmnpzkuI3lrZjlnKjvvIzliJnliJvlu7pcbiAgICAgICAgICAgIGlmICggZGF0YSQuZGF0YS5sZW5ndGggPT09IDAgKSB7XG4gICAgICAgIFxuICAgICAgICAgICAgICAgIGF3YWl0IGRiLmNvbGxlY3Rpb24oJ3VzZXInKVxuICAgICAgICAgICAgICAgICAgICAuYWRkKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRhdGE6IE9iamVjdC5hc3NpZ24oeyB9LCBldmVudC5kYXRhLCB7IFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9wZW5pZCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbnRlZ3JhbDogMFxuICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgfSkuY2F0Y2goIGVyciA9PiB7IHRocm93IGAke2Vycn1gfSk7XG4gICAgICAgIFxuICAgICAgICAgICAgLy8g5aaC5p6c5a2Y5Zyo77yM5YiZ5pu05pawXG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGNvbnN0IG1ldGEgPSBPYmplY3QuYXNzaWduKHsgfSwgZGF0YSQuZGF0YVsgMCBdLCBldmVudC5kYXRhICk7XG4gICAgICAgICAgICAgICAgZGVsZXRlIG1ldGEuX2lkO1xuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIGF3YWl0IGRiLmNvbGxlY3Rpb24oJ3VzZXInKS5kb2MoKCBkYXRhJC5kYXRhWyAwIF0gYXMgYW55KS5faWQgKVxuICAgICAgICAgICAgICAgICAgICAuc2V0KHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRhdGE6IE9iamVjdC5hc3NpZ24oeyB9LCBtZXRhLCB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaW50ZWdyYWw6IGRhdGEkLmRhdGFbIDAgXS5pbnRlZ3JhbFxuICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgfSkuY2F0Y2goIGVyciA9PiB7IHRocm93IGAke2Vycn1gfSk7XG4gICAgICAgICAgICB9ICAgIFxuXG4gICAgICAgICAgICByZXR1cm4gY3R4LmJvZHkgPSB7XG4gICAgICAgICAgICAgICAgc3RhdHVzOiAyMDBcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgfSBjYXRjaCAoIGUgKSB7XG4gICAgICAgICAgICByZXR1cm4gY3R4LmJvZHkgPSB7XG4gICAgICAgICAgICAgICAgc3RhdHVzOiA1MDAsXG4gICAgICAgICAgICAgICAgbWVzc2FnZTogZVxuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgLyoqXG4gICAgICogQGRlc2NyaXB0aW9uXG4gICAgICog5piv5paw5a6i6L+Y5piv5pen5a6iXG4gICAgICog5paw5a6i77yM5oiQ5Yqf5pSv5LuY6K6i5Y2VIDw9IDNcbiAgICAqL1xuICAgIGFwcC5yb3V0ZXIoJ2lzLW5ldy1jdXN0b21lcicsIGFzeW5jKCBjdHgsIG5leHQgKSA9PiB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGNvbnN0IG9wZW5pZCA9IGV2ZW50LmRhdGEub3BlbklkIHx8IGV2ZW50LnVzZXJJbmZvLm9wZW5JZDtcbiAgICAgICAgICAgIGNvbnN0IGZpbmQkID0gYXdhaXQgZGIuY29sbGVjdGlvbignb3JkZXInKVxuICAgICAgICAgICAgICAgIC53aGVyZSh7XG4gICAgICAgICAgICAgICAgICAgIG9wZW5pZCxcbiAgICAgICAgICAgICAgICAgICAgYmFzZV9zdGF0dXM6ICczJ1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLmNvdW50KCApO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICByZXR1cm4gY3R4LmJvZHkgPSB7XG4gICAgICAgICAgICAgICAgc3RhdHVzOiAyMDAsXG4gICAgICAgICAgICAgICAgZGF0YTogZmluZCQudG90YWwgPCAzXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfSBjYXRjaCAoIGUgKSB7XG4gICAgICAgICAgICByZXR1cm4gY3R4LmJvZHkgPSB7XG4gICAgICAgICAgICAgICAgc3RhdHVzOiAyMDAsXG4gICAgICAgICAgICAgICAgZGF0YTogdHJ1ZVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICAvKiogXG4gICAgICogQGRlc2NyaXB0aW9uXG4gICAgICog5a6i5oi35Zyo6K+l6Lq66KGM56iL77yM5piv5ZCm6ZyA6KaB5LuY6K6i6YeRXG4gICAgICoge1xuICAgICAqICAgIHRpZFxuICAgICAqIH1cbiAgICAgKi9cbiAgICBhcHAucm91dGVyKCdzaG91bGQtcHJlcGF5JywgYXN5bmMoIGN0eCwgbmV4dCApID0+IHtcbiAgICAgICAgdHJ5IHtcblxuICAgICAgICAgICAgY29uc3QgeyB0aWQgfSA9IGV2ZW50LmRhdGE7XG4gICAgICAgICAgICBjb25zdCBvcGVuaWQgPSBldmVudC5kYXRhLm9wZW5JZCB8fCBldmVudC51c2VySW5mby5vcGVuSWQ7XG5cbiAgICAgICAgICAgIGNvbnN0IGZpbmQkID0gYXdhaXQgZGIuY29sbGVjdGlvbignb3JkZXInKVxuICAgICAgICAgICAgICAgIC53aGVyZSh7XG4gICAgICAgICAgICAgICAgICAgIG9wZW5pZCxcbiAgICAgICAgICAgICAgICAgICAgYmFzZV9zdGF0dXM6ICczJ1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLmNvdW50KCApO1xuXG4gICAgICAgICAgICBjb25zdCB0cmlwJCA9IGF3YWl0IGRiLmNvbGxlY3Rpb24oJ3RyaXAnKVxuICAgICAgICAgICAgICAgIC5kb2MoIFN0cmluZyggdGlkICkpXG4gICAgICAgICAgICAgICAgLmdldCggKTtcbiAgICAgICAgICAgIGNvbnN0IHRyaXAgPSB0cmlwJC5kYXRhO1xuXG4gICAgICAgICAgICBjb25zdCBpc05ldyA9IGZpbmQkLnRvdGFsIDwgMztcblxuICAgICAgICAgICAgY29uc3QganVkZ2UgPSAoIGlzTmV3LCB0cmlwICkgPT4ge1xuICAgICAgICAgICAgICAgIGlmICggIXRyaXAgKSB7IHJldHVybiB0cnVlOyB9XG4gICAgICAgICAgICAgICAgaWYgKCBpc05ldyAmJiB0cmlwLnBheW1lbnQgPT09ICcwJyApIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG5cbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKCBpc05ldyAmJiB0cmlwLnBheW1lbnQgPT09ICcxJyApIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG5cbiAgICAgICAgICAgICAgICB9ICBlbHNlIGlmICggaXNOZXcgJiYgdHJpcC5wYXltZW50ID09PSAnMicgKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmICggIWlzTmV3ICYmIHRyaXAucGF5bWVudCA9PT0gJzAnICkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIH0gIGVsc2UgaWYgKCAhaXNOZXcgJiYgdHJpcC5wYXltZW50ID09PSAnMScgKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKCBpc05ldyAmJiB0cmlwLnBheW1lbnQgPT09ICcyJyApIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiBjdHguYm9keSA9IHtcbiAgICAgICAgICAgICAgICBzdGF0dXM6IDIwMCxcbiAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICAgIGlzTmV3LFxuICAgICAgICAgICAgICAgICAgICBzaG91bGRQcmVwYXk6IGp1ZGdlKCBpc05ldywgdHJpcCApXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgIH0gY2F0Y2ggKCBlICkgeyByZXR1cm4gY3R4LmJvZHkgPSB7IHN0YXR1czogNTAwIH07fVxuICAgIH0pXG5cbiAgICAvKipcbiAgICAgKiDlvq7kv6HmlK/ku5jvvIzov5Tlm57mlK/ku5hhcGnlv4XopoHlj4LmlbBcbiAgICAgKiAtLS0tLS0tLS0tLSDor7fmsYIgLS0tLS0tLS0tLVxuICAgICAqIHtcbiAgICAgKiAgICAgIHRvdGFsX2ZlZVxuICAgICAqIH1cbiAgICAgKi9cbiAgICBhcHAucm91dGVyKCd3eHBheScsIGFzeW5jKCBjdHgsIG5leHQgKSA9PiB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBjb25zdCB7IGtleSwgYm9keSwgbWNoX2lkLCBhdHRhY2gsIG5vdGlmeV91cmwsIHNwYmlsbF9jcmVhdGVfaXAgfSA9IENPTkZJRy53eFBheTtcbiAgICAgICAgICAgIGNvbnN0IGFwcGlkID0gQ09ORklHLmFwcC5pZDtcbiAgICAgICAgICAgIGNvbnN0IHRvdGFsX2ZlZSA9IGV2ZW50LmRhdGEudG90YWxfZmVlO1xuICAgICAgICAgICAgY29uc3Qgb3BlbmlkID0gZXZlbnQudXNlckluZm8ub3BlbklkO1xuICAgICAgICAgICAgY29uc3Qgbm9uY2Vfc3RyID0gTWF0aC5yYW5kb20oICkudG9TdHJpbmcoIDM2ICkuc3Vic3RyKCAyLCAxNSApO1xuICAgICAgICAgICAgY29uc3QgdGltZVN0YW1wID0gcGFyc2VJbnQoU3RyaW5nKCBEYXRlLm5vdygpIC8gMTAwMCApKSArICcnO1xuICAgICAgICAgICAgY29uc3Qgb3V0X3RyYWRlX25vID0gXCJvdG5cIiArIG5vbmNlX3N0ciArIHRpbWVTdGFtcDtcblxuICAgICAgICAgICAgY29uc3QgcGF5c2lnbiA9ICh7IC4uLmFyZ3MgfSkgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IHNhOiBhbnkgPSBbIF1cbiAgICAgICAgICAgICAgICBmb3IgKCBsZXQgayBpbiBhcmdzICkge1xuICAgICAgICAgICAgICAgICAgICBzYS5wdXNoKCBrICsgJz0nICsgYXJnc1sgayBdKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgc2EucHVzaCgna2V5PScgKyBrZXkgKTtcbiAgICAgICAgICAgICAgICBjb25zdCBzID0gIGNyeXB0by5jcmVhdGVIYXNoKCdtZDUnKS51cGRhdGUoc2Euam9pbignJicpLCAndXRmOCcpLmRpZ2VzdCgnaGV4Jyk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHMudG9VcHBlckNhc2UoICk7XG4gICAgICAgICAgICB9XG4gICAgXG4gICAgICAgICAgICBsZXQgZm9ybURhdGEgPSBcIjx4bWw+XCI7XG4gICAgXG4gICAgICAgICAgICBmb3JtRGF0YSArPSBcIjxhcHBpZD5cIiArIGFwcGlkICsgXCI8L2FwcGlkPlwiXG4gICAgICAgIFxuICAgICAgICAgICAgZm9ybURhdGEgKz0gXCI8YXR0YWNoPlwiICsgYXR0YWNoICsgXCI8L2F0dGFjaD5cIlxuICAgICAgICBcbiAgICAgICAgICAgIGZvcm1EYXRhICs9IFwiPGJvZHk+XCIgKyBib2R5ICsgXCI8L2JvZHk+XCJcbiAgICAgICAgXG4gICAgICAgICAgICBmb3JtRGF0YSArPSBcIjxtY2hfaWQ+XCIgKyBtY2hfaWQgKyBcIjwvbWNoX2lkPlwiXG4gICAgICAgIFxuICAgICAgICAgICAgZm9ybURhdGEgKz0gXCI8bm9uY2Vfc3RyPlwiICsgbm9uY2Vfc3RyICsgXCI8L25vbmNlX3N0cj5cIlxuICAgICAgICBcbiAgICAgICAgICAgIGZvcm1EYXRhICs9IFwiPG5vdGlmeV91cmw+XCIgKyBub3RpZnlfdXJsICsgXCI8L25vdGlmeV91cmw+XCJcbiAgICAgICAgXG4gICAgICAgICAgICBmb3JtRGF0YSArPSBcIjxvcGVuaWQ+XCIgKyBvcGVuaWQgKyBcIjwvb3BlbmlkPlwiXG4gICAgICAgIFxuICAgICAgICAgICAgZm9ybURhdGEgKz0gXCI8b3V0X3RyYWRlX25vPlwiICsgb3V0X3RyYWRlX25vICsgXCI8L291dF90cmFkZV9ubz5cIlxuICAgICAgICBcbiAgICAgICAgICAgIGZvcm1EYXRhICs9IFwiPHNwYmlsbF9jcmVhdGVfaXA+XCIgKyBzcGJpbGxfY3JlYXRlX2lwICsgXCI8L3NwYmlsbF9jcmVhdGVfaXA+XCJcbiAgICAgICAgXG4gICAgICAgICAgICBmb3JtRGF0YSArPSBcIjx0b3RhbF9mZWU+XCIgKyB0b3RhbF9mZWUgKyBcIjwvdG90YWxfZmVlPlwiXG4gICAgICAgIFxuICAgICAgICAgICAgZm9ybURhdGEgKz0gXCI8dHJhZGVfdHlwZT5KU0FQSTwvdHJhZGVfdHlwZT5cIlxuICAgICAgICBcbiAgICAgICAgICAgIGZvcm1EYXRhICs9IFwiPHNpZ24+XCIgKyBwYXlzaWduKHsgYXBwaWQsIGF0dGFjaCwgYm9keSwgbWNoX2lkLCBub25jZV9zdHIsIG5vdGlmeV91cmwsIG9wZW5pZCwgb3V0X3RyYWRlX25vLCBzcGJpbGxfY3JlYXRlX2lwLCB0b3RhbF9mZWUsIHRyYWRlX3R5cGU6ICdKU0FQSScgfSkgKyBcIjwvc2lnbj5cIlxuICAgICAgICBcbiAgICAgICAgICAgIGZvcm1EYXRhICs9IFwiPC94bWw+XCI7XG4gICAgXG4gICAgICAgICAgICBsZXQgcmVzID0gYXdhaXQgcnAoeyB1cmw6IFwiaHR0cHM6Ly9hcGkubWNoLndlaXhpbi5xcS5jb20vcGF5L3VuaWZpZWRvcmRlclwiLCBtZXRob2Q6ICdQT1NUJyxib2R5OiBmb3JtRGF0YSB9KTtcbiAgICBcbiAgICAgICAgICAgIGxldCB4bWwgPSByZXMudG9TdHJpbmcoXCJ1dGYtOFwiKTtcbiAgICAgICAgICBcbiAgICAgICAgICAgIGlmICggeG1sLmluZGV4T2YoJ3ByZXBheV9pZCcpIDwgMCApIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gY3R4LmJvZHkgPSB7XG4gICAgICAgICAgICAgICAgICAgIHN0YXR1czogNTAwXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY29uc29sZS5sb2coJ2VlZWVlJywgZm9ybURhdGEsIHhtbCApO1xuICAgICAgICAgICAgbGV0IHByZXBheV9pZCA9IHhtbC5zcGxpdChcIjxwcmVwYXlfaWQ+XCIpWzFdLnNwbGl0KFwiPC9wcmVwYXlfaWQ+XCIpWzBdLnNwbGl0KCdbJylbMl0uc3BsaXQoJ10nKVswXVxuICAgIFxuICAgICAgICAgICAgbGV0IHBheVNpZ24gPSBwYXlzaWduKHsgYXBwSWQ6IGFwcGlkLCBub25jZVN0cjogbm9uY2Vfc3RyLCBwYWNrYWdlOiAoJ3ByZXBheV9pZD0nICsgcHJlcGF5X2lkKSwgc2lnblR5cGU6ICdNRDUnLCB0aW1lU3RhbXA6IHRpbWVTdGFtcCB9KVxuICAgICAgICAgICAgXG4gICAgICAgICAgICByZXR1cm4gY3R4LmJvZHkgPSB7XG4gICAgICAgICAgICAgICAgc3RhdHVzOiAyMDAsXG4gICAgICAgICAgICAgICAgZGF0YTogeyBhcHBpZCwgbm9uY2Vfc3RyLCB0aW1lU3RhbXAsIHByZXBheV9pZCwgcGF5U2lnbiB9IFxuICAgICAgICAgICAgfTtcblxuICAgICAgICB9IGNhdGNoICggZSApIHtcbiAgICAgICAgICAgIHJldHVybiBjdHguYm9keSA9IHtcbiAgICAgICAgICAgICAgICBzdGF0dXM6IDUwMFxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICAvKipcbiAgICAgKiDku6PotK3kuKrkurrlvq7kv6Hkuoznu7TnoIHjgIHnvqTkuoznu7TnoIFcbiAgICAgKiAtLS0tLS0g6K+35rGCIC0tLS0tLVxuICAgICAqIHtcbiAgICAgKiAgICAgIHd4X3FyY29kZTogc3RyaW5nW11cbiAgICAgKiAgICAgIGdyb3VwX3FyY29kZTogc3RyaW5nW11cbiAgICAgKiB9XG4gICAgICovXG4gICAgYXBwLnJvdXRlcignd3hpbmZvLWVkaXQnLCBhc3luYyggY3R4LCBuZXh0ICkgPT4ge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgXG4gICAgICAgICAgICBjb25zdCB0ZW1wOiBhbnkgPSBbIF07XG4gICAgICAgICAgICBPYmplY3Qua2V5cyggZXZlbnQuZGF0YSApLm1hcCgga2V5ID0+IHtcbiAgICAgICAgICAgICAgICBpZiAoICEhZXZlbnQuZGF0YVsga2V5IF0pIHtcbiAgICAgICAgICAgICAgICAgICAgdGVtcC5wdXNoKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6IGtleSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlOiBldmVudC5kYXRhWyBrZXkgXVxuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBhd2FpdCBQcm9taXNlLmFsbCggdGVtcC5tYXAoIGFzeW5jIHggPT4ge1xuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIGNvbnN0IGZpbmQkID0gYXdhaXQgZGIuY29sbGVjdGlvbignbWFuYWdlci13eC1pbmZvJylcbiAgICAgICAgICAgICAgICAgICAgLndoZXJlKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6IHgudHlwZVxuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAuZ2V0KCApO1xuXG4gICAgICAgICAgICAgICAgaWYgKCBmaW5kJC5kYXRhLmxlbmd0aCA+IDAgKSB7XG4gICAgICAgICAgICAgICAgICAgIGF3YWl0IGRiLmNvbGxlY3Rpb24oJ21hbmFnZXItd3gtaW5mbycpLmRvYyggKGZpbmQkLmRhdGFbIDAgXSBhcyBhbnkpLl9pZCApXG4gICAgICAgICAgICAgICAgICAgICAgICAuc2V0KHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhOiB4XG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgYXdhaXQgZGIuY29sbGVjdGlvbignbWFuYWdlci13eC1pbmZvJylcbiAgICAgICAgICAgICAgICAgICAgICAgIC5hZGQoe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGE6IHhcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgfSkpO1xuXG4gICAgICAgICAgICByZXR1cm4gY3R4LmJvZHkgPSB7XG4gICAgICAgICAgICAgICAgc3RhdHVzOiAyMDBcbiAgICAgICAgICAgIH1cblxuICAgICAgICB9IGNhdGNoICggZSApIHtcbiAgICAgICAgICAgIHJldHVybiBjdHguYm9keSA9IHsgc3RhdHVzOiA1MDAgfTtcbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgLyoqXG4gICAgICogQGRlc2NyaXB0aW9uXG4gICAgICog5p+l6K+i5Luj6LSt5Liq5Lq65LqM57u056CB5L+h5oGvXG4gICAgICovXG4gICAgYXBwLnJvdXRlcignd3hpbmZvJywgYXN5bmMoIGN0eCwgbmV4dCApID0+IHtcbiAgICAgICAgdHJ5IHtcblxuICAgICAgICAgICAgY29uc3QgdGFyZ2V0ID0gWyd3eF9xcmNvZGUnLCAnZ3JvdXBfcXJjb2RlJ107XG4gICAgICAgICAgICBjb25zdCBmaW5kcyQgPSBhd2FpdCBQcm9taXNlLmFsbCggdGFyZ2V0Lm1hcCggdHlwZSA9PiB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGRiLmNvbGxlY3Rpb24oJ21hbmFnZXItd3gtaW5mbycpXG4gICAgICAgICAgICAgICAgICAgIC53aGVyZSh7XG4gICAgICAgICAgICAgICAgICAgICAgICB0eXBlXG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgIC5nZXQoICk7XG4gICAgICAgICAgICB9KSk7XG5cbiAgICAgICAgICAgIGNvbnN0IHRlbXAgPSB7IH07XG4gICAgICAgICAgICBmaW5kcyQubWFwKCggZmluZCQsIGluZGV4ICkgPT4ge1xuICAgICAgICAgICAgICAgIGlmICggZmluZCQuZGF0YS5sZW5ndGggPiAwICkge1xuICAgICAgICAgICAgICAgICAgICB0ZW1wWyB0YXJnZXRbIGluZGV4IF1dID0gZmluZCQuZGF0YVsgMCBdLnZhbHVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICByZXR1cm4gY3R4LmJvZHkgPSB7XG4gICAgICAgICAgICAgICAgc3RhdHVzOiAyMDAsXG4gICAgICAgICAgICAgICAgZGF0YTogdGVtcFxuICAgICAgICAgICAgfVxuXG4gICAgICAgIH0gY2F0Y2ggKCBlICkge1xuICAgICAgICAgICAgcmV0dXJuIGN0eC5ib2R5ID0geyBzdGF0dXM6IDUwMCB9O1xuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICAvKiogXG4gICAgICogQGRlc2NyaXB0aW9uXG4gICAgICog6I635Y+W4oCc5oiR55qE6aG16Z2i4oCd55qE5Z+65pys5L+h5oGv77yM6K+45aaC6K6i5Y2V44CB5Y2h5Yi45pWw6YePXG4gICAgICovXG4gICAgYXBwLnJvdXRlcignbXlwYWdlLWluZm8nLCBhc3luYyggY3R4LCBuZXh0ICkgPT4ge1xuICAgICAgICB0cnkge1xuXG4gICAgICAgICAgICBsZXQgY291cG9ucyA9IDA7XG4gICAgICAgICAgICBjb25zdCB0cmlwcyQgPSBhd2FpdCBjbG91ZC5jYWxsRnVuY3Rpb24oe1xuICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgJHVybDogJ2VudGVyJ1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgbmFtZTogJ3RyaXAnXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGNvbnN0IHRyaXBzID0gdHJpcHMkLnJlc3VsdC5kYXRhO1xuICAgICAgICAgICAgY29uc3QgdHJpcCA9IHRyaXBzWyAwIF07XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIC8vIOiuouWNleaVsFxuICAgICAgICAgICAgY29uc3Qgb3JkZXJzJCA9IGF3YWl0IGRiLmNvbGxlY3Rpb24oJ29yZGVyJylcbiAgICAgICAgICAgICAgICAud2hlcmUoe1xuICAgICAgICAgICAgICAgICAgICBvcGVuaWQ6IGV2ZW50LnVzZXJJbmZvLm9wZW5JZCxcbiAgICAgICAgICAgICAgICAgICAgYmFzZV9zdGF0dXM6IF8ubmVxKCc1JylcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIC5jb3VudCggKTtcblxuICAgICAgICAgICAgaWYgKCAhIXRyaXAgKSB7XG4gICAgICAgICAgICAgICAgLy8g5Y2h5Yi45pWwKCDov4fmu6Tmjonlj6rlianlvZPliY3nmoR0cmlw5Y2h5Yi4IClcbiAgICAgICAgICAgICAgICBjb25zdCBjb3Vwb25zJCA9IGF3YWl0IGRiLmNvbGxlY3Rpb24oJ2NvdXBvbicpXG4gICAgICAgICAgICAgICAgICAgIC53aGVyZSh7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aWQ6IHRyaXAuX2lkLFxuICAgICAgICAgICAgICAgICAgICAgICAgb3BlbmlkOiBldmVudC51c2VySW5mby5vcGVuSWRcbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgLmNvdW50KCApO1xuICAgICAgICAgICAgICAgIGNvdXBvbnMgPSBjb3Vwb25zJC50b3RhbDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIFxuICAgICAgICAgICAgcmV0dXJuIGN0eC5ib2R5ID0ge1xuICAgICAgICAgICAgICAgIHN0YXR1czogMjAwLFxuICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgY291cG9ucyxcbiAgICAgICAgICAgICAgICAgICAgb3JkZXJzOiBvcmRlcnMkLnRvdGFsXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgIH0gY2F0Y2ggKCBlICkgeyByZXR1cm4gY3R4LmJvZHkgPSB7IHN0YXR1czogNTAwIH07fVxuICAgIH0pO1xuXG4gICAgLyoqIFxuICAgICAqIEBkZXNjcmlwdGlvblxuICAgICAqIOihjOeoi+S4i++8jOWPguWKoOS6hui0reS5sOeahOWuouaIt++8iOiuouWNle+8iVxuICAgICAqIHsgXG4gICAgICogICAgdGlkXG4gICAgICogfVxuICAgICAqL1xuICAgIGFwcC5yb3V0ZXIoJ2N1c3RvbWVyLWluLXRyaXAnLCBhc3luYyggY3R4LCBuZXh0ICkgPT4ge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgY29uc3QgbGltaXQgPSAxMDA7XG4gICAgICAgICAgICBjb25zdCBhbGxPcmRlclVzZXJzJCA9IGF3YWl0IGRiLmNvbGxlY3Rpb24oJ29yZGVyJylcbiAgICAgICAgICAgICAgICAud2hlcmUoe1xuICAgICAgICAgICAgICAgICAgICB0aWQ6IGV2ZW50LmRhdGEudGlkXG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAub3JkZXJCeSgnY3JlYXRlVGltZScsICdkZXNjJylcbiAgICAgICAgICAgICAgICAubGltaXQoIGxpbWl0IClcbiAgICAgICAgICAgICAgICAuZmllbGQoe1xuICAgICAgICAgICAgICAgICAgICBvcGVuaWQ6IHRydWVcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIC5nZXQoICk7XG5cbiAgICAgICAgICAgIGNvbnN0IG9wZW5pZHMgPSBBcnJheS5mcm9tKCBuZXcgU2V0KCBhbGxPcmRlclVzZXJzJC5kYXRhLm1hcCggeCA9PiB4Lm9wZW5pZCApKSk7XG5cbiAgICAgICAgICAgIGNvbnN0IGF2YXRhdHMkID0gYXdhaXQgUHJvbWlzZS5hbGwoIG9wZW5pZHMubWFwKCBvaWQgPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiBkYi5jb2xsZWN0aW9uKCd1c2VyJylcbiAgICAgICAgICAgICAgICAgICAgLndoZXJlKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG9wZW5pZDogb2lkXG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgIC5maWVsZCh7XG4gICAgICAgICAgICAgICAgICAgICAgICBhdmF0YXJVcmw6IHRydWVcbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgLmdldCggKTtcbiAgICAgICAgICAgIH0pKVxuICAgICAgICAgICAgXG4gICAgICAgICAgICByZXR1cm4gY3R4LmJvZHkgPSB7XG4gICAgICAgICAgICAgICAgc3RhdHVzOiAyMDAsXG4gICAgICAgICAgICAgICAgZGF0YTogYXZhdGF0cyQubWFwKCB4ID0+IHguZGF0YVsgMCBdLmF2YXRhclVybCApXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfSBjYXRjaCAoIGUgKSB7XG4gICAgICAgICAgICByZXR1cm4gY3R4LmJvZHkgPSB7IHN0YXR1czogNTAwIH07XG4gICAgICAgIH1cbiAgICB9KVxuXG4gICAgLyoqXG4gICAgICog5raI5oGv5o6o6YCBIC0g5YKs5qy+XG4gICAgICoge1xuICAgICAqICAgICB0b3VzZXIgKCBvcGVuaWQgKVxuICAgICAqICAgICBmb3JtX2lkIO+8iCDmiJbogIXmmK8gcHJlcGF5X2lkIO+8iVxuICAgICAqICAgICBwYWdlPzogc3RyaW5nXG4gICAgICogICAgIGRhdGE6IHsgXG4gICAgICogICAgICAgICBcbiAgICAgKiAgICAgfVxuICAgICAqIH1cbiAgICAgKi9cbiAgICBhcHAucm91dGVyKCdub3RpZmljYXRpb24tZ2V0bW9uZXknLCBhc3luYyggY3R4LCBuZXh0ICkgPT4ge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgXG4gICAgICAgICAgICBjb25zdCBwYWdlID0gZXZlbnQuZGF0YS5wYWdlIHx8ICdwYWdlcy9vcmRlci1saXN0L2luZGV4JztcbiAgICAgICAgICAgIGNvbnN0IHsgdG91c2VyLCBmb3JtX2lkLCBkYXRhLCBwcmVwYXlfaWQgfSA9IGV2ZW50LmRhdGE7XG5cbiAgICAgICAgICAgIC8vIOiOt+WPlnRva2VuXG4gICAgICAgICAgICBjb25zdCByZXN1bHQgPSBhd2FpdCAoYXhpb3MgYXMgYW55KSh7XG4gICAgICAgICAgICAgICAgbWV0aG9kOiAnZ2V0JyxcbiAgICAgICAgICAgICAgICB1cmw6IGBodHRwczovL2FwaS53ZWl4aW4ucXEuY29tL2NnaS1iaW4vdG9rZW4/Z3JhbnRfdHlwZT1jbGllbnRfY3JlZGVudGlhbCZhcHBpZD0ke0NPTkZJRy5hcHAuaWR9JnNlY3JldD0ke0NPTkZJRy5hcHAuc2VjcmVjdH1gXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgY29uc3QgeyBhY2Nlc3NfdG9rZW4sIGVycmNvZGUgfSA9IHJlc3VsdC5kYXRhO1xuXG4gICAgICAgICAgICBpZiAoIGVycmNvZGUgKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgJ+eUn+aIkGFjY2Vzc190b2tlbumUmeivrydcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgY29uc3QgcmVxRGF0YSA9IHsgfTtcbiAgICAgICAgICAgIGNvbnN0IHJlcURhdGEkID0ge1xuICAgICAgICAgICAgICAgIHBhZ2UsXG4gICAgICAgICAgICAgICAgdG91c2VyLFxuICAgICAgICAgICAgICAgIHByZXBheV9pZCxcbiAgICAgICAgICAgICAgICBmb3JtX2lkLFxuICAgICAgICAgICAgICAgIHRlbXBsYXRlX2lkOiBDT05GSUcubm90aWZpY2F0aW9uX3RlbXBsYXRlLmdldE1vbmV5MyxcbiAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICAgIC8vIOi0reS5sOaXtumXtFxuICAgICAgICAgICAgICAgICAgICBcImtleXdvcmQxXCI6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIFwidmFsdWVcIjogZGF0YS50aXRsZVxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAvLyDorqLljZXmgLvku7dcbiAgICAgICAgICAgICAgICAgICAgXCJrZXl3b3JkMlwiOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBcInZhbHVlXCI6IGRhdGEudGltZVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgT2JqZWN0LmtleXMoIHJlcURhdGEkICkubWFwKCBrZXkgPT4ge1xuICAgICAgICAgICAgICAgIGlmICggISFyZXFEYXRhJFsga2V5IF0pIHtcbiAgICAgICAgICAgICAgICAgICAgcmVxRGF0YVsga2V5IF0gPSByZXFEYXRhJFsga2V5IF07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIC8vIOWPkemAgeaOqOmAgVxuICAgICAgICAgICAgY29uc3Qgc2VuZCA9IGF3YWl0IChheGlvcyBhcyBhbnkpKHtcbiAgICAgICAgICAgICAgICBkYXRhOiByZXFEYXRhLFxuICAgICAgICAgICAgICAgIG1ldGhvZDogJ3Bvc3QnLFxuICAgICAgICAgICAgICAgIHVybDogYGh0dHBzOi8vYXBpLndlaXhpbi5xcS5jb20vY2dpLWJpbi9tZXNzYWdlL3d4b3Blbi90ZW1wbGF0ZS9zZW5kP2FjY2Vzc190b2tlbj0ke2FjY2Vzc190b2tlbn1gXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgXG4gICAgICAgICAgICByZXR1cm4gY3R4LmJvZHkgPSB7XG4gICAgICAgICAgICAgICAgZGF0YTogc2VuZC5kYXRhLFxuICAgICAgICAgICAgICAgIHN0YXR1czogMjAwXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfSBjYXRjaCAoIGUgKSB7XG4gICAgICAgICAgICByZXR1cm4gY3R4LmJvZHkgPSB7IG1lc3NhZ2U6IGUsIHN0YXR1czogNTAwIH1cbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgLyoqXG4gICAgICogQGRlc2NyaXB0aW9uXG4gICAgICog6YCa6L+H5Yqg6Kej5a+G5a6i5pyN57uZ55qE5a+G56CB77yM5p2l5aKe5Yqg5p2D6ZmQ44CB5Yid5aeL5YyW5pWw5o2u5bqTXG4gICAgICovXG4gICAgYXBwLnJvdXRlcignYWRkLWF1dGgtYnktcHN3JywgYXN5bmMoIGN0eCwgbmV4dCApID0+IHtcbiAgICAgICAgdHJ5IHtcblxuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICBhd2FpdCAoZGIgYXMgYW55KS5jcmVhdGVDb2xsZWN0aW9uKCdtYW5hZ2VyLW1lbWJlcicpO1xuICAgICAgICAgICAgICAgIGF3YWl0IChkYiBhcyBhbnkpLmNyZWF0ZUNvbGxlY3Rpb24oJ2F1dGhwc3cnKTtcbiAgICAgICAgICAgIH0gY2F0Y2ggKCBlICkgeyB9XG5cbiAgICAgICAgICAgIGxldCByZXN1bHQgPSAnJztcbiAgICAgICAgICAgIGNvbnN0IHsgc2FsdCB9ID0gQ09ORklHLmF1dGg7XG4gICAgICAgICAgICBjb25zdCBvcGVuaWQgPSBldmVudC51c2VySW5mby5vcGVuSWQ7XG4gICAgICAgICAgICBjb25zdCB7IHBzdywgY29udGVudCB9ID0gZXZlbnQuZGF0YTtcblxuICAgICAgICAgICAgY29uc3QgZ2V0RXJyID0gbWVzc2FnZSA9PiAoe1xuICAgICAgICAgICAgICAgIG1lc3NhZ2UsXG4gICAgICAgICAgICAgICAgc3RhdHVzOiA1MDAsXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICBjb25zdCBkZWNpcGhlciA9IGNyeXB0by5jcmVhdGVEZWNpcGhlcignYWVzMTkyJywgc2FsdCApO1xuICAgICAgICAgICAgICAgIGNvbnN0IGRlY3J5cHRlZCA9IGRlY2lwaGVyLnVwZGF0ZSggcHN3LCAnaGV4JywgJ3V0ZjgnICk7XG4gICAgICAgICAgICAgICAgcmVzdWx0ID0gZGVjcnlwdGVkICsgZGVjaXBoZXIuZmluYWwoJ3V0ZjgnKTtcbiAgICAgICAgICAgIH0gY2F0Y2ggKCBlICkge1xuICAgICAgICAgICAgICAgIHJldHVybiBjdHguYm9keSA9IGdldEVycign5a+G6ZKl6ZSZ6K+v77yM6K+35qC45a+5Jyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGNvbnN0IFsgY190aW1lc3RhbXAsIGNfYXBwaWQsIGNfY29udGVudCwgY19tYXggXSA9IHJlc3VsdC5zcGxpdCgnLScpO1xuXG4gICAgICAgICAgICBpZiAoIGdldE5vdyggdHJ1ZSApIC0gTnVtYmVyKCBjX3RpbWVzdGFtcCApID4gMzAgKiA2MCAqIDEwMDAgKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGN0eC5ib2R5ID0gZ2V0RXJyKCflr4bpkqXlt7Lov4fmnJ/vvIzor7fogZTns7vlrqLmnI0nKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKCBjX2FwcGlkICE9PSBDT05GSUcuYXBwLmlkICkge1xuICAgICAgICAgICAgICAgIHJldHVybiBjdHguYm9keSA9IGdldEVycign5a+G6ZKl5LiO5bCP56iL5bqP5LiN5YWz6IGUJyk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICggY19jb250ZW50LnJlcGxhY2UoL1xccysvZywgJycpICE9PSBjb250ZW50LnJlcGxhY2UoL1xccysvZywgJycpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGN0eC5ib2R5ID0gZ2V0RXJyKCfmj5DnpLror43plJnor6/vvIzor7fogZTns7vlrqLmnI0nKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiBhdXRocHN3IOihqFxuICAgICAgICAgICAgICogXG4gICAgICAgICAgICAgKiB7XG4gICAgICAgICAgICAgKiAgICBhcHBJZCxcbiAgICAgICAgICAgICAqICAgIHRpbWVzdGFtcCxcbiAgICAgICAgICAgICAqICAgIGNvdW50XG4gICAgICAgICAgICAgKiB9XG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIGNvbnN0IGNoZWNrJCA9IGF3YWl0IGRiLmNvbGxlY3Rpb24oJ2F1dGhwc3cnKSBcbiAgICAgICAgICAgICAgICAud2hlcmUoe1xuICAgICAgICAgICAgICAgICAgICBhcHBJZDogY19hcHBpZCxcbiAgICAgICAgICAgICAgICAgICAgdGltZXN0YW1wOiBjX3RpbWVzdGFtcFxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLmdldCggKTtcbiAgICAgICAgICAgIGNvbnN0IHRhcmdldCA9IGNoZWNrJC5kYXRhWyAwIF07XG5cbiAgICAgICAgICAgIC8vIOWvhumSpeW3suiiq+S9v+eUqFxuICAgICAgICAgICAgaWYgKCAhIXRhcmdldCApIHtcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAvLyDmrKHmlbDkuI3og73lpJrkuo4yXG4gICAgICAgICAgICAgICAgaWYgKCB0YXJnZXQuY291bnQgPj0gMiApIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGN0eC5ib2R5ID0gZ2V0RXJyKCflr4bpkqXlt7Looqvkvb/nlKjvvIzor7fogZTns7vlrqLmnI0nKTtcblxuICAgICAgICAgICAgICAgIC8vIOabtOaWsOWvhumSpeS/oeaBr1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGF3YWl0IGRiLmNvbGxlY3Rpb24oJ2F1dGhwc3cnKVxuICAgICAgICAgICAgICAgICAgICAgICAgLmRvYyggU3RyaW5nKCB0YXJnZXQuX2lkICkpXG4gICAgICAgICAgICAgICAgICAgICAgICAudXBkYXRlKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvdW50OiBfLmluYyggMSApXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8g5Yib5bu65a+G6ZKl5L+h5oGvXG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGF3YWl0IGRiLmNvbGxlY3Rpb24oJ2F1dGhwc3cnKVxuICAgICAgICAgICAgICAgICAgICAuYWRkKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb3VudDogMSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhcHBJZDogY19hcHBpZCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aW1lc3RhbXA6IGNfdGltZXN0YW1wXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIOaKiuW9k+WJjeS6uu+8jOWKoOWFpeWIsOeuoeeQhuWRmFxuICAgICAgICAgICAgY29uc3QgY2hlY2tNYW5hZ2VyJCA9IGF3YWl0IGRiLmNvbGxlY3Rpb24oJ21hbmFnZXItbWVtYmVyJylcbiAgICAgICAgICAgICAgICAud2hlcmUoe1xuICAgICAgICAgICAgICAgICAgICBvcGVuaWRcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIC5nZXQoICk7XG4gICAgICAgICAgICBjb25zdCB0YXJnZXRNYW5hZ2VyID0gY2hlY2tNYW5hZ2VyJC5kYXRhWyAwIF07XG5cbiAgICAgICAgICAgIGlmICggIXRhcmdldE1hbmFnZXIgKSB7XG4gICAgICAgICAgICAgICAgYXdhaXQgZGIuY29sbGVjdGlvbignbWFuYWdlci1tZW1iZXInKVxuICAgICAgICAgICAgICAgICAgICAuYWRkKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvcGVuaWQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29udGVudDogY19jb250ZW50LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNyZWF0ZVRpbWU6IGdldE5vdyggdHJ1ZSApXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIOWIneWni+WMluWQhOS4quihqFxuICAgICAgICAgICAgYXdhaXQgaW5pdERCKCApO1xuXG4gICAgICAgICAgICByZXR1cm4gY3R4LmJvZHkgPSB7XG4gICAgICAgICAgICAgICAgc3RhdHVzOiAyMDBcbiAgICAgICAgICAgIH1cblxuICAgICAgICB9IGNhdGNoICggZSApIHtcbiAgICAgICAgICAgIHJldHVybiBjdHguYm9keSA9IHtcbiAgICAgICAgICAgICAgICBzdGF0dXM6IDUwMCxcbiAgICAgICAgICAgICAgICBtZXNzYWdlOiAn5a+G6ZKl5qOA5p+l5Y+R55Sf6ZSZ6K+vJ1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICAvKipcbiAgICAgKiBAZGVzY3JpcHRpb25cbiAgICAgKiDmn6Xor6LlupTnlKjphY3nva5cbiAgICAgKi9cbiAgICBhcHAucm91dGVyKCdjaGVjay1hcHAtY29uZmlnJywgYXN5bmMoIGN0eCwgbmV4dCApID0+IHtcbiAgICAgICAgdHJ5IHtcblxuICAgICAgICAgICAgbGV0IGNvbmZpZ09iaiA9IHsgfTtcbiAgICAgICAgICAgIGNvbnN0IGNvbmZpZyQgPSBhd2FpdCBkYi5jb2xsZWN0aW9uKCdhcHAtY29uZmlnJylcbiAgICAgICAgICAgICAgICAud2hlcmUoeyB9KVxuICAgICAgICAgICAgICAgIC5nZXQoICk7XG5cbiAgICAgICAgICAgIGNvbnN0IG1ldGEgPSBjb25maWckLmRhdGEubWFwKCBjb25mID0+IHtcbiAgICAgICAgICAgICAgICBjb25maWdPYmogPSBPYmplY3QuYXNzaWduKHsgfSwgY29uZmlnT2JqLCB7XG4gICAgICAgICAgICAgICAgICAgIFsgY29uZi50eXBlIF06IGNvbmYudmFsdWVcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHJldHVybiBjdHguYm9keSA9IHtcbiAgICAgICAgICAgICAgICBkYXRhOiBjb25maWdPYmosXG4gICAgICAgICAgICAgICAgc3RhdHVzOiAyMDBcbiAgICAgICAgICAgIH1cblxuICAgICAgICB9IGNhdGNoICggZSApIHtcbiAgICAgICAgICAgIHJldHVybiBjdHguYm9keSA9IHtcbiAgICAgICAgICAgICAgICBzdGF0dXM6IDUwMFxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICAvKipcbiAgICAgKiBAZGVzY3JpcHRpb25cbiAgICAgKiDmm7TmlrDlupTnlKjphY3nva5cbiAgICAgKiAtLS0tLS0tLS0tLS0tLVxuICAgICAqIGNvbmZpZ3M6IHtcbiAgICAgKiAgICBbIGtleTogc3RyaW5nIF06IGFueSBcbiAgICAgKiB9XG4gICAgICovXG4gICAgYXBwLnJvdXRlcigndXBkYXRlLWFwcC1jb25maWcnLCBhc3luYyggY3R4LCBuZXh0ICkgPT4ge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgY29uc3QgeyBjb25maWdzIH0gPSBldmVudC5kYXRhO1xuXG4gICAgICAgICAgICBhd2FpdCBQcm9taXNlLmFsbChcbiAgICAgICAgICAgICAgICBPYmplY3Qua2V5cyggY29uZmlncyApXG4gICAgICAgICAgICAgICAgICAgIC5tYXAoIGFzeW5jIGNvbmZpZ0tleSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCB0YXJnZXQkID0gYXdhaXQgZGIuY29sbGVjdGlvbignYXBwLWNvbmZpZycpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLndoZXJlKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogY29uZmlnS2V5XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAuZ2V0KCApXG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICggIXRhcmdldCQuZGF0YVsgMCBdKSB7IHJldHVybjsgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICBhd2FpdCBkYi5jb2xsZWN0aW9uKCdhcHAtY29uZmlnJylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAuZG9jKCBTdHJpbmcoIHRhcmdldCQuZGF0YVsgMCBdLl9pZCApKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC51cGRhdGUoe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZTogY29uZmlnc1sgY29uZmlnS2V5IF1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICApO1xuXG4gICAgICAgICAgICByZXR1cm4gY3R4LmJvZHkgPSB7XG4gICAgICAgICAgICAgICAgc3RhdHVzOiAyMDBcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBjYXRjaCAoIGUgKSB7XG4gICAgICAgICAgICByZXR1cm4gY3R4LmJvZHkgPSB7XG4gICAgICAgICAgICAgICAgc3RhdHVzOiA1MDBcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0pXG5cbiAgICAvKiogXG4gICAgICogQGRlc2NyaXB0aW9uXG4gICAgICog55Sf5oiQ5LqM57u056CBXG4gICAgICoge1xuICAgICAqICAgICBwYWdlXG4gICAgICogICAgIHNjZW5lXG4gICAgICogfVxuICAgICAqL1xuICAgIGFwcC5yb3V0ZXIoJ2NyZWF0ZS1xcmNvZGUnLCBhc3luYyggY3R4LCBuZXh0ICkgPT4ge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgY29uc3QgeyBwYWdlLCBzY2VuZSB9ID0gZXZlbnQuZGF0YTtcbiAgICAgICAgICAgIGNvbnN0IHJlc3VsdCA9IGF3YWl0IGNsb3VkLm9wZW5hcGkud3hhY29kZS5nZXRVbmxpbWl0ZWQoe1xuICAgICAgICAgICAgICAgIHBhZ2UsXG4gICAgICAgICAgICAgICAgc2NlbmU6IHNjZW5lIHx8ICcnXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgaWYgKCByZXN1bHQuZXJyQ29kZSAhPT0gMCApIHtcbiAgICAgICAgICAgICAgICB0aHJvdyByZXN1bHQuZXJyTXNnXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiBjdHguYm9keSA9IHtcbiAgICAgICAgICAgICAgICBzdGF0dXM6IDIwMCxcbiAgICAgICAgICAgICAgICBkYXRhOiByZXN1bHQuYnVmZmVyXG4gICAgICAgICAgICB9XG4gICAgICAgIH0gY2F0Y2ggKCBlICkge1xuICAgICAgICAgICAgcmV0dXJuIGN0eC5ib2R5ID0ge1xuICAgICAgICAgICAgICAgIHN0YXR1czogNTAwLFxuICAgICAgICAgICAgICAgIG1lc3NhZ2U6IHR5cGVvZiBlID09PSAnc3RyaW5nJyA/IGUgOiBKU09OLnN0cmluZ2lmeSggZSApXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgIC8qKiBcbiAgICAgKiBAZGVzY3JpcHRpb25cbiAgICAgKiDliJvlu7rkuIDkuKpmb3JtLWlkXG4gICAgICoge1xuICAgICAqICAgICBmb3JtaWRcbiAgICAgKiB9XG4gICAgICogZm9ybS1pZHM6IHtcbiAgICAgKiAgICAgIG9wZW5pZCxcbiAgICAgKiAgICAgIGZvcm1pZCxcbiAgICAgKiAgICAgIGNyZWF0ZVRpbWUsXG4gICAgICogICAgICB0eXBlOiAnbWFuYWdlcicgfCAnbm9ybWFsJ1xuICAgICAqIH1cbiAgICAgKi9cbiAgICBhcHAucm91dGVyKCdjcmVhdGUtZm9ybWlkJywgYXN5bmMoIGN0eCwgbmV4dCApID0+IHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGNvbnN0IG9wZW5pZCA9IGV2ZW50LnVzZXJJbmZvLm9wZW5JZDtcbiAgICAgICAgICAgIGNvbnN0IHsgZm9ybWlkIH0gPSBldmVudC5kYXRhOyBcbiAgICAgICAgICAgIGNvbnN0IGZpbmQkID0gYXdhaXQgZGIuY29sbGVjdGlvbignbWFuYWdlci1tZW1iZXInKVxuICAgICAgICAgICAgICAgIC53aGVyZSh7XG4gICAgICAgICAgICAgICAgICAgIG9wZW5pZFxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLmNvdW50KCApO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICBjb25zdCBjcmVhdGUkID0gYXdhaXQgZGIuY29sbGVjdGlvbignZm9ybS1pZHMnKVxuICAgICAgICAgICAgICAgIC5hZGQoe1xuICAgICAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBvcGVuaWQsXG4gICAgICAgICAgICAgICAgICAgICAgICBmb3JtaWQsXG4gICAgICAgICAgICAgICAgICAgICAgICBjcmVhdGVUaW1lOiBnZXROb3coIHRydWUgKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6IGZpbmQkLnRvdGFsID4gMCA/ICdtYW5hZ2VyJyA6ICdub3JtYWwnXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGN0eC5ib2R5ID0ge1xuICAgICAgICAgICAgICAgIHN0YXR1czogMjAwXG4gICAgICAgICAgICB9XG4gICAgICAgIH0gY2F0Y2ggKCBlICkge1xuICAgICAgICAgICAgY3R4LmJvZHkgPSB7XG4gICAgICAgICAgICAgICAgc3RhdHVzOiAyMDBcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgLyoqXG4gICAgICogQGRlc2NyaXB0aW9uXG4gICAgICog5qih5p2/5o6o6YCB5pyN5Yqh77yM5raI6LS5Zm9ybS1pZHNcbiAgICAgKiB7XG4gICAgICogICAgICBvcGVuaWRcbiAgICAgKiAgICAgIHR5cGU6ICdidXlQaW4nIHwgJ2J1eScgfCAnZ2V0TW9uZXknIHwgJ3dhaXRQaW4nIHwgJ25ld09yZGVyJ1xuICAgICAqICAgICAgdGV4dHM6IFsgJ3h4JywgJ3l5JyBdXG4gICAgICogICAgICA/cGFnZVxuICAgICAqICAgICAgP3ByZXBheV9pZFxuICAgICAqIH1cbiAgICAgKi9cbiAgICBhcHAucm91dGVyKCdwdXNoLXRlbXBsYXRlJywgYXN5bmMoIGN0eCwgbmV4dCApID0+IHtcbiAgICAgICAgdHJ5IHtcblxuICAgICAgICAgICAgbGV0IGZvcm1pZF9pZDogYW55ID0gJyc7XG4gICAgICAgICAgICBsZXQgZm9ybWlkID0gZXZlbnQuZGF0YS5wcmVwYXlfaWQ7XG4gICAgICAgICAgICBjb25zdCB7IHR5cGUsIHRleHRzIH0gPSBldmVudC5kYXRhO1xuICAgICAgICAgICAgY29uc3Qgb3BlbmlkID0gZXZlbnQuZGF0YS5vcGVuSWQgfHwgZXZlbnQuZGF0YS5vcGVuaWQgfHwgZXZlbnQudXNlckluZm8ub3BlbklkO1xuICAgICAgICAgICAgY29uc3QgcGFnZSA9IGV2ZW50LmRhdGEucGFnZSB8fCAncGFnZXMvb3JkZXItbGlzdC9pbmRleCc7XG5cbiAgICAgICAgICAgIC8vIOWmguaenOayoeaciXByZXBheV9pZCwg5bCx5Y675ou/6K+l55So5oi355qEZm9ybV9pZFxuICAgICAgICAgICAgaWYgKCAhZm9ybWlkICkge1xuICAgICAgICAgICAgICAgIGNvbnN0IGZpbmQkID0gYXdhaXQgZGIuY29sbGVjdGlvbignZm9ybS1pZHMnKVxuICAgICAgICAgICAgICAgICAgICAud2hlcmUoe1xuICAgICAgICAgICAgICAgICAgICAgICAgb3BlbmlkXG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgIC5saW1pdCggMSApXG4gICAgICAgICAgICAgICAgICAgIC5nZXQoICk7XG5cbiAgICAgICAgICAgICAgICBpZiAoICFmaW5kJC5kYXRhWyAwIF0pIHtcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgYOivpeeUqOaItyR7b3BlbmlkfeayoeaciWZvcm1pZOOAgXByZXBheV9pZGA7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgZm9ybWlkID0gZmluZCQuZGF0YVsgMCBdLmZvcm1pZDtcbiAgICAgICAgICAgICAgICBmb3JtaWRfaWQgPSBmaW5kJC5kYXRhWyAwIF0uX2lkO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBsZXQgdGV4dERhdGEgPSB7IH07XG4gICAgICAgICAgICB0ZXh0cy5tYXAoKCB0ZXh0LCBpbmRleCApID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCBrZXlUZXh0ID0gYGtleXdvcmQke2luZGV4ICsgMX1gO1xuICAgICAgICAgICAgICAgIHRleHREYXRhID0gT2JqZWN0LmFzc2lnbih7IH0sIHRleHREYXRhLCB7XG4gICAgICAgICAgICAgICAgICAgIFsga2V5VGV4dCBdIDoge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU6IHRleHRcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgY29uc3Qgd2VhcHBUZW1wbGF0ZU1zZyA9IHtcbiAgICAgICAgICAgICAgICBwYWdlLFxuICAgICAgICAgICAgICAgIGRhdGE6IHRleHREYXRhLFxuICAgICAgICAgICAgICAgIGZvcm1JZDogZm9ybWlkLFxuICAgICAgICAgICAgICAgIHRlbXBsYXRlSWQ6IENPTkZJRy5wdXNoX3RlbXBsYXRlWyB0eXBlIF0udmFsdWVcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCc9PT3mjqjpgIEnLCB3ZWFwcFRlbXBsYXRlTXNnICk7XG5cbiAgICAgICAgICAgIGNvbnN0IHNlbmQkID0gYXdhaXQgY2xvdWQub3BlbmFwaS51bmlmb3JtTWVzc2FnZS5zZW5kKHtcbiAgICAgICAgICAgICAgICB0b3VzZXI6IG9wZW5pZCxcbiAgICAgICAgICAgICAgICB3ZWFwcFRlbXBsYXRlTXNnXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgaWYgKCBTdHJpbmcoIHNlbmQkLmVyckNvZGUgKSAhPT0gJzAnICkge1xuICAgICAgICAgICAgICAgIHRocm93IHNlbmQkLmVyck1zZztcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8g5Yig6Zmk6K+l5p2hZm9ybS1pZFxuICAgICAgICAgICAgaWYgKCAhIWZvcm1pZF9pZCApIHtcbiAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICBhd2FpdCBkYi5jb2xsZWN0aW9uKCdmb3JtLWlkcycpXG4gICAgICAgICAgICAgICAgICAgICAgICAuZG9jKCBmb3JtaWRfaWQgKVxuICAgICAgICAgICAgICAgICAgICAgICAgLnJlbW92ZSggKTtcbiAgICAgICAgICAgICAgICB9IGNhdGNoICggZSApIHsgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gY3R4LmJvZHkgPSB7XG4gICAgICAgICAgICAgICAgc3RhdHVzOiAyMDBcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgfSBjYXRjaCAoIGUgKSB7XG4gICAgICAgICAgICByZXR1cm4gY3R4LmJvZHkgPSB7XG4gICAgICAgICAgICAgICAgc3RhdHVzOiA1MDAsXG4gICAgICAgICAgICAgICAgbWVzc2FnZTogdHlwZW9mIGUgPT09ICdzdHJpbmcnID8gZSA6IEpTT04uc3RyaW5naWZ5KCBlIClcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgLyoqIFxuICAgICAqIEBkZXNjcmlwdGlvblxuICAgICAqIOWQjOS4iu+8jOS6keW8gOWPkeeUqFxuICAgICAqL1xuICAgIGFwcC5yb3V0ZXIoJ3B1c2gtdGVtcGxhdGUtY2xvdWQnLCBhc3luYyggY3R4LCBuZXh0ICkgPT4ge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgY29uc29sZS5sb2coJz09PT09PT09PT09PnB1c2gtdGVtcGxhdGUtY2xvdWQnKVxuICAgICAgICAgICAgLy8g6I635Y+WdG9rZW5cbiAgICAgICAgICAgIGNvbnN0IHJlc3VsdCA9IGF3YWl0IChheGlvcyBhcyBhbnkpKHtcbiAgICAgICAgICAgICAgICBtZXRob2Q6ICdnZXQnLFxuICAgICAgICAgICAgICAgIHVybDogYGh0dHBzOi8vYXBpLndlaXhpbi5xcS5jb20vY2dpLWJpbi90b2tlbj9ncmFudF90eXBlPWNsaWVudF9jcmVkZW50aWFsJmFwcGlkPSR7Q09ORklHLmFwcC5pZH0mc2VjcmV0PSR7Q09ORklHLmFwcC5zZWNyZWN0fWBcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICBjb25zdCB7IGFjY2Vzc190b2tlbiwgZXJyY29kZSB9ID0gcmVzdWx0LmRhdGE7XG5cbiAgICAgICAgICAgIGlmICggZXJyY29kZSApIHtcbiAgICAgICAgICAgICAgICB0aHJvdyAn55Sf5oiQYWNjZXNzX3Rva2Vu6ZSZ6K+vJ1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBsZXQgZm9ybWlkX2lkOiBhbnkgPSAnJztcbiAgICAgICAgICAgIGxldCBmb3JtaWQgPSBldmVudC5kYXRhLnByZXBheV9pZDtcbiAgICAgICAgICAgIGNvbnN0IHsgdHlwZSwgdGV4dHMgfSA9IGV2ZW50LmRhdGE7XG4gICAgICAgICAgICBjb25zdCBvcGVuaWQgPSBldmVudC5kYXRhLm9wZW5JZCB8fCBldmVudC5kYXRhLm9wZW5pZCB8fCBldmVudC51c2VySW5mby5vcGVuSWQ7XG4gICAgICAgICAgICBjb25zdCBwYWdlID0gZXZlbnQuZGF0YS5wYWdlIHx8ICdwYWdlcy9vcmRlci1saXN0L2luZGV4JztcblxuICAgICAgICAgICAgLy8g5aaC5p6c5rKh5pyJcHJlcGF5X2lkLCDlsLHljrvmi7/or6XnlKjmiLfnmoRmb3JtX2lkXG4gICAgICAgICAgICAvLyDlgJLlj5nmi79mb3JtaWRcbiAgICAgICAgICAgIGlmICggIWZvcm1pZCApIHtcbiAgICAgICAgICAgICAgICBjb25zdCBmaW5kJCA9IGF3YWl0IGRiLmNvbGxlY3Rpb24oJ2Zvcm0taWRzJylcbiAgICAgICAgICAgICAgICAgICAgLndoZXJlKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG9wZW5pZCxcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvcm1pZDogXy5uZXEoJ3RoZSBmb3JtSWQgaXMgYSBtb2NrIG9uZScpXG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgIC5vcmRlckJ5KCdjcmVhdGVUaW1lJywgJ2FzYycpXG4gICAgICAgICAgICAgICAgICAgIC5saW1pdCggMSApXG4gICAgICAgICAgICAgICAgICAgIC5nZXQoICk7XG5cbiAgICAgICAgICAgICAgICBpZiAoICFmaW5kJC5kYXRhWyAwIF0pIHtcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgYOivpeeUqOaItyR7b3BlbmlkfeayoeaciWZvcm1pZOOAgXByZXBheV9pZGA7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgZm9ybWlkID0gZmluZCQuZGF0YVsgMCBdLmZvcm1pZDtcbiAgICAgICAgICAgICAgICBmb3JtaWRfaWQgPSBmaW5kJC5kYXRhWyAwIF0uX2lkO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBsZXQgdGV4dERhdGEgPSB7IH07XG4gICAgICAgICAgICB0ZXh0cy5tYXAoKCB0ZXh0LCBpbmRleCApID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCBrZXlUZXh0ID0gYGtleXdvcmQke2luZGV4ICsgMX1gO1xuICAgICAgICAgICAgICAgIHRleHREYXRhID0gT2JqZWN0LmFzc2lnbih7IH0sIHRleHREYXRhLCB7XG4gICAgICAgICAgICAgICAgICAgIFsga2V5VGV4dCBdIDoge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU6IHRleHRcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgY29uc3Qgd2VhcHBfdGVtcGxhdGVfbXNnID0ge1xuICAgICAgICAgICAgICAgIHBhZ2UsXG4gICAgICAgICAgICAgICAgZGF0YTogdGV4dERhdGEsXG4gICAgICAgICAgICAgICAgZm9ybV9pZDogZm9ybWlkLFxuICAgICAgICAgICAgICAgIHRlbXBsYXRlX2lkOiBDT05GSUcucHVzaF90ZW1wbGF0ZVsgdHlwZSBdLnZhbHVlXG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICBjb25zb2xlLmxvZygnPT095o6o6YCBJywgd2VhcHBfdGVtcGxhdGVfbXNnICk7XG5cbiAgICAgICAgICAgIGNvbnN0IHJlcURhdGEgPSB7XG4gICAgICAgICAgICAgICAgdG91c2VyOiBvcGVuaWQsXG4gICAgICAgICAgICAgICAgd2VhcHBfdGVtcGxhdGVfbXNnXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIOWPkemAgeaOqOmAgVxuICAgICAgICAgICAgY29uc3Qgc2VuZCA9IGF3YWl0IChheGlvcyBhcyBhbnkpKHtcbiAgICAgICAgICAgICAgICBkYXRhOiByZXFEYXRhLFxuICAgICAgICAgICAgICAgIG1ldGhvZDogJ3Bvc3QnLFxuICAgICAgICAgICAgICAgIHVybDogYGh0dHBzOi8vYXBpLndlaXhpbi5xcS5jb20vY2dpLWJpbi9tZXNzYWdlL3d4b3Blbi90ZW1wbGF0ZS91bmlmb3JtX3NlbmQ/YWNjZXNzX3Rva2VuPSR7YWNjZXNzX3Rva2VufWBcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBpZiAoIFN0cmluZyggc2VuZC5kYXRhLmVycmNvZGUgKSAhPT0gJzAnICkge1xuICAgICAgICAgICAgICAgIHRocm93IHNlbmQuZGF0YS5lcnJtc2c7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIOWIoOmZpOivpeadoWZvcm0taWRcbiAgICAgICAgICAgIGlmICggISFmb3JtaWRfaWQgKSB7XG4gICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgICAgYXdhaXQgZGIuY29sbGVjdGlvbignZm9ybS1pZHMnKVxuICAgICAgICAgICAgICAgICAgICAgICAgLmRvYyggZm9ybWlkX2lkIClcbiAgICAgICAgICAgICAgICAgICAgICAgIC5yZW1vdmUoICk7XG4gICAgICAgICAgICAgICAgfSBjYXRjaCAoIGUgKSB7IH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgICAgICByZXR1cm4gY3R4LmJvZHkgPSB7XG4gICAgICAgICAgICAgICAgZGF0YTogc2VuZC5kYXRhLFxuICAgICAgICAgICAgICAgIHN0YXR1czogMjAwXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIFxuICAgICAgICB9IGNhdGNoICggZSApIHtcbiAgICAgICAgICAgIHJldHVybiBjdHguYm9keSA9IHtcbiAgICAgICAgICAgICAgICBzdGF0dXM6IDUwMCxcbiAgICAgICAgICAgICAgICBtZXNzYWdlOiB0eXBlb2YgZSA9PT0gJ3N0cmluZycgPyBlIDogSlNPTi5zdHJpbmdpZnkoIGUgKVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSlcblxuICAgIC8qKlxuICAgICAqIEBkZXNjcmlwdGlvblxuICAgICAqIOWIm+W7uuS4gOS4quWIhuS6q+iusOW9lVxuICAgICAqIOihqOe7k+aehCB7XG4gICAgICogICAgICB0byAvLyDlj5fmjqjogIVcbiAgICAgKiAgICAgIGZyb20gLy8g5o6o5bm/6ICFXG4gICAgICogICAgICBwaWRcbiAgICAgKiAgICAgIGNyZWF0ZVRpbWUgLy8g5YiG5Lqr5pe26Ze0XG4gICAgICogICAgICBpc1N1Y2Nlc3M6IGJvb2xlYW4gLy8g5piv5ZCm5o6o5bm/5oiQ5YqfXG4gICAgICogICAgICBzdWNjZXNzVGltZTogLy8g5o6o5bm/5oiQ5Yqf55qE5pe26Ze0XG4gICAgICogfVxuICAgICAqIOivt+axgntcbiAgICAgKiAgICAgcGlkXG4gICAgICogICAgIGZyb21cbiAgICAgKiB9XG4gICAgICovXG4gICAgYXBwLnJvdXRlcignY3JlYXRlLXNoYXJlJywgYXN5bmMoIGN0eCwgbmV4dCApID0+IHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGNvbnN0IG9wZW5pZCA9IGV2ZW50LnVzZXJJbmZvLm9wZW5JZDtcbiAgICAgICAgICAgIGNvbnN0IHsgZnJvbSwgcGlkIH0gPSBldmVudC5kYXRhO1xuXG4gICAgICAgICAgICAvLyDop4TliJkxOumYsumHjeWkjVxuICAgICAgICAgICAgLy8g5aaC5p6cQee7mULmjqjlub/ov4fllYblk4Ex77yM5YiZQ+e7mULmjqjlub/llYblk4Ex5peg5pWIXG4gICAgICAgICAgICBjb25zdCBjb3VudCQgPSBhd2FpdCBkYi5jb2xsZWN0aW9uKCdzaGFyZS1yZWNvcmQnKVxuICAgICAgICAgICAgICAgIC53aGVyZSh7XG4gICAgICAgICAgICAgICAgICAgIHBpZCxcbiAgICAgICAgICAgICAgICAgICAgb3BlbmlkLFxuICAgICAgICAgICAgICAgICAgICBpc1N1Y2Nlc3M6IGZhbHNlXG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAuY291bnQoICk7XG5cbiAgICAgICAgICAgIGlmICggY291bnQkLnRvdGFsID4gMCApIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gY3R4LmJvZHkgPSB7IHN0YXR1czogMjAwIH07XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIOinhOWImTI6IOS4jeiDveiHquW3seaOqOiHquW3sVxuICAgICAgICAgICAgaWYgKCBvcGVuaWQgPT09IGZyb20gKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGN0eC5ib2R5ID0geyBzdGF0dXM6IDIwMCB9O1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyDop4TliJkzOiAyNGjlhoXkuI3og73ph43lpI3mjqhcbiAgICAgICAgICAgIGNvbnN0IGNvdW50MiQgPSBhd2FpdCBkYi5jb2xsZWN0aW9uKCdzaGFyZS1yZWNvcmQnKVxuICAgICAgICAgICAgICAgIC53aGVyZSh7XG4gICAgICAgICAgICAgICAgICAgIHBpZCxcbiAgICAgICAgICAgICAgICAgICAgb3BlbmlkLFxuICAgICAgICAgICAgICAgICAgICBpc1N1Y2Nlc3M6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgIHN1Y2Nlc3NUaW1lOiBfLmd0ZSggZ2V0Tm93KCB0cnVlICkgLSAyNCAqIDYwICogNjAgKiAxMDAwIClcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIC5jb3VudCggKTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgaWYgKCBjb3VudDIkLnRvdGFsID4gMCApIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gY3R4LmJvZHkgPSB7IHN0YXR1czogMjAwIH07XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIOWIm+W7ulxuICAgICAgICAgICAgY29uc3QgY3JlYXRlJCA9IGF3YWl0IGRiLmNvbGxlY3Rpb24oJ3NoYXJlLXJlY29yZCcpXG4gICAgICAgICAgICAgICAgLmFkZCh7XG4gICAgICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHBpZCxcbiAgICAgICAgICAgICAgICAgICAgICAgIGZyb20sXG4gICAgICAgICAgICAgICAgICAgICAgICBvcGVuaWQsXG4gICAgICAgICAgICAgICAgICAgICAgICBpc1N1Y2Nlc3M6IGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICAgICAgY3JlYXRlVGltZTogZ2V0Tm93KCB0cnVlIClcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICByZXR1cm4gY3R4LmJvZHkgPSB7IHN0YXR1czogMjAwIH07XG5cbiAgICAgICAgfSBjYXRjaCAoIGUgKSB7XG4gICAgICAgICAgICByZXR1cm4gY3R4LmJvZHkgPSB7XG4gICAgICAgICAgICAgICAgc3RhdHVzOiA1MDBcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0pXG5cbiAgICByZXR1cm4gYXBwLnNlcnZlKCApO1xuXG59XG5cbmNvbnN0IHRpbWUgPSB0cyA9PiBuZXcgUHJvbWlzZSggcmVzb3ZsZSA9PiB7XG4gICAgc2V0VGltZW91dCgoICkgPT4gcmVzb3ZsZSggKSwgdHMgKTtcbn0pXG5cbi8qKlxuICog5Yid5aeL5YyW5pWw5o2u5bqT44CB5Z+656GA5pWw5o2uXG4gKi9cbmNvbnN0IGluaXREQiA9ICggKSA9PiBuZXcgUHJvbWlzZSggYXN5bmMgcmVzb2x2ZSA9PiB7XG4gICAgdHJ5IHtcblxuICAgICAgICAvKiog5Yid5aeL5YyW6KGoICovXG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBjb25zdCBjb2xsZWN0aW9ucyA9IENPTkZJRy5jb2xsZWN0aW9ucztcbiAgICAgICAgICAgIGF3YWl0IFByb21pc2UuYWxsKFxuICAgICAgICAgICAgICAgIGNvbGxlY3Rpb25zLm1hcCggY29sbGVjdGlvbk5hbWUgPT4gKGRiIGFzIGFueSkuY3JlYXRlQ29sbGVjdGlvbiggY29sbGVjdGlvbk5hbWUgKSlcbiAgICAgICAgICAgICk7XG4gICAgICAgIH0gY2F0Y2ggKCBlICkgeyB9XG5cbiAgICAgICAgYXdhaXQgdGltZSggODAwICk7XG5cbiAgICAgICAgLyoqIOWIneWni+WMluaVsOaNruWtl+WFuCAqL1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgY29uc3QgZGljcyA9IENPTkZJRy5kaWM7XG4gICAgICAgICAgICBhd2FpdCBQcm9taXNlLmFsbChcbiAgICAgICAgICAgICAgICBkaWNzLm1hcCggYXN5bmMgZGljU2V0ID0+IHtcblxuICAgICAgICAgICAgICAgICAgICBjb25zdCB0YXJnZXREaWMkID0gYXdhaXQgZGIuY29sbGVjdGlvbignZGljJylcbiAgICAgICAgICAgICAgICAgICAgICAgIC53aGVyZSh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYmVsb25nOiBkaWNTZXQuYmVsb25nXG4gICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAgICAgLmdldCggKTtcblxuICAgICAgICAgICAgICAgICAgICBjb25zdCB0YXJnZXREaWMgPSB0YXJnZXREaWMkLmRhdGFbIDAgXTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCAhIXRhcmdldERpYyApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGF3YWl0IGRiLmNvbGxlY3Rpb24oJ2RpYycpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLmRvYyggU3RyaW5nKCB0YXJnZXREaWMuX2lkICkpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLnNldCh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGE6IGRpY1NldFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBhd2FpdCBkYi5jb2xsZWN0aW9uKCdkaWMnKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5hZGQoe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhOiBkaWNTZXRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICApO1xuICAgICAgICB9IGNhdGNoICggZSApIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdlZWUnLCBlICk7XG4gICAgICAgIH1cblxuICAgICAgICAvKiog5Yid5aeL5YyW5bqU55So6YWN572uICovXG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBjb25zdCBhcHBDb25mID0gQ09ORklHLmFwcENvbmZzO1xuICAgICAgICAgICAgYXdhaXQgUHJvbWlzZS5hbGwoXG4gICAgICAgICAgICAgICAgYXBwQ29uZi5tYXAoIGFzeW5jIGNvbmYgPT4ge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCB0YXJnZXRDb25mJCA9IGF3YWl0IGRiLmNvbGxlY3Rpb24oJ2FwcC1jb25maWcnKVxuICAgICAgICAgICAgICAgICAgICAgICAgLndoZXJlKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiBjb25mLnR5cGVcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgICAgICAuZ2V0KCApO1xuXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHRhcmdldENvbmYgPSB0YXJnZXRDb25mJC5kYXRhWyAwIF07XG4gICAgICAgICAgICAgICAgICAgIGlmICggISF0YXJnZXRDb25mICkge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8g55Sx5LqO6YWN572u5bey57uP55Sf5pWI5LiU5oqV5YWl5L2/55So77yM6L+Z6YeM5LiN6IO955u05o6l5pu05pS55bey5pyJ55qE57q/5LiK6YWN572uXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBhd2FpdCBkYi5jb2xsZWN0aW9uKCdhcHAtY29uZmlnJylcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vICAgICAuZG9jKCBTdHJpbmcoIHRhcmdldENvbmYuX2lkICkpXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyAgICAgLnNldCh7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyAgICAgICAgIGRhdGE6IGNvbmZcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vICAgICB9KTtcblxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgYXdhaXQgZGIuY29sbGVjdGlvbignYXBwLWNvbmZpZycpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLmFkZCh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGE6IGNvbmZcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICApO1xuICAgICAgICB9IGNhdGNoICggZSApIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdlZWUnLCBlICk7XG4gICAgICAgIH1cblxuICAgICAgICByZXNvbHZlKCApO1xuXG4gICAgfSBjYXRjaCAoIGUgKSB7IHJlc29sdmUoICk7fVxufSk7Il19