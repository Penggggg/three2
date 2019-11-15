import { http } from './http';

const createFormId = formid => {
    if ( true || !formid ) { return; }
    return http({
        data: {
            formid
        },
        loadingMsg: 'none',
        url: 'common_create-formid',
    })
};

export { createFormId };