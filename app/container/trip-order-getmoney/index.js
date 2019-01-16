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
            observer: 'init'
        }
    },

    /**
     * 组件的初始数据
     */
    data: {
        clients: 0, // 总客户数
        notPayAllClients: 0, // 未交尾款客户数
        canAction: false, // 是否调整完成，并进行催款
        lastAdjust: 0 // 剩余未调整订单
    },

    /**
     * 组件的方法列表
     */
    methods: {

        /** 初始化 */
        init( tid ) {
            this.fetchInfo( tid );
            this.fetchAdjustStatus( tid );
        },

        /** 拉取客户数量、未付款订单数 */
        fetchInfo( tid ) {
            http({
                url: 'trip_order-info',
                data: {
                    tid
                },
                loadMsg: '加载中...',
                errorMsg: '加载失败，请刷新',
                success: res => {
                    if ( res.status === 200 ) {
                        const { clients, notPayAllClients } = res.data;
                        this.setData({
                            clients,
                            notPayAllClients
                        })
                    }
                }
            })
        },

        /** 拉取分配状态 */
        fetchAdjustStatus( tid ) {
            http({
                url: 'shopping-list_adjust-status',
                data: {
                    tid
                },
                errorMsg: '加载失败，请刷新',
                success: res => {
                    const { status, data } = res;
                    if ( status === 200 ) {
                        this.setData({
                            lastAdjust: data,
                            canAction: data === 0
                        })
                    }
                }
            })
        }

        /** 拉取客户订单列表 */

    }
})
