const { http } = require('../../util/http.js');
const { delayeringGood } = require('../../util/goods.js');

Component({
    
    behaviors: [require('../../behaviores/computed/index.js')],
    /**
     * 组件的属性列表
     */
    properties: {

        // 分类
        classify: {
            type: String,
            observer: 'onClassifyChange'
        },

        // 行程id
        tid: {
            type: String,
            value: ''
        }
    },

    /**
     * 组件的初始数据
     */
    data: {

        // 当前的分类
        classify: '',

        // 搜索页
        page: 0,

        // 搜索结果
        result: [ ],

        /** 能否记载更多 */
        canLoadMore: true,

        /** loading */
        loading: false,

        /** 搜索 */
        search: ''

    },

    computed: {
        
        // 表单数据
        result$( ) {
            const { result } = this.data;

            const changeSort = arr => {
                const arr1 = arr.filter(( x, k ) => k % 2 === 0 );
                const arr2 = arr.filter(( x, k ) => k % 2 === 1 )
                return [ ...arr1, ...arr2 ]
            };

            return changeSort( result ).map( delayeringGood );
        }
    },

    /**
     * 组件的方法列表
     */
    methods: {

        /** 商品列表类型变更 */
        onClassifyChange( classify ) {
            this.setData({
                page: 0,
                classify,
                search: '',
                lastsearch: '',
                loading: false,
                canLoadMore: true
            });
            this.fetchClassify( );
        },

        /** 拉取商品列表 */
        fetchClassify( ) {
            const { page, result, classify, canLoadMore, loading, search } = this.data;

            if ( !canLoadMore || loading ) { return; }

            this.setData({
                loading: true,
            })

            // 搜索
            http({
                data: {
                    search,
                    page: page + 1,
                    category: classify,
                },
                url: 'good_client-search',
                success: res => {

                    const { status, data } = res;
                    this.setData({ loading: false });

                    if ( status !== 200 ) { return; }
                    
                    const { page, totalPage } = data;
                    this.setData({
                        page,
                        canLoadMore: totalPage > page,
                        result: page === 1 ?
                            data.data :
                            [ ...result, ...data.data ]
                    });
    
                }
            });
        },

        /** 确定搜索 */
        onConfirm( e ) {
            this.setData({
                page: 0,
                search: e.detail,
                canLoadMore: true
            });
            this.fetchClassify( )
        }

    }
})
