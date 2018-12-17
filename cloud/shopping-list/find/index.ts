/**
 * @param 
 */
const find$ = async( data: { tid?: string, pid?: string, sid?: string, status?: any }, db: DB.Database, ctx ) => {
    try {
        
        let filterData = { };
        Object.keys( data ).map( dataKey => {
            if ( !!data[ dataKey ]) {
                filterData[ dataKey ] = data[ dataKey ];
            }
        });

        const data$ = await db.collection('shopping-list')
            .where({
                ...filterData
            })
            .get( );
            
        return {
            status: 200,
            data: data$.data
        }

    } catch ( e ) {
        return ctx.body = { status: 500, message: e };
    }
}

export { find$ }