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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
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
exports.main = function (event, context) { return __awaiter(void 0, void 0, void 0, function () {
    var app;
    return __generator(this, function (_a) {
        app = new TcbRouter({ event: event });
        app.router('init', function (ctx, next) { return __awaiter(void 0, void 0, void 0, function () {
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
        app.router('dic', function (ctx, next) { return __awaiter(void 0, void 0, void 0, function () {
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
        app.router('userEdit', function (ctx, next) { return __awaiter(void 0, void 0, void 0, function () {
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
                                    integral: 0,
                                    push_integral: 0
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
        app.router('is-new-customer', function (ctx, next) { return __awaiter(void 0, void 0, void 0, function () {
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
        app.router('should-prepay', function (ctx, next) { return __awaiter(void 0, void 0, void 0, function () {
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
        app.router('wxpay', function (ctx, next) { return __awaiter(void 0, void 0, void 0, function () {
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
        app.router('wxinfo-edit', function (ctx, next) { return __awaiter(void 0, void 0, void 0, function () {
            var temp_1, e_7;
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
                        return [4, Promise.all(temp_1.map(function (x) { return __awaiter(void 0, void 0, void 0, function () {
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
        app.router('wxinfo', function (ctx, next) { return __awaiter(void 0, void 0, void 0, function () {
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
        app.router('mypage-info', function (ctx, next) { return __awaiter(void 0, void 0, void 0, function () {
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
        app.router('customer-in-trip', function (ctx, next) { return __awaiter(void 0, void 0, void 0, function () {
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
        app.router('notification-getmoney', function (ctx, next) { return __awaiter(void 0, void 0, void 0, function () {
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
        app.router('add-auth-by-psw', function (ctx, next) { return __awaiter(void 0, void 0, void 0, function () {
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
        app.router('check-app-config', function (ctx, next) { return __awaiter(void 0, void 0, void 0, function () {
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
        app.router('update-app-config', function (ctx, next) { return __awaiter(void 0, void 0, void 0, function () {
            var configs_1, e_15;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        configs_1 = event.data.configs;
                        return [4, Promise.all(Object.keys(configs_1)
                                .map(function (configKey) { return __awaiter(void 0, void 0, void 0, function () {
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
        app.router('create-qrcode', function (ctx, next) { return __awaiter(void 0, void 0, void 0, function () {
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
        app.router('create-formid', function (ctx, next) { return __awaiter(void 0, void 0, void 0, function () {
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
        app.router('push-template', function (ctx, next) { return __awaiter(void 0, void 0, void 0, function () {
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
        app.router('push-template-cloud', function (ctx, next) { return __awaiter(void 0, void 0, void 0, function () {
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
        app.router('push-subscribe', function (ctx, next) { return __awaiter(void 0, void 0, void 0, function () {
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
                            textData_3 = __assign(__assign({}, textData_3), (_a = {}, _a[template_1.textKeys[k]] = {
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
                        console.log('????', e_22);
                        return [2, ctx.body = {
                                status: 500,
                                data: e_22
                            }];
                    case 3: return [2];
                }
            });
        }); });
        app.router('push-subscribe-cloud', function (ctx, next) { return __awaiter(void 0, void 0, void 0, function () {
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
                            textData_4 = __assign(__assign({}, textData_4), (_a = {}, _a[template_2.textKeys[k]] = {
                                value: text
                            }, _a));
                        });
                        subscribeData = {
                            page: page,
                            data: textData_4,
                            touser: openid,
                            template_id: template_2.id
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
                        console.log('===云版本订阅推送', subscribeData);
                        return [4, axios({
                                data: subscribeData,
                                method: 'post',
                                url: "https://api.weixin.qq.com/cgi-bin/message/subscribe/send?access_token=" + access_token
                            })];
                    case 2:
                        send = _c.sent();
                        console.log('===云版本订阅推送', send.data);
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
        app.router('create-share', function (ctx, next) { return __awaiter(void 0, void 0, void 0, function () {
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
        app.router('push-integral', function (ctx, next) { return __awaiter(void 0, void 0, void 0, function () {
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
        app.router('push-integral-use', function (ctx, next) { return __awaiter(void 0, void 0, void 0, function () {
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
        app.router('push-integral-create', function (ctx, next) { return __awaiter(void 0, void 0, void 0, function () {
            var _a, tid, value, openid, record$, record, user$, user, e_27;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 8, , 9]);
                        _a = event.data, tid = _a.tid, value = _a.value;
                        openid = event.data.openId || event.data.openid || event.userInfo.openId;
                        if (!value) {
                            return [2, ctx.body = {
                                    status: 200
                                }];
                        }
                        return [4, db.collection('integral-use-record')
                                .where({
                                tid: tid,
                                openid: openid,
                                type: 'push_integral'
                            })
                                .get()];
                    case 1:
                        record$ = _b.sent();
                        record = record$.data[0];
                        if (!(!!record && !!value)) return [3, 3];
                        return [4, db.collection('integral-use-record')
                                .doc(String(record._id))
                                .update({
                                data: {
                                    value: Number((record.value + value).toFixed(2))
                                }
                            })];
                    case 2:
                        _b.sent();
                        return [3, 5];
                    case 3:
                        if (!(!record && !!value)) return [3, 5];
                        return [4, db.collection('integral-use-record')
                                .add({
                                data: {
                                    tid: tid,
                                    openid: openid,
                                    type: 'push_integral',
                                    value: Number(value.toFixed(2)),
                                }
                            })];
                    case 4:
                        _b.sent();
                        _b.label = 5;
                    case 5: return [4, db.collection('user')
                            .where({
                            openid: openid
                        })
                            .get()];
                    case 6:
                        user$ = _b.sent();
                        user = user$.data[0];
                        return [4, db.collection('user')
                                .doc(String(user._id))
                                .update({
                                data: {
                                    push_integral: Number((user.push_integral - value).toFixed(2))
                                }
                            })];
                    case 7:
                        _b.sent();
                        return [2, ctx.body = {
                                status: 200
                            }];
                    case 8:
                        e_27 = _b.sent();
                        return [2, ctx.body = {
                                status: 500
                            }];
                    case 9: return [2];
                }
            });
        }); });
        app.router('get-exp', function (ctx, next) { return __awaiter(void 0, void 0, void 0, function () {
            var exp, openid, user$, user, bd_uid, body, update$, e_28;
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
                        body = __assign(__assign({}, user), { exp: !user.exp ? exp : user.exp + exp });
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
        app.router('get-integral', function (ctx, next) { return __awaiter(void 0, void 0, void 0, function () {
            var integral, openid, user$, user, bd_uid, body, update$, e_29;
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
                        body = __assign(__assign({}, user), { push_integral: !user.push_integral ?
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
                        e_29 = _a.sent();
                        return [2, ctx.body = { status: 500 }];
                    case 4: return [2];
                }
            });
        }); });
        app.router('get-integral-push', function (ctx, next) { return __awaiter(void 0, void 0, void 0, function () {
            var openid, _a, signExp, get_integral, next_integral, week_integral, nextweek_integral, push$, create$, e_30;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 3, , 4]);
                        openid = event.data.openId || event.data.openid || event.userInfo.openId;
                        _a = event.data, signExp = _a.signExp, get_integral = _a.get_integral, next_integral = _a.next_integral, week_integral = _a.week_integral, nextweek_integral = _a.nextweek_integral;
                        return [4, cloud.callFunction({
                                name: 'common',
                                data: {
                                    $url: 'push-subscribe',
                                    data: {
                                        openid: openid,
                                        type: 'hongbao',
                                        page: 'pages/my/index',
                                        texts: ["\u6210\u529F\u9886\u53D6" + get_integral + "\u5143\u62B5\u73B0\u91D1\uFF01", "\u4E0B\u5355\u5C31\u80FD\u7528\uFF01\u672C\u5468\u767B\u9646\u9001" + week_integral + "\u5143\uFF01"]
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
                        e_30 = _b.sent();
                        return [2, ctx.body = { status: 500 }];
                    case 4: return [2];
                }
            });
        }); });
        app.router('get-subscribe-templates', function (ctx, next) { return __awaiter(void 0, void 0, void 0, function () {
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
        app.router('get-user-info', function (ctx, next) { return __awaiter(void 0, void 0, void 0, function () {
            var openid, user$, data, adm$, e_31;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 5, , 6]);
                        openid = event.data.openId || event.data.openid || event.userInfo.openId;
                        return [4, db.collection('user')
                                .where({
                                openid: openid
                            })
                                .get()];
                    case 1:
                        user$ = _a.sent();
                        data = user$.data[0] || null;
                        if (!!!data) return [3, 3];
                        return [4, db.collection('manager-member')
                                .where(({
                                openid: data.openid
                            }))
                                .count()];
                    case 2:
                        adm$ = _a.sent();
                        return [2, ctx.body = {
                                data: __assign(__assign({}, data), { role: adm$.total > 0 ? 1 : 0 }),
                                status: 200
                            }];
                    case 3: return [2, ctx.body = {
                            data: null,
                            status: 200
                        }];
                    case 4: return [3, 6];
                    case 5:
                        e_31 = _a.sent();
                        return [2, ctx.body = {
                                status: 200,
                                data: e_31
                            }];
                    case 6: return [2];
                }
            });
        }); });
        app.router('test', function (ctx, next) { return __awaiter(void 0, void 0, void 0, function () {
            var nowTime, y, m, d, lastNightTime, time_1, visitorRecords$, visitorRecords, maxPid_1, maxNum_1, order$, order_1, sl$, sl_1, adms$, good$_1, e_32;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 7, , 8]);
                        nowTime = getNow();
                        y = nowTime.getFullYear();
                        m = nowTime.getMonth() + 1;
                        d = nowTime.getDate();
                        lastNightTime = new Date(y + "/" + m + "/" + d + " 00:00:00");
                        time_1 = lastNightTime.getTime() - 6 * 60 * 60 * 1000;
                        return [4, db.collection('good-visiting-record')
                                .where({
                                visitTime: _.gte(time_1)
                            })
                                .field({
                                pid: true
                            })
                                .get()];
                    case 1:
                        visitorRecords$ = _a.sent();
                        visitorRecords = visitorRecords$.data;
                        maxPid_1 = '';
                        maxNum_1 = 0;
                        visitorRecords.reduce(function (res, record) {
                            res[record.pid] = !res[record.pid] ? 1 : res[record.pid] + 1;
                            if (res[record.pid] > maxNum_1) {
                                maxPid_1 = record.pid;
                                maxNum_1 = res[record.pid];
                            }
                            return res;
                        }, {});
                        if (!maxNum_1 || !maxPid_1) {
                            return [2, ctx.body = { status: 200 }];
                        }
                        ;
                        return [4, db.collection('order')
                                .where({
                                createTime: _.gte(time_1)
                            })
                                .field({
                                tid: true
                            })
                                .limit(1)
                                .get()];
                    case 2:
                        order$ = _a.sent();
                        order_1 = order$.data[0];
                        if (order$.data.length === 0) {
                            return [2, ctx.body = { status: 200 }];
                        }
                        return [4, db.collection('shopping-list')
                                .where({
                                pid: maxPid_1,
                                tid: order_1.tid
                            })
                                .field({
                                uids: true
                            })
                                .get()];
                    case 3:
                        sl$ = _a.sent();
                        sl_1 = sl$.data[0];
                        if (sl$.data.length === 0) {
                            return [2, ctx.body = { status: 200 }];
                        }
                        return [4, db.collection('manager-member')
                                .where({})
                                .get()];
                    case 4:
                        adms$ = _a.sent();
                        return [4, db.collection('goods')
                                .doc(String(maxPid_1))
                                .field({
                                title: true
                            })
                                .get()];
                    case 5:
                        good$_1 = _a.sent();
                        return [4, Promise.all(adms$.data.map(function (adm) { return __awaiter(void 0, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4, cloud.callFunction({
                                                name: 'common',
                                                data: {
                                                    $url: 'push-subscribe',
                                                    data: {
                                                        openid: adm.openid,
                                                        type: 'waitPin',
                                                        page: "pages/manager-trip-order/index?id=" + order_1.tid,
                                                        texts: ["\u6628\u5929\u6709" + maxNum_1 + "\u4EBA\u6D4F\u89C8\uFF0C" + sl_1.uids.length + "\u4EBA\u6210\u529F" + (sl_1.uids.length > 1 ? '拼团！' : '下单！'), "" + good$_1.data.title]
                                                    }
                                                }
                                            })];
                                        case 1:
                                            _a.sent();
                                            return [2];
                                    }
                                });
                            }); }))];
                    case 6:
                        _a.sent();
                        return [2, ctx.body = {
                                status: 200
                            }];
                    case 7:
                        e_32 = _a.sent();
                        return [2, ctx.body = {
                                status: 500,
                                data: e_32
                            }];
                    case 8: return [2];
                }
            });
        }); });
        return [2, app.serve()];
    });
}); };
var time = function (ts) { return new Promise(function (resovle) {
    setTimeout(function () { return resovle(); }, ts);
}); };
var initDB = function () { return new Promise(function (resolve) { return __awaiter(void 0, void 0, void 0, function () {
    var collections, e_33, dics, e_34, appConf, e_35, e_36;
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
                e_33 = _a.sent();
                return [3, 4];
            case 4: return [4, time(800)];
            case 5:
                _a.sent();
                _a.label = 6;
            case 6:
                _a.trys.push([6, 8, , 9]);
                dics = CONFIG.dic;
                return [4, Promise.all(dics.map(function (dicSet) { return __awaiter(void 0, void 0, void 0, function () {
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
                e_34 = _a.sent();
                console.log('eee', e_34);
                return [3, 9];
            case 9:
                _a.trys.push([9, 11, , 12]);
                appConf = CONFIG.appConfs;
                return [4, Promise.all(appConf.map(function (conf) { return __awaiter(void 0, void 0, void 0, function () {
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
                e_35 = _a.sent();
                console.log('eee', e_35);
                return [3, 12];
            case 12:
                resolve();
                return [3, 14];
            case 13:
                e_36 = _a.sent();
                resolve();
                return [3, 14];
            case 14: return [2];
        }
    });
}); }); };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSxxQ0FBdUM7QUFDdkMsc0NBQXdDO0FBQ3hDLDZCQUErQjtBQUMvQiwrQkFBaUM7QUFDakMsb0NBQXNDO0FBQ3RDLGlDQUFtQztBQUVuQyxLQUFLLENBQUMsSUFBSSxDQUFDO0lBQ1AsR0FBRyxFQUFFLE9BQU8sQ0FBQyxHQUFHLENBQUMsS0FBSztDQUN6QixDQUFDLENBQUM7QUFFSCxJQUFNLEVBQUUsR0FBZ0IsS0FBSyxDQUFDLFFBQVEsRUFBRyxDQUFDO0FBQzFDLElBQU0sQ0FBQyxHQUFHLEVBQUUsQ0FBQyxPQUFPLENBQUM7QUFRckIsSUFBTSxNQUFNLEdBQUcsVUFBRSxFQUFVO0lBQVYsbUJBQUEsRUFBQSxVQUFVO0lBQ3ZCLElBQUssRUFBRSxFQUFHO1FBQ04sT0FBTyxJQUFJLENBQUMsR0FBRyxFQUFHLENBQUM7S0FDdEI7SUFDRCxJQUFNLE1BQU0sR0FBRyxJQUFJLElBQUksQ0FBRSxJQUFJLElBQUksRUFBRyxDQUFDLGNBQWMsRUFBRyxDQUFDLENBQUM7SUFDeEQsT0FBTyxJQUFJLElBQUksQ0FBRSxNQUFNLENBQUMsT0FBTyxFQUFHLEdBQUcsQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsSUFBSSxDQUFFLENBQUE7QUFDN0QsQ0FBQyxDQUFBO0FBS1ksUUFBQSxJQUFJLEdBQUcsVUFBUSxLQUFLLEVBQUUsT0FBTzs7O1FBRWhDLEdBQUcsR0FBRyxJQUFJLFNBQVMsQ0FBQyxFQUFFLEtBQUssT0FBQSxFQUFFLENBQUMsQ0FBQztRQU1yQyxHQUFHLENBQUMsTUFBTSxDQUFDLE1BQU0sRUFBRSxVQUFPLEdBQUcsRUFBRSxJQUFJOzs7Ozs7d0JBRXJCLFdBQVcsR0FBRyxNQUFNLENBQUMsV0FBVyxDQUFD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Q0FDRCxJQUFJLEVBQUUsSUFBSTtxQ0FDYixDQUFDLEVBQUE7O29DQUhOLFNBR00sQ0FBQzs7Ozs7eUJBRWQsQ0FBQyxDQUNMLEVBQUE7O2dCQXhCRCxTQXdCQyxDQUFDOzs7O2dCQUVGLE9BQU8sQ0FBQyxHQUFHLENBQUMsS0FBSyxFQUFFLElBQUMsQ0FBRSxDQUFDOzs7Z0JBRzNCLE9BQU8sRUFBRyxDQUFDOzs7O2dCQUVDLE9BQU8sRUFBRyxDQUFDOzs7OztLQUM5QixDQUFDLEVBaEZvQixDQWdGcEIsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIGNsb3VkIGZyb20gJ3d4LXNlcnZlci1zZGsnO1xuaW1wb3J0ICogYXMgVGNiUm91dGVyIGZyb20gJ3RjYi1yb3V0ZXInO1xuaW1wb3J0ICogYXMgYXhpb3MgZnJvbSAnYXhpb3MnO1xuaW1wb3J0ICogYXMgY3J5cHRvIGZyb20gJ2NyeXB0byc7XG5pbXBvcnQgKiBhcyBycCBmcm9tICdyZXF1ZXN0LXByb21pc2UnO1xuaW1wb3J0ICogYXMgQ09ORklHIGZyb20gJy4vY29uZmlnJztcblxuY2xvdWQuaW5pdCh7XG4gICAgZW52OiBwcm9jZXNzLmVudi5jbG91ZFxufSk7XG5cbmNvbnN0IGRiOiBEQi5EYXRhYmFzZSA9IGNsb3VkLmRhdGFiYXNlKCApO1xuY29uc3QgXyA9IGRiLmNvbW1hbmQ7XG5cbi8qKiBcbiAqIOi9rOaNouagvOael+WwvOayu+aXtuWMuiArOOaXtuWMulxuICogRGF0ZSgpLm5vdygpIC8gbmV3IERhdGUoKS5nZXRUaW1lKCkg5piv5pe25LiN5pe25q2j5bi455qEKzhcbiAqIERhdGUudG9Mb2NhbFN0cmluZyggKSDlpb3lg4/mmK/kuIDnm7TmmK8rMOeahFxuICog5YWI5ou/5YiwICsw77yM54S25ZCOKzhcbiAqL1xuY29uc3QgZ2V0Tm93ID0gKCB0cyA9IGZhbHNlICk6IGFueSA9PiB7XG4gICAgaWYgKCB0cyApIHtcbiAgICAgICAgcmV0dXJuIERhdGUubm93KCApO1xuICAgIH1cbiAgICBjb25zdCB0aW1lXzAgPSBuZXcgRGF0ZSggbmV3IERhdGUoICkudG9Mb2NhbGVTdHJpbmcoICkpO1xuICAgIHJldHVybiBuZXcgRGF0ZSggdGltZV8wLmdldFRpbWUoICkgKyA4ICogNjAgKiA2MCAqIDEwMDAgKVxufVxuLyoqXG4gKiBAZGVzY3JpcHRpb24gXG4gKiDlhazlhbHmqKHlnZdcbiAqL1xuZXhwb3J0IGNvbnN0IG1haW4gPSBhc3luYyAoIGV2ZW50LCBjb250ZXh0ICkgPT4ge1xuXG4gICAgY29uc3QgYXBwID0gbmV3IFRjYlJvdXRlcih7IGV2ZW50IH0pO1xuXG4gICAgLyoqXG4gICAgICogQGRlc2NyaXB0aW9uXG4gICAgICog5Yid5aeL5YyW5ZCE5Liq5pWw5o2u5bqTXG4gICAgICovXG4gICAgYXBwLnJvdXRlcignaW5pdCcsIGFzeW5jKCBjdHgsIG5leHQgKSA9PiB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBjb25zdCBjb2xsZWN0aW9ucyA9IENPTkZJRy5jb2xsZWN0aW9ucztcbiAgICAgICAgICAgIGF3YWl0IFByb21pc2UuYWxsKFtcbiAgICAgICAgICAgICAgICBjb2xsZWN0aW9ucy5tYXAoIGNvbGxlY3Rpb25OYW1lID0+IChkYiBhcyBhbnkpLmNyZWF0ZUNvbGxlY3Rpb24oIGNvbGxlY3Rpb25OYW1lICkpXG4gICAgICAgICAgICBdKVxuXG4gICAgICAgICAgICByZXR1cm4gY3R4LmJvZHkgPSB7IHN0YXR1czogMjAwIH1cbiAgICAgICAgfSBjYXRjaCAoIGUgKSB7XG4gICAgICAgICAgICByZXR1cm4gY3R4LmJvZHkgPSB7IHN0YXR1czogNTAwLCBtZXNzYWdlOiBlIH1cbiAgICAgICAgfVxuICAgIH0pXG5cbiAgICAvKipcbiAgICAgKiBAZGVzY3JpcHRpb24gXG4gICAgICog5pWw5o2u5a2X5YW4XG4gICAgICoge1xuICAgICAqICAgICAgZGljTmFtZTogJ3h4eCx5eXksenp6J1xuICAgICAqICAgICAgZmlsdGVyQmpwOiBmYWxzZSB8IHRydWUgfCB1bmRlZmluZWQg77yIIOaYr+WQpui/h+a7pOS/neWBpeWTgSDvvIlcbiAgICAgKiB9XG4gICAgICovXG4gICAgYXBwLnJvdXRlcignZGljJywgYXN5bmMoIGN0eCwgbmV4dCApID0+IHtcbiAgICAgICAgdHJ5IHtcblxuICAgICAgICAgICAgLy8g5L+d5YGl5ZOB6YWN572uXG4gICAgICAgICAgICBsZXQgYmpwQ29uZmlnOiBhbnkgPSBudWxsO1xuICAgICAgICAgICAgY29uc3QgeyBkaWNOYW1lLCBmaWx0ZXJCanAgfSA9IGV2ZW50LmRhdGE7XG4gICAgICAgICAgICBjb25zdCBkYlJlcyA9IGF3YWl0IGRiLmNvbGxlY3Rpb24oJ2RpYycpXG4gICAgICAgICAgICAgICAgLndoZXJlKHtcbiAgICAgICAgICAgICAgICAgICAgYmVsb25nOiBkYi5SZWdFeHAoe1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVnZXhwOiBkaWNOYW1lLnJlcGxhY2UoL1xcLC9nLCAnfCcpLFxuICAgICAgICAgICAgICAgICAgICAgICAgb3B0aW9uZDogJ2knXG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAuZ2V0KCApO1xuXG4gICAgICAgICAgICAvLyDkv53lgaXlk4HphY3nva5cbiAgICAgICAgICAgIGlmICggISFmaWx0ZXJCanAgKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgYmpwQ29uZmlnJCA9IGF3YWl0IGRiLmNvbGxlY3Rpb24oJ2FwcC1jb25maWcnKVxuICAgICAgICAgICAgICAgICAgICAud2hlcmUoe1xuICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogJ2FwcC1ianAtdmlzaWJsZSdcbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgLmdldCggKTtcbiAgICAgICAgICAgICAgICBianBDb25maWcgPSBianBDb25maWckLmRhdGFbIDAgXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgICAgICBsZXQgcmVzdWx0ID0geyB9O1xuICAgICAgICAgICAgZGJSZXMuZGF0YS5tYXAoIGRpYyA9PiB7XG4gICAgICAgICAgICAgICAgcmVzdWx0ID0gT2JqZWN0LmFzc2lnbih7IH0sIHJlc3VsdCwge1xuICAgICAgICAgICAgICAgICAgICBbIGRpYy5iZWxvbmcgXTogZGljWyBkaWMuYmVsb25nIF1cbiAgICAgICAgICAgICAgICAgICAgICAgIC5maWx0ZXIoIHggPT4gISF4IClcbiAgICAgICAgICAgICAgICAgICAgICAgIC5maWx0ZXIoIHggPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICggISFianBDb25maWcgJiYgIWJqcENvbmZpZy52YWx1ZSApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFN0cmluZyggeC52YWx1ZSApICE9PSAnNCdcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHJldHVybiBjdHguYm9keSA9IHtcbiAgICAgICAgICAgICAgICBzdGF0dXM6IDIwMCxcbiAgICAgICAgICAgICAgICBkYXRhOiByZXN1bHRcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgfSBjYXRjaCAoIGUgKSB7XG4gICAgICAgICAgICByZXR1cm4gY3R4LmJvZHkgPSB7XG4gICAgICAgICAgICAgICAgc3RhdHVzOiA1MDAsXG4gICAgICAgICAgICAgICAgbWVzc2FnZTogZVxuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgLyoqXG4gICAgICogQGRlc2NyaXB0aW9uXG4gICAgICog5b6u5L+h55So5oi35L+h5oGv5a2Y5YKoXG4gICAgICovXG4gICAgYXBwLnJvdXRlcigndXNlckVkaXQnLCBhc3luYyggY3R4LCBuZXh0ICkgPT4ge1xuICAgICAgICB0cnkge1xuXG4gICAgICAgICAgICBjb25zdCBvcGVuaWQgPSBldmVudC51c2VySW5mby5vcGVuSWQ7XG4gICAgICAgICAgICBjb25zdCBkYXRhJCA9IGF3YWl0IGRiLmNvbGxlY3Rpb24oJ3VzZXInKVxuICAgICAgICAgICAgICAgIC53aGVyZSh7XG4gICAgICAgICAgICAgICAgICAgIG9wZW5pZFxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLmdldCggKVxuICAgICAgICAgICAgICAgIC5jYXRjaCggZXJyID0+IHsgdGhyb3cgYCR7ZXJyfWB9KTtcbiAgICAgICAgXG4gICAgICAgICAgICAvLyDlpoLmnpzkuI3lrZjlnKjvvIzliJnliJvlu7pcbiAgICAgICAgICAgIGlmICggZGF0YSQuZGF0YS5sZW5ndGggPT09IDAgKSB7XG4gICAgICAgIFxuICAgICAgICAgICAgICAgIGF3YWl0IGRiLmNvbGxlY3Rpb24oJ3VzZXInKVxuICAgICAgICAgICAgICAgICAgICAuYWRkKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRhdGE6IE9iamVjdC5hc3NpZ24oeyB9LCBldmVudC5kYXRhLCB7IFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9wZW5pZCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbnRlZ3JhbDogMCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwdXNoX2ludGVncmFsOiAwXG4gICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICB9KS5jYXRjaCggZXJyID0+IHsgdGhyb3cgYCR7ZXJyfWB9KTtcbiAgICAgICAgXG4gICAgICAgICAgICAvLyDlpoLmnpzlrZjlnKjvvIzliJnmm7TmlrBcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgY29uc3QgbWV0YSA9IE9iamVjdC5hc3NpZ24oeyB9LCBkYXRhJC5kYXRhWyAwIF0sIGV2ZW50LmRhdGEgKTtcbiAgICAgICAgICAgICAgICBkZWxldGUgbWV0YS5faWQ7XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgYXdhaXQgZGIuY29sbGVjdGlvbigndXNlcicpLmRvYygoIGRhdGEkLmRhdGFbIDAgXSBhcyBhbnkpLl9pZCApXG4gICAgICAgICAgICAgICAgICAgIC5zZXQoe1xuICAgICAgICAgICAgICAgICAgICAgICAgZGF0YTogT2JqZWN0LmFzc2lnbih7IH0sIG1ldGEsIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbnRlZ3JhbDogZGF0YSQuZGF0YVsgMCBdLmludGVncmFsXG4gICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICB9KS5jYXRjaCggZXJyID0+IHsgdGhyb3cgYCR7ZXJyfWB9KTtcbiAgICAgICAgICAgIH0gICAgXG5cbiAgICAgICAgICAgIHJldHVybiBjdHguYm9keSA9IHtcbiAgICAgICAgICAgICAgICBzdGF0dXM6IDIwMFxuICAgICAgICAgICAgfTtcblxuICAgICAgICB9IGNhdGNoICggZSApIHtcbiAgICAgICAgICAgIHJldHVybiBjdHguYm9keSA9IHtcbiAgICAgICAgICAgICAgICBzdGF0dXM6IDUwMCxcbiAgICAgICAgICAgICAgICBtZXNzYWdlOiBlXG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICAvKipcbiAgICAgKiBAZGVzY3JpcHRpb25cbiAgICAgKiDmmK/mlrDlrqLov5jmmK/ml6flrqJcbiAgICAgKiDmlrDlrqLvvIzmiJDlip/mlK/ku5jorqLljZUgPD0gM1xuICAgICovXG4gICAgYXBwLnJvdXRlcignaXMtbmV3LWN1c3RvbWVyJywgYXN5bmMoIGN0eCwgbmV4dCApID0+IHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgY29uc3Qgb3BlbmlkID0gZXZlbnQuZGF0YS5vcGVuSWQgfHwgZXZlbnQudXNlckluZm8ub3BlbklkO1xuICAgICAgICAgICAgY29uc3QgZmluZCQgPSBhd2FpdCBkYi5jb2xsZWN0aW9uKCdvcmRlcicpXG4gICAgICAgICAgICAgICAgLndoZXJlKHtcbiAgICAgICAgICAgICAgICAgICAgb3BlbmlkLFxuICAgICAgICAgICAgICAgICAgICBiYXNlX3N0YXR1czogJzMnXG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAuY291bnQoICk7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIHJldHVybiBjdHguYm9keSA9IHtcbiAgICAgICAgICAgICAgICBzdGF0dXM6IDIwMCxcbiAgICAgICAgICAgICAgICBkYXRhOiBmaW5kJC50b3RhbCA8IDNcbiAgICAgICAgICAgIH1cblxuICAgICAgICB9IGNhdGNoICggZSApIHtcbiAgICAgICAgICAgIHJldHVybiBjdHguYm9keSA9IHtcbiAgICAgICAgICAgICAgICBzdGF0dXM6IDIwMCxcbiAgICAgICAgICAgICAgICBkYXRhOiB0cnVlXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgIC8qKiBcbiAgICAgKiBAZGVzY3JpcHRpb25cbiAgICAgKiDlrqLmiLflnKjor6XourrooYznqIvvvIzmmK/lkKbpnIDopoHku5jorqLph5FcbiAgICAgKiB7XG4gICAgICogICAgdGlkXG4gICAgICogfVxuICAgICAqL1xuICAgIGFwcC5yb3V0ZXIoJ3Nob3VsZC1wcmVwYXknLCBhc3luYyggY3R4LCBuZXh0ICkgPT4ge1xuICAgICAgICB0cnkge1xuXG4gICAgICAgICAgICBjb25zdCB7IHRpZCB9ID0gZXZlbnQuZGF0YTtcbiAgICAgICAgICAgIGNvbnN0IG9wZW5pZCA9IGV2ZW50LmRhdGEub3BlbklkIHx8IGV2ZW50LnVzZXJJbmZvLm9wZW5JZDtcblxuICAgICAgICAgICAgY29uc3QgZmluZCQgPSBhd2FpdCBkYi5jb2xsZWN0aW9uKCdvcmRlcicpXG4gICAgICAgICAgICAgICAgLndoZXJlKHtcbiAgICAgICAgICAgICAgICAgICAgb3BlbmlkLFxuICAgICAgICAgICAgICAgICAgICBiYXNlX3N0YXR1czogJzMnXG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAuY291bnQoICk7XG5cbiAgICAgICAgICAgIGNvbnN0IHRyaXAkID0gYXdhaXQgZGIuY29sbGVjdGlvbigndHJpcCcpXG4gICAgICAgICAgICAgICAgLmRvYyggU3RyaW5nKCB0aWQgKSlcbiAgICAgICAgICAgICAgICAuZ2V0KCApO1xuICAgICAgICAgICAgY29uc3QgdHJpcCA9IHRyaXAkLmRhdGE7XG5cbiAgICAgICAgICAgIGNvbnN0IGlzTmV3ID0gZmluZCQudG90YWwgPCAzO1xuXG4gICAgICAgICAgICBjb25zdCBqdWRnZSA9ICggaXNOZXcsIHRyaXAgKSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKCAhdHJpcCApIHsgcmV0dXJuIHRydWU7IH1cbiAgICAgICAgICAgICAgICBpZiAoIGlzTmV3ICYmIHRyaXAucGF5bWVudCA9PT0gJzAnICkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcblxuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoIGlzTmV3ICYmIHRyaXAucGF5bWVudCA9PT0gJzEnICkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcblxuICAgICAgICAgICAgICAgIH0gIGVsc2UgaWYgKCBpc05ldyAmJiB0cmlwLnBheW1lbnQgPT09ICcyJyApIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKCAhaXNOZXcgJiYgdHJpcC5wYXltZW50ID09PSAnMCcgKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgfSAgZWxzZSBpZiAoICFpc05ldyAmJiB0cmlwLnBheW1lbnQgPT09ICcxJyApIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoIGlzTmV3ICYmIHRyaXAucGF5bWVudCA9PT0gJzInICkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIGN0eC5ib2R5ID0ge1xuICAgICAgICAgICAgICAgIHN0YXR1czogMjAwLFxuICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgaXNOZXcsXG4gICAgICAgICAgICAgICAgICAgIHNob3VsZFByZXBheToganVkZ2UoIGlzTmV3LCB0cmlwIClcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfSBjYXRjaCAoIGUgKSB7IHJldHVybiBjdHguYm9keSA9IHsgc3RhdHVzOiA1MDAgfTt9XG4gICAgfSlcblxuICAgIC8qKlxuICAgICAqIOW+ruS/oeaUr+S7mO+8jOi/lOWbnuaUr+S7mGFwaeW/heimgeWPguaVsFxuICAgICAqIC0tLS0tLS0tLS0tIOivt+axgiAtLS0tLS0tLS0tXG4gICAgICoge1xuICAgICAqICAgICAgdG90YWxfZmVlXG4gICAgICogfVxuICAgICAqL1xuICAgIGFwcC5yb3V0ZXIoJ3d4cGF5JywgYXN5bmMoIGN0eCwgbmV4dCApID0+IHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGNvbnN0IHsga2V5LCBib2R5LCBtY2hfaWQsIGF0dGFjaCwgbm90aWZ5X3VybCwgc3BiaWxsX2NyZWF0ZV9pcCB9ID0gQ09ORklHLnd4UGF5O1xuICAgICAgICAgICAgY29uc3QgYXBwaWQgPSBDT05GSUcuYXBwLmlkO1xuICAgICAgICAgICAgY29uc3QgdG90YWxfZmVlID0gZXZlbnQuZGF0YS50b3RhbF9mZWU7XG4gICAgICAgICAgICBjb25zdCBvcGVuaWQgPSBldmVudC51c2VySW5mby5vcGVuSWQ7XG4gICAgICAgICAgICBjb25zdCBub25jZV9zdHIgPSBNYXRoLnJhbmRvbSggKS50b1N0cmluZyggMzYgKS5zdWJzdHIoIDIsIDE1ICk7XG4gICAgICAgICAgICBjb25zdCB0aW1lU3RhbXAgPSBwYXJzZUludChTdHJpbmcoIERhdGUubm93KCkgLyAxMDAwICkpICsgJyc7XG4gICAgICAgICAgICBjb25zdCBvdXRfdHJhZGVfbm8gPSBcIm90blwiICsgbm9uY2Vfc3RyICsgdGltZVN0YW1wO1xuXG4gICAgICAgICAgICBjb25zdCBwYXlzaWduID0gKHsgLi4uYXJncyB9KSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3Qgc2E6IGFueSA9IFsgXVxuICAgICAgICAgICAgICAgIGZvciAoIGxldCBrIGluIGFyZ3MgKSB7XG4gICAgICAgICAgICAgICAgICAgIHNhLnB1c2goIGsgKyAnPScgKyBhcmdzWyBrIF0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBzYS5wdXNoKCdrZXk9JyArIGtleSApO1xuICAgICAgICAgICAgICAgIGNvbnN0IHMgPSAgY3J5cHRvLmNyZWF0ZUhhc2goJ21kNScpLnVwZGF0ZShzYS5qb2luKCcmJyksICd1dGY4JykuZGlnZXN0KCdoZXgnKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gcy50b1VwcGVyQ2FzZSggKTtcbiAgICAgICAgICAgIH1cbiAgICBcbiAgICAgICAgICAgIGxldCBmb3JtRGF0YSA9IFwiPHhtbD5cIjtcbiAgICBcbiAgICAgICAgICAgIGZvcm1EYXRhICs9IFwiPGFwcGlkPlwiICsgYXBwaWQgKyBcIjwvYXBwaWQ+XCJcbiAgICAgICAgXG4gICAgICAgICAgICBmb3JtRGF0YSArPSBcIjxhdHRhY2g+XCIgKyBhdHRhY2ggKyBcIjwvYXR0YWNoPlwiXG4gICAgICAgIFxuICAgICAgICAgICAgZm9ybURhdGEgKz0gXCI8Ym9keT5cIiArIGJvZHkgKyBcIjwvYm9keT5cIlxuICAgICAgICBcbiAgICAgICAgICAgIGZvcm1EYXRhICs9IFwiPG1jaF9pZD5cIiArIG1jaF9pZCArIFwiPC9tY2hfaWQ+XCJcbiAgICAgICAgXG4gICAgICAgICAgICBmb3JtRGF0YSArPSBcIjxub25jZV9zdHI+XCIgKyBub25jZV9zdHIgKyBcIjwvbm9uY2Vfc3RyPlwiXG4gICAgICAgIFxuICAgICAgICAgICAgZm9ybURhdGEgKz0gXCI8bm90aWZ5X3VybD5cIiArIG5vdGlmeV91cmwgKyBcIjwvbm90aWZ5X3VybD5cIlxuICAgICAgICBcbiAgICAgICAgICAgIGZvcm1EYXRhICs9IFwiPG9wZW5pZD5cIiArIG9wZW5pZCArIFwiPC9vcGVuaWQ+XCJcbiAgICAgICAgXG4gICAgICAgICAgICBmb3JtRGF0YSArPSBcIjxvdXRfdHJhZGVfbm8+XCIgKyBvdXRfdHJhZGVfbm8gKyBcIjwvb3V0X3RyYWRlX25vPlwiXG4gICAgICAgIFxuICAgICAgICAgICAgZm9ybURhdGEgKz0gXCI8c3BiaWxsX2NyZWF0ZV9pcD5cIiArIHNwYmlsbF9jcmVhdGVfaXAgKyBcIjwvc3BiaWxsX2NyZWF0ZV9pcD5cIlxuICAgICAgICBcbiAgICAgICAgICAgIGZvcm1EYXRhICs9IFwiPHRvdGFsX2ZlZT5cIiArIHRvdGFsX2ZlZSArIFwiPC90b3RhbF9mZWU+XCJcbiAgICAgICAgXG4gICAgICAgICAgICBmb3JtRGF0YSArPSBcIjx0cmFkZV90eXBlPkpTQVBJPC90cmFkZV90eXBlPlwiXG4gICAgICAgIFxuICAgICAgICAgICAgZm9ybURhdGEgKz0gXCI8c2lnbj5cIiArIHBheXNpZ24oeyBhcHBpZCwgYXR0YWNoLCBib2R5LCBtY2hfaWQsIG5vbmNlX3N0ciwgbm90aWZ5X3VybCwgb3BlbmlkLCBvdXRfdHJhZGVfbm8sIHNwYmlsbF9jcmVhdGVfaXAsIHRvdGFsX2ZlZSwgdHJhZGVfdHlwZTogJ0pTQVBJJyB9KSArIFwiPC9zaWduPlwiXG4gICAgICAgIFxuICAgICAgICAgICAgZm9ybURhdGEgKz0gXCI8L3htbD5cIjtcbiAgICBcbiAgICAgICAgICAgIGxldCByZXMgPSBhd2FpdCBycCh7IHVybDogXCJodHRwczovL2FwaS5tY2gud2VpeGluLnFxLmNvbS9wYXkvdW5pZmllZG9yZGVyXCIsIG1ldGhvZDogJ1BPU1QnLGJvZHk6IGZvcm1EYXRhIH0pO1xuICAgIFxuICAgICAgICAgICAgbGV0IHhtbCA9IHJlcy50b1N0cmluZyhcInV0Zi04XCIpO1xuICAgICAgICAgIFxuICAgICAgICAgICAgaWYgKCB4bWwuaW5kZXhPZigncHJlcGF5X2lkJykgPCAwICkge1xuICAgICAgICAgICAgICAgIHJldHVybiBjdHguYm9keSA9IHtcbiAgICAgICAgICAgICAgICAgICAgc3RhdHVzOiA1MDBcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb25zb2xlLmxvZygnZWVlZWUnLCBmb3JtRGF0YSwgeG1sICk7XG4gICAgICAgICAgICBsZXQgcHJlcGF5X2lkID0geG1sLnNwbGl0KFwiPHByZXBheV9pZD5cIilbMV0uc3BsaXQoXCI8L3ByZXBheV9pZD5cIilbMF0uc3BsaXQoJ1snKVsyXS5zcGxpdCgnXScpWzBdXG4gICAgXG4gICAgICAgICAgICBsZXQgcGF5U2lnbiA9IHBheXNpZ24oeyBhcHBJZDogYXBwaWQsIG5vbmNlU3RyOiBub25jZV9zdHIsIHBhY2thZ2U6ICgncHJlcGF5X2lkPScgKyBwcmVwYXlfaWQpLCBzaWduVHlwZTogJ01ENScsIHRpbWVTdGFtcDogdGltZVN0YW1wIH0pXG4gICAgICAgICAgICBcbiAgICAgICAgICAgIHJldHVybiBjdHguYm9keSA9IHtcbiAgICAgICAgICAgICAgICBzdGF0dXM6IDIwMCxcbiAgICAgICAgICAgICAgICBkYXRhOiB7IGFwcGlkLCBub25jZV9zdHIsIHRpbWVTdGFtcCwgcHJlcGF5X2lkLCBwYXlTaWduIH0gXG4gICAgICAgICAgICB9O1xuXG4gICAgICAgIH0gY2F0Y2ggKCBlICkge1xuICAgICAgICAgICAgcmV0dXJuIGN0eC5ib2R5ID0ge1xuICAgICAgICAgICAgICAgIHN0YXR1czogNTAwXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgIC8qKlxuICAgICAqIOS7o+i0reS4quS6uuW+ruS/oeS6jOe7tOeggeOAgee+pOS6jOe7tOeggVxuICAgICAqIC0tLS0tLSDor7fmsYIgLS0tLS0tXG4gICAgICoge1xuICAgICAqICAgICAgd3hfcXJjb2RlOiBzdHJpbmdbXVxuICAgICAqICAgICAgZ3JvdXBfcXJjb2RlOiBzdHJpbmdbXVxuICAgICAqIH1cbiAgICAgKi9cbiAgICBhcHAucm91dGVyKCd3eGluZm8tZWRpdCcsIGFzeW5jKCBjdHgsIG5leHQgKSA9PiB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGNvbnN0IHRlbXA6IGFueSA9IFsgXTtcbiAgICAgICAgICAgIE9iamVjdC5rZXlzKCBldmVudC5kYXRhICkubWFwKCBrZXkgPT4ge1xuICAgICAgICAgICAgICAgIGlmICggISFldmVudC5kYXRhWyBrZXkgXSkge1xuICAgICAgICAgICAgICAgICAgICB0ZW1wLnB1c2goe1xuICAgICAgICAgICAgICAgICAgICAgICAgdHlwZToga2V5LFxuICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU6IGV2ZW50LmRhdGFbIGtleSBdXG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIGF3YWl0IFByb21pc2UuYWxsKCB0ZW1wLm1hcCggYXN5bmMgeCA9PiB7XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgY29uc3QgZmluZCQgPSBhd2FpdCBkYi5jb2xsZWN0aW9uKCdtYW5hZ2VyLXd4LWluZm8nKVxuICAgICAgICAgICAgICAgICAgICAud2hlcmUoe1xuICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogeC50eXBlXG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgIC5nZXQoICk7XG5cbiAgICAgICAgICAgICAgICBpZiAoIGZpbmQkLmRhdGEubGVuZ3RoID4gMCApIHtcbiAgICAgICAgICAgICAgICAgICAgYXdhaXQgZGIuY29sbGVjdGlvbignbWFuYWdlci13eC1pbmZvJykuZG9jKCAoZmluZCQuZGF0YVsgMCBdIGFzIGFueSkuX2lkIClcbiAgICAgICAgICAgICAgICAgICAgICAgIC5zZXQoe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGE6IHhcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBhd2FpdCBkYi5jb2xsZWN0aW9uKCdtYW5hZ2VyLXd4LWluZm8nKVxuICAgICAgICAgICAgICAgICAgICAgICAgLmFkZCh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YTogeFxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB9KSk7XG5cbiAgICAgICAgICAgIHJldHVybiBjdHguYm9keSA9IHtcbiAgICAgICAgICAgICAgICBzdGF0dXM6IDIwMFxuICAgICAgICAgICAgfVxuXG4gICAgICAgIH0gY2F0Y2ggKCBlICkge1xuICAgICAgICAgICAgcmV0dXJuIGN0eC5ib2R5ID0geyBzdGF0dXM6IDUwMCB9O1xuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICAvKipcbiAgICAgKiBAZGVzY3JpcHRpb25cbiAgICAgKiDmn6Xor6Lku6PotK3kuKrkurrkuoznu7TnoIHkv6Hmga9cbiAgICAgKi9cbiAgICBhcHAucm91dGVyKCd3eGluZm8nLCBhc3luYyggY3R4LCBuZXh0ICkgPT4ge1xuICAgICAgICB0cnkge1xuXG4gICAgICAgICAgICBjb25zdCB0YXJnZXQgPSBbJ3d4X3FyY29kZScsICdncm91cF9xcmNvZGUnXTtcbiAgICAgICAgICAgIGNvbnN0IGZpbmRzJCA9IGF3YWl0IFByb21pc2UuYWxsKCB0YXJnZXQubWFwKCB0eXBlID0+IHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZGIuY29sbGVjdGlvbignbWFuYWdlci13eC1pbmZvJylcbiAgICAgICAgICAgICAgICAgICAgLndoZXJlKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHR5cGVcbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgLmdldCggKTtcbiAgICAgICAgICAgIH0pKTtcblxuICAgICAgICAgICAgY29uc3QgdGVtcCA9IHsgfTtcbiAgICAgICAgICAgIGZpbmRzJC5tYXAoKCBmaW5kJCwgaW5kZXggKSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKCBmaW5kJC5kYXRhLmxlbmd0aCA+IDAgKSB7XG4gICAgICAgICAgICAgICAgICAgIHRlbXBbIHRhcmdldFsgaW5kZXggXV0gPSBmaW5kJC5kYXRhWyAwIF0udmFsdWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHJldHVybiBjdHguYm9keSA9IHtcbiAgICAgICAgICAgICAgICBzdGF0dXM6IDIwMCxcbiAgICAgICAgICAgICAgICBkYXRhOiB0ZW1wXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfSBjYXRjaCAoIGUgKSB7XG4gICAgICAgICAgICByZXR1cm4gY3R4LmJvZHkgPSB7IHN0YXR1czogNTAwIH07XG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgIC8qKiBcbiAgICAgKiBAZGVzY3JpcHRpb25cbiAgICAgKiDojrflj5bigJzmiJHnmoTpobXpnaLigJ3nmoTln7rmnKzkv6Hmga/vvIzor7jlpoLorqLljZXjgIHljaHliLjmlbDph49cbiAgICAgKi9cbiAgICBhcHAucm91dGVyKCdteXBhZ2UtaW5mbycsIGFzeW5jKCBjdHgsIG5leHQgKSA9PiB7XG4gICAgICAgIHRyeSB7XG5cbiAgICAgICAgICAgIGxldCBjb3Vwb25zID0gMDtcbiAgICAgICAgICAgIGNvbnN0IG9wZW5pZCA9IGV2ZW50LnVzZXJJbmZvLm9wZW5JZDtcbiAgICAgICAgICAgIGNvbnN0IHRyaXBzJCA9IGF3YWl0IGNsb3VkLmNhbGxGdW5jdGlvbih7XG4gICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgICAkdXJsOiAnZW50ZXInXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBuYW1lOiAndHJpcCdcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgY29uc3QgdHJpcHMgPSB0cmlwcyQucmVzdWx0LmRhdGE7XG4gICAgICAgICAgICBjb25zdCB0cmlwID0gdHJpcHNbIDAgXTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgLy8g6K6i5Y2V5pWwXG4gICAgICAgICAgICBjb25zdCBvcmRlcnMkID0gYXdhaXQgZGIuY29sbGVjdGlvbignb3JkZXInKVxuICAgICAgICAgICAgICAgIC53aGVyZSh7XG4gICAgICAgICAgICAgICAgICAgIG9wZW5pZCxcbiAgICAgICAgICAgICAgICAgICAgYmFzZV9zdGF0dXM6IF8ubmVxKCc1JylcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIC5jb3VudCggKTtcblxuXG4gICAgICAgICAgICAvLyDljaHliLjmlbAoIOi/h+a7pOaOieWPquWJqeW9k+WJjeeahHRyaXDljaHliLggKVxuICAgICAgICAgICAgbGV0IGNvdXBvbnMkOiBhbnkgPSB7XG4gICAgICAgICAgICAgICAgdG90YWw6IDBcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGlmICggISF0cmlwICkge1xuICAgICAgICAgICAgICAgIGNvdXBvbnMkID0gYXdhaXQgZGIuY29sbGVjdGlvbignY291cG9uJylcbiAgICAgICAgICAgICAgICAgICAgLndoZXJlKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG9wZW5pZCxcbiAgICAgICAgICAgICAgICAgICAgICAgIHRpZDogdHJpcC5faWQsXG4gICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiBfLm5lcSgndF9kYWlqaW4nKSxcbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgLmNvdW50KCApO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBjb25zdCBjb3Vwb25zMiQgPSBhd2FpdCBkYi5jb2xsZWN0aW9uKCdjb3Vwb24nKVxuICAgICAgICAgICAgICAgIC53aGVyZSh7XG4gICAgICAgICAgICAgICAgICAgIG9wZW5pZCxcbiAgICAgICAgICAgICAgICAgICAgaXNVc2VkOiBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogJ3RfZGFpamluJyxcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIC5jb3VudCggKTtcblxuICAgICAgICAgICAgY291cG9ucyA9IGNvdXBvbnMkLnRvdGFsICsgY291cG9uczIkLnRvdGFsO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICByZXR1cm4gY3R4LmJvZHkgPSB7XG4gICAgICAgICAgICAgICAgc3RhdHVzOiAyMDAsXG4gICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgICBjb3Vwb25zLFxuICAgICAgICAgICAgICAgICAgICBvcmRlcnM6IG9yZGVycyQudG90YWxcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfSBjYXRjaCAoIGUgKSB7IHJldHVybiBjdHguYm9keSA9IHsgc3RhdHVzOiA1MDAgfTt9XG4gICAgfSk7XG5cbiAgICAvKiogXG4gICAgICogQGRlc2NyaXB0aW9uXG4gICAgICog6KGM56iL5LiL77yM5Y+C5Yqg5LqG6LSt5Lmw55qE5a6i5oi377yI6K6i5Y2V77yJXG4gICAgICogeyBcbiAgICAgKiAgICB0aWRcbiAgICAgKiB9XG4gICAgICovXG4gICAgYXBwLnJvdXRlcignY3VzdG9tZXItaW4tdHJpcCcsIGFzeW5jKCBjdHgsIG5leHQgKSA9PiB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBjb25zdCBsaW1pdCA9IDEwMDtcbiAgICAgICAgICAgIGNvbnN0IGFsbE9yZGVyVXNlcnMkID0gYXdhaXQgZGIuY29sbGVjdGlvbignb3JkZXInKVxuICAgICAgICAgICAgICAgIC53aGVyZSh7XG4gICAgICAgICAgICAgICAgICAgIHRpZDogZXZlbnQuZGF0YS50aWRcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIC5vcmRlckJ5KCdjcmVhdGVUaW1lJywgJ2Rlc2MnKVxuICAgICAgICAgICAgICAgIC5saW1pdCggbGltaXQgKVxuICAgICAgICAgICAgICAgIC5maWVsZCh7XG4gICAgICAgICAgICAgICAgICAgIG9wZW5pZDogdHJ1ZVxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLmdldCggKTtcblxuICAgICAgICAgICAgY29uc3Qgb3BlbmlkcyA9IEFycmF5LmZyb20oIG5ldyBTZXQoIGFsbE9yZGVyVXNlcnMkLmRhdGEubWFwKCB4ID0+IHgub3BlbmlkICkpKTtcblxuICAgICAgICAgICAgY29uc3QgYXZhdGF0cyQgPSBhd2FpdCBQcm9taXNlLmFsbCggb3Blbmlkcy5tYXAoIG9pZCA9PiB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGRiLmNvbGxlY3Rpb24oJ3VzZXInKVxuICAgICAgICAgICAgICAgICAgICAud2hlcmUoe1xuICAgICAgICAgICAgICAgICAgICAgICAgb3BlbmlkOiBvaWRcbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgLmZpZWxkKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGF2YXRhclVybDogdHJ1ZVxuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAuZ2V0KCApO1xuICAgICAgICAgICAgfSkpXG4gICAgICAgICAgICBcbiAgICAgICAgICAgIHJldHVybiBjdHguYm9keSA9IHtcbiAgICAgICAgICAgICAgICBzdGF0dXM6IDIwMCxcbiAgICAgICAgICAgICAgICBkYXRhOiBhdmF0YXRzJC5tYXAoIHggPT4geC5kYXRhWyAwIF0uYXZhdGFyVXJsIClcbiAgICAgICAgICAgIH1cblxuICAgICAgICB9IGNhdGNoICggZSApIHtcbiAgICAgICAgICAgIHJldHVybiBjdHguYm9keSA9IHsgc3RhdHVzOiA1MDAgfTtcbiAgICAgICAgfVxuICAgIH0pXG5cbiAgICAvKipcbiAgICAgKiDmtojmga/mjqjpgIEgLSDlgqzmrL5cbiAgICAgKiB7XG4gICAgICogICAgIHRvdXNlciAoIG9wZW5pZCApXG4gICAgICogICAgIGZvcm1faWQg77yIIOaIluiAheaYryBwcmVwYXlfaWQg77yJXG4gICAgICogICAgIHBhZ2U/OiBzdHJpbmdcbiAgICAgKiAgICAgZGF0YTogeyBcbiAgICAgKiAgICAgICAgIFxuICAgICAqICAgICB9XG4gICAgICogfVxuICAgICAqL1xuICAgIGFwcC5yb3V0ZXIoJ25vdGlmaWNhdGlvbi1nZXRtb25leScsIGFzeW5jKCBjdHgsIG5leHQgKSA9PiB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGNvbnN0IHBhZ2UgPSBldmVudC5kYXRhLnBhZ2UgfHwgJ3BhZ2VzL29yZGVyLWxpc3QvaW5kZXgnO1xuICAgICAgICAgICAgY29uc3QgeyB0b3VzZXIsIGZvcm1faWQsIGRhdGEsIHByZXBheV9pZCB9ID0gZXZlbnQuZGF0YTtcblxuICAgICAgICAgICAgLy8g6I635Y+WdG9rZW5cbiAgICAgICAgICAgIGNvbnN0IHJlc3VsdCA9IGF3YWl0IChheGlvcyBhcyBhbnkpKHtcbiAgICAgICAgICAgICAgICBtZXRob2Q6ICdnZXQnLFxuICAgICAgICAgICAgICAgIHVybDogYGh0dHBzOi8vYXBpLndlaXhpbi5xcS5jb20vY2dpLWJpbi90b2tlbj9ncmFudF90eXBlPWNsaWVudF9jcmVkZW50aWFsJmFwcGlkPSR7Q09ORklHLmFwcC5pZH0mc2VjcmV0PSR7Q09ORklHLmFwcC5zZWNyZWN0fWBcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICBjb25zdCB7IGFjY2Vzc190b2tlbiwgZXJyY29kZSB9ID0gcmVzdWx0LmRhdGE7XG5cbiAgICAgICAgICAgIGlmICggZXJyY29kZSApIHtcbiAgICAgICAgICAgICAgICB0aHJvdyAn55Sf5oiQYWNjZXNzX3Rva2Vu6ZSZ6K+vJ1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBjb25zdCByZXFEYXRhID0geyB9O1xuICAgICAgICAgICAgY29uc3QgcmVxRGF0YSQgPSB7XG4gICAgICAgICAgICAgICAgcGFnZSxcbiAgICAgICAgICAgICAgICB0b3VzZXIsXG4gICAgICAgICAgICAgICAgcHJlcGF5X2lkLFxuICAgICAgICAgICAgICAgIGZvcm1faWQsXG4gICAgICAgICAgICAgICAgdGVtcGxhdGVfaWQ6IENPTkZJRy5ub3RpZmljYXRpb25fdGVtcGxhdGUuZ2V0TW9uZXkzLFxuICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgLy8g6LSt5Lmw5pe26Ze0XG4gICAgICAgICAgICAgICAgICAgIFwia2V5d29yZDFcIjoge1xuICAgICAgICAgICAgICAgICAgICAgICAgXCJ2YWx1ZVwiOiBkYXRhLnRpdGxlXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIC8vIOiuouWNleaAu+S7t1xuICAgICAgICAgICAgICAgICAgICBcImtleXdvcmQyXCI6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIFwidmFsdWVcIjogZGF0YS50aW1lXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICBPYmplY3Qua2V5cyggcmVxRGF0YSQgKS5tYXAoIGtleSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKCAhIXJlcURhdGEkWyBrZXkgXSkge1xuICAgICAgICAgICAgICAgICAgICByZXFEYXRhWyBrZXkgXSA9IHJlcURhdGEkWyBrZXkgXTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgLy8g5Y+R6YCB5o6o6YCBXG4gICAgICAgICAgICBjb25zdCBzZW5kID0gYXdhaXQgKGF4aW9zIGFzIGFueSkoe1xuICAgICAgICAgICAgICAgIGRhdGE6IHJlcURhdGEsXG4gICAgICAgICAgICAgICAgbWV0aG9kOiAncG9zdCcsXG4gICAgICAgICAgICAgICAgdXJsOiBgaHR0cHM6Ly9hcGkud2VpeGluLnFxLmNvbS9jZ2ktYmluL21lc3NhZ2Uvd3hvcGVuL3RlbXBsYXRlL3NlbmQ/YWNjZXNzX3Rva2VuPSR7YWNjZXNzX3Rva2VufWBcbiAgICAgICAgICAgIH0pO1xuICAgICAgICBcbiAgICAgICAgICAgIHJldHVybiBjdHguYm9keSA9IHtcbiAgICAgICAgICAgICAgICBkYXRhOiBzZW5kLmRhdGEsXG4gICAgICAgICAgICAgICAgc3RhdHVzOiAyMDBcbiAgICAgICAgICAgIH1cblxuICAgICAgICB9IGNhdGNoICggZSApIHtcbiAgICAgICAgICAgIHJldHVybiBjdHguYm9keSA9IHsgbWVzc2FnZTogZSwgc3RhdHVzOiA1MDAgfVxuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICAvKipcbiAgICAgKiBAZGVzY3JpcHRpb25cbiAgICAgKiDpgJrov4fliqDop6Plr4blrqLmnI3nu5nnmoTlr4bnoIHvvIzmnaXlop7liqDmnYPpmZDjgIHliJ3lp4vljJbmlbDmja7lupNcbiAgICAgKi9cbiAgICBhcHAucm91dGVyKCdhZGQtYXV0aC1ieS1wc3cnLCBhc3luYyggY3R4LCBuZXh0ICkgPT4ge1xuICAgICAgICB0cnkge1xuXG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIGF3YWl0IChkYiBhcyBhbnkpLmNyZWF0ZUNvbGxlY3Rpb24oJ21hbmFnZXItbWVtYmVyJyk7XG4gICAgICAgICAgICAgICAgYXdhaXQgKGRiIGFzIGFueSkuY3JlYXRlQ29sbGVjdGlvbignYXV0aHBzdycpO1xuICAgICAgICAgICAgfSBjYXRjaCAoIGUgKSB7IH1cblxuICAgICAgICAgICAgbGV0IHJlc3VsdCA9ICcnO1xuICAgICAgICAgICAgY29uc3QgeyBzYWx0IH0gPSBDT05GSUcuYXV0aDtcbiAgICAgICAgICAgIGNvbnN0IG9wZW5pZCA9IGV2ZW50LnVzZXJJbmZvLm9wZW5JZDtcbiAgICAgICAgICAgIGNvbnN0IHsgcHN3LCBjb250ZW50IH0gPSBldmVudC5kYXRhO1xuXG4gICAgICAgICAgICBjb25zdCBnZXRFcnIgPSBtZXNzYWdlID0+ICh7XG4gICAgICAgICAgICAgICAgbWVzc2FnZSxcbiAgICAgICAgICAgICAgICBzdGF0dXM6IDUwMCxcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIGNvbnN0IGRlY2lwaGVyID0gY3J5cHRvLmNyZWF0ZURlY2lwaGVyKCdhZXMxOTInLCBzYWx0ICk7XG4gICAgICAgICAgICAgICAgY29uc3QgZGVjcnlwdGVkID0gZGVjaXBoZXIudXBkYXRlKCBwc3csICdoZXgnLCAndXRmOCcgKTtcbiAgICAgICAgICAgICAgICByZXN1bHQgPSBkZWNyeXB0ZWQgKyBkZWNpcGhlci5maW5hbCgndXRmOCcpO1xuICAgICAgICAgICAgfSBjYXRjaCAoIGUgKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGN0eC5ib2R5ID0gZ2V0RXJyKCflr4bpkqXplJnor6/vvIzor7fmoLjlr7knKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIFxuICAgICAgICAgICAgY29uc3QgWyBjX3RpbWVzdGFtcCwgY19hcHBpZCwgY19jb250ZW50LCBjX21heCBdID0gcmVzdWx0LnNwbGl0KCctJyk7XG5cbiAgICAgICAgICAgIGlmICggZ2V0Tm93KCB0cnVlICkgLSBOdW1iZXIoIGNfdGltZXN0YW1wICkgPiAzMCAqIDYwICogMTAwMCApIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gY3R4LmJvZHkgPSBnZXRFcnIoJ+WvhumSpeW3sui/h+acn++8jOivt+iBlOezu+WuouacjScpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoIGNfYXBwaWQgIT09IENPTkZJRy5hcHAuaWQgKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGN0eC5ib2R5ID0gZ2V0RXJyKCflr4bpkqXkuI7lsI/nqIvluo/kuI3lhbPogZQnKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKCBjX2NvbnRlbnQucmVwbGFjZSgvXFxzKy9nLCAnJykgIT09IGNvbnRlbnQucmVwbGFjZSgvXFxzKy9nLCAnJykpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gY3R4LmJvZHkgPSBnZXRFcnIoJ+aPkOekuuivjemUmeivr++8jOivt+iBlOezu+WuouacjScpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIGF1dGhwc3cg6KGoXG4gICAgICAgICAgICAgKiBcbiAgICAgICAgICAgICAqIHtcbiAgICAgICAgICAgICAqICAgIGFwcElkLFxuICAgICAgICAgICAgICogICAgdGltZXN0YW1wLFxuICAgICAgICAgICAgICogICAgY291bnRcbiAgICAgICAgICAgICAqIH1cbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgY29uc3QgY2hlY2skID0gYXdhaXQgZGIuY29sbGVjdGlvbignYXV0aHBzdycpIFxuICAgICAgICAgICAgICAgIC53aGVyZSh7XG4gICAgICAgICAgICAgICAgICAgIGFwcElkOiBjX2FwcGlkLFxuICAgICAgICAgICAgICAgICAgICB0aW1lc3RhbXA6IGNfdGltZXN0YW1wXG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAuZ2V0KCApO1xuICAgICAgICAgICAgY29uc3QgdGFyZ2V0ID0gY2hlY2skLmRhdGFbIDAgXTtcblxuICAgICAgICAgICAgLy8g5a+G6ZKl5bey6KKr5L2/55SoXG4gICAgICAgICAgICBpZiAoICEhdGFyZ2V0ICkge1xuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIC8vIOasoeaVsOS4jeiDveWkmuS6jjJcbiAgICAgICAgICAgICAgICBpZiAoIHRhcmdldC5jb3VudCA+PSAyICkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gY3R4LmJvZHkgPSBnZXRFcnIoJ+WvhumSpeW3suiiq+S9v+eUqO+8jOivt+iBlOezu+WuouacjScpO1xuXG4gICAgICAgICAgICAgICAgLy8g5pu05paw5a+G6ZKl5L+h5oGvXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgYXdhaXQgZGIuY29sbGVjdGlvbignYXV0aHBzdycpXG4gICAgICAgICAgICAgICAgICAgICAgICAuZG9jKCBTdHJpbmcoIHRhcmdldC5faWQgKSlcbiAgICAgICAgICAgICAgICAgICAgICAgIC51cGRhdGUoe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY291bnQ6IF8uaW5jKCAxIClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyDliJvlu7rlr4bpkqXkv6Hmga9cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgYXdhaXQgZGIuY29sbGVjdGlvbignYXV0aHBzdycpXG4gICAgICAgICAgICAgICAgICAgIC5hZGQoe1xuICAgICAgICAgICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvdW50OiAxLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFwcElkOiBjX2FwcGlkLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRpbWVzdGFtcDogY190aW1lc3RhbXBcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8g5oqK5b2T5YmN5Lq677yM5Yqg5YWl5Yiw566h55CG5ZGYXG4gICAgICAgICAgICBjb25zdCBjaGVja01hbmFnZXIkID0gYXdhaXQgZGIuY29sbGVjdGlvbignbWFuYWdlci1tZW1iZXInKVxuICAgICAgICAgICAgICAgIC53aGVyZSh7XG4gICAgICAgICAgICAgICAgICAgIG9wZW5pZFxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLmdldCggKTtcbiAgICAgICAgICAgIGNvbnN0IHRhcmdldE1hbmFnZXIgPSBjaGVja01hbmFnZXIkLmRhdGFbIDAgXTtcblxuICAgICAgICAgICAgaWYgKCAhdGFyZ2V0TWFuYWdlciApIHtcbiAgICAgICAgICAgICAgICBhd2FpdCBkYi5jb2xsZWN0aW9uKCdtYW5hZ2VyLW1lbWJlcicpXG4gICAgICAgICAgICAgICAgICAgIC5hZGQoe1xuICAgICAgICAgICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9wZW5pZCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb250ZW50OiBjX2NvbnRlbnQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY3JlYXRlVGltZTogZ2V0Tm93KCB0cnVlIClcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8g5Yid5aeL5YyW5ZCE5Liq6KGoXG4gICAgICAgICAgICBhd2FpdCBpbml0REIoICk7XG5cbiAgICAgICAgICAgIHJldHVybiBjdHguYm9keSA9IHtcbiAgICAgICAgICAgICAgICBzdGF0dXM6IDIwMFxuICAgICAgICAgICAgfVxuXG4gICAgICAgIH0gY2F0Y2ggKCBlICkge1xuICAgICAgICAgICAgcmV0dXJuIGN0eC5ib2R5ID0ge1xuICAgICAgICAgICAgICAgIHN0YXR1czogNTAwLFxuICAgICAgICAgICAgICAgIG1lc3NhZ2U6ICflr4bpkqXmo4Dmn6Xlj5HnlJ/plJnor68nXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgIC8qKlxuICAgICAqIEBkZXNjcmlwdGlvblxuICAgICAqIOafpeivouW6lOeUqOmFjee9rlxuICAgICAqL1xuICAgIGFwcC5yb3V0ZXIoJ2NoZWNrLWFwcC1jb25maWcnLCBhc3luYyggY3R4LCBuZXh0ICkgPT4ge1xuICAgICAgICB0cnkge1xuXG4gICAgICAgICAgICBsZXQgY29uZmlnT2JqID0geyB9O1xuICAgICAgICAgICAgY29uc3QgY29uZmlnJCA9IGF3YWl0IGRiLmNvbGxlY3Rpb24oJ2FwcC1jb25maWcnKVxuICAgICAgICAgICAgICAgIC53aGVyZSh7IH0pXG4gICAgICAgICAgICAgICAgLmdldCggKTtcblxuICAgICAgICAgICAgY29uc3QgbWV0YSA9IGNvbmZpZyQuZGF0YS5tYXAoIGNvbmYgPT4ge1xuICAgICAgICAgICAgICAgIGNvbmZpZ09iaiA9IE9iamVjdC5hc3NpZ24oeyB9LCBjb25maWdPYmosIHtcbiAgICAgICAgICAgICAgICAgICAgWyBjb25mLnR5cGUgXTogY29uZi52YWx1ZVxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgcmV0dXJuIGN0eC5ib2R5ID0ge1xuICAgICAgICAgICAgICAgIGRhdGE6IGNvbmZpZ09iaixcbiAgICAgICAgICAgICAgICBzdGF0dXM6IDIwMFxuICAgICAgICAgICAgfVxuXG4gICAgICAgIH0gY2F0Y2ggKCBlICkge1xuICAgICAgICAgICAgcmV0dXJuIGN0eC5ib2R5ID0ge1xuICAgICAgICAgICAgICAgIHN0YXR1czogNTAwXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgIC8qKlxuICAgICAqIEBkZXNjcmlwdGlvblxuICAgICAqIOabtOaWsOW6lOeUqOmFjee9rlxuICAgICAqIC0tLS0tLS0tLS0tLS0tXG4gICAgICogY29uZmlnczoge1xuICAgICAqICAgIFsga2V5OiBzdHJpbmcgXTogYW55IFxuICAgICAqIH1cbiAgICAgKi9cbiAgICBhcHAucm91dGVyKCd1cGRhdGUtYXBwLWNvbmZpZycsIGFzeW5jKCBjdHgsIG5leHQgKSA9PiB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBjb25zdCB7IGNvbmZpZ3MgfSA9IGV2ZW50LmRhdGE7XG5cbiAgICAgICAgICAgIGF3YWl0IFByb21pc2UuYWxsKFxuICAgICAgICAgICAgICAgIE9iamVjdC5rZXlzKCBjb25maWdzIClcbiAgICAgICAgICAgICAgICAgICAgLm1hcCggYXN5bmMgY29uZmlnS2V5ID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHRhcmdldCQgPSBhd2FpdCBkYi5jb2xsZWN0aW9uKCdhcHAtY29uZmlnJylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAud2hlcmUoe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiBjb25maWdLZXlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5nZXQoIClcblxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCAhdGFyZ2V0JC5kYXRhWyAwIF0pIHsgcmV0dXJuOyB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGF3YWl0IGRiLmNvbGxlY3Rpb24oJ2FwcC1jb25maWcnKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5kb2MoIFN0cmluZyggdGFyZ2V0JC5kYXRhWyAwIF0uX2lkICkpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLnVwZGF0ZSh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlOiBjb25maWdzWyBjb25maWdLZXkgXVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICk7XG5cbiAgICAgICAgICAgIHJldHVybiBjdHguYm9keSA9IHtcbiAgICAgICAgICAgICAgICBzdGF0dXM6IDIwMFxuICAgICAgICAgICAgfVxuICAgICAgICB9IGNhdGNoICggZSApIHtcbiAgICAgICAgICAgIHJldHVybiBjdHguYm9keSA9IHtcbiAgICAgICAgICAgICAgICBzdGF0dXM6IDUwMFxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSlcblxuICAgIC8qKiBcbiAgICAgKiBAZGVzY3JpcHRpb25cbiAgICAgKiDnlJ/miJDkuoznu7TnoIFcbiAgICAgKiB7XG4gICAgICogICAgIHBhZ2VcbiAgICAgKiAgICAgc2NlbmVcbiAgICAgKiB9XG4gICAgICovXG4gICAgYXBwLnJvdXRlcignY3JlYXRlLXFyY29kZScsIGFzeW5jKCBjdHgsIG5leHQgKSA9PiB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBjb25zdCB7IHBhZ2UsIHNjZW5lIH0gPSBldmVudC5kYXRhO1xuICAgICAgICAgICAgY29uc3QgcmVzdWx0ID0gYXdhaXQgY2xvdWQub3BlbmFwaS53eGFjb2RlLmdldFVubGltaXRlZCh7XG4gICAgICAgICAgICAgICAgcGFnZSxcbiAgICAgICAgICAgICAgICBzY2VuZTogc2NlbmUgfHwgJydcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBpZiAoIHJlc3VsdC5lcnJDb2RlICE9PSAwICkge1xuICAgICAgICAgICAgICAgIHRocm93IHJlc3VsdC5lcnJNc2dcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIGN0eC5ib2R5ID0ge1xuICAgICAgICAgICAgICAgIHN0YXR1czogMjAwLFxuICAgICAgICAgICAgICAgIGRhdGE6IHJlc3VsdC5idWZmZXJcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBjYXRjaCAoIGUgKSB7XG4gICAgICAgICAgICByZXR1cm4gY3R4LmJvZHkgPSB7XG4gICAgICAgICAgICAgICAgc3RhdHVzOiA1MDAsXG4gICAgICAgICAgICAgICAgbWVzc2FnZTogdHlwZW9mIGUgPT09ICdzdHJpbmcnID8gZSA6IEpTT04uc3RyaW5naWZ5KCBlIClcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgLyoqIFxuICAgICAqIEBkZXNjcmlwdGlvblxuICAgICAqIOWIm+W7uuS4gOS4qmZvcm0taWRcbiAgICAgKiB7XG4gICAgICogICAgIGZvcm1pZFxuICAgICAqIH1cbiAgICAgKiBmb3JtLWlkczoge1xuICAgICAqICAgICAgb3BlbmlkLFxuICAgICAqICAgICAgZm9ybWlkLFxuICAgICAqICAgICAgY3JlYXRlVGltZSxcbiAgICAgKiAgICAgIHR5cGU6ICdtYW5hZ2VyJyB8ICdub3JtYWwnXG4gICAgICogfVxuICAgICAqL1xuICAgIGFwcC5yb3V0ZXIoJ2NyZWF0ZS1mb3JtaWQnLCBhc3luYyggY3R4LCBuZXh0ICkgPT4ge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgY29uc3Qgb3BlbmlkID0gZXZlbnQudXNlckluZm8ub3BlbklkO1xuICAgICAgICAgICAgY29uc3QgeyBmb3JtaWQgfSA9IGV2ZW50LmRhdGE7IFxuICAgICAgICAgICAgY29uc3QgZmluZCQgPSBhd2FpdCBkYi5jb2xsZWN0aW9uKCdtYW5hZ2VyLW1lbWJlcicpXG4gICAgICAgICAgICAgICAgLndoZXJlKHtcbiAgICAgICAgICAgICAgICAgICAgb3BlbmlkXG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAuY291bnQoICk7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGNvbnN0IGNyZWF0ZSQgPSBhd2FpdCBkYi5jb2xsZWN0aW9uKCdmb3JtLWlkcycpXG4gICAgICAgICAgICAgICAgLmFkZCh7XG4gICAgICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG9wZW5pZCxcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvcm1pZCxcbiAgICAgICAgICAgICAgICAgICAgICAgIGNyZWF0ZVRpbWU6IGdldE5vdyggdHJ1ZSApLFxuICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogZmluZCQudG90YWwgPiAwID8gJ21hbmFnZXInIDogJ25vcm1hbCdcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgY3R4LmJvZHkgPSB7XG4gICAgICAgICAgICAgICAgc3RhdHVzOiAyMDBcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBjYXRjaCAoIGUgKSB7XG4gICAgICAgICAgICBjdHguYm9keSA9IHtcbiAgICAgICAgICAgICAgICBzdGF0dXM6IDIwMFxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICAvKipcbiAgICAgKiBAZGVzY3JpcHRpb25cbiAgICAgKiDmqKHmnb/mjqjpgIHmnI3liqHvvIzmtojotLlmb3JtLWlkc1xuICAgICAqIHtcbiAgICAgKiAgICAgIG9wZW5pZFxuICAgICAqICAgICAgdHlwZTogJ2J1eVBpbicgfCAnYnV5JyB8ICdnZXRNb25leScgfCAnd2FpdFBpbicgfCAnbmV3T3JkZXInXG4gICAgICogICAgICB0ZXh0czogWyAneHgnLCAneXknIF1cbiAgICAgKiAgICAgID9wYWdlXG4gICAgICogICAgICA/cHJlcGF5X2lkXG4gICAgICogfVxuICAgICAqL1xuICAgIGFwcC5yb3V0ZXIoJ3B1c2gtdGVtcGxhdGUnLCBhc3luYyggY3R4LCBuZXh0ICkgPT4ge1xuICAgICAgICB0cnkge1xuXG4gICAgICAgICAgICBsZXQgZm9ybWlkX2lkOiBhbnkgPSAnJztcbiAgICAgICAgICAgIGxldCBmb3JtaWQgPSBldmVudC5kYXRhLnByZXBheV9pZDtcbiAgICAgICAgICAgIGNvbnN0IHsgdHlwZSwgdGV4dHMgfSA9IGV2ZW50LmRhdGE7XG4gICAgICAgICAgICBjb25zdCBvcGVuaWQgPSBldmVudC5kYXRhLm9wZW5JZCB8fCBldmVudC5kYXRhLm9wZW5pZCB8fCBldmVudC51c2VySW5mby5vcGVuSWQ7XG4gICAgICAgICAgICBjb25zdCBwYWdlID0gZXZlbnQuZGF0YS5wYWdlIHx8ICdwYWdlcy9vcmRlci1saXN0L2luZGV4JztcblxuICAgICAgICAgICAgLy8g5aaC5p6c5rKh5pyJcHJlcGF5X2lkLCDlsLHljrvmi7/or6XnlKjmiLfnmoRmb3JtX2lkXG4gICAgICAgICAgICBpZiAoICFmb3JtaWQgKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgZmluZCQgPSBhd2FpdCBkYi5jb2xsZWN0aW9uKCdmb3JtLWlkcycpXG4gICAgICAgICAgICAgICAgICAgIC53aGVyZSh7XG4gICAgICAgICAgICAgICAgICAgICAgICBvcGVuaWRcbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgLmxpbWl0KCAxIClcbiAgICAgICAgICAgICAgICAgICAgLmdldCggKTtcblxuICAgICAgICAgICAgICAgIGlmICggIWZpbmQkLmRhdGFbIDAgXSkge1xuICAgICAgICAgICAgICAgICAgICB0aHJvdyBg6K+l55So5oi3JHtvcGVuaWR95rKh5pyJZm9ybWlk44CBcHJlcGF5X2lkYDtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBmb3JtaWQgPSBmaW5kJC5kYXRhWyAwIF0uZm9ybWlkO1xuICAgICAgICAgICAgICAgIGZvcm1pZF9pZCA9IGZpbmQkLmRhdGFbIDAgXS5faWQ7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGxldCB0ZXh0RGF0YSA9IHsgfTtcbiAgICAgICAgICAgIHRleHRzLm1hcCgoIHRleHQsIGluZGV4ICkgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IGtleVRleHQgPSBga2V5d29yZCR7aW5kZXggKyAxfWA7XG4gICAgICAgICAgICAgICAgdGV4dERhdGEgPSBPYmplY3QuYXNzaWduKHsgfSwgdGV4dERhdGEsIHtcbiAgICAgICAgICAgICAgICAgICAgWyBrZXlUZXh0IF0gOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZTogdGV4dFxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBjb25zdCB3ZWFwcFRlbXBsYXRlTXNnID0ge1xuICAgICAgICAgICAgICAgIHBhZ2UsXG4gICAgICAgICAgICAgICAgZGF0YTogdGV4dERhdGEsXG4gICAgICAgICAgICAgICAgZm9ybUlkOiBmb3JtaWQsXG4gICAgICAgICAgICAgICAgdGVtcGxhdGVJZDogQ09ORklHLnB1c2hfdGVtcGxhdGVbIHR5cGUgXS52YWx1ZVxuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgY29uc29sZS5sb2coJz09PeaOqOmAgScsIHdlYXBwVGVtcGxhdGVNc2cgKTtcblxuICAgICAgICAgICAgY29uc3Qgc2VuZCQgPSBhd2FpdCBjbG91ZC5vcGVuYXBpLnVuaWZvcm1NZXNzYWdlLnNlbmQoe1xuICAgICAgICAgICAgICAgIHRvdXNlcjogb3BlbmlkLFxuICAgICAgICAgICAgICAgIHdlYXBwVGVtcGxhdGVNc2dcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBpZiAoIFN0cmluZyggc2VuZCQuZXJyQ29kZSApICE9PSAnMCcgKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgc2VuZCQuZXJyTXNnO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyDliKDpmaTor6XmnaFmb3JtLWlkXG4gICAgICAgICAgICBpZiAoICEhZm9ybWlkX2lkICkge1xuICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgIGF3YWl0IGRiLmNvbGxlY3Rpb24oJ2Zvcm0taWRzJylcbiAgICAgICAgICAgICAgICAgICAgICAgIC5kb2MoIGZvcm1pZF9pZCApXG4gICAgICAgICAgICAgICAgICAgICAgICAucmVtb3ZlKCApO1xuICAgICAgICAgICAgICAgIH0gY2F0Y2ggKCBlICkgeyB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiBjdHguYm9keSA9IHtcbiAgICAgICAgICAgICAgICBzdGF0dXM6IDIwMFxuICAgICAgICAgICAgfTtcblxuICAgICAgICB9IGNhdGNoICggZSApIHtcbiAgICAgICAgICAgIHJldHVybiBjdHguYm9keSA9IHtcbiAgICAgICAgICAgICAgICBzdGF0dXM6IDUwMCxcbiAgICAgICAgICAgICAgICBtZXNzYWdlOiB0eXBlb2YgZSA9PT0gJ3N0cmluZycgPyBlIDogSlNPTi5zdHJpbmdpZnkoIGUgKVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICAvKiogXG4gICAgICogQGRlc2NyaXB0aW9uXG4gICAgICog5ZCM5LiK77yM5LqR5byA5Y+R55SoXG4gICAgICovXG4gICAgYXBwLnJvdXRlcigncHVzaC10ZW1wbGF0ZS1jbG91ZCcsIGFzeW5jKCBjdHgsIG5leHQgKSA9PiB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICAvLyDojrflj5Z0b2tlblxuICAgICAgICAgICAgY29uc3QgcmVzdWx0ID0gYXdhaXQgKGF4aW9zIGFzIGFueSkoe1xuICAgICAgICAgICAgICAgIG1ldGhvZDogJ2dldCcsXG4gICAgICAgICAgICAgICAgdXJsOiBgaHR0cHM6Ly9hcGkud2VpeGluLnFxLmNvbS9jZ2ktYmluL3Rva2VuP2dyYW50X3R5cGU9Y2xpZW50X2NyZWRlbnRpYWwmYXBwaWQ9JHtDT05GSUcuYXBwLmlkfSZzZWNyZXQ9JHtDT05GSUcuYXBwLnNlY3JlY3R9YFxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGNvbnN0IHsgYWNjZXNzX3Rva2VuLCBlcnJjb2RlIH0gPSByZXN1bHQuZGF0YTtcblxuICAgICAgICAgICAgaWYgKCBlcnJjb2RlICkge1xuICAgICAgICAgICAgICAgIHRocm93ICfnlJ/miJBhY2Nlc3NfdG9rZW7plJnor68nXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGxldCBmb3JtaWRfaWQ6IGFueSA9ICcnO1xuICAgICAgICAgICAgbGV0IGZvcm1pZCA9IGV2ZW50LmRhdGEucHJlcGF5X2lkO1xuICAgICAgICAgICAgY29uc3QgeyB0eXBlLCB0ZXh0cyB9ID0gZXZlbnQuZGF0YTtcbiAgICAgICAgICAgIGNvbnN0IG9wZW5pZCA9IGV2ZW50LmRhdGEub3BlbklkIHx8IGV2ZW50LmRhdGEub3BlbmlkIHx8IGV2ZW50LnVzZXJJbmZvLm9wZW5JZDtcbiAgICAgICAgICAgIGNvbnN0IHBhZ2UgPSBldmVudC5kYXRhLnBhZ2UgfHwgJ3BhZ2VzL29yZGVyLWxpc3QvaW5kZXgnO1xuXG4gICAgICAgICAgICAvLyDlpoLmnpzmsqHmnIlwcmVwYXlfaWQsIOWwseWOu+aLv+ivpeeUqOaIt+eahGZvcm1faWRcbiAgICAgICAgICAgIC8vIOWAkuWPmeaLv2Zvcm1pZFxuICAgICAgICAgICAgaWYgKCAhZm9ybWlkICkge1xuICAgICAgICAgICAgICAgIGNvbnN0IGZpbmQkID0gYXdhaXQgZGIuY29sbGVjdGlvbignZm9ybS1pZHMnKVxuICAgICAgICAgICAgICAgICAgICAud2hlcmUoe1xuICAgICAgICAgICAgICAgICAgICAgICAgb3BlbmlkLFxuICAgICAgICAgICAgICAgICAgICAgICAgZm9ybWlkOiBfLm5lcSgndGhlIGZvcm1JZCBpcyBhIG1vY2sgb25lJylcbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgLm9yZGVyQnkoJ2NyZWF0ZVRpbWUnLCAnYXNjJylcbiAgICAgICAgICAgICAgICAgICAgLmxpbWl0KCAxIClcbiAgICAgICAgICAgICAgICAgICAgLmdldCggKTtcblxuICAgICAgICAgICAgICAgIGlmICggIWZpbmQkLmRhdGFbIDAgXSkge1xuICAgICAgICAgICAgICAgICAgICB0aHJvdyBg6K+l55So5oi3JHtvcGVuaWR95rKh5pyJZm9ybWlk44CBcHJlcGF5X2lkYDtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBmb3JtaWQgPSBmaW5kJC5kYXRhWyAwIF0uZm9ybWlkO1xuICAgICAgICAgICAgICAgIGZvcm1pZF9pZCA9IGZpbmQkLmRhdGFbIDAgXS5faWQ7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGxldCB0ZXh0RGF0YSA9IHsgfTtcbiAgICAgICAgICAgIHRleHRzLm1hcCgoIHRleHQsIGluZGV4ICkgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IGtleVRleHQgPSBga2V5d29yZCR7aW5kZXggKyAxfWA7XG4gICAgICAgICAgICAgICAgdGV4dERhdGEgPSBPYmplY3QuYXNzaWduKHsgfSwgdGV4dERhdGEsIHtcbiAgICAgICAgICAgICAgICAgICAgWyBrZXlUZXh0IF0gOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZTogdGV4dFxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBjb25zdCB3ZWFwcF90ZW1wbGF0ZV9tc2cgPSB7XG4gICAgICAgICAgICAgICAgcGFnZSxcbiAgICAgICAgICAgICAgICBkYXRhOiB0ZXh0RGF0YSxcbiAgICAgICAgICAgICAgICBmb3JtX2lkOiBmb3JtaWQsXG4gICAgICAgICAgICAgICAgdGVtcGxhdGVfaWQ6IENPTkZJRy5wdXNoX3RlbXBsYXRlWyB0eXBlIF0udmFsdWVcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCc9PT3mjqjpgIEnLCB3ZWFwcF90ZW1wbGF0ZV9tc2cgKTtcblxuICAgICAgICAgICAgY29uc3QgcmVxRGF0YSA9IHtcbiAgICAgICAgICAgICAgICB0b3VzZXI6IG9wZW5pZCxcbiAgICAgICAgICAgICAgICB3ZWFwcF90ZW1wbGF0ZV9tc2dcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8g5Y+R6YCB5o6o6YCBXG4gICAgICAgICAgICBjb25zdCBzZW5kID0gYXdhaXQgKGF4aW9zIGFzIGFueSkoe1xuICAgICAgICAgICAgICAgIGRhdGE6IHJlcURhdGEsXG4gICAgICAgICAgICAgICAgbWV0aG9kOiAncG9zdCcsXG4gICAgICAgICAgICAgICAgdXJsOiBgaHR0cHM6Ly9hcGkud2VpeGluLnFxLmNvbS9jZ2ktYmluL21lc3NhZ2Uvd3hvcGVuL3RlbXBsYXRlL3VuaWZvcm1fc2VuZD9hY2Nlc3NfdG9rZW49JHthY2Nlc3NfdG9rZW59YFxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIGlmICggU3RyaW5nKCBzZW5kLmRhdGEuZXJyY29kZSApICE9PSAnMCcgKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgc2VuZC5kYXRhLmVycm1zZztcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8g5Yig6Zmk6K+l5p2hZm9ybS1pZFxuICAgICAgICAgICAgaWYgKCAhIWZvcm1pZF9pZCApIHtcbiAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICBhd2FpdCBkYi5jb2xsZWN0aW9uKCdmb3JtLWlkcycpXG4gICAgICAgICAgICAgICAgICAgICAgICAuZG9jKCBmb3JtaWRfaWQgKVxuICAgICAgICAgICAgICAgICAgICAgICAgLnJlbW92ZSggKTtcbiAgICAgICAgICAgICAgICB9IGNhdGNoICggZSApIHsgfVxuICAgICAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgICAgIHJldHVybiBjdHguYm9keSA9IHtcbiAgICAgICAgICAgICAgICBkYXRhOiBzZW5kLmRhdGEsXG4gICAgICAgICAgICAgICAgc3RhdHVzOiAyMDBcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgXG4gICAgICAgIH0gY2F0Y2ggKCBlICkge1xuICAgICAgICAgICAgcmV0dXJuIGN0eC5ib2R5ID0ge1xuICAgICAgICAgICAgICAgIHN0YXR1czogNTAwLFxuICAgICAgICAgICAgICAgIG1lc3NhZ2U6IHR5cGVvZiBlID09PSAnc3RyaW5nJyA/IGUgOiBKU09OLnN0cmluZ2lmeSggZSApXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9KVxuXG4gICAgLyoqIFxuICAgICAqIEBkZXNjcmlwdGlvblxuICAgICAqIOiuoumYheaOqOmAgVxuICAgICAqIHtcbiAgICAgKiAgICAgIG9wZW5pZFxuICAgICAqICAgICAgdHlwZTogJ2J1eVBpbicgfCAnYnV5JyB8ICdnZXRNb25leScgfCAnd2FpdFBpbicgfCAnbmV3T3JkZXInXG4gICAgICogICAgICB0ZXh0czogWyAneHgnLCAneXknIF1cbiAgICAgKiAgICAgID9wYWdlXG4gICAgICogfVxuICAgICAqL1xuICAgIGFwcC5yb3V0ZXIoJ3B1c2gtc3Vic2NyaWJlJywgYXN5bmMgKCBjdHgsIG5leHQgKSA9PiB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBjb25zdCB7IHR5cGUsIHRleHRzIH0gPSBldmVudC5kYXRhO1xuICAgICAgICAgICAgY29uc3Qgb3BlbmlkID0gZXZlbnQuZGF0YS5vcGVuSWQgfHwgZXZlbnQuZGF0YS5vcGVuaWQgfHwgZXZlbnQudXNlckluZm8ub3BlbklkO1xuICAgICAgICAgICAgY29uc3QgcGFnZSA9IGV2ZW50LmRhdGEucGFnZSB8fCAncGFnZXMvdHJpcC1lbnRlci9pbmRleCc7XG4gICAgICAgICAgICBjb25zdCB0ZW1wbGF0ZSA9IENPTkZJRy5zdWJzY3JpYmVfdGVtcGxhdGVzWyB0eXBlIF07XG5cbiAgICAgICAgICAgIGxldCB0ZXh0RGF0YSA9IHsgfTtcbiAgICAgICAgICAgIHRleHRzLm1hcCgoIHRleHQsIGsgKSA9PiB7XG4gICAgICAgICAgICAgICAgdGV4dERhdGEgPSB7XG4gICAgICAgICAgICAgICAgICAgIC4uLnRleHREYXRhLFxuICAgICAgICAgICAgICAgICAgICBbIHRlbXBsYXRlLnRleHRLZXlzWyBrIF1dOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZTogdGV4dFxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBjb25zdCBzdWJzY3JpYmVEYXRhID0ge1xuICAgICAgICAgICAgICAgIHBhZ2UsXG4gICAgICAgICAgICAgICAgZGF0YTogdGV4dERhdGEsXG4gICAgICAgICAgICAgICAgdG91c2VyOiBvcGVuaWQsXG4gICAgICAgICAgICAgICAgdGVtcGxhdGVJZDogdGVtcGxhdGUuaWRcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCc9PT3orqLpmIXmjqjpgIEnLCBzdWJzY3JpYmVEYXRhICk7XG5cbiAgICAgICAgICAgIGNvbnN0IHNlbmQkID0gYXdhaXQgY2xvdWQub3BlbmFwaS5zdWJzY3JpYmVNZXNzYWdlLnNlbmQoIHN1YnNjcmliZURhdGEgKTtcblxuICAgICAgICAgICAgaWYgKCBTdHJpbmcoIHNlbmQkLmVyckNvZGUgKSAhPT0gJzAnICkge1xuICAgICAgICAgICAgICAgIHRocm93IHNlbmQkLmVyck1zZztcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIGN0eC5ib2R5ID0ge1xuICAgICAgICAgICAgICAgIHN0YXR1czogMjAwXG4gICAgICAgICAgICB9XG4gICAgICAgIH0gY2F0Y2ggKCBlICkge1xuICAgICAgICAgICAgY29uc29sZS5sb2coJz8/Pz8nLCBlICk7XG4gICAgICAgICAgICByZXR1cm4gY3R4LmJvZHkgPSB7IFxuICAgICAgICAgICAgICAgIHN0YXR1czogNTAwLFxuICAgICAgICAgICAgICAgIGRhdGE6IGVcbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICB9KVxuXG4gICAgLyoqIFxuICAgICAqIEBkZXNjcmlwdGlvblxuICAgICAqIOiuoumYheaOqOmAge+8jOS6keeJiOacrFxuICAgICAqL1xuICAgIGFwcC5yb3V0ZXIoJ3B1c2gtc3Vic2NyaWJlLWNsb3VkJywgYXN5bmMoIGN0eCwgbmV4dCApID0+IHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGNvbnN0IHsgdHlwZSwgdGV4dHMgfSA9IGV2ZW50LmRhdGE7XG4gICAgICAgICAgICBjb25zdCBvcGVuaWQgPSBldmVudC5kYXRhLm9wZW5JZCB8fCBldmVudC5kYXRhLm9wZW5pZCB8fCBldmVudC51c2VySW5mby5vcGVuSWQ7XG4gICAgICAgICAgICBjb25zdCBwYWdlID0gZXZlbnQuZGF0YS5wYWdlIHx8ICdwYWdlcy90cmlwLWVudGVyL2luZGV4JztcbiAgICAgICAgICAgIGNvbnN0IHRlbXBsYXRlID0gQ09ORklHLnN1YnNjcmliZV90ZW1wbGF0ZXNbIHR5cGUgXTtcblxuICAgICAgICAgICAgbGV0IHRleHREYXRhID0geyB9O1xuICAgICAgICAgICAgdGV4dHMubWFwKCggdGV4dCwgayApID0+IHtcbiAgICAgICAgICAgICAgICB0ZXh0RGF0YSA9IHtcbiAgICAgICAgICAgICAgICAgICAgLi4udGV4dERhdGEsXG4gICAgICAgICAgICAgICAgICAgIFsgdGVtcGxhdGUudGV4dEtleXNbIGsgXV06IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlOiB0ZXh0XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIGNvbnN0IHN1YnNjcmliZURhdGEgPSB7XG4gICAgICAgICAgICAgICAgcGFnZSxcbiAgICAgICAgICAgICAgICBkYXRhOiB0ZXh0RGF0YSxcbiAgICAgICAgICAgICAgICB0b3VzZXI6IG9wZW5pZCxcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZV9pZDogdGVtcGxhdGUuaWRcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIC8vIOiOt+WPlnRva2VuXG4gICAgICAgICAgICBjb25zdCByZXN1bHQgPSBhd2FpdCAoYXhpb3MgYXMgYW55KSh7XG4gICAgICAgICAgICAgICAgbWV0aG9kOiAnZ2V0JyxcbiAgICAgICAgICAgICAgICB1cmw6IGBodHRwczovL2FwaS53ZWl4aW4ucXEuY29tL2NnaS1iaW4vdG9rZW4/Z3JhbnRfdHlwZT1jbGllbnRfY3JlZGVudGlhbCZhcHBpZD0ke0NPTkZJRy5hcHAuaWR9JnNlY3JldD0ke0NPTkZJRy5hcHAuc2VjcmVjdH1gXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgY29uc3QgeyBhY2Nlc3NfdG9rZW4sIGVycmNvZGUgfSA9IHJlc3VsdC5kYXRhO1xuXG4gICAgICAgICAgICBpZiAoIGVycmNvZGUgKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgJ+eUn+aIkGFjY2Vzc190b2tlbumUmeivrydcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgY29uc29sZS5sb2coJz09PeS6keeJiOacrOiuoumYheaOqOmAgScsIHN1YnNjcmliZURhdGEgKTtcblxuICAgICAgICAgICAgY29uc3Qgc2VuZCA9IGF3YWl0IChheGlvcyBhcyBhbnkpKHtcbiAgICAgICAgICAgICAgICBkYXRhOiBzdWJzY3JpYmVEYXRhLFxuICAgICAgICAgICAgICAgIG1ldGhvZDogJ3Bvc3QnLFxuICAgICAgICAgICAgICAgIHVybDogYGh0dHBzOi8vYXBpLndlaXhpbi5xcS5jb20vY2dpLWJpbi9tZXNzYWdlL3N1YnNjcmliZS9zZW5kP2FjY2Vzc190b2tlbj0ke2FjY2Vzc190b2tlbn1gXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgY29uc29sZS5sb2coJz09PeS6keeJiOacrOiuoumYheaOqOmAgScsIHNlbmQuZGF0YSApO1xuICAgICAgICAgICAgaWYgKCBTdHJpbmcoIHNlbmQuZGF0YS5lcnJjb2RlICkgIT09ICcwJyApIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBzZW5kLmRhdGEuZXJybXNnO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gY3R4LmJvZHkgPSB7XG4gICAgICAgICAgICAgICAgc3RhdHVzOiAyMDBcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBjYXRjaCAoIGUgKSB7XG4gICAgICAgICAgICByZXR1cm4gY3R4LmJvZHkgPSB7IFxuICAgICAgICAgICAgICAgIHN0YXR1czogNTAwLFxuICAgICAgICAgICAgICAgIGRhdGE6IGVcbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgIC8qKlxuICAgICAqIEBkZXNjcmlwdGlvblxuICAgICAqIOWIm+W7uuS4gOS4quWIhuS6q+iusOW9lVxuICAgICAqIOihqOe7k+aehCB7XG4gICAgICogICAgICB0byAvLyDlj5fmjqjogIVcbiAgICAgKiAgICAgIGZyb20gLy8g5o6o5bm/6ICFXG4gICAgICogICAgICBwaWRcbiAgICAgKiAgICAgIGNyZWF0ZVRpbWUgLy8g5YiG5Lqr5pe26Ze0XG4gICAgICogICAgICBpc1N1Y2Nlc3M6IGJvb2xlYW4gLy8g5piv5ZCm5o6o5bm/5oiQ5YqfXG4gICAgICogICAgICBzdWNjZXNzVGltZTogLy8g5o6o5bm/5oiQ5Yqf55qE5pe26Ze0XG4gICAgICogfVxuICAgICAqIOivt+axgntcbiAgICAgKiAgICAgcGlkXG4gICAgICogICAgIGZyb21cbiAgICAgKiB9XG4gICAgICovXG4gICAgYXBwLnJvdXRlcignY3JlYXRlLXNoYXJlJywgYXN5bmMoIGN0eCwgbmV4dCApID0+IHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGNvbnN0IG9wZW5pZCA9IGV2ZW50LnVzZXJJbmZvLm9wZW5JZDtcbiAgICAgICAgICAgIGNvbnN0IHsgZnJvbSwgcGlkIH0gPSBldmVudC5kYXRhO1xuXG4gICAgICAgICAgICAvLyDop4TliJkxOumYsumHjeWkjVxuICAgICAgICAgICAgLy8g5aaC5p6cQee7mULmjqjlub/ov4fllYblk4Ex77yM5YiZQ+e7mULmjqjlub/llYblk4Ex5peg5pWIXG4gICAgICAgICAgICBjb25zdCBjb3VudCQgPSBhd2FpdCBkYi5jb2xsZWN0aW9uKCdzaGFyZS1yZWNvcmQnKVxuICAgICAgICAgICAgICAgIC53aGVyZSh7XG4gICAgICAgICAgICAgICAgICAgIHBpZCxcbiAgICAgICAgICAgICAgICAgICAgb3BlbmlkLFxuICAgICAgICAgICAgICAgICAgICBpc1N1Y2Nlc3M6IGZhbHNlXG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAuY291bnQoICk7XG5cbiAgICAgICAgICAgIGlmICggY291bnQkLnRvdGFsID4gMCApIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gY3R4LmJvZHkgPSB7IHN0YXR1czogMjAwIH07XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIOinhOWImTI6IOS4jeiDveiHquW3seaOqOiHquW3sVxuICAgICAgICAgICAgaWYgKCBvcGVuaWQgPT09IGZyb20gKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGN0eC5ib2R5ID0geyBzdGF0dXM6IDIwMCB9O1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyDop4TliJkzOiAyNGjlhoXkuI3og73ph43lpI3mjqhcbiAgICAgICAgICAgIGNvbnN0IGNvdW50MiQgPSBhd2FpdCBkYi5jb2xsZWN0aW9uKCdzaGFyZS1yZWNvcmQnKVxuICAgICAgICAgICAgICAgIC53aGVyZSh7XG4gICAgICAgICAgICAgICAgICAgIHBpZCxcbiAgICAgICAgICAgICAgICAgICAgb3BlbmlkLFxuICAgICAgICAgICAgICAgICAgICBpc1N1Y2Nlc3M6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgIHN1Y2Nlc3NUaW1lOiBfLmd0ZSggZ2V0Tm93KCB0cnVlICkgLSAyNCAqIDYwICogNjAgKiAxMDAwIClcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIC5jb3VudCggKTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgaWYgKCBjb3VudDIkLnRvdGFsID4gMCApIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gY3R4LmJvZHkgPSB7IHN0YXR1czogMjAwIH07XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIOWIm+W7ulxuICAgICAgICAgICAgY29uc3QgY3JlYXRlJCA9IGF3YWl0IGRiLmNvbGxlY3Rpb24oJ3NoYXJlLXJlY29yZCcpXG4gICAgICAgICAgICAgICAgLmFkZCh7XG4gICAgICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHBpZCxcbiAgICAgICAgICAgICAgICAgICAgICAgIGZyb20sXG4gICAgICAgICAgICAgICAgICAgICAgICBvcGVuaWQsXG4gICAgICAgICAgICAgICAgICAgICAgICBpc1N1Y2Nlc3M6IGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICAgICAgY3JlYXRlVGltZTogZ2V0Tm93KCB0cnVlIClcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICByZXR1cm4gY3R4LmJvZHkgPSB7IHN0YXR1czogMjAwIH07XG5cbiAgICAgICAgfSBjYXRjaCAoIGUgKSB7XG4gICAgICAgICAgICByZXR1cm4gY3R4LmJvZHkgPSB7XG4gICAgICAgICAgICAgICAgc3RhdHVzOiA1MDBcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0pXG5cbiAgICAvKiogXG4gICAgICogQGRlc2NyaXB0aW9uXG4gICAgICog6I635Y+W5o6o5bm/56ev5YiGXG4gICAgICoge1xuICAgICAqICAgIHNob3dNb3JlPzogZmFsc2VcbiAgICAgKiB9XG4gICAgICovXG4gICAgYXBwLnJvdXRlcigncHVzaC1pbnRlZ3JhbCcsIGFzeW5jICggY3R4LCBuZXh0ICkgPT4ge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgY29uc3QgeyBzaG93TW9yZSB9ID0gZXZlbnQuZGF0YTtcbiAgICAgICAgICAgIGNvbnN0IG9wZW5pZCA9IGV2ZW50LmRhdGEub3BlbklkIHx8IGV2ZW50LnVzZXJJbmZvLm9wZW5JZDtcbiAgICAgICAgICAgIGNvbnN0IHVzZXIkID0gYXdhaXQgZGIuY29sbGVjdGlvbigndXNlcicpXG4gICAgICAgICAgICAgICAgLndoZXJlKHtcbiAgICAgICAgICAgICAgICAgICAgb3BlbmlkXG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAuZ2V0KCApO1xuICAgICAgICAgICAgY29uc3QgdXNlciA9IHVzZXIkLmRhdGFbIDAgXTtcblxuICAgICAgICAgICAgY29uc3QgZXhwID0gISF1c2VyID8gdXNlci5leHAgfHwgMCA6IDA7XG4gICAgICAgICAgICBjb25zdCBpbnRlZ3JhbCA9ICEhdXNlciA/IHVzZXIucHVzaF9pbnRlZ3JhbCB8fCAwIDogMDtcblxuICAgICAgICAgICAgcmV0dXJuIGN0eC5ib2R5ID0ge1xuICAgICAgICAgICAgICAgIHN0YXR1czogMjAwLFxuICAgICAgICAgICAgICAgIGRhdGE6ICFzaG93TW9yZSA/IFxuICAgICAgICAgICAgICAgICAgICBpbnRlZ3JhbCA6XG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGV4cCxcbiAgICAgICAgICAgICAgICAgICAgICAgIGludGVncmFsLFxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfSBjYXRjaCAoIGUgKSB7XG4gICAgICAgICAgICByZXR1cm4gY3R4LmJvZHkgPSB7IHN0YXR1czogNTAwIH07XG4gICAgICAgIH0gXG4gICAgfSlcblxuICAgIC8qKlxuICAgICAqIEBkZXNjcmlwdGlvblxuICAgICAqIOiOt+WPluenr+WIhuS9v+eUqOiusOW9lVxuICAgICAqIHtcbiAgICAgKiAgICB0aWRzOiAnYSxiLGMnXG4gICAgICogICAgdHlwZTogJ3B1c2hfaW50ZWdyYWwnIHwgJydcbiAgICAgKiB9XG4gICAgICovXG4gICAgYXBwLnJvdXRlcigncHVzaC1pbnRlZ3JhbC11c2UnLCBhc3luYyAoIGN0eCwgbmV4dCApID0+IHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGNvbnN0IHsgdGlkcywgdHlwZSB9ID0gZXZlbnQuZGF0YTtcbiAgICAgICAgICAgIGNvbnN0IG9wZW5pZCA9IGV2ZW50LmRhdGEub3BlbklkIHx8IGV2ZW50LmRhdGEub3BlbmlkIHx8IGV2ZW50LnVzZXJJbmZvLm9wZW5JZDtcblxuICAgICAgICAgICAgY29uc3QgZmluZCQ6IGFueSA9IGF3YWl0IFByb21pc2UuYWxsKFxuICAgICAgICAgICAgICAgIHRpZHMuc3BsaXQoJywnKVxuICAgICAgICAgICAgICAgICAgICAubWFwKCB0aWQgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGRiLmNvbGxlY3Rpb24oJ2ludGVncmFsLXVzZS1yZWNvcmQnKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC53aGVyZSh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRpZCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb3BlbmlkXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAuZ2V0KCApO1xuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgKTtcblxuICAgICAgICAgICAgY29uc3QgbWV0YSA9IGZpbmQkXG4gICAgICAgICAgICAgICAgLmZpbHRlciggeCA9PiAhIXguZGF0YVsgMCBdKVxuICAgICAgICAgICAgICAgIC5tYXAoIHggPT4geC5kYXRhWyAwIF0pO1xuXG4gICAgICAgICAgICByZXR1cm4gY3R4LmJvZHkgPSB7XG4gICAgICAgICAgICAgICAgZGF0YTogbWV0YSxcbiAgICAgICAgICAgICAgICBzdGF0dXM6IDIwMFxuICAgICAgICAgICAgfVxuXG4gICAgICAgIH0gY2F0Y2ggKCBlICkge1xuICAgICAgICAgICAgcmV0dXJuIGN0eC5ib2R5ID0ge1xuICAgICAgICAgICAgICAgIHN0YXR1czogNTAwXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9KVxuXG4gICAgLyoqXG4gICAgICogQGRlc2NyaXB0aW9uXG4gICAgICog5Yib5bu6IOenr+WIhuS9v+eUqOiusOW9lVxuICAgICAqIHtcbiAgICAgKiAgICB0aWRcbiAgICAgKiAgICB2YWx1ZVxuICAgICAqICAgIG9wZW5pZFxuICAgICAqIH1cbiAgICAgKi9cbiAgICBhcHAucm91dGVyKCdwdXNoLWludGVncmFsLWNyZWF0ZScsIGFzeW5jICggY3R4LCBuZXh0ICkgPT4ge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgY29uc3QgeyB0aWQsIHZhbHVlIH0gPSBldmVudC5kYXRhO1xuICAgICAgICAgICAgY29uc3Qgb3BlbmlkID0gZXZlbnQuZGF0YS5vcGVuSWQgfHwgZXZlbnQuZGF0YS5vcGVuaWQgfHwgZXZlbnQudXNlckluZm8ub3BlbklkO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICBpZiAoICF2YWx1ZSApIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gY3R4LmJvZHkgPSB7XG4gICAgICAgICAgICAgICAgICAgIHN0YXR1czogMjAwXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyDkvb/nlKjooajmt7vliqDorrDlvZVcbiAgICAgICAgICAgIGNvbnN0IHJlY29yZCQgPSBhd2FpdCBkYi5jb2xsZWN0aW9uKCdpbnRlZ3JhbC11c2UtcmVjb3JkJylcbiAgICAgICAgICAgICAgICAgICAgLndoZXJlKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRpZCxcbiAgICAgICAgICAgICAgICAgICAgICAgIG9wZW5pZCxcbiAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6ICdwdXNoX2ludGVncmFsJ1xuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAuZ2V0KCApO1xuICAgICAgICAgICAgY29uc3QgcmVjb3JkID0gcmVjb3JkJC5kYXRhWyAwIF07XG5cbiAgICAgICAgICAgIGlmICggISFyZWNvcmQgJiYgISF2YWx1ZSApIHtcblxuICAgICAgICAgICAgICAgIGF3YWl0IGRiLmNvbGxlY3Rpb24oJ2ludGVncmFsLXVzZS1yZWNvcmQnKVxuICAgICAgICAgICAgICAgICAgICAuZG9jKCBTdHJpbmcoIHJlY29yZC5faWQgKSlcbiAgICAgICAgICAgICAgICAgICAgLnVwZGF0ZSh7XG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU6IE51bWJlcigoIHJlY29yZC52YWx1ZSArIHZhbHVlICkudG9GaXhlZCggMiApKVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgfSBlbHNlIGlmICggIXJlY29yZCAmJiAhIXZhbHVlICkge1xuICAgICAgICAgICAgICAgIGF3YWl0IGRiLmNvbGxlY3Rpb24oJ2ludGVncmFsLXVzZS1yZWNvcmQnKVxuICAgICAgICAgICAgICAgICAgICAuYWRkKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aWQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb3BlbmlkLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6ICdwdXNoX2ludGVncmFsJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZTogTnVtYmVyKCB2YWx1ZS50b0ZpeGVkKCAyICkpLFxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8g6KeS6Imy6KGo77yM5YeP5Y675oq1546w6YeRXG4gICAgICAgICAgICBjb25zdCB1c2VyJCA9IGF3YWl0IGRiLmNvbGxlY3Rpb24oJ3VzZXInKVxuICAgICAgICAgICAgICAgIC53aGVyZSh7XG4gICAgICAgICAgICAgICAgICAgIG9wZW5pZFxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLmdldCggKTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgY29uc3QgdXNlciA9IHVzZXIkLmRhdGFbIDAgXTtcbiAgICAgICAgICAgIGF3YWl0IGRiLmNvbGxlY3Rpb24oJ3VzZXInKVxuICAgICAgICAgICAgICAgIC5kb2MoIFN0cmluZyggdXNlci5faWQgKSlcbiAgICAgICAgICAgICAgICAudXBkYXRlKHtcbiAgICAgICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgICAgICAgcHVzaF9pbnRlZ3JhbDogTnVtYmVyKCggdXNlci5wdXNoX2ludGVncmFsIC0gdmFsdWUgKS50b0ZpeGVkKCAyICkpXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KVxuXG4gICAgICAgICAgICByZXR1cm4gY3R4LmJvZHkgPSB7XG4gICAgICAgICAgICAgICAgc3RhdHVzOiAyMDBcbiAgICAgICAgICAgIH1cblxuICAgICAgICB9IGNhdGNoICggZSApIHtcbiAgICAgICAgICAgIHJldHVybiBjdHguYm9keSA9IHtcbiAgICAgICAgICAgICAgICBzdGF0dXM6IDUwMFxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSlcblxuICAgIC8qKlxuICAgICAqIEBkZXNjcmlwdGlvblxuICAgICAqIOetvuWIsOmihuenr+WIhlxuICAgICAqIHtcbiAgICAgKiAgICAgIGV4cDogbnVtYmVyXG4gICAgICogfVxuICAgICAqL1xuICAgIGFwcC5yb3V0ZXIoJ2dldC1leHAnLCBhc3luYyAoIGN0eCwgbmV4dCApID0+IHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGNvbnN0IHsgZXhwIH0gPSBldmVudC5kYXRhO1xuICAgICAgICAgICAgY29uc3Qgb3BlbmlkID0gZXZlbnQuZGF0YS5vcGVuSWQgfHwgZXZlbnQuZGF0YS5vcGVuaWQgfHwgZXZlbnQudXNlckluZm8ub3BlbklkO1xuXG4gICAgICAgICAgICBjb25zdCB1c2VyJCA9IGF3YWl0IGRiLmNvbGxlY3Rpb24oJ3VzZXInKVxuICAgICAgICAgICAgICAgIC53aGVyZSh7XG4gICAgICAgICAgICAgICAgICAgIG9wZW5pZFxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLmdldCggKTtcblxuICAgICAgICAgICAgY29uc3QgdXNlciA9IHVzZXIkLmRhdGFbIDAgXSB8fCBudWxsO1xuXG4gICAgICAgICAgICBpZiAoICF1c2VyICkgeyByZXR1cm4gY3R4LmJvZHkgPSB7IHN0YXR1czogMjAwIH19O1xuXG4gICAgICAgICAgICBjb25zdCBiZF91aWQgPSB1c2VyLl9pZDtcbiAgICAgICAgICAgIGNvbnN0IGJvZHkgPSB7XG4gICAgICAgICAgICAgICAgLi4udXNlcixcbiAgICAgICAgICAgICAgICBleHA6ICF1c2VyLmV4cCA/IGV4cCA6IHVzZXIuZXhwICsgZXhwXG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICBkZWxldGUgYm9keVsnX2lkJ107XG5cbiAgICAgICAgICAgIGNvbnN0IHVwZGF0ZSQgPSBhd2FpdCBkYi5jb2xsZWN0aW9uKCd1c2VyJylcbiAgICAgICAgICAgICAgICAuZG9jKCBTdHJpbmcoIGJkX3VpZCApKVxuICAgICAgICAgICAgICAgIC5zZXQoe1xuICAgICAgICAgICAgICAgICAgICBkYXRhOiBib2R5XG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHJldHVybiBjdHguYm9keSA9IHtcbiAgICAgICAgICAgICAgICBzdGF0dXM6IDIwMFxuICAgICAgICAgICAgfTtcblxuICAgICAgICB9IGNhdGNoICggZSApIHtcbiAgICAgICAgICAgIHJldHVybiBjdHguYm9keSA9IHsgc3RhdHVzOiA1MDAgfTtcbiAgICAgICAgfVxuICAgIH0pXG5cbiAgICAvKipcbiAgICAgKiBAZGVzY3JpcHRpb25cbiAgICAgKiDnrb7liLDpoobnp6/liIZcbiAgICAgKiB7XG4gICAgICogICAgICBpbnRlZ3JhbDogbnVtYmVyXG4gICAgICogfVxuICAgICAqL1xuICAgIGFwcC5yb3V0ZXIoJ2dldC1pbnRlZ3JhbCcsIGFzeW5jICggY3R4LCBuZXh0ICkgPT4ge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgY29uc3QgeyBpbnRlZ3JhbCB9ID0gZXZlbnQuZGF0YTtcbiAgICAgICAgICAgIGNvbnN0IG9wZW5pZCA9IGV2ZW50LmRhdGEub3BlbklkIHx8IGV2ZW50LmRhdGEub3BlbmlkIHx8IGV2ZW50LnVzZXJJbmZvLm9wZW5JZDtcblxuICAgICAgICAgICAgY29uc3QgdXNlciQgPSBhd2FpdCBkYi5jb2xsZWN0aW9uKCd1c2VyJylcbiAgICAgICAgICAgICAgICAud2hlcmUoe1xuICAgICAgICAgICAgICAgICAgICBvcGVuaWRcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIC5nZXQoICk7XG5cbiAgICAgICAgICAgIGNvbnN0IHVzZXIgPSB1c2VyJC5kYXRhWyAwIF0gfHwgbnVsbDtcblxuICAgICAgICAgICAgaWYgKCAhdXNlciApIHsgcmV0dXJuIGN0eC5ib2R5ID0geyBzdGF0dXM6IDIwMCB9fTtcblxuICAgICAgICAgICAgY29uc3QgYmRfdWlkID0gdXNlci5faWQ7XG4gICAgICAgICAgICBjb25zdCBib2R5ID0ge1xuICAgICAgICAgICAgICAgIC4uLnVzZXIsXG4gICAgICAgICAgICAgICAgcHVzaF9pbnRlZ3JhbDogIXVzZXIucHVzaF9pbnRlZ3JhbCA/IFxuICAgICAgICAgICAgICAgICAgICBpbnRlZ3JhbCA6XG4gICAgICAgICAgICAgICAgICAgIE51bWJlcigoIHVzZXIucHVzaF9pbnRlZ3JhbCArIGludGVncmFsICkudG9GaXhlZCggMiApKVxuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgZGVsZXRlIGJvZHlbJ19pZCddO1xuXG4gICAgICAgICAgICBjb25zdCB1cGRhdGUkID0gYXdhaXQgZGIuY29sbGVjdGlvbigndXNlcicpXG4gICAgICAgICAgICAgICAgLmRvYyggU3RyaW5nKCBiZF91aWQgKSlcbiAgICAgICAgICAgICAgICAuc2V0KHtcbiAgICAgICAgICAgICAgICAgICAgZGF0YTogYm9keVxuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICByZXR1cm4gY3R4LmJvZHkgPSB7XG4gICAgICAgICAgICAgICAgc3RhdHVzOiAyMDBcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgfSBjYXRjaCAoIGUgKSB7XG4gICAgICAgICAgICByZXR1cm4gY3R4LmJvZHkgPSB7IHN0YXR1czogNTAwIH07XG4gICAgICAgIH1cbiAgICB9KVxuXG4gICAgLyoqXG4gICAgICogQGRlc2NyaXB0aW9uXG4gICAgICog6aKG5Y+W5oq1546w6YeR5oiQ5Yqf77yM5o6o6YCBXG4gICAgICog5bm26K6+572uMuWwj+aXtuWAmeWQjueahOe7j+mqjOiOt+WPluaOqOmAgVxuICAgICAqIHtcbiAgICAgKiAgICAgIHNpZ25FeHA6IOmihuWPlueahOe7j+mqjFxuICAgICAqICAgICAgZ2V0X2ludGVncmFsOiBudW1iZXIgLy8g5pys5qyh6I635b6XXG4gICAgICogICAgICBuZXh0X2ludGVncmFsOiBudW1iZXIgLy8g5LiL5qyh6I635b6XXG4gICAgICogICAgICB3ZWVrX2ludGVncmFsOiBudW1iZXIgLy8g5pys5ZGo6I635b6XXG4gICAgICogICAgICBuZXh0d2Vla19pbnRlZ3JhbDogbnVtYmVyIC8vIOS4i+WRqOiOt+W+l1xuICAgICAqIH1cbiAgICAgKi9cbiAgICBhcHAucm91dGVyKCdnZXQtaW50ZWdyYWwtcHVzaCcsIGFzeW5jICggY3R4LCBuZXh0ICkgPT4ge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgY29uc3Qgb3BlbmlkID0gZXZlbnQuZGF0YS5vcGVuSWQgfHwgZXZlbnQuZGF0YS5vcGVuaWQgfHwgZXZlbnQudXNlckluZm8ub3BlbklkO1xuICAgICAgICAgICAgY29uc3QgeyBzaWduRXhwLCBnZXRfaW50ZWdyYWwsIG5leHRfaW50ZWdyYWwsIHdlZWtfaW50ZWdyYWwsIG5leHR3ZWVrX2ludGVncmFsIH0gPSBldmVudC5kYXRhO1xuXG4gICAgICAgICAgICAvLyA044CB6LCD55So5o6o6YCBXG4gICAgICAgICAgICBjb25zdCBwdXNoJCA9IGF3YWl0IGNsb3VkLmNhbGxGdW5jdGlvbih7XG4gICAgICAgICAgICAgICAgbmFtZTogJ2NvbW1vbicsXG4gICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgICAkdXJsOiAncHVzaC1zdWJzY3JpYmUnLFxuICAgICAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBvcGVuaWQsXG4gICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiAnaG9uZ2JhbycsXG4gICAgICAgICAgICAgICAgICAgICAgICBwYWdlOiAncGFnZXMvbXkvaW5kZXgnLFxuICAgICAgICAgICAgICAgICAgICAgICAgdGV4dHM6IFtg5oiQ5Yqf6aKG5Y+WJHtnZXRfaW50ZWdyYWx95YWD5oq1546w6YeR77yBYCwgYOS4i+WNleWwseiDveeUqO+8geacrOWRqOeZu+mZhumAgSR7d2Vla19pbnRlZ3JhbH3lhYPvvIFgXVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIC8vIDXjgIHmj5LlhaXosIPnlKjmoIhcbiAgICAgICAgICAgIGNvbnN0IGNyZWF0ZSQgPSBhd2FpdCBkYi5jb2xsZWN0aW9uKCdwdXNoLXRpbWVyJylcbiAgICAgICAgICAgICAgICAuYWRkKHtcbiAgICAgICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgICAgICAgb3BlbmlkLFxuICAgICAgICAgICAgICAgICAgICAgICAgdGV4dHM6IFtg55m76ZmG6aKG5Y+WJHtzaWduRXhwfeeCuee7j+mqjGAsIGDljYfnuqflkI7vvIzlhajlkajlj6/pooYke25leHR3ZWVrX2ludGVncmFsfeWFg++8gWBdLFxuICAgICAgICAgICAgICAgICAgICAgICAgcHVzaHRpbWU6IGdldE5vdyggdHJ1ZSApICsgMi4xICogNjAgKiA2MCAqIDEwMDAsXG4gICAgICAgICAgICAgICAgICAgICAgICBkZXNjOiAn5Yiw5pe26Ze06aKG5Y+W57uP6aqM5LqGJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6ICd1c2VyLWV4cC1nZXQnXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgcmV0dXJuIGN0eC5ib2R5ID0geyBzdGF0dXM6IDIwMCB9O1xuXG4gICAgICAgIH0gY2F0Y2ggKCBlICkge1xuICAgICAgICAgICAgcmV0dXJuIGN0eC5ib2R5ID0geyBzdGF0dXM6IDUwMCB9O1xuICAgICAgICB9XG4gICAgfSlcblxuICAgIC8qKiBcbiAgICAgKiBAZGVzY3JpcHRpb25cbiAgICAgKiDojrflj5borqLpmIXmqKHmnb/liJfooahcbiAgICAgKi9cbiAgICBhcHAucm91dGVyKCdnZXQtc3Vic2NyaWJlLXRlbXBsYXRlcycsIGFzeW5jICggY3R4LCBuZXh0ICkgPT4ge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgcmV0dXJuIGN0eC5ib2R5ID0geyBcbiAgICAgICAgICAgICAgICBzdGF0dXM6IDIwMCxcbiAgICAgICAgICAgICAgICBkYXRhOiBDT05GSUcuc3Vic2NyaWJlX3RlbXBsYXRlc1xuICAgICAgICAgICAgfTtcbiAgICAgICAgfSBjYXRjaCAoIGUgKSB7XG4gICAgICAgICAgICByZXR1cm4gY3R4LmJvZHkgPSB7IHN0YXR1czogNTAwIH07XG4gICAgICAgIH1cbiAgICB9KVxuXG4gICAgLyoqXG4gICAgICogQGRlc2NyaXB0aW9uXG4gICAgICog5qC55o2ub3Blbmlk6L+U5Zue55So5oi35L+h5oGv77yI5Y+v6L+U5ZuebnVsbO+8iVxuICAgICAqL1xuICAgIGFwcC5yb3V0ZXIoJ2dldC11c2VyLWluZm8nLCBhc3luYyAoIGN0eCwgbmV4dCApID0+IHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGNvbnN0IG9wZW5pZCA9IGV2ZW50LmRhdGEub3BlbklkIHx8IGV2ZW50LmRhdGEub3BlbmlkIHx8IGV2ZW50LnVzZXJJbmZvLm9wZW5JZDtcbiAgICAgICAgICAgIGNvbnN0IHVzZXIkID0gYXdhaXQgZGIuY29sbGVjdGlvbigndXNlcicpXG4gICAgICAgICAgICAgICAgLndoZXJlKHtcbiAgICAgICAgICAgICAgICAgICAgb3BlbmlkXG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAuZ2V0KCApO1xuXG4gICAgICAgICAgICBjb25zdCBkYXRhID0gdXNlciQuZGF0YVsgMCBdIHx8IG51bGw7XG5cbiAgICAgICAgICAgIC8vIOafpeivouaYr+WQpuS4umFkbVxuICAgICAgICAgICAgaWYgKCAhIWRhdGEgKSB7XG5cbiAgICAgICAgICAgICAgICBjb25zdCBhZG0kID0gYXdhaXQgZGIuY29sbGVjdGlvbignbWFuYWdlci1tZW1iZXInKVxuICAgICAgICAgICAgICAgICAgICAud2hlcmUoKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG9wZW5pZDogZGF0YS5vcGVuaWRcbiAgICAgICAgICAgICAgICAgICAgfSkpXG4gICAgICAgICAgICAgICAgICAgIC5jb3VudCggKTtcblxuICAgICAgICAgICAgICAgIHJldHVybiBjdHguYm9keSA9IHtcbiAgICAgICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgICAgICAgLi4uZGF0YSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHJvbGU6IGFkbSQudG90YWwgPiAwID8gMSA6IDBcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgc3RhdHVzOiAyMDBcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHJldHVybiBjdHguYm9keSA9IHtcbiAgICAgICAgICAgICAgICAgICAgZGF0YTogbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgc3RhdHVzOiAyMDBcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gY2F0Y2ggKCBlICkge1xuICAgICAgICAgICAgcmV0dXJuIGN0eC5ib2R5ID0ge1xuICAgICAgICAgICAgICAgIHN0YXR1czogMjAwLFxuICAgICAgICAgICAgICAgIGRhdGE6IGVcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0pXG5cbiAgICAvKiogXG4gICAgICogQGRlc2NyaXB0aW9uXG4gICAgICog5rWL6K+V5LiT55SoXG4gICAgICovXG4gICAgYXBwLnJvdXRlcigndGVzdCcsIGFzeW5jICggY3R4LCBuZXh0ICkgPT4ge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgXG4gICAgICAgICAgICAvLyDmib7liLDmmKjmmZrkuIvljYg254K55ZCO55qE5pe26Ze05oizXG4gICAgICAgICAgICBjb25zdCBub3dUaW1lID0gZ2V0Tm93KCApO1xuICAgICAgICAgICAgY29uc3QgeSA9IG5vd1RpbWUuZ2V0RnVsbFllYXIoICk7XG4gICAgICAgICAgICBjb25zdCBtID0gbm93VGltZS5nZXRNb250aCggKSArIDE7XG4gICAgICAgICAgICBjb25zdCBkID0gbm93VGltZS5nZXREYXRlKCApO1xuICAgICAgICAgICAgY29uc3QgbGFzdE5pZ2h0VGltZSA9IG5ldyBEYXRlKGAke3l9LyR7bX0vJHtkfSAwMDowMDowMGApO1xuICAgICAgICAgICAgY29uc3QgdGltZSA9IGxhc3ROaWdodFRpbWUuZ2V0VGltZSggKSAtIDYgKiA2MCAqIDYwICogMTAwMDtcblxuICAgICAgICAgICAgLy8g5oqK6L+Z5Liq5pe26Ze054K55Lul5ZCO55qE5p+l55yL5ZWG5ZOB6K6w5b2V6YO95ou/5Ye65p2lXG4gICAgICAgICAgICBjb25zdCB2aXNpdG9yUmVjb3JkcyQgPSBhd2FpdCBkYi5jb2xsZWN0aW9uKCdnb29kLXZpc2l0aW5nLXJlY29yZCcpXG4gICAgICAgICAgICAgICAgLndoZXJlKHtcbiAgICAgICAgICAgICAgICAgICAgdmlzaXRUaW1lOiBfLmd0ZSggdGltZSApXG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAuZmllbGQoe1xuICAgICAgICAgICAgICAgICAgICBwaWQ6IHRydWVcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIC5nZXQoICk7XG4gICAgICAgICAgICBjb25zdCB2aXNpdG9yUmVjb3JkcyA9IHZpc2l0b3JSZWNvcmRzJC5kYXRhO1xuXG4gICAgICAgICAgICAvLyDmi7/liLDmtY/op4jorrDlvZXmnIDpq5jnmoTllYblk4FcbiAgICAgICAgICAgIGxldCBtYXhQaWQgPSAnJztcbiAgICAgICAgICAgIGxldCBtYXhOdW0gPSAwO1xuICAgICAgICAgICAgdmlzaXRvclJlY29yZHMucmVkdWNlKCggcmVzLCByZWNvcmQgKSA9PiB7XG4gICAgICAgICAgICAgICAgcmVzWyByZWNvcmQucGlkIF0gPSAhcmVzWyByZWNvcmQucGlkIF0gPyAxIDogcmVzWyByZWNvcmQucGlkIF0gKyAxO1xuICAgICAgICAgICAgICAgIGlmICggcmVzWyByZWNvcmQucGlkIF0gPiBtYXhOdW0gKSB7XG4gICAgICAgICAgICAgICAgICAgIG1heFBpZCA9IHJlY29yZC5waWQ7XG4gICAgICAgICAgICAgICAgICAgIG1heE51bSA9IHJlc1sgcmVjb3JkLnBpZCBdO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gcmVzO1xuICAgICAgICAgICAgfSwgeyB9KTtcblxuICAgICAgICAgICAgLy8g6Iul5pyJ77yM6I635Y+W6L+Z5Liq5ZWG5ZOB55qE5oC75ou85Zui5Lq65pWwXG4gICAgICAgICAgICBpZiAoICFtYXhOdW0gfHwgIW1heFBpZCApIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gY3R4LmJvZHkgPSB7IHN0YXR1czogMjAwIH1cbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIC8vIOmAu+i+ke+8mumAmui/h29yZGVy55qEY3JlYXRldGltZeaJvuWIsHRpZO+8jCDpgJrov4cgdGlkKyBwaWQg5om+5Yiwc2hvcHBpbmdsaXN0XG4gICAgICAgICAgICBjb25zdCBvcmRlciQgPSBhd2FpdCBkYi5jb2xsZWN0aW9uKCdvcmRlcicpXG4gICAgICAgICAgICAgICAgLndoZXJlKHtcbiAgICAgICAgICAgICAgICAgICAgY3JlYXRlVGltZTogXy5ndGUoIHRpbWUgKVxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLmZpZWxkKHtcbiAgICAgICAgICAgICAgICAgICAgdGlkOiB0cnVlXG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAubGltaXQoIDEgKVxuICAgICAgICAgICAgICAgIC5nZXQoICk7XG4gICAgICAgICAgICBjb25zdCBvcmRlciA9IG9yZGVyJC5kYXRhWyAwIF07XG5cbiAgICAgICAgICAgIGlmICggb3JkZXIkLmRhdGEubGVuZ3RoID09PSAwICkge1xuICAgICAgICAgICAgICAgIHJldHVybiBjdHguYm9keSA9IHsgc3RhdHVzOiAyMDAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBjb25zdCBzbCQgPSBhd2FpdCBkYi5jb2xsZWN0aW9uKCdzaG9wcGluZy1saXN0JylcbiAgICAgICAgICAgICAgICAud2hlcmUoe1xuICAgICAgICAgICAgICAgICAgICBwaWQ6IG1heFBpZCxcbiAgICAgICAgICAgICAgICAgICAgdGlkOiBvcmRlci50aWRcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIC5maWVsZCh7XG4gICAgICAgICAgICAgICAgICAgIHVpZHM6IHRydWVcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIC5nZXQoICk7XG4gICAgICAgICAgICBjb25zdCBzbCA9IHNsJC5kYXRhWyAwIF07XG5cbiAgICAgICAgICAgIGlmICggc2wkLmRhdGEubGVuZ3RoID09PSAwICkge1xuICAgICAgICAgICAgICAgIHJldHVybiBjdHguYm9keSA9IHsgc3RhdHVzOiAyMDAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyDojrflj5bmiYDmnInnrqHnkIblkZhcbiAgICAgICAgICAgIGNvbnN0IGFkbXMkID0gYXdhaXQgZGIuY29sbGVjdGlvbignbWFuYWdlci1tZW1iZXInKVxuICAgICAgICAgICAgICAgIC53aGVyZSh7IH0pXG4gICAgICAgICAgICAgICAgLmdldCggKTtcblxuICAgICAgICAgICAgLy8g6I635Y+W5ZWG5ZOB6K+m5oOFXG4gICAgICAgICAgICBjb25zdCBnb29kJCA9IGF3YWl0IGRiLmNvbGxlY3Rpb24oJ2dvb2RzJylcbiAgICAgICAgICAgICAgICAuZG9jKCBTdHJpbmcoIG1heFBpZCApKVxuICAgICAgICAgICAgICAgIC5maWVsZCh7XG4gICAgICAgICAgICAgICAgICAgIHRpdGxlOiB0cnVlXG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAuZ2V0KCApO1xuXG4gICAgICAgICAgICAvLyDmjqjpgIFcbiAgICAgICAgICAgIGF3YWl0IFByb21pc2UuYWxsKFxuICAgICAgICAgICAgICAgIGFkbXMkLmRhdGEubWFwKCBhc3luYyBhZG0gPT4ge1xuICAgICAgICAgICAgICAgICAgICBhd2FpdCBjbG91ZC5jYWxsRnVuY3Rpb24oe1xuICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogJ2NvbW1vbicsXG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJHVybDogJ3B1c2gtc3Vic2NyaWJlJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9wZW5pZDogYWRtLm9wZW5pZCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogJ3dhaXRQaW4nLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYWdlOiBgcGFnZXMvbWFuYWdlci10cmlwLW9yZGVyL2luZGV4P2lkPSR7b3JkZXIudGlkfWAsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRleHRzOiBbYOaYqOWkqeaciSR7bWF4TnVtfeS6uua1j+iniO+8jCR7c2wudWlkcy5sZW5ndGh95Lq65oiQ5YqfJHtzbC51aWRzLmxlbmd0aCA+IDEgPyAn5ou85Zui77yBJyA6ICfkuIvljZXvvIEnfWAsIGAke2dvb2QkLmRhdGEudGl0bGV9YF1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gXG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICk7XG5cbiAgICAgICAgICAgIHJldHVybiBjdHguYm9keSA9IHtcbiAgICAgICAgICAgICAgICBzdGF0dXM6IDIwMFxuICAgICAgICAgICAgfVxuICAgICAgICB9IGNhdGNoICggZSApIHtcbiAgICAgICAgICAgIHJldHVybiBjdHguYm9keSA9IHsgXG4gICAgICAgICAgICAgICAgc3RhdHVzOiA1MDAsXG4gICAgICAgICAgICAgICAgZGF0YTogZVxuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgIH0pXG5cbiAgICByZXR1cm4gYXBwLnNlcnZlKCApO1xuXG59XG5cbmNvbnN0IHRpbWUgPSB0cyA9PiBuZXcgUHJvbWlzZSggcmVzb3ZsZSA9PiB7XG4gICAgc2V0VGltZW91dCgoICkgPT4gcmVzb3ZsZSggKSwgdHMgKTtcbn0pXG5cbi8qKlxuICog5Yid5aeL5YyW5pWw5o2u5bqT44CB5Z+656GA5pWw5o2uXG4gKi9cbmNvbnN0IGluaXREQiA9ICggKSA9PiBuZXcgUHJvbWlzZSggYXN5bmMgcmVzb2x2ZSA9PiB7XG4gICAgdHJ5IHtcblxuICAgICAgICAvKiog5Yid5aeL5YyW6KGoICovXG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBjb25zdCBjb2xsZWN0aW9ucyA9IENPTkZJRy5jb2xsZWN0aW9ucztcbiAgICAgICAgICAgIGF3YWl0IFByb21pc2UuYWxsKFxuICAgICAgICAgICAgICAgIGNvbGxlY3Rpb25zLm1hcCggY29sbGVjdGlvbk5hbWUgPT4gKGRiIGFzIGFueSkuY3JlYXRlQ29sbGVjdGlvbiggY29sbGVjdGlvbk5hbWUgKSlcbiAgICAgICAgICAgICk7XG4gICAgICAgIH0gY2F0Y2ggKCBlICkgeyB9XG5cbiAgICAgICAgYXdhaXQgdGltZSggODAwICk7XG5cbiAgICAgICAgLyoqIOWIneWni+WMluaVsOaNruWtl+WFuCAqL1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgY29uc3QgZGljcyA9IENPTkZJRy5kaWM7XG4gICAgICAgICAgICBhd2FpdCBQcm9taXNlLmFsbChcbiAgICAgICAgICAgICAgICBkaWNzLm1hcCggYXN5bmMgZGljU2V0ID0+IHtcblxuICAgICAgICAgICAgICAgICAgICBjb25zdCB0YXJnZXREaWMkID0gYXdhaXQgZGIuY29sbGVjdGlvbignZGljJylcbiAgICAgICAgICAgICAgICAgICAgICAgIC53aGVyZSh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYmVsb25nOiBkaWNTZXQuYmVsb25nXG4gICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAgICAgLmdldCggKTtcblxuICAgICAgICAgICAgICAgICAgICBjb25zdCB0YXJnZXREaWMgPSB0YXJnZXREaWMkLmRhdGFbIDAgXTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCAhIXRhcmdldERpYyApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGF3YWl0IGRiLmNvbGxlY3Rpb24oJ2RpYycpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLmRvYyggU3RyaW5nKCB0YXJnZXREaWMuX2lkICkpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLnNldCh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGE6IGRpY1NldFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBhd2FpdCBkYi5jb2xsZWN0aW9uKCdkaWMnKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5hZGQoe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhOiBkaWNTZXRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICApO1xuICAgICAgICB9IGNhdGNoICggZSApIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdlZWUnLCBlICk7XG4gICAgICAgIH1cblxuICAgICAgICAvKiog5Yid5aeL5YyW5bqU55So6YWN572uICovXG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBjb25zdCBhcHBDb25mID0gQ09ORklHLmFwcENvbmZzO1xuICAgICAgICAgICAgYXdhaXQgUHJvbWlzZS5hbGwoXG4gICAgICAgICAgICAgICAgYXBwQ29uZi5tYXAoIGFzeW5jIGNvbmYgPT4ge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCB0YXJnZXRDb25mJCA9IGF3YWl0IGRiLmNvbGxlY3Rpb24oJ2FwcC1jb25maWcnKVxuICAgICAgICAgICAgICAgICAgICAgICAgLndoZXJlKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiBjb25mLnR5cGVcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgICAgICAuZ2V0KCApO1xuXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHRhcmdldENvbmYgPSB0YXJnZXRDb25mJC5kYXRhWyAwIF07XG4gICAgICAgICAgICAgICAgICAgIGlmICggISF0YXJnZXRDb25mICkge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8g55Sx5LqO6YWN572u5bey57uP55Sf5pWI5LiU5oqV5YWl5L2/55So77yM6L+Z6YeM5LiN6IO955u05o6l5pu05pS55bey5pyJ55qE57q/5LiK6YWN572uXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBhd2FpdCBkYi5jb2xsZWN0aW9uKCdhcHAtY29uZmlnJylcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vICAgICAuZG9jKCBTdHJpbmcoIHRhcmdldENvbmYuX2lkICkpXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyAgICAgLnNldCh7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyAgICAgICAgIGRhdGE6IGNvbmZcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vICAgICB9KTtcblxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgYXdhaXQgZGIuY29sbGVjdGlvbignYXBwLWNvbmZpZycpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLmFkZCh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGE6IGNvbmZcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICApO1xuICAgICAgICB9IGNhdGNoICggZSApIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdlZWUnLCBlICk7XG4gICAgICAgIH1cblxuICAgICAgICByZXNvbHZlKCApO1xuXG4gICAgfSBjYXRjaCAoIGUgKSB7IHJlc29sdmUoICk7fVxufSk7Il19