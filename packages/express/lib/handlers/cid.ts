import { StaticProvider, Injector } from "@nger/di";
import { CidMetadataKey, ParameterHandler, RequestToken } from "@nger/core";
import { IParameterDecorator } from '@nger/decorator';
import { Request } from 'express';
import { createCid } from "./util";
const multihash = require('multihashes')
const handler: ParameterHandler<any, any> = (handler: Function, parameters: Array<any>, instance: any, injector: Injector, parameter: IParameterDecorator<any, any>) => {
    const req = injector.get<Request>(RequestToken);
    const { headers, query, body, method, url } = req;
    const buf = multihash.encode(Buffer.from(JSON.stringify({ headers, query, body, method, url })), `sha2-256`);
    const cid = createCid(buf);
    Reflect.set(parameters, parameter.parameterIndex, cid);
}
export const cidProvider: StaticProvider = {
    provide: CidMetadataKey,
    useValue: handler
}