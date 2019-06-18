const app = getApp( );
const { http } = require('../../util/http.js');

Component({
    /**
     * 组件的属性列表
     */
    properties: {

        // 是否为新客
        isNew: {
            type: Boolean,
            value: true,
        },

        // 是否要付订金
        shouldPrepay: {
            type: Boolean,
            value: true,
        },

        // 展开
        open: {
            type: Boolean,
            value: false,
            observer: 'toggleAnimate'
        },
        // sku展示队列 _id, canSelect是否能选、 title名称、price价格、stock库存、pid产品id、sid型号id、img图片、limit限购数量、count已选数量
        skuItems: {
            type: Array,
            value: [ ],
            observer: 'initSelectedSku'
        },
        // 商品订金
        depositPrice: {
            type: Number,
            value: 0,
        }
    },

    /**
     * 组件的初始数据
     */
    data: {
        // 动画
        animationSku: null,
        // 动画
        animationSkuBg: null,
        // 展开sku
        openSku: false,
        // sku展示队列 _id, canSelect是否能选、 title名称、price价格、stock库存、pid产品id、sid型号id、img图片、limit限购数量
        // skuItems: [ ],
        // 选中的 sku
        selectedSku: null,
        // 所选sku的购买数量
        selectdSkuCount: 1,
        /** 是否进行了用户授权 */
        isUserAuth: false,
    },

    /**
     * 组件的方法列表
     */
    methods: {
        /** 创建动画 */
        toggleAnimate( e ) {
            
            const { open } = this.data;
            const animationSkuMeta = wx.createAnimation({ 
                duration: 50,
                duration: 250, 
                timingFunction: 'ease-out', 
                transformOrigin: '50% 50%',
            });

            const animationSkuBgMeta = wx.createAnimation({ 
                duration: 250, 
                timingFunction: 'ease-out', 
                transformOrigin: '50% 50%',
            });
            
            if ( open ) {
                animationSkuMeta.opacity( 0.3 ).translateY( '-60vh' ).opacity( 1 ).step( );
                animationSkuBgMeta.opacity( 1 ).step( );
            } else {
                animationSkuMeta.opacity( 0.5 ).translateY( '60vh' ).opacity( 0 ).step( );
                animationSkuBgMeta.opacity( 0 ).step( );
            }

            this.setData({
                animationSku: animationSkuMeta.export( ),
                animationSkuBg: animationSkuBgMeta.export( )
            })
        },
        /** 预览图片 */
        previewImg({ currentTarget }) {
            const img = currentTarget.dataset.img;
            wx.previewImage({
                current: img,
                urls: [ img ]
            });
        },
        /** 初始化sku，排第一位的会被默认选中 */
        initSelectedSku( val ) {
       
            const skus  = this.data.skuItems;
            if ( !skus || skus.length === 0 ) { return; }

            this.setData({
                selectedSku: skus[ 0 ]
            })

            if ( skus[ 0 ].count ) {
                this.setData({
                    selectdSkuCount: skus[ 0 ].count
                });
            }

        },
        /** 禁止滑动 */
        preventTouchMove( ) {

        },
        /** 选择 sku */
        onSelectSku({ currentTarget }) {
            const tappingSku = currentTarget.dataset.standard;
            if ( !tappingSku.canSelect ) { return; }
            this.setData({
                selectdSkuCount: 1,
                selectedSku: tappingSku
            });
        },
        /** sku 数量 */
        onSkuCount({ detail }) {
            this.setData({
                selectdSkuCount: detail.number
            });
        },
        /** 确认 */
        confirmSelect( e ) {

            app.getWxUserInfo(( ) => {
                const { selectdSkuCount, selectedSku, skuItems } = this.data;
                this.triggerEvent('confirm', {
                    sku: Object.assign({ }, { ...selectedSku }, {
                        count: selectdSkuCount
                    }),
                    form_id: e ? e.detail.formId : 0
                }, null );
                this.triggerEvent('close', false, null );
            });

            this.createFormId( e.detail.formId );
        },
        /** 关闭弹窗 */
        close( ) {
            this.triggerEvent('close', false, null );
        },
        /** 监听用户授权情况 */
        checkAuth( ) {
            app.watch$('isUserAuth', val => {
                if ( val === undefined ) { return; }
                this.setData({
                    isUserAuth: val
                });
            });
        },
        getUserAuth( ) {
            app.getWxUserInfo(( ) => {
                // 进行确认
                this.confirmSelect( );
            });
        },
        // 添加一个formid
        createFormId( formid ) {
            if ( !formid ) { return; }
            http({
                data: {
                    formid
                },
                loadingMsg: 'none',
                url: 'common_create-formid',
            })
        }
    },

    attached: function( ) {
        this.checkAuth( );
    }

})
