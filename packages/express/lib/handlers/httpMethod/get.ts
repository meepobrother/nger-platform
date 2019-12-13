import { HttpMethodHandler, HttpResponseHandler, ControllerFactory, GetMetadataKey, GetOptions, ResponseHandlerToken, ErrorHandler, RouterToken } from "@nger/core";
import { Provider, InjectFlags, StaticProvider } from "@nger/di";
import { IRouter } from "express";
import { IMethodDecorator } from '@nger/decorator';
import { createGuard } from "../../createGuard";
const handler: HttpMethodHandler<any, GetOptions> = (instance: any, controller: ControllerFactory<any>, decorator: IMethodDecorator<any, GetOptions>) => {
    if (decorator.options) {
        const router = controller.injector.get<IRouter>(RouterToken);
        const errorHandler = controller.injector.get(ErrorHandler);
        const path = decorator.options.path;
        router.get(path, ...(decorator.options.useGuards || []).map(it => createGuard(controller, it)), () => {
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
export const getHandlerProvider: StaticProvider = {
    provide: GetMetadataKey,
    useValue: handler
}