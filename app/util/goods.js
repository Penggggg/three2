"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var pushIntegralRate = 0.05;
var delayeringGood = function (x, pushIntegralRate) {
    if (pushIntegralRate === void 0) { pushIntegralRate = 0; }
    if (!x || Object.keys(x).length === 0) {
        return {};
    }
    var lowest_pin_origin_price$ = x.price;
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
        lowest_pin_origin_price$ = x.price;
    }
    else {
        x.standards.map(decorateItem);
        var standardSet_1 = null;
        var lowest_standard_price_1 = 0;
        x.standards.map(function (x) {
            if (x.groupPrice < lowest_standard_price_1 || lowest_standard_price_1 === 0) {
                standardSet_1 = x;
                lowest_standard_price_1 = x.groupPrice;
            }
        });
        if (!!standardSet_1) {
            lowest_pin_origin_price$ = standardSet_1.price;
        }
    }
    allPriceArr = allPriceArr.sort(function (x, y) { return x - y; });
    allStockArr = allStockArr.sort(function (x, y) { return x - y; });
    var lowest_price$ = allPriceArr[0];
    (x.activities || []).map(function (activity) {
        if (!!activity.ac_price &&
            !!activity.ac_groupPrice &&
            lowest_price$ === activity.ac_groupPrice) {
            lowest_pin_origin_price$ = activity.ac_price;
        }
    });
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
        integral$: allPriceArr.length === 0 ?
            (allPriceArr[0] * pushIntegralRate).toFixed(1) :
            allPriceArr[0] === allPriceArr[allPriceArr.length - 1] ?
                (allPriceArr[0] * pushIntegralRate).toFixed(1) :
                (allPriceArr[0] * pushIntegralRate).toFixed(1) + " ~ " + (allPriceArr[allPriceArr.length - 1] * pushIntegralRate).toFixed(1),
        maxIntegral$: Number((allPriceArr[allPriceArr.length - 1] * pushIntegralRate).toFixed(1)),
        priceGap: allPriceArr.length === 0 ?
            0 :
            Math.ceil(allPriceArr[allPriceArr.length - 1] - allPriceArr[0]),
        lowest_price$: lowest_price$,
        lowest_pin_origin_price$: lowest_pin_origin_price$,
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ29vZHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJnb29kcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUVBLElBQU0sZ0JBQWdCLEdBQUcsSUFBSSxDQUFDO0FBTzlCLElBQU0sY0FBYyxHQUFHLFVBQUUsQ0FBQyxFQUFFLGdCQUFvQjtJQUFwQixpQ0FBQSxFQUFBLG9CQUFvQjtJQUU1QyxJQUFLLENBQUMsQ0FBQyxJQUFJLE1BQU0sQ0FBQyxJQUFJLENBQUUsQ0FBQyxDQUFFLENBQUMsTUFBTSxLQUFLLENBQUMsRUFBRztRQUN2QyxPQUFPLEVBQUcsQ0FBQztLQUNkO0lBR0QsSUFBSSx3QkFBd0IsR0FBRyxDQUFDLENBQUMsS0FBSyxDQUFDO0lBR3ZDLElBQUksV0FBVyxHQUFXLEVBQUcsQ0FBQztJQUc5QixJQUFJLFdBQVcsR0FBWSxFQUFHLENBQUM7SUFHL0IsSUFBTSxZQUFZLEdBQUcsVUFBQSxJQUFJO1FBRXJCLFdBQVcsQ0FBQyxJQUFJLENBQUUsSUFBSSxDQUFDLEtBQUssQ0FBRSxDQUFDO1FBRS9CLElBQUssSUFBSSxDQUFDLEtBQUssRUFBRztZQUNkLFdBQVcsQ0FBQyxJQUFJLENBQUUsSUFBSSxDQUFDLEtBQUssQ0FBRSxDQUFDO1NBQ2xDO1FBRUQsSUFBSyxJQUFJLENBQUMsVUFBVSxFQUFHO1lBQ25CLFdBQVcsQ0FBQyxJQUFJLENBQUUsSUFBSSxDQUFDLFVBQVUsQ0FBRSxDQUFDO1NBQ3ZDO0lBRUwsQ0FBQyxDQUFDO0lBR0YsSUFBTSxhQUFhLEdBQUcsVUFBQSxVQUFVO1FBQzVCLElBQUssS0FBSyxDQUFDLE9BQU8sQ0FBRSxVQUFVLENBQUUsRUFBRTtZQUM5QixVQUFVLENBQUMsR0FBRyxDQUFFLFVBQUEsRUFBRTtnQkFDZCxXQUFXLENBQUMsSUFBSSxDQUFFLEVBQUUsQ0FBQyxRQUFRLENBQUUsQ0FBQztnQkFFaEMsSUFBSyxFQUFFLENBQUMsYUFBYSxFQUFHO29CQUNwQixXQUFXLENBQUMsSUFBSSxDQUFFLEVB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UUFBUSxDQUFDLGFBQWE7cUJBQ3JDLENBQUE7aUJBQ0o7cUJBQU07b0JBQ0gsT0FBTzt3QkFDSCxLQUFLLEVBQUUsUUFBUSxDQUFDLEtBQUs7d0JBQ3JCLFVBQVUsRUFBRSxRQUFRLENBQUMsVUFBVTtxQkFDbEMsQ0FBQTtpQkFDSjthQUNKO1lBQ0QsT0FBTyxJQUFJLENBQUM7UUFDaEIsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFFLFVBQUEsQ0FBQyxJQUFJLE9BQUEsQ0FBQyxDQUFDLENBQUMsRUFBSCxDQUFHLENBQUUsQ0FBQztRQUV0QixJQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFFLFVBQUEsQ0FBQztZQUN0QixPQUFBLENBQUMsQ0FBQyxDQUFDLEtBQUssR0FBRyxDQUFFLENBQUMsQ0FBQyxVQUFVLElBQUksQ0FBQyxDQUFFLENBQUMsQ0FBQyxPQUFPLENBQUUsQ0FBQyxDQUFFO1FBQTlDLENBQThDLENBQ2pELENBQUMsSUFBSSxDQUFDLFVBQUUsQ0FBQyxFQUFFLENBQUMsSUFBTSxPQUFBLENBQUMsR0FBRyxDQUFDLEVBQUwsQ0FBSyxDQUFFLENBQUM7UUFFM0IsT0FBTztZQUNILElBQUksRUFBRSxJQUFJO1lBRVYsY0FBYyxFQUFHLE1BQU0sQ0FBRSxNQUFNLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBRSxLQUFLLE1BQU0sQ0FBRSxDQUFDLENBQUUsQ0FBQyxDQUFDO2dCQUN0RCxNQUFNLENBQUUsTUFBTSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUUsV0FBTSxNQUFNLENBQUUsQ0FBQyxDQUFJLENBQUMsQ0FBQztnQkFDbkQsTUFBTSxDQUFFLENBQUMsQ0FBRTtTQUNuQixDQUFDO0tBQ0w7QUFDTCxDQUFDLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJcbi8qKiDnp6/liIbmjqjlub/mr5TkvosgKi9cbmNvbnN0IHB1c2hJbnRlZ3JhbFJhdGUgPSAwLjA1O1xuXG4vKiogXG4gKiDllYblk4Eg772eIOS7t+agvOWMuumXtOOAgeW6k+WtmOWMuumXtOOAgeW3ruS7t+OAgeacgOS9juS7t+agvO+8iOWQq+Wboui0reS7ty/kuIDlj6Pku7fvvIlcbiAqIEBwYXJhbSB4IOWVhuWTgeivpuaDhVxuICogQHBhcmFtIHB1c2hJbnRlZ3JhbFJhdGUg56ev5YiG5o6o5bm/6I6354K55q+U5L6LXG4gKi9cbmNvbnN0IGRlbGF5ZXJpbmdHb29kID0gKCB4LCBwdXNoSW50ZWdyYWxSYXRlID0gMCApID0+IHtcbiBcbiAgICBpZiAoICF4IHx8IE9iamVjdC5rZXlzKCB4ICkubGVuZ3RoID09PSAwICkge1xuICAgICAgICByZXR1cm4geyB9O1xuICAgIH1cblxuICAgIC8vIOacgOS9juaLvOWbouS7t++8jOWvueW6lOeahOWOn+S7t1xuICAgIGxldCBsb3dlc3RfcGluX29yaWdpbl9wcmljZSQgPSB4LnByaWNlO1xuXG4gICAgLy8g5Yid5aeL5YyW77ya5Lu35qC85pWw57uE77yI5ZCr5Zui6LSt5Lu344CB54m55Lu377yJXG4gICAgbGV0IGFsbFByaWNlQXJyOiBhbnlbIF0gPSBbIF07XG5cbiAgICAvLyDliJ3lp4vljJbvvJrlupPlrZjliJfooahcbiAgICBsZXQgYWxsU3RvY2tBcnI6IGFueVsgXSAgPSBbIF07XG5cbiAgICAvLyDml6DmnaHku7bms6jlhaUg5Li75Lqn5ZOBL+Wei+WPt+S7t+agvOOAgeWboui0reS7t1xuICAgIGNvbnN0IGRlY29yYXRlSXRlbSA9IGdvb2QgPT4ge1xuXG4gICAgICAgIGFsbFByaWNlQXJyLnB1c2goIGdvb2QucHJpY2UgKTtcbiAgICAgICAgXG4gICAgICAgIGlmICggZ29vZC5zdG9jayApIHtcbiAgICAgICAgICAgIGFsbFN0b2NrQXJyLnB1c2goIGdvb2Quc3RvY2sgKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICggZ29vZC5ncm91cFByaWNlICkge1xuICAgICAgICAgICAgYWxsUHJpY2VBcnIucHVzaCggZ29vZC5ncm91cFByaWNlICk7XG4gICAgICAgIH1cblxuICAgIH07XG5cbiAgICAvLyDml6DmnaHku7bms6jlhaUg54m55Lu35rS75Yqo55qE5Lu35qC844CB5Zui6LSt5Lu3XG4gICAgY29uc3QgZGVjb3JhdGVJdGVtMiA9IGFjdGl2aXRpZXMgPT4ge1xuICAgICAgICBpZiAoIEFycmF5LmlzQXJyYXkoIGFjdGl2aXRpZXMgKSkge1xuICAgICAgICAgICAgYWN0aXZpdGllcy5tYXAoIGFjID0+IHtcbiAgICAgICAgICAgICAgICBhbGxQcmljZUFyci5wdXNoKCBhYy5hY19wcmljZSApO1xuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIGlmICggYWMuYWNfZ3JvdXBQcmljZSApIHtcbiAgICAgICAgICAgICAgICAgICAgYWxsUHJpY2VBcnIucHVzaCggYWMuYWNfZ3JvdXBQcmljZSApO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLy8g5peg5p2h5Lu25rOo5YWlIOeJueS7t+a0u+WKqOeahOS7t+agvOOAgeWboui0reS7t1xuICAgIGRlY29yYXRlSXRlbTIoIHguYWN0aXZpdGllcyApO1xuXG4gICAgLy8g5rKh5pyJ5Z6L5Y+3XG4gICAgaWYgKCAheC5zdGFuZGFyZHMgfHwgeC5zdGFuZGFyZHMubGVuZ3RoID09PSAwICkge1xuICAgICAgICBkZWNvcmF0ZUl0ZW0oIHggKTtcbiAgICAgICAgbG93ZXN0X3Bpbl9vcmlnaW5fcHJpY2UkID0geC5wcmljZTtcbiAgICAvLyDmnInlnovlj7dcbiAgICB9IGVsc2Uge1xuICAgICAgICB4LnN0YW5kYXJkcy5tYXAoIGRlY29yYXRlSXRlbSApO1xuXG4gICAgICAgIGxldCBzdGFuZGFyZFNldDogYW55ID0gbnVsbDtcbiAgICAgICAgbGV0IGxvd2VzdF9zdGFuZGFyZF9wcmljZSA9IDA7XG5cbiAgICAgICAgeC5zdGFuZGFyZHMubWFwKCB4ID0+IHtcbiAgICAgICAgICAgIGlmICggeC5ncm91cFByaWNlIDwgbG93ZXN0X3N0YW5kYXJkX3ByaWNlIHx8IGxvd2VzdF9zdGFuZGFyZF9wcmljZSA9PT0gMCApIHtcbiAgICAgICAgICAgICAgICBzdGFuZGFyZFNldCA9IHg7XG4gICAgICAgICAgICAgICAgbG93ZXN0X3N0YW5kYXJkX3ByaWNlID0geC5ncm91cFByaWNlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgaWYgKCAhIXN0YW5kYXJkU2V0ICkge1xuICAgICAgICAgICAgbG93ZXN0X3Bpbl9vcmlnaW5fcHJpY2UkID0gc3RhbmRhcmRTZXQucHJpY2U7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvLyDph43mlrDmjpLluo/ku7fmoLzlkozlupPlrZhcbiAgICBhbGxQcmljZUFyciA9IGFsbFByaWNlQXJyLnNvcnQoKCB4LCB5ICkgPT4geCAtIHkgKTtcbiAgICBhbGxTdG9ja0FyciA9IGFsbFN0b2NrQXJyLnNvcnQoKCB4LCB5ICkgPT4geCAtIHkgKTtcblxuICAgIC8vIOacgOS9juS7t1xuICAgIGxldCBsb3dlc3RfcHJpY2UkID0gYWxsUHJpY2VBcnJbIDAgXTtcblxuICAgIC8vIOacieeJueS7t1xuICAgICggeC5hY3Rpdml0aWVzIHx8IFsgXSkubWFwKCBhY3Rpdml0eSA9PiB7XG4gICAgICAgIGlmICggXG4gICAgICAgICAgICAhIWFjdGl2aXR5LmFjX3ByaWNlICYmXG4gICAgICAgICAgICAhIWFjdGl2aXR5LmFjX2dyb3VwUHJpY2UgJiYgXG4gICAgICAgICAgICBsb3dlc3RfcHJpY2UkID09PSBhY3Rpdml0eS5hY19ncm91cFByaWNlIFxuICAgICAgICApIHtcbiAgICAgICAgICAgIGxvd2VzdF9waW5fb3JpZ2luX3ByaWNlJCA9IGFjdGl2aXR5LmFjX3ByaWNlO1xuICAgICAgICB9XG4gICAgfSk7XG5cblxuICAgIHJldHVybiBPYmplY3QuYXNzaWduKHsgfSwgeCwge1xuXG4gICAgICAgIHBpZDogeC5faWQsXG5cbiAgICAgICAgLy8g5piv5ZCm5pyJ5ou85ZuiXG4gICAgICAgIGhhc1BpbjogaGFzUGluKCB4ICksXG5cbiAgICAgICAgLy8g5bqT5a2Y5Yy66Ze0XG4gICAgICAgIHN0b2NrJDogYWxsU3RvY2tBcnIubGVuZ3RoID09PSAwID9cbiAgICAgICAgICAgIGFsbFN0b2NrQXJyWyAwIF0gOlxuICAgICAgICAgICAgYWxsU3RvY2tBcnJbIDAgXSA9PT0gYWxsU3RvY2tBcnJbIGFsbFN0b2NrQXJyLmxlbmd0aCAtIDEgXSA/XG4gICAgICAgICAgICAgICAgYWxsU3RvY2tBcnJbIDAgXSA6XG4gICAgICAgICAgICAgICAgYCR7YWxsU3RvY2tBcnJbIDAgXX0gfiAke2FsbFN0b2NrQXJyWyBhbGxTdG9ja0Fyci5sZW5ndGggLSAxIF19YCxcblxuICAgICAgICAvLyDku7fmoLzljLrpl7RcbiAgICAgICAgcHJpY2UkOiBhbGxQcmljZUFyci5sZW5ndGggPT09IDAgP1xuICAgICAgICAgICAgYWxsUHJpY2VBcnJbIDAgXSA6XG4gICAgICAgICAgICAgICAgYWxsUHJpY2VBcnJbIDAgXSA9PT0gYWxsUHJpY2VBcnJbIGFsbFByaWNlQXJyLmxlbmd0aCAtIDEgXSA/IFxuICAgICAgICAgICAgICAgICAgICBhbGxQcmljZUFyclsgMCBdIDpcbiAgICAgICAgICAgICAgICAgICAgYCR7YWxsUHJpY2VBcnJbIDAgXX0gfiAke2FsbFByaWNlQXJyWyBhbGxQcmljZUFyci5sZW5ndGggLSAxIF19YCxcblxuICAgICAgICAvLyDlj6/ojrfnp6/liIbljLrpl7RcbiAgICAgICAgaW50ZWdyYWwkOiBhbGxQcmljZUFyci5sZW5ndGggPT09IDAgP1xuICAgICAgICAgICAgKGFsbFByaWNlQXJyWyAwIF0gKiBwdXNoSW50ZWdyYWxSYXRlKS50b0ZpeGVkKCAxICkgOlxuICAgICAgICAgICAgICAgIGFsbFByaWNlQXJyWyAwIF0gPT09IGFsbFByaWNlQXJyWyBhbGxQcmljZUFyci5sZW5ndGggLSAxIF0gPyBcbiAgICAgICAgICAgICAgICAgICAgKGFsbFByaWNlQXJyWyAwIF0gKiBwdXNoSW50ZWdyYWxSYXRlKS50b0ZpeGVkKCAxICkgOlxuICAgICAgICAgICAgICAgICAgICBgJHsoYWxsUHJpY2VBcnJbIDAgXSAqIHB1c2hJbnRlZ3JhbFJhdGUpLnRvRml4ZWQoIDEgKX0gfiAkeyhhbGxQcmljZUFyclsgYWxsUHJpY2VBcnIubGVuZ3RoIC0gMSBdICogcHVzaEludGVncmFsUmF0ZSkudG9GaXhlZCggMSApfWAsXG5cbiAgICAgICAgLy8g5pyA5aSn56ev5YiGXG4gICAgICAgIG1heEludGVncmFsJDogTnVtYmVyKChhbGxQcmljZUFyclsgYWxsUHJpY2VBcnIubGVuZ3RoIC0gMSBdICogcHVzaEludGVncmFsUmF0ZSkudG9GaXhlZCggMSApKSxcblxuICAgICAgICAvLyDmnIDlpKfluYXluqblt67ku7dcbiAgICAgICAgcHJpY2VHYXA6IGFsbFByaWNlQXJyLmxlbmd0aCA9PT0gMCA/XG4gICAgICAgICAgICAwIDpcbiAgICAgICAgICAgIE1hdGguY2VpbCggYWxsUHJpY2VBcnJbIGFsbFByaWNlQXJyLmxlbmd0aCAtIDEgXSAtIGFsbFByaWNlQXJyWyAwIF0pLFxuXG4gICAgICAgIC8vIOacgOS9juS7t+agvO+8iOWQq+Wboui0reS7t++8iVxuICAgICAgICBsb3dlc3RfcHJpY2UkLFxuXG4gICAgICAgIC8vIOacgOS9juS7t+agvO+8iOWQq+Wboui0reS7t++8ieeahOWOn+S7t1xuICAgICAgICBsb3dlc3RfcGluX29yaWdpbl9wcmljZSQsXG5cbiAgICAgICAgLyoqIOaYr+WQpuaciea0u+WKqCAqL1xuICAgICAgICBoYXNBY3Rpdml0eTogISF4LmFjdGl2aXR5IHx8IChBcnJheS5pc0FycmF5KCB4LmFjdGl2aXRpZXMgKSAmJiB4LmFjdGl2aXRpZXMubGVuZ3RoID4gMCksXG5cbiAgICAgICAgLyoqIOaLvOWbouS/oeaBryAqL1xuICAgICAgICBnb29kUGluczogZGVhbEdvb2RQaW4oIHggKSxcblxuICAgICAgICAvKiog5qCH562+ICovXG4gICAgICAgIHRhZ1RleHQ6IHgudGFnLmpvaW4oJ+OAgScpLFxuXG4gICAgICAgIC8qKiDmmK/lkKblrZjlnKjlupPlrZjlkYrmgKUgKi9cbiAgICAgICAgb3V0U3RvY2s6IGFsbFN0b2NrQXJyLnNvbWUoIHggPT4geCA8IDEwIClcbiAgICB9KVxuXG59O1xuXG5jb25zdCBoYXNQaW4gPSBnb29kID0+IHtcbiAgICBjb25zdCB7IGFjdGl2aXRpZXMsIHN0YW5kYXJkcywgZ3JvdXBQcmljZSB9ID0gZ29vZDtcbiAgICBjb25zdCBwaW5pbmdTdGFuZGFyZHMgPSBzdGFuZGFyZHMuZmlsdGVyKCB4ID0+ICEheC5ncm91cFByaWNlICk7XG4gICAgY29uc3QgcGluaW5nQWN0aXZpZXMgPSAhIWFjdGl2aXRpZXMgPyBhY3Rpdml0aWVzLmZpbHRlciggeCA9PiAhIXguYWNfZ3JvdXBQcmljZSApIDogWyBdO1xuICAgIHJldHVybiAhIWdyb3VwUHJpY2UgfHwgcGluaW5nU3RhbmRhcmRzLmxlbmd0aCA+IDAgfHwgcGluaW5nQWN0aXZpZXMubGVuZ3RoID4gMDtcbn1cblxuLyoqIOWkhOeQhuWVhuWTgeeahOaLvOWbouW3ruS7t++8jOi/lOWbnuaLvOWbouWIl+ihqOWSjOaLvOWbouW3ruS7t+WMuumXtO+8iOWQq+eJueS7t++8iSAqL1xuY29uc3QgZGVhbEdvb2RQaW4gPSBnb29kID0+IHtcbiAgICBjb25zdCB7IGFjdGl2aXRpZXMsIHN0YW5kYXJkcywgcHJpY2UsIGdyb3VwUHJpY2UgfSA9IGdvb2Q7XG5cbiAgICAvLyDljZXlk4EgXG4gICAgaWYgKCAhc3RhbmRhcmRzIHx8IHN0YW5kYXJkcy5sZW5ndGggPT09IDAgKSB7XG4gICAgICAgIGNvbnN0IGFjVGFyZ2V0ID0gIWFjdGl2aXRpZXMgP1xuICAgICAgICAgICAgICAgIG51bGwgOiBcbiAgICAgICAgICAgICAgICBhY3Rpdml0aWVzLmZpbmQoIGFjID0+IGFjLnBpZCA9PT0gZ29vZC5waWQgKTtcbiAgICAgICAgY29uc3QgcCA9IGFjVGFyZ2V0ID8gYWNUYXJnZXQuYWNfcHJpY2UgOiBwcmljZTtcbiAgICAgICAgY29uc3QgZ3AgPSBhY1RhcmdldCA/IGFjVGFyZ2V0LmFjX2dyb3VwUHJpY2UgOiBncm91cFByaWNlO1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgLy8g5ou85Zui5YiX6KGoXG4gICAgICAgICAgICBsaXN0OiBbe1xuICAgICAgICAgICAgICAgIHByaWNlOiBwLFxuICAgICAgICAgICAgICAgIGdyb3VwUHJpY2U6IGdwXG4gICAgICAgICAgICB9XSxcbiAgICAgICAgICAgIC8vIOavj+WvueWPr+aLvOWbouWei+WPt++8jOWPr+S8mOaDoOeahOS7t+agvOWMuumXtFxuICAgICAgICAgICAgZWFjaFByaWNlUm91bmQ6IGdwID8gKHAgLSBncCkudG9GaXhlZCggMiApIDogMFxuICAgICAgICB9XG4gICAgfSBlbHNlIHtcblxuICAgICAgICAvKiog5Z6L5Y+3ICsg54m55Lu3ICovXG4gICAgICAgIGNvbnN0IG1ldGEgPSBzdGFuZGFyZHMubWFwKCBzdGFuZGFyZCA9PiB7XG4gICAgICAgICAgICBjb25zdCBhY1RhcmdldCA9ICFhY3Rpdml0aWVzID9cbiAgICAgICAgICAgICAgICBudWxsIDogXG4gICAgICAgICAgICAgICAgYWN0aXZpdGllcy5maW5kKCBhYyA9PiBhYy5waWQgPT09IHN0YW5kYXJkLnBpZCAmJiBhYy5zaWQgPT09IHN0YW5kYXJkLl9pZCApO1xuICAgICAgICAgICAgaWYgKCggISFhY1RhcmdldCAmJiAhIWFjVGFyZ2V0LmFjX2dyb3VwUHJpY2UgKSB8fCBzdGFuZGFyZC5ncm91cFByaWNlICkge1xuICAgICAgICAgICAgICAgIGlmICggYWNUYXJnZXQgKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBwcmljZTogYWNUYXJnZXQuYWNfcHJpY2UsXG4gICAgICAgICAgICAgICAgICAgICAgICBncm91cFByaWNlOiBhY1RhcmdldC5hY19ncm91cFByaWNlXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgcHJpY2U6IHN0YW5kYXJkLnByaWNlLFxuICAgICAgICAgICAgICAgICAgICAgICAgZ3JvdXBQcmljZTogc3RhbmRhcmQuZ3JvdXBQcmljZVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH0pLmZpbHRlciggeCA9PiAhIXggKTtcblxuICAgICAgICBjb25zdCBkZWx0YXMgPSBtZXRhLm1hcCggeCA9PiBcbiAgICAgICAgICAgICh4LnByaWNlIC0gKCB4Lmdyb3VwUHJpY2UgfHwgMCApKS50b0ZpeGVkKCAyIClcbiAgICAgICAgKS5zb3J0KCggeCwgeSApID0+IHkgLSB4ICk7XG5cbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGxpc3Q6IG1ldGEsXG4gICAgICAgICAgICAvLyDmr4/lr7nlj6/mi7zlm6Llnovlj7fvvIzlj6/kvJjmg6DnmoTku7fmoLzljLrpl7RcbiAgICAgICAgICAgIGVhY2hQcmljZVJvdW5kOiAgZGVsdGFzWyBkZWx0YXMubGVuZ3RoIC0gMSBdICE9PSBkZWx0YXNbIDAgXSA/XG4gICAgICAgICAgICAgICAgIGAke2RlbHRhc1sgZGVsdGFzLmxlbmd0aCAtIDEgXX0gfiAke2RlbHRhc1sgMCBdfWAgOlxuICAgICAgICAgICAgICAgICBkZWx0YXNbIDAgXVxuICAgICAgICB9O1xuICAgIH1cbn1cblxuZXhwb3J0IHtcbiAgICBkZWxheWVyaW5nR29vZFxufSJdfQ==