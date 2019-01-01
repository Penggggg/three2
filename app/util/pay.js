"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var http_1 = require("./http");
exports.wxPay = function (total_fee, successCB, completeCB) {
    if (!total_fee) {
        successCB && successCB();
        completeCB && completeCB();
        return;
    }
    http_1.http({
        url: 'common_wxpay',
        data: {
            total_fee: Math.floor(total_fee * 100)
        },
        errMsg: '支付失败，请重试',
        success: function (res) {
            if (res.status !== 200) {
                return;
            }
            var _a = res.data, nonce_str = _a.nonce_str, paySign = _a.paySign, prepay_id = _a.prepay_id, timeStamp = _a.timeStamp;
            wx.requestPayment({
                paySign: paySign,
                timeStamp: timeStamp,
                signType: 'MD5',
                nonceStr: nonce_str,
                package: "prepay_id=" + prepay_id,
                success: function (res) {
                    var errMsg = res.errMsg;
                    if (errMsg === 'requestPayment:ok') {
                        successCB && successCB();
                    }
                },
                fail: function (err) {
                    wx.showToast({
                        icon: 'none',
                        title: '支付失败，请重试'
                    });
                },
                complete: function () { completeCB && completeCB(); }
            });
        }
    });
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGF5LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsicGF5LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsK0JBQThCO0FBR2pCLFFBQUEsS0FBSyxHQUFHLFVBQUUsU0FBUyxFQUFFLFNBQVMsRUFBRSxVQUFVO0lBRW5ELElBQUssQ0FBQyxTQUFTLEVBQUc7UUFFZCxTQUFTLElBQUksU0FBUyxFQUFHLENBQUM7UUFDMUIsVUFBVSxJQUFJLFVBQVUsRUFBRyxDQUFDO1FBQzVCLE9BQU87S0FDVjtJQUVELFdBQUksQ0FBQztRQUNELEdBQUcsRUFBRSxjQUFjO1FBQ25CLElBQUksRUFBRTtZQUNGLFNBQVMsRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFFLFNBQVMsR0FBRyxHQUFHLENBQUU7U0FDM0M7UUFDRCxNQUFNLEVBQUUsVUFBVTtRQUNsQixPQUFPLEVBQUUsVUFBQSxHQUFHO1lBQ1IsSUFBSyxHQUFHLENBQUMsTUFBTSxLQUFLLEdBQUcsRUFBRztnQkFBRSxPQUFPO2FBQUU7WUFDL0IsSUFBQSxhQUF1RCxFQUFyRCx3QkFBUyxFQUFFLG9CQUFPLEVBQUUsd0JBQVMsRUFBRSx3QkFBc0IsQ0FBQztZQUM5RCxFQUFFLENBQUMsY0FBYyxDQUFDO2dCQUNkLE9BQU8sU0FBQTtnQkFDUCxTQUFTLFdBQUE7Z0JBQ1QsUUFBUSxFQUFFLEtBQUs7Z0JBQ2YsUUFBUSxFQUFFLFNBQVM7Z0JBQ25CLE9BQU8sRUFBRSxlQUFhLFNBQVc7Z0JBQ2pDLE9BQU8sRUFBRSxVQUFBLEdBQUc7b0JBQ0EsSUFBQSxtQkFBTSxDQUFTO29CQUN2QixJQUFLLE1BQU0sS0FBSyxtQkFBbUIsRUFBRzt3QkFFbEMsU0FBUyxJQUFJLFNBQVMsRUFBRyxDQUFDO3FCQUM3QjtnQkFDTCxDQUFDO2dCQUNELElBQUksRUFBRSxVQUFBLEdBQUc7b0JBQ0wsRUFBRSxDQUFDLFNBQVMsQ0FBQzt3QkFDVCxJQUFJLEVBQUUsTUFBTTt3QkFDWixLQUFLLEVBQUUsVUFBVTtxQkFDcEIsQ0FBQyxDQUFBO2dCQUNOLENBQUM7Z0JBQ0QsUUFBUSxFQUFFLGNBQVMsVUFBVSxJQUFJLFVBQVUsRUFBRyxDQUFDLENBQUEsQ0FBQzthQUNuRCxDQUFDLENBQUM7UUFDUCxDQUFDO0tBQ0osQ0FBQyxDQUFBO0FBQ04sQ0FBQyxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgaHR0cCB9IGZyb20gJy4vaHR0cCc7XG5cbi8qKiDlj5Hotbflvq7kv6HmlK/ku5ggKi9cbmV4cG9ydCBjb25zdCB3eFBheSA9ICggdG90YWxfZmVlLCBzdWNjZXNzQ0IsIGNvbXBsZXRlQ0IgKSA9PiB7XG5cbiAgICBpZiAoICF0b3RhbF9mZWUgKSB7XG4gICAgICAgIC8vIOaUr+S7mOaIkOWKn1xuICAgICAgICBzdWNjZXNzQ0IgJiYgc3VjY2Vzc0NCKCApO1xuICAgICAgICBjb21wbGV0ZUNCICYmIGNvbXBsZXRlQ0IoICk7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBodHRwKHtcbiAgICAgICAgdXJsOiAnY29tbW9uX3d4cGF5JyxcbiAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgdG90YWxfZmVlOiBNYXRoLmZsb29yKCB0b3RhbF9mZWUgKiAxMDAgKSAvLyDov5nph4znmoTljZXkvY3mmK/liIbvvIzkuI3mmK/lhYNcbiAgICAgICAgfSxcbiAgICAgICAgZXJyTXNnOiAn5pSv5LuY5aSx6LSl77yM6K+36YeN6K+VJyxcbiAgICAgICAgc3VjY2VzczogcmVzID0+IHtcbiAgICAgICAgICAgIGlmICggcmVzLnN0YXR1cyAhPT0gMjAwICkgeyByZXR1cm47IH1cbiAgICAgICAgICAgIGNvbnN0IHsgbm9uY2Vfc3RyLCBwYXlTaWduLCBwcmVwYXlfaWQsIHRpbWVTdGFtcCB9ID0gcmVzLmRhdGE7XG4gICAgICAgICAgICB3eC5yZXF1ZXN0UGF5bWVudCh7XG4gICAgICAgICAgICAgICAgcGF5U2lnbixcbiAgICAgICAgICAgICAgICB0aW1lU3RhbXAsXG4gICAgICAgICAgICAgICAgc2lnblR5cGU6ICdNRDUnLFxuICAgICAgICAgICAgICAgIG5vbmNlU3RyOiBub25jZV9zdHIsXG4gICAgICAgICAgICAgICAgcGFja2FnZTogYHByZXBheV9pZD0ke3ByZXBheV9pZH1gLFxuICAgICAgICAgICAgICAgIHN1Y2Nlc3M6IHJlcyA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHsgZXJyTXNnIH0gPSByZXM7XG4gICAgICAgICAgICAgICAgICAgIGlmICggZXJyTXNnID09PSAncmVxdWVzdFBheW1lbnQ6b2snICkge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8g5pSv5LuY5oiQ5YqfXG4gICAgICAgICAgICAgICAgICAgICAgICBzdWNjZXNzQ0IgJiYgc3VjY2Vzc0NCKCApO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBmYWlsOiBlcnIgPT4ge1xuICAgICAgICAgICAgICAgICAgICB3eC5zaG93VG9hc3Qoe1xuICAgICAgICAgICAgICAgICAgICAgICAgaWNvbjogJ25vbmUnLFxuICAgICAgICAgICAgICAgICAgICAgICAgdGl0bGU6ICfmlK/ku5jlpLHotKXvvIzor7fph43or5UnXG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBjb21wbGV0ZTogKCApID0+IHsgY29tcGxldGVDQiAmJiBjb21wbGV0ZUNCKCApO31cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfSlcbn0iXX0=