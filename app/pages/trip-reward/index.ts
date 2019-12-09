
import { http } from '../../util/http.js';
import { computed } from '../../lib/vuefy/index.js';
import { delayeringGood } from '../../util/goods.js';
import { navTo } from '../../util/route.js';

const app = getApp<any>( );

Page({

    data: {

        /**
         * 加载
         */
        loading: false

    },

    runComputed( ) {
        computed( this, {

            // 购买记录 + 社交属性模块
            social$( ) {
                const avatar = 'https://wx.qlogo.cn/mmopen/vi_32/IejMVZTG8WlibHicHIVQhqcNeC4uBxkzH0FFTbRLMicxib8wrxRRWoJY3gvctylATdmAPhiaVicU4sH0NptSszBdyHiaA/132';
                const getRandom = n => Math.floor( Math.random( ) * n );
                const allTexts = [
                    `棒! 拼团的群友真给力`,
                    `哇! 和群友拼团真划算`,
                    `哈! 下次继续和群友拼团`
                ];
                
                const visitors = [
                    avatar,
                    avatar
                ];
                const allVisitors = visitors
                    .map( x => {
                        const randomNum = getRandom( allTexts.length );
                        return {
                            avatar: x,
                            text: allTexts[ randomNum ]
                        }
                    })
                return allVisitors;

            },

            // 个人购物清单
            personal$( ) {
                const avatar = 'https://wx.qlogo.cn/mmopen/vi_32/IejMVZTG8WlibHicHIVQhqcNeC4uBxkzH0FFTbRLMicxib8wrxRRWoJY3gvctylATdmAPhiaVicU4sH0NptSszBdyHiaA/132';
                const imgUrl = 'https://wx60bf7f745ce31ef0-1257764567.cos.ap-guangzhou.myqcloud.com/tmp_7e24d0909d341e812968b83ce5a328d102bc1b174a374f4e.jpg';
                const r = [
                    {
                        goodId: '1',
                        delta: 15,
                        totalDelta: 45,
                        price: 86,
                        groupPrice: 71,
                        fadePrice: 128,
                        title: 'SKT护肤霜',
                        name: '红色',
                        buyer: [
                            {
                                name: 'xxx',
                                avatar
                            }, {
                                name: 'yyy',
                                avatar
                            }, {
                                name: 'zzz',
                                avatar
                            }, {
                                name: 'xxx',
                                avatar
                            }
                        ],
                        pinSuccess: true,
                        goodImg: imgUrl
                    }, {
                        goodId: '1',
                        delta: 15,
                        totalDelta: 45,
                        price: 86,
                        groupPrice: 71,
                        fadePrice: 128,
                        title: 'SKT护肤霜',
                        name: '红色',
                        buyer: [
                            {
                                name: 'xxx',
                                avatar
                            }, {
                                name: 'yyy',
                                avatar
                            }, {
                                name: 'zzz',
                                avatar
                            }, {
                                name: 'xxx',
                                avatar
                            }, {
                                name: 'yyy',
                                avatar
                            }, {
                                name: 'zzz',
                                avatar
                            }, {
                                name: 'xxx',
                                avatar
                            }, {
                                name: 'yyy',
                                avatar
                            }, {
                                name: 'zzz',
                                avatar
                            }
                        ],
                        pinSuccess: true,
                        goodImg: imgUrl
                    }
                ];
                return r;
            }

        });
    },

    /**
     * 监听store
     */
    watchStore( ) {
        app.watch$('appConfig', val => {
            if ( !val ) { return; }
            this.setTitle(`${val['ip-name']}群拼团`)
        });
    },

    /** 
     * 设置标题
     */
    setTitle( title: string ) {
        if ( !title ) { return; }
        wx.setNavigationBarTitle({
            title
        });
    },

    onLoad: function (options) {
        this.watchStore( );
        this.runComputed( );
    },
  
    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function ( ) {

    },
  
    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function ( ) {

    },
  
    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {
  
    },
  
    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {
  
    },
  
    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {
  
    },
  
    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {
  
    },
  
    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function ( e ) {
        return {
        }
    }
  })