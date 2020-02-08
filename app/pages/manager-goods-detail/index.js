"use strict";
Page({
    data: {
        id: '',
        spid: ''
    },
    onLoad: function (options) {
        var id = options.id || '';
        var spid = options.spid || '';
        this.setData({
            id: id,
            spid: spid
        });
        wx.hideShareMenu({});
    },
    onReady: function () {
    },
    onShow: function () {
    },
    onHide: function () {
    },
    onUnload: function () {
    },
    onPullDownRefresh: function () {
    },
    onReachBottom: function () {
    },
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQ0EsSUFBSSxDQUFDO0lBS0QsSUFBSSxFQUFFO1FBR0YsRUFBRSxFQUFFLEVBQUU7UUFHTixJQUFJLEVBQUUsRUFBRTtLQUNYO0lBS0QsTUFBTSxFQUFFLFVBQVUsT0FBTztRQUNyQixJQUFNLEVBQUUsR0FBRyxPQUFRLENBQUMsRUFBRSxJQUFJLEVBQUUsQ0FBQztRQUM3QixJQUFNLElBQUksR0FBRyxPQUFRLENBQUMsSUFBSSxJQUFJLEVBQUUsQ0FBQTtRQUdoQyxJQUFJLENBQUMsT0FBUSxDQUFDO1lBQ1YsRUFBRSxJQUFBO1lBQ0YsSUFBSSxNQUFBO1NBQ1AsQ0FBQyxDQUFDO1FBQ0gsRUFBRSxDQUFDLGFBQWEsQ0FBQyxFQUFHLENBQUMsQ0FBQztJQUMxQixDQUFDO0lBS0QsT0FBTyxFQUFFO0lBRVQsQ0FBQztJQUtELE1BQU0sRUFBRTtJQUVSLENBQUM7SUFLRCxNQUFNLEVBQUU7SUFFUixDQUFDO0lBS0QsUUFBUSxFQUFFO0lBRVYsQ0FBQztJQUtELGlCQUFpQixFQUFFO0lBRW5CLENBQUM7SUFLRCxhQUFhLEVBQUU7SUFFZixDQUFDO0NBUUosQ0FBQyxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiXG5QYWdlKHtcblxuICAgIC8qKlxuICAgICAqIOmhtemdoueahOWIneWni+aVsOaNrlxuICAgICAqL1xuICAgIGRhdGE6IHtcblxuICAgICAgICAvLyDllYblk4FpZFxuICAgICAgICBpZDogJycsXG5cbiAgICAgICAgLy8g5Li75o6o5ZWG5ZOBXG4gICAgICAgIHNwaWQ6ICcnXG4gICAgfSxcbiAgXG4gICAgLyoqXG4gICAgICog55Sf5ZG95ZGo5pyf5Ye95pWwLS3nm5HlkKzpobXpnaLliqDovb1cbiAgICAgKi9cbiAgICBvbkxvYWQ6IGZ1bmN0aW9uIChvcHRpb25zKSB7XG4gICAgICAgIGNvbnN0IGlkID0gb3B0aW9ucyEuaWQgfHwgJyc7IFxuICAgICAgICBjb25zdCBzcGlkID0gb3B0aW9ucyEuc3BpZCB8fCAnJ1xuICAgICAgICAvLyA3NGIxNDBiNDVlM2MwZjJjMGI0NDExYjEzNTNiMzJhOFxuXG4gICAgICAgIHRoaXMuc2V0RGF0YSEoe1xuICAgICAgICAgICAgaWQsXG4gICAgICAgICAgICBzcGlkXG4gICAgICAgIH0pO1xuICAgICAgICB3eC5oaWRlU2hhcmVNZW51KHsgfSk7XG4gICAgfSxcbiAgXG4gICAgLyoqXG4gICAgICog55Sf5ZG95ZGo5pyf5Ye95pWwLS3nm5HlkKzpobXpnaLliJ3mrKHmuLLmn5PlrozmiJBcbiAgICAgKi9cbiAgICBvblJlYWR5OiBmdW5jdGlvbiAoKSB7XG4gIFxuICAgIH0sXG4gIFxuICAgIC8qKlxuICAgICAqIOeUn+WRveWRqOacn+WHveaVsC0t55uR5ZCs6aG16Z2i5pi+56S6XG4gICAgICovXG4gICAgb25TaG93OiBmdW5jdGlvbiAoKSB7XG4gIFxuICAgIH0sXG4gIFxuICAgIC8qKlxuICAgICAqIOeUn+WRveWRqOacn+WHveaVsC0t55uR5ZCs6aG16Z2i6ZqQ6JePXG4gICAgICovXG4gICAgb25IaWRlOiBmdW5jdGlvbiAoKSB7XG4gIFxuICAgIH0sXG4gIFxuICAgIC8qKlxuICAgICAqIOeUn+WRveWRqOacn+WHveaVsC0t55uR5ZCs6aG16Z2i5Y246L29XG4gICAgICovXG4gICAgb25VbmxvYWQ6IGZ1bmN0aW9uICgpIHtcbiAgXG4gICAgfSxcbiAgXG4gICAgLyoqXG4gICAgICog6aG16Z2i55u45YWz5LqL5Lu25aSE55CG5Ye95pWwLS3nm5HlkKznlKjmiLfkuIvmi4nliqjkvZxcbiAgICAgKi9cbiAgICBvblB1bGxEb3duUmVmcmVzaDogZnVuY3Rpb24gKCkge1xuICBcbiAgICB9LFxuICBcbiAgICAvKipcbiAgICAgKiDpobXpnaLkuIrmi4nop6blupXkuovku7bnmoTlpITnkIblh73mlbBcbiAgICAgKi9cbiAgICBvblJlYWNoQm90dG9tOiBmdW5jdGlvbiAoKSB7XG4gIFxuICAgIH0sXG4gIFxuICAgIC8qKlxuICAgICAqIOeUqOaIt+eCueWHu+WPs+S4iuinkuWIhuS6q1xuICAgICAqL1xuICAgIC8vIG9uU2hhcmVBcHBNZXNzYWdlOiBmdW5jdGlvbiAoKSB7XG4gIFxuICAgIC8vIH1cbn0pIl19