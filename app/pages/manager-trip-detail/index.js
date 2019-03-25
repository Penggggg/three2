"use strict";
Page({
    data: {
        id: ''
    },
    onLoad: function (options) {
        wx.hideShareMenu();
        if (!options.id) {
            return;
        }
        this.setData({
            id: options.id
        });
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQ0EsSUFBSSxDQUFDO0lBS0QsSUFBSSxFQUFFO1FBQ0osRUFBRSxFQUFFLEVBQUU7S0FDUDtJQUtELE1BQU0sRUFBRSxVQUFVLE9BQU87UUFDdkIsRUFBRSxDQUFDLGFBQWEsRUFBRyxDQUFDO1FBQ3BCLElBQUssQ0FBQyxPQUFRLENBQUMsRUFBRSxFQUFHO1lBQUUsT0FBTztTQUFFO1FBQy9CLElBQUksQ0FBQyxPQUFRLENBQUM7WUFDWixFQUFFLEVBQUUsT0FBUSxDQUFDLEVBQUU7U0FDaEIsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztJQUtELE9BQU8sRUFBRTtJQUVULENBQUM7SUFLRCxNQUFNLEVBQUU7SUFFUixDQUFDO0lBS0QsTUFBTSxFQUFFO0lBRVIsQ0FBQztJQUtELFFBQVEsRUFBRTtJQUVWLENBQUM7SUFLRCxpQkFBaUIsRUFBRTtJQUVuQixDQUFDO0lBS0QsYUFBYSxFQUFFO0lBRWYsQ0FBQztDQVFKLENBQUMsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbIi8vIGFwcC9wYWdlcy9tYW5hZ2VyLWdvb2RzLWRldGFpbC9pbmRleC5qc1xuUGFnZSh7XG5cbiAgICAvKipcbiAgICAgKiDpobXpnaLnmoTliJ3lp4vmlbDmja5cbiAgICAgKi9cbiAgICBkYXRhOiB7XG4gICAgICBpZDogJydcbiAgICB9LFxuICBcbiAgICAvKipcbiAgICAgKiDnlJ/lkb3lkajmnJ/lh73mlbAtLeebkeWQrOmhtemdouWKoOi9vVxuICAgICAqL1xuICAgIG9uTG9hZDogZnVuY3Rpb24gKG9wdGlvbnMpIHtcbiAgICAgIHd4LmhpZGVTaGFyZU1lbnUoICk7XG4gICAgICBpZiAoICFvcHRpb25zIS5pZCApIHsgcmV0dXJuOyB9XG4gICAgICB0aGlzLnNldERhdGEhKHtcbiAgICAgICAgaWQ6IG9wdGlvbnMhLmlkXG4gICAgICB9KTtcbiAgICB9LFxuICBcbiAgICAvKipcbiAgICAgKiDnlJ/lkb3lkajmnJ/lh73mlbAtLeebkeWQrOmhtemdouWIneasoea4suafk+WujOaIkFxuICAgICAqL1xuICAgIG9uUmVhZHk6IGZ1bmN0aW9uICgpIHtcbiAgXG4gICAgfSxcbiAgXG4gICAgLyoqXG4gICAgICog55Sf5ZG95ZGo5pyf5Ye95pWwLS3nm5HlkKzpobXpnaLmmL7npLpcbiAgICAgKi9cbiAgICBvblNob3c6IGZ1bmN0aW9uICgpIHtcbiAgXG4gICAgfSxcbiAgXG4gICAgLyoqXG4gICAgICog55Sf5ZG95ZGo5pyf5Ye95pWwLS3nm5HlkKzpobXpnaLpmpDol49cbiAgICAgKi9cbiAgICBvbkhpZGU6IGZ1bmN0aW9uICgpIHtcbiAgXG4gICAgfSxcbiAgXG4gICAgLyoqXG4gICAgICog55Sf5ZG95ZGo5pyf5Ye95pWwLS3nm5HlkKzpobXpnaLljbjovb1cbiAgICAgKi9cbiAgICBvblVubG9hZDogZnVuY3Rpb24gKCkge1xuICBcbiAgICB9LFxuICBcbiAgICAvKipcbiAgICAgKiDpobXpnaLnm7jlhbPkuovku7blpITnkIblh73mlbAtLeebkeWQrOeUqOaIt+S4i+aLieWKqOS9nFxuICAgICAqL1xuICAgIG9uUHVsbERvd25SZWZyZXNoOiBmdW5jdGlvbiAoKSB7XG4gIFxuICAgIH0sXG4gIFxuICAgIC8qKlxuICAgICAqIOmhtemdouS4iuaLieinpuW6leS6i+S7tueahOWkhOeQhuWHveaVsFxuICAgICAqL1xuICAgIG9uUmVhY2hCb3R0b206IGZ1bmN0aW9uICgpIHtcbiAgXG4gICAgfSxcbiAgXG4gICAgLyoqXG4gICAgICog55So5oi354K55Ye75Y+z5LiK6KeS5YiG5LqrXG4gICAgICovXG4gICAgLy8gb25TaGFyZUFwcE1lc3NhZ2U6IGZ1bmN0aW9uICgpIHtcbiAgXG4gICAgLy8gfVxufSkiXX0=