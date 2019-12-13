import { StaticProvider } from "@nger/di";
import { HttpMethodHandler, HttpCodeMetadataKey, ControllerFactory, ResponseToken } from "@nger/core";
import { Response } from "express";
import { IMethodDecorator } from '@nger/decorator';
const handler: HttpMethodHandler<any, number> = (instance: any, controller: ControllerFactory<any>, decorator: IMethodDecorator<any, number>) => {
    if (decorator.options) {
        const res = controller.injector.get<Response>(ResponseToken);
        res.status(decorator.options)
    }
}
export const headerHandlerProvider: StaticProvider = {
    provide: HttpCodeMetadataKey,
    useValue: handler
}