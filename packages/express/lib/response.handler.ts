import { ResponseToken, isPromise, isObservable, HttpCode, ResponseHandlerToken, ErrorHandler, Injector, StaticProvider } from '@nger/core';
import { Response } from 'express';
const handler = (item: any, injector: Injector) => {
    const response = injector.get<Response>(ResponseToken)
    const errorHandler = injector.get(ErrorHandler)
    if (isPromise(item)) {
        item.then(it => handler(it, injector))
    }
    else if (isObservable(item)) {
        let obj = {};
        item.subscribe((res: any) => {
            obj = res;
        }, (err: Error) => {
            errorHandler.handleError(err, injector);
        }, () => {
            handler(obj, injector)
        });
    } else if (typeof item === 'object') {
        response.type('json');
        response.json(item)
    } else if (typeof item === 'number') {
        response.send(`${item}`)
    } else if (typeof item === 'string') {
        response.send(item)
    } else if (typeof item === 'boolean') {
        response.send(`${item}`)
    } else if (typeof item === 'function') {
        response.sendStatus(503).send('can not send a function')
    } else if (typeof item === 'undefined') {
        // response.sendStatus(200)
    } else {
        // response.sendStatus(200)
    }
}
export const responseHandler: StaticProvider = {
    provide: ResponseHandlerToken,
    useValue: handler
}