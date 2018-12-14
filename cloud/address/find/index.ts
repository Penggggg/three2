const find$ = async( event, context ) => {
    try {
        return { data: event };
    } catch ( e ) {
        return { status: 500, message: e };
    }
}

export { find$ }