import { StaticProvider } from "@nger/di";
import { ControllerMetadataKey, RequestToken, ResponseToken, NextToken, ControllerFactory, ControllerOptions, AppToken, RouterToken } from "@nger/core";
import { IClassDecorator } from '@nger/decorator';
import { createGuard } from "../createGuard";
import { Express, Router } from "express-serve-static-core";
export const controllerProvider: StaticProvider = {
    provide: ControllerMetadataKey,
    useValue: (ctrl: ControllerFactory<any>, it: IClassDecorator<any, ControllerOptions>) => {
        const app = ctrl.injector.get<Express>(AppToken);
        const router = ctrl.injector.get<Router>(RouterToken)
        if (it.options) {
            const options = it.options;
            app.use(options.path, ...(options.useGuards || []).map(it => createGuard(ctrl, it)), (req, res, next) => {
                ctrl.injector.setStatic([{
                    provide: RequestToken,
                    useValue: req
                }, {
                    provide: ResponseToken,
                    useValue: res
                }, {
                    provide: NextToken,
                    useValue: next
                }])
                router(req, res, next)
            });
        }
    }
}