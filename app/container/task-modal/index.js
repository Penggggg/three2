const { http } = require('../../util/http.js');
const { navTo } = require('../../util/route.js');
const { computed } = require('../../lib/vuefy/index.js');

const app = getApp( );

Component({
    /**
     * 组件的属性列表
     */
    properties: {

        // 是否自动展开
        autoShow: {
            type: Boolean,
            value: true
        }

    },

    /**
     * 组件的初始数据
     */
    data: {

        // 是否展示
        showModal: 'hide',

        // 购物清单
        list: [ ]

    },

    /**
     * 组件的方法列表
     */
    methods: {

        runComputed( ) {
            computed( this, {

                /**
                 * 现在到凌晨1点的倒计时
                 */
                countDownNight$( ) {
                    const now = new Date( );
                    const y = now.getFullYear( );
                    const m = now.getMonth( ) + 1;
                    const d = now.getDate( );
                    const todayOne = new Date(`${y}/${m}/${d} 01:00:00`);
                    const tomorrowOne = todayOne.getTime( ) + 24 * 60 * 60 * 1000;
                    return (( tomorrowOne - Date.now( )) / 1000 ).toFixed( 0 );
                },

                /**
                 * 列表
                 */
                list$( ) {
                    const { list } = this.data;
                    const r = list
                        .filter( x => x.type === 'shoppinglist')
                        .filter( x => !!x.adjustGroupPrice )
                        .map( x => {
                            const { adjustPrice, adjustGroupPrice, count } = x;
                            const delta = adjustPrice - adjustGroupPrice;
                            return {
                                ...x,
                                delta: ( delta * count ).toFixed( 0 )
                            }
                        });
                    
                    const r1 = r.filter( x => !x.isPin );
                    const r2 = r.filter( x => !!x.isPin );

                    const meta = [ ...r1, ...r2 ];

                    const t_lijian = list
                        .filter( x => x.type === 't_lijian');

                    if ( t_lijian.length > 0 && t_lijian[ 0 ].t_delta > 0 ) {
                        meta.unshift( t_lijian[ 0 ])
                    } else if ( t_lijian.length > 0 && t_lijian[ 0 ].t_delta === 0 ) {
                        meta.push( t_lijian[ 0 ])
                    }
                    console.log('????', list );
                    console.log('????', meta );
                    return meta;
                },

                /**
                 * 总览
                 */
                summary$( ) {
                    const { list } = this.data;
                    return {
                        allPin: list    
                            .every( x => {
                                if ( x.type === 'shoppinglist' ) {
                                    return x.isPin
                                } else if ( x.type === 't_lijian' ) {
                                    return x.t_delta === 0
                                }
                            })
                    }
                }
            });
        },

        /**
         * 领取立减券
         */
        repaireLijian( ) {
            http({
                data: { },
                url: 'coupon_repair-lijian',
                success: res => {
                    if ( res.status === 200 ) {

                        const { list } = this.data;
                        const t_lijianIndex = list
                            .findIndex( x => x.type === 't_lijian');

                        const { t_total } = list[ t_lijianIndex ];  
                        list.splice( t_lijianIndex, 1, {
                            t_total,
                            t_delta: 0,
                            type: 't_lijian',
                            t_current: t_total,
                        });

                        this.setData({
                            list: [ ...list ]
                        });

                        this.triggerEvent('repaireLijian', true );

                        setTimeout(( ) => {
                            wx.showToast({
                                duration: 2000,
                                title: '领取成功！'
                            });
                            
                        }, 2500 );
                    }
                }
            })
        },
    
        /**
         * 开启、关闭
         */
        toggle( ) {
            const { showModal, list } = this.data;
            // 开启
            if ( showModal === 'hide' ) {
                // 存在可拼团、未成功的单才开启
                if ( list.filter( x => !x.isPin && !!x.adjustGroupPrice )) {
                    this.setData({
                        showModal: 'show'
                    });
                }
            // 关闭
            } else {
                this.setData({
                    showModal: 'hide'
                });
            }
        },

        /** 
         * 获取拼团情况 
         */
        fetchPinTask( ) {
            const { autoShow } = this.data;
            http({
                data: { },
                url: 'shopping-list_pin-task',
                success: res => {
                    const { status, data } = res;
                    if ( status !== 200 ) { return; }

                    this.setData({
                        list: data
                    });
                    // 只有立减券的时候 不展示
                    if ( autoShow && data.length > 1 ) {
                        this.toggle( );
                    }
                }
            });
        },

        /**
         * 跳到商品详情
         */
        goDetail({ currentTarget }) {
            const { data } = currentTarget.dataset;
            navTo(`/pages/goods-detail/index?id=${data.pid}`);
        }
    },

    attached: function( ) {
        this.runComputed( );
        this.fetchPinTask( );
    }
})
