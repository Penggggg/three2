const app = getApp( );
const { navTo } = require('../../util/route.js');
const { http } = require('../../util/http');

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
        // 展示按钮
        showBtn: false,
        // 展示弹框
        showDrawer: false,
        // 展示列表
        list: [
            {
                title: '商品',
                desc: '创建、编辑商品',
                url: '/pages/manager-goods-list/index',
                img: 'https://global-1257764567.cos.ap-guangzhou.myqcloud.com/entry-icon-1.png'
            }, {
                title: '行程',
                desc: '发布、编辑代购行程',
                url: '/pages/manager-trip-list/index',
                img: 'https://global-1257764567.cos.ap-guangzhou.myqcloud.com/entry-icon-2.png'
            }
            // , {
            //     title: '特价',
            //     desc: '创建商品特价活动',
            //     url: '/pages/manager-goods-active/index',
            //     img: 'https://global-1257764567.cos.ap-guangzhou.myqcloud.com/entry-icon-4.png'
            // }
        ],
        // 下方列表
        list2: [
            {
                title: '我的资料',
                desc: '让新客户主动联系自己',
                url: '/pages/manager-person-info/index',
                img: 'https://global-1257764567.cos.ap-guangzhou.myqcloud.com/entry-icon-3.png'
            }, {
                title: '设置',
                desc: '应用设置',
                url: '/pages/manager-app-config/index',
                img: 'https://global-1257764567.cos.ap-guangzhou.myqcloud.com/entry-icon-5.png'
            }
        ]
    },

    /**
     * 组件的方法列表
     */
    methods: {

        /** 监听全局管理员权限 */
        watchRole( ) {
            const { list } = this.data;
            app.watch$('role', ( val ) => {
                this.setBtn( val === 1 )
            });
            app.watch$('appConfig', ( val ) => {
                if ( !val ) { return;}
                if ( !!val['app-id'] && val['app-id'] === val['super-app-id']) {
                    list.push({
                        title: '主推',
                        desc: '发布、编辑主推商品',
                        url: '/pages/super-push-good-list/index',
                        img: 'https://global-1257764567.cos.ap-guangzhou.myqcloud.com/entry-icon-4.png'
                    });
                    this.setData({
                        list
                    })
                }
            });
        },

        /** 设置按钮可视 */
        setBtn( showBtn ) {
            this.setData({
                showBtn
            })
        },

        /** 弹窗开关 */
        toggleDrawer( e ) {
            this.setData({
                showDrawer: !this.data.showDrawer
            });
        },

        /** 订阅-管理 */
        onSubscribe( e ) {
            app.getSubscribe('newOrder,trip,waitPin');
        },

        /** 地址跳转 */
        navigate( e ) {
            navTo(e.currentTarget.dataset.url);
        }
        
    },

    attached: function( ) {
        this.watchRole( );
    }
})
