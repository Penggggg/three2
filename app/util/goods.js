"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var delayeringGood = function (x) {
    if (!x) {
        return null;
    }
    var stock = x.stock;
    var price = x.price;
    var priceGap = 0;
    var lowest_price = x.groupPrice || x.price;
    if (x.standards.length === 0) {
        stock = x.stock;
        price = x.price;
    }
    else if (x.standards.length === 1) {
        stock = x.standards[0].stock;
        price = x.standards[0].price;
        if (!x.standards[0].groupPrice) {
            lowest_price = lowest_price < x.standards[0].price ?
                lowest_price :
                x.standards[0].price;
        }
        else {
            lowest_price = lowest_price < x.standards[0].groupPrice ?
                lowest_price :
                x.standards[0].groupPrice;
        }
    }
    else if (x.standards.length > 1) {
        var sortedPrice = x.standards.sort(function (x, y) { return x.price - y.price; });
        if (sortedPrice[0].price === sortedPrice[sortedPrice.length - 1].price) {
            price = sortedPrice[0].price;
        }
        else {
            price = sortedPrice[0].price + "~" + sortedPrice[sortedPrice.length - 1].price;
        }
        var sortedStock = x.standards.filter(function (i) { return i.stock !== undefined && i.stock !== null; }).sort(function (x, y) { return x.stock - y.stock; });
        if (sortedStock.length === 1) {
            stock = "" + sortedStock[0].stock;
        }
        else if (sortedStock.length > 1) {
            if (sortedStock[0].stock === sortedStock[sortedStock.length - 1].stock) {
                stock = "" + sortedStock[0].stock;
            }
            else {
                stock = sortedStock[0].stock + "~" + sortedStock[sortedStock.length - 1].stock;
            }
        }
        var priceList_1 = [];
        x.standards.map(function (s) {
            if (!x.groupPrice) {
                priceList_1.push(x.price);
            }
            else {
                priceList_1.push(x.groupPrice < x.price ?
                    x.groupPrice :
                    x.price);
            }
        });
        priceList_1 = priceList_1.sort(function (x, y) { return x - y; });
        lowest_price = priceList_1[0];
    }
    if (x.standards.length === 0) {
        if (x.groupPrice !== null && x.groupPrice !== undefined) {
            priceGap = x.price - x.groupPrice;
        }
        else {
            priceGap = 0;
        }
    }
    else {
        var groupPrice = x.standards.filter(function (x) { return x.groupPrice !== null && x.groupPrice !== undefined; });
        if (groupPrice.length > 0) {
            var sortedGroupPrice = groupPrice.sort(function (x, y) { return ((x.groupPrice - x.price) - (y.groupPrice - y.price)); });
            if ((sortedGroupPrice[0].groupPrice - sortedGroupPrice[0].price) ===
                (sortedGroupPrice[sortedGroupPrice.length - 1].groupPrice - sortedGroupPrice[sortedGroupPrice.length - 1].price)) {
                priceGap = (sortedGroupPrice[0].price - sortedGroupPrice[0].groupPrice);
            }
            else {
                priceGap = sortedGroupPrice[sortedGroupPrice.length - 1].price - sortedGroupPrice[sortedGroupPrice.length - 1].groupPrice + "~" + (sortedGroupPrice[0].price - sortedGroupPrice[0].groupPrice);
            }
        }
        else {
            priceGap = 0;
        }
    }
    return Object.assign({}, x, {
        stock$: stock,
        price$: price,
        priceGap: priceGap,
        lowest_price$: lowest_price
    });
};
exports.delayeringGood = delayeringGood;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ29vZHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJnb29kcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQU1BLElBQU0sY0FBYyxHQUFHLFVBQUEsQ0FBQztJQUVwQixJQUFLLENBQUMsQ0FBQyxFQUFHO1FBQ04sT0FBTyxJQUFJLENBQUE7S0FDZDtJQUdELElBQUksS0FBSyxHQUFHLENBQUMsQ0FBQyxLQUFLLENBQUM7SUFDcEIsSUFBSSxLQUFLLEdBQUcsQ0FBQyxDQUFDLEtBQUssQ0FBQztJQUNwQixJQUFJLFFBQVEsR0FBUSxDQUFDLENBQUM7SUFDdEIsSUFBSSxZQUFZLEdBQUcsQ0FBQyxDQUFDLFVBQVUsSUFBSSxDQUFDLENBQUMsS0FBSyxDQUFDO0lBSTNDLElBQUssQ0FBQyxDQUFDLFNBQVMsQ0FBQyxNQUFNLEtBQUssQ0FBQyxFQUFHO1FBQzVCLEtBQUssR0FBRyxDQUFDLENBQUMsS0FBSyxDQUFDO1FBQ2hCLEtBQUssR0FBRyxDQUFDLENBQUMsS0FBSyxDQUFDO0tBR25CO1NBQU0sSUFBSyxDQUFDLENBQUMsU0FBUyxDQUFDLE1BQU0sS0FBSyxDQUFDLEVBQUc7UUFDbkMsS0FBSyxHQUFHLENBQUMsQ0FBQyxTQUFTLENBQUUsQ0FBQyxDQUFFLENBQUMsS0FBSyxDQUFDO1FBQy9CLEtBQUssR0FBRyxDQUFDLENBQUMsU0FBUyxDQUFFLENBQUMsQ0FBRSxDQUFDLEtBQUssQ0FBQztRQUcvQixJQUFLLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBRSxDQUFDLENBQUUsQ0FBQyxVQUFVLEVBQUc7WUFDaEMsWUFBWSxHQUFHLFlBQVksR0FBRyxDQUFDLENBQUMsU0FBUyxDQUFFLENBQUMsQ0FBRSxDQUFDLEtBQUssQ0FBQyxDQUFDO2dCQUNsRCxZQUFZLENBQUMsQ0FBQztnQkFDZCxDQUFDLENBQUMsU0FBUyxDQUFFLENBQUMsQ0FBRSxDQUFDLEtBQUssQ0FBQztTQUU5QjthQUFNO1lBQ0gsWUFBWSxHQUFHLFlBQVksR0FBRyxDQUFDLENBQUMsU0FBUyxDQUFFLENBQUMsQ0FBRSxDQUFDLFVBQVUsQ0FBQyxDQUFDO2dCQUN2RCxZQUFZLENBQUMsQ0FBQztnQkFDZCxDQUFDLENBQUMsU0FBUyxDQUFFLENBQUMsQ0FBRSxDQUFDLFVBQVUsQ0FBQztTQUNuQztLQUdKO1NBQU8sSUFBSyxDQUFDLENBQUMsU0FBUyxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUc7UUFHbEMsSUFBTSxXQUFXLEdBQUcsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsVUFBRSxDQUFDLEVBQUUsQ0FBQyxJQUFNLE9BQUEsQ0FBQyxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUMsS0FBSyxFQUFqQixDQUFpQixDQUFFLENBQUM7UUFDckUsSUFBSyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxLQUFLLFdBQVcsQ0FBQyxXQUFXLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBRSxDQUFDLEtBQUssRUFBRztZQUN2RSxLQUFLLEdBQUcsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQztTQUNoQzthQUFNO1lBQ0gsS0FBSyxHQUFNLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLFNBQUksV0FBVyxDQUFDLFdBQVcsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFFLENBQUMsS0FBTyxDQUFDO1NBQ25GO1FBR0QsSUFBTSxXQUFXLEdBQUcsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsVUFBQSxDQUFDLElBQUksT0FBQSxDQUFDLENBQUMsS0FBSyxLQUFLLFNBQVMsSUFBSSxDQUFDLENBQUMsS0FBSyxLQUFLLElBQUksRUFBekMsQ0FBeUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFDLENBQUMsRUFBRSxDQUFDLElBQUssT0FBQSxDQUFDLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQyxLQUFLLEVBQWpCLENBQWlCLENBQUMsQ0FBQztRQUV6SCxJQUFLLFdBQVcsQ0FBQyxNQUFNLEtBQUssQ0FBQyxFQUFHO1lBQzVCLEtBQUssR0FBRyxLQUFHLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFPLENBQUM7U0FDckM7YUFBTSxJQUFLLFdBQVcsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFHO1lBQ25DLElBQUssV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssS0FBSyxXQUFXLENBQUMsV0FBVyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQyxLQUFLLEVBQUc7Z0JBQ3RFLEtBQUssR0FBRyxLQUFHLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFPLENBQUM7YUFDckM7aUJBQU07Z0JBQ0gsS0FBSyxHQUFNLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLFNBQUksV0FBVyxDQUFDLFdBQVcsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUMsS0FBTyxDQUFDO2FBQ2xGO1NBQ0Y7UUFHRCxJQUFJLFdBQVMsR0FBYSxFQUFHLENBQUM7UUFDOUIsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUUsVUFBQSxDQUFDO1lBQ2QsSUFBSyxDQUFDLENBQUMsQ0FBQyxVQUFVLEVBQUc7Z0JBQ2pCLFdBQVMsQ0FBQyxJQUFJLENBQUUsQ0FBQyxDQUFDLEtBQUssQ0FBRSxDQUFBO2FBQzVCO2lCQUFNO2dCQUNILFdBQVMsQ0FBQyxJQUFJLENBQUUsQ0FBQyxDQUFDLFVBQVUsR0FBRyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUM7b0JBQ3BDLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQztvQkFDZCxDQUFDLENBQUMsS0FBSyxDQUNWLENBQUE7YUFDSjtRQUNMLENBQUMsQ0FBQyxDQUFDO1FBQ0gsV0FBUyxHQUFHLFdBQVMsQ0FBQyxJQUFJLENBQUMsVUFBRSxDQUFDLEVBQUUsQ0FBQyxJQUFNLE9BQUEsQ0FBQyxHQUFHLENBQUMsRUFBTCxDQUFLLENBQUUsQ0FBQztRQUMvQyxZQUFZLEdBQUcsV0FBUyxDQUFFLENBQUMsQ0FBRSxDQUFDO0tBRWpDO0lBR0QsSUFBSyxDQUFDLENBQUMsU0FBUyxDQUFDLE1BQU0sS0FBSyxDQUFDLEVBQUc7UUFFNUIsSUFBSyxDQUFDLENBQUMsVUFBVSxLQUFLLElBQUksSUFBSSxDQUFDLENBQUMsVUFBVSxLQUFLLFNBQVMsRUFBRztZQUN0RCxRQUFRLEdBQUcsQ0FBQyxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUMsVUFBVSxDQUFDO1NBQ3RDO2FBQU07WUFDSCxRQUFRLEdBQUcsQ0FBQyxDQUFDO1NBQ2hCO0tBRUo7U0FBTTtRQUNILElBQU0sVUFBVSxHQUFHLENBQUMsQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFFLFVBQUEsQ0FBQyxJQUFJLE9BQUEsQ0FBQyxDQUFDLFVBQVUsS0FBSyxJQUFJLElBQUksQ0FBQyxDQUFDLFVBQVUsS0FBSyxTQUFTLEVBQW5ELENBQW1ELENBQUUsQ0FBQztRQUVsRyxJQUFLLFVBQVUsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFHO1lBQ3pCLElBQU0sZ0JBQWdCLEdBQUcsVUFBVSxDQUFDLElBQUksQ0FBQyxVQUFFLENBQUMsRUFBRSxDQUFDLElBQU0sT0FBQSxDQUFDLENBQUUsQ0FBQyxDQUFDLFVBQVUsR0FBRyxDQUFDLENBQUMsS0FBSyxDQUFFLEdBQUcsQ0FBRSxDQUFDLENBQUMsVUFBVSxHQUFHLENBQUMsQ0FBQyxLQUFLLENBQUUsQ0FBQyxFQUF6RCxDQUF5RCxDQUFDLENBQUM7WUFDaEgsSUFBSSxDQUFFLGdCQUFnQixDQUFDLENBQUMsQ0FBQyxDQUFDLFVBQVUsR0FBRyxnQkFBZ0IsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUU7Z0JBQzlELENBQUUsZ0JBQWdCLENBQUUsZ0JBQWdCLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBRSxDQUFDLFVBQVUsR0FBRyxnQkFBZ0IsQ0FBRSxnQkFBZ0IsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFFLENBQUMsS0FBSyxDQUFFLEVBQUU7Z0JBQ3hILFFBQVEsR0FBRyxDQUFFLGdCQUFnQixDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssR0FBRyxnQkFBZ0IsQ0FBQyxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUUsQ0FBQzthQUM3RTtpQkFBTTtnQkFDSCxRQUFRLEdBQU0sZ0JBQWdCLENBQUUsZ0JBQWdCLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBRSxDQUFDLEtBQUssR0FBRyxnQkFBZ0IsQ0FBRSxnQkFBZ0IsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFFLENBQUMsVUFBVSxVQUFJLGdCQUFnQixDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssR0FBRyxnQkFBZ0IsQ0FBQyxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUUsQ0FBQzthQUNwTTtTQUNKO2FBQU07WUFDSCxRQUFRLEdBQUcsQ0FBQyxDQUFDO1NBQ2hCO0tBQ0o7SUFFRCxPQUFPLE1BQU0sQ0FBQyxNQUFNLENBQUMsRUFBRyxFQUFFLENBQUMsRUFBRTtRQUV6QixNQUFNLEVBQUUsS0FBSztRQUViLE1BQU0sRUFBRSxLQUFLO1FBRWIsUUFBUSxVQUFBO1FBRVIsYUFBYSxFQUFFLFlBQVk7S0FDOUIsQ0FBQyxDQUFBO0FBRU4sQ0FBQyxDQUFDO0FBR0Usd0NBQWMiLCJzb3VyY2VzQ29udGVudCI6WyJcbi8qKiBcbiAqIOWVhuWTgSDvvZ4g5Lu35qC85Yy66Ze044CB5bqT5a2Y5Yy66Ze044CB5beu5Lu344CB5pyA5L2O5Lu35qC877yI5ZCr5Zui6LSt5Lu377yJXG4gKiAhIOW3ruS7t+aOkuW6j+iuoeeul+aciemXrumimO+8jOayoeacieagueaNruW3ruS7t+aOkuW6j1xuICogISDmraTlpITpu5jorqQg5Zui6LSt5Lu35bCP5LqO5Y6f5Lu377yM5L2G5LiN5LiA5a6a5pyJ5Zui6LSt5Lu3XG4gKi9cbmNvbnN0IGRlbGF5ZXJpbmdHb29kID0geCA9PiB7XG5cbiAgICBpZiAoICF4ICkge1xuICAgICAgICByZXR1cm4gbnVsbFxuICAgIH1cbiAgICBcbiAgICAvLyDliJ3lp4vljJYg5bqT5a2Y44CB5Lu35qC844CB5beu5Lu344CB5pyA5L2O5Lu35qC8XG4gICAgbGV0IHN0b2NrID0geC5zdG9jaztcbiAgICBsZXQgcHJpY2UgPSB4LnByaWNlO1xuICAgIGxldCBwcmljZUdhcDogYW55ID0gMDtcbiAgICBsZXQgbG93ZXN0X3ByaWNlID0geC5ncm91cFByaWNlIHx8IHgucHJpY2U7XG5cbiAgICAvLyDlpITnkIYg5bqT5a2Y44CB5Lu35qC844CB5pyA5L2O5Lu35qC8XG4gICAgLy8g5rKh5pyJ5Z6L5Y+3XG4gICAgaWYgKCB4LnN0YW5kYXJkcy5sZW5ndGggPT09IDAgKSB7XG4gICAgICAgIHN0b2NrID0geC5zdG9jaztcbiAgICAgICAgcHJpY2UgPSB4LnByaWNlO1xuXG4gICAgLy8g5Z6L5Y+35Y+q5pyJMeenjVxuICAgIH0gZWxzZSBpZiAoIHguc3RhbmRhcmRzLmxlbmd0aCA9PT0gMSApIHtcbiAgICAgICAgc3RvY2sgPSB4LnN0YW5kYXJkc1sgMCBdLnN0b2NrO1xuICAgICAgICBwcmljZSA9IHguc3RhbmRhcmRzWyAwIF0ucHJpY2U7XG4gICAgICAgIFxuICAgICAgICAvLyDlnovlj7fmsqHmnInlm6LotK3ku7dcbiAgICAgICAgaWYgKCAheC5zdGFuZGFyZHNbIDAgXS5ncm91cFByaWNlICkge1xuICAgICAgICAgICAgbG93ZXN0X3ByaWNlID0gbG93ZXN0X3ByaWNlIDwgeC5zdGFuZGFyZHNbIDAgXS5wcmljZSA/XG4gICAgICAgICAgICAgICAgbG93ZXN0X3ByaWNlIDpcbiAgICAgICAgICAgICAgICB4LnN0YW5kYXJkc1sgMCBdLnByaWNlO1xuICAgICAgICAvLyDlnovlj7fmnInlm6LotK3ku7dcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGxvd2VzdF9wcmljZSA9IGxvd2VzdF9wcmljZSA8IHguc3RhbmRhcmRzWyAwIF0uZ3JvdXBQcmljZSA/XG4gICAgICAgICAgICAgICAgbG93ZXN0X3ByaWNlIDpcbiAgICAgICAgICAgICAgICB4LnN0YW5kYXJkc1sgMCBdLmdyb3VwUHJpY2U7XG4gICAgICAgIH1cbiAgICBcbiAgICAvLyDlnovlj7flpKfkuo4x56eNXG4gICAgfSAgZWxzZSBpZiAoIHguc3RhbmRhcmRzLmxlbmd0aCA+IDEgKSB7XG5cbiAgICAgICAgLy8g5aSE55CG5Lu35qC8XG4gICAgICAgIGNvbnN0IHNvcnRlZFByaWNlID0geC5zdGFuZGFyZHMuc29ydCgoIHgsIHkgKSA9PiB4LnByaWNlIC0geS5wcmljZSApO1xuICAgICAgICBpZiAoIHNvcnRlZFByaWNlWzBdLnByaWNlID09PSBzb3J0ZWRQcmljZVtzb3J0ZWRQcmljZS5sZW5ndGggLSAxIF0ucHJpY2UgKSB7XG4gICAgICAgICAgICBwcmljZSA9IHNvcnRlZFByaWNlWzBdLnByaWNlO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcHJpY2UgPSBgJHtzb3J0ZWRQcmljZVswXS5wcmljZX1+JHtzb3J0ZWRQcmljZVtzb3J0ZWRQcmljZS5sZW5ndGggLSAxIF0ucHJpY2V9YDtcbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgLy8g5aSE55CG6LSn5a2YXG4gICAgICAgIGNvbnN0IHNvcnRlZFN0b2NrID0geC5zdGFuZGFyZHMuZmlsdGVyKGkgPT4gaS5zdG9jayAhPT0gdW5kZWZpbmVkICYmIGkuc3RvY2sgIT09IG51bGwpLnNvcnQoKHgsIHkpID0+IHguc3RvY2sgLSB5LnN0b2NrKTtcbiAgICAgICAgLy8g5pyJ5bqT5a2Y5Z6L5Y+3XG4gICAgICAgIGlmICggc29ydGVkU3RvY2subGVuZ3RoID09PSAxICkge1xuICAgICAgICAgICAgc3RvY2sgPSBgJHtzb3J0ZWRTdG9ja1swXS5zdG9ja31gO1xuICAgICAgICB9IGVsc2UgaWYgKCBzb3J0ZWRTdG9jay5sZW5ndGggPiAxICkge1xuICAgICAgICAgIGlmICggc29ydGVkU3RvY2tbMF0uc3RvY2sgPT09IHNvcnRlZFN0b2NrW3NvcnRlZFN0b2NrLmxlbmd0aCAtIDFdLnN0b2NrICkge1xuICAgICAgICAgICAgICBzdG9jayA9IGAke3NvcnRlZFN0b2NrWzBdLnN0b2NrfWA7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgc3RvY2sgPSBgJHtzb3J0ZWRTdG9ja1swXS5zdG9ja31+JHtzb3J0ZWRTdG9ja1tzb3J0ZWRTdG9jay5sZW5ndGggLSAxXS5zdG9ja31gO1xuICAgICAgICAgIH1cbiAgICAgICAgfSAgICBcbiAgICAgICAgXG4gICAgICAgIC8vIOaLv+WIsOWei+WPt+WIl+ihqOeahOacgOS9juS7t+agvO+8jOWQq+Wboui0reS7t1xuICAgICAgICBsZXQgcHJpY2VMaXN0OiBudW1iZXJbXSA9IFsgXTtcbiAgICAgICAgeC5zdGFuZGFyZHMubWFwKCBzID0+IHtcbiAgICAgICAgICAgIGlmICggIXguZ3JvdXBQcmljZSApIHtcbiAgICAgICAgICAgICAgICBwcmljZUxpc3QucHVzaCggeC5wcmljZSApXG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHByaWNlTGlzdC5wdXNoKCB4Lmdyb3VwUHJpY2UgPCB4LnByaWNlID9cbiAgICAgICAgICAgICAgICAgICAgeC5ncm91cFByaWNlIDpcbiAgICAgICAgICAgICAgICAgICAgeC5wcmljZVxuICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIHByaWNlTGlzdCA9IHByaWNlTGlzdC5zb3J0KCggeCwgeSApID0+IHggLSB5ICk7XG4gICAgICAgIGxvd2VzdF9wcmljZSA9IHByaWNlTGlzdFsgMCBdO1xuICAgICAgICBcbiAgICB9XG5cbiAgICAvLyDlpITnkIblt67ku7dcbiAgICBpZiAoIHguc3RhbmRhcmRzLmxlbmd0aCA9PT0gMCApIHtcbiAgICAgICAgLy8g5pyJ5Zui6LSt55qEXG4gICAgICAgIGlmICggeC5ncm91cFByaWNlICE9PSBudWxsICYmIHguZ3JvdXBQcmljZSAhPT0gdW5kZWZpbmVkICkge1xuICAgICAgICAgICAgIHByaWNlR2FwID0geC5wcmljZSAtIHguZ3JvdXBQcmljZTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHByaWNlR2FwID0gMDtcbiAgICAgICAgfVxuICAgIC8vIOacieWei+WPt1xuICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbnN0IGdyb3VwUHJpY2UgPSB4LnN0YW5kYXJkcy5maWx0ZXIoIHggPT4geC5ncm91cFByaWNlICE9PSBudWxsICYmIHguZ3JvdXBQcmljZSAhPT0gdW5kZWZpbmVkICk7XG4gICAgICAgIC8vIOWei+WPt+mHjOmdouacieWboui0reeahFxuICAgICAgICBpZiAoIGdyb3VwUHJpY2UubGVuZ3RoID4gMCApIHtcbiAgICAgICAgICAgIGNvbnN0IHNvcnRlZEdyb3VwUHJpY2UgPSBncm91cFByaWNlLnNvcnQoKCB4LCB5ICkgPT4gKCggeC5ncm91cFByaWNlIC0geC5wcmljZSApIC0gKCB5Lmdyb3VwUHJpY2UgLSB5LnByaWNlICkpKTtcbiAgICAgICAgICAgIGlmICgoIHNvcnRlZEdyb3VwUHJpY2VbMF0uZ3JvdXBQcmljZSAtIHNvcnRlZEdyb3VwUHJpY2VbMF0ucHJpY2UgKSA9PT1cbiAgICAgICAgICAgICAgICAoIHNvcnRlZEdyb3VwUHJpY2VbIHNvcnRlZEdyb3VwUHJpY2UubGVuZ3RoIC0gMSBdLmdyb3VwUHJpY2UgLSBzb3J0ZWRHcm91cFByaWNlWyBzb3J0ZWRHcm91cFByaWNlLmxlbmd0aCAtIDEgXS5wcmljZSApKSB7XG4gICAgICAgICAgICAgICAgcHJpY2VHYXAgPSAoIHNvcnRlZEdyb3VwUHJpY2VbMF0ucHJpY2UgLSBzb3J0ZWRHcm91cFByaWNlWzBdLmdyb3VwUHJpY2UgKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcHJpY2VHYXAgPSBgJHtzb3J0ZWRHcm91cFByaWNlWyBzb3J0ZWRHcm91cFByaWNlLmxlbmd0aCAtIDEgXS5wcmljZSAtIHNvcnRlZEdyb3VwUHJpY2VbIHNvcnRlZEdyb3VwUHJpY2UubGVuZ3RoIC0gMSBdLmdyb3VwUHJpY2V9fiR7c29ydGVkR3JvdXBQcmljZVswXS5wcmljZSAtIHNvcnRlZEdyb3VwUHJpY2VbMF0uZ3JvdXBQcmljZX1gO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcHJpY2VHYXAgPSAwO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIE9iamVjdC5hc3NpZ24oeyB9LCB4LCB7XG4gICAgICAgIC8vIOW6k+WtmOWMuumXtFxuICAgICAgICBzdG9jayQ6IHN0b2NrLFxuICAgICAgICAvLyDku7fmoLzljLrpl7RcbiAgICAgICAgcHJpY2UkOiBwcmljZSxcbiAgICAgICAgLy8g5beu5Lu3XG4gICAgICAgIHByaWNlR2FwLFxuICAgICAgICAvLyDmnIDkvY7ku7fmoLzvvIjlkKvlm6LotK3ku7fvvIlcbiAgICAgICAgbG93ZXN0X3ByaWNlJDogbG93ZXN0X3ByaWNlXG4gICAgfSlcblxufTtcblxuZXhwb3J0IHtcbiAgICBkZWxheWVyaW5nR29vZFxufSJdfQ==