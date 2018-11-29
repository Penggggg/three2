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
        // 展开商品选择
        showProduct: false
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
            })
        },

    }
})
