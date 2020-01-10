import * as cloud from 'wx-server-sdk';
import * as CONFIG from './config';

export const subscribePush = async data => {
    try {
        const { type, texts, openid } = data;
        const page = data.page || 'pages/trip-enter/index';
        const template = CONFIG.subscribe_templates[ type ];
    
        let textData = { };
        texts.map(( text, k ) => {
            textData = {
                ...textData,
                [ template.textKeys[ k ]]: {
                    value: text
                }
            };
        });
    
        const subscribeData = {
            page,
            data: textData,
            touser: openid,
            templateId: template.id
        };
    
        console.log('==== 订阅推送 定时器 ====', subscribeData );
        const send$ = await cloud.openapi.subscribeMessage.send( subscribeData );
        console.log('==== 订阅推送 定时器 ====', send$ );
    } catch ( e ) { }
};