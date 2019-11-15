import dicConf from './dic';
import appConf from './app-config';

/** app */
export const app = {
    id: 'wx60bf7f745ce31ef0',
    secrect: '6c8ff31489cce7dd4edf0b1843b7b0f5'
}

/** 推送模版 */
export const notification_template = {
    getMoney3: 'fCvCrY8_5l60svPglMvQdO1sulAZQUTcOt3hdtrDIsw'// 业务受理通知
}

/** 推送模板服务 */
export const push_template = {
    buyPin: {
        desc: '拼团成功通知：拼团状态、成团条件',
        example: '拼团成功！恭喜您省了xx元！;您和其他人买了同款拼团商品，点击查看',
        example2: '恭喜拼团成功！您购买的商品可减${delta}元!有人与你买了同款拼团的商品，点击查看',
        value: 'aONKtxqum1Jn15jKVOVGqNzCSfA0f_n6j_0BLASYCDg'
    },
    waitPin: {
        desc: '拼团待成团提醒：	备注、温馨提示',
        example: '您购买的商品可参加拼团！；立即参加拼团，可以再省xx元！',
        value: 'mtTLIp2C-FQ87yn46jpY3cH9ilGIzL434N2QlUS0MH0'
    },
    buy: {
        desc: '购买成功通知：备注、时间',
        example: '下单成功！会尽快采购～；x月x日 15:00',
        value: 'fWj6ya_Jn8LNb7W2Du35ZcsWwBveAy2pjgzx8xChjhk'
    },
    getMoney: {
        desc: '尾款支付提醒：温馨提示、截止时间',
        example: '支付尾款，立即发货哦；越快越好',
        value: 'qKwF8caYQADJ6lTcnETexy0hqi11Sq1dhksNOHBqOdQ'
    }, 
    newOrder: {
        desc: '新订单通知：订单详情、订单状态',
        example: '你有x条新订单；点击查看',
        value: 'TQmlCntkDc1a8CuoEP9gNDDAhOJVf4QTPpcfWLf0svQ'
    },
    trip: {
        desc: '行程提醒：行程名称、行程备注',
        value: 'XoXY8XWf6EiymW7tYDPkHDD4Vcdh-BqP1ycXbPko-ZU',
        example: '【名称】；发布成功，并开通新订单推送',
        example2: '【名称】；关闭行程成功，一键收款功能已开启',
        example3: '【名称】；【时间】开始采购，拼团越优惠',
    },
    hongbao: {
        desc: '领取成功通知：领取金额、适用范围',
        value: 'I_yZjUxTJklPGDVrB-btt82F5z687_2cpTx1Mie_t9A',
        example: '恭喜获得红包【金额】元；趁早下单！无门槛立减【金额】元',
        example4: '恭喜！获得【金额】现金积分；推广成功！有人购买了你分享的商品'
    }
};

/** 订阅服务类型 */
export const subscribe_templates = {
    buyPin: {
        desc: '开奖结果通知：开奖结果、开奖内容',
        id: 'rau9z8QU48gWel5Jn8hLt6-ChVWi8puo8E_QXR1CgMc'
    },
    waitPin: {
        desc: '活动开始提醒：温馨提示、活动内容',
        id: 'u91Cqoo76phn_0o5N_Jdqz62rry4UdyIR6SyjRsZy0w'
    },
    buy: {
        desc: '订单状态通知： 订单状态、备注',
        id: 'hAU2bG9eeGDr0KeOIcM_StBIMa5tJj8D2P8vibDavLQ'
    },
    getMoney: {
        desc: '尾款支付提醒：温馨提示、时间期限',
        id: 'is_8EPAO0WvaKoG7eDdLcLF7PXYZJYGa04BpOIuegpo'
    }, 
    newOrder: {
        desc: '新订单提醒: 订单状态、购买商品',
        id: 'Onl9TTI33fTvg5K7AHydhNgMP1HmTJ22osUMzVBmSBQ'
    },
    trip: {
        desc: '活动开始提醒：温馨提示、活动内容',
        id: 'u91Cqoo76phn_0o5N_Jdqz62rry4UdyIR6SyjRsZy0w'
    },
    hongbao: {
        desc: '开奖结果通知：开奖结果、开奖内容',
        id: 'rau9z8QU48gWel5Jn8hLt6-ChVWi8puo8E_QXR1CgMc'
    }
};

/** 微信支付 */
export const wxPay = {
    mch_id: '1521522781', // 商户号
    key: 'a92006250b4ca9247c02edce69f6a21a', // 这个是商户号设置的key
    body: '微信支付', // 简单描述
    attach: 'anything', // 附加数据
    notify_url: 'https://whatever.com/notify', // 回调
    spbill_create_ip: '118.89.40.200'
}

/** 数据库 */
export const collections = [
    'activity',
    'address',
    'deliver-fee',
    'app-config',
    'like-collection',
    'cart',
    'dic',
    'user',
    'manager-wx-info',
    'order',
    'coupon',
    'goods',
    'shopping-list',
    'trip',
    'standards',
    'deliver',
    'authpsw',
    'manager-member',
    'form-ids',
    'analyse-data',
    'share-record',
    'integral-use-record',
    'push-timer'
];

/** 权限模块 */
export const auth = {
    salt: 'hzpisbest'
}

/** 数据字典 */
export const dic = dicConf;

/** 应用配置 */
export const appConfs = appConf;