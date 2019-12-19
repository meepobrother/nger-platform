import { ControllerMethodHandler, RedirectMetadataKey, Redirect, RESPONSE, ControllerFactory } from "@nger/core";
import { StaticProvider } from "@nger/di";
import { Response } from "express";
import { IMethodDecorator } from '@nger/decorator';
const handler: ControllerMethodHandler<any, Redirect> = (controller: ControllerFactory<any>, decorator: IMethodDecorator<any, Redirect>) => {
    if (decorator.options) {
        const res = controller.injector.get<Response>(RESPONSE);
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