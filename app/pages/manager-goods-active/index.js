const { http } = require('../../util/http.js');
const { computed } = require('../../lib/vuefy/index.js');

Page({

    /**
     * 页面的初始数据
     */
    data: {
        /** 展示商品选择 */
        showProduct: false,
        /** 当前的商品及其型号列表 */
        current: null,
        /** 展示 */
        showInfo: false,
        /** tab: 0 | 1 */
        active: 0,
        /** tab数组 */
        actives: [
            {
                label: '已上架',
                value: 0
            }, {
                label: '全部',
                value: 1
            }
        ],
        /** 分页数据 */
        pagenation: {
            total: 0,
            pageSize: 0,
            page: 0,
            totalPage: 0
        }
    },

    /** 设置computed */
    runComputed( ) {
        computed( this, {
            // 创建时候的表单数据
            meta( ) {
                const now = new Date( );
                const year = now.getFullYear( );
                const month = now.getMonth( ) + 1;
                const date = now.getDate( );
    
                const meta = [
                    {
                        key: 'ac_price',
                        label: '活动价',
                        type: 'number',
                        placeholder: '请输入商品活动价',
                        value: undefined,
                        rules: [{
                          validate: val => !!val && !!val.trim( ),
                          message: '商品活动价不能为空'
                        }, {
                            validate: val => Number( val ) > 0,
                            message: '价格不能为0'
                        }]
                    }, {
                        key: 'ac_groupPrice',
                        label: '活动团购价',
                        type: 'number',
                        placeholder: '无团购价，则不填写',
                        value: undefined,
                        rules: [{
                            validate: val => (!!val && !!val.trim( )) ? Number( val ) > 0 : true,
                            message: '团购价不能为0'
                        }]
                    }, {
                        key: 'endTime',
                        label: '结束时间',
                        type: 'date',
                        value: undefined,
                        rules: [{
                          validate: val => !!val,
                          message: '结束时间不能为空'
                        }]
                    }, {
                        key: 'stock',
                        label: '活动限量',
                        type: 'number',
                        placeholder: '无限制，则不填写',
                        value: undefined,
                        rules: [

                        ]
                    }
                ];
                return meta;
            }
        })
    },

    /** 拉取列表 */
    fetchList( ) {
        const { active, pagenation } = this.data;
        const { page } = pagenation;

        let temp = {
            page: page + 1
        };

        if ( active === 0 ) {
            temp = Object.assign({ }, temp, {
                isClosed: false
            });
        }

        http({
            data: temp,
            url: `activity_good-discount-list`,
            success: res => {

            }
        })
    },

    /** 展开关闭产品选择 */
    toggleProduct( ) {
        const { showProduct } = this.data;
        this.setData({
            showProduct: showProduct ? false : true
        });
    },

    /** 选择产品/型号 */
    onConfirmProduct( e ) {
        const { detail } = e.detail;
        this.setData({
            current: detail
        });

        let temp;
        const pid = detail._id;
        if ( detail.standards.length === 0 ) {
            temp = [ Object.assign({ }, {
                pid,
                title: detail.title
            })];
        } else {
            temp = detail.standards.map( s => Object.assign({ }, {
                pid,
                sid: s._id,
                title: s.name
            }));
        }

        http({
            data: {
                list: temp
            },
            url: 'activity_check-good-discount',
            success: res => {
                if ( res.status === 200 ) {
                    this.selectComponent('#selector1').closeStander( );
                    this.setData({
                        showInfo: true
                    });
                }
            }
        })

        
    },

    /** 关闭/展开资费框 */
    toggleInfo( ) {
        const { showInfo } = this.data;
        this.setData({
            showInfo: showInfo ? false : true
        })
    },

    /** 确认资费 */
    onConfirmInfo( ) {
        const { current } = this.data;
        const form1 = this.selectComponent('#form1');
        const r1 = form1.getData( );

        if ( !r1.result ) {
            return wx.showToast({
                icon: 'none',
                title: '请完善表单信息',
            });
        }

        let temp;
        const pid = current._id;
        const title = current.title;
        const { ac_price, ac_groupPrice, endTime, stock } = r1.data;

        if ( current.standards.length === 0 ) {
            temp = [ Object.assign({ }, r1.data, {
                pid,
                title,
                endTime: new Date(`${endTime} 23:59:59`).getTime( )
            })];
        } else {
            temp = current.standards.map( s => Object.assign({ }, r1.data, {
                pid,
                sid: s._id,
                title: s.name,
                endTime: new Date(`${endTime} 23:59:59`).getTime( )
            }));
        }

        this.onCreate( temp );
    },

    /** 创建商品活动 */
    onCreate( temp ) {
        wx.showModal({
            title: '提示',
            content: '确定要创建此商品活动吗？',
            success: res => {
                if ( res.confirm ) {
                    http({
                        data: {
                            list: temp
                        },
                        loadingMsg: '创建中...',
                        url: `activity_create-good-discount`,
                        success: res => {
                            const { status } = res;
                            if ( status === 200 ) {
                                // 初始化
                                this.setData({
                                    current: null,
                                    showInfo: false
                                });
                                wx.showToast({
                                    title: '创建成功！'
                                });
                                this.reloadList( );
                            }
                        }
                    });
                } else if ( res.cancel ) {
                    // console.log('用户点击取消')
                }
            }
        })
        
    },

    /** 点击切换tab */
    onTabActive({ currentTarget }) {
        const { active } = currentTarget.dataset;

        if ( active === this.data.active ) { return; }

        this.setData({
            active
        });
        this.reloadList( );
    },

    /** 重新拉取列表 */
    reloadList( ) {
        this.setData({
            pagenation: {
                total: 0,
                pageSize: 0,
                page: 0,
                totalPage: 0
            }
        });
        this.fetchList( );
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.runComputed( );
        this.fetchList( );
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