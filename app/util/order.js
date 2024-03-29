"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var http_1 = require("./http");
exports.createOrders = function (tid, targetBuys, from, successCB, errorCB) {
    http_1.http({
        data: {
            from: from,
            tid: tid,
            list: targetBuys
        },
        loadingMsg: '结算中...',
        url: "shopping-list_findCannotBuy",
        success: function (res) {
            var status = res.status, data = res.data;
            if (status !== 200) {
                return;
            }
            var hasBeenBuy = data.hasBeenBuy, cannotBuy = data.cannotBuy, hasBeenDelete = data.hasBeenDelete, lowStock = data.lowStock, hasLimitGood = data.hasLimitGood, orders = data.orders;
            if (cannotBuy.length > 0) {
                return wx.showModal({
                    title: '提示',
                    content: "\u706B\u7206\uFF01" + cannotBuy.map(function (x) { return "" + (x.goodName || x.name) + (x.standername !== '默认型号' ? '-' + x.standername : ''); }).join('、') + "\u6682\u65F6\u65E0\u8D27\uFF01"
                });
            }
            if (hasBeenDelete.length > 0) {
                return wx.showModal({
                    title: '提示',
                    content: hasBeenDelete.map(function (x) { return "" + (x.goodName || x.name) + (x.standername !== '默认型号' ? '-' + x.standername : ''); }).join('、') + "\u5DF2\u88AB\u5220\u9664\uFF0C\u8BF7\u91CD\u65B0\u9009\u62E9\uFF01"
                });
            }
            if (lowStock.length > 0) {
                return wx.showModal({
                    title: '提示',
                    content: lowStock.map(function (x) { return "" + (x.goodName || x.name) + (x.standername !== '默认型号' ? '-' + x.standername : ''); }).join('、') + "\u8D27\u5B58\u4E0D\u8DB3\uFF0C\u8BF7\u91CD\u65B0\u9009\u62E9\uFF01"
                });
            }
            if (hasBeenBuy.length > 0) {
                wx.showModal({
                    title: '提示',
                    content: "\u7FA4\u4E3B\u5DF2\u7ECF\u4E70\u4E86" + hasBeenBuy.map(function (x) { return "" + x.goodName + x.standardName; }).join('、') + "\uFF0C\u4E0D\u4E00\u5B9A\u4F1A\u8FD4\u7A0B\u8D2D\u4E70\uFF0C\u8BF7\u8054\u7CFB\u7FA4\u4E3B\uFF01"
                });
            }
            if (hasLimitGood.length > 0) {
                wx.showModal({
                    title: '提示',
                    content: hasLimitGood.map(function (x) { return "" + (x.goodName || x.name || x.title); }).join('、') + "\u5DF2\u9650\u8D2D"
                });
            }
            if (orders.length === 0) {
                return;
            }
            successCB && successCB(orders);
        },
        error: function () {
            errorCB && errorCB();
        }
    });
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib3JkZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJvcmRlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLCtCQUE4QjtBQTZCakIsUUFBQSxZQUFZLEdBQUcsVUFBRSxHQUFHLEVBQUUsVUFBVSxFQUFFLElBQUksRUFBRSxTQUFTLEVBQUUsT0FBTztJQUNuRSxXQUFJLENBQUM7UUFDRCxJQUFJLEVBQUU7WUFDRixJQUFJLE1BQUE7WUFDSixHQUFHLEVBQUUsR0FBRztZQUNSLElBQUksRUFBRSxVQUFVO1NBQ25CO1FBQ0QsVUFBVSxFQUFFLFFBQVE7UUFDcEIsR0FBRyxFQUFFLDZCQUE2QjtRQUNsQyxPQUFPLEVBQUUsVUFBQSxHQUFHO1lBQ0EsSUFBQSxtQkFBTSxFQUFFLGVBQUksQ0FBUztZQUM3QixJQUFLLE1BQU0sS0FBSyxHQUFHLEVBQUc7Z0JBQUUsT0FBTzthQUFFO1lBRXpCLElBQUEsNEJBQVUsRUFBRSwwQkFBUyxFQUFFLGtDQUFhLEVBQUUsd0JBQVEsRUFBRSxnQ0FBWSxFQUFFLG9CQUFNLENBQVU7WUFHdEYsSUFBSyxTQUFTLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRztnQkFDeEIsT0FBTyxFQUFFLENBQUMsU0FBUyxDQUFDO29CQUNoQixLQUFLLEVBQUUsSUFBSTtvQkFDWCxPQUFPLEVBQUUsdUJBQU0sU0FBUyxDQUFDLEdBQUcsQ0FBRSxVQUFBLENBQUMsSUFBSSxPQUFBLE1BQUcsQ0FBQyxDQUFDLFFBQVEsSUFBSSxDQUFDLENBQUMsSUFBSSxLQUFHLENBQUMsQ0FBQyxXQUFXLEtBQUssTUFBTSxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFFLEVBQS9FLENBQStFLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLG1DQUFPO2lCQUN2SSxDQUFDLENBQUM7YUFDTjtZQUdELElBQUssYUFBYSxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUc7Z0JBQzVCLE9BQU8sRUFBRSxDQUFDLFNBQVMsQ0FBQztvQkFDaEIsS0FBSyxFQUFFLElBQUk7b0JBQ1gsT0FBTyxFQUFLLGFBQWEsQ0FBQyxHQUFHLENBQUUsVUFBQSxDQUFDLElBQUksT0FBQSxNQUFHLENBQUMsQ0FBQyxRQUFRLElBQUksQ0FBQyxDQUFDLElBQUksS0FBRyxDQUFDLENBQUMsV0FBVyxLQUFLLE1BQU0sQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBRSxFQUEvRSxDQUErRSxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyx1RUFBYTtpQkFDOUksQ0FBQyxDQUFDO2FBQ047WUFHRCxJQUFLLFFBQVEsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFHO2dCQUN2QixPQUFPLEVBQUUsQ0FBQyxTQUFTLENBQUM7b0JBQ2hCLEtBQUssRUFBRSxJQUFJO29CQUNYLE9BQU8sRUFBSyxRQUFRLENBQUMsR0FBRyxDQUFFLFVBQUEsQ0FBQyxJQUFJLE9BQUEsTUFBRyxDQUFDLENBQUMsUUFBUSxJQUFJLENBQUMsQ0FBQyxJQUFJLEtBQUcsQ0FBQyxDQUFDLFdBQVcsS0FBSyxNQUFNLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUUsRUFBL0UsQ0FBK0UsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsdUVBQWE7aUJBQ3pJLENBQUMsQ0FBQzthQUNOO1lBTUQsSUFBSyxVQUFVLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRztnQkFDekIsRUFBRSxDQUFDLFNBQVMsQ0FBQztvQkFDVCxLQUFLLEVBQUUsSUFBSTtvQkFDWCxPQUFPLEVBQUUseUNBQVMsVUFBVSxDQUFDLEdBQUcsQ0FBRSxVQUFBLENBQUMsSUFBSSxPQUFBLEtBQUcsQ0FBQyxDQUFDLFFBQVEsR0FBRyxDQUFDLENBQUMsWUFBYyxFQUFoQyxDQUFnQyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxxR0FBa0I7aUJBQ3ZHLENBQUMsQ0FBQzthQUNOO1lBS0QsSUFBSyxZQUFZLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRztnQkFDM0IsRUFBRSxDQUFDLFNBQVMsQ0FBQztvQkFDVCxLQUFLLEVBQUUsSUFBSTtvQkFDWCxPQUFPLEVBQUssWUFBWSxDQUFDLEdBQUcsQ0FBRSxVQUFBLENBQUMsSUFBSSxPQUFBLE1BQUcsQ0FBQyxDQUFDLFFBQVEsSUFBSSxDQUFDLENBQUMsSUFBSSxJQUFJLENBQUMsQ0FBQyxLQUFLLENBQUUsRUFBcEMsQ0FBb0MsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsdUJBQUs7aUJBQzFGLENBQUMsQ0FBQzthQUNOO1lBRUQsSUFBSyxNQUFNLENBQUMsTUFBTSxLQUFLLENBQUMsRUFBRztnQkFBRSxPQUFPO2FBQUU7WUFFdEMsU0FBUyxJQUFJLFNBQVMsQ0FBRSxNQUFNLENBQUUsQ0FBQztRQUVyQyxDQUFDO1FBQ0QsS0FBSyxFQUFFO1lBQ0gsT0FBTyxJQUFJLE9BQU8sRUFBRyxDQUFDO1FBQzFCLENBQUM7S0FDSixDQUFDLENBQUM7QUFDUCxDQUFDLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBodHRwIH0gZnJvbSAnLi9odHRwJztcblxuLyoqXG4gKiBcbiAqIEBwYXJhbSB0aWQg6KGM56iLaWRcbiAqIEBwYXJhbSBmcm9tIOiuouWNleadpea6kCAnYnV5JyB8IFxuICogQHBhcmFtIHRhcmdldEJ1eXMg6aKE5LuY6K6i5Y2V5YiX6KGo77yM5pWw5o2u57uT5p6E5aaC5LiLXG4gKiB7XG4gICAgICAgIHNpZCxcbiAgICAgICAgcGlkLFxuICAgICAgICBjb3VudCxcbiAgICAgICAgcHJpY2UsXG4gICAgICAgIGltZzogWyBpbWcgXSxcbiAgICAgICAgZ3JvdXBQcmljZSxcbiAgICAgICAgdGlkOiB0cmlwLl9pZCxcbiAgICAgICAgZGVwb3NpdFByaWNlOiBkZXBvc2l0UHJpY2UgfHwgMCxcbiAqISAgICAgYWNpZDog5LiA5Y+j5Lu35rS75Yqo55qEaWTvvIzlj6/ml6BcbiAgICAgICAgdHlwZTogJ3ByZScsIC8vIOmihOS7mOexu+Wei+iuouWNle+8jFxuICohICAgICBjaWQ/OiB0ZW1wLmNhcnQuX2lkLFxuICAgICAgICBuYW1lOiBgJHt0aXRsZX1gLFxuICAgICAgICBzdGFuZGVybmFtZTogc3RhbmRhcmROYW1lLFxuICAgICAgICBhZGRyZXNzOiB7XG4gICAgICAgICAgICB1c2VybmFtZTogdXNlck5hbWUsXG4gICAgICAgICAgICBwb3N0YWxjb2RlOiBwb3N0YWxDb2RlLFxuICAgICAgICAgICAgcGhvbmU6IHRlbE51bWJlcixcbiAgICAgICAgICAgIGFkZHJlc3M6IGAke3Byb3ZpbmNlTmFtZX0ke2NpdHlOYW1lfSR7Y291bnR5TmFtZX0ke2RldGFpbEluZm99YFxuICAgICAgICB9XG4gKiB9WyBdXG4gKi9cbmV4cG9ydCBjb25zdCBjcmVhdGVPcmRlcnMgPSAoIHRpZCwgdGFyZ2V0QnV5cywgZnJvbSwgc3VjY2Vzc0NCLCBlcnJvckNCICkgPT4ge1xuICAgIGh0dHAoe1xuICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICBmcm9tLFxuICAgICAgICAgICAgdGlkOiB0aWQsXG4gICAgICAgICAgICBsaXN0OiB0YXJnZXRCdXlzXG4gICAgICAgIH0sXG4gICAgICAgIGxvYWRpbmdNc2c6ICfnu5PnrpfkuK0uLi4nLFxuICAgICAgICB1cmw6IGBzaG9wcGluZy1saXN0X2ZpbmRDYW5ub3RCdXlgLFxuICAgICAgICBzdWNjZXNzOiByZXMgPT4ge1xuICAgICAgICAgICAgY29uc3QgeyBzdGF0dXMsIGRhdGEgfSA9IHJlcztcbiAgICAgICAgICAgIGlmICggc3RhdHVzICE9PSAyMDAgKSB7IHJldHVybjsgfVxuXG4gICAgICAgICAgICBjb25zdCB7IGhhc0JlZW5CdXksIGNhbm5vdEJ1eSwgaGFzQmVlbkRlbGV0ZSwgbG93U3RvY2ssIGhhc0xpbWl0R29vZCwgb3JkZXJzIH0gPSBkYXRhO1xuICAgICAgXG4gICAgICAgICAgICAvKiog5o+Q56S66KGM56iL5peg6LSnICovXG4gICAgICAgICAgICBpZiAoIGNhbm5vdEJ1eS5sZW5ndGggPiAwICkge1xuICAgICAgICAgICAgICAgIHJldHVybiB3eC5zaG93TW9kYWwoe1xuICAgICAgICAgICAgICAgICAgICB0aXRsZTogJ+aPkOekuicsXG4gICAgICAgICAgICAgICAgICAgIGNvbnRlbnQ6IGDngavniIbvvIEke2Nhbm5vdEJ1eS5tYXAoIHggPT4gYCR7eC5nb29kTmFtZSB8fCB4Lm5hbWV9JHt4LnN0YW5kZXJuYW1lICE9PSAn6buY6K6k5Z6L5Y+3JyA/ICctJyArIHguc3RhbmRlcm5hbWUgOiAnJ31gKS5qb2luKCfjgIEnKX3mmoLml7bml6DotKfvvIFgXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8qKiDllYblk4HooqvliKDpmaQgKi9cbiAgICAgICAgICAgIGlmICggaGFzQmVlbkRlbGV0ZS5sZW5ndGggPiAwICkge1xuICAgICAgICAgICAgICAgIHJldHVybiB3eC5zaG93TW9kYWwoe1xuICAgICAgICAgICAgICAgICAgICB0aXRsZTogJ+aPkOekuicsXG4gICAgICAgICAgICAgICAgICAgIGNvbnRlbnQ6IGAke2hhc0JlZW5EZWxldGUubWFwKCB4ID0+IGAke3guZ29vZE5hbWUgfHwgeC5uYW1lfSR7eC5zdGFuZGVybmFtZSAhPT0gJ+m7mOiupOWei+WPtycgPyAnLScgKyB4LnN0YW5kZXJuYW1lIDogJyd9YCkuam9pbign44CBJyl95bey6KKr5Yig6Zmk77yM6K+36YeN5paw6YCJ5oup77yBYFxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvKiog5o+Q56S65L2O5bqT5a2YICovXG4gICAgICAgICAgICBpZiAoIGxvd1N0b2NrLmxlbmd0aCA+IDAgKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHd4LnNob3dNb2RhbCh7XG4gICAgICAgICAgICAgICAgICAgIHRpdGxlOiAn5o+Q56S6JyxcbiAgICAgICAgICAgICAgICAgICAgY29udGVudDogYCR7bG93U3RvY2subWFwKCB4ID0+IGAke3guZ29vZE5hbWUgfHwgeC5uYW1lfSR7eC5zdGFuZGVybmFtZSAhPT0gJ+m7mOiupOWei+WPtycgPyAnLScgKyB4LnN0YW5kZXJuYW1lIDogJyd9YCkuam9pbign44CBJyl96LSn5a2Y5LiN6Laz77yM6K+36YeN5paw6YCJ5oup77yBYFxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvKiogXG4gICAgICAgICAgICAgKiDlt7Lnu4/otK3kubDlsLHov5vooYzmj5DnpLpcbiAgICAgICAgICAgICAqIOS9huaYr+S+neeEtuWPr+S7pee7p+e7rei0reS5sFxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICBpZiAoIGhhc0JlZW5CdXkubGVuZ3RoID4gMCApIHtcbiAgICAgICAgICAgICAgICB3eC5zaG93TW9kYWwoe1xuICAgICAgICAgICAgICAgICAgICB0aXRsZTogJ+aPkOekuicsXG4gICAgICAgICAgICAgICAgICAgIGNvbnRlbnQ6IGDnvqTkuLvlt7Lnu4/kubDkuoYke2hhc0JlZW5CdXkubWFwKCB4ID0+IGAke3guZ29vZE5hbWV9JHt4LnN0YW5kYXJkTmFtZX1gKS5qb2luKCfjgIEnKX3vvIzkuI3kuIDlrprkvJrov5TnqIvotK3kubDvvIzor7fogZTns7vnvqTkuLvvvIFgXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICog6ZmQ6LSt5o+Q56S6XG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIGlmICggaGFzTGltaXRHb29kLmxlbmd0aCA+IDAgKSB7XG4gICAgICAgICAgICAgICAgd3guc2hvd01vZGFsKHtcbiAgICAgICAgICAgICAgICAgICAgdGl0bGU6ICfmj5DnpLonLFxuICAgICAgICAgICAgICAgICAgICBjb250ZW50OiBgJHtoYXNMaW1pdEdvb2QubWFwKCB4ID0+IGAke3guZ29vZE5hbWUgfHwgeC5uYW1lIHx8IHgudGl0bGV9YCkuam9pbign44CBJyl95bey6ZmQ6LStYFxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgXG4gICAgICAgICAgICBpZiAoIG9yZGVycy5sZW5ndGggPT09IDAgKSB7IHJldHVybjsgfVxuXG4gICAgICAgICAgICBzdWNjZXNzQ0IgJiYgc3VjY2Vzc0NCKCBvcmRlcnMgKTtcblxuICAgICAgICB9LFxuICAgICAgICBlcnJvcjogKCApID0+IHtcbiAgICAgICAgICAgIGVycm9yQ0IgJiYgZXJyb3JDQiggKTtcbiAgICAgICAgfVxuICAgIH0pO1xufSJdfQ==