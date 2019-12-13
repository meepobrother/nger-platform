import { HttpMethodHandler, RedirectMetadataKey, Redirect, ResponseToken, ControllerFactory } from "@nger/core";
import { StaticProvider } from "@nger/di";
import { Response } from "express";
import { IMethodDecorator } from '@nger/decorator';
const handler: HttpMethodHandler<any, Redirect> = (instance: any, controller: ControllerFactory<any>, decorator: IMethodDecorator<any, Redirect>) => {
    if (decorator.options) {
        const res = controller.injector.get<Response>(ResponseToken);
        const options = decorator.options;
        if (options.code) {
            res.redirect(options.url, options.code)
        } else {
            res.redirect(options.url)
        }
    }
}
export const headerHandlerProvider: StaticProvider = {
    provide: RedirectMetadataKey,
    useValue: handler
}