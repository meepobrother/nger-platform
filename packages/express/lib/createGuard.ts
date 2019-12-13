import express from 'express';
import { Type, ControllerFactory, isCanLoad, isCanActivate } from '@nger/core';
export function createGuard(ctrl: ControllerFactory<any>, it: Type<any>) {
    return (req: express.Request, res: express.Response, next: express.NextFunction) => {
        const guard = ctrl.injector.get(it);
        if (isCanActivate(guard) || isCanLoad(guard)) {
            if (isCanActivate(guard)) {
                if (guard.canActivate(ctrl.injector)) {
                    next();
                } else {
                    res.status(403).send(`Forbidden`)
                }
            }
            if (isCanLoad(guard)) {
                if (guard.canLoad(ctrl.injector)) {
                    next();
                } else {
                    res.status(403).send(`Forbidden`)
                }
            }
        } else {
            next();
        }
    }
}