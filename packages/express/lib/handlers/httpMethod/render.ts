import { ControllerMethodHandler, RenderMetadataKey, RESPONSE, ControllerFactory } from "@nger/core";
import { StaticProvider } from "@nger/di";
import { Response } from "express";
import { IMethodDecorator } from '@nger/decorator';
const handler: ControllerMethodHandler<any, string> = (controller: ControllerFactory<any>, decorator: IMethodDecorator<any, string>) => {
    if (decorator.options) {
        const res = controller.injector.get<Response>(RESPONSE);
        const options = decorator.options;
        res.render(options)
    }
}
export const headerHandlerProvider: StaticProvider = {
    provide: RenderMetadataKey,
    useValue: handler
}