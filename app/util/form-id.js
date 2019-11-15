"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var http_1 = require("./http");
var createFormId = function (formid) {
    if (true || !formid) {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZm9ybS1pZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImZvcm0taWQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSwrQkFBOEI7QUFFOUIsSUFBTSxZQUFZLEdBQUcsVUFBQSxNQUFNO0lBQ3ZCLElBQUssSUFBSSxJQUFJLENBQUMsTUFBTSxFQUFHO1FBQUUsT0FBTztLQUFFO0lBQ2xDLE9BQU8sV0FBSSxDQUFDO1FBQ1IsSUFBSSxFQUFFO1lBQ0YsTUFBTSxRQUFBO1NBQ1Q7UUFDRCxVQUFVLEVBQUUsTUFBTTtRQUNsQixHQUFHLEVBQUUsc0JBQXNCO0tBQzlCLENBQUMsQ0FBQTtBQUNOLENBQUMsQ0FBQztBQUVPLG9DQUFZIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgaHR0cCB9IGZyb20gJy4vaHR0cCc7XG5cbmNvbnN0IGNyZWF0ZUZvcm1JZCA9IGZvcm1pZCA9PiB7XG4gICAgaWYgKCB0cnVlIHx8ICFmb3JtaWQgKSB7IHJldHVybjsgfVxuICAgIHJldHVybiBodHRwKHtcbiAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgZm9ybWlkXG4gICAgICAgIH0sXG4gICAgICAgIGxvYWRpbmdNc2c6ICdub25lJyxcbiAgICAgICAgdXJsOiAnY29tbW9uX2NyZWF0ZS1mb3JtaWQnLFxuICAgIH0pXG59O1xuXG5leHBvcnQgeyBjcmVhdGVGb3JtSWQgfTsiXX0=