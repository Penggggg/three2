const { http } = require('../../util/http.js');
const { computed } = require('../../lib/vuefy/index.js');

Page({

    /**
     * 页面的初始数据
     */
    data: {

    },

    runComputed( ) {
        computed( this, {
            // 表单
            meta( ) {
                return [
                    {
                        key: 'psw',
                        label: '密钥',
                        type: 'input',
                        placeholder: '复制密钥到此处',
                        value: undefined,
                        rules: [{
                          validate: val => !!val,
                          message: '密钥不能为空'
                        }]
                    }, {
                        key: 'content',
                        label: '提示词',
                        type: 'input',
                        placeholder: '填写自己设置的提示词',
                        value: undefined,
                        rules: [{
                          validate: val => !!val,
                          message: '提示词不能为空'
                        }]
                    }
                ]
            }
        })
    },
    
    // 提交
    submit( ) {
        const form = this.selectComponent('#form');
        const r = form.getData();

        if ( !r.result ) {
            return wx.showToast({
              icon: 'none',
              title: '请完善以上信息',
            })
        }

        http({
            data: r.data,
            url: 'common_add-auth-by-psw',
            success: res => {
                if ( res.status === 200 ) {
                    wx.showToast({
                        icon: 'none',
                        title: '创建成功！',
                    });
                    setTimeout(( ) => {
                        wx.redirectTo({
                            url: `/pages/trip-enter/index`
                        });
                    }, 300 );
                }
            }
        })

    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        wx.hideShareMenu( );
        this.runComputed( );
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})