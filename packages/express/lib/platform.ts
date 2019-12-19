import {
    Injector, InjectFlags, APP_ID, ControllerMethodHandler,
    ROUTER, createPlatformFactory, APP_INITIALIZER, NgModuleRef,
    Config, ControllerFactory, PLATFORM_INITIALIZER, ControllerClassHandler
} from '@nger/core';
import { decoratorProviders } from './handlers';
import { IMethodDecorator, IClassDecorator } from '@nger/decorator';
import express from 'express';
import bodyParser from 'body-parser';
import { responseHandler } from './response.handler'
import { platformNode } from '@nger/platform.node';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import cookieSession from 'cookie-session';
import serveFavicon from 'serve-favicon';
import compression from 'compression';
import { join } from 'path';
import { HttpControllerToken } from './handlers/controller';
export const expressPlatform = createPlatformFactory(platformNode, 'express', [
    ...decoratorProviders,
    responseHandler,
    {
        provide: PLATFORM_INITIALIZER,
        useFactory: (injector: Injector) => {
            return () => {
                const config = injector.get(Config);
                const app = express();
                app.use(bodyParser.urlencoded({ extended: false }));
                app.use(bodyParser.json());
                app.use(cors());
                app.use(cookieParser(config.get('COOKIE_SECRET', `cookie secret`)));
                app.use(cookieSession({
                    name: 'session',
                    keys: [`key1`, `key2`],
                    secret: config.get(`SESSION_SECRET`, 'session secret'),
                    maxAge: 2 * 3600 * 1000
                }));
                app.use(compression())
                app.use(serveFavicon(join(__dirname, 'favicon.ico')));
                injector.setStatic([{
                    provide: APP_ID,
                    useValue: app
                }])
            }
        },
        deps: [
            Injector
        ],
        multi: true
    },
    {
        provide: APP_INITIALIZER,
        useFactory: (injector: Injector) => {
            return async () => {
                const ref = injector.get(NgModuleRef);
                ref.controllers.map((ctrl: ControllerFactory<any>) => {
                    const router = express.Router();
                    ctrl.injector.setStatic([{ provide: ROUTER, useValue: router }])
                    ctrl.metadata.methods.map((it: IMethodDecorator<any, any>) => {
                        if (it.metadataKey) {
                            const handler = ctrl.injector.get<ControllerMethodHandler>(it.metadataKey, null, InjectFlags.Optional);
                            if (handler) handler(ctrl, it)
                        }
                    });
                    ctrl.metadata.classes.map((it: IClassDecorator<any, any>) => {
                        const handler = ctrl.injector.get<ControllerClassHandler<any, any>>(HttpControllerToken)
                        if (handler) handler(ctrl, it)
                    });
                });
            }
        },
        deps: [Injector],
        multi: true
    }
])
