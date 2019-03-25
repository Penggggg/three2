const { http } = require('../../util/http.js');

Page({

    /**
     * 页面的初始数据
     */
    data: {
        meta1: [{
            title: '你的微信二维码',
            desc: '增加客户信任度/拉近客户关系'
          }, {
            key: 'wx_qrcode',
            label: '微信二维码',
            type: 'img',
            max: 1,
            value: [ ],
            rules: [ ]
        }, {
            title: '客户群二维码',
            desc: '增强客户粘性/刺激消费'
        },  {
            key: 'group_qrcode',
            label: '群二维码',
            type: 'img',
            max: 2,
            value: [ ],
            rules: [ ]
        }]
    },

    /** 提交当前表单的值 */
    submit( ) {
        const form1 = this.selectComponent('#form1');
        const r1 = form1.getData( );
        
        http({
            data: r1.data,
            url: 'common_wxinfo-edit',
            loadMsg: '更新中...',
            success: res => {
                if ( res.status === 200 ) {
                    wx.showToast({
                        title: '上传成功！'
                    });
                }
            }
        })
    },

    /** 拉取已有二维码信息 */
    fetchQrCode( ) {
        http({
            url: `common_wxinfo`,
            success: res => {
   
                if ( res.status !== 200 ) { return; }
    
                const keys = ['wx_qrcode', 'group_qrcode'];
                const formMeta = this.data.meta1.map( x => Object.assign({ }, x ));

                keys.map( key => {
                    if ( res.data[ key ]) {
                        const targetIndex = this.data.meta1.findIndex( x => x.key === key );
                        const target =  this.data.meta1[ targetIndex ];
                        if ( targetIndex !== -1 ) {
                            const temp = Object.assign({ }, target, {
                                value: res.data[ key ]
                            });
                            formMeta.splice( targetIndex, 1, temp );
                        }
                    }
                });

                this.setData({
                    meta1: formMeta
                })
            }
        })
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        wx.hideShareMenu( );
        this.fetchQrCode( );
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