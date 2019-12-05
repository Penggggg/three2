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
            var coupons, openid, trips$, trips, trip, orders$, coupons$, coupons2$, e_9;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 6, , 7]);
                        coupons = 0;
                        openid = event.userInfo.openId;
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
                                openid: openid,
                                base_status: _.neq('5')
                            })
                                .count()];
                    case 2:
                        orders$ = _a.sent();
                        coupons$ = {
                            total: 0
                        };
                        if (!!!trip) return [3, 4];
                        return [4, db.collection('coupon')
                                .where({
                                openid: openid,
                                tid: trip._id,
                                type: _.neq('t_daijin'),
                            })
                                .count()];
                    case 3:
                        coupons$ = _a.sent();
                        _a.label = 4;
                    case 4: return [4, db.collection('coupon')
                            .where({
                            openid: openid,
                            isUsed: false,
                            type: 't_daijin',
                        })
                            .count()];
                    case 5:
                        coupons2$ = _a.sent();
                        coupons = coupons$.total + coupons2$.total;
                        return [2, ctx.body = {
                                status: 200,
                                data: {
                                    coupons: coupons,
                                    orders: orders$.total
                                }
                            }];
                    case 6:
                        e_9 = _a.sent();
                        return [2, ctx.body = { status: 500 }];
                    case 7: return [2];
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
        app.router('push-subscribe', function (ctx, next) { return __awaiter(_this, void 0, void 0, function () {
            var _a, type, texts, openid, page, template_1, textData_3, subscribeData, send$, e_22;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        _a = event.data, type = _a.type, texts = _a.texts;
                        openid = event.data.openId || event.data.openid || event.userInfo.openId;
                        page = event.data.page || 'pages/trip-enter/index';
                        template_1 = CONFIG.subscribe_templates[type];
                        textData_3 = {};
                        texts.map(function (text, k) {
                            var _a;
                            textData_3 = __assign({}, textData_3, (_a = {}, _a[template_1.textKeys[k]] = {
                                value: text
                            }, _a));
                        });
                        subscribeData = {
                            page: page,
                            data: textData_3,
                            touser: openid,
                            templateId: template_1.id
                        };
                        console.log('===订阅推送', subscribeData);
                        return [4, cloud.openapi.subscribeMessage.send(subscribeData)];
                    case 1:
                        send$ = _b.sent();
                        if (String(send$.errCode) !== '0') {
                            throw send$.errMsg;
                        }
                        return [2, ctx.body = {
                                status: 200
                            }];
                    case 2:
                        e_22 = _b.sent();
                        return [2, ctx.body = {
                                status: 500,
                                data: e_22
                            }];
                    case 3: return [2];
                }
            });
        }); });
        app.router('push-subscribe-cloud', function (ctx, next) { return __awaiter(_this, void 0, void 0, function () {
            var _a, type, texts, openid, page, template_2, textData_4, subscribeData, result, _b, access_token, errcode, send, e_23;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _c.trys.push([0, 3, , 4]);
                        _a = event.data, type = _a.type, texts = _a.texts;
                        openid = event.data.openId || event.data.openid || event.userInfo.openId;
                        page = event.data.page || 'pages/trip-enter/index';
                        template_2 = CONFIG.subscribe_templates[type];
                        textData_4 = {};
                        texts.map(function (text, k) {
                            var _a;
                            textData_4 = __assign({}, textData_4, (_a = {}, _a[template_2.textKeys[k]] = {
                                value: text
                            }, _a));
                        });
                        subscribeData = {
                            page: page,
                            data: textData_4,
                            touser: openid,
                            templateId: template_2.id
                        };
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
                        return [4, axios({
                                data: subscribeData,
                                method: 'post',
                                url: "https://api.weixin.qq.com/cgi-bin/message/subscribe/send?access_token=" + access_token
                            })];
                    case 2:
                        send = _c.sent();
                        if (String(send.data.errcode) !== '0') {
                            throw send.data.errmsg;
                        }
                        return [2, ctx.body = {
                                status: 200
                            }];
                    case 3:
                        e_23 = _c.sent();
                        return [2, ctx.body = {
                                status: 500,
                                data: e_23
                            }];
                    case 4: return [2];
                }
            });
        }); });
        app.router('create-share', function (ctx, next) { return __awaiter(_this, void 0, void 0, function () {
            var openid, _a, from, pid, count$, count2$, create$, e_24;
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
                        e_24 = _b.sent();
                        return [2, ctx.body = {
                                status: 500
                            }];
                    case 5: return [2];
                }
            });
        }); });
        app.router('push-integral', function (ctx, next) { return __awaiter(_this, void 0, void 0, function () {
            var showMore, openid, user$, user, exp, integral, e_25;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        showMore = event.data.showMore;
                        openid = event.data.openId || event.userInfo.openId;
                        return [4, db.collection('user')
                                .where({
                                openid: openid
                            })
                                .get()];
                    case 1:
                        user$ = _a.sent();
                        user = user$.data[0];
                        exp = !!user ? user.exp || 0 : 0;
                        integral = !!user ? user.push_integral || 0 : 0;
                        return [2, ctx.body = {
                                status: 200,
                                data: !showMore ?
                                    integral :
                                    {
                                        exp: exp,
                                        integral: integral,
                                    }
                            }];
                    case 2:
                        e_25 = _a.sent();
                        return [2, ctx.body = { status: 500 }];
                    case 3: return [2];
                }
            });
        }); });
        app.router('push-integral-use', function (ctx, next) { return __awaiter(_this, void 0, void 0, function () {
            var _a, tids, type_1, openid_1, find$, meta, e_26;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        _a = event.data, tids = _a.tids, type_1 = _a.type;
                        openid_1 = event.data.openId || event.data.openid || event.userInfo.openId;
                        return [4, Promise.all(tids.split(',')
                                .map(function (tid) {
                                return db.collection('integral-use-record')
                                    .where({
                                    tid: tid,
                                    type: type_1,
                                    openid: openid_1
                                })
                                    .get();
                            }))];
                    case 1:
                        find$ = _b.sent();
                        meta = find$
                            .filter(function (x) { return !!x.data[0]; })
                            .map(function (x) { return x.data[0]; });
                        return [2, ctx.body = {
                                data: meta,
                                status: 200
                            }];
                    case 2:
                        e_26 = _b.sent();
                        return [2, ctx.body = {
                                status: 500
                            }];
                    case 3: return [2];
                }
            });
        }); });
        app.router('get-exp', function (ctx, next) { return __awaiter(_this, void 0, void 0, function () {
            var exp, openid, user$, user, bd_uid, body, update$, e_27;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        exp = event.data.exp;
                        openid = event.data.openId || event.data.openid || event.userInfo.openId;
                        return [4, db.collection('user')
                                .where({
                                openid: openid
                            })
                                .get()];
                    case 1:
                        user$ = _a.sent();
                        user = user$.data[0] || null;
                        if (!user) {
                            return [2, ctx.body = { status: 200 }];
                        }
                        ;
                        bd_uid = user._id;
                        body = __assign({}, user, { exp: !user.exp ? exp : user.exp + exp });
                        delete body['_id'];
                        return [4, db.collection('user')
                                .doc(String(bd_uid))
                                .set({
                                data: body
                            })];
                    case 2:
                        update$ = _a.sent();
                        return [2, ctx.body = {
                                status: 200
                            }];
                    case 3:
                        e_27 = _a.sent();
                        return [2, ctx.body = { status: 500 }];
                    case 4: return [2];
                }
            });
        }); });
        app.router('get-integral', function (ctx, next) { return __awaiter(_this, void 0, void 0, function () {
            var integral, openid, user$, user, bd_uid, body, update$, e_28;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        integral = event.data.integral;
                        openid = event.data.openId || event.data.openid || event.userInfo.openId;
                        return [4, db.collection('user')
                                .where({
                                openid: openid
                            })
                                .get()];
                    case 1:
                        user$ = _a.sent();
                        user = user$.data[0] || null;
                        if (!user) {
                            return [2, ctx.body = { status: 200 }];
                        }
                        ;
                        bd_uid = user._id;
                        body = __assign({}, user, { push_integral: !user.push_integral ?
                                integral :
                                Number((user.push_integral + integral).toFixed(2)) });
                        delete body['_id'];
                        return [4, db.collection('user')
                                .doc(String(bd_uid))
                                .set({
                                data: body
                            })];
                    case 2:
                        update$ = _a.sent();
                        return [2, ctx.body = {
                                status: 200
                            }];
                    case 3:
                        e_28 = _a.sent();
                        return [2, ctx.body = { status: 500 }];
                    case 4: return [2];
                }
            });
        }); });
        app.router('get-integral-push', function (ctx, next) { return __awaiter(_this, void 0, void 0, function () {
            var openid, _a, signExp, get_integral, next_integral, week_integral, nextweek_integral, push$, create$, e_29;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 3, , 4]);
                        openid = event.data.openId || event.data.openid || event.userInfo.openId;
                        _a = event.data, signExp = _a.signExp, get_integral = _a.get_integral, next_integral = _a.next_integral, week_integral = _a.week_integral, nextweek_integral = _a.nextweek_integral;
                        return [4, cloud.callFunction({
                                name: 'common',
                                data: {
                                    $url: 'push-subscribe-cloud',
                                    data: {
                                        openid: openid,
                                        type: 'hongbao',
                                        page: 'pages/my/index',
                                        texts: [get_integral + "\u5143\u62B5\u73B0\u91D1\uFF01", "\u4E0B\u5355\u5C31\u80FD\u7528\uFF01\u672C\u5468\u767B\u9646\u9001" + week_integral + "\u5143\uFF01"]
                                    }
                                }
                            })];
                    case 1:
                        push$ = _b.sent();
                        return [4, db.collection('push-timer')
                                .add({
                                data: {
                                    openid: openid,
                                    texts: ["\u767B\u9646\u9886\u53D6" + signExp + "\u70B9\u7ECF\u9A8C", "\u5347\u7EA7\u540E\uFF0C\u5168\u5468\u53EF\u9886" + nextweek_integral + "\u5143\uFF01"],
                                    pushtime: getNow(true) + 2.1 * 60 * 60 * 1000,
                                    desc: '到时间领取经验了',
                                    type: 'user-exp-get'
                                }
                            })];
                    case 2:
                        create$ = _b.sent();
                        return [2, ctx.body = { status: 200 }];
                    case 3:
                        e_29 = _b.sent();
                        return [2, ctx.body = { status: 500 }];
                    case 4: return [2];
                }
            });
        }); });
        app.router('get-subscribe-templates', function (ctx, next) { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                try {
                    return [2, ctx.body = {
                            status: 200,
                            data: CONFIG.subscribe_templates
                        }];
                }
                catch (e) {
                    return [2, ctx.body = { status: 500 }];
                }
                return [2];
            });
        }); });
        app.router('get-user-info', function (ctx, next) { return __awaiter(_this, void 0, void 0, function () {
            var openid, user$, data, e_30;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        openid = event.data.openId || event.data.openid || event.userInfo.openId;
                        return [4, db.collection('user')
                                .where({
                                openid: openid
                            })
                                .get()];
                    case 1:
                        user$ = _a.sent();
                        data = user$.data[0] || null;
                        return [2, ctx.body = {
                                data: data,
                                status: 200
                            }];
                    case 2:
                        e_30 = _a.sent();
                        return [2, ctx.body = {
                                status: 200,
                                data: e_30
                            }];
                    case 3: return [2];
                }
            });
        }); });
        app.router('test', function (ctx, next) { return __awaiter(_this, void 0, void 0, function () {
            var openid, result, e_31;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        openid = event.data.openId || event.data.openid || event.userInfo.openId;
                        return [4, cloud.openapi.subscribeMessage.send({
                                touser: openid,
                                page: 'pages/trip-enter/index',
                                data: {
                                    thing11: {
                                        value: '呵呵呵额'
                                    },
                                    thing6: {
                                        value: '2015年01月05日'
                                    }
                                },
                                templateId: 'u91Cqoo76phn_0o5N_JdqxFKVUF5-f2W5zEjziGO17g'
                            })];
                    case 1:
                        result = _a.sent();
                        return [2, ctx.body = {
                                status: 200,
                                data: result
                            }];
                    case 2:
                        e_31 = _a.sent();
                        return [2, ctx.body = {
                                status: 500,
                                data: e_31
                            }];
                    case 3: return [2];
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
    var collections, e_32, dics, e_33, appConf, e_34, e_35;
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
                e_32 = _a.sent();
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
                e_33 = _a.sent();
                console.log('eee', e_33);
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
                e_34 = _a.sent();
                console.log('eee', e_34);
                return [3, 12];
            case 12:
                resolve();
                return [3, 14];
            case 13:
                e_35 = _a.sent();
                resolve();
                return [3, 14];
            case 14: return [2];
        }
    });
}); }); };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLGlCQWdtREc7O0FBaG1ESCxxQ0FBdUM7QUFDdkMsc0NBQXdDO0FBQ3hDLDZCQUErQjtBQUMvQiwrQkFBaUM7QUFDakMsb0NBQXNDO0FBQ3RDLGlDQUFtQztBQUVuQyxLQUFLLENBQUMsSUFBSSxDQUFDO0lBQ1AsR0FBRyxFQUFFLE9BQU8sQ0FBQyxHQUFHLENBQUMsS0FBSztDQUN6QixDQUFDLENBQUM7QUFFSCxJQUFNLEVBQUUsR0FBZ0IsS0FBSyxDQUFDLFFBQVEsRUFBRyxDQUFDO0FBQzFDLElBQU0sQ0FBQyxHQUFHLEVBQUUsQ0FBQyxPQUFPLENBQUM7QUFRckIsSUFBTSxNQUFNLEdBQUcsVUFBRSxFQUFVO0lBQVYsbUJBQUEsRUFBQSxVQUFVO0lBQ3ZCLElBQUssRUFBRSxFQUFHO1FBQ04sT0FBTyxJQUFJLENBQUMsR0FBRyxFQUFHLENBQUM7S0FDdEI7SUFDRCxJQUFNLE1BQU0sR0FBRyxJQUFJLElBQUksQ0FBRSxJQUFJLElBQUksRUFBRyxDQUFDLGNBQWMsRUFBRyxDQUFDLENBQUM7SUFDeEQsT0FBTyxJQUFJLElBQUksQ0FBRSxNQUFNLENBQUMsT0FBTyxFQUFHLEdBQUcsQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsSUFBSSxDQUFFLENBQUE7QUFDN0QsQ0FBQyxDQUFBO0FBS1ksUUFBQSxJQUFJLEdBQUcsVUFBUSxLQUFLLEVBQUUsT0FBTzs7OztRQUVoQyxHQUFHLEdBQUcsSUFBSSxTQUFTLENBQUMsRUFBRSxLQUFLLE9BQUEsRUFBRSxDQUFDLENBQUM7UUFNckMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxNQUFNLEVBQUUsVUFBTyxHQUFHLEVBQUUsSUFBSTs7Ozs7O3dCQUVyQixXQUFXLEdBQUcsTUFBTSxD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QkFHM0IsT0FBTyxFQUFHLENBQUM7Ozs7Z0JBRUMsT0FBTyxFQUFHLENBQUM7Ozs7O0tBQzlCLENBQUMsRUFoRm9CLENBZ0ZwQixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgY2xvdWQgZnJvbSAnd3gtc2VydmVyLXNkayc7XG5pbXBvcnQgKiBhcyBUY2JSb3V0ZXIgZnJvbSAndGNiLXJvdXRlcic7XG5pbXBvcnQgKiBhcyBheGlvcyBmcm9tICdheGlvcyc7XG5pbXBvcnQgKiBhcyBjcnlwdG8gZnJvbSAnY3J5cHRvJztcbmltcG9ydCAqIGFzIHJwIGZyb20gJ3JlcXVlc3QtcHJvbWlzZSc7XG5pbXBvcnQgKiBhcyBDT05GSUcgZnJvbSAnLi9jb25maWcnO1xuXG5jbG91ZC5pbml0KHtcbiAgICBlbnY6IHByb2Nlc3MuZW52LmNsb3VkXG59KTtcblxuY29uc3QgZGI6IERCLkRhdGFiYXNlID0gY2xvdWQuZGF0YWJhc2UoICk7XG5jb25zdCBfID0gZGIuY29tbWFuZDtcblxuLyoqIFxuICog6L2s5o2i5qC85p6X5bC85rK75pe25Yy6ICs45pe25Yy6XG4gKiBEYXRlKCkubm93KCkgLyBuZXcgRGF0ZSgpLmdldFRpbWUoKSDmmK/ml7bkuI3ml7bmraPluLjnmoQrOFxuICogRGF0ZS50b0xvY2FsU3RyaW5nKCApIOWlveWDj+aYr+S4gOebtOaYrysw55qEXG4gKiDlhYjmi7/liLAgKzDvvIznhLblkI4rOFxuICovXG5jb25zdCBnZXROb3cgPSAoIHRzID0gZmFsc2UgKTogYW55ID0+IHtcbiAgICBpZiAoIHRzICkge1xuICAgICAgICByZXR1cm4gRGF0ZS5ub3coICk7XG4gICAgfVxuICAgIGNvbnN0IHRpbWVfMCA9IG5ldyBEYXRlKCBuZXcgRGF0ZSggKS50b0xvY2FsZVN0cmluZyggKSk7XG4gICAgcmV0dXJuIG5ldyBEYXRlKCB0aW1lXzAuZ2V0VGltZSggKSArIDggKiA2MCAqIDYwICogMTAwMCApXG59XG4vKipcbiAqIEBkZXNjcmlwdGlvbiBcbiAqIOWFrOWFseaooeWdl1xuICovXG5leHBvcnQgY29uc3QgbWFpbiA9IGFzeW5jICggZXZlbnQsIGNvbnRleHQgKSA9PiB7XG5cbiAgICBjb25zdCBhcHAgPSBuZXcgVGNiUm91dGVyKHsgZXZlbnQgfSk7XG5cbiAgICAvKipcbiAgICAgKiBAZGVzY3JpcHRpb25cbiAgICAgKiDliJ3lp4vljJblkITkuKrmlbDmja7lupNcbiAgICAgKi9cbiAgICBhcHAucm91dGVyKCdpbml0JywgYXN5bmMoIGN0eCwgbmV4dCApID0+IHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGNvbnN0IGNvbGxlY3Rpb25zID0gQ09ORklHLmNvbGxlY3Rpb25zO1xuICAgICAgICAgICAgYXdhaXQgUHJvbWlzZS5hbGwoW1xuICAgICAgICAgICAgICAgIGNvbGxlY3Rpb25zLm1hcCggY29sbGVjdGlvbk5hbWUgPT4gKGRiIGFzIGFueSkuY3JlYXRlQ29sbGVjdGlvbiggY29sbGVjdGlvbk5hbWUgKSlcbiAgICAgICAgICAgIF0pXG5cbiAgICAgICAgICAgIHJldHVybiBjdHguYm9keSA9IHsgc3RhdHVzOiAyMDAgfVxuICAgICAgICB9IGNhdGNoICggZSApIHtcbiAgICAgICAgICAgIHJldHVybiBjdHguYm9keSA9IHsgc3RhdHVzOiA1MDAsIG1lc3NhZ2U6IGUgfVxuICAgICAgICB9XG4gICAgfSlcblxuICAgIC8qKlxuICAgICAqIEBkZXNjcmlwdGlvbiBcbiAgICAgKiDmlbDmja7lrZflhbhcbiAgICAgKiB7XG4gICAgICogICAgICBkaWNOYW1lOiAneHh4LHl5eSx6enonXG4gICAgICogICAgICBmaWx0ZXJCanA6IGZhbHNlIHwgdHJ1ZSB8IHVuZGVmaW5lZCDvvIgg5piv5ZCm6L+H5ruk5L+d5YGl5ZOBIO+8iVxuICAgICAqIH1cbiAgICAgKi9cbiAgICBhcHAucm91dGVyKCdkaWMnLCBhc3luYyggY3R4LCBuZXh0ICkgPT4ge1xuICAgICAgICB0cnkge1xuXG4gICAgICAgICAgICAvLyDkv53lgaXlk4HphY3nva5cbiAgICAgICAgICAgIGxldCBianBDb25maWc6IGFueSA9IG51bGw7XG4gICAgICAgICAgICBjb25zdCB7IGRpY05hbWUsIGZpbHRlckJqcCB9ID0gZXZlbnQuZGF0YTtcbiAgICAgICAgICAgIGNvbnN0IGRiUmVzID0gYXdhaXQgZGIuY29sbGVjdGlvbignZGljJylcbiAgICAgICAgICAgICAgICAud2hlcmUoe1xuICAgICAgICAgICAgICAgICAgICBiZWxvbmc6IGRiLlJlZ0V4cCh7XG4gICAgICAgICAgICAgICAgICAgICAgICByZWdleHA6IGRpY05hbWUucmVwbGFjZSgvXFwsL2csICd8JyksXG4gICAgICAgICAgICAgICAgICAgICAgICBvcHRpb25kOiAnaSdcbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIC5nZXQoICk7XG5cbiAgICAgICAgICAgIC8vIOS/neWBpeWTgemFjee9rlxuICAgICAgICAgICAgaWYgKCAhIWZpbHRlckJqcCApIHtcbiAgICAgICAgICAgICAgICBjb25zdCBianBDb25maWckID0gYXdhaXQgZGIuY29sbGVjdGlvbignYXBwLWNvbmZpZycpXG4gICAgICAgICAgICAgICAgICAgIC53aGVyZSh7XG4gICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiAnYXBwLWJqcC12aXNpYmxlJ1xuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAuZ2V0KCApO1xuICAgICAgICAgICAgICAgIGJqcENvbmZpZyA9IGJqcENvbmZpZyQuZGF0YVsgMCBdO1xuICAgICAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgICAgIGxldCByZXN1bHQgPSB7IH07XG4gICAgICAgICAgICBkYlJlcy5kYXRhLm1hcCggZGljID0+IHtcbiAgICAgICAgICAgICAgICByZXN1bHQgPSBPYmplY3QuYXNzaWduKHsgfSwgcmVzdWx0LCB7XG4gICAgICAgICAgICAgICAgICAgIFsgZGljLmJlbG9uZyBdOiBkaWNbIGRpYy5iZWxvbmcgXVxuICAgICAgICAgICAgICAgICAgICAgICAgLmZpbHRlciggeCA9PiAhIXggKVxuICAgICAgICAgICAgICAgICAgICAgICAgLmZpbHRlciggeCA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCAhIWJqcENvbmZpZyAmJiAhYmpwQ29uZmlnLnZhbHVlICkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gU3RyaW5nKCB4LnZhbHVlICkgIT09ICc0J1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgcmV0dXJuIGN0eC5ib2R5ID0ge1xuICAgICAgICAgICAgICAgIHN0YXR1czogMjAwLFxuICAgICAgICAgICAgICAgIGRhdGE6IHJlc3VsdFxuICAgICAgICAgICAgfTtcblxuICAgICAgICB9IGNhdGNoICggZSApIHtcbiAgICAgICAgICAgIHJldHVybiBjdHguYm9keSA9IHtcbiAgICAgICAgICAgICAgICBzdGF0dXM6IDUwMCxcbiAgICAgICAgICAgICAgICBtZXNzYWdlOiBlXG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICAvKipcbiAgICAgKiBAZGVzY3JpcHRpb25cbiAgICAgKiDlvq7kv6HnlKjmiLfkv6Hmga/lrZjlgqhcbiAgICAgKi9cbiAgICBhcHAucm91dGVyKCd1c2VyRWRpdCcsIGFzeW5jKCBjdHgsIG5leHQgKSA9PiB7XG4gICAgICAgIHRyeSB7XG5cbiAgICAgICAgICAgIGNvbnN0IG9wZW5pZCA9IGV2ZW50LnVzZXJJbmZvLm9wZW5JZDtcbiAgICAgICAgICAgIGNvbnN0IGRhdGEkID0gYXdhaXQgZGIuY29sbGVjdGlvbigndXNlcicpXG4gICAgICAgICAgICAgICAgLndoZXJlKHtcbiAgICAgICAgICAgICAgICAgICAgb3BlbmlkXG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAuZ2V0KCApXG4gICAgICAgICAgICAgICAgLmNhdGNoKCBlcnIgPT4geyB0aHJvdyBgJHtlcnJ9YH0pO1xuICAgICAgICBcbiAgICAgICAgICAgIC8vIOWmguaenOS4jeWtmOWcqO+8jOWImeWIm+W7ulxuICAgICAgICAgICAgaWYgKCBkYXRhJC5kYXRhLmxlbmd0aCA9PT0gMCApIHtcbiAgICAgICAgXG4gICAgICAgICAgICAgICAgYXdhaXQgZGIuY29sbGVjdGlvbigndXNlcicpXG4gICAgICAgICAgICAgICAgICAgIC5hZGQoe1xuICAgICAgICAgICAgICAgICAgICAgICAgZGF0YTogT2JqZWN0LmFzc2lnbih7IH0sIGV2ZW50LmRhdGEsIHsgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb3BlbmlkLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGludGVncmFsOiAwXG4gICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICB9KS5jYXRjaCggZXJyID0+IHsgdGhyb3cgYCR7ZXJyfWB9KTtcbiAgICAgICAgXG4gICAgICAgICAgICAvLyDlpoLmnpzlrZjlnKjvvIzliJnmm7TmlrBcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgY29uc3QgbWV0YSA9IE9iamVjdC5hc3NpZ24oeyB9LCBkYXRhJC5kYXRhWyAwIF0sIGV2ZW50LmRhdGEgKTtcbiAgICAgICAgICAgICAgICBkZWxldGUgbWV0YS5faWQ7XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgYXdhaXQgZGIuY29sbGVjdGlvbigndXNlcicpLmRvYygoIGRhdGEkLmRhdGFbIDAgXSBhcyBhbnkpLl9pZCApXG4gICAgICAgICAgICAgICAgICAgIC5zZXQoe1xuICAgICAgICAgICAgICAgICAgICAgICAgZGF0YTogT2JqZWN0LmFzc2lnbih7IH0sIG1ldGEsIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbnRlZ3JhbDogZGF0YSQuZGF0YVsgMCBdLmludGVncmFsXG4gICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICB9KS5jYXRjaCggZXJyID0+IHsgdGhyb3cgYCR7ZXJyfWB9KTtcbiAgICAgICAgICAgIH0gICAgXG5cbiAgICAgICAgICAgIHJldHVybiBjdHguYm9keSA9IHtcbiAgICAgICAgICAgICAgICBzdGF0dXM6IDIwMFxuICAgICAgICAgICAgfTtcblxuICAgICAgICB9IGNhdGNoICggZSApIHtcbiAgICAgICAgICAgIHJldHVybiBjdHguYm9keSA9IHtcbiAgICAgICAgICAgICAgICBzdGF0dXM6IDUwMCxcbiAgICAgICAgICAgICAgICBtZXNzYWdlOiBlXG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICAvKipcbiAgICAgKiBAZGVzY3JpcHRpb25cbiAgICAgKiDmmK/mlrDlrqLov5jmmK/ml6flrqJcbiAgICAgKiDmlrDlrqLvvIzmiJDlip/mlK/ku5jorqLljZUgPD0gM1xuICAgICovXG4gICAgYXBwLnJvdXRlcignaXMtbmV3LWN1c3RvbWVyJywgYXN5bmMoIGN0eCwgbmV4dCApID0+IHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgY29uc3Qgb3BlbmlkID0gZXZlbnQuZGF0YS5vcGVuSWQgfHwgZXZlbnQudXNlckluZm8ub3BlbklkO1xuICAgICAgICAgICAgY29uc3QgZmluZCQgPSBhd2FpdCBkYi5jb2xsZWN0aW9uKCdvcmRlcicpXG4gICAgICAgICAgICAgICAgLndoZXJlKHtcbiAgICAgICAgICAgICAgICAgICAgb3BlbmlkLFxuICAgICAgICAgICAgICAgICAgICBiYXNlX3N0YXR1czogJzMnXG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAuY291bnQoICk7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIHJldHVybiBjdHguYm9keSA9IHtcbiAgICAgICAgICAgICAgICBzdGF0dXM6IDIwMCxcbiAgICAgICAgICAgICAgICBkYXRhOiBmaW5kJC50b3RhbCA8IDNcbiAgICAgICAgICAgIH1cblxuICAgICAgICB9IGNhdGNoICggZSApIHtcbiAgICAgICAgICAgIHJldHVybiBjdHguYm9keSA9IHtcbiAgICAgICAgICAgICAgICBzdGF0dXM6IDIwMCxcbiAgICAgICAgICAgICAgICBkYXRhOiB0cnVlXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgIC8qKiBcbiAgICAgKiBAZGVzY3JpcHRpb25cbiAgICAgKiDlrqLmiLflnKjor6XourrooYznqIvvvIzmmK/lkKbpnIDopoHku5jorqLph5FcbiAgICAgKiB7XG4gICAgICogICAgdGlkXG4gICAgICogfVxuICAgICAqL1xuICAgIGFwcC5yb3V0ZXIoJ3Nob3VsZC1wcmVwYXknLCBhc3luYyggY3R4LCBuZXh0ICkgPT4ge1xuICAgICAgICB0cnkge1xuXG4gICAgICAgICAgICBjb25zdCB7IHRpZCB9ID0gZXZlbnQuZGF0YTtcbiAgICAgICAgICAgIGNvbnN0IG9wZW5pZCA9IGV2ZW50LmRhdGEub3BlbklkIHx8IGV2ZW50LnVzZXJJbmZvLm9wZW5JZDtcblxuICAgICAgICAgICAgY29uc3QgZmluZCQgPSBhd2FpdCBkYi5jb2xsZWN0aW9uKCdvcmRlcicpXG4gICAgICAgICAgICAgICAgLndoZXJlKHtcbiAgICAgICAgICAgICAgICAgICAgb3BlbmlkLFxuICAgICAgICAgICAgICAgICAgICBiYXNlX3N0YXR1czogJzMnXG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAuY291bnQoICk7XG5cbiAgICAgICAgICAgIGNvbnN0IHRyaXAkID0gYXdhaXQgZGIuY29sbGVjdGlvbigndHJpcCcpXG4gICAgICAgICAgICAgICAgLmRvYyggU3RyaW5nKCB0aWQgKSlcbiAgICAgICAgICAgICAgICAuZ2V0KCApO1xuICAgICAgICAgICAgY29uc3QgdHJpcCA9IHRyaXAkLmRhdGE7XG5cbiAgICAgICAgICAgIGNvbnN0IGlzTmV3ID0gZmluZCQudG90YWwgPCAzO1xuXG4gICAgICAgICAgICBjb25zdCBqdWRnZSA9ICggaXNOZXcsIHRyaXAgKSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKCAhdHJpcCApIHsgcmV0dXJuIHRydWU7IH1cbiAgICAgICAgICAgICAgICBpZiAoIGlzTmV3ICYmIHRyaXAucGF5bWVudCA9PT0gJzAnICkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcblxuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoIGlzTmV3ICYmIHRyaXAucGF5bWVudCA9PT0gJzEnICkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcblxuICAgICAgICAgICAgICAgIH0gIGVsc2UgaWYgKCBpc05ldyAmJiB0cmlwLnBheW1lbnQgPT09ICcyJyApIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKCAhaXNOZXcgJiYgdHJpcC5wYXltZW50ID09PSAnMCcgKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgfSAgZWxzZSBpZiAoICFpc05ldyAmJiB0cmlwLnBheW1lbnQgPT09ICcxJyApIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoIGlzTmV3ICYmIHRyaXAucGF5bWVudCA9PT0gJzInICkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIGN0eC5ib2R5ID0ge1xuICAgICAgICAgICAgICAgIHN0YXR1czogMjAwLFxuICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgaXNOZXcsXG4gICAgICAgICAgICAgICAgICAgIHNob3VsZFByZXBheToganVkZ2UoIGlzTmV3LCB0cmlwIClcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfSBjYXRjaCAoIGUgKSB7IHJldHVybiBjdHguYm9keSA9IHsgc3RhdHVzOiA1MDAgfTt9XG4gICAgfSlcblxuICAgIC8qKlxuICAgICAqIOW+ruS/oeaUr+S7mO+8jOi/lOWbnuaUr+S7mGFwaeW/heimgeWPguaVsFxuICAgICAqIC0tLS0tLS0tLS0tIOivt+axgiAtLS0tLS0tLS0tXG4gICAgICoge1xuICAgICAqICAgICAgdG90YWxfZmVlXG4gICAgICogfVxuICAgICAqL1xuICAgIGFwcC5yb3V0ZXIoJ3d4cGF5JywgYXN5bmMoIGN0eCwgbmV4dCApID0+IHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGNvbnN0IHsga2V5LCBib2R5LCBtY2hfaWQsIGF0dGFjaCwgbm90aWZ5X3VybCwgc3BiaWxsX2NyZWF0ZV9pcCB9ID0gQ09ORklHLnd4UGF5O1xuICAgICAgICAgICAgY29uc3QgYXBwaWQgPSBDT05GSUcuYXBwLmlkO1xuICAgICAgICAgICAgY29uc3QgdG90YWxfZmVlID0gZXZlbnQuZGF0YS50b3RhbF9mZWU7XG4gICAgICAgICAgICBjb25zdCBvcGVuaWQgPSBldmVudC51c2VySW5mby5vcGVuSWQ7XG4gICAgICAgICAgICBjb25zdCBub25jZV9zdHIgPSBNYXRoLnJhbmRvbSggKS50b1N0cmluZyggMzYgKS5zdWJzdHIoIDIsIDE1ICk7XG4gICAgICAgICAgICBjb25zdCB0aW1lU3RhbXAgPSBwYXJzZUludChTdHJpbmcoIERhdGUubm93KCkgLyAxMDAwICkpICsgJyc7XG4gICAgICAgICAgICBjb25zdCBvdXRfdHJhZGVfbm8gPSBcIm90blwiICsgbm9uY2Vfc3RyICsgdGltZVN0YW1wO1xuXG4gICAgICAgICAgICBjb25zdCBwYXlzaWduID0gKHsgLi4uYXJncyB9KSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3Qgc2E6IGFueSA9IFsgXVxuICAgICAgICAgICAgICAgIGZvciAoIGxldCBrIGluIGFyZ3MgKSB7XG4gICAgICAgICAgICAgICAgICAgIHNhLnB1c2goIGsgKyAnPScgKyBhcmdzWyBrIF0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBzYS5wdXNoKCdrZXk9JyArIGtleSApO1xuICAgICAgICAgICAgICAgIGNvbnN0IHMgPSAgY3J5cHRvLmNyZWF0ZUhhc2goJ21kNScpLnVwZGF0ZShzYS5qb2luKCcmJyksICd1dGY4JykuZGlnZXN0KCdoZXgnKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gcy50b1VwcGVyQ2FzZSggKTtcbiAgICAgICAgICAgIH1cbiAgICBcbiAgICAgICAgICAgIGxldCBmb3JtRGF0YSA9IFwiPHhtbD5cIjtcbiAgICBcbiAgICAgICAgICAgIGZvcm1EYXRhICs9IFwiPGFwcGlkPlwiICsgYXBwaWQgKyBcIjwvYXBwaWQ+XCJcbiAgICAgICAgXG4gICAgICAgICAgICBmb3JtRGF0YSArPSBcIjxhdHRhY2g+XCIgKyBhdHRhY2ggKyBcIjwvYXR0YWNoPlwiXG4gICAgICAgIFxuICAgICAgICAgICAgZm9ybURhdGEgKz0gXCI8Ym9keT5cIiArIGJvZHkgKyBcIjwvYm9keT5cIlxuICAgICAgICBcbiAgICAgICAgICAgIGZvcm1EYXRhICs9IFwiPG1jaF9pZD5cIiArIG1jaF9pZCArIFwiPC9tY2hfaWQ+XCJcbiAgICAgICAgXG4gICAgICAgICAgICBmb3JtRGF0YSArPSBcIjxub25jZV9zdHI+XCIgKyBub25jZV9zdHIgKyBcIjwvbm9uY2Vfc3RyPlwiXG4gICAgICAgIFxuICAgICAgICAgICAgZm9ybURhdGEgKz0gXCI8bm90aWZ5X3VybD5cIiArIG5vdGlmeV91cmwgKyBcIjwvbm90aWZ5X3VybD5cIlxuICAgICAgICBcbiAgICAgICAgICAgIGZvcm1EYXRhICs9IFwiPG9wZW5pZD5cIiArIG9wZW5pZCArIFwiPC9vcGVuaWQ+XCJcbiAgICAgICAgXG4gICAgICAgICAgICBmb3JtRGF0YSArPSBcIjxvdXRfdHJhZGVfbm8+XCIgKyBvdXRfdHJhZGVfbm8gKyBcIjwvb3V0X3RyYWRlX25vPlwiXG4gICAgICAgIFxuICAgICAgICAgICAgZm9ybURhdGEgKz0gXCI8c3BiaWxsX2NyZWF0ZV9pcD5cIiArIHNwYmlsbF9jcmVhdGVfaXAgKyBcIjwvc3BiaWxsX2NyZWF0ZV9pcD5cIlxuICAgICAgICBcbiAgICAgICAgICAgIGZvcm1EYXRhICs9IFwiPHRvdGFsX2ZlZT5cIiArIHRvdGFsX2ZlZSArIFwiPC90b3RhbF9mZWU+XCJcbiAgICAgICAgXG4gICAgICAgICAgICBmb3JtRGF0YSArPSBcIjx0cmFkZV90eXBlPkpTQVBJPC90cmFkZV90eXBlPlwiXG4gICAgICAgIFxuICAgICAgICAgICAgZm9ybURhdGEgKz0gXCI8c2lnbj5cIiArIHBheXNpZ24oeyBhcHBpZCwgYXR0YWNoLCBib2R5LCBtY2hfaWQsIG5vbmNlX3N0ciwgbm90aWZ5X3VybCwgb3BlbmlkLCBvdXRfdHJhZGVfbm8sIHNwYmlsbF9jcmVhdGVfaXAsIHRvdGFsX2ZlZSwgdHJhZGVfdHlwZTogJ0pTQVBJJyB9KSArIFwiPC9zaWduPlwiXG4gICAgICAgIFxuICAgICAgICAgICAgZm9ybURhdGEgKz0gXCI8L3htbD5cIjtcbiAgICBcbiAgICAgICAgICAgIGxldCByZXMgPSBhd2FpdCBycCh7IHVybDogXCJodHRwczovL2FwaS5tY2gud2VpeGluLnFxLmNvbS9wYXkvdW5pZmllZG9yZGVyXCIsIG1ldGhvZDogJ1BPU1QnLGJvZHk6IGZvcm1EYXRhIH0pO1xuICAgIFxuICAgICAgICAgICAgbGV0IHhtbCA9IHJlcy50b1N0cmluZyhcInV0Zi04XCIpO1xuICAgICAgICAgIFxuICAgICAgICAgICAgaWYgKCB4bWwuaW5kZXhPZigncHJlcGF5X2lkJykgPCAwICkge1xuICAgICAgICAgICAgICAgIHJldHVybiBjdHguYm9keSA9IHtcbiAgICAgICAgICAgICAgICAgICAgc3RhdHVzOiA1MDBcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb25zb2xlLmxvZygnZWVlZWUnLCBmb3JtRGF0YSwgeG1sICk7XG4gICAgICAgICAgICBsZXQgcHJlcGF5X2lkID0geG1sLnNwbGl0KFwiPHByZXBheV9pZD5cIilbMV0uc3BsaXQoXCI8L3ByZXBheV9pZD5cIilbMF0uc3BsaXQoJ1snKVsyXS5zcGxpdCgnXScpWzBdXG4gICAgXG4gICAgICAgICAgICBsZXQgcGF5U2lnbiA9IHBheXNpZ24oeyBhcHBJZDogYXBwaWQsIG5vbmNlU3RyOiBub25jZV9zdHIsIHBhY2thZ2U6ICgncHJlcGF5X2lkPScgKyBwcmVwYXlfaWQpLCBzaWduVHlwZTogJ01ENScsIHRpbWVTdGFtcDogdGltZVN0YW1wIH0pXG4gICAgICAgICAgICBcbiAgICAgICAgICAgIHJldHVybiBjdHguYm9keSA9IHtcbiAgICAgICAgICAgICAgICBzdGF0dXM6IDIwMCxcbiAgICAgICAgICAgICAgICBkYXRhOiB7IGFwcGlkLCBub25jZV9zdHIsIHRpbWVTdGFtcCwgcHJlcGF5X2lkLCBwYXlTaWduIH0gXG4gICAgICAgICAgICB9O1xuXG4gICAgICAgIH0gY2F0Y2ggKCBlICkge1xuICAgICAgICAgICAgcmV0dXJuIGN0eC5ib2R5ID0ge1xuICAgICAgICAgICAgICAgIHN0YXR1czogNTAwXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgIC8qKlxuICAgICAqIOS7o+i0reS4quS6uuW+ruS/oeS6jOe7tOeggeOAgee+pOS6jOe7tOeggVxuICAgICAqIC0tLS0tLSDor7fmsYIgLS0tLS0tXG4gICAgICoge1xuICAgICAqICAgICAgd3hfcXJjb2RlOiBzdHJpbmdbXVxuICAgICAqICAgICAgZ3JvdXBfcXJjb2RlOiBzdHJpbmdbXVxuICAgICAqIH1cbiAgICAgKi9cbiAgICBhcHAucm91dGVyKCd3eGluZm8tZWRpdCcsIGFzeW5jKCBjdHgsIG5leHQgKSA9PiB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGNvbnN0IHRlbXA6IGFueSA9IFsgXTtcbiAgICAgICAgICAgIE9iamVjdC5rZXlzKCBldmVudC5kYXRhICkubWFwKCBrZXkgPT4ge1xuICAgICAgICAgICAgICAgIGlmICggISFldmVudC5kYXRhWyBrZXkgXSkge1xuICAgICAgICAgICAgICAgICAgICB0ZW1wLnB1c2goe1xuICAgICAgICAgICAgICAgICAgICAgICAgdHlwZToga2V5LFxuICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU6IGV2ZW50LmRhdGFbIGtleSBdXG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIGF3YWl0IFByb21pc2UuYWxsKCB0ZW1wLm1hcCggYXN5bmMgeCA9PiB7XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgY29uc3QgZmluZCQgPSBhd2FpdCBkYi5jb2xsZWN0aW9uKCdtYW5hZ2VyLXd4LWluZm8nKVxuICAgICAgICAgICAgICAgICAgICAud2hlcmUoe1xuICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogeC50eXBlXG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgIC5nZXQoICk7XG5cbiAgICAgICAgICAgICAgICBpZiAoIGZpbmQkLmRhdGEubGVuZ3RoID4gMCApIHtcbiAgICAgICAgICAgICAgICAgICAgYXdhaXQgZGIuY29sbGVjdGlvbignbWFuYWdlci13eC1pbmZvJykuZG9jKCAoZmluZCQuZGF0YVsgMCBdIGFzIGFueSkuX2lkIClcbiAgICAgICAgICAgICAgICAgICAgICAgIC5zZXQoe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGE6IHhcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBhd2FpdCBkYi5jb2xsZWN0aW9uKCdtYW5hZ2VyLXd4LWluZm8nKVxuICAgICAgICAgICAgICAgICAgICAgICAgLmFkZCh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YTogeFxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB9KSk7XG5cbiAgICAgICAgICAgIHJldHVybiBjdHguYm9keSA9IHtcbiAgICAgICAgICAgICAgICBzdGF0dXM6IDIwMFxuICAgICAgICAgICAgfVxuXG4gICAgICAgIH0gY2F0Y2ggKCBlICkge1xuICAgICAgICAgICAgcmV0dXJuIGN0eC5ib2R5ID0geyBzdGF0dXM6IDUwMCB9O1xuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICAvKipcbiAgICAgKiBAZGVzY3JpcHRpb25cbiAgICAgKiDmn6Xor6Lku6PotK3kuKrkurrkuoznu7TnoIHkv6Hmga9cbiAgICAgKi9cbiAgICBhcHAucm91dGVyKCd3eGluZm8nLCBhc3luYyggY3R4LCBuZXh0ICkgPT4ge1xuICAgICAgICB0cnkge1xuXG4gICAgICAgICAgICBjb25zdCB0YXJnZXQgPSBbJ3d4X3FyY29kZScsICdncm91cF9xcmNvZGUnXTtcbiAgICAgICAgICAgIGNvbnN0IGZpbmRzJCA9IGF3YWl0IFByb21pc2UuYWxsKCB0YXJnZXQubWFwKCB0eXBlID0+IHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZGIuY29sbGVjdGlvbignbWFuYWdlci13eC1pbmZvJylcbiAgICAgICAgICAgICAgICAgICAgLndoZXJlKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHR5cGVcbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgLmdldCggKTtcbiAgICAgICAgICAgIH0pKTtcblxuICAgICAgICAgICAgY29uc3QgdGVtcCA9IHsgfTtcbiAgICAgICAgICAgIGZpbmRzJC5tYXAoKCBmaW5kJCwgaW5kZXggKSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKCBmaW5kJC5kYXRhLmxlbmd0aCA+IDAgKSB7XG4gICAgICAgICAgICAgICAgICAgIHRlbXBbIHRhcmdldFsgaW5kZXggXV0gPSBmaW5kJC5kYXRhWyAwIF0udmFsdWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHJldHVybiBjdHguYm9keSA9IHtcbiAgICAgICAgICAgICAgICBzdGF0dXM6IDIwMCxcbiAgICAgICAgICAgICAgICBkYXRhOiB0ZW1wXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfSBjYXRjaCAoIGUgKSB7XG4gICAgICAgICAgICByZXR1cm4gY3R4LmJvZHkgPSB7IHN0YXR1czogNTAwIH07XG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgIC8qKiBcbiAgICAgKiBAZGVzY3JpcHRpb25cbiAgICAgKiDojrflj5bigJzmiJHnmoTpobXpnaLigJ3nmoTln7rmnKzkv6Hmga/vvIzor7jlpoLorqLljZXjgIHljaHliLjmlbDph49cbiAgICAgKi9cbiAgICBhcHAucm91dGVyKCdteXBhZ2UtaW5mbycsIGFzeW5jKCBjdHgsIG5leHQgKSA9PiB7XG4gICAgICAgIHRyeSB7XG5cbiAgICAgICAgICAgIGxldCBjb3Vwb25zID0gMDtcbiAgICAgICAgICAgIGNvbnN0IG9wZW5pZCA9IGV2ZW50LnVzZXJJbmZvLm9wZW5JZDtcbiAgICAgICAgICAgIGNvbnN0IHRyaXBzJCA9IGF3YWl0IGNsb3VkLmNhbGxGdW5jdGlvbih7XG4gICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgICAkdXJsOiAnZW50ZXInXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBuYW1lOiAndHJpcCdcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgY29uc3QgdHJpcHMgPSB0cmlwcyQucmVzdWx0LmRhdGE7XG4gICAgICAgICAgICBjb25zdCB0cmlwID0gdHJpcHNbIDAgXTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgLy8g6K6i5Y2V5pWwXG4gICAgICAgICAgICBjb25zdCBvcmRlcnMkID0gYXdhaXQgZGIuY29sbGVjdGlvbignb3JkZXInKVxuICAgICAgICAgICAgICAgIC53aGVyZSh7XG4gICAgICAgICAgICAgICAgICAgIG9wZW5pZCxcbiAgICAgICAgICAgICAgICAgICAgYmFzZV9zdGF0dXM6IF8ubmVxKCc1JylcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIC5jb3VudCggKTtcblxuXG4gICAgICAgICAgICAvLyDljaHliLjmlbAoIOi/h+a7pOaOieWPquWJqeW9k+WJjeeahHRyaXDljaHliLggKVxuICAgICAgICAgICAgbGV0IGNvdXBvbnMkOiBhbnkgPSB7XG4gICAgICAgICAgICAgICAgdG90YWw6IDBcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGlmICggISF0cmlwICkge1xuICAgICAgICAgICAgICAgIGNvdXBvbnMkID0gYXdhaXQgZGIuY29sbGVjdGlvbignY291cG9uJylcbiAgICAgICAgICAgICAgICAgICAgLndoZXJlKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG9wZW5pZCxcbiAgICAgICAgICAgICAgICAgICAgICAgIHRpZDogdHJpcC5faWQsXG4gICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiBfLm5lcSgndF9kYWlqaW4nKSxcbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgLmNvdW50KCApO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBjb25zdCBjb3Vwb25zMiQgPSBhd2FpdCBkYi5jb2xsZWN0aW9uKCdjb3Vwb24nKVxuICAgICAgICAgICAgICAgIC53aGVyZSh7XG4gICAgICAgICAgICAgICAgICAgIG9wZW5pZCxcbiAgICAgICAgICAgICAgICAgICAgaXNVc2VkOiBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogJ3RfZGFpamluJyxcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIC5jb3VudCggKTtcblxuICAgICAgICAgICAgY291cG9ucyA9IGNvdXBvbnMkLnRvdGFsICsgY291cG9uczIkLnRvdGFsO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICByZXR1cm4gY3R4LmJvZHkgPSB7XG4gICAgICAgICAgICAgICAgc3RhdHVzOiAyMDAsXG4gICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgICBjb3Vwb25zLFxuICAgICAgICAgICAgICAgICAgICBvcmRlcnM6IG9yZGVycyQudG90YWxcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfSBjYXRjaCAoIGUgKSB7IHJldHVybiBjdHguYm9keSA9IHsgc3RhdHVzOiA1MDAgfTt9XG4gICAgfSk7XG5cbiAgICAvKiogXG4gICAgICogQGRlc2NyaXB0aW9uXG4gICAgICog6KGM56iL5LiL77yM5Y+C5Yqg5LqG6LSt5Lmw55qE5a6i5oi377yI6K6i5Y2V77yJXG4gICAgICogeyBcbiAgICAgKiAgICB0aWRcbiAgICAgKiB9XG4gICAgICovXG4gICAgYXBwLnJvdXRlcignY3VzdG9tZXItaW4tdHJpcCcsIGFzeW5jKCBjdHgsIG5leHQgKSA9PiB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBjb25zdCBsaW1pdCA9IDEwMDtcbiAgICAgICAgICAgIGNvbnN0IGFsbE9yZGVyVXNlcnMkID0gYXdhaXQgZGIuY29sbGVjdGlvbignb3JkZXInKVxuICAgICAgICAgICAgICAgIC53aGVyZSh7XG4gICAgICAgICAgICAgICAgICAgIHRpZDogZXZlbnQuZGF0YS50aWRcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIC5vcmRlckJ5KCdjcmVhdGVUaW1lJywgJ2Rlc2MnKVxuICAgICAgICAgICAgICAgIC5saW1pdCggbGltaXQgKVxuICAgICAgICAgICAgICAgIC5maWVsZCh7XG4gICAgICAgICAgICAgICAgICAgIG9wZW5pZDogdHJ1ZVxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLmdldCggKTtcblxuICAgICAgICAgICAgY29uc3Qgb3BlbmlkcyA9IEFycmF5LmZyb20oIG5ldyBTZXQoIGFsbE9yZGVyVXNlcnMkLmRhdGEubWFwKCB4ID0+IHgub3BlbmlkICkpKTtcblxuICAgICAgICAgICAgY29uc3QgYXZhdGF0cyQgPSBhd2FpdCBQcm9taXNlLmFsbCggb3Blbmlkcy5tYXAoIG9pZCA9PiB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGRiLmNvbGxlY3Rpb24oJ3VzZXInKVxuICAgICAgICAgICAgICAgICAgICAud2hlcmUoe1xuICAgICAgICAgICAgICAgICAgICAgICAgb3BlbmlkOiBvaWRcbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgLmZpZWxkKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGF2YXRhclVybDogdHJ1ZVxuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAuZ2V0KCApO1xuICAgICAgICAgICAgfSkpXG4gICAgICAgICAgICBcbiAgICAgICAgICAgIHJldHVybiBjdHguYm9keSA9IHtcbiAgICAgICAgICAgICAgICBzdGF0dXM6IDIwMCxcbiAgICAgICAgICAgICAgICBkYXRhOiBhdmF0YXRzJC5tYXAoIHggPT4geC5kYXRhWyAwIF0uYXZhdGFyVXJsIClcbiAgICAgICAgICAgIH1cblxuICAgICAgICB9IGNhdGNoICggZSApIHtcbiAgICAgICAgICAgIHJldHVybiBjdHguYm9keSA9IHsgc3RhdHVzOiA1MDAgfTtcbiAgICAgICAgfVxuICAgIH0pXG5cbiAgICAvKipcbiAgICAgKiDmtojmga/mjqjpgIEgLSDlgqzmrL5cbiAgICAgKiB7XG4gICAgICogICAgIHRvdXNlciAoIG9wZW5pZCApXG4gICAgICogICAgIGZvcm1faWQg77yIIOaIluiAheaYryBwcmVwYXlfaWQg77yJXG4gICAgICogICAgIHBhZ2U/OiBzdHJpbmdcbiAgICAgKiAgICAgZGF0YTogeyBcbiAgICAgKiAgICAgICAgIFxuICAgICAqICAgICB9XG4gICAgICogfVxuICAgICAqL1xuICAgIGFwcC5yb3V0ZXIoJ25vdGlmaWNhdGlvbi1nZXRtb25leScsIGFzeW5jKCBjdHgsIG5leHQgKSA9PiB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGNvbnN0IHBhZ2UgPSBldmVudC5kYXRhLnBhZ2UgfHwgJ3BhZ2VzL29yZGVyLWxpc3QvaW5kZXgnO1xuICAgICAgICAgICAgY29uc3QgeyB0b3VzZXIsIGZvcm1faWQsIGRhdGEsIHByZXBheV9pZCB9ID0gZXZlbnQuZGF0YTtcblxuICAgICAgICAgICAgLy8g6I635Y+WdG9rZW5cbiAgICAgICAgICAgIGNvbnN0IHJlc3VsdCA9IGF3YWl0IChheGlvcyBhcyBhbnkpKHtcbiAgICAgICAgICAgICAgICBtZXRob2Q6ICdnZXQnLFxuICAgICAgICAgICAgICAgIHVybDogYGh0dHBzOi8vYXBpLndlaXhpbi5xcS5jb20vY2dpLWJpbi90b2tlbj9ncmFudF90eXBlPWNsaWVudF9jcmVkZW50aWFsJmFwcGlkPSR7Q09ORklHLmFwcC5pZH0mc2VjcmV0PSR7Q09ORklHLmFwcC5zZWNyZWN0fWBcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICBjb25zdCB7IGFjY2Vzc190b2tlbiwgZXJyY29kZSB9ID0gcmVzdWx0LmRhdGE7XG5cbiAgICAgICAgICAgIGlmICggZXJyY29kZSApIHtcbiAgICAgICAgICAgICAgICB0aHJvdyAn55Sf5oiQYWNjZXNzX3Rva2Vu6ZSZ6K+vJ1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBjb25zdCByZXFEYXRhID0geyB9O1xuICAgICAgICAgICAgY29uc3QgcmVxRGF0YSQgPSB7XG4gICAgICAgICAgICAgICAgcGFnZSxcbiAgICAgICAgICAgICAgICB0b3VzZXIsXG4gICAgICAgICAgICAgICAgcHJlcGF5X2lkLFxuICAgICAgICAgICAgICAgIGZvcm1faWQsXG4gICAgICAgICAgICAgICAgdGVtcGxhdGVfaWQ6IENPTkZJRy5ub3RpZmljYXRpb25fdGVtcGxhdGUuZ2V0TW9uZXkzLFxuICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgLy8g6LSt5Lmw5pe26Ze0XG4gICAgICAgICAgICAgICAgICAgIFwia2V5d29yZDFcIjoge1xuICAgICAgICAgICAgICAgICAgICAgICAgXCJ2YWx1ZVwiOiBkYXRhLnRpdGxlXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIC8vIOiuouWNleaAu+S7t1xuICAgICAgICAgICAgICAgICAgICBcImtleXdvcmQyXCI6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIFwidmFsdWVcIjogZGF0YS50aW1lXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICBPYmplY3Qua2V5cyggcmVxRGF0YSQgKS5tYXAoIGtleSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKCAhIXJlcURhdGEkWyBrZXkgXSkge1xuICAgICAgICAgICAgICAgICAgICByZXFEYXRhWyBrZXkgXSA9IHJlcURhdGEkWyBrZXkgXTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgLy8g5Y+R6YCB5o6o6YCBXG4gICAgICAgICAgICBjb25zdCBzZW5kID0gYXdhaXQgKGF4aW9zIGFzIGFueSkoe1xuICAgICAgICAgICAgICAgIGRhdGE6IHJlcURhdGEsXG4gICAgICAgICAgICAgICAgbWV0aG9kOiAncG9zdCcsXG4gICAgICAgICAgICAgICAgdXJsOiBgaHR0cHM6Ly9hcGkud2VpeGluLnFxLmNvbS9jZ2ktYmluL21lc3NhZ2Uvd3hvcGVuL3RlbXBsYXRlL3NlbmQ/YWNjZXNzX3Rva2VuPSR7YWNjZXNzX3Rva2VufWBcbiAgICAgICAgICAgIH0pO1xuICAgICAgICBcbiAgICAgICAgICAgIHJldHVybiBjdHguYm9keSA9IHtcbiAgICAgICAgICAgICAgICBkYXRhOiBzZW5kLmRhdGEsXG4gICAgICAgICAgICAgICAgc3RhdHVzOiAyMDBcbiAgICAgICAgICAgIH1cblxuICAgICAgICB9IGNhdGNoICggZSApIHtcbiAgICAgICAgICAgIHJldHVybiBjdHguYm9keSA9IHsgbWVzc2FnZTogZSwgc3RhdHVzOiA1MDAgfVxuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICAvKipcbiAgICAgKiBAZGVzY3JpcHRpb25cbiAgICAgKiDpgJrov4fliqDop6Plr4blrqLmnI3nu5nnmoTlr4bnoIHvvIzmnaXlop7liqDmnYPpmZDjgIHliJ3lp4vljJbmlbDmja7lupNcbiAgICAgKi9cbiAgICBhcHAucm91dGVyKCdhZGQtYXV0aC1ieS1wc3cnLCBhc3luYyggY3R4LCBuZXh0ICkgPT4ge1xuICAgICAgICB0cnkge1xuXG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIGF3YWl0IChkYiBhcyBhbnkpLmNyZWF0ZUNvbGxlY3Rpb24oJ21hbmFnZXItbWVtYmVyJyk7XG4gICAgICAgICAgICAgICAgYXdhaXQgKGRiIGFzIGFueSkuY3JlYXRlQ29sbGVjdGlvbignYXV0aHBzdycpO1xuICAgICAgICAgICAgfSBjYXRjaCAoIGUgKSB7IH1cblxuICAgICAgICAgICAgbGV0IHJlc3VsdCA9ICcnO1xuICAgICAgICAgICAgY29uc3QgeyBzYWx0IH0gPSBDT05GSUcuYXV0aDtcbiAgICAgICAgICAgIGNvbnN0IG9wZW5pZCA9IGV2ZW50LnVzZXJJbmZvLm9wZW5JZDtcbiAgICAgICAgICAgIGNvbnN0IHsgcHN3LCBjb250ZW50IH0gPSBldmVudC5kYXRhO1xuXG4gICAgICAgICAgICBjb25zdCBnZXRFcnIgPSBtZXNzYWdlID0+ICh7XG4gICAgICAgICAgICAgICAgbWVzc2FnZSxcbiAgICAgICAgICAgICAgICBzdGF0dXM6IDUwMCxcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIGNvbnN0IGRlY2lwaGVyID0gY3J5cHRvLmNyZWF0ZURlY2lwaGVyKCdhZXMxOTInLCBzYWx0ICk7XG4gICAgICAgICAgICAgICAgY29uc3QgZGVjcnlwdGVkID0gZGVjaXBoZXIudXBkYXRlKCBwc3csICdoZXgnLCAndXRmOCcgKTtcbiAgICAgICAgICAgICAgICByZXN1bHQgPSBkZWNyeXB0ZWQgKyBkZWNpcGhlci5maW5hbCgndXRmOCcpO1xuICAgICAgICAgICAgfSBjYXRjaCAoIGUgKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGN0eC5ib2R5ID0gZ2V0RXJyKCflr4bpkqXplJnor6/vvIzor7fmoLjlr7knKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIFxuICAgICAgICAgICAgY29uc3QgWyBjX3RpbWVzdGFtcCwgY19hcHBpZCwgY19jb250ZW50LCBjX21heCBdID0gcmVzdWx0LnNwbGl0KCctJyk7XG5cbiAgICAgICAgICAgIGlmICggZ2V0Tm93KCB0cnVlICkgLSBOdW1iZXIoIGNfdGltZXN0YW1wICkgPiAzMCAqIDYwICogMTAwMCApIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gY3R4LmJvZHkgPSBnZXRFcnIoJ+WvhumSpeW3sui/h+acn++8jOivt+iBlOezu+WuouacjScpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoIGNfYXBwaWQgIT09IENPTkZJRy5hcHAuaWQgKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGN0eC5ib2R5ID0gZ2V0RXJyKCflr4bpkqXkuI7lsI/nqIvluo/kuI3lhbPogZQnKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKCBjX2NvbnRlbnQucmVwbGFjZSgvXFxzKy9nLCAnJykgIT09IGNvbnRlbnQucmVwbGFjZSgvXFxzKy9nLCAnJykpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gY3R4LmJvZHkgPSBnZXRFcnIoJ+aPkOekuuivjemUmeivr++8jOivt+iBlOezu+WuouacjScpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIGF1dGhwc3cg6KGoXG4gICAgICAgICAgICAgKiBcbiAgICAgICAgICAgICAqIHtcbiAgICAgICAgICAgICAqICAgIGFwcElkLFxuICAgICAgICAgICAgICogICAgdGltZXN0YW1wLFxuICAgICAgICAgICAgICogICAgY291bnRcbiAgICAgICAgICAgICAqIH1cbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgY29uc3QgY2hlY2skID0gYXdhaXQgZGIuY29sbGVjdGlvbignYXV0aHBzdycpIFxuICAgICAgICAgICAgICAgIC53aGVyZSh7XG4gICAgICAgICAgICAgICAgICAgIGFwcElkOiBjX2FwcGlkLFxuICAgICAgICAgICAgICAgICAgICB0aW1lc3RhbXA6IGNfdGltZXN0YW1wXG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAuZ2V0KCApO1xuICAgICAgICAgICAgY29uc3QgdGFyZ2V0ID0gY2hlY2skLmRhdGFbIDAgXTtcblxuICAgICAgICAgICAgLy8g5a+G6ZKl5bey6KKr5L2/55SoXG4gICAgICAgICAgICBpZiAoICEhdGFyZ2V0ICkge1xuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIC8vIOasoeaVsOS4jeiDveWkmuS6jjJcbiAgICAgICAgICAgICAgICBpZiAoIHRhcmdldC5jb3VudCA+PSAyICkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gY3R4LmJvZHkgPSBnZXRFcnIoJ+WvhumSpeW3suiiq+S9v+eUqO+8jOivt+iBlOezu+WuouacjScpO1xuXG4gICAgICAgICAgICAgICAgLy8g5pu05paw5a+G6ZKl5L+h5oGvXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgYXdhaXQgZGIuY29sbGVjdGlvbignYXV0aHBzdycpXG4gICAgICAgICAgICAgICAgICAgICAgICAuZG9jKCBTdHJpbmcoIHRhcmdldC5faWQgKSlcbiAgICAgICAgICAgICAgICAgICAgICAgIC51cGRhdGUoe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY291bnQ6IF8uaW5jKCAxIClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyDliJvlu7rlr4bpkqXkv6Hmga9cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgYXdhaXQgZGIuY29sbGVjdGlvbignYXV0aHBzdycpXG4gICAgICAgICAgICAgICAgICAgIC5hZGQoe1xuICAgICAgICAgICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvdW50OiAxLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFwcElkOiBjX2FwcGlkLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRpbWVzdGFtcDogY190aW1lc3RhbXBcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8g5oqK5b2T5YmN5Lq677yM5Yqg5YWl5Yiw566h55CG5ZGYXG4gICAgICAgICAgICBjb25zdCBjaGVja01hbmFnZXIkID0gYXdhaXQgZGIuY29sbGVjdGlvbignbWFuYWdlci1tZW1iZXInKVxuICAgICAgICAgICAgICAgIC53aGVyZSh7XG4gICAgICAgICAgICAgICAgICAgIG9wZW5pZFxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLmdldCggKTtcbiAgICAgICAgICAgIGNvbnN0IHRhcmdldE1hbmFnZXIgPSBjaGVja01hbmFnZXIkLmRhdGFbIDAgXTtcblxuICAgICAgICAgICAgaWYgKCAhdGFyZ2V0TWFuYWdlciApIHtcbiAgICAgICAgICAgICAgICBhd2FpdCBkYi5jb2xsZWN0aW9uKCdtYW5hZ2VyLW1lbWJlcicpXG4gICAgICAgICAgICAgICAgICAgIC5hZGQoe1xuICAgICAgICAgICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9wZW5pZCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb250ZW50OiBjX2NvbnRlbnQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY3JlYXRlVGltZTogZ2V0Tm93KCB0cnVlIClcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8g5Yid5aeL5YyW5ZCE5Liq6KGoXG4gICAgICAgICAgICBhd2FpdCBpbml0REIoICk7XG5cbiAgICAgICAgICAgIHJldHVybiBjdHguYm9keSA9IHtcbiAgICAgICAgICAgICAgICBzdGF0dXM6IDIwMFxuICAgICAgICAgICAgfVxuXG4gICAgICAgIH0gY2F0Y2ggKCBlICkge1xuICAgICAgICAgICAgcmV0dXJuIGN0eC5ib2R5ID0ge1xuICAgICAgICAgICAgICAgIHN0YXR1czogNTAwLFxuICAgICAgICAgICAgICAgIG1lc3NhZ2U6ICflr4bpkqXmo4Dmn6Xlj5HnlJ/plJnor68nXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgIC8qKlxuICAgICAqIEBkZXNjcmlwdGlvblxuICAgICAqIOafpeivouW6lOeUqOmFjee9rlxuICAgICAqL1xuICAgIGFwcC5yb3V0ZXIoJ2NoZWNrLWFwcC1jb25maWcnLCBhc3luYyggY3R4LCBuZXh0ICkgPT4ge1xuICAgICAgICB0cnkge1xuXG4gICAgICAgICAgICBsZXQgY29uZmlnT2JqID0geyB9O1xuICAgICAgICAgICAgY29uc3QgY29uZmlnJCA9IGF3YWl0IGRiLmNvbGxlY3Rpb24oJ2FwcC1jb25maWcnKVxuICAgICAgICAgICAgICAgIC53aGVyZSh7IH0pXG4gICAgICAgICAgICAgICAgLmdldCggKTtcblxuICAgICAgICAgICAgY29uc3QgbWV0YSA9IGNvbmZpZyQuZGF0YS5tYXAoIGNvbmYgPT4ge1xuICAgICAgICAgICAgICAgIGNvbmZpZ09iaiA9IE9iamVjdC5hc3NpZ24oeyB9LCBjb25maWdPYmosIHtcbiAgICAgICAgICAgICAgICAgICAgWyBjb25mLnR5cGUgXTogY29uZi52YWx1ZVxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgcmV0dXJuIGN0eC5ib2R5ID0ge1xuICAgICAgICAgICAgICAgIGRhdGE6IGNvbmZpZ09iaixcbiAgICAgICAgICAgICAgICBzdGF0dXM6IDIwMFxuICAgICAgICAgICAgfVxuXG4gICAgICAgIH0gY2F0Y2ggKCBlICkge1xuICAgICAgICAgICAgcmV0dXJuIGN0eC5ib2R5ID0ge1xuICAgICAgICAgICAgICAgIHN0YXR1czogNTAwXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgIC8qKlxuICAgICAqIEBkZXNjcmlwdGlvblxuICAgICAqIOabtOaWsOW6lOeUqOmFjee9rlxuICAgICAqIC0tLS0tLS0tLS0tLS0tXG4gICAgICogY29uZmlnczoge1xuICAgICAqICAgIFsga2V5OiBzdHJpbmcgXTogYW55IFxuICAgICAqIH1cbiAgICAgKi9cbiAgICBhcHAucm91dGVyKCd1cGRhdGUtYXBwLWNvbmZpZycsIGFzeW5jKCBjdHgsIG5leHQgKSA9PiB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBjb25zdCB7IGNvbmZpZ3MgfSA9IGV2ZW50LmRhdGE7XG5cbiAgICAgICAgICAgIGF3YWl0IFByb21pc2UuYWxsKFxuICAgICAgICAgICAgICAgIE9iamVjdC5rZXlzKCBjb25maWdzIClcbiAgICAgICAgICAgICAgICAgICAgLm1hcCggYXN5bmMgY29uZmlnS2V5ID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHRhcmdldCQgPSBhd2FpdCBkYi5jb2xsZWN0aW9uKCdhcHAtY29uZmlnJylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAud2hlcmUoe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiBjb25maWdLZXlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5nZXQoIClcblxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCAhdGFyZ2V0JC5kYXRhWyAwIF0pIHsgcmV0dXJuOyB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGF3YWl0IGRiLmNvbGxlY3Rpb24oJ2FwcC1jb25maWcnKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5kb2MoIFN0cmluZyggdGFyZ2V0JC5kYXRhWyAwIF0uX2lkICkpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLnVwZGF0ZSh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlOiBjb25maWdzWyBjb25maWdLZXkgXVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICk7XG5cbiAgICAgICAgICAgIHJldHVybiBjdHguYm9keSA9IHtcbiAgICAgICAgICAgICAgICBzdGF0dXM6IDIwMFxuICAgICAgICAgICAgfVxuICAgICAgICB9IGNhdGNoICggZSApIHtcbiAgICAgICAgICAgIHJldHVybiBjdHguYm9keSA9IHtcbiAgICAgICAgICAgICAgICBzdGF0dXM6IDUwMFxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSlcblxuICAgIC8qKiBcbiAgICAgKiBAZGVzY3JpcHRpb25cbiAgICAgKiDnlJ/miJDkuoznu7TnoIFcbiAgICAgKiB7XG4gICAgICogICAgIHBhZ2VcbiAgICAgKiAgICAgc2NlbmVcbiAgICAgKiB9XG4gICAgICovXG4gICAgYXBwLnJvdXRlcignY3JlYXRlLXFyY29kZScsIGFzeW5jKCBjdHgsIG5leHQgKSA9PiB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBjb25zdCB7IHBhZ2UsIHNjZW5lIH0gPSBldmVudC5kYXRhO1xuICAgICAgICAgICAgY29uc3QgcmVzdWx0ID0gYXdhaXQgY2xvdWQub3BlbmFwaS53eGFjb2RlLmdldFVubGltaXRlZCh7XG4gICAgICAgICAgICAgICAgcGFnZSxcbiAgICAgICAgICAgICAgICBzY2VuZTogc2NlbmUgfHwgJydcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBpZiAoIHJlc3VsdC5lcnJDb2RlICE9PSAwICkge1xuICAgICAgICAgICAgICAgIHRocm93IHJlc3VsdC5lcnJNc2dcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIGN0eC5ib2R5ID0ge1xuICAgICAgICAgICAgICAgIHN0YXR1czogMjAwLFxuICAgICAgICAgICAgICAgIGRhdGE6IHJlc3VsdC5idWZmZXJcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBjYXRjaCAoIGUgKSB7XG4gICAgICAgICAgICByZXR1cm4gY3R4LmJvZHkgPSB7XG4gICAgICAgICAgICAgICAgc3RhdHVzOiA1MDAsXG4gICAgICAgICAgICAgICAgbWVzc2FnZTogdHlwZW9mIGUgPT09ICdzdHJpbmcnID8gZSA6IEpTT04uc3RyaW5naWZ5KCBlIClcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgLyoqIFxuICAgICAqIEBkZXNjcmlwdGlvblxuICAgICAqIOWIm+W7uuS4gOS4qmZvcm0taWRcbiAgICAgKiB7XG4gICAgICogICAgIGZvcm1pZFxuICAgICAqIH1cbiAgICAgKiBmb3JtLWlkczoge1xuICAgICAqICAgICAgb3BlbmlkLFxuICAgICAqICAgICAgZm9ybWlkLFxuICAgICAqICAgICAgY3JlYXRlVGltZSxcbiAgICAgKiAgICAgIHR5cGU6ICdtYW5hZ2VyJyB8ICdub3JtYWwnXG4gICAgICogfVxuICAgICAqL1xuICAgIGFwcC5yb3V0ZXIoJ2NyZWF0ZS1mb3JtaWQnLCBhc3luYyggY3R4LCBuZXh0ICkgPT4ge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgY29uc3Qgb3BlbmlkID0gZXZlbnQudXNlckluZm8ub3BlbklkO1xuICAgICAgICAgICAgY29uc3QgeyBmb3JtaWQgfSA9IGV2ZW50LmRhdGE7IFxuICAgICAgICAgICAgY29uc3QgZmluZCQgPSBhd2FpdCBkYi5jb2xsZWN0aW9uKCdtYW5hZ2VyLW1lbWJlcicpXG4gICAgICAgICAgICAgICAgLndoZXJlKHtcbiAgICAgICAgICAgICAgICAgICAgb3BlbmlkXG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAuY291bnQoICk7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGNvbnN0IGNyZWF0ZSQgPSBhd2FpdCBkYi5jb2xsZWN0aW9uKCdmb3JtLWlkcycpXG4gICAgICAgICAgICAgICAgLmFkZCh7XG4gICAgICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG9wZW5pZCxcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvcm1pZCxcbiAgICAgICAgICAgICAgICAgICAgICAgIGNyZWF0ZVRpbWU6IGdldE5vdyggdHJ1ZSApLFxuICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogZmluZCQudG90YWwgPiAwID8gJ21hbmFnZXInIDogJ25vcm1hbCdcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgY3R4LmJvZHkgPSB7XG4gICAgICAgICAgICAgICAgc3RhdHVzOiAyMDBcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBjYXRjaCAoIGUgKSB7XG4gICAgICAgICAgICBjdHguYm9keSA9IHtcbiAgICAgICAgICAgICAgICBzdGF0dXM6IDIwMFxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICAvKipcbiAgICAgKiBAZGVzY3JpcHRpb25cbiAgICAgKiDmqKHmnb/mjqjpgIHmnI3liqHvvIzmtojotLlmb3JtLWlkc1xuICAgICAqIHtcbiAgICAgKiAgICAgIG9wZW5pZFxuICAgICAqICAgICAgdHlwZTogJ2J1eVBpbicgfCAnYnV5JyB8ICdnZXRNb25leScgfCAnd2FpdFBpbicgfCAnbmV3T3JkZXInXG4gICAgICogICAgICB0ZXh0czogWyAneHgnLCAneXknIF1cbiAgICAgKiAgICAgID9wYWdlXG4gICAgICogICAgICA/cHJlcGF5X2lkXG4gICAgICogfVxuICAgICAqL1xuICAgIGFwcC5yb3V0ZXIoJ3B1c2gtdGVtcGxhdGUnLCBhc3luYyggY3R4LCBuZXh0ICkgPT4ge1xuICAgICAgICB0cnkge1xuXG4gICAgICAgICAgICBsZXQgZm9ybWlkX2lkOiBhbnkgPSAnJztcbiAgICAgICAgICAgIGxldCBmb3JtaWQgPSBldmVudC5kYXRhLnByZXBheV9pZDtcbiAgICAgICAgICAgIGNvbnN0IHsgdHlwZSwgdGV4dHMgfSA9IGV2ZW50LmRhdGE7XG4gICAgICAgICAgICBjb25zdCBvcGVuaWQgPSBldmVudC5kYXRhLm9wZW5JZCB8fCBldmVudC5kYXRhLm9wZW5pZCB8fCBldmVudC51c2VySW5mby5vcGVuSWQ7XG4gICAgICAgICAgICBjb25zdCBwYWdlID0gZXZlbnQuZGF0YS5wYWdlIHx8ICdwYWdlcy9vcmRlci1saXN0L2luZGV4JztcblxuICAgICAgICAgICAgLy8g5aaC5p6c5rKh5pyJcHJlcGF5X2lkLCDlsLHljrvmi7/or6XnlKjmiLfnmoRmb3JtX2lkXG4gICAgICAgICAgICBpZiAoICFmb3JtaWQgKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgZmluZCQgPSBhd2FpdCBkYi5jb2xsZWN0aW9uKCdmb3JtLWlkcycpXG4gICAgICAgICAgICAgICAgICAgIC53aGVyZSh7XG4gICAgICAgICAgICAgICAgICAgICAgICBvcGVuaWRcbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgLmxpbWl0KCAxIClcbiAgICAgICAgICAgICAgICAgICAgLmdldCggKTtcblxuICAgICAgICAgICAgICAgIGlmICggIWZpbmQkLmRhdGFbIDAgXSkge1xuICAgICAgICAgICAgICAgICAgICB0aHJvdyBg6K+l55So5oi3JHtvcGVuaWR95rKh5pyJZm9ybWlk44CBcHJlcGF5X2lkYDtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBmb3JtaWQgPSBmaW5kJC5kYXRhWyAwIF0uZm9ybWlkO1xuICAgICAgICAgICAgICAgIGZvcm1pZF9pZCA9IGZpbmQkLmRhdGFbIDAgXS5faWQ7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGxldCB0ZXh0RGF0YSA9IHsgfTtcbiAgICAgICAgICAgIHRleHRzLm1hcCgoIHRleHQsIGluZGV4ICkgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IGtleVRleHQgPSBga2V5d29yZCR7aW5kZXggKyAxfWA7XG4gICAgICAgICAgICAgICAgdGV4dERhdGEgPSBPYmplY3QuYXNzaWduKHsgfSwgdGV4dERhdGEsIHtcbiAgICAgICAgICAgICAgICAgICAgWyBrZXlUZXh0IF0gOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZTogdGV4dFxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBjb25zdCB3ZWFwcFRlbXBsYXRlTXNnID0ge1xuICAgICAgICAgICAgICAgIHBhZ2UsXG4gICAgICAgICAgICAgICAgZGF0YTogdGV4dERhdGEsXG4gICAgICAgICAgICAgICAgZm9ybUlkOiBmb3JtaWQsXG4gICAgICAgICAgICAgICAgdGVtcGxhdGVJZDogQ09ORklHLnB1c2hfdGVtcGxhdGVbIHR5cGUgXS52YWx1ZVxuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgY29uc29sZS5sb2coJz09PeaOqOmAgScsIHdlYXBwVGVtcGxhdGVNc2cgKTtcblxuICAgICAgICAgICAgY29uc3Qgc2VuZCQgPSBhd2FpdCBjbG91ZC5vcGVuYXBpLnVuaWZvcm1NZXNzYWdlLnNlbmQoe1xuICAgICAgICAgICAgICAgIHRvdXNlcjogb3BlbmlkLFxuICAgICAgICAgICAgICAgIHdlYXBwVGVtcGxhdGVNc2dcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBpZiAoIFN0cmluZyggc2VuZCQuZXJyQ29kZSApICE9PSAnMCcgKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgc2VuZCQuZXJyTXNnO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyDliKDpmaTor6XmnaFmb3JtLWlkXG4gICAgICAgICAgICBpZiAoICEhZm9ybWlkX2lkICkge1xuICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgIGF3YWl0IGRiLmNvbGxlY3Rpb24oJ2Zvcm0taWRzJylcbiAgICAgICAgICAgICAgICAgICAgICAgIC5kb2MoIGZvcm1pZF9pZCApXG4gICAgICAgICAgICAgICAgICAgICAgICAucmVtb3ZlKCApO1xuICAgICAgICAgICAgICAgIH0gY2F0Y2ggKCBlICkgeyB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiBjdHguYm9keSA9IHtcbiAgICAgICAgICAgICAgICBzdGF0dXM6IDIwMFxuICAgICAgICAgICAgfTtcblxuICAgICAgICB9IGNhdGNoICggZSApIHtcbiAgICAgICAgICAgIHJldHVybiBjdHguYm9keSA9IHtcbiAgICAgICAgICAgICAgICBzdGF0dXM6IDUwMCxcbiAgICAgICAgICAgICAgICBtZXNzYWdlOiB0eXBlb2YgZSA9PT0gJ3N0cmluZycgPyBlIDogSlNPTi5zdHJpbmdpZnkoIGUgKVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICAvKiogXG4gICAgICogQGRlc2NyaXB0aW9uXG4gICAgICog5ZCM5LiK77yM5LqR5byA5Y+R55SoXG4gICAgICovXG4gICAgYXBwLnJvdXRlcigncHVzaC10ZW1wbGF0ZS1jbG91ZCcsIGFzeW5jKCBjdHgsIG5leHQgKSA9PiB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICAvLyDojrflj5Z0b2tlblxuICAgICAgICAgICAgY29uc3QgcmVzdWx0ID0gYXdhaXQgKGF4aW9zIGFzIGFueSkoe1xuICAgICAgICAgICAgICAgIG1ldGhvZDogJ2dldCcsXG4gICAgICAgICAgICAgICAgdXJsOiBgaHR0cHM6Ly9hcGkud2VpeGluLnFxLmNvbS9jZ2ktYmluL3Rva2VuP2dyYW50X3R5cGU9Y2xpZW50X2NyZWRlbnRpYWwmYXBwaWQ9JHtDT05GSUcuYXBwLmlkfSZzZWNyZXQ9JHtDT05GSUcuYXBwLnNlY3JlY3R9YFxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGNvbnN0IHsgYWNjZXNzX3Rva2VuLCBlcnJjb2RlIH0gPSByZXN1bHQuZGF0YTtcblxuICAgICAgICAgICAgaWYgKCBlcnJjb2RlICkge1xuICAgICAgICAgICAgICAgIHRocm93ICfnlJ/miJBhY2Nlc3NfdG9rZW7plJnor68nXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGxldCBmb3JtaWRfaWQ6IGFueSA9ICcnO1xuICAgICAgICAgICAgbGV0IGZvcm1pZCA9IGV2ZW50LmRhdGEucHJlcGF5X2lkO1xuICAgICAgICAgICAgY29uc3QgeyB0eXBlLCB0ZXh0cyB9ID0gZXZlbnQuZGF0YTtcbiAgICAgICAgICAgIGNvbnN0IG9wZW5pZCA9IGV2ZW50LmRhdGEub3BlbklkIHx8IGV2ZW50LmRhdGEub3BlbmlkIHx8IGV2ZW50LnVzZXJJbmZvLm9wZW5JZDtcbiAgICAgICAgICAgIGNvbnN0IHBhZ2UgPSBldmVudC5kYXRhLnBhZ2UgfHwgJ3BhZ2VzL29yZGVyLWxpc3QvaW5kZXgnO1xuXG4gICAgICAgICAgICAvLyDlpoLmnpzmsqHmnIlwcmVwYXlfaWQsIOWwseWOu+aLv+ivpeeUqOaIt+eahGZvcm1faWRcbiAgICAgICAgICAgIC8vIOWAkuWPmeaLv2Zvcm1pZFxuICAgICAgICAgICAgaWYgKCAhZm9ybWlkICkge1xuICAgICAgICAgICAgICAgIGNvbnN0IGZpbmQkID0gYXdhaXQgZGIuY29sbGVjdGlvbignZm9ybS1pZHMnKVxuICAgICAgICAgICAgICAgICAgICAud2hlcmUoe1xuICAgICAgICAgICAgICAgICAgICAgICAgb3BlbmlkLFxuICAgICAgICAgICAgICAgICAgICAgICAgZm9ybWlkOiBfLm5lcSgndGhlIGZvcm1JZCBpcyBhIG1vY2sgb25lJylcbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgLm9yZGVyQnkoJ2NyZWF0ZVRpbWUnLCAnYXNjJylcbiAgICAgICAgICAgICAgICAgICAgLmxpbWl0KCAxIClcbiAgICAgICAgICAgICAgICAgICAgLmdldCggKTtcblxuICAgICAgICAgICAgICAgIGlmICggIWZpbmQkLmRhdGFbIDAgXSkge1xuICAgICAgICAgICAgICAgICAgICB0aHJvdyBg6K+l55So5oi3JHtvcGVuaWR95rKh5pyJZm9ybWlk44CBcHJlcGF5X2lkYDtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBmb3JtaWQgPSBmaW5kJC5kYXRhWyAwIF0uZm9ybWlkO1xuICAgICAgICAgICAgICAgIGZvcm1pZF9pZCA9IGZpbmQkLmRhdGFbIDAgXS5faWQ7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGxldCB0ZXh0RGF0YSA9IHsgfTtcbiAgICAgICAgICAgIHRleHRzLm1hcCgoIHRleHQsIGluZGV4ICkgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IGtleVRleHQgPSBga2V5d29yZCR7aW5kZXggKyAxfWA7XG4gICAgICAgICAgICAgICAgdGV4dERhdGEgPSBPYmplY3QuYXNzaWduKHsgfSwgdGV4dERhdGEsIHtcbiAgICAgICAgICAgICAgICAgICAgWyBrZXlUZXh0IF0gOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZTogdGV4dFxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBjb25zdCB3ZWFwcF90ZW1wbGF0ZV9tc2cgPSB7XG4gICAgICAgICAgICAgICAgcGFnZSxcbiAgICAgICAgICAgICAgICBkYXRhOiB0ZXh0RGF0YSxcbiAgICAgICAgICAgICAgICBmb3JtX2lkOiBmb3JtaWQsXG4gICAgICAgICAgICAgICAgdGVtcGxhdGVfaWQ6IENPTkZJRy5wdXNoX3RlbXBsYXRlWyB0eXBlIF0udmFsdWVcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCc9PT3mjqjpgIEnLCB3ZWFwcF90ZW1wbGF0ZV9tc2cgKTtcblxuICAgICAgICAgICAgY29uc3QgcmVxRGF0YSA9IHtcbiAgICAgICAgICAgICAgICB0b3VzZXI6IG9wZW5pZCxcbiAgICAgICAgICAgICAgICB3ZWFwcF90ZW1wbGF0ZV9tc2dcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8g5Y+R6YCB5o6o6YCBXG4gICAgICAgICAgICBjb25zdCBzZW5kID0gYXdhaXQgKGF4aW9zIGFzIGFueSkoe1xuICAgICAgICAgICAgICAgIGRhdGE6IHJlcURhdGEsXG4gICAgICAgICAgICAgICAgbWV0aG9kOiAncG9zdCcsXG4gICAgICAgICAgICAgICAgdXJsOiBgaHR0cHM6Ly9hcGkud2VpeGluLnFxLmNvbS9jZ2ktYmluL21lc3NhZ2Uvd3hvcGVuL3RlbXBsYXRlL3VuaWZvcm1fc2VuZD9hY2Nlc3NfdG9rZW49JHthY2Nlc3NfdG9rZW59YFxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIGlmICggU3RyaW5nKCBzZW5kLmRhdGEuZXJyY29kZSApICE9PSAnMCcgKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgc2VuZC5kYXRhLmVycm1zZztcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8g5Yig6Zmk6K+l5p2hZm9ybS1pZFxuICAgICAgICAgICAgaWYgKCAhIWZvcm1pZF9pZCApIHtcbiAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICBhd2FpdCBkYi5jb2xsZWN0aW9uKCdmb3JtLWlkcycpXG4gICAgICAgICAgICAgICAgICAgICAgICAuZG9jKCBmb3JtaWRfaWQgKVxuICAgICAgICAgICAgICAgICAgICAgICAgLnJlbW92ZSggKTtcbiAgICAgICAgICAgICAgICB9IGNhdGNoICggZSApIHsgfVxuICAgICAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgICAgIHJldHVybiBjdHguYm9keSA9IHtcbiAgICAgICAgICAgICAgICBkYXRhOiBzZW5kLmRhdGEsXG4gICAgICAgICAgICAgICAgc3RhdHVzOiAyMDBcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgXG4gICAgICAgIH0gY2F0Y2ggKCBlICkge1xuICAgICAgICAgICAgcmV0dXJuIGN0eC5ib2R5ID0ge1xuICAgICAgICAgICAgICAgIHN0YXR1czogNTAwLFxuICAgICAgICAgICAgICAgIG1lc3NhZ2U6IHR5cGVvZiBlID09PSAnc3RyaW5nJyA/IGUgOiBKU09OLnN0cmluZ2lmeSggZSApXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9KVxuXG4gICAgLyoqIFxuICAgICAqIEBkZXNjcmlwdGlvblxuICAgICAqIOiuoumYheaOqOmAgVxuICAgICAqIHtcbiAgICAgKiAgICAgIG9wZW5pZFxuICAgICAqICAgICAgdHlwZTogJ2J1eVBpbicgfCAnYnV5JyB8ICdnZXRNb25leScgfCAnd2FpdFBpbicgfCAnbmV3T3JkZXInXG4gICAgICogICAgICB0ZXh0czogWyAneHgnLCAneXknIF1cbiAgICAgKiAgICAgID9wYWdlXG4gICAgICogfVxuICAgICAqL1xuICAgIGFwcC5yb3V0ZXIoJ3B1c2gtc3Vic2NyaWJlJywgYXN5bmMgKCBjdHgsIG5leHQgKSA9PiB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBjb25zdCB7IHR5cGUsIHRleHRzIH0gPSBldmVudC5kYXRhO1xuICAgICAgICAgICAgY29uc3Qgb3BlbmlkID0gZXZlbnQuZGF0YS5vcGVuSWQgfHwgZXZlbnQuZGF0YS5vcGVuaWQgfHwgZXZlbnQudXNlckluZm8ub3BlbklkO1xuICAgICAgICAgICAgY29uc3QgcGFnZSA9IGV2ZW50LmRhdGEucGFnZSB8fCAncGFnZXMvdHJpcC1lbnRlci9pbmRleCc7XG4gICAgICAgICAgICBjb25zdCB0ZW1wbGF0ZSA9IENPTkZJRy5zdWJzY3JpYmVfdGVtcGxhdGVzWyB0eXBlIF07XG5cbiAgICAgICAgICAgIGxldCB0ZXh0RGF0YSA9IHsgfTtcbiAgICAgICAgICAgIHRleHRzLm1hcCgoIHRleHQsIGsgKSA9PiB7XG4gICAgICAgICAgICAgICAgdGV4dERhdGEgPSB7XG4gICAgICAgICAgICAgICAgICAgIC4uLnRleHREYXRhLFxuICAgICAgICAgICAgICAgICAgICBbIHRlbXBsYXRlLnRleHRLZXlzWyBrIF1dOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZTogdGV4dFxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBjb25zdCBzdWJzY3JpYmVEYXRhID0ge1xuICAgICAgICAgICAgICAgIHBhZ2UsXG4gICAgICAgICAgICAgICAgZGF0YTogdGV4dERhdGEsXG4gICAgICAgICAgICAgICAgdG91c2VyOiBvcGVuaWQsXG4gICAgICAgICAgICAgICAgdGVtcGxhdGVJZDogdGVtcGxhdGUuaWRcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCc9PT3orqLpmIXmjqjpgIEnLCBzdWJzY3JpYmVEYXRhICk7XG5cbiAgICAgICAgICAgIGNvbnN0IHNlbmQkID0gYXdhaXQgY2xvdWQub3BlbmFwaS5zdWJzY3JpYmVNZXNzYWdlLnNlbmQoIHN1YnNjcmliZURhdGEgKTtcblxuICAgICAgICAgICAgaWYgKCBTdHJpbmcoIHNlbmQkLmVyckNvZGUgKSAhPT0gJzAnICkge1xuICAgICAgICAgICAgICAgIHRocm93IHNlbmQkLmVyck1zZztcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIGN0eC5ib2R5ID0ge1xuICAgICAgICAgICAgICAgIHN0YXR1czogMjAwXG4gICAgICAgICAgICB9XG4gICAgICAgIH0gY2F0Y2ggKCBlICkge1xuICAgICAgICAgICAgcmV0dXJuIGN0eC5ib2R5ID0geyBcbiAgICAgICAgICAgICAgICBzdGF0dXM6IDUwMCxcbiAgICAgICAgICAgICAgICBkYXRhOiBlXG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgfSlcblxuICAgIC8qKiBcbiAgICAgKiBAZGVzY3JpcHRpb25cbiAgICAgKi9cbiAgICBhcHAucm91dGVyKCdwdXNoLXN1YnNjcmliZS1jbG91ZCcsIGFzeW5jKCBjdHgsIG5leHQgKSA9PiB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBjb25zdCB7IHR5cGUsIHRleHRzIH0gPSBldmVudC5kYXRhO1xuICAgICAgICAgICAgY29uc3Qgb3BlbmlkID0gZXZlbnQuZGF0YS5vcGVuSWQgfHwgZXZlbnQuZGF0YS5vcGVuaWQgfHwgZXZlbnQudXNlckluZm8ub3BlbklkO1xuICAgICAgICAgICAgY29uc3QgcGFnZSA9IGV2ZW50LmRhdGEucGFnZSB8fCAncGFnZXMvdHJpcC1lbnRlci9pbmRleCc7XG4gICAgICAgICAgICBjb25zdCB0ZW1wbGF0ZSA9IENPTkZJRy5zdWJzY3JpYmVfdGVtcGxhdGVzWyB0eXBlIF07XG5cbiAgICAgICAgICAgIGxldCB0ZXh0RGF0YSA9IHsgfTtcbiAgICAgICAgICAgIHRleHRzLm1hcCgoIHRleHQsIGsgKSA9PiB7XG4gICAgICAgICAgICAgICAgdGV4dERhdGEgPSB7XG4gICAgICAgICAgICAgICAgICAgIC4uLnRleHREYXRhLFxuICAgICAgICAgICAgICAgICAgICBbIHRlbXBsYXRlLnRleHRLZXlzWyBrIF1dOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZTogdGV4dFxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBjb25zdCBzdWJzY3JpYmVEYXRhID0ge1xuICAgICAgICAgICAgICAgIHBhZ2UsXG4gICAgICAgICAgICAgICAgZGF0YTogdGV4dERhdGEsXG4gICAgICAgICAgICAgICAgdG91c2VyOiBvcGVuaWQsXG4gICAgICAgICAgICAgICAgdGVtcGxhdGVJZDogdGVtcGxhdGUuaWRcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIC8vIOiOt+WPlnRva2VuXG4gICAgICAgICAgICBjb25zdCByZXN1bHQgPSBhd2FpdCAoYXhpb3MgYXMgYW55KSh7XG4gICAgICAgICAgICAgICAgbWV0aG9kOiAnZ2V0JyxcbiAgICAgICAgICAgICAgICB1cmw6IGBodHRwczovL2FwaS53ZWl4aW4ucXEuY29tL2NnaS1iaW4vdG9rZW4/Z3JhbnRfdHlwZT1jbGllbnRfY3JlZGVudGlhbCZhcHBpZD0ke0NPTkZJRy5hcHAuaWR9JnNlY3JldD0ke0NPTkZJRy5hcHAuc2VjcmVjdH1gXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgY29uc3QgeyBhY2Nlc3NfdG9rZW4sIGVycmNvZGUgfSA9IHJlc3VsdC5kYXRhO1xuXG4gICAgICAgICAgICBpZiAoIGVycmNvZGUgKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgJ+eUn+aIkGFjY2Vzc190b2tlbumUmeivrydcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgY29uc3Qgc2VuZCA9IGF3YWl0IChheGlvcyBhcyBhbnkpKHtcbiAgICAgICAgICAgICAgICBkYXRhOiBzdWJzY3JpYmVEYXRhLFxuICAgICAgICAgICAgICAgIG1ldGhvZDogJ3Bvc3QnLFxuICAgICAgICAgICAgICAgIHVybDogYGh0dHBzOi8vYXBpLndlaXhpbi5xcS5jb20vY2dpLWJpbi9tZXNzYWdlL3N1YnNjcmliZS9zZW5kP2FjY2Vzc190b2tlbj0ke2FjY2Vzc190b2tlbn1gXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgaWYgKCBTdHJpbmcoIHNlbmQuZGF0YS5lcnJjb2RlICkgIT09ICcwJyApIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBzZW5kLmRhdGEuZXJybXNnO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gY3R4LmJvZHkgPSB7XG4gICAgICAgICAgICAgICAgc3RhdHVzOiAyMDBcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBjYXRjaCAoIGUgKSB7XG4gICAgICAgICAgICByZXR1cm4gY3R4LmJvZHkgPSB7IFxuICAgICAgICAgICAgICAgIHN0YXR1czogNTAwLFxuICAgICAgICAgICAgICAgIGRhdGE6IGVcbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgIC8qKlxuICAgICAqIEBkZXNjcmlwdGlvblxuICAgICAqIOWIm+W7uuS4gOS4quWIhuS6q+iusOW9lVxuICAgICAqIOihqOe7k+aehCB7XG4gICAgICogICAgICB0byAvLyDlj5fmjqjogIVcbiAgICAgKiAgICAgIGZyb20gLy8g5o6o5bm/6ICFXG4gICAgICogICAgICBwaWRcbiAgICAgKiAgICAgIGNyZWF0ZVRpbWUgLy8g5YiG5Lqr5pe26Ze0XG4gICAgICogICAgICBpc1N1Y2Nlc3M6IGJvb2xlYW4gLy8g5piv5ZCm5o6o5bm/5oiQ5YqfXG4gICAgICogICAgICBzdWNjZXNzVGltZTogLy8g5o6o5bm/5oiQ5Yqf55qE5pe26Ze0XG4gICAgICogfVxuICAgICAqIOivt+axgntcbiAgICAgKiAgICAgcGlkXG4gICAgICogICAgIGZyb21cbiAgICAgKiB9XG4gICAgICovXG4gICAgYXBwLnJvdXRlcignY3JlYXRlLXNoYXJlJywgYXN5bmMoIGN0eCwgbmV4dCApID0+IHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGNvbnN0IG9wZW5pZCA9IGV2ZW50LnVzZXJJbmZvLm9wZW5JZDtcbiAgICAgICAgICAgIGNvbnN0IHsgZnJvbSwgcGlkIH0gPSBldmVudC5kYXRhO1xuXG4gICAgICAgICAgICAvLyDop4TliJkxOumYsumHjeWkjVxuICAgICAgICAgICAgLy8g5aaC5p6cQee7mULmjqjlub/ov4fllYblk4Ex77yM5YiZQ+e7mULmjqjlub/llYblk4Ex5peg5pWIXG4gICAgICAgICAgICBjb25zdCBjb3VudCQgPSBhd2FpdCBkYi5jb2xsZWN0aW9uKCdzaGFyZS1yZWNvcmQnKVxuICAgICAgICAgICAgICAgIC53aGVyZSh7XG4gICAgICAgICAgICAgICAgICAgIHBpZCxcbiAgICAgICAgICAgICAgICAgICAgb3BlbmlkLFxuICAgICAgICAgICAgICAgICAgICBpc1N1Y2Nlc3M6IGZhbHNlXG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAuY291bnQoICk7XG5cbiAgICAgICAgICAgIGlmICggY291bnQkLnRvdGFsID4gMCApIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gY3R4LmJvZHkgPSB7IHN0YXR1czogMjAwIH07XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIOinhOWImTI6IOS4jeiDveiHquW3seaOqOiHquW3sVxuICAgICAgICAgICAgaWYgKCBvcGVuaWQgPT09IGZyb20gKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGN0eC5ib2R5ID0geyBzdGF0dXM6IDIwMCB9O1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyDop4TliJkzOiAyNGjlhoXkuI3og73ph43lpI3mjqhcbiAgICAgICAgICAgIGNvbnN0IGNvdW50MiQgPSBhd2FpdCBkYi5jb2xsZWN0aW9uKCdzaGFyZS1yZWNvcmQnKVxuICAgICAgICAgICAgICAgIC53aGVyZSh7XG4gICAgICAgICAgICAgICAgICAgIHBpZCxcbiAgICAgICAgICAgICAgICAgICAgb3BlbmlkLFxuICAgICAgICAgICAgICAgICAgICBpc1N1Y2Nlc3M6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgIHN1Y2Nlc3NUaW1lOiBfLmd0ZSggZ2V0Tm93KCB0cnVlICkgLSAyNCAqIDYwICogNjAgKiAxMDAwIClcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIC5jb3VudCggKTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgaWYgKCBjb3VudDIkLnRvdGFsID4gMCApIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gY3R4LmJvZHkgPSB7IHN0YXR1czogMjAwIH07XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIOWIm+W7ulxuICAgICAgICAgICAgY29uc3QgY3JlYXRlJCA9IGF3YWl0IGRiLmNvbGxlY3Rpb24oJ3NoYXJlLXJlY29yZCcpXG4gICAgICAgICAgICAgICAgLmFkZCh7XG4gICAgICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHBpZCxcbiAgICAgICAgICAgICAgICAgICAgICAgIGZyb20sXG4gICAgICAgICAgICAgICAgICAgICAgICBvcGVuaWQsXG4gICAgICAgICAgICAgICAgICAgICAgICBpc1N1Y2Nlc3M6IGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICAgICAgY3JlYXRlVGltZTogZ2V0Tm93KCB0cnVlIClcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICByZXR1cm4gY3R4LmJvZHkgPSB7IHN0YXR1czogMjAwIH07XG5cbiAgICAgICAgfSBjYXRjaCAoIGUgKSB7XG4gICAgICAgICAgICByZXR1cm4gY3R4LmJvZHkgPSB7XG4gICAgICAgICAgICAgICAgc3RhdHVzOiA1MDBcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0pXG5cbiAgICAvKiogXG4gICAgICogQGRlc2NyaXB0aW9uXG4gICAgICog6I635Y+W5o6o5bm/56ev5YiGXG4gICAgICoge1xuICAgICAqICAgIHNob3dNb3JlPzogZmFsc2VcbiAgICAgKiB9XG4gICAgICovXG4gICAgYXBwLnJvdXRlcigncHVzaC1pbnRlZ3JhbCcsIGFzeW5jICggY3R4LCBuZXh0ICkgPT4ge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgY29uc3QgeyBzaG93TW9yZSB9ID0gZXZlbnQuZGF0YTtcbiAgICAgICAgICAgIGNvbnN0IG9wZW5pZCA9IGV2ZW50LmRhdGEub3BlbklkIHx8IGV2ZW50LnVzZXJJbmZvLm9wZW5JZDtcbiAgICAgICAgICAgIGNvbnN0IHVzZXIkID0gYXdhaXQgZGIuY29sbGVjdGlvbigndXNlcicpXG4gICAgICAgICAgICAgICAgLndoZXJlKHtcbiAgICAgICAgICAgICAgICAgICAgb3BlbmlkXG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAuZ2V0KCApO1xuICAgICAgICAgICAgY29uc3QgdXNlciA9IHVzZXIkLmRhdGFbIDAgXTtcblxuICAgICAgICAgICAgY29uc3QgZXhwID0gISF1c2VyID8gdXNlci5leHAgfHwgMCA6IDA7XG4gICAgICAgICAgICBjb25zdCBpbnRlZ3JhbCA9ICEhdXNlciA/IHVzZXIucHVzaF9pbnRlZ3JhbCB8fCAwIDogMDtcblxuICAgICAgICAgICAgcmV0dXJuIGN0eC5ib2R5ID0ge1xuICAgICAgICAgICAgICAgIHN0YXR1czogMjAwLFxuICAgICAgICAgICAgICAgIGRhdGE6ICFzaG93TW9yZSA/IFxuICAgICAgICAgICAgICAgICAgICBpbnRlZ3JhbCA6XG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGV4cCxcbiAgICAgICAgICAgICAgICAgICAgICAgIGludGVncmFsLFxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfSBjYXRjaCAoIGUgKSB7XG4gICAgICAgICAgICByZXR1cm4gY3R4LmJvZHkgPSB7IHN0YXR1czogNTAwIH07XG4gICAgICAgIH0gXG4gICAgfSlcblxuICAgIC8qKlxuICAgICAqIEBkZXNjcmlwdGlvblxuICAgICAqIOiOt+WPluenr+WIhuS9v+eUqOiusOW9lVxuICAgICAqIHtcbiAgICAgKiAgICB0aWRzOiAnYSxiLGMnXG4gICAgICogICAgdHlwZTogJ3B1c2hfaW50ZWdyYWwnIHwgJydcbiAgICAgKiB9XG4gICAgICovXG4gICAgYXBwLnJvdXRlcigncHVzaC1pbnRlZ3JhbC11c2UnLCBhc3luYyAoIGN0eCwgbmV4dCApID0+IHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGNvbnN0IHsgdGlkcywgdHlwZSB9ID0gZXZlbnQuZGF0YTtcbiAgICAgICAgICAgIGNvbnN0IG9wZW5pZCA9IGV2ZW50LmRhdGEub3BlbklkIHx8IGV2ZW50LmRhdGEub3BlbmlkIHx8IGV2ZW50LnVzZXJJbmZvLm9wZW5JZDtcblxuICAgICAgICAgICAgY29uc3QgZmluZCQ6IGFueSA9IGF3YWl0IFByb21pc2UuYWxsKFxuICAgICAgICAgICAgICAgIHRpZHMuc3BsaXQoJywnKVxuICAgICAgICAgICAgICAgICAgICAubWFwKCB0aWQgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGRiLmNvbGxlY3Rpb24oJ2ludGVncmFsLXVzZS1yZWNvcmQnKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC53aGVyZSh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRpZCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb3BlbmlkXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAuZ2V0KCApO1xuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgKTtcblxuICAgICAgICAgICAgY29uc3QgbWV0YSA9IGZpbmQkXG4gICAgICAgICAgICAgICAgLmZpbHRlciggeCA9PiAhIXguZGF0YVsgMCBdKVxuICAgICAgICAgICAgICAgIC5tYXAoIHggPT4geC5kYXRhWyAwIF0pO1xuXG4gICAgICAgICAgICByZXR1cm4gY3R4LmJvZHkgPSB7XG4gICAgICAgICAgICAgICAgZGF0YTogbWV0YSxcbiAgICAgICAgICAgICAgICBzdGF0dXM6IDIwMFxuICAgICAgICAgICAgfVxuXG4gICAgICAgIH0gY2F0Y2ggKCBlICkge1xuICAgICAgICAgICAgcmV0dXJuIGN0eC5ib2R5ID0ge1xuICAgICAgICAgICAgICAgIHN0YXR1czogNTAwXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9KVxuXG4gICAgLyoqXG4gICAgICogQGRlc2NyaXB0aW9uXG4gICAgICog562+5Yiw6aKG56ev5YiGXG4gICAgICoge1xuICAgICAqICAgICAgZXhwOiBudW1iZXJcbiAgICAgKiB9XG4gICAgICovXG4gICAgYXBwLnJvdXRlcignZ2V0LWV4cCcsIGFzeW5jICggY3R4LCBuZXh0ICkgPT4ge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgY29uc3QgeyBleHAgfSA9IGV2ZW50LmRhdGE7XG4gICAgICAgICAgICBjb25zdCBvcGVuaWQgPSBldmVudC5kYXRhLm9wZW5JZCB8fCBldmVudC5kYXRhLm9wZW5pZCB8fCBldmVudC51c2VySW5mby5vcGVuSWQ7XG5cbiAgICAgICAgICAgIGNvbnN0IHVzZXIkID0gYXdhaXQgZGIuY29sbGVjdGlvbigndXNlcicpXG4gICAgICAgICAgICAgICAgLndoZXJlKHtcbiAgICAgICAgICAgICAgICAgICAgb3BlbmlkXG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAuZ2V0KCApO1xuXG4gICAgICAgICAgICBjb25zdCB1c2VyID0gdXNlciQuZGF0YVsgMCBdIHx8IG51bGw7XG5cbiAgICAgICAgICAgIGlmICggIXVzZXIgKSB7IHJldHVybiBjdHguYm9keSA9IHsgc3RhdHVzOiAyMDAgfX07XG5cbiAgICAgICAgICAgIGNvbnN0IGJkX3VpZCA9IHVzZXIuX2lkO1xuICAgICAgICAgICAgY29uc3QgYm9keSA9IHtcbiAgICAgICAgICAgICAgICAuLi51c2VyLFxuICAgICAgICAgICAgICAgIGV4cDogIXVzZXIuZXhwID8gZXhwIDogdXNlci5leHAgKyBleHBcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIGRlbGV0ZSBib2R5WydfaWQnXTtcblxuICAgICAgICAgICAgY29uc3QgdXBkYXRlJCA9IGF3YWl0IGRiLmNvbGxlY3Rpb24oJ3VzZXInKVxuICAgICAgICAgICAgICAgIC5kb2MoIFN0cmluZyggYmRfdWlkICkpXG4gICAgICAgICAgICAgICAgLnNldCh7XG4gICAgICAgICAgICAgICAgICAgIGRhdGE6IGJvZHlcbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgcmV0dXJuIGN0eC5ib2R5ID0ge1xuICAgICAgICAgICAgICAgIHN0YXR1czogMjAwXG4gICAgICAgICAgICB9O1xuXG4gICAgICAgIH0gY2F0Y2ggKCBlICkge1xuICAgICAgICAgICAgcmV0dXJuIGN0eC5ib2R5ID0geyBzdGF0dXM6IDUwMCB9O1xuICAgICAgICB9XG4gICAgfSlcblxuICAgIC8qKlxuICAgICAqIEBkZXNjcmlwdGlvblxuICAgICAqIOetvuWIsOmihuenr+WIhlxuICAgICAqIHtcbiAgICAgKiAgICAgIGludGVncmFsOiBudW1iZXJcbiAgICAgKiB9XG4gICAgICovXG4gICAgYXBwLnJvdXRlcignZ2V0LWludGVncmFsJywgYXN5bmMgKCBjdHgsIG5leHQgKSA9PiB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBjb25zdCB7IGludGVncmFsIH0gPSBldmVudC5kYXRhO1xuICAgICAgICAgICAgY29uc3Qgb3BlbmlkID0gZXZlbnQuZGF0YS5vcGVuSWQgfHwgZXZlbnQuZGF0YS5vcGVuaWQgfHwgZXZlbnQudXNlckluZm8ub3BlbklkO1xuXG4gICAgICAgICAgICBjb25zdCB1c2VyJCA9IGF3YWl0IGRiLmNvbGxlY3Rpb24oJ3VzZXInKVxuICAgICAgICAgICAgICAgIC53aGVyZSh7XG4gICAgICAgICAgICAgICAgICAgIG9wZW5pZFxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLmdldCggKTtcblxuICAgICAgICAgICAgY29uc3QgdXNlciA9IHVzZXIkLmRhdGFbIDAgXSB8fCBudWxsO1xuXG4gICAgICAgICAgICBpZiAoICF1c2VyICkgeyByZXR1cm4gY3R4LmJvZHkgPSB7IHN0YXR1czogMjAwIH19O1xuXG4gICAgICAgICAgICBjb25zdCBiZF91aWQgPSB1c2VyLl9pZDtcbiAgICAgICAgICAgIGNvbnN0IGJvZHkgPSB7XG4gICAgICAgICAgICAgICAgLi4udXNlcixcbiAgICAgICAgICAgICAgICBwdXNoX2ludGVncmFsOiAhdXNlci5wdXNoX2ludGVncmFsID8gXG4gICAgICAgICAgICAgICAgICAgIGludGVncmFsIDpcbiAgICAgICAgICAgICAgICAgICAgTnVtYmVyKCggdXNlci5wdXNoX2ludGVncmFsICsgaW50ZWdyYWwgKS50b0ZpeGVkKCAyICkpXG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICBkZWxldGUgYm9keVsnX2lkJ107XG5cbiAgICAgICAgICAgIGNvbnN0IHVwZGF0ZSQgPSBhd2FpdCBkYi5jb2xsZWN0aW9uKCd1c2VyJylcbiAgICAgICAgICAgICAgICAuZG9jKCBTdHJpbmcoIGJkX3VpZCApKVxuICAgICAgICAgICAgICAgIC5zZXQoe1xuICAgICAgICAgICAgICAgICAgICBkYXRhOiBib2R5XG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHJldHVybiBjdHguYm9keSA9IHtcbiAgICAgICAgICAgICAgICBzdGF0dXM6IDIwMFxuICAgICAgICAgICAgfTtcblxuICAgICAgICB9IGNhdGNoICggZSApIHtcbiAgICAgICAgICAgIHJldHVybiBjdHguYm9keSA9IHsgc3RhdHVzOiA1MDAgfTtcbiAgICAgICAgfVxuICAgIH0pXG5cbiAgICAvKipcbiAgICAgKiBAZGVzY3JpcHRpb25cbiAgICAgKiDpooblj5bmirXnjrDph5HmiJDlip/vvIzmjqjpgIFcbiAgICAgKiDlubborr7nva4y5bCP5pe25YCZ5ZCO55qE57uP6aqM6I635Y+W5o6o6YCBXG4gICAgICoge1xuICAgICAqICAgICAgc2lnbkV4cDog6aKG5Y+W55qE57uP6aqMXG4gICAgICogICAgICBnZXRfaW50ZWdyYWw6IG51bWJlciAvLyDmnKzmrKHojrflvpdcbiAgICAgKiAgICAgIG5leHRfaW50ZWdyYWw6IG51bWJlciAvLyDkuIvmrKHojrflvpdcbiAgICAgKiAgICAgIHdlZWtfaW50ZWdyYWw6IG51bWJlciAvLyDmnKzlkajojrflvpdcbiAgICAgKiAgICAgIG5leHR3ZWVrX2ludGVncmFsOiBudW1iZXIgLy8g5LiL5ZGo6I635b6XXG4gICAgICogfVxuICAgICAqL1xuICAgIGFwcC5yb3V0ZXIoJ2dldC1pbnRlZ3JhbC1wdXNoJywgYXN5bmMgKCBjdHgsIG5leHQgKSA9PiB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBjb25zdCBvcGVuaWQgPSBldmVudC5kYXRhLm9wZW5JZCB8fCBldmVudC5kYXRhLm9wZW5pZCB8fCBldmVudC51c2VySW5mby5vcGVuSWQ7XG4gICAgICAgICAgICBjb25zdCB7IHNpZ25FeHAsIGdldF9pbnRlZ3JhbCwgbmV4dF9pbnRlZ3JhbCwgd2Vla19pbnRlZ3JhbCwgbmV4dHdlZWtfaW50ZWdyYWwgfSA9IGV2ZW50LmRhdGE7XG5cbiAgICAgICAgICAgIC8vIDTjgIHosIPnlKjmjqjpgIFcbiAgICAgICAgICAgIGNvbnN0IHB1c2gkID0gYXdhaXQgY2xvdWQuY2FsbEZ1bmN0aW9uKHtcbiAgICAgICAgICAgICAgICBuYW1lOiAnY29tbW9uJyxcbiAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICAgICR1cmw6ICdwdXNoLXN1YnNjcmliZS1jbG91ZCcsXG4gICAgICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG9wZW5pZCxcbiAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6ICdob25nYmFvJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIHBhZ2U6ICdwYWdlcy9teS9pbmRleCcsXG4gICAgICAgICAgICAgICAgICAgICAgICB0ZXh0czogW2Ake2dldF9pbnRlZ3JhbH3lhYPmirXnjrDph5HvvIFgLCBg5LiL5Y2V5bCx6IO955So77yB5pys5ZGo55m76ZmG6YCBJHt3ZWVrX2ludGVncmFsfeWFg++8gWBdXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgLy8gNeOAgeaPkuWFpeiwg+eUqOagiFxuICAgICAgICAgICAgY29uc3QgY3JlYXRlJCA9IGF3YWl0IGRiLmNvbGxlY3Rpb24oJ3B1c2gtdGltZXInKVxuICAgICAgICAgICAgICAgIC5hZGQoe1xuICAgICAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBvcGVuaWQsXG4gICAgICAgICAgICAgICAgICAgICAgICB0ZXh0czogW2DnmbvpmYbpooblj5Yke3NpZ25FeHB954K557uP6aqMYCwgYOWNh+e6p+WQju+8jOWFqOWRqOWPr+mihiR7bmV4dHdlZWtfaW50ZWdyYWx95YWD77yBYF0sXG4gICAgICAgICAgICAgICAgICAgICAgICBwdXNodGltZTogZ2V0Tm93KCB0cnVlICkgKyAyLjEgKiA2MCAqIDYwICogMTAwMCxcbiAgICAgICAgICAgICAgICAgICAgICAgIGRlc2M6ICfliLDml7bpl7Tpooblj5bnu4/pqozkuoYnLFxuICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogJ3VzZXItZXhwLWdldCdcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICByZXR1cm4gY3R4LmJvZHkgPSB7IHN0YXR1czogMjAwIH07XG5cbiAgICAgICAgfSBjYXRjaCAoIGUgKSB7XG4gICAgICAgICAgICByZXR1cm4gY3R4LmJvZHkgPSB7IHN0YXR1czogNTAwIH07XG4gICAgICAgIH1cbiAgICB9KVxuXG4gICAgLyoqIFxuICAgICAqIEBkZXNjcmlwdGlvblxuICAgICAqIOiOt+WPluiuoumYheaooeadv+WIl+ihqFxuICAgICAqL1xuICAgIGFwcC5yb3V0ZXIoJ2dldC1zdWJzY3JpYmUtdGVtcGxhdGVzJywgYXN5bmMgKCBjdHgsIG5leHQgKSA9PiB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICByZXR1cm4gY3R4LmJvZHkgPSB7IFxuICAgICAgICAgICAgICAgIHN0YXR1czogMjAwLFxuICAgICAgICAgICAgICAgIGRhdGE6IENPTkZJRy5zdWJzY3JpYmVfdGVtcGxhdGVzXG4gICAgICAgICAgICB9O1xuICAgICAgICB9IGNhdGNoICggZSApIHtcbiAgICAgICAgICAgIHJldHVybiBjdHguYm9keSA9IHsgc3RhdHVzOiA1MDAgfTtcbiAgICAgICAgfVxuICAgIH0pXG5cbiAgICAvKipcbiAgICAgKiBAZGVzY3JpcHRpb25cbiAgICAgKiDmoLnmja5vcGVuaWTov5Tlm57nlKjmiLfkv6Hmga/vvIjlj6/ov5Tlm55udWxs77yJXG4gICAgICovXG4gICAgYXBwLnJvdXRlcignZ2V0LXVzZXItaW5mbycsIGFzeW5jICggY3R4LCBuZXh0ICkgPT4ge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgY29uc3Qgb3BlbmlkID0gZXZlbnQuZGF0YS5vcGVuSWQgfHwgZXZlbnQuZGF0YS5vcGVuaWQgfHwgZXZlbnQudXNlckluZm8ub3BlbklkO1xuICAgICAgICAgICAgY29uc3QgdXNlciQgPSBhd2FpdCBkYi5jb2xsZWN0aW9uKCd1c2VyJylcbiAgICAgICAgICAgICAgICAud2hlcmUoe1xuICAgICAgICAgICAgICAgICAgICBvcGVuaWRcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIC5nZXQoICk7XG5cbiAgICAgICAgICAgIGNvbnN0IGRhdGEgPSB1c2VyJC5kYXRhWyAwIF0gfHwgbnVsbDtcblxuICAgICAgICAgICAgcmV0dXJuIGN0eC5ib2R5ID0ge1xuICAgICAgICAgICAgICAgIGRhdGEsXG4gICAgICAgICAgICAgICAgc3RhdHVzOiAyMDBcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBjYXRjaCAoIGUgKSB7XG4gICAgICAgICAgICByZXR1cm4gY3R4LmJvZHkgPSB7XG4gICAgICAgICAgICAgICAgc3RhdHVzOiAyMDAsXG4gICAgICAgICAgICAgICAgZGF0YTogZVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSlcblxuICAgIC8qKiBcbiAgICAgKiBAZGVzY3JpcHRpb25cbiAgICAgKiDmtYvor5XkuJPnlKhcbiAgICAgKi9cbiAgICBhcHAucm91dGVyKCd0ZXN0JywgYXN5bmMgKCBjdHgsIG5leHQgKSA9PiB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBjb25zdCBvcGVuaWQgPSBldmVudC5kYXRhLm9wZW5JZCB8fCBldmVudC5kYXRhLm9wZW5pZCB8fCBldmVudC51c2VySW5mby5vcGVuSWQ7XG4gICAgICAgICAgICBjb25zdCByZXN1bHQgPSBhd2FpdCBjbG91ZC5vcGVuYXBpLnN1YnNjcmliZU1lc3NhZ2Uuc2VuZCh7XG4gICAgICAgICAgICAgICAgdG91c2VyOiBvcGVuaWQsXG4gICAgICAgICAgICAgICAgcGFnZTogJ3BhZ2VzL3RyaXAtZW50ZXIvaW5kZXgnLFxuICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgdGhpbmcxMToge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU6ICflkbXlkbXlkbXpop0nXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIHRoaW5nNjoge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU6ICcyMDE15bm0MDHmnIgwNeaXpSdcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgdGVtcGxhdGVJZDogJ3U5MUNxb283NnBobl8wbzVOX0pkcXhGS1ZVRjUtZjJXNXpFanppR08xN2cnXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHJldHVybiBjdHguYm9keSA9IHtcbiAgICAgICAgICAgICAgICBzdGF0dXM6IDIwMCxcbiAgICAgICAgICAgICAgICBkYXRhOiByZXN1bHRcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBjYXRjaCAoIGUgKSB7XG4gICAgICAgICAgICByZXR1cm4gY3R4LmJvZHkgPSB7IFxuICAgICAgICAgICAgICAgIHN0YXR1czogNTAwLFxuICAgICAgICAgICAgICAgIGRhdGE6IGVcbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICB9KVxuXG4gICAgcmV0dXJuIGFwcC5zZXJ2ZSggKTtcblxufVxuXG5jb25zdCB0aW1lID0gdHMgPT4gbmV3IFByb21pc2UoIHJlc292bGUgPT4ge1xuICAgIHNldFRpbWVvdXQoKCApID0+IHJlc292bGUoICksIHRzICk7XG59KVxuXG4vKipcbiAqIOWIneWni+WMluaVsOaNruW6k+OAgeWfuuehgOaVsOaNrlxuICovXG5jb25zdCBpbml0REIgPSAoICkgPT4gbmV3IFByb21pc2UoIGFzeW5jIHJlc29sdmUgPT4ge1xuICAgIHRyeSB7XG5cbiAgICAgICAgLyoqIOWIneWni+WMluihqCAqL1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgY29uc3QgY29sbGVjdGlvbnMgPSBDT05GSUcuY29sbGVjdGlvbnM7XG4gICAgICAgICAgICBhd2FpdCBQcm9taXNlLmFsbChcbiAgICAgICAgICAgICAgICBjb2xsZWN0aW9ucy5tYXAoIGNvbGxlY3Rpb25OYW1lID0+IChkYiBhcyBhbnkpLmNyZWF0ZUNvbGxlY3Rpb24oIGNvbGxlY3Rpb25OYW1lICkpXG4gICAgICAgICAgICApO1xuICAgICAgICB9IGNhdGNoICggZSApIHsgfVxuXG4gICAgICAgIGF3YWl0IHRpbWUoIDgwMCApO1xuXG4gICAgICAgIC8qKiDliJ3lp4vljJbmlbDmja7lrZflhbggKi9cbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGNvbnN0IGRpY3MgPSBDT05GSUcuZGljO1xuICAgICAgICAgICAgYXdhaXQgUHJvbWlzZS5hbGwoXG4gICAgICAgICAgICAgICAgZGljcy5tYXAoIGFzeW5jIGRpY1NldCA9PiB7XG5cbiAgICAgICAgICAgICAgICAgICAgY29uc3QgdGFyZ2V0RGljJCA9IGF3YWl0IGRiLmNvbGxlY3Rpb24oJ2RpYycpXG4gICAgICAgICAgICAgICAgICAgICAgICAud2hlcmUoe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJlbG9uZzogZGljU2V0LmJlbG9uZ1xuICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgICAgIC5nZXQoICk7XG5cbiAgICAgICAgICAgICAgICAgICAgY29uc3QgdGFyZ2V0RGljID0gdGFyZ2V0RGljJC5kYXRhWyAwIF07XG4gICAgICAgICAgICAgICAgICAgIGlmICggISF0YXJnZXREaWMgKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBhd2FpdCBkYi5jb2xsZWN0aW9uKCdkaWMnKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5kb2MoIFN0cmluZyggdGFyZ2V0RGljLl9pZCApKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5zZXQoe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhOiBkaWNTZXRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgYXdhaXQgZGIuY29sbGVjdGlvbignZGljJylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAuYWRkKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YTogZGljU2V0XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgKTtcbiAgICAgICAgfSBjYXRjaCAoIGUgKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZygnZWVlJywgZSApO1xuICAgICAgICB9XG5cbiAgICAgICAgLyoqIOWIneWni+WMluW6lOeUqOmFjee9riAqL1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgY29uc3QgYXBwQ29uZiA9IENPTkZJRy5hcHBDb25mcztcbiAgICAgICAgICAgIGF3YWl0IFByb21pc2UuYWxsKFxuICAgICAgICAgICAgICAgIGFwcENvbmYubWFwKCBhc3luYyBjb25mID0+IHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgdGFyZ2V0Q29uZiQgPSBhd2FpdCBkYi5jb2xsZWN0aW9uKCdhcHAtY29uZmlnJylcbiAgICAgICAgICAgICAgICAgICAgICAgIC53aGVyZSh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogY29uZi50eXBlXG4gICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAgICAgLmdldCggKTtcblxuICAgICAgICAgICAgICAgICAgICBjb25zdCB0YXJnZXRDb25mID0gdGFyZ2V0Q29uZiQuZGF0YVsgMCBdO1xuICAgICAgICAgICAgICAgICAgICBpZiAoICEhdGFyZ2V0Q29uZiApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIOeUseS6jumFjee9ruW3sue7j+eUn+aViOS4lOaKleWFpeS9v+eUqO+8jOi/memHjOS4jeiDveebtOaOpeabtOaUueW3suacieeahOe6v+S4iumFjee9rlxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gYXdhaXQgZGIuY29sbGVjdGlvbignYXBwLWNvbmZpZycpXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyAgICAgLmRvYyggU3RyaW5nKCB0YXJnZXRDb25mLl9pZCApKVxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gICAgIC5zZXQoe1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gICAgICAgICBkYXRhOiBjb25mXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGF3YWl0IGRiLmNvbGxlY3Rpb24oJ2FwcC1jb25maWcnKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5hZGQoe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhOiBjb25mXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgKTtcbiAgICAgICAgfSBjYXRjaCAoIGUgKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZygnZWVlJywgZSApO1xuICAgICAgICB9XG5cbiAgICAgICAgcmVzb2x2ZSggKTtcblxuICAgIH0gY2F0Y2ggKCBlICkgeyByZXNvbHZlKCApO31cbn0pOyJdfQ==