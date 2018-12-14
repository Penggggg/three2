/**
 * @param 
 */
const find$ = async( openid, data: { address?: string, username?: string, phone?: string }, db: DB.Database ) => {
    try {
        
        let filterData = { };
        Object.keys( data ).map( dataKey => {
            if ( !!data['dataKey']) {
                filterData[ dataKey ] = data[ dataKey ];
            }
        });

        const data$ = await db.collection('address')
            .where({
                openid,
                ...filterData
            })
            .get( );
            
        return {
            status: 200,
            data: data$.data
        }

    } catch ( e ) {
        return { status: 500, message: e };
    }
}

export { find$ }