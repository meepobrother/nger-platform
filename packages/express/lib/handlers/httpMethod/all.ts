import { HttpMethodHandler, HttpResponseHandler, ResponseHandlerToken, GetOptions, ErrorHandler, RouterToken, AllMetadataKey, ControllerFactory } from "@nger/core";
import { InjectFlags, StaticProvider } from "@nger/di";
import { IRouter } from "express";
import { IMethodDecorator } from '@nger/decorator';
import { createGuard } from "../../createGuard";
const handler: HttpMethodHandler<any, GetOptions> = (instance: any, controller: ControllerFactory<any>, decorator: IMethodDecorator<any, GetOptions>) => {
    if (decorator.options) {
        const router = controller.injector.get<IRouter>(RouterToken);
        const errorHandler = controller.injector.get(ErrorHandler);
        const options = decorator.options;
        router.all(options.path, ...(options.useGuards || []).map(it => createGuard(controller, it)), (req, res, next) => {
            const call = Reflect.get(instance, decorator.property);
            if (call) {
                try {
                    const res = call.bind(instance)();
                    const handler = controller.injector.get<HttpResponseHandler<any>>(ResponseHandlerToken, null, InjectFlags.Optional)
                    if (handler) {
                        handler(res, controller.injector);
                    }
                } catch (e) {
                    errorHandler.handleError(e, controller.injector);
                }
            }
        })
    }
}
export const allHandlerProvider: StaticProvider = {
    provide: AllMetadataKey,
    useValue: handler
}