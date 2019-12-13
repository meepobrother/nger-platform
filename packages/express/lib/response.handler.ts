import { ResponseToken, isPromise, isObservable, ResponseHandlerToken, ErrorHandler, Injector, StaticProvider } from '@nger/core';
import { Response } from 'express';
export const responseHandler: StaticProvider = {
    provide: ResponseHandlerToken,
    useValue: (item: any, injector: Injector) => {
        const response = injector.get<Response>(ResponseToken)
        const errorHandler = injector.get(ErrorHandler)
        if (isPromise(item)) {
            item.then(it => response.send(it))
        }
        else if (isObservable(item)) {
            let obj = {};
            item.subscribe((res: any) => {
                if (typeof res === 'object') {
                    obj = {
                        ...obj,
                        ...res
                    }
                } else {
                    obj = res;
                }
            }, (err: Error) => {
                errorHandler.handleError(err, injector);
            }, () => {
                response.send(obj)
            });
        }
        else if (item) {
            response.send(item)
        } else {
            response.status(200).end();
        }
    }
}