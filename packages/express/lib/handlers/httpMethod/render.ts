import { HttpMethodHandler, RenderMetadataKey, ResponseToken, ControllerFactory } from "@nger/core";
import { StaticProvider } from "@nger/di";
import { Response } from "express";
import { IMethodDecorator } from '@nger/decorator';
const handler: HttpMethodHandler<any, string> = (instance: any, controller: ControllerFactory<any>, decorator: IMethodDecorator<any, string>) => {
    if (decorator.options) {
        const res = controller.injector.get<Response>(ResponseToken);
        const options = decorator.options;
        res.render(options)
    }
}
export const headerHandlerProvider: StaticProvider = {
    provide: RenderMetadataKey,
    useValue: handler
}