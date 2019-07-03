import dicConf from './dic';
import appConf from './app-config';

/** app */
export const app = {
    id: 'wx46190709a1df31ab',
    secrect: '78d9b8f5371cacf3e887e6dcd531da3b'
}

/** 推送模版 */
export const notification_template = {
    getMoney3: '7TDuFkSVtVULTwAebcxmsJCK3Ts3vGqDli0jGf6WXNI'// 购买成功通知
}

/** 推送模板服务 */
export const push_template = {
    buyPin: {
        desc: '拼团成功通知：拼团状态、成团条件',
        example: '拼团成功！恭喜您省了xx元！;您和其他人买了同款拼团商品，点击查看',
        example2: '恭喜拼团成功！您购买的商品可减${delta}元!有人与你买了同款拼团的商品，点击查看',
        value: 'VdCtZLqbawiHC1EDY3k1XuVT30CM34M_lSkWNmONlIg'
    },
    waitPin: {
        desc: '拼团待成团提醒：	备注、温馨提示',
        example: '您购买的商品可参加拼团！；立即参加拼团，可以再省xx元！',
        value: 'GOT5PcxD3KDYrO1YnEXuGmNdzBrrMuOSLP6vUJBTmyI'
    },
    buy: {
        desc: '购买成功通知：备注、时间',
        example: '下单成功！会尽快采购～；x月x日 15:00',
        value: '7TDuFkSVtVULTwAebcxmsGud7deYYs3SeHrf_vWnlvY'
    },
    getMoney: {
        desc: '尾款支付提醒：温馨提示、截止时间',
        example: '支付尾款，立即发货哦；越快越好',
        value: 'mgmsCeFK1w1vRom3MwwICSs2csS7QiWVMXFMPtEQvSc'
    }, 
    newOrder: {
        desc: '新订单通知：订单详情、订单状态',
        example: '你有x条新订单；点击查看',
        value: 'aBjeOjBH8Zp9B60FwEbJKvwKZF_IJEBKQtWRMSaecrQ'
    }
};

/** 微信支付 */
export const wxPay = {
    mch_id: '1534060231', // 商户号
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
    'analyse-data'
];

/** 权限模块 */
export const auth = {
    salt: 'hzpisbest'
}

/** 数据字典 */
export const dic = dicConf;

/** 应用配置 */
export const appConfs = appConf;