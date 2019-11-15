const app = getApp( );
const { http } = require('../../util/http.js');

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
        // 是否初始化
        inited: false,
        // 已上传列表
        hasBeenUploaded: [ ],
        // 是否可以转发（快递页面）
        canShare: false
    },

    /**
     * 组件的方法列表
     */
    methods: {

        init( ) {
            this.fetchImgs( );
            this.fetchDetail( )
        },

        /** 拉取行程信息 */
        fetchDetail( ) {
            if ( !this.data.tid ) { return; }
            http({
                url: 'trip_detail',
                data: {
                    _id: this.data.tid
                },
                success: res => {
                    const { status, data } = res;
                    if ( status === 200 ) {
                        const { callMoneyTimes } = data;
                        this.setData({
                            canShare: !!callMoneyTimes && callMoneyTimes > 0
                        })
                    }
                }
            })
        },

        /** 还不能转发 */
        toastShare( ) {
            wx.showToast({
                icon: 'none',
                title: '请先发送收款通知'
            })
        },

        /** 图片更改 */
        onImgChange( e ) {
            const imgs = e.detail;
            if ( !this.data.inited ) { return; }
            if ( imgs.length !== 0 && imgs.every(( img, key ) => this.data.hasBeenUploaded[ key ] === img )) { return; }
            if ( imgs.length === 0 && this.data.hasBeenUploaded.length === 0 ) { return }
            http({
                url: 'trip_update-deliver',
                data: {
                    imgs,
                    tid: this.data.tid
                },
                success: res => {
                    if ( res.status === 200 ) {
                        wx.showToast({
                            title: '更新成功!'
                        });
                    }
                }
            })
        },

        /** 拉取图片 */
        fetchImgs( ) {
            if ( !this.data.tid ) { return; }
            http({
                url: 'trip_deliver',
                data: {
                    tid: this.data.tid
                },
                success: res => {
                    if ( res.status === 200 ) {
                        this.setData({
                            inited: true,
                            hasBeenUploaded: res.data
                        })
                    }
                }
            })
        }

    }
})
