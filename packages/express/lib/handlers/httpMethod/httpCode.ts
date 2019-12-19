import { StaticProvider } from "@nger/di";
import { ControllerMethodHandler, HttpCodeMetadataKey, ControllerFactory, RESPONSE } from "@nger/core";
import { Response } from "express";
import { IMethodDecorator } from '@nger/decorator';
const handler: ControllerMethodHandler<any, number> = (controller: ControllerFactory<any>, decorator: IMethodDecorator<any, number>) => {
    if (decorator.options) {
        const res = controller.injector.get<Response>(RESPONSE);
        res.status(decorator.options)
    }
}
export const headerHandlerProvider: StaticProvider = {
    provide: HttpCodeMetadataKey,
    useValue: handler
}