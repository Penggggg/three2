"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = [
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
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGljLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiZGljLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsa0JBQWU7SUFDWDtRQUNJLElBQUksRUFBRSxNQUFNO1FBQ1osTUFBTSxFQUFFLGdCQUFnQjtRQUN4QixjQUFjLEVBQUU7WUFDWjtnQkFDSSxLQUFLLEVBQUUsTUFBTTtnQkFDYixLQUFLLEVBQUUsR0FBRzthQUNiLEVBQUU7Z0JBQ0MsS0FBSyxFQUFFLE1BQU07Z0JBQ2IsS0FBSyxFQUFFLEdBQUc7YUFDYixFQUFFO2dCQUNDLEtBQUssRUFBRSxNQUFNO2dCQUNiLEtBQUssRUFBRSxHQUFHO2FBQ2IsRUFBRTtnQkFDQyxLQUFLLEVBQUUsTUFBTTtnQkFDYixLQUFLLEVBQUUsR0FBRzthQUNiLEVBQUU7Z0JBQ0MsS0FBSyxFQUFFLE1BQU07Z0JBQ2IsS0FBSyxFQUFFLEdBQUc7YUFDYjtTQUNKO0tBQ0osRUFBRTtRQUNDLElBQUksRUFBRSxNQUFNO1FBQ1osTUFBTSxFQUFFLFNBQVM7UUFDakIsT0FBTyxFQUFFO1lBQ0w7Z0JBQ0ksS0FBSyxFQUFFLGFBQWE7Z0JBQ3BCLEtBQUssRUFBRSxHQUFHO2FBQ2IsRUFBRTtnQkFDQyxLQUFLLEVBQUUsUUFBUTtnQkFDZixLQUFLLEVBQUUsR0FBRzthQUNiLEVBQUU7Z0JBQ0MsS0FBSyxFQUFFLFFBQVE7Z0JBQ2YsS0FBSyxFQUFFLEdBQUc7YUFDYjtTQUNKO0tBQ0osRUFBRTtRQUNDLElBQUksRUFBRSxNQUFNO1FBQ1osTUFBTSxFQUFFLFNBQVM7UUFDakIsT0FBTyxFQUFFO1lBQ0w7Z0JBQ0ksS0FBSyxFQUFFLE1BQU07Z0JBQ2IsS0FBSyxFQUFFLEdBQUc7YUFDYixFQUFFO2dCQUNDLEtBQUssRUFBRSxPQUFPO2dCQUNkLEtBQUssRUFBRSxHQUFHO2FBQ2IsRUFBRTtnQkFDQyxLQUFLLEVBQUUsUUFBUTtnQkFDZixLQUFLLEVBQUUsR0FBRzthQUNiO1NBQ0o7S0FDSjtDQUNKLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgZGVmYXVsdCBbXG4gICAge1xuICAgICAgICBkZXNjOiAn5ZWG5ZOB57G755uuJyxcbiAgICAgICAgYmVsb25nOiAnZ29vZHNfY2F0ZWdvcnknLFxuICAgICAgICBnb29kc19jYXRlZ29yeTogW1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIGxhYmVsOiAn5Y+j56KR5oqk6IKkJyxcbiAgICAgICAgICAgICAgICB2YWx1ZTogJzAnXG4gICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgbGFiZWw6ICfkvJjpgInlvanlpoYnLFxuICAgICAgICAgICAgICAgIHZhbHVlOiAnMSdcbiAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICBsYWJlbDogJ+aVsOeggeS6p+WTgScsXG4gICAgICAgICAgICAgICAgdmFsdWU6ICcyJ1xuICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICAgIGxhYmVsOiAn5pyN6aWw6Z6L6Z20JyxcbiAgICAgICAgICAgICAgICB2YWx1ZTogJzMnXG4gICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgbGFiZWw6ICfokKXlhbvkv53lgaUnLFxuICAgICAgICAgICAgICAgIHZhbHVlOiAnNCdcbiAgICAgICAgICAgIH1cbiAgICAgICAgXVxuICAgIH0sIHtcbiAgICAgICAgZGVzYzogJ+S7mOasvuaWueW8jycsXG4gICAgICAgIGJlbG9uZzogJ3BheW1lbnQnLFxuICAgICAgICBwYXltZW50OiBbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgbGFiZWw6ICfmlrDlrqLku5jorqLph5Ev5pen5a6i5YWN6K6i6YeRJyxcbiAgICAgICAgICAgICAgICB2YWx1ZTogJzAnXG4gICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgbGFiZWw6ICfmiYDmnInkurrku5jorqLph5EnLFxuICAgICAgICAgICAgICAgIHZhbHVlOiAnMSdcbiAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICBsYWJlbDogJ+aJgOacieS6uuWFjeiuoumHkScsXG4gICAgICAgICAgICAgICAgdmFsdWU6ICcyJ1xuICAgICAgICAgICAgfVxuICAgICAgICBdXG4gICAgfSwge1xuICAgICAgICBkZXNjOiAn6YKu6LS55LuY5qy+JyxcbiAgICAgICAgYmVsb25nOiAncG9zdGFnZScsXG4gICAgICAgIHBvc3RhZ2U6IFtcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBsYWJlbDogJ+a7ocKl5YWN6YKuJyxcbiAgICAgICAgICAgICAgICB2YWx1ZTogJzAnXG4gICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgbGFiZWw6ICfmnKzooYznqIvljIXpgq4nLFxuICAgICAgICAgICAgICAgIHZhbHVlOiAnMSdcbiAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICBsYWJlbDogJ+acrOihjOeoi+S4jeWMhemCricsXG4gICAgICAgICAgICAgICAgdmFsdWU6ICcyJ1xuICAgICAgICAgICAgfVxuICAgICAgICBdXG4gICAgfVxuXSJdfQ==