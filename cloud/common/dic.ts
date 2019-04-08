export default [
    {
        desc: '商品类目',
        belong: 'goods_category',
        goods_category: [
            {
                label: '口碑护肤',
                value: '0'
            }, {
                label: '优选彩妆',
                value: '1'
            }, {
                label: '数码产品',
                value: '2'
            }, {
                label: '服饰鞋靴',
                value: '3'
            }, {
                label: '营养保健',
                value: '4'
            }
        ]
    }, {
        desc: '付款方式',
        belong: 'payment',
        payment: [
            {
                label: '新客付订金/旧客免订金',
                value: '0'
            }, {
                label: '所有人付订金',
                value: '1'
            }, {
                label: '所有人免订金',
                value: '2'
            }
        ]
    }, {
        desc: '邮费付款',
        belong: 'postage',
        postage: [
            {
                label: '满¥免邮',
                value: '0'
            }, {
                label: '本行程包邮',
                value: '1'
            }, {
                label: '本行程不包邮',
                value: '2'
            }
        ]
    }
]