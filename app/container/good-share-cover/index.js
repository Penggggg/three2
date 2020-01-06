const { http } = require('../../util/http.js');
const { navTo } = require('../../util/route.js');
const { delayeringGood } = require('../../util/goods.js');
const app = getApp( );


Component({
    /**
     * 组件的属性列表
     */
    properties: {

        good: {
            type: Object,
            required: true,
            observer: 'onClear'
        },
        coverText: {
            type: String,
            value: '23人看过'
        }
    },

    /**
     * 组件的初始数据
     */
    data: {

        // 是否展开
        show: false,

        // 画布高度
        canvasHeight: 300,

        // 加载
        loading: true

    },

    /**
     * 组件的方法列表
     */
    methods: {

        // 删除本地文件
        onClear( ) {
            wx.getSavedFileList({
                success: res =>  {
                    Promise.all(
                        res.fileList.map( file => {
                            return new Promise( reslove => {
                                const { filePath } = file;
                                wx.removeSavedFile({
                                    filePath,
                                    complete: ( ) => {
                                        reslove( )
                                    }
                                })
                            })
                        })
                    ).then(( ) => {
                        this.onDraw( );
                    });
                }
            })
        },

        /** 画画 */
        onDraw( ) {
            const { good, coverText } = this.data;
            const decorateGood = delayeringGood( good );
            const ctx = wx.createCanvasContext('c1', this );

            wx.getSystemInfo({
                success: system => {

                    const { windowWidth, windowHeight } = system;
                    /**
                     * 封面宽高比例 5 * 4
                     */
                    const canvasWidth = Number(( windowWidth * 0.9 ).toFixed( 0 ));
                    const canvasHeight = Number(( canvasWidth / 5 * 4 ).toFixed( 0 ));
                    const imgWidth = Number(( windowWidth * 0.9 - 20 ).toFixed( 0 ));
                    
                    // 调整画布高度
                    this.setData({
                        canvasHeight
                    });

                    // 主图（网络图）
                    wx.getImageInfo({
                        src: good.img[ 0 ],
                        success: res => {
                            
                            const proportion = res.width / res.height;
                            const imgHeight = Number(( imgWidth / proportion ).toFixed( 0 ));

                            ctx.fillStyle = '#fff';
                            ctx.fillRect( 0, 0, canvasWidth, canvasHeight );

                            // 图片
                            ctx.drawImage( res.path, 10, -10, imgWidth, imgHeight )

                            // 气泡
                            const fontSize = 28;
                            const popMargin = 12;
            
                            const popHeight = 10 + fontSize;
                            const popWidth = coverText.length * fontSize + 10;
                            const popX = canvasWidth - popMargin - popWidth;
                            const popY = canvasHeight - popMargin - popHeight;

                            ctx.rect( popX, popY, popWidth, popHeight );
                            ctx.strokeStyle="rgba( 0, 0, 0, 0 )";
                            ctx.stroke( );

                            ctx.fillStyle="rgba( 0, 0, 0, 0.45 )"
                            ctx.fill( );

                            // 文字
                            
                            ctx.setTextAlign('left')
                            ctx.setFillStyle('#ffffff');
                            ctx.font = `normal ${fontSize}px sans-serif`
                            ctx.fillText( coverText, popX + ( fontSize / 2 ) + 2, popY + fontSize + 2 );

                            ctx.draw( false, ( ) => {
                                this.setData({
                                    loading: false
                                });
                                this.save( );
                            });
                        },
                        fail: e => { }
                    })
                }
            });
        },

        /** 保存canvas到本地图片 */
        save( ) {
            const { canvasHeight, loading } = this.data;

            if ( loading ) { return; }

            const err = ( ) => {
                return wx.showToast({
                    icon: 'none',
                    title: '保存失败，请重试'
                })
            };

            wx.getSystemInfo({
                success: system => {
                    const { windowWidth } = system;
                    const width = windowWidth * 0.9;
                    wx.canvasToTempFilePath({
                        x: 0,
                        y: 0,
                        width,
                        height: canvasHeight,
                        destWidth: width * 2.5,
                        destHeight: canvasHeight * 2.5,
                        canvasId: 'c1',
                        success: res => {
                            const { tempFilePath } = res;
                            wx.saveFile({
                                tempFilePath,
                                success: res => {
                                    this.triggerEvent('done', res.savedFilePath );
                                }
                            })
                        },
                        fail: e => err( )
                    }, this );
                }
            });
            
        },

        preventTouchMove( ) {
        }

    },

    attached: function( ) {

    }
})
