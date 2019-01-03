const { http } = require('../../util/http.js');

Component({
    /**
     * 组件的属性列表
     */
    properties: {
        // 行程id
        tid: {
            value: '',
            type: String,
            observer: 'fetchDetail'
        }
    },

    /**
     * 组件的初始数据
     */
    data: {
        // 行程订单数
        count: 0,
        // 行程交易额
        sum: 0,
        // 清单列表
        list: [ ]
    },

    /**
     * 组件的方法列表
     */
    methods: {
        fetchDetail( tid ) {
            http({
                url: 'shopping-list_list',
                data: {
                    data: {
                        tid
                    }
                },
                loadMsg: '加载中...',
                errorMsg: '加载失败，请刷新',
                success: res => {
                    if ( res.status === 200 ) {
                        console.log( res );
                        this.setData({
                            list: res.data
                        })
                    }
                }
            })
        },
        fetchShoppingList( tid ) {
            http({
                url: 'trip_order-info',
                data: {
                    data: {
                        tid
                    }
                },
                loadMsg: '加载中...',
                errorMsg: '加载失败，请刷新',
                success: res => {
                    if ( res.status === 200 ) {
                        const { count, sum } = res.data;
                        this.setData({
                            sum,
                            count
                        })
                    }
                }
            })
        }
    },

    attached: function( ) {
        // this.fetchDetail( this.data.tid );
        this.fetchShoppingList( this.data.tid );
    }
})
