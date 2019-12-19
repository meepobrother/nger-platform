import { Request, Response, NextFunction } from 'express';
import { createCid } from "../util";
import { Injector } from '@nger/di';
import { REQUEST_ID, REQUEST, RESPONSE, NEXT } from '@nger/core';

export interface HttpResponseHandler<T = any> {
    (instance: T, injector: Injector): any;
}
const multihash = require('multihashes')
export function appendReq(req: Request, res: Response, next: NextFunction, injector: Injector) {
    const { headers, query, body, method, url } = req;
    const buf = multihash.encode(Buffer.from(JSON.stringify({ headers, query, body, method, url })), `sha2-256`);
    const cid = createCid(buf);
    injector.setStatic([{
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
}