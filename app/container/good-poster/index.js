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
            observer: 'onDraw'
        }
    },

    /**
     * 组件的初始数据
     */
    data: {
        canvasHeight: 600
    },

    /**
     * 组件的方法列表
     */
    methods: {
        /**  */
        onDraw( ) {
            http({
                data: { },
                url: `common_create-qrcode`,
                success: res => {
                    const { good } = this.data;
                    const decorateGood = delayeringGood( good );
                    const { status, data } = res;
                    const fsm = wx.getFileSystemManager( );
                    if ( status !== 200 ) { return; }
                    
                    // 二维码
                    const qrCode = wx.env.USER_DATA_PATH + '/wa_qrcode_temp.png';
                    fsm.writeFileSync( qrCode, data, 'binary' );

                    // 画布
                    const ctx = wx.createCanvasContext('c1', this );

                    wx.getSystemInfo({
                        success: system => {

                            const { windowWidth, windowHeight } = system;
                            const canvasWidth = Number(( windowWidth * 0.9 ).toFixed( 0 ));
                            const maxWidth = Number(( windowWidth * 0.9 - 20 ).toFixed( 0 ));

                            // 标题
                            ctx.setFillStyle('#333');
                            ctx.font = 'normal bold 20px sans-serif'
                            ctx.fillText( good.title, 10, 30, maxWidth );

                            // 主图（网络图）
                            wx.getImageInfo({
                                src: good.img[ 0 ],
                                success: res => {
                                    
                                    const proportion = res.width / res.height;
                                    const imgWidth = maxWidth;
                                    const imgHeight = Number(( imgWidth / proportion ).toFixed( 0 ));
                                    const canvasHeight = imgHeight + 170;

                                    // 调整画布高度
                                    this.setData({
                                        canvasHeight
                                    });

                                    ctx.drawImage( res.path, 10, 50, imgWidth, imgHeight )

                                    // 原价
                                    const fadePriceText = `原价${good.fadePrice}元`;
                                    ctx.setFillStyle('#333');
                                    ctx.font = 'normal 16px sans-serif'
                                    ctx.fillText( fadePriceText, 10, imgHeight + 75, maxWidth );

                                    // 原价删除线
                                    ctx.lineWidth = 1;
                                    ctx.moveTo ( 8, imgHeight + 71 );       
                                    ctx.lineTo ( fadePriceText.length * 15, imgHeight + 71 );
                                    ctx.setStrokeStyle('#333')
                                    ctx.stroke( );

                                    // 拼团价
                                    const { hasPin, hasActivity, lowest_price$ } = decorateGood;
                                    const pinText = hasActivity ?
                                        `限时特价 低至${lowest_price$}元` :
                                        hasPin ? 
                                            `拼团特惠 低至${lowest_price$}元` :
                                            `好物推荐 低至${lowest_price$}元`
                                    ctx.setFillStyle('#c22c3e');
                                    ctx.font = 'normal bold 20px sans-serif'
                                    ctx.fillText( pinText, 10, imgHeight + 105, maxWidth );

                                    // logo
                                    const logoText = '长按图片 识别二维码';
                                    ctx.setFillStyle('#333');
                                    ctx.font = 'normal 17px sans-serif'
                                    ctx.fillText( logoText, 10, imgHeight + 150, maxWidth );


                                    // 小程序二维码
                                    const qrCodeImgSize = 90;
                                    ctx.drawImage( 
                                        qrCode, 
                                        canvasWidth - qrCodeImgSize,
                                        canvasHeight - qrCodeImgSize - 10, 
                                        qrCodeImgSize, qrCodeImgSize
                                    );

                                    ctx.draw( );
                                        
                                },
                                fail: e => {
                                    wx.showToast({ 
                                        title: '生成海报错误，请重试'
                                    });
                                }
                            })
                        }
                    });
                    
                }
            });
        },
    },

    attached: function( ) {
        
    }
})
