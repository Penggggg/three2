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
        active: 1,
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
        },
        /** 加载更多 */
        canLoadMore: true,
        /** 列表 */
        list: [ ],
        /** 上下架选项 */
        closeOpts: [
            {
                label: '已下架',
                value: true
            }, {
                label: '上架中',
                value: false
            }
        ],
        /** 当前选中的活动单元 */
        currentTarget: null
    },

    /** 设置computed */
    runComputed( ) {
        computed( this, {

            // 创建时候的表单数据
            meta( ) {
                const { currentTarget } = this.data;
                const now = new Date( );
                const year = now.getFullYear( );
                const month = now.getMonth( ) + 1;
                const date = now.getDate( );

                const ts2CN = ts => {
                    const time = new Date( Number( ts ));
                    const y = time.getFullYear( );
                    const m = time.getMonth( ) + 1;
                    const d = time.getDate( );
                    return `${y}/${m}/${d}`;
                }
    
                const meta = [
                    {
                        key: 'ac_price',
                        label: '活动价',
                        type: 'number',
                        placeholder: '请输入商品活动价',
                        value: undefined,
                        rules: [{
                          validate: val => !!val && !!String( val ).trim( ),
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
                            validate: val => !!val && !!String( val ).trim( ),
                            message: '商品活动价不能为空'
                          }, {
                              validate: val => Number( val ) > 0,
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
                    }
                ];
                // , {
                //     key: 'stock',
                //     label: '活动限量',
                //     type: 'number',
                //     placeholder: '无限制，则不填写',
                //     value: undefined,
                //     rules: [

                //     ]
                // }
                return meta;
            },

            // 列表数据
            list$( ) {
                const { list } = this.data;
                return list.map( x => {
                    const { detail, endTime } = x;

                    const ts2CN = ts => {
                        const time = new Date( Number( ts ));
                        const y = time.getFullYear( );
                        const m = time.getMonth( ) + 1;
                        const d = time.getDate( );
                        return `${y}/${m}/${d}`;
                    }

                    let temp = Object.assign({ }, x, {
                        time$: ts2CN( endTime )
                    });

                    if ( detail.currentStandard ) {
                        temp = Object.assign({ }, temp, {
                            img$: detail.currentStandard.img
                        })
                    }  else {
                        temp = Object.assign({ }, temp, {
                            img$: detail.img[ 0 ]
                        })
                    }

                    return temp;
                });
            }
        })
    },

    /** 拉取列表 */
    fetchList( ) {
        const { active, pagenation, canLoadMore } = this.data;
        const { page, totalPage } = pagenation;

        if ( !canLoadMore ) {
            return;
        }

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
                const { status, data } = res;
                if ( status !== 200 ) { return; }

                const { list, pagenation } = data;
                this.setData({
                    list,
                    canLoadMore: totalPage > page + 1
                })
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
        const { current, currentTarget } = this.data;
        const form1 = this.selectComponent('#form1');
        const r1 = form1.getData( );

        if ( !r1.result ) {
            return wx.showToast({
                icon: 'none',
                title: '请完善表单信息',
            });
        }

        /** 这里是编辑 */
        if ( !!currentTarget ) {
            return this.onEdit( Object.assign({ }, currentTarget, r1.data ));
        }
        
        /** 这里是创建 */
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
                }
            }
        })
        
    },

    /** 编辑商品活动 */
    onEdit( temp ) {
        const { _id, ac_groupPrice, ac_price, endTime } = temp;
        const list = [ ...this.data.list ];

        const updateBody = {
            ac_price,
            ac_groupPrice,
            endTime: new Date(`${endTime} 23:59:59`).getTime( )
        }

        wx.showModal({
            title: '提示',
            content: `确定要更新此商品吗？`,
            success: res => {
                if ( res.confirm ) {
                    http({
                        data: Object.assign({ }, updateBody, {
                            acid: _id,
                        }),
                        loadingMsg: '更新中...',
                        url: 'activity_update-good-discount',
                        success: res => {
                            if ( res.status === 200 ) {

                                wx.showToast({
                                    title: '更新成功！'
                                });

                                const target = list.find( x => x._id === _id );
                                const existedIndex = list.findIndex( x => x._id === _id );
                                list.splice( existedIndex, 1, Object.assign({ }, target, updateBody ));

                                this.setData({
                                    list,
                                    showInfo: false,
                                    currentTarget: null
                                });
                            }
                        }
                    })
                }
            }
        });
       
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
            canLoadMore: true,
            pagenation: {
                total: 0,
                pageSize: 0,
                page: 0,
                totalPage: 0
            }
        });
        this.fetchList( );
    },

    /** 去商品详情 */
    goDetail({ currentTarget }) {
        const { pid } = currentTarget.dataset;
        wx.navigateTo({
            url: `/pages/goods-detail/index?id=${pid}`
        });
    },

    /** 点击准备编辑 */
    onTapItem({ currentTarget }) {
        const { data } = currentTarget.dataset;
        this.setData({
            showInfo: true,
            currentTarget: Object.assign({ }, data )
        });

        const ts2CN = ts => {
            const time = new Date( Number( ts ));
            const y = time.getFullYear( );
            const m = time.getMonth( ) + 1;
            const d = time.getDate( );
            return `${y}/${m}/${d}`;
        }

        setTimeout(( ) => {
            const form1 = this.selectComponent('#form1');
            const { ac_groupPrice, ac_price, endTime } = data;
            form1 && form1.set({
                ac_groupPrice,
                ac_price,
                endTime: ts2CN( endTime )
            })
        }, 16 );
    },

    /** 文字选项 ，开启关闭上下架*/
    onSwitch( e ) {
        const { value, sign } = e.detail;
        const list = [ ...this.data.list ];
        wx.showModal({
            title: '提示',
            content: `确定要${ value ? '下架' : '上架' }此商品活动吗？`,
            success: res => {
                if ( res.confirm ) {
                    http({
                        data: {
                            acid: sign,
                            isClosed: value
                        },
                        loadingMsg: value ? '下架中...' : '上架中...',
                        url: 'activity_update-good-discount',
                        success: res => {
                            if ( res.status === 200 ) {
                                wx.showToast({
                                    title: value ? '下架成功！' : '上架成功！'
                                });
                                const target = list.find( x => x._id === sign );
                                const existedIndex = list.findIndex( x => x._id === sign );
                                list.splice( existedIndex, 1, Object.assign({ }, target, {
                                    isClosed: value
                                }));
                                this.setData({
                                    list
                                });
                            }
                        }
                    })
                }
            }
        });
    },  

    /** 点击删除一个商品活动 */
    onDelete({ currentTarget }) {
        const that = this;
        const list = [ ...this.data.list ];
        const { acid } = currentTarget.dataset;
        wx.showModal({
            title: '提示',
            content: '确定要删除此商品活动吗？',
            success: res => {
                if ( res.confirm ) {
                    http({
                        data: {
                            acid
                        },
                        loadingMsg: '删除中...',
                        url: 'activity_delete-good-discount',
                        success: res => {
                            if ( res.status === 200 ) {
                                const existedIndex = list.findIndex( x => x._id === acid );
                                list.splice( existedIndex, 1 );
                                that.setData({
                                    list
                                });
                                wx.showToast({
                                    title: '删除成功！'
                                })
                            }
                        }
                    })
                } else if ( res.cancel ) {
                    
                }
            }
        });
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