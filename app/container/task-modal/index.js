const { http } = require('../../util/http.js');
const { navTo } = require('../../util/route.js');
const { computed } = require('../../lib/vuefy/index.js');
const { createFormId } = require('../../util/form-id.js');

const app = getApp( );

Component({
    /**
     * 组件的属性列表
     */
    properties: {

    },

    /**
     * 组件的初始数据
     */
    data: {

    },

    /**
     * 组件的方法列表
     */
    methods: {
        /** 获取拼团任务情况 */
        fetchPinTask( ) {
            http({
                data: { },
                url: 'shopping-list_pin-task',
                success: res => {
                    const { status, data } = res;
                    if ( status !== 200 ) { return; }
                }
            });
        }
    },

    attached: function( ) {
        this.fetchPinTask( );
    }
})
