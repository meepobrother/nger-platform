import { StaticProvider, InjectionToken } from "@nger/di";
import {
    REQUEST, RESPONSE,
    NEXT, ControllerFactory, ControllerOptions, APP_ID, ROUTER,
    REQUEST_ID
} from "@nger/core";
import { IClassDecorator } from '@nger/decorator';
import { createGuard } from "../createGuard";
import { Express, Router } from "express-serve-static-core";
import { createCid } from "./util";
const multihash = require('multihashes')
export const HttpControllerToken = new InjectionToken(`HttpControllerToken`)
export const controllerProvider: StaticProvider = {
    provide: HttpControllerToken,
    useValue: (ctrl: ControllerFactory<any>, it: IClassDecorator<any, ControllerOptions>) => {
        const app = ctrl.injector.get<Express>(APP_ID);
        const router = ctrl.injector.get<Router>(ROUTER)
        if (it.options) {
            const options = it.options;
            app.use(options.path, ...(options.useGuards || []).map(it => createGuard(ctrl, it)), (req, res, next) => {
                const { headers, query, body, method, url } = req;
                const buf = multihash.encode(Buffer.from(JSON.stringify({ headers, query, body, method, url })), `sha2-256`);
                const cid = createCid(buf);
                ctrl.injector.setStatic([{
                    provide: REQUEST_ID,
                    useValue: cid
                }, {
                    provide: REQUEST,
                    useValue: req
                }, {
                    provide: RESPONSE,
                    useValue: res
                }, {
                    provide: NEXT,
                    useValue: next
                }]);
                router(req, res, next)
            });
        }
    }
}