import { HttpMethodHandler, HttpResponseHandler, ControllerFactory, ErrorHandler, DeleteMetadataKey, GetOptions, ResponseHandlerToken, RouterToken } from "@nger/core";
import { Provider, InjectFlags, StaticProvider } from "@nger/di";
import { IRouter } from "express";
import { IMethodDecorator } from '@nger/decorator';
import { createGuard } from "../../createGuard";
const handler: HttpMethodHandler<any, GetOptions> = (instance: any, controller: ControllerFactory<any>, decorator: IMethodDecorator<any, GetOptions>) => {
    if (decorator.options) {
        const router = controller.injector.get<IRouter>(RouterToken);
        const errorHandler = controller.injector.get(ErrorHandler);
        router.delete(decorator.options.path, ...(decorator.options.useGuards || []).map(it => createGuard(controller, it)), () => {
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
export const deleteHandlerProvider: StaticProvider = {
    provide: DeleteMetadataKey,
    useValue: handler
}