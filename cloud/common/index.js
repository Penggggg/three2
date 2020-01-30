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
                                    value: _.inc(value)
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
                                    value: value,
                                    type: 'push_integral'
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
                                    push_integral: _.inc(-value)
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSxxQ0FBdUM7QUFDdkMsc0NBQXdDO0FBQ3hDLDZCQUErQjtBQUMvQiwrQkFBaUM7QUFDakMsb0NBQXNDO0FBQ3RDLGlDQUFtQztBQUVuQyxLQUFLLENBQUMsSUFBSSxDQUFDO0lBQ1AsR0FBRyxFQUFFLE9BQU8sQ0FBQyxHQUFHLENBQUMsS0FBSztDQUN6QixDQUFDLENBQUM7QUFFSCxJQUFNLEVBQUUsR0FBZ0IsS0FBSyxDQUFDLFFBQVEsRUFBRyxDQUFDO0FBQzFDLElBQU0sQ0FBQyxHQUFHLEVBQUUsQ0FBQyxPQUFPLENBQUM7QUFRckIsSUFBTSxNQUFNLEdBQUcsVUFBRSxFQUFVO0lBQVYsbUJBQUEsRUFBQSxVQUFVO0lBQ3ZCLElBQUssRUFBRSxFQUFHO1FBQ04sT0FBTyxJQUFJLENBQUMsR0FBRyxFQUFHLENBQUM7S0FDdEI7SUFDRCxJQUFNLE1BQU0sR0FBRyxJQUFJLElBQUksQ0FBRSxJQUFJLElBQUksRUFBRyxDQUFDLGNBQWMsRUFBRyxDQUFDLENBQUM7SUFDeEQsT0FBTyxJQUFJLElBQUksQ0FBRSxNQUFNLENBQUMsT0FBTyxFQUFHLEdBQUcsQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsSUFBSSxDQUFFLENBQUE7QUFDN0QsQ0FBQyxDQUFBO0FBS1ksUUFBQSxJQUFJLEdBQUcsVUFBUSxLQUFLLEVBQUUsT0FBTzs7O1FBRWhDLEdBQUcsR0FBRyxJQUFJLFNBQVMsQ0FBQyxFQUFFLEtBQUssT0FBQSxFQUFFLENBQUMsQ0FBQztRQU1yQyxHQUFHLENBQUMsTUFBTSxDQUFDLE1BQU0sRUFBRSxVQUFPLEdBQUcsRUFBRSxJQUFJOzs7Ozs7d0JBRXJCLFdBQVcsR0FBRyxNQUFNLENBQUMsV0FBVyxDQUFDO3dCQUN2QyxXQUFNLE9BQU8sQ0FBQyxHQUFHLENBQUM7Z0NBQ2QsV0FBVyxDQUFDLEdBQUcsQ0FBRSxVQUFBLGNBQWMsSUFBSSxPQUFDLEVBQVUsQ0FBQyxnQkFBZ0IsQ0FBRSxjQUFjLENBQUUsRUFBOUMsQ0FBOEMsQ0FBQzs2QkFDckYsQ0FBQyxFQUFBOzt3QkFGRixTQUVFLENBQUE7d0JBRUYsV0FBTyxHQUFHLENBQUMsSUFBSSxHQUFHLEVBQUUsTUFBTSxFQUFFLEdBQUcsRUFBRSxFQUFBOzs7d0JBRWpDLFdBQU8sR0FBRyxDQUFDLElBQUksR0FBRyxFQUFFLE1BQU0sRUFBRSxHQUFHLEVBQUUsT0FBTyxFQUFFLEdBQUMsRUFBRSxFQUFBOzs7O2FBRXBELENBQUMsQ0FBQTtRQVVGLEdBQUcsQ0FBQyxNQUFNLENBQUMsS0FBSyxFQUFFLFVBQU8sR0FBRyxFQUFFLElBQUk7Ozs7Ozt3QkFJdEIsY0FBaUIsSUFBSSxDQUFDO3dCQUNwQixLQUF5QixLQUFLLENBQUMsSUFBSSxFQUFqQyxPQUFPLGFBQUEsRUFBRSxTQUFTLGVBQUEsQ0FBZ0I7d0JBQzVCLFdBQU0sRUFBRSxDQUFDLFVBQVUsQ0FBQyxLQUFLLENBQUM7aUNBQ25DLEtBQUssQ0FBQztnQ0FDSCxNQUFNLEVBQUUsRUFBRSxDQUFDLE1BQU0sQ0FBQztvQ0FDZCxNQUFNLEVBQUUsT0FBTyxDQUFDLE9BQU8sQ0FBQyxLQUFLLEVBQUUsR0FBRyxDQUFDO29DQUNuQyxPQUFPLEVBQUUsR0FBRztpQ0FDZixDQUFDOzZCQUNMLENBQUM7aUNBQ0QsR0FBRyxFQUFHLEVBQUE7O3dCQVBMLEtBQUssR0FBRyxTQU9IOzZCQUdOLENBQUMsQ0FBQyxTQUFTLEVBQVgsY0FBVzt3QkFDTyxXQUFNLEVBQUUsQ0FBQyxVQUFVLENBQUMsWUFBWSxDQUFDO2lDQUMvQyxLQUFLLENBQUM7Z0NBQ0gsSUFBSSxFQUFFLGlCQUFpQjs2QkFDMUIsQ0FBQztpQ0FDRCxHQUFHLEVBQUcsRUFBQTs7d0JBSkwsVUFBVSxHQUFHLFNBSVI7d0JBQ1gsV0FBUyxHQUFHLFVBQVUsQ0FBQyxJQUFJLENBQUUsQ0FBQyxDQUFFLENBQUM7Ozt3QkFHakMsV0FBUyxFQUFHLENBQUM7d0JBQ2pCLEtBQUssQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFFLFVBQUEsR0FBRzs7NEJBQ2YsUUFBTSxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUMsRUFBRyxFQUFFLFFBQU07Z0NBQzlCLEdBQUUsR0FBRyxDQUFDLE1BQU0sSUFBSSxHQUFHLENBQUUsR0FBRyxDQUFDLE1BQU0sQ0FBRTtxQ0FDNUIsTUFBTSxDQUFFLFVBQUEsQ0FBQyxJQUFJLE9BQUEsQ0FBQyxDQUFDLENBQUMsRUFBSCxDQUFHLENBQUU7cUNBQ2xCLE1BQU0sQ0FBRSxVQUFBLENBQUM7b0NBQ04sSUFBSyxDQUFDLENBQUMsV0FBUyxJQUFJLENBQUMsV0FBUyxDQUFDLEtBQUssRUFBRzt3Q0FDbkMsT0FBTyxNQUFNLENBQUUsQ0FBQyxDQUFDLEtBQUssQ0FBRSxLQUFLLEdBQUcsQ0FBQTtxQ0FDbkM7b0NBQ0QsT0FBTyxJQUFJLENBQUM7Z0NBQ2hCLENBQUMsQ0FBQztvQ0FDUixDQUFDO3dCQUNQLENBQUMsQ0FBQyxDQUFDO3dCQUVILFdBQU8sR0FBRyxDQUFDLElBQUksR0FBRztnQ0FDZCxNQUFNLEVBQUUsR0FBRztnQ0FDWCxJQUFJLEVBQUUsUUFBTTs2QkFDZixFQUFDOzs7d0JBR0YsV0FBTyxHQUFHLENBQUMsSUFBSSxHQUFHO2dDQUNkLE1BQU0sRUFBRSxHQUFHO2dDQUNYLE9BQU8sRUFBRSxHQUFDOzZCQUNiLEVBQUM7Ozs7YUFFVCxDQUFDLENBQUM7UUFNSCxHQUFHLENBQUMsTUFBTSxDQUFDLFVBQVUsRUFBRSxVQUFPLEdBQUcsRUFBRSxJQUFJOzs7Ozs7d0JBR3pCLE1BQU0sR0FBRyxLQUFLLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQzt3QkFDdkIsV0FBTSxFQUFFLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQztpQ0FDcEMsS0FBSyxDQUFDO2dDQUNILE1BQU0sUUFBQTs2QkFDVCxDQUFDO2lDQUNELEdBQUcsRUFBRztpQ0FDTixLQUFLLENBQUUsVUFBQSxHQUFHLElBQU0sTUFBTSxLQUFHLEdBQUssQ0FBQSxDQUFBLENBQUMsQ0FBQyxFQUFBOzt3QkFML0IsS0FBSyxHQUFHLFNBS3VCOzZCQUdoQyxDQUFBLEtBQUssQ0FBQyxJQUFJLENBQUMsTUFBTSxLQUFLLENBQUMsQ0FBQSxFQUF2QixjQUF1Qjt3QkFFeEIsV0FBTSxFQUFFLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQztpQ0FDdEIsR0FBRyxDQUFDO2dDQUNELElBQUksRUFBRSxNQUFNLENBQUMsTUFBTSxDQUFDLEVBQUcsRUFBRSxLQUFLLENBQUMsSUFBSSxFQUFFO29DQUNqQyxNQUFNLFFBQUE7b0NBQ04sUUFBUSxFQUFFLENBQUM7b0NBQ1gsYUFBYSxFQUFFLENBQUM7aUNBQ25CLENBQUM7NkJBQ0wsQ0FBQyxDQUFDLEtBQUssQ0FBRSxVQUFBLEdBQUcsSUFBTSxNQUFNLEtBQUcsR0FBSyxDQUFBLENBQUEsQ0FBQyxDQUFDLEVBQUE7O3dCQVB2QyxTQU91QyxDQUFDOzs7d0JBSWxDLElBQUksR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDLEVBQUcsRUFBRSxLQUFLLENBQUMsSUFBSSxDQUFFLENBQUMsQ0FBRSxFQUFFLEtBQUssQ0FBQyxJQUFJLENBQUUsQ0FBQzt3QkFDOUQsT0FBTyxJQUFJLENBQUMsR0FBRyxDQUFDO3dCQUVoQixXQUFNLEVBQUUsQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDLENBQUMsR0FBRyxDQUFHLEtBQUssQ0FBQyxJQUFJLENBQUUsQ0FBQyxDQUFVLENBQUMsR0FBRyxDQUFFO2lDQUMxRCxHQUFHLENBQUM7Z0NBQ0QsSUFBSSxFQUFFLE1BQU0sQ0FBQyxNQUFNLENBQUMsRUFBRyxFQUFFLElBQUksRUFBRTtvQ0FDM0IsUUFBUSxFQUFFLEtBQUssQ0FBQyxJQUFJLENBQUUsQ0FBQyxDQUFFLENBQUMsUUFBUTtpQ0FDckMsQ0FBQzs2QkFDTCxDQUFDLENBQUMsS0FBSyxDQUFFLFVBQUEsR0FBRyxJQUFNLE1BQU0sS0FBRyxHQUFLLENBQUEsQ0FBQSxDQUFDLENBQUMsRUFBQTs7d0JBTHZDLFNBS3VDLENBQUM7OzRCQUc1QyxXQUFPLEdBQUcsQ0FBQyxJQUFJLEdBQUc7NEJBQ2QsTUFBTSxFQUFFLEdBQUc7eUJBQ2QsRUFBQzs7O3dCQUdGLFdBQU8sR0FBRyxDQUFDLElBQUksR0FBRztnQ0FDZCxNQUFNLEVBQUUsR0FBRztnQ0FDWCxPQUFPLEVBQUUsR0FBQzs2QkFDYixFQUFDOzs7O2FBRVQsQ0FBQyxDQUFDO1FBT0gsR0FBRyxDQUFDLE1BQU0sQ0FBQyxpQkFBaUIsRUFBRSxVQUFPLEdBQUcsRUFBRSxJQUFJOzs7Ozs7d0JBR2hDLE1BQU0sR0FBRyxLQUFLLENBQUMsSUFBSSxDQUFDLE1BQU0sSUFBSSxLQUFLLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQzt3QkFDNUMsV0FBTSxFQUFFLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQztpQ0FDckMsS0FBSyxDQUFDO2dDQUNILE1BQU0sUUFBQTtnQ0FDTixXQUFXLEVBQUUsR0FBRzs2QkFDbkIsQ0FBQztpQ0FDRCxLQUFLLEVBQUcsRUFBQTs7d0JBTFAsS0FBSyxHQUFHLFNBS0Q7d0JBRWIsV0FBTyxHQUFHLENBQUMsSUFBSSxHQUFHO2dDQUNkLE1BQU0sRUFBRSxHQUFHO2dDQUNYLElBQUksRUFBRSxLQUFLLENBQUMsS0FBSyxHQUFHLENBQUM7NkJBQ3hCLEVBQUE7Ozt3QkFHRCxXQUFPLEdBQUcsQ0FBQyxJQUFJLEdBQUc7Z0NBQ2QsTUFBTSxFQUFFLEdBQUc7Z0NBQ1gsSUFBSSxFQUFFLElBQUk7NkJBQ2IsRUFBQTs7OzthQUVSLENBQUMsQ0FBQztRQVNILEdBQUcsQ0FBQyxNQUFNLENBQUMsZUFBZSxFQUFFLFVBQU8sR0FBRyxFQUFFLElBQUk7Ozs7Ozt3QkFHNUIsR0FBRyxHQUFLLEtBQUssQ0FBQyxJQUFJLElBQWYsQ0FBZ0I7d0JBQ3JCLE1BQU0sR0FBRyxLQUFLLENBQUMsSUFBSSxDQUFDLE1BQU0sSUFBSSxLQUFLLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQzt3QkFFNUMsV0FBTSxFQUFFLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQztpQ0FDckMsS0FBSyxDQUFDO2dDQUNILE1BQU0sUUFBQTtnQ0FDTixXQUFXLEVBQUUsR0FBRzs2QkFDbkIsQ0FBQztpQ0FDRCxLQUFLLEVBQUcsRUFBQTs7d0JBTFAsS0FBSyxHQUFHLFNBS0Q7d0JBRUMsV0FBTSxFQUFFLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQztpQ0FDcEMsR0FBRyxDQUFFLE1BQU0sQ0FBRSxHQUFHLENBQUUsQ0FBQztpQ0FDbkIsR0FBRyxFQUFHLEVBQUE7O3dCQUZMLEtBQUssR0FBRyxTQUVIO3dCQUNMLElBQUksR0FBRyxLQUFLLENBQUMsSUFBSSxDQUFDO3dCQUVsQixLQUFLLEdBQUcsS0FBSyxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUM7d0JBRXhCLEtBQUssR0FBRyxVQUFFLEtBQUssRUFBRSxJQUFJOzRCQUN2QixJQUFLLENBQUMsSUFBSSxFQUFHO2dDQUFFLE9BQU8sSUFBSSxDQUFDOzZCQUFFOzRCQUM3QixJQUFLLEtBQUssSUFBSSxJQUFJLENBQUMsT0FBTyxLQUFLLEdBQUcsRUFBRztnQ0FDakMsT0FBTyxJQUFJLENBQUM7NkJBRWY7aUNBQU0sSUFBSyxLQUFLLElBQUksSUFBSSxDQUFDLE9BQU8sS0FBSyxHQUFHLEVBQUc7Z0NBQ3hDLE9BQU8sSUFBSSxDQUFDOzZCQUVmO2lDQUFPLElBQUssS0FBSyxJQUFJLElBQUksQ0FBQyxPQUFPLEtBQUssR0FBRyxFQUFHO2dDQUN6QyxPQUFPLEtBQUssQ0FBQzs2QkFFaEI7aUNBQU0sSUFBSyxDQUFDLEtBQUssSUFBSSxJQUFJLENBQUMsT0FBTyxLQUFLLEdBQUcsRUFBRztnQ0FDekMsT0FBTyxLQUFLLENBQUM7NkJBRWhCO2lDQUFPLElBQUssQ0FBQyxLQUFLLElBQUksSUFBSSxDQUFDLE9BQU8sS0FBSyxHQUFHLEVBQUc7Z0NBQzFDLE9BQU8sSUFBSSxDQUFDOzZCQUVmO2lDQUFNLElBQUssS0FBSyxJQUFJLElBQUksQ0FBQyxPQUFPLEtBQUssR0FBRyxFQUFHO2dDQUN4QyxPQUFPLEtBQUssQ0FBQzs2QkFFaEI7aUNBQU07Z0NBQ0gsT0FBTyxJQUFJLENBQUM7NkJBQ2Y7d0JBQ0wsQ0FBQyxDQUFBO3dCQUVELFdBQU8sR0FBRyxDQUFDLElBQUksR0FBRztnQ0FDZCxNQUFNLEVBQUUsR0FBRztnQ0FDWCxJQUFJLEVBQUU7b0NBQ0YsS0FBSyxPQUFBO29DQUNMLFlBQVksRUFBRSxLQUFLLENBQUUsS0FBSyxFQUFFLElBQUksQ0FBRTtpQ0FDckM7NkJBQ0osRUFBQTs7O3dCQUVXLFdBQU8sR0FBRyxDQUFDLElBQUksR0FBRyxFQUFFLE1BQU0sRUFBRSxHQUFHLEVBQUUsRUFBQzs7OzthQUNyRCxDQUFDLENBQUE7UUFTRixHQUFHLENBQUMsTUFBTSxDQUFDLE9BQU8sRUFBRSxVQUFPLEdBQUcsRUFBRSxJQUFJOzs7Ozs7d0JBRXRCLEtBQThELE1BQU0sQ0FBQyxLQUFLLEVBQXhFLGNBQUcsRUFBRSxJQUFJLFVBQUEsRUFBRSxNQUFNLFlBQUEsRUFBRSxNQUFNLFlBQUEsRUFBRSxVQUFVLGdCQUFBLEVBQUUsZ0JBQWdCLHNCQUFBLENBQWtCO3dCQUMzRSxLQUFLLEdBQUcsTUFBTSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUM7d0JBQ3RCLFNBQVMsR0FBRyxLQUFLLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQzt3QkFDakMsTUFBTSxHQUFHLEtBQUssQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDO3dCQUMvQixTQUFTLEdBQUcsSUFBSSxDQUFDLE1BQU0sRUFBRyxDQUFDLFFBQVEsQ0FBRSxFQUFFLENBQUUsQ0FBQyxNQUFNLENBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBRSxDQUFDO3dCQUMxRCxTQUFTLEdBQUcsUUFBUSxDQUFDLE1BQU0sQ0FBRSxJQUFJLENBQUMsR0FBRyxFQUFFLEdBQUcsSUFBSSxDQUFFLENBQUMsR0FBRyxFQUFFLENBQUM7d0JBQ3ZELFlBQVksR0FBRyxLQUFLLEdBQUcsU0FBUyxHQUFHLFNBQVMsQ0FBQzt3QkFFN0MsT0FBTyxHQUFHLFVBQUMsRUFBVztnQ0FBVCxxQkFBTzs0QkFDdEIsSUFBTSxFQUFFLEdBQVEsRUFBRyxDQUFBOzRCQUNuQixLQUFNLElBQUksQ0FBQyxJQUFJLElBQUksRUFBRztnQ0FDbEIsRUFBRSxDQUFDLElBQUksQ0FBRSxDQUFDLEdBQUcsR0FBRyxHQUFHLElBQUksQ0FBRSxDQUFDLENBQUUsQ0FBQyxDQUFDOzZCQUNqQzs0QkFDRCxFQUFFLENBQUMsSUFBSSxDQUFDLE1BQU0sR0FBRyxLQUFHLENBQUUsQ0FBQzs0QkFDdkIsSUFBTSxDQUFDLEdBQUksTUFBTSxDQUFDLFVBQVUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxNQUFNLENBQUMsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUM7NEJBQy9FLE9BQU8sQ0FBQyxDQUFDLFdBQVcsRUFBRyxDQUFDO3dCQUM1QixDQUFDLENBQUE7d0JBRUcsUUFBUSxHQUFHLE9BQU8sQ0FBQzt3QkFFdkIsUUFBUSxJQUFJLFNBQVMsR0FBRyxLQUFLLEdBQUcsVUFBVSxDQUFBO3dCQUUxQyxRQUFRLElBQUksVUFBVSxHQUFHLE1BQU0sR0FBRyxXQUFXLENBQUE7d0JBRTdDLFFBQVEsSUFBSSxRQUFRLEdBQUcsSUFBSSxHQUFHLFNBQVMsQ0FBQTt3QkFFdkMsUUFBUSxJQUFJLFVBQVUsR0FBRyxNQUFNLEdBQUcsV0FBVyxDQUFBO3dCQUU3QyxRQUFRLElBQUksYUFBYSxHQUFHLFNBQVMsR0FBRyxjQUFjLENBQUE7d0JBRXRELFFBQVEsSUFBSSxjQUFjLEdBQUcsVUFBVSxHQUFHLGVBQWUsQ0FBQTt3QkFFekQsUUFBUSxJQUFJLFVBQVUsR0FBRyxNQUFNLEdBQUcsV0FBVyxDQUFBO3dCQUU3QyxRQUFRLElBQUksZ0JBQWdCLEdBQUcsWUFBWSxHQUFHLGlCQUFpQixDQUFBO3dCQUUvRCxRQUFRLElBQUksb0JBQW9CLEdBQUcsZ0JBQWdCLEdBQUcscUJBQXFCLENBQUE7d0JBRTNFLFFBQVEsSUFBSSxhQUFhLEdBQUcsU0FBUyxHQUFHLGNBQWMsQ0FBQTt3QkFFdEQsUUFBUSxJQUFJLGdDQUFnQyxDQUFBO3dCQUU1QyxRQUFRLElBQUksUUFBUSxHQUFHLE9BQU8sQ0FBQyxFQUFFLEtBQUssT0FBQSxFQUFFLE1BQU0sUUFBQSxFQUFFLElBQUksTUFBQSxFQUFFLE1BQU0sUUFBQSxFQUFFLFNBQVMsV0FBQSxFQUFFLFVBQVUsWUFBQSxFQUFFLE1BQU0sUUFBQSxFQUFFLFlBQVksY0FBQSxFQUFFLGdCQUFnQixrQkFBQSxFQUFFLFNBQVMsV0FBQSxFQUFFLFVBQVUsRUFBRSxPQUFPLEVBQUUsQ0FBQyxHQUFHLFNBQVMsQ0FBQTt3QkFFMUssUUFBUSxJQUFJLFFBQVEsQ0FBQzt3QkFFWCxXQUFNLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxnREFBZ0QsRUFBRSxNQUFNLEVBQUUsTUFBTSxFQUFDLElBQUksRUFBRSxRQUFRLEVBQUUsQ0FBQyxFQUFBOzt3QkFBeEcsR0FBRyxHQUFHLFNBQWtHO3dCQUV4RyxHQUFHLEdBQUcsR0FBRyxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsQ0FBQzt3QkFFaEMsSUFBSyxHQUFHLENBQUMsT0FBTyxDQUFDLFdBQVcsQ0FBQyxHQUFHLENBQUMsRUFBRzs0QkFDaEMsV0FBTyxHQUFHLENBQUMsSUFBSSxHQUFHO29DQUNkLE1BQU0sRUFBRSxHQUFHO2lDQUNkLEVBQUE7eUJBQ0o7d0JBQ0QsT0FBTyxDQUFDLEdBQUcsQ0FBQyxPQUFPLEVBQUUsUUFBUSxFQUFFLEdBQUcsQ0FBRSxDQUFDO3dCQUNqQyxTQUFTLEdBQUcsR0FBRyxDQUFDLEtBQUssQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQTt3QkFFNUYsT0FBTyxHQUFHLE9BQU8sQ0FBQyxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsUUFBUSxFQUFFLFNBQVMsRUFBRSxPQUFPLEVBQUUsQ0FBQyxZQUFZLEdBQUcsU0FBUyxDQUFDLEVBQUUsUUFBUSxFQUFFLEtBQUssRUFBRSxTQUFTLEVBQUUsU0FBUyxFQUFFLENBQUMsQ0FBQTt3QkFFeEksV0FBTyxHQUFHLENBQUMsSUFBSSxHQUFHO2dDQUNkLE1BQU0sRUFBRSxHQUFHO2dDQUNYLElBQUksRUFBRSxFQUFFLEtBQUssT0FBQSxFQUFFLFNBQVMsV0FBQSxFQUFFLFNBQVMsV0FBQSxFQUFFLFNBQVMsV0FBQSxFQUFFLE9BQU8sU0FBQSxFQUFFOzZCQUM1RCxFQUFDOzs7d0JBR0YsV0FBTyxHQUFHLENBQUMsSUFBSSxHQUFHO2dDQUNkLE1BQU0sRUFBRSxHQUFHOzZCQUNkLEVBQUE7Ozs7YUFFUixDQUFDLENBQUM7UUFVSCxHQUFHLENBQUMsTUFBTSxDQUFDLGFBQWEsRUFBRSxVQUFPLEdBQUcsRUFBRSxJQUFJOzs7Ozs7d0JBRzVCLFNBQVksRUFBRyxDQUFDO3dCQUN0QixNQUFNLENBQUMsSUFBSSxDQUFFLEtBQUssQ0FBQyxJQUFJLENBQUUsQ0FBQyxHQUFHLENBQUUsVUFBQSxHQUFHOzRCQUM5QixJQUFLLENBQUMsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFFLEdBQUcsQ0FBRSxFQUFFO2dDQUN0QixNQUFJLENBQUMsSUFBSSxDQUFDO29DQUNOLElBQUksRUFBRSxHQUFHO29DQUNULEtBQUssRUFBRSxLQUFLLENBQUMsSUFBSSxDQUFFLEdBQUcsQ0FBRTtpQ0FDM0IsQ0FBQyxDQUFBOzZCQUNMO3dCQUNMLENBQUMsQ0FBQyxDQUFDO3dCQUVILFdBQU0sT0FBTyxDQUFDLEdBQUcsQ0FBRSxNQUFJLENBQUMsR0FBRyxDQUFFLFVBQU0sQ0FBQzs7OztnREFFbEIsV0FBTSxFQUFFLENBQUMsVUFBVSxDQUFDLGlCQUFpQixDQUFDO2lEQUMvQyxLQUFLLENBQUM7Z0RBQ0gsSUFBSSxFQUFFLENBQUMsQ0FBQyxJQUFJOzZDQUNmLENBQUM7aURBQ0QsR0FBRyxFQUFHLEVBQUE7OzRDQUpMLEtBQUssR0FBRyxTQUlIO2lEQUVOLENBQUEsS0FBSyxDQUFDLElBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFBLEVBQXJCLGNBQXFCOzRDQUN0QixXQUFNLEVBQUUsQ0FBQyxVQUFVLENBQUMsaUJBQWlCLENBQUMsQ0FBQyxHQUFHLENBQUcsS0FBSyxDQUFDLElBQUksQ0FBRSxDQUFDLENBQVUsQ0FBQyxHQUFHLENBQUU7cURBQ3JFLEdBQUcsQ0FBQztvREFDRCxJQUFJLEVBQUUsQ0FBQztpREFDVixDQUFDLEVBQUE7OzRDQUhOLFNBR00sQ0FBQzs7Z0RBR1AsV0FBTSxFQUFFLENBQUMsVUFBVSxDQUFDLGlCQUFpQixDQUFDO2lEQUNqQyxHQUFHLENBQUM7Z0RBQ0QsSUFBSSxFQUFFLENBQUM7NkNBQ1YsQ0FBQyxFQUFBOzs0Q0FITixTQUdNLENBQUM7Ozs7O2lDQUdkLENBQUMsQ0FBQyxFQUFBOzt3QkFyQkgsU0FxQkcsQ0FBQzt3QkFFSixXQUFPLEdBQUcsQ0FBQyxJQUFJLEdBQUc7Z0NBQ2QsTUFBTSxFQUFFLEdBQUc7NkJBQ2QsRUFBQTs7O3dCQUdELFdBQU8sR0FBRyxDQUFDLElBQUksR0FBRyxFQUFFLE1BQU0sRUFBRSxHQUFHLEVBQUUsRUFBQzs7OzthQUV6QyxDQUFDLENBQUM7UUFNSCxHQUFHLENBQUMsTUFBTSxDQUFDLFFBQVEsRUFBRSxVQUFPLEdBQUcsRUFBRSxJQUFJOzs7Ozs7d0JBR3ZCLFdBQVMsQ0FBQyxXQUFXLEVBQUUsY0FBYyxDQUFDLENBQUM7d0JBQzlCLFdBQU0sT0FBTyxDQUFDLEdBQUcsQ0FBRSxRQUFNLENBQUMsR0FBRyxDQUFFLFVBQUEsSUFBSTtnQ0FDOUMsT0FBTyxFQUFFLENBQUMsVUFBVSxDQUFDLGlCQUFpQixDQUFDO3FDQUNsQyxLQUFLLENBQUM7b0NBQ0gsSUFBSSxNQUFBO2lDQUNQLENBQUM7cUNBQ0QsR0FBRyxFQUFHLENBQUM7NEJBQ2hCLENBQUMsQ0FBQyxDQUFDLEVBQUE7O3dCQU5HLE1BQU0sR0FBRyxTQU1aO3dCQUVHLFNBQU8sRUFBRyxDQUFDO3dCQUNqQixNQUFNLENBQUMsR0FBRyxDQUFDLFVBQUUsS0FBSyxFQUFFLEtBQUs7NEJBQ3JCLElBQUssS0FBSyxDQUFDLElBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFHO2dDQUN6QixNQUFJLENBQUUsUUFBTSxDQUFFLEtBQUssQ0FBRSxDQUFDLEdBQUcsS0FBSyxDQUFDLElBQUksQ0FBRSxDQUFDLENBQUUsQ0FBQyxLQUFLLENBQUM7NkJBQ2xEO3dCQUNMLENBQUMsQ0FBQyxDQUFDO3dCQUVILFdBQU8sR0FBRyxDQUFDLElBQUksR0FBRztnQ0FDZCxNQUFNLEVBQUUsR0FBRztnQ0FDWCxJQUFJLEVBQUUsTUFBSTs2QkFDYixFQUFBOzs7d0JBR0QsV0FBTyxHQUFHLENBQUMsSUFBSSxHQUFHLEVBQUUsTUFBTSxFQUFFLEdBQUcsRUFBRSxFQUFDOzs7O2FBRXpDLENBQUMsQ0FBQztRQU1ILEdBQUcsQ0FBQyxNQUFNLENBQUMsYUFBYSxFQUFFLFVBQU8sR0FBRyxFQUFFLElBQUk7Ozs7Ozt3QkFHOUIsT0FBTyxHQUFHLENBQUMsQ0FBQzt3QkFDVixNQUFNLEdBQUcsS0FBSyxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUM7d0JBQ3RCLFdBQU0sS0FBSyxDQUFDLFlBQVksQ0FBQztnQ0FDcEMsSUFBSSxFQUFFO29DQUNGLElBQUksRUFBRSxPQUFPO2lDQUNoQjtnQ0FDRCxJQUFJLEVBQUUsTUFBTTs2QkFDZixDQUFDLEVBQUE7O3dCQUxJLE1BQU0sR0FBRyxTQUtiO3dCQUNJLEtBQUssR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQzt3QkFDM0IsSUFBSSxHQUFHLEtBQUssQ0FBRSxDQUFDLENBQUUsQ0FBQzt3QkFHUixXQUFNLEVBQUUsQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDO2lDQUN2QyxLQUFLLENBQUM7Z0NBQ0gsTUFBTSxRQUFBO2dDQUNOLFdBQVcsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQzs2QkFDMUIsQ0FBQztpQ0FDRCxLQUFLLEVBQUcsRUFBQTs7d0JBTFAsT0FBTyxHQUFHLFNBS0g7d0JBSVQsUUFBUSxHQUFROzRCQUNoQixLQUFLLEVBQUUsQ0FBQzt5QkFDWCxDQUFDOzZCQUVHLENBQUMsQ0FBQyxJQUFJLEVBQU4sY0FBTTt3QkFDSSxXQUFNLEVBQUUsQ0FBQyxVQUFVLENBQUMsUUFBUSxDQUFDO2lDQUNuQyxLQUFLLENBQUM7Z0NBQ0gsTUFBTSxRQUFBO2dDQUNOLEdBQUcsRUFBRSxJQUFJLENBQUMsR0FBRztnQ0FDYixJQUFJLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUM7NkJBQzFCLENBQUM7aUNBQ0QsS0FBSyxFQUFHLEVBQUE7O3dCQU5iLFFBQVEsR0FBRyxTQU1FLENBQUM7OzRCQUdBLFdBQU0sRUFBRSxDQUFDLFVBQVUsQ0FBQyxRQUFRLENBQUM7NkJBQzFDLEtBQUssQ0FBQzs0QkFDSCxNQUFNLFFBQUE7NEJBQ04sTUFBTSxFQUFFLEtBQUs7NEJBQ2IsSUFBSSxFQUFFLFVBQVU7eUJBQ25CLENBQUM7NkJBQ0QsS0FBSyxFQUFHLEVBQUE7O3dCQU5QLFNBQVMsR0FBRyxTQU1MO3dCQUViLE9BQU8sR0FBRyxRQUFRLENBQUMsS0FBSyxHQUFHLFNBQVMsQ0FBQyxLQUFLLENBQUM7d0JBRTNDLFdBQU8sR0FBRyxDQUFDLElBQUksR0FBRztnQ0FDZCxNQUFNLEVBQUUsR0FBRztnQ0FDWCxJQUFJLEVBQUU7b0NBQ0YsT0FBTyxTQUFBO29DQUNQLE1BQU0sRUFBRSxPQUFPLENBQUMsS0FBSztpQ0FDeEI7NkJBQ0osRUFBQTs7O3dCQUVXLFdBQU8sR0FBRyxDQUFDLElBQUksR0FBRyxFQUFFLE1BQU0sRUFBRSxHQUFHLEVBQUUsRUFBQzs7OzthQUNyRCxDQUFDLENBQUM7UUFTSCxHQUFHLENBQUMsTUFBTSxDQUFDLGtCQUFrQixFQUFFLFVBQU8sR0FBRyxFQUFFLElBQUk7Ozs7Ozt3QkFFakMsS0FBSyxHQUFHLEdBQUcsQ0FBQzt3QkFDSyxXQUFNLEVBQUUsQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDO2lDQUM5QyxLQUFLLENBQUM7Z0NBQ0gsR0FBRyxFQUFFLEtBQUssQ0FBQyxJQUFJLENBQUMsR0FBRzs2QkFDdEIsQ0FBQztpQ0FDRCxPQUFPLENBQUMsWUFBWSxFQUFFLE1BQU0sQ0FBQztpQ0FDN0IsS0FBSyxDQUFFLEtBQUssQ0FBRTtpQ0FDZCxLQUFLLENBQUM7Z0NBQ0gsTUFBTSxFQUFFLElBQUk7NkJBQ2YsQ0FBQztpQ0FDRCxHQUFHLEVBQUcsRUFBQTs7d0JBVEwsY0FBYyxHQUFHLFNBU1o7d0JBRUwsT0FBTyxHQUFHLEtBQUssQ0FBQyxJQUFJLENBQUUsSUFBSSxHQUFHLENBQUUsY0FBYyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUUsVUFBQSxDQUFDLElBQUksT0FBQSxDQUFDLENBQUMsTUFBTSxFQUFSLENBQVEsQ0FBRSxDQUFDLENBQUMsQ0FBQzt3QkFFL0QsV0FBTSxPQUFPLENBQUMsR0FBRyxDQUFFLE9BQU8sQ0FBQyxHQUFHLENBQUUsVUFBQSxHQUFHO2dDQUNoRCxPQUFPLEVBQUUsQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDO3FDQUN2QixLQUFLLENBQUM7b0NBQ0gsTUFBTSxFQUFFLEdBQUc7aUNBQ2QsQ0FBQztxQ0FDRCxLQUFLLENBQUM7b0NBQ0gsU0FBUyxFQUFFLElBQUk7aUNBQ2xCLENBQUM7cUNBQ0QsR0FBRyxFQUFHLENBQUM7NEJBQ2hCLENBQUMsQ0FBQyxDQUFDLEVBQUE7O3dCQVRHLFFBQVEsR0FBRyxTQVNkO3dCQUVILFdBQU8sR0FBRyxDQUFDLElBQUksR0FBRztnQ0FDZCxNQUFNLEVBQUUsR0FBRztnQ0FDWCxJQUFJLEVBQUUsUUFBUSxDQUFDLEdBQUcsQ0FBRSxVQUFBLENBQUMsSUFBSSxPQUFBLENBQUMsQ0FBQyxJQUFJLENBQUUsQ0FBQyxDQUFFLENBQUMsU0FBUyxFQUFyQixDQUFxQixDQUFFOzZCQUNuRCxFQUFBOzs7d0JBR0QsV0FBTyxHQUFHLENBQUMsSUFBSSxHQUFHLEVBQUUsTUFBTSxFQUFFLEdBQUcsRUFBRSxFQUFDOzs7O2FBRXpDLENBQUMsQ0FBQTtRQWFGLEdBQUcsQ0FBQyxNQUFNLENBQUMsdUJBQXVCLEVBQUUsVUFBTyxHQUFHLEVBQUUsSUFBSTs7Ozs7O3dCQUd0QyxJQUFJLEdBQUcsS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLElBQUksd0JBQXdCLENBQUM7d0JBQ25ELEtBQXVDLEtBQUssQ0FBQyxJQUFJLEVBQS9DLE1BQU0sWUFBQSxFQUFFLE9BQU8sYUFBQSxFQUFFLElBQUksVUFBQSxFQUFFLFNBQVMsZUFBQSxDQUFnQjt3QkFHekMsV0FBTyxLQUFhLENBQUM7Z0NBQ2hDLE1BQU0sRUFBRSxLQUFLO2dDQUNiLEdBQUcsRUFBRSxnRkFBOEUsTUFBTSxDQUFDLEdBQUcsQ0FBQyxFQUFFLGdCQUFXLE1BQU0sQ0FBQyxHQUFHLENBQUMsT0FBUzs2QkFDbEksQ0FBQyxFQUFBOzt3QkFISSxNQUFNLEdBQUcsU0FHYjt3QkFFSSxLQUE0QixNQUFNLENBQUMsSUFBSSxFQUFyQyxZQUFZLGtCQUFBLEVBQUUsT0FBTyxhQUFBLENBQWlCO3dCQUU5QyxJQUFLLE9BQU8sRUFBRzs0QkFDWCxNQUFNLGtCQUFrQixDQUFBO3lCQUMzQjt3QkFFSyxZQUFVLEVBQUcsQ0FBQzt3QkFDZCxhQUFXOzRCQUNiLElBQUksTUFBQTs0QkFDSixNQUFNLFFBQUE7NEJBQ04sU0FBUyxXQUFBOzRCQUNULE9BQU8sU0FBQTs0QkFDUCxXQUFXLEVBQUUsTUFBTSxDQUFDLHFCQUFxQixDQUFDLFNBQVM7NEJBQ25ELElBQUksRUFBRTtnQ0FFRixVQUFVLEVBQUU7b0NBQ1IsT0FBTyxFQUFFLElBQUksQ0FBQyxLQUFLO2lDQUN0QjtnQ0FFRCxVQUFVLEVBQUU7b0NBQ1IsT0FBTyxFQUFFLElBQUksQ0FBQyxJQUFJO2lDQUNyQjs2QkFDSjt5QkFDSixDQUFDO3dCQUVGLE1BQU0sQ0FBQyxJQUFJLENBQUUsVUFBUSxDQUFFLENBQUMsR0FBRyxDQUFFLFVBQUEsR0FBRzs0QkFDNUIsSUFBSyxDQUFDLENBQUMsVUFBUSxDQUFFLEdBQUcsQ0FBRSxFQUFFO2dDQUNwQixTQUFPLENBQUUsR0FBRyxDQUFFLEdBQUcsVUFBUSxDQUFFLEdBQUcsQ0FBRSxDQUFDOzZCQUNwQzt3QkFDTCxDQUFDLENBQUMsQ0FBQzt3QkFHVSxXQUFPLEtBQWEsQ0FBQztnQ0FDOUIsSUFBSSxFQUFFLFNBQU87Z0NBQ2IsTUFBTSxFQUFFLE1BQU07Z0NBQ2QsR0FBRyxFQUFFLGlGQUErRSxZQUFjOzZCQUNyRyxDQUFDLEVBQUE7O3dCQUpJLElBQUksR0FBRyxTQUlYO3dCQUVGLFdBQU8sR0FBRyxDQUFDLElBQUksR0FBRztnQ0FDZCxJQUFJLEVBQUUsSUFBSSxDQUFDLElBQUk7Z0NBQ2YsTUFBTSxFQUFFLEdBQUc7NkJBQ2QsRUFBQTs7O3dCQUdELFdBQU8sR0FBRyxDQUFDLElBQUksR0FBRyxFQUFFLE9BQU8sRUFBRSxJQUFDLEVBQUUsTUFBTSxFQUFFLEdBQUcsRUFBRSxFQUFBOzs7O2FBRXBELENBQUMsQ0FBQztRQU1ILEdBQUcsQ0FBQyxNQUFNLENBQUMsaUJBQWlCLEVBQUUsVUFBTyxHQUFHLEVBQUUsSUFBSTs7Ozs7Ozs7O3dCQUlsQyxXQUFPLEVBQVUsQ0FBQyxnQkFBZ0IsQ0FBQyxnQkFBZ0IsQ0FBQyxFQUFBOzt3QkFBcEQsU0FBb0QsQ0FBQzt3QkFDckQsV0FBTyxFQUFVLENBQUMsZ0JBQWdCLENBQUMsU0FBUyxDQUFDLEVBQUE7O3dCQUE3QyxTQUE2QyxDQUFDOzs7Ozs7d0JBRzlDLE1BQU0sR0FBRyxFQUFFLENBQUM7d0JBQ1IsSUFBSSxHQUFLLE1BQU0sQ0FBQyxJQUFJLEtBQWhCLENBQWlCO3dCQUN2QixNQUFNLEdBQUcsS0FBSyxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUM7d0JBQy9CLEtBQW1CLEtBQUssQ0FBQyxJQUFJLEVBQTNCLEdBQUcsU0FBQSxFQUFFLE9BQU8sYUFBQSxDQUFnQjt3QkFFOUIsTUFBTSxHQUFHLFVBQUEsT0FBTyxJQUFJLE9BQUEsQ0FBQzs0QkFDdkIsT0FBTyxTQUFBOzRCQUNQLE1BQU0sRUFBRSxHQUFHO3lCQUNkLENBQUMsRUFId0IsQ0FHeEIsQ0FBQzt3QkFFSCxJQUFJOzRCQUNNLFFBQVEsR0FBRyxNQUFNLENBQUMsY0FBYyxDQUFDLFFBQVEsRUFBRSxJQUFJLENBQUUsQ0FBQzs0QkFDbEQsU0FBUyxHQUFHLFFBQVEsQ0FBQyxNQUFNLENBQUUsR0FBRyxFQUFFLEtBQUssRUFBRSxNQUFNLENBQUUsQ0FBQzs0QkFDeEQsTUFBTSxHQUFHLFNBQVMsR0FBRyxRQUFRLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDO3lCQUMvQzt3QkFBQyxPQUFRLENBQUMsRUFBRzs0QkFDVixXQUFPLEdBQUcsQ0FBQyxJQUFJLEdBQUcsTUFBTSxDQUFDLFVBQVUsQ0FBQyxFQUFDO3lCQUN4Qzt3QkFFSyxLQUE2QyxNQUFNLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxFQUE1RCxXQUFXLFFBQUEsRUFBRSxPQUFPLFFBQUEsRUFBRSxTQUFTLFFBQUEsRUFBRSxLQUFLLFFBQUEsQ0FBdUI7d0JBRXJFLElBQUssTUFBTSxDQUFFLElBQUksQ0FBRSxHQUFHLE1BQU0sQ0FBRSxXQUFXLENBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLElBQUksRUFBRzs0QkFDM0QsV0FBTyxHQUFHLENBQUMsSUFBSSxHQUFHLE1BQU0sQ0FBQyxhQUFhLENBQUMsRUFBQzt5QkFDM0M7d0JBRUQsSUFBSyxPQUFPLEtBQUssTUFBTSxDQUFDLEdBQUcsQ0FBQyxFQUFFLEVBQUc7NEJBQzdCLFdBQU8sR0FBRyxDQUFDLElBQUksR0FBRyxNQUFNLENBQUMsV0FBVyxDQUFDLEVBQUM7eUJBQ3pDO3dCQUVELElBQUssU0FBUyxDQUFDLE9BQU8sQ0FBQyxNQUFNLEVBQUUsRUFBRSxDQUFDLEtBQUssT0FBTyxDQUFDLE9BQU8sQ0FBQyxNQUFNLEVBQUUsRUFBRSxDQUFDLEVBQUU7NEJBQ2hFLFdBQU8sR0FBRyxDQUFDLElBQUksR0FBRyxNQUFNLENBQUMsYUFBYSxDQUFDLEVBQUM7eUJBQzNDO3dCQVdjLFdBQU0sRUFBRSxDQUFDLFVBQVUsQ0FBQyxTQUFTLENBQUM7aUNBQ3hDLEtBQUssQ0FBQztnQ0FDSCxLQUFLLEVBQUUsT0FBTztnQ0FDZCxTQUFTLEVBQUUsV0FBVzs2QkFDekIsQ0FBQztpQ0FDRCxHQUFHLEVBQUcsRUFBQTs7d0JBTEwsTUFBTSxHQUFHLFNBS0o7d0JBQ0wsTUFBTSxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUUsQ0FBQyxDQUFFLENBQUM7NkJBRzNCLENBQUMsQ0FBQyxNQUFNLEVBQVIsZUFBUTs2QkFHSixDQUFBLE1BQU0sQ0FBQyxLQUFLLElBQUksQ0FBQyxDQUFBLEVBQWpCLGNBQWlCO3dCQUNsQixXQUFPLEdBQUcsQ0FBQyxJQUFJLEdBQUcsTUFBTSxDQUFDLGNBQWMsQ0FBQyxFQUFDOzRCQUl6QyxXQUFNLEVBQUUsQ0FBQyxVQUFVLENBQUMsU0FBUyxDQUFDOzZCQUN6QixHQUFHLENBQUUsTUFBTSxDQUFFLE1BQU0sQ0FBQyxHQUFHLENBQUUsQ0FBQzs2QkFDMUIsTUFBTSxDQUFDOzRCQUNKLElBQUksRUFBRTtnQ0FDRixLQUFLLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBRSxDQUFDLENBQUU7NkJBQ3BCO3lCQUNKLENBQUMsRUFBQTs7d0JBTk4sU0FNTSxDQUFDOzs7NkJBSVgsV0FBTSxFQUFFLENBQUMsVUFBVSxDQUFDLFNBQVMsQ0FBQzs2QkFDekIsR0FBRyxDQUFDOzRCQUNELElBQUksRUFBRTtnQ0FDRixLQUFLLEVBQUUsQ0FBQztnQ0FDUixLQUFLLEVBQUUsT0FBTztnQ0FDZCxTQUFTLEVBQUUsV0FBVzs2QkFDekI7eUJBQ0osQ0FBQyxFQUFBOzt3QkFQTixTQU9NLENBQUE7OzZCQUlZLFdBQU0sRUFBRSxDQUFDLFVBQVUsQ0FBQyxnQkFBZ0IsQ0FBQzs2QkFDdEQsS0FBSyxDQUFDOzRCQUNILE1BQU0sUUFBQTt5QkFDVCxDQUFDOzZCQUNELEdBQUcsRUFBRyxFQUFBOzt3QkFKTCxhQUFhLEdBQUcsU0FJWDt3QkFDTCxhQUFhLEdBQUcsYUFBYSxDQUFDLElBQUksQ0FBRSxDQUFDLENBQUUsQ0FBQzs2QkFFekMsQ0FBQyxhQUFhLEVBQWQsZUFBYzt3QkFDZixXQUFNLEVBQUUsQ0FBQyxVQUFVLENBQUMsZ0JBQWdCLENBQUM7aUNBQ2hDLEdBQUcsQ0FBQztnQ0FDRCxJQUFJLEVBQUU7b0NBQ0YsTUFBTSxRQUFBO29DQUNOLE9BQU8sRUFBRSxTQUFTO29DQUNsQixVQUFVLEVBQUUsTUFBTSxDQUFFLElBQUksQ0FBRTtpQ0FDN0I7NkJBQ0osQ0FBQyxFQUFBOzt3QkFQTixTQU9NLENBQUE7OzZCQUlWLFdBQU0sTUFBTSxFQUFHLEVBQUE7O3dCQUFmLFNBQWUsQ0FBQzt3QkFFaEIsV0FBTyxHQUFHLENBQUMsSUFBSSxHQUFHO2dDQUNkLE1BQU0sRUFBRSxHQUFHOzZCQUNkLEVBQUE7Ozt3QkFHRCxXQUFPLEdBQUcsQ0FBQyxJQUFJLEdBQUc7Z0NBQ2QsTUFBTSxFQUFFLEdBQUc7Z0NBQ1gsT0FBTyxFQUFFLFVBQVU7NkJBQ3RCLEVBQUE7Ozs7YUFFUixDQUFDLENBQUM7UUFNSCxHQUFHLENBQUMsTUFBTSxDQUFDLGtCQUFrQixFQUFFLFVBQU8sR0FBRyxFQUFFLElBQUk7Ozs7Ozt3QkFHbkMsY0FBWSxFQUFHLENBQUM7d0JBQ0osV0FBTSxFQUFFLENBQUMsVUFBVSxDQUFDLFlBQVksQ0FBQztpQ0FDNUMsS0FBSyxDQUFDLEVBQUcsQ0FBQztpQ0FDVixHQUFHLEVBQUcsRUFBQTs7d0JBRkwsT0FBTyxHQUFHLFNBRUw7d0JBRUwsSUFBSSxHQUFHLE9BQU8sQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFFLFVBQUEsSUFBSTs7NEJBQy9CLFdBQVMsR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDLEVBQUcsRUFBRSxXQUFTO2dDQUNwQyxHQUFFLElBQUksQ0FBQyxJQUFJLElBQUksSUFBSSxDQUFDLEtBQUs7b0NBQzNCLENBQUE7d0JBQ04sQ0FBQyxDQUFDLENBQUM7d0JBRUgsV0FBTyxHQUFHLENBQUMsSUFBSSxHQUFHO2dDQUNkLElBQUksRUFBRSxXQUFTO2dDQUNmLE1BQU0sRUFBRSxHQUFHOzZCQUNkLEVBQUE7Ozt3QkFHRCxXQUFPLEdBQUcsQ0FBQyxJQUFJLEdBQUc7Z0NBQ2QsTUFBTSxFQUFFLEdBQUc7NkJBQ2QsRUFBQTs7OzthQUVSLENBQUMsQ0FBQztRQVVILEdBQUcsQ0FBQyxNQUFNLENBQUMsbUJBQW1CLEVBQUUsVUFBTyxHQUFHLEVBQUUsSUFBSTs7Ozs7O3dCQUVoQyxZQUFZLEtBQUssQ0FBQyxJQUFJLFFBQWYsQ0FBZ0I7d0JBRS9CLFdBQU0sT0FBTyxDQUFDLEdBQUcsQ0FDYixNQUFNLENBQUMsSUFBSSxDQUFFLFNBQU8sQ0FBRTtpQ0FDakIsR0FBRyxDQUFFLFVBQU0sU0FBUzs7OztnREFDRCxXQUFNLEVBQUUsQ0FBQyxVQUFVLENBQUMsWUFBWSxDQUFDO2lEQUM1QyxLQUFLLENBQUM7Z0RBQ0gsSUFBSSxFQUFFLFNBQVM7NkNBQ2xCLENBQUM7aURBQ0QsR0FBRyxFQUFHLEVBQUE7OzRDQUpMLE9BQU8sR0FBRyxTQUlMOzRDQUVYLElBQUssQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFFLENBQUMsQ0FBRSxFQUFFO2dEQUFFLFdBQU87NkNBQUU7NENBRXBDLFdBQU0sRUFBRSxDQUFDLFVBQVUsQ0FBQyxZQUFZLENBQUM7cURBQzVCLEdBQUcsQ0FBRSxNQUFNLENBQUUsT0FBTyxDQUFDLElBQUksQ0FBRSxDQUFDLENBQUUsQ0FBQyxHQUFHLENBQUUsQ0FBQztxREFDckMsTUFBTSxDQUFDO29EQUNKLElBQUksRUFBRTt3REFDRixLQUFLLEVBQUUsU0FBTyxDQUFFLFNBQVMsQ0FBRTtxREFDOUI7aURBQ0osQ0FBQyxFQUFBOzs0Q0FOTixTQU1NLENBQUE7Ozs7aUNBQ1QsQ0FBQyxDQUNULEVBQUE7O3dCQW5CRCxTQW1CQyxDQUFDO3dCQUVGLFdBQU8sR0FBRyxDQUFDLElBQUksR0FBRztnQ0FDZCxNQUFNLEVBQUUsR0FBRzs2QkFDZCxFQUFBOzs7d0JBRUQsV0FBTyxHQUFHLENBQUMsSUFBSSxHQUFHO2dDQUNkLE1BQU0sRUFBRSxHQUFHOzZCQUNkLEVBQUE7Ozs7YUFFUixDQUFDLENBQUE7UUFVRixHQUFHLENBQUMsTUFBTSxDQUFDLGVBQWUsRUFBRSxVQUFPLEdBQUcsRUFBRSxJQUFJOzs7Ozs7d0JBRTlCLEtBQWtCLEtBQUssQ0FBQyxJQUFJLEVBQTFCLElBQUksVUFBQSxFQUFFLEtBQUssV0FBQSxDQUFnQjt3QkFDcEIsV0FBTSxLQUFLLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxZQUFZLENBQUM7Z0NBQ3BELElBQUksTUFBQTtnQ0FDSixLQUFLLEVBQUUsS0FBSyxJQUFJLEVBQUU7NkJBQ3JCLENBQUMsRUFBQTs7d0JBSEksTUFBTSxHQUFHLFNBR2I7d0JBRUYsSUFBSyxNQUFNLENBQUMsT0FBTyxLQUFLLENBQUMsRUFBRzs0QkFDeEIsTUFBTSxNQUFNLENBQUMsTUFBTSxDQUFBO3lCQUN0Qjt3QkFFRCxXQUFPLEdBQUcsQ0FBQyxJQUFJLEdBQUc7Z0NBQ2QsTUFBTSxFQUFFLEdBQUc7Z0NBQ1gsSUFBSSxFQUFFLE1BQU0sQ0FBQyxNQUFNOzZCQUN0QixFQUFBOzs7d0JBRUQsV0FBTyxHQUFHLENBQUMsSUFBSSxHQUFHO2dDQUNkLE1BQU0sRUFBRSxHQUFHO2dDQUNYLE9BQU8sRUFBRSxPQUFPLElBQUMsS0FBSyxRQUFRLENBQUMsQ0FBQyxDQUFDLElBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBRSxJQUFDLENBQUU7NkJBQzNELEVBQUE7Ozs7YUFFUixDQUFDLENBQUM7UUFlSCxHQUFHLENBQUMsTUFBTSxDQUFDLGVBQWUsRUFBRSxVQUFPLEdBQUcsRUFBRSxJQUFJOzs7Ozs7d0JBRTlCLE1BQU0sR0FBRyxLQUFLLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQzt3QkFDN0IsTUFBTSxHQUFLLEtBQUssQ0FBQyxJQUFJLE9BQWYsQ0FBZ0I7d0JBQ2hCLFdBQU0sRUFBRSxDQUFDLFVBQVUsQ0FBQyxnQkFBZ0IsQ0FBQztpQ0FDOUMsS0FBSyxDQUFDO2dDQUNILE1BQU0sUUFBQTs2QkFDVCxDQUFDO2lDQUNELEtBQUssRUFBRyxFQUFBOzt3QkFKUCxLQUFLLEdBQUcsU0FJRDt3QkFFRyxXQUFNLEVBQUUsQ0FBQyxVQUFVLENBQUMsVUFBVSxDQUFDO2lDQUMxQyxHQUFHLENBQUM7Z0NBQ0QsSUFBSSxFQUFFO29DQUNGLE1BQU0sUUFBQTtvQ0FDTixNQUFNLFFBQUE7b0NBQ04sVUFBVSxFQUFFLE1BQU0sQ0FBRSxJQUFJLENBQUU7b0NBQzFCLElBQUksRUFBRSxLQUFLLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxRQUFRO2lDQUMvQzs2QkFDSixDQUFDLEVBQUE7O3dCQVJBLE9BQU8sR0FBRyxTQVFWO3dCQUNOLEdBQUcsQ0FBQyxJQUFJLEdBQUc7NEJBQ1AsTUFBTSxFQUFFLEdBQUc7eUJBQ2QsQ0FBQTs7Ozt3QkFFRCxHQUFHLENBQUMsSUFBSSxHQUFHOzRCQUNQLE1BQU0sRUFBRSxHQUFHO3lCQUNkLENBQUE7Ozs7O2FBRVIsQ0FBQyxDQUFDO1FBYUgsR0FBRyxDQUFDLE1BQU0sQ0FBQyxlQUFlLEVBQUUsVUFBTyxHQUFHLEVBQUUsSUFBSTs7Ozs7O3dCQUdoQyxTQUFTLEdBQVEsRUFBRSxDQUFDO3dCQUNwQixNQUFNLEdBQUcsS0FBSyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUM7d0JBQzVCLEtBQWtCLEtBQUssQ0FBQyxJQUFJLEVBQTFCLElBQUksVUFBQSxFQUFFLEtBQUssV0FBQSxDQUFnQjt3QkFDN0IsTUFBTSxHQUFHLEtBQUssQ0FBQyxJQUFJLENBQUMsTUFBTSxJQUFJLEtBQUssQ0FBQyxJQUFJLENBQUMsTUFBTSxJQUFJLEtBQUssQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDO3dCQUN6RSxJQUFJLEdBQUcsS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLElBQUksd0JBQXdCLENBQUM7NkJBR3BELENBQUMsTUFBTSxFQUFQLGNBQU87d0JBQ00sV0FBTSxFQUFFLENBQUMsVUFBVSxDQUFDLFVBQVUsQ0FBQztpQ0FDeEMsS0FBSyxDQUFDO2dDQUNILE1BQU0sUUFBQTs2QkFDVCxDQUFDO2lDQUNELEtBQUssQ0FBRSxDQUFDLENBQUU7aUNBQ1YsR0FBRyxFQUFHLEVBQUE7O3dCQUxMLEtBQUssR0FBRyxTQUtIO3dCQUVYLElBQUssQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFFLENBQUMsQ0FBRSxFQUFFOzRCQUNuQixNQUFNLHVCQUFNLE1BQU0sc0NBQW9CLENBQUM7eUJBQzFDO3dCQUVELE1BQU0sR0FBRyxLQUFLLENBQUMsSUFBSSxDQUFFLENBQUMsQ0FBRSxDQUFDLE1BQU0sQ0FBQzt3QkFDaEMsU0FBUyxHQUFHLEtBQUssQ0FBQyxJQUFJLENBQUUsQ0FBQyxDQUFFLENBQUMsR0FBRyxDQUFDOzs7d0JBR2hDLGFBQVcsRUFBRyxDQUFDO3dCQUNuQixLQUFLLENBQUMsR0FBRyxDQUFDLFVBQUUsSUFBSSxFQUFFLEtBQUs7OzRCQUNuQixJQUFNLE9BQU8sR0FBRyxhQUFVLEtBQUssR0FBRyxDQUFDLENBQUUsQ0FBQzs0QkFDdEMsVUFBUSxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUMsRUFBRyxFQUFFLFVBQVE7Z0NBQ2xDLEdBQUUsT0FBTyxJQUFLO29DQUNWLEtBQUssRUFBRSxJQUFJO2lDQUNkO29DQUNILENBQUE7d0JBQ04sQ0FBQyxDQUFDLENBQUM7d0JBRUcsZ0JBQWdCLEdBQUc7NEJBQ3JCLElBQUksTUFBQTs0QkFDSixJQUFJLEVBQUUsVUFBUTs0QkFDZCxNQUFNLEVBQUUsTUFBTTs0QkFDZCxVQUFVLEVBQUUsTUFBTSxDQUFDLGFBQWEsQ0FBRSxJQUFJLENBQUUsQ0FBQyxLQUFLO3lCQUNqRCxDQUFDO3dCQUVGLE9BQU8sQ0FBQyxHQUFHLENBQUMsT0FBTyxFQUFFLGdCQUFnQixDQUFFLENBQUM7d0JBRTFCLFdBQU0sS0FBSyxDQUFDLE9BQU8sQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDO2dDQUNsRCxNQUFNLEVBQUUsTUFBTTtnQ0FDZCxnQkFBZ0Isa0JBQUE7NkJBQ25CLENBQUMsRUFBQTs7d0JBSEksS0FBSyxHQUFHLFNBR1o7d0JBRUYsSUFBSyxNQUFNLENBQUUsS0FBSyxDQUFDLE9BQU8sQ0FBRSxLQUFLLEdBQUcsRUFBRzs0QkFDbkMsTUFBTSxLQUFLLENBQUMsTUFBTSxDQUFDO3lCQUN0Qjs2QkFHSSxDQUFDLENBQUMsU0FBUyxFQUFYLGNBQVc7Ozs7d0JBRVIsV0FBTSxFQUFFLENBQUMsVUFBVSxDQUFDLFVBQVUsQ0FBQztpQ0FDMUIsR0FBRyxDQUFFLFNBQVMsQ0FBRTtpQ0FDaEIsTUFBTSxFQUFHLEVBQUE7O3dCQUZkLFNBRWMsQ0FBQzs7Ozs7NEJBSXZCLFdBQU8sR0FBRyxDQUFDLElBQUksR0FBRzs0QkFDZCxNQUFNLEVBQUUsR0FBRzt5QkFDZCxFQUFDOzs7d0JBR0YsV0FBTyxHQUFHLENBQUMsSUFBSSxHQUFHO2dDQUNkLE1BQU0sRUFBRSxHQUFHO2dDQUNYLE9BQU8sRUFBRSxPQUFPLElBQUMsS0FBSyxRQUFRLENBQUMsQ0FBQyxDQUFDLElBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBRSxJQUFDLENBQUU7NkJBQzNELEVBQUE7Ozs7YUFFUixDQUFDLENBQUM7UUFNSCxHQUFHLENBQUMsTUFBTSxDQUFDLHFCQUFxQixFQUFFLFVBQU8sR0FBRyxFQUFFLElBQUk7Ozs7Ozt3QkFHM0IsV0FBTyxLQUFhLENBQUM7Z0NBQ2hDLE1BQU0sRUFBRSxLQUFLO2dDQUNiLEdBQUcsRUFBRSxnRkFBOEUsTUFBTSxDQUFDLEdBQUcsQ0FBQyxFQUFFLGdCQUFXLE1BQU0sQ0FBQyxHQUFHLENBQUMsT0FBUzs2QkFDbEksQ0FBQyxFQUFBOzt3QkFISSxNQUFNLEdBQUcsU0FHYjt3QkFFSSxLQUE0QixNQUFNLENBQUMsSUFBSSxFQUFyQyxZQUFZLGtCQUFBLEVBQUUsT0FBTyxhQUFBLENBQWlCO3dCQUU5QyxJQUFLLE9BQU8sRUFBRzs0QkFDWCxNQUFNLGtCQUFrQixDQUFBO3lCQUMzQjt3QkFFRyxTQUFTLEdBQVEsRUFBRSxDQUFDO3dCQUNwQixNQUFNLEdBQUcsS0FBSyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUM7d0JBQzVCLEtBQWtCLEtBQUssQ0FBQyxJQUFJLEVBQTFCLElBQUksVUFBQSxFQUFFLEtBQUssV0FBQSxDQUFnQjt3QkFDN0IsTUFBTSxHQUFHLEtBQUssQ0FBQyxJQUFJLENBQUMsTUFBTSxJQUFJLEtBQUssQ0FBQyxJQUFJLENBQUMsTUFBTSxJQUFJLEtBQUssQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDO3dCQUN6RSxJQUFJLEdBQUcsS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLElBQUksd0JBQXdCLENBQUM7NkJBSXBELENBQUMsTUFBTSxFQUFQLGNBQU87d0JBQ00sV0FBTSxFQUFFLENBQUMsVUFBVSxDQUFDLFVBQVUsQ0FBQztpQ0FDeEMsS0FBSyxDQUFDO2dDQUNILE1BQU0sUUFBQTtnQ0FDTixNQUFNLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQywwQkFBMEIsQ0FBQzs2QkFDNUMsQ0FBQztpQ0FDRCxPQUFPLENBQUMsWUFBWSxFQUFFLEtBQUssQ0FBQztpQ0FDNUIsS0FBSyxDQUFFLENBQUMsQ0FBRTtpQ0FDVixHQUFHLEVBQUcsRUFBQTs7d0JBUEwsS0FBSyxHQUFHLFNBT0g7d0JBRVgsSUFBSyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUUsQ0FBQyxDQUFFLEVBQUU7NEJBQ25CLE1BQU0sdUJBQU0sTUFBTSxzQ0FBb0IsQ0FBQzt5QkFDMUM7d0JBRUQsTUFBTSxHQUFHLEtBQUssQ0FBQyxJQUFJLENBQUUsQ0FBQyxDQUFFLENBQUMsTUFBTSxDQUFDO3dCQUNoQyxTQUFTLEdBQUcsS0FBSyxDQUFDLElBQUksQ0FBRSxDQUFDLENBQUUsQ0FBQyxHQUFHLENBQUM7Ozt3QkFHaEMsYUFBVyxFQUFHLENBQUM7d0JBQ25CLEtBQUssQ0FBQyxHQUFHLENBQUMsVUFBRSxJQUFJLEVBQUUsS0FBSzs7NEJBQ25CLElBQU0sT0FBTyxHQUFHLGFBQVUsS0FBSyxHQUFHLENBQUMsQ0FBRSxDQUFDOzRCQUN0QyxVQUFRLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQyxFQUFHLEVBQUUsVUFBUTtnQ0FDbEMsR0FBRSxPQUFPLElBQUs7b0NBQ1YsS0FBSyxFQUFFLElBQUk7aUNBQ2Q7b0NBQ0gsQ0FBQTt3QkFDTixDQUFDLENBQUMsQ0FBQzt3QkFFRyxrQkFBa0IsR0FBRzs0QkFDdkIsSUFBSSxNQUFBOzRCQUNKLElBQUksRUFBRSxVQUFROzRCQUNkLE9BQU8sRUFBRSxNQUFNOzRCQUNmLFdBQVcsRUFBRSxNQUFNLENBQUMsYUFBYSxDQUFFLElBQUksQ0FBRSxDQUFDLEtBQUs7eUJBQ2xELENBQUM7d0JBRUYsT0FBTyxDQUFDLEdBQUcsQ0FBQyxPQUFPLEVBQUUsa0JBQWtCLENBQUUsQ0FBQzt3QkFFcEMsT0FBTyxHQUFHOzRCQUNaLE1BQU0sRUFBRSxNQUFNOzRCQUNkLGtCQUFrQixvQkFBQTt5QkFDckIsQ0FBQTt3QkFHWSxXQUFPLEtBQWEsQ0FBQztnQ0FDOUIsSUFBSSxFQUFFLE9BQU87Z0NBQ2IsTUFBTSxFQUFFLE1BQU07Z0NBQ2QsR0FBRyxFQUFFLHlGQUF1RixZQUFjOzZCQUM3RyxDQUFDLEVBQUE7O3dCQUpJLElBQUksR0FBRyxTQUlYO3dCQUVGLElBQUssTUFBTSxDQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFFLEtBQUssR0FBRyxFQUFHOzRCQUN2QyxNQUFNLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDO3lCQUMxQjs2QkFHSSxDQUFDLENBQUMsU0FBUyxFQUFYLGNBQVc7Ozs7d0JBRVIsV0FBTSxFQUFFLENBQUMsVUFBVSxDQUFDLFVBQVUsQ0FBQztpQ0FDMUIsR0FBRyxDQUFFLFNBQVMsQ0FBRTtpQ0FDaEIsTUFBTSxFQUFHLEVBQUE7O3dCQUZkLFNBRWMsQ0FBQzs7Ozs7NEJBSXZCLFdBQU8sR0FBRyxDQUFDLElBQUksR0FBRzs0QkFDZCxJQUFJLEVBQUUsSUFBSSxDQUFDLElBQUk7NEJBQ2YsTUFBTSxFQUFFLEdBQUc7eUJBQ2QsRUFBQTs7O3dCQUlELFdBQU8sR0FBRyxDQUFDLElBQUksR0FBRztnQ0FDZCxNQUFNLEVBQUUsR0FBRztnQ0FDWCxPQUFPLEVBQUUsT0FBTyxJQUFDLEtBQUssUUFBUSxDQUFDLENBQUMsQ0FBQyxJQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUUsSUFBQyxDQUFFOzZCQUMzRCxFQUFBOzs7O2FBRVIsQ0FBQyxDQUFBO1FBWUYsR0FBRyxDQUFDLE1BQU0sQ0FBQyxnQkFBZ0IsRUFBRSxVQUFRLEdBQUcsRUFBRSxJQUFJOzs7Ozs7d0JBRWhDLEtBQWtCLEtBQUssQ0FBQyxJQUFJLEVBQTFCLElBQUksVUFBQSxFQUFFLEtBQUssV0FBQSxDQUFnQjt3QkFDN0IsTUFBTSxHQUFHLEtBQUssQ0FBQyxJQUFJLENBQUMsTUFBTSxJQUFJLEtBQUssQ0FBQyxJQUFJLENBQUMsTUFBTSxJQUFJLEtBQUssQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDO3dCQUN6RSxJQUFJLEdBQUcsS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLElBQUksd0JBQXdCLENBQUM7d0JBQ25ELGFBQVcsTUFBTSxDQUFDLG1CQUFtQixDQUFFLElBQUksQ0FBRSxDQUFDO3dCQUVoRCxhQUFXLEVBQUcsQ0FBQzt3QkFDbkIsS0FBSyxDQUFDLEdBQUcsQ0FBQyxVQUFFLElBQUksRUFBRSxDQUFDOzs0QkFDZixVQUFRLHlCQUNELFVBQVEsZ0JBQ1QsVUFBUSxDQUFDLFFBQVEsQ0FBRSxDQUFDLENBQUUsSUFBRztnQ0FDdkIsS0FBSyxFQUFFLElBQUk7NkJBQ2QsTUFDSixDQUFDO3dCQUNOLENBQUMsQ0FBQyxDQUFDO3dCQUVHLGFBQWEsR0FBRzs0QkFDbEIsSUFBSSxNQUFBOzRCQUNKLElBQUksRUFBRSxVQUFROzRCQUNkLE1BQU0sRUFBRSxNQUFNOzRCQUNkLFVBQVUsRUFBRSxVQUFRLENBQUMsRUFBRTt5QkFDMUIsQ0FBQzt3QkFFRixPQUFPLENBQUMsR0FBRyxDQUFDLFNBQVMsRUFBRSxhQUFhLENBQUUsQ0FBQzt3QkFFekIsV0FBTSxLQUFLLENBQUMsT0FBTyxDQUFDLGdCQUFnQixDQUFDLElBQUksQ0FBRSxhQUFhLENBQUUsRUFBQTs7d0JBQWxFLEtBQUssR0FBRyxTQUEwRDt3QkFFeEUsSUFBSyxNQUFNLENBQUUsS0FBSyxDQUFDLE9BQU8sQ0FBRSxLQUFLLEdBQUcsRUFBRzs0QkFDbkMsTUFBTSxLQUFLLENBQUMsTUFBTSxDQUFDO3lCQUN0Qjt3QkFFRCxXQUFPLEdBQUcsQ0FBQyxJQUFJLEdBQUc7Z0NBQ2QsTUFBTSxFQUFFLEdBQUc7NkJBQ2QsRUFBQTs7O3dCQUVELE9BQU8sQ0FBQyxHQUFHLENBQUMsTUFBTSxFQUFFLElBQUMsQ0FBRSxDQUFDO3dCQUN4QixXQUFPLEdBQUcsQ0FBQyxJQUFJLEdBQUc7Z0NBQ2QsTUFBTSxFQUFFLEdBQUc7Z0NBQ1gsSUFBSSxFQUFFLElBQUM7NkJBQ1YsRUFBQzs7OzthQUVULENBQUMsQ0FBQTtRQU1GLEdBQUcsQ0FBQyxNQUFNLENBQUMsc0JBQXNCLEVBQUUsVUFBTyxHQUFHLEVBQUUsSUFBSTs7Ozs7O3dCQUVyQyxLQUFrQixLQUFLLENBQUMsSUFBSSxFQUExQixJQUFJLFVBQUEsRUFBRSxLQUFLLFdBQUEsQ0FBZ0I7d0JBQzdCLE1BQU0sR0FBRyxLQUFLLENBQUMsSUFBSSxDQUFDLE1BQU0sSUFBSSxLQUFLLENBQUMsSUFBSSxDQUFDLE1BQU0sSUFBSSxLQUFLLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQzt3QkFDekUsSUFBSSxHQUFHLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxJQUFJLHdCQUF3QixDQUFDO3dCQUNuRCxhQUFXLE1BQU0sQ0FBQyxtQkFBbUIsQ0FBRSxJQUFJLENBQUUsQ0FBQzt3QkFFaEQsYUFBVyxFQUFHLENBQUM7d0JBQ25CLEtBQUssQ0FBQyxHQUFHLENBQUMsVUFBRSxJQUFJLEVBQUUsQ0FBQzs7NEJBQ2YsVUFBUSx5QkFDRCxVQUFRLGdCQUNULFVBQVEsQ0FBQyxRQUFRLENBQUUsQ0FBQyxDQUFFLElBQUc7Z0NBQ3ZCLEtBQUssRUFBRSxJQUFJOzZCQUNkLE1BQ0osQ0FBQzt3QkFDTixDQUFDLENBQUMsQ0FBQzt3QkFFRyxhQUFhLEdBQUc7NEJBQ2xCLElBQUksTUFBQTs0QkFDSixJQUFJLEVBQUUsVUFBUTs0QkFDZCxNQUFNLEVBQUUsTUFBTTs0QkFDZCxXQUFXLEVBQUUsVUFBUSxDQUFDLEVBQUU7eUJBQzNCLENBQUM7d0JBR2EsV0FBTyxLQUFhLENBQUM7Z0NBQ2hDLE1BQU0sRUFBRSxLQUFLO2dDQUNiLEdBQUcsRUFBRSxnRkFBOEUsTUFBTSxDQUFDLEdBQUcsQ0FBQyxFQUFFLGdCQUFXLE1BQU0sQ0FBQyxHQUFHLENBQUMsT0FBUzs2QkFDbEksQ0FBQyxFQUFBOzt3QkFISSxNQUFNLEdBQUcsU0FHYjt3QkFFSSxLQUE0QixNQUFNLENBQUMsSUFBSSxFQUFyQyxZQUFZLGtCQUFBLEVBQUUsT0FBTyxhQUFBLENBQWlCO3dCQUU5QyxJQUFLLE9BQU8sRUFBRzs0QkFDWCxNQUFNLGtCQUFrQixDQUFBO3lCQUMzQjt3QkFFRCxPQUFPLENBQUMsR0FBRyxDQUFDLFlBQVksRUFBRSxhQUFhLENBQUUsQ0FBQzt3QkFFN0IsV0FBTyxLQUFhLENBQUM7Z0NBQzlCLElBQUksRUFBRSxhQUFhO2dDQUNuQixNQUFNLEVBQUUsTUFBTTtnQ0FDZCxHQUFHLEVBQUUsMkVBQXlFLFlBQWM7NkJBQy9GLENBQUMsRUFBQTs7d0JBSkksSUFBSSxHQUFHLFNBSVg7d0JBRUYsT0FBTyxDQUFDLEdBQUcsQ0FBQyxZQUFZLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBRSxDQUFDO3dCQUN0QyxJQUFLLE1BQU0sQ0FBRSxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBRSxLQUFLLEdBQUcsRUFBRzs0QkFDdkMsTUFBTSxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQzt5QkFDMUI7d0JBRUQsV0FBTyxHQUFHLENBQUMsSUFBSSxHQUFHO2dDQUNkLE1BQU0sRUFBRSxHQUFHOzZCQUNkLEVBQUE7Ozt3QkFFRCxXQUFPLEdBQUcsQ0FBQyxJQUFJLEdBQUc7Z0NBQ2QsTUFBTSxFQUFFLEdBQUc7Z0NBQ1gsSUFBSSxFQUFFLElBQUM7NkJBQ1YsRUFBQzs7OzthQUVULENBQUMsQ0FBQztRQWtCSCxHQUFHLENBQUMsTUFBTSxDQUFDLGNBQWMsRUFBRSxVQUFPLEdBQUcsRUFBRSxJQUFJOzs7Ozs7d0JBRTdCLE1BQU0sR0FBRyxLQUFLLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQzt3QkFDL0IsS0FBZ0IsS0FBSyxDQUFDLElBQUksRUFBeEIsSUFBSSxVQUFBLEVBQUUsR0FBRyxTQUFBLENBQWdCO3dCQUlsQixXQUFNLEVBQUUsQ0FBQyxVQUFVLENBQUMsY0FBYyxDQUFDO2lDQUM3QyxLQUFLLENBQUM7Z0NBQ0gsR0FBRyxLQUFBO2dDQUNILE1BQU0sUUFBQTtnQ0FDTixTQUFTLEVBQUUsS0FBSzs2QkFDbkIsQ0FBQztpQ0FDRCxLQUFLLEVBQUcsRUFBQTs7d0JBTlAsTUFBTSxHQUFHLFNBTUY7d0JBRWIsSUFBSyxNQUFNLENBQUMsS0FBSyxHQUFHLENBQUMsRUFBRzs0QkFDcEIsV0FBTyxHQUFHLENBQUMsSUFBSSxHQUFHLEVBQUUsTUFBTSxFQUFFLEdBQUcsRUFBRSxFQUFDO3lCQUNyQzt3QkFHRCxJQUFLLE1BQU0sS0FBSyxJQUFJLEVBQUc7NEJBQ25CLFdBQU8sR0FBRyxDQUFDLElBQUksR0FBRyxFQUFFLE1BQU0sRUFBRSxHQUFHLEVBQUUsRUFBQzt5QkFDckM7d0JBR2UsV0FBTSxFQUFFLENBQUMsVUFBVSxDQUFDLGNBQWMsQ0FBQztpQ0FDOUMsS0FBSyxDQUFDO2dDQUNILEdBQUcsS0FBQTtnQ0FDSCxNQUFNLFFBQUE7Z0NBQ04sU0FBUyxFQUFFLElBQUk7Z0NBQ2YsV0FBVyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUUsTUFBTSxDQUFFLElBQUksQ0FBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLElBQUksQ0FBRTs2QkFDN0QsQ0FBQztpQ0FDRCxLQUFLLEVBQUcsRUFBQTs7d0JBUFAsT0FBTyxHQUFHLFNBT0g7d0JBRWIsSUFBSyxPQUFPLENBQUMsS0FBSyxHQUFHLENBQUMsRUFBRzs0QkFDckIsV0FBTyxHQUFHLENBQUMsSUFBSSxHQUFHLEVBQUUsTUFBTSxFQUFFLEdBQUcsRUFBRSxFQUFDO3lCQUNyQzt3QkFHZSxXQUFNLEVBQUUsQ0FBQyxVQUFVLENBQUMsY0FBYyxDQUFDO2lDQUM5QyxHQUFHLENBQUM7Z0NBQ0QsSUFBSSxFQUFFO29DQUNGLEdBQUcsS0FBQTtvQ0FDSCxJQUFJLE1BQUE7b0NBQ0osTUFBTSxRQUFBO29DQUNOLFNBQVMsRUFBRSxLQUFLO29DQUNoQixVQUFVLEVBQUUsTUFBTSxDQUFFLElBQUksQ0FBRTtpQ0FDN0I7NkJBQ0osQ0FBQyxFQUFBOzt3QkFUQSxPQUFPLEdBQUcsU0FTVjt3QkFFTixXQUFPLEdBQUcsQ0FBQyxJQUFJLEdBQUcsRUFBRSxNQUFNLEVBQUUsR0FBRyxFQUFFLEVBQUM7Ozt3QkFHbEMsV0FBTyxHQUFHLENBQUMsSUFBSSxHQUFHO2dDQUNkLE1BQU0sRUFBRSxHQUFHOzZCQUNkLEVBQUE7Ozs7YUFFUixDQUFDLENBQUE7UUFTRixHQUFHLENBQUMsTUFBTSxDQUFDLGVBQWUsRUFBRSxVQUFRLEdBQUcsRUFBRSxJQUFJOzs7Ozs7d0JBRTdCLFFBQVEsR0FBSyxLQUFLLENBQUMsSUFBSSxTQUFmLENBQWdCO3dCQUMxQixNQUFNLEdBQUcsS0FBSyxDQUFDLElBQUksQ0FBQyxNQUFNLElBQUksS0FBSyxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUM7d0JBQzVDLFdBQU0sRUFBRSxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUM7aUNBQ3BDLEtBQUssQ0FBQztnQ0FDSCxNQUFNLFFBQUE7NkJBQ1QsQ0FBQztpQ0FDRCxHQUFHLEVBQUcsRUFBQTs7d0JBSkwsS0FBSyxHQUFHLFNBSUg7d0JBQ0wsSUFBSSxHQUFHLEtBQUssQ0FBQyxJQUFJLENBQUUsQ0FBQyxDQUFFLENBQUM7d0JBRXZCLEdBQUcsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO3dCQUNqQyxRQUFRLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLGFBQWEsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQzt3QkFFdEQsV0FBTyxHQUFHLENBQUMsSUFBSSxHQUFHO2dDQUNkLE1BQU0sRUFBRSxHQUFHO2dDQUNYLElBQUksRUFBRSxDQUFDLFFBQVEsQ0FBQyxDQUFDO29DQUNiLFFBQVEsQ0FBQyxDQUFDO29DQUNWO3dDQUNJLEdBQUcsS0FBQTt3Q0FDSCxRQUFRLFVBQUE7cUNBQ1g7NkJBQ1IsRUFBQTs7O3dCQUdELFdBQU8sR0FBRyxDQUFDLElBQUksR0FBRyxFQUFFLE1BQU0sRUFBRSxHQUFHLEVBQUUsRUFBQzs7OzthQUV6QyxDQUFDLENBQUE7UUFVRixHQUFHLENBQUMsTUFBTSxDQUFDLG1CQUFtQixFQUFFLFVBQVEsR0FBRyxFQUFFLElBQUk7Ozs7Ozt3QkFFbkMsS0FBaUIsS0FBSyxDQUFDLElBQUksRUFBekIsSUFBSSxVQUFBLEVBQUUsZ0JBQUksQ0FBZ0I7d0JBQzVCLFdBQVMsS0FBSyxDQUFDLElBQUksQ0FBQyxNQUFNLElBQUksS0FBSyxDQUFDLElBQUksQ0FBQyxNQUFNLElBQUksS0FBSyxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUM7d0JBRTVELFdBQU0sT0FBTyxDQUFDLEdBQUcsQ0FDaEMsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUM7aUNBQ1YsR0FBRyxDQUFFLFVBQUEsR0FBRztnQ0FDTCxPQUFPLEVBQUUsQ0FBQyxVQUFVLENBQUMscUJBQXFCLENBQUM7cUNBQ3RDLEtBQUssQ0FBQztvQ0FDSCxHQUFHLEtBQUE7b0NBQ0gsSUFBSSxRQUFBO29DQUNKLE1BQU0sVUFBQTtpQ0FDVCxDQUFDO3FDQUNELEdBQUcsRUFBRyxDQUFDOzRCQUNoQixDQUFDLENBQUMsQ0FDVCxFQUFBOzt3QkFYSyxLQUFLLEdBQVEsU0FXbEI7d0JBRUssSUFBSSxHQUFHLEtBQUs7NkJBQ2IsTUFBTSxDQUFFLFVBQUEsQ0FBQyxJQUFJLE9BQUEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUUsQ0FBQyxDQUFFLEVBQWIsQ0FBYSxDQUFDOzZCQUMzQixHQUFHLENBQUUsVUFBQSxDQUFDLElBQUksT0FBQSxDQUFDLENBQUMsSUFBSSxDQUFFLENBQUMsQ0FBRSxFQUFYLENBQVcsQ0FBQyxDQUFDO3dCQUU1QixXQUFPLEdBQUcsQ0FBQyxJQUFJLEdBQUc7Z0NBQ2QsSUFBSSxFQUFFLElBQUk7Z0NBQ1YsTUFBTSxFQUFFLEdBQUc7NkJBQ2QsRUFBQTs7O3dCQUdELFdBQU8sR0FBRyxDQUFDLElBQUksR0FBRztnQ0FDZCxNQUFNLEVBQUUsR0FBRzs2QkFDZCxFQUFBOzs7O2FBRVIsQ0FBQyxDQUFBO1FBV0YsR0FBRyxDQUFDLE1BQU0sQ0FBQyxzQkFBc0IsRUFBRSxVQUFRLEdBQUcsRUFBRSxJQUFJOzs7Ozs7d0JBRXRDLEtBQWlCLEtBQUssQ0FBQyxJQUFJLEVBQXpCLEdBQUcsU0FBQSxFQUFFLEtBQUssV0FBQSxDQUFnQjt3QkFDNUIsTUFBTSxHQUFHLEtBQUssQ0FBQyxJQUFJLENBQUMsTUFBTSxJQUFJLEtBQUssQ0FBQyxJQUFJLENBQUMsTUFBTSxJQUFJLEtBQUssQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDO3dCQUUvRSxJQUFLLENBQUMsS0FBSyxFQUFHOzRCQUNWLFdBQU8sR0FBRyxDQUFDLElBQUksR0FBRztvQ0FDZCxNQUFNLEVBQUUsR0FBRztpQ0FDZCxFQUFBO3lCQUNKO3dCQUdlLFdBQU0sRUFBRSxDQUFDLFVBQVUsQ0FBQyxxQkFBcUIsQ0FBQztpQ0FDakQsS0FBSyxDQUFDO2dDQUNILEdBQUcsS0FBQTtnQ0FDSCxNQUFNLFFBQUE7Z0NBQ04sSUFBSSxFQUFFLGVBQWU7NkJBQ3hCLENBQUM7aUNBQ0QsR0FBRyxFQUFHLEVBQUE7O3dCQU5ULE9BQU8sR0FBRyxTQU1EO3dCQUNULE1BQU0sR0FBRyxPQUFPLENBQUMsSUFBSSxDQUFFLENBQUMsQ0FBRSxDQUFDOzZCQUU1QixDQUFBLENBQUMsQ0FBQyxNQUFNLElBQUksQ0FBQyxDQUFDLEtBQUssQ0FBQSxFQUFuQixjQUFtQjt3QkFDcEIsV0FBTSxFQUFFLENBQUMsVUFBVSxDQUFDLHFCQUFxQixDQUFDO2lDQUNyQyxHQUFHLENBQUUsTUFBTSxDQUFFLE1BQU0sQ0FBQyxHQUFHLENBQUUsQ0FBQztpQ0FDMUIsTUFBTSxDQUFDO2dDQUNKLElBQUksRUFBRTtvQ0FDRixLQUFLLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBRSxLQUFLLENBQUU7aUNBQ3hCOzZCQUNKLENBQUMsRUFBQTs7d0JBTk4sU0FNTSxDQUFDOzs7NkJBQ0MsQ0FBQSxDQUFDLE1BQU0sSUFBSSxDQUFDLENBQUMsS0FBSyxDQUFBLEVBQWxCLGNBQWtCO3dCQUMxQixXQUFNLEVBQUUsQ0FBQyxVQUFVLENBQUMscUJBQXFCLENBQUM7aUNBQ3JDLEdBQUcsQ0FBQztnQ0FDRCxJQUFJLEVBQUU7b0NBQ0YsR0FBRyxLQUFBO29DQUNILE1BQU0sUUFBQTtvQ0FDTixLQUFLLE9BQUE7b0NBQ0wsSUFBSSxFQUFFLGVBQWU7aUNBQ3hCOzZCQUNKLENBQUMsRUFBQTs7d0JBUk4sU0FRTSxDQUFDOzs0QkFJRyxXQUFNLEVBQUUsQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDOzZCQUNwQyxLQUFLLENBQUM7NEJBQ0gsTUFBTSxRQUFBO3lCQUNULENBQUM7NkJBQ0QsR0FBRyxFQUFHLEVBQUE7O3dCQUpMLEtBQUssR0FBRyxTQUlIO3dCQUVMLElBQUksR0FBRyxLQUFLLENBQUMsSUFBSSxDQUFFLENBQUMsQ0FBRSxDQUFDO3dCQUM3QixXQUFNLEVBQUUsQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDO2lDQUN0QixHQUFHLENBQUUsTUFBTSxDQUFFLElBQUksQ0FBQyxHQUFHLENBQUUsQ0FBQztpQ0FDeEIsTUFBTSxDQUFDO2dDQUNKLElBQUksRUFBRTtvQ0FDRixhQUFhLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBRSxDQUFDLEtBQUssQ0FBRTtpQ0FDakM7NkJBQ0osQ0FBQyxFQUFBOzt3QkFOTixTQU1NLENBQUE7d0JBRU4sV0FBTyxHQUFHLENBQUMsSUFBSSxHQUFHO2dDQUNkLE1BQU0sRUFBRSxHQUFHOzZCQUNkLEVBQUE7Ozt3QkFHRCxXQUFPLEdBQUcsQ0FBQyxJQUFJLEdBQUc7Z0NBQ2QsTUFBTSxFQUFFLEdBQUc7NkJBQ2QsRUFBQTs7OzthQUVSLENBQUMsQ0FBQTtRQVNGLEdBQUcsQ0FBQyxNQUFNLENBQUMsU0FBUyxFQUFFLFVBQVEsR0FBRyxFQUFFLElBQUk7Ozs7Ozt3QkFFdkIsR0FBRyxHQUFLLEtBQUssQ0FBQyxJQUFJLElBQWYsQ0FBZ0I7d0JBQ3JCLE1BQU0sR0FBRyxLQUFLLENBQUMsSUFBSSxDQUFDLE1BQU0sSUFBSSxLQUFLLENBQUMsSUFBSSxDQUFDLE1BQU0sSUFBSSxLQUFLLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQzt3QkFFakUsV0FBTSxFQUFFLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQztpQ0FDcEMsS0FBSyxDQUFDO2dDQUNILE1BQU0sUUFBQTs2QkFDVCxDQUFDO2lDQUNELEdBQUcsRUFBRyxFQUFBOzt3QkFKTCxLQUFLLEdBQUcsU0FJSDt3QkFFTCxJQUFJLEdBQUcsS0FBSyxDQUFDLElBQUksQ0FBRSxDQUFDLENBQUUsSUFBSSxJQUFJLENBQUM7d0JBRXJDLElBQUssQ0FBQyxJQUFJLEVBQUc7NEJBQUUsV0FBTyxHQUFHLENBQUMsSUFBSSxHQUFHLEVBQUUsTUFBTSxFQUFFLEdBQUcsRUFBRSxFQUFBO3lCQUFDO3dCQUFBLENBQUM7d0JBRTVDLE1BQU0sR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDO3dCQUNsQixJQUFJLHlCQUNILElBQUksS0FDUCxHQUFHLEVBQUUsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLEdBQUcsR0FBRyxHQUN4QyxDQUFDO3dCQUVGLE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO3dCQUVILFdBQU0sRUFBRSxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUM7aUNBQ3RDLEdBQUcsQ0FBRSxNQUFNLENBQUUsTUFBTSxDQUFFLENBQUM7aUNBQ3RCLEdBQUcsQ0FBQztnQ0FDRCxJQUFJLEVBQUUsSUFBSTs2QkFDYixDQUFDLEVBQUE7O3dCQUpBLE9BQU8sR0FBRyxTQUlWO3dCQUVOLFdBQU8sR0FBRyxDQUFDLElBQUksR0FBRztnQ0FDZCxNQUFNLEVBQUUsR0FBRzs2QkFDZCxFQUFDOzs7d0JBR0YsV0FBTyxHQUFHLENBQUMsSUFBSSxHQUFHLEVBQUUsTUFBTSxFQUFFLEdBQUcsRUFBRSxFQUFDOzs7O2FBRXpDLENBQUMsQ0FBQTtRQVNGLEdBQUcsQ0FBQyxNQUFNLENBQUMsY0FBYyxFQUFFLFVBQVEsR0FBRyxFQUFFLElBQUk7Ozs7Ozt3QkFFNUIsUUFBUSxHQUFLLEtBQUssQ0FBQyxJQUFJLFNBQWYsQ0FBZ0I7d0JBQzFCLE1BQU0sR0FBRyxLQUFLLENBQUMsSUFBSSxDQUFDLE1BQU0sSUFBSSxLQUFLLENBQUMsSUFBSSxDQUFDLE1BQU0sSUFBSSxLQUFLLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQzt3QkFFakUsV0FBTSxFQUFFLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQztpQ0FDcEMsS0FBSyxDQUFDO2dDQUNILE1BQU0sUUFBQTs2QkFDVCxDQUFDO2lDQUNELEdBQUcsRUFBRyxFQUFBOzt3QkFKTCxLQUFLLEdBQUcsU0FJSDt3QkFFTCxJQUFJLEdBQUcsS0FBSyxDQUFDLElBQUksQ0FBRSxDQUFDLENBQUUsSUFBSSxJQUFJLENBQUM7d0JBRXJDLElBQUssQ0FBQyxJQUFJLEVBQUc7NEJBQUUsV0FBTyxHQUFHLENBQUMsSUFBSSxHQUFHLEVBQUUsTUFBTSxFQUFFLEdBQUcsRUFBRSxFQUFBO3lCQUFDO3dCQUFBLENBQUM7d0JBRTVDLE1BQU0sR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDO3dCQUNsQixJQUFJLHlCQUNILElBQUksS0FDUCxhQUFhLEVBQUUsQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLENBQUM7Z0NBQ2hDLFFBQVEsQ0FBQyxDQUFDO2dDQUNWLE1BQU0sQ0FBQyxDQUFFLElBQUksQ0FBQyxhQUFhLEdBQUcsUUFBUSxDQUFFLENBQUMsT0FBTyxDQUFFLENBQUMsQ0FBRSxDQUFDLEdBQzdELENBQUM7d0JBRUYsT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7d0JBRUgsV0FBTSxFQUFFLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQztpQ0FDdEMsR0FBRyxDQUFFLE1BQU0sQ0FBRSxNQUFNLENBQUUsQ0FBQztpQ0FDdEIsR0FBRyxDQUFDO2dDQUNELElBQUksRUFBRSxJQUFJOzZCQUNiLENBQUMsRUFBQTs7d0JBSkEsT0FBTyxHQUFHLFNBSVY7d0JBRU4sV0FBTyxHQUFHLENBQUMsSUFBSSxHQUFHO2dDQUNkLE1BQU0sRUFBRSxHQUFHOzZCQUNkLEVBQUM7Ozt3QkFHRixXQUFPLEdBQUcsQ0FBQyxJQUFJLEdBQUcsRUFBRSxNQUFNLEVBQUUsR0FBRyxFQUFFLEVBQUM7Ozs7YUFFekMsQ0FBQyxDQUFBO1FBY0YsR0FBRyxDQUFDLE1BQU0sQ0FBQyxtQkFBbUIsRUFBRSxVQUFRLEdBQUcsRUFBRSxJQUFJOzs7Ozs7d0JBRW5DLE1BQU0sR0FBRyxLQUFLLENBQUMsSUFBSSxDQUFDLE1BQU0sSUFBSSxLQUFLLENBQUMsSUFBSSxDQUFDLE1BQU0sSUFBSSxLQUFLLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQzt3QkFDekUsS0FBNkUsS0FBSyxDQUFDLElBQUksRUFBckYsT0FBTyxhQUFBLEVBQUUsWUFBWSxrQkFBQSxFQUFFLGFBQWEsbUJBQUEsRUFBRSxhQUFhLG1CQUFBLEVBQUUsaUJBQWlCLHVCQUFBLENBQWdCO3dCQUdoRixXQUFNLEtBQUssQ0FBQyxZQUFZLENBQUM7Z0NBQ25DLElBQUksRUFBRSxRQUFRO2dDQUNkLElBQUksRUFBRTtvQ0FDRixJQUFJLEVBQUUsZ0JBQWdCO29DQUN0QixJQUFJLEVBQUU7d0NBQ0YsTUFBTSxRQUFBO3dDQUNOLElBQUksRUFBRSxTQUFTO3dDQUNmLElBQUksRUFBRSxnQkFBZ0I7d0NBQ3RCLEtBQUssRUFBRSxDQUFDLDZCQUFPLFlBQVksbUNBQU8sRUFBRSx1RUFBYyxhQUFhLGlCQUFJLENBQUM7cUNBQ3ZFO2lDQUNKOzZCQUNKLENBQUMsRUFBQTs7d0JBWEksS0FBSyxHQUFHLFNBV1o7d0JBR2MsV0FBTSxFQUFFLENBQUMsVUFBVSxDQUFDLFlBQVksQ0FBQztpQ0FDNUMsR0FBRyxDQUFDO2dDQUNELElBQUksRUFBRTtvQ0FDRixNQUFNLFFBQUE7b0NBQ04sS0FBSyxFQUFFLENBQUMsNkJBQU8sT0FBTyx1QkFBSyxFQUFFLHFEQUFXLGlCQUFpQixpQkFBSSxDQUFDO29DQUM5RCxRQUFRLEVBQUUsTUFBTSxDQUFFLElBQUksQ0FBRSxHQUFHLEdBQUcsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLElBQUk7b0NBQy9DLElBQUksRUFBRSxVQUFVO29DQUNoQixJQUFJLEVBQUUsY0FBYztpQ0FDdkI7NkJBQ0osQ0FBQyxFQUFBOzt3QkFUQSxPQUFPLEdBQUcsU0FTVjt3QkFFTixXQUFPLEdBQUcsQ0FBQyxJQUFJLEdBQUcsRUFBRSxNQUFNLEVBQUUsR0FBRyxFQUFFLEVBQUM7Ozt3QkFHbEMsV0FBTyxHQUFHLENBQUMsSUFBSSxHQUFHLEVBQUUsTUFBTSxFQUFFLEdBQUcsRUFBRSxFQUFDOzs7O2FBRXpDLENBQUMsQ0FBQTtRQU1GLEdBQUcsQ0FBQyxNQUFNLENBQUMseUJBQXlCLEVBQUUsVUFBUSxHQUFHLEVBQUUsSUFBSTs7Z0JBQ25ELElBQUk7b0JBQ0EsV0FBTyxHQUFHLENBQUMsSUFBSSxHQUFHOzRCQUNkLE1BQU0sRUFBRSxHQUFHOzRCQUNYLElBQUksRUFBRSxNQUFNLENBQUMsbUJBQW1CO3lCQUNuQyxFQUFDO2lCQUNMO2dCQUFDLE9BQVEsQ0FBQyxFQUFHO29CQUNWLFdBQU8sR0FBRyxDQUFDLElBQUksR0FBRyxFQUFFLE1BQU0sRUFBRSxHQUFHLEVBQUUsRUFBQztpQkFDckM7OzthQUNKLENBQUMsQ0FBQTtRQU1GLEdBQUcsQ0FBQyxNQUFNLENBQUMsZUFBZSxFQUFFLFVBQVEsR0FBRyxFQUFFLElBQUk7Ozs7Ozt3QkFFL0IsTUFBTSxHQUFHLEtBQUssQ0FBQyxJQUFJLENBQUMsTUFBTSxJQUFJLEtBQUssQ0FBQyxJQUFJLENBQUMsTUFBTSxJQUFJLEtBQUssQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDO3dCQUNqRSxXQUFNLEVBQUUsQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDO2lDQUNwQyxLQUFLLENBQUM7Z0NBQ0gsTUFBTSxRQUFBOzZCQUNULENBQUM7aUNBQ0QsR0FBRyxFQUFHLEVBQUE7O3dCQUpMLEtBQUssR0FBRyxTQUlIO3dCQUVMLElBQUksR0FBRyxLQUFLLENBQUMsSUFBSSxDQUFFLENBQUMsQ0FBRSxJQUFJLElBQUksQ0FBQzs2QkFHaEMsQ0FBQyxDQUFDLElBQUksRUFBTixjQUFNO3dCQUVNLFdBQU0sRUFBRSxDQUFDLFVBQVUsQ0FBQyxnQkFBZ0IsQ0FBQztpQ0FDN0MsS0FBSyxDQUFDLENBQUM7Z0NBQ0osTUFBTSxFQUFFLElBQUksQ0FBQyxNQUFNOzZCQUN0QixDQUFDLENBQUM7aUNBQ0YsS0FBSyxFQUFHLEVBQUE7O3dCQUpQLElBQUksR0FBRyxTQUlBO3dCQUViLFdBQU8sR0FBRyxDQUFDLElBQUksR0FBRztnQ0FDZCxJQUFJLHdCQUNHLElBQUksS0FDUCxJQUFJLEVBQUUsSUFBSSxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUMvQjtnQ0FDRCxNQUFNLEVBQUUsR0FBRzs2QkFDZCxFQUFBOzRCQUdELFdBQU8sR0FBRyxDQUFDLElBQUksR0FBRzs0QkFDZCxJQUFJLEVBQUUsSUFBSTs0QkFDVixNQUFNLEVBQUUsR0FBRzt5QkFDZCxFQUFBOzs7O3dCQUdMLFdBQU8sR0FBRyxDQUFDLElBQUksR0FBRztnQ0FDZCxNQUFNLEVBQUUsR0FBRztnQ0FDWCxJQUFJLEVBQUUsSUFBQzs2QkFDVixFQUFBOzs7O2FBRVIsQ0FBQyxDQUFBO1FBTUYsR0FBRyxDQUFDLE1BQU0sQ0FBQyxNQUFNLEVBQUUsVUFBUSxHQUFHLEVBQUUsSUFBSTs7Ozs7O3dCQUl0QixPQUFPLEdBQUcsTUFBTSxFQUFHLENBQUM7d0JBQ3BCLENBQUMsR0FBRyxPQUFPLENBQUMsV0FBVyxFQUFHLENBQUM7d0JBQzNCLENBQUMsR0FBRyxPQUFPLENBQUMsUUFBUSxFQUFHLEdBQUcsQ0FBQyxDQUFDO3dCQUM1QixDQUFDLEdBQUcsT0FBTyxDQUFDLE9BQU8sRUFBRyxDQUFDO3dCQUN2QixhQUFhLEdBQUcsSUFBSSxJQUFJLENBQUksQ0FBQyxTQUFJLENBQUMsU0FBSSxDQUFDLGNBQVcsQ0FBQyxDQUFDO3dCQUNwRCxTQUFPLGFBQWEsQ0FBQyxPQUFPLEVBQUcsR0FBRyxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxJQUFJLENBQUM7d0JBR25DLFdBQU0sRUFBRSxDQUFDLFVBQVUsQ0FBQyxzQkFBc0IsQ0FBQztpQ0FDOUQsS0FBSyxDQUFDO2dDQUNILFNBQVMsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFFLE1BQUksQ0FBRTs2QkFDM0IsQ0FBQztpQ0FDRCxLQUFLLENBQUM7Z0NBQ0gsR0FBRyxFQUFFLElBQUk7NkJBQ1osQ0FBQztpQ0FDRCxHQUFHLEVBQUcsRUFBQTs7d0JBUEwsZUFBZSxHQUFHLFNBT2I7d0JBQ0wsY0FBYyxHQUFHLGVBQWUsQ0FBQyxJQUFJLENBQUM7d0JBR3hDLFdBQVMsRUFBRSxDQUFDO3dCQUNaLFdBQVMsQ0FBQyxDQUFDO3dCQUNmLGNBQWMsQ0FBQyxNQUFNLENBQUMsVUFBRSxHQUFHLEVBQUUsTUFBTTs0QkFDL0IsR0FBRyxDQUFFLE1BQU0sQ0FBQyxHQUFHLENBQUUsR0FBRyxDQUFDLEdBQUcsQ0FBRSxNQUFNLENBQUMsR0FBRyxDQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFFLE1BQU0sQ0FBQyxHQUFHLENBQUUsR0FBRyxDQUFDLENBQUM7NEJBQ25FLElBQUssR0FBRyxDQUFFLE1BQU0sQ0FBQyxHQUFHLENBQUUsR0FBRyxRQUFNLEVBQUc7Z0NBQzlCLFFBQU0sR0FBRyxNQUFNLENBQUMsR0FBRyxDQUFDO2dDQUNwQixRQUFNLEdBQUcsR0FBRyxDQUFFLE1BQU0sQ0FBQyxHQUFHLENBQUUsQ0FBQzs2QkFDOUI7NEJBQ0QsT0FBTyxHQUFHLENBQUM7d0JBQ2YsQ0FBQyxFQUFFLEVBQUcsQ0FBQyxDQUFDO3dCQUdSLElBQUssQ0FBQyxRQUFNLElBQUksQ0FBQyxRQUFNLEVBQUc7NEJBQ3RCLFdBQU8sR0FBRyxDQUFDLElBQUksR0FBRyxFQUFFLE1BQU0sRUFBRSxHQUFHLEVBQUUsRUFBQTt5QkFDcEM7d0JBQUEsQ0FBQzt3QkFHYSxXQUFNLEVBQUUsQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDO2lDQUN0QyxLQUFLLENBQUM7Z0NBQ0gsVUFBVSxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUUsTUFBSSxDQUFFOzZCQUM1QixDQUFDO2lDQUNELEtBQUssQ0FBQztnQ0FDSCxHQUFHLEVBQUUsSUFBSTs2QkFDWixDQUFDO2lDQUNELEtBQUssQ0FBRSxDQUFDLENBQUU7aUNBQ1YsR0FBRyxFQUFHLEVBQUE7O3dCQVJMLE1BQU0sR0FBRyxTQVFKO3dCQUNMLFVBQVEsTUFBTSxDQUFDLElBQUksQ0FBRSxDQUFDLENBQUUsQ0FBQzt3QkFFL0IsSUFBSyxNQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sS0FBSyxDQUFDLEVBQUc7NEJBQzVCLFdBQU8sR0FBRyxDQUFDLElBQUksR0FBRyxFQUFFLE1BQU0sRUFBRSxHQUFHLEVBQUUsRUFBQTt5QkFDcEM7d0JBRVcsV0FBTSxFQUFFLENBQUMsVUFBVSxDQUFDLGVBQWUsQ0FBQztpQ0FDM0MsS0FBSyxDQUFDO2dDQUNILEdBQUcsRUFBRSxRQUFNO2dDQUNYLEdBQUcsRUFBRSxPQUFLLENBQUMsR0FBRzs2QkFDakIsQ0FBQztpQ0FDRCxLQUFLLENBQUM7Z0NBQ0gsSUFBSSxFQUFFLElBQUk7NkJBQ2IsQ0FBQztpQ0FDRCxHQUFHLEVBQUcsRUFBQTs7d0JBUkwsR0FBRyxHQUFHLFNBUUQ7d0JBQ0wsT0FBSyxHQUFHLENBQUMsSUFBSSxDQUFFLENBQUMsQ0FBRSxDQUFDO3dCQUV6QixJQUFLLEdBQUcsQ0FBQyxJQUFJLENBQUMsTUFBTSxLQUFLLENBQUMsRUFBRzs0QkFDekIsV0FBTyxHQUFHLENBQUMsSUFBSSxHQUFHLEVBQUUsTUFBTSxFQUFFLEdBQUcsRUFBRSxFQUFBO3lCQUNwQzt3QkFHYSxXQUFNLEVBQUUsQ0FBQyxVQUFVLENBQUMsZ0JBQWdCLENBQUM7aUNBQzlDLEtBQUssQ0FBQyxFQUFHLENBQUM7aUNBQ1YsR0FBRyxFQUFHLEVBQUE7O3dCQUZMLEtBQUssR0FBRyxTQUVIO3dCQUdHLFdBQU0sRUFBRSxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUM7aUNBQ3JDLEdBQUcsQ0FBRSxNQUFNLENBQUUsUUFBTSxDQUFFLENBQUM7aUNBQ3RCLEtBQUssQ0FBQztnQ0FDSCxLQUFLLEVBQUUsSUFBSTs2QkFDZCxDQUFDO2lDQUNELEdBQUcsRUFBRyxFQUFBOzt3QkFMTCxVQUFRLFNBS0g7d0JBR1gsV0FBTSxPQUFPLENBQUMsR0FBRyxDQUNiLEtBQUssQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFFLFVBQU0sR0FBRzs7O2dEQUNyQixXQUFNLEtBQUssQ0FBQyxZQUFZLENBQUM7Z0RBQ3JCLElBQUksRUFBRSxRQUFRO2dEQUNkLElBQUksRUFBRTtvREFDRixJQUFJLEVBQUUsZ0JBQWdCO29EQUN0QixJQUFJLEVBQUU7d0RBQ0YsTUFBTSxFQUFFLEdBQUcsQ0FBQyxNQUFNO3dEQUNsQixJQUFJLEVBQUUsU0FBUzt3REFDZixJQUFJLEVBQUUsdUNBQXFDLE9BQUssQ0FBQyxHQUFLO3dEQUN0RCxLQUFLLEVBQUUsQ0FBQyx1QkFBTSxRQUFNLGdDQUFPLElBQUUsQ0FBQyxJQUFJLENBQUMsTUFBTSwyQkFBTSxJQUFFLENBQUMsSUFBSSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFFLEVBQUUsS0FBRyxPQUFLLENBQUMsSUFBSSxDQUFDLEtBQU8sQ0FBQztxREFDOUc7aURBQ0o7NkNBQ0osQ0FBQyxFQUFBOzs0Q0FYRixTQVdFLENBQUM7NENBQ0gsV0FBTTs7O2lDQUNULENBQUMsQ0FDTCxFQUFBOzt3QkFoQkQsU0FnQkMsQ0FBQzt3QkFFRixXQUFPLEdBQUcsQ0FBQyxJQUFJLEdBQUc7Z0NBQ2QsTUFBTSxFQUFFLEdBQUc7NkJBQ2QsRUFBQTs7O3dCQUVELFdBQU8sR0FBRyxDQUFDLElBQUksR0FBRztnQ0FDZCxNQUFNLEVBQUUsR0FBRztnQ0FDWCxJQUFJLEVBQUUsSUFBQzs2QkFDVixFQUFDOzs7O2FBRVQsQ0FBQyxDQUFBO1FBRUYsV0FBTyxHQUFHLENBQUMsS0FBSyxFQUFHLEVBQUM7O0tBRXZCLENBQUE7QUFFRCxJQUFNLElBQUksR0FBRyxVQUFBLEVBQUUsSUFBSSxPQUFBLElBQUksT0FBTyxDQUFFLFVBQUEsT0FBTztJQUNuQyxVQUFVLENBQUMsY0FBTyxPQUFBLE9BQU8sRUFBRyxFQUFWLENBQVUsRUFBRSxFQUFFLENBQUUsQ0FBQztBQUN2QyxDQUFDLENBQUMsRUFGaUIsQ0FFakIsQ0FBQTtBQUtGLElBQU0sTUFBTSxHQUFHLGNBQU8sT0FBQSxJQUFJLE9BQU8sQ0FBRSxVQUFNLE9BQU87Ozs7Ozs7OztnQkFLOUIsV0FBVyxHQUFHLE1BQU0sQ0FBQyxXQUFXLENBQUM7Z0JBQ3ZDLFdBQU0sT0FBTyxDQUFDLEdBQUcsQ0FDYixXQUFXLENBQUMsR0FBRyxDQUFFLFVBQUEsY0FBYyxJQUFJLE9BQUMsRUFBVSxDQUFDLGdCQUFnQixDQUFFLGNBQWMsQ0FBRSxFQUE5QyxDQUE4QyxDQUFDLENBQ3JGLEVBQUE7O2dCQUZELFNBRUMsQ0FBQzs7Ozs7b0JBR04sV0FBTSxJQUFJLENBQUUsR0FBRyxDQUFFLEVBQUE7O2dCQUFqQixTQUFpQixDQUFDOzs7O2dCQUlSLElBQUksR0FBRyxNQUFNLENBQUMsR0FBRyxDQUFDO2dCQUN4QixXQUFNLE9BQU8sQ0FBQyxHQUFHLENBQ2IsSUFBSSxDQUFDLEdBQUcsQ0FBRSxVQUFNLE1BQU07Ozs7d0NBRUMsV0FBTSxFQUFFLENBQUMsVUFBVSxDQUFDLEtBQUssQ0FBQzt5Q0FDeEMsS0FBSyxDQUFDO3dDQUNILE1BQU0sRUFBRSxNQUFNLENBQUMsTUFBTTtxQ0FDeEIsQ0FBQzt5Q0FDRCxHQUFHLEVBQUcsRUFBQTs7b0NBSkwsVUFBVSxHQUFHLFNBSVI7b0NBRUwsU0FBUyxHQUFHLFVBQVUsQ0FBQyxJQUFJLENBQUUsQ0FBQyxDQUFFLENBQUM7eUNBQ2xDLENBQUMsQ0FBQyxTQUFTLEVBQVgsY0FBVztvQ0FDWixXQUFNLEVBQUUsQ0FBQyxVQUFVLENBQUMsS0FBSyxDQUFDOzZDQUNyQixHQUFHLENBQUUsTUFBTSxDQUFFLFNBQVMsQ0FBQyxHQUFHLENBQUUsQ0FBQzs2Q0FDN0IsR0FBRyxDQUFDOzRDQUNELElBQUksRUFBRSxNQUFNO3lDQUNmLENBQUMsRUFBQTs7b0NBSk4sU0FJTSxDQUFDOzt3Q0FHUCxXQUFNLEVBQUUsQ0FBQyxVQUFVLENBQUMsS0FBSyxDQUFDO3lDQUNyQixHQUFHLENBQUM7d0NBQ0QsSUFBSSxFQUFFLE1BQU07cUNBQ2YsQ0FBQyxFQUFBOztvQ0FITixTQUdNLENBQUM7Ozs7O3lCQUVkLENBQUMsQ0FDTCxFQUFBOztnQkF4QkQsU0F3QkMsQ0FBQzs7OztnQkFFRixPQUFPLENBQUMsR0FBRyxDQUFDLEtBQUssRUFBRSxJQUFDLENBQUUsQ0FBQzs7OztnQkFLakIsT0FBTyxHQUFHLE1BQU0sQ0FBQyxRQUFRLENBQUM7Z0JBQ2hDLFdBQU0sT0FBTyxDQUFDLEdBQUcsQ0FDYixPQUFPLENBQUMsR0FBRyxDQUFFLFVBQU0sSUFBSTs7Ozt3Q0FDQyxXQUFNLEVBQUUsQ0FBQyxVQUFVLENBQUMsWUFBWSxDQUFDO3lDQUNoRCxLQUFLLENBQUM7d0NBQ0gsSUFBSSxFQUFFLElBQUksQ0FBQyxJQUFJO3FDQUNsQixDQUFDO3lDQUNELEdBQUcsRUFBRyxFQUFBOztvQ0FKTCxXQUFXLEdBQUcsU0FJVDtvQ0FFTCxVQUFVLEdBQUcsV0FBVyxDQUFDLElBQUksQ0FBRSxDQUFDLENBQUUsQ0FBQzt5Q0FDcEMsQ0FBQyxDQUFDLFVBQVUsRUFBWixjQUFZOzt3Q0FTYixXQUFNLEVBQUUsQ0FBQyxVQUFVLENBQUMsWUFBWSxDQUFDO3lDQUM1QixHQUFHLENBQUM7d0NBQ0QsSUFBSSxFQUFFLElBQUk7cUNBQ2IsQ0FBQyxFQUFBOztvQ0FITixTQUdNLENBQUM7Ozs7O3lCQUVkLENBQUMsQ0FDTCxFQUFBOztnQkF4QkQsU0F3QkMsQ0FBQzs7OztnQkFFRixPQUFPLENBQUMsR0FBRyxDQUFDLEtBQUssRUFBRSxJQUFDLENBQUUsQ0FBQzs7O2dCQUczQixPQUFPLEVBQUcsQ0FBQzs7OztnQkFFQyxPQUFPLEVBQUcsQ0FBQzs7Ozs7S0FDOUIsQ0FBQyxFQWhGb0IsQ0FnRnBCLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBjbG91ZCBmcm9tICd3eC1zZXJ2ZXItc2RrJztcbmltcG9ydCAqIGFzIFRjYlJvdXRlciBmcm9tICd0Y2Itcm91dGVyJztcbmltcG9ydCAqIGFzIGF4aW9zIGZyb20gJ2F4aW9zJztcbmltcG9ydCAqIGFzIGNyeXB0byBmcm9tICdjcnlwdG8nO1xuaW1wb3J0ICogYXMgcnAgZnJvbSAncmVxdWVzdC1wcm9taXNlJztcbmltcG9ydCAqIGFzIENPTkZJRyBmcm9tICcuL2NvbmZpZyc7XG5cbmNsb3VkLmluaXQoe1xuICAgIGVudjogcHJvY2Vzcy5lbnYuY2xvdWRcbn0pO1xuXG5jb25zdCBkYjogREIuRGF0YWJhc2UgPSBjbG91ZC5kYXRhYmFzZSggKTtcbmNvbnN0IF8gPSBkYi5jb21tYW5kO1xuXG4vKiogXG4gKiDovazmjaLmoLzmnpflsLzmsrvml7bljLogKzjml7bljLpcbiAqIERhdGUoKS5ub3coKSAvIG5ldyBEYXRlKCkuZ2V0VGltZSgpIOaYr+aXtuS4jeaXtuato+W4uOeahCs4XG4gKiBEYXRlLnRvTG9jYWxTdHJpbmcoICkg5aW95YOP5piv5LiA55u05pivKzDnmoRcbiAqIOWFiOaLv+WIsCArMO+8jOeEtuWQjis4XG4gKi9cbmNvbnN0IGdldE5vdyA9ICggdHMgPSBmYWxzZSApOiBhbnkgPT4ge1xuICAgIGlmICggdHMgKSB7XG4gICAgICAgIHJldHVybiBEYXRlLm5vdyggKTtcbiAgICB9XG4gICAgY29uc3QgdGltZV8wID0gbmV3IERhdGUoIG5ldyBEYXRlKCApLnRvTG9jYWxlU3RyaW5nKCApKTtcbiAgICByZXR1cm4gbmV3IERhdGUoIHRpbWVfMC5nZXRUaW1lKCApICsgOCAqIDYwICogNjAgKiAxMDAwIClcbn1cbi8qKlxuICogQGRlc2NyaXB0aW9uIFxuICog5YWs5YWx5qih5Z2XXG4gKi9cbmV4cG9ydCBjb25zdCBtYWluID0gYXN5bmMgKCBldmVudCwgY29udGV4dCApID0+IHtcblxuICAgIGNvbnN0IGFwcCA9IG5ldyBUY2JSb3V0ZXIoeyBldmVudCB9KTtcblxuICAgIC8qKlxuICAgICAqIEBkZXNjcmlwdGlvblxuICAgICAqIOWIneWni+WMluWQhOS4quaVsOaNruW6k1xuICAgICAqL1xuICAgIGFwcC5yb3V0ZXIoJ2luaXQnLCBhc3luYyggY3R4LCBuZXh0ICkgPT4ge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgY29uc3QgY29sbGVjdGlvbnMgPSBDT05GSUcuY29sbGVjdGlvbnM7XG4gICAgICAgICAgICBhd2FpdCBQcm9taXNlLmFsbChbXG4gICAgICAgICAgICAgICAgY29sbGVjdGlvbnMubWFwKCBjb2xsZWN0aW9uTmFtZSA9PiAoZGIgYXMgYW55KS5jcmVhdGVDb2xsZWN0aW9uKCBjb2xsZWN0aW9uTmFtZSApKVxuICAgICAgICAgICAgXSlcblxuICAgICAgICAgICAgcmV0dXJuIGN0eC5ib2R5ID0geyBzdGF0dXM6IDIwMCB9XG4gICAgICAgIH0gY2F0Y2ggKCBlICkge1xuICAgICAgICAgICAgcmV0dXJuIGN0eC5ib2R5ID0geyBzdGF0dXM6IDUwMCwgbWVzc2FnZTogZSB9XG4gICAgICAgIH1cbiAgICB9KVxuXG4gICAgLyoqXG4gICAgICogQGRlc2NyaXB0aW9uIFxuICAgICAqIOaVsOaNruWtl+WFuFxuICAgICAqIHtcbiAgICAgKiAgICAgIGRpY05hbWU6ICd4eHgseXl5LHp6eidcbiAgICAgKiAgICAgIGZpbHRlckJqcDogZmFsc2UgfCB0cnVlIHwgdW5kZWZpbmVkIO+8iCDmmK/lkKbov4fmu6Tkv53lgaXlk4Eg77yJXG4gICAgICogfVxuICAgICAqL1xuICAgIGFwcC5yb3V0ZXIoJ2RpYycsIGFzeW5jKCBjdHgsIG5leHQgKSA9PiB7XG4gICAgICAgIHRyeSB7XG5cbiAgICAgICAgICAgIC8vIOS/neWBpeWTgemFjee9rlxuICAgICAgICAgICAgbGV0IGJqcENvbmZpZzogYW55ID0gbnVsbDtcbiAgICAgICAgICAgIGNvbnN0IHsgZGljTmFtZSwgZmlsdGVyQmpwIH0gPSBldmVudC5kYXRhO1xuICAgICAgICAgICAgY29uc3QgZGJSZXMgPSBhd2FpdCBkYi5jb2xsZWN0aW9uKCdkaWMnKVxuICAgICAgICAgICAgICAgIC53aGVyZSh7XG4gICAgICAgICAgICAgICAgICAgIGJlbG9uZzogZGIuUmVnRXhwKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlZ2V4cDogZGljTmFtZS5yZXBsYWNlKC9cXCwvZywgJ3wnKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIG9wdGlvbmQ6ICdpJ1xuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLmdldCggKTtcblxuICAgICAgICAgICAgLy8g5L+d5YGl5ZOB6YWN572uXG4gICAgICAgICAgICBpZiAoICEhZmlsdGVyQmpwICkge1xuICAgICAgICAgICAgICAgIGNvbnN0IGJqcENvbmZpZyQgPSBhd2FpdCBkYi5jb2xsZWN0aW9uKCdhcHAtY29uZmlnJylcbiAgICAgICAgICAgICAgICAgICAgLndoZXJlKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6ICdhcHAtYmpwLXZpc2libGUnXG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgIC5nZXQoICk7XG4gICAgICAgICAgICAgICAgYmpwQ29uZmlnID0gYmpwQ29uZmlnJC5kYXRhWyAwIF07XG4gICAgICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICAgICAgbGV0IHJlc3VsdCA9IHsgfTtcbiAgICAgICAgICAgIGRiUmVzLmRhdGEubWFwKCBkaWMgPT4ge1xuICAgICAgICAgICAgICAgIHJlc3VsdCA9IE9iamVjdC5hc3NpZ24oeyB9LCByZXN1bHQsIHtcbiAgICAgICAgICAgICAgICAgICAgWyBkaWMuYmVsb25nIF06IGRpY1sgZGljLmJlbG9uZyBdXG4gICAgICAgICAgICAgICAgICAgICAgICAuZmlsdGVyKCB4ID0+ICEheCApXG4gICAgICAgICAgICAgICAgICAgICAgICAuZmlsdGVyKCB4ID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoICEhYmpwQ29uZmlnICYmICFianBDb25maWcudmFsdWUgKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBTdHJpbmcoIHgudmFsdWUgKSAhPT0gJzQnXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICByZXR1cm4gY3R4LmJvZHkgPSB7XG4gICAgICAgICAgICAgICAgc3RhdHVzOiAyMDAsXG4gICAgICAgICAgICAgICAgZGF0YTogcmVzdWx0XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgIH0gY2F0Y2ggKCBlICkge1xuICAgICAgICAgICAgcmV0dXJuIGN0eC5ib2R5ID0ge1xuICAgICAgICAgICAgICAgIHN0YXR1czogNTAwLFxuICAgICAgICAgICAgICAgIG1lc3NhZ2U6IGVcbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgIC8qKlxuICAgICAqIEBkZXNjcmlwdGlvblxuICAgICAqIOW+ruS/oeeUqOaIt+S/oeaBr+WtmOWCqFxuICAgICAqL1xuICAgIGFwcC5yb3V0ZXIoJ3VzZXJFZGl0JywgYXN5bmMoIGN0eCwgbmV4dCApID0+IHtcbiAgICAgICAgdHJ5IHtcblxuICAgICAgICAgICAgY29uc3Qgb3BlbmlkID0gZXZlbnQudXNlckluZm8ub3BlbklkO1xuICAgICAgICAgICAgY29uc3QgZGF0YSQgPSBhd2FpdCBkYi5jb2xsZWN0aW9uKCd1c2VyJylcbiAgICAgICAgICAgICAgICAud2hlcmUoe1xuICAgICAgICAgICAgICAgICAgICBvcGVuaWRcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIC5nZXQoIClcbiAgICAgICAgICAgICAgICAuY2F0Y2goIGVyciA9PiB7IHRocm93IGAke2Vycn1gfSk7XG4gICAgICAgIFxuICAgICAgICAgICAgLy8g5aaC5p6c5LiN5a2Y5Zyo77yM5YiZ5Yib5bu6XG4gICAgICAgICAgICBpZiAoIGRhdGEkLmRhdGEubGVuZ3RoID09PSAwICkge1xuICAgICAgICBcbiAgICAgICAgICAgICAgICBhd2FpdCBkYi5jb2xsZWN0aW9uKCd1c2VyJylcbiAgICAgICAgICAgICAgICAgICAgLmFkZCh7XG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRhOiBPYmplY3QuYXNzaWduKHsgfSwgZXZlbnQuZGF0YSwgeyBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvcGVuaWQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaW50ZWdyYWw6IDAsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcHVzaF9pbnRlZ3JhbDogMFxuICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgfSkuY2F0Y2goIGVyciA9PiB7IHRocm93IGAke2Vycn1gfSk7XG4gICAgICAgIFxuICAgICAgICAgICAgLy8g5aaC5p6c5a2Y5Zyo77yM5YiZ5pu05pawXG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGNvbnN0IG1ldGEgPSBPYmplY3QuYXNzaWduKHsgfSwgZGF0YSQuZGF0YVsgMCBdLCBldmVudC5kYXRhICk7XG4gICAgICAgICAgICAgICAgZGVsZXRlIG1ldGEuX2lkO1xuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIGF3YWl0IGRiLmNvbGxlY3Rpb24oJ3VzZXInKS5kb2MoKCBkYXRhJC5kYXRhWyAwIF0gYXMgYW55KS5faWQgKVxuICAgICAgICAgICAgICAgICAgICAuc2V0KHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRhdGE6IE9iamVjdC5hc3NpZ24oeyB9LCBtZXRhLCB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaW50ZWdyYWw6IGRhdGEkLmRhdGFbIDAgXS5pbnRlZ3JhbFxuICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgfSkuY2F0Y2goIGVyciA9PiB7IHRocm93IGAke2Vycn1gfSk7XG4gICAgICAgICAgICB9ICAgIFxuXG4gICAgICAgICAgICByZXR1cm4gY3R4LmJvZHkgPSB7XG4gICAgICAgICAgICAgICAgc3RhdHVzOiAyMDBcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgfSBjYXRjaCAoIGUgKSB7XG4gICAgICAgICAgICByZXR1cm4gY3R4LmJvZHkgPSB7XG4gICAgICAgICAgICAgICAgc3RhdHVzOiA1MDAsXG4gICAgICAgICAgICAgICAgbWVzc2FnZTogZVxuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgLyoqXG4gICAgICogQGRlc2NyaXB0aW9uXG4gICAgICog5piv5paw5a6i6L+Y5piv5pen5a6iXG4gICAgICog5paw5a6i77yM5oiQ5Yqf5pSv5LuY6K6i5Y2VIDw9IDNcbiAgICAqL1xuICAgIGFwcC5yb3V0ZXIoJ2lzLW5ldy1jdXN0b21lcicsIGFzeW5jKCBjdHgsIG5leHQgKSA9PiB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGNvbnN0IG9wZW5pZCA9IGV2ZW50LmRhdGEub3BlbklkIHx8IGV2ZW50LnVzZXJJbmZvLm9wZW5JZDtcbiAgICAgICAgICAgIGNvbnN0IGZpbmQkID0gYXdhaXQgZGIuY29sbGVjdGlvbignb3JkZXInKVxuICAgICAgICAgICAgICAgIC53aGVyZSh7XG4gICAgICAgICAgICAgICAgICAgIG9wZW5pZCxcbiAgICAgICAgICAgICAgICAgICAgYmFzZV9zdGF0dXM6ICczJ1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLmNvdW50KCApO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICByZXR1cm4gY3R4LmJvZHkgPSB7XG4gICAgICAgICAgICAgICAgc3RhdHVzOiAyMDAsXG4gICAgICAgICAgICAgICAgZGF0YTogZmluZCQudG90YWwgPCAzXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfSBjYXRjaCAoIGUgKSB7XG4gICAgICAgICAgICByZXR1cm4gY3R4LmJvZHkgPSB7XG4gICAgICAgICAgICAgICAgc3RhdHVzOiAyMDAsXG4gICAgICAgICAgICAgICAgZGF0YTogdHJ1ZVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICAvKiogXG4gICAgICogQGRlc2NyaXB0aW9uXG4gICAgICog5a6i5oi35Zyo6K+l6Lq66KGM56iL77yM5piv5ZCm6ZyA6KaB5LuY6K6i6YeRXG4gICAgICoge1xuICAgICAqICAgIHRpZFxuICAgICAqIH1cbiAgICAgKi9cbiAgICBhcHAucm91dGVyKCdzaG91bGQtcHJlcGF5JywgYXN5bmMoIGN0eCwgbmV4dCApID0+IHtcbiAgICAgICAgdHJ5IHtcblxuICAgICAgICAgICAgY29uc3QgeyB0aWQgfSA9IGV2ZW50LmRhdGE7XG4gICAgICAgICAgICBjb25zdCBvcGVuaWQgPSBldmVudC5kYXRhLm9wZW5JZCB8fCBldmVudC51c2VySW5mby5vcGVuSWQ7XG5cbiAgICAgICAgICAgIGNvbnN0IGZpbmQkID0gYXdhaXQgZGIuY29sbGVjdGlvbignb3JkZXInKVxuICAgICAgICAgICAgICAgIC53aGVyZSh7XG4gICAgICAgICAgICAgICAgICAgIG9wZW5pZCxcbiAgICAgICAgICAgICAgICAgICAgYmFzZV9zdGF0dXM6ICczJ1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLmNvdW50KCApO1xuXG4gICAgICAgICAgICBjb25zdCB0cmlwJCA9IGF3YWl0IGRiLmNvbGxlY3Rpb24oJ3RyaXAnKVxuICAgICAgICAgICAgICAgIC5kb2MoIFN0cmluZyggdGlkICkpXG4gICAgICAgICAgICAgICAgLmdldCggKTtcbiAgICAgICAgICAgIGNvbnN0IHRyaXAgPSB0cmlwJC5kYXRhO1xuXG4gICAgICAgICAgICBjb25zdCBpc05ldyA9IGZpbmQkLnRvdGFsIDwgMztcblxuICAgICAgICAgICAgY29uc3QganVkZ2UgPSAoIGlzTmV3LCB0cmlwICkgPT4ge1xuICAgICAgICAgICAgICAgIGlmICggIXRyaXAgKSB7IHJldHVybiB0cnVlOyB9XG4gICAgICAgICAgICAgICAgaWYgKCBpc05ldyAmJiB0cmlwLnBheW1lbnQgPT09ICcwJyApIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG5cbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKCBpc05ldyAmJiB0cmlwLnBheW1lbnQgPT09ICcxJyApIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG5cbiAgICAgICAgICAgICAgICB9ICBlbHNlIGlmICggaXNOZXcgJiYgdHJpcC5wYXltZW50ID09PSAnMicgKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmICggIWlzTmV3ICYmIHRyaXAucGF5bWVudCA9PT0gJzAnICkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIH0gIGVsc2UgaWYgKCAhaXNOZXcgJiYgdHJpcC5wYXltZW50ID09PSAnMScgKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKCBpc05ldyAmJiB0cmlwLnBheW1lbnQgPT09ICcyJyApIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiBjdHguYm9keSA9IHtcbiAgICAgICAgICAgICAgICBzdGF0dXM6IDIwMCxcbiAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICAgIGlzTmV3LFxuICAgICAgICAgICAgICAgICAgICBzaG91bGRQcmVwYXk6IGp1ZGdlKCBpc05ldywgdHJpcCApXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgIH0gY2F0Y2ggKCBlICkgeyByZXR1cm4gY3R4LmJvZHkgPSB7IHN0YXR1czogNTAwIH07fVxuICAgIH0pXG5cbiAgICAvKipcbiAgICAgKiDlvq7kv6HmlK/ku5jvvIzov5Tlm57mlK/ku5hhcGnlv4XopoHlj4LmlbBcbiAgICAgKiAtLS0tLS0tLS0tLSDor7fmsYIgLS0tLS0tLS0tLVxuICAgICAqIHtcbiAgICAgKiAgICAgIHRvdGFsX2ZlZVxuICAgICAqIH1cbiAgICAgKi9cbiAgICBhcHAucm91dGVyKCd3eHBheScsIGFzeW5jKCBjdHgsIG5leHQgKSA9PiB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBjb25zdCB7IGtleSwgYm9keSwgbWNoX2lkLCBhdHRhY2gsIG5vdGlmeV91cmwsIHNwYmlsbF9jcmVhdGVfaXAgfSA9IENPTkZJRy53eFBheTtcbiAgICAgICAgICAgIGNvbnN0IGFwcGlkID0gQ09ORklHLmFwcC5pZDtcbiAgICAgICAgICAgIGNvbnN0IHRvdGFsX2ZlZSA9IGV2ZW50LmRhdGEudG90YWxfZmVlO1xuICAgICAgICAgICAgY29uc3Qgb3BlbmlkID0gZXZlbnQudXNlckluZm8ub3BlbklkO1xuICAgICAgICAgICAgY29uc3Qgbm9uY2Vfc3RyID0gTWF0aC5yYW5kb20oICkudG9TdHJpbmcoIDM2ICkuc3Vic3RyKCAyLCAxNSApO1xuICAgICAgICAgICAgY29uc3QgdGltZVN0YW1wID0gcGFyc2VJbnQoU3RyaW5nKCBEYXRlLm5vdygpIC8gMTAwMCApKSArICcnO1xuICAgICAgICAgICAgY29uc3Qgb3V0X3RyYWRlX25vID0gXCJvdG5cIiArIG5vbmNlX3N0ciArIHRpbWVTdGFtcDtcblxuICAgICAgICAgICAgY29uc3QgcGF5c2lnbiA9ICh7IC4uLmFyZ3MgfSkgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IHNhOiBhbnkgPSBbIF1cbiAgICAgICAgICAgICAgICBmb3IgKCBsZXQgayBpbiBhcmdzICkge1xuICAgICAgICAgICAgICAgICAgICBzYS5wdXNoKCBrICsgJz0nICsgYXJnc1sgayBdKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgc2EucHVzaCgna2V5PScgKyBrZXkgKTtcbiAgICAgICAgICAgICAgICBjb25zdCBzID0gIGNyeXB0by5jcmVhdGVIYXNoKCdtZDUnKS51cGRhdGUoc2Euam9pbignJicpLCAndXRmOCcpLmRpZ2VzdCgnaGV4Jyk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHMudG9VcHBlckNhc2UoICk7XG4gICAgICAgICAgICB9XG4gICAgXG4gICAgICAgICAgICBsZXQgZm9ybURhdGEgPSBcIjx4bWw+XCI7XG4gICAgXG4gICAgICAgICAgICBmb3JtRGF0YSArPSBcIjxhcHBpZD5cIiArIGFwcGlkICsgXCI8L2FwcGlkPlwiXG4gICAgICAgIFxuICAgICAgICAgICAgZm9ybURhdGEgKz0gXCI8YXR0YWNoPlwiICsgYXR0YWNoICsgXCI8L2F0dGFjaD5cIlxuICAgICAgICBcbiAgICAgICAgICAgIGZvcm1EYXRhICs9IFwiPGJvZHk+XCIgKyBib2R5ICsgXCI8L2JvZHk+XCJcbiAgICAgICAgXG4gICAgICAgICAgICBmb3JtRGF0YSArPSBcIjxtY2hfaWQ+XCIgKyBtY2hfaWQgKyBcIjwvbWNoX2lkPlwiXG4gICAgICAgIFxuICAgICAgICAgICAgZm9ybURhdGEgKz0gXCI8bm9uY2Vfc3RyPlwiICsgbm9uY2Vfc3RyICsgXCI8L25vbmNlX3N0cj5cIlxuICAgICAgICBcbiAgICAgICAgICAgIGZvcm1EYXRhICs9IFwiPG5vdGlmeV91cmw+XCIgKyBub3RpZnlfdXJsICsgXCI8L25vdGlmeV91cmw+XCJcbiAgICAgICAgXG4gICAgICAgICAgICBmb3JtRGF0YSArPSBcIjxvcGVuaWQ+XCIgKyBvcGVuaWQgKyBcIjwvb3BlbmlkPlwiXG4gICAgICAgIFxuICAgICAgICAgICAgZm9ybURhdGEgKz0gXCI8b3V0X3RyYWRlX25vPlwiICsgb3V0X3RyYWRlX25vICsgXCI8L291dF90cmFkZV9ubz5cIlxuICAgICAgICBcbiAgICAgICAgICAgIGZvcm1EYXRhICs9IFwiPHNwYmlsbF9jcmVhdGVfaXA+XCIgKyBzcGJpbGxfY3JlYXRlX2lwICsgXCI8L3NwYmlsbF9jcmVhdGVfaXA+XCJcbiAgICAgICAgXG4gICAgICAgICAgICBmb3JtRGF0YSArPSBcIjx0b3RhbF9mZWU+XCIgKyB0b3RhbF9mZWUgKyBcIjwvdG90YWxfZmVlPlwiXG4gICAgICAgIFxuICAgICAgICAgICAgZm9ybURhdGEgKz0gXCI8dHJhZGVfdHlwZT5KU0FQSTwvdHJhZGVfdHlwZT5cIlxuICAgICAgICBcbiAgICAgICAgICAgIGZvcm1EYXRhICs9IFwiPHNpZ24+XCIgKyBwYXlzaWduKHsgYXBwaWQsIGF0dGFjaCwgYm9keSwgbWNoX2lkLCBub25jZV9zdHIsIG5vdGlmeV91cmwsIG9wZW5pZCwgb3V0X3RyYWRlX25vLCBzcGJpbGxfY3JlYXRlX2lwLCB0b3RhbF9mZWUsIHRyYWRlX3R5cGU6ICdKU0FQSScgfSkgKyBcIjwvc2lnbj5cIlxuICAgICAgICBcbiAgICAgICAgICAgIGZvcm1EYXRhICs9IFwiPC94bWw+XCI7XG4gICAgXG4gICAgICAgICAgICBsZXQgcmVzID0gYXdhaXQgcnAoeyB1cmw6IFwiaHR0cHM6Ly9hcGkubWNoLndlaXhpbi5xcS5jb20vcGF5L3VuaWZpZWRvcmRlclwiLCBtZXRob2Q6ICdQT1NUJyxib2R5OiBmb3JtRGF0YSB9KTtcbiAgICBcbiAgICAgICAgICAgIGxldCB4bWwgPSByZXMudG9TdHJpbmcoXCJ1dGYtOFwiKTtcbiAgICAgICAgICBcbiAgICAgICAgICAgIGlmICggeG1sLmluZGV4T2YoJ3ByZXBheV9pZCcpIDwgMCApIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gY3R4LmJvZHkgPSB7XG4gICAgICAgICAgICAgICAgICAgIHN0YXR1czogNTAwXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY29uc29sZS5sb2coJ2VlZWVlJywgZm9ybURhdGEsIHhtbCApO1xuICAgICAgICAgICAgbGV0IHByZXBheV9pZCA9IHhtbC5zcGxpdChcIjxwcmVwYXlfaWQ+XCIpWzFdLnNwbGl0KFwiPC9wcmVwYXlfaWQ+XCIpWzBdLnNwbGl0KCdbJylbMl0uc3BsaXQoJ10nKVswXVxuICAgIFxuICAgICAgICAgICAgbGV0IHBheVNpZ24gPSBwYXlzaWduKHsgYXBwSWQ6IGFwcGlkLCBub25jZVN0cjogbm9uY2Vfc3RyLCBwYWNrYWdlOiAoJ3ByZXBheV9pZD0nICsgcHJlcGF5X2lkKSwgc2lnblR5cGU6ICdNRDUnLCB0aW1lU3RhbXA6IHRpbWVTdGFtcCB9KVxuICAgICAgICAgICAgXG4gICAgICAgICAgICByZXR1cm4gY3R4LmJvZHkgPSB7XG4gICAgICAgICAgICAgICAgc3RhdHVzOiAyMDAsXG4gICAgICAgICAgICAgICAgZGF0YTogeyBhcHBpZCwgbm9uY2Vfc3RyLCB0aW1lU3RhbXAsIHByZXBheV9pZCwgcGF5U2lnbiB9IFxuICAgICAgICAgICAgfTtcblxuICAgICAgICB9IGNhdGNoICggZSApIHtcbiAgICAgICAgICAgIHJldHVybiBjdHguYm9keSA9IHtcbiAgICAgICAgICAgICAgICBzdGF0dXM6IDUwMFxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICAvKipcbiAgICAgKiDku6PotK3kuKrkurrlvq7kv6Hkuoznu7TnoIHjgIHnvqTkuoznu7TnoIFcbiAgICAgKiAtLS0tLS0g6K+35rGCIC0tLS0tLVxuICAgICAqIHtcbiAgICAgKiAgICAgIHd4X3FyY29kZTogc3RyaW5nW11cbiAgICAgKiAgICAgIGdyb3VwX3FyY29kZTogc3RyaW5nW11cbiAgICAgKiB9XG4gICAgICovXG4gICAgYXBwLnJvdXRlcignd3hpbmZvLWVkaXQnLCBhc3luYyggY3R4LCBuZXh0ICkgPT4ge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgXG4gICAgICAgICAgICBjb25zdCB0ZW1wOiBhbnkgPSBbIF07XG4gICAgICAgICAgICBPYmplY3Qua2V5cyggZXZlbnQuZGF0YSApLm1hcCgga2V5ID0+IHtcbiAgICAgICAgICAgICAgICBpZiAoICEhZXZlbnQuZGF0YVsga2V5IF0pIHtcbiAgICAgICAgICAgICAgICAgICAgdGVtcC5wdXNoKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6IGtleSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlOiBldmVudC5kYXRhWyBrZXkgXVxuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBhd2FpdCBQcm9taXNlLmFsbCggdGVtcC5tYXAoIGFzeW5jIHggPT4ge1xuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIGNvbnN0IGZpbmQkID0gYXdhaXQgZGIuY29sbGVjdGlvbignbWFuYWdlci13eC1pbmZvJylcbiAgICAgICAgICAgICAgICAgICAgLndoZXJlKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6IHgudHlwZVxuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAuZ2V0KCApO1xuXG4gICAgICAgICAgICAgICAgaWYgKCBmaW5kJC5kYXRhLmxlbmd0aCA+IDAgKSB7XG4gICAgICAgICAgICAgICAgICAgIGF3YWl0IGRiLmNvbGxlY3Rpb24oJ21hbmFnZXItd3gtaW5mbycpLmRvYyggKGZpbmQkLmRhdGFbIDAgXSBhcyBhbnkpLl9pZCApXG4gICAgICAgICAgICAgICAgICAgICAgICAuc2V0KHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhOiB4XG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgYXdhaXQgZGIuY29sbGVjdGlvbignbWFuYWdlci13eC1pbmZvJylcbiAgICAgICAgICAgICAgICAgICAgICAgIC5hZGQoe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGE6IHhcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgfSkpO1xuXG4gICAgICAgICAgICByZXR1cm4gY3R4LmJvZHkgPSB7XG4gICAgICAgICAgICAgICAgc3RhdHVzOiAyMDBcbiAgICAgICAgICAgIH1cblxuICAgICAgICB9IGNhdGNoICggZSApIHtcbiAgICAgICAgICAgIHJldHVybiBjdHguYm9keSA9IHsgc3RhdHVzOiA1MDAgfTtcbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgLyoqXG4gICAgICogQGRlc2NyaXB0aW9uXG4gICAgICog5p+l6K+i5Luj6LSt5Liq5Lq65LqM57u056CB5L+h5oGvXG4gICAgICovXG4gICAgYXBwLnJvdXRlcignd3hpbmZvJywgYXN5bmMoIGN0eCwgbmV4dCApID0+IHtcbiAgICAgICAgdHJ5IHtcblxuICAgICAgICAgICAgY29uc3QgdGFyZ2V0ID0gWyd3eF9xcmNvZGUnLCAnZ3JvdXBfcXJjb2RlJ107XG4gICAgICAgICAgICBjb25zdCBmaW5kcyQgPSBhd2FpdCBQcm9taXNlLmFsbCggdGFyZ2V0Lm1hcCggdHlwZSA9PiB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGRiLmNvbGxlY3Rpb24oJ21hbmFnZXItd3gtaW5mbycpXG4gICAgICAgICAgICAgICAgICAgIC53aGVyZSh7XG4gICAgICAgICAgICAgICAgICAgICAgICB0eXBlXG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgIC5nZXQoICk7XG4gICAgICAgICAgICB9KSk7XG5cbiAgICAgICAgICAgIGNvbnN0IHRlbXAgPSB7IH07XG4gICAgICAgICAgICBmaW5kcyQubWFwKCggZmluZCQsIGluZGV4ICkgPT4ge1xuICAgICAgICAgICAgICAgIGlmICggZmluZCQuZGF0YS5sZW5ndGggPiAwICkge1xuICAgICAgICAgICAgICAgICAgICB0ZW1wWyB0YXJnZXRbIGluZGV4IF1dID0gZmluZCQuZGF0YVsgMCBdLnZhbHVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICByZXR1cm4gY3R4LmJvZHkgPSB7XG4gICAgICAgICAgICAgICAgc3RhdHVzOiAyMDAsXG4gICAgICAgICAgICAgICAgZGF0YTogdGVtcFxuICAgICAgICAgICAgfVxuXG4gICAgICAgIH0gY2F0Y2ggKCBlICkge1xuICAgICAgICAgICAgcmV0dXJuIGN0eC5ib2R5ID0geyBzdGF0dXM6IDUwMCB9O1xuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICAvKiogXG4gICAgICogQGRlc2NyaXB0aW9uXG4gICAgICog6I635Y+W4oCc5oiR55qE6aG16Z2i4oCd55qE5Z+65pys5L+h5oGv77yM6K+45aaC6K6i5Y2V44CB5Y2h5Yi45pWw6YePXG4gICAgICovXG4gICAgYXBwLnJvdXRlcignbXlwYWdlLWluZm8nLCBhc3luYyggY3R4LCBuZXh0ICkgPT4ge1xuICAgICAgICB0cnkge1xuXG4gICAgICAgICAgICBsZXQgY291cG9ucyA9IDA7XG4gICAgICAgICAgICBjb25zdCBvcGVuaWQgPSBldmVudC51c2VySW5mby5vcGVuSWQ7XG4gICAgICAgICAgICBjb25zdCB0cmlwcyQgPSBhd2FpdCBjbG91ZC5jYWxsRnVuY3Rpb24oe1xuICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgJHVybDogJ2VudGVyJ1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgbmFtZTogJ3RyaXAnXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGNvbnN0IHRyaXBzID0gdHJpcHMkLnJlc3VsdC5kYXRhO1xuICAgICAgICAgICAgY29uc3QgdHJpcCA9IHRyaXBzWyAwIF07XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIC8vIOiuouWNleaVsFxuICAgICAgICAgICAgY29uc3Qgb3JkZXJzJCA9IGF3YWl0IGRiLmNvbGxlY3Rpb24oJ29yZGVyJylcbiAgICAgICAgICAgICAgICAud2hlcmUoe1xuICAgICAgICAgICAgICAgICAgICBvcGVuaWQsXG4gICAgICAgICAgICAgICAgICAgIGJhc2Vfc3RhdHVzOiBfLm5lcSgnNScpXG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAuY291bnQoICk7XG5cblxuICAgICAgICAgICAgLy8g5Y2h5Yi45pWwKCDov4fmu6Tmjonlj6rlianlvZPliY3nmoR0cmlw5Y2h5Yi4IClcbiAgICAgICAgICAgIGxldCBjb3Vwb25zJDogYW55ID0ge1xuICAgICAgICAgICAgICAgIHRvdGFsOiAwXG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgXG4gICAgICAgICAgICBpZiAoICEhdHJpcCApIHtcbiAgICAgICAgICAgICAgICBjb3Vwb25zJCA9IGF3YWl0IGRiLmNvbGxlY3Rpb24oJ2NvdXBvbicpXG4gICAgICAgICAgICAgICAgICAgIC53aGVyZSh7XG4gICAgICAgICAgICAgICAgICAgICAgICBvcGVuaWQsXG4gICAgICAgICAgICAgICAgICAgICAgICB0aWQ6IHRyaXAuX2lkLFxuICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogXy5uZXEoJ3RfZGFpamluJyksXG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgIC5jb3VudCggKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgY29uc3QgY291cG9uczIkID0gYXdhaXQgZGIuY29sbGVjdGlvbignY291cG9uJylcbiAgICAgICAgICAgICAgICAud2hlcmUoe1xuICAgICAgICAgICAgICAgICAgICBvcGVuaWQsXG4gICAgICAgICAgICAgICAgICAgIGlzVXNlZDogZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgIHR5cGU6ICd0X2RhaWppbicsXG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAuY291bnQoICk7XG5cbiAgICAgICAgICAgIGNvdXBvbnMgPSBjb3Vwb25zJC50b3RhbCArIGNvdXBvbnMyJC50b3RhbDtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgcmV0dXJuIGN0eC5ib2R5ID0ge1xuICAgICAgICAgICAgICAgIHN0YXR1czogMjAwLFxuICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgY291cG9ucyxcbiAgICAgICAgICAgICAgICAgICAgb3JkZXJzOiBvcmRlcnMkLnRvdGFsXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgIH0gY2F0Y2ggKCBlICkgeyByZXR1cm4gY3R4LmJvZHkgPSB7IHN0YXR1czogNTAwIH07fVxuICAgIH0pO1xuXG4gICAgLyoqIFxuICAgICAqIEBkZXNjcmlwdGlvblxuICAgICAqIOihjOeoi+S4i++8jOWPguWKoOS6hui0reS5sOeahOWuouaIt++8iOiuouWNle+8iVxuICAgICAqIHsgXG4gICAgICogICAgdGlkXG4gICAgICogfVxuICAgICAqL1xuICAgIGFwcC5yb3V0ZXIoJ2N1c3RvbWVyLWluLXRyaXAnLCBhc3luYyggY3R4LCBuZXh0ICkgPT4ge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgY29uc3QgbGltaXQgPSAxMDA7XG4gICAgICAgICAgICBjb25zdCBhbGxPcmRlclVzZXJzJCA9IGF3YWl0IGRiLmNvbGxlY3Rpb24oJ29yZGVyJylcbiAgICAgICAgICAgICAgICAud2hlcmUoe1xuICAgICAgICAgICAgICAgICAgICB0aWQ6IGV2ZW50LmRhdGEudGlkXG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAub3JkZXJCeSgnY3JlYXRlVGltZScsICdkZXNjJylcbiAgICAgICAgICAgICAgICAubGltaXQoIGxpbWl0IClcbiAgICAgICAgICAgICAgICAuZmllbGQoe1xuICAgICAgICAgICAgICAgICAgICBvcGVuaWQ6IHRydWVcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIC5nZXQoICk7XG5cbiAgICAgICAgICAgIGNvbnN0IG9wZW5pZHMgPSBBcnJheS5mcm9tKCBuZXcgU2V0KCBhbGxPcmRlclVzZXJzJC5kYXRhLm1hcCggeCA9PiB4Lm9wZW5pZCApKSk7XG5cbiAgICAgICAgICAgIGNvbnN0IGF2YXRhdHMkID0gYXdhaXQgUHJvbWlzZS5hbGwoIG9wZW5pZHMubWFwKCBvaWQgPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiBkYi5jb2xsZWN0aW9uKCd1c2VyJylcbiAgICAgICAgICAgICAgICAgICAgLndoZXJlKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG9wZW5pZDogb2lkXG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgIC5maWVsZCh7XG4gICAgICAgICAgICAgICAgICAgICAgICBhdmF0YXJVcmw6IHRydWVcbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgLmdldCggKTtcbiAgICAgICAgICAgIH0pKVxuICAgICAgICAgICAgXG4gICAgICAgICAgICByZXR1cm4gY3R4LmJvZHkgPSB7XG4gICAgICAgICAgICAgICAgc3RhdHVzOiAyMDAsXG4gICAgICAgICAgICAgICAgZGF0YTogYXZhdGF0cyQubWFwKCB4ID0+IHguZGF0YVsgMCBdLmF2YXRhclVybCApXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfSBjYXRjaCAoIGUgKSB7XG4gICAgICAgICAgICByZXR1cm4gY3R4LmJvZHkgPSB7IHN0YXR1czogNTAwIH07XG4gICAgICAgIH1cbiAgICB9KVxuXG4gICAgLyoqXG4gICAgICog5raI5oGv5o6o6YCBIC0g5YKs5qy+XG4gICAgICoge1xuICAgICAqICAgICB0b3VzZXIgKCBvcGVuaWQgKVxuICAgICAqICAgICBmb3JtX2lkIO+8iCDmiJbogIXmmK8gcHJlcGF5X2lkIO+8iVxuICAgICAqICAgICBwYWdlPzogc3RyaW5nXG4gICAgICogICAgIGRhdGE6IHsgXG4gICAgICogICAgICAgICBcbiAgICAgKiAgICAgfVxuICAgICAqIH1cbiAgICAgKi9cbiAgICBhcHAucm91dGVyKCdub3RpZmljYXRpb24tZ2V0bW9uZXknLCBhc3luYyggY3R4LCBuZXh0ICkgPT4ge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgXG4gICAgICAgICAgICBjb25zdCBwYWdlID0gZXZlbnQuZGF0YS5wYWdlIHx8ICdwYWdlcy9vcmRlci1saXN0L2luZGV4JztcbiAgICAgICAgICAgIGNvbnN0IHsgdG91c2VyLCBmb3JtX2lkLCBkYXRhLCBwcmVwYXlfaWQgfSA9IGV2ZW50LmRhdGE7XG5cbiAgICAgICAgICAgIC8vIOiOt+WPlnRva2VuXG4gICAgICAgICAgICBjb25zdCByZXN1bHQgPSBhd2FpdCAoYXhpb3MgYXMgYW55KSh7XG4gICAgICAgICAgICAgICAgbWV0aG9kOiAnZ2V0JyxcbiAgICAgICAgICAgICAgICB1cmw6IGBodHRwczovL2FwaS53ZWl4aW4ucXEuY29tL2NnaS1iaW4vdG9rZW4/Z3JhbnRfdHlwZT1jbGllbnRfY3JlZGVudGlhbCZhcHBpZD0ke0NPTkZJRy5hcHAuaWR9JnNlY3JldD0ke0NPTkZJRy5hcHAuc2VjcmVjdH1gXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgY29uc3QgeyBhY2Nlc3NfdG9rZW4sIGVycmNvZGUgfSA9IHJlc3VsdC5kYXRhO1xuXG4gICAgICAgICAgICBpZiAoIGVycmNvZGUgKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgJ+eUn+aIkGFjY2Vzc190b2tlbumUmeivrydcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgY29uc3QgcmVxRGF0YSA9IHsgfTtcbiAgICAgICAgICAgIGNvbnN0IHJlcURhdGEkID0ge1xuICAgICAgICAgICAgICAgIHBhZ2UsXG4gICAgICAgICAgICAgICAgdG91c2VyLFxuICAgICAgICAgICAgICAgIHByZXBheV9pZCxcbiAgICAgICAgICAgICAgICBmb3JtX2lkLFxuICAgICAgICAgICAgICAgIHRlbXBsYXRlX2lkOiBDT05GSUcubm90aWZpY2F0aW9uX3RlbXBsYXRlLmdldE1vbmV5MyxcbiAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICAgIC8vIOi0reS5sOaXtumXtFxuICAgICAgICAgICAgICAgICAgICBcImtleXdvcmQxXCI6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIFwidmFsdWVcIjogZGF0YS50aXRsZVxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAvLyDorqLljZXmgLvku7dcbiAgICAgICAgICAgICAgICAgICAgXCJrZXl3b3JkMlwiOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBcInZhbHVlXCI6IGRhdGEudGltZVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgT2JqZWN0LmtleXMoIHJlcURhdGEkICkubWFwKCBrZXkgPT4ge1xuICAgICAgICAgICAgICAgIGlmICggISFyZXFEYXRhJFsga2V5IF0pIHtcbiAgICAgICAgICAgICAgICAgICAgcmVxRGF0YVsga2V5IF0gPSByZXFEYXRhJFsga2V5IF07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIC8vIOWPkemAgeaOqOmAgVxuICAgICAgICAgICAgY29uc3Qgc2VuZCA9IGF3YWl0IChheGlvcyBhcyBhbnkpKHtcbiAgICAgICAgICAgICAgICBkYXRhOiByZXFEYXRhLFxuICAgICAgICAgICAgICAgIG1ldGhvZDogJ3Bvc3QnLFxuICAgICAgICAgICAgICAgIHVybDogYGh0dHBzOi8vYXBpLndlaXhpbi5xcS5jb20vY2dpLWJpbi9tZXNzYWdlL3d4b3Blbi90ZW1wbGF0ZS9zZW5kP2FjY2Vzc190b2tlbj0ke2FjY2Vzc190b2tlbn1gXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgXG4gICAgICAgICAgICByZXR1cm4gY3R4LmJvZHkgPSB7XG4gICAgICAgICAgICAgICAgZGF0YTogc2VuZC5kYXRhLFxuICAgICAgICAgICAgICAgIHN0YXR1czogMjAwXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfSBjYXRjaCAoIGUgKSB7XG4gICAgICAgICAgICByZXR1cm4gY3R4LmJvZHkgPSB7IG1lc3NhZ2U6IGUsIHN0YXR1czogNTAwIH1cbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgLyoqXG4gICAgICogQGRlc2NyaXB0aW9uXG4gICAgICog6YCa6L+H5Yqg6Kej5a+G5a6i5pyN57uZ55qE5a+G56CB77yM5p2l5aKe5Yqg5p2D6ZmQ44CB5Yid5aeL5YyW5pWw5o2u5bqTXG4gICAgICovXG4gICAgYXBwLnJvdXRlcignYWRkLWF1dGgtYnktcHN3JywgYXN5bmMoIGN0eCwgbmV4dCApID0+IHtcbiAgICAgICAgdHJ5IHtcblxuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICBhd2FpdCAoZGIgYXMgYW55KS5jcmVhdGVDb2xsZWN0aW9uKCdtYW5hZ2VyLW1lbWJlcicpO1xuICAgICAgICAgICAgICAgIGF3YWl0IChkYiBhcyBhbnkpLmNyZWF0ZUNvbGxlY3Rpb24oJ2F1dGhwc3cnKTtcbiAgICAgICAgICAgIH0gY2F0Y2ggKCBlICkgeyB9XG5cbiAgICAgICAgICAgIGxldCByZXN1bHQgPSAnJztcbiAgICAgICAgICAgIGNvbnN0IHsgc2FsdCB9ID0gQ09ORklHLmF1dGg7XG4gICAgICAgICAgICBjb25zdCBvcGVuaWQgPSBldmVudC51c2VySW5mby5vcGVuSWQ7XG4gICAgICAgICAgICBjb25zdCB7IHBzdywgY29udGVudCB9ID0gZXZlbnQuZGF0YTtcblxuICAgICAgICAgICAgY29uc3QgZ2V0RXJyID0gbWVzc2FnZSA9PiAoe1xuICAgICAgICAgICAgICAgIG1lc3NhZ2UsXG4gICAgICAgICAgICAgICAgc3RhdHVzOiA1MDAsXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICBjb25zdCBkZWNpcGhlciA9IGNyeXB0by5jcmVhdGVEZWNpcGhlcignYWVzMTkyJywgc2FsdCApO1xuICAgICAgICAgICAgICAgIGNvbnN0IGRlY3J5cHRlZCA9IGRlY2lwaGVyLnVwZGF0ZSggcHN3LCAnaGV4JywgJ3V0ZjgnICk7XG4gICAgICAgICAgICAgICAgcmVzdWx0ID0gZGVjcnlwdGVkICsgZGVjaXBoZXIuZmluYWwoJ3V0ZjgnKTtcbiAgICAgICAgICAgIH0gY2F0Y2ggKCBlICkge1xuICAgICAgICAgICAgICAgIHJldHVybiBjdHguYm9keSA9IGdldEVycign5a+G6ZKl6ZSZ6K+v77yM6K+35qC45a+5Jyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGNvbnN0IFsgY190aW1lc3RhbXAsIGNfYXBwaWQsIGNfY29udGVudCwgY19tYXggXSA9IHJlc3VsdC5zcGxpdCgnLScpO1xuXG4gICAgICAgICAgICBpZiAoIGdldE5vdyggdHJ1ZSApIC0gTnVtYmVyKCBjX3RpbWVzdGFtcCApID4gMzAgKiA2MCAqIDEwMDAgKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGN0eC5ib2R5ID0gZ2V0RXJyKCflr4bpkqXlt7Lov4fmnJ/vvIzor7fogZTns7vlrqLmnI0nKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKCBjX2FwcGlkICE9PSBDT05GSUcuYXBwLmlkICkge1xuICAgICAgICAgICAgICAgIHJldHVybiBjdHguYm9keSA9IGdldEVycign5a+G6ZKl5LiO5bCP56iL5bqP5LiN5YWz6IGUJyk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICggY19jb250ZW50LnJlcGxhY2UoL1xccysvZywgJycpICE9PSBjb250ZW50LnJlcGxhY2UoL1xccysvZywgJycpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGN0eC5ib2R5ID0gZ2V0RXJyKCfmj5DnpLror43plJnor6/vvIzor7fogZTns7vlrqLmnI0nKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiBhdXRocHN3IOihqFxuICAgICAgICAgICAgICogXG4gICAgICAgICAgICAgKiB7XG4gICAgICAgICAgICAgKiAgICBhcHBJZCxcbiAgICAgICAgICAgICAqICAgIHRpbWVzdGFtcCxcbiAgICAgICAgICAgICAqICAgIGNvdW50XG4gICAgICAgICAgICAgKiB9XG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIGNvbnN0IGNoZWNrJCA9IGF3YWl0IGRiLmNvbGxlY3Rpb24oJ2F1dGhwc3cnKSBcbiAgICAgICAgICAgICAgICAud2hlcmUoe1xuICAgICAgICAgICAgICAgICAgICBhcHBJZDogY19hcHBpZCxcbiAgICAgICAgICAgICAgICAgICAgdGltZXN0YW1wOiBjX3RpbWVzdGFtcFxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLmdldCggKTtcbiAgICAgICAgICAgIGNvbnN0IHRhcmdldCA9IGNoZWNrJC5kYXRhWyAwIF07XG5cbiAgICAgICAgICAgIC8vIOWvhumSpeW3suiiq+S9v+eUqFxuICAgICAgICAgICAgaWYgKCAhIXRhcmdldCApIHtcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAvLyDmrKHmlbDkuI3og73lpJrkuo4yXG4gICAgICAgICAgICAgICAgaWYgKCB0YXJnZXQuY291bnQgPj0gMiApIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGN0eC5ib2R5ID0gZ2V0RXJyKCflr4bpkqXlt7Looqvkvb/nlKjvvIzor7fogZTns7vlrqLmnI0nKTtcblxuICAgICAgICAgICAgICAgIC8vIOabtOaWsOWvhumSpeS/oeaBr1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGF3YWl0IGRiLmNvbGxlY3Rpb24oJ2F1dGhwc3cnKVxuICAgICAgICAgICAgICAgICAgICAgICAgLmRvYyggU3RyaW5nKCB0YXJnZXQuX2lkICkpXG4gICAgICAgICAgICAgICAgICAgICAgICAudXBkYXRlKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvdW50OiBfLmluYyggMSApXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8g5Yib5bu65a+G6ZKl5L+h5oGvXG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGF3YWl0IGRiLmNvbGxlY3Rpb24oJ2F1dGhwc3cnKVxuICAgICAgICAgICAgICAgICAgICAuYWRkKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb3VudDogMSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhcHBJZDogY19hcHBpZCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aW1lc3RhbXA6IGNfdGltZXN0YW1wXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIOaKiuW9k+WJjeS6uu+8jOWKoOWFpeWIsOeuoeeQhuWRmFxuICAgICAgICAgICAgY29uc3QgY2hlY2tNYW5hZ2VyJCA9IGF3YWl0IGRiLmNvbGxlY3Rpb24oJ21hbmFnZXItbWVtYmVyJylcbiAgICAgICAgICAgICAgICAud2hlcmUoe1xuICAgICAgICAgICAgICAgICAgICBvcGVuaWRcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIC5nZXQoICk7XG4gICAgICAgICAgICBjb25zdCB0YXJnZXRNYW5hZ2VyID0gY2hlY2tNYW5hZ2VyJC5kYXRhWyAwIF07XG5cbiAgICAgICAgICAgIGlmICggIXRhcmdldE1hbmFnZXIgKSB7XG4gICAgICAgICAgICAgICAgYXdhaXQgZGIuY29sbGVjdGlvbignbWFuYWdlci1tZW1iZXInKVxuICAgICAgICAgICAgICAgICAgICAuYWRkKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvcGVuaWQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29udGVudDogY19jb250ZW50LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNyZWF0ZVRpbWU6IGdldE5vdyggdHJ1ZSApXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIOWIneWni+WMluWQhOS4quihqFxuICAgICAgICAgICAgYXdhaXQgaW5pdERCKCApO1xuXG4gICAgICAgICAgICByZXR1cm4gY3R4LmJvZHkgPSB7XG4gICAgICAgICAgICAgICAgc3RhdHVzOiAyMDBcbiAgICAgICAgICAgIH1cblxuICAgICAgICB9IGNhdGNoICggZSApIHtcbiAgICAgICAgICAgIHJldHVybiBjdHguYm9keSA9IHtcbiAgICAgICAgICAgICAgICBzdGF0dXM6IDUwMCxcbiAgICAgICAgICAgICAgICBtZXNzYWdlOiAn5a+G6ZKl5qOA5p+l5Y+R55Sf6ZSZ6K+vJ1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICAvKipcbiAgICAgKiBAZGVzY3JpcHRpb25cbiAgICAgKiDmn6Xor6LlupTnlKjphY3nva5cbiAgICAgKi9cbiAgICBhcHAucm91dGVyKCdjaGVjay1hcHAtY29uZmlnJywgYXN5bmMoIGN0eCwgbmV4dCApID0+IHtcbiAgICAgICAgdHJ5IHtcblxuICAgICAgICAgICAgbGV0IGNvbmZpZ09iaiA9IHsgfTtcbiAgICAgICAgICAgIGNvbnN0IGNvbmZpZyQgPSBhd2FpdCBkYi5jb2xsZWN0aW9uKCdhcHAtY29uZmlnJylcbiAgICAgICAgICAgICAgICAud2hlcmUoeyB9KVxuICAgICAgICAgICAgICAgIC5nZXQoICk7XG5cbiAgICAgICAgICAgIGNvbnN0IG1ldGEgPSBjb25maWckLmRhdGEubWFwKCBjb25mID0+IHtcbiAgICAgICAgICAgICAgICBjb25maWdPYmogPSBPYmplY3QuYXNzaWduKHsgfSwgY29uZmlnT2JqLCB7XG4gICAgICAgICAgICAgICAgICAgIFsgY29uZi50eXBlIF06IGNvbmYudmFsdWVcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHJldHVybiBjdHguYm9keSA9IHtcbiAgICAgICAgICAgICAgICBkYXRhOiBjb25maWdPYmosXG4gICAgICAgICAgICAgICAgc3RhdHVzOiAyMDBcbiAgICAgICAgICAgIH1cblxuICAgICAgICB9IGNhdGNoICggZSApIHtcbiAgICAgICAgICAgIHJldHVybiBjdHguYm9keSA9IHtcbiAgICAgICAgICAgICAgICBzdGF0dXM6IDUwMFxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICAvKipcbiAgICAgKiBAZGVzY3JpcHRpb25cbiAgICAgKiDmm7TmlrDlupTnlKjphY3nva5cbiAgICAgKiAtLS0tLS0tLS0tLS0tLVxuICAgICAqIGNvbmZpZ3M6IHtcbiAgICAgKiAgICBbIGtleTogc3RyaW5nIF06IGFueSBcbiAgICAgKiB9XG4gICAgICovXG4gICAgYXBwLnJvdXRlcigndXBkYXRlLWFwcC1jb25maWcnLCBhc3luYyggY3R4LCBuZXh0ICkgPT4ge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgY29uc3QgeyBjb25maWdzIH0gPSBldmVudC5kYXRhO1xuXG4gICAgICAgICAgICBhd2FpdCBQcm9taXNlLmFsbChcbiAgICAgICAgICAgICAgICBPYmplY3Qua2V5cyggY29uZmlncyApXG4gICAgICAgICAgICAgICAgICAgIC5tYXAoIGFzeW5jIGNvbmZpZ0tleSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCB0YXJnZXQkID0gYXdhaXQgZGIuY29sbGVjdGlvbignYXBwLWNvbmZpZycpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLndoZXJlKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogY29uZmlnS2V5XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAuZ2V0KCApXG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICggIXRhcmdldCQuZGF0YVsgMCBdKSB7IHJldHVybjsgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICBhd2FpdCBkYi5jb2xsZWN0aW9uKCdhcHAtY29uZmlnJylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAuZG9jKCBTdHJpbmcoIHRhcmdldCQuZGF0YVsgMCBdLl9pZCApKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC51cGRhdGUoe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZTogY29uZmlnc1sgY29uZmlnS2V5IF1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICApO1xuXG4gICAgICAgICAgICByZXR1cm4gY3R4LmJvZHkgPSB7XG4gICAgICAgICAgICAgICAgc3RhdHVzOiAyMDBcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBjYXRjaCAoIGUgKSB7XG4gICAgICAgICAgICByZXR1cm4gY3R4LmJvZHkgPSB7XG4gICAgICAgICAgICAgICAgc3RhdHVzOiA1MDBcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0pXG5cbiAgICAvKiogXG4gICAgICogQGRlc2NyaXB0aW9uXG4gICAgICog55Sf5oiQ5LqM57u056CBXG4gICAgICoge1xuICAgICAqICAgICBwYWdlXG4gICAgICogICAgIHNjZW5lXG4gICAgICogfVxuICAgICAqL1xuICAgIGFwcC5yb3V0ZXIoJ2NyZWF0ZS1xcmNvZGUnLCBhc3luYyggY3R4LCBuZXh0ICkgPT4ge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgY29uc3QgeyBwYWdlLCBzY2VuZSB9ID0gZXZlbnQuZGF0YTtcbiAgICAgICAgICAgIGNvbnN0IHJlc3VsdCA9IGF3YWl0IGNsb3VkLm9wZW5hcGkud3hhY29kZS5nZXRVbmxpbWl0ZWQoe1xuICAgICAgICAgICAgICAgIHBhZ2UsXG4gICAgICAgICAgICAgICAgc2NlbmU6IHNjZW5lIHx8ICcnXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgaWYgKCByZXN1bHQuZXJyQ29kZSAhPT0gMCApIHtcbiAgICAgICAgICAgICAgICB0aHJvdyByZXN1bHQuZXJyTXNnXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiBjdHguYm9keSA9IHtcbiAgICAgICAgICAgICAgICBzdGF0dXM6IDIwMCxcbiAgICAgICAgICAgICAgICBkYXRhOiByZXN1bHQuYnVmZmVyXG4gICAgICAgICAgICB9XG4gICAgICAgIH0gY2F0Y2ggKCBlICkge1xuICAgICAgICAgICAgcmV0dXJuIGN0eC5ib2R5ID0ge1xuICAgICAgICAgICAgICAgIHN0YXR1czogNTAwLFxuICAgICAgICAgICAgICAgIG1lc3NhZ2U6IHR5cGVvZiBlID09PSAnc3RyaW5nJyA/IGUgOiBKU09OLnN0cmluZ2lmeSggZSApXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgIC8qKiBcbiAgICAgKiBAZGVzY3JpcHRpb25cbiAgICAgKiDliJvlu7rkuIDkuKpmb3JtLWlkXG4gICAgICoge1xuICAgICAqICAgICBmb3JtaWRcbiAgICAgKiB9XG4gICAgICogZm9ybS1pZHM6IHtcbiAgICAgKiAgICAgIG9wZW5pZCxcbiAgICAgKiAgICAgIGZvcm1pZCxcbiAgICAgKiAgICAgIGNyZWF0ZVRpbWUsXG4gICAgICogICAgICB0eXBlOiAnbWFuYWdlcicgfCAnbm9ybWFsJ1xuICAgICAqIH1cbiAgICAgKi9cbiAgICBhcHAucm91dGVyKCdjcmVhdGUtZm9ybWlkJywgYXN5bmMoIGN0eCwgbmV4dCApID0+IHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGNvbnN0IG9wZW5pZCA9IGV2ZW50LnVzZXJJbmZvLm9wZW5JZDtcbiAgICAgICAgICAgIGNvbnN0IHsgZm9ybWlkIH0gPSBldmVudC5kYXRhOyBcbiAgICAgICAgICAgIGNvbnN0IGZpbmQkID0gYXdhaXQgZGIuY29sbGVjdGlvbignbWFuYWdlci1tZW1iZXInKVxuICAgICAgICAgICAgICAgIC53aGVyZSh7XG4gICAgICAgICAgICAgICAgICAgIG9wZW5pZFxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLmNvdW50KCApO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICBjb25zdCBjcmVhdGUkID0gYXdhaXQgZGIuY29sbGVjdGlvbignZm9ybS1pZHMnKVxuICAgICAgICAgICAgICAgIC5hZGQoe1xuICAgICAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBvcGVuaWQsXG4gICAgICAgICAgICAgICAgICAgICAgICBmb3JtaWQsXG4gICAgICAgICAgICAgICAgICAgICAgICBjcmVhdGVUaW1lOiBnZXROb3coIHRydWUgKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6IGZpbmQkLnRvdGFsID4gMCA/ICdtYW5hZ2VyJyA6ICdub3JtYWwnXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGN0eC5ib2R5ID0ge1xuICAgICAgICAgICAgICAgIHN0YXR1czogMjAwXG4gICAgICAgICAgICB9XG4gICAgICAgIH0gY2F0Y2ggKCBlICkge1xuICAgICAgICAgICAgY3R4LmJvZHkgPSB7XG4gICAgICAgICAgICAgICAgc3RhdHVzOiAyMDBcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgLyoqXG4gICAgICogQGRlc2NyaXB0aW9uXG4gICAgICog5qih5p2/5o6o6YCB5pyN5Yqh77yM5raI6LS5Zm9ybS1pZHNcbiAgICAgKiB7XG4gICAgICogICAgICBvcGVuaWRcbiAgICAgKiAgICAgIHR5cGU6ICdidXlQaW4nIHwgJ2J1eScgfCAnZ2V0TW9uZXknIHwgJ3dhaXRQaW4nIHwgJ25ld09yZGVyJ1xuICAgICAqICAgICAgdGV4dHM6IFsgJ3h4JywgJ3l5JyBdXG4gICAgICogICAgICA/cGFnZVxuICAgICAqICAgICAgP3ByZXBheV9pZFxuICAgICAqIH1cbiAgICAgKi9cbiAgICBhcHAucm91dGVyKCdwdXNoLXRlbXBsYXRlJywgYXN5bmMoIGN0eCwgbmV4dCApID0+IHtcbiAgICAgICAgdHJ5IHtcblxuICAgICAgICAgICAgbGV0IGZvcm1pZF9pZDogYW55ID0gJyc7XG4gICAgICAgICAgICBsZXQgZm9ybWlkID0gZXZlbnQuZGF0YS5wcmVwYXlfaWQ7XG4gICAgICAgICAgICBjb25zdCB7IHR5cGUsIHRleHRzIH0gPSBldmVudC5kYXRhO1xuICAgICAgICAgICAgY29uc3Qgb3BlbmlkID0gZXZlbnQuZGF0YS5vcGVuSWQgfHwgZXZlbnQuZGF0YS5vcGVuaWQgfHwgZXZlbnQudXNlckluZm8ub3BlbklkO1xuICAgICAgICAgICAgY29uc3QgcGFnZSA9IGV2ZW50LmRhdGEucGFnZSB8fCAncGFnZXMvb3JkZXItbGlzdC9pbmRleCc7XG5cbiAgICAgICAgICAgIC8vIOWmguaenOayoeaciXByZXBheV9pZCwg5bCx5Y675ou/6K+l55So5oi355qEZm9ybV9pZFxuICAgICAgICAgICAgaWYgKCAhZm9ybWlkICkge1xuICAgICAgICAgICAgICAgIGNvbnN0IGZpbmQkID0gYXdhaXQgZGIuY29sbGVjdGlvbignZm9ybS1pZHMnKVxuICAgICAgICAgICAgICAgICAgICAud2hlcmUoe1xuICAgICAgICAgICAgICAgICAgICAgICAgb3BlbmlkXG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgIC5saW1pdCggMSApXG4gICAgICAgICAgICAgICAgICAgIC5nZXQoICk7XG5cbiAgICAgICAgICAgICAgICBpZiAoICFmaW5kJC5kYXRhWyAwIF0pIHtcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgYOivpeeUqOaItyR7b3BlbmlkfeayoeaciWZvcm1pZOOAgXByZXBheV9pZGA7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgZm9ybWlkID0gZmluZCQuZGF0YVsgMCBdLmZvcm1pZDtcbiAgICAgICAgICAgICAgICBmb3JtaWRfaWQgPSBmaW5kJC5kYXRhWyAwIF0uX2lkO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBsZXQgdGV4dERhdGEgPSB7IH07XG4gICAgICAgICAgICB0ZXh0cy5tYXAoKCB0ZXh0LCBpbmRleCApID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCBrZXlUZXh0ID0gYGtleXdvcmQke2luZGV4ICsgMX1gO1xuICAgICAgICAgICAgICAgIHRleHREYXRhID0gT2JqZWN0LmFzc2lnbih7IH0sIHRleHREYXRhLCB7XG4gICAgICAgICAgICAgICAgICAgIFsga2V5VGV4dCBdIDoge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU6IHRleHRcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgY29uc3Qgd2VhcHBUZW1wbGF0ZU1zZyA9IHtcbiAgICAgICAgICAgICAgICBwYWdlLFxuICAgICAgICAgICAgICAgIGRhdGE6IHRleHREYXRhLFxuICAgICAgICAgICAgICAgIGZvcm1JZDogZm9ybWlkLFxuICAgICAgICAgICAgICAgIHRlbXBsYXRlSWQ6IENPTkZJRy5wdXNoX3RlbXBsYXRlWyB0eXBlIF0udmFsdWVcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCc9PT3mjqjpgIEnLCB3ZWFwcFRlbXBsYXRlTXNnICk7XG5cbiAgICAgICAgICAgIGNvbnN0IHNlbmQkID0gYXdhaXQgY2xvdWQub3BlbmFwaS51bmlmb3JtTWVzc2FnZS5zZW5kKHtcbiAgICAgICAgICAgICAgICB0b3VzZXI6IG9wZW5pZCxcbiAgICAgICAgICAgICAgICB3ZWFwcFRlbXBsYXRlTXNnXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgaWYgKCBTdHJpbmcoIHNlbmQkLmVyckNvZGUgKSAhPT0gJzAnICkge1xuICAgICAgICAgICAgICAgIHRocm93IHNlbmQkLmVyck1zZztcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8g5Yig6Zmk6K+l5p2hZm9ybS1pZFxuICAgICAgICAgICAgaWYgKCAhIWZvcm1pZF9pZCApIHtcbiAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICBhd2FpdCBkYi5jb2xsZWN0aW9uKCdmb3JtLWlkcycpXG4gICAgICAgICAgICAgICAgICAgICAgICAuZG9jKCBmb3JtaWRfaWQgKVxuICAgICAgICAgICAgICAgICAgICAgICAgLnJlbW92ZSggKTtcbiAgICAgICAgICAgICAgICB9IGNhdGNoICggZSApIHsgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gY3R4LmJvZHkgPSB7XG4gICAgICAgICAgICAgICAgc3RhdHVzOiAyMDBcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgfSBjYXRjaCAoIGUgKSB7XG4gICAgICAgICAgICByZXR1cm4gY3R4LmJvZHkgPSB7XG4gICAgICAgICAgICAgICAgc3RhdHVzOiA1MDAsXG4gICAgICAgICAgICAgICAgbWVzc2FnZTogdHlwZW9mIGUgPT09ICdzdHJpbmcnID8gZSA6IEpTT04uc3RyaW5naWZ5KCBlIClcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgLyoqIFxuICAgICAqIEBkZXNjcmlwdGlvblxuICAgICAqIOWQjOS4iu+8jOS6keW8gOWPkeeUqFxuICAgICAqL1xuICAgIGFwcC5yb3V0ZXIoJ3B1c2gtdGVtcGxhdGUtY2xvdWQnLCBhc3luYyggY3R4LCBuZXh0ICkgPT4ge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgLy8g6I635Y+WdG9rZW5cbiAgICAgICAgICAgIGNvbnN0IHJlc3VsdCA9IGF3YWl0IChheGlvcyBhcyBhbnkpKHtcbiAgICAgICAgICAgICAgICBtZXRob2Q6ICdnZXQnLFxuICAgICAgICAgICAgICAgIHVybDogYGh0dHBzOi8vYXBpLndlaXhpbi5xcS5jb20vY2dpLWJpbi90b2tlbj9ncmFudF90eXBlPWNsaWVudF9jcmVkZW50aWFsJmFwcGlkPSR7Q09ORklHLmFwcC5pZH0mc2VjcmV0PSR7Q09ORklHLmFwcC5zZWNyZWN0fWBcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICBjb25zdCB7IGFjY2Vzc190b2tlbiwgZXJyY29kZSB9ID0gcmVzdWx0LmRhdGE7XG5cbiAgICAgICAgICAgIGlmICggZXJyY29kZSApIHtcbiAgICAgICAgICAgICAgICB0aHJvdyAn55Sf5oiQYWNjZXNzX3Rva2Vu6ZSZ6K+vJ1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBsZXQgZm9ybWlkX2lkOiBhbnkgPSAnJztcbiAgICAgICAgICAgIGxldCBmb3JtaWQgPSBldmVudC5kYXRhLnByZXBheV9pZDtcbiAgICAgICAgICAgIGNvbnN0IHsgdHlwZSwgdGV4dHMgfSA9IGV2ZW50LmRhdGE7XG4gICAgICAgICAgICBjb25zdCBvcGVuaWQgPSBldmVudC5kYXRhLm9wZW5JZCB8fCBldmVudC5kYXRhLm9wZW5pZCB8fCBldmVudC51c2VySW5mby5vcGVuSWQ7XG4gICAgICAgICAgICBjb25zdCBwYWdlID0gZXZlbnQuZGF0YS5wYWdlIHx8ICdwYWdlcy9vcmRlci1saXN0L2luZGV4JztcblxuICAgICAgICAgICAgLy8g5aaC5p6c5rKh5pyJcHJlcGF5X2lkLCDlsLHljrvmi7/or6XnlKjmiLfnmoRmb3JtX2lkXG4gICAgICAgICAgICAvLyDlgJLlj5nmi79mb3JtaWRcbiAgICAgICAgICAgIGlmICggIWZvcm1pZCApIHtcbiAgICAgICAgICAgICAgICBjb25zdCBmaW5kJCA9IGF3YWl0IGRiLmNvbGxlY3Rpb24oJ2Zvcm0taWRzJylcbiAgICAgICAgICAgICAgICAgICAgLndoZXJlKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG9wZW5pZCxcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvcm1pZDogXy5uZXEoJ3RoZSBmb3JtSWQgaXMgYSBtb2NrIG9uZScpXG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgIC5vcmRlckJ5KCdjcmVhdGVUaW1lJywgJ2FzYycpXG4gICAgICAgICAgICAgICAgICAgIC5saW1pdCggMSApXG4gICAgICAgICAgICAgICAgICAgIC5nZXQoICk7XG5cbiAgICAgICAgICAgICAgICBpZiAoICFmaW5kJC5kYXRhWyAwIF0pIHtcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgYOivpeeUqOaItyR7b3BlbmlkfeayoeaciWZvcm1pZOOAgXByZXBheV9pZGA7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgZm9ybWlkID0gZmluZCQuZGF0YVsgMCBdLmZvcm1pZDtcbiAgICAgICAgICAgICAgICBmb3JtaWRfaWQgPSBmaW5kJC5kYXRhWyAwIF0uX2lkO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBsZXQgdGV4dERhdGEgPSB7IH07XG4gICAgICAgICAgICB0ZXh0cy5tYXAoKCB0ZXh0LCBpbmRleCApID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCBrZXlUZXh0ID0gYGtleXdvcmQke2luZGV4ICsgMX1gO1xuICAgICAgICAgICAgICAgIHRleHREYXRhID0gT2JqZWN0LmFzc2lnbih7IH0sIHRleHREYXRhLCB7XG4gICAgICAgICAgICAgICAgICAgIFsga2V5VGV4dCBdIDoge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU6IHRleHRcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgY29uc3Qgd2VhcHBfdGVtcGxhdGVfbXNnID0ge1xuICAgICAgICAgICAgICAgIHBhZ2UsXG4gICAgICAgICAgICAgICAgZGF0YTogdGV4dERhdGEsXG4gICAgICAgICAgICAgICAgZm9ybV9pZDogZm9ybWlkLFxuICAgICAgICAgICAgICAgIHRlbXBsYXRlX2lkOiBDT05GSUcucHVzaF90ZW1wbGF0ZVsgdHlwZSBdLnZhbHVlXG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICBjb25zb2xlLmxvZygnPT095o6o6YCBJywgd2VhcHBfdGVtcGxhdGVfbXNnICk7XG5cbiAgICAgICAgICAgIGNvbnN0IHJlcURhdGEgPSB7XG4gICAgICAgICAgICAgICAgdG91c2VyOiBvcGVuaWQsXG4gICAgICAgICAgICAgICAgd2VhcHBfdGVtcGxhdGVfbXNnXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIOWPkemAgeaOqOmAgVxuICAgICAgICAgICAgY29uc3Qgc2VuZCA9IGF3YWl0IChheGlvcyBhcyBhbnkpKHtcbiAgICAgICAgICAgICAgICBkYXRhOiByZXFEYXRhLFxuICAgICAgICAgICAgICAgIG1ldGhvZDogJ3Bvc3QnLFxuICAgICAgICAgICAgICAgIHVybDogYGh0dHBzOi8vYXBpLndlaXhpbi5xcS5jb20vY2dpLWJpbi9tZXNzYWdlL3d4b3Blbi90ZW1wbGF0ZS91bmlmb3JtX3NlbmQ/YWNjZXNzX3Rva2VuPSR7YWNjZXNzX3Rva2VufWBcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBpZiAoIFN0cmluZyggc2VuZC5kYXRhLmVycmNvZGUgKSAhPT0gJzAnICkge1xuICAgICAgICAgICAgICAgIHRocm93IHNlbmQuZGF0YS5lcnJtc2c7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIOWIoOmZpOivpeadoWZvcm0taWRcbiAgICAgICAgICAgIGlmICggISFmb3JtaWRfaWQgKSB7XG4gICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgICAgYXdhaXQgZGIuY29sbGVjdGlvbignZm9ybS1pZHMnKVxuICAgICAgICAgICAgICAgICAgICAgICAgLmRvYyggZm9ybWlkX2lkIClcbiAgICAgICAgICAgICAgICAgICAgICAgIC5yZW1vdmUoICk7XG4gICAgICAgICAgICAgICAgfSBjYXRjaCAoIGUgKSB7IH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgICAgICByZXR1cm4gY3R4LmJvZHkgPSB7XG4gICAgICAgICAgICAgICAgZGF0YTogc2VuZC5kYXRhLFxuICAgICAgICAgICAgICAgIHN0YXR1czogMjAwXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIFxuICAgICAgICB9IGNhdGNoICggZSApIHtcbiAgICAgICAgICAgIHJldHVybiBjdHguYm9keSA9IHtcbiAgICAgICAgICAgICAgICBzdGF0dXM6IDUwMCxcbiAgICAgICAgICAgICAgICBtZXNzYWdlOiB0eXBlb2YgZSA9PT0gJ3N0cmluZycgPyBlIDogSlNPTi5zdHJpbmdpZnkoIGUgKVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSlcblxuICAgIC8qKiBcbiAgICAgKiBAZGVzY3JpcHRpb25cbiAgICAgKiDorqLpmIXmjqjpgIFcbiAgICAgKiB7XG4gICAgICogICAgICBvcGVuaWRcbiAgICAgKiAgICAgIHR5cGU6ICdidXlQaW4nIHwgJ2J1eScgfCAnZ2V0TW9uZXknIHwgJ3dhaXRQaW4nIHwgJ25ld09yZGVyJ1xuICAgICAqICAgICAgdGV4dHM6IFsgJ3h4JywgJ3l5JyBdXG4gICAgICogICAgICA/cGFnZVxuICAgICAqIH1cbiAgICAgKi9cbiAgICBhcHAucm91dGVyKCdwdXNoLXN1YnNjcmliZScsIGFzeW5jICggY3R4LCBuZXh0ICkgPT4ge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgY29uc3QgeyB0eXBlLCB0ZXh0cyB9ID0gZXZlbnQuZGF0YTtcbiAgICAgICAgICAgIGNvbnN0IG9wZW5pZCA9IGV2ZW50LmRhdGEub3BlbklkIHx8IGV2ZW50LmRhdGEub3BlbmlkIHx8IGV2ZW50LnVzZXJJbmZvLm9wZW5JZDtcbiAgICAgICAgICAgIGNvbnN0IHBhZ2UgPSBldmVudC5kYXRhLnBhZ2UgfHwgJ3BhZ2VzL3RyaXAtZW50ZXIvaW5kZXgnO1xuICAgICAgICAgICAgY29uc3QgdGVtcGxhdGUgPSBDT05GSUcuc3Vic2NyaWJlX3RlbXBsYXRlc1sgdHlwZSBdO1xuXG4gICAgICAgICAgICBsZXQgdGV4dERhdGEgPSB7IH07XG4gICAgICAgICAgICB0ZXh0cy5tYXAoKCB0ZXh0LCBrICkgPT4ge1xuICAgICAgICAgICAgICAgIHRleHREYXRhID0ge1xuICAgICAgICAgICAgICAgICAgICAuLi50ZXh0RGF0YSxcbiAgICAgICAgICAgICAgICAgICAgWyB0ZW1wbGF0ZS50ZXh0S2V5c1sgayBdXToge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU6IHRleHRcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgY29uc3Qgc3Vic2NyaWJlRGF0YSA9IHtcbiAgICAgICAgICAgICAgICBwYWdlLFxuICAgICAgICAgICAgICAgIGRhdGE6IHRleHREYXRhLFxuICAgICAgICAgICAgICAgIHRvdXNlcjogb3BlbmlkLFxuICAgICAgICAgICAgICAgIHRlbXBsYXRlSWQ6IHRlbXBsYXRlLmlkXG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICBjb25zb2xlLmxvZygnPT096K6i6ZiF5o6o6YCBJywgc3Vic2NyaWJlRGF0YSApO1xuXG4gICAgICAgICAgICBjb25zdCBzZW5kJCA9IGF3YWl0IGNsb3VkLm9wZW5hcGkuc3Vic2NyaWJlTWVzc2FnZS5zZW5kKCBzdWJzY3JpYmVEYXRhICk7XG5cbiAgICAgICAgICAgIGlmICggU3RyaW5nKCBzZW5kJC5lcnJDb2RlICkgIT09ICcwJyApIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBzZW5kJC5lcnJNc2c7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiBjdHguYm9keSA9IHtcbiAgICAgICAgICAgICAgICBzdGF0dXM6IDIwMFxuICAgICAgICAgICAgfVxuICAgICAgICB9IGNhdGNoICggZSApIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCc/Pz8/JywgZSApO1xuICAgICAgICAgICAgcmV0dXJuIGN0eC5ib2R5ID0geyBcbiAgICAgICAgICAgICAgICBzdGF0dXM6IDUwMCxcbiAgICAgICAgICAgICAgICBkYXRhOiBlXG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgfSlcblxuICAgIC8qKiBcbiAgICAgKiBAZGVzY3JpcHRpb25cbiAgICAgKiDorqLpmIXmjqjpgIHvvIzkupHniYjmnKxcbiAgICAgKi9cbiAgICBhcHAucm91dGVyKCdwdXNoLXN1YnNjcmliZS1jbG91ZCcsIGFzeW5jKCBjdHgsIG5leHQgKSA9PiB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBjb25zdCB7IHR5cGUsIHRleHRzIH0gPSBldmVudC5kYXRhO1xuICAgICAgICAgICAgY29uc3Qgb3BlbmlkID0gZXZlbnQuZGF0YS5vcGVuSWQgfHwgZXZlbnQuZGF0YS5vcGVuaWQgfHwgZXZlbnQudXNlckluZm8ub3BlbklkO1xuICAgICAgICAgICAgY29uc3QgcGFnZSA9IGV2ZW50LmRhdGEucGFnZSB8fCAncGFnZXMvdHJpcC1lbnRlci9pbmRleCc7XG4gICAgICAgICAgICBjb25zdCB0ZW1wbGF0ZSA9IENPTkZJRy5zdWJzY3JpYmVfdGVtcGxhdGVzWyB0eXBlIF07XG5cbiAgICAgICAgICAgIGxldCB0ZXh0RGF0YSA9IHsgfTtcbiAgICAgICAgICAgIHRleHRzLm1hcCgoIHRleHQsIGsgKSA9PiB7XG4gICAgICAgICAgICAgICAgdGV4dERhdGEgPSB7XG4gICAgICAgICAgICAgICAgICAgIC4uLnRleHREYXRhLFxuICAgICAgICAgICAgICAgICAgICBbIHRlbXBsYXRlLnRleHRLZXlzWyBrIF1dOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZTogdGV4dFxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBjb25zdCBzdWJzY3JpYmVEYXRhID0ge1xuICAgICAgICAgICAgICAgIHBhZ2UsXG4gICAgICAgICAgICAgICAgZGF0YTogdGV4dERhdGEsXG4gICAgICAgICAgICAgICAgdG91c2VyOiBvcGVuaWQsXG4gICAgICAgICAgICAgICAgdGVtcGxhdGVfaWQ6IHRlbXBsYXRlLmlkXG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAvLyDojrflj5Z0b2tlblxuICAgICAgICAgICAgY29uc3QgcmVzdWx0ID0gYXdhaXQgKGF4aW9zIGFzIGFueSkoe1xuICAgICAgICAgICAgICAgIG1ldGhvZDogJ2dldCcsXG4gICAgICAgICAgICAgICAgdXJsOiBgaHR0cHM6Ly9hcGkud2VpeGluLnFxLmNvbS9jZ2ktYmluL3Rva2VuP2dyYW50X3R5cGU9Y2xpZW50X2NyZWRlbnRpYWwmYXBwaWQ9JHtDT05GSUcuYXBwLmlkfSZzZWNyZXQ9JHtDT05GSUcuYXBwLnNlY3JlY3R9YFxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGNvbnN0IHsgYWNjZXNzX3Rva2VuLCBlcnJjb2RlIH0gPSByZXN1bHQuZGF0YTtcblxuICAgICAgICAgICAgaWYgKCBlcnJjb2RlICkge1xuICAgICAgICAgICAgICAgIHRocm93ICfnlJ/miJBhY2Nlc3NfdG9rZW7plJnor68nXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCc9PT3kupHniYjmnKzorqLpmIXmjqjpgIEnLCBzdWJzY3JpYmVEYXRhICk7XG5cbiAgICAgICAgICAgIGNvbnN0IHNlbmQgPSBhd2FpdCAoYXhpb3MgYXMgYW55KSh7XG4gICAgICAgICAgICAgICAgZGF0YTogc3Vic2NyaWJlRGF0YSxcbiAgICAgICAgICAgICAgICBtZXRob2Q6ICdwb3N0JyxcbiAgICAgICAgICAgICAgICB1cmw6IGBodHRwczovL2FwaS53ZWl4aW4ucXEuY29tL2NnaS1iaW4vbWVzc2FnZS9zdWJzY3JpYmUvc2VuZD9hY2Nlc3NfdG9rZW49JHthY2Nlc3NfdG9rZW59YFxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCc9PT3kupHniYjmnKzorqLpmIXmjqjpgIEnLCBzZW5kLmRhdGEgKTtcbiAgICAgICAgICAgIGlmICggU3RyaW5nKCBzZW5kLmRhdGEuZXJyY29kZSApICE9PSAnMCcgKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgc2VuZC5kYXRhLmVycm1zZztcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIGN0eC5ib2R5ID0ge1xuICAgICAgICAgICAgICAgIHN0YXR1czogMjAwXG4gICAgICAgICAgICB9XG4gICAgICAgIH0gY2F0Y2ggKCBlICkge1xuICAgICAgICAgICAgcmV0dXJuIGN0eC5ib2R5ID0geyBcbiAgICAgICAgICAgICAgICBzdGF0dXM6IDUwMCxcbiAgICAgICAgICAgICAgICBkYXRhOiBlXG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICAvKipcbiAgICAgKiBAZGVzY3JpcHRpb25cbiAgICAgKiDliJvlu7rkuIDkuKrliIbkuqvorrDlvZVcbiAgICAgKiDooajnu5PmnoQge1xuICAgICAqICAgICAgdG8gLy8g5Y+X5o6o6ICFXG4gICAgICogICAgICBmcm9tIC8vIOaOqOW5v+iAhVxuICAgICAqICAgICAgcGlkXG4gICAgICogICAgICBjcmVhdGVUaW1lIC8vIOWIhuS6q+aXtumXtFxuICAgICAqICAgICAgaXNTdWNjZXNzOiBib29sZWFuIC8vIOaYr+WQpuaOqOW5v+aIkOWKn1xuICAgICAqICAgICAgc3VjY2Vzc1RpbWU6IC8vIOaOqOW5v+aIkOWKn+eahOaXtumXtFxuICAgICAqIH1cbiAgICAgKiDor7fmsYJ7XG4gICAgICogICAgIHBpZFxuICAgICAqICAgICBmcm9tXG4gICAgICogfVxuICAgICAqL1xuICAgIGFwcC5yb3V0ZXIoJ2NyZWF0ZS1zaGFyZScsIGFzeW5jKCBjdHgsIG5leHQgKSA9PiB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBjb25zdCBvcGVuaWQgPSBldmVudC51c2VySW5mby5vcGVuSWQ7XG4gICAgICAgICAgICBjb25zdCB7IGZyb20sIHBpZCB9ID0gZXZlbnQuZGF0YTtcblxuICAgICAgICAgICAgLy8g6KeE5YiZMTrpmLLph43lpI1cbiAgICAgICAgICAgIC8vIOWmguaenEHnu5lC5o6o5bm/6L+H5ZWG5ZOBMe+8jOWImUPnu5lC5o6o5bm/5ZWG5ZOBMeaXoOaViFxuICAgICAgICAgICAgY29uc3QgY291bnQkID0gYXdhaXQgZGIuY29sbGVjdGlvbignc2hhcmUtcmVjb3JkJylcbiAgICAgICAgICAgICAgICAud2hlcmUoe1xuICAgICAgICAgICAgICAgICAgICBwaWQsXG4gICAgICAgICAgICAgICAgICAgIG9wZW5pZCxcbiAgICAgICAgICAgICAgICAgICAgaXNTdWNjZXNzOiBmYWxzZVxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLmNvdW50KCApO1xuXG4gICAgICAgICAgICBpZiAoIGNvdW50JC50b3RhbCA+IDAgKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGN0eC5ib2R5ID0geyBzdGF0dXM6IDIwMCB9O1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyDop4TliJkyOiDkuI3og73oh6rlt7Hmjqjoh6rlt7FcbiAgICAgICAgICAgIGlmICggb3BlbmlkID09PSBmcm9tICkge1xuICAgICAgICAgICAgICAgIHJldHVybiBjdHguYm9keSA9IHsgc3RhdHVzOiAyMDAgfTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8g6KeE5YiZMzogMjRo5YaF5LiN6IO96YeN5aSN5o6oXG4gICAgICAgICAgICBjb25zdCBjb3VudDIkID0gYXdhaXQgZGIuY29sbGVjdGlvbignc2hhcmUtcmVjb3JkJylcbiAgICAgICAgICAgICAgICAud2hlcmUoe1xuICAgICAgICAgICAgICAgICAgICBwaWQsXG4gICAgICAgICAgICAgICAgICAgIG9wZW5pZCxcbiAgICAgICAgICAgICAgICAgICAgaXNTdWNjZXNzOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICBzdWNjZXNzVGltZTogXy5ndGUoIGdldE5vdyggdHJ1ZSApIC0gMjQgKiA2MCAqIDYwICogMTAwMCApXG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAuY291bnQoICk7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGlmICggY291bnQyJC50b3RhbCA+IDAgKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGN0eC5ib2R5ID0geyBzdGF0dXM6IDIwMCB9O1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyDliJvlu7pcbiAgICAgICAgICAgIGNvbnN0IGNyZWF0ZSQgPSBhd2FpdCBkYi5jb2xsZWN0aW9uKCdzaGFyZS1yZWNvcmQnKVxuICAgICAgICAgICAgICAgIC5hZGQoe1xuICAgICAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBwaWQsXG4gICAgICAgICAgICAgICAgICAgICAgICBmcm9tLFxuICAgICAgICAgICAgICAgICAgICAgICAgb3BlbmlkLFxuICAgICAgICAgICAgICAgICAgICAgICAgaXNTdWNjZXNzOiBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGNyZWF0ZVRpbWU6IGdldE5vdyggdHJ1ZSApXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgcmV0dXJuIGN0eC5ib2R5ID0geyBzdGF0dXM6IDIwMCB9O1xuXG4gICAgICAgIH0gY2F0Y2ggKCBlICkge1xuICAgICAgICAgICAgcmV0dXJuIGN0eC5ib2R5ID0ge1xuICAgICAgICAgICAgICAgIHN0YXR1czogNTAwXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9KVxuXG4gICAgLyoqIFxuICAgICAqIEBkZXNjcmlwdGlvblxuICAgICAqIOiOt+WPluaOqOW5v+enr+WIhlxuICAgICAqIHtcbiAgICAgKiAgICBzaG93TW9yZT86IGZhbHNlXG4gICAgICogfVxuICAgICAqL1xuICAgIGFwcC5yb3V0ZXIoJ3B1c2gtaW50ZWdyYWwnLCBhc3luYyAoIGN0eCwgbmV4dCApID0+IHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGNvbnN0IHsgc2hvd01vcmUgfSA9IGV2ZW50LmRhdGE7XG4gICAgICAgICAgICBjb25zdCBvcGVuaWQgPSBldmVudC5kYXRhLm9wZW5JZCB8fCBldmVudC51c2VySW5mby5vcGVuSWQ7XG4gICAgICAgICAgICBjb25zdCB1c2VyJCA9IGF3YWl0IGRiLmNvbGxlY3Rpb24oJ3VzZXInKVxuICAgICAgICAgICAgICAgIC53aGVyZSh7XG4gICAgICAgICAgICAgICAgICAgIG9wZW5pZFxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLmdldCggKTtcbiAgICAgICAgICAgIGNvbnN0IHVzZXIgPSB1c2VyJC5kYXRhWyAwIF07XG5cbiAgICAgICAgICAgIGNvbnN0IGV4cCA9ICEhdXNlciA/IHVzZXIuZXhwIHx8IDAgOiAwO1xuICAgICAgICAgICAgY29uc3QgaW50ZWdyYWwgPSAhIXVzZXIgPyB1c2VyLnB1c2hfaW50ZWdyYWwgfHwgMCA6IDA7XG5cbiAgICAgICAgICAgIHJldHVybiBjdHguYm9keSA9IHtcbiAgICAgICAgICAgICAgICBzdGF0dXM6IDIwMCxcbiAgICAgICAgICAgICAgICBkYXRhOiAhc2hvd01vcmUgPyBcbiAgICAgICAgICAgICAgICAgICAgaW50ZWdyYWwgOlxuICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICBleHAsXG4gICAgICAgICAgICAgICAgICAgICAgICBpbnRlZ3JhbCxcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgIH0gY2F0Y2ggKCBlICkge1xuICAgICAgICAgICAgcmV0dXJuIGN0eC5ib2R5ID0geyBzdGF0dXM6IDUwMCB9O1xuICAgICAgICB9IFxuICAgIH0pXG5cbiAgICAvKipcbiAgICAgKiBAZGVzY3JpcHRpb25cbiAgICAgKiDojrflj5bnp6/liIbkvb/nlKjorrDlvZVcbiAgICAgKiB7XG4gICAgICogICAgdGlkczogJ2EsYixjJ1xuICAgICAqICAgIHR5cGU6ICdwdXNoX2ludGVncmFsJyB8ICcnXG4gICAgICogfVxuICAgICAqL1xuICAgIGFwcC5yb3V0ZXIoJ3B1c2gtaW50ZWdyYWwtdXNlJywgYXN5bmMgKCBjdHgsIG5leHQgKSA9PiB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBjb25zdCB7IHRpZHMsIHR5cGUgfSA9IGV2ZW50LmRhdGE7XG4gICAgICAgICAgICBjb25zdCBvcGVuaWQgPSBldmVudC5kYXRhLm9wZW5JZCB8fCBldmVudC5kYXRhLm9wZW5pZCB8fCBldmVudC51c2VySW5mby5vcGVuSWQ7XG5cbiAgICAgICAgICAgIGNvbnN0IGZpbmQkOiBhbnkgPSBhd2FpdCBQcm9taXNlLmFsbChcbiAgICAgICAgICAgICAgICB0aWRzLnNwbGl0KCcsJylcbiAgICAgICAgICAgICAgICAgICAgLm1hcCggdGlkID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBkYi5jb2xsZWN0aW9uKCdpbnRlZ3JhbC11c2UtcmVjb3JkJylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAud2hlcmUoe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aWQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9wZW5pZFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLmdldCggKTtcbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICk7XG5cbiAgICAgICAgICAgIGNvbnN0IG1ldGEgPSBmaW5kJFxuICAgICAgICAgICAgICAgIC5maWx0ZXIoIHggPT4gISF4LmRhdGFbIDAgXSlcbiAgICAgICAgICAgICAgICAubWFwKCB4ID0+IHguZGF0YVsgMCBdKTtcblxuICAgICAgICAgICAgcmV0dXJuIGN0eC5ib2R5ID0ge1xuICAgICAgICAgICAgICAgIGRhdGE6IG1ldGEsXG4gICAgICAgICAgICAgICAgc3RhdHVzOiAyMDBcbiAgICAgICAgICAgIH1cblxuICAgICAgICB9IGNhdGNoICggZSApIHtcbiAgICAgICAgICAgIHJldHVybiBjdHguYm9keSA9IHtcbiAgICAgICAgICAgICAgICBzdGF0dXM6IDUwMFxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSlcblxuICAgIC8qKlxuICAgICAqIEBkZXNjcmlwdGlvblxuICAgICAqIOWIm+W7uiDnp6/liIbkvb/nlKjorrDlvZVcbiAgICAgKiB7XG4gICAgICogICAgdGlkXG4gICAgICogICAgdmFsdWVcbiAgICAgKiAgICBvcGVuaWRcbiAgICAgKiB9XG4gICAgICovXG4gICAgYXBwLnJvdXRlcigncHVzaC1pbnRlZ3JhbC1jcmVhdGUnLCBhc3luYyAoIGN0eCwgbmV4dCApID0+IHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGNvbnN0IHsgdGlkLCB2YWx1ZSB9ID0gZXZlbnQuZGF0YTtcbiAgICAgICAgICAgIGNvbnN0IG9wZW5pZCA9IGV2ZW50LmRhdGEub3BlbklkIHx8IGV2ZW50LmRhdGEub3BlbmlkIHx8IGV2ZW50LnVzZXJJbmZvLm9wZW5JZDtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgaWYgKCAhdmFsdWUgKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGN0eC5ib2R5ID0ge1xuICAgICAgICAgICAgICAgICAgICBzdGF0dXM6IDIwMFxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8g5L2/55So6KGo5re75Yqg6K6w5b2VXG4gICAgICAgICAgICBjb25zdCByZWNvcmQkID0gYXdhaXQgZGIuY29sbGVjdGlvbignaW50ZWdyYWwtdXNlLXJlY29yZCcpXG4gICAgICAgICAgICAgICAgICAgIC53aGVyZSh7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aWQsXG4gICAgICAgICAgICAgICAgICAgICAgICBvcGVuaWQsXG4gICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiAncHVzaF9pbnRlZ3JhbCdcbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgLmdldCggKTtcbiAgICAgICAgICAgIGNvbnN0IHJlY29yZCA9IHJlY29yZCQuZGF0YVsgMCBdO1xuXG4gICAgICAgICAgICBpZiAoICEhcmVjb3JkICYmICEhdmFsdWUgKSB7XG4gICAgICAgICAgICAgICAgYXdhaXQgZGIuY29sbGVjdGlvbignaW50ZWdyYWwtdXNlLXJlY29yZCcpXG4gICAgICAgICAgICAgICAgICAgIC5kb2MoIFN0cmluZyggcmVjb3JkLl9pZCApKVxuICAgICAgICAgICAgICAgICAgICAudXBkYXRlKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZTogXy5pbmMoIHZhbHVlIClcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKCAhcmVjb3JkICYmICEhdmFsdWUgKSB7XG4gICAgICAgICAgICAgICAgYXdhaXQgZGIuY29sbGVjdGlvbignaW50ZWdyYWwtdXNlLXJlY29yZCcpXG4gICAgICAgICAgICAgICAgICAgIC5hZGQoe1xuICAgICAgICAgICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRpZCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvcGVuaWQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogJ3B1c2hfaW50ZWdyYWwnXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyDop5LoibLooajvvIzlh4/ljrvmirXnjrDph5FcbiAgICAgICAgICAgIGNvbnN0IHVzZXIkID0gYXdhaXQgZGIuY29sbGVjdGlvbigndXNlcicpXG4gICAgICAgICAgICAgICAgLndoZXJlKHtcbiAgICAgICAgICAgICAgICAgICAgb3BlbmlkXG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAuZ2V0KCApO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICBjb25zdCB1c2VyID0gdXNlciQuZGF0YVsgMCBdO1xuICAgICAgICAgICAgYXdhaXQgZGIuY29sbGVjdGlvbigndXNlcicpXG4gICAgICAgICAgICAgICAgLmRvYyggU3RyaW5nKCB1c2VyLl9pZCApKVxuICAgICAgICAgICAgICAgIC51cGRhdGUoe1xuICAgICAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBwdXNoX2ludGVncmFsOiBfLmluYyggLXZhbHVlIClcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pXG5cbiAgICAgICAgICAgIHJldHVybiBjdHguYm9keSA9IHtcbiAgICAgICAgICAgICAgICBzdGF0dXM6IDIwMFxuICAgICAgICAgICAgfVxuXG4gICAgICAgIH0gY2F0Y2ggKCBlICkge1xuICAgICAgICAgICAgcmV0dXJuIGN0eC5ib2R5ID0ge1xuICAgICAgICAgICAgICAgIHN0YXR1czogNTAwXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9KVxuXG4gICAgLyoqXG4gICAgICogQGRlc2NyaXB0aW9uXG4gICAgICog562+5Yiw6aKG56ev5YiGXG4gICAgICoge1xuICAgICAqICAgICAgZXhwOiBudW1iZXJcbiAgICAgKiB9XG4gICAgICovXG4gICAgYXBwLnJvdXRlcignZ2V0LWV4cCcsIGFzeW5jICggY3R4LCBuZXh0ICkgPT4ge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgY29uc3QgeyBleHAgfSA9IGV2ZW50LmRhdGE7XG4gICAgICAgICAgICBjb25zdCBvcGVuaWQgPSBldmVudC5kYXRhLm9wZW5JZCB8fCBldmVudC5kYXRhLm9wZW5pZCB8fCBldmVudC51c2VySW5mby5vcGVuSWQ7XG5cbiAgICAgICAgICAgIGNvbnN0IHVzZXIkID0gYXdhaXQgZGIuY29sbGVjdGlvbigndXNlcicpXG4gICAgICAgICAgICAgICAgLndoZXJlKHtcbiAgICAgICAgICAgICAgICAgICAgb3BlbmlkXG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAuZ2V0KCApO1xuXG4gICAgICAgICAgICBjb25zdCB1c2VyID0gdXNlciQuZGF0YVsgMCBdIHx8IG51bGw7XG5cbiAgICAgICAgICAgIGlmICggIXVzZXIgKSB7IHJldHVybiBjdHguYm9keSA9IHsgc3RhdHVzOiAyMDAgfX07XG5cbiAgICAgICAgICAgIGNvbnN0IGJkX3VpZCA9IHVzZXIuX2lkO1xuICAgICAgICAgICAgY29uc3QgYm9keSA9IHtcbiAgICAgICAgICAgICAgICAuLi51c2VyLFxuICAgICAgICAgICAgICAgIGV4cDogIXVzZXIuZXhwID8gZXhwIDogdXNlci5leHAgKyBleHBcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIGRlbGV0ZSBib2R5WydfaWQnXTtcblxuICAgICAgICAgICAgY29uc3QgdXBkYXRlJCA9IGF3YWl0IGRiLmNvbGxlY3Rpb24oJ3VzZXInKVxuICAgICAgICAgICAgICAgIC5kb2MoIFN0cmluZyggYmRfdWlkICkpXG4gICAgICAgICAgICAgICAgLnNldCh7XG4gICAgICAgICAgICAgICAgICAgIGRhdGE6IGJvZHlcbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgcmV0dXJuIGN0eC5ib2R5ID0ge1xuICAgICAgICAgICAgICAgIHN0YXR1czogMjAwXG4gICAgICAgICAgICB9O1xuXG4gICAgICAgIH0gY2F0Y2ggKCBlICkge1xuICAgICAgICAgICAgcmV0dXJuIGN0eC5ib2R5ID0geyBzdGF0dXM6IDUwMCB9O1xuICAgICAgICB9XG4gICAgfSlcblxuICAgIC8qKlxuICAgICAqIEBkZXNjcmlwdGlvblxuICAgICAqIOetvuWIsOmihuenr+WIhlxuICAgICAqIHtcbiAgICAgKiAgICAgIGludGVncmFsOiBudW1iZXJcbiAgICAgKiB9XG4gICAgICovXG4gICAgYXBwLnJvdXRlcignZ2V0LWludGVncmFsJywgYXN5bmMgKCBjdHgsIG5leHQgKSA9PiB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBjb25zdCB7IGludGVncmFsIH0gPSBldmVudC5kYXRhO1xuICAgICAgICAgICAgY29uc3Qgb3BlbmlkID0gZXZlbnQuZGF0YS5vcGVuSWQgfHwgZXZlbnQuZGF0YS5vcGVuaWQgfHwgZXZlbnQudXNlckluZm8ub3BlbklkO1xuXG4gICAgICAgICAgICBjb25zdCB1c2VyJCA9IGF3YWl0IGRiLmNvbGxlY3Rpb24oJ3VzZXInKVxuICAgICAgICAgICAgICAgIC53aGVyZSh7XG4gICAgICAgICAgICAgICAgICAgIG9wZW5pZFxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLmdldCggKTtcblxuICAgICAgICAgICAgY29uc3QgdXNlciA9IHVzZXIkLmRhdGFbIDAgXSB8fCBudWxsO1xuXG4gICAgICAgICAgICBpZiAoICF1c2VyICkgeyByZXR1cm4gY3R4LmJvZHkgPSB7IHN0YXR1czogMjAwIH19O1xuXG4gICAgICAgICAgICBjb25zdCBiZF91aWQgPSB1c2VyLl9pZDtcbiAgICAgICAgICAgIGNvbnN0IGJvZHkgPSB7XG4gICAgICAgICAgICAgICAgLi4udXNlcixcbiAgICAgICAgICAgICAgICBwdXNoX2ludGVncmFsOiAhdXNlci5wdXNoX2ludGVncmFsID8gXG4gICAgICAgICAgICAgICAgICAgIGludGVncmFsIDpcbiAgICAgICAgICAgICAgICAgICAgTnVtYmVyKCggdXNlci5wdXNoX2ludGVncmFsICsgaW50ZWdyYWwgKS50b0ZpeGVkKCAyICkpXG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICBkZWxldGUgYm9keVsnX2lkJ107XG5cbiAgICAgICAgICAgIGNvbnN0IHVwZGF0ZSQgPSBhd2FpdCBkYi5jb2xsZWN0aW9uKCd1c2VyJylcbiAgICAgICAgICAgICAgICAuZG9jKCBTdHJpbmcoIGJkX3VpZCApKVxuICAgICAgICAgICAgICAgIC5zZXQoe1xuICAgICAgICAgICAgICAgICAgICBkYXRhOiBib2R5XG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHJldHVybiBjdHguYm9keSA9IHtcbiAgICAgICAgICAgICAgICBzdGF0dXM6IDIwMFxuICAgICAgICAgICAgfTtcblxuICAgICAgICB9IGNhdGNoICggZSApIHtcbiAgICAgICAgICAgIHJldHVybiBjdHguYm9keSA9IHsgc3RhdHVzOiA1MDAgfTtcbiAgICAgICAgfVxuICAgIH0pXG5cbiAgICAvKipcbiAgICAgKiBAZGVzY3JpcHRpb25cbiAgICAgKiDpooblj5bmirXnjrDph5HmiJDlip/vvIzmjqjpgIFcbiAgICAgKiDlubborr7nva4y5bCP5pe25YCZ5ZCO55qE57uP6aqM6I635Y+W5o6o6YCBXG4gICAgICoge1xuICAgICAqICAgICAgc2lnbkV4cDog6aKG5Y+W55qE57uP6aqMXG4gICAgICogICAgICBnZXRfaW50ZWdyYWw6IG51bWJlciAvLyDmnKzmrKHojrflvpdcbiAgICAgKiAgICAgIG5leHRfaW50ZWdyYWw6IG51bWJlciAvLyDkuIvmrKHojrflvpdcbiAgICAgKiAgICAgIHdlZWtfaW50ZWdyYWw6IG51bWJlciAvLyDmnKzlkajojrflvpdcbiAgICAgKiAgICAgIG5leHR3ZWVrX2ludGVncmFsOiBudW1iZXIgLy8g5LiL5ZGo6I635b6XXG4gICAgICogfVxuICAgICAqL1xuICAgIGFwcC5yb3V0ZXIoJ2dldC1pbnRlZ3JhbC1wdXNoJywgYXN5bmMgKCBjdHgsIG5leHQgKSA9PiB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBjb25zdCBvcGVuaWQgPSBldmVudC5kYXRhLm9wZW5JZCB8fCBldmVudC5kYXRhLm9wZW5pZCB8fCBldmVudC51c2VySW5mby5vcGVuSWQ7XG4gICAgICAgICAgICBjb25zdCB7IHNpZ25FeHAsIGdldF9pbnRlZ3JhbCwgbmV4dF9pbnRlZ3JhbCwgd2Vla19pbnRlZ3JhbCwgbmV4dHdlZWtfaW50ZWdyYWwgfSA9IGV2ZW50LmRhdGE7XG5cbiAgICAgICAgICAgIC8vIDTjgIHosIPnlKjmjqjpgIFcbiAgICAgICAgICAgIGNvbnN0IHB1c2gkID0gYXdhaXQgY2xvdWQuY2FsbEZ1bmN0aW9uKHtcbiAgICAgICAgICAgICAgICBuYW1lOiAnY29tbW9uJyxcbiAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICAgICR1cmw6ICdwdXNoLXN1YnNjcmliZScsXG4gICAgICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG9wZW5pZCxcbiAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6ICdob25nYmFvJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIHBhZ2U6ICdwYWdlcy9teS9pbmRleCcsXG4gICAgICAgICAgICAgICAgICAgICAgICB0ZXh0czogW2DmiJDlip/pooblj5Yke2dldF9pbnRlZ3JhbH3lhYPmirXnjrDph5HvvIFgLCBg5LiL5Y2V5bCx6IO955So77yB5pys5ZGo55m76ZmG6YCBJHt3ZWVrX2ludGVncmFsfeWFg++8gWBdXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgLy8gNeOAgeaPkuWFpeiwg+eUqOagiFxuICAgICAgICAgICAgY29uc3QgY3JlYXRlJCA9IGF3YWl0IGRiLmNvbGxlY3Rpb24oJ3B1c2gtdGltZXInKVxuICAgICAgICAgICAgICAgIC5hZGQoe1xuICAgICAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBvcGVuaWQsXG4gICAgICAgICAgICAgICAgICAgICAgICB0ZXh0czogW2DnmbvpmYbpooblj5Yke3NpZ25FeHB954K557uP6aqMYCwgYOWNh+e6p+WQju+8jOWFqOWRqOWPr+mihiR7bmV4dHdlZWtfaW50ZWdyYWx95YWD77yBYF0sXG4gICAgICAgICAgICAgICAgICAgICAgICBwdXNodGltZTogZ2V0Tm93KCB0cnVlICkgKyAyLjEgKiA2MCAqIDYwICogMTAwMCxcbiAgICAgICAgICAgICAgICAgICAgICAgIGRlc2M6ICfliLDml7bpl7Tpooblj5bnu4/pqozkuoYnLFxuICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogJ3VzZXItZXhwLWdldCdcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICByZXR1cm4gY3R4LmJvZHkgPSB7IHN0YXR1czogMjAwIH07XG5cbiAgICAgICAgfSBjYXRjaCAoIGUgKSB7XG4gICAgICAgICAgICByZXR1cm4gY3R4LmJvZHkgPSB7IHN0YXR1czogNTAwIH07XG4gICAgICAgIH1cbiAgICB9KVxuXG4gICAgLyoqIFxuICAgICAqIEBkZXNjcmlwdGlvblxuICAgICAqIOiOt+WPluiuoumYheaooeadv+WIl+ihqFxuICAgICAqL1xuICAgIGFwcC5yb3V0ZXIoJ2dldC1zdWJzY3JpYmUtdGVtcGxhdGVzJywgYXN5bmMgKCBjdHgsIG5leHQgKSA9PiB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICByZXR1cm4gY3R4LmJvZHkgPSB7IFxuICAgICAgICAgICAgICAgIHN0YXR1czogMjAwLFxuICAgICAgICAgICAgICAgIGRhdGE6IENPTkZJRy5zdWJzY3JpYmVfdGVtcGxhdGVzXG4gICAgICAgICAgICB9O1xuICAgICAgICB9IGNhdGNoICggZSApIHtcbiAgICAgICAgICAgIHJldHVybiBjdHguYm9keSA9IHsgc3RhdHVzOiA1MDAgfTtcbiAgICAgICAgfVxuICAgIH0pXG5cbiAgICAvKipcbiAgICAgKiBAZGVzY3JpcHRpb25cbiAgICAgKiDmoLnmja5vcGVuaWTov5Tlm57nlKjmiLfkv6Hmga/vvIjlj6/ov5Tlm55udWxs77yJXG4gICAgICovXG4gICAgYXBwLnJvdXRlcignZ2V0LXVzZXItaW5mbycsIGFzeW5jICggY3R4LCBuZXh0ICkgPT4ge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgY29uc3Qgb3BlbmlkID0gZXZlbnQuZGF0YS5vcGVuSWQgfHwgZXZlbnQuZGF0YS5vcGVuaWQgfHwgZXZlbnQudXNlckluZm8ub3BlbklkO1xuICAgICAgICAgICAgY29uc3QgdXNlciQgPSBhd2FpdCBkYi5jb2xsZWN0aW9uKCd1c2VyJylcbiAgICAgICAgICAgICAgICAud2hlcmUoe1xuICAgICAgICAgICAgICAgICAgICBvcGVuaWRcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIC5nZXQoICk7XG5cbiAgICAgICAgICAgIGNvbnN0IGRhdGEgPSB1c2VyJC5kYXRhWyAwIF0gfHwgbnVsbDtcblxuICAgICAgICAgICAgLy8g5p+l6K+i5piv5ZCm5Li6YWRtXG4gICAgICAgICAgICBpZiAoICEhZGF0YSApIHtcblxuICAgICAgICAgICAgICAgIGNvbnN0IGFkbSQgPSBhd2FpdCBkYi5jb2xsZWN0aW9uKCdtYW5hZ2VyLW1lbWJlcicpXG4gICAgICAgICAgICAgICAgICAgIC53aGVyZSgoe1xuICAgICAgICAgICAgICAgICAgICAgICAgb3BlbmlkOiBkYXRhLm9wZW5pZFxuICAgICAgICAgICAgICAgICAgICB9KSlcbiAgICAgICAgICAgICAgICAgICAgLmNvdW50KCApO1xuXG4gICAgICAgICAgICAgICAgcmV0dXJuIGN0eC5ib2R5ID0ge1xuICAgICAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAuLi5kYXRhLFxuICAgICAgICAgICAgICAgICAgICAgICAgcm9sZTogYWRtJC50b3RhbCA+IDAgPyAxIDogMFxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICBzdGF0dXM6IDIwMFxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGN0eC5ib2R5ID0ge1xuICAgICAgICAgICAgICAgICAgICBkYXRhOiBudWxsLFxuICAgICAgICAgICAgICAgICAgICBzdGF0dXM6IDIwMFxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBjYXRjaCAoIGUgKSB7XG4gICAgICAgICAgICByZXR1cm4gY3R4LmJvZHkgPSB7XG4gICAgICAgICAgICAgICAgc3RhdHVzOiAyMDAsXG4gICAgICAgICAgICAgICAgZGF0YTogZVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSlcblxuICAgIC8qKiBcbiAgICAgKiBAZGVzY3JpcHRpb25cbiAgICAgKiDmtYvor5XkuJPnlKhcbiAgICAgKi9cbiAgICBhcHAucm91dGVyKCd0ZXN0JywgYXN5bmMgKCBjdHgsIG5leHQgKSA9PiB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIC8vIOaJvuWIsOaYqOaZmuS4i+WNiDbngrnlkI7nmoTml7bpl7TmiLNcbiAgICAgICAgICAgIGNvbnN0IG5vd1RpbWUgPSBnZXROb3coICk7XG4gICAgICAgICAgICBjb25zdCB5ID0gbm93VGltZS5nZXRGdWxsWWVhciggKTtcbiAgICAgICAgICAgIGNvbnN0IG0gPSBub3dUaW1lLmdldE1vbnRoKCApICsgMTtcbiAgICAgICAgICAgIGNvbnN0IGQgPSBub3dUaW1lLmdldERhdGUoICk7XG4gICAgICAgICAgICBjb25zdCBsYXN0TmlnaHRUaW1lID0gbmV3IERhdGUoYCR7eX0vJHttfS8ke2R9IDAwOjAwOjAwYCk7XG4gICAgICAgICAgICBjb25zdCB0aW1lID0gbGFzdE5pZ2h0VGltZS5nZXRUaW1lKCApIC0gNiAqIDYwICogNjAgKiAxMDAwO1xuXG4gICAgICAgICAgICAvLyDmiorov5nkuKrml7bpl7Tngrnku6XlkI7nmoTmn6XnnIvllYblk4HorrDlvZXpg73mi7/lh7rmnaVcbiAgICAgICAgICAgIGNvbnN0IHZpc2l0b3JSZWNvcmRzJCA9IGF3YWl0IGRiLmNvbGxlY3Rpb24oJ2dvb2QtdmlzaXRpbmctcmVjb3JkJylcbiAgICAgICAgICAgICAgICAud2hlcmUoe1xuICAgICAgICAgICAgICAgICAgICB2aXNpdFRpbWU6IF8uZ3RlKCB0aW1lIClcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIC5maWVsZCh7XG4gICAgICAgICAgICAgICAgICAgIHBpZDogdHJ1ZVxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLmdldCggKTtcbiAgICAgICAgICAgIGNvbnN0IHZpc2l0b3JSZWNvcmRzID0gdmlzaXRvclJlY29yZHMkLmRhdGE7XG5cbiAgICAgICAgICAgIC8vIOaLv+WIsOa1j+iniOiusOW9leacgOmrmOeahOWVhuWTgVxuICAgICAgICAgICAgbGV0IG1heFBpZCA9ICcnO1xuICAgICAgICAgICAgbGV0IG1heE51bSA9IDA7XG4gICAgICAgICAgICB2aXNpdG9yUmVjb3Jkcy5yZWR1Y2UoKCByZXMsIHJlY29yZCApID0+IHtcbiAgICAgICAgICAgICAgICByZXNbIHJlY29yZC5waWQgXSA9ICFyZXNbIHJlY29yZC5waWQgXSA/IDEgOiByZXNbIHJlY29yZC5waWQgXSArIDE7XG4gICAgICAgICAgICAgICAgaWYgKCByZXNbIHJlY29yZC5waWQgXSA+IG1heE51bSApIHtcbiAgICAgICAgICAgICAgICAgICAgbWF4UGlkID0gcmVjb3JkLnBpZDtcbiAgICAgICAgICAgICAgICAgICAgbWF4TnVtID0gcmVzWyByZWNvcmQucGlkIF07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiByZXM7XG4gICAgICAgICAgICB9LCB7IH0pO1xuXG4gICAgICAgICAgICAvLyDoi6XmnInvvIzojrflj5bov5nkuKrllYblk4HnmoTmgLvmi7zlm6LkurrmlbBcbiAgICAgICAgICAgIGlmICggIW1heE51bSB8fCAhbWF4UGlkICkge1xuICAgICAgICAgICAgICAgIHJldHVybiBjdHguYm9keSA9IHsgc3RhdHVzOiAyMDAgfVxuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgLy8g6YC76L6R77ya6YCa6L+Hb3JkZXLnmoRjcmVhdGV0aW1l5om+5YiwdGlk77yMIOmAmui/hyB0aWQrIHBpZCDmib7liLBzaG9wcGluZ2xpc3RcbiAgICAgICAgICAgIGNvbnN0IG9yZGVyJCA9IGF3YWl0IGRiLmNvbGxlY3Rpb24oJ29yZGVyJylcbiAgICAgICAgICAgICAgICAud2hlcmUoe1xuICAgICAgICAgICAgICAgICAgICBjcmVhdGVUaW1lOiBfLmd0ZSggdGltZSApXG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAuZmllbGQoe1xuICAgICAgICAgICAgICAgICAgICB0aWQ6IHRydWVcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIC5saW1pdCggMSApXG4gICAgICAgICAgICAgICAgLmdldCggKTtcbiAgICAgICAgICAgIGNvbnN0IG9yZGVyID0gb3JkZXIkLmRhdGFbIDAgXTtcblxuICAgICAgICAgICAgaWYgKCBvcmRlciQuZGF0YS5sZW5ndGggPT09IDAgKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGN0eC5ib2R5ID0geyBzdGF0dXM6IDIwMCB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGNvbnN0IHNsJCA9IGF3YWl0IGRiLmNvbGxlY3Rpb24oJ3Nob3BwaW5nLWxpc3QnKVxuICAgICAgICAgICAgICAgIC53aGVyZSh7XG4gICAgICAgICAgICAgICAgICAgIHBpZDogbWF4UGlkLFxuICAgICAgICAgICAgICAgICAgICB0aWQ6IG9yZGVyLnRpZFxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLmZpZWxkKHtcbiAgICAgICAgICAgICAgICAgICAgdWlkczogdHJ1ZVxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLmdldCggKTtcbiAgICAgICAgICAgIGNvbnN0IHNsID0gc2wkLmRhdGFbIDAgXTtcblxuICAgICAgICAgICAgaWYgKCBzbCQuZGF0YS5sZW5ndGggPT09IDAgKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGN0eC5ib2R5ID0geyBzdGF0dXM6IDIwMCB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIOiOt+WPluaJgOacieeuoeeQhuWRmFxuICAgICAgICAgICAgY29uc3QgYWRtcyQgPSBhd2FpdCBkYi5jb2xsZWN0aW9uKCdtYW5hZ2VyLW1lbWJlcicpXG4gICAgICAgICAgICAgICAgLndoZXJlKHsgfSlcbiAgICAgICAgICAgICAgICAuZ2V0KCApO1xuXG4gICAgICAgICAgICAvLyDojrflj5bllYblk4Hor6bmg4VcbiAgICAgICAgICAgIGNvbnN0IGdvb2QkID0gYXdhaXQgZGIuY29sbGVjdGlvbignZ29vZHMnKVxuICAgICAgICAgICAgICAgIC5kb2MoIFN0cmluZyggbWF4UGlkICkpXG4gICAgICAgICAgICAgICAgLmZpZWxkKHtcbiAgICAgICAgICAgICAgICAgICAgdGl0bGU6IHRydWVcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIC5nZXQoICk7XG5cbiAgICAgICAgICAgIC8vIOaOqOmAgVxuICAgICAgICAgICAgYXdhaXQgUHJvbWlzZS5hbGwoXG4gICAgICAgICAgICAgICAgYWRtcyQuZGF0YS5tYXAoIGFzeW5jIGFkbSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGF3YWl0IGNsb3VkLmNhbGxGdW5jdGlvbih7XG4gICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiAnY29tbW9uJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkdXJsOiAncHVzaC1zdWJzY3JpYmUnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb3BlbmlkOiBhZG0ub3BlbmlkLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiAnd2FpdFBpbicsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhZ2U6IGBwYWdlcy9tYW5hZ2VyLXRyaXAtb3JkZXIvaW5kZXg/aWQ9JHtvcmRlci50aWR9YCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGV4dHM6IFtg5pio5aSp5pyJJHttYXhOdW195Lq65rWP6KeI77yMJHtzbC51aWRzLmxlbmd0aH3kurrmiJDlip8ke3NsLnVpZHMubGVuZ3RoID4gMSA/ICfmi7zlm6LvvIEnIDogJ+S4i+WNle+8gSd9YCwgYCR7Z29vZCQuZGF0YS50aXRsZX1gXVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgKTtcblxuICAgICAgICAgICAgcmV0dXJuIGN0eC5ib2R5ID0ge1xuICAgICAgICAgICAgICAgIHN0YXR1czogMjAwXG4gICAgICAgICAgICB9XG4gICAgICAgIH0gY2F0Y2ggKCBlICkge1xuICAgICAgICAgICAgcmV0dXJuIGN0eC5ib2R5ID0geyBcbiAgICAgICAgICAgICAgICBzdGF0dXM6IDUwMCxcbiAgICAgICAgICAgICAgICBkYXRhOiBlXG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgfSlcblxuICAgIHJldHVybiBhcHAuc2VydmUoICk7XG5cbn1cblxuY29uc3QgdGltZSA9IHRzID0+IG5ldyBQcm9taXNlKCByZXNvdmxlID0+IHtcbiAgICBzZXRUaW1lb3V0KCggKSA9PiByZXNvdmxlKCApLCB0cyApO1xufSlcblxuLyoqXG4gKiDliJ3lp4vljJbmlbDmja7lupPjgIHln7rnoYDmlbDmja5cbiAqL1xuY29uc3QgaW5pdERCID0gKCApID0+IG5ldyBQcm9taXNlKCBhc3luYyByZXNvbHZlID0+IHtcbiAgICB0cnkge1xuXG4gICAgICAgIC8qKiDliJ3lp4vljJbooaggKi9cbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGNvbnN0IGNvbGxlY3Rpb25zID0gQ09ORklHLmNvbGxlY3Rpb25zO1xuICAgICAgICAgICAgYXdhaXQgUHJvbWlzZS5hbGwoXG4gICAgICAgICAgICAgICAgY29sbGVjdGlvbnMubWFwKCBjb2xsZWN0aW9uTmFtZSA9PiAoZGIgYXMgYW55KS5jcmVhdGVDb2xsZWN0aW9uKCBjb2xsZWN0aW9uTmFtZSApKVxuICAgICAgICAgICAgKTtcbiAgICAgICAgfSBjYXRjaCAoIGUgKSB7IH1cblxuICAgICAgICBhd2FpdCB0aW1lKCA4MDAgKTtcblxuICAgICAgICAvKiog5Yid5aeL5YyW5pWw5o2u5a2X5YW4ICovXG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBjb25zdCBkaWNzID0gQ09ORklHLmRpYztcbiAgICAgICAgICAgIGF3YWl0IFByb21pc2UuYWxsKFxuICAgICAgICAgICAgICAgIGRpY3MubWFwKCBhc3luYyBkaWNTZXQgPT4ge1xuXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHRhcmdldERpYyQgPSBhd2FpdCBkYi5jb2xsZWN0aW9uKCdkaWMnKVxuICAgICAgICAgICAgICAgICAgICAgICAgLndoZXJlKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBiZWxvbmc6IGRpY1NldC5iZWxvbmdcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgICAgICAuZ2V0KCApO1xuXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHRhcmdldERpYyA9IHRhcmdldERpYyQuZGF0YVsgMCBdO1xuICAgICAgICAgICAgICAgICAgICBpZiAoICEhdGFyZ2V0RGljICkge1xuICAgICAgICAgICAgICAgICAgICAgICAgYXdhaXQgZGIuY29sbGVjdGlvbignZGljJylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAuZG9jKCBTdHJpbmcoIHRhcmdldERpYy5faWQgKSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAuc2V0KHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YTogZGljU2V0XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGF3YWl0IGRiLmNvbGxlY3Rpb24oJ2RpYycpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLmFkZCh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGE6IGRpY1NldFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICk7XG4gICAgICAgIH0gY2F0Y2ggKCBlICkge1xuICAgICAgICAgICAgY29uc29sZS5sb2coJ2VlZScsIGUgKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8qKiDliJ3lp4vljJblupTnlKjphY3nva4gKi9cbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGNvbnN0IGFwcENvbmYgPSBDT05GSUcuYXBwQ29uZnM7XG4gICAgICAgICAgICBhd2FpdCBQcm9taXNlLmFsbChcbiAgICAgICAgICAgICAgICBhcHBDb25mLm1hcCggYXN5bmMgY29uZiA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHRhcmdldENvbmYkID0gYXdhaXQgZGIuY29sbGVjdGlvbignYXBwLWNvbmZpZycpXG4gICAgICAgICAgICAgICAgICAgICAgICAud2hlcmUoe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6IGNvbmYudHlwZVxuICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgICAgIC5nZXQoICk7XG5cbiAgICAgICAgICAgICAgICAgICAgY29uc3QgdGFyZ2V0Q29uZiA9IHRhcmdldENvbmYkLmRhdGFbIDAgXTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCAhIXRhcmdldENvbmYgKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyDnlLHkuo7phY3nva7lt7Lnu4/nlJ/mlYjkuJTmipXlhaXkvb/nlKjvvIzov5nph4zkuI3og73nm7TmjqXmm7TmlLnlt7LmnInnmoTnur/kuIrphY3nva5cbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGF3YWl0IGRiLmNvbGxlY3Rpb24oJ2FwcC1jb25maWcnKVxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gICAgIC5kb2MoIFN0cmluZyggdGFyZ2V0Q29uZi5faWQgKSlcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vICAgICAuc2V0KHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vICAgICAgICAgZGF0YTogY29uZlxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBhd2FpdCBkYi5jb2xsZWN0aW9uKCdhcHAtY29uZmlnJylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAuYWRkKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YTogY29uZlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICk7XG4gICAgICAgIH0gY2F0Y2ggKCBlICkge1xuICAgICAgICAgICAgY29uc29sZS5sb2coJ2VlZScsIGUgKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJlc29sdmUoICk7XG5cbiAgICB9IGNhdGNoICggZSApIHsgcmVzb2x2ZSggKTt9XG59KTsiXX0=