Component({
    /**
     * 组件的属性列表
     */
    properties: {
        // t_manjian/t_lijian/t_daijin
        type: {
            type: String
        },
        value: {
            type: Number
        },
        atleast: {
            type: Number
        },
        trip: {
            type: Object,
            observer: 'dealtrip'
        },
        isUsed: {
            type: Boolean,
            value: false
        },
        title: {
            type: String
        },
        canUseInNext: {
            type: Boolean,
            value: false
        }
    },

    /**
     * 组件的初始数据
     */
    data: {
        trip_start: '',
        trip_end: ''
    },

    /**
     * 组件的方法列表
     */
    methods: {

        /** 处理行程 */
        dealtrip( trip ) {
            const start = new Date( trip.start_date );
            const end = new Date( trip.end_date );
            const m1 = start.getMonth( ) + 1;
            const m2 = end.getMonth( ) + 1;
            const d1 = start.getDate( );
            const d2 = end.getDate( );
            this.setData({
                trip_end: `${m2}月${d2}日`,
                trip_start: `${m1}月${d1}日`
            });
        }

    }
})
