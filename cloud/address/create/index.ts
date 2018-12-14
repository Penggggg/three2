const main = async( event, context ) => {
    try {
        return { data: event };
    } catch ( e ) {
        return { status: 500, message: e };
    }
}

export { main }