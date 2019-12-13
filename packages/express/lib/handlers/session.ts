import { StaticProvider, Injector } from "@nger/di";
import { SessionMetadataKey, ParameterHandler, RequestToken } from "@nger/core";
import { IParameterDecorator } from '@nger/decorator';
import { Request } from 'express';
const handler: ParameterHandler<any, any> = (handler: Function, parameters: Array<any>, instance: any, injector: Injector, parameter: IParameterDecorator<any, any>) => {
    const req = injector.get<Request>(RequestToken);
    const val = Reflect.get(req, 'session')
    Reflect.set(parameters, parameter.parameterIndex, val)
}
export const sessionProvider: StaticProvider = {
    provide: SessionMetadataKey,
    useValue: handler
}