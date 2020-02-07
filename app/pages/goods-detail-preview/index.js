const { http } = require('../../util/http.js');
const { delayeringGood } = require('../../util/goods.js');
const { computed } = require('../../lib/vuefy/index.js');
const { navTo } = require('../../util/route.js');

const app = getApp( );

Page({

    /**
     * 页面的初始数据
     */
    data: {

        // 主推商品id
        spid: '',

        // 商品详情
        detail: null,

        ipName: '',

        ipAvatar: '',

        // 能否分享
        canIntegrayShare: true,

        // 分享比例
        pushIntegralRate: 0,

        // 分享赚钱tips
        showShareGetMoney: false,

        // 拼团提示
        showPinGoods: 'hide'

    },

    /** 设置computed */
    runComputed( ) {
        computed( this, {

            // 详情
            detail$: function( ) {
                const { detail } = this.data;
                const r = delayeringGood( detail );
                return r;
            },

            // 积分区间
            integral$: function( ) {
                const { detail, pushIntegralRate } = this.data;
                if ( !detail ) { 
                    return '';
                }
                const result = delayeringGood( detail, pushIntegralRate );
                return result.integral$;
            },

            // 商品详情 - 分行显示
            detailIntro$: function( ) {
                const { detail } = this.data;
                if ( !detail || ( !!detail && !detail.detail )) {
                    return [ ];
                } else {
                    return detail.detail.split('\n').filter( x => !!x );
                }
            },

            // 拼团列表
            pin$: function( ) {
                let meta = [ ];
                const shopping = [ ];
                const activities = [ ];
                const { detail } = this.data;

                if ( !detail ) { 
                    return [ ];
                }

                const { standards, groupPrice } = detail;

                if ( standards.length > 0 ) {
                    meta = standards
                        .filter( x => !!x.groupPrice )
                        .map( x => {
                            return Object.assign({ }, x, {
                                sid: x._id,
                                canPin: !!shopping.find( s => s.sid === x._id && s.pid === x.pid )
                            })
                        });

                } else if ( !!groupPrice ) {
                    const { price, title, img, _id } = detail;
                    meta = [{
                        price,
                        pid: _id,
                        name: title,
                        groupPrice,
                        sid: undefined,
                        img: img[ 0 ],
                        canPin: !!shopping.find( s => s.pid === _id )
                    }];
                }

                // 根据活动，更改、新增拼团项目
                activities.map( ac => {
                    if ( !ac.ac_groupPrice ) { return; }
                    const pinTarget = meta.find( x => x.pid === ac.pid && x.sid === ac.sid );
                    const pinTargetIndex = meta.findIndex( x => x.pid === ac.pid && x.sid === ac.sid );

                    // 替换
                    if ( pinTargetIndex !== -1 ) {
                        meta.splice( pinTargetIndex, 1, Object.assign({ }, pinTarget, {
                            price: ac.ac_price,
                            groupPrice: ac.ac_groupPrice
                        }));

                    // 新增
                    } else {
                        meta.push({
                            sid: ac.sid,
                            pid: ac.pid,
                            img: ac.img,
                            name: ac.title,
                            canPin: !!shopping.find( s => s.sid === ac.sid && s.pid === ac.pid ),
                            price: ac.ac_price,
                            groupPrice: ac.ac_groupPrice 
                        })
                    }
                });

                const meta2 = meta.map( x => Object.assign({ }, x, {
                    delta: Number( x.price - x.groupPrice ).toFixed( 0 )
                }));

                return meta2;
            }
        })
    },

    init( ) {
        app.watch$('editingGood', val => {
            !!val && this.setData({
                detail: val
            });
        });
        app.watch$('appConfig', val => {
            if ( !val ) { return; }
            this.setData({
                pushIntegralRate: (val || { })['push-integral-get-rate'] || 0
            });
        });
        app.watch$('appConfig', val => {
            if ( !val ) { return; }
            this.setData({
                ipName: val['ip-name'],
                ipAvatar: val['ip-avatar']
            });
        });
    },

    // 展示拼团列表
    togglePinGoods( ) {
        const { showPinGoods } = this.data;
        this.setData({
            showPinGoods: showPinGoods === 'hide' ? 'show' : 'hide'
        });
    },

    // 展示推广积分规则
    toggleShareGetMoney( ) {
        const { showShareGetMoney } = this.data;
        this.setData({
            showShareGetMoney: !showShareGetMoney
        });
    },

    /** sku某部分点击 */
    onSkuTap( e ) {
        const type = e.detail;
        if ( type === 'moneyQuestion' ) {
            this.toggleShareGetMoney( );
        }
    },

    /** 提交当前表单的值 */
    submit( ) {
        const { detail, spid } = this.data;
        if ( !detail ) { return; }

        const { _id } = detail;
    
        http({
            data: {
                ...detail,
                spid
            },
            loadingMsg: _id ? '更新中...' : '创建中..',
            errMsg: _id ? '更新失败' : '创建失败',
            url: `good_edit`,
            success: res => {
                if ( res.status !== 200 ) { return; }

                setTimeout(( ) => {
                    wx.showToast({
                        title: _id ? '更新成功' : '创建成功'
                    });
                }, 800 );

                app.setGlobalData({
                    editingGood: null
                });
  
                wx.navigateBack({
                    delta: 2
                });

            }
        });
  
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        const { spid } = options;
        this.init( );
        this.runComputed( );
        wx.hideShareMenu( );

        !!spid && this.setData({
            spid
        })
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