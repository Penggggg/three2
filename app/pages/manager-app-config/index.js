const { http } = require('../../util/http.js');
const { computed } = require('../../lib/vuefy/index.js');

Page({

    /**
     * 页面的初始数据
     */
    data: {
        config: null
    },

    /** 设置computed */
    runComputed( ) {
        computed( this, {

            meta$: function( ) {
                const { config } = this.data;
                const meta = [{
                    title: '保健品',
                    desc: '相关设置'
                  }, {
                    key: 'app-bjp-visible',
                    label: '保健品商品是否可见',
                    type: 'switch',
                    max: 1,
                    rules: [ ],
                    shadow: true,
                    value: config ? config['app-bjp-visible'] : false
                }];

                return meta;
            }
        });
    },

    /**
     * 拉取应用配置
     */
    fetchConf( ) {
        http({
            url: `common_check-app-config`,
            success: res => {
                if ( res.status !== 200 ) { return; }
                this.setData({
                    config: res.data
                });
            }
        })
    },

    /** 
     * 提交配置
     */
    updateConf( ) {
        const form = this.selectComponent('#form');
        const r = form.getData( );

        if ( !r.result ) {
            return wx.showToast({
              icon: 'none',
              title: '请完善设置信息',
            });
        }

        wx.showModal({
            title: '提示',
            content: '确认更新配置吗?',
            success: res => {
                if ( !res.confirm )  { return; }
                http({
                    data: {
                        configs: r.data,
                    },
                    url: `common_update-app-config`,
                    success: res => {
                        if ( res.status !== 200 ) { return; }
                        wx.showToast({
                            title: '更新成功',
                        });
                        
                    }
                })
            }
        });


    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function ( options ) {
        this.runComputed( );
        this.fetchConf( )
        wx.hideShareMenu( );
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function ( ) {
        
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