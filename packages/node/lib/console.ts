
export class Console {
    log(message?: any, ...optionalParams: any[]) {
        console.log(message, ...optionalParams)
    }
    info(message?: any, ...optionalParams: any[]) {
        console.info(message, ...optionalParams)
    }
    warn(message?: any, ...optionalParams: any[]) {
        console.warn(message, ...optionalParams)
    }
    error(message?: any, ...optionalParams: any[]) {
        console.error(message, ...optionalParams)
    }
}
