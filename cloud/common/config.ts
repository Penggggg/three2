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
];

/** 权限模块 */
export const auth = {
    salt: 'hzpisbest'
}

/** 数据字典 */
export const dic = dicConf;

/** 应用配置 */
export const appConfs = appConf;