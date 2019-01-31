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
        hasBeenUploaded: [ ]
    },

    /**
     * 组件的方法列表
     */
    methods: {

        init( ) {
            this.fetchImgs( );
        },

        /** 图片更改 */
        onImgChange( e ) {
            const imgs = e.detail;
            if ( !this.data.inited ) { return; }
            if ( imgs.every(( img, key ) => this.data.hasBeenUploaded[ key ] === img )) { return; }
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
