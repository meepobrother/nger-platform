import { HttpMethodHandler, HttpResponseHandler, ErrorHandler, ResponseHandlerToken, RouterToken, ControllerFactory, OptionsMetadataKey, GetOptions } from "@nger/core";
import { Provider, InjectFlags, StaticProvider } from "@nger/di";
import { IRouter } from "express";
import { IMethodDecorator } from '@nger/decorator';
import { createGuard } from "../../createGuard";
import { appendReq } from "./util";
const handler: HttpMethodHandler<any, GetOptions> = (controller: ControllerFactory<any>, decorator: IMethodDecorator<any, GetOptions>) => {
    if (decorator.options) {
        const router = controller.injector.get<IRouter>(RouterToken);
        const errorHandler = controller.injector.get(ErrorHandler);
        router.options(decorator.options.path, ...(decorator.options.useGuards || []).map(it => createGuard(controller, it)), (req, res, next) => {
            appendReq(req, res, next, controller.injector);
            const instance = controller.create();
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
export const optionsHandlerProvider: StaticProvider = {
    provide: OptionsMetadataKey,
    useValue: handler
}