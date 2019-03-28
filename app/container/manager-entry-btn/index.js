const app = getApp( );
const { navTo } = require('../../util/route.js');

// container/manager-entry-btn/index.js
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
                title: '我的商品',
                desc: '新增、编辑、上下架商品',
                url: '/pages/manager-goods-list/index',
                img: 'https://global-1257764567.cos.ap-guangzhou.myqcloud.com/entry-icon-1.png'
            }, {
                title: '我的行程',
                desc: '发布、编辑最新行程',
                url: '/pages/manager-trip-list/index',
                img: 'https://global-1257764567.cos.ap-guangzhou.myqcloud.com/entry-icon-2.png'
            }, {
                title: '一口价',
                desc: '商品特惠活动',
                url: '/pages/manager-goods-active/index',
                img: 'https://global-1257764567.cos.ap-guangzhou.myqcloud.com/entry-icon-4.png'
            }, {
                title: '我的资料',
                desc: '让新客户主动联系自己',
                url: '/pages/manager-person-info/index',
                img: 'https://global-1257764567.cos.ap-guangzhou.myqcloud.com/entry-icon-3.png'
            }
        ]
    },

    /**
     * 组件的方法列表
     */
    methods: {

        /** 监听全局管理员权限 */
        watchRole( ) {
            app.watch$('role', ( val ) => {
                this.setBtn( val === 1 )
            });
        },

        /** 设置按钮可视 */
        setBtn( showBtn ) {
            this.setData({
                showBtn
            })
        },

        /** 弹窗开关 */
        toggleDrawer( ) {
            this.setData({
                showDrawer: !this.data.showDrawer
            })
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
