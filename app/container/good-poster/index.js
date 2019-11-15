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
            observer: 'onInit'
        },
        // 是否可以立马拼团
        someCanPin: {
            type: Boolean,
            value: false,
        },
        // 是否有团购价
        goodCanPin: {
            type: Boolean,
            value: false,
        }
    },

    /**
     * 组件的初始数据
     */
    data: {

        // 是否展开
        show: false,

        // 传进来的
        goodMeta: null,

        // 画布高度
        canvasHeight: 300,

        // 加载
        loading: true,

        // 是否为管理员
        isAdmin: false,

        // 动画
        animationMiddleHeaderItem: null,

        // 文字拼团提示
        tips: [
            '发群求拼团',
            '分享给闺蜜'
        ],
        
        // 是否转发提示
        showTips: false,

        // 当前文字拼团提示的下标
        tipsIndex: null,

        // 当前的文字
        tipsText: ''

    },

    /**
     * 组件的方法列表
     */
    methods: {

        /** 监听全局管理员权限 */
        watchRole( ) {
            app.watch$('role', ( val ) => {
                this.setData({
                    isAdmin: val === 1
                });
            });
        },

        // 初始化动画
        initAnimate( ) {
            let circleCount = 0; 
            const that = this;
            // 心跳的外框动画 
            that.animationMiddleHeaderItem = wx.createAnimation({ 
                duration: 800, 
                timingFunction: 'ease', 
                transformOrigin: '15% 15%',
            }); 
            setInterval( function( ) { 
                if (circleCount % 2 == 0) { 
                    that.animationMiddleHeaderItem.scale( 1.0 ).rotate( 10 ).step( ); 
                } else { 
                    that.animationMiddleHeaderItem.scale( 1.0 ).rotate( -18 ).step( ); 
                } 
                that.setData({ 
                    animationMiddleHeaderItem: that.animationMiddleHeaderItem.export( ) 
                }); 
                
                if ( ++circleCount === 1000 ) { 
                    circleCount = 0; 
                } 
            }.bind( this ), 1200 ); 
        },

        // 初始化
        onInit( good ) {
            this.setData({
                goodMeta: good
            })
        },

        /** 画画 */
        onDraw( ) {
            http({
                data: {
                    page: 'pages/goods-detail/index',
                    scene: this.data.good._id
                },
                url: `common_create-qrcode`,
                success: res => {
                    const { goodMeta } = this.data;
                    const decorateGood = delayeringGood( goodMeta );
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

                            // 主图（网络图）
                            wx.getImageInfo({
                                src: goodMeta.img[ 0 ],
                                success: res => {
                                    
                                    const proportion = res.width / res.height;
                                    const imgWidth = maxWidth;
                                    const imgHeight = Number(( imgWidth / proportion ).toFixed( 0 ));
                                    const canvasHeight = imgHeight + 200;

                                    ctx.fillStyle = '#fff';
                                    ctx.fillRect( 0, 0, canvasWidth, canvasHeight );

                                    // 调整画布高度
                                    this.setData({
                                        canvasHeight
                                    });

                                    // 标题
                                    ctx.setFillStyle('#333');
                                    ctx.font = 'normal bold 20px sans-serif'
                                    ctx.fillText( goodMeta.title, 10, 40, maxWidth );

                                    // 首图
                                    ctx.drawImage( res.path, 10, 60, imgWidth, imgHeight )

                                    // 原价
                                    const fadePriceText = `原价${goodMeta.fadePrice}元`;
                                    ctx.setFillStyle('#333');
                                    ctx.font = 'normal 16px sans-serif'
                                    ctx.fillText( fadePriceText, 10, imgHeight + 85, maxWidth );

                                    // 原价删除线
                                    ctx.lineWidth = 1;
                                    ctx.moveTo ( 8, imgHeight + 80 );       
                                    ctx.lineTo ( fadePriceText.length * 15, imgHeight + 80 );
                                    ctx.setStrokeStyle('#333')
                                    ctx.stroke( );

                                    // 拼团价
                                    let lowest_price$ = decorateGood.lowest_price$;
                                    lowest_price$ = String( lowest_price$ ).replace(/\.00/g, '');
                                    const { hasPin, hasActivity } = decorateGood;
                                    const pinText = hasActivity ?
                                        `限时特价 低至${lowest_price$}${lowest_price$.length >=4 ? '' : '元'}` :
                                        hasPin ? 
                                            `拼团特惠 低至${lowest_price$}${lowest_price$.length >=4 ? '' : '元'}` :
                                            `好物推荐 低至${lowest_price$}${lowest_price$.length >=4 ? '' : '元'}`
                                    ctx.setFillStyle('#c22c3e');
                                    ctx.font = 'normal bold 20px sans-serif'
                                    ctx.fillText( pinText, 10, imgHeight + 115, maxWidth );

                                    // logo
                                    const logoText = '长按图片 识别二维码';
                                    ctx.setFillStyle('#333');
                                    ctx.font = 'normal 17px sans-serif'
                                    ctx.fillText( logoText, 10, imgHeight + 170, maxWidth );


                                    // 小程序二维码
                                    const qrCodeImgSize = lowest_price$.length >=3 ? 80 : 90;
                                    ctx.drawImage( 
                                        qrCode, 
                                        canvasWidth - qrCodeImgSize - 10,
                                        canvasHeight - qrCodeImgSize - 20, 
                                        qrCodeImgSize, 
                                        qrCodeImgSize
                                    );

                                    ctx.draw( false, ( ) => {
                                        this.setData({
                                            loading: false
                                        })
                                    });
                                        
                                },
                                fail: e => {
                                    wx.showToast({ 
                                        icon: 'none',
                                        title: '生成海报错误，请重试'
                                    });
                                }
                            })
                        }
                    });
                    
                }
            });
        },

        /** 展开画布 */
        toggle( e ) {
            const { show } = this.data;
            this.setData({
                show: !show
            });
            if ( !show ) {
                this.onDraw( );
            }
            this.triggerEvent('toggle', !show );
            app.getSubscribe('newOrder,trip');
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
                            const tempFilePath = res.tempFilePath;
                            wx.saveImageToPhotosAlbum({
                                filePath: tempFilePath,
                                fail: e => err( ),
                                success: res => {
                                    wx.showToast({
                                        title: '保存图片成功！请查看相册'
                                    })
                                }
                            });
                        },
                        fail: e => err( )
                    }, this );
                }
            });
            
        },

        preventTouchMove( ) {
        },

        // 自动弹出转发提示
        initTips( ) {
            const { goodCanPin, someCanPin } = this.data;
            const time = setInterval(( ) => {
                const { tips, tipsIndex, showTips } = this.data;
                const allTips = tips
                    .filter( x => {
                        return someCanPin ? !x.includes('发群求拼团') : true
                    });


                if ( tipsIndex >= allTips.length - 1 ) {
                    this.setData({
                        showTips: false
                    });
                    return clearInterval( time );
                }

                if ( !showTips ) {
                    const index = tipsIndex === null ? 0 : tipsIndex + 1;
                    this.setData({
                        showTips: true,
                        tipsIndex: index,
                        tipsText: allTips[ index ]
                    });
                } else {
                    this.setData({
                        showTips: false
                    });
                }
            }, 4500 );
        }

    },

    attached: function( ) {
        this.watchRole( );
        setTimeout(( ) => this.initTips( ), 5000 );
    }
})
