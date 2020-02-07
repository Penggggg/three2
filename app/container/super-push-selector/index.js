const { http } = require('../../util/http.js');
const { computed } = require('../../lib/vuefy/index.js');
const { navTo } = require('../../util/route.js');

const app = getApp( );

Component({
    /**
     * 组件的属性列表
     */
    properties: {

    },

    /**
     * 组件的初始数据
     */
    data: {

        // 推荐列表
        list: [ ],

        // 是否为管理员
        isAdm: false,

        // 是否为核心小程序
        isCoreApp: true,

        // 弹框
        showTips: 'show',

    },

    /**
     * 组件的方法列表
     */
    methods: {

        watchApp( ) {
            app.watch$('role', ( val ) => {
                if ( !val ) { return;}
                this.setData({
                    isAdm: true
                })
                this.judge( );
            });
            app.watch$('appConfig', ( val ) => {
                if ( !val ) { return;}
                if ( !!val['app-id'] && val['app-id'] !== val['super-app-id']) {
                    this.setData({
                        isCoreApp: false
                    })
                    this.judge( );
                }
            });
        },

        /** 进行判断 */
        judge( ) {
            const { isAdm, isCoreApp } = this.data;
            if ( isAdm && !isCoreApp ) {
                this.fetchPushing( );
            }
        },

        /** 获取正在拼团的列表 */
        fetchPushing( ) {
            http({
                data: {
                    body: { },
                    url: 'super-goods_pushing'
                },
                url: 'common_core-app-api',
                success: res => {
                    const { status, data } = res;
                    if ( status !== 200 ) { return; }
                    this.setData({
                        list: data
                    });
                }
            })
        },

        /** 展开关闭 */
        toggleTips( ) {
            const { showTips } = this.data;
            this.setData({
                showTips: showTips === 'hide' ? 'show' : 'hide'
            })
        },

        /** 预览图片 */
        previewImg({ currentTarget }) {
            const { img } = currentTarget.dataset;
            wx.previewImage({
                current: img,
                urls: [ img ]
            });
        },

        /** 去编辑 */
        goEdit({ currentTarget }) {
            const { data } = currentTarget.dataset;
            const spid = data._id;

            // 判断是否有这个spid的商品
            http({
                url: 'good_find-by-spid',
                data: {
                    spid
                },
                success: res => {
                    const { status, data } = res;
                    if ( status !== 200 ) { return; }
                    if ( !data ) {
                        navTo(`/pages/manager-goods-detail/index?spid=${spid}`)
                    } else {
                        navTo(`/pages/manager-goods-detail/index?id=${data._id}&spid=${spid}`)
                    }
                }
            })
            
        }

    },

    attached: function( ) {
        this.watchApp( );
    }
})
