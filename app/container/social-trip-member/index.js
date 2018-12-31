const { http } = require('../../util/http.js');

Component({
    /**
     * 组件的属性列表
     */
    properties: {
        // 跳转地址
        url: {
            value: '',
            type: String
        },
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
        /** 头像列表 */
        // imgList: [
        //     'cloud://dev-0822cd.6465-dev-0822cd/icon-img/entry-icon-1.png',
        //     'cloud://dev-0822cd.6465-dev-0822cd/icon-img/entry-icon-2.png',
        //     'cloud://dev-0822cd.6465-dev-0822cd/icon-img/nav-icon-5.png',
        //     'cloud://dev-0822cd.6465-dev-0822cd/icon-img/nav-icon-7.png'
        // ],
        imgList: [ ]
    },

    /**
     * 组件的方法列表
     */
    methods: {

        /** 地址跳转 */
        go( ) {
            const { url } = this.data;
            if ( !!url ) {
                wx.navigateTo({
                    url
                });
            }
        },

        /** 拉取行程订单购买用户数 */
        fetchDetail( tid ) {
            http({
                data: {
                    tid
                },
                url: 'common_customer-in-trip',
                success: res => {
                    if ( res.status === 200 ) {
                        this.setData({
                            imgList: res.data
                        })
                    }
                }
            })
        }
    },

    attached: function( ) {
        this.fetchDetail( this.data.tid );
    }
})
