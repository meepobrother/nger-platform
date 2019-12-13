import { Request, Response, NextFunction } from 'express';
import { createCid } from "../util";
import { Injector } from '@nger/di';
import { RequestId, RequestToken, ResponseToken, NextToken } from '@nger/core';
const multihash = require('multihashes')
export function appendReq(req: Request, res: Response, next: NextFunction, injector: Injector) {
    const { headers, query, body, method, url } = req;
    const buf = multihash.encode(Buffer.from(JSON.stringify({ headers, query, body, method, url })), `sha2-256`);
    const cid = createCid(buf);
    injector.setStatic([{
        provide: RequestId,
        useValue: cid
    }, {
        provide: RequestToken,
        useValue: req
    }, {
        provide: ResponseToken,
        useValue: res
    }, {
        provide: NextToken,
        useValue: next
    }]);
}