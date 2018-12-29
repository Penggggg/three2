"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var http_1 = require("./http");
exports.wxPay = function (total_fee, successCB, completeCB) {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGF5LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsicGF5LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsK0JBQThCO0FBR2pCLFFBQUEsS0FBSyxHQUFHLFVBQUUsU0FBUyxFQUFFLFNBQVMsRUFBRSxVQUFVO0lBQ25ELFdBQUksQ0FBQztRQUNELEdBQUcsRUFBRSxjQUFjO1FBQ25CLElBQUksRUFBRTtZQUNGLFNBQVMsRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFFLFNBQVMsR0FBRyxHQUFHLENBQUU7U0FDM0M7UUFDRCxNQUFNLEVBQUUsVUFBVTtRQUNsQixPQUFPLEVBQUUsVUFBQSxHQUFHO1lBQ1IsSUFBSyxHQUFHLENBQUMsTUFBTSxLQUFLLEdBQUcsRUFBRztnQkFBRSxPQUFPO2FBQUU7WUFDL0IsSUFBQSxhQUF1RCxFQUFyRCx3QkFBUyxFQUFFLG9CQUFPLEVBQUUsd0JBQVMsRUFBRSx3QkFBc0IsQ0FBQztZQUM5RCxFQUFFLENBQUMsY0FBYyxDQUFDO2dCQUNkLE9BQU8sU0FBQTtnQkFDUCxTQUFTLFdBQUE7Z0JBQ1QsUUFBUSxFQUFFLEtBQUs7Z0JBQ2YsUUFBUSxFQUFFLFNBQVM7Z0JBQ25CLE9BQU8sRUFBRSxlQUFhLFNBQVc7Z0JBQ2pDLE9BQU8sRUFBRSxVQUFBLEdBQUc7b0JBQ0EsSUFBQSxtQkFBTSxDQUFTO29CQUN2QixJQUFLLE1BQU0sS0FBSyxtQkFBbUIsRUFBRzt3QkFFbEMsU0FBUyxJQUFJLFNBQVMsRUFBRyxDQUFDO3FCQUM3QjtnQkFDTCxDQUFDO2dCQUNELElBQUksRUFBRSxVQUFBLEdBQUc7b0JBQ0wsRUFBRSxDQUFDLFNBQVMsQ0FBQzt3QkFDVCxJQUFJLEVBQUUsTUFBTTt3QkFDWixLQUFLLEVBQUUsVUFBVTtxQkFDcEIsQ0FBQyxDQUFBO2dCQUNOLENBQUM7Z0JBQ0QsUUFBUSxFQUFFLGNBQVMsVUFBVSxJQUFJLFVBQVUsRUFBRyxDQUFDLENBQUEsQ0FBQzthQUNuRCxDQUFDLENBQUM7UUFDUCxDQUFDO0tBQ0osQ0FBQyxDQUFBO0FBQ04sQ0FBQyxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgaHR0cCB9IGZyb20gJy4vaHR0cCc7XG5cbi8qKiDlj5Hotbflvq7kv6HmlK/ku5ggKi9cbmV4cG9ydCBjb25zdCB3eFBheSA9ICggdG90YWxfZmVlLCBzdWNjZXNzQ0IsIGNvbXBsZXRlQ0IgKSA9PiB7XG4gICAgaHR0cCh7XG4gICAgICAgIHVybDogJ2NvbW1vbl93eHBheScsXG4gICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgIHRvdGFsX2ZlZTogTWF0aC5mbG9vciggdG90YWxfZmVlICogMTAwICkgLy8g6L+Z6YeM55qE5Y2V5L2N5piv5YiG77yM5LiN5piv5YWDXG4gICAgICAgIH0sXG4gICAgICAgIGVyck1zZzogJ+aUr+S7mOWksei0pe+8jOivt+mHjeivlScsXG4gICAgICAgIHN1Y2Nlc3M6IHJlcyA9PiB7XG4gICAgICAgICAgICBpZiAoIHJlcy5zdGF0dXMgIT09IDIwMCApIHsgcmV0dXJuOyB9XG4gICAgICAgICAgICBjb25zdCB7IG5vbmNlX3N0ciwgcGF5U2lnbiwgcHJlcGF5X2lkLCB0aW1lU3RhbXAgfSA9IHJlcy5kYXRhO1xuICAgICAgICAgICAgd3gucmVxdWVzdFBheW1lbnQoe1xuICAgICAgICAgICAgICAgIHBheVNpZ24sXG4gICAgICAgICAgICAgICAgdGltZVN0YW1wLFxuICAgICAgICAgICAgICAgIHNpZ25UeXBlOiAnTUQ1JyxcbiAgICAgICAgICAgICAgICBub25jZVN0cjogbm9uY2Vfc3RyLFxuICAgICAgICAgICAgICAgIHBhY2thZ2U6IGBwcmVwYXlfaWQ9JHtwcmVwYXlfaWR9YCxcbiAgICAgICAgICAgICAgICBzdWNjZXNzOiByZXMgPT4ge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCB7IGVyck1zZyB9ID0gcmVzO1xuICAgICAgICAgICAgICAgICAgICBpZiAoIGVyck1zZyA9PT0gJ3JlcXVlc3RQYXltZW50Om9rJyApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIOaUr+S7mOaIkOWKn1xuICAgICAgICAgICAgICAgICAgICAgICAgc3VjY2Vzc0NCICYmIHN1Y2Nlc3NDQiggKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgZmFpbDogZXJyID0+IHtcbiAgICAgICAgICAgICAgICAgICAgd3guc2hvd1RvYXN0KHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGljb246ICdub25lJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIHRpdGxlOiAn5pSv5LuY5aSx6LSl77yM6K+36YeN6K+VJ1xuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgY29tcGxldGU6ICggKSA9PiB7IGNvbXBsZXRlQ0IgJiYgY29tcGxldGVDQiggKTt9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH0pXG59Il19