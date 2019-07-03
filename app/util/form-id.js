"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var http_1 = require("./http");
var createFormId = function (formid) {
    if (!formid) {
        return;
    }
    return http_1.http({
        data: {
            formid: formid
        },
        loadingMsg: 'none',
        url: 'common_create-formid',
    });
};
exports.createFormId = createFormId;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZm9ybS1pZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImZvcm0taWQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSwrQkFBOEI7QUFFOUIsSUFBTSxZQUFZLEdBQUcsVUFBQSxNQUFNO0lBQ3ZCLElBQUssQ0FBQyxNQUFNLEVBQUc7UUFBRSxPQUFPO0tBQUU7SUFDMUIsT0FBTyxXQUFJLENBQUM7UUFDUixJQUFJLEVBQUU7WUFDRixNQUFNLFFBQUE7U0FDVDtRQUNELFVBQVUsRUFBRSxNQUFNO1FBQ2xCLEdBQUcsRUFBRSxzQkFBc0I7S0FDOUIsQ0FBQyxDQUFBO0FBQ04sQ0FBQyxDQUFDO0FBRU8sb0NBQVkiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBodHRwIH0gZnJvbSAnLi9odHRwJztcblxuY29uc3QgY3JlYXRlRm9ybUlkID0gZm9ybWlkID0+IHtcbiAgICBpZiAoICFmb3JtaWQgKSB7IHJldHVybjsgfVxuICAgIHJldHVybiBodHRwKHtcbiAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgZm9ybWlkXG4gICAgICAgIH0sXG4gICAgICAgIGxvYWRpbmdNc2c6ICdub25lJyxcbiAgICAgICAgdXJsOiAnY29tbW9uX2NyZWF0ZS1mb3JtaWQnLFxuICAgIH0pXG59O1xuXG5leHBvcnQgeyBjcmVhdGVGb3JtSWQgfTsiXX0=