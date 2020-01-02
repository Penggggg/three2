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
        app.router('get-exp', function (ctx, next) { return __awaiter(void 0, void 0, void 0, function () {
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
                        e_27 = _a.sent();
                        return [2, ctx.body = { status: 500 }];
                    case 4: return [2];
                }
            });
        }); });
        app.router('get-integral', function (ctx, next) { return __awaiter(void 0, void 0, void 0, function () {
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
                        e_28 = _a.sent();
                        return [2, ctx.body = { status: 500 }];
                    case 4: return [2];
                }
            });
        }); });
        app.router('get-integral-push', function (ctx, next) { return __awaiter(void 0, void 0, void 0, function () {
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
        app.router('test', function (ctx, next) { return __awaiter(void 0, void 0, void 0, function () {
            var nowTime, y, m, d, lastNightTime, time_1, visitorRecords$, visitorRecords, maxPid_1, maxNum_1, order$, order_1, sl$, sl_1, adms$, good$_1, e_31;
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
                                                    $url: 'push-subscribe-cloud',
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
                        e_31 = _a.sent();
                        return [2, ctx.body = {
                                status: 500,
                                data: e_31
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
    var collections, e_32, dics, e_33, appConf, e_34, e_35;
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
                e_33 = _a.sent();
                console.log('eee', e_33);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSxxQ0FBdUM7QUFDdkMsc0NBQXdDO0FBQ3hDLDZCQUErQjtBQUMvQiwrQkFBaUM7QUFDakMsb0NBQXNDO0FBQ3RDLGlDQUFtQztBQUVuQyxLQUFLLENBQUMsSUFBSSxDQUFDO0lBQ1AsR0FBRyxFQUFFLE9BQU8sQ0FBQyxHQUFHLENBQUMsS0FBSztDQUN6QixDQUFDLENBQUM7QUFFSCxJQUFNLEVBQUUsR0FBZ0IsS0FBSyxDQUFDLFFBQVEsRUFBRyxDQUFDO0FBQzFDLElBQU0sQ0FBQyxHQUFHLEVBQUUsQ0FBQyxPQUFPLENBQUM7QUFRckIsSUFBTSxNQUFNLEdBQUcsVUFBRSxFQUFVO0lBQVYsbUJBQUEsRUFBQSxVQUFVO0lBQ3ZCLElBQUssRUFBRSxFQUFHO1FBQ04sT0FBTyxJQUFJLENBQUMsR0FBRyxFQUFHLENBQUM7S0FDdEI7SUFDRCxJQUFNLE1BQU0sR0FBRyxJQUFJLElBQUksQ0FBRSxJQUFJLElBQUksRUFBRyxDQUFDLGNBQWMsRUFBRyxDQUFDLENBQUM7SUFDeEQsT0FBTyxJQUFJLElBQUksQ0FBRSxNQUFNLENBQUMsT0FBTyxFQUFHLEdBQUcsQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsSUFBSSxDQUFFLENBQUE7QUFDN0QsQ0FBQyxDQUFBO0FBS1ksUUFBQSxJQUFJLEdBQUcsVUFBUSxLQUFLLEVBQUUsT0FBTzs7O1FBRWhDLEdBQUcsR0FBRyxJQUFJLFNBQVMsQ0FBQyxFQUFFLEtBQUssT0FBQSxFQUFFLENBQUMsQ0FBQztRQU1yQyxHQUFHLENBQUMsTUFBTSxDQUFDLE1BQU0sRUFBRSxVQUFPLEdBQUcsRUFBRSxJQUFJOzs7Ozs7d0JBRXJCLFdBQVcsR0FBRyxNQUFNLENBQUMsV0FBVyxDQUFD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QUNyQixHQUFHLENBQUM7d0NBQ0QsSUFBSSxFQUFFLE1BQU07cUNBQ2YsQ0FBQyxFQUFBOztvQ0FITixTQUdNLENBQUM7Ozs7O3lCQUVkLENBQUMsQ0FDTCxFQUFBOztnQkF4QkQsU0F3QkMsQ0FBQzs7OztnQkFFRixPQUFPLENBQUMsR0FBRyxDQUFDLEtBQUssRUFBRSxJQUFDLENBQUUsQ0FBQzs7OztnQkFLakIsT0FBTyxHQUFHLE1BQU0sQ0FBQyxRQUFRLENBQUM7Z0JBQ2hDLFdBQU0sT0FBTyxDQUFDLEdBQUcsQ0FDYixPQUFPLENBQUMsR0FBRyxDQUFFLFVBQU0sSUFBSTs7Ozt3Q0FDQyxXQUFNLEVBQUUsQ0FBQyxVQUFVLENBQUMsWUFBWSxDQUFDO3lDQUNoRCxLQUFLLENBQUM7d0NBQ0gsSUFBSSxFQUFFLElBQUksQ0FBQyxJQUFJO3FDQUNsQixDQUFDO3lDQUNELEdBQUcsRUFBRyxFQUFBOztvQ0FKTCxXQUFXLEdBQUcsU0FJVDtvQ0FFTCxVQUFVLEdBQUcsV0FBVyxDQUFDLElBQUksQ0FBRSxDQUFDLENBQUUsQ0FBQzt5Q0FDcEMsQ0FBQyxDQUFDLFVBQVUsRUFBWixjQUFZOzt3Q0FTYixXQUFNLEVBQUUsQ0FBQyxVQUFVLENBQUMsWUFBWSxDQUFDO3lDQUM1QixHQUFHLENBQUM7d0NBQ0QsSUFBSSxFQUFFLElBQUk7cUNBQ2IsQ0FBQyxFQUFBOztvQ0FITixTQUdNLENBQUM7Ozs7O3lCQUVkLENBQUMsQ0FDTCxFQUFBOztnQkF4QkQsU0F3QkMsQ0FBQzs7OztnQkFFRixPQUFPLENBQUMsR0FBRyxDQUFDLEtBQUssRUFBRSxJQUFDLENBQUUsQ0FBQzs7O2dCQUczQixPQUFPLEVBQUcsQ0FBQzs7OztnQkFFQyxPQUFPLEVBQUcsQ0FBQzs7Ozs7S0FDOUIsQ0FBQyxFQWhGb0IsQ0FnRnBCLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBjbG91ZCBmcm9tICd3eC1zZXJ2ZXItc2RrJztcbmltcG9ydCAqIGFzIFRjYlJvdXRlciBmcm9tICd0Y2Itcm91dGVyJztcbmltcG9ydCAqIGFzIGF4aW9zIGZyb20gJ2F4aW9zJztcbmltcG9ydCAqIGFzIGNyeXB0byBmcm9tICdjcnlwdG8nO1xuaW1wb3J0ICogYXMgcnAgZnJvbSAncmVxdWVzdC1wcm9taXNlJztcbmltcG9ydCAqIGFzIENPTkZJRyBmcm9tICcuL2NvbmZpZyc7XG5cbmNsb3VkLmluaXQoe1xuICAgIGVudjogcHJvY2Vzcy5lbnYuY2xvdWRcbn0pO1xuXG5jb25zdCBkYjogREIuRGF0YWJhc2UgPSBjbG91ZC5kYXRhYmFzZSggKTtcbmNvbnN0IF8gPSBkYi5jb21tYW5kO1xuXG4vKiogXG4gKiDovazmjaLmoLzmnpflsLzmsrvml7bljLogKzjml7bljLpcbiAqIERhdGUoKS5ub3coKSAvIG5ldyBEYXRlKCkuZ2V0VGltZSgpIOaYr+aXtuS4jeaXtuato+W4uOeahCs4XG4gKiBEYXRlLnRvTG9jYWxTdHJpbmcoICkg5aW95YOP5piv5LiA55u05pivKzDnmoRcbiAqIOWFiOaLv+WIsCArMO+8jOeEtuWQjis4XG4gKi9cbmNvbnN0IGdldE5vdyA9ICggdHMgPSBmYWxzZSApOiBhbnkgPT4ge1xuICAgIGlmICggdHMgKSB7XG4gICAgICAgIHJldHVybiBEYXRlLm5vdyggKTtcbiAgICB9XG4gICAgY29uc3QgdGltZV8wID0gbmV3IERhdGUoIG5ldyBEYXRlKCApLnRvTG9jYWxlU3RyaW5nKCApKTtcbiAgICByZXR1cm4gbmV3IERhdGUoIHRpbWVfMC5nZXRUaW1lKCApICsgOCAqIDYwICogNjAgKiAxMDAwIClcbn1cbi8qKlxuICogQGRlc2NyaXB0aW9uIFxuICog5YWs5YWx5qih5Z2XXG4gKi9cbmV4cG9ydCBjb25zdCBtYWluID0gYXN5bmMgKCBldmVudCwgY29udGV4dCApID0+IHtcblxuICAgIGNvbnN0IGFwcCA9IG5ldyBUY2JSb3V0ZXIoeyBldmVudCB9KTtcblxuICAgIC8qKlxuICAgICAqIEBkZXNjcmlwdGlvblxuICAgICAqIOWIneWni+WMluWQhOS4quaVsOaNruW6k1xuICAgICAqL1xuICAgIGFwcC5yb3V0ZXIoJ2luaXQnLCBhc3luYyggY3R4LCBuZXh0ICkgPT4ge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgY29uc3QgY29sbGVjdGlvbnMgPSBDT05GSUcuY29sbGVjdGlvbnM7XG4gICAgICAgICAgICBhd2FpdCBQcm9taXNlLmFsbChbXG4gICAgICAgICAgICAgICAgY29sbGVjdGlvbnMubWFwKCBjb2xsZWN0aW9uTmFtZSA9PiAoZGIgYXMgYW55KS5jcmVhdGVDb2xsZWN0aW9uKCBjb2xsZWN0aW9uTmFtZSApKVxuICAgICAgICAgICAgXSlcblxuICAgICAgICAgICAgcmV0dXJuIGN0eC5ib2R5ID0geyBzdGF0dXM6IDIwMCB9XG4gICAgICAgIH0gY2F0Y2ggKCBlICkge1xuICAgICAgICAgICAgcmV0dXJuIGN0eC5ib2R5ID0geyBzdGF0dXM6IDUwMCwgbWVzc2FnZTogZSB9XG4gICAgICAgIH1cbiAgICB9KVxuXG4gICAgLyoqXG4gICAgICogQGRlc2NyaXB0aW9uIFxuICAgICAqIOaVsOaNruWtl+WFuFxuICAgICAqIHtcbiAgICAgKiAgICAgIGRpY05hbWU6ICd4eHgseXl5LHp6eidcbiAgICAgKiAgICAgIGZpbHRlckJqcDogZmFsc2UgfCB0cnVlIHwgdW5kZWZpbmVkIO+8iCDmmK/lkKbov4fmu6Tkv53lgaXlk4Eg77yJXG4gICAgICogfVxuICAgICAqL1xuICAgIGFwcC5yb3V0ZXIoJ2RpYycsIGFzeW5jKCBjdHgsIG5leHQgKSA9PiB7XG4gICAgICAgIHRyeSB7XG5cbiAgICAgICAgICAgIC8vIOS/neWBpeWTgemFjee9rlxuICAgICAgICAgICAgbGV0IGJqcENvbmZpZzogYW55ID0gbnVsbDtcbiAgICAgICAgICAgIGNvbnN0IHsgZGljTmFtZSwgZmlsdGVyQmpwIH0gPSBldmVudC5kYXRhO1xuICAgICAgICAgICAgY29uc3QgZGJSZXMgPSBhd2FpdCBkYi5jb2xsZWN0aW9uKCdkaWMnKVxuICAgICAgICAgICAgICAgIC53aGVyZSh7XG4gICAgICAgICAgICAgICAgICAgIGJlbG9uZzogZGIuUmVnRXhwKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlZ2V4cDogZGljTmFtZS5yZXBsYWNlKC9cXCwvZywgJ3wnKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIG9wdGlvbmQ6ICdpJ1xuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLmdldCggKTtcblxuICAgICAgICAgICAgLy8g5L+d5YGl5ZOB6YWN572uXG4gICAgICAgICAgICBpZiAoICEhZmlsdGVyQmpwICkge1xuICAgICAgICAgICAgICAgIGNvbnN0IGJqcENvbmZpZyQgPSBhd2FpdCBkYi5jb2xsZWN0aW9uKCdhcHAtY29uZmlnJylcbiAgICAgICAgICAgICAgICAgICAgLndoZXJlKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6ICdhcHAtYmpwLXZpc2libGUnXG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgIC5nZXQoICk7XG4gICAgICAgICAgICAgICAgYmpwQ29uZmlnID0gYmpwQ29uZmlnJC5kYXRhWyAwIF07XG4gICAgICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICAgICAgbGV0IHJlc3VsdCA9IHsgfTtcbiAgICAgICAgICAgIGRiUmVzLmRhdGEubWFwKCBkaWMgPT4ge1xuICAgICAgICAgICAgICAgIHJlc3VsdCA9IE9iamVjdC5hc3NpZ24oeyB9LCByZXN1bHQsIHtcbiAgICAgICAgICAgICAgICAgICAgWyBkaWMuYmVsb25nIF06IGRpY1sgZGljLmJlbG9uZyBdXG4gICAgICAgICAgICAgICAgICAgICAgICAuZmlsdGVyKCB4ID0+ICEheCApXG4gICAgICAgICAgICAgICAgICAgICAgICAuZmlsdGVyKCB4ID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoICEhYmpwQ29uZmlnICYmICFianBDb25maWcudmFsdWUgKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBTdHJpbmcoIHgudmFsdWUgKSAhPT0gJzQnXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICByZXR1cm4gY3R4LmJvZHkgPSB7XG4gICAgICAgICAgICAgICAgc3RhdHVzOiAyMDAsXG4gICAgICAgICAgICAgICAgZGF0YTogcmVzdWx0XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgIH0gY2F0Y2ggKCBlICkge1xuICAgICAgICAgICAgcmV0dXJuIGN0eC5ib2R5ID0ge1xuICAgICAgICAgICAgICAgIHN0YXR1czogNTAwLFxuICAgICAgICAgICAgICAgIG1lc3NhZ2U6IGVcbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgIC8qKlxuICAgICAqIEBkZXNjcmlwdGlvblxuICAgICAqIOW+ruS/oeeUqOaIt+S/oeaBr+WtmOWCqFxuICAgICAqL1xuICAgIGFwcC5yb3V0ZXIoJ3VzZXJFZGl0JywgYXN5bmMoIGN0eCwgbmV4dCApID0+IHtcbiAgICAgICAgdHJ5IHtcblxuICAgICAgICAgICAgY29uc3Qgb3BlbmlkID0gZXZlbnQudXNlckluZm8ub3BlbklkO1xuICAgICAgICAgICAgY29uc3QgZGF0YSQgPSBhd2FpdCBkYi5jb2xsZWN0aW9uKCd1c2VyJylcbiAgICAgICAgICAgICAgICAud2hlcmUoe1xuICAgICAgICAgICAgICAgICAgICBvcGVuaWRcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIC5nZXQoIClcbiAgICAgICAgICAgICAgICAuY2F0Y2goIGVyciA9PiB7IHRocm93IGAke2Vycn1gfSk7XG4gICAgICAgIFxuICAgICAgICAgICAgLy8g5aaC5p6c5LiN5a2Y5Zyo77yM5YiZ5Yib5bu6XG4gICAgICAgICAgICBpZiAoIGRhdGEkLmRhdGEubGVuZ3RoID09PSAwICkge1xuICAgICAgICBcbiAgICAgICAgICAgICAgICBhd2FpdCBkYi5jb2xsZWN0aW9uKCd1c2VyJylcbiAgICAgICAgICAgICAgICAgICAgLmFkZCh7XG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRhOiBPYmplY3QuYXNzaWduKHsgfSwgZXZlbnQuZGF0YSwgeyBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvcGVuaWQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaW50ZWdyYWw6IDBcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgIH0pLmNhdGNoKCBlcnIgPT4geyB0aHJvdyBgJHtlcnJ9YH0pO1xuICAgICAgICBcbiAgICAgICAgICAgIC8vIOWmguaenOWtmOWcqO+8jOWImeabtOaWsFxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBjb25zdCBtZXRhID0gT2JqZWN0LmFzc2lnbih7IH0sIGRhdGEkLmRhdGFbIDAgXSwgZXZlbnQuZGF0YSApO1xuICAgICAgICAgICAgICAgIGRlbGV0ZSBtZXRhLl9pZDtcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICBhd2FpdCBkYi5jb2xsZWN0aW9uKCd1c2VyJykuZG9jKCggZGF0YSQuZGF0YVsgMCBdIGFzIGFueSkuX2lkIClcbiAgICAgICAgICAgICAgICAgICAgLnNldCh7XG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRhOiBPYmplY3QuYXNzaWduKHsgfSwgbWV0YSwge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGludGVncmFsOiBkYXRhJC5kYXRhWyAwIF0uaW50ZWdyYWxcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgIH0pLmNhdGNoKCBlcnIgPT4geyB0aHJvdyBgJHtlcnJ9YH0pO1xuICAgICAgICAgICAgfSAgICBcblxuICAgICAgICAgICAgcmV0dXJuIGN0eC5ib2R5ID0ge1xuICAgICAgICAgICAgICAgIHN0YXR1czogMjAwXG4gICAgICAgICAgICB9O1xuXG4gICAgICAgIH0gY2F0Y2ggKCBlICkge1xuICAgICAgICAgICAgcmV0dXJuIGN0eC5ib2R5ID0ge1xuICAgICAgICAgICAgICAgIHN0YXR1czogNTAwLFxuICAgICAgICAgICAgICAgIG1lc3NhZ2U6IGVcbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgIC8qKlxuICAgICAqIEBkZXNjcmlwdGlvblxuICAgICAqIOaYr+aWsOWuoui/mOaYr+aXp+WuolxuICAgICAqIOaWsOWuou+8jOaIkOWKn+aUr+S7mOiuouWNlSA8PSAzXG4gICAgKi9cbiAgICBhcHAucm91dGVyKCdpcy1uZXctY3VzdG9tZXInLCBhc3luYyggY3R4LCBuZXh0ICkgPT4ge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgXG4gICAgICAgICAgICBjb25zdCBvcGVuaWQgPSBldmVudC5kYXRhLm9wZW5JZCB8fCBldmVudC51c2VySW5mby5vcGVuSWQ7XG4gICAgICAgICAgICBjb25zdCBmaW5kJCA9IGF3YWl0IGRiLmNvbGxlY3Rpb24oJ29yZGVyJylcbiAgICAgICAgICAgICAgICAud2hlcmUoe1xuICAgICAgICAgICAgICAgICAgICBvcGVuaWQsXG4gICAgICAgICAgICAgICAgICAgIGJhc2Vfc3RhdHVzOiAnMydcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIC5jb3VudCggKTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgcmV0dXJuIGN0eC5ib2R5ID0ge1xuICAgICAgICAgICAgICAgIHN0YXR1czogMjAwLFxuICAgICAgICAgICAgICAgIGRhdGE6IGZpbmQkLnRvdGFsIDwgM1xuICAgICAgICAgICAgfVxuXG4gICAgICAgIH0gY2F0Y2ggKCBlICkge1xuICAgICAgICAgICAgcmV0dXJuIGN0eC5ib2R5ID0ge1xuICAgICAgICAgICAgICAgIHN0YXR1czogMjAwLFxuICAgICAgICAgICAgICAgIGRhdGE6IHRydWVcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgLyoqIFxuICAgICAqIEBkZXNjcmlwdGlvblxuICAgICAqIOWuouaIt+WcqOivpei6uuihjOeoi++8jOaYr+WQpumcgOimgeS7mOiuoumHkVxuICAgICAqIHtcbiAgICAgKiAgICB0aWRcbiAgICAgKiB9XG4gICAgICovXG4gICAgYXBwLnJvdXRlcignc2hvdWxkLXByZXBheScsIGFzeW5jKCBjdHgsIG5leHQgKSA9PiB7XG4gICAgICAgIHRyeSB7XG5cbiAgICAgICAgICAgIGNvbnN0IHsgdGlkIH0gPSBldmVudC5kYXRhO1xuICAgICAgICAgICAgY29uc3Qgb3BlbmlkID0gZXZlbnQuZGF0YS5vcGVuSWQgfHwgZXZlbnQudXNlckluZm8ub3BlbklkO1xuXG4gICAgICAgICAgICBjb25zdCBmaW5kJCA9IGF3YWl0IGRiLmNvbGxlY3Rpb24oJ29yZGVyJylcbiAgICAgICAgICAgICAgICAud2hlcmUoe1xuICAgICAgICAgICAgICAgICAgICBvcGVuaWQsXG4gICAgICAgICAgICAgICAgICAgIGJhc2Vfc3RhdHVzOiAnMydcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIC5jb3VudCggKTtcblxuICAgICAgICAgICAgY29uc3QgdHJpcCQgPSBhd2FpdCBkYi5jb2xsZWN0aW9uKCd0cmlwJylcbiAgICAgICAgICAgICAgICAuZG9jKCBTdHJpbmcoIHRpZCApKVxuICAgICAgICAgICAgICAgIC5nZXQoICk7XG4gICAgICAgICAgICBjb25zdCB0cmlwID0gdHJpcCQuZGF0YTtcblxuICAgICAgICAgICAgY29uc3QgaXNOZXcgPSBmaW5kJC50b3RhbCA8IDM7XG5cbiAgICAgICAgICAgIGNvbnN0IGp1ZGdlID0gKCBpc05ldywgdHJpcCApID0+IHtcbiAgICAgICAgICAgICAgICBpZiAoICF0cmlwICkgeyByZXR1cm4gdHJ1ZTsgfVxuICAgICAgICAgICAgICAgIGlmICggaXNOZXcgJiYgdHJpcC5wYXltZW50ID09PSAnMCcgKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuXG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmICggaXNOZXcgJiYgdHJpcC5wYXltZW50ID09PSAnMScgKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuXG4gICAgICAgICAgICAgICAgfSAgZWxzZSBpZiAoIGlzTmV3ICYmIHRyaXAucGF5bWVudCA9PT0gJzInICkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoICFpc05ldyAmJiB0cmlwLnBheW1lbnQgPT09ICcwJyApIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICB9ICBlbHNlIGlmICggIWlzTmV3ICYmIHRyaXAucGF5bWVudCA9PT0gJzEnICkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmICggaXNOZXcgJiYgdHJpcC5wYXltZW50ID09PSAnMicgKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gY3R4LmJvZHkgPSB7XG4gICAgICAgICAgICAgICAgc3RhdHVzOiAyMDAsXG4gICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgICBpc05ldyxcbiAgICAgICAgICAgICAgICAgICAgc2hvdWxkUHJlcGF5OiBqdWRnZSggaXNOZXcsIHRyaXAgKVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICB9IGNhdGNoICggZSApIHsgcmV0dXJuIGN0eC5ib2R5ID0geyBzdGF0dXM6IDUwMCB9O31cbiAgICB9KVxuXG4gICAgLyoqXG4gICAgICog5b6u5L+h5pSv5LuY77yM6L+U5Zue5pSv5LuYYXBp5b+F6KaB5Y+C5pWwXG4gICAgICogLS0tLS0tLS0tLS0g6K+35rGCIC0tLS0tLS0tLS1cbiAgICAgKiB7XG4gICAgICogICAgICB0b3RhbF9mZWVcbiAgICAgKiB9XG4gICAgICovXG4gICAgYXBwLnJvdXRlcignd3hwYXknLCBhc3luYyggY3R4LCBuZXh0ICkgPT4ge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgY29uc3QgeyBrZXksIGJvZHksIG1jaF9pZCwgYXR0YWNoLCBub3RpZnlfdXJsLCBzcGJpbGxfY3JlYXRlX2lwIH0gPSBDT05GSUcud3hQYXk7XG4gICAgICAgICAgICBjb25zdCBhcHBpZCA9IENPTkZJRy5hcHAuaWQ7XG4gICAgICAgICAgICBjb25zdCB0b3RhbF9mZWUgPSBldmVudC5kYXRhLnRvdGFsX2ZlZTtcbiAgICAgICAgICAgIGNvbnN0IG9wZW5pZCA9IGV2ZW50LnVzZXJJbmZvLm9wZW5JZDtcbiAgICAgICAgICAgIGNvbnN0IG5vbmNlX3N0ciA9IE1hdGgucmFuZG9tKCApLnRvU3RyaW5nKCAzNiApLnN1YnN0ciggMiwgMTUgKTtcbiAgICAgICAgICAgIGNvbnN0IHRpbWVTdGFtcCA9IHBhcnNlSW50KFN0cmluZyggRGF0ZS5ub3coKSAvIDEwMDAgKSkgKyAnJztcbiAgICAgICAgICAgIGNvbnN0IG91dF90cmFkZV9ubyA9IFwib3RuXCIgKyBub25jZV9zdHIgKyB0aW1lU3RhbXA7XG5cbiAgICAgICAgICAgIGNvbnN0IHBheXNpZ24gPSAoeyAuLi5hcmdzIH0pID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCBzYTogYW55ID0gWyBdXG4gICAgICAgICAgICAgICAgZm9yICggbGV0IGsgaW4gYXJncyApIHtcbiAgICAgICAgICAgICAgICAgICAgc2EucHVzaCggayArICc9JyArIGFyZ3NbIGsgXSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHNhLnB1c2goJ2tleT0nICsga2V5ICk7XG4gICAgICAgICAgICAgICAgY29uc3QgcyA9ICBjcnlwdG8uY3JlYXRlSGFzaCgnbWQ1JykudXBkYXRlKHNhLmpvaW4oJyYnKSwgJ3V0ZjgnKS5kaWdlc3QoJ2hleCcpO1xuICAgICAgICAgICAgICAgIHJldHVybiBzLnRvVXBwZXJDYXNlKCApO1xuICAgICAgICAgICAgfVxuICAgIFxuICAgICAgICAgICAgbGV0IGZvcm1EYXRhID0gXCI8eG1sPlwiO1xuICAgIFxuICAgICAgICAgICAgZm9ybURhdGEgKz0gXCI8YXBwaWQ+XCIgKyBhcHBpZCArIFwiPC9hcHBpZD5cIlxuICAgICAgICBcbiAgICAgICAgICAgIGZvcm1EYXRhICs9IFwiPGF0dGFjaD5cIiArIGF0dGFjaCArIFwiPC9hdHRhY2g+XCJcbiAgICAgICAgXG4gICAgICAgICAgICBmb3JtRGF0YSArPSBcIjxib2R5PlwiICsgYm9keSArIFwiPC9ib2R5PlwiXG4gICAgICAgIFxuICAgICAgICAgICAgZm9ybURhdGEgKz0gXCI8bWNoX2lkPlwiICsgbWNoX2lkICsgXCI8L21jaF9pZD5cIlxuICAgICAgICBcbiAgICAgICAgICAgIGZvcm1EYXRhICs9IFwiPG5vbmNlX3N0cj5cIiArIG5vbmNlX3N0ciArIFwiPC9ub25jZV9zdHI+XCJcbiAgICAgICAgXG4gICAgICAgICAgICBmb3JtRGF0YSArPSBcIjxub3RpZnlfdXJsPlwiICsgbm90aWZ5X3VybCArIFwiPC9ub3RpZnlfdXJsPlwiXG4gICAgICAgIFxuICAgICAgICAgICAgZm9ybURhdGEgKz0gXCI8b3BlbmlkPlwiICsgb3BlbmlkICsgXCI8L29wZW5pZD5cIlxuICAgICAgICBcbiAgICAgICAgICAgIGZvcm1EYXRhICs9IFwiPG91dF90cmFkZV9ubz5cIiArIG91dF90cmFkZV9ubyArIFwiPC9vdXRfdHJhZGVfbm8+XCJcbiAgICAgICAgXG4gICAgICAgICAgICBmb3JtRGF0YSArPSBcIjxzcGJpbGxfY3JlYXRlX2lwPlwiICsgc3BiaWxsX2NyZWF0ZV9pcCArIFwiPC9zcGJpbGxfY3JlYXRlX2lwPlwiXG4gICAgICAgIFxuICAgICAgICAgICAgZm9ybURhdGEgKz0gXCI8dG90YWxfZmVlPlwiICsgdG90YWxfZmVlICsgXCI8L3RvdGFsX2ZlZT5cIlxuICAgICAgICBcbiAgICAgICAgICAgIGZvcm1EYXRhICs9IFwiPHRyYWRlX3R5cGU+SlNBUEk8L3RyYWRlX3R5cGU+XCJcbiAgICAgICAgXG4gICAgICAgICAgICBmb3JtRGF0YSArPSBcIjxzaWduPlwiICsgcGF5c2lnbih7IGFwcGlkLCBhdHRhY2gsIGJvZHksIG1jaF9pZCwgbm9uY2Vfc3RyLCBub3RpZnlfdXJsLCBvcGVuaWQsIG91dF90cmFkZV9ubywgc3BiaWxsX2NyZWF0ZV9pcCwgdG90YWxfZmVlLCB0cmFkZV90eXBlOiAnSlNBUEknIH0pICsgXCI8L3NpZ24+XCJcbiAgICAgICAgXG4gICAgICAgICAgICBmb3JtRGF0YSArPSBcIjwveG1sPlwiO1xuICAgIFxuICAgICAgICAgICAgbGV0IHJlcyA9IGF3YWl0IHJwKHsgdXJsOiBcImh0dHBzOi8vYXBpLm1jaC53ZWl4aW4ucXEuY29tL3BheS91bmlmaWVkb3JkZXJcIiwgbWV0aG9kOiAnUE9TVCcsYm9keTogZm9ybURhdGEgfSk7XG4gICAgXG4gICAgICAgICAgICBsZXQgeG1sID0gcmVzLnRvU3RyaW5nKFwidXRmLThcIik7XG4gICAgICAgICAgXG4gICAgICAgICAgICBpZiAoIHhtbC5pbmRleE9mKCdwcmVwYXlfaWQnKSA8IDAgKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGN0eC5ib2R5ID0ge1xuICAgICAgICAgICAgICAgICAgICBzdGF0dXM6IDUwMFxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdlZWVlZScsIGZvcm1EYXRhLCB4bWwgKTtcbiAgICAgICAgICAgIGxldCBwcmVwYXlfaWQgPSB4bWwuc3BsaXQoXCI8cHJlcGF5X2lkPlwiKVsxXS5zcGxpdChcIjwvcHJlcGF5X2lkPlwiKVswXS5zcGxpdCgnWycpWzJdLnNwbGl0KCddJylbMF1cbiAgICBcbiAgICAgICAgICAgIGxldCBwYXlTaWduID0gcGF5c2lnbih7IGFwcElkOiBhcHBpZCwgbm9uY2VTdHI6IG5vbmNlX3N0ciwgcGFja2FnZTogKCdwcmVwYXlfaWQ9JyArIHByZXBheV9pZCksIHNpZ25UeXBlOiAnTUQ1JywgdGltZVN0YW1wOiB0aW1lU3RhbXAgfSlcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgcmV0dXJuIGN0eC5ib2R5ID0ge1xuICAgICAgICAgICAgICAgIHN0YXR1czogMjAwLFxuICAgICAgICAgICAgICAgIGRhdGE6IHsgYXBwaWQsIG5vbmNlX3N0ciwgdGltZVN0YW1wLCBwcmVwYXlfaWQsIHBheVNpZ24gfSBcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgfSBjYXRjaCAoIGUgKSB7XG4gICAgICAgICAgICByZXR1cm4gY3R4LmJvZHkgPSB7XG4gICAgICAgICAgICAgICAgc3RhdHVzOiA1MDBcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgLyoqXG4gICAgICog5Luj6LSt5Liq5Lq65b6u5L+h5LqM57u056CB44CB576k5LqM57u056CBXG4gICAgICogLS0tLS0tIOivt+axgiAtLS0tLS1cbiAgICAgKiB7XG4gICAgICogICAgICB3eF9xcmNvZGU6IHN0cmluZ1tdXG4gICAgICogICAgICBncm91cF9xcmNvZGU6IHN0cmluZ1tdXG4gICAgICogfVxuICAgICAqL1xuICAgIGFwcC5yb3V0ZXIoJ3d4aW5mby1lZGl0JywgYXN5bmMoIGN0eCwgbmV4dCApID0+IHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgY29uc3QgdGVtcDogYW55ID0gWyBdO1xuICAgICAgICAgICAgT2JqZWN0LmtleXMoIGV2ZW50LmRhdGEgKS5tYXAoIGtleSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKCAhIWV2ZW50LmRhdGFbIGtleSBdKSB7XG4gICAgICAgICAgICAgICAgICAgIHRlbXAucHVzaCh7XG4gICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiBrZXksXG4gICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZTogZXZlbnQuZGF0YVsga2V5IF1cbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgYXdhaXQgUHJvbWlzZS5hbGwoIHRlbXAubWFwKCBhc3luYyB4ID0+IHtcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICBjb25zdCBmaW5kJCA9IGF3YWl0IGRiLmNvbGxlY3Rpb24oJ21hbmFnZXItd3gtaW5mbycpXG4gICAgICAgICAgICAgICAgICAgIC53aGVyZSh7XG4gICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiB4LnR5cGVcbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgLmdldCggKTtcblxuICAgICAgICAgICAgICAgIGlmICggZmluZCQuZGF0YS5sZW5ndGggPiAwICkge1xuICAgICAgICAgICAgICAgICAgICBhd2FpdCBkYi5jb2xsZWN0aW9uKCdtYW5hZ2VyLXd4LWluZm8nKS5kb2MoIChmaW5kJC5kYXRhWyAwIF0gYXMgYW55KS5faWQgKVxuICAgICAgICAgICAgICAgICAgICAgICAgLnNldCh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YTogeFxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGF3YWl0IGRiLmNvbGxlY3Rpb24oJ21hbmFnZXItd3gtaW5mbycpXG4gICAgICAgICAgICAgICAgICAgICAgICAuYWRkKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhOiB4XG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIH0pKTtcblxuICAgICAgICAgICAgcmV0dXJuIGN0eC5ib2R5ID0ge1xuICAgICAgICAgICAgICAgIHN0YXR1czogMjAwXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfSBjYXRjaCAoIGUgKSB7XG4gICAgICAgICAgICByZXR1cm4gY3R4LmJvZHkgPSB7IHN0YXR1czogNTAwIH07XG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgIC8qKlxuICAgICAqIEBkZXNjcmlwdGlvblxuICAgICAqIOafpeivouS7o+i0reS4quS6uuS6jOe7tOeggeS/oeaBr1xuICAgICAqL1xuICAgIGFwcC5yb3V0ZXIoJ3d4aW5mbycsIGFzeW5jKCBjdHgsIG5leHQgKSA9PiB7XG4gICAgICAgIHRyeSB7XG5cbiAgICAgICAgICAgIGNvbnN0IHRhcmdldCA9IFsnd3hfcXJjb2RlJywgJ2dyb3VwX3FyY29kZSddO1xuICAgICAgICAgICAgY29uc3QgZmluZHMkID0gYXdhaXQgUHJvbWlzZS5hbGwoIHRhcmdldC5tYXAoIHR5cGUgPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiBkYi5jb2xsZWN0aW9uKCdtYW5hZ2VyLXd4LWluZm8nKVxuICAgICAgICAgICAgICAgICAgICAud2hlcmUoe1xuICAgICAgICAgICAgICAgICAgICAgICAgdHlwZVxuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAuZ2V0KCApO1xuICAgICAgICAgICAgfSkpO1xuXG4gICAgICAgICAgICBjb25zdCB0ZW1wID0geyB9O1xuICAgICAgICAgICAgZmluZHMkLm1hcCgoIGZpbmQkLCBpbmRleCApID0+IHtcbiAgICAgICAgICAgICAgICBpZiAoIGZpbmQkLmRhdGEubGVuZ3RoID4gMCApIHtcbiAgICAgICAgICAgICAgICAgICAgdGVtcFsgdGFyZ2V0WyBpbmRleCBdXSA9IGZpbmQkLmRhdGFbIDAgXS52YWx1ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgcmV0dXJuIGN0eC5ib2R5ID0ge1xuICAgICAgICAgICAgICAgIHN0YXR1czogMjAwLFxuICAgICAgICAgICAgICAgIGRhdGE6IHRlbXBcbiAgICAgICAgICAgIH1cblxuICAgICAgICB9IGNhdGNoICggZSApIHtcbiAgICAgICAgICAgIHJldHVybiBjdHguYm9keSA9IHsgc3RhdHVzOiA1MDAgfTtcbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgLyoqIFxuICAgICAqIEBkZXNjcmlwdGlvblxuICAgICAqIOiOt+WPluKAnOaIkeeahOmhtemdouKAneeahOWfuuacrOS/oeaBr++8jOivuOWmguiuouWNleOAgeWNoeWIuOaVsOmHj1xuICAgICAqL1xuICAgIGFwcC5yb3V0ZXIoJ215cGFnZS1pbmZvJywgYXN5bmMoIGN0eCwgbmV4dCApID0+IHtcbiAgICAgICAgdHJ5IHtcblxuICAgICAgICAgICAgbGV0IGNvdXBvbnMgPSAwO1xuICAgICAgICAgICAgY29uc3Qgb3BlbmlkID0gZXZlbnQudXNlckluZm8ub3BlbklkO1xuICAgICAgICAgICAgY29uc3QgdHJpcHMkID0gYXdhaXQgY2xvdWQuY2FsbEZ1bmN0aW9uKHtcbiAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICAgICR1cmw6ICdlbnRlcidcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIG5hbWU6ICd0cmlwJ1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBjb25zdCB0cmlwcyA9IHRyaXBzJC5yZXN1bHQuZGF0YTtcbiAgICAgICAgICAgIGNvbnN0IHRyaXAgPSB0cmlwc1sgMCBdO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICAvLyDorqLljZXmlbBcbiAgICAgICAgICAgIGNvbnN0IG9yZGVycyQgPSBhd2FpdCBkYi5jb2xsZWN0aW9uKCdvcmRlcicpXG4gICAgICAgICAgICAgICAgLndoZXJlKHtcbiAgICAgICAgICAgICAgICAgICAgb3BlbmlkLFxuICAgICAgICAgICAgICAgICAgICBiYXNlX3N0YXR1czogXy5uZXEoJzUnKVxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLmNvdW50KCApO1xuXG5cbiAgICAgICAgICAgIC8vIOWNoeWIuOaVsCgg6L+H5ruk5o6J5Y+q5Ymp5b2T5YmN55qEdHJpcOWNoeWIuCApXG4gICAgICAgICAgICBsZXQgY291cG9ucyQ6IGFueSA9IHtcbiAgICAgICAgICAgICAgICB0b3RhbDogMFxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgaWYgKCAhIXRyaXAgKSB7XG4gICAgICAgICAgICAgICAgY291cG9ucyQgPSBhd2FpdCBkYi5jb2xsZWN0aW9uKCdjb3Vwb24nKVxuICAgICAgICAgICAgICAgICAgICAud2hlcmUoe1xuICAgICAgICAgICAgICAgICAgICAgICAgb3BlbmlkLFxuICAgICAgICAgICAgICAgICAgICAgICAgdGlkOiB0cmlwLl9pZCxcbiAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6IF8ubmVxKCd0X2RhaWppbicpLFxuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAuY291bnQoICk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGNvbnN0IGNvdXBvbnMyJCA9IGF3YWl0IGRiLmNvbGxlY3Rpb24oJ2NvdXBvbicpXG4gICAgICAgICAgICAgICAgLndoZXJlKHtcbiAgICAgICAgICAgICAgICAgICAgb3BlbmlkLFxuICAgICAgICAgICAgICAgICAgICBpc1VzZWQ6IGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICB0eXBlOiAndF9kYWlqaW4nLFxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLmNvdW50KCApO1xuXG4gICAgICAgICAgICBjb3Vwb25zID0gY291cG9ucyQudG90YWwgKyBjb3Vwb25zMiQudG90YWw7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIHJldHVybiBjdHguYm9keSA9IHtcbiAgICAgICAgICAgICAgICBzdGF0dXM6IDIwMCxcbiAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICAgIGNvdXBvbnMsXG4gICAgICAgICAgICAgICAgICAgIG9yZGVyczogb3JkZXJzJC50b3RhbFxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICB9IGNhdGNoICggZSApIHsgcmV0dXJuIGN0eC5ib2R5ID0geyBzdGF0dXM6IDUwMCB9O31cbiAgICB9KTtcblxuICAgIC8qKiBcbiAgICAgKiBAZGVzY3JpcHRpb25cbiAgICAgKiDooYznqIvkuIvvvIzlj4LliqDkuobotK3kubDnmoTlrqLmiLfvvIjorqLljZXvvIlcbiAgICAgKiB7IFxuICAgICAqICAgIHRpZFxuICAgICAqIH1cbiAgICAgKi9cbiAgICBhcHAucm91dGVyKCdjdXN0b21lci1pbi10cmlwJywgYXN5bmMoIGN0eCwgbmV4dCApID0+IHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGNvbnN0IGxpbWl0ID0gMTAwO1xuICAgICAgICAgICAgY29uc3QgYWxsT3JkZXJVc2VycyQgPSBhd2FpdCBkYi5jb2xsZWN0aW9uKCdvcmRlcicpXG4gICAgICAgICAgICAgICAgLndoZXJlKHtcbiAgICAgICAgICAgICAgICAgICAgdGlkOiBldmVudC5kYXRhLnRpZFxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLm9yZGVyQnkoJ2NyZWF0ZVRpbWUnLCAnZGVzYycpXG4gICAgICAgICAgICAgICAgLmxpbWl0KCBsaW1pdCApXG4gICAgICAgICAgICAgICAgLmZpZWxkKHtcbiAgICAgICAgICAgICAgICAgICAgb3BlbmlkOiB0cnVlXG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAuZ2V0KCApO1xuXG4gICAgICAgICAgICBjb25zdCBvcGVuaWRzID0gQXJyYXkuZnJvbSggbmV3IFNldCggYWxsT3JkZXJVc2VycyQuZGF0YS5tYXAoIHggPT4geC5vcGVuaWQgKSkpO1xuXG4gICAgICAgICAgICBjb25zdCBhdmF0YXRzJCA9IGF3YWl0IFByb21pc2UuYWxsKCBvcGVuaWRzLm1hcCggb2lkID0+IHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZGIuY29sbGVjdGlvbigndXNlcicpXG4gICAgICAgICAgICAgICAgICAgIC53aGVyZSh7XG4gICAgICAgICAgICAgICAgICAgICAgICBvcGVuaWQ6IG9pZFxuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAuZmllbGQoe1xuICAgICAgICAgICAgICAgICAgICAgICAgYXZhdGFyVXJsOiB0cnVlXG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgIC5nZXQoICk7XG4gICAgICAgICAgICB9KSlcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgcmV0dXJuIGN0eC5ib2R5ID0ge1xuICAgICAgICAgICAgICAgIHN0YXR1czogMjAwLFxuICAgICAgICAgICAgICAgIGRhdGE6IGF2YXRhdHMkLm1hcCggeCA9PiB4LmRhdGFbIDAgXS5hdmF0YXJVcmwgKVxuICAgICAgICAgICAgfVxuXG4gICAgICAgIH0gY2F0Y2ggKCBlICkge1xuICAgICAgICAgICAgcmV0dXJuIGN0eC5ib2R5ID0geyBzdGF0dXM6IDUwMCB9O1xuICAgICAgICB9XG4gICAgfSlcblxuICAgIC8qKlxuICAgICAqIOa2iOaBr+aOqOmAgSAtIOWCrOasvlxuICAgICAqIHtcbiAgICAgKiAgICAgdG91c2VyICggb3BlbmlkIClcbiAgICAgKiAgICAgZm9ybV9pZCDvvIgg5oiW6ICF5pivIHByZXBheV9pZCDvvIlcbiAgICAgKiAgICAgcGFnZT86IHN0cmluZ1xuICAgICAqICAgICBkYXRhOiB7IFxuICAgICAqICAgICAgICAgXG4gICAgICogICAgIH1cbiAgICAgKiB9XG4gICAgICovXG4gICAgYXBwLnJvdXRlcignbm90aWZpY2F0aW9uLWdldG1vbmV5JywgYXN5bmMoIGN0eCwgbmV4dCApID0+IHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgY29uc3QgcGFnZSA9IGV2ZW50LmRhdGEucGFnZSB8fCAncGFnZXMvb3JkZXItbGlzdC9pbmRleCc7XG4gICAgICAgICAgICBjb25zdCB7IHRvdXNlciwgZm9ybV9pZCwgZGF0YSwgcHJlcGF5X2lkIH0gPSBldmVudC5kYXRhO1xuXG4gICAgICAgICAgICAvLyDojrflj5Z0b2tlblxuICAgICAgICAgICAgY29uc3QgcmVzdWx0ID0gYXdhaXQgKGF4aW9zIGFzIGFueSkoe1xuICAgICAgICAgICAgICAgIG1ldGhvZDogJ2dldCcsXG4gICAgICAgICAgICAgICAgdXJsOiBgaHR0cHM6Ly9hcGkud2VpeGluLnFxLmNvbS9jZ2ktYmluL3Rva2VuP2dyYW50X3R5cGU9Y2xpZW50X2NyZWRlbnRpYWwmYXBwaWQ9JHtDT05GSUcuYXBwLmlkfSZzZWNyZXQ9JHtDT05GSUcuYXBwLnNlY3JlY3R9YFxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGNvbnN0IHsgYWNjZXNzX3Rva2VuLCBlcnJjb2RlIH0gPSByZXN1bHQuZGF0YTtcblxuICAgICAgICAgICAgaWYgKCBlcnJjb2RlICkge1xuICAgICAgICAgICAgICAgIHRocm93ICfnlJ/miJBhY2Nlc3NfdG9rZW7plJnor68nXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGNvbnN0IHJlcURhdGEgPSB7IH07XG4gICAgICAgICAgICBjb25zdCByZXFEYXRhJCA9IHtcbiAgICAgICAgICAgICAgICBwYWdlLFxuICAgICAgICAgICAgICAgIHRvdXNlcixcbiAgICAgICAgICAgICAgICBwcmVwYXlfaWQsXG4gICAgICAgICAgICAgICAgZm9ybV9pZCxcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZV9pZDogQ09ORklHLm5vdGlmaWNhdGlvbl90ZW1wbGF0ZS5nZXRNb25leTMsXG4gICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgICAvLyDotK3kubDml7bpl7RcbiAgICAgICAgICAgICAgICAgICAgXCJrZXl3b3JkMVwiOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBcInZhbHVlXCI6IGRhdGEudGl0bGVcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgLy8g6K6i5Y2V5oC75Lu3XG4gICAgICAgICAgICAgICAgICAgIFwia2V5d29yZDJcIjoge1xuICAgICAgICAgICAgICAgICAgICAgICAgXCJ2YWx1ZVwiOiBkYXRhLnRpbWVcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIE9iamVjdC5rZXlzKCByZXFEYXRhJCApLm1hcCgga2V5ID0+IHtcbiAgICAgICAgICAgICAgICBpZiAoICEhcmVxRGF0YSRbIGtleSBdKSB7XG4gICAgICAgICAgICAgICAgICAgIHJlcURhdGFbIGtleSBdID0gcmVxRGF0YSRbIGtleSBdO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAvLyDlj5HpgIHmjqjpgIFcbiAgICAgICAgICAgIGNvbnN0IHNlbmQgPSBhd2FpdCAoYXhpb3MgYXMgYW55KSh7XG4gICAgICAgICAgICAgICAgZGF0YTogcmVxRGF0YSxcbiAgICAgICAgICAgICAgICBtZXRob2Q6ICdwb3N0JyxcbiAgICAgICAgICAgICAgICB1cmw6IGBodHRwczovL2FwaS53ZWl4aW4ucXEuY29tL2NnaS1iaW4vbWVzc2FnZS93eG9wZW4vdGVtcGxhdGUvc2VuZD9hY2Nlc3NfdG9rZW49JHthY2Nlc3NfdG9rZW59YFxuICAgICAgICAgICAgfSk7XG4gICAgICAgIFxuICAgICAgICAgICAgcmV0dXJuIGN0eC5ib2R5ID0ge1xuICAgICAgICAgICAgICAgIGRhdGE6IHNlbmQuZGF0YSxcbiAgICAgICAgICAgICAgICBzdGF0dXM6IDIwMFxuICAgICAgICAgICAgfVxuXG4gICAgICAgIH0gY2F0Y2ggKCBlICkge1xuICAgICAgICAgICAgcmV0dXJuIGN0eC5ib2R5ID0geyBtZXNzYWdlOiBlLCBzdGF0dXM6IDUwMCB9XG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgIC8qKlxuICAgICAqIEBkZXNjcmlwdGlvblxuICAgICAqIOmAmui/h+WKoOino+WvhuWuouacjee7meeahOWvhuegge+8jOadpeWinuWKoOadg+mZkOOAgeWIneWni+WMluaVsOaNruW6k1xuICAgICAqL1xuICAgIGFwcC5yb3V0ZXIoJ2FkZC1hdXRoLWJ5LXBzdycsIGFzeW5jKCBjdHgsIG5leHQgKSA9PiB7XG4gICAgICAgIHRyeSB7XG5cbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgYXdhaXQgKGRiIGFzIGFueSkuY3JlYXRlQ29sbGVjdGlvbignbWFuYWdlci1tZW1iZXInKTtcbiAgICAgICAgICAgICAgICBhd2FpdCAoZGIgYXMgYW55KS5jcmVhdGVDb2xsZWN0aW9uKCdhdXRocHN3Jyk7XG4gICAgICAgICAgICB9IGNhdGNoICggZSApIHsgfVxuXG4gICAgICAgICAgICBsZXQgcmVzdWx0ID0gJyc7XG4gICAgICAgICAgICBjb25zdCB7IHNhbHQgfSA9IENPTkZJRy5hdXRoO1xuICAgICAgICAgICAgY29uc3Qgb3BlbmlkID0gZXZlbnQudXNlckluZm8ub3BlbklkO1xuICAgICAgICAgICAgY29uc3QgeyBwc3csIGNvbnRlbnQgfSA9IGV2ZW50LmRhdGE7XG5cbiAgICAgICAgICAgIGNvbnN0IGdldEVyciA9IG1lc3NhZ2UgPT4gKHtcbiAgICAgICAgICAgICAgICBtZXNzYWdlLFxuICAgICAgICAgICAgICAgIHN0YXR1czogNTAwLFxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgY29uc3QgZGVjaXBoZXIgPSBjcnlwdG8uY3JlYXRlRGVjaXBoZXIoJ2FlczE5MicsIHNhbHQgKTtcbiAgICAgICAgICAgICAgICBjb25zdCBkZWNyeXB0ZWQgPSBkZWNpcGhlci51cGRhdGUoIHBzdywgJ2hleCcsICd1dGY4JyApO1xuICAgICAgICAgICAgICAgIHJlc3VsdCA9IGRlY3J5cHRlZCArIGRlY2lwaGVyLmZpbmFsKCd1dGY4Jyk7XG4gICAgICAgICAgICB9IGNhdGNoICggZSApIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gY3R4LmJvZHkgPSBnZXRFcnIoJ+WvhumSpemUmeivr++8jOivt+aguOWvuScpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgXG4gICAgICAgICAgICBjb25zdCBbIGNfdGltZXN0YW1wLCBjX2FwcGlkLCBjX2NvbnRlbnQsIGNfbWF4IF0gPSByZXN1bHQuc3BsaXQoJy0nKTtcblxuICAgICAgICAgICAgaWYgKCBnZXROb3coIHRydWUgKSAtIE51bWJlciggY190aW1lc3RhbXAgKSA+IDMwICogNjAgKiAxMDAwICkge1xuICAgICAgICAgICAgICAgIHJldHVybiBjdHguYm9keSA9IGdldEVycign5a+G6ZKl5bey6L+H5pyf77yM6K+36IGU57O75a6i5pyNJyk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICggY19hcHBpZCAhPT0gQ09ORklHLmFwcC5pZCApIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gY3R4LmJvZHkgPSBnZXRFcnIoJ+WvhumSpeS4juWwj+eoi+W6j+S4jeWFs+iBlCcpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoIGNfY29udGVudC5yZXBsYWNlKC9cXHMrL2csICcnKSAhPT0gY29udGVudC5yZXBsYWNlKC9cXHMrL2csICcnKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBjdHguYm9keSA9IGdldEVycign5o+Q56S66K+N6ZSZ6K+v77yM6K+36IGU57O75a6i5pyNJyk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogYXV0aHBzdyDooahcbiAgICAgICAgICAgICAqIFxuICAgICAgICAgICAgICoge1xuICAgICAgICAgICAgICogICAgYXBwSWQsXG4gICAgICAgICAgICAgKiAgICB0aW1lc3RhbXAsXG4gICAgICAgICAgICAgKiAgICBjb3VudFxuICAgICAgICAgICAgICogfVxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICBjb25zdCBjaGVjayQgPSBhd2FpdCBkYi5jb2xsZWN0aW9uKCdhdXRocHN3JykgXG4gICAgICAgICAgICAgICAgLndoZXJlKHtcbiAgICAgICAgICAgICAgICAgICAgYXBwSWQ6IGNfYXBwaWQsXG4gICAgICAgICAgICAgICAgICAgIHRpbWVzdGFtcDogY190aW1lc3RhbXBcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIC5nZXQoICk7XG4gICAgICAgICAgICBjb25zdCB0YXJnZXQgPSBjaGVjayQuZGF0YVsgMCBdO1xuXG4gICAgICAgICAgICAvLyDlr4bpkqXlt7Looqvkvb/nlKhcbiAgICAgICAgICAgIGlmICggISF0YXJnZXQgKSB7XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgLy8g5qyh5pWw5LiN6IO95aSa5LqOMlxuICAgICAgICAgICAgICAgIGlmICggdGFyZ2V0LmNvdW50ID49IDIgKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBjdHguYm9keSA9IGdldEVycign5a+G6ZKl5bey6KKr5L2/55So77yM6K+36IGU57O75a6i5pyNJyk7XG5cbiAgICAgICAgICAgICAgICAvLyDmm7TmlrDlr4bpkqXkv6Hmga9cbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBhd2FpdCBkYi5jb2xsZWN0aW9uKCdhdXRocHN3JylcbiAgICAgICAgICAgICAgICAgICAgICAgIC5kb2MoIFN0cmluZyggdGFyZ2V0Ll9pZCApKVxuICAgICAgICAgICAgICAgICAgICAgICAgLnVwZGF0ZSh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb3VudDogXy5pbmMoIDEgKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIOWIm+W7uuWvhumSpeS/oeaBr1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBhd2FpdCBkYi5jb2xsZWN0aW9uKCdhdXRocHN3JylcbiAgICAgICAgICAgICAgICAgICAgLmFkZCh7XG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY291bnQ6IDEsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYXBwSWQ6IGNfYXBwaWQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGltZXN0YW1wOiBjX3RpbWVzdGFtcFxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyDmiorlvZPliY3kurrvvIzliqDlhaXliLDnrqHnkIblkZhcbiAgICAgICAgICAgIGNvbnN0IGNoZWNrTWFuYWdlciQgPSBhd2FpdCBkYi5jb2xsZWN0aW9uKCdtYW5hZ2VyLW1lbWJlcicpXG4gICAgICAgICAgICAgICAgLndoZXJlKHtcbiAgICAgICAgICAgICAgICAgICAgb3BlbmlkXG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAuZ2V0KCApO1xuICAgICAgICAgICAgY29uc3QgdGFyZ2V0TWFuYWdlciA9IGNoZWNrTWFuYWdlciQuZGF0YVsgMCBdO1xuXG4gICAgICAgICAgICBpZiAoICF0YXJnZXRNYW5hZ2VyICkge1xuICAgICAgICAgICAgICAgIGF3YWl0IGRiLmNvbGxlY3Rpb24oJ21hbmFnZXItbWVtYmVyJylcbiAgICAgICAgICAgICAgICAgICAgLmFkZCh7XG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb3BlbmlkLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRlbnQ6IGNfY29udGVudCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjcmVhdGVUaW1lOiBnZXROb3coIHRydWUgKVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyDliJ3lp4vljJblkITkuKrooahcbiAgICAgICAgICAgIGF3YWl0IGluaXREQiggKTtcblxuICAgICAgICAgICAgcmV0dXJuIGN0eC5ib2R5ID0ge1xuICAgICAgICAgICAgICAgIHN0YXR1czogMjAwXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfSBjYXRjaCAoIGUgKSB7XG4gICAgICAgICAgICByZXR1cm4gY3R4LmJvZHkgPSB7XG4gICAgICAgICAgICAgICAgc3RhdHVzOiA1MDAsXG4gICAgICAgICAgICAgICAgbWVzc2FnZTogJ+WvhumSpeajgOafpeWPkeeUn+mUmeivrydcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgLyoqXG4gICAgICogQGRlc2NyaXB0aW9uXG4gICAgICog5p+l6K+i5bqU55So6YWN572uXG4gICAgICovXG4gICAgYXBwLnJvdXRlcignY2hlY2stYXBwLWNvbmZpZycsIGFzeW5jKCBjdHgsIG5leHQgKSA9PiB7XG4gICAgICAgIHRyeSB7XG5cbiAgICAgICAgICAgIGxldCBjb25maWdPYmogPSB7IH07XG4gICAgICAgICAgICBjb25zdCBjb25maWckID0gYXdhaXQgZGIuY29sbGVjdGlvbignYXBwLWNvbmZpZycpXG4gICAgICAgICAgICAgICAgLndoZXJlKHsgfSlcbiAgICAgICAgICAgICAgICAuZ2V0KCApO1xuXG4gICAgICAgICAgICBjb25zdCBtZXRhID0gY29uZmlnJC5kYXRhLm1hcCggY29uZiA9PiB7XG4gICAgICAgICAgICAgICAgY29uZmlnT2JqID0gT2JqZWN0LmFzc2lnbih7IH0sIGNvbmZpZ09iaiwge1xuICAgICAgICAgICAgICAgICAgICBbIGNvbmYudHlwZSBdOiBjb25mLnZhbHVlXG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICByZXR1cm4gY3R4LmJvZHkgPSB7XG4gICAgICAgICAgICAgICAgZGF0YTogY29uZmlnT2JqLFxuICAgICAgICAgICAgICAgIHN0YXR1czogMjAwXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfSBjYXRjaCAoIGUgKSB7XG4gICAgICAgICAgICByZXR1cm4gY3R4LmJvZHkgPSB7XG4gICAgICAgICAgICAgICAgc3RhdHVzOiA1MDBcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgLyoqXG4gICAgICogQGRlc2NyaXB0aW9uXG4gICAgICog5pu05paw5bqU55So6YWN572uXG4gICAgICogLS0tLS0tLS0tLS0tLS1cbiAgICAgKiBjb25maWdzOiB7XG4gICAgICogICAgWyBrZXk6IHN0cmluZyBdOiBhbnkgXG4gICAgICogfVxuICAgICAqL1xuICAgIGFwcC5yb3V0ZXIoJ3VwZGF0ZS1hcHAtY29uZmlnJywgYXN5bmMoIGN0eCwgbmV4dCApID0+IHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGNvbnN0IHsgY29uZmlncyB9ID0gZXZlbnQuZGF0YTtcblxuICAgICAgICAgICAgYXdhaXQgUHJvbWlzZS5hbGwoXG4gICAgICAgICAgICAgICAgT2JqZWN0LmtleXMoIGNvbmZpZ3MgKVxuICAgICAgICAgICAgICAgICAgICAubWFwKCBhc3luYyBjb25maWdLZXkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgdGFyZ2V0JCA9IGF3YWl0IGRiLmNvbGxlY3Rpb24oJ2FwcC1jb25maWcnKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC53aGVyZSh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6IGNvbmZpZ0tleVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLmdldCggKVxuXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoICF0YXJnZXQkLmRhdGFbIDAgXSkgeyByZXR1cm47IH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgYXdhaXQgZGIuY29sbGVjdGlvbignYXBwLWNvbmZpZycpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLmRvYyggU3RyaW5nKCB0YXJnZXQkLmRhdGFbIDAgXS5faWQgKSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAudXBkYXRlKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU6IGNvbmZpZ3NbIGNvbmZpZ0tleSBdXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgKTtcblxuICAgICAgICAgICAgcmV0dXJuIGN0eC5ib2R5ID0ge1xuICAgICAgICAgICAgICAgIHN0YXR1czogMjAwXG4gICAgICAgICAgICB9XG4gICAgICAgIH0gY2F0Y2ggKCBlICkge1xuICAgICAgICAgICAgcmV0dXJuIGN0eC5ib2R5ID0ge1xuICAgICAgICAgICAgICAgIHN0YXR1czogNTAwXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9KVxuXG4gICAgLyoqIFxuICAgICAqIEBkZXNjcmlwdGlvblxuICAgICAqIOeUn+aIkOS6jOe7tOeggVxuICAgICAqIHtcbiAgICAgKiAgICAgcGFnZVxuICAgICAqICAgICBzY2VuZVxuICAgICAqIH1cbiAgICAgKi9cbiAgICBhcHAucm91dGVyKCdjcmVhdGUtcXJjb2RlJywgYXN5bmMoIGN0eCwgbmV4dCApID0+IHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGNvbnN0IHsgcGFnZSwgc2NlbmUgfSA9IGV2ZW50LmRhdGE7XG4gICAgICAgICAgICBjb25zdCByZXN1bHQgPSBhd2FpdCBjbG91ZC5vcGVuYXBpLnd4YWNvZGUuZ2V0VW5saW1pdGVkKHtcbiAgICAgICAgICAgICAgICBwYWdlLFxuICAgICAgICAgICAgICAgIHNjZW5lOiBzY2VuZSB8fCAnJ1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIGlmICggcmVzdWx0LmVyckNvZGUgIT09IDAgKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgcmVzdWx0LmVyck1zZ1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gY3R4LmJvZHkgPSB7XG4gICAgICAgICAgICAgICAgc3RhdHVzOiAyMDAsXG4gICAgICAgICAgICAgICAgZGF0YTogcmVzdWx0LmJ1ZmZlclxuICAgICAgICAgICAgfVxuICAgICAgICB9IGNhdGNoICggZSApIHtcbiAgICAgICAgICAgIHJldHVybiBjdHguYm9keSA9IHtcbiAgICAgICAgICAgICAgICBzdGF0dXM6IDUwMCxcbiAgICAgICAgICAgICAgICBtZXNzYWdlOiB0eXBlb2YgZSA9PT0gJ3N0cmluZycgPyBlIDogSlNPTi5zdHJpbmdpZnkoIGUgKVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICAvKiogXG4gICAgICogQGRlc2NyaXB0aW9uXG4gICAgICog5Yib5bu65LiA5LiqZm9ybS1pZFxuICAgICAqIHtcbiAgICAgKiAgICAgZm9ybWlkXG4gICAgICogfVxuICAgICAqIGZvcm0taWRzOiB7XG4gICAgICogICAgICBvcGVuaWQsXG4gICAgICogICAgICBmb3JtaWQsXG4gICAgICogICAgICBjcmVhdGVUaW1lLFxuICAgICAqICAgICAgdHlwZTogJ21hbmFnZXInIHwgJ25vcm1hbCdcbiAgICAgKiB9XG4gICAgICovXG4gICAgYXBwLnJvdXRlcignY3JlYXRlLWZvcm1pZCcsIGFzeW5jKCBjdHgsIG5leHQgKSA9PiB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBjb25zdCBvcGVuaWQgPSBldmVudC51c2VySW5mby5vcGVuSWQ7XG4gICAgICAgICAgICBjb25zdCB7IGZvcm1pZCB9ID0gZXZlbnQuZGF0YTsgXG4gICAgICAgICAgICBjb25zdCBmaW5kJCA9IGF3YWl0IGRiLmNvbGxlY3Rpb24oJ21hbmFnZXItbWVtYmVyJylcbiAgICAgICAgICAgICAgICAud2hlcmUoe1xuICAgICAgICAgICAgICAgICAgICBvcGVuaWRcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIC5jb3VudCggKTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgY29uc3QgY3JlYXRlJCA9IGF3YWl0IGRiLmNvbGxlY3Rpb24oJ2Zvcm0taWRzJylcbiAgICAgICAgICAgICAgICAuYWRkKHtcbiAgICAgICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgICAgICAgb3BlbmlkLFxuICAgICAgICAgICAgICAgICAgICAgICAgZm9ybWlkLFxuICAgICAgICAgICAgICAgICAgICAgICAgY3JlYXRlVGltZTogZ2V0Tm93KCB0cnVlICksXG4gICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiBmaW5kJC50b3RhbCA+IDAgPyAnbWFuYWdlcicgOiAnbm9ybWFsJ1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBjdHguYm9keSA9IHtcbiAgICAgICAgICAgICAgICBzdGF0dXM6IDIwMFxuICAgICAgICAgICAgfVxuICAgICAgICB9IGNhdGNoICggZSApIHtcbiAgICAgICAgICAgIGN0eC5ib2R5ID0ge1xuICAgICAgICAgICAgICAgIHN0YXR1czogMjAwXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgIC8qKlxuICAgICAqIEBkZXNjcmlwdGlvblxuICAgICAqIOaooeadv+aOqOmAgeacjeWKoe+8jOa2iOi0uWZvcm0taWRzXG4gICAgICoge1xuICAgICAqICAgICAgb3BlbmlkXG4gICAgICogICAgICB0eXBlOiAnYnV5UGluJyB8ICdidXknIHwgJ2dldE1vbmV5JyB8ICd3YWl0UGluJyB8ICduZXdPcmRlcidcbiAgICAgKiAgICAgIHRleHRzOiBbICd4eCcsICd5eScgXVxuICAgICAqICAgICAgP3BhZ2VcbiAgICAgKiAgICAgID9wcmVwYXlfaWRcbiAgICAgKiB9XG4gICAgICovXG4gICAgYXBwLnJvdXRlcigncHVzaC10ZW1wbGF0ZScsIGFzeW5jKCBjdHgsIG5leHQgKSA9PiB7XG4gICAgICAgIHRyeSB7XG5cbiAgICAgICAgICAgIGxldCBmb3JtaWRfaWQ6IGFueSA9ICcnO1xuICAgICAgICAgICAgbGV0IGZvcm1pZCA9IGV2ZW50LmRhdGEucHJlcGF5X2lkO1xuICAgICAgICAgICAgY29uc3QgeyB0eXBlLCB0ZXh0cyB9ID0gZXZlbnQuZGF0YTtcbiAgICAgICAgICAgIGNvbnN0IG9wZW5pZCA9IGV2ZW50LmRhdGEub3BlbklkIHx8IGV2ZW50LmRhdGEub3BlbmlkIHx8IGV2ZW50LnVzZXJJbmZvLm9wZW5JZDtcbiAgICAgICAgICAgIGNvbnN0IHBhZ2UgPSBldmVudC5kYXRhLnBhZ2UgfHwgJ3BhZ2VzL29yZGVyLWxpc3QvaW5kZXgnO1xuXG4gICAgICAgICAgICAvLyDlpoLmnpzmsqHmnIlwcmVwYXlfaWQsIOWwseWOu+aLv+ivpeeUqOaIt+eahGZvcm1faWRcbiAgICAgICAgICAgIGlmICggIWZvcm1pZCApIHtcbiAgICAgICAgICAgICAgICBjb25zdCBmaW5kJCA9IGF3YWl0IGRiLmNvbGxlY3Rpb24oJ2Zvcm0taWRzJylcbiAgICAgICAgICAgICAgICAgICAgLndoZXJlKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG9wZW5pZFxuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAubGltaXQoIDEgKVxuICAgICAgICAgICAgICAgICAgICAuZ2V0KCApO1xuXG4gICAgICAgICAgICAgICAgaWYgKCAhZmluZCQuZGF0YVsgMCBdKSB7XG4gICAgICAgICAgICAgICAgICAgIHRocm93IGDor6XnlKjmiLcke29wZW5pZH3msqHmnIlmb3JtaWTjgIFwcmVwYXlfaWRgO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGZvcm1pZCA9IGZpbmQkLmRhdGFbIDAgXS5mb3JtaWQ7XG4gICAgICAgICAgICAgICAgZm9ybWlkX2lkID0gZmluZCQuZGF0YVsgMCBdLl9pZDtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgbGV0IHRleHREYXRhID0geyB9O1xuICAgICAgICAgICAgdGV4dHMubWFwKCggdGV4dCwgaW5kZXggKSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3Qga2V5VGV4dCA9IGBrZXl3b3JkJHtpbmRleCArIDF9YDtcbiAgICAgICAgICAgICAgICB0ZXh0RGF0YSA9IE9iamVjdC5hc3NpZ24oeyB9LCB0ZXh0RGF0YSwge1xuICAgICAgICAgICAgICAgICAgICBbIGtleVRleHQgXSA6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlOiB0ZXh0XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIGNvbnN0IHdlYXBwVGVtcGxhdGVNc2cgPSB7XG4gICAgICAgICAgICAgICAgcGFnZSxcbiAgICAgICAgICAgICAgICBkYXRhOiB0ZXh0RGF0YSxcbiAgICAgICAgICAgICAgICBmb3JtSWQ6IGZvcm1pZCxcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZUlkOiBDT05GSUcucHVzaF90ZW1wbGF0ZVsgdHlwZSBdLnZhbHVlXG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICBjb25zb2xlLmxvZygnPT095o6o6YCBJywgd2VhcHBUZW1wbGF0ZU1zZyApO1xuXG4gICAgICAgICAgICBjb25zdCBzZW5kJCA9IGF3YWl0IGNsb3VkLm9wZW5hcGkudW5pZm9ybU1lc3NhZ2Uuc2VuZCh7XG4gICAgICAgICAgICAgICAgdG91c2VyOiBvcGVuaWQsXG4gICAgICAgICAgICAgICAgd2VhcHBUZW1wbGF0ZU1zZ1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIGlmICggU3RyaW5nKCBzZW5kJC5lcnJDb2RlICkgIT09ICcwJyApIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBzZW5kJC5lcnJNc2c7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIOWIoOmZpOivpeadoWZvcm0taWRcbiAgICAgICAgICAgIGlmICggISFmb3JtaWRfaWQgKSB7XG4gICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgICAgYXdhaXQgZGIuY29sbGVjdGlvbignZm9ybS1pZHMnKVxuICAgICAgICAgICAgICAgICAgICAgICAgLmRvYyggZm9ybWlkX2lkIClcbiAgICAgICAgICAgICAgICAgICAgICAgIC5yZW1vdmUoICk7XG4gICAgICAgICAgICAgICAgfSBjYXRjaCAoIGUgKSB7IH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIGN0eC5ib2R5ID0ge1xuICAgICAgICAgICAgICAgIHN0YXR1czogMjAwXG4gICAgICAgICAgICB9O1xuXG4gICAgICAgIH0gY2F0Y2ggKCBlICkge1xuICAgICAgICAgICAgcmV0dXJuIGN0eC5ib2R5ID0ge1xuICAgICAgICAgICAgICAgIHN0YXR1czogNTAwLFxuICAgICAgICAgICAgICAgIG1lc3NhZ2U6IHR5cGVvZiBlID09PSAnc3RyaW5nJyA/IGUgOiBKU09OLnN0cmluZ2lmeSggZSApXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgIC8qKiBcbiAgICAgKiBAZGVzY3JpcHRpb25cbiAgICAgKiDlkIzkuIrvvIzkupHlvIDlj5HnlKhcbiAgICAgKi9cbiAgICBhcHAucm91dGVyKCdwdXNoLXRlbXBsYXRlLWNsb3VkJywgYXN5bmMoIGN0eCwgbmV4dCApID0+IHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIC8vIOiOt+WPlnRva2VuXG4gICAgICAgICAgICBjb25zdCByZXN1bHQgPSBhd2FpdCAoYXhpb3MgYXMgYW55KSh7XG4gICAgICAgICAgICAgICAgbWV0aG9kOiAnZ2V0JyxcbiAgICAgICAgICAgICAgICB1cmw6IGBodHRwczovL2FwaS53ZWl4aW4ucXEuY29tL2NnaS1iaW4vdG9rZW4/Z3JhbnRfdHlwZT1jbGllbnRfY3JlZGVudGlhbCZhcHBpZD0ke0NPTkZJRy5hcHAuaWR9JnNlY3JldD0ke0NPTkZJRy5hcHAuc2VjcmVjdH1gXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgY29uc3QgeyBhY2Nlc3NfdG9rZW4sIGVycmNvZGUgfSA9IHJlc3VsdC5kYXRhO1xuXG4gICAgICAgICAgICBpZiAoIGVycmNvZGUgKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgJ+eUn+aIkGFjY2Vzc190b2tlbumUmeivrydcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgbGV0IGZvcm1pZF9pZDogYW55ID0gJyc7XG4gICAgICAgICAgICBsZXQgZm9ybWlkID0gZXZlbnQuZGF0YS5wcmVwYXlfaWQ7XG4gICAgICAgICAgICBjb25zdCB7IHR5cGUsIHRleHRzIH0gPSBldmVudC5kYXRhO1xuICAgICAgICAgICAgY29uc3Qgb3BlbmlkID0gZXZlbnQuZGF0YS5vcGVuSWQgfHwgZXZlbnQuZGF0YS5vcGVuaWQgfHwgZXZlbnQudXNlckluZm8ub3BlbklkO1xuICAgICAgICAgICAgY29uc3QgcGFnZSA9IGV2ZW50LmRhdGEucGFnZSB8fCAncGFnZXMvb3JkZXItbGlzdC9pbmRleCc7XG5cbiAgICAgICAgICAgIC8vIOWmguaenOayoeaciXByZXBheV9pZCwg5bCx5Y675ou/6K+l55So5oi355qEZm9ybV9pZFxuICAgICAgICAgICAgLy8g5YCS5Y+Z5ou/Zm9ybWlkXG4gICAgICAgICAgICBpZiAoICFmb3JtaWQgKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgZmluZCQgPSBhd2FpdCBkYi5jb2xsZWN0aW9uKCdmb3JtLWlkcycpXG4gICAgICAgICAgICAgICAgICAgIC53aGVyZSh7XG4gICAgICAgICAgICAgICAgICAgICAgICBvcGVuaWQsXG4gICAgICAgICAgICAgICAgICAgICAgICBmb3JtaWQ6IF8ubmVxKCd0aGUgZm9ybUlkIGlzIGEgbW9jayBvbmUnKVxuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAub3JkZXJCeSgnY3JlYXRlVGltZScsICdhc2MnKVxuICAgICAgICAgICAgICAgICAgICAubGltaXQoIDEgKVxuICAgICAgICAgICAgICAgICAgICAuZ2V0KCApO1xuXG4gICAgICAgICAgICAgICAgaWYgKCAhZmluZCQuZGF0YVsgMCBdKSB7XG4gICAgICAgICAgICAgICAgICAgIHRocm93IGDor6XnlKjmiLcke29wZW5pZH3msqHmnIlmb3JtaWTjgIFwcmVwYXlfaWRgO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGZvcm1pZCA9IGZpbmQkLmRhdGFbIDAgXS5mb3JtaWQ7XG4gICAgICAgICAgICAgICAgZm9ybWlkX2lkID0gZmluZCQuZGF0YVsgMCBdLl9pZDtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgbGV0IHRleHREYXRhID0geyB9O1xuICAgICAgICAgICAgdGV4dHMubWFwKCggdGV4dCwgaW5kZXggKSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3Qga2V5VGV4dCA9IGBrZXl3b3JkJHtpbmRleCArIDF9YDtcbiAgICAgICAgICAgICAgICB0ZXh0RGF0YSA9IE9iamVjdC5hc3NpZ24oeyB9LCB0ZXh0RGF0YSwge1xuICAgICAgICAgICAgICAgICAgICBbIGtleVRleHQgXSA6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlOiB0ZXh0XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIGNvbnN0IHdlYXBwX3RlbXBsYXRlX21zZyA9IHtcbiAgICAgICAgICAgICAgICBwYWdlLFxuICAgICAgICAgICAgICAgIGRhdGE6IHRleHREYXRhLFxuICAgICAgICAgICAgICAgIGZvcm1faWQ6IGZvcm1pZCxcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZV9pZDogQ09ORklHLnB1c2hfdGVtcGxhdGVbIHR5cGUgXS52YWx1ZVxuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgY29uc29sZS5sb2coJz09PeaOqOmAgScsIHdlYXBwX3RlbXBsYXRlX21zZyApO1xuXG4gICAgICAgICAgICBjb25zdCByZXFEYXRhID0ge1xuICAgICAgICAgICAgICAgIHRvdXNlcjogb3BlbmlkLFxuICAgICAgICAgICAgICAgIHdlYXBwX3RlbXBsYXRlX21zZ1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyDlj5HpgIHmjqjpgIFcbiAgICAgICAgICAgIGNvbnN0IHNlbmQgPSBhd2FpdCAoYXhpb3MgYXMgYW55KSh7XG4gICAgICAgICAgICAgICAgZGF0YTogcmVxRGF0YSxcbiAgICAgICAgICAgICAgICBtZXRob2Q6ICdwb3N0JyxcbiAgICAgICAgICAgICAgICB1cmw6IGBodHRwczovL2FwaS53ZWl4aW4ucXEuY29tL2NnaS1iaW4vbWVzc2FnZS93eG9wZW4vdGVtcGxhdGUvdW5pZm9ybV9zZW5kP2FjY2Vzc190b2tlbj0ke2FjY2Vzc190b2tlbn1gXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgaWYgKCBTdHJpbmcoIHNlbmQuZGF0YS5lcnJjb2RlICkgIT09ICcwJyApIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBzZW5kLmRhdGEuZXJybXNnO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyDliKDpmaTor6XmnaFmb3JtLWlkXG4gICAgICAgICAgICBpZiAoICEhZm9ybWlkX2lkICkge1xuICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgIGF3YWl0IGRiLmNvbGxlY3Rpb24oJ2Zvcm0taWRzJylcbiAgICAgICAgICAgICAgICAgICAgICAgIC5kb2MoIGZvcm1pZF9pZCApXG4gICAgICAgICAgICAgICAgICAgICAgICAucmVtb3ZlKCApO1xuICAgICAgICAgICAgICAgIH0gY2F0Y2ggKCBlICkgeyB9XG4gICAgICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICAgICAgcmV0dXJuIGN0eC5ib2R5ID0ge1xuICAgICAgICAgICAgICAgIGRhdGE6IHNlbmQuZGF0YSxcbiAgICAgICAgICAgICAgICBzdGF0dXM6IDIwMFxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBcbiAgICAgICAgfSBjYXRjaCAoIGUgKSB7XG4gICAgICAgICAgICByZXR1cm4gY3R4LmJvZHkgPSB7XG4gICAgICAgICAgICAgICAgc3RhdHVzOiA1MDAsXG4gICAgICAgICAgICAgICAgbWVzc2FnZTogdHlwZW9mIGUgPT09ICdzdHJpbmcnID8gZSA6IEpTT04uc3RyaW5naWZ5KCBlIClcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0pXG5cbiAgICAvKiogXG4gICAgICogQGRlc2NyaXB0aW9uXG4gICAgICog6K6i6ZiF5o6o6YCBXG4gICAgICoge1xuICAgICAqICAgICAgb3BlbmlkXG4gICAgICogICAgICB0eXBlOiAnYnV5UGluJyB8ICdidXknIHwgJ2dldE1vbmV5JyB8ICd3YWl0UGluJyB8ICduZXdPcmRlcidcbiAgICAgKiAgICAgIHRleHRzOiBbICd4eCcsICd5eScgXVxuICAgICAqICAgICAgP3BhZ2VcbiAgICAgKiB9XG4gICAgICovXG4gICAgYXBwLnJvdXRlcigncHVzaC1zdWJzY3JpYmUnLCBhc3luYyAoIGN0eCwgbmV4dCApID0+IHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGNvbnN0IHsgdHlwZSwgdGV4dHMgfSA9IGV2ZW50LmRhdGE7XG4gICAgICAgICAgICBjb25zdCBvcGVuaWQgPSBldmVudC5kYXRhLm9wZW5JZCB8fCBldmVudC5kYXRhLm9wZW5pZCB8fCBldmVudC51c2VySW5mby5vcGVuSWQ7XG4gICAgICAgICAgICBjb25zdCBwYWdlID0gZXZlbnQuZGF0YS5wYWdlIHx8ICdwYWdlcy90cmlwLWVudGVyL2luZGV4JztcbiAgICAgICAgICAgIGNvbnN0IHRlbXBsYXRlID0gQ09ORklHLnN1YnNjcmliZV90ZW1wbGF0ZXNbIHR5cGUgXTtcblxuICAgICAgICAgICAgbGV0IHRleHREYXRhID0geyB9O1xuICAgICAgICAgICAgdGV4dHMubWFwKCggdGV4dCwgayApID0+IHtcbiAgICAgICAgICAgICAgICB0ZXh0RGF0YSA9IHtcbiAgICAgICAgICAgICAgICAgICAgLi4udGV4dERhdGEsXG4gICAgICAgICAgICAgICAgICAgIFsgdGVtcGxhdGUudGV4dEtleXNbIGsgXV06IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlOiB0ZXh0XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIGNvbnN0IHN1YnNjcmliZURhdGEgPSB7XG4gICAgICAgICAgICAgICAgcGFnZSxcbiAgICAgICAgICAgICAgICBkYXRhOiB0ZXh0RGF0YSxcbiAgICAgICAgICAgICAgICB0b3VzZXI6IG9wZW5pZCxcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZUlkOiB0ZW1wbGF0ZS5pZFxuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgY29uc29sZS5sb2coJz09PeiuoumYheaOqOmAgScsIHN1YnNjcmliZURhdGEgKTtcblxuICAgICAgICAgICAgY29uc3Qgc2VuZCQgPSBhd2FpdCBjbG91ZC5vcGVuYXBpLnN1YnNjcmliZU1lc3NhZ2Uuc2VuZCggc3Vic2NyaWJlRGF0YSApO1xuXG4gICAgICAgICAgICBpZiAoIFN0cmluZyggc2VuZCQuZXJyQ29kZSApICE9PSAnMCcgKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgc2VuZCQuZXJyTXNnO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gY3R4LmJvZHkgPSB7XG4gICAgICAgICAgICAgICAgc3RhdHVzOiAyMDBcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBjYXRjaCAoIGUgKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZygnPz8/PycsIGUgKTtcbiAgICAgICAgICAgIHJldHVybiBjdHguYm9keSA9IHsgXG4gICAgICAgICAgICAgICAgc3RhdHVzOiA1MDAsXG4gICAgICAgICAgICAgICAgZGF0YTogZVxuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgIH0pXG5cbiAgICAvKiogXG4gICAgICogQGRlc2NyaXB0aW9uXG4gICAgICog6K6i6ZiF5o6o6YCB77yM5LqR54mI5pysXG4gICAgICovXG4gICAgYXBwLnJvdXRlcigncHVzaC1zdWJzY3JpYmUtY2xvdWQnLCBhc3luYyggY3R4LCBuZXh0ICkgPT4ge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgY29uc3QgeyB0eXBlLCB0ZXh0cyB9ID0gZXZlbnQuZGF0YTtcbiAgICAgICAgICAgIGNvbnN0IG9wZW5pZCA9IGV2ZW50LmRhdGEub3BlbklkIHx8IGV2ZW50LmRhdGEub3BlbmlkIHx8IGV2ZW50LnVzZXJJbmZvLm9wZW5JZDtcbiAgICAgICAgICAgIGNvbnN0IHBhZ2UgPSBldmVudC5kYXRhLnBhZ2UgfHwgJ3BhZ2VzL3RyaXAtZW50ZXIvaW5kZXgnO1xuICAgICAgICAgICAgY29uc3QgdGVtcGxhdGUgPSBDT05GSUcuc3Vic2NyaWJlX3RlbXBsYXRlc1sgdHlwZSBdO1xuXG4gICAgICAgICAgICBsZXQgdGV4dERhdGEgPSB7IH07XG4gICAgICAgICAgICB0ZXh0cy5tYXAoKCB0ZXh0LCBrICkgPT4ge1xuICAgICAgICAgICAgICAgIHRleHREYXRhID0ge1xuICAgICAgICAgICAgICAgICAgICAuLi50ZXh0RGF0YSxcbiAgICAgICAgICAgICAgICAgICAgWyB0ZW1wbGF0ZS50ZXh0S2V5c1sgayBdXToge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU6IHRleHRcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgY29uc3Qgc3Vic2NyaWJlRGF0YSA9IHtcbiAgICAgICAgICAgICAgICBwYWdlLFxuICAgICAgICAgICAgICAgIGRhdGE6IHRleHREYXRhLFxuICAgICAgICAgICAgICAgIHRvdXNlcjogb3BlbmlkLFxuICAgICAgICAgICAgICAgIHRlbXBsYXRlX2lkOiB0ZW1wbGF0ZS5pZFxuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgLy8g6I635Y+WdG9rZW5cbiAgICAgICAgICAgIGNvbnN0IHJlc3VsdCA9IGF3YWl0IChheGlvcyBhcyBhbnkpKHtcbiAgICAgICAgICAgICAgICBtZXRob2Q6ICdnZXQnLFxuICAgICAgICAgICAgICAgIHVybDogYGh0dHBzOi8vYXBpLndlaXhpbi5xcS5jb20vY2dpLWJpbi90b2tlbj9ncmFudF90eXBlPWNsaWVudF9jcmVkZW50aWFsJmFwcGlkPSR7Q09ORklHLmFwcC5pZH0mc2VjcmV0PSR7Q09ORklHLmFwcC5zZWNyZWN0fWBcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICBjb25zdCB7IGFjY2Vzc190b2tlbiwgZXJyY29kZSB9ID0gcmVzdWx0LmRhdGE7XG5cbiAgICAgICAgICAgIGlmICggZXJyY29kZSApIHtcbiAgICAgICAgICAgICAgICB0aHJvdyAn55Sf5oiQYWNjZXNzX3Rva2Vu6ZSZ6K+vJ1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBjb25zb2xlLmxvZygnPT095LqR54mI5pys6K6i6ZiF5o6o6YCBJywgc3Vic2NyaWJlRGF0YSApO1xuXG4gICAgICAgICAgICBjb25zdCBzZW5kID0gYXdhaXQgKGF4aW9zIGFzIGFueSkoe1xuICAgICAgICAgICAgICAgIGRhdGE6IHN1YnNjcmliZURhdGEsXG4gICAgICAgICAgICAgICAgbWV0aG9kOiAncG9zdCcsXG4gICAgICAgICAgICAgICAgdXJsOiBgaHR0cHM6Ly9hcGkud2VpeGluLnFxLmNvbS9jZ2ktYmluL21lc3NhZ2Uvc3Vic2NyaWJlL3NlbmQ/YWNjZXNzX3Rva2VuPSR7YWNjZXNzX3Rva2VufWBcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBjb25zb2xlLmxvZygnPT095LqR54mI5pys6K6i6ZiF5o6o6YCBJywgc2VuZC5kYXRhICk7XG4gICAgICAgICAgICBpZiAoIFN0cmluZyggc2VuZC5kYXRhLmVycmNvZGUgKSAhPT0gJzAnICkge1xuICAgICAgICAgICAgICAgIHRocm93IHNlbmQuZGF0YS5lcnJtc2c7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiBjdHguYm9keSA9IHtcbiAgICAgICAgICAgICAgICBzdGF0dXM6IDIwMFxuICAgICAgICAgICAgfVxuICAgICAgICB9IGNhdGNoICggZSApIHtcbiAgICAgICAgICAgIHJldHVybiBjdHguYm9keSA9IHsgXG4gICAgICAgICAgICAgICAgc3RhdHVzOiA1MDAsXG4gICAgICAgICAgICAgICAgZGF0YTogZVxuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgLyoqXG4gICAgICogQGRlc2NyaXB0aW9uXG4gICAgICog5Yib5bu65LiA5Liq5YiG5Lqr6K6w5b2VXG4gICAgICog6KGo57uT5p6EIHtcbiAgICAgKiAgICAgIHRvIC8vIOWPl+aOqOiAhVxuICAgICAqICAgICAgZnJvbSAvLyDmjqjlub/ogIVcbiAgICAgKiAgICAgIHBpZFxuICAgICAqICAgICAgY3JlYXRlVGltZSAvLyDliIbkuqvml7bpl7RcbiAgICAgKiAgICAgIGlzU3VjY2VzczogYm9vbGVhbiAvLyDmmK/lkKbmjqjlub/miJDlip9cbiAgICAgKiAgICAgIHN1Y2Nlc3NUaW1lOiAvLyDmjqjlub/miJDlip/nmoTml7bpl7RcbiAgICAgKiB9XG4gICAgICog6K+35rGCe1xuICAgICAqICAgICBwaWRcbiAgICAgKiAgICAgZnJvbVxuICAgICAqIH1cbiAgICAgKi9cbiAgICBhcHAucm91dGVyKCdjcmVhdGUtc2hhcmUnLCBhc3luYyggY3R4LCBuZXh0ICkgPT4ge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgY29uc3Qgb3BlbmlkID0gZXZlbnQudXNlckluZm8ub3BlbklkO1xuICAgICAgICAgICAgY29uc3QgeyBmcm9tLCBwaWQgfSA9IGV2ZW50LmRhdGE7XG5cbiAgICAgICAgICAgIC8vIOinhOWImTE66Ziy6YeN5aSNXG4gICAgICAgICAgICAvLyDlpoLmnpxB57uZQuaOqOW5v+i/h+WVhuWTgTHvvIzliJlD57uZQuaOqOW5v+WVhuWTgTHml6DmlYhcbiAgICAgICAgICAgIGNvbnN0IGNvdW50JCA9IGF3YWl0IGRiLmNvbGxlY3Rpb24oJ3NoYXJlLXJlY29yZCcpXG4gICAgICAgICAgICAgICAgLndoZXJlKHtcbiAgICAgICAgICAgICAgICAgICAgcGlkLFxuICAgICAgICAgICAgICAgICAgICBvcGVuaWQsXG4gICAgICAgICAgICAgICAgICAgIGlzU3VjY2VzczogZmFsc2VcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIC5jb3VudCggKTtcblxuICAgICAgICAgICAgaWYgKCBjb3VudCQudG90YWwgPiAwICkge1xuICAgICAgICAgICAgICAgIHJldHVybiBjdHguYm9keSA9IHsgc3RhdHVzOiAyMDAgfTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8g6KeE5YiZMjog5LiN6IO96Ieq5bex5o6o6Ieq5bexXG4gICAgICAgICAgICBpZiAoIG9wZW5pZCA9PT0gZnJvbSApIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gY3R4LmJvZHkgPSB7IHN0YXR1czogMjAwIH07XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIOinhOWImTM6IDI0aOWGheS4jeiDvemHjeWkjeaOqFxuICAgICAgICAgICAgY29uc3QgY291bnQyJCA9IGF3YWl0IGRiLmNvbGxlY3Rpb24oJ3NoYXJlLXJlY29yZCcpXG4gICAgICAgICAgICAgICAgLndoZXJlKHtcbiAgICAgICAgICAgICAgICAgICAgcGlkLFxuICAgICAgICAgICAgICAgICAgICBvcGVuaWQsXG4gICAgICAgICAgICAgICAgICAgIGlzU3VjY2VzczogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgc3VjY2Vzc1RpbWU6IF8uZ3RlKCBnZXROb3coIHRydWUgKSAtIDI0ICogNjAgKiA2MCAqIDEwMDAgKVxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLmNvdW50KCApO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICBpZiAoIGNvdW50MiQudG90YWwgPiAwICkge1xuICAgICAgICAgICAgICAgIHJldHVybiBjdHguYm9keSA9IHsgc3RhdHVzOiAyMDAgfTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8g5Yib5bu6XG4gICAgICAgICAgICBjb25zdCBjcmVhdGUkID0gYXdhaXQgZGIuY29sbGVjdGlvbignc2hhcmUtcmVjb3JkJylcbiAgICAgICAgICAgICAgICAuYWRkKHtcbiAgICAgICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgICAgICAgcGlkLFxuICAgICAgICAgICAgICAgICAgICAgICAgZnJvbSxcbiAgICAgICAgICAgICAgICAgICAgICAgIG9wZW5pZCxcbiAgICAgICAgICAgICAgICAgICAgICAgIGlzU3VjY2VzczogZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgICAgICBjcmVhdGVUaW1lOiBnZXROb3coIHRydWUgKVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHJldHVybiBjdHguYm9keSA9IHsgc3RhdHVzOiAyMDAgfTtcblxuICAgICAgICB9IGNhdGNoICggZSApIHtcbiAgICAgICAgICAgIHJldHVybiBjdHguYm9keSA9IHtcbiAgICAgICAgICAgICAgICBzdGF0dXM6IDUwMFxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSlcblxuICAgIC8qKiBcbiAgICAgKiBAZGVzY3JpcHRpb25cbiAgICAgKiDojrflj5bmjqjlub/np6/liIZcbiAgICAgKiB7XG4gICAgICogICAgc2hvd01vcmU/OiBmYWxzZVxuICAgICAqIH1cbiAgICAgKi9cbiAgICBhcHAucm91dGVyKCdwdXNoLWludGVncmFsJywgYXN5bmMgKCBjdHgsIG5leHQgKSA9PiB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBjb25zdCB7IHNob3dNb3JlIH0gPSBldmVudC5kYXRhO1xuICAgICAgICAgICAgY29uc3Qgb3BlbmlkID0gZXZlbnQuZGF0YS5vcGVuSWQgfHwgZXZlbnQudXNlckluZm8ub3BlbklkO1xuICAgICAgICAgICAgY29uc3QgdXNlciQgPSBhd2FpdCBkYi5jb2xsZWN0aW9uKCd1c2VyJylcbiAgICAgICAgICAgICAgICAud2hlcmUoe1xuICAgICAgICAgICAgICAgICAgICBvcGVuaWRcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIC5nZXQoICk7XG4gICAgICAgICAgICBjb25zdCB1c2VyID0gdXNlciQuZGF0YVsgMCBdO1xuXG4gICAgICAgICAgICBjb25zdCBleHAgPSAhIXVzZXIgPyB1c2VyLmV4cCB8fCAwIDogMDtcbiAgICAgICAgICAgIGNvbnN0IGludGVncmFsID0gISF1c2VyID8gdXNlci5wdXNoX2ludGVncmFsIHx8IDAgOiAwO1xuXG4gICAgICAgICAgICByZXR1cm4gY3R4LmJvZHkgPSB7XG4gICAgICAgICAgICAgICAgc3RhdHVzOiAyMDAsXG4gICAgICAgICAgICAgICAgZGF0YTogIXNob3dNb3JlID8gXG4gICAgICAgICAgICAgICAgICAgIGludGVncmFsIDpcbiAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgZXhwLFxuICAgICAgICAgICAgICAgICAgICAgICAgaW50ZWdyYWwsXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICB9IGNhdGNoICggZSApIHtcbiAgICAgICAgICAgIHJldHVybiBjdHguYm9keSA9IHsgc3RhdHVzOiA1MDAgfTtcbiAgICAgICAgfSBcbiAgICB9KVxuXG4gICAgLyoqXG4gICAgICogQGRlc2NyaXB0aW9uXG4gICAgICog6I635Y+W56ev5YiG5L2/55So6K6w5b2VXG4gICAgICoge1xuICAgICAqICAgIHRpZHM6ICdhLGIsYydcbiAgICAgKiAgICB0eXBlOiAncHVzaF9pbnRlZ3JhbCcgfCAnJ1xuICAgICAqIH1cbiAgICAgKi9cbiAgICBhcHAucm91dGVyKCdwdXNoLWludGVncmFsLXVzZScsIGFzeW5jICggY3R4LCBuZXh0ICkgPT4ge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgY29uc3QgeyB0aWRzLCB0eXBlIH0gPSBldmVudC5kYXRhO1xuICAgICAgICAgICAgY29uc3Qgb3BlbmlkID0gZXZlbnQuZGF0YS5vcGVuSWQgfHwgZXZlbnQuZGF0YS5vcGVuaWQgfHwgZXZlbnQudXNlckluZm8ub3BlbklkO1xuXG4gICAgICAgICAgICBjb25zdCBmaW5kJDogYW55ID0gYXdhaXQgUHJvbWlzZS5hbGwoXG4gICAgICAgICAgICAgICAgdGlkcy5zcGxpdCgnLCcpXG4gICAgICAgICAgICAgICAgICAgIC5tYXAoIHRpZCA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gZGIuY29sbGVjdGlvbignaW50ZWdyYWwtdXNlLXJlY29yZCcpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLndoZXJlKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGlkLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvcGVuaWRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5nZXQoICk7XG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICApO1xuXG4gICAgICAgICAgICBjb25zdCBtZXRhID0gZmluZCRcbiAgICAgICAgICAgICAgICAuZmlsdGVyKCB4ID0+ICEheC5kYXRhWyAwIF0pXG4gICAgICAgICAgICAgICAgLm1hcCggeCA9PiB4LmRhdGFbIDAgXSk7XG5cbiAgICAgICAgICAgIHJldHVybiBjdHguYm9keSA9IHtcbiAgICAgICAgICAgICAgICBkYXRhOiBtZXRhLFxuICAgICAgICAgICAgICAgIHN0YXR1czogMjAwXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfSBjYXRjaCAoIGUgKSB7XG4gICAgICAgICAgICByZXR1cm4gY3R4LmJvZHkgPSB7XG4gICAgICAgICAgICAgICAgc3RhdHVzOiA1MDBcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0pXG5cbiAgICAvKipcbiAgICAgKiBAZGVzY3JpcHRpb25cbiAgICAgKiDnrb7liLDpoobnp6/liIZcbiAgICAgKiB7XG4gICAgICogICAgICBleHA6IG51bWJlclxuICAgICAqIH1cbiAgICAgKi9cbiAgICBhcHAucm91dGVyKCdnZXQtZXhwJywgYXN5bmMgKCBjdHgsIG5leHQgKSA9PiB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBjb25zdCB7IGV4cCB9ID0gZXZlbnQuZGF0YTtcbiAgICAgICAgICAgIGNvbnN0IG9wZW5pZCA9IGV2ZW50LmRhdGEub3BlbklkIHx8IGV2ZW50LmRhdGEub3BlbmlkIHx8IGV2ZW50LnVzZXJJbmZvLm9wZW5JZDtcblxuICAgICAgICAgICAgY29uc3QgdXNlciQgPSBhd2FpdCBkYi5jb2xsZWN0aW9uKCd1c2VyJylcbiAgICAgICAgICAgICAgICAud2hlcmUoe1xuICAgICAgICAgICAgICAgICAgICBvcGVuaWRcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIC5nZXQoICk7XG5cbiAgICAgICAgICAgIGNvbnN0IHVzZXIgPSB1c2VyJC5kYXRhWyAwIF0gfHwgbnVsbDtcblxuICAgICAgICAgICAgaWYgKCAhdXNlciApIHsgcmV0dXJuIGN0eC5ib2R5ID0geyBzdGF0dXM6IDIwMCB9fTtcblxuICAgICAgICAgICAgY29uc3QgYmRfdWlkID0gdXNlci5faWQ7XG4gICAgICAgICAgICBjb25zdCBib2R5ID0ge1xuICAgICAgICAgICAgICAgIC4uLnVzZXIsXG4gICAgICAgICAgICAgICAgZXhwOiAhdXNlci5leHAgPyBleHAgOiB1c2VyLmV4cCArIGV4cFxuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgZGVsZXRlIGJvZHlbJ19pZCddO1xuXG4gICAgICAgICAgICBjb25zdCB1cGRhdGUkID0gYXdhaXQgZGIuY29sbGVjdGlvbigndXNlcicpXG4gICAgICAgICAgICAgICAgLmRvYyggU3RyaW5nKCBiZF91aWQgKSlcbiAgICAgICAgICAgICAgICAuc2V0KHtcbiAgICAgICAgICAgICAgICAgICAgZGF0YTogYm9keVxuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICByZXR1cm4gY3R4LmJvZHkgPSB7XG4gICAgICAgICAgICAgICAgc3RhdHVzOiAyMDBcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgfSBjYXRjaCAoIGUgKSB7XG4gICAgICAgICAgICByZXR1cm4gY3R4LmJvZHkgPSB7IHN0YXR1czogNTAwIH07XG4gICAgICAgIH1cbiAgICB9KVxuXG4gICAgLyoqXG4gICAgICogQGRlc2NyaXB0aW9uXG4gICAgICog562+5Yiw6aKG56ev5YiGXG4gICAgICoge1xuICAgICAqICAgICAgaW50ZWdyYWw6IG51bWJlclxuICAgICAqIH1cbiAgICAgKi9cbiAgICBhcHAucm91dGVyKCdnZXQtaW50ZWdyYWwnLCBhc3luYyAoIGN0eCwgbmV4dCApID0+IHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGNvbnN0IHsgaW50ZWdyYWwgfSA9IGV2ZW50LmRhdGE7XG4gICAgICAgICAgICBjb25zdCBvcGVuaWQgPSBldmVudC5kYXRhLm9wZW5JZCB8fCBldmVudC5kYXRhLm9wZW5pZCB8fCBldmVudC51c2VySW5mby5vcGVuSWQ7XG5cbiAgICAgICAgICAgIGNvbnN0IHVzZXIkID0gYXdhaXQgZGIuY29sbGVjdGlvbigndXNlcicpXG4gICAgICAgICAgICAgICAgLndoZXJlKHtcbiAgICAgICAgICAgICAgICAgICAgb3BlbmlkXG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAuZ2V0KCApO1xuXG4gICAgICAgICAgICBjb25zdCB1c2VyID0gdXNlciQuZGF0YVsgMCBdIHx8IG51bGw7XG5cbiAgICAgICAgICAgIGlmICggIXVzZXIgKSB7IHJldHVybiBjdHguYm9keSA9IHsgc3RhdHVzOiAyMDAgfX07XG5cbiAgICAgICAgICAgIGNvbnN0IGJkX3VpZCA9IHVzZXIuX2lkO1xuICAgICAgICAgICAgY29uc3QgYm9keSA9IHtcbiAgICAgICAgICAgICAgICAuLi51c2VyLFxuICAgICAgICAgICAgICAgIHB1c2hfaW50ZWdyYWw6ICF1c2VyLnB1c2hfaW50ZWdyYWwgPyBcbiAgICAgICAgICAgICAgICAgICAgaW50ZWdyYWwgOlxuICAgICAgICAgICAgICAgICAgICBOdW1iZXIoKCB1c2VyLnB1c2hfaW50ZWdyYWwgKyBpbnRlZ3JhbCApLnRvRml4ZWQoIDIgKSlcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIGRlbGV0ZSBib2R5WydfaWQnXTtcblxuICAgICAgICAgICAgY29uc3QgdXBkYXRlJCA9IGF3YWl0IGRiLmNvbGxlY3Rpb24oJ3VzZXInKVxuICAgICAgICAgICAgICAgIC5kb2MoIFN0cmluZyggYmRfdWlkICkpXG4gICAgICAgICAgICAgICAgLnNldCh7XG4gICAgICAgICAgICAgICAgICAgIGRhdGE6IGJvZHlcbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgcmV0dXJuIGN0eC5ib2R5ID0ge1xuICAgICAgICAgICAgICAgIHN0YXR1czogMjAwXG4gICAgICAgICAgICB9O1xuXG4gICAgICAgIH0gY2F0Y2ggKCBlICkge1xuICAgICAgICAgICAgcmV0dXJuIGN0eC5ib2R5ID0geyBzdGF0dXM6IDUwMCB9O1xuICAgICAgICB9XG4gICAgfSlcblxuICAgIC8qKlxuICAgICAqIEBkZXNjcmlwdGlvblxuICAgICAqIOmihuWPluaKteeOsOmHkeaIkOWKn++8jOaOqOmAgVxuICAgICAqIOW5tuiuvue9rjLlsI/ml7blgJnlkI7nmoTnu4/pqozojrflj5bmjqjpgIFcbiAgICAgKiB7XG4gICAgICogICAgICBzaWduRXhwOiDpooblj5bnmoTnu4/pqoxcbiAgICAgKiAgICAgIGdldF9pbnRlZ3JhbDogbnVtYmVyIC8vIOacrOasoeiOt+W+l1xuICAgICAqICAgICAgbmV4dF9pbnRlZ3JhbDogbnVtYmVyIC8vIOS4i+asoeiOt+W+l1xuICAgICAqICAgICAgd2Vla19pbnRlZ3JhbDogbnVtYmVyIC8vIOacrOWRqOiOt+W+l1xuICAgICAqICAgICAgbmV4dHdlZWtfaW50ZWdyYWw6IG51bWJlciAvLyDkuIvlkajojrflvpdcbiAgICAgKiB9XG4gICAgICovXG4gICAgYXBwLnJvdXRlcignZ2V0LWludGVncmFsLXB1c2gnLCBhc3luYyAoIGN0eCwgbmV4dCApID0+IHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGNvbnN0IG9wZW5pZCA9IGV2ZW50LmRhdGEub3BlbklkIHx8IGV2ZW50LmRhdGEub3BlbmlkIHx8IGV2ZW50LnVzZXJJbmZvLm9wZW5JZDtcbiAgICAgICAgICAgIGNvbnN0IHsgc2lnbkV4cCwgZ2V0X2ludGVncmFsLCBuZXh0X2ludGVncmFsLCB3ZWVrX2ludGVncmFsLCBuZXh0d2Vla19pbnRlZ3JhbCB9ID0gZXZlbnQuZGF0YTtcblxuICAgICAgICAgICAgLy8gNOOAgeiwg+eUqOaOqOmAgVxuICAgICAgICAgICAgY29uc3QgcHVzaCQgPSBhd2FpdCBjbG91ZC5jYWxsRnVuY3Rpb24oe1xuICAgICAgICAgICAgICAgIG5hbWU6ICdjb21tb24nLFxuICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgJHVybDogJ3B1c2gtc3Vic2NyaWJlLWNsb3VkJyxcbiAgICAgICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgICAgICAgb3BlbmlkLFxuICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogJ2hvbmdiYW8nLFxuICAgICAgICAgICAgICAgICAgICAgICAgcGFnZTogJ3BhZ2VzL215L2luZGV4JyxcbiAgICAgICAgICAgICAgICAgICAgICAgIHRleHRzOiBbYCR7Z2V0X2ludGVncmFsfeWFg+aKteeOsOmHke+8gWAsIGDkuIvljZXlsLHog73nlKjvvIHmnKzlkajnmbvpmYbpgIEke3dlZWtfaW50ZWdyYWx95YWD77yBYF1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAvLyA144CB5o+S5YWl6LCD55So5qCIXG4gICAgICAgICAgICBjb25zdCBjcmVhdGUkID0gYXdhaXQgZGIuY29sbGVjdGlvbigncHVzaC10aW1lcicpXG4gICAgICAgICAgICAgICAgLmFkZCh7XG4gICAgICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG9wZW5pZCxcbiAgICAgICAgICAgICAgICAgICAgICAgIHRleHRzOiBbYOeZu+mZhumihuWPliR7c2lnbkV4cH3ngrnnu4/pqoxgLCBg5Y2H57qn5ZCO77yM5YWo5ZGo5Y+v6aKGJHtuZXh0d2Vla19pbnRlZ3JhbH3lhYPvvIFgXSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHB1c2h0aW1lOiBnZXROb3coIHRydWUgKSArIDIuMSAqIDYwICogNjAgKiAxMDAwLFxuICAgICAgICAgICAgICAgICAgICAgICAgZGVzYzogJ+WIsOaXtumXtOmihuWPlue7j+mqjOS6hicsXG4gICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiAndXNlci1leHAtZ2V0J1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHJldHVybiBjdHguYm9keSA9IHsgc3RhdHVzOiAyMDAgfTtcblxuICAgICAgICB9IGNhdGNoICggZSApIHtcbiAgICAgICAgICAgIHJldHVybiBjdHguYm9keSA9IHsgc3RhdHVzOiA1MDAgfTtcbiAgICAgICAgfVxuICAgIH0pXG5cbiAgICAvKiogXG4gICAgICogQGRlc2NyaXB0aW9uXG4gICAgICog6I635Y+W6K6i6ZiF5qih5p2/5YiX6KGoXG4gICAgICovXG4gICAgYXBwLnJvdXRlcignZ2V0LXN1YnNjcmliZS10ZW1wbGF0ZXMnLCBhc3luYyAoIGN0eCwgbmV4dCApID0+IHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIHJldHVybiBjdHguYm9keSA9IHsgXG4gICAgICAgICAgICAgICAgc3RhdHVzOiAyMDAsXG4gICAgICAgICAgICAgICAgZGF0YTogQ09ORklHLnN1YnNjcmliZV90ZW1wbGF0ZXNcbiAgICAgICAgICAgIH07XG4gICAgICAgIH0gY2F0Y2ggKCBlICkge1xuICAgICAgICAgICAgcmV0dXJuIGN0eC5ib2R5ID0geyBzdGF0dXM6IDUwMCB9O1xuICAgICAgICB9XG4gICAgfSlcblxuICAgIC8qKlxuICAgICAqIEBkZXNjcmlwdGlvblxuICAgICAqIOagueaNrm9wZW5pZOi/lOWbnueUqOaIt+S/oeaBr++8iOWPr+i/lOWbnm51bGzvvIlcbiAgICAgKi9cbiAgICBhcHAucm91dGVyKCdnZXQtdXNlci1pbmZvJywgYXN5bmMgKCBjdHgsIG5leHQgKSA9PiB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBjb25zdCBvcGVuaWQgPSBldmVudC5kYXRhLm9wZW5JZCB8fCBldmVudC5kYXRhLm9wZW5pZCB8fCBldmVudC51c2VySW5mby5vcGVuSWQ7XG4gICAgICAgICAgICBjb25zdCB1c2VyJCA9IGF3YWl0IGRiLmNvbGxlY3Rpb24oJ3VzZXInKVxuICAgICAgICAgICAgICAgIC53aGVyZSh7XG4gICAgICAgICAgICAgICAgICAgIG9wZW5pZFxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLmdldCggKTtcblxuICAgICAgICAgICAgY29uc3QgZGF0YSA9IHVzZXIkLmRhdGFbIDAgXSB8fCBudWxsO1xuXG4gICAgICAgICAgICByZXR1cm4gY3R4LmJvZHkgPSB7XG4gICAgICAgICAgICAgICAgZGF0YSxcbiAgICAgICAgICAgICAgICBzdGF0dXM6IDIwMFxuICAgICAgICAgICAgfVxuICAgICAgICB9IGNhdGNoICggZSApIHtcbiAgICAgICAgICAgIHJldHVybiBjdHguYm9keSA9IHtcbiAgICAgICAgICAgICAgICBzdGF0dXM6IDIwMCxcbiAgICAgICAgICAgICAgICBkYXRhOiBlXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9KVxuXG4gICAgLyoqIFxuICAgICAqIEBkZXNjcmlwdGlvblxuICAgICAqIOa1i+ivleS4k+eUqFxuICAgICAqL1xuICAgIGFwcC5yb3V0ZXIoJ3Rlc3QnLCBhc3luYyAoIGN0eCwgbmV4dCApID0+IHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgLy8g5om+5Yiw5pio5pma5LiL5Y2INueCueWQjueahOaXtumXtOaIs1xuICAgICAgICAgICAgY29uc3Qgbm93VGltZSA9IGdldE5vdyggKTtcbiAgICAgICAgICAgIGNvbnN0IHkgPSBub3dUaW1lLmdldEZ1bGxZZWFyKCApO1xuICAgICAgICAgICAgY29uc3QgbSA9IG5vd1RpbWUuZ2V0TW9udGgoICkgKyAxO1xuICAgICAgICAgICAgY29uc3QgZCA9IG5vd1RpbWUuZ2V0RGF0ZSggKTtcbiAgICAgICAgICAgIGNvbnN0IGxhc3ROaWdodFRpbWUgPSBuZXcgRGF0ZShgJHt5fS8ke219LyR7ZH0gMDA6MDA6MDBgKTtcbiAgICAgICAgICAgIGNvbnN0IHRpbWUgPSBsYXN0TmlnaHRUaW1lLmdldFRpbWUoICkgLSA2ICogNjAgKiA2MCAqIDEwMDA7XG5cbiAgICAgICAgICAgIC8vIOaKiui/meS4quaXtumXtOeCueS7peWQjueahOafpeeci+WVhuWTgeiusOW9lemDveaLv+WHuuadpVxuICAgICAgICAgICAgY29uc3QgdmlzaXRvclJlY29yZHMkID0gYXdhaXQgZGIuY29sbGVjdGlvbignZ29vZC12aXNpdGluZy1yZWNvcmQnKVxuICAgICAgICAgICAgICAgIC53aGVyZSh7XG4gICAgICAgICAgICAgICAgICAgIHZpc2l0VGltZTogXy5ndGUoIHRpbWUgKVxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLmZpZWxkKHtcbiAgICAgICAgICAgICAgICAgICAgcGlkOiB0cnVlXG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAuZ2V0KCApO1xuICAgICAgICAgICAgY29uc3QgdmlzaXRvclJlY29yZHMgPSB2aXNpdG9yUmVjb3JkcyQuZGF0YTtcblxuICAgICAgICAgICAgLy8g5ou/5Yiw5rWP6KeI6K6w5b2V5pyA6auY55qE5ZWG5ZOBXG4gICAgICAgICAgICBsZXQgbWF4UGlkID0gJyc7XG4gICAgICAgICAgICBsZXQgbWF4TnVtID0gMDtcbiAgICAgICAgICAgIHZpc2l0b3JSZWNvcmRzLnJlZHVjZSgoIHJlcywgcmVjb3JkICkgPT4ge1xuICAgICAgICAgICAgICAgIHJlc1sgcmVjb3JkLnBpZCBdID0gIXJlc1sgcmVjb3JkLnBpZCBdID8gMSA6IHJlc1sgcmVjb3JkLnBpZCBdICsgMTtcbiAgICAgICAgICAgICAgICBpZiAoIHJlc1sgcmVjb3JkLnBpZCBdID4gbWF4TnVtICkge1xuICAgICAgICAgICAgICAgICAgICBtYXhQaWQgPSByZWNvcmQucGlkO1xuICAgICAgICAgICAgICAgICAgICBtYXhOdW0gPSByZXNbIHJlY29yZC5waWQgXTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlcztcbiAgICAgICAgICAgIH0sIHsgfSk7XG5cbiAgICAgICAgICAgIC8vIOiLpeacie+8jOiOt+WPlui/meS4quWVhuWTgeeahOaAu+aLvOWbouS6uuaVsFxuICAgICAgICAgICAgaWYgKCAhbWF4TnVtIHx8ICFtYXhQaWQgKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGN0eC5ib2R5ID0geyBzdGF0dXM6IDIwMCB9XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAvLyDpgLvovpHvvJrpgJrov4dvcmRlcueahGNyZWF0ZXRpbWXmib7liLB0aWTvvIwg6YCa6L+HIHRpZCsgcGlkIOaJvuWIsHNob3BwaW5nbGlzdFxuICAgICAgICAgICAgY29uc3Qgb3JkZXIkID0gYXdhaXQgZGIuY29sbGVjdGlvbignb3JkZXInKVxuICAgICAgICAgICAgICAgIC53aGVyZSh7XG4gICAgICAgICAgICAgICAgICAgIGNyZWF0ZVRpbWU6IF8uZ3RlKCB0aW1lIClcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIC5maWVsZCh7XG4gICAgICAgICAgICAgICAgICAgIHRpZDogdHJ1ZVxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLmxpbWl0KCAxIClcbiAgICAgICAgICAgICAgICAuZ2V0KCApO1xuICAgICAgICAgICAgY29uc3Qgb3JkZXIgPSBvcmRlciQuZGF0YVsgMCBdO1xuXG4gICAgICAgICAgICBpZiAoIG9yZGVyJC5kYXRhLmxlbmd0aCA9PT0gMCApIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gY3R4LmJvZHkgPSB7IHN0YXR1czogMjAwIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgY29uc3Qgc2wkID0gYXdhaXQgZGIuY29sbGVjdGlvbignc2hvcHBpbmctbGlzdCcpXG4gICAgICAgICAgICAgICAgLndoZXJlKHtcbiAgICAgICAgICAgICAgICAgICAgcGlkOiBtYXhQaWQsXG4gICAgICAgICAgICAgICAgICAgIHRpZDogb3JkZXIudGlkXG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAuZmllbGQoe1xuICAgICAgICAgICAgICAgICAgICB1aWRzOiB0cnVlXG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAuZ2V0KCApO1xuICAgICAgICAgICAgY29uc3Qgc2wgPSBzbCQuZGF0YVsgMCBdO1xuXG4gICAgICAgICAgICBpZiAoIHNsJC5kYXRhLmxlbmd0aCA9PT0gMCApIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gY3R4LmJvZHkgPSB7IHN0YXR1czogMjAwIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8g6I635Y+W5omA5pyJ566h55CG5ZGYXG4gICAgICAgICAgICBjb25zdCBhZG1zJCA9IGF3YWl0IGRiLmNvbGxlY3Rpb24oJ21hbmFnZXItbWVtYmVyJylcbiAgICAgICAgICAgICAgICAud2hlcmUoeyB9KVxuICAgICAgICAgICAgICAgIC5nZXQoICk7XG5cbiAgICAgICAgICAgIC8vIOiOt+WPluWVhuWTgeivpuaDhVxuICAgICAgICAgICAgY29uc3QgZ29vZCQgPSBhd2FpdCBkYi5jb2xsZWN0aW9uKCdnb29kcycpXG4gICAgICAgICAgICAgICAgLmRvYyggU3RyaW5nKCBtYXhQaWQgKSlcbiAgICAgICAgICAgICAgICAuZmllbGQoe1xuICAgICAgICAgICAgICAgICAgICB0aXRsZTogdHJ1ZVxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLmdldCggKTtcblxuICAgICAgICAgICAgLy8g5o6o6YCBXG4gICAgICAgICAgICBhd2FpdCBQcm9taXNlLmFsbChcbiAgICAgICAgICAgICAgICBhZG1zJC5kYXRhLm1hcCggYXN5bmMgYWRtID0+IHtcbiAgICAgICAgICAgICAgICAgICAgYXdhaXQgY2xvdWQuY2FsbEZ1bmN0aW9uKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6ICdjb21tb24nLFxuICAgICAgICAgICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICR1cmw6ICdwdXNoLXN1YnNjcmliZS1jbG91ZCcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvcGVuaWQ6IGFkbS5vcGVuaWQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6ICd3YWl0UGluJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGFnZTogYHBhZ2VzL21hbmFnZXItdHJpcC1vcmRlci9pbmRleD9pZD0ke29yZGVyLnRpZH1gLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZXh0czogW2DmmKjlpKnmnIkke21heE51bX3kurrmtY/op4jvvIwke3NsLnVpZHMubGVuZ3RofeS6uuaIkOWKnyR7c2wudWlkcy5sZW5ndGggPiAxID8gJ+aLvOWbou+8gScgOiAn5LiL5Y2V77yBJ31gLCBgJHtnb29kJC5kYXRhLnRpdGxlfWBdXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICApO1xuXG4gICAgICAgICAgICByZXR1cm4gY3R4LmJvZHkgPSB7XG4gICAgICAgICAgICAgICAgc3RhdHVzOiAyMDBcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBjYXRjaCAoIGUgKSB7XG4gICAgICAgICAgICByZXR1cm4gY3R4LmJvZHkgPSB7IFxuICAgICAgICAgICAgICAgIHN0YXR1czogNTAwLFxuICAgICAgICAgICAgICAgIGRhdGE6IGVcbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICB9KVxuXG4gICAgcmV0dXJuIGFwcC5zZXJ2ZSggKTtcblxufVxuXG5jb25zdCB0aW1lID0gdHMgPT4gbmV3IFByb21pc2UoIHJlc292bGUgPT4ge1xuICAgIHNldFRpbWVvdXQoKCApID0+IHJlc292bGUoICksIHRzICk7XG59KVxuXG4vKipcbiAqIOWIneWni+WMluaVsOaNruW6k+OAgeWfuuehgOaVsOaNrlxuICovXG5jb25zdCBpbml0REIgPSAoICkgPT4gbmV3IFByb21pc2UoIGFzeW5jIHJlc29sdmUgPT4ge1xuICAgIHRyeSB7XG5cbiAgICAgICAgLyoqIOWIneWni+WMluihqCAqL1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgY29uc3QgY29sbGVjdGlvbnMgPSBDT05GSUcuY29sbGVjdGlvbnM7XG4gICAgICAgICAgICBhd2FpdCBQcm9taXNlLmFsbChcbiAgICAgICAgICAgICAgICBjb2xsZWN0aW9ucy5tYXAoIGNvbGxlY3Rpb25OYW1lID0+IChkYiBhcyBhbnkpLmNyZWF0ZUNvbGxlY3Rpb24oIGNvbGxlY3Rpb25OYW1lICkpXG4gICAgICAgICAgICApO1xuICAgICAgICB9IGNhdGNoICggZSApIHsgfVxuXG4gICAgICAgIGF3YWl0IHRpbWUoIDgwMCApO1xuXG4gICAgICAgIC8qKiDliJ3lp4vljJbmlbDmja7lrZflhbggKi9cbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGNvbnN0IGRpY3MgPSBDT05GSUcuZGljO1xuICAgICAgICAgICAgYXdhaXQgUHJvbWlzZS5hbGwoXG4gICAgICAgICAgICAgICAgZGljcy5tYXAoIGFzeW5jIGRpY1NldCA9PiB7XG5cbiAgICAgICAgICAgICAgICAgICAgY29uc3QgdGFyZ2V0RGljJCA9IGF3YWl0IGRiLmNvbGxlY3Rpb24oJ2RpYycpXG4gICAgICAgICAgICAgICAgICAgICAgICAud2hlcmUoe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJlbG9uZzogZGljU2V0LmJlbG9uZ1xuICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgICAgIC5nZXQoICk7XG5cbiAgICAgICAgICAgICAgICAgICAgY29uc3QgdGFyZ2V0RGljID0gdGFyZ2V0RGljJC5kYXRhWyAwIF07XG4gICAgICAgICAgICAgICAgICAgIGlmICggISF0YXJnZXREaWMgKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBhd2FpdCBkYi5jb2xsZWN0aW9uKCdkaWMnKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5kb2MoIFN0cmluZyggdGFyZ2V0RGljLl9pZCApKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5zZXQoe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhOiBkaWNTZXRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgYXdhaXQgZGIuY29sbGVjdGlvbignZGljJylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAuYWRkKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YTogZGljU2V0XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgKTtcbiAgICAgICAgfSBjYXRjaCAoIGUgKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZygnZWVlJywgZSApO1xuICAgICAgICB9XG5cbiAgICAgICAgLyoqIOWIneWni+WMluW6lOeUqOmFjee9riAqL1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgY29uc3QgYXBwQ29uZiA9IENPTkZJRy5hcHBDb25mcztcbiAgICAgICAgICAgIGF3YWl0IFByb21pc2UuYWxsKFxuICAgICAgICAgICAgICAgIGFwcENvbmYubWFwKCBhc3luYyBjb25mID0+IHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgdGFyZ2V0Q29uZiQgPSBhd2FpdCBkYi5jb2xsZWN0aW9uKCdhcHAtY29uZmlnJylcbiAgICAgICAgICAgICAgICAgICAgICAgIC53aGVyZSh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogY29uZi50eXBlXG4gICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAgICAgLmdldCggKTtcblxuICAgICAgICAgICAgICAgICAgICBjb25zdCB0YXJnZXRDb25mID0gdGFyZ2V0Q29uZiQuZGF0YVsgMCBdO1xuICAgICAgICAgICAgICAgICAgICBpZiAoICEhdGFyZ2V0Q29uZiApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIOeUseS6jumFjee9ruW3sue7j+eUn+aViOS4lOaKleWFpeS9v+eUqO+8jOi/memHjOS4jeiDveebtOaOpeabtOaUueW3suacieeahOe6v+S4iumFjee9rlxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gYXdhaXQgZGIuY29sbGVjdGlvbignYXBwLWNvbmZpZycpXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyAgICAgLmRvYyggU3RyaW5nKCB0YXJnZXRDb25mLl9pZCApKVxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gICAgIC5zZXQoe1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gICAgICAgICBkYXRhOiBjb25mXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGF3YWl0IGRiLmNvbGxlY3Rpb24oJ2FwcC1jb25maWcnKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5hZGQoe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhOiBjb25mXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgKTtcbiAgICAgICAgfSBjYXRjaCAoIGUgKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZygnZWVlJywgZSApO1xuICAgICAgICB9XG5cbiAgICAgICAgcmVzb2x2ZSggKTtcblxuICAgIH0gY2F0Y2ggKCBlICkgeyByZXNvbHZlKCApO31cbn0pOyJdfQ==