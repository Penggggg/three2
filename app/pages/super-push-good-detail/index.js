
const app = getApp( );
const { http } = require('../../util/http.js');
const { computed } = require('../../lib/vuefy/index.js');
const { navTo } = require('../../util/route.js');

Page({

    /**
     * 页面的初始数据
     */
    data: {

        /**
         * 主推商品id
         */
        spid: '',

        /**
         * 数据字典
         */
        dic: {
            goods_category: [ ]
        },

        /**
         * 分类
         */
        category: '0',

        /**
         * 图片
         */
        hasBeenUploaded: [ ]

    },

    runComputed( ) {
        computed( this, {
         
            // 表单数据
            meta( ) {
                const { category, dic, hasBeenUploaded } = this.data;

                const meta = [
                    {
                        title: '基本信息',
                        desc: ''
                    }, {
                        key: 'title',
                        label: '商品名称',
                        type: 'input',
                        max: 50,
                        placeholder: '如：YSL莹亮纯魅唇膏',
                        value: undefined,
                        rules: [{
                            validate: val => !!val,
                            message: '商品名称不能为空'
                        }]
                    }, {
                        key: 'detail',
                        label: '商品描述',
                        type: 'textarea',
                        placeholder: `一段介绍（回车换行）`,
                        value: undefined,
                        rules: [ ]
                    }, {
                        key: 'tag',
                        label: '商品标签',
                        type: 'tag',
                        max: 2,
                        placeholder: `如：补水`,
                        value: [ ],
                        rules: [{
                            validate: val => val.length >= 1,
                            message: '至少有一个商品标签'
                        }]
                    }, {
                        key: 'category',
                        label: '商品类目',
                        type: 'select',
                        placeholder: '请设置商品类目',
                        value: category,
                        options: dic['goods_category'] || [ ]
                    }, {
                        key: 'img',
                        label: '商品图片',
                        type: 'img',
                        max: 6,
                        canAdjust: true,
                        value: hasBeenUploaded,
                        rules: [{
                        validate: val => val.length >= 1,
                        message: '上传一张图片（白底效果好）'
                        }]
                    }, {
                        title: '价格信息',
                        desc: ''
                    }, {
                        key: 'fadePrice',
                        label: '淘宝价',
                        type: 'number',
                        placeholder: '比售价稍高，用于客户对比',
                        value: undefined,
                        rules: [{
                        validate: val => !!val,
                        message: '请设置商品淘宝价'
                        }, {
                        validate: val => Number( val ) > 0,
                        message: '淘宝价不能为0'
                        }]
                    }, {
                        title: '其他信息',
                        desc: ''
                    }, {
                        key: 'desc',
                        label: '描述',
                        type: 'input',
                        placeholder: '如：护肤面膜Top3',
                        value: undefined,
                        rules: [ ]
                    }, {
                        key: 'tips',
                        label: '提示',
                        type: 'input',
                        placeholder: '一个字即可',
                        value: undefined,
                        rules: [ ]
                    }
                ];

        
                return meta;
            },
        });
    },

    /** 拉取数据字典 */
    fetchDic( ) {
        http({
            data: {
              dicName: 'goods_category',
            },
            url: `common_dic`,
            success: res => {
              if ( res.status !== 200 ) { return; }
              this.setData({
                dic: res.data
              });
            }
        });
    },

    /** 获取详情 */
    fetchDetatil( spid ) {
        if ( !spid ) { return; }
        http({
            data: {
                _id: spid
            },
            url: `super-goods_detail`,
            success: res => {
                const { status, data } = res;
                if ( status !== 200 ) { return; }

                const { title, detail, tag, category, img, fadePrice, tips, desc } = data; 
                const form1 = this.selectComponent('#form1');

                form1.set({
                    tag,
                    title,
                    detail,
                    fadePrice,
                    tips,
                    desc
                });

                this.setData({
                    category,
                    hasBeenUploaded: img
                })
            }
        });
    },

    /** 检查表单 */
    onCheck( ) {
        const form1 = this.selectComponent('#form1');
        const { result, data } = form1.getData( );

        if ( !result ) {
            wx.showToast({
              icon: 'none',
              title: '请完善商品信息',
            });
            return null;
        }

        return data;
    },

    /** 删除 */
    onDelete( ) {

    },

    /** 更新、创建 */
    onCreate( ) {
        const { spid } = this.data;
        const data = this.onCheck( );
        if ( !data ) { return; }
        http({
            data: {
                _id: spid,
                ...data
            },
            url: 'super-goods_create',
            success: res => {
                if ( res.status !== 200 ) { return; }
                wx.showToast({
                    title: spid ? '更新成功' : '创建成功'
                });
                wx.navigateBack({
                    delta: 1
                });
            }
        })
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.runComputed( );
        this.fetchDic( );

        const spid = options.spid;
        !!spid && this.setData({
            spid
        });

        this.fetchDetatil( spid );
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {

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
    onShareAppMessage: function () {

    }
})