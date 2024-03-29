const app = getApp( );
const { http } = require('../../../util/http.js');
const { navTo } = require('../../../util/route.js');

Component({

    behaviors: [require('../../../behaviores/computed/index.js')],
    /**
     * 组件的属性列表
     */
    properties: {
        // 行程id
        tid: {
            type: String,
            value: '',
            observer: 'fetchDetail'
        }
    },

    /**
     * 组件的初始数据
     * ! 发布后，部分字段已经不能被编辑
     * ! 行程开始后，所有字段不能被编辑
     */
    data: {
        // 数据字典
        dic: { },
        // 行程是否已经被关闭
        isClosed: false,
        // 展开删除推荐
        showDelete: false,
        // 展开商品选择
        showProduct: false,
        // 选择推荐商品的id列表
        selectedProductIds: [ ],
        // 选择推荐商品的列表
        selectedProducts: [ ],
        // 选择中的推荐id
        selectingPid: '',
        // 行程满减 - 门槛
        fullreduce_atleast: null,
        // 行程满减 - 减多少
        fullreduce_values: null,
        // 行程满减modal
        showFullReduce: false,
        // 行程代金券 - 门槛
        cashcoupon_atleast: null,
        // 行程代金券 - 金额
        cashcoupon_values: null,
        // 行程代金券modal
        showCashCoupon: false,
        // 邮费类型
        postage: '0',
        // 付款类型
        payment: '1',
        // 表单：邮费是否选择了满免
        postageFullFree: false,
        // 是否已发布
        published: false,
        // 能否编辑券类
        canEditCoupons: false,
        // 是否可以显示结束行程、首款按钮
        canBeEnd: false,
        // 是否有下一趟行程
        hasNextTrip: false
    },

    computed: {
        
        // 表单数据
        meta( ) {
            const now = new Date( );
            const year = now.getFullYear( );
            const month = now.getMonth( ) + 1;
            const date = now.getDate( );

            const meta = [
                {
                    title: '基本信息',
                    desc: ''
                }, {
                    key: 'title',
                    label: '行程名称',
                    type: 'input',
                    max: 50,
                    placeholder: '如：28号香港代购',
                    value: undefined,
                    rules: [{
                      validate: val => !!val,
                      message: '行程名称不能为空'
                    }]
                }, {
                    key: 'end_date',
                    label: '结束时间',
                    type: 'date',
                    start: `${year}-${String( month ).length < 2 ? '0' + month  : month}-${String( date ).length < 2 ? '0' + date  : date}`,
                    value: undefined,
                    shadow: true,
                    rules: [{
                      validate: val => !!val,
                      message: '结束时间不能为空'
                    }]
                }, {
                    title: '主推商品',
                    desc: '在首页展示'
                }
            ];
            return meta;
        },

        // 表单数据2
        meta2( ) {
            const { published, tid, canEditCoupons } = this.data;
            const meta = [
                // {
                //     title: '营销工具',
                // }, {
                //     key: 'reduce_price',
                //     label: '分享立减/元',
                //     type: 'number',
                //     placeholder: '客户分享你的代购行程后，才获得此优惠',
                //     value: undefined,
                //     disabled: !canEditCoupons && !!tid,
                //     rules: [{
                //         validate: val => !!val,
                //         message: '请设置行程立减多少元'
                //     }]
                // }
            ];
            return meta;
        },

        // 表单数据3
        meta3( ) {
            const { payment, published, tid } = this.data;
            const meta = [
                {
                    title: '其他资费',
                    desc: ''
                }, {
                    key: 'payment',
                    label: '付款类型',
                    type: 'select',
                    placeholder: '请付款类型',
                    value: payment,
                    disabled: published && !!tid,
                    options: this.data.dic['payment'] || [ ]
                }
            ];

            if ( !tid ||( !!tid && !published )) {
                meta.push({
                    key: 'published',
                    label: '立即发布',
                    type: 'switch',
                    shadow: true,
                    disabled: published && !!tid,
                    value: false
                });
            }

            return meta;
        },

        // 行程满减 文字
        fullreducePrice( ) {
            const { fullreduce_atleast, fullreduce_values } = this.data;
            if ( fullreduce_atleast && fullreduce_values ) {
                return `满${fullreduce_atleast}减${fullreduce_values}元`;
            }
            return '';
        },

        // 行程代金券 文字
        cashCouponPrice( ) {
            const { cashcoupon_values, cashcoupon_atleast } = this.data;
            if ( !cashcoupon_atleast && cashcoupon_values ) {
                return `无门槛${cashcoupon_values}元代金券`;
            } else if ( cashcoupon_atleast &&  cashcoupon_values ) {
                return `满${cashcoupon_atleast}减${cashcoupon_values}元代金券`;
            }
            return ``;
        }

    },

    /**
     * 组件的方法列表
     */
    methods: {

        /** 拉取行程详情 */
        fetchDetail( id ) {

            if ( !id ) { return; }

            this.setData({
                tid: id
            });

            http({
                data: {
                    _id: id
                },
                errMsg: '加载失败，请重试',
                loadingMsg: '加载中...',
                url: `trip_detail`,
                success: res => {
                    const { status, data } = res;
                    if ( status !== 200 ) { return; }

                    const { title, destination, start_date, end_date, cashcoupon_atleast, isClosed,
                        cashcoupon_values, postagefree_atleast, reduce_price, fullreduce_atleast, canEditCoupons,
                        fullreduce_values, postage, payment, published, selectedProductIds, selectedProducts } = data;
                  
                        const dealDate = timeStamp => {
                            const d = new Date( timeStamp );
                            const year = d.getFullYear( );
                            const month = d.getMonth( ) + 1;
                            const date = d.getDate( );
                            return `${year}-${String( month ).length > 1 ? month : '0' + month}-${String( date ).length > 1 ? date : '0' + date}`;
                        }
    
                        const form1 = this.selectComponent('#form1');
                        const form2 = this.selectComponent('#form2');
                        const form3 = this.selectComponent('#form3');
    
                        form1 && form1.set({
                            title,
                            destination,
                            end_date: dealDate( end_date ),
                            // start_date: dealDate( start_date )
                        });
    
                        form2 && form2.set({
                            // reduce_price
                        });
    
                        // form3 && form3.set({
                        //     postage,
                        //     payment,
                        //     published,
                        //     postagefree_atleast
                        // });
    
                        this.setData({
                            published,
                            isClosed,
                            canEditCoupons,
                            selectedProducts: selectedProducts || [ ],
                            selectedProductIds: selectedProductIds || [ ],
                            cashcoupon_atleast: cashcoupon_atleast || null,
                            cashcoupon_values: cashcoupon_values || null,
                            fullreduce_atleast: fullreduce_atleast || null,
                            fullreduce_values: fullreduce_values || null,
                            canBeEnd: !isClosed &&  end_date !== new Date( ).getTime( )
                        });
                        
                }
            });
 
        },

        /** 拉取数据字典 */
        fetchDic( ) {
            http({
                data: {
                  dicName: 'payment,postage',
                },
                errMsg: '加载失败，请重试',
                url: `common_dic`,
                success: res => {
                  if ( res.status !== 200 ) { return; }
                  this.setData({
                    dic: res.data
                  });
                }
            });
        },

        /** 展开/关闭商品选择 */
        onToggleProduct( ) {
            this.setData({
                showProduct: !this.data.showProduct
            });
        },

        /** 选择商品 */
        onConfirmProduct({ detail }) {
            if ( !detail ) { return; }
            const { _id } = detail;
            const product = detail.detail;
            const { selectedProductIds, selectedProducts } = this.data;
            
            // 如果未曾加入过
            if ( !selectedProductIds.find( x => x === _id )) {

                selectedProductIds.unshift( _id );
                selectedProducts.unshift( product );

                this.setData({
                    selectedProducts,
                    selectedProductIds
                });
            }

        },

        /** 展示/关闭推荐商品 */
        toggleDeleteRecommend({ currentTarget }) {
            this.setData({
                showDelete: !this.data.showDelete
            });
            if ( currentTarget.dataset.sid ) {
                this.setData({
                    selectingPid: currentTarget.dataset.sid
                });
            }
        },

        /** 确认删除推荐商品 */
        confirmDelete( ) {
            const { selectingPid, selectedProducts, selectedProductIds, showDelete } = this.data;
            const selectedProductIndex = selectedProducts.find( x => x._id === selectingPid );
            const selectedProductIdIndex = selectedProductIds.find( x => x === selectingPid );

            if ( selectedProductIndex !== -1 ) {
                selectedProducts.splice( selectedProductIndex, 1 );
            }
            if ( selectedProductIdIndex !== -1 ) {
                selectedProductIds.splice( selectedProductIdIndex, 1 );
            }

            this.setData({
                showDelete: false,
                selectingPid: '',
                selectedProducts,
                selectedProductIds
            })
        },

        /** 展示/关闭行程满减 */
        toggleFullReduce( ) {
            const { canEditCoupons, tid, showFullReduce, fullreduce_values, fullreduce_atleast } = this.data;
            if ( !showFullReduce ) {
                if ( !!tid && !canEditCoupons ) {
                    return wx.showToast({
                        icon: 'none',
                        title: '进行中的行程不能修改'
                    });
                } else {
                    return this.setData({
                        showFullReduce: true
                    });
                }
            } else {
                if ( fullreduce_atleast === null || !fullreduce_values ) {
                    return wx.showToast({
                        icon: 'none',
                        title: '请填写完整'
                    })
                } else if ( fullreduce_atleast === 0 ) {
                    return wx.showToast({
                        icon: 'none',
                        title: '消费门槛不能为0元'
                    })
                }
                return this.setData({
                    showFullReduce: false
                });
            }
            
        },

        /** 关闭行程满减 */
        closeReduce( ) {
            const { showFullReduce, fullreduce_values, fullreduce_atleast } = this.data;
            this.setData({
                showFullReduce: false
            })
            if ( !fullreduce_atleast || !fullreduce_values ) {
                this.setData({
                    fullreduce_atleast: null,
                    fullreduce_values: null
                })
            }
        },

        /** 行程满减输入 */
        onInputFullReduce( e ) {
            const { value } = e.detail;
            const { type } = e.currentTarget.dataset;
            if ( type === '1' ) {
                this.setData({
                    fullreduce_atleast: Number( value )
                });
            } else {
                this.setData({
                    fullreduce_values: Number( value )
                });
            }
        },

        /** 行程代金券弹框 */
        toggleCashCoupon( ) {
            const { canEditCoupons, tid, showCashCoupon, cashcoupon_atleast, cashcoupon_values } = this.data;
            if ( !showCashCoupon ) {
                if ( !!tid && !canEditCoupons ) {
                    return wx.showToast({
                        icon: 'none',
                        title: '进行中的行程不能修改'
                    });
                } else {
                    return this.setData({
                        showCashCoupon: true
                    });
                }
            } else {
                if ( !cashcoupon_values ) {
                    return this.setData({
                        showCashCoupon: false,
                        cashcoupon_values: null,
                        cashcoupon_atleast: null,
                    });
                } else {
                    return this.setData({
                        showCashCoupon: false
                    });
                }
            }
        },

        /** 关闭代金券弹框 */
        closeCashCoupon( ) {
            return this.setData({
                showCashCoupon: false
            });
        },

        /** 代金券输入 */
        onInputCashCoupon( e ) {
            const { value } = e.detail;
            const { type } = e.currentTarget.dataset;
            if ( type === '1' ) {
                this.setData({
                    cashcoupon_atleast: Number( value )
                });
            } else {
                this.setData({
                    cashcoupon_values: Number( value )
                });
            }
        },

        onSubscribe( e ) {
            app.getSubscribe('newOrder,trip,getMoney');
        },

        /** 表单提交 */
        submit( e ) {

            this.onSubscribe( );

            const { tid, published } = this.data;
            const form1 = this.selectComponent('#form1');
            const form2 = this.selectComponent('#form2');
            const form3 = this.selectComponent('#form3');

            const r1 = form1.getData( );
            const r2 = form2.getData( );
            // const r3 = form3.getData( );
            
            const { start_date, end_date } = r1.data;
            const { fullreduce_atleast, fullreduce_values, cashcoupon_atleast, cashcoupon_values, selectedProductIds } = this.data;

            if ( !r1.result || !r2.result  ) {
                return wx.showToast({
                    icon: 'none',
                    title: '请完善行程信息',
                })
            }

            const send = ( ) => {
                let tripDetail = Object.assign({
                    ...r1.data,
                    ...r2.data,
                    // ...r3.data,
                    // ! 付款方式：默认为付订金
                    payment: '1',
                    // ! 默认为立即发布
                    published: true,
                    // ! 默认。立减券为0
                    reduce_price: 0,
                    sales_volume: 0,
                    fullreduce_atleast,
                    fullreduce_values,
                    cashcoupon_atleast,
                    cashcoupon_values,
                    selectedProductIds,
                    updateTime: new Date( ).getTime( ),
                }, {
                    end_date: new Date( `${new Date( end_date ).toDateString( ).replace(/\-/g, '/')} 23:59:50` ).getTime( ),
                    // start_date: new Date( `${new Date( start_date ).toDateString( ).replace(/\-/g, '/')} 08:00:00` ).getTime( )
                });
        
                if ( !tid ) {
                    tripDetail = Object.assign({ }, tripDetail, {
                        isClosed: false,
                        createTime: new Date( ).getTime( )
                    });
                } else {
                    tripDetail = Object.assign({ }, tripDetail, {
                        _id: tid
                    });
                }
    
                http({
                    data: tripDetail,
                    errMsg: '加载失败，请重试',
                    loadingMsg: tid ? '更新中...' : '创建中..',
                    url: `trip_edit`,
                    success: res => {
                        const { status, data } = res;
                        if ( status === 200 ) {
                            wx.showToast({
                                title: tid ? '更新成功' : '创建成功！'
                            });
                            setTimeout(( ) => {
                                wx.redirectTo({
                                    url: `/pages/manager-trip-list/index?s=1`
                                });
                            }, 200 );
                            // 创建成功，有弹框
                            // 这里改成弹框 
                        }
                    }
                });
            };


            send( );

        },

        /** 关闭行程 */
        closeTrip( e ) {

            const { tid } = this.data;

            if ( !tid ) { return; }
            wx.showModal({
                title: 'Tips',
                confirmText: '确认关闭',
                content: `关闭行程后无法撤销`,
                success: res => {
                    if ( res.cancel ) { return; }
                    http({
                        data: {
                            tid
                        },
                        url: 'trip_close',
                        success: res => {
                            const { status } = res;
                            if ( status === 200 ) {
                                wx.showToast({
                                    title: '关闭成功'
                                });
                                setTimeout(( ) => {
                                    wx.redirectTo({
                                        url: `/pages/manager-trip-order/index?id=${tid}`
                                    })
                                }, 200 );
                            }
                        }
                    })
                }
            })
        },

        /** 进行行程订单管理页面 */
        goOrderManger( ) {
            navTo(`/pages/manager-trip-order/index?id=${this.data.tid}`)
        },

        /** 删除当前推荐的商品 */
        deleteCommand({ currentTarget }) {
            const { _id } = currentTarget.dataset.data;
            const { selectedProductIds, selectedProducts } = this.data;
            
            const index1 = selectedProductIds.find( x => x === _id );
            const index2 = selectedProducts.find( x => x._id === _id );

            selectedProductIds.splice( index1, 1 );
            selectedProducts.splice( index2, 1 );

            this.setData({
                selectedProductIds,
                selectedProducts
            });

        }


    },

    attached: function ( ) {
        this.fetchDic( );
    }
})
