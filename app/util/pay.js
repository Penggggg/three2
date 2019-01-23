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
        success: function (res1) {
            if (res1.status !== 200) {
                wx.showToast({
                    icon: 'none',
                    title: '支付失败，请重试'
                });
                completeCB && completeCB();
                return;
            }
            var _a = res1.data, nonce_str = _a.nonce_str, paySign = _a.paySign, prepay_id = _a.prepay_id, timeStamp = _a.timeStamp;
            wx.requestPayment({
                paySign: paySign,
                timeStamp: timeStamp,
                signType: 'MD5',
                nonceStr: nonce_str,
                package: "prepay_id=" + prepay_id,
                success: function (res) {
                    var errMsg = res.errMsg;
                    if (errMsg === 'requestPayment:ok') {
                        successCB && successCB(res1.data);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGF5LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsicGF5LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsK0JBQThCO0FBR2pCLFFBQUEsS0FBSyxHQUFHLFVBQUUsU0FBUyxFQUFFLFNBQVMsRUFBRSxVQUFVO0lBRW5ELElBQUssQ0FBQyxTQUFTLEVBQUc7UUFFZCxTQUFTLElBQUksU0FBUyxFQUFHLENBQUM7UUFDMUIsVUFBVSxJQUFJLFVBQVUsRUFBRyxDQUFDO1FBQzVCLE9BQU87S0FDVjtJQUVELFdBQUksQ0FBQztRQUNELEdBQUcsRUFBRSxjQUFjO1FBQ25CLElBQUksRUFBRTtZQUNGLFNBQVMsRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFFLFNBQVMsR0FBRyxHQUFHLENBQUU7U0FDM0M7UUFDRCxNQUFNLEVBQUUsVUFBVTtRQUNsQixPQUFPLEVBQUUsVUFBQSxJQUFJO1lBQ1QsSUFBSyxJQUFJLENBQUMsTUFBTSxLQUFLLEdBQUcsRUFBRztnQkFDdkIsRUFBRSxDQUFDLFNBQVMsQ0FBQztvQkFDVCxJQUFJLEVBQUUsTUFBTTtvQkFDWixLQUFLLEVBQUUsVUFBVTtpQkFDcEIsQ0FBQyxDQUFDO2dCQUNILFVBQVUsSUFBSSxVQUFVLEVBQUcsQ0FBQztnQkFDNUIsT0FBTzthQUNWO1lBQ0ssSUFBQSxjQUF3RCxFQUF0RCx3QkFBUyxFQUFFLG9CQUFPLEVBQUUsd0JBQVMsRUFBRSx3QkFBdUIsQ0FBQztZQUMvRCxFQUFFLENBQUMsY0FBYyxDQUFDO2dCQUNkLE9BQU8sU0FBQTtnQkFDUCxTQUFTLFdBQUE7Z0JBQ1QsUUFBUSxFQUFFLEtBQUs7Z0JBQ2YsUUFBUSxFQUFFLFNBQVM7Z0JBQ25CLE9BQU8sRUFBRSxlQUFhLFNBQVc7Z0JBQ2pDLE9BQU8sRUFBRSxVQUFBLEdBQUc7b0JBQ0EsSUFBQSxtQkFBTSxDQUFTO29CQUN2QixJQUFLLE1BQU0sS0FBSyxtQkFBbUIsRUFBRzt3QkFFbEMsU0FBUyxJQUFJLFNBQVMsQ0FBRSxJQUFJLENBQUMsSUFBSSxDQUFFLENBQUM7cUJBQ3ZDO2dCQUNMLENBQUM7Z0JBQ0QsSUFBSSxFQUFFLFVBQUEsR0FBRztvQkFDTCxFQUFFLENBQUMsU0FBUyxDQUFDO3dCQUNULElBQUksRUFBRSxNQUFNO3dCQUNaLEtBQUssRUFBRSxVQUFVO3FCQUNwQixDQUFDLENBQUM7Z0JBQ1AsQ0FBQztnQkFDRCxRQUFRLEVBQUUsY0FBUyxVQUFVLElBQUksVUFBVSxFQUFHLENBQUMsQ0FBQSxDQUFDO2FBQ25ELENBQUMsQ0FBQztRQUNQLENBQUM7S0FDSixDQUFDLENBQUE7QUFDTixDQUFDLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBodHRwIH0gZnJvbSAnLi9odHRwJztcblxuLyoqIOWPkei1t+W+ruS/oeaUr+S7mCAqL1xuZXhwb3J0IGNvbnN0IHd4UGF5ID0gKCB0b3RhbF9mZWUsIHN1Y2Nlc3NDQiwgY29tcGxldGVDQiApID0+IHtcblxuICAgIGlmICggIXRvdGFsX2ZlZSApIHtcbiAgICAgICAgLy8g5pSv5LuY5oiQ5YqfXG4gICAgICAgIHN1Y2Nlc3NDQiAmJiBzdWNjZXNzQ0IoICk7XG4gICAgICAgIGNvbXBsZXRlQ0IgJiYgY29tcGxldGVDQiggKTtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGh0dHAoe1xuICAgICAgICB1cmw6ICdjb21tb25fd3hwYXknLFxuICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICB0b3RhbF9mZWU6IE1hdGguZmxvb3IoIHRvdGFsX2ZlZSAqIDEwMCApIC8vIOi/memHjOeahOWNleS9jeaYr+WIhu+8jOS4jeaYr+WFg1xuICAgICAgICB9LFxuICAgICAgICBlcnJNc2c6ICfmlK/ku5jlpLHotKXvvIzor7fph43or5UnLFxuICAgICAgICBzdWNjZXNzOiByZXMxID0+IHtcbiAgICAgICAgICAgIGlmICggcmVzMS5zdGF0dXMgIT09IDIwMCApIHtcbiAgICAgICAgICAgICAgICB3eC5zaG93VG9hc3Qoe1xuICAgICAgICAgICAgICAgICAgICBpY29uOiAnbm9uZScsXG4gICAgICAgICAgICAgICAgICAgIHRpdGxlOiAn5pSv5LuY5aSx6LSl77yM6K+36YeN6K+VJ1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIGNvbXBsZXRlQ0IgJiYgY29tcGxldGVDQiggKTtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb25zdCB7IG5vbmNlX3N0ciwgcGF5U2lnbiwgcHJlcGF5X2lkLCB0aW1lU3RhbXAgfSA9IHJlczEuZGF0YTtcbiAgICAgICAgICAgIHd4LnJlcXVlc3RQYXltZW50KHtcbiAgICAgICAgICAgICAgICBwYXlTaWduLFxuICAgICAgICAgICAgICAgIHRpbWVTdGFtcCxcbiAgICAgICAgICAgICAgICBzaWduVHlwZTogJ01ENScsXG4gICAgICAgICAgICAgICAgbm9uY2VTdHI6IG5vbmNlX3N0cixcbiAgICAgICAgICAgICAgICBwYWNrYWdlOiBgcHJlcGF5X2lkPSR7cHJlcGF5X2lkfWAsXG4gICAgICAgICAgICAgICAgc3VjY2VzczogcmVzID0+IHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgeyBlcnJNc2cgfSA9IHJlcztcbiAgICAgICAgICAgICAgICAgICAgaWYgKCBlcnJNc2cgPT09ICdyZXF1ZXN0UGF5bWVudDpvaycgKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyDmlK/ku5jmiJDlip9cbiAgICAgICAgICAgICAgICAgICAgICAgIHN1Y2Nlc3NDQiAmJiBzdWNjZXNzQ0IoIHJlczEuZGF0YSApO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBmYWlsOiBlcnIgPT4ge1xuICAgICAgICAgICAgICAgICAgICB3eC5zaG93VG9hc3Qoe1xuICAgICAgICAgICAgICAgICAgICAgICAgaWNvbjogJ25vbmUnLFxuICAgICAgICAgICAgICAgICAgICAgICAgdGl0bGU6ICfmlK/ku5jlpLHotKXvvIzor7fph43or5UnXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgY29tcGxldGU6ICggKSA9PiB7IGNvbXBsZXRlQ0IgJiYgY29tcGxldGVDQiggKTt9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH0pXG59Il19