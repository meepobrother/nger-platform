import { HttpMethodHandler, Header, ControllerFactory, HeaderMetadataKey, ResponseToken } from "@nger/core";
import { StaticProvider } from "@nger/di";
import { Response } from "express";
import { IMethodDecorator } from '@nger/decorator';
const handler: HttpMethodHandler<any, Header> = (instance: any, controller: ControllerFactory<any>, decorator: IMethodDecorator<any, Header>) => {
    if (decorator.options) {
        const res = controller.injector.get<Response>(ResponseToken);
        const options: Header = decorator.options;
        Object.keys(options).map(key => {
            const val = options[key]
            res.header(key, val)
        });
    }
}
export const headerHandlerProvider: StaticProvider = {
    provide: HeaderMetadataKey,
    useValue: handler
}