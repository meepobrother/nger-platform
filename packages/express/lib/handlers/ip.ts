import { StaticProvider, Injector } from "@nger/di";
import { IpMetadataKey, ParameterHandler, REQUEST } from "@nger/core";
import { IParameterDecorator } from '@nger/decorator';
import { Request } from 'express';
const handler: ParameterHandler<any, any> = (handler: Function, parameters: Array<any>, instance: any, injector: Injector, parameter: IParameterDecorator<any, any>) => {
    const req = injector.get<Request>(REQUEST);
    const val = Reflect.get(req, 'ip')
    Reflect.set(parameters, parameter.parameterIndex, val)
}
export const ipProvider: StaticProvider = {
    provide: IpMetadataKey,
    useValue: handler
}