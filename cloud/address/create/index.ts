const create$ = async( openid, data, db: DB.Database ) => {
    try {
        const create$ = await db.collection('address')
            .add({
                data: Object.assign({ }, data, {
                    openid
                })
            });
        return {
            status: 200,
            data: create$
        }
    } catch ( e ) {
        return { status: 500, message: e };
    }
}

export { create$ }