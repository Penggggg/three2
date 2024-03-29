const app = getApp( );
const { navTo } = require('../../util/route.js');

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
        /** 背景透明 */
        transparent: {
            type: Boolean,
            value: false
        },
        /** 展示“下次使用” */
        showNext: {
            type: Boolean,
            value: false
        },
        /** 跳到行程还是券列表 */
        gotoTrip: {
            type: Boolean,
            value: true
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
            if ( !trip ) { return }
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
        },

        /** 跳到行程入口 */
        goTrip( ) {
            const { showNext, gotoTrip } = this.data;
            this.triggerEvent('close', '');
            navTo( gotoTrip ? `/pages/trip-enter/index` : `/pages/coupon-list/index`) 
        }

    }
})
