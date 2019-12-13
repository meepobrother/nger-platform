import {
    corePlatform, Injector,
    InjectFlags, AppToken, HttpMethodHandler,
    RouterToken, createPlatformFactory, APP_INITIALIZER, NgModuleRef,
    Logger, Config, ClassHandler
} from '@nger/core';
import { decoratorProviders } from './handlers';
import { IMethodDecorator, IClassDecorator } from '@nger/decorator';
import express from 'express';
import bodyParser from 'body-parser';
import { responseHandler } from './response.handler'
import { loggerProvider } from './logger';
import { EnvConfig } from './config';
export const expressPlatform = createPlatformFactory(corePlatform, 'express', [
    ...decoratorProviders,
    responseHandler,
    loggerProvider,
    {
        provide: Config,
        useClass: EnvConfig
    },
    {
        provide: APP_INITIALIZER,
        useFactory: (injector: Injector) => {
            return async () => {
                return new Promise((resolve, reject) => {
                    const ref = injector.get(NgModuleRef);
                    const logger = injector.get(Logger);
                    const config = injector.get(Config);
                    const app = express();
                    app.use(bodyParser.urlencoded({ extended: false }));
                    app.use(bodyParser.json());
                    ref.controllers.map(ctrl => {
                        const instance = ctrl.create();
                        const router = express.Router();
                        ctrl.injector.setStatic([{ provide: RouterToken, useValue: router }, { provide: AppToken, useValue: app }])
                        ctrl.metadata.methods.map((it: IMethodDecorator<any, any>) => {
                            if (it.metadataKey) {
                                const handler = ctrl.injector.get<HttpMethodHandler>(it.metadataKey, null, InjectFlags.Optional);
                                if (handler) handler(instance, ctrl, it)
                            }
                        });
                        ctrl.metadata.classes.map((it: IClassDecorator<any, any>) => {
                            const handler = ctrl.injector.get<ClassHandler<any, any>>(it.metadataKey)
                            if (handler) handler(ctrl, it)
                        });
                    });
                    const port = config.get('PORT', 9000)
                    app.listen(port, `0.0.0.0`, () => {
                        logger.log(`app start at http://0.0.0.0:${port}`, 'core')
                        resolve()
                    });
                    return app;
                })
            }
        },
        deps: [Injector],
        multi: true
    }
])