"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var delayeringGood = function (x) {
    if (!x) {
        return null;
    }
    var allPriceArr = [];
    var allStockArr = [];
    var decorateItem = function (good) {
        allPriceArr.push(good.price);
        if (good.stock) {
            allStockArr.push(good.stock);
        }
        if (good.groupPrice) {
            allPriceArr.push(good.groupPrice);
        }
    };
    var decorateItem2 = function (activities) {
        if (Array.isArray(activities)) {
            activities.map(function (ac) {
                allPriceArr.push(ac.ac_price);
                if (ac.ac_groupPrice) {
                    allPriceArr.push(ac.ac_groupPrice);
                }
            });
        }
    };
    decorateItem2(x.activities);
    if (!x.standards || x.standards.length === 0) {
        decorateItem(x);
    }
    else {
        x.standards.map(decorateItem);
    }
    allPriceArr = allPriceArr.sort(function (x, y) { return x - y; });
    allStockArr = allStockArr.sort(function (x, y) { return x - y; });
    return Object.assign({}, x, {
        pid: x._id,
        hasPin: hasPin(x),
        stock$: allStockArr.length === 0 ?
            allStockArr[0] :
            allStockArr[0] === allStockArr[allStockArr.length - 1] ?
                allStockArr[0] :
                allStockArr[0] + " ~ " + allStockArr[allStockArr.length - 1],
        price$: allPriceArr.length === 0 ?
            allPriceArr[0] :
            allPriceArr[0] === allPriceArr[allPriceArr.length - 1] ?
                allPriceArr[0] :
                allPriceArr[0] + " ~ " + allPriceArr[allPriceArr.length - 1],
        priceGap: allPriceArr.length === 0 ?
            0 :
            "" + (allPriceArr[allPriceArr.length - 1] - allPriceArr[0]),
        lowest_price$: allPriceArr[0],
        hasActivity: !!x.activity || (Array.isArray(x.activities) && x.activities.length > 0),
        goodPins: dealGoodPin(x),
        tagText: x.tag.join('、'),
        outStock: allStockArr.some(function (x) { return x < 10; })
    });
};
exports.delayeringGood = delayeringGood;
var hasPin = function (good) {
    var activities = good.activities, standards = good.standards, groupPrice = good.groupPrice;
    var piningStandards = standards.filter(function (x) { return !!x.groupPrice; });
    var piningActivies = !!activities ? activities.filter(function (x) { return !!x.ac_groupPrice; }) : [];
    return !!groupPrice || piningStandards.length > 0 || piningActivies.length > 0;
};
var dealGoodPin = function (good) {
    var activities = good.activities, standards = good.standards, price = good.price, groupPrice = good.groupPrice;
    if (!standards || standards.length === 0) {
        var acTarget = !activities ?
            null :
            activities.find(function (ac) { return ac.pid === good.pid; });
        var p = acTarget ? acTarget.ac_price : price;
        var gp = acTarget ? acTarget.ac_groupPrice : groupPrice;
        return {
            list: [{
                    price: p,
                    groupPrice: gp
                }],
            eachPriceRound: gp ? (p - gp).toFixed(2) : 0
        };
    }
    else {
        var meta = standards.map(function (standard) {
            var acTarget = !activities ?
                null :
                activities.find(function (ac) { return ac.pid === standard.pid && ac.sid === standard._id; });
            if ((!!acTarget && !!acTarget.ac_groupPrice) || standard.groupPrice) {
                if (acTarget) {
                    return {
                        price: acTarget.ac_price,
                        groupPrice: acTarget.ac_groupPrice
                    };
                }
                else {
                    return {
                        price: standard.price,
                        groupPrice: standard.groupPrice
                    };
                }
            }
            return null;
        }).filter(function (x) { return !!x; });
        var deltas = meta.map(function (x) {
            return (x.price - (x.groupPrice || 0)).toFixed(2);
        }).sort(function (x, y) { return y - x; });
        return {
            list: meta,
            eachPriceRound: deltas[deltas.length - 1] !== deltas[0] ?
                deltas[deltas.length - 1] + " ~ " + deltas[0] :
                deltas[0]
        };
    }
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ29vZHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJnb29kcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUlBLElBQU0sY0FBYyxHQUFHLFVBQUEsQ0FBQztJQUVwQixJQUFLLENBQUMsQ0FBQyxFQUFHO1FBQ04sT0FBTyxJQUFJLENBQUE7S0FDZDtJQUdELElBQUksV0FBVyxHQUFXLEVBQUcsQ0FBQztJQUc5QixJQUFJLFdBQVcsR0FBWSxFQUFHLENBQUM7SUFHL0IsSUFBTSxZQUFZLEdBQUcsVUFBQSxJQUFJO1FBRXJCLFdBQVcsQ0FBQyxJQUFJLENBQUUsSUFBSSxDQUFDLEtBQUssQ0FBRSxDQUFDO1FBRS9CLElBQUssSUFBSSxDQUFDLEtBQUssRUFBRztZQUNkLFdBQVcsQ0FBQyxJQUFJLENBQUUsSUFBSSxDQUFDLEtBQUssQ0FBRSxDQUFDO1NBQ2xDO1FBRUQsSUFBSyxJQUFJLENBQUMsVUFBVSxFQUFHO1lBQ25CLFdBQVcsQ0FBQyxJQUFJLENBQUUsSUFBSSxDQUFDLFVBQVUsQ0FBRSxDQUFDO1NBQ3ZDO0lBRUwsQ0FBQyxDQUFDO0lBR0YsSUFBTSxhQUFhLEdBQUcsVUFBQSxVQUFVO1FBQzVCLElBQUssS0FBSyxDQUFDLE9BQU8sQ0FBRSxVQUFVLENBQUUsRUFBRTtZQUM5QixVQUFVLENBQUMsR0FBRyxDQUFFLFVBQUEsRUFBRTtnQkFDZCxXQUFXLENBQUMsSUFBSSxDQUFFLEVBQUUsQ0FBQyxRQUFRLENBQUUsQ0FBQztnQkFFaEMsSUFBSyxFQUFFLENBQUMsYUFBYSxFQUFHO29CQUNwQixXQUFXLENBQUMsSUFBSSxDQUFFLEVBQUUsQ0FBQyxhQUFhLENBQUUsQ0FBQztpQkFDeEM7WUFDTCxDQUFDLENBQUMsQ0FBQztTQUNOO0lBQ0wsQ0FBQyxDQUFBO0lBR0QsYUFBYSxDQUFFLENBQUMsQ0FBQyxVQUFVLENBQUUsQ0FBQztJQUc5QixJQUFLLENBQUMsQ0FBQyxDQUFDLFNBQVMsSUFBSSxDQUFDLENBQUMsU0FBUyxDQUFDLE1B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QUFJO1lBRVYsY0FBYyxFQUFHLE1BQU0sQ0FBRSxNQUFNLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBRSxLQUFLLE1BQU0sQ0FBRSxDQUFDLENBQUUsQ0FBQyxDQUFDO2dCQUN0RCxNQUFNLENBQUUsTUFBTSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUUsV0FBTSxNQUFNLENBQUUsQ0FBQyxDQUFJLENBQUMsQ0FBQztnQkFDbkQsTUFBTSxDQUFFLENBQUMsQ0FBRTtTQUNuQixDQUFDO0tBQ0w7QUFDTCxDQUFDLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJcbi8qKiBcbiAqIOWVhuWTgSDvvZ4g5Lu35qC85Yy66Ze044CB5bqT5a2Y5Yy66Ze044CB5beu5Lu344CB5pyA5L2O5Lu35qC877yI5ZCr5Zui6LSt5Lu3L+S4gOWPo+S7t++8iVxuICovXG5jb25zdCBkZWxheWVyaW5nR29vZCA9IHggPT4ge1xuIFxuICAgIGlmICggIXggKSB7XG4gICAgICAgIHJldHVybiBudWxsXG4gICAgfVxuXG4gICAgLy8g5Yid5aeL5YyW77ya5Lu35qC85pWw57uE77yI5ZCr5Zui6LSt5Lu344CB54m55Lu377yJXG4gICAgbGV0IGFsbFByaWNlQXJyOiBhbnlbIF0gPSBbIF07XG5cbiAgICAvLyDliJ3lp4vljJbvvJrlupPlrZjliJfooahcbiAgICBsZXQgYWxsU3RvY2tBcnI6IGFueVsgXSAgPSBbIF07XG5cbiAgICAvLyDml6DmnaHku7bms6jlhaUg5Li75Lqn5ZOBL+Wei+WPt+S7t+agvOOAgeWboui0reS7t1xuICAgIGNvbnN0IGRlY29yYXRlSXRlbSA9IGdvb2QgPT4ge1xuXG4gICAgICAgIGFsbFByaWNlQXJyLnB1c2goIGdvb2QucHJpY2UgKTtcbiAgICAgICAgXG4gICAgICAgIGlmICggZ29vZC5zdG9jayApIHtcbiAgICAgICAgICAgIGFsbFN0b2NrQXJyLnB1c2goIGdvb2Quc3RvY2sgKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICggZ29vZC5ncm91cFByaWNlICkge1xuICAgICAgICAgICAgYWxsUHJpY2VBcnIucHVzaCggZ29vZC5ncm91cFByaWNlICk7XG4gICAgICAgIH1cblxuICAgIH07XG5cbiAgICAvLyDml6DmnaHku7bms6jlhaUg54m55Lu35rS75Yqo55qE5Lu35qC844CB5Zui6LSt5Lu3XG4gICAgY29uc3QgZGVjb3JhdGVJdGVtMiA9IGFjdGl2aXRpZXMgPT4ge1xuICAgICAgICBpZiAoIEFycmF5LmlzQXJyYXkoIGFjdGl2aXRpZXMgKSkge1xuICAgICAgICAgICAgYWN0aXZpdGllcy5tYXAoIGFjID0+IHtcbiAgICAgICAgICAgICAgICBhbGxQcmljZUFyci5wdXNoKCBhYy5hY19wcmljZSApO1xuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIGlmICggYWMuYWNfZ3JvdXBQcmljZSApIHtcbiAgICAgICAgICAgICAgICAgICAgYWxsUHJpY2VBcnIucHVzaCggYWMuYWNfZ3JvdXBQcmljZSApO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLy8g5peg5p2h5Lu25rOo5YWlIOeJueS7t+a0u+WKqOeahOS7t+agvOOAgeWboui0reS7t1xuICAgIGRlY29yYXRlSXRlbTIoIHguYWN0aXZpdGllcyApO1xuXG4gICAgLy8g5rKh5pyJ5Z6L5Y+3XG4gICAgaWYgKCAheC5zdGFuZGFyZHMgfHwgeC5zdGFuZGFyZHMubGVuZ3RoID09PSAwICkge1xuICAgICAgICBkZWNvcmF0ZUl0ZW0oIHggKTtcbiAgICBcbiAgICAvLyDmnInlnovlj7dcbiAgICB9IGVsc2Uge1xuICAgICAgICB4LnN0YW5kYXJkcy5tYXAoIGRlY29yYXRlSXRlbSApO1xuICAgIH1cblxuICAgIC8vIOmHjeaWsOaOkuW6j+S7t+agvOWSjOW6k+WtmFxuICAgIGFsbFByaWNlQXJyID0gYWxsUHJpY2VBcnIuc29ydCgoIHgsIHkgKSA9PiB4IC0geSApO1xuICAgIGFsbFN0b2NrQXJyID0gYWxsU3RvY2tBcnIuc29ydCgoIHgsIHkgKSA9PiB4IC0geSApO1xuICAgIFxuXG4gICAgcmV0dXJuIE9iamVjdC5hc3NpZ24oeyB9LCB4LCB7XG5cbiAgICAgICAgcGlkOiB4Ll9pZCxcblxuICAgICAgICAvLyDmmK/lkKbmnInmi7zlm6JcbiAgICAgICAgaGFzUGluOiBoYXNQaW4oIHggKSxcblxuICAgICAgICAvLyDlupPlrZjljLrpl7RcbiAgICAgICAgc3RvY2skOiBhbGxTdG9ja0Fyci5sZW5ndGggPT09IDAgP1xuICAgICAgICAgICAgYWxsU3RvY2tBcnJbIDAgXSA6XG4gICAgICAgICAgICBhbGxTdG9ja0FyclsgMCBdID09PSBhbGxTdG9ja0FyclsgYWxsU3RvY2tBcnIubGVuZ3RoIC0gMSBdID9cbiAgICAgICAgICAgICAgICBhbGxTdG9ja0FyclsgMCBdIDpcbiAgICAgICAgICAgICAgICBgJHthbGxTdG9ja0FyclsgMCBdfSB+ICR7YWxsU3RvY2tBcnJbIGFsbFN0b2NrQXJyLmxlbmd0aCAtIDEgXX1gLFxuXG4gICAgICAgIC8vIOS7t+agvOWMuumXtFxuICAgICAgICBwcmljZSQ6IGFsbFByaWNlQXJyLmxlbmd0aCA9PT0gMCA/XG4gICAgICAgICAgICBhbGxQcmljZUFyclsgMCBdIDpcbiAgICAgICAgICAgICAgICBhbGxQcmljZUFyclsgMCBdID09PSBhbGxQcmljZUFyclsgYWxsUHJpY2VBcnIubGVuZ3RoIC0gMSBdID8gXG4gICAgICAgICAgICAgICAgICAgIGFsbFByaWNlQXJyWyAwIF0gOlxuICAgICAgICAgICAgICAgICAgICBgJHthbGxQcmljZUFyclsgMCBdfSB+ICR7YWxsUHJpY2VBcnJbIGFsbFByaWNlQXJyLmxlbmd0aCAtIDEgXX1gLFxuXG4gICAgICAgIC8vIOacgOWkp+W5heW6puW3ruS7t1xuICAgICAgICBwcmljZUdhcDogYWxsUHJpY2VBcnIubGVuZ3RoID09PSAwID9cbiAgICAgICAgICAgIDAgOlxuICAgICAgICAgICAgYCR7YWxsUHJpY2VBcnJbIGFsbFByaWNlQXJyLmxlbmd0aCAtIDEgXSAtIGFsbFByaWNlQXJyWyAwIF19YCxcblxuICAgICAgICAvLyDmnIDkvY7ku7fmoLzvvIjlkKvlm6LotK3ku7fvvIlcbiAgICAgICAgbG93ZXN0X3ByaWNlJDogYWxsUHJpY2VBcnJbIDAgXSxcblxuICAgICAgICAvKiog5piv5ZCm5pyJ5rS75YqoICovXG4gICAgICAgIGhhc0FjdGl2aXR5OiAhIXguYWN0aXZpdHkgfHwgKEFycmF5LmlzQXJyYXkoIHguYWN0aXZpdGllcyApICYmIHguYWN0aXZpdGllcy5sZW5ndGggPiAwKSxcblxuICAgICAgICAvKiog5ou85Zui5L+h5oGvICovXG4gICAgICAgIGdvb2RQaW5zOiBkZWFsR29vZFBpbiggeCApLFxuXG4gICAgICAgIC8qKiDmoIfnrb4gKi9cbiAgICAgICAgdGFnVGV4dDogeC50YWcuam9pbign44CBJyksXG5cbiAgICAgICAgLyoqIOaYr+WQpuWtmOWcqOW6k+WtmOWRiuaApSAqL1xuICAgICAgICBvdXRTdG9jazogYWxsU3RvY2tBcnIuc29tZSggeCA9PiB4IDwgMTAgKVxuICAgIH0pXG5cbn07XG5cbmNvbnN0IGhhc1BpbiA9IGdvb2QgPT4ge1xuICAgIGNvbnN0IHsgYWN0aXZpdGllcywgc3RhbmRhcmRzLCBncm91cFByaWNlIH0gPSBnb29kO1xuICAgIGNvbnN0IHBpbmluZ1N0YW5kYXJkcyA9IHN0YW5kYXJkcy5maWx0ZXIoIHggPT4gISF4Lmdyb3VwUHJpY2UgKTtcbiAgICBjb25zdCBwaW5pbmdBY3RpdmllcyA9ICEhYWN0aXZpdGllcyA/IGFjdGl2aXRpZXMuZmlsdGVyKCB4ID0+ICEheC5hY19ncm91cFByaWNlICkgOiBbIF07XG4gICAgcmV0dXJuICEhZ3JvdXBQcmljZSB8fCBwaW5pbmdTdGFuZGFyZHMubGVuZ3RoID4gMCB8fCBwaW5pbmdBY3Rpdmllcy5sZW5ndGggPiAwO1xufVxuXG4vKiog5aSE55CG5ZWG5ZOB55qE5ou85Zui5beu5Lu377yM6L+U5Zue5ou85Zui5YiX6KGo5ZKM5ou85Zui5beu5Lu35Yy66Ze077yI5ZCr54m55Lu377yJICovXG5jb25zdCBkZWFsR29vZFBpbiA9IGdvb2QgPT4ge1xuICAgIGNvbnN0IHsgYWN0aXZpdGllcywgc3RhbmRhcmRzLCBwcmljZSwgZ3JvdXBQcmljZSB9ID0gZ29vZDtcblxuICAgIC8vIOWNleWTgSBcbiAgICBpZiAoICFzdGFuZGFyZHMgfHwgc3RhbmRhcmRzLmxlbmd0aCA9PT0gMCApIHtcbiAgICAgICAgY29uc3QgYWNUYXJnZXQgPSAhYWN0aXZpdGllcyA/XG4gICAgICAgICAgICAgICAgbnVsbCA6IFxuICAgICAgICAgICAgICAgIGFjdGl2aXRpZXMuZmluZCggYWMgPT4gYWMucGlkID09PSBnb29kLnBpZCApO1xuICAgICAgICBjb25zdCBwID0gYWNUYXJnZXQgPyBhY1RhcmdldC5hY19wcmljZSA6IHByaWNlO1xuICAgICAgICBjb25zdCBncCA9IGFjVGFyZ2V0ID8gYWNUYXJnZXQuYWNfZ3JvdXBQcmljZSA6IGdyb3VwUHJpY2U7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAvLyDmi7zlm6LliJfooahcbiAgICAgICAgICAgIGxpc3Q6IFt7XG4gICAgICAgICAgICAgICAgcHJpY2U6IHAsXG4gICAgICAgICAgICAgICAgZ3JvdXBQcmljZTogZ3BcbiAgICAgICAgICAgIH1dLFxuICAgICAgICAgICAgLy8g5q+P5a+55Y+v5ou85Zui5Z6L5Y+377yM5Y+v5LyY5oOg55qE5Lu35qC85Yy66Ze0XG4gICAgICAgICAgICBlYWNoUHJpY2VSb3VuZDogZ3AgPyAocCAtIGdwKS50b0ZpeGVkKCAyICkgOiAwXG4gICAgICAgIH1cbiAgICB9IGVsc2Uge1xuXG4gICAgICAgIC8qKiDlnovlj7cgKyDnibnku7cgKi9cbiAgICAgICAgY29uc3QgbWV0YSA9IHN0YW5kYXJkcy5tYXAoIHN0YW5kYXJkID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGFjVGFyZ2V0ID0gIWFjdGl2aXRpZXMgP1xuICAgICAgICAgICAgICAgIG51bGwgOiBcbiAgICAgICAgICAgICAgICBhY3Rpdml0aWVzLmZpbmQoIGFjID0+IGFjLnBpZCA9PT0gc3RhbmRhcmQucGlkICYmIGFjLnNpZCA9PT0gc3RhbmRhcmQuX2lkICk7XG4gICAgICAgICAgICBpZiAoKCAhIWFjVGFyZ2V0ICYmICEhYWNUYXJnZXQuYWNfZ3JvdXBQcmljZSApIHx8IHN0YW5kYXJkLmdyb3VwUHJpY2UgKSB7XG4gICAgICAgICAgICAgICAgaWYgKCBhY1RhcmdldCApIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHByaWNlOiBhY1RhcmdldC5hY19wcmljZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGdyb3VwUHJpY2U6IGFjVGFyZ2V0LmFjX2dyb3VwUHJpY2VcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBwcmljZTogc3RhbmRhcmQucHJpY2UsXG4gICAgICAgICAgICAgICAgICAgICAgICBncm91cFByaWNlOiBzdGFuZGFyZC5ncm91cFByaWNlXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfSkuZmlsdGVyKCB4ID0+ICEheCApO1xuXG4gICAgICAgIGNvbnN0IGRlbHRhcyA9IG1ldGEubWFwKCB4ID0+IFxuICAgICAgICAgICAgKHgucHJpY2UgLSAoIHguZ3JvdXBQcmljZSB8fCAwICkpLnRvRml4ZWQoIDIgKVxuICAgICAgICApLnNvcnQoKCB4LCB5ICkgPT4geSAtIHggKTtcblxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgbGlzdDogbWV0YSxcbiAgICAgICAgICAgIC8vIOavj+WvueWPr+aLvOWbouWei+WPt++8jOWPr+S8mOaDoOeahOS7t+agvOWMuumXtFxuICAgICAgICAgICAgZWFjaFByaWNlUm91bmQ6ICBkZWx0YXNbIGRlbHRhcy5sZW5ndGggLSAxIF0gIT09IGRlbHRhc1sgMCBdID9cbiAgICAgICAgICAgICAgICAgYCR7ZGVsdGFzWyBkZWx0YXMubGVuZ3RoIC0gMSBdfSB+ICR7ZGVsdGFzWyAwIF19YCA6XG4gICAgICAgICAgICAgICAgIGRlbHRhc1sgMCBdXG4gICAgICAgIH07XG4gICAgfVxufVxuXG5leHBvcnQge1xuICAgIGRlbGF5ZXJpbmdHb29kXG59Il19