// container/form/trip-detail/index.js
Component({

    behaviors: [require('../../../behaviores/computed/index.js')],
    /**
     * 组件的属性列表
     */
    properties: {
        // 行程id
        tid: {
            type: String,
            value: '',
            observer: 'fetchDetail'
        }
    },

    /**
     * 组件的初始数据
     */
    data: {
        // 数据字典
        dic: { },
        // 展开删除推荐
        showDelete: false,
        // 展开商品选择
        showProduct: false,
        // 选择推荐商品的id列表
        selectedProductIds: [ ],
        // 选择推荐商品的列表
        selectedProducts: [ ],
        // 选择中的推荐id
        selectingPid: '',
        // 行程满减 - 门槛
        fullreduce_atleast: null,
        // 行程满减 - 减多少
        fullreduce_values: null,
        // 行程满减modal
        showFullReduce: false
    },

    computed: {
        
        // 表单数据
        meta( ) {
            const now = new Date( );
            const year = now.getFullYear( );
            const month = now.getMonth( ) + 1;
            const date = now.getDate( );

            const meta = [
                {
                    title: '基本信息',
                    desc: ''
                }, {
                    key: 'title',
                    label: '行程名称',
                    type: 'input',
                    max: 50,
                    placeholder: '如：28号香港之旅',
                    value: undefined,
                    rules: [{
                      validate: val => !!val,
                      message: '行程名称不能为空'
                    }]
                }, {
                    key: 'destination',
                    label: '行程地点',
                    type: 'input',
                    max: 50,
                    placeholder: '如：香港',
                    value: undefined,
                    rules: [{
                      validate: val => !!val,
                      message: '行程目的地不能为空'
                    }]
                }, {
                    key: 'startDate',
                    label: '开始时间',
                    type: 'date',
                    start: `${year}-${String( month ).length < 2 ? '0' + month  : month}-${String( date ).length < 2 ? '0' + date  : date}`,
                    value: undefined,
                    rules: [{
                      validate: val => !!val,
                      message: '开始时间不能为空'
                    }]
                }, {
                    key: 'endDate',
                    label: '结束时间',
                    type: 'date',
                    start: `${year}-${String( month ).length < 2 ? '0' + month  : month}-${String( date ).length < 2 ? '0' + date  : date}`,
                    value: undefined,
                    rules: [{
                      validate: val => !!val,
                      message: '结束时间不能为空'
                    }]
                }, {
                    title: '推荐商品',
                    desc: ''
                }
            ];
            return meta;
        },

        // 表单数据2
        meta2( ) {
            const meta = [
                {
                    title: '营销工具',
                    desc: '裂变与粘性'
                }, {
                    key: 'reducePrice',
                    label: '行程立减',
                    type: 'number',
                    placeholder: '如立减5元，转发就能获得优惠',
                    value: undefined,
                    rules: [{
                        validate: val => !!val,
                        message: '请设置行程立减多少元'
                    }]
                },
            ];
            return meta;
        },

        // 行程满减 文字
        fullreducePrice( ) {
            const { fullreduce_atleast, fullreduce_values } = this.data;
            if ( fullreduce_atleast && fullreduce_values ) {
                return `满${fullreduce_atleast}减${fullreduce_values}元`;
            }
            return '';
        }

    },

    /**
     * 组件的方法列表
     */
    methods: {

        /** 拉取行程详情 */
        fetchDetail( tid ) {
            console.log( tid );
        },

        /** 展开/关闭商品选择 */
        onToggleProduct( ) {
            this.setData({
                showProduct: !this.data.showProduct
            });
        },

        /** 选择商品 */
        onConfirmProduct({ detail }) {
            if ( !detail ) { return; }
            const { _id } = detail;
            const product = detail.detail;
            const { selectedProductIds, selectedProducts } = this.data;
            
            // 如果未曾加入过
            if ( !selectedProductIds.find( x => x === _id )) {

                selectedProductIds.unshift( _id );
                selectedProducts.unshift( product );

                this.setData({
                    selectedProducts,
                    selectedProductIds
                });
            }

        },

        /** 展示/关闭推荐商品 */
        toggleDeleteRecommend({ currentTarget }) {
            this.setData({
                showDelete: !this.data.showDelete
            });
            if ( currentTarget.dataset.sid ) {
                this.setData({
                    selectingPid: currentTarget.dataset.sid
                });
            }
        },

        /** 确认删除推荐商品 */
        confirmDelete( ) {
            const { selectingPid, selectedProducts, selectedProductIds, showDelete } = this.data;
            const selectedProductIndex = selectedProducts.find( x => x._id === selectingPid );
            const selectedProductIdIndex = selectedProductIds.find( x => x === selectingPid );

            if ( selectedProductIndex !== -1 ) {
                selectedProducts.splice( selectedProductIndex, 1 );
            }
            if ( selectedProductIdIndex !== -1 ) {
                selectedProductIds.splice( selectedProductIdIndex, 1 );
            }

            this.setData({
                showDelete: false,
                selectingPid: '',
                selectedProducts,
                selectedProductIds
            })
        },

        /** 展示/关闭推荐商品 */
        toggleFullReduce( ) {
            this.setData({
                showFullReduce: !this.data.showFullReduce
            });
        },

        /** 行程满减输入 */
        onInputFullReduce( e ) {
            const { value } = e.detail;
            const { type } = e.currentTarget.dataset;
            if ( type === '1' ) {
                this.setData({
                    fullreduce_atleast: value
                });
            } else {
                this.setData({
                    fullreduce_values: value
                });
            }
        }

    }
})
