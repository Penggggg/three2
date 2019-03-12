const { http } = require('../../util/http.js');
/**
 * 快递页面底下的商品排行榜
 */
Component({

    behaviors: [require('../../behaviores/computed/index.js')],

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
        img: "https://wx60bf7f745ce31ef0-1257764567.cos.ap-guangzhou.myqcloud.com/WechatIMG17.jpeg",
        
        /** 列表 */
        list: [ ]
    },

    /** 计算属性 */
    computed: {

        /** 前3 */
        top3$: function( ) {
            const temp = [ ...this.data.list ];
            return temp.slice( 0, 3 );
        },

        /** 前3以外 */
        outtop3$: function( ) {
            const temp = [ ...this.data.list ];
            return temp.slice( 3 );
        },
    },

    /**
     * 组件的方法列表
     */
    methods: {

        init( tid ) {
            this.fetchList( tid );
        },

        /** 拉取采购清单 */
        fetchList( tid ) {
            http({
                url: 'shopping-list_list',
                data: {
                    tid
                },
                success: res => {
                    const { status, data } = res;
                    if ( status !== 200 ) { return; }

                    // 按订单数量排序
                    const metaList = data.sort(( x, y ) => y.oids.length - x.oids.length );
                    this.setData({ 
                        list: metaList.map( x => {
                            const { acid, ac_price, ac_groupPrice, adjustGroupPrice, adjustPrice, groupPrice, price } = x;
                            const price$ = ac_groupPrice || ac_price ||
                                adjustGroupPrice || adjustPrice ||
                                groupPrice || price;
                            return Object.assign({ }, x , {
                                price$
                            });
                        })
                    });
                }
            });
        },

        /** 跳到商品详情 */
        goGoodDetail({ currentTarget }) {
            const { pid } = currentTarget.dataset;
            wx.navigateTo({
                url: `/pages/goods-detail/index?id=${pid}`
            })
        }

    }
})
